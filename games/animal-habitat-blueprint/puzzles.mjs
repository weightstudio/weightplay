import { advancedClues } from './campaign-clues.mjs';
/* Stable campaign identity. All relations use visual left-to-right board
 * coordinates, including RTL; UI translation never mirrors a logic board. */
export function satisfied(rule, tiles, cols) {
  const a = tiles.indexOf(rule.a), b = tiles.indexOf(rule.b);
  const ax = a % cols, ay = Math.floor(a / cols), bx = b % cols, by = Math.floor(b / cols);
  switch (rule.key) {
    case 'clueCorner': return a === 0;
    case 'clueTouch': return Math.abs(ax - bx) + Math.abs(ay - by) === 1;
    case 'clueApart': return Math.abs(ax - bx) + Math.abs(ay - by) !== 1;
    case 'clueBelow': return ax === bx && ay === by + 1;
    case 'clueLeft': return ay === by && ax + 1 === bx;
    case 'clueRow': return ay === by;
    default: throw new Error(`Unknown habitat clue: ${rule.key}`);
  }
}
export function allowedPair(a, b, plan) {
  if (a === b || a < 0 || b < 0 || a >= plan.tiles.length || b >= plan.tiles.length) return false;
  if (a === plan.lockedSlot || b === plan.lockedSlot) return false;
  return plan.mode !== 'adjacent' || Math.abs(a % plan.cols - b % plan.cols) + Math.abs(Math.floor(a / plan.cols) - Math.floor(b / plan.cols)) === 1;
}
export function shortestPath(plan, start = plan.tiles) {
  const queue = [{ tiles: start, path: [] }], seen = new Set([start.join(',')]);
  for (let cursor = 0; cursor < queue.length; cursor++) {
    const item = queue[cursor];
    if (plan.rules.every(rule => satisfied(rule, item.tiles, plan.cols))) return item.path;
    for (let a = 0; a < start.length; a++) for (let b = a + 1; b < start.length; b++) {
      if (!allowedPair(a, b, plan)) continue;
      const next = [...item.tiles]; [next[a], next[b]] = [next[b], next[a]];
      const key = next.join(',');
      if (!seen.has(key)) { seen.add(key); queue.push({ tiles: next, path: [...item.path, [a, b]] }); }
    }
  }
  return null;
}
// Each chapter has five different spatial arrangements. The relationship
// packet traces the upper row and links the lower row without exposing a
// solution diagram. Chapter 4 leaves one genuine fixed habitat to plan around.
const layouts = [
  '0123','2031','3102','1320','0213', '2310','1032','3021','2130','3201',
  '012345','304152','251430','423015','135204', '250413','431052','103524','342150','514203',
  '235140','410325','153042','524301','302514', '451230','214503','530124','042351','325410',
];
const names = ['pond','reed','nest','meadow','canopy','burrow'];
const starts = [[0,1],[1,2],[0,3],[2,3],[0,2],[1,3],[3,4],[2,5],[4,5],[1,4]];
export const plans = layouts.map((layout, index) => {
  const solution = [...layout].map(n => names[Number(n)]), cols = solution.length === 4 ? 2 : 3;
  const chapter = Math.floor(index / 5) + 1;
  const rule = (key, a, b) => ({key, a: solution[a], ...(b === undefined ? {} : {b: solution[b]})});
  const rules = cols === 2
    ? [rule('clueCorner',0), rule('clueTouch',0,1), rule('clueBelow',3,1)]
    : advancedClues[index-10];
  const plan = { id:index+1, chapter, checkpoint:(index+1)%5===0, name:`habitatChapter${chapter}`, hint:`habitatHint${chapter}`, cols,
    mode: chapter === 2 || chapter === 6 ? 'adjacent' : 'open', lockedSlot: chapter === 4 ? index%6 : -1,
    maxSwaps:0, solution, tiles:[...solution], rules };
  // Authored deterministic walks always stay inside the chapter's legal graph.
  let moved = 0, previous = '';
  for (let i=0; moved < (chapter < 3 ? 2 + index%2 : 3 + index%3) && i<60; i++) {
    const [a,b] = starts[(i+index*3)%starts.length];
    if (!allowedPair(a,b,plan) || `${a},${b}` === previous) continue;
    [plan.tiles[a],plan.tiles[b]]=[plan.tiles[b],plan.tiles[a]]; previous=`${a},${b}`; moved++;
  }
  if (plan.rules.every(r=>satisfied(r,plan.tiles,cols))) {
    const pair = starts.find(([a,b])=>allowedPair(a,b,plan));
    [plan.tiles[pair[0]],plan.tiles[pair[1]]]=[plan.tiles[pair[1]],plan.tiles[pair[0]]];
  }
  plan.par = shortestPath(plan).length;
  if (chapter >= 5) plan.maxSwaps = plan.par + (chapter === 5 ? 2 : 1);
  return plan;
});
