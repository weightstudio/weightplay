(() => {
  "use strict";

  const COPY = window.ANIMAL_LANTERN_GUIDES_COPY;
  const SUPPORTED_LOCALES = window.ANIMAL_LANTERN_GUIDES_LOCALES;
  const LOCALE_LABELS = window.ANIMAL_LANTERN_GUIDES_LABELS;
  const SCENES = [
    { safe: "moon", titleKey: "scene1Title", hintKey: "scene1Hint" },
    { safe: "leaf", titleKey: "scene2Title", hintKey: "scene2Hint" },
    { safe: "star", titleKey: "scene3Title", hintKey: "scene3Hint" }
  ];
  const SYMBOLS = ["moon", "leaf", "star"];
  const $ = id => document.getElementById(id);
  const screens = { main: $("mainScreen"), battle: $("battleScreen"), result: $("resultScreen") };
  let locale = "en", sceneIndex = 0, clearHandoffs = 0, light = 3, phase = "scout", feedbackKey = "", clue = null, resultSuccess = null;
  let best = readBest();

  function readBest() { try { return Number(localStorage.getItem("animalLanternGuidesBest") || 0); } catch { return 0; } }
  function saveBest(value) { try { localStorage.setItem("animalLanternGuidesBest", String(value)); } catch { /* session still works when storage is restricted */ } }
  function text(key, vars = {}) {
    const pack = COPY[locale] || COPY.en;
    let value = pack[key] ?? COPY.en[key] ?? key;
    Object.entries(vars).forEach(([name, replacement]) => { value = value.replaceAll(`{${name}}`, String(replacement)); });
    return value;
  }
  function symbolName(id) { return (COPY[locale] || COPY.en).symbols[id] || COPY.en.symbols[id]; }
  function show(name) { Object.entries(screens).forEach(([key, node]) => { node.hidden = key !== name; }); }
  function setText(id, value) { $(id).textContent = value; }

  function applyCopy() {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.title = `${text("title")} | WeightPlay`;
    setText("backLabel", text("back")); setText("eyebrow", text("eyebrow")); setText("title", text("title")); setText("languageLabel", text("language"));
    setText("guideBadge", text("guideBadge")); setText("mainHeading", text("mainHeading")); setText("mainBody", text("mainBody")); setText("startBtn", text("start")); setText("soloNote", text("soloNote"));
    setText("promiseOneTitle", text("scout")); setText("promiseOneBody", text("scoutPromise")); setText("promiseTwoTitle", text("guide")); setText("promiseTwoBody", text("guidePromise")); setText("promiseThreeTitle", text("together")); setText("promiseThreeBody", text("togetherPromise"));
    setText("howTo", text("howTo")); setText("howToBody", text("howToBody")); setText("sceneBadge", text("sceneBadge")); setText("scoutRole", text("scoutRole")); setText("scoutHeading", text("scoutHeading")); setText("scoutTask", text("scoutTask")); setText("guideRole", text("guideRole")); setText("guideHeading", text("guideHeading")); setText("guideTask", text("guideTask")); setText("leaveBtn", text("leave")); setText("footer", text("footer")); setText("resultBadge", text("resultBadge")); setText("replayBtn", text("replay")); setText("homeBtn", text("home"));
    $("localeSelect").value = locale;
    $("localeSelect").setAttribute("aria-label", text("language"));
    $("scoutChoices").setAttribute("aria-label", text("scoutChoicesLabel"));
    $("guideChoices").setAttribute("aria-label", text("guideChoicesLabel"));
    setText("bestLine", best ? text("bestMenu", { n: best }) : "");
    if (!screens.battle.hidden) renderBattle();
    if (!screens.result.hidden) renderResult();
  }

  function makeSymbolButton(id, role) {
    const button = document.createElement("button");
    button.type = "button"; button.className = "symbol-button"; button.dataset.symbol = id; button.dataset.role = role;
    const glyph = document.createElement("span"); glyph.className = "symbol-glyph"; glyph.setAttribute("aria-hidden", "true"); glyph.textContent = id === "moon" ? "☾" : id === "leaf" ? "❧" : "✦";
    const label = document.createElement("span"); label.textContent = symbolName(id);
    button.append(glyph, label); button.setAttribute("aria-label", `${symbolName(id)} — ${text(role === "scout" ? "scoutHeading" : "guideHeading")}`);
    button.addEventListener("click", () => role === "scout" ? scoutChoice(id) : guideChoice(id));
    return button;
  }

  function renderBattle() {
    const scene = SCENES[sceneIndex];
    setText("roundLabel", text("round", { n: sceneIndex + 1, total: SCENES.length })); setText("meterLabel", text("meter", { n: light }));
    setText("sceneTitle", text(scene.titleKey)); setText("sceneHint", text(scene.hintKey));
    const scoutGrid = $("scoutChoices"); const guideGrid = $("guideChoices"); scoutGrid.replaceChildren(); guideGrid.replaceChildren();
    SYMBOLS.forEach(id => { scoutGrid.appendChild(makeSymbolButton(id, "scout")); guideGrid.appendChild(makeSymbolButton(id, "guide")); });
    scoutGrid.querySelectorAll("button").forEach(button => { button.disabled = phase !== "scout"; });
    guideGrid.querySelectorAll("button").forEach(button => { button.disabled = phase !== "guide"; });
    setText("scoutState", phase === "scout" ? text("chooseSymbol") : text("tellGuide", { name: symbolName(clue) }));
    setText("guideState", phase === "guide" ? text("clueReady", { name: symbolName(clue) }) : text("waiting"));
    $("feedback").textContent = feedbackKey ? text(feedbackKey) : "";
    $("feedback").classList.toggle("is-good", feedbackKey === "scoutSuccess" || feedbackKey === "guideSuccess");
  }

  function renderResult() {
    if (resultSuccess === null) return;
    setText("resultTitle", text(resultSuccess ? "completeTitle" : "failTitle"));
    setText("resultBody", text(resultSuccess ? "completeBody" : "failBody", { n: clearHandoffs }));
    setText("scoreLine", text("score", { n: clearHandoffs })); setText("bestLineResult", text("best", { n: best }));
  }

  function startRescue() { sceneIndex = 0; clearHandoffs = 0; light = 3; phase = "scout"; feedbackKey = ""; clue = null; resultSuccess = null; show("battle"); renderBattle(); $("scoutChoices").querySelector("button")?.focus(); }
  function spendLight() { light -= 1; return light > 0; }
  function scoutChoice(id) {
    if (phase !== "scout") return;
    if (id !== SCENES[sceneIndex].safe) { feedbackKey = "scoutWrong"; if (!spendLight()) return finish(false); renderBattle(); return; }
    clue = id; phase = "guide"; feedbackKey = "scoutSuccess"; renderBattle(); $("guideChoices").querySelector("button")?.focus();
  }
  function guideChoice(id) {
    if (phase !== "guide") return;
    if (id !== SCENES[sceneIndex].safe) { feedbackKey = "guideWrong"; phase = "scout"; clue = null; if (!spendLight()) return finish(false); renderBattle(); $("scoutChoices").querySelector("button")?.focus(); return; }
    clearHandoffs += 1; feedbackKey = "guideSuccess";
    if (sceneIndex === SCENES.length - 1) { window.setTimeout(() => finish(true), 420); return; }
    window.setTimeout(() => { sceneIndex += 1; phase = "scout"; clue = null; feedbackKey = ""; renderBattle(); $("scoutChoices").querySelector("button")?.focus(); }, 420);
  }
  function finish(success) { best = Math.max(best, clearHandoffs); saveBest(best); resultSuccess = success; show("result"); renderResult(); $("replayBtn").focus(); }
  function returnHome() { resultSuccess = null; show("main"); setText("bestLine", best ? text("bestMenu", { n: best }) : ""); $("startBtn").focus(); }

  $("startBtn").addEventListener("click", startRescue); $("replayBtn").addEventListener("click", startRescue);
  $("homeBtn").addEventListener("click", returnHome); $("leaveBtn").addEventListener("click", returnHome);
  $("localeSelect").addEventListener("change", event => { locale = SUPPORTED_LOCALES.includes(event.target.value) ? event.target.value : "en"; applyCopy(); });
  $("localeSelect").innerHTML = SUPPORTED_LOCALES.map(code => `<option value="${code}">${LOCALE_LABELS[code]}</option>`).join("");
  applyCopy(); show("main");
})();
