import * as THREE from './vendor/three/three.module.min.js';
import {
  GRID_ENTRANCES, baseFootprint, footprintSize, occupiedTiles, footprintConflict,
  serviceVector, serviceFacingTarget, queueTile, clampPopularity, popularityAfterWait,
  popularityAfterWalkout, decorAppeal, trafficInterval, smoothHeading, fixtureCenter,
  ACHIEVEMENT_CATALOG,
  legacyAchievementProgress, normalizeAchievementState, mergeAchievementStates,
  achievementProgress, awardCompletedAchievements, recordAchievementEvent
} from './blockmart-v9-systems.js';

const PRODUCT_DEFS = {
  water: { label: 'restockWater', cost: 8, price: 12, demand: 1.45, color: 0x48b6cf, display: 'water' },
  snacks: { label: 'cookies', cost: 12, price: 20, demand: 1.05, color: 0xc87b31, display: 'cookies' },
  chips: { label: 'chips', cost: 13, price: 22, demand: .96, color: 0xe8bc38, display: 'chips' },
  juice: { label: 'juice', cost: 17, price: 30, demand: .78, color: 0xe87535, display: 'juice' },
  fizz: { label: 'sparklingDrink', cost: 42, price: 62, demand: .5, color: 0xa34e91, display: 'fizz' }
};

const CASHIER_HIRE_COST = 180;
const REGISTER_COST = 120;
const QUEUE_LIMIT_PER_REGISTER = 4;
const QUEUE_PATIENCE_SECONDS = 17;
const STAFFED_QUEUE_SECONDS = .95;
const TRAFFIC_RECOVERY_FLOOR = 18;
const CELL_SIZE = .94;
const VISUAL_CAMERA_YAW = Math.PI / 6;
const VISUAL_CAMERA_FOCUS_HEIGHT = 1.1;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const copyPoint = point => point ? { x: point.x, z: point.z } : null;
const edgePoint = (point, area) => Number.isInteger(point?.x) && Number.isInteger(point?.z)
  && point.x >= 0 && point.z >= 0 && point.x < area && point.z < area
  && (point.x === 0 || point.z === 0 || point.x === area - 1 || point.z === area - 1);

function normalizeEndpoints(requested, fallback, area, fixtures, otherEndpoints = []) {
  const blocked = new Set(fixtures.flatMap(occupiedTiles).map(tile => `${tile.x},${tile.z}`));
  const occupied = new Set(otherEndpoints.map(point => `${point.x},${point.z}`));
  const candidates = Array.isArray(requested) ? requested : fallback;
  const clean = [...new Map(candidates.filter(point => edgePoint(point, area)
    && !blocked.has(`${point.x},${point.z}`)
    && !occupied.has(`${point.x},${point.z}`))
    .map(point => [`${point.x},${point.z}`, { x: point.x, z: point.z }])).values()];
  if (clean.length) return clean;
  const perimeter = [];
  for (let x = 0; x < area; x++) perimeter.push({ x, z: 0 }, { x, z: area - 1 });
  for (let z = 1; z < area - 1; z++) perimeter.push({ x: 0, z }, { x: area - 1, z });
  return perimeter.filter(point => !blocked.has(`${point.x},${point.z}`)
    && !occupied.has(`${point.x},${point.z}`)).slice(0, 1);
}

export function migrateV9Save(saved = {}, initial = {}) {
  const state = {
    ...structuredClone(initial),
    ...saved,
    stock: { ...initial.stock, ...(saved.stock || {}), chips: saved.stock?.chips || 0, juice: saved.stock?.juice || 0 },
    milestones: { ...initial.milestones, ...(saved.milestones || {}) },
    equipment: { ...initial.equipment, ...(saved.equipment || {}) },
    warehouse: Array.isArray(saved.warehouse) ? saved.warehouse : [],
    fixtures: Array.isArray(saved.fixtures) ? saved.fixtures : structuredClone(initial.fixtures || []),
    autoRestockEnabled: saved.autoRestockEnabled === true && Boolean(saved.helper),
    cashLedger: Array.isArray(saved.cashLedger) ? saved.cashLedger.filter(entry => entry && typeof entry.kind === 'string'
      && Number.isFinite(entry.amount) && Number.isFinite(entry.balance)).slice(-60) : [],
    achievements: normalizeAchievementState(saved.achievements, legacyAchievementProgress(saved)),
    unlocked: Array.isArray(saved.unlocked) ? [...new Set([...saved.unlocked, 'chips'])] : ['water', 'snacks', 'chips'],
    cashierCount: Number.isFinite(saved.cashierCount) ? Math.max(0, Math.floor(saved.cashierCount)) : 1,
    popularity: clampPopularity(saved.popularity ?? 58),
    popularitySales: Math.max(0, Math.floor(saved.popularitySales || 0)),
    nextQueueSequence: Math.max(1, Math.floor(saved.nextQueueSequence || 1)),
    coolerFixtureId: saved.coolerFixtureId || null,
    fastCheckoutFixtureId: saved.fastCheckoutFixtureId || null
  };
  state.fixtures = state.fixtures.map(fixture => normalizeFixture(fixture));
  state.warehouse = state.warehouse.map(fixture => normalizeFixture(fixture));
  const placedIds = new Set(state.fixtures.map(fixture => fixture.id).filter(Boolean));
  const knownAssetIds = new Set(placedIds);
  state.warehouse = state.warehouse.filter(fixture => {
    if (!fixture.id) return true;
    if (knownAssetIds.has(fixture.id)) return false;
    knownAssetIds.add(fixture.id);
    return true;
  });
  const area = Math.max(10, Math.floor(state.area || 10));
  state.entrances = normalizeEndpoints(saved.entrances, [GRID_ENTRANCES[0]], area, state.fixtures);
  state.exits = normalizeEndpoints(saved.exits, [{ x: area - 1, z: area - 1 }], area, state.fixtures, state.entrances);
  if (!state.unlocked.includes('water')) state.unlocked.unshift('water');
  if (!state.unlocked.includes('snacks')) state.unlocked.push('snacks');
  return state;
}

export function normalizeFixture(fixture = {}) {
  const migrated = { ...fixture, rotation: ((Math.floor(fixture.rotation || 0) % 4) + 4) % 4 };
  if (fixture.kind === 'shelf') migrated.footprint = fixture.footprint === 'double' ? 'double' : 'single';
  if (fixture.kind === 'cooler') migrated.footprint = 'cooler';
  if (fixture.kind === 'checkout' || fixture.kind === 'fastCheckout') migrated.footprint = 'counter';
  if (fixture.kind === 'decor') migrated.footprint = 'decor';
  return migrated;
}

