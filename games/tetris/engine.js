/* Independently authored falling-block rules. No DOM, timers or saved state. */
((root) => {
  "use strict";
  const WIDTH = 10, HEIGHT = 20;
  const SHAPES = [
    { key: "I", size: 4, cells: [[0,1],[1,1],[2,1],[3,1]] },
    { key: "O", size: 2, cells: [[0,0],[1,0],[0,1],[1,1]] },
    { key: "T", size: 3, cells: [[1,0],[0,1],[1,1],[2,1]] },
    { key: "L", size: 3, cells: [[2,0],[0,1],[1,1],[2,1]] },
    { key: "J", size: 3, cells: [[0,0],[0,1],[1,1],[2,1]] },
    { key: "S", size: 3, cells: [[1,0],[2,0],[0,1],[1,1]] },
    { key: "Z", size: 3, cells: [[0,0],[1,0],[1,1],[2,1]] },
  ];
  function rotated(index, rotation) {
    const shape = SHAPES[index];
    let cells = shape.cells.map((cell) => [...cell]);
    if (shape.key !== "O") for (let i = 0; i < rotation % 4; i++) cells = cells.map(([x,y]) => [shape.size - 1 - y, x]);
    return cells;
  }
  function cells(state, overrides = {}) {
    return rotated(overrides.pieceIndex ?? state.pieceIndex, overrides.rotation ?? state.rotation)
      .map(([x,y]) => ({ x: x + (overrides.x ?? state.active), y: y + (overrides.y ?? state.activeY) }));
  }
  function canPlace(state, overrides = {}) {
    return cells(state, overrides).every(({x,y}) => x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT && !state.blocks.some((b) => b.x === x && b.y === y));
  }
  function refill(state) {
    const bag = SHAPES.map((_, i) => i);
    for (let i = bag.length - 1; i > 0; i--) {
      const j = Math.min(i, Math.floor(state.random() * (i + 1)));
      [bag[i], bag[j]] = [bag[j], bag[i]];
    }
    state.queue.push(...bag);
  }
  function spawn(state) {
    if (state.queue.length < 7) refill(state);
    state.pieceIndex = state.queue.shift();
    state.rotation = 0;
    state.active = Math.floor((WIDTH - SHAPES[state.pieceIndex].size) / 2);
    state.activeY = 0;
    if (!canPlace(state)) state.over = true;
  }
  function create(random = Math.random) {
    const state = { score: 0, moves: 0, pieces: 0, lines: 0, level: 1, blocks: [], queue: [], random, over: false, paused: false, cleared: 0 };
    spawn(state);
    return state;
  }
  function landingY(state) {
    if (!canPlace(state)) return null;
    let y = state.activeY;
    while (canPlace(state, { y: y + 1 })) y++;
    return y;
  }
  function lock(state) {
    if (state.over || !canPlace(state)) { state.over = true; return; }
    state.blocks.push(...cells(state).map((b) => ({...b, pieceIndex: state.pieceIndex})));
    state.pieces++;
    const full = [];
    for (let y = 0; y < HEIGHT; y++) if (state.blocks.filter((b) => b.y === y).length === WIDTH) full.push(y);
    state.cleared = full.length;
    if (full.length) {
      state.blocks = state.blocks.filter((b) => !full.includes(b.y)).map((b) => ({...b, y: b.y + full.filter((y) => y > b.y).length}));
      state.score += [0, 100, 300, 600, 1000][full.length] * state.level;
      state.lines += full.length;
      state.level = 1 + Math.floor(state.lines / 10);
    }
    spawn(state);
  }
  function step(state, command) {
    if (state.over || state.paused) return false;
    state.cleared = 0;
    if (command === "left" || command === "right") {
      const x = state.active + (command === "left" ? -1 : 1);
      if (!canPlace(state, {x})) return false;
      state.active = x;
    } else if (command === "rotate" || command === "up") {
      const rotation = (state.rotation + 1) % 4;
      // Bounded horizontal wall kicks; never teleport through a stack or erase it.
      const x = [0,-1,1,-2,2].map((dx) => state.active + dx).find((x) => canPlace(state, {x, rotation}));
      if (x === undefined) return false;
      state.active = x; state.rotation = rotation;
    } else if (command === "drop") {
      const y = landingY(state);
      if (y === null) { state.over = true; return false; }
      state.score += (y - state.activeY) * 2;
      state.activeY = y;
      lock(state);
    } else if (command === "down" || command === "tick") {
      if (canPlace(state, { y: state.activeY + 1 })) {
        state.activeY++;
        if (command === "down") state.score++;
      } else lock(state);
    } else return false;
    if (command !== "tick") state.moves++;
    return true;
  }
  const api = { WIDTH, HEIGHT, SHAPES, rotated, cells, canPlace, create, landingY, step, interval: (state) => Math.max(100, 850 * Math.pow(0.82, state.level - 1)) };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.WPTetrisEngine = api;
})(globalThis);
