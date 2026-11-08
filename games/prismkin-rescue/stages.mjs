const tilesOf = (cells, mark, width) => cells.flatMap((line, r) =>
  Array.from(line, (cell, c) => mark.includes(cell) ? r * width + c : -1).filter(v => v >= 0));

export function compileStage(id, cells, {limit, light = 0, tides = [], rope = 0, name = 'first'} = {}) {
  const width = cells.length;
  if (!cells.every(line => line.length === width)) throw new Error('Non-square rescue board');
  const positions = m => tilesOf(cells, m, width);
  const gates = positions('DG').map(tile => ({tile, plates: positions(cells[Math.floor(tile / width)][tile % width] === 'D' ? 'P' : 'PQ')}));
  const stage = {
    id, width, name, limit, light, rope, cells, start: [positions('N')[0], positions('T')[0]],
    home: positions('H')[0], targets: positions('c'), imprint: positions('i')[0] ?? -1,
    tiles: new Set(positions('.NTHcispPQRWDG')), gaps: new Set(positions('-')),
    phaseTiles: new Set(positions('~')), shelters: new Set(positions('s')),
    relay: new Set(positions('R')), warm: positions('W'), gates,
    tides: tides.map(line => line.filter(tile => positions('.NTHcispPQRWDG').includes(tile)))
  };
  if (!stage.targets.length || !stage.start.every(v => stage.tiles.has(v)) || !stage.tiles.has(stage.home)
      || gates.some(g => !g.plates.length)) throw new Error('Invalid rescue stage ' + id);
  return stage;
}
export const STAGES = [
  compileStage(1, [
    '######',
    '#..###',
    '#N.H##',
    '#.Tc##',
    '##..##',
    '######'
  ], {limit: 13})
];
