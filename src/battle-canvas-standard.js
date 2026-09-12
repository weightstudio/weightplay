(function () {
  const RESERVE_HEIGHT = window.WeightPlayAudience?.reserveHeight ?? 56;
  const GUTTER = 0;
  const DESKTOP_CANVAS_MAX_WIDTH = 920;
  const games = {
    // The five new General prototypes own native Battle shells. In compact
    // landscape, use their wide logical envelope instead of shrinking the
    // portrait shell until touch controls become non-interactive.
    "animal-trap-trail": ["#battle-screen", 390, 788, 760, 334],
    "animal-canopy-cut": ["#battle-screen", 390, 788, 760, 334],
    "animal-bounce-brawl": ["#battle-screen", 390, 788, 760, 334],
    "animal-frost-maze": ["#battle-screen", 390, 788, 760, 334],
    "animal-flip-foundry": ["#battle-screen", 390, 788, 760, 334],
    // Chameleon Blend's six color/pattern choices need the full compact-
    // landscape envelope so the controls retain their touch target size.
    "animal-chameleon-blend": ["#battle-screen", 390, 788, 760, 334],
    "animal-habitat-builder": ["#battle-screen", 390, 788, 760, 334],
    // Tide Tally's responsive answer grid needs the full wide short-landscape
    // envelope so its 44px Battle controls are not shrunk into a letterbox.
    "animal-tide-tally": [".battle-canvas", 390, 788, 760, 334],
    // Dewline's three valve controls and paired Battle actions need the wide
    // short-landscape envelope so the authored 44px targets remain physical
    // touch controls instead of inheriting the portrait scaler.
    "animal-dewline": ["#battleScreen", 390, 788, 760, 334],
    // Gust Garden's grid, direction pad, and paired actions need the wide
    // short-landscape envelope so the authored controls remain operable.
    "animal-gust-garden": [".battle-canvas", 390, 788, 760, 334],
    // Hoop League's aim and shot controls share this native Market Five
    // shell. Keep its short-landscape Battle in the wide envelope so the
    // scaler does not reduce 48px controls to roughly 20px at 844x390.
    "animal-hoop-league": ["#battle-screen", 390, 788, 760, 334],
    // Cloudhook owns a native 960x540 playfield; in compact landscape it
    // uses the same wide envelope so its tether controls remain operable.
    "animal-cloudhook-courier": ["#battleScreen", 390, 788, 760, 334],
    // Habitat Blueprint's compact-landscape Battle keeps its Reset/Swap
    // actions at the shared 44px touch-target floor inside the wide envelope.
    "animal-habitat-blueprint": [".battle-canvas", 390, 788, 760, 334],
    // Folded Field publishes the logical Battle attribute on its permanent
    // outer screen. Keep that owner on the wide envelope so flap feedback
    // cannot reapply the portrait scale to the inner board.
    "animal-folded-field": ["#battleScreen", 390, 788, 760, 334],
    // Twin Switchyard keeps its game-local physical fallback controls, while
    // the native 960x540 playfield also needs the complete wide envelope.
    "animal-twin-switchyard": ["#battleScreen", 390, 788, 760, 334],
    // Trail Logic has a responsive marker/choice column. Keep its compact
    // landscape play surface in the wide logical envelope so the choice
    // controls and persistent return utilities do not drift when feedback
    // rerenders the record.
    "animal-footprint-folio": ["#battleScreen", 390, 788, 760, 334],
    // Meadow Difference is a direct Main -> Battle product. Its 3x3 compare
    // panels need the wide short-landscape envelope so the tile grid and
    // persistent Home/Sound controls stay inside the owning Canvas.
    "animal-meadow-difference": ["#battleView", 390, 788, 760, 334],
    "arrow-escape": [".battle-canvas", 390, 788, 760, 334],
    "block-blast": [".battle-canvas", 390, 788, 760, 334],
    "hexa-sort": [".battle-canvas", 390, 788, 760, 334],
    "animal-block-grove": [".block-grove-battle-canvas", 390, 844],
    "animal-color-springs": [".battle-canvas", 390, 788, 760, 334],
    "animal-tangram": [".battle", 390, 788, 760, 334],
    "animal-bamboo-pipes": ["#battle", 390, 788, 760, 334],
    "animal-abyss-diver": [".battle-canvas", 390, 788, 760, 334],
    // Balance Grove's two-column subset tray needs the wide short-landscape
    // envelope so its Back and Check controls remain physical touch targets.
    "animal-balance-grove": [".battle-canvas", 390, 788, 760, 334],
    "animal-auto-squad": ["#gamePanel", 382, 780],
    "animal-bubble-safari": ["#battleScreen", 390, 788],
    "animal-2048": [".battle-canvas", 390, 788, 760, 334],
    "animal-sanctuary-loop": [".battle-canvas", 390, 788, 760, 334],
    // Sunbeam Garden's authored 6x6 board needs the complete wide envelope
    // in short landscape so mirror buttons retain a confident touch size.
    "animal-sunbeam-garden": ["#battle", 390, 788, 760, 334],
    "animal-prism-battalion": [".battle-canvas", 390, 788, 760, 334],
    "animal-prism-breakers": [".battle-canvas", 390, 788, 760, 334],
    "animal-mosaic-clues": [".battle-canvas", 390, 788, 760, 334],
    "animal-prism-garden": ["#battle", 390, 788, 760, 334],
    "animal-penalty-cup": [".battle-canvas", 390, 788, 760, 334],
    "animal-skybridge-rivals": [".battle-canvas", 390, 788, 760, 334],
    "animal-skyspire-drop": [".battle-canvas", 390, 788, 760, 334],
    "animal-spectrum-pulse": [".battle-canvas", 390, 788, 760, 334],
    "animal-rift-salvage": [".battle-canvas", 390, 788, 760, 334],
    "cat-color-sudoku": ["#battle", 390, 788, 760, 334],
    "animal-cafe-rush": ["#playPanel", 382, 780, 760, 360],
    "animal-crystal-survivor": ["#gamePanel", 382, 780, 760, 334],
    "animal-triple-match": [".battle-canvas", 390, 788, 760, 334],
    "animal-gearpack-expedition": [".battle-canvas", 390, 788, 760, 334],
    "animal-carnival-claw": [".battle-canvas", 390, 788, 760, 334],
    "animal-guard-yard": ["#playPanel", 390, 450],
    "animal-cratebound": [".battle-canvas", 390, 788, 760, 334],
    "animal-habitat-mahjong": [".battle-canvas", 390, 788],
    "animal-dice-bastion": [".battle-canvas", 390, 788, 760, 334],
    "animal-rune-reels": [".battle-canvas", 390, 788, 760, 334],
    "animal-honey-shield": [".battle-canvas", 390, 788, 760, 334],
    "animal-hero-trials": ["#battleView", 390, 788, 760, 334],
    "animal-hidden-safari": ["#playPanel", 382, 780, 760, 350],
    "animal-moonlight-heist": [".battle-canvas", 390, 788],
    "animal-one-line": [".battle-canvas", 390, 788, 760, 334],
    "animal-orb-fortress": ["#gamePanel", 382, 780],
    "animal-parking-patrol": [".battle-canvas", 390, 844],
    "animal-quiz": [".animal-game", 390, 788],
    "animal-reef-fisher": [".battle-shell", 382, 780, 760, 334],
    "animal-relic-hunters": ["#gamePanel", 382, 780],
    "animal-rescue": [".rescue-game", 382, 780],
    "animal-rope-rescue": ["#gamePanel", 382, 780],
    "animal-rootvault-pins": [".battle-canvas", 390, 788, 760, 334],
    "animal-sketchwheel-rally": [".battle-canvas", 390, 788, 760, 334],
    "animal-rune-tactics": [".rune-app", 382, 780],
    "animal-skyport-dispatch": [".battle-canvas", 390, 788, 760, 334],
    "animal-screw-workshop": [".battle-canvas", 390, 844, 760, 360],
    "animal-starlight-trails": [".trail-battle-canvas", 390, 788, 760, 334],
    "animal-word-trails": [".battle-canvas", 382, 780],
    "animal-zoo-idle": ["#gamePanel", 382, 780, 760, 350],
    "beast-deck": ["#gamePanel", 382, 780],
    "beast-tactician": ["#gamePanel", 382, 780],
    "bubble-bakery": [".bakery-game", 382, 780, 760, 360],
    "campus-dash": [".dash-game", 382, 780, 844, 390],
    "color-lunchbox": [".lunch-game", 382, 780, 760, 350],
    "fruit-merge": [".fixed-game-shell", 382, 780, 760, 350],
    "garden-tiles": [".garden-game", 382, 780, 760, 350],
    "shadow-wolf": [".game-layout", 390, 788],
    // Space Rocks has a native 960x540 playfield. Keep the phone portrait
    // envelope for readable controls, but allow the complete safe width in
    // landscape instead of shrinking the game into the default portrait shell.
    "space-rocks": ["#battleScreen", 390, 788, 760, 334],
    // Signal Veil owns a no-Stage Battle shell while the body also exposes
    // data-screen="battle". Select the actual shell explicitly so the shared
    // scaler cannot claim the body and leave the mobile playfield narrow.
    "signal-veil": ["#battleShell", 390, 788, 760, 334],
    "shape-train": ["#playPanel", 362, 710],
    "snack-blocks": [".snack-game", 382, 780, 760, 350],
    "star-memory": [".memory-game", 382, 780],
    "tiny-weather-rescue": [".weather-game", 366, 764],
    "wonder-crash": [".game-shell", 390, 788, 760, 360],
    "klondike-solitaire": [".battle-canvas", 390, 788, 760, 334],
    "spider-solitaire": [".battle-canvas", 390, 788, 760, 334],
    "freecell-solitaire": [".battle-canvas", 390, 788, 760, 334],
    "pyramid-solitaire": [".battle-canvas", 390, 788, 760, 334],
    "tripeaks-solitaire": [".battle-canvas", 390, 788, 760, 334],
    "golf-solitaire": [".battle-canvas", 390, 788, 760, 334],
    "yukon-solitaire": [".battle-canvas", 390, 788, 760, 334],
    "zhao-yun-a-dou": ["#battle", 390, 788, 760, 760],
    "zoo-helper-day": [".zoo-game", 374, 776, 760, 350],
    // Card-game owner previews use an inner .battle-canvas inside #battleScreen.
    // Bind the scaler to that permanent play surface so the scene wrapper is
    // never scaled a second time. The short-landscape envelope keeps the
    // table readable while still covering the complete safe width.
    "gin-rummy": [".battle-canvas", 390, 788, 760, 334],
    "casino": [".battle-canvas", 390, 788, 760, 334],
    "crazy-eights": [".battle-canvas", 390, 788, 760, 334],
    "hearts": [".battle-canvas", 390, 788, 760, 334],
    "spades": [".battle-canvas", 390, 788, 760, 334],
    "cribbage": [".battle-canvas", 390, 788, 760, 334],
    "go-fish": [".battle-canvas", 390, 788, 760, 334],
    "war": [".battle-canvas", 390, 788, 760, 334],
    "speed": [".battle-canvas", 390, 788, 760, 334],
    "old-maid": [".battle-canvas", 390, 788, 760, 334],
    // Code Breaker's compact landscape board needs a slightly taller wide
    // envelope so its 44px utility controls retain a usable physical target
    // at 844x390 instead of inheriting the compressed default floor.
    "code-breaker": ["#logicBattle", 390, 788, 760, 350],
    // Sliding 15 uses the same short-landscape control column. Keep its
    // 4×4 board and the three utility actions in a wide envelope instead of
    // scaling the portrait Canvas below the physical 44px touch-target floor.
    "sliding-15": ["#logicBattle", 390, 788, 760, 350],
    // Tic-Tac-Toe owns a responsive two-column Battle composition in compact
    // landscape. Give its permanent Battle shell the wide envelope so the
    // portrait fallback cannot shrink its controls and 3x3 board below touch
    // size at 844x390.
    "tic-tac-toe": ["#battleScreen", 390, 788, 760, 334],
  };
  const gameId = location.pathname.match(/\/games\/([^/]+)/)?.[1] || "";
  const cssViewportCardGames = new Set([
    "gin-rummy", "casino", "crazy-eights", "hearts", "spades",
    "cribbage", "go-fish", "war", "speed", "old-maid",
  ]);
  const useCssViewportCardEnvelope = cssViewportCardGames.has(gameId);
  const defaultConfig = [
    "[data-wp-logical-battle-canvas],#battleScreen,#battleView,#battlePage,#battle,[data-screen='battle'],.battle-screen,.battle-shell,.battle-page",
    390,
    788,
  ];
  const config = games[gameId] || defaultConfig;
  // Habitat Builder keeps its authored control column in the wide envelope
  // on 1280x720 as well as short landscape. The 56px General reserve makes
  // that viewport's safe-area ratio just under the shared 1.5 threshold;
  // lower it only for this game so its physical controls stay >=44px.
  const landscapeRatioThresholdByGame = {
    "animal-habitat-builder": 1.25,
    "animal-folded-field": 1.25,
    "animal-gust-garden": 1.25,
  };
  const landscapeRatioThreshold = landscapeRatioThresholdByGame[gameId] || 1.5;
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
  const findRoot = () => {
    const candidates = [...document.querySelectorAll(config[0])].filter(visible);
    // Scene state is published on <body> for shell synchronization, but the
    // body is never the playable Battle Canvas. Prefer the actual descendant
    // screen so the shared scaler cannot shrink a game into a narrow column.
    return candidates.find((node) => node.matches("[data-wp-battle-canvas-root]"))
      || candidates.find((node) => node !== document.body && node !== document.documentElement)
      || candidates[0]
      || null;
  };
  const findBack = (root) => root?.querySelector('[data-wp-return="battle"],#battleBack,#battleBackBtn,#backToStagesBtn,#backToMenuBtn')
    || (gameId === "animal-reef-fisher"
      ? document.querySelector('[data-wp-return="battle"],#battleBack,#battleBackBtn,#backToStagesBtn,#backToMenuBtn')
      : null);
  const findBattleOverlay = (root) => root && [...root.querySelectorAll('[role="dialog"],.result-panel,.result-overlay,.result-canvas,#resultPanel,#resultScreen,#resultModal,#result')].find(visible);
  const findReserve = (root) => {
    const nearby = root?.parentElement?.querySelector(reserveSelector);
    // Card-game previews keep one physical reserve beside the permanent
    // play surface. After Main -> Battle -> Main, its natural height is zero
    // until this scaler reapplies the 56px slot, so visibility cannot be the
    // lookup gate for these five owner-preview shells.
    if (nearby && (gameId === "gin-rummy" || gameId === "casino" || gameId === "crazy-eights" || gameId === "hearts" || gameId === "spades" || gameId === "cribbage" || gameId === "go-fish" || gameId === "war" || gameId === "speed" || gameId === "old-maid" || visible(nearby))) return nearby;
    return [...document.querySelectorAll(reserveSelector)]
      .find((node) => visible(node) && !node.closest("[data-wp-logical-battle-canvas]")) || null;
  };

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
  const rememberAndSet = (node, declarations, priority = "important") => {
    if (!node) return;
    if (!savedStyles.has(node)) {
      const saved = {};
      Object.keys(declarations).forEach((property) => {
        saved[property] = [node.style.getPropertyValue(property), node.style.getPropertyPriority(property)];
      });
      savedStyles.set(node, saved);
    }
    Object.entries(declarations).forEach(([property, value]) => node.style.setProperty(property, value, priority));
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
  const clearMainRootGeometry = (node) => {
    const isKnownMainRoot = gameId === "animal-quiz" || gameId === "animal-rescue";
    const isReturnedStandardMain = document.body.classList.contains("wp-shell-main-active")
      && node?.classList.contains("wp-standard-main-flow-owner");
    if (!node || (!isKnownMainRoot && !isReturnedStandardMain)) return;
    [
      "position", "inset", "left", "right", "top", "bottom",
      "width", "min-width", "max-width", "height", "min-height",
      "max-height", "margin", "overflow", "transform", "transform-origin",
    ].forEach((property) => node.style.removeProperty(property));
  };
  const restoreRoot = (node) => {
    restore(node);
    clearMainRootGeometry(node);
    node?.removeAttribute("data-wp-logical-battle-canvas");
  };
  const restoreReserve = (node) => {
    restore(node);
    node?.removeAttribute("data-wp-battle-physical-reserve");
  };
  const clearCanvasVariables = () => {
    const style = document.documentElement.style;
    [
      "--wp-battle-viewport-height",
      "--wp-battle-logical-width",
      "--wp-battle-logical-height",
      "--wp-battle-canvas-scale",
      "--wp-battle-canvas-rendered-width",
      "--wp-battle-canvas-rendered-height",
      "--wp-battle-canvas-top",
    ].forEach((property) => style.removeProperty(property));
  };

  function update() {
    const root = findRoot();
    const back = findBack(root);
    const active = Boolean(root && (visible(back) || findBattleOverlay(root)));
    document.body.classList.toggle("wp-logical-battle-active", active);
    if (!active) {
      restoreRoot(activeRoot);
      clearMainRootGeometry(root);
      restoreReserve(activeReserve);
      clearCanvasVariables();
      activeRoot = null;
      activeReserve = null;
      appliedStateSignature = "";
      appliedRootStyleSignature = "";
      return;
    }

    const viewport = window.visualViewport;
    // The CSS layout viewport is the settled coordinate system used by the
    // Battle media queries. Prefer it over innerWidth/visualViewport: during
    // an embedded orientation transition either of those secondary surfaces
    // can briefly retain the previous wide value, and taking the maximum
    // would preserve a stale logical Canvas after the viewport is compact.
    const layoutWidth = Number(document.documentElement.clientWidth) || 0;
    const layoutHeight = Number(document.documentElement.clientHeight) || 0;
    const width = Math.max(1, layoutWidth || Number(viewport?.width) || Number(innerWidth) || 0);
    const height = Math.max(1, layoutHeight || Number(viewport?.height) || Number(innerHeight) || 0);
    const reserve = findReserve(root);
    if ((gameId === "gin-rummy" || gameId === "casino" || gameId === "crazy-eights" || gameId === "hearts" || gameId === "spades" || gameId === "cribbage" || gameId === "go-fish" || gameId === "war" || gameId === "speed" || gameId === "old-maid")
      && reserve?.parentElement === root
      && root.parentElement) {
      // The card-game preview markup historically nested the physical reserve
      // inside the transformed play surface. Keep the permanent reserve as a
      // sibling so its 56px boundary is never scaled with the Canvas.
      root.parentElement.append(reserve);
    }
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
    const configuredPortraitWidth = Number.parseFloat(root.dataset.wpBattleMinWidth || "") || config[1];
    const configuredPortraitHeight = Number.parseFloat(root.dataset.wpBattleMinHeight || "") || config[2];
    const configuredLandscapeWidth = Number.parseFloat(root.dataset.wpBattleLandscapeWidth || "") || config[3];
    const configuredLandscapeHeight = Number.parseFloat(root.dataset.wpBattleLandscapeHeight || "") || config[4];
    const useLandscapeEnvelope = configuredLandscapeWidth && configuredLandscapeHeight
      && availableWidth / availableHeight >= landscapeRatioThreshold;
    const minimumLogicalWidth = useLandscapeEnvelope ? configuredLandscapeWidth : configuredPortraitWidth;
    const minimumLogicalHeight = useLandscapeEnvelope ? configuredLandscapeHeight : configuredPortraitHeight;
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
    if (activeRoot && activeRoot !== root) restoreRoot(activeRoot);
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
    }, useCssViewportCardEnvelope ? "" : "important");
    appliedRootStyleSignature = rootStyleSignature(root);
    if (activeReserve && activeReserve !== reserve) restoreReserve(activeReserve);
    activeReserve = reserve;
    if (reserve) {
      reserve.setAttribute("data-wp-battle-physical-reserve", "");
      const reserveTop = availableHeight;
      const reserveLeft = left;
      const reserveWidth = renderedWidth;
      rememberAndSet(reserve, {
        position: "fixed",
        inset: `${reserveTop}px auto auto ${reserveLeft}px`,
        display: "block",
        width: `${reserveWidth}px`,
        "min-width": "0",
        "max-width": `${DESKTOP_CANVAS_MAX_WIDTH}px`,
        height: "56px",
        "min-height": "56px",
        "max-height": "56px",
        margin: "0",
        transform: "none",
        "pointer-events": "none",
      }, useCssViewportCardEnvelope ? "" : "important");
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
  const queueSettledUpdate = () => {
    // Resize consumers can inspect control hit targets in the same task that
    // delivers the viewport change. Apply the settled layout viewport
    // synchronously before the bounded rAF recheck so a wide-to-portrait
    // transition cannot expose the previous logical Canvas coordinates for
    // one interaction.
    update();
    queueUpdate();
    // A few embedded surfaces publish the new CSS viewport one frame after
    // their resize/orientation event. Recheck once after that settled frame;
    // the idempotent update keeps this bounded and avoids a polling loop.
    requestAnimationFrame(queueUpdate);
  };
  // Scene owners that complete their own transaction need a deterministic
  // geometry checkpoint before the next synchronous interaction can inspect
  // the Battle return. Keep the observer/rAF queue for ordinary mutations,
  // while exposing the same idempotent update for an owner-level checkpoint.
  window.WeightPlayBattleCanvas ||= {};
  window.WeightPlayBattleCanvas.sync = update;
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
  window.addEventListener("resize", queueSettledUpdate, { passive: true });
  window.visualViewport?.addEventListener("resize", queueSettledUpdate, { passive: true });
  // Some embedded/mobile surfaces update the viewport and orientation without
  // delivering a second window resize after a wide-to-portrait transition.
  // Reconcile those settled geometry changes too, so a logical card-game
  // Canvas never keeps the previous desktop coordinate system on return.
  window.addEventListener("orientationchange", queueSettledUpdate, { passive: true });
  window.screen?.orientation?.addEventListener?.("change", queueSettledUpdate, { passive: true });
  window.addEventListener("pageshow", queueSettledUpdate, { passive: true });
  const logicalCanvasResizeObserver = typeof ResizeObserver === "function"
    ? new ResizeObserver(() => {
      // ResizeObserver runs after the layout viewport has committed. Apply
      // immediately here so a coalesced or late resize event cannot leave the
      // previous wide logical envelope in place for the next player click.
      update();
      queueUpdate();
    })
    : null;
  logicalCanvasResizeObserver?.observe(document.documentElement);
  document.addEventListener("click", () => window.setTimeout(queueUpdate, 0), true);
  // Scene signals can arrive in the same task that flips hidden/inert state.
  // Defer one frame so the shared scaler measures the settled Battle root;
  // otherwise the first player click can become the first successful scale.
  window.addEventListener("weightplay:battle-sync", queueUpdate);
  window.addEventListener("weightplay:shell-sync", queueUpdate);
  window.addEventListener("weightplay:battle-open", queueUpdate);
  queueUpdate();
})();
