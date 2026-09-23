(() => {
  'use strict';

  const GAME_ID = 'animal-signal-scout';
  if (document.body?.dataset.wpGameId !== GAME_ID) return;

  const UI_COPY = {
    en: {
      start: 'Start Game', stages: 'Stages', next: 'Next Stage', replay: 'Replay',
      continue: 'Continue playing', returnStages: 'Return to Stages',
      leaveTitle: 'Leave {stage}?',
      leaveText: 'Continue keeps this attempt. Returning to Stages clears this patrol’s current code and check count; cleared stages and saved stars stay saved.'
    },
    'zh-Hant': {
      start: '開始遊戲', stages: '關卡', next: '下一關', replay: '再玩一次',
      continue: '繼續遊戲', returnStages: '返回關卡',
      leaveTitle: '離開{stage}？',
      leaveText: '繼續遊戲會保留這次狀態；返回關卡會清除本次巡邏的代碼與檢查次數，已通關關卡與星星紀錄仍會保留。'
    },
    'zh-Hans': {
      start: '开始游戏', stages: '关卡', next: '下一关', replay: '再玩一次',
      continue: '继续游戏', returnStages: '返回关卡',
      leaveTitle: '离开{stage}？',
      leaveText: '继续游戏会保留本次状态；返回关卡会清除本次巡逻的代码与检查次数，已通关关卡与星星记录仍会保留。'
    },
    ja: {
      start: 'ゲーム開始', stages: 'ステージ', next: '次のステージ', replay: 'もう一度',
      continue: '続ける', returnStages: 'ステージへ戻る',
      leaveTitle: '「{stage}」を離れますか？',
      leaveText: '続けると今回の状態を保ちます。ステージへ戻ると、この巡回のコードとチェック回数は失われますが、クリア済みステージと星は保存されたままです。'
    },
    ko: {
      start: '게임 시작', stages: '스테이지', next: '다음 스테이지', replay: '다시 플레이',
      continue: '계속 플레이', returnStages: '스테이지로 돌아가기',
      leaveTitle: '{stage}에서 나갈까요?',
      leaveText: '계속하면 현재 시도를 그대로 유지합니다. 스테이지로 돌아가면 이번 순찰의 코드와 확인 횟수는 지워지지만, 완료한 스테이지와 저장된 별은 유지됩니다.'
    },
    es: {
      start: 'Iniciar juego', stages: 'Niveles', next: 'Sig. nivel', replay: 'Repetir',
      continue: 'Seguir jugando', returnStages: 'Volver a niveles',
      leaveTitle: '¿Salir de {stage}?',
      leaveText: 'Seguir jugando conserva este intento. Volver a Niveles borra el código y las comprobaciones de esta patrulla; los niveles superados y las estrellas guardadas se conservan.'
    },
    'pt-BR': {
      start: 'Iniciar jogo', stages: 'Fases', next: 'Próxima fase', replay: 'Jogar de novo',
      continue: 'Continuar jogando', returnStages: 'Voltar às fases',
      leaveTitle: 'Sair de {stage}?',
      leaveText: 'Continuar mantém esta tentativa. Voltar às Fases limpa o código e as conferências desta patrulha; fases concluídas e estrelas salvas permanecem.'
    },
    fr: {
      start: 'Commencer le jeu', stages: 'Niveaux', next: 'Niveau suiv.', replay: 'Rejouer',
      continue: 'Continuer', returnStages: 'Retour aux niveaux',
      leaveTitle: 'Quitter {stage} ?',
      leaveText: 'Continuer conserve cette tentative. Revenir aux Niveaux efface le code et les vérifications de cette patrouille ; les niveaux terminés et les étoiles enregistrées restent sauvegardés.'
    },
    de: {
      start: 'Spiel starten', stages: 'Level', next: 'Nächstes Level', replay: 'Nochmal',
      continue: 'Weiterspielen', returnStages: 'Zurück zu Level',
      leaveTitle: '{stage} verlassen?',
      leaveText: 'Weiterspielen behält diesen Versuch. Zurück zu Level löscht Code und Prüfungen dieser Patrouille; abgeschlossene Level und gespeicherte Sterne bleiben erhalten.'
    },
    it: {
      start: 'Avvia gioco', stages: 'Livelli', next: 'Livello succ.', replay: 'Rigioca',
      continue: 'Continua a giocare', returnStages: 'Torna ai livelli',
      leaveTitle: 'Uscire da {stage}?',
      leaveText: 'Continuare conserva questo tentativo. Tornare ai Livelli azzera codice e controlli di questa pattuglia; livelli completati e stelle salvate restano memorizzati.'
    },
    ru: {
      start: 'Начать игру', stages: 'Уровни', next: 'След. уровень', replay: 'Повторить',
      continue: 'Продолжить', returnStages: 'К уровням',
      leaveTitle: 'Выйти из {stage}?',
      leaveText: 'Продолжение сохраняет текущую попытку. Возврат к уровням сбросит код и проверки этой патрульной миссии; пройденные уровни и сохранённые звёзды останутся.'
    },
    hi: {
      start: 'खेल शुरू करें', stages: 'स्तर', next: 'अगला स्तर', replay: 'फिर खेलें',
      continue: 'खेल जारी रखें', returnStages: 'स्तरों पर लौटें',
      leaveTitle: '{stage} छोड़ें?',
      leaveText: 'जारी रखने पर यह प्रयास बना रहेगा। स्तरों पर लौटने से इस गश्त का मौजूदा कोड और जाँच गिनती मिटेगी; पूरे किए स्तर और सहेजे सितारे सुरक्षित रहेंगे।'
    },
    ar: {
      start: 'ابدأ اللعبة', stages: 'المراحل', next: 'المرحلة التالية', replay: 'إعادة اللعب',
      continue: 'متابعة اللعب', returnStages: 'العودة للمراحل',
      leaveTitle: 'مغادرة {stage}؟',
      leaveText: 'المتابعة تحفظ حالة هذه المحاولة. العودة إلى المراحل تمسح الرمز الحالي وعدد التحققات لهذه الدورية، بينما تبقى المراحل المكتملة والنجوم المحفوظة.'
    }
  };

  const $ = (id) => document.getElementById(id);
  const locale = () => document.documentElement.lang || 'en';
  const ui = () => UI_COPY[locale()] || UI_COPY.en;
  const format = (value, vars = {}) => Object.entries(vars)
    .reduce((text, [key, replacement]) => text.replaceAll(`{${key}}`, String(replacement)), value);

  const startButton = $('startBtn');
  const mapButton = $('mapBtn');
  const stageTabs = document.querySelector('#stageScreen .stage-tabs');
  const stageTab = stageTabs?.querySelector('button');
  const battle = $('battleScreen');
  const battleHeader = battle?.querySelector(':scope > .panel-head');
  const battleContent = battle?.querySelector(':scope > .battle-content');
  const battleBack = $('battleBackBtn');
  const leaveModal = $('leaveModal');
  const leaveContinue = $('leaveContinue');
  const leaveStage = $('leaveStage');
  const leaveTitle = $('leaveTitle');
  const leaveText = $('leaveText');
  const result = $('resultScreen');
  const resultActions = result?.querySelector('.result-actions');
  const resultNext = $('resultPrimaryBtn');
  const resultStages = $('resultMapBtn');
  const resultReplay = $('resultHomeBtn');
  const testApi = window.__ANIMAL_SIGNAL_SCOUT_TEST__;
  const rawGetState = testApi?.getState?.bind(testApi);
  const originalLeaveStage = leaveStage?.onclick;
  let resultActive = false;
  let leaveOpen = false;

  function normalizeMain() {
    if (startButton) {
      startButton.removeAttribute('data-copy');
      startButton.textContent = ui().start;
      startButton.dataset.wpMainStart = 'true';
    }
    if (mapButton) {
      mapButton.hidden = true;
      mapButton.tabIndex = -1;
      mapButton.setAttribute('aria-hidden', 'true');
    }
  }

  function normalizeStage() {
    if (!stageTab) return;
    stageTab.removeAttribute('data-copy');
    stageTab.textContent = ui().stages;
    stageTab.setAttribute('aria-label', ui().stages);
    stageTabs?.removeAttribute('data-copy-aria');
    stageTabs?.setAttribute('aria-label', ui().stages);
  }

  function adoptLeaveModal() {
    if (!battle || !leaveModal) return;
    if (leaveModal.parentElement !== battle) battle.append(leaveModal);
  }

  function setLiveBattleInert(value) {
    for (const node of [battleHeader, battleContent]) {
      if (!node) continue;
      node.inert = value;
      if (value) node.setAttribute('aria-hidden', 'true');
      else node.removeAttribute('aria-hidden');
    }
  }

  function updateLeaveCopy() {
    if (!leaveModal) return;
    const snapshot = rawGetState?.();
    const stage = $('roundLabel')?.textContent?.trim()
      || `${ui().stages} ${(snapshot?.patrol ?? 0) + 1}`;
    if (leaveTitle) leaveTitle.textContent = format(ui().leaveTitle, { stage });
    if (leaveText) leaveText.textContent = ui().leaveText;
    if (leaveContinue) {
      leaveContinue.removeAttribute('data-copy');
      leaveContinue.textContent = ui().continue;
    }
    if (leaveStage) {
      leaveStage.removeAttribute('data-copy');
      leaveStage.textContent = ui().returnStages;
    }
  }

  function openLeave(event) {
    if (!battle || !leaveModal || resultActive || document.body.dataset.screen !== 'battle') return;
    event?.preventDefault?.();
    adoptLeaveModal();
    updateLeaveCopy();
    leaveOpen = true;
    setLiveBattleInert(true);
    leaveModal.hidden = false;
    leaveContinue?.focus({ preventScroll: true });
  }

  function closeLeave({ restoreFocus = true } = {}) {
    if (!leaveModal) return;
    leaveOpen = false;
    leaveModal.hidden = true;
    if (!resultActive) setLiveBattleInert(false);
    if (restoreFocus) battleBack?.focus({ preventScroll: true });
  }

  function explicitLeave(event) {
    event?.preventDefault?.();
    closeLeave({ restoreFocus: false });
    if (typeof originalLeaveStage === 'function') originalLeaveStage.call(leaveStage, event);
  }

  function handleLeaveKeys(event) {
    if (!leaveOpen || leaveModal?.hidden) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      closeLeave();
      return;
    }
    if (event.key !== 'Tab') return;
    const actions = [leaveContinue, leaveStage].filter((node) => node && !node.disabled && !node.hidden);
    if (!actions.length) return;
    const first = actions[0];
    const last = actions.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    } else if (!actions.includes(document.activeElement)) {
      event.preventDefault();
      first.focus();
    }
  }

  function adoptResult() {
    if (!battle || !result || result.dataset.wpBattleResult === 'true') return;
    result.removeAttribute('data-screen');
    result.dataset.wpBattleResult = 'true';
    result.classList.add('wp-battle-result');
    battle.append(result);
  }

  function normalizeResultActions() {
    if (!resultActions || !resultNext || !resultStages || !resultReplay) return;
    const snapshot = rawGetState?.();
    const current = Math.max(0, Number(snapshot?.patrol) || 0);
    const total = Number(testApi?.patrols?.length) || 30;
    const unlocked = Number(snapshot?.progress?.unlocked) || 1;
    const canNext = current + 1 < total && current + 2 <= unlocked;

    resultStages.removeAttribute('data-copy');
    resultReplay.removeAttribute('data-copy');
    resultStages.textContent = ui().stages;
    resultNext.textContent = ui().next;
    resultReplay.textContent = ui().replay;
    resultActions.append(resultStages, resultNext, resultReplay);

    resultStages.disabled = false;
    resultStages.removeAttribute('aria-disabled');

    resultNext.disabled = !canNext;
    resultNext.setAttribute('aria-disabled', String(!canNext));
    resultNext.onclick = canNext && testApi?.startPatrol
      ? () => testApi.startPatrol(current + 1)
      : null;

    resultReplay.disabled = false;
    resultReplay.removeAttribute('aria-disabled');
    resultReplay.onclick = testApi?.startPatrol
      ? () => testApi.startPatrol(current)
      : null;
  }

  function paintResultState() {
    if (!battle || !result) return;
    if (resultActive) {
      closeLeave({ restoreFocus: false });
      battle.hidden = false;
      result.hidden = false;
      battle.dataset.wpResultActive = 'true';
      setLiveBattleInert(true);
      normalizeResultActions();
      if (document.body.dataset.screen !== 'battle') document.body.dataset.screen = 'battle';
      window.dispatchEvent(new CustomEvent('weightplay:shell-sync'));
      result.querySelector('button:not([disabled])')?.focus({ preventScroll: true });
    } else {
      result.hidden = true;
      delete battle.dataset.wpResultActive;
      if (!leaveOpen) setLiveBattleInert(false);
    }
  }

  function enterResultIfNeeded() {
    if (document.body.dataset.screen !== 'result') return;
    resultActive = true;
    paintResultState();
  }

  function leaveResultBeforeAction(event) {
    if (!event.target.closest('#resultPrimaryBtn,#resultMapBtn,#resultHomeBtn')) return;
    resultActive = false;
    queueMicrotask(paintResultState);
  }

  adoptLeaveModal();
  adoptResult();
  normalizeMain();
  normalizeStage();
  enterResultIfNeeded();

  if (battleBack) battleBack.onclick = openLeave;
  if (leaveContinue) leaveContinue.onclick = () => closeLeave();
  if (leaveStage) leaveStage.onclick = explicitLeave;
  document.addEventListener('keydown', handleLeaveKeys, true);
  result?.addEventListener('click', leaveResultBeforeAction, true);

  const bodyObserver = new MutationObserver(() => {
    normalizeMain();
    normalizeStage();
    if (document.body.dataset.screen === 'result') enterResultIfNeeded();
    else if (!resultActive) paintResultState();
  });
  bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['data-screen'] });

  const langObserver = new MutationObserver(() => {
    normalizeMain();
    normalizeStage();
    if (leaveOpen) updateLeaveCopy();
    if (resultActive) normalizeResultActions();
  });
  langObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  if (testApi?.getState && rawGetState) {
    testApi.getState = () => {
      const snapshot = rawGetState();
      if (snapshot?.screen === 'result') snapshot.screen = 'battle';
      return snapshot;
    };
  }
})();
