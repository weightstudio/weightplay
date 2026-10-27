// PROTOTYPE_NOT_IN_GAME. Design evidence only; game.js does not import this file.
// Lane codes: R relic (+1 salvage, -10 oxygen), C cache (+2, -16),
// O oxygen (+18, cap 100, +1 power), H hazard (-28), F current (-18).
// A/B are named relic waypoints with R economics. Every pair is an authored
// left/right zone BEFORE its explicitly visible current reversal. On a marked
// zone the current swaps the two outcomes and closes the physical left lane;
// the anchor (two/dive, 1 power) suppresses both effects for that zone.
// This makes using the anchor change the available choice, not merely the
// display order. Required waypoints must be collected in order.
// Fish are always escaped at the stated cost; no EXP, upgrades or diamonds.
// A listed patrol damages the diver for choosing its marked physical lane and
// optionally shifts afterward. Fragile cargo loses one item after a hazard.
// Checkpoint decisions resolve BEFORE the last lane and before route settlement.
// Information API models sonar visibility, not human comprehension or an
// information-safe policy; solve() remains an omniscient possibility search.

const rows = [
 // id, name, decision, support, pairs, flips, fish, target, sequence, boss
 [31,'First Tidal Turn','learn visible swap','single current','RH CO OR CH RO RC',[2],[4],5,'',null],
 [32,'Anchor Practice','anchor the first current to reach A','anchor required','HA OH CR RO HC RC',[1,4],[3],5,'A',null],
 [33,'Bubbles Against Flow','recover power before a reversal','oxygen before swap','CO RF OA CR HR RC',[3,5],[4],5,'A',null],
 [34,'Silent Compass','continue while sonar is jammed','information unverified','RA OC HR CR FO RC',[2,5],[3,5],5,'A',null],
 [35,'Reef Turnkeeper','anchor the guardian current or dive through it','checkpoint one','AR CO RH OC CR RC',[2,4],[3],5,'A','turnkeeper'],
 [36,'Marked Beacon','collect the first named waypoint','single objective','AO RC HR CO OR RC',[2],[4],5,'A',null],
 [37,'Two Lost Signals','collect A before B','ordered objectives','AR BO CO RH OR RC',[2,4],[5],5,'AB',null],
 [38,'Forked Rescue','reach ordered waypoints in reversed water','two reversals','OA RH BC CO OR RC',[1,3],[4],5,'AB',null],
 [39,'Airlock Rescue','visit both signals before final exit','one fish before air','AR CO HB OC BR RC',[2,4],[3,5],5,'AB',null],
 [40,'Gate Warden','open the gate in order before guardian','checkpoint two','AO BR RH OC CR RC',[1,3],[4],5,'AB','warden'],
 [41,'Patrol Shadow','choose around the zone-2 patrol','zone 2 patrol','AR CO RH OC FR RC',[1,4],[3],5,'A',null],
 [42,'Crossing Patrol','collect the marker before the zone-3 patrol','zone 3 patrol','CO AR OH FC OR RC',[2,5],[4],5,'A',null],
 [43,'Guarded Bubbles','choose a lane around patrol and oxygen','escape before recovery','AO RH CO FR OR RC',[1,3],[2,5],5,'A',null],
 [44,'Signal Under Watch','collect A then B across a patrol','ordered patrol','AR OC BF CO OR RC',[2,4],[3],5,'AB',null],
 [45,'Sidewinder','induce a side change then cross','checkpoint three','AO BC RH CO OR RC',[1,4],[3],5,'AB','sidewinder'],
 [46,'Double Drift','compare two consecutive reversals','two adjacent flows','AR OC RH CO OR RC',[2,3],[4],5,'A',null],
 [47,'Anchor Reserve','anchor zone 1; decide whether to anchor zone 5','required first anchor; optional later anchor','OA RC HR CO FR RC',[1,5],[3],5,'A',null],
 [48,'Narrow Recharge','consider optional oxygen pockets across flows','oxygen is optional in the restricted model','AR CO OH FR RC RC',[2,4,5],[3],5,'A',null],
 [49,'Two Signals in Drift','keep the signal order through two flows','ordered two-signal route','AR BO OH RC OR RC',[2,3,5],[4],5,'AB',null],
 [50,'Pressure Bell','read pressure tell before responding','checkpoint four','AO BR OC HR CR RC',[1,4],[3],5,'AB','pressure'],
 [51,'Fragile Signal','protect cargo while reading the reversal','fragile cargo','AR CO OH FR OR RC',[2,4],[3],5,'A',null],
 [52,'Blind Rescue','find the signals when sonar is jammed','jammed markers','AO BR RH CO OR RC',[2,5],[4],5,'AB',null],
 [53,'Heavy Cargo Fork','compare cargo with current recharge below power cap','optional current recharge','CO AR OH FR OR RC',[1,4],[3,5],5,'A',null],
 [54,'Protected Pair','collect ordered signals and avoid cargo damage','fragile ordered cargo','AR BO OH CR OR RC',[2,4],[3],5,'AB',null],
 [55,'Cargo Sentinel','protect the load through the counter window','checkpoint five','AO BR HC CO OR RC',[1,5],[4],5,'AB','sentinel'],
 [56,'Long Return','read three flows while preserving oxygen','three-flow route','AR OC RH CO OR RC',[1,3,5],[4],5,'A',null],
 [57,'Twin Rescue','sequence both signals through currents','ordered recovery','AO BR RH OC CR RC',[2,4,5],[3],5,'AB',null],
 [58,'Cargo and Crossing','protect cargo while patrol changes sides','fragile patrol route','AR CO OH FR OR RC',[1,3,5],[4],5,'A',null],
 [59,'Last Safe Pocket','read the final flow and ordered markers','no necessary power pressure established','AO BR OC FH CR RC',[2,3,5],[4],5,'AB',null],
 [60,'Heart of the Tides','complete both signals and a two-phase guardian','chapter finale','AR BO OC FH CR RC',[1,4,5],[3],5,'AB','heart']
];

