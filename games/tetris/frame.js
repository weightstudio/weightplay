/* Shared Interface 9 composition for Tetris Main and Battle. */
(() => {
  'use strict';

  const api = window.WeightPlayScreenFrame;
  const root = document.querySelector('#popularArcade');
  const main = document.querySelector('#mainScreen');
  const battleScreen = document.querySelector('#battleScreen');
  const battlePanel = battleScreen?.querySelector('.battle-panel');
  if (!api || !root || !main || !battlePanel) throw new Error('TETRIS_SHARED_FRAME_REQUIRED');

  const mainHeader = root.querySelector('.main-header');
  const mainPanel = main.querySelector('.main-panel');
  const mainTitle = mainHeader?.querySelector('#gameTitle');
  const mainCopy = mainPanel?.querySelector('.main-copy');
  const localeSelect = root.querySelector('#localeSelect');
  const legacySettings = mainHeader?.querySelector('.settings-control');
  const localeCarrier = document.createElement('div');
  localeCarrier.hidden = true;
  localeCarrier.inert = true;
  localeCarrier.dataset.wpLegacyLocaleCarrier = '';
  if (!mainHeader || !mainPanel || !mainTitle || !mainCopy || !localeSelect || !legacySettings) {
    throw new Error('TETRIS_MAIN_FRAME_SLOTS_REQUIRED');
  }

  // Keep the locale source and runtime listener, while the shared Settings
  // component owns both visible controls.
  localeCarrier.append(localeSelect);
  root.append(localeCarrier);
  legacySettings.remove();
  const eyebrow = mainHeader.querySelector('#eyebrow');
  const tagline = mainHeader.querySelector('#gameTagline');
  if (eyebrow) mainCopy.prepend(eyebrow);
  if (tagline) mainCopy.prepend(tagline);
  mainHeader.querySelector('.main-header-copy')?.remove();
  mainHeader.insertBefore(mainTitle, mainHeader.querySelector('[data-wp-return="main"]')?.nextSibling || null);
  mainTitle.dataset.wpFrameTitle = '';
  main.prepend(mainHeader);
  mainPanel.dataset.wpFrameContent = 'main';
  mainPanel.querySelector('.cover')?.setAttribute('data-wp-frame-poster', '');
  mainCopy.dataset.wpFrameCopy = '';
  mainCopy.querySelector('#objective')?.setAttribute('data-wp-frame-summary', '');
  mainPanel.querySelector('#startBtn')?.setAttribute('data-wp-frame-action', 'primary');

  const battleHeader = battlePanel.querySelector('.battle-top');
  const battleContent = battlePanel.querySelector('.battle-content');
  const roundLabel = battleHeader?.querySelector('#roundLabel');
  const pause = battleContent?.querySelector('#pauseBtn');
  if (!battleHeader || !battleContent || !roundLabel || !pause) {
    throw new Error('TETRIS_BATTLE_FRAME_SLOTS_REQUIRED');
  }
  // The arcade adapter creates an I7 fallback utility before this frame runs.
  // I9 supplies the persistent shared Settings component in this same header.
  battleHeader.querySelector(':scope > [data-wp-battle-utility]')?.remove();
  const info = api.createGroup().add(roundLabel);
  const frame = api.mount({
    root,
    localeSelect,
    playUI: true,
    scenes: {
      main: {root: main, header: mainHeader, content: mainPanel},
      battle: {root: battlePanel, header: battleHeader, content: battleContent},
    },
  });
  frame.battleTopUI.add(info);

  const sync = () => {
    const scene = document.body.dataset.screen;
    if (scene === 'main') frame.activate('main');
    else frame.activate('battle', {covered: scene !== 'battle'});
  };
  const abort = new AbortController();
  window.addEventListener('weightplay:shell-sync', sync, {signal: abort.signal});
  window.addEventListener('pagehide', (event) => {
    if (event.persisted) return;
    abort.abort();
    frame.destroy();
  }, {once: true});
  frame.activate('main');
})();
