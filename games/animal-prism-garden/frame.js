/* Prism Garden supplies puzzle facts; the shared I9 frame owns every control and rail. */
(() => {
  'use strict';

  const install = () => {
    const byId = id => document.getElementById(id);
    const root = byId('gameFrame');
    const game = window.PRISM_GARDEN_I9;
    const core = window.WeightPlayScreenFrame;
    const playUI = window.WeightPlayPlayUI;
    if (!root || root.dataset.wpFrame || !core || !playUI || !game) return;

    const main = byId('main');
    const stage = byId('stage');
    const battle = byId('battle');
    const mainHeader = main.querySelector(':scope > header');
    const mainContent = main.querySelector('.hero');
    const mainCopy = mainContent.querySelector('.hero-copy');
    const mainTitle = mainHeader.querySelector('strong');
    const stageHeader = stage.querySelector(':scope > header');
    const stageTitle = stageHeader.querySelector('h2');
    const stageRail = byId('stageGrid');
    const stageNav = stage.querySelector('.stage-tabs');
    const stageAction = byId('stageTab');
    const battleHeader = battle.querySelector(':scope > header');
    const battleContent = battle.querySelector('.battle-content');
    const battleInfo = battleContent.querySelector('.hud');
    const battleTitle = byId('stageName');
    const grid = byId('grid');
    if (!mainHeader || !mainContent || !mainCopy || !stageHeader || !stageRail || !stageNav
      || !battleHeader || !battleContent || !battleInfo || !battleTitle || !grid) {
      throw new Error('PRISM_GARDEN_I9_FRAME_INPUTS_REQUIRED');
    }

    main.classList.remove('main-screen', 'wp-standard-main-screen');
    mainContent.className = 'prism-main-content';
    mainContent.querySelector('img').dataset.wpFramePoster = '';
    mainCopy.dataset.wpFrameCopy = '';
    mainCopy.querySelector('.main-summary').dataset.wpFrameSummary = '';
    mainCopy.querySelector('h1').hidden = true;
    mainCopy.querySelector('.eyebrow').hidden = true;
    byId('mainProgress').dataset.wpFrameProgress = '';
    mainTitle.dataset.wpFrameTitle = '';
    mainTitle.dataset.wpGameTitle = '';
    byId('start').dataset.wpFrameAction = 'primary';

    const stageContent = document.createElement('div');
    stageContent.id = 'prismStageContent';
    stageContent.className = 'wp-frame-play-content';
    stageContent.dataset.wpFramePlayFill = '';
    stageContent.append(stageRail);
    const stageInfo = document.createElement('div');
    stageInfo.className = 'prism-stage-info';
    const progress = document.createElement('span');
    progress.id = 'progressBadge';
    stageInfo.append(progress);
    stageContent.append(stageInfo);
    stageTitle.dataset.wpFrameTitle = '';
    stage.dataset.wpFramePlayFill = '';
    stageNav.dataset.wpFrameNav = '';
    stageNav.dataset.wpFrameStageNav = '';
    if (stageAction) {
      stageAction.dataset.wpFrameStageSlot = 'stages';
      stageAction.dataset.wpFrameAction = 'primary';
      stageAction.removeAttribute('aria-current');
    }
    stage.removeAttribute('data-wp-standard-stage-screen');
    stage.removeAttribute('data-wp-logical-stage-canvas');
    stage.removeAttribute('data-wp-canvas-max-width');
    stage.removeAttribute('data-wp-stage-landscape-width');
    stage.removeAttribute('data-wp-stage-landscape-height');
    stage.replaceChildren(stageHeader, stageContent, stageNav);

    const boardSlot = document.createElement('div');
    boardSlot.className = 'prism-board-slot';
    grid.before(boardSlot);
    boardSlot.append(grid);
    battleContent.classList.add('wp-frame-play-content');
    battleContent.dataset.wpFramePlayFill = '';
    battle.setAttribute('data-wp-logical-battle-canvas', 'true');
    battle.setAttribute('data-wp-canvas-max-width', '920');
    battle.setAttribute('data-wp-battle-min-width', '390');
    battle.setAttribute('data-wp-battle-landscape-width', '920');
    battle.setAttribute('data-wp-battle-landscape-height', '420');
    battleTitle.dataset.wpFrameTitle = '';
    battleTitle.parentElement.hidden = true;

    const battleGroup = core.createGroup();
    for (const node of [...battleInfo.children]) {
      const field = document.createElement('div');
      const label = document.createElement('span');
      label.dataset.t = { moves: 'hudMoves', linkStatus: 'hudPairs', fillStatus: 'hudFilled' }[node.id];
      const value = document.createElement('strong');
      value.id = node.id;
      node.replaceWith(value);
      field.append(label, value);
      battleGroup.add(field);
    }
    battleInfo.replaceChildren();
    battleInfo.dataset.wpFrameInfo = '';
    for (const id of ['next', 'leaveContinue']) byId(id).dataset.wpFrameAction = 'primary';
    for (const id of ['undo', 'hint', 'reset', 'resultStages', 'retry', 'leaveStages']) byId(id).dataset.wpFrameAction = 'secondary';

    const frame = core.mount({
      root,
      localeSelect: byId('locale'),
      playUI: true,
      scenes: {
        main: { root: main, header: mainHeader, content: mainContent },
        stage: { root: stage, header: stageHeader, content: stageContent, headerInfo: stageInfo },
        battle: { root: battle, header: battleHeader, content: battleContent, headerInfo: battleInfo },
      },
    });
    const stageInfoGroup = core.createGroup();
    stageInfoGroup.add(progress);
    frame.stageTopUI.add(stageInfoGroup);
    frame.battleTopUI.add(battleGroup);
    if (stageAction) frame.commonDownButton.add(stageAction);

    const selector = playUI.mountStage({
      page: stageContent,
      rail: stageRail,
      config: game.stageConfig,
      selected: game.selected(),
      onSelect: game.select,
      onStart: game.start,
      isActive: () => frame.active === 'stage',
    });
    game.attach(selector);

    const abort = new AbortController();
    const sync = () => {
      const scene = document.body.dataset.screen || 'main';
      frame.activate(scene, { covered: scene === 'battle' && (!byId('result').hidden || !byId('leavePanel').hidden) });
    };
    window.addEventListener('weightplay:shell-sync', sync, { signal: abort.signal });
    window.addEventListener('weightplay:prism-covered', sync, { signal: abort.signal });
    window.addEventListener('pagehide', event => {
      if (!event.persisted) { abort.abort(); selector.destroy(); frame.destroy(); }
    }, { signal: abort.signal });
    sync();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
})();
