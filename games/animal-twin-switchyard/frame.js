/* Twin's adapter supplies game content to the shared I9 frame. */
(() => {
  "use strict";

  const root = document.getElementById("gameFrame");
  const main = document.getElementById("mainScreen");
  const stage = document.getElementById("stageScreen");
  const battle = document.getElementById("battleScreen");
  const mainHeader = main.querySelector(".topbar");
  const stageHeader = stage.querySelector(".stage-header");
  const battleHeader = battle.querySelector(".battle-head, .battle-header");
  const localeControl = mainHeader.querySelector(".locale");
  const localeSelect = document.getElementById("localeSelect");

  localeControl.hidden = true;
  localeControl.style.setProperty("display", "none", "important");
  const localeSource = document.createElement("div");
  localeSource.hidden = true;
  localeSource.style.setProperty("display", "none", "important");
  localeSource.append(localeControl);
  root.append(localeSource);

  const mainBack = mainHeader.querySelector('[data-wp-return="main"]');
  const mainTitle = mainHeader.querySelector("[data-wp-frame-title]");
  mainHeader.replaceChildren(mainBack, mainTitle);

  const stageBack = stageHeader.querySelector('[data-wp-return="stage"]');
  const stageFrameTitle = stageHeader.querySelector("#stageFrameTitle");
  const stageTitle = stageHeader.querySelector("#stageTitle");
  const stageProgress = stageHeader.querySelector("#stageProgress");
  stageHeader.replaceChildren(stageBack, stageFrameTitle);

  const battleBack = battleHeader.querySelector('[data-wp-return="battle"]');
  const battleFrameTitle = battleHeader.querySelector("#battleFrameTitle");
  const battleInfo = battleHeader.querySelector(".hud");
  battleHeader.replaceChildren(battleBack, battleFrameTitle);

  const frame = window.WeightPlayScreenFrame.mount({
    root,
    localeSelect,
    playUI: true,
    scenes: {
      main: { root: main, header: mainHeader, content: main.querySelector(".main-grid") },
      stage: { root: stage, header: stageHeader, content: document.getElementById("stageWorkspace") },
      battle: { root: battle, header: battleHeader, content: battle.querySelector(".battle-content") },
    },
  });

  const stageGroup = window.WeightPlayScreenFrame.createGroup();
  stageGroup.add(stageTitle).add(stageProgress);
  frame.stageTopUI.add(stageGroup);

  const battleGroup = window.WeightPlayScreenFrame.createGroup();
  for (const node of [...battleInfo.children]) battleGroup.add(node);
  battleInfo.remove();
  frame.battleTopUI.add(battleGroup);

  const stageButton = document.getElementById("stageTab");
  stageButton.dataset.wpFrameAction = "tab";
  stageButton.setAttribute("aria-pressed", "true");
  frame.commonDownButton.clear().add(stageButton);

  frame.activate("main");
  window.TwinSwitchyardFrame = Object.freeze({ frame, stageTitle, stageProgress });
  window.addEventListener("pagehide", (event) => {
    if (!event.persisted) frame.destroy();
  });
})();
