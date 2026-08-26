(() => {
  "use strict";

  if (window.__weightplaySpadesAnalyticsInstalled) return;
  window.__weightplaySpadesAnalyticsInstalled = true;

  const GAME_ID = "spades";
  const GAME_VERSION = "v14";
  const INTERFACE_VERSION = "6";
  const LOCALE_MAP = {
    en: "en",
    "zh-tw": "zh-Hant",
    "zh-cn": "zh-Hans",
    ja: "ja",
    ko: "ko",
    es: "es",
    "pt-br": "pt-BR",
    fr: "fr",
    de: "de",
    it: "it",
    ru: "ru",
    hi: "hi",
    ar: "ar",
  };
  const LOCALES = new Set(Object.values(LOCALE_MAP));

  const locale = () => {
    const actual = window.WonderI18n?.actualLocale?.();
    if (LOCALES.has(actual)) return actual;
    const segment = window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
    return LOCALE_MAP[segment] || document.documentElement.lang || "en";
  };

  const screen = () => {
    if (!document.querySelector("#resultOverlay")?.hidden) return "result";
    if (!document.querySelector("#battleScreen")?.hidden) return "battle";
    return "main";
  };

  const phase = () => {
    if (screen() === "result") return "result";
    if (screen() !== "battle") return "main";
    return document.querySelector('#cardGameActions [data-action="bid"]') ? "bid" : "trick_play";
  };

  const track = (event, details = {}) => {
    try {
      window.WonderAnalytics?.track?.(event, {
        game_id: GAME_ID,
        game_version: GAME_VERSION,
        interface_version: INTERFACE_VERSION,
        locale: locale(),
        screen: screen(),
        phase: phase(),
        ...details,
      });
    } catch {
      // Measurement must never interrupt card play or navigation.
    }
  };

  const bidBucket = (value) => {
    const bid = Number(value);
    if (!Number.isFinite(bid)) return "unknown";
    if (bid <= 3) return "low";
    if (bid <= 7) return "mid";
    return "high";
  };

  document.addEventListener("click", (event) => {
    const target = event.target?.closest?.("button, .main-return, [data-card-index]");
    if (!target || target.disabled || target.hidden) return;

    if (target.matches("#startBtn")) {
      track("spades_game_start", { from: "main" });
      return;
    }
    if (target.matches("#restartBtn, #resultRestart, #battleRestartBtn")) {
      track("spades_restart", { from: target.id === "resultRestart" ? "result" : target.id === "battleRestartBtn" ? "battle" : "main" });
      return;
    }
    if (target.matches("#newGameBtn, #resultNewGame, #battleNewBtn")) {
      track("spades_new_game", { from: target.id === "resultNewGame" ? "result" : target.id === "battleNewBtn" ? "battle" : "main" });
      return;
    }
    if (target.matches("#battleBackBtn, .main-return")) {
      track("spades_main_return", { from: target.matches(".main-return") ? "main" : "battle" });
      return;
    }
    if (target.matches('#cardGameActions [data-action="bid"]')) {
      track("spades_bid", { from: "battle", bid_bucket: bidBucket(target.dataset.value) });
      return;
    }
    if (target.matches("#cardGameHand [data-card-index]")) {
      track("spades_card_choice", { from: "battle" });
    }
  }, true);

  document.addEventListener("change", (event) => {
    if (!event.target?.matches?.("#localeSelect")) return;
    const selectedLocale = event.target.value;
    if (LOCALES.has(selectedLocale)) track("spades_locale_change", { to_locale: selectedLocale, from: screen() });
  }, true);

  const result = document.querySelector("#resultOverlay");
  let resultVisible = Boolean(result && !result.hidden);
  if (result) new MutationObserver(() => {
    const visible = !result.hidden;
    if (visible && !resultVisible) {
      track("spades_result", { from: "battle" });
    }
    resultVisible = visible;
  }).observe(result, { attributes: true, attributeFilter: ["hidden"] });

  let wasHidden = false;
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      wasHidden = true;
      return;
    }
    if (document.visibilityState === "visible" && wasHidden) {
      wasHidden = false;
      track("spades_resume_session", { from: "lifecycle" });
    }
  });
})();
