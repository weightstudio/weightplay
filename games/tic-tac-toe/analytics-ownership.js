(() => {
  "use strict";

  const GAME_ID = "tic-tac-toe";
  const GAME_VERSION = "v4";
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
  let inputType = "unknown";
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
    if (actual) return actual;
    const pathLocale = LOCALE_MAP[window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase()];
    if (pathLocale) return pathLocale;
    return document.documentElement.lang || "en";
  };

  const bounded = (value, max = 99) => Math.max(0, Math.min(max, Number(value) || 0));
  const legalMoveNumber = () => Math.min(3, Math.floor(document.querySelectorAll(".tic-cell:disabled").length / 2) + 1);
  const eventInput = (event) => event?.detail === 0 ? "keyboard" : inputType;

  const track = (name, details = {}) => {
    try {
      window.WonderAnalytics?.track?.(name, {
        game_id: GAME_ID,
        game_version: GAME_VERSION,
        interface_version: INTERFACE_VERSION,
        locale: locale(),
        viewport_bucket: viewportBucket(),
        input_type: details.input_type || inputType,
        ...details,
      });
    } catch {
      // Measurement must never interrupt the Tic-Tac-Toe loop.
    }
  };

  const rememberInput = (event) => {
    if (event?.pointerType === "touch") inputType = "touch";
    else if (event?.pointerType === "mouse") inputType = "mouse";
    else if (event?.pointerType) inputType = "pointer";
    else if (event?.type === "keydown") inputType = "keyboard";
  };

  document.addEventListener("pointerdown", rememberInput, true);
  document.addEventListener("keydown", rememberInput, true);
  document.addEventListener("click", (event) => {
    const target = event.target?.closest?.("button");
    if (!target || target.disabled || target.hidden) return;
    const input_type = eventInput(event);

    if (target.matches("#startBtn")) {
      track("game_start", { from: "main", input_type });
      track("round_start", { from: "main", input_type });
      return;
    }
    if (target.matches("#hintBtn")) {
      track("hint", { from: "battle", input_type });
      return;
    }
    if (target.matches("#restartBtn")) {
      track("restart", { from: "battle", input_type });
      track("round_start", { from: "restart", input_type });
      return;
    }
    if (target.matches("#retryBtn")) {
      track("result_action", { action: "play_again", from: "result", input_type });
      track("round_start", { from: "result", input_type });
      return;
    }
    if (target.matches("#homeBtn")) {
      track("result_action", { action: "back_main", from: "result", input_type });
      track("return_main", { from: "result", input_type });
      return;
    }
    if (target.matches(".tic-cell") && !target.disabled) {
      track("legal_move", { move_number: bounded(legalMoveNumber(), 3), from: "battle", input_type });
    }
  }, true);

  const result = document.querySelector("#resultScreen");
  if (result) new MutationObserver(() => {
    if (!result.hidden && !resultVisible) {
      resultVisible = true;
      track("result_success", { outcome: "success", from: "battle" });
    } else if (result.hidden) {
      resultVisible = false;
    }
  }).observe(result, { attributes: true, attributeFilter: ["hidden"] });
})();
