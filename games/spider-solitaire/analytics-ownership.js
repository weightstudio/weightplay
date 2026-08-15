(() => {
  "use strict";

  const GAME_ID = "spider-solitaire";
  const GAME_VERSION = "v32";
  const INTERFACE_VERSION = "6";
  const LOCALE_BY_ROUTE = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  let inputType = "unknown";
  let resultVisible = false;
  let lastSnapshot = null;
  let lastCompletedReported = 0;
  let snapshotQueued = false;
  let replayLinkOpened = false;

  const viewportBucket = () => {
    const width = window.innerWidth || 0;
    const height = window.innerHeight || 0;
    if (width >= 700 && width > height) return "short-landscape";
    if (width < 480 && height >= width) return "phone-portrait";
    if (width <= 900) return "tablet";
    return "desktop";
  };
  const locale = () => {
    const route = window.location.pathname.split("/").filter(Boolean)[0];
    return LOCALE_BY_ROUTE[route] || document.documentElement.lang || "en";
  };
  const readNumber = (selector) => Number.parseInt((document.querySelector(selector)?.textContent || "").replace(/[^0-9]/gu, ""), 10) || 0;
  const difficulty = () => document.querySelector("[data-difficulty].is-selected")?.dataset.difficulty || new URLSearchParams(window.location.search).get("suits") || "1";
  const snapshot = () => ({
    moves: readNumber("#moveCount"),
    stock: readNumber("#stockPile .stock-count"),
    completed: Number.parseInt((document.querySelector("#completedValue")?.textContent || "").split("/")[0].replace(/[^0-9]/gu, ""), 10) || 0,
    resultVisible: Boolean(document.querySelector("#resultOverlay:not([hidden])")),
  });
  const track = (name, details = {}) => {
    try {
      const state = snapshot();
      window.WonderAnalytics?.track?.(name, {
        game_id: GAME_ID,
        game_version: GAME_VERSION,
        interface_version: INTERFACE_VERSION,
        locale: locale(),
        viewport_bucket: viewportBucket(),
        input_type: details.input_type || inputType,
        difficulty: `suits_${difficulty()}`,
        moves: state.moves,
        stock_remaining: state.stock,
        completed_sets: state.completed,
        ...details,
      });
    } catch {
      // Measurement must never interrupt card play.
    }
  };
  const rememberInput = (event) => {
    if (event?.pointerType === "touch") inputType = "touch";
    else if (event?.pointerType) inputType = "pointer";
    else inputType = "keyboard";
  };

  const consumeSnapshot = () => {
    snapshotQueued = false;
    const current = snapshot();
    const previous = lastSnapshot;
    lastSnapshot = current;
    if (!previous) return;
    if (current.completed < previous.completed || current.moves < previous.moves || current.stock > previous.stock) lastCompletedReported = current.completed;
    if (current.moves > previous.moves) {
      if (current.stock < previous.stock) track("stock_deal", { from: "battle" });
      else track("move", { from: "tableau" });
    }
    if (current.completed > lastCompletedReported) {
      lastCompletedReported = current.completed;
      track("set_complete", { from: "tableau" });
    }
  };
  const queueSnapshot = () => {
    if (snapshotQueued) return;
    snapshotQueued = true;
    requestAnimationFrame(consumeSnapshot);
  };

  document.addEventListener("pointerdown", rememberInput, true);
  window.addEventListener("keydown", rememberInput, true);
  document.addEventListener("click", (event) => {
    const target = event.target.closest?.("button, .card, .main-return");
    if (!target || target.disabled || target.hidden) return;
    rememberInput(event);
    if (target.matches("#stageStartBtn")) {
      track("game_start", { from: "stage" });
      return;
    }
    if (target.matches("#copyReplayLinkBtn")) {
      track("copy_replay_link", { from: "battle" });
      return;
    }
    if (target.matches("#resultRestart, #restartBtn")) {
      track("restart", { from: target.id === "resultRestart" ? "result" : "stage" });
      return;
    }
    if (target.matches("#resultNewGame, #newGameBtn")) {
      track("new_game", { from: target.id === "resultNewGame" ? "result" : "stage" });
      return;
    }
    if (target.matches("#battleBackBtn, #resultClose")) {
      track("stage_return", { from: target.id === "resultClose" ? "result" : "battle" });
      return;
    }
    if (target.matches("#stageBackBtn, .main-return")) {
      track("main_return", { from: "stage" });
    }
  }, true);

  const result = document.querySelector("#resultOverlay");
  if (result) new MutationObserver(() => {
    if (!result.hidden && !resultVisible) {
      resultVisible = true;
      track("result", { from: "battle", outcome: "success" });
    } else if (result.hidden) {
      resultVisible = false;
    }
  }).observe(result, { attributes: true, attributeFilter: ["hidden"] });

  const observed = ["#moveCount", "#stockPile .stock-count", "#completedValue"].map((selector) => document.querySelector(selector)).filter(Boolean);
  if (observed.length) {
    const stateObserver = new MutationObserver(queueSnapshot);
    observed.forEach((node) => stateObserver.observe(node, { characterData: true, childList: true, subtree: true }));
  }
  lastSnapshot = snapshot();

  const params = new URLSearchParams(window.location.search);
  if (/^\d+$/u.test(params.get("seed") || "") && /^(1|2|4)$/u.test(params.get("suits") || "") && !replayLinkOpened) {
    replayLinkOpened = true;
    track("replay_link_open", { from: "route" });
  }
})();
