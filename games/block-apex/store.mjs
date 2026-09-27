import {SAVE_KEY, STAGES, VEHICLES, UPGRADE_KEYS, UPGRADE_COSTS, campaignStars} from './data.mjs';
const finite=(v,fallback=0)=>Number.isFinite(Number(v))?Number(v):fallback;
const integer=(v,max)=>Math.max(0,Math.min(max,Math.floor(finite(v))));
export function freshSave(){return {version:1,unlocked:1,vehicle:0,coins:0,tuning:{engine:0,tires:0,tank:0},records:{},settled:[],tutorial:false};}
export function validateSave(raw){
  const save=freshSave();
  if(!raw||typeof raw!=='object'||Array.isArray(raw)||raw.version!==1)return save;
  save.coins=integer(raw.coins,1000000);save.vehicle=integer(raw.vehicle,VEHICLES.length-1);save.tutorial=raw.tutorial===true;
  for(const key of UPGRADE_KEYS)save.tuning[key]=integer(raw.tuning?.[key],5);
  for(const stage of STAGES){
    const record=raw.records?.[stage.id];if(!record||typeof record!=='object')continue;
    const stars=integer(record.stars,3);if(!stars)continue;
    save.records[stage.id]={stars,best:Math.max(.01,Math.min(3600,finite(record.best,3600))),rank:Math.max(1,integer(record.rank,6))};
  }
  // Reconstruct unlocks from consecutive earned records, not an untrusted count.
  while(save.unlocked<STAGES.length&&save.records[save.unlocked])save.unlocked++;
  if(campaignStars(save)<VEHICLES[save.vehicle].stars)save.vehicle=0;
  save.settled=Array.isArray(raw.settled)?raw.settled.filter(id=>typeof id==='string'&&id.length<=128).slice(-32):[];
  return save;
}
export function rewardResult(save,result){
  if(!result||typeof result.runId!=='string'||result.runId.length>128||!STAGES[result.stageId-1]||save.settled.includes(result.runId))return 0;
  save.settled.push(result.runId);save.settled=save.settled.slice(-32);
  let coins=0;
  if(result.success&&Number.isFinite(result.time)&&result.time>0){
    const old=save.records[result.stageId],stars=Math.max(1,integer(result.stars,3));
    coins=40+Math.max(0,stars-(old?.stars||0))*30+(old?0:50);
    save.records[result.stageId]={stars:Math.max(stars,old?.stars||0),best:Math.min(result.time,old?.best||Infinity),rank:Math.min(result.rank,old?.rank||6)};
    while(save.unlocked<STAGES.length&&save.records[save.unlocked])save.unlocked++;
  }else if(result.progress>=.25)coins=10;
  save.coins=Math.min(1000000,save.coins+coins);return coins;
}
export function purchaseUpgrade(save,key){
  if(!UPGRADE_KEYS.includes(key))return false;
  const level=save.tuning[key],cost=UPGRADE_COSTS[level];
  if(level>=5||!Number.isFinite(cost)||save.coins<cost)return false;
  save.coins-=cost;save.tuning[key]++;return true;
}
export class SaveStore{
  constructor(storage){
    this.available=true;this.reason=null;
    try{this.storage=storage===undefined?globalThis.localStorage:storage;const raw=this.storage?.getItem(SAVE_KEY);
      if(raw&&raw.length>65536)throw new Error('OVERSIZED_SAVE');
      this.data=validateSave(raw?JSON.parse(raw):null);
      if(!this.storage)this.available=false;
    }catch{this.data=freshSave();this.available=false;this.reason='storage';}
  }
  persist(){
    try{if(!this.storage)throw new Error('NO_STORAGE');this.storage.setItem(SAVE_KEY,JSON.stringify(this.data));this.available=true;this.reason=null;}
    catch{this.available=false;this.reason='storage';}
    return this.available;
  }
  settle(result){const coins=rewardResult(this.data,result);this.persist();return coins;}
  buy(key){const ok=purchaseUpgrade(this.data,key);if(ok)this.persist();return ok;}
  select(index){if(!Number.isInteger(index)||!VEHICLES[index]||campaignStars(this.data)<VEHICLES[index].stars)return false;this.data.vehicle=index;this.persist();return true;}
}
