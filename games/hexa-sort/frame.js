/* Adapt permanent game nodes; navigation and preferences belong to the core. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const root = $('gameFrame'), main = root.querySelector('.main-canvas');
  const stage = root.querySelector('.stage-canvas'), battle = $('battleLive');
  const locale = $('localeSelect');
  locale.hidden = true;
  root.append(locale);
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
  for (const id of ['startBtn','nextBtn','enterStage']) $(id).dataset.wpFrameAction = 'primary';
  for (const id of ['endlessBtn','helpClose','leaveContinue','leaveStage','resultStageBtn','retryBtn','battleHelp']) $(id).dataset.wpFrameAction = 'secondary';
  main.querySelector('header strong').dataset.wpFrameTitle = '';
  const stageContent = document.createElement('div');
  stageContent.className = 'hexa-stage-content';
  stageContent.append($('stageSummary'), $('stageRail'), stage.querySelector('.stage-hint'), $('enterStage'));
  stage.append(stageContent);
  stage.querySelector('header div').remove();
  stage.querySelector('.stage-tabs').dataset.wpFrameNav = '';
  stage.querySelector('.stage-tabs button').dataset.wpFrameAction = 'secondary';
  const battleHeader = battle.querySelector('header');
  const info = document.createElement('div');
  info.dataset.wpFrameInfo = '';
  info.append($('stageLabel'), ...battleHeader.querySelector('.battle-stats').children);
  battleHeader.querySelector('.battle-stats').remove();
  battleHeader.querySelector('.battle-title').remove();
  const content = document.createElement('div');
  content.className = 'hexa-battle-content';
  for (const node of [...battle.children]) if (node !== battleHeader) content.append(node);
  content.append($('battleHelp'));
  battle.append(content);
  content.prepend(info);
  for (const header of [stage.querySelector('header'), battleHeader]) {
    const title = document.createElement('span');
    title.hidden = true;
    title.dataset.wpFrameTitle = '';
    header.append(title);
  }
  const frame = WeightPlayScreenFrame.mount({root, localeSelect: locale, scenes: {
    main: {root: main, header: main.querySelector('header'), content: hero},
    stage: {root: stage, header: stage.querySelector('header'), content: stageContent},
    battle: {root: battle, header: battleHeader, content, headerInfo: info},
  }});
  const modals = ['helpModal','leaveModal','resultModal'].map($);
  const sync = () => {
    const scene = document.body.dataset.screen || 'main';
    const covered = scene === 'battle' && modals.some(node => !node.hidden);
    content.inert = scene !== 'battle' || covered;
    frame.activate(scene, {covered});
  };
  const observer = new MutationObserver(sync);
  observer.observe(document.body, {attributes: true, attributeFilter: ['data-screen']});
  modals.forEach(node => observer.observe(node, {attributes:true, attributeFilter:['hidden']}));
  window.addEventListener('pagehide', event => {if (!event.persisted) {observer.disconnect();frame.destroy();}});
  sync();
})();
