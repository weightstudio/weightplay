import { Vector3, Quaternion } from './vendor/three.module.min.js';

export const TUNING = Object.freeze({step:1/60,maxSteps:8,speed:6,acceleration:30,deceleration:36,gravity:20,jump:8,coyote:.12,buffer:.12,airControl:.6,dashSpeed:8.5,dashDuration:.16,dashCooldown:.8,radius:.28,height:1.25});
const V = value => value?.isVector3 ? value.clone() : new Vector3(...value);
export function tangent(vector, up, fallback = new Vector3(0,0,-1)) {
  const result=vector.clone().addScaledVector(up,-vector.dot(up));
  if(result.lengthSq()<1e-8){result.copy(fallback).addScaledVector(up,-fallback.dot(up));
    if(result.lengthSq()<1e-8)result.crossVectors(up,Math.abs(up.x)<.8?new Vector3(1,0,0):new Vector3(0,0,1));}
  return result.normalize();
}
export function transport(vector,from,to){return tangent(vector.clone().applyQuaternion(new Quaternion().setFromUnitVectors(from,to)),to,vector);}

export class GravityResolver {
  constructor(fields,initial){this.fields=new Map(fields.map(f=>[f.id,f]));this.active=initial;if(!this.fields.has(initial))throw Error('Unknown initial gravity field');}
  field(){return this.fields.get(this.active);}
  up(position){const f=this.field();return f.kind==='plane'?V(f.up).normalize():position.clone().sub(V(f.center)).normalize();}
  commit(id){if(!this.fields.has(id))throw Error('Unknown destination gravity field');this.active=id;}
}

