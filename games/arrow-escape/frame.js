/* Game content bindings only. Shared frame owns headers and preferences. */
(() => {
  'use strict';
  const artStyles = document.createElement('link');
  artStyles.rel = 'stylesheet';
  artStyles.href = '/games/arrow-escape/block-art.css';
  document.head.append(artStyles);
  const $ = id => document.getElementById(id);
  const root = $('gameFrame'), main = $('mainScreen');
  const stage = root.querySelector('.stage-canvas'), battle = $('battleLive');
  const select = $('localeSelect');
  // Retain IDs used by the original sound state handler without displaying
  // a second preferences UI. The shared sound component uses WonderSound.
  select.hidden = true;
  root.append(select);
  main.querySelector('.main-controls').hidden = true;
  const mainHeader = main.querySelector('header');
  mainHeader.querySelector('strong').setAttribute('data-wp-frame-title', '');
  const hero = main.querySelector('.hero');
  hero.classList.remove('hero');
  hero.querySelector('.poster').setAttribute('data-wp-frame-poster', '');
  const copy = hero.querySelector('.hero-copy');
  copy.classList.remove('hero-copy');
  copy.setAttribute('data-wp-frame-copy', '');
  copy.querySelector('h1').hidden = true;
  copy.querySelector('small').hidden = true;
  copy.querySelector('p').setAttribute('data-wp-frame-summary', '');
  $('mainProgress').setAttribute('data-wp-frame-progress', '');
  $('startBtn').setAttribute('data-wp-frame-action', 'primary');
  const stageHeader = stage.querySelector('header');
  const stageContent = document.createElement('div');
  stageContent.className = 'arrow-stage-content';
  stageContent.style.background = 'linear-gradient(#08202b55,#08202baa), url("/assets/arrow-escape/block-sky-castle-v1.png") center / cover';
  stage.append(stageContent);
  stageContent.append($('stageSummary'), $('stageRail'));
  stageHeader.querySelector('div').remove();
  const footer = stage.querySelector('footer');
  footer.setAttribute('data-wp-frame-nav', '');
  const battleHeader = battle.querySelector('header');
  const battleContent = document.createElement('div');
  battleContent.className = 'arrow-battle-content';
  $('board').style.background = 'url("/assets/arrow-escape/block-board-v1.png") center / 100% 100%';
  $('board').style.borderRadius = '3px';
  battleContent.style.background = 'linear-gradient(#08202b44,#08202b77), url("/assets/arrow-escape/block-sky-castle-v1.png") center / cover';
  for (const node of [...battle.children]) if (node !== battleHeader) battleContent.append(node);
  battle.append(battleContent);
  battleContent.querySelector('.battle-controls').append($('battleHelp'));
  const info = document.createElement('div');
  info.setAttribute('data-wp-frame-info', '');
  info.append($('stageLabel'), ...battleHeader.querySelector('.battle-stats').children);
  battleHeader.querySelector('.battle-stats').remove();
  battleHeader.querySelector('.battle-title').remove();
  battleContent.prepend(info);
  for (const header of [stageHeader, battleHeader]) {
    const title = document.createElement('span');
    title.hidden = true;
    title.setAttribute('data-wp-frame-title', '');
    header.append(title);
  }
  const frame = window.WeightPlayScreenFrame.mount({root, localeSelect: select, scenes: {
    main: {root: main, header: mainHeader, content: hero},
    stage: {root: stage, header: stageHeader, content: stageContent},
    battle: {root: battle, header: battleHeader, content: battleContent, headerInfo: info},
  }});
  const guide = root.querySelector('.game-page-info');
  root.after(guide);
  const modals = ['helpModal','leaveModal','resultModal'].map($);
  const sync = () => {
    const scene = document.body.dataset.screen;
    const covered = scene === 'battle' && modals.some(node => !node.hidden);
    guide.hidden = scene !== 'main';
    battleContent.inert = scene !== 'battle' || covered;
    frame.activate(scene, {covered});
  };
  const observer = new MutationObserver(sync);
  observer.observe(document.body, {attributes:true, attributeFilter:['data-screen']});
  modals.forEach(node => observer.observe(node, {attributes:true, attributeFilter:['hidden']}));
  window.addEventListener('pagehide', e => {
    if (!e.persisted) { observer.disconnect(); frame.destroy(); }
  });
  sync();
})();
