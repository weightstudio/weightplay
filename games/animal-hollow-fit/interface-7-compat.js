(() => {
  "use strict";

  const canonicalStart = {
    en: "Start Game",
    "zh-Hant": "開始遊戲",
    "zh-Hans": "开始游戏",
    ja: "ゲーム開始",
    ko: "게임 시작",
    es: "Iniciar juego",
    "pt-BR": "Iniciar jogo",
    fr: "Commencer le jeu",
    de: "Spiel starten",
    it: "Inizia gioco",
    ru: "Начать игру",
    hi: "गेम शुरू करें",
    ar: "ابدأ اللعبة",
  };

  const locales = window.ANIMAL_HOLLOW_FIT_LOCALES;
  if (locales) {
    Object.entries(canonicalStart).forEach(([locale, start]) => {
      if (locales[locale]) locales[locale].start = start;
    });
  }

  const syncSharedSound = () => {
    const legacyToggle = document.getElementById("sound-toggle");
    if (!legacyToggle || !window.WeightPlayAudio?.isMuted) return;
    const sharedSoundOn = !window.WeightPlayAudio.isMuted();
    const gameSoundOn = legacyToggle.getAttribute("aria-pressed") === "true";
    if (sharedSoundOn !== gameSoundOn) legacyToggle.click();
  };

  window.addEventListener("wonder:audio-volume-change", () => queueMicrotask(syncSharedSound));
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", syncSharedSound, { once: true });
  } else {
    queueMicrotask(syncSharedSound);
  }
})();
