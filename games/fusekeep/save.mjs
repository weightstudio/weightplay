import {normalizeDeck,VERSION} from './data.mjs';
import {normalizeCollection,mergeCollections,clearCount,rewardType} from './progression.mjs';
// Preserve existing player progress across the v1 -> v2 implementation upgrade.
export const SAVE_KEY='weightplay.fusekeep.v1';
const int=(n,a,b,fallback=a)=>Number.isFinite(n)?Math.max(a,Math.min(b,Math.trunc(n))):fallback;
export function normalizeSave(raw){
 const source=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
 const stars=Array.from({length:30},(_,i)=>int(source.stars?.[i],0,3));
 let unlocked=int(source.unlocked,1,30);
 stars.forEach((n,i)=>{if(n)unlocked=Math.max(unlocked,Math.min(30,i+2));});
 const collection=normalizeCollection(source.collection,Array.isArray(source.deck)?source.deck:[]);
 const deck=normalizeDeck(source.deck).filter(type=>collection.owned.includes(type));
 return {version:VERSION,unlocked,stars,collection,deck:normalizeDeck(deck),tutorial:source.tutorial===true,
  best:Array.from({length:30},(_,i)=>int(source.best?.[i],0,86400))};
}
export function mergeProgress(a,b){
 a=normalizeSave(a);b=normalizeSave(b);
 return normalizeSave({...a,collection:mergeCollections(a.collection,b.collection),unlocked:Math.max(a.unlocked,b.unlocked),tutorial:a.tutorial||b.tutorial,
  stars:a.stars.map((n,i)=>Math.max(n,b.stars[i])),
  best:a.best.map((n,i)=>n&&b.best[i]?Math.min(n,b.best[i]):n||b.best[i])});
}
export function createStore(storage){
 const actor=globalThis.crypto?.randomUUID?.()||`s${Date.now()}_${Math.random().toString(36).slice(2)}`;
 let memory=normalizeSave(null),available=Boolean(storage);
 const read=()=>{
  if(!storage)throw Error('NO_STORAGE');
  const raw=storage.getItem(SAVE_KEY);if(!raw)return normalizeSave(null);
  try{return normalizeSave(JSON.parse(raw));}
  catch{available=false;return normalizeSave(null);}
 };
 try{memory=read();}catch{available=false;}
 const snapshot=()=>JSON.parse(JSON.stringify(memory));
 return {
  actor,get available(){return available;},get value(){return snapshot();},
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
export function settle(save,battle,actor='local'){
 const result=normalizeSave(save);if(battle.settled||battle.status!=='won')return result;
 battle.settled=true;const index=battle.stage.id-1,seconds=Math.ceil(battle.time);
 const n=clearCount(result.collection,battle.stage.id)?4:8;
 const row=result.collection.counts[actor]||Array(30).fill(0);row[index]++;result.collection.counts[actor]=row;
 battle.shardReward={type:rewardType(battle.stage.id),amount:n};
 result.stars[index]=Math.max(result.stars[index],battle.stars);
 result.best[index]=result.best[index]?Math.min(result.best[index],seconds):seconds;
 result.unlocked=Math.max(result.unlocked,Math.min(30,battle.stage.id+1));return result;
}
