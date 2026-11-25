function aperture(height, tilt = 0, room = 5) {
  return {
    low: height, high: height,
    minTilt: tilt - room, maxTilt: tilt + room,
    wind: 0, lock: '', hard: false, link: ''
  };
}

const training = [
  [1, 1, [aperture(3)]],
  [2, 1, [aperture(4, 0, 0)]],
  [1, 2, [aperture(4, 0, 0), aperture(4, 0, 0)]],
  [2, 2, [aperture(5, 1, 0), aperture(4, 0, 0)]],
  [1, 1, [aperture(3, -1, 0), aperture(4, 0, 1), aperture(3, 1, 0)]]
];

export const STAGES = training.map(([left, right, gates], index) => ({
  id: index + 1, arc: 0, left, right, gates, missAllowance: 0, ribbons: 0
}));

const seeds = [
  [53, 59, 67, 73, 83], [89, 97, 101, 107, 113], [127, 137, 139, 149, 157],
  [163, 173, 179, 191, 193], [197, 199, 211, 227, 229], [233, 239, 241, 251, 257],
  [263, 269, 271, 277, 281], [283, 293, 307, 311, 313], [317, 331, 337, 347, 349],
  [353, 359, 367, 373, 379], [383, 389, 397, 401, 409]
];
const arcRules = [
  { length: 3, wind: 1, slack: 2 },
  { length: 4, wind: 1, slack: 1 },
  { length: 4, wind: 1, slack: 2, locks: [1, 3] },
  { length: 5, wind: 2, slack: 1, locks: [1, 4] },
  { length: 5, wind: 2, slack: 1, locks: [2], hard: [2] },
  { length: 5, wind: 2, slack: 1, pairs: [1] },
  { length: 6, wind: 2, slack: 1, pairs: [1], locks: [3, 5] },
  { length: 6, wind: 3, slack: 1, pairs: [2], locks: [1], hard: [4] },
  { length: 7, wind: 3, slack: 1, pairs: [2], transfer: [4], locks: [5] },
  { length: 7, wind: 3, slack: 1, pairs: [1, 4], transfer: [3], locks: [5, 6] },
  { length: 8, wind: 3, slack: 1, pairs: [1, 5], transfer: [4], locks: [3, 6], hard: [4, 7] }
];

const adjustments = [
  [1, 0], [0, 1], [-1, 0], [0, -1], [0, 0]
];

function buildStage(seed, arc, offset) {
  if (arc === 1 && offset === 0) {
    return {
      id: 6, arc, seed, left: 1, right: 1, checkpoint: false, missAllowance: 0, ribbons: 0,
      gates: [
        { ...aperture(3, 1, 0), wind: 2 },
        { ...aperture(3, -2, 0), wind: -1 },
        { ...aperture(4, -1, 0), wind: -1 }
      ]
    };
  }
  let random = seed >>> 0;
  const roll = count => {
    random = (Math.imul(random, 1664525) + 1013904223) >>> 0;
    return (random >>> 10) % count;
  };
  const tuning = arcRules[arc - 1];
  const left = 1 + roll(3);
  const right = 1 + roll(3);
  const checkpoint = offset === 4;
  const length = tuning.length + Number(checkpoint);
  let l = left;
  let r = right;
  let lastWind = 0;
  let previousAction = -1;
  const gates = [];

  for (let index = 0; index < length; index += 1) {
    const lock = tuning.locks?.includes(index) ? ((seed + index) % 2 ? 'L' : 'R') : '';
    const transfer = tuning.transfer?.includes(index);
    const possible = adjustments.map(([dl, dr], action) => ({ dl, dr, action }))
      .filter(({ dl, dr, action }) => l + dl >= 0 && l + dl <= 4 && r + dr >= 0 && r + dr <= 4 &&
        !(lock === 'L' && dl) && !(lock === 'R' && dr) && action !== previousAction);
    const liftChange = transfer ? { dl: 0, dr: 0, action: 4 } : possible[roll(possible.length)];
    const direction = ((index + offset) % 2 === 0 ? -1 : 1);
    const wind = transfer ? -lastWind || direction * 2 : direction * (1 + roll(tuning.wind));
    previousAction = liftChange.action;
    lastWind = wind;
    l += liftChange.dl;
    r += liftChange.dr;

    const link = tuning.pairs?.includes(index) ? 'start' : tuning.pairs?.includes(index - 1) ? 'end' : '';
    const isFinal = checkpoint && index === length - 1;
    const hard = tuning.hard?.includes(index) || (isFinal && arc >= 5);
    const height = l + r;
    const lean = r - l + wind;
    const tight = transfer || hard || (arc >= 2 && (index + offset) % 2 === 1);
    const slack = tight ? 0 : tuning.slack;
    const lowRoom = (!isFinal && !link && !transfer && (index + offset) % 3 === 0) ? 1 : 0;
    const highRoom = (!isFinal && !link && !transfer && (index + offset) % 3 === 2) ? 1 : 0;
    gates.push({
      low: Math.max(0, height - lowRoom), high: Math.min(8, height + highRoom),
      minTilt: lean - slack, maxTilt: lean + slack,
      lock, wind, hard: Boolean(hard), link
    });
  }
  return {
    id: arc * 5 + offset + 1,
    arc, seed, left, right, gates, checkpoint,
    missAllowance: arc < 3 ? 0 : 1, ribbons: tuning.pairs?.length || 0
  };
}

for (const [group, values] of seeds.entries()) {
  STAGES.push(...values.map((seed, offset) => buildStage(seed, group + 1, offset)));
}
STAGES[4].checkpoint = true;
