/** Dustwake Depot: authored campaign. Coordinates are cell centres, never half-cells. */
export const TOOLS = Object.freeze({
  breeze: Object.freeze({ id: 'breeze', speed: 3.6, capacity: 8, radius: .70, compression: 0, unlockAfter: 0 }),
  cargo: Object.freeze({ id: 'cargo', speed: 3.0, capacity: 12, radius: .70, compression: 0, unlockAfter: 5 }),
  press: Object.freeze({ id: 'press', speed: 3.2, capacity: 8, radius: .55, compression: 2, unlockAfter: 30 }),
});

export const GROUPS = Object.freeze({ A: [2, 1], B: [5, 1], C: [8, 1], D: [2, 3], E: [5, 3], F: [8, 3], G: [2, 5], H: [5, 5], I: [8, 5] });
export const PADS = Object.freeze({ p: [7, 6], q: [7, 1], r: [2, 2] });
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => i + a);
const v = (x, a, b) => range(a, b).map(z => [x, z]);
const h = (z, a, b) => range(a, b).map(x => [x, z]);
const layouts = {
  O: [], V: v(4, 2, 5), U: [...v(3, 2, 4), ...h(4, 4, 6)],
  Z: [...v(3, 1, 3), ...v(6, 1, 2), [8, 2], ...v(6, 4, 6)],
  H: [...h(2, 3, 6), ...h(4, 3, 6)], C: [[4, 3], [4, 4], [6, 3], [6, 4]],
  R: [[3, 2], [4, 2], [6, 4], [7, 4]], K: v(4, 1, 6).filter(([, z]) => z !== 3),
};
const GATES = { 1: [4, 3], 2: [4, 6], 3: [7, 2] };

// Authored mastery goals, separate from the forgiving clear deadline. Initial
// values use known legal Breeze witnesses (not optimal-play claims), with
// first-play observations informing Stage 4's 22/34. Recalibrate through play.
const STAR_SECONDS = [
  [10,17],[12,20],[12,19],[22,34],[19,29],[13,20],[18,27],[23,34],[23,34],[21,32],
  [21,32],[24,37],[23,35],[28,42],[26,39],[16,25],[29,44],[36,54],[30,45],[29,43],
  [23,35],[25,38],[25,38],[30,45],[28,42],[25,38],[44,64],[27,41],[41,60],[40,58],
  [18,28],[19,29],[22,34],[22,34],[25,38],[27,41],[25,38],[30,45],[26,38],[35,52],
  [34,50],[27,40],[29,43],[30,45],[36,54],[30,44],[30,45],[30,45],[27,40],[32,47],
  [30,45],[34,51],[29,43],[41,61],[29,44],[29,44],[30,45],[40,59],[39,57],[46,66],
];

