/* Game adapter. Shared code owns Main/Stage/Battle chrome and Stage gestures. */
(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const game = window.__BLOCK_BLAST__;
  const root = $('gameFrame');
  const main = root.querySelector('.main-canvas');
  const stage = root.querySelector('.stage-canvas');
  const battle = $('battleLive');
  const mainHeader = main.querySelector('header');
  const stageHeader = stage.querySelector('header');
  const battleHeader = battle.querySelector('header');
  const locale = $('localeSelect');

  locale.hidden = true;
  locale.style.setProperty('display', 'none', 'important');
  main.querySelector('.main-controls').hidden = true;
  $('mainGroup').style.minHeight = '0';

  const hero = main.querySelector('.hero');
  hero.classList.remove('hero');
  const copy = hero.querySelector('.hero-copy');
  copy.classList.remove('hero-copy');
  copy.dataset.wpFrameCopy = '';
  copy.querySelector('h1').hidden = true;
  copy.querySelector('small').hidden = true;
  copy.querySelector('p').dataset.wpFrameSummary = '';
  hero.querySelector('.poster').dataset.wpFramePoster = '';
  $('mainProgress').dataset.wpFrameProgress = '';
  mainHeader.querySelector('strong').dataset.wpFrameTitle = '';

  for (const id of ['startBtn', 'endlessBtn', 'nextBtn', 'retryBtn', 'helpClose', 'leaveContinue', 'leaveStage', 'resultStageBtn', 'battleHelp']) {
    $(id).dataset.wpFrameAction = ['startBtn', 'nextBtn'].includes(id) ? 'primary' : 'secondary';
  }

  const stageSummary = $('stageSummary');
  const stageRail = $('stageRail');
  const stageContent = document.createElement('div');
  stageContent.className = 'blast-stage-content';
  stageContent.append(stageRail);
  stage.append(stageContent);
  stageHeader.querySelector(':scope > div')?.remove();

  const battleInfo = document.createElement('div');
  battleInfo.dataset.wpFrameInfo = '';
  const battleGroup = window.WeightPlayScreenFrame.createGroup();
  battleGroup.add($('stageLabel'));
  for (const stat of [...battleHeader.querySelector('.battle-stats').children]) battleGroup.add(stat);
  battleHeader.querySelector('.battle-stats').remove();
  battleHeader.querySelector('.battle-title').remove();

  const battleContent = document.createElement('div');
  battleContent.className = 'blast-battle-content';
  for (const node of [...battle.children]) if (node !== battleHeader) battleContent.append(node);
  battleContent.append($('battleHelp'));
  battleContent.prepend(battleInfo);
  battle.append(battleContent);

  for (const header of [stageHeader, battleHeader]) {
    const title = document.createElement('span');
    title.hidden = true;
    title.dataset.wpFrameTitle = '';
    header.append(title);
  }

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
  frame.stageTopUI.add(window.WeightPlayScreenFrame.createGroup().add(stageSummary));
  frame.battleTopUI.add(battleGroup);

  const stageSelector = window.WeightPlayPlayUI.mountStage({
    page: stageContent,
    rail: stageRail,
    config: window.BlockBlastStageConfig({
      stages: game.stages,
      getState: game.getState,
      text: game.text,
      objectiveSummary: game.stageObjectiveSummary,
    }),
    selected: game.getState().selectedStage - 1,
    onSelect: index => game.selectStage(index + 1),
    onStart: index => game.start(index + 1, false),
    isActive: () => document.body.dataset.activeScreen === 'stage',
  });
  game.attachStageSelector(stageSelector);

  const modals = ['helpModal', 'leaveModal', 'resultModal'].map($);
  const sync = () => {
    const scene = document.body.dataset.activeScreen || 'main';
    const covered = scene === 'battle' && modals.some(node => !node.hidden);
    battleContent.inert = scene !== 'battle' || covered;
    frame.activate(scene, {covered});
  };
  const observer = new MutationObserver(sync);
  observer.observe(document.body, {attributes: true, attributeFilter: ['data-active-screen']});
  modals.forEach(node => observer.observe(node, {attributes: true, attributeFilter: ['hidden']}));
  window.addEventListener('pagehide', event => {
    if (!event.persisted) {
      observer.disconnect();
      stageSelector.destroy();
      frame.destroy();
    }
  });
  sync();
})();
