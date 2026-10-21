/* Content adapter only. Shared Screen Frame and Play UI own all screen chrome,
   locale/settings placement, Stage cards, card input, and Stage action layout. */
(() => {
  "use strict";

  window.mountCatColorSudokuFrame = ({ localeSelect, save, text, selected, onSelect, onStart }) => {
    const root = document.getElementById("gameFrame");
    const main = document.getElementById("main");
    const stage = document.getElementById("stage");
    const battle = document.getElementById("battle");
    const mainHeader = main.querySelector("header");
    const stageHeader = stage.querySelector("header");
    const battleHeader = battle.querySelector("header");
    const stageContent = document.getElementById("stageContent");
    const battleContent = document.getElementById("battleContent");

    const frame = window.WeightPlayScreenFrame.mount({
      root,
      localeSelect,
      playUI: true,
      scenes: {
        main: {
          root: main,
          header: mainHeader,
          content: document.getElementById("mainContent"),
        },
        stage: {
          root: stage,
          header: stageHeader,
          content: stageContent,
          headerInfo: document.getElementById("stageHeaderInfo"),
        },
        battle: {
          root: battle,
          header: battleHeader,
          content: battleContent,
          headerInfo: document.getElementById("battleHeaderInfo"),
        },
      },
    });

    const stageProgress = document.getElementById("stageProgress");
    frame.stageTopUI.add(window.WeightPlayScreenFrame.createGroup().add(stageProgress));

    const battleInfo = window.WeightPlayScreenFrame.createGroup();
    for (const node of [
      document.getElementById("battleChapter"),
      document.getElementById("battleStage"),
      document.getElementById("objective"),
    ]) battleInfo.add(node);
    frame.battleTopUI.add(battleInfo);

    const stageSelector = window.WeightPlayPlayUI.mountStage({
      page: stageContent,
      rail: document.getElementById("stageRail"),
      config: window.CatColorSudokuStageConfig({ save, text }),
      selected,
      onSelect,
      onStart,
      isActive: () => frame.active === "stage",
    });
    const stagesTab = document.getElementById("stagesTab");
    frame.commonDownButton.clear().add(stagesTab);
    frame.activate("main");
    window.addEventListener("pagehide", (event) => {
      if (!event.persisted) frame.destroy();
    });

    return Object.freeze({
      activate: (name) => frame.activate(name),
      refreshStage: (index) => stageSelector.refresh(index),
      selectStage: (index, options) => stageSelector.select(index, options),
      destroy: () => {
        stageSelector.destroy();
        frame.destroy();
      },
    });
  };
})();
