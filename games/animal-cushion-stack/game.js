(function () {
  "use strict";

  const copy = window.CUSHION_LOCALES || {};
  const supportedLocales = ["en", "zh-Hant"];
  const stages = [
    {
      title: "stageTitle1", hint: "stageHint1",
      placements: [
        { support: 96, role: "floor", correct: "snug", options: [{ key: "wide", name: "wide", size: 116, tone: "rose" }, { key: "snug", name: "snug", size: 82, tone: "blue" }, { key: "tiny", name: "tiny", size: 42, tone: "gold" }] },
        { support: 82, role: "middle", correct: "cloud", options: [{ key: "wide", name: "wide", size: 103, tone: "gold" }, { key: "cloud", name: "cloud", size: 70, tone: "rose" }, { key: "tiny", name: "tiny", size: 38, tone: "blue" }] },
        { support: 70, role: "top", correct: "flag", options: [{ key: "wide", name: "wide", size: 82, tone: "blue" }, { key: "flag", name: "flag", size: 56, tone: "gold" }, { key: "tiny", name: "tiny", size: 30, tone: "rose" }] }
      ]
    },
    {
      title: "stageTitle2", hint: "stageHint2",
      placements: [
        { support: 100, role: "floor", correct: "leaf", options: [{ key: "wide", name: "wide", size: 121, tone: "rose" }, { key: "leaf", name: "leaf", size: 88, tone: "green" }, { key: "tiny", name: "tiny", size: 44, tone: "gold" }] },
        { support: 88, role: "middle", correct: "cloud", options: [{ key: "wide", name: "wide", size: 104, tone: "blue" }, { key: "cloud", name: "cloud", size: 76, tone: "rose" }, { key: "tiny", name: "tiny", size: 41, tone: "gold" }] },
        { support: 76, role: "top", correct: "moon", options: [{ key: "wide", name: "wide", size: 88, tone: "gold" }, { key: "moon", name: "moon", size: 61, tone: "blue" }, { key: "tiny", name: "tiny", size: 32, tone: "rose" }] }
      ]
    },
    {
      title: "stageTitle3", hint: "stageHint3",
      placements: [
        { support: 106, role: "floor", correct: "snug", options: [{ key: "wide", name: "wide", size: 128, tone: "blue" }, { key: "snug", name: "snug", size: 94, tone: "rose" }, { key: "tiny", name: "tiny", size: 48, tone: "gold" }] },
        { support: 94, role: "middle", correct: "leaf", options: [{ key: "wide", name: "wide", size: 111, tone: "gold" }, { key: "leaf", name: "leaf", size: 81, tone: "green" }, { key: "tiny", name: "tiny", size: 43, tone: "blue" }] },
        { support: 81, role: "top", correct: "flag", options: [{ key: "wide", name: "wide", size: 92, tone: "rose" }, { key: "flag", name: "flag", size: 66, tone: "gold" }, { key: "tiny", name: "tiny", size: 34, tone: "blue" }] }
      ]
    }
  ];
  const routedLocale = window.WonderI18n?.localeFromPath?.();
  const savedLocale = (() => { try { return localStorage.getItem("weightPlayLocale") || localStorage.getItem("weightplayLocale"); } catch (error) { return null; } })();
  const normalizeLocale = (value) => value === "zh-TW" ? "zh-Hant" : supportedLocales.includes(value) ? value : "en";
  const state = { locale: normalizeLocale(routedLocale || window.WonderI18n?.actualLocale?.() || document.documentElement.lang || savedLocale), stage: 0, step: 0, placed: [], selected: null, totalPicks: 0, stagePicks: 0, finished: false, sound: true, storage: true, status: "" };
  const $ = (id) => document.getElementById(id);
  const screens = { main: $("mainScreen"), stages: $("stageScreen"), battle: $("battleScreen"), result: $("resultScreen") };
  const t = (key, vars) => { const table = copy[state.locale] || copy.en || {}; let value = table[key] || (copy.en && copy.en[key]) || key; Object.keys(vars || {}).forEach((name) => { value = value.replace(new RegExp("\\{" + name + "\\}", "g"), String(vars[name])); }); return value; };
  const track = (name, detail) => { window.dataLayer = window.dataLayer || []; window.dataLayer.push(Object.assign({ event: "animal_cushion_stack_" + name }, detail || {})); document.dispatchEvent(new CustomEvent("weightplay:cushion-stack", { detail: Object.assign({ name }, detail || {}) })); };
  const beep = (frequency) => { if (!state.sound) return; try { const AudioContext = window.AudioContext || window.webkitAudioContext; if (!AudioContext) return; const context = new AudioContext(); const oscillator = context.createOscillator(); const gain = context.createGain(); oscillator.frequency.value = frequency; gain.gain.setValueAtTime(.035, context.currentTime); gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + .12); oscillator.connect(gain).connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + .12); oscillator.addEventListener("ended", () => context.close()); } catch (error) { /* optional audio */ } };
  const readBest = () => { try { const value = Number(localStorage.getItem("weightplay-animal-cushion-stack-best-v1")); return Number.isFinite(value) && value > 0 ? value : null; } catch (error) { state.storage = false; return null; } };
  const writeBest = (value) => { try { const current = readBest(); if (!current || value < current) localStorage.setItem("weightplay-animal-cushion-stack-best-v1", String(value)); } catch (error) { state.storage = false; } };
  const show = (name) => { Object.keys(screens).forEach((key) => { screens[key].hidden = key !== name; }); document.body.dataset.screen = name === "stages" ? "stage" : name; };
  const setLocale = (locale) => { state.locale = normalizeLocale(locale); try { localStorage.setItem("weightPlayLocale", state.locale); localStorage.setItem("weightplayLocale", state.locale); } catch (error) { state.storage = false; } applyLocale(); track("locale", { locale: state.locale }); };
  const applyLocale = () => {
    document.documentElement.lang = state.locale;
    document.documentElement.dir = "ltr";
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = t(node.dataset.copy); });
    $("localeSelect").value = state.locale; $("soundBtn").textContent = state.sound ? t("soundOn") : t("soundOff"); $("settingsBtn").setAttribute("aria-label", t("settings")); $("localeSelect").setAttribute("aria-label", t("language")); $("choiceTray").setAttribute("aria-label", t("chooseBlock")); $("tower").setAttribute("aria-label", t("title")); $("bestValue").textContent = readBest() || t("noBest");
    if (!screens.stages.hidden) renderStages(); if (!screens.battle.hidden) renderBattle(); if (!screens.result.hidden) renderResult();
  };
  const renderStages = () => { $("stageList").innerHTML = stages.map((stage, index) => `<button class="stage-card" type="button" data-stage="${index}"><span class="stage-number">${t("round", { n: index + 1, total: stages.length })}</span><h3>${t(stage.title)}</h3><p>${t(stage.hint)}</p><span class="stage-chip">${t("stageReady")}</span></button>`).join(""); $("stageList").querySelectorAll("[data-stage]").forEach((button) => button.addEventListener("click", () => startStage(Number(button.dataset.stage)))); };
  const renderTower = () => { const stage = stages[state.stage]; const blocks = state.placed.map((block) => `<div class="tower-block" data-tone="${block.tone}" style="width:${Math.max(28, Math.min(88, block.size))}%" aria-label="${t(block.name)}">${t(block.role)}</div>`).join(""); const current = stage.placements[state.step]; const baseWidth = current ? current.support : 90; $("tower").innerHTML = `${blocks}<div class="tower-ground" style="width:${Math.min(88, baseWidth)}%" aria-hidden="true"></div>`; };
  const renderBattle = () => {
    const stage = stages[state.stage]; const placement = stage.placements[state.step]; $("roundLabel").textContent = t("round", { n: state.stage + 1, total: stages.length }); $("battleHint").textContent = placement ? `${t(stage.hint)} · ${t("support", { n: placement.support })}` : t("lookoutReady"); $("sessionPicks").textContent = String(state.totalPicks); renderTower();
    if (placement) { $("choiceTray").innerHTML = placement.options.map((option) => `<button class="choice-btn" type="button" data-choice="${option.key}" aria-pressed="${state.selected === option.key}"><span class="choice-icon" data-tone="${option.tone}" aria-hidden="true">◆</span><span><span class="choice-name">${t(option.name)}</span><span class="choice-size">${t("blockSize", { n: option.size })}</span></span></button>`).join(""); $("choiceTray").querySelectorAll("[data-choice]").forEach((button) => button.addEventListener("click", () => selectChoice(button.dataset.choice))); } else { $("choiceTray").innerHTML = `<p class="battle-status">${t("lookoutReady")}</p>`; }
    const selected = placement?.options.find((option) => option.key === state.selected); $("selectionLabel").textContent = selected ? t("selected", { name: t(selected.name) }) : ""; $("battleStatus").textContent = state.status || (placement ? t("ready") : t("lookoutReady")); $("checkBtn").hidden = state.finished; $("clearBtn").hidden = state.finished; $("advanceBtn").hidden = !state.finished; $("advanceBtn").textContent = state.stage === stages.length - 1 ? t("finishTitle") : t("nextLookout");
  };
  const renderResult = () => { $("resultHeading").textContent = t("finishTitle"); $("resultText").textContent = t("finishText", { n: state.totalPicks }); $("resultPrimaryBtn").textContent = t("replayLookout"); $("bestValue").textContent = readBest() || t("noBest"); };
  const startStage = (index) => { state.stage = index; state.step = 0; state.placed = []; state.selected = null; state.stagePicks = 0; state.finished = false; state.status = ""; show("battle"); applyLocale(); track("start", { stage: index + 1 }); };
  const selectChoice = (key) => { state.selected = key; const choice = stages[state.stage].placements[state.step].options.find((option) => option.key === key); state.status = t("selected", { name: t(choice?.name || key) }); beep(360); renderBattle(); };
  const checkChoice = () => { const placement = stages[state.stage].placements[state.step]; if (!state.selected) { state.status = t("ready"); renderBattle(); return; } state.totalPicks += 1; state.stagePicks += 1; const option = placement.options.find((item) => item.key === state.selected); if (state.selected !== placement.correct) { state.status = t("wobbly"); state.selected = null; beep(180); track("wobbly", { stage: state.stage + 1, step: state.step + 1 }); renderBattle(); return; } state.placed.push({ ...option, role: placement.role }); state.step += 1; state.selected = null; state.status = t("steady"); beep(640); track("steady", { stage: state.stage + 1, step: state.step }); if (state.step >= stages[state.stage].placements.length) { state.finished = true; state.status = t("lookoutReady"); } renderBattle(); };
  const advance = () => { if (!state.finished) return; if (state.stage < stages.length - 1) { startStage(state.stage + 1); return; } writeBest(state.totalPicks); show("result"); applyLocale(); track("complete", { picks: state.totalPicks }); };
  const clearChoice = () => { state.selected = null; state.status = t("ready"); renderBattle(); };
  const goHome = () => { show("main"); applyLocale(); track("home"); };
  const toggleSettings = () => { const panel = $("settingsPanel"); const hidden = panel.hidden; panel.hidden = !hidden; $("settingsBtn").setAttribute("aria-expanded", String(hidden)); };

  const openStageMap = () => { show("stages"); applyLocale(); renderStages(); };
  $("startBtn").addEventListener("click", openStageMap); $("mapBtn").addEventListener("click", openStageMap); $("stageBackBtn").addEventListener("click", goHome); $("battleBackBtn").addEventListener("click", openStageMap); $("battleMapBtn").addEventListener("click", openStageMap); $("checkBtn").addEventListener("click", checkChoice); $("clearBtn").addEventListener("click", clearChoice); $("advanceBtn").addEventListener("click", advance); $("resultPrimaryBtn").addEventListener("click", () => startStage(0)); $("resultMapBtn").addEventListener("click", openStageMap); $("resultHomeBtn").addEventListener("click", goHome); $("settingsBtn").addEventListener("click", toggleSettings); $("soundBtn").addEventListener("click", () => { state.sound = !state.sound; applyLocale(); track("sound", { enabled: state.sound }); }); $("localeSelect").addEventListener("change", (event) => setLocale(event.target.value)); $("stageInfoBtn").addEventListener("click", () => window.alert(t("stageReady"))); $("battleInfoBtn").addEventListener("click", () => window.alert(t("guideTwo")));
  window.setTimeout(() => { $("loadingPanel").hidden = true; show("main"); applyLocale(); }, 40);
})();
