import {TOOLS} from './game-data.js';
export const KEY='weightplay:animal-wildwood-raid:v2';
const finite=(v,f=0)=>typeof v==='number'&&Number.isFinite(v)?v:f;
export function normalize(raw={}){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))raw={};
 const highestUnlocked=Math.max(1,Math.min(30,Math.floor(finite(raw.highestUnlocked,1))));
 const best={};for(const [k,v] of Object.entries(raw.best&&typeof raw.best==='object'?raw.best:{}))if(Number.isInteger(+k)&&+k>=1&&+k<=30&&finite(v)>0)best[k]=Math.min(100,Math.round(v));
 const loadout=[...new Set((Array.isArray(raw.loadout)?raw.loadout:['bow','lantern','snare']).filter(id=>TOOLS.some(t=>t.id===id&&id!=='axe')))].slice(0,3);
 return {highestUnlocked:Math.min(30,Math.max(highestUnlocked,...Object.keys(best).map(k=>+k+1))),best,loadout,tutorialSeen:raw.tutorialSeen===true};
}
export function load(){try{return normalize(JSON.parse(localStorage.getItem(KEY)||localStorage.getItem('weightplay:animal-wildwood-raid:v1')||'{}'));}catch{return normalize();}}
export function store(save){try{const previous=load();save.highestUnlocked=Math.max(save.highestUnlocked,previous.highestUnlocked);for(const [id,hp] of Object.entries(previous.best))save.best[id]=Math.max(save.best[id]||0,hp);localStorage.setItem(KEY,JSON.stringify(save));return true;}catch{return false;}}
