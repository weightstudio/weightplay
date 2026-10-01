((root) => {
  "use strict";
  function rating(holds, target, assists) {
    return 1 + Number(holds <= target) + Number(assists === 0);
  }
  function readBest(raw) {
    try {
      const data = JSON.parse(raw || "[]");
      if (!Array.isArray(data)) return [];
      return data.slice(0, 30).map((entry) => entry && Number.isInteger(entry.stars)
        && entry.stars >= 1 && entry.stars <= 3 && Number.isInteger(entry.holds) && entry.holds >= 0
        ? { stars: entry.stars, holds: entry.holds } : null);
    } catch { return []; }
  }
  function keepBest(previous, next) {
    return !previous || next.stars > previous.stars
      || (next.stars === previous.stars && next.holds < previous.holds) ? next : previous;
  }
  root.BUS_JAM_MASTERY = { rating, readBest, keepBest };
  if (typeof module !== "undefined") module.exports = root.BUS_JAM_MASTERY;
})(typeof window !== "undefined" ? window : globalThis);
