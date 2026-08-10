(() => {
  const MENU_LOGICAL_WIDTH = 390;
  const MENU_LOGICAL_HEIGHT = MENU_LOGICAL_WIDTH * 16 / 9;
  const STAGE_LOGICAL_WIDTH = 390;
  const STAGE_LOGICAL_HEIGHT = 788;
  const STAGE_LANDSCAPE_WIDTH = 920;
  const STAGE_LANDSCAPE_HEIGHT = 460;
  const BATTLE_LOGICAL_WIDTH = 390;
  const BATTLE_LOGICAL_HEIGHT = 788;
  const BATTLE_LANDSCAPE_WIDTH = 760;
  const BATTLE_LANDSCAPE_HEIGHT = 360;
  const DESKTOP_CANVAS_MAX_WIDTH = 920;

  function syncCanonicalBrowserTitle() {
    const activeLocale = window.WonderI18n?.actualLocale?.() || document.documentElement.lang || "en";
    const runtimeTranslate = (value) => window.WeightPlayGameRuntimeLocalizer?.translate?.(value) || value;
    const nativeTaglines = {
      en: "Free Browser Game",
      "zh-Hant": "\u514d\u8cbb\u7db2\u9801\u904a\u6232",
      "zh-Hans": "\u514d\u8d39\u7f51\u9875\u6e38\u620f",
      es: "Juego de navegador gratuito",
    };
    const visibleTitle = document.querySelector("#wonderMain [data-i18n='game_title']")?.textContent?.trim();
    const gameTitle = visibleTitle || runtimeTranslate("Fantasy Lion Defense");
    const tagline = nativeTaglines[activeLocale] || runtimeTranslate("Free Browser Game");
    // The em dash keeps the localized title and tagline as separate values.
    const title = `${gameTitle} \u2014 ${tagline} | WeightPlay`;
    document.title = title;
    document.querySelectorAll('meta[property="og:title"], meta[name="twitter:title"]').forEach((meta) => meta.setAttribute("content", title));
  }

  function queueCanonicalBrowserTitle() {
    setTimeout(syncCanonicalBrowserTitle, 0);
    setTimeout(syncCanonicalBrowserTitle, 80);
    setTimeout(syncCanonicalBrowserTitle, 250);
    setTimeout(syncCanonicalBrowserTitle, 600);
  }

  window.addEventListener("wonder:locale-change", queueCanonicalBrowserTitle);
  queueCanonicalBrowserTitle();
  const lockedStageText = () => ["zh-Hant", "zh-Hans"].includes(document.documentElement.lang)
    ? "\u95dc\u5361\u5c1a\u672a\u89e3\u9396\u3002"
    : "Stage locked.";

  function syncLockedStageSemantics() {
    document.querySelectorAll("#levelGrid button[data-level]").forEach((button) => {
      button.setAttribute("aria-disabled", String(button.classList.contains("locked")));
    });
  }

  const stageCards = () => [...document.querySelectorAll("#levelGrid button[data-level]:not(.campaign-continue)")];

  function recommendedStageCard(cards = stageCards()) {
    const focused = cards.find((button) => button === document.activeElement);
    const current = cards.find((button) => button.getAttribute("aria-current") === "true");
    const challenge = cards.find((button) => button.classList.contains("challenge"));
    const lastUnlocked = cards.filter((button) => !button.classList.contains("locked")).at(-1);
    return focused || current || challenge || lastUnlocked || cards[0] || null;
  }

  const stageCenterAnimations = new WeakMap();

  function cancelStageCenterAnimation(rail, restore = true) {
    const animation = stageCenterAnimations.get(rail);
    if (!animation) return;
    cancelAnimationFrame(animation.frame);
    stageCenterAnimations.delete(rail);
    if (restore) animation.restore();
  }

  function centerStageCard(button, { smooth = false } = {}) {
    const rail = button?.closest("#levelGrid");
    if (!rail || !rail.getClientRects().length) return;
    const railRect = rail.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const coordinateScale = railRect.width > 0 ? rail.clientWidth / railRect.width : 1;
    const target = rail.scrollLeft
      + ((buttonRect.left + buttonRect.width / 2) - (railRect.left + railRect.width / 2)) * coordinateScale;
    const maximum = Math.max(0, rail.scrollWidth - rail.clientWidth);
    const bounded = getComputedStyle(rail).direction === "rtl"
      ? Math.max(-maximum, Math.min(0, target))
      : Math.max(0, Math.min(maximum, target));
    const running = stageCenterAnimations.get(rail);
    if (smooth && running && Math.abs(running.target - bounded) <= 1) return;
    cancelStageCenterAnimation(rail);
    if (smooth && Math.abs(bounded - rail.scrollLeft) > 1) {
      const previousBehavior = rail.style.getPropertyValue("scroll-behavior");
      const previousBehaviorPriority = rail.style.getPropertyPriority("scroll-behavior");
      const previousSnap = rail.style.getPropertyValue("scroll-snap-type");
      const previousSnapPriority = rail.style.getPropertyPriority("scroll-snap-type");
      const restore = () => {
        if (previousBehavior) rail.style.setProperty("scroll-behavior", previousBehavior, previousBehaviorPriority);
        else rail.style.removeProperty("scroll-behavior");
        if (previousSnap) rail.style.setProperty("scroll-snap-type", previousSnap, previousSnapPriority);
        else rail.style.removeProperty("scroll-snap-type");
      };
      const animation = {
        frame: 0,
        target: bounded,
        restore,
      };
      stageCenterAnimations.set(rail, animation);
      rail.style.setProperty("scroll-behavior", "auto", "important");
      rail.style.setProperty("scroll-snap-type", "none", "important");
      const start = rail.scrollLeft;
      const started = performance.now();
      const duration = Math.min(520, Math.max(260, Math.abs(bounded - start) * 1.35));
      const step = (now) => {
        if (stageCenterAnimations.get(rail) !== animation) return;
        const progress = Math.max(0, Math.min(1, (now - started) / duration));
        const eased = progress * progress * (3 - 2 * progress);
        rail.scrollLeft = start + (bounded - start) * eased;
        if (progress < 1) {
          animation.frame = requestAnimationFrame(step);
          return;
        }
        rail.scrollLeft = bounded;
        stageCenterAnimations.delete(rail);
        restore();
      };
      animation.frame = requestAnimationFrame(step);
      return;
    }
    const previousBehavior = rail.style.getPropertyValue("scroll-behavior");
    const previousPriority = rail.style.getPropertyPriority("scroll-behavior");
    rail.style.setProperty("scroll-behavior", "auto", "important");
    rail.scrollLeft = bounded;
    if (previousBehavior) rail.style.setProperty("scroll-behavior", previousBehavior, previousPriority);
    else rail.style.removeProperty("scroll-behavior");
  }

  function syncStageKeyboardSemantics(preferred = null, { focus = false, center = false } = {}) {
    const cards = stageCards();
    if (!cards.length) return null;
    const target = cards.includes(preferred) ? preferred : recommendedStageCard(cards);
    cards.forEach((button) => {
      const owned = button === target;
      button.tabIndex = owned ? 0 : -1;
      button.setAttribute("aria-keyshortcuts", "ArrowLeft ArrowRight Home End");
      button.dataset.wpStageRecommended = owned ? "true" : "false";
      if (owned) button.setAttribute("aria-current", "true");
      else button.removeAttribute("aria-current");
    });
    if (focus) target?.focus({ preventScroll: true });
    if (center) {
      centerStageCard(target, { smooth: true });
      requestAnimationFrame(() => centerStageCard(target, { smooth: true }));
    }
    return target;
  }

  function syncLocalizedAccessibility() {
    const isTraditionalChinese = ["zh-Hant", "zh-Hans"].includes(document.documentElement.lang);
    const board = document.querySelector("#game");
    const stageBack = document.querySelector("#wonderStageBack");
    if (board) {
      board.setAttribute("aria-label", isTraditionalChinese
        ? "\u5947\u5e7b\u7345\u5b50\u5b88\u57ce\u904a\u6232\u756b\u9762"
        : "Fantasy Lion Defense game board");
      board.setAttribute("aria-description", isTraditionalChinese
        ? "\u4f7f\u7528\u5de6\u53f3\u65b9\u5411\u9375\u79fb\u52d5\u7345\u5b50\uff0c\u6216\u5728\u904a\u6232\u756b\u9762\u4e0a\u62d6\u66f3\u3002"
        : "Move the lion with Left and Right Arrow keys, or drag across the game board.");
    }
    if (stageBack) stageBack.setAttribute("aria-label", isTraditionalChinese ? "\u8fd4\u56de" : "Back");
    const stageStatus = document.querySelector("#wonderStageStatus");
    if (stageStatus?.textContent) stageStatus.textContent = lockedStageText();
    syncLockedStageSemantics();
  }

  function updateViewport() {
    const width = Math.max(1, window.innerWidth);
    const viewportHeight = Math.max(1, window.innerHeight);
    const availableWidth = Math.min(width, DESKTOP_CANVAS_MAX_WIDTH);
    const playing = document.body.classList.contains("wonder-playing");
    const selectingStage = document.body.classList.contains("wonder-stage-select") && !playing;
    const reserveHeight = (playing || selectingStage)
      ? Math.max(0, Number(window.WeightPlayAudience?.reserveHeight) || 0)
      : 0;
    const height = Math.max(1, viewportHeight - reserveHeight);
    document.documentElement.style.setProperty("--wonder-vw", `${width}px`);
    document.documentElement.style.setProperty("--wonder-vh", `${viewportHeight}px`);
    const menuScale = Math.min(width / MENU_LOGICAL_WIDTH, viewportHeight / MENU_LOGICAL_HEIGHT);
    const useStageLandscape = availableWidth / height >= 1.5;
    const stageMinimumWidth = useStageLandscape ? STAGE_LANDSCAPE_WIDTH : STAGE_LOGICAL_WIDTH;
    const stageMinimumHeight = useStageLandscape ? STAGE_LANDSCAPE_HEIGHT : STAGE_LOGICAL_HEIGHT;
    const stageScale = Math.min(
      availableWidth / stageMinimumWidth,
      height / stageMinimumHeight
    );
    const useBattleLandscape = availableWidth / height >= 1.5 && height <= 500;
    const battleMinimumWidth = useBattleLandscape ? BATTLE_LANDSCAPE_WIDTH : BATTLE_LOGICAL_WIDTH;
    const battleMinimumHeight = useBattleLandscape ? BATTLE_LANDSCAPE_HEIGHT : BATTLE_LOGICAL_HEIGHT;
    const battleScale = Math.min(
      availableWidth / battleMinimumWidth,
      height / battleMinimumHeight
    );
    const stageLogicalWidth = availableWidth / stageScale;
    const stageLogicalHeight = height / stageScale;
    const stageBackSize = Math.max(48, 44 / stageScale);
    const stageTabHeight = Math.max(44, 44 / stageScale);
    const stageTabMinWidth = Math.max(48, 48 / stageScale);
    const battleLogicalWidth = availableWidth / battleScale;
    const battleLogicalHeight = height / battleScale;
    const battleControlSize = Math.max(48, 44 / battleScale);
    const centeredLeft = Math.max(0, (width - availableWidth) / 2);
    const shell = document.querySelector(".game-shell");
    const reserve = document.querySelector("#battleAdReserve");
    reserve?.toggleAttribute("data-active", playing || selectingStage);
    if (reserve) reserve.style.width = `${availableWidth}px`;
    document.documentElement.style.setProperty("--wonder-shell-scale", String(selectingStage ? stageScale : menuScale));
    document.documentElement.style.setProperty("--wonder-menu-rendered-width", `${MENU_LOGICAL_WIDTH * menuScale}px`);
    document.documentElement.style.setProperty("--wonder-menu-rendered-height", `${MENU_LOGICAL_HEIGHT * menuScale}px`);
    document.documentElement.style.setProperty("--wonder-stage-left", `${centeredLeft}px`);
    document.documentElement.style.setProperty("--wonder-stage-logical-width", `${stageLogicalWidth}px`);
    document.documentElement.style.setProperty("--wonder-stage-logical-height", `${stageLogicalHeight}px`);
    document.documentElement.style.setProperty("--wonder-stage-inverse-scale", String(selectingStage ? 1 / stageScale : 1));
    document.documentElement.style.setProperty("--wonder-stage-back-size", `${stageBackSize}px`);
    document.documentElement.style.setProperty("--wonder-stage-tab-height", `${stageTabHeight}px`);
    document.documentElement.style.setProperty("--wonder-stage-tab-min-width", `${stageTabMinWidth}px`);
    const stageSettingsPopover = document.querySelector(".wp-shell-settings-popover");
    if (stageSettingsPopover) {
      stageSettingsPopover.style.setProperty("transform", `scale(${selectingStage ? 1 / stageScale : 1})`, "important");
      stageSettingsPopover.style.setProperty(
        "transform-origin",
        stageSettingsPopover.closest("[data-wp-popover-edge='left']") ? "top left" : "top right",
        "important"
      );
    }
    if (selectingStage) shell?.setAttribute("data-wp-logical-stage-canvas", `${stageLogicalWidth.toFixed(3)}x${stageLogicalHeight.toFixed(3)}`);
    else shell?.removeAttribute("data-wp-logical-stage-canvas");
    if (playing) {
      document.documentElement.style.setProperty("--wonder-battle-scale", String(battleScale));
      document.documentElement.style.setProperty("--wonder-battle-left", `${centeredLeft}px`);
      document.documentElement.style.setProperty("--wonder-battle-logical-width", `${battleLogicalWidth}px`);
      document.documentElement.style.setProperty("--wonder-battle-logical-height", `${battleLogicalHeight}px`);
      document.documentElement.style.setProperty("--wonder-battle-control-size", `${battleControlSize}px`);
      shell?.setAttribute("data-wp-logical-battle-canvas", `${battleLogicalWidth.toFixed(3)}x${battleLogicalHeight.toFixed(3)}`);
    } else {
      shell?.removeAttribute("data-wp-logical-battle-canvas");
    }
  }

  function settleViewportAfterSceneChange() {
    updateViewport();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      updateViewport();
      syncCanonicalBrowserTitle();
      const stageIsVisible = document.body.classList.contains("wonder-stage-select")
        && !document.body.classList.contains("wonder-playing");
      if (!stageIsVisible) cancelStageCenterAnimation(document.querySelector("#levelGrid"));
      if (stageIsVisible) {
        syncStageKeyboardSemantics(null, { center: true });
      }
      if (document.body.classList.contains("wonder-playing")
        && document.querySelector("#overlay")?.classList.contains("hidden")) {
        document.querySelector("#game")?.focus({ preventScroll: true });
      }
    }));
  }

  updateViewport();
  syncLocalizedAccessibility();
  window.addEventListener("resize", updateViewport, { passive: true });
  window.visualViewport?.addEventListener("resize", updateViewport, { passive: true });
  window.visualViewport?.addEventListener("scroll", updateViewport, { passive: true });
  window.addEventListener("wonder:locale-change", syncLocalizedAccessibility);
  document.querySelector("#wonderMainLocaleSelect")?.addEventListener("change", queueCanonicalBrowserTitle);
  new MutationObserver(settleViewportAfterSceneChange).observe(document.body, { attributes: true, attributeFilter: ["class"] });

  const stageRail = document.querySelector("#levelGrid");
  const stageStatus = document.querySelector("#wonderStageStatus");
  if (stageRail) {
    // Wonder Crash owns initial/current centering locally so the shared
    // recommendation writer cannot race a just-committed keyboard target.
    stageRail.dataset.wpStageCenterObserver = "manual";
    const announceLockedStage = (button) => {
      if (!button?.classList.contains("locked")) return;
      if (stageStatus) {
        stageStatus.textContent = "";
        requestAnimationFrame(() => { stageStatus.textContent = lockedStageText(); });
      }
      requestAnimationFrame(() => button.focus({ preventScroll: true }));
    };

    stageRail.addEventListener("click", (event) => {
      if (stageRail.dataset.wpVirtualSuppressClick === "true") {
        stageRail.dataset.wpVirtualSuppressClick = "false";
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      const button = event.target.closest("button[data-level]:not(.campaign-continue)");
      if (button && document.body.classList.contains("wonder-stage-select")) {
        syncStageKeyboardSemantics(button, { focus: button.classList.contains("locked"), center: true });
      }
      if (button && document.body.classList.contains("wonder-playing")) {
        const focusBattle = () => {
          if (document.body.classList.contains("wonder-playing")
            && document.querySelector("#overlay")?.classList.contains("hidden")) {
            document.querySelector("#game")?.focus({ preventScroll: true });
          }
        };
        focusBattle();
        requestAnimationFrame(() => requestAnimationFrame(focusBattle));
        setTimeout(focusBattle, 50);
      }
      announceLockedStage(button?.classList.contains("locked") ? button : null);
    });

    stageRail.addEventListener("focusin", (event) => {
      const button = event.target.closest("button[data-level]:not(.campaign-continue)");
      if (button) syncStageKeyboardSemantics(button);
    });

    stageRail.addEventListener("keydown", (event) => {
      const button = event.target.closest("button[data-level]:not(.campaign-continue)");
      if (!button || event.altKey || event.ctrlKey || event.metaKey) return;
      const cards = stageCards();
      const index = Number(button.dataset.level);
      if (!Number.isFinite(index) || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      const rtl = getComputedStyle(stageRail).direction === "rtl" || document.documentElement.dir === "rtl";
      const step = event.key === "ArrowRight" ? (rtl ? -1 : 1) : event.key === "ArrowLeft" ? (rtl ? 1 : -1) : 0;
      const total = Number(stageRail.dataset.wpStageTotal || window.WonderStage?.total || 30);
      const nextIndex = event.key === "Home"
        ? 0
        : event.key === "End"
          ? total - 1
          : Math.max(0, Math.min(total - 1, index + step));
      event.preventDefault();
      event.stopPropagation();
      window.WonderStage?.setBrowse(nextIndex);
      const target = stageRail.querySelector(`button[data-level="${nextIndex}"]`);
      syncStageKeyboardSemantics(target, { focus: true, center: true });
    });

    let virtualStagePointer = null;
    let stageSettleTimer = 0;
    let stageSettleFrame = 0;
    const stageCardPitch = () => {
      const cards = stageCards();
      const first = cards[0]?.getBoundingClientRect();
      const second = cards[1]?.getBoundingClientRect();
      return first && second ? Math.max(1, Math.abs(second.left - first.left)) : 276;
    };
    const stageLogicalAtCenter = () => {
      const cards = stageCards();
      const railRect = stageRail.getBoundingClientRect();
      const center = railRect.left + railRect.width / 2;
      const nearest = cards.reduce((best, card) => {
        const rect = card.getBoundingClientRect();
        const distance = Math.abs(rect.left + rect.width / 2 - center);
        return !best || distance < best.distance ? { card, distance } : best;
      }, null)?.card;
      if (!nearest) return 0;
      const pitch = stageCardPitch();
      const index = Number(nearest.dataset.level) || 0;
      return index + (center - (nearest.getBoundingClientRect().left + nearest.getBoundingClientRect().width / 2)) / pitch;
    };
    const animateStageRailTo = (target, duration) => {
      if (stageSettleFrame) cancelAnimationFrame(stageSettleFrame);
      const start = stageRail.scrollLeft;
      const started = performance.now();
      const step = (now) => {
        const progress = Math.max(0, Math.min(1, (now - started) / duration));
        const eased = progress * progress * (3 - 2 * progress);
        stageRail.scrollLeft = start + (target - start) * eased;
        if (progress < 1) stageSettleFrame = requestAnimationFrame(step);
        else stageSettleFrame = 0;
      };
      stageSettleFrame = requestAnimationFrame(step);
    };
    const positionStageLogical = (logical, { smooth = false } = {}) => {
      const total = Number(stageRail.dataset.wpStageTotal || window.WonderStage?.total || 30);
      const value = Math.max(0, Math.min(total - 1, logical));
      const anchor = Math.floor(value);
      window.WonderStage?.setBrowse(anchor);
      const target = stageRail.querySelector(`button[data-level="${anchor}"]`);
      if (!target) return value;
      const railRect = stageRail.getBoundingClientRect();
      const cardRect = target.getBoundingClientRect();
      const pitch = stageCardPitch();
      const fraction = value - anchor;
      const adjustment = (cardRect.left + cardRect.width / 2 - (railRect.left + railRect.width / 2)) + fraction * pitch;
      const maximum = Math.max(0, stageRail.scrollWidth - stageRail.clientWidth);
      const nextScrollLeft = getComputedStyle(stageRail).direction === "rtl"
        ? Math.max(-maximum, Math.min(0, stageRail.scrollLeft + adjustment))
        : Math.max(0, Math.min(maximum, stageRail.scrollLeft + adjustment));
      if (smooth) animateStageRailTo(nextScrollLeft, Math.max(240, Number(stageRail.dataset.wpStageSettleDuration || 360)));
      else stageRail.scrollLeft = nextScrollLeft;
      return value;
    };
    const finishVirtualStagePointer = (event) => {
      if (!virtualStagePointer || event.pointerId !== virtualStagePointer.pointerId) return;
      const active = virtualStagePointer;
      virtualStagePointer = null;
      const previousBehavior = stageRail.style.getPropertyValue("scroll-behavior");
      const previousSnap = stageRail.style.getPropertyValue("scroll-snap-type");
      const restoreStageRail = () => {
        if (previousBehavior) stageRail.style.setProperty("scroll-behavior", previousBehavior);
        else stageRail.style.removeProperty("scroll-behavior");
        if (previousSnap) stageRail.style.setProperty("scroll-snap-type", previousSnap);
        else stageRail.style.removeProperty("scroll-snap-type");
      };
      if (!active.moved || event.type === "pointercancel") {
        restoreStageRail();
        return;
      }
      if (event.cancelable) event.preventDefault();
      stageRail.dataset.wpSuppressClick = "true";
      stageRail.dataset.wpVirtualSuppressClick = "true";
      window.setTimeout(() => {
        if (stageRail.dataset.wpSuppressClick === "true") stageRail.dataset.wpSuppressClick = "false";
        if (stageRail.dataset.wpVirtualSuppressClick === "true") stageRail.dataset.wpVirtualSuppressClick = "false";
      }, 0);
      const settled = Math.round(active.logical);
      stageRail.style.setProperty("scroll-behavior", "auto", "important");
      stageRail.style.setProperty("scroll-snap-type", "none", "important");
      window.WonderStage?.setBrowse(settled);
      positionStageLogical(settled, { smooth: true });
      const target = stageRail.querySelector(`button[data-level="${settled}"]`);
      syncStageKeyboardSemantics(target);
      stageSettleTimer = window.setTimeout(() => {
        stageSettleTimer = 0;
        restoreStageRail();
      }, Math.max(600, Number(stageRail.dataset.wpStageSettleDuration || 360) + 240));
    };
    stageRail.addEventListener("pointerdown", (event) => {
      if (stageRail.dataset.wpStageVirtualDrag !== "true" || event.isPrimary === false || (event.button !== undefined && event.button !== 0)) return;
      cancelStageCenterAnimation(stageRail);
      if (stageSettleTimer) {
        window.clearTimeout(stageSettleTimer);
        stageSettleTimer = 0;
      }
      if (stageSettleFrame) {
        cancelAnimationFrame(stageSettleFrame);
        stageSettleFrame = 0;
      }
      virtualStagePointer = {
        pointerId: event.pointerId,
        lastX: event.clientX,
        logical: stageLogicalAtCenter(),
        moved: false,
      };
      stageRail.style.setProperty("scroll-behavior", "auto", "important");
      stageRail.style.setProperty("scroll-snap-type", "none", "important");
    }, true);
    document.addEventListener("pointermove", (event) => {
      if (!virtualStagePointer || event.pointerId !== virtualStagePointer.pointerId) return;
      const delta = event.clientX - virtualStagePointer.lastX;
      virtualStagePointer.lastX = event.clientX;
      if (Math.abs(delta) > 0.5) virtualStagePointer.moved = true;
      if (!virtualStagePointer.moved) return;
      if (event.cancelable) event.preventDefault();
      const rtl = getComputedStyle(stageRail).direction === "rtl" || document.documentElement.dir === "rtl";
      const pitch = stageCardPitch();
      virtualStagePointer.logical += rtl ? delta / pitch : -delta / pitch;
      positionStageLogical(virtualStagePointer.logical);
      event.stopPropagation();
    }, true);
    document.addEventListener("pointerup", finishVirtualStagePointer, true);
    document.addEventListener("pointercancel", finishVirtualStagePointer, true);

    let lockedPointer = null;
    const lockedCardAtPoint = (x, y) => [...stageRail.querySelectorAll("button.locked[data-level]")]
      .find((button) => {
        const rect = button.getBoundingClientRect();
        return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
      });

    stageRail.addEventListener("pointerdown", (event) => {
      if (event.isPrimary === false || (event.button !== undefined && event.button !== 0)) {
        lockedPointer = null;
        return;
      }
      const button = lockedCardAtPoint(event.clientX, event.clientY);
      lockedPointer = button ? {
        button,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        moved: false,
      } : null;
    }, true);

    document.addEventListener("pointermove", (event) => {
      if (!lockedPointer || event.pointerId !== lockedPointer.pointerId) return;
      if (Math.hypot(event.clientX - lockedPointer.startX, event.clientY - lockedPointer.startY) > 6) {
        lockedPointer.moved = true;
      }
    }, true);

    const finishLockedPointer = (event) => {
      if (!lockedPointer || event.pointerId !== lockedPointer.pointerId) return;
      const activation = lockedPointer;
      lockedPointer = null;
      if (event.type === "pointercancel" || activation.moved) return;
      if (event.cancelable) event.preventDefault();
      activation.button.click();
    };
    document.addEventListener("pointerup", finishLockedPointer, true);
    document.addEventListener("pointercancel", finishLockedPointer, true);

    new MutationObserver(() => {
      syncLockedStageSemantics();
      const preferredLevel = stageRail.dataset.wpStagePreferredLevel;
      const preferred = preferredLevel === undefined
        ? null
        : stageRail.querySelector(`button[data-level="${preferredLevel}"]`);
      syncStageKeyboardSemantics(preferred);
    }).observe(stageRail, { childList: true });
    syncLockedStageSemantics();
    syncStageKeyboardSemantics();
  }
  const pausePanel = document.querySelector("#pausePanel");
  const settingsButton = document.querySelector("#settingsBtn");
  const resumeButton = document.querySelector("#resumeBtn");
  const leaveButton = document.querySelector("#leaveBtn");
  const battleCanvas = document.querySelector("#game");
  const resultOverlay = document.querySelector("#overlay");
  const profilePanel = document.querySelector("#profilePanel");
  const overlayTitle = document.querySelector("#overlay h1");
  const focusCurrentStage = () => {
    const buttons = [...document.querySelectorAll("#levelGrid button[data-level]")]
      .filter((button) => button.getClientRects().length > 0 && !button.classList.contains("locked"));
    const target = buttons.find((button) => button.classList.contains("challenge")) || buttons.at(-1) || buttons[0];
    target?.focus({ preventScroll: true });
  };

  const setPausedBattleCovered = (covered) => {
    if (!battleCanvas) return;
    battleCanvas.inert = covered;
    if (covered) battleCanvas.setAttribute("aria-hidden", "true");
    else battleCanvas.removeAttribute("aria-hidden");
  };

  if (pausePanel && settingsButton && resumeButton && leaveButton && battleCanvas && overlayTitle) {
    overlayTitle.id ||= "wonderPauseTitle";
    pausePanel.setAttribute("role", "dialog");
    pausePanel.setAttribute("aria-modal", "true");
    pausePanel.setAttribute("aria-labelledby", overlayTitle.id);

    settingsButton.addEventListener("click", () => {
      if (pausePanel.classList.contains("hidden")) return;
      setPausedBattleCovered(true);
      requestAnimationFrame(() => resumeButton.focus({ preventScroll: true }));
    });

    resumeButton.addEventListener("click", () => {
      setPausedBattleCovered(false);
      requestAnimationFrame(() => battleCanvas.focus({ preventScroll: true }));
    });

    leaveButton.addEventListener("click", () => {
      setPausedBattleCovered(false);
      requestAnimationFrame(focusCurrentStage);
    });

    pausePanel.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      if (event.key !== "Escape" || pausePanel.classList.contains("hidden")) return;
      event.preventDefault();
      resumeButton.click();
    }, true);

    const pauseHiddenBattle = () => {
      if (!document.body.classList.contains("wonder-playing")
        || !pausePanel.classList.contains("hidden")
        || settingsButton.classList.contains("hidden")
        || settingsButton.disabled) return;
      settingsButton.click();
    };
    window.addEventListener("blur", pauseHiddenBattle);
    window.addEventListener("pagehide", pauseHiddenBattle);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) pauseHiddenBattle();
    });
  }

  if (resultOverlay && profilePanel && battleCanvas && overlayTitle) {
    const resultActions = () => [...profilePanel.querySelectorAll("[data-settlement-action]")]
      .filter((button) => !button.disabled && button.getClientRects().length > 0);
    const resultVisible = () => resultOverlay.classList.contains("settlement-screen")
      && !resultOverlay.classList.contains("hidden");
    let resultOwned = false;
    const syncResultOwnership = () => {
      const actions = resultActions();
      if (resultVisible()) {
        resultOwned = true;
        resultOverlay.setAttribute("role", "dialog");
        resultOverlay.setAttribute("aria-modal", "true");
        resultOverlay.setAttribute("aria-labelledby", overlayTitle.id);
        setPausedBattleCovered(true);
        if (actions.length && !actions.includes(document.activeElement)) {
          const preferred = actions.find((action) => action.dataset.settlementFocus === "true") || actions[0];
          requestAnimationFrame(() => preferred?.focus({ preventScroll: true }));
        }
        return;
      }
      if (!resultOwned) return;
      resultOwned = false;
      resultOverlay.removeAttribute("role");
      resultOverlay.removeAttribute("aria-modal");
      resultOverlay.removeAttribute("aria-labelledby");
      if (!pausePanel || pausePanel.classList.contains("hidden")) setPausedBattleCovered(false);
      requestAnimationFrame(() => {
        if (document.body.classList.contains("wonder-playing")) {
          battleCanvas.focus({ preventScroll: true });
          return;
        }
        if (document.body.classList.contains("wonder-stage-select")) {
          focusCurrentStage();
        }
      });
    };

    resultOverlay.addEventListener("keydown", (event) => {
      if (!resultVisible()) return;
      if (event.repeat && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      if (event.key !== "Tab") return;
      const actions = resultActions();
      if (!actions.length) return;
      const index = actions.indexOf(document.activeElement);
      const nextIndex = event.shiftKey
        ? (index <= 0 ? actions.length - 1 : index - 1)
        : (index < 0 || index >= actions.length - 1 ? 0 : index + 1);
      event.preventDefault();
      actions[nextIndex].focus({ preventScroll: true });
    }, true);

    resultOverlay.addEventListener("click", (event) => {
      const action = event.target.closest("[data-settlement-action]");
      if (!action) return;
      resultOverlay.dataset.wpSettlementExit = action.dataset.settlementAction || "";
      const restoreResultExitFocus = () => {
        if (document.body.classList.contains("wonder-playing")) {
          battleCanvas.focus({ preventScroll: true });
          return;
        }
        if (document.body.classList.contains("wonder-stage-select")) {
          focusCurrentStage();
        }
      };
      requestAnimationFrame(() => requestAnimationFrame(restoreResultExitFocus));
      setTimeout(restoreResultExitFocus, 50);
    }, true);

    new MutationObserver(syncResultOwnership).observe(resultOverlay, { attributes: true, attributeFilter: ["class"] });
    new MutationObserver(syncResultOwnership).observe(profilePanel, { childList: true });
    syncResultOwnership();
  }
})();
