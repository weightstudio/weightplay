(function () {
  "use strict";

  const COPY = window.RING_GARDEN_COPY || {};
  const localeMap = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const routeSegment = window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
  const localeParam = new URLSearchParams(window.location.search).get("lang") || window.__WEIGHTPLAY_ROUTE_LOCALE__ || localeMap[routeSegment];
  let locale = COPY[localeParam] ? localeParam : (localeParam === "ar" ? "ar" : "en");
  const petals = ["amber", "mint", "coral", "violet"];
  const symbols = ["✦", "✿", "✧", "●"];
  const gardens = [
    { key: "gardenOne", clueKey: "gardenOneClue", target: [1, 2, 3], seed: [0, 0, 0] },
    { key: "gardenTwo", clueKey: "gardenTwoClue", target: [3, 1, 2], seed: [0, 0, 0] },
    { key: "gardenThree", clueKey: "gardenThreeClue", target: [2, 3, 1], seed: [0, 0, 0] },
    { key: "gardenFour", clueKey: "gardenFourClue", target: [3, 2, 1], seed: [0, 0, 0] }
  ];
  const state = {
    screen: "main",
    gardenIndex: 0,
    rings: gardens[0].seed.slice(),
    turns: 0,
    sound: true,
    solved: false
  };
  const $ = (id) => document.getElementById(id);
  const bestKey = (index) => `weightplay:animal-ring-garden:v10:best:${index}`;

  function t(key) { return (COPY[locale] && COPY[locale][key]) || COPY.en[key] || key; }
  function fmt(value, n) { return value.replace("{n}", String(n)); }
  function emit(name, detail) {
    window.dispatchEvent(new CustomEvent("weightplay:analytics", { detail: { game: "animal-ring-garden", event: name, ...detail } }));
  }
  function readBest(index) {
    try { return Number(window.localStorage.getItem(bestKey(index))) || null; } catch { return null; }
  }
  function writeBest(index, turns) {
    const prior = readBest(index);
    if (prior !== null && prior <= turns) return prior;
    try { window.localStorage.setItem(bestKey(index), String(turns)); } catch { /* restricted storage is fine */ }
    return turns;
  }
  function applyCopy() {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.title = `${t("title")} | WeightPlay`;
    $("loading-copy").textContent = t("loading");
    $("settings-button").innerHTML = `⚙ <span>${t("settings")}</span>`;
    $("stage-settings").innerHTML = `⚙ <span>${t("settings")}</span>`;
    $("battle-settings").innerHTML = `⚙ <span>${t("settings")}</span>`;
    $("settings-button").setAttribute("aria-label", t("settings"));
    $("stage-settings").setAttribute("aria-label", t("settings"));
    $("battle-settings").setAttribute("aria-label", t("settings"));
    $("settings-title").textContent = t("settings");
    $("language-label").textContent = t("language");
    $("sound-toggle").textContent = state.sound ? t("soundOn") : t("soundOff");
    $("sound-toggle").setAttribute("aria-pressed", String(state.sound));
    $("settings-dialog").querySelector(".close-button").setAttribute("aria-label", t("close"));
    $("main-eyebrow").textContent = t("eyebrow");
    $("main-title").textContent = t("title");
    $("main-header-title").textContent = t("title");
    $("main-lede").textContent = t("lede");
    $("main-summary").textContent = t("summary");
    $("main-summary").setAttribute("aria-label", t("summaryLabel"));
    $("mainProgress").textContent = `${t("progress")}: ${Math.min(state.gardenIndex, gardens.length)} / ${gardens.length}`;
    $("guide-title").textContent = t("guideTitle");
    $("guide-one").textContent = t("guideOne");
    $("guide-two").textContent = t("guideTwo");
    $("guide-three").textContent = t("guideThree");
    $("fact-one").textContent = t("factOne");
    $("fact-two").textContent = t("factTwo");
    $("fact-three").textContent = t("factThree");
    $("settings-button").closest(".main-header").querySelector("[data-wp-return='main']")?.setAttribute("aria-label", t("mainBack"));
    $("mainScreen").querySelector(".main-cover")?.setAttribute("alt", t("mainCoverAlt"));
    $("mainScreen").querySelector(".main-mimi")?.setAttribute("alt", t("guideAlt"));
    $("mainScreen").querySelector(".main-summary")?.setAttribute("aria-label", t("summaryLabel"));
    $("mainScreen").querySelector(".fact-row")?.setAttribute("aria-label", t("factsLabel"));
    document.querySelector("[data-wp-game-guide]")?.setAttribute("aria-label", t("guideLabel"));
    $("startBtn").textContent = t("start");
    $("stage-back").textContent = t("back");
    $("stage-back").setAttribute("aria-label", t("back"));
    $("stage-eyebrow").textContent = t("stageEyebrow");
    $("stage-title").textContent = t("stageTitle");
    $("stage-lede").textContent = t("stageLede");
    $("stageScreen").querySelector(".stage-tabs")?.setAttribute("aria-label", t("stageSections"));
    $("battle-back").textContent = t("gardens");
    $("battle-back").setAttribute("aria-label", t("gardens"));
    $("battle-eyebrow").textContent = t("battleEyebrow");
    $("target-label").textContent = t("target");
    $("battleScreen").querySelector(".target-card")?.setAttribute("aria-label", t("battleTargetLabel"));
    $("battleScreen").querySelector("#ring-board")?.setAttribute("aria-label", t("battleRingsLabel"));
    $("turn-label").textContent = t("turns");
    $("reset-button").textContent = t("reset");
    $("result-eyebrow").textContent = t("complete");
    $("result-title").textContent = t("complete");
    $("result-turn-label").textContent = t("turns");
    $("result-best-label").textContent = t("best");
    $("result-main").textContent = t("backToGardens");
    $("result-panel")?.querySelector(".result-mimi")?.setAttribute("alt", t("resultAlt"));
    $("locale-select").value = locale;
    renderStage();
    if (state.screen === "battle") renderBattle();
  }
  function showScreen(screen) {
    state.screen = screen;
    document.querySelectorAll("[data-screen]").forEach((node) => { node.hidden = node.dataset.screen !== screen; });
    // Stage and Battle are fixed canvases; clear the document flow offset that
    // a focused Main action can leave behind when the Main tree is hidden.
    window.scrollTo(0, 0);
  }
  function renderStage() {
    const list = $("garden-list");
    if (!list) return;
    list.replaceChildren(...gardens.map((garden, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "garden-card stage-card";
      button.dataset.wpStageCard = "true";
      button.dataset.garden = String(index);
      button.innerHTML = `<span class="garden-number">0${index + 1}</span><span class="garden-copy"><strong>${t(garden.key)}</strong><small>${t(garden.clueKey)}</small></span><span class="garden-arrow" aria-hidden="true">→</span>`;
      button.setAttribute("aria-label", `${t("choose")}: ${t(garden.key)}`);
      button.addEventListener("click", () => openGarden(index));
      return button;
    }));
  }
  function patternMarkup(values, className) {
    return `<div class="${className}" aria-label="${t("targetPattern")} ">${values.map((value) => `<span class="pattern-dot ${petals[value]}">${symbols[value]}</span>`).join("")}</div>`;
  }
  function ringMarkup(index) {
    const value = state.rings[index];
    const target = gardens[state.gardenIndex].target[index];
    const aligned = value === target;
    const petalsMarkup = symbols.map((symbol, petalIndex) => `<span class="petal ${petals[petalIndex]}" aria-hidden="true" style="--petal-index:${petalIndex}">${symbol}</span>`).join("");
    const stateClass = aligned ? "ring-aligned" : "ring-needs-turn";
    const stateMark = aligned ? "✓" : "↻";
    return `<article class="ring-unit"><div class="ring-label"><span>${fmt(t("ringName"), index + 1)}</span><span class="ring-state ${stateClass}"><span>${value + 1}/4</span><span class="ring-state-mark" aria-hidden="true">${stateMark}</span></span></div><div class="ring-visual ring-value-${value} ${stateClass}" data-aligned="${aligned}" role="img" aria-label="${fmt(t("ringName"), index + 1)} ${value + 1}/4"><div class="ring-orbit outer-orbit">${petalsMarkup}</div><div class="ring-orbit middle-orbit">${petalsMarkup}</div><div class="ring-orbit inner-orbit"><span class="center-mark">${symbols[target]}</span></div></div><div class="ring-controls"><button type="button" class="ring-button" data-ring="${index}" data-dir="-1" aria-label="${fmt(t("turnLeft"), index + 1)}">↺</button><button type="button" class="ring-button" data-ring="${index}" data-dir="1" aria-label="${fmt(t("turnRight"), index + 1)}">↻</button></div></article>`;
  }
  function renderBattle() {
    const garden = gardens[state.gardenIndex];
    $("battle-title").textContent = t(garden.key);
    $("battle-clue").textContent = t(garden.clueKey);
    $("turn-count").textContent = String(state.turns);
    $("target-pattern").innerHTML = patternMarkup(garden.target, "target-dots");
    $("ring-board").innerHTML = gardens[state.gardenIndex].target.map((_, index) => ringMarkup(index)).join("");
    $("battle-status").textContent = state.solved ? t("complete") : (state.turns ? t("wrong") : t("begin"));
    $("play-panel").hidden = state.solved;
    $("result-panel").hidden = !state.solved;
    if (state.solved) renderResult();
    document.querySelectorAll(".ring-button").forEach((button) => button.addEventListener("click", () => turnRing(Number(button.dataset.ring), Number(button.dataset.dir))));
  }
  function renderResult() {
    const best = writeBest(state.gardenIndex, state.turns);
    $("result-copy").textContent = t("completeCopy");
    $("result-turns").textContent = String(state.turns);
    $("result-best").textContent = best === null ? t("noBest") : String(best);
    $("result-status").textContent = state.gardenIndex === gardens.length - 1 ? t("final") : t("completeCopy");
    $("next-button").textContent = t("next");
    $("next-button").hidden = state.gardenIndex === gardens.length - 1;
  }
  function turnRing(index, direction) {
    if (state.solved) return;
    state.rings[index] = (state.rings[index] + direction + 4) % 4;
    state.turns += 1;
    emit("ring_turn", { garden: state.gardenIndex + 1, ring: index + 1, direction, turns: state.turns });
    if (state.rings.every((value, ringIndex) => value === gardens[state.gardenIndex].target[ringIndex])) {
      state.solved = true;
      emit("garden_complete", { garden: state.gardenIndex + 1, turns: state.turns });
    }
    renderBattle();
  }
  function openGarden(index) {
    state.gardenIndex = index;
    state.rings = gardens[index].seed.slice();
    state.turns = 0;
    state.solved = false;
    showScreen("battle");
    emit("garden_start", { garden: index + 1 });
    renderBattle();
  }
  function resetGarden() {
    state.rings = gardens[state.gardenIndex].seed.slice();
    state.turns = 0;
    state.solved = false;
    emit("garden_reset", { garden: state.gardenIndex + 1 });
    renderBattle();
  }
  function openSettings() { $("settings-dialog").showModal(); }
  function goStage() { state.solved = false; showScreen("stage"); renderStage(); }
  function nextGarden() { openGarden(Math.min(state.gardenIndex + 1, gardens.length - 1)); }

  $("startBtn").addEventListener("click", () => { emit("game_start", {}); goStage(); });
  $("stage-back").addEventListener("click", () => showScreen("main"));
  $("battle-back").addEventListener("click", goStage);
  $("reset-button").addEventListener("click", resetGarden);
  $("result-main").addEventListener("click", goStage);
  $("next-button").addEventListener("click", nextGarden);
  ["settings-button", "stage-settings", "battle-settings"].forEach((id) => $(id).addEventListener("click", openSettings));
  $("sound-toggle").addEventListener("click", () => { state.sound = !state.sound; applyCopy(); emit("sound_toggle", { enabled: state.sound }); });
  $("locale-select").addEventListener("change", (event) => { locale = COPY[event.target.value] ? event.target.value : "en"; applyCopy(); });
  $("settings-dialog").addEventListener("click", (event) => { if (event.target === $("settings-dialog")) $("settings-dialog").close(); });

  applyCopy();
  window.setTimeout(() => { $("loading-screen").hidden = true; showScreen("main"); }, 120);
})();
