import {normalizeDeck,VERSION} from './data.mjs';
// Preserve existing player progress across the v1 -> v2 implementation upgrade.
export const SAVE_KEY='weightplay.fusekeep.v1';
const int=(n,a,b,fallback=a)=>Number.isFinite(n)?Math.max(a,Math.min(b,Math.trunc(n))):fallback;
export function normalizeSave(raw){
 const source=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
 const stars=Array.from({length:30},(_,i)=>int(source.stars?.[i],0,3));
 let unlocked=int(source.unlocked,1,30);
 stars.forEach((n,i)=>{if(n)unlocked=Math.max(unlocked,Math.min(30,i+2));});
 return {version:VERSION,unlocked,stars,deck:normalizeDeck(source.deck),tutorial:source.tutorial===true,
  best:Array.from({length:30},(_,i)=>int(source.best?.[i],0,86400))};
}
export function mergeProgress(a,b){
 a=normalizeSave(a);b=normalizeSave(b);
 return normalizeSave({...a,unlocked:Math.max(a.unlocked,b.unlocked),tutorial:a.tutorial||b.tutorial,
  stars:a.stars.map((n,i)=>Math.max(n,b.stars[i])),
  best:a.best.map((n,i)=>n&&b.best[i]?Math.min(n,b.best[i]):n||b.best[i])});
}
export function createStore(storage){
 let memory=normalizeSave(null),available=Boolean(storage);
 const read=()=>{
  if(!storage)throw Error('NO_STORAGE');
  const raw=storage.getItem(SAVE_KEY);if(!raw)return normalizeSave(null);
  try{return normalizeSave(JSON.parse(raw));}
  catch{available=false;return normalizeSave(null);}
 };
 try{memory=read();}catch{available=false;}
 const snapshot=()=>({ ...memory,deck:[...memory.deck],stars:[...memory.stars],best:[...memory.best] });
 return {
  get available(){return available;},get value(){return snapshot();},
  refresh(){try{memory=mergeProgress(memory,read());}catch{available=false;}return snapshot();},
  write(value){
   memory=normalizeSave(value);
   try{
    if(!storage)throw Error('NO_STORAGE');
    // Bad JSON does not permanently prevent a subsequent valid save.
    memory=mergeProgress(memory,read());storage.setItem(SAVE_KEY,JSON.stringify(memory));available=true;
   }catch{available=false;}
   return snapshot();
  },
 };
}
export function settle(save,battle){
 const result=normalizeSave(save);if(battle.settled||battle.status!=='won')return result;
 battle.settled=true;const index=battle.stage.id-1,seconds=Math.ceil(battle.time);
 result.stars[index]=Math.max(result.stars[index],battle.stars);
 result.best[index]=result.best[index]?Math.min(result.best[index],seconds):seconds;
 result.unlocked=Math.max(result.unlocked,Math.min(30,battle.stage.id+1));return result;
}
