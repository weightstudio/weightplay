export const ID = 'parcel-pact';
export const SAVE = 'weightplayParcelPactV1';
export const GOODS = ['citrus', 'grain', 'herb'];
export const TOOLS = [
  { id: 'none', unlock: 0, capacity: 0, cool: false, art: 'tray' },
  { id: 'tray', unlock: 1, capacity: 1, cool: false, art: 'tray' },
  { id: 'insulated', unlock: 15, capacity: 1, cool: true, art: 'insulated' },
  { id: 'rack', unlock: 30, capacity: 2, cool: false, art: 'rack' },
];
export const SHELL = { id: 'jade', cost: 8, key: ID + ':jade', color: 0x57b99e };
const empty = () => [0, 0, 0];
const sum = a => a.reduce((n, x) => n + x, 0);
export const bit = kind => 1 << kind;
export const items = counts => counts.flatMap((count, kind) => Array(count).fill(kind));
const accepted = (mask, kind) => (mask & bit(kind)) !== 0;
const optionsFor = (run, wave) => ({
  capacity: Math.max(run.tool.capacity, wave.shelf),
  cool: run.tool.cool || wave.cold,
  kind: wave.holdKind,
});
function begin(run, incoming = empty()) {
  run.pool = incoming;
  run.held = empty();
  run.opened = -1;
  run.moves = [];
  run.filled = run.stage.waves[run.wave].orders.map(order => order.map(() => -1));
}
export function newRun(stage, tool = TOOLS[0]) {
  const run = { stage, tool, money: stage.budget, wave: 0, wasted: 0, refunds: 0, delivered: 0, result: '', last: null };
  begin(run);
  return run;
}
export const currentWave = run => run.stage.waves[run.wave];
export function openOffer(run, index) {
  if (run.result || run.opened >= 0) return 'alreadyOpen';
  const offer = currentWave(run).offers[index];
  if (!offer) return 'chooseOffer';
  if (offer.cost + offer.deposit > run.money) return 'tooCostly';
  run.money -= offer.cost + offer.deposit;
  run.opened = index;
  run.pool = run.pool.map((n, k) => n + offer.goods[k]);
  return 'opened';
}
export function offerNeed(run, house, kind) {
  const order = currentWave(run).orders[house];
  const assigned = run.filled[house];
  if (!order || !assigned || !GOODS[kind]) return -1;
  const exact = order.findIndex((mask, i) => assigned[i] === -1 && mask === bit(kind));
  return exact < 0 ? order.findIndex((mask, i) => assigned[i] === -1 && accepted(mask, kind)) : exact;
}
export function deliver(run, kind, house) {
  if (run.result || run.opened < 0) return 'chooseOffer';
  if (!run.pool[kind]) return 'chooseGood';
  const slot = offerNeed(run, house, kind);
  if (slot === -1) return 'wrongHouse';
  run.pool[kind]--;
  run.filled[house][slot] = kind;
  run.moves.push({ kind, house, slot });
  run.delivered++;
  return 'delivered';
}
export function undo(run) {
  if (run.result || !run.moves.length) return false;
  const { kind, house, slot } = run.moves.pop();
  run.pool[kind]++;
  run.filled[house][slot] = -1;
  run.delivered--;
  return true;
}
export function hold(run, kind) {
  const wave = currentWave(run);
  const rules = optionsFor(run, wave);
  if (run.result || run.opened < 0 || run.wave + 1 === run.stage.waves.length) return 'noShelf';
  if (run.held[kind]) {
    run.held[kind]--;
    run.pool[kind]++;
    return 'released';
  }
  if (!rules.capacity) return 'noShelf';
  if (kind === 0 && !rules.cool) return 'needsCold';
  if (rules.kind >= 0 && rules.kind !== kind) return 'restrictedShelf';
  if (!run.pool[kind]) return 'chooseGood';
  if (sum(run.held) >= rules.capacity) return 'shelfFull';
  run.pool[kind]--;
  run.held[kind]++;
  return 'held';
}
export const shelf = run => optionsFor(run, currentWave(run));
export const firstMissing = run => run.filled.findIndex(order => order.includes(-1));
export function seal(run) {
  if (run.result || run.opened < 0) return 'chooseOffer';
  const missing = firstMissing(run);
  if (missing >= 0) {
    run.last = { missing, refund: 0, waste: 0 };
    run.result = 'loss';
    return 'loss';
  }
  const waste = sum(run.pool);
  const wave = currentWave(run), offer = wave.offers[run.opened];
  const refund = waste === 0 && (!wave.cleanOnly || sum(run.held) === 0) ? offer.deposit : 0;
  run.wasted += waste;
  run.refunds += refund;
  run.money += refund;
  run.last = { missing: -1, refund, waste, filled: run.filled.map(row => [...row]) };
  if (run.wave + 1 === run.stage.waves.length) {
    run.result = 'win';
    return 'win';
  }
  run.wave++;
  begin(run, [...run.held]);
  return 'nextWave';
}
export function grade(run) {
  if (run.result !== 'win') return 0;
  return 1 + Number(run.wasted === 0) + Number(run.money >= run.stage.reserve);
}
export function normalize(raw, stages) {
  const best = {};
  for (let i = 1; i <= stages; i++) {
    const score = raw?.schema === 1 ? raw.best?.[i] : 0;
    if (Number.isInteger(score) && score >= 1 && score <= 3) best[i] = score;
    else break;
  }
  const unlocked = Math.min(stages, Object.keys(best).length + 1);
  const tool = TOOLS.find(item => item.id === raw?.tool && (!item.unlock || best[item.unlock])) || TOOLS[0];
  return { schema: 1, best, unlocked, tool: tool.id, shell: raw?.shell === 'jade' ? 'jade' : 'plain' };
}
