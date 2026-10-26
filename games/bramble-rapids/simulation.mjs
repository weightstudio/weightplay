/** Authoritative, renderer-independent river simulation. No DOM, audio, storage,
 * browser hooks or random outcome changes. All distances advance by integration. */
import { PHYSICS, getStage, getBoard, trackWidth, featureX, gateIsOpen, gateSecondsToChange, tideLabel } from './content.mjs';

export const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
const approach = (value, target, amount) => value < target ? Math.min(target, value + amount) : Math.max(target, value - amount);
const cloneList = list => [...list];
const onLane = (x, feature, time, margin = 0) => Math.abs(x - featureX(feature, time)) <= feature.width / 2 + margin;
const inSection = (s, feature) => s >= feature.s && s <= feature.s + (feature.length || 0);

function emit(race, type, racer = race.player, detail = {}) {
  race.events.push({ type, racerId: racer.id, time: race.activeTime, s: racer.s, x: racer.x, y: racer.y, ...detail });
  if (race.events.length > PHYSICS.maxEvents) race.events.splice(0, race.events.length - PHYSICS.maxEvents);
}
export function drainEvents(race) { return race.events.splice(0); }

function snapshot(racer, s = racer.s) {
  return { s, x: clamp(racer.x, -0.72, 0.72), flags: cloneList(racer.flags), bonusFlags: cloneList(racer.bonusFlags),
    landedRampIds: cloneList(racer.landedRampIds), currentZones: cloneList(racer.currentZones), passedGates: cloneList(racer.passedGates), score: racer.score };
}
function racerState(id, boardId, pace = 1, x = 0, profile = 'nori') {
  const racer = { id, profile, boardId, pace, s: 0, x, y: 0, vy: 0, vx: 0, speed: PHYSICS.initialSpeed * pace,
    stability: 3, finished: false, eliminated: false, finishTime: null, flags: [], bonusFlags: [], landedRampIds: [], currentZones: [], passedGates: [],
    landings: 0, falls: 0, hits: 0, bridgeHits: 0, score: 0, grounded: true, airborne: false, flight: null,
    anchorRemaining: 1, anchorUsed: false, anchored: false, anchorTime: 0, anchorBayId: null, gateWait: null,
    damageCooldown: 0, respawnProtection: 0, slowTime: 0, bumpCooldown: 0, checkpointIndex: 0, pose: 'idle',
    _jumpBuffer: 0, _jumpDown: false, _anchorDown: false, _lastRampId: null, _lastRampExit: -100,
    _contactIds: [], _checkedRampIds: [], _rejectAt: -10, _recovering: false };
  racer.lastCheckpoint = snapshot(racer, 0);
  return racer;
}

export function createRace(stageOrId, { boardId = 'brook' } = {}) {
  const stage = typeof stageOrId === 'object' ? stageOrId : getStage(stageOrId);
  if (!stage || !Number.isInteger(stage.id) || !Array.isArray(stage.features)) throw new TypeError('A complete authored stage is required.');
  const board = getBoard(boardId);
  const race = { stage, boardId: board.id, status: 'ready', previousStatus: null, activeTime: 0, penaltyTime: 0, rank: 1,
    player: racerState('nori', board.id), rivals: [], events: [], result: null, accumulator: 0, sequence: 0 };
  const profiles = ['fia', 'taro', 'mimi'];
  for (let index = 0; index < stage.aiCount; index++) {
    const pace = stage.aiPace + [0.025, -0.025, 0][index];
    race.rivals.push(racerState(profiles[index], index === 1 ? 'reedguard' : index === 0 ? 'driftfin' : 'brook', pace, [-0.62, 0.62, -0.32][index], profiles[index]));
  }
  return race;
}

export function startRace(race) {
  if (race.status === 'ready') { race.status = 'running'; race.player.pose = 'ride'; emit(race, 'start'); }
  return race;
}
export function pauseRace(race) {
  if (race.status === 'running') {
    race.previousStatus = 'running'; race.status = 'paused'; race.accumulator = 0;
    race.player._jumpBuffer = 0; race.player._jumpDown = false; race.player._anchorDown = false;
    emit(race, 'pause');
  }
  return race;
}
export function resumeRace(race) {
  if (race.status === 'paused' && race.previousStatus === 'running') { race.status = 'running'; race.previousStatus = null; race.accumulator = 0; emit(race, 'resume'); }
  return race;
}
export function resetRace(race, options = {}) {
  const next = createRace(race.stage, { boardId: options.boardId || race.boardId });
  for (const key of Object.keys(race)) delete race[key];
  Object.assign(race, next);
  return race;
}