// Costs are explicit candidate boss rules. Each phase has a clearly announced
// choice; if all costs are unaffordable the route has no modeled solution.
const bosses = {
  turnkeeper: {name:'Turnkeeper', rule:'Before the last zone, anchor the guardian current or spend oxygen to dive through it.', phases:[[{action:'anchor-current',power:1,anchor:1,hold:true},{action:'dive',oxygen:9,hp:2}]]},
  warden: {name:'Gate Warden', rule:'Both markers open the gate; power the release or take the detour.', phases:[[{action:'unlock',power:1,oxygen:3},{action:'detour',oxygen:13}]]},
  sidewinder: {name:'Sidewinder', rule:'Before the last zone, lure the patrol to the opposite lane or hold its position.', phases:[[{action:'lure',oxygen:8,shiftPatrol:true},{action:'guard',power:1,hp:5}]]},
  pressure: {name:'Pressure Bell', rule:'An announced pressure pulse offers an oxygen-cost wait or a powered brace.', phases:[[{action:'wait-window',oxygen:8},{action:'brace',power:1,hp:4}]]},
  sentinel: {name:'Cargo Sentinel', rule:'Protect cargo using power or lose two pieces to the interceptor.', phases:[[{action:'protect',power:1,hp:3},{action:'sacrifice-cargo',salvage:2}]]},
  heart: {name:'Heart Guardian', rule:'Resolve a seal, then independently cross the announced guard window.', phases:[[{action:'break-seal',power:1,hp:3},{action:'bypass-seal',oxygen:10}], [{action:'cross-window',oxygen:8,hp:2},{action:'guard-window',power:1,hp:4}]]}
};

const patrols={41:{zones:[2],initial:'right'},42:{zones:[3],initial:'right'},43:{zones:[4],initial:'right'},44:{zones:[4],initial:'right'},45:{zones:[6],initial:'right'},53:{zones:[4],initial:'right'},58:{zones:[4,5],initial:'right',shiftAfter:true}};
export const stages = Object.freeze(rows.map(([id,name,decision,support,pairs,flows,fish,target,sequence,boss]) => Object.freeze({
 id,name,goal:`Reach ${target} salvage${sequence ? ` after collecting ${sequence.split('').join(' then ')}` : ''} and finish all zones`,
 decision,support,pairs:pairs.split(' ').map(pair=>pair.split('')),flows:id===35?[...flows,6]:flows,fish,escapeCost:id%2?8:9,target,sequence:sequence.split(''),
 jammed:[34,52].includes(id)?[2,4]:[], fragileCargo:[51,54,55,58].includes(id)?1:0,
 patrol:patrols[id]?{...patrols[id],damage:3}:null,startBattery:id===33?0:4,currentPower:id===53?1:0,
 boss:boss ? bosses[boss] : null, anchor:{charges:2,cost:1},
 reward:`Existing salvage and coins; unlock ${id === 60 ? 'no further stage' : id+1}; Castle stage-${id} on first saved clear`,
 note:'Prototype: exact clue, motion, combat, wording and visual implementation remain unverified.'
})));

