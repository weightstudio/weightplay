(() => {
  'use strict';
  const GAME_ID = 'animal-tangram';
  const LOCALES = ['en','zh-Hant','zh-Hans','ja','ko','es','pt-BR','fr','de','it','ru','hi','ar'];
  const LEVELS = window.TANGRAM_LEVELS.levels;
  const PIECES = window.TANGRAM_LEVELS.pieces;
  const PARTS = PIECES.map((piece) => piece.id);
  const $ = (selector) => document.querySelector(selector);
  const storageKey = 'wp-animal-tangram-v1';
  const read = (key) => { try { return localStorage.getItem(key); } catch { return null; } };
  const write = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
  let locale = read('wp-locale') || 'en';
  if (!LOCALES.includes(locale)) locale = 'en';
  let unlocked = Number(read(storageKey)) || 1;
  let selected = Math.max(0, Math.min(29, Math.min(unlocked, 30) - 1));
  let level = null;
  let states = [];
  let moves = 0;
  let drag = null;
  let resultTimer = 0;
  let resultSettled = false;
  let leaveOpen = false;
  let leaveTrigger = null;
  let stageUI = null;
  let screenFrame = null;
  let stageStats = null;
  let battleStats = null;
  let toastTimer = 0;
  const measurement = { screen: null, roundKey: null, started: false, ended: false, restart: false, outcome: 'complete' };

  const animalNames = {
    en:['Turtle','Cat','Bird','Fox','Fish','Rabbit'], 'zh-Hant':['海龜','小貓','小鳥','狐狸','小魚','兔子'], 'zh-Hans':['海龟','小猫','小鸟','狐狸','小鱼','兔子'],
    ja:['カメ','ネコ','トリ','キツネ','サカナ','ウサギ'], ko:['거북이','고양이','새','여우','물고기','토끼'], es:['Tortuga','Gato','Ave','Zorro','Pez','Conejo'],
    'pt-BR':['Tartaruga','Gato','Ave','Raposa','Peixe','Coelho'], fr:['Tortue','Chat','Oiseau','Renard','Poisson','Lapin'], de:['Schildkröte','Katze','Vogel','Fuchs','Fisch','Hase'],
    it:['Tartaruga','Gatto','Uccello','Volpe','Pesce','Coniglio'], ru:['Черепаха','Кошка','Птица','Лиса','Рыба','Кролик'], hi:['कछुआ','बिल्ली','पक्षी','लोमड़ी','मछली','खरगोश'], ar:['سلحفاة','قطة','طائر','ثعلب','سمكة','أرنب']
  };
  const navigationCopy = {
    en:{stages:'Stages',leaveTitle:'Leave this shape?',leaveBody:'Your current piece positions will be reset.',keepPlaying:'Keep playing',leaveStage:'Leave to stages'},
    'zh-Hant':{stages:'關卡',leaveTitle:'要離開這個拼圖嗎？',leaveBody:'目前的拼圖片位置將會重設。',keepPlaying:'繼續遊戲',leaveStage:'離開到關卡'},
    'zh-Hans':{stages:'关卡',leaveTitle:'要离开这个拼图吗？',leaveBody:'当前的拼图片位置将会重置。',keepPlaying:'继续游戏',leaveStage:'离开到关卡'},
    ja:{stages:'ステージ',leaveTitle:'このパズルを離れますか？',leaveBody:'現在のピース位置はリセットされます。',keepPlaying:'続ける',leaveStage:'ステージへ戻る'},
    ko:{stages:'스테이지',leaveTitle:'이 퍼즐을 나갈까요?',leaveBody:'현재 조각 위치가 초기화됩니다.',keepPlaying:'계속하기',leaveStage:'스테이지로 나가기'},
    es:{stages:'Niveles',leaveTitle:'¿Salir de esta figura?',leaveBody:'Se restablecerán las posiciones actuales.',keepPlaying:'Seguir jugando',leaveStage:'Salir a niveles'},
    'pt-BR':{stages:'Fases',leaveTitle:'Sair desta forma?',leaveBody:'As posições atuais serão reiniciadas.',keepPlaying:'Continuar jogando',leaveStage:'Sair para fases'},
    fr:{stages:'Niveaux',leaveTitle:'Quitter cette forme ?',leaveBody:'Les positions actuelles seront réinitialisées.',keepPlaying:'Continuer',leaveStage:'Quitter vers les niveaux'},
    de:{stages:'Level',leaveTitle:'Diese Form verlassen?',leaveBody:'Die aktuellen Teilepositionen werden zurückgesetzt.',keepPlaying:'Weiterspielen',leaveStage:'Zu den Leveln'},
    it:{stages:'Livelli',leaveTitle:'Uscire da questa forma?',leaveBody:'Le posizioni attuali verranno ripristinate.',keepPlaying:'Continua',leaveStage:'Vai ai livelli'},
    ru:{stages:'Уровни',leaveTitle:'Выйти из этой фигуры?',leaveBody:'Текущие позиции деталей будут сброшены.',keepPlaying:'Продолжить',leaveStage:'К уровням'},
    hi:{stages:'स्तर',leaveTitle:'इस आकृति से बाहर जाएँ?',leaveBody:'मौजूदा टुकड़ों की जगह रीसेट हो जाएगी।',keepPlaying:'खेलते रहें',leaveStage:'स्तरों पर जाएँ'},
    ar:{stages:'المراحل',leaveTitle:'مغادرة هذا الشكل؟',leaveBody:'ستتم إعادة ضبط مواضع القطع الحالية.',keepPlaying:'متابعة اللعب',leaveStage:'العودة للمراحل'}
  };
  const coachCopy = {
    en:'1 Drag to the same-color shadow. 2 Tap to turn.', 'zh-Hant':'1 拖到同色影子　2 點一下旋轉', 'zh-Hans':'1 拖到同色影子　2 点一下旋转',
    ja:'1 同じ色の影へドラッグ　2 タップで回転', ko:'1 같은 색 그림자로 끌기　2 탭해서 회전', es:'1 Arrastra a la sombra del mismo color. 2 Toca para girar.',
    'pt-BR':'1 Arraste até a sombra da mesma cor. 2 Toque para girar.', fr:'1 Glisse vers l’ombre de même couleur. 2 Touche pour tourner.',
    de:'1 Ziehe zum Schatten gleicher Farbe. 2 Tippe zum Drehen.', it:'1 Trascina sull’ombra dello stesso colore. 2 Tocca per ruotare.',
    ru:'1 Перетащи на тень того же цвета. 2 Нажми, чтобы повернуть.', hi:'1 उसी रंग की छाया तक खींचें। 2 घुमाने के लिए टैप करें।', ar:'1 اسحب إلى الظل من اللون نفسه. 2 اضغط للتدوير.'
  };

  function t(key, values = {}) {
    const dictionary = window.TANGRAM_LOCALES[locale] || window.TANGRAM_LOCALES.en;
    const value = dictionary[key] ?? window.TANGRAM_LOCALES.en[key] ?? key;
    return String(value).replace(/\{(\w+)\}/gu, (_whole, name) => values[name] ?? '');
  }
  function track(event, details = {}) {
    window.WonderAnalytics?.track?.(event, { game_id: GAME_ID, locale, stage: selected + 1, ...details });
  }
  function notifyMeasurement() {
    try {
      window.WonderAnalytics?.game?.observeState?.(() => ({
        ...measurement,
        screen: measurement.screen === 'battle' && measurement.ended ? null : measurement.screen,
        ended: Boolean(measurement.ended), outcome: measurement.outcome,
        paused: Boolean(leaveOpen), node: document.body, activityMode: 'input', idleSeconds: 300
      }));
    } catch { /* Measurement never controls gameplay. */ }
  }
  function setMeasurementScreen(name) {
    if ((name === 'main' || name === 'stage') && measurement.screen === 'battle' && measurement.started && !measurement.ended) {
      measurement.ended = true;
      measurement.outcome = 'abandon';
    }
    measurement.screen = name;
    notifyMeasurement();
  }
  window.addEventListener('weightplay:analytics-ready', notifyMeasurement);

  function nameFor(index) { return (animalNames[locale] || animalNames.en)[index % 6]; }
  function posterFor(index) { return '/assets/animal-tangram/stage-posters/shape-' + String(index + 1).padStart(2, '0') + '.svg'; }
  function makeStat() {
    const stat = document.createElement('div');
    const label = document.createElement('span');
    const value = document.createElement('strong');
    stat.append(label, value);
    return { stat, label, value };
  }
  function updateHud() {
    const chapter = Math.floor(selected / 5) + 1;
    const done = Math.min(unlocked - 1, LEVELS.length);
    if (stageStats) {
      stageStats.chapter.label.textContent = t('chapter', { n: chapter });
      stageStats.chapter.value.textContent = t('shape', { n: selected + 1 });
      stageStats.progress.label.textContent = t('doneLabel');
      stageStats.progress.value.textContent = done + '/' + LEVELS.length;
    }
    if (battleStats) {
      battleStats.chapter.label.textContent = t('chapter', { n: chapter });
      battleStats.chapter.value.textContent = t('shape', { n: selected + 1 });
      battleStats.placed.label.textContent = t('placed', { done: states.filter((state) => state.placed).length });
      battleStats.placed.value.textContent = String(PIECES.length);
    }
  }
  function stageConfig() {
    return {
      gameId: GAME_ID, count: LEVELS.length, poster: '/assets/animal-tangram/cover-block-v1.png',
      background: '/assets/lobby-block-atmosphere.svg',
      stage(index) {
        const isLocked = index + 1 > unlocked;
        const cleared = index + 1 < unlocked || unlocked > LEVELS.length;
        return {
          id: index + 1,
          kicker: t('chapter', { n: Math.floor(index / 5) + 1 }),
          title: t('shape', { n: index + 1 }),
          subtitle: nameFor(index),
          status: isLocked ? t('locked') : cleared ? t('complete') : t('open'),
          summary: t('summary'),
          details: [t('guideBody'), t('pieceLabel', { n: PIECES.length })],
          poster: posterFor(index), locked: isLocked, cleared
        };
      }
    };
  }
  function mountSharedInterface() {
    if (!window.WeightPlayScreenFrame || !window.WeightPlayPlayUI || !window.WeightPlayStageRailI9) {
      throw new Error('ANIMAL_TANGRAM_I9_SHARED_RUNTIME_MISSING');
    }
    screenFrame = window.WeightPlayScreenFrame.mount({
      root: $('#gameFrame'), localeSelect: $('#localeSelect'), playUI: true,
      scenes: {
        main: { root: $('#mainScreen'), header: $('#mainHeader'), content: $('#mainContent') },
        stage: { root: $('#stageScreen'), header: $('#stageHeader'), content: $('#stageWorkspace') },
        battle: { root: $('#battleScreen'), header: $('#battleHeader'), content: $('#battleWorkspace') }
      }
    });
    stageStats = { chapter: makeStat(), progress: makeStat() };
    screenFrame.stageTopUI.add(window.WeightPlayScreenFrame.createGroup().add(stageStats.chapter.stat).add(stageStats.progress.stat));
    battleStats = { chapter: makeStat(), placed: makeStat() };
    screenFrame.battleTopUI.add(window.WeightPlayScreenFrame.createGroup().add(battleStats.chapter.stat).add(battleStats.placed.stat));
    stageUI = window.WeightPlayPlayUI.mountStage({
      page: $('#stageWorkspace'), rail: $('#stageRail'), config: stageConfig(), selected,
      onSelect(index) { selected = index; updateHud(); },
      onStart(index) { startLevel(index); },
      isActive: () => screenFrame.active === 'stage' && !$('#stageScreen').hidden
    });
    updateHud();
  }
  function setBattleCovered(covered) {
    $('#battleHeader').inert = covered;
    $('#battleHeader').setAttribute('aria-hidden', String(covered));
    ['#objectiveBar', '#board', '.tools'].forEach((selector) => {
      const node = $(selector);
      node.inert = covered;
      node.setAttribute('aria-hidden', String(covered));
    });
  }
  function closeLeave(restore = false) {
    if (!leaveOpen) return;
    leaveOpen = false;
    $('#leavePanel').hidden = true;
    $('#leavePanel').inert = true;
    setBattleCovered(false);
    const trigger = leaveTrigger;
    leaveTrigger = null;
    if (restore && trigger?.isConnected) requestAnimationFrame(() => trigger.focus({ preventScroll: true }));
    notifyMeasurement();
  }
  function showScreen(name) {
    closeResult(false);
    closeLeave(false);
    $('#mainGroup').hidden = name !== 'main';
    $('#mainGroup').inert = name !== 'main';
    $('#stageScreen').hidden = name !== 'stage';
    $('#battleScreen').hidden = name !== 'battle';
    document.body.dataset.screen = name;
    screenFrame.activate(name);
    if (name === 'stage') {
      stageUI.refresh(selected);
      updateHud();
      window.dispatchEvent(new Event('weightplay:stage-sync'));
    }
    window.dispatchEvent(new Event('weightplay:battle-sync'));
    window.dispatchEvent(new Event('weightplay:shell-sync'));
    setMeasurementScreen(name);
  }
  function showMain(focus = false) {
    showScreen('main');
    renderMainProgress();
    if (focus) requestAnimationFrame(() => $('#start').focus({ preventScroll: true }));
  }
  function showStage({ focus = false, newest = false } = {}) {
    if (newest) selected = Math.max(0, Math.min(29, Number(unlocked) - 1));
    showScreen('stage');
    stageUI.select(selected, { center: true, focus, source: 'return' });
  }
  function renderMainProgress() {
    $('#mainProgress').textContent = t('progress', { done: Math.min(unlocked - 1, LEVELS.length) });
  }
  function applyLocale() {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    $('#localeSelect').value = locale;
    document.querySelectorAll('[data-t]').forEach((node) => { node.textContent = t(node.dataset.t); });
    document.querySelectorAll('[data-t-aria]').forEach((node) => node.setAttribute('aria-label', t(node.dataset.tAria)));
    document.querySelectorAll('[data-t-alt]').forEach((node) => node.setAttribute('alt', t(node.dataset.tAlt)));
    document.title = t('title') + ' | WeightPlay';
    $('#resultStages').textContent = navigationCopy[locale]?.stages || navigationCopy.en.stages;
    $('#leaveTitle').textContent = navigationCopy[locale]?.leaveTitle || navigationCopy.en.leaveTitle;
    $('#leaveBody').textContent = navigationCopy[locale]?.leaveBody || navigationCopy.en.leaveBody;
    $('#leaveContinue').textContent = navigationCopy[locale]?.keepPlaying || navigationCopy.en.keepPlaying;
    $('#leaveStages').textContent = navigationCopy[locale]?.leaveStage || navigationCopy.en.leaveStage;
    renderMainProgress();
    stageUI?.setConfig(stageConfig(), selected);
    if (level && !$('#battleScreen').hidden) renderBoard();
    updateHud();
    window.dispatchEvent(new CustomEvent('wonder:locale-change', { detail: { locale } }));
  }
  function startLevel(index, replay = false) {
    selected = Math.max(0, Math.min(LEVELS.length - 1, index));
    level = LEVELS[selected];
    const tray = [[.14,.82],[.42,.82],[.72,.82],[.12,.94],[.31,.94],[.53,.94],[.78,.94]];
    states = PIECES.map((_piece, i) => ({ x: tray[i][0], y: tray[i][1], r: 0, placed: false }));
    moves = 0;
    resultSettled = false;
    if (stageUI) stageUI.select(selected, { center: false, notify: false, source: 'battle' });
    $('#animalGoal').textContent = nameFor(selected);
    $('#status').textContent = coachCopy[locale] || coachCopy.en;
    showScreen('battle');
    renderBoard();
    updateHud();
    requestAnimationFrame(() => $('.piece:not(.placed)')?.focus({ preventScroll: true }));
    measurement.roundKey = {};
    measurement.restart = Boolean(replay);
    measurement.started = true;
    measurement.ended = false;
    measurement.outcome = 'complete';
    measurement.screen = 'battle';
    notifyMeasurement();
    track(replay ? 'game_restart' : 'game_start', { chapter: Math.floor(selected / 5) + 1 });
  }
  function position(element, x, y, rotation) {
    element.style.left = (x * 100) + '%';
    element.style.top = (y * 100) + '%';
    element.style.transform = 'translate(-50%,-50%) rotate(' + rotation + 'deg)';
  }
  function createShape(className, index, target) {
    const element = document.createElement('div');
    element.className = className + ' ' + PARTS[index];
    element.dataset.shape = PARTS[index];
    position(element, target.x, target.y, target.r);
    return element;
  }
  function renderBoard(focusIndex = null) {
    if (!level) return;
    const targets = $('#targets');
    const pieces = $('#pieces');
    targets.replaceChildren();
    pieces.replaceChildren();
    level.targets.forEach((target, index) => targets.append(createShape('target-piece', index, target)));
    states.forEach((state, index) => {
      const piece = document.createElement('button');
      piece.type = 'button';
      piece.className = 'piece ' + PARTS[index] + (state.placed ? ' placed' : '');
      piece.dataset.shape = PARTS[index];
      piece.dataset.index = String(index);
      piece.setAttribute('aria-label', t('pieceLabel', { n: index + 1 }));
      piece.setAttribute('aria-pressed', String(state.placed));
      piece.draggable = false;
      position(piece, state.x, state.y, state.r);
      piece.addEventListener('pointerdown', (event) => begin(index, event));
      piece.addEventListener('pointermove', move);
      piece.addEventListener('pointerup', finish);
      piece.addEventListener('pointercancel', finish);
      piece.addEventListener('click', (event) => { if (event.detail === 0) rotatePiece(index); });
      pieces.append(piece);
    });
    updateHud();
    if (focusIndex !== null) requestAnimationFrame(() => $('[data-index="' + focusIndex + '"]')?.focus({ preventScroll: true }));
  }
  function begin(index, event) {
    if (event.isPrimary === false || (event.button ?? 0) !== 0) return;
    event.preventDefault();
    const state = states[index];
    state.placed = false;
    drag = { index, pointer: event.pointerId, x: event.clientX, y: event.clientY, startX: state.x, startY: state.y, moved: false };
    event.currentTarget.setPointerCapture?.(event.pointerId);
    event.currentTarget.classList.remove('placed');
    $('.target-piece[data-shape="' + PARTS[index] + '"]')?.classList.add('active-target');
  }
  function move(event) {
    if (!drag || event.pointerId !== drag.pointer) return;
    const rect = $('#board').getBoundingClientRect();
    const state = states[drag.index];
    state.x = Math.max(.07, Math.min(.93, drag.startX + (event.clientX - drag.x) / rect.width));
    state.y = Math.max(.07, Math.min(.93, drag.startY + (event.clientY - drag.y) / rect.height));
    drag.moved = true;
    if (event.cancelable) event.preventDefault();
    const piece = $('[data-index="' + drag.index + '"]');
    if (piece) position(piece, state.x, state.y, state.r);
  }
  function rotatePiece(index) {
    if (states[index].placed) return;
    states[index].r = (states[index].r + 45) % 360;
    $('#status').textContent = coachCopy[locale] || coachCopy.en;
    renderBoard(index);
  }
  function finish(event) {
    if (!drag || (event?.pointerId !== undefined && event.pointerId !== drag.pointer)) return;
    const index = drag.index;
    const state = states[index];
    const target = level.targets[index];
    const angle = Math.abs(((state.r - target.r + 540) % 360) - 180);
    const distance = Math.hypot(state.x - target.x, state.y - target.y);
    const moved = drag.moved;
    drag = null;
    $('.target-piece.active-target')?.classList.remove('active-target');
    if (!moved) rotatePiece(index);
    else if (distance < .075 && angle <= 1) {
      state.x = target.x;
      state.y = target.y;
      state.r = target.r;
      state.placed = true;
      moves += 1;
      $('#status').textContent = t('snap');
      renderBoard();
      checkComplete();
    } else {
      $('#status').textContent = t('wrong');
      renderBoard(index);
    }
  }
  function checkComplete() {
    if (!states.length || !states.every((state) => state.placed)) return;
    if (selected + 2 > unlocked) {
      unlocked = Math.min(31, selected + 2);
      write(storageKey, String(unlocked));
    }
    $('#resultBody').textContent = t('resultBody', { n: selected + 1, moves });
    const terminal = selected === LEVELS.length - 1;
    $('#next').textContent = terminal ? t('allDone') : t('next');
    $('#next').disabled = terminal;
    $('#next').setAttribute('aria-disabled', String(terminal));
    $('#next').classList.toggle('primary-action', !terminal);
    $('#next').dataset.wpFrameAction = terminal ? 'secondary' : 'primary';
    $('#resultStages').classList.toggle('primary-action', terminal);
    $('#resultStages').dataset.wpFrameAction = terminal ? 'primary' : 'secondary';
    $('#retry').classList.remove('primary-action');
    $('#retry').dataset.wpFrameAction = 'secondary';
    resultTimer = setTimeout(openResult, 180);
    renderMainProgress();
    track('game_complete', { moves });
  }
  function openResult() {
    if (!states.length || !states.every((state) => state.placed)) return;
    $('#battleScreen').dataset.wpBattleSubstate = 'result';
    $('#resultPanel').hidden = false;
    $('#resultPanel').inert = false;
    setBattleCovered(true);
    measurement.ended = true;
    measurement.outcome = 'complete';
    notifyMeasurement();
    requestAnimationFrame(() => ($('#resultPanel .primary-action') || $('#resultStages')).focus({ preventScroll: true }));
  }
  function showLeave() {
    if (leaveOpen || !level || !$('#resultPanel').hidden) return;
    if (!moves) { showStage({ focus: true }); return; }
    leaveTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    leaveOpen = true;
    $('#leavePanel').hidden = false;
    $('#leavePanel').inert = false;
    setBattleCovered(true);
    notifyMeasurement();
    requestAnimationFrame(() => $('#leaveContinue').focus({ preventScroll: true }));
  }
  function trapFocus(event, panel) {
    if (event.key === 'Escape' && panel === $('#leavePanel')) { event.preventDefault(); closeLeave(true); return; }
    if (event.key !== 'Tab') return;
    const actions = [...panel.querySelectorAll('button:not(:disabled)')].filter((node) => node.getClientRects().length);
    if (!actions.length) return;
    const first = actions[0], last = actions[actions.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
  function reset() {
    if (!level || leaveOpen || !$('#resultPanel').hidden) return;
    startLevel(selected, true);
    track('restart');
  }
  function hint() {
    if (!level || leaveOpen || !$('#resultPanel').hidden) return;
    const index = states.findIndex((state) => !state.placed);
    if (index < 0) return;
    const target = level.targets[index];
    states[index] = { x: target.x, y: target.y, r: target.r, placed: true };
    moves += 1;
    $('#status').textContent = t('snap');
    renderBoard();
    checkComplete();
  }
  function showToast(message) {
    clearTimeout(toastTimer);
    $('#toast').textContent = message;
    $('#toast').hidden = false;
    toastTimer = setTimeout(() => { $('#toast').hidden = true; }, 1800);
  }
  function settleResult(action) {
    if (resultSettled || $('#resultPanel').hidden) return;
    resultSettled = true;
    closeResult(false);
    action();
  }
  function closeResult(restore = false) {
    clearTimeout(resultTimer);
    resultTimer = 0;
    $('#resultPanel').hidden = true;
    $('#resultPanel').inert = true;
    $('#battleScreen').removeAttribute('data-wp-battle-substate');
    setBattleCovered(false);
    if (restore && $('#battleScreen').getClientRects().length) requestAnimationFrame(() => $('#battleBackBtn').focus({ preventScroll: true }));
  }
  function waitForEntryLoader() {
    const loader = window.WeightPlayGameEntryLoader;
    if (loader?.begin && loader?.ready) return Promise.resolve(loader);
    const script = document.querySelector('script[data-wp-game-entry-loader-bootstrap="true"]');
    if (!script) return Promise.resolve(loader || null);
    return new Promise((resolve) => {
      let settled = false;
      const done = () => { if (settled) return; settled = true; resolve(window.WeightPlayGameEntryLoader || null); };
      script.addEventListener('load', done, { once: true });
      script.addEventListener('error', done, { once: true });
      if (window.WeightPlayGameEntryLoader?.begin) done();
    });
  }
  function preloadAssets() {
    const assets = [
      '../../assets/animal-tangram/cover-block-v1.png', '../../assets/animal-tangram/panko-block-v1.png',
      '../../assets/animal-tangram/piece-large-a-block-v1.png', '../../assets/animal-tangram/piece-large-b-block-v1.png',
      '../../assets/animal-tangram/piece-medium-block-v1.png', '../../assets/animal-tangram/piece-small-a-block-v1.png',
      '../../assets/animal-tangram/piece-small-b-block-v1.png', '../../assets/animal-tangram/piece-square-block-v1.png',
      '../../assets/animal-tangram/piece-parallelogram-block-v1.png'
    ];
    return waitForEntryLoader().then((loader) => {
      loader?.begin?.(assets.length);
      let loaded = 0, failed = 0;
      return Promise.all(assets.map((src) => new Promise((resolve) => {
        const image = new Image();
        const complete = (ok) => { if (!ok) failed += 1; loaded += 1; loader?.assetProgress?.(loaded, assets.length); resolve(); };
        image.onload = () => complete(true);
        image.onerror = () => complete(false);
        image.src = src;
      }))).then(() => ({ loader, failed }));
    });
  }
  function boot() {
    mountSharedInterface();
    applyLocale();
    renderMainProgress();
    showScreen('main');
    window.WonderI18n?.setLocale?.(locale, { navigate: false });
  }
  $('#start').addEventListener('click', () => showStage({ focus: true }));
  $('#stageBackBtn').addEventListener('click', () => showMain(true));
  $('#battleBackBtn').addEventListener('click', showLeave);
  $('#hint').addEventListener('click', hint);
  $('#reset').addEventListener('click', reset);
  $('#resultStages').addEventListener('click', () => settleResult(() => showStage({ focus: true, newest: true })));
  $('#retry').addEventListener('click', () => settleResult(() => startLevel(selected, true)));
  $('#next').addEventListener('click', () => { if (!$('#next').disabled) settleResult(() => startLevel(selected + 1)); });
  $('#leaveContinue').addEventListener('click', () => closeLeave(true));
  $('#leaveStages').addEventListener('click', () => { closeLeave(false); showStage({ focus: true }); });
  $('#resultPanel').addEventListener('keydown', (event) => trapFocus(event, $('#resultPanel')));
  $('#leavePanel').addEventListener('keydown', (event) => trapFocus(event, $('#leavePanel')));
  $('#localeSelect').addEventListener('change', (event) => {
    locale = LOCALES.includes(event.target.value) ? event.target.value : 'en';
    write('wp-locale', locale);
    applyLocale();
    window.WonderI18n?.setLocale?.(locale, { navigate: false });
  });
  applyLocale();
  preloadAssets().then(({ loader, failed }) => {
    if (failed) { loader?.fail?.(); showToast('Some tangram artwork could not be loaded.'); return; }
    boot();
    track('game_view', { release: 'public', interface_version: 9 });
    loader?.ready?.();
  }).catch(() => window.WeightPlayGameEntryLoader?.fail?.());
})();
