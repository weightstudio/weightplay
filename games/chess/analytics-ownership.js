(() => {
  const GAME_ID = "chess";
  const GAME_VERSION = "v10";
  const INTERFACE_VERSION = "6";
  const EVENT_NAME = "wp-chess-analytics";
  const LOCALES = new Set(["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"]);
  const EVENTS = new Set(["game_start", "valid_move", "correction", "result", "play_again", "main_return", "hint", "restart"]);
  const INPUT_TYPES = new Set(["mouse", "touch", "pen", "keyboard", "unknown"]);
  const FROM_VALUES = new Set(["main", "battle", "result", "unknown"]);
  const OUTCOMES = new Set(["started", "advanced", "corrected", "cleared", "replay", "returned", "shown", "restart", "unknown"]);
  const locale = () => {
    const value = window.WonderI18n?.actualLocale?.() || document.documentElement.lang || "en";
    return LOCALES.has(value) ? value : "en";
  };
  const viewportBucket = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    if (width <= 480) return "phone";
    if (height < 520 && width > height) return "short-landscape";
    if (width <= 900 && height >= width) return "tablet-portrait";
    return "desktop-landscape";
  };
  const bounded = (value, allowed) => {
    const normalized = String(value || "unknown");
    return allowed.has(normalized) ? normalized : "unknown";
  };
  const boundedInt = (value, min, max) => {
    const number = Number(value);
    return Number.isInteger(number) && number >= min && number <= max ? number : 0;
  };
  const track = (event, detail = {}) => {
    if (!EVENTS.has(event)) return;
    try {
      const payload = {
        game_id: GAME_ID,
        game_version: GAME_VERSION,
        interface_version: INTERFACE_VERSION,
        locale: locale(),
        viewport_bucket: viewportBucket(),
        input_type: bounded(detail.inputType, INPUT_TYPES),
        from: bounded(detail.from, FROM_VALUES),
        outcome: bounded(detail.outcome, OUTCOMES),
        sprint: boundedInt(detail.sprint, 1, 99),
        step: boundedInt(detail.step, 0, 3),
        moves: boundedInt(detail.moves, 0, 3),
        correction_count: boundedInt(detail.correctionCount, 0, 99),
        score: boundedInt(detail.score, 0, 999),
      };
      if (event === "correction") payload.reason = ["target-first", "wrong-piece", "wrong-target"].includes(detail.reason) ? detail.reason : "unknown";
      window.WonderAnalytics?.track(event, payload);
    } catch {
      // Analytics must never block a player action or alter the game state.
    }
  };
  window.addEventListener(EVENT_NAME, (event) => track(event.detail?.event, event.detail));
})();
