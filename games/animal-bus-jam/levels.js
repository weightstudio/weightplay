((root) => {
  "use strict";

  const COLOR_COUNT = 4;
  const chapterConfig = [
    { colors: 3, queues: 3, bay: 2, buses: 4, seats: 2 },
    { colors: 3, queues: 4, bay: 2, buses: 4, seats: 2 },
    { colors: 4, queues: 4, bay: 3, buses: 4, seats: 2 },
    { colors: 4, queues: 4, bay: 2, buses: 5, seats: 2 },
    { colors: 4, queues: 5, bay: 3, buses: 6, seats: 2 },
    { colors: 4, queues: 5, bay: 2, buses: 6, seats: 3 },
  ];
  // Hand-picked bus orders and queue layouts introduce required wrong-color
  // holds instead of merely increasing the number of passengers.
  const layoutSalts = [
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    2, 7, 19, 5, 6,
    71, 137, 24, 181, 192,
  ];
  const strategyLayouts = {
    10: { queues: [[3, 0], [1, 0], [3, 2], [1, 2]], solution: [0, 0, 1, 1, 2, 3, 2, 3] },
    11: { queues: [[2, 0], [3, 1], [0, 3], [1, 2]], solution: [3, 1, 1, 0, 3, 2, 2, 0] },
    12: { queues: [[1, 0], [2, 3], [1, 3], [2, 0]], solution: [0, 0, 3, 3, 2, 2, 1, 1] },
    13: { queues: [[2, 1], [2, 1], [3, 0], [3, 0]], solution: [0, 0, 1, 1, 2, 2, 3, 3] },
    14: { queues: [[3, 2], [2, 1], [0, 3], [0, 1]], solution: [1, 0, 0, 1, 3, 3, 2, 2] },
    15: { queues: [[2, 2, 1], [1, 3], [0, 3, 0], [0, 0]], solution: [2, 2, 1, 1, 2, 0, 0, 0, 3, 3] },
    16: { queues: [[2, 2], [3, 0, 2], [3, 1], [2, 0, 1]], solution: [3, 3, 1, 1, 0, 3, 2, 2, 0, 1] },
    17: { queues: [[0, 0, 2], [0, 3], [0, 1, 3], [2, 1]], solution: [3, 3, 2, 2, 0, 0, 0, 2, 1, 1] },
    18: { queues: [[1, 2, 1], [0, 2], [2, 3, 0], [2, 3]], solution: [2, 2, 3, 3, 1, 2, 0, 0, 0, 1] },
    19: { queues: [[1, 0], [0, 1, 1], [3, 1, 2], [2, 3]], solution: [1, 3, 0, 0, 1, 1, 2, 3, 2, 2] },
    20: { queues: [[0, 1], [3, 2], [3, 3], [0, 3, 2], [0, 0, 1]], solution: [1, 1, 3, 3, 3, 2, 0, 0, 4, 4, 4, 2] },
    21: { queues: [[2, 1], [2, 1, 1], [2, 3], [1, 0, 0], [2, 3]], solution: [2, 2, 4, 4, 3, 1, 1, 3, 3, 1, 0, 0] },
    22: { queues: [[3, 3], [2, 0, 2], [2, 0, 1], [0, 1], [0, 2]], solution: [2, 2, 2, 3, 3, 1, 0, 0, 1, 1, 4, 4] },
    23: { queues: [[1, 0], [1, 1, 0], [2, 3], [2, 3], [1, 3, 3]], solution: [0, 0, 1, 1, 1, 4, 4, 4, 2, 3, 2, 3] },
    24: { queues: [[3, 1, 3], [2, 3], [3, 2, 0], [1, 2], [2, 0]], solution: [2, 2, 2, 4, 4, 0, 0, 3, 0, 1, 1, 3] },
    25: { queues: [[0, 3, 2], [0, 2, 1], [2, 3, 1, 3], [2, 3, 1], [3, 0, 3]], solution: [0, 1, 4, 4, 0, 2, 2, 3, 2, 3, 3, 1, 1, 2, 4, 0] },
    26: { queues: [[0, 2, 0], [2, 0, 3], [2, 2, 3, 2], [3, 1, 3], [1, 2, 1]], solution: [0, 0, 0, 1, 1, 2, 1, 3, 3, 4, 4, 4, 2, 2, 2, 3] },
    27: { queues: [[2, 1, 2], [3, 3, 0], [1, 2, 1, 2], [0, 3, 2], [3, 0, 2]], solution: [2, 0, 0, 2, 2, 0, 1, 1, 1, 3, 4, 4, 2, 4, 3, 3] },
    28: { queues: [[0, 1, 0], [0, 2, 2, 3], [3, 1, 0], [0, 2, 0], [1, 2, 3]], solution: [4, 2, 2, 0, 0, 0, 1, 2, 1, 1, 1, 4, 4, 3, 3, 3] },
    29: { queues: [[3, 3, 1, 3], [1, 1, 0], [2, 0, 2], [3, 0, 0], [3, 3, 2]], solution: [1, 1, 0, 0, 0, 4, 1, 2, 2, 2, 4, 4, 0, 3, 3, 3] },
  };

  function rng(seed) {
    let value = seed >>> 0;
    return () => {
      value = (value * 1664525 + 1013904223) >>> 0;
      return value / 4294967296;
    };
  }

  function shuffled(values, roll) {
    const result = values.slice();
    for (let index = result.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(roll() * (index + 1));
      [result[index], result[swap]] = [result[swap], result[index]];
    }
    return result;
  }

  function makeBuses(index, config, roll) {
    const palette = shuffled(Array.from({ length: config.colors }, (_, color) => color), roll);
    const buses = [];
    for (let busIndex = 0; busIndex < config.buses; busIndex += 1) {
      const color = palette[(busIndex + Math.floor(busIndex / config.colors)) % palette.length];
      const seats = Math.max(2, config.seats - (index < 5 ? 0 : busIndex % 3 === 2 ? 1 : 0));
      buses.push({ color, seats });
    }
    return buses;
  }

  function build(index) {
    const chapter = Math.floor(index / 5);
    const config = chapterConfig[chapter];
    const roll = rng(
      0x71a5e31
      ^ Math.imul(index + 1, 2654435761)
      ^ Math.imul(layoutSalts[index] || 0, 2246822519),
    );
    const buses = makeBuses(index, config, roll);
    const dispatchOrder = buses.flatMap((bus) => Array(bus.seats).fill(bus.color));
    const queues = Array.from({ length: config.queues }, () => []);
    const solution = [];
    let previousQueue = -1;

    dispatchOrder.forEach((color, step) => {
      let queueIndex = Math.floor(roll() * queues.length);
      if (queues.length > 2 && step % 3 === 2 && queueIndex === previousQueue) {
        queueIndex = (queueIndex + 1 + Math.floor(roll() * (queues.length - 1))) % queues.length;
      }
      queues[queueIndex].push(color);
      solution.push(queueIndex);
      previousQueue = queueIndex;
    });

    // Every lane must carry information. Moving a leading item to an empty lane
    // preserves the recorded solution because that item is still exposed first.
    queues.forEach((queue, queueIndex) => {
      if (queue.length) return;
      const donor = queues
        .map((candidate, donorIndex) => ({ donorIndex, length: candidate.length }))
        .sort((a, b) => b.length - a.length)[0].donorIndex;
      const movedColor = queues[donor].shift();
      queues[queueIndex].push(movedColor);
      const solutionStep = solution.indexOf(donor);
      if (solutionStep >= 0) solution[solutionStep] = queueIndex;
    });

    const strategy = strategyLayouts[index];
    return {
      index,
      chapter,
      colors: config.colors,
      baySize: config.bay,
      buses,
      queues: strategy ? strategy.queues.map((queue) => queue.slice()) : queues,
      solution: strategy ? strategy.solution.slice() : solution,
      par: dispatchOrder.length,
    };
  }

  function settle(level, state) {
    while (state.busIndex < level.buses.length) {
      const bus = level.buses[state.busIndex];
      const waitingFrontMatches = state.waiting[0] === bus.color;
      if (waitingFrontMatches && state.busFilled < bus.seats) {
        state.waiting.shift();
        state.busFilled += 1;
        continue;
      }
      if (state.busFilled < bus.seats) break;
      state.busIndex += 1;
      state.busFilled = 0;
    }
    return state;
  }

  function step(level, sourceState, queueIndex) {
    const state = {
      queues: sourceState.queues.map((queue) => queue.slice()),
      waiting: sourceState.waiting.slice(),
      busIndex: sourceState.busIndex,
      busFilled: sourceState.busFilled,
    };
    settle(level, state);
    const queue = state.queues[queueIndex];
    const bus = level.buses[state.busIndex];
    if (!queue?.length || !bus) return null;
    const color = queue[0];
    if (color !== bus.color && state.waiting.length >= level.baySize) return null;
    queue.shift();
    if (color === bus.color) state.busFilled += 1;
    else state.waiting.push(color);
    settle(level, state);
    return state;
  }

  function isComplete(level, state) {
    settle(level, state);
    return state.busIndex >= level.buses.length
      && state.waiting.length === 0
      && state.queues.every((queue) => queue.length === 0);
  }

  function isDeadlocked(level, state) {
    settle(level, state);
    if (isComplete(level, state)) return false;
    const activeColor = level.buses[state.busIndex]?.color;
    const activePassengerExposed = state.queues.some((queue) => queue[0] === activeColor);
    const noQueuedPassengersRemain = state.queues.every((queue) => queue.length === 0);
    return !activePassengerExposed
      && (state.waiting.length >= level.baySize || noQueuedPassengersRemain);
  }

  const levels = Array.from({ length: 30 }, (_, index) => build(index));
  root.BUS_JAM_LEVELS = {
    colors: COLOR_COUNT,
    levels,
    build,
    settle,
    step,
    isComplete,
    isDeadlocked,
  };
  if (typeof module !== "undefined") module.exports = root.BUS_JAM_LEVELS;
})(typeof window !== "undefined" ? window : globalThis);
