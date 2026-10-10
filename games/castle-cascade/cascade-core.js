import { createSiege, resolveSiegeBatch } from "./siege-core.js?v=20261010-siege";
export const BOARD_WIDTH = 9;
export const BOARD_HEIGHT = 9;
export const CELL_COUNT = BOARD_WIDTH * BOARD_HEIGHT;

export const LEVELS = [
  { moves: 26, colors: 4, obstacles: { crate: [72, 73, 74, 75, 76, 77, 78, 79, 80] } },
  { moves: 25, colors: 4, obstacles: { crate: [63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 74, 76, 78, 80] } },
  { moves: 24, colors: 4, obstacles: { crate: [54, 55, 56, 57, 58, 59, 60, 61, 62, 72, 73, 74, 75, 76, 77, 78, 79, 80] } },
  { moves: 23, colors: 4, obstacles: { crate: [45, 47, 49, 51, 53, 63, 65, 67, 69, 71, 73, 75, 77, 79] } },
  { moves: 24, colors: 4, obstacles: { crate: [54, 55, 56, 58, 60, 61, 62, 63, 64, 65, 67, 69, 70, 71, 72, 73, 74, 76, 78, 79, 80] } },
  { moves: 27, colors: 4, obstacles: { crate: [63, 65, 67, 69, 71, 73, 75, 77, 79], chain: [27, 29, 31, 33, 35, 45, 47, 49, 51, 53] } },
  { moves: 26, colors: 4, obstacles: { crate: [54, 56, 58, 60, 62, 72, 74, 76, 78, 80], chain: [36, 37, 38, 39, 40, 41, 42, 43, 44] } },
  { moves: 25, colors: 4, obstacles: { crate: [63, 64, 66, 68, 70, 71, 73, 75, 77, 79], chain: [28, 30, 32, 34, 46, 48, 50, 52] } },
  { moves: 24, colors: 4, obstacles: { crate: [54, 55, 57, 59, 61, 62, 72, 73, 75, 77, 79, 80], chain: [36, 38, 40, 42, 44] } },
  { moves: 25, colors: 4, obstacles: { crate: [45, 46, 48, 50, 52, 53, 63, 65, 67, 69, 71, 73, 75, 77, 79], chain: [27, 29, 31, 33, 35, 37, 39, 41, 43] } },
  { moves: 29, colors: 5, obstacles: { key: [0], exit: [72], crate: [63, 64, 65, 66, 67, 68, 69, 70, 71] } },
  { moves: 28, colors: 5, obstacles: { key: [2], exit: [74], crate: [55, 56, 57, 58, 59, 60, 61, 62, 64, 65, 66, 67, 68, 69, 70, 71] } },
  { moves: 27, colors: 5, obstacles: { key: [1, 7], exit: [73, 79], crate: [63, 64, 65, 66, 67, 68, 69, 70, 71] } },
  { moves: 26, colors: 5, obstacles: { key: [0, 8], exit: [72, 80], crate: [54, 56, 58, 60, 62, 63, 65, 67, 69, 71] } },
  { moves: 27, colors: 5, obstacles: { key: [1, 7], exit: [73, 79], crate: [45, 47, 49, 51, 53, 54, 56, 58, 60, 62, 63, 65, 67, 69, 71] } },
  { moves: 30, colors: 5, obstacles: { gate: [36, 37, 38, 39, 40, 41, 42, 43, 44], gateColor: 0, crate: [63, 64, 65, 66, 67, 68, 69, 70, 71] } },
  { moves: 29, colors: 5, obstacles: { gate: [27, 36, 45, 35, 44, 53], gateColor: 1, crate: [63, 65, 67, 69, 71, 73, 75, 77, 79] } },
  { moves: 28, colors: 5, obstacles: { gate: [30, 31, 32, 39, 40, 41, 48, 49, 50], gateColor: 2, crate: [54, 56, 58, 60, 62, 72, 74, 76, 78, 80] } },
  { moves: 27, colors: 5, obstacles: { gate: [18, 19, 20, 29, 30, 31, 40, 41, 42, 51, 52, 53], gateColor: 3, crate: [63, 64, 66, 68, 70, 71, 73, 75, 77, 79] } },
  { moves: 28, colors: 5, obstacles: { gate: [27, 29, 31, 33, 35, 45, 47, 49, 51, 53], gateColor: 4, crate: [54, 55, 57, 59, 61, 62, 72, 73, 75, 77, 79, 80] } },
  { moves: 31, colors: 5, obstacles: { stone: [54, 56, 58, 60, 62], seal: [63, 65, 67, 69, 71], crate: [72, 73, 74, 75, 76, 77, 78, 79, 80] } },
  { moves: 30, colors: 5, obstacles: { stone: [45, 47, 49, 51, 53], seal: [55, 57, 59, 61], crate: [63, 64, 65, 66, 67, 68, 69, 70, 71] } },
  { moves: 29, colors: 5, obstacles: { stone: [36, 40, 44, 54, 58, 62], seal: [46, 48, 50, 52], crate: [72, 74, 76, 78, 80] } },
  { moves: 28, colors: 5, obstacles: { stone: [27, 35, 45, 53, 63, 71], seal: [37, 39, 41, 43, 55, 57, 59, 61], crate: [72, 73, 74, 75, 76, 77, 78, 79, 80] } },
  { moves: 29, colors: 5, obstacles: { stone: [36, 38, 40, 42, 44, 54, 56, 58, 60, 62], seal: [46, 48, 50, 52], crate: [63, 65, 67, 69, 71, 73, 75, 77, 79] } },
  { moves: 32, colors: 5, obstacles: { crate: [63, 64, 65, 66, 67, 68, 69, 70, 71], chain: [36, 40, 44], key: [1], exit: [73] } },
  { moves: 31, colors: 5, obstacles: { crate: [54, 56, 58, 60, 62, 72, 74, 76, 78, 80], stone: [45, 49, 53], seal: [64, 66, 68, 70] } },
  { moves: 30, colors: 5, obstacles: { gate: [36, 37, 38, 42, 43, 44], gateColor: 2, key: [0, 8], exit: [72, 80], crate: [63, 65, 67, 69, 71] } },
  { moves: 29, colors: 5, obstacles: { chain: [27, 29, 31, 33, 35], stone: [45, 47, 49, 51, 53], seal: [63, 65, 67, 69, 71], crate: [72, 74, 76, 78, 80] } },
  { moves: 32, colors: 5, obstacles: { gate: [27, 28, 29, 33, 34, 35, 45, 46, 47, 51, 52, 53], gateColor: 4, key: [1, 7], exit: [73, 79], stone: [36, 40, 44, 54, 58, 62], seal: [64, 66, 68, 70], crate: [72, 74, 76, 78, 80] } },
];

