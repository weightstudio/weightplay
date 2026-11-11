import { bit } from './core.mjs?wp-media=6a3d1c6d444e86cc';
const counts = kinds => [0, 1, 2].map(k => kinds.filter(v => k === v).length);
const box = (goods, cost, deposit = 0) => ({ goods: counts(goods), cost, deposit });
const basic = {
  orders: [[bit(0)], [bit(1)], []],
  offers: [box([0, 1], 4), box([0, 0], 3), box([0, 1, 2], 6)],
  shelf: 0, cold: false, cleanOnly: false, holdKind: -1,
};
const rotate = (array, count) => [...array.slice(count), ...array.slice(0, count)];
function buildStage(id) {
  if (id === 1) return { id, chapter: 1, arc: 0, budget: 7, reserve: 3, waves: [basic] };
  const chapter = id <= 30 ? 1 : 2;
  const arc = Math.floor((id - 1) / 5);
  const p = (id - 1) % 5;
  const phase = (arc + p) % 3;
  const seed = id * 13 + 7;
  const number = id >= 46 || [30, 45].includes(id) ? 3 : id === 2 || id === 4 ? 1 : 2;
  const manifests = Array.from({ length: number }, (_, w) => {
    const x = (phase + w + (p === 3 ? w : 0)) % 3;
    const y = (x + (seed % 2 === 0 ? 2 : 1)) % 3;
    const z = 3 - x - y;
    const third = id >= 5 && ((p + w) % 3 !== 1 || p === 4);
    const extra = id >= 16 && ((p + w) % 4 === 2 || p === 4 && w > 0);
    const flex = id >= 3 && ((id + w) % 2 === 0 || p === 4);
    const alternate = (arc === 3 || arc === 7 || arc === 10) ? x : y;
    const duplicatedSecond = id === 2 ? x : y;
    const desired = [x, duplicatedSecond, ...(third ? [z] : []), ...(extra ? [y] : [])];
    const orders = [
      [bit(x)],
      [bit(duplicatedSecond), ...(extra ? [bit(y)] : [])],
      third ? [bit(z) | (flex ? bit(alternate) : 0)] : [],
    ];
    const orderRotation = (seed + w) % 3;
    const cost = 4 + ((seed + w) % 4 === 0 ? 1 : 0) + Number(extra);
    const deposit = chapter === 2 ? 1 + ((p + w) % 2) : 0;
    const cleanOnly = chapter === 2 && arc >= 8 && (p + w) % 3 === 1;
    const shelf = id >= 6 && w + 1 < number && (p + w) % 4 !== 3 ? 1 : 0;
    const cold = chapter === 2 && arc >= 7 && (p + w) % 4 === 0;
    const holdKind = chapter === 2 && arc >= 8 && (p + w) % 5 === 4 ? (x + 1) % 3 : -1;
    return { x, y, z, cost, deposit, desired, orders: rotate(orders, orderRotation), orderRotation, shelf, cold, cleanOnly, holdKind };
  });
  const waves = manifests.map((plan, w) => {
    const { desired, x, y, z, cost, deposit, shelf, cold, cleanOnly, holdKind, orders } = plan;
    const follow = manifests[w + 1];
    const carry = follow ? (holdKind >= 0 ? holdKind : follow.desired.find(k => k !== 0) ?? 1) : z;
    const missing = w ? desired.findIndex(k => k === (manifests[w - 1].holdKind >= 0 ? manifests[w - 1].holdKind : desired.find(k => k !== 0))) : 0;
    const lean = desired.filter((_, i) => i !== Math.max(0, missing));
    // The cheap crate intentionally drops one necessary unit. An earlier batch
    // can send it forward; broad orders can sometimes accept a substitution.
    if (!w && id % 4 !== 0) lean.push(y);
    const alt = [...desired, carry];
    if (chapter === 2 && id % 3 === 0 && w > 0) {
      const flexHouse = orders.find(row => row.some(mask => (mask & (mask - 1)) !== 0));
      if (flexHouse) alt[2] = flexHouse[0] & bit(x) ? x : y;
    }
    const offers = rotate([
      box(desired, cost, deposit),
      box(lean, Math.max(2, cost - (w ? 2 : 1)), deposit + Number(chapter === 2 && p % 2 === 0)),
      box(alt, cost + (chapter === 2 && p % 2 === 0 ? 0 : 1), chapter === 2 ? (p + w) % 3 : 0),
    ], (seed + w + p) % 3);
    return { orders, offers, shelf, cold, cleanOnly, holdKind };
  });
  const reserve = 2 + (p % 2);
  return { id, chapter, arc, budget: manifests.reduce((a, b) => a + b.cost, 0) + reserve, reserve, waves };
}
export const STAGES = Object.freeze(Array.from({ length: 60 }, (_, i) => buildStage(i + 1)));
