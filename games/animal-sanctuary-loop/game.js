(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const localePack = window.AnimalSanctuaryLoopLocales;
  const localeCodes = localePack.codes;
  // The reviewed French action is already localized. Do not let the generic
  // bridge reinterpret "Commencer" as its unrelated "Beginner" source entry.
  // Other game copy still uses the bridge for legacy dictionary completion.
  $("start")?.setAttribute("data-runtime-localize", "off");
  const routeSegments = {
    en: "en", "zh-Hant": "zh-tw", "zh-Hans": "zh-cn", ja: "ja", ko: "ko",
    es: "es", "pt-BR": "pt-br", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar",
  };
  const routeLocales = Object.fromEntries(
    Object.entries(routeSegments).map(([key, value]) => [value, key]),
  );
  const memoryStorage = new Map();
  const storage = {
    get(key) {
      try {
        const value = window.localStorage.getItem(key);
        return value === null ? memoryStorage.get(key) ?? null : value;
      } catch {
        return memoryStorage.get(key) ?? null;
      }
    },
    set(key, value) {
      memoryStorage.set(key, String(value));
      try {
        window.localStorage.setItem(key, String(value));
      } catch {
        // Same-page memory remains authoritative when browser storage is denied.
      }
    },
  };

  function canonicalLocale(value) {
    const raw = String(value || "").toLowerCase();
    if (raw.startsWith("zh-tw") || raw.includes("hant")) return "zh-Hant";
    if (raw.startsWith("zh-cn") || raw.includes("hans")) return "zh-Hans";
    if (raw.startsWith("pt")) return "pt-BR";
    return localeCodes.find((code) => code.toLowerCase() === raw) || "en";
  }

  const routeLocale = routeLocales[location.pathname.split("/").filter(Boolean)[0]];
  let locale = canonicalLocale(routeLocale || storage.get("wonderLocale") || navigator.language);
  const runtimeLocales = new Set(["hi", "ar"]);
  function navigateToLocale(next) {
    const segment = routeSegments[next];
    const currentSegment = location.pathname.split("/").filter(Boolean)[0];
    if (!segment || currentSegment === segment) return false;
    location.href = `/${segment}/games/animal-sanctuary-loop/${location.search}${location.hash}`;
    return true;
  }
  function t(key, vars = {}) {
    const source = String(localePack.dictionaries[locale]?.[key] || localePack.dictionaries.en[key] || key)
      .replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? `{${name}}`);
    return runtimeLocales.has(locale) ? window.WeightPlayGameRuntimeLocalizer?.translate?.(source) || source : source;
  }

  for (const [value, label] of [["hi", "हिन्दी"], ["ar", "العربية"]]) {
    if ($("locale").querySelector(`option[value="${value}"]`)) continue;
    $("locale").append(new Option(label, value));
  }

  const SAVE_KEY = "animalSanctuaryLoopSaveV1";
  const STYLE_IDS = ["starter", "prism", "moon"];
  const defaultSave = () => ({
    unlocked: 1,
    stars: {},
    selectedStyle: "starter",
    ownedStyles: ["starter"],
    tutorialSeen: false,
  });

  function normalizeSave(raw) {
    const source = raw && typeof raw === "object" ? raw : {};
    const stars = {};
    if (source.stars && typeof source.stars === "object") {
      for (const [key, value] of Object.entries(source.stars)) {
        const stage = Math.trunc(Number(key));
        const score = Math.max(0, Math.min(3, Math.trunc(Number(value))));
        if (Number.isFinite(stage) && stage >= 1 && stage <= 30 && score) stars[stage] = score;
      }
    }
    const ownedStyles = Array.isArray(source.ownedStyles)
      ? [...new Set(source.ownedStyles.filter((id) => STYLE_IDS.includes(id)))]
      : ["starter"];
    if (!ownedStyles.includes("starter")) ownedStyles.unshift("starter");
    const selectedStyle = ownedStyles.includes(source.selectedStyle) ? source.selectedStyle : "starter";
    return {
      unlocked: Math.max(1, Math.min(30, Math.trunc(Number(source.unlocked)) || 1)),
      stars,
      selectedStyle,
      ownedStyles,
      tutorialSeen: source.tutorialSeen === true,
    };
  }

  function readSave() {
    try {
      return normalizeSave(JSON.parse(storage.get(SAVE_KEY) || "null"));
    } catch {
      return defaultSave();
    }
  }

  let save = readSave();
  const persist = () => storage.set(SAVE_KEY, JSON.stringify(save));

  const chapters = ["chapter1", "chapter2", "chapter3", "chapter4", "chapter5", "chapter6"];
  const stageBlueprints = [
    { target: 12, time: 112, layout: "heart", field: "open", enemies: ["prowler"] },
    { target: 14, time: 112, layout: "cross", field: "open", enemies: ["prowler", "prowler"] },
    { target: 15, time: 110, layout: "twin", field: "pillars", enemies: ["runner"] },
    { target: 17, time: 110, layout: "edge", field: "gates", enemies: ["prowler", "runner"] },
    { target: 18, time: 112, layout: "ring", field: "channels", enemies: ["sentry"], guardianType: "root" },
    { target: 18, time: 108, layout: "twin", field: "open", enemies: ["sentry"], rescue: 1 },
    { target: 20, time: 108, layout: "edge", field: "pillars", enemies: ["prowler", "sentry"], rescue: 1 },
    { target: 21, time: 106, layout: "cross", field: "gates", enemies: ["runner", "sentry"], rescue: 2 },
    { target: 22, time: 106, layout: "islands", field: "channels", enemies: ["tank", "sentry"], rescue: 2 },
    { target: 23, time: 108, layout: "ring", field: "ring", enemies: ["prowler"], rescue: 2, guardianType: "boar" },
    { target: 21, time: 104, layout: "edge", field: "open", enemies: ["runner"], storm: true, stormEvery: 4.6 },
    { target: 23, time: 104, layout: "twin", field: "channels", enemies: ["runner", "prowler"], storm: true, stormEvery: 4 },
    { target: 24, time: 102, layout: "cross", field: "pillars", enemies: ["tank"], storm: true, stormEvery: 3.8 },
    { target: 25, time: 102, layout: "islands", field: "gates", enemies: ["runner", "runner"], storm: true, stormEvery: 3.5 },
    { target: 26, time: 104, layout: "ring", field: "ring", enemies: ["prowler"], storm: true, stormEvery: 3.2, guardianType: "roc" },
    { target: 24, time: 102, layout: "heart", field: "open", enemies: ["prowler", "runner"], rival: true, rivalEvery: 7 },
    { target: 25, time: 101, layout: "edge", field: "pillars", enemies: ["runner", "tank"], rival: true, rivalEvery: 6.6 },
    { target: 26, time: 101, layout: "twin", field: "gates", enemies: ["sentry", "prowler"], shrink: true, shrinkEvery: 8 },
    { target: 28, time: 100, layout: "islands", field: "channels", enemies: ["tank", "runner"], rival: true, shrink: true, rivalEvery: 6.4, shrinkEvery: 8 },
    { target: 29, time: 102, layout: "ring", field: "ring", enemies: ["prowler"], rival: true, shrink: true, rivalEvery: 6, shrinkEvery: 7.5, guardianType: "cinder" },
    { target: 25, time: 100, layout: "cross", field: "open", enemies: ["sentry"], seals: 2 },
    { target: 27, time: 100, layout: "twin", field: "pillars", enemies: ["sentry", "runner"], seals: 2 },
    { target: 28, time: 98, layout: "edge", field: "gates", enemies: ["tank", "sentry"], seals: 3 },
    { target: 30, time: 98, layout: "islands", field: "channels", enemies: ["runner", "sentry", "prowler"], seals: 3 },
    { target: 31, time: 100, layout: "ring", field: "ring", enemies: ["sentry"], seals: 4, guardianType: "moth" },
    { target: 28, time: 98, layout: "twin", field: "gates", enemies: ["runner", "tank"], rescue: 1, storm: true, stormEvery: 3.8 },
    { target: 30, time: 98, layout: "edge", field: "channels", enemies: ["sentry", "runner"], seals: 3, rival: true, rivalEvery: 6 },
    { target: 31, time: 96, layout: "cross", field: "pillars", enemies: ["tank", "prowler"], rescue: 2, shrink: true, shrinkEvery: 7 },
    { target: 33, time: 96, layout: "islands", field: "ring", enemies: ["runner", "sentry", "tank"], seals: 3, storm: true, rival: true, stormEvery: 3.4, rivalEvery: 5.8 },
    { target: 35, time: 104, layout: "ring", field: "gates", enemies: ["prowler", "runner", "tank", "sentry"], rescue: 1, seals: 4, storm: true, rival: true, shrink: true, stormEvery: 3.2, rivalEvery: 5.6, shrinkEvery: 7, guardianType: "eclipse" },
  ];
  const stages = stageBlueprints.map((stage, index) => ({
    rescue: 0, seals: 0, storm: false, rival: false, shrink: false,
    n: index + 1,
    chapter: Math.floor(index / 5),
    ...stage,
    hunters: stage.enemies.length,
    guardian: Boolean(stage.guardianType),
  }));

  const styleData = {
    starter: { name: "styleStarter", cost: 0, colors: ["#ffe36c", "#36d8ff"] },
    prism: { name: "stylePrism", cost: 15, colors: ["#ff70d4", "#65f7ff"] },
    moon: { name: "styleMoon", cost: 25, colors: ["#d8e7ff", "#8c7cff"] },
  };

  const staticText = [...document.querySelectorAll("[data-t]")];
  const assistiveText = [...document.querySelectorAll("[data-ta]")];
  const resultReplayLabels = {
    en: "Replay", "zh-Hant": "重玩", "zh-Hans": "重玩", ja: "リプレイ",
    ko: "다시 플레이", es: "Repetir", "pt-BR": "Jogar novamente",
    fr: "Rejouer", de: "Erneut spielen", it: "Rigioca",
    ru: "Играть снова", hi: "फिर खेलें", ar: "إعادة اللعب",
  };
  let run = null;
  let currentScreen = "loading";
  let resultDecisionCommitted = false;

  function objectiveFor(stage) {
    if (stage.seals) return t("objectiveSeals", { percent: stage.target, count: stage.seals });
    if (stage.rescue) return t("objectiveRescue", { percent: stage.target, count: stage.rescue });
    return t("objectiveRestore", { percent: stage.target });
  }

  function describeStage(stage) {
    const counts = stage.enemies.reduce((result, type) => ({ ...result, [type]: (result[type] || 0) + 1 }), {});
    const roster = Object.entries(counts).map(([type, count]) => `${t(`enemy${type[0].toUpperCase()}${type.slice(1)}`)}${count > 1 ? ` ×${count}` : ""}`);
    if (stage.guardian) roster.push(t("enemyGuardian"));
    return `${t(`layout${stage.layout[0].toUpperCase()}${stage.layout.slice(1)}`)} · ${roster.join(" + ")}`;
  }

  function applyLocale() {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    $("locale").value = locale;
    $("lobbyReturn").href = `/${routeSegments[locale]}/`;
    staticText.forEach((element) => { element.textContent = t(element.dataset.t); });
    assistiveText.forEach((element) => element.setAttribute("aria-label", t(element.dataset.ta)));
    const resultActions = $("resultStage").parentElement;
    resultActions.append($("resultStage"), $("nextMission"), $("retry"));
    $("resultStage").textContent = t("missions");
    $("nextMission").textContent = t("nextMission");
    $("retry").textContent = resultReplayLabels[locale] || resultReplayLabels.en;
    document.title = `${t("title")} | WeightPlay`;
    renderMainProgress();
    renderStage();
    renderAtelier();
    if (run) updateBattleHud(true);
  }

  function renderMainProgress() {
    $("mainProgress").textContent = `${Object.keys(save.stars).length} / 30`;
  }

  let mainFocusSettlementToken = 0;
  function restoreMainStartFocus() {
    const token = ++mainFocusSettlementToken;
    let observer = null;
    let stopTimer = 0;
    const focusStart = () => {
      if (token !== mainFocusSettlementToken || currentScreen !== "main" || $("mainGroup").hidden) {
        observer?.disconnect();
        window.clearTimeout(stopTimer);
        return;
      }
      const active = document.activeElement;
      const visibleOwner = active && active !== document.body && active.getClientRects().length > 0;
      if (visibleOwner && active !== $("start")) return;
      $("start").focus({ preventScroll: true });
    };
    focusStart();
    requestAnimationFrame(focusStart);
    observer = new MutationObserver(focusStart);
    observer.observe(document.body, { attributes: true, childList: true, subtree: true });
    for (const delay of [80, 400, 1000]) window.setTimeout(focusStart, delay);
    stopTimer = window.setTimeout(() => observer.disconnect(), 1600);
  }

  function showScreen(name, restoreFocus = true) {
    currentScreen = name;
    document.body.dataset.screen = name;
    $("mainGroup").hidden = name !== "main";
    $("stage").hidden = name !== "stage";
    $("battle").hidden = name !== "battle";
    if (name !== "battle") stopLoop();
    if (name === "stage") {
      renderStage();
      requestAnimationFrame(() => centerCurrentStage(restoreFocus));
    } else if (name === "main" && restoreFocus) {
      restoreMainStartFocus();
    }
  }

  function markCentered(index) {
    const cards = [...$("stageRail").querySelectorAll(".stage-card")];
    let chosen = cards.find((card) => Number(card.dataset.index) === Number(index));
    if (!chosen) {
      const railRect = $("stageRail").getBoundingClientRect();
      const center = railRect.left + railRect.width / 2;
      chosen = cards.reduce((best, card) => {
        const rect = card.getBoundingClientRect();
        const distance = Math.abs(rect.left + rect.width / 2 - center);
        return !best || distance < best.distance ? { card, distance } : best;
      }, null)?.card;
    }
    cards.forEach((card) => {
      const selected = card === chosen;
      card.classList.toggle("centered", selected);
      if (selected) card.setAttribute("aria-current", "true");
      else card.removeAttribute("aria-current");
    });
  }

  function renderStage() {
    const rail = $("stageRail");
    const previous = rail.scrollLeft;
    rail.replaceChildren(...stages.map((stage, index) => {
      const button = document.createElement("button");
      const locked = stage.n > save.unlocked;
      button.type = "button";
      button.className = `stage-card${locked ? " locked" : ""}`;
      button.dataset.stage = String(stage.n);
      button.dataset.index = String(index);
      button.dataset.stageIndex = String(index);
      button.setAttribute("aria-disabled", locked ? "true" : "false");
      const rule = objectiveFor(stage);
      const earned = Number(save.stars[stage.n]) || 0;
      button.setAttribute("aria-label", `${locked ? `${t("lockedBadge")}, ` : ""}${t(chapters[stage.chapter])}, ${stage.n}, ${rule}`);
      button.innerHTML = `<small>${locked ? t("lockedBadge") : t(chapters[stage.chapter])}</small><strong>${stage.n}</strong><span>${rule}</span><small class="stage-twist">${describeStage(stage)}</small><small>${"★".repeat(earned)}${"☆".repeat(3 - earned)}</small>`;
      button.addEventListener("click", (event) => {
        if (heldScreenTransition === "main") return;
        if (stage.n > save.unlocked) {
          $("stageHint").textContent = t("stageLocked");
          return;
        }
        startBattle(index, event);
      });
      return button;
    }));
    rail.scrollLeft = previous;
    $("stageProgress").textContent = `${save.unlocked} / 30`;
    requestAnimationFrame(() => markCentered(null));
  }

  function centerCurrentStage(restoreFocus = true) {
    const index = Math.min(save.unlocked, 30) - 1;
    const card = $("stageRail").querySelector(`[data-index="${index}"]`);
    card?.scrollIntoView({ behavior: "auto", inline: "center", block: "nearest" });
    requestAnimationFrame(() => {
      markCentered(index);
      if (restoreFocus) card?.focus({ preventScroll: true });
    });
  }

  $("stageRail").addEventListener("wonder:stage-snap", (event) => markCentered(event.detail?.index));

  function renderAtelier() {
    $("trailStyles").replaceChildren(...Object.entries(styleData).map(([id, style]) => {
      const owned = save.ownedStyles.includes(id);
      const selected = save.selectedStyle === id;
      const button = document.createElement("button");
      button.type = "button";
      button.className = `trail-style${selected ? " selected" : ""}`;
      button.setAttribute("aria-pressed", selected ? "true" : "false");
      button.innerHTML = `<span class="trail-swatch" style="color:${style.colors[0]};background:linear-gradient(90deg,${style.colors.join(",")})"></span><strong>${t(style.name)}</strong><small>${selected ? t("styleSelected") : owned ? t("styleOwned") : t("styleCost", { cost: style.cost })}</small>`;
      button.addEventListener("click", () => chooseStyle(id));
      return button;
    }));
  }

  function chooseStyle(id) {
    const styleName = t(styleData[id].name);
    if (save.ownedStyles.includes(id)) {
      if (save.selectedStyle === id) {
        $("atelierFeedback").textContent = t("styleAlreadySelected", { style: styleName });
        return;
      }
      save.selectedStyle = id;
      persist();
      renderAtelier();
      $("atelierFeedback").textContent = t("styleEquipped", { style: styleName });
      return;
    }
    const cost = styleData[id].cost;
    const balance = Math.max(0, Number(window.WeightPlayWallet?.read?.().diamonds) || 0);
    if (balance < cost) {
      $("atelierFeedback").textContent = t("noDiamondsDetail", { cost, balance });
      return;
    }
    if (!window.WeightPlayWallet?.spendDiamonds?.(cost)) {
      $("atelierFeedback").textContent = t("noDiamondsDetail", { cost, balance });
      return;
    }
    save.ownedStyles.push(id);
    save.selectedStyle = id;
    persist();
    renderAtelier();
    $("atelierFeedback").textContent = t("styleBoughtDetail", { style: styleName });
    window.WonderSound?.play?.("success");
  }

  const stageTabButtons = [...document.querySelectorAll(".stage-tabs [data-tab]")];
  function activateStageTab(button, restoreFocus = false) {
    stageTabButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", active ? "true" : "false");
      item.tabIndex = active ? 0 : -1;
    });
    $("missionsTab").hidden = button.dataset.tab !== "missions";
    $("atelierTab").hidden = button.dataset.tab !== "atelier";
    if (restoreFocus) button.focus({ preventScroll: true });
  }
  document.querySelector(".stage-tabs")?.setAttribute("role", "tablist");
  stageTabButtons.forEach((button, index) => {
    const panel = $(button.dataset.tab === "missions" ? "missionsTab" : "atelierTab");
    button.id ||= `stageTab-${button.dataset.tab}`;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-controls", panel.id);
    button.setAttribute("aria-keyshortcuts", "ArrowLeft ArrowRight Home End");
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", button.id);
    button.addEventListener("click", () => activateStageTab(button));
    button.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === "Home"
        ? 0
        : event.key === "End"
          ? stageTabButtons.length - 1
          : (index + (event.key === "ArrowRight" ? 1 : -1) + stageTabButtons.length) % stageTabButtons.length;
      activateStageTab(stageTabButtons[next], true);
    });
  });
  activateStageTab(stageTabButtons.find((button) => button.classList.contains("active")) || stageTabButtons[0]);

  let heldScreenTransition = "";
  const activationKey = (event) => event.key === "Enter" || event.key === " " || event.key === "Spacebar";
  const ownScreenTransition = (source) => (event) => {
    if (activationKey(event) && !event.repeat) heldScreenTransition = source;
  };
  const releaseScreenTransition = (event) => {
    if (activationKey(event)) heldScreenTransition = "";
  };

  $("start").addEventListener("keydown", ownScreenTransition("main"));
  $("stageBack").addEventListener("keydown", ownScreenTransition("stage"));
  document.addEventListener("keyup", releaseScreenTransition);
  window.addEventListener("blur", () => { heldScreenTransition = ""; });
  $("start").addEventListener("click", () => {
    if (heldScreenTransition === "stage") return;
    showScreen("stage");
  });
  $("stageBack").addEventListener("click", () => showScreen("main"));
  $("locale").addEventListener("change", (event) => {
    const next = canonicalLocale(event.target.value);
    storage.set("wonderLocale", next);
    if (navigateToLocale(next)) return;
    locale = next;
    applyLocale();
  });
  window.addEventListener("wonder:locale-change", (event) => {
    const next = canonicalLocale(event.detail?.locale || event.detail?.actualLocale);
    if (next !== locale) {
      storage.set("wonderLocale", next);
      if (navigateToLocale(next)) return;
      locale = next;
      applyLocale();
    }
  });

  const GRID = 48;
  const TOTAL = GRID * GRID;
  const canvas = $("arena");
  const ctx = canvas.getContext("2d");
  const landCanvas = document.createElement("canvas");
  const landCtx = landCanvas.getContext("2d");
  landCanvas.width = canvas.width;
  landCanvas.height = canvas.height;
  const images = {};
  const imageSources = {
    player: "../../assets/weightplay-character-spark-paw-fox-cutout.webp",
    prowler: "../../assets/animal-crystal-survivor-shadow-basic.webp",
    runner: "../../assets/animal-crystal-survivor-shadow-runner.webp",
    tank: "../../assets/animal-crystal-survivor-shadow-tank.webp",
    sentry: "../../assets/animal-crystal-survivor-shadow-fox-v2.webp",
    root: "../../assets/animal-crystal-survivor-boss-root-stalker.webp",
    boar: "../../assets/animal-crystal-survivor-boss-briar-boar-king.webp",
    roc: "../../assets/animal-crystal-survivor-boss-tempest-roc.webp",
    cinder: "../../assets/animal-crystal-survivor-boss-cinder-panther.webp",
    moth: "../../assets/animal-crystal-survivor-boss-prism-moth-queen.webp",
    eclipse: "../../assets/animal-crystal-survivor-boss-eclipse-colossus.webp",
    beacon: "../../assets/animal-moonlight-heist-marker-objective.webp",
    seal: "../../assets/animal-crystal-survivor-xp-crystal.webp",
  };
  let raf = 0;
  let lastTime = 0;
  let lastHud = "";
  let lifecycleSuspended = false;
  let windowFocused = document.hasFocus();

  const indexFor = (x, y) => Math.max(0, Math.min(GRID - 1, Math.floor(y))) * GRID
    + Math.max(0, Math.min(GRID - 1, Math.floor(x)));
  const pointFor = (index) => ({ x: index % GRID, y: Math.floor(index / GRID) });
  const territoryCount = () => run ? run.owned.reduce((sum, value) => sum + value, 0) : 0;
  const territoryPercent = () => territoryCount() / TOTAL * 100;

  const layoutSpawns = {
    heart: { x: 29.1, y: 24 }, cross: { x: 30.1, y: 24 }, twin: { x: 20.1, y: 24 },
    edge: { x: 7.1, y: 24 }, ring: { x: 33.1, y: 24 }, islands: { x: 24.1, y: 24 },
  };

  function makeBlocked(field) {
    const blocked = new Uint8Array(TOTAL);
    const addRect = (left, top, width, height) => {
      for (let y = top; y < top + height; y += 1) for (let x = left; x < left + width; x += 1) blocked[y * GRID + x] = 1;
    };
    if (field === "pillars") [[12, 12], [33, 12], [12, 33], [33, 33]].forEach(([x, y]) => addRect(x, y, 3, 3));
    if (field === "gates") {
      addRect(16, 2, 2, 15); addRect(16, 30, 2, 16); addRect(31, 2, 2, 15); addRect(31, 30, 2, 16);
    }
    if (field === "channels") {
      addRect(5, 15, 21, 2); addRect(31, 15, 12, 2); addRect(5, 31, 12, 2); addRect(22, 31, 21, 2);
    }
    if (field === "ring") [[23, 8], [34, 12], [38, 23], [34, 34], [23, 38], [12, 34], [8, 23], [12, 12]].forEach(([x, y]) => addRect(x, y, 3, 3));
    return blocked;
  }

  function makeOwned(stage, blocked) {
    const owned = new Uint8Array(TOTAL);
    for (let y = 0; y < GRID; y += 1) {
      for (let x = 0; x < GRID; x += 1) {
        const dx = x - 24;
        const dy = y - 24;
        const d2 = dx ** 2 + dy ** 2;
        let inside = false;
        if (stage.layout === "heart") inside = d2 <= 28;
        if (stage.layout === "cross") inside = (Math.abs(dx) <= 2 && Math.abs(dy) <= 9) || (Math.abs(dy) <= 2 && Math.abs(dx) <= 9);
        if (stage.layout === "twin") inside = (x - 17) ** 2 + dy ** 2 <= 19 || (x - 31) ** 2 + dy ** 2 <= 19 || (Math.abs(dy) <= 1 && x >= 17 && x <= 31);
        if (stage.layout === "edge") inside = (x <= 6 && y >= 13 && y <= 35) || (x - 7) ** 2 + dy ** 2 <= 18;
        if (stage.layout === "ring") inside = d2 >= 44 && d2 <= 96;
        if (stage.layout === "islands") inside = d2 <= 13 || [[13, 13], [35, 13], [13, 35], [35, 35]].some(([cx, cy]) => (x - cx) ** 2 + (y - cy) ** 2 <= 8);
        if (inside && !blocked[y * GRID + x]) owned[y * GRID + x] = 1;
      }
    }
    return owned;
  }

  function createMarkers(count, type, stage, blocked, owned) {
    const markers = [];
    for (let markerIndex = 0; markerIndex < count; markerIndex += 1) {
      const seed = stage.n * 37 + markerIndex * 53 + (type === "seal" ? 19 : 7);
      for (let attempt = 0; attempt < TOTAL; attempt += 1) {
        const x = 4 + ((seed + attempt * 11) % 40);
        const y = 4 + ((seed * 3 + attempt * 17) % 40);
        const index = y * GRID + x;
        if (!blocked[index] && !owned[index] && markers.every((marker) => Math.hypot(marker.x - x, marker.y - y) > 7)) {
          markers.push({ type, x: x + 0.5, y: y + 0.5, done: false });
          break;
        }
      }
    }
    return markers;
  }

  const enemyStats = {
    prowler: { speed: 2.15, size: 4.2, cutRadius: 0.72 },
    runner: { speed: 2.55, size: 3.8, cutRadius: 0.58 },
    tank: { speed: 1.42, size: 5.4, cutRadius: 1.28 },
    sentry: { speed: 1.9, size: 4.3, cutRadius: 0.82 },
  };

  function createEnemy(type, enemyIndex, stage, markers) {
    const spawnPoints = [{ x: 6, y: 7 }, { x: 42, y: 8 }, { x: 41, y: 40 }, { x: 7, y: 41 }, { x: 24, y: 5 }, { x: 43, y: 24 }];
    const stats = enemyStats[type];
    const spawn = spawnPoints[(enemyIndex + stage.n) % spawnPoints.length];
    return { ...spawn, type, imageKey: type, speed: stats.speed + stage.chapter * 0.06, size: stats.size, cutRadius: stats.cutRadius, patrolStep: enemyIndex % 4, abilityClock: enemyIndex * 0.7, burst: false, markerIndex: type === "sentry" && markers.length ? enemyIndex % markers.length : -1, angle: 0 };
  }

  function startBattle(index, event) {
    reclaimVisibleForeground(event);
    lifecycleSuspended = false;
    const stageIndex = Math.max(0, Math.min(29, Math.trunc(index)));
    const stage = stages[stageIndex];
    const blocked = makeBlocked(stage.field);
    const owned = makeOwned(stage, blocked);
    const spawn = { ...layoutSpawns[stage.layout] };
    if (!owned[indexFor(spawn.x, spawn.y)]) {
      const nearest = owned.findIndex(Boolean);
      Object.assign(spawn, { x: nearest % GRID + 0.5, y: Math.floor(nearest / GRID) + 0.5 });
    }
    const markers = [...createMarkers(stage.rescue, "beacon", stage, blocked, owned), ...createMarkers(stage.seals, "seal", stage, blocked, owned)];
    const hunters = stage.enemies.map((type, enemyIndex) => createEnemy(type, enemyIndex, stage, markers));
    if (stage.guardian) {
      const guardianBase = { root: "prowler", boar: "tank", roc: "runner", cinder: "runner", moth: "sentry", eclipse: "tank" }[stage.guardianType];
      hunters.push({ ...createEnemy(guardianBase, hunters.length, stage, markers), type: guardianBase, imageKey: stage.guardianType, guardian: true, size: 6.4, cutRadius: 1.1, speed: stage.guardianType === "roc" ? 2.65 : stage.guardianType === "cinder" ? 2.8 : 1.85 });
    }
    run = {
      stageIndex,
      stage,
      owned,
      blocked,
      trail: new Set(),
      player: { ...spawn, dx: 0, dy: 0 },
      anchor: { ...spawn },
      hearts: 3,
      time: stage.time,
      hunters,
      markers,
      rescued: 0,
      seals: 0,
      paused: false,
      finished: false,
      elapsed: 0,
      stormClock: 0,
      rivalClock: 0,
      shrinkClock: 0,
      rivalMarks: [],
    };
    $("leave").hidden = true;
    $("tutorial").hidden = true;
    $("result").hidden = true;
    $("battleLive").hidden = false;
    $("battleLive").inert = false;
    showScreen("battle");
    redrawLand();
    updateBattleHud(true);
    $("feedback").textContent = "";
    lastTime = performance.now();
    stopLoop();
    lifecycleSuspended = document.hidden || !windowFocused;
    run.paused = lifecycleSuspended;
    if (!lifecycleSuspended) raf = requestAnimationFrame(frame);
    window.WonderSound?.play?.("start");
    if (!save.tutorialSeen) requestAnimationFrame(() => openTutorial(false));
  }

  function stopLoop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  function resumeLoop() {
    if (!run || run.finished || run.paused || raf || document.hidden || !windowFocused) return;
    lastTime = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function suspendForLifecycle() {
    if (currentScreen !== "battle" || !run || run.finished) return;
    lifecycleSuspended = true;
    run.paused = true;
    run.player.dx = 0;
    run.player.dy = 0;
    stopLoop();
  }

  function resumeFromLifecycle() {
    if (!lifecycleSuspended || document.hidden || !windowFocused) return;
    lifecycleSuspended = false;
    if (currentScreen !== "battle" || !run || run.finished || activeModal()) return;
    run.paused = false;
    resumeLoop();
  }

  function reclaimVisibleForeground(event) {
    if (!event?.isTrusted || document.hidden) return false;
    if (windowFocused) return true;
    windowFocused = true;
    resumeFromLifecycle();
    return true;
  }

  window.addEventListener("blur", () => {
    windowFocused = false;
    suspendForLifecycle();
  });
  window.addEventListener("focus", () => {
    windowFocused = true;
    resumeFromLifecycle();
  });
  window.addEventListener("pagehide", suspendForLifecycle);
  window.addEventListener("pageshow", resumeFromLifecycle);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) suspendForLifecycle();
    else resumeFromLifecycle();
  });
  $("battle").addEventListener("pointerdown", reclaimVisibleForeground, true);
  $("battle").addEventListener("keydown", reclaimVisibleForeground, true);

  function updateBattleHud(force = false) {
    if (!run) return;
    const restored = Math.round(territoryPercent());
    const key = `${run.hearts}|${Math.ceil(run.time)}|${restored}|${locale}|${run.rescued}|${run.seals}`;
    if (!force && key === lastHud) return;
    lastHud = key;
    $("missionLabel").textContent = `${t(chapters[run.stage.chapter])} · ${run.stage.n}/30`;
    $("progressValue").textContent = `${restored}%`;
    $("heartsValue").textContent = "♥".repeat(run.hearts);
    $("timeValue").textContent = Math.max(0, Math.ceil(run.time));
    $("objective").textContent = objectiveFor(run.stage);
    $("missionTwist").textContent = describeStage(run.stage);
  }

  function redrawLand() {
    if (!run) return;
    const size = landCanvas.width / GRID;
    landCtx.clearRect(0, 0, landCanvas.width, landCanvas.height);
    landCtx.fillStyle = "#25cba6a6";
    for (let index = 0; index < TOTAL; index += 1) {
      if (!run.owned[index]) continue;
      const { x, y } = pointFor(index);
      landCtx.fillRect(x * size, y * size, size + 0.5, size + 0.5);
    }
  }

  function checkMarkers() {
    const seals = run.markers.filter((marker) => marker.type === "seal");
    for (const marker of run.markers) {
      if (marker.done || !run.owned[indexFor(marker.x, marker.y)]) continue;
      if (marker.type === "seal") {
        if (seals.find((candidate) => !candidate.done) !== marker) continue;
        marker.done = true;
        run.seals += 1;
      } else {
        marker.done = true;
        run.rescued += 1;
      }
    }
  }

  function enclosedFill() {
    const blocked = new Uint8Array(TOTAL);
    for (let index = 0; index < TOTAL; index += 1) {
      blocked[index] = run.blocked[index] || run.owned[index] || run.trail.has(index) ? 1 : 0;
    }
    const seen = new Uint8Array(TOTAL);
    const components = [];
    for (let start = 0; start < TOTAL; start += 1) {
      if (blocked[start] || seen[start]) continue;
      const queue = [start];
      const items = [];
      let touchesEdge = false;
      seen[start] = 1;
      for (let cursor = 0; cursor < queue.length; cursor += 1) {
        const index = queue[cursor];
        const { x, y } = pointFor(index);
        items.push(index);
        if (x === 0 || y === 0 || x === GRID - 1 || y === GRID - 1) touchesEdge = true;
        for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
          if (nx < 0 || ny < 0 || nx >= GRID || ny >= GRID) continue;
          const next = ny * GRID + nx;
          if (!blocked[next] && !seen[next]) {
            seen[next] = 1;
            queue.push(next);
          }
        }
      }
      components.push({ items, touchesEdge });
    }
    let filled = 0;
    for (const component of components) {
      if (component.touchesEdge) continue;
      for (const index of component.items) {
        if (!run.owned[index] && !run.blocked[index]) {
          run.owned[index] = 1;
          filled += 1;
        }
      }
    }
    for (const index of run.trail) {
      if (!run.owned[index] && !run.blocked[index]) {
        run.owned[index] = 1;
        filled += 1;
      }
    }
    run.trail.clear();
    run.anchor = { x: run.player.x, y: run.player.y };
    checkMarkers();
    redrawLand();
    $("feedback").textContent = t("loopClosed");
    window.WonderSound?.play?.("success");
    return filled;
  }

  function cutTrail() {
    if (!run || !run.trail.size || run.finished) return false;
    run.hearts -= 1;
    run.trail.clear();
    run.player.x = run.anchor.x;
    run.player.y = run.anchor.y;
    run.player.dx = 0;
    run.player.dy = 0;
    $("feedback").textContent = t("trailCut");
    window.WonderSound?.play?.("wrong");
    if (run.hearts <= 0) finish(false);
    return true;
  }

  function erodeRivalClaim() {
    const candidates = [];
    for (let index = 0; index < TOTAL; index += 1) {
      if (!run.owned[index]) continue;
      const { x, y } = pointFor(index);
      if ((x - 24) ** 2 + (y - 24) ** 2 > 18 && Math.hypot(x - run.player.x, y - run.player.y) > 3 && Math.hypot(x - run.anchor.x, y - run.anchor.y) > 2) candidates.push(index);
    }
    run.rivalMarks = [];
    for (let count = 0; count < Math.min(18, candidates.length); count += 1) {
      const slot = Math.floor(Math.random() * candidates.length);
      const index = candidates.splice(slot, 1)[0];
      run.owned[index] = 0;
      run.rivalMarks.push(index);
    }
    redrawLand();
  }

  function shrinkSanctuary() {
    const candidates = [];
    for (let index = 0; index < TOTAL; index += 1) {
      if (!run.owned[index]) continue;
      const { x, y } = pointFor(index);
      if (Math.hypot(x - run.player.x, y - run.player.y) < 3.2 || Math.hypot(x - run.anchor.x, y - run.anchor.y) < 2.2) continue;
      const edge = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]].some(([nx, ny]) => nx < 0 || ny < 0 || nx >= GRID || ny >= GRID || !run.owned[ny * GRID + nx]);
      if (edge) candidates.push(index);
    }
    const amount = Math.min(10 + run.stage.chapter, candidates.length);
    run.rivalMarks = [];
    for (let count = 0; count < amount; count += 1) {
      const slot = (Math.floor(run.elapsed * 13) + count * 17) % candidates.length;
      const index = candidates.splice(slot, 1)[0];
      if (index === undefined) break;
      run.owned[index] = 0;
      run.rivalMarks.push(index);
    }
    redrawLand();
    $("feedback").textContent = t("borderShrunk");
  }

  function update(dt) {
    if (!run || run.paused || run.finished) return;
    run.time -= dt;
    run.elapsed += dt;
    run.stormClock += dt;
    run.rivalClock += dt;
    run.shrinkClock += dt;
    if (run.time <= 0) {
      run.time = 0;
      finish(false);
      return;
    }
    const player = run.player;
    const speed = 7.1 + run.stage.chapter * 0.12;
    if (player.dx || player.dy) {
      const nextX = Math.max(0.6, Math.min(GRID - 0.6, player.x + player.dx * speed * dt));
      const nextY = Math.max(0.6, Math.min(GRID - 0.6, player.y + player.dy * speed * dt));
      if (run.blocked[indexFor(nextX, nextY)]) {
        player.dx = 0;
        player.dy = 0;
        $("feedback").textContent = t("barrierHit");
      } else {
        player.x = nextX;
        player.y = nextY;
      }
      const index = indexFor(player.x, player.y);
      const inside = Boolean(run.owned[index]);
      if (!inside) run.trail.add(index);
      else if (run.trail.size > 1) enclosedFill();
    }

    if (run.stage.storm && run.stormClock > (run.stage.stormEvery || 3.4)) {
      run.stormClock = 0;
      const turn = Math.sin(run.elapsed * 1.7) >= 0 ? 0.22 : -0.22;
      const dx = player.dx + turn;
      const dy = player.dy - turn;
      const length = Math.hypot(dx, dy) || 1;
      player.dx = dx / length;
      player.dy = dy / length;
    }

    const patrolPoints = [{ x: 5, y: 5 }, { x: 43, y: 5 }, { x: 43, y: 43 }, { x: 5, y: 43 }];
    for (const hunter of run.hunters) {
      hunter.abilityClock += dt;
      hunter.burst = hunter.type === "runner" && run.trail.size && hunter.abilityClock % 3.4 < 0.78;
      let target = patrolPoints[hunter.patrolStep];
      let targetingTrail = false;
      if (hunter.type === "sentry" && hunter.markerIndex >= 0 && run.markers[hunter.markerIndex] && !run.markers[hunter.markerIndex].done) {
        const marker = run.markers[hunter.markerIndex];
        const orbit = run.elapsed * 0.72 + hunter.markerIndex * Math.PI;
        target = { x: marker.x + Math.cos(orbit) * 5, y: marker.y + Math.sin(orbit) * 5 };
      }
      if (run.trail.size) {
        let nearest = null;
        let best = Infinity;
        for (const index of run.trail) {
          const point = pointFor(index);
          if (hunter.type === "sentry" && hunter.markerIndex >= 0) {
            const marker = run.markers[hunter.markerIndex];
            if (marker && Math.hypot(point.x - marker.x, point.y - marker.y) > 13) continue;
          }
          const distance = (point.x - hunter.x) ** 2 + (point.y - hunter.y) ** 2;
          if (distance < best) {
            nearest = point;
            best = distance;
          }
        }
        if (nearest) {
          target = nearest;
          targetingTrail = true;
        }
      } else if (Math.hypot(hunter.x - target.x, hunter.y - target.y) < 1) {
        hunter.patrolStep = (hunter.patrolStep + 1) % patrolPoints.length;
        target = patrolPoints[hunter.patrolStep];
      }
      const dx = target.x - hunter.x;
      const dy = target.y - hunter.y;
      const length = Math.hypot(dx, dy) || 1;
      const moveSpeed = hunter.speed * (hunter.burst ? 1.85 : 1);
      hunter.x += dx / length * moveSpeed * dt;
      hunter.y += dy / length * moveSpeed * dt;
      hunter.angle = Math.atan2(dy, dx);
      if (targetingTrail && Math.hypot(hunter.x - target.x, hunter.y - target.y) < hunter.cutRadius) {
        cutTrail();
        break;
      }
    }

    if (run.stage.rival && run.rivalClock > (run.stage.rivalEvery || 6.2)) {
      run.rivalClock = 0;
      erodeRivalClaim();
    }
    if (run.stage.shrink && run.shrinkClock > (run.stage.shrinkEvery || 8)) {
      run.shrinkClock = 0;
      shrinkSanctuary();
    }

    if (
      territoryPercent() >= run.stage.target
      && run.rescued >= run.stage.rescue
      && run.seals >= run.stage.seals
    ) finish(true);
    updateBattleHud();
  }

  function drawImageCentered(image, x, y, size, rotation = 0, glow = "") {
    if (!image?.complete || !image.naturalWidth) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    if (glow) {
      ctx.shadowColor = glow;
      ctx.shadowBlur = Math.max(10, size * 0.42);
    }
    const ratio = image.naturalWidth / image.naturalHeight || 1;
    const drawWidth = ratio >= 1 ? size : size * ratio;
    const drawHeight = ratio >= 1 ? size / ratio : size;
    ctx.drawImage(image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();
  }

  function draw() {
    if (!run) return;
    const width = canvas.width;
    const height = canvas.height;
    const size = width / GRID;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(landCanvas, 0, 0);

    if (run.blocked.some(Boolean)) {
      ctx.fillStyle = "rgba(18,12,38,.86)";
      ctx.strokeStyle = "rgba(162,122,255,.72)";
      ctx.lineWidth = Math.max(1, size * 0.14);
      for (let index = 0; index < TOTAL; index += 1) {
        if (!run.blocked[index]) continue;
        const point = pointFor(index);
        ctx.fillRect(point.x * size, point.y * size, size + 0.4, size + 0.4);
        if ((point.x + point.y) % 2 === 0) ctx.strokeRect(point.x * size + size * 0.15, point.y * size + size * 0.15, size * 0.7, size * 0.7);
      }
    }

    if (run.stage.storm) {
      ctx.fillStyle = "rgba(67,205,255,.12)";
      const offset = (performance.now() / 40) % 120;
      for (let x = -120; x < width + 120; x += 120) ctx.fillRect(x + offset, 0, 24, height);
    }
    if (run.rivalMarks.length) {
      ctx.fillStyle = "rgba(255,74,107,.32)";
      for (const index of run.rivalMarks) {
        const point = pointFor(index);
        ctx.fillRect(point.x * size, point.y * size, size, size);
      }
    }

    const colors = styleData[save.selectedStyle].colors;
    if (run.trail.size) {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = colors[0];
      ctx.shadowColor = colors[1];
      ctx.shadowBlur = 18;
      ctx.lineWidth = 11;
      ctx.beginPath();
      let first = true;
      for (const index of run.trail) {
        const point = pointFor(index);
        const x = (point.x + 0.5) * size;
        const y = (point.y + 0.5) * size;
        if (first) {
          ctx.moveTo(x, y);
          first = false;
        } else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    const seals = run.markers.filter((marker) => marker.type === "seal");
    for (const marker of run.markers) {
      if (marker.done) continue;
      const active = marker.type !== "seal" || seals.find((candidate) => !candidate.done) === marker;
      ctx.globalAlpha = active ? 1 : 0.42;
      drawImageCentered(
        marker.type === "seal" ? images.seal : images.beacon,
        marker.x * size,
        marker.y * size,
        3.1 * size,
      );
      ctx.globalAlpha = 1;
      if (marker.type === "seal") {
        ctx.fillStyle = "#fff";
        ctx.font = `900 ${Math.max(12, size)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText(String(seals.indexOf(marker) + 1), marker.x * size, (marker.y + 0.4) * size);
      }
    }

    for (const hunter of run.hunters) {
      if (hunter.burst) {
        ctx.strokeStyle = "#76f6ff";
        ctx.lineWidth = Math.max(2, size * 0.22);
        ctx.beginPath();
        ctx.arc(hunter.x * size, hunter.y * size, hunter.size * size * 0.62, 0, Math.PI * 2);
        ctx.stroke();
      }
      drawImageCentered(
        images[hunter.imageKey],
        hunter.x * size,
        hunter.y * size,
        hunter.size * size,
        hunter.angle + Math.PI / 2,
        hunter.guardian ? "#ff4b7d" : hunter.type === "runner" ? "#36d8ff" : hunter.type === "tank" ? "#ffb85c" : hunter.type === "sentry" ? "#ffe36c" : "#9d62ff",
      );
    }
    drawImageCentered(
      images.player,
      run.player.x * size,
      run.player.y * size,
      4.4 * size,
      Math.atan2(run.player.dy, run.player.dx) + Math.PI / 2,
      "#64f9df",
    );
  }

  function frame(now) {
    raf = 0;
    if (!run || run.finished || run.paused || document.hidden || !windowFocused) return;
    const dt = Math.min(0.04, (now - lastTime) / 1000 || 0);
    lastTime = now;
    update(dt);
    draw();
    if (!run.finished && !run.paused) raf = requestAnimationFrame(frame);
  }

  function setDirection(dx, dy) {
    if (!run || run.paused || run.finished) return;
    const length = Math.hypot(dx, dy) || 1;
    run.player.dx = dx / length;
    run.player.dy = dy / length;
  }

  function pointDirection(event) {
    if (!run) return;
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width * GRID;
    const y = (event.clientY - rect.top) / rect.height * GRID;
    setDirection(x - run.player.x, y - run.player.y);
  }

  canvas.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    canvas.focus({ preventScroll: true });
    canvas.setPointerCapture?.(event.pointerId);
    pointDirection(event);
  });
  canvas.addEventListener("pointermove", (event) => {
    if (event.buttons || event.pointerType === "touch") pointDirection(event);
  });
  const keyDirections = {
    ArrowUp: [0, -1], w: [0, -1], W: [0, -1],
    ArrowDown: [0, 1], s: [0, 1], S: [0, 1],
    ArrowLeft: [-1, 0], a: [-1, 0], A: [-1, 0],
    ArrowRight: [1, 0], d: [1, 0], D: [1, 0],
  };
  window.addEventListener("keydown", (event) => {
    if (keyDirections[event.key] && currentScreen === "battle" && !activeModal()) {
      event.preventDefault();
      setDirection(...keyDirections[event.key]);
    }
    if (event.key === "Escape" && !event.defaultPrevented && currentScreen === "battle" && !activeModal()) openLeave();
  });
  const dirs = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  document.querySelectorAll("[data-dir]").forEach((button) => {
    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      setDirection(...dirs[button.dataset.dir]);
    });
  });

  let modalReturnFocus = null;
  function activeModal() {
    return [$("leave"), $("tutorial"), $("result")].find((modal) => !modal.hidden) || null;
  }

  function modalButtons(modal) {
    return [...modal.querySelectorAll("button:not([hidden]):not(:disabled)")];
  }

  function openModal(modal, focusTarget) {
    modalReturnFocus = document.activeElement;
    if (run) run.paused = true;
    stopLoop();
    modal.hidden = false;
    $("battleLive").inert = true;
    requestAnimationFrame(() => (focusTarget || modalButtons(modal)[0])?.focus());
  }

  function closeModal(modal, restoreFocus = true) {
    modal.hidden = true;
    $("battleLive").inert = false;
    if (run && !run.finished && !lifecycleSuspended) {
      run.paused = false;
      resumeLoop();
    }
    if (restoreFocus) (modalReturnFocus?.isConnected ? modalReturnFocus : $("battleBack"))?.focus();
    modalReturnFocus = null;
  }

  document.addEventListener("keydown", (event) => {
    const modal = activeModal();
    if (!modal) return;
    if (event.key === "Tab") {
      const buttons = modalButtons(modal);
      if (!buttons.length) return;
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    if (event.key === "Escape" && modal === $("leave")) {
      event.preventDefault();
      closeModal(modal);
    }
  });

  function openTutorial(markSeenOnClose = true) {
    if (!run || run.finished) return;
    $("tutorial").dataset.markSeen = markSeenOnClose ? "true" : "false";
    openModal($("tutorial"), $("tutorialDone"));
  }

  function closeTutorial() {
    save.tutorialSeen = true;
    persist();
    closeModal($("tutorial"), true);
  }

  function openLeave() {
    if (!run || run.finished || activeModal()) return;
    openModal($("leave"), $("continueBattle"));
  }

  function finish(won) {
    if (!run || run.finished) return;
    run.finished = true;
    run.paused = true;
    resultDecisionCommitted = false;
    for (const action of [$("retry"), $("resultStage"), $("nextMission")]) action.disabled = false;
    stopLoop();
    const restored = Math.round(territoryPercent());
    const remaining = Math.max(0, Math.ceil(run.time));
    const stars = won ? 1 + (remaining > run.stage.time * 0.25 ? 1 : 0) + (run.hearts === 3 ? 1 : 0) : 0;
    if (won) {
      save.stars[run.stage.n] = Math.max(Number(save.stars[run.stage.n]) || 0, stars);
      save.unlocked = Math.max(save.unlocked, Math.min(30, run.stage.n + 1));
      persist();
    }
    $("resultKicker").textContent = won ? `${t("restored")} ${restored}%` : t("missionFailedKicker");
    $("resultTitle").textContent = t(won ? "missionComplete" : "missionFailed");
    $("resultText").textContent = objectiveFor(run.stage);
    $("resultStats").innerHTML = `<span><b>${t("restored")}</b><strong>${restored}%</strong></span><span><b>${t("rescued")}</b><strong>${run.rescued + run.seals}</strong></span><span><b>${t("stars")}</b><strong>${"★".repeat(stars)}${"☆".repeat(3 - stars)}</strong></span>`;
    $("nextMission").hidden = false;
    $("nextMission").disabled = !won || run.stage.n >= 30;
    const primaryAction = $("nextMission").disabled ? $("resultStage") : $("nextMission");
    for (const action of [$("retry"), $("resultStage"), $("nextMission")]) action.classList.toggle("primary", action === primaryAction);
    $("result").hidden = false;
    $("battleLive").hidden = true;
    $("battleLive").inert = true;
    requestAnimationFrame(() => primaryAction.focus());
    window.WonderSound?.play?.(won ? "success" : "wrong");
  }

  function commitResultDecision(action) {
    if (resultDecisionCommitted || $("result").hidden) return false;
    resultDecisionCommitted = true;
    for (const button of [$("retry"), $("resultStage"), $("nextMission")]) button.disabled = true;
    action();
    return true;
  }

  $("battleBack").addEventListener("click", openLeave);
  $("battleHelp").addEventListener("click", () => openTutorial(true));
  $("tutorialDone").addEventListener("click", closeTutorial);
  $("continueBattle").addEventListener("click", () => closeModal($("leave")));
  $("leaveStage").addEventListener("click", () => {
    $("leave").hidden = true;
    $("battleLive").inert = false;
    run = null;
    showScreen("stage");
  });
  $("retry").addEventListener("click", () => commitResultDecision(() => startBattle(run.stageIndex)));
  $("resultStage").addEventListener("click", () => commitResultDecision(() => {
    $("result").hidden = true;
    $("battleLive").inert = false;
    run = null;
    showScreen("stage");
  }));
  $("nextMission").addEventListener("click", () => commitResultDecision(() => startBattle(Math.min(29, run.stageIndex + 1))));

  function loadImages() {
    return Promise.all(Object.entries(imageSources).map(([key, src]) => new Promise((resolve) => {
      const image = new Image();
      images[key] = image;
      image.onload = image.onerror = resolve;
      image.src = src;
    })));
  }

  Promise.all([loadImages(), new Promise((resolve) => setTimeout(resolve, 350))]).then(() => {
    $("loadingFill").style.width = "100%";
    setTimeout(() => {
      $("loadingPanel").hidden = true;
      showScreen("main", false);
    }, 160);
  });

  applyLocale();

  window.__animalSanctuaryLoopTest = {
    stages,
    startBattle,
    setDirection,
    advance(seconds, step = 1 / 60) {
      const iterations = Math.ceil(seconds / step);
      for (let index = 0; index < iterations && run && !run.finished; index += 1) update(step);
      draw();
    },
    cutTrail,
    finish,
    setTime(seconds) { if (run) run.time = Number(seconds); },
    setHunterOnTrail() {
      if (!run?.trail.size) return false;
      const target = pointFor([...run.trail][0]);
      Object.assign(run.hunters[0], target);
      return true;
    },
    parkHunters() {
      if (!run) return;
      run.hunters.forEach((hunter, index) => {
        hunter.x = index % 2 ? 1 : GRID - 1;
        hunter.y = index % 2 ? GRID - 1 : 1;
        hunter.speed = 0;
      });
    },
    grantProgress(unlocked = 3) {
      save.unlocked = Math.max(1, Math.min(30, unlocked));
      persist();
      renderStage();
    },
    resetSave() {
      save = defaultSave();
      persist();
      applyLocale();
    },
    snapshot() {
      return {
        locale,
        screen: currentScreen,
        windowFocused,
        lifecycleSuspended,
        rafActive: Boolean(raf),
        save: JSON.parse(JSON.stringify(save)),
        run: run && {
          stageIndex: run.stageIndex,
          stage: { ...run.stage, enemies: [...run.stage.enemies] },
          hearts: run.hearts,
          time: run.time,
          elapsed: run.elapsed,
          rescued: run.rescued,
          seals: run.seals,
          trail: [...run.trail],
          restored: territoryCount(),
          blocked: Array.from(run.blocked).reduce((sum, value) => sum + value, 0),
          playerOwned: Boolean(run.owned[indexFor(run.player.x, run.player.y)]),
          markers: run.markers.map((marker) => ({ ...marker, blocked: Boolean(run.blocked[indexFor(marker.x, marker.y)]), owned: Boolean(run.owned[indexFor(marker.x, marker.y)]) })),
          player: { ...run.player },
          hunters: run.hunters.map((hunter) => ({ ...hunter })),
          paused: run.paused,
          finished: run.finished,
        },
      };
    },
  };
}());
