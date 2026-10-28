// Stage 35 boss model candidate. It is not connected to the running game.
export function makeWarden(hp=360){
  if(!Number.isFinite(hp)||hp<=0)throw new RangeError('INVALID_WARDEN_HP');
  return {hp,maxHp:hp,shielded:true,beaconPulsed:false,sweep:null};
}
export function pulseWarden(previous){
  if(previous.beaconPulsed)return {state:previous,events:[]};
  return {state:{...previous,shielded:false,beaconPulsed:true},events:['shield-opened']};
}
export function hitWarden(previous,damage){
  if(!Number.isFinite(damage)||damage<0)throw new RangeError('INVALID_WARDEN_DAMAGE');
  if(previous.shielded||previous.hp<=0)return {state:previous,events:[]};
  const hp=Math.max(0,previous.hp-damage);
  return {state:{...previous,hp},events:hp===0?['warden-defeated']:[]};
}
export function warnRootSweep(previous,origin,target){
  if(previous.hp<=0||previous.sweep)throw new Error('WARDEN_SWEEP_UNAVAILABLE');
  const dx=target.x-origin.x,dy=target.y-origin.y,length=Math.hypot(dx,dy);
  if(!Number.isFinite(length)||length===0)throw new RangeError('INVALID_SWEEP_DIRECTION');
  return {...previous,sweep:{x:origin.x,y:origin.y,dx:dx/length,dy:dy/length,warn:1.5,life:2.5,width:120,length:600}};
}
export function tickRootSweep(previous,dt){
  if(!Number.isFinite(dt)||dt<0||dt>.25)throw new RangeError('INVALID_WARDEN_STEP');
  if(!previous.sweep)return previous;
  const sweep={...previous.sweep,warn:previous.sweep.warn-dt,life:previous.sweep.life-dt};
  return {...previous,sweep:sweep.life>0?sweep:null};
}
export function sweepHits(sweep,point){
  if(!sweep||sweep.warn>0||sweep.life<=0)return false;
  const x=point.x-sweep.x,y=point.y-sweep.y,along=x*sweep.dx+y*sweep.dy,across=Math.abs(-x*sweep.dy+y*sweep.dx);
  return along>=0&&along<=sweep.length&&across<=sweep.width/2;
}
