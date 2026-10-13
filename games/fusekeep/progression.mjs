import {TYPES,DEFAULT_DECK} from './data.mjs';
export const SHARD_ORDER=['raccoon','deer','cat',...DEFAULT_DECK];
export const ADVANCE_COSTS=[12,20,32,48,68];
export const UNLOCK_COST=12;
export const REPLAY_GOLD_PER_WIN=40;
export const REPLAY_GOLD_DAILY_CAP=120;
export const REPLAY_GOLD_LIFETIME_CAP=1200;
const LOCAL_ACTOR='local';
const integer=n=>Number.isFinite(n)?Math.max(0,Math.min(1000000,Math.trunc(n))):0;
export const rewardType=id=>SHARD_ORDER[(id-1)%SHARD_ORDER.length];
export const sources=type=>Array.from({length:30},(_,i)=>i+1).filter(id=>rewardType(id)===type);
// Grow-only per-session clear counters preserve wins when tabs reconcile.
// Spending is derived from permanent unlocks/tiers, so refresh cannot refund it.
export function normalizeCollection(raw,legacyDeck=[],compact=false){
 const source=raw&&typeof raw==='object'?raw:{};
 const previous=raw?(Array.isArray(source.grants)?source.grants:[]):legacyDeck;
 const grants=[...new Set([...DEFAULT_DECK,...previous])].filter(t=>TYPES.includes(t));
 const countRows={};
 for(const [actor,values] of Object.entries(source.counts||{})){
  if(!/^[a-zA-Z0-9_-]{1,80}$/.test(actor)||['__proto__','constructor','prototype'].includes(actor)||!Array.isArray(values))continue;
  const row=Array.from({length:30},(_,i)=>integer(values[i]));if(row.some(Boolean))countRows[actor]=row;
 }
 const fragmentRows={};
 for(const [actor,values] of Object.entries(source.fragments||{})){
  if(!/^[a-zA-Z0-9_-]{1,80}$/.test(actor)||['__proto__','constructor','prototype'].includes(actor)||!values||typeof values!=="object")continue;
  const row={};for(const type of TYPES){const n=integer(values[type]);if(n)row[type]=n;}if(Object.keys(row).length)fragmentRows[actor]=row;
 }
 const counts=compact?(()=>{const row=Array(30).fill(0);for(const values of Object.values(countRows))for(let i=0;i<30;i++)row[i]=integer(row[i]+values[i]);return row.some(Boolean)?{[LOCAL_ACTOR]:row}:{};})():countRows;
 const fragments=compact?(()=>{const row={};for(const values of Object.values(fragmentRows))for(const type of TYPES)row[type]=integer((row[type]||0)+(values[type]||0));for(const type of TYPES)if(!row[type])delete row[type];return Object.keys(row).length?{[LOCAL_ACTOR]:row}:{};})():fragmentRows;
 const collection={grants,counts,fragments,owned:[...grants],levels:{}};
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
export function earnedShards(collection,type){
 const battle=sources(type).reduce((n,id)=>{const count=clearCount(collection,id);return n+count*4+(count?4:0);},0);
 const bonus=Object.values(collection.fragments||{}).reduce((n,row)=>n+integer(row?.[type]),0);
 return battle+bonus;
}
export function addFragments(collection,actor,type,amount){
 const next=normalizeCollection(collection);if(!TYPES.includes(type)||!/[a-zA-Z0-9_-]{1,80}/.test(actor))return next;
 next.fragments[actor]||={};next.fragments[actor][type]=integer(next.fragments[actor][type])+integer(amount);return normalizeCollection(next);
}
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
export function mergeCollections(a,b,legacyDeckA=[],legacyDeckB=[]){
 a=normalizeCollection(a,legacyDeckA,false);b=normalizeCollection(b,legacyDeckB,false);const counts={...a.counts},fragments={...a.fragments};
 for(const [actor,row] of Object.entries(b.counts))counts[actor]=row.map((n,i)=>Math.max(n,counts[actor]?.[i]||0));
 for(const [actor,row] of Object.entries(b.fragments)){fragments[actor]={...(fragments[actor]||{})};for(const type of TYPES)fragments[actor][type]=Math.max(row[type]||0,fragments[actor][type]||0);}
 return normalizeCollection({counts,fragments,grants:[...new Set([...a.grants,...b.grants])],owned:[...new Set([...a.owned,...b.owned])],levels:Object.fromEntries(TYPES.map(t=>[t,Math.max(a.levels[t],b.levels[t])]))});
}

export const GACHA_BANNERS=Object.freeze({
 gold:Object.freeze({cost:120,threshold:10,guarantee:"rare",odds:Object.freeze({common:.75,rare:.20,epic:.05})}),
 diamond:Object.freeze({cost:6,threshold:5,guarantee:"epic",odds:Object.freeze({common:.50,rare:.35,epic:.15})}),
});
export function normalizeGacha(raw,compact=false){
 const source=raw&&typeof raw==="object"?raw:{},counterRows={};
 for(const [actor,value] of Object.entries(source.counters||{})){
  if(!/^[a-zA-Z0-9_-]{1,80}$/.test(actor)||["__proto__","constructor","prototype"].includes(actor))continue;
  const gold=integer(value?.gold),diamond=integer(value?.diamond);if(gold||diamond)counterRows[actor]={gold,diamond};
 }
 const counters=compact?(()=>{let gold=0,diamond=0;for(const row of Object.values(counterRows)){gold=integer(gold+row.gold);diamond=integer(diamond+row.diamond);}return gold||diamond?{[LOCAL_ACTOR]:{gold,diamond}}:{};})():counterRows;
 const cardRows={};for(const [actor,row] of Object.entries(source.cards||{})){
  if(!/^[a-zA-Z0-9_-]{1,80}$/.test(actor)||["__proto__","constructor","prototype"].includes(actor)||!row||typeof row!=="object")continue;
  const counts={};for(const type of TYPES){const n=integer(row[type]);if(n)counts[type]=n;}if(Object.keys(counts).length)cardRows[actor]=counts;
 }
 const cards=compact?(()=>{const row={};for(const values of Object.values(cardRows))for(const type of TYPES)row[type]=integer((row[type]||0)+(values[type]||0));for(const type of TYPES)if(!row[type])delete row[type];return Object.keys(row).length?{[LOCAL_ACTOR]:row}:{};})():cardRows;
 const replayGoldByDay={};
 for(const [day,value] of Object.entries(source.replayGoldByDay||{}))if(/^\d{4}-\d{2}-\d{2}$/.test(day))replayGoldByDay[day]=Math.min(REPLAY_GOLD_DAILY_CAP,integer(value));
 const recentDays=Object.keys(replayGoldByDay).sort().slice(-31),daily=Object.fromEntries(recentDays.map(day=>[day,replayGoldByDay[day]]));
 const settlementIds=Array.isArray(source.settlementIds)?[...new Set(source.settlementIds.filter(id=>typeof id==="string"&&/^[a-zA-Z0-9_-]{1,80}$/.test(id)))].slice(-512):[];
 return {counters,cards,pity:{gold:Math.min(9,integer(source.pity?.gold)),diamond:Math.min(4,integer(source.pity?.diamond))},
  replayGoldTotal:Math.min(REPLAY_GOLD_LIFETIME_CAP,integer(source.replayGoldTotal)),replayGoldByDay:daily,settlementIds};
}
export function mergeGacha(a,b){
 a=normalizeGacha(a,false);b=normalizeGacha(b,false);const counters={...a.counters},cards={...a.cards},replayGoldByDay={...a.replayGoldByDay};
 for(const [actor,row] of Object.entries(b.counters))counters[actor]={gold:Math.max(row.gold,counters[actor]?.gold||0),diamond:Math.max(row.diamond,counters[actor]?.diamond||0)};
 for(const [actor,row] of Object.entries(b.cards)){cards[actor]={...(cards[actor]||{})};for(const type of TYPES)cards[actor][type]=Math.max(row[type]||0,cards[actor][type]||0);}
 for(const [day,value] of Object.entries(b.replayGoldByDay))replayGoldByDay[day]=Math.max(value,replayGoldByDay[day]||0);
 const settlementIds=[...new Set([...a.settlementIds,...b.settlementIds])].slice(-512);
 return normalizeGacha({counters,cards,pity:{gold:Math.max(a.pity.gold,b.pity.gold),diamond:Math.max(a.pity.diamond,b.pity.diamond)},
  replayGoldTotal:Math.max(a.replayGoldTotal,b.replayGoldTotal),replayGoldByDay,settlementIds});
}
export function gachaBalance(collection,gacha){
 const unique=Array.from({length:30},(_,i)=>clearCount(collection,i+1)>0?1:0).reduce((a,b)=>a+b,0);
 const pulls=Object.values(normalizeGacha(gacha).counters).reduce((a,row)=>({gold:a.gold+row.gold,diamond:a.diamond+row.diamond}),{gold:0,diamond:0});
 const earnedReplayGold=normalizeGacha(gacha).replayGoldTotal;
 return {gold:Math.max(0,unique*80+earnedReplayGold-pulls.gold*GACHA_BANNERS.gold.cost),diamond:Math.max(0,unique-pulls.diamond*GACHA_BANNERS.diamond.cost)};
}
export function drawRarity(banner,rng=Math.random){
 const rule=GACHA_BANNERS[banner];if(!rule)return null;
 const roll=rng();let edge=0;return Object.entries(rule.odds).find(([,weight])=>(edge+=weight,roll<edge))?.[0]||"common";
}
export function drawCard(save,banner,actor,rng=Math.random){
 if(!GACHA_BANNERS[banner]||typeof actor!=="string"||! /^[a-zA-Z0-9_-]{1,80}$/.test(actor)||["__proto__","constructor","prototype"].includes(actor))return {ok:false,error:"invalid"};
 const gacha=normalizeGacha(save.gacha),balance=gachaBalance(save.collection,gacha);
 if(balance[banner]<GACHA_BANNERS[banner].cost)return {ok:false,error:"funds",balance:balance[banner]};
 const pull=(gacha.counters[actor]?.[banner]||0)+1,rule=GACHA_BANNERS[banner];
 // One random draw per successful pull; failed pulls have no side effects.
 const roll=rng();let edge=0;
 let rarity=Object.entries(rule.odds).find(([,weight])=>(edge+=weight,roll<edge))?.[0]||"common";
 const guaranteeAt=rule.guarantee==="epic"?"epic":"rare";
 const pity=gacha.pity[banner]+1;
 if(pity>=rule.threshold)rarity=guaranteeAt;
 const reset=rarity==="epic"||(guaranteeAt==="rare"&&rarity==="rare");
 const troop=TYPES[Math.min(TYPES.length-1,Math.floor(rng()*TYPES.length))];
 const duplicate=Object.values(gacha.cards).some(row=>(row[troop]||0)>0);
 const fragments=rarity==="epic"?8:rarity==="rare"?4:2;
 gacha.counters[actor]||={gold:0,diamond:0};gacha.counters[actor][banner]=pull;
 gacha.cards[actor]||={};gacha.cards[actor][troop]=(gacha.cards[actor][troop]||0)+1;
 gacha.pity[banner]=reset?0:pity;
 const collection=addFragments(save.collection,actor,troop,fragments);
 return {ok:true,save:{...save,collection,gacha},result:{banner,troop,rarity,fragments,duplicate,pull,guaranteed:pity>=rule.threshold}};
}
