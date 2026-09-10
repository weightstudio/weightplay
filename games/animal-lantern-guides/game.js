(() => {
  "use strict";

  const COPY = window.ANIMAL_LANTERN_GUIDES_COPY;
  const SUPPORTED_LOCALES = window.ANIMAL_LANTERN_GUIDES_LOCALES;
  const LOCALE_LABELS = window.ANIMAL_LANTERN_GUIDES_LABELS;
  const ROUTE_LOCALE_MAP = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const SYMBOLS = ["moon", "leaf", "star"];
  const GLYPHS = { moon: "☾", leaf: "❧", star: "✦" };
  const CHAPTERS = [
    { key: "chapter1", ruleKey: "ruleSame", shifts: [0, 0, 0, 0, 0] },
    { key: "chapter2", ruleKey: "ruleNext", shifts: [1, 1, 1, 1, 1] },
    { key: "chapter3", ruleKey: "rulePrevious", shifts: [-1, -1, -1, -1, -1] },
    { key: "chapter4", ruleKey: "ruleEcho", shifts: [2, 2, 2, 2, 2] },
    { key: "chapter5", ruleKey: "ruleWeather", shifts: [1, -1, 1, -1, 1] },
    { key: "chapter6", ruleKey: "ruleMastery", shifts: [-1, 1, 2, 0, 1] }
  ];
  const STAGE_NAMES = ["Mossy Bridge", "Fern Hollow", "Owl Lookout", "Firefly Bend", "Badger Gate"];
  const STAGES = CHAPTERS.flatMap((chapter, chapterIndex) => chapter.shifts.map((shift, slot) => {
    const number = chapterIndex * 5 + slot + 1;
    const signal = SYMBOLS[(number + chapterIndex + slot) % SYMBOLS.length];
    return {
      number,
      chapter: chapterIndex,
      checkpoint: slot === 4,
      signal,
      shift,
      answer: SYMBOLS[(SYMBOLS.indexOf(signal) + shift + SYMBOLS.length * 2) % SYMBOLS.length],
      ruleKey: shift === 0 ? "ruleSame" : shift === 1 ? "ruleNext" : "rulePrevious",
      name: STAGE_NAMES[slot]
    };
  }));
  const $ = id => document.getElementById(id);
  const screens = { main: $("mainScreen"), stage: $("stageScreen"), battle: $("battleScreen"), result: $("resultScreen") };

  function preferredLocale() {
    const segment = window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
    const candidates = [window.__WEIGHTPLAY_ROUTE_LOCALE__, ROUTE_LOCALE_MAP[segment]];
    try { candidates.push(localStorage.getItem("weightPlayLocale"), localStorage.getItem("weightplayLocale"), localStorage.getItem("wp-locale")); } catch { /* restricted storage is supported */ }
    candidates.push(document.documentElement.lang);
    return candidates.find(code => SUPPORTED_LOCALES.includes(code)) || "en";
  }

  function readNumber(key, fallback) {
    try {
      const value = Number(localStorage.getItem(key));
      return Number.isFinite(value) && value > 0 ? value : fallback;
    } catch { return fallback; }
  }
  function saveNumber(key, value) { try { localStorage.setItem(key, String(value)); } catch { /* session still works */ } }

  let locale = preferredLocale();
  let soundEnabled = true;
  let stageIndex = 0;
  let unlocked = Math.min(30, readNumber("animalLanternGuidesUnlocked", 1));
  let best = Math.min(30, readNumber("animalLanternGuidesBest", 0));
  let light = 3;
  let phase = "scout";
  let feedbackKey = "";
  let clueVisible = false;
  let resultSuccess = null;

  function text(key, vars = {}) {
    const pack = COPY[locale] || COPY.en;
    let value = pack[key] ?? COPY.en[key] ?? key;
    Object.entries(vars).forEach(([name, replacement]) => { value = value.replaceAll(`{${name}}`, String(replacement)); });
    return value;
  }
  function symbolName(id) { return (COPY[locale] || COPY.en).symbols[id] || COPY.en.symbols[id]; }
  function setText(id, value) { const node = $(id); if (node) node.textContent = value; }
  function focusNoScroll(node) { node?.focus({ preventScroll: true }); }

  function show(name) {
    Object.entries(screens).forEach(([key, node]) => { node.hidden = key !== name; });
    $("settingsPanel").hidden = true;
    $("mainGuide").hidden = name !== "main";
    [$("settingsBtn"), $("stageSettingsBtn"), $("battleSettingsBtn")].forEach(button => button?.setAttribute("aria-expanded", "false"));
    document.body.dataset.screen = name;
    window.scrollTo(0, 0);
  }

  function toggleSettings() {
    const panel = $("settingsPanel");
    const opening = panel.hidden;
    panel.hidden = !opening;
    [$("settingsBtn"), $("stageSettingsBtn"), $("battleSettingsBtn")].forEach(button => button?.setAttribute("aria-expanded", String(opening)));
  }

  function stageTitle(stage) {
    return text(stage.checkpoint ? "checkpointName" : "stageName", { n: stage.number, name: stage.name });
  }

  function applyCopy() {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.title = `${text("title")} | WeightPlay`;
    document.querySelector('[data-wp-return="main"]')?.setAttribute("aria-label", text("back"));
    [$("settingsBtn"), $("stageSettingsBtn"), $("battleSettingsBtn")].forEach(button => button?.setAttribute("aria-label", text("settings")));
    setText("battleBackLabel", text("back")); setText("stageBackLabel", text("back"));
    setText("eyebrow", text("eyebrow")); setText("title", text("title")); setText("languageLabel", text("language")); setText("settingsLabel", text("settings")); setText("soundBtn", text(soundEnabled ? "soundOn" : "soundOff"));
    setText("guideBadge", text("guideBadge")); setText("mainHeading", text("mainHeading")); setText("mainBody", text("mainBody")); setText("progressTitle", text("progressTitle")); setText("progressBody", text("progressBody")); setText("startBtn", text("start")); setText("soloNote", text("soloNote"));
    setText("promiseOneTitle", text("scout")); setText("promiseOneBody", text("scoutPromise")); setText("promiseTwoTitle", text("guide")); setText("promiseTwoBody", text("guidePromise")); setText("promiseThreeTitle", text("together")); setText("promiseThreeBody", text("togetherPromise"));
    setText("howTo", text("howTo")); setText("howToBody", text("howToBody")); setText("stageBadge", text("stageBadge")); setText("stageTitle", text("stageTitle")); setText("stageHelp", text("stageHelp"));
    setText("stageOverviewTab", text("stageTitle")); setText("sceneBadge", text("sceneBadge")); setText("scoutRole", text("scoutRole")); setText("scoutHeading", text("scoutHeading")); setText("scoutTask", text("scoutTask")); setText("guideRole", text("guideRole")); setText("guideHeading", text("guideHeading")); setText("guideTask", text("guideTask")); setText("passBtn", text("passClue")); setText("leaveBtn", text("leave")); setText("footer", text("footer")); setText("resultBadge", text("resultBadge")); setText("replayBtn", text("replay")); setText("homeBtn", text("stageMap")); setText("nextBtn", text("nextStage"));
    $("localeSelect").value = locale;
    $("localeSelect").setAttribute("aria-label", text("language"));
    $("scoutChoices").setAttribute("aria-label", text("scoutChoicesLabel"));
    $("guideChoices").setAttribute("aria-labelledby", "guideHeading");
    $("guideChoices").setAttribute("aria-describedby", "guideTask guideRule");
    setText("bestLine", text("bestMenu", { n: best, total: STAGES.length }));
    if (!screens.stage.hidden) renderStage();
    if (!screens.battle.hidden) renderBattle();
    if (!screens.result.hidden) renderResult();
  }

  function makeSymbolButton(id) {
    const button = document.createElement("button");
    button.type = "button"; button.className = "symbol-button"; button.dataset.symbol = id; button.dataset.role = "guide";
    const glyph = document.createElement("span"); glyph.className = "symbol-glyph"; glyph.setAttribute("aria-hidden", "true"); glyph.textContent = GLYPHS[id];
    const label = document.createElement("span"); label.textContent = symbolName(id);
    button.append(glyph, label); button.setAttribute("aria-label", symbolName(id)); button.addEventListener("click", () => guideChoice(id));
    return button;
  }

  function renderStage() {
    setText("stageProgress", text("stageProgress", { unlocked, total: STAGES.length }));
    const map = $("chapterMap"); map.replaceChildren();
    CHAPTERS.forEach((chapter, chapterIndex) => {
      const card = document.createElement("article"); card.className = "chapter-card";
      const heading = document.createElement("h3"); heading.textContent = text(chapter.key);
      const rule = document.createElement("p"); rule.textContent = text(chapter.ruleKey);
      // This five-button chapter grid is intentionally not the shared horizontal
      // Stage rail.  Its old generic class was picked up by the shared rail CSS,
      // pushing Trail 1 off the phone viewport.
      const grid = document.createElement("div"); grid.className = "lantern-stage-grid";
      STAGES.filter(stage => stage.chapter === chapterIndex).forEach(stage => {
        const button = document.createElement("button");
        button.type = "button"; button.className = "stage-button"; button.disabled = stage.number > unlocked; button.dataset.stage = String(stage.number); button.dataset.wpStageCard = ""; button.setAttribute("aria-disabled", String(button.disabled));
        button.innerHTML = `<strong>${stage.checkpoint ? "✦ " : ""}${stage.number}</strong><span>${stage.checkpoint ? text("checkpoint") : text("trail")}</span>`;
        button.setAttribute("aria-label", `${stageTitle(stage)}${button.disabled ? ` — ${text("locked")}` : ""}`);
        button.addEventListener("click", () => startStage(stage.number - 1)); grid.appendChild(button);
      });
      card.append(heading, rule, grid); map.appendChild(card);
    });
  }

  function showStage() { show("stage"); renderStage(); focusNoScroll($("chapterMap").querySelector(`button[data-stage="${Math.min(unlocked, 30)}"]`) || $("stageBackBtn")); }

  function renderBattle() {
    const stage = STAGES[stageIndex];
    setText("roundLabel", text("round", { n: stage.number, total: STAGES.length })); setText("meterLabel", text("meter", { n: light }));
    setText("sceneTitle", stageTitle(stage)); setText("sceneHint", text(stage.checkpoint ? "checkpointHint" : "sceneHint", { chapter: text(CHAPTERS[stage.chapter].key) }));
    setText("handoffPrompt", phase === "guide" ? text("phaseGuide") : clueVisible ? text("phasePass") : text("phaseScout"));
    const exactRuleKey = stage.shift === 0 ? "ruleSame" : stage.shift === 1 ? "ruleNext" : "rulePrevious";
    setText("guideRule", phase === "guide" ? `${text(stage.ruleKey)} ${text(exactRuleKey)}` : text("ruleHidden"));
    const scoutGrid = $("scoutChoices"); const guideGrid = $("guideChoices"); scoutGrid.replaceChildren(); guideGrid.replaceChildren();
    const reveal = document.createElement("button"); reveal.type = "button"; reveal.className = "symbol-button reveal-button"; reveal.dataset.role = "scout";
    reveal.innerHTML = clueVisible ? `<span class="symbol-glyph" aria-hidden="true">${GLYPHS[stage.signal]}</span><span>${symbolName(stage.signal)}</span>` : `<span class="symbol-glyph" aria-hidden="true">?</span><span>${text("reveal")}</span>`;
    reveal.setAttribute("aria-label", clueVisible ? text("privateSignal", { name: symbolName(stage.signal) }) : text("reveal")); reveal.disabled = phase !== "scout" || clueVisible; reveal.addEventListener("click", revealSignal); scoutGrid.appendChild(reveal);
    SYMBOLS.forEach(id => guideGrid.appendChild(makeSymbolButton(id))); guideGrid.querySelectorAll("button").forEach(button => { button.disabled = phase !== "guide"; });
    setText("scoutState", clueVisible ? text("privateSignal", { name: symbolName(stage.signal) }) : phase === "guide" ? text("clueHidden") : text("chooseSymbol"));
    setText("guideState", phase === "guide" ? text("clueReady") : text("waiting")); $("passBtn").hidden = !(phase === "scout" && clueVisible);
    $("feedback").textContent = feedbackKey ? text(feedbackKey) : ""; $("feedback").classList.toggle("is-good", feedbackKey === "scoutSuccess" || feedbackKey === "guideSuccess");
  }

  function renderResult() {
    if (resultSuccess === null) return;
    const stage = STAGES[stageIndex]; const mastery = resultSuccess && stage.number === 30;
    setText("resultTitle", text(resultSuccess ? mastery ? "masteryTitle" : "completeTitle" : "failTitle"));
    setText("resultBody", text(resultSuccess ? mastery ? "masteryBody" : "completeBody" : "failBody", { n: stage.number }));
    setText("scoreLine", text("score", { n: stage.number })); setText("bestLineResult", text("best", { n: best, total: STAGES.length }));
    $("nextBtn").hidden = !resultSuccess || stage.number >= STAGES.length;
  }

  function startStage(index) {
    if (index + 1 > unlocked) return;
    stageIndex = index; light = 3; phase = "scout"; feedbackKey = ""; clueVisible = false; resultSuccess = null;
    show("battle"); renderBattle(); focusNoScroll($("scoutChoices").querySelector("button"));
  }
  function revealSignal() { if (phase !== "scout" || clueVisible) return; clueVisible = true; feedbackKey = "scoutSuccess"; renderBattle(); focusNoScroll($("passBtn")); }
  function passToGuide() { if (phase !== "scout" || !clueVisible) return; phase = "guide"; clueVisible = false; feedbackKey = ""; renderBattle(); focusNoScroll($("guideChoices").querySelector("button")); }
  function guideChoice(id) {
    if (phase !== "guide") return;
    const stage = STAGES[stageIndex];
    if (id !== stage.answer) {
      light -= 1; feedbackKey = "guideWrong";
      if (light <= 0) { finish(false); return; }
      phase = "scout"; clueVisible = false; renderBattle(); focusNoScroll($("scoutChoices").querySelector("button")); return;
    }
    feedbackKey = "guideSuccess"; window.setTimeout(() => finish(true), 360);
  }
  function finish(success) {
    resultSuccess = success;
    if (success) {
      best = Math.max(best, stageIndex + 1); unlocked = Math.max(unlocked, Math.min(STAGES.length, stageIndex + 2));
      saveNumber("animalLanternGuidesBest", best); saveNumber("animalLanternGuidesUnlocked", unlocked);
    }
    show("result"); renderResult(); focusNoScroll(success && stageIndex < STAGES.length - 1 ? $("nextBtn") : $("replayBtn"));
  }

  $("startBtn").addEventListener("click", showStage);
  $("stageBackBtn").addEventListener("click", () => { show("main"); focusNoScroll($("startBtn")); });
  $("battleBackBtn").addEventListener("click", showStage); $("leaveBtn").addEventListener("click", showStage); $("homeBtn").addEventListener("click", showStage);
  $("replayBtn").addEventListener("click", () => startStage(stageIndex)); $("nextBtn").addEventListener("click", () => startStage(Math.min(stageIndex + 1, STAGES.length - 1))); $("passBtn").addEventListener("click", passToGuide);
  [$("settingsBtn"), $("stageSettingsBtn"), $("battleSettingsBtn")].forEach(button => button?.addEventListener("click", toggleSettings));
  $("soundBtn").addEventListener("click", () => { soundEnabled = !soundEnabled; applyCopy(); });
  $("localeSelect").addEventListener("change", event => {
    locale = SUPPORTED_LOCALES.includes(event.target.value) ? event.target.value : "en";
    try { localStorage.setItem("weightPlayLocale", locale); localStorage.setItem("wp-locale", locale); } catch { /* restricted storage is supported */ }
    applyCopy();
  });
  $("localeSelect").innerHTML = SUPPORTED_LOCALES.map(code => `<option value="${code}">${LOCALE_LABELS[code]}</option>`).join("");
  applyCopy(); show("main");
})();
