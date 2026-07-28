(() => {
  "use strict";

  const authored = [
    [4,[[1,2,2,1,0,1],[4,0,1,2,1,0],[4,2,1,2,1,0],[0,3,1,2,1,0],[5,4,1,2,1,0],[0,1,2,1,0,0]]],
    [5,[[0,2,2,1,0,1],[1,3,2,1,0,0],[2,4,1,2,1,0],[5,3,1,2,1,0],[3,2,1,2,1,0],[0,0,1,2,1,0]]],
    [5,[[1,2,2,1,0,1],[4,3,1,3,1,0],[2,0,2,1,0,0],[5,1,1,3,1,0],[0,0,2,1,0,0],[3,1,2,1,0,0]]],
    [5,[[1,2,2,1,0,1],[4,1,1,2,1,0],[0,0,2,1,0,0],[0,4,1,2,1,0],[1,3,2,1,0,0],[4,0,2,1,0,0]]],
    [6,[[0,2,2,1,0,1],[3,2,1,2,1,0],[2,1,1,2,1,0],[1,0,1,2,1,0],[4,0,1,2,1,0],[0,0,1,2,1,0]]],
    [7,[[0,2,2,1,0,1],[2,1,1,2,1,0],[5,1,1,2,1,0],[0,0,2,1,0,0],[0,4,2,1,0,0],[5,3,1,3,1,0],[4,1,1,2,1,0]]],
    [7,[[1,2,2,1,0,1],[4,3,1,2,1,0],[4,1,1,2,1,0],[1,3,1,2,1,0],[3,0,3,1,0,0],[1,0,1,2,1,0],[0,4,1,2,1,0]]],
    [8,[[1,2,2,1,0,1],[4,2,1,2,1,0],[5,3,1,2,1,0],[4,4,1,2,1,0],[0,4,1,2,1,0],[3,1,2,1,0,0],[3,0,3,1,0,0]]],
    [8,[[0,2,2,1,0,1],[5,1,1,2,1,0],[4,5,2,1,0,0],[2,0,1,2,1,0],[4,2,1,3,1,0],[1,3,2,1,0,0],[0,0,1,2,1,0]]],
    [8,[[1,2,2,1,0,1],[4,5,2,1,0,0],[4,2,1,3,1,0],[2,4,1,2,1,0],[3,1,2,1,0,0],[4,0,2,1,0,0],[1,3,2,1,0,0]]],
    [9,[[1,2,2,1,0,1],[4,0,1,3,1,0],[2,3,1,2,1,0],[0,3,1,2,1,0],[4,5,2,1,0,0],[3,4,1,2,1,0],[0,1,1,2,1,0]]],
    [10,[[1,2,2,1,0,1],[0,2,1,2,1,0],[3,0,1,2,1,0],[4,4,1,2,1,0],[1,4,1,2,1,0],[2,4,2,1,0,0],[3,2,1,2,1,0]]],
    [11,[[0,2,2,1,0,1],[1,4,1,2,1,0],[0,0,1,2,1,0],[4,4,1,2,1,0],[3,0,1,3,1,0],[2,2,1,2,1,0],[5,0,1,3,1,0]]],
    [11,[[2,2,2,1,0,1],[0,1,2,1,0,0],[0,2,1,3,1,0],[1,3,2,1,0,0],[5,4,1,2,1,0],[4,0,1,3,1,0],[4,3,2,1,0,0]]],
    [12,[[0,2,2,1,0,1],[3,5,2,1,0,0],[0,0,2,1,0,0],[0,3,1,2,1,0],[4,1,1,3,1,0],[2,0,1,3,1,0],[0,1,2,1,0,0],[4,0,2,1,0,0]]],
    [13,[[1,2,2,1,0,1],[2,3,1,3,1,0],[3,2,1,2,1,0],[4,5,2,1,0,0],[1,3,1,2,1,0],[0,1,2,1,0,0],[4,2,1,3,1,0]]],
    [13,[[2,2,2,1,0,1],[4,0,1,2,1,0],[4,2,1,2,1,0],[0,3,2,1,0,0],[3,3,1,2,1,0],[3,5,3,1,0,0],[4,4,2,1,0,0],[5,1,1,3,1,0]]],
    [14,[[1,2,2,1,0,1],[1,3,1,2,1,0],[4,2,1,2,1,0],[2,0,1,2,1,0],[4,4,2,1,0,0],[3,0,2,1,0,0],[0,1,1,2,1,0],[2,3,1,2,1,0]]],
    [15,[[2,2,2,1,0,1],[3,4,1,2,1,0],[5,1,1,3,1,0],[4,4,2,1,0,0],[0,0,1,2,1,0],[4,1,1,2,1,0],[3,0,1,2,1,0],[1,2,1,2,1,0]]],
    [15,[[0,2,2,1,0,1],[5,4,1,2,1,0],[5,2,1,2,1,0],[2,3,2,1,0,0],[4,0,2,1,0,0],[2,0,1,3,1,0],[0,3,1,2,1,0],[3,0,1,2,1,0]]],
    [15,[[2,2,2,1,0,1],[0,1,1,2,1,0],[5,2,1,2,1,0],[2,0,1,2,1,0],[4,4,1,2,1,0],[4,1,1,2,1,0],[1,3,3,1,0,0],[3,0,2,1,0,0]]],
    [16,[[1,2,2,1,0,1],[4,0,1,3,1,0],[1,4,1,2,1,0],[3,3,1,3,1,0],[5,0,1,3,1,0],[3,1,1,2,1,0],[1,0,2,1,0,0],[4,5,2,1,0,0]]],
    [16,[[1,2,2,1,0,1],[0,3,1,2,1,0],[2,4,1,2,1,0],[4,0,1,3,1,0],[3,2,1,2,1,0],[0,0,2,1,0,0],[4,4,2,1,0,0],[0,5,2,1,0,0]]],
    [17,[[2,2,2,1,0,1],[2,3,2,1,0,0],[4,0,1,3,1,0],[4,3,2,1,0,0],[4,4,2,1,0,0],[0,1,1,2,1,0],[1,0,2,1,0,0],[3,4,1,2,1,0]]],
    [18,[[1,2,2,1,0,1],[2,4,1,2,1,0],[3,5,2,1,0,0],[4,0,1,3,1,0],[5,4,1,2,1,0],[3,3,3,1,0,0],[0,1,1,3,1,0],[3,4,2,1,0,0],[3,0,1,2,1,0]]],
    [18,[[1,2,2,1,0,1],[2,0,1,2,1,0],[5,2,1,3,1,0],[3,1,3,1,0,0],[0,4,2,1,0,0],[3,4,1,2,1,0],[0,1,1,2,1,0],[4,2,1,2,1,0],[3,2,1,2,1,0]]],
    [19,[[1,2,2,1,0,1],[3,2,1,2,1,0],[2,4,1,2,1,0],[0,2,1,2,1,0],[4,0,1,2,1,0],[2,0,2,1,0,0],[4,4,2,1,0,0],[1,0,1,2,1,0],[3,4,1,2,1,0]]],
    [21,[[1,2,2,1,0,1],[5,2,1,2,1,0],[3,2,1,3,1,0],[2,4,1,2,1,0],[0,1,1,2,1,0],[1,4,1,2,1,0],[3,5,3,1,0,0],[0,3,2,1,0,0],[2,0,3,1,0,0]]],
    [21,[[1,2,2,1,0,1],[2,3,1,2,1,0],[4,0,1,2,1,0],[5,0,1,3,1,0],[3,0,1,3,1,0],[0,2,1,2,1,0],[4,4,2,1,0,0],[4,3,2,1,0,0],[0,1,2,1,0,0]]],
    [22,[[1,2,2,1,0,1],[2,3,1,2,1,0],[1,1,2,1,0,0],[4,0,1,3,1,0],[3,4,2,1,0,0],[4,5,2,1,0,0],[5,1,1,3,1,0],[0,2,1,2,1,0],[3,1,1,3,1,0]]],
  ];

  const levels = authored.map(([par, pieces], index) => ({
    index,
    par,
    blocks: pieces.map(([x, y, w, h, dir, hero], pieceIndex) => ({
      id: hero ? "hero" : `b${pieceIndex - 1}`,
      x,
      y,
      w,
      h,
      dir,
      ...(hero ? { hero: true } : {}),
    })),
  }));

  function stateKey(positions) {
    let key = 0;
    for (const position of positions) key = key * 6 + position;
    return key;
  }

  function solve(source, includePath = false) {
    const pieces = source.map((block) => ({ ...block }));
    const start = pieces.map((piece) => (piece.dir ? piece.y : piece.x));
    const startKey = stateKey(start);
    const queue = [start];
    const distance = new Map([[startKey, 0]]);
    const parents = includePath ? new Map() : null;
    let goalKey = null;

    for (let head = 0; head < queue.length; head += 1) {
      const state = queue[head];
      const key = stateKey(state);
      if (state[0] >= 4) {
        goalKey = key;
        break;
      }
      const occupied = new Int8Array(36);
      occupied.fill(-1);
      pieces.forEach((piece, pieceIndex) => {
        const x = piece.dir ? piece.x : state[pieceIndex];
        const y = piece.dir ? state[pieceIndex] : piece.y;
        for (let yy = y; yy < y + piece.h; yy += 1) {
          for (let xx = x; xx < x + piece.w; xx += 1) {
            occupied[yy * 6 + xx] = pieceIndex;
          }
        }
      });
      pieces.forEach((piece, pieceIndex) => {
        for (const delta of [-1, 1]) {
          const position = state[pieceIndex] + delta;
          const limit = 6 - (piece.dir ? piece.h : piece.w);
          if (position < 0 || position > limit) continue;
          const x = piece.dir ? piece.x : position;
          const y = piece.dir ? position : piece.y;
          let blocked = false;
          for (let yy = y; yy < y + piece.h && !blocked; yy += 1) {
            for (let xx = x; xx < x + piece.w; xx += 1) {
              const owner = occupied[yy * 6 + xx];
              if (owner >= 0 && owner !== pieceIndex) {
                blocked = true;
                break;
              }
            }
          }
          if (blocked) continue;
          const next = state.slice();
          next[pieceIndex] = position;
          const nextKey = stateKey(next);
          if (distance.has(nextKey)) continue;
          distance.set(nextKey, distance.get(key) + 1);
          if (parents) parents.set(nextKey, { previous: key, pieceIndex, delta });
          queue.push(next);
        }
      });
    }

    if (goalKey == null) return null;
    const moves = distance.get(goalKey);
    if (!includePath) return { moves, visited: distance.size };
    const path = [];
    for (let key = goalKey; key !== startKey; ) {
      const step = parents.get(key);
      path.push({ pieceIndex: step.pieceIndex, delta: step.delta });
      key = step.previous;
    }
    path.reverse();
    return { moves, visited: distance.size, path };
  }

  function nextMove(blocks) {
    const solution = solve(blocks, true);
    const move = solution?.path[0];
    if (!move) return null;
    const block = blocks[move.pieceIndex];
    return {
      pieceIndex: move.pieceIndex,
      x: block.x + (block.dir ? 0 : move.delta),
      y: block.y + (block.dir ? move.delta : 0),
    };
  }

  function build(index) {
    const template = levels[index % levels.length];
    return {
      index,
      par: template.par,
      blocks: template.blocks.map((block) => ({ ...block })),
    };
  }

  const api = { levels, build, solve, nextMove, total: 3000 };
  globalThis.UNBLOCK_LEVELS = api;
  if (typeof module !== "undefined") module.exports = api;
})();
