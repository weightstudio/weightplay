(() => {
  const MENU_LOGICAL_WIDTH = 390;
  const MENU_LOGICAL_HEIGHT = MENU_LOGICAL_WIDTH * 16 / 9;
  const STAGE_LANDSCAPE_WIDTH = 760;
  const STAGE_LANDSCAPE_HEIGHT = 360;
  const BATTLE_LOGICAL_WIDTH = 390;
  const BATTLE_LOGICAL_HEIGHT = 788;
  const BATTLE_LANDSCAPE_WIDTH = 760;
  const BATTLE_LANDSCAPE_HEIGHT = 360;
  const DESKTOP_CANVAS_MAX_WIDTH = 920;

  function syncCanonicalBrowserTitle() {
    const activeLocale = window.WonderI18n?.actualLocale?.() || document.documentElement.lang || "en";
    const runtimeTranslate = (value) => window.WeightPlayGameRuntimeLocalizer?.translate?.(value) || value;
    const nativeTaglines = {
      en: "Free Kids Game",
      "zh-Hant": "免費兒童遊戲",
      "zh-Hans": "免费儿童游戏",
      es: "Juego gratuito para niños",
    };
    const visibleTitle = document.querySelector("#wonderMain [data-i18n='game_title']")?.textContent?.trim();
    const gameTitle = visibleTitle || runtimeTranslate("Fantasy Lion Defense");
    const tagline = nativeTaglines[activeLocale] || runtimeTranslate("Free Kids Game");
    // The shared runtime localizer treats the ASCII "title - tagline" shape as
    // a repeated-value template. An em dash keeps both localized fields intact.
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
    const height = Math.max(1, window.innerHeight);
    const availableWidth = Math.min(width, DESKTOP_CANVAS_MAX_WIDTH);
    document.documentElement.style.setProperty("--wonder-vw", `${width}px`);
    document.documentElement.style.setProperty("--wonder-vh", `${height}px`);
    const playing = document.body.classList.contains("wonder-playing");
    const menuScale = Math.min(width / MENU_LOGICAL_WIDTH, height / MENU_LOGICAL_HEIGHT);
    const useStageLandscape = availableWidth / height >= 1.5;
    const stageMinimumWidth = useStageLandscape ? STAGE_LANDSCAPE_WIDTH : MENU_LOGICAL_WIDTH;
    const stageMinimumHeight = useStageLandscape ? STAGE_LANDSCAPE_HEIGHT : MENU_LOGICAL_HEIGHT;
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
    const battleLogicalWidth = availableWidth / battleScale;
    const battleLogicalHeight = height / battleScale;
    const centeredLeft = Math.max(0, (width - availableWidth) / 2);
    const shell = document.querySelector(".game-shell");
    const selectingStage = document.body.classList.contains("wonder-stage-select") && !playing;
    document.documentElement.style.setProperty("--wonder-shell-scale", String(selectingStage ? stageScale : menuScale));
    document.documentElement.style.setProperty("--wonder-menu-rendered-width", `${MENU_LOGICAL_WIDTH * menuScale}px`);
    document.documentElement.style.setProperty("--wonder-menu-rendered-height", `${MENU_LOGICAL_HEIGHT * menuScale}px`);
    document.documentElement.style.setProperty("--wonder-stage-left", `${centeredLeft}px`);
    document.documentElement.style.setProperty("--wonder-stage-logical-width", `${stageLogicalWidth}px`);
    document.documentElement.style.setProperty("--wonder-stage-logical-height", `${stageLogicalHeight}px`);
    if (selectingStage) shell?.setAttribute("data-wp-logical-stage-canvas", `${stageLogicalWidth.toFixed(3)}x${stageLogicalHeight.toFixed(3)}`);
    else shell?.removeAttribute("data-wp-logical-stage-canvas");
    if (playing) {
      document.documentElement.style.setProperty("--wonder-battle-scale", String(battleScale));
      document.documentElement.style.setProperty("--wonder-battle-left", `${centeredLeft}px`);
      document.documentElement.style.setProperty("--wonder-battle-logical-width", `${battleLogicalWidth}px`);
      document.documentElement.style.setProperty("--wonder-battle-logical-height", `${battleLogicalHeight}px`);
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
    const announceLockedStage = (button) => {
      if (!button?.classList.contains("locked")) return;
      if (stageStatus) {
        stageStatus.textContent = "";
        requestAnimationFrame(() => { stageStatus.textContent = lockedStageText(); });
      }
      requestAnimationFrame(() => button.focus({ preventScroll: true }));
    };

    stageRail.addEventListener("click", (event) => {
      announceLockedStage(event.target.closest("button.locked[data-level]"));
    });

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

    new MutationObserver(syncLockedStageSemantics).observe(stageRail, { childList: true });
    syncLockedStageSemantics();
  }
  const pausePanel = document.querySelector("#pausePanel");
  const battleBackButton = document.querySelector("#backToMenuBtn");
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

    battleBackButton?.addEventListener("click", (event) => {
      if (!document.body.classList.contains("wonder-playing") || battleBackButton.classList.contains("hidden")) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      settingsButton.click();
      overlayTitle.textContent = leaveButton.textContent;
    }, true);

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
      actions.forEach((action) => action.classList.remove("wonder-terminal-primary"));
      if (resultVisible() && actions.length === 1 && actions[0].dataset.settlementAction === "home") {
        actions[0].classList.add("wonder-terminal-primary");
      }
      if (resultVisible()) {
        resultOwned = true;
        resultOverlay.setAttribute("role", "dialog");
        resultOverlay.setAttribute("aria-modal", "true");
        resultOverlay.setAttribute("aria-labelledby", overlayTitle.id);
        setPausedBattleCovered(true);
        if (actions.length && !actions.includes(document.activeElement)) {
          requestAnimationFrame(() => actions[0]?.focus({ preventScroll: true }));
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
