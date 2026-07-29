(() => {
  "use strict";

  const codes = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const palette = ["#ef6b62", "#4da8e8", "#f0bb4d", "#9a7ae9"];
  const routeCodes = ["A", "B", "C", "D"];
  const busArt = ["coral", "sky", "sun", "violet"].map((color) => `/assets/animal-bus-jam-bus-${color}.webp`);
  const passengerArt = ["coral", "sky", "sun", "violet"].map((color) => `/assets/animal-bus-jam-passenger-${color}.webp`);
  const root = document;
  const engine = window.BUS_JAM_LEVELS;
  const levels = engine.levels;
  const dict = window.BUS_JAM_LOCALES;
  const $ = (id) => root.getElementById(id);
  const read = (key) => {
    try { return localStorage.getItem(key); } catch { return null; }
  };
  const write = (key, value) => {
    try { localStorage.setItem(key, value); } catch {}
  };

  let locale = read("weightPlayLocale") || read("wp-locale") || window.WonderI18n?.actualLocale?.() || "en";
  let screen = "main";
  let selected = 0;
  let levelIndex = 0;
  let state = null;
  let history = [];
  let moves = 0;
  let departingBusIndexes = [];
  let departureTimer = 0;
  let resultActionClaimed = false;
  const progressKey = "animalBusJamProgress";
  let progress;
  try { progress = JSON.parse(read(progressKey) || "[]"); } catch { progress = []; }
  if (!Array.isArray(progress)) progress = [];
  if (!codes.includes(locale)) locale = "en";
  while (selected < 29 && progress[selected]) selected += 1;

  function t(key, vars = {}) {
    const active = dict[locale] || dict.en;
    let value = active[key] ?? dict.en[key] ?? key;
    if (Array.isArray(value)) return value;
    return String(value).replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? "");
  }

  function save() {
    write(progressKey, JSON.stringify(progress));
  }

  function snapshot() {
    return {
      queues: state.queues.map((queue) => queue.slice()),
      waiting: state.waiting.slice(),
      busIndex: state.busIndex,
      busFilled: state.busFilled,
      moves,
    };
  }

  function restore(saved) {
    state = {
      queues: saved.queues.map((queue) => queue.slice()),
      waiting: saved.waiting.slice(),
      busIndex: saved.busIndex,
      busFilled: saved.busFilled,
    };
    moves = saved.moves;
  }

  function applyLocale() {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    root.querySelectorAll("[data-t]").forEach((element) => {
      element.textContent = t(element.dataset.t);
    });
    root.querySelectorAll("[data-t-aria]").forEach((element) => {
      element.setAttribute("aria-label", t(element.dataset.tAria));
    });
    root.querySelectorAll("[data-t-alt]").forEach((element) => {
      element.alt = t(element.dataset.tAlt);
    });
    $("locale").value = locale;
    renderStage();
    if (screen === "battle" && state) render();
    if ($("result").open) $("resultBody").textContent = t("resultBody", { n: levelIndex + 1, moves });
    if ($("leaveBattle").open) $("leaveBattleBody").textContent = t("leaveBody", { n: levelIndex + 1 });
  }

  function show(name) {
    if (name !== "battle") {
      window.clearTimeout(departureTimer);
      departureTimer = 0;
      departingBusIndexes = [];
      $("buses").replaceChildren();
    }
    ["main", "stage", "battle"].forEach((id) => { $(id).hidden = id !== name; });
    $("generalReserve").hidden = name !== "battle";
    document.body.dataset.screen = name;
    screen = name;
    window.scrollTo(0, 0);
  }

  function selectStage(index, center = false) {
    selected = Math.max(0, Math.min(29, index));
    root.querySelectorAll("#stageGrid .stage-card").forEach((card, cardIndex) => {
      const active = cardIndex === selected;
      card.classList.toggle("selected", active);
      card.classList.toggle("centered", active);
      card.setAttribute("aria-current", active ? "true" : "false");
    });
    if (center) {
      root.querySelector(`#stageGrid [data-index="${selected}"]`)?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }

  function renderStage() {
    if (screen !== "stage") return;
    $("progress").textContent = t("progress", { done: progress.filter(Boolean).length });
    $("stageGrid").innerHTML = levels.map((level, index) => {
      const locked = index > 0 && !progress[index - 1];
      const stateLabel = locked ? `🔒 ${t("locked")}` : progress[index] ? `✓ ${t("complete")}` : t("stageMeta", {
        buses: level.buses.length,
        bay: level.baySize,
      });
      return `<button class="stage-card ${index === selected ? "selected centered" : ""}${locked ? " locked" : ""}" data-index="${index}" data-stage-index="${index}" aria-current="${index === selected}" aria-disabled="${locked}">
        <strong>${t("stop", { n: index + 1 })}</strong>
        <span>${t("chapter", { n: level.chapter + 1 })}</span>
        <span>${stateLabel}</span>
      </button>`;
    }).join("");
    root.querySelectorAll("#stageGrid .stage-card").forEach((button) => {
      button.onclick = () => {
        const index = Number(button.dataset.index);
        selectStage(index, true);
        if (button.getAttribute("aria-disabled") !== "true") startLevel(index);
      };
    });
    selectStage(selected);
  }

  function updateBusCard(element, bus, index) {
    const active = index === state.busIndex;
    const departureOrder = departingBusIndexes.indexOf(index);
    const departing = departureOrder >= 0;
    const filled = departing ? bus.seats : active ? state.busFilled : 0;
    element.className = `bus${active ? " active" : ""}${departing ? " departing" : ""}`;
    element.dataset.busIndex = String(index);
    element.dataset.color = String(bus.color);
    element.dataset.departureOrder = departing ? String(departureOrder) : "";
    element.style.setProperty("--bus", palette[bus.color]);
    element.style.setProperty("--departure-order", departureOrder);
    if (departing) element.setAttribute("aria-hidden", "true");
    else element.removeAttribute("aria-hidden");
    element.innerHTML = `
      <div class="bus-head"><strong>${t("colors")[bus.color]}</strong><span class="bus-route">${active ? t("activeBus") : `R-${index + 1}`}</span></div>
      <img class="bus-art" src="${busArt[bus.color]}" alt="" aria-hidden="true">
      <div class="seats" aria-label="${t("busLabel", { color: t("colors")[bus.color], filled, capacity: bus.seats })}">${Array.from({ length: bus.seats }, (_, seat) => `<i class="${seat < filled ? "filled" : ""}"></i>`).join("")}</div>
    `;
  }

  function renderBuses(level) {
    const container = $("buses");
    const visibleIndexes = level.buses
      .map((_, index) => index)
      .filter((index) => index >= state.busIndex || departingBusIndexes.includes(index));
    const visibleSet = new Set(visibleIndexes.map(String));
    const elements = new Map(
      [...container.children].map((element) => [element.dataset.busIndex, element]),
    );

    [...container.children].forEach((element) => {
      if (!visibleSet.has(element.dataset.busIndex)) element.remove();
    });
    visibleIndexes.forEach((index, position) => {
      let element = elements.get(String(index));
      if (!element?.isConnected) {
        element = document.createElement("div");
        element.className = "bus";
      }
      updateBusCard(element, level.buses[index], index);
      if (container.children[position] !== element) {
        container.insertBefore(element, container.children[position] || null);
      }
    });
  }

  function passenger(color, queueIndex, itemIndex) {
    const front = itemIndex === 0;
    return `<button class="passenger ${front ? "front" : ""}" data-queue="${queueIndex}" data-color="${color}" style="--person:${palette[color]}" aria-label="${t("personLabel", { color: t("colors")[color] })}" ${front ? "" : "tabindex=\"-1\" aria-hidden=\"true\""}>
      <span class="passenger-art-frame" aria-hidden="true"><img class="passenger-art" src="${passengerArt[color]}" alt=""><b>${routeCodes[color]}</b></span>
      <span>${t("colors")[color]}</span>
    </button>`;
  }

  function render() {
    const level = levels[levelIndex];
    engine.settle(level, state);
    const remaining = state.queues.reduce((sum, queue) => sum + queue.length, 0) + state.waiting.length;
    $("chapter").textContent = t("chapter", { n: level.chapter + 1 });
    $("stageName").textContent = t("stop", { n: levelIndex + 1 });
    $("remaining").textContent = t("remaining", { n: remaining });
    renderBuses(level);
    $("holdingCount").textContent = `${state.waiting.length}/${level.baySize}`;
    $("holding").innerHTML = Array.from({ length: level.baySize }, (_, index) => {
      const color = state.waiting[index];
      return color === undefined
        ? `<span class="holding-slot">${index + 1}</span>`
        : `<span class="holding-slot occupied" data-color="${color}" style="--person:${palette[color]}"><img class="holding-passenger-art" src="${passengerArt[color]}" alt="" aria-hidden="true"><b>${routeCodes[color]}</b></span>`;
    }).join("");
    $("queues").innerHTML = state.queues.map((queue, queueIndex) => `
      <div class="queue" role="listitem">
        <span class="queue-label">${t("queueNumber", { n: queueIndex + 1 })}</span>
        ${queue.length ? queue.map((color, itemIndex) => passenger(color, queueIndex, itemIndex)).join("") : `<span class="queue-empty">—</span>`}
      </div>
    `).join("");
    root.querySelectorAll(".passenger.front").forEach((button) => {
      button.onclick = () => dispatch(Number(button.dataset.queue));
    });
    $("undo").disabled = history.length === 0;
  }

  function startLevel(index) {
    window.clearTimeout(departureTimer);
    departureTimer = 0;
    departingBusIndexes = [];
    $("buses").replaceChildren();
    levelIndex = index;
    const level = levels[index];
    state = {
      queues: level.queues.map((queue) => queue.slice()),
      waiting: [],
      busIndex: 0,
      busFilled: 0,
    };
    history = [];
    moves = 0;
    $("result").close();
    $("deadlock").close();
    $("leaveBattle").close();
    show("battle");
    render();
    $("status").textContent = t("status");
  }

  function dispatch(queueIndex) {
    const level = levels[levelIndex];
    const color = state.queues[queueIndex]?.[0];
    const activeColor = level.buses[state.busIndex]?.color;
    if (color === undefined || activeColor === undefined) return;
    if (color !== activeColor && state.waiting.length >= level.baySize) {
      $("status").textContent = t("holdingFull");
      root.querySelector(".holding-panel")?.classList.remove("jam");
      requestAnimationFrame(() => root.querySelector(".holding-panel")?.classList.add("jam"));
      return;
    }
    history.push(snapshot());
    const previousBusIndex = state.busIndex;
    const nextState = engine.step(level, state, queueIndex);
    if (!nextState) return;
    state = nextState;
    moves += 1;
    if (state.busIndex > previousBusIndex) {
      departingBusIndexes = Array.from(
        { length: state.busIndex - previousBusIndex },
        (_, offset) => previousBusIndex + offset,
      );
      window.clearTimeout(departureTimer);
      const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
      const departureDuration = reducedMotion ? 80 : 560 + (departingBusIndexes.length - 1) * 90;
      departureTimer = window.setTimeout(() => {
        departingBusIndexes = [];
        departureTimer = 0;
        render();
        if (engine.isComplete(level, state)) finishLevel();
      }, departureDuration);
    }
    render();
    $("status").textContent = color === activeColor ? t("boarded") : t("held");

    if (engine.isComplete(level, state)) {
      if (departingBusIndexes.length === 0) finishLevel();
      return;
    }
    if (engine.isDeadlocked(level, state)) $("deadlock").showModal();
  }

  function finishLevel() {
    if (!state || !engine.isComplete(levels[levelIndex], state) || $("result").open) return;
    progress[levelIndex] = true;
    save();
    $("resultBody").textContent = t("resultBody", { n: levelIndex + 1, moves });
    resultActionClaimed = false;
    $("resultStages").disabled = false;
    $("retry").disabled = false;
    $("next").disabled = levelIndex >= levels.length - 1;
    $("result").showModal();
  }

  function claimResultAction(action) {
    if (!$("result").open || resultActionClaimed) return;
    resultActionClaimed = true;
    ["resultStages", "next", "retry"].forEach((id) => { $(id).disabled = true; });
    action();
  }

  function undo() {
    const saved = history.pop();
    if (!saved) return;
    window.clearTimeout(departureTimer);
    departureTimer = 0;
    departingBusIndexes = [];
    restore(saved);
    render();
    $("status").textContent = t("undone");
  }

  function hint() {
    const level = levels[levelIndex];
    const activeColor = level.buses[state.busIndex]?.color;
    let queueIndex = state.queues.findIndex((queue) => queue[0] === activeColor);
    if (queueIndex < 0 && state.waiting.length < level.baySize) {
      const nextColor = level.buses[state.busIndex + 1]?.color;
      queueIndex = state.queues.findIndex((queue) => queue.length && queue[0] === nextColor);
    }
    if (queueIndex < 0) queueIndex = state.queues.findIndex((queue) => queue.length);
    const button = root.querySelector(`.passenger.front[data-queue="${queueIndex}"]`);
    button?.focus();
    button?.classList.add("hint");
    window.setTimeout(() => button?.classList.remove("hint"), 700);
  }

  $("start").onclick = () => { show("stage"); renderStage(); };
  const stageBack = $("stage").querySelector("[data-back]");
  const battleBack = $("battle").querySelector("[data-back]");
  stageBack.onclick = () => show("main");
  battleBack.onclick = () => {
    if (departureTimer || $("result").open || $("deadlock").open) return;
    $("leaveBattleBody").textContent = t("leaveBody", { n: levelIndex + 1 });
    $("leaveBattle").showModal();
  };
  $("continueBattle").onclick = () => $("leaveBattle").close();
  $("returnToStage").onclick = () => {
    $("leaveBattle").close();
    selected = levelIndex;
    show("stage");
    renderStage();
  };
  $("leaveBattle").addEventListener("close", () => {
    if (screen === "battle") battleBack.focus();
  });
  $("stageGrid").addEventListener("wonder:stage-snap", (event) => {
    const index = Number(event.detail?.index);
    if (Number.isInteger(index) && index >= 0) selectStage(index);
  });
  $("undo").onclick = undo;
  $("hint").onclick = hint;
  $("restart").onclick = () => startLevel(levelIndex);
  $("retry").onclick = () => claimResultAction(() => startLevel(levelIndex));
  $("resultStages").onclick = () => claimResultAction(() => {
    $("result").close();
    selected = Math.min(29, levelIndex + 1);
    show("stage");
    renderStage();
  });
  $("next").onclick = () => claimResultAction(() => {
    if (levelIndex >= levels.length - 1) return;
    $("result").close();
    selected = Math.min(29, levelIndex + 1);
    startLevel(selected);
  });
  $("deadlockUndo").onclick = () => { $("deadlock").close(); undo(); };
  $("deadlockRetry").onclick = () => startLevel(levelIndex);
  $("locale").innerHTML = codes.map((code) => `<option value="${code}">${dict[code]?.label || code}</option>`).join("");
  root.addEventListener("change", (event) => {
    if (event.target.id !== "locale") return;
    locale = event.target.value;
    write("weightPlayLocale", locale);
    write("wp-locale", locale);
    try { window.WonderI18n?.setLocale?.(locale); } catch {}
    applyLocale();
  });
  window.addEventListener("wonder:locale-change", (event) => {
    const next = event.detail?.actualLocale || event.detail?.locale;
    if (!codes.includes(next)) return;
    locale = next;
    write("weightPlayLocale", locale);
    write("wp-locale", locale);
    applyLocale();
    window.setTimeout(() => { if (locale === next) applyLocale(); }, 0);
  });

  applyLocale();
  show("main");
})();
