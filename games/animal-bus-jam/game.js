(() => {
  "use strict";

  const codes = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const palette = ["#ef6b62", "#4da8e8", "#f0bb4d", "#9a7ae9"];
  const routeCodes = ["A", "B", "C", "D"];
  const GAME_ID = "animal-bus-jam";
  const GAME_VERSION = 12;
  const INTERFACE_VERSION = 6;
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

  const routeLocales = {
    en: "en",
    "zh-tw": "zh-Hant",
    "zh-cn": "zh-Hans",
    ja: "ja",
    ko: "ko",
    es: "es",
    "pt-br": "pt-BR",
    fr: "fr",
    de: "de",
    it: "it",
    ru: "ru",
    hi: "hi",
    ar: "ar",
  };
  const routeSegment = location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
  const routeLocale = routeLocales[routeSegment];
  let locale = routeLocale || read("weightPlayLocale") || read("wp-locale") || window.WonderI18n?.actualLocale?.() || "en";
  let screen = "main";
  let sceneGeneration = 0;
  let selected = 0;
  let levelIndex = 0;
  let state = null;
  let history = [];
  let moves = 0;
  let departingBusIndexes = [];
  let departureTimer = 0;
  let departureDeadline = 0;
  let departureRemaining = 0;
  let lifecycleSuspended = false;
  let windowActive = true;
  let pageVisible = !document.hidden;
  let pageCached = false;
  let resultActionClaimed = false;
  let inputType = "pointer";
  const STAGE_POOL_SIZE = 9;
  let stageWindowStart = 0;
  let stageCardPool = [];
  let stageSettleFrame = 0;
  const progressKey = "animalBusJamProgress";
  let progress;
  try { progress = JSON.parse(read(progressKey) || "[]"); } catch { progress = []; }
  if (!Array.isArray(progress)) progress = [];
  if (!codes.includes(locale)) locale = "en";
  if (routeLocale) {
    write("weightPlayLocale", locale);
    write("wp-locale", locale);
    try { window.WonderI18n?.setLocale?.(locale); } catch {}
  }
  while (selected < 29 && progress[selected]) selected += 1;

  function viewportBucket() {
    const width = window.innerWidth || 0;
    const height = window.innerHeight || 0;
    if (width <= 480) return "phone";
    if (height < 520 && width > height) return "short-landscape";
    if (width <= 900 && height >= width) return "tablet-portrait";
    return "desktop-landscape";
  }

  function stopBucket(stop) {
    if (!Number.isInteger(stop) || stop < 1) return "unknown";
    if (stop <= 5) return "1-5";
    if (stop <= 15) return "6-15";
    return "16-30";
  }

  function track(event, payload = {}) {
    try {
      (window.WonderAnalytics || window.WeightPlayAnalytics)?.track?.(event, {
        game_id: GAME_ID,
        game_version: GAME_VERSION,
        interface_version: INTERFACE_VERSION,
        locale: locale || document.documentElement.lang || "en",
        viewport_bucket: viewportBucket(),
        input_type: inputType,
        ...payload,
      });
    } catch {
      // Analytics must never block a player action or alter puzzle state.
    }
  }

  function trackFunnel(event, payload = {}) {
    const stop = Number.isInteger(levelIndex) && state ? levelIndex + 1 : null;
    track(event, { stop, stop_bucket: stopBucket(stop), ...payload });
  }

  document.addEventListener("pointerdown", (event) => {
    if (event.isPrimary === false) return;
    inputType = event.pointerType === "touch" ? "touch" : "pointer";
  }, true);
  document.addEventListener("keydown", (event) => {
    if (!event.isComposing) inputType = "keyboard";
  }, true);

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
    if (name !== "stage") cancelStageSettlement();
    if (name !== "battle") {
      window.clearTimeout(departureTimer);
      departureTimer = 0;
      departureDeadline = 0;
      departureRemaining = 0;
      departingBusIndexes = [];
      $("buses").replaceChildren();
    }
    const generation = ++sceneGeneration;
    ["main", "stage", "battle"].forEach((id) => {
      $(id).hidden = id !== name;
      document.body.classList.toggle(`wp-shell-${id}-active`, id === name);
    });
    document.body.classList.toggle("wp-stage-select-active", name === "stage");
    document.documentElement.classList.toggle("wp-stage-select-active", name === "stage");
    $("generalReserve").hidden = name !== "battle";
    document.body.dataset.screen = name;
    document.body.dataset.gameView = name;
    screen = name;
    window.scrollTo(0, 0);
    const sync = () => {
      if (generation !== sceneGeneration || screen !== name) return;
      const detail = { screen: name, generation };
      window.dispatchEvent(new CustomEvent("weightplay:battle-sync", { detail }));
      window.dispatchEvent(new CustomEvent("weightplay:shell-sync", { detail }));
      window.dispatchEvent(new CustomEvent("weightplay:stage-sync", { detail }));
      if (name === "battle") window.dispatchEvent(new CustomEvent("weightplay:battle-open", { detail }));
    };
    sync();
    requestAnimationFrame(() => requestAnimationFrame(sync));
  }

  function settleDeparture() {
    departureTimer = 0;
    departureDeadline = 0;
    departureRemaining = 0;
    if (lifecycleSuspended || screen !== "battle" || !departingBusIndexes.length) return;
    departingBusIndexes = [];
    render();
    if (engine.isComplete(levels[levelIndex], state)) finishLevel();
  }

  function scheduleDeparture(duration) {
    window.clearTimeout(departureTimer);
    departureRemaining = Math.max(0, duration);
    if (lifecycleSuspended) {
      departureTimer = 0;
      departureDeadline = 0;
      return;
    }
    departureDeadline = performance.now() + departureRemaining;
    departureTimer = window.setTimeout(settleDeparture, departureRemaining);
  }

  function suspendDeparture() {
    lifecycleSuspended = true;
    if (!departureTimer) return;
    departureRemaining = Math.max(0, departureDeadline - performance.now());
    window.clearTimeout(departureTimer);
    departureTimer = 0;
    departureDeadline = 0;
  }

  function resumeDeparture() {
    if (!lifecycleSuspended || !windowActive || !pageVisible || pageCached) return;
    lifecycleSuspended = false;
    if (screen === "battle" && departingBusIndexes.length) scheduleDeparture(departureRemaining);
  }

  function selectStage(index, center = false, focus = false) {
    selected = Math.max(0, Math.min(29, index));
    ensureStageWindow(selected);
    stageCardPool.forEach((card) => {
      const active = Number(card.dataset.index) === selected;
      card.classList.toggle("selected", active);
      card.classList.toggle("centered", active);
      card.tabIndex = active ? 0 : -1;
      card.setAttribute("aria-current", active ? "true" : "false");
    });
    const current = root.querySelector(`#stageGrid [data-index="${selected}"]`);
    if (center) settleStageRail(currentStageLogicalPosition(), selected, center === "auto");
    if (focus) current?.focus({ preventScroll: true });
  }

  function cancelStageSettlement() {
    if (stageSettleFrame) cancelAnimationFrame(stageSettleFrame);
    stageSettleFrame = 0;
    const rail = $("stageGrid");
    rail?.style.removeProperty("scroll-behavior");
    rail?.style.removeProperty("scroll-snap-type");
    if (rail) delete rail.dataset.wpStageSettling;
  }

  function stageWindowLimit() {
    return Math.max(0, levels.length - STAGE_POOL_SIZE);
  }

  function desiredStageWindow(index) {
    return Math.max(0, Math.min(stageWindowLimit(), index - Math.floor(STAGE_POOL_SIZE / 2)));
  }

  function createStageCard(poolIndex) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "stage-card";
    button.dataset.wpStagePoolNode = String(poolIndex + 1);
    button.addEventListener("click", (event) => {
      event.stopImmediatePropagation();
      const index = Number(button.dataset.index);
      if (!Number.isInteger(index)) return;
      selectStage(index, "auto");
      if (button.getAttribute("aria-disabled") !== "true") startLevel(index);
    });
    return button;
  }

  function bindStageCard(button, index) {
    const level = levels[index];
    if (!level) return;
    const locked = index > 0 && !progress[index - 1];
    const active = index === selected;
    const stateLabel = locked ? `🔒 ${t("locked")}` : progress[index] ? `✓ ${t("complete")}` : t("stageMeta", {
      buses: level.buses.length,
      bay: level.baySize,
    });
    button.dir = document.documentElement.dir || "ltr";
    button.className = `stage-card${active ? " selected centered" : ""}${locked ? " locked" : ""}`;
    button.dataset.index = String(index);
    button.dataset.stageIndex = String(index);
    button.setAttribute("aria-posinset", String(index + 1));
    button.setAttribute("aria-setsize", String(levels.length));
    button.setAttribute("aria-disabled", String(locked));
    button.setAttribute("aria-current", String(active));
    button.tabIndex = active ? 0 : -1;
    if (active && !locked) button.dataset.wpStageRecommended = "true";
    else delete button.dataset.wpStageRecommended;
    button.innerHTML = `<strong>${t("stop", { n: index + 1 })}</strong><span>${t("chapter", { n: level.chapter + 1 })}</span><span>${stateLabel}</span>`;
  }

  function buildStagePool() {
    const rail = $("stageGrid");
    rail.dir = "ltr";
    rail.replaceChildren();
    stageWindowStart = desiredStageWindow(selected);
    stageCardPool = Array.from({ length: Math.min(STAGE_POOL_SIZE, levels.length) }, (_, offset) => {
      const button = createStageCard(offset);
      bindStageCard(button, stageWindowStart + offset);
      rail.append(button);
      return button;
    });
    Object.assign(rail.dataset, {
      wpStageVirtualized: "bounded-recycle",
      wpStagePoolSize: String(stageCardPool.length),
      wpStageTotal: String(levels.length),
      wpStageRecycleCount: "0",
      wpStageCenterObserver: "manual",
    });
  }

  function moveStageWindow(targetStart) {
    const rail = $("stageGrid");
    const target = Math.max(0, Math.min(stageWindowLimit(), targetStart));
    if (!stageCardPool.length || stageCardPool.some((card) => !card.isConnected)) buildStagePool();
    let recycled = 0;
    while (stageWindowStart < target) {
      const card = rail.firstElementChild;
      const anchor = card?.nextElementSibling;
      const before = anchor?.getBoundingClientRect().left;
      stageWindowStart += 1;
      rail.append(card);
      bindStageCard(card, stageWindowStart + stageCardPool.length - 1);
      const after = anchor?.getBoundingClientRect().left;
      if (Number.isFinite(before) && Number.isFinite(after)) rail.scrollLeft += after - before;
      recycled += 1;
    }
    while (stageWindowStart > target) {
      const card = rail.lastElementChild;
      const anchor = card?.previousElementSibling;
      const before = anchor?.getBoundingClientRect().left;
      stageWindowStart -= 1;
      rail.prepend(card);
      bindStageCard(card, stageWindowStart);
      const after = anchor?.getBoundingClientRect().left;
      if (Number.isFinite(before) && Number.isFinite(after)) rail.scrollLeft += after - before;
      recycled += 1;
    }
    stageCardPool = [...rail.children];
    rail.dataset.wpStageWindowStart = String(stageWindowStart + 1);
    rail.dataset.wpStageWindowEnd = String(stageWindowStart + stageCardPool.length);
    if (recycled) rail.dataset.wpStageRecycleCount = String(Number(rail.dataset.wpStageRecycleCount || 0) + recycled);
  }

  function ensureStageWindow(index) {
    if (!stageCardPool.length || stageCardPool.some((card) => !card.isConnected)) buildStagePool();
    moveStageWindow(desiredStageWindow(index));
    stageCardPool.forEach((card) => bindStageCard(card, Number(card.dataset.index)));
  }

  function stageRailGeometry() {
    const rail = $("stageGrid");
    const first = stageCardPool[0]?.getBoundingClientRect();
    const second = stageCardPool[1]?.getBoundingClientRect();
    const railRect = rail.getBoundingClientRect();
    const delta = first && second ? (second.left + second.width / 2) - (first.left + first.width / 2) : 0;
    return { center: railRect.left + railRect.width / 2, pitch: Math.abs(delta) || 280, orientation: Math.sign(delta) || 1 };
  }

  function nearestStageCard() {
    const { center } = stageRailGeometry();
    return stageCardPool.reduce((nearest, card) => {
      const box = card.getBoundingClientRect();
      const distance = Math.abs(box.left + box.width / 2 - center);
      return !nearest || distance < nearest.distance ? { card, distance } : nearest;
    }, null)?.card || null;
  }

  function currentStageLogicalPosition() {
    const card = nearestStageCard();
    if (!card) return selected;
    const box = card.getBoundingClientRect();
    const geometry = stageRailGeometry();
    return Math.max(0, Math.min(levels.length - 1, Number(card.dataset.index) + (geometry.center - (box.left + box.width / 2)) / (geometry.pitch * geometry.orientation)));
  }

  function positionStageRail(logicalPosition) {
    const rail = $("stageGrid");
    const logical = Math.max(0, Math.min(levels.length - 1, logicalPosition));
    const anchorIndex = Math.round(logical);
    moveStageWindow(desiredStageWindow(anchorIndex));
    const card = rail.querySelector(`[data-index="${anchorIndex}"]`);
    card?.scrollIntoView({ behavior: "auto", block: "nearest", inline: "center" });
    const fraction = logical - anchorIndex;
    if (card && Math.abs(fraction) > 0.0001) rail.scrollLeft += fraction * stageRailGeometry().orientation * stageRailGeometry().pitch;
    rail.dataset.wpStageDragLogical = logical.toFixed(4);
    return logical;
  }

  function syncCenteredStageCard() {
    const nearest = nearestStageCard();
    const index = Number(nearest?.dataset.index);
    if (Number.isInteger(index)) selected = index;
    stageCardPool.forEach((card) => bindStageCard(card, Number(card.dataset.index)));
    return nearest;
  }

  function settleStageRail(from, targetIndex, immediate = false) {
    cancelStageSettlement();
    const target = Math.max(0, Math.min(levels.length - 1, targetIndex));
    selected = target;
    if (immediate) {
      positionStageRail(target);
      // scrollIntoView updates the rail position asynchronously in Chromium.
      // Keyboard ownership already has an exact logical target, so committing
      // from pre-scroll geometry here could restore the previous card while
      // focus moved to the new one.
      selected = target;
      stageCardPool.forEach((card) => bindStageCard(card, Number(card.dataset.index)));
      return;
    }
    const rail = $("stageGrid");
    const started = performance.now();
    rail.style.setProperty("scroll-behavior", "auto", "important");
    rail.style.setProperty("scroll-snap-type", "none", "important");
    rail.dataset.wpStageSettling = "true";
    const animate = (now) => {
      const progressValue = Math.max(0, Math.min(1, (now - started) / 340));
      const eased = progressValue * progressValue * (3 - 2 * progressValue);
      positionStageRail(from + (target - from) * eased);
      if (progressValue < 1) stageSettleFrame = requestAnimationFrame(animate);
      else {
        stageSettleFrame = 0;
        positionStageRail(target);
        syncCenteredStageCard();
        rail.style.removeProperty("scroll-behavior");
        rail.style.removeProperty("scroll-snap-type");
        delete rail.dataset.wpStageSettling;
        rail.dispatchEvent(new CustomEvent("wonder:stage-snap", { detail: { index: target } }));
      }
    };
    stageSettleFrame = requestAnimationFrame(animate);
  }

  function installVirtualStageDrag() {
    const rail = $("stageGrid");
    let pointerId = null;
    let startX = 0;
    let lastX = 0;
    let logical = 0;
    let moved = false;
    let suppressClick = false;
    rail.dataset.wpStageVirtualDrag = "true";
    rail.addEventListener("pointerdown", (event) => {
      if (event.isPrimary === false || (event.button !== undefined && event.button !== 0)) return;
      cancelStageSettlement();
      pointerId = event.pointerId;
      startX = lastX = event.clientX;
      logical = currentStageLogicalPosition();
      moved = false;
      rail.style.setProperty("scroll-snap-type", "none", "important");
      event.stopImmediatePropagation();
    }, true);
    document.addEventListener("pointermove", (event) => {
      if (event.pointerId !== pointerId) return;
      const delta = event.clientX - lastX;
      lastX = event.clientX;
      if (!moved && Math.abs(event.clientX - startX) > 4) moved = true;
      if (moved) {
        if (event.cancelable) event.preventDefault();
        logical = positionStageRail(logical - delta / stageRailGeometry().pitch);
      }
      event.stopImmediatePropagation();
    }, true);
    const finish = (event) => {
      if (pointerId === null || (event.pointerId !== undefined && event.pointerId !== pointerId)) return;
      pointerId = null;
      if (moved) {
        if (event.cancelable) event.preventDefault();
        settleStageRail(logical, Math.round(logical));
        suppressClick = true;
        setTimeout(() => { suppressClick = false; }, 0);
      } else rail.style.removeProperty("scroll-snap-type");
      moved = false;
      event.stopImmediatePropagation();
    };
    document.addEventListener("pointerup", finish, true);
    document.addEventListener("pointercancel", finish, true);
    rail.addEventListener("click", (event) => {
      if (!suppressClick) return;
      suppressClick = false;
      event.preventDefault();
      event.stopImmediatePropagation();
    }, true);
  }

  function renderStage() {
    if (screen !== "stage") return;
    $("progress").textContent = t("progress", { done: progress.filter(Boolean).length });
    ensureStageWindow(selected);
    stageCardPool.forEach((card) => bindStageCard(card, Number(card.dataset.index)));
    requestAnimationFrame(() => settleStageRail(selected, selected, true));
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
      button.onclick = (event) => dispatch(Number(button.dataset.queue), event.detail === 0);
    });
    $("undo").disabled = history.length === 0;
  }

  function focusNextPassenger(queueIndex) {
    const nextPassenger = root.querySelector(`.passenger.front[data-queue="${queueIndex}"]`)
      || root.querySelector(".passenger.front");
    nextPassenger?.focus({ preventScroll: true });
  }

  function startLevel(index) {
    window.clearTimeout(departureTimer);
    departureTimer = 0;
    departureDeadline = 0;
    departureRemaining = 0;
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
    trackFunnel("stop_start", { source: "stage_card" });
  }

  function dispatch(queueIndex, restoreKeyboardFocus = false) {
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
    trackFunnel("dispatch", {
      queue: queueIndex + 1,
      route: color,
      dispatch_type: color === activeColor ? "direct" : "holding",
      holding_count: state.waiting.length,
      move_count: moves,
    });
    if (state.busIndex > previousBusIndex) {
      departingBusIndexes = Array.from(
        { length: state.busIndex - previousBusIndex },
        (_, offset) => previousBusIndex + offset,
      );
      window.clearTimeout(departureTimer);
      const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
      const departureDuration = reducedMotion ? 80 : 560 + (departingBusIndexes.length - 1) * 90;
      scheduleDeparture(departureDuration);
    }
    render();
    if (restoreKeyboardFocus) focusNextPassenger(queueIndex);
    $("status").textContent = color === activeColor ? t("boarded") : t("held");

    if (engine.isComplete(level, state)) {
      if (departingBusIndexes.length === 0) finishLevel();
      return;
    }
    if (engine.isDeadlocked(level, state)) {
      trackFunnel("deadlock", { move_count: moves, holding_count: state.waiting.length });
      $("deadlock").showModal();
    }
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
    trackFunnel("game_complete", { move_count: moves });
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
    departureDeadline = 0;
    departureRemaining = 0;
    departingBusIndexes = [];
    restore(saved);
    render();
    $("status").textContent = t("undone");
    trackFunnel("undo", { move_count: moves });
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
    if (button) {
      $("status").textContent = t("hintMove", {
        queue: queueIndex + 1,
        color: t("colors")[Number(button.dataset.color)],
      });
    }
    trackFunnel("hint", { recommended_queue: queueIndex >= 0 ? queueIndex + 1 : null });
    button?.focus();
    button?.classList.add("hint");
    window.setTimeout(() => button?.classList.remove("hint"), 700);
  }

  $("start").onclick = () => {
    track("game_start", { source: "main" });
    show("stage");
    renderStage();
  };
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
  $("stageGrid").addEventListener("keydown", (event) => {
    const card = event.target.closest(".stage-card");
    if (!card) return;
    const rtl = document.documentElement.dir === "rtl";
    const step = event.key === "ArrowRight" ? (rtl ? -1 : 1)
      : event.key === "ArrowLeft" ? (rtl ? 1 : -1) : 0;
    let target = null;
    if (step) target = Number(card.dataset.index) + step;
    else if (event.key === "Home") target = 0;
    else if (event.key === "End") target = 29;
    else return;
    event.preventDefault();
    event.stopImmediatePropagation();
    selectStage(target, "auto", true);
  });
  installVirtualStageDrag();
  $("undo").onclick = undo;
  $("hint").onclick = hint;
  $("restart").onclick = () => startLevel(levelIndex);
  $("retry").onclick = () => claimResultAction(() => {
    trackFunnel("result_retry", { source: "result" });
    startLevel(levelIndex);
  });
  $("resultStages").onclick = () => claimResultAction(() => {
    trackFunnel("result_stage", { source: "result" });
    $("result").close();
    selected = Math.min(29, levelIndex + 1);
    show("stage");
    renderStage();
  });
  $("next").onclick = () => claimResultAction(() => {
    if (levelIndex >= levels.length - 1) return;
    trackFunnel("result_next", { source: "result", next_stop: Math.min(30, levelIndex + 2) });
    $("result").close();
    selected = Math.min(29, levelIndex + 1);
    startLevel(selected);
  });
  $("deadlockUndo").onclick = () => { $("deadlock").close(); undo(); };
  $("deadlockRetry").onclick = () => {
    trackFunnel("deadlock_retry");
    startLevel(levelIndex);
  };
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
  window.addEventListener("blur", () => {
    windowActive = false;
    suspendDeparture();
  });
  window.addEventListener("focus", () => {
    windowActive = true;
    resumeDeparture();
  });
  window.addEventListener("pagehide", () => {
    pageCached = true;
    suspendDeparture();
  });
  window.addEventListener("pageshow", () => {
    pageCached = false;
    resumeDeparture();
  });
  document.addEventListener("visibilitychange", () => {
    pageVisible = !document.hidden;
    if (pageVisible) resumeDeparture();
    else suspendDeparture();
  });

  applyLocale();
  show("main");
})();