const COPY_PIECE_FIELDS = ["c", "p", "key"];
const OBJECTIVE_KEYS = ["crate", "chain", "key", "gate", "stone", "seal"];
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function cell(color = null) {
  return { c: color, p: null, box: 0, chain: 0, key: 0, exit: 0, gate: 0, gateColor: 0, stone: 0, seal: 0 };
}

export function cloneBoard(board) {
  return board.map((tile) => ({ ...tile }));
}

function nextRandom(state) {
  state.seed = (Math.imul(1664525, state.seed) + 1013904223) | 0;
  return (state.seed >>> 0) / 4294967296;
}

function isMatchable(tile) {
  // A stored power awaits player activation or a hit from an active power.
  // Its underlying color must not restart it when gravity makes a match.
  return tile.c !== null && !tile.p && !tile.box && !tile.stone && !tile.gate;
}

export function matchGroups(board) {
  const groups = [];
  const cells = new Set();
  const collect = (indices, axis) => {
    let run = [];
    let color = null;
    const flush = () => {
      if (run.length >= 3) {
        groups.push({ cells: run, axis });
        run.forEach((index) => cells.add(index));
      }
      run = [];
      color = null;
    };
    for (const index of indices) {
      const tile = board[index];
      if (!isMatchable(tile) || (run.length && tile.c !== color)) {
        flush();
      }
      if (isMatchable(tile)) {
        if (!run.length) color = tile.c;
        run.push(index);
      } else {
        flush();
      }
    }
    flush();
  };

  for (let row = 0; row < BOARD_HEIGHT; row += 1) {
    collect(Array.from({ length: BOARD_WIDTH }, (_, col) => row * BOARD_WIDTH + col), "h");
  }
  for (let col = 0; col < BOARD_WIDTH; col += 1) {
    collect(Array.from({ length: BOARD_HEIGHT }, (_, row) => row * BOARD_WIDTH + col), "v");
  }
  for (let row = 0; row < BOARD_HEIGHT - 1; row += 1) {
    for (let col = 0; col < BOARD_WIDTH - 1; col += 1) {
      const topLeft = row * BOARD_WIDTH + col;
      const block = [topLeft, topLeft + 1, topLeft + BOARD_WIDTH, topLeft + BOARD_WIDTH + 1];
      const color = board[topLeft].c;
      if (color !== null && block.every((index) => isMatchable(board[index]) && board[index].c === color)) {
        groups.push({ cells: block, axis: "square" });
        block.forEach((index) => cells.add(index));
      }
    }
  }
  return { cells, groups };
}

function matchAt(board, index) {
  const col = index % BOARD_WIDTH;
  const row = Math.floor(index / BOARD_WIDTH);
  const color = board[index].c;
  if (!isMatchable(board[index])) return false;
  const lineMatch = (col >= 2 && isMatchable(board[index - 1]) && isMatchable(board[index - 2])
      && board[index - 1].c === color && board[index - 2].c === color)
    || (row >= 2 && isMatchable(board[index - BOARD_WIDTH]) && isMatchable(board[index - BOARD_WIDTH * 2])
      && board[index - BOARD_WIDTH].c === color && board[index - BOARD_WIDTH * 2].c === color);
  if (lineMatch) return true;
  if (row === 0 || col === 0) return false;
  const square = [index, index - 1, index - BOARD_WIDTH, index - BOARD_WIDTH - 1];
  return square.every((cellIndex) => isMatchable(board[cellIndex]) && board[cellIndex].c === color);
}

function clearOpeningMatches(board, colors) {
  for (let row = 0; row < BOARD_HEIGHT; row += 1) {
    for (let col = 0; col < BOARD_WIDTH; col += 1) {
      const index = row * BOARD_WIDTH + col;
      let attempts = 0;
      while (matchAt(board, index) && attempts < colors) {
        board[index].c = (board[index].c + 1) % colors;
        attempts += 1;
      }
    }
  }
}

