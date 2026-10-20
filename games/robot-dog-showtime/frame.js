/* Shared I9 shell adapter: all Stage geometry and gestures stay in WeightPlayPlayUI. */
(() => {
  "use strict";

  window.mountRobotDogShowtimeFrame = ({ stages, getState, selected, isSpotlightAvailable, onSelect, onStart, onSpotlight, onHelp }) => {
    const root = document.getElementById("app");
    const main = document.getElementById("mainScreen");
    const stage = document.getElementById("stageScreen");
    const battle = document.getElementById("battleScreen");
    const stageHeader = document.getElementById("stageHeader");
    const battleHeader = document.getElementById("battleHeader");
    const stageTitle = document.getElementById("stageTitle");
    const battleTitle = document.getElementById("battleTitle");
    const stageWorkspace = document.getElementById("stageWorkspace");
    const stageRail = document.getElementById("stageRail");
    const spotlightButton = document.getElementById("spotlightAction");
    const battleLabel = document.getElementById("battleLabel");
    const helpButton = document.getElementById("helpButton");

    stageTitle.hidden = true;
    battleTitle.hidden = true;
    battleLabel.className = "robot-dog-battle-label";
    battleLabel.setAttribute("aria-live", "polite");
    helpButton.className = "robot-dog-help-button";

    const frame = window.WeightPlayScreenFrame.mount({
      root,
      localeSelect: document.getElementById("localeSelect"),
      playUI: true,
      scenes: {
        main: { root: main, header: main.querySelector(".main-header"), content: document.getElementById("mainComposition") },
        stage: { root: stage, header: stageHeader, content: stageWorkspace },
        battle: { root: battle, header: battleHeader, content: document.getElementById("battleLive") },
      },
    });

    const stageInfo = document.createElement("span");
    stageInfo.id = "stageProgress";
    stageInfo.setAttribute("role", "status");
    stageInfo.setAttribute("aria-live", "polite");
    frame.stageTopUI.add(window.WeightPlayScreenFrame.createGroup().add(stageInfo));
    frame.battleTopUI.add(window.WeightPlayScreenFrame.createGroup().add(battleLabel).add(helpButton));
    frame.commonDownButton.clear();
    frame.commonDownButton.add(spotlightButton);

    const config = window.RobotDogShowtimeStageConfig({ stages, getState, isSpotlightAvailable });
    const selector = window.WeightPlayPlayUI.mountStage({
      page: stageWorkspace,
      rail: stageRail,
      config,
      selected,
      isActive: () => frame.active === "stage",
      onSelect(index) {
        onSelect(index);
        updateStage(index);
      },
      onStart(index) {
        onStart(index);
      },
    });

    function updateStage(index = selector.selected) {
      const record = config.stage(index);
      stageInfo.textContent = `${record.kicker} · ${record.status}`;
      spotlightButton.hidden = !record.spotlightAvailable;
      spotlightButton.textContent = `Spotlight Mix · Stage ${record.id}`;
      spotlightButton.setAttribute("aria-label", `Start Spotlight Mix on Stage ${record.id}`);
    }

    spotlightButton.addEventListener("click", onSpotlight);
    helpButton.addEventListener("click", onHelp);
    window.addEventListener("pagehide", event => {
      if (!event.persisted) {
        selector.destroy();
        frame.destroy();
      }
    });

    updateStage(selected);
    frame.activate("main");
    return Object.freeze({
      frame,
      selector,
      refreshStage(index = selector.selected) {
        selector.refresh(index);
        updateStage(index);
      },
      setBattleLabel(text) {
        battleLabel.textContent = text;
      },
    });
  };
})();
