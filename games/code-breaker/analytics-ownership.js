(() => {
  "use strict";

  const GAME_ID = "code-breaker";
  const GAME_VERSION = "v3";
  const INTERFACE_VERSION = "6";
  const EVENTS = new Set([
    "preview_open",
    "game_start",
    "guess_submit",
    "next_guess_view",
    "hint",
    "hint_slot_filled",
    "result",
    "replay",
    "main_return",
    "return_session",
  ]);
  const LOCALES = new Set(["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"]);
  const INPUT_TYPES = new Set(["mouse", "touch", "pen", "keyboard", "unknown"]);
  const FROM_VALUES = new Set(["preview", "main", "battle", "result", "lifecycle", "unknown"]);
  const LOCALE_MAP = {
    "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es",
    "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar",
  };
  let inputType = "unknown";
  let sessionStarted = false;
  let resultVisible = false;
  let wasHidden = false;

  const locale = () => {
    const value = window.WonderI18n?.actualLocale?.() || LOCALE_MAP[window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase()] || document.documentElement.lang || "en";
    return LOCALES.has(value) ? value : "en";
  };

  const viewportBucket = () => {
    const width = Math.max(1, window.innerWidth || document.documentElement.clientWidth || 1);
    const height = Math.max(1, window.innerHeight || document.documentElement.clientHeight || 1);
    if (height <= 430) return "short-landscape";
    if (width <= 480) return "phone";
    if (width <= 900) return height > width ? "tablet-portrait" : "tablet-landscape";
    return height > width ? "desktop-portrait" : "desktop-landscape";
  };

  const bounded = (value, max = 10) => Math.max(0, Math.min(max, Number(value) || 0));
  const allowed = (value, values) => {
    const normalized = String(value || "unknown");
    return values.has(normalized) ? normalized : "unknown";
  };
  const state = () => ({
    history: document.querySelectorAll(".logic-code-board .logic-guess-row").length,
    filled: [...document.querySelectorAll(".logic-code-slots .logic-code-slot")].filter((slot) => slot.dataset.color !== "").length,
  });
  const eventInput = (event) => event?.detail === 0 ? "keyboard" : inputType;

  const track = (name, details = {}) => {
    if (!EVENTS.has(name)) return;
    try {
      const snapshot = state();
      window.WonderAnalytics?.track?.(name, {
        game_id: GAME_ID,
        game_version: GAME_VERSION,
        interface_version: INTERFACE_VERSION,
        locale: locale(),
        viewport_bucket: viewportBucket(),
        input_type: allowed(details.input_type, INPUT_TYPES),
        from: allowed(details.from, FROM_VALUES),
        guess_count: bounded(snapshot.history),
        filled_slots: bounded(snapshot.filled, 4),
      });
    } catch {
      // Measurement must never interrupt the deduction loop.
    }
  };

  const rememberInput = (event) => {
    if (event?.pointerType === "touch") inputType = "touch";
    else if (event?.pointerType === "mouse") inputType = "mouse";
    else if (event?.pointerType === "pen") inputType = "pen";
    else if (event?.type === "keydown") inputType = "keyboard";
  };

  if (document.body.dataset.logicGame !== GAME_ID) return;

  document.body.dataset.gameVersion = GAME_VERSION;
  document.body.dataset.interfaceVersion = INTERFACE_VERSION;
  document.addEventListener("pointerdown", rememberInput, true);
  document.addEventListener("keydown", rememberInput, true);
  document.addEventListener("click", (event) => {
    rememberInput(event);
    const target = event.target?.closest?.("button");
    if (!target || target.disabled || target.hidden) return;
    const input_type = eventInput(event);

    if (target.matches("#startButton")) {
      sessionStarted = true;
      track("game_start", { from: "main", input_type });
      return;
    }
    if (target.matches("#logicHint")) {
      const before = state();
      track("hint", { from: "battle", input_type });
      requestAnimationFrame(() => {
        if (state().filled > before.filled) track("hint_slot_filled", { from: "battle", input_type });
      });
      return;
    }
    if (target.matches(".logic-code-board .logic-primary")) {
      const before = state();
      track("guess_submit", { from: "battle", input_type });
      requestAnimationFrame(() => {
        const after = state();
        if (!resultVisible && after.history > before.history) track("next_guess_view", { from: "battle", input_type });
      });
      return;
    }
    if (target.matches("#resultReplay")) {
      track("replay", { from: "result", input_type });
      sessionStarted = true;
      return;
    }
    if (target.matches("#battleBack, #resultMenu")) {
      const from = target.id === "resultMenu" ? "result" : "battle";
      track("main_return", { from, input_type });
      if (sessionStarted) {
        track("return_session", { from, input_type });
        sessionStarted = false;
      }
      return;
    }
  }, true);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      wasHidden = true;
      return;
    }
    if (document.visibilityState === "visible" && wasHidden) {
      wasHidden = false;
      if (sessionStarted) track("return_session", { from: "lifecycle", input_type: inputType });
    }
  });

  const result = document.querySelector("#logicResult");
  if (result) new MutationObserver(() => {
    if (!result.hidden && !resultVisible) {
      resultVisible = true;
      track("result", { from: "battle" });
    } else if (result.hidden) {
      resultVisible = false;
    }
  }).observe(result, { attributes: true, attributeFilter: ["hidden"] });

  track("preview_open", { from: "preview" });
})();
