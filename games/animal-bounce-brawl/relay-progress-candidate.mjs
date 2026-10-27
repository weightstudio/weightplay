// Candidate for the two existing Bounce progress keys. This is not connected
// to the game: localStorage has no compare-and-swap and old pages may overwrite.
export function createBounceProgressCandidate({storage,primary='wp-brawl-progress-v2',legacy='wp-brawl-best',total=60}={}){
  if(!storage||typeof storage.getItem!=='function'||typeof storage.setItem!=='function'||!Number.isSafeInteger(total)||total<31||total>60)throw new TypeError('invalid progress storage');
  const records=new WeakMap(),receipts=new WeakMap(),obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),integer=x=>Number.isSafeInteger(x)&&x>=0;
  let busy=false,blocked=false;
  function read(){
    try{
      const raw=storage.getItem(primary),old=storage.getItem(legacy),v=raw===null?{}:JSON.parse(raw);
      if(!obj(v)||(v.version!==undefined)||(v.schemaVersion!==undefined&&v.schemaVersion!==2))throw Error('unsupported');
      if(v.stars!==undefined&&(!Array.isArray(v.stars)||v.stars.length>total||v.stars.some(x=>!integer(x)||x>3)))throw Error('stars');
      if(v.unlocked!==undefined&&(!integer(v.unlocked)||v.unlocked<1||v.unlocked>total))throw Error('frontier');
      // A v2 one-star entry can have been synthesized from the old best key.
      // Only a subsequent, checked stage-30 win establishes this marker.
      const proven=v.bounceRelayStage30Proof===1;
      if(v.bounceRelayStage30Proof!==undefined&&!proven)throw Error('proof-version');
      if(proven&&!(v.stars?.[29]>0))throw Error('proof-inconsistent');
      if(!proven&&(v.unlocked||1)>30)throw Error('unproven-frontier');
      // Only post-30 stages created by this writer can support its frontier.
      if(proven)for(let i=30;i<(v.unlocked||1)-1;i++)if(!(v.stars?.[i]>0))throw Error('frontier-gap');
      if(old!==null&&!/^(0|[1-9]\d*)$/.test(old))throw Error('legacy');
      const best=old===null?0:Number(old);if(!integer(best)||best>total||(!proven&&best>30))throw Error('legacy');
      const stars=Array.from({length:total},(_,i)=>v.stars?.[i]||0);
      // The old numeric key carries no deployment provenance. Preserve its
      // prior access through 30, without fabricating clear records or opening 31.
      const unlocked=Math.max(v.unlocked||1,Math.min(30,best+1));
      return {ok:true,raw,old,v,best,stars,unlocked};
    }catch{return {ok:false,reason:'unreadable-or-unsupported'};}
  }
  function snapshot(){
    if(busy||blocked)return null;busy=true;
    try{const s=read();if(!s.ok||storage.getItem(primary)!==s.raw||storage.getItem(legacy)!==s.old){blocked=true;return null;}return s;}
    catch{blocked=true;return null;}finally{busy=false;}
  }
  function begin(stage){
    if(!Number.isSafeInteger(stage)||stage<1||stage>total)return null;const s=snapshot();if(!s||stage>s.unlocked)return null;
    const token=Object.freeze({});records.set(token,{stage,raw:s.raw,old:s.old,eligible:s.stars[stage-1]===0&&stage>s.best,attempted:false,ended:false});return token;
  }
  function start(token){const r=records.get(token);return !r||r.ended?null:{roundKey:token,stageIdAuthoritative:true,stageId:r.stage,started:true,ended:false,rewardEligible:r.eligible};}
  function commitWin(token,earnedStars){
    const r=records.get(token);if(busy||blocked||!r||r.ended||r.attempted||!integer(earnedStars)||earnedStars<1||earnedStars>3)return {ok:false,reason:'invalid-round'};
    r.attempted=true;busy=true;
    try{
      const s=read();if(!s.ok||s.raw!==r.raw||s.old!==r.old||r.stage>s.unlocked)throw Error('changed');
      const stars=s.stars.slice();stars[r.stage-1]=Math.max(stars[r.stage-1],earnedStars);
      const value={...s.v,stars,unlocked:Math.max(s.unlocked,Math.min(total,r.stage+1)),...(r.stage===30?{bounceRelayStage30Proof:1}:{})},bytes=JSON.stringify(value);
      if(storage.getItem(primary)!==s.raw||storage.getItem(legacy)!==s.old)throw Error('changed');
      storage.setItem(primary,bytes);if(storage.getItem(primary)!==bytes)throw Error('readback');
      // The mirror is a distinct write and can remain uncertain. It is not a
      // transaction, and a confirmed primary cannot be rolled back safely.
      let mirror='confirmed';const mirrorBytes=String(Math.max(s.best,r.stage));
      try{storage.setItem(legacy,mirrorBytes);if(storage.getItem(legacy)!==mirrorBytes)mirror='unconfirmed';}catch{mirror='unconfirmed';}
      if(storage.getItem(primary)!==bytes)throw Error('primary-changed');
      const receipt=Object.freeze({});receipts.set(receipt,{token,firstClear:s.stars[r.stage-1]===0&&r.stage>s.best});
      return {ok:true,receipt,mirror,value};
    }catch{blocked=true;return {ok:false,reason:'write-or-readback-unconfirmed'};}finally{busy=false;}
  }
  function settle(token,{win,receipt,knownSavedGate,knownRewardGate}={}){
    const r=records.get(token);if(busy||!r||r.ended)return null;r.ended=true;const proof=receipts.get(receipt),saved=win===true&&proof?.token===token;
    return {stageIdAuthoritative:true,stageId:r.stage,ended:true,outcome:knownSavedGate===true&&knownRewardGate===true?(win===true?'win':'lose'):'abandon',saveSucceeded:saved};
  }
  return Object.freeze({read,begin,start,commitWin,settle});
}
