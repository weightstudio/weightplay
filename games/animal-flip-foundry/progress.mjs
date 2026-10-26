export const CAMPAIGN_KEY='wp-flip-campaign-v18';
export function sanitizeProgress(raw,total){
  const cleared={};for(const [id,row]of Object.entries(raw?.cleared||{})){
    const n=Number(id);if(!Number.isInteger(n)||n<1||n>total||row?.win!==true)continue;
    cleared[n]={win:true,attempts:Math.max(1,Math.floor(Number(row.attempts)||1))};
  }
  // Original six courses were freely accessible and had no completion history.
  let unlocked=Math.min(6,total);while(unlocked<total&&cleared[unlocked])unlocked++;
  return {version:18,unlocked,cleared};
}
export function readProgress(storage,total){try{return sanitizeProgress(JSON.parse(storage.getItem(CAMPAIGN_KEY)||'null'),total);}catch{return sanitizeProgress(null,total);}}
export function completeStage(progress,id,attempts,total){
  if(!Number.isInteger(id)||id<1||id>total||id>progress.unlocked)return progress;
  return sanitizeProgress({...progress,cleared:{...progress.cleared,[id]:{win:true,attempts:Math.min(progress.cleared[id]?.attempts||Infinity,attempts)}}},total);
}
export function persistProgress(storage,progress,total){
  // Union current persisted clears at the write boundary; a second tab cannot
  // roll back a completed room. Quota failure retains this session's progress.
  const existing=readProgress(storage,total),merged={...existing.cleared};
  for(const [id,row]of Object.entries(progress.cleared))merged[id]={win:true,attempts:Math.min(row.attempts,merged[id]?.attempts||Infinity)};
  const next=sanitizeProgress({cleared:merged},total);try{storage.setItem(CAMPAIGN_KEY,JSON.stringify(next));}catch{}
  return next;
}