export function currentAt(stage, s, x, time) {
  let speed = PHYSICS.waterSpeed, force = 0, zoneId = null;
  for (const feature of stage.features) {
    if (feature.kind === 'current' && inSection(s, feature) && onLane(x, feature, time)) {
      let direction = feature.direction || 0;
      if (feature.tidal && tideLabel(time + (feature.phase || 0)) === 'late') direction *= -1;
      speed = Math.max(speed === PHYSICS.waterSpeed ? feature.speed : speed, feature.speed);
      force += direction * (feature.strength || 0.24); zoneId = feature.id;
    }
    if (feature.kind === 'fork' && inSection(s, feature)) speed = x < 0 ? feature.leftSpeed : feature.rightSpeed;
  }
  return { speed, force, zoneId };
}

export function targetSpeedFor(racer, stage, time) {
  const board = getBoard(racer.boardId), current = currentAt(stage, racer.s, racer.x, time);
  const multiplier = current.speed > PHYSICS.waterSpeed ? board.currentMultiplier : board.waterMultiplier;
  return current.speed * multiplier * racer.pace;
}

export function isWaterAt(stage, s, x) {
  if (Math.abs(x) > 1.025) return false;
  return !stage.features.some(feature => feature.kind === 'gap' && inSection(s, feature) && onLane(x, feature, 0));
}

function safeSpawnX(stage, s, preferred = 0) {
  const candidates = [clamp(preferred, -0.65, 0.65), 0, -0.65, 0.65, -0.35, 0.35];
  return candidates.find(x => isWaterAt(stage, s, x) && !stage.features.some(feature => ['obstacle', 'fork', 'wheel'].includes(feature.kind)
    && feature.s >= s - 2 && feature.s <= s + 9 && onLane(x, feature, 0, 0.08))) ?? 0;
}

function recover(race, racer, reason, { damage = false, fall = false } = {}) {
  if (racer._recovering || racer.finished || racer.eliminated) return;
  racer._recovering = true;
  if (damage) racer.stability = Math.max(0, racer.stability - 1);
  if (fall) racer.falls++;
  if (racer.id === 'nori') race.penaltyTime += PHYSICS.recoveryPenalty;
  const saved = racer.lastCheckpoint;
  racer.s = saved.s; racer.x = safeSpawnX(race.stage, saved.s, saved.x);
  racer.y = 0; racer.vy = 0; racer.vx = 0; racer.speed = PHYSICS.initialSpeed * racer.pace;
  racer.flags = cloneList(saved.flags); racer.bonusFlags = cloneList(saved.bonusFlags); racer.landedRampIds = cloneList(saved.landedRampIds);
  racer.currentZones = cloneList(saved.currentZones); racer.passedGates = cloneList(saved.passedGates); racer.score = saved.score;
  racer.landings = racer.landedRampIds.length; racer.grounded = true; racer.airborne = false; racer.flight = null;
  racer._checkedRampIds = racer._checkedRampIds.filter(id => racer.landedRampIds.includes(id));
  racer.checkpointIndex = Math.max(0, race.stage.checkpoints.findIndex(point => point.s === saved.s));
  racer._jumpBuffer = 0; racer._lastRampId = null; racer._lastRampExit = -100;
  racer.gateWait = null; racer.slowTime = 0; racer.damageCooldown = PHYSICS.damageCooldown;
  racer.respawnProtection = PHYSICS.recoveryProtection; racer._contactIds = [];
  if (racer.anchored) endAnchor(race, racer, 'recovery');
  racer.pose = 'recover';
  emit(race, fall ? 'fall' : 'recover', racer, { reason, checkpointId: race.stage.checkpoints[racer.checkpointIndex]?.id, damage, penalty: racer.id === 'nori' ? PHYSICS.recoveryPenalty : 0 });
  racer._recovering = false;
  if (racer.stability === 0) {
    if (racer.id === 'nori') settle(race, false, 'stability');
    else { racer.eliminated = true; racer.pose = 'lose'; emit(race, 'rival-out', racer); }
  }
}

