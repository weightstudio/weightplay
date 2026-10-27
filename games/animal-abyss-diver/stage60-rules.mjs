// ISOLATED_CANDIDATE_NOT_IN_GAME. No DOM, storage, rewards or shared runtime.
// Data uses the reviewed 31–60 design; v33's 1–30 routes remain untouched.
import {stages,visibleClue,scanLabel} from './stage60-design-prototype.mjs';

const OUTCOMES=Object.freeze({
 R:{oxygen:-10,salvage:1,safe:true}, C:{oxygen:-16,salvage:2,safe:true},
 O:{oxygen:18,salvage:0,safe:true}, H:{oxygen:-28,salvage:0,safe:false},
 F:{oxygen:-18,salvage:0,safe:false}, A:{oxygen:-10,salvage:1,safe:true}, B:{oxygen:-10,salvage:1,safe:true}
});
const clone=value=>structuredClone(value);
const whole=value=>Number.isSafeInteger(value)&&value>=0;
function definition(id){
 if(!Number.isInteger(id)||id<31||id>60)throw new RangeError('STAGE60_ONLY');
 const stage=stages[id-31];if(!stage||stage.id!==id)throw new Error('INVALID_STAGE_DATA');return stage;
}
function values(stats){
 if(!stats||!['hp','attack','oxygen'].every(k=>whole(stats[k])))throw new TypeError('INVALID_STATS');
 const maxHp=30+stats.hp*8,attack=6+stats.attack*2,maxOxygen=100+stats.oxygen*10;
 if(![maxHp,attack,maxOxygen].every(Number.isSafeInteger))throw new RangeError('STAT_OVERFLOW');
 return {maxHp,attack,maxOxygen};
}
export function getStage(id){return clone(definition(id));}
export function getCatalog(){return stages.map(stage=>getStage(stage.id));}

// Fish profile/action formulas are the v33 generic fish (route 1 tutorial is
// outside this module). Tier is explicit candidate data, not a proven balance.
export function fishProfile(id,zone){
 const stage=definition(id);if(!stage.fish.includes(zone))throw new RangeError('NOT_FISH_ZONE');
 const tier=4+Math.floor((id-31)/10),shark=tier>=5;
 return {tier,kind:shark?'shark':'reef',maxHp:(shark?30:16)+tier*5+zone,
  attack:(shark?6:3)+tier+Math.floor(zone/3),xp:(shark?32:24)+tier*5};
}
function nextPhase(s,stage){
 if(stage.fish.includes(s.zone)){s.phase='fish';const fish=fishProfile(s.stage,s.zone);s.fish={...fish,hp:fish.maxHp};return;}
 if(s.zone===stage.pairs.length&&stage.boss){
  if(s.sequence!==stage.sequence.length){finish(s,'miss','missing-marker-before-guardian');return;}
  s.phase='guardian';s.guardianPhase=0;return;
 }
 s.phase='lane';
}
function afterFish(s,stage){
 s.fish=null;
 if(s.zone===stage.pairs.length&&stage.boss){
  if(s.sequence!==stage.sequence.length){finish(s,'miss','missing-marker-before-guardian');return;}
  s.phase='guardian';s.guardianPhase=0;
 }else s.phase='lane';
}
function finish(s,outcome,reason){
 s.phase='result';s.outcome=outcome;s.reason=reason;s.sonar=false;s.fish=null;
 // Host owns durable save, readback, first-clear identity and shared reward.
 // This is a proposal for the existing v33 in-game coin calculation only.
 s.earnedCoins=outcome==='abandon'?0:outcome==='clear'?s.salvage+2:outcome==='fail'||outcome==='combat'?Math.floor(s.salvage/2):s.salvage;
}
export function start(id,{stats={hp:0,attack:0,oxygen:0}}={}){
 const stage=definition(id),v=values(stats);
 const s={schema:1,stage:id,revision:0,phase:'lane',zone:1,stats:clone(stats),oxygen:v.maxOxygen,playerHp:v.maxHp,
  power:stage.startBattery,anchors:stage.anchor.charges,anchored:false,sonar:false,shield:false,salvage:0,sequence:0,
  patrolLane:stage.patrol?.initial??null,guardianPhase:null,fish:null,outcome:null,reason:null,earnedCoins:null,resumeAfterFish:null};
 nextPhase(s,stage);return s;
}

