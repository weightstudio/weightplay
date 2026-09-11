(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const locales = window.HABITAT_BLUEPRINT_LOCALES || {};
  const supportedLocales = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const localeMap = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const normalizeLocale = (value) => {
    if (value === "zh-TW") return "zh-Hant";
    if (value === "zh-CN") return "zh-Hans";
    if (value?.toLowerCase?.().startsWith("pt")) return "pt-BR";
    if (supportedLocales.includes(value)) return value;
    const short = value?.split?.("-")?.[0];
    return supportedLocales.includes(short) ? short : "en";
  };
  const safeStorage = { get(key, fallback = "") { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } }, set(key, value) { try { localStorage.setItem(key, value); } catch {} } };
  const queryParams = new URLSearchParams(window.location.search);
  const queryLocale = queryParams.get("route-locale") || queryParams.get("locale") || queryParams.get("lang");
  const pathLocale = window.location.pathname.split("/").filter(Boolean).map((value) => localeMap[value] || "").find(Boolean);
  const routeLocale = queryLocale && locales[normalizeLocale(queryLocale)] ? normalizeLocale(queryLocale) : (pathLocale && locales[pathLocale] ? pathLocale : "");
  const habitatSets = [
    { name: "blueprint1", hint: "hint1", solution: ["pond", "reed", "nest", "meadow"], rules: [{ key: "ruleTouch", a: "pond", b: "reed" }, { key: "ruleApart", a: "pond", b: "nest" }, { key: "ruleBelow", a: "meadow", b: "nest" }] },
    { name: "blueprint2", hint: "hint2", solution: ["fern", "canopy", "burrow", "stream"], rules: [{ key: "ruleTouch", a: "stream", b: "fern" }, { key: "ruleApart", a: "canopy", b: "stream" }, { key: "ruleBelow", a: "burrow", b: "canopy" }] },
    { name: "blueprint3", hint: "hint3", solution: ["lantern", "moss", "dusk", "pool"], rules: [{ key: "ruleTouch", a: "lantern", b: "moss" }, { key: "ruleApart", a: "lantern", b: "pool" }, { key: "ruleBelow", a: "dusk", b: "moss" }] }
  ];
  const starts = [[1, 2, 0, 3], [2, 0, 3, 1], [3, 2, 1, 0], [1, 3, 2, 0], [2, 3, 0, 1]];
  const chapterModes = ["open", "adjacent", "diagonal", "anchor", "budget", "master"];
  const modeLabels = {
    en: ["Open exchange", "Neighbour exchange", "Diagonal exchange", "Anchored habitat", "Four-swap budget", "Anchored diagonal mastery"],
    "zh-Hant": ["自由交換", "相鄰交換", "對角交換", "固定棲地", "四次交換限制", "固定對角挑戰"],
    "zh-Hans": ["自由交换", "相邻交换", "对角交换", "固定栖地", "四次交换限制", "固定对角挑战"],
    ja: ["自由交換", "隣接交換", "対角交換", "固定ハビタット", "4回交換制限", "固定対角マスター"],
    ko: ["자유 교환", "인접 교환", "대각선 교환", "고정 서식지", "4회 교환 제한", "고정 대각선 숙련"],
    es: ["Intercambio libre", "Intercambio vecino", "Intercambio diagonal", "Hábitat anclado", "Límite de cuatro intercambios", "Maestría diagonal anclada"],
    "pt-BR": ["Troca livre", "Troca vizinha", "Troca diagonal", "Habitat ancorado", "Limite de quatro trocas", "Mestria diagonal ancorada"],
    fr: ["Échange libre", "Échange voisin", "Échange diagonal", "Habitat ancré", "Limite de quatre échanges", "Maîtrise diagonale ancrée"],
    de: ["Freier Tausch", "Nachbartausch", "Diagonaltausch", "Verankertes Habitat", "Vier-Tausch-Limit", "Verankerte Diagonalmeisterschaft"],
    it: ["Scambio libero", "Scambio adiacente", "Scambio diagonale", "Habitat ancorato", "Limite di quattro scambi", "Maestria diagonale ancorata"],
    ru: ["Свободный обмен", "Соседний обмен", "Диагональный обмен", "Закреплённая среда", "Лимит: четыре обмена", "Закреплённая диагональ"],
    hi: ["स्वतंत्र अदला-बदली", "पड़ोसी अदला-बदली", "तिरछी अदला-बदली", "स्थिर आवास", "चार अदला-बदली सीमा", "स्थिर तिरछी महारत"],
    ar: ["تبديل حر", "تبديل متجاور", "تبديل قطري", "موطن مثبت", "حد أربعة تبديلات", "إتقان قطري مثبت"]
  };
  const plans = Array.from({ length: 30 }, (_, index) => {
    const set = habitatSets[index % habitatSets.length];
    const chapter = Math.floor(index / 5);
    const order = chapter === 2 ? (index % 2 ? [0, 2, 1, 3] : [3, 1, 2, 0]) : chapter === 3 ? starts[0] : chapter === 5 ? [3, 1, 2, 0] : starts[(index + chapter) % starts.length];
    return {
      id: index + 1,
      name: set.name,
      hint: set.hint,
      chapter: chapter + 1,
      checkpoint: (index + 1) % 5 === 0,
      mode: chapterModes[chapter],
      lockedSlot: chapter === 3 ? 3 : chapter === 5 ? 2 : -1,
      maxSwaps: chapter >= 4 ? 4 : 0,
      tiles: order.map((slot) => set.solution[slot]),
      solution: [...set.solution],
      rules: set.rules
    };
  });
  let locale = routeLocale || safeStorage.get("weightPlayLocale", "") || safeStorage.get("weightplay-habitat-blueprint-locale", "") || "en";
  locale = normalizeLocale(locale);
  if (!locales[locale]) locale = "en";
  let sound = safeStorage.get("weightplay-habitat-blueprint-sound", "on") !== "off";
  const savedSolved = safeStorage.get("weightplay-habitat-blueprint-solved-v8", "").split(",").map(Number).filter((value) => Number.isInteger(value) && value >= 0 && value < plans.length);
  let planIndex = 0; let tiles = []; let selected = []; let swaps = 0; let sessionSwaps = 0; let solved = new Set(savedSolved); let feedback = ""; let currentScreen = "main";
  const copy = (key, vars = {}) => Object.entries(vars).reduce((out, [name, value]) => out.replaceAll(`{${name}}`, String(value)), (locales[locale] || locales.en)[key] || locales.en[key] || key);
  const tileName = (type) => copy(`tile${type[0].toUpperCase()}${type.slice(1)}`);
  const announce = (name, data = {}) => { window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: `habitat_blueprint_${name}`, plan: planIndex + 1, swaps, ...data }); };
  const bestValue = () => Number(localStorage.getItem("weightplay-habitat-blueprint-best-v1") || 0) || "—";
  const solvedPlan = () => tiles.every((tile, index) => tile === plans[planIndex].solution[index]);
  function show(screen) { currentScreen = screen; document.querySelectorAll("[data-screen]").forEach((node) => { node.hidden = node.dataset.screen !== screen; }); const root = document.querySelector(`[data-screen="${screen}"]`); const topbar = $("topbar"); if (root && topbar) root.prepend(topbar); const back = $("backBtn"); back.dataset.wpReturn = screen; back.hidden = false; back.classList.toggle("main-return", screen === "main"); const logo = back.querySelector("img"); if (screen === "main" && !logo) { const image = document.createElement("img"); image.src = "../../assets/weightplay-logo.png"; image.alt = ""; back.prepend(image); } else if (screen !== "main" && logo) logo.remove(); $("settingsPanel").hidden = true; const guide = $("gameGuide") || document.querySelector("[data-wp-game-guide],.game-page-info,.game-page-info-static"); if (guide) guide.hidden = screen !== "main"; }
  function renderStatic() { document.documentElement.lang = locale; document.documentElement.dir = locale === "ar" ? "rtl" : "ltr"; document.body.dataset.locale = locale; document.querySelectorAll("[data-i18n], [data-copy]").forEach((node) => { node.textContent = copy(node.dataset.i18n || node.dataset.copy); }); document.querySelectorAll("[data-copy-aria-label]").forEach((node) => { node.setAttribute("aria-label", copy(node.dataset.copyAriaLabel)); }); $("backBtn")?.setAttribute("aria-label", copy("back") || "Back"); $("settingsBtn")?.setAttribute("aria-label", copy("settings")); $("closeSettings")?.setAttribute("aria-label", copy("close")); $("localeSelect")?.setAttribute("aria-label", copy("language")); if ($("localeSelect")) $("localeSelect").value = locale; if ($("soundBtn")) { $("soundBtn").textContent = sound ? copy("on") : copy("off"); $("soundBtn").setAttribute("aria-pressed", String(sound)); } $("best") && ($("best").textContent = copy("best", { best: bestValue() })); renderStages(); renderBattle(); renderResult(); }
  function renderStages() { const root = $("stageList"); if (!root) return; root.replaceChildren(); plans.forEach((plan, index) => { const unlocked = index === 0 || solved.has(index - 1); const button = document.createElement("button"); button.type = "button"; button.className = `stage-card${plan.checkpoint ? " checkpoint" : ""}`; button.dataset.planIndex = String(index); button.disabled = !unlocked; button.setAttribute("aria-label", `${copy(plan.name)} ${index + 1} / ${plans.length}`); button.innerHTML = `<span><strong>${plan.checkpoint ? "★ " : ""}${index + 1}. ${copy(plan.name)}</strong><small>${copy(plan.hint)} · ${plan.chapter}/6</small></span><span class="arrow">${solved.has(index) ? "✓" : unlocked ? "→" : "•"}</span>`; button.addEventListener("click", () => startPlan(index, true)); root.appendChild(button); }); }
  function startPlan(index, fromStage = false) { planIndex = index; tiles = [...plans[index].tiles]; selected = []; swaps = 0; feedback = ""; if (index === 0 || fromStage) sessionSwaps = 0; show("battle"); renderBattle(); announce("start"); }
  function renderRules() { const root = $("rules"); root.replaceChildren(); plans[planIndex].rules.forEach((rule) => { const item = document.createElement("li"); item.textContent = copy(rule.key, { a: tileName(rule.a), b: tileName(rule.b) }); root.appendChild(item); }); }
  function allowedPair(first, second, plan = plans[planIndex]) { if (first === plan.lockedSlot || second === plan.lockedSlot) return false; const rowGap = Math.abs(Math.floor(first / 2) - Math.floor(second / 2)); const colGap = Math.abs((first % 2) - (second % 2)); if (plan.mode === "adjacent") return rowGap + colGap === 1; if (plan.mode === "diagonal" || plan.mode === "master") return rowGap === 1 && colGap === 1; return true; }
  function renderBattle() { if (!$("habitatGrid") || currentScreen !== "battle") return; const plan = plans[planIndex]; $("planTitle").textContent = `${planIndex + 1}. ${copy(plan.name)}${plan.checkpoint ? " ★" : ""}`; $("progressPill").textContent = `${planIndex + 1} / ${plans.length}`; $("prompt").textContent = `${copy("prompt")} · ${(modeLabels[locale] || modeLabels.en)[plan.chapter - 1]}`; renderRules(); $("selection").textContent = selected.length ? copy("selection", { names: selected.map((index) => tileName(tiles[index])).join(locale === "zh-Hant" ? "、" : " + ") }) : copy("selectionPrompt"); const root = $("habitatGrid"); root.replaceChildren(); tiles.forEach((type, index) => { const button = document.createElement("button"); button.type = "button"; button.className = `habitat-tile ${type}${index === plan.lockedSlot ? " locked" : ""}`; button.dataset.slot = String(index); button.dataset.tile = type; button.disabled = index === plan.lockedSlot; button.setAttribute("aria-pressed", String(selected.includes(index))); button.innerHTML = `<span class="tile-icon" aria-hidden="true">${{ pond: "◈", reed: "⌁", nest: "◌", meadow: "✿", canopy: "♧", stream: "≈", burrow: "⌂", fern: "❧", dusk: "☾", pool: "◇", moss: "❋", lantern: "✦" }[type]}</span><strong>${tileName(type)}</strong><small>${index === plan.lockedSlot ? "🔒 · " : ""}${copy("slot", { count: index + 1 }) === "slot" ? `Slot ${index + 1}` : copy("slot", { count: index + 1 })}</small>`; button.addEventListener("click", () => { if (selected.includes(index)) selected = selected.filter((item) => item !== index); else if (selected.length < 2) selected = [...selected, index]; else selected = [selected[1], index]; renderBattle(); }); root.appendChild(button); }); $("swapBtn").disabled = selected.length !== 2 || !allowedPair(selected[0], selected[1], plan); $("status").textContent = feedback ? copy(feedback) : ""; $("status").className = feedback === "correct" ? "status good" : feedback === "wrong" ? "status try" : "status"; }
  function swapSelected() { if (selected.length !== 2) return; const [first, second] = selected; if (!allowedPair(first, second)) return; [tiles[first], tiles[second]] = [tiles[second], tiles[first]]; selected = []; swaps += 1; sessionSwaps += 1; if (plans[planIndex].maxSwaps && swaps > plans[planIndex].maxSwaps && !solvedPlan()) { tiles = [...plans[planIndex].tiles]; swaps = 0; feedback = "wrong"; renderBattle(); return; } feedback = solvedPlan() ? "correct" : "wrong"; announce("swap", { solved: solvedPlan() }); if (solvedPlan()) { solved.add(planIndex); safeStorage.set("weightplay-habitat-blueprint-solved-v8", [...solved].sort((a, b) => a - b).join(",")); renderBattle(); setTimeout(() => { show("result"); renderResult(); }, 320); } else renderBattle(); }
  function resultCopy(best) { return copy("resultText", { count: "__COUNT__", best }).replace(/\b3\b/g, String(plans.length)).replace("__COUNT__", String(solved.size)); }
  function renderResult() { if (!$("resultText")) return; const complete = solved.size === plans.length; $("resultTitle").textContent = complete ? copy("resultTitle") : copy("resultLevel"); $("resultText").textContent = resultCopy(bestValue()); $("nextBtn").hidden = complete || !solved.has(planIndex); $("resultMapBtn").hidden = !complete; if (complete) { const old = Number(localStorage.getItem("weightplay-habitat-blueprint-best-v1") || 0); if (!old || sessionSwaps < old) localStorage.setItem("weightplay-habitat-blueprint-best-v1", String(sessionSwaps)); $("resultText").textContent = resultCopy(Math.min(old || sessionSwaps, sessionSwaps)); } }
  function nextPlan() { const nextIndex = planIndex + 1; if (nextIndex < plans.length) startPlan(nextIndex); else { show("stage"); renderStages(); } }
  function goBack() { if (currentScreen === "battle") { show("stage"); renderStages(); } else if (currentScreen === "stage" || currentScreen === "result") show("main"); }
  function bind() { $("startBtn").addEventListener("click", () => { show("stage"); renderStages(); }); $("mapBtn").addEventListener("click", () => { show("stage"); renderStages(); }); $("resultMapBtn").addEventListener("click", () => { show("stage"); renderStages(); }); $("nextBtn").addEventListener("click", nextPlan); $("swapBtn").addEventListener("click", swapSelected); $("resetBtn").addEventListener("click", () => { tiles = [...plans[planIndex].tiles]; selected = []; swaps = 0; feedback = ""; renderBattle(); announce("reset"); }); $("backBtn").addEventListener("click", goBack); $("settingsBtn")?.addEventListener("click", () => { $("settingsPanel").hidden = false; }); $("closeSettings")?.addEventListener("click", () => { $("settingsPanel").hidden = true; }); $("soundBtn")?.addEventListener("click", () => { sound = !sound; safeStorage.set("weightplay-habitat-blueprint-sound", sound ? "on" : "off"); renderStatic(); }); $("localeSelect")?.addEventListener("change", (event) => { locale = normalizeLocale(event.target.value); safeStorage.set("weightPlayLocale", locale); safeStorage.set("weightplay-habitat-blueprint-locale", locale); renderStatic(); announce("locale", { locale }); }); }
  function enforceRouteLocale() { if (routeLocale && routeLocale !== locale) { locale = routeLocale; renderStatic(); } }
  function boot() { bind(); $("localeSelect").value = locale; $("loading").hidden = true; $("app").hidden = false; show("main"); renderStatic(); enforceRouteLocale(); announce("loaded"); }
  window.__HABITAT_BLUEPRINT_TEST__ = { plans, startPlan, allowedPair, getState: () => ({ planIndex, tiles: [...tiles], solved: [...solved], swaps, screen: currentScreen }) };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
}());
