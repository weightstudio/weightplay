export const WIDTH = 12;
export const DEPTH = 18;

const positions = [
  [[-3.9, 4.9], [3.5, -4.5], [-3, -5], [3.3, 4.8]],
  [[2.4, 5.7], [-2.9, -5.2], [-3.3, 5.5], [3.6, -4.5]],
  [[0, -6.4], [0, 6.1], [3.8, -4.7], [-3.7, 5.6]],
  [[3.8, 4.5], [-3.7, -4.3], [3.8, -5.4], [-3.1, 5.2]],
  [[-2.9, 5.5], [2.5, -5.7], [-3.4, -5.4], [3.4, 4.1]],
];

const pattern = [
  { gates: 0 }, { gates: 1 }, { gates: 1, side: true },
  { gates: 0, split: true }, { gates: 1, wind: 1 }, { gates: 2, split: true, wind: .65 },
  { gates: 1, wind: 1, shelter: true }, { gates: 2, side: true, shelter: true },
  { gates: 2, split: true, shelter: true }, { gates: 1, split: true, wind: 1.2, swing: true },
  { gates: 2, split: true, neutral: true, wind: .9 },
  { gates: 2, split: true, wind: 1.1, swing: true, shelter: true },
];

export const equipment = Object.freeze([
  { id: 'standard', unlock: 0, radius: 3.0, icon: 'pickup' },
  { id: 'wide', unlock: 5, radius: 4.25, icon: 'range' },
  { id: 'wind', unlock: 20, radius: 3.15, icon: 'defense' },
  { id: 'split', unlock: 35, radius: 3.0, icon: 'party' },
]);

function buildStage(index) {
  const arc = Math.floor(index / 5);
  const variation = index % 5;
  const rules = pattern[arc];
  const [first, last, second, other] = positions[variation];
  const flip = arc % 2 === 0 ? 1 : -1;
  const point = ([x, z]) => ({ x: x * flip, z });
  const initially = index === 0
    ? [{ start: { x: 0, z: 3.9 }, end: { x: 0, z: -5.0 }, shape: 0, count: 3 }]
    : [{ start: point(first), end: point(last), shape: 0, count: 3 }];
  const hasSecond = rules.split || (arc === 0 && variation >= 3);
  if (hasSecond) initially.push({ start: point(second), end: point(other), shape: 1, count: 3 });
  if (rules.neutral) initially.push({
    start: { x: .25 * flip, z: 3.8 }, end: point(last), shape: 0, count: 2,
  });
  const total = initially.reduce((sum, lane) => sum + lane.count, 0) + (index === 0 ? 3 : 0);
  const checkpoint = variation === 4;
  return Object.freeze({
    id: index + 1, arc, night: arc >= 6, checkpoint, lanes: initially, total,
    need: arc === 0 || checkpoint ? total : total - 1,
    limit: arc === 0 ? [42,44,43,46,49][variation] : index === 41 ? 47 : 36 + (arc * 7 + variation * 3) % 14,
    wind: rules.wind || 0, swing: Boolean(rules.swing), shelter: Boolean(rules.shelter),
    gates: Array.from({ length: rules.gates }, (_, i) => ({
      z: rules.gates === 2 ? (i === 0 ? -2.5 : 2.5) : 0,
      center: (i % 2 === 0 ? 1 : -1) * flip * ([0,.8,-.85,1.5,-1.4][variation]),
      period: [7, 6.5, 6, 7.5, 8][(arc + variation + i) % 5],
      phase: (variation % 2 === 0 ? 1 : 5) + i * 2.3,
      openFor: index === 41 ? 4.45 : 3.65,
      side: Boolean(rules.side || checkpoint),
    })),
  });
}

export const stages = Object.freeze(Array.from({ length: 60 }, (_, index) => buildStage(index)));
