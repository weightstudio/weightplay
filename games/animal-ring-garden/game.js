(() => {
  "use strict";

  const COPY = window.RING_GARDEN_COPY || {};
  const localeMap = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const routeSegment = window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
  const routeLocale = window.__WEIGHTPLAY_ROUTE_LOCALE__ || localeMap[routeSegment] || "en";
  let locale = COPY[routeLocale] ? routeLocale : "en";
  const petals = ["amber", "mint", "coral", "violet"];
  const symbols = ["✦", "✿", "✧", "●"];
  const gardens = [
    { key: "gardenOne", clueKey: "gardenOneClue", target: [1, 2, 3], seed: [0, 0, 0] },
    { key: "gardenTwo", clueKey: "gardenTwoClue", target: [3, 1, 2], seed: [0, 0, 0] },
    { key: "gardenThree", clueKey: "gardenThreeClue", target: [2, 3, 1], seed: [0, 0, 0] },
    { key: "gardenFour", clueKey: "gardenFourClue", target: [3, 2, 1], seed: [0, 0, 0] },
  ];
  const progressKey = "weightplay:animal-ring-garden:v10:completed";
  const $ = (id) => document.getElementById(id);
  const bestKey = (index) => "weightplay:animal-ring-garden:v10:best:" + index;

  function readCompletedGardens() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(progressKey) || "[]");
      return new Set(Array.isArray(saved)
        ? saved.filter((index) => Number.isInteger(index) && index >= 0 && index < gardens.length)
        : []);
    } catch {
      return new Set();
    }
  }

  const state = {
    screen: "main",
    gardenIndex: 0,
    stageBrowseIndex: gardens.length - 1,
    rings: gardens[0].seed.slice(),
    turns: 0,
    solved: false,
    completedGardens: readCompletedGardens(),
  };

  function t(key) { return (COPY[locale] && COPY[locale][key]) || COPY.en?.[key] || key; }
  function fmt(value, n) { return String(value).replace("{n}", String(n)); }
  function emit(name, detail = {}) {
    window.dispatchEvent(new CustomEvent("weightplay:analytics", { detail: { game: "animal-ring-garden", event: name, ...detail } }));
  }
  function notifyState() { window.dispatchEvent(new Event("weightplay:ring-garden-state-change")); }
  function readBest(index) {
    try { return Number(window.localStorage.getItem(bestKey(index))) || null; } catch { return null; }
  }
  function writeBest(index, turns) {
    const prior = readBest(index);
    if (prior !== null && prior <= turns) return prior;
    try { window.localStorage.setItem(bestKey(index), String(turns)); } catch { /* restricted storage is fine */ }
    return turns;
  }
  function writeCompletedGardens() {
    try {
      window.localStorage.setItem(progressKey, JSON.stringify([...state.completedGardens].sort((a, b) => a - b)));
    } catch { /* restricted storage is fine */ }
  }
  function renderMainProgress() {
    $("mainProgress").textContent = t("progress") + ": " + state.completedGardens.size + " / " + gardens.length;
  }

  function stageRecord(index) {
    const garden = gardens[index];
    const clue = t(garden.clueKey);
    const poster = "/games/animal-ring-garden/assets/animal-ring-garden-cover.png";
    return {
      id: "garden-" + (index + 1),
      kicker: String(index + 1).padStart(2, "0") + " / " + gardens.length,
      title: t(garden.key),
      subtitle: clue,
      status: state.completedGardens.has(index) ? t("complete") : "",
      summary: clue,
      details: [clue],
      locked: false,
      cleared: state.completedGardens.has(index),
      poster,
      posterPosition: "center",
    };
  }

  function headerState() {
    return {
      stageName: t(gardens[state.stageBrowseIndex].key),
      stageIndex: String(state.stageBrowseIndex + 1) + " / " + gardens.length,
      battleName: t(gardens[state.gardenIndex].key),
      turns: t("turns") + " " + state.turns,
    };
  }

  function renderStageProgress() {
    renderMainProgress();
    notifyState();
    window.dispatchEvent(new Event("weightplay:stage-sync"));
  }

  function applyCopy() {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.title = t("title") + " | WeightPlay";
    $("language-label").textContent = t("language");
    $("main-header-title").textContent = t("title");
    $("main-eyebrow").textContent = t("eyebrow");
    $("main-title").textContent = t("title");
    $("main-lede").textContent = t("lede");
    $("main-summary").textContent = t("summary");
    $("main-summary").setAttribute("aria-label", t("summaryLabel"));
    $("mainProgress").setAttribute("aria-label", t("progress"));
    renderMainProgress();
    $("fact-one").textContent = t("factOne");
    $("fact-two").textContent = t("factTwo");
    $("fact-three").textContent = t("factThree");
    $("startBtn").textContent = t("start");
    $("mainScreen").querySelector('[data-wp-return="main"]')?.setAttribute("aria-label", t("mainBack"));
    $("mainScreen").querySelector(".main-cover")?.setAttribute("alt", t("mainCoverAlt"));

    $("gameGuide")?.setAttribute("aria-label", t("guideLabel"));
    const guideCopyNodes = [
      ["guide-kicker", "guideKicker"], ["guide-title", "guideTitle"], ["guide-intro", "guideIntro"],
      ["guide-steps-title", "guideStepsTitle"], ["guide-one", "guideOne"],
      ["guide-two", "guideTwo"], ["guide-three", "guideThree"],
    ];
    guideCopyNodes.forEach(([id, key]) => {
      const node = $(id);
      if (node) node.textContent = t(key);
    });

    $("stage-back").setAttribute("aria-label", t("back"));
    $("stage-header-title").textContent = t("stageTitle");
    $("stageWorkspace").setAttribute("aria-label", t("stageSections"));
    $("garden-list").setAttribute("aria-label", t("stageSections"));

    $("battle-back").setAttribute("aria-label", t("gardens"));
    $("battle-header-title").textContent = t("battleEyebrow");
    $("battle-eyebrow").textContent = t("battleEyebrow");
    $("battle-title").textContent = t(gardens[state.gardenIndex].key);
    $("target-label").textContent = t("target");
    $("battleContent").setAttribute("aria-label", t("battleTargetLabel"));
    $("target-pattern").setAttribute("aria-label", t("targetPattern"));
    $("ring-board").setAttribute("aria-label", t("battleRingsLabel"));
    $("reset-button").textContent = t("reset");
    $("result-eyebrow").textContent = t("complete");
    $("result-title").textContent = t("complete");
    $("result-turn-label").textContent = t("turns");
    $("result-best-label").textContent = t("best");
    $("result-main").textContent = t("backToGardens");
    $("next-button").textContent = t("next");
    $("result-retry").textContent = t("replay");
    $("result-panel").querySelector(".result-mimi")?.setAttribute("alt", t("resultAlt"));

    $("ring-leave-title").textContent = t("leaveTitle");
    $("ring-leave-copy").textContent = t("leaveBody");
    $("ring-leave-continue").textContent = t("continueBattle");
    $("ring-leave-stages").textContent = t("returnToMap");
    $("leaveConfirm").querySelector("form")?.setAttribute("aria-label", t("leaveTitle"));

    $("locale").value = locale;
    if (state.screen === "battle") renderBattle();
    window.dispatchEvent(new Event("wonder:locale-change"));
    notifyState();
  }

  function showScreen(screen) {
    state.screen = screen;
    document.body.dataset.screen = screen;
    document.querySelectorAll("[data-screen]").forEach((node) => {
      node.hidden = node.dataset.screen !== screen;
    });
    window.dispatchEvent(new CustomEvent("weightplay:game-view-change", { detail: { screen } }));
  }

  function patternMarkup(values, className) {
    return '<div class="' + className + '" aria-label="' + t("targetPattern") + '">' +
      values.map((value) => '<span class="pattern-dot ' + petals[value] + '">' + symbols[value] + "</span>").join("") +
      "</div>";
  }

  function ringMarkup(index) {
    const value = state.rings[index];
    const target = gardens[state.gardenIndex].target[index];
    const aligned = value === target;
    const petalsMarkup = symbols.map((symbol, petalIndex) => '<span class="petal ' + petals[petalIndex] + '" aria-hidden="true" style="--petal-index:' + petalIndex + '">' + symbol + "</span>").join("");
    const stateClass = aligned ? "ring-aligned" : "ring-needs-turn";
    const stateMark = aligned ? "✓" : "↻";
    const label = fmt(t("ringName"), index + 1);
    return '<article class="ring-unit"><div class="ring-label"><span>' + label + '</span><span class="ring-state ' + stateClass + '"><span>' + (value + 1) + '/4</span><span class="ring-state-mark" aria-hidden="true">' + stateMark + '</span></span></div><div class="ring-visual ring-value-' + value + " " + stateClass + '" data-aligned="' + aligned + '" role="img" aria-label="' + label + " " + (value + 1) + '/4"><div class="ring-orbit outer-orbit">' + petalsMarkup + '</div><div class="ring-orbit middle-orbit">' + petalsMarkup + '</div><div class="ring-orbit inner-orbit"><span class="center-mark">' + symbols[target] + '</span></div></div><div class="ring-controls"><button type="button" class="ring-button" data-ring="' + index + '" data-dir="-1" aria-label="' + fmt(t("turnLeft"), index + 1) + '">↺</button><button type="button" class="ring-button" data-ring="' + index + '" data-dir="1" aria-label="' + fmt(t("turnRight"), index + 1) + '">↻</button></div></article>';
  }

  function renderResult() {
    const best = writeBest(state.gardenIndex, state.turns);
    $("result-copy").textContent = t("completeCopy");
    $("result-turns").textContent = String(state.turns);
    $("result-best").textContent = best === null ? t("noBest") : String(best);
    $("result-status").textContent = state.completedGardens.size === gardens.length ? t("final") : t("completeCopy");
    $("next-button").disabled = state.gardenIndex === gardens.length - 1;
  }

  function renderBattle() {
    const garden = gardens[state.gardenIndex];
    $("battle-title").textContent = t(garden.key);
    $("battle-clue").textContent = t(garden.clueKey);
    $("target-pattern").innerHTML = patternMarkup(garden.target, "target-dots");
    $("ring-board").innerHTML = garden.target.map((_, index) => ringMarkup(index)).join("");
    $("battle-status").textContent = state.solved ? t("complete") : (state.turns ? t("wrong") : t("begin"));
    $("play-panel").hidden = state.solved;
    $("result-panel").hidden = !state.solved;
    if (state.solved) renderResult();
    document.querySelectorAll(".ring-button").forEach((button) => {
      button.addEventListener("click", () => turnRing(Number(button.dataset.ring), Number(button.dataset.dir)));
    });
    notifyState();
  }

  function turnRing(index, direction) {
    if (state.solved) return;
    state.rings[index] = (state.rings[index] + direction + 4) % 4;
    state.turns += 1;
    emit("ring_turn", { garden: state.gardenIndex + 1, ring: index + 1, direction, turns: state.turns });
    if (state.rings.every((value, ringIndex) => value === gardens[state.gardenIndex].target[ringIndex])) {
      state.solved = true;
      state.completedGardens.add(state.gardenIndex);
      writeCompletedGardens();
      emit("garden_complete", { garden: state.gardenIndex + 1, turns: state.turns });
      renderStageProgress();
    }
    renderBattle();
  }

  function selectStage(index) {
    const next = Math.max(0, Math.min(gardens.length - 1, Math.round(Number(index) || 0)));
    state.stageBrowseIndex = next;
    notifyState();
  }

  function openGarden(index) {
    const selected = Math.max(0, Math.min(gardens.length - 1, Math.round(Number(index) || 0)));
    state.gardenIndex = selected;
    state.stageBrowseIndex = selected;
    state.rings = gardens[selected].seed.slice();
    state.turns = 0;
    state.solved = false;
    showScreen("battle");
    emit("garden_start", { garden: selected + 1 });
    renderBattle();
  }

  function resetGarden() {
    state.rings = gardens[state.gardenIndex].seed.slice();
    state.turns = 0;
    state.solved = false;
    emit("garden_reset", { garden: state.gardenIndex + 1 });
    renderBattle();
  }

  function goStage() {
    if ($("leaveConfirm").open) $("leaveConfirm").close();
    state.solved = false;
    state.stageBrowseIndex = state.gardenIndex;
    showScreen("stage");
    window.dispatchEvent(new Event("weightplay:stage-sync"));
  }

  function requestBattleBack() {
    if (!state.solved && state.turns > 0) {
      $("leaveConfirm").returnValue = "";
      $("leaveConfirm").showModal();
      $("ring-leave-continue").focus();
      return;
    }
    goStage();
  }

  function nextGarden() {
    if (state.gardenIndex < gardens.length - 1) openGarden(state.gardenIndex + 1);
  }

  function setLocale(nextLocale) {
    locale = COPY[nextLocale] ? nextLocale : "en";
    applyCopy();
  }

  $("startBtn").addEventListener("click", () => { emit("game_start"); showScreen("stage"); });
  $("stage-back").addEventListener("click", () => showScreen("main"));
  $("battle-back").addEventListener("click", requestBattleBack);
  $("reset-button").addEventListener("click", resetGarden);
  $("result-main").addEventListener("click", goStage);
  $("next-button").addEventListener("click", nextGarden);
  $("result-retry").addEventListener("click", resetGarden);
  $("ring-leave-stages").addEventListener("click", (event) => {
    event.preventDefault();
    $("leaveConfirm").close("leave");
    goStage();
  });
  $("leaveConfirm").addEventListener("close", () => {
    if ($("leaveConfirm").returnValue === "leave" && state.screen === "battle") goStage();
  });
  $("locale").addEventListener("change", (event) => setLocale(event.target.value));

  window.AnimalRingGardenGame = Object.freeze({
    stageCount: gardens.length,
    get stageBrowseIndex() { return state.stageBrowseIndex; },
    selectStage,
    startGarden: openGarden,
    stageRecord,
    headerState,
    setLocale,
  });

  applyCopy();
  showScreen("main");
})();
