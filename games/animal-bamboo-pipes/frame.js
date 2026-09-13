/* Game-owned slot bindings only. All control rendering belongs to the shared frame. */
(() => {
  'use strict';
  let binding;
  window.mountBambooFrame = () => {
    if (binding) return binding;
    const $ = id => document.getElementById(id);
    const root = $('gameFrame'), main = $('main'), stage = $('stage'), battle = $('battle');
    if (!root || !window.WeightPlayScreenFrame) throw new Error('BAMBOO_FRAME_DEPENDENCY_REQUIRED');
    const mainHeader = main.querySelector('header');
    const mainContent = main.querySelector('.hero');
    const copy = mainContent.querySelector(':scope > div');
    mainContent.className = 'bamboo-main-content';
    mainContent.querySelector('img').dataset.wpFramePoster = '';
    copy.dataset.wpFrameCopy = '';
    copy.querySelector('[data-bamboo-t="summary"]').dataset.wpFrameSummary = '';
    copy.querySelector('h1').hidden = true;
    copy.querySelector('.eyebrow').hidden = true;
    mainHeader.querySelector('strong').dataset.wpFrameTitle = '';
    mainHeader.querySelector('.locale').hidden = true;

    const stageHeader = stage.querySelector('header');
    stageHeader.querySelector('h2').dataset.wpFrameTitle = '';
    stageHeader.querySelector('small').hidden = true;
    stage.querySelector('.stage-tabs').dataset.wpFrameNav = '';

    const battleHeader = battle.querySelector('header');
    for (const id of ['battleUtilityBtn', 'battleSettingsPanel']) {
      $(id).hidden = true;
      $(id).inert = true;
    }
    const battleContent = battle.querySelector('.battle-panel');
    const context = battleHeader.querySelector(':scope > div');
    // Keep the existing localized context and moves nodes, never clone their IDs.
    const info = document.createElement('div');
    info.dataset.wpFrameInfo = '';
    info.append(context, $('moves'));
    battleContent.prepend(info);
    const title = document.createElement('span');
    title.dataset.wpFrameTitle = '';
    title.hidden = true;
    battleHeader.append(title);

    for (const id of ['start', 'next', 'continueBattle']) $(id).dataset.wpFrameAction = 'primary';
    for (const id of ['undo', 'hint', 'restart', 'resultStages', 'retry', 'leaveBattle']) $(id).dataset.wpFrameAction = 'secondary';
    const frame = window.WeightPlayScreenFrame.mount({
      root, localeSelect: $('locale'), scenes: {
        main: {root: main, header: mainHeader, content: mainContent},
        stage: {root: stage, header: stageHeader, content: $('rail')},
        battle: {root: battle, header: battleHeader, content: battleContent, headerInfo: info}
      }
    });
    const abort = new AbortController();
    binding = Object.freeze({
      sync() {
        const scene = document.body.dataset.screen || 'main';
        frame.activate(scene, {covered: scene === 'battle' &&
          (!$('result').hidden || !$('leaveDialog').hidden)});
      },
      destroy() { abort.abort(); frame.destroy(); binding = null; }
    });
    window.addEventListener('pagehide', event => {
      if (!event.persisted) binding?.destroy();
    }, {signal: abort.signal});
    binding.sync();
    return binding;
  };
})();
