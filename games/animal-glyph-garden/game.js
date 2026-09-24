(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const locales = window.GLYPH_GARDEN_LOCALES || {};
  const localeMap = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const GAME_VERSION = "v4";
  const shapes = ["circle", "triangle", "square", "star", "diamond", "heart"];
  const colors = ["blue", "gold", "violet", "green", "coral", "amber"];
  const stageBlueprints = [
    ["circle", "blue", ["both"]], ["triangle", "gold", ["both"]], ["square", "violet", ["both"]], ["star", "green", ["both"]], ["diamond", "coral", ["both", "both"]],
    ["heart", "amber", ["shape"]], ["star", "blue", ["shape"]], ["diamond", "gold", ["shape"]], ["circle", "violet", ["shape"]], ["square", "green", ["shape", "shape"]],
    ["triangle", "coral", ["color"]], ["heart", "blue", ["color"]], ["diamond", "violet", ["color"]], ["star", "amber", ["color"]], ["circle", "gold", ["color", "color"]],
    ["square", "coral", ["both", "both"]], ["triangle", "green", ["both", "both"]], ["heart", "violet", ["both", "both"]], ["diamond", "amber", ["both", "both"]], ["star", "gold", ["both", "both", "both"]],
    ["circle", "green", ["shape", "color"]], ["square", "blue", ["color", "shape"]], ["heart", "coral", ["shape", "color"]], ["triangle", "violet", ["color", "shape"]], ["diamond", "green", ["both", "shape", "color"]],
    ["star", "coral", ["shape", "both", "color"]], ["heart", "gold", ["color", "both", "shape"]], ["circle", "amber", ["both", "color", "shape"]], ["square", "gold", ["shape", "color", "both"]], ["triangle", "blue", ["both", "shape", "color", "both"]],
  ];
  const makeTarget = (shape, color, offset) => ({ shape: shapes[(shapes.indexOf(shape) + offset * 2) % shapes.length], color: colors[(colors.indexOf(color) + offset * 3) % colors.length] });
  const makeOptions = (target, stageIndex, stepIndex) => {
    const options = [target];
    for (let offset = 1; options.length < 6; offset += 1) {
      const item = { shape: shapes[(shapes.indexOf(target.shape) + offset + stageIndex) % shapes.length], color: colors[(colors.indexOf(target.color) + offset + stageIndex + stepIndex) % colors.length] };
      if (!options.some((candidate) => candidate.shape === item.shape && candidate.color === item.color)) options.push(item);
    }
    const rotation = (stageIndex * 2 + stepIndex) % options.length;
    return options.slice(rotation).concat(options.slice(0, rotation));
  };
  const plots = stageBlueprints.map(([shape, color, modes], stageIndex) => {
    const targets = modes.map((mode, stepIndex) => ({ ...makeTarget(shape, color, stepIndex), mode }));
    return { arc: Math.floor(stageIndex / 5) + 1, targets, options: targets.map((target, stepIndex) => makeOptions(target, stageIndex, stepIndex)) };
  });
  const safeStorage = { get(key, fallback = "") { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } }, set(key, value) { try { localStorage.setItem(key, value); } catch {} } };
  const queryLocale = new URLSearchParams(location.search).get("route-locale");
  const pathLocale = location.pathname.split("/").filter(Boolean).map((value) => localeMap[value] || "").find(Boolean);
  const routeLocale = queryLocale && locales[queryLocale] ? queryLocale : pathLocale && locales[pathLocale] ? pathLocale : "";
  let locale = routeLocale || safeStorage.get("weightPlayLocale", "");
  if (!locales[locale]) locale = "en";
  let sound = !window.WeightPlayAudio.isMuted();
  let plotIndex = 0;
  let selected = null;
  let stepIndex = 0;
  let unlocked = Math.max(1, Math.min(plots.length, Number(safeStorage.get("weightplay-glyph-garden-unlocked-v4", "1")) || 1));
  let solvedValues = [];
  try { solvedValues = JSON.parse(safeStorage.get("weightplay-glyph-garden-solved-v4", "[]") || "[]"); } catch { solvedValues = []; }
  let solved = new Set((Array.isArray(solvedValues) ? solvedValues : []).filter((value) => Number.isInteger(value) && value >= 0 && value < plots.length));
  let checks = 0;
  try {
    window.WeightPlayGameRuntimeLocalizer = window.WeightPlayGameRuntimeLocalizer || {};
    if (Object.isExtensible(window.WeightPlayGameRuntimeLocalizer)) window.WeightPlayGameRuntimeLocalizer["animal-glyph-garden"] = { locales };
  } catch {}

  const copy = (key, vars = {}) => Object.entries(vars).reduce((out, [name, value]) => out.replaceAll(`{${name}}`, String(value)), (locales[locale] || locales.en)[key] || locales.en[key] || key);
  const label = (item) => `${copy(item.shape)} · ${copy(item.color)}`;
  const playSound = (id) => window.WeightPlayAudio.play(id);
  const announce = (name, data = {}) => { window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: `glyph_garden_${name}`, plot: plotIndex + 1, ...data }); };
  const bestText = () => safeStorage.get("weightplay-glyph-garden-best-v4", "—") || "—";
  const stageName = (index) => {
    const names = (locales[locale] || locales.en).stageNames;
    return Array.isArray(names) && names[index] ? names[index] : copy("stageLabel", { number: index + 1 });
  };
  const stageHint = (index) => {
    const plot = plots[index];
    return `${copy(`arc${plot.arc}`)} · ${plot.targets.map((target) => copy(`rule${target.mode[0].toUpperCase()}${target.mode.slice(1)}`)).join(" → ")}`;
  };
  function applyLocale() {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.body.dataset.locale = locale;
    document.querySelectorAll("[data-glyph-i18n]").forEach((node) => { node.textContent = copy(node.dataset.glyphI18n); });
    $("backBtn")?.setAttribute("aria-label", copy("back")); $("settingsButton")?.setAttribute("aria-label", copy("settings")); $("closeSettings")?.setAttribute("aria-label", copy("close")); $("localeSelect")?.setAttribute("aria-label", copy("language"));
    if ($("soundButton")) { $("soundButton").textContent = sound ? copy("on") : copy("off"); $("soundButton").setAttribute("aria-pressed", String(sound)); }
    if ($("mainProgress")) $("mainProgress").textContent = copy("campaignProgress", { unlocked, cleared: solved.size, total: plots.length, best: bestText() });
    renderStages(); renderBattle(); renderResult();
  }
  function setScreen(screen) {
    const main = $("mainGroup"), stage = $("stageScreen"), battle = $("battleScreen");
    main.hidden = screen !== "main"; stage.hidden = screen !== "stage"; battle.hidden = !(screen === "battle" || screen === "result");
    document.body.dataset.screen = screen === "result" ? "battle" : screen;
    document.body.classList.toggle("wp-shell-main-active", screen === "main"); document.body.classList.toggle("wp-stage-select-active", screen === "stage"); document.body.classList.toggle("wp-logical-battle-active", screen === "battle" || screen === "result");
    if (screen !== "result" && $("resultScreen")) $("resultScreen").hidden = true;
    if ($("settingsPanel")) $("settingsPanel").hidden = true;
  }
  const glyphAssets = {
    circle: "assets/glyph-circle-voxel-v1.png",
    square: "assets/glyph-square-voxel-v1.png",
    triangle: "assets/glyph-triangle-voxel-v1.png",
    star: "assets/glyph-star-voxel-v1.png",
    diamond: "assets/glyph-diamond-voxel-v1.png",
    heart: "assets/glyph-heart-voxel-v1.png"
  };
  function shapeGlyph(item, extra = "") { const el = document.createElement("span"); el.className = `glyph ${item.shape} ${item.color} ${extra}`; el.setAttribute("aria-hidden", "true"); const image = document.createElement("img"); image.src = glyphAssets[item.shape]; image.alt = ""; image.draggable = false; el.append(image); return el; }
  function renderStages() {
    const root = $("stageRail"); if (!root) return; root.replaceChildren();
    plots.forEach((plot, index) => { const button = document.createElement("button"); const available = index < unlocked; button.className = "stage-card"; button.type = "button"; button.disabled = !available; button.setAttribute("role", "listitem"); button.dataset.wpStageCard = ""; button.dataset.wpEnterBattle = ""; button.dataset.index = String(index); button.innerHTML = `<span><strong>${stageName(index)}</strong><small>${available ? stageHint(index) : copy("locked")}</small></span><span class="arrow" aria-hidden="true">${solved.has(index) ? "✓" : available ? "→" : "•"}</span>`; button.addEventListener("click", () => startPlot(index)); root.appendChild(button); });
  }
  function startPlot(index) { if (index >= unlocked) return; plotIndex = index; stepIndex = 0; selected = null; checks = 0; setScreen("battle"); renderBattle(); playSound("game.start"); announce("start", { version: GAME_VERSION }); }
  function renderBattle() {
    const plot = plots[plotIndex]; if (!plot || !$("optionGrid")) return;
    const targetRule = plot.targets[stepIndex];
    $("battleTitle").textContent = stageName(plotIndex); $("progressPill").textContent = `${plotIndex + 1} / ${plots.length} · ${copy("step", { current: stepIndex + 1, total: plot.targets.length })}`; $("prompt").textContent = `${copy(`rule${targetRule.mode[0].toUpperCase()}${targetRule.mode.slice(1)}`)} — ${copy("prompt")}`;
    const requestCard = document.querySelector(".request-card"); if (requestCard && !requestCard.querySelector(".taro-guide")) { const taro = document.createElement("img"); taro.className = "taro-guide"; taro.src = "assets/taro-voxel-v1.png"; taro.alt = ""; taro.draggable = false; taro.style.cssText = "width:72px;height:72px;object-fit:contain;display:block;margin:0 auto 8px"; requestCard.prepend(taro); }
    const target = $("targetGlyph"); target.replaceChildren(shapeGlyph(targetRule)); target.setAttribute("aria-label", label(targetRule)); $("targetText").textContent = label(targetRule);
    const options = plot.options[stepIndex]; const root = $("optionGrid"); root.replaceChildren(); options.forEach((item, index) => { const button = document.createElement("button"); button.type = "button"; button.className = "option-card"; button.setAttribute("role", "listitem"); button.setAttribute("aria-selected", String(index === selected)); button.append(shapeGlyph(item)); const text = document.createElement("span"); text.textContent = label(item); button.append(text); button.addEventListener("click", () => { selected = index; renderBattle(); announce("select", { option: index + 1, step: stepIndex + 1 }); }); root.appendChild(button); });
    $("selection").textContent = selected === null ? "" : copy("selected", { name: label(options[selected]) }); $("status").textContent = ""; $("status").className = "status";
  }
  function check() { checks += 1; const plot = plots[plotIndex]; const target = plot.targets[stepIndex]; const option = selected === null ? null : plot.options[stepIndex][selected]; const correct = Boolean(option) && (target.mode === "shape" ? option.shape === target.shape : target.mode === "color" ? option.color === target.color : option.shape === target.shape && option.color === target.color); if (correct && stepIndex + 1 < plot.targets.length) { stepIndex += 1; selected = null; playSound("ui.click"); announce("step", { checks, step: stepIndex + 1 }); renderBattle(); $("status").textContent = copy("sequenceGood"); $("status").className = "status good"; return; } if (correct) { solved.add(plotIndex); unlocked = Math.max(unlocked, Math.min(plots.length, plotIndex + 2)); safeStorage.set("weightplay-glyph-garden-unlocked-v4", String(unlocked)); safeStorage.set("weightplay-glyph-garden-solved-v4", JSON.stringify([...solved].sort((a, b) => a - b))); $("status").textContent = copy("correct"); $("status").className = "status good"; announce("correct", { checks, step: stepIndex + 1 }); window.setTimeout(() => { setScreen("result"); $("resultScreen").hidden = false; renderResult(); }, 280); } else { $("status").textContent = copy("wrong"); $("status").className = "status try"; announce("wrong", { checks, step: stepIndex + 1 }); } }
  function renderResult() { if (!$("resultText")) return; const complete = solved.size === plots.length; $("resultTitle").textContent = plotIndex === plots.length - 1 && complete ? copy("campaignComplete") : copy("finished"); $("resultText").textContent = copy("resultText", { count: solved.size, total: plots.length, stage: plotIndex + 1 }); $("nextBtn").hidden = plotIndex + 1 >= plots.length; $("stagesBtn").hidden = false; $("replayBtn").hidden = false; const old = Number(safeStorage.get("weightplay-glyph-garden-best-v4", "0")); if (!old || checks < old) safeStorage.set("weightplay-glyph-garden-best-v4", String(checks)); }
  function next() { const nextIndex = plotIndex + 1; if (nextIndex < plots.length) startPlot(nextIndex); else { setScreen("stage"); renderStages(); } }
  function bind() {
    $("startBtn").addEventListener("click", () => { setScreen("stage"); renderStages(); }); $("mainProgress").textContent = copy("campaignProgress", { unlocked, cleared: solved.size, total: plots.length, best: bestText() });
    $("settingsButton").addEventListener("click", () => { $("settingsPanel").hidden = false; }); $("closeSettings").addEventListener("click", () => { $("settingsPanel").hidden = true; });
    $("soundButton").addEventListener("click", () => { sound = window.WeightPlayAudio.setEnabled(window.WeightPlayAudio.isMuted()); applyLocale(); }); $("localeSelect").addEventListener("change", (event) => { locale = event.target.value; safeStorage.set("weightPlayLocale", locale); applyLocale(); });
    $("stageBackBtn").addEventListener("click", () => setScreen("main")); $("battleBackBtn").addEventListener("click", () => setScreen("stage")); $("checkBtn").addEventListener("click", check); $("clearBtn").addEventListener("click", () => { selected = null; renderBattle(); }); $("nextBtn").addEventListener("click", next); $("stagesBtn").addEventListener("click", () => { setScreen("stage"); renderStages(); }); $("replayBtn").addEventListener("click", () => startPlot(plotIndex));
  }
  function enforceRouteLocale() {
    const requested = new URLSearchParams(location.search).get("route-locale");
    const expectedDir = requested === "ar" ? "rtl" : "ltr";
    if (requested && locales[requested] && (requested !== locale || document.documentElement.lang !== requested || document.documentElement.dir !== expectedDir)) { locale = requested; safeStorage.set("weightPlayLocale", locale); if ($("localeSelect")) $("localeSelect").value = locale; applyLocale(); }
  }
  function boot() { document.querySelectorAll("[data-i18n]").forEach((node) => { node.dataset.glyphI18n = node.dataset.i18n; node.removeAttribute("data-i18n"); }); bind(); window.addEventListener("weightplay:audio-volume-change", () => { sound = !window.WeightPlayAudio.isMuted(); applyLocale(); }); window.WeightPlayAudio.preload(["game.start", "ui.click"]); $("localeSelect").value = locale; $("loadingPanel").hidden = true; $("app")?.removeAttribute("hidden"); setScreen("main"); applyLocale(); enforceRouteLocale(); const routeRequested = new URLSearchParams(location.search).get("route-locale"); if (routeRequested && locales[routeRequested]) { let attempts = 0; const timer = window.setInterval(() => { enforceRouteLocale(); attempts += 1; if (attempts > 20) window.clearInterval(timer); }, 200); } announce("loaded"); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
}());