export function createState(stageIndex = 0, unlocked = 1) {
  const stage = clamp(Math.floor(Number(stageIndex) || 0), 0, LEVELS.length - 1);
  const level = LEVELS[stage];
  const state = {
    stage,
    moves: level.moves,
    unlocked: clamp(Math.floor(Number(unlocked) || 1), 1, LEVELS.length),
    seed: (911 + stage * 97) | 0,
    board: [],
    status: "playing",
    reshuffles: 0,
    siege: createSiege(stage),
  };

  // Fill with the state-owned seeded generator, then remove only opening matches.
  state.board = Array.from({ length: CELL_COUNT }, () => cell(Math.floor(nextRandom(state) * level.colors)));
  clearOpeningMatches(state.board, level.colors);
  const obstacles = level.obstacles;
  (obstacles.crate || []).forEach((index) => { state.board[index].box = 1; });
  (obstacles.chain || []).forEach((index) => { state.board[index].chain = 1; });
  (obstacles.key || []).forEach((index) => { state.board[index].key = 1; });
  (obstacles.exit || []).forEach((index) => { state.board[index].exit = 1; });
  (obstacles.gate || []).forEach((index) => {
    state.board[index].gate = 1;
    state.board[index].gateColor = obstacles.gateColor ?? 0;
    state.board[index].c = state.board[index].gateColor;
  });
  (obstacles.stone || []).forEach((index) => { state.board[index].stone = 2; });
  (obstacles.seal || []).forEach((index) => { state.board[index].seal = 1; });
  clearOpeningMatches(state.board, level.colors);
  return state;
}

export function objectiveCounts(board) {
  const totals = Object.fromEntries(OBJECTIVE_KEYS.map((key) => [key, 0]));
  for (const tile of board) {
    if (tile.box) totals.crate += 1;
    if (tile.chain) totals.chain += 1;
    if (tile.key) totals.key += 1;
    if (tile.gate) totals.gate += 1;
    if (tile.stone) totals.stone += 1;
    if (tile.seal) totals.seal += 1;
  }
  return totals;
}

export function isComplete(board) {
  const totals = objectiveCounts(board);
  return OBJECTIVE_KEYS.every((key) => totals[key] === 0);
}

export function canSwap(board, index) {
  const tile = board[index];
  return Boolean(tile && !tile.box && !tile.chain && !tile.gate && !tile.stone);
}

function adjacent(a, b) {
  const ar = Math.floor(a / BOARD_WIDTH);
  const ac = a % BOARD_WIDTH;
  const br = Math.floor(b / BOARD_WIDTH);
  const bc = b % BOARD_WIDTH;
  return Math.abs(ar - br) + Math.abs(ac - bc) === 1;
}

function swapPieces(board, a, b) {
  const first = {};
  const second = {};
  for (const field of COPY_PIECE_FIELDS) {
    first[field] = board[a][field];
    second[field] = board[b][field];
  }
  for (const field of COPY_PIECE_FIELDS) {
    board[a][field] = second[field];
    board[b][field] = first[field];
  }
}

function hasPowerMove(board) {
  return board.some((tile, index) => tile.p && canSwap(board, index));
}

export function legalMoves(board) {
  const moves = [];
  if (hasPowerMove(board)) {
    board.forEach((tile, index) => {
      if (tile.p && canSwap(board, index)) moves.push({ type: "activate", index });
    });
  }
  for (let index = 0; index < CELL_COUNT; index += 1) {
    for (const next of [index + 1, index + BOARD_WIDTH]) {
      if (next >= CELL_COUNT || !adjacent(index, next) || !canSwap(board, index) || !canSwap(board, next)) continue;
      swapPieces(board, index, next);
      if (matchGroups(board).cells.size) moves.push({ type: "swap", a: index, b: next });
      swapPieces(board, index, next);
    }
  }
  return moves;
}

function squareCells(board, matchedCells) {
  for (let row = 0; row < BOARD_HEIGHT - 1; row += 1) {
    for (let col = 0; col < BOARD_WIDTH - 1; col += 1) {
      const topLeft = row * BOARD_WIDTH + col;
      const block = [topLeft, topLeft + 1, topLeft + BOARD_WIDTH, topLeft + BOARD_WIDTH + 1];
      const color = board[topLeft].c;
      if (color !== null && block.every((index) => matchedCells.has(index) && board[index].c === color)) return block;
    }
  }
  return [];
}

function specialFromGroup(board, matched, movedIndex) {
  const longest = matched.groups.filter(group => group.axis !== "square")
    .sort((a, b) => b.cells.length - a.cells.length)[0];
  if (longest?.cells.length >= 5) {
    return { at: longest.cells.includes(movedIndex) ? movedIndex : longest.cells[0], power: "prism" };
  }
  const counts = new Map();
  for (const group of matched.groups) {
    if (group.axis === "square") continue;
    for (const index of group.cells) counts.set(index, (counts.get(index) || 0) + 1);
  }
  const cross = [...counts].find(([, count]) => count > 1);
  if (cross) return { at: cross[0], power: "bomb" };

  const square = squareCells(board, matched.cells);
  if (square.length) return { at: square.includes(movedIndex) ? movedIndex : square[0], power: "bird" };
  if (longest?.cells.length === 4) {
    return { at: longest.cells.includes(movedIndex) ? movedIndex : longest.cells[0], power: longest.axis === "h" ? "arrowH" : "arrowV" };
  }
  return null;
}

