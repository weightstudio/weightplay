(() => {
  "use strict";
  const copy = window.ANIMAL_DEWLINE_LOCALES || {};
  const meadows = [
    { title: "Dawn Basin", targets: [2, 3, 1] },
    { title: "Fern Channel", targets: [4, 1, 3] },
    { title: "Pollen Brook", targets: [3, 5, 2] },
  ];
  const state = { locale: "en", meadow: 0, values: [0, 0, 0], tries: 0, sessionTries: 0, sound: true, screen: "main" };
  const $ = (id) => document.getElementById(id);
  const t = (key, vars = {}) => {
    const table = copy[state.locale] || copy.en || {};
    let value = table[key] || copy.en?.[key] || key;
    Object.entries(vars).forEach(([name, replacement]) => { value = value.replaceAll(`{${name}}`, String(replacement)); });
    return value;
  };
  const track = (name, detail = {}) => {
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: `animal_dewline_${name}`, ...detail });
      document.dispatchEvent(new CustomEvent("weightplay:animal-dewline", { detail: { name, ...detail } }));
    } catch (_) {}
  };
  const readBest = () => { try { const value = Number(localStorage.getItem("weightplay-animal-dewline-best-v1")); return Number.isFinite(value) && value > 0 ? value : null; } catch (_) { return null; } };
  const writeBest = (value) => { try { const old = readBest(); if (!old || value < old) localStorage.setItem("weightplay-animal-dewline-best-v1", String(value)); } catch (_) {} };
  const show = (screen) => {
    state.screen = screen;
    ["main", "stage", "battle", "result"].forEach((name) => { $(`${name}Screen`).hidden = name !== screen; });
    document.body.dataset.screen = screen;
  };
  const applyLocale = () => {
    document.documentElement.lang = state.locale;
    document.documentElement.dir = state.locale === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = t(node.dataset.copy); });
    document.querySelectorAll("[data-copy-aria]").forEach((node) => { node.setAttribute("aria-label", t(node.dataset.copyAria)); });
    $("localeSelect").value = state.locale;
    $("localeSelect").setAttribute("aria-label", t("language"));
    $("settingsBtn").setAttribute("aria-label", t("settings"));
    [$("stageSettingsBtn"), $("battleSettingsBtn")].filter(Boolean).forEach((node) => node.setAttribute("aria-label", t("settings")));
    $("soundBtn").textContent = state.sound ? t("soundOn") : t("soundOff");
    $("bestValue").textContent = readBest() || t("noBest");
    if (state.screen === "stage") renderStages();
    if (state.screen === "battle") renderBattle();
    if (state.screen === "result") renderResult();
  };
  const renderStages = () => {
    $("stageList").replaceChildren(...meadows.map((meadow, index) => {
      const button = document.createElement("button");
      button.type = "button"; button.className = "stage-card"; button.dataset.meadow = index;
      button.innerHTML = `<strong>${t("round", { n: index + 1, total: meadows.length })}</strong><span>${meadow.title}</span><small>${meadow.targets.join(" · ")}</small>`;
      button.addEventListener("click", () => startMeadow(index));
      return button;
    }));
  };
  const renderBattle = () => {
    const meadow = meadows[state.meadow];
    $("battleHeading").textContent = meadow.title;
    $("roundLabel").textContent = t("round", { n: state.meadow + 1, total: meadows.length });
    $("battleHint").textContent = t("battleHint");
    $("targetValues").textContent = `${t("target")}: ${meadow.targets.join(" · ")}`;
    $("sessionTries").textContent = String(state.sessionTries);
    $("currentTotal").textContent = String(state.values.reduce((sum, value) => sum + value, 0));
    $("targetTotal").textContent = String(meadow.targets.reduce((sum, value) => sum + value, 0));
    $("valveGrid").replaceChildren(...state.values.map((value, index) => {
      const card = document.createElement("article"); card.className = `valve-card valve-slot-${index + 1}`;
      const art = document.createElement("span"); art.className = `valve-art valve-art-${index + 1}`; art.setAttribute("aria-hidden", "true");
      const label = document.createElement("strong"); label.textContent = t("valve", { n: index + 1 });
      const current = document.createElement("span"); current.className = "valve-value"; current.textContent = `${t("current")}: ${value}`;
      const controls = document.createElement("div"); controls.className = "valve-controls";
      const down = document.createElement("button"); down.type = "button"; down.textContent = "−"; down.setAttribute("aria-label", t("decrease", { n: index + 1 })); down.disabled = value === 0;
      const up = document.createElement("button"); up.type = "button"; up.textContent = "+"; up.setAttribute("aria-label", t("increase", { n: index + 1 })); up.disabled = value === 6;
      down.addEventListener("click", () => changeValve(index, -1)); up.addEventListener("click", () => changeValve(index, 1));
      controls.append(down, up); card.append(art, label, current, controls); return card;
    }));
  };
  const renderResult = () => {
    const complete = state.meadow >= meadows.length - 1;
    $("resultHeading").textContent = complete ? t("finishTitle") : t("correct");
    $("resultText").textContent = complete ? t("finishText", { n: state.sessionTries, best: readBest() || state.sessionTries }) : t("correct");
    $("resultPrimaryBtn").textContent = complete ? t("map") : t("next");
    $("resultMapBtn").hidden = !complete;
    $("resultPrimaryBtn").onclick = complete ? () => { show("stage"); renderStages(); } : () => startMeadow(state.meadow + 1);
  };
  const startSession = () => { state.sessionTries = 0; show("stage"); renderStages(); track("session_start"); };
  const startMeadow = (index) => { state.meadow = Math.max(0, Math.min(meadows.length - 1, index)); state.values = [0, 0, 0]; state.tries = 0; $("battleStatus").textContent = ""; show("battle"); renderBattle(); track("meadow_start", { meadow: state.meadow + 1 }); };
  const changeValve = (index, delta) => { state.values[index] = Math.max(0, Math.min(6, state.values[index] + delta)); renderBattle(); track("valve_adjust", { meadow: state.meadow + 1, valve: index + 1, value: state.values[index] }); };
  const resetValves = () => { state.values = [0, 0, 0]; renderBattle(); $("battleStatus").textContent = t("ready"); track("reset", { meadow: state.meadow + 1 }); };
  const checkFlow = () => {
    const meadow = meadows[state.meadow]; state.tries += 1; state.sessionTries += 1;
    const firstMismatch = meadow.targets.findIndex((target, index) => target !== state.values[index]);
    track("check", { meadow: state.meadow + 1, tries: state.sessionTries, correct: firstMismatch < 0 });
    if (firstMismatch >= 0) { $("battleStatus").textContent = t("wrong", { n: firstMismatch + 1 }); renderBattle(); return; }
    $("battleStatus").textContent = t("correct");
    if (state.meadow >= meadows.length - 1) { writeBest(state.sessionTries); track("session_complete", { tries: state.sessionTries }); }
    show("result"); renderResult();
  };
  $("startBtn").addEventListener("click", startSession);
  $("mapBtn").addEventListener("click", () => { show("stage"); renderStages(); track("meadow_map"); });
  $("stageBackBtn").addEventListener("click", () => show("main"));
  $("battleBackBtn").addEventListener("click", () => { show("stage"); renderStages(); });
  $("resultMapBtn").addEventListener("click", () => { show("stage"); renderStages(); });
  $("resultHomeBtn").addEventListener("click", () => show("main"));
  $("checkBtn").addEventListener("click", checkFlow); $("resetBtn").addEventListener("click", resetValves);
  const toggleSettings = () => { const panel = $("settingsPanel"); panel.hidden = !panel.hidden; [$("settingsBtn"), $("stageSettingsBtn"), $("battleSettingsBtn")].filter(Boolean).forEach((node) => node.setAttribute("aria-expanded", String(!panel.hidden))); };
  [$("settingsBtn"), $("stageSettingsBtn"), $("battleSettingsBtn")].filter(Boolean).forEach((node) => node.addEventListener("click", toggleSettings));
  $("soundBtn").addEventListener("click", () => { state.sound = !state.sound; applyLocale(); track("sound", { enabled: state.sound }); });
  $("localeSelect").addEventListener("change", (event) => { state.locale = copy[event.target.value] ? event.target.value : "en"; try { localStorage.setItem("weightplayLocale", state.locale); } catch (_) {} applyLocale(); track("locale", { locale: state.locale }); });
  try { const saved = localStorage.getItem("weightplayLocale"); if (saved && copy[saved]) state.locale = saved; } catch (_) {}
  window.setTimeout(() => { $("loadingPanel").hidden = true; show("main"); applyLocale(); track("main_ready"); }, 260);
  window.__ANIMAL_DEWLINE_TEST__ = { meadows, startSession, startMeadow, changeValve, checkFlow, getState: () => ({ ...state, values: [...state.values] }) };
})();
