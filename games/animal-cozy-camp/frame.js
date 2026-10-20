/* Game content adapter; shared I9 code owns scene chrome and Stage geometry. */
(() => {
  'use strict';
  const game = window.AnimalCozyCampI9;
  const root = document.getElementById('appShell');
  const main = document.getElementById('mainScreen');
  const stage = document.getElementById('stageScreen');
  const battle = document.getElementById('battleScreen');
  const stagePage = document.getElementById('stageWorkspace');
  const battlePage = document.getElementById('battleWorkspace');
  const localeSelect = document.getElementById('locale-select');
  const frame = window.WeightPlayScreenFrame.mount({
    root,
    localeSelect,
    playUI: true,
    scenes: {
      main: { root: main, header: main.querySelector('header'), content: main.querySelector('.wp-standard-main-composition') },
      stage: { root: stage, header: stage.querySelector('header'), content: stagePage },
      battle: { root: battle, header: battle.querySelector('header'), content: battlePage },
    },
  });

  const stageTitle = document.getElementById('stage-top-title');
  const stageProgress = document.getElementById('stage-progress');
  frame.stageTopUI.add(window.WeightPlayScreenFrame.createGroup().add(stageTitle).add(stageProgress));

  const battleGroup = window.WeightPlayScreenFrame.createGroup();
  battleGroup.add(document.getElementById('round-title')).add(document.querySelector('.round-badge'));
  frame.battleTopUI.add(battleGroup);

  const tab = stage.querySelector('[data-wp-frame-action="tab"]');
  frame.commonDownButton.clear().add(tab);
  const selector = window.WeightPlayPlayUI.mountStage({
    page: stagePage,
    rail: document.getElementById('stage-rail'),
    config: window.AnimalCozyCampStageConfig,
    selected: game.initialStageIndex,
    onSelect: (index) => game.selectStage(index),
    onStart: (index) => { if (game.screen === 'stage') game.startStage(index); },
    isActive: () => game.screen === 'stage',
  });
  game.setStageSelector(selector);
  game.setFrame(frame);
  tab.addEventListener('click', () => selector.refresh(selector.selected));
  window.addEventListener('pagehide', (event) => {
    if (!event.persisted) frame.destroy();
  }, { once: true });
})();
