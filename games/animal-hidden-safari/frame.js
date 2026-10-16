/* Shared screen-frame adapter for Hidden Safari. */
(() => {
  "use strict";
  window.mountAnimalHiddenSafariFrame = function () {
    const root = document.getElementById("gameFrame");
    const main = document.getElementById("mainScreen");
    const stage = document.getElementById("menuPanel");
    const battle = document.getElementById("playPanel");
    const mainHeader = main.querySelector(".topbar");
    const stageHeader = stage.querySelector(".stage-head");
    const battleHeader = battle.querySelector(".play-head");
    const localeSelect = document.getElementById("localeSelect");
    const localeControl = mainHeader.querySelector(".language-picker");
    localeControl.hidden = true;
    localeControl.style.setProperty("display", "none", "important");
    root.append(localeControl);
    const mainTitle = mainHeader.querySelector("[data-wp-frame-title]");
    mainHeader.replaceChildren(mainHeader.querySelector(".home-link"), mainTitle);
    const battleInfo = battle.querySelector("#battleFrameInfo");
    battleInfo.append(battle.querySelector("#pauseBtn"));
    battle.querySelector("#battleContent").append(battleInfo);
    const stageAction = document.createElement("button");
    stageAction.type = "button";
    stageAction.id = "stageStartSelected";
    stageAction.dataset.wpFrameAction = "primary";
    stageAction.addEventListener("click", () => window.__animalHiddenSafariStartSelected?.());
    const stageStatus = document.createElement("span");
    const frame = window.WeightPlayScreenFrame.mount({
      root, localeSelect, playUI: true,
      scenes: {
        main: { root: main, header: mainHeader, content: main.querySelector("#mainPanel") },
        stage: { root: stage, header: stageHeader, content: stage.querySelector("#stageWorkspace") },
        battle: { root: battle, header: battleHeader, content: battle.querySelector("#battleContent"), headerInfo: battle.querySelector("#battleFrameInfo") },
      },
    });
    stageStatus.setAttribute("data-wp-frame-stat", "");
    frame.stageTopUI.add(stageStatus);
    frame.commonDownButton.add(stageAction);
    window.__animalHiddenSafariSetStageFrameCopy = label => {
      stageStatus.textContent = `${window.__animalHiddenSafariSelectedStage?.() || 1} / 30`;
      stageStatus.setAttribute("aria-label", window.__animalHiddenSafariSelectedStageLabel?.() || label);
      stageAction.textContent = label;
      stageAction.setAttribute("aria-label", label);
    };
    frame.activate("main");
    window.addEventListener("pagehide", event => { if (!event.persisted) frame.destroy(); });
    return frame;
  };
})();
