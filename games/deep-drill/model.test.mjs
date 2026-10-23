import test from 'node:test';
import assert from 'node:assert/strict';
import {normalize,buy,newRun,tick,settle,capacity,upgradeCost,cellState,selectRoute,goalMet} from './model.mjs';
import {STAGES,seams,ROCKS} from './stages.mjs';
import {useTool,sealState,sealContact,automaticTool,claimAchievement,planLane} from './systems.mjs';
const advance=(s,r,seconds,held=false,align=false)=>{for(let i=0;i<Math.ceil(seconds*60)&&!r.ended;i++){if(align&&sealState(r))selectRoute(r,sealState(r).lane);tick(s,r,1/60,held);if(r.events.length>512)r.events.length=0;}};
test('all floor materials and seals have exactly ten times v11 rounded HP at matching relative depths',()=>{
 for(const stage of STAGES)for(let row=0;row<stage.layers;row++)for(let lane=0;lane<5;lane++){
  const r=newRun(normalize(),stage.id-1),cell=cellState(r,row,lane),seal=stage.checkpoint&&row===stage.layers-1;
  const previous=Math.round(90*(seal?1.25+stage.arc*.15:(1+stage.arc*.65+(row/stage.layers*20)*.025)*ROCKS[cell.kind].hard));
  assert.equal(cell.max,previous*10);assert.equal(cell.hp,cell.max);
 }
});
test('v10 checkpoint migration preserves exact fractional distance, investments and payouts across reload',()=>{
 const raw={schema:6,coins:2267,heads:[0,1],head:1,auto:{drill:true},upgrades:{power:1},tools:{beam:5,coolant:8,repair:3,blast:4},
  materials:{copper:80,crystal:30,salvage:40,core:2},recordsV10:{1:{stars:3,time:171}},eventClaims:['3:cache'],journeyTools:{1:1},
  journeys:{1:{version:10,stageId:1,row:256,lane:2,time:171,toolsUsed:1,stats:{copper:60,gold:24,vent:2},triggered:[]}}};
 const s=normalize(raw),r=newRun(s);
 assert.equal(r.depth,128);assert.equal(r.stage.target,1600);assert.equal(r.row,25);assert.equal(r.progress,.6);
 assert.equal(s.journeys[1].legacyRow,256);assert.equal(r.journeyToolsUsed,1);
 for(const key of ['coins','head','tools','materials','recordsV10','eventClaims'])assert.deepEqual(s[key],raw[key]);
 assert.deepEqual(normalize(JSON.parse(JSON.stringify(s))),s);
 const original=JSON.stringify(s);settle(s,r,'return');assert.equal(s.coins,2267);assert.deepEqual(s.materials,raw.materials);
 const resumed=newRun(normalize(JSON.parse(original)));assert.equal(resumed.depth,128);
 const c=cellState(resumed);assert.ok(Math.abs(c.hp/c.max-.4)<1e-12);assert.equal(c.paid,true);
 advance(s,resumed,10);assert.ok(resumed.row>25);assert.ok(resumed.depth>=130);assert.ok(resumed.mined<resumed.row-25,'credited cell cannot pay again');
});
test('five deterministic seams keep30 stable IDs,six seals and all objective families',()=>{
 assert.equal(STAGES.length,30);assert.deepEqual(STAGES.map(s=>s.id),Array.from({length:30},(_,i)=>i+1));assert.equal(STAGES.filter(s=>s.checkpoint).length,6);
 for(const s of STAGES)for(let row=0;row<s.layers;row++){const a=seams(s,row);assert.equal(a.length,5);assert.ok(a.every(k=>ROCKS[k]));assert.deepEqual(seams(s,row),a);}
});
test('old save investment,money,equipment and records survive schema7 migration idempotently',()=>{
 const raw={schema:2,coins:777,unlocked:20,cleared:[1,2,19],heads:[0,2],head:2,upgrades:{cooling:5,power:3,speed:2},auto:{drill:true,cool:true,smart:true},records:{19:{stars:3,time:28}},tools:{blast:4,repair:3,coolant:8}};
 const s=normalize(raw);assert.equal(s.schema,7);assert.equal(s.coins,777);assert.equal(s.head,2);assert.equal(s.upgrades.cooling,5);assert.deepEqual(s.records,raw.records);assert.equal(s.toolBudget,0);assert.equal(s.auto.drill,true);assert.deepEqual(normalize(JSON.parse(JSON.stringify(s))),s);
});
test('fresh automatic drill progresses with no input or purchased automation;no heat',()=>{const s=normalize(),r=newRun(s);assert.equal(r.auto,true);assert.equal('heat'in r,false);advance(s,r,16);assert.ok(r.depth>0);assert.equal(s.auto.drill,false);});
test('all pilot preferences retain mission collection and active seal authority',()=>{for(const policy of ['mission','safe','value']){const s=normalize({policy,unlocked:30}),r=newRun(s,1);const row=seams(r.stage,0);assert.equal(row[planLane(s,r)],'C');const seal=newRun(s,4);seal.row=seal.stage.layers-1;assert.equal(planLane(s,seal),sealState(seal).lane);}});
test('pause freezes both automatic mining and cooldowns;return settlement pays once',()=>{const s=normalize(),r=newRun(s);advance(s,r,2);r.paused=true;const old=JSON.stringify(r);advance(s,r,5);assert.equal(JSON.stringify(r),old);r.paused=false;settle(s,r,'return');const coins=s.coins;assert.equal(settle(s,r,'return'),false);assert.equal(s.coins,coins);});
test('normal purchases reject insufficient funds and prototype keys atomically',()=>{const s=normalize(),raw=JSON.stringify(s);assert.equal(buy(s,'upgrade','power'),false);for(const k of ['__proto__','constructor','toString'])assert.equal(buy(s,'upgrade',k),false);assert.equal(JSON.stringify(s),raw);s.coins=500;assert.equal(buy(s,'upgrade','power'),true);assert.equal(s.coins,420);assert.equal(upgradeCost(s,'power'),124);});
function firstCellSeconds(raw){const s=normalize(raw),r=newRun(s);for(let t=0;t<20;t+=1/60){tick(s,r,1/60,false);if(r.row>0)return t+1/60;}return 20;}
test('power,speed,servo and old navigation investments measurably accelerate same automatic target',()=>{const base=firstCellSeconds({});for(const raw of [{upgrades:{power:2}},{upgrades:{speed:3}},{auto:{drill:true}},{auto:{smart:true}},{upgrades:{autoPower:2,autoSpeed:2}}])assert.ok(firstCellSeconds(raw)<base,JSON.stringify(raw));assert.ok(firstCellSeconds({upgrades:{power:2}})<base*.75);});
test('late rock durability requires more growth than starter region',()=>{const s=normalize(),a=newRun(s,0),b=newRun(s,29);a.row=1;b.row=1;a.lane=0;b.lane=0;assert.ok(cellState(b).max>cellState(a).max*3);});
test('full cargo banks once and continues a long stage;capacity and old instant conveyor remain useful',()=>{const s=normalize(),r=newRun(s);advance(s,r,600);assert.equal(r.ended,false);assert.ok(r.banked>0);assert.ok(r.time>=59);const bank=s.coins;settle(s,r,'return');assert.equal(r.finalEarned,s.coins);const final=s.coins;assert.equal(settle(s,r,'return'),false);assert.equal(s.coins,final);assert.ok(final>=bank);const q=newRun(normalize({auto:{sell:true}}));assert.equal(q.docking,0);assert.ok(capacity(normalize({upgrades:{cargo:1}}))>capacity(normalize()));});
test('manual selection is retained through rows,resources and pressure with all old navigation policies',()=>{for(const policy of ['safe','mission','value']){const s=normalize({policy,auto:{smart:true}}),r=newRun(s,1);selectRoute(r,0);advance(s,r,40);assert.equal(r.lane,0);selectRoute(r,4);advance(s,r,40);assert.equal(r.lane,4);}});
test('each fixed route can collect each ordinary stage objective without automatic steering',()=>{for(const stage of STAGES.filter(x=>!x.checkpoint)){for(let lane=0;lane<5;lane++){const s=normalize({unlocked:30,heads:[0,3],head:3,crew:['moss'],activeCrew:'moss',upgrades:{power:6,speed:3,cargo:2,autoPower:2,autoSpeed:2}}),r=newRun(s,stage.id-1);selectRoute(r,lane);advance(s,r,10800);if(stage.goal==='safe'&&lane!==2)continue;assert.equal(r.clear,true,`stage${stage.id} lane${lane} ${r.reason} ${JSON.stringify(r.stats)}`);}}});

