(function () {
  if (window.__weightPlayEdgeGuardInstalled) return;
  window.__weightPlayEdgeGuardInstalled = true;
  const audience = document.querySelector('meta[name="weightplay-audience"]')?.content === "kids" ? "kids" : "general";
  const isKidsAudience = audience === "kids";
  window.WeightPlayAudience = Object.freeze({
    mode: audience,
    isKids: isKidsAudience,
    reserveHeight: isKidsAudience ? 0 : 56,
  });

  if (isKidsAudience) {
    const removeAdvertisingGeometry = () => {
      document.querySelectorAll([
        "#stageAdReserve",
        "#battleAdReserve",
        "#adReserve",
        ".stage-ad-reserve",
        ".battle-ad-reserve",
        ".result-ad-reserve",
        ".physical-reserve",
        ".ad-reserve",
        "[data-ad-reserve]"
      ].join(",")).forEach((node) => node.remove());
    };
    if (document.readyState === "complete") removeAdvertisingGeometry();
    else window.addEventListener("load", removeAdvertisingGeometry, { once: true });
  }
  if (isKidsAudience) {
    document.documentElement.classList.add("wp-kids-audience");
    document.documentElement.dataset.audience = "kids";
    const applyKidsBody = () => {
      document.body?.classList.add("wp-kids-audience");
      if (document.body) document.body.dataset.audience = "kids";
    };
    applyKidsBody();
    document.addEventListener("DOMContentLoaded", applyKidsBody, { once: true });
  }

  const edgeSize = 44;
  const minSwipe = 8;
  const mobileGameMaxWidth = 820;
  let gesture = null;
  let immersiveFrame = null;
  const controlPointerIds = new Set();

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
    if (event.target?.closest?.("[data-allow-native-drag='true']")) return;
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

  function focusPlayableArea(element, { force = false } = {}) {
    if (!element || element.classList.contains("hidden")) return;
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (!force && document.body?.classList.contains("has-game-page-info") && window.scrollY > 20) return;
        const top = element.getBoundingClientRect().top + window.scrollY - 10;
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      });
    });
  }

  const focusContainerSelectors = [
    "[data-play-viewport]",
    ".weightplay-play-viewport",
    ".fixed-shell-host",
    ".game-shell",
    "#playPanel",
    ".play-panel",
    "#playArea",
    "#gameArea",
    "#gameStage",
    ".game-panel",
    ".battle-panel",
    ".quiz-stage",
    ".game-stage",
    ".stage-area",
    ".game-area",
    "main",
  ];

  const primaryFrameSelectors = [
    "[data-play-viewport]",
    ".weightplay-play-viewport",
    ".fixed-game-shell",
    ".game-shell",
    "#playPanel",
    "#playArea",
    "#gameArea",
    "#gameStage",
    "#gamePanel",
    ".play-panel",
    ".game-panel",
    ".battle-panel",
    ".quiz-stage",
    ".stage-area",
    ".game-area",
    "main",
  ];

  const narrowPlaySelectors = [
    "#gameBoardPanel",
    "#gameBoard",
    "#board",
    ".game-board-panel",
    ".game-board",
    ".play-area",
    ".playfield",
    "canvas",
  ];

  const immersiveTriggerSelectors = [
    ".play-area",
    ".playfield",
    ".game-board",
    ".game-board-panel",
    "canvas",
  ];

  function isMobileGameViewport() {
    const coarsePointer = window.matchMedia?.("(pointer: coarse)")?.matches;
    const narrowScreen = Math.min(window.innerWidth || 0, window.screen?.width || window.innerWidth || 0) <= mobileGameMaxWidth;
    return Boolean(coarsePointer && narrowScreen);
  }

  function updateVisualViewportVars() {
    const visualHeight = window.visualViewport?.height || window.innerHeight || document.documentElement.clientHeight || 0;
    const visualWidth = window.visualViewport?.width || window.innerWidth || document.documentElement.clientWidth || 0;
    if (visualHeight > 0) document.documentElement.style.setProperty("--wp-mobile-vh", `${visualHeight}px`);
    if (visualWidth > 0) document.documentElement.style.setProperty("--wp-mobile-vw", `${visualWidth}px`);
  }

  function hasHudAndPlayArea(element) {
    if (!element) return false;
    const hasHud = element.querySelector("#gameHud, #battleHud, .hud, .game-hud, .play-hud, .statusbar, .stage-status, .topbar");
    const hasPlay = element.querySelector("#gameBoardPanel, #gameBoard, #board, .game-board-panel, .game-board, .play-area, .playfield, canvas");
    return Boolean(hasHud && hasPlay);
  }

  function widenToPlayableFrame(element) {
    const declaredFrame = element?.closest?.("[data-play-viewport], .weightplay-play-viewport, .fixed-shell-host, .fixed-game-shell, .game-shell");
    if (declaredFrame && isVisible(declaredFrame)) return declaredFrame;
    let current = element;
    while (current && current !== document.body) {
      if (primaryFrameSelectors.some((selector) => current.matches?.(selector)) || hasHudAndPlayArea(current)) {
        return current;
      }
      current = current.parentElement;
    }
    return element;
  }

  function findPlayableFrame() {
    const container = focusContainerSelectors
      .map((selector) => document.querySelector(selector))
      .find((element) => isVisible(element));
    if (container) return container;

    const narrowTarget = narrowPlaySelectors
      .map((selector) => document.querySelector(selector))
      .find((element) => isVisible(element));
    return widenToPlayableFrame(narrowTarget);
  }

  function focusGame() {
    focusPlayableArea(findPlayableFrame(), { force: true });
  }

  function findImmersiveFrameFromEventTarget(target) {
    if (target?.closest?.("[data-no-mobile-immersive='true']")) return null;
    const declaredFrame = target?.closest?.("[data-play-viewport], .weightplay-play-viewport, .fixed-shell-host, .fixed-game-shell, .game-shell");
    if (declaredFrame && isVisible(declaredFrame)) return declaredFrame;
    // An in-game button must never promote only its closest panel. Keep the full game root stable.
    const gameRoot = target?.closest?.("main");
    if (gameRoot && isVisible(gameRoot)) return gameRoot;
    const direct = target?.closest?.(immersiveTriggerSelectors.join(","));
    if (direct && isVisible(direct)) return widenToPlayableFrame(direct);
    return findPlayableFrame();
  }

  function blockDoubleActivationZoom(event) {
    if (isEditable(event.target) || event.target?.closest?.("[data-allow-double-tap='true']")) return;
    event.preventDefault();
  }

  function markImmersiveFrame(frame) {
    if (!frame || !isMobileGameViewport()) return;
    if (immersiveFrame && immersiveFrame !== frame) immersiveFrame.classList.remove("weightplay-active-viewport");
    immersiveFrame = frame;
    document.documentElement.classList.add("wp-mobile-game-mode");
    document.body?.classList.add("wp-mobile-game-mode");
    frame.classList.add("weightplay-active-viewport");
    updateVisualViewportVars();
  }

  async function requestFullscreen(frame) {
    if (!frame || document.fullscreenElement || document.webkitFullscreenElement) return;
    const target = frame.requestFullscreen || document.documentElement.requestFullscreen
      ? frame
      : document.documentElement;
    const request =
      target.requestFullscreen ||
      target.webkitRequestFullscreen ||
      target.msRequestFullscreen ||
      document.documentElement.requestFullscreen ||
      document.documentElement.webkitRequestFullscreen;
    if (!request) return;
    try {
      await request.call(target, { navigationUI: "hide" });
    } catch (error) {
      // Mobile browsers may reject fullscreen outside supported elements; viewport sizing still improves play space.
    }
  }

  function enterMobileGameMode(target) {
    if (!isMobileGameViewport()) return;
    const frame = findImmersiveFrameFromEventTarget(target);
    if (!frame || !isVisible(frame)) return;
    markImmersiveFrame(frame);
    focusPlayableArea(frame, { force: true });
    requestFullscreen(frame);
  }

  function exitMobileGameMode() {
    immersiveFrame?.classList.remove("weightplay-active-viewport");
    immersiveFrame = null;
    document.documentElement.classList.remove("wp-mobile-game-mode");
    document.body?.classList.remove("wp-mobile-game-mode");
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    if (document.webkitFullscreenElement) document.webkitExitFullscreen?.();
  }

  function preserveGuideWheelScroll(event) {
    if (!document.body?.classList.contains("has-game-page-info")) return;
    if (event.ctrlKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    const startY = window.scrollY;
    const deltaY = event.deltaY;
    window.requestAnimationFrame(() => {
      if (!document.body?.classList.contains("has-game-page-info")) return;
      if (Math.abs(window.scrollY - startY) > 2) return;
      window.scrollBy({ top: deltaY, left: 0, behavior: "auto" });
    });
  }

  function installPlayableFocus() {
    const nodes = Array.from(document.querySelectorAll(focusContainerSelectors.join(",")));
    nodes.forEach((node) => {
      let wasVisible = isVisible(node);
      const observer = new MutationObserver(() => {
        const nowVisible = isVisible(node);
        if (wasVisible && !nowVisible && (node === immersiveFrame || node.classList.contains("weightplay-active-viewport"))) {
          exitMobileGameMode();
        }
        if (!wasVisible && nowVisible) {
          const frame = widenToPlayableFrame(node);
          focusPlayableArea(frame, { force: true });
          if (document.body?.classList.contains("wp-mobile-game-mode")) markImmersiveFrame(frame);
        }
        wasVisible = nowVisible;
      });
      observer.observe(node, { attributes: true, attributeFilter: ["class", "style", "hidden"] });
      if (wasVisible && node.matches("#playPanel, #playArea, .play-panel, [data-play-viewport], .weightplay-play-viewport, .game-shell")) {
        focusPlayableArea(widenToPlayableFrame(node));
      }
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

  function handlePointerUp(event) {
    const target = event.target;
    if (controlPointerIds.delete(event.pointerId)) return;
    if (isEditable(target)) return;
    if (target?.closest?.("button, a, [role='button'], input, select, textarea")) return;
    if (target?.closest?.("[data-no-mobile-immersive='true']")) return;
    if (!target?.closest?.("[data-enable-mobile-immersive='true']")) return;
    if (!target?.closest?.(immersiveTriggerSelectors.join(","))) return;
    enterMobileGameMode(target);
  }

  document.documentElement.style.overscrollBehaviorX = "none";
  document.body?.style.setProperty("overscroll-behavior-x", "none");
  document.documentElement.style.webkitTouchCallout = "none";
  document.documentElement.style.webkitTapHighlightColor = "transparent";
  document.documentElement.style.webkitUserSelect = "none";
  document.documentElement.style.userSelect = "none";
  document.documentElement.style.touchAction = "manipulation";
  document.body?.style.setProperty("-webkit-user-select", "none");
  document.body?.style.setProperty("user-select", "none");
  window.WeightPlayGame = {
    ...(window.WeightPlayGame || {}),
    focusGame,
    enterMobileGameMode: () => enterMobileGameMode(findPlayableFrame()),
    exitMobileGameMode,
    updateVisualViewportVars,
  };
  updateVisualViewportVars();
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
  window.addEventListener("pointerdown", (event) => {
    if (event.target?.closest?.("button, a, [role='button'], input, select, textarea")) controlPointerIds.add(event.pointerId);
  }, { passive: true, capture: true });
  window.addEventListener("pointerup", handlePointerUp, { passive: true, capture: true });
  window.addEventListener("pointercancel", (event) => controlPointerIds.delete(event.pointerId), { passive: true, capture: true });
  window.addEventListener("resize", updateVisualViewportVars, { passive: true });
  window.visualViewport?.addEventListener("resize", updateVisualViewportVars, { passive: true });
  window.visualViewport?.addEventListener("scroll", updateVisualViewportVars, { passive: true });
  window.addEventListener("wheel", preserveGuideWheelScroll, { passive: true, capture: true });
  window.addEventListener("selectstart", blockSelection, { capture: true });
  window.addEventListener("dragstart", blockNativeDrag, { capture: true });
  window.addEventListener("dblclick", blockDoubleActivationZoom, { passive: false, capture: true });
})();
