(function () {
  "use strict";
  const copy = window.BALANCE_LOCALES || {};
  const supportedLocales = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const normalizeLocale = (value) => {
    if (value === "zh-TW") return "zh-Hant";
    if (value === "zh-CN") return "zh-Hans";
    if (value?.toLowerCase?.().startsWith("pt")) return "pt-BR";
    if (supportedLocales.includes(value)) return value;
    const short = value?.split?.("-")?.[0];
    return supportedLocales.includes(short) ? short : "en";
  };
  const stages = [
    { title: "stageTitle1", hint: "stageHint1", target: 5, pieces: [["stoneAcorn", 1, "●"], ["stonePebble", 2, "◆"], ["stoneTwig", 3, "▲"], ["stoneBerry", 4, "✦"]], solutions: [[2, 3]] },
    { title: "stageTitle2", hint: "stageHint2", target: 7, pieces: [["stoneAcorn", 1, "●"], ["stonePebble", 2, "◆"], ["stoneTwig", 3, "▲"], ["stoneBerry", 4, "✦"], ["stoneShell", 5, "⬟"]], solutions: [[2, 5], [3, 4]] },
    { title: "stageTitle3", hint: "stageHint3", target: 9, pieces: [["stoneAcorn", 1, "●"], ["stonePebble", 2, "◆"], ["stoneTwig", 3, "▲"], ["stoneBerry", 4, "✦"], ["stoneShell", 5, "⬟"], ["stoneFirefly", 6, "✿"]], solutions: [[3, 6], [4, 5]] }
  ];
  const routedLocale = window.WonderI18n?.localeFromPath?.();
  const savedLocale = (() => { try { return localStorage.getItem("weightPlayLocale") || localStorage.getItem("weightplayLocale"); } catch (error) { return null; } })();
  const state = { locale: normalizeLocale(routedLocale || window.WonderI18n?.actualLocale?.() || document.documentElement.lang || savedLocale), stage: 0, selected: [], checks: 0, sessionChecks: 0, sound: true, storage: true };
  const $ = (id) => document.getElementById(id);
  const screens = { main: $("mainScreen"), stages: $("stageScreen"), battle: $("battleScreen"), result: $("resultScreen") };
  const t = (key, vars) => {
    const table = copy[state.locale] || copy.en || {};
    let value = table[key] || (copy.en && copy.en[key]) || key;
    Object.keys(vars || {}).forEach((name) => { value = value.replace(new RegExp("\\{" + name + "\\}", "g"), String(vars[name])); });
    return value;
  };
  const track = (name, detail) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: "animal_balance_grove_" + name }, detail || {}));
    document.dispatchEvent(new CustomEvent("weightplay:balance-grove", { detail: Object.assign({ name }, detail || {}) }));
  };
  const readBest = () => { try { const value = Number(localStorage.getItem("weightplay-animal-balance-grove-best-v1")); return Number.isFinite(value) && value > 0 ? value : null; } catch (error) { state.storage = false; return null; } };
  const writeBest = (value) => { try { const current = readBest(); if (!current || value < current) localStorage.setItem("weightplay-animal-balance-grove-best-v1", String(value)); } catch (error) { state.storage = false; } };
  const show = (name) => Object.keys(screens).forEach((key) => { screens[key].hidden = key !== name; });
  const applyLocale = () => {
    document.documentElement.lang = state.locale;
    document.documentElement.dir = state.locale === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = t(node.dataset.copy); });
    $("localeSelect").value = state.locale;
    $("soundBtn").textContent = state.sound ? t("soundOn") : t("soundOff");
    $("settingsBtn").setAttribute("aria-label", t("settings"));
    $("localeSelect").setAttribute("aria-label", t("language"));
    $("tokenTray").setAttribute("aria-label", t("chooseStone"));
    document.querySelector(".scale").setAttribute("aria-label", t("scaleLabel"));
    $("bestValue").textContent = readBest() || t("noBest");
    if (!screens.stages.hidden) renderStages();
    if (!screens.battle.hidden) renderBattle();
    if (!screens.result.hidden) renderResult();
  };
  const setLocale = (locale) => { state.locale = normalizeLocale(locale); try { localStorage.setItem("weightPlayLocale", state.locale); localStorage.setItem("weightplayLocale", state.locale); } catch (error) { state.storage = false; } applyLocale(); track("locale", { locale: state.locale }); };
  const beep = (frequency) => { if (!state.sound) return; try { const AudioContext = window.AudioContext || window.webkitAudioContext; if (!AudioContext) return; const context = new AudioContext(); const oscillator = context.createOscillator(); const gain = context.createGain(); oscillator.frequency.value = frequency; gain.gain.setValueAtTime(.035, context.currentTime); gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + .12); oscillator.connect(gain).connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + .12); oscillator.addEventListener("ended", () => context.close()); } catch (error) { /* audio is optional */ } };
  const renderStages = () => { $("stageList").innerHTML = stages.map((stage, index) => `<button class="stage-card" type="button" data-stage="${index}"><span class="stage-number">${t("round", { n: index + 1, total: stages.length })}</span><h3>${t(stage.title)}</h3><p>${t(stage.hint)}</p><span class="stage-chip">${t("target", { n: stage.target })}</span></button>`).join(""); $("stageList").querySelectorAll("[data-stage]").forEach((button) => button.addEventListener("click", () => startStage(Number(button.dataset.stage)))); };
  const renderBattle = () => {
    const stage = stages[state.stage];
    $("battleHeading").textContent = t(stage.title);
    $("roundLabel").textContent = t("round", { n: state.stage + 1, total: stages.length });
    $("battleHint").textContent = t("stageReady");
    $("leftGoal").textContent = t("leftPan", { n: 3 + state.stage });
    $("rightGoal").textContent = t("target", { n: stage.target });
    $("leftPanLabel").textContent = t("leftPan", { n: 3 + state.stage });
    $("rightPanLabel").textContent = t("rightPan", { n: state.selected.reduce((sum, index) => sum + stage.pieces[index][1], 0) });
    $("sessionChecks").textContent = String(state.sessionChecks);
    $("selectionCount").textContent = t("selected", { n: state.selected.length });
    $("selectedItems").innerHTML = state.selected.map((index) => `<span class="placed-token" aria-label="${t(stage.pieces[index][0])}">${stage.pieces[index][2]}</span>`).join("");
    $("tokenTray").innerHTML = stage.pieces.map((piece, index) => `<button class="token-btn" type="button" data-token="${index}" aria-pressed="${state.selected.includes(index)}"><span class="token-icon" aria-hidden="true">${piece[2]}</span><span><span class="token-name">${t(piece[0])}</span><br><span class="token-value">${piece[1]}</span></span></button>`).join("");
    $("tokenTray").querySelectorAll("[data-token]").forEach((button) => button.addEventListener("click", () => toggleToken(Number(button.dataset.token))));
  };
  const renderResult = () => { const final = state.stage >= stages.length - 1 && state.selected.length === 0; $("resultHeading").textContent = final ? t("finishTitle") : t("balanced"); $("resultText").textContent = final ? t("finishText", { n: state.sessionChecks }) : t("balanced"); $("resultPrimaryBtn").textContent = final ? t("stageMap") : t("next"); $("resultMapBtn").hidden = final; $("resultPrimaryBtn").onclick = final ? () => { show("stages"); renderStages(); } : () => startStage(state.stage + 1); }; 
  const startSession = () => { state.sessionChecks = 0; track("session_start"); show("stages"); renderStages(); track("stage_map", { source: "start" }); };
  const startStage = (index) => { state.stage = Math.max(0, Math.min(stages.length - 1, index)); state.selected = []; state.checks = 0; $("battleStatus").textContent = ""; show("battle"); renderBattle(); track("stage_start", { stage: state.stage + 1 }); };
  const toggleToken = (index) => { state.selected = state.selected.includes(index) ? state.selected.filter((item) => item !== index) : state.selected.concat(index); beep(420); renderBattle(); track("stone_select", { stage: state.stage + 1, value: stages[state.stage].pieces[index][1] }); };
  const clearTokens = () => { state.selected = []; $("battleStatus").textContent = ""; renderBattle(); track("stone_clear", { stage: state.stage + 1 }); };
  const checkBalance = () => { const stage = stages[state.stage]; const values = state.selected.map((index) => stage.pieces[index][1]).sort((a, b) => a - b); const correct = stage.solutions.some((solution) => solution.length === values.length && solution.every((value, index) => value === values[index])); state.checks += 1; state.sessionChecks += 1; track("balance_check", { stage: state.stage + 1, checks: state.checks, correct }); if (correct) { $("battleStatus").textContent = t("balanced"); beep(680); state.selected = []; if (state.stage >= stages.length - 1) { writeBest(state.sessionChecks); track("session_complete", { checks: state.sessionChecks }); show("result"); renderResult(); } else { show("result"); renderResult(); } } else { $("battleStatus").textContent = t("notBalanced"); beep(220); state.selected = []; renderBattle(); } };
  $("startBtn").addEventListener("click", startSession); $("mapBtn").addEventListener("click", () => { show("stages"); renderStages(); track("stage_map"); }); $("stageBackBtn").addEventListener("click", () => show("main")); $("battleBackBtn").addEventListener("click", () => { show("stages"); renderStages(); }); $("resultMapBtn").addEventListener("click", () => { show("stages"); renderStages(); }); $("resultHomeBtn").addEventListener("click", () => show("main")); $("checkBtn").addEventListener("click", checkBalance); $("clearBtn").addEventListener("click", clearTokens); $("settingsBtn").addEventListener("click", () => { const panel = $("settingsPanel"); panel.hidden = !panel.hidden; $("settingsBtn").setAttribute("aria-expanded", String(!panel.hidden)); }); $("soundBtn").addEventListener("click", () => { state.sound = !state.sound; applyLocale(); track("sound", { enabled: state.sound }); }); $("localeSelect").addEventListener("change", (event) => { const next = normalizeLocale(event.target.value); if (window.WonderI18n?.setLocale) { window.WonderI18n.setLocale(next); return; } setLocale(next); });
  window.addEventListener?.("wonder:locale-change", (event) => setLocale(event.detail?.locale || window.WonderI18n?.actualLocale?.() || document.documentElement.lang));
  try { const saved = localStorage.getItem("weightPlayLocale") || localStorage.getItem("weightplayLocale"); if (!routedLocale && saved) state.locale = normalizeLocale(saved); } catch (error) { state.storage = false; }
  window.setTimeout(() => { $("loadingPanel").hidden = true; screens.main.hidden = false; applyLocale(); track("main_ready"); }, 420);
}());
