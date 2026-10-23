/* The shared screen frame owns I9 geometry; this adapter supplies game data. */
(() => {
  "use strict";

  window.mountAnimalPatchworkPawsFrame = ({ patches, getState, text, onSelect, onStart }) => {
    const root = document.getElementById("app");
    const main = document.getElementById("mainScreen");
    const stage = document.getElementById("stageScreen");
    const battle = document.getElementById("battleScreen");
    const stageHeader = stage.querySelector(".stage-header");
    const battleHeader = battle.querySelector(".battle-header");
    const stageBack = stageHeader.querySelector('[data-wp-return="stage"]');
    const stageTitle = stageHeader.querySelector("[data-wp-frame-title]");
    const battleTitle = battleHeader.querySelector("[data-wp-frame-title]");
    const stageWorkspace = document.getElementById("stageWorkspace");
    const stageRail = document.getElementById("stageList");

    stageHeader.replaceChildren(stageBack, stageTitle);
    stageTitle.hidden = true;
    battleTitle.hidden = true;

    const frame = window.WeightPlayScreenFrame.mount({
      root,
      localeSelect: document.getElementById("localeSelect"),
      playUI: true,
      scenes: {
        main: { root: main, header: main.querySelector(".main-header"), content: document.getElementById("mainContent") },
        stage: { root: stage, header: stageHeader, content: stageWorkspace },
        battle: { root: battle, header: battleHeader, content: document.getElementById("battleLive") },
      },
    });

    const stageProgress = document.createElement("span");
    stageProgress.id = "stageProgress";
    frame.stageTopUI.add(window.WeightPlayScreenFrame.createGroup().add(stageProgress));

    const battleName = document.createElement("strong");
    battleName.id = "patchTitle";
    const battleProgress = document.createElement("span");
    battleProgress.id = "progressPill";
    frame.battleTopUI.add(window.WeightPlayScreenFrame.createGroup().add(battleName).add(battleProgress));

    frame.commonDownButton.clear();

    const config = window.AnimalPatchworkPawsStageConfig({ patches, getState, text });
    const selector = window.WeightPlayPlayUI.mountStage({
      page: stageWorkspace,
      rail: stageRail,
      config,
      selected: 0,
      isActive: () => frame.active === "stage",
      onSelect(index) {
        onSelect(index);
        updateStageHeader(index);
      },
      onStart(index) {
        onStart(index);
      },
    });

    function updateStageHeader(index = selector.selected) {
      const record = config.stage(index);
      stageProgress.textContent = `${record.kicker} · ${record.status}`;
    }
    window.addEventListener("pagehide", (event) => {
      if (!event.persisted) frame.destroy();
    });

    updateStageHeader(0);
    frame.activate("main");
    return Object.freeze({ frame, selector, refreshStage(index = selector.selected) {
      selector.refresh(index);
      updateStageHeader(index);
    } });
  };
})();
