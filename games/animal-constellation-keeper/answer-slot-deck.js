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
      if (correctIndex < 0) {
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

  return { makeBalancedAnswerSlotDeck, assignBalancedAnswerSlots };
});
