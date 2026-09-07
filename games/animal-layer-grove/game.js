(() => {
  "use strict";

  const locales = window.ANIMAL_LAYER_GROVE_LOCALES || {};
  const glyphs = {
    fern: "🌿", pond: "◒", moon: "☾", moss: "✣", glow: "✦", root: "⌁", willow: "♧", brook: "≈", mist: "〰",
    leaf: "🍃", rain: "☂", sun: "☀", bloom: "❀", canopy: "⌒", beacon: "✧", reeds: "🌾", creek: "≈", amber: "◆",
    reed: "🌾", stone: "●", stream: "∿", pebble: "•", wind: "〽", pine: "♠", fog: "◌", fox: "🦊", wing: "🪽",
    meadow: "⌁", whistle: "♫", storm: "ϟ", glass: "◇", ridge: "⌃", owl: "🦉", frost: "❄", echo: "◎", snow: "❅",
    bell: "◉", hollow: "○", night: "☽", star: "★", shell: "◓", coral: "❈", kelp: "〽", tide: "≋", sand: "﹏",
    water: "≈", acorn: "●", burrow: "◍", keeper: "⌂", moth: "✺"
  };

  const specs = [
    { name: "scene1", intro: "scene1Intro", target: ["fern", "pond", "moon"], initial: ["pond", "moon", "fern"], mechanic: "stack" },
    { name: "scene2", intro: "scene2Intro", target: ["moss", "glow", "root"], initial: ["root", "moss", "glow"], mechanic: "stack" },
    { name: "scene3", intro: "scene3Intro", target: ["willow", "brook", "mist"], initial: ["brook", "mist", "willow"], mechanic: "stack" },
    { name: "scene4", intro: "scene4Intro", target: ["leaf", "rain", "sun"], initial: ["sun", "leaf", "rain"], mechanic: "stack" },
    { name: "scene5", intro: "scene5Intro", target: ["bloom", "canopy", "beacon"], initial: ["canopy", "beacon", "bloom"], mechanic: "stack" },
    { name: "scene6", intro: "scene6Intro", target: ["reeds", "creek", "amber"], initial: ["amber", "reeds", "creek", "moth"], mechanic: "decoy", decoy: "moth" },
    { name: "scene7", intro: "scene7Intro", target: ["reed", "stone", "stream"], initial: ["moth", "stream", "reed", "stone"], mechanic: "decoy", decoy: "moth" },
    { name: "scene8", intro: "scene8Intro", target: ["pebble", "brook", "glow"], initial: ["glow", "moth", "pebble", "brook"], mechanic: "decoy", decoy: "moth" },
    { name: "scene9", intro: "scene9Intro", target: ["mist", "stone", "creek"], initial: ["stone", "creek", "moth", "mist"], mechanic: "decoy", decoy: "moth" },
    { name: "scene10", intro: "scene10Intro", target: ["reeds", "sun", "willow"], initial: ["willow", "moth", "sun", "reeds"], mechanic: "decoy", decoy: "moth" },
    { name: "scene11", intro: "scene11Intro", target: ["wind", "pine", "fog"], initial: ["wind", "fog", "pine"], mechanic: "wind" },
    { name: "scene12", intro: "scene12Intro", target: ["fox", "leaf", "wind"], initial: ["fox", "wind", "leaf"], mechanic: "wind" },
    { name: "scene13", intro: "scene13Intro", target: ["wing", "meadow", "sun"], initial: ["meadow", "wing", "sun"], mechanic: "wind" },
    { name: "scene14", intro: "scene14Intro", target: ["whistle", "pine", "mist"], initial: ["whistle", "mist", "pine"], mechanic: "wind" },
    { name: "scene15", intro: "scene15Intro", target: ["storm", "glass", "ridge"], initial: ["storm", "ridge", "glass"], mechanic: "wind" },
    { name: "scene16", intro: "scene16Intro", target: ["owl", "frost", "pine", "echo"], initial: ["owl", "pine", "echo", "frost"], mechanic: "echo" },
    { name: "scene17", intro: "scene17Intro", target: ["snow", "moon", "echo", "pine"], initial: ["pine", "snow", "moon", "echo"], mechanic: "echo" },
    { name: "scene18", intro: "scene18Intro", target: ["bell", "bloom", "echo", "moss"], initial: ["moss", "echo", "bell", "bloom"], mechanic: "echo" },
    { name: "scene19", intro: "scene19Intro", target: ["hollow", "stone", "echo", "fog"], initial: ["fog", "hollow", "stone", "echo"], mechanic: "echo" },
    { name: "scene20", intro: "scene20Intro", target: ["night", "star", "echo", "owl"], initial: ["star", "owl", "night", "echo"], mechanic: "echo" },
    { name: "scene21", intro: "scene21Intro", target: ["shell", "coral", "kelp", "tide"], initial: ["kelp", "shell", "tide", "coral"], mechanic: "echo" },
    { name: "scene22", intro: "scene22Intro", target: ["coral", "sand", "tide"], initial: ["sand", "moth", "tide", "coral"], mechanic: "decoy", decoy: "moth" },
    { name: "scene23", intro: "scene23Intro", target: ["kelp", "shell", "stream", "tide"], initial: ["tide", "stream", "kelp", "shell"], mechanic: "stack" },
    { name: "scene24", intro: "scene24Intro", target: ["sand", "moon", "tide", "echo"], initial: ["echo", "sand", "moon", "tide"], mechanic: "echo" },
    { name: "scene25", intro: "scene25Intro", target: ["star", "water", "tide", "shell"], initial: ["water", "shell", "star", "tide"], mechanic: "stack" },
    { name: "scene26", intro: "scene26Intro", target: ["root", "acorn", "fog"], initial: ["fog", "root", "acorn"], mechanic: "wind" },
    { name: "scene27", intro: "scene27Intro", target: ["bloom", "burrow", "leaf", "echo"], initial: ["leaf", "echo", "burrow", "bloom"], mechanic: "echo" },
    { name: "scene28", intro: "scene28Intro", target: ["fog", "stone", "wind"], initial: ["wind", "fog", "stone", "moth"], mechanic: "decoy", decoy: "moth" },
    { name: "scene29", intro: "scene29Intro", target: ["beacon", "night", "pine", "echo"], initial: ["pine", "beacon", "echo", "night"], mechanic: "echo" },
    { name: "scene30", intro: "scene30Intro", target: ["keeper", "fern", "moon", "echo"], initial: ["moon", "echo", "keeper", "fern"], mechanic: "echo" }
  ];

  const scenes = specs.map((spec, index) => {
    const layers = spec.decoy ? [...spec.target, spec.decoy] : [...spec.target];
    return {
      id: `stage-${String(index + 1).padStart(2, "0")}`,
      nameKey: spec.name,
      introKey: spec.intro,
      targetKey: `target${index + 1}`,
      wrongKey: `wrong${index + 1}`,
      mechanicKey: `mechanic${spec.mechanic[0].toUpperCase()}${spec.mechanic.slice(1)}`,
      target: spec.target,
      initial: spec.initial,
      layers,
      decoy: spec.decoy || "",
      mechanic: spec.mechanic,
      glyphs: Object.fromEntries(layers.map((id) => [id, glyphs[id] || "◇"]))
    };
  });

  const progressKeys = ["weightplay-animal-layer-grove-progress-v5", "weightplay-animal-layer-grove-progress-v4"];
  const bestKeys = ["weightplay-animal-layer-grove-best-v5", "weightplay-animal-layer-grove-best-v4", "weightplay-animal-layer-grove-best-v3"];
  const readNumber = (keys) => {
    try {
      for (const key of keys) {
        const value = Number(localStorage.getItem(key));
        if (Number.isFinite(value) && value >= 0) return value;
      }
    } catch (_) {}
    return 0;
  };
  const readCompleted = () => Math.min(scenes.length, readNumber(progressKeys));
  const state = { locale: "en", scene: 0, completed: readCompleted(), order: [], moves: 0, sessionMoves: 0, screen: "main", sound: true };
  const $ = (id) => document.getElementById(id);
  const t = (key, vars = {}) => {
    const table = locales[state.locale] || locales.en || {};
    let value = table[key] || locales.en?.[key] || key;
    Object.entries(vars).forEach(([name, replacement]) => { value = value.replaceAll(`{${name}}`, String(replacement)); });
    return value;
  };
  const track = (event, detail = {}) => { window.dispatchEvent(new CustomEvent("weightplay:analytics", { detail: { game: "animal-layer-grove", event, ...detail } })); };
  const tone = (frequency) => { if (!state.sound) return; try { const AudioContextClass = window.AudioContext || window.webkitAudioContext; if (!AudioContextClass) return; const context = new AudioContextClass(); const oscillator = context.createOscillator(); const gain = context.createGain(); oscillator.frequency.value = frequency; gain.gain.setValueAtTime(0.03, context.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.12); oscillator.connect(gain).connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + 0.12); oscillator.addEventListener("ended", () => context.close(), { once: true }); } catch (_) {} };
  const readBest = () => { const value = readNumber(bestKeys); return value > 0 ? value : null; };
  const saveProgress = () => { try { localStorage.setItem(progressKeys[0], String(state.completed)); } catch (_) {} };
  const saveBest = () => { try { const old = readBest(); if (!old || state.sessionMoves < old) localStorage.setItem(bestKeys[0], String(state.sessionMoves)); } catch (_) {} };
  const announce = (key, vars = {}, kind = "") => { const node = $("battleStatus"); node.textContent = t(key, vars); node.dataset.kind = kind; };
  const depthKey = (index) => index === 0 ? "front" : index === 1 ? "middle" : index === 2 ? "backLayer" : "farBack";
  const depthLabel = (index) => t(depthKey(index));
  const currentScene = () => scenes[state.scene];
  const expectedOrder = (scene) => scene.mechanic === "wind" ? [...scene.target].reverse() : scene.target;

  const renderMain = () => { $("mainProgress").textContent = `${t("groves")}: ${state.completed} / ${scenes.length}`; $("bestValue").textContent = readBest() || t("noBest"); };
  const show = (screen) => { state.screen = screen; document.querySelectorAll("section[data-screen]").forEach((node) => { node.hidden = node.dataset.screen !== screen; }); document.body.dataset.screen = screen; if (screen === "main") renderMain(); };
  const renderStages = () => {
    $("stageList").replaceChildren(...scenes.map((scene, index) => {
      const button = document.createElement("button");
      button.type = "button"; button.className = "stage-card"; button.setAttribute("role", "listitem"); button.dataset.stageId = scene.id;
      const locked = index > state.completed; button.disabled = locked;
      button.innerHTML = `<strong>${t("round", { n: index + 1, total: scenes.length })}</strong><span>${t(scene.nameKey)}</span><small>${index < state.completed ? t("complete") : locked ? t("locked") : t("open")}</small>`;
      button.addEventListener("click", () => startScene(index)); return button;
    }));
  };
  const renderTarget = (scene) => {
    const wrap = $("targetWindow"); const emblems = document.createElement("div"); emblems.className = "target-emblems";
    expectedOrder(scene).forEach((id) => { const emblem = document.createElement("span"); emblem.className = `target-emblem layer-art layer-art-${id}`; emblem.textContent = scene.glyphs[id]; emblem.setAttribute("aria-label", t(id)); emblems.append(emblem); });
    wrap.replaceChildren(emblems); $("targetCaption").textContent = t(scene.targetKey);
  };
  const renderLayers = () => {
    const scene = currentScene(); const list = $("layerList");
    list.replaceChildren(...state.order.map((id, index) => {
      const row = document.createElement("div"); row.className = "layer-row"; row.dataset.depth = String(index); row.dataset.layerId = id; row.setAttribute("role", "listitem");
      const info = document.createElement("div"); info.className = "layer-info"; const glyph = document.createElement("span"); glyph.className = `layer-glyph layer-art layer-art-${id}`; glyph.textContent = scene.glyphs[id]; glyph.setAttribute("aria-hidden", "true");
      const copy = document.createElement("span"); copy.className = "layer-copy"; const name = document.createElement("strong"); name.textContent = t(id); const detail = document.createElement("small"); detail.textContent = t("layerLabel", { name: t(id), depth: depthLabel(index) }); copy.append(name, detail); info.append(glyph, copy);
      const up = document.createElement("button"); up.type = "button"; up.className = "order-btn"; up.textContent = "↑"; up.title = depthLabel(index - 1); up.setAttribute("aria-label", `${t("frontToBack")}: ${t("moveForward", { name: t(id) })}`); up.disabled = index === 0; up.addEventListener("click", () => moveLayer(index, -1));
      const down = document.createElement("button"); down.type = "button"; down.className = "order-btn"; down.textContent = "↓"; down.title = depthLabel(index + 1); down.setAttribute("aria-label", `${t("frontToBack")}: ${t("moveBackward", { name: t(id) })}`); down.disabled = index === state.order.length - 1; down.addEventListener("click", () => moveLayer(index, 1));
      row.append(info, up, down); list.append(row); return row;
    }));
    $("moveCount").textContent = t("moveCount", { n: state.sessionMoves });
  };
  const renderBattle = () => { const scene = currentScene(); $("groveName").textContent = t(scene.nameKey); $("groveLabel").textContent = t("round", { n: state.scene + 1, total: scenes.length }); $("groveIntro").textContent = `${t(scene.introKey)} ${t(scene.mechanicKey)}`; renderTarget(scene); renderLayers(); $("checkBtn").disabled = !state.order.length; };
  const renderResult = () => { const complete = state.completed >= scenes.length; $("resultTitle").textContent = complete ? t("resultTitle") : t("resultPartial"); $("resultText").textContent = t("resultText", { count: state.completed, total: scenes.length, moves: state.sessionMoves }); $("resultPrimaryBtn").textContent = complete ? t("map") : t("next"); $("resultPrimaryBtn").onclick = complete ? () => { show("stage"); renderStages(); } : () => startScene(state.scene + 1); $("resultMapBtn").hidden = complete; };
  const startScene = (index) => { if (index < 0 || index >= scenes.length || index > state.completed) return; state.scene = index; state.order = [...scenes[state.scene].initial]; state.moves = 0; if (index === 0) state.sessionMoves = 0; show("battle"); renderBattle(); announce("waiting"); track("scene_start", { scene: state.scene + 1, stageId: currentScene().id }); };
  const moveLayer = (index, direction) => { const next = index + direction; if (next < 0 || next >= state.order.length) return; [state.order[index], state.order[next]] = [state.order[next], state.order[index]]; state.moves += 1; state.sessionMoves += 1; renderLayers(); announce("selected"); tone(520); track("layer_move", { scene: state.scene + 1, moves: state.sessionMoves }); };
  const resetLayers = () => { state.order = [...currentScene().initial]; state.moves += 1; state.sessionMoves += 1; renderLayers(); announce("waiting"); track("layer_reset", { scene: state.scene + 1 }); };
  const checkWindow = () => {
    const scene = currentScene(); if (!state.order.length) return; const expected = expectedOrder(scene);
    const matched = expected.every((id, index) => state.order[index] === id) && (scene.decoy ? state.order[state.order.length - 1] === scene.decoy : true);
    if (!matched) { const mismatch = expected.findIndex((id, index) => state.order[index] !== id); const expectedId = mismatch >= 0 ? expected[mismatch] : scene.decoy; announce("wrong", { hint: t("placementHint", { name: t(expectedId), depth: depthLabel(mismatch >= 0 ? mismatch : state.order.length - 1) }) }, "wrong"); tone(220); track("window_check", { scene: state.scene + 1, result: "wrong" }); return; }
    state.completed = Math.max(state.completed, state.scene + 1); saveProgress(); announce("correct", {}, "correct"); tone(760); track("window_check", { scene: state.scene + 1, result: "correct" }); if (state.completed >= scenes.length) saveBest(); show("result"); renderResult();
  };
  const applyLocale = () => { document.documentElement.lang = state.locale; document.documentElement.dir = state.locale === "ar" ? "rtl" : "ltr"; document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = t(node.dataset.copy); }); $("localeSelect").value = state.locale; $("localeSelect").setAttribute("aria-label", t("language")); $("soundState").textContent = state.sound ? t("on") : t("off"); $("soundBtn").setAttribute("aria-pressed", String(state.sound)); $("battleSoundBtn").setAttribute("aria-label", t("sound")); $("battleSoundBtn").setAttribute("aria-pressed", String(state.sound)); renderMain(); if (state.screen === "stage") renderStages(); if (state.screen === "battle") renderBattle(); if (state.screen === "result") renderResult(); };
  const installSoundBridge = () => { if (!window.WonderSound) window.WonderSound = { isMuted: () => !state.sound, setMuted: (muted) => { state.sound = !muted; applyLocale(); track("sound", { enabled: state.sound }); window.dispatchEvent(new CustomEvent("wonder:audio-volume-change")); } }; if (typeof window.WonderSound.isMuted === "function") state.sound = !window.WonderSound.isMuted(); window.addEventListener("wonder:audio-volume-change", () => { if (typeof window.WonderSound?.isMuted === "function") { state.sound = !window.WonderSound.isMuted(); applyLocale(); } }); };
  const settingsBtn = $("settingsBtn"); const soundBtn = $("soundBtn"); const battleSoundBtn = $("battleSoundBtn"); const openStage = () => { show("stage"); renderStages(); };
  $("startBtn").addEventListener("click", openStage); $("mapBtn").addEventListener("click", openStage); $("stageBackBtn").addEventListener("click", () => show("main")); $("battleBackBtn").addEventListener("click", () => { show("stage"); renderStages(); }); $("resultMapBtn").addEventListener("click", openStage); $("resultHomeBtn").addEventListener("click", () => show("main")); $("checkBtn").addEventListener("click", checkWindow); $("resetBtn").addEventListener("click", resetLayers);
  settingsBtn?.addEventListener("click", () => { $("settingsPanel").hidden = !$("settingsPanel").hidden; }); soundBtn?.addEventListener("click", () => { state.sound = !state.sound; applyLocale(); }); battleSoundBtn?.addEventListener("click", () => { state.sound = !state.sound; applyLocale(); }); $("localeSelect").addEventListener("change", (event) => { state.locale = locales[event.target.value] ? event.target.value : "en"; try { localStorage.setItem("weightPlayLocale", state.locale); } catch (_) {} applyLocale(); });
  const initialLocale = () => { const query = new URLSearchParams(window.location.search).get("lang"); if (query && locales[query]) return query; const routeLocale = document.documentElement.lang; if (routeLocale && locales[routeLocale]) return routeLocale; try { const saved = localStorage.getItem("weightPlayLocale") || localStorage.getItem("weightplayLocale"); if (saved && locales[saved]) return saved; } catch (_) {} return "en"; };
  state.locale = initialLocale(); installSoundBridge(); applyLocale(); show("main"); window.setTimeout(() => $("loadingScreen").classList.add("is-ready"), 0);
  window.__ANIMAL_LAYER_GROVE_TEST__ = { scenes, startScene, moveLayer, resetLayers, checkWindow, getState: () => ({ ...state, order: [...state.order] }) };
  const placeKeeperGuide = (attempt = 0) => { const image = document.querySelector(".keeper-guide"); const copy = document.querySelector(".wp-standard-main-copy"); if (image && copy && !copy.contains(image)) copy.prepend(image); if ((!image || !copy) && attempt < 40) window.setTimeout(() => placeKeeperGuide(attempt + 1), 50); };
  placeKeeperGuide();
})();
