(function () {
  "use strict";
  /* WP-GAME-ANALYTICS-ADAPTER */
  // Only replayable lifecycle signals live here; all metrics/timers/GA4 stay shared.
  const __wpMeasurement = { screen: null, roundKey: null, started: false, ended: false, restart: false, outcome: "complete" };
  const __wpReadMeasurement = () => ({ ...__wpMeasurement,
    screen: ((({main:"main",stage:"stage",battle:"battle",})[state.screen] ?? null) === "battle" && (__wpMeasurement.ended)) ? null : (({main:"main",stage:"stage",battle:"battle",})[state.screen] ?? null), ended: Boolean(__wpMeasurement.ended), outcome: __wpMeasurement.outcome,
    paused: Boolean(state?.paused || state?.suspended), node: document.body,
    activityMode: "input", idleSeconds: 300
  });
  function __wpNotifyMeasurement() { try { window.WonderAnalytics?.game?.observeState(__wpReadMeasurement); } catch { /* Optional telemetry. */ } }
  window.addEventListener("weightplay:analytics-ready", __wpNotifyMeasurement);
  __wpNotifyMeasurement();

  const gameScriptUrl = document.currentScript?.src || new URL("game.js", document.baseURI).href;
  const interfaceStyleUrl = new URL("interface-7-cleanup.css?v=20260924-folded-field-i7-recheck-v2", gameScriptUrl).href;
  if (![...document.querySelectorAll('link[rel="stylesheet"]')].some((link) => link.href.replace(/\?.*$/, "") === interfaceStyleUrl.replace(/\?.*$/, ""))) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = interfaceStyleUrl;
    link.dataset.wpFoldedFieldInterface7 = "true";
    document.head.append(link);
  }

  const rounds = [
    { title: "stageTitle1", hint: "stageHint1", initial: [0, 0, 0], target: [1, 0, 1] },
    { title: "stageTitle2", hint: "stageHint2", initial: [1, 0, 1], target: [0, 0, 0] },
    { title: "stageTitle3", hint: "stageHint3", initial: [0, 0, 0, 0], target: [1, 0, 0, 1] }
  ];
  const localeMap = window.FOLDED_FIELD_LOCALES || { en: {} };
  const localeList = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const rtlLocales = new Set(["ar"]);
  const state = { locale: "en", screen: "main", round: 0, pattern: [], flips: 0, cleared: [], sound: !window.WeightPlayAudio.isMuted() };
  window.addEventListener("weightplay:audio-volume-change", () => { state.sound = !window.WeightPlayAudio.isMuted(); });
  const $ = (id) => document.getElementById(id);
  const safeGet = (key, fallback) => {
    try { return localStorage.getItem(key) || fallback; } catch (error) { return fallback; }
  };
  const safeSet = (key, value) => {
    try { localStorage.setItem(key, value); } catch (error) { /* private browsing is fine */ }
  };
  const copy = (key, vars) => {
    const dictionary = localeMap[state.locale] || localeMap.en || {};
    let value = dictionary[key] || (localeMap.en && localeMap.en[key]) || key;
    Object.keys(vars || {}).forEach((name) => { value = value.replace(new RegExp("\\{" + name + "\\}", "g"), String(vars[name])); });
    return value;
  };
  const getBest = () => Number(safeGet("weightplay-animal-folded-field-best", "0")) || 0;
  const setText = (node, key, vars) => { if (node) node.textContent = copy(key, vars); };
  const announce = (key, vars) => { setText($("battleStatus"), key, vars); };

  const START_COPY = {
    en: "Start Game", "zh-Hant": "開始遊戲", "zh-Hans": "开始游戏", ja: "ゲーム開始", ko: "게임 시작",
    es: "Iniciar juego", "pt-BR": "Iniciar jogo", fr: "Démarrer le jeu", de: "Spiel starten",
    it: "Inizia gioco", ru: "Начать игру", hi: "गेम शुरू करें", ar: "ابدأ اللعبة"
  };
  const LEAVE_COPY = {
    en: { title: "Leave this field page?", body: "Leaving “{stage}” discards the current {flips} fold moves. Your saved best-fold record is kept.", stay: "Continue", leave: "Leave stage" },
    "zh-Hant": { title: "離開這個田野頁面？", body: "離開「{stage}」會捨棄目前 {flips} 次摺疊操作；已儲存的最佳摺疊紀錄會保留。", stay: "繼續", leave: "離開關卡" },
    "zh-Hans": { title: "离开这个田野页面？", body: "离开“{stage}”会舍弃当前 {flips} 次折叠操作；已保存的最佳折叠记录会保留。", stay: "继续", leave: "离开关卡" },
    ja: { title: "このフィールドページを離れますか？", body: "「{stage}」を離れると現在の {flips} 回の折り操作は破棄されます。保存済みのベスト記録は残ります。", stay: "続ける", leave: "ステージを離れる" },
    ko: { title: "이 필드 페이지를 나갈까요?", body: "“{stage}”를 나가면 현재 {flips}번의 접기 진행은 사라집니다. 저장된 최고 기록은 유지됩니다.", stay: "계속", leave: "스테이지 나가기" },
    es: { title: "¿Salir de esta página del campo?", body: "Salir de “{stage}” descarta los {flips} movimientos de pliegue actuales. Tu mejor registro guardado se conserva.", stay: "Continuar", leave: "Salir del nivel" },
    "pt-BR": { title: "Sair desta página do campo?", body: "Sair de “{stage}” descarta os {flips} movimentos de dobra atuais. Seu melhor registro salvo será mantido.", stay: "Continuar", leave: "Sair da fase" },
    fr: { title: "Quitter cette page du terrain ?", body: "Quitter « {stage} » annule les {flips} plis en cours. Votre meilleur score enregistré est conservé.", stay: "Continuer", leave: "Quitter le niveau" },
    de: { title: "Diese Feldseite verlassen?", body: "Beim Verlassen von „{stage}“ gehen die aktuellen {flips} Faltzüge verloren. Dein gespeicherter Bestwert bleibt erhalten.", stay: "Fortsetzen", leave: "Level verlassen" },
    it: { title: "Lasciare questa pagina del campo?", body: "Uscendo da “{stage}” perderai le {flips} mosse di piega correnti. Il record migliore salvato resta invariato.", stay: "Continua", leave: "Lascia livello" },
    ru: { title: "Покинуть эту страницу поля?", body: "При выходе из «{stage}» текущие ходы складывания ({flips}) будут потеряны. Сохранённый лучший результат останется.", stay: "Продолжить", leave: "Выйти из этапа" },
    hi: { title: "यह फ़ील्ड पेज छोड़ें?", body: "“{stage}” छोड़ने पर मौजूदा {flips} फोल्ड चालें मिट जाएँगी। आपका सेव किया गया सर्वश्रेष्ठ रिकॉर्ड बना रहेगा।", stay: "जारी रखें", leave: "स्टेज छोड़ें" },
    ar: { title: "مغادرة صفحة الحقل هذه؟", body: "مغادرة «{stage}» ستلغي حركات الطي الحالية وعددها {flips}. سيبقى أفضل سجل محفوظ لديك.", stay: "متابعة", leave: "مغادرة المرحلة" }
  };
  const formatCopy = (text, values) => String(text).replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ""));

  const installInterfaceCompatibility = () => {
    const legacySettings = $("settingsBtn");
    if (legacySettings && !legacySettings.classList.contains("wp-frame-settings")) {
      legacySettings.classList.remove("wp-shell-settings-button");
      legacySettings.removeAttribute("data-wp-settings");
      legacySettings.hidden = true;
      legacySettings.setAttribute("aria-hidden", "true");
      legacySettings.tabIndex = -1;
      legacySettings.id = "foldedFieldLegacySettingsBtn";
    }
    const map = $("mapBtn");
    if (map) {
      map.hidden = true;
      map.setAttribute("aria-hidden", "true");
      map.tabIndex = -1;
    }
    [$("stageInfoBtn"), $("battleInfoBtn")].forEach((button) => {
      if (!button) return;
      button.hidden = true;
      button.setAttribute("aria-hidden", "true");
      button.tabIndex = -1;
    });
    const result = $("resultScreen");
    if (result) {
      result.removeAttribute("data-screen");
      result.dataset.wpBattleSubstate = "result";
    }
  };

  // The shared Battle scaler observes DOM mutations asynchronously. Folded
  // Field rerenders its flap board after every native action, so checkpoint
  // the settled logical envelope in the same task before the next input.
  const syncBattleLayout = () => window.WeightPlayBattleCanvas?.sync?.();
  const aligned = () => state.pattern.reduce((total, value, index) => total + (value === rounds[state.round].target[index] ? 1 : 0), 0);
  const samePattern = () => state.pattern.every((value, index) => value === rounds[state.round].target[index]);
  const toggle = (index) => {
    const next = state.pattern.slice();
    next[index] = next[index] ? 0 : 1;
    next[(index + 1) % next.length] = next[(index + 1) % next.length] ? 0 : 1;
    return next;
  };
  const beep = (cue = "board.rotate") => window.WeightPlayAudio?.play(cue);

  const settlement = { timer: 0, dueAt: 0, remaining: 0, paused: false };
  const resetSettlementState = () => {
    settlement.timer = 0;
    settlement.dueAt = 0;
    settlement.remaining = 0;
    settlement.paused = false;
  };
  const cancelSettlement = () => {
    if (settlement.timer) window.clearTimeout(settlement.timer);
    resetSettlementState();
  };
  const finishSettlement = () => {
    resetSettlementState();
    if (state.screen === "battle") show("result");
  };
  const scheduleSettlement = (delay) => {
    if (settlement.timer) window.clearTimeout(settlement.timer);
    settlement.paused = false;
    settlement.remaining = Math.max(0, Number(delay) || 0);
    settlement.dueAt = performance.now() + settlement.remaining;
    settlement.timer = window.setTimeout(finishSettlement, settlement.remaining);
  };
  const pauseSettlement = () => {
    if (!settlement.timer) return false;
    settlement.remaining = Math.max(0, settlement.dueAt - performance.now());
    window.clearTimeout(settlement.timer);
    settlement.timer = 0;
    settlement.dueAt = 0;
    settlement.paused = true;
    return true;
  };
  const resumeSettlement = () => {
    if (!settlement.paused) return;
    const delay = settlement.remaining;
    settlement.paused = false;
    settlement.remaining = 0;
    if (delay <= 0) {
      queueMicrotask(finishSettlement);
      return;
    }
    scheduleSettlement(delay);
  };
  const settlementPending = () => Boolean(settlement.timer || settlement.paused);

  let leaveDialog = null;
  let leaveDialogOpen = false;
  let coveredBattleNodes = [];
  const leaveLabels = () => LEAVE_COPY[state.locale] || LEAVE_COPY.en;
  const setBattleCovered = (covered) => {
    if (!leaveDialog) return;
    if (!covered) {
      coveredBattleNodes.forEach((node) => { node.inert = false; });
      coveredBattleNodes = [];
      return;
    }
    const canvas = leaveDialog.closest(".battle-canvas");
    coveredBattleNodes = [...(canvas?.children || [])].filter((node) => node !== leaveDialog && !node.inert);
    coveredBattleNodes.forEach((node) => { node.inert = true; });
  };
  const refreshLeaveDialog = () => {
    if (!leaveDialog) return;
    const labels = leaveLabels();
    const stage = copy(rounds[state.round]?.title || "stages");
    leaveDialog.querySelector("[data-leave-title]").textContent = labels.title;
    leaveDialog.querySelector("[data-leave-body]").textContent = formatCopy(labels.body, { stage, flips: state.flips });
    leaveDialog.querySelector("[data-leave-stay]").textContent = labels.stay;
    leaveDialog.querySelector("[data-leave-confirm]").textContent = labels.leave;
  };
  const closeLeaveDialog = ({ resume = true, restoreFocus = true } = {}) => {
    if (!leaveDialogOpen || !leaveDialog) return;
    leaveDialogOpen = false;
    leaveDialog.hidden = true;
    setBattleCovered(false);
    if (resume) resumeSettlement();
    if (restoreFocus) $("battleBackBtn")?.focus({ preventScroll: true });
  };
  const leaveBattle = () => {
    closeLeaveDialog({ resume: false, restoreFocus: false });
    cancelSettlement();
    show("stage");
  };
  const ensureLeaveDialog = () => {
    if (leaveDialog) return leaveDialog;
    const canvas = document.querySelector("#battleScreen .battle-canvas");
    if (!canvas) return null;
    const dialog = document.createElement("section");
    dialog.className = "folded-leave-dialog";
    dialog.hidden = true;
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "foldedLeaveTitle");
    dialog.setAttribute("aria-describedby", "foldedLeaveBody");
    dialog.innerHTML = '<div class="folded-leave-card"><h2 id="foldedLeaveTitle" data-leave-title></h2><p id="foldedLeaveBody" data-leave-body></p><div class="folded-leave-actions"><button type="button" class="secondary-btn" data-leave-stay></button><button type="button" class="primary-btn" data-leave-confirm></button></div></div>';
    canvas.append(dialog);
    dialog.querySelector("[data-leave-stay]").addEventListener("click", () => closeLeaveDialog());
    dialog.querySelector("[data-leave-confirm]").addEventListener("click", leaveBattle);
    dialog.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closeLeaveDialog();
        return;
      }
      if (event.key !== "Tab") return;
      const focusables = [...dialog.querySelectorAll("button:not(:disabled)")];
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
    leaveDialog = dialog;
    refreshLeaveDialog();
    return dialog;
  };
  const openLeaveDialog = () => {
    if (leaveDialogOpen || state.screen !== "battle") return;
    const dialog = ensureLeaveDialog();
    if (!dialog) return;
    pauseSettlement();
    refreshLeaveDialog();
    leaveDialogOpen = true;
    setBattleCovered(true);
    dialog.hidden = false;
    window.requestAnimationFrame(() => dialog.querySelector("[data-leave-stay]")?.focus({ preventScroll: true }));
  };

  const show = (screen) => {
    state.screen = screen;
    const loading = $("loadingPanel");
    if (loading) loading.hidden = true;
    const inBattle = screen === "battle" || screen === "result";
    ["main", "stage"].forEach((name) => {
      const node = $(name + "Screen");
      if (node) node.hidden = name !== screen;
    });
    const battleScreen = $("battleScreen");
    if (battleScreen) {
      battleScreen.hidden = !inBattle;
      battleScreen.dataset.battleState = inBattle ? screen : "";
    }
    const battleHud = $("battleHud");
    const battleContent = $("battleContent");
    const resultScreen = $("resultScreen");
    if (battleHud) battleHud.hidden = screen !== "battle";
    if (battleContent) battleContent.hidden = screen !== "battle";
    if (resultScreen) (__wpNotifyMeasurement(), resultScreen.hidden = screen !== "result");
    const battleActions = document.querySelector("#battleScreen .battle-canvas > .battle-actions");
    if (battleActions) battleActions.hidden = screen !== "battle";
    document.body.dataset.screen = screen === "result" ? "battle" : screen;
    document.body.dataset.battleSubstate = screen === "result" ? "result" : "";
    if (screen === "main") renderMain();
    if (screen === "stage") renderStages();
    if (screen === "battle") renderBattle();
    if (screen === "result") renderResult();
    window.dispatchEvent(new CustomEvent("weightplay:shell-sync"));
    window.scrollTo(0, 0);

    { const __wpNextScreen = ({main:"main",stage:"stage",battle:"battle",})[screen] ?? null;
      if (["result"].includes(screen) && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "complete"; }
      else if (true && (__wpNextScreen === "main" || __wpNextScreen === "stage") && __wpMeasurement.screen === "battle" && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "abandon"; }
      __wpMeasurement.screen = __wpNextScreen; __wpNotifyMeasurement(); }
  };
  const renderMain = () => {
    setText($("mainProgress"), "progress", { count: rounds.length });
    setText($("bestValue"), getBest() ? String(getBest()) : "noBest");
    const start = $("startBtn");
    if (start) start.textContent = START_COPY[state.locale] || START_COPY.en;
  };
  const renderStages = () => {
    const list = $("stageList");
    if (!list) return;
    list.innerHTML = rounds.map((round, index) => {
      const done = state.cleared.includes(index);
      return "<button class=\"stage-card\" type=\"button\" data-stage=\"" + index + "\" aria-label=\"" + copy(round.title) + "\"><span class=\"stage-number\">" + copy("round", { number: index + 1, total: rounds.length }) + "</span><h3>" + copy(round.title) + "</h3><p>" + copy(round.hint) + "</p><span class=\"stage-chip\">" + (done ? copy("badgeComplete") : copy("stageReady")) + "</span></button>";
    }).join("");
  };
  const patternMarkup = (pattern, target) => pattern.map((value, index) => {
    const label = value ? copy("lifted") : copy("tucked");
    const match = target && value === target[index] ? " is-match" : "";
    return "<span class=\"pattern-cell" + (value ? " is-lifted" : " is-tucked") + match + "\">" + label + "</span>";
  }).join("");
  const renderBattle = () => {
    const round = rounds[state.round];
    setText($("battleHeading"), "title");
    setText($("roundLabel"), "round", { number: state.round + 1, total: rounds.length });
    setText($("roundTitle"), round.title);
    setText($("roundHint"), round.hint);
    if ($("flipCount")) $("flipCount").textContent = String(state.flips);
    if ($("targetPattern")) $("targetPattern").innerHTML = patternMarkup(round.target);
    if ($("currentPattern")) $("currentPattern").innerHTML = patternMarkup(state.pattern, round.target);
    if ($("targetPattern")) $("targetPattern").setAttribute("aria-label", copy("targetPattern") + ": " + round.target.map((value) => value ? copy("lifted") : copy("tucked")).join(", "));
    if ($("currentPattern")) $("currentPattern").setAttribute("aria-label", copy("currentPattern") + ": " + state.pattern.map((value) => value ? copy("lifted") : copy("tucked")).join(", "));
    setText($("alignedCount"), "aligned", { count: aligned(), total: round.target.length });
    const board = $("flapBoard");
    if (board) {
      board.innerHTML = state.pattern.map((value, index) => "<button class=\"flap-btn " + (value ? "is-lifted" : "is-tucked") + "\" type=\"button\" data-flap=\"" + index + "\" aria-label=\"" + copy("flap" + (index + 1)) + " " + (value ? copy("lifted") : copy("tucked")) + "\" aria-pressed=\"" + Boolean(value) + "\"><i class=\"link-dot\" aria-hidden=\"true\"></i><span class=\"flap-icon\" aria-hidden=\"true\">" + (value ? "↑" : "↓") + "</span><strong>" + copy("flap" + (index + 1)) + "</strong><small>" + (value ? copy("lifted") : copy("tucked")) + "</small></button>").join("");
      board.querySelectorAll("[data-flap]").forEach((button) => button.addEventListener("click", () => {
        state.pattern = toggle(Number(button.dataset.flap));
        state.flips += 1;
        announce("moveHint");
        beep("board.rotate");
        renderBattle();
      }));
    }
    syncBattleLayout();
  };
  const renderResult = () => {
    const finished = state.cleared.length === rounds.length;
    setText($("resultHeading"), finished ? "finishTitle" : "resultTitle");
    setText($("resultText"), finished ? "finishText" : "resultText");
    const badges = $("resultBadges");
    if (badges) badges.innerHTML = state.cleared.map((number) => "<span class=\"result-badge\">" + copy("badge", { number: number + 1 }) + " · " + copy("badgeComplete") + "</span>").join("");
    const primary = $("resultPrimaryBtn");
    const hasNext = state.round < rounds.length - 1;
    if (primary) {
      primary.textContent = copy("nextStage");
      primary.dataset.action = hasNext ? "next" : "disabled";
      primary.disabled = !hasNext;
      primary.setAttribute("aria-disabled", String(!hasNext));
    }
    const replay = $("resultHomeBtn");
    if (replay) {
      replay.hidden = false;
      replay.disabled = false;
      replay.textContent = copy("replay");
    }
  };
  const startRound = (number) => {
    cancelSettlement();
    if (leaveDialogOpen) closeLeaveDialog({ resume: false, restoreFocus: false });
    state.round = Math.max(0, Math.min(rounds.length - 1, number));
    state.pattern = rounds[state.round].initial.slice();
    state.flips = 0;
    if ($("battleStatus")) $("battleStatus").textContent = "";
    show("battle");

    __wpMeasurement.roundKey = {}; __wpMeasurement.restart = false; __wpMeasurement.started = true; __wpMeasurement.ended = false; __wpMeasurement.outcome = "complete"; __wpMeasurement.screen = "battle"; __wpNotifyMeasurement();
  };
  const clearRound = () => {
    if (settlementPending()) return;
    if (!samePattern()) {
      announce("incorrect");
      return;
    }
    beep("puzzle.clear");
    if (!state.cleared.includes(state.round)) state.cleared.push(state.round);
    const best = getBest();
    if (!best || state.flips < best) safeSet("weightplay-animal-folded-field-best", String(state.flips));
    announce("correct");
    scheduleSettlement(250);
  };
  const applyLocale = (locale) => {
    state.locale = localeList.includes(locale) && localeMap[locale] ? locale : "en";
    safeSet("weightplay-locale", state.locale);
    window.WonderI18n?.setLocale(state.locale, { navigate: false, dispatch: false });
    document.documentElement.lang = state.locale;
    document.documentElement.dir = rtlLocales.has(state.locale) ? "rtl" : "ltr";
    document.querySelectorAll("[data-copy]").forEach((node) => setText(node, node.dataset.copy));
    document.querySelectorAll("[data-copy-aria-label]").forEach((node) => node.setAttribute("aria-label", copy(node.dataset.copyAriaLabel)));
    const labels = [
      ["foldedFieldLegacySettingsBtn", "settings"], ["settingsPanel", "settings"], ["foldedChoice", "language"],
      ["targetPattern", "targetPattern"], ["currentPattern", "currentPattern"], ["flapBoard", "currentPattern"], ["resultBadges", "stages"]
    ];
    labels.forEach(([id, key]) => { const node = $(id); if (node) node.setAttribute("aria-label", copy(key)); });
    const sound = $("soundBtn");
    if (sound) sound.textContent = copy(state.sound ? "soundOn" : "soundOff");
    renderMain();
    if (state.screen === "stage") renderStages();
    if (state.screen === "battle") renderBattle();
    if (state.screen === "result") renderResult();
    refreshLeaveDialog();
  };
  const bind = () => {
    document.addEventListener("click", (event) => {
      const card = event.target?.closest?.("#stageList [data-stage]");
      if (!card || state.screen !== "stage") return;
      startRound(Number(card.dataset.stage));
    }, true);
    $("startBtn").addEventListener("click", () => show("stage"));
    $("stageBackBtn").addEventListener("click", () => show("main"));
    $("battleBackBtn").addEventListener("click", (event) => {
      if (state.screen !== "battle") return;
      if (state.flips > 0 || settlementPending()) {
        event.preventDefault();
        openLeaveDialog();
        return;
      }
      show("stage");
    });
    $("resetBtn").addEventListener("click", () => {
      if (settlementPending()) return;
      state.pattern = rounds[state.round].initial.slice();
      state.flips = 0;
      announce("moveHint");
      renderBattle();
      __wpMeasurement.roundKey = {}; __wpMeasurement.started = true; __wpMeasurement.ended = false; __wpMeasurement.restart = true; __wpMeasurement.outcome = "complete"; __wpMeasurement.screen = "battle"; __wpNotifyMeasurement();
    });
    $("checkBtn").addEventListener("click", clearRound);
    $("resultMapBtn").addEventListener("click", () => {
      if (state.cleared.length) state.round = Math.max(...state.cleared);
      show("stage");
    });
    $("resultHomeBtn").addEventListener("click", () => {
      const value = startRound(state.round);
      __wpMeasurement.roundKey = {}; __wpMeasurement.started = true; __wpMeasurement.ended = false; __wpMeasurement.restart = true; __wpMeasurement.outcome = "complete"; __wpMeasurement.screen = "battle"; __wpNotifyMeasurement();
      return value;
    });
    $("resultPrimaryBtn").addEventListener("click", () => {
      if ($("resultPrimaryBtn").dataset.action === "next") startRound(state.round + 1);
    });
    $("soundBtn")?.addEventListener("click", () => {
      state.sound = window.WeightPlayAudio.setEnabled(!state.sound);
      safeSet("weightplay-animal-folded-field-sound", state.sound ? "on" : "off");
      applyLocale(state.locale);
    });
    $("foldedChoice")?.addEventListener("change", (event) => applyLocale(event.target.value));
  };
  const boot = () => {
    installInterfaceCompatibility();
    // Keep persistent game actions outside the independently scrolling field;
    // frame/header geometry remains wholly owned by the shared Interface 7 runtime.
    const canvas = document.querySelector("#battleScreen .battle-canvas");
    const actions = canvas?.querySelector(".battle-actions");
    if (canvas && actions) canvas.append(actions);
    ensureLeaveDialog();
    const routeLocale = String(window.__WEIGHTPLAY_ROUTE_LOCALE__ || "").trim();
    const savedLocale = localeList.includes(routeLocale) ? routeLocale : safeGet("weightplay-locale", "en");
    const savedSound = safeGet("weightplay-animal-folded-field-sound", "on");
    state.sound = window.WeightPlayAudio.setEnabled(savedSound !== "off");
    state.cleared = [];
    bind();
    if ($("foldedChoice")) $("foldedChoice").value = localeList.includes(savedLocale) ? savedLocale : "en";
    applyLocale(savedLocale);
    const loading = $("loadingPanel");
    if (loading) window.setTimeout(() => { loading.hidden = true; show("main"); }, 180);
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();