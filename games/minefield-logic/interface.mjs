import { Minefield, LEVELS } from './engine.mjs?v=18';
import { CAMPAIGN_STAGES } from './campaign.mjs?v=18';
import { COPY, LOCALES, ROUTES, LANGUAGES } from './copy.mjs?v=18';

export function mountMinefield() {
  const root = document.querySelector('#logicApp');
  if (!root || root.dataset.mfMounted === '18') return;
  const segment = location.pathname.split('/').filter(Boolean)[0]?.toLowerCase();
  const locale = LOCALES[ROUTES.indexOf(segment)] || (LOCALES.includes(document.documentElement.lang) ? document.documentElement.lang : 'en');
  const copy = COPY[locale];
  const title = window.WEIGHTPLAY_GAME_TITLES?.['minefield-logic']?.[locale] || document.title.replace(/\s*\|\s*WeightPlay.*$/, '');
  const storageKey = 'weightplay:minefield-logic:records:v1';
  const records = { level: 'easy', best: {}, campaign: { unlockedStage: 1, completedStages: [] } };
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (Object.hasOwn(LEVELS, saved?.level)) records.level = saved.level;
    for (const key of Object.keys(LEVELS)) {
      const value = saved?.best?.[key];
      if (typeof value === 'number' && Number.isFinite(value) && value >= 0) records.best[key] = value;
    }
    const unlocked = saved?.campaign?.unlockedStage;
    if (Number.isInteger(unlocked) && unlocked >= 1 && unlocked <= CAMPAIGN_STAGES.length) records.campaign.unlockedStage = unlocked;
    if (Array.isArray(saved?.campaign?.completedStages)) {
      records.campaign.completedStages = [...new Set(saved.campaign.completedStages.filter(
        id => Number.isInteger(id) && id >= 1 && id <= CAMPAIGN_STAGES.length,
      ))].sort((a, b) => a - b);
      const impliedUnlock = Math.min(CAMPAIGN_STAGES.length, Math.max(1, ...records.campaign.completedStages.map(id => id + 1)));
      records.campaign.unlockedStage = Math.max(records.campaign.unlockedStage, impliedUnlock);
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
  document.body.dataset.logicGame = 'minefield-logic'; document.body.dataset.gameVersion = 'v18';
  document.body.dataset.runtimeLocalize = 'off';
  document.body.dataset.wpGameId = 'minefield-logic';
  root.dataset.wpFrameRoot = ''; root.dataset.mfNative = ''; root.dataset.mfMounted = '18';
  root.setAttribute('data-runtime-localize', 'off');
  document.body.querySelector(':scope > h1')?.remove();
  root.replaceChildren();

  const main = el('main'), stageScreen = el('section'), battle = el('section');
  main.id = 'logicMain'; main.dataset.screen = 'main';
  stageScreen.id = 'logicStages'; stageScreen.dataset.screen = 'stage'; stageScreen.hidden = true;
  stageScreen.dataset.wpStandardStageScreen = '';
  stageScreen.dataset.wpLogicalStageCanvas = '';
  stageScreen.dataset.wpCanvasMaxWidth = '920';
  stageScreen.dataset.wpStageLandscapeWidth = '760';
  stageScreen.dataset.wpStageLandscapeHeight = '334';
  stageScreen.style.setProperty('--wp-stage-art', 'url("/assets/interface7-redrawn/minefield-logic.webp")');
  battle.id = 'logicBattle'; battle.dataset.screen = 'battle'; battle.hidden = true;
  battle.setAttribute('aria-label', title); battle.dataset.wpBattleCanvasRoot = '';
  battle.dataset.wpLogicalBattleCanvas = '';
  // All transforms, viewport geometry and restoration remain shared-owned.
  battle.dataset.wpBattleMinWidth = '390'; battle.dataset.wpBattleMinHeight = '720';
  battle.dataset.wpBattleLandscapeWidth = '760'; battle.dataset.wpBattleLandscapeHeight = '334';
  const mainHeader = el('header'), stageHeader = el('header'), battleHeader = el('header');
  const home = el('a'); home.href = '/'; home.dataset.wpReturn = 'main'; home.setAttribute('aria-label', copy.back);
  const stageHome = el('a'); stageHome.href = '/'; stageHome.dataset.wpReturn = 'stage'; stageHome.setAttribute('aria-label', copy.leave);
  const back = button(copy.leave, () => requestChange(() => currentStage ? showStages() : showMain(), currentStage ? copy.campaign.returnStages : copy.leave));
  back.removeAttribute('data-wp-frame-action'); back.dataset.wpReturn = 'battle'; back.setAttribute('aria-label', copy.leave);
  const mainTitle = el('h1', '', title), stageTitle = el('strong', '', title), battleTitle = el('strong', '', title);
  mainTitle.dataset.wpFrameTitle = ''; stageTitle.dataset.wpFrameTitle = ''; battleTitle.dataset.wpFrameTitle = '';
  mainHeader.append(home, mainTitle); stageHeader.append(stageHome, stageTitle);
  battleHeader.append(back, battleTitle);
  const mainContent = el('div'), mainCopy = el('div'); mainCopy.dataset.wpFrameCopy = '';
  const poster = el('img', 'main-poster'); poster.dataset.wpFramePoster = '';
  poster.src = '/assets/interface7-redrawn/minefield-logic.webp'; poster.alt = ''; poster.width = 420; poster.height = 420;
  const summary = el('p', '', copy.summary); summary.dataset.wpFrameSummary = '';
  const mainProgress = el('p', 'mf-main-progress'); mainProgress.dataset.wpFrameProgress = '';
  const bestLine = el('p', 'mf-best');
  const start = button(copy.start, showStages, true); start.dataset.wpMainStart = '';
  const quick = button(copy.campaign.quickButton, () => newRound(records.level));
  mainCopy.append(summary, mainProgress, quick, bestLine, start); mainContent.append(poster, mainCopy); main.append(mainHeader, mainContent);

  const stageContent = el('div', 'mf-stage-content');
  const stageProgress = el('p', 'mf-stage-progress'); stageProgress.setAttribute('role', 'status'); stageProgress.setAttribute('aria-live', 'polite');
  const stageIntro = el('p', 'mf-stage-intro', copy.campaign.mapIntro);
  const stageList = el('div', 'mf-stage-grid stage-grid stage-rail');
  stageList.setAttribute('role', 'region'); stageList.setAttribute('aria-label', copy.campaign.mapTitle);
  stageList.dataset.wpStageCenterObserver = 'manual';
  stageList.dataset.wpStageRecommendation = 'last';
  stageContent.append(stageProgress, stageIntro, stageList); stageScreen.append(stageHeader, stageContent);
  const stageNav = el('nav', 'mf-stage-tabs stage-tabs');
  stageNav.dataset.wpFrameNav = ''; stageNav.dataset.wpFrameStageNav = '';
  stageNav.setAttribute('aria-label', copy.campaign.mapTitle);
  const emptyTeamSlot = el('span'); emptyTeamSlot.dataset.wpFrameStageSlot = 'team'; emptyTeamSlot.setAttribute('aria-hidden', 'true');
  const stagesTab = button(copy.campaign.stagesTab, () => showStages());
  stagesTab.classList.add('mf-stage-tab', 'stage-tab'); stagesTab.dataset.wpFrameStageSlot = 'stages';
  stagesTab.dataset.wpFrameAction = 'tab';
  stagesTab.setAttribute('aria-current', 'page');
  const emptyEquipmentSlot = el('span'); emptyEquipmentSlot.dataset.wpFrameStageSlot = 'equipment'; emptyEquipmentSlot.setAttribute('aria-hidden', 'true');
  stageNav.append(emptyTeamSlot, stagesTab, emptyEquipmentSlot); stageScreen.append(stageNav);
  stageList.addEventListener('wonder:stage-snap', event => {
    const index = Number(event.detail?.index);
    if (Number.isInteger(index) && index >= 0 && index < CAMPAIGN_STAGES.length) selectStage(index + 1);
  });

  const play = el('div', 'mf-play'); play.dataset.wpFrameLogicalActions = 'battle';
  const hud = el('div', 'mf-hud'), values = {};
  const modeStat = el('div', 'mf-hud-stat');
  const modeLabel = el('span', '', copy.campaign.mode), modeValue = el('strong', '', copy.campaign.quickButton);
  modeStat.append(modeLabel, modeValue); hud.append(modeStat);
  for (const key of ['time', 'mines', 'safe']) {
    const group = el('div', 'mf-hud-stat'), label = el('span', '', copy[key]), value = el('strong', '', '0');
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
  const hint = button(copy.hint, showHint), undo = button(copy.undo, undoMove), fresh = button(copy.new, () => requestChange(() => currentStage ? startStage(currentStage, true) : newRound(game.level, true), copy.new));
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
  root.append(main, stageScreen, battle, localeSelect);
  const guide = document.querySelector('.game-page-info-static');
  // Keep source-generated initial HTML permanently in place: no runtime FAQ,
  // comparison, related-link or locale content replacement.
  const guideBest = guide?.querySelector('[data-mf-best]');
  if (guide) guide.setAttribute('data-runtime-localize', 'off');
  const frame = window.WeightPlayScreenFrame.mount({ root, localeSelect, scenes: {
    main: { root: main, header: mainHeader, content: mainContent },
    stage: { root: stageScreen, header: stageHeader, content: stageContent },
    battle: { root: battle, header: battleHeader, content: play, headerInfo: hud },
  } });
  let game = null, screen = 'main', currentStage = null, flagMode = false, cells = [], focused = 0, hintTarget = null;
  let elapsed = 0, runningSince = null, ticker = null, pageAway = false, cancelDialog = null, returnFocus = null;
  const measurement = { screen: 'main', roundKey: null, started: false, ended: false, restart: false, outcome: 'complete' };
  const stageCardNodes = new Map();
  let selectedStageId = records.campaign.unlockedStage;
  const readMeasurement = () => ({ ...measurement, screen: measurement.ended ? null : screen, node: battle, paused: runningSince === null, activityMode: 'input', idleSeconds: 300 });
  const notify = () => { try { window.WonderAnalytics?.game?.observeState?.(readMeasurement); } catch { /* Optional telemetry. */ } };
  const nowSeconds = () => Math.floor((elapsed + (runningSince === null ? 0 : performance.now() - runningSince)) / 1000);
  function updateCampaignProgress() {
    const completed = new Set(records.campaign.completedStages);
    stageProgress.textContent = applyTemplate(copy.campaign.progress, {
      cleared: completed.size, unlocked: records.campaign.unlockedStage,
    });
    mainProgress.textContent = applyTemplate(copy.campaign.mainProgress, {
      cleared: completed.size, unlocked: records.campaign.unlockedStage,
    });
  }
  function updateStageCardSelection() {
    for (const [id, card] of stageCardNodes) {
      const selected = id === selectedStageId;
      card.classList.toggle('selected', selected);
      card.classList.toggle('centered', selected);
      card.classList.toggle('is-centered', selected);
      card.classList.toggle('wp-stage-centered', selected);
      card.setAttribute('aria-current', selected ? 'true' : 'false');
      card.tabIndex = selected ? 0 : -1;
      if (selected && id <= records.campaign.unlockedStage) card.dataset.wpStageRecommended = 'true';
      else delete card.dataset.wpStageRecommended;
    }
  }
  function selectStage(id, center = false, focus = false) {
    selectedStageId = Math.max(1, Math.min(CAMPAIGN_STAGES.length, id));
    updateStageCardSelection();
    const card = stageCardNodes.get(selectedStageId);
    if (center && card) {
      const centerWithinRail = () => {
        if (stageCardNodes.get(selectedStageId) !== card || !stageScreen.getClientRects().length) return;
        const maximum = Math.max(0, stageList.scrollWidth - stageList.clientWidth);
        const rtl = getComputedStyle(stageList).direction === 'rtl';
        const target = card.offsetLeft + card.offsetWidth / 2 - stageList.clientWidth / 2;
        const bounded = rtl ? Math.max(-maximum, Math.min(0, target)) : Math.max(0, Math.min(maximum, target));
        const previousBehavior = stageList.style.getPropertyValue('scroll-behavior');
        const previousBehaviorPriority = stageList.style.getPropertyPriority('scroll-behavior');
        stageList.style.setProperty('scroll-behavior', 'auto', 'important');
        stageList.scrollLeft = bounded;
        if (previousBehavior) stageList.style.setProperty('scroll-behavior', previousBehavior, previousBehaviorPriority);
        else stageList.style.removeProperty('scroll-behavior');
      };
      centerWithinRail();
      requestAnimationFrame(centerWithinRail);
    }
    if (focus) card?.focus({ preventScroll: true });
  }
  const recenterStageOnResize = () => {
    if (screen === 'stage') requestAnimationFrame(() => selectStage(selectedStageId, true));
  };
  window.addEventListener('resize', recenterStageOnResize, { passive: true });
  window.visualViewport?.addEventListener('resize', recenterStageOnResize, { passive: true });
  function renderStageMap() {
    updateCampaignProgress();
    if (!stageCardNodes.size) {
      for (const stage of CAMPAIGN_STAGES) {
        const card = button('', () => {
          if (stage.id > records.campaign.unlockedStage) return;
          selectStage(stage.id);
          startStage(stage, false);
        });
        card.removeAttribute('data-wp-frame-action');
        card.classList.add('stage-card', 'mf-stage-card');
        card.dataset.stageId = String(stage.id);
        card.dataset.index = String(stage.id - 1);
        card.dataset.stageIndex = String(stage.id - 1);
        card.setAttribute('aria-posinset', String(stage.id));
        card.setAttribute('aria-setsize', String(CAMPAIGN_STAGES.length));
        const number = el('span', 'mf-stage-number');
        const arc = el('span', 'mf-stage-arc-label');
        const mines = el('span', 'mf-stage-mines');
        const state = el('span', 'mf-stage-state');
        card.append(number, arc, mines, state);
        card.addEventListener('keydown', event => {
          if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
          event.preventDefault(); event.stopPropagation();
          const rtl = document.documentElement.dir === 'rtl';
          const next = event.key === 'Home' ? 1 : event.key === 'End' ? records.campaign.unlockedStage
            : Math.max(1, Math.min(records.campaign.unlockedStage, stage.id + (event.key === 'ArrowRight' ? (rtl ? -1 : 1) : (rtl ? 1 : -1))));
          selectStage(next, true, true);
        });
        stageCardNodes.set(stage.id, card);
        stageList.append(card);
      }
    }
    const completed = new Set(records.campaign.completedStages);
    for (const stage of CAMPAIGN_STAGES) {
      const card = stageCardNodes.get(stage.id);
      const unlocked = stage.id <= records.campaign.unlockedStage;
      const cleared = completed.has(stage.id);
      const stateText = cleared ? copy.campaign.cleared : unlocked ? copy.campaign.unlocked : copy.campaign.locked;
      const title = applyTemplate(copy.campaign.stage, { n: stage.id });
      card.disabled = !unlocked;
      card.dataset.stageState = cleared ? 'cleared' : unlocked ? 'unlocked' : 'locked';
      card.setAttribute('aria-disabled', String(!unlocked));
      card.setAttribute('aria-label', [title, applyTemplate(copy.campaign.arc, { n: stage.arc }), `${stage.mines.length} ${copy.mines.toLowerCase()}`, stage.checkpoint ? copy.campaign.checkpoint : '', stateText].filter(Boolean).join(', '));
      card.querySelector('.mf-stage-number').textContent = title;
      card.querySelector('.mf-stage-arc-label').textContent = applyTemplate(copy.campaign.arc, { n: stage.arc });
      card.querySelector('.mf-stage-mines').textContent = `${stage.mines.length} ${copy.mines.toLowerCase()}${stage.checkpoint ? ` · ${copy.campaign.checkpoint}` : ''}`;
      card.querySelector('.mf-stage-state').textContent = stateText;
      card.toggleAttribute('data-cleared', cleared);
      card.toggleAttribute('data-checkpoint', stage.checkpoint);
    }
    updateStageCardSelection();
  }
  function showStages() {
    if (measurement.started && !measurement.ended) { measurement.ended = true; measurement.outcome = 'abandon'; }
    overlay.hidden = true; play.inert = false; cancelDialog = null; hintTarget = null;
    overlay.classList.remove('is-result'); dialogActions.classList.remove('is-result');
    selectedStageId = currentStage?.id ?? records.campaign.unlockedStage;
    renderStageMap(); activate('stage');
    requestAnimationFrame(() => selectStage(selectedStageId, true, true));
  }
  function syncClock() {
    const allowed = screen === 'battle' && game?.status === 'playing' && measurement.started && !document.hidden && !pageAway && overlay.hidden && !root.querySelector('.wp-frame-popover:not([hidden])');
    if (!allowed && runningSince !== null) { elapsed += performance.now() - runningSince; runningSince = null; }
    if (!allowed && ticker !== null) { clearInterval(ticker); ticker = null; }
    if (allowed && runningSince === null) runningSince = performance.now();
    if (allowed && ticker === null) ticker = setInterval(() => { values.time.textContent = formatTime(nowSeconds()); }, 250);
    values.time.textContent = formatTime(nowSeconds());
  }
  function activate(next) {
    frame.close(); screen = next;
    main.hidden = next !== 'main'; stageScreen.hidden = next !== 'stage'; battle.hidden = next !== 'battle'; if (guide) guide.hidden = next !== 'main';
    frame.activate(next, { covered: next === 'battle' && !overlay.hidden });
    window.WeightPlayBattleCanvas?.sync?.(); syncClock(); notify();
  }
  function updateBest() {
    const best = records.best[records.level];
    const text = `${copy.best} · ${copy[records.level]}: ${best === undefined ? '—' : formatTime(best)}`;
    bestLine.textContent = text; if (guideBest) guideBest.textContent = `${copy[records.level]}: ${best === undefined ? '—' : formatTime(best)}`;
    updateCampaignProgress();
  }
  function showMain() {
    if (measurement.started && !measurement.ended) { measurement.ended = true; measurement.outcome = 'abandon'; }
    overlay.hidden = true; play.inert = false; cancelDialog = null; hintTarget = null; currentStage = null;
    overlay.classList.remove('is-result'); dialogActions.classList.remove('is-result'); level.hidden = false;
    updateBest(); activate('main'); start.focus({ preventScroll: true });
  }
  stageHome.addEventListener('click', event => { event.preventDefault(); showMain(); });
  function newRound(difficulty, restart = false) {
    startRound(difficulty, restart, null);
  }
  function startStage(stage, restart = false) {
    startRound('easy', restart, stage);
  }
  function startRound(difficulty, restart, authoredStage) {
    if (!Object.hasOwn(LEVELS, difficulty)) difficulty = 'easy';
    overlay.hidden = true; play.inert = false; cancelDialog = null;
    overlay.classList.remove('is-result'); dialogActions.classList.remove('is-result');
    if (ticker !== null) clearInterval(ticker); ticker = null; runningSince = null; elapsed = 0;
    currentStage = authoredStage;
    game = authoredStage
      ? new Minefield(difficulty, Math.random, { mines: authoredStage.mines, start: authoredStage.start })
      : new Minefield(difficulty);
    if (authoredStage && !game.prepareAuthoredOpening()) throw new Error(`Could not prepare Minefield Stage ${authoredStage.id}`);
    if (!authoredStage) { records.level = difficulty; persist(); }
    level.value = difficulty; level.hidden = Boolean(authoredStage);
    toolbar.classList.toggle('is-stage', Boolean(authoredStage));
    viewport.classList.toggle('is-stage', Boolean(authoredStage));
    modeValue.textContent = authoredStage
      ? applyTemplate(copy.campaign.shortBattle, { n: authoredStage.id })
      : copy[difficulty];
    back.setAttribute('aria-label', authoredStage ? copy.campaign.returnStages : copy.leave);
    play.classList.toggle('is-stage', Boolean(authoredStage));
    Object.assign(measurement, { roundKey: {}, started: false, ended: false, restart, outcome: 'complete', resumed: false, reopenKey: null });
    hintTarget = null; cells = []; board.replaceChildren();
    board.setAttribute('aria-rowcount', String(game.rows)); board.setAttribute('aria-colcount', String(game.cols));
    board.style.setProperty('--mf-cols', game.cols);
    const primaryIndex = authoredStage ? game.view().cells.findIndex(cell => !cell.open) : 0;
    focused = Math.max(0, primaryIndex);
    for (let r = 0; r < game.rows; r += 1) {
      const row = el('div', 'mf-row'); row.setAttribute('role', 'row');
      for (let c = 0; c < game.cols; c += 1) {
        const cell = el('button', 'mf-cell'); cell.type = 'button'; cell.dataset.cell = String(cells.length);
        if (cells.length === primaryIndex) cell.dataset.wpPrimaryAction = '';
        cell.setAttribute('role', 'gridcell'); cell.setAttribute('aria-rowindex', String(r + 1)); cell.setAttribute('aria-colindex', String(c + 1));
        cells.push(cell); row.append(cell);
      }
      board.append(row);
    }
    viewport.scrollTop = 0; viewport.scrollLeft = 0;
    setMode(false); status.textContent = authoredStage ? copy.campaign.opening : copy.ready;
    render(); activate('battle'); cells[focused]?.focus({ preventScroll: true });
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
      if (game.status === 'won' && currentStage) {
        records.campaign.completedStages = [...new Set([...records.campaign.completedStages, currentStage.id])].sort((a, b) => a - b);
        records.campaign.unlockedStage = Math.min(CAMPAIGN_STAGES.length, Math.max(records.campaign.unlockedStage, currentStage.id + 1));
        persist();
      }
      if (game.status === 'won' && !game.assisted && !currentStage) {
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
    status.textContent = ({ opening: currentStage ? copy.campaign.opening : copy.ready, safe: copy.hintSafe, mine: copy.hintMine, unflag: copy.hintUnflag, none: copy.hintNone })[hintTarget.kind];
    render(); if (hintTarget.index !== undefined) focusCell(hintTarget.index);
  }
  function undoMove() {
    if (!game?.undo()) return;
    overlay.hidden = true; play.inert = false; cancelDialog = null; hintTarget = null;
    overlay.classList.remove('is-result'); dialogActions.classList.remove('is-result');
    measurement.ended = false; measurement.resumed = true; measurement.reopenKey = {};
    status.textContent = copy.assisted; activate('battle'); render(); focusCell(focused); notify();
  }
  function closeDialog() {
    overlay.hidden = true; play.inert = false; cancelDialog = null;
    overlay.classList.remove('is-result'); dialogActions.classList.remove('is-result');
    activate('battle'); returnFocus?.focus?.({ preventScroll: true });
  }
  function openDialog(heading, text, buttons, cancel = null, isResult = false) {
    returnFocus = document.activeElement; frame.close();
    dialogTitle.textContent = heading; dialogText.textContent = text;
    dialogActions.replaceChildren(...buttons); cancelDialog = cancel;
    overlay.classList.toggle('is-result', isResult); dialogActions.classList.toggle('is-result', isResult);
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
    const won = game.status === 'won';
    const summary = `${copy.safe}: ${view.safe}/${game.rows * game.cols - game.total} · ${copy.time}: ${formatTime(nowSeconds())} · ${game.assisted ? copy.assisted : copy.clean}`;
    if (currentStage) {
      const stageMessage = won
        ? currentStage.id === CAMPAIGN_STAGES.length
          ? copy.campaign.finale
          : applyTemplate(copy.campaign.won, { n: currentStage.id, next: currentStage.id + 1 })
        : applyTemplate(copy.campaign.lost, { n: currentStage.id });
      const stages = button(copy.campaign.stagesTab, showStages);
      const next = button(copy.campaign.nextStage, () => startStage(CAMPAIGN_STAGES[currentStage.id], true));
      next.disabled = !won || currentStage.id >= CAMPAIGN_STAGES.length;
      const replay = button(copy.campaign.replay, () => startStage(currentStage, true));
      const buttons = [stages, next, replay];
      if (view.canUndo) buttons.push(button(copy.undo, undoMove));
      openDialog(won ? copy.win : copy.lost, `${stageMessage} · ${summary}`, buttons, null, true);
      return;
    }
    const buttons = [button(copy.again, () => newRound(game.level, true), true), button(copy.leave, showMain)];
    if (view.canUndo) buttons.push(button(copy.undo, undoMove));
    openDialog(won ? copy.win : copy.lost, summary, buttons);
  }
  overlay.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); cancelDialog?.(); return; }
    if (event.key !== 'Tab') return;
    const buttons = [...dialogActions.querySelectorAll('button:not([disabled])')];
    if (event.shiftKey && document.activeElement === buttons[0]) { event.preventDefault(); buttons.at(-1)?.focus(); }
    else if (!event.shiftKey && document.activeElement === buttons.at(-1)) { event.preventDefault(); buttons[0]?.focus(); }
  });
  level.addEventListener('change', () => { const next = level.value; level.value = game.level; if (!currentStage && next !== game.level) requestChange(() => newRound(next, true)); });
  window.addEventListener('weightplay:interaction-state', () => { syncClock(); notify(); });
  window.addEventListener('weightplay:analytics-ready', notify);
  document.addEventListener('visibilitychange', () => { syncClock(); notify(); });
  window.addEventListener('pagehide', () => { pageAway = true; syncClock(); notify(); });
  window.addEventListener('pageshow', () => { pageAway = false; syncClock(); notify(); });
  updateBest(); activate('main');
}
