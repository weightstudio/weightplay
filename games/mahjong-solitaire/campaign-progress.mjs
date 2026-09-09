import {MAHJONG_CAMPAIGN,startMahjongStage} from './campaign-stages.mjs';
import {removeCampaignPair,campaignOutcome} from './campaign-engine.mjs';

export const MAHJONG_PROGRESS_KEY='weightplay-mahjong-campaign-progress-1';
const total=MAHJONG_CAMPAIGN.length;
const count=n=>Number.isSafeInteger(n)&&n>=0&&n<=1000000;
const rating=run=>3-Number(run.hints>0)-Number(run.undos>0);

export function normalizeMahjongProgress(raw) {
 let value;try{value=typeof raw==='string'?JSON.parse(raw):raw;}catch{value=null;}
 const best={};
 if(value?.schema===1&&value.best&&typeof value.best==='object'&&!Array.isArray(value.best))
  for(const [key,run] of Object.entries(value.best)){
   const id=Number(key);
   if(String(id)!==key||!Number.isInteger(id)||id<1||id>total||!run||!count(run.hints)||!count(run.undos))continue;
   best[id]={hints:run.hints,undos:run.undos,stars:rating(run)};
  }
 let unlocked=1;while(unlocked<total&&best[unlocked])unlocked++;
 return {schema:1,best,unlocked};
}

export function completeMahjongStage(progress,id,finished,{hints=0,undos=0}={}) {
 const current=normalizeMahjongProgress(progress);
 if(!Number.isInteger(id)||id<1||id>current.unlocked||!count(hints)||!count(undos))throw new Error('Invalid campaign completion');
 // Revalidate the engine's bounded final history against the actual authored
 // stage. A different stage, partial board or duplicated removal cannot unlock.
 let replay=startMahjongStage(id);
 if(!Array.isArray(finished?.history)||finished.history.length!==replay.tiles.length/2)throw new Error('Incomplete campaign run');
 for(const pair of finished.history){
  if(!Array.isArray(pair)||pair.length!==2)throw new Error('Invalid completed pair');
  const result=removeCampaignPair(replay,...pair);if(!result.ok)throw new Error('Invalid completed pair');replay=result.state;
 }
 if(campaignOutcome(replay)!=='complete'||campaignOutcome(finished)!=='complete')throw new Error('Incomplete campaign run');
 const run={hints,undos},old=current.best[id];
 const better=!old||rating(run)>rating(old)||(rating(run)===rating(old)&&(hints<old.hints||(hints===old.hints&&undos<old.undos)));
 return normalizeMahjongProgress({schema:1,best:{...current.best,[id]:better?run:old}});
}

// Storage errors do not make the current session unplayable. Caller retains
// the returned progress in memory and shows the localized persistence notice.
export function loadMahjongProgress(storage) {
 try{return {progress:normalizeMahjongProgress(storage.getItem(MAHJONG_PROGRESS_KEY)),persistent:true};}
 catch{return {progress:normalizeMahjongProgress(null),persistent:false};}
}
export function saveMahjongProgress(storage,progress) {
 const normalized=normalizeMahjongProgress(progress);
 try{storage.setItem(MAHJONG_PROGRESS_KEY,JSON.stringify(normalized));return {progress:normalized,persistent:true};}
 catch{return {progress:normalized,persistent:false};}
}
