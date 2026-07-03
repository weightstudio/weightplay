(function () {
  const edgeSize = 44;
  const minSwipe = 8;
  let gesture = null;

  function isEditable(target) {
    return Boolean(target?.closest?.("input, textarea, select, [contenteditable='true'], [data-allow-select='true']"));
  }

  function shouldBlockSelection(target) {
    return !isEditable(target);
  }

  function blockSelection(event) {
    if (shouldBlockSelection(event.target)) event.preventDefault();
  }

  function blockNativeDrag(event) {
    if (shouldBlockSelection(event.target)) event.preventDefault();
  }

  function markNonDraggableMedia() {
    document.querySelectorAll("img, svg, canvas").forEach((element) => {
      if (!element.hasAttribute("draggable")) element.setAttribute("draggable", "false");
    });
  }

  function isVisible(element) {
    if (!element || element.hidden || element.classList.contains("hidden")) return false;
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function focusPlayableArea(element) {
    if (!element || element.classList.contains("hidden")) return;
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const top = element.getBoundingClientRect().top + window.scrollY - 10;
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      });
    });
  }

  function focusGame() {
    const selectors = [
      "#playArea",
      "#playPanel",
      "#gameArea",
      "#gameStage",
      "#gameBoard",
      "#gameBoardPanel",
      "#gameHud",
      "#board",
      ".battle-panel",
      ".game-panel",
      ".play-panel",
      ".game-board-panel",
      ".quiz-stage",
      ".play-area",
      ".stage-area",
      ".game-area",
      ".game-stage",
      ".game-board",
      "canvas",
      "main",
    ];
    const target = selectors
      .map((selector) => document.querySelector(selector))
      .find((element) => isVisible(element));
    focusPlayableArea(target);
  }

  function installPlayableFocus() {
    const selectors = [
      "#playArea",
      "#playPanel",
      "#gameArea",
      "#gameStage",
      "#gameBoard",
      "#gameBoardPanel",
      "#gameHud",
      "#board",
      ".battle-panel",
      ".game-panel",
      ".play-panel",
      ".game-board-panel",
      ".quiz-stage",
      ".play-area",
      ".stage-area",
      ".game-area",
      ".game-stage",
      ".game-board",
      "canvas",
    ];
    const nodes = Array.from(document.querySelectorAll(selectors.join(",")));
    nodes.forEach((node) => {
      let wasVisible = isVisible(node);
      const observer = new MutationObserver(() => {
        const nowVisible = isVisible(node);
        if (!wasVisible && nowVisible) focusPlayableArea(node);
        wasVisible = nowVisible;
      });
      observer.observe(node, { attributes: true, attributeFilter: ["class", "style", "hidden"] });
      if (wasVisible && node.matches("#playPanel, #playArea, .play-panel, .play-area")) focusPlayableArea(node);
    });
  }

  function start(event) {
    if (event.touches.length !== 1 || isEditable(event.target)) {
      gesture = null;
      return;
    }

    const touch = event.touches[0];
    const width = window.innerWidth || document.documentElement.clientWidth || 0;
    const fromEdge = touch.clientX <= edgeSize || touch.clientX >= width - edgeSize;

    gesture = fromEdge
      ? { x: touch.clientX, y: touch.clientY, blocking: false }
      : null;
  }

  function move(event) {
    if (!gesture || event.touches.length !== 1) return;

    const touch = event.touches[0];
    const dx = touch.clientX - gesture.x;
    const dy = touch.clientY - gesture.y;
    const horizontal = Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > minSwipe;

    if (horizontal) gesture.blocking = true;
    if (gesture.blocking) event.preventDefault();
  }

  function end() {
    gesture = null;
  }

  document.documentElement.style.overscrollBehaviorX = "none";
  document.body?.style.setProperty("overscroll-behavior-x", "none");
  document.documentElement.style.webkitTouchCallout = "none";
  document.documentElement.style.webkitTapHighlightColor = "transparent";
  document.documentElement.style.webkitUserSelect = "none";
  document.documentElement.style.userSelect = "none";
  document.body?.style.setProperty("-webkit-user-select", "none");
  document.body?.style.setProperty("user-select", "none");
  window.WeightPlayGame = {
    ...(window.WeightPlayGame || {}),
    focusGame,
  };
  markNonDraggableMedia();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", markNonDraggableMedia, { once: true });
    document.addEventListener("DOMContentLoaded", installPlayableFocus, { once: true });
  } else {
    installPlayableFocus();
  }
  window.addEventListener("touchstart", start, { passive: true, capture: true });
  window.addEventListener("touchmove", move, { passive: false, capture: true });
  window.addEventListener("touchend", end, { passive: true, capture: true });
  window.addEventListener("touchcancel", end, { passive: true, capture: true });
  window.addEventListener("selectstart", blockSelection, { capture: true });
  window.addEventListener("dragstart", blockNativeDrag, { capture: true });
})();
