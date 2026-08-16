(() => {
  const GAME_ID = "animal-canopy-cut";
  const GAME_VERSION = "v4";
  const INTERFACE_VERSION = "6";
  const EVENT_NAME = "wp-canopy-analytics";
  const LOCALES = new Set(["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"]);
  const EVENTS = new Set(["chapter_open", "wave_start", "pointer_stroke", "safe_hit", "hazard_hit", "wave_result", "retry", "next_wave", "stage_return"]);
  const INPUT_TYPES = new Set(["mouse", "touch", "pen", "keyboard", "unknown"]);
  const FROM_VALUES = new Set(["stage", "battle", "result", "unknown"]);
  const OUTCOMES = new Set(["opened", "started", "completed", "cancelled", "safe", "hazard", "success", "no_moves", "retry", "next_wave", "replay", "returned", "unknown"]);

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

  const track = (event, detail = {}) => {
    if (!EVENTS.has(event)) return;
    try {
      window.WonderAnalytics?.track(event, {
        game_id: GAME_ID,
        game_version: GAME_VERSION,
        interface_version: INTERFACE_VERSION,
        locale: locale(),
        viewport_bucket: viewportBucket(),
        input_type: bounded(detail.inputType, INPUT_TYPES),
        from: bounded(detail.from, FROM_VALUES),
        outcome: bounded(detail.outcome, OUTCOMES),
      });
    } catch {
      // Analytics must never block a player action or alter the game state.
    }
  };

  window.addEventListener(EVENT_NAME, (event) => track(event.detail?.event, event.detail));
})();
