(() => {
  "use strict";

  const GAME_ID = "animal-mosaic-clues";
  const GAME_VERSION = "v13";
  const INTERFACE_VERSION = "6";
  let inputType = "unknown";
  let resultVisible = false;
  let lastMistakes = 0;
  let lastView = document.body.dataset.screen || "main";

  const viewportBucket = () => {
    const width = window.innerWidth || 0;
    const height = window.innerHeight || 0;
    if (width >= 700 && width > height) return "short-landscape";
    if (width < 480 && height >= width) return "phone-portrait";
    if (width <= 900) return "tablet";
    return "desktop";
  };
  const locale = () => window.WonderI18n?.actualLocale?.() || document.documentElement.lang || "en";
  const stage = () => Number(document.querySelector("#stageLabel")?.textContent?.match(/\d+/)?.[0] || 0) || null;
  const boundedMistakes = () => Math.max(0, Math.min(99, Number(document.querySelector("#statB")?.textContent || 0) || 0));
  const eventInput = event => event?.detail === 0 ? "keyboard" : inputType;
  const track = (name, details = {}) => {
    try {
      window.WonderAnalytics?.track?.(name, {
        game_id: GAME_ID,
        game_version: GAME_VERSION,
        interface_version: INTERFACE_VERSION,
        locale: locale(),
        viewport_bucket: viewportBucket(),
        input_type: details.input_type || inputType,
        stage: details.stage ?? stage(),
        hint_count: Math.max(0, Math.min(99, Number(document.querySelector("#resultC")?.textContent || 0) || 0)),
        mistake_count: boundedMistakes(),
        ...details,
      });
    } catch {
      // Measurement must never interrupt the puzzle loop.
    }
  };

  document.addEventListener("pointerdown", event => {
    if (event.isTrusted) inputType = event.pointerType === "touch" ? "touch" : "pointer";
    if (event.target.closest?.("#arena")) track("cell_commit", { input_type: inputType });
  }, true);
  document.addEventListener("keydown", event => {
    if (!event.repeat) inputType = "keyboard";
  }, true);

  document.addEventListener("click", event => {
    const target = event.target.closest?.("#start, .stage-card, #mosaicHint, #mosaicUndo, #mosaicReset, #next, #retry, #resultStage, #stageBack");
    if (!target || target.disabled || target.hidden) return;
    const input_type = eventInput(event);
    if (target.id === "start") return track("stage_view", { from: "main", input_type });
    if (target.matches(".stage-card")) {
      if (!target.classList.contains("locked")) track("stage_start", { stage: Number(target.dataset.stage) || null, input_type });
      return;
    }
    if (target.id === "mosaicHint") {
      track("hint_open", { input_type });
      requestAnimationFrame(() => track("hint_target_activate", {
        input_type,
        target_visible: (() => {
          const cursor = document.querySelector("#mosaicKeyboardCursor");
          return Boolean(cursor && getComputedStyle(cursor).display === "block");
        })(),
      }));
    } else if (target.id === "mosaicUndo") track("undo", { input_type });
    else if (target.id === "mosaicReset") track("restart", { input_type });
    else if (target.id === "next") track("next_stage", { input_type, from_stage: stage(), to_stage: stage() ? stage() + 1 : null });
    else if (target.id === "retry") track("replay", { input_type, from: "result" });
    else if (target.id === "resultStage") track("return_session", { input_type, from: "result" });
    else if (target.id === "stageBack") track("return_session", { input_type, from: document.body.dataset.screen || "stage" });
  }, true);

  const result = document.querySelector("#resultModal");
  if (result) new MutationObserver(() => {
    if (!result.hidden && !resultVisible) {
      resultVisible = true;
      track("result", { outcome: document.querySelector("#resultTitle")?.textContent?.includes("Complete") ? "win" : "unknown" });
    } else if (result.hidden) resultVisible = false;
  }).observe(result, { attributes: true, attributeFilter: ["hidden"] });

  const mistakes = document.querySelector("#statB");
  if (mistakes) new MutationObserver(() => {
    const current = boundedMistakes();
    if (current > lastMistakes) track("mistake", { count: current });
    lastMistakes = current;
  }).observe(mistakes, { childList: true, characterData: true, subtree: true });

  window.addEventListener("weightplay:game-view-change", event => {
    const view = event.detail?.view;
    if (view === "stage") track("stage_view", { from: "shell" });
    if (view === "battle" && lastView === "stage") track("stage_start", { from: "stage", input_type: inputType });
    if (view) lastView = view;
  });
})();
