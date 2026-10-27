/* Disabled implementation candidate: incomplete art, localization, bosses, UI and save integration. */
(() => {
'use strict';
// Design-only data; disabled candidate never changes reward or save.
// Wave tokens describe proposed actor roles, not existing implemented actors.
const ACTORS=Object.freeze(['wolf','boar','hyena','cobra','warden','medic','drummer','sapper']);
const BOSSES=Object.freeze({
 'stone-bastion':{name:'石門守將',rule:'Begins with one warden and one wolf; no reinforcements. The warden links the wolf.',cue:'A visible tether and named protected escort precede the link.',counter:'Focus the warden, or spend Break for a short opening.'},
 'red-lantern':{name:'紅燈軍醫',rule:'Calls a medic after eight seconds and at most one replacement ten seconds after its defeat.',cue:'Lantern and healing target appear before a 3.5-second channel.',counter:'Focus the medic or interrupt the channel with Break.'},
 'thunder-signal':{name:'雷鼓斥候',rule:'Begins with one drummer; every twelve seconds charges a 1.25× strike at the highest-attack living hero.',cue:'Target indicator and a 3.5-second charge identify the threatened hero.',counter:'Guard the marked hero or interrupt the strike with Break.'},
 'twin-seal':{name:'雙印守帥',rule:'Begins with a warden and medic, without replacement; warden links the medic.',cue:'Tether and healing indicator independently identify both actions.',counter:'Choose which threat to break first, then focus the exposed unit.'},
 'crossroads':{name:'岔道伏將',rule:'Every eight seconds alternates sapper and drummer channels; one threatens a hero and one the boss.',cue:'Distinct target markers appear before each 3.5-second channel.',counter:'Compare the marked hero and enemy, then Guard or Break the urgent threat.'},
 'oathmaster':{name:'盟誓軍師',rule:'At start, 70% and 35% HP, announces one warden, medic or sapper add respectively; wait for the current add to fall before the next phase.',cue:'Phase text and a target marker precede each new pattern.',counter:'Choose targets and reserve orders for the phase that threatens the squad.'}
});
// Each row is independently authored: Stage, four ordinary waves, decision,
// rule emphasis, intended pressure and distinction from its preceding stage.
const rows=[
 [31,'warden wolf|warden wolf|warden boar|warden wolf hyena','Focus the linking warden before its protected wolf.','ward','Introduce a single visible tether.','First ward lesson; two-unit groups.'],
 [32,'warden boar|warden wolf|warden boar wolf|warden boar hyena','Decide whether to interrupt the warden or contain its faster boar.','ward','Introduce cavalry pressure behind the link.','The protected attacker changes from wolf to boar.'],
 [33,'warden hyena|warden wolf hyena|warden boar|warden hyena cobra','Focus the back-line archer or break the front link first.','ward','Reveal a ranged threat behind the tether.','A ranged priority competes with the warden.'],
 [34,'warden cobra|warden boar cobra|warden wolf hyena|warden cobra wolf','Stop cobra weakening or break the protective link.','ward','Combine a visible link with the existing weakening caster.','The protected caster changes skill timing.'],
 [35,'warden wolf|warden boar|warden hyena|warden cobra','Reserve an order for the linked checkpoint escort.','ward','Test target selection across all basic roles.','Stone Bastion adds a named linked checkpoint.'],
 [36,'medic wolf|medic wolf boar|medic hyena|medic boar wolf','Focus the medic before its first healing channel.','heal','Introduce one clearly cued healer.','First healing threat; no warden link.'],
 [37,'medic boar|medic boar wolf|medic hyena|medic boar cobra','Compare a charging boar with the channeling medic.','heal','Introduce pressure on a fragile hero.','A cavalry threat competes with healer priority.'],
 [38,'medic hyena|medic hyena wolf|medic boar|medic hyena cobra','Choose the ranged attacker or interrupt the healer.','heal','Expose a ranged back-line decision.','Archer pressure replaces the cavalry-first setup.'],
 [39,'medic cobra|medic cobra wolf|medic hyena|medic cobra boar','Choose between the healer and the weakening caster.','heal','Combine two different timed status threats.','Cobra changes the consequence of delayed focus.'],
 [40,'medic wolf|medic boar|medic hyena|medic cobra','Save Break for a called medic or win by focusing it.','heal','Test healer recognition with limited orders.','Red Lantern introduces a clearly capped medic summon.'],
 [41,'sapper wolf|sapper wolf boar|sapper hyena|sapper wolf cobra','Guard the marked hero or interrupt the sapper.','ambush','Teach the marked-hero warning without a healer.','First threat aimed at a specific deployed hero.'],
 [42,'sapper boar|sapper boar wolf|sapper hyena|sapper boar cobra','Choose between a threatened hero and a fast boar.','ambush','Add cavalry pressure during the warning.','The marked hero now faces a competing fast attacker.'],
 [43,'sapper hyena|sapper hyena wolf|sapper boar|sapper hyena cobra','Protect the marked hero or remove the ranged attacker.','ambush','Train the same cue under ranged pressure.','Ranged priority replaces the cavalry pressure.'],
 [44,'drummer wolf|drummer wolf boar|drummer hyena|drummer wolf cobra','Interrupt the drummer before its marked ally attacks.','tempo','Introduce enemy preparation rather than hero marking.','The threat marker moves from a hero to an enemy.'],
 [45,'drummer boar|sapper wolf|drummer hyena|sapper cobra','Reserve Guard or Break for the announced checkpoint strike.','ambush tempo','Test both mark types in separate waves.','Thunder Signal alternates marked-hero and enemy preparation.'],
 [46,'warden medic wolf|warden wolf medic|medic boar warden|warden medic hyena','Remove the link or the healer first.','ward heal','Introduce both earlier threats together.','First combined linked and healing encounter.'],
 [47,'medic warden boar|medic boar warden|warden medic hyena|medic cobra warden','Interrupt the healer while cavalry pressures the squad.','heal ward','Keep the healer visible beside a linked boar.','The first threat is a heal rather than a link.'],
 [48,'warden hyena medic|warden hyena medic|medic warden cobra|warden hyena boar','Prioritize the ranged attacker after opening its link.','ward heal','Test ranged pressure behind linked healing.','The exposed ranged target changes focus order.'],
 [49,'medic warden cobra|medic cobra warden|warden hyena medic|medic warden boar','Stop weakening or healing before breaking the link.','heal ward','Use status pressure to contest the order budget.','Cobra changes which channel is urgent.'],
 [50,'warden medic wolf|medic warden boar|warden medic hyena|medic warden cobra','Choose the link or healing channel at the checkpoint.','ward heal','Test limited-order allocation over four waves.','Twin Seal combines link and healing on a named boss.'],
 [51,'sapper medic wolf|medic sapper boar|sapper medic hyena|medic sapper cobra','Guard the marked hero or interrupt the healer.','ambush heal','Combine player-side danger with healing.','First heal versus marked-hero tradeoff.'],
 [52,'medic drummer wolf|drummer medic boar|medic drummer hyena|drummer medic cobra','Interrupt enemy preparation or the healer.','tempo heal','Distinguish an enemy mark from a healing channel.','Enemy-target preparation replaces the sapper mark.'],
 [53,'warden sapper wolf|sapper warden boar|warden sapper hyena|sapper warden cobra','Open a link or protect the marked hero.','ward ambush','Combine a link with hero-directed pressure.','A link replaces the previous healer threat.'],
 [54,'drummer warden wolf|warden drummer boar|drummer warden hyena|warden drummer cobra','Break the link or the empowered enemy before its attack.','tempo ward','Test two enemy-side indicators together.','The urgent cue is on an enemy rather than a hero.'],
 [55,'sapper drummer wolf|drummer sapper boar|sapper drummer hyena|drummer sapper cobra','Compare the two marked targets and spend an order only if needed.','ambush tempo','Test alternating telegraphed threats.','Crossroads checkpoint alternates both distinct target types.'],
 [56,'warden medic wolf|sapper drummer boar|medic warden hyena|drummer sapper cobra','Plan order spending across different wave types.','ward heal ambush tempo','Mix earlier lessons without simultaneous overload.','Alternates paired threats instead of one repeated pair.'],
 [57,'medic sapper boar|warden drummer wolf|sapper medic hyena|drummer warden cobra','Choose hero protection before returning to a linked target.','heal ambush ward tempo','Reverse the earlier mixed-wave priority.','The first wave starts with a marked hero and healer.'],
 [58,'drummer warden hyena|medic sapper wolf|warden drummer cobra|sapper medic boar','Interrupt the ranged ally preparation before the next heal.','tempo ward heal ambush','Combine range and two visible signals.','Enemy-side preparation leads the opening wave.'],
 [59,'sapper medic cobra|warden drummer hyena|medic sapper boar|drummer warden wolf','Choose between weakening, healing and a marked hero.','ambush heal ward tempo','Final mixed practice before the boss.','Cobra pressure changes the opening decision.'],
 [60,'warden medic wolf|sapper drummer boar|medic warden cobra|drummer sapper hyena','Reserve orders across the three announced boss phases.','ward heal ambush tempo','Mastery of all four cues and limited orders.','Oathmaster combines three distinct, announced phases.']
];
const checkpointById={35:'stone-bastion',40:'red-lantern',45:'thunder-signal',50:'twin-seal',55:'crossroads',60:'oathmaster'};
const CHAPTER_TWO=Object.freeze(rows.map(([id,waves,decision,emphasis,intent,difference])=>Object.freeze({id,objective:'Defeat each wave, then its Boss; protect at least one deployed hero.',waves:Object.freeze(waves.split('|').map(w=>Object.freeze(w.split(' ')))),decision,emphasis:Object.freeze(emphasis.split(' ')),intent,difference,tool:'Three Oath Seals per attempt: Break or Guard, one seal each.',boss:checkpointById[id]||'buffalo',reward:'Existing wave loot and Stage XP; checkpoint result identifies its encounter; Next unlocks the next current Stage.'})));
function chapterTwoDesign(stage){return Number.isInteger(stage)&&stage>=31&&stage<=60?CHAPTER_TWO[stage-31]:null;}
// TEST-ONLY connection experiment. It does not implement special behaviors,
// artwork, locale copy, orders, save/reward changes, or a player entry point.
const visuals=Object.freeze({warden:'boar',medic:'cobra',drummer:'wolf',sapper:'hyena'});
function chapterTwoActor(role,C,makeUnit,index,extra={}){
 const visual=visuals[role]||role,base=C?.enemies?.find(x=>x.id===visual);if(!base||typeof makeUnit!=='function')throw Error(`MISSING_EXISTING_VISUAL:${visual}`);
 const data=visuals[role]?{...base,id:role,visualId:['warden','medic','drummer','sapper'].includes(role)?role:visual,name:role,chapterRole:role,...extra}:base;return makeUnit(data,'enemy',index);
}
function chapterTwoWave(stage,wave,C,makeUnit){
 const plan=chapterTwoDesign(stage);if(!plan)return null;
 if(!C||!Array.isArray(C.enemies)||typeof makeUnit!=='function'||!Number.isInteger(wave)||wave<1||wave>5)throw TypeError('INVALID_WAVE_ADAPTER_INPUT');
 const byId=id=>{const unit=C.enemies.find(x=>x.id===id);if(!unit)throw Error(`MISSING_EXISTING_VISUAL:${id}`);return unit};
 if(wave===5){const original=byId('buffalo');const data=plan.boss==='buffalo'?original:{...original,id:plan.boss,visualId:plan.boss==='stone-bastion'?'stone-bastion':'buffalo',name:plan.boss,boss:true};return [makeUnit(data,'enemy',0)];}
 return plan.waves[wave-1].map((role,index)=>chapterTwoActor(role,C,makeUnit,index));
}
// Isolated Chapter 2 combat experiment. No gameplay entry imports this module.
// The caller owns turn scheduling and must pass only active-combat elapsed time.
function createSignalCombat(stage,heroes,enemies,spawnEnemy=null){
 if(!Number.isInteger(stage)||stage<31||stage>60)return null;
 if(!Array.isArray(heroes)||!Array.isArray(enemies))throw TypeError('INVALID_COMBAT_UNITS');
 let seals=3,time=0,units=heroes,foes=enemies,active=true,bossState=null,eventSeq=0;const channels=new Map(),links=new Map(),boosts=new Map(),guards=new Map(),events=[];
 const living=u=>u&&u.hp>0,role=u=>u?.data?.chapterRole;
 const event=(type,actor,target)=>{events.push({seq:++eventSeq,type,actor:actor?.key||null,target:target?.key||null,time});if(events.length>256)events.shift();};
 function add(roleName,extra={}){if(typeof spawnEnemy!=='function')throw TypeError('BOSS_SPAWN_ADAPTER_REQUIRED');const unit=spawnEnemy(roleName,foes.length,extra);if(!unit||!unit.key||foes.some(u=>u.key===unit.key))throw TypeError('INVALID_BOSS_SPAWN');foes.push(unit);if(['medic','drummer','sapper'].includes(role(unit)))channels.set(unit.key,{wait:2,target:null,remaining:0});event('spawn',unit,null);return unit;}
 function initialize(){
  channels.clear();links.clear();boosts.clear();guards.clear();bossState=null;for(const unit of foes)if(['medic','drummer','sapper'].includes(role(unit)))channels.set(unit.key,{wait:2,target:null,remaining:0});
  const boss=foes.find(u=>living(u)&&u.data?.boss&&['stone-bastion','red-lantern','thunder-signal','twin-seal','crossroads','oathmaster'].includes(u.id));if(!boss)return;
  bossState={boss,wait:boss.id==='thunder-signal'?12:boss.id==='crossroads'?8:boss.id==='red-lantern'?8:0,channel:null,alternate:0,spawned:0,medic:null,phase:0,add:null};
  if(boss.id==='stone-bastion'){add('warden',{wardPreferred:'wolf'});add('wolf');}
  if(boss.id==='thunder-signal')add('drummer');
  if(boss.id==='twin-seal'){add('warden',{wardPreferred:'medic'});add('medic');}
  if(boss.id==='oathmaster'){bossState.add=add('warden',{wardPreferred:boss.id});event('boss-phase',boss,bossState.add);}
 }
 function targetFor(actor){if(role(actor)==='sapper')return units.filter(living).reduce((best,u)=>!best||u.atk>best.atk?u:best,null);if(role(actor)==='drummer')return foes.find(u=>living(u)&&u!==actor)||null;return foes.filter(living).reduce((best,u)=>!best||u.hp/u.maxHp<best.hp/best.maxHp?u:best,null);}
 function wardTarget(warden){return foes.find(u=>living(u)&&u!==warden&&u.id===warden.data.wardPreferred)||foes.find(u=>living(u)&&u!==warden)||null;}
 function wardens(){return foes.filter(u=>living(u)&&role(u)==='warden');}
 function guardedBy(target){return wardens().find(w=>time>=(links.get(w.key)||0)&&wardTarget(w)===target)||null;}
 function hit(target,amount){
  if(!living(target)||!Number.isFinite(amount)||amount<0)return null;let actual=target;
  if(foes.includes(target))actual=guardedBy(target)||target;
  let absorbed=0;const guard=guards.get(actual.key);
  if(guard&&time<guard.expires){absorbed=Math.min(amount,guard.amount);guards.delete(actual.key);event('guard-used',actual,actual);}
  const applied=Math.min(actual.hp,Math.max(0,Math.round(amount-absorbed)));actual.hp-=applied;event(actual===target?'hit':'redirected-hit',actual,target);return {target:actual.key,applied,absorbed};
 }
 function tick(seconds){
  if(!Number.isFinite(seconds)||seconds<0||seconds>.26)throw TypeError('INVALID_ACTIVE_STEP');if(!active)return;time+=seconds;
  for(const actor of foes){if(!living(actor)||!channels.has(actor.key))continue;const c=channels.get(actor.key);
   if(c.target&&!living(c.target)){c.target=null;c.remaining=0;c.wait=4;event('channel-cancelled',actor,null);continue;}
   if(c.target){c.remaining-=seconds;if(c.remaining>0)continue;const target=c.target;c.target=null;c.wait=8;
    if(role(actor)==='medic'){target.hp=Math.min(target.maxHp,target.hp+Math.round(target.maxHp*.15));event('healed',actor,target);}
    else if(role(actor)==='drummer'){boosts.set(target.key,1.25);event('prepared',actor,target);}
    else {hit(target,Math.round(actor.atk));event('sapper-strike',actor,target);}
   }else{c.wait-=seconds;if(c.wait>0)continue;c.target=targetFor(actor);if(c.target){c.remaining=3.5;event('channel-start',actor,c.target);}else c.wait=4;}
  }
  const b=bossState;if(!b||!living(b.boss))return;const boss=b.boss;
  if(boss.id==='red-lantern'&&b.spawned<2){if(b.medic&&!living(b.medic)){b.medic=null;b.wait=10;}if(!b.medic){b.wait-=seconds;if(b.wait<=0){b.medic=add('medic');b.spawned++;}}}
  if(boss.id==='oathmaster'&&(!b.add||!living(b.add))){if(b.phase===0&&boss.hp/boss.maxHp<=.7){b.phase=1;b.add=add('medic');event('boss-phase',boss,b.add);}else if(b.phase===1&&boss.hp/boss.maxHp<=.35){b.phase=2;b.add=add('sapper');event('boss-phase',boss,b.add);}}
  if(boss.id==='thunder-signal'||boss.id==='crossroads'){
   if(b.channel&&!living(b.channel.target)){b.channel=null;b.wait=boss.id==='thunder-signal'?12:8;event('boss-cancelled',boss,null);}
   if(b.channel){b.channel.remaining-=seconds;if(b.channel.remaining<=0){const {kind,target}=b.channel;b.channel=null;b.wait=boss.id==='thunder-signal'?12:8;if(kind==='sapper'){hit(target,Math.round(boss.atk*(boss.id==='thunder-signal'?1.25:1)));event('boss-strike',boss,target);}else{boosts.set(target.key,1.25);event('boss-prepared',boss,target);}}}
   else{b.wait-=seconds;if(b.wait<=0){const kind=boss.id==='thunder-signal'?'sapper':b.alternate++%2===0?'sapper':'drummer',target=kind==='sapper'?units.filter(living).reduce((best,u)=>!best||u.atk>best.atk?u:best,null):boss;if(target){b.channel={kind,target,remaining:3.5};event('boss-channel',boss,target);}else b.wait=4;}}
  }
 }
 function order(kind,key){
  if(!active)return {ok:false,reason:'paused'};
  if(seals<=0)return {ok:false,reason:'no-seals'};
  if(kind==='guard'){const target=units.find(u=>u.key===key&&living(u));if(!target)return {ok:false,reason:'invalid-target'};guards.set(key,{amount:Math.round(target.maxHp*.25),expires:time+5});seals--;event('guard',target,target);return {ok:true,seals};}
  if(kind==='break'){const actor=foes.find(u=>u.key===key&&living(u));if(!actor)return {ok:false,reason:'invalid-target'};const c=channels.get(key),ward=role(actor)==='warden'&&wardTarget(actor)&&time>=(links.get(key)||0),bossChannel=bossState?.boss===actor&&bossState.channel;if(!ward&&!c?.target&&!bossChannel)return {ok:false,reason:'not-ready'};
   if(ward)links.set(key,time+4);if(c?.target){c.target=null;c.remaining=0;c.wait=4;}if(bossChannel){bossState.channel=null;bossState.wait=actor.id==='thunder-signal'?12:8;}seals--;event('break',actor,actor);return {ok:true,seals};}
  return {ok:false,reason:'invalid-order'};
 }
 function attack(actor,target,amount){if(!active||!living(actor))return null;const multiplier=boosts.get(actor.key)||1;boosts.delete(actor.key);return hit(target,Math.round(amount*multiplier));}
 function nextWave(nextHeroes,nextEnemies){if(!Array.isArray(nextHeroes)||!Array.isArray(nextEnemies))throw TypeError('INVALID_COMBAT_UNITS');units=nextHeroes;foes=nextEnemies;initialize();}
 initialize();return Object.freeze({tick,order,attack,nextWave,setActive:value=>{active=Boolean(value)},snapshot:()=>({seals,time,active,events:events.map(x=>({...x})),channels:[...channels].map(([key,c])=>({key,wait:c.wait,target:c.target?.key||null,remaining:c.remaining})),wardLinks:wardens().map(w=>({key:w.key,target:wardTarget(w)?.key||null,active:time>=(links.get(w.key)||0)})),bossChannel:bossState?.channel?{key:bossState.boss.key,target:bossState.channel.target.key,kind:bossState.channel.kind,remaining:bossState.channel.remaining}:null})});
}
window.PEACH_OATH_CHAPTER2_CANDIDATE=Object.freeze({ready:false,chapterTwoDesign,chapterTwoActor,chapterTwoWave,createSignalCombat});
})();