// [name (English, Traditional Chinese), layout, authored piles, seconds, gate, pads, rules]
const rows = [
  ['First Sweep', '苔徑初掃', 'O', 'G4 H4', 75],
  ['East Glimmers', '東端亮點', 'O', 'G3 I4', 70],
  ['Stone Fork', '石邊分路', 'R', 'D4 H4', 75],
  ['Northern Loop', '北園一圈', 'V', 'A4 C4 H2', 85],
  ['Two-bag Opening', '雙袋開園', 'O', 'A4 H4 I4', 85, 0, '', { maxTrips: 2 }],
  ['First Rain Brush', '雨痕第一刷', 'O', 'G4 Hm4', 85],
  ['Dry and Wet Banks', '乾濕兩岸', 'V', 'D4 Fm4', 90],
  ['Mossy Corner', '苔石轉角', 'U', 'A4 Fm4 H2', 95],
  ['Mixed Small Loads', '短袋混掃', 'C', 'D3 Em3 I4', 90],
  ['Dry Cargo First', '乾袋先行', 'R', 'A4 Cm4 G4', 100, 0, '', { dryDeliveredBeforeWet: 4 }],
  ['Brush or Detour', '錯模式繞路', 'U', 'Am4 D4 I4', 95],
  ['Long-wall Brush', '長牆濕帶', 'V', 'Am4 B4 F4', 100],
  ['Two Garden Doors', '雙口石庭', 'H', 'A4 E4 Im4', 100],
  ['Staggered Piles', '交錯小堆', 'Z', 'A3 Em3 I4', 95],
  ['Wet Cargo Batches', '濕區雙程', 'C', 'Am4 Fm4 G4 I4', 110, 0, '', { minLoad: 4 }],
  ['First Wind Gate', '風口初見', 'K', 'A4 E4', 90, 1],
  ['South Shortcut', '南門捷徑', 'V', 'D4 F4 Hm4', 95, 2],
  ['Dust Beyond Wind', '風後濕塵', 'K', 'Am4 F4 I4', 100, 1],
  ['East-wind Corridor', '東風迴廊', 'Z', 'A4 Cm4 H4', 100, 3],
  ['Three-beat Wind', '三拍風門', 'K', 'A4 Cm4 F4 G4', 115, 1, '', { gateOpen: 2, gateClosed: 4 }],
  ['Courtyard Detour', '中庭繞吹', 'C', 'A4 Em4 I4', 95],
  ['Southern Loads', '南袋北刷', 'V', 'Am4 C4 G4 I4', 110, 2],
  ['Wet Relay', '濕帶接力', 'H', 'Am4 E4 Im4', 105],
  ['Northern Parcels', '北風小貨', 'Z', 'A3 Cm3 F4 H4', 105, 3],
  ['Depot Light Window', '回站燈窗', 'V', 'A4 Cm4 F4 H4', 120, 2, '', { depotWindow: { openSeconds: 3, closedSeconds: 3 } }],
  ['Far Before Near', '先遠後近', 'U', 'A4 Cm4 D4 I4', 110],
  ['Little Bank Loop', '雙岸小環', 'K', 'Am3 C4 Em3 G4 I4', 120, 1],
  ['Cargo Mainway', '幹道換袋', 'R', 'A4 Bm4 F4 H4', 110],
  ['Twin Wet Winds', '風迴雙濕', 'Z', 'Am4 C4 Fm4 G4 I4', 125, 3],
  ['Dawn Cleanup', '曙光總清理', 'K', 'Am4 C4 E4 Fm4 G4 I4', 140, 1, '', { gateUnlockAfterBaseDelivered: 8 }],
  ['First Outpost', '第一座分站', 'O', 'A4 C4 F4', 100, 0, 'pq'],
  ['Corner Supply', '轉角補給', 'U', 'Am4 C4 I4', 105, 0, 'pr'],
  ['Outside the Wall', '牆外回運', 'V', 'A4 Fm4 H4 I4', 115, 2, 'pq'],
  ['Twin Wet Outposts', '雙濕分站', 'C', 'Am4 Fm4 G4 I4', 115, 0, 'qr'],
  ['One Landing', '一次落位', 'K', 'A4 Cm4 E4 I4', 120, 1, 'pq', { portableRequired: true }],
  ['Compact Cargo', '小口壓艙', 'O', 'A4 B4 C4 H4 I4', 110, 0, 'pq'],
  ['Wet Pack Reserve', '濕艙留空', 'U', 'Am4 C4 D4 Fm4', 115, 0, 'pr'],
  ['Gate-side Loads', '雙閘外袋', 'V', 'Am4 C4 F4 Hm4 I4', 125, 2, 'pq'],
  ['Garden Press', '斜庭回壓', 'R', 'A4 Bm4 D4 F4 I4', 120, 0, 'qr'],
  ['Three-load Manifest', '三袋封單', 'K', 'Am4 C4 E4 Fm4 G4 I4', 140, 1, 'pq', { maxTrips: 3 }],
  ['Wind-side Brush', '風外雙濕', 'Z', 'Am4 C4 Fm4 H4 I4', 120, 3, 'pq'],
  ['Central Confluence', '中線匯流', 'H', 'A4 Cm4 E4 G4 Im4', 125, 0, 'qr'],
  ['Late Northern Stop', '晚到北站', 'V', 'A4 Bm4 F4 G4 I4', 120, 2, 'pq'],
  ['Wet Gate Parcels', '濕門小堆', 'K', 'Am3 C4 Em3 F4 G4 I4', 130, 1, 'pq'],
  ['Wind-window Shipping', '風停出貨', 'Z', 'A4 Cm4 F4 Hm4 I4', 135, 3, 'pq', { depotWindow: { openSeconds: 3, closedSeconds: 3 } }],
  ['Courtyard Brush', '回字濕庭', 'C', 'Am4 B4 Fm4 G4 H4 I4', 125, 0, 'pr'],
  ['Wall-side Cargo', '長牆雙貨', 'V', 'A4 Cm4 D4 F4 Hm4 I4', 140, 2, 'pq'],
  ['Zigzag Press', '之字壓艙', 'Z', 'A4 Bm4 F4 G4 H4 I4', 130, 3, 'pq'],
  ['Five Courtyard Piles', '中庭五群', 'H', 'Am4 C4 E4 G4 Im4', 125, 0, 'qr'],
  ['Delayed Outpost', '晚亮分站', 'K', 'A4 Cm4 E4 Fm4 G4 I4', 145, 1, 'pq', { portableUnlockAfterBaseLoad: 8 }],
  ['South Bank Reserve', '南岸留袋', 'U', 'Am4 C4 D4 Fm4 H4 I4', 135, 0, 'pr'],
  ['Wind-bridge Order', '風橋遠單', 'K', 'Am4 B4 C4 Fm4 H4 I4', 145, 1, 'pq'],
  ['Rainy Twin Gardens', '雨後雙院', 'R', 'Am4 B4 D4 Fm4 G4 I4', 135, 0, 'qr'],
  ['Brief North Wind', '短窗北行', 'Z', 'A4 Bm4 C4 F4 Hm4 I4', 145, 3, 'pq', { gateOpen: 2, gateClosed: 4 }],
  ['Four-corner Batches', '四角零散', 'C', 'Am4 C4 D4 Fm4 G4 I4', 145, 0, 'qr', { minLoad: 6 }],
  ['Twin-wall Finale', '雙牆收尾', 'H', 'Am4 B4 C4 E4 G4 Im4', 140, 0, 'qr'],
  ['Two Wind Brushes', '風口兩刷', 'V', 'A4 Cm4 D4 Fm4 H4 I4', 145, 2, 'pq'],
  ['Across-bank Manifest', '隔岸大單', 'K', 'Am4 B4 C4 E4 Fm4 G4 I4', 155, 1, 'pq'],
  ['Rain Garden Circuit', '雨庭循環', 'Z', 'A4 Bm4 C4 D4 Fm4 H4 I4', 155, 3, 'pq'],
  ['Dustwake Reopens', '塵光重開', 'K', 'Am4 B4 Cm4 E4 F4 G4 Hm4 I4', 180, 1, 'pq', { gateOpen: 2, gateClosed: 4, portableUnlockAfterBaseLoad: 8 }],
];

