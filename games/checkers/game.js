(() => {
  const base = document.currentScript.src;
  const addStyle = (name) => {
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = new URL(name, base).href;
    document.head.append(style);
  };
  addStyle("royal-board.css?v=20260909-checkers-feedback-v21");
  addStyle("interface-7-cleanup.css?v=20260926-checkers-interface7-source1");

  window.WPPopularArcade?.mount("checkers");

  document.querySelectorAll("#eyebrow, #gameTagline, #mainInstruction").forEach((node) => node.remove());
  const result = document.querySelector("#resultScreen");
  if (result) result.dataset.wpBattleSubstate = "result";

  window.WeightPlayScreenFrame?.autoMountDocument?.();

  import(new URL("board-effects.mjs?v=20260909-checkers-feedback-v21", base).href)
    .then(({ installBoardEffects }) => installBoardEffects(document.getElementById("board")))
    .catch((error) => console.warn("Checkers cosmetic feedback unavailable", error));
})();
