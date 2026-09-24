/* Owner-requested v13: deduction tools, finite motion and guide retention, 2026-09-23.
   One game controller. Shared frame, Stage virtualizer and Canvas still own
   navigation geometry. No target permutation is displayed or checked. */
(() => {
  'use strict';
  const gameURL = document.currentScript.src;
  const revision = '20260923-layer-v13';
  const root = document.body;
  const abort = new AbortController();
  const listen = (node, event, fn, options = {}) => node?.addEventListener(event, fn, { ...options, signal: abort.signal });
  const $ = id => document.getElementById(id);
  const scripts = new Map();
  const load = (path, ready) => {
    if (ready()) return Promise.resolve();
    const url = new URL(path, gameURL); url.searchParams.set('v', revision);
    if (scripts.has(url.pathname)) return scripts.get(url.pathname);
    const promise = new Promise((resolve, reject) => {
      const old = [...document.scripts].find(s => new URL(s.src || gameURL).pathname === url.pathname);
      const script = old || document.createElement('script');
      const done = () => { cleanup(); ready() ? resolve() : reject(new Error('DEPENDENCY_NOT_READY')); };
      const failed = () => { cleanup(); if (!old) script.remove(); reject(new Error('DEPENDENCY_LOAD_FAILED')); };
      const cleanup = () => { clearTimeout(timer); script.removeEventListener('load', done); script.removeEventListener('error', failed); abort.signal.removeEventListener('abort', failed); };
      const timer = setTimeout(failed, 10000);
      script.addEventListener('load', done, { once: true }); script.addEventListener('error', failed, { once: true });
      abort.signal.addEventListener('abort', failed, { once: true });
      if (!old) { script.src = url.href; document.head.append(script); }
      else if (ready()) done();
    }).catch(error => { scripts.delete(url.pathname); throw error; });
    scripts.set(url.pathname, promise); return promise;
  };
  // Remove obsolete Main-only decoration before the shared normalizer mounts.
  $('mainScreen').querySelectorAll('.keeper-guide,.best-line,.guide-card').forEach(n => n.remove());
  // Locale refresh must never replace the shared permanent arrow children.
  for (const id of ['stageBackBtn', 'battleBackBtn']) {
    const back = $(id); back.removeAttribute('data-copy');
    if (!back.querySelector('span')) { const arrow = document.createElement('span'); arrow.textContent = '←'; arrow.setAttribute('aria-hidden', 'true'); back.replaceChildren(arrow); }
  }
  $('startBtn').disabled = true;
  Promise.all([
    load('puzzle-engine.js', () => Boolean(window.LayerGrovePuzzle)),
    load('puzzle-copy.js', () => Boolean(window.LayerGroveCopy)),
    load('motion.js', () => Boolean(window.LayerGroveMotion)),
  ]).then(() => load('guide-extension.js', () => Boolean(window.LayerGroveCopy?.en?.guideFaqTitle))).then(boot).catch(error => {
    if (abort.signal.aborted) return;
    console.error('Layer Grove initialization failed', error);
    const locale = document.documentElement.lang;
    const messages = { en: 'Loading failed. Reload the page.', 'zh-Hant': '載入失敗，請重新整理。', 'zh-Hans': '加载失败，请刷新。', ja: '読み込み失敗。再読み込みしてください。', ko: '불러오기 실패. 새로고침하세요.', es: 'Error al cargar. Recarga la página.', 'pt-BR': 'Falha ao carregar. Recarregue a página.', fr: 'Échec du chargement. Rechargez la page.', de: 'Laden fehlgeschlagen. Seite neu laden.', it: 'Caricamento fallito. Ricarica la pagina.', ru: 'Ошибка загрузки. Обновите страницу.', hi: 'लोड नहीं हुआ। पृष्ठ दोबारा खोलें।', ar: 'تعذر التحميل. أعد تحميل الصفحة.' };
    $('loadingScreen').classList.add('is-ready'); $('mainProgress').textContent = messages[locale] || messages.en;
  });
  function boot() {
    if (abort.signal.aborted) return;
    const E = window.LayerGrovePuzzle, catalogs = window.LayerGroveCopy, oldLocales = window.ANIMAL_LAYER_GROVE_LOCALES || {};
    const motion = window.LayerGroveMotion.create();
    const levels = E.levels, symbols = ['▲', '●', '◆', '✚', '★'];
    const saveKey = 'weightplay-animal-layer-grove-occlusion-v1';
    let record = { schema: 1, completed: 0, best: {}, stars: {} };
    try {
      const saved = JSON.parse(localStorage.getItem(saveKey));
      if (saved?.schema === 1) {
        if (Number.isInteger(saved.completed)) record.completed = Math.max(0, Math.min(levels.length, saved.completed));
        for (let i = 0; i < levels.length; i += 1) {
          if (Number.isInteger(saved.best?.[i]) && saved.best[i] > 0 && saved.best[i] <= 1000000) record.best[i] = saved.best[i];
          if (Number.isInteger(saved.stars?.[i]) && saved.stars[i] >= 1 && saved.stars[i] <= 3) record.stars[i] = saved.stars[i];
        }
      }
    } catch { /* Storage is optional; retain this session's record. */ }
    const pickLocale = () => {
      const query = new URLSearchParams(location.search).get('lang');
      if (catalogs[query]) return query;
      if (catalogs[document.documentElement.lang]) return document.documentElement.lang;
      try { const saved = localStorage.getItem('weightPlayLocale'); if (catalogs[saved]) return saved; } catch { /* Session only. */ }
      return 'en';
    };
    const state = { locale: pickLocale(), screen: 'main', scene: 0, puzzle: E.initial(levels[0]), moves: 0, hints: 0, selected: 0 };
    let generation = 0, focusFrame = 0, leaveOpen = false, history = [], inspected = false, checked = null, hintCells = [];
    let clueFocus = -1;
    let stageController = null, stagePromise = null, entering = false;
    const main = $('mainScreen'), stage = $('stageScreen'), battle = $('battleScreen');
    const stageCanvas = stage.querySelector('.stage-canvas'), canvas = battle.querySelector('.battle-canvas');
    const header = battle.querySelector('.panel-head'), content = battle.querySelector('.battle-content');
    const rail = $('stageList'), result = $('resultScreen'), guide = document.querySelector('[data-wp-game-guide]');
    const t = (key, vars = {}) => {
      let text = catalogs[state.locale]?.[key] ?? oldLocales[state.locale]?.[key] ?? catalogs.en[key] ?? oldLocales.en?.[key] ?? key;
      for (const [name, value] of Object.entries(vars)) text = String(text).replaceAll(`{${name}}`, String(value));
      return text;
    };
    const current = () => levels[state.scene];
    const frontier = () => Math.min(record.completed, levels.length - 1);
    const coord = p => `${'ABCD'[p % 4]}${Math.floor(p / 4) + 1}`;
    const icon = i => symbols[i] || '·';
    const play = cue => window.WeightPlayAudio?.play?.(cue);
    const track = (event, detail = {}) => {
      // Local diagnostics do not emit production analytics.
      if (/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)) return;
      window.dispatchEvent(new CustomEvent('weightplay:analytics', { detail: { game: 'animal-layer-grove', event, scene: state.scene + 1, revision: 'occlusion-v1', ...detail } }));
    };
    const save = () => { try { localStorage.setItem(saveKey, JSON.stringify(record)); } catch { /* Session progress survives unavailable storage. */ } };
    const feedback = (text, kind = '') => { $('battleStatus').textContent = text; $('battleStatus').dataset.kind = kind; };
    const description = rule => {
      const [type, subject, value] = rule;
      if (type === 'cell') return `${coord(subject)} → ${icon(value)}`;
      if (type === 'count') return `${t('total')} ${icon(subject)} = ${value}`;
      return `${t(type, { n: type === 'row' ? subject[0] + 1 : 'ABCD'[subject[0]] })} ${icon(subject[1])} = ${value}`;
    };
    const scope = rule => {
      if (rule[0] === 'cell') return [rule[1]];
      if (rule[0] === 'row') return Array.from({ length: 4 }, (_, x) => rule[1][0] * 4 + x);
      if (rule[0] === 'column') return Array.from({ length: 4 }, (_, y) => y * 4 + rule[1][0]);
      return Array.from({ length: 16 }, (_, i) => i);
    };
    document.documentElement.dataset.wpSharedInterface = '7';
    root.dataset.wpGameplayRevision = 'occlusion-v1';
    root.dataset.wpMotionRevision = 'v13';
    rail.classList.add('stage-rail'); rail.dataset.wpStageCenterObserver = 'manual';
    rail.removeAttribute('data-wp-stage-v6-auto');
    stageCanvas.style.setProperty('--wp-stage-art', `url("${new URL('assets/animal-layer-grove-cover.png', gameURL).href}")`);
    stageCanvas.dataset.wpStageArt = new URL('assets/animal-layer-grove-cover.png', gameURL).pathname;
    stageCanvas.dataset.wpStageLandscapeWidth = '760'; stageCanvas.dataset.wpStageLandscapeHeight = '390';
    // Same shared scaler; declare enough logical height for five 44px rows.
    canvas.dataset.wpBattleMinHeight = '844'; canvas.dataset.wpBattleLandscapeWidth = '760'; canvas.dataset.wpBattleLandscapeHeight = '390';
    content.innerHTML = '<section class="puzzle-scene"><h3 data-puzzle-copy="scene"></h3><div class="puzzle-board-wrap"><div id="puzzleBoard" class="puzzle-board" dir="ltr"></div></div></section><section class="puzzle-layers"><div class="puzzle-heading"><h3 data-puzzle-copy="layers"></h3><small data-puzzle-copy="frontBack"></small></div><div id="layerList" class="puzzle-layer-list"></div></section><section class="puzzle-goals"><h3 data-puzzle-copy="clues"></h3><ol id="clueList"></ol><p id="battleStatus" role="status" aria-live="polite"></p></section><div class="battle-actions"><button id="checkBtn" class="primary-btn" type="button" data-wp-primary-action data-puzzle-copy="check"></button><button id="undoBtn" class="order-btn" type="button">↶</button><button id="hintBtn" class="order-btn" type="button">?</button><button id="resetBtn" class="order-btn" type="button">⟲</button></div>';
    const battleSettings = window.WeightPlayScreenFrame.createSettings({ localeSelect: $('localeSelect'), showLanguage: false, id: 'layer-grove-battle' });
    battleSettings.utility.dataset.wpBattleUtility = ''; header.append(battleSettings.utility);
    const leave = document.createElement('section');
    leave.id = 'leavePanel'; leave.className = 'leave-panel'; leave.hidden = true; leave.inert = true;
    leave.setAttribute('role', 'dialog'); leave.setAttribute('aria-modal', 'true'); leave.setAttribute('aria-labelledby', 'leaveTitle'); leave.setAttribute('aria-describedby', 'leaveText');
    leave.innerHTML = '<div class="leave-card"><h2 id="leaveTitle" data-puzzle-copy="leaveTitle"></h2><p id="leaveText"></p><div class="leave-actions"><button id="continueBtn" class="primary-btn" type="button" data-puzzle-copy="continuePlay"></button><button id="leaveBtn" class="secondary-btn" type="button" data-puzzle-copy="map"></button></div></div>';
    canvas.append(leave);
    result.setAttribute('role', 'dialog'); result.setAttribute('aria-modal', 'true'); result.setAttribute('aria-labelledby', 'resultTitle'); result.setAttribute('aria-describedby', 'resultText resultGrade resultSkillReport');
    const medal = document.createElement('p'); medal.id = 'resultGrade'; $('resultText').after(medal);
    const skillReport = document.createElement('section'); skillReport.id = 'resultSkillReport'; skillReport.className = 'result-skill-report'; skillReport.setAttribute('role', 'group'); skillReport.setAttribute('aria-labelledby', 'resultSkillTitle');
    const skillTitle = document.createElement('h3'); skillTitle.id = 'resultSkillTitle';
    const skillNames = document.createElement('p'); skillNames.id = 'resultSkillNames';
    const encouragement = document.createElement('p'); encouragement.id = 'resultEncouragement';
    const skillDisclaimer = document.createElement('p'); skillDisclaimer.id = 'resultDisclaimer'; skillDisclaimer.className = 'result-skill-disclaimer';
    skillReport.append(skillTitle, skillNames, encouragement, skillDisclaimer); medal.after(skillReport);
    const cells = [];
    for (let y = -1; y < 4; y += 1) for (let x = -1; x < 4; x += 1) {
      const node = document.createElement(x < 0 || y < 0 ? 'span' : 'button');
      if (x < 0 || y < 0) { node.className = 'puzzle-coordinate'; node.textContent = y < 0 ? (x < 0 ? '' : 'ABCD'[x]) : String(y + 1); node.setAttribute('aria-hidden', 'true'); }
      else {
        const p = y * 4 + x; node.type = 'button'; node.className = 'puzzle-cell'; node.innerHTML = '<span class="cell-face" aria-hidden="true"></span>';  node.dataset.cell = coord(p); cells.push(node);
        listen(node, 'click', () => { if (!canPlay()) return; const i = E.compose(current(), state.puzzle)[p]; if (i >= 0) select(i); });
      }
      $('puzzleBoard').append(node);
    }
    // A stable row pool preserves focus and control rectangles after every move.
    const rows = Array.from({ length: 5 }, (_, index) => {
      const row = document.createElement('div'); row.className = 'puzzle-layer-row';
      row.innerHTML = '<button class="layer-inspect" type="button"><span class="layer-symbol" aria-hidden="true"></span><span class="layer-mini" aria-hidden="true"></span></button><button class="order-btn" type="button">↑</button><button class="order-btn" type="button">↓</button><button class="order-btn" type="button">↻</button>';
      for (let p = 0; p < 16; p += 1) row.querySelector('.layer-mini').append(document.createElement('i'));
      const [inspect, up, down, turn] = row.querySelectorAll('button');
      listen(inspect, 'click', () => { if (canPlay()) select(state.puzzle.order[index]); });
      listen(up, 'click', () => change({ type: 'swap', index, direction: -1 }));
      listen(down, 'click', () => change({ type: 'swap', index, direction: 1 }));
      listen(turn, 'click', () => change({ type: 'rotate', index: state.puzzle.order[index] }));
      $('layerList').append(row); return row;
    });
    const clueNodes = Array.from({ length: 4 }, (_, index) => {
      const li = document.createElement('li');
      li.innerHTML = '<button class="clue-action" type="button" aria-pressed="false"><span class="clue-state" aria-hidden="true">○</span><span class="clue-text"></span></button>';
      listen(li.firstElementChild, 'click', () => {
        if (!canPlay() || !current().clues[index]) return;
        clueFocus = clueFocus === index ? -1 : index;
        draw(); motion.pulse(cells.filter(cell => cell.classList.contains('is-clue')).map(cell => cell.firstElementChild));
        if (clueFocus >= 0) feedback(description(current().clues[clueFocus]));
      });
      $('clueList').append(li); return li;
    });
    // Replace obsolete target-order/arc advice once; guide stays Main's sibling.
    const guideSections = guide?.querySelector('.game-info-sections');
    if (guideSections) {
      // Initial HTML owns its full Guide. Repair only a missing core section.
      for (const [title, text] of [['howTitle', 'guideControls'], ['rulesTitle', 'guideRules'], ['progressTitle', 'guideProgression'], ['saveTitle', 'guideSave'], ['tipsTitle', 'guideTips'], ['guideToolsTitle', 'guideTools'], ['guideDesignTitle', 'guideDesign']]) {
        if (guideSections.querySelector(`[data-puzzle-copy="${text}"]`)) continue;
        const article = document.createElement('article'); article.className = 'game-info-section';
        const h3 = document.createElement('h3'), p = document.createElement('p'); h3.dataset.puzzleCopy = title; p.dataset.puzzleCopy = text; article.append(h3, p); guideSections.append(article);
      }
    }
    if (guideSections && !guideSections.querySelector('[data-puzzle-faq]')) {
      const article = document.createElement('article'); article.className = 'game-info-section'; article.dataset.puzzleFaq = '';
      const heading = document.createElement('h3'); heading.dataset.puzzleCopy = 'guideFaqTitle'; article.append(heading);
      for (let i = 1; i <= 4; i += 1) {
        const h4 = document.createElement('h4'), p = document.createElement('p');
        h4.dataset.puzzleCopy = `faq${i}q`; p.dataset.puzzleCopy = `faq${i}a`; article.append(h4, p);
      }
      guideSections.append(article);
    }
    const canPlay = () => state.screen === 'battle' && !leaveOpen && !entering;
    function renderMain() {
      const text = t('progress', { n: record.completed, total: levels.length });
      $('mainProgress').textContent = text;
      main.querySelectorAll('.wp-standard-main-progress').forEach(n => { n.textContent = text; });
      main.querySelectorAll('.wp-standard-main-summary,[data-copy="intro"]').forEach(n => { n.textContent = t('intro'); });
    }
    function draw(effect = null) {
      const level = current(), evaluated = E.evaluate(level, state.puzzle);
      content.style.setProperty('--grove-layer-count', String(level.masks.length));
      const footprint = E.maskAt(level.masks[state.selected], state.puzzle.turns[state.selected]);
      const highlighted = new Set(clueFocus >= 0 ? scope(level.clues[clueFocus]) : checked ? checked.checks.filter(c => !c.met).flatMap(c => scope(c.rule)) : hintCells);
      const changedFaces = [];
      cells.forEach((cell, p) => {
        const i = evaluated.board[p], changed = cell.dataset.layer !== String(i);
        cell.dataset.layer = String(i); cell.firstElementChild.textContent = icon(i);
        if (effect && changed) changedFaces.push(cell.firstElementChild);
        cell.classList.toggle('is-inspected', inspected && Boolean(footprint & (1 << p)));
        cell.classList.toggle('is-clue', highlighted.has(p));
        cell.setAttribute('aria-label', t('boardCell', { cell: coord(p), symbol: i < 0 ? t('empty') : icon(i) }));
      });
      rows.forEach((row, index) => {
        const id = state.puzzle.order[index]; row.hidden = id === undefined;
        if (id === undefined) return;
        row.dataset.layer = String(id); row.dataset.layerId = String(id);
        const [inspect, up, down, turn] = row.querySelectorAll('button');
        row.querySelector('.layer-symbol').textContent = icon(id);
        const mask = E.maskAt(level.masks[id], state.puzzle.turns[id]);
        [...row.querySelector('.layer-mini').children].forEach((cell, p) => { cell.classList.toggle('solid', Boolean(mask & (1 << p))); });
        inspect.setAttribute('aria-label', t('inspect', { symbol: icon(id) })); inspect.setAttribute('aria-pressed', String(inspected && id === state.selected));
        up.disabled = index === 0; down.disabled = index === level.masks.length - 1; turn.disabled = !level.rotatable.includes(id);
        for (const [button, key] of [[up, 'forward'], [down, 'backward'], [turn, 'rotate']]) { const label = t(key, { symbol: icon(id) }); button.setAttribute('aria-label', label); button.title = button === turn && turn.disabled ? t('rotationLocked') : label; }
      });
      clueNodes.forEach((li, i) => {
        const rule = level.clues[i]; li.hidden = !rule;
        if (!rule) return;
        li.querySelector('.clue-text').textContent = description(rule);
        const button = li.firstElementChild;
        button.setAttribute('aria-pressed', String(clueFocus === i));
        button.setAttribute('aria-label', `${t('clues')} ${i + 1}: ${description(rule)}`);
        li.querySelector('.clue-state').textContent = checked ? (checked.checks[i].met ? '✓' : '×') : '○';
        li.dataset.met = checked ? String(checked.checks[i].met) : '';
      });
      $('groveLabel').textContent = t('stage', { n: state.scene + 1, total: levels.length });
      $('moveCount').textContent = t('moves', { n: state.moves });
      $('undoBtn').disabled = history.length === 0;
      if (effect) {
        motion.changed(changedFaces, effect.direction || 1);
        if (effect.type === 'rotate') motion.rotate(rows.find(row => Number(row.dataset.layerId) === effect.index)?.querySelector('.layer-mini'));
        else motion.pulse(rows.filter(row => !row.hidden).map(row => row.querySelector('.layer-symbol')));
      }
    }
    function select(id) { if (!Number.isInteger(id) || id < 0 || id >= current().masks.length) return; state.selected = id; inspected = true; draw(); motion.pulse(cells.filter(cell => cell.classList.contains('is-inspected')).map(cell => cell.firstElementChild)); feedback(t('inspectText', { symbol: icon(id) })); }
    function remember() { history.push(E.copy(state.puzzle)); if (history.length > 128) history.shift(); }
    function change(action) {
      if (!canPlay()) return;
      const next = E.act(current(), state.puzzle, action); if (!next) return;
      remember(); state.puzzle = next; state.moves += 1; checked = null; hintCells = [];
      draw(action); feedback(t('changed')); play('board.move'); track('layer_move', { moves: state.moves, action: action.type });
    }
    function undo() { if (!canPlay() || !history.length) return; state.puzzle = history.pop(); checked = null; hintCells = []; draw({ type: 'undo', direction: -1 }); feedback(t('changed')); play('board.move'); }
    function resetLayers() {
      if (!canPlay()) return;
      const initial = E.initial(current());
      if (JSON.stringify(initial) === JSON.stringify(state.puzzle)) return;
      remember(); state.puzzle = initial; state.moves += 1; checked = null; hintCells = []; draw({ type: 'reset' }); feedback(t('ready')); play('board.move'); track('layer_reset');
    }
    function hint() {
      if (!canPlay()) return;
      const evaluated = E.evaluate(current(), state.puzzle), unmet = evaluated.checks.filter(c => !c.met);
      if (!unmet.length) { feedback(t('changed')); return; }
      state.hints += 1; const clue = unmet[(state.hints - 1) % unmet.length];
      checked = null; clueFocus = -1; hintCells = scope(clue.rule);
      draw(); feedback(`${description(clue.rule)}. ${t('hintText')}`); track('puzzle_hint', { hints: state.hints });
    }
    function checkWindow() {
      if (!canPlay()) return;
      clueFocus = -1; checked = E.evaluate(current(), state.puzzle); draw();
      motion.pulse(clueNodes.filter(node => !node.hidden).map(node => node.querySelector('.clue-state')));
      if (!checked.solved) { feedback(t('wrong', { n: checked.checks.filter(c => !c.met).length }), 'wrong'); play('feedback.error'); track('window_check', { result: 'wrong' }); return; }
      const stars = state.hints ? 1 : state.moves <= current().par + 2 ? 3 : 2;
      record.completed = Math.max(record.completed, state.scene + 1);
      record.best[state.scene] = Math.min(record.best[state.scene] || Infinity, state.moves);
      record.stars[state.scene] = Math.max(record.stars[state.scene] || 0, stars); save();
      track('window_check', { result: 'correct', moves: state.moves, hints: state.hints, stars }); play('feedback.success');
      show('result'); renderResult(stars); motion.reveal([...medal.children, result.querySelector('.keeper-result')].filter(Boolean));
    }
    function renderResult(stars) {
      $('resultTitle').textContent = t('resultTitle');
      $('resultText').textContent = t('resultText', { moves: state.moves, hints: state.hints, best: record.best[state.scene] });
      const earned = stars ?? (state.hints ? 1 : state.moves <= current().par + 2 ? 3 : 2);
      medal.setAttribute('aria-label', `${t('grade', { stars: earned })} · ★★★ ≤ ${current().par + 2}`);
      medal.replaceChildren(...Array.from({ length: 3 }, (_, index) => {
        const star = document.createElement('span'); star.textContent = index < earned ? '★' : '☆'; star.setAttribute('aria-hidden', 'true'); return star;
      }));
      const threshold = document.createElement('small'); threshold.textContent = ` · ★★★ ≤ ${current().par + 2}`; threshold.setAttribute('aria-hidden', 'true'); medal.append(threshold);
      skillTitle.textContent = t('skillReportTitle');
      skillNames.textContent = t('skillsValue');
      encouragement.textContent = t('resultEncouragement');
      skillDisclaimer.textContent = t('resultDisclaimer');
      $('resultMapBtn').textContent = t('map'); $('resultMapBtn').hidden = false;
      $('resultPrimaryBtn').textContent = t('next'); $('resultPrimaryBtn').disabled = state.scene >= levels.length - 1 || state.scene + 1 > record.completed;
      $('resultHomeBtn').textContent = t('replay');
    }
    function startScene(index) {
      if (!Number.isInteger(index) || index < 0 || index >= levels.length || index > record.completed) return;
      state.scene = index; state.puzzle = E.initial(current()); state.moves = 0; state.hints = 0; state.selected = state.puzzle.order[0];
      history = []; inspected = false; checked = null; hintCells = []; clueFocus = -1;
      show('battle'); draw(); feedback(t('ready')); track('scene_start', { stageId: current().id });
    }
    function syncShared() { window.dispatchEvent(new Event('weightplay:stage-sync')); window.dispatchEvent(new Event('weightplay:shell-sync')); }
    function show(screen) {
      const ticket = ++generation; cancelAnimationFrame(focusFrame); motion.clear();
      state.screen = screen; leaveOpen = false; leave.hidden = true; leave.inert = true; battleSettings.close();
      const owner = screen === 'result' ? 'battle' : screen;
      for (const [name, node] of Object.entries({ main, stage, battle })) { node.hidden = name !== owner; node.inert = name !== owner; node.setAttribute('aria-hidden', String(name !== owner)); }
      root.dataset.screen = owner; canvas.dataset.substate = screen === 'result' ? 'result' : 'play';
      const settled = screen === 'result'; result.hidden = !settled; result.inert = !settled; content.hidden = settled; content.inert = settled; header.hidden = settled; header.inert = settled;
      if (guide) { guide.hidden = owner !== 'main'; guide.inert = owner !== 'main'; }
      if (owner === 'main') renderMain();
      syncShared();
      motion.reveal(screen === 'result' ? [result.querySelector('.result-card')] : screen === 'battle' ? [...content.querySelectorAll(':scope > section')] : screen === 'stage' ? [...rail.querySelectorAll('[data-wp-item-content]')] : [main.querySelector('.cover')].filter(Boolean));
      header.hidden = settled; header.inert = settled;
      if (screen === 'battle') window.dispatchEvent(new Event('weightplay:battle-open'));
      focusFrame = requestAnimationFrame(() => { if (ticket !== generation) return; if (screen === 'stage') stageController?.center(frontier()); (screen === 'main' ? $('startBtn') : screen === 'stage' ? rail.querySelector('[aria-current="true"]') : settled ? $('resultMapBtn') : $('battleBackBtn'))?.focus({ preventScroll: true }); });
    }
    function bindStage(button, index) {
      const locked = index > record.completed;
      button.className = 'stage-card'; button.classList.toggle('locked', locked); button.dataset.stageId = levels[index].id;
      button.dataset.wpStageRecommended = String(index === frontier()); button.setAttribute('aria-disabled', String(locked));
      let copy = button.querySelector('[data-wp-item-content]');
      if (!copy) { copy = document.createElement('span'); copy.dataset.wpItemContent = ''; copy.append(document.createElement('strong'), document.createElement('span'), document.createElement('small')); button.replaceChildren(copy); }
      copy.children[0].textContent = t('stage', { n: index + 1, total: levels.length });
      copy.children[1].textContent = catalogs[state.locale].chapters[levels[index].chapter];
      copy.children[2].textContent = record.stars[index] ? `${'★'.repeat(record.stars[index])} · ${t('best', { n: record.best[index] })}` : t(locked ? 'locked' : 'open');
      button.setAttribute('aria-label', [...copy.children].map(n => n.textContent).join('. '));
    }
    function getStageController() {
      if (stageController) return Promise.resolve(stageController);
      if (stagePromise) return stagePromise;
      stagePromise = load('../../src/stage-virtualization-standard.js', () => Boolean(window.WeightPlayStageV6)).then(() => {
        rail.removeAttribute('data-wp-stage-v6-auto');
        stageController = window.WeightPlayStageV6.install(rail, { total: levels.length, poolSize: 9, initialIndex: frontier, bind: bindStage, activate: index => { if (state.screen === 'stage') startScene(index); } });
        if (!stageController) throw new Error('STAGE_MOUNT_FAILED'); return stageController;
      }).catch(error => { stagePromise = null; throw error; }); return stagePromise;
    }
    async function openStage() {
      if (entering) return; entering = true; const ticket = generation; $('startBtn').disabled = true;
      try {
        const controller = await getStageController(); if (ticket !== generation || abort.signal.aborted) return;
        controller.refresh(); show('stage'); controller.center(frontier());
      } catch (error) {
        if (ticket !== generation || abort.signal.aborted) return;
        console.error('Layer Grove Stage load failed', error);
        if (state.screen === 'main') $('mainProgress').textContent = t('loadError'); else if (leaveOpen) $('leaveText').textContent = t('loadError'); else $('resultText').textContent = t('loadError');
      } finally { entering = false; $('startBtn').disabled = false; }
    }
    function continuePlaying() { if (!leaveOpen || entering) return; motion.clear(); leaveOpen = false; leave.hidden = true; leave.inert = true; content.inert = false; header.inert = false; $('battleBackBtn').focus({ preventScroll: true }); }
    function askLeave() {
      if (!canPlay()) return; motion.clear(); leaveOpen = true; battleSettings.close();
      $('leaveText').textContent = t('leaveBody', { n: state.scene + 1 }); leave.hidden = false; leave.inert = false; content.inert = true; header.inert = true; $('continueBtn').focus({ preventScroll: true }); motion.reveal([leave.querySelector('.leave-card')]);
    }
    function trap(event, panel) {
      if (event.key !== 'Tab') return;
      const controls = [...panel.querySelectorAll('button:not(:disabled)')].filter(n => !n.hidden), first = controls[0], last = controls.at(-1);
      if (!panel.contains(document.activeElement) || (event.shiftKey && document.activeElement === first)) { event.preventDefault(); (event.shiftKey ? last : first)?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    function applyLocale() {
      motion.clear();
      document.documentElement.lang = state.locale; document.documentElement.dir = state.locale === 'ar' ? 'rtl' : 'ltr';
      const overrides = { intro: t('intro'), start: t('start'), groves: t('map'), guideSummary: t('intro'), gameplayValue: t('rulesTitle'), guideTitle: t('howTitle') };
      document.querySelectorAll('[data-copy]').forEach(node => {
        const key = node.dataset.copy;
        if (node.hasAttribute('data-wp-game-title')) return;
        const text = overrides[key] ?? oldLocales[state.locale]?.[key];
        if (text !== undefined) { if (node.hasAttribute('data-wp-return')) node.setAttribute('aria-label', text); else node.textContent = text; }
      });
      document.querySelectorAll('[data-puzzle-copy]').forEach(n => { n.textContent = t(n.dataset.puzzleCopy); });
      for (const [id, key] of [['undoBtn', 'undo'], ['hintBtn', 'hint'], ['resetBtn', 'reset'], ['stageBackBtn', 'back'], ['battleBackBtn', 'back']]) { $(id).setAttribute('aria-label', t(key)); $(id).title = t(key); }
      $('localeSelect').value = state.locale; renderMain();
      if (state.screen === 'stage' && stageController) { const index = Number(rail.dataset.wpStageDragLogical); stageController.refresh(); stageController.center(Number.isFinite(index) ? index : frontier()); }
      if (state.screen === 'battle') { draw(); feedback(t('ready')); }
      if (state.screen === 'result') renderResult();
      if (leaveOpen) $('leaveText').textContent = t('leaveBody', { n: state.scene + 1 });
      battleSettings.refresh();
    }
    listen($('startBtn'), 'click', openStage); listen($('stageBackBtn'), 'click', () => show('main'));
    listen($('battleBackBtn'), 'click', askLeave); listen($('continueBtn'), 'click', continuePlaying); listen($('leaveBtn'), 'click', () => { if (leaveOpen) void openStage(); });
    listen($('resultMapBtn'), 'click', () => { if (state.screen === 'result') void openStage(); });
    listen($('resultPrimaryBtn'), 'click', () => { if (state.screen === 'result') startScene(state.scene + 1); });
    listen($('resultHomeBtn'), 'click', () => { if (state.screen === 'result') startScene(state.scene); });
    listen($('checkBtn'), 'click', checkWindow); listen($('undoBtn'), 'click', undo); listen($('hintBtn'), 'click', hint); listen($('resetBtn'), 'click', resetLayers);
    listen(document, 'keydown', event => { if (leaveOpen) { if (event.key === 'Escape') { event.preventDefault(); continuePlaying(); } else trap(event, leave); } else if (state.screen === 'result') trap(event, result); });
    listen($('localeSelect'), 'change', event => { if (!catalogs[event.target.value]) return; state.locale = event.target.value; try { localStorage.setItem('weightPlayLocale', state.locale); } catch { /* Session locale still changes. */ } applyLocale(); syncShared(); });
    listen(window, 'weightplay:audio-volume-change', () => battleSettings.refresh());
    listen($('soundBtn'), 'click', () => window.WeightPlayAudio?.setMuted?.(!window.WeightPlayAudio.isMuted()));
    listen(document, 'visibilitychange', () => { if (document.hidden) motion.clear(); });
    // Shared popovers retain their own position/scale; only opacity is animated.
    listen(document, 'click', event => {
      const trigger = event.target.closest?.('[data-wp-settings],.wp-shell-settings-button');
      if (!trigger) return;
      const ticket = generation;
      queueMicrotask(() => {
        if (ticket !== generation || abort.signal.aborted || document.hidden) return;
        const active = state.screen === 'main' ? main : state.screen === 'stage' ? stage : battle;
        const panel = [...active.querySelectorAll('.wp-frame-popover,.wp-shell-settings-popover')].find(node => !node.hidden && node.getClientRects().length);
        if (panel) motion.reveal([panel]);
      });
    });
    listen(window, 'pagehide', event => {
      ++generation; cancelAnimationFrame(focusFrame); motion.clear();
      if (event.persisted) return;
      stageController?.destroy(); battleSettings.destroy(); motion.destroy(); abort.abort();
    });
    listen(window, 'pageshow', event => { if (event.persisted) syncShared(); });
    applyLocale(); show('main'); $('startBtn').disabled = false; $('loadingScreen').classList.add('is-ready');
    window.__ANIMAL_LAYER_GROVE_TEST__ = Object.freeze({
      levels, startScene, motionCount: () => motion.size, moveLayer: (index, direction) => change({ type: 'swap', index, direction }), rotateLayer: index => change({ type: 'rotate', index }), resetLayers, undo, checkWindow,
      getState: () => ({ locale: state.locale, screen: state.screen, scene: state.scene, moves: state.moves, hints: state.hints, clueFocus, leaveOpen, completed: record.completed, historyLength: history.length, order: [...state.puzzle.order], turns: [...state.puzzle.turns] }),
    });
  }
})();