// Shared candidate display contract: old five categories have the v33 visible
// estimate triples. Distinct A/B markers are a proposed new icon/ARIA/text,
// not current runtime behavior. Exact outcome labels require a legal scan.
const INTEL={R:'2/1/8–14',C:'3/2/14–22',O:'1/1/+12–22',H:'2/3/22–32',F:'1/2/14–22',A:'2/1/8–14',B:'2/1/8–14'};
export function visibleClue(symbol,mode='distinct-marker-proposal') {
 if(!Object.hasOwn(INTEL,symbol))throw new TypeError('unknown outcome');
 if(mode==='masked')return '?';
 if(mode==='distinct-marker-proposal'&&(symbol==='A'||symbol==='B'))return `proposal-marker-${symbol}`;
 if(mode==='legacy-estimates'||mode==='distinct-marker-proposal')return INTEL[symbol];
 throw new TypeError('unknown clue mode');
}
export function scanLabel(symbol,mode='distinct-proposed') {
 if(!Object.hasOwn(INTEL,symbol))throw new TypeError('unknown outcome');
 if(mode==='distinct-proposed')return symbol;
 if(mode==='anonymous')return symbol==='A'||symbol==='B'?'R':symbol;
 throw new TypeError('unknown marker scan mode');
}
export function observe(stage,zone,{battery=stage.startBattery??4,scan=false,anchor=false,patrolLane=stage.patrol?.initial??null,cueMode='distinct-marker-proposal',markerScan='distinct-proposed'}={}) {
 if(!Number.isInteger(zone)||zone<1||zone>stage.pairs.length||!Number.isInteger(battery)||battery<0||battery>4)throw new RangeError('invalid observation');
 const jammed=stage.jammed?.includes(zone)??false;
 const status=!scan?'not-requested':jammed?'jammed':battery<2?'insufficient-power':'revealed';
 const reversed=stage.flows.includes(zone)&&!anchor;
 const pair=stage.pairs[zone-1];
 const physical=reversed?[pair[1],pair[0]]:pair;
 const clues=physical.map(symbol=>visibleClue(symbol,cueMode));
 const outcomes=status==='revealed'?physical.map(symbol=>scanLabel(symbol,markerScan)):null;
 const patrol=stage.patrol?.zones.includes(zone)?{lane:patrolLane,damage:stage.patrol.damage}:null;
 return {zone,jammed,scanStatus:status,batteryAfter:status==='revealed'?battery-2:battery,openLanes:reversed?['right']:['left','right'],patrol,clues,outcomes};
}
// One explicit scan action; caller retains scanZone within the same dive.
// This is an isolated rule, not the live game's accessibility presentation.
export function scan(stage,state) {
 if(state.scanZone===state.zone)return {status:'already-scanned',state};
 const result=observe(stage,state.zone,{battery:state.power,scan:true,anchor:state.holdZone===state.zone||state.anchorZone===state.zone,patrolLane:state.patrolLane});
 return result.scanStatus==='revealed'
  ? {status:'revealed',outcomes:result.outcomes,state:{...state,power:result.batteryAfter,scanZone:state.zone}}
  : {status:result.scanStatus,state};
}

