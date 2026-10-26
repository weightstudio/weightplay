/* Game content adapter; Interface 9 owns shared chrome, Stage cards and gestures. */
(() => {
  'use strict';

  window.mountAlienDefenderFrame = function mountAlienDefenderFrame({ t, stageConfig, stageCount, isCleared, getSelected, getUnlocked, getFirepower, setSelected, start }) {
    const root = document.getElementById('gameFrame');
    const main = document.getElementById('mainScreen');
    const stage = document.querySelector('#stageScreen .stage-canvas');
    const battle = document.querySelector('#battleScreen .battle-canvas');
    const mainHeader = main.querySelector('.main-header');
    const stageHeader = stage.querySelector('.stage-header');
    const battleHeader = battle.querySelector('.battle-header');
    const localeSelect = document.getElementById('localeSelect');

    main.querySelector('.main-poster').setAttribute('data-wp-frame-poster', '');
    const mainCopy = main.querySelector('.main-copy');
    mainCopy.setAttribute('data-wp-frame-copy', '');
    mainCopy.querySelector('.main-summary').setAttribute('data-wp-frame-summary', '');
    mainCopy.querySelector('#mainProgress').setAttribute('data-wp-frame-progress', '');
    mainCopy.querySelector('#startBtn').setAttribute('data-wp-frame-action', 'primary');

    const stageInfo = document.getElementById('stageInfo');
    const stageGroup = window.WeightPlayScreenFrame.createGroup();
    for (const node of [...stageInfo.children]) stageGroup.add(node);
    stageInfo.remove();

    const battleInfo = document.getElementById('battleStats');
    const battleGroup = window.WeightPlayScreenFrame.createGroup();
    for (const node of [...battleInfo.children]) battleGroup.add(node);
    battleInfo.remove();

    const stageWorkspace = document.getElementById('stageWorkspace');
    const stageRail = document.getElementById('stageRail');
    const stageTabs = document.getElementById('stageTabs');
    const upgradesButton = document.getElementById('shopBtn');
    stageTabs.dataset.wpFrameNav = '';
    upgradesButton.dataset.wpFrameAction = 'tab';
    upgradesButton.setAttribute('aria-pressed', 'false');

    const frame = window.WeightPlayScreenFrame.mount({
      root,
      localeSelect,
      playUI: true,
      scenes: {
        main: { root: main, header: mainHeader, content: main.querySelector('.hero-card') },
        stage: { root: stage, header: stageHeader, content: stageWorkspace },
        battle: { root: battle, header: battleHeader, content: battle.querySelector('.battle-stage') },
      },
    });

    frame.stageTopUI.add(stageGroup);
    frame.battleTopUI.add(battleGroup);
    frame.commonDownButton.clear().add(upgradesButton);

    const stageUI = window.WeightPlayPlayUI.mountStage({
      page: stageWorkspace,
      rail: stageRail,
      config: window.AlienDefenderStageConfig({
        t,
        stageConfig,
        count: stageCount,
        cleared: isCleared,
        unlocked: getUnlocked,
        firepower: getFirepower,
      }),
      selected: getSelected(),
      onSelect: setSelected,
      onStart: start,
      isActive: () => frame.active === 'stage',
    });

    frame.activate('main');
    window.addEventListener('pagehide', event => {
      if (!event.persisted) {
        stageUI.destroy();
        frame.destroy();
      }
    });
    return Object.freeze({ frame, stageUI });
  };
})();
