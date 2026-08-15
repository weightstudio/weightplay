(() => {
  "use strict";

  const GAME_ID = "peg-solitaire";
  const GAME_VERSION = "v3";
  const INTERFACE_VERSION = "6";
  const LOCALE_MAP = {
    en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko",
    es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar",
  };
  let inputType = "unknown";
  let started = false;
  let resultVisible = false;

  const viewportBucket = () => {
    const width = Math.max(1, window.innerWidth || document.documentElement.clientWidth || 1);
    const height = Math.max(1, window.innerHeight || document.documentElement.clientHeight || 1);
    if (height <= 430) return "short-landscape";
    if (width <= 480) return "phone";
    if (width <= 900) return height > width ? "tablet-portrait" : "tablet-landscape";
    return height > width ? "desktop-portrait" : "desktop-landscape";
  };
  const locale = () => LOCALE_MAP[window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase()]
    || document.documentElement.lang || "en";
  const track = (name, details = {}) => {
    try {
      window.WonderAnalytics?.track?.(name, {
        game_id: GAME_ID,
        game_version: GAME_VERSION,
        interface_version: INTERFACE_VERSION,
        locale: locale(),
        viewport_bucket: viewportBucket(),
        input_type: details.input_type || inputType,
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
  const boardSnapshot = () => ({
    pegs: document.querySelectorAll(".logic-peg-board .logic-cell.peg").length,
    selected: document.querySelectorAll(".logic-peg-board .logic-cell.is-selected").length,
  });

  document.addEventListener("pointerdown", rememberInput, true);
  document.addEventListener("keydown", rememberInput, true);
  document.addEventListener("click", (event) => {
    const target = event.target?.closest?.("button");
    if (!target || target.disabled || target.hidden) return;
    rememberInput(event);

    if (target.matches("#startButton")) {
      started = true;
      track("game_start", { from: "main" });
      return;
    }
    if (target.matches("#logicHint")) {
      track("hint_used", { from: "battle" });
      return;
    }
    if (target.matches("#logicUndo")) {
      track("undo", { from: "battle" });
      return;
    }
    if (target.matches("#logicReset")) {
      track("new_puzzle", { from: "battle" });
      return;
    }
    if (target.matches("#battleBack, #resultMenu")) {
      if (started) track("main_return", { from: target.id === "resultMenu" ? "result" : "battle" });
      return;
    }
    if (target.matches("#resultReplay")) {
      track("replay", { from: "result" });
      return;
    }
    if (!target.matches(".logic-peg-board .logic-cell") || target.classList.contains("void")) return;

    const before = boardSnapshot();
    const wasSource = target.classList.contains("peg") && before.selected === 0;
    requestAnimationFrame(() => {
      const after = boardSnapshot();
      if (wasSource && after.selected > 0) {
        track("source_selected", { from: "battle" });
      } else if (after.pegs < before.pegs) {
        track("legal_jump", { from: "battle" });
      } else if (before.selected > 0 && target.classList.contains("empty")) {
        track("invalid_target", { from: "battle" });
      }
    });
  }, true);

  const result = document.querySelector("#logicResult");
  if (result) new MutationObserver(() => {
    if (!result.hidden && !resultVisible) {
      resultVisible = true;
      const outcome = document.querySelectorAll(".logic-peg-board .logic-cell.peg").length === 1
        ? "success" : "no_moves";
      track(outcome === "success" ? "result_success" : "result_no_moves", {
        from: "battle",
        outcome,
      });
    } else if (result.hidden) {
      resultVisible = false;
    }
  }).observe(result, { attributes: true, attributeFilter: ["hidden"] });
})();
