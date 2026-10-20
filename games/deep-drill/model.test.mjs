import test from 'node:test';
import assert from 'node:assert/strict';
import {normalize,buy,newRun,tick,settle,capacity,upgradeCost,HEADS,goalMet} from './model.mjs';
import {STAGES,seams,ROCKS} from './stages.mjs';
import {sealState,runSeams,equipModule,claimAchievement,useTool,activeSeal,sealContact,planLane} from './systems.mjs';
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
function play(s,stage){
  const r=newRun(s,stage.id-1);r.auto=false;let cooling=false,pulse=0,oldRow=-1;
  for(let t=0;t<1200&&!r.ended;t+=1/60){
   const seal=sealState(r);if(seal&&r.lane!==seal.lane){r.lane=seal.lane;r.progress=0;r.held=0;}
   if(r.row!==oldRow){oldRow=r.row;const row=seams(stage,r.row),stats=r.stats;
    let want='C';switch(stage.goal){case'gold':want=stats.gold<stage.quota?'G':'W';break;case'coolant':want=stats.coolant<stage.quota?'W':'C';break;case'quality':case'crystal':want='X';break;case'balanced':want=stats.copper<stage.quota?'C':stats.gold<Math.ceil(stage.quota/2)?'G':'W';break;case'mastery':want=stats.quality<stage.quota?'X':stats.coolant<3?'W':'X';break;case'cool':want=r.row===19?'W':'C';break;}
    const found=row.indexOf(want);r.lane=seal?seal.lane:found>=0?found:row.indexOf('W')>=0?row.indexOf('W'):row.findIndex(x=>!['L','B','D'].includes(x));if(r.lane<0)r.lane=row.findIndex(x=>x!=='L');r.progress=0;
   }
   if(r.heat>60||r.pressure>=24)cooling=true;if(r.heat<12&&r.pressure<4)cooling=false;
   pulse+=1/60;const rest=cooling||pulse>.65||(seal&&!seal.open);tick(s,r,1/60,!rest);if(pulse>.7)pulse=0;
  }
  return r;
}
test('every authored objective and seal has a reachable model route',()=>{
 for(const stage of STAGES){const s=normalize({upgrades:{power:2,speed:2,cooling:4,cargo:3}}),r=play(s,stage);assert.equal(r.clear,true,`${stage.id} ${stage.goal}: ${JSON.stringify(r.stats)} depth=${r.depth} heat=${r.heat} seal=${JSON.stringify(r.seal)}`);}
});
test('v1 saves retain equipment and clears while adding bounded full-game systems',()=>{
 const s=normalize({schema:1,coins:555,heads:[0,2],head:2,unlocked:6,cleared:[1,2,3,4,5],upgrades:{power:3}});
 assert.equal(s.schema,2);assert.equal(s.coins,555);assert.equal(s.head,2);assert.equal(s.upgrades.power,3);assert.equal(s.unlocked,6);assert.deepEqual(s.relics,[0]);assert.equal(s.materials.copper,0);assert.deepEqual(normalize(JSON.parse(JSON.stringify(s))),s);
});
test('crafting, recruiting and two-slot equipment never duplicate or overspend',()=>{
 const s=normalize({coins:5000,unlocked:30,materials:{copper:100,crystal:40}}),before=structuredClone(s);assert.equal(buy(s,'module','bad'),false);assert.deepEqual(s,before);
 assert.equal(buy(s,'module','exchanger'),true);assert.equal(s.materials.copper,88);assert.equal(buy(s,'module','exchanger'),false);
 buy(s,'module','prism');buy(s,'module','compressor');equipModule(s,'exchanger');equipModule(s,'prism');equipModule(s,'compressor');assert.deepEqual(s.equipped,['prism','compressor']);assert.equal(capacity(s),56);
 assert.equal(buy(s,'crew','bubble'),true);assert.equal(s.activeCrew,'bubble');assert.equal(capacity(s),66);const coins=s.coins;assert.equal(buy(s,'crew','bubble'),false);assert.equal(s.coins,coins);
});
test('tools consume only on actual effects and cannot bypass a seal',()=>{
 const s=normalize({tools:{coolant:2,blast:2,repair:1}}),r=newRun(s);assert.equal(useTool(s,r,'coolant'),false);assert.equal(s.tools.coolant,2);
 r.heat=70;assert.equal(useTool(s,r,'coolant'),true);assert.equal(s.tools.coolant,1);assert.equal(r.heat,28);assert.equal(useTool(s,r,'coolant'),false);
 r.toolCooldown=0;r.hull=30;assert.equal(useTool(s,r,'repair'),true);assert.equal(r.hull,70);
 const boss=newRun(s,4);boss.row=19;assert.equal(useTool(s,boss,'blast'),false);assert.equal(s.tools.blast,2);
 const ore=newRun(s);assert.equal(useTool(s,ore,'blast'),true);advance(s,ore,.05,false);assert.equal(ore.row,1);assert.equal(s.tools.blast,1);
});
test('all six seals reject invalid counterplay and final activation has three rules',()=>{
 for(let arc=0;arc<6;arc++){const s=normalize(),r=newRun(s,arc*5+4);r.row=19;r.depth=95;const state=sealState(r);r.lane=(state.lane+1)%3;
 assert.equal(sealContact(s,r),false);assert.equal(r.seal.phase,0);r.lane=state.lane;r.heat=30;r.held=.5;r.stats.vent=1;r.seal.time=3;
 // Timed seal changes its target with its real clock.
 r.lane=sealState(r).lane;assert.equal(sealContact(s,r),false);assert.equal(r.seal.phase,1);
 }
 const s=normalize(),r=newRun(s,29);r.row=19;r.seal.phase=1;r.lane=sealState(r).lane;r.held=3;sealContact(s,r);assert.equal(r.seal.phase,1);
 r.held=.5;sealContact(s,r);assert.equal(r.seal.phase,2);r.lane=sealState(r).lane;sealContact(s,r);assert.equal(r.seal.phase,2);r.stats.vent++;assert.equal(sealContact(s,r),true);assert.equal(r.seal.phase,3);
});
test('achievement rewards and relic/ending settlement are idempotent',()=>{
 const s=normalize(),r=newRun(s);settle(s,r,'return');assert.equal(claimAchievement(s,'first'),true);const coins=s.coins;assert.equal(claimAchievement(s,'first'),false);assert.equal(s.coins,coins);
 const end=newRun(s,29);end.row=20;end.depth=100;end.seal.phase=3;settle(s,end,'complete');assert.equal(s.ending,true);assert.ok(s.relics.includes(5));assert.equal(s.materials.core,1);settle(s,end,'complete');assert.equal(s.materials.core,1);
});
test('fresh model campaign reaches the ending using only real earnings and purchases',()=>{
 const s=normalize();let totalSeconds=0;
 for(const stage of STAGES){
  assert.ok(stage.id<=s.unlocked);
  if(stage.id>=2&&!s.heads.includes(1))buy(s,'head',1);
  if(stage.id>=11&&!s.heads.includes(2)&&s.coins>800)buy(s,'head',2);
  if(stage.id>=21&&!s.heads.includes(3)&&s.coins>2000)buy(s,'head',3);
  for(const key of ['cargo','cooling','power','speed']){const desired=Math.min(4,Math.ceil(stage.id/7));while(s.upgrades[key]<desired&&s.coins>=upgradeCost(s,key))assert.equal(buy(s,'upgrade',key),true);}
  const r=play(s,stage);assert.equal(r.clear,true,`fresh stage ${stage.id}, coins=${s.coins}, ${r.reason}, row=${r.row}, hull=${r.hull}`);totalSeconds+=r.time;
 }
 assert.equal(s.ending,true);assert.equal(s.cleared.length,30);assert.equal(s.relics.length,6);assert.ok(s.coins>=0);assert.ok(totalSeconds>300);console.log(`Fresh campaign model: 30/30, six seals, ${Math.ceil(totalSeconds)} active seconds, ${s.coins} unspent coins.`);
});
test('automatic sales retain lifetime income and sold layers across save/reload without double accounting',()=>{
 const s=normalize({auto:{sell:true}}),r=newRun(s);r.cargo=32;r.value=100;r.progress=.999;
 advance(s,r,.04);assert.equal(r.ended,false);assert.equal(s.total.earned,s.coins);assert.equal(s.total.ore,1);
 const restored=normalize(JSON.parse(JSON.stringify(s)));assert.equal(restored.total.earned,s.coins);assert.equal(restored.total.ore,1);
 settle(s,r,'return');assert.equal(s.total.earned,s.coins);assert.equal(s.total.ore,1);
});
test('salvage fabrication is an atomic alternative to buying supplies',()=>{
 const s=normalize({coins:19,materials:{salvage:2}});assert.equal(buy(s,'fabricate','coolant'),true);assert.equal(s.coins,19);assert.equal(s.materials.salvage,0);assert.equal(s.tools.coolant,3);
 const before=JSON.stringify(s);assert.equal(buy(s,'fabricate','coolant'),false);assert.equal(JSON.stringify(s),before);
 s.tools.coolant=99;s.materials.salvage=10;assert.equal(buy(s,'fabricate','coolant'),false);assert.equal(s.materials.salvage,10);
});
test('prototype or noncanonical transaction keys cannot create NaN or change savings',()=>{
 const s=normalize({coins:10000}),before=JSON.stringify(s);for(const type of ['head','upgrade','auto','module','crew','tool','fabricate','__proto__'])for(const key of ['__proto__','constructor','toString'])assert.equal(buy(s,type,key),false);
 assert.equal(JSON.stringify(s),before);
});
test('hazards, crew and modules produce the declared gameplay effects',()=>{
 function one(save,index,row,kind){const r=newRun(save,index);r.row=row;r.depth=row*5;r.lane=seams(r.stage,row).indexOf(kind);assert.ok(r.lane>=0);r.progress=.999;advance(save,r,.025);return r;}
 const steel=one(normalize(),10,1,'B'),alloy=one(normalize({heads:[1],head:1}),10,1,'B');assert.equal(steel.hull,92);assert.equal(alloy.hull,97);
 const frost=one(normalize(),5,1,'I'),energy=one(normalize(),15,4,'E');assert.ok(frost.frost>3);assert.ok(energy.buff>5);
 const basic=one(normalize(),0,0,'G'),orla=one(normalize({crew:['orla'],activeCrew:'orla'}),0,0,'G');assert.ok(orla.value>basic.value);
 const s=normalize({modules:['beacon'],equipped:['beacon']}),rescue=newRun(s);rescue.value=100;settle(s,rescue,'overheat');assert.equal(s.coins,90);
});
