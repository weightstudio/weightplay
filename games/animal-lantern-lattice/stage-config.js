(() => {
  "use strict";

  window.createAnimalLanternLatticeStageConfig = function createAnimalLanternLatticeStageConfig({
    paths, getProgress, getStageBests, text, stars, rule, poster, background,
  }) {
    if (!Array.isArray(paths) || paths.length !== 30
      || [getProgress, getStageBests, text, stars, rule].some((value) => typeof value !== "function")
      || typeof poster !== "string" || typeof background !== "string") {
      throw new TypeError("LANTERN_LATTICE_STAGE_CONFIG_REQUIRED");
    }

    return Object.freeze({
      gameId: "animal-lantern-lattice",
      count: paths.length,
      poster,
      background,
      stage(index) {
        const id = index + 1;
        const item = paths[index];
        const progress = getProgress();
        const bests = getStageBests();
        const unlocked = id <= progress.highestUnlocked;
        const bestChecks = Number(bests[String(id)]) || 0;
        return {
          id,
          kicker: text("stageRound", { n: id, total: paths.length }),
          title: text(item.titleKey),
          subtitle: [text(item.arcKey), item.checkpoint ? text("checkpoint") : ""].filter(Boolean).join(" · "),
          status: !unlocked
            ? text("locked")
            : bestChecks
              ? text("stageBest", { count: bestChecks, stars: stars(Math.max(1, Math.min(3, 4 - bestChecks))) })
              : text("noBest"),
          summary: text("stageLength", { count: item.target.length }),
          details: [rule(item)],
          locked: !unlocked,
          cleared: progress.cleared.includes(id),
          poster,
        };
      },
    });
  };
})();
