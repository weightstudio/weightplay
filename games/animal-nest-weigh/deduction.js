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
  // Look ahead using only revealed order. Never receive actual material weights.
  function suggest(count, clues, target) {
    const current = analyze(count, clues, target);
    if (current.proven !== null) return null;
    let best = null;
    let bestScore = -Infinity;
    for (let a = 0; a < count; a += 1) for (let b = a + 1; b < count; b += 1) {
      if (current.below[a][b] || current.below[b][a]) continue;
      const outcomes = [[a, b], [b, a]].map(([lighter, heavier]) => {
        const next = analyze(count, [...clues, { lighter, heavier }], target);
        return { remaining: next.candidates.length, known: next.below.flat().filter(Boolean).length };
      });
      const score = -Math.max(...outcomes.map(o => o.remaining)) * 100
        - outcomes.reduce((n, o) => n + o.remaining, 0) * 10
        + Math.min(...outcomes.map(o => o.known));
      if (score > bestScore) { bestScore = score; best = [a, b]; }
    }
    return best;
  }
  const api = { rankFor, analyze, suggest };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else window.NestWeighDeduction = api;
})();
