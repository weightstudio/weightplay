import { stageById } from './stage-config.mjs';

const SHOES = Object.freeze({ balanced: { acceleration: 1, penalty: 1, topSpeed: 0 }, steady: { acceleration: .9, penalty: .8, topSpeed: 0 }, swift: { acceleration: 1.1, penalty: 1.2, topSpeed: .22 } });
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export const FORK_CHOICE_GRACE_SECONDS = .25;

// Optional pace landmarks are kept outside hazard transitions.
export function landmarksFor(stage) {
  if(stage.id < 11)return [];
  const segmentLength=stage.distance/stage.route.length;
  if(segmentLength<24)return [];
  return stage.route.flatMap((rule,index)=>['plain','slow','fast','headwind','tailwind','headfast'].includes(rule)?[{position:segmentLength*(index+.5),foot:(stage.id+index)%2?'left':'right',collected:false}]:[]);
}
export function activeLandmark(race){return race.landmarks.find(mark=>!mark.collected&&Math.abs(mark.position-race.distance)<=2.5)||null;}
export function createRace(stageId, shoe = 'balanced') {
  const stage = stageById(stageId);
  if (!stage) throw new RangeError('Unknown stage');
  return { stage, shoe: SHOES[shoe] ? shoe : 'balanced', status: 'running', elapsed: 0, distance: 0, speed: 0,
    balance: 100, dashUsed: false, landmarks: landmarksFor(stage), landmarkUntil: 0, landmarkArmed: null, lastFoot: null, lastStep: null, lastContactDistance: 0, combo: 0, bestCombo: 0, steadySteps: 0, stumbles: 0,
    gateHits: [], gateMisses: [], lastGateIndex: -1, segmentEnteredAt: null, bridgePassed: [], branches: {}, feather: stage.chapter === 2 ? 1 : 0, featherUntil: 0, burstUntil: 0,
    lastFeedback: 'ready', feedbackUntil: 0, result: null };
}

export function segmentFor(race) {
  const count = race.stage.route.length;
  const index = Math.min(count - 1, Math.floor(clamp(race.distance / race.stage.distance, 0, .999999) * count));
  const original = race.stage.route[index], choice = race.branches[index];
  const variants = { fork: ['fast', 'slow'], forkleft: ['fast', 'slow'], forkright: ['fast', 'slow'],
    forkwindbridge: ['headwind', 'bridge'], forkgates: ['left', 'right'], forkfast: ['fast', 'slow'],
    forkslow: ['fast', 'slow'], forkmaster: ['bridge', 'right'] };
  const rule=variants[original] && choice ? variants[original][choice === 'left' ? 0 : 1] : original;
  const pace=choice&&original==='forkgates'?(choice==='left'?'fast':'slow'):choice==='left'&&original==='forkmaster'?'fast':null;
  const wind=choice==='right'&&original==='forkmaster'?'headwind':null;
  return { index, original, choice: choice || null, rule, pace, wind };
}

export function rhythmRange(rule) {
  return rule === 'slow' ? [.50, .75] : rule === 'fast' || rule === 'headfast' ? [.23, .43] : [.28, .48];
}
export function starTimeLimit(stage) { return Number((stage.limit*.55).toFixed(1)); }
function speedLimit(segment, combo, shoe, burst=false, landmark=false) {
  const pace=segment.pace||segment.rule;
  const base=segment.wind==='headwind'||segment.rule==='headwind'||segment.rule==='headfast'?2.6:segment.rule==='tailwind'?3.8:pace==='fast'?3.5:pace==='slow'?2.9:3.2;
  return base+(combo>=12?.35:0)+(combo>=24?.15:0)+SHOES[shoe].topSpeed+Math.max(burst?1.1:0,landmark?.85:0);
}

// The visible flashing bridge and accepted input use this same time authority.
export function bridgeOpen(race) { return race.elapsed < race.featherUntil || race.elapsed % 2.4 < 1.2; }
// One optional chapter-one dash trades balance for a short sprint.
export function useOptionalDash(race){
  if(race.status!=='running'||race.stage.chapter!==1||race.dashUsed||race.combo<6||race.balance<40)return false;
  race.dashUsed=true;race.balance-=20;race.burstUntil=race.elapsed+4;race.speed+=1;race.lastFeedback='dash-burst';race.feedbackUntil=race.elapsed+.65;return true;
}
export function useFeather(race) {
  if (race.status !== 'running' || race.feather <= 0) return false;
  race.feather--;
  if(segmentFor(race).rule==='bridge'){race.featherUntil=race.elapsed+4;race.lastFeedback='feather';}
  else{race.burstUntil=race.elapsed+4;race.speed+=.6;race.lastFeedback='feather-burst';}
  race.feedbackUntil=race.elapsed+.65;return true;
}

