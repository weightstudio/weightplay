/* Game content adapter; shared I9 owns screen chrome, Stage, and Canvas tracks. */
(function () {
  'use strict';

  let frame = null;
  let stageSelector = null;

  window.mountShadowWolfFrame = function () {
    if (frame) return frame;

    const root = document.querySelector('.relic-app');
    const main = document.getElementById('menuPanel');
    const stage = document.getElementById('mapPanel');
    const battle = document.getElementById('gamePanel');
    const header = document.querySelector('.top-nav');
    const stageHeader = stage?.querySelector('.stage-header');
    const core = window.WeightPlayScreenFrame;
    const campaign = window.__ShadowWolfCampaign;
    if (!root || !main || !stage || !battle || !header || !stageHeader || !core || !campaign || !window.WeightPlayPlayUI) {
      throw new Error('SHADOW_FRAME_I9_INPUTS_REQUIRED');
    }

    const title = header.querySelector('.game-brand');
    title.setAttribute('data-wp-frame-title', '');
    header.append(title);

    const localeSelect = document.getElementById('localeSelect');
    const localeCarrier = header.querySelector('.locale-picker');
    if (localeCarrier) {
      localeCarrier.className = '';
      localeCarrier.hidden = true;
      localeCarrier.inert = true;
      root.append(localeCarrier);
    }

    const mainContent = main.querySelector('.menu-layout');
    mainContent.querySelector('.menu-title').hidden = true;
    const poster = mainContent.querySelector('.cover');
    poster.setAttribute('data-wp-frame-poster', '');
    poster.classList.add('wp-standard-main-poster-media');

    const summary = mainContent.querySelector('.menu-hint');
    summary.classList.add('wp-standard-main-summary');
    summary.setAttribute('data-wp-frame-summary', '');
    const progress = mainContent.querySelector('.campaign-summary');
    const progressValue = document.getElementById('campaignSummary');
    progressValue?.classList.remove('wp-standard-main-progress');
    progress?.classList.add('wp-standard-main-progress');
    progress?.setAttribute('data-wp-frame-progress', '');
    const startButton = document.getElementById('startBtn');
    startButton.setAttribute('data-wp-frame-action', 'primary');

    const posterPane = document.createElement('div');
    posterPane.className = 'wp-standard-main-poster';
    posterPane.append(poster);
    const copy = document.createElement('div');
    copy.className = 'wp-standard-main-copy';
    copy.setAttribute('data-wp-frame-copy', '');
    copy.append(summary, progress, startButton);
    const controls = mainContent.querySelector('.desktop-controls');
    if (controls) copy.append(controls);
    mainContent.replaceChildren(posterPane, copy);
    mainContent.className = 'wp-standard-main-composition';
    root.classList.add('wp-standard-main-flow-owner');
    main.classList.add('wp-standard-main-screen');
    main.prepend(header);

    const stageTitle = stageHeader.querySelector('h2');
    stageTitle.setAttribute('data-wp-frame-title', '');
    stageTitle.hidden = true;
    stage.classList.remove('panel', 'world-map-panel', 'wp-stage-art-shell');
    for (const name of ['data-wp-stage-art', 'data-wp-canvas-max-width', 'data-wp-stage-landscape-width', 'data-wp-stage-landscape-height']) {
      stage.removeAttribute(name);
    }
    stage.style.removeProperty('--wp-stage-art');
    stage.setAttribute('data-wp-logical-stage-canvas', '');
    stage.setAttribute('data-wp-frame-play-fill', '');

    const stageContent = document.createElement('div');
    stageContent.className = 'shadow-stage-content';
    stageContent.setAttribute('data-wp-frame-play-fill', '');
    const workshop = document.getElementById('stageWorkshopBtn');
    workshop.classList.remove('wp-stage-header-action', 'stage-workshop-btn');
    workshop.setAttribute('data-wp-frame-action', 'secondary');
    const stageManagement = document.getElementById('stageManagementPanel');
    const stageReserve = stage.querySelector('.stage-ad-reserve');
    const rail = stage.querySelector('.world-map-grid.stage-rail');
    if (!rail || !stageManagement || !stageReserve || !workshop) throw new Error('SHADOW_STAGE_I9_INPUTS_REQUIRED');
    rail.classList.remove('world-map-grid', 'stage-rail');
    for (const child of [...stage.children]) {
      if (child !== stageHeader && child !== stageManagement && child !== stageReserve) stageContent.append(child);
    }
    stage.append(stageContent, stageManagement, stageReserve);

    const battleHeader = document.createElement('header');
    const menuButton = document.getElementById('menuBtn');
    menuButton.setAttribute('data-wp-return', 'battle');
    battleHeader.append(menuButton);
    const battleTitle = document.createElement('span');
    battleTitle.setAttribute('data-wp-frame-title', '');
    battleHeader.append(battleTitle);

    const battleContent = document.createElement('div');
    battleContent.className = 'shadow-battle-content';
    battleContent.setAttribute('data-wp-frame-play-fill', '');
    battleContent.append(...battle.childNodes);
    const innerCanvas = battleContent.querySelector('.shadow-game-layout');
    innerCanvas.removeAttribute('data-wp-logical-battle-canvas');
    innerCanvas.classList.remove('game-layout');
    battle.classList.add('game-layout', 'battle-canvas');
    battle.setAttribute('data-wp-battle-canvas-root', '');
    battle.setAttribute('data-wp-logical-battle-canvas', 'responsive');
    battle.setAttribute('data-wp-battle-landscape-width', '760');
    battle.setAttribute('data-wp-battle-landscape-height', '334');
    battle.setAttribute('data-wp-frame-play-fill', '');

    const battleReserve = battleContent.querySelector('.battle-ad-reserve');
    root.append(battleReserve);
    battleContent.querySelector('#btnJump').setAttribute('data-wp-primary-action', '');
    const result = battleContent.querySelector('#resultPanel');
    battleContent.append(result);
    result.setAttribute('data-wp-frame-logical-actions', 'battle');
    for (const button of result.querySelectorAll('.result-actions button')) button.setAttribute('data-wp-frame-action', 'secondary');
    battle.append(battleHeader, battleContent);

    const info = document.createElement('div');
    info.setAttribute('data-wp-frame-info', '');
    info.append(document.querySelector('.health-meta'), document.getElementById('roomText').parentElement);
    battleContent.prepend(info);
    const pause = document.getElementById('pauseBtn');
    pause.setAttribute('data-wp-frame-action', 'secondary');
    battleContent.querySelector('.arena-hud').append(pause);

    root.setAttribute('data-wp-frame-root', '');
    const mountedFrame = core.mount({
      root,
      localeSelect,
      playUI: true,
      scenes: {
        main: { root: main, header, content: mainContent },
        stage: { root: stage, header: stageHeader, content: stageContent },
        battle: { root: battle, header: battleHeader, content: battleContent, headerInfo: info },
      },
    });

    stageSelector = window.WeightPlayPlayUI.mountStage({
      page: stageContent,
      rail,
      config: campaign.config,
      selected: campaign.selectedIndex(),
      onSelect: campaign.select,
      onStart: campaign.start,
      isActive: () => document.body.dataset.shadowWolfScreen === 'stage',
    });
    campaign.attachSelector(stageSelector);
    mountedFrame.commonDownButton.clear().add(workshop);

    frame = mountedFrame;
    window.addEventListener('pagehide', event => {
      if (event.persisted) return;
      stageSelector?.destroy();
      frame?.destroy();
      stageSelector = null;
      frame = null;
    }, { once: true });
    return frame;
  };
})();
