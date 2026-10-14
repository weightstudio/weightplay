import {VERSION as LEGACY_VERSION,STAGES} from './demon-assault-v4-physics.mjs';
import {validSave as validLegacy,freshRun,nextStage,settle,SAVE_KEY as LEGACY_KEY} from './demon-assault-v4-store.mjs';
export {freshRun,nextStage,settle};
export const VERSION='demon-assault-daily-play-1';
export const SAVE_KEY='weightplayDemonAssaultDailyV1';
const LOCK=SAVE_KEY+':transaction',DAY=86400000,TAIPEI=8*3600000;
export const dayKey=now=>new Date(now+TAIPEI).toISOString().slice(0,10);
export const nextMidnight=now=>Math.floor((now+TAIPEI)/DAY)*DAY+DAY-TAIPEI;
export const finished=d=>!!d&&(d.run.status==='empty'||(d.run.status==='cleared'&&d.run.stage===STAGES.length-1));
export function dailyStatus(d,now=Date.now()){
 const rollback=!!d&&now<d.lastSeenAt-2000;
 const today=dayKey(now),inProgress=!!d?.dayKey&&!finished(d),usedToday=!!d?.lastQualifiedDay&&today<=d.lastQualifiedDay;
 return{today,dayKey:d?.dayKey||null,clockBlocked:rollback,state:rollback?'clock':inProgress?'progress':usedToday?'done':'ready',
  canStart:!rollback&&!inProgress&&!usedToday,canFire:!rollback&&!finished(d),nextAt:nextMidnight(Math.max(now,d?.lastSeenAt||0)),localOnly:true};
}
function valid(d){return d?.schemaVersion===1&&d.version===VERSION&&Number.isFinite(d.lastSeenAt)&&d.lastSeenAt>=0
 &&(d.dayKey===null||/^\d{4}-\d{2}-\d{2}$/.test(d.dayKey))
 &&(d.lastQualifiedDay===null||/^\d{4}-\d{2}-\d{2}$/.test(d.lastQualifiedDay))
 &&(d.dayKey===null?d.run?.shots===0:d.dayKey===d.lastQualifiedDay)
 &&validLegacy({...d,version:LEGACY_VERSION});}
export function makeDailyStore({storage,locks,now=Date.now}){
 const read=()=>{const raw=storage.getItem(SAVE_KEY);if(raw===null)return null;let d;try{d=JSON.parse(raw);}catch{throw Error('CORRUPT_DAILY_SAVE');}if(!valid(d))throw Error('CORRUPT_DAILY_SAVE');return d;};
 async function transact(change,{allowNew=false}={}){
  if(!locks?.request)throw Error('WEB_LOCKS_REQUIRED');
  return locks.request(LOCK,async()=>{
   const old=read(),stamp=now();if(!Number.isFinite(stamp))throw Error('CLOCK_INVALID');
   const oldStatus=dailyStatus(old,stamp),copy=old&&JSON.parse(JSON.stringify(old)),next=change(copy);
   if(!next)return{state:old,changed:false};
   const newRun=!!old&&next.run.id!==old.run.id,fire=next.run.shots>(old?.run.shots||0);
   if(old?.dayKey&&!newRun&&(next.run.ammo>old.run.ammo||next.run.cap!==old.run.cap||next.run.blocks!==old.run.blocks||next.run.shots<old.run.shots))throw Error('DAILY_RESOURCE_REFILL_FORBIDDEN');
   if(newRun&&(!allowNew||!oldStatus.canStart))throw Error('DAILY_RUN_ALREADY_USED');
   if(fire&&oldStatus.clockBlocked)throw Error('CLOCK_ROLLBACK');
   if(fire&&finished(old))throw Error('DAILY_RUN_FINISHED');
   if(fire&&!old?.dayKey&&old?.lastQualifiedDay&&dayKey(stamp)<=old.lastQualifiedDay)throw Error('DAILY_RUN_ALREADY_USED');
   // Preserve old-day resources through midnight. The first shot, not viewing,
   // assigns the day and freezes the run's original cap in this same write.
   next.schemaVersion=1;next.version=VERSION;next.revision=(old?.revision||0)+1;
   next.lastSeenAt=Math.max(stamp,old?.lastSeenAt||0);
   next.dayKey=newRun?null:(old?.dayKey||next.dayKey||null);
   next.lastQualifiedDay=old?.lastQualifiedDay||next.lastQualifiedDay||null;
   if(fire&&!next.dayKey){next.dayKey=dayKey(stamp);next.lastQualifiedDay=next.dayKey;}
   if(!valid(next))throw Error('INVALID_DAILY_TRANSITION');
   storage.setItem(SAVE_KEY,JSON.stringify(next));return{state:next,changed:true};
  });
 }
 async function open(blocks){
  return transact(d=>{
   if(d){if(finished(d)&&dailyStatus(d,now()).canStart)return{...d,run:freshRun(blocks),dayKey:null};return null;}
   let legacy=null;try{const raw=JSON.parse(storage.getItem(LEGACY_KEY)||'null');if(validLegacy(raw))legacy=raw;}catch{}
   // Existing active V4 progress is copied without touching its original save.
   // Prior shots already spent a run; conservatively bind that migrated run today.
   if(legacy&&!finished(legacy))return{run:legacy.run,milestones:legacy.milestones,dayKey:legacy.run.shots?dayKey(now()):null,lastQualifiedDay:legacy.run.shots?dayKey(now()):null};
   return{run:freshRun(blocks),milestones:{},dayKey:null,lastQualifiedDay:null};
  },{allowNew:true});
 }
 return{read,transaction:transact,open};
}
const current=()=>makeDailyStore({storage:localStorage,locks:navigator.locks});
export const readSave=()=>current().read();
export const transaction=(change,options)=>current().transaction(change,options);
export const openSession=blocks=>current().open(blocks);