// Each independent match earns its own power. Overlapping lines/squares are
// one shape, so a T or L never pays out several powers for the same gems.
export function specialsFromMatches(board, matched, movedIndex = -1) {
  const pending = [...matched.groups];
  const specials = [];
  while (pending.length) {
    const groups = [pending.shift()];
    const cells = new Set(groups[0].cells);
    for (let added = true; added;) {
      added = false;
      for (let index = pending.length - 1; index >= 0; index -= 1) {
        if (!pending[index].cells.some(cell => cells.has(cell))) continue;
        const [group] = pending.splice(index, 1);
        groups.push(group);
        group.cells.forEach(cell => cells.add(cell));
        added = true;
      }
    }
    const special = specialFromGroup(board, { groups, cells }, movedIndex);
    if (special) specials.push({ ...special, cells: [...cells] });
  }
  return specials;
}

function targetScore(tile) {
  let score = 0;
  if (tile.stone) score += 70;
  if (tile.gate) score += tile.c === tile.gateColor ? 68 : -30;
  if (tile.seal) score += 62;
  if (tile.box) score += 55;
  if (tile.chain) score += 48;
  return score;
}

function bestTarget(board, excluded = new Set(), carriedPower = null) {
  // A key is cargo, not a destructible target. Clear its route to the exit
  // instead of repeatedly stripping the gem beneath the stationary key.
  const keyRoute = new Set();
  board.forEach((tile, index) => {
    if (!tile.key) return;
    const exit = board.findLastIndex((candidate, at) => candidate.exit && at % BOARD_WIDTH === index % BOARD_WIDTH);
    for (let at = index + BOARD_WIDTH; at <= exit; at += BOARD_WIDTH) {
      if (!board[at].key) keyRoute.add(at);
    }
  });
  const value = index => excluded.has(index) ? 0 : targetScore(board[index]) + (keyRoute.has(index) ? 100 : 0);
  let choice = -1;
  let best = -Infinity;
  board.forEach((tile, index) => {
    if (excluded.has(index)) return;
    let score = value(index);
    if (carriedPower) {
      const footprint = new Set([index]), powerHits = new Set();
      if (carriedPower === "bomb") addArea(footprint, index, 2, powerHits);
      else if (carriedPower === "arrowH") addRow(footprint, index, powerHits);
      else if (carriedPower === "arrowV") addColumn(footprint, index, powerHits);
      // Reward the whole delivered footprint, so a carried rocket/bomb aims
      // at a useful line/cluster rather than one arbitrarily ranked blocker.
      score = [...footprint].reduce((sum, hit) => sum + value(hit), 0) + value(index) / 100;
    }
    const row = Math.floor(index / BOARD_WIDTH), col = index % BOARD_WIDTH;
    score -= (Math.abs(row - 4) + Math.abs(col - 4) / 10) / 1000;
    if (score > best) {
      best = score;
      choice = index;
    }
  });
  if (best > 0) return choice;
  return board.findIndex((tile, index) => !excluded.has(index) && tile.c !== null && !tile.gate && !tile.stone);
}

function addRow(set, index, powerSet) {
  const row = Math.floor(index / BOARD_WIDTH);
  for (let col = 0; col < BOARD_WIDTH; col += 1) {
    const hit = row * BOARD_WIDTH + col;
    set.add(hit);
    powerSet.add(hit);
  }
}

function addColumn(set, index, powerSet) {
  const col = index % BOARD_WIDTH;
  for (let row = 0; row < BOARD_HEIGHT; row += 1) {
    const hit = row * BOARD_WIDTH + col;
    set.add(hit);
    powerSet.add(hit);
  }
}

function addArea(set, index, radius, powerSet) {
  const row = Math.floor(index / BOARD_WIDTH);
  const col = index % BOARD_WIDTH;
  for (let y = -radius; y <= radius; y += 1) {
    for (let x = -radius; x <= radius; x += 1) {
      const targetRow = row + y;
      const targetCol = col + x;
      if (targetRow < 0 || targetRow >= BOARD_HEIGHT || targetCol < 0 || targetCol >= BOARD_WIDTH) continue;
      const hit = targetRow * BOARD_WIDTH + targetCol;
      set.add(hit);
      powerSet.add(hit);
    }
  }
}

function addPowerEffect(board, index, power, direct, powerSet, excludedBirdTargets, visualEffects = []) {
  direct.add(index);
  powerSet.add(index);
  if (power === "arrowH") {
    addRow(direct, index, powerSet);
    visualEffects.push({ type: "arrow", index, axis: "h" });
  } else if (power === "arrowV") {
    addColumn(direct, index, powerSet);
    visualEffects.push({ type: "arrow", index, axis: "v" });
  } else if (power === "bomb") {
    addArea(direct, index, 2, powerSet);
    visualEffects.push({ type: "bomb", index, radius: 2 });
  } else if (power === "bird") {
    const target = bestTarget(board, excludedBirdTargets);
    if (target >= 0) {
      direct.add(target);
      powerSet.add(target);
      excludedBirdTargets.add(target);
      visualEffects.push({ type: "bird", index, target });
    }
  } else if (power === "prism") {
    const color = board[index].c;
    const targets = [];
    board.forEach((tile, target) => {
      if (tile.c === color) {
        direct.add(target);
        powerSet.add(target);
        targets.push(target);
      }
    });
    visualEffects.push({ type: "prism", index, color, targets });
  }
}

