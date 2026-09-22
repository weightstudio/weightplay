import {TOOLS} from './game-data.js';
export const KEY='weightplay:animal-wildwood-raid:v2';
const finite=(v,f=0)=>typeof v==='number'&&Number.isFinite(v)?v:f;
const amount=v=>Math.max(0,Math.min(1e12,Math.floor(finite(v))));
const regen=v=>Math.round(Math.max(0,Math.min(1e12,finite(v)))*10)/10;
const stats=g=>({health:amount(g?.health),attack:amount(g?.attack),regen:regen(g?.regen)});
export function mergeGrowth(a={},b={}){const result={};for(const id of [...new Set([...Object.keys(a),...Object.keys(b)])].sort())if(/^[a-zA-Z0-9-]{1,80}$/.test(id))result[id]={health:Math.max(amount(a[id]?.health),amount(b[id]?.health)),attack:Math.max(amount(a[id]?.attack),amount(b[id]?.attack)),regen:Math.max(regen(a[id]?.regen),regen(b[id]?.regen))};return result;}
export function normalize(raw={}){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))raw={};
 const highestUnlocked=Math.max(1,Math.min(30,Math.floor(finite(raw.highestUnlocked,1))));
 const best={};for(const [k,v] of Object.entries(raw.best&&typeof raw.best==='object'?raw.best:{}))if(Number.isInteger(+k)&&+k>=1&&+k<=30&&finite(v)>0)best[k]=Math.min(100,Math.round(v));
 const loadout=[...new Set((Array.isArray(raw.loadout)?raw.loadout:['bow','lantern','snare']).filter(id=>TOOLS.some(t=>t.id===id&&id!=='axe')))].slice(0,3);
 const growthLedger=mergeGrowth(raw.growthLedger&&typeof raw.growthLedger==='object'?raw.growthLedger:{}),legacyGrowth=stats(raw.legacyGrowth||(!raw.growthLedger?raw.growth:{}));
 const growth=Object.values(growthLedger).reduce((g,p)=>({health:g.health+p.health,attack:g.attack+p.attack,regen:regen(g.regen+p.regen)}),{...legacyGrowth});
 return {highestUnlocked:Math.min(30,Math.max(highestUnlocked,...Object.keys(best).map(k=>+k+1))),best,loadout,tutorialSeen:raw.tutorialSeen===true,growthLedger,legacyGrowth,growth};
}
export function load(){try{return normalize(JSON.parse(localStorage.getItem(KEY)||localStorage.getItem('weightplay:animal-wildwood-raid:v1')||'{}'));}catch{return normalize();}}
export function store(save){try{const previous=load();save.highestUnlocked=Math.max(save.highestUnlocked,previous.highestUnlocked);for(const [id,hp] of Object.entries(previous.best))save.best[id]=Math.max(save.best[id]||0,hp);save.growthLedger=mergeGrowth(save.growthLedger,previous.growthLedger);save.legacyGrowth={health:Math.max(save.legacyGrowth?.health||0,previous.legacyGrowth.health),attack:Math.max(save.legacyGrowth?.attack||0,previous.legacyGrowth.attack),regen:Math.max(save.legacyGrowth?.regen||0,previous.legacyGrowth.regen)};Object.assign(save,normalize(save));const text=JSON.stringify(save);if(localStorage.getItem(KEY)!==text)localStorage.setItem(KEY,text);return true;}catch{return false;}}
// Per-page cumulative counters merge by actor, so two open tabs never overwrite each other's earned stats.
export function award(save,actor,reward){if(!['health','attack','regen'].includes(reward.stat))return true;const value=reward.stat==='regen'?regen(reward.amount):amount(reward.amount);if(!value)return true;const ledger=save.growthLedger||={};ledger[actor]=stats(ledger[actor]);ledger[actor][reward.stat]+=value;Object.assign(save,normalize(save));return store(save);}
