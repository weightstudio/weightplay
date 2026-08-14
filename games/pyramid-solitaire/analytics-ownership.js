(() => {
  "use strict";

  const GAME_ID = "pyramid-solitaire";
  const GAME_VERSION = "v16";
  const INTERFACE_VERSION = "6";
  let inputType = "unknown";
  let resultVisible = false;

  const viewportBucket = () => {
    const width = window.innerWidth || 0;
    const height = window.innerHeight || 0;
    if (width >= 700 && width > height) return "short-landscape";
    if (width < 480 && height >= width) return "phone-portrait";
    if (width <= 900) return "tablet";
    return "desktop";
  };
  const locale = () => {
    const pathLocale = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
    return pathLocale[window.location.pathname.split("/").filter(Boolean)[0]] || document.documentElement.lang || "en";
  };
  const number = (selector) => Number.parseInt((document.querySelector(selector)?.textContent || "").replace(/[^0-9]/gu, ""), 10) || 0;
  const rank = (node) => ({ A: 1, J: 11, Q: 12, K: 13 }[String(node?.querySelector?.(".rank.top")?.textContent || "").trim().toUpperCase()] || Number.parseInt(node?.querySelector?.(".rank.top")?.textContent || "", 10) || 0);
  const snapshot = () => ({
    moves: number("#moveCount"),
    score: number("#scoreValue"),
    combo: document.querySelector("#comboValue")?.textContent?.trim() || "—",
    stock: number("#stockPile b"),
    remaining: document.querySelectorAll("#tableauArea .classic-card").length,
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
        score: state.score,
        combo: state.combo,
        stock_remaining: state.stock,
        remaining_cards: state.remaining,
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
  const changed = (before, after) => before.moves !== after.moves
    || before.stock !== after.stock
    || before.remaining !== after.remaining
    || before.score !== after.score
    || before.combo !== after.combo;
  const afterVisibleAction = (name, before, details = {}) => {
    requestAnimationFrame(() => {
      const after = snapshot();
      if (changed(before, after)) track(name, details);
    });
  };

  document.addEventListener("pointerdown", (event) => rememberInput(event), true);
  window.addEventListener("keydown", (event) => rememberInput(event), true);
  document.addEventListener("click", (event) => {
    const target = event.target.closest?.("button, [data-source], .main-return");
    if (!target || target.disabled || target.hidden) return;
    rememberInput(event);
    const before = snapshot();
    if (target.matches("#startBtn")) {
      track("game_start", { from: "main" });
      return;
    }
    if (target.matches("#hintBtn")) {
      track("hint", { from: "battle" });
      return;
    }
    if (target.matches("#stockPile")) {
      afterVisibleAction("stock_draw", before, { from: "battle" });
      return;
    }
    if (target.matches("#undoBtn")) {
      afterVisibleAction("undo", before, { from: "battle" });
      return;
    }
    if (target.matches("#battleRestartBtn, #resultRestart, #restartBtn")) {
      track("restart", { from: target.id === "resultRestart" ? "result" : target.id === "restartBtn" ? "main" : "battle" });
      return;
    }
    if (target.matches("#battleBackBtn, #resultClose, .main-return")) {
      track("main_return", { from: target.id === "resultClose" ? "result" : "battle" });
      return;
    }
    if (!target.matches("[data-source]")) return;

    const selectedBefore = document.querySelector("#tableauArea .classic-card.selected, #wastePile .classic-card.selected");
    const selectedPairAttempt = Boolean(selectedBefore && selectedBefore !== target);
    if (!selectedPairAttempt) return;
    const nonKingPairAttempt = rank(selectedBefore) !== 13 && rank(target) !== 13;
    requestAnimationFrame(() => {
      const after = snapshot();
      const pairCue = document.querySelector("#boardStatus")?.dataset.state === "pair";
      const feedbackVisible = document.querySelector("#toast:not([hidden])")?.textContent?.trim();
      if ((pairCue || nonKingPairAttempt) && after.moves > before.moves) track("pair_clear", { from: "visible_cards" });
      else if (after.moves === before.moves && feedbackVisible) track("invalid_pair", { from: "visible_cards" });
    });
  }, true);

  const result = document.querySelector("#resultOverlay");
  if (result) new MutationObserver(() => {
    if (!result.hidden && !resultVisible) {
      resultVisible = true;
      track("result", { outcome: document.querySelector("#resultTitle")?.textContent?.trim() || "visible" });
    } else if (result.hidden) resultVisible = false;
  }).observe(result, { attributes: true, attributeFilter: ["hidden"] });
})();
