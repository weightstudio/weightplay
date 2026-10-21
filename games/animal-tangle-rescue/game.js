/* Interface 9 bootstrap for the authored Tangle Rescue game data. */
(() => {
  'use strict';
  const self = document.currentScript;
  const assetUrl = (name) => new URL(name, self?.src || document.baseURI).href;

  // Keep the established Main action label while the shared frame owns every
  // Main / Stage / Battle / Result shell control.
  const sharedStartLabels = {
    en: 'Start Game',
    'zh-Hant': '開始遊戲',
    'zh-Hans': '开始游戏',
    ja: 'ゲーム開始',
    ko: '게임 시작',
    es: 'Jugar',
    'pt-BR': 'Jogar',
    fr: 'Jouer',
    de: 'Spiel starten',
    it: 'Gioca',
    ru: 'Начать игру',
    hi: 'खेल शुरू करें',
    ar: 'ابدأ اللعب',
  };
  Object.entries(sharedStartLabels).forEach(([locale, label]) => {
    if (window.TANGLE_RESCUE_LOCALES?.[locale]) window.TANGLE_RESCUE_LOCALES[locale].start = label;
  });

  if (window.__tangleRescueCoreRequested) return;
  window.__tangleRescueCoreRequested = true;
  const core = document.createElement('script');
  core.src = assetUrl('game-core.js?v=20261021-tangle-rescue-v12-stage-tab-v1');
  core.async = false;
  core.dataset.wpTangleGameCore = 'true';
  core.addEventListener('load', () => {
    window.mountAnimalTangleRescueFrame?.();
  }, { once: true });
  document.body.append(core);
})();
