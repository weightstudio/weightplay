import {validTimeZone,deviceTimeZone,dayKey,nextMidnight,firstDateAfter,isActivityOpen,nextOpening,openingAtOrAfter} from '../../src/activity-calendar.mjs?v=1';
export {validTimeZone,deviceTimeZone,dayKey,nextMidnight} from '../../src/activity-calendar.mjs?v=1';
import {REWARD_CAMPAIGN,rewardKey,validRewards} from './demon-assault-rewards.mjs?v=20261030-weekdays-1';
import {VERSION as LEGACY_VERSION,STAGES,ammoLimit,AMMO_POLICY} from './demon-assault-v4-physics.mjs?v=20261014-ammo-exact-1';
import {validSave as validLegacy,freshRun,nextStage,settle,launchShot,SAVE_KEY as LEGACY_KEY} from './demon-assault-v4-store.mjs?v=20261014-ammo-exact-1';
export {freshRun,nextStage,settle,launchShot};
export const VERSION='demon-assault-daily-play-1';
export const SAVE_KEY='weightplayDemonAssaultDailyV1';
export const DAILY_REVISION='weekly-open-days-3';
const LOCK=SAVE_KEY+':transaction',DAY=86400000;
export const finished=d=>!!d&&(d.run.status==='empty'||(d.run.status==='cleared'&&d.run.stage===STAGES.length-1));
function normalize(d,stamp,zone){
 if(!d)return null;const next={...d},safeStamp=Math.max(stamp,d.lastSeenAt);
 if(d.schemaVersion===1){
  const oldStart=d.lastQualifiedDay?Date.parse(d.lastQualifiedDay+'T00:00:00+08:00'):0,oldEnd=oldStart?oldStart+DAY:0;
  const today=dayKey(safeStamp,zone),overlap=oldEnd&&(dayKey(oldStart,zone)===today||dayKey(oldEnd-1,zone)===today);
  Object.assign(next,{schemaVersion:2,calendarTimeZone:zone,runTimeZone:d.dayKey?'Asia/Taipei':null,lastQualifiedAt:null,nextEligibleAt:oldEnd});
  // A used legacy date is never converted into a free local-date run. Its old
  // fence is honored, then the first eligible local midnight takes over.
  if(oldEnd&&(oldEnd>safeStamp||overlap))next.nextEligibleAt=Math.max(nextMidnight(Math.max(safeStamp,oldEnd-1),zone),firstDateAfter(d.lastQualifiedDay,zone));
 }
 if(next.calendarTimeZone!==zone){
  next.calendarTimeZone=zone;
  if(next.lastQualifiedDay)next.nextEligibleAt=Math.max(nextMidnight(Math.max(safeStamp,next.nextEligibleAt-1),zone),firstDateAfter(next.lastQualifiedDay,zone));
 }
 if(next.run.ammoPolicy!==AMMO_POLICY){const r={...next.run},spent=r.cap-r.ammo,cap=ammoLimit(r.blocks),invalidPending=r.pending&&r.pending.power>cap;r.ammoCorrection={previousCap:r.cap,previousAmmo:r.ammo,spent,voidedPending:invalidPending?{...r.pending}:null};r.cap=cap;r.ammo=Math.max(0,cap-spent);r.ammoPolicy=AMMO_POLICY;if(invalidPending)r.pending=null;if(!r.ammo&&!r.pending&&r.status==='playing')r.status='empty';next.run=r;}
 return next;
}
export function dailyStatus(raw,now=Date.now(),zone=deviceTimeZone()){
 const d=normalize(raw,now,zone),rollback=!!d&&now<d.lastSeenAt-2000,today=dayKey(now,zone),inProgress=!!d?.dayKey&&!finished(d),fence=d?.lastQualifiedDay?Math.max(d.nextEligibleAt,firstDateAfter(d.lastQualifiedDay,zone)):0,eligible=now>=fence,open=isActivityOpen('demon-assault',now,zone);
 return{revision:DAILY_REVISION,today,dayKey:d?.dayKey||null,timeZone:zone,runTimeZone:d?.runTimeZone||null,clockBlocked:rollback,open,state:rollback?'clock':inProgress?'progress':!open?'closed':eligible?'ready':'done',canStart:!rollback&&!inProgress&&eligible&&open,canFire:!rollback&&!finished(d)&&(!!d?.dayKey||(eligible&&open)),nextAt:openingAtOrAfter('demon-assault',Math.max(nextMidnight(Math.max(now,d?.lastSeenAt||0),zone),fence),zone),afterCurrentRun:inProgress&&eligible&&open,localOnly:true};
}

