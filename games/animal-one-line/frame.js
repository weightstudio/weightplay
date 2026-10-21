/* One Line adapter for the shared Interface 9 frame and Stage selector. */
(() => {
  'use strict';

  let mounted = null;

  window.mountAnimalOneLineFrame = function mountAnimalOneLineFrame(options) {
    if (mounted) return mounted;

    const frameRoot = document.getElementById('oneLineFrameRoot');
    const main = document.getElementById('mainScreen');
    const mainHeader = main?.querySelector(':scope > .main-header');
    const hero = main?.querySelector(':scope > .main-hero');
    const poster = hero?.querySelector('.main-poster');
    const copy = hero?.querySelector('.main-copy');
    const mainTitle = mainHeader?.querySelector('[data-one-line-i18n="title"]');
    const mainStart = document.getElementById('startBtn');
    const mainProgress = copy?.querySelector('.main-progress');
    const guide = document.querySelector('.game-page-info-static');
    const stage = document.getElementById('stageScreen');
    const stageCanvas = stage?.querySelector('.stage-canvas');
    const stageHeader = stageCanvas?.querySelector('.stage-header');
    const stageBack = document.getElementById('stageBackBtn');
    const stageTitle = stageHeader?.querySelector('strong');
    const stageSummary = document.getElementById('stageSummary');
    const stageRail = document.getElementById('stageRail');
    const stageTabs = stageCanvas?.querySelector('.stage-tabs');
    const tutorial = document.getElementById('tutorial');
    const battle = document.getElementById('battleScreen');
    const oldBattleCanvas = battle?.querySelector('.battle-canvas');
    const oldBattleHeader = oldBattleCanvas?.querySelector('.battle-header');
    const battleBack = document.getElementById('battleBackBtn');
    const battleProgress = oldBattleHeader?.querySelector('.battle-progress');
    const battleStats = oldBattleHeader?.querySelectorAll('.battle-stat');
    const localeSelect = document.getElementById('localeSelect');
    const core = window.WeightPlayScreenFrame;
    const playUI = window.WeightPlayPlayUI;

    if (!frameRoot || !main || !frameRoot.contains(main) || !frameRoot.contains(guide)
      || !frameRoot.contains(stage) || !frameRoot.contains(battle)
      || !mainHeader || !hero || !poster || !copy || !mainTitle || !mainStart || !mainProgress || !guide
      || !stage || !stageCanvas || !stageHeader || !stageBack || !stageTitle || !stageSummary
      || !stageRail || !stageTabs || !tutorial || !battle || !oldBattleCanvas || !oldBattleHeader
      || !battleBack || !battleProgress || battleStats?.length !== 2 || !localeSelect
      || !core || !playUI || !window.WeightPlayStageRailI9 || !options?.stageConfig) {
      throw new Error('ANIMAL_ONE_LINE_I9_FRAME_INPUTS_REQUIRED');
    }

    const composition = document.createElement('div');
    composition.className = 'wp-standard-main-composition';
    const posterPane = document.createElement('div');
    posterPane.className = 'wp-standard-main-poster';
    poster.classList.add('wp-standard-main-poster-media');
    poster.dataset.wpFramePoster = '';
    posterPane.append(poster);
    copy.classList.add('wp-standard-main-copy');
    copy.dataset.wpFrameCopy = '';
    const summary = copy.querySelector('p');
    if (summary) {
      summary.classList.add('wp-standard-main-summary');
      summary.dataset.wpFrameSummary = '';
    }
    mainProgress.classList.add('wp-standard-main-progress');
    mainTitle.dataset.wpFrameTitle = '';
    mainStart.dataset.wpFrameAction = 'primary';
    mainStart.dataset.wpMainStart = '';
    composition.append(posterPane, copy);
    hero.replaceWith(composition);

    const mainContent = document.createElement('div');
    mainContent.className = 'one-line-main-content wp-standard-main-flow-node';
    main.append(mainContent);
    mainContent.append(composition);

    const stageInfo = document.createElement('div');
    stageInfo.className = 'one-line-stage-info';
    stageInfo.append(stageSummary);
    stageTitle.dataset.wpFrameTitle = '';
    stageHeader.replaceChildren(stageBack, stageTitle);

    const stageContent = document.createElement('div');
    stageContent.id = 'oneLineStageContent';
    stageContent.className = 'one-line-stage-content wp-frame-play-content';
    stageContent.dataset.wpFramePlayFill = '';
    stageContent.append(stageRail, stageInfo);
    stage.dataset.wpFramePlayFill = '';
    stageTabs.dataset.wpFrameNav = '';
    stageTabs.dataset.wpFrameStageNav = '';
    stageTabs.removeAttribute('role');
    const stageTab = stageTabs.querySelector('button');
    if (stageTab) {
      stageTab.removeAttribute('role');
      stageTab.removeAttribute('aria-selected');
      stageTab.dataset.wpFrameStageSlot = 'stages';
      stageTab.dataset.wpFrameAction = 'secondary';
    }
    stage.replaceChildren(stageHeader, stageContent, stageTabs, tutorial);
    stage.removeAttribute('data-wp-standard-stage-screen');
    stage.removeAttribute('data-wp-canvas-max-width');
    stage.removeAttribute('data-wp-stage-landscape-width');
    stage.removeAttribute('data-wp-stage-landscape-height');

    const battleHeader = document.createElement('header');
    const battleTitle = document.createElement('span');
    const battleInfo = document.createElement('div');
    battleInfo.className = 'one-line-battle-info';
    battleTitle.dataset.wpFrameTitle = '';
    battleTitle.textContent = mainTitle.textContent;
    battleInfo.append(battleProgress, ...battleStats);
    battleHeader.append(battleBack, battleTitle, battleInfo);

    const battleContent = oldBattleCanvas;
    battleContent.classList.add('wp-frame-play-content');
    battleContent.dataset.wpFramePlayFill = '';
    battleContent.removeAttribute('data-wp-logical-battle-canvas');
    battleContent.removeAttribute('data-wp-canvas-max-width');
    oldBattleHeader.remove();
    battleContent.append(battleInfo);
    const battleReserve = battle.querySelector('.battle-ad-reserve');
    battle.replaceChildren(battleHeader, battleContent, ...(battleReserve ? [battleReserve] : []));
    battle.dataset.wpFramePlayFill = '';
    battle.setAttribute('data-wp-logical-battle-canvas', 'true');
    battle.setAttribute('data-wp-battle-canvas-root', '');
    battle.setAttribute('data-wp-canvas-max-width', '920');
    battle.setAttribute('data-wp-battle-min-width', '390');
    battle.setAttribute('data-wp-battle-landscape-width', '920');
    battle.setAttribute('data-wp-battle-landscape-height', '420');

    const frame = core.mount({
      root: frameRoot,
      localeSelect,
      playUI: true,
      scenes: {
        main: { root: main, header: mainHeader, content: mainContent },
        stage: { root: stage, header: stageHeader, content: stageContent, headerInfo: stageInfo },
        battle: { root: battle, header: battleHeader, content: battleContent, headerInfo: battleInfo },
      },
    });

    const stageSelector = playUI.mountStage({
      page: stageContent,
      rail: stageRail,
      config: options.stageConfig,
      selected: options.selectedStage?.() ?? 0,
      onSelect: (index) => options.onSelect?.(index),
      onStart: (index) => options.onStart(index),
      isActive: () => frame.active === 'stage',
    });
    frame.activate('main');
    mounted = Object.freeze({ frame, stageSelector });
    return mounted;
  };
})();
