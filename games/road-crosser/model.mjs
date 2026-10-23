export const WIDTH = 10;
export const ROWS = 9;
export const SAVE_KEY = 'wp-road-crosser-journey-v1';
export const BEST_KEY = 'wp-road-crosser-best';
export const COST = 12;
const clamp = (n, a, b) => Math.min(b, Math.max(a, n));

export function readJourney(storage) {
  try {
    const raw = JSON.parse(storage.getItem(SAVE_KEY) || '{}');
    return { version: 1, clears: [0, 1, 2].map(i => clamp(Math.floor(Number(raw.clears?.[i]) || 0), 0, 9999)),
      lanterns: clamp(Math.floor(Number(raw.lanterns) || 0), 0, 999999), aurora: raw.aurora === true,
      equipped: raw.aurora === true && raw.equipped === 'aurora' ? 'aurora' : 'gold' };
  } catch { return { version: 1, clears: [0, 0, 0], lanterns: 0, aurora: false, equipped: 'gold' }; }
}
export function saveJourney(storage, data) { storage.setItem(SAVE_KEY, JSON.stringify(data)); }
export function readBest(storage) {
  try { return clamp(Math.floor(Number(storage.getItem(BEST_KEY)) || 0), 0, Number.MAX_SAFE_INTEGER); } catch { return 0; }
}

// Ownership is persisted before a synchronous wallet debit. A failed ownership
// write cannot charge; a rejected debit restores the exact prior owned value.
// The caller serializes same-game purchases with Web Locks where supported.
export function buyAurora(storage, wallet) {
  const current = readJourney(storage);
  if (current.aurora) return { ok: true, alreadyOwned: true, journey: current };
  let previous;
  try {
    if (!wallet || wallet.read().diamonds < COST) return { ok: false, reason: 'funds' };
    previous = storage.getItem(SAVE_KEY);
  } catch { return { ok: false, reason: 'storage' }; }
  try { saveJourney(storage, { ...current, aurora: true, equipped: 'aurora' }); }
  catch { return { ok: false, reason: 'storage' }; }
  let paid = false;
  try { paid = wallet.spendDiamonds(COST); }
  catch { paid = false; }
  if (!paid) {
    try { previous === null ? storage.removeItem(SAVE_KEY) : storage.setItem(SAVE_KEY, previous); }
    catch { return { ok: false, reason: 'storage', rollbackFailed: true }; }
    return { ok: false, reason: 'funds' };
  }
  return { ok: true, alreadyOwned: false, journey: readJourney(storage) };
}

