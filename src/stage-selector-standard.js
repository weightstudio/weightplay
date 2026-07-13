(function () {
  const STAGE_LOGICAL_WIDTH = 390;
  const STAGE_LOGICAL_HEIGHT = 788;
  const STAGE_RESERVE_HEIGHT = 56;
  const railSelector = ".stage-grid,.stage-rail,.mission-grid,.mission-rail,.region-rail,.level-grid";
  const installed = new WeakSet();
  const nativeStageScalers = new Set(["wonder-crash"]);
  const stageRootByGame = {
    "animal-guard-yard": "#menuPanel",
    "animal-quiz": ".animal-game",
    "animal-rune-tactics": "#menuPanel",
    "beast-deck": "#menuPanel",
  };
  const mainStartByGame = {
    "animal-abyss-diver": "#startBtn",
    "animal-auto-squad": "#showStageBtn",
    "animal-cafe-rush": "#mainStartBtn",
    "animal-gearpack-expedition": "#startBtn",
    "animal-guard-yard": "#startGameBtn",
    "animal-hero-trials": "#startBtn",
    "animal-hidden-safari": "#startGameBtn",
    "animal-moonlight-heist": "#startBtn",
    "animal-quiz": "#startGameBtn",
    "animal-reef-fisher": "#startBtn",
    "animal-relic-hunters": "#showStageBtn",
    "animal-rescue": "#showStageBtn",
    "animal-rope-rescue": "#startBtn",
    "animal-rune-tactics": "#mainStartBtn",
    "animal-skyport-dispatch": "#startBtn",
    "animal-word-trails": "#start",
    "beast-deck": "#mainStartBtn",
    "beast-tactician": "#startBtn",
    "bubble-bakery": "#startGameBtn",
    "color-lunchbox": "#startBtn",
    "garden-tiles": "#startBtn",
    "shadow-wolf": "#startBtn",
    "shape-train": "#startGameBtn",
    "snack-blocks": "#startBtn",
    "star-memory": "#startBtn",
    "tiny-weather-rescue": "#startGameBtn",
    "zoo-helper-day": "#startGameBtn",
  };

  function gameId() {
    return location.pathname.match(/\/games\/([^/]+)/)?.[1] || "";
  }

  function stageRootFor(rail) {
    const mapped = stageRootByGame[gameId()];
    if (mapped) {
      const root = document.querySelector(mapped);
      if (root?.contains(rail)) return root;
    }
    return rail.closest([
      "[data-wp-standard-stage-screen]",
      "[data-screen='stage']",
      "#stageScreen",
      "#stageView",
      "#stagePanel",
      "#stageSelectPanel",
      "#stageSelect",
      "#levelSelect",
      "#mapPanel",
      ".stage-screen",
      ".stage-shell",
      ".stage-panel",
      ".stage-select",
      ".level-select",
      ".world-map-panel",
    ].join(","));
  }

  function sharedReserve() {
    let reserve = document.querySelector(".wp-stage-physical-reserve");
    if (!reserve) {
      reserve = document.createElement("div");
      reserve.className = "wp-stage-physical-reserve";
      reserve.setAttribute("aria-hidden", "true");
      document.body.appendChild(reserve);
    }
    return reserve;
  }

  function updateStageCanvas() {
    const activeRails = [...document.querySelectorAll("[data-wp-stage-rail]")]
      .filter((rail) => rail.getClientRects().length && getComputedStyle(rail).visibility !== "hidden");
    document.querySelectorAll("[data-wp-logical-stage-canvas]").forEach((root) => {
      if (!activeRails.some((rail) => root.contains(rail))) root.removeAttribute("data-wp-logical-stage-canvas");
    });

    const useSharedScaler = activeRails.length > 0 && !nativeStageScalers.has(gameId());
    const reserve = sharedReserve();
    reserve.toggleAttribute("data-wp-stage-reserve-active", useSharedScaler);
    if (!useSharedScaler) return;

    const root = stageRootFor(activeRails[0]);
    if (!root) return;
    root.setAttribute("data-wp-logical-stage-canvas", "390x788");
    const viewport = window.visualViewport;
    const width = Math.max(1, viewport?.width || window.innerWidth);
    const height = Math.max(1, viewport?.height || window.innerHeight);
    const scale = Math.max(0.01, Math.min(
      Math.max(1, width - 8) / STAGE_LOGICAL_WIDTH,
      Math.max(1, height - STAGE_RESERVE_HEIGHT - 8) / STAGE_LOGICAL_HEIGHT
    ));
    const renderedWidth = STAGE_LOGICAL_WIDTH * scale;
    const renderedHeight = STAGE_LOGICAL_HEIGHT * scale;
    const left = (width - renderedWidth) / 2;
    const top = (height - renderedHeight - STAGE_RESERVE_HEIGHT) / 2;
    const style = document.documentElement.style;
    style.setProperty("--wp-stage-canvas-scale", String(scale));
    style.setProperty("--wp-stage-canvas-left", `${left}px`);
    style.setProperty("--wp-stage-canvas-top", `${top}px`);
    style.setProperty("--wp-stage-canvas-rendered-width", `${renderedWidth}px`);
    style.setProperty("--wp-stage-canvas-rendered-height", `${renderedHeight}px`);
    style.setProperty("--wp-stage-reserve-top", `${top + renderedHeight}px`);
  }

  function standardizeMainStart() {
    const button = document.querySelector(mainStartByGame[gameId()] || "[data-wp-main-start]");
    if (!button) return;
    button.dataset.wpMainStart = "true";
    const label = document.documentElement.lang.toLowerCase().startsWith("zh") ? "開始遊戲" : "Start Game";
    if (button.textContent.trim() !== label) button.textContent = label;
  }

  function updateStageState() {
    const active = [...document.querySelectorAll("[data-wp-stage-rail][data-wp-stage-initially-hidden='true']")]
      .some((rail) => rail.getClientRects().length && getComputedStyle(rail).visibility !== "hidden");
    document.body?.classList.toggle("wp-stage-select-active", active);
    updateStageCanvas();
  }

  function centerNearest(rail) {
    const cards = [...rail.children].filter((card) => card.matches(".stage-card,.mission-card,.region-card,button"));
    if (!cards.length) return;
    const railRect = rail.getBoundingClientRect();
    const coordinateScale = railRect.width > 0 ? rail.clientWidth / railRect.width : 1;
    const center = rail.scrollLeft + rail.clientWidth / 2;
    const nearest = cards.reduce((best, card) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = rail.scrollLeft + ((cardRect.left + cardRect.width / 2) - railRect.left) * coordinateScale;
      const distance = Math.abs(cardCenter - center);
      return !best || distance < best.distance ? { card, distance } : best;
    }, null)?.card;
    if (!nearest) return;
    const cardRect = nearest.getBoundingClientRect();
    const target = rail.scrollLeft + ((cardRect.left + cardRect.width / 2) - (railRect.left + railRect.width / 2)) * coordinateScale;
    rail.dataset.wpSnapTarget = String(target);
    rail.scrollTo({ left: Math.max(0, Math.min(target, rail.scrollWidth - rail.clientWidth)), behavior: "smooth" });
  }

  function install(rail) {
    if (installed.has(rail) || rail.dataset.stageDragInstalled === "true") return;
    installed.add(rail);
    rail.dataset.wpStageRail = "true";
    rail.dataset.wpStageInitiallyHidden = rail.getClientRects().length ? "false" : "true";
    let pointerId = null;
    let startX = 0;
    let startScroll = 0;
    let moved = false;
    let suppressClick = false;
    let previousScrollBehavior = "";
    let previousSnapType = "";

    rail.addEventListener("pointerdown", (event) => {
      if (event.button !== undefined && event.button !== 0) return;
      pointerId = event.pointerId;
      rail.dataset.wpDragDown = String(Number(rail.dataset.wpDragDown || 0) + 1);
      startX = event.clientX;
      startScroll = rail.scrollLeft;
      moved = false;
      previousScrollBehavior = rail.style.getPropertyValue("scroll-behavior");
      previousSnapType = rail.style.getPropertyValue("scroll-snap-type");
      rail.style.setProperty("scroll-behavior", "auto", "important");
      rail.style.setProperty("scroll-snap-type", "none", "important");
      rail.setPointerCapture?.(event.pointerId);
    }, true);

    rail.addEventListener("pointermove", (event) => {
      if (event.pointerId !== pointerId) return;
      const delta = event.clientX - startX;
      if (event.cancelable) event.preventDefault();
      rail.dataset.wpDragDelta = String(delta);
      rail.dataset.wpDragMove = String(Number(rail.dataset.wpDragMove || 0) + 1);
      if (Math.abs(delta) > 8) moved = true;
      rail.scrollLeft = startScroll - delta;
      rail.dataset.wpDragScroll = String(rail.scrollLeft);
    }, true);

    const finish = (event) => {
      if (pointerId === null) return;
      rail.releasePointerCapture?.(pointerId);
      pointerId = null;
      rail.classList.remove("wp-stage-dragging");
      if (previousScrollBehavior) rail.style.setProperty("scroll-behavior", previousScrollBehavior);
      else rail.style.removeProperty("scroll-behavior");
      if (previousSnapType) rail.style.setProperty("scroll-snap-type", previousSnapType);
      else rail.style.removeProperty("scroll-snap-type");
      if (moved) {
        event.preventDefault();
        suppressClick = true;
        window.setTimeout(() => { suppressClick = false; }, 0);
      }
      centerNearest(rail);
    };
    rail.addEventListener("pointerup", finish, true);
    rail.addEventListener("pointercancel", finish, true);
    document.addEventListener("pointerup", finish, true);
    document.addEventListener("pointercancel", finish, true);
    rail.addEventListener("click", (event) => {
      if (!suppressClick) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    }, true);
  }

  function scan(root = document) {
    if (document.body && !document.body.dataset.wpGameId) document.body.dataset.wpGameId = gameId();
    root.querySelectorAll?.(railSelector).forEach(install);
    standardizeMainStart();
    updateStageState();
  }

  scan();
  new MutationObserver((records) => {
    records.forEach((record) => record.addedNodes.forEach((node) => {
      if (!(node instanceof Element)) return;
      if (node.matches(railSelector)) install(node);
      scan(node);
    }));
    requestAnimationFrame(() => {
      standardizeMainStart();
      updateStageState();
    });
  }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "hidden", "lang"] });
  window.addEventListener("wonder:locale-change", standardizeMainStart);
  window.addEventListener("resize", updateStageCanvas, { passive: true });
  window.visualViewport?.addEventListener("resize", updateStageCanvas, { passive: true });
  window.visualViewport?.addEventListener("scroll", updateStageCanvas, { passive: true });
})();
