/* Adapt Habitat content to the shared I9 Main, Stage and Battle frame. */
(() => {
  'use strict';
  window.mountHabitatBlueprintFrame = function () {
    const root = document.getElementById('app');
    const main = document.getElementById('mainScreen');
    const stage = document.getElementById('stageScreen');
    const battle = document.getElementById('battleScreen');
    const mainHeader = main.querySelector(':scope > header');
    const stageHeader = stage.querySelector(':scope > header');
    const battleHeader = battle.querySelector(':scope > header');
    const localeSelect = document.getElementById('localeSelect');
    const frame = window.WeightPlayScreenFrame.mount({
      root,
      localeSelect,
      playUI: true,
      scenes: {
        main: { root: main, header: mainHeader, content: document.getElementById('mainContent') },
        stage: { root: stage, header: stageHeader, content: document.getElementById('stageContent') },
        battle: { root: battle, header: battleHeader, content: document.getElementById('battleContent') },
      },
    });
    frame.stageTopUI.add(window.WeightPlayScreenFrame.createGroup().add(document.getElementById('stageSummary')));
    frame.battleTopUI.add(window.WeightPlayScreenFrame.createGroup()
      .add(document.getElementById('planTitle'))
      .add(document.getElementById('progressPill')));
    document.getElementById('battleStats').remove();
    document.getElementById('startBtn').dataset.wpFrameAction = 'primary';
    document.getElementById('mapBtn').dataset.wpFrameAction = 'secondary';
    document.getElementById('stageStartBtn').dataset.wpFrameAction = 'primary';
    document.getElementById('swapBtn').dataset.wpFrameAction = 'primary';
    document.getElementById('resetBtn').dataset.wpFrameAction = 'secondary';
    frame.commonDownButton.add(document.getElementById('stageStartBtn'));
    frame.activate('main');
    window.addEventListener('pagehide', (event) => { if (!event.persisted) frame.destroy(); }, { once: true });
    return frame;
  };
})();
