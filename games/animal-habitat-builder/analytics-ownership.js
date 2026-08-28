(() => {
  "use strict";

  if (window.__weightplayAnimalHabitatBuilderAnalyticsInstalled) return;
  window.__weightplayAnimalHabitatBuilderAnalyticsInstalled = true;

  const GAME_ID = "animal-habitat-builder";
  const GAME_VERSION = "v10";
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
  const SCREENS = new Set(["main", "stage", "battle", "result"]);
  const ACTIONS = new Set(["tile-0", "tile-1", "tile-2", "tile-3", "reset"]);
  let inputType = "unknown";
  let lastStage = 1;
  let selectedTile = 0;
  let resultVisible = false;
  let resultJourneyActive = false;
  let resultToStages = false;

  const bounded = (value, max = 99) => Math.max(0, Math.min(max, Number(value) || 0));
  const viewportBucket = () => {
    const width = Math.max(1, window.innerWidth || document.documentElement.clientWidth || 1);
    const height = Math.max(1, window.innerHeight || document.documentElement.clientHeight || 1);
    if (height <= 430) return "short-landscape";
    if (width <= 480) return "phone";
    if (width <= 900) return height > width ? "tablet-portrait" : "tablet-landscape";
    return height > width ? "desktop-portrait" : "desktop-landscape";
  };
  const locale = () => {
    const actual = window.WeightPlayMarketFiveLocale?.locale;
    if (LOCALES.has(actual)) return actual;
    const pathLocale = LOCALE_MAP[window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase()];
    return pathLocale || (LOCALES.has(document.documentElement.lang) ? document.documentElement.lang : "en");
  };
  const screen = () => {
    if (!document.querySelector("#result-screen")?.hidden) return "result";
    if (!document.querySelector("#battle-screen")?.hidden) return "battle";
    if (!document.querySelector("#stage-screen")?.hidden) return "stage";
    return "main";
  };
  const eventInput = (event) => event?.detail === 0 ? "keyboard" : inputType;
  const stageFromLabel = () => {
    const match = document.querySelector("#stage-label")?.textContent?.match(/(\d+)/);
    return bounded(match?.[1] || lastStage, 6) || 1;
  };
  const moveCount = () => {
    const match = document.querySelector("#score-label")?.textContent?.match(/(\d+)\//);
    return bounded(match?.[1], 99);
  };
  const resultOutcome = () => {
    const pairs = [...(document.querySelector("#result-copy")?.textContent || "").matchAll(/(\d+)\/(\d+)/g)]
      .map((match) => [Number(match[1]), Number(match[2])]);
    if (!pairs.length) return "unknown";
    const [passed, checks] = pairs[pairs.length - 1];
    return passed === checks ? "success" : "failure";
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
        ...details,
      });
    } catch {
      // Measurement must never interrupt the short ecology loop.
    }
  };
  const rememberInput = (event) => {
    if (event?.pointerType === "touch") inputType = "touch";
    else if (event?.pointerType === "mouse") inputType = "mouse";
    else if (event?.pointerType === "pen") inputType = "pen";
    else if (event?.pointerType) inputType = "pointer";
    else if (event?.type === "keydown") inputType = "keyboard";
  };

  document.addEventListener("pointerdown", rememberInput, true);
  document.addEventListener("keydown", rememberInput, true);

  document.addEventListener("click", (event) => {
    const target = event.target?.closest?.("button, a");
    if (!target || target.disabled || target.hidden) return;
    const input_type = eventInput(event);
    const currentScreen = screen();

    if (target.matches("#start-game")) {
      resultJourneyActive = false;
      resultToStages = false;
      track("trial_start", { from: "main", entry: "start", input_type });
      return;
    }
    if (target.matches("#stage-list button[data-stage]")) {
      lastStage = bounded(target.dataset.stage, 6) || 1;
      resultJourneyActive = false;
      resultToStages = false;
      track("stage_start", { stage: lastStage, stage_bucket: lastStage, from: "stage", entry: "stage_card", input_type });
      return;
    }
    if (target.matches("#next") && !target.disabled) {
      const nextStage = Math.min(6, stageFromLabel() + 1);
      lastStage = nextStage;
      resultJourneyActive = false;
      resultToStages = false;
      track("result_action", { action: "next_stage", stage: nextStage - 1, from: "result", input_type });
      track("stage_start", { stage: nextStage, stage_bucket: nextStage, from: "result", entry: "next_stage", input_type });
      return;
    }
    if (target.matches("#retry")) {
      lastStage = stageFromLabel();
      resultJourneyActive = false;
      resultToStages = false;
      track("retry_start", { stage: lastStage, stage_bucket: lastStage, from: "result", input_type });
      track("result_action", { action: "retry", stage: lastStage, from: "result", input_type });
      return;
    }
    if (target.matches("#to-stages")) {
      resultToStages = true;
      track("result_action", { action: "stage_menu", stage: stageFromLabel(), from: "result", input_type });
      return;
    }
    if (target.matches("#stage-back")) {
      if (resultToStages) resultJourneyActive = true;
      track("main_return", { from: "stage", entry: "stage_back", input_type });
      return;
    }
    if (target.matches("#battle-back")) {
      track("result_action", { action: "battle_back", stage: stageFromLabel(), from: currentScreen, input_type });
      return;
    }
    if (target.matches(".m5-return")) {
      if (resultJourneyActive) {
        track("result_to_lobby", { stage: lastStage, stage_bucket: lastStage, from: "result", input_type });
      }
      track("main_return", { from: resultJourneyActive ? "result" : "main", input_type });
      resultJourneyActive = false;
      resultToStages = false;
      return;
    }
    if (target.matches("[data-action]")) {
      const action = target.dataset.action;
      if (!ACTIONS.has(action)) return;
      if (action.startsWith("tile-")) {
        selectedTile = bounded(action.slice(-1), 3);
        track("tile_select", { tile_slot: selectedTile, stage: lastStage, stage_bucket: lastStage, from: "battle", input_type });
      } else if (action === "reset") {
        track("board_reset", { stage: lastStage, stage_bucket: lastStage, from: "battle", input_type });
      }
    }
  }, true);

  document.addEventListener("pointerup", (event) => {
    if (screen() !== "battle" || !event.target?.matches?.("#arena")) return;
    track("tile_place", {
      tile_slot: selectedTile,
      stage: lastStage,
      stage_bucket: lastStage,
      move_count: moveCount(),
      from: "battle",
      input_type: event.pointerType || inputType,
    });
  }, true);

  document.addEventListener("change", (event) => {
    if (!event.target?.matches?.("#localeSelect")) return;
    const to_locale = event.target.value;
    if (!LOCALES.has(to_locale)) return;
    track("locale_change", { from: screen(), from_locale: locale(), to_locale, input_type: inputType });
  }, true);

  const result = document.querySelector("#result-screen");
  if (result) new MutationObserver(() => {
    const visible = !result.hidden;
    if (visible && !resultVisible) {
      resultVisible = true;
      lastStage = stageFromLabel();
      resultJourneyActive = true;
      const outcome = resultOutcome();
      const details = {
        stage: lastStage,
        stage_bucket: lastStage,
        outcome,
        move_count: moveCount(),
        from: "battle",
      };
      track("stage_result", details);
      if (outcome === "success") track("stage_complete", details);
    } else if (!visible) {
      resultVisible = false;
    }
  }).observe(result, { attributes: true, attributeFilter: ["hidden"] });

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
