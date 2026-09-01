(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const locales = window.GLYPH_GARDEN_LOCALES || {};
  const localeMap = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const plots = [
    { target: { shape: "circle", color: "blue" }, options: [{ shape: "triangle", color: "blue" }, { shape: "circle", color: "blue" }, { shape: "circle", color: "green" }, { shape: "square", color: "gold" }, { shape: "triangle", color: "coral" }, { shape: "square", color: "violet" }] },
    { target: { shape: "triangle", color: "gold" }, options: [{ shape: "square", color: "gold" }, { shape: "triangle", color: "gold" }, { shape: "circle", color: "amber" }, { shape: "triangle", color: "green" }, { shape: "circle", color: "gold" }, { shape: "square", color: "coral" }] },
    { target: { shape: "square", color: "violet" }, options: [{ shape: "square", color: "violet" }, { shape: "circle", color: "violet" }, { shape: "square", color: "blue" }, { shape: "triangle", color: "amber" }, { shape: "circle", color: "coral" }, { shape: "triangle", color: "violet" }] },
  ];
  const safeStorage = { get(key, fallback = "") { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } }, set(key, value) { try { localStorage.setItem(key, value); } catch {} } };
  const queryLocale = new URLSearchParams(location.search).get("route-locale");
  const pathLocale = location.pathname.split("/").filter(Boolean).map((value) => localeMap[value] || "").find(Boolean);
  const routeLocale = queryLocale && locales[queryLocale] ? queryLocale : pathLocale && locales[pathLocale] ? pathLocale : "";
  let locale = routeLocale || safeStorage.get("weightPlayLocale", "");
  if (!locales[locale]) locale = "en";
  let sound = safeStorage.get("weightplay-glyph-garden-sound", "on") !== "off";
  let plotIndex = 0;
  let selected = null;
  let solved = new Set();
  let checks = 0;
  try {
    window.WeightPlayGameRuntimeLocalizer = window.WeightPlayGameRuntimeLocalizer || {};
    if (Object.isExtensible(window.WeightPlayGameRuntimeLocalizer)) window.WeightPlayGameRuntimeLocalizer["animal-glyph-garden"] = { locales };
  } catch {}

  const copy = (key, vars = {}) => Object.entries(vars).reduce((out, [name, value]) => out.replaceAll(`{${name}}`, String(value)), (locales[locale] || locales.en)[key] || locales.en[key] || key);
  const label = (item) => `${copy(item.shape)} · ${copy(item.color)}`;
  const announce = (name, data = {}) => { window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: `glyph_garden_${name}`, plot: plotIndex + 1, ...data }); };
  const bestText = () => safeStorage.get("weightplay-glyph-garden-best-v2", "—") || "—";
  function applyLocale() {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.body.dataset.locale = locale;
    document.querySelectorAll("[data-glyph-i18n]").forEach((node) => { node.textContent = copy(node.dataset.glyphI18n); });
    $("backBtn")?.setAttribute("aria-label", copy("back")); $("settingsButton")?.setAttribute("aria-label", copy("settings")); $("closeSettings")?.setAttribute("aria-label", copy("close")); $("localeSelect")?.setAttribute("aria-label", copy("language"));
    if ($("soundButton")) { $("soundButton").textContent = sound ? copy("on") : copy("off"); $("soundButton").setAttribute("aria-pressed", String(sound)); }
    if ($("mainProgress")) $("mainProgress").textContent = copy("best", { count: bestText() });
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
  function shapeGlyph(item, extra = "") { const el = document.createElement("span"); el.className = `glyph ${item.shape} ${item.color} ${extra}`; el.setAttribute("aria-hidden", "true"); return el; }
  function renderStages() {
    const root = $("stageRail"); if (!root) return; root.replaceChildren();
    plots.forEach((plot, index) => { const button = document.createElement("button"); button.className = "stage-card"; button.type = "button"; button.setAttribute("role", "listitem"); button.dataset.wpStageCard = ""; button.dataset.wpEnterBattle = ""; button.dataset.index = String(index); button.innerHTML = `<span><strong>${copy(`plot${index + 1}`)}</strong><small>${copy(`hint${index + 1}`)}</small></span><span class="arrow" aria-hidden="true">${solved.has(index) ? "✓" : "→"}</span>`; button.addEventListener("click", () => startPlot(index)); root.appendChild(button); });
  }
  function startPlot(index) { plotIndex = index; selected = null; checks = 0; setScreen("battle"); renderBattle(); announce("start"); }
  function renderBattle() {
    const plot = plots[plotIndex]; if (!plot || !$("optionGrid")) return;
    $("battleTitle").textContent = copy(`plot${plotIndex + 1}`); $("progressPill").textContent = `${plotIndex + 1} / ${plots.length}`; $("prompt").textContent = `${copy(`hint${plotIndex + 1}`)} — ${copy("prompt")}`;
    const target = $("targetGlyph"); target.replaceChildren(shapeGlyph(plot.target)); target.setAttribute("aria-label", label(plot.target)); $("targetText").textContent = label(plot.target);
    const root = $("optionGrid"); root.replaceChildren(); plot.options.forEach((item, index) => { const button = document.createElement("button"); button.type = "button"; button.className = "option-card"; button.setAttribute("role", "listitem"); button.setAttribute("aria-selected", String(index === selected)); button.append(shapeGlyph(item)); const text = document.createElement("span"); text.textContent = label(item); button.append(text); button.addEventListener("click", () => { selected = index; renderBattle(); announce("select", { option: index + 1 }); }); root.appendChild(button); });
    $("selection").textContent = selected === null ? "" : copy("selected", { name: label(plot.options[selected]) }); $("status").textContent = ""; $("status").className = "status";
  }
  function check() { checks += 1; const plot = plots[plotIndex]; const correct = selected !== null && plot.options[selected].shape === plot.target.shape && plot.options[selected].color === plot.target.color; if (correct) { solved.add(plotIndex); $("status").textContent = copy("correct"); $("status").className = "status good"; announce("correct", { checks }); window.setTimeout(() => { setScreen("result"); $("resultScreen").hidden = false; renderResult(); }, 280); } else { $("status").textContent = copy("wrong"); $("status").className = "status try"; announce("wrong", { checks }); } }
  function renderResult() { if (!$("resultText")) return; const complete = solved.size === plots.length; $("resultTitle").textContent = complete ? copy("resultTitle") : copy("finished"); const resultKey = solved.size === 1 && (locales[locale] || locales.en).resultOne ? "resultOne" : (locales[locale] || locales.en).resultMany ? "resultMany" : "resultText"; $("resultText").textContent = copy(resultKey, { count: solved.size }); $("nextBtn").hidden = complete; $("stagesBtn").hidden = !complete; $("replayBtn").hidden = false; if (complete) { const old = Number(safeStorage.get("weightplay-glyph-garden-best-v2", "0")); if (!old || checks < old) safeStorage.set("weightplay-glyph-garden-best-v2", String(checks)); } }
  function next() { const nextIndex = plotIndex + 1; if (nextIndex < plots.length) startPlot(nextIndex); else { setScreen("stage"); renderStages(); } }
  function bind() {
    $("startBtn").addEventListener("click", () => { setScreen("stage"); renderStages(); }); $("mainProgress").textContent = copy("best", { count: bestText() });
    $("settingsButton").addEventListener("click", () => { $("settingsPanel").hidden = false; }); $("closeSettings").addEventListener("click", () => { $("settingsPanel").hidden = true; });
    $("soundButton").addEventListener("click", () => { sound = !sound; safeStorage.set("weightplay-glyph-garden-sound", sound ? "on" : "off"); applyLocale(); }); $("localeSelect").addEventListener("change", (event) => { locale = event.target.value; safeStorage.set("weightPlayLocale", locale); applyLocale(); });
    $("stageBackBtn").addEventListener("click", () => setScreen("main")); $("battleBackBtn").addEventListener("click", () => setScreen("stage")); $("checkBtn").addEventListener("click", check); $("clearBtn").addEventListener("click", () => { selected = null; renderBattle(); }); $("nextBtn").addEventListener("click", next); $("stagesBtn").addEventListener("click", () => { setScreen("stage"); renderStages(); }); $("replayBtn").addEventListener("click", () => startPlot(plotIndex));
  }
  function enforceRouteLocale() {
    const requested = new URLSearchParams(location.search).get("route-locale");
    const expectedDir = requested === "ar" ? "rtl" : "ltr";
    if (requested && locales[requested] && (requested !== locale || document.documentElement.lang !== requested || document.documentElement.dir !== expectedDir)) { locale = requested; safeStorage.set("weightPlayLocale", locale); if ($("localeSelect")) $("localeSelect").value = locale; applyLocale(); }
  }
  function boot() { document.querySelectorAll("[data-i18n]").forEach((node) => { node.dataset.glyphI18n = node.dataset.i18n; node.removeAttribute("data-i18n"); }); bind(); $("localeSelect").value = locale; $("loadingPanel").hidden = true; $("app")?.removeAttribute("hidden"); setScreen("main"); applyLocale(); enforceRouteLocale(); const routeRequested = new URLSearchParams(location.search).get("route-locale"); if (routeRequested && locales[routeRequested]) { let attempts = 0; const timer = window.setInterval(() => { enforceRouteLocale(); attempts += 1; if (attempts > 20) window.clearInterval(timer); }, 200); } announce("loaded"); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
}());
