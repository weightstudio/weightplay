import {capture,createState,clone,assertState,stars} from './engine.mjs';
export const SAVE_KEY='weightplay.pawflow.v1';
const finite=(n,min,max)=>Number.isSafeInteger(n)&&n>=min&&n<=max;
export const emptyProgress=()=>({version:1,unlocked:1,stars:Array(30).fill(0),best:Array(30).fill(0),daily:[],attempt:null});
export function normalize(value){
 const p=emptyProgress();if(!value||value.version!==1)return p;
 for(let i=0;i<30;i++){p.stars[i]=finite(value.stars?.[i],0,3)?value.stars[i]:0;p.best[i]=finite(value.best?.[i],1,100000)?value.best[i]:0;}
 // Completed records recover unlocks even if an older save's counter was truncated.
 p.unlocked=Math.min(30,Math.max(1,finite(value.unlocked,1,30)?value.unlocked:1,p.stars.reduce((n,v,i)=>v?Math.max(n,i+2):n,1)));
 if(Array.isArray(value.daily))p.daily=value.daily.filter(x=>x&&/^\d{4}-\d{2}-\d{2}$/.test(x.key)&&finite(x.stars,0,3)&&finite(x.best,1,100000)).slice(-14).map(x=>({key:x.key,stars:x.stars,best:x.best}));
 if(value.attempt&&typeof value.attempt==='object')p.attempt=value.attempt;
 return p;
}
/** Strict reconstruction against authored data. Never trust serialized runtime objects. */
export function restoreState(raw,level,withPrevious=true){
 try{
  if(!raw||raw.version!==1||raw.levelId!==level.id||raw.signature!==level.signature||raw.status!=='running')return null;
  if(!Array.isArray(raw.board)||raw.board.length!==100||!Array.isArray(raw.queues)||raw.queues.length!==3||!Array.isArray(raw.reserve)||raw.reserve.length!==5||!Array.isArray(raw.active)||raw.active.length>4)return null;
  const s=createState(level);let removedKeys=0;
  s.board=raw.board.map((cell,i)=>{
   const original=level.board[i];if(!Array.isArray(cell)||cell.length>original.length)throw Error('BOARD');
   const offset=original.length-cell.length;removedKeys+=original.slice(0,offset).filter(v=>v.key).length;
   return cell.map((v,j)=>{const o=original[offset+j];if(!v||v.color!==o.color||v.key!==o.key||v.lock!==o.lock||!finite(v.hp,1,o.hp)||(j>0&&v.hp!==o.hp))throw Error('VOXEL');return {...o,hp:v.hp};});
  });
  const originals=new Map(level.supply.map(u=>[u.id,u])),used=new Set();
  const unit=(u,active=false)=>{
   const original=originals.get(u?.id);if(!original||used.has(u.id)||u.color!==original.color||!finite(u.ammo,1,original.ammo))throw Error('COURIER');used.add(u.id);
   const out={id:original.id,color:original.color,ammo:u.ammo};
   if(active){if(!finite(u.age,0,240)||!finite(u.nextNode,0,40)||!finite(u.hits,0,original.ammo)||u.nextNode>Math.floor(u.age/6)+1)throw Error('ACTIVE');Object.assign(out,{age:u.age,nextNode:u.nextNode,hits:u.hits});}return out;
  };
  s.queues=raw.queues.map((queue,i)=>{if(!Array.isArray(queue)||queue.length>level.supply.length)throw Error('QUEUE');let last=-1;return queue.map(u=>{const at=level.supply.findIndex(o=>o.id===u?.id);if(at%3!==i||at<=last)throw Error('ORDER');last=at;return unit(u);});});
  s.reserve=raw.reserve.map(u=>u===null?null:unit(u));s.active=raw.active.map(u=>unit(u,true));
  for(const key of ['ticks','launches','emptyLaps']){if(!finite(raw[key],0,5184000))throw Error('COUNTER');s[key]=raw[key];}
  if(!finite(raw.lastLaunch,-12,s.ticks))throw Error('LAUNCH');s.lastLaunch=raw.lastLaunch;
  if(raw.keys!==removedKeys||raw.requiredKeys!==s.requiredKeys||raw.totalHP!==s.totalHP||raw.shutters!==s.shutters||raw.gateTicks!==s.gateTicks||raw.phaseOffset!==s.phaseOffset||raw.reverse!==s.reverse)throw Error('RULE_DRIFT');
  s.keys=removedKeys;s.leftHP=raw.leftHP;s.hintUsed=raw.hintUsed===true;s.rewindUsed=raw.rewindUsed===true;
  assertState(s);if(s.leftHP<=0)return null;
  if(withPrevious&&!s.rewindUsed&&s.rewindAllowed&&raw.previous){const prev=restoreState(raw.previous,level,false);if(prev&&prev.ticks<=s.ticks&&prev.launches<s.launches)s.previous=capture(prev);}
  return s;
 }catch{return null;}
}
function mergeProgress(local,remote){
 const out=normalize(local),other=normalize(remote);out.unlocked=Math.max(out.unlocked,other.unlocked);
 for(let i=0;i<30;i++){out.stars[i]=Math.max(out.stars[i],other.stars[i]);out.best[i]=out.best[i]&&other.best[i]?Math.min(out.best[i],other.best[i]):out.best[i]||other.best[i];}
 const daily=new Map();for(const item of [...other.daily,...out.daily]){const old=daily.get(item.key);daily.set(item.key,{key:item.key,stars:Math.max(item.stars,old?.stars||0),best:old?Math.min(item.best,old.best):item.best});}out.daily=[...daily.values()].sort((a,b)=>a.key.localeCompare(b.key)).slice(-14);return out;
}
export function createStore(storage){
 let available=Boolean(storage),p=emptyProgress();
 try{const text=storage?.getItem(SAVE_KEY);if(text&&text.length<=180000)p=normalize(JSON.parse(text));}catch{available=false;}
 return {
  get value(){return p;},get available(){return available;},
  write(next){p=normalize(next);try{const old=storage?.getItem(SAVE_KEY);if(old&&old.length<=180000)p=mergeProgress(p,JSON.parse(old));storage?.setItem(SAVE_KEY,JSON.stringify(p));}catch{available=false;}return p;},
  refresh(){try{const text=storage?.getItem(SAVE_KEY);if(text&&text.length<=180000){const remote=normalize(JSON.parse(text));p=mergeProgress({...p,attempt:remote.attempt},remote);}}catch{available=false;}return p;},
  checkpoint(state,level){if(!state||state.status!=='running')return this.write({...p,attempt:null});return this.write({...p,attempt:{levelId:level.id,daily:level.daily||null,signature:level.signature,state:{...capture(state),previous:state.previous?clone(state.previous):null}}});},
  clearAttempt(){return this.write({...p,attempt:null});},
  settle(state,level){
   if(state.status!=='won')return this.clearAttempt();
   const next=clone(p),score=stars(state,level.par);next.attempt=null;
   if(level.daily){const old=next.daily.find(x=>x.key===level.daily);if(old){old.stars=Math.max(old.stars,score);old.best=Math.min(old.best,state.launches);}else next.daily.push({key:level.daily,stars:score,best:state.launches});next.daily=next.daily.slice(-14);}
   else{const i=level.id-1;next.stars[i]=Math.max(next.stars[i],score);next.best[i]=next.best[i]?Math.min(next.best[i],state.launches):state.launches;next.unlocked=Math.max(next.unlocked,Math.min(30,level.id+1));}
   return this.write(next);
  }
 };
}
