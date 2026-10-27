// Offline model/lock protocol regression. This does not prove browser behavior,
// cross-key crash atomicity, or cooperation by an older open game tab.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {writeProgressLocked} from '../progress-lock.mjs';

const files=[new URL('../game.js',import.meta.url),new URL('../progress-lock.mjs',import.meta.url),new URL(import.meta.url)];
const hash=file=>createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const before=Object.fromEntries(files.map(file=>[file.pathname,hash(file)]));
const context={};context.globalThis=context;vm.runInNewContext(fs.readFileSync(files[0],'utf8'),context);
const R=context.HabitatRescueRules;
assert(R?.writeProgress,'REAL_RULES_REQUIRED');
const LOCK='weightplay-habitat-atlas-progress-v1',BEST='weightplay-habitat-atlas-best-stage',JOURNAL='weightplay-habitat-atlas-rescue-v1';
const makeStorage=()=>{
 const values=new Map([[BEST,'6'],[JOURNAL,JSON.stringify({1:3,6:2})],['other','preserve']]);
 const storage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)};
 return {storage,values};
};

// Fake LockManager supplies deterministic FIFO mutual exclusion and honours
// abort while waiting. It is a test double, not a multi-tab browser proof.
function fakeLocks(){
 const queues=new Map(),active=new Set(),events=[];
 const pump=name=>{
  if(active.has(name))return;const queue=queues.get(name)||[];
  while(queue.length){const job=queue.shift();if(job.signal?.aborted){job.reject(new DOMException('aborted','AbortError'));continue;}
   active.add(name);events.push(['enter',name]);Promise.resolve().then(()=>job.callback()).then(job.resolve,job.reject).finally(()=>{events.push(['exit',name]);active.delete(name);pump(name)});return;
  }
 };
 return {events,request(name,options,callback){
  assert.equal(name,LOCK);assert.equal(options.mode,'exclusive');
  return new Promise((resolve,reject)=>{const signal=options.signal,job={callback,resolve,reject,signal};if(signal?.aborted){reject(new DOMException('aborted','AbortError'));return;}
   const queue=queues.get(name)||[];queues.set(name,queue);queue.push(job);
   signal?.addEventListener('abort',()=>{const index=queue.indexOf(job);if(index>=0){queue.splice(index,1);reject(new DOMException('aborted','AbortError'));}},{once:true});pump(name);
  });
 }};
}
const flush=async()=>{for(let i=0;i<8;i++)await new Promise(queueMicrotask)};
const args=(locks,storage,value,writeProgress=R.writeProgress,timeoutMs=500)=>({locks,storage,value,writeProgress,timeoutMs});
const first={best:7,journal:{1:3,6:2,7:2},storageOK:true};
const second={best:8,journal:{1:3,6:2,8:3},storageOK:true};

// Both writes are waiting under one held lock. Releasing it proves each
// re-reads and merges the previous writer's real two-key progress.
{
 const {storage,values}=makeStorage(),locks=fakeLocks(),order=[];let release;
 const held=locks.request(LOCK,{mode:'exclusive'},()=>new Promise(resolve=>{release=resolve}));await flush();
 const writer=label=>(store,value)=>{order.push(label);return R.writeProgress(store,value)};
 const one=writeProgressLocked(args(locks,storage,first,writer('one')));
 const two=writeProgressLocked(args(locks,storage,second,writer('two')));
 await flush();assert.deepEqual(order,[],'writers must wait for lock');release();
 const [a,b]=await Promise.all([one,two]);await held;
 assert.equal(a.saved,true);assert.equal(b.saved,true);assert.deepEqual(order,['one','two']);
 assert.equal(values.get(BEST),'8');assert.deepEqual(JSON.parse(values.get(JOURNAL)),{1:3,6:2,7:2,8:3});
 assert.equal(values.get('other'),'preserve');
}

// Unsupported/rejected locking must retain the session and never touch either
// key. In particular, old no-lock fallback is unsafe and must not run.
for(const locks of [undefined,null,{}, {request(){throw Error('denied')}}, {request(){return Promise.reject(Error('denied'))}}]){
 const {storage,values}=makeStorage(),raw=[...values];let writes=0;
 const result=await writeProgressLocked(args(locks,storage,first,()=>{writes++;throw Error('must not call')}));
 assert.equal(result.saved,false);assert.equal(result.progress.storageOK,false);assert.equal(result.progress.best,7);assert.equal(result.progress.journal[7],2);assert.equal(writes,0);assert.deepEqual([...values],raw);
}

