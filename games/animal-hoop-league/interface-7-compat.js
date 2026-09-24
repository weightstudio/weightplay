(() => {
  'use strict';

  if (document.body?.dataset.wpMarketGame !== 'animal-hoop-league') return;

  const battle = document.getElementById('battle-screen');
  const battleBack = document.getElementById('battle-back');
  const result = document.getElementById('result-screen');
  const resultToStages = document.getElementById('to-stages');
  const stageLabel = document.getElementById('stage-label');
  if (!battle || !battleBack || !result || !resultToStages) return;

  // Result is a Battle-owned substate, never a fourth top-level scene.
  result.classList.remove('screen');
  result.removeAttribute('data-screen');
  result.dataset.wpBattleSubstate = 'result';

  const COPY = Object.freeze({
    en: ['Leave {stage}?', 'Your current shot sequence and score on {stage} will be discarded. Cleared courts stay saved.', 'Continue playing', 'Return to Stages'],
    'zh-Hant': ['離開 {stage}？', '目前在 {stage} 的投籃進度與分數會被放棄，已通關的球場仍會保留。', '繼續遊戲', '返回關卡'],
    'zh-Hans': ['离开 {stage}？', '当前在 {stage} 的投篮进度与分数会被放弃，已通关的球场仍会保留。', '继续游戏', '返回关卡'],
    ja: ['{stage} を離れますか？', '{stage} の現在のショット進行とスコアは破棄されます。クリア済みコートは保存されます。', '続ける', 'ステージへ戻る'],
    ko: ['{stage}에서 나갈까요?', '{stage}의 현재 슛 진행과 점수는 사라집니다. 클리어한 코트는 저장됩니다.', '계속하기', '스테이지로 돌아가기'],
    es: ['¿Salir de {stage}?', 'Se descartarán los tiros y la puntuación actuales de {stage}. Las canchas superadas seguirán guardadas.', 'Continuar', 'Volver a etapas'],
    'pt-BR': ['Sair de {stage}?', 'A sequência de arremessos e a pontuação atuais de {stage} serão descartadas. Quadras concluídas continuam salvas.', 'Continuar', 'Voltar às fases'],
    fr: ['Quitter {stage} ?', 'La série de tirs et le score actuels de {stage} seront abandonnés. Les terrains terminés restent enregistrés.', 'Continuer', 'Retour aux niveaux'],
    de: ['{stage} verlassen?', 'Die aktuelle Wurfserie und Punktzahl von {stage} werden verworfen. Abgeschlossene Plätze bleiben gespeichert.', 'Weiterspielen', 'Zurück zu Stufen'],
    it: ['Lasciare {stage}?', 'La sequenza di tiri e il punteggio attuali di {stage} verranno annullati. I campi completati restano salvati.', 'Continua', 'Torna ai livelli'],
    ru: ['Покинуть {stage}?', 'Текущая серия бросков и счёт на {stage} будут сброшены. Пройденные площадки останутся сохранены.', 'Продолжить', 'К этапам'],
    hi: ['{stage} से बाहर जाएँ?', '{stage} की मौजूदा शॉट प्रगति और स्कोर छोड़ दिए जाएँगे। पूरे किए गए कोर्ट सुरक्षित रहेंगे।', 'जारी रखें', 'स्टेज पर लौटें'],
    ar: ['مغادرة {stage}؟', 'سيتم تجاهل تقدم التسديد والنتيجة الحالية في {stage}، وستبقى الملاعب المكتملة محفوظة.', 'متابعة', 'العودة إلى المراحل'],
  });

  const locale = () => {
    const raw = document.documentElement.lang || localStorage.getItem('weightPlayLocale') || 'en';
    if (/^zh-(tw|hant)/i.test(raw)) return 'zh-Hant';
    if (/^zh-(cn|hans)/i.test(raw)) return 'zh-Hans';
    if (/^pt/i.test(raw)) return 'pt-BR';
    const simple = raw.split('-')[0];
    return Object.prototype.hasOwnProperty.call(COPY, raw) ? raw : (COPY[simple] ? simple : 'en');
  };

  const dialog = document.createElement('section');
  dialog.id = 'hoopLeagueLeaveDialog';
  dialog.className = 'hoop-leave-dialog';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', 'hoopLeagueLeaveTitle');
  dialog.setAttribute('aria-describedby', 'hoopLeagueLeaveCopy');
  dialog.hidden = true;
  dialog.inert = true;
  dialog.innerHTML = `
    <div class="hoop-leave-card">
      <h2 id="hoopLeagueLeaveTitle"></h2>
      <p id="hoopLeagueLeaveCopy"></p>
      <div class="hoop-leave-actions">
        <button id="hoopLeagueContinue" class="primary" type="button"></button>
        <button id="hoopLeagueReturn" type="button"></button>
      </div>
    </div>`;
  battle.append(dialog);

  const continueBtn = dialog.querySelector('#hoopLeagueContinue');
  const returnBtn = dialog.querySelector('#hoopLeagueReturn');
  const title = dialog.querySelector('#hoopLeagueLeaveTitle');
  const copy = dialog.querySelector('#hoopLeagueLeaveCopy');
  const focusables = [continueBtn, returnBtn];
  let open = false;

  // The legacy Market Five loop schedules its mutable simulation through the
  // named `frame` callback. Gate only that callback so the already-scheduled
  // gameplay frame can be cancelled before the leave modal becomes interactive;
  // unrelated shared-frame/layout RAF work remains live.
  const nativeRequestAnimationFrame = window.requestAnimationFrame.bind(window);
  const nativeCancelAnimationFrame = window.cancelAnimationFrame.bind(window);
  let gameplayFrame = null;
  let gameplayFrameId = null;
  let gameplayPaused = false;

  window.requestAnimationFrame = (callback) => {
    if (typeof callback !== 'function' || callback.name !== 'frame') {
      return nativeRequestAnimationFrame(callback);
    }
    gameplayFrame = callback;
    if (gameplayPaused) return 0;
    let id = 0;
    id = nativeRequestAnimationFrame((now) => {
      if (gameplayFrameId === id) gameplayFrameId = null;
      if (!gameplayPaused) callback(now);
    });
    gameplayFrameId = id;
    return id;
  };

  window.cancelAnimationFrame = (id) => {
    if (gameplayFrameId === id) gameplayFrameId = null;
    nativeCancelAnimationFrame(id);
  };

  function pauseGameplay() {
    gameplayPaused = true;
    if (gameplayFrameId !== null) {
      nativeCancelAnimationFrame(gameplayFrameId);
      gameplayFrameId = null;
    }
  }

  function resumeGameplay() {
    if (!gameplayPaused) return;
    gameplayPaused = false;
    if (typeof gameplayFrame === 'function' && document.body.dataset.screen === 'battle' && result.hidden) {
      window.requestAnimationFrame(gameplayFrame);
    }
  }

  function stageName() {
    return stageLabel?.textContent?.trim() || ({
      en: 'this court', 'zh-Hant': '這個球場', 'zh-Hans': '这个球场', ja: 'このコート', ko: '이 코트',
      es: 'esta cancha', 'pt-BR': 'esta quadra', fr: 'ce terrain', de: 'diesen Platz', it: 'questo campo',
      ru: 'эту площадку', hi: 'इस कोर्ट', ar: 'هذا الملعب',
    }[locale()] || 'this court');
  }

  function applyCopy() {
    const values = COPY[locale()] || COPY.en;
    const currentStage = stageName();
    title.textContent = values[0].replaceAll('{stage}', currentStage);
    copy.textContent = values[1].replaceAll('{stage}', currentStage);
    continueBtn.textContent = values[2];
    returnBtn.textContent = values[3];
  }

  function coveredNodes() {
    return [...battle.children].filter((node) => node !== dialog);
  }

  function setCoveredInert(value) {
    coveredNodes().forEach((node) => { node.inert = value; });
  }

  function closeDialog({ restoreFocus = true, resume = true } = {}) {
    if (!open) return;
    open = false;
    dialog.hidden = true;
    dialog.inert = true;
    battle.removeAttribute('data-wp-exit-open');
    setCoveredInert(false);
    if (resume) resumeGameplay();
    if (restoreFocus && document.body.dataset.screen === 'battle' && result.hidden) {
      battleBack.focus({ preventScroll: true });
    }
  }

  function openDialog() {
    if (open || !result.hidden || document.body.dataset.screen !== 'battle') return;
    applyCopy();
    pauseGameplay();
    setCoveredInert(true);
    battle.dataset.wpExitOpen = 'true';
    open = true;
    dialog.hidden = false;
    dialog.inert = false;
    continueBtn.focus({ preventScroll: true });
  }

  battleBack.addEventListener('click', (event) => {
    if (document.body.dataset.screen !== 'battle' || !result.hidden) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openDialog();
  }, true);

  continueBtn.addEventListener('click', () => closeDialog());

  returnBtn.addEventListener('click', () => {
    if (!open) return;
    closeDialog({ restoreFocus: false, resume: false });
    // Reuse the shared runtime's existing Stage-return transaction through the
    // Result recovery action. This avoids the legacy Battle Back native confirm
    // entirely while preserving stage rendering, analytics, and scene cleanup.
    resultToStages.click();
    gameplayPaused = false;
  });

  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeDialog();
      return;
    }
    if (event.key !== 'Tab') return;
    const current = focusables.indexOf(document.activeElement);
    const next = event.shiftKey
      ? (current <= 0 ? focusables.length - 1 : current - 1)
      : (current >= focusables.length - 1 ? 0 : current + 1);
    event.preventDefault();
    focusables[next].focus({ preventScroll: true });
  });

  window.addEventListener('weightplay:market-locale-change', applyCopy);
  applyCopy();
})();
