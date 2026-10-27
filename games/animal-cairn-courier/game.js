(() => {
  "use strict";

  if (window.__ANIMAL_CAIRN_COURIER_INTERFACE9__) return;
  window.__ANIMAL_CAIRN_COURIER_INTERFACE9__ = true;

  const root = document.getElementById("gameFrame");
  const main = document.getElementById("mainScreen");
  const stage = document.getElementById("stageScreen");
  const battle = document.getElementById("battleScreen");
  const mainHeader = main.querySelector(".main-header");
  const stageHeader = stage.querySelector(".stage-header");
  const battleHeader = battle.querySelector(".battle-header");
  const localeSelect = document.getElementById("localeSelect");

  const stageBack = stageHeader.querySelector('[data-wp-return="stage"]');
  const stageTitle = document.createElement("strong");
  stageTitle.hidden = true;
  stageTitle.dataset.wpFrameTitle = "";
  stageHeader.replaceChildren(stageBack, stageTitle);

  const stageWorkspace = document.getElementById("stageWorkspace");
  const stageRail = document.getElementById("stageList");
  if (stageRail.parentElement !== stageWorkspace) stageWorkspace.append(stageRail);

  const battleBack = battleHeader.querySelector('[data-wp-return="battle"]');
  battleBack.addEventListener("click", (event) => {
    const guard = window.__ANIMAL_CAIRN_COURIER_BATTLE_BACK_GUARD__;
    if (typeof guard === "function" && guard()) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
  const battleName = document.getElementById("roundName");
  const battleLabel = document.getElementById("roundLabel");
  const battleTitle = document.createElement("strong");
  battleTitle.hidden = true;
  battleTitle.dataset.wpFrameTitle = "";
  battleHeader.replaceChildren(battleBack, battleTitle);

  const frame = window.WeightPlayScreenFrame.mount({
    root,
    localeSelect,
    playUI: true,
    scenes: {
      main: { root: main, header: mainHeader, content: main.querySelector(".wp-standard-main-composition") },
      stage: { root: stage, header: stageHeader, content: stageWorkspace },
      battle: { root: battle, header: battleHeader, content: battle.querySelector(".battle-content") },
    },
  });

  frame.battleTopUI.add(battleName).add(battleLabel);
  frame.activate("main");
  window.__ANIMAL_CAIRN_COURIER_FRAME__ = frame;

  const labels = {
    en: { start: "Start Game" },
    "zh-Hant": { start: "開始遊戲" },
    "zh-Hans": { start: "开始游戏" },
    ja: { start: "ゲーム開始" },
    ko: { start: "게임 시작" },
    es: { start: "Iniciar juego" },
    "pt-BR": { start: "Iniciar jogo" },
    fr: { start: "Démarrer le jeu" },
    de: { start: "Spiel starten" },
    it: { start: "Avvia gioco" },
    ru: { start: "Начать игру" },
    hi: { start: "खेल शुरू करें" },
    ar: { start: "ابدأ اللعبة" },
  };
  const tables = window.ANIMAL_CAIRN_COURIER_LOCALES || {};
  Object.entries(labels).forEach(([locale, patch]) => {
    if (tables[locale]) Object.assign(tables[locale], patch);
  });

  const current = document.currentScript;
  const runtime = document.createElement("script");
  runtime.type = "module";
  runtime.src = new URL("./runtime.mjs?v=20261027-cairn-pass2", current?.src || location.href).href;
  runtime.dataset.wpCairnCourierRuntime = "v12";
  runtime.onerror = () => window.WeightPlayGameEntryLoader?.fail("Cairn Courier could not load.", () => location.reload());
  if (current?.parentNode) current.after(runtime);
  else document.body.append(runtime);
})();
