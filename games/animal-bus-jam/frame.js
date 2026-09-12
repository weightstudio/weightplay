/* Content binding only; shared frame owns every header and preference control. */
(() => {
  'use strict';
  let frame;
  window.mountBusJamFrame = () => {
    if (frame) return frame;
    const $ = id => document.getElementById(id);
    const root = $('gameFrame'), select = $('locale');
    const oldLabel = select.closest('label');
    select.hidden = true;
    root.append(select);
    oldLabel.remove();
    // The shared guide is outside the framed poster/content group.
    const guide = root.querySelector('.public-guide');
    $('main').after(guide);
    frame = window.WeightPlayScreenFrame.mount({root, localeSelect: select, scenes: {
      main: {root: $('main'), header: $('main').querySelector('header'), content: root.querySelector('.main-content')},
      stage: {root: $('stage'), header: $('stage').querySelector('header'), content: $('stageContent')},
      battle: {root: $('battle'), header: $('battle').querySelector('header'), content: root.querySelector('.battle-content'), headerInfo: $('battleInfo')},
    }});
    const dialogs = ['result', 'deadlock', 'leaveBattle'].map($);
    dialogs.forEach(dialog => dialog.querySelectorAll('button').forEach(button => {
      button.dataset.wpFrameAction = button.classList.contains('primary') ? 'primary' : 'secondary';
    }));
    root.querySelectorAll('.stage-tabs button').forEach(button => { button.dataset.wpFrameAction = 'tab'; });
    const sync = () => {
      const scene = document.body.dataset.screen;
      const covered = scene === 'battle' && dialogs.some(dialog => dialog.open);
      guide.hidden = scene !== 'main';
      root.querySelector('.battle-content').inert = scene !== 'battle' || covered;
      frame.activate(scene, {covered});
    };
    const observer = new MutationObserver(sync);
    dialogs.forEach(dialog => observer.observe(dialog, {attributes: true, attributeFilter: ['open']}));
    window.addEventListener('pagehide', event => {
      if (!event.persisted) { observer.disconnect(); frame.destroy(); }
    });
    window.syncBusJamFrame = sync;
    return frame;
  };
})();
