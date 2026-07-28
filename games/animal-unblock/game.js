(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const levels = UNBLOCK_LEVELS.levels;
  const dict = UNBLOCK_LOCALES;
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
  const progress = JSON.parse(localStorage.getItem(saveKey) || "[]");
  while (selected < 29 && progress[selected]) selected += 1;
  const t = (key, values = {}) =>
    String((dict[locale] || dict.en)[key] ?? dict.en[key] ?? key).replace(
      /\{(\w+)\}/g,
      (_, name) => values[name] ?? "",
    );

  function rememberedLocale() {
    try {
      return (
        window.WonderI18n?.actualLocale?.() ||
        localStorage.getItem("weightPlayLocale") ||
        localStorage.getItem("wp-locale")
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
  }

  function chooseLocale(nextLocale, synchronize = true) {
    locale = codes.includes(nextLocale) ? nextLocale : "en";
    document.body.toggleAttribute(
      "data-runtime-localize",
      locale === "zh-Hant",
    );
    if (synchronize) {
      try {
        localStorage.setItem("weightPlayLocale", locale);
        localStorage.setItem("wp-locale", locale);
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

  function selectStage(levelIndex, center = false) {
    selected = Math.max(0, Math.min(29, levelIndex));
    document
      .querySelectorAll("#stageGrid .stage-card")
      .forEach((card, cardIndex) => {
        const active = cardIndex === selected;
        card.classList.toggle("selected", active);
        card.classList.toggle("centered", active);
        card.setAttribute("aria-current", active ? "true" : "false");
      });
    if (center) {
      document
        .querySelector(`#stageGrid [data-index="${selected}"]`)
        ?.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
    }
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
          }" aria-disabled="${
            Boolean(levelIndex && !progress[levelIndex - 1])
          }"><b>${t("trail", { n: levelIndex + 1 })}</b><small>${
            progress[levelIndex]
              ? `✓ ${t("complete")}`
              : t("chapter", { n: Math.floor(levelIndex / 10) + 1 })
          }</small></button>`,
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
        `${block.hero ? "Panko" : blockIndex + 1} ${block.dir ? "↕" : "↔"}`,
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

  function commitMove(block, nextX, nextY, restoreFocusIndex = null) {
    history.push(blocks.map((entry) => ({ ...entry })));
    block.x = nextX;
    block.y = nextY;
    moves += 1;
    if (block.hero && block.x >= 4) {
      progress[index] = true;
      localStorage.setItem(saveKey, JSON.stringify(progress));
      $("resultBody").textContent = t("resultBody", {
        n: index + 1,
        moves,
      });
      resultActionClaimed = false;
      $("resultStages").disabled = false;
      $("retry").disabled = false;
      $("next").disabled = index >= levels.length - 1;
      $("result").showModal();
      requestAnimationFrame(() =>
        $(index >= levels.length - 1 ? "resultStages" : "next").focus({
          preventScroll: true,
        }),
      );
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
    const cells = board.querySelectorAll(".cell");
    const first = cells[0]?.getBoundingClientRect();
    const right = cells[1]?.getBoundingClientRect();
    const down = cells[6]?.getBoundingClientRect();
    const element = event.currentTarget;
    drag = {
      blockIndex,
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      element,
      unitX: right && first ? right.left - first.left : 0,
      unitY: down && first ? down.top - first.top : 0,
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
      ? event.clientY - drag.y
      : event.clientX - drag.x;
    const unit = block.dir ? drag.unitY : drag.unitX;
    const negativeLimit = legalStep(block, -1) ? -unit : -8;
    const positiveLimit = legalStep(block, 1) ? unit : 8;
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
    return (
      nextX >= 0 &&
      nextY >= 0 &&
      nextX + block.w <= 6 &&
      nextY + block.h <= 6 &&
      !occupied(block, nextX, nextY, block.w, block.h)
    );
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

    const cells = $("board").querySelectorAll(".cell");
    const first = cells[0]?.getBoundingClientRect();
    const adjacent = cells[block.dir ? 6 : 1]?.getBoundingClientRect();
    const unit =
      first && adjacent
        ? block.dir
          ? adjacent.top - first.top
          : adjacent.left - first.left
        : 0;
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
    const distance = block.dir
      ? event.clientY - drag.y
      : event.clientX - drag.x;
    const step = distance > 18 ? 1 : distance < -18 ? -1 : 0;
    const nextX = block.x + (block.dir ? 0 : step);
    const nextY = block.y + (block.dir ? step : 0);
    clearDrag();

    if (legalStep(block, step)) {
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
    const cells = $("board").querySelectorAll(".cell");
    const first = cells[0]?.getBoundingClientRect();
    const right = cells[1]?.getBoundingClientRect();
    const down = cells[6]?.getBoundingClientRect();
    const unitX = right && first ? right.left - first.left : 0;
    const unitY = down && first ? down.top - first.top : 0;
    const delta = block.dir
      ? (move.y - block.y) * unitY
      : (move.x - block.x) * unitX;
    if (!element || !delta) {
      commitMove(block, move.x, move.y);
      return;
    }
    settleElement(element, block, 0, delta, () =>
      commitMove(block, move.x, move.y),
    );
  }

  $("start").onclick = () => {
    show("stage");
    renderStage();
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
