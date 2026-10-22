/* Triple Match supplies game content; shared Frame and Play UI own all chrome and Stage geometry. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const root = $('gameFrame');
  const main = $('mainScreen');
  const stage = $('stageScreen');
  const battle = document.querySelector('.logical-canvas.battle-canvas');
  const game = window.__animalTripleMatch;
  const locale = $('localeSelect');
  const hero = main?.querySelector('.main-hero');
  const copy = hero?.querySelector('.main-copy');
  const poster = hero?.querySelector('.poster');
  const mainHeader = main?.querySelector('.main-header');
  const stageHeader = stage?.querySelector('.stage-header');
  const battleContent = $('battleLive');
  const battleHeader = battleContent?.querySelector('.battle-header');
  const stageRail = $('stageRail');
  const stageSummary = $('stageSummary');
  const stageBack = $('stageBack');
  const stageTitle = stageHeader?.querySelector('strong');
  if (!root || !main || !stage || !battle || !game || !locale || !hero || !copy || !poster
      || !mainHeader || !stageHeader || !battleHeader || !battleContent || !stageRail || !stageSummary
      || !stageBack || !stageTitle || !window.WeightPlayScreenFrame
      || !window.WeightPlayPlayUI || !window.createAnimalTripleMatchStageConfig) {
    throw new Error('TRIPLE_MATCH_I9_SHARED_FRAME_REQUIRED');
  }

  const mainTitle = mainHeader.querySelector('[data-wp-game-title]');
  mainTitle?.setAttribute('data-wp-frame-title', '');
  hero.classList.remove('main-hero');
  copy.dataset.wpFrameCopy = '';
  copy.querySelector('h1')?.setAttribute('hidden', '');
  copy.querySelector('[data-t="pitch"]')?.setAttribute('data-wp-frame-summary', '');
  poster.dataset.wpFramePoster = '';
  $('mainProgress').dataset.wpFrameProgress = '';
  $('startBtn').dataset.wpFrameAction = 'primary';

  const hiddenLocale = document.createElement('div');
  hiddenLocale.hidden = true;
  hiddenLocale.append(locale, $('soundBtn'));
  locale.closest('.locale-control')?.remove();
  root.append(hiddenLocale);

  stageTitle.hidden = true;
  stageTitle.dataset.wpFrameTitle = '';
  const stageContent = document.createElement('div');
  stageContent.className = 'triple-stage-content';
  stage.querySelector('.stage-tabs')?.remove();
  [...stage.children].filter(node => node !== stageHeader).forEach(node => stageContent.append(node));
  stageHeader.after(stageContent);

  const battleTitle = battleHeader.querySelector('.battle-title');
  const hud = battleHeader.querySelector('.hud');
  const hudStats = [...(hud?.children || [])];
  battleTitle.querySelectorAll('[data-wp-frame-stat]').forEach(node => node.removeAttribute('data-wp-frame-stat'));
  const help = $('helpBtn');
  const battleFrameTitle = document.createElement('strong');
  battleFrameTitle.hidden = true;
  battleFrameTitle.dataset.wpFrameTitle = '';
  battleHeader.append(battleFrameTitle);
  const battleInfo = document.createElement('div');
  battleInfo.append(battleTitle, ...hudStats);
  hud.remove();
  battleContent.prepend(battleInfo);
  battleContent.querySelector('.tools')?.append(help);
  help.dataset.wpFrameAction = 'secondary';
  battleHeader.remove();
  battle.prepend(battleHeader);

  const frame = window.WeightPlayScreenFrame.mount({
    root,
    localeSelect: locale,
    playUI: true,
    scenes: {
      main: {root: main, header: mainHeader, content: hero},
      stage: {root: stage, header: stageHeader, content: stageContent},
      battle: {root: battle, header: battleHeader, content: battleContent, headerInfo: battleInfo},
    },
  });
  const stageGroup = window.WeightPlayScreenFrame.createGroup().add(stageSummary);
  frame.stageTopUI.add(stageGroup);
  const battleGroup = window.WeightPlayScreenFrame.createGroup().add(battleTitle);
  hudStats.forEach(stat => battleGroup.add(stat));
  frame.battleTopUI.add(battleGroup);

  const stageUI = window.WeightPlayPlayUI.mountStage({
    page: stageContent,
    rail: stageRail,
    config: window.createAnimalTripleMatchStageConfig(game),
    selected: game.selectedStage(),
    onSelect: index => game.setSelectedStage(index),
    onStart: (index, event) => game.startStage(index, event),
    isActive: () => document.body.dataset.screen === 'stage',
  });
  game.attachStageUI(stageUI);
  game.attachFrame(frame);

  const modals = ['tutorialModal', 'firstPlanModal', 'leaveModal', 'resultModal'].map($);
  const sync = () => {
    const scene = document.body.dataset.screen || 'main';
    const covered = scene === 'battle' && modals.some(node => !node.hidden);
    battleContent.inert = scene !== 'battle' || covered;
    frame.activate(scene, {covered});
  };
  const observer = new MutationObserver(sync);
  observer.observe(document.body, {attributes:true, attributeFilter:['data-screen']});
  modals.forEach(node => observer.observe(node, {attributes:true, attributeFilter:['hidden']}));
  window.addEventListener('pagehide', event => {
    if (event.persisted) return;
    observer.disconnect();
    game.attachStageUI(null);
    game.attachFrame(null);
    stageUI.destroy();
    frame.destroy();
  });
  sync();
})();
