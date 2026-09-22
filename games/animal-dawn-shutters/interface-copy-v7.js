(() => {
  'use strict';
  const locales = window.DAWN_SHUTTERS_LOCALES;
  if (!locales) return;

  const canonical = {
    en: ['Start Game', 'Stages'],
    'zh-Hant': ['開始遊戲', '關卡'],
    'zh-Hans': ['开始游戏', '关卡'],
    ja: ['ゲーム開始', 'ステージ'],
    ko: ['게임 시작', '스테이지'],
    es: ['Iniciar juego', 'Niveles'],
    'pt-BR': ['Iniciar jogo', 'Fases'],
    fr: ['Commencer le jeu', 'Niveaux'],
    de: ['Spiel starten', 'Level'],
    it: ['Inizia gioco', 'Livelli'],
    ru: ['Начать игру', 'Уровни'],
    hi: ['गेम शुरू करें', 'स्तर'],
    ar: ['ابدأ اللعبة', 'المراحل'],
  };

  Object.entries(canonical).forEach(([locale, [start, stages]]) => {
    if (!locales[locale]) return;
    locales[locale].start = start;
    locales[locale].stages = stages;
  });
})();
