/* Route content adapter; I9 shared frame and Play UI own screen geometry. */
(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const root = $("gameFrame");
  const main = $("mainGroup");
  const stage = $("stageScreen");
  const battle = $("battleShell");
  const mainHeader = $("mainHeader");
  const stageHeader = stage.querySelector("header");
  const battleHeader = battle.querySelector("header");
  const abyssHud = $("abyssHud");

  const stageBack = stageHeader.querySelector('[data-wp-return="stage"]');
  const stageTitle = stageHeader.querySelector("[data-wp-frame-title]");
  stageHeader.replaceChildren(stageBack, stageTitle);

  const battleBack = battleHeader.querySelector('[data-wp-return="battle"]');
  const battleTitle = battleHeader.querySelector("[data-wp-frame-title]");
  battleHeader.replaceChildren(battleBack, battleTitle);

  const stageNav = $("stageTabs");
  stageNav.dataset.wpFrameNav = "";
  const routesButton = $("routesTab");
  routesButton.dataset.wpFrameAction = "tab";
  routesButton.setAttribute("aria-pressed", "true");
  routesButton.setAttribute("aria-current", "page");

  const stageProgress = document.createElement("span");
  stageProgress.id = "stageProgress";
  stageProgress.setAttribute("aria-live", "polite");

  const frame = window.WeightPlayScreenFrame.mount({
    root,
    localeSelect: $("localeSelect"),
    playUI: true,
    scenes: {
      main: { root: main, header: mainHeader, content: $("mainScreen") },
      stage: { root: stage, header: stageHeader, content: $("stageWorkspace") },
      battle: { root: battle, header: battleHeader, content: $("battleContent") },
    },
  });

  frame.stageTopUI.add(window.WeightPlayScreenFrame.createGroup().add(stageProgress));

  const battleGroup = window.WeightPlayScreenFrame.createGroup();
  for (const node of [...abyssHud.children]) battleGroup.add(node);
  abyssHud.remove();
  frame.battleTopUI.add(battleGroup);
  frame.commonDownButton.clear().add(routesButton);
  frame.activate("main");

  window.AnimalAbyssDiverFrame = frame;
  window.addEventListener("pagehide", (event) => {
    if (!event.persisted) frame.destroy();
  }, { once: true });
})();
