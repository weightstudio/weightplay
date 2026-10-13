export const GRID_ENTRANCES = [
  { x: 0, z: 0 }, { x: 0, z: 1 }, { x: 1, z: 0 }, { x: 1, z: 1 }
];

const FOOTPRINTS = {
  single: { width: 1, depth: 1 },
  double: { width: 1, depth: 2 },
  cooler: { width: 2, depth: 2 },
  counter: { width: 1, depth: 1 },
  decor: { width: 1, depth: 1 }
};

export function baseFootprint(fixture = {}) {
  if (fixture.kind === 'cooler') return FOOTPRINTS.cooler;
  if (fixture.kind === 'checkout' || fixture.kind === 'fastCheckout') return FOOTPRINTS.counter;
  if (fixture.kind === 'decor') return FOOTPRINTS.decor;
  return fixture.footprint === 'double' ? FOOTPRINTS.double : FOOTPRINTS.single;
}

export function footprintSize(fixture = {}) {
  const size = baseFootprint(fixture);
  return Math.abs(Math.floor(fixture.rotation || 0)) % 2
    ? { width: size.depth, depth: size.width }
    : { ...size };
}

export function occupiedTiles(fixture = {}) {
  const { width, depth } = footprintSize(fixture);
  const tiles = [];
  for (let x = 0; x < width; x++) {
    for (let z = 0; z < depth; z++) tiles.push({ x: fixture.x + x, z: fixture.z + z });
  }
  return tiles;
}

export function tileKey(point) {
  return `${point.x},${point.z}`;
}

export function tileInShop(point, area) {
  return Number.isInteger(point.x) && Number.isInteger(point.z)
    && point.x >= 0 && point.z >= 0 && point.x < area && point.z < area;
}

export function footprintConflict(candidate, fixtures, area, ignoreId = null) {
  const tiles = occupiedTiles(candidate);
  if (!tiles.length || tiles.some(tile => !tileInShop(tile, area))) return 'outside';
  const occupied = new Set();
  for (const fixture of fixtures) {
    if (fixture.id === ignoreId) continue;
    for (const tile of occupiedTiles(fixture)) occupied.add(tileKey(tile));
  }
  if (tiles.some(tile => occupied.has(tileKey(tile)))) return 'occupied';
  if (tiles.some(tile => GRID_ENTRANCES.some(entry => entry.x === tile.x && entry.z === tile.z))) return 'entrance';
  return null;
}

export function serviceVector(rotation = 0) {
  const angle = (Math.floor(rotation || 0) % 4) * Math.PI / 2;
  return { x: Math.sin(angle), z: Math.cos(angle) };
}

export function serviceFacingTarget(counter) {
  const front = serviceVector(counter.rotation);
  const { width, depth } = footprintSize(counter);
  const center = { x: counter.x + (width - 1) / 2, z: counter.z + (depth - 1) / 2 };
  return { x: center.x + front.x, z: center.z + front.z };
}

export function queueTile(counter, rank = 0) {
  const target = serviceFacingTarget(counter);
  const front = serviceVector(counter.rotation);
  return { x: Math.round(target.x + front.x * rank), z: Math.round(target.z + front.z * rank) };
}

export function clampPopularity(value) {
  return Math.max(0, Math.min(100, Number.isFinite(value) ? value : 50));
}

export function popularityAfterWait(value, seconds, patience = 16) {
  const waited = Math.max(0, Number(seconds) || 0);
  return clampPopularity(value + (waited <= patience ? 1.25 : -Math.min(7, 2 + (waited - patience) * 0.28)));
}

export function popularityAfterWalkout(value) {
  return clampPopularity(value - 7);
}

export function decorAppeal(count) {
  const pieces = Math.max(0, Math.floor(count || 0));
  let appeal = 0;
  for (let i = 0; i < Math.min(6, pieces); i++) appeal += 5 / (1 + i * 0.8);
  return Math.min(12, appeal);
}

export function trafficInterval(popularity) {
  const value = clampPopularity(popularity);
  return 10 - value * 0.065;
}

export function trafficRate(popularity) {
  return 1 / trafficInterval(popularity);
}

export function smoothHeading(current, target, deltaSeconds, rate = 14) {
  const delta = Math.atan2(Math.sin(target - current), Math.cos(target - current));
  return current + delta * (1 - Math.exp(-Math.max(0, deltaSeconds) * rate));
}

export function fixtureCenter(fixture) {
  const { width, depth } = footprintSize(fixture);
  return { x: fixture.x + (width - 1) / 2, z: fixture.z + (depth - 1) / 2 };
}

