const POSTER = "/games/animal-wildwood-raid/art/cover-v1.webp";

export function createWildwoodStageConfig({
  getSave,
  isPracticeAccessible,
  mission,
  objective,
  stageName,
  text,
}) {
  if ([getSave, isPracticeAccessible, mission, objective, stageName, text].some(value => typeof value !== "function")) {
    throw new TypeError("WILDWOOD_STAGE_CONFIG_REQUIRED");
  }

  return Object.freeze({
    gameId: "animal-wildwood-raid",
    count: 30,
    poster: POSTER,
    background: "/assets/lobby-block-atmosphere.svg",
    stage(index) {
      const id = index + 1;
      const currentMission = mission(id);
      const save = getSave();
      const accessiblePractice = isPracticeAccessible();
      const unlocked = id <= save.highestUnlocked;
      const cleared = Boolean(save.best[id]);
      return {
        id,
        kicker: `${text("stages")} ${id}`,
        title: stageName(currentMission),
        subtitle: objective(currentMission),
        status: text(cleared ? "cleared" : unlocked || accessiblePractice ? "ready" : "locked"),
        summary: objective(currentMission),
        details: [text("stageRule")],
        locked: !unlocked && !accessiblePractice,
        cleared,
        poster: POSTER,
      };
    },
  });
}
