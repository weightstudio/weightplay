/* Rank knowledge is derived exclusively from revealed comparisons. */
(() => {
  "use strict";
  const rankFor = (count, target) => target === "heaviest" ? count - 1
    : target === "secondHeaviest" ? count - 2 : target === "secondLightest" ? 1
    : target === "middle" ? Math.floor(count / 2) : 0;
  function analyze(count, clues, target) {
    const below = Array.from({ length: count }, () => Array(count).fill(false));
    for (const { lighter, heavier } of clues) below[lighter][heavier] = true;
    for (let k = 0; k < count; k += 1)
      for (let i = 0; i < count; i += 1)
        for (let j = 0; j < count; j += 1)
          below[i][j] ||= below[i][k] && below[k][j];
    const rank = rankFor(count, target);
    const bounds = below.map((row, i) => ({
      min: below.reduce((n, other) => n + Number(other[i]), 0),
      max: count - 1 - row.filter(Boolean).length,
    }));
    const candidates = bounds.flatMap(({ min, max }, i) => min <= rank && rank <= max ? [i] : []);
    return { below, bounds, candidates, proven: candidates.length === 1 ? candidates[0] : null };
  }
  const api = { rankFor, analyze };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else window.NestWeighDeduction = api;
})();
