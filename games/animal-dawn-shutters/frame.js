/* Shared Interface 9 shell adapter. The game retains its native scene logic. */
(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const root = $("#app");
  const main = $("#mainScreen");
  const stage = $("#stageScreen");
  const battle = $("#battleScreen");
  const gameStage = window.WeightPlayDawnStage;
  if (!root || !main || !stage || !battle || !window.WeightPlayScreenFrame || !window.WeightPlayPlayUI || !gameStage) {
    throw new Error("DAWN_SHUTTERS_I9_FRAME_REQUIRED");
  }

  const mainHeader = main.querySelector("header");
  const stageHeader = stage.querySelector("header");
  const battleHeader = battle.querySelector("header");
  mainHeader.querySelector("[data-copy='title']").dataset.wpFrameTitle = "";
  stageHeader.querySelector("h2").dataset.wpFrameTitle = "";
  battleHeader.querySelector("h2").dataset.wpFrameTitle = "";

  const mainWorkspace = $("#mainWorkspace");
  const stageWorkspace = $("#stageWorkspace");
  const battleWorkspace = $("#battleWorkspace");
  const stageProgress = $("#stageProgress");
  const battleRoomProgress = $("#battleRoomProgress");
  const progressBadge = $("#progressBadge");
  const stageNav = stage.querySelector("[data-wp-frame-nav]");
  const stageTab = stageNav.querySelector("button");
  stageNav.dataset.wpPlayActions = "";
  stageNav.dataset.wpFrameStageNav = "";
  stageTab.dataset.wpFrameStageSlot = "stages";
  stageTab.dataset.wpFrameAction = "tab";

  const frame = window.WeightPlayScreenFrame.mount({
    root,
    localeSelect: $("#languageSelect"),
    playUI: true,
    scenes: {
      main: { root: main, header: mainHeader, content: mainWorkspace },
      stage: { root: stage, header: stageHeader, content: stageWorkspace },
      battle: { root: battle, header: battleHeader, content: battleWorkspace },
    },
  });

  frame.stageTopUI.add(window.WeightPlayScreenFrame.createGroup().add(stageProgress));
  const battleGroup = window.WeightPlayScreenFrame.createGroup()
    .add(battleRoomProgress)
    .add(progressBadge);
  frame.battleTopUI.add(battleGroup);

  const stageSelector = window.WeightPlayPlayUI.mountStage({
    page: $("#stageSelectionPage"),
    rail: $("#stageRail"),
    config: gameStage.config(),
    selected: gameStage.selectedIndex(),
    onSelect: (index, meta) => gameStage.select(index, meta),
    onStart: (index, event) => gameStage.start(index, event),
    isActive: () => document.body.dataset.screen === "stage" && !$("#stageScreen").hidden,
  });

  const sync = () => {
    const scene = document.body.dataset.screen || "main";
    if (!["main", "stage", "battle"].includes(scene)) return;
    const modal = scene === "battle" ? battle.querySelector("dialog[open]") : null;
    frame.activate(scene, { covered: Boolean(modal) });
    const guide = $("#gameGuide");
    if (guide) {
      guide.hidden = scene !== "main";
      guide.inert = scene !== "main";
    }
    battleWorkspace.inert = scene !== "battle" || Boolean(modal);
    if (scene === "battle") window.WeightPlayBattleCanvas?.sync?.();
  };

  window.addEventListener("weightplay:shell-sync", sync);
  window.WeightPlayDawnFrame = Object.freeze({
    frame,
    sync,
    updateStage(config, index) { return stageSelector.setConfig(config, index); },
    selectStage(index, options) { return stageSelector.select(index, options); },
    refreshStage(index) { return stageSelector.refresh(index); },
    cancelStage() { return stageSelector.cancel(); },
  });
  sync();
})();
