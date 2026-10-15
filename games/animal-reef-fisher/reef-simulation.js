// Original WeightPlay fishing simulation. No DOM, rendering, storage or rewards.
export const SPOTS = Object.freeze([
  { id: 'reef', x: -3.3, z: -1.4, distance: 12, behavior: 'steady', accuracy: 48, current: .12 },
  { id: 'channel', x: .3, z: -3.2, distance: 16, behavior: 'dart', accuracy: 67, current: .6 },
  { id: 'pool', x: 3.4, z: -1.8, distance: 20, behavior: 'heavy', accuracy: 85, current: .32 },
]);
export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
export function createFishingState(zone, gear = {}) {
  return { phase: 'aim', spot: 0, zone, gear, elapsed: 0, phaseAge: 0, castPower: 0,
    castDir: 1, tension: 40, danger: 0, distance: 0, initialDistance: 1,
    stamina: 100, fish: null, cycle: 'recover', direction: 1, steering: 0,
    reeling: false, landed: false, eventSerial: 0, events: [], castAccuracy: 0,
    float: { x: SPOTS[0].x, y: 0, z: SPOTS[0].z }, fightElapsed: 0,
    gustWarning: false, shieldOpen: true, lastGust: 0, inputTime: 0 };
}
function emit(s, type) { s.events.push({ type, serial: ++s.eventSerial }); }
function enter(s, phase) { s.phase = phase; s.phaseAge = 0; }
export function chooseSpot(s, index) {
  if (s.phase !== 'aim') return false;
  s.spot = ((Number(index) || 0) + SPOTS.length) % SPOTS.length;
  s.float = { x: SPOTS[s.spot].x, y: 0, z: SPOTS[s.spot].z };
  emit(s, 'spot'); return true;
}
export function pressFishing(s) {
  if (s.phase === 'aim') { enter(s, 'charging'); s.castPower = 0; s.castDir = 1; return true; }
  if (s.phase === 'bite') {
    enter(s, 'reel'); s.tension = 42; s.distance = SPOTS[s.spot].distance;
    s.initialDistance = s.distance; s.fightElapsed = 0; s.danger = 0;
    s.stamina = 100; s.reeling = false; emit(s, 'hook'); return true;
  }
  if (s.phase === 'reel') { s.reeling = true; return true; }
  return false;
}
export function releaseFishing(s, fish) {
  s.reeling = false;
  if (s.phase !== 'charging') return false;
  s.fish = fish; s.castAccuracy = 1 - Math.min(1, Math.abs(s.castPower - SPOTS[s.spot].accuracy) / 65);
  enter(s, 'flight'); emit(s, 'cast'); return true;
}
export function cancelFishing(s) {
  s.reeling = false;
  if (s.phase === 'charging') { enter(s, 'aim'); s.castPower = 0; }
}
export function setSteering(s, amount) { s.steering = clamp(amount, -1, 1); }
function escape(s, cause) {
  enter(s, 'aim'); s.fish = null; s.reeling = false; s.danger = 0; emit(s, cause);
}
export function drainFishingEvents(s) { return s.events.splice(0); }
export function stepFishing(s, elapsed) {
  let remaining = clamp(Number(elapsed) || 0, 0, 1);
  while (remaining > 0) { const dt = Math.min(.025, remaining); advance(s, dt); remaining -= dt; }
  return s;
}
function advance(s, dt) {
  s.elapsed += dt; s.phaseAge += dt;
  const spot = SPOTS[s.spot];
  if (s.phase === 'charging') {
    s.castPower += dt * s.castDir * 62;
    if (s.castPower >= 100) { s.castPower = 100; s.castDir = -1; }
    if (s.castPower <= 0) { s.castPower = 0; s.castDir = 1; }
  } else if (s.phase === 'flight') {
    const p = clamp(s.phaseAge / .7, 0, 1);
    s.float.x = -3.6 + (spot.x + 3.6) * p;
    s.float.z = 3.1 + (spot.z - 3.1) * p;
    s.float.y = Math.sin(p * Math.PI) * (2 + s.castPower / 70);
    if (p >= 1) { s.float.y = 0; enter(s, 'wait'); emit(s, 'splash'); }
  } else if (s.phase === 'wait') {
    s.float.y = Math.sin(s.phaseAge * 4) * .045;
    if (s.phaseAge > 1.4 + (1 - s.castAccuracy) * 1.9 - (Math.max(1, s.gear.bait || 1) - 1) * .12) {
      enter(s, 'nibble'); emit(s, 'nibble');
    }
  } else if (s.phase === 'nibble') {
    s.float.y = -.08 + Math.sin(s.phaseAge * 21) * .1;
    if (s.phaseAge > .75) { enter(s, 'bite'); emit(s, 'bite'); }
  } else if (s.phase === 'bite') {
    s.float.y = -.15 + Math.sin(s.phaseAge * 30) * .1;
    if (s.phaseAge > 1.5 + (s.gear.bait || 1) * .1) escape(s, 'miss');
  } else if (s.phase === 'reel') {
    s.fightElapsed += dt;
    const profile = s.fish?.bossProfile || s.fish?.behavior || 'steady';
    const heavy = ['heavy','kelp','storm','abyss'].includes(profile);
    const dart = ['dart','coral','moon'].includes(profile);
    const period = heavy ? 6 : dart ? 4.5 : 5;
    const phase = s.fightElapsed % period;
    s.cycle = phase < .85 ? 'telegraph' : phase < (heavy ? 3.3 : dart ? 2.7 : 2.25) ? 'run' : 'recover';
    const turn = Math.floor(s.fightElapsed / period);
    s.direction = turn % 2 ? -1 : 1;
    if (profile === 'moon' && s.cycle === 'telegraph') s.direction *= -1;
    const counter = clamp(-s.steering * s.direction, -1, 1);
    const control = .7 + (s.gear.reel || 1) * .15;
    const env = s.zone.rule;
    const surge = s.cycle === 'run' ? (heavy ? 13 : dart ? 15 : 9) : s.cycle === 'telegraph' ? 1 : -5;
    let environmental = Math.sin(s.elapsed * .9) * spot.current * 2;
    if (env === 'drift') environmental += Math.sin(s.elapsed * .82) * 3;
    if (env === 'tide') environmental += (Math.floor(s.elapsed / 4) % 2 ? -1 : 1) * 3;
    if (env === 'snag') environmental += Math.max(0, s.steering) * 3;
    const gustTime = s.fightElapsed % 3;
    s.gustWarning = ['storm','abyss'].includes(env) && gustTime > 2.2;
    const gust = Math.floor(s.fightElapsed / 3);
    if (['storm','abyss'].includes(env) && gust > s.lastGust) {
      s.lastGust = gust; s.tension += env === 'abyss' ? 13 : 10; emit(s, 'gust');
    }
    s.shieldOpen = !['coral','abyss'].includes(profile) || Math.floor(s.fightElapsed / 2) % 2 === 0;
    // Release always relieves pressure. Counter-steering reduces a run's load.
    const rate = s.reeling ? 8 + surge + environmental - counter * 5 * control : -15 + Math.max(0, surge) * .35;
    s.tension = clamp(s.tension + rate * dt, 0, 100);
    const low = 16;
    const high = 81 + (s.gear.line || 1) * 1.6;
    if (s.tension < low || s.tension > high) s.danger += dt;
    else s.danger = Math.max(0, s.danger - dt * 1.6);
    if (s.danger > 2.4 + (s.gear.line || 1) * .12) {
      escape(s, s.tension < low ? 'slack' : 'break'); return;
    }
    if (s.reeling) s.inputTime += dt;
    const productive = s.reeling && s.tension >= low && s.tension <= high && s.shieldOpen;
    if (productive) {
      const strength = 1.35 + (s.gear.rod || 1) * .17;
      const recovery = s.cycle === 'recover' ? 1.45 : s.cycle === 'run' ? .42 : 1;
      s.distance = Math.max(0, s.distance - dt * strength * recovery * (1 + Math.max(0, counter) * .3));
      s.stamina = Math.max(0, s.stamina - dt * strength * 3);
    } else if (!s.reeling) s.distance = Math.min(s.initialDistance + 5, s.distance + dt * (s.cycle === 'run' ? .6 : .18));
    s.float.x = spot.x + Math.sin(s.fightElapsed * (dart ? 2.3 : 1.2)) * .65 + s.steering * .25;
    s.float.z = 3.1 + (spot.z - 3.1) * clamp(s.distance / s.initialDistance, 0, 1);
    s.float.y = s.cycle === 'run' ? Math.max(0, Math.sin(s.fightElapsed * 6)) * .15 : -.06;
    if (s.distance <= 0 && s.inputTime > .2) { enter(s, 'landing'); s.reeling = false; s.landed = true; emit(s, 'land'); }
  } else if (s.phase === 'landing') {
    const p = clamp(s.phaseAge / .95, 0, 1);
    s.float.x += (-3.6 - s.float.x) * Math.min(1, dt * 6);
    s.float.z += (3.1 - s.float.z) * Math.min(1, dt * 6);
    s.float.y = Math.sin(p * Math.PI) * 2;
    if (p >= 1) { s.fish = null; s.landed = false; enter(s, 'aim'); emit(s, 'ready'); }
  }
}