test('auto tools defaultOFF preserve full inventory despite eligible rock and low hull',()=>{const s=normalize({unlocked:30,tools:{beam:5,blast:5,repair:5,coolant:5}}),r=newRun(s,25);r.hull=30;const old={...s.tools};advance(s,r,3);assert.deepEqual(s.tools,old);assert.equal(r.toolsUsed,0);});
test('explicit per-trip stock budget,cooldown,unlock and no auto-buy are authoritative',()=>{const s=normalize({unlocked:30,toolBudget:1,tools:{beam:2,blast:2,repair:2,coolant:2}}),r=newRun(s,25);r.hull=30;const money=s.coins;assert.equal(automaticTool(s,r,cellState(r)),true);assert.equal(r.hull,70);assert.equal(s.tools.repair,1);r.toolCooldown=0;r.hull=20;assert.equal(automaticTool(s,r,cellState(r)),false);assert.equal(s.coins,money);assert.equal(r.toolsUsed,1);s.toolBudget=5;assert.equal(r.toolAllowance,1);const q=newRun(s,25);q.hull=30;automaticTool(s,q,cellState(q));q.hull=30;q.toolCooldown=0;const stock=s.tools.repair;automaticTool(s,q,cellState(q));assert.equal(s.tools.repair,stock);assert.equal(q.hull,30);assert.equal(q.abilityCooldowns.repair,10);});
test('stock targeting only consumes after real effects and cannot bypass seal/row/goal',()=>{const s=normalize({unlocked:30,toolBudget:5,tools:{beam:3,blast:3}}),r=newRun(s);assert.equal(useTool(s,r,'beam',{row:5,lane:0}),false);assert.equal(useTool(s,r,'beam',{row:0,lane:5}),false);assert.equal(s.tools.beam,3);assert.equal(useTool(s,r,'beam',{row:4,lane:4}),true);tick(s,r,.01);assert.equal(r.row,0);assert.equal(r.mined,1);r.toolCooldown=0;assert.equal(useTool(s,r,'beam',{row:4,lane:4}),false);const seal=newRun(s,4);seal.row=seal.stage.layers-1;assert.equal(automaticTool(s,seal,cellState(seal)),false);assert.equal(useTool(s,seal,'blast'),false);assert.equal(seal.seal.phase,0);});
test('all seals reject wrong route and temporal counterplay still applies',()=>{for(let arc=0;arc<6;arc++){const s=normalize(),r=newRun(s,arc*5+4);r.row=r.stage.layers-1;const state=sealState(r);r.lane=(state.lane+1)%5;assert.equal(sealContact(s,r),false);assert.equal(r.seal.phase,0);}const s=normalize(),r=newRun(s,9);r.row=r.stage.layers-1;r.lane=sealState(r).lane;sealContact(s,r);assert.equal(r.seal.needsRelease,true);r.lane=sealState(r).lane;sealContact(s,r);assert.equal(r.seal.phase,1);});
test('manual weakpoint alignment plus automatic timing completes six seals,without stock',()=>{for(let arc=0;arc<6;arc++){const s=normalize({unlocked:30,upgrades:{power:4,speed:3,cooling:2}}),r=newRun(s,arc*5+4);r.row=r.stage.layers-1;r.depth=r.stage.target-5;advance(s,r,900,false,true);assert.equal(r.seal.phase,3,`arc${arc} ${JSON.stringify(r.seal)}`);assert.equal(r.clear,true);assert.equal(r.toolsUsed,0);}});
test('fresh earned-growth shortened thicker-rock campaign reaches30 without free money or row skips',()=>{
 const s=normalize(),rows=[];let trips=0;
 function purchaseEarned(){for(const [key,level]of [['cargo',4],['power',7],['speed',5],['cooling',4],['autoPower',4],['autoSpeed',4],['helperPower',5]])while(s.upgrades[key]<level&&s.coins>=upgradeCost(s,key)){if(!buy(s,'upgrade',key))break;}
  for(const h of [1,2,3])if(!s.heads.includes(h))buy(s,'head',h);for(const k of ['drill','cool','sell','smart'])buy(s,'auto',k);
  while(s.helpers<3&&buy(s,'helper','miner')){}if(!s.crew.includes('moss'))buy(s,'crew','moss');
 }
 for(const stage of STAGES){let cleared=false;
  for(let attempt=0;attempt<12&&!cleared;attempt++){purchaseEarned();const r=newRun(s,stage.id-1);let lastRow=r.row;
   for(let frame=0;frame<10800*60&&!r.ended;frame++){
    const seal=sealState(r);if(seal)selectRoute(r,seal.lane);
    tick(s,r,1/60,false);assert.ok(r.row-lastRow>=0&&r.row-lastRow<=1);lastRow=r.row;
    if(frame%120===0)purchaseEarned();if(r.events.length>512)r.events.length=0;
   }
   assert.equal(r.ended,true,'bounded campaign unit stalled at '+stage.id);cleared=r.clear;trips++;
   if(cleared)rows.push({stage:stage.id,meters:r.depth,layers:r.row,seconds:Math.round(r.time),coins:s.coins,trips,cache:Object.keys(r.tiles).length});
  }
  assert.equal(cleared,true,'stage '+stage.id+' not reachable with earned growth');
 }
 assert.equal(s.cleared.length,30);assert.equal(s.relics.length,6);assert.equal(s.ending,true);assert.ok(s.best<=3000);
 console.log(JSON.stringify({campaign:'MODEL_ONLY',rows,seals:s.relics.length,trips,coins:s.coins}));
});

