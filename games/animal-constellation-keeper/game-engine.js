// Campaign state and accessible controls; spatial rules and effects are separate modules.
(() => {
  "use strict";
  const practiceRequested=location.protocol==='http:'&&['localhost','127.0.0.1','[::1]'].includes(location.hostname)&&new URLSearchParams(location.search).get('practice')==='1';
  let practiceEnabled=false,practiceAdapter=null,practiceBadge=null,mirrorAssess=null,mirrorCopy=null,mirrorShort=null,mirrorGuide=null,mirrorRelations=null,originalCompleted=0;
  /* WP-GAME-ANALYTICS-ADAPTER */
  // Only replayable lifecycle signals live here; all metrics/timers/GA4 stay shared.
  const __wpMeasurement = { screen: null, roundKey: null, started: false, ended: false, restart: false, outcome: "complete" };
  const __wpReadMeasurement = () => ({ ...__wpMeasurement,
    screen: ((({main:"main",stage:"stage",battle:"battle",})[state.screen] ?? null) === "battle" && (__wpMeasurement.ended)) ? null : (({main:"main",stage:"stage",battle:"battle",})[state.screen] ?? null), ended: Boolean(__wpMeasurement.ended), outcome: __wpMeasurement.outcome,
    paused: Boolean(state?.paused || state?.suspended), node: document.body,
    activityMode: "input", idleSeconds: 300
  });
  function __wpNotifyMeasurement() { if(practiceRequested)return;try { window.WonderAnalytics?.game?.observeState(__wpReadMeasurement); } catch { /* Optional telemetry. */ } }
  // Explicit authored replay actions count only when a new round was actually created.
  function __wpReplayStart(action) {
    const previous = __wpMeasurement.roundKey, value = action();
    if (__wpMeasurement.roundKey !== previous) { __wpMeasurement.restart = true; __wpNotifyMeasurement(); }
    return value;
  }
  window.addEventListener("weightplay:analytics-ready", __wpNotifyMeasurement);
  __wpNotifyMeasurement();

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
  const authoredMaps = arcDefinitions.flatMap((arc) => arc.stages.map((stage, index) => ({ ...stage, arc: arc.arc, arcKey: arc.arcKey, mechanicKey: arc.mechanicKey, stageInArc: index + 1 }))).map((stage, index) => {
    const number = index + 1;
    const options = [0, 1, 2].map((variant) => ({ id: `stage-${number}-option-${variant + 1}`, slot: variant + 1, stars: makeStars(stage.layout, stage.animals, variant) }));
    return { ...stage, number, nameKey: `stage${number}Name`, introKey: `stage${number}Intro`, correctId: options[0].id, options };
  });
  const puzzle = window.AnimalConstellationKeeperAnswerSlots;
  const stellar = window.ConstellationStellar;
  const maps = puzzle.assignBalancedAnswerSlots(puzzle.refineMaps(authoredMaps));
  const PROGRESS_KEY = "weightplay-animal-constellation-keeper-progress-v5";
  const BEST_KEY = "weightplay-animal-constellation-keeper-best-v5";
  const readProgress = () => { try { const candidates = [localStorage.getItem(PROGRESS_KEY), localStorage.getItem("weightplay-animal-constellation-keeper-progress-v4")].filter((candidate) => candidate !== null); const value = candidates.map(Number).find((candidate) => Number.isFinite(candidate) && candidate >= 0); return Math.min(maps.length, Math.max(0, value ?? 0)); } catch (_) { return 0; } };
  const MASTERY_KEY = "weightplay-animal-constellation-keeper-mastery-v10";
  const readMastery = () => { try { const value = JSON.parse(localStorage.getItem(MASTERY_KEY)); return Array.from({ length: maps.length }, (_, index) => Number.isInteger(value?.[index]) && value[index] > 0 ? value[index] : 0); } catch { return Array(maps.length).fill(0); } };
  const mastery = readMastery();
  const state = { locale: "en", map: 0, completed: readProgress(), selected: "", checks: 0, sessionChecks: 0, mapChecks: 0, clue: -1, evaluations: {}, streak: 0, screen: "main", sound: !window.WeightPlayAudio.isMuted() };
  window.addEventListener("weightplay:audio-volume-change", () => { state.sound = !window.WeightPlayAudio.isMuted(); });
  const $ = (id) => document.getElementById(id);
  const gameFrame = $("gameFrame");
  const battleRoot = $("battleScreen");
  gameFrame.hidden = false;
  const sharedFrame = window.WeightPlayScreenFrame?.mount?.({
    root: gameFrame,
    localeSelect: $("localeSelect"),
    scenes: {
      main: { root: $("mainScreen"), header: $("mainHeader"), content: $("mainContent") },
      stage: { root: $("stageScreen"), header: $("stageHeader"), content: $("stageContent") },
      battle: { root: $("battleScreen"), header: $("battleHeader"), content: $("battleContent"), headerInfo: $("battleHeaderInfo") },
    },
    playUI: true,
  }) || null;
  if (!sharedFrame) {
    window.WeightPlayGameEntryLoader?.fail?.("Shared play controls could not be loaded.", () => window.location.reload());
    throw new Error("Shared I9 screen frame unavailable");
  }
  const t = (key, vars = {}) => { const table = locales[state.locale] || locales.en || {}; let value = table[key] || locales.en?.[key] || key; Object.entries(vars).forEach(([name, replacement]) => { value = value.replaceAll(`{${name}}`, String(replacement)); }); return value; };
  const track = (event, detail = {}) => { if(practiceRequested)return;window.dispatchEvent(new CustomEvent("weightplay:analytics", { detail: { game: "animal-constellation-keeper", game_version: "v11", interface_version: 9, event, ...detail } })); };
  const tone = (cue = "ui.click") => { return window.WeightPlayAudio?.play(cue); };
  window.WeightPlayAudio.preload(["feedback.hint", "game.checkpoint", "result.win"]);
  const show = (screen) => { stellar.settle(); state.screen = screen; const frameScene = screen === "result" ? "battle" : screen; document.querySelectorAll("#mainScreen, #stageScreen, #battleScreen").forEach((node) => { node.hidden = node.dataset.screen !== frameScene; }); $("battleContent").hidden = screen === "result"; $("resultScreen").hidden = screen !== "result"; document.body.dataset.screen = screen; sharedFrame.activate(frameScene);placePracticeBadge();
    { const __wpNextScreen = ({main:"main",stage:"stage",battle:"battle",})[screen] ?? null;
      if (["result"].includes(screen) && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "complete"; }
      else if (true && (__wpNextScreen === "main" || __wpNextScreen === "stage") && __wpMeasurement.screen === "battle" && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "abandon"; }
      __wpMeasurement.screen = __wpNextScreen;  __wpNotifyMeasurement(); }
};
  const readBest = () => { try { const value = Number(localStorage.getItem(BEST_KEY) || localStorage.getItem("weightplay-animal-constellation-keeper-best-v4")); return Number.isFinite(value) && value >= maps.length ? value : null; } catch (_) { return null; } };
  const saveBest = () => { if (practiceRequested||!mastery.every(value => value > 0)) return; try { const total = mastery.reduce((sum, value) => sum + value, 0); const old = readBest(); if (!old || old < maps.length || total < old) localStorage.setItem(BEST_KEY, String(total)); } catch (_) {} };
  const saveProgress = () => { if(practiceRequested)return;try { localStorage.setItem(PROGRESS_KEY, String(state.completed)); } catch (_) {} };
  const announce = (key, vars = {}, kind = "") => { const node = $("battleStatus"); node.textContent = t(key, vars); node.dataset.kind = kind;placePracticeBadge();stellar.enter(node); };
  const mirrorText=()=>mirrorCopy?.[state.locale]||mirrorCopy?.en;
  const renderCheckCount=()=>{const full=t('checksLabel',{count:state.mapChecks}),short={es:'Intentos: {count}','pt-BR':'Tentativas: {count}',fr:'Essais : {count}',ar:'فحوص: {count}'};const node=$('checkCount');node.textContent=practiceEnabled&&short[state.locale]?short[state.locale].replace('{count}',String(state.mapChecks)):full;node.setAttribute('aria-label',full);};
  const describeRelation = ([subject, relation, object]) => {const index=mirrorRelations?.indexOf(relation)??-1;if(practiceEnabled&&index>=0)return mirrorText()[4][index].replaceAll('{a}',t(subject)).replaceAll('{b}',t(object));return t(`relation${relation[0].toUpperCase()}${relation.slice(1)}`, { subject: t(subject), object: t(object) });};
  const lensButton=document.createElement('button');lensButton.type='button';lensButton.id='ckMirrorLens';lensButton.hidden=true;
  const lensHelp=document.createElement('p');lensHelp.id='ckMirrorLensHelp';lensHelp.hidden=true;document.querySelector('.rule-card').append(lensHelp);
  const lensIcon=document.createElementNS('http://www.w3.org/2000/svg','svg');lensIcon.setAttribute('viewBox','0 0 32 32');lensIcon.setAttribute('width','24');lensIcon.setAttribute('height','24');lensIcon.setAttribute('aria-hidden','true');
  const lensCircle=document.createElementNS('http://www.w3.org/2000/svg','circle');lensCircle.setAttribute('cx','13');lensCircle.setAttribute('cy','13');lensCircle.setAttribute('r','8');lensCircle.setAttribute('fill','#63bfd0');lensCircle.setAttribute('stroke','#f6d77b');lensCircle.setAttribute('stroke-width','3');const lensHandle=document.createElementNS('http://www.w3.org/2000/svg','path');lensHandle.setAttribute('d','M19 19 L27 27');lensHandle.setAttribute('stroke','#f6d77b');lensHandle.setAttribute('stroke-width','4');lensHandle.setAttribute('stroke-linecap','square');lensIcon.append(lensCircle,lensHandle);const lensLabel=document.createElement('span');lensButton.append(lensIcon,lensLabel);$('checkBtn').before(lensButton);
  lensButton.addEventListener('click',()=>{if(!practiceEnabled||state.screen!=='battle'||state.map<30||state.lensUsed)return;const current=maps[state.map],option=current.options.find(o=>!state.evaluations[o.id]&&!mirrorAssess(current,o).every(Boolean));if(!option)return;state.lensUsed=true;state.lensEliminated=option.id;if(state.selected===option.id)state.selected='';renderBattle();const node=$('battleStatus');node.textContent=mirrorText()[2];node.dataset.kind='';placePracticeBadge();stellar.enter(node);});
  let stageSelectionIndex = Math.min(state.completed, maps.length - 1);
  let stageRailController = null;
  const updateStageStats = () => {
    const selected = $("stageSelectionValue");
    const completion = $("stageCompletionValue");
    if (selected){selected.textContent = practiceEnabled?`${stageSelectionIndex+1} / ${maps.length}`:t("round", { n: stageSelectionIndex + 1, total: maps.length });if(practiceEnabled)selected.dir='ltr';else selected.removeAttribute('dir');}
    if (completion) completion.textContent = practiceEnabled?mirrorText()[0]:`${state.completed} / ${maps.length}`;
  };
  const stageRecord = (index) => {
    const map = maps[index];if(!map)return {id:index+1,kicker:t('round',{n:index+1,total:60}),title:t('locked'),locked:true,cleared:false};
    const locked = practiceRequested?(index<30||!practiceEnabled):index > state.completed;
    const cleared = practiceRequested?false:index < state.completed;
    const status = locked ? t("locked") : cleared ? t("complete") : t("open");
    const mirror=practiceEnabled&&index>=30;const detail = mirror?map.clues.map(describeRelation):[t(map.arcKey), t(map.mechanicKey), map.checkpoint ? t(map.checkpointKey) : ""].filter(Boolean);
    return {
      id: index + 1,
      kicker: t("round", { n: index + 1, total: maps.length }),
      title: mirror?(mirrorShort[state.locale]||mirrorShort.en):t(map.nameKey),
      subtitle: mirror?mirrorText()[1]:t(map.arcKey),
      status,
      summary: mirror?map.clues.map(describeRelation).join(' · '):t(map.introKey),
      details: detail,
      locked,
      cleared,
      poster: "/games/animal-constellation-keeper/assets/animal-constellation-keeper-cover.png",
      posterPosition: "center",
    };
  };
  const renderStages = () => {
    const rail = $("stageList");
    if (!rail || !window.WeightPlayPlayUI?.mountStage || !sharedFrame?.stageTopUI) {
      rail?.replaceChildren();
      const unavailable = document.createElement("p");
      unavailable.className = "stage-rail-error";
      unavailable.setAttribute("role", "status");
      unavailable.textContent = t("stageControllerUnavailable");
      rail?.append(unavailable);
      return;
    }
    if (!stageRailController) {
      stageRailController = window.WeightPlayPlayUI.mountStage({
        page: $("stageContent"),
        rail,
        selected: stageSelectionIndex,
        config: {
          count: practiceRequested?60:maps.length,
          poster: "/games/animal-constellation-keeper/assets/animal-constellation-keeper-cover.png",
          stage: stageRecord,
        },
        onSelect: (index) => { stageSelectionIndex = index; updateStageStats(); },
        onStart: (index) => { if (index <= state.completed) requestMap(index); },
        isActive: () => state.screen === "stage" && !$("stageScreen").hidden,
      });
      if (!stageRailController) {
        const unavailable = document.createElement("p");
        unavailable.className = "stage-rail-error";
        unavailable.setAttribute("role", "status");
        unavailable.textContent = t("stageControllerUnavailable");
        rail.append(unavailable);
        return;
      }
    } else {
      stageRailController.refresh(stageSelectionIndex);
    }
    updateStageStats();
  };
  const createFrameStat = (labelKey, id) => {
    const field = document.createElement("div"); field.className = "stage-info-field";
    const label = document.createElement("small"); label.dataset.copy = labelKey; label.textContent = t(labelKey);
    const value = document.createElement("strong"); value.id = id;
    field.append(label, value);
    return field;
  };
  const stageGroup = window.WeightPlayScreenFrame.createGroup()
    .add(createFrameStat("maps", "stageSelectionValue"))
    .add(createFrameStat("complete", "stageCompletionValue"));
  sharedFrame.stageTopUI.add(stageGroup);
  function placePracticeBadge(){const badge=practiceBadge||(practiceBadge=document.querySelector('[data-wp-local-practice]'));if(!badge)return;const field=$('stageSelectionValue').closest('.stage-info-field'),label=field?.querySelector('small');if(label)label.hidden=practiceEnabled&&state.screen==='stage';if(!practiceEnabled){badge.hidden=true;return;}badge.hidden=false;badge.style.cssText='position:static;transform:none;background:#17243a;color:#f5c84c;padding:2px 4px;font:10px monospace;white-space:nowrap;pointer-events:none';if(state.screen==='battle')(matchMedia('(orientation: landscape) and (max-height: 590px)').matches?$('battleStatus'):$('mapIntro')).append(' ',badge);else if(state.screen==='result')$('resultTitle').after(badge);else if(state.screen==='stage')$('stageSelectionValue').before(badge);else $('mainContent').append(badge);}
  const battleGroup = window.WeightPlayScreenFrame.createGroup();
  [...$("battleHeaderInfo").children].forEach((field) => battleGroup.add(field));
  $("battleHeaderInfo").replaceChildren();
  sharedFrame.battleTopUI.add(battleGroup);
  const stageTab = $("stageTab");
  if (stageTab) sharedFrame.commonDownButton.clear().add(stageTab);
  const renderBoard = option => stellar.board(option, maps[state.map], t, state.clue, state.evaluations[option.id]);
  const focusClue = index => {
    if (state.screen !== "battle") return;
    state.clue = state.clue === index ? -1 : index;
    renderBattle(); stellar.trace(observatory); tone("feedback.hint");
  };
  // Native clue buttons retain their position and focus across every selection/check.
  ["ruleOne", "ruleTwo"].forEach((id, index) => {
    const old = $(id); const button = document.createElement("button");
    button.id = id; button.type = "button"; button.className = "ck-clue";
    button.addEventListener("click", () => focusClue(index)); old.replaceWith(button);
  });
  const observatory = document.createElement("div"); observatory.className = "ck-observatory";
  observatory.innerHTML = '<div class="ck-orbit ck-orbit-one"></div><div class="ck-orbit ck-orbit-two"></div><div class="ck-hero-board"></div><span class="ck-observatory-label"></span>';
  $("choiceGrid").closest(".choice-card").before(observatory);
  const renderBattle = () => {
    const current = maps[state.map];
    const mirror=practiceEnabled&&state.map>=30;
    $("mapName").textContent = mirror?mirrorText()[0]:t(current.nameKey);
    $("mapLabel").textContent = mirror?`${state.map+1} / ${maps.length}`:t("round", { n: state.map + 1, total: maps.length });if(mirror)$("mapLabel").dir='ltr';else $("mapLabel").removeAttribute('dir');
    $("mapIntro").textContent = mirror?`${current.checkpoint?t('checkpoint')+' · ':''}${mirrorText()[0]}`:`${current.checkpoint ? `${t("checkpoint")}: ${t(current.checkpointKey)} — ` : ""}${t(current.introKey)}`;
    if(mirror)placePracticeBadge();
    lensButton.hidden=!mirror;lensHelp.hidden=!mirror;if(mirror){lensLabel.textContent=mirrorText()[1];lensHelp.textContent=mirrorGuide[state.locale]||mirrorGuide.en;lensButton.setAttribute('aria-describedby','ckMirrorLensHelp');lensButton.disabled=Boolean(state.lensUsed)||!current.options.some(o=>!state.evaluations[o.id]&&!mirrorAssess(current,o).every(Boolean));}
    const evaluation = state.evaluations[state.selected];
    ["ruleOne", "ruleTwo"].forEach((id, index) => {
      const button = $(id); button.replaceChildren();
      const number = document.createElement("span"); number.className = "ck-clue-number";
      number.textContent = evaluation ? evaluation[index] ? "✓" : "×" : String(index + 1);
      const text = document.createElement("span"); text.textContent = describeRelation(current.clues[index]);
      button.append(number, text); button.setAttribute("aria-pressed", String(state.clue === index));
      button.dataset.verdict = evaluation ? evaluation[index] ? "pass" : "fail" : "idle";
      button.setAttribute("aria-label", `${text.textContent} ${evaluation ? evaluation[index] ? t("rulePass") : t("ruleFail") : t("traceClue")}`);
    });
    renderCheckCount();
    const grid = $("choiceGrid");
    const renderKey = `${state.map}:${state.locale}`;
    if (grid.dataset.renderKey !== renderKey) {
      grid.dataset.renderKey = renderKey;
      grid.replaceChildren(...current.options.map(option => {
        const button = document.createElement("button"); button.type = "button";
        button.className = "constellation-choice"; button.dataset.optionId = option.id;
        const label = document.createElement("span"); label.className = "choice-label";
        label.textContent = t("boardOption", { slot: option.slot });
        const verdict = document.createElement("span"); verdict.className = "ck-choice-verdict";
        button.append(label, renderBoard(option), verdict);
        button.addEventListener("click", () => chooseOption(option.id));
        return button;
      }));
      stellar.enter(grid);
    }
    current.options.forEach(option => {
      const button = grid.querySelector(`[data-option-id="${option.id}"]`);
      const tested = state.evaluations[option.id];
      const eliminated=mirror&&state.lensEliminated===option.id;button.disabled=eliminated;button.classList.toggle('ck-lens-eliminated',eliminated);
      button.setAttribute("aria-pressed", String(state.selected === option.id));
      button.dataset.state = tested && !tested.every(Boolean) ? "wrong" : state.selected === option.id ? "selected" : "idle";
      button.querySelector(".star-board").replaceWith(renderBoard(option));
      const verdict = button.querySelector(".ck-choice-verdict");
      verdict.textContent = tested ? `${tested.filter(Boolean).length} / ${current.clues.length} ✓` : "✦ · ✦";
      button.setAttribute("aria-label", `${t("boardOption", { slot: option.slot })}: ${option.stars.map(star => `${t(star.animal)} (${star.row + 1}, ${star.col + 1})`).join(", ")}${tested ? `. ${t("matchedRules", { count: tested.filter(Boolean).length })}` : ""}${eliminated?`. ${mirrorText()[2]}`:''}`);
    });
    const chosen = current.options.find(option => option.id === state.selected);
    const hero = observatory.querySelector(".ck-hero-board");
    observatory.classList.toggle("has-selection", Boolean(chosen));
    observatory.querySelector(".ck-observatory-label").textContent = chosen ? t("boardOption", { slot: chosen.slot }) : t("observePrompt");
    if (chosen) hero.replaceChildren(renderBoard(chosen));
    else {
      // Neutral sky: no hidden answer preview before the player's first choice.
      hero.replaceChildren();
      const neutral = document.createElement("span"); neutral.className = "ck-neutral-star"; neutral.textContent = "✧"; hero.append(neutral);
    }
    $("checkBtn").disabled = !state.selected || Boolean(evaluation);
    $("clearBtn").disabled = !state.selected;
    battleRoot.style.setProperty("--arc-hue", String(175 + current.arc * 21));
  };
  const renderResult = () => {
    const complete = state.map === maps.length - 1;
    const current = maps[state.map];
    $("resultTitle").textContent = complete ? t("resultTitle") : t("resultPartial");
    $("resultText").textContent = t("resultText", { count: state.completed, total: maps.length, checks: state.sessionChecks });
    let reward = $("ckResultReward");
    if (!reward) { reward = document.createElement("div"); reward.id = "ckResultReward"; $("resultTitle").before(reward); }
    reward.dataset.milestone = complete ? "finale" : current.checkpoint ? "checkpoint" : "map";
    const stars = Math.min(state.mapChecks === 1 ? 3 : state.mapChecks === 2 ? 2 : 1,practiceEnabled&&state.lensUsed?2:3);
    reward.replaceChildren(stellar.board(current.options.find(option => option.id === current.correctId), current, t, -1, [true, true]));
    const rating = document.createElement("p"); rating.className = "ck-rating";
    rating.textContent = "★".repeat(stars) + "☆".repeat(3 - stars); rating.setAttribute("aria-label", t("starsEarned", { count: stars }));
    const detail = document.createElement("p"); detail.className = "ck-result-detail";
    detail.textContent = `${current.checkpoint ? `${t("checkpoint")}: ${t(current.checkpointKey)} · ` : ""}${t(state.mapChecks === 1 ? "perfectRead" : "skyRestored")} · ${t("checksLabel", { count: state.mapChecks })}`;
    if(practiceEnabled){detail.textContent=`${t('checksLabel',{count:state.mapChecks})}${state.lensUsed?' · '+mirrorText()[2]:''}`;$("resultText").textContent=mirrorText()[3];}
    const progress = document.createElement("div"); progress.className = "ck-progress";
    progress.hidden=practiceEnabled;progress.setAttribute("role", "progressbar"); progress.setAttribute("aria-label", t("maps")); progress.setAttribute("aria-valuemin", "0"); progress.setAttribute("aria-valuemax", String(maps.length)); progress.setAttribute("aria-valuenow", String(state.completed));
    progress.style.setProperty("--progress", `${state.completed / maps.length * 100}%`);
    reward.append(rating, detail, progress);
    $("resultPrimaryBtn").textContent = complete ? t("map") : t("next");
    $("resultPrimaryBtn").onclick = complete ? openStage : () => requestMap(state.map + 1);
    $("resultPrimaryBtn").hidden=practiceEnabled&&complete;
    $("resultMapBtn").hidden = false;
    __wpNotifyMeasurement();
  };
  const openStage = (preserveSelection = false) => { if (!preserveSelection) stageSelectionIndex = practiceEnabled?Math.max(30,state.map):Math.min(state.completed, maps.length - 1); show("stage"); renderStages(); };
  function requestMap(index){if(practiceRequested)return practiceAdapter?.challenge('animal-constellation-keeper',String(index+1));return startMap(index);}
  const startMap = (index) => { if (!Number.isInteger(index) || index > state.completed || index < 0 || index >= maps.length||(practiceRequested&&(!practiceEnabled||index<30))) return; state.map = index; stageSelectionIndex = index; state.selected = ""; state.mapChecks = 0; state.clue = -1; state.evaluations = {};state.lensUsed=false;state.lensEliminated=''; if (index === 0) { state.checks = 0; state.sessionChecks = 0; state.streak = 0; } show("battle"); renderBattle(); stellar.enter(document.querySelector(".battle-content")); announce("waiting"); tone("game.start"); track("map_start", { map: state.map + 1, arc: maps[state.map].arc });
    __wpMeasurement.roundKey = {}; __wpMeasurement.restart = false; __wpMeasurement.started = true; __wpMeasurement.ended = false; __wpMeasurement.outcome = "complete"; __wpMeasurement.screen = "battle"; __wpNotifyMeasurement();
};
  const chooseOption = (id) => {
    if (state.screen !== "battle" || (practiceEnabled&&state.lensEliminated===id) || !maps[state.map].options.some(option => option.id === id)) return;
    state.selected = id; renderBattle();
    const previous = state.evaluations[id];
    announce(previous ? "reviewedBoard" : "selected", {}, previous ? "wrong" : "");
    stellar.trace(observatory); stellar.burst(observatory); tone("board.move"); track("constellation_select", { map: state.map + 1 });
  };
  const clearChoice = () => { if (state.screen !== "battle") return; state.selected = ""; state.clue = -1; renderBattle(); announce("waiting"); track("constellation_clear", { map: state.map + 1 }); };
  const checkChoice = () => {
    if (state.screen !== "battle" || !state.selected || state.evaluations[state.selected]) return;
    const current = maps[state.map]; const option = current.options.find(item => item.id === state.selected);
    if (!option) return;
    state.checks++; state.sessionChecks++; state.mapChecks++;
    renderCheckCount();
    const evaluation = practiceEnabled&&state.map>=30?mirrorAssess(current, option):puzzle.assess(current, option); state.evaluations[option.id] = evaluation;
    if (!evaluation.every(Boolean)) {
      state.clue = evaluation.indexOf(false); state.streak = 0; renderBattle();
      announce("wrong", { hint: describeRelation(current.clues[state.clue]) }, "wrong");
      stellar.enter($(state.clue === 0 ? "ruleOne" : "ruleTwo")); tone("feedback.error");
      track("map_check", { map: state.map + 1, result: "wrong" }); return;
    }
    const wasCompleted = state.completed;
    state.completed = Math.max(state.completed, state.map + 1); saveProgress();
    mastery[state.map] = mastery[state.map] ? Math.min(mastery[state.map], state.mapChecks) : state.mapChecks;
    if(!practiceRequested)try { localStorage.setItem(MASTERY_KEY, JSON.stringify(mastery)); } catch {}
    if (state.mapChecks === 1) state.streak++;
    saveBest(); $("bestValue").textContent = readBest() || t("noBest");
    track("map_check", { map: state.map + 1, result: "correct", checkpoint: Boolean(current.checkpoint), unlocked: state.completed > wasCompleted });
    show("result"); renderResult(); stellar.enter($("resultScreen").querySelector(".result-card")); stellar.burst($("ckResultReward"), true);
    tone(state.map === maps.length - 1 ? "result.win" : current.checkpoint ? "game.checkpoint" : "feedback.success");
  };
  document.addEventListener("keydown", event => {
    if (event.defaultPrevented || event.repeat || event.altKey || event.ctrlKey || event.metaKey || state.screen !== "battle") return;
    if (event.target.closest("input, select, textarea, [contenteditable], [role='dialog']") || battleRoot.querySelector(".battle-content")?.inert) return;
    if (/^[123]$/.test(event.key)) { event.preventDefault(); chooseOption(maps[state.map].options[Number(event.key) - 1].id); }
  });
  const applyLocale = () => {
    document.documentElement.lang = state.locale;
    document.documentElement.dir = state.locale === "ar" ? "rtl" : "ltr";
    document.documentElement.dataset.weightPlayLocale = state.locale;
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = t(node.dataset.copy); });
    document.querySelectorAll("[data-copy-aria]").forEach((node) => node.setAttribute("aria-label", t(node.dataset.copyAria)));
    const localeSelect = $("localeSelect");
    if (localeSelect) {
      localeSelect.value = state.locale;
      localeSelect.setAttribute("aria-label", t("language"));
    }
    const mainProgress = $("mainProgress");
    if (mainProgress) mainProgress.textContent = practiceEnabled?mirrorText()[3]:`${t("maps")}: ${state.completed} / ${maps.length}`;
    const bestValue = $("bestValue");
    if (bestValue) bestValue.textContent = readBest() || t("noBest");
    if (state.screen === "stage") renderStages();
    if (state.screen === "battle") renderBattle();
    if (state.screen === "result") renderResult();
    updateStageStats();
  };
  const installSoundBridge = () => { if (typeof window.WeightPlayAudio.isMuted === "function") state.sound = window.WeightPlayAudio.setEnabled(!window.WeightPlayAudio.isMuted()); window.addEventListener("weightplay:audio-volume-change", () => { if (typeof window.WeightPlayAudio?.isMuted === "function") { state.sound = window.WeightPlayAudio.setEnabled(!window.WeightPlayAudio.isMuted()); applyLocale(); } }); };
  $("startBtn").addEventListener("click", () => openStage());
  $("stageBackBtn").addEventListener("click", () => { show("main"); applyLocale(); });
  $("battleBackBtn").addEventListener("click", () => openStage(true));
  $("resultMapBtn").addEventListener("click", () => openStage());
  $("resultReplayBtn").addEventListener("click", () => __wpReplayStart(() => requestMap(state.map)));
  $("resultHomeBtn").addEventListener("click", () => show("main"));
  $("checkBtn").addEventListener("click", checkChoice);
  $("clearBtn").addEventListener("click", clearChoice);
  $("localeSelect").addEventListener("change", (event) => { state.locale = locales[event.target.value] ? event.target.value : "en"; if(!practiceRequested)try { localStorage.setItem("weightplayLocale", state.locale); } catch (_) {} if (window.WonderI18n?.actualLocale?.() !== state.locale) window.WonderI18n.setLocale(state.locale, { navigate: false }); applyLocale(); });
  const routeLocale = document.documentElement.lang; if (routeLocale && locales[routeLocale]) state.locale = routeLocale; else { try { const saved = localStorage.getItem("weightplayLocale"); if (saved && locales[saved]) state.locale = saved; } catch (_) {} } installSoundBridge(); applyLocale(); show("main"); $("loadingPanel").hidden = true; window.__ANIMAL_CONSTELLATION_KEEPER_TEST__ = { maps, startMap, chooseOption, checkChoice, clearChoice, seedProgress: (count) => { if(practiceRequested)return;state.completed = Math.min(maps.length, Math.max(0, Number(count) || 0)); saveProgress(); applyLocale(); }, getState: () => ({ ...state }) };
  if(practiceRequested)void activatePractice().catch(()=>{ $('battleStatus').textContent='Local practice unavailable'; });
  async function activatePractice(){
    const ready=await new Promise(resolve=>{let done=false;const timer=setTimeout(()=>finish(false),25000),observer=new MutationObserver(check);function finish(v){if(done)return;done=true;clearTimeout(timer);observer.disconnect();resolve(v)}function check(){const d=document.documentElement.dataset;if($('loadingPanel').hidden&&(d.wpGameEntryLoaderInstalled!=='true'||d.wpGameEntryLoaderActive!=='true'))finish(true);else if(document.querySelector('.wp-game-entry-loader[data-state="error"]'))finish(false)}observer.observe(document.documentElement,{attributes:true,attributeFilter:['hidden','class','data-wp-game-entry-loader-installed','data-wp-game-entry-loader-active'],childList:true,subtree:true});check()});
    if(!ready)return;const [{LocalPractice},chapter,locale]=await Promise.all([import('../../src/game-local-practice.mjs'),import('./mirror-observatory-candidate.mjs?v=20261027-mirror1'),import('./mirror-observatory-locales.mjs?v=20261028-mirror2')]);if(!await LocalPractice.ready)return;
    const data=chapter.createMirrorMaps();if(data.length!==30||data.some((m,i)=>m.number!==31+i))return;practiceAdapter=LocalPractice;mirrorAssess=chapter.assess;mirrorCopy=locale.MIRROR_COPY;mirrorShort=locale.MIRROR_SHORT;mirrorGuide=locale.MIRROR_GUIDE;mirrorRelations=locale.MIRROR_RELATIONS;originalCompleted=state.completed;
    const style=document.createElement('style');style.textContent='body[data-wp-constellation-mirror] .battle-actions{grid-template-columns:repeat(3,minmax(0,1fr));position:relative;z-index:3}body[data-wp-constellation-mirror] .battle-actions button{min-width:0}body[data-wp-constellation-mirror] #ckMirrorLens{display:inline-flex;gap:4px;align-items:center;justify-content:center}body[data-wp-constellation-mirror] #ckMirrorLens[hidden]{display:none}body[data-wp-constellation-mirror] .ck-lens-eliminated{opacity:.35}body[data-wp-constellation-mirror] .battle-info-field:has(#mapName){display:none}@media (orientation:landscape) and (max-height:590px){html[data-wp-shared-interface] body[data-wp-constellation-mirror] #resultScreen .result-card{display:grid!important;grid-template-columns:minmax(120px,32%) minmax(0,1fr);grid-template-rows:auto auto auto 1fr;align-items:center;justify-content:normal;min-height:0;max-height:100%;overflow:auto;padding:8px}body[data-wp-constellation-mirror] #ckResultReward{grid-column:1;grid-row:1 / 5}body[data-wp-constellation-mirror] #ckResultReward .star-board{width:120px;height:120px}body[data-wp-constellation-mirror] #ckResultReward .ck-animal{width:28px;height:28px}body[data-wp-constellation-mirror] #ckResultReward .ck-rating{font-size:22px;margin:2px}body[data-wp-constellation-mirror] #resultTitle,body[data-wp-constellation-mirror] #resultText,body[data-wp-constellation-mirror] #resultScreen [data-wp-local-practice],body[data-wp-constellation-mirror] #resultScreen .result-actions{grid-column:2}body[data-wp-constellation-mirror] #resultScreen .result-actions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin:4px 0}body[data-wp-constellation-mirror] #resultScreen .result-actions button{min-width:0;min-height:44px}}';document.head.append(style);
    // The portrait Canvas is 390 logical pixels wide. At 320px viewport width,
    // its 52px action row becomes 42.7px; 56 logical pixels leaves it above 44.
    style.textContent+='@media (max-width:390px) and (orientation:portrait){body[data-wp-constellation-mirror] .battle-actions{height:56px;min-height:56px}body[data-wp-constellation-mirror] .battle-actions button{height:56px;min-height:56px}}';
    // The hidden original map-name field must not reserve a third equal-width
    // slot; the remaining map number and check count need the available width.
    style.textContent+='body.wp-frame-battle-active[data-wp-constellation-mirror] [data-wp-frame-info]{--wp-frame-stat-count:2!important}';
    await LocalPractice.register({gameId:'animal-constellation-keeper',stageIds:Array.from({length:30},(_,i)=>String(i+31)),enable(enabled){practiceEnabled=enabled===true;const nameField=$('mapName').closest('.battle-info-field'),completionField=$('stageCompletionValue').closest('.stage-info-field');if(practiceEnabled){document.body.dataset.wpConstellationMirror='';battleRoot.dataset.wpBattleLandscapeWidth='760';battleRoot.dataset.wpBattleLandscapeHeight='334';nameField?.style.setProperty('display','none','important');completionField?.style.setProperty('display','none','important');if(maps.length===30)maps.push(...puzzle.assignBalancedAnswerSlots(data));state.completed=59;stageSelectionIndex=30;}else{delete document.body.dataset.wpConstellationMirror;delete battleRoot.dataset.wpBattleLandscapeWidth;delete battleRoot.dataset.wpBattleLandscapeHeight;nameField?.style.removeProperty('display');completionField?.style.removeProperty('display');maps.length=30;mastery.length=30;state.completed=originalCompleted;stageSelectionIndex=Math.min(state.completed,29);show('main');}applyLocale();if(state.screen==='stage')renderStages();placePracticeBadge();window.WeightPlayBattleCanvas?.sync?.();},async startStage(id){const n=Number(id);if(practiceEnabled&&Number.isInteger(n)&&n>=31&&n<=60)startMap(n-1)}});
  }
})();
