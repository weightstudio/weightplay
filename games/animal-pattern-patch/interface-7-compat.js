(function () {
  "use strict";

  const locales = window.PATTERN_PATCH_LOCALES;
  if (!locales) return;

  const genericStartLabels = {
    en: "Start Game",
    "zh-Hant": "開始遊戲",
    "zh-Hans": "开始游戏",
    ja: "ゲームを開始",
    ko: "게임 시작",
    es: "Iniciar juego",
    "pt-BR": "Iniciar jogo",
    fr: "Commencer le jeu",
    de: "Spiel starten",
    it: "Avvia gioco",
    ru: "Начать игру",
    hi: "खेल शुरू करें",
    ar: "ابدأ اللعبة",
  };

  Object.entries(genericStartLabels).forEach(([locale, label]) => {
    if (locales[locale]) locales[locale].start = label;
  });
})();
