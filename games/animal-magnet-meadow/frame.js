/* Game-owned content slots; the shared frame owns Main, Stage and Battle chrome. */
(() => {
  'use strict';

  window.mountMagnetMeadowFrame = function mountMagnetMeadowFrame() {
    const root = document.getElementById('gameFrame');
    const main = document.querySelector('#mainScreen .main-canvas');
    const stage = document.querySelector('#stageScreen .stage-canvas');
    const battle = document.querySelector('#battleScreen .battle-canvas');
    const mainHeader = main.querySelector('.main-header');
    const stageHeader = stage.querySelector('.panel-head');
    const battleHeader = battle.querySelector('.panel-head');
    const localeSelect = document.getElementById('languageSelect');

    for (const [selector, slot] of Object.entries({
      '.main-poster': 'poster',
      '.hero-copy': 'copy',
      '.hero-copy .intro': 'summary',
      '#mainProgress': 'progress',
    })) main.querySelector(selector).setAttribute(`data-wp-frame-${slot}`, '');

    root.querySelectorAll('button:not([data-wp-return]):not(.stage-card)').forEach(button => {
      button.dataset.wpFrameAction = button.matches('[data-wp-main-start], [data-wp-primary-action], .primary-btn') ? 'primary' : 'secondary';
    });
    document.getElementById('stageTabs').dataset.wpFrameNav = '';

    const frame = window.WeightPlayScreenFrame.mount({
      root,
      // Shared settings owns locale routing and its confirmation lifecycle.
      localeSelect: null,
      playUI: true,
      scenes: {
        main: { root: main, header: mainHeader, content: main.querySelector('.hero-card') },
        stage: { root: stage, header: stageHeader, content: document.getElementById('stageWorkspace') },
        battle: { root: battle, header: battleHeader, content: battle.querySelector('.battle-content') },
      },
    });

    const stageProgress = document.createElement('span');
    stageProgress.id = 'sharedStageProgress';
    stageProgress.setAttribute('role', 'status');
    stageProgress.setAttribute('aria-live', 'polite');
    const stageGroup = window.WeightPlayScreenFrame.createGroup().add(stageProgress);
    frame.stageTopUI.add(stageGroup);

    const battleStage = document.createElement('span');
    battleStage.id = 'sharedBattleStage';
    battleStage.setAttribute('aria-live', 'polite');
    const battleMoves = document.createElement('span');
    battleMoves.id = 'sharedBattleMoves';
    const battleGroup = window.WeightPlayScreenFrame.createGroup().add(battleStage).add(battleMoves);
    frame.battleTopUI.add(battleGroup);

    const stageTab = document.getElementById('stageTabButton');
    stageTab.dataset.wpFrameAction = 'tab';
    stageTab.setAttribute('aria-pressed', 'true');
    const gardenTab = document.getElementById('gardenBtn');
    gardenTab.dataset.wpFrameAction = 'tab';
    frame.commonDownButton.clear().add(stageTab).add(gardenTab);

    frame.activate('main');
    window.addEventListener('pagehide', event => {
      if (!event.persisted) frame.destroy();
    });
    return frame;
  };
})();
