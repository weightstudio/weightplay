(() => {
  "use strict";

  if (window.__weightplayCribbageAnalyticsInstalled) return;
  window.__weightplayCribbageAnalyticsInstalled = true;

  const GAME_ID = "cribbage";
  const GAME_VERSION = "v17";
  const INTERFACE_VERSION = "6";
  const SESSION_START_KEY = "weightplay.cribbage.analytics.starts.v17";
  const LOCALE_MAP = {
    en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko",
    es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar",
  };
  const LOCALES = new Set(Object.values(LOCALE_MAP));
  let inputType = "unknown";
  let sessionStarts = readSessionStarts();
  let currentRun = { session_segment: sessionStarts ? "repeat" : "first", session_start_index: Math.min(99, sessionStarts || 1) };
  let resultVisible = Boolean(document.querySelector("#resultOverlay:not([hidden])"));

  function readSessionStarts() {
    try {
      const value = Number.parseInt(sessionStorage.getItem(SESSION_START_KEY) || "0", 10);
      return Number.isFinite(value) ? Math.max(0, Math.min(99, value)) : 0;
    } catch {
      return 0;
    }
  }

  function rememberSessionStart() {
    sessionStarts = Math.min(99, sessionStarts + 1);
    try { sessionStorage.setItem(SESSION_START_KEY, String(sessionStarts)); } catch { /* Analytics must never interrupt play. */ }
    currentRun = { session_segment: sessionStarts === 1 ? "first" : "repeat", session_start_index: sessionStarts };
    return currentRun;
  }

  const locale = () => {
    const actual = window.WonderI18n?.actualLocale?.();
    if (LOCALES.has(actual)) return actual;
    return LOCALE_MAP[window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase()] || document.documentElement.lang || "en";
  };

  const viewportBucket = () => {
    const width = Math.max(1, window.innerWidth || document.documentElement.clientWidth || 1);
    const height = Math.max(1, window.innerHeight || document.documentElement.clientHeight || 1);
    if (height <= 430) return "short-landscape";
    if (width <= 480) return "phone";
    if (width <= 900) return height > width ? "tablet-portrait" : "tablet-landscape";
    return height > width ? "desktop-portrait" : "desktop-landscape";
  };

  const screen = () => {
    if (!document.querySelector("#resultOverlay")?.hidden) return "result";
    if (!document.querySelector("#battleScreen")?.hidden) return "battle";
    return "main";
  };

  const phase = () => {
    const currentScreen = screen();
    if (currentScreen === "result") return "result";
    if (currentScreen !== "battle") return "main";
    return document.querySelector('#cardGameActions [data-action="send-crib"]') ? "crib_selection" : "pegging";
  };

  const track = (event, details = {}) => {
    try {
      window.WonderAnalytics?.track?.(event, {
        game_id: GAME_ID,
        game_version: GAME_VERSION,
        interface_version: INTERFACE_VERSION,
        locale: locale(),
        viewport_bucket: viewportBucket(),
        input_type: details.input_type || inputType,
        session_segment: details.session_segment || currentRun.session_segment,
        session_start_index: details.session_start_index || currentRun.session_start_index,
        screen: screen(),
        phase: phase(),
        ...details,
      });
    } catch {
      // Measurement must never interrupt card play or navigation.
    }
  };

  const rememberInput = (event) => {
    if (event?.pointerType === "touch") inputType = "touch";
    else if (event?.pointerType === "mouse") inputType = "mouse";
    else if (event?.pointerType) inputType = "pointer";
    else if (event?.type === "keydown") inputType = "keyboard";
  };

  const startFromMain = (event, from) => {
    const run = rememberSessionStart();
    track(event, { from, ...run });
  };

  const continueFromResult = (event) => {
    track(event, { from: "result" });
    rememberSessionStart();
  };

  document.addEventListener("pointerdown", rememberInput, true);
  document.addEventListener("keydown", rememberInput, true);
  document.addEventListener("click", (event) => {
    const target = event.target?.closest?.("button, .main-return");
    if (!target || target.disabled || target.hidden) return;
    rememberInput(event);
    if (target.matches("#startBtn")) { startFromMain("game_start", "main"); return; }
    if (target.matches("#restartBtn")) { startFromMain("restart", "main"); return; }
    if (target.matches("#newGameBtn")) { startFromMain("new_game", "main"); return; }
    if (target.matches("#resultRestart")) { continueFromResult("restart"); return; }
    if (target.matches("#resultNewGame")) { continueFromResult("new_game"); return; }
    if (target.matches("#battleBackBtn, .main-return")) track("main_return", { from: target.matches(".main-return") ? "main" : "battle" });
  }, true);

  const observeResult = () => {
    const result = document.querySelector("#resultOverlay");
    if (!result) return;
    resultVisible = !result.hidden;
    new MutationObserver(() => {
      const visible = !result.hidden;
      if (visible && !resultVisible) {
        resultVisible = true;
        const scores = (document.querySelector("#resultText")?.textContent || "").match(/(\d+)\s*\/\s*(\d+)/u);
        const details = {
          from: "battle",
          outcome: result.dataset.outcome || "unknown",
          mastery_target_visible: document.querySelector("#resultText")?.dataset.cribbageResultMastery === "true",
        };
        if (scores) { details.player_score = Number(scores[1]); details.opponent_score = Number(scores[2]); }
        track("round_result", details);
      } else if (!visible) resultVisible = false;
    }).observe(result, { attributes: true, attributeFilter: ["hidden"] });
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", observeResult, { once: true });
  else observeResult();
})();
