import test from 'node:test';
import assert from 'node:assert/strict';
import {STAGES,SAVE_KEY,newRun,remaining,choose,optionsFor,tileKey,normalizeSave,award} from './core.mjs';
import {COPY} from './workshop-copy.mjs';
import {purchaseMoon,recoverPurchase,JOURNAL_KEY} from './purchase.mjs';

test('30 authored patterns: visible clues agree with every stated rule',()=>{
 assert.equal(STAGES.length,30);
 for(const s of STAGES){
  const cell=(r,c)=>s.tiles[r*3+c],eq=(a,b)=>assert.equal(tileKey(a),tileKey(b),`${s.id}: ${s.rule}`);
  assert.equal(s.tiles.length,9);assert.equal(new Set(s.holes).size,s.holes.length);
  for(let r=0;r<3;r++)for(let c=0;c<3;c++){
   const v=cell(r,c);assert.ok(v.shape);assert.ok(v.count>=1&&v.count<=3);
   if(['rows','columns'].includes(s.rule))eq(v,cell(0,c));
   if(s.rule==='rowSolid')eq(v,cell(r,0));
   if(s.rule==='checker')eq(v,cell(0,(r+c)%2));
   if(['mirrorH','mirrorBoth','countMirror','dualMirror'].includes(s.rule))eq(v,cell(r,2-c));
   if(['mirrorV','mirrorBoth','dualMirror'].includes(s.rule))eq(v,cell(2-r,c));
   if(s.rule==='shiftLeft')eq(v,cell(0,(r+c)%3));
   if(s.rule==='shiftRight')eq(v,cell(0,(c-r+3)%3));
   if(['countAcross','countReverse'].includes(s.rule)){assert.equal(v.shape,cell(r,0).shape);assert.equal(v.count,s.rule==='countAcross'?c+1:3-c);}
   if(s.rule==='countDown'){assert.equal(v.shape,cell(0,c).shape);assert.equal(v.count,r+1);}
   if(['dualAcross','dualDown','dualReverse'].includes(s.rule)){
    assert.equal(v.shape,cell(0,(r+c)%3).shape);
    assert.equal(v.count,s.rule==='dualAcross'?c+1:s.rule==='dualDown'?r+1:3-c);
   }
  }
 }
});
test('full campaign: 56 gaps, unique choices, shuffled answers, monotonic unlock and medals',()=>{
 let save=normalizeSave(null);const positions=new Set();let gaps=0;
 for(const stage of STAGES){
  assert.equal(save.unlocked,stage.id);let run=newRun(stage);
  for(const index of stage.holes){
   const options=optionsFor(stage,index);assert.equal(options.length,4);assert.equal(new Set(options.map(tileKey)).size,4);
   positions.add(options.findIndex(v=>tileKey(v)===tileKey(stage.tiles[index])));
   assert.equal(options.filter(v=>tileKey(v)===tileKey(stage.tiles[index])).length,1);
   const before=JSON.stringify(run);const result=choose(run,index,stage.tiles[index]);assert.equal(JSON.stringify(run),before);run=result.run;gaps++;
   assert.equal(choose(run,index,stage.tiles[index]).outcome,'ignored');
  }
  assert.equal(run.status,'complete');assert.equal(remaining(run).length,0);save=award(save,run);assert.deepEqual(save.medals[stage.id-1],[true,true,true]);
 }
 assert.equal(gaps,56);assert.equal(positions.size,4);assert.equal(save.unlocked,30);
 const repeat={...newRun(STAGES[0]),status:'complete',mistakes:2,hints:1};assert.deepEqual(award(save,repeat).medals[0],[true,true,true]);
});
test('wrong answers, hints and reloaded partial runs preserve progress without granting medals',()=>{
 let save=normalizeSave(null),run=newRun(STAGES[0]);const wrong=optionsFor(STAGES[0],8).find(v=>tileKey(v)!==tileKey(STAGES[0].tiles[8]));
 run=choose(run,8,wrong).run;assert.equal(run.mistakes,1);assert.equal(run.filled.length,0);assert.equal(award(save,run),save);
 run.hints=1;run=choose(run,8,STAGES[0].tiles[8]).run;save=award(save,run);assert.deepEqual(save.medals[0],[true,false,false]);
 for(const s of STAGES.slice(1,4)){let r=newRun(s);for(const index of s.holes)r=choose(r,index,s.tiles[index]).run;save=award(save,r);}
 const stage=STAGES[4];run=choose(newRun(stage),stage.holes[0],stage.tiles[stage.holes[0]]).run;
 const loaded=normalizeSave(JSON.parse(JSON.stringify({...save,run})));assert.deepEqual(newRun(stage,loaded.run).filled,run.filled);assert.equal(loaded.unlocked,5);
 assert.equal(normalizeSave({run:{stage:30,filled:[]}}).run,null);
 assert.doesNotThrow(()=>normalizeSave({...save,run:{stage:5,filled:42}}));assert.equal(normalizeSave({skin:'moon'}).skin,'jade');
});
test('every locale covers all rules and current gameplay, with identical copy contracts',()=>{
 assert.equal(Object.keys(COPY).length,13);const keys=Object.keys(COPY.en).sort();
 for(const copy of Object.values(COPY)){assert.deepEqual(Object.keys(copy).sort(),keys);assert.equal(copy.arcs.length,6);for(const s of STAGES)assert.ok(copy.rules[s.rule]?.trim());assert.match(copy.buy,/20/);}
});
function fixture(balance=40){
 const map=new Map();const fault={write:false,journal:false,refund:false,remove:false};
 const storage={getItem:k=>map.get(k)||null,setItem(k,v){if((fault.write&&k===SAVE_KEY)||(fault.journal&&k===JOURNAL_KEY))throw Error('quota');map.set(k,v);},removeItem(k){if(fault.remove)throw Error('locked');map.delete(k);}};
 const wallet={read:()=>({diamonds:balance}),spendDiamonds(n){if(balance<n)return false;balance-=n;return true;},addDiamonds(n){if(fault.refund)throw Error('quota');balance+=n;}};
 return {storage,wallet,map,fault};
}
test('cosmetic purchase charges once, persists ownership, and tolerates late receipt cleanup failure',()=>{
 const f=fixture();f.fault.remove=true;const one=purchaseMoon(f.storage,f.wallet,normalizeSave(null));assert.equal(one.ok,true);assert.equal(f.wallet.read().diamonds,20);
 const two=purchaseMoon(f.storage,f.wallet,one.save);assert.equal(two.ok,true);assert.equal(f.wallet.read().diamonds,20);
 f.fault.remove=false;assert.equal(recoverPurchase(f.storage,f.wallet,one.save).blocked,false);assert.equal(f.map.has(JOURNAL_KEY),false);
});
test('no funds or storage failure cannot silently spend or grant an item',()=>{
 for(const type of ['balance','journal','write']){const f=fixture(type==='balance'?19:40);if(type!=='balance')f.fault[type]=true;const r=purchaseMoon(f.storage,f.wallet,normalizeSave(null));assert.equal(r.ok,false);assert.equal(r.save.moonOwned,false);assert.equal(f.wallet.read().diamonds,type==='balance'?19:40);}
});
test('interrupted debit recovers the item once; ambiguous balance blocks spending',()=>{
 const f=fixture();f.fault.write=true;f.fault.refund=true;let r=purchaseMoon(f.storage,f.wallet,normalizeSave(null));assert.equal(r.blocked,true);assert.equal(f.wallet.read().diamonds,20);
 f.fault.write=false;f.fault.refund=false;r=recoverPurchase(f.storage,f.wallet,r.save);assert.equal(r.save.moonOwned,true);assert.equal(f.wallet.read().diamonds,20);
 const a=fixture(34);a.map.set(JOURNAL_KEY,JSON.stringify({item:'moon',before:40}));assert.equal(purchaseMoon(a.storage,a.wallet,normalizeSave(null)).blocked,true);assert.equal(a.wallet.read().diamonds,34);
});
