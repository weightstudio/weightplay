/* Folded Field: deterministic, reversible puzzle model. No DOM or storage. */
var FoldedFieldPuzzle = (function () {
  "use strict";
  function apply(pattern, link) {
    return pattern.map((value, index) => link.includes(index) ? 1 - value : value);
  }
  function solve(start, target, links) {
    const goal = target.join("");
    const queue = [[start, []]], seen = new Set([start.join("")]);
    for (let head = 0; head < queue.length; head++) {
      const [pattern, route] = queue[head];
      if (pattern.join("") === goal) return route;
      for (let move = 0; move < links.length; move++) {
        const next = apply(pattern, links[move]), key = next.join("");
        if (!seen.has(key)) { seen.add(key); queue.push([next, [...route, move]]); }
      }
    }
    return null;
  }
  const graphs = {
    seed: [[0,1],[1,2]],
    path: [[0,1],[1,2],[2,3]],
    ring: [[0,1],[1,2],[2,3],[3,0]],
    ring5: [[0,1],[1,2],[2,3],[3,4],[4,0]],
    ring6: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]],
    bridge: [[0,1],[1,2],[2,3],[3,4],[0,4],[1,3]],
    bridge6: [[0,1],[1,2],[2,3],[3,4],[4,5],[0,3]],
    triad: [[0,1],[1,2],[2,3],[0,1,2]],
    triad5: [[0,1],[1,2],[2,3],[3,4],[0,2,4]],
    braid: [[0,2],[1,3],[2,4],[3,5],[0,1,2],[3,4,5]],
    crown: [[0,1],[1,2],[2,3],[3,4],[4,5],[0,2,5]]
  };
  // Thirty authored boards: graph, target bit pattern, reverse construction.
  // Every start is reached by legal moves; BFS supplies an exact hint/par.
  const authored = [
    ['seed','110',[0]], ['seed','101',[0,1]], ['path','1100',[1]], ['path','1001',[0,1,2]], ['ring','1111',[0,2]],
    ['ring','1001',[3]], ['ring','1010',[0,1]], ['ring5','10101',[4,1]], ['ring5','11001',[0,2,4]], ['ring6','111111',[0,1,2]],
    ['bridge','11010',[4,1]], ['bridge','10101',[5,0,2]], ['bridge6','101010',[5,2]], ['bridge6','110011',[0,2,4,5]], ['bridge6','111111',[0,1,3,4]],
    ['triad','1110',[3]], ['triad','1011',[3,1]], ['triad5','10101',[4,0,2]], ['triad5','11011',[0,1,3,4]], ['triad5','11111',[0,1,2,3,4]],
    ['braid','101010',[4,1]], ['braid','110011',[5,0,2]], ['braid','101101',[0,1,4,5]], ['braid','111001',[0,2,3,4]], ['braid','111111',[0,1,2,3,4,5]],
    ['crown','101010',[0,3,5]], ['crown','110011',[1,4,5]], ['crown','101101',[0,1,2,5]], ['crown','111001',[0,1,3,4,5]], ['crown','111111',[0,1,2,3,4,5]]
  ];
  const levels = authored.map(([graph, bits, moves], index) => {
    const target = [...bits].map(Number), links = graphs[graph].map(link => [...link]);
    let start = [...target];
    for (const move of moves) start = apply(start, links[move]);
    const par = solve(start, target, links).length;
    return { id: index + 1, arc: Math.floor(index / 5), checkpoint: (index + 1) % 5 === 0,
      start, initial: start, target, links, par, title: 'arc' + Math.floor(index / 5), hint: 'rule' + Math.floor(index / 5) };
  });
  return { apply, solve, levels };
})();
// END PUZZLE CORE

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

  const rounds = FoldedFieldPuzzle.levels;
  const localeMap = window.FOLDED_FIELD_LOCALES || { en: {} };
  const localeList = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const rtlLocales = new Set(["ar"]);
  const state = { locale: "en", screen: "main", round: 0, pattern: [], flips: 0, cleared: [], history: [], hints: 0, preview: -1, solved: false, progress: { best: {}, stars: {}, tutorial: false }, sound: !window.WeightPlayAudio.isMuted() };
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
  const toggle = (index) => FoldedFieldPuzzle.apply(state.pattern, rounds[state.round].links[index]);
  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const levelTitle = (round, index) => copy(round.title) + ' · ' + (index + 1);
  const unlocked = () => Math.min(rounds.length - 1, state.cleared.length ? Math.max(...state.cleared) + 1 : 0);
  const saveProgress = () => safeSet('weightplay-folded-field-campaign-v1', JSON.stringify({ ...state.progress, cleared: state.cleared }));
  const loadProgress = () => {
    try {
      const data = JSON.parse(safeGet('weightplay-folded-field-campaign-v1', '{}'));
      const valid = n => Number.isInteger(n) && n >= 0 && n < rounds.length;
      const cleared = Array.isArray(data.cleared) ? [...new Set(data.cleared.filter(valid))].sort((a,b)=>a-b) : [];
      // Only a contiguous completed prefix may unlock later content.
      state.cleared = []; for (const n of cleared) { if (n !== state.cleared.length) break; state.cleared.push(n); }
      for (const key of ['best', 'stars']) {
        const values = data[key] && typeof data[key] === 'object' ? data[key] : {};
        state.progress[key] = Object.fromEntries(Object.entries(values).filter(([id,value]) => valid(Number(id)) && Number.isInteger(value) && value > 0 && value <= (key === 'stars' ? 3 : 10000)));
      }
      state.progress.tutorial = data.tutorial === true;
    } catch { /* Corrupt/private storage starts a playable campaign, old best remains untouched. */ }
  };
  const previewMove = (index) => {
    if (state.solved) return;
    state.preview = index;
    const link = rounds[state.round].links[index] || [];
    document.querySelectorAll('#currentPattern [data-cell]').forEach(node => node.classList.toggle('is-preview', link.includes(Number(node.dataset.cell))));
  };
  const renderTutorial = () => {
    const node = $('fieldCoach');
    if (!node) return;
    const round = rounds[state.round];
    node.textContent = copy(state.solved ? 'correct' : state.round === 0 && !state.progress.tutorial ? 'tutorialFirst' : 'rule' + round.arc);
    node.classList.toggle('is-tutorial', state.round === 0 && !state.progress.tutorial);
  };
  const undoMove = () => {
    if (state.solved || !state.history.length || leaveDialogOpen) return;
    state.pattern = state.history.pop(); state.flips = Math.max(0,state.flips - 1);
    state.preview = -1; state.hintMove = -1; renderBattle(); announce('undone');
  };
  const requestHint = () => {
    if (state.solved || leaveDialogOpen) return;
    const route = FoldedFieldPuzzle.solve(state.pattern, rounds[state.round].target, rounds[state.round].links);
    if (!route?.length) return;
    state.hints++; state.hintMove = route[0]; renderBattle(); previewMove(route[0]);
    announce('hintMessage', { pair: rounds[state.round].links[route[0]].map(i=>i+1).join(' ↔ ') });
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
    const stage = levelTitle(rounds[state.round], state.round);
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
    setText($("mainProgress"), "campaignProgress", { done: state.cleared.length, total: rounds.length });
    setText($("bestValue"), getBest() ? String(getBest()) : "noBest");
    const start = $("startBtn");
    if (start) start.textContent = START_COPY[state.locale] || START_COPY.en;
  };
  const renderStages = () => {
    const list = $('stageList'); if (!list) return;
    list.innerHTML = rounds.map((round,index) => {
      const done = state.cleared.includes(index), locked = index > unlocked();
      const stars = state.progress.stars[index] || 0;
      return `<button class="stage-card${done?' is-cleared':''}" type="button" data-stage="${index}" aria-disabled="${locked}" aria-label="${escapeHTML(levelTitle(round,index))}"><span class="stage-number">${copy('round',{number:index+1,total:rounds.length})}</span><h3>${escapeHTML(levelTitle(round,index))}</h3><p>${escapeHTML(copy(round.hint))}</p><span class="stage-chip">${locked?copy('locked'):done?'★'.repeat(stars)+' · '+copy('badgeComplete'):copy('stageReady')}</span></button>`;
    }).join('');
    const selected = list.querySelector(`[data-stage="${unlocked()}"]`);
    if (selected) list.scrollLeft = selected.offsetLeft - list.clientWidth/2 + selected.clientWidth/2;
  };
  const patternMarkup = (pattern, target) => pattern.map((value,index) => {
    const match = target && value === target[index];
    return `<span class="pattern-cell ${value?'is-lifted':'is-tucked'}${match?' is-match':''}" data-cell="${index}"><b class="cell-number">${index+1}</b><span class="cell-leaf" aria-hidden="true">${value?'↑':'↓'}</span><small>${escapeHTML(copy(value?'lifted':'tucked'))}</small>${target?`<span class="cell-target">${copy('need')} ${target[index]?'↑':'↓'} ${match?'✓':'○'}</span>`:''}</span>`;
  }).join('');
  const renderBattle = () => {
    const round = rounds[state.round];
    setText($('roundLabel'),'round',{number:state.round+1,total:rounds.length});
    $('roundTitle').textContent = levelTitle(round,state.round);
    $('roundHint').textContent = copy('parGoal',{par:round.par});
    $('flipCount').textContent = String(state.flips);
    $('targetPattern').innerHTML = patternMarkup(round.target);
    $('currentPattern').innerHTML = patternMarkup(state.pattern,round.target);
    $('currentPattern').setAttribute('aria-label',copy('currentPattern')+': '+state.pattern.map((v,i)=>(i+1)+' '+copy(v?'lifted':'tucked')+', '+copy('need')+' '+copy(round.target[i]?'lifted':'tucked')).join('; '));
    setText($('alignedCount'),'aligned',{count:aligned(),total:round.target.length});
    const board = $('flapBoard');
    // Six permanent action slots keep familiar controls stable after all feedback.
    if (board && board.dataset.round !== String(state.round)) {
      board.dataset.round = String(state.round);
      board.innerHTML = Array.from({length:6},(_,i) => {
        const link = round.links[i];
        return link ? `<button class="flap-btn" type="button" data-flap="${i}" data-link-size="${link.length}"><strong>${link.map(n=>n+1).join(link.length===3?' · ':' ↔ ')}</strong><small>${escapeHTML(copy(link.length===3?'tripleFold':'pairFold'))}</small></button>` : '<span class="fold-empty" aria-hidden="true"></span>';
      }).join('');
      board.querySelectorAll('[data-flap]').forEach(button => {
        const index = Number(button.dataset.flap);
        button.addEventListener('pointerenter',()=>previewMove(index));
        button.addEventListener('focus',()=>previewMove(index));
        button.addEventListener('pointerleave',()=>previewMove(-1));
        button.addEventListener('blur',()=>previewMove(-1));
        button.addEventListener('click',()=> {
          if(state.solved || leaveDialogOpen || state.suspended) return;
          state.history.push([...state.pattern]); state.pattern = toggle(index);
          state.flips++; state.preview=-1; state.hintMove=-1;
          beep('board.rotate'); renderBattle();
          const affected = round.links[index];
          document.querySelectorAll('#currentPattern [data-cell]').forEach(node=> {
            if(affected.includes(Number(node.dataset.cell))) node.classList.add('just-folded');
          });
          if(samePattern()) clearRound();
          else announce('moveMade',{pair:affected.map(n=>n+1).join(' ↔ '),count:aligned(),total:round.target.length});
        });
      });
    }
    board?.querySelectorAll('[data-flap]').forEach(button=> {
      button.disabled=state.solved;
      button.classList.toggle('is-hint',Number(button.dataset.flap)===state.hintMove);
    });
    if($('undoBtn')) $('undoBtn').disabled = state.solved || !state.history.length;
    if($('hintBtn')) $('hintBtn').disabled = state.solved;
    $('resetBtn').disabled = state.solved;
    $('checkBtn').disabled = state.solved;
    renderTutorial(); syncBattleLayout();
  };
  const renderResult = () => {
    const finished = state.cleared.length === rounds.length;
    setText($("resultHeading"), finished ? "finishTitle" : "resultTitle");
    setText($("resultText"), finished ? "finishText" : "resultText");
    const badges = $("resultBadges");
    if (badges) badges.innerHTML = `<span class="result-badge field-stars">${'★'.repeat(state.progress.stars[state.round] || 1)}${'☆'.repeat(3-(state.progress.stars[state.round] || 1))}</span><span class="result-badge">${copy('resultScore',{moves:state.flips,par:rounds[state.round].par})}</span><span class="result-badge">${copy('campaignProgress',{done:state.cleared.length,total:rounds.length})}</span>`;
    $('resultText').textContent = copy(state.hints ? 'resultAssisted' : state.flips <= rounds[state.round].par ? 'resultPerfect' : 'resultImprove');
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
    state.flips = 0; state.history = []; state.hints = 0; state.hintMove = -1; state.solved = false; state.preview = -1;
    if ($("flapBoard")) $("flapBoard").dataset.round = "";
    if ($("battleStatus")) $("battleStatus").textContent = "";
    show("battle");

    __wpMeasurement.roundKey = {}; __wpMeasurement.restart = false; __wpMeasurement.started = true; __wpMeasurement.ended = false; __wpMeasurement.outcome = "complete"; __wpMeasurement.screen = "battle"; __wpNotifyMeasurement();
  };
  const clearRound = () => {
    if (state.solved || settlementPending()) return;
    if (!samePattern()) {
      announce("incorrect");
      return;
    }
    state.solved = true;
    const par = rounds[state.round].par;
    const stars = state.hints ? 1 : state.flips <= par ? 3 : 2;
    state.progress.stars[state.round] = Math.max(state.progress.stars[state.round] || 0, stars);
    state.progress.best[state.round] = Math.min(state.progress.best[state.round] || Infinity,state.flips);
    if(state.round === 0) state.progress.tutorial = true;
    beep("puzzle.clear");
    if (!state.cleared.includes(state.round)) state.cleared.push(state.round);
    const best = getBest();
    if (!best || state.flips < best) safeSet("weightplay-animal-folded-field-best", String(state.flips));
    saveProgress(); renderBattle(); announce("correct");
    scheduleSettlement(850);
  };
  const applyLocale = (locale) => {
    state.locale = localeList.includes(locale) && localeMap[locale] ? locale : "en";
    safeSet("weightplay-locale", state.locale);
    window.WonderI18n?.setLocale(state.locale, { navigate: false, dispatch: false });
    document.documentElement.lang = state.locale;
    document.documentElement.dir = rtlLocales.has(state.locale) ? "rtl" : "ltr";
    ['stageBackBtn','battleBackBtn'].forEach(id => $(id)?.setAttribute('aria-label',copy('back')));
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
      const index = Number(card.dataset.stage);
      if (index <= unlocked()) startRound(index);
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
      state.flips = 0; state.history = []; state.hintMove = -1;
      announce("moveHint");
      renderBattle();
      __wpMeasurement.roundKey = {}; __wpMeasurement.started = true; __wpMeasurement.ended = false; __wpMeasurement.restart = true; __wpMeasurement.outcome = "complete"; __wpMeasurement.screen = "battle"; __wpNotifyMeasurement();
    });
    $('undoBtn').addEventListener('click',undoMove);
    $('hintBtn').addEventListener('click',requestHint);
    $("checkBtn").addEventListener("click", clearRound);
    $("resultMapBtn").addEventListener("click", () => {
      state.round = unlocked();
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
    // Declare the taller authored content to the existing shared scaler.
    // One uniform transform fits the whole six-leaf field in short landscape.
    $('battleScreen').dataset.wpBattleLandscapeHeight = '460';
    // Establish arrow-only content once, before the shared frame mounts.
    ['stageBackBtn','battleBackBtn'].forEach(id => {
      const button = $(id); button.removeAttribute('data-copy'); button.textContent = '←';
      button.setAttribute('aria-label', copy('back'));
    });
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
    loadProgress();
    const content = $('battleContent');
    const coach = document.createElement('p'); coach.id='fieldCoach'; coach.className='field-coach'; coach.setAttribute('role','note');
    content.querySelector('.goal-card').after(coach);
    const undo = document.createElement('button'); undo.id='undoBtn'; undo.type='button'; undo.className='secondary-btn'; undo.dataset.copy='undo';
    const hint = document.createElement('button'); hint.id='hintBtn'; hint.type='button'; hint.className='secondary-btn'; hint.dataset.copy='hint';
    actions.prepend(undo,hint);
    document.addEventListener('visibilitychange',()=> {
      state.suspended = document.hidden;
      if(document.hidden) pauseSettlement(); else if(!leaveDialogOpen) resumeSettlement();
    });
    bind();
    if ($("foldedChoice")) $("foldedChoice").value = localeList.includes(savedLocale) ? savedLocale : "en";
    applyLocale(savedLocale);
    const loading = $("loadingPanel");
    if (loading) window.setTimeout(() => { loading.hidden = true; show("main"); }, 180);
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
