/* Cairn Courier content for the shared Interface 9 Stage selector. */
(() => {
  "use strict";

  const POSTER = "/assets/interface7-redrawn/animal-cairn-courier.webp";
  const BACKGROUND = "/assets/lobby-block-atmosphere.svg";

  window.AnimalCairnCourierStageConfig = function createCairnStageConfig({
    stages,
    solved,
    stageText,
    ruleText,
    statusFor,
    text,
  }) {
    return {
      gameId: "animal-cairn-courier",
      poster: POSTER,
      background: BACKGROUND,
      count: stages.length,
      stage(index) {
        const plan = stages[index];
        if (!plan) throw new RangeError("CAIRN_STAGE_INDEX_OUT_OF_RANGE");
        const cleared = solved.has(plan.id);
        const locked = index > 0 && !solved.has(stages[index - 1].id);
        const rule = ruleText(plan);
        const checkpoint = plan.checkpoint ? text("checkpoint") : "";
        return {
          id: plan.id,
          kicker: stageText(plan, "arc"),
          title: stageText(plan, "title"),
          subtitle: text("roundV7", { n: plan.id, total: stages.length }),
          status: statusFor(plan, index),
          summary: rule,
          details: [rule, checkpoint].filter(Boolean),
          locked,
          cleared,
          poster: POSTER,
          posterPosition: "center",
        };
      },
    };
  };
})();
