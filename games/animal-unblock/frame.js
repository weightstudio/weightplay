/* Bind Animal Unblock content to the shared Interface 9 frame and Stage rail. */
(() => {
  'use strict';

  const byId = (id) => document.getElementById(id);

  window.mountUnblockFrame = function mountUnblockFrame({ config, selected, onSelect, onStart }) {
    if (!window.WeightPlayScreenFrame || !window.WeightPlayPlayUI || !config) {
      throw new Error('UNBLOCK_I9_SHARED_RUNTIME_REQUIRED');
    }

    const root = byId('gameFrame');
    const main = byId('main');
    const stage = byId('stage');
    const battle = byId('battle');
    const localeSelect = byId('locale');
    const stageProgress = byId('progress');
    const battleInfo = byId('battleInfo');
    const trailName = byId('trailName');
    const moveCount = byId('moveCount');

    for (const [selector, slot] of Object.entries({
      '.cover': 'poster',
      '.hero > div': 'copy',
      '.main-summary': 'summary',
      '#mainProgress': 'progress',
    })) {
      main.querySelector(selector)?.setAttribute(`data-wp-frame-${slot}`, '');
    }

    root.querySelectorAll('button:not([data-wp-return])').forEach((button) => {
      button.dataset.wpFrameAction = button.matches('#start, #next, #retry, #continuePlay')
        ? 'primary'
        : 'secondary';
    });

    localeSelect.hidden = true;
    root.append(localeSelect);
    battleInfo.replaceChildren();

    const frame = window.WeightPlayScreenFrame.mount({
      root,
      localeSelect,
      playUI: true,
      scenes: {
        main: { root: main, header: main.querySelector('header'), content: main.querySelector('.hero') },
        stage: { root: stage, header: stage.querySelector('header'), content: byId('stageWorkspace'), headerInfo: byId('stageInfo') },
        battle: { root: battle, header: battle.querySelector('header'), content: byId('battleLive'), headerInfo: battleInfo },
      },
    });

    frame.stageTopUI.add(window.WeightPlayScreenFrame.createGroup().add(stageProgress));
    frame.battleTopUI.add(window.WeightPlayScreenFrame.createGroup().add(trailName).add(moveCount));
    frame.commonDownButton.clear();

    const stageSelector = window.WeightPlayPlayUI.mountStage({
      page: byId('stageWorkspace'),
      rail: byId('stageGrid'),
      config,
      selected,
      onSelect,
      onStart,
      isActive: () => document.body.dataset.unblockScreen === 'stage',
    });

    frame.activate('main');
    window.addEventListener('pagehide', (event) => {
      if (event.persisted) return;
      stageSelector.destroy();
      frame.destroy();
    }, { once: true });
    return { frame, stageSelector };
  };
})();
