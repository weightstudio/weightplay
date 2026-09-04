(() => {
  "use strict";
  const locales = window.ANIMAL_CONSTELLATION_KEEPER_LOCALES || {};
  const arcDefinitions = [
    { arc: 1, arcKey: "arc1Name", mechanicKey: "mechanicDirect", stages: [
      { layout: "horizontal", animals: ["fox", "owl", "rabbit"], clues: [["fox", "left", "owl"], ["rabbit", "right", "owl"]] },
      { layout: "vertical", animals: ["deer", "otter", "hare"], clues: [["deer", "above", "otter"], ["hare", "below", "otter"]] },
      { layout: "horizontal", animals: ["owl", "bear", "mole"], clues: [["owl", "left", "bear"], ["mole", "right", "bear"]] },
      { layout: "vertical", animals: ["rabbit", "fox", "deer"], clues: [["rabbit", "above", "fox"], ["deer", "below", "fox"]] },
      { layout: "horizontal", animals: ["hare", "owl", "otter"], checkpoint: true, checkpointKey: "checkpoint5", clues: [["hare", "left", "owl"], ["otter", "right", "owl"]] },
    ] },
    { arc: 2, arcKey: "arc2Name", mechanicKey: "mechanicCross", stages: [
      { layout: "vertical", animals: ["fox", "deer", "bear"], clues: [["fox", "above", "deer"], ["bear", "below", "deer"]] },
      { layout: "horizontal", animals: ["owl", "otter", "rabbit"], clues: [["owl", "left", "otter"], ["rabbit", "right", "otter"]] },
      { layout: "vertical", animals: ["mole", "hare", "fox"], clues: [["mole", "above", "hare"], ["fox", "below", "hare"]] },
      { layout: "horizontal", animals: ["deer", "owl", "mole"], clues: [["deer", "left", "owl"], ["mole", "right", "owl"]] },
      { layout: "vertical", animals: ["rabbit", "bear", "otter"], checkpoint: true, checkpointKey: "checkpoint10", clues: [["rabbit", "above", "bear"], ["otter", "below", "bear"]] },
    ] },
    { arc: 3, arcKey: "arc3Name", mechanicKey: "mechanicDiagonal", stages: [
      { layout: "diagonal", animals: ["fox", "owl", "deer"], clues: [["fox", "upperLeft", "owl"], ["deer", "lowerRight", "owl"]] },
      { layout: "diagonal", animals: ["rabbit", "otter", "mole"], clues: [["rabbit", "upperLeft", "otter"], ["mole", "lowerRight", "otter"]] },
      { layout: "diagonal", animals: ["hare", "bear", "fox"], clues: [["hare", "upperLeft", "bear"], ["fox", "lowerRight", "bear"]] },
      { layout: "diagonal", animals: ["owl", "deer", "rabbit"], clues: [["owl", "upperLeft", "deer"], ["rabbit", "lowerRight", "deer"]] },
      { layout: "diagonal", animals: ["mole", "fox", "otter"], checkpoint: true, checkpointKey: "checkpoint15", clues: [["mole", "upperLeft", "fox"], ["otter", "lowerRight", "fox"]] },
    ] },
    { arc: 4, arcKey: "arc4Name", mechanicKey: "mechanicCorner", stages: [
      { layout: "corner", animals: ["fox", "rabbit", "owl"], clues: [["fox", "left", "rabbit"], ["owl", "below", "fox"]] },
      { layout: "corner", animals: ["deer", "hare", "bear"], clues: [["deer", "left", "hare"], ["bear", "below", "deer"]] },
      { layout: "corner", animals: ["otter", "mole", "fox"], clues: [["otter", "left", "mole"], ["fox", "below", "otter"]] },
      { layout: "corner", animals: ["owl", "rabbit", "deer"], clues: [["owl", "left", "rabbit"], ["deer", "below", "owl"]] },
      { layout: "corner", animals: ["bear", "hare", "mole"], checkpoint: true, checkpointKey: "checkpoint20", clues: [["bear", "left", "hare"], ["mole", "below", "bear"]] },
    ] },
    { arc: 5, arcKey: "arc5Name", mechanicKey: "mechanicChain", stages: [
      { layout: "zigzag", animals: ["fox", "otter", "rabbit"], clues: [["fox", "above", "otter"], ["rabbit", "below", "otter"]] },
      { layout: "zigzag", animals: ["owl", "deer", "hare"], clues: [["owl", "above", "deer"], ["hare", "below", "deer"]] },
      { layout: "zigzag", animals: ["mole", "bear", "fox"], clues: [["mole", "above", "bear"], ["fox", "below", "bear"]] },
      { layout: "zigzag", animals: ["rabbit", "otter", "owl"], clues: [["rabbit", "above", "otter"], ["owl", "below", "otter"]] },
      { layout: "zigzag", animals: ["deer", "hare", "mole"], checkpoint: true, checkpointKey: "checkpoint25", clues: [["deer", "above", "hare"], ["mole", "below", "hare"]] },
    ] },
    { arc: 6, arcKey: "arc6Name", mechanicKey: "mechanicMastery", stages: [
      { layout: "split", animals: ["fox", "bear", "owl"], clues: [["fox", "left", "bear"], ["owl", "right", "bear"]] },
      { layout: "diagonal", animals: ["otter", "rabbit", "deer"], clues: [["otter", "upperLeft", "rabbit"], ["deer", "lowerRight", "rabbit"]] },
      { layout: "corner", animals: ["hare", "mole", "fox"], clues: [["hare", "left", "mole"], ["fox", "below", "hare"]] },
      { layout: "vertical", animals: ["owl", "bear", "otter"], clues: [["owl", "above", "bear"], ["otter", "below", "bear"]] },
      { layout: "split", animals: ["deer", "rabbit", "mole"], checkpoint: true, checkpointKey: "checkpoint30", clues: [["deer", "left", "rabbit"], ["mole", "right", "rabbit"]] },
    ] },
  ];
  const layoutVariants = {
    horizontal: [[[0, 1, 0], [1, 1, 1], [2, 1, 2]], [[0, 1, 0], [2, 1, 1], [1, 1, 2]], [[1, 0, 1], [0, 1, 1], [2, 2, 1]]],
    vertical: [[[0, 0, 1], [1, 1, 1], [2, 2, 1]], [[2, 0, 1], [1, 1, 1], [0, 2, 1]], [[0, 1, 0], [1, 1, 1], [2, 1, 2]]],
    diagonal: [[[0, 0, 0], [1, 1, 1], [2, 2, 2]], [[2, 0, 2], [1, 1, 1], [0, 2, 0]], [[0, 1, 0], [1, 1, 1], [2, 1, 2]]],
    corner: [[[0, 0, 0], [1, 0, 1], [2, 1, 0]], [[1, 0, 0], [0, 0, 1], [2, 1, 0]], [[0, 0, 0], [2, 0, 1], [1, 1, 0]]],
    zigzag: [[[0, 0, 0], [1, 1, 0], [2, 2, 0]], [[0, 0, 1], [2, 1, 2], [1, 2, 1]], [[0, 1, 1], [1, 1, 0], [2, 1, 2]]],
    split: [[[0, 1, 0], [1, 1, 1], [2, 1, 2]], [[2, 0, 0], [1, 1, 1], [0, 0, 2]], [[0, 0, 0], [2, 0, 1], [1, 1, 0]]],
  };
  const makeStars = (layout, animals, variant) => (layoutVariants[layout]?.[variant] || layoutVariants.horizontal[variant]).map(([animalIndex, row, col]) => ({ animal: animals[animalIndex], row, col }));
  const maps = arcDefinitions.flatMap((arc) => arc.stages.map((stage, index) => ({ ...stage, arc: arc.arc, arcKey: arc.arcKey, mechanicKey: arc.mechanicKey, stageInArc: index + 1 }))).map((stage, index) => {
    const number = index + 1;
    const options = [0, 1, 2].map((variant) => ({ id: `stage-${number}-option-${variant + 1}`, slot: variant + 1, stars: makeStars(stage.layout, stage.animals, variant) }));
    return { ...stage, number, nameKey: `stage${number}Name`, introKey: `stage${number}Intro`, correctId: options[0].id, options };
  });
  const correctIds = maps.map((map) => map.correctId);
  const PROGRESS_KEY = "weightplay-animal-constellation-keeper-progress-v5";
  const BEST_KEY = "weightplay-animal-constellation-keeper-best-v5";
  const readProgress = () => { try { const candidates = [localStorage.getItem(PROGRESS_KEY), localStorage.getItem("weightplay-animal-constellation-keeper-progress-v4")].filter((candidate) => candidate !== null); const value = candidates.map(Number).find((candidate) => Number.isFinite(candidate) && candidate >= 0); return Math.min(maps.length, Math.max(0, value ?? 0)); } catch (_) { return 0; } };
  const state = { locale: "en", map: 0, completed: readProgress(), selected: "", checks: 0, sessionChecks: 0, screen: "main", sound: true };
  const $ = (id) => document.getElementById(id);
  const battleRoot = document.querySelector(".battle-canvas");
  battleRoot?.setAttribute("data-wp-battle-canvas-root", "");
  battleRoot?.setAttribute("data-wp-battle-min-height", "788");
  battleRoot?.setAttribute("data-wp-battle-landscape-width", "760");
  battleRoot?.setAttribute("data-wp-battle-landscape-height", "334");
  const t = (key, vars = {}) => { const table = locales[state.locale] || locales.en || {}; let value = table[key] || locales.en?.[key] || key; Object.entries(vars).forEach(([name, replacement]) => { value = value.replaceAll(`{${name}}`, String(replacement)); }); return value; };
  const track = (event, detail = {}) => { window.dispatchEvent(new CustomEvent("weightplay:analytics", { detail: { game: "animal-constellation-keeper", game_version: "v5", interface_version: 6, event, ...detail } })); };
  const tone = (frequency) => { if (!state.sound) return; try { const AudioContextClass = window.AudioContext || window.webkitAudioContext; if (!AudioContextClass) return; const context = new AudioContextClass(); const oscillator = context.createOscillator(); const gain = context.createGain(); oscillator.frequency.value = frequency; gain.gain.setValueAtTime(0.035, context.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.12); oscillator.connect(gain).connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + 0.12); oscillator.addEventListener("ended", () => context.close(), { once: true }); } catch (_) {} };
  const show = (screen) => { state.screen = screen; document.querySelectorAll("section[data-screen]").forEach((node) => { node.hidden = node.dataset.screen !== screen; }); document.body.dataset.screen = screen; };
  const readBest = () => { try { const value = Number(localStorage.getItem(BEST_KEY) || localStorage.getItem("weightplay-animal-constellation-keeper-best-v4")); return Number.isFinite(value) && value > 0 ? value : null; } catch (_) { return null; } };
  const saveBest = () => { try { const old = readBest(); if (!old || state.sessionChecks < old) localStorage.setItem(BEST_KEY, String(state.sessionChecks)); } catch (_) {} };
  const saveProgress = () => { try { localStorage.setItem(PROGRESS_KEY, String(state.completed)); } catch (_) {} };
  const announce = (key, vars = {}, kind = "") => { const node = $("battleStatus"); node.textContent = t(key, vars); node.dataset.kind = kind; };
  const animalAtlas = { fox: "fox", owl: "owl", rabbit: "rabbit", deer: "deer", otter: "bear", hare: "rabbit", bear: "bear", mole: "owl" };
  const describeRelation = ([subject, relation, object]) => t(`relation${relation[0].toUpperCase()}${relation.slice(1)}`, { subject: t(subject), object: t(object) });
  const renderStages = () => { $("stageList").replaceChildren(...maps.map((map, index) => { const locked = index > state.completed; const button = document.createElement("button"); button.type = "button"; button.className = `stage-card${map.checkpoint ? " checkpoint" : ""}${locked ? " locked" : ""}`; button.setAttribute("role", "listitem"); button.disabled = locked; button.setAttribute("aria-label", `${t(map.nameKey)} · ${locked ? t("locked") : t("open")}`); const status = map.checkpoint ? `${t("checkpoint")}: ${t(map.checkpointKey)}` : (index < state.completed ? t("complete") : (locked ? t("locked") : t("open"))); button.innerHTML = `<strong>${t("round", { n: index + 1, total: maps.length })}</strong><span>${t(map.nameKey)}</span><small>${status}</small>`; button.addEventListener("click", () => startMap(index)); return button; })); };
  const renderBoard = (option) => { const board = document.createElement("div"); board.className = "star-board"; for (let row = 0; row < 3; row += 1) for (let col = 0; col < 3; col += 1) { const cell = document.createElement("div"); cell.className = "star-cell"; const star = option.stars.find((item) => item.row === row && item.col === col); if (star) { cell.classList.add("is-star"); const glyph = document.createElement("span"); glyph.className = "star-glyph"; glyph.dataset.animal = animalAtlas[star.animal] || "owl"; glyph.setAttribute("aria-hidden", "true"); cell.append(glyph); } board.append(cell); } return board; };
  const renderBattle = () => { const current = maps[state.map]; $("mapName").textContent = t(current.nameKey); $("mapLabel").textContent = t("round", { n: state.map + 1, total: maps.length }); $("mapIntro").textContent = `${current.checkpoint ? `${t("checkpoint")}: ${t(current.checkpointKey)} — ` : ""}${t(current.introKey)}`; $("ruleOne").textContent = `1. ${describeRelation(current.clues[0])}`; $("ruleTwo").textContent = `2. ${describeRelation(current.clues[1])}`; $("checkCount").textContent = `${t("best")}: ${state.sessionChecks}`; const grid = $("choiceGrid"); grid.replaceChildren(...current.options.map((option) => { const button = document.createElement("button"); button.type = "button"; button.className = "constellation-choice"; button.dataset.optionId = option.id; button.setAttribute("aria-pressed", String(state.selected === option.id)); const label = document.createElement("span"); label.className = "choice-label"; label.textContent = t("boardOption", { slot: option.slot }); button.setAttribute("aria-label", t("mapOption", { label: label.textContent })); button.append(label, renderBoard(option)); button.addEventListener("click", () => chooseOption(option.id)); if (state.selected === option.id && button.dataset.state !== "wrong") button.dataset.state = "selected"; return button; })); $("checkBtn").disabled = !state.selected; };
  const renderResult = () => { const complete = state.completed >= maps.length; $("resultTitle").textContent = complete ? t("resultTitle") : t("resultPartial"); $("resultText").textContent = t("resultText", { count: state.completed, total: maps.length, checks: state.sessionChecks }); $("resultPrimaryBtn").textContent = complete ? t("map") : t("next"); $("resultPrimaryBtn").onclick = complete ? () => { show("stage"); renderStages(); } : () => startMap(state.map + 1); $("resultMapBtn").hidden = complete; };
  const openStage = () => { show("stage"); renderStages(); };
  const startMap = (index) => { if (index > state.completed || index < 0 || index >= maps.length) return; state.map = index; state.selected = ""; if (index === 0) { state.checks = 0; state.sessionChecks = 0; } show("battle"); renderBattle(); announce("waiting"); track("map_start", { map: state.map + 1, arc: maps[state.map].arc }); };
  const chooseOption = (id) => { state.selected = id; renderBattle(); announce("selected"); tone(540); track("constellation_select", { map: state.map + 1 }); };
  const clearChoice = () => { state.selected = ""; renderBattle(); announce("waiting"); track("constellation_clear", { map: state.map + 1 }); };
  const checkChoice = () => { if (!state.selected) return; state.checks += 1; state.sessionChecks += 1; const current = maps[state.map]; if (state.selected !== correctIds[state.map]) { const hint = describeRelation(current.clues[0]); announce("wrong", { hint }, "wrong"); const wrongButton = document.querySelector(`[data-option-id="${state.selected}"]`); if (wrongButton) wrongButton.dataset.state = "wrong"; tone(220); track("map_check", { map: state.map + 1, result: "wrong" }); return; } state.completed = Math.max(state.completed, state.map + 1); saveProgress(); announce("correct", {}, "correct"); tone(760); track("map_check", { map: state.map + 1, result: "correct", checkpoint: Boolean(current.checkpoint) }); if (state.completed >= maps.length) { saveBest(); $("bestValue").textContent = readBest() || t("noBest"); } show("result"); renderResult(); };
  const applyLocale = () => { document.documentElement.lang = state.locale; document.documentElement.dir = state.locale === "ar" ? "rtl" : "ltr"; document.documentElement.dataset.weightPlayLocale = state.locale; document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = t(node.dataset.copy); }); document.querySelectorAll("[data-copy-aria]").forEach((node) => node.setAttribute("aria-label", t(node.dataset.copyAria))); $("localeSelect").value = state.locale; $("localeSelect").setAttribute("aria-label", t("language")); $("soundState").textContent = state.sound ? t("on") : t("off"); $("soundBtn").setAttribute("aria-pressed", String(state.sound)); $("mainProgress").textContent = `${t("maps")}: ${state.completed} / ${maps.length}`; $("bestValue").textContent = readBest() || t("noBest"); if (state.screen === "stage") renderStages(); if (state.screen === "battle") renderBattle(); if (state.screen === "result") renderResult(); if (battleUtility) { battleUtility.setAttribute("aria-label", t("guideTitle")); battleUtility.title = t("guideTitle"); } };
  const installSoundBridge = () => { if (!window.WonderSound) window.WonderSound = { isMuted: () => !state.sound, setMuted: (muted) => { state.sound = !muted; applyLocale(); track("sound", { enabled: state.sound }); window.dispatchEvent(new CustomEvent("wonder:audio-volume-change")); } }; if (typeof window.WonderSound.isMuted === "function") state.sound = !window.WonderSound.isMuted(); window.addEventListener("wonder:audio-volume-change", () => { if (typeof window.WonderSound?.isMuted === "function") { state.sound = !window.WonderSound.isMuted(); applyLocale(); } }); };
  const ownSettingsBtn = $("settingsBtn"); if (!ownSettingsBtn) { const aliasShellSettings = () => { const shellSettingsBtn = document.querySelector(".wp-shell-settings-button"); if (shellSettingsBtn && !shellSettingsBtn.id) shellSettingsBtn.id = "settingsBtn"; }; document.addEventListener("DOMContentLoaded", aliasShellSettings, { once: true }); window.addEventListener("weightplay:shell-sync", aliasShellSettings); window.setTimeout(aliasShellSettings, 0); } const soundBtn = $("soundBtn"); const battleUtility = $("battleSettingsBtn"); if (battleUtility) { battleUtility.textContent = "?"; battleUtility.setAttribute("aria-label", t("guideTitle")); battleUtility.title = t("guideTitle"); } $("startBtn").addEventListener("click", openStage); $("mapBtn").addEventListener("click", openStage); $("stageBackBtn").addEventListener("click", () => { show("main"); applyLocale(); }); $("battleBackBtn").addEventListener("click", () => { openStage(); }); $("resultMapBtn").addEventListener("click", openStage); $("resultReplayBtn").addEventListener("click", () => startMap(state.map)); $("resultHomeBtn").addEventListener("click", () => show("main")); $("checkBtn").addEventListener("click", checkChoice); $("clearBtn").addEventListener("click", clearChoice); if (ownSettingsBtn) ownSettingsBtn.addEventListener("click", () => { const panel = $("settingsPanel"); const expanded = panel.hidden; panel.hidden = !expanded; ownSettingsBtn.setAttribute("aria-expanded", String(expanded)); }); soundBtn?.addEventListener("click", () => { state.sound = !state.sound; applyLocale(); }); battleUtility?.addEventListener("click", () => { const rules = document.querySelector(".rule-card"); rules?.setAttribute("tabindex", "-1"); rules?.focus({ preventScroll: true }); announce("waiting"); }); $("localeSelect").addEventListener("change", (event) => { state.locale = locales[event.target.value] ? event.target.value : "en"; try { localStorage.setItem("weightplayLocale", state.locale); } catch (_) {} if (window.WonderI18n?.actualLocale?.() !== state.locale) window.WonderI18n.setLocale(state.locale, { navigate: false }); applyLocale(); });
  const routeLocale = document.documentElement.lang; if (routeLocale && locales[routeLocale]) state.locale = routeLocale; else { try { const saved = localStorage.getItem("weightplayLocale"); if (saved && locales[saved]) state.locale = saved; } catch (_) {} } installSoundBridge(); applyLocale(); show("main"); window.setTimeout(() => $("loadingScreen").classList.add("is-ready"), 0); window.__ANIMAL_CONSTELLATION_KEEPER_TEST__ = { maps, startMap, chooseOption, checkChoice, clearChoice, seedProgress: (count) => { state.completed = Math.min(maps.length, Math.max(0, Number(count) || 0)); saveProgress(); applyLocale(); }, getState: () => ({ ...state }) };
})();
