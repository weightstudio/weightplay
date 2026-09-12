/* Game content binding only. Shared core owns navigation art and settings. */
(() => {
  'use strict';
  let mounted;
  window.mountZhaoFrame = () => {
    if (mounted) return mounted;
    const byId = id => document.getElementById(id);
    const root = byId('gameFrame');
    const localeSelect = byId('locale');
    const main = byId('main'), stage = byId('stage'), battle = byId('battle');
    battle.querySelector('.battle-actions').append(byId('battleUtilityBtn'));
    if (!root || !localeSelect?.options.length) throw new Error('ZHAO_FRAME_NOT_READY');
    localeSelect.hidden = true;
    const oldLocaleLabel = localeSelect.closest('label');
    root.append(localeSelect);
    oldLocaleLabel?.remove();
    mounted = window.WeightPlayScreenFrame.mount({root, localeSelect, scenes: {
      main: {root: main, header: main.querySelector('header'), content: main.querySelector('.main-content')},
      stage: {root: stage, header: stage.querySelector('header'), content: byId('stageContent')},
      battle: {root: battle, header: battle.querySelector('header'), content: battle.querySelector('.battle-content'), headerInfo: byId('battleInfo')},
    }});
    const dialogs = ['tutorial', 'leaveBattle', 'result'].map(byId);
    dialogs.forEach(dialog => dialog.querySelectorAll('button').forEach(button => {
      button.dataset.wpFrameAction = button.classList.contains('primary') ? 'primary' : 'secondary';
    }));
    const battleContent = battle.querySelector('.battle-content');
    const syncCover = () => {
      const active = document.body.dataset.screen;
      if (!mounted || !['main', 'stage', 'battle'].includes(active)) return;
      const covered = active === 'battle' && dialogs.some(dialog => dialog.open);
      battleContent.inert = active !== 'battle' || covered;
      mounted.activate(active, {covered});
    };
    const observer = new MutationObserver(syncCover);
    dialogs.forEach(dialog => observer.observe(dialog, {attributes:true, attributeFilter:['open']}));
    observer.observe(document.body, {attributes:true, attributeFilter:['data-screen']});
    window.addEventListener('pagehide', event => {
      if (!event.persisted) { observer.disconnect(); mounted.destroy(); mounted = null; }
    });
    return mounted;
  };
})();
