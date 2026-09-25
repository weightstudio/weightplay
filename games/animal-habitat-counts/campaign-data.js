(function (root) {
  "use strict";
  const patterns = [
    "100/010/001", "110/001/000", "101/010/001", "110/010/001", "101/011/100",
    "1100/0110/0011/0000", "1010/0101/1010/0000", "1110/0011/1000/0100", "1101/0010/1100/0001", "1011/0110/1000/0101",
    "1100/0110/0011/1000", "1010/0110/0001/1100", "1101/0100/1010/0011", "0111/1000/0101/0010", "1011/0110/1001/0100",
    "11000/01100/00110/00011/00001", "11100/01100/00110/00011/00011", "11000/01100/00110/00111/00010", "10100/11100/01110/00011/00001", "01110/11100/00110/00011/00001",
    "11100/00110/01110/00011/00001", "11000/01100/00111/00011/00001", "00110/01110/11100/00110/00011", "01110/01010/01100/01010/01110", "00111/00010/01110/00100/00111",
    "11100/01110/00110/00111/00001", "11000/01110/00111/00011/00001", "00110/01110/01110/00111/00011", "01110/11100/00110/00011/00111", "11100/01110/00111/00011/00001",
  ];
  const zoneCounts = [0,0,0,1,2, 1,1,2,2,4, 2,2,2,2,3, 2,2,2,2,4, 2,2,2,2,2, 2,2,3,4,5];
  const fog = { 6:[0],7:[0],8:[1],9:[1],10:[0,2],11:[1],12:[0],13:[1],14:[0],15:[2],16:[0],17:[1],18:[0],19:[1],20:[0,2],21:[0],22:[1],23:[0],24:[1],25:[0,1],26:[1],27:[0],28:[2],29:[0,2],30:[1,3] };
  const stones = { 11:[3,7],12:[3,8],13:[6,9],14:[5,15],15:[1,4,9],18:[4,20],19:[3,14],21:[4,15],22:[2,10],23:[0,4],24:[0,4],25:[0,1],26:[4,15],27:[2,10],28:[0,1,20],29:[0,4,11],30:[3,4,10] };
  const trails = {
    16:[0,12,24],17:[0,7,24],18:[0,12,18],19:[0,12,24],20:[1,12,24],
    21:[0,12,24],22:[0,12,24],23:[2,12,24],24:[2,22],25:[2,12,24],
    26:[0,12,24],27:[0,12,24],28:[2,12,24],29:[1,12,24],30:[0,12,24],
  };
  const branches = { 24:[6,8],25:[3,22],30:[6,14] };
  const zonePicks = { 24:[2,3] };
  const zonesBySize = {
    3:[[0,1,3,4],[4,5,7,8]],
    4:[[0,1,4,5],[2,3,6,7],[8,9,12,13],[10,11,14,15]],
    5:[[0,1,5,6],[3,4,8,9],[15,16,20,21],[18,19,23,24],[2,7,12,17,22]],
  };
  const arcKeys = ["meadow","pond","hollow","crossing","marsh","council"];
  const stages = patterns.map((pattern, index) => {
    const number = index + 1;
    const rows = pattern.split("/").map((row) => row.split("").map(Number));
    const size = rows.length;
    const solution = rows.flat();
    const columns = Array.from({length:size}, (_, col) => rows.reduce((sum, row) => sum + row[col], 0));
    const selectedZones = zonePicks[number] || zonesBySize[size].map((_, zoneIndex) => zoneIndex).slice(0, zoneCounts[index]);
    const zones = selectedZones.map((sourceIndex, zoneIndex) => {
      const cells = zonesBySize[size][sourceIndex];
      return {
        id: zoneIndex,
        cells,
        count: cells.reduce((sum, cell) => sum + solution[cell], 0),
        hidden: (fog[number] || []).includes(zoneIndex),
      };
    });
    const checkpoint = number % 5 === 0;
    return {
      id: `habitat-${String(number).padStart(2, "0")}`,
      number,
      arc: arcKeys[Math.floor(index / 5)],
      size,
      solution,
      rows: rows.map((row) => row.reduce((sum, cell) => sum + cell, 0)),
      columns,
      zones,
      stones: stones[number] || [],
      trail: trails[number] || [],
      branch: branches[number] || [],
      checkpoint,
      lensReward: checkpoint ? (number === 5 ? 2 : 1) : 0,
    };
  });

  function evaluateBoard(stage, cells) {
    const size = stage.size;
    const board = Array.isArray(cells) ? cells.map(Boolean) : [];
    const rows = Array.from({length:size}, (_, row) => board.slice(row * size, (row + 1) * size).reduce((sum, cell) => sum + Number(cell), 0));
    const columns = Array.from({length:size}, (_, col) => board.reduce((sum, cell, index) => sum + (index % size === col ? Number(cell) : 0), 0));
    const rowMismatch = stage.rows.map((count, index) => board.length !== size * size || rows[index] !== count);
    const columnMismatch = stage.columns.map((count, index) => board.length !== size * size || columns[index] !== count);
    const zoneMismatch = stage.zones.map((zone) => zone.cells.reduce((sum, cell) => sum + Number(board[cell]), 0) !== zone.count);
    const blockedMismatch = stage.stones.map((cell) => Boolean(board[cell]));
    let connected = true;
    if (stage.trail.length) {
      const reached = new Set();
      const queue = [stage.trail[0]];
      while (queue.length) {
        const cell = queue.shift();
        if (reached.has(cell) || !board[cell]) continue;
        reached.add(cell);
        const row = Math.floor(cell / size), col = cell % size;
        [[row-1,col],[row+1,col],[row,col-1],[row,col+1]].forEach(([r,c]) => {
          if (r >= 0 && r < size && c >= 0 && c < size) queue.push(r * size + c);
        });
      }
      connected = stage.trail.every((cell) => reached.has(cell)) && (!stage.branch.length || stage.branch.some((cell) => reached.has(cell)));
    }
    return {
      correct: !rowMismatch.some(Boolean) && !columnMismatch.some(Boolean) && !zoneMismatch.some(Boolean) && !blockedMismatch.some(Boolean) && connected,
      rows, columns, rowMismatch, columnMismatch, zoneMismatch, blockedMismatch, connected,
    };
  }

  root.ANIMAL_HABITAT_COUNTS_CAMPAIGN = { stages, evaluateBoard, version: 12 };
})(window);
