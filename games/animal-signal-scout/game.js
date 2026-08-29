(() => {
  "use strict";
  const locales = window.ANIMAL_SIGNAL_SCOUT_LOCALES || {};
  const patrols = [
    { nameKey: "name1", note: "note1", order: ["fox", "owl", "fox"], cards: [{ animal: "fox", colour: "amber" }, { animal: "owl", colour: "teal" }, { animal: "rabbit", colour: "violet" }] },
    { nameKey: "name2", note: "note2", order: ["deer", "otter", "finch"], cards: [{ animal: "otter", colour: "blue" }, { animal: "finch", colour: "gold" }, { animal: "deer", colour: "rose" }] },
    { nameKey: "name3", note: "note3", order: ["mole", "badger", "hare"], cards: [{ animal: "badger", colour: "green" }, { animal: "hare", colour: "coral" }, { animal: "mole", colour: "indigo" }] }
  ];
  const state = { locale: "en", patrol: 0, code: [], checks: 0, sessionChecks: 0, screen: "main" };
  const $ = (id) => document.getElementById(id);
  const t = (key, vars = {}) => { const table = locales[state.locale] || locales.en || {}; let value = table[key] || locales.en?.[key] || key; Object.entries(vars).forEach(([name, replacement]) => { value = value.replaceAll(`{${name}}`, String(replacement)); }); return value; };
  const show = (screen) => { state.screen = screen; document.querySelectorAll("section[data-screen]").forEach((node) => { node.hidden = node.dataset.screen !== screen; }); document.body.dataset.screen = screen; };
  const readBest = () => { try { const value = Number(localStorage.getItem("weightplay-animal-signal-scout-best-v1")); return Number.isFinite(value) && value > 0 ? value : null; } catch (_) { return null; } };
  const saveBest = () => { try { const old = readBest(); if (!old || state.sessionChecks < old) localStorage.setItem("weightplay-animal-signal-scout-best-v1", String(state.sessionChecks)); } catch (_) {} };
  const announce = (key) => { $("battleStatus").textContent = t(key); };
  const applyLocale = () => {
    document.documentElement.lang = state.locale;
    document.documentElement.dir = state.locale === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = t(node.dataset.copy); });
    document.querySelectorAll("[data-copy-aria]").forEach((node) => node.setAttribute("aria-label", t(node.dataset.copyAria)));
    $("localeSelect").value = state.locale; $("localeSelect").setAttribute("aria-label", t("language"));
    $("mainProgress").textContent = `${t("stages")}: ${Math.min(state.patrol, patrols.length)} / ${patrols.length}`;
    $("bestValue").textContent = readBest() || t("noBest");
    if (state.screen === "stage") renderStages(); if (state.screen === "battle") renderBattle(); if (state.screen === "result") renderResult();
  };
  const renderStages = () => {
    $("stageList").replaceChildren(...patrols.map((patrol, index) => { const button = document.createElement("button"); button.type = "button"; button.className = "stage-card"; button.setAttribute("role", "listitem"); button.innerHTML = `<strong>${t("round", { n: index + 1, total: patrols.length })}</strong><span>${t(patrol.nameKey)}</span><small>${index < state.patrol ? t("complete") : t("open")}</small>`; button.addEventListener("click", () => startPatrol(index)); return button; }));
  };
  const renderBattle = () => {
    const patrol = patrols[state.patrol]; $("roundName").textContent = t(patrol.nameKey); $("roundLabel").textContent = t("round", { n: state.patrol + 1, total: patrols.length }); $("routeNote").textContent = t(patrol.note); $("checkCount").textContent = t("checks", { n: state.sessionChecks });
    $("targetOrder").replaceChildren(...patrol.order.map((animal, index) => { const chip = document.createElement("span"); chip.className = "target-chip"; chip.textContent = `${index + 1}. ${t(animal)}`; return chip; }));
    $("signalGrid").replaceChildren(...patrol.cards.map((card) => { const button = document.createElement("button"); button.type = "button"; button.className = "signal-btn"; button.dataset.animal = card.animal; button.disabled = state.code.length >= patrol.order.length; button.innerHTML = `<span class="signal-dot signal-${card.colour}" aria-hidden="true"></span><strong>${t(card.animal)}</strong><small>${t(card.colour)}</small>`; button.addEventListener("click", () => chooseSignal(card.animal)); return button; }));
    $("routeNote").setAttribute("aria-label", t("noteLabel")); $("codeLabel").textContent = t("codeLabel"); $("code").replaceChildren(...state.code.map((animal, index) => { const chip = document.createElement("span"); chip.className = "code-chip"; chip.textContent = `${index + 1}. ${t(animal)}`; return chip; }));
    $("checkBtn").disabled = state.code.length !== patrol.order.length;
  };
  const renderResult = () => { const complete = state.patrol >= patrols.length - 1; $("resultTitle").textContent = complete ? t("resultTitle") : t("resultPartial"); $("resultText").textContent = t("resultText", { count: Math.min(state.patrol + 1, patrols.length), total: patrols.length, checks: state.sessionChecks }); $("resultPrimaryBtn").textContent = complete ? t("map") : t("next"); $("resultPrimaryBtn").onclick = complete ? () => { show("stage"); renderStages(); } : () => startPatrol(state.patrol + 1); $("resultMapBtn").hidden = complete; };
  const startPatrol = (index) => { state.patrol = Math.max(0, Math.min(patrols.length - 1, index)); state.code = []; if (index === 0) { state.checks = 0; state.sessionChecks = 0; } show("battle"); renderBattle(); announce("waiting"); };
  const chooseSignal = (animal) => { if (state.code.length >= patrols[state.patrol].order.length) return; state.code.push(animal); renderBattle(); announce("codeReady"); };
  const clearCode = () => { state.code = []; renderBattle(); announce("waiting"); };
  const checkCode = () => { const patrol = patrols[state.patrol]; if (state.code.length !== patrol.order.length) { announce("waiting"); return; } state.checks += 1; state.sessionChecks += 1; const correct = JSON.stringify(state.code) === JSON.stringify(patrol.order); if (!correct) { state.code = []; renderBattle(); announce("wrong"); return; } announce("correct"); if (state.patrol === patrols.length - 1) { saveBest(); $("bestValue").textContent = readBest() || t("noBest"); } show("result"); renderResult(); };
  $("startBtn").addEventListener("click", () => startPatrol(0)); $("mapBtn").addEventListener("click", () => { show("stage"); renderStages(); }); $("stageBackBtn").addEventListener("click", () => show("main")); $("battleBackBtn").addEventListener("click", () => { show("stage"); renderStages(); }); $("resultMapBtn").addEventListener("click", () => { show("stage"); renderStages(); }); $("resultHomeBtn").addEventListener("click", () => show("main")); $("checkBtn").addEventListener("click", checkCode); $("clearBtn").addEventListener("click", clearCode); $("settingsBtn").addEventListener("click", () => { $("settingsPanel").hidden = !$("settingsPanel").hidden; }); $("localeSelect").addEventListener("change", (event) => { state.locale = locales[event.target.value] ? event.target.value : "en"; try { localStorage.setItem("weightplayLocale", state.locale); } catch (_) {} applyLocale(); });
  const routeLocale = document.documentElement.lang; if (routeLocale && locales[routeLocale]) state.locale = routeLocale;
  try { const saved = localStorage.getItem("weightplayLocale"); if (saved && locales[saved]) state.locale = saved; } catch (_) {}
  applyLocale(); show("main");
  window.__ANIMAL_SIGNAL_SCOUT_TEST__ = { patrols, startPatrol, chooseSignal, checkCode, clearCode, getState: () => ({ ...state, code: [...state.code] }) };
})();
