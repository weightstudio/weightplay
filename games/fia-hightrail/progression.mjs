export const PROFILE_KEY='weightplay:fia-hightrail:profile:v1',RUN_KEY='weightplay:fia-hightrail:run:v1';
export const AURORA_SKU='fia-hightrail:aurora-v1',AURORA_COST=12;
const valid=id=>typeof id==='string'&&/^hightrail-(0[1-9]|[12]\d|30)$/.test(id);
export const stageId=n=>`hightrail-${String(n).padStart(2,'0')}`;
export function normalize(raw={}){
 const ids=a=>[...new Set(Array.isArray(a)?a.filter(valid):[])];
 const p={schema:1,clearedIds:ids(raw.clearedIds),lifetimeClearedIds:ids(raw.lifetimeClearedIds),best:{},kit:'base',finish:'classic',tutorials:[],highestUnlocked:1};
 p.lifetimeClearedIds=ids([...p.lifetimeClearedIds,...p.clearedIds]);
 while(p.highestUnlocked<30&&p.clearedIds.includes(stageId(p.highestUnlocked)))p.highestUnlocked++;
 for(const [id,seals]of Object.entries(raw.best||{}))if(valid(id)&&Array.isArray(seals))p.best[id]=[0,1,2].map(i=>seals[i]===true);
 if(availableKits(p).includes(raw.kit))p.kit=raw.kit;
 if(availableFinishes(p).includes(raw.finish)||raw.finish==='aurora')p.finish=raw.finish;
 p.tutorials=Array.isArray(raw.tutorials)?raw.tutorials.filter(x=>Number.isInteger(x)&&x>=1&&x<=30):[];return p;
}
export function availableKits(p){return ['base',...(p.lifetimeClearedIds.includes(stageId(5))?['safety']:[]),...(p.lifetimeClearedIds.includes(stageId(10))?['dry']:[]),...(p.lifetimeClearedIds.includes(stageId(15))?['wind']:[])];}
export function availableFinishes(p){return ['classic',...(p.lifetimeClearedIds.includes(stageId(10))?['rain']:[]),...(p.lifetimeClearedIds.includes(stageId(20))?['frost']:[]),...(p.lifetimeClearedIds.includes(stageId(30))?['summit']:[])];}
export function applyClear(profile,id,seals){const p=normalize(profile),first=!p.lifetimeClearedIds.includes(id);if(!valid(id))throw new Error('Invalid stage');p.clearedIds.push(id);p.lifetimeClearedIds.push(id);p.best[id]=[0,1,2].map(i=>Boolean(p.best[id]?.[i]||seals[i]));return {profile:normalize(p),first};}
export function resetCampaign(p){return normalize({...p,clearedIds:[]});}
export function createStorage(storage,{readOnly=false}={}){let writable=!readOnly,error=null;
 function read(key){try{const raw=storage.getItem(key);if(!raw)return null;try{return JSON.parse(raw);}catch{if(!readOnly)storage.setItem(`${key}:recovery`,raw);error='saveRecovered';return null;}}catch{writable=false;error='saveUnavailable';return null;}}
 function write(key,value){if(readOnly)return false;try{storage.setItem(key,JSON.stringify(value));return true;}catch{writable=false;error='saveUnavailable';return false;}}
 const initial=normalize(read(PROFILE_KEY)||{});if(writable)write(PROFILE_KEY,initial);
 return {initial,read,write,get writable(){return writable;},get error(){return error;},save:p=>write(PROFILE_KEY,normalize(p)),run:r=>write(RUN_KEY,r),clearRun(){if(readOnly)return;try{storage.removeItem(RUN_KEY);}catch{writable=false;}},reset:p=>{const next=resetCampaign(p);return write(PROFILE_KEY,next)?next:null;}};
}
