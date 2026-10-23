import test from 'node:test';
import assert from 'node:assert/strict';
import {LEVELS} from './levels.mjs';
import {CAMPAIGN_COPY} from './campaign-copy.mjs';
import {createWorld,requestMove,advance,useSignal,readCampaign,recordClear,readJourney,SAVE_KEY,CAMPAIGN_KEY} from './model.mjs';
const tick=(w,t)=>{for(let elapsed=0;elapsed<t-1e-8;elapsed+=.02)advance(w,Math.min(.02,t-elapsed));};
test('30 authored levels, six checkpoints, valid terrain, objects, exits and translated rules',()=>{
 assert.deepEqual(LEVELS.map(l=>l.id),Array.from({length:30},(_,i)=>i+1));
 assert.deepEqual(LEVELS.filter(l=>l.checkpoint).map(l=>l.id),[5,10,15,20,25,30]);
 assert.equal(new Set(LEVELS.map(l=>JSON.stringify([l.terrain,l.exits,l.rocks,l.pickups,l.signals,l.currents,l.trucks]))).size,30);
 for(const l of LEVELS){assert.equal(l.terrain.length,9);assert.equal(l.pickups.length,3);for(const [row,x] of [...l.rocks,...l.pickups]){assert.ok(row>0&&row<8&&x>=.5&&x<=9.5);}
  for(const [row,x] of l.pickups)assert.ok(!l.rocks.some(([r,v])=>r===row&&v===x));
  for(const s of l.signals)assert.equal(l.terrain[s.row],'R');
  for(const i of l.required)assert.ok(l.pickups[i]);
 }
 const keys=Object.keys(CAMPAIGN_COPY.en).sort();assert.equal(Object.keys(CAMPAIGN_COPY).length,13);
 for(const c of Object.values(CAMPAIGN_COPY)){assert.deepEqual(Object.keys(c).sort(),keys);for(const l of LEVELS)assert.ok(c[l.hint]);assert.equal(c.arcs.length,6);}
});
test('delivery gate and dock alignment refuse premature arrival without taking a move',()=>{
 const w=createWorld(30);w.player={x:7.5,row:1};assert.equal(requestMove(w,'up'),false);assert.equal(w.events.at(-1).reason,'cargo');assert.equal(w.moves,0);
 w.pickups.filter(p=>p.required).forEach(p=>p.taken=true);w.player.x=3.5;assert.equal(requestMove(w,'up'),false);assert.equal(w.events.at(-1).reason,'dock');
 w.player.x=7.5;requestMove(w,'up');tick(w,.2);assert.equal(w.state,'arriving');
});
test('one signal charge stops traffic, never the current, then releases naturally',()=>{
 const w=createWorld(16),car=w.traffic[0],log=w.logs[0],x=car.x,lx=log.x;
 assert.equal(useSignal(w),true);assert.equal(useSignal(w),false);tick(w,1);assert.equal(car.x,x);assert.notEqual(log.x,lx);
 tick(w,2);assert.notEqual(car.x,x);assert.equal(w.charges,0);
});
test('all 30 clears unlock, medals and best never downgrade, corrupted unlock cannot skip levels',()=>{
 const values=new Map([[SAVE_KEY,JSON.stringify({clears:[4,5,6],lanterns:81,aurora:true,equipped:'aurora'})]]);
 const storage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)};
 const legacy=storage.getItem(SAVE_KEY),c=readCampaign(storage);
 for(const level of LEVELS){assert.equal(c.unlocked,level.id);const w=createWorld(level.id);w.state='arriving';w.lanterns=3;w.score=239;assert.equal(recordClear(c,w),7);w.lanterns=0;w.charges=0;w.moves=99;w.score=164;recordClear(c,w);assert.equal(c.medals[level.id-1],7);assert.equal(c.best[level.id-1],239);}
 storage.setItem(CAMPAIGN_KEY,JSON.stringify(c));assert.deepEqual(readCampaign(storage),c);assert.equal(storage.getItem(SAVE_KEY),legacy);assert.equal(readJourney(storage).aurora,true);
 storage.setItem(CAMPAIGN_KEY,JSON.stringify({unlocked:999,medals:[2,4,0]}));assert.equal(readCampaign(storage).unlocked,1);
});
