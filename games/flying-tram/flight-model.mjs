// Pure simulation: metres, seconds and radians. Rendering never changes the rules.
export const SAVE_KEY = 'weightplay.flying-tram.v1';
export const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
export const angle = n => Math.atan2(Math.sin(n), Math.cos(n));
export const finite = (n, fallback = 0) => Number.isFinite(Number(n)) ? Number(n) : fallback;
export function readSave(raw, count = 30) {
  let value; try { value = JSON.parse(raw || '{}'); } catch { value = {}; }
  value = value && typeof value === 'object' ? value : {};
  const list = (key, max = 1e8) => Array.from({length: count}, (_, i) => Math.floor(clamp(finite(value[key]?.[i]), 0, max)));
  const liveries = [...new Set(['sunrise', ...(Array.isArray(value.liveries) ? value.liveries : []).filter(v => ['mint', 'midnight'].includes(v))])];
  return {...value, schema: 2, unlocked: Math.floor(clamp(finite(value.unlocked), 0, count - 1)), best: list('best'), flips: list('flips'), medals: list('medals', 7), liveries, livery: liveries.includes(value.livery) ? value.livery : 'sunrise'};
}
export function createFlight(level) {
  return {...level, index: level.id - 1, phase: 'ready', elapsed: 0, charge: 0, y: 1.2, vy: 0,
    angle: 0, spin: 0, turn: 0, flips: 0, spill: 0, rings: 0, score: 0, progress: 0,
    wind: 0, thermalForce: 0, jet: 0, bumps: 0, invulnerable: 0, outcome: null,
    gates: level.hazards.map(h => ({...h, passed: false})),
    pickups: [.22, .43, .64].map((at, i) => ({at, y: [3.8, 6.5, 4.8][(i + level.arc) % 3], passed: false, collected: false})),
    events: []};
}
export const padX = s => Math.max(0, (.9 - s.progress) * 60);
export function finishFlight(s, won, reason) {
  if (s.outcome) return;
  s.phase = 'finished'; s.outcome = {won, reason}; s.jet = 0;
  if (won) s.score += 700 + Math.round((100 - s.spill) * 5) + (s.checkpoint ? 250 : 0);
  s.score = Math.max(0, Math.round(s.score));
  s.events.push({type: won ? 'land' : 'fail', reason, x: 0, y: s.y});
}
function bump(s, reason) {
  if (s.invulnerable > 0) return;
  s.invulnerable = 1.7; s.bumps++; s.spill = clamp(s.spill + 23, 0, 100);
  s.score = Math.max(0, s.score - 120); s.spin += s.wind >= 0 ? .7 : -.7;
  s.events.push({type: 'hit', reason, x: 0, y: s.y});
  if (s.bumps >= 4) finishFlight(s, false, 'tooLow');
}
export function stepFlight(s, input, dt) {
  if (s.outcome) return;
  dt = clamp(dt, 0, 1 / 30);
  s.jet += ((input.boost ? 1 : 0) - s.jet) * Math.min(1, dt * 15);
  if (s.phase === 'ready') {
    s.charge = clamp(s.charge + (input.boost ? dt * 3 : -dt * 5), 0, 1);
    if (s.charge >= 1) { s.phase = 'cruise'; s.vy = 2.2; s.invulnerable = 3; s.events.push({type:'launch', x:0, y:s.y}); }
    return;
  }
  s.elapsed += dt; s.progress = Math.min(1, s.elapsed / s.duration);
  s.invulnerable = Math.max(0, s.invulnerable - dt);
  const p = s.progress, time = s.elapsed;
  const wave = Math.sin(time * 1.25) * .65 + Math.sin(time * 2.35) * .35;
  const wind = s.windPattern === 'pulse' ? Math.max(0, Math.sin(time * 1.1)) : s.windPattern === 'reverse' ? (p < .5 ? 1 : -1) * Math.sin(time * .8) : s.windPattern === 'double' ? Math.sin(time * 1.7) * Math.cos(time * .35) : s.windPattern === 'lull' ? (Math.sin(time * .7) > .2 ? wave : 0) : wave;
  s.wind = wind * s.gust;
  const steering = Number(input.right) - Number(input.left);
  if (steering) s.spin += (steering * 5.2 + s.wind * .8 - s.spin * .9) * dt;
  else s.spin += (-angle(s.angle) * 6.5 - s.spin * 4.2 + s.wind * .9) * dt;
  s.spin = clamp(s.spin, -4.2, 4.2);
  const delta = s.spin * dt; s.angle += delta;
  if (steering) s.turn += delta; else if (Math.abs(angle(s.angle)) < .25) s.turn = 0;
  if (Math.abs(s.turn) >= Math.PI * 2) {
    s.turn -= Math.sign(s.turn) * Math.PI * 2; s.flips++; s.score += 650;
    s.events.push({type:'flip', x:0, y:s.y});
  }
  const tilt = Math.abs(angle(s.angle));
  s.spill = clamp(s.spill + (tilt > .55 ? 3.4 + Math.abs(s.spin) * .8 : -5) * dt, 0, 100);
  s.thermalForce = s.thermal && p >= s.thermal[0] && p <= s.thermal[1] ? s.thermal[2] * 7 : 0;
  if (p >= s.approach && s.phase !== 'approach') { s.phase = 'approach'; s.events.push({type:'approach'}); }
  if (s.phase === 'approach') {
    // BOOST becomes an air brake. It cannot climb past the arrival roof.
    const target = input.boost ? -.09 : -.95;
    s.vy += (target - s.vy) * Math.min(1, dt * 3.5);
  } else {
    s.vy += ((input.boost ? 3.6 : -1.8) + s.thermalForce - s.vy * 1.15) * dt;
  }
  s.vy = clamp(s.vy, -1.8, 2.5); s.y += s.vy * dt;
  if (s.y > 8.8) { s.y = 8.8; s.vy = Math.min(0, s.vy); }
  for (const ring of s.pickups) {
    if (!ring.passed && p >= ring.at) {
      ring.passed = true;
      if (Math.abs(s.y - ring.y) < 1.25) { ring.collected = true; s.rings++; s.score += 300; s.events.push({type:'ring', x:0, y:ring.y}); }
    }
  }
  for (const gate of s.gates) {
    if (!gate.passed && p >= gate.at) {
      gate.passed = true;
      if (gate.lane === 'low' ? s.y < 4.8 : s.y > 5.2) bump(s, 'obstacleHit');
      else { s.score += 150; s.events.push({type:'dodge'}); }
    }
  }
  if (s.y <= 1.2) {
    s.y = 1.2;
    const onPad = s.phase === 'approach' && padX(s) < s.padWidth / 70;
    if (onPad) {
      if (tilt > .4 || Math.abs(s.spin) > .8) finishFlight(s, false, 'tilted');
      else if (s.vy < -1.1 && s.index > 0) finishFlight(s, false, 'hardLanding');
      else finishFlight(s, true, 'landed');
    } else { bump(s, 'tooLow'); s.vy = 1.35; s.y = 1.25; }
  }
  if (s.spill >= 100) finishFlight(s, false, 'spilled');
  if (s.elapsed >= s.duration && !s.outcome) finishFlight(s, false, 'height');
}
export function awardFlight(save, flight) {
  const next = readSave(JSON.stringify(save));
  if (!flight.outcome?.won) return next;
  const i = flight.index;
  next.unlocked = Math.max(next.unlocked, Math.min(next.best.length - 1, i + 1));
  next.best[i] = Math.max(next.best[i], flight.score); next.flips[i] = Math.max(next.flips[i], flight.flips);
  next.medals[i] |= 1 | (flight.spill <= 35 ? 2 : 0) | (flight.rings === 3 && flight.flips > 0 ? 4 : 0);
  if (next.medals.filter(Boolean).length >= 5 && !next.liveries.includes('mint')) next.liveries.push('mint');
  return next;
}
// Write the entitlement before the shared debit: a quota failure cannot charge
// without granting the item. On a rejected debit, restore the original save.
export function buyLivery(storage, wallet) {
  const previous = storage.getItem(SAVE_KEY);
  const next = readSave(previous);
  if (next.liveries.includes('midnight')) return {ok:true, save:next, charged:false};
  if (wallet.read().diamonds < 20) return {ok:false, reason:'funds'};
  next.liveries.push('midnight'); next.livery = 'midnight';
  storage.setItem(SAVE_KEY, JSON.stringify(next));
  try {
    if (!wallet.spendDiamonds(20)) throw new Error('funds');
  } catch (error) {
    if (previous === null) storage.removeItem(SAVE_KEY); else storage.setItem(SAVE_KEY, previous);
    throw error;
  }
  return {ok:true, save:next, charged:true};
}
