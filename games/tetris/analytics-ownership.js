(() => {
  "use strict";

  if (window.__weightplayTetrisAnalyticsInstalled) return;
  window.__weightplayTetrisAnalyticsInstalled = true;

  const GAME_ID = "tetris";
  const GAME_VERSION = "v14";
  const INTERFACE_VERSION = "7";
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
  const ACTIONS = new Set(["left", "right", "rotate", "drop"]);
  let inputType = "unknown";
  let resultVisible = false;
  let lastProgressSignature = "";

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
    const pathLocale = LOCALE_MAP[window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase()];
    return pathLocale || document.documentElement.lang || "en";
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
    const messageKey = document.querySelector("#gameMessage")?.dataset.messageKey;
    if (messageKey === "tetrisHint") return "hint";
    if (messageKey === "tetrisLineClear") return "line_clear";
    return "drop_loop";
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
      // Measurement must never interrupt the short Tetris loop.
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
    const input_type = event.detail === 0 ? "keyboard" : inputType;

    if (target.matches("#startBtn")) {
      track("game_start", { from: "main", entry: "start", input_type });
      track("round_start", { from: "main", entry: "start", input_type });
      return;
    }
    if (target.matches("#restartBtn")) {
      track("restart", { from: "battle", input_type });
      track("round_start", { from: "battle", entry: "restart", input_type });
      return;
    }
    if (target.matches("#hintBtn")) {
      track("hint", { from: "battle", input_type });
      return;
    }
    if (target.matches("#retryBtn")) {
      track("result_action", { action: "play_again", from: "result", input_type });
      track("round_start", { from: "result", entry: "retry", input_type });
      return;
    }
    if (target.matches("#homeBtn")) {
      track("result_action", { action: "back_main", from: "result", input_type });
      track("return_main", { from: "result", input_type });
      return;
    }
    if (target.matches('[data-action]')) {
      const action = target.dataset.action;
      if (ACTIONS.has(action)) track("control_action", { action, from: "battle", input_type });
    }
  }, true);

  document.addEventListener("keydown", (event) => {
    if (screen() !== "battle") return;
    const focusedControl = document.activeElement?.closest?.("button[data-action]");
    if (event.key === " " && focusedControl) return;
    const action = event.key === "ArrowLeft" || event.key === "a" || event.key === "A"
      ? "left"
      : event.key === "ArrowRight" || event.key === "d" || event.key === "D"
        ? "right"
        : event.key === " " ? "drop" : "";
    if (action) track("control_action", { action, from: "battle", input_type: "keyboard" });
  }, true);

  document.addEventListener("change", (event) => {
    if (!event.target?.matches?.("#localeSelect")) return;
    const selectedLocale = event.target.value;
    if (LOCALES.has(selectedLocale)) track("locale_change", { from: screen(), to_locale: selectedLocale });
  }, true);

  const message = document.querySelector("#gameMessage");
  if (message) new MutationObserver(() => {
    const messageKey = message.dataset.messageKey || "";
    const signature = `${messageKey}:${message.textContent.trim()}`;
    if (messageKey === "tetrisLineClear" && signature !== lastProgressSignature) {
      track("line_clear", { from: "battle", clear_kind: "progress" });
    }
    lastProgressSignature = signature;
  }).observe(message, { attributes: true, attributeFilter: ["data-message-key"], childList: true, characterData: true, subtree: true });

  const result = document.querySelector("#resultScreen");
  if (result) new MutationObserver(() => {
    const visible = !result.hidden;
    if (visible && !resultVisible) {
      resultVisible = true;
      track("result", { from: "battle", outcome: result.dataset.outcome || "success" });
    } else if (!visible) {
      resultVisible = false;
    }
  }).observe(result, { attributes: true, attributeFilter: ["hidden", "data-outcome"] });

  let wasHidden = false;
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      wasHidden = true;
      return;
    }
    if (document.visibilityState === "visible" && wasHidden) {
      wasHidden = false;
      track("return_session", { from: "lifecycle" });
    }
  });
})();