// A queued lock that never becomes available must be cancelled. A callback
// accidentally delivered later after AbortSignal must not write.
{
 const {storage,values}=makeStorage(),raw=[...values];let late,signal,writes=0;
 const locks={request(name,options,callback){assert.equal(name,LOCK);signal=options.signal;late=callback;return new Promise((_,reject)=>signal.addEventListener('abort',()=>reject(new DOMException('aborted','AbortError')),{once:true}));}};
 const result=await writeProgressLocked(args(locks,storage,first,()=>{writes++;return R.writeProgress(storage,first)},20));
 assert.equal(result.saved,false);assert.equal(result.progress.storageOK,false);assert(signal.aborted);await late();assert.equal(writes,0,'aborted callback must not write');assert.deepEqual([...values],raw);
}

// Real model write failure, a silent failure, and readback failures remain
// fail-closed. The journal can be persisted while the best key fails; the
// following cooperating retry merges and restores both keys.
for(const key of [BEST,JOURNAL])for(const mode of ['throw','silent']){
 const {storage,values}=makeStorage(),locks=fakeLocks();
 const broken={getItem:storage.getItem,setItem(k,v){if(k===key){if(mode==='throw')throw Error('quota');return;}storage.setItem(k,v)}};
 const failure=await writeProgressLocked(args(locks,broken,first));assert.equal(failure.saved,false);assert.equal(failure.progress.storageOK,false);
 if(key===BEST){assert.equal(values.get(BEST),'6');assert.equal(JSON.parse(values.get(JOURNAL))[7],2,'partial journal is a known non-atomic state');}
 else assert.equal(values.get(BEST),'6','best must not advance after journal failure');
 const retried=await writeProgressLocked(args(locks,storage,failure.progress));assert.equal(retried.saved,true);assert.equal(values.get(BEST),'7');assert.equal(JSON.parse(values.get(JOURNAL))[7],2);
}
{
 const {storage,values}=makeStorage(),locks=fakeLocks(),raw=[...values];values.set(JOURNAL,'{broken');
 const bad=[...values],result=await writeProgressLocked(args(locks,storage,first));assert.equal(result.saved,false);assert.deepEqual([...values],bad);assert.notDeepEqual(bad,raw);
}
{
 const {storage,values}=makeStorage(),locks=fakeLocks();let wrote=false;
 const fault={getItem(key){if(wrote)throw Error('readback');return storage.getItem(key)},setItem(key,value){storage.setItem(key,value);wrote=true}};
 const result=await writeProgressLocked(args(locks,fault,first));assert.equal(result.saved,false);assert.equal(result.progress.storageOK,false);
 const retried=await writeProgressLocked(args(locks,storage,result.progress));assert.equal(retried.saved,true);assert.equal(values.get(BEST),'7');
}

// An old page that ignores the lock can still modify storage inside the lock.
// This deliberately demonstrates the remaining lost-update limitation.
{
 const {storage,values}=makeStorage(),locks=fakeLocks();let injected=false;
 const noncooperating={getItem:storage.getItem,setItem(key,value){if(key===JOURNAL&&!injected){injected=true;values.set(BEST,'8');values.set(JOURNAL,JSON.stringify({1:3,6:2,8:3}));}storage.setItem(key,value)}};
 const result=await writeProgressLocked(args(locks,noncooperating,first));assert.equal(result.saved,true);
 assert.equal(values.get(BEST),'7');assert.equal(JSON.parse(values.get(JOURNAL))[8],undefined,'non-cooperating writer is outside the lock contract');
}
assert.deepEqual(Object.fromEntries(files.map(file=>[file.pathname,hash(file)])),before,'SOURCE_CHANGED');
console.log(JSON.stringify({status:'PASS_OFFLINE_ONLY',source:before,coverage:['FIFO same-name cooperating writers','no locks and rejected lock','timeout and late callback','partial writes, corrupt and readback recovery','non-cooperating writer limitation'],limitations:['no browser proof','two-key writes are not crash atomic','old tabs do not participate in the lock']}));
