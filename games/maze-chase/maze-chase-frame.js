/* Shared Interface 9 composition for Maze Chase Main and Battle. */
(() => {
  'use strict';

  const frameApi = window.WeightPlayScreenFrame;
  const root = document.getElementById('classicArcade');
  const main = document.getElementById('mainScreen');
  const battle = document.getElementById('battleScreen');
  const mainHeader = root?.querySelector('.arcade-header');
  const mainPanel = main?.querySelector('.main-panel');
  const battlePanel = battle?.querySelector('.battle-panel');
  const mainReturn = document.getElementById('mainReturn');
  const mainTitle = document.getElementById('gameTitle');
  const localeSelect = document.getElementById('localeSelect');
  const roundLabel = document.getElementById('roundLabel');
  const battleBack = document.getElementById('backBtn');

  if (!frameApi || !root || !main || !battle || !mainHeader || !mainPanel || !battlePanel
    || !mainReturn || !mainTitle || !localeSelect || !roundLabel || !battleBack) {
    throw new Error('MAZE_CHASE_SHARED_FRAME_SLOTS_REQUIRED');
  }

  const sourceText = [
    document.getElementById('eyebrow'),
    document.getElementById('gameTagline'),
    document.getElementById('languageLabel'),
  ].filter(Boolean);
  const localePicker = mainHeader.querySelector('.locale-picker');
  const legacySound = document.getElementById('soundBtn');
  const retainedSources = document.createElement('div');
  retainedSources.hidden = true;
  retainedSources.inert = true;
  retainedSources.style.display = 'none';
  retainedSources.dataset.wpLegacySourceCarrier = '';
  root.append(retainedSources);
  [...sourceText, localeSelect, legacySound].filter(Boolean).forEach(node => retainedSources.append(node));
  localePicker?.remove();

  mainTitle.dataset.wpFrameTitle = '';
  const posterSlot = mainPanel.querySelector('.preview-art');
  const copySlot = mainPanel.querySelector('.main-copy');
  if (posterSlot && copySlot) mainPanel.insertBefore(posterSlot, copySlot);
  mainHeader.replaceChildren(mainReturn, mainTitle);
  main.prepend(mainHeader);
  mainPanel.querySelector('.cover')?.setAttribute('data-wp-frame-poster', '');
  mainPanel.querySelector('.main-copy')?.setAttribute('data-wp-frame-copy', '');
  document.getElementById('objective')?.setAttribute('data-wp-frame-summary', '');
  document.getElementById('mainProgress')?.setAttribute('data-wp-frame-progress', '');
  document.getElementById('startBtn')?.setAttribute('data-wp-frame-action', 'primary');

  const battleHeader = document.createElement('header');
  battleHeader.id = 'mazeChaseBattleHeader';
  const battleTitle = document.createElement('strong');
  battleTitle.setAttribute('data-wp-frame-title', '');
  battleHeader.append(battleBack, battleTitle);
  battle.prepend(battleHeader);
  battlePanel.querySelector('.battle-topline')?.remove();
  document.getElementById('backStayBtn')?.setAttribute('data-wp-frame-action', 'primary');
  document.getElementById('backLeaveBtn')?.setAttribute('data-wp-frame-action', 'secondary');
  document.getElementById('restartBtn')?.setAttribute('data-wp-frame-action', 'secondary');
  document.getElementById('homeBtn')?.setAttribute('data-wp-frame-action', 'secondary');
  document.getElementById('retryBtn')?.setAttribute('data-wp-frame-action', 'primary');

  const frame = frameApi.mount({
    root,
    localeSelect,
    playUI: true,
    scenes: {
      main: {root: main, header: mainHeader, content: mainPanel},
      battle: {root: battle, header: battleHeader, content: battlePanel},
    },
  });
  const battleInfo = frameApi.createGroup().add(roundLabel);
  frame.battleTopUI.add(battleInfo);

  const isVisible = node => Boolean(node && !node.hidden && getComputedStyle(node).display !== 'none');
  const sync = () => {
    if (isVisible(main)) {
      document.body.dataset.screen = 'main';
      frame.activate('main');
      return;
    }
    if (!isVisible(battle)) return;
    document.body.dataset.screen = 'battle';
    const covered = isVisible(document.getElementById('backConfirm'))
      || isVisible(document.getElementById('resultScreen'));
    frame.activate('battle', {covered});
  };

  const abort = new AbortController();
  window.addEventListener('weightplay:shell-sync', sync, {signal: abort.signal});
  const observer = new MutationObserver(sync);
  [main, battle, document.getElementById('backConfirm'), document.getElementById('resultScreen')]
    .filter(Boolean)
    .forEach(node => observer.observe(node, {attributes: true, attributeFilter: ['hidden', 'class']}));
  window.addEventListener('pagehide', event => {
    if (event.persisted) return;
    observer.disconnect();
    abort.abort();
    frame.destroy();
  }, {once: true});

  frame.activate('main');
})();
