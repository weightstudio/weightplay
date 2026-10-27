import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';import {R} from './stage60-rules.test.mjs';
const unchanged=(s,action,id,error)=>{const raw=JSON.stringify(s),r=R.act(s,action,id);assert.equal(r.error,error);assert.equal(JSON.stringify(r.state),raw);assert.equal(JSON.stringify(s),raw);};
let bridge=R.create(7);unchanged(bridge,'restore',6,'needBridge');bridge=R.act(bridge,'bridge',6).state;assert.equal(bridge.bridges,0);assert.equal(bridge.kits,1);assert(R.accessible(bridge,2));assert.equal(R.eco(bridge),0);unchanged(bridge,'bridge',6,'done');
let wasted=R.create(14);wasted=R.act(wasted,'bridge',6).state;assert.equal(wasted.bridges,0);unchanged(wasted,'bridge',5,'noBridge');assert(!R.goals(wasted));
let flood=R.create(31);unchanged(flood,'restore',6,'flood');const beforePump=JSON.stringify(flood);flood=R.act(flood,'pump',10).state;assert.equal(flood.low,3);assert.equal(flood.kits,2);assert.equal(R.eco(flood),0);assert.equal(flood.saved,0);unchanged(flood,'pump',10,'alreadyLow');
flood=R.act(flood,'restore',6).state;assert.equal(flood.low,2);flood=R.act(flood,'restore',5).state;assert.equal(flood.low,1);flood=R.act(flood,'supply',10).state;assert.equal(flood.low,0);assert(!R.flooded(flood,5),'Raised land survives returning water');assert.equal(R.act(flood,'rescue',5).error,null);assert.equal(JSON.stringify(R.create(31)),beforePump,'Undo snapshot remains a full original turn');
unchanged(R.create(36),'pump',10,'needPump');let irrigation=R.create(46);irrigation.cells[1].restored=true;assert.equal(R.cost(irrigation,0),1);irrigation.low=2;assert.equal(R.cost(irrigation,0),2);irrigation.low=0;assert.equal(R.cost(irrigation,0),1);
assert.throws(()=>R.create(61));assert.equal(R.plans.length,60);
const bestKey='weightplay-habitat-atlas-best-stage',journalKey='weightplay-habitat-atlas-rescue-v1';const map=new Map([[bestKey,'6'],[journalKey,'{"1":3,"6":2}'],['old-deduction-score','untouched'],['castle','untouched']]);const storage={getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v)};
let saved=R.readProgress(storage);assert.equal(saved.best,6);assert.equal(Math.min(R.plans.length,saved.best+1),7);assert.equal(Object.keys(saved.journal).length,2,'Do not infer unrecorded stars');
saved=R.writeProgress(storage,{...saved,best:7,journal:{...saved.journal,7:3}});const merged=R.writeProgress(storage,{best:30,journal:{1:2,30:3}});assert.equal(merged.journal[1],3);assert.equal(merged.journal[7],3);assert.equal(merged.best,30);assert.equal(Math.min(60,merged.best+1),31);const final=R.writeProgress(storage,{best:60,journal:{60:3}});assert.equal(final.best,60);assert.equal(R.readProgress(storage).journal[60],3);assert.equal(map.get('castle'),'untouched');assert.equal(map.get('old-deduction-score'),'untouched');const replay=JSON.stringify(R.writeProgress(storage,final));assert.equal(JSON.stringify(R.writeProgress(storage,final)),replay);
const beforeQuota=[...map];const quota=R.writeProgress({...storage,setItem(){throw Error('QuotaExceededError')}},final);assert.equal(quota.storageOK,false);assert.equal(quota.best,60);assert.deepEqual([...map],beforeQuota);
map.set(journalKey,'corrupt');map.set(bestKey,'6');const corrupt=R.readProgress(storage);assert.equal(corrupt.best,6);assert.equal(corrupt.storageOK,false);assert.equal(Object.keys(corrupt.journal).length,0);assert.equal(R.normalizeProgress({best:Infinity}).best,0);assert.equal(R.normalizeProgress({best:NaN}).best,0);assert.equal(Object.keys(R.normalizeProgress({journal:{'-1':3,'61':3,'1':9,'2':3}}).journal).join(','),'2');
const malformedBefore=[...map];assert.equal(R.writeProgress(storage,{best:7,journal:{7:3}}).storageOK,false);assert.deepEqual([...map],malformedBefore,'corrupt journal is not overwritten');
for(const raw of ['null','[]','{"1":9}','{"future":1}']){map.set(journalKey,raw);const prior=[...map];assert.equal(R.writeProgress(storage,{best:7,journal:{7:3}}).storageOK,false);assert.deepEqual([...map],prior,'invalid or future journal is preserved');}
map.set(journalKey,'{"1":3,"6":2}');map.set(bestKey,'6');
for(const blockedKey of [journalKey,bestKey]){
  const beforeBest=map.get(bestKey), beforeJournal=map.get(journalKey);
  const fault={getItem:storage.getItem,setItem:(key,value)=>{if(key!==blockedKey)storage.setItem(key,value);}};
  const notSaved=R.writeProgress(fault,{best:7,journal:{1:3,6:2,7:3}});
  assert.equal(notSaved.storageOK,false,'silent write cannot confirm a clear');
  if(blockedKey===journalKey)assert.equal(map.get(bestKey),beforeBest,'failed journal never advances best');
  const recovered=R.writeProgress(storage,notSaved);assert.equal(recovered.storageOK,true,'retry may recover after storage becomes available');
  assert.equal(map.get(bestKey),'7');assert.equal(JSON.parse(map.get(journalKey))['7'],3);
  map.set(bestKey,beforeBest);map.set(journalKey,beforeJournal);
}
const noRead={getItem:()=>{throw Error('denied')},setItem:()=>{throw Error('must not write')}};
assert.equal(R.writeProgress(noRead,{best:7,journal:{7:3}}).storageOK,false);
const ctx={};ctx.globalThis=ctx;vm.runInNewContext(fs.readFileSync(new URL('../campaign-copy.js',import.meta.url),'utf8'),ctx);assert.equal(Object.keys(ctx.HabitatExpansionCopy).length,13);for(const [locale,copy]of Object.entries(ctx.HabitatExpansionCopy)){assert.equal(Object.keys(copy).length,22);for(const value of Object.values(copy))assert(value.trim(),locale);assert(copy.intro.includes('60'));}
console.log(JSON.stringify({status:'PASS',checks:['bridge-resource-and-route','bridge-not-land','mandatory-links','wasted-kit-rejection','pump-cost-and-window','invalid-no-mutation','permanent-raised-land','remote-station','irrigation-return','no61','old6-to7','30-to31','save-reload','cross-tab-union','no-star-inference','reward-keys-preserved','replay-idempotent','quota','corrupt','13-locales-22-fields']}));