function endAnchor(race, racer, reason = 'release') {
  if (!racer.anchored) return;
  racer.anchored = false; racer.anchorBayId = null; racer.pose = 'ride';
  emit(race, 'anchor-end', racer, { reason });
}
function reject(race, racer, reason) {
  if (racer.id === 'nori' && race.activeTime - racer._rejectAt > 0.5) { racer._rejectAt = race.activeTime; emit(race, 'reject', racer, { reason }); }
}

function handleAnchor(race, racer, held, dt, rising) {
  if (racer.anchored) {
    racer.anchorTime += dt;
    if (!held || racer.anchorTime >= 2) endAnchor(race, racer, racer.anchorTime >= 2 ? 'limit' : 'release');
    else { racer.speed = 0; racer.pose = 'anchor'; return true; }
  }
  if (held && !racer.anchored && racer.anchorRemaining > 0 && race.stage.anchorUnlocked && racer.grounded) {
    const mooring = race.stage.features.find(feature => feature.kind === 'bay' && inSection(racer.s, feature) && onLane(racer.x, feature, race.activeTime));
    if (mooring) {
      racer.anchorRemaining = 0; racer.anchorUsed = true; racer.anchorTime = 0; racer.anchored = true; racer.anchorBayId = mooring.id;
      racer.speed = 0; racer.pose = 'anchor'; emit(race, 'anchor-start', racer, { featureId: mooring.id }); return true;
    }
  }
  if (rising) reject(race, racer, !race.stage.anchorUnlocked ? 'anchor-locked' : racer.anchorRemaining === 0 ? 'anchor-used' : 'anchor-bay');
  return false;
}

function rampInReach(race, racer) {
  return race.stage.ramps.find(feature => racer.s >= feature.launchStart && racer.s <= feature.launchEnd && onLane(racer.x, feature, race.activeTime, 0.06));
}
function tryJump(race, racer) {
  if (!racer.grounded || racer._jumpBuffer <= 0 || racer.anchored || racer.gateWait) return false;
  let feature = rampInReach(race, racer);
  if (!feature && race.activeTime - racer._lastRampExit <= PHYSICS.coyoteTime) feature = race.stage.ramps.find(item => item.id === racer._lastRampId);
  if (!feature || racer.landedRampIds.includes(feature.id)) return false;
  racer.grounded = false; racer.airborne = true; racer.y = 0.035; racer.vy = PHYSICS.jumpImpulse;
  racer.flight = { rampId: feature.id, startS: racer.s, startX: racer.x, forwardSpeed: racer.speed, time: 0 };
  racer._jumpBuffer = 0; racer.pose = 'jump';
  emit(race, 'jump', racer, { featureId: feature.id }); return true;
}

function land(race, racer) {
  const flight = racer.flight, feature = race.stage.ramps.find(item => item.id === flight?.rampId);
  const targets = feature ? (feature.targets || [feature.target]) : [];
  const travelled = racer.s - (flight?.startS || racer.s);
  const target = targets.find(item => travelled >= item.minDistance && travelled <= item.maxDistance
    && racer.s >= item.sStart - 2.5 && racer.s <= item.sEnd + 3
    && Math.abs(racer.x - item.x) <= item.width / 2
    && (!item.tidePhase || tideLabel(race.activeTime) === item.tidePhase));
  racer.y = 0; racer.vy = 0; racer.airborne = false; racer.grounded = true; racer.flight = null;
  if (!isWaterAt(race.stage, racer.s, racer.x)) { recover(race, racer, 'missed-water', { damage: true, fall: true }); return; }
  if (target) {
    if (!racer.landedRampIds.includes(feature.id)) { racer.landedRampIds.push(feature.id); racer.landings = racer.landedRampIds.length; racer.score += 50; }
    racer.pose = 'land'; emit(race, 'land', racer, { featureId: feature.id, clean: true, distance: travelled });
  } else {
    racer.pose = 'land'; emit(race, 'land', racer, { featureId: feature?.id || null, clean: false, distance: travelled });
    if (feature?.required) recover(race, racer, 'landing-window', { damage: true, fall: true });
  }
}

