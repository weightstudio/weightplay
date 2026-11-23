// The renderer, forecast, and campaign solver all read the same settled drop.
export const COLS = 5;
export const WATER_MAX = 3;
export const TOOL_UNLOCK = { bare: 0, dew: 4, wind: 14, clamp: 30 };
export const FINISH_COST = { cedar: 0, amber: 6, moon: 12 };
export const stock = (stage, tool = 'bare') => ({
  turned: 0, wet: 0, water: stage.water, throws: stage.beds.length + stage.slack,
  blooms: 0, mistakes: 0, tool, usedTool: false, outcome: null,
});

export function reflect(column, direction) {
  const next = column + direction;
  return next < 0 || next >= COLS ? column - direction : next;
}

export function canTurn(stage, state, index) {
  return index === null || (Number.isInteger(index) && Boolean(stage.pegs[index]) &&
    stage.pegs[index].kind !== 'lock' && state.water > 0);
}

export function drop(stage, state, mouth, turn = null, useTool = false) {
  if (state.outcome || !stage.mouths.includes(mouth) || !canTurn(stage, state, turn)) return null;
  if (useTool && (state.usedTool || state.tool === 'bare')) return null;
  const next = { ...state };
  if (turn !== null) {
    next.turned ^= 1 << turn;
    next.water--;
  }
  let col = mouth;
  const path = [{ row: -1, col, kind: 'mouth' }];
  const events = [];
  for (let row = 0; row < stage.rows; row++) {
    const i = row * COLS + col;
    const peg = stage.pegs[i];
    let span = peg.kind === 'wind' ? 2 : 1;
    let kind = peg.kind;
    const direction = (next.turned & 1 << i) ? -peg.d : peg.d;
    if (peg.kind === 'dew' && !(next.wet & 1 << i)) {
      const bonus = useTool && !next.usedTool && state.tool === 'dew';
      const before = next.water;
      next.water = Math.min(WATER_MAX, next.water + (bonus ? 2 : 1));
      next.wet |= 1 << i;
      if (bonus) next.usedTool = true;
      events.push({ index: i, kind: 'dew', gain: next.water - before, tool: bonus });
    } else if (peg.kind === 'hinge') {
      if (useTool && !next.usedTool && state.tool === 'clamp') {
        next.usedTool = true;
        kind = 'clamped';
      } else next.turned ^= 1 << i;
      events.push({ index: i, kind });
    } else if (peg.kind === 'wind') {
      if (useTool && !next.usedTool && state.tool === 'wind') {
        next.usedTool = true;
        kind = 'guided';
        span = 1;
      }
      events.push({ index: i, kind });
    }
    path.push({ row, col, kind, index: i });
    let dir = direction;
    for (let step = 0; step < span; step++) {
      const aim = col + dir;
      if (aim < 0 || aim >= COLS) {
        dir *= -1;
        events.push({ index: i, kind: 'wall' });
        path.push({ row: row + (span === 2 ? .16 : .21), col: col + (aim < 0 ? -.41 : .41), kind: 'wall' });
      }
      col = reflect(col, dir);
      if (step + 1 < span) path.push({ row: row + .52, col, kind: 'windStep' });
    }
  }
  path.push({ row: stage.rows, col, kind: 'bed' });
  const matched = col === stage.beds[state.blooms];
  if (matched) {
    if (stage.pair && state.blooms > 0 && Math.abs(stage.beds[state.blooms - 1] - col) === 1) {
      const before = next.water;
      next.water = Math.min(WATER_MAX, next.water + 1);
      events.push({ kind: 'pair', gain: next.water - before });
    }
    next.blooms++;
  } else next.mistakes++;
  next.throws--;
  if (next.blooms === stage.beds.length) next.outcome = 'win';
  else if (!next.throws) next.outcome = 'loss';
  const stars = next.outcome === 'win' ? (next.mistakes === 0 ? 3 : next.throws > 0 ? 2 : 1) : 0;
  return { next, path, events, col, matched, stars };
}
