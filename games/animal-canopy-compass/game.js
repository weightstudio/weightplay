(function () {
  "use strict";

  const copy = window.CANOPY_COMPASS_LOCALES || {};
  const standardStartLabels = { en: "Start Game", "zh-Hant": "開始遊戲", "zh-Hans": "开始游戏", ja: "ゲーム開始", ko: "게임 시작", es: "Iniciar juego", "pt-BR": "Iniciar jogo", fr: "Commencer le jeu", de: "Spiel starten", it: "Inizia gioco", ru: "Начать игру", hi: "खेल शुरू करें", ar: "ابدأ اللعبة" };
  Object.entries(standardStartLabels).forEach(([locale, label]) => { if (copy[locale]) copy[locale].start = label; });
  const supportedLocales = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const routeLocaleMap = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const ruleOffsets = { hold: 0, cw: 1, ccw: 3, opposite: 2 };
  const rounds = [
    { arc: 1, phases: [["E", "hold"]] },
    { arc: 1, phases: [["S", "hold"]] },
    { arc: 1, phases: [["W", "cw"]] },
    { arc: 1, phases: [["N", "ccw"]] },
    { arc: 1, checkpoint: 1, phases: [["E", "hold"], ["S", "cw"]] },
    { arc: 2, phases: [["N", "cw"]] },
    { arc: 2, phases: [["E", "ccw"]] },
    { arc: 2, phases: [["S", "opposite"]] },
    { arc: 2, phases: [["W", "cw"]] },
    { arc: 2, checkpoint: 2, phases: [["E", "opposite"], ["S", "ccw"]] },
    { arc: 3, phases: [["N", "opposite"]] },
    { arc: 3, phases: [["E", "cw"]] },
    { arc: 3, phases: [["W", "ccw"]] },
    { arc: 3, phases: [["S", "opposite"]] },
    { arc: 3, checkpoint: 3, phases: [["E", "opposite"], ["W", "cw"], ["S", "ccw"]] },
    { arc: 4, phases: [["E", "hold"], ["N", "ccw"]] },
    { arc: 4, phases: [["N", "cw"], ["W", "hold"]] },
    { arc: 4, phases: [["S", "opposite"], ["E", "cw"]] },
    { arc: 4, phases: [["N", "hold"], ["W", "opposite"]] },
    { arc: 4, checkpoint: 4, phases: [["E", "hold"], ["S", "cw"], ["N", "opposite"]] },
    { arc: 5, phases: [["W", "cw"], ["E", "opposite"]] },
    { arc: 5, phases: [["S", "ccw"], ["N", "hold"]] },
    { arc: 5, phases: [["W", "opposite"], ["E", "ccw"]] },
    { arc: 5, phases: [["S", "hold"], ["N", "cw"], ["E", "opposite"]] },
    { arc: 5, checkpoint: 5, phases: [["W", "ccw"], ["N", "hold"], ["E", "opposite"]] },
    { arc: 6, phases: [["E", "opposite"], ["N", "cw"]] },
    { arc: 6, phases: [["W", "ccw"], ["S", "opposite"]] },
    { arc: 6, phases: [["N", "hold"], ["E", "opposite"], ["W", "ccw"]] },
    { arc: 6, phases: [["E", "cw"], ["W", "hold"], ["S", "opposite"]] },
    { arc: 6, checkpoint: 6, finale: true, phases: [["E", "hold"], ["W", "cw"], ["N", "opposite"]] },
  ].map((round, index) => ({
    ...round,
    id: index + 1,
    phases: round.phases.map(([mark, rule]) => ({ mark: ["N", "E", "S", "W"].indexOf(mark), rule })),
  }));
  const names = ["north", "east", "south", "west"];
  const campaignKey = "weightplay-animal-canopy-compass-campaign-v1";
  const $ = (id) => document.getElementById(id);
  const normalizeLocale = (value) => {
    if (value === "zh-TW") return "zh-Hant";
    if (value === "zh-CN") return "zh-Hans";
    if (value?.toLowerCase?.().startsWith("pt")) return "pt-BR";
    if (supportedLocales.includes(value)) return value;
    const short = value?.split?.("-")?.[0];
    return supportedLocales.includes(short) ? short : "en";
  };
  const routeSegment = window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
  const routeLocale = routeLocaleMap[routeSegment] || window.__WEIGHTPLAY_ROUTE_LOCALE__;
  const savedLocale = (() => { try { return localStorage.getItem("weightPlayLocale") || localStorage.getItem("weightplayLocale") || localStorage.getItem("wp-locale"); } catch (_) { return null; } })();
  const get = (key, fallback = "") => { try { return localStorage.getItem(key) || fallback; } catch (_) { return fallback; } };
  const set = (key, value) => { try { localStorage.setItem(key, value); } catch (_) {} };
  const loadCampaign = () => {
    try {
      const saved = JSON.parse(get(campaignKey, "null"));
      if (!saved || saved.schema !== 1) return { completed: [], bests: {}, badges: [] };
      const candidates = [...new Set((Array.isArray(saved.completed) ? saved.completed : []).map(Number).filter((id) => Number.isInteger(id) && id >= 1 && id <= rounds.length))].sort((a, b) => a - b);
      const completed = [];
      for (const id of candidates) { if (id !== completed.length + 1) break; completed.push(id); }
      const bests = {};
      if (saved.bests && typeof saved.bests === "object") Object.entries(saved.bests).forEach(([id, turns]) => {
        if (/^([1-9]|[12][0-9]|30)$/.test(id) && Number.isInteger(turns) && turns >= 0 && turns < 10000) bests[id] = turns;
      });
      const badges = rounds.filter((round) => round.checkpoint && completed.includes(round.id) && Array.isArray(saved.badges) && saved.badges.includes(round.id)).map((round) => round.id);
      return { completed, bests, badges };
    } catch (_) { return { completed: [], bests: {}, badges: [] }; }
  };
  const savedCampaign = loadCampaign();
  const state = { locale: normalizeLocale(routeLocale || window.WonderI18n?.localeFromPath?.() || savedLocale || document.documentElement.lang), screen: "main", round: 0, phase: 0, direction: 0, turns: 0, completed: savedCampaign.completed, bests: savedCampaign.bests, badges: savedCampaign.badges, sound: true };
  let stageRailController = null;
  const t = (key, vars = {}) => {
    let value = (copy[state.locale] || copy.en || {})[key] || (copy.en || {})[key] || key;
    Object.entries(vars).forEach(([name, replacement]) => { value = value.replace(new RegExp("\\{" + name + "\\}", "g"), String(replacement)); });
    return value;
  };
  const showToast = (message) => {
    const toast = $("toast");
    toast.textContent = message;
    toast.classList.add("visible");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("visible"), 1600);
  };
  const revealResultAction = () => {
    window.requestAnimationFrame(() => {
      const action = $("resultPrimary");
      if (!action || $("result").hidden) return;
      action.focus({ preventScroll: true });
      action.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "auto" });
    });
  };
  const setScreen = (name) => {
    state.screen = name;
    document.body.dataset.screen = name;
    ["main", "stage", "battle"].forEach((screen) => { $(`${screen}Screen`).hidden = screen !== name; });
    $("settingsPanel").hidden = true;
    $("settingsBtn").setAttribute("aria-expanded", "false");
    if (name === "stage") renderStages();
    if (name === "battle") renderBattle();
    if (name === "main") applyLocale();
    window.scrollTo(0, 0);
  };
  const applyLocale = () => {
    document.documentElement.lang = state.locale === "zh-Hant" ? "zh-TW" : state.locale;
    document.documentElement.dir = state.locale === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = t(node.dataset.copy); });
    $("settingsBtn").setAttribute("aria-label", t("settings"));
    $("settingsPanel").setAttribute("aria-label", t("settings"));
    $("localeSelect").setAttribute("aria-label", t("language"));
    $("localeSelect").value = state.locale;
    $("soundBtn").textContent = state.sound ? t("soundOn") : t("soundOff");
    $("soundBtn").setAttribute("aria-pressed", String(state.sound));
    $("battleSound").setAttribute("aria-label", state.sound ? t("soundOn") : t("soundOff"));
    $("battleSound").setAttribute("title", state.sound ? t("soundOn") : t("soundOff"));
    $("stageHelp").setAttribute("aria-label", t("help"));
    $("stageHelp").setAttribute("title", t("help"));
    $("stageHeading").setAttribute("aria-label", t("map"));
    $("battleMap").setAttribute("aria-label", t("map"));
    $("stageScreen").setAttribute("aria-label", t("map"));
    $("directionRack").setAttribute("aria-label", t("directionChoices"));
    updateProgress();
    document.querySelector(".wp-shell-return")?.setAttribute("aria-label", t("lobbyReturn"));
    document.querySelector(".stage-tabs")?.setAttribute("aria-label", t("stageSections"));
    if (state.screen === "stage") renderStages();
    if (state.screen === "battle") renderBattle();
  };
  const unlockedCount = () => {
    let count = 1;
    while (count < rounds.length && state.completed.includes(count)) count += 1;
    return count;
  };
  const highestUnlockedIndex = () => Math.min(rounds.length - 1, unlockedCount() - 1);
  const updateProgress = () => { $("progress").textContent = t("progress", { count: state.completed.length, unlocked: unlockedCount() }); };
  const saveCampaign = () => set(campaignKey, JSON.stringify({ schema: 1, completed: state.completed, bests: state.bests, badges: state.badges }));
  const renderStageCard = (card, index) => {
    const round = rounds[index];
    const unlocked = index <= highestUnlockedIndex();
    const complete = state.completed.includes(round.id);
    const title = document.createElement("span");
    title.className = "stage-number";
    title.textContent = t("round", { number: round.id, total: rounds.length });
    const arc = document.createElement("h3");
    arc.textContent = t("arc" + round.arc);
    const objective = document.createElement("p");
    objective.textContent = t("stageObjective", { count: round.phases.length });
    const status = document.createElement("span");
    status.className = "stage-chip";
    status.textContent = complete ? t("complete") : !unlocked ? t("lockedStage") : round.checkpoint ? t("checkpoint") : t("readyStage");
    card.className = "stage-card" + (complete ? " done" : "") + (!unlocked ? " locked" : "") + (round.checkpoint ? " checkpoint" : "");
    card.dataset.stage = String(round.id);
    card.setAttribute("aria-disabled", String(!unlocked));
    card.setAttribute("aria-label", [title.textContent, arc.textContent, objective.textContent, status.textContent].join(". "));
    card.replaceChildren(title, arc, objective, status);
  };
  const renderStages = () => {
    const rail = $("stageList");
    if (!window.WeightPlayStageV6?.install) {
      rail.replaceChildren();
      const unavailable = document.createElement("p");
      unavailable.className = "stage-rail-error";
      unavailable.textContent = t("stageControllerUnavailable");
      rail.append(unavailable);
      return;
    }
    if (!stageRailController) {
      stageRailController = window.WeightPlayStageV6.install(rail, {
        total: rounds.length,
        poolSize: 9,
        initialIndex: highestUnlockedIndex,
        bind: renderStageCard,
        activate: (index) => {
          if (index > highestUnlockedIndex()) return;
          startRound(index);
        },
      });
      if (!stageRailController) {
        const unavailable = document.createElement("p");
        unavailable.className = "stage-rail-error";
        unavailable.textContent = t("stageControllerUnavailable");
        rail.append(unavailable);
        return;
      }
    } else {
      stageRailController.refresh();
    }
    stageRailController.center(highestUnlockedIndex());
  };
  const renderDirectionButtons = () => {
    const rack = $("directionRack");
    rack.replaceChildren();
    names.forEach((name, index) => {
      const button = document.createElement("button");
      button.className = `direction${state.direction === index ? " active" : ""}`;
      button.type = "button";
      button.textContent = t(name);
      button.setAttribute("aria-pressed", String(state.direction === index));
      button.addEventListener("click", () => { state.direction = index; state.turns += 1; renderBattle(); $("status").textContent = t("changed", { direction: t(name) }); });
      rack.append(button);
    });
  };
  const renderBattle = () => {
    const round = rounds[state.round];
    const phase = round.phases[state.phase];
    const battleCanvas = document.querySelector(".battle-canvas");
    const preservedScrollTop = battleCanvas?.scrollTop || 0;
    $("battleHeading").textContent = t("title");
    $("roundLabel").textContent = t("round", { number: round.id, total: rounds.length });
    $("hint").textContent = t("arc" + round.arc) + " · " + t("phaseProgress", { current: state.phase + 1, total: round.phases.length });
    $("badge").textContent = `${state.completed.length}/${rounds.length}`;
    const ruleKey = { hold: "ruleDirect", cw: "ruleClockwise", ccw: "ruleCounterclockwise", opposite: "ruleOpposite" }[phase.rule];
    $("clueText").textContent = t(ruleKey, { mark: t(names[phase.mark]) });
    $("compass").className = `compass direction-${state.direction}`;
    $("compass").setAttribute("aria-label", t("compassLabel"));
    $("facing").textContent = t("facing", { direction: t(names[state.direction]) });
    renderDirectionButtons();
    $("result").hidden = true;
    $("checkBtn").disabled = false;
    $("resetBtn").disabled = false;
    if (battleCanvas) battleCanvas.scrollTop = preservedScrollTop;
  };
  const startRound = (index) => {
    const selected = Math.max(0, Math.min(rounds.length - 1, index));
    if (selected > highestUnlockedIndex()) { showToast(t("lockedStage")); return; }
    state.round = selected;
    state.phase = 0;
    state.direction = 0;
    state.turns = 0;
    setScreen("battle");
    $("status").textContent = t("ready");
  };
  const startSession = () => { setScreen("stage"); };
  const check = () => {
    const round = rounds[state.round];
    const phase = round.phases[state.phase];
    const battleCanvas = document.querySelector(".battle-canvas");
    const preservedScrollTop = battleCanvas?.scrollTop || 0;
    const target = (phase.mark + ruleOffsets[phase.rule]) % names.length;
    if (state.direction !== target) {
      $("status").textContent = t("wrong");
      if (document.activeElement === $("checkBtn")) $("checkBtn").blur();
      if (battleCanvas) {
        battleCanvas.scrollTop = preservedScrollTop;
        window.requestAnimationFrame(() => { battleCanvas.scrollTop = preservedScrollTop; });
      }
      return;
    }
    state.phase += 1;
    if (state.phase < round.phases.length) {
      renderBattle();
      $("status").textContent = t("correct");
      return;
    }
    if (!state.completed.includes(round.id)) state.completed = [...state.completed, round.id].sort((a, b) => a - b);
    const previousBest = state.bests[round.id];
    if (previousBest === undefined || state.turns < previousBest) state.bests[round.id] = state.turns;
    if (round.checkpoint && !state.badges.includes(round.id)) state.badges = [...state.badges, round.id];
    saveCampaign();
    updateProgress();
    stageRailController?.refresh();
    $("status").textContent = t("correct");
    $("checkBtn").disabled = true;
    $("resetBtn").disabled = true;
    const final = round.finale === true;
    const badge = round.checkpoint ? t("badge" + round.checkpoint) : "";
    $("resultTitle").textContent = final ? t("finaleTitle") : round.checkpoint ? t("checkpoint") + " · " + t("complete") : t("complete");
    $("resultText").textContent = final
      ? t("finaleText") + " " + t("badgeEarned", { badge: t("badge6") })
      : round.checkpoint ? t("badgeEarned", { badge }) : t("stageClear");
    $("stats").textContent = t("stats", { turns: state.turns, best: state.bests[round.id] ?? state.turns });
    $("resultPrimary").textContent = final ? t("replay") : t("nextStage");
    $("resultPrimary").onclick = () => final ? startRound(state.round) : startRound(state.round + 1);
    $("result").hidden = false;
    revealResultAction();
  };
  $("startBtn").addEventListener("click", startSession);
  $("mapBtn").addEventListener("click", () => setScreen("stage"));
  $("stageBack").addEventListener("click", () => setScreen("main"));
  $("stageHelp").addEventListener("click", () => showToast(t("mapIntro")));
  $("battleBack").addEventListener("click", () => setScreen("stage"));
  $("battleMap").addEventListener("click", () => setScreen("stage"));
  $("checkBtn").addEventListener("click", check);
  $("resetBtn").addEventListener("click", () => { state.direction = 0; state.turns += 1; renderBattle(); $("status").textContent = t("ready"); });
  $("resultMap").addEventListener("click", () => setScreen("stage"));
  $("resultHome").addEventListener("click", () => setScreen("main"));
  $("settingsBtn").addEventListener("click", () => { const panel = $("settingsPanel"); panel.hidden = !panel.hidden; $("settingsBtn").setAttribute("aria-expanded", String(!panel.hidden)); });
  $("soundBtn").addEventListener("click", () => { state.sound = !state.sound; set("weightplay-canopy-compass-sound", state.sound ? "on" : "off"); applyLocale(); });
  $("battleSound").addEventListener("click", () => { state.sound = !state.sound; set("weightplay-canopy-compass-sound", state.sound ? "on" : "off"); applyLocale(); });
  $("closeSettings")?.addEventListener("click", () => { $("settingsPanel").hidden = true; $("settingsBtn").setAttribute("aria-expanded", "false"); });
  $("localeSelect").addEventListener("change", (event) => { state.locale = normalizeLocale(event.target.value); set("weightPlayLocale", state.locale); set("weightplayLocale", state.locale); set("wp-locale", state.locale); applyLocale(); });
  document.addEventListener("keydown", (event) => {
    if (state.screen !== "battle" || !$("result").hidden) return;
    if ((event.key === "Enter" || event.key === " ") && document.activeElement === $("compass")) { event.preventDefault(); check(); return; }
    const directionMap = { ArrowUp: 0, ArrowRight: 1, ArrowDown: 2, ArrowLeft: 3 };
    if (!(event.key in directionMap)) return;
    event.preventDefault();
    state.direction = directionMap[event.key];
    state.turns += 1;
    renderBattle();
    $("status").textContent = t("changed", { direction: t(names[state.direction]) });
  });
  window.addEventListener("pagehide", () => stageRailController?.destroy(), { once: true });
  state.sound = get("weightplay-canopy-compass-sound", "on") !== "off";
  setTimeout(() => { $("loadingPanel").hidden = true; $("mainScreen").hidden = false; applyLocale(); }, 280);
}());
