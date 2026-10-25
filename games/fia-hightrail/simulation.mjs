const copy=v=>JSON.parse(JSON.stringify(v));
export class Climb {
 constructor(level,kit='base',resume=null){
  this.level=level;this.kit=kit;this.time=0;this.position=level.start;this.energy=100;this.usedClips=0;this.pins=level.pins;this.pinned=[];this.flags=[];this.delivered=[];this.stamps=[];this.cargo=null;this.fragile={};this.dryUses=0;this.arrived=0;this.motion=null;this.status='playing';this.events=[];this.moves=0;
  this.checkpoint=this.snapshot();this.resumeRejected=Boolean(resume&&!this.restoreRun(resume));
 }
 node(){return this.level.nodes[this.position];}
 isSafe(id=this.position){return this.level.nodes[id]?.safe||this.pinned.includes(id);}
 cap(id=this.position){return this.level.nodes[id]?.cold?70:100;}
 emit(type,data={}){this.events.push({type,...data});}
 drainEvents(){return this.events.splice(0);}
 neighbors(){return this.level.edges.filter(e=>e.a===this.position||e.b===this.position).map(e=>({id:e.a===this.position?e.b:e.a,edge:e}));}
 calm(edge){return ((this.time+edge.phase)%6)<(this.kit==='wind'?4.4:3.6);}
 cost(edge){return edge.cost+(edge.wet&&!(this.kit==='dry'&&this.dryUses<2)?7:0)+(this.cargo!==null?4:0);}
 preview(id){const entry=this.neighbors().find(n=>n.id===id);if(!entry)return {ok:false,reason:'unreachable'};const {edge}=entry,cost=this.cost(edge);let reason=this.status!=='playing'?'finished':this.motion||this.catchMotion?'moving':edge.needs.some(x=>!this.flags.includes(x))?'anchorNeeded':this.fragile[id]!==undefined&&this.time-this.fragile[id]>=4?'crumbled':edge.wind&&!this.calm(edge)?'gust':cost>this.energy+.001?'lowEnergy':null;return {ok:!reason,reason,cost,edge,remaining:Math.max(0,this.energy-cost)};}
 move(id){const p=this.preview(id);if(!p.ok){this.emit('reject',{reason:p.reason});return false;}this.motion={from:this.position,to:id,elapsed:0,duration:p.edge.duration,cost:p.cost,wet:p.edge.wet};this.emit('start',{id});return true;}
 tick(delta){
  if(this.status!=='playing'||!Number.isFinite(delta)||delta<=0)return;
  // Caller supplies active foreground time only. Bounded stepping preserves exact timers.
  let remaining=Math.min(delta,5);while(remaining>1e-6&&this.status==='playing'){const dt=Math.min(.05,remaining);remaining-=dt;this.time+=dt;
   if(this.catchMotion){this.catchMotion.elapsed+=dt;if(this.catchMotion.elapsed>=this.catchMotion.duration)this.catchMotion=null;}
   else if(this.motion){const m=this.motion,part=Math.min(dt,m.duration-m.elapsed);this.energy=Math.max(0,this.energy-m.cost*part/m.duration);m.elapsed+=part;if(m.elapsed>=m.duration-1e-7){this.position=m.to;this.arrived=this.time;this.moves++;if(m.wet&&this.kit==='dry')this.dryUses++;this.motion=null;this.arrive();}}
   else if(this.isSafe()){this.energy=Math.min(this.cap(),this.energy+30*dt);}
   else{if(this.time-this.arrived>1.5)this.energy=Math.max(0,this.energy-4*dt);if(this.fragile[this.position]!==undefined&&this.time-this.fragile[this.position]>=4){this.fall('crumbled');continue;}if(this.energy<=0)this.fall('exhausted');}
  }
 }
 arrive(){const n=this.node();this.emit(this.isSafe()?'land':'grip');if(n.fragile&&this.fragile[n.id]===undefined)this.fragile[n.id]=this.time;
  if(n.stamp&&!this.stamps.includes(n.id)){this.stamps.push(n.id);this.emit('collect',{kind:'stamp'});}
  if(this.cargo!==null&&this.level.cargo[this.cargo].to===n.id){const id=this.cargo;this.delivered.push(id);this.cargo=null;this.emit('delivery',{id});}
  if(n.cargo!==undefined&&!this.delivered.includes(n.cargo)&&this.cargo===null){const item=this.level.cargo[n.cargo];if(item.needs.every(x=>this.flags.includes(x))){this.cargo=item.id;this.emit('collect',{kind:item.kind});}}
  if(this.isSafe()){this.checkpoint=this.snapshot();this.emit('checkpoint');}
  if(n.id===this.level.end){if(this.complete()){this.status='won';this.emit('win',{seals:[true,this.usedClips===0,this.stamps.length===this.level.stamps.length]});}else this.emit('reject',{reason:'taskMissing'});}
 }
 complete(){return this.level.cargo.every(c=>this.delivered.includes(c.id))&&this.level.anchors.every(a=>this.flags.includes(a));}
 anchor(){const n=this.node();if(this.motion||this.catchMotion||this.status!=='playing'||!n.anchor||this.flags.includes(n.anchor)||n.needs.some(x=>!this.flags.includes(x)))return false;this.flags.push(n.anchor);this.checkpoint=this.snapshot();this.emit('anchor',{flag:n.anchor});return true;}
 pin(){if(this.motion||this.catchMotion||this.status!=='playing'||this.pins<1||!this.node().pinSeat||this.isSafe())return false;this.pins--;this.pinned.push(this.position);delete this.fragile[this.position];this.checkpoint=this.snapshot();this.emit('pin');return true;}
 fall(reason){if(this.usedClips<(this.kit==='safety'?2:1)){const used=this.usedClips+1,from=this.position;this.restore(this.checkpoint);this.usedClips=used;this.energy=this.cap();this.arrived=this.time;this.catchMotion={from,elapsed:0,duration:.7};this.emit('catch',{reason});}else{this.status='lost';this.motion=null;this.emit('lose',{reason});}}
 snapshot(){return copy({position:this.position,energy:this.energy,pins:this.pins,pinned:this.pinned,flags:this.flags,delivered:this.delivered,stamps:this.stamps,cargo:this.cargo,fragile:this.fragile,dryUses:this.dryUses,moves:this.moves,time:this.time,arrived:this.arrived});}
 restore(s){Object.assign(this,copy(s));this.motion=null;this.catchMotion=null;this.status='playing';}
 runRecord(){return {schema:1,graph:this.level.revision,level:this.level.number,kit:this.kit,usedClips:this.usedClips,safe:copy(this.checkpoint)};}
 restoreRun(r){const s=r?.safe;if(r?.schema!==1||r.graph!==this.level.revision||r.level!==this.level.number||r.kit!==this.kit||!s||!this.level.nodes[s.position])return false;
  const domains={pinned:Object.values(this.level.nodes).filter(n=>n.pinSeat&&!n.safe).map(n=>n.id),flags:this.level.anchors,delivered:this.level.cargo.map(c=>c.id),stamps:this.level.stamps};
  for(const[k,valid]of Object.entries(domains))if(!Array.isArray(s[k])||s[k].some(v=>!valid.includes(v))||new Set(s[k]).size!==s[k].length)return false;
  if(!(this.level.nodes[s.position].safe||s.pinned.includes(s.position))||!Number.isFinite(s.energy)||s.energy<0||s.energy>100||!Number.isInteger(s.pins)||s.pins<0||s.pins+s.pinned.length!==this.level.pins||!Number.isInteger(s.dryUses)||s.dryUses<0||!Number.isInteger(s.moves)||s.moves<0||!Number.isFinite(s.time)||s.time<0||!Number.isFinite(s.arrived)||s.arrived<0||s.arrived>s.time||!Number.isInteger(r.usedClips)||r.usedClips<0||r.usedClips>(this.kit==='safety'?2:1))return false;
  if(s.cargo!==null&&(!this.level.cargo[s.cargo]||s.delivered.includes(s.cargo)))return false;
  if(!s.fragile||typeof s.fragile!=='object'||Array.isArray(s.fragile)||Object.entries(s.fragile).some(([id,time])=>!this.level.nodes[id]?.fragile||!Number.isFinite(time)||time<0||time>s.time))return false;
  const clean={};for(const key of Object.keys(this.snapshot()))clean[key]=s[key];this.restore(clean);this.usedClips=r.usedClips;this.energy=this.cap();this.checkpoint=this.snapshot();return true;}
}