test('natural pressure venting and safe service return retain fair risk consequences',()=>{const s=normalize(),r=newRun(s,21);r.pressure=75;advance(s,r,2);assert.ok(r.pressure<75);assert.ok(r.stats.vent>0);r.hull=19;r.value=100;cellState(r).hp=1;advance(s,r,2);assert.equal(r.reason,'service');assert.ok(r.banked>=100);});
test('achievement/relic rewards and reload migration never pay twice',()=>{const s=normalize(),r=newRun(s);settle(s,r,'return');assert.equal(claimAchievement(s,'first'),true);const n=s.coins;assert.equal(claimAchievement(s,'first'),false);assert.equal(normalize(s).coins,n);const q=newRun(s,29);q.seal.phase=3;q.row=q.stage.layers;q.depth=q.stage.target;settle(s,q,'complete');const cores=s.materials.core;settle(s,q,'complete');assert.equal(s.materials.core,cores);assert.deepEqual(normalize(s),s);});

test('length is real layers and later segment exposure;old records survive separately and first clears never repeat',()=>{
 assert.ok(STAGES[0].layers>=64);assert.ok(STAGES[29].layers>=176);
 for(const stage of STAGES)assert.equal(stage.target,stage.layers*5);
 const s=normalize({coins:51,cleared:[1],records:{1:{stars:3,time:20}}}),r=newRun(s);advance(s,r,10800);assert.equal(r.clear,true);assert.deepEqual(s.records[1],{stars:3,time:20});assert.ok(s.recordsV12[1].time>20);assert.equal(s.cleared.filter(x=>x===1).length,1);assert.deepEqual(normalize(JSON.parse(JSON.stringify(s))),s);
});
test('late stage with a normal earned-growth loadout lasts longer than a brief turn',()=>{const s=normalize({unlocked:30,heads:[0,3],head:3,upgrades:{power:6,speed:3,cargo:4,autoPower:2,autoSpeed:2}}),r=newRun(s,29);advance(s,r,10800,false,true);assert.equal(r.clear,true);assert.ok(r.time>45);console.log(JSON.stringify({lateStageSeconds:r.time,layers:r.stage.layers,earned:r.finalEarned}));});

