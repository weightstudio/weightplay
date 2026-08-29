(() => {
  "use strict";

  if (window.__weightplayAnimalBounceBrawlAnalyticsInstalled) return;
  window.__weightplayAnimalBounceBrawlAnalyticsInstalled = true;

  const GAME_ID = "animal-bounce-brawl";
  const GAME_VERSION = "v14";
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
  const LOCALES = new Set(Object.values(LOCALE_MAP));
  const ACTIONS = new Set(["retry", "next_arena", "arenas", "back_main"]);
  const TOOLS = new Set(["bump", "spring", "pad"]);
  let inputType = "unknown";
  let resultVisible = false;
  let resultJourneyActive = false;

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
    const segment = window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
    return LOCALE_MAP[segment] || document.documentElement.lang || "en";
  };

  const screen = () => {
    if (!document.querySelector("#result-screen")?.hidden) return "result";
    if (!document.querySelector("#battle-screen")?.hidden) return "battle";
    if (!document.querySelector("#stage-screen")?.hidden) return "stage";
    return "main";
  };

  const arena = () => {
    const match = document.querySelector("#arena-label")?.textContent?.match(/(\d+)\s*\/\s*6/);
    const value = Number(match?.[1]);
    return Number.isFinite(value) ? Math.max(1, Math.min(6, value)) : 1;
  };

  const track = (event, details = {}) => {
    try {
      window.WonderAnalytics?.track?.(event, {
        game_id: GAME_ID,
        game_version: GAME_VERSION,
        interface_version: INTERFACE_VERSION,
        locale: locale(),
        viewport_bucket: viewportBucket(),
        input_type: details.input_type || inputType,
        screen: screen(),
        arena: arena(),
        ...details,
      });
    } catch {
      // Measurement must never interrupt the short physics loop.
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
    const target = event.target?.closest?.("button, .main-return");
    if (!target || target.disabled || target.hidden) return;
    const input_type = event.detail === 0 ? "keyboard" : inputType;

    if (target.matches("#start-game")) {
      track("trial_start", { from: "main", entry: "start", input_type });
      return;
    }
    if (target.matches("#stage-list [data-arena]")) {
      const selectedArena = Number(target.dataset.arena);
      track("arena_start", { from: "stage", entry: "arena_card", arena: Math.max(1, Math.min(6, selectedArena)), input_type });
      return;
    }
    if (target.matches("[data-tool]")) {
      const tool = ["bump", "spring", "pad"][Number(target.dataset.tool)] || "";
      if (TOOLS.has(tool)) track("tool_select", { from: "battle", tool, input_type });
      return;
    }
    if (target.matches('[data-key="Space"]')) {
      track("strike_attempt", { from: "battle", action: "bounce", input_type });
      return;
    }
    if (target.matches("#retry")) {
      resultJourneyActive = false;
      track("result_action", { from: "result", action: "retry", input_type });
      track("retry_start", { from: "result", input_type });
      return;
    }
    if (target.matches("#next")) {
      resultJourneyActive = false;
      track("result_action", { from: "result", action: "next_arena", input_type });
      return;
    }
    if (target.matches("#to-stages")) {
      resultJourneyActive = true;
      track("result_action", { from: "result", action: "arenas", input_type });
      return;
    }
    if (target.matches("#stage-back")) {
      track("main_return", { from: "stage", input_type });
      return;
    }
    if (target.matches("#battle-back")) {
      track("stage_return", { from: "battle", input_type });
      return;
    }
    if (target.matches(".main-return")) {
      track("main_return", { from: "main", input_type });
      if (resultJourneyActive) {
        resultJourneyActive = false;
        track("result_to_lobby", { from: "result", action: "back_main", input_type });
      }
    }
  }, true);

  document.addEventListener("pointerdown", (event) => {
    const target = event.target?.closest?.('[data-key="ArrowLeft"], [data-key="ArrowRight"]');
    if (target && !target.disabled && !target.hidden) track("approach_input", { from: "battle", action: target.dataset.key === "ArrowLeft" ? "left" : "right" });
  }, true);

  document.addEventListener("keydown", (event) => {
    if (event.repeat || screen() !== "battle") return;
    const action = event.code === "ArrowLeft" || event.code === "KeyA" ? "left" : event.code === "ArrowRight" || event.code === "KeyD" ? "right" : "";
    if (action) track("approach_input", { from: "battle", action, input_type: "keyboard" });
    if (event.code === "Space") track("strike_attempt", { from: "battle", action: "bounce", input_type: "keyboard" });
  }, true);

  window.addEventListener("weightplay:bounce-impact", (event) => {
    const tool = ["bump", "spring", "pad"][Number(event.detail?.tool)] || "";
    if (TOOLS.has(tool)) track("impact", { from: "battle", tool });
  });

  document.addEventListener("change", (event) => {
    if (!event.target?.matches?.("#localeSelect")) return;
    const selectedLocale = event.target.value;
    if (LOCALES.has(selectedLocale)) track("locale_change", { from: screen(), to_locale: selectedLocale });
  }, true);

  const result = document.querySelector("#result-screen");
  if (result) new MutationObserver(() => {
    const visible = !result.hidden;
    if (visible && !resultVisible) {
      resultVisible = true;
      const outcome = result.dataset.outcome === "success" ? "success" : "failure";
      track("arena_result", { from: "battle", outcome });
      if (outcome === "success") track("arena_complete", { from: "battle", outcome });
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
