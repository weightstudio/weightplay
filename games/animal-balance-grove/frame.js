/* One shared frame owns Main, Stage, Battle, preferences, and their controls. */
(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const frame = window.WeightPlayScreenFrame.mount({
    root: $("gameFrame"),
    localeSelect: $("localeSelect"),
    playUI: true,
    scenes: {
      main: {
        root: $("mainScreen"),
        header: $("mainHeader"),
        content: $("mainContent"),
      },
      stage: {
        root: $("stageScreen"),
        header: $("stageHeader"),
        content: $("stageContent"),
        headerInfo: $("stageInfo"),
      },
      battle: {
        root: $("battleScreen"),
        header: $("battleHeader"),
        content: $("battleContent"),
        headerInfo: $("battleInfo"),
      },
    },
  });

  const stageGroup = window.WeightPlayScreenFrame.createGroup();
  stageGroup.add($("stageSummary"));
  frame.stageTopUI.add(stageGroup);

  const battleGroup = window.WeightPlayScreenFrame.createGroup();
  battleGroup.add($("roundLabel")).add($("battleChecks"));
  frame.battleTopUI.add(battleGroup);

  const stageTab = document.createElement("button");
  stageTab.type = "button";
  stageTab.dataset.wpFrameAction = "tab";
  stageTab.dataset.copy = "stages";
  stageTab.setAttribute("aria-current", "page");
  stageTab.textContent = "Choose a grove";
  frame.commonDownButton.add(stageTab);

  frame.activate("main");
  window.BalanceGroveScreenFrame = frame;
  window.BalanceGroveStageTab = stageTab;
  window.addEventListener("pagehide", event => {
    if (!event.persisted) frame.destroy();
  }, { once: true });
})();
