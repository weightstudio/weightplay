import {TABLES,ITEMS} from './campaign.mjs';
export const STORE='weightplay:nori-bankshot:v1';
export const FIELD=Object.freeze({x:4.5,z:7,r:.34,pocket:.68});
export const POCKETS=Object.freeze([[-4.5,-7],[4.5,-7],[4.5,7],[-4.5,7],[-4.5,0],[4.5,0]]);
const finite=(n,f=0)=>Number.isFinite(Number(n))?Number(n):f;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const integer=(n,a,b)=>clamp(Math.floor(finite(n,a)),a,b);
export function normalize(raw={},diamondOwned=false){
 const records={};for(const t of TABLES){const r=raw?.records?.[t.id];if(r&&Number.isInteger(r.shots)&&r.shots>0&&r.shots<=t.shots&&r.stars>=1&&r.stars<=3)records[t.id]={shots:r.shots,stars:integer(r.stars,1,3)};}
 let unlocked=1;while(records[unlocked]&&unlocked<TABLES.length)unlocked++;
 const owned=['harbor',...ITEMS.filter(i=>i.currency==='stamp'&&i.id!=='harbor'&&raw?.owned?.includes(i.id)).map(i=>i.id)];
 // Never erase valid records; reconcile malformed purchases only when their earned cost is impossible.
 let spent=owned.reduce((n,id)=>n+(ITEMS.find(i=>i.id===id)?.cost||0),0);
 while(spent>Object.keys(records).length&&owned.length>1){const id=owned.pop();spent-=ITEMS.find(i=>i.id===id).cost;}
 return {schema:1,records,unlocked,owned,equipped:owned.includes(raw?.equipped)||(diamondOwned&&raw?.equipped==='seaglass')?raw.equipped:'harbor',tutorial:raw?.tutorial===true};
}
export class Collection{
 constructor(raw,diamondOwned=false){this.s=normalize(raw,diamondOwned);this.diamondOwned=diamondOwned;}
 get clears(){return Object.keys(this.s.records).length;}
 get stars(){return Object.values(this.s.records).reduce((n,x)=>n+x.stars,0);}
 get stamps(){return this.clears-this.s.owned.reduce((n,id)=>n+(ITEMS.find(x=>x.id===id)?.cost||0),0);}
 owns(id){return this.s.owned.includes(id)||(id==='seaglass'&&this.diamondOwned);}
 select(id){if(!this.owns(id))return false;this.s.equipped=id;return true;}
 buy(id){const item=ITEMS.find(x=>x.id===id);if(!item||item.currency!=='stamp'||this.owns(id)||this.clears<item.unlock||this.stamps<item.cost)return false;this.s.owned.push(id);this.s.equipped=id;return true;}
 record(id,shots){const t=TABLES[id-1];if(!t||!Number.isInteger(shots)||shots<1||shots>t.shots)return null;const stars=shots<t.par?3:shots<=t.par?2:1,first=!this.s.records[id],old=this.s.records[id];if(!old||shots<old.shots)this.s.records[id]={shots,stars};this.s.unlocked=Math.min(TABLES.length,Math.max(this.s.unlocked,id+1));return {first,stars,stamps:first?1:0};}
}
export class Table{
 constructor(def){this.def=def;this.turn=0;this.group=0;this.events=[];this.elapsed=0;this.accumulator=0;this.moving=false;this.outcome=null;this.potted=0;this.fouls=0;this.gateOpen=!def.open;this.open=[...(def.open||[0,1,2,3,4,5])];this.pending=[];this.cue={id:'cue',x:def.cue[0],z:def.cue[1],vx:0,vz:0,kind:'cue',active:true,bank:false};this.balls=[this.cue];this.addGroup();}
 addGroup(){this.balls=this.balls.filter(b=>b.id==='cue');this.balls.push(...this.def.groups[this.group].map(b=>({...b,x:b.x,z:b.z,home:[b.x,b.z],vx:0,vz:0,active:true,bank:false})));if(this.def.relaySides&&this.group===1)this.open=[4,5];if(this.def.tide&&this.group===1)this.open=[4,5];if(this.def.tide&&this.group===2)this.open=[0,1,2,3,4,5];}
 get remaining(){return this.balls.filter(b=>b.kind!=='cue'&&b.active).length+this.pending.filter(b=>b.kind!=='cue').length;}
 get total(){return this.def.groups.reduce((n,g)=>n+g.length,0);}
 get nextOrder(){const nums=[...this.balls.filter(b=>b.active),...this.pending].filter(b=>b.kind!=='cue'&&b.order>0).map(b=>b.order);return nums.length?Math.min(...nums):0;}
 get target(){return this.balls.find(b=>b.active&&b.kind!=='cue'&&(!b.order||b.order===this.nextOrder)&&(!b.kind.startsWith('lantern')||!this.balls.some(x=>x.active&&x.kind!=='cue'&&!x.kind.startsWith('lantern'))));}
 emit(type,data={}){this.events.push({type,...data});}
 drain(){const e=this.events;this.events=[];return e;}
 shoot(angle,power){if(this.moving||this.outcome||!this.cue.active||!Number.isFinite(angle)||!Number.isFinite(power))return false;this.turn++;this.moving=true;this.elapsed=0;this.accumulator=0;for(const b of this.balls)b.bank=false;const v=5+clamp(power,.05,1)*16;this.cue.vx=Math.sin(angle)*v;this.cue.vz=-Math.cos(angle)*v;this.emit('shot',{x:this.cue.x,z:this.cue.z});return true;}
 update(dt){if(!this.moving||this.outcome)return;this.accumulator+=clamp(finite(dt),0,.06);let steps=0;while(this.accumulator>=1/240&&steps++<16){this.step(1/240);this.accumulator-=1/240;if(!this.moving)break;}}
 step(dt){
  this.elapsed+=dt;const r=FIELD.r;let remaining=dt;
  const advance=t=>{const decay=Math.exp(-1.05*t);for(const b of this.balls)if(b.active){b.x+=b.vx*t;b.z+=b.vz*t;b.vx*=decay;b.vz*=decay;}};
  // Resolve first contact at its time of impact. End-of-step overlap normals
  // made a fast thin cut leave at a different angle from the aim ray.
  const circleTime=(dx,dz,vx,vz,radius)=>{const q=dx*dx+dz*dz-radius*radius,dot=dx*vx+dz*vz,v=vx*vx+vz*vz;if(q<=1e-9)return dot<-1e-9?0:null;if(v<1e-12||dot>=0)return null;const disc=dot*dot-v*q;return disc>=0?(-dot-Math.sqrt(disc))/v:null;};
  for(let n=0;remaining>1e-9&&n<24;n++){
   let event=null,first=remaining;const offer=(time,type,data)=>{if(time!==null&&time>=-1e-9&&time<=first){first=Math.max(0,time);event={type,...data};}};
   const active=this.balls.filter(b=>b.active);
   for(let i=0;i<active.length;i++)for(let j=i+1;j<active.length;j++){const a=active[i],b=active[j];offer(circleTime(b.x-a.x,b.z-a.z,b.vx-a.vx,b.vz-a.vz,2*r),'contact',{a,b});}
   for(const b of active){
    for(const axis of ['x','z'])if(Math.abs(b['v'+axis])>1e-10){const bound=(FIELD[axis]-r)*Math.sign(b['v'+axis]);offer((bound-b[axis])/b['v'+axis],'bank',{b,axis,bound});}
    for(const pocket of this.open){const p=POCKETS[pocket];offer(circleTime(b.x-p[0],b.z-p[1],b.vx,b.vz,FIELD.pocket),'pot',{b,pocket});}
   }
   advance(first);remaining-=first;if(!event)break;
   if(event.type==='pot'){this.pot(event.b,event.pocket);continue;}
   if(event.type==='bank'){const {b,axis,bound}=event;b[axis]=bound;b['v'+axis]*=-.88;b.bank=true;this.emit('bank',{id:b.id,x:b.x,z:b.z,speed:Math.hypot(b.vx,b.vz)});continue;}
   const {a,b}=event;let dx=b.x-a.x,dz=b.z-a.z,d=Math.hypot(dx,dz);if(d<1e-9){dx=1;dz=0;d=1;}const nx=dx/d,nz=dz/d,overlap=Math.max(0,(2*r-d)/2);a.x-=nx*overlap;a.z-=nz*overlap;b.x+=nx*overlap;b.z+=nz*overlap;
   const relative=(a.vx-b.vx)*nx+(a.vz-b.vz)*nz;if(relative>0){const impulse=relative*.985;a.vx-=impulse*nx;a.vz-=impulse*nz;b.vx+=impulse*nx;b.vz+=impulse*nz;this.emit('contact',{x:(a.x+b.x)/2,z:(a.z+b.z)/2,speed:relative});}
  }
  if(remaining>1e-9)advance(remaining);
  for(const b of this.balls)if(Math.hypot(b.vx,b.vz)<.12){b.vx=0;b.vz=0;}
  if(this.elapsed>=8||!this.balls.some(b=>b.active&&(b.vx||b.vz))){for(const b of this.balls){b.vx=0;b.vz=0;}this.settle();}
 }
 pot(b,pocket){
  if(!b.active)return;let reason='';
  if(b.kind==='cue')reason='scratch';
  else if(b.kind.startsWith('lantern')&&[...this.balls.filter(x=>x.active),...this.pending].some(x=>x.kind!=='cue'&&!x.kind.startsWith('lantern')))reason='lastBall';
  else if(b.order&&b.order!==this.nextOrder)reason='wrongOrder';
  else if(b.kind.includes('bank')&&!b.bank)reason='needBank';
  b.active=false;b.vx=0;b.vz=0;
  if(reason){this.pending.push(b);this.fouls++;this.emit('foul',{id:b.id,reason,x:b.x,z:b.z,pocket});}
  else{this.potted++;this.emit('pot',{id:b.id,x:b.x,z:b.z,pocket,kind:b.kind});if(b.kind==='key'){this.gateOpen=true;this.open=[0,1,2,3,4,5];this.emit('unlock');}}
 }
 freeSpot(wanted){const occupied=this.balls.filter(b=>b.active);for(let n=0;n<220;n++){const radius=.18*Math.ceil(n/12),a=n*2.39996,x=clamp(wanted[0]+Math.sin(a)*radius,-3.9,3.9),z=clamp(wanted[1]+Math.cos(a)*radius,-6.4,6.4);if(!occupied.some(b=>Math.hypot(b.x-x,b.z-z)<FIELD.r*2+.08))return [x,z];}return [0,5.8];}
 settle(){
  this.moving=false;for(const b of this.pending){const p=this.freeSpot(b.kind==='cue'?this.def.cue:b.home);b.x=p[0];b.z=p[1];b.active=true;b.bank=false;this.emit('respawn',{id:b.id,x:b.x,z:b.z});}this.pending=[];
  if(!this.balls.some(b=>b.active&&b.kind!=='cue')){if(this.group+1<this.def.groups.length){this.group++;this.addGroup();this.emit('relay',{group:this.group+1});}else{this.outcome='clear';this.emit('clear');}}
  if(!this.outcome&&this.turn>=this.def.shots){this.outcome='fail';this.emit('fail');}if(!this.outcome)this.emit('ready');
 }
}
