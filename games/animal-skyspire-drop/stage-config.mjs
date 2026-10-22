const POSTER = "/assets/animal-skyspire-drop/cover.webp";
const BACKGROUND = "/assets/lobby-block-atmosphere.svg";

export function createSkyspireDropStageConfig({ stages, getSave, text }) {
  if (!Array.isArray(stages) || typeof getSave !== "function" || typeof text !== "function") {
    throw new TypeError("SKYSPIRE_DROP_STAGE_CONFIG_REQUIRED");
  }

  return Object.freeze({
    gameId: "animal-skyspire-drop",
    count: stages.length,
    poster: POSTER,
    background: BACKGROUND,
    stage(index) {
      const stage = stages[index];
      if (!stage) throw new RangeError(`SKYSPIRE_DROP_STAGE_INDEX:${index}`);

      const save = getSave();
      const stars = Number(save.stars[index] || 0);
      const locked = index + 1 > save.unlocked;

      return {
        id: index + 1,
        kicker: text("chapter", { n: stage.chapter + 1 }),
        title: text("stage", { n: index + 1 }),
        subtitle: text("ringCount", { n: stage.ringCount }),
        status: locked ? text("locked") : stars ? `${"★".repeat(stars)} ${text("cleared")}` : text("stageReady"),
        summary: stage.rule,
        details: [text("ringCount", { n: stage.ringCount }), stage.rule],
        locked,
        cleared: stars > 0,
        poster: POSTER,
        posterPosition: "center 62%",
      };
    },
  });
}
