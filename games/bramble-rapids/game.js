(() => {
  "use strict";
  const hasStage = document.body.dataset.hasStage === "true";
  const roots = { main: document.querySelector("#mainGroup"), stage: document.querySelector("#stageScreen"), battle: document.querySelector("#battleScreen") };
  const frame = window.WeightPlayScreenFrame.mountSlots({
    root: document.querySelector("#gameFrame"),
    main: roots.main,
    stage: roots.stage,
    battle: roots.battle,
  });
  function show(screen) {
    Object.entries(roots).forEach(([name, root]) => { if (root) { root.hidden = name !== screen; root.inert = name !== screen; } });
    document.body.dataset.screen = screen;
    frame.activate(screen);
  }
  document.querySelector("#startBtn").addEventListener("click", () => show(hasStage ? "stage" : "battle"));
  document.querySelector("#stageBackBtn")?.addEventListener("click", () => show("main"));
  document.querySelector("#stageRail")?.addEventListener("click", (event) => { if (event.target.closest("[data-wp-stage-card]")) show("battle"); });
  document.querySelector("#battleBackBtn").addEventListener("click", () => show(hasStage ? "stage" : "main"));
  document.querySelector("#gameActionBtn").addEventListener("click", () => { document.querySelector("#battleFeedback").textContent = "Replace this probe with game-owned feedback."; });
  show("main");
})();
