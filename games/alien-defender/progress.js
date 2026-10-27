import {clamp,TOTAL_STAGES} from './model.js';
export const SAVE_KEY='wp-alien-defender-save-v62';
const prefix='wp-alien-defender-';
export const UPGRADES={firepower:{max:10,base:100,step:55,min:1},shield:{max:5,base:90,step:60,min:0},hull:{max:3,base:150,step:100,min:0},rapid:{max:4,base:120,step:70,min:0}};
const num=(n,min,max)=>clamp(Math.floor(Number(n)||0),min,max);
export function normalize(raw={}) {
 raw=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
 const cleared={};for(let stage=1;stage<=TOTAL_STAGES;stage++)if(raw.cleared?.[stage]===true)cleared[stage]=true;
 // A legacy unlocked=30 is ambiguous. Owner chose a real Stage-30 replay;
 // do not invent its historical clear or advance it to 31 during loading.
 return {version:63,unlocked:num(raw.unlocked??1,1,TOTAL_STAGES),cleared,credits:num(raw.credits,0,1e9),best:num(raw.best,0,1e9),firepower:num(raw.firepower??1,1,10),shield:num(raw.shield,0,5),hull:num(raw.hull,0,3),rapid:num(raw.rapid,0,4),skin:raw.skin===true};
}
export function loadProgress(storage) {
 try{const saved=storage.getItem(SAVE_KEY);if(saved)return normalize(JSON.parse(saved));}catch{}
 const read=k=>{try{return storage.getItem(prefix+k);}catch{return null;}};
 return normalize({unlocked:read('unlocked-stage')??1,credits:read('credits'),best:read('best'),firepower:read('firepower')??1,shield:read('upgrade-shield'),hull:read('upgrade-hull'),rapid:read('upgrade-rapid')});
}
export function saveProgress(storage,next) {try{storage.setItem(SAVE_KEY,JSON.stringify(normalize(next)));return true;}catch{return false;}}
// Results alone require a verified write before granting a stage reward. Keep
// the separate shop/skin transaction contract unchanged.
function saveResultConfirmed(storage,progress,next){try{
 const before=storage.getItem(SAVE_KEY),raw=before===null?null:JSON.parse(before);
 if(before!==null&&(!raw||typeof raw!=='object'||Array.isArray(raw)||(raw.version!=null&&raw.version!==62&&raw.version!==63)||(raw.cleared!=null&&(!raw.cleared||typeof raw.cleared!=='object'||Array.isArray(raw.cleared)||Object.values(raw.cleared).some(x=>typeof x!=='boolean')))))return false;
 const numeric=[['unlocked',1,TOTAL_STAGES],['credits',0,1e9],['best',0,1e9],['firepower',1,10],['shield',0,5],['hull',0,3],['rapid',0,4]];
 if(raw&&(numeric.some(([key,min,max])=>raw[key]!=null&&((typeof raw[key]!=='number'&&typeof raw[key]!=='string')||(typeof raw[key]==='string'&&raw[key].trim()==='')||!Number.isFinite(Number(raw[key]))||Number(raw[key])<min||Number(raw[key])>max))||(raw.skin!=null&&typeof raw.skin!=='boolean')))return false;
 const names=['unlocked-stage','credits','best','firepower','upgrade-shield','upgrade-hull','upgrade-rapid'],legacy=before===null?names.map(k=>storage.getItem(prefix+k)):null;
 if(legacy&&legacy.some((value,i)=>value!==null&&(typeof value!=='string'||value.trim()===''||!Number.isFinite(Number(value))||Number(value)<numeric[i][1]||Number(value)>numeric[i][2])))return false;
 const current=raw??{unlocked:legacy[0]??1,credits:legacy[1],best:legacy[2],firepower:legacy[3]??1,shield:legacy[4],hull:legacy[5],rapid:legacy[6]};
 if(JSON.stringify(normalize(current))!==JSON.stringify(normalize(progress)))return false;
 const canonical=normalize(next),bytes=JSON.stringify({...raw,...canonical,cleared:{...(raw?.cleared||{}),...canonical.cleared}});
 if(storage.getItem(SAVE_KEY)!==before||legacy&&names.some((k,i)=>storage.getItem(prefix+k)!==legacy[i]))return false;
 try{storage.setItem(SAVE_KEY,bytes);}catch{}return storage.getItem(SAVE_KEY)===bytes;
 }catch{return false;}}
export function upgradeCost(progress,key) {const rule=UPGRADES[key];return rule?rule.base+(progress[key]-rule.min)*rule.step:Infinity;}
export function buyUpgrade(storage,progress,key){const rule=UPGRADES[key],cost=upgradeCost(progress,key);if(!rule||progress[key]>=rule.max||progress.credits<cost)return {ok:false,reason:'funds'};const next={...progress,[key]:progress[key]+1,credits:progress.credits-cost};return saveProgress(storage,next)?{ok:true,next}:{ok:false,reason:'save'};}
// Commit a complete result once, in one key. Legacy keys are retained untouched.
export function settle(storage,progress,world){if(world.settled)return {ok:false,reason:'duplicate'};world.settled=true;const won=world.status==='won',earned=world.credits+(won?world.config.clearReward:0),next={...progress,cleared:won?{...progress.cleared,[world.config.stage]:true}:{...progress.cleared},credits:progress.credits+earned,best:Math.max(progress.best,world.score),unlocked:won?Math.max(progress.unlocked,Math.min(TOTAL_STAGES,world.config.stage+1)):progress.unlocked};return {ok:saveResultConfirmed(storage,progress,next),next,earned};}
// Entitlement is saved BEFORE debiting the shared wallet: storage failure can
// never take diamonds. A failed debit restores the original local record.
export function buySkin(storage,progress,wallet,cost=15){
    if (wallet?.withTransaction && !wallet.inTransaction()) return wallet.withTransaction("alien-defender:progress.js:buySkin", () => buySkin(...arguments));

 if(progress.skin)return {ok:false,reason:'owned'};
 if(!wallet||wallet.read().diamonds<cost)return {ok:false,reason:'funds'};
 const next={...progress,skin:true};if(!saveProgress(storage,next))return {ok:false,reason:'save'};
 try{if(wallet.spendDiamonds(cost))return {ok:true,next};}catch{}
 const rolledBack=saveProgress(storage,progress);
 return {ok:false,reason:'save',next:rolledBack?progress:next};
}
