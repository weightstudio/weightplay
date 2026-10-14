export const GRID_ENTRANCES = [
  { x: 0, z: 0 }, { x: 0, z: 1 }, { x: 1, z: 0 }, { x: 1, z: 1 }
];
export const GRID_EXITS = [{ x: 9, z: 9 }];

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

export function footprintConflict(candidate, fixtures, area, ignoreId = null, protectedTiles = []) {
  const tiles = occupiedTiles(candidate);
  if (!tiles.length || tiles.some(tile => !tileInShop(tile, area))) return 'outside';
  const protectedKeys = new Set(protectedTiles.map(tileKey));
  if (tiles.some(tile => protectedKeys.has(tileKey(tile)))) return 'route';
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
  // One adjacent floor tile keeps the .67-tile bodies apart without empty gaps.
  const distance = Math.max(0, Math.floor(rank));
  return { x: Math.round(target.x + front.x * distance), z: Math.round(target.z + front.z * distance) };
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
  // Quiet shops remain recoverable; a popular shop benefits from more tills.
  return value <= 50 ? 8 - value * .08 : 4 - (value - 50) * .062;
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

export const ACHIEVEMENT_CATALOG = Object.freeze([
  { id: 'first_sale', rewardId: 'badge_first_sale', target: 1 },
  { id: 'five_products', rewardId: 'badge_five_products', target: 5 },
  { id: 'gross_1000', rewardId: 'badge_gross_1000', target: 1000 },
  { id: 'expansion_13', rewardId: 'badge_expansion_13', target: 13 },
  { id: 'payments_25', rewardId: 'badge_payments_25', target: 25 },
  { id: 'patient_service_10', rewardId: 'badge_patient_service_10', target: 10 }
]);

export const ACHIEVEMENT_PRODUCTS = Object.freeze(['water', 'snacks', 'chips', 'juice', 'fizz']);
export const ACHIEVEMENT_PATIENCE_SECONDS = 17;

const validCount = value => Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
const validMoney = value => Number.isFinite(value) ? Math.max(0, value) : 0;
const uniq = values => [...new Set((Array.isArray(values) ? values : []).filter(value => typeof value === 'string' && value))];

export function legacyAchievementProgress(save = {}) {
  const ledger = Array.isArray(save.cashLedger) ? save.cashLedger : [];
  const productIds = uniq(ledger.filter(row => row?.kind === 'sale' && ACHIEVEMENT_PRODUCTS.includes(row.product)).map(row => row.product));
  const patientPayments = ledger.filter(row => row?.kind === 'sale'
    && Number.isFinite(row.queueWaitSeconds) && row.queueWaitSeconds >= 0
    && row.queueWaitSeconds <= ACHIEVEMENT_PATIENCE_SECONDS).length;
  const lifetime = validMoney(save.lifetime);
  const transactions = validCount(save.transactions);
  return {
    firstSale: transactions > 0 || lifetime > 0 ? 1 : 0,
    productIds,
    grossSales: lifetime,
    expandedTo13: save.area >= 13 || save.milestones?.expanded === true ? 1 : 0,
    payments: transactions,
    patientPayments
  };
}

export function normalizeAchievementState(value = {}, legacy = {}) {
  const baseline = value.baseline && typeof value.baseline === 'object' ? value.baseline : legacy;
  const events = (Array.isArray(value.events) ? value.events : []).filter(event => event
    && typeof event.id === 'string' && event.id && ['sale_settled', 'expansion_purchased'].includes(event.type));
  const dedupedEvents = [...new Map(events.map(event => [event.id, event])).values()];
  const unlockedIds = uniq(value.unlockedIds);
  const collectedRewardIds = uniq(value.collectedRewardIds);
  return {
    schemaVersion: 1,
    baseline: {
      firstSale: validCount(baseline.firstSale),
      productIds: uniq(baseline.productIds).filter(id => ACHIEVEMENT_PRODUCTS.includes(id)),
      grossSales: validMoney(baseline.grossSales),
      expandedTo13: validCount(baseline.expandedTo13),
      payments: validCount(baseline.payments),
      patientPayments: validCount(baseline.patientPayments)
    },
    events: dedupedEvents,
    processedEventIds: uniq([...dedupedEvents.map(event => event.id), ...(Array.isArray(value.processedEventIds) ? value.processedEventIds : [])]),
    unlockedIds,
    collectedRewardIds
  };
}

export function mergeAchievementStates(left, right) {
  const a = normalizeAchievementState(left);
  const b = normalizeAchievementState(right);
  const events = [...new Map([...a.events, ...b.events].map(event => [event.id, event])).values()];
  const merged = normalizeAchievementState({
    schemaVersion: 1,
    baseline: {
      firstSale: Math.max(a.baseline.firstSale, b.baseline.firstSale),
      productIds: uniq([...a.baseline.productIds, ...b.baseline.productIds]),
      grossSales: Math.max(a.baseline.grossSales, b.baseline.grossSales),
      expandedTo13: Math.max(a.baseline.expandedTo13, b.baseline.expandedTo13),
      payments: Math.max(a.baseline.payments, b.baseline.payments),
      patientPayments: Math.max(a.baseline.patientPayments, b.baseline.patientPayments)
    },
    events,
    unlockedIds: uniq([...a.unlockedIds, ...b.unlockedIds]),
    collectedRewardIds: uniq([...a.collectedRewardIds, ...b.collectedRewardIds])
  });
  return awardCompletedAchievements(merged).state;
}

export function achievementProgress(value = {}) {
  const state = normalizeAchievementState(value);
  const sales = state.events.filter(event => event.type === 'sale_settled');
  const expanded = state.events.some(event => event.type === 'expansion_purchased' && event.toArea >= 13);
  const productIds = uniq([...state.baseline.productIds, ...sales.map(event => event.productId)]).filter(id => ACHIEVEMENT_PRODUCTS.includes(id));
  return {
    first_sale: Math.max(state.baseline.firstSale, sales.length ? 1 : 0),
    five_products: productIds.length,
    gross_1000: state.baseline.grossSales + sales.reduce((sum, event) => sum + validMoney(event.grossAmount), 0),
    expansion_13: Math.max(state.baseline.expandedTo13, expanded ? 13 : 0),
    payments_25: state.baseline.payments + sales.length,
    patient_service_10: state.baseline.patientPayments + sales.filter(event => Number.isFinite(event.queueWaitSeconds)
      && event.queueWaitSeconds >= 0 && event.queueWaitSeconds <= ACHIEVEMENT_PATIENCE_SECONDS).length
  };
}

export function awardCompletedAchievements(value = {}) {
  const state = normalizeAchievementState(value);
  const progress = achievementProgress(state);
  const unlocked = new Set(state.unlockedIds), collected = new Set(state.collectedRewardIds), newlyUnlocked = [];
  for (const achievement of ACHIEVEMENT_CATALOG) {
    const amount = progress[achievement.id];
    if (amount >= achievement.target && !unlocked.has(achievement.id)) newlyUnlocked.push(achievement.id);
    if (amount >= achievement.target) {
      unlocked.add(achievement.id);
      collected.add(achievement.rewardId);
    }
  }
  state.unlockedIds = [...unlocked];
  state.collectedRewardIds = [...collected];
  return { state, progress, newlyUnlocked };
}

export function recordAchievementEvent(value = {}, event = {}) {
  const state = normalizeAchievementState(value);
  if (!event.id || typeof event.id !== 'string' || state.processedEventIds.includes(event.id)) {
    return { ...awardCompletedAchievements(state), accepted: false };
  }
  let clean;
  if (event.type === 'sale_settled' && ACHIEVEMENT_PRODUCTS.includes(event.productId)
    && Number.isFinite(event.grossAmount) && event.grossAmount >= 0) {
    clean = { id: event.id, type: event.type, productId: event.productId, grossAmount: event.grossAmount,
      queueWaitSeconds: Number.isFinite(event.queueWaitSeconds) && event.queueWaitSeconds >= 0 ? event.queueWaitSeconds : null };
  } else if (event.type === 'expansion_purchased' && Number.isFinite(event.toArea) && event.toArea >= 13) {
    clean = { id: event.id, type: event.type, toArea: Math.floor(event.toArea) };
  } else return { ...awardCompletedAchievements(state), accepted: false };
  state.events.push(clean);
  state.processedEventIds.push(clean.id);
  return { ...awardCompletedAchievements(state), accepted: true };
}

