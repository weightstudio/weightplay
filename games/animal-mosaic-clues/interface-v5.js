(() => {
  "use strict";

  const body = document.body;
  const html = document.documentElement;
  const roots = Object.freeze({
    main: document.querySelector("#mainGroup"),
    stage: document.querySelector("#stageScreen"),
    battle: document.querySelector("#battleScreen"),
  });
  const returns = Object.freeze({
    main: roots.main?.querySelector('[data-wp-return="main"], .lobby-return'),
    stage: roots.stage?.querySelector('[data-wp-return="stage"]'),
    battle: roots.battle?.querySelector('[data-wp-return="battle"]'),
  });
  const mainFlow = {
    poster: document.querySelector("#poster"),
    start: document.querySelector("#start"),
    guide: document.querySelector(".game-page-info, .guide"),
  };
  if (Object.values(roots).some((node) => !node) || Object.values(returns).some((node) => !node) || Object.values(mainFlow).some((node) => !node)) return;

  const identities = new Map(Object.entries({ ...roots, poster: mainFlow.poster, start: mainFlow.start, ...Object.fromEntries(
    Object.entries(returns).map(([name, node]) => [`${name}Return`, node]),
  ) }));
  let generation = 0;
  let journeyStarted = false;

  const synchronize = () => {
    const scene = body.dataset.screen;
    if (!Object.hasOwn(roots, scene)) return;
    const liveGuide = document.querySelector(".game-page-info, .guide");
    if (!liveGuide) return;
    if (!journeyStarted) mainFlow.guide = liveGuide;
    else if (liveGuide !== mainFlow.guide) throw new Error("LIFE-RECREATED-ROOT:guide");
    if (scene !== "main" && !journeyStarted) {
      journeyStarted = true;
      identities.set("guide", mainFlow.guide);
    }
    const currentGeneration = ++generation;

    for (const [name, root] of Object.entries(roots)) {
      const active = name === scene;
      root.hidden = !active;
      root.setAttribute("aria-hidden", String(!active));
    }
    mainFlow.guide.hidden = scene !== "main";
    mainFlow.guide.setAttribute("aria-hidden", String(scene !== "main"));
    body.dataset.gameView = scene;
    html.dataset.gameView = scene;
    for (const name of Object.keys(roots)) {
      body.classList.toggle(`wp-shell-${name}-active`, name === scene);
      html.classList.toggle(`wp-shell-${name}-active`, name === scene);
    }
    body.classList.toggle("wp-stage-active", scene === "stage");
    html.classList.toggle("wp-stage-active", scene === "stage");
    body.classList.toggle("wp-stage-select-active", scene === "stage");
    html.classList.toggle("wp-stage-select-active", scene === "stage");

    window.dispatchEvent(new CustomEvent("weightplay:game-view-change", { detail: { view: scene } }));
    window.dispatchEvent(new CustomEvent("weightplay:battle-state", { detail: { active: scene === "battle" } }));
    window.dispatchEvent(new CustomEvent("weightplay:stage-state", { detail: { active: scene === "stage" } }));

    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (currentGeneration !== generation || body.dataset.screen !== scene) return;
      mainFlow.guide.hidden = scene !== "main";
      mainFlow.guide.setAttribute("aria-hidden", String(scene !== "main"));
      for (const [name, node] of identities) {
        if (!node.isConnected) throw new Error(`LIFE-RECREATED-ROOT:${name}`);
      }
      window.dispatchEvent(new CustomEvent("weightplay:scene-settled", {
        detail: { scene, generation: currentGeneration },
      }));
    }));
  };

  returns.main.dataset.wpReturn = "main";
  synchronize();
  new MutationObserver(synchronize).observe(body, {
    attributes: true,
    attributeFilter: ["data-screen"],
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest("#start, #stageBack, #battleBack, #leaveStage, #leaveContinue, #resultStage, #next, #retry, .stage-card")) return;
    synchronize();
  });
})();
