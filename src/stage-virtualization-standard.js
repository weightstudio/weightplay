(function () {
  "use strict";

  const DEFAULT_POOL_SIZE = 9;
  const CARD_SELECTOR = ".stage-card,.page-card,.mission-card,.region-card,.route-card,.day-card,.zone-card,.expedition-card,.merge-stage-card,.zone-node,[data-level],button";

  const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value));

  function logicalIndex(card, fallback, options) {
    const raw = options.index?.(card, fallback);
    if (Number.isFinite(raw)) return Math.max(0, Math.trunc(raw));
    for (const [key, offset] of [["stageIndex", 0], ["index", 0], ["stage", -1], ["level", -1], ["day", -1], ["page", -1], ["route", -1]]) {
      const value = Number(card.dataset[key]);
      if (Number.isFinite(value)) {
        const inferredOffset = options.zeroBasedKeys?.includes(key) ? 0 : offset;
        return Math.max(0, Math.trunc(value + inferredOffset));
      }
    }
    return fallback;
  }

  function copyCard(source, target, index, total, poolNode) {
    const keep = new Set(["data-wp-stage-pool-node", "data-wp-stage-virtual-index"]);
    [...target.attributes].forEach((attribute) => {
      if (!keep.has(attribute.name)) target.removeAttribute(attribute.name);
    });
    [...source.attributes].forEach((attribute) => target.setAttribute(attribute.name, attribute.value));
    target.dataset.wpStagePoolNode = poolNode;
    target.dataset.wpStageVirtualIndex = String(index);
    target.dataset.stageIndex = String(index);
    target.setAttribute("aria-posinset", String(index + 1));
    target.setAttribute("aria-setsize", String(total));
    target.setAttribute("aria-keyshortcuts", "ArrowLeft ArrowRight Home End");
    const locked = source.disabled || source.getAttribute("aria-disabled") === "true"
      || source.classList.contains("locked") || source.classList.contains("is-locked");
    target.disabled = false;
    target.setAttribute("aria-disabled", String(locked));
    target.innerHTML = source.innerHTML;
  }

  function install(rail, options = {}) {
    if (!rail || rail.dataset.wpStageVirtualizationInstalled === "true") return null;

    const selector = options.cardSelector || CARD_SELECTOR;
    const poolSize = Math.max(1, Number(options.poolSize) || DEFAULT_POOL_SIZE);
    let sources = [];
    let pool = [];
    let total = 0;
    let windowStart = 0;
    let logical = 0;
    let pointerId = null;
    let pointerStart = 0;
    let lastPointer = 0;
    let moved = false;
    let settlingFrame = 0;
    let suppressClick = false;
    let rebuilding = false;
    let rebuildQueued = false;
    const sourceStore = document.createElement("div");
    sourceStore.hidden = true;
    sourceStore.setAttribute("aria-hidden", "true");
    sourceStore.dataset.wpStageSourceStore = "true";
    document.body.append(sourceStore);

    const stageTotal = () => Number(
      typeof options.total === "function" ? options.total() : options.total ?? sources.length,
    );
    const stageWindowLimit = () => Math.max(0, total - pool.length);
    const selectedIndex = () => Math.round(logical);
    const cardPitch = () => {
      const first = pool[0]?.getBoundingClientRect();
      const second = pool[1]?.getBoundingClientRect();
      if (!first || !second) return 276;
      return Math.max(1, Math.abs((second.left + second.width / 2) - (first.left + first.width / 2)));
    };

    function updateRailData() {
      Object.assign(rail.dataset, {
        wpStageVirtualized: "bounded-recycle",
        wpStageVirtualizationInstalled: "true",
        wpStageVirtualDrag: "true",
        wpStagePoolSize: String(pool.length),
        wpStageTotal: String(total),
        wpStageWindowStart: String(windowStart),
        wpStageWindowEnd: String(windowStart + pool.length - 1),
        wpStageDragLogical: logical.toFixed(4),
      });
    }

    function syncCurrent() {
      const current = selectedIndex();
      pool.forEach((card) => {
        const index = Number(card.dataset.wpStageVirtualIndex);
        const isCurrent = index === current;
        card.classList.toggle("centered", isCurrent);
        card.classList.toggle("is-centered", isCurrent);
        if (isCurrent) card.setAttribute("aria-current", "true");
        else card.removeAttribute("aria-current");
        card.tabIndex = isCurrent ? 0 : -1;
      });
      options.onChange?.(current, { logical, windowStart, total, pool: [...pool] });
      updateRailData();
    }

    function bindPool() {
      pool.forEach((card, offset) => {
        const index = windowStart + offset;
        const source = sources[index];
        if (!source) return;
        copyCard(source, card, index, total, String(offset + 1));
        card.disabled = false;
      });
      syncCurrent();
    }

    function moveWindow(targetStart) {
      const target = clamp(Math.trunc(targetStart), 0, stageWindowLimit());
      if (target === windowStart) return;
      const movedCards = Math.abs(target - windowStart);
      rebuilding = true;
      while (windowStart < target) {
        const card = rail.firstElementChild;
        if (!card || !pool.includes(card)) break;
        windowStart += 1;
        rail.append(card);
        pool.push(pool.shift());
      }
      while (windowStart > target) {
        const card = rail.lastElementChild;
        if (!card || !pool.includes(card)) break;
        windowStart -= 1;
        rail.prepend(card);
        pool.unshift(pool.pop());
      }
      rebuilding = false;
      bindPool();
      rail.dataset.wpStageRecycleCount = String(Number(rail.dataset.wpStageRecycleCount || 0) + movedCards);
    }

    function position(value, center = true) {
      logical = clamp(Number(value) || 0, 0, Math.max(0, total - 1));
      const targetStart = clamp(Math.round(logical) - Math.floor(pool.length / 2), 0, stageWindowLimit());
      moveWindow(targetStart);
      const target = pool.find((card) => Number(card.dataset.wpStageVirtualIndex) === Math.round(logical));
      if (center && target) {
        const railRect = rail.getBoundingClientRect();
        const cardRect = target.getBoundingClientRect();
        const coordinateScale = rail.clientWidth > 0 && railRect.width > 0
          ? railRect.width / rail.clientWidth
          : 1;
        rail.scrollLeft += (cardRect.left + cardRect.width / 2 - (railRect.left + railRect.width / 2)) / coordinateScale;
      }
      rail.dataset.wpStageDragLogical = logical.toFixed(4);
      syncCurrent();
      return logical;
    }

    function focusLogical(index) {
      position(index);
      const target = pool.find((card) => Number(card.dataset.wpStageVirtualIndex) === Math.round(logical));
      target?.focus({ preventScroll: true });
      options.onFocus?.(Math.round(logical), sources[Math.round(logical)], target);
    }

    function collectCards() {
      const cards = [...rail.querySelectorAll(`:scope > ${selector}`)].filter((card) => !card.dataset.wpStagePoolNode);
      const next = cards.map((card, index) => ({ card, index: logicalIndex(card, index, options) }))
        .sort((a, b) => a.index - b.index)
        .map(({ card }) => card);
      if (next.length < 2) return false;
      sources = next;
      total = stageTotal() || sources.length;
      total = Math.max(total, sources.length);
      const currentSource = sources.find((source) =>
        source.getAttribute("aria-current") === "true"
        || source.classList.contains("selected")
        || source.classList.contains("is-selected")
        || source.classList.contains("centered")
        || source.classList.contains("is-centered")
        || source.dataset.wpStageRecommended === "true",
      );
      const unlocked = sources.filter((source) =>
        !source.disabled
        && source.getAttribute("aria-disabled") !== "true"
        && !source.classList.contains("locked")
        && !source.classList.contains("is-locked")
        && !source.classList.contains("infinite-stage-card")
        && !source.classList.contains("challenge-card"),
      );
      const explicitRecommendation = sources.find((source) => source.dataset.wpStageRecommended === "true");
      const recommendedSource = explicitRecommendation || unlocked.at(-1) || currentSource;
      sources.forEach((source) => {
        if (source === recommendedSource) source.dataset.wpStageRecommended = "true";
        else delete source.dataset.wpStageRecommended;
      });
      logical = recommendedSource
        ? logicalIndex(recommendedSource, sources.indexOf(recommendedSource), options)
        : 0;
      sourceStore.replaceChildren(...sources);
      sources.forEach((source) => source.classList.add("wp-stage-source-card"));
      pool = Array.from({ length: Math.min(poolSize, total) }, (_, index) => {
        const card = document.createElement(sources[0].tagName || "button");
        card.type = "button";
        card.className = sources[0].className;
        card.dataset.wpStagePoolNode = String(index + 1);
        return card;
      });
      windowStart = clamp(selectedIndex() - Math.floor(pool.length / 2), 0, Math.max(0, total - pool.length));
      rebuilding = true;
      rail.replaceChildren(...pool);
      rebuilding = false;
      rail.style.setProperty("overflow-x", "hidden", "important");
      rail.dataset.wpStageCenterObserver = "manual";
      rail.dataset.wpStageRecycleCount = "0";
      bindPool();
      position(logical);
      const anchoredLogical = logical;
      requestAnimationFrame(() => {
        if (pointerId === null && rail.getClientRects().length) position(anchoredLogical);
      });
      setTimeout(() => {
        if (pointerId === null && rail.getClientRects().length) position(anchoredLogical);
      }, 120);
      return true;
    }

    function queueRebuild() {
      if (rebuilding || rebuildQueued) return;
      rebuildQueued = true;
      requestAnimationFrame(() => {
        rebuildQueued = false;
        if (rebuilding) return;
        const cards = [...rail.querySelectorAll(`:scope > ${selector}`)].filter((card) => !card.dataset.wpStagePoolNode);
        if (cards.length >= 2) collectCards();
      });
    }

    function finishPointer(event) {
      if (pointerId === null || (event.pointerId !== undefined && event.pointerId !== pointerId)) return;
      pointerId = null;
      if (!moved) return;
      moved = false;
      suppressClick = true;
      setTimeout(() => { suppressClick = false; }, 0);
      const from = logical;
      const target = Math.round(from);
      const started = performance.now();
      const settle = (now) => {
        const progress = clamp((now - started) / 340, 0, 1);
        const eased = progress * progress * (3 - 2 * progress);
        position(from + (target - from) * eased);
        if (progress < 1) settlingFrame = requestAnimationFrame(settle);
        else {
          settlingFrame = 0;
          logical = target;
          position(target);
          options.onSettle?.(target, sources[target]);
        }
      };
      cancelAnimationFrame(settlingFrame);
      settlingFrame = requestAnimationFrame(settle);
      event.stopImmediatePropagation?.();
    }

    rail.addEventListener("pointerdown", (event) => {
      if (event.isPrimary === false || (event.button !== undefined && event.button !== 0)) return;
      cancelAnimationFrame(settlingFrame);
      settlingFrame = 0;
      pointerId = event.pointerId;
      pointerStart = lastPointer = event.clientX;
      moved = false;
      rail.classList.add("wp-stage-drag-ready");
      event.stopImmediatePropagation();
    }, true);
    document.addEventListener("pointermove", (event) => {
      if (event.pointerId !== pointerId) return;
      const delta = event.clientX - lastPointer;
      lastPointer = event.clientX;
      if (!moved && Math.abs(event.clientX - pointerStart) > 4) {
        moved = true;
        rail.classList.add("wp-stage-dragging");
      }
      if (!moved) return;
      if (event.cancelable) event.preventDefault();
      position(logical - delta / cardPitch());
      event.stopImmediatePropagation();
    }, true);
    document.addEventListener("pointerup", finishPointer, true);
    document.addEventListener("pointercancel", finishPointer, true);
    rail.addEventListener("click", (event) => {
      if (suppressClick) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      const card = event.target.closest?.(`[data-wp-stage-pool-node]`);
      if (!card || card.parentElement !== rail) return;
      const index = Number(card.dataset.wpStageVirtualIndex);
      if (card.disabled || card.getAttribute("aria-disabled") === "true") return;
      if (options.activate) {
        event.preventDefault();
        options.activate(index, sources[index], card, event);
      } else if (options.directActivation !== false) {
        event.preventDefault();
        sources[index]?.click();
      }
    }, true);
    rail.addEventListener("keydown", (event) => {
      const card = event.target.closest?.(`[data-wp-stage-pool-node]`);
      if (!card || card.parentElement !== rail) return;
      const direction = getComputedStyle(rail).direction === "rtl" ? -1 : 1;
      let target = null;
      if (event.key === "Home") target = 0;
      else if (event.key === "End") target = total - 1;
      else if (event.key === "ArrowLeft") target = Number(card.dataset.wpStageVirtualIndex) - direction;
      else if (event.key === "ArrowRight") target = Number(card.dataset.wpStageVirtualIndex) + direction;
      if (target === null) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      focusLogical(clamp(target, 0, total - 1));
    }, true);

    const observer = new MutationObserver(() => {
      if (!rebuilding) queueRebuild();
    });
    observer.observe(rail, { childList: true, subtree: false });
    if (!collectCards()) {
      observer.disconnect();
      sourceStore.remove();
      return null;
    }
    rail.dataset.wpStageVirtualizationInstalled = "true";
    return { rail, destroy: () => { observer.disconnect(); sourceStore.remove(); } };
  }

  const autoScanSelector = "[data-wp-stage-v6-auto]";
  const autoScan = () => {
    document.querySelectorAll(autoScanSelector).forEach((rail) => {
      if (rail.dataset.wpStageVirtualizationInstalled === "true") return;
      const cards = rail.querySelectorAll(CARD_SELECTOR);
      if (cards.length < 2) return;
      install(rail, {
        total: Number(rail.dataset.wpStageV6Total) || cards.length,
        poolSize: Number(rail.dataset.wpStageV6PoolSize) || DEFAULT_POOL_SIZE,
        zeroBasedKeys: ["stage", "level", "day", "page", "route"].filter((key) =>
          [...cards].some((card) => Number(card.dataset[key]) === 0),
        ),
      });
    });
  };
  autoScan();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", autoScan, { once: true });
  new MutationObserver(autoScan).observe(document.documentElement, { childList: true, subtree: true });

  window.WeightPlayStageV6 = { install };
})();
