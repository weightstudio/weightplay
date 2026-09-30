(() => {
  'use strict';
  const gameId = 'four-in-a-row';
  const locales = ['en', 'zh-Hant', 'zh-Hans', 'ja', 'ko', 'es', 'pt-BR', 'fr', 'de', 'it', 'ru', 'hi', 'ar'];
  // New interaction copy only. The authored Guide, rules, AI, Hint, Undo,
  // difficulty, Result goals, audio and storage keep their existing owners.
  const copy = {
    leaveTitle: ['Leave this round?', '離開這一局？', '离开这一局？', 'この対局を終了しますか？', '이번 판을 나갈까요?', '¿Salir de esta ronda?', 'Sair desta rodada?', 'Quitter cette manche ?', 'Diese Runde verlassen?', 'Uscire da questa partita?', 'Выйти из этой партии?', 'यह राउंड छोड़ें?', 'هل تريد مغادرة هذه الجولة؟'],
    leaveText: ['Returning to Main clears this board. Your sound and language preferences stay saved.', '返回主畫面會清空本局棋盤，聲音與語言偏好仍會保留。', '返回主画面会清空本局棋盘，声音与语言偏好仍会保留。', 'メインに戻るとこの盤面は消去されます。サウンドと言語の設定は保存されたままです。', '메인으로 돌아가면 이번 판의 보드가 지워집니다. 소리와 언어 설정은 유지됩니다.', 'Volver al inicio borra este tablero. Las preferencias de sonido e idioma se conservan.', 'Voltar ao início limpa este tabuleiro. As preferências de som e idioma ficam salvas.', 'Revenir à l’accueil efface ce plateau. Les préférences de son et de langue sont conservées.', 'Zurück zur Hauptseite leert dieses Brett. Ton- und Spracheinstellungen bleiben gespeichert.', 'Tornare alla schermata principale cancella questa tavola. Le preferenze audio e lingua restano salvate.', 'Возврат на главную очищает эту доску. Настройки звука и языка сохраняются.', 'मुख्य स्क्रीन पर लौटने से यह बोर्ड खाली हो जाएगा। ध्वनि और भाषा की पसंद सहेजी रहेगी।', 'العودة إلى الرئيسية تمسح هذه اللوحة. تبقى تفضيلات الصوت واللغة محفوظة.'],
    continue: ['Continue playing', '繼續遊玩', '继续游玩', '対局を続ける', '계속 플레이', 'Seguir jugando', 'Continuar jogando', 'Continuer à jouer', 'Weiterspielen', 'Continua a giocare', 'Продолжить игру', 'खेलते रहें', 'متابعة اللعب'],
    main: ['Return to Main', '返回主畫面', '返回主画面', 'メインに戻る', '메인으로 돌아가기', 'Volver al inicio', 'Voltar ao início', 'Revenir à l’accueil', 'Zurück zur Hauptseite', 'Torna alla schermata principale', 'На главную', 'मुख्य स्क्रीन पर लौटें', 'العودة إلى الرئيسية'],
    player: ['Your disc', '你的棋子', '你的棋子', 'あなたの駒', '내 말', 'Tu ficha', 'Sua peça', 'Votre pion', 'Dein Stein', 'La tua pedina', 'Ваша фишка', 'आपकी गोटी', 'قطعتك'],
    opponent: ['Opponent disc', '對手棋子', '对手棋子', '相手の駒', '상대 말', 'Ficha del rival', 'Peça do oponente', 'Pion adverse', 'Stein des Gegners', 'Pedina avversaria', 'Фишка соперника', 'प्रतिद्वंद्वी की गोटी', 'قطعة الخصم'],
    empty: ['Empty', '空格', '空格', '空き', '빈칸', 'Vacío', 'Vazio', 'Vide', 'Leer', 'Vuoto', 'Пусто', 'खाली', 'فارغ'],
    full: ['Column full', '這一欄已滿', '这一列已满', 'この列は満杯です', '가득 찬 열', 'Columna llena', 'Coluna cheia', 'Colonne pleine', 'Spalte voll', 'Colonna piena', 'Столбец заполнен', 'स्तंभ भरा है', 'العمود ممتلئ'],
  };
  const text = key => copy[key][Math.max(0, locales.indexOf(document.documentElement.lang))];
  let controller = null;
  const config = window.WPClassicLogic?.config?.[gameId];
  if (!config) return;
  config.onMount = mountFrame;
  config.onResult = (app, result) => controller?.result(result);

  function mountFrame(app, actions) {
    const root = app.root, main = app.main, battle = app.battle;
    const mainHeader = main.querySelector('header'), battleHeader = battle.querySelector('header');
    const mainContent = main.querySelector('.logic-hero'), content = battle.querySelector('.logic-battle-wrap');
    const guide = document.querySelector('.game-page-info-static');
    const localeSelect = main.querySelector('#localePicker');
    const leave = battle.querySelector('#logicLeave'), back = battleHeader.querySelector('[data-wp-return="battle"]');
    const start = main.querySelector('#startButton');
    const resultReplay = app.result.querySelector('#resultReplay'), resultMain = app.result.querySelector('#resultMenu');
    const resultClose = app.result.querySelector('#resultClose');
    const continueButton = leave.querySelector('#leaveContinue'), leaveButton = leave.querySelector('#leaveStages');
    const subscriptions = new AbortController();
    let scene = 'main', substate = 'live', pageSuspended = false, focusColumn = -1;
    let resultWon = false, resultOpenedAt = 0;
    const listen = (node, event, fn, options = {}) => node.addEventListener(event, fn, { ...options, signal: subscriptions.signal });

    // Declare permanent slots before the one shared frame mounts. The legacy
    // Settings component is detached; its locale routing select is retained.
    root.setAttribute('data-wp-frame-root', '');
    root.querySelector('.logic-lab').className = 'four-scenes';
    main.className = 'main-screen';
    mainContent.className = 'four-main-content';
    main.querySelector('.logic-guide')?.remove();
    mainHeader.querySelector('.logic-header-tools')?.remove();
    mainHeader.querySelector('h1').setAttribute('data-wp-frame-title', '');
    battleHeader.querySelector('h1').setAttribute('data-wp-frame-title', '');
    const poster = mainContent.querySelector('.logic-poster');
    poster.className = 'four-main-poster';
    poster.setAttribute('data-wp-frame-poster', '');
    poster.querySelector('img').alt = app.title;
    const mainCopy = mainContent.querySelector('.logic-copy');
    mainCopy.className = 'four-main-copy';
    mainCopy.setAttribute('data-wp-frame-copy', '');
    for (const selector of ['.logic-kicker', 'h2', '.logic-facts', '[data-wp-main-progress]']) mainCopy.querySelector(selector)?.remove();
    mainCopy.querySelector('p').setAttribute('data-wp-frame-summary', '');
    start.setAttribute('data-wp-frame-action', 'primary');
    // Four in a Row has no Stage or saved stage progression. The detached
    // shared Stage reference remains usable by its original transitions.
    app.stage.remove();
    app.tutorial.hidden = true;
    app.status.setAttribute('aria-atomic', 'true');
    app.board.setAttribute('role', 'group');
    app.board.setAttribute('aria-label', app.title);
    Object.assign(battle.dataset, { wpBattleMinWidth: '390', wpBattleMinHeight: '720', wpBattleLandscapeWidth: '760', wpBattleLandscapeHeight: '350' });
    const info = document.createElement('div'), stat = document.createElement('div');
    stat.append(app.battleChip); info.append(stat); content.append(info);
    const difficulty = document.createElement('div');
    difficulty.id = 'fourDifficulty'; difficulty.className = 'four-difficulty';
    content.append(difficulty);
    app.result.dataset.wpBattleSubstate = 'result';
    app.result.setAttribute('data-wp-result-screen', '');
    app.result.querySelector('.logic-result-card').setAttribute('data-wp-result-card', '');
    app.result.setAttribute('aria-describedby', 'logicResultText');
    // Keep the existing no-Stage Replay / Main / Close recovery actions.
    // Closing a Result reveals its frozen board for explicit Undo recovery.
    for (const id of ['resultStages', 'resultNext']) {
      const button = app.result.querySelector(`#${id}`);
      button.hidden = true; button.inert = true; button.tabIndex = -1;
      button.setAttribute('aria-hidden', 'true');
    }
    resultMain.textContent = text('main');
    leave.querySelector('#logicLeaveTitle').textContent = text('leaveTitle');
    const leaveText = leave.querySelector('p');
    leaveText.id = 'fourLeaveText'; leaveText.textContent = text('leaveText');
    leave.setAttribute('aria-describedby', leaveText.id);
    continueButton.textContent = text('continue'); leaveButton.textContent = text('main');
    for (const button of content.querySelectorAll('.logic-action-row button')) button.setAttribute('data-wp-frame-action', 'secondary');
    for (const button of [resultReplay, continueButton]) button.setAttribute('data-wp-frame-action', 'primary');
    for (const button of [resultMain, resultClose, leaveButton]) button.setAttribute('data-wp-frame-action', 'secondary');
    const frame = window.WeightPlayScreenFrame.mount({ root, localeSelect, scenes: {
      main: { root: main, header: mainHeader, content: mainContent },
      battle: { root: battle, header: battleHeader, content, headerInfo: info },
    } });
    const notifyCanvas = () => window.WeightPlayBattleCanvas?.sync?.();
    const canPlay = () => scene === 'battle' && substate === 'live' && !pageSuspended;
    function observeBoard() {
      observer.disconnect();
      if (canPlay()) observer.observe(app.board, { childList: true, subtree: true });
    }
    function activate(next, state = 'live') {
      // Clear an obtained marker while its owning Result is still visible.
      // The shared helper deliberately never searches inactive Results.
      if (state !== 'result' && !app.result.hidden) window.ShowResultGet?.(gameId, false);
      scene = next; substate = state; battle.dataset.fourSubstate = state;
      const covered = state === 'result' || state === 'leave';
      content.inert = covered; content.hidden = state === 'result';
      content.setAttribute('aria-hidden', String(covered));
      app.board.inert = state !== 'live';
      content.querySelector('#logicHint').disabled = state === 'review';
      app.result.hidden = state !== 'result'; leave.hidden = state !== 'leave';
      frame.activate(next, { covered });
      if (guide) {
        guide.hidden = next !== 'main'; guide.inert = next !== 'main';
        guide.setAttribute('aria-hidden', String(next !== 'main'));
      }
      observeBoard(); notifyCanvas();
    }
    function mainReturn() {
      observer.disconnect(); focusColumn = -1;
      if (!app.result.hidden) window.ShowResultGet?.(gameId, false);
      actions.showMain(); activate('main'); start.focus({ preventScroll: true });
    }
    function replay() {
      if (scene !== 'battle' || substate === 'leave') return;
      focusColumn = -1; activate('battle'); actions.replay(); decorate();
      app.board.querySelector('[data-four-column]')?.focus({ preventScroll: true });
    }
    function continuePlaying() {
      if (scene !== 'battle' || substate !== 'leave') return;
      activate('battle'); actions.getActiveGame()?.resume?.(); back.focus({ preventScroll: true });
    }
    function backFromBattle() {
      if (scene === 'battle' && substate === 'review') return mainReturn();
      if (!canPlay()) return;
      if (!app.board.querySelector('.disc')) return mainReturn();
      actions.getActiveGame()?.pause?.(); activate('battle', 'leave');
      continueButton.focus({ preventScroll: true });
    }
    function closeResult() {
      if (scene !== 'battle' || substate !== 'result') return;
      activate('battle', 'review');
      app.status.textContent = app.resultTitle.textContent;
      app.board.setAttribute('aria-busy', 'false');
      content.querySelector('#logicUndo').focus({ preventScroll: true });
    }
    // The original shared click subscriptions delegate to this single action
    // registry. No replacement return nodes or second navigation listeners.
    app.screenFlow = {
      start() {
        if (scene !== 'main') return;
        focusColumn = -1; actions.startGame(); activate('battle'); decorate();
        app.board.querySelector('[data-four-column]')?.focus({ preventScroll: true });
      },
      battleBack: backFromBattle,
      hint() { if (canPlay()) actions.getActiveGame()?.hint?.(); },
      undo() {
        if (scene === 'battle' && substate === 'review') activate('battle');
        if (canPlay()) { actions.getActiveGame()?.undo?.(); decorate(); }
      },
      reset() { if (canPlay() || (scene === 'battle' && substate === 'review')) replay(); },
      leaveContinue: continuePlaying,
      leaveStages() { if (substate === 'leave') mainReturn(); },
      resultReplay() { if (substate === 'result') replay(); },
      resultMenu() { if (substate === 'result') mainReturn(); },
      resultClose: closeResult,
    };
    controller = { result({ won } = {}) {
      if (!canPlay()) return;
      resultWon = Boolean(won); resultOpenedAt = Date.now();
      decorate(); actions.getActiveGame()?.pause?.(); activate('battle', 'result');
      window.ShowResultGet?.(gameId, false);
      resultReplay.focus({ preventScroll: true });
    } };
    listen(window, 'weightplay:castle-reward', event => {
      const reward = event.detail;
      if (pageSuspended || scene !== 'battle' || substate !== 'result' || app.result.hidden || !resultWon
        || reward?.gameId !== gameId || reward.completionId !== 'first-completion' || Number(reward.amount) <= 0) return;
      // Both canonical credit paths commit this receipt before emitting the
      // event. A delayed notification from an older round must be a no-op.
      try {
        const saved = JSON.parse(localStorage.getItem('weightplayCastleV1') || 'null');
        if (Number(saved?.completions?.[`${gameId}:${reward.completionId}`]) < resultOpenedAt) return;
        if (!saved?.completions?.[`${gameId}:${reward.completionId}`]) return;
      } catch { return; }
      window.ShowResultGet?.(gameId, true);
    });

    function decorate() {
      if (scene !== 'battle' || pageSuspended) return;
      const current = app.board.querySelector('.logic-connect-board');
      if (!current) { board = null; previous = []; return; }
      if (current !== board) { board = current; previous = []; }
      current.parentElement.classList.add('four-board-layout');
      const toolbar = current.parentElement.querySelector('.logic-board-toolbar');
      if (toolbar) difficulty.replaceChildren(toolbar);
      const cells = [...board.children];
      if (cells.length !== 42) return;
      const values = cells.map(c => c.classList.contains('red') ? 1 : c.classList.contains('yellow') ? 2 : 0);
      app.board.setAttribute('aria-busy', String(substate === 'live' && values.filter(v => v === 1).length > values.filter(v => v === 2).length));
      cells.forEach((cell, index) => {
        const column = index % 7, full = Boolean(values[column]);
        cell.dataset.column = String(column);
        cell.tabIndex = -1;
        cell.setAttribute('aria-disabled', String(full));
        const location = cell.getAttribute('aria-label').split(' · ')[0];
        cell.setAttribute('aria-label', `${location} · ${text(values[index] === 1 ? 'player' : values[index] === 2 ? 'opponent' : 'empty')}${full ? ` · ${text('full')}` : ''}`);
        if (previous.length && values[index] && !previous[index]) {
          cell.classList.add('disc-arrived');
          cell.style.setProperty('--drop-distance', `${-(Math.floor(index / 7) + 1) * cell.offsetHeight}px`);
        }
      });
      // One persistent row of seven explicit column targets supplements the
      // original native board. It forwards into the existing engine handler.
      let columns = current.parentElement.querySelector('.four-column-actions');
      if (!columns) {
        columns = document.createElement('div'); columns.className = 'four-column-actions';
        for (let column = 0; column < 7; column++) {
          const button = document.createElement('button'); button.type = 'button';
          button.textContent = String(column + 1); button.dataset.fourColumn = String(column);
          button.setAttribute('data-wp-frame-action', 'secondary');
          columns.append(button);
        }
        current.before(columns);
      }
      [...columns.children].forEach((button, column) => {
        button.disabled = Boolean(values[column]);
        button.setAttribute('aria-label', cells[column].getAttribute('aria-label'));
      });
      for (let r = 0; r < 6; r++) for (let c = 0; c < 7; c++) {
        if (!values[r * 7 + c]) continue;
        for (const [dr, dc] of [[0, 1], [1, 0], [1, 1], [1, -1]]) {
          const line = Array.from({ length: 4 }, (_, k) => [r + dr * k, c + dc * k]);
          if (line.every(([y, x]) => y >= 0 && y < 6 && x >= 0 && x < 7 && values[y * 7 + x] === values[r * 7 + c])) {
            line.forEach(([y, x]) => cells[y * 7 + x].classList.add('winning-disc'));
          }
        }
      }
      previous = values;
      if (canPlay() && focusColumn >= 0 && document.activeElement === document.body) {
        const open = [...columns.children].filter(button => !button.disabled);
        (open.find(button => Number(button.dataset.fourColumn) >= focusColumn) || open[0])?.focus({ preventScroll: true });
      }
    }
    // The bounded existing board observer changes only piece presentation and
    // accessibility. Scene/Result visibility comes from explicit callbacks.
    const observer = new MutationObserver(() => { if (canPlay()) decorate(); });
    listen(app.board, 'click', event => {
      const column = event.target.closest('[data-four-column]');
      const cell = event.target.closest('.logic-cell');
      if (canPlay() && cell) focusColumn = Number(cell.dataset.column);
      if (!canPlay() || !column || column.disabled) return;
      focusColumn = Number(column.dataset.fourColumn);
      app.board.querySelector('.logic-connect-board')?.children[focusColumn]?.click();
    });
    listen(document, 'keydown', event => {
      if (scene !== 'battle') return;
      const dialog = substate === 'leave' ? leave : substate === 'result' ? app.result : null;
      if (dialog) {
        if (event.key === 'Escape') { event.preventDefault(); if (substate === 'leave') continuePlaying(); else closeResult(); return; }
        if (event.key !== 'Tab') return;
        const buttons = [...dialog.querySelectorAll('button')].filter(b => !b.hidden && !b.disabled && !b.inert);
        const first = buttons[0], last = buttons[buttons.length - 1];
        if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
        return;
      }
      const column = event.target.closest?.('[data-four-column]');
      if (!canPlay() || !column || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const open = [...column.parentElement.children].filter(button => !button.disabled);
      const index = open.indexOf(column);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? open.length - 1 : Math.max(0, Math.min(open.length - 1, index + (event.key === 'ArrowRight' ? 1 : -1)));
      focusColumn = Number(open[next]?.dataset.fourColumn ?? -1);
      open[next]?.focus({ preventScroll: true });
    });
    listen(window, 'pagehide', () => {
      pageSuspended = true; observer.disconnect(); actions.getActiveGame()?.pause?.(); frame.close();
    });
    listen(window, 'pageshow', () => {
      if (!pageSuspended) return;
      pageSuspended = false; activate(scene, substate);
      if (canPlay()) { actions.getActiveGame()?.resume?.(); decorate(); }
    });
    activate('main');
  }
  let board = null;
  let previous = [];
  const start = () => window.WPClassicLogic.mount(gameId);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
