(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const locales = window.GLYPH_GARDEN_LOCALES || {};
  const localeMap = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const GAME_VERSION = "v8";
  const shapes = ["circle", "triangle", "square", "star", "diamond", "heart"];
  const colors = ["blue", "gold", "violet", "green", "coral", "amber"];
  const stageBlueprints = [
    ["circle", "blue", ["both"]], ["triangle", "gold", ["both"]], ["square", "violet", ["both"]], ["star", "green", ["both"]], ["diamond", "coral", ["both", "both"]],
    ["heart", "amber", ["shape"]], ["star", "blue", ["shape"]], ["diamond", "gold", ["shape"]], ["circle", "violet", ["shape"]], ["square", "green", ["shape", "shape"]],
    ["triangle", "coral", ["color"]], ["heart", "blue", ["color"]], ["diamond", "violet", ["color"]], ["star", "amber", ["color"]], ["circle", "gold", ["color", "color"]],
    ["square", "coral", ["both", "both"]], ["triangle", "green", ["both", "both"]], ["heart", "violet", ["both", "both"]], ["diamond", "amber", ["both", "both"]], ["star", "gold", ["both", "both", "both"]],
    ["circle", "green", ["shape", "color"]], ["square", "blue", ["color", "shape"]], ["heart", "coral", ["shape", "color"]], ["triangle", "violet", ["color", "shape"]], ["diamond", "green", ["both", "shape", "color"]],
    ["star", "coral", ["shape", "both", "color"]], ["heart", "gold", ["color", "both", "shape"]], ["circle", "amber", ["both", "color", "shape"]], ["square", "gold", ["shape", "color", "both"]], ["triangle", "blue", ["both", "shape", "color", "both"]],
  ];
  const makeTarget = (shape, color, offset) => ({ shape: shapes[(shapes.indexOf(shape) + offset * 2) % shapes.length], color: colors[(colors.indexOf(color) + offset * 3) % colors.length] });
  const makeOptions = (target, stageIndex, stepIndex) => {
    const options = [target];
    for (let offset = 1; options.length < 6; offset += 1) {
      const item = { shape: shapes[(shapes.indexOf(target.shape) + offset + stageIndex) % shapes.length], color: colors[(colors.indexOf(target.color) + offset + stageIndex + stepIndex) % colors.length] };
      if (!options.some((candidate) => candidate.shape === item.shape && candidate.color === item.color)) options.push(item);
    }
    const rotation = (stageIndex * 2 + stepIndex) % options.length;
    return options.slice(rotation).concat(options.slice(0, rotation));
  };
  const plots = stageBlueprints.map(([shape, color, modes], stageIndex) => {
    const targets = modes.map((mode, stepIndex) => ({ ...makeTarget(shape, color, stepIndex), mode }));
    return { arc: Math.floor(stageIndex / 5) + 1, targets, options: targets.map((target, stepIndex) => makeOptions(target, stageIndex, stepIndex)) };
  });
  const safeStorage = {
    get(key, fallback = "") { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch { /* Private browsing may disable storage. */ } },
  };
  const pathLocale = location.pathname.split("/").filter(Boolean).map((value) => localeMap[value.toLowerCase()] || "").find(Boolean);
  let locale = pathLocale || safeStorage.get("weightPlayLocale", "en");
  if (!locales[locale]) locale = "en";
  let plotIndex = 0;
  let selected = null;
  let stepIndex = 0;
  let frameUI = null;
  let unlocked = Math.max(1, Math.min(plots.length, Number(safeStorage.get("weightplay-glyph-garden-unlocked-v4", "1")) || 1));
  let solvedValues = [];
  try { solvedValues = JSON.parse(safeStorage.get("weightplay-glyph-garden-solved-v4", "[]") || "[]"); } catch { solvedValues = []; }
  const solved = new Set((Array.isArray(solvedValues) ? solvedValues : []).filter((value) => Number.isInteger(value) && value >= 0 && value < plots.length));
  let checks = 0;

  try {
    window.WeightPlayGameRuntimeLocalizer = window.WeightPlayGameRuntimeLocalizer || {};
    if (Object.isExtensible(window.WeightPlayGameRuntimeLocalizer)) window.WeightPlayGameRuntimeLocalizer["animal-glyph-garden"] = { locales };
  } catch { /* The game dictionary remains the fallback. */ }

  const copy = (key, vars = {}) => Object.entries(vars).reduce((out, [name, value]) => out.replaceAll(`{${name}}`, String(value)), (locales[locale] || locales.en)[key] || locales.en[key] || key);
  const label = (item) => `${copy(item.shape)} · ${copy(item.color)}`;
  const playSound = (id) => window.WeightPlayAudio?.play(id);
  const announce = (name, data = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: `glyph_garden_${name}`, game_version: GAME_VERSION, interface_version: 9, plot: plotIndex + 1, ...data });
  };
  const bestText = () => safeStorage.get("weightplay-glyph-garden-best-v4", "—") || "—";
  const stageName = (index) => {
    const names = (locales[locale] || locales.en).stageNames;
    return Array.isArray(names) && names[index] ? names[index] : copy("stageLabel", { number: index + 1 });
  };
  const stageHint = (index) => {
    const plot = plots[index];
    return `${copy(`arc${plot.arc}`)} · ${plot.targets.map((target) => copy(`rule${target.mode[0].toUpperCase()}${target.mode.slice(1)}`)).join(" → ")}`;
  };
  function stageRecord(index) {
    const plot = plots[index];
    if (!plot) throw new RangeError(`GLYPH_GARDEN_STAGE_INDEX:${index}`);
    const locked = index >= unlocked;
    const hint = stageHint(index);
    return {
      id: index + 1,
      kicker: copy(`arc${plot.arc}`),
      title: stageName(index),
      subtitle: copy("stageLabel", { number: index + 1 }),
      status: solved.has(index) ? "✓" : locked ? copy("locked") : "",
      summary: hint,
      details: [hint],
      locked,
      cleared: solved.has(index),
    };
  }
  window.GlyphGardenGame = Object.freeze({ stageRecord });

  function shapeGlyph(item, extra = "") {
    const element = document.createElement("span");
    element.className = `glyph ${item.shape} ${item.color} ${extra}`;
    element.setAttribute("aria-hidden", "true");
    const image = document.createElement("img");
    image.src = `assets/glyph-${item.shape}-voxel-v1.png`;
    image.alt = "";
    image.draggable = false;
    element.append(image);
    return element;
  }
  function renderMainProgress() {
    const progress = $("mainProgress");
    if (progress) progress.textContent = copy("campaignProgress", { unlocked, cleared: solved.size, total: plots.length, best: bestText() });
  }
  function refreshStage() {
    frameUI?.stageUI.refresh(plotIndex);
  }
  function updateBattleHeader() {
    const plot = plots[plotIndex];
    if (!plot || !frameUI) return;
    frameUI.battleArc.textContent = copy(`arc${plot.arc}`);
    $("progressPill").textContent = `${plotIndex + 1} / ${plots.length} · ${copy("step", { current: stepIndex + 1, total: plot.targets.length })}`;
  }
  function applyLocale() {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.body.dataset.locale = locale;
    document.title = `${copy("title")} | WeightPlay`;
    document.querySelectorAll("[data-glyph-i18n]").forEach((node) => { node.textContent = copy(node.dataset.glyphI18n); });
    $("mainPoster")?.setAttribute("alt", copy("coverAlt"));
    const localeSelect = $("localeSelect");
    if (localeSelect && localeSelect.value !== locale) localeSelect.value = locale;
    renderMainProgress();
    refreshStage();
    renderBattle();
    renderResult();
  }
  function setScreen(screen) {
    const main = $("mainScreen"), stage = $("stageScreen"), battle = $("battleScreen");
    const result = screen === "result";
    main.hidden = screen !== "main";
    stage.hidden = screen !== "stage";
    battle.hidden = !(screen === "battle" || result);
    $("battlePlay").inert = result;
    $("resultScreen").hidden = !result;
    document.body.dataset.screen = result ? "battle" : screen;
    frameUI?.frame.activate(result ? "battle" : screen, { covered: result });
    if (screen === "stage") refreshStage();
    if (result) requestAnimationFrame(() => $("resultScreen").querySelector("button:not([hidden])")?.focus({ preventScroll: true }));
  }
  function startPlot(index) {
    if (index >= unlocked) return;
    plotIndex = index;
    stepIndex = 0;
    selected = null;
    checks = 0;
    setScreen("battle");
    renderBattle();
    playSound("game.start");
    announce("start", { version: GAME_VERSION });
  }
  function renderBattle() {
    const plot = plots[plotIndex];
    const root = $("optionGrid");
    if (!plot || !root) return;
    const targetRule = plot.targets[stepIndex];
    updateBattleHeader();
    $("prompt").textContent = `${copy(`rule${targetRule.mode[0].toUpperCase()}${targetRule.mode.slice(1)}`)} — ${copy("prompt")}`;
    const requestCard = document.querySelector(".request-card");
    if (requestCard && !requestCard.querySelector(".taro-guide")) {
      const taro = document.createElement("img");
      taro.className = "taro-guide";
      taro.src = "assets/taro-voxel-v1.png";
      taro.alt = "";
      taro.draggable = false;
      requestCard.prepend(taro);
    }
    const target = $("targetGlyph");
    target.replaceChildren(shapeGlyph(targetRule));
    target.setAttribute("aria-label", label(targetRule));
    $("targetText").textContent = label(targetRule);
    root.replaceChildren();
    plot.options[stepIndex].forEach((item, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "option-card";
      button.setAttribute("role", "listitem");
      button.setAttribute("aria-pressed", String(index === selected));
      button.setAttribute("aria-label", label(item));
      button.append(shapeGlyph(item));
      const text = document.createElement("span");
      text.textContent = label(item);
      button.append(text);
      button.addEventListener("click", () => {
        selected = index;
        renderBattle();
        announce("select", { option: index + 1, step: stepIndex + 1 });
      });
      root.append(button);
    });
    $("selection").textContent = selected === null ? "" : copy("selected", { name: label(plot.options[stepIndex][selected]) });
    $("checkBtn").disabled = selected === null;
    $("clearBtn").disabled = selected === null;
    $("status").textContent = "";
    $("status").className = "status";
  }
  function check() {
    if (selected === null) return;
    checks += 1;
    const plot = plots[plotIndex];
    const target = plot.targets[stepIndex];
    const option = plot.options[stepIndex][selected];
    const correct = target.mode === "shape" ? option.shape === target.shape : target.mode === "color" ? option.color === target.color : option.shape === target.shape && option.color === target.color;
    if (correct && stepIndex + 1 < plot.targets.length) {
      stepIndex += 1;
      selected = null;
      playSound("ui.click");
      announce("step", { checks, step: stepIndex + 1 });
      renderBattle();
      $("status").textContent = copy("sequenceGood");
      $("status").className = "status good";
      return;
    }
    if (correct) {
      solved.add(plotIndex);
      unlocked = Math.max(unlocked, Math.min(plots.length, plotIndex + 2));
      safeStorage.set("weightplay-glyph-garden-unlocked-v4", String(unlocked));
      safeStorage.set("weightplay-glyph-garden-solved-v4", JSON.stringify([...solved].sort((a, b) => a - b)));
      const oldBest = Number(safeStorage.get("weightplay-glyph-garden-best-v4", "0"));
      if (!oldBest || checks < oldBest) safeStorage.set("weightplay-glyph-garden-best-v4", String(checks));
      $("status").textContent = copy("correct");
      $("status").className = "status good";
      announce("correct", { checks, step: stepIndex + 1 });
      window.setTimeout(() => {
        setScreen("result");
        renderMainProgress();
        refreshStage();
        renderResult();
      }, 280);
      return;
    }
    $("status").textContent = copy("wrong");
    $("status").className = "status try";
    announce("wrong", { checks, step: stepIndex + 1 });
  }
  function renderResult() {
    if (!$("resultText")) return;
    const complete = solved.size === plots.length;
    $("resultTitle").textContent = plotIndex === plots.length - 1 && complete ? copy("campaignComplete") : copy("finished");
    $("resultText").textContent = copy("resultText", { count: solved.size, total: plots.length, stage: plotIndex + 1 });
    $("nextBtn").hidden = plotIndex + 1 >= plots.length;
    $("stagesBtn").hidden = false;
    $("replayBtn").hidden = false;
  }
  function next() {
    const nextIndex = plotIndex + 1;
    if (nextIndex < plots.length) startPlot(nextIndex);
    else setScreen("stage");
  }
  function bind() {
    $("startBtn").addEventListener("click", () => { setScreen("stage"); refreshStage(); });
    $("stageBackBtn").addEventListener("click", () => setScreen("main"));
    $("battleBackBtn").addEventListener("click", () => setScreen("stage"));
    $("checkBtn").addEventListener("click", check);
    $("clearBtn").addEventListener("click", () => { selected = null; renderBattle(); });
    $("nextBtn").addEventListener("click", next);
    $("stagesBtn").addEventListener("click", () => setScreen("stage"));
    $("replayBtn").addEventListener("click", () => startPlot(plotIndex));
    $("localeSelect").addEventListener("change", (event) => {
      const nextLocale = event.target.value;
      if (!locales[nextLocale]) return;
      locale = nextLocale;
      safeStorage.set("weightPlayLocale", locale);
      applyLocale();
    });
    window.addEventListener("weightplay:audio-volume-change", applyLocale);
  }
  function boot() {
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      node.dataset.glyphI18n = node.dataset.i18n;
      node.removeAttribute("data-i18n");
    });
    frameUI = window.GlyphGardenI9Frame.mount({
      localeSelect: $("localeSelect"),
      stageRecord,
      selected: plotIndex,
      onSelect: (index) => { plotIndex = index; },
      onStart: startPlot,
      isStageActive: () => frameUI?.frame.active === "stage",
    });
    bind();
    window.WeightPlayAudio?.preload?.(["game.start", "ui.click"]);
    applyLocale();
    setScreen("main");
    announce("loaded");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
