(function () {
  const RESERVE_HEIGHT = window.WeightPlayAudience?.reserveHeight ?? 56;
  const GUTTER = 0;
  const DESKTOP_CANVAS_MAX_WIDTH = 920;
  const games = {
    "animal-block-grove": [".block-grove-battle-canvas", 390, 844],
    "animal-abyss-diver": [".battle-canvas", 390, 788],
    "animal-auto-squad": ["#gamePanel", 382, 780],
    "animal-bubble-safari": ["#battleScreen", 390, 788],
    "animal-frontier-dominion": [".battle-canvas", 390, 788, 760, 334],
    "animal-sanctuary-loop": [".battle-canvas", 390, 788, 760, 334],
    "animal-cafe-rush": ["#playPanel", 382, 780],
    "animal-crystal-survivor": ["#gamePanel", 382, 780],
    "animal-gearpack-expedition": [".battle-canvas", 390, 788],
    "animal-guard-yard": ["#playPanel", 390, 450],
    "animal-habitat-mahjong": [".battle-canvas", 390, 788],
    "animal-hero-trials": ["#battleView", 390, 788],
    "animal-hidden-safari": ["#playPanel", 382, 780],
    "animal-moonlight-heist": [".battle-canvas", 390, 788],
    "animal-one-line": [".battle-canvas", 390, 788],
    "animal-orb-fortress": ["#gamePanel", 382, 780],
    "animal-parking-patrol": [".battle-canvas", 390, 844],
    "animal-quiz": [".animal-game", 390, 788],
    "animal-reef-fisher": [".battle-shell", 382, 780],
    "animal-relic-hunters": ["#gamePanel", 382, 780],
    "animal-rescue": [".rescue-game", 382, 780],
    "animal-rope-rescue": ["#gamePanel", 382, 780],
    "animal-rune-tactics": [".rune-app", 382, 780],
    "animal-skyport-dispatch": [".battle-canvas", 390, 788],
    "animal-screw-workshop": [".battle-canvas", 390, 844],
    "animal-starlight-trails": [".trail-battle-canvas", 390, 788],
    "animal-word-trails": [".battle-canvas", 382, 780],
    "animal-zoo-idle": ["#gamePanel", 382, 780],
    "beast-deck": ["#gamePanel", 382, 780],
    "beast-tactician": ["#gamePanel", 382, 780],
    "bubble-bakery": [".bakery-game", 382, 780],
    "campus-dash": [".dash-game", 382, 780],
    "color-lunchbox": [".lunch-game", 382, 780],
    "fruit-merge": [".fixed-game-shell", 382, 780],
    "garden-tiles": [".garden-game", 382, 780],
    "shadow-wolf": [".game-layout", 390, 788],
    "shape-train": ["#playPanel", 362, 710],
    "snack-blocks": [".snack-game", 382, 780],
    "star-memory": [".memory-game", 382, 780],
    "tiny-weather-rescue": [".weather-game", 366, 764],
    "wonder-crash": [".game-shell", 390, 788],
    "zoo-helper-day": [".zoo-game", 374, 776],
  };
  const gameId = location.pathname.match(/\/games\/([^/]+)/)?.[1] || "";
  const config = games[gameId];
  if (!config) return;
  const reserveSelector = ".battle-ad-reserve,.battle-ad,.ad-reserve,.result-ad-reserve,#battleAdReserve,#battleAd";
  const metrics = window.__weightPlayLayoutMetrics ||= {};
  metrics.battleQueued ||= 0;
  metrics.battleApplied ||= 0;

  const visible = (node) => {
    if (!node || node.hidden || node.classList.contains("hidden")) return false;
    const style = getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0.02 && rect.width > 4 && rect.height > 4;
  };
  const findRoot = () => [...document.querySelectorAll(config[0])].find(visible) || null;
  const findBack = (root) => root?.querySelector('[data-wp-return="battle"],#battleBack,#battleBackBtn,#backToStagesBtn,#backToMenuBtn') || null;
  const findBattleOverlay = (root) => root && [...root.querySelectorAll('[role="dialog"],.result-panel,.result-overlay,.result-canvas,#resultPanel,#resultScreen,#resultModal,#result')].find(visible);
  const findReserve = () => [...document.querySelectorAll(reserveSelector)]
    .find((node) => visible(node) && !node.closest("[data-wp-logical-battle-canvas]")) || null;

  const savedStyles = new WeakMap();
  let activeRoot = null;
  let activeReserve = null;
  let appliedViewportWidth = 0;
  let appliedViewportHeight = 0;
  let appliedStateSignature = "";
  let appliedRootStyleSignature = "";
  const rootStyleSignature = (node) => node ? ["position", "top", "left", "width", "height", "transform"]
    .map((property) => `${property}:${node.style.getPropertyValue(property)}!${node.style.getPropertyPriority(property)}`)
    .join("|") : "";
  const rememberAndSet = (node, declarations) => {
    if (!node) return;
    if (!savedStyles.has(node)) {
      const saved = {};
      Object.keys(declarations).forEach((property) => {
        saved[property] = [node.style.getPropertyValue(property), node.style.getPropertyPriority(property)];
      });
      savedStyles.set(node, saved);
    }
    Object.entries(declarations).forEach(([property, value]) => node.style.setProperty(property, value, "important"));
  };
  const restore = (node) => {
    const saved = savedStyles.get(node);
    if (!node || !saved) return;
    Object.entries(saved).forEach(([property, [value, priority]]) => {
      if (value) node.style.setProperty(property, value, priority);
      else node.style.removeProperty(property);
    });
    savedStyles.delete(node);
  };

  function update() {
    const root = findRoot();
    const back = findBack(root);
    const active = Boolean(root && (visible(back) || findBattleOverlay(root)));
    document.body.classList.toggle("wp-logical-battle-active", active);
    if (!active) {
      restore(activeRoot);
      restore(activeReserve);
      activeRoot = null;
      activeReserve = null;
      appliedRootStyleSignature = "";
      return;
    }

    const viewport = window.visualViewport;
    const width = Math.max(1, document.documentElement.clientWidth || 0, innerWidth || 0, viewport?.width || 0);
    const height = Math.max(1, document.documentElement.clientHeight || 0, innerHeight || 0, viewport?.height || 0);
    const reserve = findReserve();
    const stateSignature = [
      document.body.className,
      root.className,
      root.hidden ? "hidden" : "shown",
      reserve?.className || "",
      reserve?.hidden ? "hidden" : "shown",
    ].join("|");
    if (root === activeRoot
      && reserve === activeReserve
      && Math.abs(width - appliedViewportWidth) < 0.5
      && Math.abs(height - appliedViewportHeight) < 0.5
      && stateSignature === appliedStateSignature
      && rootStyleSignature(root) === appliedRootStyleSignature) return;
    const requestedMaximumWidth = Number.parseFloat(root.dataset.wpCanvasMaxWidth || "");
    const maximumWidth = Number.isFinite(requestedMaximumWidth) && requestedMaximumWidth > 0
      ? Math.min(DESKTOP_CANVAS_MAX_WIDTH, requestedMaximumWidth)
      : DESKTOP_CANVAS_MAX_WIDTH;
    const availableWidth = Math.max(1, Math.min(width - GUTTER * 2, maximumWidth));
    const availableHeight = Math.max(1, height - RESERVE_HEIGHT - GUTTER * 2);
    const useLandscapeEnvelope = config[3] && config[4] && availableWidth / availableHeight >= 1.5;
    const minimumLogicalWidth = useLandscapeEnvelope ? config[3] : config[1];
    const minimumLogicalHeight = useLandscapeEnvelope ? config[4] : config[2];
    const scale = Math.max(0.01, Math.min(
      availableWidth / minimumLogicalWidth,
      availableHeight / minimumLogicalHeight
    ));
    const logicalWidth = availableWidth / scale;
    const logicalHeight = availableHeight / scale;
    root.setAttribute("data-wp-logical-battle-canvas", `${logicalWidth.toFixed(3)}x${logicalHeight.toFixed(3)}`);
    const renderedWidth = availableWidth;
    const renderedHeight = availableHeight;
    const top = GUTTER;
    const left = GUTTER + Math.max(0, (width - GUTTER * 2 - availableWidth) / 2);
    const style = document.documentElement.style;
    style.setProperty("--wp-battle-viewport-height", `${height}px`);
    style.setProperty("--wp-battle-logical-width", `${logicalWidth}px`);
    style.setProperty("--wp-battle-logical-height", `${logicalHeight}px`);
    style.setProperty("--wp-battle-canvas-scale", String(scale));
    style.setProperty("--wp-battle-canvas-rendered-width", `${renderedWidth}px`);
    style.setProperty("--wp-battle-canvas-rendered-height", `${renderedHeight}px`);
    style.setProperty("--wp-battle-canvas-top", `${top}px`);
    if (activeRoot && activeRoot !== root) restore(activeRoot);
    activeRoot = root;
    appliedViewportWidth = width;
    appliedViewportHeight = height;
    appliedStateSignature = stateSignature;
    metrics.battleApplied += 1;
    rememberAndSet(root, {
      position: "fixed",
      inset: "auto",
      top: `${top}px`,
      left: `${left}px`,
      width: `${logicalWidth}px`,
      "min-width": `${logicalWidth}px`,
      "max-width": `${logicalWidth}px`,
      height: `${logicalHeight}px`,
      "min-height": `${logicalHeight}px`,
      "max-height": `${logicalHeight}px`,
      margin: "0",
      transform: `scale(${scale})`,
      "transform-origin": "top left",
      overflow: "hidden",
    });
    appliedRootStyleSignature = rootStyleSignature(root);
    if (activeReserve && activeReserve !== reserve) restore(activeReserve);
    activeReserve = reserve;
    if (reserve) {
      reserve.setAttribute("data-wp-battle-physical-reserve", "");
      const reserveTop = availableHeight;
      rememberAndSet(reserve, {
        position: "fixed",
        inset: `${reserveTop}px auto auto 0px`,
        display: "block",
        width: `${width}px`,
        "min-width": "0",
        "max-width": "none",
        height: "56px",
        "min-height": "56px",
        "max-height": "56px",
        margin: "0",
        transform: "none",
        "pointer-events": "none",
      });
    }
  }

  let queued = false;
  const queueUpdate = () => {
    if (queued) return;
    queued = true;
    metrics.battleQueued += 1;
    requestAnimationFrame(() => {
      queued = false;
      update();
    });
  };
  const overlaySelector = '[role="dialog"],.result-panel,.result-overlay,.result-canvas,#resultPanel,#resultScreen,#resultModal,#result';
  const geometrySelector = `${config[0]},[data-wp-return="battle"],${reserveSelector},${overlaySelector}`;
  const containsGeometryNode = (node) => node instanceof Element
    && (node.matches(geometrySelector) || Boolean(node.querySelector(geometrySelector)));
  const mutationAffectsGeometry = (record) => {
    if (record.type === "childList") {
      return [...record.addedNodes, ...record.removedNodes].some(containsGeometryNode);
    }
    const target = record.target;
    if (!(target instanceof Element)) return false;
    if (target === document.body || target.matches(geometrySelector)) return true;
    return [...document.querySelectorAll(config[0])].some((root) => target.contains(root));
  };
  new MutationObserver((records) => {
    if (records.some(mutationAffectsGeometry)) queueUpdate();
  }).observe(document.body, {
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "hidden", "data-wp-return", "style"],
    childList: true,
  });
  window.addEventListener("resize", queueUpdate, { passive: true });
  window.visualViewport?.addEventListener("resize", queueUpdate, { passive: true });
  document.addEventListener("click", () => window.setTimeout(queueUpdate, 0), true);
  window.addEventListener("weightplay:battle-open", queueUpdate);
  queueUpdate();
})();
