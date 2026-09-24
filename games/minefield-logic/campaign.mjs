/* Authored, replay-stable Minefield campaign layouts. Indices are row-major on 9×9. */
const authored = [
  ["First Lantern / Board 01", [11, 23, 34, 51]],
  ["First Lantern / Board 02", [13, 28, 35, 60]],
  ["First Lantern / Board 03", [15, 41, 47, 65, 73]],
  ["First Lantern / Board 04", [5, 7, 33, 46, 62]],
  ["First Lantern checkpoint / Board 05", [21, 35, 37, 41, 48, 72]],
  ["Sky Ridge / Board 06", [14, 25, 50, 53, 69]],
  ["Sky Ridge / Board 07", [3, 31, 37, 49, 59, 71]],
  ["Sky Ridge / Board 08", [28, 39, 40, 61, 74, 80]],
  ["Sky Ridge / Board 09", [25, 48, 52, 60, 68, 75, 79]],
  ["Sky Ridge checkpoint / Board 10", [14, 25, 42, 49, 50, 62, 71, 79]],
  ["Mirror Basin / Board 11", [15, 19, 31, 44, 56]],
  ["Mirror Basin / Board 12", [6, 24, 48, 49, 63, 71]],
  ["Mirror Basin / Board 13", [18, 28, 39, 41, 56, 65, 69]],
  ["Mirror Basin / Board 14", [3, 6, 12, 14, 17, 31, 59, 75]],
  ["Mirror Basin checkpoint / Board 15", [4, 11, 14, 20, 35, 47, 48, 56, 69]],
  ["Star Bridge / Board 16", [27, 29, 33, 41, 59, 61, 73]],
  ["Star Bridge / Board 17", [5, 6, 32, 35, 41, 56, 71, 78]],
  ["Star Bridge / Board 18", [5, 15, 34, 43, 68, 72, 74, 79]],
  ["Star Bridge / Board 19", [14, 17, 32, 38, 39, 44, 52, 59, 75]],
  ["Star Bridge checkpoint / Board 20", [5, 18, 19, 30, 35, 40, 42, 44, 59, 61]],
  ["Lantern Moat / Board 21", [3, 12, 30, 33, 48, 51, 64, 68]],
  ["Lantern Moat / Board 22", [18, 26, 30, 47, 53, 54, 58, 61, 70]],
  ["Lantern Moat / Board 23", [4, 11, 16, 17, 29, 35, 57, 63, 69, 74]],
  ["Lantern Moat / Board 24", [13, 20, 40, 41, 44, 45, 49, 56, 64, 67]],
  ["Lantern Moat checkpoint / Board 25", [2, 7, 17, 27, 33, 34, 40, 45, 74, 75, 80]],
  ["Observatory / Board 26", [5, 12, 23, 29, 35, 56, 62, 63, 74, 78]],
  ["Observatory / Board 27", [3, 25, 30, 31, 56, 63, 68, 69, 72, 77, 80]],
  ["Observatory / Board 28", [2, 7, 8, 15, 25, 32, 42, 45, 50, 58, 67]],
  ["Observatory / Board 29", [8, 11, 12, 24, 29, 36, 57, 60, 61, 63, 69, 79]],
  ["Observatory finale / Orla's Star Map", [8, 11, 14, 21, 22, 24, 26, 40, 47, 49, 73, 74, 77]],
];

const safeOpening = 0;
const openingNeighbours = new Set([1, 9, 10]);
const signatures = new Set();

export const CAMPAIGN_STAGES = Object.freeze(authored.map(([focus, mineIndices], index) => {
  const id = index + 1;
  const mines = Object.freeze([...mineIndices]);
  const signature = mines.join(",");
  if (mines.some(i => !Number.isInteger(i) || i < 0 || i >= 81 || i === safeOpening || openingNeighbours.has(i))) {
    throw new Error(`Invalid safe opening in authored Minefield Stage ${id}`);
  }
  if (new Set(mines).size !== mines.length || signatures.has(signature)) {
    throw new Error(`Duplicate mine data in authored Minefield Stage ${id}`);
  }
  signatures.add(signature);
  return Object.freeze({
    id,
    arc: Math.ceil(id / 5),
    focus,
    checkpoint: id % 5 === 0,
    start: safeOpening,
    mines,
  });
}));

if (CAMPAIGN_STAGES.length !== 30 || CAMPAIGN_STAGES.some((stage, i) => stage.id !== i + 1)) {
  throw new Error("Minefield campaign must remain exactly 30 stable, contiguous stages");
}