export function createWorld(stage = 1) {
  stage = clamp(stage, 1, 3);
  const traffic = [];
  const starts = [[1.1, 7.3], [2, 8.2], [.3, 6.5]];
  for (let i = 0; i < 3; i++) {
    const direction = i === 1 ? -1 : 1;
    const speed = (.42 + .14 * i + (stage - 1) * .2) * direction;
    const positions = stage === 1 ? starts[i] : [starts[i][0], starts[i][0] + 4.2, starts[i][0] + 8.4];
    positions.forEach((x, index) => traffic.push({ row: 4 + i, x, width: stage === 3 && i === 1 ? 1.9 : 1.22,
      speed, truck: stage === 3 && i === 1, id: `car-${i}-${index}` }));
  }
  const logs = [];
  for (let row = 1; row <= 2; row++) {
    const width = stage === 1 ? 3.35 : stage === 2 ? 2.9 : 2.6;
    const spacing = 3.75; // Four uniformly spaced rafts around the 15-cell loop.
    for (let i = 0; i < 4; i++) logs.push({ row, x: -.3 + i * spacing + (row === 1 ? 1.05 : 0), width,
      speed: (row === 1 ? -.27 : .32) * (1 + .32 * (stage - 1)), id: `log-${row}-${i}` });
  }
  return { stage, time: 0, state: 'playing', phaseTime: 0, reason: null, score: 0, lanterns: 0,
    farthest: 8, player: { x: 5.5, row: 8 }, hop: null, queued: null, traffic, logs,
    rocks: stage === 1 ? [] : [{ x: 5.5, row: 3 }, ...(stage === 3 ? [{ x: 3.5, row: 7 }, { x: 7.5, row: 4 }] : [])],
    pickups: [{ x: stage === 1 ? 5.5 : 4.5, row: 7 }, { x: stage === 1 ? 6.5 : 2.5, row: 3 },
      { x: stage === 3 ? 7.5 : 5.5, row: 1 }].map((p, i) => ({ ...p, id: i, taken: false })), events: [] };
}
export function signalState(world) {
  if (world.stage !== 3) return 'go';
  const phase = world.time % 7;
  return phase < 2.6 ? 'stop' : phase < 3.3 ? 'warning' : 'go';
}
export function requestMove(world, direction) {
  if (!world || world.state !== 'playing') return false;
  if (world.hop) { world.queued = direction; return false; }
  const d = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[direction];
  if (!d) return false;
  const destination = { x: world.player.x + d[0], row: world.player.row + d[1] };
  const reason = destination.x < .35 || destination.x > 9.65 || destination.row < 0 || destination.row > 8 ? 'edge'
    : world.rocks.some(r => r.row === destination.row && Math.abs(r.x - destination.x) < .64) ? 'rock' : null;
  if (reason) { world.events.push({ type: 'blocked', reason, ...destination }); return false; }
  world.hop = { from: { ...world.player }, to: destination, time: 0, duration: .15 };
  world.events.push({ type: 'step', ...destination });
  return true;
}
function impact(world, reason) {
  if (world.state !== 'playing') return;
  world.state = 'impact'; world.phaseTime = 0; world.reason = reason; world.queued = null;
  world.events.push({ type: 'impact', reason, ...world.player });
}
function checkContact(world) {
  const p = world.player;
  if (world.traffic.some(car => car.row === p.row && Math.abs(car.x - p.x) < car.width / 2 + .2)) return impact(world, 'traffic');
  if ((p.row === 1 || p.row === 2) && !world.logs.some(log => log.row === p.row && Math.abs(log.x - p.x) <= log.width / 2 - .12)) return impact(world, 'water');
  if (p.x < .15 || p.x > 9.85) return impact(world, 'water');
  for (const pickup of world.pickups) if (!pickup.taken && pickup.row === p.row && Math.abs(pickup.x - p.x) < .6) {
    pickup.taken = true; world.lanterns++; world.score += 25; world.events.push({ type: 'pickup', ...pickup });
  }
  if (p.row < world.farthest) { world.score += (world.farthest - p.row) * 8; world.farthest = p.row; }
  if (p.row === 0) {
    world.state = 'arriving'; world.phaseTime = 0; world.queued = null; world.score += world.stage * 100;
    world.events.push({ type: 'checkpoint', ...p });
  }
}
export function advance(world, seconds) {
  // Bound timestep without dropping elapsed time in normal 30/60Hz play.
  let remaining = Math.min(.1, Math.max(0, seconds));
  while (remaining > 0) {
    const dt = Math.min(1 / 120, remaining); remaining -= dt;
    if (world.state !== 'playing') { world.phaseTime += dt; continue; }
    world.time += dt;
    const signal = signalState(world);
    for (const item of [...world.traffic, ...world.logs]) {
      const stopped = item.row === 5 && world.stage === 3 && signal !== 'go';
      const speed = stopped ? 0 : item.speed;
      item.x += speed * dt;
      if (item.x > 12.5) item.x -= 15;
      if (item.x < -2.5) item.x += 15;
    }
    if (world.hop) {
      world.hop.time += dt;
      if (world.hop.time >= world.hop.duration) {
        world.player = { ...world.hop.to }; world.hop = null;
        checkContact(world);
        const queued = world.queued; world.queued = null;
        if (queued) requestMove(world, queued);
      }
    } else {
      if (world.player.row === 1 || world.player.row === 2) {
        const log = world.logs.find(l => l.row === world.player.row && Math.abs(l.x - world.player.x) <= l.width / 2 - .12);
        if (log) world.player.x += log.speed * dt;
      }
      checkContact(world);
    }
  }
}
export function nextLanding(world) {
  const p = world.player, row = p.row - 1;
  if (row < 0) return 'safe';
  if (world.rocks.some(r => r.row === row && Math.abs(r.x - p.x) < .64)) return 'blocked';
  if (world.traffic.some(c => c.row === row && Math.abs(c.x + (c.row === 5 && world.stage === 3 && signalState(world) !== 'go' ? 0 : c.speed * .15) - p.x) < c.width / 2 + .3)) return 'danger';
  if ([1, 2].includes(row) && !world.logs.some(l => l.row === row && Math.abs(l.x + l.speed * .15 - p.x) < l.width / 2 - .22)) return 'danger';
  return 'safe';
}
