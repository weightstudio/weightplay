(function () {
  "use strict";
  const COPY = window.GUST_GARDEN_LOCALES || {};
  const LOCALE_NAMES = window.GUST_GARDEN_LOCALE_NAMES || {};
  const DIRECTIONS = { up: { x: 0, y: -1 }, right: { x: 1, y: 0 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 } };
  const plot = (number, arc, seeds, flowers, thorns, rules = {}) => ({
    name: `stage${number}`, number, arc, width: 5, height: 4,
    seeds, flowers, thorns, ...rules,
  });
  // Six authored arcs of five plots.  The layouts stay deterministic, while
  // drafts, one-way gates, paired portals, and ordered checkpoints change the
  // player's route decisions instead of merely increasing a number.
  const STAGES = [
    plot(1, "Meadow Wake", [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 4, y: 3 }], [{ x: 0, y: 2 }, { x: 4, y: 0 }, { x: 2, y: 3 }], [{ x: 1, y: 1 }, { x: 3, y: 2 }]),
    plot(2, "Meadow Wake", [{ x: 0, y: 3 }, { x: 4, y: 0 }, { x: 1, y: 2 }], [{ x: 0, y: 1 }, { x: 4, y: 2 }, { x: 1, y: 0 }], [{ x: 1, y: 3 }, { x: 3, y: 1 }, { x: 2, y: 2 }]),
    plot(3, "Meadow Wake", [{ x: 0, y: 1 }, { x: 4, y: 2 }, { x: 2, y: 3 }], [{ x: 3, y: 1 }, { x: 4, y: 0 }, { x: 2, y: 1 }], [{ x: 1, y: 2 }, { x: 3, y: 2 }, { x: 1, y: 0 }]),
    plot(4, "Meadow Wake", [{ x: 1, y: 0 }, { x: 3, y: 3 }, { x: 4, y: 1 }], [{ x: 1, y: 1 }, { x: 3, y: 2 }, { x: 4, y: 2 }], [{ x: 0, y: 2 }, { x: 2, y: 1 }]),
    plot(5, "Meadow Wake", [{ x: 0, y: 0 }, { x: 4, y: 3 }, { x: 2, y: 0 }], [{ x: 0, y: 1 }, { x: 4, y: 2 }, { x: 2, y: 1 }], [{ x: 1, y: 2 }, { x: 3, y: 1 }], { checkpoint: "First Bloom Check", bloomOrder: [1, 2, 0] }),

    plot(6, "Crosswind Crossing", [{ x: 0, y: 0 }, { x: 4, y: 3 }, { x: 1, y: 3 }], [{ x: 2, y: 0 }, { x: 4, y: 2 }, { x: 1, y: 2 }], [{ x: 2, y: 2 }], { drafts: [{ x: 1, y: 0, direction: "right" }] }),
    plot(7, "Crosswind Crossing", [{ x: 0, y: 3 }, { x: 4, y: 0 }, { x: 3, y: 3 }], [{ x: 0, y: 1 }, { x: 2, y: 0 }, { x: 3, y: 1 }], [{ x: 1, y: 2 }], { drafts: [{ x: 0, y: 2, direction: "up" }] }),
    plot(8, "Crosswind Crossing", [{ x: 1, y: 0 }, { x: 4, y: 3 }, { x: 0, y: 2 }], [{ x: 3, y: 0 }, { x: 4, y: 1 }, { x: 0, y: 1 }], [{ x: 2, y: 2 }, { x: 1, y: 2 }], { drafts: [{ x: 2, y: 0, direction: "right" }] }),
    plot(9, "Crosswind Crossing", [{ x: 0, y: 0 }, { x: 3, y: 3 }, { x: 4, y: 1 }], [{ x: 0, y: 3 }, { x: 3, y: 1 }, { x: 4, y: 3 }], [{ x: 1, y: 1 }, { x: 2, y: 2 }], { drafts: [{ x: 3, y: 2, direction: "up" }, { x: 4, y: 2, direction: "down" }] }),
    plot(10, "Crosswind Crossing", [{ x: 0, y: 0 }, { x: 4, y: 3 }, { x: 2, y: 3 }], [{ x: 0, y: 2 }, { x: 4, y: 1 }, { x: 2, y: 1 }], [{ x: 1, y: 2 }, { x: 3, y: 2 }], { checkpoint: "Gale Gate Check", bloomOrder: [2, 0, 1], gates: [{ x: 0, y: 1, direction: "down" }, { x: 4, y: 2, direction: "up" }] }),

    plot(11, "Lantern Portals", [{ x: 0, y: 0 }, { x: 4, y: 3 }, { x: 1, y: 3 }], [{ x: 3, y: 3 }, { x: 4, y: 2 }, { x: 1, y: 2 }], [{ x: 2, y: 1 }], { portals: [{ x: 1, y: 0, toX: 3, toY: 3 }] }),
    plot(12, "Lantern Portals", [{ x: 4, y: 0 }, { x: 0, y: 3 }, { x: 2, y: 0 }], [{ x: 1, y: 3 }, { x: 0, y: 2 }, { x: 2, y: 1 }], [{ x: 3, y: 1 }], { portals: [{ x: 3, y: 0, toX: 1, toY: 3 }] }),
    plot(13, "Lantern Portals", [{ x: 0, y: 1 }, { x: 4, y: 2 }, { x: 2, y: 3 }], [{ x: 2, y: 1 }, { x: 4, y: 0 }, { x: 2, y: 2 }], [{ x: 1, y: 2 }], { portals: [{ x: 1, y: 1, toX: 2, toY: 1 }] }),
    plot(14, "Lantern Portals", [{ x: 1, y: 3 }, { x: 3, y: 0 }, { x: 0, y: 2 }], [{ x: 1, y: 0 }, { x: 3, y: 3 }, { x: 0, y: 1 }], [{ x: 2, y: 2 }], { portals: [{ x: 1, y: 2, toX: 3, toY: 3 }] }),
    plot(15, "Lantern Portals", [{ x: 0, y: 0 }, { x: 4, y: 3 }, { x: 2, y: 0 }], [{ x: 2, y: 3 }, { x: 4, y: 2 }, { x: 2, y: 1 }], [{ x: 1, y: 2 }, { x: 3, y: 1 }], { checkpoint: "Portal Parade Check", bloomOrder: [1, 0, 2], portals: [{ x: 1, y: 0, toX: 2, toY: 3 }] }),

    plot(16, "Thornwork Tangle", [{ x: 0, y: 0 }, { x: 4, y: 3 }, { x: 0, y: 3 }], [{ x: 0, y: 2 }, { x: 4, y: 1 }, { x: 2, y: 3 }], [{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 1 }], { gates: [{ x: 0, y: 1, direction: "down" }] }),
    plot(17, "Thornwork Tangle", [{ x: 4, y: 0 }, { x: 0, y: 3 }, { x: 3, y: 3 }], [{ x: 4, y: 2 }, { x: 0, y: 1 }, { x: 3, y: 1 }], [{ x: 2, y: 1 }, { x: 1, y: 2 }, { x: 3, y: 2 }], { gates: [{ x: 4, y: 1, direction: "down" }] }),
    plot(18, "Thornwork Tangle", [{ x: 0, y: 1 }, { x: 4, y: 2 }, { x: 2, y: 0 }], [{ x: 2, y: 1 }, { x: 4, y: 0 }, { x: 2, y: 2 }], [{ x: 1, y: 1 }, { x: 3, y: 1 }, { x: 2, y: 3 }], { drafts: [{ x: 1, y: 0, direction: "right" }], gates: [{ x: 3, y: 0, direction: "left" }] }),
    plot(19, "Thornwork Tangle", [{ x: 1, y: 0 }, { x: 3, y: 3 }, { x: 0, y: 2 }], [{ x: 1, y: 2 }, { x: 3, y: 1 }, { x: 0, y: 1 }], [{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 4, y: 1 }], { portals: [{ x: 0, y: 3, toX: 3, toY: 1 }] }),
    plot(20, "Thornwork Tangle", [{ x: 0, y: 0 }, { x: 4, y: 3 }, { x: 2, y: 3 }], [{ x: 2, y: 0 }, { x: 4, y: 1 }, { x: 2, y: 1 }], [{ x: 1, y: 2 }, { x: 3, y: 2 }], { checkpoint: "Thornwork Trial", bloomOrder: [2, 1, 0], drafts: [{ x: 1, y: 0, direction: "right" }], gates: [{ x: 4, y: 2, direction: "up" }] }),

    plot(21, "Moonseed Routes", [{ x: 0, y: 3 }, { x: 4, y: 0 }, { x: 1, y: 1 }], [{ x: 2, y: 3 }, { x: 4, y: 2 }, { x: 1, y: 3 }], [{ x: 2, y: 1 }], { drafts: [{ x: 1, y: 3, direction: "right" }] }),
    plot(22, "Moonseed Routes", [{ x: 0, y: 0 }, { x: 4, y: 3 }, { x: 3, y: 1 }], [{ x: 0, y: 2 }, { x: 2, y: 3 }, { x: 3, y: 3 }], [{ x: 1, y: 1 }], { portals: [{ x: 4, y: 1, toX: 2, toY: 3 }] }),
    plot(23, "Moonseed Routes", [{ x: 1, y: 3 }, { x: 3, y: 0 }, { x: 0, y: 1 }], [{ x: 1, y: 0 }, { x: 3, y: 2 }, { x: 0, y: 3 }], [{ x: 2, y: 1 }, { x: 2, y: 2 }], { gates: [{ x: 3, y: 1, direction: "down" }] }),
    plot(24, "Moonseed Routes", [{ x: 0, y: 2 }, { x: 4, y: 1 }, { x: 2, y: 3 }], [{ x: 0, y: 0 }, { x: 4, y: 3 }, { x: 2, y: 1 }], [{ x: 1, y: 2 }, { x: 3, y: 2 }], { drafts: [{ x: 0, y: 1, direction: "up" }], portals: [{ x: 3, y: 1, toX: 2, toY: 1 }] }),
    plot(25, "Moonseed Routes", [{ x: 0, y: 0 }, { x: 4, y: 3 }, { x: 2, y: 0 }], [{ x: 2, y: 0 }, { x: 4, y: 2 }, { x: 2, y: 2 }], [{ x: 1, y: 2 }, { x: 3, y: 1 }], { checkpoint: "Moonlit Mastery Check", bloomOrder: [0, 2, 1], gates: [{ x: 4, y: 2, direction: "up" }], portals: [{ x: 1, y: 0, toX: 2, toY: 0 }] }),

    plot(26, "Full Canopy", [{ x: 0, y: 3 }, { x: 4, y: 0 }, { x: 1, y: 1 }], [{ x: 2, y: 3 }, { x: 4, y: 2 }, { x: 1, y: 3 }], [{ x: 2, y: 1 }, { x: 3, y: 1 }], { drafts: [{ x: 1, y: 3, direction: "right" }], gates: [{ x: 4, y: 1, direction: "down" }] }),
    plot(27, "Full Canopy", [{ x: 0, y: 0 }, { x: 4, y: 3 }, { x: 3, y: 0 }], [{ x: 2, y: 0 }, { x: 4, y: 1 }, { x: 3, y: 3 }], [{ x: 1, y: 2 }, { x: 2, y: 2 }], { drafts: [{ x: 1, y: 0, direction: "right" }], portals: [{ x: 3, y: 1, toX: 3, toY: 3 }] }),
    plot(28, "Full Canopy", [{ x: 1, y: 3 }, { x: 3, y: 0 }, { x: 0, y: 2 }], [{ x: 1, y: 0 }, { x: 3, y: 2 }, { x: 0, y: 0 }], [{ x: 2, y: 1 }, { x: 1, y: 2 }], { gates: [{ x: 3, y: 1, direction: "down" }], portals: [{ x: 0, y: 1, toX: 3, toY: 2 }] }),
    plot(29, "Full Canopy", [{ x: 0, y: 1 }, { x: 4, y: 2 }, { x: 2, y: 3 }], [{ x: 2, y: 1 }, { x: 4, y: 0 }, { x: 2, y: 2 }], [{ x: 1, y: 2 }, { x: 3, y: 2 }], { drafts: [{ x: 1, y: 1, direction: "right" }], portals: [{ x: 3, y: 1, toX: 4, toY: 0 }] }),
    plot(30, "Full Canopy", [{ x: 0, y: 0 }, { x: 4, y: 3 }, { x: 2, y: 0 }], [{ x: 2, y: 0 }, { x: 4, y: 2 }, { x: 2, y: 2 }], [{ x: 1, y: 2 }, { x: 3, y: 1 }], { checkpoint: "The Great Garden Finale", bloomOrder: [1, 2, 0], drafts: [{ x: 1, y: 0, direction: "right" }], gates: [{ x: 4, y: 2, direction: "up" }], portals: [{ x: 1, y: 1, toX: 2, toY: 2 }] }),
  ];
  const $ = (id) => document.getElementById(id);
  const routeLocaleMap = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const routeSegment = location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
  const routeLocale = routeLocaleMap[routeSegment] || (COPY[document.documentElement.lang] ? document.documentElement.lang : "");
  const savedLocale = localStorage.getItem("weightplay-animal-gust-garden-locale");
  let locale = COPY[routeLocale] ? routeLocale : (COPY[savedLocale] ? savedLocale : "en");
  let sound = localStorage.getItem("weightplay-animal-gust-garden-sound") !== "off";
  const PROGRESS_KEY = "weightplay-animal-gust-garden-progress-v2";
  const loadSolved = () => {
    try {
      const value = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "[]");
      return new Set((Array.isArray(value) ? value : value.cleared || []).map(Number).filter((index) => Number.isInteger(index) && index >= 0 && index < STAGES.length));
    } catch { return new Set(); }
  };
  const persistSolved = () => localStorage.setItem(PROGRESS_KEY, JSON.stringify([...solved].sort((a, b) => a - b)));
  const highestUnlocked = () => {
    let index = 0;
    while (index < STAGES.length - 1 && solved.has(index)) index += 1;
    return index;
  };
  let stageIndex = 0; let stageState = null; let selectedSeed = null; let selectedDirection = null; let solved = loadSolved(); let lastChecks = 0;
  const copy = (key, vars = {}) => {
    const dictionary = COPY[locale] || COPY.en;
    let value = dictionary[key] || COPY.en[key] || key;
    Object.entries(vars).forEach(([name, replacement]) => { value = value.replaceAll(`{${name}}`, String(replacement)); });
    return value;
  };
  const directionCopy = (direction) => ((COPY[locale] || COPY.en).directions || COPY.en.directions)[direction];
  function announce(name, data = {}) { window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: `gust_garden_${name}`, game_id: "animal-gust-garden", game_version: "v13", interface_version: 6, stage: stageIndex + 1, ...data }); }
  function best() { const value = Number(localStorage.getItem("weightplay-animal-gust-garden-best-v1") || 0); return value > 0 ? value : null; }
  function show(screen) { document.querySelectorAll("[data-screen]").forEach((node) => { node.hidden = node.dataset.screen !== screen; }); const guide = document.querySelector("[data-wp-game-guide], .game-page-info.game-page-info-static"); if (guide) guide.hidden = screen !== "main"; $("settingsPanel").hidden = true; document.body.dataset.wpActiveScreen = screen; window.dispatchEvent(new CustomEvent("weightplay:shell-sync")); window.scrollTo(0, 0); }
  // Interface 7 supplies one shared Settings owner. Keep the authored local
  // buttons only as inert compatibility bindings so Main, Stage, and Battle
  // never expose duplicate controls or let a hidden title intercept input.
  function installInterfaceCompatibility() {
    if (document.getElementById("gustGardenInterfaceCompatibility")) return;
    const style = document.createElement("style");
    style.id = "gustGardenInterfaceCompatibility";
    style.textContent = `
      @layer wp-frame-contract {
        #mainScreen #gustGardenLegacySettingsButton,
        #stageScreen #gustGardenLegacyStageSettingsButton,
        #battleScreen #gustGardenLegacyBattleSettingsButton { display: none !important; }
      }
    `;
    const legacy = [
      ["settingsButton", "gustGardenLegacySettingsButton"],
      ["stageSettingsButton", "gustGardenLegacyStageSettingsButton"],
      ["battleSettingsButton", "gustGardenLegacyBattleSettingsButton"],
    ];
    legacy.forEach(([id, replacement]) => {
      const button = $(id);
      if (!button) return;
      button.id = replacement;
      button.classList.remove("wp-shell-settings-button");
      button.removeAttribute("data-wp-settings");
      button.hidden = true;
      button.setAttribute("aria-hidden", "true");
      button.tabIndex = -1;
    });
    const close = $("closeSettings");
    if (close) close.id = "gustGardenLegacyCloseSettings";
    (document.body || document.head).append(style);
    watchSharedSettings();
  }
  function ensureSharedSettingsButton() {
    const button = document.querySelector(".wp-shell-settings-button");
    if (!button) return false;
    button.id = "settingsButton";
    button.hidden = false;
    button.removeAttribute("aria-hidden");
    button.tabIndex = 0;
    button.style.setProperty("display", "grid", "important");
    button.style.setProperty("width", "48px", "important");
    button.style.setProperty("height", "48px", "important");
    const host = button.closest(".wp-shell-settings");
    const popover = host?.querySelector(".wp-shell-settings-popover");
    if (popover && !popover.querySelector("#closeSettings")) {
      const close = document.createElement("button");
      close.id = "closeSettings";
      close.type = "button";
      close.className = "close-button";
      close.setAttribute("aria-label", "Close");
      close.textContent = "×";
      close.addEventListener("click", () => {
        popover.hidden = true;
        button.setAttribute("aria-expanded", "false");
        button.focus({ preventScroll: true });
      });
      popover.prepend(close);
    }
    return true;
  }
  function watchSharedSettings() {
    if (ensureSharedSettingsButton()) return;
    const root = document.body || document.documentElement;
    if (!root) return;
    const observer = new MutationObserver(() => {
      if (ensureSharedSettingsButton()) observer.disconnect();
    });
    observer.observe(root, { childList: true, subtree: true });
    window.setTimeout(() => { if (ensureSharedSettingsButton()) observer.disconnect(); }, 2000);
  }
  function stageName(index) { return copy("stage", { number: index + 1 }); }
  function applyCopy() {
    document.documentElement.lang = locale; document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = copy(node.dataset.i18n); });
    document.querySelectorAll("[data-i18n-aria]").forEach((node) => { node.setAttribute("aria-label", copy(node.dataset.i18nAria)); });
    document.querySelectorAll("[data-i18n-alt]").forEach((node) => { node.alt = copy(node.dataset.i18nAlt); });
    $("localeSelect").value = locale; [...$("localeSelect").options].forEach((option) => { option.textContent = LOCALE_NAMES[option.value] || option.value; }); $("soundButton").textContent = sound ? copy("on") : copy("off"); $("soundButton").setAttribute("aria-pressed", String(sound));
    renderMain(); renderStages(); renderBattle(); renderResult();
  }
  function renderMain() { $("mainProgress").textContent = copy("progress", { done: solved.size, total: STAGES.length }); const value = best(); $("bestText").textContent = value ? copy("best", { count: value }) : copy("noBest"); }
  function renderStages() {
    const root = $("stageList"); root.replaceChildren(); const unlocked = highestUnlocked();
    STAGES.forEach((stage, index) => { const button = document.createElement("button"); const isUnlocked = index <= unlocked; button.type = "button"; button.className = "stage-card"; button.dataset.wpEnterBattle = "true"; button.dataset.stageIndex = String(index + 1); button.disabled = !isUnlocked; button.setAttribute("aria-disabled", String(!isUnlocked)); button.innerHTML = `<span><strong>${stageName(index)}</strong><small>${!isUnlocked ? copy("locked") : (stage.checkpoint ? `${stage.checkpoint} · ` : "") + (solved.has(index) ? copy("finished") : copy("stageHint"))}</small></span><span class="stage-mark">${!isUnlocked ? "🔒" : (solved.has(index) ? "✓" : "→")}</span>`; button.addEventListener("click", () => startStage(index)); root.appendChild(button); });
    const focus = root.querySelector(`[data-stage-index="${unlocked + 1}"]`); if (focus) window.setTimeout(() => focus.scrollIntoView({ block: "center", inline: "nearest" }), 0);
  }
  function cloneStage(index) { const source = STAGES[index]; return { ...source, seeds: source.seeds.map((seed) => ({ ...seed, locked: false })), drafts: (source.drafts || []).map((item) => ({ ...item })), gates: (source.gates || []).map((item) => ({ ...item })), portals: (source.portals || []).map((item) => ({ ...item })) }; }
  function startStage(index) { if (index > highestUnlocked()) { announce("locked", { requestedStage: index + 1 }); return; } stageIndex = index; stageState = cloneStage(index); selectedSeed = 0; selectedDirection = null; lastChecks = 0; show("battle"); announce("start"); renderBattle(); }
  function cellKey(x, y) { return `${x}:${y}`; }
  function findAt(list, x, y) { return list.find((item) => item.x === x && item.y === y); }
  function renderBattle() {
    if (!stageState) return; $("stageTitle").textContent = stageName(stageIndex); const progressPill = $("progressPill"); if (progressPill) progressPill.textContent = `${stageIndex + 1} / ${STAGES.length}`; $("prompt").textContent = selectedSeed === null ? copy("prompt") : (selectedDirection ? `${copy("selected")} ${directionCopy(selectedDirection)}` : copy("selected")); $("status").textContent = copy("status", { locked: stageState.seeds.filter((seed) => seed.locked).length, total: stageState.seeds.length });
    const root = $("grid"); root.replaceChildren(); root.style.setProperty("--grid-columns", stageState.width); let primaryActionMarked = false;
    const thornSet = new Set(stageState.thorns.map((thorn) => cellKey(thorn.x, thorn.y)));
    for (let y = 0; y < stageState.height; y += 1) for (let x = 0; x < stageState.width; x += 1) {
      const cell = document.createElement("button"); cell.type = "button"; cell.className = "grid-cell"; cell.setAttribute("role", "gridcell"); const seedIndex = stageState.seeds.findIndex((seed) => seed.x === x && seed.y === y); const flower = findAt(stageState.flowers, x, y); const thorn = thornSet.has(cellKey(x, y)); const draft = findAt(stageState.drafts || [], x, y); const gate = findAt(stageState.gates || [], x, y); const portal = findAt(stageState.portals || [], x, y);
      if (thorn) { cell.classList.add("thorn", "asset", "asset-thorn"); cell.textContent = ""; cell.setAttribute("aria-label", copy("thorn")); }
      else if (seedIndex >= 0) { const seed = stageState.seeds[seedIndex]; const flowerIndex = stageState.flowers.findIndex((item) => item.x === x && item.y === y); cell.classList.add("seed", seed.locked ? "locked" : "selectable", "asset", seed.locked ? `asset-flower-${Math.max(0, flowerIndex) % 2 + 1}` : `asset-seed-${(seedIndex % 3) + 1}`); if (flower) cell.classList.add("flower-target"); cell.dataset.seedIndex = String(seedIndex); if (!seed.locked && !primaryActionMarked) { cell.dataset.wpPrimaryAction = "true"; primaryActionMarked = true; } cell.textContent = ""; cell.setAttribute("aria-label", `${copy("seed")} ${seedIndex + 1}${seed.locked ? `, ${copy("flower")}` : ""}`); cell.setAttribute("aria-pressed", String(selectedSeed === seedIndex)); cell.addEventListener("click", () => { if (!seed.locked) { selectedSeed = seedIndex; selectedDirection = null; announce("select", { seed: seedIndex + 1 }); renderBattle(); } }); }
      else if (flower) { const flowerIndex = stageState.flowers.findIndex((item) => item.x === x && item.y === y); cell.classList.add("flower", "asset", `asset-flower-${flowerIndex % 2 + 1}`); cell.textContent = ""; cell.setAttribute("aria-label", copy("flower")); }
      else if (portal) { cell.classList.add("portal"); cell.textContent = "◎"; cell.setAttribute("aria-label", copy("portal")); }
      else if (gate) { cell.classList.add("gate"); cell.textContent = "⇥"; cell.setAttribute("aria-label", `${copy("gate")} ${directionCopy(gate.direction)}`); }
      else if (draft) { cell.classList.add("draft"); cell.textContent = "➜"; cell.setAttribute("aria-label", `${copy("draft")} ${directionCopy(draft.direction)}`); }
      else { cell.classList.add("open"); cell.textContent = "·"; cell.setAttribute("aria-label", copy("empty")); }
      root.appendChild(cell);
    }
    const directionsRoot = $("directionButtons"); directionsRoot.replaceChildren(); Object.keys(DIRECTIONS).forEach((direction) => { const button = document.createElement("button"); button.type = "button"; button.className = "direction-button"; button.dataset.direction = direction; button.textContent = { up: "↑", right: "→", down: "↓", left: "←" }[direction]; button.setAttribute("aria-label", directionCopy(direction)); button.setAttribute("aria-pressed", String(selectedDirection === direction)); button.addEventListener("click", () => { if (selectedSeed !== null && !stageState.seeds[selectedSeed].locked) { selectedDirection = direction; announce("direction", { direction }); renderBattle(); } }); directionsRoot.appendChild(button); });
    $("gustButton").disabled = selectedSeed === null || selectedDirection === null || stageState.seeds[selectedSeed].locked;
  }
  function fail(message, eventName = "blocked") { $("status").textContent = message; $("status").className = "status warn"; announce(eventName); }
  function sendGust() {
    if (selectedSeed === null) { fail(copy("noSeed"), "no_seed"); return; } if (!selectedDirection) { fail(copy("noDirection"), "no_direction"); return; }
    const seed = stageState.seeds[selectedSeed]; const delta = DIRECTIONS[selectedDirection]; const draft = findAt(stageState.drafts || [], seed.x + delta.x, seed.y + delta.y); const steps = draft && draft.direction === selectedDirection ? 2 : 1; const gate = findAt(stageState.gates || [], seed.x + delta.x, seed.y + delta.y); if (gate && gate.direction !== selectedDirection) { fail(copy("gateBlocked"), "gate_blocked"); return; }
    let next = { x: seed.x, y: seed.y };
    for (let step = 0; step < steps; step += 1) { next = { x: next.x + delta.x, y: next.y + delta.y }; if (next.x < 0 || next.x >= stageState.width || next.y < 0 || next.y >= stageState.height) { fail(copy("outside")); return; } if (findAt(stageState.thorns, next.x, next.y)) { fail(copy("blocked")); return; } if (stageState.seeds.some((other, index) => index !== selectedSeed && !other.locked && other.x === next.x && other.y === next.y)) { fail(copy("occupied"), "occupied"); return; } }
    const directFlower = findAt(stageState.flowers, next.x, next.y); const order = stageState.bloomOrder || []; if (directFlower && order.length && order[stageState.seeds.filter((item) => item.locked).length] !== selectedSeed) { fail(copy("order"), "order_blocked"); return; }
    seed.x = next.x; seed.y = next.y; const portal = findAt(stageState.portals || [], seed.x, seed.y); if (portal) { seed.x = portal.toX; seed.y = portal.toY; announce("portal", { seed: selectedSeed + 1 }); }
    lastChecks += steps; selectedDirection = null; const flower = findAt(stageState.flowers, seed.x, seed.y); if (flower) { seed.locked = true; announce("bloom", { seed: selectedSeed + 1, checks: lastChecks }); $("status").textContent = copy("bloomed"); } else { announce("move", { seed: selectedSeed + 1, checks: lastChecks }); $("status").textContent = copy("moved"); }
    if (stageState.seeds.every((item) => item.locked)) { solved.add(stageIndex); persistSolved(); const oldBest = best(); if (!oldBest || lastChecks < oldBest) localStorage.setItem("weightplay-animal-gust-garden-best-v1", String(lastChecks)); show("result"); renderResult(); announce("complete", { checks: lastChecks, checkpoint: stageState.checkpoint || null }); } else { selectedSeed = stageState.seeds[selectedSeed]?.locked ? stageState.seeds.findIndex((item) => !item.locked) : selectedSeed; renderBattle(); }
  }
  function renderResult() { const resultText = $("resultText"); if (resultText) resultText.textContent = copy("resultText", { name: stageName(stageIndex), checks: lastChecks }); const nextButton = $("nextButton"); if (nextButton) { const hasNextUnlocked = stageIndex < highestUnlocked(); nextButton.disabled = !hasNextUnlocked; nextButton.hidden = !hasNextUnlocked; } }
  function openStage() { show("stage"); renderStages(); }
  function bind() { $("startButton").addEventListener("click", openStage); $("chooseButton").addEventListener("click", openStage); $("mapButton").addEventListener("click", openStage); $("nextButton").addEventListener("click", () => startStage(stageIndex + 1)); $("gustButton").addEventListener("click", sendGust); $("resetButton").addEventListener("click", () => { stageState = cloneStage(stageIndex); selectedSeed = 0; selectedDirection = null; lastChecks = 0; announce("reset"); renderBattle(); }); $("stageBackButton").addEventListener("click", () => { show("main"); renderMain(); }); $("battleBackButton").addEventListener("click", openStage); $("settingsButton").addEventListener("click", () => { $("settingsPanel").hidden = false; }); $("stageSettingsButton").addEventListener("click", () => { $("settingsPanel").hidden = false; }); $("battleSettingsButton").addEventListener("click", () => { $("settingsPanel").hidden = false; }); $("closeSettings").addEventListener("click", () => { $("settingsPanel").hidden = true; }); $("soundButton").addEventListener("click", () => { sound = !sound; localStorage.setItem("weightplay-animal-gust-garden-sound", sound ? "on" : "off"); applyCopy(); }); $("localeSelect").addEventListener("change", (event) => { locale = COPY[event.target.value] ? event.target.value : "en"; localStorage.setItem("weightplay-animal-gust-garden-locale", locale); applyCopy(); }); }
  function boot() { bind(); installInterfaceCompatibility(); $("loading").hidden = true; $("app").hidden = false; show("main"); applyCopy(); ensureSharedSettingsButton(); announce("loaded"); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
}());
