export const PROGRESS_KEY='weightplay-grove-campaign-progress-1';
export function normalizeProgress(raw,total=30){
  let value;try{value=typeof raw==='string'?JSON.parse(raw):raw;}catch{value=null;}
  const best={};
  for(const [key,score] of Object.entries(value?.best||{})){
    const id=Number(key);
    if(Number.isInteger(id)&&id>=1&&id<=total&&Number.isSafeInteger(score)&&score>0)best[id]=score;
  }
  // Unlocks are derived from contiguous completion, never from an untrusted
  // saved selected/unlocked index. Historical prototype scores remain intact.
  let unlocked=1;while(unlocked<total&&best[unlocked])unlocked++;
  return {schema:1,unlocked,best};
}
export function completeStage(progress,id,picks,total=30){
  const current=normalizeProgress(progress,total);
  if(!Number.isInteger(id)||id<1||id>current.unlocked||id>total||!Number.isSafeInteger(picks)||picks<1)throw new Error('Invalid stage completion');
  return normalizeProgress({...current,best:{...current.best,[id]:Math.min(current.best[id]??Infinity,picks)}},total);
}
