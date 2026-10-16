/* Reusable pointer rail for the optional Stage I9 card system.
   Games provide logical-position and selection adapters; this module owns
   pointer capture, tap/drag separation and the shared settle curve. */
(() => {
  "use strict";
  const controllers = new WeakMap();

  function clampIndex(value, count) {
    return Math.max(0, Math.min(Math.max(0, count - 1), Math.round(value)));
  }

  function attachLogical(rail, config = {}) {
    const existing = controllers.get(rail);
    if (existing) return existing;
    if (!rail || typeof config.readPosition !== "function"
        || typeof config.writePosition !== "function"
        || typeof config.pitch !== "function"
        || typeof config.count !== "function"
        || typeof config.commitIndex !== "function") return null;

    rail.dataset.wpStageVirtualDrag = "true";
    rail.dataset.wpStageCenterObserver = "manual";
    rail.dataset.wpStageGesture = "i9";
    const abort = new AbortController();
    let pointerId = null;
    let startX = 0;
    let lastX = 0;
    let dragPosition = 0;
    let moved = false;
    let suppressClick = false;
    let suppressTimer = 0;
    let frame = 0;
    let closed = false;

    function restoreInteraction() {
      const active = pointerId;
      pointerId = null;
      moved = false;
      if (active !== null && rail.hasPointerCapture?.(active)) {
        try { rail.releasePointerCapture(active); } catch {}
      }
      rail.style.removeProperty("scroll-behavior");
      rail.style.removeProperty("scroll-snap-type");
      delete rail.dataset.wpStageSettling;
      delete rail.dataset.wpDragDown;
      rail.classList.remove("wp-stage-dragging");
    }

    function cancelSettle() {
      if (!frame) return;
      cancelAnimationFrame(frame);
      frame = 0;
      config.onFrame?.(0);
      delete rail.dataset.wpStageSettling;
    }

    function cancelMotion() {
      cancelSettle();
      restoreInteraction();
      window.clearTimeout(suppressTimer);
      suppressClick = false;
    }

    function dispose() {
      if (closed) return;
      closed = true;
      cancelMotion();
      abort.abort();
      controllers.delete(rail);
      delete rail.dataset.wpStageVirtualDrag;
      delete rail.dataset.wpStageCenterObserver;
      delete rail.dataset.wpStageGesture;
    }

    function onDown(event) {
      if (closed || event.isPrimary === false || (event.button ?? 0) !== 0) return;
      cancelSettle();
      if (config.onStart?.(event) === false) return;
      pointerId = event.pointerId;
      rail.dataset.wpDragDown = "1";
      startX = lastX = event.clientX;
      dragPosition = config.readPosition();
      moved = false;
      rail.style.setProperty("scroll-behavior", "auto", "important");
      rail.style.setProperty("scroll-snap-type", "none", "important");
      event.stopImmediatePropagation();
    }

    function onMove(event) {
      if (event.pointerId !== pointerId) return;
      const delta = event.clientX - lastX;
      lastX = event.clientX;
      if (!moved && Math.abs(event.clientX - startX) > 4) {
        moved = true;
        try { rail.setPointerCapture?.(event.pointerId); } catch {}
        rail.classList.add("wp-stage-dragging");
        config.onDragStart?.();
      }
      if (!moved) return;
      if (event.cancelable) event.preventDefault();
      const pitch = Math.max(1, Number(config.pitch()) || 1);
      dragPosition = config.writePosition(dragPosition - delta / pitch);
      event.stopImmediatePropagation();
    }

    function settleToNearest(suppressTap = true) {
      const index = clampIndex(dragPosition, config.count());
      config.commitIndex(index);
      rail.dataset.wpStageSettling = "true";
      if (suppressTap) {
        suppressClick = true;
        window.clearTimeout(suppressTimer);
        suppressTimer = window.setTimeout(() => { suppressClick = false; }, 0);
      }
      const from = dragPosition;
      const startedAt = performance.now();
      const duration = 280;
      const settle = (now) => {
        const progress = Math.max(0, Math.min(1, (now - startedAt) / duration));
        const eased = progress * progress * (3 - 2 * progress);
        config.writePosition(from + (index - from) * eased);
        if (progress < 1) {
          frame = requestAnimationFrame(settle);
          config.onFrame?.(frame);
          return;
        }
        frame = 0;
        config.onFrame?.(0);
        config.writePosition(index);
        config.onSettled?.(index);
        restoreInteraction();
      };
      frame = requestAnimationFrame(settle);
      config.onFrame?.(frame);
    }

    function onFinish(event) {
      if (pointerId === null || (event.pointerId !== undefined && event.pointerId !== pointerId)) return;
      const activePointer = pointerId;
      const didMove = moved;
      pointerId = null;
      if (rail.hasPointerCapture?.(activePointer)) {
        try { rail.releasePointerCapture(activePointer); } catch {}
      }
      if (event.type === "pointercancel") {
        restoreInteraction();
        config.onCancel?.(event);
        if (didMove) settleToNearest();
        event.stopImmediatePropagation();
        return;
      }
      if (!didMove) {
        restoreInteraction();
        event.stopImmediatePropagation();
        return;
      }

      if (event.cancelable) event.preventDefault();
      settleToNearest();
      moved = false;
      event.stopImmediatePropagation();
    }

    rail.addEventListener("pointerdown", onDown, { capture: true, signal: abort.signal });
    document.addEventListener("pointermove", onMove, { capture: true, signal: abort.signal });
    document.addEventListener("pointerup", onFinish, { capture: true, signal: abort.signal });
    document.addEventListener("pointercancel", onFinish, { capture: true, signal: abort.signal });
    rail.addEventListener("click", (event) => {
      if (!suppressClick) return;
      suppressClick = false;
      window.clearTimeout(suppressTimer);
      event.preventDefault();
      event.stopImmediatePropagation();
    }, { capture: true, signal: abort.signal });
    rail.addEventListener("dragstart", (event) => event.preventDefault(), {
      capture: true, signal: abort.signal,
    });

    // Scene changes stop motion; only final teardown removes the listeners.
    const controller = Object.freeze({ cancel: cancelMotion, dispose });
    controllers.set(rail, controller);
    return controller;
  }

  function mountVisual(rail, { artUrl, artPositionForStage, artTagName = "span" } = {}) {
    if (!rail) return null;
    document.documentElement.dataset.wpStageI9 = "true";
    const stagePage = rail.closest("#stagePage") || rail.parentElement;
    if (stagePage) stagePage.dataset.wpStageI9Page = "true";
    rail.dataset.wpStageI9 = "true";
    rail.dataset.wpStageRail = "true";
    const pageStyle = stagePage ? getComputedStyle(stagePage) : null;
    const cardWidth = pageStyle?.getPropertyValue("--wp-stage-i9-card-width").trim() || "292px";
    const cardHeight = pageStyle?.getPropertyValue("--wp-stage-i9-card-height").trim() || "clamp(324px,45vh,372px)";
    // Existing game selectors often use an ID and outrank shared class rules.
    // These layout values are therefore applied inline by the reusable adapter.
    for (const [property, value] of Object.entries({
      position: "absolute", left: "0px", right: "0px", top: "50%", width: "100%",
      height: cardHeight, minHeight: cardHeight, maxHeight: cardHeight,
      margin: "0px", paddingInline: `max(22px,calc((100% - ${cardWidth}) / 2))`,
      transform: "translateY(-50%)",
    })) rail.style.setProperty(property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`), value, "important");
    const stageRoot = rail.closest("#stagePanel") || stagePage;
    const stageHeader = stageRoot?.querySelector(".wp-stage-shell-header")
      || document.querySelector('[data-wp-frame-header="stage"]')
      || document.querySelector('[data-wp-return="stage"]')?.closest(
        'header,.wp-generated-stage-header,.stage-panel-head,.stage-header',
      );
    const stageFrameScene = stageHeader?.closest('[data-wp-frame-scene="stage"]');
    const frameSceneLayoutProperties = [
      "--wp-frame-control-size",
      "--wp-frame-header-height",
      "--wp-frame-rows",
      "--wp-frame-lobby-return-width",
    ];
    const priorFrameSceneLayout = new Map(frameSceneLayoutProperties.map((property) => [property, {
      value: stageFrameScene?.style.getPropertyValue(property) || "",
      priority: stageFrameScene?.style.getPropertyPriority(property) || "",
    }]));
    const priorStageHeaderMarker = stageHeader?.getAttribute("data-wp-stage-i9-header");
    stageHeader?.setAttribute("data-wp-stage-i9-header", "true");
    const headerLayoutProperties = [
      "--wp-stage-i9-control-size",
      "--wp-stage-i9-header-height",
      "--wp-stage-i9-safe-top",
      "--wp-stage-i9-side-inset",
      "--wp-frame-control-size-physical",
      "--wp-frame-physical-control-size",
      "--wp-frame-control-size",
      "--wp-frame-header-height",
      "padding",
    ];
    const priorHeaderLayout = new Map(headerLayoutProperties.map((property) => [property, {
      value: stageHeader?.style.getPropertyValue(property) || "",
      priority: stageHeader?.style.getPropertyPriority(property) || "",
    }]));
    const safeAreaProbe = document.createElement("span");
    safeAreaProbe.setAttribute("aria-hidden", "true");
    safeAreaProbe.style.cssText = [
      "position:fixed", "inset:0 auto auto 0", "width:0", "height:0",
      "padding:env(safe-area-inset-top, 0px) env(safe-area-inset-right, 0px) env(safe-area-inset-bottom, 0px) env(safe-area-inset-left, 0px)",
      "visibility:hidden", "pointer-events:none",
    ].join(";");
    document.body.append(safeAreaProbe);
    const centerRailInStageRoot = () => {
      const rootRect = stageRoot?.getBoundingClientRect();
      const pageRect = stagePage?.getBoundingClientRect();
      if (!rootRect?.height || !pageRect?.height || !stagePage?.offsetHeight) return;
      const viewport = window.visualViewport;
      const viewportTop = viewport?.offsetTop || 0;
      const viewportBottom = viewportTop + (viewport?.height || window.innerHeight);
      const safe = getComputedStyle(safeAreaProbe);
      const safeTop = Number.parseFloat(safe.paddingTop) || 0;
      const safeBottom = Number.parseFloat(safe.paddingBottom) || 0;
      const headerRect = stageHeader?.getBoundingClientRect();
      const stageScale = stageHeader?.offsetWidth > 0
        ? headerRect.width / stageHeader.offsetWidth : 1;
      const inverseStageScale = 1 / Math.max(0.01, stageScale || 1);
      if (stageHeader) {
        stageHeader.style.setProperty("--wp-stage-i9-control-size", `${48 * inverseStageScale}px`);
        stageHeader.style.setProperty("--wp-stage-i9-header-height", `${(48 + safeTop) * inverseStageScale}px`);
        stageHeader.style.setProperty("--wp-stage-i9-safe-top", `${safeTop * inverseStageScale}px`);
        stageHeader.style.setProperty("--wp-stage-i9-side-inset", `${16 * inverseStageScale}px`);
        stageHeader.style.setProperty("--wp-frame-control-size-physical", `${48 * inverseStageScale}px`, "important");
        stageHeader.style.setProperty("--wp-frame-physical-control-size", `${48 * inverseStageScale}px`, "important");
        stageHeader.style.setProperty("--wp-frame-control-size", `${48 * inverseStageScale}px`, "important");
        stageHeader.style.setProperty("--wp-frame-header-height", `${(48 + safeTop) * inverseStageScale}px`, "important");
        stageHeader.style.setProperty("padding", `${safeTop * inverseStageScale}px ${16 * inverseStageScale}px 0`, "important");
      }
      if (stageFrameScene) {
        stageFrameScene.style.setProperty("--wp-frame-control-size", `${48 * inverseStageScale}px`, "important");
        stageFrameScene.style.setProperty("--wp-frame-header-height", `${(48 + safeTop) * inverseStageScale}px`, "important");
        stageFrameScene.style.setProperty("--wp-frame-rows", `${(48 + safeTop) * inverseStageScale}px minmax(0,1fr) 56px`, "important");
        stageFrameScene.style.setProperty("--wp-frame-lobby-return-width", `${48 * inverseStageScale}px`, "important");
      }
      const usableTop = Math.max(rootRect.top, viewportTop + safeTop);
      const usableBottom = Math.min(rootRect.bottom, viewportBottom - safeBottom);
      if (usableBottom <= usableTop) return;
      const pageScaleY = pageRect.height / stagePage.offsetHeight || 1;
      const localCenter = ((usableTop + usableBottom) / 2 - pageRect.top) / pageScaleY;
      rail.style.setProperty("top", `${localCenter}px`, "important");
    };
    let centerFrame = 0;
    const scheduleCenterRail = () => {
      if (centerFrame) return;
      centerFrame = requestAnimationFrame(() => {
        centerFrame = 0;
        centerRailInStageRoot();
      });
    };
    const centerResizeObserver = typeof ResizeObserver === "function"
      ? new ResizeObserver(scheduleCenterRail) : null;
    centerResizeObserver?.observe(stageRoot);
    centerResizeObserver?.observe(stagePage);
    window.addEventListener("resize", scheduleCenterRail, { passive: true });
    window.addEventListener("orientationchange", scheduleCenterRail, { passive: true });
    window.visualViewport?.addEventListener("resize", scheduleCenterRail, { passive: true });
    window.visualViewport?.addEventListener("scroll", scheduleCenterRail, { passive: true });
    scheduleCenterRail();
    if (artUrl) {
      rail.style.setProperty("--wp-stage-i9-art-image", 'url("' + String(artUrl).replaceAll('"', "%22") + '")');
    }
    const decorate = () => {
      rail.querySelectorAll(":scope > .stage-card").forEach((card) => {
        let art = card.querySelector(":scope > .wp-stage-i9-card-art");
        if (!art) {
          // Some game adapters address their authored status with querySelector
          // ("span"). Let those adapters keep that node as their first span.
          art = document.createElement(artTagName === "i" ? "i" : "span");
          art.className = "wp-stage-i9-card-art";
          art.setAttribute("aria-hidden", "true");
          card.prepend(art);
        }
        const stage = Math.max(1, Number(card.dataset.stage) || 1);
        const positions = [52, 65, 41, 57, 69, 47];
        const position = typeof artPositionForStage === "function"
          ? artPositionForStage(stage, card)
          : "50% " + positions[Math.floor((stage - 1) / 5) % positions.length] + "%";
        card.style.setProperty("--wp-stage-i9-art-position", String(position));
        const selected = card.matches('.is-selected,.selected,[aria-current="true"],[aria-selected="true"]');
        for (const [property, value] of Object.entries({
          boxSizing: "border-box", position: "relative", display: "block",
          flex: `0 0 ${cardWidth}`, width: cardWidth, minWidth: cardWidth,
          maxWidth: cardWidth, height: cardHeight, minHeight: cardHeight,
          maxHeight: cardHeight, padding: "0px", overflow: "hidden",
          border: "2px solid rgb(179 222 237 / 56%)", borderRadius: "var(--wp-stage-i9-card-radius,23px)",
          textAlign: "left", background: "var(--wp-stage-i9-card-surface,linear-gradient(156deg,#173d53,#071522))",
          color: "#f5fbff", boxShadow: "0 18px 38px rgb(0 5 18 / 54%), inset 0 1px 0 rgb(255 255 255 / 22%)",
          filter: selected ? "saturate(1.08) brightness(1.04)" : "saturate(.72) brightness(.72)",
          opacity: selected ? "1" : ".78",
          transform: selected ? "scale(1)" : "scale(.92) translateY(5px)",
          transition: "transform 220ms cubic-bezier(.2,.8,.2,1),filter 180ms ease,opacity 180ms ease,box-shadow 220ms ease",
        })) card.style.setProperty(property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`), value, "important");
        if (selected) {
          card.style.setProperty("border-color", "var(--wp-stage-i9-accent,#9cfaff)", "important");
          card.style.setProperty("box-shadow", "0 0 0 2px rgb(156 250 255 / 46%), 0 0 34px rgb(65 222 247 / 44%), 0 22px 42px rgb(0 5 18 / 62%), inset 0 1px 0 rgb(255 255 255 / 42%)", "important");
        }
      });
    };
    decorate();
    const observer = new MutationObserver(decorate);
    observer.observe(rail, { subtree: true, childList: true, attributes: true, attributeFilter: ["data-stage"] });
    return Object.freeze({
      refresh: decorate,
      disconnect() {
        observer.disconnect();
        centerResizeObserver?.disconnect();
        window.removeEventListener("resize", scheduleCenterRail);
        window.removeEventListener("orientationchange", scheduleCenterRail);
        window.visualViewport?.removeEventListener("resize", scheduleCenterRail);
        window.visualViewport?.removeEventListener("scroll", scheduleCenterRail);
        if (stageHeader) {
          if (priorStageHeaderMarker === null) stageHeader.removeAttribute("data-wp-stage-i9-header");
          else stageHeader.setAttribute("data-wp-stage-i9-header", priorStageHeaderMarker);
          for (const [property, prior] of priorHeaderLayout) {
            if (prior.value) stageHeader.style.setProperty(property, prior.value, prior.priority);
            else stageHeader.style.removeProperty(property);
          }
        }
        if (stageFrameScene) {
          for (const [property, prior] of priorFrameSceneLayout) {
            if (prior.value) stageFrameScene.style.setProperty(property, prior.value, prior.priority);
            else stageFrameScene.style.removeProperty(property);
          }
        }
        if (centerFrame) cancelAnimationFrame(centerFrame);
        safeAreaProbe.remove();
      },
    });
  }

  function keyboardIndex(key, currentStage, stageCount, rtl = false) {
    const current = Math.max(1, Math.min(stageCount, Number(currentStage) || 1));
    if (key === "Home") return 1;
    if (key === "End") return stageCount;
    if (key === "ArrowRight") return Math.max(1, Math.min(stageCount, current + (rtl ? -1 : 1)));
    if (key === "ArrowLeft") return Math.max(1, Math.min(stageCount, current + (rtl ? 1 : -1)));
    return null;
  }

  window.WeightPlayStageRailI9 = Object.freeze({
    version: 1,
    attachLogical,
    mountVisual,
    keyboardIndex,
  });
})();