function stageFromRow(row, i) {
  const [name, nameZh, layout, groups, seconds, gate = 0, pads = '', rules = {}] = row;
  const dust = groups.split(' ').map(token => {
    const match = /^([A-I])(m?)([234])$/.exec(token);
    if (!match) throw new Error(`Invalid authored group ${token}`);
    return { group: match[1], kind: match[2] ? 'wet' : 'dry', count: Number(match[3]) };
  });
  return Object.freeze({ id: i + 1, chapter: i < 30 ? 1 : 2, name, nameZh, nameKey: `stage-${i + 1}`, width: 10, height: 8, layout, dust,
    seconds, starSeconds: Object.freeze([...STAR_SECONDS[i]]), checkpoint: (i + 1) % 5 === 0, seed: 0x44574400 + i + 1, rules: Object.freeze({ ...rules }),
    walls: layouts[layout].map(c => Object.freeze([...c])), depot: Object.freeze([1, 6]),
    gates: gate ? [{ x: GATES[gate][0], z: GATES[gate][1], openSeconds: rules.gateOpen || 3, closedSeconds: rules.gateClosed || 3, phase: 0 }] : [],
    pads: [...pads].map(p => Object.freeze([...PADS[p]])), target: dust.reduce((a, p) => a + p.count, 0),
  });
}

export const STAGES = Object.freeze(rows.map(stageFromRow));
export function getStage(id) {
  if (!Number.isInteger(Number(id)) || Number(id) < 1 || Number(id) > STAGES.length) throw new RangeError('Invalid stage');
  return STAGES[Number(id) - 1];
}

/** Grade an actual successful elapsed time; callers still own the win check. */
export function starsForElapsed(stageId, elapsed) {
  const stage = getStage(stageId);
  if (!Number.isFinite(elapsed) || elapsed < 0 || elapsed > stage.seconds + 1e-6) return 0;
  return elapsed <= stage.starSeconds[0] + 1e-6 ? 3 : elapsed <= stage.starSeconds[1] + 1e-6 ? 2 : 1;
}

/** Fresh mutable runtime data; immutable authoring records are never changed by a run. */
export function buildStage(id) {
  const s = getStage(id);
  return { ...s, starSeconds: [...s.starSeconds], dust: s.dust.map(d => ({ ...d })), walls: s.walls.map(p => [...p]), depot: [...s.depot],
    gates: s.gates.map(g => ({ ...g })), pads: s.pads.map(p => [...p]), rules: { ...s.rules, ...(s.rules.depotWindow ? { depotWindow: { ...s.rules.depotWindow } } : {}) },
    piles: s.dust.map(p => ({ id: `${s.id}:${p.group}`, group: p.group, x: GROUPS[p.group][0], z: GROUPS[p.group][1], kind: p.kind, remaining: p.count, max: p.count, collecting: 0 })),
  };
}
