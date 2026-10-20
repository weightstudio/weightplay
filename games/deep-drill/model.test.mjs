import test from 'node:test';
import assert from 'node:assert/strict';
import {normalize,buy,newRun,tick,settle,capacity,upgradeCost,HEADS,goalMet} from './model.mjs';
import {STAGES,seams,ROCKS} from './stages.mjs';
const advance=(save,r,seconds,held=true)=>{for(let t=0;t<seconds;t+=1/60)tick(save,r,1/60,held);};
test('corrupt/old saves normalize without invented purchases',()=>{
 const s=normalize({coins:-3,unlocked:100,heads:[2,2,99],head:99,upgrades:{power:Infinity,cargo:900},cleared:[1,1,'x'],auto:{drill:'yes',cool:true}});
 assert.equal(s.coins,0);assert.equal(s.unlocked,30);assert.deepEqual(s.heads,[0,2]);assert.equal(s.head,0);assert.equal(s.upgrades.power,0);assert.equal(s.upgrades.cargo,20);assert.deepEqual(s.cleared,[1]);assert.equal(s.auto.drill,false);assert.equal(s.auto.cool,true);
 assert.equal(normalize(null).unlocked,1);
});
test('purchases are atomic and re-equipping owned heads is free',()=>{
 const s=normalize();const initial=JSON.stringify(s);assert.equal(buy(s,'head',1),false);assert.equal(JSON.stringify(s),initial);
 s.coins=1000;assert.equal(buy(s,'head',1),true);assert.equal(s.coins,820);assert.equal(s.head,1);buy(s,'head',0);buy(s,'head',1);assert.equal(s.coins,820);
 const cost=upgradeCost(s,'power');buy(s,'upgrade','power');assert.equal(s.coins,820-cost);assert.equal(s.upgrades.power,1);assert.ok(upgradeCost(s,'power')>cost);
 assert.equal(buy(s,'auto','drill'),true);const after=s.coins;assert.equal(buy(s,'auto','drill'),false);assert.equal(s.coins,after);
});
test('depth, harder layers and no mining when paused',()=>{
 const s=normalize(),early=newRun(s,0),deep=newRun(s,29);early.lane=seams(early.stage,0).indexOf('C');deep.lane=seams(deep.stage,0).indexOf('X');
 advance(s,early,.5);advance(s,deep,.5);assert.ok(early.progress>deep.progress);
 early.paused=true;const before=JSON.stringify(early);advance(s,early,10);assert.equal(JSON.stringify(early),before);
});
test('heat forces rescue, cooling works and settlement never duplicates coins',()=>{
 const s=normalize(),r=newRun(s);r.value=100;r.heat=99;advance(s,r,2);assert.equal(r.reason,'overheat');assert.equal(s.coins,65);const bank=s.coins;assert.equal(settle(s,r,'return'),false);assert.equal(s.coins,bank);
 const next=newRun(s);next.heat=70;advance(s,next,2,false);assert.ok(next.heat<40);
});
test('auto drilling must be owned; cooling hysteresis protects rig',()=>{
 const s=normalize({auto:{drill:true,cool:true}}),r=newRun(s);r.heat=75;advance(s,r,.2);assert.equal(r.autoCooling,true);assert.equal(r.row,0);advance(s,r,6);assert.ok(r.row>0);assert.ok(r.heat<100);
 r.paused=true;const depth=r.depth;advance(s,r,100);assert.equal(r.depth,depth);
});
test('full cargo returns, auto sell banks once and result includes earlier sales',()=>{
 const s=normalize(),r=newRun(s);r.cargo=capacity(s);r.value=100;r.progress=.99;advance(s,r,.1);assert.equal(r.reason,'full');assert.ok(s.coins>=100);
 const a=normalize({auto:{sell:true},upgrades:{cargo:1}}),q=newRun(a);q.cargo=capacity(a);q.value=100;q.progress=.99;advance(a,q,.1);assert.equal(q.ended,false);assert.equal(q.cargo,0);assert.ok(a.coins>=100);const bank=a.coins;settle(a,q,'return');assert.equal(q.banked,a.coins);assert.equal(a.coins,bank);
});
test('all heads have an actual effect and upgrade limits cannot overcharge',()=>{
 const s=normalize({coins:100000,upgrades:{power:20}}),before=s.coins;assert.equal(buy(s,'upgrade','power'),false);assert.equal(s.coins,before);
 assert.ok(HEADS[3].heat<HEADS[0].heat);assert.ok(HEADS[2].power>HEADS[1].power);
 const base=normalize(),alloy=normalize({heads:[1],head:1});const a=newRun(base),b=newRun(alloy);a.lane=seams(a.stage,0).indexOf('S');b.lane=a.lane;advance(base,a,.3);advance(alloy,b,.3);assert.ok(b.progress>a.progress*1.5);
});
test('30 stable authored stages, six checkpoints, safe route and valid seams',()=>{
 assert.equal(STAGES.length,30);assert.equal(STAGES.filter(s=>s.checkpoint).length,6);
 assert.ok(new Set(STAGES.map(s=>s.goal)).size>=10);
 for(const s of STAGES)for(let r=0;r<20;r++){const row=seams(s,r);assert.equal(row.length,3);assert.ok(row.every(x=>ROCKS[x]));assert.ok(row.some(x=>x!=='L'));}
});
test('complete expedition unlocks only next stage, banked save survives normalize',()=>{
 const s=normalize(),r=newRun(s);r.depth=100;r.value=50;settle(s,r,'complete');assert.equal(r.clear,true);assert.equal(s.unlocked,2);assert.deepEqual(s.cleared,[1]);assert.deepEqual(normalize(JSON.parse(JSON.stringify(s))),s);
});
test('missing stage objective cannot unlock and crystal must use short pulses',()=>{
 const s=normalize(),r=newRun(s,16);r.depth=100;assert.equal(goalMet(r),false);settle(s,r,'complete');assert.equal(r.clear,false);assert.equal(s.unlocked,1);
 const c=newRun(s,15);c.lane=seams(c.stage,0).indexOf('X');c.progress=.99;c.held=.2;advance(s,c,.15);assert.equal(c.stats.quality,1);
 const d=newRun(s,15);d.lane=c.lane;d.progress=.99;d.held=3;advance(s,d,.15);assert.equal(d.stats.quality,0);assert.ok(c.value>d.value);
});
test('auto cooling anticipates a magma contact instead of rescuing too late',()=>{
 const s=normalize({auto:{drill:true,cool:true}}),r=newRun(s,10);r.lane=seams(r.stage,0).indexOf('L');r.progress=.9;r.heat=70;
 advance(s,r,.1);assert.equal(r.autoCooling,true);assert.equal(r.ended,false);assert.equal(r.row,0);
});
test('every authored objective has a reachable model route with earned-style upgrades',()=>{
 for(const stage of STAGES){
  const s=normalize({upgrades:{power:2,speed:2,cooling:4,cargo:3}}),r=newRun(s,stage.id-1);let cooling=false,pulse=0,oldRow=-1;
  for(let t=0;t<1200&&!r.ended;t+=1/60){
   if(r.row!==oldRow){oldRow=r.row;const row=seams(stage,r.row),stats=r.stats;
    let want='C';switch(stage.goal){case'gold':want=stats.gold<stage.quota?'G':'W';break;case'coolant':want=stats.coolant<stage.quota?'W':'C';break;case'quality':case'crystal':want='X';break;case'balanced':want=stats.copper<stage.quota?'C':stats.gold<Math.ceil(stage.quota/2)?'G':'W';break;case'mastery':want=stats.quality<stage.quota?'X':stats.coolant<3?'W':'X';break;case'cool':want=r.row===19?'W':'C';break;}
    const found=row.indexOf(want);r.lane=found>=0?found:row.indexOf('W')>=0?row.indexOf('W'):row.findIndex(x=>x!=='L');r.progress=0;
   }
   if(r.heat>60||r.pressure>=24)cooling=true;if(r.heat<12&&r.pressure<4)cooling=false;
   pulse+=1/60;const rest=cooling||pulse>.75;tick(s,r,1/60,!rest);if(pulse>.78)pulse=0;
  }
  assert.equal(r.clear,true,`${stage.id} ${stage.goal}: ${JSON.stringify(r.stats)} depth=${r.depth} heat=${r.heat}`);
 }
});
