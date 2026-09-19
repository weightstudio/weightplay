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
    if (localeCarrier) { localeCarrier.className = ''; localeCarrier.hidden = true; localeCarrier.inert = true; root.append(localeCarrier); }
    const mainContent = main.querySelector('.menu-layout');
    mainContent.querySelector('.menu-title').hidden = true;
    main.prepend(header);
    mainContent.querySelector('.cover').setAttribute('data-wp-frame-poster', '');
    mainContent.querySelector('.menu-hint').setAttribute('data-wp-frame-summary', '');
    mainContent.querySelector('.campaign-summary').setAttribute('data-wp-frame-progress', '');
    document.getElementById('startBtn').setAttribute('data-wp-frame-action', 'primary');
    // Flatten legacy wrappers into the shared poster/copy slots. Keeping the
    // old menu-main grid would constrain the shared frame inside a second grid.
    const poster = mainContent.querySelector('[data-wp-frame-poster]');
    const summary = mainContent.querySelector('[data-wp-frame-summary]');
    const progress = mainContent.querySelector('[data-wp-frame-progress]');
    const progressValue = document.getElementById('campaignSummary');
    progressValue.classList.remove('wp-standard-main-progress');
    const progressLine = document.createElement('span');
    progressLine.append(...progress.childNodes, progressValue);
    progress.replaceChildren(progressLine);
    progress.style.height = '40px';
    const copy = document.createElement('div');
    copy.setAttribute('data-wp-frame-copy', '');
    copy.append(summary, progress, document.getElementById('startBtn'));
    const controls = mainContent.querySelector('.desktop-controls');
    if (controls) copy.append(controls);
    mainContent.replaceChildren(poster, copy);
    mainContent.className = '';
    const stageContent = document.createElement('div');
    stageHeader.querySelector('h2').setAttribute('data-wp-frame-title', '');
    stageHeader.querySelector('h2').hidden = true;
    stageContent.className = 'shadow-stage-content';
    for (const child of [...stage.children]) if (child !== stageHeader) stageContent.append(child);
    const workshop = document.getElementById('stageWorkshopBtn');
    workshop.classList.remove('wp-stage-header-action');
    workshop.setAttribute('data-wp-frame-action', 'secondary');
    stage.append(stageContent);
    const stageNav = document.createElement('nav');
    stageNav.setAttribute('data-wp-frame-stage-nav', '');
    stageNav.className = 'stage-tabs';
    const stagesTab = document.createElement('button');
    stagesTab.type = 'button';
    stagesTab.setAttribute('role', 'tab');
    stagesTab.setAttribute('aria-selected', 'true');
    stagesTab.setAttribute('aria-controls', 'mapPanel');
    stagesTab.setAttribute('data-wp-frame-stage-slot', 'stages');
    stagesTab.setAttribute('data-wp-frame-action', 'secondary');
    stagesTab.setAttribute('data-ui', 'roomLabel');
    stagesTab.textContent = document.querySelector('[data-ui="roomLabel"]').textContent;
    stagesTab.addEventListener('click', () => document.getElementById('stageManagementCloseBtn').click());
    workshop.setAttribute('data-wp-frame-stage-slot', 'equipment');
    stageNav.append(stagesTab, workshop);
    stage.append(stageNav);
    const battleHeader = document.createElement('header');
    battleHeader.append(document.getElementById('menuBtn'));
    const battleTitle = document.createElement('span');
    battleTitle.setAttribute('data-wp-frame-title', '');
    battleHeader.append(battleTitle);
    const battleContent = document.createElement('div');
    battleContent.className = 'shadow-battle-content';
    battleContent.append(...battle.childNodes);
    const innerCanvas = battleContent.querySelector('.shadow-game-layout');
    innerCanvas.removeAttribute('data-wp-logical-battle-canvas');
    innerCanvas.classList.remove('game-layout');
    battle.classList.add('game-layout');
    battle.setAttribute('data-wp-battle-canvas-root', '');
    battle.setAttribute('data-wp-logical-battle-canvas', 'responsive');
    battle.setAttribute('data-wp-battle-landscape-width', '760');
    battle.setAttribute('data-wp-battle-landscape-height', '334');
    const reserve = battleContent.querySelector('.battle-ad-reserve');
    root.append(reserve);
    battleContent.querySelector('#btnJump').setAttribute('data-wp-primary-action', '');
    battleContent.append(battleContent.querySelector('#resultPanel'));
    battleContent.querySelector('#resultPanel').setAttribute('data-wp-frame-logical-actions', 'battle');
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
