/* Binds game-owned content; the shared core owns all navigation and settings. */
(() => {
  'use strict';
  window.mountUnblockFrame = () => {
    const byId = id => document.getElementById(id);
    const root = byId('gameFrame');
    const localeSelect = byId('locale');
    localeSelect.hidden = true;
    root.append(localeSelect);
    root.querySelectorAll('.tools button,.result-actions button,.leave-actions button,#start').forEach(button => {
      button.dataset.wpFrameAction = ['start','continuePlay'].includes(button.id) ? 'primary' : 'secondary';
    });
    const frame = window.WeightPlayScreenFrame.mount({root, localeSelect, scenes: {
      main: {root: byId('main'), header: byId('main').querySelector('header'), content: byId('main').querySelector('.hero')},
      stage: {root: byId('stage'), header: byId('stage').querySelector('header'), content: byId('stageGrid')},
      battle: {root: byId('battle'), header: byId('battle').querySelector('header'), content: byId('battleLive'), headerInfo: byId('battleInfo')},
    }});
    window.addEventListener('pagehide', event => { if (!event.persisted) frame.destroy(); });
    return frame;
  };
})();
