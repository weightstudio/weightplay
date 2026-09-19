/* Bind permanent game scenes; all header/preferences presentation belongs to the shared core. */
(function () {
  'use strict';
  let frame;
  window.mountRelicHuntersFrame = function () {
    if (frame) return frame;
    const root = document.querySelector('.relic-app');
    const main = document.getElementById('menuPanel');
    const stage = document.getElementById('stagePanel');
    const battle = document.getElementById('gamePanel');
    const header = document.querySelector('.top-nav');
    const core = window.WeightPlayScreenFrame;
    if (!root || !main || !stage || !battle || !header || !core) throw new Error('RELIC_FRAME_INPUTS_REQUIRED');
    const title = header.querySelector('.game-brand');
    title.setAttribute('data-wp-frame-title', '');
    const localeSelect = document.getElementById('localeSelect');
    const carrier = header.querySelector('.locale-picker');
    carrier.className = ''; carrier.hidden = true; carrier.inert = true; root.append(carrier);
    header.append(document.getElementById('menuBtn'), title);
    header.querySelectorAll('.top-nav-left,.top-nav-right').forEach(node => node.remove());
    main.prepend(header);
    const mainContent = main.querySelector('.menu-layout');
    mainContent.querySelector('.menu-title').hidden = true;
    mainContent.querySelector('.goals-card').hidden = true;
    mainContent.querySelector('.cover').setAttribute('data-wp-frame-poster', '');
    mainContent.querySelector('.menu-hint').setAttribute('data-wp-frame-summary', '');
    document.getElementById('campaignProgress').setAttribute('data-wp-frame-progress', '');
    document.getElementById('showStageBtn').setAttribute('data-wp-frame-action', 'primary');
    const stageHeader = stage.querySelector('.stage-panel-head');
    document.getElementById('stageTitle').setAttribute('data-wp-frame-title', '');
    const stageContent = document.createElement('div');
    stageContent.className = 'relic-stage-content';
    for (const child of [...stage.children]) if (child !== stageHeader && !child.matches('.stage-bottom-tabs')) stageContent.append(child);
    stage.append(stageContent);
    const battleHeader = document.createElement('header');
    const battleTitle = document.createElement('span');
    battleTitle.setAttribute('data-wp-frame-title', '');
    battleHeader.append(document.getElementById('backToStageBtn'), battleTitle);
    const battleContent = battle.querySelector('.game-layout');
    battleContent.classList.add('relic-battle-content');
    battle.prepend(battleHeader);
    for (const id of ['draftPanel', 'lootPanel', 'resultPanel']) battleContent.append(document.getElementById(id));
    document.getElementById('resultPanel').setAttribute('data-wp-frame-logical-actions', 'battle');
    for (const button of battleContent.querySelectorAll('#resultPanel button')) button.setAttribute('data-wp-frame-action', 'secondary');
    root.setAttribute('data-wp-frame-root', '');
    frame = core.mount({root, localeSelect, scenes: {
      main: {root:main, header, content:mainContent},
      stage: {root:stage, header:stageHeader, content:stageContent},
      battle: {root:battle, header:battleHeader, content:battleContent},
    }});
    window.addEventListener('pagehide', event => { if (!event.persisted) { frame?.destroy(); frame = null; } });
    return frame;
  };
})();
