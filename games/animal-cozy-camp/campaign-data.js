(function (root, factory) {
  "use strict";
  const campaign = factory();
  if (typeof module === "object" && module.exports) module.exports = campaign;
  if (root) root.ANIMAL_COZY_CAMP_CAMPAIGN = campaign;
})(typeof window === "undefined" ? globalThis : window, function () {
  "use strict";

  const STAGE_COUNT = 30;
  const PROGRESS_KEY = "weightplay-animal-cozy-camp-campaign-v1";
  const LEGACY_BEST_KEY = "weightplay-animal-cozy-camp-best-v2";
  const PATTERN_COUNT = 3;
  const ANCHORS = Object.freeze(["lantern", "quiet", "kettle"]);
  const authoredRounds = Object.freeze([
    Object.freeze({
      title: "roundOne",
      clues: Object.freeze(["r1c1", "r1c2"]),
      layouts: Object.freeze([
        Object.freeze(["orla", "moss", "taro", "pip"]),
        Object.freeze(["orla", "taro", "moss", "pip"]),
        Object.freeze(["orla", "moss", "pip", "taro"]),
      ]),
      solution: 0,
    }),
    Object.freeze({
      title: "roundTwo",
      clues: Object.freeze(["r2c1", "r2c2"]),
      layouts: Object.freeze([
        Object.freeze(["taro", "pip", "orla", "moss"]),
        Object.freeze(["taro", "orla", "pip", "moss"]),
        Object.freeze(["taro", "pip", "moss", "orla"]),
      ]),
      solution: 0,
    }),
    Object.freeze({
      title: "roundThree",
      clues: Object.freeze(["r3c1", "r3c2"]),
      layouts: Object.freeze([
        Object.freeze(["pip", "orla", "taro", "moss"]),
        Object.freeze(["moss", "pip", "taro", "orla"]),
        Object.freeze(["orla", "moss", "taro", "pip"]),
      ]),
      solution: 0,
    }),
  ]);

  const stageId = (number) => `cozy-circle-${String(number).padStart(2, "0")}`;
  const stages = Object.freeze(Array.from({ length: STAGE_COUNT }, (_, index) => {
    const number = index + 1;
    const patternIndex = index % PATTERN_COUNT;
    const rotation = Math.floor(index / PATTERN_COUNT) % 4;
    const anchor = ANCHORS[Math.floor(index / 12) % ANCHORS.length];
    return Object.freeze({
      id: stageId(number),
      number,
      patternIndex,
      rotation,
      anchor,
      contentKey: `${patternIndex}:${rotation}:${anchor}`,
    });
  }));

  const freshProgress = () => ({ schema: 1, completedIds: [], bestChecksByStage: {} });

  function normalizeProgress(value) {
    const rawCompleted = Array.isArray(value?.completedIds) ? value.completedIds : [];
    const validIds = new Set(rawCompleted.filter((id) => stages.some((stage) => stage.id === id)));
    const completedIds = [];
    for (const stage of stages) {
      if (!validIds.has(stage.id)) break;
      completedIds.push(stage.id);
    }

    const bestChecksByStage = {};
    if (value?.bestChecksByStage && typeof value.bestChecksByStage === "object") {
      for (const stage of stages) {
        const score = Number(value.bestChecksByStage[stage.id]);
        if (Number.isSafeInteger(score) && score > 0) bestChecksByStage[stage.id] = score;
      }
    }
    return { schema: 1, completedIds, bestChecksByStage };
  }

  function loadProgress(storage) {
    try {
      const raw = storage?.getItem(PROGRESS_KEY);
      return raw ? normalizeProgress(JSON.parse(raw)) : freshProgress();
    } catch (_) {
      return freshProgress();
    }
  }

  function saveProgress(storage, progress) {
    try {
      storage?.setItem(PROGRESS_KEY, JSON.stringify(normalizeProgress(progress)));
      return Boolean(storage);
    } catch (_) {
      return false;
    }
  }

  function unlockedThrough(progress) {
    return Math.min(STAGE_COUNT, normalizeProgress(progress).completedIds.length + 1);
  }

  function isUnlocked(progress, zeroBasedIndex) {
    const index = Number(zeroBasedIndex);
    return Number.isInteger(index) && index >= 0 && index < unlockedThrough(progress);
  }

  function highestUnlockedIndex(progress) {
    return unlockedThrough(progress) - 1;
  }

  function completeStage(progress, id, checks) {
    const next = normalizeProgress(progress);
    const stageIndex = stages.findIndex((stage) => stage.id === id);
    if (stageIndex < 0 || !isUnlocked(next, stageIndex)) return next;

    if (!next.completedIds.includes(id)) next.completedIds.push(id);
    next.completedIds.sort((left, right) =>
      stages.findIndex((stage) => stage.id === left) - stages.findIndex((stage) => stage.id === right),
    );
    const score = Number(checks);
    if (Number.isSafeInteger(score) && score > 0) {
      const previous = next.bestChecksByStage[id];
      if (!previous || score < previous) next.bestChecksByStage[id] = score;
    }
    return normalizeProgress(next);
  }

  return Object.freeze({
    STAGE_COUNT,
    PROGRESS_KEY,
    LEGACY_BEST_KEY,
    authoredRounds,
    stages,
    freshProgress,
    normalizeProgress,
    loadProgress,
    saveProgress,
    unlockedThrough,
    isUnlocked,
    highestUnlockedIndex,
    completeStage,
  });
});
