import {stageById} from './stage-config.mjs';

export const SAVE_KEY = 'weightplay:lantern-stride:progress:v1';
const SAVE_LOCK = 'weightplay-lantern-stride-progress-v1';
export const REWARD_KEY = 'weightplay:lantern-stride:pending-rewards:v1';
const validRewardToken = value => typeof value==='string' && /^[0-9a-f]{32}$/.test(value);
function newRewardToken(){const bytes=new Uint8Array(16);globalThis.crypto.getRandomValues(bytes);return Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('')}
const blank = () => ({ schemaVersion: 1, records: {}, equippedShoe: 'balanced', equippedTrail: 'default', tutorialComplete: false, revision: 0 });
// Samples are tenths of a metre at whole seconds. Reject stale routes and
// implausible or truncated recordings without discarding the original score.
function validTrace(id, time, value) {
  const stage=stageById(id);
  if(!stage||!value||value.route!==stage.route.join(',')||!Number.isFinite(time)||time<1||time>stage.limit||
     !Array.isArray(value.samples)||value.samples.length!==Math.floor(time)+1||value.samples.length>stage.limit+1||value.samples[0]!==0)return null;
  let previous=0;
  for(const sample of value.samples){
    if(!Number.isInteger(sample)||sample<previous||sample>stage.distance*10||sample-previous>84)return null;
    previous=sample;
  }
  if(stage.distance*10-previous>Math.ceil((time-Math.floor(time)+.05)*80)+2)return null;
  return {route:value.route,samples:value.samples.slice()};
}
export function normalize(value) {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const result = blank();
  for (let id=1; id<=60; id++) {
    const record = source.records?.[id];
    if (record?.cleared === true && Number.isFinite(record.bestTime) && record.bestTime >= 0 && record.bestTime <= 86400) {
      result.records[id] = {cleared:true, bestTime:record.bestTime, stars:Math.min(3,Math.max(1,Math.floor(Number(record.stars)||1)))};
      if(validRewardToken(record.rewardToken))result.records[id].rewardToken=record.rewardToken;
      const best=validTrace(id,record.bestTime,record.bestTrace);
      if(best)result.records[id].bestTrace=best;
      else {
        const reference=record.referenceRun, trace=reference&&reference.time>=record.bestTime&&validTrace(id,reference.time,reference.trace);
        if(trace)result.records[id].referenceRun={time:reference.time,trace};
      }
    }
  }
  const allowed = ['balanced'];
  if (result.records[5]) allowed.push('steady');
  if (result.records[15]) allowed.push('swift');
  result.equippedShoe = allowed.includes(source.equippedShoe) ? source.equippedShoe : 'balanced';
  result.equippedTrail = source.equippedTrail === 'star' ? 'star' : 'default';
  result.tutorialComplete = source.tutorialComplete === true;
  result.revision = Number.isSafeInteger(source.revision) && source.revision >= 0 ? source.revision : 0;
  return result;
}
export function highestUnlocked(progress) {
  let id=1;
  while (id<60 && progress.records[id]?.cleared) id++;
  return id;
}
export function createStore(options = {}) {
  let storage, locks;
  try { storage = Object.hasOwn(options,'storage') ? options.storage : globalThis.localStorage; } catch { storage = null; }
  try { locks = Object.hasOwn(options,'locks') ? options.locks : globalThis.navigator?.locks; } catch { locks = null; }
  let current = blank(), available = true, error = null, progressError = null;
  const plain=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
  function parseProgress(raw){
    const value=JSON.parse(raw), top=new Set(['schemaVersion','records','equippedShoe','equippedTrail','tutorialComplete','revision']);
    if(!plain(value)||Object.keys(value).some(key=>!top.has(key))||(value.schemaVersion!==undefined&&value.schemaVersion!==1)||
       (value.records!==undefined&&!plain(value.records)))throw Error('PROGRESS_UNREADABLE');
    const records=value.records||{},fields=new Set(['cleared','bestTime','stars','rewardToken','bestTrace','referenceRun']);
    if((value.equippedShoe!==undefined&&!['balanced','steady','swift'].includes(value.equippedShoe))||
       (value.equippedShoe==='steady'&&!records[5])||(value.equippedShoe==='swift'&&!records[15])||
       (value.equippedTrail!==undefined&&!['default','star'].includes(value.equippedTrail))||
       (value.tutorialComplete!==undefined&&typeof value.tutorialComplete!=='boolean')||
       (value.revision!==undefined&&(!Number.isSafeInteger(value.revision)||value.revision<0)))throw Error('PROGRESS_UNREADABLE');
    const traceShape=t=>plain(t)&&Object.keys(t).every(k=>k==='route'||k==='samples')&&typeof t.route==='string'&&Array.isArray(t.samples)&&t.samples.every(Number.isInteger);
    for(const [id,record] of Object.entries(records)){
      if(!/^(?:[1-9]|[1-5][0-9]|60)$/.test(id)||!plain(record)||Object.keys(record).some(key=>!fields.has(key))||
         record.cleared!==true||!Number.isFinite(record.bestTime)||record.bestTime<0||record.bestTime>86400||
         (record.stars!==undefined&&(!Number.isInteger(record.stars)||record.stars<1||record.stars>3))||
         (record.rewardToken!==undefined&&!validRewardToken(record.rewardToken))||
         (record.bestTrace!==undefined&&!traceShape(record.bestTrace))||
         (record.referenceRun!==undefined&&(!plain(record.referenceRun)||Object.keys(record.referenceRun).some(k=>k!=='time'&&k!=='trace')||!Number.isFinite(record.referenceRun.time)||!traceShape(record.referenceRun.trace))))throw Error('PROGRESS_UNREADABLE');
    }
    return normalize(value);
  }
  function read() {
    try {const raw=storage.getItem(SAVE_KEY), result=raw===null?blank():parseProgress(raw);progressError=null;return result;}
    catch (err) {available=false;progressError=err;error=err;return current;}
  }
  current=read();
  function readRewards(){const raw=storage.getItem(REWARD_KEY);if(raw===null)return {schemaVersion:1,pending:{}};let value;try{value=JSON.parse(raw)}catch{throw Error('REWARD_UNREADABLE')}if(!value||typeof value!=='object'||Array.isArray(value)||value.schemaVersion!==1||!value.pending||typeof value.pending!=='object'||Array.isArray(value.pending))throw Error('REWARD_UNREADABLE');for(const [id,pending] of Object.entries(value.pending))if(!/^(?:[1-9]|[1-5][0-9]|60)$/.test(id)||!validRewardToken(pending))throw Error('REWARD_UNREADABLE');return value;}
  function writeRewards(value){const encoded=JSON.stringify(value);storage.setItem(REWARD_KEY,encoded);if(storage.getItem(REWARD_KEY)!==encoded)throw Error('REWARD_READBACK_MISMATCH')}
  async function mutate(change, rewardIntent=null) {
    if (!locks?.request) return {ok:false, reason:'locks'};
    let entered=false,expired=false,timer;const controller=typeof AbortController==='function'?new AbortController():null;
    try {
      const request=locks.request(SAVE_LOCK,controller?{signal:controller.signal}:{},async () => {
        if(expired)return {ok:false,reason:'locks'};entered=true;clearTimeout(timer);
        available=true; const fresh=read(); if (!available) return {ok:false,reason:'storage'};
        const next=normalize(change(fresh)); next.revision=fresh.revision+1; if(rewardIntent!==null){const queue=readRewards();queue.pending[rewardIntent.id]=rewardIntent.token;writeRewards(queue)}
        const encoded=JSON.stringify(next); storage.setItem(SAVE_KEY,encoded);
        if (storage.getItem(SAVE_KEY)!==encoded) throw new Error('SAVE_READBACK_MISMATCH');
        current=next; error=null; return {ok:true,progress:current};
      });
      const timeout=new Promise(resolve=>{timer=setTimeout(()=>{expired=true;controller?.abort();resolve({ok:false,reason:'locks'})},4000)});
      return await Promise.race([request,timeout]);
    } catch (err) { error=err; return {ok:false,reason:entered?'storage':'locks'}; }
    finally {clearTimeout(timer)}
  }
  return {
    get progress(){return current;}, get error(){return error;}, get progressError(){return progressError;}, refresh(){available=true;current=read();return current;},
    complete(stageId, outcome) {
      if (!Number.isInteger(stageId) || stageId < 1 || stageId > 60 || outcome?.won !== true || !Number.isFinite(outcome.elapsed) || outcome.elapsed < 0 || outcome.elapsed > 86400 || !Number.isInteger(outcome.stars) || outcome.stars < 1 || outcome.stars > 3) return Promise.resolve({ok:false,reason:'invalid'});
      let token;try{token=newRewardToken()}catch{return Promise.resolve({ok:false,reason:'token'})}
      return mutate(p => {
        if (stageId > highestUnlocked(p)) throw new Error('STAGE_LOCKED');
        const old=p.records[stageId], faster=!old||outcome.elapsed<old.bestTime, equal=!!old&&outcome.elapsed===old.bestTime;
        p.records[stageId]={cleared:true,bestTime:faster?outcome.elapsed:old.bestTime,stars:Math.max(old?.stars || 0,outcome.stars),rewardToken:token};
        const trace=validTrace(stageId,outcome.elapsed,outcome.bestTrace);
        const best=(faster||(equal&&trace))?trace:old?.bestTrace;
        if(best)p.records[stageId].bestTrace=best;
        else {
          // A faster score without a valid trajectory must not erase the
          // earlier, still-valid recording. Label it as a reference rather
          // than claiming it represents the new best time.
          let reference=old?.referenceRun||(old?.bestTrace?{time:old.bestTime,trace:old.bestTrace}:null);
          if(trace&&!faster&&(!reference||outcome.elapsed<reference.time))reference={time:outcome.elapsed,trace};
          if(reference)p.records[stageId].referenceRun=reference;
        }
        return p;
      }, {id:stageId,token});
    },
    async flushRewards(claim,preferred=0){if(!locks?.request)return {ok:false,reason:'locks'};let entered=false,expired=false,timer;try{const request=locks.request(SAVE_LOCK,{ifAvailable:true},lock=>{if(expired||!lock)return {ok:false,reason:'locks'};entered=true;available=true;const fresh=read();if(!available)return {ok:false,reason:'storage'};const queue=readRewards(),delivered=[];if(Number.isInteger(preferred)&&preferred>=1&&preferred<=60&&fresh.records[preferred]?.cleared&&!Object.hasOwn(queue.pending,preferred)){try{claim(preferred)}catch{}}for(let id=1;id<=60;id++){const token=queue.pending[id];if(!token||fresh.records[id]?.rewardToken!==token)continue;let result;try{result=claim(id)}catch{continue}if(result?.credited===true||result?.reason==='already-claimed'){delete queue.pending[id];delivered.push(id)}}if(delivered.length)writeRewards(queue);current=fresh;const remaining=Object.keys(queue.pending),unsaved=remaining.filter(id=>fresh.records[id]?.rewardToken!==queue.pending[id]);return {ok:true,delivered,remaining,unsaved};});const timeout=new Promise(resolve=>{timer=setTimeout(()=>{expired=true;resolve({ok:false,reason:'locks'})},4000)});return await Promise.race([request,timeout])}catch(err){error=err;return {ok:false,reason:entered?'storage':'locks'}}finally{clearTimeout(timer)}},
    equip(shoe) {return mutate(p => { if (!['balanced',...(p.records[5]?['steady']:[]),...(p.records[15]?['swift']:[])].includes(shoe)) throw new Error('LOCKED_SHOE'); p.equippedShoe=shoe; return p; });},
    equipTrail(trail, verified) {return mutate(p=>{if(trail==='star'&&!verified)throw new Error('TRAIL_NOT_OWNED');p.equippedTrail=trail==='star'?'star':'default';return p;});},
    completeTutorial() {return mutate(p => {p.tutorialComplete=true;return p;});},
  };
}
