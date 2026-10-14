/* UI projection only. Native Forest code owns play, saves and rewards. */
(() => {
  'use strict';
  const gameId = 'animal-2048';
  const rail = document.getElementById('stageRail');
  const result = document.getElementById('resultPanel');
  const battle = document.getElementById('battleScreen');
  let earnedCompletion = null;
  let observing = false;

  function history() {
    try {
      const api = window.WeightPlayCastle;
      if (!api?.read || !api.key) return null;
      const raw = localStorage.getItem(api.key);
      if (raw !== null) {
        const stored = JSON.parse(raw);
        if (!stored || ![1, 2, 3].includes(stored.version)) return null;
        if (stored.completions !== undefined && (!stored.completions || typeof stored.completions !== 'object' || Array.isArray(stored.completions))) return null;
      }
      const save = JSON.parse(localStorage.getItem('weightplay_animal_2048_v1') || '{}');
      return { completions: api.read().completions, cleared: save?.cleared || {} };
    } catch { return null; }
  }

  function bindCard(card, index) {
    // The separate endless destination never grants a tracked Stage block.
    if (!Number.isInteger(index) || index < 0 || index >= window.ForestCampaign.length) {
      card.querySelector(':scope > [data-wp-get-icon]')?.remove();
      for (const attribute of [...card.attributes]) {
        if (attribute.name.startsWith('data-wp-get-')) card.removeAttribute(attribute.name);
      }
      return;
    }
    const saved = history();
    const state = !saved ? 'unknown' : saved.completions[`${gameId}:stage-${index + 1}`]
      ? 'collected' : saved.cleared[index] ? 'unknown' : 'not-collected';
    card.dataset.wpGetGameId = gameId;
    card.dataset.wpGetIndex = String(index);
    if (card.dataset.wpGetState !== state) card.dataset.wpGetState = state;
    window.ShowGet?.(gameId, index);
  }

  function syncStage() {
    if (document.body.dataset.screen !== 'stage') return;
    for (const card of rail.querySelectorAll(':scope > .stage-card')) bindCard(card, Number(card.dataset.index));
  }

  function syncResult() {
    if (document.body.dataset.screen !== 'battle' || result.hidden) return;
    const saved = history();
    window.ShowResultGet?.(gameId, Boolean(earnedCompletion && saved?.completions[`${gameId}:${earnedCompletion}`]));
  }

  const observer = new MutationObserver(syncResult);
  function syncScene() {
    const active = document.body.dataset.screen === 'battle';
    if (active && !observing) observer.observe(result, { attributes: true, attributeFilter: ['hidden'] });
    if (!active && observing) observer.disconnect();
    observing = active;
    syncStage();
    syncResult();
  }

  window.WeightPlayForestInterface = Object.freeze({ bindCard });
  window.addEventListener('weightplay:shell-sync', syncScene);
  window.addEventListener('weightplay:stage-sync', syncStage);
  window.addEventListener('weightplay:battle-open', () => {
    earnedCompletion = null;
    syncScene();
  });
  window.addEventListener('weightplay:castle-ready', () => { syncStage(); syncResult(); });
  window.addEventListener('weightplay:castle-updated', () => { syncStage(); syncResult(); });
  window.addEventListener('weightplay:castle-reward', event => {
    const detail = event.detail;
    const completion = detail?.completionId;
    const stage = /^stage-([1-9][0-9]*)$/.exec(completion || '');
    if (detail?.gameId !== gameId || document.body.dataset.screen !== 'battle' || battle.hidden || !stage || Number(stage[1]) > window.ForestCampaign.length) return;
    if (!history()?.completions[`${gameId}:${completion}`]) return;
    earnedCompletion = completion;
    syncResult();
    // The shared Result marker replaces only this game's legacy reward notice.
    queueMicrotask(() => window.WeightPlayCastle?.dismissRewardNotice?.(gameId));
  });
})();
