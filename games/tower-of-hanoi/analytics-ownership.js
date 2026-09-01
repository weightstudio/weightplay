(() => {
  "use strict";

  const GAME_ID = "tower-of-hanoi";
  const GAME_VERSION = "v12";
  const INTERFACE_VERSION = "6";
  const LOCALE_MAP = {
    en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko",
    es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar",
  };
  const DISK_COUNTS = { easy: 3, medium: 4, hard: 5 };
  let inputType = "unknown";
  let currentLevel = "easy";
  let moveCount = 0;
  let resultVisible = false;

  document.body.dataset.gameVersion = GAME_VERSION;
  document.body.dataset.interfaceVersion = INTERFACE_VERSION;

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
  const bounded = (value, max = 99) => Math.max(0, Math.min(max, Number(value) || 0));
  const levelDetails = (level = currentLevel) => ({ level, disk_count: DISK_COUNTS[level] || 3 });
  const eventInput = (event) => event?.detail === 0 ? "keyboard" : inputType;
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
  const snapshot = () => document.querySelectorAll(".logic-tower").length
    ? [...document.querySelectorAll(".logic-tower")].map((tower) => [...tower.querySelectorAll(".logic-disk")].map((disk) => Number(disk.textContent)))
    : [];
  const sameSnapshot = (before, after) => JSON.stringify(before) === JSON.stringify(after);

  document.addEventListener("pointerdown", rememberInput, true);
  document.addEventListener("keydown", rememberInput, true);
  document.addEventListener("click", (event) => {
    rememberInput(event);
    const target = event.target?.closest?.("button");
    if (!target || target.disabled || target.hidden) return;
    const input_type = eventInput(event);

    if (target.matches("#startButton")) {
      currentLevel = "easy";
      moveCount = 0;
      track("game_start", { from: "main", input_type, ...levelDetails() });
      return;
    }
    if (target.matches("#logicReset")) {
      moveCount = 0;
      track("new_puzzle", { from: "battle", input_type, ...levelDetails() });
      return;
    }
    if (target.matches("#resultReplay")) {
      moveCount = 0;
      track("result_action", { action: "replay", from: "result", input_type, ...levelDetails() });
      track("new_puzzle", { from: "result", input_type, ...levelDetails() });
      return;
    }
    if (target.matches("#resultMenu, #resultClose, #battleBack")) {
      track("result_action", { action: target.id === "resultMenu" ? "menu" : target.id === "resultClose" ? "close" : "battle_back", from: target.id === "battleBack" ? "battle" : "result", input_type, ...levelDetails() });
      return;
    }
    if (!target.matches(".logic-tower")) return;

    const selected = [...document.querySelectorAll(".logic-tower")].findIndex((tower) => tower.classList.contains("is-selected"));
    const targetIndex = [...document.querySelectorAll(".logic-tower")].indexOf(target);
    if (selected < 0 || selected === targetIndex) return;
    const before = snapshot();
    requestAnimationFrame(() => {
      const after = snapshot();
      if (sameSnapshot(before, after)) {
        track("invalid_move", { from: "battle", input_type, moves: bounded(moveCount), ...levelDetails() });
      } else {
        moveCount = bounded(moveCount + 1);
        track("legal_move", { from: "battle", input_type, moves: moveCount, move_number: moveCount, ...levelDetails() });
      }
    });
  }, true);

  document.addEventListener("change", (event) => {
    const target = event.target;
    if (!target?.matches?.(".logic-board-toolbar .logic-select")) return;
    const nextLevel = DISK_COUNTS[target.value] ? target.value : "easy";
    const previousLevel = currentLevel;
    currentLevel = nextLevel;
    moveCount = 0;
    track("level_change", { from_level: previousLevel, to_level: nextLevel, input_type: eventInput(event), ...levelDetails(nextLevel) });
  }, true);

  const result = document.querySelector("#logicResult");
  if (result) new MutationObserver(() => {
    if (!result.hidden && !resultVisible) {
      resultVisible = true;
      track("result_solved", { from: "battle", moves: bounded(moveCount), ...levelDetails() });
    } else if (result.hidden) {
      resultVisible = false;
    }
  }).observe(result, { attributes: true, attributeFilter: ["hidden"] });
})();
