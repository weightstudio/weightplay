(() => {
  "use strict";

  if (window.__weightplayZhaoYunADouAnalyticsInstalled) return;
  window.__weightplayZhaoYunADouAnalyticsInstalled = true;

  const GAME_ID = "zhao-yun-a-dou";
  const GAME_VERSION = "v22";
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
  const ENTRIES = new Set(["stage", "retry", "next"]);
  const RESULT_ACTIONS = new Set(["retry", "next_stage", "stages"]);
  const OUTCOMES = new Set(["win", "loss"]);
  const TARGETS = new Set(["faster_clear", "faster_three_star", "cover_all_lanes"]);
  const SKILLS = new Set(["blade", "spear", "horse", "bow"]);
  let inputType = "unknown";
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
    return LOCALE_MAP[segment] || (LOCALES.has(document.documentElement.lang) ? document.documentElement.lang : "en");
  };

  const stage = (value) => {
    const parsed = Number(value ?? document.querySelector("#stageGrid [data-wp-stage-selected='true']")?.getAttribute("data-wp-stage-card"));
    return Number.isFinite(parsed) ? Math.max(1, Math.min(30, Math.trunc(parsed))) : 1;
  };

  const screen = () => {
    if (document.querySelector("#result")?.open) return "result";
    return document.body.getAttribute("data-screen") || "main";
  };

  const track = (event, details = {}) => {
    try {
      const payload = {
        game_id: GAME_ID,
        game_version: GAME_VERSION,
        interface_version: INTERFACE_VERSION,
        locale: locale(),
        viewport_bucket: viewportBucket(),
        input_type: details.input_type || inputType,
        screen: screen(),
        ...details,
      };
      if (payload.stage !== undefined) payload.stage = stage(payload.stage);
      window.dispatchEvent(new CustomEvent("weightplay:analytics-event", { detail: { name: event, payload } }));
      window.WonderAnalytics?.track?.(event, payload);
    } catch (_) {
      // Measurement must never interrupt the live defense loop.
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
    const target = event.target?.closest?.("button, .return");
    if (!target || target.disabled || target.hidden) return;
    const input_type = event.detail === 0 ? "keyboard" : inputType;

    if (target.matches("#start")) {
      track("trial_start", { from: "main", entry: "start", input_type });
      return;
    }
    if (target.matches("#resultStages")) {
      resultJourneyActive = true;
      track("result_action", { from: "result", action: "stages", input_type });
      return;
    }
    if (target.matches("#retry")) {
      resultJourneyActive = false;
      track("result_action", { from: "result", action: "retry", input_type });
      return;
    }
    if (target.matches("#next")) {
      resultJourneyActive = false;
      track("result_action", { from: "result", action: "next_stage", input_type });
      return;
    }
    if (target.matches("#returnToStage")) {
      track("stage_return", { from: "battle", input_type });
      return;
    }
    if (target.matches("#stage [data-back]")) {
      track("main_return", { from: "stage", input_type });
      if (resultJourneyActive) {
        resultJourneyActive = false;
        track("result_to_lobby", { from: "result", action: "back_main", input_type });
      }
      return;
    }
    if (target.matches(".return")) {
      track("main_return", { from: "main", input_type });
    }
  }, true);

  window.addEventListener("weightplay:zhao-battle-start", (event) => {
    const entry = ENTRIES.has(event.detail?.entry) ? event.detail.entry : "stage";
    const eventName = entry === "retry" ? "replay_start" : "stage_start";
    track(eventName, { from: entry === "retry" ? "result" : "stage", entry, stage: event.detail?.stage });
  });

  window.addEventListener("weightplay:zhao-result", (event) => {
    const outcome = OUTCOMES.has(event.detail?.outcome) ? event.detail.outcome : "loss";
    const target = TARGETS.has(event.detail?.target) ? event.detail.target : "cover_all_lanes";
    track("result_target_shown", { from: "battle", outcome, target, stage: event.detail?.stage });
  });

  window.addEventListener("weightplay:zhao-recruit", () => {
    track("recruit", { from: "battle", action: "recruit" });
  });

  window.addEventListener("weightplay:zhao-merge", (event) => {
    const result = event.detail?.result === "promotion" ? "promotion" : "level_up";
    track("merge", { from: "battle", result });
  });

  window.addEventListener("weightplay:zhao-skill", (event) => {
    if (SKILLS.has(event.detail?.skill)) track("skill_use", { from: "battle", skill: event.detail.skill });
  });

  window.addEventListener("weightplay:zhao-locale-change", (event) => {
    if (LOCALES.has(event.detail?.locale)) track("locale_change", { from: screen(), to_locale: event.detail.locale });
  });

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
