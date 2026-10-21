/* Prism Breakers content adapter; the shared Frame and Play UI own the I9 chrome. */
(() => {
  'use strict';
  const initialize = () => {
  if (document.body?.dataset.wpGameId !== 'animal-prism-breakers') return;
  if (window.__WEIGHTPLAY_PRISM_BREAKERS_I9__) return;
  window.__WEIGHTPLAY_PRISM_BREAKERS_I9__ = true;

  const byId = id => document.getElementById(id);
  const frameRoot = byId('gameApp');
  const mainGroup = byId('mainGroup');
  const main = byId('mainScreen');
  const stageScreen = byId('stageScreen');
  const stage = stageScreen?.querySelector('.stage-canvas');
  const battleScreen = byId('battleScreen');
  const battle = battleScreen?.querySelector('.battle-canvas');
  const game = window.WeightPlayBlockTrilogyApp;
  const mainHeader = main?.querySelector('header');
  const stageHeader = stage?.querySelector('header');
  const battleLive = battle?.querySelector('.battle-live');
  const battleHeader = battleLive?.querySelector('header');
  const localeSelect = byId('localeSelect');
  const mainTitle = mainHeader?.querySelector('[data-game-title]');
  const poster = byId('poster');
  const copy = main?.querySelector('.hero-copy');
  const guide = document.querySelector('[data-wp-game-guide], .game-page-info-static, .game-page-info');
  const rail = byId('stageRail');
  const stageSummary = byId('stageSummary');
  const stageTitle = stageHeader?.querySelector('strong');
  const stageTitleHost = stageTitle?.parentElement;
  const stageHint = byId('stageHint');
  const stageHintCopy = byId('stageHintCopy');
  const stageNav = stage?.querySelector('.stage-tabs');
  const stageTab = byId('stagesTab');
  const battleStats = battleHeader?.querySelector('.battle-stats');
  const battleControls = byId('battleControls');
  const battleHelp = byId('battleHelp');
  const help = byId('helpModal');
  const leave = byId('leaveModal');
  const result = byId('resultModal');
  const resultCard = result?.querySelector('.result-layout');
  const actions = result?.querySelector('.modal-actions');
  const replay = byId('retry');
  const stagesButton = byId('resultStage');
  const next = byId('next');

  if (!frameRoot || !mainGroup || !main || !stageScreen || !stage || !battleScreen || !battle
      || !mainHeader || !stageHeader || !battleHeader || !mainTitle || !poster || !copy
      || !guide || !rail || !stageSummary || !stageTitle || !stageHint || !stageHintCopy
      || !stageNav || !stageTab || !battleLive || !battleStats || !battleControls
      || !battleHelp || !help || !leave || !result || !resultCard || !actions
      || !replay || !stagesButton || !next || !game || !window.WeightPlayScreenFrame
      || !window.WeightPlayPlayUI || !window.WeightPlayPrismBreakersStageConfig) {
    throw new Error('PRISM_BREAKERS_I9_FRAME_REQUIRED');
  }

  document.body.dataset.wpGameVersion = 'v26';

  const mainContent = document.createElement('div');
  mainContent.className = 'prism-main-content wp-standard-main-flow-node';
  const mainComposition = document.createElement('section');
  mainComposition.className = 'wp-standard-main-composition';
  const posterPane = document.createElement('div');
  posterPane.className = 'wp-standard-main-poster';
  main.insertBefore(mainContent, mainHeader.nextSibling);
  mainGroup.className = '';
  main.className = 'wp-standard-main-flow-owner';
  const hero = copy.closest('.hero');
  mainTitle.setAttribute('data-wp-frame-title', '');
  poster.setAttribute('data-wp-frame-poster', '');
  poster.classList.add('wp-standard-main-poster-media');
  copy.classList.remove('hero-copy');
  copy.classList.add('wp-standard-main-copy');
  copy.setAttribute('data-wp-frame-copy', '');
  copy.querySelector('p')?.setAttribute('data-wp-frame-summary', '');
  copy.querySelector('p')?.classList.add('wp-standard-main-summary');
  copy.querySelector('h1')?.remove();
  byId('mainProgress')?.setAttribute('data-wp-frame-progress', '');
  byId('mainProgress')?.setAttribute('data-wp-main-progress', '');
  byId('mainProgress')?.classList.add('wp-standard-main-progress');
  byId('start')?.setAttribute('data-wp-main-start', '');
  byId('start')?.setAttribute('data-wp-frame-action', 'primary');
  byId('start')?.classList.add('wp-standard-main-start');
  posterPane.append(poster);
  mainComposition.append(posterPane, copy);
  mainContent.append(mainComposition);
  const attachCurrentGuide = () => {
    const candidates = [...document.querySelectorAll('.game-page-info, [data-wp-game-guide]')];
    const currentGuide = candidates.find(node => !node.classList.contains('game-page-info-static')) || candidates[0];
    if (!currentGuide) return;
    for (const node of candidates) {
      if (node !== currentGuide) node.remove();
    }
    if (currentGuide.parentElement !== mainGroup || currentGuide.previousElementSibling !== main) {
      main.after(currentGuide);
    }
  };
  const guideObserver = new MutationObserver(attachCurrentGuide);
  guideObserver.observe(document.body, { childList: true, subtree: true });
  attachCurrentGuide();
  hero?.remove();

  stage.dataset.wpFramePlayFill = '';
  stage.dataset.wpLogicalStageCanvas = '';
  stage.dataset.wpCanvasMaxWidth = '920';
  stage.removeAttribute('data-wp-stage-landscape-width');
  stage.removeAttribute('data-wp-stage-landscape-height');
  stage.style.removeProperty('--wp-stage-art');
  const stageContent = document.createElement('div');
  stageContent.className = 'prism-stage-content';
  stage.insertBefore(stageContent, stageHeader.nextSibling);
  const stageInfo = document.createElement('div');
  stageInfo.className = 'prism-stage-progress';
  stageTitle.remove();
  stageInfo.append(stageSummary);
  stageHeader.append(stageTitle);
  stageContent.append(stageInfo);
  stageTitleHost?.remove();
  stageTitle.textContent = mainTitle.textContent;
  stageTitle.setAttribute('data-wp-frame-title', '');
  stageHeader.querySelector(':scope > .stage-badge')?.remove();
  rail.remove();
  stageContent.append(rail);
  stageHint.classList.add('sr-only');
  stageHint.setAttribute('aria-live', 'polite');
  stageHintCopy.textContent = '';
  stageHint.remove();
  stageScreen.append(stageHint);
  stageNav.dataset.wpFrameNav = '';
  stageNav.dataset.wpPlayActions = '';
  stageTab.dataset.wpFrameStageSlot = 'stages';
  stageTab.dataset.wpFrameAction = 'tab';

  battle.dataset.wpLogicalBattleCanvas = '';
  battle.dataset.wpFramePlayFill = '';
  battle.dataset.wpCanvasMaxWidth = '920';
  const battleContent = document.createElement('div');
  battleContent.className = 'wp-frame-play-content prism-battle-content';
  battleContent.style.gridRow = '1 / -1';
  battle.append(battleContent);
  battleContent.prepend(battleLive);
  for (const overlay of [help, leave, result]) battleContent.append(overlay);
  battleHelp.remove();
  battleHeader.querySelector('.battle-title strong')?.setAttribute('data-wp-frame-title', '');
  result.dataset.wpBattleSubstate = 'result';
  result.setAttribute('role', 'dialog');
  result.setAttribute('aria-modal', 'true');
  result.setAttribute('aria-labelledby', 'resultTitle');
  result.setAttribute('aria-describedby', 'resultText');
  resultCard.dataset.wpResultCard = '';
  actions.append(stagesButton, next, replay);

  const frame = window.WeightPlayScreenFrame.mount({
    root: frameRoot,
    localeSelect,
    playUI: true,
    scenes: {
      main: { root: main, header: mainHeader, content: mainContent },
      stage: { root: stage, header: stageHeader, content: stageContent, headerInfo: stageInfo },
      battle: { root: battle, header: battleHeader, content: battleContent, headerInfo: battleStats },
    },
  });

  const config = window.WeightPlayPrismBreakersStageConfig.create(game);
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

  const translated = source => window.PrismBreakersLocale?.translate?.(source)
    ?? window.WeightPlayGameRuntimeLocalizer?.translate?.(source)
    ?? source;
  function refreshResultActions() {
    const selected = game.selectedStage();
    const nextState = game.stageProgress(selected + 1);
    stagesButton.textContent = translated('Stages');
    next.textContent = translated('Next Stage');
    let replayCopy = translated('Replay');
    if (replayCopy === 'Replay' && document.documentElement.lang !== 'en') {
      replayCopy = translated('Retry');
    }
    replay.textContent = replayCopy === 'Retry' ? 'Replay' : replayCopy;
    stagesButton.hidden = false;
    next.hidden = false;
    replay.hidden = false;
    next.disabled = !nextState || nextState.locked;
  }

  function selectHighestUnlocked() {
    const index = game.highestUnlockedStage();
    game.selectStage(index);
    selector.refresh(index);
  }

  function syncBattleState() {
    const covered = !help.hidden || !leave.hidden || !result.hidden;
    battleLive.inert = covered;
    battleLive.setAttribute('aria-hidden', String(covered));
    frame.activate('battle', { covered });
    refreshResultActions();
  }

  function syncScene() {
    const screen = document.body.dataset.screen;
    if (!['main', 'stage', 'battle'].includes(screen)) return;
    if (screen === 'battle') {
      syncBattleState();
    } else {
      battleLive.inert = false;
      battleLive.removeAttribute('aria-hidden');
      frame.activate(screen);
    }
    if (screen === 'stage') selector.refresh(game.selectedStage());
  }

  function ensureBattleUtility() {
    if (!battleControls.contains(battleHelp)) battleControls.append(battleHelp);
  }

  const controlsObserver = new MutationObserver(ensureBattleUtility);
  controlsObserver.observe(battleControls, { childList: true });
  ensureBattleUtility();

  const selectMainStart = () => selectHighestUnlocked();
  const selectStagesTab = () => selectHighestUnlocked();
  const selectAfterResult = () => selectHighestUnlocked();
  byId('start')?.addEventListener('click', selectMainStart, true);
  stageTab.addEventListener('click', selectStagesTab, true);
  stagesButton.addEventListener('click', selectAfterResult, true);
  byId('leaveStage')?.addEventListener('click', selectAfterResult, true);
  rail.addEventListener('click', event => {
    const card = event.target.closest?.('button[aria-disabled="true"]');
    if (card && rail.contains(card)) {
      stageHintCopy.textContent = window.PrismBreakersLocale?.status?.lockedNotice
        || 'Complete the previous stage first.';
    }
  }, true);

  const sceneObserver = new MutationObserver(syncScene);
  sceneObserver.observe(document.body, { attributes: true, attributeFilter: ['data-screen'] });
  const modalObserver = new MutationObserver(syncScene);
  for (const modal of [help, leave, result]) {
    modalObserver.observe(modal, { attributes: true, attributeFilter: ['hidden'] });
  }
  const refreshStage = () => {
    selector.refresh(game.selectedStage());
    refreshResultActions();
  };
  for (const event of ['weightplay:shell-sync', 'weightplay:stage-sync', 'wonder:locale-change', 'wonder:i18n-ready']) {
    window.addEventListener(event, refreshStage);
  }

  syncScene();
  window.addEventListener('pagehide', event => {
    if (event.persisted) return;
    sceneObserver.disconnect();
    modalObserver.disconnect();
    controlsObserver.disconnect();
    guideObserver.disconnect();
    for (const name of ['weightplay:shell-sync', 'weightplay:stage-sync', 'wonder:locale-change', 'wonder:i18n-ready']) {
      window.removeEventListener(name, refreshStage);
    }
    selector.destroy();
    frame.destroy();
  }, { once: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
