(() => {
  "use strict";

  const rounds = window.ANIMAL_NEST_WEIGH_ROUNDS || [];
  const localeMap = window.ANIMAL_NEST_WEIGH_LOCALES || {};
  const localeList = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const localeSegments = { en: "en", "zh-Hant": "zh-tw", "zh-Hans": "zh-cn", ja: "ja", ko: "ko", es: "es", "pt-BR": "pt-br", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const progressKey = "weightplay-animal-nest-weigh-progress";
  const masteryKey = "weightplay-animal-nest-weigh-mastery-v7";
  const $ = (id) => document.getElementById(id);
  const state = {
    locale: "en", screen: "main", round: 0, selectedPair: [], selectedTarget: null,
    clues: [], knownPairs: new Set(), comparisons: 0, mistakes: 0, completed: [],
    mastery: {}, phase: "compare", wrong: false, resultVisible: false, lastFeedback: "ready", busy: false,
  };

  const measurement = { screen: null, roundKey: null, started: false, ended: false, restart: false, outcome: "complete" };
  const readMeasurement = () => ({
    screen: state?.resultVisible ? null : state?.screen || null,
    ended: Boolean(measurement.ended), outcome: measurement.outcome,
    paused: Boolean(state?.suspended), node: document.body, activityMode: "input", idleSeconds: 300,
  });
  const notifyMeasurement = () => { try { window.WonderAnalytics?.game?.observeState(readMeasurement); } catch { /* Optional telemetry. */ } };
  window.addEventListener("weightplay:analytics-ready", notifyMeasurement);
  notifyMeasurement();

  const safeGet = (key, fallback) => { try { return localStorage.getItem(key) || fallback; } catch { return fallback; } };
  const safeSet = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Private browsing may deny storage. */ } };
  const copy = (key, values = {}) => {
    const text = (localeMap[state.locale] || localeMap.en || {})[key] || key;
    return text.replace(/\{([^}]+)\}/g, (_match, name) => String(values[name] ?? ""));
  };
  const materialName = (key) => copy("material_" + key);
  const stageName = (round, index) => {
    if (state.locale === "zh-Hant" || state.locale === "zh-Hans") return round.nameZh;
    if (state.locale === "ar") return round.nameAr;
    if (state.locale === "en") return round.name;
    return copy("round", { number: index + 1, total: rounds.length });
  };
  const playSound = (id) => { try { window.WeightPlayAudio?.play(id); } catch { /* Sound never controls game state. */ } };
  const uniqueSorted = (values) => [...new Set(values)].sort((a, b) => a - b);

  const loadCompleted = () => {
    try {
      const parsed = JSON.parse(safeGet(progressKey, "[]"));
      return Array.isArray(parsed) ? uniqueSorted(parsed.filter((index) => Number.isInteger(index) && index >= 0 && index < rounds.length)) : [];
    } catch { return []; }
  };
  const saveCompleted = () => safeSet(progressKey, JSON.stringify(uniqueSorted(state.completed)));
  const loadMastery = () => {
    try {
      const value = JSON.parse(safeGet(masteryKey, "{}"));
      return value && typeof value === "object" && !Array.isArray(value) ? value : {};
    } catch { return {}; }
  };
  const saveMastery = () => safeSet(masteryKey, JSON.stringify(state.mastery));
  const stageUnlocked = (index) => index === 0 || state.completed.includes(index - 1);
  const highestUnlocked = () => {
    let index = 0;
    while (index < rounds.length - 1 && state.completed.includes(index)) index += 1;
    return index;
  };
  const bestForStage = (index) => state.mastery[String(index)] || null;
  const targetIndex = (round) => {
    const sorted = round.weights.map((weight, index) => ({ weight, index })).sort((a, b) => a.weight - b.weight);
    const rank = round.targetType === "heaviest" ? sorted.length - 1
      : round.targetType === "secondHeaviest" ? sorted.length - 2
      : round.targetType === "secondLightest" ? 1
      : round.targetType === "middle" ? Math.floor(sorted.length / 2)
      : 0;
    return sorted[Math.max(0, Math.min(sorted.length - 1, rank))].index;
  };

  let frame = null;
  let stageController = null;
  let renderedClueCount = -1;
  let returnFocus = null;
  let revealTimer = null;
  let pendingPair = null;
  const effects = new Set();
  const knowledge = () => window.NestWeighDeduction.analyze(rounds[state.round].materials.length, state.clues, rounds[state.round].targetType);
  const reducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  function cancelMotion() {
    window.clearTimeout(revealTimer);
    revealTimer = null;
    pendingPair = null;
    state.busy = false;
    for (const animation of effects) animation.cancel();
    effects.clear();
    $("nestEffects")?.replaceChildren();
    $("balanceVisual").classList.remove("is-loading");
  }

  function animate(node, frames, duration = 360) {
    if (!node?.animate) return;
    const animation = node.animate(reducedMotion() ? [{ opacity: .55 }, { opacity: 1 }] : frames,
      { duration: reducedMotion() ? 100 : duration, easing: "cubic-bezier(.2,.8,.2,1)" });
    effects.add(animation);
    animation.finished.then(() => effects.delete(animation), () => effects.delete(animation));
    return animation;
  }

  function flyMaterial(index, sourceRect, destination) {
    const layer = $("nestEffects");
    if (!layer || !sourceRect || !destination || reducedMotion()) return;
    const root = layer.getBoundingClientRect();
    const end = destination.getBoundingClientRect();
    const scale = root.width / layer.clientWidth || 1;
    const proxy = document.createElement("span");
    proxy.className = "nest-flight tray-icon material-" + rounds[state.round].materials[index];
    const x = (sourceRect.left + sourceRect.width / 2 - root.left) / scale - 18;
    const y = (sourceRect.top + sourceRect.height / 2 - root.top) / scale - 16;
    proxy.style.left = x + "px";
    proxy.style.top = y + "px";
    layer.append(proxy);
    const dx = (end.left + end.width / 2 - root.left) / scale - 18 - x;
    const dy = (end.top + end.height / 2 - root.top) / scale - 16 - y;
    const motion = animate(proxy, [
      { transform: "translate(0,0) scale(1)", opacity: 1 },
      { transform: `translate(${dx * .5}px,${dy * .5 - 35}px) scale(1.2)`, opacity: 1, offset: .5 },
      { transform: `translate(${dx}px,${dy}px) scale(.7)`, opacity: .2 },
    ], 520);
    if (motion) motion.finished.then(() => proxy.remove(), () => proxy.remove());
    else proxy.remove();
  }

  function burst(destination, strong = false) {
    animate(destination, [{ filter: "brightness(1)" }, { filter: "brightness(1.5)", offset: .35 }, { filter: "brightness(1)" }], 480);
    if (reducedMotion()) return;
    const layer = $("nestEffects");
    const root = layer.getBoundingClientRect();
    const rect = destination.getBoundingClientRect();
    const scale = root.width / layer.clientWidth || 1;
    for (let i = 0; i < (strong ? 16 : 8); i += 1) {
      const spark = document.createElement("i");
      spark.className = "nest-spark";
      spark.style.left = (rect.left + rect.width / 2 - root.left) / scale + "px";
      spark.style.top = (rect.top + rect.height / 2 - root.top) / scale + "px";
      layer.append(spark);
      const angle = i * Math.PI * 2 / (strong ? 16 : 8);
      const distance = strong ? 72 : 38;
      const motion = animate(spark, [{ transform: "translate(0,0)", opacity: 1 },
        { transform: `translate(${Math.cos(angle) * distance}px,${Math.sin(angle) * distance}px) rotate(120deg)`, opacity: 0 }], strong ? 700 : 460);
      if (motion) motion.finished.then(() => spark.remove(), () => spark.remove());
      else spark.remove();
    }
  }

  function renderMain() {
    $("mainProgress").textContent = copy("progress", { count: state.completed.length });
  }

  function ensureStageNode(card) {
    if (card.querySelector("[data-wp-item-content]")) return;
    const group = document.createElement("span");
    group.className = "nest-stage-card-content";
    group.setAttribute("data-wp-item-content", "");
    const number = document.createElement("span");
    number.className = "stage-number";
    const name = document.createElement("strong");
    name.className = "stage-name";
    const detail = document.createElement("span");
    detail.className = "stage-detail";
    const status = document.createElement("b");
    status.className = "stage-status";
    const feathers = document.createElement("span");
    feathers.className = "stage-feathers";
    feathers.setAttribute("aria-hidden", "true");
    group.append(number, name, detail, status, feathers);
    card.replaceChildren(group);
  }

  function bindStageCard(card, index) {
    ensureStageNode(card);
    const round = rounds[index];
    const unlocked = stageUnlocked(index);
    const complete = state.completed.includes(index);
    const record = bestForStage(index);
    const group = card.querySelector("[data-wp-item-content]");
    card.type = "button";
    card.className = "stage-card nest-stage-card" + (complete ? " is-complete" : "") + (!unlocked ? " is-locked" : "");
    card.dataset.stage = String(index);
    card.dataset.wpStageCard = "";
    card.setAttribute("aria-disabled", String(!unlocked));
    card.setAttribute("aria-label", [copy("round", { number: index + 1, total: rounds.length }), stageName(round, index), complete ? copy("completed") : unlocked ? copy("readyStage") : copy("lockedStage"), record ? copy("feathers", { count: record.feathers }) : ""].filter(Boolean).join(" · "));
    group.querySelector(".stage-number").textContent = copy("round", { number: index + 1, total: rounds.length });
    group.querySelector(".stage-name").textContent = stageName(round, index);
    const checkpoint = round.checkpoint ? " · " + copy("checkpoint") : "";
    group.querySelector(".stage-detail").textContent = copy(round.request) + " · " + copy(round.mechanicKey) + checkpoint;
    group.querySelector(".stage-status").textContent = complete ? copy("completed") : unlocked ? copy("readyStage") : copy("lockedStage");
    group.querySelector(".stage-feathers").textContent = record ? "★".repeat(Math.max(0, Math.min(3, record.feathers))) : "";
  }

  function renderStages() {
    if (!stageController) return;
    stageController.refresh();
    stageController.center(highestUnlocked());
    $("stageProgress").textContent = copy("progress", { count: state.completed.length });
    $("stageIntro").textContent = copy("mapIntro");
  }

  function trayMarkup(round, index) {
    const material = round.materials[index];
    const name = materialName(material);
    const comparing = state.phase === "compare";
    const selected = comparing ? state.selectedPair.includes(index) : state.selectedTarget === index;
    const label = comparing ? copy("compareTray", { name }) : copy("answerTray", { name });
    return '<button type="button" class="tray-card' + (selected ? " is-selected" : "") + '" data-material-tray="' + index + '" aria-label="' + label.replace(/&/g, "&amp;").replace(/"/g, "&quot;") + '" aria-pressed="' + String(selected) + '"><span class="tray-icon material-' + material + '" aria-hidden="true"></span><strong>' + name.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + '</strong></button>';
  }

  function relationFor(round, first, second) {
    if (round.weights[first] === round.weights[second]) return copy("equal");
    return round.weights[first] > round.weights[second] ? copy("heavier") : copy("lighter");
  }

  function comparisonMessage() {
    if (state.lastFeedback === "pairAlreadyKnown") return copy("pairAlreadyKnown");
    const clue = state.clues.at(-1);
    if (!clue) return copy("comparisonEmpty");
    const round = rounds[state.round];
    const first = materialName(round.materials[clue.pair[0]]);
    const second = materialName(round.materials[clue.pair[1]]);
    return copy("comparisonResult", { first, second, relation: relationFor(round, clue.pair[0], clue.pair[1]) });
  }

  function renderClues() {
    const list = $("clueLog");
    list.replaceChildren();
    state.clues.slice(-6).forEach((clue) => {
      const item = document.createElement("li");
      const round = rounds[state.round];
      const first = materialName(round.materials[clue.pair[0]]);
      const second = materialName(round.materials[clue.pair[1]]);
      item.textContent = copy("comparisonResult", { first, second, relation: relationFor(round, clue.pair[0], clue.pair[1]) });
      list.append(item);
    });
  }

  function updateBalance() {
    const clue = pendingPair ? { pair: pendingPair } : state.clues.at(-1);
    const beam = $("balanceBeam");
    const left = $("balanceLeft");
    const right = $("balanceRight");
    if (!clue) {
      left.className = "balance-pan";
      right.className = "balance-pan";
      left.querySelector(".balance-icon").className = "balance-icon";
      right.querySelector(".balance-icon").className = "balance-icon";
      left.querySelector(".balance-label").textContent = "?";
      right.querySelector(".balance-label").textContent = "?";
      beam.style.setProperty("--beam-tilt", "0deg");
      $("balanceVisual").dataset.result = "unknown";
      return;
    }
    const round = rounds[state.round];
    const first = clue.pair[0];
    const second = clue.pair[1];
    const difference = round.weights[first] - round.weights[second];
    const angle = pendingPair ? 0 : Math.sign(difference) * -9;
    beam.style.setProperty("--beam-tilt", angle + "deg");
    left.querySelector(".balance-icon").className = "balance-icon tray-icon material-" + round.materials[first];
    right.querySelector(".balance-icon").className = "balance-icon tray-icon material-" + round.materials[second];
    left.querySelector(".balance-label").textContent = materialName(round.materials[first]);
    right.querySelector(".balance-label").textContent = materialName(round.materials[second]);
    const outcome = pendingPair ? "unknown" : difference === 0 ? "equal" : difference > 0 ? "left" : "right";
    $("balanceVisual").dataset.result = outcome;
    if (renderedClueCount !== state.clues.length) {
      renderedClueCount = state.clues.length;
      beam.classList.remove("is-weighing");
      void beam.offsetWidth;
      beam.classList.add("is-weighing");
      beam.addEventListener("animationend", () => beam.classList.remove("is-weighing"), { once: true });
    }
  }

  function renderBattle() {
    const round = rounds[state.round];
    const info = knowledge();
    $("roundHint").textContent = copy(round.hint);
    $("progressBadge").textContent = copy("progressBadge", { count: state.completed.length });
    $("requestText").textContent = copy(round.request);
    $("comparisonCount").textContent = copy("weighCount", { count: state.comparisons });
    $("materialBoard").style.setProperty("--material-count", round.materials.length);
    $("materialBoard").setAttribute("aria-label", copy(state.phase === "compare" ? "compareTitle" : "answerTitle"));
    const board = $("materialBoard");
    const boardKey = state.round + ":" + state.locale;
    if (board.dataset.boardKey !== boardKey) {
      board.innerHTML = round.materials.map((_material, index) => trayMarkup(round, index)).join("");
      board.dataset.boardKey = boardKey;
      board.querySelectorAll(".tray-card").forEach((card) => {
        const badge = document.createElement("small");
        badge.className = "tray-rank";
        card.append(badge);
      });
    }
    board.querySelectorAll(".tray-card").forEach((card, index) => {
      const selected = state.phase === "compare" ? state.selectedPair.includes(index) : state.selectedTarget === index;
      const possible = info.candidates.includes(index);
      const { min, max } = info.bounds[index];
      card.classList.toggle("is-selected", selected);
      card.classList.toggle("is-eliminated", !possible);
      card.classList.toggle("is-proven", info.proven === index);
      card.setAttribute("aria-pressed", String(selected));
      const rank = copy("rankRange", { min: min + 1, max: max + 1 });
      card.querySelector(".tray-rank").textContent = info.proven === index ? "✓" : !possible ? "×" : `${min + 1}–${max + 1}`;
      card.setAttribute("aria-label", copy(state.phase === "compare" ? "compareTray" : "answerTray", { name: materialName(round.materials[index]) }) + ". " + rank + ". " + copy(possible ? "candidate" : "ruledOut"));
      card.disabled = state.busy;
    });
    $("deductionText").textContent = copy(info.proven !== null ? "proofReady" : "candidatesLeft", { count: info.candidates.length });
    $("deductionMeter").style.setProperty("--proof-progress", ((round.materials.length - info.candidates.length) / (round.materials.length - 1) * 100) + "%");
    $("deductionMeter").classList.toggle("is-proven", info.proven !== null);
    $("phaseLabel").textContent = copy(state.phase === "compare" ? "weighStep" : "chooseStep");
    $("phaseActionBtn").textContent = copy(state.busy ? "weighing" : state.phase === "compare" ? "compare" : "check");
    $("phaseActionBtn").disabled = state.busy || (state.phase === "compare" ? state.selectedPair.length !== 2 : state.selectedTarget === null);
    const phaseToggle = $("phaseToggleBtn");
    const showPhaseToggle = true;
    phaseToggle.hidden = !showPhaseToggle;
    if (showPhaseToggle) phaseToggle.setAttribute("data-wp-frame-action", "secondary");
    else phaseToggle.removeAttribute("data-wp-frame-action");
    phaseToggle.textContent = copy(state.phase === "compare" ? "chooseAction" : "compareMore");
    phaseToggle.disabled = state.busy;
    $("clearSelectionBtn").disabled = state.busy;
    $("compareHeading").textContent = copy(state.phase === "compare" ? "compareTitle" : "answerTitle");
    $("comparisonText").textContent = comparisonMessage();
    $("comparisonText").classList.toggle("has-comparison", state.clues.length > 0);
    $("comparisonText").classList.toggle("is-repeat", state.lastFeedback === "pairAlreadyKnown");
    const status = state.busy ? copy("weighing") : state.wrong ? copy("wrong")
      : state.lastFeedback === "pairAlreadyKnown" ? copy("pairAlreadyKnown")
      : state.lastFeedback === "needPair" ? copy("needPair")
      : state.lastFeedback === "needAnswer" ? copy("needAnswer")
      : state.lastFeedback === "needProof" ? copy("needProof")
      : state.lastFeedback === "inferredPair" ? copy("inferredPair")
      : info.proven !== null ? copy("proofReady") : copy("strategyHelp");
    $("battleStatus").textContent = status;
    $("battleStatus").classList.toggle("is-wrong", state.wrong);
    $("mistakeCount").textContent = copy("mistakesCount", { count: state.mistakes });
    renderClues();
    updateBalance();
    $("resultPanel").hidden = !state.resultVisible;
    $("battlePanel").hidden = state.resultVisible;
    if (state.resultVisible) renderResult();
  }

  function compareSelected() {
    if (state.busy || state.resultVisible) return;
    if (state.selectedPair.length !== 2) {
      state.lastFeedback = "needPair";
      $("battleStatus").textContent = copy("needPair");
      playSound("feedback.error");
      return;
    }
    const pair = uniqueSorted(state.selectedPair);
    const key = pair.join(":");
    if (state.knownPairs.has(key)) {
      state.lastFeedback = "pairAlreadyKnown";
      state.wrong = false;
      renderBattle();
      animate($("comparisonText"), [{ opacity: .4 }, { opacity: 1 }]);
      return;
    }
    const info = knowledge();
    if (info.below[pair[0]][pair[1]] || info.below[pair[1]][pair[0]]) {
      state.lastFeedback = "inferredPair";
      renderBattle();
      animate($("comparisonText"), [{ opacity: .4 }, { opacity: 1 }]);
      return;
    }
    const sources = pair.map((index) => $("materialBoard").querySelector(`[data-material-tray="${index}"] .tray-icon`).getBoundingClientRect());
    pendingPair = pair;
    state.busy = true;
    state.lastFeedback = "";
    renderBattle();
    $("balanceVisual").classList.add("is-loading");
    pair.forEach((index, i) => flyMaterial(index, sources[i], $(i === 0 ? "balanceLeft" : "balanceRight")));
    revealTimer = window.setTimeout(revealComparison, reducedMotion() ? 100 : 620);
  }

  function revealComparison() {
    if (!pendingPair) return;
    const pair = pendingPair;
    const previous = knowledge().candidates.length;
    window.clearTimeout(revealTimer);
    revealTimer = null;
    pendingPair = null;
    state.busy = false;
    $("balanceVisual").classList.remove("is-loading");
    state.selectedPair = [];
    const key = pair.join(":");
    const round = rounds[state.round];
    const [lighter, heavier] = round.weights[pair[0]] < round.weights[pair[1]] ? pair : [pair[1], pair[0]];
    state.knownPairs.add(key);
    state.clues.push({ pair, lighter, heavier });
    state.comparisons = state.clues.length;
    state.selectedTarget = null;
    if (knowledge().proven !== null) state.phase = "answer";
    state.lastFeedback = "";
    state.wrong = false;
    playSound("feedback.hint");
    renderBattle();
    animate($("comparisonText"), [{ opacity: .2, transform: "translateY(5px)" }, { opacity: 1, transform: "translateY(0)" }]);
    if (knowledge().candidates.length < previous) burst($("deductionMeter"));
    if (knowledge().proven !== null) animate($("nestCompanion"), [{ transform: "translateY(0)" }, { transform: "translateY(-9px)", offset: .5 }, { transform: "translateY(0)" }], 420);
  }

  function togglePhase() {
    if (state.busy || state.resultVisible) return;
    if (state.phase === "compare") {
      state.phase = "answer";
      state.selectedTarget = null;
    } else {
      state.phase = "compare";
      state.selectedPair = [];
      state.selectedTarget = null;
    }
    state.wrong = false;
    state.lastFeedback = "";
    renderBattle();
    animate($("materialBoard"), [{ opacity: .6 }, { opacity: 1 }]);
  }

  function clearPair() {
    if (state.busy || state.resultVisible) return;
    state.selectedPair = [];
    state.selectedTarget = null;
    state.wrong = false;
    if (state.lastFeedback === "pairAlreadyKnown") state.lastFeedback = "";
    renderBattle();
  }

  function chooseRank() {
    if (state.mistakes === 0) return 3;
    if (state.mistakes <= 1) return 2;
    return 1;
  }

  function recordMastery() {
    const index = state.round;
    const record = { feathers: chooseRank(), comparisons: state.comparisons, mistakes: state.mistakes };
    const previous = bestForStage(index);
    const isNewBest = !previous || record.feathers > previous.feathers
      || (record.feathers === previous.feathers && (record.comparisons < previous.comparisons
        || (record.comparisons === previous.comparisons && record.mistakes < previous.mistakes)));
    if (isNewBest) {
      state.mastery[String(index)] = record;
      saveMastery();
    }
    return { record: isNewBest ? record : previous, isNewBest };
  }

  function renderResult() {
    const round = rounds[state.round];
    const saved = bestForStage(state.round);
    const earned = chooseRank();
    const final = state.round === rounds.length - 1;
    $("resultHeading").textContent = copy(final ? "finishTitle" : "resultTitle");
    $("resultText").textContent = copy(final ? "finishText" : "resultText");
    $("resultRank").textContent = earned === 3 ? copy("rankPerfect") : earned === 2 ? copy("rankStrong") : copy("rankGrowing");
    $("featherStars").textContent = "★".repeat(earned) + "☆".repeat(3 - earned);
    $("featherStars").setAttribute("aria-label", copy("feathers", { count: earned }));
    $("resultStats").textContent = copy("stats", { comparisons: state.comparisons, best: saved ? copy("best", { count: saved.comparisons }) : copy("noBest") })
      + " · " + copy("mistakesCount", { count: state.mistakes });
    $("newBestBadge").hidden = !state.lastRecordIsNewBest;
    $("resultNextBtn").disabled = final;
    $("resultNextBtn").setAttribute("aria-disabled", String(final));
    $("resultStageBtn").textContent = copy("stages");
    $("resultNextBtn").textContent = copy("next");
    $("resultReplayBtn").textContent = copy("replay");
    $("resultPanel").dataset.checkpoint = String(Boolean(round.checkpoint));
    $("resultPanel").classList.add("is-entering");
    $("resultPanel").addEventListener("animationend", () => $("resultPanel").classList.remove("is-entering"), { once: true });
  }

  function showResult() {
    const round = rounds[state.round];
    const result = recordMastery();
    state.lastRecordIsNewBest = result.isNewBest;
    if (!state.completed.includes(state.round)) state.completed.push(state.round);
    state.completed = uniqueSorted(state.completed);
    saveCompleted();
    state.resultVisible = true;
    state.wrong = false;
    state.lastFeedback = "";
    renderBattle();
    if (state.round === rounds.length - 1) playSound("result.win");
    else if (round.checkpoint) playSound("game.checkpoint");
    else playSound("feedback.success");
    renderMain();
    stageController?.refresh();
    measurement.ended = true;
    measurement.outcome = "complete";
    measurement.screen = null;
    notifyMeasurement();
    frame?.activate("battle", { covered: true });
  }

  function resetRound({ replay = false } = {}) {
    cancelMotion();
    state.selectedPair = [];
    state.selectedTarget = null;
    state.clues = [];
    state.knownPairs = new Set();
    state.comparisons = 0;
    state.mistakes = 0;
    state.wrong = false;
    state.resultVisible = false;
    state.phase = "compare";
    state.lastFeedback = "ready";
    state.lastRecordIsNewBest = false;
    renderedClueCount = -1;
    if (state.screen === "battle") {
      measurement.roundKey = {};
      measurement.restart = Boolean(replay);
      measurement.started = true;
      measurement.ended = false;
      measurement.outcome = "complete";
      measurement.screen = "battle";
      notifyMeasurement();
    }
    renderBattle();
  }

  function closeLeaveDialog({ restoreFocus = true } = {}) {
    const dialog = $("leaveDialog");
    if (dialog.hidden) return;
    dialog.hidden = true;
    $("battleContent").inert = false;
    $("battleHeader").inert = false;
    if (restoreFocus) returnFocus?.focus({ preventScroll: true });
  }

  function openLeaveDialog() {
    revealComparison();
    returnFocus = document.activeElement;
    $("leaveTitle").textContent = copy("leaveTitle");
    $("leaveCopy").textContent = copy("leaveCopy");
    $("leaveContinueBtn").textContent = copy("continue");
    $("leaveStagesBtn").textContent = copy("returnStages");
    $("battleContent").inert = true;
    $("battleHeader").inert = true;
    $("leaveDialog").hidden = false;
    $("leaveContinueBtn").focus({ preventScroll: true });
  }

  function setScreen(screen) {
    if (screen !== "battle") cancelMotion();
    state.screen = screen;
    document.body.dataset.screen = screen;
    $("mainGroup").hidden = screen !== "main";
    $("guideSection").hidden = screen !== "main";
    $("stageScreen").hidden = screen !== "stage";
    $("battleScreen").hidden = screen !== "battle";
    if (screen === "battle") renderBattle();
    if (screen === "main") renderMain();
    frame?.activate(screen, { covered: screen === "battle" && state.resultVisible });
    if (screen === "stage") {
      renderStages();
      requestAnimationFrame(() => {
        stageController?.refresh();
        stageController?.center(highestUnlocked());
      });
    }
    if (screen === "stage" || screen === "main") {
      if (measurement.started && !measurement.ended && measurement.screen === "battle") {
        measurement.ended = true;
        measurement.outcome = "abandon";
        notifyMeasurement();
      }
      measurement.screen = screen;
    }
    if (screen === "battle") {
      measurement.screen = state.resultVisible ? null : "battle";
      notifyMeasurement();
    }
  }

  function startRound(index, { replay = false } = {}) {
    const safeIndex = Math.max(0, Math.min(rounds.length - 1, Math.trunc(index)));
    if (!stageUnlocked(safeIndex) && safeIndex !== state.round) return false;
    state.round = safeIndex;
    closeLeaveDialog({ restoreFocus: false });
    resetRound({ replay });
    playSound("game.start");
    setScreen("battle");
    measurement.roundKey = {};
    measurement.restart = Boolean(replay);
    measurement.started = true;
    measurement.ended = false;
    measurement.outcome = "complete";
    measurement.screen = "battle";
    notifyMeasurement();
    return true;
  }

  function checkRound() {
    if (state.busy || state.resultVisible) return;
    if (state.phase !== "answer" || state.selectedTarget === null) {
      state.lastFeedback = "needAnswer";
      $("battleStatus").textContent = copy("needAnswer");
      playSound("feedback.error");
      return;
    }
    const info = knowledge();
    if (info.candidates.includes(state.selectedTarget) && info.proven === null) {
      state.lastFeedback = "needProof";
      renderBattle();
      animate($("deductionMeter"), [{ opacity: .4 }, { opacity: 1 }]);
      return;
    }
    if (state.selectedTarget === info.proven) {
      const source = $("materialBoard").querySelector(`[data-material-tray="${state.selectedTarget}"] .tray-icon`).getBoundingClientRect();
      state.wrong = false;
      state.lastRecordIsNewBest = false;
      state.lastFeedback = "";
      showResult();
      flyMaterial(state.selectedTarget, source, $("resultPanel").querySelector(".result-art"));
      burst($("resultPanel").querySelector(".result-art"), true);
      return;
    }
    state.wrong = true;
    state.mistakes += 1;
    state.lastFeedback = "";
    playSound("feedback.error");
    renderBattle();
    const weighingCard = $("materialBoard").closest(".weighing-card");
    weighingCard.classList.remove("is-rejected");
    void weighingCard.offsetWidth;
    weighingCard.classList.add("is-rejected");
    weighingCard.addEventListener("animationend", () => weighingCard.classList.remove("is-rejected"), { once: true });
  }

  function applyText() {
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = copy(node.dataset.copy); });
    document.querySelectorAll("[data-copy-aria-label]").forEach((node) => node.setAttribute("aria-label", copy(node.dataset.copyAriaLabel)));
    renderMain();
    if (state.screen === "stage") renderStages();
    if (state.screen === "battle") renderBattle();
    frame?.refresh();
  }

  function applyLocale(locale, navigate = false) {
    const selected = localeList.includes(locale) && localeMap[locale] ? locale : "en";
    const pathLocale = location.pathname.match(/^\/(en|zh-tw|zh-cn|ja|ko|es|pt-br|fr|de|it|ru|hi|ar)\//)?.[1] || "";
    const pathMap = { "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", "pt-br": "pt-BR" };
    const current = pathMap[pathLocale] || pathLocale;
    if (navigate && current && current !== selected) {
      location.assign("/" + localeSegments[selected] + "/games/animal-nest-weigh/" + location.search + location.hash);
      return;
    }
    state.locale = selected;
    safeSet("weightplay-locale", selected);
    document.documentElement.lang = selected;
    document.documentElement.dir = selected === "ar" ? "rtl" : "ltr";
    $("localeSelect").value = selected;
    applyText();
    window.dispatchEvent(new Event("wonder:locale-change"));
  }

  function initialLocale() {
    const query = new URLSearchParams(location.search).get("lang");
    const segment = location.pathname.match(/^\/(en|zh-tw|zh-cn|ja|ko|es|pt-br|fr|de|it|ru|hi|ar)\//)?.[1];
    const pathMap = { "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", "pt-br": "pt-BR" };
    return query || pathMap[segment] || segment || safeGet("weightplay-locale", "en");
  }

  function bind() {
    $("startBtn").addEventListener("click", () => setScreen("stage"));
    $("mainReturn").addEventListener("click", () => { setScreen("main"); });
    $("stageBackBtn").addEventListener("click", () => setScreen("main"));
    $("battleBackBtn").addEventListener("click", (event) => {
      event.preventDefault();
      if (state.resultVisible || (!state.comparisons && !state.selectedPair.length && state.selectedTarget === null && !state.mistakes)) {
        setScreen("stage");
      } else {
        openLeaveDialog();
      }
    });
    $("phaseActionBtn").addEventListener("click", () => state.phase === "compare" ? compareSelected() : checkRound());
    $("phaseToggleBtn").addEventListener("click", togglePhase);
    $("clearSelectionBtn").addEventListener("click", clearPair);
    $("materialBoard").addEventListener("click", (event) => {
      const card = event.target.closest("[data-material-tray]");
      if (!card || state.busy || state.resultVisible) return;
      const index = Number(card.dataset.materialTray);
      if (state.phase === "compare") {
        state.selectedPair = state.selectedPair.includes(index)
          ? state.selectedPair.filter((item) => item !== index)
          : state.selectedPair.length < 2 ? [...state.selectedPair, index] : [state.selectedPair[1], index];
      } else {
        state.selectedTarget = index;
      }
      state.lastFeedback = "";
      state.wrong = false;
      renderBattle();
    });
    $("resultStageBtn").addEventListener("click", () => {
      state.resultVisible = false;
      renderBattle();
      setScreen("stage");
    });
    $("resultNextBtn").addEventListener("click", () => {
      if (state.round < rounds.length - 1) startRound(state.round + 1);
    });
    $("resultReplayBtn").addEventListener("click", () => startRound(state.round, { replay: true }));
    $("leaveContinueBtn").addEventListener("click", () => closeLeaveDialog());
    $("leaveStagesBtn").addEventListener("click", () => {
      closeLeaveDialog({ restoreFocus: false });
      setScreen("stage");
    });
    $("leaveDialog").addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeLeaveDialog();
      } else if (event.key === "Tab") {
        const buttons = [$("leaveContinueBtn"), $("leaveStagesBtn")];
        if (event.shiftKey && document.activeElement === buttons[0]) {
          event.preventDefault();
          buttons[1].focus();
        } else if (!event.shiftKey && document.activeElement === buttons[1]) {
          event.preventDefault();
          buttons[0].focus();
        }
      }
    });
    $("localeSelect").addEventListener("change", (event) => applyLocale(event.target.value, true));
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) { revealComparison(); cancelMotion(); }
    });
    window.addEventListener("pagehide", () => { cancelMotion(); stageController?.destroy(); }, { once: true });
  }

  function mountFrame() {
    const root = $("gameFrame");
    frame = window.WeightPlayScreenFrame.mount({
      root,
      localeSelect: $("localeSelect"),
      scenes: {
        main: { root: $("mainScreen"), header: $("mainHeader"), content: $("mainContent") },
        stage: { root: $("stageCanvas"), header: $("stageHeader"), content: $("stageWorkspace") },
        battle: { root: $("battleCanvas"), header: $("battleHeader"), content: $("battleContent") },
      },
    });
  }

  function mountStageController() {
    const rail = $("stageList");
    stageController = window.WeightPlayStageV6.install(rail, {
      total: rounds.length,
      poolSize: 9,
      initialIndex: highestUnlocked,
      bind: bindStageCard,
      activate: (index) => {
        if (stageUnlocked(index)) startRound(index);
      },
    });
  }

  function init() {
    if (!rounds.length) throw new Error("NEST_WEIGH_CAMPAIGN_MISSING");
    state.completed = loadCompleted();
    state.mastery = loadMastery();
    bind();
    mountFrame();
    mountStageController();
    applyLocale(initialLocale());
    setScreen("main");
    renderMain();
    const loadingPanel = $("loadingPanel");
    if (loadingPanel) {
      const hideLoading = () => {
        loadingPanel.hidden = true;
        loadingPanel.classList.add("hidden");
        loadingPanel.setAttribute("aria-busy", "false");
      };
      if (document.readyState === "complete") hideLoading();
      else window.addEventListener("load", hideLoading, { once: true });
      window.setTimeout(hideLoading, 1600);
    }
  }

  window.__ANIMAL_NEST_WEIGH_TEST__ = { state, rounds, targetIndex, startRound, applyLocale, compareSelected, checkRound, knowledge, revealComparison, cancelMotion };
  init();
})();
