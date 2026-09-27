import test from 'node:test';
import assert from 'node:assert/strict';
import {STAGES,TRACKS,VEHICLES,UPGRADE_COSTS,vehicleStats,campaignStars} from '../data.mjs';
import {freshSave,validateSave,rewardResult,purchaseUpgrade,SaveStore} from '../store.mjs';
const result=(extra={})=>({runId:'one',stageId:1,success:true,stars:3,time:30,rank:1,progress:1,...extra});

test('30 authored stages reference seven circuits and valid goal budgets',()=>{
  assert.equal(STAGES.length,30);assert.equal(TRACKS.length,7);assert.equal(VEHICLES.length,4);
  assert.deepEqual(VEHICLES.map(v=>v.characterId),['spark-paw-fox','rainbow-hop-rabbit','drum-belly-panda','bubble-fin-otter']);
  assert.deepEqual(VEHICLES.map(v=>v.id),['fox','hare','panda','penguin']);
  assert.equal(new Set(STAGES.map(s=>s.track)).size,7);
  for(const [i,s]of STAGES.entries()){
    assert.equal(s.id,i+1);assert.ok(TRACKS[s.track]);assert.ok(s.ace<s.par&&s.par<s.limit);
    assert.ok(s.collect<=s.rings.length*s.laps);assert.ok(s.rivals<=5);
    assert.ok(s.fuel>=0&&s.fuel<=1);assert.ok(s.laps>=1&&s.laps<=3);
    for(const [a,b]of s.wet)assert.ok(a>=0&&b<=1&&a<b);
  }
  assert.ok(STAGES.some(s=>s.noRefill));assert.ok(STAGES.some(s=>s.wind));
  assert.equal(STAGES.at(-1).place,1);assert.ok(Number.isFinite(STAGES.at(-1).contactCap));
});
test('baseline car and bounded upgrades match garage descriptions',()=>{
  const base=vehicleStats(0),max=vehicleStats(0,{engine:99,tires:99,tank:99});
  assert.equal(max.speed-base.speed,3.25);assert.equal(max.grip-base.grip,1.5);assert.equal(max.tank,1.5);
  assert.equal(vehicleStats(0,{engine:-99}).speed,base.speed);
});
test('corrupt, legacy and absent saves are safe',()=>{
  for(const value of [null,[],{},'bad',{version:2}])assert.deepEqual(validateSave(value),freshSave());
  const store=new SaveStore({getItem:()=>'{ broken'});assert.equal(store.available,false);assert.equal(store.data.unlocked,1);
  const oversized=new SaveStore({getItem:()=> 'x'.repeat(65537)});assert.equal(oversized.available,false);
});
test('unlocks require consecutive records; locked selected cars are rejected',()=>{
  const save=validateSave({version:1,unlocked:999,vehicle:3,coins:Infinity,tuning:{engine:999,tires:-8},records:{1:{stars:2,best:32,rank:2},3:{stars:1,best:40,rank:3}}});
  assert.equal(save.unlocked,2);assert.equal(save.vehicle,0);assert.equal(save.coins,0);
  assert.equal(save.tuning.engine,5);assert.equal(save.tuning.tires,0);assert.equal(campaignStars(save),3);
});
test('one completed race pays exactly once and opens the next stage',()=>{
  const save=freshSave();assert.equal(rewardResult(save,result()),180);assert.equal(save.unlocked,2);
  assert.equal(rewardResult(save,result()),0);assert.equal(save.coins,180);assert.equal(save.records[1].stars,3);
});
test('replays preserve best stars/time/rank, with only replay rewards',()=>{
  const save=freshSave();rewardResult(save,result());assert.equal(rewardResult(save,result({runId:'two',stars:1,time:44,rank:3})),40);
  assert.deepEqual(save.records[1],{stars:3,best:30,rank:1});
});
test('failed races do not unlock stages and bounded participation rewards are idempotent',()=>{
  const save=freshSave();assert.equal(rewardResult(save,result({success:false,progress:.2})),0);
  assert.equal(rewardResult(save,result({runId:'two',success:false,progress:.5})),10);
  assert.equal(rewardResult(save,result({runId:'two',success:false,progress:.5})),0);
  assert.equal(save.unlocked,1);assert.deepEqual(save.records,{});
});
test('all five upgrades charge the exact costs and cannot overspend',()=>{
  const save=freshSave();assert.equal(purchaseUpgrade(save,'engine'),false);
  save.coins=UPGRADE_COSTS.reduce((a,b)=>a+b,0);
  for(let i=0;i<5;i++)assert.equal(purchaseUpgrade(save,'engine'),true);
  assert.equal(save.coins,0);assert.equal(save.tuning.engine,5);assert.equal(purchaseUpgrade(save,'engine'),false);
  assert.equal(purchaseUpgrade(save,'__proto__'),false);
});
test('unavailable storage keeps the active session and never erases its reward',()=>{
  const store=new SaveStore({getItem:()=>null,setItem:()=>{throw new Error('QUOTA');}});
  store.settle(result());assert.equal(store.available,false);assert.equal(store.data.coins,180);assert.equal(store.data.unlocked,2);
  store.settle(result());assert.equal(store.data.coins,180);
});
test('round trips retain progression, selection and bounded settlement history',()=>{
  let json=null;const memory={getItem:()=>json,setItem:(_key,value)=>{json=value;}};
  const store=new SaveStore(memory);
  store.settle(result());store.settle(result({runId:'stage2',stageId:2}));assert.equal(store.select(1),true);
  assert.equal(store.select(3),false);assert.equal(store.select(-1),false);
  for(let i=0;i<80;i++)store.settle(result({runId:`failure-${i}`,success:false,progress:0}));
  const restored=new SaveStore(memory);assert.equal(restored.data.vehicle,1);assert.equal(restored.data.unlocked,3);
  assert.equal(restored.data.settled.length,32);assert.equal(campaignStars(restored.data),6);
});