function applyHazard(race, racer, feature, position) {
  if (racer.respawnProtection > 0 || racer.damageCooldown > 0 || racer._contactIds.includes(feature.id)) return;
  racer._contactIds.push(feature.id); racer.stability = Math.max(0, racer.stability - 1); racer.hits++;
  if (feature.kind === 'bridge') racer.bridgeHits++;
  racer.damageCooldown = PHYSICS.damageCooldown; racer.slowTime = 0.8; racer.speed *= 0.52;
  racer.vx = (racer.x >= position ? 1 : -1) * 0.42; racer.pose = 'hit';
  emit(race, 'hit', racer, { featureId: feature.id, material: feature.material || 'wood', damage: 1, stability: racer.stability });
  if (racer.stability === 0) {
    if (racer.id === 'nori') settle(race, false, 'stability');
    else { racer.eliminated = true; racer.pose = 'lose'; emit(race, 'rival-out', racer); }
  }
}

function processFeatures(race, racer, previousS, previousX) {
  const stage = race.stage;
  for (const feature of stage.features) {
    if (racer.eliminated || race.status !== 'running') return;
    const crossed = previousS < feature.s && racer.s >= feature.s;
    const crossingRatio = racer.s === previousS ? 1 : clamp((feature.s - previousS) / (racer.s - previousS), 0, 1);
    const crossingX = previousX + (racer.x - previousX) * crossingRatio;
    if (feature.kind === 'buoy' && crossed) {
      const accepted = onLane(crossingX, feature, race.activeTime, 0.055) && (!feature.tidePhase || tideLabel(race.activeTime) === feature.tidePhase);
      if (feature.role === 'bonus') {
        if (accepted && !racer.bonusFlags.includes(feature.id)) { racer.bonusFlags.push(feature.id); racer.score += 100; emit(race, 'bonus', racer, { featureId: feature.id, count: racer.bonusFlags.length }); }
      } else if (!racer.flags.includes(feature.id)) {
        const expected = stage.clearConditions.flags[racer.flags.length];
        if (accepted && expected === feature.id) { racer.flags.push(feature.id); emit(race, 'flag', racer, { featureId: feature.id, count: racer.flags.length }); }
        else { recover(race, racer, accepted ? 'flag-order' : feature.tidePhase ? 'flag-tide' : 'missed-flag'); return; }
      }
    }
    if (feature.kind === 'ramp' && feature.required && racer.s > feature.target.sEnd + 3 && !racer.landedRampIds.includes(feature.id) && !racer._checkedRampIds.includes(feature.id)) {
      racer._checkedRampIds.push(feature.id); recover(race, racer, 'landing-required'); return;
    }
    if (feature.kind === 'gate' && crossed && !racer.passedGates.includes(feature.id) && (racer.y > (feature.height || 1.2) || gateIsOpen(feature, race.activeTime) || !onLane(crossingX, feature, race.activeTime))) {
      racer.passedGates.push(feature.id); emit(race, 'gate-pass', racer, { featureId: feature.id, bypass: !onLane(crossingX, feature, race.activeTime) || racer.y > (feature.height || 1.2) });
    }
    if (['obstacle', 'wheel', 'fork', 'bridge'].includes(feature.kind)) {
      const length = feature.length || 1.8;
      if (racer.s >= feature.s - 0.8 && previousS <= feature.s + length + 0.8) {
        const contactX = featureX(feature, race.activeTime);
        let height = feature.height || 0.75;
        if (feature.kind === 'bridge') {
          height = feature.tidal && tideLabel(race.activeTime) === 'early' ? feature.lowClearance : feature.clearance;
          if (racer.y >= height && onLane(racer.x, feature, race.activeTime, 0.05)) applyHazard(race, racer, feature, contactX);
        } else if (racer.y <= height && Math.abs(racer.x - contactX) <= feature.width / 2 + 0.085) applyHazard(race, racer, feature, contactX);
      } else if (racer.s > feature.s + length + 2) racer._contactIds = racer._contactIds.filter(id => id !== feature.id);
    }
  }
  for (let index = racer.checkpointIndex + 1; index < stage.checkpoints.length; index++) {
    const point = stage.checkpoints[index];
    if (previousS < point.s && racer.s >= point.s && racer.grounded) {
      racer.checkpointIndex = index;
      racer.lastCheckpoint = snapshot(racer, point.s);
      racer.lastCheckpoint.x = safeSpawnX(stage, point.s, racer.x);
      emit(race, 'checkpoint', racer, { checkpointId: point.id });
    }
  }
}

