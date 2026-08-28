(() => {
  "use strict";

  if (window.__weightplayTriPeaksAnalyticsInstalled) return;
  window.__weightplayTriPeaksAnalyticsInstalled = true;

  const GAME_ID = "tripeaks-solitaire";
  const GAME_VERSION = "v21";
  const INTERFACE_VERSION = "6";
  const LOCALES = new Set(["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"]);
  const EVENTS = new Set(["game_start", "round_start", "card_move", "peak_clear", "stock_draw", "stock_exhausted", "hint", "undo", "result", "result_action", "restart", "new_game", "main_return", "locale_change", "return_session"]);
  const FROM_VALUES = new Set(["main", "battle", "result", "lifecycle"]);
  const OUTCOMES = new Set(["started", "moved", "peak", "drawn", "exhausted", "success", "failure", "restart", "new_game", "returned", "visible"]);
  const STOCK_BUCKETS = new Set(["empty", "low", "mid", "high", "unknown"]);
  const PEAK_BUCKETS = new Set(["0", "1", "2", "3", "unknown"]);
  const CHAIN_BUCKETS = new Set(["none", "short", "long", "unknown"]);
  const INPUT_TYPES = new Set(["mouse", "touch", "pen", "keyboard", "unknown"]);
  let inputType = "unknown";
  let resultVisible = false;
  let lastMoveCount = 0;
  let lastStockCount = null;
  let lastStatusSignature = "";

  const locale = () => {
    const value = window.WonderI18n?.actualLocale?.() || document.documentElement.lang || "en";
    return LOCALES.has(value) ? value : "en";
  };

  const screen = () => {
    if (!document.querySelector("#resultOverlay")?.hidden) return "result";
    if (!document.querySelector("#battleScreen")?.hidden) return "battle";
    return "main";
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

  const bucket = (value, thresholds) => {
    if (!Number.isFinite(value)) return "unknown";
    if (value <= thresholds[0]) return "empty";
    if (value <= thresholds[1]) return "low";
    if (value <= thresholds[2]) return "mid";
    return "high";
  };

  const stockBucket = () => {
    const value = Number(document.querySelector("#stockPile b")?.textContent);
    return bucket(value, [0, 5, 15]);
  };

  const peakBucket = () => {
    const value = document.querySelector("#tripeaksPeakProgressValue")?.textContent?.split("/")[0];
    return PEAK_BUCKETS.has(value) ? value : "unknown";
  };

  const chainBucket = () => {
    const value = Number(document.querySelector("#comboValue")?.textContent?.replace(/[^0-9]/gu, ""));
    if (!Number.isFinite(value) || value <= 0) return "none";
    return value >= 4 ? "long" : "short";
  };

  const track = (event, details = {}) => {
    if (!EVENTS.has(event)) return;
    try {
      window.WonderAnalytics?.track?.(event, {
        game_id: GAME_ID,
        game_version: GAME_VERSION,
        interface_version: INTERFACE_VERSION,
        locale: locale(),
        viewport_bucket: viewportBucket(),
        input_type: allowed(details.input_type || inputType, INPUT_TYPES),
        from: allowed(details.from, FROM_VALUES),
        outcome: allowed(details.outcome, OUTCOMES),
        stock_bucket: allowed(details.stock_bucket || stockBucket(), STOCK_BUCKETS),
        peak_bucket: allowed(details.peak_bucket || peakBucket(), PEAK_BUCKETS),
        chain_bucket: allowed(details.chain_bucket || chainBucket(), CHAIN_BUCKETS),
        ...details,
      });
    } catch {
      // Measurement must never interrupt the classic TriPeaks loop.
    }
  };

  const eventInput = (event) => event?.detail === 0 ? "keyboard" : inputType;
  const rememberInput = (event) => {
    if (event?.pointerType === "touch") inputType = "touch";
    else if (event?.pointerType === "mouse") inputType = "mouse";
    else if (event?.pointerType === "pen") inputType = "pen";
    else if (event?.type === "keydown") inputType = "keyboard";
  };

  document.addEventListener("pointerdown", rememberInput, true);
  document.addEventListener("keydown", rememberInput, true);
  document.addEventListener("change", (event) => {
    if (!event.target?.matches?.("#localeSelect")) return;
    const to_locale = event.target.value;
    if (!LOCALES.has(to_locale)) return;
    track("locale_change", { from: screen(), from_locale: locale(), to_locale, locale: to_locale, input_type: eventInput(event) });
  }, true);

  document.addEventListener("click", (event) => {
    const target = event.target?.closest?.("button");
    if (!target || target.disabled || target.hidden) return;
    const input_type = eventInput(event);
    if (target.matches("#startBtn")) {
      track("game_start", { from: "main", outcome: "started", input_type });
      track("round_start", { from: "main", outcome: "started", input_type });
    } else if (target.matches("#restartBtn, #battleRestartBtn, #resultRestart")) {
      const from = target.matches("#resultRestart") ? "result" : target.matches("#restartBtn") ? "main" : "battle";
      if (from === "result") track("result_action", { from, outcome: "restart", input_type });
      track("restart", { from, outcome: "restart", input_type });
      track("round_start", { from, outcome: "started", input_type });
    } else if (target.matches("#newGameBtn, #battleNewBtn, #resultNewGame")) {
      const from = target.matches("#resultNewGame") ? "result" : target.matches("#newGameBtn") ? "main" : "battle";
      if (from === "result") track("result_action", { from, outcome: "new_game", input_type });
      track("new_game", { from, outcome: "new_game", input_type });
      track("round_start", { from, outcome: "started", input_type });
    } else if (target.matches("#resultClose, #battleBackBtn")) {
      const from = target.matches("#resultClose") ? "result" : "battle";
      if (from === "result") track("result_action", { from, outcome: "returned", input_type });
      track("main_return", { from, outcome: "returned", input_type });
    } else if (target.matches("#hintBtn")) {
      track("hint", { from: "battle", outcome: "moved", input_type });
    } else if (target.matches("#undoBtn")) {
      track("undo", { from: "battle", outcome: "moved", input_type });
    }
  }, true);

  const moveCount = document.querySelector("#moveCount");
  if (moveCount) new MutationObserver(() => {
    const value = Number(moveCount.textContent);
    if (!Number.isFinite(value) || screen() !== "battle") return;
    if (value < lastMoveCount) {
      lastMoveCount = value;
      return;
    }
    if (value === lastMoveCount) return;
    lastMoveCount = value;
    track("card_move", { from: "battle", outcome: "moved", move_count: Math.min(200, Math.floor(value)) });
  }).observe(moveCount, { childList: true, characterData: true, subtree: true });

  const stock = document.querySelector("#stockPile");
  if (stock) new MutationObserver(() => {
    const value = Number(stock.querySelector("b")?.textContent);
    if (!Number.isFinite(value)) return;
    if (lastStockCount !== null && value < lastStockCount) track("stock_draw", { from: "battle", outcome: "drawn" });
    if (value === 0 && lastStockCount > 0) track("stock_exhausted", { from: "battle", outcome: "exhausted", stock_bucket: "empty" });
    lastStockCount = value;
  }).observe(stock, { childList: true, characterData: true, subtree: true });

  const status = document.querySelector("#boardStatus");
  if (status) new MutationObserver(() => {
    const signature = `${status.dataset.state || ""}:${status.textContent.trim()}`;
    if (signature !== lastStatusSignature && status.dataset.state === "peak") track("peak_clear", { from: "battle", outcome: "peak" });
    lastStatusSignature = signature;
  }).observe(status, { attributes: true, childList: true, characterData: true, subtree: true });

  const result = document.querySelector("#resultOverlay");
  if (result) new MutationObserver(() => {
    const visible = !result.hidden;
    if (visible && !resultVisible) {
      resultVisible = true;
      track("result", { from: "battle", outcome: result.dataset.outcome || "unknown" });
    } else if (!visible) {
      resultVisible = false;
      lastMoveCount = 0;
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
      track("return_session", { from: "lifecycle", outcome: "visible" });
    }
  });
})();
