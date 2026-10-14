import * as THREE from './vendor/three/three.module.min.js';
import {liveElapsedWindow,simulationSteps,migrateEmployees,hireStoreEmployee,changeEmployeeRole,employeeCheckoutSeconds,employeeRestockSeconds,migrateBusinessUpgrades,trainedEmployee,businessUpgradeCost,purchaseBusinessUpgrade,purchaseExpansion,EXPANSIONS,normalizeBusinessPerformance,recordBusinessSale,businessPerformance,EMPLOYEE_HIRE_COST,EMPLOYEE_RESTOCK_BATCH} from './economy.js?v=11';
import {
  GRID_ENTRANCES, baseFootprint, footprintSize, occupiedTiles, footprintConflict,
  serviceVector, serviceFacingTarget, queueTile, clampPopularity, popularityAfterWait,
  popularityAfterWalkout, decorAppeal, trafficInterval, smoothHeading, fixtureCenter,
  ACHIEVEMENT_CATALOG,
  legacyAchievementProgress, normalizeAchievementState, mergeAchievementStates,
  achievementProgress, awardCompletedAchievements, recordAchievementEvent
} from './blockmart-v9-systems.js?v=11';

const PRODUCT_DEFS = {
  water: { label: 'waterProduct', cost: 8, price: 12, demand: 1.45, color: 0x48b6cf, display: 'water' },
  snacks: { label: 'cookies', cost: 12, price: 20, demand: 1.05, color: 0xc87b31, display: 'cookies' },
  chips: { label: 'chips', cost: 13, price: 22, demand: .96, color: 0xe8bc38, display: 'chips' },
  juice: { label: 'juice', cost: 17, price: 30, demand: .78, color: 0xe87535, display: 'juice',unlock:280,cold:true },
  fizz: { label: 'sparklingDrink', cost: 42, price: 62, demand: .5, color: 0xa34e91, display: 'fizz',unlock:1000,cold:true },
  milk: {label:'milk',cost:14,price:24,demand:1.2,color:0x6398dc,display:'juice',unlock:500,cold:true},
  bread: {label:'bread',cost:10,price:18,demand:1.1,color:0xbc894a,display:'cookies',unlock:600},
  yogurt: {label:'yogurt',cost:18,price:32,demand:.92,color:0xe482a3,display:'fizz',unlock:1500,cold:true},
  icecream: {label:'icecream',cost:26,price:44,demand:.72,color:0x87c4a4,display:'juice',unlock:3000,cold:true},
  noodles: {label:'noodles',cost:21,price:35,demand:.85,color:0xf29549,display:'chips',unlock:4500}
};
const DECOR_DEFS={duck:{cost:1800,label:'duckStatue',appeal:1},bread:{cost:4200,label:'breadThrone',appeal:2},crown:{cost:10000,label:'kingReceipt',appeal:3}};

const CASHIER_HIRE_COST = 180;
const REGISTER_COST = 120;
const QUEUE_LIMIT_PER_REGISTER = 4;
const QUEUE_PATIENCE_SECONDS = 30;
const TRAFFIC_RECOVERY_FLOOR = 18;
const CELL_SIZE = .94;
const VISUAL_CAMERA_YAW = Math.PI / 6;
const VISUAL_CAMERA_FOCUS_HEIGHT = 1.1;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const copyPoint = point => point ? { x: point.x, z: point.z,...(Number.isInteger(point.rotation)?{rotation:point.rotation}:{}) } : null;
const inwardPoint=(point,area=10)=>{const vector=serviceVector(point.rotation??inwardRotation(point,area));return {x:point.x+Math.round(vector.x),z:point.z+Math.round(vector.z)};};
const inwardRotation=(point,area)=>point.z===0?0:point.x===0?1:point.z===area-1?2:3;
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
    .map(point => [`${point.x},${point.z}`, { x: point.x, z: point.z,rotation:Number.isInteger(point.rotation)?((point.rotation%4)+4)%4:inwardRotation(point,area) }])).values()];
  if (clean.length) return clean;
  const perimeter = [];
  for (let x = 0; x < area; x++) perimeter.push({ x, z: 0 }, { x, z: area - 1 });
  for (let z = 1; z < area - 1; z++) perimeter.push({ x: 0, z }, { x: area - 1, z });
  return perimeter.filter(point => !blocked.has(`${point.x},${point.z}`)
    && !occupied.has(`${point.x},${point.z}`)).slice(0, 1).map(point=>({...point,rotation:inwardRotation(point,area)}));
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
  state.employees = migrateEmployees(state,state.fixtures,state.warehouse);
  state.cashierCount = state.employees.filter(employee => employee.role === 'checkout').length;
  if((saved.storeModelVersion||0)<12)for(const fixture of [...state.fixtures,...state.warehouse])if(fixture.kind==='shelf'&&PRODUCT_DEFS[fixture.product]?.cold)fixture.legacyShelfCold=fixture.product;
  for(const id of Object.keys(PRODUCT_DEFS))state.stock[id]=Math.max(0,Math.floor(state.stock[id]||0));
  const migrated=migrateBusinessUpgrades(state);
  migrated.businessPerformance=normalizeBusinessPerformance(saved.businessPerformance);
  if(!saved.businessPerformance)migrated.businessPerformance.paidProducts=[...new Set([...(state.achievements.baseline.productIds||[]),...state.achievements.events.filter(e=>e.type==='sale_settled').map(e=>e.productId),...state.cashLedger.filter(e=>e.kind==='sale').map(e=>e.product)])].filter(id=>PRODUCT_DEFS[id]);
  migrated.growthGoals={...(saved.growthGoals||{})};
  migrated.storeModelVersion = 12;
  return migrated;
}

