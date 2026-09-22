(() => {
  "use strict";
  /* WP-GAME-ANALYTICS-ADAPTER */
  // Only replayable lifecycle signals live here; all metrics/timers/GA4 stay shared.
  const __wpMeasurement = { screen: null, roundKey: null, started: false, ended: false, restart: false, outcome: "complete" };
  const __wpReadMeasurement = () => ({ ...__wpMeasurement,
    screen: ((({main:"main",stage:"stage",battle:"battle",})[state.screen] ?? null) === "battle" && (__wpMeasurement.ended)) ? null : (({main:"main",stage:"stage",battle:"battle",})[state.screen] ?? null), ended: Boolean(__wpMeasurement.ended), outcome: __wpMeasurement.outcome,
    paused: Boolean(state?.paused || state?.suspended || state?.leaveOpen || state?.resultOpen), node: document.body,
    activityMode: "input", idleSeconds: 300
  });
  function __wpNotifyMeasurement() { try { window.WonderAnalytics?.game?.observeState(__wpReadMeasurement); } catch { /* Optional telemetry. */ } }
  // Explicit authored replay actions count only when a new round was actually created.
  function __wpReplayStart(action) {
    const previous = __wpMeasurement.roundKey, value = action();
    if (__wpMeasurement.roundKey !== previous) { __wpMeasurement.restart = true; __wpNotifyMeasurement(); }
    return value;
  }
  window.addEventListener("weightplay:analytics-ready", __wpNotifyMeasurement);
  __wpNotifyMeasurement();

  const copy = window.ANIMAL_DEWLINE_LOCALES || {};
  const interfaceCopy = {
    en: { start: "Start Game", stages: "Stages", replay: "Replay", leaveTitle: "Leave this meadow?", leaveText: "Continue keeps your valve settings. Returning to Stages ends this attempt.", continue: "Continue", returnStage: "Return to Stages" },
    "zh-Hant": { start: "開始遊戲", stages: "關卡", replay: "重新挑戰", leaveTitle: "要離開這個關卡嗎？", leaveText: "繼續會保留目前的閥門設定；返回關卡會結束這次嘗試。", continue: "繼續遊戲", returnStage: "返回關卡" },
    "zh-Hans": { start: "开始游戏", stages: "关卡", replay: "重新挑战", leaveTitle: "要离开这个关卡吗？", leaveText: "继续会保留当前阀门设置；返回关卡会结束本次尝试。", continue: "继续游戏", returnStage: "返回关卡" },
    ja: { start: "ゲーム開始", stages: "ステージ", replay: "リプレイ", leaveTitle: "このステージを離れますか？", leaveText: "続けると現在のバルブ設定を保持します。ステージへ戻るとこの挑戦は終了します。", continue: "続ける", returnStage: "ステージへ戻る" },
    ko: { start: "게임 시작", stages: "스테이지", replay: "다시 플레이", leaveTitle: "이 스테이지를 나갈까요?", leaveText: "계속하면 현재 밸브 설정이 유지됩니다. 스테이지로 돌아가면 이번 시도가 끝납니다.", continue: "계속", returnStage: "스테이지로 돌아가기" },
    es: { start: "Iniciar juego", stages: "Niveles", replay: "Repetir", leaveTitle: "¿Salir de este nivel?", leaveText: "Continuar conserva los ajustes. Volver a Niveles termina este intento.", continue: "Continuar", returnStage: "Volver a Niveles" },
    "pt-BR": { start: "Iniciar jogo", stages: "Fases", replay: "Jogar novamente", leaveTitle: "Sair desta fase?", leaveText: "Continuar mantém os ajustes das válvulas. Voltar às Fases encerra esta tentativa.", continue: "Continuar", returnStage: "Voltar às Fases" },
    fr: { start: "Démarrer le jeu", stages: "Niveaux", replay: "Rejouer", leaveTitle: "Quitter ce niveau ?", leaveText: "Continuer conserve les réglages. Revenir aux Niveaux termine cette tentative.", continue: "Continuer", returnStage: "Retour aux Niveaux" },
    de: { start: "Spiel starten", stages: "Level", replay: "Wiederholen", leaveTitle: "Dieses Level verlassen?", leaveText: "Weiter behält die Ventileinstellungen. Zurück zu den Leveln beendet diesen Versuch.", continue: "Weiter", returnStage: "Zurück zu den Leveln" },
    it: { start: "Avvia gioco", stages: "Livelli", replay: "Rigioca", leaveTitle: "Uscire da questo livello?", leaveText: "Continua mantiene le impostazioni. Tornare ai Livelli termina questo tentativo.", continue: "Continua", returnStage: "Torna ai Livelli" },
    ru: { start: "Начать игру", stages: "Уровни", replay: "Повторить", leaveTitle: "Выйти из этого уровня?", leaveText: "Продолжение сохранит настройки клапанов. Возврат к уровням завершит попытку.", continue: "Продолжить", returnStage: "К уровням" },
    hi: { start: "गेम शुरू करें", stages: "स्तर", replay: "फिर खेलें", leaveTitle: "इस स्तर से बाहर निकलें?", leaveText: "जारी रखने पर वाल्व सेटिंग बनी रहेंगी। स्तरों पर लौटने से यह कोशिश समाप्त होगी।", continue: "जारी रखें", returnStage: "स्तरों पर लौटें" },
    ar: { start: "ابدأ اللعبة", stages: "المراحل", replay: "إعادة اللعب", leaveTitle: "هل تريد مغادرة هذه المرحلة؟", leaveText: "المتابعة تحفظ إعدادات الصمامات. العودة إلى المراحل تنهي هذه المحاولة.", continue: "متابعة", returnStage: "العودة إلى المراحل" }
  };
  Object.entries(interfaceCopy).forEach(([locale, labels]) => {
    if (!copy[locale]) return;
    copy[locale].start = labels.start;
    copy[locale].plots = labels.stages;
    copy[locale].map = labels.stages;
    copy[locale].replay = labels.replay;
  });

  const meadows = [
    { titleKey: "meadow1", targets: [2, 3, 1] },
    { titleKey: "meadow2", targets: [4, 1, 3] },
    { titleKey: "meadow3", targets: [3, 5, 2] },
  ];
  const state = { locale: "en", meadow: 0, values: [0, 0, 0], tries: 0, sessionTries: 0, sound: true, screen: "main", resultOpen: false, leaveOpen: false };
  const $ = (id) => document.getElementById(id);
  const t = (key, vars = {}) => {
    const table = copy[state.locale] || copy.en || {};
    const ui = interfaceCopy[state.locale] || interfaceCopy.en;
    let value = (key === 'title' && window.WEIGHTPLAY_GAME_TITLES?.['animal-dewline']?.[state.locale]) || ui[key] || table[key] || copy.en?.[key] || key;
    Object.entries(vars).forEach(([name, replacement]) => { value = value.replaceAll(`{${name}}`, String(replacement)); });
    return value;
  };
  const track = (name, detail = {}) => {
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: `animal_dewline_${name}`, ...detail });
      document.dispatchEvent(new CustomEvent("weightplay:animal-dewline", { detail: { name, ...detail } }));
    } catch (_) {}
  };
  const readBest = () => { try { const value = Number(localStorage.getItem("weightplay-animal-dewline-best-v1")); return Number.isFinite(value) && value > 0 ? value : null; } catch (_) { return null; } };
  const writeBest = (value) => { try { const old = readBest(); if (!old || value < old) localStorage.setItem("weightplay-animal-dewline-best-v1", String(value)); } catch (_) {} };
  const refreshMainBest = () => { const node = $("bestValue"); if (node) node.textContent = readBest() || t("noBest"); };

  const installInterface7Cleanup = () => {
    if (!document.querySelector('link[data-dewline-interface7]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/games/animal-dewline/interface-7-cleanup.css';
      link.dataset.dewlineInterface7 = '';
      document.head.append(link);
    }
    [document.querySelector('.nori-guide'), document.querySelector('.hero-copy > .kicker'), document.querySelector('.hero-copy > h1[data-wp-game-title]'), document.querySelector('.best-line'), $('mapBtn')].filter(Boolean).forEach((node) => { node.hidden = true; });
    $('startBtn')?.classList.add('wp-standard-main-start');
    $('stageList')?.setAttribute('role', 'group');
    if ($('stageBackBtn')) { $('stageBackBtn').textContent = '←'; $('stageBackBtn').setAttribute('aria-label', t('back')); }
    if ($('battleBackBtn')) { $('battleBackBtn').textContent = '←'; $('battleBackBtn').setAttribute('aria-label', t('back')); }
    if ($('battleSettingsBtn')) { $('battleSettingsBtn').hidden = true; $('battleSettingsBtn').tabIndex = -1; }

    const result = $('resultScreen'), battle = $('battleScreen');
    if (result && battle && result.parentElement !== battle) {
      result.removeAttribute('data-screen');
      result.classList.add('battle-result-substate');
      battle.append(result);
    }
    const resultActions = result?.querySelector('.result-actions');
    if (resultActions && $('resultMapBtn') && $('resultPrimaryBtn') && $('resultHomeBtn')) resultActions.append($('resultMapBtn'), $('resultPrimaryBtn'), $('resultHomeBtn'));
    $('resultHomeBtn')?.setAttribute('data-copy', 'replay');

    if (!$('dewlineLeaveModal') && battle) {
      const modal = document.createElement('section');
      modal.id = 'dewlineLeaveModal';
      modal.className = 'dewline-leave-modal';
      modal.hidden = true;
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-labelledby', 'dewlineLeaveTitle');
      modal.innerHTML = '<div class="dewline-leave-card"><h2 id="dewlineLeaveTitle"></h2><p id="dewlineLeaveText"></p><div class="dewline-leave-actions"><button id="dewlineLeaveContinue" class="primary-btn" type="button"></button><button id="dewlineLeaveStage" class="secondary-btn" type="button"></button></div></div>';
      battle.append(modal);
      $('dewlineLeaveContinue').addEventListener('click', continueBattle);
      $('dewlineLeaveStage').addEventListener('click', confirmBattleLeave);
      modal.addEventListener('keydown', (event) => {
        if (!state.leaveOpen) return;
        if (event.key === 'Escape') { event.preventDefault(); continueBattle(); return; }
        if (event.key !== 'Tab') return;
        const nodes = [$('dewlineLeaveContinue'), $('dewlineLeaveStage')].filter((node) => node && !node.disabled && !node.hidden);
        if (!nodes.length) return;
        const first = nodes[0], last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      });
    }
    window.dispatchEvent(new CustomEvent('weightplay:shell-sync'));
  };

  const setResultOpen = (open) => {
    state.resultOpen = Boolean(open);
    if (state.resultOpen) closeLeaveDialog(false);
    const result = $('resultScreen'), content = $('battleScreen')?.querySelector('.battle-content'), header = $('battleScreen')?.querySelector('.battle-header');
    if (result) result.hidden = !state.resultOpen;
    if (content) content.inert = state.resultOpen || state.leaveOpen;
    if (header) header.inert = state.resultOpen || state.leaveOpen;
    if (state.resultOpen) requestAnimationFrame(() => $('resultMapBtn')?.focus({ preventScroll: true }));
  };

  const show = (screen) => {
    if (screen !== 'battle') { setResultOpen(false); closeLeaveDialog(false); }
    state.screen = screen;
    ["main", "stage", "battle"].forEach((name) => { $(`${name}Screen`).hidden = name !== screen; });
    document.body.dataset.screen = screen;
    window.dispatchEvent(new CustomEvent('weightplay:shell-sync'));
    if (screen === "main") {
      refreshMainBest();
      requestAnimationFrame(() => { if (state.screen === "main") refreshMainBest(); });
    }

    { const __wpNextScreen = ({main:"main",stage:"stage",battle:"battle",})[screen] ?? null;
      if ((__wpNextScreen === "main" || __wpNextScreen === "stage") && __wpMeasurement.screen === "battle" && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "abandon"; }
      __wpMeasurement.screen = __wpNextScreen;  __wpNotifyMeasurement(); }
  };

  const applyLocale = () => {
    window.WonderI18n?.setLocale?.(state.locale, { navigate: false });
    document.documentElement.lang = state.locale;
    document.documentElement.dir = state.locale === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = t(node.dataset.copy); });
    document.querySelectorAll("[data-copy-aria]").forEach((node) => { node.setAttribute("aria-label", t(node.dataset.copyAria)); });
    $("localeSelect").value = state.locale;
    $("localeSelect").setAttribute("aria-label", t("language"));
    $("settingsBtn").setAttribute("aria-label", t("settings"));
    [$("stageSettingsBtn"), $("battleSettingsBtn")].filter(Boolean).forEach((node) => node.setAttribute("aria-label", t("settings")));
    $("soundBtn").textContent = state.sound ? t("soundOn") : t("soundOff");
    $("bestValue").textContent = readBest() || t("noBest");
    if ($('stageBackBtn')) $('stageBackBtn').setAttribute('aria-label', t('back'));
    if ($('battleBackBtn')) $('battleBackBtn').setAttribute('aria-label', t('back'));
    if ($('dewlineLeaveTitle')) $('dewlineLeaveTitle').textContent = t('leaveTitle');
    if ($('dewlineLeaveText')) $('dewlineLeaveText').textContent = t('leaveText');
    if ($('dewlineLeaveContinue')) $('dewlineLeaveContinue').textContent = t('continue');
    if ($('dewlineLeaveStage')) $('dewlineLeaveStage').textContent = t('returnStage');
    if (state.screen === "stage") renderStages();
    if (state.screen === "battle" && !state.resultOpen) renderBattle();
    if (state.resultOpen) renderResult();
  };

  const renderStages = () => {
    $("stageList").replaceChildren(...meadows.map((meadow, index) => {
      const button = document.createElement("button");
      button.type = "button"; button.className = "stage-card"; button.dataset.meadow = index; button.dataset.wpStageCard = '';
      if (index === state.meadow) button.dataset.wpStageRecommended = 'true';
      button.innerHTML = `<span data-wp-item-content><strong>${t("round", { n: index + 1, total: meadows.length })}</strong><span>${t(meadow.titleKey)}</span><small>${meadow.targets.join(" · ")}</small></span>`;
      button.addEventListener("click", () => startMeadow(index));
      return button;
    }));
    window.dispatchEvent(new CustomEvent('weightplay:stage-sync', { detail: { rail: $('stageList') } }));
  };

  const renderBattle = () => {
    const meadow = meadows[state.meadow];
    $("battleHeading").textContent = t(meadow.titleKey);
    $("roundLabel").textContent = t("round", { n: state.meadow + 1, total: meadows.length });
    $("battleHint").textContent = t("battleHint");
    $("targetValues").textContent = `${t("target")}: ${meadow.targets.join(" · ")}`;
    $("sessionTries").textContent = String(state.sessionTries);
    $("currentTotal").textContent = String(state.values.reduce((sum, value) => sum + value, 0));
    $("targetTotal").textContent = String(meadow.targets.reduce((sum, value) => sum + value, 0));
    $("valveGrid").replaceChildren(...state.values.map((value, index) => {
      const card = document.createElement("article"); card.className = `valve-card valve-slot-${index + 1}`;
      const art = document.createElement("span"); art.className = `valve-art valve-art-${index + 1}`; art.setAttribute("aria-hidden", "true");
      const label = document.createElement("strong"); label.textContent = t("valve", { n: index + 1 });
      const current = document.createElement("span"); current.className = "valve-value"; current.textContent = `${t("current")}: ${value}`;
      const controls = document.createElement("div"); controls.className = "valve-controls";
      const down = document.createElement("button"); down.type = "button"; down.textContent = "−"; down.setAttribute("aria-label", t("decrease", { n: index + 1 })); down.disabled = value === 0;
      const up = document.createElement("button"); up.type = "button"; up.textContent = "+"; up.setAttribute("aria-label", t("increase", { n: index + 1 })); up.disabled = value === 6;
      down.addEventListener("click", () => changeValve(index, -1)); up.addEventListener("click", () => changeValve(index, 1));
      controls.append(down, up); card.append(art, label, current, controls); return card;
    }));
  };

  const renderResult = () => {
    const complete = state.meadow >= meadows.length - 1;
    $("resultHeading").textContent = complete ? t("finishTitle") : t("correct");
    $("resultText").textContent = complete ? t("finishText", { n: state.sessionTries, best: readBest() || state.sessionTries }) : t("correct");
    $("resultMapBtn").hidden = false; $("resultMapBtn").textContent = t('stages'); $("resultMapBtn").onclick = () => { state.meadow = meadows.length - 1; show('stage'); renderStages(); };
    $("resultPrimaryBtn").hidden = false; $("resultPrimaryBtn").textContent = t("next"); $("resultPrimaryBtn").disabled = complete; $("resultPrimaryBtn").onclick = complete ? () => {} : () => startMeadow(state.meadow + 1);
    $("resultHomeBtn").hidden = false; $("resultHomeBtn").textContent = t('replay'); $("resultHomeBtn").onclick = () => startMeadow(state.meadow);
    __wpNotifyMeasurement();
  };

  const startSession = () => { state.sessionTries = 0; show("stage"); renderStages(); track("session_start"); };
  const startMeadow = (index) => {
    closeLeaveDialog(false); setResultOpen(false);
    state.meadow = Math.max(0, Math.min(meadows.length - 1, index)); state.values = [0, 0, 0]; state.tries = 0; $("battleStatus").textContent = ""; show("battle"); renderBattle(); track("meadow_start", { meadow: state.meadow + 1 });
    __wpMeasurement.roundKey = {}; __wpMeasurement.restart = false; __wpMeasurement.started = true; __wpMeasurement.ended = false; __wpMeasurement.outcome = "complete"; __wpMeasurement.screen = "battle"; __wpNotifyMeasurement();
  };
  const changeValve = (index, delta) => { if (state.resultOpen || state.leaveOpen) return; state.values[index] = Math.max(0, Math.min(6, state.values[index] + delta)); renderBattle(); track("valve_adjust", { meadow: state.meadow + 1, valve: index + 1, value: state.values[index] }); };
  const resetValves = () => { if (state.resultOpen || state.leaveOpen) return; state.values = [0, 0, 0]; renderBattle(); $("battleStatus").textContent = t("ready"); track("reset", { meadow: state.meadow + 1 });
    if (state.screen === "battle") { __wpMeasurement.roundKey = {}; __wpMeasurement.restart = false; __wpMeasurement.started = true; __wpMeasurement.ended = false; __wpMeasurement.outcome = "complete"; __wpMeasurement.screen = "battle"; __wpNotifyMeasurement(); }
  };
  const checkFlow = () => {
    if (state.resultOpen || state.leaveOpen) return;
    const meadow = meadows[state.meadow]; state.tries += 1; state.sessionTries += 1;
    const firstMismatch = meadow.targets.findIndex((target, index) => target !== state.values[index]);
    track("check", { meadow: state.meadow + 1, tries: state.sessionTries, correct: firstMismatch < 0 });
    if (firstMismatch >= 0) { $("battleStatus").textContent = t("wrong", { n: firstMismatch + 1 }); renderBattle(); return; }
    $("battleStatus").textContent = t("correct");
    if (state.meadow >= meadows.length - 1) { writeBest(state.sessionTries); track("session_complete", { tries: state.sessionTries }); }
    __wpMeasurement.ended = true; __wpMeasurement.outcome = 'complete'; setResultOpen(true); renderResult(); __wpNotifyMeasurement();
  };

  const battleHasProgress = () => state.tries > 0 || state.values.some((value) => value !== 0);
  function requestBattleLeave() {
    if (state.screen !== 'battle' || state.resultOpen || state.leaveOpen) return;
    if (!battleHasProgress()) { show('stage'); renderStages(); return; }
    state.leaveOpen = true;
    const modal = $('dewlineLeaveModal'), content = $('battleScreen')?.querySelector('.battle-content'), header = $('battleScreen')?.querySelector('.battle-header');
    if (content) content.inert = true; if (header) header.inert = true;
    if (modal) modal.hidden = false;
    __wpNotifyMeasurement(); requestAnimationFrame(() => $('dewlineLeaveContinue')?.focus({ preventScroll: true }));
  }
  function closeLeaveDialog(restoreFocus = true) {
    const modal = $('dewlineLeaveModal'), content = $('battleScreen')?.querySelector('.battle-content'), header = $('battleScreen')?.querySelector('.battle-header');
    state.leaveOpen = false; if (modal) modal.hidden = true;
    if (content) content.inert = state.resultOpen; if (header) header.inert = state.resultOpen;
    __wpNotifyMeasurement(); if (restoreFocus && state.screen === 'battle' && !state.resultOpen) $('battleBackBtn')?.focus({ preventScroll: true });
  }
  function continueBattle() { closeLeaveDialog(true); }
  function confirmBattleLeave() { closeLeaveDialog(false); state.values = [0, 0, 0]; state.tries = 0; show('stage'); renderStages(); }

  $("startBtn").addEventListener("click", startSession);
  $("mapBtn").addEventListener("click", () => { show("stage"); renderStages(); track("meadow_map"); });
  $("stageBackBtn").addEventListener("click", () => show("main"));
  $("battleBackBtn").addEventListener("click", requestBattleLeave);
  $("checkBtn").addEventListener("click", checkFlow); $("resetBtn").addEventListener("click", function (...args) { return __wpReplayStart(() => resetValves.apply(this, args)); });
  const toggleSettings = () => { const panel = $("settingsPanel"); panel.hidden = !panel.hidden; [$("settingsBtn"), $("stageSettingsBtn")].filter(Boolean).forEach((node) => node.setAttribute("aria-expanded", String(!panel.hidden))); };
  [$("settingsBtn"), $("stageSettingsBtn")].filter(Boolean).forEach((node) => node.addEventListener("click", toggleSettings));
  $("soundBtn").addEventListener("click", () => { state.sound = !state.sound; applyLocale(); track("sound", { enabled: state.sound }); });
  window.addEventListener("weightplay:shell-sync", () => { if (state.screen === "main") refreshMainBest(); });
  $("localeSelect").addEventListener("change", (event) => { state.locale = copy[event.target.value] ? event.target.value : "en"; try { localStorage.setItem("weightplayLocale", state.locale); } catch (_) {} applyLocale(); track("locale", { locale: state.locale }); });
  try { const saved = localStorage.getItem("weightplayLocale"); if (saved && copy[saved]) state.locale = saved; } catch (_) {}
  const routeSegment = location.pathname.split('/').filter(Boolean)[0]?.toLowerCase();
  const routeLocale = {'zh-tw':'zh-Hant','zh-cn':'zh-Hans','pt-br':'pt-BR'}[routeSegment] || routeSegment;
  if (copy[routeLocale]) state.locale = routeLocale;
  installInterface7Cleanup();
  window.setTimeout(() => { $("loadingPanel").hidden = true; show("main"); applyLocale(); track("main_ready"); }, 260);
  window.__ANIMAL_DEWLINE_TEST__ = { meadows, startSession, startMeadow, changeValve, checkFlow, getState: () => ({ ...state, values: [...state.values] }) };
})();