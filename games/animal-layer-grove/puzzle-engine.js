/* Layer Grove: pure occlusion rules. No answer order is shipped or rendered.
   Front-to-back order and quarter-turns produce the live visible board. */
(function (root) {
  'use strict';
  const SIZE = 4;
  const rotate = mask => {
    let result = 0;
    for (let p = 0; p < 16; p += 1) if (mask & (1 << p)) result |= 1 << ((p % 4) * 4 + 3 - Math.floor(p / 4));
    return result;
  };
  const maskAt = (mask, turns) => {
    for (let i = 0; i < ((turns % 4) + 4) % 4; i += 1) mask = rotate(mask);
    return mask;
  };
  const valid = (level, state) => {
    const n = level.masks.length;
    return Array.isArray(state.order) && state.order.length === n && new Set(state.order).size === n
      && state.order.every(i => Number.isInteger(i) && i >= 0 && i < n)
      && Array.isArray(state.turns) && state.turns.length === n
      && state.turns.every((t, i) => Number.isInteger(t) && t >= 0 && t < 4 && (level.rotatable.includes(i) || t === 0));
  };
  const compose = (level, state) => {
    if (!valid(level, state)) throw new TypeError('INVALID_LAYER_STATE');
    const board = Array(16).fill(-1);
    const masks = level.masks.map((mask, i) => maskAt(mask, state.turns[i]));
    for (let depth = state.order.length - 1; depth >= 0; depth -= 1) {
      const i = state.order[depth];
      for (let p = 0; p < 16; p += 1) if (masks[i] & (1 << p)) board[p] = i;
    }
    return board;
  };
  const measure = (rule, board) => {
    const [type, subject] = rule;
    if (type === 'cell') return board[subject];
    if (type === 'count') return board.filter(i => i === subject).length;
    if (type === 'row') return board.slice(subject[0] * SIZE, (subject[0] + 1) * SIZE).filter(i => i === subject[1]).length;
    if (type === 'column') return board.filter((i, p) => p % SIZE === subject[0] && i === subject[1]).length;
    throw new TypeError('UNKNOWN_CLUE_TYPE');
  };
  const evaluate = (level, state) => {
    const board = compose(level, state);
    const checks = level.clues.map(rule => ({ rule, actual: measure(rule, board), met: measure(rule, board) === rule[2] }));
    return { board, checks, solved: checks.every(check => check.met) };
  };
  const initial = level => ({ order: [...level.initial], turns: level.masks.map(() => 0) });
  const copy = state => ({ order: [...state.order], turns: [...state.turns] });
  const act = (level, state, action) => {
    if (!valid(level, state)) return null;
    const next = copy(state), i = action.index;
    if (!Number.isInteger(i) || i < 0 || i >= level.masks.length) return null;
    if (action.type === 'swap' && [-1, 1].includes(action.direction)) {
      const j = i + action.direction;
      if (j < 0 || j >= next.order.length) return null;
      [next.order[i], next.order[j]] = [next.order[j], next.order[i]];
    } else if (action.type === 'rotate' && level.rotatable.includes(i)) next.turns[i] = (next.turns[i] + 1) % 4;
    else return null;
    return next;
  };
  const levels = [{"id":"stage-01","chapter":0,"masks":[255,14096,30240],"rotatable":[],"initial":[2,1,0],"clues":[["cell",5,0],["cell",4,1]],"par":2},{"id":"stage-02","chapter":0,"masks":[30480,3302,819],"rotatable":[],"initial":[1,0,2],"clues":[["cell",4,2],["cell",10,0]],"par":3},{"id":"stage-03","chapter":0,"masks":[20160,191,3308],"rotatable":[],"initial":[1,0,2],"clues":[["cell",7,0],["cell",3,2]],"par":2},{"id":"stage-04","chapter":0,"masks":[4913,61312,63296],"rotatable":[],"initial":[0,2,1],"clues":[["cell",8,1],["cell",12,0]],"par":2},{"id":"stage-05","chapter":0,"masks":[13858,64272,1655],"rotatable":[],"initial":[1,0,2],"clues":[["cell",9,2],["cell",12,0]],"par":3},{"id":"stage-06","chapter":1,"masks":[13104,2284,3175,1270],"rotatable":[],"initial":[1,3,2,0],"clues":[["count",1,5],["count",2,1]],"par":3},{"id":"stage-07","chapter":1,"masks":[60608,52422,375,25126],"rotatable":[],"initial":[3,2,0,1],"clues":[["count",3,2],["count",0,1]],"par":5},{"id":"stage-08","chapter":1,"masks":[30512,231,60484,823],"rotatable":[],"initial":[0,1,2,3],"clues":[["count",2,3],["count",3,7]],"par":4},{"id":"stage-09","chapter":1,"masks":[52364,823,50278,36044],"rotatable":[],"initial":[1,0,3,2],"clues":[["count",2,2],["count",0,7]],"par":3},{"id":"stage-10","chapter":1,"masks":[11968,631,819,3174],"rotatable":[],"initial":[2,1,0,3],"clues":[["count",3,3],["count",2,1]],"par":5},{"id":"stage-11","chapter":2,"masks":[28384,13073,119,559],"rotatable":[3],"initial":[2,1,3,0],"clues":[["count",0,6],["count",3,1],["count",1,2],["cell",15,3]],"par":4},{"id":"stage-12","chapter":2,"masks":[819,36040,44608,60544],"rotatable":[3],"initial":[2,3,1,0],"clues":[["count",1,2],["count",2,2]],"par":5},{"id":"stage-13","chapter":2,"masks":[60992,28228,52768,13104],"rotatable":[3],"initial":[1,0,2,3],"clues":[["count",3,4],["cell",13,3],["count",0,1]],"par":5},{"id":"stage-14","chapter":2,"masks":[63232,60608,1841,10976],"rotatable":[3],"initial":[2,1,0,3],"clues":[["count",3,3],["count",2,3],["count",1,2]],"par":6},{"id":"stage-15","chapter":2,"masks":[52424,36559,30272,63232],"rotatable":[3],"initial":[3,2,0,1],"clues":[["count",2,1],["count",1,7]],"par":4},{"id":"stage-16","chapter":3,"masks":[4919,1230,2286,9840],"rotatable":[2,3],"initial":[0,2,1,3],"clues":[["row",[0,0],2],["row",[2,2],2],["count",3,4]],"par":5},{"id":"stage-17","chapter":3,"masks":[119,13169,52896,60928],"rotatable":[2,3],"initial":[2,1,0,3],"clues":[["row",[1,1],1],["count",2,2]],"par":7},{"id":"stage-18","chapter":3,"masks":[62976,25796,29280,383],"rotatable":[2,3],"initial":[1,2,3,0],"clues":[["count",3,5],["row",[0,2],3]],"par":6},{"id":"stage-19","chapter":3,"masks":[3276,3278,29488,26160],"rotatable":[2,3],"initial":[3,2,1,0],"clues":[["count",3,3],["row",[0,2],1],["count",1,1]],"par":7},{"id":"stage-20","chapter":3,"masks":[35022,5971,30242,9076],"rotatable":[2,3],"initial":[0,1,2,3],"clues":[["row",[0,2],2],["count",3,3]],"par":7},{"id":"stage-21","chapter":4,"masks":[52320,4596,13152,4032,52800],"rotatable":[4],"initial":[1,3,2,4,0],"clues":[["row",[0,4],1],["row",[2,4],1],["row",[3,2],2],["count",3,1]],"par":6},{"id":"stage-22","chapter":4,"masks":[65024,159,1772,62224,20336],"rotatable":[4],"initial":[1,0,3,4,2],"clues":[["row",[3,0],2],["count",2,4]],"par":8},{"id":"stage-23","chapter":4,"masks":[14192,65184,3306,27840,59624],"rotatable":[4],"initial":[3,2,4,1,0],"clues":[["count",3,3],["row",[0,4],1],["row",[3,1],1]],"par":7},{"id":"stage-24","chapter":4,"masks":[1763,52460,29488,2239,6000],"rotatable":[4],"initial":[1,4,0,3,2],"clues":[["column",[2,4],1],["count",2,4],["row",[2,3],1]],"par":6},{"id":"stage-25","chapter":4,"masks":[1267,17510,882,238,61064],"rotatable":[4],"initial":[3,4,1,2,0],"clues":[["row",[3,4],2],["count",3,1],["count",2,1],["count",1,2]],"par":6},{"id":"stage-26","chapter":5,"masks":[28392,3300,231,119,60032],"rotatable":[3,4],"initial":[3,4,2,1,0],"clues":[["row",[1,2],2],["column",[0,3],1],["count",0,4],["column",[2,1],1]],"par":9},{"id":"stage-27","chapter":5,"masks":[3276,52977,819,20108,3310],"rotatable":[3,4],"initial":[0,2,4,3,1],"clues":[["count",1,3],["column",[1,4],3],["count",3,1]],"par":9},{"id":"stage-28","chapter":5,"masks":[3980,252,51404,111,60992],"rotatable":[3,4],"initial":[2,0,1,3,4],"clues":[["count",4,3],["row",[3,3],2],["count",1,2],["count",3,2]],"par":7},{"id":"stage-29","chapter":5,"masks":[58976,26188,883,371,13075],"rotatable":[3,4],"initial":[1,2,3,0,4],"clues":[["row",[0,3],1],["count",4,2],["count",3,1],["row",[1,0],1]],"par":8},{"id":"stage-30","chapter":5,"masks":[59584,3276,17646,60928,631],"rotatable":[3,4],"initial":[2,3,1,0,4],"clues":[["count",3,5],["row",[3,0],2],["row",[0,1],2]],"par":9}];

  const api = { SIZE, levels, rotate, maskAt, valid, compose, measure, evaluate, initial, copy, act };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.LayerGrovePuzzle = Object.freeze(api);
})(typeof window !== 'undefined' ? window : globalThis);
