// Candidate campaign save helper. Readback is not cross-tab atomic.
(() => { 'use strict';
// A same-tab byte check is not an atomic cross-tab compare-and-swap.
const KEY='weightplay-balance-grove-campaign-v1';
const record=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const validIndex=n=>Number.isSafeInteger(n)&&n>=0&&n<60;
const validStars=n=>Number.isSafeInteger(n)&&n>=1&&n<=3;
function createBalanceSave(storage){
 if(!storage||typeof storage.getItem!=='function'||typeof storage.setItem!=='function')throw TypeError('invalid storage');
 const rounds=new WeakMap(),proofs=new WeakMap(),pending=new Map();
 function read(){
  try{
   const raw=storage.getItem(KEY),data=raw===null?{cleared:[],stars:{}}:JSON.parse(raw);
   if(!record(data)||data.version!==undefined||(data.schemaVersion!==undefined&&data.schemaVersion!==1)||!Array.isArray(data.cleared)||(data.stars!==undefined&&!record(data.stars))||data.cleared.some(n=>!validIndex(n)))return {ok:false,reason:'unsupported-or-invalid'};
   const cleared=[...new Set(data.cleared)].sort((a,b)=>a-b),stars={};
   for(const n of cleared){const value=data.stars?.[n],normalized=typeof value==='string'&&/^[1-3]$/.test(value)?Number(value):value;if(normalized!==undefined&&!validStars(normalized))return {ok:false,reason:'invalid-stars'};stars[n]=normalized===undefined?1:normalized;}
   return {ok:true,raw,data,cleared,stars,unlocked:Math.min(59,Math.max(2,...cleared.map(n=>n+1)))};
  }catch{return {ok:false,reason:'unreadable'};}
 }
 // sessionAllowed is asserted only by the host after its own ordinary
 // in-memory unlock guard; it does not confer reward eligibility.
 function begin(index,{sessionAllowed=false}={}){
  if(!validIndex(index))throw TypeError('invalid stage');const seen=read(),token=Object.freeze({});let legacyUnknown=false;
  if(seen.ok&&index<3)try{legacyUnknown=storage.getItem('weightplay-animal-balance-grove-best-v1')!==null;}catch{legacyUnknown=true;}
  // An old generic completion receipt identifies no particular stage. Until
  // the old chapter has a trustworthy per-stage record, fail closed on its
  // rewards; the old implementation could already have credited any of them.
  if(seen.ok&&index<30)try{const raw=storage.getItem('weightplayCastleV1');if(raw!==null){const castle=JSON.parse(raw);if(!record(castle)||!record(castle.completions)||Object.hasOwn(castle.completions,'animal-balance-grove:first-completion'))legacyUnknown=true;}}catch{legacyUnknown=true;}
  rounds.set(token,{index,eligible:seen.ok&&!seen.cleared.includes(index)&&!legacyUnknown,startAllowed:(seen.ok&&index<=seen.unlocked)||sessionAllowed===true,attempted:false,ended:false});return token;
 }
 function start(token){const r=rounds.get(token);return !r||r.ended?null:{roundKey:token,started:true,ended:false,stageId:r.index+1,stageIdAuthoritative:true,rewardEligible:r.eligible};}
 function win(token,star){
  const r=rounds.get(token);if(!r||r.ended||r.attempted||!validStars(star))return {saved:false,reason:'invalid-round'};r.attempted=true;
  const current=read();if(!current.ok){if(r.startAllowed)pending.set(r.index,Math.max(pending.get(r.index)||0,star));return {saved:false,reason:current.reason};}
  // Pending can contain only legitimately entered stages: validate unlock
  // sequentially against current progress before merging.
  let frontier=current.unlocked;for(const index of [...pending.keys()].sort((a,b)=>a-b)){if(index>frontier)return {saved:false,reason:'pending-out-of-order'};frontier=Math.max(frontier,Math.min(59,index+1));}if(r.index>frontier)return {saved:false,reason:'locked'};
  pending.set(r.index,Math.max(pending.get(r.index)||0,star));const cleared=[...new Set([...current.cleared,...pending.keys()])].sort((a,b)=>a-b);
  const stars={...current.data.stars};for(const [index,n] of pending)stars[index]=Math.max(current.stars[index]||0,n);
  try{const bytes=JSON.stringify({...current.data,cleared,stars});if(storage.getItem(KEY)!==current.raw)return {saved:false,reason:'changed-before-write'};storage.setItem(KEY,bytes);if(storage.getItem(KEY)!==bytes)return {saved:false,reason:'unconfirmed'};const p=Object.freeze({});proofs.set(p,{token,first:!current.cleared.includes(r.index)});pending.clear();return {saved:true,proof:p,progress:{cleared,stars}};}catch{return {saved:false,reason:'unconfirmed'};}
 }
 function end(token,{won,proof,knownSaveGate,knownRewardGate}={}){
  const r=rounds.get(token);if(!r||r.ended)return null;r.ended=true;const p=proofs.get(proof),saved=won===true&&p?.token===token;
  const changed=saved&&r.eligible&&!p.first;
  return {ended:true,stageId:r.index+1,stageIdAuthoritative:true,saveSucceeded:saved,outcome:knownSaveGate===true&&knownRewardGate===true&&!changed?(won===true?'win':'lose'):'abandon'};
 }
 return Object.freeze({read,begin,start,win,end,pending:()=>[...pending].sort(([a],[b])=>a-b)});
}
globalThis.BalanceGroveSaveCandidate=Object.freeze({createBalanceSave});
})();