function moveRacer(race, racer, dt, input) {
  if (racer.finished || racer.eliminated || race.status !== 'running') return;
  const stage = race.stage, board = getBoard(racer.boardId);
  racer.damageCooldown = Math.max(0, racer.damageCooldown - dt); racer.respawnProtection = Math.max(0, racer.respawnProtection - dt);
  racer.bumpCooldown = Math.max(0, racer.bumpCooldown - dt); racer.slowTime = Math.max(0, racer.slowTime - dt);
  const previousS = racer.s, previousX = racer.x;
  const current = currentAt(stage, racer.s, racer.x, race.activeTime);
  if (current.zoneId && !racer.currentZones.includes(current.zoneId) && racer.grounded) {
    racer.currentZones.push(current.zoneId); emit(race, 'current', racer, { featureId: current.zoneId });
  }
  const rampFeature = rampInReach(race, racer);
  if (rampFeature) { racer._lastRampId = rampFeature.id; racer._lastRampExit = race.activeTime; }
  racer._jumpBuffer = Math.max(0, racer._jumpBuffer - dt);
  if (input.jump && !racer._jumpDown) racer._jumpBuffer = PHYSICS.jumpBuffer;
  racer._jumpDown = Boolean(input.jump);
  const anchorRising = Boolean(input.anchor) && !racer._anchorDown;
  racer._anchorDown = Boolean(input.anchor);
  const heldByAnchor = handleAnchor(race, racer, Boolean(input.anchor), dt, anchorRising);
  const jumped = tryJump(race, racer);
  if (input.jump && !jumped && racer._jumpBuffer > 0 && !rampFeature && race.activeTime - racer._lastRampExit > PHYSICS.coyoteTime && racer._jumpBuffer > PHYSICS.jumpBuffer - 0.025) reject(race, racer, 'jump-ramp');
  const halfWidth = trackWidth(racer.s, stage) / 2;
  const maxLateral = racer.airborne ? PHYSICS.airLateralSpeed * board.airMultiplier : PHYSICS.lateralSpeed;
  const steer = clamp(Number(input.steer) || 0, -1, 1);
  const desiredVx = steer * maxLateral / halfWidth;
  racer.vx = approach(racer.vx, desiredVx, PHYSICS.lateralAcceleration * board.lateralMultiplier / halfWidth * dt);
  const push = racer.grounded ? current.force * board.crossCurrentMultiplier : 0;
  racer.x += (racer.vx + push) * dt;
  if (!heldByAnchor) {
    const wantedSpeed = racer.airborne ? racer.flight.forwardSpeed : targetSpeedFor(racer, stage, race.activeTime) * (racer.slowTime > 0 ? 0.62 : 1);
    racer.speed = approach(racer.speed, wantedSpeed, PHYSICS.acceleration * dt);
    let nextS = racer.s + racer.speed * dt;
    const closedGate = stage.features.find(feature => feature.kind === 'gate' && racer.s <= feature.s - feature.waitingDistance
      && nextS >= feature.s - feature.waitingDistance && racer.y <= (feature.height || 1.2)
      && onLane(racer.x, feature, race.activeTime, 0.06)
      && (!gateIsOpen(feature, race.activeTime) || gateSecondsToChange(feature, race.activeTime) < Math.max(0.22, 0.86 - racer.speed * 0.06)));
    if (closedGate) {
      nextS = closedGate.s - closedGate.waitingDistance; racer.speed = 0;
      if (racer.gateWait !== closedGate.id) emit(race, 'gate-wait', racer, { featureId: closedGate.id });
      racer.gateWait = closedGate.id; racer.pose = 'wait';
    } else {
      if (racer.gateWait) { emit(race, 'gate-release', racer, { featureId: racer.gateWait }); racer.gateWait = null; }
      if (racer.grounded && racer.slowTime <= 0) racer.pose = Math.abs(steer) > 0.15 ? (steer < 0 ? 'steer-left' : 'steer-right') : 'ride';
    }
    racer.s = Math.min(stage.length, nextS);
  }
  if (racer.airborne) {
    racer.flight.time += dt; racer.vy -= PHYSICS.gravity * dt; racer.y += racer.vy * dt;
    if (racer.y <= 0 && racer.vy < 0) land(race, racer);
  } else if (!isWaterAt(stage, racer.s, racer.x) && racer.respawnProtection <= 0) { recover(race, racer, Math.abs(racer.x) > 1.025 ? 'river-edge' : 'water-gap', { damage: true, fall: true }); return; }
  if (racer.s < previousS || race.status !== 'running') return;
  processFeatures(race, racer, previousS, previousX);
  if (racer.s >= stage.length && !racer.finished && race.status === 'running') {
    racer.finished = true; racer.finishTime = race.activeTime; racer.speed = 0; racer.pose = 'finish';
    emit(race, 'finish', racer);
  }
}