export class CharacterMotor {
  constructor({fields,start,fieldId,boxes=[],assist=false}){
    this.gravity=new GravityResolver(fields,fieldId);this.position=V(start);this.previous=this.position.clone();this.velocity=new Vector3();this.up=this.gravity.up(this.position);this.forward=tangent(new Vector3(0,0,-1),this.up);this.boxes=boxes;
    this.state='Grounded';this.grounded=true;this.coyote=TUNING.coyote;this.buffer=0;this.dashLeft=0;this.dashCooldown=0;this.airDash=true;this.dashDirection=this.forward.clone();this.transit=null;this.clock=0;this.assist=assist;this.health=assist?7:5;this.invincible=0;this.falls=0;this.landings=0;this.events=[];this.checkpoint={fieldId,position:[...start]};this.accumulator=0;this.elapsed=0;
    this.support=null;this.supportVelocity=new Vector3();this.beforeStep=null;
  }
  emit(type,detail={}){this.events.push({type,...detail});}
  drainEvents(){return this.events.splice(0);}
  setCheckpoint(snapshot){this.checkpoint=structuredClone(snapshot);this.emit('checkpoint');}
  movePlatform(box,center,quaternion,dt){
    const oldCenter=V(box.center),oldRotation=box.quaternion?.isQuaternion?box.quaternion.clone():new Quaternion(...(box.quaternion??[0,0,0,1]));
    const nextCenter=V(center),nextRotation=quaternion?.isQuaternion?quaternion.clone():new Quaternion(...quaternion);
    if(this.support===box&&this.grounded&&!this.transit){
      const previous=this.position.clone(),rotation=nextRotation.clone().multiply(oldRotation.clone().invert());
      this.position.sub(oldCenter).applyQuaternion(rotation).add(nextCenter);
      this.velocity.applyQuaternion(rotation);this.forward.applyQuaternion(rotation);
      this.up.copy(this.gravity.up(this.position));this.forward.copy(tangent(this.forward,this.up));
      this.supportVelocity.copy(this.position).sub(previous).divideScalar(Math.max(dt,1e-6));
    }
    box.center=nextCenter.toArray();box.quaternion=nextRotation.toArray();
  }
  respawn({fall=true}={}){this.state='Respawning';this.support=null;this.supportVelocity.set(0,0,0);if(fall){this.falls++;if(!this.assist)this.health--;}if(this.health<=0)this.health=this.assist?7:5;this.gravity.commit(this.checkpoint.fieldId);this.position.copy(V(this.checkpoint.position));this.previous.copy(this.position);this.velocity.set(0,0,0);this.up.copy(this.gravity.up(this.position));this.forward.copy(tangent(this.forward,this.up));this.dashLeft=0;this.buffer=0;this.transit=null;this.grounded=true;this.airDash=true;this.invincible=1.2;this.state='Grounded';this.emit('respawn');}
  damage(){if(this.invincible>0||this.transit)return false;this.health--;this.invincible=1.2;this.state='Hurt';this.emit('hurt');if(this.health<=0)this.respawn({fall:false});return true;}
  beginTransit(route){
    if(this.transit||!route?.powered||!route?.unlocked||!route?.clear||!route?.safe||route.from!==this.gravity.active)return false;
    const destination=V(route.destination);if(this.position.distanceTo(V(route.source))>route.range)return false;
    const endField=this.gravity.fields.get(route.to);if(!endField)return false;
    const endUp=endField.kind==='plane'?V(endField.up).normalize():destination.clone().sub(V(endField.center)).normalize();
    this.transit={id:route.id,from:this.position.clone(),to:destination,sourceUp:this.up.clone(),arcUp:V(route.arcUp??this.up),upRotation:new Quaternion().setFromUnitVectors(this.up,endUp),destinationField:route.to,time:0,duration:route.duration??1.1};this.velocity.set(0,0,0);this.support=null;this.supportVelocity.set(0,0,0);this.dashLeft=0;this.buffer=0;this.grounded=false;this.state='Transit';this.emit('transit-start',{route:route.id});return true;
  }
  advance(delta,input={}){
    if(input.jump)this.buffer=TUNING.buffer;
    if(input.dash)this.requestDash=true;
    this.accumulator=Math.min(this.accumulator+Math.max(0,Math.min(delta,.15)),TUNING.step*TUNING.maxSteps);
    let steps=0;while(this.accumulator+1e-10>=TUNING.step&&steps<TUNING.maxSteps){this.beforeStep?.(TUNING.step);this.step(TUNING.step,input);this.accumulator-=TUNING.step;steps++;}
    return steps;
  }
  step(dt,input={}){
    this.previous.copy(this.position);this.clock+=dt;this.elapsed+=dt;this.invincible=Math.max(0,this.invincible-dt);this.dashCooldown=Math.max(0,this.dashCooldown-dt);const priorSupport=this.support,departureVelocity=this.supportVelocity.clone();let jumped=false;
    if(this.transit){const tr=this.transit;tr.time+=dt;const t=Math.min(1,tr.time/tr.duration),e=t*t*(3-2*t);this.position.lerpVectors(tr.from,tr.to,e).addScaledVector(tr.arcUp,Math.sin(Math.PI*t)*2.1);const prior=this.up.clone();this.up.copy(tr.sourceUp).applyQuaternion(new Quaternion().slerp(tr.upRotation,e));this.forward.copy(transport(this.forward,prior,this.up));
      if(t>=1){const old=this.up.clone();this.gravity.commit(tr.destinationField);this.up.copy(this.gravity.up(this.position));this.forward.copy(transport(this.forward,old,this.up));this.velocity.set(0,0,0);this.transit=null;this.grounded=true;this.airDash=true;this.state='Grounded';this.coyote=TUNING.coyote;this.emit('transit-land');}return;}
    const oldUp=this.up.clone();this.up.copy(this.gravity.up(this.position));this.forward.copy(transport(this.forward,oldUp,this.up));
    this.coyote=this.grounded?TUNING.coyote:Math.max(0,this.coyote-dt);
    const wish=input.direction?V(input.direction):new Vector3();wish.addScaledVector(this.up,-wish.dot(this.up));if(wish.lengthSq()>1)wish.normalize();
    if(wish.lengthSq()>.001)this.forward.copy(wish).normalize();
    let vertical=this.velocity.dot(this.up),horizontal=this.velocity.clone().addScaledVector(this.up,-vertical);
    const target=wish.multiplyScalar(TUNING.speed),difference=target.sub(horizontal),accel=(difference.lengthSq()<horizontal.lengthSq()?TUNING.deceleration:TUNING.acceleration)*(this.grounded?1:TUNING.airControl)*dt;
    if(difference.length()>accel)difference.setLength(accel);horizontal.add(difference);
    if(this.buffer>0&&this.coyote>0){jumped=true;vertical=TUNING.jump;horizontal.add(this.supportVelocity.clone().addScaledVector(this.up,-this.supportVelocity.dot(this.up)));vertical+=this.supportVelocity.dot(this.up);this.support=null;this.supportVelocity.set(0,0,0);this.grounded=false;this.coyote=0;this.buffer=0;this.state='Airborne';this.emit('jump');}
    this.buffer=Math.max(0,this.buffer-dt);
    if(!input.jumpHeld&&vertical>3.5)vertical=Math.max(3.5,vertical-40*dt);
    if(this.requestDash){if(this.dashCooldown<=0&&(this.grounded||this.airDash)){
      this.dashDirection.copy(horizontal.lengthSq()>.01?horizontal:this.forward).normalize();this.dashLeft=TUNING.dashDuration;this.dashCooldown=TUNING.dashCooldown;if(!this.grounded)this.airDash=false;this.emit('dash');}this.requestDash=false;}
    if(this.dashLeft>0){horizontal.copy(this.dashDirection).multiplyScalar(TUNING.dashSpeed);this.dashLeft=Math.max(0,this.dashLeft-dt);this.state='Dashing';}
    vertical-=TUNING.gravity*dt;this.velocity.copy(horizontal).addScaledVector(this.up,vertical);
    const distance=this.velocity.length()*dt,parts=Math.max(1,Math.ceil(distance/.10)),partDt=dt/parts;let support=false;this.contactSupport=null;
    for(let i=0;i<parts;i++){this.position.addScaledVector(this.velocity,partDt);support=this.collide()||support;}
    const landed=support&&!this.grounded&&vertical<=0;
    this.grounded=support&&this.velocity.dot(this.up)<.1;
    if(priorSupport&&!this.grounded&&!jumped)this.velocity.add(departureVelocity);
    this.support=this.grounded?this.contactSupport:null;if(!this.support)this.supportVelocity.set(0,0,0);
    if(landed){this.airDash=true;this.landings++;this.emit('land');}
    if(this.dashLeft<=0)this.state=this.grounded?'Grounded':'Airborne';
    const field=this.gravity.field();if(field.kind==='sphere'&&this.position.distanceTo(V(field.center))>field.radius+16)this.respawn();
    if(!Number.isFinite(this.position.lengthSq()))throw Error('MOTOR_NON_FINITE');
  }
  collide(){
    let supported=false;const field=this.gravity.field(),up=this.gravity.up(this.position);this.up.copy(up);
    if(field.kind==='sphere'){
      const delta=this.position.clone().sub(V(field.center)),r=delta.length();
      if(r<field.radius){this.position.copy(V(field.center)).addScaledVector(up,field.radius);const inward=this.velocity.dot(up);if(inward<0)this.velocity.addScaledVector(up,-inward);supported=true;}
    }else{
      const h=this.position.clone().sub(V(field.point)).dot(up);if(h<0){this.position.addScaledVector(up,-h);const inward=this.velocity.dot(up);if(inward<0)this.velocity.addScaledVector(up,-inward);supported=true;}
    }
    // Three overlapping swept sphere samples approximate an up-oriented capsule.
    // Movement is subdivided to <=0.10 units, including dash, before each solve.
    for(const box of this.boxes){if(box.enabled===false||box.fieldId&&box.fieldId!==this.gravity.active)continue;
      const rotation=box.quaternion?.isQuaternion?box.quaternion:new Quaternion(...(box.quaternion??[0,0,0,1])),inverse=rotation.clone().invert(),center=V(box.center),half=V(box.half);
      for(const offset of [TUNING.radius,.64,TUNING.height-TUNING.radius]){
        const local=this.position.clone().addScaledVector(up,offset).sub(center).applyQuaternion(inverse),closest=local.clone().clamp(half.clone().negate(),half),delta=local.clone().sub(closest);let length=delta.length(),penetration=TUNING.radius-length;
        if(penetration<=0)continue;
        if(length<1e-8){const margins=[half.x-Math.abs(local.x),half.y-Math.abs(local.y),half.z-Math.abs(local.z)],axis=margins.indexOf(Math.min(...margins));delta.set(0,0,0);delta.setComponent(axis,local.getComponent(axis)>=0?1:-1);penetration=TUNING.radius+margins[axis];}else delta.divideScalar(length);
        delta.applyQuaternion(rotation);this.position.addScaledVector(delta,penetration+1e-5);const into=this.velocity.dot(delta);if(into<0)this.velocity.addScaledVector(delta,-into);if(delta.dot(up)>.65&&into<=0){supported=true;this.contactSupport=box;}
      }
    }return supported;
  }
  snapshot(){return {fieldId:this.gravity.active,position:this.position.toArray(),up:this.up.toArray(),velocity:this.velocity.toArray(),state:this.state,grounded:this.grounded,airDash:this.airDash,health:this.health,falls:this.falls,landings:this.landings};}
}
