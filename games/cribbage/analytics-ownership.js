(() => {
  "use strict";

  if (window.__weightplayCribbageAnalyticsInstalled) return;
  window.__weightplayCribbageAnalyticsInstalled = true;

  const GAME_ID = "cribbage";
  const GAME_VERSION = "v20";
  const INTERFACE_VERSION = "6";
  const SESSION_START_KEY = "weightplay.cribbage.analytics.starts.v18";
  const LOCALE_MAP = {
    en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko",
    es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar",
  };
  const LOCALES = new Set(Object.values(LOCALE_MAP));
  let inputType = "unknown";
  let sessionStarts = readSessionStarts();
  let currentRun = { session_segment: sessionStarts ? "repeat" : "first", session_start_index: Math.min(99, sessionStarts || 1) };
  let resultVisible = Boolean(document.querySelector("#resultOverlay:not([hidden])"));
  let resetBattleObservation = () => {};

  const MILESTONE_LABELS = {
    en: { fifteen: "15", pair: "pair", go: "Go" },
    "zh-Hant": { fifteen: "15", pair: "對子", go: "Go" },
    "zh-Hans": { fifteen: "15", pair: "对子", go: "Go" },
    ja: { fifteen: "15", pair: "ペア", go: "Go" },
    ko: { fifteen: "15", pair: "페어", go: "Go" },
    es: { fifteen: "15", pair: "pareja", go: "Go" },
    "pt-BR": { fifteen: "15", pair: "par", go: "Go" },
    fr: { fifteen: "15", pair: "paire", go: "Go" },
    de: { fifteen: "15", pair: "Paar", go: "Go" },
    it: { fifteen: "15", pair: "coppia", go: "Go" },
    ru: { fifteen: "15", pair: "пара", go: "Go" },
    hi: { fifteen: "15", pair: "जोड़ी", go: "Go" },
    ar: { fifteen: "15", pair: "زوج", go: "جو" },
  };

  function readSessionStarts() {
    try {
      const value = Number.parseInt(sessionStorage.getItem(SESSION_START_KEY) || "0", 10);
      return Number.isFinite(value) ? Math.max(0, Math.min(99, value)) : 0;
    } catch {
      return 0;
    }
  }

  function rememberSessionStart() {
    sessionStarts = Math.min(99, sessionStarts + 1);
    try { sessionStorage.setItem(SESSION_START_KEY, String(sessionStarts)); } catch { /* Analytics must never interrupt play. */ }
    currentRun = { session_segment: sessionStarts === 1 ? "first" : "repeat", session_start_index: sessionStarts };
    return currentRun;
  }

  const locale = () => {
    const actual = window.WonderI18n?.actualLocale?.();
    if (LOCALES.has(actual)) return actual;
    return LOCALE_MAP[window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase()] || document.documentElement.lang || "en";
  };

  const viewportBucket = () => {
    const width = Math.max(1, window.innerWidth || document.documentElement.clientWidth || 1);
    const height = Math.max(1, window.innerHeight || document.documentElement.clientHeight || 1);
    if (height <= 430) return "short-landscape";
    if (width <= 480) return "phone";
    if (width <= 900) return height > width ? "tablet-portrait" : "tablet-landscape";
    return height > width ? "desktop-portrait" : "desktop-landscape";
  };

  const screen = () => {
    if (!document.querySelector("#resultOverlay")?.hidden) return "result";
    if (!document.querySelector("#battleScreen")?.hidden) return "battle";
    return "main";
  };

  const phase = () => {
    const currentScreen = screen();
    if (currentScreen === "result") return "result";
    if (currentScreen !== "battle") return "main";
    return document.querySelector('#cardGameActions [data-action="send-crib"]') ? "crib_selection" : "pegging";
  };

  const readRound = () => {
    const label = document.querySelector("#cardGameCenter .card-table-label")?.textContent || "";
    const value = label.match(/\d+/u)?.[0];
    return value ? Number(value) : null;
  };

  const readPegCount = () => {
    const phaseText = document.querySelector("#cardGamePhase")?.textContent || "";
    const value = phaseText.match(/(\d+)\s*\/\s*31/u)?.[1];
    return value ? Number(value) : null;
  };

  const bounded = (value, max = 99) => Math.max(0, Math.min(max, Number(value) || 0));

  const track = (event, details = {}) => {
    try {
      window.WonderAnalytics?.track?.(event, {
        game_id: GAME_ID,
        game_version: GAME_VERSION,
        interface_version: INTERFACE_VERSION,
        locale: locale(),
        viewport_bucket: viewportBucket(),
        input_type: details.input_type || inputType,
        session_segment: details.session_segment || currentRun.session_segment,
        session_start_index: details.session_start_index || currentRun.session_start_index,
        screen: screen(),
        phase: phase(),
        ...details,
      });
    } catch {
      // Measurement must never interrupt card play or navigation.
    }
  };

  const rememberInput = (event) => {
    if (event?.pointerType === "touch") inputType = "touch";
    else if (event?.pointerType === "mouse") inputType = "mouse";
    else if (event?.pointerType) inputType = "pointer";
    else if (event?.type === "keydown") inputType = "keyboard";
  };

  const startFromMain = (event, from) => {
    resetBattleObservation();
    const run = rememberSessionStart();
    track(event, { from, ...run });
    track("round_start", { from, outcome: "started", ...run });
  };

  const continueFromResult = (event) => {
    resetBattleObservation();
    track(event, { from: "result" });
    const run = rememberSessionStart();
    track("round_start", { from: "result", outcome: "started", ...run });
  };

  document.addEventListener("pointerdown", rememberInput, true);
  document.addEventListener("keydown", rememberInput, true);
  document.addEventListener("click", (event) => {
    const target = event.target?.closest?.("button, .main-return");
    if (!target || target.disabled || target.hidden) return;
    rememberInput(event);
    if (target.matches("#startBtn")) { startFromMain("game_start", "main"); return; }
    if (target.matches("#restartBtn")) { startFromMain("restart", "main"); return; }
    if (target.matches("#newGameBtn")) { startFromMain("new_game", "main"); return; }
    if (target.matches("#resultRestart")) { continueFromResult("restart"); return; }
    if (target.matches("#resultNewGame")) { continueFromResult("new_game"); return; }
    if (target.matches("#battleRestartBtn, #battleNewBtn")) {
      const eventName = target.matches("#battleRestartBtn") ? "restart" : "new_game";
      resetBattleObservation();
      track(eventName, { from: "battle", outcome: eventName });
      track("round_start", { from: "battle", outcome: "started" });
      return;
    }
    if (target.matches('#cardGameActions button[data-action="send-crib"]')) {
      track("crib_submit", {
        from: "battle",
        outcome: "submitted",
        round: readRound(),
        selected_cards: bounded(document.querySelectorAll("#cardGameHand button.is-selected").length, 2),
      });
      return;
    }
    if (target.matches('#cardGameHand button[data-card-index]') && phase() === "pegging") {
      track("pegging_card", { from: "battle", outcome: "attempted", round: readRound(), count_before: readPegCount() });
      return;
    }
    if (target.matches("#battleBackBtn, .main-return")) track("main_return", { from: target.matches(".main-return") ? "main" : "battle" });
  }, true);

  const observeBattle = () => {
    const center = document.querySelector("#cardGameCenter");
    const phaseNode = document.querySelector("#cardGamePhase");
    const hand = document.querySelector("#cardGameHand");
    const actions = document.querySelector("#cardGameActions");
    if (!center || !phaseNode || !hand || !actions) return;

    let observedRound = null;
    let lastTransition = "";
    let lastScoreCue = "";
    let lastResetCue = "";
    let pendingInitialRound = false;
    let scheduled = false;

    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      window.setTimeout(() => {
        scheduled = false;
        sync();
      }, 0);
    };

    const sync = () => {
      if (screen() !== "battle") return;
      const round = readRound();
      if (!Number.isFinite(round)) return;
      if (observedRound === null) {
        observedRound = round;
        if (pendingInitialRound) pendingInitialRound = false;
        else track("round_start", { from: "battle", outcome: "started", round });
      } else if (round !== observedRound) {
        const settledRound = observedRound;
        observedRound = round;
        lastTransition = "";
        lastScoreCue = "";
        lastResetCue = "";
        track("round_settlement", { from: "battle", outcome: "continued", round: settledRound, next_round: round });
        track("round_start", { from: "battle", outcome: "started", round });
      }

      const transition = document.querySelector("#cardGameCenter .card-crib-transition")?.textContent?.trim() || "";
      if (transition && transition !== lastTransition) {
        lastTransition = transition;
        track("starter_reveal", { from: "battle", outcome: "revealed", round });
      }

      const scoreCue = document.querySelector("#cardGameCenter .card-crib-score-cue")?.textContent?.trim() || "";
      if (scoreCue && scoreCue !== lastScoreCue) {
        lastScoreCue = scoreCue;
        const labels = MILESTONE_LABELS[locale()] || MILESTONE_LABELS.en;
        const reasonText = scoreCue.replace(/\d+\s*\/\s*31\.?\s*$/u, "");
        ["fifteen", "pair"].forEach((milestone) => {
          if (labels[milestone] && reasonText.includes(labels[milestone])) {
            const points = scoreCue.match(/\+\s*(\d+)/u)?.[1];
            track("pegging_milestone", {
              from: "battle",
              outcome: "scored",
              milestone,
              round,
              count: readPegCount(),
              score_delta: bounded(points, 12),
            });
          }
        });
      }

      const resetCue = document.querySelector("#cardGameCenter .card-crib-reset")?.textContent?.trim() || "";
      if (resetCue && resetCue !== lastResetCue) {
        lastResetCue = resetCue;
        const labels = MILESTONE_LABELS[locale()] || MILESTONE_LABELS.en;
        const milestone = resetCue.includes(labels.go) ? "go" : resetCue.includes("31") ? "thirty_one" : null;
        if (milestone) track("pegging_milestone", { from: "battle", outcome: "reset", milestone, round, count: 0 });
      }
    };

    resetBattleObservation = () => {
      observedRound = null;
      lastTransition = "";
      lastScoreCue = "";
      lastResetCue = "";
      pendingInitialRound = true;
      schedule();
    };

    [center, phaseNode, hand, actions].forEach((node) => new MutationObserver(schedule).observe(node, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true,
    }));
    schedule();
  };

  const observeResult = () => {
    const result = document.querySelector("#resultOverlay");
    if (!result) return;
    resultVisible = !result.hidden;
    new MutationObserver(() => {
      const visible = !result.hidden;
      if (visible && !resultVisible) {
        resultVisible = true;
        const scores = (document.querySelector("#resultText")?.textContent || "").match(/(\d+)\s*\/\s*(\d+)/u);
        const details = {
          from: "battle",
          outcome: result.dataset.outcome || "unknown",
          mastery_target_visible: document.querySelector("#resultText")?.dataset.cribbageResultMastery === "true",
          round: readRound(),
        };
        if (scores) { details.player_score = Number(scores[1]); details.opponent_score = Number(scores[2]); }
        track("round_settlement", { from: "battle", outcome: "result", round: details.round });
        track("round_result", details);
      } else if (!visible) resultVisible = false;
    }).observe(result, { attributes: true, attributeFilter: ["hidden"] });
  };

  const onReady = () => {
    observeResult();
    observeBattle();
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", onReady, { once: true });
  else onReady();
})();