/** Visible-feature AI follows the same steering/flight/current/gate integrator.
 * Pace is fixed in stage data and never depends on the player's place. */
export function aiInputFor(race, racer) {
  const stage = race.stage;
  const nextFlagId = stage.clearConditions.flags[racer.flags.length];
  const nextFlag = stage.features.find(feature => feature.id === nextFlagId);
  const nextBonus = racer.bonusFlags.length < (stage.clearConditions.minBonus || 0)
    ? stage.features.find(feature => feature.kind === 'buoy' && feature.role === 'bonus' && feature.s > racer.s && !racer.bonusFlags.includes(feature.id)) : null;
  const nextMarker = nextBonus && (!nextFlag || nextBonus.s < nextFlag.s) ? nextBonus : nextFlag;
  const nextRamp = stage.ramps.find(feature => feature.s + 3 >= racer.s && !racer.landedRampIds.includes(feature.id)
    && (feature.required || (stage.clearConditions.minLandings && racer.landings < stage.clearConditions.minLandings) || (racer.profile === 'fia' && !stage.clearConditions.maxLandings)));
  let target = 0;
  if (racer.airborne && racer.flight) {
    const activeRamp = stage.ramps.find(feature => feature.id === racer.flight.rampId);
    const targets = activeRamp?.targets || [activeRamp?.target];
    target = targets.find(item => item && (!item.tidePhase || tideLabel(race.activeTime + 0.3) === item.tidePhase))?.x || 0;
  } else if (nextRamp && nextRamp.s - racer.s < 30 && (!nextMarker || nextMarker.s > nextRamp.s + 23)) target = nextRamp.x;
  else if (nextMarker && nextMarker.s - racer.s < 44) target = featureX(nextMarker, race.activeTime + Math.max(0, nextMarker.s - racer.s) / Math.max(8, racer.speed));
  else {
    const upcoming = stage.features.find(feature => ['obstacle', 'wheel', 'fork'].includes(feature.kind) && feature.s + (feature.length || 0) > racer.s && feature.s - racer.s < 26);
    if (upcoming) target = featureX(upcoming, race.activeTime) >= 0 ? -0.58 : 0.58;
    else {
      const fast = stage.features.find(feature => feature.kind === 'current' && feature.speed > 12 && feature.s - racer.s < 30 && feature.s + feature.length > racer.s);
      if (fast) target = fast.x;
    }
  }
  const steer = clamp((target - racer.x) * 4.5 - racer.vx * 0.75, -1, 1);
  const launch = nextRamp && racer.grounded && racer.s >= nextRamp.launchStart + 0.4 && racer.s <= nextRamp.launchEnd - 0.2
    && Math.abs(racer.x - nextRamp.x) < nextRamp.width / 2;
  // Drop the edge between launches; a held Jump cannot trigger multiple ramps.
  return { steer, jump: Boolean(launch && !racer._jumpDown), anchor: false };
}

function softBumps(race) {
  const racers = [race.player, ...race.rivals];
  for (let i = 0; i < racers.length; i++) for (let j = i + 1; j < racers.length; j++) {
    const a = racers[i], b = racers[j];
    if (a.finished || b.finished || a.eliminated || b.eliminated || a.airborne || b.airborne || a.bumpCooldown > 0 || b.bumpCooldown > 0) continue;
    if (Math.abs(a.s - b.s) < 1.35 && Math.abs(a.x - b.x) < 0.17) {
      const side = a.x === b.x ? (i % 2 ? -1 : 1) : Math.sign(a.x - b.x);
      a.vx += side * 0.13; b.vx -= side * 0.13; a.speed *= 0.97; b.speed *= 0.97;
      a.bumpCooldown = 0.8; b.bumpCooldown = 0.8;
      emit(race, 'bump', a, { otherId: b.id, damage: 0 });
    }
  }
}

