/* Explicit presentation binding for the existing native Main/Battle flow. */
(() => {
  'use strict';
  const root = document.getElementById('popularArcade');
  const main = document.getElementById('mainScreen');
  const battle = document.getElementById('battleScreen');
  const mainHeader = main?.querySelector('.arcade-header');
  const battleHeader = battle?.querySelector('.battle-top');
  const mainContent = main?.querySelector('.main-panel');
  const play = battle?.querySelector('.battle-panel');
  if (!root || !mainHeader || !battleHeader || !mainContent || !play || !window.WeightPlayScreenFrame) return;
  mainContent.className = 'tic-main-content';
  const localeSelect = mainHeader.querySelector('#localeSelect');
  const title = mainHeader.querySelector('#gameTitle');
  const tagline = mainHeader.querySelector('#gameTagline');
  const mainCopy = mainContent.querySelector('.main-copy');
  title.setAttribute('data-wp-frame-title', '');
  mainHeader.append(title);
  mainCopy.prepend(tagline);
  tagline.setAttribute('data-wp-frame-summary', '');
  mainCopy.setAttribute('data-wp-frame-copy', '');
  mainContent.querySelector('.preview-art').setAttribute('data-wp-frame-poster', '');
  main.querySelector('#startBtn').setAttribute('data-wp-frame-action', 'primary');
  // Retain native locale options/listener and prose nodes without duplicate chrome.
  const legacy = document.createElement('div');
  legacy.hidden = true;
  legacy.append(...[...mainHeader.children].filter(node => node !== title && !node.matches('[data-wp-return="main"]')));
  main.append(legacy);
  const route = location.pathname.split('/').filter(Boolean)[0];
  const localeRoute = /^(en|zh-tw|zh-cn|ja|ko|es|pt-br|fr|de|it|ru|hi|ar)$/.test(route) ? route : 'en';
  mainHeader.querySelector('[data-wp-return="main"]').href = `/${localeRoute}/`;
  const actions = battleHeader.querySelector('.control-row');
  actions.className = 'tic-native-actions';
  for (const button of actions.querySelectorAll('button')) button.setAttribute('data-wp-frame-action', 'secondary');
  play.append(actions);
  const info = document.createElement('div');
  const stat = document.createElement('div');
  stat.append(battleHeader.querySelector('#roundLabel'));
  info.append(stat); play.append(info);
  const battleTitle = document.createElement('strong');
  battleTitle.setAttribute('data-wp-frame-title', '');
  battleHeader.append(battleTitle);
  battle.prepend(battleHeader);
  battle.setAttribute('data-wp-frame-play-fill', '');
  battle.setAttribute('data-wp-frame-logical-header', 'battle');
  for (const button of document.querySelectorAll('#resultScreen .result-actions button')) {
    button.setAttribute('data-wp-frame-action', button.id === 'retryBtn' ? 'primary' : 'secondary');
  }
  const frame = window.WeightPlayScreenFrame.mount({root, localeSelect, scenes: {
    main: {root:main, header:mainHeader, content:mainContent},
    battle: {root:battle, header:battleHeader, content:play, headerInfo:info},
  }});
  const clock = window.WeightPlayTicUiClock;
  if (!clock) throw new Error('TIC_UI_CLOCK_REQUIRED');
  const back = battleHeader.querySelector('[data-wp-return="battle"]');
  const leave = document.createElement('section');
  leave.id = 'ticLeave'; leave.hidden = true;
  leave.dataset.wpBattleSubstate = 'leave-confirmation';
  leave.setAttribute('role', 'dialog'); leave.setAttribute('aria-modal', 'true');
  leave.setAttribute('aria-labelledby', 'ticLeaveTitle'); leave.setAttribute('aria-describedby', 'ticLeaveText');
  leave.innerHTML = '<h2 id="ticLeaveTitle"></h2><div class="tic-leave-copy"><p id="ticLeaveText"></p></div><div class="tic-leave-actions"><button id="ticContinue" type="button" data-wp-frame-action="primary"></button><button id="ticLeaveMain" type="button" data-wp-frame-action="secondary"></button></div>';
  battle.append(leave);
  const continueButton = leave.querySelector('#ticContinue');
  const leaveButton = leave.querySelector('#ticLeaveMain');
  const translateLeave = () => {
    const text = window.WeightPlayTicInterfaceText;
    leave.querySelector('#ticLeaveTitle').textContent = text('title');
    leave.querySelector('#ticLeaveText').textContent = text('consequence');
    continueButton.textContent = text('continue'); leaveButton.textContent = text('main');
  };
  translateLeave();
  let previous = null, generation = 0, leaving = false, suspended = false, unfocused = false;
  const sync = () => {
    const phase = document.body.dataset.screen;
    const scene = phase === 'main' ? 'main' : 'battle';
    if (scene !== previous) generation++;
    if (scene === 'main') { leaving = false; clock.cancelAll(); }
    // Named reasons remain independent of visibility and each other.
    clock.setPaused('scene-away', scene !== 'battle');
    clock.setPaused('leave-confirmation', leaving);
    clock.setPaused('result', phase === 'result');
    clock.setPaused('pagehide', suspended);
    clock.setPaused('window-blur', unfocused);
    const settingsOpen = [...root.querySelectorAll('.wp-frame-popover')].some(panel => !panel.hidden);
    clock.setPaused('settings', settingsOpen);
    leave.hidden = !leaving;
    if (!leaving) leave.querySelector('.tic-leave-copy').scrollTop = 0;
    play.inert = leaving || phase === 'result' || !clock.active;
    battle.toggleAttribute('data-wp-paused', !clock.active);
    battle.dataset.wpBattleSubstate = leaving ? 'leave-confirmation' : phase === 'result' ? 'result' : 'live';
    // Keep the native Result phase for locale/telemetry; both dialogs own Battle.
    frame.activate(scene, {covered:phase === 'result' || leaving});
    for (const guide of document.querySelectorAll('.game-page-info')) {
      guide.hidden = scene !== 'main'; guide.inert = scene !== 'main';
      guide.setAttribute('aria-hidden', String(scene !== 'main'));
    }
    if (scene !== 'main' && previous === 'main') {
      window.scrollTo({top:0,left:0,behavior:'auto'});
      const owner = generation;
      queueMicrotask(() => {
        if (owner !== generation || document.body.dataset.screen !== 'battle' || leaving || suspended || !clock.active) return;
        battle.querySelector('#board .tic-cell:not(:disabled)')?.focus({preventScroll:true});
      });
    }
    if (scene === 'main' && previous && previous !== 'main') main.querySelector('#startBtn').focus({preventScroll:true});
    previous = scene;
  };
  const resume = () => {
    if (!leaving) return;
    leaving = false; sync(); back.focus({preventScroll:true});
  };
  window.WeightPlayTicFrame = Object.freeze({back() {
    if (document.body.dataset.screen !== 'battle' || leaving || suspended) return;
    const mutable = [...play.querySelectorAll('.tic-cell')].some(cell => /^[XO]$/.test(cell.textContent.trim()));
    if (!mutable) { document.getElementById('homeBtn').click(); return; }
    leaving = true; translateLeave(); frame.close(); sync();
    continueButton.focus({preventScroll:true});
  }});
  continueButton.addEventListener('click', resume);
  leaveButton.addEventListener('click', () => {
    if (!leaving) return;
    clock.cancelAll();
    document.getElementById('homeBtn').click();
  });
  document.addEventListener('keydown', event => {
    if (!leaving) return;
    if (event.key === 'Escape') { event.preventDefault(); event.stopImmediatePropagation(); resume(); return; }
    if (event.key !== 'Tab') return;
    if (event.shiftKey && (document.activeElement === continueButton || !leave.contains(document.activeElement))) {
      event.preventDefault(); leaveButton.focus();
    } else if (!event.shiftKey && (document.activeElement === leaveButton || !leave.contains(document.activeElement))) {
      event.preventDefault(); continueButton.focus();
    }
  }, true);
  window.addEventListener('weightplay:shell-sync', sync);
  window.addEventListener('weightplay:interaction-state', sync);
  window.addEventListener('blur', () => { unfocused = true; sync(); });
  window.addEventListener('focus', () => { unfocused = false; sync(); });
  document.addEventListener('visibilitychange', sync);
  localeSelect.addEventListener('change', translateLeave);
  window.addEventListener('pagehide', () => { suspended = true; generation++; frame.close(); sync(); });
  window.addEventListener('pageshow', () => { suspended = false; sync(); });
  sync();
})();
