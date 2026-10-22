/* Game-content adapter for the shared Interface 9 frame and Play UI. */
(function () {
  'use strict';

  const $ = id => document.getElementById(id);

  window.mountAnimalTrapTrailFrame = function () {
    const root = $('app');
    const main = $('main-screen');
    const stage = $('stage-screen');
    const battle = $('battle-screen');
    const mainHeader = main.querySelector(':scope > header');
    const stageHeader = stage.querySelector(':scope > header');
    const battleHeader = battle.querySelector(':scope > header');
    const localeSelect = $('localeSelect');

    const mainTitle = mainHeader.querySelector('[data-wp-game-title]');
    mainTitle.setAttribute('data-wp-frame-title', '');
    const poster = main.querySelector('.main-poster');
    poster.setAttribute('data-wp-frame-poster', '');
    const summary = main.querySelector('.main-summary');
    summary.setAttribute('data-wp-frame-summary', '');
    const progress = $('main-progress');
    progress.setAttribute('data-wp-frame-progress', '');
    const start = $('start-game');
    start.setAttribute('data-wp-frame-action', 'primary');
    const copy = document.createElement('div');
    copy.className = 'wp-main-shell-copy';
    copy.setAttribute('data-wp-frame-copy', '');
    copy.append(summary, progress, start);
    const mainContent = document.createElement('div');
    mainContent.className = 'wp-main-shell-content';
    mainContent.append(poster, copy);
    main.append(mainContent);

    const stageTitle = stageHeader.querySelector('h2');
    stageTitle.setAttribute('data-wp-frame-title', '');
    stage.classList.remove('wp-stage-art-shell');
    stage.removeAttribute('data-wp-stage-art');
    stage.style.removeProperty('--wp-stage-art');
    stage.setAttribute('data-wp-frame-play-fill', '');
    const stageWorkspace = document.createElement('div');
    stageWorkspace.id = 'stageWorkspace';
    stageWorkspace.className = 'stage-workspace';
    stageWorkspace.setAttribute('data-wp-shell-content', 'stage');
    stageWorkspace.append($('stage-list'));
    const stageNav = stage.querySelector('.stage-tabs');
    stage.insertBefore(stageWorkspace, stageNav);
    stageNav.setAttribute('data-wp-frame-nav', '');
    const stageButton = stageNav.querySelector('button');
    stageButton.setAttribute('data-wp-frame-action', 'tab');
    stageButton.setAttribute('aria-pressed', 'true');
    const stageSummary = document.createElement('span');
    stageSummary.id = 'stage-summary';

    battle.setAttribute('data-wp-frame-play-fill', '');
    const battleTitle = document.createElement('strong');
    battleTitle.setAttribute('data-wp-frame-title', '');
    battleHeader.append(battleTitle);
    const battleContent = document.createElement('div');
    battleContent.id = 'battle-content';
    battleContent.className = 'trail-battle-content';
    battleContent.setAttribute('data-wp-shell-content', 'battle');
    for (const node of [
      $('battle-status'), $('arena'), battle.querySelector('.trail-guide'),
      battle.querySelector('.touch-controls'), battle.querySelector('.touch-hint'),
    ]) {
      if (node) battleContent.append(node);
    }
    battle.insertBefore(battleContent, $('result-screen'));

    const frame = window.WeightPlayScreenFrame.mount({
      root,
      localeSelect,
      playUI: true,
      scenes: {
        main: { root: main, header: mainHeader, content: mainContent },
        stage: { root: stage, header: stageHeader, content: stageWorkspace },
        battle: { root: battle, header: battleHeader, content: battleContent },
      },
    });

    frame.stageTopUI.add(window.WeightPlayScreenFrame.createGroup().add(stageSummary));
    const trailHud = battleHeader.querySelector('.trail-hud');
    const battleInfo = window.WeightPlayScreenFrame.createGroup();
    for (const node of [ $('room-label'), $('death-label') ]) battleInfo.add(node);
    trailHud?.remove();
    frame.battleTopUI.add(battleInfo);
    frame.commonDownButton.clear().add(stageButton);
    frame.activate('main');
    window.addEventListener('pagehide', event => {
      if (!event.persisted) frame.destroy();
    });
    return { frame, stageSummary };
  };
})();
