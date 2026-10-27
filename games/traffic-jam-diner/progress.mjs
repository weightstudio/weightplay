// Historical achievements survive route redesigns. Route times only compete
// against results from the same authored puzzle revision.
export const MILESTONE_STAGES=Object.freeze([5,10,15,20,25,30]);
export const revisionOf=stage=>stage.revision||1;
const validRecord=record=>Number.isInteger(record?.moves)&&record.moves>=0&&Number.isInteger(record?.stars)&&record.stars>=1&&record.stars<=3;
export function preserveAchievements(value,count=30){
 const out={};
 for(let id=1;id<=count;id++){
  const sources=[value.best?.[id],value.routeBest?.[id]].filter(validRecord),permanent=value.achievements?.[id]?.stars;
  const stars=Math.max(Number.isInteger(permanent)&&permanent>=1&&permanent<=3?permanent:0,...sources.map(record=>record.stars));
  if(stars)out[id]={stars};
 }
 return out;
}
export function preserveRouteHistory(value,stages){
 const out={};
 for(const stage of stages){
  const records={...value.routeHistory?.[stage.id]},current=value.routeBest?.[stage.id];
  if(validRecord(current)&&Number.isInteger(current.revision)&&current.revision>=1&&current.revision!==revisionOf(stage))records[current.revision]={moves:current.moves,stars:current.stars};
  for(const [revision,record] of Object.entries(records))if(Number.isInteger(Number(revision))&&Number(revision)>=1&&validRecord(record)){out[stage.id]??={};out[stage.id][revision]={moves:record.moves,stars:record.stars};}
 }
 return out;
}
export function cleanRouteBest(records,stages){
 const out={};
 for(const [id,record] of Object.entries(records||{})){
  const stage=stages[Number(id)-1];
  if(!stage||!Number.isInteger(record?.revision)||record.revision!==revisionOf(stage)||!Number.isInteger(record.moves)||record.moves<0||!Number.isInteger(record.stars)||record.stars<1||record.stars>3)continue;
  out[id]={revision:record.revision,moves:record.moves,stars:record.stars};
 }
 return out;
}
export function currentBest(save,stage){
 if(revisionOf(stage)===1)return save.best?.[stage.id]||null;
 const record=save.routeBest?.[stage.id];
 return record?.revision===revisionOf(stage)?record:null;
}
export function totalEarnedStars(save,count=30){
 let total=0;
 for(let id=1;id<=count;id++)total+=Math.max(save.achievements?.[id]?.stars||0,save.best?.[id]?.stars||0,save.routeBest?.[id]?.stars||0);
 return total;
}
export function earnedMilestones(save){
 return MILESTONE_STAGES.filter(id=>Boolean(save.achievements?.[id]?.stars||save.best?.[id]||save.routeBest?.[id]));
}
export function recordClear(save,stage,moves,stars){
 const before=earnedMilestones(save),revision=revisionOf(stage),previous=currentBest(save,stage);
 const record={moves:Math.min(previous?.moves??Infinity,moves),stars:Math.max(previous?.stars||0,stars)};
 if(revision===1)save.best[stage.id]=record;
 else{save.routeBest??={};save.routeBest[stage.id]={...record,revision};}
 save.achievements??={};save.achievements[stage.id]={stars:Math.max(save.achievements[stage.id]?.stars||0,stars)};
 return {record,newMilestones:earnedMilestones(save).filter(id=>!before.includes(id))};
}
