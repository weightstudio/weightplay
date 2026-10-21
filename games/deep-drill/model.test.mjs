import test from 'node:test';
import assert from 'node:assert/strict';
import {normalize,buy,newRun,tick,settle,capacity,upgradeCost,HEADS,goalMet,cellState,selectRoute} from './model.mjs';
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
test('heat is absent, pressure still rescues and settlement cannot duplicate',()=>{
 const s=normalize(),r=newRun(s);assert.equal('heat' in r,false);advance(s,r,8);assert.equal(r.ended,false);assert.ok(r.row>0);
 const q=newRun(s,20);q.pressure=99.9;q.value=100;advance(s,q,.1);assert.equal(q.reason,'pressure');assert.equal(s.coins,65);assert.equal(settle(s,q,'return'),false);
});
test('automatic venting has pressure hysteresis and pause freezes mining',()=>{
 const s=normalize({auto:{drill:true,cool:true}}),r=newRun(s,20);r.pressure=75;advance(s,r,.2);assert.equal(r.autoCooling,true);advance(s,r,6);assert.ok(r.row>0);assert.ok(r.pressure<100);
 r.paused=true;const snapshot=JSON.stringify(r);advance(s,r,100);assert.equal(JSON.stringify(r),snapshot);
});
test('full cargo returns, auto sell banks once and result includes earlier sales',()=>{
 const s=normalize(),r=newRun(s);r.cargo=capacity(s);r.value=100;cellState(r).hp=1;advance(s,r,.1);assert.equal(r.reason,'full');assert.ok(s.coins>=100);
 const a=normalize({auto:{sell:true},upgrades:{cargo:1}}),q=newRun(a);q.cargo=capacity(a);q.value=100;cellState(q).hp=1;advance(a,q,.1);assert.equal(q.ended,false);assert.equal(q.cargo,0);assert.ok(a.coins>=100);const bank=a.coins;settle(a,q,'return');assert.equal(q.banked,a.coins);assert.equal(a.coins,bank);
});
test('all heads have an actual effect and upgrade limits cannot overcharge',()=>{
 const s=normalize({coins:100000,upgrades:{power:20}}),before=s.coins;assert.equal(buy(s,'upgrade','power'),false);assert.equal(s.coins,before);
 assert.ok(HEADS[3].power>HEADS[0].power);assert.ok(HEADS[2].power>HEADS[1].power);
 const base=normalize(),alloy=normalize({heads:[1],head:1});const a=newRun(base),b=newRun(alloy);a.lane=seams(a.stage,0).indexOf('S');b.lane=a.lane;advance(base,a,.3);advance(alloy,b,.3);assert.ok(b.depth+b.progress*5>(a.depth+a.progress*5)*1.5);
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
 const c=newRun(s,15);c.lane=seams(c.stage,0).indexOf('X');cellState(c).hp=1;c.held=.2;advance(s,c,.15);assert.equal(c.stats.quality,1);
 const d=newRun(s,15);d.lane=c.lane;cellState(d).hp=1;d.held=3;advance(s,d,.15);assert.equal(d.stats.quality,0);assert.ok(c.value>d.value);
});
function play(s,stage){
  const r=newRun(s,stage.id-1);r.auto=false;let cooling=false,pulse=0,oldRow=-1;
  for(let t=0;t<1200&&!r.ended;t+=1/60){
   const seal=sealState(r);if(seal&&r.lane!==seal.lane){r.lane=seal.lane;r.progress=0;r.held=0;}
   if(r.row!==oldRow){oldRow=r.row;const row=seams(stage,r.row),stats=r.stats;
    let want='C';switch(stage.goal){case'gold':want=stats.gold<stage.quota?'G':'W';break;case'coolant':want=stats.coolant<stage.quota?'W':'C';break;case'quality':case'crystal':want='X';break;case'balanced':want=stats.copper<stage.quota?'C':stats.gold<Math.ceil(stage.quota/2)?'G':'W';break;case'mastery':want=stats.quality<stage.quota?'X':stats.coolant<3?'W':'X';break;case'cool':want=r.row===19?'W':'C';break;}
    const found=row.indexOf(want);r.lane=seal?seal.lane:found>=0?found:row.indexOf('W')>=0?row.indexOf('W'):row.findIndex(x=>!['L','B','D'].includes(x));if(r.lane<0)r.lane=row.findIndex(x=>x!=='L');r.progress=0;
   }
   if(r.pressure>=24)cooling=true;if(r.pressure<4)cooling=false;
   pulse+=1/60;const rest=cooling||pulse>.65||(seal&&!seal.open);tick(s,r,1/60,!rest);if(pulse>.7)pulse=0;
  }
  return r;
}
test('every authored objective and seal has a reachable model route',()=>{
 for(const stage of STAGES){const s=normalize({upgrades:{power:2,speed:2,cooling:4,cargo:3}}),r=play(s,stage);assert.equal(r.clear,true,`${stage.id} ${stage.goal}: ${JSON.stringify(r.stats)} depth=${r.depth} heat=${r.heat} seal=${JSON.stringify(r.seal)}`);}
});
test('v1 saves retain equipment and clears while adding bounded full-game systems',()=>{
 const s=normalize({schema:1,coins:555,heads:[0,2],head:2,unlocked:6,cleared:[1,2,3,4,5],upgrades:{power:3}});
 assert.equal(s.schema,3);assert.equal(s.coins,555);assert.equal(s.head,2);assert.equal(s.upgrades.power,3);assert.equal(s.unlocked,6);assert.deepEqual(s.relics,[0]);assert.equal(s.materials.copper,0);assert.deepEqual(normalize(JSON.parse(JSON.stringify(s))),s);
});
test('crafting, recruiting and two-slot equipment never duplicate or overspend',()=>{
 const s=normalize({coins:5000,unlocked:30,materials:{copper:100,crystal:40}}),before=structuredClone(s);assert.equal(buy(s,'module','bad'),false);assert.deepEqual(s,before);
 assert.equal(buy(s,'module','exchanger'),true);assert.equal(s.materials.copper,88);assert.equal(buy(s,'module','exchanger'),false);
 buy(s,'module','prism');buy(s,'module','compressor');equipModule(s,'exchanger');equipModule(s,'prism');equipModule(s,'compressor');assert.deepEqual(s.equipped,['prism','compressor']);assert.equal(capacity(s),56);
 assert.equal(buy(s,'crew','bubble'),true);assert.equal(s.activeCrew,'bubble');assert.equal(capacity(s),66);const coins=s.coins;assert.equal(buy(s,'crew','bubble'),false);assert.equal(s.coins,coins);
});
test('tools consume only on actual effects and cannot bypass a seal',()=>{
 const s=normalize({tools:{coolant:2,blast:2,repair:1}}),r=newRun(s);assert.equal(useTool(s,r,'coolant'),false);assert.equal(s.tools.coolant,2);
 r.pressure=70;assert.equal(useTool(s,r,'coolant'),true);assert.equal(s.tools.coolant,1);assert.equal(r.pressure,50);assert.equal(useTool(s,r,'coolant'),false);
 r.toolCooldown=0;r.hull=30;assert.equal(useTool(s,r,'repair'),true);assert.equal(r.hull,70);
 const boss=newRun(s,4);boss.row=19;assert.equal(useTool(s,boss,'blast'),false);assert.equal(s.tools.blast,2);
 const ore=newRun(s);assert.equal(useTool(s,ore,'blast'),true);advance(s,ore,.05,false);assert.equal(ore.row,1);assert.equal(s.tools.blast,1);
});
test('all six seals reject invalid counterplay and final activation has three rules',()=>{
 for(let arc=0;arc<6;arc++){const s=normalize(),r=newRun(s,arc*5+4);r.row=19;r.depth=95;const state=sealState(r);r.lane=(state.lane+1)%3;
 assert.equal(sealContact(s,r),false);assert.equal(r.seal.phase,0);r.lane=state.lane;r.held=.5;r.stats.vent=1;r.seal.time=3;
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
 assert.equal(s.ending,true);assert.equal(s.cleared.length,30);assert.equal(s.relics.length,6);assert.ok(s.coins>=0);assert.ok(totalSeconds>0);console.log(`Fresh campaign model: 30/30, six seals, ${Math.ceil(totalSeconds)} active seconds, ${s.coins} unspent coins.`);
});
test('automatic sales retain lifetime income and sold layers across save/reload without double accounting',()=>{
 const s=normalize({auto:{sell:true}}),r=newRun(s);r.cargo=32;r.value=100;cellState(r).hp=1;
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
 function one(save,index,row,kind){const r=newRun(save,index);r.row=row;r.depth=row*5;r.lane=seams(r.stage,row).indexOf(kind);assert.ok(r.lane>=0);cellState(r).hp=1;advance(save,r,.025);return r;}
 const steel=one(normalize(),10,1,'B'),alloy=one(normalize({heads:[1],head:1}),10,1,'B');assert.equal(steel.hull,92);assert.equal(alloy.hull,97);
 const frost=one(normalize(),5,1,'I'),energy=one(normalize(),15,4,'E');assert.ok(frost.frost>3);assert.ok(energy.buff>5);
 const basic=one(normalize(),0,0,'G'),orla=one(normalize({crew:['orla'],activeCrew:'orla'}),0,0,'G');assert.ok(orla.value>basic.value);
 const s=normalize({modules:['beacon'],equipped:['beacon']}),rescue=newRun(s);rescue.value=100;settle(s,rescue,'pressure');assert.equal(s.coins,90);
});

test('v2 cooling investment becomes impact damage idempotently without changing money or progress',()=>{
 const raw={schema:2,coins:777,unlocked:20,cleared:[1,2,19],heads:[0,2],head:2,upgrades:{cooling:5,power:3,speed:2},auto:{cool:true},records:{19:{stars:3,time:28}},tools:{blast:4,repair:3,coolant:8}};
 const s=normalize(raw);assert.equal(s.upgrades.cooling,5);assert.equal(s.coins,777);assert.equal(s.auto.cool,true);assert.deepEqual(s.records,raw.records);assert.equal(s.helpers,0);assert.deepEqual(normalize(JSON.parse(JSON.stringify(s))),s);
 const base=normalize(),a=newRun(base),b=newRun(s);tick(base,a,.01,true);tick(s,b,.01,true);assert.ok(cellState(b).hp/cellState(b).max<cellState(a).hp/cellState(a).max);
});
test('cell HP survives route switching and manual/auto upgrades each improve real mining output',()=>{
 const base=normalize(),r=newRun(base);tick(base,r,.01,true);const hp=cellState(r).hp;selectRoute(r,0);selectRoute(r,1);assert.equal(cellState(r).hp,hp);
 function output(raw,auto=false){const s=normalize(raw),r=newRun(s);advance(s,r,3,!auto);return r.depth+r.progress*5;}
 assert.ok(output({upgrades:{power:3}})>output({}));assert.ok(output({upgrades:{speed:3}})>output({}));
 assert.ok(output({auto:{drill:true},upgrades:{autoPower:3}},true)>output({auto:{drill:true}},true));assert.ok(output({auto:{drill:true},upgrades:{autoSpeed:3}},true)>output({auto:{drill:true}},true));
 const s=normalize({coins:1000}),before=s.coins;assert.equal(buy(s,'upgrade','autoSpeed'),false);assert.equal(s.coins,before);
});
test('hired assistants work without holding, persist, train, pause and never bypass seals',()=>{
 const s=normalize({coins:10000});for(let i=0;i<3;i++)assert.equal(buy(s,'helper','miner'),true);const coins=s.coins;assert.equal(buy(s,'helper','miner'),false);assert.equal(s.coins,coins);assert.equal(normalize(s).helpers,3);
 const r=newRun(s);advance(s,r,3,false);assert.ok(r.depth>0);r.helpersOn=false;const before=cellState(r).hp;advance(s,r,2,false);assert.equal(cellState(r).hp,before);
 const q=newRun(s,4);q.row=19;advance(s,q,5,false);assert.equal(q.seal.phase,0);
});
test('beam breaks exactly one visible cell and pays once without skipping depth, seals or objectives',()=>{
 const s=normalize({tools:{beam:5}}),r=newRun(s);assert.equal(useTool(s,r,'beam',{row:2,lane:0}),true);advance(s,r,.02,false);assert.equal(r.row,0);assert.equal(r.mined,1);assert.equal(cellState(r,2,0).hp,0);const money=r.value;r.toolCooldown=0;assert.equal(useTool(s,r,'beam',{row:2,lane:0}),false);assert.equal(r.value,money);
 assert.equal(useTool(s,r,'beam',{row:3,lane:0}),false);const q=newRun(s,4);q.row=17;assert.equal(useTool(s,q,'beam',{row:19,lane:0}),false);assert.equal(q.seal.phase,0);
 const g=newRun(s,10);g.lane=seams(g.stage,0).indexOf('L');assert.equal(useTool(s,g,'beam'),true);advance(s,g,.02,false);assert.equal(g.hull,95);assert.equal(g.mined,1);
});
