(function () {
  const STAGE_LOGICAL_WIDTH = 390;
  const STAGE_LOGICAL_HEIGHT = 788;
  const STAGE_RESERVE_HEIGHT = 56;
  const railSelector = ".stage-grid,.stage-rail,.page-rail,.mission-grid,.mission-rail,.region-rail,.level-grid,.route-rail,.day-rail,.zone-row,.expedition-rail,.world-map-grid";
  const cardSelector = ".stage-card,.page-card,.mission-card,.region-card,.route-card,.day-card,.zone-card,.expedition-card,.zone-node,button";
  const installed = new WeakSet();
  const railVisibility = new WeakMap();
  const railHadCards = new WeakMap();
  const pendingRecommendation = new WeakMap();
  const pendingSettles = new WeakMap();
  const nativeStageScalers = new Set(["animal-auto-squad", "bubble-bakery", "color-lunchbox", "garden-tiles", "wonder-crash"]);
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

  function isKidsAudience() {
    return document.querySelector('meta[name="weightplay-audience"]')?.content?.toLowerCase() === "kids";
  }

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
    if (isKidsAudience()) return null;
    let reserve = document.querySelector(".wp-stage-physical-reserve");
    if (!reserve) {
      reserve = document.createElement("div");
      reserve.className = "wp-stage-physical-reserve";
      reserve.setAttribute("aria-hidden", "true");
      document.body.appendChild(reserve);
    }
    return reserve;
  }

  function stageRootVisible(root) {
    return Boolean(root && !root.hidden && !root.classList.contains("hidden") && root.getClientRects().length && getComputedStyle(root).visibility !== "hidden");
  }

  function updateStageCanvas() {
    if (isKidsAudience()) return;
    const activeRails = [...document.querySelectorAll("[data-wp-stage-rail]")]
      .filter((rail) => rail.getClientRects().length && getComputedStyle(rail).visibility !== "hidden");
    const retainedManagementRoot = [...document.querySelectorAll("[data-wp-logical-stage-canvas]")]
      .find(stageRootVisible) || null;
    document.querySelectorAll("[data-wp-logical-stage-canvas]").forEach((root) => {
      if (!activeRails.some((rail) => root.contains(rail)) && root !== retainedManagementRoot) root.removeAttribute("data-wp-logical-stage-canvas");
    });

    const useSharedScaler = (activeRails.length > 0 || retainedManagementRoot) && !nativeStageScalers.has(gameId());
    const reserve = sharedReserve();
    const nativeReserveActive = gameId() === "animal-auto-squad"
      && document.body.classList.contains("squad-stage-select");
    reserve.toggleAttribute("data-wp-stage-reserve-active", useSharedScaler || nativeReserveActive);
    if (!useSharedScaler) return;

    const root = activeRails.length ? stageRootFor(activeRails[0]) : retainedManagementRoot;
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
    const top = Math.max(4, height - STAGE_RESERVE_HEIGHT - 4 - renderedHeight);
    const style = document.documentElement.style;
    style.setProperty("--wp-stage-canvas-scale", String(scale));
    style.setProperty("--wp-stage-canvas-left", `${left}px`);
    style.setProperty("--wp-stage-canvas-top", `${top}px`);
    style.setProperty("--wp-stage-canvas-rendered-width", `${renderedWidth}px`);
    style.setProperty("--wp-stage-canvas-rendered-height", `${renderedHeight}px`);
    style.setProperty("--wp-stage-reserve-top", `${top + renderedHeight}px`);
  }

  function standardizeMainStart() {
    if (isKidsAudience()) return;
    const button = document.querySelector(mainStartByGame[gameId()] || "[data-wp-main-start]");
    if (!button) return;
    button.dataset.wpMainStart = "true";
    const label = document.documentElement.lang.toLowerCase().startsWith("zh") ? "開始遊戲" : "Start Game";
    if (button.textContent.trim() !== label) button.textContent = label;
  }

  function updateStageState() {
    if (isKidsAudience()) {
      document.body?.classList.remove("wp-stage-select-active");
      document.documentElement.classList.remove("wp-stage-select-active");
      return;
    }
    const activeRail = [...document.querySelectorAll("[data-wp-stage-rail][data-wp-stage-initially-hidden='true']")]
      .some((rail) => rail.getClientRects().length && getComputedStyle(rail).visibility !== "hidden");
    const activeManagementRoot = [...document.querySelectorAll("[data-wp-logical-stage-canvas]")]
      .some(stageRootVisible);
    const active = activeRail || activeManagementRoot
      || (gameId() === "animal-auto-squad" && document.body.classList.contains("squad-stage-select"));
    document.body?.classList.toggle("wp-stage-select-active", active);
    document.documentElement.classList.toggle("wp-stage-select-active", active);
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
    const allCards = stageCards(rail);
    // Locking controls entry, not whether future stages may be browsed.
    const cards = [...allCards];
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
      rail.dispatchEvent(new CustomEvent("wonder:stage-snap", {
        detail: { index: Number(nearest.dataset.index ?? nearest.dataset.stageIndex ?? -1) },
      }));
      restore();
      return;
    }
    const startedAt = performance.now();
    const startedLeft = rail.scrollLeft;
    const distance = boundedTarget - startedLeft;
    const configuredDuration = Number(rail.dataset.wpStageSettleDuration);
    const minimumDuration = Number.isFinite(configuredDuration)
      ? Math.min(480, Math.max(240, configuredDuration))
      : 240;
    const duration = Math.min(480, Math.max(minimumDuration, Math.abs(distance) * 1.35));
    const pending = {
      restore,
      frame: 0,
    };
    const animate = (now) => {
      if (pendingSettles.get(rail) !== pending) return;
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = rail.dataset.wpStageSettleEasing === "smoothstep"
        ? progress * progress * (3 - 2 * progress)
        : 1 - Math.pow(1 - progress, 2);
      rail.scrollLeft = startedLeft + distance * eased;
      if (progress < 1) {
        pending.frame = window.requestAnimationFrame(animate);
        return;
      }
      rail.scrollLeft = boundedTarget;
      pendingSettles.delete(rail);
      rail.dispatchEvent(new CustomEvent("wonder:stage-snap", {
        detail: { index: Number(nearest.dataset.index ?? nearest.dataset.stageIndex ?? -1) },
      }));
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
    const boundedTarget = Math.max(0, Math.min(target, rail.scrollWidth - rail.clientWidth));
    if (behavior === "auto") {
      const previousBehavior = rail.style.getPropertyValue("scroll-behavior");
      const previousPriority = rail.style.getPropertyPriority("scroll-behavior");
      rail.style.setProperty("scroll-behavior", "auto", "important");
      rail.scrollLeft = boundedTarget;
      if (previousBehavior) rail.style.setProperty("scroll-behavior", previousBehavior, previousPriority);
      else rail.style.removeProperty("scroll-behavior");
      return;
    }
    rail.scrollTo({ left: boundedTarget, behavior });
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
    railHadCards.set(rail, stageCards(rail).length > 0);
    let pointerId = null;
    let startX = 0;
    let startScroll = 0;
    let moved = false;
    let suppressNextClick = false;
    let suppressClickTimer = 0;
    let previousScrollBehavior = "";
    let previousSnapType = "";

    rail.addEventListener("pointerdown", (event) => {
      if (event.isPrimary === false) return;
      if (event.button !== undefined && event.button !== 0) return;
      cancelPendingSettle(rail);
      pointerId = event.pointerId;
      rail.dataset.wpDragDown = "1";
      startX = event.clientX;
      startScroll = rail.scrollLeft;
      rail.dataset.wpDragStartScroll = String(startScroll);
      rail.dataset.wpDragApplied = "0";
      moved = false;
      previousScrollBehavior = rail.style.getPropertyValue("scroll-behavior");
      previousSnapType = rail.style.getPropertyValue("scroll-snap-type");
      rail.style.setProperty("scroll-behavior", "auto", "important");
      rail.style.setProperty("scroll-snap-type", "none", "important");
      rail.scrollLeft = startScroll;
      if (isKidsAudience()) event.stopPropagation();
    }, true);

    // Listen on document until the drag threshold is crossed. This keeps a
    // fast swipe alive after it leaves a card without capturing ordinary taps.
    document.addEventListener("pointermove", (event) => {
      if (event.pointerId !== pointerId) return;
      const delta = event.clientX - startX;
      const railRect = rail.getBoundingClientRect();
      const coordinateScale = railRect.width > 0 ? rail.clientWidth / railRect.width : 1;
      rail.dataset.wpDragDelta = String(delta);
      rail.dataset.wpDragMove = String(Number(rail.dataset.wpDragMove || 0) + 1);
      if (!moved && Math.abs(delta) > 4) {
        moved = true;
        rail.classList.add("wp-stage-dragging");
        try {
          rail.setPointerCapture?.(event.pointerId);
        } catch {
          // Synthetic tests may not own pointer capture.
        }
      }
      if (!moved) return;
      if (event.cancelable) event.preventDefault();
      rail.scrollLeft = startScroll - delta * coordinateScale;
      rail.dataset.wpDragScroll = String(rail.scrollLeft);
      rail.dataset.wpDragApplied = String(rail.scrollLeft - startScroll);
      if (isKidsAudience()) event.stopPropagation();
    }, true);

    const finish = (event = {}) => {
      if (pointerId === null) return;
      if (event.pointerId !== undefined && event.pointerId !== pointerId) return;
      const activePointerId = pointerId;
      const didMove = moved;
      pointerId = null;
      moved = false;
      rail.dataset.wpDragDown = "0";
      rail.classList.remove("wp-stage-dragging");
      try {
        if (rail.hasPointerCapture?.(activePointerId)) rail.releasePointerCapture(activePointerId);
      } catch {
        // Pointer capture may already be gone when the browser cancels a gesture.
      }
      const restore = () => {
        if (previousScrollBehavior) rail.style.setProperty("scroll-behavior", previousScrollBehavior);
        else rail.style.removeProperty("scroll-behavior");
        if (previousSnapType) rail.style.setProperty("scroll-snap-type", previousSnapType);
        else rail.style.removeProperty("scroll-snap-type");
      };
      if (didMove) {
        if (event.cancelable) event.preventDefault();
        suppressNextClick = true;
        window.clearTimeout(suppressClickTimer);
        // Keep the flag only through the browser's synthetic click dispatched
        // for this pointerup; a deliberate next tap must never be delayed.
        suppressClickTimer = window.setTimeout(() => { suppressNextClick = false; }, 0);
        centerNearest(rail, restore);
      } else {
        restore();
      }
    };
    const finishKidsPointer = (event) => {
      const ownsPointer = pointerId !== null && (event.pointerId === undefined || event.pointerId === pointerId);
      finish(event);
      if (ownsPointer && isKidsAudience()) event.stopPropagation();
    };
    rail.addEventListener("pointerup", finishKidsPointer, true);
    rail.addEventListener("pointercancel", finishKidsPointer, true);
    document.addEventListener("pointerup", finishKidsPointer, true);
    document.addEventListener("pointercancel", finishKidsPointer, true);
    rail.addEventListener("click", (event) => {
      if (!suppressNextClick) return;
      suppressNextClick = false;
      window.clearTimeout(suppressClickTimer);
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
      document.querySelectorAll(railSelector).forEach((rail) => {
        const hasCards = stageCards(rail).length > 0;
        const gainedInitialCards = hasCards && !railHadCards.get(rail);
        railHadCards.set(rail, hasCards);
        // Replacing a label or lock marker inside an active rail must not pull
        // the player back to the recommended stage. Recenter only when the
        // rail receives its first usable card set; visibility transitions are
        // handled by scheduleRecommendedCenter itself.
        scheduleRecommendedCenter(rail, gainedInitialCards);
      });
    });
  }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "hidden", "lang"] });
  window.addEventListener("wonder:locale-change", standardizeMainStart);
  window.addEventListener("resize", updateStageCanvas, { passive: true });
  window.visualViewport?.addEventListener("resize", updateStageCanvas, { passive: true });
  window.visualViewport?.addEventListener("scroll", updateStageCanvas, { passive: true });
})();
