// Pure campaign rules. Not mounted by the v13 entry until the campaign UI,
// authored stages, localization and independent acceptance are complete.
// Coordinates are tile-width/tile-height units; faces are opaque identifiers.
const overlap = (a, b) => Math.abs(a.x - b.x) < 1 - 1e-6 && Math.abs(a.y - b.y) < 1 - 1e-6;
const sideOf = (a, b, side) => a.z === b.z &&
 Math.abs(b.x - a.x - side) < 1e-6 && Math.abs(a.y - b.y) < 1 - 1e-6;

export function createCampaignState(definition) {
 if (!definition || !Array.isArray(definition.tiles) || definition.tiles.length < 2 || definition.tiles.length % 2)
  throw new Error('A campaign board needs an even, nonempty tile set');
 if (definition.tiles.length > 144) throw new Error('Campaign tile budget exceeded');
 const ids = new Set(), counts = new Map();
 const keys = definition.keys || {};
 const order = definition.order || [];
 if (!Array.isArray(order) || new Set(order).size !== order.length || order.some(f => typeof f !== 'string'))
  throw new Error('Invalid ordered faces');
 for (const [face, gates] of Object.entries(keys))
  if (!face || !Array.isArray(gates) || !gates.length || gates.some(g => typeof g !== 'string' || !g))
   throw new Error('Invalid seal key');
 const tiles = definition.tiles.map(tile => {
  if (!tile || typeof tile.id !== 'string' || !tile.id || ids.has(tile.id)) throw new Error('Unique tile IDs required');
  if (typeof tile.face !== 'string' || !tile.face) throw new Error('Tile face required');
  if (![tile.x, tile.y, tile.z].every(Number.isFinite) || !Number.isInteger(tile.z) || tile.z < 0)
   throw new Error('Invalid tile geometry');
  ids.add(tile.id); counts.set(tile.face, (counts.get(tile.face) || 0) + 1);
  if (tile.gate !== undefined && (typeof tile.gate !== 'string' || !Object.values(keys).flat().includes(tile.gate)))
   throw new Error('A sealed tile requires a declared key');
  return Object.freeze({id:tile.id, face:tile.face, x:tile.x, y:tile.y, z:tile.z, ...(tile.gate ? {gate:tile.gate} : {})});
 });
 if ([...counts.values()].some(n => n % 2)) throw new Error('Every face needs complete pairs');
 if (order.some(face => counts.get(face) !== 2)) throw new Error('Ordered faces must have exactly one pair');
 if (Object.keys(keys).some(face => !counts.has(face))) throw new Error('Missing key face');
 for (let i = 0; i < tiles.length; i++) for (let j = i + 1; j < tiles.length; j++)
  if (tiles[i].z === tiles[j].z && overlap(tiles[i], tiles[j])) throw new Error('Same-layer tiles overlap');
 const rules = Object.freeze({keys:Object.freeze(Object.fromEntries(Object.entries(keys).map(([f,g])=>[f,Object.freeze([...g])]))), order:Object.freeze([...order])});
 return Object.freeze({tiles:Object.freeze(tiles), rules, removed:Object.freeze([]), history:Object.freeze([])});
}

export function campaignSeals(state) {
 const opened = new Set();
 for (const pair of state.history) {
  const face = state.tiles.find(t => t.id === pair[0]).face;
  for (const gate of state.rules.keys[face] || []) opened.add(gate);
 }
 return [...opened];
}

export function nextCampaignOrder(state) {
 return state.rules.order.find(face => state.tiles.some(t => t.face === face && !state.removed.includes(t.id))) || null;
}

export function campaignBlock(state, id) {
 const tile = state.tiles.find(t => t.id === id);
 if (!tile) return 'unknown';
 if (state.removed.includes(id)) return 'removed';
 if (tile.gate && !campaignSeals(state).includes(tile.gate)) return 'sealed';
 const live = state.tiles.filter(t => t.id !== id && !state.removed.includes(t.id));
 if (live.some(t => t.z > tile.z && overlap(tile, t))) return 'covered';
 if (live.some(t => sideOf(tile, t, -1)) && live.some(t => sideOf(tile, t, 1))) return 'sides';
 return '';
}

export function campaignPairs(state) {
 const open = state.tiles.filter(t => !campaignBlock(state, t.id)), pairs = [];
 const next = nextCampaignOrder(state);
 for (let i = 0; i < open.length; i++) for (let j = i + 1; j < open.length; j++)
  if (open[i].face === open[j].face && (!state.rules.order.includes(open[i].face) || open[i].face === next))
   pairs.push([open[i].id, open[j].id]);
 return pairs;
}

export function removeCampaignPair(state, first, second) {
 if (first === second) return {ok:false, reason:'same-tile', state};
 const blocked = campaignBlock(state, first) || campaignBlock(state, second);
 if (blocked) return {ok:false, reason:blocked, state};
 const a = state.tiles.find(t => t.id === first), b = state.tiles.find(t => t.id === second);
 if (a.face !== b.face) return {ok:false, reason:'mismatch', state};
 if (state.rules.order.includes(a.face) && a.face !== nextCampaignOrder(state)) return {ok:false, reason:'order', state};
 const pair = Object.freeze([first, second]);
 return {ok:true, state:Object.freeze({tiles:state.tiles, rules:state.rules,
  removed:Object.freeze([...state.removed, ...pair]), history:Object.freeze([...state.history, pair])})};
}

export function undoCampaignPair(state) {
 if (!state.history.length) return {ok:false, reason:'empty-history', state};
 const pair = state.history.at(-1);
 return {ok:true, state:Object.freeze({tiles:state.tiles, rules:state.rules,
  removed:Object.freeze(state.removed.filter(id => !pair.includes(id))),
  history:Object.freeze(state.history.slice(0, -1))})};
}

export function campaignOutcome(state) {
 if (state.removed.length === state.tiles.length) return 'complete';
 return campaignPairs(state).length ? 'playing' : 'stalled';
}

// No timer, storage, worker, browser or unbounded search. A budget exhaustion
// is UNKNOWN, never proof that the player is stuck or that a stage is bad.
export function solveCampaign(state, {maxNodes = 20000} = {}) {
 if (!Number.isSafeInteger(maxNodes) || maxNodes < 1 || maxNodes > 1000000) throw new Error('Invalid search budget');
 const dead = new Set(); let visited = 0, exhausted = false;
 const search = current => {
  if (current.removed.length === current.tiles.length) return [];
  const key = current.tiles.map(t => current.removed.includes(t.id) ? '1' : '0').join('');
  if (dead.has(key)) return null;
  if (visited >= maxNodes) { exhausted = true; return null; }
  visited++;
  for (const pair of campaignPairs(current)) {
   const next = removeCampaignPair(current, ...pair).state, tail = search(next);
   if (tail) return [pair, ...tail];
   if (exhausted) return null;
  }
  dead.add(key); return null;
 };
 const path = search(state);
 return {status:path ? 'SOLVED' : exhausted ? 'UNKNOWN' : 'UNSOLVABLE', path, visited};
}
