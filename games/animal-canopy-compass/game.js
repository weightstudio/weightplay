(function () {
  "use strict";

  const copy = window.CANOPY_COMPASS_LOCALES || {};
  const supportedLocales = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const routeLocaleMap = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const rounds = [
    { hint: "stageHint1", clue: "clue1", target: 1 },
    { hint: "stageHint2", clue: "clue2", target: 2 },
    { hint: "stageHint3", clue: "clue3", target: 3 },
  ];
  const names = ["north", "east", "south", "west"];
  const $ = (id) => document.getElementById(id);
  const normalizeLocale = (value) => {
    if (value === "zh-TW") return "zh-Hant";
    if (value === "zh-CN") return "zh-Hans";
    if (value?.toLowerCase?.().startsWith("pt")) return "pt-BR";
    if (supportedLocales.includes(value)) return value;
    const short = value?.split?.("-")?.[0];
    return supportedLocales.includes(short) ? short : "en";
  };
  const routeSegment = window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
  const routeLocale = routeLocaleMap[routeSegment] || window.__WEIGHTPLAY_ROUTE_LOCALE__;
  const savedLocale = (() => { try { return localStorage.getItem("weightPlayLocale") || localStorage.getItem("weightplayLocale") || localStorage.getItem("wp-locale"); } catch (_) { return null; } })();
  const state = { locale: normalizeLocale(routeLocale || window.WonderI18n?.localeFromPath?.() || savedLocale || document.documentElement.lang), screen: "main", round: 0, direction: 0, turns: 0, completed: [], sound: true };
  const get = (key, fallback = "") => { try { return localStorage.getItem(key) || fallback; } catch (_) { return fallback; } };
  const set = (key, value) => { try { localStorage.setItem(key, value); } catch (_) {} };
  const t = (key, vars = {}) => {
    let value = (copy[state.locale] || copy.en || {})[key] || (copy.en || {})[key] || key;
    Object.entries(vars).forEach(([name, replacement]) => { value = value.replace(new RegExp("\\{" + name + "\\}", "g"), String(replacement)); });
    return value;
  };
  const showToast = (message) => {
    const toast = $("toast");
    toast.textContent = message;
    toast.classList.add("visible");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("visible"), 1600);
  };
  const setScreen = (name) => {
    state.screen = name;
    document.body.dataset.screen = name;
    ["main", "stage", "battle"].forEach((screen) => { $(`${screen}Screen`).hidden = screen !== name; });
    $("settingsPanel").hidden = true;
    $("settingsBtn").setAttribute("aria-expanded", "false");
    if (name === "stage") renderStages();
    if (name === "battle") renderBattle();
    if (name === "main") applyLocale();
    window.scrollTo(0, 0);
  };
  const applyLocale = () => {
    document.documentElement.lang = state.locale === "zh-Hant" ? "zh-TW" : state.locale;
    document.documentElement.dir = state.locale === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = t(node.dataset.copy); });
    $("settingsBtn").setAttribute("aria-label", t("settings"));
    $("settingsPanel").setAttribute("aria-label", t("settings"));
    $("localeSelect").setAttribute("aria-label", t("language"));
    $("localeSelect").value = state.locale;
    $("soundBtn").textContent = state.sound ? t("soundOn") : t("soundOff");
    $("soundBtn").setAttribute("aria-pressed", String(state.sound));
    $("battleSound").setAttribute("aria-label", state.sound ? t("soundOn") : t("soundOff"));
    $("battleSound").setAttribute("title", state.sound ? t("soundOn") : t("soundOff"));
    $("stageHelp").setAttribute("aria-label", t("help"));
    $("stageHelp").setAttribute("title", t("help"));
    $("stageHeading").setAttribute("aria-label", t("map"));
    $("battleMap").setAttribute("aria-label", t("map"));
    $("stageScreen").setAttribute("aria-label", t("map"));
    $("directionRack").setAttribute("aria-label", t("directionChoices"));
    $("progress").textContent = t("progress", { count: state.completed.length });
    document.querySelector(".wp-shell-return")?.setAttribute("aria-label", t("lobbyReturn"));
    document.querySelector(".stage-tabs")?.setAttribute("aria-label", t("stageSections"));
    if (state.screen === "stage") renderStages();
    if (state.screen === "battle") renderBattle();
  };
  const renderStages = () => {
    $("stageList").innerHTML = rounds.map((round, index) => `<button class="stage-card${state.completed.includes(index) ? " done" : ""}" type="button" data-stage="${index}"><span class="stage-number">${t("round", { number: index + 1, total: rounds.length })}</span><h3>${t(round.hint)}</h3><p>${t(round.hint)}</p><span class="stage-chip">${state.completed.includes(index) ? t("complete") : t("readyStage")}</span></button>`).join("");
    $("stageList").querySelectorAll("[data-stage]").forEach((button) => button.addEventListener("click", () => startRound(Number(button.dataset.stage))));
  };
  const renderDirectionButtons = () => {
    const rack = $("directionRack");
    rack.replaceChildren();
    names.forEach((name, index) => {
      const button = document.createElement("button");
      button.className = `direction${state.direction === index ? " active" : ""}`;
      button.type = "button";
      button.textContent = t(name);
      button.setAttribute("aria-pressed", String(state.direction === index));
      button.addEventListener("click", () => { state.direction = index; state.turns += 1; renderBattle(); $("status").textContent = t("changed", { direction: t(name) }); });
      rack.append(button);
    });
  };
  const renderBattle = () => {
    const round = rounds[state.round];
    $("battleHeading").textContent = t("title");
    $("roundLabel").textContent = t("round", { number: state.round + 1, total: rounds.length });
    $("hint").textContent = t(round.hint);
    $("badge").textContent = `${state.completed.length}/${rounds.length}`;
    $("clueText").textContent = t(round.clue);
    $("compass").className = `compass direction-${state.direction}`;
    $("compass").setAttribute("aria-label", t("compassLabel"));
    $("facing").textContent = t("facing", { direction: t(names[state.direction]) });
    renderDirectionButtons();
    $("result").hidden = true;
    $("checkBtn").disabled = false;
    $("resetBtn").disabled = false;
  };
  const startRound = (index) => { state.round = Math.max(0, Math.min(rounds.length - 1, index)); state.direction = 0; state.turns = 0; setScreen("battle"); $("status").textContent = t("ready"); };
  const startSession = () => { setScreen("stage"); };
  const check = () => {
    const round = rounds[state.round];
    if (state.direction !== round.target) { $("status").textContent = t("wrong"); return; }
    state.completed = state.completed.includes(state.round) ? state.completed : [...state.completed, state.round];
    $("progress").textContent = t("progress", { count: state.completed.length });
    $("status").textContent = t("correct");
    $("checkBtn").disabled = true;
    $("resetBtn").disabled = true;
    const final = state.round === rounds.length - 1;
    const bestKey = "weightplay-animal-canopy-compass-best";
    const old = Number(get(bestKey, "0"));
    if (final && (!old || state.turns < old)) set(bestKey, String(state.turns));
    $("resultTitle").textContent = t(final ? "finishTitle" : "resultTitle");
    $("resultText").textContent = t(final ? "finishText" : "resultText");
    $("stats").textContent = t("stats", { turns: state.turns, best: final ? Math.min(state.turns, old || state.turns) : old || t("noBest") });
    $("resultPrimary").textContent = t(final ? "replay" : "next");
    $("resultPrimary").onclick = () => final ? startRound(0) : startRound(state.round + 1);
    $("result").hidden = false;
  };
  $("startBtn").addEventListener("click", startSession);
  $("mapBtn").addEventListener("click", () => setScreen("stage"));
  $("stageBack").addEventListener("click", () => setScreen("main"));
  $("stageHelp").addEventListener("click", () => showToast(t("mapIntro")));
  $("battleBack").addEventListener("click", () => setScreen("stage"));
  $("battleMap").addEventListener("click", () => setScreen("stage"));
  $("checkBtn").addEventListener("click", check);
  $("resetBtn").addEventListener("click", () => { state.direction = 0; state.turns = 0; renderBattle(); $("status").textContent = t("ready"); });
  $("resultMap").addEventListener("click", () => setScreen("stage"));
  $("resultHome").addEventListener("click", () => setScreen("main"));
  $("settingsBtn").addEventListener("click", () => { const panel = $("settingsPanel"); panel.hidden = !panel.hidden; $("settingsBtn").setAttribute("aria-expanded", String(!panel.hidden)); });
  $("soundBtn").addEventListener("click", () => { state.sound = !state.sound; set("weightplay-canopy-compass-sound", state.sound ? "on" : "off"); applyLocale(); });
  $("battleSound").addEventListener("click", () => { state.sound = !state.sound; set("weightplay-canopy-compass-sound", state.sound ? "on" : "off"); applyLocale(); });
  $("closeSettings")?.addEventListener("click", () => { $("settingsPanel").hidden = true; $("settingsBtn").setAttribute("aria-expanded", "false"); });
  $("localeSelect").addEventListener("change", (event) => { state.locale = normalizeLocale(event.target.value); set("weightPlayLocale", state.locale); set("weightplayLocale", state.locale); set("wp-locale", state.locale); applyLocale(); });
  document.addEventListener("keydown", (event) => {
    if (state.screen !== "battle" || !$("result").hidden) return;
    if ((event.key === "Enter" || event.key === " ") && document.activeElement === $("compass")) { event.preventDefault(); check(); return; }
    const directionMap = { ArrowUp: 0, ArrowRight: 1, ArrowDown: 2, ArrowLeft: 3 };
    if (!(event.key in directionMap)) return;
    event.preventDefault();
    state.direction = directionMap[event.key];
    state.turns += 1;
    renderBattle();
    $("status").textContent = t("changed", { direction: t(names[state.direction]) });
  });
  state.sound = get("weightplay-canopy-compass-sound", "on") !== "off";
  setTimeout(() => { $("loadingPanel").hidden = true; $("mainScreen").hidden = false; applyLocale(); }, 280);
}());
