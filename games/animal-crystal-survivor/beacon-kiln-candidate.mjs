// Stage 50 isolated proposal. The host must perform real movement, collision,
// damage and atomic pulse/heat commits; this module never touches save data.
const finitePoint = p => Number.isFinite(p?.x) && Number.isFinite(p?.y);

export function makeKilnLanding(id, boss, target) {
  if (typeof id !== 'string' || !id || !finitePoint(boss) || !finitePoint(target))
    throw new TypeError('INVALID_KILN_LANDING');
  return { id, phase:'warning', remaining:2, x:Math.max(24,Math.min(1000,target.x)),
    y:Math.max(24,Math.min(1736,target.y)), radius:64 };
}

export function stepKilnLanding(cue, dt) {
  if (cue?.phase !== 'warning' || !finitePoint(cue) ||
      !Number.isFinite(cue.remaining) || cue.remaining < 0 ||
      !Number.isFinite(cue.radius) || cue.radius <= 0 ||
      !Number.isFinite(dt) || dt < 0 || dt > .25)
    throw new RangeError('INVALID_KILN_STEP');
  const remaining = Math.max(0,cue.remaining-dt);
  if (remaining > 1e-9) return {cue:{...cue,remaining},landing:null};
  return {cue:{...cue,remaining:0,phase:'landed'},
    landing:{id:cue.id,x:cue.x,y:cue.y,radius:cue.radius,life:8}};
}

export function applyKilnPulse(boss, before, after, events, landing) {
  if (!boss?.isBoss || boss.image !== 'bossCinderKilnPanther' ||
      !Number.isFinite(boss.hp) || boss.hp <= 0 || !boss.shielded ||
      !landing || typeof landing.id !== 'string' || !landing.id ||
      boss.lastKilnLandingId === landing.id || !finitePoint(landing) || !Number.isFinite(landing.life) ||
      landing.life <= 0 || !Array.isArray(events) || !events.includes('beacon-pulsed'))
    throw new Error('KILN_PULSE_UNAVAILABLE');
  const expected = before?.completed === 0 ? 'C' : before?.completed === 1 ? 'B' : null;
  if (!expected || before.stage !== 50 || after?.stage !== 50 ||
      after.completed !== before.completed+1 || after.pulses !== before.pulses+1 ||
      after.lastPulse !== expected) throw new Error('KILN_PULSE_MISMATCH');
  return {...boss, shielded:after.completed < 2, lastKilnLandingId:landing.id};
}

export function kilnObjective(round, bossDefeated) {
  return round?.stage === 50 && round.completed === 2 && bossDefeated === true;
}
