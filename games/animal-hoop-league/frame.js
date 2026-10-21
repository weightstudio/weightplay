/* Hoop League content adapter; shared frame and Play UI own scene chrome. */
(() => {
  'use strict';
  if (document.body?.dataset.wpGameId !== 'animal-hoop-league') return;
  if (window.__WEIGHTPLAY_HOOP_LEAGUE_I9__) return;
  window.__WEIGHTPLAY_HOOP_LEAGUE_I9__ = true;

  const byId = id => document.getElementById(id);
  const root = byId('app');
  const main = byId('main-screen');
  const stage = byId('stage-screen');
  const battle = byId('battle-screen');
  const game = window.WeightPlayHoopLeagueI9;
  const mainHeader = main?.querySelector('.m5-header');
  const stageHeader = stage?.querySelector('header');
  const battleHeader = battle?.querySelector('header');
  const localeSelect = byId('localeSelect');
  const mainTitle = mainHeader?.querySelector('[data-wp-game-title]');
  const poster = main?.querySelector('.m5-cover');
  const copy = main?.querySelector('.m5-copy');
  const rail = byId('stage-list');
  const battleStatus = byId('battle-status');
  const canvasWrap = battle?.querySelector('.m5-canvas-wrap');
  const controls = byId('battle-controls');
  const hint = battle?.querySelector('.m5-hint');
  const result = byId('result-screen');
  const utility = byId('battle-utility');
  const stageLabel = byId('stage-label');
  const scoreLabel = byId('score-label');

  if (!root || !main || !stage || !battle || !mainHeader || !stageHeader || !battleHeader
      || !mainTitle || !poster || !copy || !rail || !battleStatus || !canvasWrap || !controls
      || !hint || !result || !utility || !stageLabel || !scoreLabel || !game
      || !window.WeightPlayScreenFrame || !window.WeightPlayPlayUI
      || !window.WeightPlayHoopLeagueStageConfig) {
    throw new Error('ANIMAL_HOOP_LEAGUE_I9_FRAME_REQUIRED');
  }

  document.body.dataset.wpInterfaceVersion = '9';
  document.body.dataset.wpGameVersion = 'v9';

  const mainContent = document.createElement('div');
  mainContent.className = 'hoop-main-content';
  mainTitle.setAttribute('data-wp-frame-title', '');
  poster.setAttribute('data-wp-frame-poster', '');
  copy.setAttribute('data-wp-frame-copy', '');
  copy.querySelector('.m5-lede')?.setAttribute('data-wp-frame-summary', '');
  byId('main-progress')?.setAttribute('data-wp-frame-progress', '');
  byId('main-progress')?.setAttribute('data-wp-main-progress', '');
  byId('start-game')?.setAttribute('data-wp-main-start', '');
  byId('start-game')?.setAttribute('data-wp-frame-action', 'primary');
  main.insertBefore(mainContent, mainHeader.nextSibling);
  mainContent.append(poster, copy);

  stage.removeAttribute('data-wp-standard-stage-screen');
  stage.style.removeProperty('background-image');
  const stageContent = document.createElement('div');
  stageContent.className = 'hoop-stage-content';
  stageHeader.querySelector('h2')?.setAttribute('data-wp-frame-title', '');
  stage.append(stageContent);
  stageContent.append(rail);

  const battleContent = document.createElement('div');
  battleContent.className = 'wp-frame-play-content hoop-battle-content';
  battle.dataset.wpFramePlayFill = '';
  stage.dataset.wpFramePlayFill = '';
  const courtArea = document.createElement('div');
  courtArea.className = 'hoop-court-area';
  const controlsArea = document.createElement('div');
  controlsArea.className = 'hoop-controls-area';
  const title = document.createElement('strong');
  title.setAttribute('data-wp-frame-title', '');
  title.textContent = mainTitle.textContent;
  battleHeader.append(title);
  const battleInfo = document.createElement('div');
  battleInfo.className = 'hoop-battle-info';
  battleInfo.append(stageLabel, scoreLabel);
  const utilitySlot = document.createElement('div');
  utilitySlot.className = 'hoop-court-utility';
  utilitySlot.append(utility);
  canvasWrap.append(utilitySlot);
  canvasWrap.querySelector('#arena')?.setAttribute('data-wp-court-canvas', '');
  courtArea.append(battleStatus, canvasWrap);
  controlsArea.append(controls, hint);
  battle.append(battleContent);
  battleContent.append(courtArea, controlsArea, result);
  for (const overlay of battle.querySelectorAll('.hoop-help,.hoop-leave-dialog')) battleContent.append(overlay);
  battleContent.append(battleInfo);

  const frame = window.WeightPlayScreenFrame.mount({
    root,
    localeSelect,
    playUI: true,
    scenes: {
      main: { root: main, header: mainHeader, content: mainContent },
      stage: { root: stage, header: stageHeader, content: stageContent },
      battle: { root: battle, header: battleHeader, content: battleContent, headerInfo: battleInfo },
    },
  });

  const config = window.WeightPlayHoopLeagueStageConfig.create(game);
  const selector = window.WeightPlayPlayUI.mountStage({
    page: stageContent,
    rail,
    config,
    selected: game.selectedStage(),
    isActive: () => frame.active === 'stage',
    onSelect: game.selectStage,
    onStart: game.startStage,
  });
  game.attachStageController(selector);

  function syncScene() {
    const screen = game.currentScreen();
    if (!['main', 'stage', 'battle'].includes(screen)) return;
    frame.activate(screen, { covered: game.isCovered() });
    if (screen === 'stage') selector.refresh(game.selectedStage());
  }
  const refreshStage = () => selector.refresh(game.selectedStage());
  for (const event of ['weightplay:shell-sync', 'weightplay:battle-open', 'weightplay:market-locale-change', 'wonder:locale-change', 'wonder:i18n-ready']) {
    window.addEventListener(event, event.startsWith('weightplay:') && event !== 'weightplay:shell-sync' && event !== 'weightplay:battle-open' ? refreshStage : syncScene);
  }
  syncScene();

  window.addEventListener('pagehide', event => {
    if (event.persisted) return;
    for (const name of ['weightplay:shell-sync', 'weightplay:battle-open', 'weightplay:market-locale-change', 'wonder:locale-change', 'wonder:i18n-ready']) {
      window.removeEventListener(name, name.startsWith('weightplay:') && name !== 'weightplay:shell-sync' && name !== 'weightplay:battle-open' ? refreshStage : syncScene);
    }
    selector.destroy();
    frame.destroy();
  }, { once: true });
})();
