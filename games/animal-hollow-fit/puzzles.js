/* Burrow Shape Match v11: 30 stages × 5 rooms; pure bounded puzzle generation. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.HollowPuzzles = api;
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';
  const SIZE = 5, STAGE_TOTAL = 30, ROOMS_PER_STAGE = 5, TOTAL = STAGE_TOTAL * ROOMS_PER_STAGE, CHAPTER_SIZE = 5;
  // Authored silhouettes. One row is always one physical left-to-right grid row.
  const SHAPES = [
    '00000/01100/00100/00110/00000', '00000/00100/01110/00100/00000',
    '00000/01110/01000/01100/00000', '00000/01000/01110/00010/00000',
    '00000/01100/01110/00100/00000', '00000/01100/00110/00010/00000',
    '00000/00110/01100/01000/00000', '00000/01000/01110/00100/00000',
    '00000/01110/00110/00010/00000', '00000/01100/01000/01110/00000',
    '00000/01100/00110/00100/00000', '00000/00110/00100/01110/00000',
    '00000/01110/01010/01000/00000', '00000/00110/01110/01000/00000',
    '00000/01100/01110/00010/00000', '00000/01110/01110/00110/00000',
    '00000/01110/01010/01110/00000', '00100/01110/11110/00100/00000',
    '00000/01110/11111/01110/00100', '00000/01111/01001/01111/00100',
    '00000/01110/00100/00110/00010', '00000/01100/00111/00010/00000',
    '00000/01111/01000/01100/00000', '00000/00110/01100/00110/00000',
    '00000/01000/01111/00110/00000', '00100/01110/01011/01110/00000',
    '00000/01111/01101/00111/00000', '00000/01110/11011/01110/00100',
    '00100/01110/01111/01100/00000', '00000/01110/11010/11110/00100'
  ].map(s => Object.freeze(s.replaceAll('/', '').split('').map(Number)));
  const equal = (a, b) => a.every((v, i) => v === b[i]);
  const count = p => p.reduce((a, b) => a + b, 0);
  const key = p => p.join('');
  function rotate(p) { return p.map((_, i) => p[(SIZE - 1 - i % SIZE) * SIZE + Math.floor(i / SIZE)]); }
  function mirror(p) { return p.map((_, i) => p[Math.floor(i / SIZE) * SIZE + SIZE - 1 - i % SIZE]); }
  function transform(p, turns = 0, flip = false) {
    let out = flip ? mirror(p) : [...p];
    for (let i = 0; i < ((turns % 4) + 4) % 4; i++) out = rotate(out);
    return out;
  }
  function neighbors(i) {
    return [i - SIZE, i + SIZE, i % SIZE ? i - 1 : -1, i % SIZE < SIZE - 1 ? i + 1 : -1].filter(n => n >= 0 && n < 25);
  }
  function connected(p) {
    const first = p.indexOf(1);
    if (first < 0) return false;
    const seen = new Set([first]), queue = [first];
    for (let j = 0; j < queue.length; j++) for (const n of neighbors(queue[j])) if (p[n] && !seen.has(n)) { seen.add(n); queue.push(n); }
    return seen.size === count(p);
  }
  function rules(index) {
    const stage = Math.floor(index / ROOMS_PER_STAGE);
    const sublevel = index % ROOMS_PER_STAGE;
    const chapter = Math.floor(stage / CHAPTER_SIZE);
    return { stage, sublevel, chapter, rotate: chapter === 1 || chapter >= 4, mirror: chapter === 2 || chapter >= 4, patch: chapter === 3 || chapter === 5 };
  }
  function variants(p, rule) {
    const out = new Map();
    for (const flip of rule.mirror ? [false, true] : [false]) {
      for (let turn = 0; turn < (rule.rotate ? 4 : 1); turn++) {
        const value = transform(p, turn, flip); out.set(key(value), value);
      }
    }
    return [...out.values()];
  }
  function rng(seed) {
    let value = seed >>> 0;
    return () => { value += 0x6D2B79F5; let n = value; n = Math.imul(n ^ n >>> 15, n | 1); n ^= n + Math.imul(n ^ n >>> 7, n | 61); return ((n ^ n >>> 14) >>> 0) / 4294967296; };
  }
  function shuffle(items, random) {
    const out = [...items];
    for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
    return out;
  }
  function patchOf(target, index) {
    const start = target.map((v, i) => v ? i : -1).filter(i => i >= 0)[index % count(target)];
    const queue = [start], seen = new Set(queue), limit = Math.max(4, Math.floor(count(target) / 2));
    for (let i = 0; i < queue.length && queue.length < limit; i++) {
      for (const n of neighbors(queue[i])) {
        if (target[n] && !seen.has(n)) { seen.add(n); queue.push(n); if (queue.length === limit) break; }
      }
    }
    return target.map((_, i) => queue.includes(i) ? 1 : 0);
  }
  function make(index, seed) {
    if (!Number.isInteger(index) || index < 0 || index >= TOTAL) throw new RangeError('HOLLOW_ROOM_RANGE');
    const random = rng(seed), rule = rules(index), shapeIndex = (rule.stage * 7 + rule.sublevel * 11) % SHAPES.length, target = [...SHAPES[shapeIndex]];
    const required = rule.patch ? patchOf(target, index) : target;
    const fixed = target.map((v, i) => v && !required[i] ? 1 : 0);
    const equivalent = new Set(variants(required, rule).map(key));
    const decoys = [], seen = new Set(equivalent);
    // Equal cell counts defeat count-only guessing. Every decoy is connected,
    // differs in a real corner/notch and cannot solve after any allowed transform.
    for (const remove of shuffle(required.map((v, i) => v ? i : -1).filter(i => i >= 0), random)) {
      for (const add of shuffle(required.map((v, i) => !v ? i : -1).filter(i => i >= 0), random)) {
        const p = [...required]; p[remove] = 0; p[add] = 1;
        const orbit = variants(p, rule).map(key);
        if (!connected(p) || orbit.some(k => seen.has(k))) continue;
        orbit.forEach(k => seen.add(k)); decoys.push(p);
      }
    }
    if (decoys.length < 2) throw new Error('HOLLOW_DISTINCT_DECOYS_REQUIRED');
    // A transformed correct piece is not solved merely by selecting it in later chapters.
    const rotations = variants(required, rule).filter(p => !equal(p, required));
    const correct = rotations.length ? rotations[Math.floor(random() * rotations.length)] : required;
    return { index, ...rule, target, required, fixed, options: shuffle([correct, ...shuffle(decoys, random).slice(0, 2)], random) };
  }
  const solve = (round, pattern) => Array.isArray(pattern) && pattern.length === 25 && equal(round.required, pattern);
  const stars = (attempts, hinted) => hinted ? 1 : attempts === 1 ? 3 : attempts <= 3 ? 2 : 1;
  function readProgress(raw) {
    try {
      const data = JSON.parse(raw);
      if (data?.schema !== 11 || !Array.isArray(data.stars) || data.stars.length !== TOTAL || !data.stars.every(v => Number.isInteger(v) && v >= 0 && v <= 3)) throw new Error('invalid');
      return { schema: 11, stars: [...data.stars] };
    } catch { return { schema: 11, stars: Array(TOTAL).fill(0) }; }
  }
  return Object.freeze({ SIZE, STAGE_TOTAL, ROOMS_PER_STAGE, TOTAL, CHAPTER_SIZE, SHAPES: Object.freeze(SHAPES), count, equal, rotate, mirror, transform, connected, rules, variants, make, solve, stars, readProgress });
});
