(() => {
  "use strict";

  if (window.__weightplayHeartsAnalyticsInstalled) return;
  window.__weightplayHeartsAnalyticsInstalled = true;

  const GAME_ID = "hearts";
  const GAME_VERSION = "v16";
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
    return document.querySelector('#cardGameActions [data-action="pass"]') ? "pass" : "trick_play";
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

  document.addEventListener("click", (event) => {
    const target = event.target?.closest?.("button, .main-return, [data-card-index]");
    if (!target || target.disabled || target.hidden) return;

    if (target.matches("#startBtn")) {
      track("hearts_game_start", { from: "main" });
      return;
    }
    if (target.matches("#restartBtn, #resultRestart")) {
      track("hearts_restart", { from: target.id === "resultRestart" ? "result" : "main" });
      return;
    }
    if (target.matches("#newGameBtn, #resultNewGame")) {
      track("hearts_new_game", { from: target.id === "resultNewGame" ? "result" : "main" });
      return;
    }
    if (target.matches("#battleBackBtn, .main-return")) {
      track("hearts_main_return", { from: target.matches(".main-return") ? "main" : "battle" });
      return;
    }
    if (target.matches('[data-action="pass"]')) {
      track("hearts_pass", { from: "battle" });
      return;
    }
    if (target.matches("[data-card-index]")) {
      track("hearts_card_choice", { from: "battle", choice: phase() === "pass" ? "pass" : "play" });
    }
  }, true);

  document.addEventListener("change", (event) => {
    if (!event.target?.matches?.("#localeSelect")) return;
    const selectedLocale = event.target.value;
    if (LOCALES.has(selectedLocale)) track("hearts_locale_change", { to_locale: selectedLocale, from: screen() });
  }, true);

  const result = document.querySelector("#resultOverlay");
  let resultVisible = Boolean(result && !result.hidden);
  if (result) new MutationObserver(() => {
    const visible = !result.hidden;
    if (visible && !resultVisible) track("hearts_result", { from: "battle" });
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
      track("hearts_resume_session", { from: "lifecycle" });
    }
  });
})();