export function rankRace(race) {
  const racers = [race.player, ...race.rivals];
  racers.sort((a, b) => {
    if (a.finished && b.finished) return a.finishTime - b.finishTime || a.id.localeCompare(b.id);
    if (a.finished) return -1;
    if (b.finished) return 1;
    if (a.eliminated !== b.eliminated) return a.eliminated ? 1 : -1;
    return b.s - a.s || a.id.localeCompare(b.id);
  });
  race.rank = racers.findIndex(racer => racer.id === 'nori') + 1;
  race.order = racers.map(racer => racer.id);
  return race.rank;
}

export function conditionFailure(race, conditions = race.stage.clearConditions) {
  const p = race.player;
  if (conditions.flags && conditions.flags.some(id => !p.flags.includes(id))) return 'flags';
  if (conditions.minLandings !== undefined && p.landings < conditions.minLandings) return 'landings';
  if (conditions.maxLandings !== undefined && p.landings > conditions.maxLandings) return 'too-many-landings';
  if (conditions.minBonus !== undefined && p.bonusFlags.length < conditions.minBonus) return 'bonus';
  if (conditions.maxRank !== undefined && race.rank > conditions.maxRank) return 'rank';
  if (conditions.minStability !== undefined && p.stability < conditions.minStability) return 'stability-goal';
  if (conditions.maxFalls !== undefined && p.falls > conditions.maxFalls) return 'falls';
  if (conditions.maxHits !== undefined && p.hits > conditions.maxHits) return 'hits';
  if (conditions.maxBridgeHits !== undefined && p.bridgeHits > conditions.maxBridgeHits) return 'bridge';
  if (conditions.minCurrentZones !== undefined && p.currentZones.length < conditions.minCurrentZones) return 'current';
  return null;
}

function settle(race, won, reason) {
  if (race.result) return;
  rankRace(race);
  race.status = won ? 'won' : 'lost'; race.accumulator = 0;
  if (race.player.anchored) endAnchor(race, race.player, 'result');
  race.player.pose = won ? 'win' : 'lose';
  const time = race.activeTime + race.penaltyTime;
  let stars = won ? 1 : 0;
  if (won && !conditionFailure(race, race.stage.medalConditions)) stars = 2;
  if (stars === 2 && race.player.falls === 0 && time <= race.stage.parTime) stars = 3;
  race.result = Object.freeze({ won, stageId: race.stage.id, time, activeTime: race.activeTime, penaltyTime: race.penaltyTime,
    rank: race.rank, stars, landings: race.player.landings, falls: race.player.falls, hits: race.player.hits,
    flags: [...race.player.flags], bonus: race.player.bonusFlags.length, stability: race.player.stability,
    score: race.player.score, boardId: race.boardId, anchorUsed: race.player.anchorUsed, reason: reason || (won ? 'complete' : 'incomplete') });
  emit(race, won ? 'won' : 'lost', race.player, { reason: race.result.reason, result: race.result });
}

export function stepRace(race, dt, input = {}) {
  if (race.status !== 'running') return race;
  const elapsed = Number.isFinite(dt) ? clamp(dt, 0, PHYSICS.step * PHYSICS.maxSubsteps) : 0;
  race.accumulator = Math.min(PHYSICS.step * PHYSICS.maxSubsteps, race.accumulator + elapsed);
  let steps = 0;
  while (race.accumulator + 1e-9 >= PHYSICS.step && steps++ < PHYSICS.maxSubsteps && race.status === 'running') {
    race.accumulator -= PHYSICS.step; race.activeTime += PHYSICS.step; race.sequence++;
    moveRacer(race, race.player, PHYSICS.step, input);
    for (const rival of race.rivals) moveRacer(race, rival, PHYSICS.step, aiInputFor(race, rival));
    if (race.status !== 'running') break;
    softBumps(race); rankRace(race);
    if (race.player.finished) {
      const reason = conditionFailure(race); settle(race, !reason, reason || 'complete');
    } else if (race.activeTime + race.penaltyTime >= race.stage.timeLimit) settle(race, false, 'time');
  }
  if (race.accumulator < 0) race.accumulator = 0;
  return race;
}
