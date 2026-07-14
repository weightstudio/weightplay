(function () {
  const STAGE_LOGICAL_WIDTH = 390;
  const STAGE_LOGICAL_HEIGHT = 788;
  const STAGE_RESERVE_HEIGHT = 56;
  const railSelector = ".stage-grid,.stage-rail,.mission-grid,.mission-rail,.region-rail,.level-grid,.route-rail,.day-rail,.zone-row,.expedition-rail,.world-map-grid";
  const cardSelector = ".stage-card,.mission-card,.region-card,.route-card,.day-card,.zone-card,.expedition-card,.zone-node,button";
  const installed = new WeakSet();
  const railVisibility = new WeakMap();
  const pendingRecommendation = new WeakMap();
  const pendingSettles = new WeakMap();
  const nativeStageScalers = new Set(["bubble-bakery", "color-lunchbox", "garden-tiles", "wonder-crash"]);
  const stageRootByGame = {
    "animal-guard-yard": "#menuPanel",
    "animal-quiz": ".animal-game",
    "animal-rune-tactics": "#menuPanel",
    "beast-deck": ".beast-deck-app",
    "star-memory": ".memory-game",
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

  function cancelPendingSettle(rail, restore = true) {
    const pending = pendingSettles.get(rail);
    if (!pending) return;
    window.cancelAnimationFrame(pending.frame);
    pendingSettles.delete(rail);
    if (restore) pending.restore();
  }

  function centerNearest(rail, restore) {
    const cards = stageCards(rail);
    if (!cards.length) {
      restore();
      return;
    }
    const railRect = rail.getBoundingClientRect();
    const coordinateScale = railRect.width > 0 ? rail.clientWidth / railRect.width : 1;
    const center = rail.scrollLeft + rail.clientWidth / 2;
    const nearest = cards.reduce((best, card) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = rail.scrollLeft + ((cardRect.left + cardRect.width / 2) - railRect.left) * coordinateScale;
      const distance = Math.abs(cardCenter - center);
      return !best || distance < best.distance ? { card, distance } : best;
    }, null)?.card;
    if (!nearest) {
      restore();
      return;
    }
    const cardRect = nearest.getBoundingClientRect();
    const target = rail.scrollLeft + ((cardRect.left + cardRect.width / 2) - (railRect.left + railRect.width / 2)) * coordinateScale;
    const boundedTarget = Math.max(0, Math.min(target, rail.scrollWidth - rail.clientWidth));
    rail.dataset.wpSnapTarget = String(boundedTarget);
    if (Math.abs(boundedTarget - rail.scrollLeft) < 1) {
      rail.scrollLeft = boundedTarget;
      restore();
      return;
    }
    const startedAt = performance.now();
    const startedLeft = rail.scrollLeft;
    const distance = boundedTarget - startedLeft;
    const duration = Math.min(300, Math.max(180, Math.abs(distance) * 1.15));
    const pending = {
      restore,
      frame: 0,
    };
    const animate = (now) => {
      if (pendingSettles.get(rail) !== pending) return;
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      rail.scrollLeft = startedLeft + distance * eased;
      if (progress < 1) {
        pending.frame = window.requestAnimationFrame(animate);
        return;
      }
      rail.scrollLeft = boundedTarget;
      pendingSettles.delete(rail);
      restore();
    };
    pendingSettles.set(rail, pending);
    pending.frame = window.requestAnimationFrame(animate);
  }

  function stageCards(rail) {
    return [...rail.querySelectorAll(cardSelector)];
  }

  function isUnlockedCard(card) {
    return !card.disabled
      && card.getAttribute("aria-disabled") !== "true"
      && !card.classList.contains("locked")
      && !card.classList.contains("is-locked")
      && !card.hasAttribute("data-locked");
  }

  function recommendedCard(rail) {
    const unlocked = stageCards(rail).filter(isUnlockedCard);
    return unlocked.at(-1) || null;
  }

  function centerCard(rail, card, behavior = "auto") {
    if (!card || !rail.getClientRects().length) return;
    const railRect = rail.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const coordinateScale = railRect.width > 0 ? rail.clientWidth / railRect.width : 1;
    const target = rail.scrollLeft
      + ((cardRect.left + cardRect.width / 2) - (railRect.left + railRect.width / 2)) * coordinateScale;
    rail.scrollTo({
      left: Math.max(0, Math.min(target, rail.scrollWidth - rail.clientWidth)),
      behavior,
    });
  }

  function scheduleRecommendedCenter(rail, force = false) {
    if (pendingRecommendation.has(rail)) {
      pendingRecommendation.set(rail, pendingRecommendation.get(rail) || force);
      return;
    }
    pendingRecommendation.set(rail, force);
    requestAnimationFrame(() => {
      force = pendingRecommendation.get(rail) || false;
      pendingRecommendation.delete(rail);
      const visible = Boolean(rail.getClientRects().length && getComputedStyle(rail).visibility !== "hidden");
      const wasVisible = railVisibility.get(rail) || false;
      railVisibility.set(rail, visible);
      if (!visible || (!force && wasVisible)) return;
      const recommended = recommendedCard(rail);
      stageCards(rail).forEach((card) => {
        if (card === recommended) card.dataset.wpStageRecommended = "true";
        else delete card.dataset.wpStageRecommended;
      });
      centerCard(rail, recommended, "auto");
      requestAnimationFrame(() => centerCard(rail, recommended, "auto"));
    });
  }

  function install(rail) {
    if (installed.has(rail)) return;
    installed.add(rail);
    rail.dataset.wpStageRail = "true";
    rail.dataset.wpStageInitiallyHidden = rail.getClientRects().length ? "false" : "true";
    railVisibility.set(rail, Boolean(rail.getClientRects().length));
    let pointerId = null;
    let startX = 0;
    let startScroll = 0;
    let moved = false;
    let suppressClick = false;
    let previousScrollBehavior = "";
    let previousSnapType = "";

    rail.addEventListener("pointerdown", (event) => {
      if (event.isPrimary === false) return;
      if (event.button !== undefined && event.button !== 0) return;
      cancelPendingSettle(rail);
      pointerId = event.pointerId;
      rail.dataset.wpDragDown = String(Number(rail.dataset.wpDragDown || 0) + 1);
      startX = event.clientX;
      startScroll = rail.scrollLeft;
      rail.dataset.wpDragStartScroll = String(startScroll);
      rail.dataset.wpDragApplied = "0";
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
      rail.dataset.wpDragDelta = String(delta);
      rail.dataset.wpDragMove = String(Number(rail.dataset.wpDragMove || 0) + 1);
      if (!moved && Math.abs(delta) > 8) {
        moved = true;
        rail.classList.add("wp-stage-dragging");
      }
      if (!moved) return;
      if (event.cancelable) event.preventDefault();
      rail.scrollLeft = startScroll - delta;
      rail.dataset.wpDragScroll = String(rail.scrollLeft);
      rail.dataset.wpDragApplied = String(rail.scrollLeft - startScroll);
    }, true);

    const finish = (event) => {
      if (pointerId === null) return;
      rail.releasePointerCapture?.(pointerId);
      pointerId = null;
      rail.classList.remove("wp-stage-dragging");
      const restore = () => {
        if (previousScrollBehavior) rail.style.setProperty("scroll-behavior", previousScrollBehavior);
        else rail.style.removeProperty("scroll-behavior");
        if (previousSnapType) rail.style.setProperty("scroll-snap-type", previousSnapType);
        else rail.style.removeProperty("scroll-snap-type");
      };
      if (moved) {
        if (event.cancelable) event.preventDefault();
        suppressClick = true;
        rail.dataset.wpSuppressClick = "true";
        window.setTimeout(() => {
          suppressClick = false;
          rail.dataset.wpSuppressClick = "false";
        }, 240);
        centerNearest(rail, restore);
      } else {
        restore();
      }
    };
    rail.addEventListener("pointerup", finish, true);
    rail.addEventListener("pointercancel", finish, true);
    document.addEventListener("pointerup", finish, true);
    document.addEventListener("pointercancel", finish, true);
    rail.addEventListener("click", (event) => {
      if (!suppressClick) {
        rail.dataset.wpLastClick = "allowed";
        return;
      }
      rail.dataset.wpLastClick = "suppressed";
      event.preventDefault();
      event.stopImmediatePropagation();
    }, true);
    rail.addEventListener("dragstart", (event) => event.preventDefault(), true);
    scheduleRecommendedCenter(rail, true);
  }

  function scan(root = document) {
    if (document.body && !document.body.dataset.wpGameId) document.body.dataset.wpGameId = gameId();
    root.querySelectorAll?.(railSelector).forEach(install);
    document.querySelectorAll(railSelector).forEach((rail) => scheduleRecommendedCenter(rail));
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
      document.querySelectorAll(railSelector).forEach((rail) => scheduleRecommendedCenter(rail, records.some((record) => record.type === "childList" && rail.contains(record.target))));
    });
  }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "hidden", "lang"] });
  window.addEventListener("wonder:locale-change", standardizeMainStart);
  window.addEventListener("resize", updateStageCanvas, { passive: true });
  window.visualViewport?.addEventListener("resize", updateStageCanvas, { passive: true });
  window.visualViewport?.addEventListener("scroll", updateStageCanvas, { passive: true });
})();
