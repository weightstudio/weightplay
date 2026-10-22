/* Shared Interface 9 frame and Stage selector adapter. */
(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const root = document.body;
  const main = $("mainScreen");
  const stage = document.querySelector("#stageScreen .stage-canvas");
  const battle = document.querySelector("#battleScreen .battle-canvas");
  const gameStage = window.WeightPlayFoldedFieldStage;
  if (!root || !main || !stage || !battle || !window.WeightPlayScreenFrame
      || !window.WeightPlayPlayUI || !gameStage) {
    throw new Error("FOLDED_FIELD_I9_FRAME_REQUIRED");
  }

  const mainHeader = main.querySelector("header");
  const stageHeader = stage.querySelector("header");
  const battleHeader = battle.querySelector("header");
  mainHeader.querySelector("[data-copy='title']").dataset.wpFrameTitle = "";
  stageHeader.querySelector("h2").dataset.wpFrameTitle = "";
  battleHeader.querySelector("h2").dataset.wpFrameTitle = "";

  const stageNav = stage.querySelector("[data-wp-frame-nav]");
  const battleInfo = $("battleFrameInfo");
  if (stageNav) {
    stageNav.dataset.wpPlayActions = "";
    stageNav.dataset.wpFrameStageNav = "";
  }

  const frame = window.WeightPlayScreenFrame.mount({
    root,
    localeSelect: $("foldedChoice"),
    playUI: true,
    scenes: {
      main: { root: main, header: mainHeader, content: main.querySelector(".main-hero") },
      stage: { root: stage, header: stageHeader, content: $("stageSelectionPage") },
      battle: { root: battle, header: battleHeader, content: $("battleContent"), headerInfo: battleInfo },
    },
  });

  const stageSelector = window.WeightPlayPlayUI.mountStage({
    page: $("stageSelectionPage"),
    rail: $("stageList"),
    config: gameStage.config(),
    selected: gameStage.selectedIndex(),
    onSelect: (index, meta) => gameStage.select(index, meta),
    onStart: (index, event) => gameStage.start(index, event),
    isActive: () => root.dataset.screen === "stage" && !$("stageScreen").hidden,
  });

  const sync = () => {
    const scene = root.dataset.screen || "main";
    if (!["main", "stage", "battle"].includes(scene)) return;
    const leave = battle.querySelector(".folded-leave-dialog:not([hidden])");
    frame.activate(scene, { covered: Boolean(leave) });
    const guide = $("gameGuide");
    if (guide) {
      guide.hidden = scene !== "main";
      guide.inert = scene !== "main";
    }
    if (scene === "battle") window.WeightPlayBattleCanvas?.sync?.();
  };

  window.addEventListener("weightplay:shell-sync", sync);
  window.WeightPlayFoldedFieldFrame = Object.freeze({
    frame,
    sync,
    selectStage(index, options) { return stageSelector.select(index, options); },
    refreshStage(index) { return stageSelector.refresh(index); },
    updateStage(config, index) { return stageSelector.setConfig(config, index); },
    cancelStage() { return stageSelector.cancel(); },
  });
  sync();
})();