test('every actual distance and row count is exactly v11 divided by10, with no old-endpoint clear',()=>{
 const old=[320,360,400,440,480,400,440,480,520,560,480,520,560,600,640,560,600,640,680,720,640,680,720,760,800,720,760,800,840,960];
 assert.equal(STAGES.reduce((n,s)=>n+s.target,0),90400);
 STAGES.forEach((stage,i)=>{assert.equal(stage.target,old[i]*5);assert.equal(stage.layers,old[i]);assert.equal(stage.target,stage.layers*5);
  const s=normalize({unlocked:30}),r=newRun(s,i);r.row=stage.sectionLayers;r.depth=old[i];if(r.seal)r.seal.phase=3;
  assert.equal(settle(s,r,'complete'),true);assert.equal(r.clear,false,'old endpoint cannot clear');assert.equal(s.cleared.length,0);
 });
});
test('genuine section journal survives reload without replaying banked coins, materials or vents',()=>{
 const s=normalize(),r=newRun(s);advance(s,r,1200);
 assert.ok(s.journeys[1]?.row>=64);const before=JSON.parse(JSON.stringify(s)),resumedSave=normalize(before),q=newRun(resumedSave);
 assert.equal(q.row,before.journeys[1].row);assert.equal(q.depth,q.row*5);assert.equal(q.value,0);assert.equal(q.cargo,0);assert.equal(q.banked,0);
 const vents=resumedSave.total.vents,coins=resumedSave.coins,mats={...resumedSave.materials};settle(resumedSave,q,'return');
 assert.equal(resumedSave.coins,coins);assert.deepEqual(resumedSave.materials,mats);assert.equal(resumedSave.total.vents,vents);
 assert.equal(settle(resumedSave,q,'return'),false);assert.deepEqual(normalize(resumedSave),resumedSave);
});
test('journal rejects endpoint, nonboundary and poisoned safe-objective progress; old records are preserved',()=>{
 const s=normalize({schema:5,coins:91,best:1800,recordsV5:{1:{stars:3,time:20}},journeys:{1:{version:10,stageId:1,row:3200},2:{version:10,stageId:2,row:1}}});
 assert.deepEqual(s.journeys,{});assert.equal(s.coins,91);assert.equal(s.best,1800);assert.deepEqual(s.recordsV5,{1:{stars:3,time:20}});
 assert.deepEqual(normalize(s),s);
});
test('visible2past and legal4future tiles stay bounded through a real long expedition',()=>{
 const s=normalize({heads:[0,3],head:3,upgrades:{power:7,speed:5,autoPower:4,autoSpeed:4}}),r=newRun(s);let peak=0;
 for(let i=0;i<120000&&!r.ended;i++){for(let row=Math.max(0,r.row-2);row<=Math.min(r.stage.layers-1,r.row+4);row++)for(let lane=0;lane<5;lane++)cellState(r,row,lane);
  tick(s,r,1/60,false);peak=Math.max(peak,Object.keys(r.tiles).length);if(r.events.length>512)r.events.length=0;}
 assert.ok(r.depth>320);assert.ok(peak<=35);console.log(JSON.stringify({longCache:peak,depth:r.depth,seconds:r.time}));
});

