/* Stage content only. Shared Play UI owns card geometry, poster framing, rail
   input, snapping, virtualization, and the common Block Arcade background. */
window.CatColorSudokuStageConfig = ({ save, text }) => ({
  gameId: "cat-color-sudoku",
  count: 30,
  poster: "/assets/cat-color-sudoku-cover-v1.png",
  background: "/assets/lobby-block-atmosphere.svg",
  stage(index) {
    const state = save();
    const chapter = Math.floor(index / 5);
    const locked = index >= state.unlocked;
    const cleared = Boolean(state.best[index + 1]);
    const rule = text("chapterRules")[chapter];
    return {
      id: index + 1,
      kicker: text("chapter", { n: chapter + 1 }),
      title: text("stage", { n: index + 1 }),
      subtitle: text("chapters")[chapter],
      status: locked ? text("locked") : cleared ? text("cleared") : text("ready"),
      summary: rule,
      details: [rule],
      poster: "/assets/cat-color-sudoku-cover-v1.png",
      posterPosition: "50% " + [48, 58, 43, 63, 52, 37][chapter] + "%",
      locked,
      cleared,
    };
  },
});
