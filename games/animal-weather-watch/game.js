(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const locales = window.WEATHER_WATCH_LOCALES || {};
  const routeLocaleMap = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const routeSegment = window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
  const signs = { sun: "☀", cloud: "☁", rain: "☂" };
  const signArtClass = (type) => `weather-art weather-${type}`;
  const plans = [
    { id: 1, name: "plan1", hint: "hint1", sequence: ["sun", "cloud", "sun"], answer: "cloud", shelter: "shelter1", rule: "rule1" },
    { id: 2, name: "plan2", hint: "hint2", sequence: ["rain", "cloud", "cloud"], answer: "rain", shelter: "shelter2", rule: "rule2" },
    { id: 3, name: "plan3", hint: "hint3", sequence: ["sun", "rain", "cloud"], answer: "sun", shelter: "shelter3", rule: "rule3" }
  ];
  const storedLocale = localStorage.getItem("weightplay-animal-weather-watch-locale");
  let locale = (routeLocaleMap[routeSegment] && locales[routeLocaleMap[routeSegment]]) ? routeLocaleMap[routeSegment] : storedLocale || "en";
  if (!locales[locale]) locale = "en";
  let sound = localStorage.getItem("weightplay-animal-weather-watch-sound") !== "off";
  let planIndex = 0; let selected = ""; let checks = 0; let sessionChecks = 0; let solved = new Set(); let feedback = ""; let currentScreen = "main";
  const copy = (key, vars = {}) => Object.entries(vars).reduce((out, [name, value]) => out.replaceAll(`{${name}}`, String(value)), (locales[locale] || locales.en)[key] || locales.en[key] || key);
  const signName = (type) => copy(`sign${type[0].toUpperCase()}${type.slice(1)}`);
  const bestValue = () => Number(localStorage.getItem("weightplay-animal-weather-watch-best-v1") || 0) || "—";
  const announce = (name, data = {}) => { window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: `animal_weather_watch_${name}`, forecast: planIndex + 1, checks, ...data }); };
  function show(screen) {
    currentScreen = screen;
    const scene = screen === "result" ? "battle" : screen;
    document.querySelectorAll("#app > [data-screen]").forEach((node) => { node.hidden = node.dataset.screen !== scene; });
    if ($("resultScreen")) $("resultScreen").hidden = screen !== "result";
    document.body.dataset.screen = scene;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.body.dir = locale === "ar" ? "rtl" : "ltr";
    $("gameGuide").hidden = screen !== "main";
    $("settingsPanel").hidden = true;
  }
  function renderStatic() {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.body.dir = locale === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = copy(node.dataset.i18n); });
    $("backBtn").setAttribute("aria-label", copy("back"));
    $("stageBackBtn").setAttribute("aria-label", copy("back"));
    $("settingsBtn").setAttribute("aria-label", copy("settings"));
    $("stageUtilityBtn").setAttribute("aria-label", copy("settings"));
    $("battleUtilityBtn").setAttribute("aria-label", copy("settings"));
    $("closeSettings").setAttribute("aria-label", copy("close"));
    $("localeSelect").setAttribute("aria-label", copy("language"));
    $("sequence").setAttribute("aria-label", copy("weatherSigns"));
    $("choiceGrid").setAttribute("aria-label", copy("nextWeatherSign"));
    $("soundBtn").textContent = sound ? copy("on") : copy("off");
    $("soundBtn").setAttribute("aria-pressed", String(sound));
    $("localeSelect").value = locale;
    $("best").textContent = copy("best", { best: bestValue() });
    renderStages(); renderBattle(); renderResult();
  }
  function renderStages() {
    const root = $("stageList"); if (!root) return;
    root.replaceChildren();
    plans.forEach((plan, index) => {
      const button = document.createElement("button");
      button.type = "button"; button.className = "stage-card"; button.setAttribute("aria-label", copy("enterForecast", { name: copy(plan.name) }));
      button.innerHTML = `<span><strong>${copy(plan.name)}</strong><small>${copy(plan.hint)}</small></span><span class="arrow" aria-hidden="true">${solved.has(index) ? "✓" : "→"}</span>`;
      button.addEventListener("click", () => startPlan(index, true)); root.appendChild(button);
    });
  }
  function startPlan(index, fromStage = false) { planIndex = index; selected = ""; checks = 0; feedback = ""; if (index === 0 || fromStage) sessionChecks = 0; show("battle"); renderBattle(); announce("start"); }
  function renderBattle() {
    if (!$("choiceGrid") || currentScreen !== "battle") return;
    const plan = plans[planIndex]; $("planTitle").textContent = copy(plan.name); $("progressPill").textContent = `${planIndex + 1} / ${plans.length}`; $("prompt").textContent = copy("prompt"); $("rule").textContent = copy(plan.rule);
    const sequence = $("sequence"); sequence.replaceChildren();
    plan.sequence.forEach((type) => { const item = document.createElement("div"); item.className = "sign"; item.setAttribute("role", "listitem"); item.innerHTML = `<span class="sign-icon ${signArtClass(type)}" aria-hidden="true">${signs[type]}</span><strong>${signName(type)}</strong>`; sequence.appendChild(item); });
    const next = document.createElement("div"); next.className = "sign next"; next.setAttribute("role", "listitem"); next.innerHTML = `<span class="sign-icon" aria-hidden="true">?</span><small aria-hidden="true">?</small>`; sequence.appendChild(next);
    $("selection").textContent = selected ? copy("selected", { name: signName(selected) }) : copy("selectPrompt");
    const root = $("choiceGrid"); root.replaceChildren();
    ["sun", "cloud", "rain"].forEach((type) => { const button = document.createElement("button"); button.type = "button"; button.className = "choice"; button.setAttribute("aria-label", signName(type)); button.setAttribute("aria-pressed", String(selected === type)); button.innerHTML = `<span class="sign-icon ${signArtClass(type)}" aria-hidden="true">${signs[type]}</span><strong>${signName(type)}</strong>`; button.addEventListener("click", () => { selected = type; feedback = ""; renderBattle(); }); root.appendChild(button); });
    $("checkBtn").disabled = false; $("status").textContent = feedback ? copy(feedback) : ""; $("status").className = feedback === "correct" ? "status good" : feedback === "wrong" ? "status try" : "status";
  }
  function checkForecast() { if (!selected) return; checks += 1; sessionChecks += 1; const correct = selected === plans[planIndex].answer; feedback = correct ? "correct" : "wrong"; announce("check", { selected, correct }); if (correct) { solved.add(planIndex); renderBattle(); setTimeout(() => { show("result"); renderResult(); }, 280); } else renderBattle(); }
  function renderResult() { if (!$("resultText")) return; const complete = solved.size === plans.length; $("resultTitle").textContent = complete ? copy("resultTitle") : copy("resultLevel"); $("resultText").textContent = copy("resultText", { count: solved.size, checks: sessionChecks, best: bestValue() }); $("nextBtn").hidden = complete; $("resultMapBtn").hidden = !complete; if (complete) { const old = Number(localStorage.getItem("weightplay-animal-weather-watch-best-v1") || 0); if (!old || sessionChecks < old) localStorage.setItem("weightplay-animal-weather-watch-best-v1", String(sessionChecks)); $("resultText").textContent = copy("resultText", { count: solved.size, checks: sessionChecks, best: Math.min(old || sessionChecks, sessionChecks) }); } }
  function nextPlan() { const nextIndex = planIndex + 1; if (nextIndex < plans.length) startPlan(nextIndex); else { show("stage"); renderStages(); } }
  function goBack() { if (currentScreen === "battle" || currentScreen === "result") { show("stage"); renderStages(); } else if (currentScreen === "stage") show("main"); }
  function openSettings() { $("settingsPanel").hidden = false; $("localeSelect").focus(); }
  function bind() {
    $("startBtn").addEventListener("click", () => { show("stage"); renderStages(); announce("start"); }); $("mapBtn").addEventListener("click", () => { show("stage"); renderStages(); }); $("resultMapBtn").addEventListener("click", () => { show("stage"); renderStages(); }); $("nextBtn").addEventListener("click", nextPlan); $("checkBtn").addEventListener("click", checkForecast); $("resetBtn").addEventListener("click", () => { selected = ""; checks = 0; feedback = ""; renderBattle(); announce("reset"); });
    $("backBtn").addEventListener("click", goBack); $("stageBackBtn").addEventListener("click", goBack); $("settingsBtn").addEventListener("click", openSettings); $("stageUtilityBtn").addEventListener("click", openSettings); $("battleUtilityBtn").addEventListener("click", openSettings); $("closeSettings").addEventListener("click", () => { $("settingsPanel").hidden = true; }); $("soundBtn").addEventListener("click", () => { sound = !sound; localStorage.setItem("weightplay-animal-weather-watch-sound", sound ? "on" : "off"); renderStatic(); }); $("localeSelect").addEventListener("change", (event) => { locale = event.target.value; localStorage.setItem("weightplay-animal-weather-watch-locale", locale); renderStatic(); });
  }
  function boot() { bind(); $("loading").hidden = true; $("app").hidden = false; show("main"); renderStatic(); announce("loaded"); }
  window.__ANIMAL_WEATHER_WATCH_TEST__ = { plans, startPlan, getState: () => ({ planIndex, selected, solved: [...solved], checks, screen: currentScreen }) };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
}());
