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

// A first-clear reward requires a verified save. Never turn an unreadable or
// future save into an empty one, and preserve fields this version does not own.
export function persistProgressChecked(storage,progress,total,ticket){
  const memory=sanitizeProgress(progress,total);
  let session=memory;
  try{
    const raw=storage.getItem(CAMPAIGN_KEY);
    const saved=raw===null?{}:JSON.parse(raw);
    if(!saved||typeof saved!=='object'||Array.isArray(saved)||
       (saved.version!==undefined&&saved.version!==18)||
       (saved.cleared!==undefined&&(!saved.cleared||typeof saved.cleared!=='object'||Array.isArray(saved.cleared))))return {progress:memory,saved:false};
    const existing=sanitizeProgress(saved,total),merged={...existing.cleared};
    for(const [id,row]of Object.entries(memory.cleared))merged[id]={win:true,attempts:Math.min(row.attempts,merged[id]?.attempts||Infinity)};
    const next=sanitizeProgress({cleared:merged},total);
    session=next;
    const entries={...(saved.cleared||{})};
    for(const [id,row]of Object.entries(next.cleared))entries[id]={...(entries[id]&&typeof entries[id]==='object'&&!Array.isArray(entries[id])?entries[id]:{}),...row};
    const serialized=JSON.stringify({...saved,...next,cleared:entries});
    if(storage.getItem(CAMPAIGN_KEY)!==raw)return {progress:next,saved:false};
    storage.setItem(CAMPAIGN_KEY,serialized);
    const readBytes=storage.getItem(CAMPAIGN_KEY);
    if(readBytes!==serialized)return {progress:next,saved:false};
    return ticket?{progress:next,saved:true,confirmation:Object.freeze({ticket,readbackCompleted:true,expectedBytes:serialized,readBytes})}:{progress:next,saved:true};
  }catch{return {progress:session,saved:false};}
}