// Existential witness search with full knowledge of outcomes, no sonar, shields,
// optional combat, EXP, stat upgrades, beacon or premium purchases. It uses
// existing per-tile oxygen values and escape semantics. It models proposed boss
// choices only; it is not a proof of runtime integration or player readability.
export function solve(stage, {anchorCharges=2,disableOxygenPower=false,disableCurrentPower=false,requireCurrent=false,forcedBossAction=null,forcedLastLane=null}={}) {
 const effects={R:[-10,1,0],C:[-16,2,0],O:[18,0,1],H:[-28,0,0],F:[-18,0,0],A:[-10,1,0],B:[-10,1,0]};
 let states=[{oxygen:100,hp:30,power:stage.startBattery??4,anchors:anchorCharges,salvage:0,sequence:0,patrolLane:stage.patrol?.initial??null,holdZone:null,usedCurrent:false,path:[]}];
 for(let index=0;index<stage.pairs.length;index++) {
  const zone=index+1, next=[];
  let entered=[];
  for(const original of states) {
   const fishCost=stage.fish.includes(zone)?stage.escapeCost:0;
   if(original.oxygen<=fishCost) continue;
   entered.push({...original,oxygen:original.oxygen-fishCost});
  }
  // New guardian decisions happen before the final zone's lane is selected.
  if(zone===stage.pairs.length&&stage.boss) {
   entered=entered.filter(s=>s.sequence===stage.sequence.length);
   for(const options of stage.boss.phases) {
    const afterPhase=[];
    for(const state of entered) for(const option of options) {
     if(forcedBossAction&&option.action!==forcedBossAction)continue;
     const oxygen=state.oxygen-(option.oxygen||0),hp=state.hp-(option.hp||0),power=state.power-(option.power||0),salvage=state.salvage-(option.salvage||0),anchors=state.anchors-(option.anchor||0);
     if(oxygen<=0||hp<=0||power<0||salvage<0||anchors<0)continue;
     const patrolLane=option.shiftPatrol?(state.patrolLane==='left'?'right':'left'):state.patrolLane;
     afterPhase.push({...state,oxygen,hp,power,salvage,anchors,patrolLane,holdZone:option.hold?zone:state.holdZone,path:[...state.path,{bossAction:option.action,beforeZone:zone,oxygen,hp,power,anchors,patrolBefore:state.patrolLane,patrolAfter:patrolLane}]});
    }
    entered=afterPhase;
   }
  }
  for(const original of entered) {
   for(const anchor of stage.flows.includes(zone)&&original.holdZone!==zone?[false,true]:[false]) {
    if(anchor && (original.anchors<1 || original.power<1)) continue;
    for(const lane of [0,1]) {
     if(zone===stage.pairs.length&&forcedLastLane&&forcedLastLane!==(lane?'right':'left'))continue;
     const reversed=stage.flows.includes(zone)&&!anchor&&original.holdZone!==zone;
     if(reversed && lane===0) continue;
     const symbol=stage.pairs[index][reversed?1-lane:lane];
     const [air,loot,power]=effects[symbol];
     let sequence=original.sequence;
     if(symbol==='A'||symbol==='B') {
      if(stage.sequence[sequence]!==symbol) continue;
      sequence++;
     }
     const oxygen=Math.min(100,original.oxygen+air);
     const laneName=lane?'right':'left';
     const patrolHere=stage.patrol?.zones.includes(zone);
     const hp=original.hp-(patrolHere&&original.patrolLane===laneName?stage.patrol.damage:0);
     if(oxygen<=0||hp<=0) continue;
     const lost=(symbol==='H'||symbol==='F')?Math.min(original.salvage,stage.fragileCargo):0;
     const gain=(symbol==='O'&&disableOxygenPower?0:power)+(symbol==='F'&&!disableCurrentPower?(stage.currentPower??0):0);
     const nextPower=Math.min(4,original.power-(anchor?1:0)+gain);
     const patrolLane=patrolHere&&stage.patrol.shiftAfter?(original.patrolLane==='left'?'right':'left'):original.patrolLane;
     next.push({...original,oxygen,hp,power:nextPower,anchors:original.anchors-(anchor?1:0),salvage:original.salvage-lost+loot,sequence,patrolLane,holdZone:null,usedCurrent:original.usedCurrent||symbol==='F',path:[...original.path,{zone,lane:laneName,anchor,symbol,oxygen,hp,powerBefore:original.power,power:nextPower,patrolBefore:original.patrolLane,patrolAfter:patrolLane}]});
    }
   }
  }
  states=next;
 }
 return states.filter(s=>s.salvage>=stage.target&&s.sequence===stage.sequence.length&&(!requireCurrent||s.usedCurrent)).sort((a,b)=>b.oxygen-a.oxygen||b.hp-a.hp)[0]||null;
}
