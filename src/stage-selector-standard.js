(function () {
  const STAGE_LOGICAL_WIDTH = 390;
  const STAGE_LOGICAL_HEIGHT = 788;
  const STAGE_RESERVE_HEIGHT = 56;
  const DESKTOP_CANVAS_MAX_WIDTH = 920;
  const railSelector = "[data-wp-stage-rail],.stage-grid,.stage-rail,.page-rail,.mission-grid,.mission-rail,.region-rail,.level-grid,.route-rail,.day-rail,.zone-row,.expedition-rail,.world-map-grid";
  const cardSelector = ".stage-card,.page-card,.mission-card,.region-card,.route-card,.day-card,.zone-card,.expedition-card,.zone-node,button";
  const installed = new WeakSet();
  const railVisibility = new WeakMap();
  const railHadCards = new WeakMap();
  const pendingRecommendation = new WeakMap();
  const pendingSettles = new WeakMap();
  const metrics = window.__weightPlayLayoutMetrics ||= {};
  metrics.stageObserverFlushes ||= 0;
  metrics.stageCanvasApplied ||= 0;
  let appliedStageRoot = null;
  let appliedStageReserve = null;
  let appliedStageWidth = 0;
  let appliedStageHeight = 0;
  const savedStageStyles = new WeakMap();
  const savedReserveStyles = new WeakMap();
  const nativeStageScalers = new Set(["wonder-crash", "animal-rope-rescue", "animal-coloring-studio", "animal-bubble-safari", "animal-rune-reels", "animal-triple-match"]);
  const stageRootByGame = {
    "animal-color-link": "#stage",
    "animal-guard-yard": "#menuPanel",
    "animal-quiz": ".animal-game",
    "animal-rune-tactics": "#menuPanel",
    "animal-tangram": "#stage",
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
    "animal-one-line": "#startBtn",
    "animal-orb-fortress": "#startBtn",
    "animal-quiz": "#startGameBtn",
    "animal-reef-fisher": "#startBtn",
    "animal-relic-hunters": "#showStageBtn",
    "animal-rescue": "#showStageBtn",
    "animal-rope-rescue": "#startBtn",
    "animal-rune-tactics": "#mainStartBtn",
    "animal-skyport-dispatch": "#startBtn",
    "animal-starlight-trails": "#startBtn",
    "animal-word-trails": "#start",
    "beast-deck": "#mainStartBtn",
    "beast-tactician": "#startBtn",
    "bubble-bakery": "#startGameBtn",
    "color-lunchbox": "#startBtn",
    "fruit-merge": "#startBtn",
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
    let root = null;
    if (mapped) {
      const mappedRoot = document.querySelector(mapped);
      if (mappedRoot?.contains(rail)) root = mappedRoot;
    }
    root ||= rail.closest([
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
    root ||= rail.closest("main") || rail.parentElement;
    if (!root) return null;
    for (let ancestor = root.parentElement; ancestor && ancestor !== document.body; ancestor = ancestor.parentElement) {
      const style = getComputedStyle(ancestor);
      if (style.transform !== "none" || style.perspective !== "none" || style.filter !== "none") root = ancestor;
    }
    return root;
  }

  function ensureStageArtwork(rail) {
    const root = stageRootFor(rail);
    if (!root) return;
    let art = getComputedStyle(root).getPropertyValue("--wp-stage-art").trim();
    let sourceUrl = art.match(/url\((['"]?)(.*?)\1\)/i)?.[2] || "";
    if (!art || art === "none") {
      const poster = document.querySelector(
        ".wp-standard-main-poster-media,img.main-poster,img.main-cover,img.cover,img.poster,.hero img,.main-cover img",
      );
      const source = poster?.currentSrc || poster?.src || document.querySelector('meta[property="og:image"]')?.content || "";
      if (source) {
        const url = new URL(source, location.href).href.replaceAll('"', '\\"');
        root.style.setProperty("--wp-stage-art", `url("${url}")`);
        art = `url("${url}")`;
        sourceUrl = url;
      }
    }
    if (art && art !== "none") {
      root.classList.add("wp-stage-art-shell");
      if (sourceUrl) root.dataset.wpStageArt = new URL(sourceUrl, location.href).href;
    }
  }

  function rememberStageStyles(root) {
    if (!root || savedStageStyles.has(root)) return;
    const properties = ["position", "inset", "top", "right", "bottom", "left", "box-sizing", "width", "min-width", "max-width", "height", "min-height", "max-height", "margin", "overflow", "transform", "transform-origin"];
    savedStageStyles.set(root, Object.fromEntries(properties.map((property) => [property, [root.style.getPropertyValue(property), root.style.getPropertyPriority(property)]])));
  }

  function restoreStageStyles(root) {
    const saved = root && savedStageStyles.get(root);
    if (!saved) return;
    Object.entries(saved).forEach(([property, [value, priority]]) => {
      if (value) root.style.setProperty(property, value, priority);
      else root.style.removeProperty(property);
    });
    savedStageStyles.delete(root);
    root.removeAttribute("data-wp-logical-stage-canvas");
  }

  function rememberReserveStyles(reserve) {
    if (!reserve || savedReserveStyles.has(reserve)) return;
    const properties = ["position", "inset", "top", "right", "bottom", "left", "width", "min-width", "max-width", "height", "min-height", "transform"];
    savedReserveStyles.set(reserve, Object.fromEntries(properties.map((property) => [property, [reserve.style.getPropertyValue(property), reserve.style.getPropertyPriority(property)]])));
  }

  function restoreReserveStyles(reserve) {
    const saved = reserve && savedReserveStyles.get(reserve);
    if (!saved) return;
    Object.entries(saved).forEach(([property, [value, priority]]) => {
      if (value) reserve.style.setProperty(property, value, priority);
      else reserve.style.removeProperty(property);
    });
    savedReserveStyles.delete(reserve);
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
    const reserveHeight = isKidsAudience() ? 0 : STAGE_RESERVE_HEIGHT;
    const activeRails = [...document.querySelectorAll("[data-wp-stage-rail]")]
      .filter((rail) => rail.getClientRects().length && getComputedStyle(rail).visibility !== "hidden");
    document.querySelectorAll("[data-wp-logical-stage-canvas]").forEach((root) => {
      if (!activeRails.some((rail) => root.contains(rail))) root.removeAttribute("data-wp-logical-stage-canvas");
    });

    const useSharedScaler = activeRails.length > 0 && !nativeStageScalers.has(gameId());
    metrics.stageLastGameId = gameId();
    metrics.stageLastActiveRails = activeRails.length;
    metrics.stageLastUseSharedScaler = useSharedScaler;
    const reserve = sharedReserve();
    reserve?.toggleAttribute("data-wp-stage-reserve-active", useSharedScaler);
    if (!useSharedScaler) {
      restoreStageStyles(appliedStageRoot);
      restoreReserveStyles(appliedStageReserve);
      appliedStageRoot = null;
      appliedStageReserve = null;
      return;
    }

    const root = stageRootFor(activeRails[0]);
    if (!root) return;
    if (appliedStageRoot && appliedStageRoot !== root) restoreStageStyles(appliedStageRoot);
    const viewport = window.visualViewport;
    const width = Math.max(1, document.documentElement.clientWidth || 0, window.innerWidth || 0, viewport?.width || 0);
    const height = Math.max(1, document.documentElement.clientHeight || 0, window.innerHeight || 0, viewport?.height || 0);
    if (root === appliedStageRoot
      && Math.abs(width - appliedStageWidth) < 0.5
      && Math.abs(height - appliedStageHeight) < 0.5) return;
    const requestedMaximumWidth = Number.parseFloat(root.dataset.wpCanvasMaxWidth || "");
    const maximumWidth = Number.isFinite(requestedMaximumWidth) && requestedMaximumWidth > 0
      ? Math.min(DESKTOP_CANVAS_MAX_WIDTH, requestedMaximumWidth)
      : DESKTOP_CANVAS_MAX_WIDTH;
    const availableWidth = Math.max(1, Math.min(width, maximumWidth));
    const availableHeight = Math.max(1, height - reserveHeight);
    const requestedLandscapeWidth = Number.parseFloat(root.dataset.wpStageLandscapeWidth || "");
    const requestedLandscapeHeight = Number.parseFloat(root.dataset.wpStageLandscapeHeight || "");
    const useLandscapeEnvelope = Number.isFinite(requestedLandscapeWidth) && requestedLandscapeWidth > 0
      && Number.isFinite(requestedLandscapeHeight) && requestedLandscapeHeight > 0
      && availableWidth / availableHeight >= 1.5;
    const minimumLogicalWidth = useLandscapeEnvelope ? requestedLandscapeWidth : STAGE_LOGICAL_WIDTH;
    const minimumLogicalHeight = useLandscapeEnvelope ? requestedLandscapeHeight : STAGE_LOGICAL_HEIGHT;
    const scale = Math.max(0.01, Math.min(
      availableWidth / minimumLogicalWidth,
      availableHeight / minimumLogicalHeight
    ));
    const logicalWidth = availableWidth / scale;
    const logicalHeight = availableHeight / scale;
    const renderedWidth = availableWidth;
    const renderedHeight = availableHeight;
    const left = Math.max(0, (width - availableWidth) / 2);
    const top = 0;
    root.setAttribute("data-wp-logical-stage-canvas", `${logicalWidth.toFixed(3)}x${logicalHeight.toFixed(3)}`);
    const style = document.documentElement.style;
    style.setProperty("--wp-stage-logical-width", `${logicalWidth}px`);
    style.setProperty("--wp-stage-logical-height", `${logicalHeight}px`);
    style.setProperty("--wp-stage-canvas-scale", String(scale));
    style.setProperty("--wp-stage-canvas-left", `${left}px`);
    style.setProperty("--wp-stage-canvas-top", `${top}px`);
    style.setProperty("--wp-stage-canvas-rendered-width", `${renderedWidth}px`);
    style.setProperty("--wp-stage-canvas-rendered-height", `${renderedHeight}px`);
    style.setProperty("--wp-stage-reserve-top", `${availableHeight}px`);
    rememberStageStyles(root);
    const declarations = {
      position: "fixed", inset: "auto", top: `${top}px`, right: "auto", bottom: "auto", left: `${left}px`,
      "box-sizing": "border-box", width: `${logicalWidth}px`, "min-width": `${logicalWidth}px`, "max-width": `${logicalWidth}px`,
      height: `${logicalHeight}px`, "min-height": `${logicalHeight}px`, "max-height": `${logicalHeight}px`, margin: "0", overflow: "hidden",
      transform: `scale(${scale})`, "transform-origin": "top left",
    };
    Object.entries(declarations).forEach(([property, value]) => root.style.setProperty(property, value, "important"));
    if (reserve) {
      rememberReserveStyles(reserve);
      const reserveDeclarations = {
        position: "fixed", inset: "auto", top: `${availableHeight}px`, right: "auto", bottom: "auto", left: "0px",
        width: `${width}px`, "min-width": "0", "max-width": "none", height: `${reserveHeight}px`, "min-height": `${reserveHeight}px`, transform: "none",
      };
      Object.entries(reserveDeclarations).forEach(([property, value]) => reserve.style.setProperty(property, value, "important"));
      appliedStageReserve = reserve;
    }
    appliedStageRoot = root;
    appliedStageWidth = width;
    appliedStageHeight = height;
    metrics.stageCanvasApplied += 1;
  }

  function standardizeMainStart() {
    if (isKidsAudience()) return;
    const button = document.querySelector(mainStartByGame[gameId()] || "[data-wp-main-start]");
    if (!button) return;
    button.dataset.wpMainStart = "true";
    const pageLanguage = document.documentElement.lang.toLowerCase();
    const label = pageLanguage.startsWith("zh-hans") || pageLanguage.startsWith("zh-cn")
      ? "开始游戏"
      : pageLanguage.startsWith("zh") ? "開始遊戲" : "Start Game";
    const localizedLabel = window.WonderI18n?.t?.("game.start") || label;
    if (button.textContent.trim() !== localizedLabel) button.textContent = localizedLabel;
  }

  function updateStageState() {
    const activeRail = [...document.querySelectorAll("[data-wp-stage-rail]")]
      .some((rail) => rail.getClientRects().length && getComputedStyle(rail).visibility !== "hidden");
    const active = activeRail
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

  function boundScrollLeft(rail, value) {
    const maximum = Math.max(0, rail.scrollWidth - rail.clientWidth);
    return getComputedStyle(rail).direction === "rtl"
      ? Math.max(-maximum, Math.min(0, value))
      : Math.max(0, Math.min(maximum, value));
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
    const boundedTarget = boundScrollLeft(rail, target);
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
      // The first rAF timestamp can represent the start of the current frame
      // and be a few milliseconds earlier than performance.now() above.
      // Clamp both bounds so easing never produces a brief reverse movement.
      const progress = Math.max(0, Math.min(1, (now - startedAt) / duration));
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
    if (rail.dataset.wpStageRecommendation === "first") return unlocked[0] || null;
    const explicit = unlocked.find((card) => card.dataset.wpStageRecommended === "true");
    if (explicit) return explicit;
    return unlocked.at(-1) || null;
  }

  function centerCard(rail, card, behavior = "auto") {
    if (!card || !rail.getClientRects().length) return;
    const railRect = rail.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const coordinateScale = railRect.width > 0 ? rail.clientWidth / railRect.width : 1;
    const target = rail.scrollLeft
      + ((cardRect.left + cardRect.width / 2) - (railRect.left + railRect.width / 2)) * coordinateScale;
    const boundedTarget = boundScrollLeft(rail, target);
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
      if (rail.classList.contains("wp-stage-dragging") || rail.dataset.wpDragDown === "1") return;
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
    ensureStageArtwork(rail);
    rail.dataset.wpStageRail = "true";
    rail.dataset.wpStageInitiallyHidden = rail.getClientRects().length ? "false" : "true";
    railVisibility.set(rail, Boolean(rail.getClientRects().length));
    railHadCards.set(rail, stageCards(rail).length > 0);
    let pointerId = null;
    let startX = 0;
    let startScroll = 0;
    let dragMultiplier = 1;
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
      const configuredDragMultiplier = Number(rail.dataset.wpStageDragMultiplier);
      dragMultiplier = Number.isFinite(configuredDragMultiplier)
        ? Math.min(3, Math.max(1, configuredDragMultiplier))
        : 1;
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
      rail.scrollLeft = startScroll - delta * coordinateScale * dragMultiplier;
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
        // A drag that starts on a card may leave that card focused. Blurring it
        // prevents the browser from scrolling the old card back into view,
        // while avoiding the small reverse jump caused by focusing the rail.
        if (rail.contains(document.activeElement)) document.activeElement?.blur?.();
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
  const stageStateSelector = [
    railSelector,
    "[data-wp-logical-stage-canvas]",
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
  ].join(",");
  let observerQueued = false;
  let observerNeedsState = false;
  let observerNeedsLocale = false;
  const observerRails = new Set();
  const queueObserverFlush = () => {
    if (observerQueued) return;
    observerQueued = true;
    requestAnimationFrame(() => {
      observerQueued = false;
      metrics.stageObserverFlushes += 1;
      if (observerNeedsLocale || observerNeedsState) standardizeMainStart();
      if (observerNeedsState) updateStageState();
      const rails = observerNeedsState ? document.querySelectorAll(railSelector) : observerRails;
      rails.forEach((rail) => {
        const hasCards = stageCards(rail).length > 0;
        const gainedInitialCards = hasCards && !railHadCards.get(rail);
        railHadCards.set(rail, hasCards);
        if (rail.classList.contains("wp-stage-dragging") || rail.dataset.wpDragDown === "1") return;
        scheduleRecommendedCenter(rail, gainedInitialCards || observerRails.has(rail));
      });
      observerNeedsState = false;
      observerNeedsLocale = false;
      observerRails.clear();
    });
  };
  new MutationObserver((records) => {
    records.forEach((record) => {
      if (record.type === "attributes") {
        if (record.attributeName === "lang") observerNeedsLocale = true;
        const target = record.target;
        if (target === document.documentElement || target === document.body
          || target.matches?.(stageStateSelector)
          || target.querySelector?.(railSelector)) observerNeedsState = true;
        return;
      }
      const owningRail = record.target.closest?.(railSelector);
      if (owningRail) observerRails.add(owningRail);
      [...record.addedNodes, ...record.removedNodes].forEach((node) => {
        if (!(node instanceof Element)) return;
        if (node.matches(railSelector)) install(node);
        node.querySelectorAll?.(railSelector).forEach(install);
        if (node.matches(stageStateSelector) || node.querySelector?.(stageStateSelector)) observerNeedsState = true;
      });
    });
    if (observerNeedsState || observerNeedsLocale || observerRails.size) queueObserverFlush();
  }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "hidden", "lang"] });
  document.addEventListener("click", (event) => {
    const target = event.target?.closest?.("button,a,[role='button']");
    if (!target) return;
    const mainEntry = mainStartByGame[gameId()] || "[data-wp-main-start]";
    if (!target.matches(mainEntry) && !target.closest(railSelector) && !target.matches('[data-wp-return="stage"]')) return;
    if (target.matches(mainEntry)) {
      let remainingFrames = 120;
      const probeStageEntry = () => {
        const visibleRail = [...document.querySelectorAll("[data-wp-stage-rail]")]
          .some((rail) => rail.getClientRects().length && getComputedStyle(rail).visibility !== "hidden");
        if (visibleRail || remainingFrames-- <= 0) {
          updateStageState();
          return;
        }
        requestAnimationFrame(probeStageEntry);
      };
      requestAnimationFrame(probeStageEntry);
    }
    requestAnimationFrame(() => requestAnimationFrame(updateStageState));
    window.setTimeout(updateStageState, 250);
    window.setTimeout(updateStageState, 700);
  }, true);
  window.addEventListener("wonder:locale-change", standardizeMainStart);
  window.addEventListener("resize", updateStageCanvas, { passive: true });
  window.visualViewport?.addEventListener("resize", updateStageCanvas, { passive: true });
})();
