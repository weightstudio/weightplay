(() => {
  const GAME_ID = "klondike-solitaire";
  const GAME_VERSION = "v36";
  const INTERFACE_VERSION = "6";
  const EVENT_NAME = "wp-klondike-analytics";
  const LOCALES = new Set(["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"]);
  const EVENTS = new Set(["game_start", "card_move", "foundation_complete", "result", "restart", "new_game", "main_return", "return_session"]);
  const INPUT_TYPES = new Set(["mouse", "touch", "pen", "keyboard", "auto", "unknown"]);
  const FROM_VALUES = new Set(["main", "battle", "result", "lifecycle", "unknown"]);
  const OUTCOMES = new Set(["started", "moved", "complete", "restart", "new_game", "returned", "visible", "unknown"]);
  const MOVE_TYPES = new Set(["wasteToFoundation", "tableauToFoundation", "tableauToTableau", "wasteToTableau", "unknown"]);
  const DRAW_MODES = new Set(["draw1", "draw3", "unknown"]);

  const locale = () => {
    const value = window.WonderI18n?.actualLocale?.() || document.documentElement.lang || "en";
    return LOCALES.has(value) ? value : "en";
  };

  const viewportBucket = () => {
    const width = Math.max(1, window.innerWidth || document.documentElement.clientWidth || 1);
    const height = Math.max(1, window.innerHeight || document.documentElement.clientHeight || 1);
    if (width <= 480) return "phone";
    if (height < 520 && width > height) return "short-landscape";
    if (width <= 900 && height >= width) return "tablet-portrait";
    return "desktop-landscape";
  };

  const bounded = (value, max) => {
    const number = Number(value);
    return Number.isFinite(number) ? Math.max(0, Math.min(max, Math.floor(number))) : 0;
  };

  const allowed = (value, values) => {
    const normalized = String(value || "unknown");
    return values.has(normalized) ? normalized : "unknown";
  };

  const track = (event, detail = {}) => {
    if (!EVENTS.has(event)) return;
    try {
      window.WonderAnalytics?.track(event, {
        game_id: GAME_ID,
        game_version: GAME_VERSION,
        interface_version: INTERFACE_VERSION,
        locale: locale(),
        viewport_bucket: viewportBucket(),
        input_type: allowed(detail.inputType, INPUT_TYPES),
        from: allowed(detail.from, FROM_VALUES),
        outcome: allowed(detail.outcome, OUTCOMES),
        draw_mode: allowed(detail.drawMode, DRAW_MODES),
        move_type: allowed(detail.moveType, MOVE_TYPES),
        move_count: bounded(detail.moveCount, 200),
        card_count: bounded(detail.cardCount, 52),
        foundation_cards: bounded(detail.foundationCards, 52),
        foundation_complete_count: bounded(detail.foundationCompleteCount, 4),
        tableau_cards: bounded(detail.tableauCards, 52),
        stock_cards: bounded(detail.stockCards, 52),
        waste_cards: bounded(detail.wasteCards, 52),
      });
    } catch {
      // Measurement must never interrupt a player action or alter game state.
    }
  };

  window.addEventListener(EVENT_NAME, (event) => track(event.detail?.event, event.detail));

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
