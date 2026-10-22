/* Localized trail records for the shared Interface 9 Stage selector. */
(() => {
  "use strict";

  const CHAPTER_RULES = ["ruleSame", "ruleNext", "rulePrevious", "ruleEcho", "ruleWeather", "ruleMastery"];

  window.createAnimalLanternGuidesStageConfig = ({ stages, getProgress, text }) => ({
    count: stages.length,
    poster: "/assets/interface7-redrawn/animal-lantern-guides.webp",
    background: "/assets/lobby-block-atmosphere.svg",
    stage(index) {
      const stage = stages[index];
      const progress = getProgress();
      const chapter = text(`chapter${stage.chapter + 1}`);
      const locked = stage.number > progress.unlocked;
      const cleared = stage.number <= progress.best;
      const rule = text(CHAPTER_RULES[stage.chapter]);
      const hint = stage.checkpoint
        ? text("checkpointHint")
        : text("sceneHint", { chapter });
      return {
        id: stage.number,
        kicker: chapter,
        title: String(stage.number),
        subtitle: text(stage.checkpoint ? "checkpointName" : "stageName", { n: stage.number }),
        status: locked ? text("locked") : text(stage.checkpoint ? "checkpoint" : "trail"),
        summary: rule,
        details: [rule, hint],
        locked,
        cleared,
        posterPosition: "50% 50%",
      };
    },
  });
})();
