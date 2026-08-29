(() => {
  "use strict";

  const GAME_ID = "reversi";
  const GAME_VERSION = "v11";
  const INTERFACE_VERSION = "6";
  const EVENTS = new Set([
    "preview_open",
    "game_start",
    "difficulty_select",
    "legal_move",
    "ai_reply",
    "pass",
    "result",
    "replay",
    "new_game",
    "main_return",
    "return_session",
  ]);
  const LOCALES = new Set(["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"]);
  const INPUT_TYPES = new Set(["mouse", "touch", "pen", "keyboard", "unknown"]);
  const FROM_VALUES = new Set(["preview", "main", "battle", "result", "lifecycle", "unknown"]);
  const DIFFICULTIES = new Set(["easy", "medium", "hard", "unknown"]);
  const LOCALE_MAP = {
    "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es",
    "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar",
  };
  let inputType = "unknown";
  let sessionStarted = false;
  let resultVisible = false;
  let wasHidden = false;
  let lastReplyToken = "";
  let passSentForState = "";
  let stateObserversInstalled = false;

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

  const allowed = (value, values) => {
    const normalized = String(value || "unknown");
    return values.has(normalized) ? normalized : "unknown";
  };

  const difficulty = () => allowed(document.querySelector(".logic-board-toolbar .logic-select")?.value, DIFFICULTIES);
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
        difficulty: difficulty(),
      });
    } catch {
      // Measurement must never interrupt the board loop.
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
      setTimeout(installStateObservers, 0);
      return;
    }
    if (target.matches(".logic-reversi-board .logic-cell.legal")) {
      sessionStarted = true;
      track("legal_move", { from: "battle", input_type });
      return;
    }
    if (target.matches("#logicReset")) {
      track("new_game", { from: "battle", input_type });
      return;
    }
    if (target.matches("#resultReplay")) {
      track("replay", { from: "result", input_type });
      sessionStarted = true;
      lastReplyToken = "";
      passSentForState = "";
      return;
    }
    if (target.matches("#battleBack, #resultMenu")) {
      const from = target.id === "resultMenu" ? "result" : "battle";
      track("main_return", { from, input_type });
      if (sessionStarted) {
        track("return_session", { from, input_type });
        sessionStarted = false;
      }
    }
  }, true);

  document.addEventListener("change", (event) => {
    rememberInput(event);
    const target = event.target?.closest?.(".logic-board-toolbar .logic-select");
    if (target && sessionStarted) track("difficulty_select", { from: "battle", input_type: eventInput(event) });
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
      passSentForState = "";
    }
  }).observe(result, { attributes: true, attributeFilter: ["hidden"] });

  function installStateObservers() {
    if (stateObserversInstalled) return;
    const reply = document.querySelector(".logic-reversi-reply");
    const board = document.querySelector(".logic-reversi-board");
    if (!reply || !board) return;
    stateObserversInstalled = true;
    const observeReply = () => {
      if (!sessionStarted) return;
      const choice = reply.dataset.aiChoice;
      const text = reply.textContent?.trim() || "";
      if (!choice || !text) return;
      const token = `${choice}:${reply.dataset.aiCaptures || "unknown"}:${text}`;
      if (token === lastReplyToken) return;
      lastReplyToken = token;
      track("ai_reply", { from: "battle" });
      setTimeout(() => {
        if (resultVisible || !sessionStarted) return;
        const legalCount = board.querySelectorAll(".logic-cell.legal").length;
        if (legalCount === 0 && passSentForState !== token) {
          passSentForState = token;
          track("pass", { from: "battle" });
        }
      }, 40);
    };
    new MutationObserver(observeReply).observe(reply, { subtree: true, childList: true, characterData: true, attributes: true });
  }

  track("preview_open", { from: "preview" });
})();
