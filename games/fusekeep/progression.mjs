import {TYPES,DEFAULT_DECK} from './data.mjs';
export const SHARD_ORDER=['raccoon','deer','cat',...DEFAULT_DECK];
export const ADVANCE_COSTS=[12,20,32,48,68];
export const UNLOCK_COST=12;
const integer=n=>Number.isFinite(n)?Math.max(0,Math.min(1000000,Math.trunc(n))):0;
export const rewardType=id=>SHARD_ORDER[(id-1)%SHARD_ORDER.length];
export const sources=type=>Array.from({length:30},(_,i)=>i+1).filter(id=>rewardType(id)===type);
// Grow-only per-session clear counters preserve wins when tabs reconcile.
// Spending is derived from permanent unlocks/tiers, so refresh cannot refund it.
export function normalizeCollection(raw,legacyDeck=[]){
 const source=raw&&typeof raw==='object'?raw:{};
 const previous=raw?(Array.isArray(source.grants)?source.grants:[]):legacyDeck;
 const grants=[...new Set([...DEFAULT_DECK,...previous])].filter(t=>TYPES.includes(t));
 const counts={};
 for(const [actor,values] of Object.entries(source.counts||{})){
  if(!/^[a-zA-Z0-9_-]{1,80}$/.test(actor)||['__proto__','constructor','prototype'].includes(actor)||!Array.isArray(values))continue;
  const row=Array.from({length:30},(_,i)=>integer(values[i]));if(row.some(Boolean))counts[actor]=row;
 }
 const collection={grants,counts,owned:[...grants],levels:{}};
 for(const type of TYPES){
  const earned=earnedShards(collection,type),unlock=grants.includes(type)?0:UNLOCK_COST;
  if(!grants.includes(type)&&Array.isArray(source.owned)&&source.owned.includes(type)&&earned>=unlock)collection.owned.push(type);
  let spent=unlock,level=0;
  if(collection.owned.includes(type))while(level<Math.min(ADVANCE_COSTS.length,integer(source.levels?.[type]))&&spent+ADVANCE_COSTS[level]<=earned){spent+=ADVANCE_COSTS[level++];}
  collection.levels[type]=level;
 }
 return collection;
}
export function clearCount(collection,id){return Object.values(collection.counts).reduce((n,row)=>n+row[id-1],0);}
export function earnedShards(collection,type){return sources(type).reduce((n,id)=>{const count=clearCount(collection,id);return n+count*4+(count?4:0);},0);}
export function shardBalance(collection,type){
 const spent=(collection.owned.includes(type)&&!collection.grants.includes(type)?UNLOCK_COST:0)+ADVANCE_COSTS.slice(0,collection.levels[type]||0).reduce((a,b)=>a+b,0);
 return earnedShards(collection,type)-spent;
}
export function nextCost(collection,type){return collection.owned.includes(type)?ADVANCE_COSTS[collection.levels[type]||0]??null:UNLOCK_COST;}
export function advanceCollection(collection,type){
 const next=normalizeCollection(collection),cost=nextCost(next,type);
 if(!TYPES.includes(type)||cost===null||shardBalance(next,type)<cost)return next;
 if(!next.owned.includes(type))next.owned.push(type);else next.levels[type]++;
 return next;
}
export function mergeCollections(a,b){
 a=normalizeCollection(a);b=normalizeCollection(b);const counts={...a.counts};
 for(const [actor,row] of Object.entries(b.counts))counts[actor]=row.map((n,i)=>Math.max(n,counts[actor]?.[i]||0));
 return normalizeCollection({counts,grants:[...new Set([...a.grants,...b.grants])],owned:[...new Set([...a.owned,...b.owned])],levels:Object.fromEntries(TYPES.map(t=>[t,Math.max(a.levels[t],b.levels[t])]))});
}
