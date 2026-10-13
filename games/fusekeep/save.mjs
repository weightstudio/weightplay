import {normalizeDeck,VERSION} from './data.mjs';
import {normalizeCollection,mergeCollections,normalizeGacha,mergeGacha,clearCount,rewardType,REPLAY_GOLD_PER_WIN,REPLAY_GOLD_DAILY_CAP,REPLAY_GOLD_LIFETIME_CAP} from './progression.mjs';
// Preserve existing player progress across the v1 -> v2 implementation upgrade.
export const SAVE_KEY='weightplay.fusekeep.v1';
export const LOCAL_ACTOR='local';
const int=(n,a,b,fallback=a)=>Number.isFinite(n)?Math.max(a,Math.min(b,Math.trunc(n))):fallback;
const makeSettlementId=()=>globalThis.crypto?.randomUUID?.()||`run_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
export function normalizeSave(raw){
 const source=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
 const stars=Array.from({length:30},(_,i)=>int(source.stars?.[i],0,3));
 let unlocked=int(source.unlocked,1,30);
 stars.forEach((n,i)=>{if(n)unlocked=Math.max(unlocked,Math.min(30,i+2));});
 const collection=normalizeCollection(source.collection,Array.isArray(source.deck)?source.deck:[]);
 const deck=normalizeDeck(source.deck).filter(type=>collection.owned.includes(type));
 return {version:VERSION,unlocked,stars,collection,deck:normalizeDeck(deck),tutorial:source.tutorial===true,
  gacha:normalizeGacha(source.gacha),best:Array.from({length:30},(_,i)=>int(source.best?.[i],0,86400))};
}
export function mergeProgress(a,b){
 const sourceA=a&&typeof a==='object'&&!Array.isArray(a)?a:{},sourceB=b&&typeof b==='object'&&!Array.isArray(b)?b:{};
 const rawCollection=mergeCollections(sourceA.collection,sourceB.collection,
  Array.isArray(sourceA.deck)?sourceA.deck:[],Array.isArray(sourceB.deck)?sourceB.deck:[]);
 const rawGacha=mergeGacha(sourceA.gacha,sourceB.gacha);
 a=normalizeSave(sourceA);b=normalizeSave(sourceB);
 return normalizeSave({...a,collection:rawCollection,gacha:rawGacha,unlocked:Math.max(a.unlocked,b.unlocked),tutorial:a.tutorial||b.tutorial,
  stars:a.stars.map((n,i)=>Math.max(n,b.stars[i])),
  best:a.best.map((n,i)=>n&&b.best[i]?Math.min(n,b.best[i]):n||b.best[i])});
}
export function createStore(storage){
 const actor=LOCAL_ACTOR;
 let memory=normalizeSave(null),available=Boolean(storage);
 const read=()=>{
  if(!storage)throw Error('NO_STORAGE');
  const raw=storage.getItem(SAVE_KEY);if(!raw)return normalizeSave(null);
  try{return normalizeSave(JSON.parse(raw));}
  catch{available=false;return normalizeSave(null);}
 };
 try{memory=read();}catch{available=false;}
 const snapshot=()=>JSON.parse(JSON.stringify(memory));
 async function transact(mutator){
  const commit=async()=>{
   let base;try{base=storage?read():snapshot();}catch{return {ok:false,error:'storage'};}
   const outcome=await mutator(base);if(!outcome?.ok){memory=mergeProgress(memory,base);return outcome||{ok:false,error:'invalid'};}
   const next=normalizeSave(outcome.save);memory=next;
   if(storage){try{storage.setItem(SAVE_KEY,JSON.stringify(next));available=true;}catch{available=false;return {ok:false,error:'storage'};}}
   return {...outcome,save:snapshot()};
  };
  if(!storage)return commit();
  const lock=globalThis.navigator?.locks;
  if(typeof lock?.request!=='function')return {ok:false,error:'lock'};
  try{return await lock.request('weightplay-fusekeep-save-v1',commit);}catch{return {ok:false,error:'storage'};}
 }
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
  transact,
 };
}
export function settle(save,battle,actor='local'){
 const result=normalizeSave(save);if(battle.settled||battle.status!=='won')return result;
 const eventId=typeof battle.settlementId==='string'?battle.settlementId:(battle.settlementId=makeSettlementId());
 const gacha=normalizeGacha(result.gacha);
 if(gacha.settlementIds.includes(eventId)){battle.settled=true;return result;}
 battle.settled=true;const index=battle.stage.id-1,seconds=Math.ceil(battle.time);
 const firstClear=clearCount(result.collection,battle.stage.id)===0;
 const n=clearCount(result.collection,battle.stage.id)?4:8;
 const row=result.collection.counts[actor]||Array(30).fill(0);row[index]++;result.collection.counts[actor]=row;
 battle.shardReward={type:rewardType(battle.stage.id),amount:n};
 result.stars[index]=Math.max(result.stars[index],battle.stars);
 result.best[index]=result.best[index]?Math.min(result.best[index],seconds):seconds;
 result.unlocked=Math.max(result.unlocked,Math.min(30,battle.stage.id+1));
 let gold=80,replayGold=0;
 if(!firstClear){
  gold=0;const day=typeof battle.settlementDay==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(battle.settlementDay)?battle.settlementDay:new Date().toISOString().slice(0,10);
  const current=gacha.replayGoldByDay[day]||0;replayGold=Math.min(REPLAY_GOLD_PER_WIN,Math.max(0,REPLAY_GOLD_DAILY_CAP-current),Math.max(0,REPLAY_GOLD_LIFETIME_CAP-gacha.replayGoldTotal));
  gacha.replayGoldByDay[day]=current+replayGold;gacha.replayGoldTotal=int(gacha.replayGoldTotal+replayGold,0,1000000);
 }
 gacha.settlementIds.push(eventId);result.gacha=normalizeGacha(gacha);
 battle.economyReward={firstClear,gold:firstClear?80:replayGold,diamond:firstClear?1:0,replayGold};return normalizeSave(result);
}
