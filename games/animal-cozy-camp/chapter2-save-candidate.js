(function (root, factory) {
  'use strict';
  const candidate = factory();
  if (typeof module === 'object' && module.exports) module.exports = candidate;
  if (root) root.AnimalCozyCampChapter2SaveCandidate = candidate;
})(typeof window === 'undefined' ? globalThis : window, function () {
  'use strict';
  // Unconnected prototype: the original campaign still owns its own key.
  const ready = false;
  const ORIGINAL_KEY = 'weightplay-animal-cozy-camp-campaign-v1';
  const key = stage => `weightplay-animal-cozy-camp-chapter2-stage-${stage}-v1`;
  const originalId = stage => `cozy-circle-${String(stage).padStart(2,'0')}`;
  function oldProof(raw) {
    if (typeof raw !== 'string') return false;
    try {
      const record = JSON.parse(raw);
      if (!record || typeof record !== 'object' || Array.isArray(record) || record.schema !== 1 || !Array.isArray(record.completedIds)) return false;
      if (record.completedIds.some(id => typeof id !== 'string') || new Set(record.completedIds).size !== record.completedIds.length) return false;
      // A later or foreign version may already have paid rewards for these
      // IDs. Preserve such records untouched until its migration is known.
      if(record.completedIds.some(id=>{const match=/^cozy-circle-(\d+)$/.exec(id);return match && Number(match[1])>30;}))return false;
      return Array.from({length:30},(_,i)=>originalId(i+1)).every(id=>record.completedIds.includes(id));
    } catch { return false; }
  }
  function oldConflict(raw) {
    if(raw===null)return false;
    try{
      const record=JSON.parse(raw);
      if(!record||typeof record!=='object'||Array.isArray(record)||record.schema!==1||!Array.isArray(record.completedIds))return true;
      return record.completedIds.some(id=>typeof id!=='string'||((/^cozy-circle-(\d+)$/.exec(id))?.[1]||0)>30);
    }catch{return true;}
  }
  function readReceipt(storage, stage) {
    const raw=storage.getItem(key(stage));if(raw===null)return null;
    let item;try{item=JSON.parse(raw)}catch{throw Error('CORRUPT_RECEIPT')}
    if(!item || typeof item!=='object' || Array.isArray(item) || item.schema!==1 || item.stage!==stage || item.completed!==true || !Number.isSafeInteger(item.bestChecks) || item.bestChecks<1)throw Error('UNSUPPORTED_RECEIPT');
    if(stage===31 && !oldProof(item.originalSnapshot))throw Error('INVALID_ORIGINAL_PROOF');
    return item;
  }
  function unlockedThrough(storage) {
    const first=readReceipt(storage,31);
    if(!first)return oldProof(storage.getItem(ORIGINAL_KEY))?31:30;
    let next=32;while(next<=60 && readReceipt(storage,next))next++;
    return Math.min(next,60);
  }
  async function save(storage, locks, stage, checks) {
    if(!storage || !locks || typeof locks.request!=='function')return {ok:false,reason:'LOCKS_OR_STORAGE_UNAVAILABLE'};
    if(!Number.isInteger(stage)||stage<31||stage>60||!Number.isSafeInteger(checks)||checks<1)return {ok:false,reason:'INVALID_INPUT'};
    try {
      return await locks.request('weightplay-animal-cozy-camp-chapter2-write',{mode:'exclusive'},()=>{
        if(oldConflict(storage.getItem(ORIGINAL_KEY)))return {ok:false,reason:'UNSUPPORTED_ORIGINAL_PROGRESS'};
        const available=unlockedThrough(storage);if(stage>available)return {ok:false,reason:'LOCKED'};
        const existing=readReceipt(storage,stage);
        const snapshot=stage===31 ? (existing?.originalSnapshot ?? storage.getItem(ORIGINAL_KEY)) : undefined;
        if(stage===31 && !oldProof(snapshot))return {ok:false,reason:'NO_ORIGINAL_PROOF'};
        const next={...(existing||{}),schema:1,stage,completed:true,bestChecks:existing?Math.min(existing.bestChecks,checks):checks};
        if(stage===31)next.originalSnapshot=snapshot;
        const raw=JSON.stringify(next);storage.setItem(key(stage),raw);
        if(storage.getItem(key(stage))!==raw)return {ok:false,reason:'UNCONFIRMED_WRITE'};
        return {ok:true,firstClear:!existing,stage,bestChecks:next.bestChecks};
      });
    } catch {return {ok:false,reason:'STORAGE_OR_LOCK_FAILED'};}
  }
  return Object.freeze({ready,ORIGINAL_KEY,key,oldProof,readReceipt,unlockedThrough,save});
});
