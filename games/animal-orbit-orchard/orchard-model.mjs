// Original Orbit Orchard simulation. Rendering and wall-clock time never decide hits.
export const SAVE_KEY = 'weightplay-orbit-orchard-harvest-v22';
export const LEGACY_KEY = 'weightplay-orbit-orchard-campaign-v12';
export const STEP = 1 / 120;
export const wrap = n => ((n % 360) + 360) % 360;
export const delta = (a, b) => ((a - b + 540) % 360) - 180;
const rad = n => n * Math.PI / 180;
const fruit = (angle, radius = 4.1, speed = 1) => ({ angle, radius, speed });
const gate = (angle, speed = 18, width = 48, radius = 2.5) => ({ angle, speed, width, radius });
const make = (id, targets, extra = {}) => ({ id, arc: Math.ceil(id / 5), checkpoint: id % 5 === 0,
  targets: targets.map(v => Array.isArray(v) ? fruit(...v) : fruit(v)), speed: 0,
  wind: 0, gates: [], ordered: false, par: targets.length, ...extra });

// Each row changes spatial arrangement, rules or interaction, not just a quota.
export const STAGES = [
  make(1, [315]),
  make(2, [215, 30]),
  make(3, [350, 112, 235]),
  make(4, [40, 172, 292], { ordered: true }),
  make(5, [310, 225, 140, 55], { ordered: true }),
  make(6, [280, 100], { speed: 10 }),
  make(7, [45, 190, 310], { speed: -12 }),
  make(8, [[25, 4.1, 1], [150, 4.1, -1], [270, 4.1, 1]], { speed: 12 }),
  make(9, [10, 130, 250], { speed: 16, oscillate: true }),
  make(10, [[300, 4.1, 1], [190, 4.1, -1], [80, 4.1, 1]], { speed: 14, ordered: true }),
  make(11, [270, 75], { gates: [gate(270, 15, 60)] }),
  make(12, [25, 170, 290], { gates: [gate(15, -20, 72)] }),
  make(13, [300, 120], { speed: 10, gates: [gate(270, 19, 55)] }),
  make(14, [15, 150, 285], { gates: [gate(0, 22, 48), gate(180, 22, 48)] }),
  make(15, [315, 200, 85], { speed: -12, ordered: true, gates: [gate(240, -17, 72)] }),
  make(16, [315, 135], { wind: 24 }),
  make(17, [50, 200, 300], { wind: -28 }),
  make(18, [280, 100], { wind: 26, speed: 9 }),
  make(19, [25, 150, 265], { wind: -24, gates: [gate(90, 16, 60)] }),
  make(20, [310, 190, 70], { wind: 30, speed: -11, ordered: true }),
  make(21, [[315, 2.9], [315, 4.5], [130, 4.5]], { par: 2 }),
  make(22, [[25, 2.9], [25, 4.5], [205, 2.9], [205, 4.5]], { par: 2 }),
  make(23, [[300, 2.9, -1], [300, 4.5, 1], [130, 4.5, 1]], { speed: 10, par: 3 }),
  make(24, [[300, 2.9], [315, 4.5], [130, 2.9], [145, 4.5]], { wind: 24, par: 2 }),
  make(25, [[300, 2.9], [300, 4.5], [100, 2.9], [100, 4.5]], { speed: -9, gates: [gate(230, 18, 56)], par: 3 }),
  make(26, [[300, 2.9, -1], [60, 4.5], [170, 4.5]], { speed: 13, wind: 20 }),
  make(27, [315, 195, 75], { speed: -12, wind: -28, gates: [gate(260, 16, 52)] }),
  make(28, [[300, 2.9], [60, 4.5], [165, 2.9], [240, 4.5]], { speed: 12, oscillate: true, gates: [gate(90, -18, 50)] }),
  make(29, [[315, 2.9], [315, 4.5], [125, 2.9, -1], [125, 4.5, -1]], { speed: 10, wind: 22, gates: [gate(210, 18, 48)], par: 3 }),
  make(30, [[310, 2.9], [200, 4.5, -1], [90, 2.9], [345, 4.5, -1]], { speed: 12, wind: -24, ordered: true, gates: [gate(150, 17, 52)] }),
];

