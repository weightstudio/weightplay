import { stageById } from './stage-config.mjs';

const SHOES = Object.freeze({ balanced: { acceleration: 1, penalty: 1 }, steady: { acceleration: .9, penalty: .8 }, swift: { acceleration: 1.1, penalty: 1.2 } });
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export function createRace(stageId, shoe = 'balanced') {
  const stage = stageById(stageId);
  if (!stage) throw new RangeError('Unknown stage');
  return { stage, shoe: SHOES[shoe] ? shoe : 'balanced', status: 'running', elapsed: 0, distance: 0, speed: 0,
    balance: 100, lastFoot: null, lastStep: null, lastContactDistance: 0, combo: 0, bestCombo: 0, steadySteps: 0, stumbles: 0,
    gateHits: [], gateMisses: [], lastGateIndex: -1, bridgePassed: [], branches: {}, feather: stage.chapter === 2 ? 1 : 0, featherUntil: 0,
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
  return rule === 'slow' ? [.42, .75] : rule === 'fast' || rule === 'headfast' ? [.23, .43] : [.28, .55];
}

// The visible flashing bridge and accepted input use this same time authority.
export function bridgeOpen(race) { return race.elapsed < race.featherUntil || race.elapsed % 2.4 < 1.2; }
export function useFeather(race) {
  if (race.status !== 'running' || race.feather <= 0 || segmentFor(race).rule !== 'bridge') return false;
  race.feather--; race.featherUntil = race.elapsed + 2; race.lastFeedback = 'feather'; race.feedbackUntil=race.elapsed+.65; return true;
}

function failRace(race,reason) {
  race.result={won:false,reason,elapsed:race.elapsed,stumbles:race.stumbles,balance:race.balance,stars:0};
  race.status='finished';
}

export function step(race, foot) {
  if (race.status !== 'running' || !['left', 'right'].includes(foot)) return { accepted: false, reason: 'inactive' };
  let segment = segmentFor(race);
  if (segment.original.startsWith('fork') && !segment.choice) {
    race.branches[segment.index] = foot;
    if (segment.original === 'forkleft' && foot !== 'left' || segment.original === 'forkright' && foot !== 'right' ||
        segment.original === 'forkfast' && foot !== 'left' || segment.original === 'forkslow' && foot !== 'right') race.gateMisses.push(segment.index);
    segment = segmentFor(race);
  }
  const { index, rule } = segment;
  const interval = race.lastStep == null ? .42 : race.elapsed - race.lastStep;
  const range = rhythmRange(segment.pace || rule);
  const alternating = race.lastFoot !== foot;
  const bridge = rule !== 'bridge' || bridgeOpen(race);
  const timed = race.lastStep == null || interval >= range[0] && (interval <= range[1] || rule === 'bridge' && bridge);
  const clean = alternating && timed && bridge;
  const speedCap=segment.wind==='headwind'||rule==='headwind'||rule==='headfast'?2.6:rule==='tailwind'?3.8:3.2;
  race.lastFoot = foot; race.lastStep = race.elapsed; race.lastContactDistance = race.distance;
  if (clean) {
    race.combo++; race.steadySteps++; race.bestCombo = Math.max(race.bestCombo, race.combo);
    race.speed = clamp(race.speed + .5 * SHOES[race.shoe].acceleration, 0, speedCap);
    if (race.combo % 3 === 0) race.balance = clamp(race.balance + 5, 0, 100);
    race.lastFeedback = 'steady';
    if (rule === 'bridge' && !race.bridgePassed.includes(index)) race.bridgePassed.push(index);
  } else {
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
  const speedCap=before.wind==='headwind'||before.rule==='headwind'||before.rule==='headfast'?2.6:before.rule==='tailwind'?3.8:3.2;
  race.speed = clamp(race.speed - drag * dt, 0, speedCap);
  race.distance = Math.min(race.stage.distance, race.distance + race.speed * dt);
  const after = segmentFor(race);
  if (before.index !== after.index) {
    if (['left', 'right'].includes(before.rule) && race.lastGateIndex !== before.index) race.gateMisses.push(before.index);
    if (before.rule === 'bridge' && !race.bridgePassed.includes(before.index)) race.gateMisses.push(before.index);
    if (before.original.startsWith('fork') && !before.choice) race.gateMisses.push(before.index);
    if(race.gateMisses.length){failRace(race,'missed-gate');return;}
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
    elapsed: race.elapsed, stumbles: race.stumbles, balance: race.balance, stars: won ? 1 + Number(race.elapsed <= race.stage.limit * .8) + Number(race.stumbles === 0) : 0 };
  race.status = 'finished';
}
