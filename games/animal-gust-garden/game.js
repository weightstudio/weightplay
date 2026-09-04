(function () {
  "use strict";
  const COPY = window.GUST_GARDEN_LOCALES || {};
  const LOCALE_NAMES = window.GUST_GARDEN_LOCALE_NAMES || {};
  const DIRECTIONS = { up: { x: 0, y: -1 }, right: { x: 1, y: 0 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 } };
  const STAGES = [
    { name: "stage1", width: 5, height: 4, seeds: [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 4, y: 3 }], flowers: [{ x: 0, y: 2 }, { x: 4, y: 0 }, { x: 2, y: 3 }], thorns: [{ x: 1, y: 1 }, { x: 3, y: 2 }] },
    { name: "stage2", width: 5, height: 4, seeds: [{ x: 0, y: 3 }, { x: 4, y: 0 }, { x: 1, y: 2 }], flowers: [{ x: 0, y: 1 }, { x: 4, y: 2 }, { x: 1, y: 0 }], thorns: [{ x: 1, y: 3 }, { x: 3, y: 1 }, { x: 2, y: 2 }] },
    { name: "stage3", width: 5, height: 4, seeds: [{ x: 0, y: 1 }, { x: 4, y: 2 }, { x: 2, y: 3 }], flowers: [{ x: 3, y: 1 }, { x: 4, y: 0 }, { x: 2, y: 1 }], thorns: [{ x: 1, y: 2 }, { x: 3, y: 2 }, { x: 1, y: 0 }] }
  ];
  const $ = (id) => document.getElementById(id);
  const routeLocaleMap = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const routeSegment = location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
  const routeLocale = routeLocaleMap[routeSegment] || (COPY[document.documentElement.lang] ? document.documentElement.lang : "");
  const savedLocale = localStorage.getItem("weightplay-animal-gust-garden-locale");
  let locale = COPY[routeLocale] ? routeLocale : (COPY[savedLocale] ? savedLocale : "en");
  let sound = localStorage.getItem("weightplay-animal-gust-garden-sound") !== "off";
  let stageIndex = 0; let stageState = null; let selectedSeed = null; let selectedDirection = null; let solved = new Set(); let lastChecks = 0;
  const copy = (key, vars = {}) => {
    const dictionary = COPY[locale] || COPY.en;
    let value = dictionary[key] || COPY.en[key] || key;
    Object.entries(vars).forEach(([name, replacement]) => { value = value.replaceAll(`{${name}}`, String(replacement)); });
    return value;
  };
  const directionCopy = (direction) => ((COPY[locale] || COPY.en).directions || COPY.en.directions)[direction];
  function announce(name, data = {}) { window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: `gust_garden_${name}`, game_id: "animal-gust-garden", game_version: "v5", interface_version: 6, stage: stageIndex + 1, ...data }); }
  function best() { const value = Number(localStorage.getItem("weightplay-animal-gust-garden-best-v1") || 0); return value > 0 ? value : null; }
  function show(screen) { document.querySelectorAll("[data-screen]").forEach((node) => { node.hidden = node.dataset.screen !== screen; }); const guide = document.querySelector("[data-wp-game-guide]"); if (guide) guide.hidden = screen !== "main"; $("settingsPanel").hidden = true; document.body.dataset.wpActiveScreen = screen; window.scrollTo(0, 0); }
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
    const root = $("stageList"); root.replaceChildren();
    STAGES.forEach((stage, index) => { const button = document.createElement("button"); button.type = "button"; button.className = "stage-card"; button.dataset.wpEnterBattle = "true"; button.innerHTML = `<span><strong>${stageName(index)}</strong><small>${solved.has(index) ? copy("finished") : copy("stageHint")}</small></span><span class="stage-mark">${solved.has(index) ? "✓" : "→"}</span>`; button.addEventListener("click", () => startStage(index)); root.appendChild(button); });
  }
  function cloneStage(index) { const source = STAGES[index]; return { ...source, seeds: source.seeds.map((seed) => ({ ...seed, locked: false })) }; }
  function startStage(index) { stageIndex = index; stageState = cloneStage(index); selectedSeed = 0; selectedDirection = null; lastChecks = 0; show("battle"); announce("start"); renderBattle(); }
  function cellKey(x, y) { return `${x}:${y}`; }
  function findAt(list, x, y) { return list.find((item) => item.x === x && item.y === y); }
  function renderBattle() {
    if (!stageState) return; $("stageTitle").textContent = stageName(stageIndex); const progressPill = $("progressPill"); if (progressPill) progressPill.textContent = `${stageIndex + 1} / ${STAGES.length}`; $("prompt").textContent = selectedSeed === null ? copy("prompt") : (selectedDirection ? `${copy("selected")} ${directionCopy(selectedDirection)}` : copy("selected")); $("status").textContent = copy("status", { locked: stageState.seeds.filter((seed) => seed.locked).length, total: stageState.seeds.length });
    const root = $("grid"); root.replaceChildren(); root.style.setProperty("--grid-columns", stageState.width); let primaryActionMarked = false;
    const thornSet = new Set(stageState.thorns.map((thorn) => cellKey(thorn.x, thorn.y)));
    for (let y = 0; y < stageState.height; y += 1) for (let x = 0; x < stageState.width; x += 1) {
      const cell = document.createElement("button"); cell.type = "button"; cell.className = "grid-cell"; cell.setAttribute("role", "gridcell"); const seedIndex = stageState.seeds.findIndex((seed) => seed.x === x && seed.y === y); const flower = findAt(stageState.flowers, x, y); const thorn = thornSet.has(cellKey(x, y));
      if (thorn) { cell.classList.add("thorn", "asset", "asset-thorn"); cell.textContent = ""; cell.setAttribute("aria-label", copy("thorn")); }
      else if (seedIndex >= 0) { const seed = stageState.seeds[seedIndex]; const flowerIndex = stageState.flowers.findIndex((item) => item.x === x && item.y === y); cell.classList.add("seed", seed.locked ? "locked" : "selectable", "asset", seed.locked ? `asset-flower-${Math.max(0, flowerIndex) % 2 + 1}` : `asset-seed-${(seedIndex % 3) + 1}`); if (flower) cell.classList.add("flower-target"); cell.dataset.seedIndex = String(seedIndex); if (!seed.locked && !primaryActionMarked) { cell.dataset.wpPrimaryAction = "true"; primaryActionMarked = true; } cell.textContent = ""; cell.setAttribute("aria-label", `${copy("seed")} ${seedIndex + 1}${seed.locked ? `, ${copy("flower")}` : ""}`); cell.setAttribute("aria-pressed", String(selectedSeed === seedIndex)); cell.addEventListener("click", () => { if (!seed.locked) { selectedSeed = seedIndex; selectedDirection = null; announce("select", { seed: seedIndex + 1 }); renderBattle(); } }); }
      else if (flower) { const flowerIndex = stageState.flowers.findIndex((item) => item.x === x && item.y === y); cell.classList.add("flower", "asset", `asset-flower-${flowerIndex % 2 + 1}`); cell.textContent = ""; cell.setAttribute("aria-label", copy("flower")); }
      else { cell.classList.add("open"); cell.textContent = "·"; cell.setAttribute("aria-label", copy("empty")); }
      root.appendChild(cell);
    }
    const directionsRoot = $("directionButtons"); directionsRoot.replaceChildren(); Object.keys(DIRECTIONS).forEach((direction) => { const button = document.createElement("button"); button.type = "button"; button.className = "direction-button"; button.dataset.direction = direction; button.textContent = { up: "↑", right: "→", down: "↓", left: "←" }[direction]; button.setAttribute("aria-label", directionCopy(direction)); button.setAttribute("aria-pressed", String(selectedDirection === direction)); button.addEventListener("click", () => { if (selectedSeed !== null && !stageState.seeds[selectedSeed].locked) { selectedDirection = direction; announce("direction", { direction }); renderBattle(); } }); directionsRoot.appendChild(button); });
    $("gustButton").disabled = selectedSeed === null || selectedDirection === null || stageState.seeds[selectedSeed].locked;
  }
  function fail(message, eventName = "blocked") { $("status").textContent = message; $("status").className = "status warn"; announce(eventName); }
  function sendGust() {
    if (selectedSeed === null) { fail(copy("noSeed"), "no_seed"); return; } if (!selectedDirection) { fail(copy("noDirection"), "no_direction"); return; }
    const seed = stageState.seeds[selectedSeed]; const delta = DIRECTIONS[selectedDirection]; const next = { x: seed.x + delta.x, y: seed.y + delta.y }; lastChecks += 1;
    if (next.x < 0 || next.x >= stageState.width || next.y < 0 || next.y >= stageState.height) { fail(copy("outside")); return; }
    if (findAt(stageState.thorns, next.x, next.y)) { fail(copy("blocked")); return; }
    if (stageState.seeds.some((other, index) => index !== selectedSeed && !other.locked && other.x === next.x && other.y === next.y)) { fail(copy("occupied"), "occupied"); return; }
    seed.x = next.x; seed.y = next.y; selectedDirection = null; const flower = findAt(stageState.flowers, seed.x, seed.y); if (flower) { seed.locked = true; announce("bloom", { seed: selectedSeed + 1, checks: lastChecks }); $("status").textContent = copy("bloomed"); } else { announce("move", { seed: selectedSeed + 1, checks: lastChecks }); $("status").textContent = copy("moved"); }
    if (stageState.seeds.every((item) => item.locked)) { solved.add(stageIndex); const oldBest = best(); if (!oldBest || lastChecks < oldBest) localStorage.setItem("weightplay-animal-gust-garden-best-v1", String(lastChecks)); show("result"); renderResult(); announce("complete", { checks: lastChecks }); } else { const nextSeed = stageState.seeds.findIndex((item) => !item.locked); selectedSeed = nextSeed >= 0 ? nextSeed : null; renderBattle(); }
  }
  function renderResult() { const resultText = $("resultText"); if (resultText) resultText.textContent = copy("resultText", { name: stageName(stageIndex), checks: lastChecks }); const nextButton = $("nextButton"); if (nextButton) { nextButton.disabled = stageIndex >= STAGES.length - 1; nextButton.hidden = stageIndex >= STAGES.length - 1; } }
  function openStage() { show("stage"); renderStages(); }
  function bind() { $("startButton").addEventListener("click", openStage); $("chooseButton").addEventListener("click", openStage); $("mapButton").addEventListener("click", openStage); $("nextButton").addEventListener("click", () => startStage(stageIndex + 1)); $("gustButton").addEventListener("click", sendGust); $("resetButton").addEventListener("click", () => { stageState = cloneStage(stageIndex); selectedSeed = 0; selectedDirection = null; lastChecks = 0; announce("reset"); renderBattle(); }); $("stageBackButton").addEventListener("click", () => { show("main"); renderMain(); }); $("battleBackButton").addEventListener("click", openStage); $("settingsButton").addEventListener("click", () => { $("settingsPanel").hidden = false; }); $("stageSettingsButton").addEventListener("click", () => { $("settingsPanel").hidden = false; }); $("battleSettingsButton").addEventListener("click", () => { $("settingsPanel").hidden = false; }); $("closeSettings").addEventListener("click", () => { $("settingsPanel").hidden = true; }); $("soundButton").addEventListener("click", () => { sound = !sound; localStorage.setItem("weightplay-animal-gust-garden-sound", sound ? "on" : "off"); applyCopy(); }); $("localeSelect").addEventListener("change", (event) => { locale = COPY[event.target.value] ? event.target.value : "en"; localStorage.setItem("weightplay-animal-gust-garden-locale", locale); applyCopy(); }); }
  function boot() { bind(); $("loading").hidden = true; $("app").hidden = false; show("main"); applyCopy(); announce("loaded"); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
}());