export function normalizeSave(raw, legacy = {}) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const old = legacy && typeof legacy === 'object' ? legacy : {};
  const valid = a => (Array.isArray(a) ? a : []).filter(n => Number.isInteger(n) && n > 0 && n <= STAGES.length);
  const completed = new Set([...valid(source.cleared), ...valid(old.cleared)]);
  let prefix = 0;
  while (completed.has(prefix + 1)) prefix++;
  const stars = {}, best = {};
  for (let id = 1; id <= prefix; id++) {
    if (Number.isInteger(source.stars?.[id]) && source.stars[id] >= 1 && source.stars[id] <= 3) stars[id] = source.stars[id];
    if (Number.isInteger(source.best?.[id]) && source.best[id] >= 1 && source.best[id] <= 100000) best[id] = source.best[id];
  }
  return { version: 22, cleared: Array.from({ length: prefix }, (_, i) => i + 1),
    highestUnlocked: Math.min(STAGES.length, prefix + 1), stars, best };
}
export function starsFor(stage, shots) { return shots <= stage.par ? 3 : shots <= stage.par + 2 ? 2 : 1; }
export function recordClear(save, stage, shots) {
  if (!Number.isInteger(shots) || shots < 1 || stage.id > save.highestUnlocked) return save;
  return normalizeSave({ ...save, cleared: [...save.cleared, stage.id],
    stars: { ...save.stars, [stage.id]: Math.max(save.stars[stage.id] || 0, starsFor(stage, shots)) },
    best: { ...save.best, [stage.id]: Math.min(save.best[stage.id] || Infinity, shots) } });
}
export function createRun(stage) {
  return { stage, time: 0, motionTime: 0, aim: 270, shots: 0, harvested: [],
    projectile: null, cooldown: 0, focusLeft: 0, focusUsed: false,
    complete: false, events: [], chain: 0, lastEvent: 'ready' };
}
export function targetAngle(run, index) {
  const target = run.stage.targets[index];
  const orbit = run.stage.oscillate ? Math.sin(run.motionTime * 0.6) * 45 : run.motionTime * run.stage.speed;
  return wrap(target.angle + orbit * target.speed);
}
export function targetPosition(run, index) {
  const theta = rad(targetAngle(run, index)), r = run.stage.targets[index].radius;
  return { x: Math.cos(theta) * r, z: Math.sin(theta) * r };
}
export function gateAngle(run, item) { return wrap(item.angle + item.speed * run.motionTime); }
export function shotPosition(stage, aim, r) {
  const a = rad(aim + stage.wind * r * r / 20);
  return { x: Math.cos(a) * r, z: Math.sin(a) * r };
}
export function launch(run) {
  if (run.complete || run.projectile || run.cooldown > 0) return false;
  run.projectile = { r: .65, aim: run.aim, ...shotPosition(run.stage, run.aim, .65) };
  run.shots++; run.chain = 0; run.events.push({ type: 'launch' }); return true;
}
export function focus(run) {
  if (run.stage.id < 6 || run.focusUsed || run.complete) return false;
  run.focusUsed = true; run.focusLeft = 3; run.events.push({ type: 'focus' }); return true;
}
function emit(run, event) { run.lastEvent = event.type; run.events.push(event); }
export function step(run, dt = STEP) {
  if (run.complete || !Number.isFinite(dt) || dt <= 0) return;
  // A direct caller cannot advance an unbounded wall-clock interval.
  dt = Math.min(STEP, dt);
  run.time += dt;
  if (run.focusLeft > 0) run.focusLeft = Math.max(0, run.focusLeft - dt);
  else run.motionTime += dt;
  run.cooldown = Math.max(0, run.cooldown - dt);
  const p = run.projectile;
  if (!p) return;
  const oldR = p.r;
  p.r += dt * 7.5;
  Object.assign(p, shotPosition(run.stage, p.aim, p.r));
  for (const barrier of run.stage.gates) {
    if (oldR <= barrier.radius && p.r >= barrier.radius) {
      const crossing = p.aim + run.stage.wind * barrier.radius ** 2 / 20;
      if (Math.abs(delta(crossing, gateAngle(run, barrier))) <= barrier.width / 2 + 2) {
        const at = shotPosition(run.stage, p.aim, barrier.radius);
        emit(run, { type: 'block', ...at }); run.projectile = null; run.cooldown = .18; return;
      }
    }
  }
  for (let i = 0; i < run.stage.targets.length; i++) {
    if (run.harvested.includes(i)) continue;
    const target = targetPosition(run, i);
    if (Math.hypot(p.x - target.x, p.z - target.z) > .48) continue;
    if (run.stage.ordered && i !== run.harvested.length) {
      emit(run, { type: 'order', ...target }); run.projectile = null; run.cooldown = .18; return;
    }
    run.harvested.push(i); run.chain++;
    emit(run, { type: 'harvest', index: i, chain: run.chain, ...target });
    if (run.harvested.length === run.stage.targets.length) {
      run.complete = true; run.projectile = null;
      emit(run, { type: 'complete', stars: starsFor(run.stage, run.shots) }); return;
    }
  }
  if (p.r > 5.25) {
    emit(run, { type: run.chain ? 'ready' : 'miss', x: p.x, z: p.z });
    run.projectile = null; run.cooldown = .12;
  }
}
export function advance(run, seconds) {
  const count = Math.floor(Math.min(.1, Math.max(0, seconds)) / STEP + 1e-6);
  for (let i = 0; i < count; i++) step(run);
}