function expandTriggeredPowers(board, direct, powerSet, suppressed = new Set(), visualEffects = []) {
  const queue = [...direct].filter((index) => board[index]?.p && !suppressed.has(index));
  const activated = new Set();
  const excludedBirdTargets = new Set(direct);
  while (queue.length) {
    const index = queue.shift();
    if (activated.has(index) || suppressed.has(index)) continue;
    activated.add(index);
    const power = board[index]?.p;
    if (!power) continue;
    const before = new Set(direct);
    addPowerEffect(board, index, power, direct, powerSet, excludedBirdTargets, visualEffects);
    for (const hit of direct) {
      if (!before.has(hit) && board[hit]?.p && !activated.has(hit) && !suppressed.has(hit)) queue.push(hit);
    }
  }
  return visualEffects;
}

function addAdjacentHitCells(direct) {
  const adjacent = new Set();
  for (const index of direct) {
    const row = Math.floor(index / BOARD_WIDTH);
    const col = index % BOARD_WIDTH;
    if (row > 0) adjacent.add(index - BOARD_WIDTH);
    if (row < BOARD_HEIGHT - 1) adjacent.add(index + BOARD_WIDTH);
    if (col > 0) adjacent.add(index - 1);
    if (col < BOARD_WIDTH - 1) adjacent.add(index + 1);
  }
  for (const index of direct) adjacent.delete(index);
  return adjacent;
}

function damageDirect(tile, powerHit, matchingColors, forceGate) {
  const opened = { crate: Boolean(tile.box), chain: Boolean(tile.chain), seal: Boolean(tile.seal), gate: false, stone: false };
  tile.box = 0;
  tile.chain = 0;
  tile.seal = 0;
  if (tile.stone && powerHit) {
    tile.stone = Math.max(0, tile.stone - 1);
    opened.stone = true;
  }
  if (tile.gate && (forceGate || matchingColors.has(tile.gateColor))) {
    tile.gate = 0;
    opened.gate = true;
  }
  return opened;
}

function damageAdjacent(tile) {
  const opened = { crate: Boolean(tile.box), chain: Boolean(tile.chain) };
  tile.box = 0;
  tile.chain = 0;
  return opened;
}

function addStats(stats, values) {
  for (const key of Object.keys(values)) if (values[key]) stats[key] += 1;
}

function resolveOneBatch(state, direct, powerSet, specials = [], forceGate = false, visualEffects = []) {
  const specialByCell = new Map(specials.map(special => [special.at, special]));
  const board = state.board;
  const before = cloneBoard(board);
  const directHits = [...direct].sort((a, b) => a - b);
  const adjacentHits = [...addAdjacentHitCells(direct)].sort((a, b) => a - b);
  const matchingColors = new Set(directHits.map((index) => board[index].c).filter((color) => color !== null));
  const stats = { crate: 0, chain: 0, key: 0, gate: 0, stone: 0, seal: 0, special: specials[0]?.power || null, specials: specials.map(special => special.power) };
  const openedGates = new Set();

  directHits.forEach((index) => {
    const damage = damageDirect(board[index], powerSet.has(index), matchingColors, forceGate);
    addStats(stats, damage);
    if (damage.gate) openedGates.add(index);
  });
  adjacentHits.forEach((index) => addStats(stats, damageAdjacent(board[index])));

  // A color gate opens when a direct clear includes its color. The gate cells
  // themselves stay fixed until this matching color is cleared.
  if (forceGate) {
    board.forEach((tile, index) => {
      if (tile.gate) {
        tile.gate = 0;
        openedGates.add(index);
      }
    });
  } else {
    board.forEach((tile, index) => {
      if (tile.gate && matchingColors.has(tile.gateColor)) {
        tile.gate = 0;
        openedGates.add(index);
      }
    });
  }
  stats.gate = openedGates.size;

  for (const index of directHits) {
    const tile = board[index];
    const special = specialByCell.get(index);
    if (special) {
      tile.p = special.power;
      tile.box = 0;
      tile.chain = 0;
      tile.seal = 0;
      continue;
    }
    if (tile.stone || tile.gate) {
      tile.p = null;
      continue;
    }
    tile.c = null;
    tile.p = null;
  }

  const cleared = cloneBoard(board);
  const movements = dropAndRefill(state);
  const deliveredKeys = deliverKeys(board);
  stats.key += deliveredKeys.length;
  const batch = {
    before,
    cleared,
    after: cloneBoard(board),
    directHits,
    adjacentHits,
    powerHits: [...powerSet].sort((a, b) => a - b),
    visualEffects,
    createdSpecial: specials[0] || null,
    createdSpecials: specials,
    movements,
    deliveredKeys,
    stats,
  };
  batch.siege = resolveSiegeBatch(state.siege, batch);
  return batch;
}

