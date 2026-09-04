(() => {
  "use strict";

  const locales = window.ANIMAL_SILHOUETTE_SCOUT_LOCALES || {};
  const routeLocaleMap = {
    en: "en", "zh-tw": "zh-Hant", "zh-hant": "zh-Hant", "zh-cn": "zh-Hans", "zh-hans": "zh-Hans",
    ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar",
  };
  const animals = {
    fox: "🦊", owl: "🦉", rabbit: "🐇", hare: "🐇", badger: "🦡", finch: "🐦",
    duck: "🦆", deer: "🦌", mole: "🐭", otter: "🦦", bear: "🐻", cat: "🐈",
  };
  const atlasAnimals = new Set(["fox", "rabbit", "owl", "deer"]);
  const rounds = [
    { id: 1, arc: 1, nameKey: "name1", clueKey: "clue1", target: "fox", options: ["fox", "rabbit", "badger"], mode: "match" },
    { id: 2, arc: 1, nameKey: "name2", clueKey: "clue2", target: "owl", options: ["owl", "finch", "duck"], mode: "match" },
    { id: 3, arc: 1, nameKey: "name3", clueKey: "clue3", target: "hare", options: ["hare", "deer", "mole"], mode: "match" },
    { id: 4, arc: 1, nameKey: "name4", clueKey: "clue4", target: "rabbit", options: ["rabbit", "fox", "hare"], mode: "habitat" },
    { id: 5, arc: 1, nameKey: "name5", clueKey: "clue5", target: "owl", options: ["owl", "duck", "finch"], mode: "avoid", checkpoint: true },
    { id: 6, arc: 2, nameKey: "name6", clueKey: "clue6", target: "deer", options: ["deer", "hare", "fox"], mode: "match" },
    { id: 7, arc: 2, nameKey: "name7", clueKey: "clue7", target: "otter", options: ["otter", "duck", "badger"], mode: "habitat" },
    { id: 8, arc: 2, nameKey: "name8", clueKey: "clue8", target: "cat", options: ["cat", "fox", "mole"], mode: "avoid" },
    { id: 9, arc: 2, nameKey: "name9", clueKey: "clue9", target: "bear", options: ["bear", "badger", "deer"], mode: "match" },
    { id: 10, arc: 2, nameKey: "name10", clueKey: "clue10", targets: ["rabbit", "deer"], options: ["rabbit", "deer", "fox", "owl"], mode: "pair", checkpoint: true },
    { id: 11, arc: 3, nameKey: "name11", clueKey: "clue11", target: "badger", options: ["badger", "mole", "bear"], mode: "match" },
    { id: 12, arc: 3, nameKey: "name12", clueKey: "clue12", target: "finch", options: ["finch", "owl", "duck"], mode: "habitat" },
    { id: 13, arc: 3, nameKey: "name13", clueKey: "clue13", target: "mole", options: ["mole", "rabbit", "cat"], mode: "avoid" },
    { id: 14, arc: 3, nameKey: "name14", clueKey: "clue14", target: "duck", options: ["duck", "otter", "finch"], mode: "match" },
    { id: 15, arc: 3, nameKey: "name15", clueKey: "clue15", targets: ["fox", "owl"], options: ["fox", "owl", "rabbit", "deer"], mode: "sequence", checkpoint: true },
    { id: 16, arc: 4, nameKey: "name16", clueKey: "clue16", target: "otter", options: ["otter", "duck", "bear"], mode: "match" },
    { id: 17, arc: 4, nameKey: "name17", clueKey: "clue17", target: "cat", options: ["cat", "mole", "fox"], mode: "habitat" },
    { id: 18, arc: 4, nameKey: "name18", clueKey: "clue18", target: "deer", options: ["deer", "hare", "rabbit"], mode: "avoid" },
    { id: 19, arc: 4, nameKey: "name19", clueKey: "clue19", target: "bear", options: ["bear", "badger", "otter"], mode: "match" },
    { id: 20, arc: 4, nameKey: "name20", clueKey: "clue20", targets: ["owl", "duck"], options: ["owl", "duck", "finch", "otter"], mode: "pair", checkpoint: true },
    { id: 21, arc: 5, nameKey: "name21", clueKey: "clue21", target: "hare", options: ["hare", "rabbit", "deer"], mode: "match" },
    { id: 22, arc: 5, nameKey: "name22", clueKey: "clue22", target: "badger", options: ["badger", "bear", "mole"], mode: "habitat" },
    { id: 23, arc: 5, nameKey: "name23", clueKey: "clue23", target: "rabbit", options: ["rabbit", "hare", "fox"], mode: "avoid" },
    { id: 24, arc: 5, nameKey: "name24", clueKey: "clue24", target: "fox", options: ["fox", "cat", "badger"], mode: "match" },
    { id: 25, arc: 5, nameKey: "name25", clueKey: "clue25", targets: ["deer", "bear"], options: ["deer", "bear", "hare", "otter"], mode: "sequence", checkpoint: true },
    { id: 26, arc: 6, nameKey: "name26", clueKey: "clue26", target: "owl", options: ["owl", "finch", "duck"], mode: "match" },
    { id: 27, arc: 6, nameKey: "name27", clueKey: "clue27", target: "otter", options: ["otter", "duck", "bear"], mode: "avoid" },
    { id: 28, arc: 6, nameKey: "name28", clueKey: "clue28", target: "cat", options: ["cat", "mole", "fox"], mode: "habitat" },
    { id: 29, arc: 6, nameKey: "name29", clueKey: "clue29", targets: ["fox", "hare"], options: ["fox", "hare", "rabbit", "badger"], mode: "pair" },
    { id: 30, arc: 6, nameKey: "name30", clueKey: "clue30", targets: ["owl", "deer"], options: ["owl", "deer", "fox", "bear"], mode: "sequence", checkpoint: true },
  ];
  const state = {
    locale: "en", round: 0, selected: [], checks: 0, sessionChecks: 0, screen: "main", unlocked: 1, cleared: new Set(),
  };
  const $ = (id) => document.getElementById(id);
  let mainMapObserver;
  const progressKey = "weightplay-animal-silhouette-scout-progress-v4";
  const t = (key, vars = {}) => {
    const table = locales[state.locale] || locales.en || {};
    let value = table[key] || locales.en?.[key] || key;
    Object.entries(vars).forEach(([name, replacement]) => { value = value.replaceAll(`{${name}}`, String(replacement)); });
    return value;
  };
  const readProgress = () => {
    try {
      const raw = JSON.parse(localStorage.getItem(progressKey) || "null");
      state.unlocked = Math.max(1, Math.min(rounds.length, Number(raw?.unlocked) || 1));
      state.cleared = new Set(Array.isArray(raw?.cleared) ? raw.cleared.map(Number).filter((id) => id >= 1 && id <= rounds.length) : []);
    } catch (_) {}
  };
  const saveProgress = () => {
    try { localStorage.setItem(progressKey, JSON.stringify({ unlocked: state.unlocked, cleared: [...state.cleared].sort((a, b) => a - b) })); } catch (_) {}
  };
  const readBest = () => {
    try {
      const values = ["weightplay-animal-silhouette-scout-best-v4", "weightplay-animal-silhouette-scout-best-v3"]
        .map((key) => Number(localStorage.getItem(key))).filter((value) => Number.isFinite(value) && value > 0);
      return values.length ? Math.min(...values) : null;
    } catch (_) { return null; }
  };
  const saveBest = () => {
    try {
      const old = readBest();
      if (!old || state.sessionChecks < old) localStorage.setItem("weightplay-animal-silhouette-scout-best-v4", String(state.sessionChecks));
    } catch (_) {}
  };
  const show = (screen) => {
    state.screen = screen;
    document.querySelectorAll("section[data-screen], main[data-screen]").forEach((node) => { node.hidden = node.dataset.screen !== screen; });
    document.body.dataset.screen = screen;
  };
  const targetsFor = (round) => round.targets || [round.target];
  const isMulti = (round) => targetsFor(round).length > 1;
  const selectedFor = () => Array.isArray(state.selected) ? state.selected : (state.selected ? [state.selected] : []);
  const artClass = (animal, base) => atlasAnimals.has(animal) ? `${base} scout-art scout-art-${animal}` : `${base} scout-target-fallback`;
  const moveMainMapEntry = () => {
    const map = $("mapBtn");
    const copy = document.querySelector(".wp-standard-main-copy");
    if (map && copy && !copy.contains(map)) { copy.append(map); mainMapObserver?.disconnect(); }
  };
  const openStage = () => { show("stage"); renderStages(); };
  const renderStages = () => {
    $("mainProgress").textContent = `${t("lookouts")}: ${state.cleared.size} / ${rounds.length}`;
    $("stageList").replaceChildren(...rounds.map((round, index) => {
      const unlocked = index < state.unlocked;
      const complete = state.cleared.has(round.id);
      const button = document.createElement("button");
      button.type = "button";
      button.className = `stage-card${complete ? " complete" : ""}${round.checkpoint ? " checkpoint" : ""}`;
      button.setAttribute("role", "listitem");
      button.setAttribute("aria-disabled", String(!unlocked));
      button.setAttribute("aria-label", `${t(round.nameKey)}. ${unlocked ? (complete ? t("complete") : t("open")) : t("locked")}`);
      button.dataset.stage = String(round.id);
      button.innerHTML = `<strong>${t("round", { n: round.id, total: rounds.length })}</strong><span>${t(round.nameKey)}</span><small>${unlocked ? (complete ? t("complete") : t("open")) : t("locked")}</small>`;
      button.disabled = !unlocked;
      if (unlocked) button.onclick = () => startRound(index);
      return button;
    }));
  };
  const renderTarget = (round) => {
    const targetNode = $("silhouette");
    const targetAnimals = targetsFor(round);
    targetNode.className = targetAnimals.length > 1 ? "silhouette target-set" : artClass(targetAnimals[0], "silhouette");
    targetNode.replaceChildren(...targetAnimals.map((animal, index) => {
      if (targetAnimals.length === 1) return document.createTextNode(atlasAnimals.has(animal) ? "" : animals[animal]);
      const node = document.createElement("div");
      node.className = artClass(animal, "scout-target-art");
      if (!atlasAnimals.has(animal)) node.textContent = animals[animal];
      node.setAttribute("aria-label", `${index + 1}. ${t(animal)}`);
      return node;
    }));
  };
  const renderBattle = () => {
    const round = rounds[state.round];
    const selected = selectedFor();
    $("roundName").textContent = t(round.nameKey);
    $("roundLabel").textContent = t("round", { n: round.id, total: rounds.length });
    $("checkCount").textContent = t("checks", { n: state.sessionChecks });
    $("clue").textContent = t(round.clueKey);
    $("targetLabel").textContent = t(round.mode === "sequence" ? "sequenceTargetLabel" : round.mode === "pair" ? "pairTargetLabel" : "targetLabel");
    renderTarget(round);
    $("choiceGrid").replaceChildren(...round.options.map((animal) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "choice-btn";
      button.setAttribute("aria-pressed", String(selected.includes(animal)));
      button.innerHTML = `<span class="choice-emoji${atlasAnimals.has(animal) ? ` scout-art scout-art-${animal}` : ""}" aria-hidden="true">${atlasAnimals.has(animal) ? "" : animals[animal]}</span><strong>${t(animal)}</strong>`;
      button.onclick = () => {
        if (isMulti(round)) {
          const next = [...selected];
          const existing = next.indexOf(animal);
          if (existing >= 0) next.splice(existing, 1);
          else if (next.length < targetsFor(round).length) next.push(animal);
          state.selected = next;
        } else state.selected = animal;
        renderBattle();
        $("battleStatus").textContent = t("chosen");
      };
      return button;
    }));
    $("checkBtn").disabled = selected.length < targetsFor(round).length;
  };
  const renderResult = () => {
    const done = state.round === rounds.length - 1;
    const next = state.round + 1;
    $("resultTitle").textContent = done ? t("resultTitle") : t("resultPartial");
    $("resultText").textContent = t("resultText", { count: state.cleared.size, total: rounds.length, checks: state.sessionChecks });
    $("resultPrimaryBtn").textContent = done ? t("map") : t("next");
    $("resultPrimaryBtn").onclick = done ? openStage : () => startRound(next, true);
    $("resultMapBtn").hidden = done;
  };
  const startRound = (index, continueSession = false) => {
    if (index < 0 || index >= rounds.length || index >= state.unlocked) return;
    state.round = index;
    state.selected = [];
    state.checks = 0;
    if (!continueSession) state.sessionChecks = 0;
    show("battle");
    renderBattle();
    $("battleStatus").textContent = t("waiting");
  };
  const check = () => {
    const round = rounds[state.round];
    const selected = selectedFor();
    if (selected.length < targetsFor(round).length) { $("battleStatus").textContent = t("waiting"); return; }
    state.checks += 1;
    state.sessionChecks += 1;
    const expected = targetsFor(round);
    const correct = round.mode === "sequence"
      ? selected.length === expected.length && selected.every((animal, index) => animal === expected[index])
      : selected.length === expected.length && expected.every((animal) => selected.includes(animal));
    if (!correct) {
      state.selected = [];
      renderBattle();
      $("battleStatus").textContent = t("wrong");
      return;
    }
    state.cleared.add(round.id);
    state.unlocked = Math.max(state.unlocked, Math.min(rounds.length, round.id + 1));
    saveProgress();
    $("battleStatus").textContent = t("correct");
    if (round.id === rounds.length) { saveBest(); $("bestValue").textContent = readBest() || t("noBest"); }
    show("result");
    renderResult();
  };
  const resetToMain = () => { state.round = 0; state.selected = []; state.sessionChecks = 0; show("main"); renderStages(); };
  $("startBtn").onclick = openStage;
  $("mapBtn").onclick = openStage;
  $("stageBackBtn").onclick = resetToMain;
  $("battleBackBtn").onclick = () => { show("stage"); renderStages(); };
  $("resultMapBtn").onclick = openStage;
  $("resultHomeBtn").onclick = resetToMain;
  $("checkBtn").onclick = check;
  $("clearBtn").onclick = () => { state.selected = []; renderBattle(); $("battleStatus").textContent = t("waiting"); };
  $("battleUtilityBtn").onclick = () => { $("battleStatus").textContent = t("waiting"); $("battleUtilityBtn").setAttribute("aria-pressed", "true"); };
  $("settingsBtn").onclick = () => { $("settingsPanel").hidden = !$("settingsPanel").hidden; };
  $("localeSelect").onchange = (event) => {
    state.locale = locales[event.target.value] ? event.target.value : "en";
    try { localStorage.setItem("weightplayLocale", state.locale); } catch (_) {}
    applyLocale();
  };
  const initialLocale = () => {
    const query = new URLSearchParams(window.location.search).get("lang");
    if (query && locales[query]) return query;
    const segment = window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
    if (routeLocaleMap[segment] && locales[routeLocaleMap[segment]]) return routeLocaleMap[segment];
    try { const saved = localStorage.getItem("weightplayLocale"); if (saved && locales[saved]) return saved; } catch (_) {}
    return "en";
  };
  const applyLocale = () => {
    document.documentElement.lang = state.locale;
    document.documentElement.dir = state.locale === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = t(node.dataset.copy); });
    document.querySelectorAll("[data-copy-aria]").forEach((node) => node.setAttribute("aria-label", t(node.dataset.copyAria)));
    $("localeSelect").value = state.locale;
    $("localeSelect").setAttribute("aria-label", t("language"));
    $("mainProgress").textContent = `${t("lookouts")}: ${state.cleared.size} / ${rounds.length}`;
    $("bestValue").textContent = readBest() || t("noBest");
    if (state.screen === "stage") renderStages();
    if (state.screen === "battle") renderBattle();
    if (state.screen === "result") renderResult();
    localizeAccessibility();
  };
  function localizeAccessibility() {
    const labels = [["#stageList", "aria-label", "stageSelector"], [".stage-tabs", "aria-label", "lookoutSections"], ["#choiceGrid", "aria-label", "animalChoices"], [".game-page-info", "aria-label", "gameInfo"]];
    labels.forEach(([selector, attribute, key]) => document.querySelector(selector)?.setAttribute(attribute, t(key)));
    document.querySelector(".cover")?.setAttribute("alt", t("coverAlt"));
    const guideKicker = document.querySelector(".game-info-kicker");
    if (guideKicker) guideKicker.textContent = t("originalGuide");
    const utility = $("battleUtilityBtn");
    if (utility) utility.title = t("settings");
    document.title = t("pageTitle");
  }
  readProgress();
  state.locale = initialLocale();
  applyLocale();
  show("main");
  mainMapObserver = new MutationObserver(moveMainMapEntry);
  mainMapObserver.observe(document.body, { childList: true, subtree: true });
  moveMainMapEntry();
  const placeScoutGuide = (attempt = 0) => {
    const image = document.querySelector(".scout-guide");
    const copy = document.querySelector(".wp-standard-main-copy");
    if (image && copy && !copy.contains(image)) copy.prepend(image);
    if ((!image || !copy) && attempt < 40) window.setTimeout(() => placeScoutGuide(attempt + 1), 50);
  };
  placeScoutGuide();
  window.__ANIMAL_SILHOUETTE_SCOUT_TEST__ = { rounds, startRound, check, getState: () => ({ ...state, cleared: [...state.cleared] }) };
})();
