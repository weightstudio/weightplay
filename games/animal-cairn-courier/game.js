(function () {
  "use strict";

  if (window.__ANIMAL_CAIRN_COURIER_INTERFACE7_COMPAT__) return;
  window.__ANIMAL_CAIRN_COURIER_INTERFACE7_COMPAT__ = true;

  /* Interface 7 standardizes the catalog-level primary action and the center
     Stage navigation label. Patch the existing locale catalog before the
     untouched v7 gameplay runtime boots so every localized route gets the
     same shared-interface semantics without duplicating game logic. */
  const labels = {
    en: { start: "Start Game", stageTab: "Stages" },
    "zh-Hant": { start: "開始遊戲", stageTab: "關卡" },
    "zh-Hans": { start: "开始游戏", stageTab: "关卡" },
    ja: { start: "ゲーム開始", stageTab: "ステージ" },
    ko: { start: "게임 시작", stageTab: "스테이지" },
    es: { start: "Iniciar juego", stageTab: "Niveles" },
    "pt-BR": { start: "Iniciar jogo", stageTab: "Fases" },
    fr: { start: "Démarrer le jeu", stageTab: "Niveaux" },
    de: { start: "Spiel starten", stageTab: "Stufen" },
    it: { start: "Avvia gioco", stageTab: "Livelli" },
    ru: { start: "Начать игру", stageTab: "Уровни" },
    hi: { start: "खेल शुरू करें", stageTab: "चरण" },
    ar: { start: "ابدأ اللعبة", stageTab: "المراحل" }
  };

  const tables = window.ANIMAL_CAIRN_COURIER_LOCALES || {};
  Object.entries(labels).forEach(([locale, patch]) => {
    if (tables[locale]) Object.assign(tables[locale], patch);
  });

  /* The authored v7 Stage placed its rail directly in the Stage grid, which
     leaves no bounded workspace owner for Interface 7's upper-middle selector
     anchor. Normalize this once, before the untouched gameplay runtime and the
     DOMContentLoaded shared-frame pass, so scene node ownership stays stable. */
  const stageScreen = document.getElementById("stageScreen");
  const stageList = document.getElementById("stageList");
  if (stageScreen && stageList && stageList.parentElement === stageScreen) {
    const workspace = document.createElement("div");
    workspace.className = "cairn-stage-workspace";
    workspace.dataset.wpStageWorkspace = "";
    stageScreen.insertBefore(workspace, stageList);
    workspace.append(stageList);
  }

  const current = document.currentScript;
  const runtime = document.createElement("script");
  runtime.async = false;
  runtime.src = new URL("./game-v7-base.js?v=20260922-interface7-cleanup", current?.src || location.href).href;
  runtime.dataset.wpCairnCourierRuntime = "v7-base";
  if (current?.parentNode) current.after(runtime);
  else document.body.append(runtime);
}());
