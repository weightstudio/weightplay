/* Hexa Sort content adapter; shared Frame and Play UI own the screen chrome and Stage rail. */
(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const root = $('gameFrame');
  const main = $('main');
  const stage = root.querySelector('.stage-canvas');
  const stageContent = $('stageContent');
  const rail = $('stageRail');
  const battle = $('battleCanvas');
  const legacyBattle = $('battleLive');
  const locale = $('localeSelect');
  const game = window.__HEXA_SORT__;

  if (!root || !main || !stage || !stageContent || !rail || !battle || !legacyBattle || !locale
      || !game || !window.WeightPlayPlayUI || !window.createHexaSortStageConfig) {
    throw new Error('HEXA_SORT_I9_FRAME_REQUIRED');
  }

  const mainHeader = main.querySelector('header');
  const stageHeader = stage.querySelector('header');
  const stageSummary = $('stageSummary');
  battle.classList.add('battle-live', 'hexa-live');
  battle.append(...legacyBattle.children);
  legacyBattle.remove();
  const battleHeader = battle.querySelector('header');
  const hero = main.querySelector('.hero');
  const copy = hero?.querySelector('.hero-copy');
  const poster = hero?.querySelector('.poster');
  const mainControls = mainHeader?.querySelector('.main-controls');

  if (!mainHeader || !stageHeader || !battleHeader || !hero || !copy || !poster || !mainControls) {
    throw new Error('HEXA_SORT_I9_SCENE_REQUIRED');
  }

  locale.closest('.locale-control').hidden = true;
  root.append(locale);
  mainControls.hidden = true;
  main.querySelector('header strong').dataset.wpFrameTitle = '';
  hero.classList.remove('hero');
  copy.classList.remove('hero-copy');
  copy.dataset.wpFrameCopy = '';
  copy.querySelector('h1').hidden = true;
  copy.querySelector('small').hidden = true;
  copy.querySelector('p').dataset.wpFrameSummary = '';
  poster.dataset.wpFramePoster = '';
  $('mainProgress').dataset.wpFrameProgress = '';
  $('startBtn').dataset.wpFrameAction = 'primary';
  $('endlessBtn').dataset.wpFrameAction = 'secondary';

  const stageTitle = stageHeader.querySelector('[data-wp-frame-title]') || document.createElement('strong');
  stageTitle.hidden = true;
  stageTitle.dataset.wpFrameTitle = '';
  stageHeader.replaceChildren($('stageBack'), stageTitle);

  const battleBack = $('battleBack');
  const battleHelp = $('battleHelp');
  const battleInfo = document.createElement('div');
  battleInfo.dataset.wpFrameInfo = '';
  battleInfo.append($('stageLabel'), ...battleHeader.querySelector('.battle-stats').children);
  battleHeader.querySelector('.battle-title').remove();
  battleHeader.querySelector('.battle-stats').remove();
  const battleTitle = document.createElement('strong');
  battleTitle.hidden = true;
  battleTitle.dataset.wpFrameTitle = '';
  battleHeader.replaceChildren(battleBack, battleTitle, battleHelp);

  const content = document.createElement('div');
  content.className = 'hexa-battle-content';
  const modals = ['helpModal','leaveModal','resultModal'].map($);
  for (const node of [...battle.children]) {
    if (node !== battleHeader && !modals.includes(node)) content.append(node);
  }
  const help = battleHelp;
  help.dataset.wpFrameAction = 'secondary';
  content.append(help);
  battle.append(content);

  for (const id of ['helpClose','leaveContinue','leaveStage','resultStageBtn','retryBtn','nextBtn']) {
    $(id).dataset.wpFrameAction = id === 'nextBtn' ? 'primary' : 'secondary';
  }

  const frame = window.WeightPlayScreenFrame.mount({
    root,
    localeSelect: locale,
    playUI: true,
    scenes: {
      main: {root: main, header: mainHeader, content: hero},
      stage: {root: stage, header: stageHeader, content: stageContent},
      battle: {root: battle, header: battleHeader, content, headerInfo: battleInfo},
    },
  });

  frame.stageTopUI.add(window.WeightPlayScreenFrame.createGroup().add(stageSummary));
  const battleGroup = window.WeightPlayScreenFrame.createGroup();
  [...battleInfo.children].forEach(node => battleGroup.add(node));
  frame.battleTopUI.add(battleGroup);

  const stageUI = window.WeightPlayPlayUI.mountStage({
    page: stageContent,
    rail,
    config: window.createHexaSortStageConfig(game),
    selected: game.selectedStage() - 1,
    onSelect: index => game.setSelectedStage(index),
    onStart: index => game.startStage(index + 1),
    isActive: () => document.body.dataset.screen === 'stage',
  });
  game.attachStageUI(stageUI);

  const sync = () => {
    const scene = document.body.dataset.screen || 'main';
    const covered = scene === 'battle' && modals.some(node => !node.hidden);
    content.inert = scene !== 'battle' || covered;
    frame.activate(scene, {covered});
  };
  const observer = new MutationObserver(sync);
  observer.observe(document.body, {attributes: true, attributeFilter: ['data-screen']});
  modals.forEach(node => observer.observe(node, {attributes: true, attributeFilter: ['hidden']}));
  window.addEventListener('pagehide', event => {
    if (event.persisted) return;
    observer.disconnect();
    game.attachStageUI(null);
    stageUI.destroy();
    frame.destroy();
  });
  sync();
})();