function valid(d){
 const common=[1,2].includes(d?.schemaVersion)&&d.version===VERSION&&Number.isFinite(d.lastSeenAt)&&d.lastSeenAt>=0&&(d.dayKey===null||/^\d{4}-\d{2}-\d{2}$/.test(d.dayKey))&&(d.lastQualifiedDay===null||/^\d{4}-\d{2}-\d{2}$/.test(d.lastQualifiedDay))&&(d.dayKey===null?d.run?.shots===0:d.dayKey===d.lastQualifiedDay)&&validLegacy({...d,version:LEGACY_VERSION},{allowLegacyCapacity:true});
 return common&&validRewards(d.rewards)&&(d.run.rewardCampaign===undefined||d.run.rewardCampaign===REWARD_CAMPAIGN)&&(d.schemaVersion===1||(validTimeZone(d.calendarTimeZone)&&(d.dayKey?validTimeZone(d.runTimeZone):d.runTimeZone===null)&&Number.isFinite(d.nextEligibleAt)&&d.nextEligibleAt>=0&&(d.lastQualifiedAt===null||Number.isFinite(d.lastQualifiedAt))));
}
export function makeDailyStore({storage,locks,now=Date.now,timeZone=deviceTimeZone}){
 const zone=()=>{const z=typeof timeZone==='function'?timeZone():timeZone;if(!validTimeZone(z))throw Error('TIME_ZONE_INVALID');return z;};
 const readRaw=()=>{const raw=storage.getItem(SAVE_KEY);if(raw===null)return null;let d;try{d=JSON.parse(raw);}catch{throw Error('CORRUPT_DAILY_SAVE');}if(!valid(d))throw Error('CORRUPT_DAILY_SAVE');return d;};
 const read=()=>normalize(readRaw(),now(),zone());
 async function transact(change,{allowNew=false}={}){
  if(!locks?.request)throw Error('WEB_LOCKS_REQUIRED');
  return locks.request(LOCK,async()=>{
   const raw=readRaw(),stamp=now(),tz=zone();if(!Number.isFinite(stamp))throw Error('CLOCK_INVALID');
   const old=normalize(raw,stamp,tz),oldStatus=dailyStatus(old,stamp,tz),copy=old&&JSON.parse(JSON.stringify(old));let next=change(copy);
   if(!next){if(JSON.stringify(raw)===JSON.stringify(old))return{state:old,changed:false};next=old;}
   if(!next)return{state:null,changed:false};
   const newRun=!!old&&next.run.id!==old.run.id,fire=next.run.shots>(old?.run.shots||0);
   if(old?.dayKey&&!newRun&&(next.run.ammo>old.run.ammo||next.run.cap!==old.run.cap||next.run.blocks!==old.run.blocks||next.run.shots<old.run.shots))throw Error('DAILY_RESOURCE_REFILL_FORBIDDEN');
   if(newRun&&(!allowNew||!oldStatus.canStart))throw Error('DAILY_RUN_ALREADY_USED');
   if(fire&&oldStatus.clockBlocked)throw Error('CLOCK_ROLLBACK');
   if(fire&&old&&(!Number.isSafeInteger(next.run.pending?.power)||next.run.pending.power<1||next.run.pending.power>old.run.ammo||old.run.pending||next.run.shots!==old.run.shots+1||next.run.ammo!==old.run.ammo-next.run.pending.power))throw Error('INVALID_SHOT_COST');
   if(fire&&finished(old))throw Error('DAILY_RUN_FINISHED');
   if(fire&&!old?.dayKey&&!oldStatus.canStart)throw Error(oldStatus.open?'DAILY_RUN_ALREADY_USED':'ACTIVITY_CLOSED');
   next.schemaVersion=2;next.version=VERSION;next.revision=(old?.revision||0)+1;next.lastSeenAt=Math.max(stamp,old?.lastSeenAt||0);
   next.calendarTimeZone=old?.calendarTimeZone||tz;next.runTimeZone=newRun?null:(old?.runTimeZone||null);
   next.dayKey=newRun?null:(old?.dayKey||null);next.lastQualifiedDay=old?.lastQualifiedDay||null;next.lastQualifiedAt=old?.lastQualifiedAt||null;next.nextEligibleAt=old?.nextEligibleAt||0;
   if(fire&&!next.dayKey){next.dayKey=dayKey(stamp,tz);next.lastQualifiedDay=next.dayKey;next.lastQualifiedAt=stamp;next.runTimeZone=tz;next.nextEligibleAt=nextMidnight(stamp,tz);}
   // Eligibility and the earned outbox commit with the actual lethal hit.
   // Historical preview milestones are never converted into payable rewards.
   if(old?.dayKey&&old.run.rewardCampaign===REWARD_CAMPAIGN&&old.run.pending&&old.run.hp>0&&next.run.hp===0&&next.run.status==='cleared'&&next.run.id===old.run.id&&next.run.stage===old.run.stage){
    const key=rewardKey(old.dayKey,old.run.stage);
    next.rewards={...(old.rewards||{}),[key]:old.rewards?.[key]||{campaign:REWARD_CAMPAIGN,day:old.dayKey,stage:old.run.stage,amount:STAGES[old.run.stage].reward,runId:old.run.id,earnedAt:stamp}};
   }
   if(!valid(next))throw Error('INVALID_DAILY_TRANSITION');storage.setItem(SAVE_KEY,JSON.stringify(next));return{state:next,changed:true};
  });
 }
 async function open(blocks,{rewardable=false}={}){return transact(d=>{
  if(d){const activated=rewardable&&!d.run.rewardCampaign&&d.run.cap<=ammoLimit(blocks);if(activated){d.run.rewardCampaign=REWARD_CAMPAIGN;}if(!d.dayKey&&!d.run.shots&&!d.run.pending&&d.run.blocks!==ammoLimit(blocks))return{...d,run:{...d.run,...freshRun(blocks),rewardCampaign:rewardable?REWARD_CAMPAIGN:undefined,id:d.run.id}};if(finished(d)&&dailyStatus(d,now(),zone()).canStart&&d.dayKey)return{...d,run:{...freshRun(blocks),rewardCampaign:rewardable?REWARD_CAMPAIGN:undefined},dayKey:null,runTimeZone:null};return activated?d:null;}
  let legacy=null;try{const raw=JSON.parse(storage.getItem(LEGACY_KEY)||'null');if(validLegacy(raw,{allowLegacyCapacity:true}))legacy=raw;}catch{}
  if(legacy&&!finished(legacy)){const migrated=normalize({schemaVersion:2,version:VERSION,revision:legacy.revision,run:legacy.run,milestones:legacy.milestones,lastSeenAt:now(),calendarTimeZone:zone(),runTimeZone:null,dayKey:null,lastQualifiedDay:null,lastQualifiedAt:null,nextEligibleAt:0},now(),zone());return{run:migrated.run,milestones:legacy.milestones};}
  return{run:{...freshRun(blocks),rewardCampaign:rewardable?REWARD_CAMPAIGN:undefined},milestones:{},rewards:{}};
 },{allowNew:true});}
 return{read,transaction:transact,open};
}
const current=()=>makeDailyStore({storage:localStorage,locks:navigator.locks});
export const readSave=()=>current().read();
export const transaction=(change,options)=>current().transaction(change,options);
export const openSession=(blocks,options)=>current().open(blocks,options);
