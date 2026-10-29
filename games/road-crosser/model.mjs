import { LEVELS, levelById } from './levels.mjs?v=23';
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
    if (wallet?.withTransaction && !wallet.inTransaction()) return wallet.withTransaction("road-crosser:model.mjs:buyAurora", () => buyAurora(...arguments));

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

export const CAMPAIGN_KEY = 'wp-road-crosser-campaign-v1';
export function readCampaign(storage) {
  let raw = {}; try { raw = JSON.parse(storage.getItem(CAMPAIGN_KEY) || '{}') || {}; } catch {}
  const medals = LEVELS.map((_, i) => clamp(Math.trunc(Number(raw.medals?.[i])) || 0, 0, 7));
  for (let i = 0; i < medals.length; i++) if (!(medals[i] & 1)) medals[i] = 0;
  let unlocked = 1; while (unlocked < 30 && (medals[unlocked - 1] & 1)) unlocked++;
  return { version: 1, unlocked, medals,
    best: LEVELS.map((_, i) => clamp(Math.trunc(Number(raw.best?.[i])) || 0, 0, 999999)) };
}
export function recordClear(campaign, world) {
  if (world.state !== 'arriving') return false;
  const index = world.stage - 1;
  const efficient = world.level.charge ? world.charges === world.level.charge : world.moves <= world.level.budget;
  const medals = 1 | (world.lanterns === world.pickups.length ? 2 : 0) | (efficient ? 4 : 0);
  campaign.medals[index] |= medals;
  campaign.best[index] = Math.max(campaign.best[index], world.score);
  while (campaign.unlocked < 30 && (campaign.medals[campaign.unlocked - 1] & 1)) campaign.unlocked++;
  return medals;
}
// A reward must follow a confirmed campaign write, including on replays of
// clears made before the shared reward was introduced.
export function commitCampaignClear(storage, campaign, world, award) {
  const next = { ...campaign, medals: [...campaign.medals], best: [...campaign.best] };
  if (!recordClear(next, world)) throw Error('Route has not been cleared');
  const serialized = JSON.stringify(next);
  storage.setItem(CAMPAIGN_KEY, serialized);
  if (storage.getItem(CAMPAIGN_KEY) !== serialized) throw Error('Campaign save not confirmed');
  let reward = false;
  try { reward = award?.(String(world.stage))?.credited === true; } catch { /* Saved progress remains valid. */ }
  return { campaign: next, reward };
}
export function createWorld(stage = 1) {
  const level = levelById(stage), traffic = [], logs = [];
  level.terrain.forEach((kind, row) => {
    if (kind === 'R') {
      const speed = level.traffic[row] ?? ((row % 2 ? -.64 : .62) * (1 + level.arc * .08));
      const starts = level.phases[row] ?? [1.1 + (row % 3) * .8, 7.7 + (row % 3) * .8];
      starts.forEach((x, i) => traffic.push({ row, x, width: level.trucks.includes(row) ? 1.9 : 1.22, speed,
        truck: level.trucks.includes(row), id: `car-${row}-${i}` }));
    }
    if (kind === 'W') for (let i = 0; i < 4; i++) logs.push({ row, x: -.3 + i * 3.75 + (row % 2 ? 1.05 : 0),
      width: level.widths[row] ?? (level.arc === 0 ? 3.35 : 2.95),
      speed: level.currents[row] ?? (row % 2 ? -.3 : .34), id: `log-${row}-${i}` });
  });
  return { stage: level.id, level, time: 0, state: 'playing', phaseTime: 0, reason: null, score: 0, lanterns: 0,
    farthest: 8, moves: 0, charges: level.charge, freeze: 0, player: { x: level.start, row: 8 }, hop: null, queued: null, traffic, logs,
    rocks: level.rocks.map(([row, x]) => ({ row, x })),
    pickups: level.pickups.map(([row, x], id) => ({ row, x, id, required: level.required.includes(id), taken: false })), events: [] };
}
export function signalState(world, row = world.level.signals[0]?.row) {
  if (world.freeze > 0) return 'stop';
  const signal = world.level.signals.find(s => s.row === row);
  if (!signal) return 'go';
  const phase = (world.time + signal.offset) % 7;
  return phase < 2.6 ? 'stop' : phase < 3.3 ? 'warning' : 'go';
}
export function useSignal(world) {
  if (!world || world.state !== 'playing' || world.charges < 1) return false;
  world.charges--; world.freeze = 2.4;
  world.events.push({ type: 'signal', ...world.player }); return true;
}
export function missingCargo(world) { return world.pickups.filter(p => p.required && !p.taken).length; }
function blockedReason(world, destination) {
  if (destination.x < .35 || destination.x > 9.65 || destination.row < 0 || destination.row > 8) return 'edge';
  if (world.rocks.some(r => r.row === destination.row && Math.abs(r.x - destination.x) < .64)) return 'rock';
  if (destination.row === 0) {
    if (missingCargo(world)) return 'cargo';
    if (world.level.exits.length && !world.level.exits.some(x => Math.abs(x - destination.x) < .65)) return 'dock';
  }
  return null;
}
export function requestMove(world, direction) {
  if (!world || world.state !== 'playing') return false;
  const d = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[direction];
  if (!d) return false;
  if (world.hop) { world.queued = direction; return false; }
  const destination = { x: world.player.x + d[0], row: world.player.row + d[1] };
  const reason = blockedReason(world, destination);
  if (reason) { world.events.push({ type: 'blocked', reason, ...destination }); return false; }
  world.moves++;
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
  if (world.level.terrain[p.row] === 'W' && !world.logs.some(log => log.row === p.row && Math.abs(log.x - p.x) <= log.width / 2 - .12)) return impact(world, 'water');
  if (p.x < .15 || p.x > 9.85) return impact(world, 'water');
  for (const pickup of world.pickups) if (!pickup.taken && pickup.row === p.row && Math.abs(pickup.x - p.x) < .6) {
    pickup.taken = true; world.lanterns++; world.score += 25; world.events.push({ type: 'pickup', ...pickup });
  }
  if (p.row < world.farthest) { world.score += (world.farthest - p.row) * 8; world.farthest = p.row; }
  if (p.row === 0) {
    world.state = 'arriving'; world.phaseTime = 0; world.queued = null; world.score += 100;
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
    world.freeze = Math.max(0, world.freeze - dt);
    for (const item of [...world.traffic, ...world.logs]) {
      const stopped = world.traffic.includes(item) && signalState(world, item.row) !== 'go';
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
      if (world.level.terrain[world.player.row] === 'W') {
        const log = world.logs.find(l => l.row === world.player.row && Math.abs(l.x - world.player.x) <= l.width / 2 - .12);
        if (log) world.player.x += log.speed * dt;
      }
      checkContact(world);
    }
  }
}
export function nextLanding(world) {
  const p = world.player, row = p.row - 1;
  if (blockedReason(world, { x: p.x, row })) return 'blocked';
  if (world.traffic.some(c => c.row === row && Math.abs(c.x + (signalState(world, c.row) !== 'go' ? 0 : c.speed * .15) - p.x) < c.width / 2 + .3)) return 'danger';
  if (world.level.terrain[row] === 'W' && !world.logs.some(l => l.row === row && Math.abs(l.x + l.speed * .15 - p.x) < l.width / 2 - .22)) return 'danger';
  return 'safe';
}
