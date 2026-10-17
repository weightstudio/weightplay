/* Animal Signal Scout content adapter; shared frame owns all shell geometry. */
(() => {
  "use strict";

  const root = document.getElementById("gameFrame");
  const main = document.getElementById("mainScreen");
  const stage = document.getElementById("stageScreen");
  const battle = document.getElementById("battleScreen");
  const stageWorkspace = document.getElementById("stageWorkspace");
  const battleContent = document.getElementById("battleContent");
  const localeSelect = document.getElementById("localeSelect");
  const stageInfo = document.createElement("div");
  const battleInfo = document.getElementById("battleFrameInfo");

  if (!root || !main || !stage || !battle || !stageWorkspace || !battleContent
      || !window.WeightPlayScreenFrame || !window.WeightPlayPlayUI) {
    throw new Error("SIGNAL_SCOUT_SHARED_FRAME_REQUIRED");
  }

  const hero = main.querySelector(".hero-grid");
  const poster = hero?.querySelector(".cover");
  const intro = hero?.querySelector('[data-copy="intro"]');
  const progress = document.getElementById("mainProgress");
  const start = document.getElementById("startBtn");
  if (!hero || !poster || !intro || !progress || !start) {
    throw new Error("SIGNAL_SCOUT_SHARED_MAIN_CONTENT_REQUIRED");
  }

  const composition = document.createElement("section");
  composition.className = "wp-standard-main-composition";
  const posterSlot = document.createElement("div");
  posterSlot.className = "wp-standard-main-poster";
  poster.classList.add("wp-standard-main-poster-media");
  poster.dataset.wpFramePoster = "";
  posterSlot.append(poster);
  const copySlot = document.createElement("div");
  copySlot.className = "wp-standard-main-copy";
  intro.classList.add("wp-standard-main-summary");
  intro.dataset.wpFrameSummary = "";
  progress.classList.add("wp-standard-main-progress");
  progress.dataset.wpFrameProgress = "";
  start.classList.add("wp-standard-main-start");
  start.dataset.wpMainStart = "";
  copySlot.append(intro, progress, start);
  composition.append(posterSlot, copySlot);
  hero.replaceWith(composition);
  main.classList.add("wp-standard-main-screen", "wp-standard-main-flow-owner");
  const duplicateGuide = main.querySelector(".guide-card");
  if (duplicateGuide) duplicateGuide.hidden = true;

  localeSelect.hidden = true;
  stageWorkspace.append(stageInfo);
  battleContent.prepend(battleInfo);

  const frame = window.WeightPlayScreenFrame.mount({
    root,
    localeSelect,
    playUI: true,
    scenes: {
      main: { root: main, header: main.querySelector(".main-header"), content: composition },
      stage: { root: stage, header: stage.querySelector(".stage-header"), content: stageWorkspace, headerInfo: stageInfo },
      battle: { root: battle, header: battle.querySelector(".battle-head"), content: battleContent, headerInfo: battleInfo },
    },
  });

  const stageStatus = document.createElement("span");
  stageStatus.id = "stageStatus";
  frame.stageTopUI.add(window.WeightPlayScreenFrame.createGroup().add(stageStatus));

  const battleGroup = window.WeightPlayScreenFrame.createGroup();
  battleGroup.add(document.getElementById("roundLabel"));
  battleGroup.add(document.getElementById("checkCount"));
  frame.battleTopUI.add(battleGroup);

  const stageTabs = document.getElementById("stageTabs");
  stageTabs.setAttribute("role", "tablist");
  stageTabs.setAttribute("aria-label", document.getElementById("stageTitle").textContent.trim());
  const stageTab = stageTabs.querySelector("button");
  stageTab.dataset.wpFrameAction = "tab";
  stageTab.setAttribute("aria-pressed", "true");
  stageTabs.setAttribute("aria-label", stageTab.textContent.trim());
  frame.commonDownButton.add(stageTab);

  function setStageStatus(index, count, label) {
    const language = document.documentElement.lang || "en";
    stageStatus.textContent = `${new Intl.NumberFormat(language).format(index + 1)} / ${new Intl.NumberFormat(language).format(count)}`;
    stageStatus.setAttribute("aria-label", label);
  }

  frame.activate("main");
  window.SignalScoutFrame = Object.freeze({
    frame,
    stageWorkspace,
    stageRail: document.getElementById("stageList"),
    setStageStatus,
    activate(name, options) { frame.activate(name, options); },
    destroy() { frame.destroy(); },
  });

  window.addEventListener("pagehide", (event) => {
    if (!event.persisted) frame.destroy();
  }, { once: true });
})();
