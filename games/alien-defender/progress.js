import {clamp} from './model.js';
export const SAVE_KEY='wp-alien-defender-save-v62';
const prefix='wp-alien-defender-';
export const UPGRADES={firepower:{max:10,base:100,step:55,min:1},shield:{max:5,base:90,step:60,min:0},hull:{max:3,base:150,step:100,min:0},rapid:{max:4,base:120,step:70,min:0}};
const num=(n,min,max)=>clamp(Math.floor(Number(n)||0),min,max);
export function normalize(raw={}) {return {version:62,unlocked:num(raw.unlocked??1,1,30),credits:num(raw.credits,0,1e9),best:num(raw.best,0,1e9),firepower:num(raw.firepower??1,1,10),shield:num(raw.shield,0,5),hull:num(raw.hull,0,3),rapid:num(raw.rapid,0,4),skin:raw.skin===true};}
export function loadProgress(storage) {
 try{const saved=storage.getItem(SAVE_KEY);if(saved)return normalize(JSON.parse(saved));}catch{}
 const read=k=>{try{return storage.getItem(prefix+k);}catch{return null;}};
 return normalize({unlocked:read('unlocked-stage')??1,credits:read('credits'),best:read('best'),firepower:read('firepower')??1,shield:read('upgrade-shield'),hull:read('upgrade-hull'),rapid:read('upgrade-rapid')});
}
export function saveProgress(storage,next) {try{storage.setItem(SAVE_KEY,JSON.stringify(normalize(next)));return true;}catch{return false;}}
export function upgradeCost(progress,key) {const rule=UPGRADES[key];return rule?rule.base+(progress[key]-rule.min)*rule.step:Infinity;}
export function buyUpgrade(storage,progress,key){const rule=UPGRADES[key],cost=upgradeCost(progress,key);if(!rule||progress[key]>=rule.max||progress.credits<cost)return {ok:false,reason:'funds'};const next={...progress,[key]:progress[key]+1,credits:progress.credits-cost};return saveProgress(storage,next)?{ok:true,next}:{ok:false,reason:'save'};}
// Commit a complete result once, in one key. Legacy keys are retained untouched.
export function settle(storage,progress,world){if(world.settled)return {ok:false,reason:'duplicate'};world.settled=true;const won=world.status==='won',earned=world.credits+(won?world.config.clearReward:0),next={...progress,credits:progress.credits+earned,best:Math.max(progress.best,world.score),unlocked:won?Math.max(progress.unlocked,Math.min(30,world.config.stage+1)):progress.unlocked};return {ok:saveProgress(storage,next),next,earned};}
// Entitlement is saved BEFORE debiting the shared wallet: storage failure can
// never take diamonds. A failed debit restores the original local record.
export function buySkin(storage,progress,wallet,cost=15){
 if(progress.skin)return {ok:false,reason:'owned'};
 if(!wallet||wallet.read().diamonds<cost)return {ok:false,reason:'funds'};
 const next={...progress,skin:true};if(!saveProgress(storage,next))return {ok:false,reason:'save'};
 try{if(wallet.spendDiamonds(cost))return {ok:true,next};}catch{}
 const rolledBack=saveProgress(storage,progress);
 return {ok:false,reason:'save',next:rolledBack?progress:next};
}
