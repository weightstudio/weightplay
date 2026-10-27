// Candidate single-page campaign writer. Callers must route *every* game-save
// mutation through this object; this does not provide cross-tab atomicity or a
// transaction with the separate Castle wallet.
export function createRelaySaveSession({storage,key='animal_auto_squad_save',normalize,total=60}={}) {
  if(!storage||typeof storage.getItem!=='function'||typeof storage.setItem!=='function'||typeof normalize!=='function'||!Number.isSafeInteger(total)||total<31||total>60)throw new TypeError('invalid save session');
  const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
  const integer=x=>typeof x==='number'?x:(typeof x==='string'&&/^\d+$/.test(x)?Number(x):NaN);
  const valid=(x,min,max)=>Number.isSafeInteger(integer(x))&&integer(x)>=min&&integer(x)<=max;
  let baseline,blocked=false,busy=false;const rounds=new WeakMap(),receipts=new WeakMap();
  function parse(raw) {
    const value=raw===null?{}:JSON.parse(raw);
    if(!object(value)||value.version!==undefined||(value.schemaVersion!==undefined&&value.schemaVersion!==1))throw Error('unsupported');
    if(value.unlockedStage!==undefined&&!valid(value.unlockedStage,1,total))throw Error('frontier');
    if(value.selectedStage!==undefined&&!valid(value.selectedStage,1,total))throw Error('selection');
    if(value.completedStages!==undefined&&(!Array.isArray(value.completedStages)||value.completedStages.some(x=>!valid(x,1,total))))throw Error('clears');
    const completed=[...new Set((value.completedStages||[]).map(integer))].sort((a,b)=>a-b);
    let unlocked=value.unlockedStage===undefined?1:integer(value.unlockedStage);
    if(unlocked===30&&completed.includes(30))unlocked=31;
    return {raw,value,completed,unlocked};
  }
  function current(){return parse(storage.getItem(key));}
  function load(){
    if(busy||blocked)return {ok:false,reason:'blocked'};
    busy=true;
    try {const next=current();if((baseline&&baseline.raw!==next.raw)||storage.getItem(key)!==next.raw)throw Error('changed');baseline=next;return {ok:true,value:{...next.value,unlockedStage:next.unlocked,completedStages:next.completed.slice()}};}
    catch {blocked=true;return {ok:false,reason:'unreadable-or-changed'};} finally {busy=false;}
  }
  function commit(value,clearStage){
    if(busy||blocked||!baseline||!object(value))return {ok:false,reason:'blocked'};
    busy=true;
    try {
      if(storage.getItem(key)!==baseline.raw)throw Error('changed');
      if(clearStage!==undefined&&(!valid(clearStage,1,total)||integer(clearStage)>baseline.unlocked))throw Error('locked');
      const projected=normalize(value);if(!object(projected))throw Error('invalid normalized save');
      // Normalization drops unknown fields; retain them, including extra animal
      // level keys, while accepting known game fields from this same writer.
      const merged={...baseline.value,...projected};
      if(object(baseline.value.animalLevels)&&object(projected.animalLevels))merged.animalLevels={...baseline.value.animalLevels,...projected.animalLevels};
      const completed=baseline.completed.slice();
      if(clearStage!==undefined&&!completed.includes(integer(clearStage)))completed.push(integer(clearStage));
      completed.sort((a,b)=>a-b);
      const unlocked=clearStage===undefined?baseline.unlocked:Math.max(baseline.unlocked,Math.min(total,integer(clearStage)+1));
      merged.completedStages=completed;merged.unlockedStage=unlocked;
      merged.selectedStage=clearStage===undefined?Math.max(1,Math.min(unlocked,integer(projected.selectedStage)||1)):unlocked;
      const bytes=JSON.stringify(merged);
      if(storage.getItem(key)!==baseline.raw)throw Error('changed');
      storage.setItem(key,bytes);
      if(storage.getItem(key)!==bytes)throw Error('unconfirmed');
      const firstClear=clearStage!==undefined&&!baseline.completed.includes(integer(clearStage));
      baseline=parse(bytes);
      return {ok:true,value:merged,firstClear};
    }catch {blocked=true;return {ok:false,reason:'write-or-readback-unconfirmed'};}finally{busy=false;}
  }
  function proof(){
    if(busy||blocked||!baseline)return null;
    busy=true;
    try {if(storage.getItem(key)!==baseline.raw)return null;return {readbackVerified:true,unlocked:baseline.unlocked,completedStages:baseline.completed.filter(x=>x<baseline.unlocked||(x===total&&baseline.unlocked===total))};}
    catch{return null;}finally{busy=false;}
  }
  function write(value){return commit(value);}
  function begin(stage){
    const verified=proof();if(!verified||!valid(stage,1,total)||integer(stage)>verified.unlocked)return null;
    const token=Object.freeze({});rounds.set(token,{stage:integer(stage),eligible:!baseline.completed.includes(integer(stage)),attempted:false,ended:false});return token;
  }
  function start(token){const round=rounds.get(token);return !round||round.ended?null:{roundKey:token,stageIdAuthoritative:true,stageId:round.stage,started:true,ended:false,rewardEligible:round.eligible};}
  function commitWin(token,value){
    const round=rounds.get(token);if(!round||round.ended||round.attempted)return {ok:false,reason:'invalid-round'};
    round.attempted=true;const result=commit(value,round.stage);if(!result.ok)return result;
    const receipt=Object.freeze({});receipts.set(receipt,{token,firstClear:result.firstClear});return {...result,receipt};
  }
  function settle(token,{win,receipt,knownSavedGate,knownRewardGate}={}){
    const round=rounds.get(token);if(busy||!round||round.ended)return null;round.ended=true;
    const proof=receipts.get(receipt),saved=win===true&&proof?.token===token;
    const changed=saved&&round.eligible&&!proof.firstClear;
    return {stageIdAuthoritative:true,stageId:round.stage,ended:true,outcome:knownSavedGate===true&&knownRewardGate===true&&!changed?(win===true?'win':'lose'):'abandon',saveSucceeded:saved};
  }
  return Object.freeze({load,write,proof,begin,start,commitWin,settle});
}
