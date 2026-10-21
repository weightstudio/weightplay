(() => {
  const base = document.currentScript.src;
  const addStyle = (name) => {
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = new URL(name, base).href;
    document.head.append(style);
  };
  addStyle("royal-board.css?v=20260909-checkers-feedback-v21");
  addStyle("game-owned-presentation.css?v=20261021-checkers-v22-i9");

  window.WPPopularArcade?.mount("checkers");

  document.querySelectorAll("#eyebrow, #gameTagline, #objective, #mainInstruction").forEach((node) => node.remove());
  const result = document.querySelector("#resultScreen");
  if (result) result.dataset.wpBattleSubstate = "result";

  const frame = window.WeightPlayScreenFrame.mountSlots({
    root: document.querySelector("#popularArcade"),
    main: document.querySelector("#mainScreen"),
    battle: {
      root: document.querySelector("#battleScreen"),
      headerInfo: document.querySelector("#checkersBattleInfo"),
    },
  });
  const frameSceneObserver = new MutationObserver(() => frame.sync());
  frameSceneObserver.observe(document.body, { attributes: true, attributeFilter: ["data-screen"] });
  frame.sync();

  window.addEventListener("pagehide", (event) => {
    if (!event.persisted) {
      frameSceneObserver.disconnect();
      frame.destroy();
    }
  });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) frame.sync();
  });

  import(new URL("board-effects.mjs?v=20260909-checkers-feedback-v21", base).href)
    .then(({ installBoardEffects }) => installBoardEffects(document.getElementById("board")))
    .catch((error) => console.warn("Checkers cosmetic feedback unavailable", error));
})();