function failRace(race,reason) {
  race.result={won:false,reason,elapsed:race.elapsed,stumbles:race.stumbles,balance:race.balance,stars:0};
  race.status='finished';
}

export function step(race, foot) {
  if (race.status !== 'running' || !['left', 'right'].includes(foot)) return { accepted: false, reason: 'inactive' };
  let segment = segmentFor(race);
  const choosing = segment.original.startsWith('fork') && !segment.choice;
  // Match the cue: ignore the previous terrain's pending step during entry
  // and wait until both displayed choices can be clean.
  if (choosing && ((race.lastStep !== null && race.elapsed-race.lastStep < rhythmRange('slow')[0]) ||
      (race.segmentEnteredAt !== null && race.elapsed-race.segmentEnteredAt < FORK_CHOICE_GRACE_SECONDS))) {
    return {accepted:false,reason:'fork-not-ready'};
  }
  if (segment.original.startsWith('fork') && !segment.choice) {
    race.branches[segment.index] = foot;
    if (segment.original === 'forkleft' && foot !== 'left' || segment.original === 'forkright' && foot !== 'right' ||
        segment.original === 'forkfast' && foot !== 'left' || segment.original === 'forkslow' && foot !== 'right') race.gateMisses.push(segment.index);
    segment = segmentFor(race);
  }
  const { index, rule } = segment;
  // A bridge fork has no bridge-light cue until a branch is chosen. Commit the
  // choice without charging an unseen closed light; the player must still
  // take a real step once the chosen bridge opens.
  if (choosing && rule === 'bridge' && !bridgeOpen(race)) {
    race.lastFeedback='bridge-closed';race.feedbackUntil=race.elapsed+.65;
    return {accepted:false,reason:'bridge-choice-wait'};
  }
  // A step reacting to the preceding cue can arrive just after a gate
  // transition. Ignore that one old alternating input briefly; the marked
  // foot is still required before this segment can be cleared.
  if (!choosing && (rule === 'left' || rule === 'right') && race.lastGateIndex !== index && foot !== rule &&
      race.segmentEnteredAt !== null && race.elapsed - race.segmentEnteredAt <= .25 && foot !== race.lastFoot) {
    race.lastFeedback=rule==='left'?'gate-left':'gate-right';race.feedbackUntil=race.elapsed+.65;
    return {accepted:false,reason:'gate-transition'};
  }
  const interval = race.lastStep == null ? .42 : race.elapsed - race.lastStep;
  const range = rhythmRange(segment.pace || rule);
  // The first marked step is a decision, even if it repeats the preceding foot.
  const enteringGate = (rule === 'left' || rule === 'right') && race.lastGateIndex !== index && foot === rule;
  const specialEntry = choosing || enteringGate;
  const activeMark=activeLandmark(race);
  // An in-window first step commits one rhythmic repeat even if the runner
  // leaves the marked area during the natural time to take that second step.
  const armedMark=race.landmarkArmed && !race.landmarkArmed.collected && interval <= range[1] ? race.landmarkArmed : null;
  const mark=activeMark || armedMark,markEntry=mark&&mark.foot===foot&&race.lastFoot===foot;
  const alternating = race.lastFoot !== foot || specialEntry || markEntry;
  const bridge = rule !== 'bridge' || bridgeOpen(race);
  if(!choosing&&rule==='bridge'&&!bridge&&alternating&&(race.lastStep===null||interval>=range[0])){
    const phase=race.elapsed%2.4,naturalClose=race.elapsed-phase+1.2;
    const closedAt=Math.max(naturalClose,race.featherUntil<=race.elapsed?race.featherUntil:0);
    // A legitimate step responding to the just-visible green light can arrive
    // after it closes. Keep the foot and balance intact briefly; the player
    // still has to wait for an open bridge and step again.
    if(race.elapsed-closedAt<=.25){race.lastFeedback='bridge-closed';race.feedbackUntil=race.elapsed+.65;return {accepted:false,reason:'bridge-transition'};}
  }
  const timed = race.lastStep == null || interval >= range[0] && (interval <= range[1] || rule === 'bridge' && bridge || specialEntry);
  const clean = alternating && timed && bridge;
  const speedCap=speedLimit(segment,race.combo+1,race.shoe,race.elapsed<race.burstUntil,race.elapsed<race.landmarkUntil);
  race.lastFoot = foot; race.lastStep = race.elapsed; race.lastContactDistance = race.distance;
  if (clean) {
    race.combo++; race.steadySteps++; race.bestCombo = Math.max(race.bestCombo, race.combo);
    race.speed = clamp(race.speed + .5 * SHOES[race.shoe].acceleration, 0, speedCap);
    if (race.combo % 3 === 0) race.balance = clamp(race.balance + 5, 0, 100);
    race.lastFeedback = 'steady';
    if(markEntry){mark.collected=true;mark.collectedAt=race.elapsed;race.landmarkUntil=race.elapsed+4;race.speed+=.6;race.lastFeedback='landmark';}
    race.landmarkArmed=!markEntry && activeMark && activeMark.foot===foot ? activeMark : null;
    if (rule === 'bridge' && !race.bridgePassed.includes(index)) race.bridgePassed.push(index);
  } else {
    race.landmarkArmed=null;
    race.combo = 0; race.balance = clamp(race.balance - 12 * SHOES[race.shoe].penalty, 0, 100);
    race.speed *= .82; race.lastFeedback = !bridge ? 'bridge-closed' : !alternating ? 'same-foot' : 'timing';
    if (race.balance <= 0) { race.stumbles++; race.balance = 40; race.speed *= .45; race.lastFeedback = 'stumble'; }
  }
  if ((rule === 'left' || rule === 'right') && race.lastGateIndex !== index) {
    race.lastGateIndex = index;
    (foot === rule ? race.gateHits : race.gateMisses).push(index);
  }
  race.feedbackUntil=race.elapsed+.65;
  if(race.gateMisses.length){race.combo=0;race.lastFeedback='gate-missed';failRace(race,'missed-gate');}
  return { accepted: true, clean:clean&&!race.gateMisses.length, feedback: race.lastFeedback, interval, rule };
}

