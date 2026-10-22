// Immutable, DOM-free flight rules. Coordinates use north = negative row.
export const DIRECTIONS = Object.freeze({ north: [0, -1], east: [1, 0], south: [0, 1], west: [-1, 0] });
const arrows = { '^': 'north', '>': 'east', v: 'south', '<': 'west' };
// Each five-route chapter adds a decision, not merely a different backdrop.
const layouts = [
  ['.....', '.....', '...D.', '.S...', '.....'],
  ['.....', '..D..', '..#..', '.S...', '.....'],
  ['....D', '..#..', '.##..', '.S...', '.....'],
  ['D....', '.###.', '...#.', '.#...', '...S.'],
  ['...D.', '.#.#.', '.#...', '...#.', 'S....'],
  ['..*D.', '.....', '.....', '.S...', '.....'],
  ['D....', '.##..', '...*.', '.#...', 'S....'],
  ['....D', '..#..', '*.#.*', '..#..', '..S..'],
  ['*...D', '.#.#.', '...#.', '.#.*.', '.S...'],
  ['..D..', '.###.', '*...*', '..#..', '..S..'],
  ['....D', '....^', '..>..', '.....', 'S....'],
  ['D....', '^.#..', '..#..', '..>..', '...S.'],
  ['....D', '.#.^.', '*#...', '.>...', 'S....'],
  ['D..*.', '.#.#.', '.>v..', '.....', '..S..'],
  ['..D..', '.#^#.', '*...*', '.>...', '..S..'],
  ['..2.D', '.....', '.#.#.', '..1..', '.S...'],
  ['2...D', '.###.', '...1.', '.#...', '.S...'],
  ['....D', '..#..', '2.#.1', '..#..', '..S..'],
  ['1...D', '.#.#.', '..2#.', '.#...', '...S.'],
  ['..D..', '.###.', '2...1', '..#..', '..S..'],
  ['....D', '.#.^.', '1#...', '.>..2', 'S....'],
  ['D...2', '^.#..', '..#..', '.>1..', '...S.'],
  ['2.D..', '.#^#.', '1....', '.>...', '..S..'],
  ['D..1.', '.#.#.', '.>v..', '2....', '..S..'],
  ['..D..', '.#^#.', '2...1', '.>...', '..S..'],
  ['3...D', '.#.#.', '1...2', '.#...', '..S..'],
  ['D...3', '^.#..', '2.#..', '.>1..', '...S.'],
  ['1.D..', '.#^#.', '3...2', '.>...', '..S..'],
  ['D..2.', '.#.#.', '.>v..', '1...3', '..S..'],
  ['3.D..', '.#^#.', '1.#.2', '.>...', '..S..'],
];
const same = (a, b) => a[0] === b[0] && a[1] === b[1];
export function createState(stage) { return { point: [...stage.start], mask: 0, moves: 0, won: false, failed: false }; }
function travel(stage, state, direction) {
  const vector = DIRECTIONS[direction];
  if (!vector) return { ok: false, reason: 'blocked', trace: [] };
  let point = [...state.point], mask = state.mask;
  const trace = [], seen = new Set();
  let wind = direction;
  for (let hop = 0; hop < 26; hop++) {
    const delta = DIRECTIONS[wind];
    point = [point[0] + delta[0], point[1] + delta[1]];
    if (point.some(n => n < 0 || n > 4) || stage.grid[point[1]][point[0]] === '#') {
      return { ok: false, reason: 'blocked', trace: [] };
    }
    const spark = stage.sparks.findIndex(p => same(p, point));
    if (spark >= 0 && (!stage.ordered || (mask & ((1 << spark) - 1)) === (1 << spark) - 1)) mask |= 1 << spark;
    trace.push([...point]);
    const cell = stage.grid[point[1]][point[0]];
    wind = arrows[cell];
    if (!wind) return { ok: true, point, mask, trace };
    const signature = point.join(',');
    if (seen.has(signature)) return { ok: false, reason: 'blocked', trace: [] };
    seen.add(signature);
  }
  return { ok: false, reason: 'blocked', trace: [] };
}
export function step(stage, state, direction) {
  if (state.won || state.failed) return { ok: false, reason: 'finished', trace: [] };
  const next = travel(stage, state, direction);
  if (!next.ok) return next;
  const moves = state.moves + 1;
  const won = same(next.point, stage.dock) && next.mask === (1 << stage.sparks.length) - 1;
  return { ...next, collected: next.mask & ~state.mask, state: { point: next.point, mask: next.mask, moves, won, failed: !won && moves >= stage.budget } };
}
export function solve(stage, state = createState(stage)) {
  const queue = [{ point: state.point, mask: state.mask, path: [] }];
  const seen = new Set([`${state.point}:${state.mask}`]);
  for (let cursor = 0; cursor < queue.length; cursor++) {
    const node = queue[cursor];
    if (same(node.point, stage.dock) && node.mask === (1 << stage.sparks.length) - 1) return node.path;
    for (const wind of Object.keys(DIRECTIONS)) {
      const result = travel(stage, node, wind);
      if (!result.ok) continue;
      const key = `${result.point}:${result.mask}`;
      if (seen.has(key)) continue;
      seen.add(key);
      queue.push({ point: result.point, mask: result.mask, path: [...node.path, wind] });
    }
  }
  return null;
}
export const STAGES = Object.freeze(layouts.map((grid, index) => {
  const stage = { id: index + 1, chapter: Math.floor(index / 5), grid, start: null, dock: null, sparks: [], ordered: grid.some(row => /[123]/.test(row)), currents: [] };
  for (const [y, row] of grid.entries()) for (const [x, cell] of [...row].entries()) {
    if (cell === 'S') stage.start = [x, y];
    if (cell === 'D') stage.dock = [x, y];
    if (cell === '*') stage.sparks.push([x, y]);
    if (/[123]/.test(cell)) stage.sparks[Number(cell) - 1] = [x, y];
    if (arrows[cell]) stage.currents.push({ point: [x, y], direction: arrows[cell] });
  }
  const solution = solve(stage);
  if (!solution?.length) throw new Error(`Unsolvable sky route ${stage.id}`);
  stage.par = solution.length;
  stage.budget = stage.par + (index < 5 ? 3 : 2);
  return Object.freeze(stage);
}));
export function starRating(stage, state, assisted) {
  if (!state.won) return 0;
  if (state.moves === stage.par && !assisted) return 3;
  return state.moves <= stage.par + 1 ? 2 : 1;
}
export const LEGACY_SOLVED_KEY = 'weightplay-kite-keeper-solved-v1';
export const SAVE_KEY = 'weightplay-kite-keeper-flight-v19';
export const SKINS = Object.freeze(['meadow', 'coral', 'moon', 'gold', 'aurora']);
export function normalizeSave(raw, legacy = []) {
  const solved = new Set((Array.isArray(legacy) ? legacy : []).filter(id => Number.isInteger(id) && id >= 1 && id <= 30));
  const records = {};
  for (const stage of STAGES) {
    const record = raw?.records?.[stage.id];
    if (record && Number.isInteger(record.stars) && record.stars >= 1 && record.stars <= 3 && Number.isInteger(record.best) && record.best >= stage.par && record.best <= stage.budget) {
      records[stage.id] = { stars: record.stars, best: record.best }; solved.add(stage.id);
    }
  }
  const purchased = raw?.aurora === true;
  const available = ['meadow', ...(solved.size >= 5 ? ['coral'] : []), ...(solved.size >= 15 ? ['moon'] : []), ...(solved.size >= 30 ? ['gold'] : []), ...(purchased ? ['aurora'] : [])];
  return { version: 19, records, solved: [...solved].sort((a, b) => a - b), aurora: purchased, skin: available.includes(raw?.skin) ? raw.skin : 'meadow' };
}
export function recordWin(save, stage, state, assisted) {
  if (!state.won) return save;
  const old = save.records[stage.id];
  return normalizeSave({ ...save, records: { ...save.records, [stage.id]: { best: Math.min(old?.best ?? Infinity, state.moves), stars: Math.max(old?.stars ?? 0, starRating(stage, state, assisted)) } } }, [...save.solved, stage.id]);
}
export function availableSkins(save) {
  return SKINS.filter((skin, index) => index === 0 || index === 1 && save.solved.length >= 5 || index === 2 && save.solved.length >= 15 || index === 3 && save.solved.length >= 30 || index === 4 && save.aurora);
}
