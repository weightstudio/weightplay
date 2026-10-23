import test from 'node:test';
import assert from 'node:assert/strict';
import { createWorld, requestMove, advance, readJourney, readBest, saveJourney, buyAurora, signalState, nextLanding, SAVE_KEY, BEST_KEY } from './model.mjs';
import { EXTRA } from './copy.mjs';
const tick = (w, seconds) => { for (let t=0; t<seconds-1e-8; t+=.02) advance(w,Math.min(.02,seconds-t)); };
const step = (w,d) => { requestMove(w,d); tick(w,.16); };
const memory = () => { const data=new Map(); return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)}; };
test('first forward progress and pickups score once; lateral/backtracking cannot farm',()=>{
 const w=createWorld();step(w,'up');assert.equal(w.score,33);step(w,'left');step(w,'right');step(w,'down');step(w,'up');assert.equal(w.score,33);assert.equal(w.lanterns,1);
});
test('edge and rock rejection leave the player in place; input queue is bounded',()=>{
 const w=createWorld(2);w.player={x:.5,row:8};assert.equal(requestMove(w,'left'),false);assert.equal(w.events.at(-1).reason,'edge');
 w.player={x:5.5,row:4};assert.equal(requestMove(w,'up'),false);assert.equal(w.events.at(-1).reason,'rock');
 w.player={x:5.5,row:8};requestMove(w,'left');requestMove(w,'left');requestMove(w,'right');tick(w,.32);assert.equal(w.player.x,5.5);
});
test('second route moves both traffic and current; signal lane stops then restarts',()=>{
 const w=createWorld(2),before=[w.traffic[0].x,w.logs[0].x];tick(w,1);assert.ok(w.traffic[0].x>before[0]);assert.ok(w.logs[0].x<before[1]);
 const v=createWorld(3),car=v.traffic.find(c=>c.row===5),x=car.x;tick(v,2);assert.equal(signalState(v),'stop');assert.equal(car.x,x);tick(v,1.6);assert.equal(signalState(v),'go');assert.ok(car.x<x);
});
test('logs carry the player; water and traffic impacts settle once',()=>{
 const w=createWorld(2),log=w.logs.find(l=>l.row===2);w.player={x:log.x+1,row:2};const x=w.player.x;tick(w,.1);assert.ok(w.player.x>x);assert.equal(w.state,'playing');
 const water=createWorld();water.logs=[];water.player={x:5,row:2};tick(w,.1);advance(water,.1);advance(water,.1);assert.equal(water.reason,'water');assert.equal(water.events.filter(e=>e.type==='impact').length,1);
 const hit=createWorld();hit.player={x:hit.traffic[0].x,row:4};tick(hit,.5);assert.equal(hit.reason,'traffic');assert.equal(hit.events.filter(e=>e.type==='impact').length,1);
});
test('goal awards one route bonus and rejects subsequent input',()=>{
 const w=createWorld(3);w.player={x:4,row:1};w.farthest=1;step(w,'up');assert.equal(w.state,'arriving');assert.equal(w.score,308);tick(w,2);assert.equal(w.score,308);assert.equal(requestMove(w,'left'),false);assert.equal(w.events.filter(e=>e.type==='checkpoint').length,1);
});
test('the next landing cue accounts for stopped traffic and blocked rocks',()=>{
 const w=createWorld(3);w.player={x:5.5,row:4};assert.equal(nextLanding(w),'blocked');w.player={x:w.traffic.find(c=>c.row===5).x,row:6};assert.equal(nextLanding(w),'danger');
});
test('legacy best remains; malformed and out of range journey data is sanitized',()=>{
 const storage=memory();storage.setItem(BEST_KEY,'731');assert.equal(readBest(storage),731);storage.setItem(SAVE_KEY,'broken');assert.deepEqual(readJourney(storage).clears,[0,0,0]);
 storage.setItem(SAVE_KEY,JSON.stringify({clears:[-2,2.8,1e20],lanterns:-1,aurora:false,equipped:'aurora'}));assert.deepEqual(readJourney(storage).clears,[0,2,9999]);assert.equal(readJourney(storage).equipped,'gold');
});
test('cosmetic purchase is permanent, exact cost, idempotent and persists other progress',()=>{
 const storage=memory();saveJourney(storage,{...readJourney(storage),clears:[1,2,3],lanterns:9});let balance=20,calls=0;
 const wallet={read:()=>({diamonds:balance}),spendDiamonds:n=>{calls++;balance-=n;return true;}};
 assert.equal(buyAurora(storage,wallet).ok,true);assert.equal(balance,8);assert.equal(readJourney(storage).equipped,'aurora');assert.deepEqual(readJourney(storage).clears,[1,2,3]);assert.equal(readJourney(storage).lanterns,9);
 assert.equal(buyAurora(storage,wallet).alreadyOwned,true);assert.equal(calls,1);
});
test('insufficient funds and failed entitlement write never debit; failed debit rolls back',()=>{
 const storage=memory();let calls=0;const wallet={read:()=>({diamonds:2}),spendDiamonds:()=>{calls++;return true;}};
 assert.equal(buyAurora(storage,wallet).reason,'funds');assert.equal(calls,0);
 wallet.read=()=>({diamonds:20});assert.equal(buyAurora({...storage,setItem(){throw Error('quota');}},wallet).reason,'storage');assert.equal(calls,0);
 wallet.spendDiamonds=()=>false;assert.equal(buyAurora(storage,wallet).ok,false);assert.equal(storage.getItem(SAVE_KEY),null);
 saveJourney(storage,{...readJourney(storage),lanterns:7});const previous=storage.getItem(SAVE_KEY);wallet.spendDiamonds=()=>{throw Error('wallet quota');};assert.equal(buyAurora(storage,wallet).ok,false);assert.equal(storage.getItem(SAVE_KEY),previous);
});
test('all thirteen catalogs include complete route, rule and purchase copy',()=>{
 assert.equal(Object.keys(EXTRA).length,13);const keys=Object.keys(EXTRA.en).sort();for(const copy of Object.values(EXTRA)){assert.deepEqual(Object.keys(copy).sort(),keys);assert.equal(copy.routes.length,3);for(const value of Object.values(copy))assert.ok(value.length>0);}
});
