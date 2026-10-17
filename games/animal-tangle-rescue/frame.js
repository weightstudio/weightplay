/* Game content adapter; Stage geometry and gestures stay in shared I9 code. */
(() => {
  'use strict';
  window.mountAnimalTangleRescueFrame = function mountAnimalTangleRescueFrame() {
    const game = window.AnimalTangleRescueI9;
    const root = document.getElementById('app');
    const main = document.getElementById('mainScreen');
    const stage = document.getElementById('stageScreen');
    const battle = document.getElementById('battleScreen');
    const mainHeader = main.querySelector('header');
    const stageHeader = stage.querySelector('header');
    const battleHeader = battle.querySelector('header');
    const workspace = document.getElementById('stageWorkspace');
    const battleCanvas = battle.querySelector('.battle-canvas');
    const localeSelect = document.getElementById('languageSelect');

    root.querySelectorAll('button:not([data-wp-return])').forEach((button) => {
      button.dataset.wpFrameAction = button.classList.contains('primary-btn') ? 'primary' : 'secondary';
    });

    const frame = window.WeightPlayScreenFrame.mount({
      root,
      localeSelect,
      playUI: true,
      scenes: {
        main: { root: main, header: mainHeader, content: main.querySelector('.hero-card') },
        stage: { root: stage, header: stageHeader, content: workspace },
        battle: { root: battle, header: battleHeader, content: battleCanvas },
      },
    });

    const heading = document.getElementById('battleHeading');
    heading.hidden = false;
    heading.removeAttribute('hidden');
    const battleGroup = window.WeightPlayScreenFrame.createGroup();
    battleGroup.add(heading).add(document.getElementById('progressBadge'));
    frame.battleTopUI.add(battleGroup);

    const selector = window.WeightPlayPlayUI.mountStage({
      page: workspace,
      rail: document.getElementById('stageList'),
      config: window.TangleRescueStageConfig,
      selected: game.selectedStage,
      onSelect: (index) => game.selectStage(index),
      onStart: (index) => game.startBoard(index),
      isActive: () => game.screen === 'stage',
    });
    game.setStageSelector(selector);
    game.setFrame(frame);
    window.addEventListener('pagehide', (event) => {
      if (!event.persisted) frame.destroy();
    }, { once: true });
    return frame;
  };
})();
