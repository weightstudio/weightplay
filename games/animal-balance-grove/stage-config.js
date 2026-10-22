/* Balance Grove provides content; the shared Play UI owns Stage geometry and input. */
window.BalanceGroveStageConfig = ({ stages, progress, unlocked, text, stageName, ruleText, poster }) => ({
  count: stages.length,
  poster: poster || "/games/animal-balance-grove/assets/animal-balance-grove-cover.png",
  background: "/assets/lobby-block-atmosphere.svg",
  stage(index) {
    const stage = stages[index];
    const locked = index > unlocked();
    const cleared = progress.cleared.includes(index);
    const stars = Math.max(0, Number(progress.stars[index]) || 0);
    const status = locked ? text("locked") : cleared ? "★".repeat(stars) : stage.checkpoint ? text("checkpoint") : text("stageReady");
    const summary = ruleText(stage);
    return {
      id: index + 1,
      kicker: text("round", { n: index + 1, total: stages.length }),
      title: String(index + 1),
      subtitle: stageName(index),
      status,
      summary,
      details: [summary, status],
      locked,
      cleared,
      posterPosition: "center",
    };
  },
});
