/* UI projection only. Native game callbacks, result content and buttons retain ownership. */
(() => {
  'use strict';
  const battle = document.getElementById('battleScreen');
  const result = document.getElementById('resultScreen');
  const play = battle?.querySelector('.battle-panel');
  if (!battle || !result || !play) return;
  // Mount once. Result is a substate of this permanent Battle Canvas.
  battle.append(result);
  battle.dataset.wpBattleCanvasRoot = '';
  result.dataset.wpBattleSubstate = 'result';
  result.setAttribute('role', 'dialog');
  result.setAttribute('aria-modal', 'true');
  result.setAttribute('aria-labelledby', 'resultTitle');
  result.querySelector('.result-actions').setAttribute('data-wp-frame-logical-actions', 'battle');
  const retry = result.querySelector('#retryBtn');
  let previousPhase = null;
  const sync = () => {
    // This is the explicit phase published by the native show() transaction.
    // Keep its legacy result value for native locale/measurement consumers.
    const phase = document.body.dataset.screen;
    const settled = phase === 'result';
    battle.hidden = phase === 'main';
    battle.dataset.wpBattleSubstate = settled ? 'result' : 'live';
    play.hidden = settled;
    play.inert = settled;
    document.body.toggleAttribute('data-wp-result-active', settled);
    if (settled && previousPhase !== phase) retry?.focus({ preventScroll: true });
    previousPhase = phase;
  };
  window.addEventListener('weightplay:shell-sync', sync);
  result.addEventListener('keydown', event => {
    if (document.body.dataset.screen !== 'result' || event.key !== 'Tab') return;
    const actions = [...result.querySelectorAll('button')].filter(button => !button.disabled && !button.hidden);
    const first = actions[0], last = actions[actions.length - 1];
    if (event.shiftKey && (document.activeElement === first || !result.contains(document.activeElement))) {
      event.preventDefault(); last?.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !result.contains(document.activeElement))) {
      event.preventDefault(); first?.focus();
    }
  });
  sync();
})();
