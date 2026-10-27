// Game-owned campaign-clear/lifecycle candidate. It is not yet connected to
// runtime. Other XP/coin writers, wallet and cross-tab CAS remain unresolved.
export function createAutoSquadCandidate({storage,key='animal_auto_squad_save',total=60}={}){
  if(!storage||typeof storage.getItem!=='function'||typeof storage.setItem!=='function'||!Number.isSafeInteger(total)||total<31||total>60)throw new TypeError('invalid candidate inputs');
  const rounds=new WeakMap(),receipts=new WeakMap(),snapshots=new WeakMap();
  const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
  const safeInt=(x,min,max)=>Number.isSafeInteger(x)&&x>=min&&x<=max;
  const legacyInt=x=>typeof x==='number'?x:(typeof x==='string'&&/^\d+$/.test(x)?Number(x):NaN);
  function read(){
    try{
      const raw=storage.getItem(key),value=raw===null?{}:JSON.parse(raw);
      if(!object(value)||value.version!==undefined||(value.schemaVersion!==undefined&&value.schemaVersion!==1))return {ok:false,reason:'unsupported-save'};
      if(value.unlockedStage!==undefined&&!safeInt(legacyInt(value.unlockedStage),1,total))return {ok:false,reason:'invalid-frontier'};
      if(value.selectedStage!==undefined&&!safeInt(legacyInt(value.selectedStage),1,total))return {ok:false,reason:'invalid-selection'};
      if(value.completedStages!==undefined&&(!Array.isArray(value.completedStages)||value.completedStages.some(n=>!safeInt(legacyInt(n),1,total))))return {ok:false,reason:'invalid-clears'};
      const completed=[...new Set((value.completedStages||[]).map(legacyInt))].sort((a,b)=>a-b);
      let unlocked=value.unlockedStage===undefined?1:legacyInt(value.unlockedStage);
      // v43 capped its frontier at 30. Only an explicit saved 30 clear permits
      // migration; merely reaching the old final stage does not.
      if(unlocked===30&&completed.includes(30))unlocked=31;
      return {ok:true,raw,value,completed,unlocked};
    }catch{return {ok:false,reason:'unreadable-save'};}
  }
  function begin(stage){
    if(!safeInt(stage,1,total))throw new TypeError('invalid stage');
    const prior=read(),token=Object.freeze({});
    // If the pre-round save is unknown, or already shows this clear, do not
    // promise a first-clear reward to the shared collector.
    rounds.set(token,{stage,ended:false,attempted:false,rewardEligible:prior.ok&&!prior.completed.includes(stage)});return token;
  }
  function start(token){const round=rounds.get(token);return !round||round.ended?null:{roundKey:token,stageIdAuthoritative:true,stageId:round.stage,started:true,ended:false,rewardEligible:round.rewardEligible};}
  function confirmedSnapshot(){
    const state=read();if(!state.ok)return {ok:false,reason:state.reason};
    try{
      if(storage.getItem(key)!==state.raw)return {ok:false,reason:'snapshot-changed'};
      const receipt=Object.freeze({});snapshots.set(receipt,{raw:state.raw,completed:state.completed.slice(),unlocked:state.unlocked});
      return {ok:true,receipt};
    }catch{return {ok:false,reason:'snapshot-unconfirmed'};}
  }
  function authorizeOrders(receipt){
    const proof=snapshots.get(receipt);if(!proof)return null;
    try{if(storage.getItem(key)!==proof.raw)return null;}catch{return null;}
    // A flag is returned only after this module validates its opaque receipt
    // against the exact current campaign bytes. It does not make a cross-tab
    // compare-and-swap or prove later reward delivery.
    const supported=proof.completed.filter(stage=>stage<proof.unlocked||(stage===total&&proof.unlocked===total));
    return {readbackVerified:true,completedStages:supported,unlocked:proof.unlocked};
  }
  function commitWin(token){
    const round=rounds.get(token);if(!round||round.ended||round.attempted)return {saved:false,reason:'invalid-round'};
    round.attempted=true;
    const state=read();if(!state.ok)return {saved:false,reason:state.reason};
    if(round.stage>state.unlocked)return {saved:false,reason:'locked-stage'};
    const completed=[...new Set([...state.completed,round.stage])].sort((a,b)=>a-b);
    const unlocked=Math.max(state.unlocked,Math.min(total,round.stage+1));
    const value={...state.value,completedStages:completed,unlockedStage:unlocked,selectedStage:unlocked};
    try{
      const bytes=JSON.stringify(value);
      if(storage.getItem(key)!==state.raw)return {saved:false,reason:'changed-before-write'};
      storage.setItem(key,bytes);
      if(storage.getItem(key)!==bytes)return {saved:false,reason:'unconfirmed-readback'};
      const receipt=Object.freeze({});receipts.set(receipt,{token,firstClear:!state.completed.includes(round.stage)});return {saved:true,receipt};
    }catch{return {saved:false,reason:'write-or-readback-unconfirmed'};}
  }
  function settle(token,{win,receipt,knownSavedGate,knownRewardGate}={}){
    const round=rounds.get(token);if(!round||round.ended)return null;
    round.ended=true;
    const proof=receipts.get(receipt),saved=win===true&&proof?.token===token;
    // If a clear appeared after the round started, the tracker's already-set
    // eligibility cannot be safely revoked at end. Avoid a success event.
    const changedAfterStart=saved&&round.rewardEligible&&!proof.firstClear;
    // An old/unknown collector has no trusted save-gating contract. Even a
    // verified result is not reported as a successful lifecycle to that API.
    return {stageIdAuthoritative:true,stageId:round.stage,ended:true,outcome:knownSavedGate===true&&knownRewardGate===true&&!changedAfterStart?(win===true?'win':'lose'):'abandon',saveSucceeded:saved};
  }
  return Object.freeze({read,begin,start,commitWin,settle,confirmedSnapshot,authorizeOrders});
}
