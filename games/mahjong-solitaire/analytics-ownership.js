(() => {
  "use strict";

  const GAME_ID = "mahjong-solitaire";
  const GAME_VERSION = "v5";
  const INTERFACE_VERSION = "6";
  const LOCALE_MAP = {
    en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko",
    es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar",
  };
  const INPUT_TYPES = new Set(["mouse", "pointer", "touch", "keyboard", "unknown"]);
  let inputType = "unknown";
  let started = false;
  let wasHidden = false;
  let returnSessionTracked = false;
  let resultVisible = false;

  const viewportBucket = () => {
    const width = Math.max(1, window.innerWidth || document.documentElement.clientWidth || 1);
    const height = Math.max(1, window.innerHeight || document.documentElement.clientHeight || 1);
    if (height <= 430) return "short-landscape";
    if (width <= 480) return "phone";
    if (width <= 900) return height > width ? "tablet-portrait" : "tablet-landscape";
    return height > width ? "desktop-portrait" : "desktop-landscape";
  };
  const locale = () => LOCALE_MAP[window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase()] || document.documentElement.lang || "en";
  const bounded = (value, max = 6) => Math.max(0, Math.min(max, Number(value) || 0));
  const remainingPairs = () => bounded(Math.ceil(document.querySelectorAll(".tile").length / 2));
  const eventInput = (event) => {
    const candidate = event?.detail === 0 ? "keyboard" : inputType;
    return INPUT_TYPES.has(candidate) ? candidate : "unknown";
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
    const target = event.target?.closest?.("button");
    if (!target || target.disabled || target.hidden) return;
    const input_type = eventInput(event);
    const screen = document.body.dataset.screen;
    if (target.matches("#startBtn") && screen === "main") {
      started = true;
      track("game_start", { from: "main", input_type });
      return;
    }
    if (target.matches("#hintBtn") && screen === "battle") {
      track("hint", { from: "battle", input_type });
      return;
    }
    if (target.matches("#restartBtn") && screen === "battle") {
      track("restart", { from: "battle", input_type });
      return;
    }
    if (target.matches("#retryBtn") && screen === "result") {
      track("replay", { from: "result", input_type });
      return;
    }
    if (target.matches("#homeBtn") && screen === "result") {
      track("main_return", { from: "result", input_type });
      return;
    }
    if (!target.matches(".tile") || screen !== "battle") return;

    const selectedBefore = document.querySelector(".tile.selected");
    const selectionPhase = selectedBefore ? "second" : "first";
    const tileCountBefore = document.querySelectorAll(".tile").length;
    track("tile_select", { from: "battle", selection_phase: selectionPhase, input_type });
    window.requestAnimationFrame(() => {
      const tileCountAfter = document.querySelectorAll(".tile").length;
      const mismatch = document.querySelector("#gameMessage[data-mahjong-mismatch='true']");
      if (tileCountAfter < tileCountBefore) {
        track("match", { from: "battle", pair_number: bounded(6 - remainingPairs(), 6), remaining_pairs: remainingPairs(), input_type });
      } else if (mismatch) {
        track("mismatch", { from: "battle", remaining_pairs: remainingPairs(), input_type });
      }
    });
  }, true);

  const result = document.querySelector("#resultScreen");
  if (result) new MutationObserver(() => {
    if (!result.hidden && !resultVisible) {
      resultVisible = true;
      track("result", { from: "battle", outcome: "success" });
    } else if (result.hidden) {
      resultVisible = false;
    }
  }).observe(result, { attributes: true, attributeFilter: ["hidden"] });
})();