function dropAndRefill(state) {
  const board = state.board;
  const level = LEVELS[state.stage];
  const movements = [];
  for (let col = 0; col < BOARD_WIDTH; col += 1) {
    let bottom = BOARD_HEIGHT - 1;
    while (bottom >= 0) {
      if (board[bottom * BOARD_WIDTH + col].box || board[bottom * BOARD_WIDTH + col].gate || board[bottom * BOARD_WIDTH + col].stone) {
        bottom -= 1;
        continue;
      }
      const segmentBottom = bottom;
      while (bottom >= 0 && !board[bottom * BOARD_WIDTH + col].box && !board[bottom * BOARD_WIDTH + col].gate && !board[bottom * BOARD_WIDTH + col].stone) bottom -= 1;
      const segmentTop = bottom + 1;
      const payloads = [];
      for (let row = segmentBottom; row >= segmentTop; row -= 1) {
        const tile = board[row * BOARD_WIDTH + col];
        if (tile.c !== null || tile.p || tile.key) {
          payloads.push({ fromIndex: row * BOARD_WIDTH + col, payload: { c: tile.c, p: tile.p, key: tile.key } });
        }
      }
      let payloadIndex = 0;
      let spawnCount = 0;
      for (let row = segmentBottom; row >= segmentTop; row -= 1) {
        const index = row * BOARD_WIDTH + col;
        const tile = board[index];
        const entry = payloads[payloadIndex++];
        if (entry) {
          tile.c = entry.payload.c;
          tile.p = entry.payload.p;
          tile.key = entry.payload.key;
          if (entry.fromIndex !== index) {
            movements.push({
              fromIndex: entry.fromIndex,
              toIndex: index,
              fromRow: Math.floor(entry.fromIndex / BOARD_WIDTH),
              toRow: row,
              col,
              payload: entry.payload,
            });
          }
        } else {
          tile.c = Math.floor(nextRandom(state) * level.colors);
          tile.p = null;
          tile.key = 0;
          movements.push({
            fromIndex: null,
            toIndex: index,
            fromRow: segmentTop === 0 ? -1 : segmentTop - 0.5,
            toRow: row,
            col,
            spawnOrder: spawnCount,
            payload: { c: tile.c, p: tile.p, key: tile.key },
            isNew: true,
          });
          spawnCount += 1;
        }
      }
    }
  }
  return movements;
}

function deliverKeys(board) {
  const delivered = [];
  for (let col = 0; col < BOARD_WIDTH; col += 1) {
    const exitIndex = board.findLastIndex((tile, index) => index % BOARD_WIDTH === col && tile.exit);
    if (exitIndex < 0 || !board[exitIndex].key) continue;
    board[exitIndex].key = 0;
    delivered.push(exitIndex);
  }
  return delivered;
}

function colorPowerCombo(state, prismIndex, otherIndex, direct, powerSet, suppressed) {
  const board = state.board;
  const otherPower = board[otherIndex].p;
  if (otherPower === "prism") {
    board.forEach((_, index) => {
      direct.add(index);
      powerSet.add(index);
    });
    suppressed.add(prismIndex);
    suppressed.add(otherIndex);
    return { forceGate: true };
  }
  const color = board[otherIndex].c;
  direct.add(prismIndex);
  powerSet.add(prismIndex);
  suppressed.add(prismIndex);
  board.forEach((tile, index) => {
    if (tile.c !== color) return;
    direct.add(index);
    powerSet.add(index);
    if (otherPower) tile.p = otherPower;
  });
  return { forceGate: false };
}

