(() => {
  "use strict";

  if (window.__weightplayBreakoutAnalyticsInstalled) return;
  window.__weightplayBreakoutAnalyticsInstalled = true;

  const GAME_ID = "breakout";
  const GAME_VERSION = "v15";
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
  let inputType = "unknown";
  let roundActive = false;
  let firstServeTracked = false;
  let firstBrickTracked = false;
  let resultVisible = false;

  const viewportBucket = () => {
    const width = Math.max(1, window.innerWidth || document.documentElement.clientWidth || 1);
    const height = Math.max(1, window.innerHeight || document.documentElement.clientHeight || 1);
    if (height <= 430) return "short-landscape";
    if (width <= 480) return "phone";
    if (width <= 900) return height > width ? "tablet-portrait" : "tablet-landscape";
    return height > width ? "desktop-portrait" : "desktop-landscape";
  };

  const locale = () => {
    const actual = window.WonderI18n?.actualLocale?.();
    if (LOCALES.has(actual)) return actual;
    const segment = window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
    return LOCALE_MAP[segment] || document.documentElement.lang || "en";
  };

  const screen = () => {
    if (!document.querySelector("#resultScreen")?.hidden) return "result";
    if (!document.querySelector("#battleScreen")?.hidden) return "battle";
    return "main";
  };

  const phase = () => {
    const currentScreen = screen();
    if (currentScreen === "result") return "result";
    if (currentScreen !== "battle") return "main";
    return document.querySelector('[data-shot-target="true"]') ? "aim" : "route_cue";
  };

  const track = (name, details = {}) => {
    try {
      window.WonderAnalytics?.track?.(name, {
        game_id: GAME_ID,
        game_version: GAME_VERSION,
        interface_version: INTERFACE_VERSION,
        locale: locale(),
        viewport_bucket: viewportBucket(),
        input_type: details.input_type || inputType,
        screen: screen(),
        phase: phase(),
        ...details,
      });
    } catch {
      // Measurement must never interrupt the owner-preview game.
    }
  };

  const rememberInput = (event) => {
    if (event?.pointerType === "touch") inputType = "touch";
    else if (event?.pointerType === "mouse") inputType = "mouse";
    else if (event?.pointerType) inputType = "pointer";
    else if (event?.type === "keydown") inputType = "keyboard";
  };

  const actionInput = (event) => event?.detail === 0 ? "keyboard" : inputType;
  const shotCount = () => Number(document.querySelector(".brick-board")?.dataset.shotCount || 0);
  const remainingBricks = () => document.querySelectorAll("#board .brick:not(.cleared)").length;
  const beginRound = () => {
    roundActive = true;
    firstServeTracked = false;
    firstBrickTracked = false;
  };
  const noteFirstBrick = () => {
    if (!roundActive || firstBrickTracked || remainingBricks() >= 12) return;
    firstBrickTracked = true;
    track("breakout_first_brick_clear", {
      from: "battle",
      shot_number: Math.max(1, shotCount()),
      cleared_bricks: 1,
    });
  };

  document.addEventListener("pointerdown", rememberInput, true);
  document.addEventListener("keydown", rememberInput, true);

  document.addEventListener("click", (event) => {
    const target = event.target?.closest?.("button");
    if (!target || target.disabled || target.hidden) return;
    const input_type = actionInput(event);

    if (target.matches("#startBtn")) {
      beginRound();
      track("breakout_game_start", { from: "main", entry: "start", input_type });
      return;
    }
    if (target.matches("#retryBtn")) {
      track("breakout_play_again", { from: "result", input_type });
      beginRound();
      track("breakout_game_start", { from: "result", entry: "play_again", input_type });
      return;
    }
    if (target.matches("#restartBtn")) {
      beginRound();
      track("breakout_game_start", { from: "battle", entry: "restart", input_type });
      return;
    }
    if (target.matches("#homeBtn, #battleBackBtn")) {
      roundActive = false;
      track("breakout_return_main", { from: target.id === "homeBtn" ? "result" : "battle", input_type });
      return;
    }
    if (!target.matches('[data-action="fire"]') || !roundActive) return;
    if (!firstServeTracked) {
      firstServeTracked = true;
      track("breakout_first_serve", { from: "battle", shot_number: 1, input_type });
    }
    window.requestAnimationFrame(noteFirstBrick);
  }, true);

  const board = document.querySelector("#board");
  if (board) {
    new MutationObserver(() => window.requestAnimationFrame(noteFirstBrick))
      .observe(board, { childList: true, subtree: true });
  }

  const result = document.querySelector("#resultScreen");
  if (result) {
    new MutationObserver(() => {
      const visible = !result.hidden;
      if (visible && !resultVisible) {
        resultVisible = true;
        track("breakout_result", { from: "battle", outcome: result.dataset.outcome || "success" });
      } else if (!visible) {
        resultVisible = false;
      }
    }).observe(result, { attributes: true, attributeFilter: ["hidden", "data-outcome"] });
  }
})();
