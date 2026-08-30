(function () {
  "use strict";
  const locales = window.ANIMAL_CAIRN_COURIER_LOCALES || {};
  const rounds = [
    { name: "Cedar Landing", note: "note1", solution: ["base", "middle", "cap"] },
    { name: "Fern Turn", note: "note2", solution: ["base", "cap", "middle"] },
    { name: "Moon Ridge", note: "note3", solution: ["middle", "base", "cap"] }
  ];
  const stones = [
    { id: "base", key: "stoneBase", mark: "◒", weight: "1" },
    { id: "middle", key: "stoneMiddle", mark: "◓", weight: "2" },
    { id: "cap", key: "stoneCap", mark: "✦", weight: "3" }
  ];
  const $ = (id) => document.getElementById(id);
  const state = { locale: "en", round: 0, stack: [], picks: 0, sessionPicks: 0, sound: true, screen: "main" };
  const t = (key, vars = {}) => {
    const table = locales[state.locale] || locales.en || {};
    let value = table[key] || (locales.en && locales.en[key]) || key;
    Object.entries(vars).forEach(([name, valueForName]) => { value = value.replaceAll(`{${name}}`, String(valueForName)); });
    return value;
  };
  const track = (name, data = {}) => { window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: `animal_cairn_courier_${name}`, round: state.round + 1, ...data }); };
  const readBest = () => { try { const value = Number(localStorage.getItem("weightplay-animal-cairn-courier-best-v2")); return Number.isFinite(value) && value > 0 ? value : null; } catch (_) { return null; } };
  const writeBest = () => { try { const old = readBest(); if (!old || state.sessionPicks < old) localStorage.setItem("weightplay-animal-cairn-courier-best-v2", String(state.sessionPicks)); } catch (_) {} };
  const show = (screen) => { state.screen = screen; document.querySelectorAll("[data-screen]").forEach((node) => { node.hidden = node.dataset.screen !== screen; }); };
  const applyLocale = () => {
    document.documentElement.lang = state.locale;
    document.documentElement.dir = state.locale === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = t(node.dataset.copy); });
    $("localeSelect").value = state.locale;
    $("soundBtn").textContent = state.sound ? t("soundOn") : t("soundOff");
    $("bestValue").textContent = readBest() || t("noBest");
    $("settingsBtn").setAttribute("aria-label", t("settings"));
    $("localeSelect").setAttribute("aria-label", t("language"));
    if (state.screen === "stages") renderStages();
    if (state.screen === "battle") renderBattle();
    if (state.screen === "result") renderResult();
  };
  const renderStages = () => { $("stageList").replaceChildren(...rounds.map((round, index) => { const button = document.createElement("button"); button.type = "button"; button.className = "stage-card"; button.innerHTML = `<span><strong>${t("round", { n: index + 1, total: rounds.length })}</strong><small>${round.name} · ${index < state.round ? t("complete") : t("open")}</small></span><span class="stage-mark">${index < state.round ? "✓" : "→"}</span>`; button.addEventListener("click", () => startRound(index)); return button; })); };
  const renderBattle = () => {
    const round = rounds[state.round];
    $("roundLabel").textContent = t("round", { n: state.round + 1, total: rounds.length });
    $("roundName").textContent = round.name;
    $("trailNote").textContent = t(round.note);
    $("selectionCount").textContent = t("selected", { n: state.stack.length });
    $("stack").replaceChildren(...state.stack.map((id, index) => { const stone = stones.find((item) => item.id === id); const node = document.createElement("span"); node.className = "stack-stone"; node.innerHTML = `<b>${index + 1}</b><span aria-hidden="true">${stone.mark}</span><small>${t(stone.key)}</small>`; return node; }));
    $("stoneTray").replaceChildren(...stones.map((stone) => { const button = document.createElement("button"); button.type = "button"; button.className = "stone-btn"; button.disabled = state.stack.includes(stone.id); button.setAttribute("aria-label", t(stone.key)); button.innerHTML = `<span class="stone-mark" aria-hidden="true">${stone.mark}</span><span>${t(stone.key)}</span><small>${t("selected", { n: stone.weight })}</small>`; button.addEventListener("click", () => pickStone(stone.id)); return button; }));
    $("battleStatus").textContent = $("battleStatus").dataset.message ? t($("battleStatus").dataset.message) : "";
  };
  const renderResult = () => { const done = state.round >= rounds.length - 1; $("resultTitle").textContent = done ? t("resultTitle") : t("resultPartial"); $("resultText").textContent = t("resultText", { count: Math.min(state.round + 1, rounds.length), total: rounds.length, picks: state.sessionPicks }); $("resultPrimaryBtn").textContent = done ? t("map") : t("next"); $("resultPrimaryBtn").onclick = done ? () => { show("stages"); renderStages(); } : () => startRound(state.round + 1); $("resultMapBtn").hidden = done; };
  const startRound = (index) => { state.round = Math.max(0, Math.min(rounds.length - 1, index)); state.stack = []; state.picks = 0; $("battleStatus").dataset.message = ""; if (index === 0) state.sessionPicks = 0; show("battle"); renderBattle(); track("round_start"); };
  const pickStone = (id) => { if (state.stack.length >= stones.length) return; state.stack.push(id); state.picks += 1; state.sessionPicks += 1; track("stone_pick", { stone: id }); renderBattle(); };
  const checkStack = () => { const correct = JSON.stringify(state.stack) === JSON.stringify(rounds[state.round].solution); track("stack_check", { correct, picks: state.picks }); if (correct) { $("battleStatus").dataset.message = "correct"; if (state.round === rounds.length - 1) { writeBest(); track("session_complete", { picks: state.sessionPicks }); } show("result"); renderResult(); } else { $("battleStatus").dataset.message = "wrong"; state.stack = []; renderBattle(); } };
  const clearStack = () => { state.stack = []; $("battleStatus").dataset.message = "waiting"; renderBattle(); track("stack_clear"); };
  const setLocale = (locale) => { state.locale = locales[locale] ? locale : "en"; try { localStorage.setItem("weightplayLocale", state.locale); } catch (_) {} applyLocale(); track("locale", { locale: state.locale }); };
  $("startBtn").addEventListener("click", () => startRound(0));
  $("mapBtn").addEventListener("click", () => { show("stages"); renderStages(); track("map_open"); });
  $("stageBackBtn").addEventListener("click", () => show("main"));
  $("battleBackBtn").addEventListener("click", () => { show("stages"); renderStages(); });
  $("resultMapBtn").addEventListener("click", () => { show("stages"); renderStages(); });
  $("resultHomeBtn").addEventListener("click", () => show("main"));
  $("checkBtn").addEventListener("click", checkStack);
  $("clearBtn").addEventListener("click", clearStack);
  $("settingsBtn").addEventListener("click", () => { $("settingsPanel").hidden = !$("settingsPanel").hidden; });
  $("soundBtn").addEventListener("click", () => { state.sound = !state.sound; applyLocale(); track("sound", { enabled: state.sound }); });
  $("localeSelect").addEventListener("change", (event) => setLocale(event.target.value));
  try { const saved = localStorage.getItem("weightplayLocale"); if (saved && locales[saved]) state.locale = saved; } catch (_) {}
  window.setTimeout(() => { $("loadingPanel").hidden = true; $("mainScreen").hidden = false; applyLocale(); track("main_ready"); }, 180);
  window.__ANIMAL_CAIRN_COURIER_TEST__ = { rounds, stones, startRound, pickStone, checkStack, getState: () => ({ ...state, stack: [...state.stack] }) };
}());