function comboEffect(state, a, b) {
  const board = state.board;
  const powerA = board[a].p;
  const powerB = board[b].p;
  const direct = new Set([a, b]);
  const powerSet = new Set([a, b]);
  const suppressed = new Set();
  const visualEffects = [];
  let forceGate = false;
  const isArrow = (power) => typeof power === "string" && power.startsWith("arrow");

  if (powerA === "prism" || powerB === "prism") {
    const prismIndex = powerA === "prism" ? a : b;
    const otherIndex = prismIndex === a ? b : a;
    const otherPower = board[otherIndex].p;
    const color = board[otherIndex].c;
    const targets = otherPower === "prism"
      ? board.map((_, index) => index)
      : board.map((tile, index) => tile.c === color ? index : -1).filter((index) => index >= 0);
    const result = colorPowerCombo(state, prismIndex, otherIndex, direct, powerSet, suppressed);
    forceGate = result.forceGate;
    visualEffects.push({ type: otherPower === "prism" ? "spectrum" : "prism-combo", index: prismIndex, target: otherIndex, color, power: otherPower, targets });
  } else if (powerA === "bomb" && powerB === "bomb") {
    addArea(direct, b, 3, powerSet);
    suppressed.add(a);
    suppressed.add(b);
    visualEffects.push({ type: "nova", index: b, radius: 3 });
  } else if ((powerA === "bomb" && isArrow(powerB)) || (powerB === "bomb" && isArrow(powerA))) {
    const center = b;
    const row = Math.floor(center / BOARD_WIDTH);
    const col = center % BOARD_WIDTH;
    for (let offset = -1; offset <= 1; offset += 1) {
      const targetRow = row + offset;
      const targetCol = col + offset;
      if (targetRow >= 0 && targetRow < BOARD_HEIGHT) addRow(direct, targetRow * BOARD_WIDTH, powerSet);
      if (targetCol >= 0 && targetCol < BOARD_WIDTH) addColumn(direct, targetCol, powerSet);
    }
    suppressed.add(a);
    suppressed.add(b);
    visualEffects.push({ type: "siege", index: center });
  } else if (isArrow(powerA) && isArrow(powerB)) {
    addRow(direct, b, powerSet);
    addColumn(direct, b, powerSet);
    suppressed.add(a);
    suppressed.add(b);
    visualEffects.push({ type: "cross", index: b });
  } else if (powerA === "bird" && powerB === "bird") {
    const excluded = new Set([a, b]);
    const targets = [];
    for (let count = 0; count < 2; count += 1) {
      const target = bestTarget(board, excluded);
      if (target >= 0) {
        direct.add(target);
        powerSet.add(target);
        excluded.add(target);
        targets.push(target);
      }
    }
    suppressed.add(a);
    suppressed.add(b);
    visualEffects.push({ type: "flock", origins: [a, b], targets });
  } else if (powerA === "bird" || powerB === "bird") {
    const bird = powerA === "bird" ? a : b;
    const partnerIndex = bird === a ? b : a;
    const partnerPower = board[partnerIndex].p;
    if (partnerPower) {
      const target = bestTarget(board, new Set([a, b]), partnerPower);
      if (target >= 0) {
        visualEffects.push({ type: "bird-carry", index: bird, target, power: partnerPower });
        addPowerEffect(board, target, partnerPower, direct, powerSet, new Set([target]), visualEffects);
      }
    } else {
      const excluded = new Set([a, b]);
      addPowerEffect(board, bird, "bird", direct, powerSet, excluded, visualEffects);
    }
    suppressed.add(a);
    suppressed.add(b);
  }

  // Unpaired Arrow/Bomb sources are expanded here once, together with any
  // powers hit by their footprint. Pair/carry sources are suppressed above.
  expandTriggeredPowers(board, direct, powerSet, suppressed, visualEffects);
  if (powerA && powerB) {
    visualEffects.push({
      type: "combo-burst",
      index: b,
      origins: [a, b],
      powers: [powerA, powerB],
      targets: [...direct].sort((left, right) => left - right),
    });
  }
  return { direct, powerSet, forceGate, visualEffects };
}

function finishState(state) {
  if (state.siege ? state.siege.complete : isComplete(state.board)) {
    state.status = "won";
    state.unlocked = Math.max(state.unlocked, Math.min(LEVELS.length, state.stage + 2));
    return;
  }
  if (state.moves <= 0) {
    state.status = "lost";
    return;
  }
  if (legalMoves(state.board).length === 0 && !reshuffle(state)) state.status = "stuck";
}

export function reshuffle(state) {
  const level = LEVELS[state.stage];
  const movable = state.board.map((tile, index) => ({ tile, index }))
    .filter(({ tile }) => !tile.box && !tile.chain && !tile.gate && !tile.stone);
  const original = movable.map(({ tile }) => tile.c);
  for (let attempt = 0; attempt < 64; attempt += 1) {
    const colors = [...original];
    for (let index = colors.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(nextRandom(state) * (index + 1));
      [colors[index], colors[swapIndex]] = [colors[swapIndex], colors[index]];
    }
    movable.forEach(({ tile }, index) => { tile.c = colors[index] ?? Math.floor(nextRandom(state) * level.colors); });
    clearOpeningMatches(state.board, level.colors);
    if (!matchGroups(state.board).cells.size && legalMoves(state.board).length) {
      state.reshuffles += 1;
      return true;
    }
  }
  return false;
}

function updateDeferredPowerPosition(deferredPower, batch) {
  if (!deferredPower || deferredPower.consumed) return;
  if (batch.directHits.includes(deferredPower.index)) {
    deferredPower.consumed = true;
    return;
  }
  const movement = batch.movements.find((entry) => entry.fromIndex === deferredPower.index
    && entry.payload?.p === deferredPower.power);
  if (movement) deferredPower.index = movement.toIndex;
}

function resolveCascade(state, initialDirect, initialPower, specials = [], forceGate = false, initialVisualEffects = [], deferredPower = null) {
  const batches = [];
  let direct = new Set(initialDirect);
  let powerSet = new Set(initialPower);
  let specialsToPlace = specials || [];
  let forceGateNow = forceGate;
  let visualEffects = initialVisualEffects;
  for (let batchIndex = 0; batchIndex < 40; batchIndex += 1) {
    const batch = resolveOneBatch(state, direct, powerSet, specialsToPlace, forceGateNow, visualEffects);
    batches.push(batch);
    updateDeferredPowerPosition(deferredPower, batch);
    const match = matchGroups(state.board);
    if (!match.cells.size) break;
    const nextSpecials = specialsFromMatches(state.board, match);
    direct = match.cells;
    powerSet = new Set();
    specialsToPlace = nextSpecials;
    forceGateNow = false;
    const suppressed = deferredPower && !deferredPower.consumed ? new Set([deferredPower.index]) : new Set();
    visualEffects = expandTriggeredPowers(state.board, direct, powerSet, suppressed);
  }
  return batches;
}

