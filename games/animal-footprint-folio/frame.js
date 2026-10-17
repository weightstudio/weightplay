/* Game content enters the shared Interface 9 frame through its scene slots. */
(() => {
  "use strict";

  const root = document.getElementById("app");
  const main = document.getElementById("mainScreen");
  const battle = document.getElementById("battleScreen");
  const mainHeader = main?.querySelector(".main-header");
  const battleHeader = battle?.querySelector(".battle-header");
  const battleContent = battle?.querySelector(".battle-layout");
  const frameRuntime = window.WeightPlayScreenFrame;
  if (!root || !main || !battle || !mainHeader || !battleHeader || !battleContent || !frameRuntime) {
    throw new Error("FOOTPRINT_FOLIO_SHARED_FRAME_REQUIRED");
  }

  const battleReturn = battleHeader.querySelector('[data-wp-return="battle"]');
  const recordCount = battleHeader.querySelector("#recordCount");
  const scorePill = battleHeader.querySelector(".score-pill");
  if (!battleReturn || !recordCount || !scorePill) throw new Error("FOOTPRINT_FOLIO_BATTLE_GROUP_REQUIRED");
  const battleTitle = document.createElement("strong");
  battleTitle.hidden = true;
  battleTitle.dataset.wpFrameTitle = "";
  battleHeader.replaceChildren(battleReturn, battleTitle);

  const battleInfo = document.createElement("div");
  battleContent.prepend(battleInfo);
  const frame = frameRuntime.mount({
    root,
    localeSelect: document.getElementById("locale"),
    playUI: true,
    scenes: {
      main: {
        root: main,
        header: mainHeader,
        content: main.querySelector(".main-grid"),
      },
      battle: {
        root: battle,
        header: battleHeader,
        content: battleContent,
        headerInfo: battleInfo,
      },
    },
  });

  const battleInfoGroup = frameRuntime.createGroup();
  battleInfoGroup
    .add(recordCount)
    .add(scorePill);
  frame.battleTopUI.add(battleInfoGroup);
  frame.activate("main");
  window.__ANIMAL_FOOTPRINT_FOLIO_FRAME__ = frame;

  window.addEventListener("pagehide", (event) => {
    if (!event.persisted) frame.destroy();
  });
})();
