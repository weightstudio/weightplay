import { Minefield, LEVELS } from './engine.mjs?v=15';
import { COPY, LOCALES, ROUTES, LANGUAGES } from './copy.mjs?v=15';

export function mountMinefield() {
  const root = document.querySelector('#logicApp');
  if (!root || root.dataset.mfMounted === '15') return;
  const segment = location.pathname.split('/').filter(Boolean)[0]?.toLowerCase();
  const locale = LOCALES[ROUTES.indexOf(segment)] || (LOCALES.includes(document.documentElement.lang) ? document.documentElement.lang : 'en');
  const copy = COPY[locale];
  const title = window.WEIGHTPLAY_GAME_TITLES?.['minefield-logic']?.[locale] || document.title.replace(/\s*\|\s*WeightPlay.*$/, '');
  const storageKey = 'weightplay:minefield-logic:records:v1';
  const records = { level: 'easy', best: {} };
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (Object.hasOwn(LEVELS, saved?.level)) records.level = saved.level;
    for (const key of Object.keys(LEVELS)) {
      const value = saved?.best?.[key];
      if (typeof value === 'number' && Number.isFinite(value) && value >= 0) records.best[key] = value;
    }
  } catch { /* Storage is optional. */ }
  const persist = () => { try { localStorage.setItem(storageKey, JSON.stringify(records)); } catch { /* Play remains available. */ } };
  const el = (tag, className = '', text) => {
    const node = document.createElement(tag); if (className) node.className = className;
    if (text !== undefined) node.textContent = text; return node;
  };
  const button = (text, fn, primary = false) => {
    const node = el('button', '', text); node.type = 'button';
    node.dataset.wpFrameAction = primary ? 'primary' : 'secondary';
    node.addEventListener('click', fn); return node;
  };
  const formatTime = seconds => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;
  const applyTemplate = (value, data) => value.replace(/\{(\w+)\}/g, (_, key) => String(data[key] ?? ''));
  document.documentElement.lang = locale; document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  document.body.dataset.logicGame = 'minefield-logic'; document.body.dataset.gameVersion = 'v15';
  document.body.dataset.wpGameId = 'minefield-logic';
  root.dataset.wpFrameRoot = ''; root.dataset.mfNative = ''; root.dataset.mfMounted = '15';
  root.setAttribute('data-runtime-localize', 'off');
  document.body.querySelector(':scope > h1')?.remove();
  root.replaceChildren();

  const main = el('main'), battle = el('section');
  main.id = 'logicMain'; main.dataset.screen = 'main';
  battle.id = 'logicBattle'; battle.dataset.screen = 'battle'; battle.hidden = true;
  battle.setAttribute('aria-label', title); battle.dataset.wpBattleCanvasRoot = '';
  battle.dataset.wpLogicalBattleCanvas = '';
  // All transforms, viewport geometry and restoration remain shared-owned.
  battle.dataset.wpBattleMinWidth = '390'; battle.dataset.wpBattleMinHeight = '720';
  battle.dataset.wpBattleLandscapeWidth = '760'; battle.dataset.wpBattleLandscapeHeight = '334';
  const mainHeader = el('header'), battleHeader = el('header');
  const home = el('a'); home.href = '/'; home.dataset.wpReturn = 'main'; home.setAttribute('aria-label', copy.back);
  const back = button(copy.leave, () => requestChange(() => showMain(), copy.leave));
  back.removeAttribute('data-wp-frame-action'); back.dataset.wpReturn = 'battle'; back.setAttribute('aria-label', copy.leave);
  const mainTitle = el('h1', '', title), battleTitle = el('strong', '', title);
  mainTitle.dataset.wpFrameTitle = ''; battleTitle.dataset.wpFrameTitle = '';
  mainHeader.append(home, mainTitle); battleHeader.append(back, battleTitle);
  const mainContent = el('div'), mainCopy = el('div'); mainCopy.dataset.wpFrameCopy = '';
  const poster = el('img', 'main-poster'); poster.dataset.wpFramePoster = '';
  poster.src = '/assets/interface7-redrawn/minefield-logic.webp'; poster.alt = ''; poster.width = 420; poster.height = 420;
  const summary = el('p', '', copy.summary); summary.dataset.wpFrameSummary = '';
  const bestLine = el('p', 'mf-best');
  const start = button(copy.start, () => newRound(records.level), true); start.dataset.wpMainStart = '';
  mainCopy.append(summary, bestLine, start); mainContent.append(poster, mainCopy); main.append(mainHeader, mainContent);

  const play = el('div', 'mf-play'); play.dataset.wpFrameLogicalActions = 'battle';
  const hud = el('div'), values = {};
  for (const key of ['time', 'mines', 'safe']) {
    const group = el('div'), label = el('span', '', copy[key]), value = el('strong', '', '0');
    value.dir = 'ltr'; group.append(label, value); hud.append(group); values[key] = value;
  }
  play.append(hud); // The shared frame alone adopts the declared information slot.
  const toolbar = el('div', 'mf-tools'); toolbar.setAttribute('role', 'group'); toolbar.setAttribute('aria-label', copy.controlsTitle);
  const level = el('select', 'mf-difficulty'); level.setAttribute('aria-label', copy.level);
  for (const [key, config] of Object.entries(LEVELS)) {
    const option = el('option', '', `${copy[key]} ${config.rows}×${config.cols}`); option.value = key; level.append(option);
  }
  const reveal = button(copy.reveal, () => setMode(false)), flag = button(copy.flag, () => setMode(true));
  reveal.dataset.wpFrameAction = flag.dataset.wpFrameAction = 'tab';
  toolbar.append(level, reveal, flag);
  const viewport = el('div', 'mf-viewport'); viewport.dir = 'ltr';
  const board = el('div', 'mf-board'); board.setAttribute('role', 'grid'); board.setAttribute('aria-label', title); board.dir = 'ltr';
  viewport.append(board);
  const status = el('p', 'mf-status', copy.ready); status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite'); status.setAttribute('aria-atomic', 'true');
  const actions = el('div', 'mf-actions');
  const hint = button(copy.hint, showHint), undo = button(copy.undo, undoMove), fresh = button(copy.new, () => requestChange(() => newRound(game.level, true), copy.new));
  actions.append(hint, undo, fresh); play.append(toolbar, viewport, status, actions);
  const overlay = el('div', 'mf-overlay'); overlay.hidden = true; overlay.setAttribute('role', 'dialog'); overlay.setAttribute('aria-modal', 'true'); overlay.dataset.wpFrameLogicalActions = 'battle';
  const card = el('div', 'mf-dialog'), dialogTitle = el('h2'), dialogText = el('p'), dialogActions = el('div', 'mf-dialog-actions');
  dialogTitle.id = 'mfDialogTitle'; dialogText.id = 'mfDialogText';
  overlay.setAttribute('aria-labelledby', dialogTitle.id); overlay.setAttribute('aria-describedby', dialogText.id);
  card.append(dialogTitle, dialogText, dialogActions); overlay.append(card);
  battle.append(battleHeader, play, overlay);
  const localeSelect = el('select'); localeSelect.hidden = true; localeSelect.setAttribute('aria-hidden', 'true');
  LOCALES.forEach((key, i) => { const option = el('option', '', LANGUAGES[i]); option.value = key; localeSelect.append(option); });
  localeSelect.value = locale;
  localeSelect.addEventListener('change', () => {
    const next = LOCALES.indexOf(localeSelect.value); if (next < 0) return;
    try { localStorage.setItem('weightPlayLocale', localeSelect.value); } catch { /* Route still selects the locale. */ }
    location.assign(`/${ROUTES[next]}/games/minefield-logic/${location.search}${location.hash}`);
  });
  root.append(main, battle, localeSelect);
  const guide = document.querySelector('.game-page-info-static');
  // Keep source-generated initial HTML permanently in place: no runtime FAQ,
  // comparison, related-link or locale content replacement.
  const guideBest = guide?.querySelector('[data-mf-best]');
  if (guide) guide.setAttribute('data-runtime-localize', 'off');
  const frame = window.WeightPlayScreenFrame.mount({ root, localeSelect, scenes: {
    main: { root: main, header: mainHeader, content: mainContent },
    battle: { root: battle, header: battleHeader, content: play, headerInfo: hud },
  } });
  let game = null, screen = 'main', flagMode = false, cells = [], focused = 0, hintTarget = null;
  let elapsed = 0, runningSince = null, ticker = null, pageAway = false, cancelDialog = null, returnFocus = null;
  const measurement = { screen: 'main', roundKey: null, started: false, ended: false, restart: false, outcome: 'complete' };
  const readMeasurement = () => ({ ...measurement, screen: measurement.ended ? null : screen, node: battle, paused: runningSince === null, activityMode: 'input', idleSeconds: 300 });
  const notify = () => { try { window.WonderAnalytics?.game?.observeState?.(readMeasurement); } catch { /* Optional telemetry. */ } };
  const nowSeconds = () => Math.floor((elapsed + (runningSince === null ? 0 : performance.now() - runningSince)) / 1000);
  function syncClock() {
    const allowed = screen === 'battle' && game?.status === 'playing' && !document.hidden && !pageAway && overlay.hidden && !root.querySelector('.wp-frame-popover:not([hidden])');
    if (!allowed && runningSince !== null) { elapsed += performance.now() - runningSince; runningSince = null; }
    if (!allowed && ticker !== null) { clearInterval(ticker); ticker = null; }
    if (allowed && runningSince === null) runningSince = performance.now();
    if (allowed && ticker === null) ticker = setInterval(() => { values.time.textContent = formatTime(nowSeconds()); }, 250);
    values.time.textContent = formatTime(nowSeconds());
  }
  function activate(next) {
    frame.close(); screen = next;
    main.hidden = next !== 'main'; battle.hidden = next !== 'battle'; if (guide) guide.hidden = next !== 'main';
    frame.activate(next, { covered: next === 'battle' && !overlay.hidden });
    window.WeightPlayBattleCanvas?.sync?.(); syncClock(); notify();
  }
  function updateBest() {
    const best = records.best[records.level];
    const text = `${copy.best} · ${copy[records.level]}: ${best === undefined ? '—' : formatTime(best)}`;
    bestLine.textContent = text; if (guideBest) guideBest.textContent = `${copy[records.level]}: ${best === undefined ? '—' : formatTime(best)}`;
  }
  function showMain() {
    if (measurement.started && !measurement.ended) { measurement.ended = true; measurement.outcome = 'abandon'; }
    overlay.hidden = true; play.inert = false; cancelDialog = null; hintTarget = null;
    updateBest(); activate('main'); start.focus({ preventScroll: true });
  }
  function newRound(difficulty, restart = false) {
    if (!Object.hasOwn(LEVELS, difficulty)) difficulty = 'easy';
    overlay.hidden = true; play.inert = false; cancelDialog = null;
    if (ticker !== null) clearInterval(ticker); ticker = null; runningSince = null; elapsed = 0;
    game = new Minefield(difficulty); records.level = difficulty; persist(); level.value = difficulty;
    Object.assign(measurement, { roundKey: {}, started: false, ended: false, restart, outcome: 'complete', resumed: false, reopenKey: null });
    focused = 0; hintTarget = null; cells = []; board.replaceChildren();
    board.setAttribute('aria-rowcount', String(game.rows)); board.setAttribute('aria-colcount', String(game.cols));
    board.style.setProperty('--mf-cols', game.cols);
    for (let r = 0; r < game.rows; r += 1) {
      const row = el('div', 'mf-row'); row.setAttribute('role', 'row');
      for (let c = 0; c < game.cols; c += 1) {
        const cell = el('button', 'mf-cell'); cell.type = 'button'; cell.dataset.cell = String(cells.length);
        cell.setAttribute('role', 'gridcell'); cell.setAttribute('aria-rowindex', String(r + 1)); cell.setAttribute('aria-colindex', String(c + 1));
        cells.push(cell); row.append(cell);
      }
      board.append(row);
    }
    viewport.scrollTop = 0; viewport.scrollLeft = 0;
    setMode(false); status.textContent = copy.ready; render(); activate('battle'); cells[0]?.focus({ preventScroll: true });
  }
  function setMode(value) {
    flagMode = value; reveal.setAttribute('aria-pressed', String(!value)); flag.setAttribute('aria-pressed', String(value));
  }
  function render() {
    const view = game.view(), ended = ['won', 'lost'].includes(view.status);
    values.mines.textContent = String(view.total - view.flags); values.safe.textContent = `${view.safe}/${view.rows * view.cols - view.total}`;
    undo.disabled = !view.canUndo; hint.disabled = ended;
    cells.forEach((node, i) => {
      const cell = view.cells[i]; let state = cell.open ? String(cell.count ?? 0) : cell.flag ? copy.marked : copy.covered;
      if (cell.mine) state = copy.mine;
      node.textContent = cell.mine ? '✹' : cell.flag ? '⚑' : cell.open ? cell.count || '' : '';
      node.className = `mf-cell${cell.open ? ' is-open' : ''}${cell.mine ? ' is-mine' : ''}${cell.flag ? ' is-flag' : ''}${hintTarget?.index === i ? ' is-hint' : ''}${hintTarget?.clues?.includes(i) ? ' is-clue' : ''}`;
      if (cell.open && !cell.mine) node.dataset.count = String(cell.count); else delete node.dataset.count;
      node.tabIndex = i === focused ? 0 : -1; node.setAttribute('aria-disabled', String(ended));
      node.setAttribute('aria-label', applyTemplate(copy.cell, { r: Math.floor(i / view.cols) + 1, c: i % view.cols + 1, state }));
    });
    syncClock();
  }
  function move(i, mark = flagMode) {
    if (screen !== 'battle' || !overlay.hidden) return;
    const changed = mark ? game.flag(i) : game.reveal(i); if (!changed) return;
    measurement.started = true; hintTarget = null; status.textContent = mark ? copy.flag : copy.reveal;
    render();
    if (['won', 'lost'].includes(game.status)) {
      measurement.ended = true; measurement.outcome = game.status === 'won' ? 'win' : 'lose';
      if (game.status === 'won' && !game.assisted) {
        const seconds = nowSeconds(), best = records.best[game.level];
        if (best === undefined || seconds < best) { records.best[game.level] = seconds; persist(); }
      }
      window.WeightPlayAudio?.play?.(game.status === 'won' ? 'result.win' : 'result.lose'); showResult();
    } else window.WeightPlayAudio?.play?.('board.move');
    notify();
  }
  function focusCell(i) {
    focused = Math.max(0, Math.min(cells.length - 1, i)); cells.forEach((cell, index) => { cell.tabIndex = index === focused ? 0 : -1; });
    cells[focused]?.focus({ preventScroll: true }); cells[focused]?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }
  board.addEventListener('click', event => { const cell = event.target.closest('[data-cell]'); if (cell) { focused = Number(cell.dataset.cell); move(focused); } });
  board.addEventListener('contextmenu', event => { const cell = event.target.closest('[data-cell]'); if (cell) { event.preventDefault(); focused = Number(cell.dataset.cell); move(focused, true); } });
  board.addEventListener('focusin', event => {
    if (event.target.dataset.cell === undefined) return;
    focused = Number(event.target.dataset.cell); cells.forEach((cell, i) => { cell.tabIndex = i === focused ? 0 : -1; });
  });
  board.addEventListener('keydown', event => {
    if (event.target.dataset.cell === undefined || !overlay.hidden) return;
    const i = Number(event.target.dataset.cell), row = Math.floor(i / game.cols), col = i % game.cols;
    const next = { ArrowLeft: row * game.cols + Math.max(0, col - 1), ArrowRight: row * game.cols + Math.min(game.cols - 1, col + 1), ArrowUp: Math.max(0, row - 1) * game.cols + col, ArrowDown: Math.min(game.rows - 1, row + 1) * game.cols + col, Home: row * game.cols, End: (row + 1) * game.cols - 1 }[event.key];
    if (next !== undefined) { event.preventDefault(); focusCell(next); }
    else if (event.key.toLowerCase() === 'f') { event.preventDefault(); move(i, true); }
    // Native button Enter/Space dispatch exactly one click, never a second manual move.
  });
  function showHint() {
    if (screen !== 'battle' || !overlay.hidden) return;
    hintTarget = game.hint();
    if (hintTarget.kind !== 'none') setMode(hintTarget.kind === 'mine' || hintTarget.kind === 'unflag');
    status.textContent = ({ opening: copy.ready, safe: copy.hintSafe, mine: copy.hintMine, unflag: copy.hintUnflag, none: copy.hintNone })[hintTarget.kind];
    render(); if (hintTarget.index !== undefined) focusCell(hintTarget.index);
  }
  function undoMove() {
    if (!game?.undo()) return;
    overlay.hidden = true; play.inert = false; cancelDialog = null; hintTarget = null;
    measurement.ended = false; measurement.resumed = true; measurement.reopenKey = {};
    status.textContent = copy.assisted; activate('battle'); render(); focusCell(focused); notify();
  }
  function closeDialog() {
    overlay.hidden = true; play.inert = false; cancelDialog = null;
    activate('battle'); returnFocus?.focus?.({ preventScroll: true });
  }
  function openDialog(heading, text, buttons, cancel = null) {
    returnFocus = document.activeElement; frame.close();
    dialogTitle.textContent = heading; dialogText.textContent = text;
    dialogActions.replaceChildren(...buttons); cancelDialog = cancel;
    overlay.hidden = false; play.inert = true; frame.activate('battle', { covered: true }); syncClock(); notify();
    buttons[0]?.focus({ preventScroll: true });
  }
  function requestChange(action, actionLabel = copy.confirm) {
    if (!game || !game.moves || ['won', 'lost'].includes(game.status)) { action(); return; }
    openDialog(copy.confirm, copy.replacePrompt, [button(copy.continue, closeDialog, true), button(actionLabel, () => {
      if (measurement.started && !measurement.ended) { measurement.ended = true; measurement.outcome = 'abandon'; notify(); }
      action();
    })], closeDialog);
  }
  function showResult() {
    const view = game.view();
    const text = `${copy.safe}: ${view.safe}/${game.rows * game.cols - game.total} · ${copy.time}: ${formatTime(nowSeconds())} · ${game.assisted ? copy.assisted : copy.clean}`;
    const buttons = [button(copy.again, () => newRound(game.level, true), true), button(copy.leave, showMain)];
    if (view.canUndo) buttons.push(button(copy.undo, undoMove));
    openDialog(game.status === 'won' ? copy.win : copy.lost, text, buttons);
  }
  overlay.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); cancelDialog?.(); return; }
    if (event.key !== 'Tab') return;
    const buttons = [...dialogActions.querySelectorAll('button:not([disabled])')];
    if (event.shiftKey && document.activeElement === buttons[0]) { event.preventDefault(); buttons.at(-1)?.focus(); }
    else if (!event.shiftKey && document.activeElement === buttons.at(-1)) { event.preventDefault(); buttons[0]?.focus(); }
  });
  level.addEventListener('change', () => { const next = level.value; level.value = game.level; if (next !== game.level) requestChange(() => newRound(next, true)); });
  window.addEventListener('weightplay:interaction-state', () => { syncClock(); notify(); });
  window.addEventListener('weightplay:analytics-ready', notify);
  document.addEventListener('visibilitychange', () => { syncClock(); notify(); });
  window.addEventListener('pagehide', () => { pageAway = true; syncClock(); notify(); });
  window.addEventListener('pageshow', () => { pageAway = false; syncClock(); notify(); });
  updateBest(); activate('main');
}
