(() => {
  const MENU_LOGICAL_WIDTH = 390;
  const MENU_LOGICAL_HEIGHT = MENU_LOGICAL_WIDTH * 16 / 9;
  const BATTLE_LOGICAL_WIDTH = 390;
  const BATTLE_LOGICAL_HEIGHT = 788;

  const lockedStageText = () => document.documentElement.lang === "zh-Hant"
    ? "\u95dc\u5361\u5c1a\u672a\u89e3\u9396\u3002"
    : "Stage locked.";

  function syncLockedStageSemantics() {
    document.querySelectorAll("#levelGrid button[data-level]").forEach((button) => {
      button.setAttribute("aria-disabled", String(button.classList.contains("locked")));
    });
  }

  function syncLocalizedAccessibility() {
    const isTraditionalChinese = document.documentElement.lang === "zh-Hant";
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
    const viewport = window.visualViewport;
    const width = viewport?.width >= window.innerWidth * 0.75 ? viewport.width : window.innerWidth;
    const height = viewport?.height >= window.innerHeight * 0.75 ? viewport.height : window.innerHeight;
    document.documentElement.style.setProperty("--wonder-vw", `${width}px`);
    document.documentElement.style.setProperty("--wonder-vh", `${height}px`);
    const playing = document.body.classList.contains("wonder-playing");
    const menuScale = Math.min(width / MENU_LOGICAL_WIDTH, height / MENU_LOGICAL_HEIGHT);
    const battleScale = Math.min(
      width / BATTLE_LOGICAL_WIDTH,
      height / BATTLE_LOGICAL_HEIGHT
    );
    document.documentElement.style.setProperty("--wonder-shell-scale", String(menuScale));
    document.documentElement.style.setProperty("--wonder-menu-rendered-width", `${MENU_LOGICAL_WIDTH * menuScale}px`);
    document.documentElement.style.setProperty("--wonder-menu-rendered-height", `${MENU_LOGICAL_HEIGHT * menuScale}px`);
    if (playing) document.documentElement.style.setProperty("--wonder-battle-scale", String(battleScale));
  }

  function settleViewportAfterSceneChange() {
    updateViewport();
    requestAnimationFrame(() => requestAnimationFrame(updateViewport));
  }

  updateViewport();
  syncLocalizedAccessibility();
  window.addEventListener("resize", updateViewport, { passive: true });
  window.visualViewport?.addEventListener("resize", updateViewport, { passive: true });
  window.visualViewport?.addEventListener("scroll", updateViewport, { passive: true });
  window.addEventListener("wonder:locale-change", syncLocalizedAccessibility);
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
  if (stageRail && stageRail.dataset.wpStageRail !== "true") {
    stageRail.addEventListener("dragstart", (event) => event.preventDefault());
    let pointerId = null;
    let startX = 0;
    let startScrollLeft = 0;
    let dragged = false;
    let suppressNextClick = false;
    let suppressClickTimer = 0;
    let wheelSnapTimer = 0;

    const snapToNearestCard = (behavior = "smooth") => {
      const cards = [...stageRail.querySelectorAll("button[data-level]")];
      if (!cards.length) return;
      const railCenter = stageRail.scrollLeft + stageRail.clientWidth / 2;
      const nearest = cards.reduce((best, card) => {
        const center = card.offsetLeft + card.offsetWidth / 2;
        return Math.abs(center - railCenter) < Math.abs(best.center - railCenter) ? { card, center } : best;
      }, { card: cards[0], center: cards[0].offsetLeft + cards[0].offsetWidth / 2 }).card;
      const targetLeft = Math.max(0, Math.min(
        nearest.offsetLeft + nearest.offsetWidth / 2 - stageRail.clientWidth / 2,
        stageRail.scrollWidth - stageRail.clientWidth
      ));
      stageRail.scrollTo({ left: targetLeft, behavior });
    };

    stageRail.addEventListener("pointerdown", (event) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      pointerId = event.pointerId;
      stageRail.dataset.wpDragDown = "1";
      startX = event.clientX;
      startScrollLeft = stageRail.scrollLeft;
      dragged = false;
      suppressNextClick = false;
      window.clearTimeout(suppressClickTimer);
      stageRail.classList.add("is-mouse-dragging");
    });

    document.addEventListener("pointermove", (event) => {
      if (event.pointerId !== pointerId) return;
      const delta = event.clientX - startX;
      if (Math.abs(delta) > 5 && !dragged) {
        dragged = true;
        try {
          stageRail.setPointerCapture(pointerId);
        } catch {
          // Synthetic tests and cancelled browser gestures may not own capture.
        }
      }
      if (!dragged) return;
      event.preventDefault();
      stageRail.scrollLeft = startScrollLeft - delta;
    });

    const finishMouseDrag = (event = {}) => {
      if (pointerId === null) return;
      if (event.pointerId !== undefined && event.pointerId !== pointerId) return;
      const activePointerId = pointerId;
      const didDrag = dragged;
      pointerId = null;
      dragged = false;
      stageRail.dataset.wpDragDown = "0";
      stageRail.classList.remove("is-mouse-dragging");
      try {
        if (stageRail.hasPointerCapture(activePointerId)) stageRail.releasePointerCapture(activePointerId);
      } catch {
        // Pointer capture can already be gone after a cancelled browser gesture.
      }
      suppressNextClick = didDrag;
      if (didDrag) {
        // The browser's drag-generated click is synchronous with pointerup.
        // Clear before a deliberate follow-up tap can arrive.
        suppressClickTimer = window.setTimeout(() => { suppressNextClick = false; }, 0);
        requestAnimationFrame(() => snapToNearestCard());
      }
    };
    stageRail.addEventListener("pointerup", finishMouseDrag);
    stageRail.addEventListener("pointercancel", finishMouseDrag);
    stageRail.addEventListener("lostpointercapture", finishMouseDrag);
    document.addEventListener("pointerup", finishMouseDrag);
    document.addEventListener("pointercancel", finishMouseDrag);
    stageRail.addEventListener("click", (event) => {
      if (!suppressNextClick) return;
      suppressNextClick = false;
      window.clearTimeout(suppressClickTimer);
      event.preventDefault();
      event.stopImmediatePropagation();
    }, true);

    stageRail.addEventListener("wheel", (event) => {
      if (stageRail.scrollWidth <= stageRail.clientWidth) return;
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (!delta) return;
      event.preventDefault();
      stageRail.scrollLeft += delta;
      window.clearTimeout(wheelSnapTimer);
      wheelSnapTimer = window.setTimeout(() => snapToNearestCard(), 90);
    }, { passive: false });
  }

  const pausePanel = document.querySelector("#pausePanel");
  const settingsButton = document.querySelector("#settingsBtn");
  const resumeButton = document.querySelector("#resumeBtn");
  const leaveButton = document.querySelector("#leaveBtn");
  const battleCanvas = document.querySelector("#game");
  const overlayTitle = document.querySelector("#overlay h1");

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
      requestAnimationFrame(() => document.querySelector("#levelGrid .stage-card-current, #levelGrid button:not(:disabled)")?.focus({ preventScroll: true }));
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
    window.addEventListener("pagehide", pauseHiddenBattle);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) pauseHiddenBattle();
    });
  }
})();