test('mid-section event claim is atomic with inventory across repeated reload, return and retry',()=>{
 for(const id of [3,17]){
  const save=normalize({unlocked:id,heads:[0,3],head:3,upgrades:{power:7,speed:5,autoPower:4,autoSpeed:4}}),stage=STAGES[id-1],eventRow=Math.floor((id===3?7:9)/20*stage.layers),r=newRun(save,id-1);
  while(r.row<eventRow){tick(save,r,1/60,false);if(r.events.length>512)r.events.length=0;}
  assert.ok(save.journeys[id].row<eventRow);assert.equal(save.tools.coolant,3);assert.ok(save.eventClaims.includes(id+':cache'));
  let persisted=normalize(JSON.parse(JSON.stringify(save)));
  for(let repeat=0;repeat<4;repeat++){
   const q=newRun(persisted,id-1);assert.ok(q.row<eventRow);const before=persisted.tools.coolant;
   while(q.row<eventRow){tick(persisted,q,1/60,false);if(q.events.length>512)q.events.length=0;}
   assert.equal(persisted.tools.coolant,before,'cache may not pay again after a mid-section reload');
   if(repeat%2)settle(persisted,q,'return');
   persisted=normalize(JSON.parse(JSON.stringify(persisted)));assert.equal(persisted.tools.coolant,3);
  }
 }
});

test('tool use before or after a checkpoint remains in whole-expedition star eligibility after reload',()=>{
 for(const afterCheckpoint of [false,true]){
  let save=normalize({heads:[0,3],head:3,upgrades:{power:7,speed:5,autoPower:4,autoSpeed:4},recordsV5:{1:{stars:3,time:20}},tools:{beam:3,coolant:2,repair:0,blast:0}}),run=newRun(save);
  if(!afterCheckpoint){assert.equal(useTool(save,run,'beam'),true);tick(save,run,1/60,false);}
  while(!save.journeys[1]){tick(save,run,1/60,false);if(run.events.length>512)run.events.length=0;}
  if(afterCheckpoint)assert.equal(useTool(save,run,'beam'),true);
  const old={...save.recordsV5[1]};save=normalize(JSON.parse(JSON.stringify(save)));run=newRun(save);
  assert.equal(run.journeyToolsUsed,1);assert.equal(run.toolsUsed,0,'new departure has its own stock allowance');
  for(let i=0;i<200000&&!run.ended;i++){tick(save,run,1/60,false);if(run.events.length>512)run.events.length=0;}
  assert.equal(run.clear,true);assert.equal(save.recordsV12[1].stars,2,'reload cannot grant no-tools star');assert.deepEqual(save.recordsV5[1],old);
 }
});
