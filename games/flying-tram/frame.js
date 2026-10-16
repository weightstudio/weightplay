/* Game content adapter. The shared screen frame owns all I9 shell geometry. */
(() => {
  "use strict";
  window.mountFlyingTramFrame = () => {
    const root = document.getElementById("gameFrame");
    const main = document.getElementById("mainScreen");
    const stage = document.querySelector("#stageScreen .stage-canvas");
    const battle = document.querySelector("#battleScreen .battle-canvas");
    const mainHeader = main.querySelector("header");
    const stageHeader = stage.querySelector("header");
    const battleHeader = battle.querySelector("header");
    const guide = root.querySelector(".game-page-info");
    guide.id = "mainGuide";
    root.after(guide);
    const localeControl = mainHeader.querySelector(".locale-control");
    localeControl.hidden = true;
    root.append(localeControl);
    mainHeader.querySelector("[data-wp-game-title]").setAttribute("data-wp-frame-title", "");
    for (const [selector, slot] of Object.entries({".main-poster":"poster",".main-copy":"copy",".main-copy > p":"summary","#mainProgress":"progress"})) {
      main.querySelector(selector).setAttribute(`data-wp-frame-${slot}`, "");
    }
    main.querySelectorAll(".main-copy > small,.main-copy > h1").forEach(node => { node.hidden = true; });
    const stageTitle = stageHeader.querySelector("[data-wp-game-title]");
    stageTitle.hidden = true;
    stageTitle.setAttribute("data-wp-frame-title", "");
    stageHeader.append(stageTitle);
    const workspace = document.createElement("div");
    workspace.id = "stageWorkspace";
    workspace.append(document.getElementById("stageSummary"), stage.querySelector(".chapter-panel"), document.getElementById("stageRail"));
    stage.append(workspace);
    stageHeader.querySelectorAll(":scope > div,:scope > span").forEach(node => node.remove());
    stage.querySelector(".stage-tabs").setAttribute("data-wp-frame-nav", "");
    const live = document.getElementById("battleLive");
    const battleTitle = document.createElement("strong");
    battleTitle.setAttribute("data-wp-frame-title", "");
    battleHeader.append(battleTitle);
    battle.prepend(battleHeader);
    const info = battleHeader.querySelector(".battle-title");
    info.setAttribute("data-wp-frame-info", "");
    const stageLabel = info.querySelector("#stageLabel");
    const scoreLabel = info.querySelector("#scoreLabel");
    info.remove();
    const frame = window.WeightPlayScreenFrame.mount({
      root, localeSelect: document.getElementById("localeSelect"), playUI: true,
      scenes: {
        main: {root: main, header: mainHeader, content: main.querySelector(".main-hero")},
        stage: {root: stage, header: stageHeader, content: workspace},
        battle: {root: battle, header: battleHeader, content: live},
      },
    });
    const battleInfo = window.WeightPlayScreenFrame.createGroup();
    battleInfo.add(stageLabel);
    battleInfo.add(scoreLabel);
    frame.battleTopUI.add(battleInfo);
    frame.stageTopUI.add(window.WeightPlayScreenFrame.createGroup().add(document.getElementById("stageSummary")));
    const stagesButton = document.getElementById("stageTabsBtn");
    stagesButton.dataset.wpFrameAction = "tab";
    stagesButton.setAttribute("aria-pressed", "true");
    frame.commonDownButton.clear().add(stagesButton);
    document.querySelector(".flight-controls").append(document.getElementById("pauseBtn"));
    frame.activate("main");
    window.addEventListener("pagehide", event => { if (!event.persisted) frame.destroy(); });
    return frame;
  };
})();
