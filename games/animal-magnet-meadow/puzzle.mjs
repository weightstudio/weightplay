// Integer state is authoritative. Renderer, pointer previews and solver all use this transition.
export const ids = ['a', 'b', 'c'];
export const relationAt = (board, moves) => board.relation === 'flip' ? (moves % 2 ? 'push' : 'pull') : board.relation;
export const solved = (board, positions) => board.stones.every(id => positions[id] === board.target[id]);

export function move(board, positions, moves, id, destination) {
  if (!board.stones.includes(id) || !Number.isInteger(destination) || destination < 0 || destination >= board.boardSize) return { ok: false, reason: 'outside' };
  if (board.anchors?.includes(id)) return { ok: false, reason: 'anchor' };
  if (positions[id] === destination) return { ok: false, reason: 'same' };
  if (board.blocked?.includes(destination)) return { ok: false, reason: 'blocked' };
  const sign = Math.sign(destination - positions[id]) * (relationAt(board, moves) === 'pull' ? 1 : -1);
  const next = { ...positions, [id]: destination };
  let response = 0;
  for (const other of board.stones) {
    if (id === other || board.anchors?.includes(other)) continue;
    next[other] = Math.max(0, Math.min(board.boardSize - 1, positions[other] + sign * ++response));
  }
  if (Object.values(next).some(p => board.blocked?.includes(p))) return { ok: false, reason: 'blocked' };
  if (new Set(Object.values(next)).size !== board.stones.length) return { ok: false, reason: 'collision' };
  return { ok: true, positions: next, moves: moves + 1 };
}

export function routes(board, positions = board.initial, moves = 0) {
  const key = (p, n) => board.stones.map(id => p[id]).join(',') + (board.relation === 'flip' ? ':' + n % 2 : '');
  const queue = [{ positions: { ...positions }, moves, path: [] }];
  const seen = new Set([key(positions, moves)]);
  for (let index = 0; index < queue.length; index++) {
    const current = queue[index];
    for (const id of board.stones) for (let destination = 0; destination < board.boardSize; destination++) {
      const next = move(board, current.positions, current.moves, id, destination);
      if (!next.ok) continue;
      const signature = key(next.positions, next.moves);
      if (seen.has(signature)) continue;
      seen.add(signature);
      queue.push({ ...next, path: [...current.path, { id, destination }] });
    }
  }
  return queue;
}

export function solution(board, positions = board.initial, moves = 0) {
  return routes(board, positions, moves).find(state => solved(board, state.positions))?.path ?? null;
}

// Stable stage IDs preserve v16 unlocks. Each row is authored, never generated at runtime.
const data = [
  [6, 'pull', [0,4], [1,5]],
  [6, 'push', [4,2], [5,1]],
  [6, 'pull', [0,3], [2,5]],
  [7, 'pull', [1,4], [3,6]],
  [7, 'push', [5,2], [6,1]],
  [7, 'flip', [0,5], [1,6]],
  [7, 'flip', [4,2], [5,3]],
  [8, 'flip', [0,6], [2,6]],
  [8, 'flip', [5,1], [4,0]],
  [8, 'flip', [1,5], [4,5]],
  [7, 'pull', [0,5], [2,5], ['b']],
  [7, 'pull', [0,3,6], [1,4,6], ['c']],
  [8, 'push', [6,3,0], [7,2,0], ['c']],
  [8, 'flip', [1,4,7], [2,5,7], ['c']],
  [8, 'flip', [0,3,7], [1,4,7], ['c'], [5]],
  [7, 'pull', [0,4], [1,5], [], [2]],
  [8, 'push', [6,1], [7,0], [], [3,4]],
  [8, 'pull', [2,6], [3,7], [], [1,4]],
  [8, 'flip', [0,3], [1,4], [], [5]],
  [8, 'flip', [6,1], [7,0], [], [2,5]],
  [7, 'pull', [0,2,4], [1,3,6]],
  [8, 'push', [6,4,2], [7,3,0]],
  [8, 'pull', [0,1,3], [1,2,5]],
  [9, 'flip', [0,3,6], [1,4,8]],
  [9, 'flip', [1,3,6], [2,4,8]],
  [8, 'flip', [0,2,6], [1,3,7], [], [4]],
  [9, 'flip', [0,3,8], [1,4,8], ['c'], [6]],
  [9, 'push', [6,4,2], [7,3,0], [], [1,8]],
  [9, 'flip', [1,4,7], [2,5,7], ['c'], [3]],
  [9, 'flip', [0,1,2], [1,2,4], [], [3,6]],
];
export const boards = data.map(([boardSize, relation, initial, target, anchors = [], blocked = []], index) => ({
  id: index + 1, arc: Math.floor(index / 5) + 1, checkpoint: index % 5 === 4,
  boardSize, relation, stones: ids.slice(0, initial.length), anchors, blocked,
  initial: Object.fromEntries(initial.map((value, i) => [ids[i], value])),
  target: Object.fromEntries(target.map((value, i) => [ids[i], value])),
}));

export function normalizeProgress(raw = {}, legacy = []) {
  const completed = [...new Set([...(Array.isArray(raw.completed) ? raw.completed : []), ...(Array.isArray(legacy) ? legacy : [])])]
    .filter(n => Number.isInteger(n) && n >= 0 && n < boards.length).sort((a,b) => a-b);
  const best = {};
  const stars = {};
  for (let i = 0; i < boards.length; i++) {
    if (Number.isInteger(raw.best?.[i]) && raw.best[i] > 0 && raw.best[i] < 10000) best[i] = raw.best[i];
    if (Number.isInteger(raw.stars?.[i]) && raw.stars[i] >= 1 && raw.stars[i] <= 3) stars[i] = raw.stars[i];
  }
  return { schema: 1, completed, best, stars, theme: raw.theme === 'amber' ? 'amber' : 'moon', amber: raw.amber === true };
}
