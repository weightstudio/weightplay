/** Pawflow v1: deterministic simulation. No DOM, randomness, wall clock or renderer. */
export const RULES = Object.freeze({ size:10, belt:4, reserve:5, hz:60, nodesPerSecond:10, launchTicks:12 });
export const clone = value => structuredClone(value);
const emit = (s, event) => { if (s.events.length < 96) s.events.push(event); };
export function capture(s) {
  const {events, previous, ...rest}=s;
  return clone(rest);
}
export function createState(level) {
  const board=clone(level.board), queues=[[],[],[]];
  for (const [i,u] of (level.supply||[]).entries()) queues[i%3].push(clone(u));
  const totalHP=board.reduce((a,c)=>a+c.reduce((b,v)=>b+v.hp,0),0);
  return {version:1,levelId:level.id,signature:level.signature||'',board,queues,
    active:[],reserve:Array(RULES.reserve).fill(null),ticks:0,lastLaunch:-RULES.launchTicks,
    totalHP,leftHP:totalHP,keys:0,requiredKeys:level.requiredKeys||0,
    shutters:Boolean(level.shutters),gateTicks:level.gateTicks||150,phaseOffset:level.phaseOffset||0,
    reverse:Boolean(level.reverse),status:'running',reason:'',launches:0,emptyLaps:0,
    hintUsed:false,rewindUsed:false,rewindAllowed:level.id>=6,previous:null,events:[]};
}
export function gatePhase(s) { return Math.floor((s.ticks+s.phaseOffset)/s.gateTicks)%2; }
export function sideOpen(s, side) { return !s.shutters || side%2===gatePhase(s); }
export function ray(node, n=RULES.size) {
  const side=Math.floor(node/n), lane=node%n, result=[];
  for(let k=0;k<n;k++) {
    const x=side===0?k:side===1?lane:side===2?n-1-k:n-1-lane;
    const y=side===0?n-1-lane:side===1?k:side===2?lane:n-1-k;
    result.push(y*n+x);
  }
  return result;
}
export function target(s,node) {
  for(const index of ray(node)) if(s.board[index].length) return index;
  return -1;
}
export function unlocked(s,voxel) { return !voxel.lock || s.keys>=s.requiredKeys; }
export function actions(s) {
  return [...s.queues.flatMap((q,index)=>q[0]?[{source:'queue',index,unit:q[0]}]:[]),
    ...s.reserve.flatMap((unit,index)=>unit?[{source:'reserve',index,unit}]:[])];
}
export function dispatch(s, source, index, remember=true) {
  if(s.status!=='running') return {ok:false,reason:'notRunning'};
  if(s.active.length>=RULES.belt) return {ok:false,reason:'beltFull'};
  if(s.ticks-s.lastLaunch<RULES.launchTicks) return {ok:false,reason:'spacing'};
  if(!Number.isInteger(index) || index<0 || (source!=='queue'&&source!=='reserve')) return {ok:false,reason:'invalid'};
  const unit=source==='queue'?s.queues[index]?.[0]:s.reserve[index];
  if(!unit) return {ok:false,reason:'empty'};
  if(remember && !s.rewindUsed) s.previous=capture(s);
  if(source==='queue') s.queues[index].shift(); else s.reserve[index]=null;
  s.active.push({...unit,age:0,nextNode:0,hits:0});s.lastLaunch=s.ticks;s.launches++;
  emit(s,{type:'launch',id:unit.id,color:unit.color});return {ok:true,id:unit.id};
}
function hit(s,unit,node) {
  const side=Math.floor(node/RULES.size);
  if(!sideOpen(s,side)) return;
  const index=target(s,node);if(index<0) return;
  const voxel=s.board[index][0];
  if(voxel.color!==unit.color || !unlocked(s,voxel)) return;
  voxel.hp--;unit.ammo--;unit.hits++;s.leftHP--;
  const cleared=voxel.hp===0;
  if(cleared) {s.board[index].shift();if(voxel.key){s.keys++;emit(s,{type:'key',index});}}
  emit(s,{type:'hit',id:unit.id,index,color:unit.color,node,cleared,armor:!cleared});
  if(s.leftHP===0) {s.status='won';s.reason='clear';emit(s,{type:'win'});}
}
/** Ignore shutters here: future open sides must not be mistaken for a deadlock. */
export function canProgress(s) {
  const colors=new Set(actions(s).map(a=>a.unit.color));
  for(let node=0;node<4*RULES.size;node++) {
    const i=target(s,node),voxel=i<0?null:s.board[i][0];
    if(voxel && unlocked(s,voxel) && colors.has(voxel.color)) return true;
  }
  return false;
}
export function tick(s,{detectDeadlock=true}={}) {
  if(s.status!=='running') return;
  s.ticks++;
  for(const unit of [...s.active]) {
    if(s.status!=='running') break;
    unit.age++;
    const reached=Math.min(4*RULES.size-1,Math.floor(unit.age*RULES.nodesPerSecond/RULES.hz));
    while(unit.nextNode<=reached && unit.ammo>0 && s.status==='running') {
      let node=unit.nextNode++;
      if(s.reverse) node=4*RULES.size-1-node;
      hit(s,unit,node);
    }
    if(s.status!=='running') break;
    if(unit.ammo<=0) {s.active=s.active.filter(u=>u!==unit);emit(s,{type:'exit',id:unit.id});}
    else if(unit.age*RULES.nodesPerSecond/RULES.hz>=4*RULES.size) {
      s.active=s.active.filter(u=>u!==unit);
      if(!unit.hits) s.emptyLaps++;
      const slot=s.reserve.indexOf(null);
      if(slot<0) {s.active.push(unit);s.status='lost';s.reason='overflow';emit(s,{type:'lose',reason:s.reason});break;}
      s.reserve[slot]={id:unit.id,color:unit.color,ammo:unit.ammo};emit(s,{type:'park',id:unit.id,index:slot});
    }
  }
  if(detectDeadlock && s.status==='running' && !s.active.length && !canProgress(s)) {
    s.status='lost';s.reason='blocked';emit(s,{type:'lose',reason:s.reason});
  }
}
export function rewind(s) {
  if(s.status!=='running'||!s.rewindAllowed||s.rewindUsed||!s.previous) return false;
  const previous=clone(s.previous),hintUsed=s.hintUsed;
  for(const key of Object.keys(s)) delete s[key];
  Object.assign(s,previous,{hintUsed:hintUsed||previous.hintUsed,rewindUsed:true,previous:null,events:[{type:'rewind'}]});return true;
}
export function finishLap(s,detectDeadlock=true) {
  const budget=RULES.hz*(4*RULES.size/RULES.nodesPerSecond+1);
  for(let i=0;i<budget && s.active.length && s.status==='running';i++) tick(s,{detectDeadlock});
  return s;
}
export function preview(s,action) {
  if(s.active.length>=RULES.belt) return null;
  const copy={...capture(s),events:[],previous:null};
  // Preview begins after the SAME remaining launch cooldown, never bypasses it.
  while(copy.ticks-copy.lastLaunch<RULES.launchTicks && copy.status==='running') tick(copy,{detectDeadlock:false});
  if(!dispatch(copy,action.source,action.index,false).ok) return null;
  finishLap(copy,false);return {gain:s.leftHP-copy.leftHP,state:copy};
}
export function hint(s) {
  if(s.status!=='running') return null;
  s.hintUsed=true;
  if(s.active.length) return {wait:true};
  let best=null;
  for(const action of actions(s)) {
    const p=preview(s,action);if(!p||p.state.reason==='overflow')continue;
    if(!best || p.gain>best.gain || (p.gain===best.gain&&action.unit.ammo<best.unit.ammo)) best={...action,gain:p.gain};
  }
  return best?.gain>0?best:{wait:true};
}
export function stars(s,par) {return s.status==='won'?1+Number(s.launches<=par)+Number(s.launches<=par&&!s.hintUsed&&!s.rewindUsed):0;}
export function colorRemaining(s,color) {return s.board.reduce((sum,c)=>sum+c.reduce((n,v)=>n+(v.color===color?v.hp:0),0),0);}
export function assertState(s) {
  if(s.board.length!==100||s.queues.length!==3||s.reserve.length!==5||s.active.length>4)throw Error('STATE_GEOMETRY');
  const units=[...s.active,...s.reserve.filter(Boolean),...s.queues.flat()];
  if(new Set(units.map(u=>u.id)).size!==units.length)throw Error('DUPLICATE_COURIER');
  const hp=s.board.reduce((a,c)=>a+c.reduce((b,v)=>b+v.hp,0),0);
  if(hp!==s.leftHP||hp<0)throw Error('HP_CONSERVATION');
  for(let color=0;color<5;color++) {
    const ammo=units.filter(u=>u.color===color).reduce((a,u)=>a+u.ammo,0);
    if(ammo!==colorRemaining(s,color))throw Error(`AMMO_CONSERVATION:${color}:${ammo}`);
  }
  return true;
}
