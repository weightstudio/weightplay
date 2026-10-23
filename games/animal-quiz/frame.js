/* Animal Quiz supplies content; the shared Frame owns every shell and slot. */
(() => {
  "use strict";

  const root = document.getElementById("gameFrame");
  const main = document.getElementById("mainScreen");
  const stage = document.getElementById("stageScreen");
  const battle = document.getElementById("battleScreen");
  const mainContent = document.getElementById("mainPanel");
  const stageContent = document.getElementById("stageSelectPanel");
  const battleContent = document.getElementById("battleContent");
  const localeSelect = document.getElementById("localeSelect");
  const stageInfo = document.createElement("div");
  const battleInfo = document.getElementById("battleFrameInfo");

  if (!root || !main || !stage || !battle || !mainContent || !stageContent || !battleContent
      || !localeSelect || !battleInfo || !window.WeightPlayScreenFrame || !window.WeightPlayPlayUI) {
    throw new Error("ANIMAL_QUIZ_SHARED_FRAME_REQUIRED");
  }

  stageContent.append(stageInfo);
  battleContent.prepend(battleInfo);
  main.classList.add("wp-standard-main-screen", "wp-standard-main-flow-owner");
  mainContent.classList.add("wp-standard-main-composition");
  const poster = mainContent.querySelector(".main-cover");
  const intro = document.getElementById("mainIntro");
  const start = document.getElementById("startGameBtn");
  if (!poster || !intro || !start) throw new Error("ANIMAL_QUIZ_SHARED_MAIN_CONTENT_REQUIRED");
  poster.dataset.wpFramePoster = "";
  intro.dataset.wpFrameSummary = "";
  start.dataset.wpMainStart = "";

  const frame = window.WeightPlayScreenFrame.mount({
    root,
    localeSelect,
    playUI: true,
    scenes: {
      main: { root: main, header: main.querySelector(".main-header"), content: mainContent },
      stage: { root: stage, header: stage.querySelector(".stage-header"), content: stageContent, headerInfo: stageInfo },
      battle: { root: battle, header: battle.querySelector(".battle-head"), content: battleContent, headerInfo: battleInfo },
    },
  });

  const stageStatus = document.createElement("span");
  stageStatus.id = "stageStatus";
  frame.stageTopUI.add(window.WeightPlayScreenFrame.createGroup().add(stageStatus));
  frame.battleTopUI.add(window.WeightPlayScreenFrame.createGroup().add(document.getElementById("levelText")));
  const stagesTab = document.getElementById("stagesTab");
  if (!stagesTab) throw new Error("ANIMAL_QUIZ_SHARED_STAGE_NAV_REQUIRED");
  frame.commonDownButton.add(stagesTab);
  frame.activate("main");

  window.AnimalQuizFrame = Object.freeze({
    frame,
    stageWorkspace: stageContent,
    stageRail: document.getElementById("stageGrid"),
    setStageStatus(label) {
      stageStatus.textContent = label;
      stageStatus.setAttribute("aria-label", label);
    },
    activate(name, options) { frame.activate(name, options); },
    destroy() { frame.destroy(); },
  });

  window.addEventListener("pagehide", (event) => {
    if (!event.persisted) frame.destroy();
  }, { once: true });
})();