function physical(stage,s){
 const pair=stage.pairs[s.zone-1],reversed=stage.flows.includes(s.zone)&&!s.anchored;
 return {pair:reversed?[pair[1],pair[0]]:pair,open:reversed?['right']:['left','right'],reversed};
}
// Public view contains semantic clue/label keys for a future locale owner. It
// never returns unscanned outcome IDs except the explicit proposed A/B cue.
export function view(state){
 const stage=definition(state.stage),s=state;
 const base={stage:s.stage,revision:s.revision,phase:s.phase,zone:s.zone,zones:stage.pairs.length,
  oxygen:s.oxygen,playerHp:s.playerHp,power:s.power,anchors:s.anchors,salvage:s.salvage,target:stage.target,
  sequence:s.sequence,sequenceTotal:stage.sequence.length,shield:s.shield,sonar:s.sonar,outcome:s.outcome,reason:s.reason,earnedCoins:s.earnedCoins};
 if(s.phase==='lane'){
  const p=physical(stage,s);base.jammed=stage.jammed.includes(s.zone);base.openLanes=p.open;
  base.lanes=p.pair.map((symbol,index)=>({lane:index?'right':'left',clue:visibleClue(symbol),
   scanned:s.sonar?scanLabel(symbol):null}));
  base.patrol=stage.patrol?.zones.includes(s.zone)?{lane:s.patrolLane,damage:stage.patrol.damage}:null;
 }
 if(s.phase==='fish')base.fish=clone(s.fish);
 if(s.phase==='guardian')base.guardian={name:stage.boss.name,phase:s.guardianPhase,
  actions:stage.boss.phases[s.guardianPhase].map(option=>clone(option))};
 return base;
}

