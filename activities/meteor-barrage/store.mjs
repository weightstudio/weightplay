import {validRun,freshRun} from './physics.mjs?v=3';
import {deviceTimeZone,validTimeZone,dayKey,nextMidnight,firstDateAfter,isActivityOpen,openingAtOrAfter} from '../../src/activity-calendar.mjs?v=1';
import {REWARD_CAMPAIGN,WAVE_REWARDS,rewardKey,validRewards} from './rewards.mjs?v=1';
export const SAVE_KEY='weightplayMeteorBarrageV1';
const clone=value=>JSON.parse(JSON.stringify(value));
const terminal=run=>!run||['won','lost'].includes(run.status);
const emptyDaily=()=>({day:null,runId:null,lastQualifiedDay:null,lastSeenAt:0,timeZone:deviceTimeZone(),runTimeZone:null,nextEligibleAt:0});
export const emptySave=()=>({schema:2,revision:0,best:0,wins:0,skin:'standard',run:null,challenge:null,daily:emptyDaily(),rewards:{}});
function validDaily(d){return d&&[d.day,d.lastQualifiedDay].every(v=>v===null||/^\d{4}-\d{2}-\d{2}$/.test(v))&&(d.runId===null||typeof d.runId==='string'&&d.runId.length>0)&&Number.isFinite(d.lastSeenAt)&&d.lastSeenAt>=0&&Number.isFinite(d.nextEligibleAt)&&d.nextEligibleAt>=0&&validTimeZone(d.timeZone)&&(d.runTimeZone===null||validTimeZone(d.runTimeZone))&&(d.day===null||(d.day===d.lastQualifiedDay&&!!d.runId&&!!d.runTimeZone));}
export function validSave(d){
 const base=[1,2].includes(d?.schema)&&['revision','best','wins'].every(k=>Number.isSafeInteger(d[k])&&d[k]>=0)&&['standard','violet'].includes(d.skin)&&(d.skin!=='violet'||d.wins>0)&&(d.run===null||validRun(d.run));
 return base&&(d.schema===1||(validDaily(d.daily)&&validRewards(d.rewards)&&(d.challenge===null||validRun(d.challenge)&&d.challenge.mode==='challenge'&&typeof d.challenge.id==='string'&&d.challenge.id.length>0)&&(d.daily.day===null||d.challenge?.id===d.daily.runId)));
}
export function readSave(storage){
 const raw=storage.getItem(SAVE_KEY);if(raw===null)return emptySave();
 let d;try{d=JSON.parse(raw);}catch{throw Error('CORRUPT_SAVE');}if(!validSave(d))throw Error('CORRUPT_SAVE');
 if(d.schema===1){
  const run=d.run?.mode==='challenge'?{...d.run,id:'legacy:'+d.revision}:d.run;
  d={...d,schema:2,run,challenge:run?.mode==='challenge'?clone(run):null,daily:emptyDaily(),rewards:{}};
 }
 return d;
}
function normalizeDaily(d,now,zone){
 const result={...d},safe=Math.max(now,d.lastSeenAt);
 if(result.timeZone!==zone){result.timeZone=zone;if(result.lastQualifiedDay)result.nextEligibleAt=Math.max(nextMidnight(Math.max(safe,result.nextEligibleAt-1),zone),firstDateAfter(result.lastQualifiedDay,zone));}
 return result;
}
export function dailyStatus(save,now=Date.now(),zone=deviceTimeZone()){
 if(!Number.isFinite(now)||!validTimeZone(zone))throw Error('CLOCK_INVALID');
 const d=normalizeDaily(save.daily,now,zone),open=isActivityOpen('meteor-barrage',now,zone),clockBlocked=now<d.lastSeenAt-2000,inProgress=!!d.day&&!terminal(save.challenge);
 const fence=d.lastQualifiedDay?Math.max(d.nextEligibleAt,firstDateAfter(d.lastQualifiedDay,zone)):0,eligible=now>=fence;
 return{today:dayKey(now,zone),dayKey:d.day,timeZone:zone,open,clockBlocked,inProgress,state:clockBlocked?'clock':inProgress?'progress':!open?'closed':eligible?'ready':'done',canStart:!clockBlocked&&!inProgress&&eligible&&open,canFire:!clockBlocked&&!terminal(save.challenge)&&(!!d.day||(eligible&&open)),nextAt:openingAtOrAfter('meteor-barrage',Math.max(nextMidnight(Math.max(now,d.lastSeenAt),zone),fence),zone)};
}
export function makeStore(storage,locks,{now=Date.now,timeZone=deviceTimeZone}={}){
 const zone=()=>typeof timeZone==='function'?timeZone():timeZone;
 const read=()=>readSave(storage);
 async function mutate(next,expected,{beginBlocks}={}){
  if(!locks?.request)throw Error('LOCKS_UNAVAILABLE');
  return locks.request(SAVE_KEY,()=>{
   const before=read();if(before.revision!==expected)throw Error('SAVE_CONFLICT');
   const stamp=now(),tz=zone(),status=dailyStatus(before,stamp,tz);
   const after={...next,schema:2,revision:before.revision+1,best:Math.max(before.best,next.best),wins:Math.max(before.wins,next.wins),daily:normalizeDaily(before.daily,stamp,tz),challenge:before.challenge&&clone(before.challenge),rewards:clone(before.rewards)};
   if(beginBlocks!==undefined){
    if(!terminal(before.challenge)){after.run=clone(before.challenge);if(!before.daily.day&&before.challenge.shots===0&&status.canStart)after.run={...freshRun(beginBlocks,'challenge'),id:before.challenge.id};}
    else{
     if(!status.canStart)throw Error(status.clockBlocked?'CLOCK_ROLLBACK':status.open?'DAILY_RUN_ALREADY_USED':'ACTIVITY_CLOSED');
     after.run={...freshRun(beginBlocks,'challenge'),id:crypto.randomUUID()};after.daily.day=null;after.daily.runId=null;after.daily.runTimeZone=null;
    }
    after.challenge=clone(after.run);
   }else if(after.run?.mode==='challenge'){
    const old=before.challenge,r=after.run;
    if(!old||r.id!==old.id)throw Error('CHALLENGE_ID_MISMATCH');
    if(r.cap!==old.cap||r.ammo>old.ammo||r.shots<old.shots)throw Error('DAILY_RESOURCE_REFILL_FORBIDDEN');
    const fired=r.shots>old.shots;
    if(fired){
     if(status.clockBlocked)throw Error('CLOCK_ROLLBACK');
     if(!status.canFire)throw Error(status.open?'DAILY_RUN_ALREADY_USED':'ACTIVITY_CLOSED');
     if(old.status!=='ready'||r.status!=='shooting'||r.wave!==old.wave||r.shots!==old.shots+1||!Number.isSafeInteger(r.shot?.power)||r.ammo!==old.ammo-r.shot.power)throw Error('INVALID_SHOT_COST');
     if(!after.daily.day){after.daily.day=dayKey(stamp,tz);after.daily.lastQualifiedDay=after.daily.day;after.daily.runId=r.id;after.daily.runTimeZone=tz;after.daily.nextEligibleAt=nextMidnight(stamp,tz);}
    }else if(r.ammo!==old.ammo)throw Error('INVALID_SHOT_COST');
    if(old.status==='shooting'&&old.shot&&r.shots===old.shots&&r.wave===old.wave&&['wave-clear','won'].includes(r.status)&&after.daily.day){
     const key=rewardKey(after.daily.day,r.wave);
     after.rewards[key]??={campaign:REWARD_CAMPAIGN,day:after.daily.day,wave:r.wave,amount:WAVE_REWARDS[r.wave],runId:r.id,earnedAt:stamp};
    }
    after.challenge=clone(r);
   }
   after.daily.lastSeenAt=Math.max(stamp,before.daily.lastSeenAt);
   if(!validSave(after))throw Error('INVALID_SAVE');
   const serialized=JSON.stringify(after);
   try{storage.setItem(SAVE_KEY,serialized);}catch(error){if(storage.getItem(SAVE_KEY)!==serialized)throw error;}
   if(storage.getItem(SAVE_KEY)!==serialized)throw Error('SAVE_UNCONFIRMED');
   return after;
  });
 }
 const observe=()=>{const before=read();return mutate(before,before.revision);};
 return{read,observe,write:(next,expected)=>mutate(next,expected),async beginChallenge(blocks){const before=await observe();return mutate(before,before.revision,{beginBlocks:blocks});}};
}
