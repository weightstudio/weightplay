(() => {
  "use strict";

  const GAME_ID = "golf-solitaire";
  const GAME_VERSION = "v23";
  const INTERFACE_VERSION = "6";
  const LOCALE_MAP = {
    en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko",
    es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar",
  };
  let inputType = "unknown";
  let started = false;
  let wasHidden = false;
  let returnSessionTracked = false;
  let resultVisible = false;
  let bestChain = 0;

  const viewportBucket = () => {
    const width = Math.max(1, window.innerWidth || document.documentElement.clientWidth || 1);
    const height = Math.max(1, window.innerHeight || document.documentElement.clientHeight || 1);
    if (height <= 430) return "short-landscape";
    if (width <= 480) return "phone";
    if (width <= 900) return height > width ? "tablet-portrait" : "tablet-landscape";
    return height > width ? "desktop-portrait" : "desktop-landscape";
  };
  const locale = () => LOCALE_MAP[window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase()] || document.documentElement.lang || "en";
  const bounded = (value, max = 99) => Math.max(0, Math.min(max, Number(value) || 0));
  const number = (selector) => bounded(Number.parseInt((document.querySelector(selector)?.textContent || "").replace(/[^0-9]/gu, ""), 10));
  const snapshot = () => ({
    moves: number("#moveCount"),
    combo: number("#comboValue"),
    stock: number("#stockPile b"),
    remaining: bounded(document.querySelectorAll("#tableauArea .classic-card").length),
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
        moves: state.moves,
        combo_length: state.combo,
        stock_remaining: state.stock,
        remaining_cards: state.remaining,
        ...details,
      });
    } catch {
      // Measurement must never interrupt the owner-preview game.
    }
  };
  const rememberInput = (event) => {
    if (event?.pointerType === "touch") inputType = "touch";
    else if (event?.pointerType === "mouse") inputType = "mouse";
    else if (event?.pointerType) inputType = "pointer";
    else if (event?.type === "keydown") inputType = "keyboard";
  };
  const changed = (before, after) => before.moves !== after.moves
    || before.stock !== after.stock
    || before.remaining !== after.remaining
    || before.combo !== after.combo;
  const resetRound = () => { bestChain = 0; };
  const trackChain = (before, after) => {
    if (after.combo >= 2 && before.combo < 2) track("chain_2", { from: "tableau" });
    if (after.combo >= 2 && after.combo > bestChain) {
      bestChain = after.combo;
      track("chain_best", { from: "tableau", chain_length: after.combo });
    }
  };

  document.addEventListener("pointerdown", rememberInput, true);
  document.addEventListener("keydown", rememberInput, true);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      wasHidden = true;
      return;
    }
    if (document.visibilityState === "visible" && started && wasHidden && !returnSessionTracked) {
      returnSessionTracked = true;
      track("return_session", { from: "visibility" });
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target?.closest?.("button, [data-source], .main-return");
    if (!target || target.disabled || target.hidden) return;
    rememberInput(event);
    const before = snapshot();
    if (target.matches("#startBtn")) {
      started = true;
      resetRound();
      track("game_start", { from: "main" });
      return;
    }
    if (target.matches("#hintBtn")) {
      track("hint", { from: "battle" });
      return;
    }
    if (target.matches("#stockPile")) {
      requestAnimationFrame(() => {
        const after = snapshot();
        if (after.stock < before.stock) track("stock_draw", { from: "battle" });
      });
      return;
    }
    if (target.matches("#undoBtn")) {
      requestAnimationFrame(() => {
        const after = snapshot();
        if (changed(before, after)) track("undo", { from: "battle" });
      });
      return;
    }
    if (target.matches("#battleRestartBtn, #resultRestart, #restartBtn")) {
      resetRound();
      track("restart", { from: target.id === "resultRestart" ? "result" : target.id === "restartBtn" ? "main" : "battle" });
      return;
    }
    if (target.matches("#battleNewBtn, #resultNewGame, #newGameBtn")) {
      resetRound();
      track("new_game", { from: target.id === "resultNewGame" ? "result" : target.id === "newGameBtn" ? "main" : "battle" });
      return;
    }
    if (target.matches("#battleBackBtn, #resultClose, .main-return")) {
      track("main_return", { from: target.id === "resultClose" ? "result" : "battle" });
      return;
    }
    if (!target.matches("[data-source]")) return;
    requestAnimationFrame(() => {
      const after = snapshot();
      if (after.moves > before.moves && after.remaining < before.remaining) {
        track("card_play", { from: "tableau" });
        trackChain(before, after);
      } else if (!changed(before, after)) {
        track("invalid_move", { from: "tableau" });
      }
    });
  }, true);

  const result = document.querySelector("#resultOverlay");
  if (result) new MutationObserver(() => {
    if (!result.hidden && !resultVisible) {
      resultVisible = true;
      track("result", { from: "battle", outcome: snapshot().remaining === 0 ? "success" : "failure" });
    } else if (result.hidden) {
      resultVisible = false;
    }
  }).observe(result, { attributes: true, attributeFilter: ["hidden"] });
})();