// Each action carries the current revision. Stale/repeated input and invalid
// actions return the original immutable state and no event. The host must also
// cancel animations/timers on navigation; a pure revision is not UI locking.
export function act(state,action){
 if(!state||!action||!Number.isSafeInteger(state.revision))throw new TypeError('STATE_AND_ACTION_REQUIRED');
 const stage=definition(state.stage),reject=reason=>({status:'rejected',reason,state,events:[]});
 if(action.revision!==state.revision)return reject('stale-revision');
 if(state.phase==='result')return reject('finished');
 const s=clone(state),events=[];
 if(action.type==='leave'){
  finish(s,'abandon','left-dive');events.push({type:'result',outcome:'abandon'});
 }else if(s.phase==='lane'&&action.type==='scan'){
  if(stage.jammed.includes(s.zone))return reject('sonar-jammed');
  if(s.sonar)return reject('already-scanned');
  if(s.power<2)return reject('insufficient-power');
  s.power-=2;s.sonar=true;events.push({type:'scan',cost:2});
 }else if(s.phase==='lane'&&action.type==='anchor'){
  if(!stage.flows.includes(s.zone)||s.anchored)return reject('anchor-unavailable');
  if(s.power<1||s.anchors<1)return reject('anchor-empty');
  s.power--;s.anchors--;s.anchored=true;events.push({type:'anchor',cost:1});
 }else if(s.phase==='lane'&&action.type==='shield'){
  if(s.shield)return reject('shield-already-armed');if(s.power<1)return reject('insufficient-power');
  s.power--;s.shield=true;events.push({type:'shield',cost:1});
 }else if(s.phase==='lane'&&action.type==='surface'){
  finish(s,'surface','partial-surface');events.push({type:'result',outcome:'surface'});
 }else if(s.phase==='lane'&&action.type==='move'){
  if(!['left','right'].includes(action.lane))return reject('invalid-lane');
  const p=physical(stage,s);if(!p.open.includes(action.lane))return reject('lane-closed');
  const symbol=p.pair[action.lane==='left'?0:1],o=OUTCOMES[symbol];
  if((symbol==='A'||symbol==='B')&&stage.sequence[s.sequence]!==symbol)return reject('marker-order');
  if(symbol==='A'||symbol==='B')s.sequence++;
  let delta=o.oxygen,shielded=false;if(!o.safe&&s.shield){delta=Math.ceil(delta/2);s.shield=false;shielded=true;}
  const v=values(s.stats);s.oxygen=Math.max(0,Math.min(v.maxOxygen,s.oxygen+delta));
  const lost=!o.safe?Math.min(s.salvage,stage.fragileCargo):0;s.salvage=Math.max(0,s.salvage-lost+o.salvage);
  const gain=(symbol==='O'?1:0)+(symbol==='F'?stage.currentPower:0),powerBefore=s.power;s.power=Math.min(4,s.power+gain);
  const patrolHere=stage.patrol?.zones.includes(s.zone),patrolHit=Boolean(patrolHere&&s.patrolLane===action.lane);
  if(patrolHit)s.playerHp=Math.max(0,s.playerHp-stage.patrol.damage);
  if(patrolHere&&stage.patrol.shiftAfter)s.patrolLane=s.patrolLane==='left'?'right':'left';
  events.push({type:'lane',symbol,oxygenDelta:delta,salvageDelta:o.salvage-lost,powerGain:s.power-powerBefore,shielded,patrolHit});
  s.sonar=false;s.anchored=false;
  if(s.oxygen<=0||s.playerHp<=0){finish(s,'fail',s.oxygen<=0?'oxygen':'patrol');events.push({type:'result',outcome:'fail'});}
  else if(s.zone===stage.pairs.length){const won=s.salvage>=stage.target&&s.sequence===stage.sequence.length;finish(s,won?'clear':'miss',won?'target':'target-or-marker');events.push({type:'result',outcome:s.outcome});}
  else{s.zone++;nextPhase(s,stage);if(s.phase==='result')events.push({type:'result',outcome:s.outcome});}
 }else if(s.phase==='fish'&&action.type==='escape'){
  s.oxygen=Math.max(0,s.oxygen-stage.escapeCost);events.push({type:'fish-escape',oxygenCost:stage.escapeCost});
  if(s.oxygen<=0){finish(s,'fail','fish-escape');events.push({type:'result',outcome:'fail'});}
  else{afterFish(s,stage);if(s.phase==='result')events.push({type:'result',outcome:s.outcome});}
 }else if(s.phase==='fish'&&(action.type==='attack'||action.type==='guard')){
  const guard=action.type==='guard';if(guard&&s.power<1)return reject('insufficient-power');
  const {attack}=values(s.stats),damage=guard?attack-Math.floor(attack/3):attack;
  const retaliation=guard?Math.ceil(s.fish.attack/3):s.fish.attack;
  if(guard)s.power--;s.fish.hp=Math.max(0,s.fish.hp-damage);
  events.push({type:'fish-hit',mode:action.type,damage,powerCost:guard?1:0});
  if(s.fish.hp===0){
   const fish=clone(s.fish),before=s.power;s.salvage++;s.power=Math.min(4,s.power+1);
   // Do not persist XP or allocate upgrades: these are host-owned effects.
   events.push({type:'fish-win',xp:fish.xp,salvage:1,powerGain:s.power-before,hostMustHandleXpAndUpgrade:true});afterFish(s,stage);
   if(s.phase==='result')events.push({type:'result',outcome:s.outcome});
   else{s.resumeAfterFish=s.phase;s.phase='awaiting-fish-reward';}
  }else{s.playerHp=Math.max(0,s.playerHp-retaliation);events.push({type:'fish-counter',damage:retaliation});
   if(s.playerHp<=0){finish(s,'combat','fish');events.push({type:'result',outcome:'combat'});}}
 }else if(s.phase==='awaiting-fish-reward'&&action.type==='ack-fish-reward'){
  if(action.hostHandled!==true)return reject('host-xp-not-handled');
  let after;try{after=values(action.stats);}catch{return reject('invalid-stats');}
  const before=values(s.stats);
  if(['hp','attack','oxygen'].some(k=>action.stats[k]<s.stats[k]))return reject('stats-regression');
  s.playerHp+=after.maxHp-before.maxHp;s.oxygen+=after.maxOxygen-before.maxOxygen;
  s.stats=clone(action.stats);s.phase=s.resumeAfterFish;s.resumeAfterFish=null;
  events.push({type:'fish-reward-acknowledged',hostOwnsPersistence:true});
 }else if(s.phase==='guardian'&&action.type==='guardian'){
  const option=stage.boss.phases[s.guardianPhase].find(item=>item.action===action.choice);
  if(!option)return reject('invalid-guardian-action');
  if(s.power<(option.power||0)||s.anchors<(option.anchor||0)||s.salvage<(option.salvage||0))return reject('guardian-resource-unavailable');
  s.power-=option.power||0;s.anchors-=option.anchor||0;s.salvage-=option.salvage||0;
  s.oxygen=Math.max(0,s.oxygen-(option.oxygen||0));s.playerHp=Math.max(0,s.playerHp-(option.hp||0));
  if(option.shiftPatrol)s.patrolLane=s.patrolLane==='left'?'right':'left';
  if(option.hold)s.anchored=true;
  events.push({type:'guardian-action',choice:option.action,guardianPhase:s.guardianPhase});
  if(s.oxygen<=0||s.playerHp<=0){finish(s,'fail','guardian');events.push({type:'result',outcome:'fail'});}
  else if(++s.guardianPhase>=stage.boss.phases.length){s.guardianPhase=null;s.phase='lane';}
 }else return reject('action-unavailable');
 s.revision++;return {status:'applied',state:s,events};
}
