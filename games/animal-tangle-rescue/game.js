/*
 * Tangle Rescue v10 / Interface 7 compatibility bootstrap.
 *
 * Localized route shells still declare legacy frame-root markers even though
 * this game does not call the explicit WeightPlayScreenFrame mount API. Keep
 * the gameplay source byte-for-byte in game-core.js, then retire those stale
 * markers only after gameplay has initialized so the shared Interface 7
 * auto-mount can safely adopt Main / Stage / Battle on every locale route.
 */
(() => {
  "use strict";
  const self = document.currentScript;
  const assetUrl = (name) => new URL(name, self?.src || document.baseURI).href;

  if (!document.querySelector('link[href*="interface-compat.css"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = assetUrl("interface-compat.css?v=20260924-tangle-rescue-v10-result-scroll-reset");
    link.dataset.wpTangleInterfaceCompat = "true";
    document.head.append(link);
  }

  // Interface 7 standardizes the first Main action across the catalog. The
  // locale dictionaries are already loaded before this compatibility bootstrap,
  // so normalize only their existing `start` key before game-core applies copy.
  const sharedStartLabels = {
    en: "Start Game",
    "zh-Hant": "開始遊戲",
    "zh-Hans": "开始游戏",
    ja: "ゲーム開始",
    ko: "게임 시작",
    es: "Jugar",
    "pt-BR": "Jogar",
    fr: "Jouer",
    de: "Spiel starten",
    it: "Gioca",
    ru: "Начать игру",
    hi: "खेल शुरू करें",
    ar: "ابدأ اللعب",
  };
  Object.entries(sharedStartLabels).forEach(([locale, label]) => {
    if (window.TANGLE_RESCUE_LOCALES?.[locale]) window.TANGLE_RESCUE_LOCALES[locale].start = label;
  });

  // The authored rail already exposes the shared data hook. Add the canonical
  // rail class before auto-mount so the common 264x190 drag/snap geometry also
  // applies on generated locale routes without duplicating selector logic.
  document.getElementById("stageList")?.classList.add("stage-rail");

  if (window.__tangleRescueCoreRequested) return;
  window.__tangleRescueCoreRequested = true;

  const core = document.createElement("script");
  core.src = assetUrl("game-core.js?v=20260924-tangle-rescue-v10-result-scroll-reset");
  core.async = false;
  core.dataset.wpTangleGameCore = "true";
  core.addEventListener("load", () => {
    const root = document.getElementById("app");
    root?.removeAttribute("data-wp-frame-root");
    root?.removeAttribute("data-wp-game-shell-root");

    const requestSharedFrame = () => window.WeightPlayScreenFrame?.autoMountDocument?.();
    requestSharedFrame();
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", requestSharedFrame, { once: true });
    } else {
      queueMicrotask(requestSharedFrame);
    }
    window.addEventListener("load", requestSharedFrame, { once: true });
  }, { once: true });
  document.body.append(core);
})();
