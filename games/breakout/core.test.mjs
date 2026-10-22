import test from 'node:test';
import assert from 'node:assert/strict';
import {LEVELS,createRun,resizeRun,serve,pulse,step,aim,sweep,drainEvents,normalizeSave,clearSave} from './core.mjs';
import {purchaseAurora} from './progress.mjs';
import {copy,LOCALES,guide} from './copy.mjs';

test('swept collision catches a thin brick at high speed, and rejects a miss',()=>{
  const box={x:20,y:40,w:30,h:10};
  const contact=sweep(30,0,0,100,5,box);assert.equal(contact.t,.35);assert.equal(Math.abs(contact.nx),0);assert.equal(contact.ny,-1);
  assert.equal(sweep(70,0,0,100,5,box),null);
});
test('paddle edge changes direction, charge is consumed only when ready',()=>{
  for(const offset of [-30,30]){const s=createRun();serve(s);s.ball={x:180+offset,y:s.paddleY-7,vx:0,vy:270};step(s,1/60);assert(s.ball.vy<0);assert.equal(Math.sign(s.ball.vx),Math.sign(offset));}
  const s=createRun();assert.equal(pulse(s),false);serve(s);s.energy=99;assert.equal(pulse(s),false);s.energy=100;assert.equal(pulse(s),true);assert.equal(s.energy,0);assert.equal(s.pierce,3);assert.equal(pulse(s),false);
});
test('three misses end once; no idle physics or duplicate result after loss',()=>{
  const s=createRun();for(let i=0;i<3;i++){serve(s);s.ball={x:0,y:620,vx:0,vy:270};step(s,1/120);}
  assert.equal(s.status,'lost');assert.equal(s.lives,0);assert.equal(drainEvents(s).filter(e=>e.type==='lose').length,1);step(s,10);assert.equal(drainEvents(s).length,0);
});
test('all 30 authored stages can clear through the real collision model in portrait and landscape',()=>{
  const durations=[];
  for(const [width,height]of [[360,680],[720,300]])for(const level of LEVELS){
    const s=createRun(level.id);resizeRun(s,width,height);let frames=0,seed=level.id,offset=0;
    // Engineering agent supplies only legal aim, launch and pulse inputs.
    // It is not browser play evidence or a feature in the shipped controller.
    while(!['won','lost'].includes(s.status)&&frames++<120*600){
      if(s.status==='ready')serve(s);if(s.energy===100)pulse(s);
      aim(s,s.ball.x-(s.ball.vy>0?offset:0));step(s,1/120);
      if(drainEvents(s).some(e=>e.type==='bounce'||e.type==='serve')){seed=(seed*1664525+1013904223)>>>0;offset=(seed/4294967296-.5)*s.paddleWidth*.75;}
      assert(Number.isFinite(s.ball.x)&&Number.isFinite(s.ball.y));
    }
    assert.equal(s.status,'won',`stage ${level.id} ${width}×${height}: ${s.bricks.filter(b=>b.hp>0).length} bricks, core ${s.core?.hp}`);
    if(level.checkpoint)assert.equal(s.core.hp,0);durations.push(Math.round(s.elapsed));
  }
  console.log('60 simulated clears; range',Math.min(...durations),Math.max(...durations),'seconds; not human difficulty evidence');
});
test('legacy clears survive corruption; replay improves rather than regresses stars',()=>{
  let saved=normalizeSave({cleared:{bad:1},stars:{1:99}},{cleared:[1,2,2,-1,31],highestUnlocked:3});assert.deepEqual(saved.cleared,[1,2]);assert.equal(saved.highestUnlocked,3);
  const s=createRun(3);s.status='won';s.score=1200;s.lives=3;saved=clearSave(saved,s);assert.equal(saved.highestUnlocked,4);assert.equal(saved.stars[3],3);
  s.lives=1;s.score=300;saved=clearSave(saved,s);assert.equal(saved.stars[3],3);assert.equal(saved.best[3],1200);assert.equal(saved.cleared.length,3);
  assert.equal(normalizeSave({...saved,paddle:'comet'}).paddle,'comet');assert.equal(normalizeSave({paddle:'comet'}).paddle,'guardian');
});
test('cosmetic purchase is permanent, repeated purchase free, failed save refunds, poor wallet unchanged',()=>{
  let saved=normalizeSave(),balance=20,writes=0;
  const wallet={spendDiamonds(n){if(balance<n)return false;balance-=n;return true;},addDiamonds(n){balance+=n;}};
  const transaction=fail=>purchaseAurora({read:()=>saved,write:s=>{writes++;if(fail&&s.aurora)throw Error('quota');saved=structuredClone(s);},wallet});
  assert.equal(transaction(true).ok,false);assert.equal(balance,20);assert.equal(saved.aurora,false);
  assert.equal(transaction(false).ok,true);assert.equal(balance,5);assert.equal(saved.finish,'aurora');
  assert.equal(transaction(false).charged,0);assert.equal(balance,5);
  saved=normalizeSave();assert.equal(transaction(false).reason,'funds');assert.equal(balance,5);assert.equal(saved.aurora,false);
});
test('13 locales have complete player copy and six campaign arc names',()=>{
  for(const locale of LOCALES){const t=copy(locale);assert.equal(t.arcs.length,6);assert(Object.values(t).every(Boolean));assert.match(guide(locale),/game-info-sections/);assert(!guide(locale).includes('undefined'));}
  assert.equal(new Set(LEVELS.map(l=>l.rows.join('/'))).size,30);
});