export function advance(race, delta) {
  if (race.status !== 'running') return;
  const dt = clamp(Number.isFinite(delta) ? delta : 0, 0, .05);
  const before = segmentFor(race);
  race.elapsed += dt;
  const drag = before.wind === 'headwind' || before.rule === 'headwind' || before.rule === 'headfast' ? .52 : before.rule === 'tailwind' ? .12 : .28;
  const speedCap=speedLimit(before,race.combo,race.shoe,race.elapsed<race.burstUntil,race.elapsed<race.landmarkUntil);
  race.speed = clamp(race.speed - drag * dt, 0, speedCap);
  race.distance = Math.min(race.stage.distance, race.distance + race.speed * dt);
  const after = segmentFor(race);
  if (before.index !== after.index) {
    if (['left', 'right'].includes(before.rule) && race.lastGateIndex !== before.index) race.gateMisses.push(before.index);
    if (before.rule === 'bridge' && !race.bridgePassed.includes(before.index)) race.gateMisses.push(before.index);
    if (before.original.startsWith('fork') && !before.choice) race.gateMisses.push(before.index);
    if(race.gateMisses.length){failRace(race,'missed-gate');return;}
    race.segmentEnteredAt=race.elapsed;
  }
  if (race.distance >= race.stage.distance || race.elapsed >= race.stage.limit) settle(race);
}

function settle(race) {
  const last = segmentFor(race);
  if (race.distance >= race.stage.distance && ['left', 'right'].includes(last.rule) && race.lastGateIndex !== last.index) race.gateMisses.push(last.index);
  if (race.distance >= race.stage.distance && last.rule === 'bridge' && !race.bridgePassed.includes(last.index)) race.gateMisses.push(last.index);
  if (race.distance >= race.stage.distance && last.original.startsWith('fork') && !last.choice) race.gateMisses.push(last.index);
  const objective = race.stage.objective;
  const conditions = { finish: true, steady3: race.steadySteps >= 3, balance40: race.balance >= 40,
    combo4: race.bestCombo >= 4, 'steady-no-stumble': race.steadySteps >= 3 && race.stumbles === 0,
    balance35: race.balance >= 35, balance30: race.balance >= 30, stumble2: race.stumbles <= 2, gates: race.gateMisses.length === 0 };
  const gates = race.gateMisses.length === 0;
  const won = race.distance >= race.stage.distance && !!conditions[objective] && gates;
  race.result = { won, reason: race.distance < race.stage.distance ? 'timeout' : !gates ? 'missed-gate' : !conditions[objective] ? objective : 'finish',
    elapsed: race.elapsed, stumbles: race.stumbles, balance: race.balance, stars: won ? 1 + Number(race.elapsed <= starTimeLimit(race.stage)) + Number(race.stumbles === 0) : 0 };
  race.status = 'finished';
}
