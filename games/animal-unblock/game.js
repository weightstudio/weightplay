(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const levels = UNBLOCK_LEVELS.levels;
  const dict = UNBLOCK_LOCALES;
  const GAME_VERSION = "v15";
  document.body.dataset.gameVersion = GAME_VERSION;
  const codes = Object.keys(dict);
  const localeRoutes = {
    en: "en",
    "zh-Hant": "zh-tw",
    "zh-Hans": "zh-cn",
    ja: "ja",
    ko: "ko",
    es: "es",
    "pt-BR": "pt-br",
    fr: "fr",
    de: "de",
    it: "it",
    ru: "ru",
    hi: "hi",
    ar: "ar",
  };
  let locale = "en";
  let screen = "main";
  let selected = 0;
  let index = 0;
  let blocks = [];
  let history = [];
  let moves = 0;
  let drag = null;
  let moveLocked = false;
  let animationToken = 0;
  let resultActionClaimed = false;

  const saveKey = "unblockProgress";
  const bestMovesKey = "unblockBestMoves";
  const storageFallback = new Map();

  function readStorage(key) {
    try {
      const value = localStorage.getItem(key);
      if (value !== null) storageFallback.set(key, value);
      return value ?? storageFallback.get(key) ?? null;
    } catch {
      return storageFallback.get(key) ?? null;
    }
  }

  function writeStorage(key, value) {
    const serialized = String(value);
    storageFallback.set(key, serialized);
    try {
      localStorage.setItem(key, serialized);
      return true;
    } catch {
      return false;
    }
  }

  function loadProgress() {
    try {
      const stored = JSON.parse(readStorage(saveKey) || "[]");
      if (!Array.isArray(stored)) return Array(30).fill(false);
      return Array.from({ length: 30 }, (_, stageIndex) => stored[stageIndex] === true);
    } catch {
      return Array(30).fill(false);
    }
  }

  const progress = loadProgress();
  function loadBestMoves() {
    try {
      const stored = JSON.parse(readStorage(bestMovesKey) || "[]");
      if (!Array.isArray(stored)) return Array(30).fill(null);
      return Array.from({ length: 30 }, (_, stageIndex) => {
        const value = stored[stageIndex];
        return Number.isInteger(value) && value > 0 ? value : null;
      });
    } catch {
      return Array(30).fill(null);
    }
  }

  const bestMoves = loadBestMoves();
  while (selected < 29 && progress[selected]) selected += 1;
  const t = (key, values = {}) =>
    String((dict[locale] || dict.en)[key] ?? dict.en[key] ?? key).replace(
      /\{(\w+)\}/g,
      (_, name) => values[name] ?? "",
    );

  function challengePreviewKey(levelIndex) {
    const blocks = levels[levelIndex]?.blocks || [];
    const blockers = blocks.filter((block) => !block.hero);
    const longBlocker = blockers.some((block) => Math.max(block.w, block.h) >= 3);
    const exitLaneBlockers = blockers.filter(
      (block) => block.y <= 2 && block.y + block.h > 2,
    ).length;
    if (longBlocker && exitLaneBlockers >= 2) return "previewLayered";
    if (longBlocker) return "previewLong";
    if (exitLaneBlockers >= 2) return "previewNarrow";
    if (blockers.length >= 8) return "previewMultiStep";
    return "previewCompact";
  }

  function challengePreview(levelIndex) {
    return t(challengePreviewKey(levelIndex));
  }

  function renderResultPreview() {
    const node = $("resultNextPreview");
    if (!node) return;
    const hasNext = index < levels.length - 1;
    node.hidden = !hasNext;
    node.textContent = hasNext
      ? t("nextPreview", { preview: challengePreview(index + 1) })
      : "";
  }

  function rememberedLocale() {
    try {
      return (
        window.WonderI18n?.actualLocale?.() ||
        readStorage("weightPlayLocale") ||
        readStorage("wp-locale")
      );
    } catch {
      return null;
    }
  }

  function apply() {
    document.body.toggleAttribute(
      "data-runtime-localize",
      locale === "zh-Hant",
    );
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.title = `${t("title")} | WeightPlay`;
    document.querySelectorAll("[data-t]").forEach((element) => {
      element.textContent = t(element.dataset.t);
    });
    document.querySelectorAll("[data-t-aria]").forEach((element) => {
      element.setAttribute("aria-label", t(element.dataset.tAria));
    });
    document.querySelectorAll("[data-t-alt]").forEach((element) => {
      element.setAttribute("alt", t(element.dataset.tAlt));
    });
    document.querySelector("#main header a").href =
      `/${localeRoutes[locale] || "en"}/`;
    $("locale").value = locale;
    renderStage();
    renderResultPreview();
  }

  function chooseLocale(nextLocale, synchronize = true) {
    locale = codes.includes(nextLocale) ? nextLocale : "en";
    document.body.toggleAttribute(
      "data-runtime-localize",
      locale === "zh-Hant",
    );
    if (synchronize) {
      try {
        writeStorage("weightPlayLocale", locale);
        writeStorage("wp-locale", locale);
      } catch {
        // This session still owns the selected locale without Storage.
      }
      try {
        window.WonderI18n?.setLocale?.(locale);
      } catch {
        // Game-owned strings and route ownership still update below.
      }
    }
    apply();
  }

  function show(nextScreen) {
    if (nextScreen !== "battle") {
      animationToken += 1;
      moveLocked = false;
      if (drag) {
        drag.element.classList.remove("dragging");
        drag.element.style.removeProperty("transform");
        clearDrag();
      }
    }
    ["main", "stage", "battle"].forEach((id) => {
      $(id).hidden = id !== nextScreen;
    });
    $("generalReserve").hidden = nextScreen !== "battle";
    screen = nextScreen;
    window.scrollTo(0, 0);
  }

  function selectStage(levelIndex, center = false, focus = false) {
    selected = Math.max(0, Math.min(29, levelIndex));
    let owner = null;
    document
      .querySelectorAll("#stageGrid .stage-card")
      .forEach((card, cardIndex) => {
        const active = cardIndex === selected;
        card.classList.toggle("selected", active);
        card.classList.toggle("centered", active);
        card.setAttribute("aria-current", active ? "true" : "false");
        card.tabIndex = active ? 0 : -1;
        if (active) owner = card;
      });
    if (center) {
      const rail = $("stageGrid");
      if (owner && rail?.getClientRects().length) {
        const railRect = rail.getBoundingClientRect();
        const ownerRect = owner.getBoundingClientRect();
        const coordinateScale = railRect.width > 0
          ? rail.clientWidth / railRect.width
          : 1;
        const target = rail.scrollLeft
          + ((ownerRect.left + ownerRect.width / 2)
            - (railRect.left + railRect.width / 2)) * coordinateScale;
        const maximum = Math.max(0, rail.scrollWidth - rail.clientWidth);
        const previousBehavior = rail.style.getPropertyValue("scroll-behavior");
        const previousPriority = rail.style.getPropertyPriority("scroll-behavior");
        rail.style.setProperty("scroll-behavior", "auto", "important");
        rail.scrollLeft = getComputedStyle(rail).direction === "rtl"
          ? Math.max(-maximum, Math.min(0, target))
          : Math.max(0, Math.min(maximum, target));
        if (previousBehavior) {
          rail.style.setProperty("scroll-behavior", previousBehavior, previousPriority);
        } else {
          rail.style.removeProperty("scroll-behavior");
        }
      }
    }
    if (focus) owner?.focus({ preventScroll: true });
  }

  function handleStageCardKeydown(event) {
    const card = event.currentTarget;
    const currentIndex = Number(card.dataset.index);
    if (!Number.isInteger(currentIndex)) return;
    const rtl = document.documentElement.dir === "rtl";
    let nextIndex = null;
    if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = levels.length - 1;
    else if (event.key === "ArrowRight") nextIndex = currentIndex + (rtl ? -1 : 1);
    else if (event.key === "ArrowLeft") nextIndex = currentIndex + (rtl ? 1 : -1);
    if (nextIndex == null) return;
    event.preventDefault();
    selectStage(Math.max(0, Math.min(levels.length - 1, nextIndex)), true, true);
  }

  function renderStage() {
    if (screen !== "stage") return;
    $("progress").textContent = t("progress", {
      done: progress.filter(Boolean).length,
    });
    $("stageGrid").innerHTML = levels
      .map(
        (_, levelIndex) =>
          `<button class="stage-card ${
            levelIndex === selected ? "selected centered" : ""
          }${
            levelIndex && !progress[levelIndex - 1] ? " locked" : ""
          }" data-index="${levelIndex}" data-stage-index="${levelIndex}" aria-current="${
             levelIndex === selected
          }" aria-posinset="${levelIndex + 1}" aria-setsize="${levels.length}" aria-keyshortcuts="ArrowLeft ArrowRight Home End" aria-disabled="${
            Boolean(levelIndex && !progress[levelIndex - 1])
          }"><b>${t("trail", { n: levelIndex + 1 })}</b><small>${
            progress[levelIndex]
              ? `✓ ${t("complete")}`
              : t("chapter", { n: Math.floor(levelIndex / 10) + 1 })
          }</small><em class="stage-preview" data-runtime-localize="off" data-challenge-preview="${challengePreviewKey(levelIndex)}">${challengePreview(levelIndex)}</em></button>`,
      )
      .join("");
    document
      .querySelectorAll("#stageGrid .stage-card")
      .forEach((button) => {
      button.onclick = () => {
        const levelIndex = Number(button.dataset.index);
        selectStage(levelIndex, true);
        if (button.getAttribute("aria-disabled") !== "true") {
          start(levelIndex);
        }
      };
      button.addEventListener("keydown", handleStageCardKeydown);
    });
    selectStage(selected);
  }

  function start(levelIndex) {
    index = levelIndex;
    blocks = levels[levelIndex].blocks.map((block) => ({ ...block }));
    history = [];
    moves = 0;
    animationToken += 1;
    moveLocked = false;
    show("battle");
    render();
  }

  function occupied(skip, x, y, width, height) {
    return blocks.some(
      (block) =>
        block !== skip &&
        x < block.x + block.w &&
        x + width > block.x &&
        y < block.y + block.h &&
        y + height > block.y,
    );
  }

  function render() {
    $("chapter").textContent = t("chapter", {
      n: Math.floor(index / 10) + 1,
    });
    $("trailName").textContent = t("trail", { n: index + 1 });
    $("moveCount").textContent = t("moves", { n: moves });
    let cells = "";
    for (let y = 0; y < 6; y += 1) {
      for (let x = 0; x < 6; x += 1) {
        cells += `<div class="cell ${x === 5 && y === 2 ? "exit" : ""}" data-cell="${x},${y}" style="grid-column:${x + 1};grid-row:${y + 1}"></div>`;
      }
    }
    $("board").innerHTML = cells;
    $("board").classList.toggle("goal-coach", index === 0 && moves === 0);
    $("board")
      .querySelector(".exit")
      ?.setAttribute("aria-label", t("exit"));
    blocks.forEach((block, blockIndex) => {
      const element = document.createElement("button");
      const artClass = block.hero
        ? "art-hero"
        : block.w === 3
          ? "art-h3"
          : block.h === 3
            ? "art-v3"
            : block.dir
              ? "art-v2"
              : "art-h2";
      element.className = `block ${block.hero ? "hero" : ""} ${block.dir ? "v" : "h"} ${artClass}`;
      element.textContent = block.hero ? "P" : "";
      element.style.gridColumn = `${block.x + 1}/span ${block.w}`;
      element.style.gridRow = `${block.y + 1}/span ${block.h}`;
      element.dataset.block = blockIndex;
      element.setAttribute(
        "aria-label",
        `${block.hero ? t("heroName") : t("blockLabel", { n: blockIndex + 1 })} ${block.dir ? "↕" : "↔"}`,
      );
      element.setAttribute(
        "aria-keyshortcuts",
        block.dir ? "ArrowUp ArrowDown" : "ArrowLeft ArrowRight",
      );
      element.addEventListener("pointerdown", (event) =>
        dragStart(event, blockIndex),
      );
      element.addEventListener("keydown", (event) =>
        keyboardMove(event, blockIndex),
      );
      $("board").append(element);
    });
    $("status").textContent = t("status");
    $("undo").disabled = !history.length;
  }

  function boardCellMetrics(board) {
    const cells = board.querySelectorAll(".cell");
    const first = cells[0]?.getBoundingClientRect();
    const right = cells[1]?.getBoundingClientRect();
    const down = cells[6]?.getBoundingClientRect();
    const boardRect = board.getBoundingClientRect();
    const boardLayoutWidth = board.offsetWidth || boardRect.width;
    const scale = boardLayoutWidth > 0
      ? boardRect.width / boardLayoutWidth
      : 1;
    return {
      scale: scale > 0 ? scale : 1,
      unitX: right && first ? right.left - first.left : 0,
      unitY: down && first ? down.top - first.top : 0,
    };
  }

  function commitMove(block, nextX, nextY, restoreFocusIndex = null) {
    history.push(blocks.map((entry) => ({ ...entry })));
    block.x = nextX;
    block.y = nextY;
    moves += 1;
    if (block.hero && block.x >= 4) {
      progress[index] = true;
      writeStorage(saveKey, JSON.stringify(progress));
      $("resultBody").textContent = t("resultBody", {
        n: index + 1,
        moves,
      });
      const previousBest = bestMoves[index];
      const isNewBest = previousBest === null || moves < previousBest;
      if (isNewBest) {
        bestMoves[index] = moves;
        writeStorage(bestMovesKey, JSON.stringify(bestMoves));
      }
      $("resultMastery").textContent = t(
        previousBest === null
          ? "resultFirstBest"
          : isNewBest
            ? "resultImprovedBest"
            : "resultBest",
        {
          best: bestMoves[index],
          previous: previousBest,
        },
      );
      $("resultTarget").textContent = t("resultTarget", {
        target: Math.min(bestMoves[index], levels[index].par),
      });
      renderResultPreview();
      resultActionClaimed = false;
      $("resultStages").disabled = false;
      $("retry").disabled = false;
      $("next").disabled = index >= levels.length - 1;
      $("result").showModal();
      const focusResultAction = () => {
        if (!$("result").open) return;
        $(index >= levels.length - 1 ? "resultStages" : "next").focus({
          preventScroll: true,
        });
      };
      requestAnimationFrame(focusResultAction);
      window.setTimeout(focusResultAction, 20);
      window.setTimeout(focusResultAction, 200);
    }
    render();
    if (restoreFocusIndex != null && !$("result").open) {
      requestAnimationFrame(() =>
        $("board")
          .querySelector(`[data-block="${restoreFocusIndex}"]`)
          ?.focus({ preventScroll: true }),
      );
    }
  }

  function claimResultAction(action) {
    if (!$("result").open || resultActionClaimed) return;
    resultActionClaimed = true;
    ["resultStages", "next", "retry"].forEach((id) => {
      $(id).disabled = true;
    });
    action();
  }

  function clearDrag() {
    document.removeEventListener("pointermove", dragMove, true);
    document.removeEventListener("pointerup", dragEnd, true);
    document.removeEventListener("pointercancel", dragCancel, true);
    drag = null;
  }

  function dragStart(event, blockIndex) {
    if (drag || moveLocked) return;
    const board = $("board");
    const { scale, unitX, unitY } = boardCellMetrics(board);
    const element = event.currentTarget;
    const block = blocks[blockIndex];
    const { minSteps, maxSteps } = legalRange(block);
    drag = {
      blockIndex,
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      element,
      scale,
      unitX: unitX / scale,
      unitY: unitY / scale,
      minSteps,
      maxSteps,
      visualDelta: 0,
    };
    element.classList.add("dragging");
    event.preventDefault();
    try {
      event.currentTarget.setPointerCapture?.(event.pointerId);
    } catch {
      // The document-level listeners below also support surfaces where
      // pointer capture is unavailable or not retained through a drag.
    }
    document.addEventListener("pointermove", dragMove, true);
    document.addEventListener("pointerup", dragEnd, true);
    document.addEventListener("pointercancel", dragCancel, true);
  }

  function dragMove(event) {
    if (
      !drag ||
      (event.pointerId != null && event.pointerId !== drag.pointerId)
    ) {
      return;
    }
    const block = blocks[drag.blockIndex];
    const distance = block.dir
      ? (event.clientY - drag.y) / drag.scale
      : (event.clientX - drag.x) / drag.scale;
    const unit = block.dir ? drag.unitY : drag.unitX;
    const negativeLimit = drag.minSteps * unit;
    const positiveLimit = drag.maxSteps * unit;
    drag.visualDelta = Math.max(
      negativeLimit,
      Math.min(positiveLimit, distance),
    );
    drag.element.style.transform = block.dir
      ? `translateY(${drag.visualDelta}px)`
      : `translateX(${drag.visualDelta}px)`;
    event.preventDefault();
  }

  function settleElement(element, block, from, to, onSettled) {
    const token = ++animationToken;
    moveLocked = true;
    element.classList.remove("dragging");
    element.classList.add("settling");
    element.style.transform = block.dir
      ? `translateY(${from}px)`
      : `translateX(${from}px)`;
    requestAnimationFrame(() => {
      element.style.transform = block.dir
        ? `translateY(${to}px)`
        : `translateX(${to}px)`;
    });
    window.setTimeout(() => {
      if (token !== animationToken) return;
      moveLocked = false;
      onSettled();
    }, 240);
  }

  function dragCancel(event) {
    if (
      drag &&
      (event.pointerId == null || event.pointerId === drag.pointerId)
    ) {
      const { element, blockIndex, visualDelta } = drag;
      const block = blocks[blockIndex];
      clearDrag();
      settleElement(element, block, visualDelta, 0, () => {
        element.classList.remove("settling");
        element.style.removeProperty("transform");
      });
    }
  }

  function legalStep(block, step) {
    if (!step) return false;
    const nextX = block.x + (block.dir ? 0 : step);
    const nextY = block.y + (block.dir ? step : 0);
    return legalPosition(block, nextX, nextY);
  }

  function legalPosition(block, nextX, nextY) {
    return (
      nextX >= 0 &&
      nextY >= 0 &&
      nextX + block.w <= 6 &&
      nextY + block.h <= 6 &&
      !occupied(block, nextX, nextY, block.w, block.h)
    );
  }

  function legalRange(block) {
    let minSteps = 0;
    let maxSteps = 0;
    while (legalStep(block, minSteps - 1)) minSteps -= 1;
    while (legalStep(block, maxSteps + 1)) maxSteps += 1;
    return { minSteps, maxSteps };
  }

  function keyboardMove(event, blockIndex) {
    const block = blocks[blockIndex];
    const step = block?.dir
      ? event.key === "ArrowUp"
        ? -1
        : event.key === "ArrowDown"
          ? 1
          : 0
      : event.key === "ArrowLeft"
        ? -1
        : event.key === "ArrowRight"
          ? 1
          : 0;
    if (!step) return;
    event.preventDefault();
    if (event.repeat || moveLocked || drag || !legalStep(block, step)) return;

    const { scale, unitX, unitY } = boardCellMetrics($("board"));
    const unit = (block.dir ? unitY : unitX) / scale;
    const element = event.currentTarget;
    const nextX = block.x + (block.dir ? 0 : step);
    const nextY = block.y + (block.dir ? step : 0);
    if (!unit) {
      commitMove(block, nextX, nextY, blockIndex);
      return;
    }
    settleElement(element, block, 0, step * unit, () =>
      commitMove(block, nextX, nextY, blockIndex),
    );
  }

  function dragEnd(event) {
    if (
      !drag ||
      (event.pointerId != null && event.pointerId !== drag.pointerId)
    ) {
      return;
    }
    const { blockIndex, element, visualDelta, unitX, unitY } = drag;
    const block = blocks[blockIndex];
    const unit = block.dir ? unitY : unitX;
    const rawStep = unit ? visualDelta / unit : 0;
    const step = Math.max(
      drag.minSteps,
      Math.min(drag.maxSteps, Math.round(rawStep)),
    );
    const nextX = block.x + (block.dir ? 0 : step);
    const nextY = block.y + (block.dir ? step : 0);
    clearDrag();

    if (!step) {
      settleElement(element, block, visualDelta, 0, () => {
        element.classList.remove("settling");
        element.style.removeProperty("transform");
      });
      return;
    }

    if (legalPosition(block, nextX, nextY)) {
      const target = step * (block.dir ? unitY : unitX);
      settleElement(element, block, visualDelta, target, () =>
        commitMove(block, nextX, nextY),
      );
    } else {
      settleElement(element, block, visualDelta, 0, () => {
        element.classList.remove("settling");
        element.style.removeProperty("transform");
      });
    }
  }

  function undo() {
    if (moveLocked || drag) return;
    const previous = history.pop();
    if (previous) {
      blocks = previous;
      moves = history.length;
      render();
    }
  }

  function hint() {
    if (moveLocked || drag) return;
    const move = UNBLOCK_LEVELS.nextMove(blocks);
    if (!move) return;
    const block = blocks[move.pieceIndex];
    const element = $("board").querySelector(
      `[data-block="${move.pieceIndex}"]`,
    );
    if (!element) return;
    $("board").querySelectorAll(".hint-target").forEach((node) => {
      node.classList.remove("hint-target");
      node.removeAttribute("data-hint-direction");
      node.removeAttribute("data-hint-symbol");
      node.removeAttribute("aria-describedby");
    });
    const direction = block.dir
      ? move.y < block.y ? "up" : "down"
      : move.x < block.x ? "left" : "right";
    const directionKey = `direction${direction[0].toUpperCase()}${direction.slice(1)}`;
    const symbols = { left: "←", right: "→", up: "↑", down: "↓" };
    element.classList.add("hint-target");
    element.dataset.hintDirection = direction;
    element.dataset.hintSymbol = symbols[direction];
    element.setAttribute("aria-describedby", "status");
    $("status").textContent = t("hintMove", { direction: t(directionKey) });
    element.focus({ preventScroll: true });
  }

  $("start").onclick = () => {
    show("stage");
    renderStage();
    requestAnimationFrame(() => {
      document.querySelector("#stageGrid .stage-card[aria-current='true']")?.focus({
        preventScroll: true,
      });
    });
  };
  document.querySelectorAll("[data-back]").forEach((button) => {
    button.onclick = () => show(screen === "battle" ? "stage" : "main");
  });
  $("stageGrid").addEventListener("wonder:stage-snap", (event) => {
    const levelIndex = Number(event.detail?.index);
    if (Number.isInteger(levelIndex) && levelIndex >= 0) {
      selectStage(levelIndex);
    }
  });
  $("undo").onclick = undo;
  $("hint").onclick = hint;
  $("restart").onclick = () => start(index);
  $("resultStages").onclick = () => claimResultAction(() => {
    $("result").close();
    selected = Math.min(29, index + 1);
    show("stage");
    renderStage();
  });
  $("next").onclick = () => claimResultAction(() => {
    if (index >= levels.length - 1) return;
    $("result").close();
    selected = index + 1;
    start(selected);
  });
  $("retry").onclick = () => claimResultAction(() => {
    $("result").close();
    start(index);
  });
  $("locale").innerHTML = codes
    .map((code) => `<option value="${code}">${dict[code].label}</option>`)
    .join("");
  $("locale").onchange = (event) => {
    chooseLocale(event.target.value);
  };

  window.addEventListener("wonder:locale-change", (event) => {
    const nextLocale = event.detail?.locale;
    if (codes.includes(nextLocale) && nextLocale !== locale) {
      chooseLocale(nextLocale, false);
    }
  });

  chooseLocale(rememberedLocale(), false);
  show("main");
})();
