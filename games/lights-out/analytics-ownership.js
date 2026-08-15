(() => {
  "use strict";

  const GAME_ID = "lights-out";
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
    return pathLocale || document.documentElement.lang || "en";
  };

  const bounded = (value, max = 25) => Math.max(0, Math.min(max, Number(value) || 0));
  const moves = () => Number.parseInt(document.querySelector(".logic-live")?.textContent?.replace(/[^0-9]/gu, "") || "0", 10) || 0;
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
      // Measurement must never interrupt the puzzle loop.
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

    if (target.matches("#startButton")) {
      track("game_start", { from: "main", input_type });
      return;
    }
    if (target.matches("#logicHint")) {
      track("hint_view", { from: "battle", input_type });
      return;
    }
    if (target.matches(".logic-lights-board .logic-cell")) {
      if (target.classList.contains("is-hint")) track("hint_cell_press", { from: "battle", input_type });
      track("legal_move", { move_number: bounded(moves() + 1), from: "battle", input_type });
      return;
    }
    if (target.matches("#logicUndo")) {
      track("undo", { from: "battle", input_type });
      return;
    }
    if (target.matches("#logicReset")) {
      track("new_puzzle", { from: "battle", input_type });
      return;
    }
    if (target.matches("#resultReplay, #resultMenu, #resultClose")) {
      const action = target.id === "resultReplay" ? "replay" : target.id === "resultMenu" ? "menu" : "close";
      track("result_action", { action, from: "result", input_type });
    }
  }, true);

  const result = document.querySelector("#logicResult");
  if (result) new MutationObserver(() => {
    if (!result.hidden && !resultVisible) {
      resultVisible = true;
      track("result_solved", { outcome: "success", from: "battle" });
    } else if (result.hidden) {
      resultVisible = false;
    }
  }).observe(result, { attributes: true, attributeFilter: ["hidden"] });
})();
