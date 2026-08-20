(() => {
  "use strict";

  const GAME_ID = "animal-frost-maze";
  const GAME_VERSION = "v4";
  const INTERFACE_VERSION = "6";
  const EVENTS = new Set([
    "preview_open",
    "game_start",
    "battle_open",
    "role_scan",
    "first_move",
    "first_edit",
    "berry_collected",
    "result",
    "retry",
    "main_return",
    "return_session",
  ]);
  const LOCALES = new Set(["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"]);
  const INPUT_TYPES = new Set(["mouse", "touch", "pen", "keyboard", "unknown"]);
  const FROM_VALUES = new Set(["preview", "main", "stage", "battle", "result", "lifecycle", "unknown"]);
  const LOCALE_MAP = {
    "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es",
    "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar",
  };
  const ROLE_VALUES = new Set(["nori", "berry", "drifter", "breakable_ice"]);
  let inputType = "unknown";
  let sessionStarted = false;
  let battleOpened = false;
  let roleScanSent = false;
  let firstMoveSent = false;
  let firstEditSent = false;
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
  const eventInput = (event) => event?.detail === 0 ? "keyboard" : inputType;

  const track = (name, details = {}) => {
    if (!EVENTS.has(name)) return;
    try {
      window.WonderAnalytics?.track?.(name, {
        game_id: GAME_ID,
        game_version: GAME_VERSION,
        interface_version: INTERFACE_VERSION,
        locale: locale(),
        viewport_bucket: viewportBucket(),
        input_type: allowed(details.input_type, INPUT_TYPES),
        from: allowed(details.from, FROM_VALUES),
        role: ROLE_VALUES.has(details.role) ? details.role : undefined,
        action: String(details.action || "unknown").slice(0, 24),
        collected_count: bounded(details.collected_count, 10),
        remaining_berries: bounded(details.remaining_berries, 10),
      });
    } catch {
      // Measurement must never interrupt the rescue loop.
    }
  };

  const record = (name, details = {}) => {
    if (name === "first_move") {
      if (firstMoveSent) return;
      firstMoveSent = true;
    }
    if (name === "first_edit") {
      if (firstEditSent) return;
      firstEditSent = true;
    }
    track(name, { from: "battle", input_type: inputType, ...details });
  };

  const rememberInput = (event) => {
    if (event?.pointerType === "touch") inputType = "touch";
    else if (event?.pointerType === "mouse") inputType = "mouse";
    else if (event?.pointerType === "pen") inputType = "pen";
    else if (event?.type === "keydown") inputType = "keyboard";
  };

  if (document.body.dataset.wpFiveGame !== GAME_ID && document.body.dataset.wpGameId !== GAME_ID) return;

  document.body.dataset.gameVersion = GAME_VERSION;
  document.body.dataset.interfaceVersion = INTERFACE_VERSION;
  document.addEventListener("pointerdown", rememberInput, true);
  document.addEventListener("keydown", rememberInput, true);
  window.__wpFrostAnalytics = { record };

  document.addEventListener("click", (event) => {
    rememberInput(event);
    const target = event.target?.closest?.("button, a");
    if (!target || target.hidden) return;
    const input_type = eventInput(event);

    if (target.matches("#start-game")) {
      sessionStarted = true;
      track("game_start", { from: "main", input_type });
      return;
    }
    if (target.matches("#stage-list [data-chapter]")) {
      sessionStarted = true;
      requestAnimationFrame(() => {
        battleOpened = true;
        track("battle_open", { from: "stage", input_type });
        if (!roleScanSent) {
          roleScanSent = true;
          ["nori", "berry", "drifter", "breakable_ice"].forEach((role) => track("role_scan", { from: "battle", input_type, role }));
        }
      });
      return;
    }
    if (target.matches("#retry")) {
      track("retry", { from: "result", input_type });
      return;
    }
    if (target.matches(".main-return, [data-back='main']")) {
      track("main_return", { from: target.matches(".main-return") ? "main" : "stage", input_type });
      if (sessionStarted) {
        track("return_session", { from: "stage", input_type });
        sessionStarted = false;
      }
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

  const result = document.querySelector("#result-screen");
  if (result) new MutationObserver(() => {
    if (!result.hidden && !resultVisible) {
      resultVisible = true;
      track("result", { from: "battle", input_type: inputType });
    } else if (result.hidden) {
      resultVisible = false;
    }
  }).observe(result, { attributes: true, attributeFilter: ["hidden"] });

  track("preview_open", { from: "preview" });
})();
