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
    const reloadForSharedCatalog = synchronize && locale !== "zh-Hant";
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
    if (reloadForSharedCatalog) window.location.reload();
  }

  function show(nextScreen) {
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
        cells += `<div class="cell ${x === 5 && y === 2 ? "exit" : ""}" data-cell="${x},${y}"></div>`;
      }
    }
    $("board").innerHTML = cells;
    blocks.forEach((block, blockIndex) => {
      const element = document.createElement("button");
      element.className = `block ${block.hero ? "hero" : ""} ${block.dir ? "v" : "h"}`;
      element.textContent = block.hero ? "P" : "";
      element.style.gridColumn = `${block.x + 1}/span ${block.w}`;
      element.style.gridRow = `${block.y + 1}/span ${block.h}`;
      element.dataset.block = blockIndex;
      element.addEventListener("pointerdown", (event) =>
        dragStart(event, blockIndex),
      );
      $("board").append(element);
    });
    $("status").textContent = t("status");
    $("undo").disabled = !history.length;
  }

  function clearDrag() {
    document.removeEventListener("pointerup", dragEnd, true);
    document.removeEventListener("pointercancel", dragCancel, true);
    drag = null;
  }

  function dragStart(event, blockIndex) {
    if (drag) return;
    drag = {
      blockIndex,
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
    event.preventDefault();
    try {
      event.currentTarget.setPointerCapture?.(event.pointerId);
    } catch {
      // The document-level listeners below also support surfaces where
      // pointer capture is unavailable or not retained through a drag.
    }
    document.addEventListener("pointerup", dragEnd, true);
    document.addEventListener("pointercancel", dragCancel, true);
  }

  function dragCancel(event) {
    if (
      drag &&
      (event.pointerId == null || event.pointerId === drag.pointerId)
    ) {
      clearDrag();
    }
  }

  function dragEnd(event) {
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
    const step = distance > 18 ? 1 : distance < -18 ? -1 : 0;
    const nextX = block.x + (block.dir ? 0 : step);
    const nextY = block.y + (block.dir ? step : 0);
    clearDrag();

    if (
      step &&
      nextX >= 0 &&
      nextY >= 0 &&
      nextX + block.w <= 6 &&
      nextY + block.h <= 6 &&
      !occupied(block, nextX, nextY, block.w, block.h)
    ) {
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
        $("result").showModal();
      }
      render();
    }
  }

  function undo() {
    const previous = history.pop();
    if (previous) {
      blocks = previous;
      render();
    }
  }

  function hint() {
    const hero = blocks[0];
    if (hero.x < 4) {
      const blocker = blocks.find(
        (block) =>
          block !== hero &&
          block.y <= hero.y &&
          block.y + block.h > hero.y &&
          block.x > hero.x,
      );
      if (blocker) {
        blocker.y = blocker.dir ? Math.max(0, blocker.y - 1) : blocker.y;
        render();
      }
    }
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
  $("retry").onclick = () => {
    $("result").close();
    start(index);
  };
  $("next").onclick = () => {
    $("result").close();
    selected = Math.min(29, index + 1);
    show("stage");
    renderStage();
  };
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