function resolveDeferredPower(state, deferredPower) {
  const { index, power, partnerColor, partnerIndex } = deferredPower;
  const live = !deferredPower.consumed && state.board[index]?.p === power;
  const direct = new Set();
  const powerSet = new Set();
  const visualEffects = [];
  const suppressed = new Set([index]);

  if (power === "prism") {
    const targets = [];
    state.board.forEach((tile, target) => {
      if (tile.c !== partnerColor) return;
      direct.add(target);
      powerSet.add(target);
      targets.push(target);
    });
    if (live) {
      direct.add(index);
      powerSet.add(index);
    } else {
      direct.delete(index);
      powerSet.delete(index);
    }
    visualEffects.push({ type: "prism-combo", index, target: partnerIndex, color: partnerColor, power: null, targets });
  } else if (live) {
    direct.add(index);
    powerSet.add(index);
  } else {
    addPowerEffect(state.board, index, power, direct, powerSet, new Set([index]), visualEffects);
    direct.delete(index);
    powerSet.delete(index);
  }

  if (!direct.size) return [];
  const effects = power === "prism"
    ? expandTriggeredPowers(state.board, direct, powerSet, suppressed, visualEffects)
    : live
      ? expandTriggeredPowers(state.board, direct, powerSet, new Set(), visualEffects)
      : expandTriggeredPowers(state.board, direct, powerSet, suppressed, visualEffects);
  return resolveCascade(state, direct, powerSet, null, false, effects);
}

function actionResult(state, accepted, reason, batches = [], reshufflesBefore = state.reshuffles) {
  if (accepted) finishState(state);
  const reshuffled = state.reshuffles > reshufflesBefore;
  return { accepted, reason, status: state.status, batches, objectives: objectiveCounts(state.board), moves: state.moves, reshuffles: state.reshuffles, reshuffled };
}

export function activatePower(state, index) {
  const tile = state.board[index];
  if (state.status !== "playing" || !tile?.p || !canSwap(state.board, index) || state.moves <= 0) {
    return actionResult(state, false, "invalid");
  }
  const reshufflesBefore = state.reshuffles;
  state.moves -= 1;
  const direct = new Set([index]);
  const powerSet = new Set([index]);
  const visualEffects = expandTriggeredPowers(state.board, direct, powerSet);
  const batches = resolveCascade(state, direct, powerSet, null, false, visualEffects);
  return actionResult(state, true, "power", batches, reshufflesBefore);
}

export function playSwap(state, a, b) {
  if (state.status !== "playing" || !Number.isInteger(a) || !Number.isInteger(b)
      || a < 0 || b < 0 || a >= CELL_COUNT || b >= CELL_COUNT
      || !adjacent(a, b) || !canSwap(state.board, a) || !canSwap(state.board, b)) {
    return actionResult(state, false, "invalid");
  }
  const reshufflesBefore = state.reshuffles;
  const powerA = state.board[a].p;
  const powerB = state.board[b].p;
  if (powerA || powerB) {
    swapPieces(state.board, a, b);
    if (Boolean(powerA) !== Boolean(powerB)) {
      const power = powerA || powerB;
      const powerIndex = powerA ? b : a;
      const partnerIndex = powerA ? a : b;
      const match = matchGroups(state.board);
      if (match.cells.size) {
        const deferredPower = {
          index: powerIndex,
          power,
          partnerIndex,
          partnerColor: state.board[partnerIndex].c,
          consumed: false,
        };
        state.moves -= 1;
        const specials = specialsFromMatches(state.board, match, partnerIndex);
        const direct = new Set(match.cells);
        const powerSet = new Set();
        for (const special of specials) direct.delete(special.at);
        const visualEffects = expandTriggeredPowers(state.board, direct, powerSet, new Set([powerIndex]));
        for (const special of specials) direct.add(special.at);
        const matchBatches = resolveCascade(state, direct, powerSet, specials, false, visualEffects, deferredPower);
        const powerBatches = resolveDeferredPower(state, deferredPower);
        return actionResult(state, true, "match", [...matchBatches, ...powerBatches], reshufflesBefore);
      }
    }
    state.moves -= 1;
    const effect = comboEffect(state, a, b);
    const batches = resolveCascade(state, effect.direct, effect.powerSet, null, effect.forceGate, effect.visualEffects);
    return actionResult(state, true, "power-combo", batches, reshufflesBefore);
  }

  swapPieces(state.board, a, b);
  const match = matchGroups(state.board);
  if (!match.cells.size) {
    swapPieces(state.board, a, b);
    return actionResult(state, false, "no-match");
  }

  state.moves -= 1;
  const specials = specialsFromMatches(state.board, match, b);
  const direct = new Set(match.cells);
  const powerSet = new Set();
  for (const special of specials) direct.delete(special.at);
  const visualEffects = expandTriggeredPowers(state.board, direct, powerSet);
  for (const special of specials) direct.add(special.at);
  const batches = resolveCascade(state, direct, powerSet, specials, false, visualEffects);
  return actionResult(state, true, "match", batches, reshufflesBefore);
}

export function getLegalMoveCount(board) {
  return legalMoves(board).length;
}
