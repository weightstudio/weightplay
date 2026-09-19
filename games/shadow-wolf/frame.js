/* Scene binding only; theme, controls and preferences belong to the shared core. */
(function () {
  'use strict';
  let frame;
  window.mountShadowWolfFrame = function () {
    if (frame) return frame;
    const root = document.querySelector('.relic-app');
    const main = document.getElementById('menuPanel');
    const stage = document.getElementById('mapPanel');
    const battle = document.getElementById('gamePanel');
    const header = document.querySelector('.top-nav');
    const stageHeader = stage?.querySelector('.stage-header');
    const core = window.WeightPlayScreenFrame;
    if (!root || !main || !stage || !battle || !header || !stageHeader || !core) throw new Error('SHADOW_FRAME_INPUTS_REQUIRED');
    const title = header.querySelector('.game-brand');
    title.setAttribute('data-wp-frame-title', '');
    header.append(title);
    const localeSelect = document.getElementById('localeSelect');
    const localeCarrier = header.querySelector('.locale-picker');
    if (localeCarrier) { localeCarrier.hidden = true; root.append(localeCarrier); }
    const mainContent = main.querySelector('.menu-layout');
    mainContent.querySelector('.menu-title').hidden = true;
    main.prepend(header);
    mainContent.querySelector('.cover').setAttribute('data-wp-frame-poster', '');
    mainContent.querySelector('.menu-hint').setAttribute('data-wp-frame-summary', '');
    mainContent.querySelector('.campaign-summary').setAttribute('data-wp-frame-progress', '');
    document.getElementById('startBtn').setAttribute('data-wp-frame-action', 'primary');
    const stageContent = document.createElement('div');
    stageHeader.querySelector('h2').setAttribute('data-wp-frame-title', '');
    stageHeader.querySelector('h2').hidden = true;
    stageContent.className = 'shadow-stage-content';
    for (const child of [...stage.children]) if (child !== stageHeader) stageContent.append(child);
    const workshop = document.getElementById('stageWorkshopBtn');
    workshop.classList.remove('wp-stage-header-action');
    workshop.setAttribute('data-wp-frame-action', 'secondary');
    stageContent.prepend(workshop);
    stage.append(stageContent);
    const battleHeader = document.createElement('header');
    battleHeader.append(document.getElementById('menuBtn'));
    const battleTitle = document.createElement('span');
    battleTitle.setAttribute('data-wp-frame-title', '');
    battleHeader.append(battleTitle);
    const battleContent = document.createElement('div');
    battleContent.className = 'shadow-battle-content';
    battleContent.append(...battle.childNodes);
    battleContent.append(battleContent.querySelector('#resultPanel'));
    for (const button of battleContent.querySelectorAll('#resultPanel .result-actions button')) {
      button.setAttribute('data-wp-frame-action', 'secondary');
    }
    battle.append(battleHeader, battleContent);
    const info = document.createElement('div');
    info.setAttribute('data-wp-frame-info', '');
    info.append(document.querySelector('.health-meta'), document.getElementById('roomText').parentElement);
    battleContent.prepend(info);
    const pause = document.getElementById('pauseBtn');
    pause.setAttribute('data-wp-frame-action', 'secondary');
    battleContent.querySelector('.arena-hud').append(pause);
    root.setAttribute('data-wp-frame-root', '');
    frame = core.mount({root, localeSelect, scenes: {
      main: {root:main, header, content:mainContent},
      stage: {root:stage, header:stageHeader, content:stageContent},
      battle: {root:battle, header:battleHeader, content:battleContent, headerInfo:info},
    }});
    window.addEventListener('pagehide', event => { if (!event.persisted) { frame?.destroy(); frame = null; } });
    return frame;
  };
})();
