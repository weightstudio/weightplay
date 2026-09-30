(() => {
  "use strict";

  const panel = document.getElementById("tutorialPanel");
  const frame = document.getElementById("gameFrame");
  const openButton = document.getElementById("tutorialOpenBtn");
  const closeButton = document.getElementById("tutorialCloseBtn");
  const startButton = document.getElementById("tutorialStartBtn");
  const loadingPanel = document.getElementById("loadingPanel");
  if (!panel || !frame || !openButton || !closeButton || !startButton) return;

  const seenKey = "weightplay_tutorial_seen_animal-nest-weigh_v1";
  let returnFocus = null;

  function readSeen() {
    try { return localStorage.getItem(seenKey) === "1"; } catch { return false; }
  }

  function markSeen() {
    try { localStorage.setItem(seenKey, "1"); } catch { /* The tutorial still works without storage. */ }
  }

  function showTutorial(source = null) {
    if (!panel.hidden) return;
    returnFocus = source || (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    panel.hidden = false;
    panel.setAttribute("aria-hidden", "false");
    frame.inert = true;
    requestAnimationFrame(() => startButton.focus({ preventScroll: true }));
  }

  function hideTutorial(startPlaying = false) {
    if (panel.hidden) return;
    panel.hidden = true;
    panel.setAttribute("aria-hidden", "true");
    frame.inert = false;
    markSeen();
    if (startPlaying) {
      const startGame = document.getElementById("startBtn");
      startGame?.focus({ preventScroll: true });
      startGame?.click();
      return;
    }
    const target = returnFocus?.isConnected ? returnFocus : document.getElementById("startBtn");
    target?.focus({ preventScroll: true });
  }

  openButton.addEventListener("click", () => showTutorial(openButton));
  closeButton.addEventListener("click", () => hideTutorial(false));
  startButton.addEventListener("click", () => hideTutorial(true));
  panel.addEventListener("click", (event) => {
    if (event.target === panel) hideTutorial(false);
  });
  panel.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      hideTutorial(false);
      return;
    }
    if (event.key !== "Tab") return;
    const actions = [closeButton, startButton].filter((node) => !node.disabled && node.getClientRects().length);
    const index = actions.indexOf(document.activeElement);
    const next = event.shiftKey ? (index <= 0 ? actions.length - 1 : index - 1) : (index >= actions.length - 1 ? 0 : index + 1);
    event.preventDefault();
    actions[next]?.focus({ preventScroll: true });
  });

  const query = new URLSearchParams(window.location.search);
  const automationRun = ["qa", "test", "smoke", "tutorial-off"].some((key) => query.has(key));
  if (!automationRun && !readSeen()) {
    const startedAt = Date.now();
    const waitForLoading = () => {
      if (!loadingPanel || loadingPanel.hidden || loadingPanel.classList.contains("hidden") || Date.now() - startedAt > 4200) {
        window.setTimeout(() => showTutorial(), 120);
        return;
      }
      window.setTimeout(waitForLoading, 60);
    };
    waitForLoading();
  }
})();
