(function () {
  "use strict";

  const locales = window.ANIMAL_COZY_CAMP_LOCALES || {};
  const localeKeys = window.ANIMAL_COZY_CAMP_LOCALE_KEYS || ["en"];
  const Campaign = window.ANIMAL_COZY_CAMP_CAMPAIGN;
  const startLabels = {
    en: "Start Game", "zh-Hant": "開始遊戲", "zh-Hans": "开始游戏", ja: "ゲーム開始",
    ko: "게임 시작", es: "Iniciar juego", "pt-BR": "Iniciar jogo", fr: "Démarrer le jeu",
    de: "Spiel starten", it: "Avvia il gioco", ru: "Начать игру", hi: "खेल शुरू करें", ar: "ابدأ اللعبة",
  };
  Object.entries(startLabels).forEach(([locale, label]) => {
    if (locales[locale]) locales[locale].start = label;
  });

  const authoredRounds = Campaign?.authoredRounds || [];

  const routeLocale = (() => {
    const map = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
    return map[location.pathname.split("/").filter(Boolean)[0]] || null;
  })();
  const state = {
    locale: "en", sound: !Boolean(window.WeightPlayAudio?.isMuted?.()), round: 0,
    selected: null, checks: 0, totalChecks: 0, view: "main", locked: false,
    progress: Campaign?.freshProgress?.() || { schema: 1, completedIds: [], bestChecksByStage: {} },
    stageVirtual: null, runToken: 0,
  };
  const $ = (id) => document.getElementById(id);
  const t = (key, vars = {}) => {
    const table = locales[state.locale] || locales.en || {};
    let value = String(table[key] || locales.en?.[key] || key);
    Object.entries(vars).forEach(([name, replacement]) => { value = value.replaceAll(`{${name}}`, String(replacement)); });
    return value;
  };
  const safeStorage = () => { try { return window.localStorage; } catch (_) { return null; } };
  const refreshProgress = () => { state.progress = Campaign.loadProgress(safeStorage()); };
  const persistProgress = () => Campaign.saveProgress(safeStorage(), state.progress);
  const stage = () => Campaign.stages[state.round];
  const isAllComplete = () => state.progress.completedIds.length === Campaign.STAGE_COUNT;
  const track = (event, detail = {}) => {
    window.dispatchEvent(new CustomEvent("weightplay:analytics", { detail: { game: "animal-cozy-camp", event, ...detail } }));
  };
  const tone = (cue = "ui.click") => window.WeightPlayAudio?.play(cue);
  const syncSoundState = () => { state.sound = !Boolean(window.WeightPlayAudio?.isMuted?.()); };

  function show(view) {
    state.view = view;
    const inBattle = view === "battle" || view === "result";
    $("mainScreen").hidden = view !== "main";
    $("stageScreen").hidden = view !== "stage";
    $("battleScreen").hidden = !inBattle;
    $("battle-content").hidden = view !== "battle";
    $("result-view").hidden = view !== "result";
    $("gameGuide").hidden = view !== "main";
    document.body.dataset.screen = view;
    document.body.dataset.battleState = view === "result" ? "result" : view === "battle" ? "live" : "";
    document.body.dataset.battleSubstate = view === "result" ? "result" : "";
    window.scrollTo(0, 0);
    if (view === "stage") renderStages();
    if (view === "battle") renderBattle();
    if (view === "result") renderResult();
    window.dispatchEvent(new CustomEvent("weightplay:shell-sync"));
  }

  function applyLocale() {
    const copy = locales[state.locale] || locales.en || {};
    document.documentElement.lang = state.locale === "zh-Hant" ? "zh-TW" : state.locale === "zh-Hans" ? "zh-CN" : state.locale;
    document.documentElement.dir = copy.direction || "ltr";
    document.title = `${t("title")} | WeightPlay`;
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = t(node.dataset.copy); });
    document.querySelectorAll("[data-copy-alt]").forEach((node) => { node.setAttribute("alt", t(node.dataset.copyAlt)); });
    document.querySelectorAll("[data-copy-aria]").forEach((node) => {
      const key = node.dataset.copyAria === "sound" ? (state.sound ? "soundOn" : "soundOff") : node.dataset.copyAria;
      node.setAttribute("aria-label", t(key));
    });
    $("gameGuide")?.setAttribute("aria-label", t("guideTitle"));
    $("layout-choices")?.setAttribute("aria-label", t("layoutAria"));
    [$("sound-toggle"), $("camp-sound-toggle")].filter(Boolean).forEach((node) => {
      node.textContent = state.sound ? t("soundOn") : t("soundOff");
      node.setAttribute("aria-pressed", String(state.sound));
    });
    [$("locale-select"), $("camp-picker")].filter(Boolean).forEach((node) => {
      node.setAttribute("aria-label", t("language"));
      node.value = state.locale;
    });
    if (state.view === "stage") renderStages();
    if (state.view === "battle") renderBattle();
    if (state.view === "result") renderResult();
  }

  function populateLocales() {
    const options = () => localeKeys.map((key) => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = locales.en.languageNames[key] || key;
      return option;
    });
    const select = $("locale-select");
    const picker = $("camp-picker");
    [select, picker].filter(Boolean).forEach((node) => node.replaceChildren(...options()));
    const onLocaleChange = (event) => {
      state.locale = event.target.value;
      try { safeStorage()?.setItem("weightplay-animal-cozy-camp-locale", state.locale); } catch (_) {}
      window.dispatchEvent(new CustomEvent("wonder:locale-change"));
      applyLocale();
    };
    select?.addEventListener("change", onLocaleChange);
    picker?.addEventListener("change", onLocaleChange);
  }

  function openDialog(id) {
    const dialog = $(id);
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }

  function closeDialog(id) {
    const dialog = $(id);
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  function shuffleRound(round) {
    const entries = round.layouts.map((layout, index) => ({ layout, correct: index === round.solution }));
    for (let i = entries.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [entries[i], entries[j]] = [entries[j], entries[i]];
    }
    return { ...round, layouts: entries.map((entry) => entry.layout), solution: entries.findIndex((entry) => entry.correct) };
  }

  function rotateLayout(layout, steps) {
    return layout.map((_, index) => layout[(index + steps) % layout.length]);
  }

  function buildCampaign() {
    return Campaign.stages.map((item) => {
      const authored = authoredRounds[item.patternIndex];
      return shuffleRound({
        ...authored,
        stageId: item.id,
        layouts: authored.layouts.map((layout) => rotateLayout(layout, item.rotation)),
      });
    });
  }

  let rounds = buildCampaign();

  function bindStageCard(card, index) {
    const item = Campaign.stages[index];
    if (!item) return;
    const unlocked = Campaign.isUnlocked(state.progress, index);
    const completed = state.progress.completedIds.includes(item.id);
    card.type = "button";
    card.className = `stage-card cozy-stage-card${completed ? " is-complete" : ""}${unlocked ? "" : " is-locked"}`;
    card.dataset.stageIndex = String(index);
    card.setAttribute("aria-disabled", String(!unlocked));
    card.setAttribute("aria-current", String(state.round === index && state.view === "stage"));
    card.setAttribute("aria-label", t("stageCardLabel", { n: item.number, title: t(authoredRounds[item.patternIndex].title), status: t(completed ? "stageDone" : unlocked ? "stageReady" : "stageLockedShort") }));
    const number = document.createElement("span");
    number.className = "cozy-stage-number";
    number.textContent = String(item.number).padStart(2, "0");
    const title = document.createElement("strong");
    title.className = "cozy-stage-title";
    title.textContent = t(authoredRounds[item.patternIndex].title);
    const subtitle = document.createElement("small");
    subtitle.className = "cozy-stage-subtitle";
    subtitle.textContent = t("stageCircle", { n: item.number, total: Campaign.STAGE_COUNT });
    const status = document.createElement("span");
    status.className = "cozy-stage-status";
    status.textContent = completed ? "✓" : unlocked ? "→" : "•";
    card.replaceChildren(number, title, subtitle, status);
  }

  function ensureStageVirtual() {
    const rail = $("stage-rail");
    if (!rail || !window.WeightPlayStageV6?.install) return null;
    if (!state.stageVirtual) {
      state.stageVirtual = window.WeightPlayStageV6.install(rail, {
        total: () => Campaign.STAGE_COUNT,
        poolSize: 9,
        initialIndex: () => Campaign.highestUnlockedIndex(state.progress),
        bind: bindStageCard,
        activate: (index) => {
          if (!Campaign.isUnlocked(state.progress, index)) {
            $("stage-progress").textContent = t("stageLocked");
            tone("ui.click");
            return;
          }
          playStage(index, true);
        },
      });
    }
    return state.stageVirtual;
  }

  function renderStages() {
    const total = Campaign.STAGE_COUNT;
    const complete = state.progress.completedIds.length;
    const next = Math.min(total, complete + 1);
    $("stage-progress").textContent = t("stageProgress", { done: complete, total, next });
    const virtual = ensureStageVirtual();
    if (!virtual) {
      $("stage-progress").textContent = t("stageUnavailable");
      return;
    }
    virtual.refresh();
    virtual.center(Campaign.highestUnlockedIndex(state.progress));
  }

  function renderBattle() {
    const round = rounds[state.round];
    if (!round) return;
    const item = stage();
    $("round-title").textContent = t(round.title);
    $("round-count").textContent = `${item.number}/${Campaign.STAGE_COUNT}`;
    const clues = $("clue-list");
    clues.replaceChildren(...round.clues.map((key) => {
      const clue = document.createElement("li");
      clue.textContent = t(key);
      return clue;
    }));
    const choices = $("layout-choices");
    choices.replaceChildren(...round.layouts.map((layout, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "layout-card";
      button.setAttribute("aria-pressed", String(state.selected === index));
      button.classList.toggle("is-selected", state.selected === index);
      const title = document.createElement("strong");
      title.textContent = t(index === 0 ? "layoutA" : index === 1 ? "layoutB" : "layoutC");
      const order = document.createElement("span");
      order.className = "seat-order";
      layout.forEach((name) => {
        const seat = document.createElement("span");
        seat.className = "seat-chip";
        seat.textContent = t(name);
        order.append(seat);
      });
      button.append(title, order);
      button.addEventListener("click", () => {
        if (state.locked) return;
        state.selected = index;
        $("selection-note").textContent = t("selected", { n: index + 1 });
        $("battle-status").textContent = t("choose");
        $("battle-status").dataset.kind = "";
        $("check-button").disabled = false;
        renderBattle();
        track("layout_select", { stage: item.number, choice: index + 1 });
      });
      return button;
    }));
    $("check-button").disabled = state.selected === null || state.locked;
    $("reset-button").disabled = state.locked;
  }

  function renderResult() {
    const item = stage();
    const campaignComplete = isAllComplete() && item.number === Campaign.STAGE_COUNT;
    const best = state.progress.bestChecksByStage[item.id];
    $("result-kicker").textContent = t(campaignComplete ? "campaignComplete" : "circleComplete");
    $("result-title").textContent = t(campaignComplete ? "campaignResultTitle" : "stageResultTitle", { n: item.number });
    $("result-text").textContent = t("stageResultText", { stage: item.number, checks: state.checks });
    $("result-checks").textContent = String(state.checks);
    $("result-best").textContent = String(best || t("noBest"));
    $("result-status").textContent = t("stageProgressShort", { done: state.progress.completedIds.length, total: Campaign.STAGE_COUNT });
    const hasNext = item.number < Campaign.STAGE_COUNT && Campaign.isUnlocked(state.progress, state.round + 1);
    $("next-stage-button").hidden = !hasNext;
    $("result-view").classList.toggle("is-campaign-complete", campaignComplete);
  }

  function playStage(index, newSession) {
    if (!Campaign.isUnlocked(state.progress, index)) return;
    state.runToken += 1;
    if (newSession) state.totalChecks = 0;
    rounds = buildCampaign();
    state.round = index;
    state.selected = null;
    state.checks = 0;
    state.locked = false;
    $("selection-note").textContent = "";
    $("battle-status").textContent = t("choose");
    $("battle-status").dataset.kind = "";
    $("battleScreen").classList.remove("is-correct", "is-wrong");
    tone("game.start");
    show("battle");
    track("camp_stage_start", { stage: Campaign.stages[index].number, stageId: Campaign.stages[index].id });
  }

  function start() {
    tone("ui.click");
    show("stage");
    track("camp_stage_map_open");
  }

  function reset() {
    if (state.locked) return;
    state.selected = null;
    $("selection-note").textContent = "";
    $("battle-status").textContent = t("choose");
    $("battle-status").dataset.kind = "";
    renderBattle();
    track("layout_reset", { stage: stage().number });
  }

  function check() {
    if (state.selected === null || state.locked) return;
    state.checks += 1;
    state.totalChecks += 1;
    if (state.selected !== rounds[state.round].solution) {
      $("battle-status").textContent = t("wrong");
      $("battle-status").dataset.kind = "wrong";
      $("battleScreen").classList.remove("is-wrong");
      void $("battleScreen").offsetWidth;
      $("battleScreen").classList.add("is-wrong");
      tone("feedback.error");
      track("layout_check", { stage: stage().number, result: "wrong" });
      return;
    }

    const completedStage = stage();
    state.locked = true;
    $("battle-status").textContent = t("correct");
    $("battle-status").dataset.kind = "correct";
    $("check-button").disabled = true;
    $("reset-button").disabled = true;
    $("battleScreen").classList.add("is-correct");
    state.progress = Campaign.completeStage(state.progress, completedStage.id, state.checks);
    persistProgress();
    tone("feedback.success");
    track("layout_check", { stage: completedStage.number, result: "correct" });
    const token = state.runToken;
    window.setTimeout(() => {
      if (state.runToken !== token || state.view !== "battle") return;
      if (isAllComplete()) tone("result.win");
      renderResult();
      show("result");
      track("camp_stage_complete", { stage: completedStage.number, stageId: completedStage.id });
    }, 520);
  }

  function requestStageMap() { openDialog("leave-dialog"); }
  function returnToStageMap() { closeDialog("leave-dialog"); state.selected = null; state.locked = false; show("stage"); }
  function returnToMain() { closeDialog("leave-dialog"); show("main"); applyLocale(); }

  state.locale = (() => {
    const query = new URLSearchParams(location.search).get("lang");
    if (locales[query]) return query;
    if (routeLocale && locales[routeLocale]) return routeLocale;
    try {
      const saved = safeStorage()?.getItem("weightplay-animal-cozy-camp-locale");
      if (saved && locales[saved]) return saved;
    } catch (_) {}
    return "en";
  })();

  document.addEventListener("DOMContentLoaded", () => {
    refreshProgress();
    populateLocales();
    applyLocale();
    $("start-button").addEventListener("click", start);
    $("guide-button").addEventListener("click", () => openDialog("guide-dialog"));
    $("guide-start").addEventListener("click", () => { closeDialog("guide-dialog"); start(); });
    $("close-guide").addEventListener("click", () => closeDialog("guide-dialog"));
    $("stage-home").addEventListener("click", returnToMain);
    $("main-settings").addEventListener("click", () => openDialog("settings-dialog"));
    $("battle-settings").addEventListener("click", () => openDialog("settings-dialog"));
    $("close-settings").addEventListener("click", () => closeDialog("settings-dialog"));
    const toggleSound = () => {
      window.WeightPlayAudio?.setMuted?.(!Boolean(window.WeightPlayAudio?.isMuted?.()));
      syncSoundState();
      applyLocale();
    };
    $("sound-toggle").addEventListener("click", toggleSound);
    $("camp-sound-toggle").addEventListener("click", toggleSound);
    window.addEventListener("weightplay:audio-volume-change", () => { syncSoundState(); applyLocale(); });
    $("battle-home").addEventListener("click", requestStageMap);
    $("cancel-leave").addEventListener("click", () => closeDialog("leave-dialog"));
    $("keep-playing").addEventListener("click", () => closeDialog("leave-dialog"));
    $("confirm-leave").addEventListener("click", returnToStageMap);
    $("reset-button").addEventListener("click", reset);
    $("check-button").addEventListener("click", check);
    $("next-stage-button").addEventListener("click", () => playStage(state.round + 1, false));
    $("stage-map-button").addEventListener("click", () => show("stage"));
    $("replay-button").addEventListener("click", () => playStage(state.round, true));
    $("home-button").addEventListener("click", () => { show("main"); applyLocale(); });
    window.setTimeout(() => {
      $("loading-view").hidden = true;
      show("main");
    }, 80);
  });

  window.ANIMAL_COZY_CAMP_TEST = {
    start,
    reset,
    check,
    playStage,
    getState: () => ({ ...state, progress: Campaign.normalizeProgress(state.progress), rounds }),
  };
})();
