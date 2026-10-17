(function installAnswerSlotDeck(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.AnimalConstellationKeeperAnswerSlots = api;
})(typeof window !== "undefined" ? window : globalThis, function createAnswerSlotDeckApi() {
  "use strict";

  const randomUnit = () => {
    const cryptoApi = typeof globalThis !== "undefined" ? globalThis.crypto : null;
    if (cryptoApi && typeof cryptoApi.getRandomValues === "function") {
      try {
        const value = new Uint32Array(1);
        cryptoApi.getRandomValues(value);
        return value[0] / 0x100000000;
      } catch (_) {
        // A restricted browser context can still use the platform PRNG below.
      }
    }
    return Math.random();
  };

  const makeBalancedAnswerSlotDeck = (count, random = randomUnit) => {
    if (!Number.isInteger(count) || count < 0) {
      throw new RangeError("Map count must be a non-negative integer");
    }
    if (typeof random !== "function") {
      throw new TypeError("Random source must be a function");
    }

    const deck = Array.from({ length: count }, (_, index) => index % 3);
    for (let index = deck.length - 1; index > 0; index -= 1) {
      const sample = random();
      if (!Number.isFinite(sample) || sample < 0 || sample >= 1) {
        throw new RangeError("Random source must return a number in [0, 1)");
      }
      const swapIndex = Math.floor(sample * (index + 1));
      [deck[index], deck[swapIndex]] = [deck[swapIndex], deck[index]];
    }
    return deck;
  };

  const assignBalancedAnswerSlots = (maps, random = randomUnit) => {
    if (!Array.isArray(maps)) throw new TypeError("Maps must be an array");
    const deck = makeBalancedAnswerSlotDeck(maps.length, random);

    return maps.map((map, mapIndex) => {
      if (!map || !Array.isArray(map.options) || map.options.length !== 3) {
        throw new TypeError(`Map ${mapIndex + 1} must have exactly three options`);
      }
      const correctIndex = map.options.findIndex((option) => option?.id === map.correctId);
      if (correctIndex < 0 || new Set(map.options.map(option => option.id)).size !== 3) {
        throw new TypeError(`Map ${mapIndex + 1} must identify one correct option`);
      }

      const correctOption = map.options[correctIndex];
      const distractors = map.options.filter((_, index) => index !== correctIndex);
      let distractorIndex = 0;
      const options = Array.from({ length: 3 }, (_, slotIndex) => {
        const option = slotIndex === deck[mapIndex]
          ? correctOption
          : distractors[distractorIndex++];
        return { ...option, slot: slotIndex + 1 };
      });
      return { ...map, options };
    });
  };

  // All decisions, feedback and regression checks use the same spatial predicate.
  // "Directly" means the same axis, not merely somewhere to the left/above.
  const relationHolds = (stars, [subject, relation, object]) => {
    const a = stars.find(star => star.animal === subject);
    const b = stars.find(star => star.animal === object);
    if (!a || !b) return false;
    switch (relation) {
      case "left": return a.row === b.row && a.col < b.col;
      case "right": return a.row === b.row && a.col > b.col;
      case "above": return a.col === b.col && a.row < b.row;
      case "below": return a.col === b.col && a.row > b.row;
      case "upperLeft": return a.row < b.row && a.col < b.col;
      case "lowerRight": return a.row > b.row && a.col > b.col;
      default: return false;
    }
  };
  const assess = (map, option) => map.clues.map(clue => relationHolds(option.stars, clue));

  const refineMaps = (maps) => maps.map(map => {
    const source = map.options.find(option => option.id === map.correctId);
    const solution = source.stars.map(star => ({ ...star }));
    // Move the constellation across the lattice without changing its rules.
    const maxRow = Math.max(...solution.map(star => star.row));
    const maxCol = Math.max(...solution.map(star => star.col));
    const minRow = Math.min(...solution.map(star => star.row));
    const minCol = Math.min(...solution.map(star => star.col));
    const rowShift = (map.number % (3 - maxRow + minRow)) - minRow;
    const colShift = ((map.number + map.arc) % (3 - maxCol + minCol)) - minCol;
    solution.forEach(star => { star.row += rowShift; star.col += colShift; });
    const orders = [[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
    const alternatives = orders.map(order => solution.map((star, index) => ({ ...star, animal: solution[order[index]].animal })));
    const wrong = alternatives.filter(stars => !map.clues.every(clue => relationHolds(stars, clue)));
    const selected = [];
    // Prefer different single-rule failures, so both clues have a purpose.
    for (let clue = 0; clue < map.clues.length; clue += 1) {
      const candidate = wrong.find(stars => !selected.includes(stars) && map.clues.every((rule, index) => relationHolds(stars, rule) === (index !== clue)));
      if (candidate) selected.push(candidate);
    }
    for (const candidate of wrong) if (selected.length < 2 && !selected.includes(candidate)) selected.push(candidate);
    const options = [solution, ...selected.slice(0, 2)].map((stars, index) => ({ id: `stage-${map.number}-option-${index + 1}`, slot: index + 1, stars }));
    const refined = { ...map, correctId: options[0].id, options };
    if (options.filter(option => assess(refined, option).every(Boolean)).length !== 1) throw new Error(`Ambiguous map ${map.number}`);
    return refined;
  });

  return { makeBalancedAnswerSlotDeck, assignBalancedAnswerSlots, relationHolds, assess, refineMaps };
});