export function normalizeFixture(fixture = {}) {
  const migrated = { ...fixture, rotation: ((Math.floor(fixture.rotation || 0) % 4) + 4) % 4 };
  if (fixture.kind === 'shelf') migrated.footprint = fixture.footprint === 'double' ? 'double' : 'single';
  if(fixture.kind==='shelf'){if(!PRODUCT_DEFS[migrated.product])migrated.product='water';if(!PRODUCT_DEFS[migrated.product2])delete migrated.product2;}
  if (fixture.kind === 'cooler') {migrated.footprint = 'cooler';if(!PRODUCT_DEFS[migrated.product]?.cold)migrated.product='juice';if(!PRODUCT_DEFS[migrated.product2]?.cold)migrated.product2='milk';}
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
  let productPickerFixtureId = null;
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
  let cameraOrbit = false;
  let growthCategory = 'equipment';
  let selectedCatalogKey = null;
  let simulationBusy=false,transactionBusy=false,owned=false,faulted=false,lease=null,disposed=false;
  let work=Promise.resolve(),checkpointTimer=null;
  let manualPaused=false;
  let pendingView=null,viewWriteQueued=false,lastCheckpoint=0;
  let visibleSaleRevenue=0;
  const visibleAchievementIds=new Set();
  const documentId=globalThis.crypto?.randomUUID?.() || `doc-${Date.now()}-${Math.random()}`;
  let tabToken;
  try{tabToken=sessionStorage.getItem('blockmart.live-tab');if(!tabToken){tabToken=documentId;sessionStorage.setItem('blockmart.live-tab',tabToken)}}catch{tabToken=documentId}
  const customerMeshes=new Map();
  const employeeMeshes=new Map();
  const stockDisplaySlots = new Map();
  let styledFloorTiles = null;
  let cachedHomeLayout='',cachedHomes=new Map();
  let pickerSlot=0;

  const state = () => getState();
  const setSelectedFloor = point => {
    selectedFloor = copyPoint(point);
    updateSelectionMarker();
  };
  const fixtures = () => state().fixtures;
  const allCounters = () => fixtures().filter(f => f.kind === 'checkout').sort((a, b) => String(a.id).localeCompare(String(b.id)));
  const employees = () => state().employees || (state().employees = migrateEmployees(state(),fixtures(),state().warehouse || []));
  const counterEmployee = id => employees().find(employee => employee.role === 'checkout' && employee.registerId === id);
  const trained = employee => trainedEmployee(employee,state().businessUpgrades);
  const fixtureProducts = fixture => [...new Set([fixture.product,...(fixture.footprint==='double'||fixture.kind==='cooler'?[fixture.product2]:[])].filter(id=>PRODUCT_DEFS[id]))];
  const salesFixtures = id => fixtures().filter(f=>(f.kind==='shelf'||f.kind==='cooler'&&state().equipment.cooler)&&fixtureProducts(f).includes(id));
  const staffedCounters = () => allCounters().filter(counter => counterEmployee(counter.id));
  const counterById = id => staffedCounters().find(f => f.id === id) || null;
  const decorativeCount = () => fixtures().filter(f => f.kind === 'decor').length;
  const currentDecorAppeal = () => Math.min(18,decorAppeal(fixtures().filter(f=>f.kind==='decor'&&!f.decorType).length)+fixtures().filter(f=>f.kind==='decor'&&DECOR_DEFS[f.decorType]).reduce((sum,f)=>sum+DECOR_DEFS[f.decorType].appeal,0));

  function migrateCurrentState() {
    const migrated = migrateV9Save(state(), ctx.INITIAL);
    migrated.achievements = mergeAchievementStates(migrated.achievements, { events: ctx.readAchievementEvents?.() || [] });
    setState(migrated);
    mapProducts();
    if (![...migrated.fixtures,...migrated.warehouse].some(f => f.kind === 'checkout')) {
      migrated.fixtures.unshift({ id: 'checkout-v9-safe-default', kind: 'checkout', x: 7, z: 1, rotation: 0, footprint: 'counter' });
      migrated.employees = migrateEmployees(migrated,migrated.fixtures,migrated.warehouse);
    }
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
    const counters = allCounters().filter(f => f.id !== ignoreId);
    // Validate a new or moved register as a full lane before anyone is hired for it.
    if (candidate?.kind === 'checkout' && !counters.some(counter => counter.id === candidate.id)) counters.push(candidate);
    if (!counters.length) return false;
    const goals = counters.map(counter => serviceFacingTarget(counter))
      .map(point => ({ x: Math.round(point.x), z: Math.round(point.z) }))
      .filter(point => !blocked.has(`${point.x},${point.z}`) && walkable(point.x, point.z, ignoreId));
    if (!goals.length) return false;
    const entrances = routeOverrides.entrances || (state().entrances?.length ? state().entrances : [GRID_ENTRANCES[0]]);
    const exits = routeOverrides.exits || (state().exits?.length ? state().exits : [{ x: state().area - 1, z: state().area - 1 }]);
    if([...entrances,...exits].some(p=>{const inside=inwardPoint(p);return !walkable(inside.x,inside.z,ignoreId)||blocked.has(`${inside.x},${inside.z}`);}))return false;
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
      $('placementProduct').hidden = true; $('placementFootprint').hidden = true; $('rotatePlacement').hidden = false;
      document.querySelector('label[for=placementProduct]').hidden = true;
      document.querySelector('label[for=placementFootprint]').hidden = true;
      const valid = Boolean(endpointEdit.valid);
      $('placementStatus').classList.toggle('invalid', Boolean(endpointEdit.point && !valid));
      $('placementStatus').textContent = endpointEdit.point
        ? (valid ? `${title} · ${endpointEdit.rotation*90}° · ${ctx.t('routeOpen', ctx.locale)}` : ctx.t('endpointDirection', ctx.locale))
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
      ctx.scene.remove(group); group.traverse(object => {object.geometry?.dispose();if(object.isInstancedMesh)object.dispose();if(object.userData.ownedFixtureMaterial)object.material?.dispose();});
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

  // Preserve named cuboid joints while combining their colored rendered boxes.
  function batchBoxes(root, recursive=true) {
    if(root.userData.boxBatch)return;
    const boxes=[];
    const inspect=object=>{if(object.isMesh&&!object.isInstancedMesh&&object.geometry?.type==='BoxGeometry'&&!Array.isArray(object.material)&&!object.material.transparent)boxes.push(object);};
    if(recursive)root.traverse(inspect);else root.children.forEach(inspect);
    if(!boxes.length)return;
    const material=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.83});
    const batch=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),material,boxes.length);
    batch.name='combined-cuboids';batch.castShadow=true;batch.receiveShadow=true;batch.frustumCulled=false;batch.userData.ownedFixtureMaterial=true;
    const sources=boxes.map((mesh,index)=>{
      const node=new THREE.Object3D(),shape=mesh.geometry.parameters;
      node.name=mesh.name;node.position.copy(mesh.position);node.rotation.copy(mesh.rotation);node.scale.copy(mesh.scale);node.visible=mesh.visible;node.userData={...mesh.userData};
      mesh.parent.add(node);mesh.parent.remove(mesh);batch.setColorAt(index,mesh.material.color);mesh.geometry.dispose();
      return {node,size:new THREE.Vector3(shape.width,shape.height,shape.depth)};
    });
    root.add(batch);root.userData.boxBatch={batch,sources,inverse:new THREE.Matrix4(),matrix:new THREE.Matrix4(),sizeMatrix:new THREE.Matrix4()};
    updateBoxBatch(root);
  }
  function updateBoxBatch(root) {
    const data=root.userData.boxBatch;if(!data)return;
    root.updateMatrixWorld(true);data.inverse.copy(root.matrixWorld).invert();
    data.sources.forEach(({node,size},index)=>{
      let visible=true,current=node;
      while(current&&current!==root){visible=visible&&current.visible;current=current.parent;}
      data.matrix.multiplyMatrices(data.inverse,node.matrixWorld);
      data.sizeMatrix.makeScale(visible?size.x:0,visible?size.y:0,visible?size.z:0);
      data.matrix.multiply(data.sizeMatrix);data.batch.setMatrixAt(index,data.matrix);
    });
    data.batch.instanceMatrix.needsUpdate=true;
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
        block('shelf-price-strip', 0xfff0ce, 0, y, depth * .43, width * .82, .075, .025);
        for (const x of [-.27, 0, .27]) block('shelf-price-tag', 0x285965, x, y, depth * .445, .095, .033, .012);
        for (const z of depth > 1 ? [-.42,.42] : [0]) for (const x of [-.15,.15]) {
          const slotSku=z>0&&normalized.product2?normalized.product2:sku;
          slots.push({ group: createDisplayUnit(stockRoot, slotSku, x, y + .075, z), sku:slotSku });
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
      block('checkout-counter-trim', 0xefcc8d, 0, .98, 0, .98, .09, .96);
      block('checkout-keypad', 0x29444b, .19, 1.07, .25, .23, .045, .16);
      for (const x of [.13,.2,.27]) for (const z of [.22,.28]) block('checkout-key', 0xf5e8c5, x, 1.1, z, .037, .018, .037);
      block('checkout-drawer', 0xd7b777, 0, .67, .485, .66, .18, .025);
      block('checkout-drawer-pull', 0x36566a, 0, .67, .51, .2, .035, .025);
      block('checkout-light', staffedCounters().some(f => f.id === normalized.id) ? 0x61ca83 : 0xd55b50, .35, 1.1, -.32, .12, .12, .12);
    } else if (normalized.kind === 'fastCheckout') {
      block('checkout-upgrade', 0x426d79, 0, .55, 0, .82, .75, .68);
      block('checkout-display', 0x9be4cf, 0, .98, .12, .48, .22, .12);
      block('checkout-beam', 0xffd76c, 0, 1.14, .12, .48, .05, .12);
    } else if (normalized.kind === 'cooler') {
      block('cooler-footprint', 0x567e80, 0, .15, 0, 1.88, .17, 1.88);
      block('cooler-interior-back', 0xc5e5db, 0, .96, -.83, 1.72, 1.47, .12);
      for (const x of [-.86,.86]) {
        block('cooler-side', 0x315f6d, x, .96, 0, .14, 1.62, 1.88);
        block('cooler-side-trim', 0x6db5ae, x*1.09, 1.42, 0, .035, .12, 1.63);
        for (let row=0;row<3;row++) block('cooler-side-vent', 0x1c424d, x*1.09, .38+row*.08, 0, .035, .024, .52);
      }
      block('cooler-top', 0x315f6d, 0, 1.78, 0, 1.88, .17, 1.88);
      block('cooler-header', 0xf3dd9a, 0, 1.72, .96, 1.66, .16, .07);
      block('cooler-header-mark', 0x21868b, 0, 1.72, 1.005, .47, .075, .025);
      for (const x of [-.43,.43]) {
        const glass=block('cooler-glass', 0xc8f6f0, x, .98, 1.005, .76, 1.25, .025);
        glass.material=glass.material.clone();glass.material.transparent=true;glass.material.opacity=.18;glass.material.depthWrite=false;glass.userData.ownedFixtureMaterial=true;
        for (const edge of [-1,1]) {
          block('cooler-door-edge', 0x80b5b1, x+edge*.39, .98, 1.03, .055, 1.33, .06);
          block('cooler-door-rail', 0x80b5b1, x, .98+edge*.65, 1.03, .78, .055, .06);
        }
        block('cooler-handle', 0xf0c46f, x+(x<0?.3:-.3), .98, 1.08, .06, .4, .09);
      }
      const stockRoot = new THREE.Group();
      stockRoot.name = `stock-display-${normalized.id}`;
      group.add(stockRoot);
      const slots = [];
      for (let shelf = 0; shelf < 3; shelf++) {
        block('cooler-shelf', 0x6ba7a2, 0, .38 + shelf * .45, .22, 1.62, .07, 1.4);
        block('cooler-price-rail', 0xffebbb, 0, .38 + shelf * .45, .95, 1.58, .075, .035);
        for (const x of [-.43, .43]) slots.push({ parent: stockRoot, x, y: .425 + shelf * .45, z: .68, group: null, sku: null,assignedSku:x<0?(normalized.product||'juice'):(normalized.product2||'milk') });
      }
      stockDisplaySlots.set(normalized.id, { kind: 'cooler', slots });
    } else if (normalized.kind === 'decor') {
      if(normalized.decorType==='duck'){
        block('duck-pedestal',0x265e69,0,.19,0,.8,.3,.8);block('duck-body',0xf4c23d,0,.68,0,.68,.55,.62);block('duck-head',0xffd757,0,1.12,.12,.51,.49,.47);block('duck-beak',0xed8431,0,1.06,.43,.4,.12,.22);for(const x of [-.16,.16])block('duck-eye',0x293e40,x,1.2,.36,.07,.085,.035);block('duck-bowtie',0x207f89,0,.89,.35,.35,.12,.06);
      }else if(normalized.decorType==='bread'){
        block('bread-throne-base',0x684530,0,.23,0,.78,.38,.74);block('bread-throne-seat',0xd2a466,0,.62,0,.74,.25,.63);block('bread-throne-back',0xe7bf80,0,1.15,-.24,.76,1.01,.25);for(const x of [-.28,0,.28])block('bread-score',0xa77343,x,1.5,-.07,.095,.21,.035);for(const x of [-.35,.35])block('bread-throne-arm',0xb7773e,x,.84,.13,.13,.33,.61);
      }else if(normalized.decorType==='crown'){
        block('receipt-base',0x1f777d,0,.22,0,.77,.36,.72);block('receipt-scroll',0xfff2cd,0,.96,0,.54,1.13,.19);for(let i=0;i<5;i++)block('receipt-line',0x396570,0,.62+i*.14,.11,.33,.035,.025);block('receipt-crown',0xf0bb35,0,1.61,0,.69,.19,.29);for(const x of [-.25,0,.25])block('crown-point',0xffd965,x,1.8,0,.13,.23,.26);
      }else{
      block('decor-pot', 0xb47e58, 0, .18, 0, .7, .34, .7);
      block('decor-stem', 0x588e57, 0, .55, 0, .15, .54, .15);
      block('decor-leaf-a', 0x7fb65d, -.2, .82, 0, .42, .34, .27);
      block('decor-leaf-b', 0x65a34c, .2, .95, .08, .42, .3, .28);
      block('decor-leaf-c', 0x98c866, 0, 1.12, -.04, .38, .32, .3);
      }
    }
    batchBoxes(group,false);
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
      group.rotation.y=(point.rotation||0)*Math.PI/2+(entrance?0:Math.PI);
      const block = (name, x, y, z, sx, sy, sz, paint = color) => ctx.cube(group, name, paint, x, y, z, sx, sy, sz);
      block(`${kind}-left-post`, -.36, .5, 0, .12, 1, .12);
      block(`${kind}-right-post`, .36, .5, 0, .12, 1, .12);
      block(`${kind}-lintel`, 0, 1, 0, .84, .14, .14);
      block(`${kind}-threshold`, 0, .13, 0, .86, .12, .86, entrance ? 0x56c7a0 : 0xe5af58);
      const sign = block(`${kind}-sign`, 0, 1.25, 0, .54, .2, .1, entrance ? 0x164b48 : 0x74441c);
      block(`${kind}-arrow`,0,.23,.16,.12,.04,.5,color);
      for(const x of [-.13,.13]){const wing=block(`${kind}-arrow-wing`,x,.23,.34,.26,.04,.09,color);wing.rotation.y=x<0?Math.PI/4:-Math.PI/4;}
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
    const block = (name, color, px, py, pz, sx, sy, sz) => ctx.cube(unit, name, color, px, py, pz, sx, sy, sz);
    const catalog = PRODUCT_DEFS[sku];
    addDisplayItem(block, sku, catalog.display, 0, 0, 0, catalog.color);
    // Fit every SKU to the shelf's internal bay, then anchor its bottom above
    // the board. Work in local space so fixture yaw never changes the fit.
    unit.position.set(0,0,0);
    const bounds=new THREE.Box3().setFromObject(unit),size=bounds.getSize(new THREE.Vector3());
    const fit=Math.min(.26/size.x,.4/size.y,.32/size.z,1);
    unit.scale.setScalar(fit);
    unit.position.set(x-(bounds.min.x+bounds.max.x)*.5*fit,y-bounds.min.y*fit,z-(bounds.min.z+bounds.max.z)*.5*fit);
    unit.userData.displayBounds={width:size.x*fit,height:size.y*fit,depth:size.z*fit};
    parent.add(unit);
    return unit;
  }

  function syncStockDisplays() {
    if(simulationBusy)return;
    const remaining = Object.fromEntries(Object.keys(PRODUCT_DEFS).map(id => [id, Math.max(0, Math.floor(state().stock?.[id] || 0))]));
    for (const fixture of fixtures()) {
      const display = stockDisplaySlots.get(fixture.id);
      if (display?.kind !== 'shelf') continue;
      for (const slot of display.slots) {
        const visible = remaining[slot.sku] > 0;
        slot.group.visible = visible;
        if (visible) remaining[slot.sku]--;
      }
    }
    const coolerSlots = fixtures().flatMap(fixture => {
      const display = stockDisplaySlots.get(fixture.id);
      return display?.kind === 'cooler' ? display.slots : [];
    });
    coolerSlots.forEach(slot => {
      const sku = state().equipment.cooler&&remaining[slot.assignedSku]>0 ? slot.assignedSku : null;
      if(sku)remaining[sku]--;
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
    const floorRoot=ctx.scene?.getObjectByName('floor-root');if(floorRoot)batchBoxes(floorRoot,false);
    const floor = ctx.scene?.getObjectByName('floor-tiles');
    if (!floor || floor === styledFloorTiles || typeof floor.setColorAt !== 'function') return;
    const colors = [0xc8dce5, 0xece4d1];
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
    const paths = exits.map(point => {const inside=inwardPoint(point,state().area),start={x:customer.x,z:customer.z};if(start.x===point.x&&start.z===point.z)return [];const path=findPath(start,[inside]);if(path.length||start.x===inside.x&&start.z===inside.z)path.push(copyPoint(point));return path;});
    const path = paths.filter(candidate => candidate.length).sort((a, b) => a.length - b.length)[0] || [];
    customer.path = path; customer.pathAt = 0; customer.segment = null;
    customer.exitAt = path.length ? null : performance.now();
    customer.state = 'leave';
  }

  function notifyAchievementUnlocks(ids) {
    if(simulationBusy){ids.forEach(id=>visibleAchievementIds.add(id));return;}
    if (!ids.length) return;
    let notice = document.querySelector('.achievement-notice');
    if (!notice) {
      notice = document.createElement('div');
      notice.className = 'achievement-notice';
      notice.setAttribute('role', 'status');
      notice.setAttribute('aria-live', 'polite');
      notice.hidden = true;
      document.querySelector('.scene-wrap').append(notice);
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
    if(data.type==='sale_settled'){
      const progress=achievementProgress(state().achievements);
      const seen=new Set([...(state().achievements.baseline?.productIds||[]),...(state().achievements.events||[]).filter(event=>event.type==='sale_settled').map(event=>event.productId)]);
      if(progress.first_sale>=1&&progress.payments_25>=25&&progress.gross_1000>=1000&&(progress.patient_service_10>=10||data.queueWaitSeconds>17)&&seen.has(data.productId))return;
    }
    const id = globalThis.crypto?.randomUUID?.() || `ab-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    const result = recordAchievementEvent(state().achievements, { id, ...data });
    if (!result.accepted) return;
    state().achievements = mergeAchievementStates(result.state, { events: ctx.readAchievementEvents?.() || [] });
    notifyAchievementUnlocks(result.newlyUnlocked);
    ctx.save();
    if (ctx.selectedTab === 'achievements' && !simulationBusy) renderPanel();
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
    if(!customer.exitReason)state().businessPerformance.walkouts++;
    customer.exitReason = reason;
    routeCustomerOut(customer);
    ctx.save();
    if (restoredStock) syncStockDisplays();
    if(!simulationBusy)refreshHud();
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
    const entrance=state().entrances.find(p=>p.x===customer.x&&p.z===customer.z),start=entrance?inwardPoint(entrance):{x:customer.x,z:customer.z};
    const path = findPath(start, accessTiles(shelf));
    if (!path.length && !accessTiles(shelf).some(p => p.x === start.x && p.z === start.z)) return false;
    if(entrance)path.unshift(start);
    customer.target = shelf; customer.path = path; customer.pathAt = 0;
    customer.state = 'browse'; customer.wait = 0; customer.segment = null;
    return true;
  }

  function unlockedProducts() {
    const lifetime = state().lifetime;
    for(const [id,product] of Object.entries(PRODUCT_DEFS))if(lifetime>=(product.unlock||0)&&!state().unlocked.includes(id))state().unlocked.push(id);
    return state().unlocked;
  }

  function chooseProduct(budget) {
    const unlocked = new Set(unlockedProducts());
    const stockedShelves = new Set(fixtures().filter(f=>f.kind==='shelf'||f.kind==='cooler'&&state().equipment.cooler).flatMap(fixtureProducts));
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
    const group = modelGroup(point.x,point.z);
    const budget = ctx.customerBudget();
    const customer = { id: ctx.customerId, group, x: point.x, z: point.z, product: chooseProduct(budget),
      state: 'enter', path: [], pathAt: 0, wait: Math.random() * .6, budget, queue: 0,
      queueWait: 0, queueSequence: 0, segment: null, carried: false,kind:kind[0],color:kind[1] };
    getCustomers().push(customer);
    state().businessPerformance.visits++;
    if(!customer.product&&fixtures().some(f=>f.kind==='shelf'||f.kind==='cooler'&&state().equipment.cooler)&&ownedStock()===0)state().businessPerformance.stockouts++;
    if (customer.product) {
      const shelves = salesFixtures(customer.product).filter(f=>accessTiles(f).length);
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
    if(!customer.carried || customer.purchased)return;
    const product = ctx.PRODUCTS[customer.product];
    if (!product) { stopCustomerVisit(customer, 'invalid-product'); return; }
    const sale = ctx.applySaleRevenue(state(), product.price);
    setState(ctx.appendCashLedger(sale.state, { kind: 'sale', amount: sale.netRevenue,
      debtChange: -sale.debtPayment, product: customer.product, quantity: 1,
      queueWaitSeconds: Number.isFinite(customer.queueWait) ? customer.queueWait : 0 }));
    state().lifetime += sale.grossRevenue; state().transactions++;
    state().businessPerformance=recordBusinessSale(state().businessPerformance,{product:customer.product,time:ctx.elapsed,gross:sale.grossRevenue,cost:product.cost,wait:customer.queueWait||0,counterId:customer.checkoutId});
    customer.carried=false;customer.purchased=true;
    state().popularity = popularityAfterWait(state().popularity, customer.queueWait, QUEUE_PATIENCE_SECONDS);
    state().popularity = clampPopularity(state().popularity + 1 + currentDecorAppeal() * .025);
    if (!state().milestones.firstSale) { state().milestones.firstSale = true; state().diamond++; }
    unlockedProducts();
    settleAchievementEvent({ type: 'sale_settled', productId: customer.product,
      grossAmount: sale.grossRevenue, queueWaitSeconds: Number.isFinite(customer.queueWait) ? customer.queueWait : 0 });
    if(simulationBusy)visibleSaleRevenue+=sale.netRevenue;
    else{ctx.showSale(sale.netRevenue);if(sale.debtPayment)ctx.toast(`${ctx.t('recoveryPayment',ctx.locale)} · ${ctx.price(sale.debtPayment)}`);}
    ctx.save(); routeCustomerOut(customer); customer.remove = 0;
    updateQueueLines();
    if(!simulationBusy){refreshHud();refreshPanelValues();}
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
          else { state().stock[customer.product]--; customer.carried = true; if(!simulationBusy){syncStockDisplays();refreshPanelValues();} }
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
          customer.state = 'pay'; customer.wait = employeeCheckoutSeconds(trained(counterEmployee(counter.id)),ctx.activeEquipment()); customer.serviceCounter = counter;
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
    cameraOrbit=false;$('cameraOrbit')?.setAttribute('aria-pressed','false');
    const old = fixtureId ? fixtures().find(f => f.id === fixtureId) || state().warehouse.find(f => f.id === fixtureId) : null;
    const selectedFootprint = old?.footprint || footprint || (kind === 'cooler' ? 'cooler' : kind === 'checkout' ? 'counter' : kind === 'decor' ? 'decor' : 'single');
    setPlacement({ kind, fixtureId, product: old?.product || product || 'water', footprint: selectedFootprint,
      rotation: old?.rotation || 0, point: old && fixtures().some(f=>f.id===old.id) ? { x: old.x, z: old.z } : copyPoint(selectedFloor), valid: false, dragging: false });
    $('placementControls').hidden = false;
    $('placementProduct').hidden = kind !== 'shelf';
    $('placementFootprint').hidden = kind !== 'shelf';
    $('rotatePlacement').hidden = kind === 'decor';
    document.querySelector('label[for=placementProduct]').hidden = kind !== 'shelf';
    document.querySelector('label[for=placementFootprint]').hidden = kind !== 'shelf';
    refreshPlacementProducts(old?.product || product || 'water');
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
    if(endpointEdit){endpointEdit.rotation=(endpointEdit.rotation+1)%4;updateEndpointPreview(endpointEdit.point);return;}
    const p = getPlacement();
    if (!p) return;
    p.rotation = (p.rotation + 1) % 4;
    if (p.point) updatePlacementPreview(p.point); else updatePlacementUi();
  }

  function updateEndpointPreview(point) {
    if (!endpointEdit) return;
    if(point&&!endpointEdit.point)endpointEdit.rotation=inwardRotation(point,state().area);
    endpointEdit.point = point?{...copyPoint(point),rotation:endpointEdit.rotation}:null;
    point=endpointEdit.point;
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
    cameraOrbit=false;$('cameraOrbit')?.setAttribute('aria-pressed','false');
    endpointEdit = { kind, point: null, valid: false,rotation:0 };
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
    ctx.buildFloor?.(); syncLayoutMarkers(); rerouteLiveCustomers(); ctx.setCamera(); ctx.save(); renderPanel(); refreshHud();
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
    if (p.kind === 'shelf' && !state().unlocked.includes(p.product) && p.product !== old?.product) {
      ctx.toast(productLockReason(p.product)); return;
    }
    if (old) {
      const moved = { ...old, x: p.point.x, z: p.point.z, rotation: p.rotation, footprint: p.footprint, product: p.product };
      if (oldWarehouse) {
        state().warehouse = state().warehouse.filter(f => f.id !== old.id);
        state().fixtures.push(moved);
      } else state().fixtures[state().fixtures.findIndex(f => f.id === old.id)] = moved;
      if (p.kind === 'decor' && old.appealApplied === false) { moved.appealApplied=true;state().popularity=clampPopularity(state().popularity+Math.max(1,5-decorativeCount()*.7)); }
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
    state().employees=migrateEmployees(state(),fixtures(),state().warehouse);
    syncFixtures(); rerouteLiveCustomers(); updateQueueLines(); ctx.save(); ctx.renderPanel(); refreshHud();
    ctx.toast(ctx.t('placementDone', ctx.locale));
  }

  function warehouseFixture(id) {
    const index = state().fixtures.findIndex(f => f.id === id);
    if (index < 0) return;
    const fixture = state().fixtures[index];
    if (fixture.kind === 'checkout' && counterEmployee(id) && staffedCounters().length <= 1) {
      ctx.toast(ctx.t('lastCashierCounter', ctx.locale)); return;
    }
    state().warehouse.push(state().fixtures.splice(index, 1)[0]);
    if (selectedFixtureId === id) selectedFixtureId = null;
    syncFixtures(); rerouteLiveCustomers(); updateQueueLines(); ctx.save(); ctx.renderPanel(); refreshHud();
    ctx.toast(ctx.t('storedWarehouse', ctx.locale));
  }

  function rotateSelectedFixture(id) {
    const fixture = fixtures().find(f => f.id === id);
    if (!fixture) {ctx.toast(ctx.t('selectFixtureFirst',ctx.locale));return false;}
    const candidate = {...fixture,rotation:((fixture.rotation || 0)+1)%4};
    const conflict = footprintConflict(candidate,fixtures(),state().area,id,[...state().entrances,...state().exits]);
    if (conflict || !routeToCheckout(occupiedTiles(candidate),candidate,id)) {
      if (ghostMesh) { ghostMesh.visible=true;ghostMesh.position.set(fixture.x,.13,fixture.z);ghostMesh.material.color.set(0xe45454);setTimeout(()=>{if(!getPlacement()&&!endpointEdit)ghostMesh.visible=false},1200); }
      ctx.toast(ctx.t(conflict==='outside'?'placementOutside':conflict==='occupied'?'placementOccupied':conflict?'placementEntry':'placementRoute',ctx.locale));
      return false;
    }
    Object.assign(fixture,candidate);
    syncFixtures(); rerouteLiveCustomers(); updateQueueLines(); ctx.save(); renderPanel();ctx.toast(`${ctx.t('fixtureRotated',ctx.locale)} · ${fixture.rotation*90}°`);
    return true;
  }

  function rerouteLiveCustomers() {
    for (const customer of getCustomers()) {
      customer.segment=null;customer.x=Math.round(customer.group.position.x);customer.z=Math.round(customer.group.position.z);
      if(customer.state==='leave')routeCustomerOut(customer);
      else if(customer.state==='browse') {
        const target=salesFixtures(customer.product).find(f=>f.id===customer.target?.id);
        if(!target||!routeToShelf(customer,target))stopCustomerVisit(customer,'layout-change');
      } else if(customer.state==='queue'||customer.state==='pay') {
        customer.state='queue';if(!targetCheckout(customer))stopCustomerVisit(customer,'layout-change');
      }
    }
  }

  function createCard(icon, title, detail, price, action, options = {}) {
    const button = document.createElement('button');
    button.type = 'button'; button.className = `card ${options.className || ''}`.trim();
    button.disabled = Boolean(options.disabled);
    const artwork=PRODUCT_DEFS[icon]?icon:({'checkout-speed':'fastCheckout','store-charm':'decor','shelf-single':'shelf','shelf-double':'shelf-double',cooler:'cooler'})[icon];
    const marker=artwork?itemArt(artwork):document.createElement('span');
    if(!artwork){marker.className='functional-icon';marker.setAttribute('aria-hidden','true');marker.textContent=({growth:'↗',entrance:'⇢',exit:'⇥','auto-restock':'↻'})[icon] || '•';}
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
    button.addEventListener('click', () => transact(action));
    $('panel').append(button);
    return button;
  }

  function renderSelectedFixture() {
    const fixture = fixtures().find(f => f.id === selectedFixtureId);
    if (!fixture) return;
    const section = document.createElement('section'); section.className = 'fixture-detail'; section.dataset.fixtureId = fixture.id;
    const head = document.createElement('div'); head.className = 'fixture-detail-heading';
    head.append(fixtureIllustration(fixture));
    const copy = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = fixture.kind === 'shelf' ? `${ctx.t('shelfUnit', ctx.locale)} ${fixtures().filter(f => f.kind === 'shelf').indexOf(fixture) + 1}` : fixtureLabel(fixture);
    const detail = document.createElement('p');
    detail.textContent = fixture.kind === 'shelf' ? `${productName(fixture.product)} · ${ctx.t('availableStock', ctx.locale)} ${state().stock[fixture.product] || 0}` : `${ctx.t('footprint', ctx.locale)} ${footprintSize(fixture).width}×${footprintSize(fixture).depth}`;
    copy.append(title, detail); head.append(copy); section.append(head);
    if (fixture.kind === 'shelf') {
      const change = actionButton('changeShelfProduct', () => { productPickerFixtureId = productPickerFixtureId === fixture.id ? null : fixture.id; renderPanel(); $('panel').scrollTop = 0; });
      change.classList.add('shelf-product-action'); change.setAttribute('aria-expanded', String(productPickerFixtureId === fixture.id));
      section.append(change);
      if (productPickerFixtureId === fixture.id) section.append(renderProductPicker(fixture));
    }
    const tools = document.createElement('div'); tools.className = 'fixture-context-tools';
    tools.append(actionButton('rotateFixture', () => rotateSelectedFixture(fixture.id)), actionButton('moveFixture', () => beginPlacement(fixture.kind, fixture.id, fixture.product, fixture.footprint)));
    if (fixture.kind !== 'checkout' || staffedCounters().length > 1) tools.append(actionButton('toWarehouse', () => warehouseFixture(fixture.id)));
    section.append(tools); $('panel').append(section);
  }

  const productName = id => ctx.t(PRODUCT_DEFS[id]?.label || 'shelf', ctx.locale);
  const fixtureLabel = fixture => ctx.t(({shelf:'shelfUnit',checkout:'cashRegister',cooler:'coolerUpgrade',fastCheckout:'fasterCheckout',decor:'storeCharm'})[fixture.kind] || 'selectedFixture', ctx.locale);
  function actionButton(key, action) {
    const button = document.createElement('button'); button.type = 'button'; button.textContent = ctx.t(key, ctx.locale); button.addEventListener('click',()=>transact(action)); return button;
  }

  const catalog = [
    {key:'shelf-single',kind:'shelf',footprint:'single',label:'smallShelf',art:'shelf'},
    {key:'shelf-double',kind:'shelf',footprint:'double',label:'doubleShelf',art:'shelf-double'},
    {key:'checkout',kind:'checkout',footprint:'counter',label:'cashRegister',art:'checkout'},
    {key:'cooler',kind:'cooler',footprint:'cooler',label:'coolerUpgrade',art:'cooler'},
    {key:'fastCheckout',kind:'fastCheckout',footprint:'counter',label:'fasterCheckout',art:'fastCheckout'},
    {key:'decor',kind:'decor',footprint:'decor',label:'storeCharm',art:'decor'}
    ,...Object.entries(DECOR_DEFS).map(([id,item])=>({key:`decor-${id}`,kind:'decor',decorType:id,footprint:'decor',label:item.label,art:'decor',cost:item.cost}))
  ];
  const catalogMatches=(entry,item)=>item.kind===entry.kind && (entry.kind!=='shelf'||item.footprint===entry.footprint)&&(entry.kind!=='decor'||(entry.decorType||null)===(item.decorType||null));
  const catalogCost=entry=>entry.cost||fixtureCost(entry.kind,entry.footprint);
  const catalogAffordable=entry=>entry.kind==='decor'&&!entry.decorType?state().diamond>=1:[...fixtures(),...state().warehouse].some(f=>catalogMatches(entry,f))&&entry.decorType?false:state().cash>=catalogCost(entry);
  function itemArt(id,alt='') {
    const image=document.createElement('img');image.className='item-art';image.src=`./assets/item-${id}-v11.webp`;image.alt=alt;image.width=72;image.height=72;image.decoding='async';return image;
  }
  function fixtureIllustration(fixture) {
    const entry=catalog.find(entry=>catalogMatches(entry,fixture));
    const image=itemArt(entry?.art || 'shelf',fixtureLabel(fixture));image.classList.add('fixture-illustration');return image;
  }
  function buyCatalogItem(entry) {
    if(entry.kind==='decor') {
      if(entry.decorType){if(!catalogAffordable(entry))return false;const purchase=ctx.spendCash(state(),entry.cost,'fixture',{detail:entry.key});if(!purchase.ok)return false;setState(purchase.state);}
      else{if(state().diamond<1 || [...fixtures(),...state().warehouse].filter(f=>f.kind==='decor'&&!f.decorType).length>=6){ctx.toast(ctx.t('needMoreCash',ctx.locale));return false;}state().diamond--;state().diamondSpent++;}
    } else {
      const cost=fixtureCost(entry.kind,entry.footprint);
      const result=(entry.kind==='cooler'||entry.kind==='fastCheckout') ? ctx.purchaseEquipment(state(),entry.kind,cost) : ctx.spendCash(state(),cost,'fixture',{detail:entry.key});
      if(!result.ok){ctx.toast(ctx.t('needMoreCash',ctx.locale));return false;}
      setState(result.state);
    }
    // The starter cooler is already physical property; its paid module upgrades it.
    const existing=entry.kind==='cooler'?[...fixtures(),...state().warehouse].find(f=>f.kind==='cooler'):null;
    const fixture=existing || normalizeFixture({id:`${entry.kind}-${crypto.randomUUID()}`,kind:entry.kind,decorType:entry.decorType,footprint:entry.footprint,product:'water',x:-999,z:-999,rotation:0,appealApplied:false});
    if(!existing)state().warehouse.push(fixture);
    if(entry.kind==='cooler')state().coolerFixtureId=fixture.id;
    if(entry.kind==='fastCheckout')state().fastCheckoutFixtureId=fixture.id;
    selectedCatalogKey=entry.key;ctx.save();syncFixtures();renderPanel();refreshHud();ctx.toast(ctx.t('itemBoughtStored',ctx.locale));return true;
  }
  function renderCatalogRow(entry) {
    const placed=fixtures().filter(f=>catalogMatches(entry,f)),stored=state().warehouse.filter(f=>catalogMatches(entry,f));
    const row=document.createElement('article');row.className='catalog-row';row.dataset.catalogKey=entry.key;
    const imageButton=document.createElement('button');imageButton.type='button';imageButton.className='item-image-button';imageButton.setAttribute('aria-label',`${ctx.t('itemOptions',ctx.locale)} · ${ctx.t(entry.label,ctx.locale)}`);imageButton.setAttribute('aria-expanded',String(selectedCatalogKey===entry.key));
    imageButton.append(itemArt(entry.art));imageButton.addEventListener('click',()=>{selectedCatalogKey=selectedCatalogKey===entry.key?null:entry.key;renderPanel()});
    const copy=document.createElement('div');copy.className='item-copy';const title=document.createElement('h3');title.textContent=ctx.t(entry.label,ctx.locale);
    const counts=document.createElement('p');counts.textContent=`${ctx.t('ownedTotal',ctx.locale)} ${placed.length+stored.length} · ${ctx.t('placedCount',ctx.locale)} ${placed.length} · ${ctx.t('storedCount',ctx.locale)} ${stored.length}`;
    const price=document.createElement('strong');price.className='item-price';price.textContent=entry.kind==='decor'&&!entry.decorType?'1 ✦':ctx.price(catalogCost(entry));copy.append(title,counts,price);
    if(entry.decorType){const effect=document.createElement('p');effect.textContent=`${ctx.t('optionalDecor',ctx.locale)} · ${ctx.t('popularity',ctx.locale)} +${DECOR_DEFS[entry.decorType].appeal}`;copy.append(effect);}
    if(entry.kind==='shelf'||entry.kind==='cooler'){const purpose=document.createElement('p');purpose.textContent=ctx.t(entry.kind==='cooler'?'coolerPurpose':entry.footprint==='double'?'doublePurpose':'singlePurpose',ctx.locale);copy.append(purpose);}
    if(entry.kind==='checkout'){const activation=document.createElement('p');activation.className='activation-cost';activation.textContent=`${ctx.t('counterActivationCost',ctx.locale)} ${ctx.price(REGISTER_COST)} + ${ctx.price(EMPLOYEE_HIRE_COST)} = ${ctx.price(REGISTER_COST+EMPLOYEE_HIRE_COST)}`;copy.append(activation);}
    const buy=actionButton('buyItem',()=>buyCatalogItem(entry));buy.className='item-buy';buy.dataset.buyItem=entry.key;
    buy.disabled=!catalogAffordable(entry)||entry.kind==='decor'&&!entry.decorType&&placed.length+stored.length>=6||((entry.kind==='cooler'||entry.kind==='fastCheckout')&&state().equipment[entry.kind]);
    row.append(imageButton,copy,buy);
    if(selectedCatalogKey===entry.key){
      const options=document.createElement('div');options.className='item-owned-options';
      if(!placed.length&&!stored.length){const hint=document.createElement('p');hint.textContent=ctx.t('buyBeforePlace',ctx.locale);options.append(hint);}
      [...stored,...placed].forEach((fixture,index)=>{
        const line=document.createElement('div');line.className='owned-option';const name=document.createElement('span');const isStored=stored.some(f=>f.id===fixture.id);name.textContent=`${index+1} · ${ctx.t(isStored?'storedCount':'placedCount',ctx.locale)}`;line.append(name);
        line.append(actionButton(isStored?'placeFree':'moveFixture',()=>beginPlacement(fixture.kind,fixture.id,fixture.product,fixture.footprint)));
        if(!isStored){line.append(actionButton('rotateFixture',()=>rotateSelectedFixture(fixture.id)));line.append(actionButton('toWarehouse',()=>warehouseFixture(fixture.id)));}
        options.append(line);
        if(entry.kind==='cooler'){const change=actionButton('changeShelfProduct',()=>{pickerSlot=0;productPickerFixtureId=productPickerFixtureId===fixture.id?null:fixture.id;renderPanel()});options.append(change);if(productPickerFixtureId===fixture.id)options.append(renderProductPicker(fixture));}
      });row.append(options);
    }
    $('panel').append(row);return row;
  }
  function renderGrowthCatalog() {
    const categories=document.createElement('div');categories.className='growth-categories';categories.setAttribute('role','tablist');
    for(const [id,key] of [['equipment','equipmentCategory'],['upgrades','businessUpgrades'],['decor','decorCategory'],['layout','layoutCategory']]){
      const button=document.createElement('button');button.type='button';button.textContent=ctx.t(key,ctx.locale);button.dataset.growthCategory=id;button.setAttribute('role','tab');button.setAttribute('aria-selected',String(growthCategory===id));button.addEventListener('click',()=>{growthCategory=id;selectedCatalogKey=null;renderPanel()});categories.append(button);
    }
    $('panel').append(categories);
    if(growthCategory==='layout'){
      const offer=EXPANSIONS.find(item=>item.from===state().area);
      createCard('growth',ctx.t('expand',ctx.locale),`${state().area} × ${state().area}${offer?` → ${offer.to} × ${offer.to} · +${offer.to**2-offer.from**2}`:''}`,offer?ctx.price(offer.cost):ctx.t('upgradeComplete',ctx.locale),expandStore,{disabled:!offer||state().cash<offer.cost});
      createCard('entrance',ctx.t('entrance',ctx.locale),ctx.t('routeSafetyHint',ctx.locale),'↔',()=>beginEndpointEdit('entrance'));
      createCard('exit',ctx.t('exit',ctx.locale),ctx.t('routeSafetyHint',ctx.locale),'↔',()=>beginEndpointEdit('exit'));
    }else if(growthCategory==='upgrades')renderBusinessUpgrades();
    else for(const entry of catalog.filter(item=>growthCategory==='decor'?item.kind==='decor':item.kind!=='decor'))renderCatalogRow(entry);
    if(growthCategory==='upgrades')renderCashActivity();
  }
  function expandStore(){const result=purchaseExpansion(state());if(!result.ok)return false;setState(result.state);settleAchievementEvent({type:'expansion_purchased',toArea:state().area});ctx.buildFloor();syncFixtures();rerouteLiveCustomers();ctx.resize();ctx.save();renderPanel();ctx.toast(ctx.t('expandSuccess',ctx.locale));return true;}
  function renderBusinessUpgrades(){
    const legacy=Object.values(state().businessUpgrades.legacySkills).reduce((sum,s)=>sum+80*s.checkout*(s.checkout+1)/2+70*s.restock*(s.restock+1)/2,0);
    if(legacy){const hint=document.createElement('p');hint.textContent=`${ctx.t('legacyTraining',ctx.locale)} · ${ctx.price(legacy)}`;$('panel').append(hint);}
    for(const id of ['checkout','restock','storage']){
      const level=state().businessUpgrades.levels[id],cost=businessUpgradeCost(id,level);
      const effect=id==='storage'?`${ctx.stockCapacity(ctx.activeEquipment())} → ${ctx.stockCapacity({...ctx.activeEquipment(),storageLevel:level+1})}`:id==='checkout'?`${(3.5*.8**level).toFixed(1)}s → ${Math.max(.55,3.5*.8**(level+1)).toFixed(1)}s`:`${(12*.82**level).toFixed(1)}s → ${Math.max(2,12*.82**(level+1)).toFixed(1)}s`;
      const button=createCard(id==='storage'?'cooler':'checkout-speed',ctx.t(id==='storage'?'stockCapacity':id==='checkout'?'checkoutSkill':'restockSkill',ctx.locale),`${ctx.t('wholeTeam',ctx.locale)} · ${level}/5 · ${cost?effect:ctx.t('upgradeComplete',ctx.locale)}`,cost?ctx.price(cost):ctx.t('upgradeComplete',ctx.locale),()=>{const result=purchaseBusinessUpgrade(state(),id);if(result.ok){setState(result.state);ctx.save();renderPanel()}},{disabled:!cost||state().cash<cost});button.dataset.businessUpgrade=id;
    }
  }
  function growthGoalRows(){return [
    {id:'firstSale',key:'guideFirst',amount:state().transactions,target:1,tab:'shop'},
    {id:'twoProducts',key:'guideSecond',amount:state().businessPerformance.paidProducts.length,target:2,tab:'shop'},
    {id:'team',key:'guideTeam',amount:employees().length,target:2,tab:'staff'},
    {id:'capacity',key:'guideQueue',amount:staffedCounters().length,target:2,tab:'growth'},
    {id:'expansion',key:'guideExpand',amount:state().area,target:16,tab:'growth'},
    {id:'landmark',key:'guideLandmark',amount:fixtures().filter(f=>f.decorType).length,target:1,tab:'growth'}];}
  function recordGrowthGoals(){for(const goal of growthGoalRows())if(goal.amount>=goal.target&&!state().growthGoals[goal.id])state().growthGoals[goal.id]={activeSeconds:ctx.elapsed};}
  function openManagement(tab){ctx.selectedTab=tab;growthCategory='equipment';document.querySelectorAll('[data-tab]').forEach(button=>button.classList.toggle('active',button.dataset.tab===tab));renderPanel();}
  function renderGuide(){
    if(state().guideDismissed)return;
    const next=growthGoalRows().find(goal=>!state().growthGoals[goal.id]);if(!next)return;
    const section=document.createElement('section');section.className='business-guide';section.setAttribute('aria-label',ctx.t('guideTitle',ctx.locale));
    const text=document.createElement('p');text.textContent=ctx.t(next.key,ctx.locale);const dismiss=actionButton('cancel',()=>{state().guideDismissed=true;ctx.save();renderPanel()});dismiss.className='guide-dismiss';dismiss.textContent='×';
    const go=actionButton('guideTitle',()=>openManagement(next.tab));section.append(text,go,dismiss);$('panel').append(section);
  }
  function renderBusinessSummary(){
    const section=document.createElement('section');section.className='business-summary';
    const heading=document.createElement('h3');heading.textContent=ctx.t('recentBusiness',ctx.locale);section.append(heading);
    const facts=document.createElement('p');facts.dataset.businessSummary='true';section.append(facts);
    for(const goal of growthGoalRows()){const button=actionButton(goal.key,()=>openManagement(goal.tab));button.className='growth-goal';button.textContent=`${state().growthGoals[goal.id]?'✓':''} ${ctx.t(goal.key,ctx.locale)} · ${Math.min(goal.amount,goal.target)}/${goal.target}`;section.append(button);}
    const restore=actionButton('guideTitle',()=>{state().guideDismissed=false;ctx.save();openManagement('shop')});section.append(restore);$('panel').append(section);
  }

  function productLockReason(id) { return `${ctx.t('unlockAt', ctx.locale)} ${ctx.price(PRODUCT_DEFS[id]?.unlock||0)} ${ctx.t('lifetimeSales', ctx.locale)}`; }
  function compatibleProduct(fixture,id){return fixture.kind==='cooler'?Boolean(PRODUCT_DEFS[id]?.cold):!PRODUCT_DEFS[id]?.cold||fixture.legacyShelfCold===id;}
  function setShelfProduct(fixtureId, productId) {
    if (!PRODUCT_DEFS[productId] || !state().unlocked.includes(productId)) { ctx.toast(productLockReason(productId)); return false; }
    const fixture = [...fixtures(),...state().warehouse].find(item => item.id === fixtureId && ['shelf','cooler'].includes(item.kind));
    if (!fixture) return false;
    if(!compatibleProduct(fixture,productId)){ctx.toast(ctx.t(PRODUCT_DEFS[productId]?.cold?'coldOnly':'dryOnly',ctx.locale));return false;}
    fixture[pickerSlot?'product2':'product'] = productId; productPickerFixtureId = null;
    syncFixtures(); rerouteLiveCustomers(); ctx.save(); renderPanel(); ctx.toast(`${ctx.t('shelfProductChanged', ctx.locale)} · ${productName(productId)}`); return true;
  }
  function renderProductPicker(fixture) {
    const picker = document.createElement('div'); picker.className = 'shelf-product-picker'; picker.setAttribute('role','group'); picker.setAttribute('aria-label',ctx.t('chooseProduct',ctx.locale));
    if(fixture.footprint==='double'||fixture.kind==='cooler')for(const slot of [0,1]){const button=document.createElement('button');button.type='button';button.textContent=`${ctx.t('productToDisplay',ctx.locale)} ${slot+1}`;button.setAttribute('aria-pressed',String(pickerSlot===slot));button.addEventListener('click',()=>{pickerSlot=slot;renderPanel()});picker.append(button);}
    for (const id of Object.keys(PRODUCT_DEFS)) {
      const unlocked = state().unlocked.includes(id),compatible=compatibleProduct(fixture,id),selected=fixture[pickerSlot?'product2':'product']===id; const button = document.createElement('button'); button.type = 'button'; button.dataset.productId = id; button.disabled = !unlocked||!compatible;
      button.className = `product-choice${selected ? ' is-selected' : ''}`; button.setAttribute('aria-pressed',String(selected));
      const sample = itemArt(id);
      const name = document.createElement('strong'); name.textContent = productName(id);
      const note = document.createElement('small'); note.textContent = !compatible?ctx.t(PRODUCT_DEFS[id]?.cold?'coldOnly':'dryOnly',ctx.locale):unlocked ? `${ctx.t('availableStock',ctx.locale)} ${state().stock[id] || 0}` : productLockReason(id);
      button.append(sample,name,note); button.addEventListener('click',()=>transact(()=>setShelfProduct(fixture.id,id))); picker.append(button);
    }
    return picker;
  }
  function refreshPlacementProducts(selected) {
    const select = $('placementProduct'); select.replaceChildren();
    for (const id of Object.keys(PRODUCT_DEFS)) { const option = document.createElement('option'); option.value = id;const compatible=compatibleProduct(getPlacement()||{kind:'shelf'},id); option.disabled = !state().unlocked.includes(id)||!compatible; option.textContent = `${productName(id)}${!compatible?` · ${ctx.t('coldOnly',ctx.locale)}`:option.disabled ? ` · ${productLockReason(id)}` : ''}`; select.append(option); }
    select.value = selected;
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
    const detailLabels = { 'shelf-single':'smallShelf','shelf-double':'doubleShelf',shelf: 'shelf', checkout: 'cashRegister', cooler: 'coolerUpgrade',
      fastCheckout: 'fasterCheckout', expansion: 'expand', helper: 'hireHelper', cashier: 'hireCashier' };
    for (const entry of ledger) {
      const row = document.createElement('div'); row.className = 'cash-activity-row';
      const name = document.createElement('span');
      const label = ctx.t(entry.kind==='employee'?'hireEmployee':entry.kind==='staffSkill'?(entry.detail==='checkout'?'checkoutSkill':'restockSkill'):entry.kind==='autoRestock'?'restockAction':labels[entry.kind] || 'purchaseLabel', ctx.locale);
      const product = entry.product ? ` · ${ctx.t(PRODUCT_DEFS[entry.product]?.label || entry.product, ctx.locale)}` : '';
      const detailKey = entry.detail || (['cashier', 'helper', 'expansion'].includes(entry.kind) ? entry.kind : '');
      const detail = entry.kind==='staffSkill'?'':entry.kind==='employee'?` · ${ctx.t(entry.detail==='checkout'?'cashierRole':'restockerRole',ctx.locale)}`:detailLabels[detailKey] ? ` · ${ctx.t(detailLabels[detailKey], ctx.locale)}` : '';
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
    ctx.selectedTab = 'growth';
    document.querySelectorAll('[data-tab]').forEach(button => button.classList.toggle('active', button.dataset.tab === 'growth'));
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
      rotate.addEventListener('click', () => transact(()=>rotateSelectedFixture(fixture.id)));
      const store = document.createElement('button'); store.className = 'fixture-store'; store.textContent = ctx.t('toWarehouse', ctx.locale);
      store.addEventListener('click', () => transact(()=>warehouseFixture(fixture.id)));
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
    const stockTotal = ownedStock();
    const quantity = Math.min(requested, Math.max(0, capacity - stockTotal), Math.floor(state().cash / product.cost));
    if (!quantity) { ctx.toast(ctx.t(stockTotal >= capacity ? 'capacityFull' : 'cashShort', ctx.locale)); return; }
    const purchase = ctx.spendCash(state(), quantity * product.cost, 'restock', { product: productId, quantity });
    if (!purchase.ok) { ctx.toast(ctx.t('cashShort', ctx.locale)); return; }
    setState(purchase.state); state().stock[productId] = (state().stock[productId] || 0) + quantity;
    ctx.save(); syncStockDisplays(); refreshPanelValues(); refreshHud();
    ctx.toast(`${quantity} ${product.name} · ${ctx.t('orderedFor', ctx.locale)} ${ctx.price(quantity * product.cost)}`);
  }

  function nextVacantRegister() { return allCounters().find(counter=>!counterEmployee(counter.id)) || null; }
  function hireCashier(registerId = null) {
    const vacancy = registerId?allCounters().find(counter=>counter.id===registerId&&!counterEmployee(counter.id)):nextVacantRegister();
    if (!vacancy) { ctx.toast(ctx.t('noRegisterVacancy', ctx.locale)); return false; }
    if (!routeToCheckout([], vacancy)) { ctx.toast(ctx.t('routeBlocked', ctx.locale)); return false; }
    if (state().cash < CASHIER_HIRE_COST) { ctx.toast(ctx.t('needMoreCash', ctx.locale)); return; }
    const hire = hireStoreEmployee(state(),'checkout',vacancy.id);
    if (!hire.ok) { ctx.toast(ctx.t('needMoreCash', ctx.locale)); return; }
    setState(hire.state);
    syncFixtures(); ctx.save(); ctx.renderPanel(); $('panel').scrollTop = 0; refreshHud();
    ctx.toast(`${ctx.t('cashierHired', ctx.locale)} · ${state().cashierCount}`);
    return true;
  }

  function hireEmployee(role='restock') {
    if(role==='checkout')return hireCashier();
    const result=hireStoreEmployee(state(),role);
    if(!result.ok){ctx.toast(ctx.t('needMoreCash',ctx.locale));return false;}
    setState(result.state);ctx.save();renderPanel();return true;
  }

  function renderEmployees() {
    const section=document.createElement('section');section.className='employee-roster';
    for(const [index,employee] of employees().entries()){
      const card=document.createElement('article');card.className='employee-card';card.dataset.employeeId=employee.id;
      const label=document.createElement('label');label.className='employee-heading';label.textContent=`${ctx.t('employee',ctx.locale)} ${index+1}`;
      const select=document.createElement('select');select.dataset.employeeRole=employee.id;
      for(const role of ['checkout','restock']){const option=document.createElement('option');option.value=role;option.textContent=ctx.t(role==='checkout'?'cashierRole':'restockerRole',ctx.locale);option.disabled=role==='checkout'&&employee.role!=='checkout'&&!nextVacantRegister();select.append(option);}
      select.value=employee.role;label.append(select);card.append(label);
      select.addEventListener('change',()=>{const role=select.value;transact(()=>{
        const result=changeEmployeeRole(state(),employee.id,role);
        if(!result.ok){select.value=employee.role;ctx.toast(ctx.t('noRegisterVacancy',ctx.locale));return;}
        setState(result.state);rerouteLiveCustomers();syncFixtures();ctx.save();renderPanel();
      });});
      const registerIndex=allCounters().findIndex(f=>f.id===employee.registerId);
      const status=document.createElement('p');status.textContent=employee.role==='restock'?ctx.t('helperAutoRestockHint',ctx.locale):registerIndex>=0?`${ctx.t('cashRegister',ctx.locale)} ${registerIndex+1}`:employee.registerId?ctx.t('storedInactive',ctx.locale):ctx.t('employeeUnassigned',ctx.locale);card.append(status);
      section.append(card);
    }
    const hire=actionButton('hireEmployee',()=>hireEmployee($('newEmployeeRole').value));hire.id='hireEmployee';hire.textContent+=` · ${ctx.price(EMPLOYEE_HIRE_COST)}`;hire.disabled=state().cash<EMPLOYEE_HIRE_COST;
    const role=document.createElement('select');role.id='newEmployeeRole';role.setAttribute('aria-label',ctx.t('employeeRole',ctx.locale));
    for(const value of ['restock','checkout']){const option=document.createElement('option');option.value=value;option.textContent=ctx.t(value==='checkout'?'cashierRole':'restockerRole',ctx.locale);option.disabled=value==='checkout'&&!nextVacantRegister();role.append(option);}
    section.append(role,hire);$('panel').append(section);
  }

  function renderShelves() {
    const shelves=[...fixtures(),...state().warehouse].filter(f=>f.kind==='shelf'||f.kind==='cooler'&&state().equipment.cooler);
    shelves.forEach((fixture,index)=>{
      const stored=state().warehouse.some(f=>f.id===fixture.id),expanded=selectedFixtureId===fixture.id;
      const card=document.createElement('article');card.className=`owned-shelf-card compact-shelf${expanded?' is-selected':''}`;card.dataset.fixtureId=fixture.id;
      const image=document.createElement('button');image.type='button';image.className='item-image-button';image.setAttribute('aria-label',`${ctx.t('itemOptions',ctx.locale)} · ${ctx.t('shelfUnit',ctx.locale)} ${index+1}`);image.setAttribute('aria-expanded',String(expanded));image.append(itemArt(fixture.product));image.addEventListener('click',()=>{selectedFixtureId=expanded?null:fixture.id;renderPanel()});
      const copy=document.createElement('div');copy.className='item-copy';const title=document.createElement('h3');title.textContent=`${ctx.t('shelfUnit',ctx.locale)} ${index+1} · ${productName(fixture.product)}`;
      for(const id of fixtureProducts(fixture)){const count=document.createElement('p');count.dataset.shelfStock=id;copy.append(count);}
      const status=document.createElement('small');status.textContent=ctx.t(stored?'storedCount':'placedCount',ctx.locale);copy.append(status);card.append(image,copy);
      for(const id of fixtureProducts(fixture)){const insight=document.createElement('small');insight.dataset.skuInsight=id;copy.append(insight);}
      const actions=document.createElement('div');actions.className='shelf-actions';
      if(stored)actions.append(actionButton('placeFree',()=>beginPlacement(fixture.kind,fixture.id,fixture.product,fixture.footprint)));
      else{for(const id of fixtureProducts(fixture)){const order=actionButton('restockAction',()=>stockOrder(id));order.dataset.restockProduct=id;actions.append(order);}actions.append(actionButton('rotateFixture',()=>rotateSelectedFixture(fixture.id)));}
      card.append(actions);
      if(expanded){const tools=document.createElement('div');tools.className='shelf-expanded';tools.append(actionButton('changeShelfProduct',()=>{pickerSlot=0;productPickerFixtureId=productPickerFixtureId===fixture.id?null:fixture.id;renderPanel()}));if(!stored)tools.append(actionButton('moveFixture',()=>beginPlacement(fixture.kind,fixture.id,fixture.product,fixture.footprint)),actionButton('toWarehouse',()=>warehouseFixture(fixture.id)));card.append(tools);if(productPickerFixtureId===fixture.id)card.append(renderProductPicker(fixture));}
      $('panel').append(card);
    });
    for(const entry of catalog.filter(item=>item.kind==='shelf'))renderCatalogRow(entry);
  }

  function refreshPanelValues() {
    for(const node of document.querySelectorAll('[data-shelf-stock]')){const id=node.dataset.shelfStock,p=ctx.PRODUCTS[id];node.textContent=`${ctx.t('availableStock',ctx.locale)} ${state().stock[id]||0} · ${ctx.t('buyPrice',ctx.locale)} ${ctx.price(p.cost)} · ${ctx.t('sellPrice',ctx.locale)} ${ctx.price(p.price)}`;}
    for(const button of document.querySelectorAll('[data-restock-product]')){
      const id=button.dataset.restockProduct,product=ctx.PRODUCTS[id],quantity=Math.min(8,Math.max(0,ctx.stockCapacity(ctx.activeEquipment())-ownedStock()),Math.floor(state().cash/product.cost));
      button.textContent=`${productName(id)} +${quantity} · ${ctx.price(quantity*product.cost)}`;button.disabled=!quantity;
    }
    for(const node of document.querySelectorAll('[data-sku-insight]')){const id=node.dataset.skuInsight,product=PRODUCT_DEFS[id],facts=businessPerformance(state().businessPerformance,ctx.elapsed,id),elapsed=Math.min(180,ctx.elapsed),rate=elapsed>=30&&facts.payments>=3?facts.payments/(elapsed/60):0;node.textContent=`${ctx.t('unitMargin',ctx.locale)} ${ctx.price(product.price-product.cost)} · ${ctx.t('demandEstimate',ctx.locale)} ${product.demand.toFixed(2)} · ${ctx.t('actualPaid',ctx.locale)} ${facts.payments}${rate?` · ${ctx.t('stockMinutes',ctx.locale)} ~${((state().stock[id]||0)/rate).toFixed(1)}`:` · ${ctx.t('moreData',ctx.locale)}`}`;}
    for(const node of document.querySelectorAll('[data-business-summary]')){const facts=businessPerformance(state().businessPerformance,ctx.elapsed);node.textContent=`${ctx.t('actualPaid',ctx.locale)} ${facts.payments} · ${ctx.t('lifetimeSales',ctx.locale)} ${ctx.price(facts.gross)} · ${ctx.t('unitMargin',ctx.locale)} ${ctx.price(facts.margin)} · ${ctx.t('queue',ctx.locale)} ${getCustomers().filter(c=>c.state==='queue'||c.state==='pay').length}/${staffedCounters().length*QUEUE_LIMIT_PER_REGISTER} · ${ctx.t('stockouts',ctx.locale)} ${state().businessPerformance.stockouts} · ${ctx.t('stockCapital',ctx.locale)} ${ctx.price(Object.entries(state().stock).reduce((sum,[id,quantity])=>sum+(PRODUCT_DEFS[id]?.cost||0)*quantity,0)+getCustomers().filter(c=>c.carried).reduce((sum,c)=>sum+(PRODUCT_DEFS[c.product]?.cost||0),0))}`;}
    for(const button of document.querySelectorAll('[data-business-upgrade]')){const cost=businessUpgradeCost(button.dataset.businessUpgrade,state().businessUpgrades.levels[button.dataset.businessUpgrade]);button.disabled=!cost||state().cash<cost;}
    const hire=$('hireEmployee');if(hire)hire.disabled=state().cash<EMPLOYEE_HIRE_COST||($('newEmployeeRole').value==='checkout'&&!nextVacantRegister());
    for(const button of document.querySelectorAll('[data-hire-register]'))button.disabled=state().cash<EMPLOYEE_HIRE_COST||Boolean(counterEmployee(button.dataset.hireRegister))||!routeToCheckout([],allCounters().find(f=>f.id===button.dataset.hireRegister));
    for(const button of document.querySelectorAll('[data-buy-item]')){const entry=catalog.find(item=>item.key===button.dataset.buyItem);button.disabled=!catalogAffordable(entry)||entry.kind==='decor'&&!entry.decorType&&[...fixtures(),...state().warehouse].filter(f=>catalogMatches(entry,f)).length>=6||Boolean((entry.kind==='cooler'||entry.kind==='fastCheckout')&&state().equipment[entry.kind]);}
  }

  function ownedStock(){return ctx.totalStock(state().stock)+getCustomers().filter(c=>c.carried).length;}

  function renderRegisterRoster() {
    const section = document.createElement('section'); section.className = 'register-roster';
    const heading = document.createElement('h3'); heading.textContent = ctx.t('registerRoster', ctx.locale); section.append(heading);
    const counters = allCounters(), staffed = new Set(staffedCounters().map(counter => counter.id)), next = nextVacantRegister();
    counters.forEach((counter, index) => {
      const row = document.createElement('article'); row.className = 'register-staff-card'; row.dataset.registerId = counter.id;
      row.append(fixtureIllustration(counter));
      const copy = document.createElement('div'); const title = document.createElement('h4'); title.textContent = `${ctx.t('cashRegister', ctx.locale)} ${index + 1}`;
      const status = document.createElement('p'); status.className = staffed.has(counter.id) ? 'register-staffed' : 'register-vacant'; status.textContent = ctx.t(staffed.has(counter.id) ? 'registerStaffed' : 'registerVacant', ctx.locale);
      copy.append(title,status); row.append(copy);
      if (!staffed.has(counter.id)) {
        const valid = routeToCheckout([], counter); const hire = actionButton('hireForRegister',()=>hireCashier(counter.id)); hire.textContent += ` · ${ctx.price(CASHIER_HIRE_COST)}`; hire.dataset.hireRegister = counter.id;
        hire.disabled = next?.id !== counter.id || !valid || state().cash < CASHIER_HIRE_COST; row.append(hire);
        const reason = document.createElement('small'); reason.textContent = !valid ? ctx.t('routeBlocked', ctx.locale) : next?.id !== counter.id ? ctx.t('fillFirstVacancy',ctx.locale) : state().cash < CASHIER_HIRE_COST ? ctx.t('needMoreCash',ctx.locale) : ctx.t('cashierHireDetail',ctx.locale); row.append(reason);
      }
      section.append(row);
    });
    if (!next) { const hint = document.createElement('p'); hint.className = 'register-hire-hint'; hint.textContent = ctx.t('noRegisterVacancy',ctx.locale); section.append(hint); }
    const add = actionButton('addRegister',buyRegister); add.className = 'add-register-action'; add.textContent += ` · ${ctx.price(REGISTER_COST)}`; add.disabled = state().cash < REGISTER_COST; section.append(add);
    $('panel').append(section);
  }

  function buyRegister() {
    const purchased=buyCatalogItem(catalog.find(entry=>entry.key==='checkout'));
    if(purchased){ctx.selectedTab='growth';growthCategory='equipment';document.querySelectorAll('[data-tab]').forEach(button=>button.classList.toggle('active',button.dataset.tab==='growth'));renderPanel();}
    return purchased;
  }

  function expandDecorAppeal() {
    const count = decorativeCount();
    const next = Math.max(1, 5 - count * .7);
    state().popularity = clampPopularity(state().popularity + next);
    ctx.save(); refreshHud();
  }

  function renderPanel() {
    if (!isInstalled || simulationBusy) return;
    const scroll=$('panel').dataset.activeTab===ctx.selectedTab?$('panel').scrollTop:0;
    const active=document.activeElement,focusSelector=active?.dataset.buyItem?`[data-buy-item="${CSS.escape(active.dataset.buyItem)}"]`:active?.dataset.restockProduct?`[data-restock-product="${CSS.escape(active.dataset.restockProduct)}"]`:active?.id?`#${CSS.escape(active.id)}`:null;
    applyFloorArt();
    syncStockDisplays();
    $('panel').replaceChildren();
    mapProducts(); unlockedProducts();
    const tab = ctx.selectedTab;
    $('panel').dataset.activeTab = tab;
    renderGuide();
    if (tab === 'achievements') {
      renderAchievements();
      $('panel').scrollTop=scroll;
      return;
    }
    if (tab === 'shop') renderShelves();
    if (tab === 'growth') renderGrowthCatalog();
    if(tab==='growth')renderBusinessSummary();
    if (tab === 'staff') {
      renderEmployees();
      renderRegisterRoster();
      const auto = createCard('auto-restock', ctx.t('autoRestock', ctx.locale), ctx.t('autoRestockOptIn', ctx.locale),
        state().autoRestockEnabled ? ctx.t('autoRestockOn', ctx.locale) : ctx.t('autoRestockOff', ctx.locale), () => {
          if (!employees().some(e=>e.role==='restock')) { ctx.toast(ctx.t('helperNeeded', ctx.locale)); return; }
          state().autoRestockEnabled = !state().autoRestockEnabled;
          ctx.save(); renderPanel(); refreshHud();
          ctx.toast(ctx.t(state().autoRestockEnabled ? 'autoRestockTurnedOn' : 'autoRestockTurnedOff', ctx.locale));
        }, { disabled: !employees().some(e=>e.role==='restock'), className: state().autoRestockEnabled ? 'toggle-card active' : 'toggle-card' });
      auto.setAttribute('aria-pressed', String(Boolean(state().autoRestockEnabled)));
    }
    if (getPlacement()) {
      $('placementControls').hidden = false;
      $('placementProduct').value = getPlacement().product || 'water';
      $('placementFootprint').value = getPlacement().footprint || 'single';
    }
    $('selectedTileReadout').textContent = selectedFloor ? `${ctx.t('selectedTile', ctx.locale)} · ${selectedFloor.x + 1}, ${selectedFloor.z + 1}` : ctx.t('noTileSelected', ctx.locale);
    refreshHud();
    refreshPanelValues();
    $('panel').scrollTop=scroll;
    if(focusSelector)$('panel').querySelector(focusSelector)?.focus({preventScroll:true});
  }

  function pointFromEvent(event) {
    return ctx.gridPoint(event);
  }

  function fixtureFromEvent(event) {
    const rect=ctx.canvas.getBoundingClientRect();if(!rect.width||!rect.height)return null;
    const ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1),ctx.camera);
    let mesh=ray.intersectObjects([...getMeshes().values()],true)[0]?.object;
    while(mesh&&!mesh.userData.fixture)mesh=mesh.parent;
    return fixtures().find(f=>f.id===mesh?.userData.fixture) || null;
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
    const visualFixture=!getPlacement()&&!endpointEdit?fixtureFromEvent(event):null;
    const point = pointFromEvent(event) || (visualFixture?{x:visualFixture.x,z:visualFixture.z}:null);
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
      fixture: !getPlacement() && !endpointEdit ? visualFixture || fixtureAt(point) : null,
      mode: getPlacement() ? 'placement' : endpointEdit ? 'layout-edit' : (cameraOrbit ? 'orbit' : 'pan') };
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
        if(cameraOrbit&&!getPlacement()&&!endpointEdit)state().view += Math.atan2(Math.sin(angle - pinchState.angle), Math.cos(angle - pinchState.angle));
        ctx.setCamera();
        ctx.save();
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
    } else if(current.mode==='orbit') {
      if(current.moved){state().view+=deltaX*.008;ctx.setCamera();ctx.save();}
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
          ctx.selectedTab = current.fixture.kind==='shelf'?'shop':'growth';growthCategory=current.fixture.kind==='decor'?'decor':'equipment';selectedCatalogKey=catalog.find(entry=>catalogMatches(entry,current.fixture))?.key;
          document.querySelectorAll('[data-tab]').forEach(button => button.classList.toggle('active', button.dataset.tab === ctx.selectedTab));
          renderPanel();$('panel').querySelector(`[data-fixture-id="${CSS.escape(current.fixture.id)}"]`)?.scrollIntoView({block:'nearest'});
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
    const orbit=actionButton('cameraOrbit',()=>{if(getPlacement()||endpointEdit)return;cameraOrbit=!cameraOrbit;orbit.setAttribute('aria-pressed',String(cameraOrbit));ctx.toast(ctx.t(cameraOrbit?'cameraDragRotate':'cameraDragPan',ctx.locale));});orbit.id='cameraOrbit';orbit.className='camera-orbit';orbit.setAttribute('aria-pressed','false');document.querySelector('.scene-wrap').append(orbit);
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
    $('placementProduct').addEventListener('change', () => {
      const placement = getPlacement(); if (placement?.kind !== 'shelf') return;
      const id = $('placementProduct').value;
      if (!state().unlocked.includes(id)) { $('placementProduct').value = placement.product; ctx.toast(productLockReason(id)); return; }
      placement.product = id;
    });
    $('placementFootprint').addEventListener('change', onFootprintChange);
    document.addEventListener('keydown', event => {
      if(event.target.closest('input,select,textarea'))return;
      if (event.key === 'Escape') cancelPlacement();
      if ((event.key.toLowerCase() === 'r') && selectedFixtureId) transact(()=>rotateSelectedFixture(selectedFixtureId));
      if(cameraOrbit&&!getPlacement()&&!endpointEdit&&['q','e'].includes(event.key.toLowerCase())){state().view+=(event.key.toLowerCase()==='q'?-.12:.12);ctx.setCamera();ctx.save();}
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
    unlockedProducts();
    current.popularity = clampPopularity(current.popularity + currentDecorAppeal() * .00025);
    if (current.popularity < TRAFFIC_RECOVERY_FLOOR) current.popularity = clampPopularity(current.popularity + .012);
    const nextInterval = trafficInterval(current.popularity);
    if (ctx.spawnTimer > nextInterval) ctx.spawnTimer = nextInterval;
  }

  function staffHome(employee) {
    const layoutKey=JSON.stringify([state().area,fixtures().map(f=>[f.id,f.x,f.z,f.rotation,f.product,f.product2]),state().entrances,state().exits,employees().filter(e=>e.role==='restock').map(e=>e.id)]);
    if(cachedHomeLayout!==layoutKey){cachedHomeLayout=layoutKey;cachedHomes.clear();}
    if(cachedHomes.has(employee.id))return cachedHomes.get(employee.id);
    const origin=state().entrances[0] || {x:0,z:0};
    const index=Math.max(0,employees().filter(e=>e.role==='restock').findIndex(e=>e.id===employee.id));
    const doors=[...state().entrances,...state().exits],queues=allCounters().flatMap(counter=>Array.from({length:QUEUE_LIMIT_PER_REGISTER},(_,rank)=>queueTile(counter,rank)));
    const choices=[];
    for(let z=0;z<state().area;z++)for(let x=0;x<state().area;x++)if(walkable(x,z)
      &&doors.every(p=>Math.abs(p.x-x)+Math.abs(p.z-z)>1)&&!queues.some(p=>p.x===x&&p.z===z))choices.push({x,z});
    choices.sort((a,b)=>Math.abs(a.x-origin.x)+Math.abs(a.z-origin.z)-Math.abs(b.x-origin.x)-Math.abs(b.z-origin.z));
    const reachable=choices.filter(p=>findPath(origin,[p]).length);
    const home=reachable[Math.min(index,reachable.length-1)] || {x:employee.work?.x??origin.x,z:employee.work?.z??origin.z};cachedHomes.set(employee.id,home);return home;
  }
  function automaticRestock(delta) {
    const layoutKey=JSON.stringify([state().area,fixtures().map(f=>[f.id,f.x,f.z,f.rotation,f.product,f.product2]),state().entrances,state().exits]);
    // Only simulation transactions advance these saved jobs. Drawing never settles stock.
    for(const id of employees().filter(e=>e.role==='restock').map(e=>e.id)) {
      let employee=employees().find(e=>e.id===id),home=staffHome(employee);
      let job=employee.work;
      if(!job || !Number.isFinite(job.x) || !Number.isFinite(job.z))job=employee.work={phase:'idle',...home,heading:0,path:[],wait:0};
      if(!['idle','travel','stock','return'].includes(job.phase))job.phase='idle';
      if(!Array.isArray(job.path))job.path=[];
      if(!Number.isFinite(job.wait))job.wait=0;
      if(!state().autoRestockEnabled){job.phase='idle';job.path=[];employee.workSeconds=0;continue;}
      const target=salesFixtures(job.productId).find(f=>f.id===job.targetId);
      if((job.phase==='travel'||job.phase==='stock')&&!target){job.phase='idle';job.path=[];job.wait=0;}
      if(job.layoutKey!==layoutKey){
        job.layoutKey=layoutKey;
        const start={x:Math.round(job.x),z:Math.round(job.z)};
        if(!walkable(start.x,start.z)){job.x=home.x;job.z=home.z;job.phase='idle';job.path=[];job.wait=0;}
        else if(job.phase==='travel'||job.phase==='stock'){
          const goals=accessTiles(target),atGoal=goals.some(p=>p.x===start.x&&p.z===start.z);
          job.path=findPath(start,goals);job.phase=atGoal?'stock':job.path.length?'travel':'idle';job.wait=0;
        }else if(job.phase==='return'||job.phase==='idle'){
          job.path=findPath(start,[home]);job.phase=job.path.length?'return':'idle';
        }
      }
      if(job.phase==='idle') {
        employee.workSeconds+=delta;
        if(employee.workSeconds<employeeRestockSeconds(trained(employee)))continue;
        const claimed=new Set(employees().filter(e=>e.id!==id&&['travel','stock'].includes(e.work?.phase)).map(e=>e.work.productId));
        const candidates=fixtures().filter(f=>f.kind==='shelf'||f.kind==='cooler'&&state().equipment.cooler).flatMap(f=>fixtureProducts(f).map(product=>({...f,product}))).filter(f=>!claimed.has(f.product)&&state().unlocked.includes(f.product)&&(state().stock[f.product]||0)<6)
          .sort((a,b)=>(state().stock[a.product]||0)-(state().stock[b.product]||0));
        const free=walkable(Math.round(job.x),Math.round(job.z));
        if(!free){job.x=home.x;job.z=home.z;}
        for(const fixture of candidates){
          const path=findPath({x:Math.round(job.x),z:Math.round(job.z)},accessTiles(fixture));
          const alreadyThere=accessTiles(fixture).some(p=>p.x===Math.round(job.x)&&p.z===Math.round(job.z));
          if(!path.length&&!alreadyThere)continue;
          employee.workSeconds=0;Object.assign(job,{phase:path.length?'travel':'stock',targetId:fixture.id,productId:fixture.product,path,wait:0,delivered:0,jobId:crypto.randomUUID()});break;
        }
      } else if(job.phase==='travel'||job.phase==='return') {
        if(job.path.length && !walkable(job.path[0].x,job.path[0].z)) {
          const goals=job.phase==='return'?[home]:accessTiles(target);
          job.path=findPath({x:Math.round(job.x),z:Math.round(job.z)},goals);
          if(!job.path.length){job.phase='idle';continue;}
        }
        const point=job.path[0];
        if(point){const dx=point.x-job.x,dz=point.z-job.z,distance=Math.hypot(dx,dz),step=Math.min(distance,delta*2.2);job.heading=smoothHeading(job.heading,Math.atan2(dx,dz),delta);if(distance<=step+.0001){job.x=point.x;job.z=point.z;job.path.shift();}else{job.x+=dx/distance*step;job.z+=dz/distance*step;}}
        if(!job.path.length){job.phase=job.phase==='return'?'idle':'stock';job.wait=0;}
      } else if(job.phase==='stock') {
        if(!accessTiles(target).some(p=>p.x===Math.round(job.x)&&p.z===Math.round(job.z))){job.phase='idle';job.wait=0;continue;}
        const center=fixtureCenter(target);job.heading=smoothHeading(job.heading,Math.atan2(center.x-job.x,center.z-job.z),delta);job.wait+=delta;
        if(job.wait<Math.max(.65,1.4*.82**trained(employee).skills.restock))continue;
        const product=ctx.PRODUCTS[job.productId],room=ctx.stockCapacity(ctx.activeEquipment())-ownedStock();
        const quantity=Math.min(EMPLOYEE_RESTOCK_BATCH,Math.max(0,room),Math.floor(state().cash/product.cost));
        // Advance first; the cash/stock and return phase are one atomic persisted commit.
        job.phase='return';job.wait=0;job.path=findPath({x:Math.round(job.x),z:Math.round(job.z)},[home]);
        if(quantity>0){const purchase=ctx.spendCash(state(),quantity*product.cost,'autoRestock',{product:job.productId,quantity});if(purchase.ok){setState(purchase.state);state().stock[job.productId]=(state().stock[job.productId]||0)+quantity;employee=employees().find(e=>e.id===id);employee.work.delivered=quantity;ctx.save();}}
      }
    }
  }

  function makeStaffModel(primary,role) {
    const group=new THREE.Group();group.name='uniform-employee';
    const skin=primary?0x9da7af:0xc69b75;
    const block=(name,color,x,y,z,sx,sy,sz)=>ctx.cube(group,name,color,x,y,z,sx,sy,sz);
    block('uniform-body',0x087e77,0,.78,0,.62,.68,.4);
    block('uniform-apron',0x0caf9b,0,.7,.245,.52,.55,.08);
    block('uniform-belt',0x83532b,0,.51,.25,.58,.08,.07);
    block('uniform-pocket',0x06675d,.12,.68,.3,.21,.18,.035);
    block('staff-badge',0xffd26b,-.16,.98,.245,.14,.1,.045);
    block('head',skin,0,1.37,.015,.73,.61,.56);
    block('muzzle',0xc6c9c7,0,1.22,.33,.4,.25,.2);
    for(const x of [-.2,.2]){
      block('ear',skin,x*1.45,1.75,0,.21,.29,.2);block('inner-ear',0xe1b7b2,x*1.45,1.76,.11,.1,.16,.02);
      block('eye-white',0xfff6de,x,1.43,.304,.16,.2,.055);block('eye-pupil',0x483121,x,1.43,.34,.08,.12,.035);block('eye-glint',0xffffff,x-.02,1.47,.366,.035,.04,.015);
    }
    block('eyebrow',0x324650,-.2,1.57,.31,.18,.055,.045);block('eyebrow',0x324650,.2,1.57,.31,.18,.055,.045);
    block('smile',0x423631,.05,1.15,.445,.12,.045,.025);
    block('uniform-cap',0x064951,0,1.72,.01,.63,.15,.48);block('uniform-brim',0x17a593,0,1.65,.27,.67,.07,.25);
    block('cap-badge',0xf1be42,0,1.74,.26,.15,.1,.035);
    if(primary){
      // Cuboid gear horn, goggles, shoulder kit and pocket tool match the original Rux.
      for(const x of [-.18,.18]){block('goggle-frame',0xe5a425,x,1.73,.305,.27,.23,.08);block('goggle-lens',0x21aaad,x,1.73,.353,.18,.14,.04);}
      for(const [x,y,sx,sy] of [[0,1.53,.28,.08],[0,1.25,.28,.08],[-.18,1.39,.08,.28],[.18,1.39,.08,.28],[0,1.61,.09,.13],[0,1.17,.09,.13],[-.26,1.39,.13,.09],[.26,1.39,.13,.09]])block('rux-gear-horn',0xf6bb36,x-.4,y,.48,sx,sy,.19);
      block('tool-strap',0x83532b,.34,.84,.03,.08,.61,.44);block('tool-pouch',0x9f6435,.4,.53,.12,.16,.28,.27);block('wrench',0xbfc8ca,.43,.78,.25,.05,.24,.06);
    }
    for(const side of [-1,1]){
      const arm=new THREE.Group();arm.name=side<0?'staff-arm-left':'staff-arm-right';arm.position.set(side*.41,1.0,0);group.add(arm);ctx.cube(arm,'uniform-sleeve',0x087e77,0,-.13,0,.2,.3,.24);ctx.cube(arm,'hand',skin,0,-.36,.02,.2,.21,.22);
      const leg=new THREE.Group();leg.name=side<0?'staff-leg-left':'staff-leg-right';leg.position.set(side*.17,.43,0);group.add(leg);ctx.cube(leg,'uniform-trouser',0x294d58,0,-.14,0,.25,.32,.29);ctx.cube(leg,'boot',0x614a35,0,-.35,.05,.29,.17,.4);ctx.cube(leg,'boot-trim',0xf2bf56,0,-.35,.255,.23,.11,.025);
    }
    const crate=new THREE.Group();crate.name='staff-crate';crate.position.set(0,.83,.53);group.add(crate);ctx.cube(crate,'crate-box',0xc99b62,0,0,0,.52,.31,.39);ctx.cube(crate,'crate-band',0xf8e3b8,0,0,.2,.12,.31,.02);ctx.cube(crate,'crate-label',0x30c0d0,.13,.02,.22,.15,.12,.02);crate.visible=role==='restock';
    batchBoxes(group);
    return group;
  }
  function drawEmployees(delta=.1) {
    const oldRux=ctx.scene.getObjectByName('rux-shopkeeper');if(oldRux){ctx.scene.remove(oldRux);oldRux.traverse(o=>o.geometry?.dispose());}
    const ids=new Set(employees().map(e=>e.id));
    for(const [id,mesh] of employeeMeshes)if(!ids.has(id)){ctx.scene.remove(mesh);mesh.traverse(o=>{o.geometry?.dispose();if(o.isInstancedMesh)o.dispose();if(o.userData.ownedFixtureMaterial)o.material?.dispose();});employeeMeshes.delete(id);}
    for(const employee of employees()){
      let mesh=employeeMeshes.get(employee.id);
      if(mesh&&mesh.userData.role!==employee.role){ctx.scene.remove(mesh);mesh.traverse(o=>{o.geometry?.dispose();if(o.isInstancedMesh)o.dispose();if(o.userData.ownedFixtureMaterial)o.material?.dispose();});employeeMeshes.delete(employee.id);mesh=null;}
      if(!mesh){const primary=employee.id===employees()[0]?.id;mesh=makeStaffModel(primary,employee.role);mesh.scale.setScalar(primary?1.32:1.1);mesh.userData.employeeId=employee.id;mesh.userData.role=employee.role;employeeMeshes.set(employee.id,mesh);ctx.scene.add(mesh);}
      let x,z,heading=0,phase='idle';
      if(employee.role==='checkout'){
        const counter=allCounters().find(f=>f.id===employee.registerId);mesh.visible=Boolean(counter);if(!counter)continue;
        const center=fixtureCenter(counter),front=serviceVector(counter.rotation);x=center.x-front.x*.64;z=center.z-front.z*.64;heading=Math.atan2(front.x,front.z);phase=getCustomers().some(c=>c.state==='pay'&&c.checkoutId===counter.id)?'scan':'idle';
      }else{mesh.visible=true;const job=employee.work || staffHome(employee);x=job.x;z=job.z;heading=job.heading||0;phase=job.phase||'idle';}
      const blend=mesh.userData.initialized?1-Math.exp(-18*delta):1;mesh.position.x+=(x-mesh.position.x)*blend;mesh.position.z+=(z-mesh.position.z)*blend;mesh.position.y=.12;mesh.rotation.y=smoothHeading(mesh.rotation.y,heading,delta,18);mesh.userData.initialized=true;mesh.userData.workPhase=phase;
      const moving=phase==='travel'||phase==='return',wave=Math.sin(ctx.elapsed*11),stocking=phase==='stock',carrying=phase==='travel'||stocking;
      mesh.getObjectByName('staff-crate').visible=carrying;
      mesh.getObjectByName('staff-arm-left').rotation.x=carrying?-.7-(stocking ? .22*wave:0):moving ? .35*wave:phase==='scan'?-.25-.15*wave:0;
      mesh.getObjectByName('staff-arm-right').rotation.x=carrying?-.7+(stocking ? .22*wave:0):moving?-.35*wave:0;
      mesh.getObjectByName('staff-leg-left').rotation.x=moving ? .3*wave:0;mesh.getObjectByName('staff-leg-right').rotation.x=moving?-.3*wave:0;
      updateBoxBatch(mesh);
    }
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

  function modelGroup(x=0,z=0,pose={}){
    return {position:{x,y:pose.y||0,z,set(a,b,c){this.x=a;this.y=b;this.z=c}},rotation:{y:pose.heading||0},scale:{value:pose.scale||1.2,setScalar(value){this.value=value}}};
  }
  function storeRuntime(){
    state().simulation={activeSeconds:ctx.elapsed,spawnTimer:ctx.spawnTimer,recoveryTimer:ctx.recoveryTimer,customerId:ctx.customerId,
      customers:getCustomers().map(customer=>{const {group,target,serviceCounter,...data}=customer;return {...data,targetId:target?.id,serviceCounterId:serviceCounter?.id,pose:{x:group.position.x,y:group.position.y,z:group.position.z,heading:group.rotation.y,scale:group.scale.value}}})};
  }
  function restoreRuntime(){
    const saved=state().simulation || {};
    ctx.elapsed=Number.isFinite(saved.activeSeconds)?Math.max(0,saved.activeSeconds):Math.max(0,(state().day-1)*60);
    ctx.spawnTimer=Number.isFinite(saved.spawnTimer)?saved.spawnTimer:2;
    ctx.recoveryTimer=Number.isFinite(saved.recoveryTimer)?saved.recoveryTimer:0;ctx.customerId=Math.max(0,saved.customerId||0);
    setCustomers((Array.isArray(saved.customers)?saved.customers:[]).map(data=>{const pose=data.pose || {};return {...data,group:modelGroup(pose.x??data.x,pose.z??data.z,pose),target:fixtures().find(f=>f.id===data.targetId),serviceCounter:fixtures().find(f=>f.id===data.serviceCounterId)};}));
  }
  function drawCustomers(delta=.1){
    const live=new Set(getCustomers().map(customer=>customer.id));
    for(const [id,mesh] of customerMeshes)if(!live.has(id)){ctx.scene.remove(mesh);mesh.traverse(node=>{node.geometry?.dispose();if(node.isInstancedMesh)node.dispose();if(node.userData.ownedFixtureMaterial)node.material?.dispose();});customerMeshes.delete(id);}
    for(const customer of getCustomers()){
      let mesh=customerMeshes.get(customer.id);
      if(!mesh){mesh=ctx.makeAnimal(customer.kind||'rabbit',customer.color||0xf1d5c1);batchBoxes(mesh);mesh.position.set(customer.group.position.x,customer.group.position.y,customer.group.position.z);mesh.rotation.y=customer.group.rotation.y;customerMeshes.set(customer.id,mesh);ctx.scene.add(mesh);}
      const group=customer.group,blend=1-Math.exp(-18*delta);
      mesh.position.x+=(group.position.x-mesh.position.x)*blend;mesh.position.z+=(group.position.z-mesh.position.z)*blend;mesh.position.y=group.position.y;mesh.rotation.y=smoothHeading(mesh.rotation.y,group.rotation.y,delta,18);mesh.scale.setScalar(group.scale.value || 1.2);
      const stride=Math.sin(ctx.elapsed*11+customer.id),moving=Boolean(customer.segment||customer.pathAt<customer.path?.length);
      for(const [name,sign] of [['customer-leg-left',1],['customer-leg-right',-1],['customer-arm-left',-1],['customer-arm-right',1]]){const part=mesh.getObjectByName(name);if(part)part.rotation.x=moving?stride*.28*sign:0;}
      const bag=mesh.getObjectByName('customer-purchase');if(bag)bag.visible=Boolean(customer.carried);
      for(const [name,sign] of [['customer-brow-left',1],['customer-brow-right',-1]]){const brow=mesh.getObjectByName(name);if(brow)brow.rotation.z=Math.min(.25,(customer.queueWait||0)/60)*sign;}
      updateBoxBatch(mesh);
    }
  }
  function refreshOwnership(){
    let button=$('continueHere');
    if(!button){button=document.createElement('button');button.id='continueHere';button.className='continue-here';button.type='button';button.addEventListener('click',()=>claimOwnership(true));document.querySelector('.scene-wrap').append(button);}
    button.textContent=ctx.t(faulted?'businessRetry':'continueHere',ctx.locale);button.hidden=owned&&!faulted;
    $('app').dataset.businessOwner=owned?'active':'following';document.querySelector('.shop-panel').inert=!owned||faulted;
  }
  function failAdapter(error){
    faulted=true;owned=false;visibleSaleRevenue=0;visibleAchievementIds.clear();lease?.setPaused('adapter-error',true);refreshOwnership();ctx.toast(ctx.t('businessPaused',ctx.locale));console.error('Blockmart live transaction stopped',error);
  }
  function enqueue(job){work=work.then(()=>{if(!disposed)return job()}).catch(failAdapter);return work;}
  async function locked(job){
    if(!navigator.locks?.request)throw new Error('Atomic store lock unavailable');
    return navigator.locks.request('weightplay.animal-blockmart.store',{mode:'exclusive'},job);
  }
  function adoptSaved(saved){
    if(saved && saved.storeRevision!==state().storeRevision){const view={view:state().view,panX:state().panX,panZ:state().panZ,zoom:state().zoom};setState({...migrateV9Save(ctx.readCompatibleSaved(),ctx.INITIAL),...view});restoreRuntime();}
  }
  async function ownershipTransaction(action){
    return locked(()=>{
      if(disposed)return false;
      const saved=ctx.readSaved();
      if(saved?.liveOwner?.documentId!==documentId){owned=false;lease?.setPaused('ownership',true);adoptSaved(saved);refreshOwnership();return false;}
      adoptSaved(saved);transactionBusy=true;
      try{action();recordGrowthGoals();storeRuntime();state().storeRevision=(state().storeRevision||0)+1;ctx.rawSave();if(manualPaused&&!document.hidden&&ctx.gameActive){drawCustomers();drawEmployees();ctx.renderer.render(ctx.scene,ctx.camera)}}finally{transactionBusy=false;}
      return true;
    });
  }
  function transact(action){
    if(!ctx.saveKey)return action();
    if(!owned||faulted)return Promise.resolve(false);
    lease?.checkpoint();return enqueue(()=>ownershipTransaction(action));
  }
  async function claimOwnership(takeover=false){
    if(faulted&&!lease){location.reload();return;}
    return enqueue(async()=>{
      await locked(()=>{
        const saved=ctx.readSaved(),reload=performance.getEntriesByType('navigation')[0]?.type==='reload';
        const allowed=takeover||!saved?.liveOwner||saved.liveOwner.documentId===documentId||(reload&&saved.liveOwner.tabToken===tabToken);
        if(!allowed){owned=false;adoptSaved(saved);return;}
        if(saved){setState(ctx.readCompatibleSaved());migrateCurrentState();}restoreRuntime();
        state().liveOwner={documentId,tabToken};state().liveClock={...(state().liveClock||{}),cursor:Date.now(),pendingMs:Math.max(0,state().liveClock?.pendingMs||0)};
        transactionBusy=true;try{storeRuntime();state().storeRevision=(state().storeRevision||0)+1;ctx.rawSave();}finally{transactionBusy=false;}
        owned=true;faulted=false;
      });
      lease?.setPaused('ownership',!owned);if(owned)lease?.setPaused('adapter-error',false);
      syncFixtures();renderPanel();refreshOwnership();if(owned&&state().liveClock.pendingMs>=50)await drainElapsed();
    });
  }
  function simulateStep(delta){
    ctx.elapsed+=delta;ctx.spawnTimer-=delta;
    if(ctx.spawnTimer<=0&&getCustomers().filter(c=>c.state!=='done'&&c.state!=='leave').length<24){spawn();ctx.spawnTimer=trafficInterval(state().popularity);}
    updateQueueLines();setCustomers(getCustomers().filter(customer=>updateCustomer(customer,delta)));
    automaticRestock(delta);lowCashRecovery(delta);refreshTraffic();state().day=Math.floor(ctx.elapsed/60)+1;
  }
  async function drainElapsed(){
    while(owned&&!faulted&&!disposed&&(state().liveClock?.pendingMs||0)>=50){
      const committed=await ownershipTransaction(()=>{
        const chunk=simulationSteps(state().liveClock.pendingMs,50,100);simulationBusy=true;
        const start=performance.now();let completed=0;
        try{for(;completed<chunk.steps;completed++){simulateStep(.05);if(performance.now()-start>8){completed++;break;}}state().liveClock.pendingMs-=completed*50;}finally{simulationBusy=false;}
      });
      if(!committed)break;
      await new Promise(resolve=>setTimeout(resolve,0));
    }
    if(!document.hidden){syncStockDisplays();refreshHud();refreshPanelValues();if(owned&&!faulted){if(visibleSaleRevenue>0)ctx.showSale(visibleSaleRevenue);visibleSaleRevenue=0;if(visibleAchievementIds.size){notifyAchievementUnlocks([...visibleAchievementIds]);visibleAchievementIds.clear();}}}
  }
  function onElapsed(milliseconds){
    if(!owned||faulted||disposed||!ctx.gameActive)return;
    const end=Date.now(),start=end-milliseconds;
    enqueue(async()=>{
      const committed=await ownershipTransaction(()=>{
        const clock=state().liveClock || {cursor:start,pendingMs:0},window=liveElapsedWindow(clock.cursor,start,end);
        state().liveClock={cursor:window.cursor,pendingMs:(clock.pendingMs||0)+window.milliseconds};
      });if(committed)await drainElapsed();
    });
  }
  function setupLifecycle(){
    if(lease||disposed||!window.WeightPlayLifecycle)return;
    lease=window.WeightPlayLifecycle.register('animal-blockmart',{background:'continue',onElapsed,onStateChange(){previousFrame=0;}});
    lease.setPaused('scene-away',!ctx.gameActive);lease.setPaused('ownership',!owned);lease.setPaused('manual',manualPaused);
    checkpointTimer=setInterval(()=>{const now=performance.now();if(!faulted&&(now-lastCheckpoint>=(document.hidden?1000:90))){lastCheckpoint=now;lease?.checkpoint()}},100);
    if(!$('businessPause')){const button=document.createElement('button');button.id='businessPause';button.className='business-pause';button.type='button';button.textContent=ctx.t('businessPause',ctx.locale);button.setAttribute('aria-pressed','false');button.addEventListener('click',()=>{manualPaused=!manualPaused;lease.setPaused('manual',manualPaused);button.textContent=ctx.t(manualPaused?'businessResume':'businessPause',ctx.locale);button.setAttribute('aria-pressed',String(manualPaused));});document.querySelector('.scene-wrap').append(button);}
    $('mainStart').addEventListener('click',()=>lease.setPaused('scene-away',false));
    $('battleBack').addEventListener('click',()=>lease.setPaused('help-modal',true));
    $('continueBattle').addEventListener('click',()=>lease.setPaused('help-modal',false));
    $('returnMain').addEventListener('click',()=>{lease.setPaused('scene-away',true);lease.setPaused('help-modal',false)});
    const pauseSettings=()=>lease?.setPaused('settings-modal',Boolean(document.querySelector('#app .wp-frame-popover:not([hidden]),#app .wp-shell-settings-popover:not([hidden])')));
    const settingsObserver=new MutationObserver(pauseSettings);settingsObserver.observe($('app'),{subtree:true,attributes:true,attributeFilter:['hidden']});pauseSettings();
    window.addEventListener('pagehide',()=>settingsObserver.disconnect(),{once:true});
  }
  function setupTransactions(){
    ctx.setSaveDelegate(()=>{
      if(transactionBusy||!owned||faulted)return;
      pendingView={view:state().view,panX:state().panX,panZ:state().panZ,zoom:state().zoom};
      if(viewWriteQueued)return;viewWriteQueued=true;
      enqueue(async()=>{try{await ownershipTransaction(()=>{Object.assign(state(),pendingView);pendingView=null;})}finally{viewWriteQueued=false;if(pendingView)ctx.save();}});
    });
    window.addEventListener('storage',event=>{if(event.key!==ctx.saveKey)return;enqueue(()=>locked(()=>{const saved=ctx.readSaved();if(saved?.liveOwner?.documentId!==documentId){owned=false;lease?.setPaused('ownership',true);adoptSaved(saved);syncFixtures();renderPanel();refreshOwnership();}}));});
    window.addEventListener('weightplay:lifecycle-ready',setupLifecycle);setupLifecycle();
    if(!lease){failAdapter(new Error('Shared lifecycle unavailable'));return;}
    claimOwnership();
    window.addEventListener('pagehide',()=>{lease?.checkpoint();lease?.dispose();lease=null;clearInterval(checkpointTimer);disposed=true;});
    window.addEventListener('pageshow',event=>{if(event.persisted){disposed=false;setupLifecycle();claimOwnership()}});
  }

  function gameLoop(timestamp) {
    requestAnimationFrame(gameLoop);
    if (!ctx.renderer || document.hidden || !ctx.gameActive || (lease&&!lease.active)) { previousFrame = timestamp; return; }
    const delta = previousFrame ? clamp((timestamp - previousFrame) / 1000, 0, .05) : 0;
    previousFrame = timestamp;
    if (Math.floor(timestamp/250)!==Math.floor((timestamp-delta*1000)/250)){refreshHud();refreshPanelValues();}
    drawCustomers(delta);drawEmployees(delta);
    ctx.renderer.render(ctx.scene, ctx.camera);
  }

  function install() {
    if (isInstalled) return;
    isInstalled = true;
    migrateCurrentState();
    const oldRux=ctx.scene.getObjectByName('rux-shopkeeper');if(oldRux){ctx.scene.remove(oldRux);oldRux.traverse(o=>o.geometry?.dispose());}
    fitCameraToShop();
    addPopularityHud();
    bindCashHud();
    bindInput();
    syncFixtures();
    if(ctx.saveKey)setupTransactions();else ctx.save();
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
    cancelPlacement, confirmPlacement:()=>transact(confirmPlacement), warehouseFixture:id=>transact(()=>warehouseFixture(id)), routeCustomerOut, updateQueueLines,
    targetCheckout, chooseProduct, spawn, updateCustomer, renderPanel, stockOrder, hireCashier,
    addWarehouseControls, refreshHud,
    automaticRestock,drawEmployees,makeStaffModel,buyCatalogItem,catalog,simulateStep,fitCameraToShop,
    activeEquipment: () => ({
      cooler: Boolean(state().equipment.cooler && fixtures().some(f => f.id === (state().coolerFixtureId || fixtures().find(x => x.kind === 'cooler')?.id))),
      fastCheckout: Boolean(state().equipment.fastCheckout && fixtures().some(f => f.id === (state().fastCheckoutFixtureId || fixtures().find(x => x.kind === 'fastCheckout')?.id)))
      ,doubleShelves:fixtures().filter(f=>f.kind==='shelf'&&f.footprint==='double').length,storageLevel:state().businessUpgrades?.levels.storage||0
    })
  };
}