export function installBlockmartV9(ctx) {
  const $ = ctx.$;
  const getState = () => ctx.state;
  const setState = value => { ctx.state = value; };
  const getPlacement = () => ctx.placement;
  const setPlacement = value => { ctx.placement = value; };
  const getCustomers = () => ctx.customers;
  const setCustomers = value => { ctx.customers = value; };
  const getMeshes = () => ctx.meshes;
  const mapProducts = () => {
    for (const [id, product] of Object.entries(PRODUCT_DEFS)) {
      ctx.PRODUCTS[id] = { ...product, name: ctx.t(product.label, ctx.locale) };
    }
    ctx.PRODUCTS.snacks.name = ctx.t('cookies', ctx.locale);
    ctx.PRODUCTS.fizz.name = ctx.t('sparklingDrink', ctx.locale);
  };

  let selectedFloor = null;
  let selectedFixtureId = null;
  let selectedMarker = null;
  let ghostMesh = null;
  let selectionMesh = null;
  let pointerState = null;
  let pinchState = null;
  let cardDrag = null;
  let endpointEdit = null;
  let endpointMarkers = [];
  let previousFrame = 0;
  let lastQueueUpdate = 0;
  let recoveryTick = 0;
  let isInstalled = false;
  const stockDisplaySlots = new Map();
  let styledFloorTiles = null;

  const state = () => getState();
  const setSelectedFloor = point => {
    selectedFloor = copyPoint(point);
    updateSelectionMarker();
  };
  const fixtures = () => state().fixtures;
  const allCounters = () => fixtures().filter(f => f.kind === 'checkout').sort((a, b) => String(a.id).localeCompare(String(b.id)));
  const staffedCounters = () => allCounters().slice(0, state().cashierCount);
  const counterById = id => staffedCounters().find(f => f.id === id) || null;
  const decorativeCount = () => fixtures().filter(f => f.kind === 'decor').length;
  const currentDecorAppeal = () => decorAppeal(decorativeCount());

  function migrateCurrentState() {
    const migrated = migrateV9Save(state(), ctx.INITIAL);
    migrated.achievements = mergeAchievementStates(migrated.achievements, { events: ctx.readAchievementEvents?.() || [] });
    setState(migrated);
    mapProducts();
    if (!migrated.fixtures.some(f => f.kind === 'checkout')) {
      migrated.fixtures.unshift({ id: 'checkout-v9-safe-default', kind: 'checkout', x: 7, z: 1, rotation: 0, footprint: 'counter' });
      migrated.cashierCount = Math.max(1, migrated.cashierCount);
    }
    if (migrated.cashierCount < 1 && migrated.fixtures.some(f => f.kind === 'checkout')) migrated.cashierCount = 1;
    if (migrated.equipment.cooler && !migrated.coolerFixtureId) migrated.coolerFixtureId = migrated.fixtures.find(f => f.kind === 'cooler')?.id || null;
    if (migrated.equipment.fastCheckout && !migrated.fastCheckoutFixtureId) migrated.fastCheckoutFixtureId = migrated.fixtures.find(f => f.kind === 'fastCheckout')?.id || null;
    return migrated;
  }

  function dimensioned(fixture) {
    const size = footprintSize(fixture);
    return { width: size.width, depth: size.depth };
  }

  function walkable(x, z, ignoreId = null) {
    if (x < 0 || z < 0 || x >= state().area || z >= state().area) return false;
    return !fixtures().some(f => f.id !== ignoreId && occupiedTiles(f).some(tile => tile.x === x && tile.z === z));
  }

  function accessTiles(fixture) {
    const size = dimensioned(fixture);
    const candidates = [];
    for (let x = fixture.x; x < fixture.x + size.width; x++) {
      candidates.push({ x, z: fixture.z - 1 }, { x, z: fixture.z + size.depth });
    }
    for (let z = fixture.z; z < fixture.z + size.depth; z++) {
      candidates.push({ x: fixture.x - 1, z }, { x: fixture.x + size.width, z });
    }
    const seen = new Set();
    return candidates.filter(p => {
      const key = `${p.x},${p.z}`;
      if (seen.has(key) || !walkable(p.x, p.z)) return false;
      seen.add(key);
      return true;
    });
  }

  function findPath(start, goals, blocked = null, ignoreId = null) {
    if (!start || !goals?.length) return [];
    const key = (x, z) => `${x},${z}`;
    const normalizedGoals = goals.map(p => ({ x: Math.round(p.x), z: Math.round(p.z) }));
    const goalSet = new Set(normalizedGoals.filter(p => walkable(p.x, p.z, ignoreId) && !blocked?.(p.x, p.z)).map(p => key(p.x, p.z)));
    if (!goalSet.size) return [];
    const origin = { x: Math.round(start.x), z: Math.round(start.z) };
    const queue = [origin];
    const came = new Map([[key(origin.x, origin.z), null]]);
    let found = null;
    while (queue.length) {
      const point = queue.shift();
      const pointKey = key(point.x, point.z);
      if (goalSet.has(pointKey)) { found = point; break; }
      for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const x = point.x + dx, z = point.z + dz, nextKey = key(x, z);
        if (came.has(nextKey) || !walkable(x, z, ignoreId) || blocked?.(x, z)) continue;
        came.set(nextKey, pointKey); queue.push({ x, z });
      }
    }
    if (!found) return [];
    const path = [];
    let cursor = key(found.x, found.z);
    while (cursor && cursor !== key(origin.x, origin.z)) {
      const [x, z] = cursor.split(',').map(Number); path.unshift({ x, z }); cursor = came.get(cursor);
    }
    return path;
  }

  function routeToCheckout(blockedTiles = [], candidate = null, ignoreId = null, routeOverrides = {}) {
    const blocked = new Set(blockedTiles.map(p => `${p.x},${p.z}`));
    const counters = staffedCounters().filter(f => f.id !== ignoreId);
    // Validate a new or moved register as a full lane before anyone is hired for it.
    if (candidate?.kind === 'checkout' && !counters.some(counter => counter.id === candidate.id)) counters.push(candidate);
    if (!counters.length) return false;
    const goals = counters.map(counter => serviceFacingTarget(counter))
      .map(point => ({ x: Math.round(point.x), z: Math.round(point.z) }))
      .filter(point => !blocked.has(`${point.x},${point.z}`) && walkable(point.x, point.z, ignoreId));
    if (!goals.length) return false;
    const entrances = routeOverrides.entrances || (state().entrances?.length ? state().entrances : [GRID_ENTRANCES[0]]);
    const exits = routeOverrides.exits || (state().exits?.length ? state().exits : [{ x: state().area - 1, z: state().area - 1 }]);
    const canReach = (start, targets) => targets.some(goal => (start.x === goal.x && start.z === goal.z)
      || findPath(start, [goal], (x, z) => blocked.has(`${x},${z}`), ignoreId).length > 0);
    if (entrances.some(start => !walkable(start.x, start.z, ignoreId) || blocked.has(`${start.x},${start.z}`)
      || !canReach(start, goals))) return false;
    if (exits.some(exit => !walkable(exit.x, exit.z, ignoreId) || blocked.has(`${exit.x},${exit.z}`))) return false;
    if (entrances.some(start => !canReach(start, exits))) return false;
    if (goals.some(goal => !canReach(goal, exits))) return false;
    const queueCells = new Set();
    for (const counter of counters) {
      const service = serviceFacingTarget(counter);
      const serviceTile = { x: Math.round(service.x), z: Math.round(service.z) };
      for (let rank = 0; rank < QUEUE_LIMIT_PER_REGISTER; rank++) {
        const queue = queueTile(counter, rank);
        const key = `${queue.x},${queue.z}`;
        if (queueCells.has(key)) return false;
        queueCells.add(key);
        if (!walkable(queue.x, queue.z, ignoreId) || blocked.has(`${queue.x},${queue.z}`)
          || !canReach(queue, [serviceTile])) return false;
      }
    }
    return true;
  }

  function canPlaceFixture(x, z, ignoreId = null) {
    const current = getPlacement();
    const candidate = normalizeFixture({
      ...(current?.fixtureId ? fixtures().find(f => f.id === current.fixtureId) || state().warehouse.find(f => f.id === current.fixtureId) || {} : {}),
      kind: current?.kind || 'shelf', footprint: current?.footprint || 'single', rotation: current?.rotation || 0,
      x, z, id: ignoreId || current?.fixtureId || '__candidate__'
    });
    const protectedTiles = [...(state().entrances || []), ...(state().exits || [])];
    const conflict = footprintConflict(candidate, fixtures(), state().area, ignoreId || current?.fixtureId, protectedTiles);
    if (conflict) return false;
    const tiles = occupiedTiles(candidate);
    return routeToCheckout(tiles, candidate, ignoreId || current?.fixtureId);
  }

  function fixtureAt(point) {
    if (!point) return null;
    return fixtures().find(f => occupiedTiles(f).some(tile => tile.x === point.x && tile.z === point.z)) || null;
  }

  function fixtureCost(kind, footprint = 'single') {
    if (kind === 'shelf') return footprint === 'double' ? 120 : 70;
    if (kind === 'checkout') return REGISTER_COST;
    if (kind === 'cooler') return 180;
    if (kind === 'fastCheckout') return 150;
    if (kind === 'decor') return 0;
    return 0;
  }

  function currentPlacementCandidate() {
    const p = getPlacement();
    if (!p) return null;
    const old = p.fixtureId ? fixtures().find(f => f.id === p.fixtureId) || state().warehouse.find(f => f.id === p.fixtureId) : null;
    return normalizeFixture({ ...(old || {}), id: p.fixtureId || '__candidate__', kind: p.kind,
      footprint: p.footprint || (p.kind === 'cooler' ? 'cooler' : p.kind === 'checkout' ? 'counter' : 'single'),
      rotation: p.rotation || 0, product: p.product || 'water', x: p.point?.x ?? -999, z: p.point?.z ?? -999 });
  }

  function placementReason(point) {
    if (!point) return ctx.t('selectFloorFirst', ctx.locale);
    const p = currentPlacementCandidate();
    p.x = point.x; p.z = point.z;
    const protectedTiles = [...(state().entrances || []), ...(state().exits || [])];
    const conflict = footprintConflict(p, fixtures(), state().area, getPlacement()?.fixtureId, protectedTiles);
    if (conflict === 'outside') return ctx.t('placementOutside', ctx.locale);
    if (conflict === 'entrance') return ctx.t('placementEntry', ctx.locale);
    if (conflict === 'route') return ctx.t('placementEntry', ctx.locale);
    if (conflict === 'occupied') return ctx.t('placementOccupied', ctx.locale);
    if (!routeToCheckout(occupiedTiles(p), p, getPlacement()?.fixtureId)) return ctx.t('placementRoute', ctx.locale);
    const requiresPurchase = !getPlacement()?.fixtureId || p.kind === 'cooler' && !state().equipment.cooler;
    if (requiresPurchase && state().cash < fixtureCost(p.kind, p.footprint) && p.kind !== 'decor') return ctx.t('needMoreCash', ctx.locale);
    if (p.kind === 'decor' && state().diamond < 1) return ctx.t('needMoreCash', ctx.locale);
    return ctx.t('placementValid', ctx.locale);
  }

  function updatePlacementUi() {
    if (endpointEdit) {
      const title = ctx.t(endpointEdit.kind === 'entrance' ? 'entrance' : 'exit', ctx.locale);
      $('placementControls').hidden = false;
      $('placementProduct').hidden = true; $('placementFootprint').hidden = true; $('rotatePlacement').hidden = true;
      document.querySelector('label[for=placementProduct]').hidden = true;
      document.querySelector('label[for=placementFootprint]').hidden = true;
      const valid = Boolean(endpointEdit.valid);
      $('placementStatus').classList.toggle('invalid', Boolean(endpointEdit.point && !valid));
      $('placementStatus').textContent = endpointEdit.point
        ? (valid ? `${title} · ${ctx.t('routeOpen', ctx.locale)}` : ctx.t('routeBlocked', ctx.locale))
        : `${ctx.t(endpointEdit.kind === 'entrance' ? 'setEntrance' : 'setExit', ctx.locale)} · ${ctx.t('endpointPickHint', ctx.locale)}`;
      $('confirmPlacement').textContent = ctx.t(endpointEdit.kind === 'entrance' ? 'setEntrance' : 'setExit', ctx.locale);
      $('confirmPlacement').disabled = !valid;
      return;
    }
    const p = getPlacement();
    if (!p) return;
    p.valid = Boolean(p.point && canPlaceFixture(p.point.x, p.point.z, p.fixtureId));
    const reason = placementReason(p.point);
    $('placementStatus').textContent = reason;
    $('placementStatus').classList.toggle('invalid', !p.valid);
    $('confirmPlacement').disabled = !p.valid;
    const requiresPurchase = !p.fixtureId || p.kind === 'cooler' && !state().equipment.cooler;
    const cost = requiresPurchase ? ctx.price(fixtureCost(p.kind, p.footprint)) : ctx.t('placeFree', ctx.locale);
    $('confirmPlacement').textContent = `${ctx.t('confirmPlace', ctx.locale)} · ${cost}`;
    if (ghostMesh) {
      ghostMesh.visible = Boolean(p.point);
      if (p.point) {
        const size = footprintSize(currentPlacementCandidate());
        ghostMesh.geometry.dispose();
        ghostMesh.geometry = new THREE.BoxGeometry(Math.max(.84, size.width * CELL_SIZE), .045, Math.max(.84, size.depth * CELL_SIZE));
        ghostMesh.position.set(p.point.x + (size.width - 1) / 2, .13, p.point.z + (size.depth - 1) / 2);
        ghostMesh.rotation.y = p.rotation * Math.PI / 2;
        ghostMesh.material.color.set(p.valid ? 0x19a975 : 0xe34949);
      }
    }
    updateSelectionMarker();
  }

  function updateSelectionMarker() {
    if (selectionMesh) {
      selectionMesh.visible = Boolean(selectedFloor);
      if (selectedFloor) selectionMesh.position.set(selectedFloor.x, .105, selectedFloor.z);
    }
  }

  function syncFixtures() {
    if (!ctx.scene) return;
    for (const group of getMeshes().values()) {
      ctx.scene.remove(group); group.traverse(object => object.geometry?.dispose());
    }
    getMeshes().clear();
    stockDisplaySlots.clear();
    fixtures().forEach(fixture => fixtureGroup(fixture));
    syncLayoutMarkers();
    syncStockDisplays();
    applyFloorArt();
    if (ghostMesh) { ctx.scene.remove(ghostMesh); ghostMesh.geometry.dispose(); ghostMesh.material.dispose(); }
    ghostMesh = new THREE.Mesh(new THREE.BoxGeometry(1, .045, 1), new THREE.MeshBasicMaterial({ color: 0x19a975, transparent: true, opacity: .55, depthWrite: false }));
    ghostMesh.visible = false; ghostMesh.position.y = .13; ctx.scene.add(ghostMesh); ctx.setGhost(ghostMesh);
    if (selectionMesh) { ctx.scene.remove(selectionMesh); selectionMesh.geometry.dispose(); selectionMesh.material.dispose(); }
    selectionMesh = new THREE.Mesh(new THREE.BoxGeometry(.96, .025, .96), new THREE.MeshBasicMaterial({ color: 0xffcc45, transparent: true, opacity: .48, depthWrite: false }));
    selectionMesh.visible = false; ctx.scene.add(selectionMesh); updateSelectionMarker();
  }

  function fixtureGroup(fixture) {
    const normalized = normalizeFixture(fixture), size = baseFootprint(normalized);
    const worldSize = footprintSize(normalized), center = fixtureCenter(normalized);
    const group = new THREE.Group();
    group.position.set(center.x, 0, center.z); group.rotation.y = normalized.rotation * Math.PI / 2;
    // Increase built-in fixture presence without changing grid footprints,
    // placement bounds, or walkable tiles.
    group.scale.set(1.06, 1.24, 1.06);
    group.userData.fixture = normalized.id; group.userData.kind = normalized.kind;
    const width = size.width, depth = size.depth;
    const block = (name, color, x, y, z, sx, sy, sz) => ctx.cube(group, name, color, x, y, z, sx, sy, sz);
    if (normalized.kind === 'shelf') {
      block('shelf-footprint', 0x365b55, 0, .14, 0, Math.max(.9, width * .9), .16, Math.max(.9, depth * .9));
      block('shelf-left-post', 0x234a4a, -width * .37, 1.06, 0, .13, 1.82, depth * .78);
      block('shelf-right-post', 0x234a4a, width * .37, 1.06, 0, .13, 1.82, depth * .78);
      const sku = ctx.PRODUCTS[normalized.product] ? normalized.product : 'water';
      const catalog = PRODUCT_DEFS[sku];
      const slots = [];
      const stockRoot = new THREE.Group();
      stockRoot.name = `stock-display-${normalized.id}`;
      group.add(stockRoot);
      for (const y of [.45, 1, 1.55]) {
        block('shelf-board', 0xe0b768, 0, y, 0, width * .9, .14, depth * .84);
        for (let i = 0; i < 3; i++) {
          const x = (i - 1) * Math.min(.32, width * .32);
          slots.push({ group: createDisplayUnit(stockRoot, sku, x, y + .16, 0), sku });
        }
      }
      stockDisplaySlots.set(normalized.id, { kind: 'shelf', sku, slots });
      block('shelf-sign', 0x123842, 0, 2.22, depth * .44, width * .76, .2, .08);
      block('shelf-sign-color', catalog.color, 0, 2.22, depth * .49, width * .32, .08, .03);
    } else if (normalized.kind === 'checkout') {
      block('checkout-counter', 0xb9864f, 0, .64, 0, .9, .82, .88);
      block('checkout-front', 0x285965, 0, .4, .46, .78, .48, .08);
      block('checkout-display', 0x7ed5b6, 0, 1.12, -.13, .36, .24, .3);
      block('checkout-conveyor', 0x465e63, 0, 1.03, .19, .7, .06, .42);
      block('checkout-light', staffedCounters().some(f => f.id === normalized.id) ? 0x61ca83 : 0xd55b50, .35, 1.1, -.32, .12, .12, .12);
      if (staffedCounters().some(f => f.id === normalized.id)) addCashierModel(block);
    } else if (normalized.kind === 'fastCheckout') {
      block('checkout-upgrade', 0x426d79, 0, .55, 0, .82, .75, .68);
      block('checkout-display', 0x9be4cf, 0, .98, .12, .48, .22, .12);
      block('checkout-beam', 0xffd76c, 0, 1.14, .12, .48, .05, .12);
    } else if (normalized.kind === 'cooler') {
      block('cooler-footprint', 0x567e80, 0, .15, 0, 1.88, .17, 1.88);
      block('cooler-case', 0x315f6d, 0, .96, 0, 1.88, 1.62, 1.88);
      block('cooler-door', 0xa8d6d6, 0, .98, .97, 1.28, 1.28, .07);
      block('cooler-handle', 0xf0c46f, .55, .98, 1.02, .07, .38, .1);
      const stockRoot = new THREE.Group();
      stockRoot.name = `stock-display-${normalized.id}`;
      group.add(stockRoot);
      const slots = [];
      for (let shelf = 0; shelf < 3; shelf++) {
        block('cooler-shelf', 0x173e4c, 0, .38 + shelf * .45, .82, 1.3, .09, .14);
        for (const x of [-.34, .34]) slots.push({ parent: stockRoot, x, y: .57 + shelf * .45, z: 1.16, group: null, sku: null });
      }
      stockDisplaySlots.set(normalized.id, { kind: 'cooler', slots });
    } else if (normalized.kind === 'decor') {
      block('decor-pot', 0xb47e58, 0, .18, 0, .7, .34, .7);
      block('decor-stem', 0x588e57, 0, .55, 0, .15, .54, .15);
      block('decor-leaf-a', 0x7fb65d, -.2, .82, 0, .42, .34, .27);
      block('decor-leaf-b', 0x65a34c, .2, .95, .08, .42, .3, .28);
      block('decor-leaf-c', 0x98c866, 0, 1.12, -.04, .38, .32, .3);
    }
    group.traverse(object => { if (object.isMesh) { object.castShadow = true; object.receiveShadow = true; } });
    ctx.scene.add(group); getMeshes().set(normalized.id, group); return group;
  }

  function syncLayoutMarkers() {
    if (!ctx.scene) return;
    for (const marker of endpointMarkers) {
      ctx.scene.remove(marker);
      marker.traverse(object => object.geometry?.dispose());
    }
    endpointMarkers = [];
    const addMarker = (kind, point) => {
      const entrance = kind === 'entrance';
      const color = entrance ? 0x087c6a : 0xd78a2c;
      const group = new THREE.Group();
      group.name = `store-${kind}-${point.x}-${point.z}`;
      group.position.set(point.x, 0, point.z);
      const block = (name, x, y, z, sx, sy, sz, paint = color) => ctx.cube(group, name, paint, x, y, z, sx, sy, sz);
      block(`${kind}-left-post`, -.36, .5, 0, .12, 1, .12);
      block(`${kind}-right-post`, .36, .5, 0, .12, 1, .12);
      block(`${kind}-lintel`, 0, 1, 0, .84, .14, .14);
      block(`${kind}-threshold`, 0, .13, 0, .86, .12, .86, entrance ? 0x56c7a0 : 0xe5af58);
      const sign = block(`${kind}-sign`, 0, 1.25, 0, .54, .2, .1, entrance ? 0x164b48 : 0x74441c);
      sign.userData.endpointLabel = kind;
      ctx.scene.add(group);
      endpointMarkers.push(group);
    };
    for (const point of state().entrances || []) addMarker('entrance', point);
    for (const point of state().exits || []) addMarker('exit', point);
  }

  function createDisplayUnit(parent, sku, x, y, z) {
    const unit = new THREE.Group();
    unit.name = `stock-unit-${sku}`;
    unit.userData.productSku = sku;
    unit.position.set(x, y, z);
    parent.add(unit);
    const block = (name, color, px, py, pz, sx, sy, sz) => ctx.cube(unit, name, color, px, py, pz, sx, sy, sz);
    const catalog = PRODUCT_DEFS[sku];
    addDisplayItem(block, sku, catalog.display, 0, 0, 0, catalog.color);
    return unit;
  }

  function syncStockDisplays() {
    const remaining = Object.fromEntries(Object.keys(PRODUCT_DEFS).map(id => [id, Math.max(0, Math.floor(state().stock?.[id] || 0))]));
    for (const fixture of fixtures()) {
      const display = stockDisplaySlots.get(fixture.id);
      if (display?.kind !== 'shelf') continue;
      for (const slot of display.slots) {
        const visible = remaining[display.sku] > 0;
        slot.group.visible = visible;
        if (visible) remaining[display.sku]--;
      }
    }
    const productOrder = Object.keys(PRODUCT_DEFS);
    const coolerSlots = fixtures().flatMap(fixture => {
      const display = stockDisplaySlots.get(fixture.id);
      return display?.kind === 'cooler' ? display.slots : [];
    });
    const coolerStock = [];
    while (coolerStock.length < coolerSlots.length) {
      let added = false;
      for (const sku of productOrder) {
        if (remaining[sku] <= 0) continue;
        coolerStock.push(sku);
        remaining[sku]--;
        added = true;
        if (coolerStock.length >= coolerSlots.length) break;
      }
      if (!added) break;
    }
    coolerSlots.forEach((slot, index) => {
      const sku = coolerStock[index] || null;
      if (slot.sku !== sku) {
        if (slot.group) {
          slot.parent.remove(slot.group);
          slot.group.traverse(object => object.geometry?.dispose());
          slot.group = null;
        }
        slot.sku = sku;
        if (sku) slot.group = createDisplayUnit(slot.parent, sku, slot.x, slot.y, slot.z);
      }
      if (slot.group) slot.group.visible = Boolean(sku);
    });
  }

  function applyFloorArt() {
    const floor = ctx.scene?.getObjectByName('floor-tiles');
    if (!floor || floor === styledFloorTiles || typeof floor.setColorAt !== 'function') return;
    const colors = [0x7b9484, 0x779080];
    let index = 0;
    for (let x = 0; x < state().area; x++) {
      for (let z = 0; z < state().area; z++) {
        const entrance = x < 2 && z < 2;
        const checkout = fixtures().some(f => f.kind === 'checkout' && Math.round(f.x) === x && Math.round(f.z) === z);
        const color = entrance ? 0xc7a15c : checkout ? 0x4f8882 : colors[(x + z) % colors.length];
        floor.setColorAt(index++, new THREE.Color(color));
      }
    }
    if (floor.instanceColor) floor.instanceColor.needsUpdate = true;
    styledFloorTiles = floor;
  }

  function fitCameraToShop() {
    const camera = ctx.camera;
    if (!camera || camera.userData.blockmartArtFit) return;
    const updateProjectionMatrix = camera.updateProjectionMatrix.bind(camera);
    camera.updateProjectionMatrix = function updateBlockmartProjection() {
      const angle = (Number(state().view) || 0) + VISUAL_CAMERA_YAW;
      const area = Math.max(10, Number(state().area) || 10);
      const horizontal = Math.abs(this.right - this.left);
      const vertical = Math.abs(this.top - this.bottom);
      const floorCenter = (area - 1) / 2;
      const placedFixtures = fixtures();
      const corners = placedFixtures.length ? [] : [
        [-.5, -.5], [-.5, area - .5], [area - .5, -.5], [area - .5, area - .5]
      ];
      for (const fixture of placedFixtures) {
        const size = footprintSize(fixture);
        const minX = fixture.x - .5, minZ = fixture.z - .5;
        const maxX = fixture.x + size.width - .5, maxZ = fixture.z + size.depth - .5;
        corners.push([minX, minZ], [minX, maxZ], [maxX, minZ], [maxX, maxZ]);
      }
      const rightX = Math.cos(angle), rightZ = -Math.sin(angle);
      const forwardX = Math.sin(angle), forwardZ = Math.cos(angle);
      const rightProjection = corners.map(([x, z]) => x * rightX + z * rightZ);
      const forwardProjection = corners.map(([x, z]) => x * forwardX + z * forwardZ);
      const horizontalSpan = Math.max(...rightProjection) - Math.min(...rightProjection) + 1.2;
      const cameraHeight = Math.max(.1, Math.abs(this.position.y - VISUAL_CAMERA_FOCUS_HEIGHT));
      const panX = Number(state().panX) || 0, panZ = Number(state().panZ) || 0;
      const baseX = floorCenter + panX, baseZ = floorCenter + panZ;
      const horizontalDistance = 19;
      const elevation = Math.atan2(cameraHeight, Math.max(.1, horizontalDistance));
      const verticalSpan = (Math.max(...forwardProjection) - Math.min(...forwardProjection)) * Math.sin(elevation) + 3.2 * Math.cos(elevation);
      const fitZoom = Math.min(horizontal / horizontalSpan, vertical / verticalSpan) * .95;
      const rightCenter = (Math.max(...rightProjection) + Math.min(...rightProjection)) / 2;
      const forwardCenter = (Math.max(...forwardProjection) + Math.min(...forwardProjection)) / 2;
      const rightOffset = rightCenter - (floorCenter * rightX + floorCenter * rightZ);
      const forwardOffset = forwardCenter - (floorCenter * forwardX + floorCenter * forwardZ);
      const focusX = baseX + rightX * rightOffset + forwardX * forwardOffset;
      const focusZ = baseZ + rightZ * rightOffset + forwardZ * forwardOffset;
      this.position.x = focusX + forwardX * horizontalDistance;
      this.position.z = focusZ + forwardZ * horizontalDistance;
      this.lookAt(focusX, VISUAL_CAMERA_FOCUS_HEIGHT, focusZ);
      this.zoom = Math.max(.5, Number(state().zoom) || 1) * Math.min(2.1, fitZoom);
      return updateProjectionMatrix();
    };
    camera.userData.blockmartArtFit = true;
    camera.updateProjectionMatrix();
  }

  function addDisplayItem(block, sku, display, x, y, z, color) {
    const size = sku === 'snacks' || sku === 'chips' ? .25 : .23;
    const itemBlock = (name, itemColor, ix, iy, iz, sx, sy, sz) =>
      block(name, itemColor, ix, iy, iz, sx * 1.6, sy * 1.6, sz * 1.6);
    if (display === 'water') {
      itemBlock('water-crate', 0x3f8ea7, x, y, z, size * 1.15, .2, .17);
      itemBlock('water-bottle', 0x66cce0, x, y + .18, z, .11, .23, .1);
      itemBlock('water-cap', 0xf7f7e8, x, y + .32, z, .08, .05, .08);
    } else if (display === 'cookies') {
      itemBlock('cookie-packet', 0xd18838, x, y, z, .22, .29, .16);
      itemBlock('cookie-seal', 0xf0c063, x, y + .17, z + .09, .18, .09, .025);
      itemBlock('cookie-mark', 0x764122, x, y + .16, z + .11, .07, .07, .025);
    } else if (display === 'chips') {
      itemBlock('chips-bag', color, x, y, z, .2, .31, .16);
      itemBlock('chips-top', 0xffe575, x, y + .17, z + .09, .19, .08, .025);
      itemBlock('chips-logo', 0xfff3cb, x, y - .02, z + .095, .1, .07, .025);
    } else if (display === 'juice') {
      itemBlock('juice-carton', color, x, y, z, .19, .3, .17);
      itemBlock('juice-top', 0xffd190, x, y + .17, z, .2, .06, .18);
      itemBlock('juice-straw', 0xf4f0d6, x + .055, y + .24, z + .02, .035, .15, .035);
      itemBlock('juice-label', 0xffedc7, x, y, z + .095, .12, .1, .025);
    } else {
      itemBlock('sparkling-can', color, x, y, z, .17, .31, .17);
      itemBlock('sparkling-band', 0xe5eff0, x, y - .01, z + .09, .15, .08, .025);
      itemBlock('sparkling-top', 0xbac9cd, x, y + .17, z, .17, .035, .17);
    }
  }

  function addCashierModel(block) {
    block('cashier-body', 0x258b78, -.1, 1.56, -.43, .38, .5, .35);
    block('cashier-head', 0xb88d6a, -.1, 1.98, -.43, .35, .34, .35);
    block('cashier-cap', 0x315f6c, -.1, 2.19, -.43, .4, .1, .38);
    block('cashier-face', 0xffdfb9, -.1, 1.96, -.245, .2, .14, .035);
  }

  function countersWithCandidate(candidate = null) {
    const counters = [...staffedCounters()];
    if (candidate?.kind === 'checkout' && counters.length < state().cashierCount) counters.push(candidate);
    return counters;
  }

  function queueLine(counter) {
    return getCustomers().filter(customer => customer.checkoutId === counter.id
      && (customer.state === 'queue' || customer.state === 'pay'))
      .sort((a, b) => a.queueSequence - b.queueSequence);
  }

  function queueSpotFor(counter, rank) {
    const spot = queueTile(counter, rank);
    return walkable(spot.x, spot.z) ? spot : null;
  }

  function queueRank(customer) {
    const counter = counterById(customer.checkoutId);
    return counter ? queueLine(counter).indexOf(customer) : -1;
  }

  function assignQueueSpot(customer) {
    const counter = counterById(customer.checkoutId);
    if (!counter) return false;
    const rank = queueRank(customer);
    if (rank < 0 || rank >= QUEUE_LIMIT_PER_REGISTER) return false;
    const spot = queueSpotFor(counter, rank);
    if (!spot) return false;
    if (customer.queueSpot?.x === spot.x && customer.queueSpot?.z === spot.z && customer.path?.length) return true;
    customer.queueSpot = spot;
    customer.path = findPath({ x: customer.x, z: customer.z }, [spot]);
    customer.pathAt = 0; customer.segment = null; customer.queueRank = rank;
    if (!customer.path.length && (customer.x !== spot.x || customer.z !== spot.z)) return false;
    return true;
  }

  function updateQueueLines() {
    for (const counter of staffedCounters()) {
      for (const customer of queueLine(counter)) assignQueueSpot(customer);
    }
    lastQueueUpdate = performance.now();
  }

  function routeCustomerOut(customer) {
    const exits = (state().exits?.length ? state().exits : [{ x: state().area - 1, z: state().area - 1 }])
      .filter(point => walkable(point.x, point.z));
    const paths = exits.map(point => findPath({ x: customer.x, z: customer.z }, [point]));
    const path = paths.filter(candidate => candidate.length).sort((a, b) => a.length - b.length)[0] || [];
    customer.path = path; customer.pathAt = 0; customer.segment = null;
    customer.exitAt = path.length ? null : performance.now();
    customer.state = 'leave';
  }

  function notifyAchievementUnlocks(ids) {
    if (!ids.length) return;
    let notice = document.querySelector('.achievement-notice');
    if (!notice) {
      notice = document.createElement('div');
      notice.className = 'achievement-notice';
      notice.setAttribute('role', 'status');
      notice.setAttribute('aria-live', 'polite');
      notice.hidden = true;
      document.body.append(notice);
    }
    const names = ids.map(id => {
      const achievement = ACHIEVEMENT_CATALOG.find(item => item.id === id);
      return achievement ? ctx.t(`achievement_${achievement.id}`, ctx.locale) : '';
    }).filter(Boolean);
    notice.textContent = `${ctx.t('achievementUnlocked', ctx.locale)} · ${names.join(' · ')}`;
    notice.hidden = false;
    clearTimeout(notice.hideTimer);
    notice.hideTimer = setTimeout(() => { notice.hidden = true; }, 3200);
  }

  function settleAchievementEvent(data) {
    const id = globalThis.crypto?.randomUUID?.() || `ab-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    const result = recordAchievementEvent(state().achievements, { id, ...data });
    if (!result.accepted) return;
    ctx.persistAchievementEvent?.(result.state.events.find(event => event.id === id));
    state().achievements = mergeAchievementStates(result.state, { events: ctx.readAchievementEvents?.() || [] });
    notifyAchievementUnlocks(result.newlyUnlocked);
    ctx.save();
    if (ctx.selectedTab === 'achievements') renderPanel();
  }

  function renderAchievements() {
    const stateValue = state().achievements;
    const progress = achievementProgress(stateValue);
    const heading = document.createElement('section');
    heading.className = 'achievement-heading';
    const title = document.createElement('h2'); title.textContent = ctx.t('achievementsTitle', ctx.locale);
    const intro = document.createElement('p'); intro.textContent = ctx.t('achievementsIntro', ctx.locale);
    heading.append(title, intro); $('panel').append(heading);
    const back = document.createElement('button');
    back.type = 'button'; back.className = 'achievement-back';
    back.textContent = `‹  ${ctx.t('achievementBack', ctx.locale)}`;
    back.addEventListener('click', () => { ctx.selectedTab = 'shop'; renderPanel(); });
    $('panel').append(back);
    for (const achievement of ACHIEVEMENT_CATALOG) {
      const current = progress[achievement.id];
      const complete = current >= achievement.target;
      const title = document.createElement('h3'); title.textContent = ctx.t(`achievement_${achievement.id}`, ctx.locale);
      const detail = document.createElement('p');
      detail.textContent = `${ctx.t('achievementReward', ctx.locale)} · ${complete
        ? ctx.t('achievementCollected', ctx.locale) : ctx.t('achievementInProgress', ctx.locale)}`;
      const amount = achievement.id === 'gross_1000' ? ctx.price(Math.min(current, achievement.target))
        : achievement.id === 'expansion_13' ? (current >= achievement.target ? '13 × 13' : '10 × 10 → 13 × 13')
          : `${Math.min(current, achievement.target)} / ${achievement.target}`;
      const row = document.createElement('article'); row.className = `achievement-row${complete ? ' is-collected' : ''}`;
      row.dataset.achievementId = achievement.id;
      row.setAttribute('aria-label', `${title.textContent}: ${amount}. ${detail.textContent}`);
      const badge = document.createElement('span'); badge.className = 'achievement-badge'; badge.setAttribute('aria-hidden', 'true'); badge.textContent = complete ? '🏅' : '◇';
      const copy = document.createElement('div'); copy.className = 'achievement-copy'; copy.append(title, detail);
      const status = document.createElement('strong'); status.className = 'achievement-status'; status.textContent = `${complete ? '✓' : '○'} ${amount}`;
      const meter = document.createElement('progress'); meter.className = 'achievement-progress'; meter.max = achievement.target;
      meter.value = Math.min(current, achievement.target); meter.setAttribute('aria-label', title.textContent);
      row.append(badge, copy, status, meter);
      $('panel').append(row);
    }
  }

  function stopCustomerVisit(customer, reason = 'queue') {
    let restoredStock = false;
    if (customer.carried && customer.product && state().stock[customer.product] !== undefined) {
      state().stock[customer.product]++;
      customer.carried = false;
      restoredStock = true;
    }
    state().popularity = popularityAfterWalkout(state().popularity);
    customer.exitReason = reason;
    routeCustomerOut(customer);
    ctx.save();
    if (restoredStock) syncStockDisplays();
    refreshHud();
  }

  function nearestCounter(customer) {
    return staffedCounters().map(counter => ({
      counter,
      line: queueLine(counter),
      spot: queueSpotFor(counter, queueLine(counter).length),
      path: []
    })).filter(item => item.line.length < QUEUE_LIMIT_PER_REGISTER && item.spot)
      .map(item => ({ ...item, path: findPath({ x: customer.x, z: customer.z }, [item.spot]) }))
      .filter(item => item.path.length || (customer.x === item.spot.x && customer.z === item.spot.z))
      .sort((a, b) => a.line.length - b.line.length || a.path.length - b.path.length)[0] || null;
  }

  function targetCheckout(customer) {
    const target = nearestCounter(customer);
    if (!target) return false;
    customer.checkoutId = target.counter.id;
    customer.queueSequence = state().nextQueueSequence++;
    customer.queueWait = 0;
    customer.wait = 0;
    customer.state = 'queue';
    customer.path = target.path;
    customer.pathAt = 0; customer.segment = null;
    customer.queueSpot = target.spot;
    updateQueueLines();
    return true;
  }

  function routeToShelf(customer, shelf) {
    const path = findPath({ x: customer.x, z: customer.z }, accessTiles(shelf));
    if (!path.length && !accessTiles(shelf).some(p => p.x === customer.x && p.z === customer.z)) return false;
    customer.target = shelf; customer.path = path; customer.pathAt = 0;
    customer.state = 'browse'; customer.wait = 0; customer.segment = null;
    return true;
  }

  function unlockedProducts() {
    const lifetime = state().lifetime;
    if (lifetime >= 280 && !state().unlocked.includes('juice')) state().unlocked.push('juice');
    if (lifetime >= 1000 && !state().unlocked.includes('fizz')) state().unlocked.push('fizz');
    return state().unlocked;
  }

  function chooseProduct(budget) {
    const unlocked = new Set(unlockedProducts());
    const stockedShelves = new Set(fixtures().filter(f => f.kind === 'shelf').map(f => f.product));
    const available = Object.keys(PRODUCT_DEFS).filter(id => unlocked.has(id) && stockedShelves.has(id)
      && state().stock[id] > 0 && ctx.PRODUCTS[id].price <= budget);
    if (!available.length) return null;
    const weights = available.map(id => PRODUCT_DEFS[id].demand);
    let sample = Math.random() * weights.reduce((sum, weight) => sum + weight, 0);
    for (let i = 0; i < available.length; i++) { sample -= weights[i]; if (sample <= 0) return available[i]; }
    return available[0];
  }

  function spawn() {
    const entries = (state().entrances?.length ? state().entrances : GRID_ENTRANCES)
      .filter(point => walkable(point.x, point.z));
    if (!entries.length) return;
    const point = entries[Math.floor(Math.random() * entries.length)];
    const kinds = [['rabbit', 0xf1d5c1], ['bear', 0xad825f], ['fox', 0xe78c5c], ['cat', 0xb2a4cc]];
    const kind = kinds[ctx.customerId++ % kinds.length];
    const group = ctx.makeAnimal(kind[0], kind[1]);
    group.position.set(point.x, 0, point.z); group.scale.setScalar(1.2); ctx.scene.add(group);
    const budget = ctx.customerBudget();
    const customer = { id: ctx.customerId, group, x: point.x, z: point.z, product: chooseProduct(budget),
      state: 'enter', path: [], pathAt: 0, wait: Math.random() * .6, budget, queue: 0,
      queueWait: 0, queueSequence: 0, segment: null, carried: false };
    getCustomers().push(customer);
    if (customer.product) {
      const shelves = fixtures().filter(f => f.kind === 'shelf' && f.product === customer.product && accessTiles(f).length);
      const shelf = shelves[Math.floor(Math.random() * shelves.length)];
      if (!shelf || !routeToShelf(customer, shelf)) routeCustomerOut(customer);
    } else routeCustomerOut(customer);
  }

  function headingTarget(customer) {
    if (customer.segment) return Math.atan2(customer.segment.to.x - customer.segment.from.x, customer.segment.to.z - customer.segment.from.z);
    if (customer.state === 'queue' || customer.state === 'pay') {
      const counter = counterById(customer.checkoutId);
      if (counter) {
        const rank = Math.max(0, queueRank(customer));
        const target = rank > 0 ? queueTile(counter, rank - 1) : fixtureCenter(counter);
        return Math.atan2(target.x - customer.x, target.z - customer.z);
      }
    }
    if (customer.state === 'browse' && customer.target) {
      const center = fixtureCenter(customer.target);
      return Math.atan2(center.x - customer.x, center.z - customer.z);
    }
    if (customer.pathAt < customer.path.length) {
      const destination = customer.path[customer.pathAt];
      return Math.atan2(destination.x - customer.x, destination.z - customer.z);
    }
    return customer.group.rotation.y;
  }

  function moveCustomer(customer, delta) {
    if (customer.pathAt >= customer.path.length) return false;
    if (!customer.segment) customer.segment = { from: { x: customer.x, z: customer.z }, to: customer.path[customer.pathAt], progress: 0, duration: .3 };
    const segment = customer.segment;
    segment.progress = Math.min(segment.duration, segment.progress + delta);
    const ratio = segment.progress / segment.duration;
    customer.group.position.set(THREE.MathUtils.lerp(segment.from.x, segment.to.x, ratio), 0, THREE.MathUtils.lerp(segment.from.z, segment.to.z, ratio));
    if (segment.progress >= segment.duration) {
      customer.x = segment.to.x; customer.z = segment.to.z; customer.pathAt++; customer.segment = null;
      if (customer.pathAt >= customer.path.length && customer.state === 'browse') customer.wait = ctx.browseSeconds(ctx.activeEquipment());
    }
    return true;
  }

  function settleSale(customer) {
    const product = ctx.PRODUCTS[customer.product];
    if (!product) { stopCustomerVisit(customer, 'invalid-product'); return; }
    const sale = ctx.applySaleRevenue(state(), product.price);
    setState(ctx.appendCashLedger(sale.state, { kind: 'sale', amount: sale.netRevenue,
      debtChange: -sale.debtPayment, product: customer.product, quantity: 1,
      queueWaitSeconds: Number.isFinite(customer.queueWait) ? customer.queueWait : 0 }));
    state().lifetime += sale.grossRevenue; state().transactions++;
    state().popularity = popularityAfterWait(state().popularity, customer.queueWait, QUEUE_PATIENCE_SECONDS);
    state().popularity = clampPopularity(state().popularity + 1 + currentDecorAppeal() * .025);
    if (!state().milestones.firstSale) { state().milestones.firstSale = true; state().diamond++; }
    unlockedProducts();
    settleAchievementEvent({ type: 'sale_settled', productId: customer.product,
      grossAmount: sale.grossRevenue, queueWaitSeconds: Number.isFinite(customer.queueWait) ? customer.queueWait : 0 });
    ctx.showSale(sale.netRevenue);
    if (sale.debtPayment) ctx.toast(`${ctx.t('recoveryPayment', ctx.locale)} · ${ctx.price(sale.debtPayment)}`);
    ctx.save(); refreshHud(); routeCustomerOut(customer); customer.remove = 0;
    updateQueueLines(); ctx.renderPanel();
  }

  function updateCustomer(customer, delta) {
    if (customer.state === 'done') {
      customer.remove = (customer.remove || 0) + delta;
      return customer.remove < .45;
    }
    if (customer.state === 'leave') {
      if (customer.pathAt < customer.path.length) moveCustomer(customer, delta);
      else { customer.fade = (customer.fade || 0) + delta; if (customer.fade > .35) { ctx.scene.remove(customer.group); return false; } }
    } else if (customer.state === 'browse') {
      if (customer.pathAt < customer.path.length) moveCustomer(customer, delta);
      else {
        customer.wait -= delta;
        if (customer.wait <= 0) {
          const product = ctx.PRODUCTS[customer.product];
          if (!product || state().stock[customer.product] <= 0 || product.price > customer.budget || !targetCheckout(customer)) stopCustomerVisit(customer, 'no-register');
          else { state().stock[customer.product]--; customer.carried = true; syncStockDisplays(); ctx.renderPanel(); }
        }
      }
    } else if (customer.state === 'queue') {
      customer.queueWait = (customer.queueWait || 0) + delta;
      customer.queue = customer.queueWait;
      const counter = counterById(customer.checkoutId);
      if (!counter) stopCustomerVisit(customer, 'unavailable-register');
      else {
        const rank = queueRank(customer);
        if (rank < 0 || !assignQueueSpot(customer)) stopCustomerVisit(customer, 'blocked-queue');
        else if (customer.pathAt < customer.path.length) moveCustomer(customer, delta);
        else if (rank === 0 && !getCustomers().some(other => other !== customer && other.checkoutId === customer.checkoutId && other.state === 'pay')) {
          customer.state = 'pay'; customer.wait = STAFFED_QUEUE_SECONDS; customer.serviceCounter = counter;
        }
        if (customer.state === 'queue' && customer.queueWait >= QUEUE_PATIENCE_SECONDS) stopCustomerVisit(customer, 'queue');
      }
    } else if (customer.state === 'pay') {
      const counter = counterById(customer.checkoutId);
      if (!counter) stopCustomerVisit(customer, 'unavailable-register');
      else {
        customer.wait -= delta;
        if (customer.wait <= 0) settleSale(customer);
      }
    } else if (customer.state === 'enter') routeCustomerOut(customer);
    const target = headingTarget(customer);
    customer.group.rotation.y = smoothHeading(customer.group.rotation.y, target, delta);
    if (customer.state === 'leave') customer.group.scale.setScalar(Math.max(.01, 1 - (customer.fade || 0) * 1.8));
    else customer.group.position.y = Math.abs(Math.sin((ctx.elapsed || 0) * 4 + customer.id)) * .035;
    return true;
  }

  function beginPlacement(kind, fixtureId = null, product = 'water', footprint = null) {
    const old = fixtureId ? fixtures().find(f => f.id === fixtureId) || state().warehouse.find(f => f.id === fixtureId) : null;
    const selectedFootprint = old?.footprint || footprint || (kind === 'cooler' ? 'cooler' : kind === 'checkout' ? 'counter' : kind === 'decor' ? 'decor' : 'single');
    setPlacement({ kind, fixtureId, product: old?.product || product || 'water', footprint: selectedFootprint,
      rotation: old?.rotation || 0, point: old ? { x: old.x, z: old.z } : copyPoint(selectedFloor), valid: false, dragging: false });
    $('placementControls').hidden = false;
    $('placementProduct').hidden = kind !== 'shelf';
    $('placementFootprint').hidden = kind !== 'shelf';
    $('rotatePlacement').hidden = kind === 'decor';
    document.querySelector('label[for=placementProduct]').hidden = kind !== 'shelf';
    document.querySelector('label[for=placementFootprint]').hidden = kind !== 'shelf';
    $('placementProduct').value = old?.product || product || 'water';
    $('placementFootprint').value = selectedFootprint;
    if (getPlacement().point) updatePlacementPreview(getPlacement().point);
    else updatePlacementUi();
    ctx.toast(ctx.t('placementSelected', ctx.locale));
  }

  function updatePlacementPreview(point) {
    const p = getPlacement();
    if (!p) return;
    p.point = copyPoint(point);
    updatePlacementUi();
  }

  function chooseFloor(point) {
    if (!point || !Number.isInteger(point.x) || !Number.isInteger(point.z) || point.x < 0 || point.z < 0 || point.x >= state().area || point.z >= state().area) return;
    if (endpointEdit) { updateEndpointPreview(point); return; }
    setSelectedFloor(point);
    const p = getPlacement();
    if (p && !p.dragging) updatePlacementPreview(point);
    else {
      $('selectedTileReadout').textContent = `${ctx.t('selectedTile', ctx.locale)} · ${point.x + 1}, ${point.z + 1}`;
      ctx.toast(`${ctx.t('selectedTile', ctx.locale)} · ${point.x + 1}, ${point.z + 1}`);
    }
  }

  function rotatePlacement() {
    const p = getPlacement();
    if (!p) return;
    p.rotation = (p.rotation + 1) % 4;
    if (p.point) updatePlacementPreview(p.point); else updatePlacementUi();
  }

  function updateEndpointPreview(point) {
    if (!endpointEdit) return;
    endpointEdit.point = copyPoint(point);
    const field = endpointEdit.kind === 'entrance' ? 'entrances' : 'exits';
    const otherField = field === 'entrances' ? 'exits' : 'entrances';
    const protectedElsewhere = (state()[otherField] || []).some(item => item.x === point?.x && item.z === point?.z);
    const clear = Boolean(point && edgePoint(point, state().area) && walkable(point.x, point.z)
      && !protectedElsewhere);
    const proposed = { entrances: field === 'entrances' ? [point] : state().entrances,
      exits: field === 'exits' ? [point] : state().exits };
    endpointEdit.valid = clear && routeToCheckout([], null, null, proposed);
    if (ghostMesh) {
      ghostMesh.visible = Boolean(point);
      if (point) { ghostMesh.position.set(point.x, .13, point.z); ghostMesh.material.color.set(endpointEdit.valid ? 0x20bd88 : 0xe45454); }
    }
    updatePlacementUi();
  }

  function beginEndpointEdit(kind) {
    if (!['entrance', 'exit'].includes(kind) || getPlacement()) return;
    endpointEdit = { kind, point: null, valid: false };
    $('placementControls').hidden = false;
    updatePlacementUi();
    ctx.toast(`${ctx.t(kind === 'entrance' ? 'setEntrance' : 'setExit', ctx.locale)} · ${ctx.t('endpointPickHint', ctx.locale)}`);
  }

  function confirmEndpointEdit() {
    if (!endpointEdit?.valid || !endpointEdit.point) return false;
    const kind = endpointEdit.kind;
    state()[kind === 'entrance' ? 'entrances' : 'exits'] = [copyPoint(endpointEdit.point)];
    endpointEdit = null;
    $('placementControls').hidden = true;
    ctx.buildFloor?.(); syncLayoutMarkers(); ctx.setCamera(); ctx.save(); renderPanel(); refreshHud();
    ctx.toast(ctx.t(kind === 'entrance' ? 'entranceSaved' : 'exitSaved', ctx.locale));
    return true;
  }

  function cancelPlacement() {
    if (endpointEdit) {
      endpointEdit = null;
      if (ghostMesh) ghostMesh.visible = false;
      $('placementControls').hidden = true;
      $('placementStatus').classList.remove('invalid');
      ctx.renderPanel(); ctx.toast(ctx.t('placementCancelled', ctx.locale));
      return;
    }
    if (!getPlacement()) return;
    setPlacement(null);
    if (ghostMesh) ghostMesh.visible = false;
    $('placementControls').hidden = true;
    $('placementStatus').classList.remove('invalid');
    ctx.renderPanel();
    ctx.toast(ctx.t('placementCancelled', ctx.locale));
  }

  function confirmPlacement() {
    if (endpointEdit) { confirmEndpointEdit(); return; }
    const p = getPlacement();
    if (!p?.point) return;
    updatePlacementUi();
    if (!p.valid || !canPlaceFixture(p.point.x, p.point.z, p.fixtureId)) {
      p.valid = false; $('confirmPlacement').disabled = true; ctx.toast(ctx.t('placementBlocked', ctx.locale)); return;
    }
    const oldFixture = p.fixtureId ? fixtures().find(f => f.id === p.fixtureId) : null;
    const oldWarehouse = p.fixtureId ? state().warehouse.find(f => f.id === p.fixtureId) : null;
    const old = oldFixture || oldWarehouse;
    if (old) {
      if (p.kind === 'cooler' && !state().equipment.cooler) {
        const cost = fixtureCost(p.kind, p.footprint);
        const purchase = ctx.spendCash(state(), cost, 'equipment', { detail: 'cooler' });
        if (!purchase.ok) { ctx.toast(ctx.t('needMoreCash', ctx.locale)); return; }
        setState(purchase.state); state().equipment.cooler = true;
      }
      const moved = { ...old, x: p.point.x, z: p.point.z, rotation: p.rotation, footprint: p.footprint, product: p.product };
      if (oldWarehouse) {
        state().warehouse = state().warehouse.filter(f => f.id !== old.id);
        state().fixtures.push(moved);
      } else state().fixtures[state().fixtures.findIndex(f => f.id === old.id)] = moved;
      if (p.kind === 'cooler') state().coolerFixtureId = old.id;
      if (p.kind === 'fastCheckout') state().fastCheckoutFixtureId = old.id;
    } else {
      const cost = fixtureCost(p.kind, p.footprint);
      if (p.kind === 'cooler' || p.kind === 'fastCheckout') {
        const result = ctx.purchaseEquipment(state(), p.kind, cost);
        if (!result.ok) { ctx.toast(ctx.t('needMoreCash', ctx.locale)); return; }
        setState(result.state);
      } else if (p.kind === 'decor') {
        if (state().diamond < 1) { ctx.toast(ctx.t('needMoreCash', ctx.locale)); return; }
        state().diamond--; state().diamondSpent++;
      } else {
        const purchase = ctx.spendCash(state(), cost, 'fixture', { detail: p.kind });
        if (!purchase.ok) { ctx.toast(ctx.t('needMoreCash', ctx.locale)); return; }
        setState(purchase.state);
      }
      const newId = `${p.kind}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      state().fixtures.push({ id: newId, kind: p.kind,
        x: p.point.x, z: p.point.z, rotation: p.rotation, footprint: p.footprint,
        ...(p.kind === 'shelf' ? { product: p.product } : {}) });
      if (p.kind === 'cooler') state().coolerFixtureId = newId;
      if (p.kind === 'fastCheckout') state().fastCheckoutFixtureId = newId;
      if (p.kind === 'decor') {
        const pieces = decorativeCount();
        const boost = Math.max(1, 5 - (pieces - 1) * .7);
        state().popularity = clampPopularity(state().popularity + boost);
      }
    }
    selectedFixtureId = p.fixtureId || null;
    setPlacement(null); $('placementControls').hidden = true;
    syncFixtures(); updateQueueLines(); ctx.save(); ctx.renderPanel(); refreshHud();
    ctx.toast(ctx.t('placementDone', ctx.locale));
  }

  function warehouseFixture(id) {
    const index = state().fixtures.findIndex(f => f.id === id);
    if (index < 0) return;
    const fixture = state().fixtures[index];
    if (fixture.kind === 'checkout' && staffedCounters().length <= 1) {
      ctx.toast(ctx.t('lastCashierCounter', ctx.locale)); return;
    }
    state().warehouse.push(state().fixtures.splice(index, 1)[0]);
    if (selectedFixtureId === id) selectedFixtureId = null;
    syncFixtures(); updateQueueLines(); ctx.save(); ctx.renderPanel(); refreshHud();
    ctx.toast(ctx.t('storedWarehouse', ctx.locale));
  }

  function rotateSelectedFixture(id) {
    const fixture = fixtures().find(f => f.id === id);
    if (!fixture) return;
    beginPlacement(fixture.kind, fixture.id, fixture.product, fixture.footprint);
    rotatePlacement();
  }

  function createCard(icon, title, detail, price, action, options = {}) {
    const button = document.createElement('button');
    button.type = 'button'; button.className = `card ${options.className || ''}`.trim();
    button.disabled = Boolean(options.disabled);
    const marker = document.createElement('span'); marker.className = `block-icon ${icon}`; marker.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 3; i++) marker.append(document.createElement('i'));
    const copy = document.createElement('span'); copy.className = 'card-copy';
    const strong = document.createElement('strong'); strong.textContent = title;
    const small = document.createElement('small'); small.textContent = detail;
    copy.append(strong, small);
    const priceNode = document.createElement('em'); priceNode.textContent = price;
    button.append(marker, copy, priceNode);
    if (options.placement) {
      button.dataset.v9Placement = 'true'; button.dataset.kind = options.placement.kind;
      button.dataset.footprint = options.placement.footprint || 'single'; button.dataset.product = options.placement.product || 'water';
      button.classList.add('draggable-placement');
    }
    button.addEventListener('click', action);
    $('panel').append(button);
    return button;
  }

  function renderSelectedFixture() {
    const fixture = fixtures().find(f => f.id === selectedFixtureId);
    if (!fixture) return;
    createCard('selected-fixture', ctx.t('selectedFixture', ctx.locale), `${ctx.t(fixture.kind === 'shelf' ? 'product' : fixture.kind === 'checkout' ? 'cashRegister' : fixture.kind === 'cooler' ? 'coolerUpgrade' : 'storeCharm', ctx.locale)} · ${ctx.t('footprint', ctx.locale)} ${footprintSize(fixture).width}×${footprintSize(fixture).depth}`, ctx.t('selected', ctx.locale), () => {}, { disabled: true, className: 'fixture-selection-readout' });
    createCard('rotate', ctx.t('rotateFixture', ctx.locale), ctx.t('turnFixturePrompt', ctx.locale), '↻', () => rotateSelectedFixture(fixture.id));
    createCard('move', ctx.t('moveFixture', ctx.locale), ctx.t('dragFixturePrompt', ctx.locale), ctx.t('placeFree', ctx.locale), () => beginPlacement(fixture.kind, fixture.id, fixture.product, fixture.footprint));
    if (fixture.kind === 'shelf') {
      const row = document.createElement('label'); row.className = 'fixture-product-select';
      const label = document.createElement('span'); label.textContent = ctx.t('chooseProduct', ctx.locale);
      const select = document.createElement('select'); select.setAttribute('aria-label', label.textContent);
      for (const id of state().unlocked) {
        const option = document.createElement('option'); option.value = id;
        option.textContent = ctx.t(PRODUCT_DEFS[id]?.label || 'shelf', ctx.locale); select.append(option);
      }
      select.value = fixture.product;
      select.addEventListener('change', () => {
        const index = state().fixtures.findIndex(item => item.id === fixture.id);
        if (index < 0) return;
        state().fixtures[index] = { ...state().fixtures[index], product: select.value };
        syncFixtures(); ctx.save(); renderPanel();
        ctx.toast(ctx.t('shelfProductChanged', ctx.locale));
      });
      row.append(label, select); $('panel').append(row);
    }
    if (fixture.kind !== 'checkout' || staffedCounters().length > 1) {
      createCard('warehouse', ctx.t('toWarehouse', ctx.locale), ctx.t('keepStockAndLevel', ctx.locale), '↥', () => warehouseFixture(fixture.id));
    }
  }

  function renderWarehouseSummary() {
    const section = document.createElement('section'); section.className = 'inventory-summary';
    const heading = document.createElement('h3'); heading.textContent = ctx.t('warehouseSummary', ctx.locale);
    section.append(heading);
    const groups = [
      ['shelf', fixture => fixture.kind === 'shelf'],
      ['cashRegister', fixture => fixture.kind === 'checkout'],
      ['coolerUpgrade', fixture => fixture.kind === 'cooler'],
      ['fasterCheckout', fixture => fixture.kind === 'fastCheckout']
    ];
    for (const [key, matches] of groups) {
      const placed = fixtures().filter(matches).length;
      const stored = state().warehouse.filter(matches).length;
      if (!placed && !stored) continue;
      const row = document.createElement('p'); row.textContent = `${ctx.t(key, ctx.locale)} · ${ctx.t('owned', ctx.locale)} ${placed + stored} · ${ctx.t('placed', ctx.locale)} ${placed} · ${ctx.t('stored', ctx.locale)} ${stored}`;
      section.append(row);
    }
    $('panel').append(section);
  }

  function renderCashActivity() {
    const section = document.createElement('section'); section.className = 'cash-activity'; section.id = 'cashActivity';
    const heading = document.createElement('h3');
    heading.textContent = `${ctx.t('spendingTitle', ctx.locale)} · ${ctx.price(Math.floor(state().cash))}`;
    section.append(heading);
    if (state().recoveryDebt > 0) {
      const debt = document.createElement('p'); debt.className = 'cash-debt';
      debt.textContent = `${ctx.t('recoveryInvoice', ctx.locale)} ${ctx.price(state().recoveryDebt)}`;
      section.append(debt);
    }
    const ledger = Array.isArray(state().cashLedger) ? state().cashLedger.slice(-8).reverse() : [];
    if (!ledger.length) {
      const empty = document.createElement('p'); empty.textContent = ctx.t('noSpendRecords', ctx.locale); section.append(empty);
    }
    const labels = { restock: 'manualOrderLabel', autoRestock: 'automaticWaterOrder', fixture: 'purchaseLabel',
      equipment: 'purchaseLabel', cashier: 'purchaseLabel', helper: 'purchaseLabel', expansion: 'purchaseLabel',
      sale: 'salesLabel', recoveryOrder: 'debtBorrowedLabel' };
    const detailLabels = { shelf: 'shelf', checkout: 'cashRegister', cooler: 'coolerUpgrade',
      fastCheckout: 'fasterCheckout', expansion: 'expand', helper: 'hireHelper', cashier: 'hireCashier' };
    for (const entry of ledger) {
      const row = document.createElement('div'); row.className = 'cash-activity-row';
      const name = document.createElement('span');
      const label = ctx.t(labels[entry.kind] || 'purchaseLabel', ctx.locale);
      const product = entry.product ? ` · ${ctx.t(PRODUCT_DEFS[entry.product]?.label || entry.product, ctx.locale)}` : '';
      const detailKey = entry.detail || (['cashier', 'helper', 'expansion'].includes(entry.kind) ? entry.kind : '');
      const detail = detailKey ? ` · ${ctx.t(detailLabels[detailKey] || detailKey, ctx.locale)}` : '';
      name.textContent = `${label}${detail}${product}${entry.quantity ? ` ×${entry.quantity}` : ''}`;
      const amounts = document.createElement('span');
      const cashText = entry.amount ? `${entry.amount > 0 ? '+' : '−'}${ctx.price(Math.abs(entry.amount))}` : '—';
      const debtText = entry.debtChange ? ` · ${ctx.t(entry.debtChange > 0 ? 'debtBorrowedLabel' : 'debtPaidLabel', ctx.locale)} ${ctx.price(Math.abs(entry.debtChange))}` : '';
      amounts.textContent = `${cashText}${debtText}`;
      row.append(name, amounts); section.append(row);
    }
    $('panel').append(section);
  }

  function openCashActivity() {
    ctx.selectedTab = 'supply';
    document.querySelectorAll('[data-tab]').forEach(button => button.classList.toggle('active', button.dataset.tab === 'supply'));
    renderPanel();
    $('cashActivity')?.scrollIntoView({ block: 'nearest' });
  }

  function addWarehouseControls() {
    for (const fixture of fixtures()) {
      if (!['shelf', 'cooler', 'fastCheckout', 'checkout', 'decor'].includes(fixture.kind)) continue;
      const row = document.createElement('div'); row.className = 'fixture-row';
      const label = document.createElement('span');
      const name = fixture.kind === 'shelf' ? ctx.t(PRODUCT_DEFS[fixture.product]?.label || 'shelf', ctx.locale)
        : ctx.t(fixture.kind === 'checkout' ? 'cashRegister' : fixture.kind === 'cooler' ? 'coolerUpgrade' : fixture.kind === 'fastCheckout' ? 'fasterCheckout' : 'storeCharm', ctx.locale);
      const size = footprintSize(fixture);
      label.textContent = `${name} · ${size.width}×${size.depth}`;
      const move = document.createElement('button'); move.className = 'fixture-manage'; move.textContent = ctx.t('moveFixture', ctx.locale);
      move.addEventListener('click', () => beginPlacement(fixture.kind, fixture.id, fixture.product, fixture.footprint));
      const rotate = document.createElement('button'); rotate.className = 'fixture-rotate';
      rotate.textContent = '↻'; rotate.setAttribute('aria-label', `${ctx.t('rotateFixture', ctx.locale)} · ${name}`);
      rotate.disabled = fixture.kind === 'decor';
      rotate.addEventListener('click', () => rotateSelectedFixture(fixture.id));
      const store = document.createElement('button'); store.className = 'fixture-store'; store.textContent = ctx.t('toWarehouse', ctx.locale);
      store.addEventListener('click', () => warehouseFixture(fixture.id));
      row.append(label, move, rotate, store); $('panel').append(row);
    }
    for (const fixture of state().warehouse) {
      const row = document.createElement('div'); row.className = 'fixture-row warehouse-row';
      const label = document.createElement('span');
      label.textContent = `${ctx.t('storedWarehouse', ctx.locale)} · ${ctx.t(fixture.kind === 'shelf' ? PRODUCT_DEFS[fixture.product]?.label || 'shelf' : fixture.kind === 'checkout' ? 'cashRegister' : fixture.kind === 'cooler' ? 'coolerUpgrade' : 'fasterCheckout', ctx.locale)} · ${footprintSize(fixture).width}×${footprintSize(fixture).depth}`;
      const place = document.createElement('button'); place.className = 'fixture-store'; place.textContent = ctx.t('placeFree', ctx.locale);
      place.addEventListener('click', () => beginPlacement(fixture.kind, fixture.id, fixture.product, fixture.footprint));
      row.append(label, place); $('panel').append(row);
    }
  }

  function refreshHud() {
    $('cash').textContent = ctx.price(Math.floor(state().cash));
    $('day').textContent = state().day;
    $('popularityValue').textContent = Math.round(state().popularity);
    $('popularityMeter').style.setProperty('--popularity-fill', `${Math.round(state().popularity)}%`);
    $('popularityMeter').setAttribute('aria-valuenow', String(Math.round(state().popularity)));
    $('guestCount').textContent = getCustomers().filter(c => c.state !== 'done' && c.state !== 'leave').length;
    $('queueCount').textContent = getCustomers().filter(c => c.state === 'queue' || c.state === 'pay').length;
    const counters = allCounters();
    if ($('cashierCount')) $('cashierCount').textContent = `${Math.min(state().cashierCount, counters.length)}/${counters.length}`;
  }

  function stockOrder(productId, requested = 8) {
    const product = ctx.PRODUCTS[productId];
    if (!product || !state().unlocked.includes(productId)) return;
    const capacity = ctx.stockCapacity(ctx.activeEquipment());
    const stockTotal = ctx.totalStock(state().stock);
    const quantity = Math.min(requested, Math.max(0, capacity - stockTotal), Math.floor(state().cash / product.cost));
    if (!quantity) { ctx.toast(ctx.t(stockTotal >= capacity ? 'capacityFull' : 'cashShort', ctx.locale)); return; }
    const purchase = ctx.spendCash(state(), quantity * product.cost, 'restock', { product: productId, quantity });
    if (!purchase.ok) { ctx.toast(ctx.t('cashShort', ctx.locale)); return; }
    setState(purchase.state); state().stock[productId] = (state().stock[productId] || 0) + quantity;
    ctx.save(); syncStockDisplays(); ctx.renderPanel(); refreshHud();
    ctx.toast(`${quantity} ${product.name} · ${ctx.t('orderedFor', ctx.locale)} ${ctx.price(quantity * product.cost)}`);
  }

  function hireCashier() {
    if (state().cash < CASHIER_HIRE_COST) { ctx.toast(ctx.t('needMoreCash', ctx.locale)); return; }
    const hire = ctx.spendCash(state(), CASHIER_HIRE_COST, 'cashier');
    if (!hire.ok) { ctx.toast(ctx.t('needMoreCash', ctx.locale)); return; }
    setState(hire.state);
    state().cashierCount++;
    syncFixtures(); ctx.save(); ctx.renderPanel(); refreshHud();
    ctx.toast(`${ctx.t('cashierHired', ctx.locale)} · ${state().cashierCount}`);
  }

  function buyRegister() {
    if (state().cash < REGISTER_COST) { ctx.toast(ctx.t('needMoreCash', ctx.locale)); return; }
    beginPlacement('checkout', null, 'water', 'counter');
    ctx.renderPanel();
  }

  function expandDecorAppeal() {
    const count = decorativeCount();
    const next = Math.max(1, 5 - count * .7);
    state().popularity = clampPopularity(state().popularity + next);
    ctx.save(); refreshHud();
  }

  function renderPanel() {
    if (!isInstalled) return;
    applyFloorArt();
    syncStockDisplays();
    $('panel').replaceChildren();
    mapProducts(); unlockedProducts();
    const tab = ctx.selectedTab;
    $('panel').dataset.activeTab = tab;
    if (tab === 'achievements') {
      renderAchievements();
      return;
    }
    if (selectedFixtureId && fixtures().some(f => f.id === selectedFixtureId)) renderSelectedFixture();
    if (tab === 'shop') {
      createCard('shelf-single', ctx.t('smallShelf', ctx.locale), `${ctx.t('oneTile', ctx.locale)} · ${ctx.t('selectFloorThenPlace', ctx.locale)}`, ctx.price(70), () => beginPlacement('shelf', null, 'water', 'single'), { placement: { kind: 'shelf', footprint: 'single', product: 'water' } });
      createCard('shelf-double', ctx.t('doubleShelf', ctx.locale), `${ctx.t('twoTiles', ctx.locale)} · ${ctx.t('selectFloorThenPlace', ctx.locale)}`, ctx.price(120), () => beginPlacement('shelf', null, 'water', 'double'), { placement: { kind: 'shelf', footprint: 'double', product: 'water' } });
      createCard('goods', ctx.t('newGoods', ctx.locale), `${ctx.t('productVariety', ctx.locale)} · ${Object.keys(PRODUCT_DEFS).length}`, '›', () => { ctx.selectedTab = 'supply'; renderPanel(); });
      createCard('achievement-entry', ctx.t('achievementTab', ctx.locale), ctx.t('achievementsIntro', ctx.locale), `${state().achievements.unlockedIds.length}/${ACHIEVEMENT_CATALOG.length}`, () => {
        ctx.selectedTab = 'achievements'; renderPanel();
      });
    }
    if (tab === 'supply') {
      for (const id of Object.keys(PRODUCT_DEFS)) {
        const product = ctx.PRODUCTS[id], unlocked = state().unlocked.includes(id);
        const order = Math.min(8, Math.max(0, ctx.stockCapacity(ctx.activeEquipment()) - ctx.totalStock(state().stock)), Math.floor(state().cash / product.cost));
        const title = ctx.t(product.label, ctx.locale);
        const detail = unlocked
          ? `${state().stock[id] || 0} ${ctx.t('onShelf', ctx.locale)} · ${ctx.t('buyPrice', ctx.locale)} ${ctx.price(product.cost)} · ${ctx.t('sellPrice', ctx.locale)} ${ctx.price(product.price)}`
          : `${ctx.t('unlockAt', ctx.locale)} ${id === 'juice' ? ctx.price(280) : ctx.price(1000)} ${ctx.t('lifetimeSales', ctx.locale)}`;
        createCard(id, title, detail, unlocked ? `+${order} · ${ctx.price(order * product.cost)}` : ctx.t('locked', ctx.locale), () => stockOrder(id, 8), { disabled: !unlocked || !order });
      }
      createCard('shelf-single', ctx.t('smallShelf', ctx.locale), ctx.t('shelfForSelectedProduct', ctx.locale), ctx.price(70), () => beginPlacement('shelf', null, $('placementProduct').value || 'water', 'single'), { placement: { kind: 'shelf', footprint: 'single', product: 'water' } });
      renderCashActivity();
    }
    if (tab === 'growth') {
      renderWarehouseSummary();
      createCard('growth', ctx.t('expand', ctx.locale), `${ctx.t('expandDetail', ctx.locale)} · ${state().area} × ${state().area}`, `−${ctx.price(ctx.EXPANSION_COST)}`, ctx.expand, { disabled: state().area > 10 || state().cash < ctx.EXPANSION_COST });
      const coolerFixture = fixtures().find(f => f.id === state().coolerFixtureId) || state().warehouse.find(f => f.id === state().coolerFixtureId)
        || fixtures().find(f => f.kind === 'cooler') || state().warehouse.find(f => f.kind === 'cooler');
      const coolerOwned = Boolean(state().equipment.cooler);
      const coolerInstalled = coolerOwned && Boolean(coolerFixture && fixtures().some(f => f.id === coolerFixture.id));
      const coolerLabel = coolerInstalled ? ctx.t('coolerInstalled', ctx.locale)
        : coolerOwned ? ctx.t('storedInactive', ctx.locale) : `${ctx.t('fourTiles', ctx.locale)} · ${ctx.t('moreCapacity', ctx.locale)}`;
      createCard('cooler', ctx.t('coolerUpgrade', ctx.locale), `${coolerLabel} · ${ctx.t('stockCapacity', ctx.locale)} ${ctx.totalStock(state().stock)}/${ctx.stockCapacity(ctx.activeEquipment())}`,
        coolerOwned ? (coolerInstalled ? ctx.t('upgradeComplete', ctx.locale) : ctx.t('placeFree', ctx.locale)) : '−$180',
        () => beginPlacement('cooler', coolerOwned ? coolerFixture?.id || null : coolerFixture?.id || null, 'water', 'cooler'),
        { disabled: Boolean(coolerOwned && coolerInstalled), placement: { kind: 'cooler', footprint: 'cooler' } });
      createCard('store-charm', ctx.t('storeCharm', ctx.locale), `${ctx.t('decorAppeal', ctx.locale)} +${currentDecorAppeal().toFixed(1)} · ${state().diamond} ${ctx.t('tokens', ctx.locale)}`, '−1 ✦', () => beginPlacement('decor', null, 'water', 'decor'), { disabled: state().diamond < 1 || decorativeCount() >= 6, placement: { kind: 'decor', footprint: 'decor' } });
      createCard('entrance', ctx.t('entrance', ctx.locale), ctx.t('routeSafetyHint', ctx.locale), '↔', () => beginEndpointEdit('entrance'));
      createCard('exit', ctx.t('exit', ctx.locale), ctx.t('routeSafetyHint', ctx.locale), '↔', () => beginEndpointEdit('exit'));
      addWarehouseControls();
    }
    if (tab === 'staff') {
      renderWarehouseSummary();
      createCard('cash-register', ctx.t('cashRegister', ctx.locale), `${ctx.t('cashierCountLabel', ctx.locale)} ${Math.min(state().cashierCount, allCounters().length)}/${allCounters().length} · ${ctx.t('cashierService', ctx.locale)}`, `−$${REGISTER_COST}`, buyRegister, { placement: { kind: 'checkout', footprint: 'counter' } });
      createCard('cashier', ctx.t('hireCashier', ctx.locale), `${ctx.t('cashierHireDetail', ctx.locale)} · ${state().cashierCount}`, `−$${CASHIER_HIRE_COST}`, hireCashier, { disabled: state().cash < CASHIER_HIRE_COST });
      createCard('checkout-speed', ctx.t('fasterCheckout', ctx.locale), `${ctx.t('checkoutDetail', ctx.locale)} · ${ctx.t('checkoutTime', ctx.locale)} ${ctx.checkoutSeconds(ctx.activeEquipment()).toFixed(1)}s`, state().equipment.fastCheckout ? ctx.t('upgradeComplete', ctx.locale) : '−$150', () => state().equipment.fastCheckout ? beginPlacement('fastCheckout', state().warehouse.find(f => f.kind === 'fastCheckout')?.id || state().fixtures.find(f => f.kind === 'fastCheckout')?.id, 'water', 'counter') : beginPlacement('fastCheckout', null, 'water', 'counter'), { disabled: state().equipment.fastCheckout && fixtures().some(f => f.kind === 'fastCheckout') || !state().equipment.fastCheckout && state().cash < 150, placement: { kind: 'fastCheckout', footprint: 'counter' } });
      createCard('stock-helper', ctx.t('hireHelper', ctx.locale), state().helper ? ctx.t('helperAutoRestockHint', ctx.locale) : ctx.t('helperNoWage', ctx.locale), state().helper ? ctx.t('hired', ctx.locale) : '−$220', ctx.hire, { disabled: state().helper || state().cash < 220 });
      const auto = createCard('auto-restock', ctx.t('autoRestock', ctx.locale), ctx.t('autoRestockOptIn', ctx.locale),
        state().autoRestockEnabled ? ctx.t('autoRestockOn', ctx.locale) : ctx.t('autoRestockOff', ctx.locale), () => {
          if (!state().helper) { ctx.toast(ctx.t('helperNeeded', ctx.locale)); return; }
          state().autoRestockEnabled = !state().autoRestockEnabled;
          ctx.save(); renderPanel(); refreshHud();
          ctx.toast(ctx.t(state().autoRestockEnabled ? 'autoRestockTurnedOn' : 'autoRestockTurnedOff', ctx.locale));
        }, { disabled: !state().helper, className: state().autoRestockEnabled ? 'toggle-card active' : 'toggle-card' });
      auto.setAttribute('aria-pressed', String(Boolean(state().autoRestockEnabled)));
      addWarehouseControls();
    }
    if (getPlacement()) {
      $('placementControls').hidden = false;
      $('placementProduct').value = getPlacement().product || 'water';
      $('placementFootprint').value = getPlacement().footprint || 'single';
    }
    $('selectedTileReadout').textContent = selectedFloor ? `${ctx.t('selectedTile', ctx.locale)} · ${selectedFloor.x + 1}, ${selectedFloor.z + 1}` : ctx.t('noTileSelected', ctx.locale);
    refreshHud();
  }

  function pointFromEvent(event) {
    return ctx.gridPoint(event);
  }

  function panByPixels(dx, dy) {
    ctx.panByPixels(dx, dy);
    ctx.save();
  }

  function beginCounterOrFixtureDrag(point) {
    const fixture = fixtureAt(point);
    return fixture ? { mode: 'fixture', fixture, start: { x: point.x, z: point.z } } : { mode: getPlacement() ? 'placement' : 'pan', start: { x: point.x, z: point.z } };
  }

  function pointerDown(event) {
    if (cardDrag?.pointerId === event.pointerId) { event.stopImmediatePropagation(); return; }
    if (event.button === 2 || event.shiftKey) event.preventDefault();
    ctx.canvas.setPointerCapture(event.pointerId);
    const point = pointFromEvent(event);
    pointersMap.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointersMap.size >= 2) {
      const points = [...pointersMap.values()];
      pinchState = { distance: Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y),
        angle: Math.atan2(points[1].y - points[0].y, points[1].x - points[0].x),
        center: { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 } };
      pointerState = null; event.stopImmediatePropagation(); return;
    }
    pointerState = { id: event.pointerId, x: event.clientX, y: event.clientY,
      lastX: event.clientX, lastY: event.clientY, moved: false, point,
      fixture: !getPlacement() && !endpointEdit ? fixtureAt(point) : null,
      mode: getPlacement() ? 'placement' : endpointEdit ? 'layout-edit' : 'pan' };
    event.stopImmediatePropagation();
  }

  const pointersMap = new Map();

  function pointerMove(event) {
    if (cardDrag?.pointerId === event.pointerId) { event.stopImmediatePropagation(); return; }
    if (pointersMap.has(event.pointerId)) pointersMap.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointersMap.size >= 2) {
      const points = [...pointersMap.values()];
      const distance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
      const angle = Math.atan2(points[1].y - points[0].y, points[1].x - points[0].x);
      const center = { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 };
      if (pinchState) {
        panByPixels(center.x - pinchState.center.x, center.y - pinchState.center.y);
        const ratio = distance / Math.max(1, pinchState.distance);
        state().zoom = clamp(state().zoom * ratio, .65, 2);
        state().view += Math.atan2(Math.sin(angle - pinchState.angle), Math.cos(angle - pinchState.angle));
        ctx.setCamera();
      }
      pinchState = { distance, angle, center };
      event.stopImmediatePropagation(); return;
    }
    const current = pointerState;
    if (!current || current.id !== event.pointerId) { event.stopImmediatePropagation(); return; }
    const deltaX = event.clientX - current.lastX, deltaY = event.clientY - current.lastY;
    if (Math.hypot(event.clientX - current.x, event.clientY - current.y) > 8) current.moved = true;
    if (current.mode === 'layout-edit') {
      if (current.moved) updateEndpointPreview(pointFromEvent(event));
    } else if (current.mode === 'placement') {
      if (current.moved) { const placement = getPlacement(); if (placement) placement.dragging = true; updatePlacementPreview(pointFromEvent(event)); }
    } else if (current.fixture) {
      if (current.moved && current.mode !== 'moving-fixture') {
        current.mode = 'moving-fixture';
        beginPlacement(current.fixture.kind, current.fixture.id, current.fixture.product, current.fixture.footprint);
        getPlacement().dragging = true;
      }
      if (current.mode === 'moving-fixture') updatePlacementPreview(pointFromEvent(event));
      else if (current.moved) panByPixels(deltaX, deltaY);
    } else if (current.moved) panByPixels(deltaX, deltaY);
    current.lastX = event.clientX; current.lastY = event.clientY;
    event.stopImmediatePropagation();
  }

  function pointerUp(event) {
    if (cardDrag?.pointerId === event.pointerId) { event.stopImmediatePropagation(); return; }
    const current = pointerState;
    pointersMap.delete(event.pointerId);
    if (pointersMap.size < 2) pinchState = null;
    if (current?.id === event.pointerId) {
      const point = pointFromEvent(event);
      if (current.mode === 'layout-edit') {
        updateEndpointPreview(point);
      } else if (current.mode === 'moving-fixture') {
        const placement = getPlacement();
        if (placement) { placement.dragging = false; updatePlacementPreview(point); }
      } else if (current.mode === 'placement') {
        const placement = getPlacement();
        if (!current.moved) chooseFloor(point);
        else if (placement) { placement.dragging = false; updatePlacementPreview(point); }
      } else if (current.mode === 'pan' && !current.moved) {
        if (current.fixture) {
          selectedFixtureId = current.fixture.id; setSelectedFloor(point);
          ctx.selectedTab = 'growth'; document.querySelectorAll('[data-tab]').forEach(button => button.classList.toggle('active', button.dataset.tab === 'growth'));
          renderPanel();
        } else chooseFloor(point);
      }
      pointerState = null;
    }
    event.stopImmediatePropagation();
  }

  function pointerCancel(event) {
    pointersMap.delete(event.pointerId); pointerState = null; pinchState = null;
    if (getPlacement()) getPlacement().dragging = false;
    event.stopImmediatePropagation();
  }

  function startCardDrag(event) {
    const card = event.target.closest('[data-v9-placement]');
    if (!card || card.disabled || event.button !== 0) return;
    cardDrag = { pointerId: event.pointerId, x: event.clientX, y: event.clientY,
      kind: card.dataset.kind, footprint: card.dataset.footprint, product: card.dataset.product, moved: false };
  }

  function moveCardDrag(event) {
    const current = cardDrag;
    if (!current || current.pointerId !== event.pointerId) return;
    if (Math.hypot(event.clientX - current.x, event.clientY - current.y) > 8) current.moved = true;
    const target = document.elementFromPoint(event.clientX, event.clientY);
    if (!current.moved || !(target === ctx.canvas || ctx.canvas.contains(target))) return;
    if (!getPlacement() || getPlacement().fromCard !== true) {
      beginPlacement(current.kind, null, current.product, current.footprint);
      getPlacement().fromCard = true; getPlacement().dragging = true;
    }
    updatePlacementPreview(pointFromEvent(event));
    event.preventDefault();
  }

  function endCardDrag(event) {
    if (!cardDrag || cardDrag.pointerId !== event.pointerId) return;
    if (cardDrag.moved && getPlacement()?.fromCard) {
      getPlacement().dragging = false;
      updatePlacementPreview(pointFromEvent(event));
      event.preventDefault();
    }
    cardDrag = null;
  }

  function onFootprintChange() {
    if (!getPlacement() || getPlacement().kind !== 'shelf') return;
    getPlacement().footprint = $('placementFootprint').value;
    if (getPlacement().point) updatePlacementPreview(getPlacement().point); else updatePlacementUi();
  }

  function bindInput() {
    ctx.canvas.addEventListener('pointerdown', pointerDown, true);
    ctx.canvas.addEventListener('pointermove', pointerMove, true);
    ctx.canvas.addEventListener('pointerup', pointerUp, true);
    ctx.canvas.addEventListener('pointercancel', pointerCancel, true);
    ctx.canvas.addEventListener('lostpointercapture', pointerCancel, true);
    ctx.canvas.addEventListener('contextmenu', event => event.preventDefault(), true);
    document.addEventListener('pointerdown', startCardDrag, true);
    document.addEventListener('pointermove', moveCardDrag, true);
    document.addEventListener('pointerup', endCardDrag, true);
    $('rotatePlacement').addEventListener('click', rotatePlacement);
    $('placementProduct').addEventListener('change', () => { if (getPlacement()?.kind === 'shelf') getPlacement().product = $('placementProduct').value; });
    $('placementFootprint').addEventListener('change', onFootprintChange);
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') cancelPlacement();
      if ((event.key.toLowerCase() === 'r') && selectedFixtureId) rotateSelectedFixture(selectedFixtureId);
    });
  }

  function addPopularityHud() {
    let hud = $('popularityHud');
    if (!hud) {
      hud = document.createElement('div'); hud.id = 'popularityHud'; hud.className = 'popularity-hud';
      const label = document.createElement('span'); label.textContent = ctx.t('popularity', ctx.locale);
      const meter = document.createElement('span'); meter.id = 'popularityMeter'; meter.className = 'popularity-meter';
      meter.setAttribute('role', 'meter'); meter.setAttribute('aria-valuemin', '0'); meter.setAttribute('aria-valuemax', '100');
      const value = document.createElement('b'); value.id = 'popularityValue'; value.textContent = String(Math.round(state().popularity));
      hud.append(label, meter, value); document.querySelector('.scene-hud').prepend(hud);
    }
    hud.setAttribute('role', 'button'); hud.setAttribute('tabindex', '0');
    hud.setAttribute('aria-label', `${ctx.t('popularity', ctx.locale)} · ${ctx.t('explainPopularity', ctx.locale)}`);
    if (hud.dataset.helpBound !== 'true') {
      const explain = () => ctx.toast(ctx.t('explainPopularity', ctx.locale));
      hud.addEventListener('click', explain);
      hud.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); explain(); } });
      hud.dataset.helpBound = 'true';
    }
    if (!$('selectedTileReadout')) {
      const readout = document.createElement('span'); readout.id = 'selectedTileReadout'; readout.className = 'selected-tile-readout';
      readout.textContent = ctx.t('noTileSelected', ctx.locale); document.querySelector('.scene-legend').append(readout);
    }
  }

  function bindCashHud() {
    const cash = document.querySelector('.scene-hud .money');
    if (!cash || cash.dataset.activityBound === 'true') return;
    cash.setAttribute('role', 'button'); cash.setAttribute('tabindex', '0');
    cash.setAttribute('aria-label', ctx.t('openCashActivity', ctx.locale));
    cash.addEventListener('click', openCashActivity);
    cash.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openCashActivity(); } });
    cash.dataset.activityBound = 'true';
  }

  function refreshTraffic() {
    const current = state();
    if (current.lifetime >= 280 && !current.unlocked.includes('juice')) current.unlocked.push('juice');
    if (current.lifetime >= 1000 && !current.unlocked.includes('fizz')) current.unlocked.push('fizz');
    current.popularity = clampPopularity(current.popularity + currentDecorAppeal() * .00025);
    if (current.popularity < TRAFFIC_RECOVERY_FLOOR) current.popularity = clampPopularity(current.popularity + .012);
    const nextInterval = trafficInterval(current.popularity);
    if (ctx.spawnTimer > nextInterval) ctx.spawnTimer = nextInterval;
  }

  function automaticRestock() {
    if (!state().helper || !state().autoRestockEnabled || state().stock.water >= 6) return;
    const product = ctx.PRODUCTS.water;
    const room = ctx.stockCapacity(ctx.activeEquipment()) - ctx.totalStock(state().stock);
    const quantity = Math.min(8, room, Math.floor(state().cash / product.cost));
    if (quantity <= 0) return;
    const purchase = ctx.spendCash(state(), quantity * product.cost, 'autoRestock', { product: 'water', quantity });
    if (!purchase.ok) return;
    setState(purchase.state); state().stock.water += quantity;
    ctx.save(); syncStockDisplays(); renderPanel();
  }

  function lowCashRecovery(delta) {
    if (state().cash < ctx.PRODUCTS.water.cost && ctx.totalStock(state().stock) === 0 && state().recoveryOrders < 2) {
      ctx.recoveryTimer += delta;
      if (ctx.recoveryTimer >= 12) {
        const order = ctx.recoveryShipment(state(), ctx.PRODUCTS.water.cost);
        if (order.ok) {
          setState(ctx.appendCashLedger(order.state, { kind: 'recoveryOrder', debtChange: order.cost,
            product: 'water', quantity: order.quantity }));
          ctx.save(); syncStockDisplays(); renderPanel();
          ctx.toast(`${ctx.t('recoveryOrder', ctx.locale)} · ${ctx.price(order.cost)}`);
        }
        ctx.recoveryTimer = 0;
      }
    } else ctx.recoveryTimer = 0;
  }

  function gameLoop(timestamp) {
    requestAnimationFrame(gameLoop);
    if (!ctx.renderer || document.hidden) { previousFrame = timestamp; return; }
    const delta = previousFrame ? clamp((timestamp - previousFrame) / 1000, 0, .05) : 0;
    previousFrame = timestamp;
    if (ctx.gameActive && ($('#leaveConfirm')?.hidden ?? true)) {
      ctx.elapsed += delta;
      ctx.spawnTimer -= delta;
      if (ctx.spawnTimer <= 0 && getCustomers().filter(c => c.state !== 'done' && c.state !== 'leave').length < 12) {
        spawn(); ctx.spawnTimer = trafficInterval(state().popularity);
      }
      if (timestamp - lastQueueUpdate > 450) updateQueueLines();
      setCustomers(getCustomers().filter(customer => updateCustomer(customer, delta)));
      automaticRestock(); lowCashRecovery(delta); refreshTraffic();
      const day = Math.floor(ctx.elapsed / 60) + 1;
      if (day > state().day) { state().day = day; ctx.save(); }
      if (Math.floor(timestamp / 250) !== Math.floor((timestamp - delta * 1000) / 250)) refreshHud();
    }
    getCustomers().forEach(customer => { if (customer.state !== 'leave') customer.group.position.y = Math.abs(Math.sin(ctx.elapsed * 4 + customer.id)) * .035; });
    ctx.renderer.render(ctx.scene, ctx.camera);
  }

  function install() {
    if (isInstalled) return;
    isInstalled = true;
    if (typeof ctx.panByPixels === 'function' && !ctx.panByPixels.blockmartVisualYaw) {
      const panByPixels = ctx.panByPixels;
      const adjustedPanByPixels = (dx, dy) => {
        const cosine = Math.cos(VISUAL_CAMERA_YAW), sine = Math.sin(VISUAL_CAMERA_YAW);
        panByPixels(dx * cosine + dy * sine, -dx * sine + dy * cosine);
      };
      adjustedPanByPixels.blockmartVisualYaw = true;
      ctx.panByPixels = adjustedPanByPixels;
    }
    migrateCurrentState();
    fitCameraToShop();
    addPopularityHud();
    bindCashHud();
    bindInput();
    syncFixtures();
    ctx.save();
    renderPanel(); refreshHud(); updateQueueLines();
    ctx.running = false;
    requestAnimationFrame(gameLoop);
  }

  return {
    install,
    notifyAchievementUnlocks,
    recordExpansionPurchase: toArea => settleAchievementEvent({ type: 'expansion_purchased', toArea }),
    walkable, accessTiles, routeToCheckout, canPlaceFixture, fixtureAt, fixtureCost,
    fixtureGroup, syncFixtures, beginPlacement, placementReason, updatePlacementPreview,
    updatePlacementUi, chooseFloor, rotatePlacement, rotateSelectedFixture,
    cancelPlacement, confirmPlacement, warehouseFixture, routeCustomerOut, updateQueueLines,
    targetCheckout, chooseProduct, spawn, updateCustomer, renderPanel, stockOrder, hireCashier,
    addWarehouseControls, refreshHud,
    activeEquipment: () => ({
      cooler: Boolean(state().equipment.cooler && fixtures().some(f => f.id === (state().coolerFixtureId || fixtures().find(x => x.kind === 'cooler')?.id))),
      fastCheckout: Boolean(state().equipment.fastCheckout && fixtures().some(f => f.id === (state().fastCheckoutFixtureId || fixtures().find(x => x.kind === 'fastCheckout')?.id)))
    })
  };
}





