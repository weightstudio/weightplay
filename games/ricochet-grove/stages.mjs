import { COLS, drop, stock } from './core.mjs?wp-media=594c1528dc328909';

const PROFILES = [
  '2201:0000','3202:0000','3213:0000','3221:1000','3211:1000',
  '3212:2100','3213:1200','3221:2100','3212:1100','3311:2200',
  '3313:1200','3321:2100','3312:1100','4313:2200','4321:1100',
  '4321:2110','5312:1110','4313:2220','4321:1110','5311:2110',
  '4312:1110','5313:2220','4321:1110','4312:2110','5311:1220',
  '4313:2220','5321:1110','4412:2110','4413:1220','5421:2110',
  '4321:2111','5312:1111','4313:2222','4321:1111','5311:2111',
  '4312:1111','5313:2222','4321:1111','4312:2111','5311:1222',
  '4313:2222','5321:1111','4312:2111','4313:1222','5321:2111',
  '4321:2111','5312:1111','4313:2222','4321:1111','5311:2111',
  '5312:1111','5313:2222','5421:1111','5412:2111','5411:1222',
  '5313:2222','5321:1111','5412:2111','5413:1222','5421:2112',
];
const first = {
  id: 1, rows: 2, mouths: [0, 1, 2, 3, 4], water: 0, slack: 1, beds: [3, 0],
  pair: false, pegs: [1,1,1,-1,-1,1,-1,1,1,-1].map(d => ({ d, kind: 'peg' })),
  witness: [{ mouth: 1, turn: null }, { mouth: 0, turn: null }],
};

function generator(seed) {
  return n => {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    return (seed >>> 0) % n;
  };
}

function shuffle(list, rand) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

function assemble(id, profile) {
  const [rows, quota, water, slack, dew, lock, wind, hinge] = profile.replace(':', '').split('').map(Number);
  const rand = generator((0x361fe2d9 ^ Math.imul(id, 0x9e3779b1)) >>> 0);
  const pair = id >= 21 && (id <= 30 || id >= 51);
  const required = id % 5 === 0 ? (id >= 31 ? 'hinge' : id >= 16 ? 'wind' : id >= 5 ? 'dew' : '') : '';
  for (let i = 0; i < 128; i++) {
    const pegs = Array.from({ length: rows * COLS }, () => ({ d: rand(2) ? 1 : -1, kind: 'peg' }));
    const indices = shuffle(pegs.map((_, j) => j), rand);
    for (const [kind, count] of [['dew', dew], ['lock', lock], ['wind', wind], ['hinge', hinge]]) {
      for (let n = 0; n < count; n++) pegs[indices.pop()].kind = kind;
    }
    const mouths = id < 4 ? [0, 1, 2, 3, 4] : shuffle([0, 1, 2, 3, 4], rand).slice(0, id % 5 === 0 ? 3 : 4).sort();
    const stage = { id, rows, water, slack, mouths, pegs, pair, beds: Array(quota).fill(-1) };
    // Generate a route proof first; each reachable endpoint becomes a real authored order.
    // Bounded branches choose new beds and preserve mutable peg/hinge and water state.
    let remaining = 2200;
    function build(state, used, witness, flags) {
      if (--remaining < 0) return null;
      if (witness.length === quota) {
        if (required && !flags.has(required)) return null;
        if (id >= 8 && id % 5 === 0 && !flags.has('turn')) return null;
        return witness;
      }
      const turns = state.water ? [null, ...indices] : [null];
      // Dew, wind and hinge may also be manually redirected.
      if (state.water && id >= 6) {
        stage.pegs.forEach((p, ix) => { if (p.kind !== 'lock' && p.kind !== 'peg') turns.push(ix); });
      }
      const options = [];
      for (const mouth of mouths) {
        for (const turn of turns) {
          const shot = drop(stage, state, mouth, turn);
          if (!shot || used.has(shot.col)) continue;
          const touches = turn === null || shot.path.some(hit => hit.index === turn);
          if (touches) options.push({ mouth, turn, col: shot.col });
        }
      }
      for (const shot of shuffle(options, rand)) {
        stage.beds[state.blooms] = shot.col;
        const actual = drop(stage, state, shot.mouth, shot.turn);
        const nextFlags = new Set(flags);
        for (const event of actual.events) nextFlags.add(event.kind);
        if (shot.turn !== null) nextFlags.add('turn');
        const route = build(actual.next, new Set([...used, shot.col]), [...witness, shot], nextFlags);
        if (route) return route;
        stage.beds[state.blooms] = -1;
      }
      return null;
    }
    const witness = build(stock(stage), new Set(), [], new Set());
    if (witness) return { ...stage, beds: witness.map(s => s.col), witness };
  }
  throw new Error('No valid design for bed layout ' + id);
}

export const STAGES = [first, ...PROFILES.slice(1).map((profile, i) => assemble(i + 2, profile))];
