/* Game content adapter; shared I9 code owns scene chrome and Stage geometry. */
(() => {
  'use strict';
  const game = window.AnimalCushionStackI9;
  const root = document.getElementById('app');
  const main = document.getElementById('mainScreen');
  const stage = document.getElementById('stageScreen');
  const battle = document.getElementById('battleScreen');
  const stagePage = document.getElementById('stagePage');
  const localeSelect = document.getElementById('localeSelect');
  const frame = window.WeightPlayScreenFrame.mount({
    root,
    localeSelect,
    playUI: true,
    scenes: {
      main: { root: main, header: main.querySelector('header'), content: main.querySelector('.wp-standard-main-composition') },
      stage: { root: stage, header: stage.querySelector('header'), content: stagePage },
      battle: { root: battle, header: battle.querySelector('header'), content: document.getElementById('battleContent') },
    },
  });

  const stageHeading = document.getElementById('stageHeading');
  stageHeading.hidden = false;
  stageHeading.removeAttribute('hidden');
  frame.stageTopUI.add(window.WeightPlayScreenFrame.createGroup().add(stageHeading).add(document.getElementById('atelierBtn')));

  const battleHeading = document.getElementById('battleHeading');
  battleHeading.hidden = false;
  battleHeading.removeAttribute('hidden');
  const battleGroup = window.WeightPlayScreenFrame.createGroup();
  battleGroup.add(document.getElementById('roundLabel')).add(document.getElementById('sessionPicksLabel'));
  battleHeading.hidden = true;
  frame.battleTopUI.add(battleGroup);

  const selector = window.WeightPlayPlayUI.mountStage({
    page: stagePage,
    rail: document.getElementById('stageList'),
    config: window.AnimalCushionStackStageConfig,
    selected: game.selectedStage,
    onSelect: (index) => game.selectStage(index),
    onStart: (index) => game.startStage(index),
    isActive: () => game.screen === 'stages',
  });
  game.setStageSelector(selector);
  game.setFrame(frame);
  window.addEventListener('pagehide', (event) => {
    if (!event.persisted) frame.destroy();
  }, { once: true });
})();
