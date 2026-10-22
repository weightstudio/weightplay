/* Scene/content binding only. All header, icon and settings styling is shared. */
(function () {
  'use strict';
  let mounted;
  let overlayObserver;
  const frameEvents = new AbortController();
  window.mountBeastDeckFrame = function () {
    if (mounted) return mounted;
    const root = document.getElementById('main');
    const main = document.getElementById('menuPanel');
    const stage = document.getElementById('stagePanel');
    const battle = document.getElementById('gamePanel');
    const core = window.WeightPlayScreenFrame;
    const oldMainHeader = root?.querySelector(':scope > .topbar');
    const workspace = stage?.querySelector('.beast-stage-workspace');
    const hud = battle?.querySelector('.hud-row');
    if (!core || !oldMainHeader || !workspace || !hud) throw new Error('BEAST_FRAME_INPUTS_REQUIRED');
    const localeSelect = document.getElementById('localeSelect');
    oldMainHeader.classList.remove('topbar');
    const mainContent = document.createElement('div');
    mainContent.append(...main.childNodes);
    main.append(oldMainHeader, mainContent);
    const title = oldMainHeader.querySelector('h1');
    title.setAttribute('data-wp-frame-title', '');
    oldMainHeader.append(title);
    oldMainHeader.querySelector('.brand-title')?.remove();
    const carrier = oldMainHeader.querySelector('.language-picker');
    carrier.hidden = true;
    carrier.style.display = 'none';
    root.append(carrier);
    const mainPoster = mainContent.querySelector('.cover');
    mainPoster.setAttribute('data-wp-frame-poster', '');
    mainPoster.classList.remove('cover');
    const copy = mainContent.querySelector('.menu-copy');
    copy.setAttribute('data-wp-frame-copy', '');
    copy.querySelector('[data-ui="menuHint"]').setAttribute('data-wp-frame-summary', '');
    copy.querySelector('[data-ui="menuTitle"]').hidden = true;
    document.getElementById('mainProgress')?.setAttribute('data-wp-frame-progress', '');
    document.getElementById('mainStartBtn').setAttribute('data-wp-frame-action', 'primary');
    const stageHeader = stage.querySelector(':scope > header');
    stageHeader.querySelector('strong').setAttribute('data-wp-frame-title', '');
    stageHeader.querySelector('strong').hidden = true;
    const stageNav = stage.querySelector('.beast-stage-tabs');
    stageNav.dataset.wpFrameNav = '';
    stageNav.dataset.wpFrameStageNav = '';
    stageNav.setAttribute('role', 'tablist');
    for (const button of stageNav.querySelectorAll('[data-stage-tab]')) {
      button.dataset.wpFrameAction = 'tab';
      const view = stage.querySelector(`[data-stage-view="${button.dataset.stageTab}"]`);
      if (!view) continue;
      if (!view.id) view.id = `beast-stage-${button.dataset.stageTab}`;
      if (!button.id) button.id = `beast-stage-tab-${button.dataset.stageTab}`;
      button.setAttribute('aria-controls', view.id);
      view.setAttribute('role', 'tabpanel');
      view.setAttribute('aria-labelledby', button.id);
    }
    stage.dataset.wpFramePlayFill = '';
    const battleHeader = document.createElement('header');
    const battleTitle = document.createElement('strong');
    battleTitle.setAttribute('data-wp-frame-title', '');
    battleHeader.append(document.getElementById('menuBtn'), battleTitle);
    const play = document.createElement('div');
    play.className = 'beast-frame-play';
    const info = document.createElement('div');
    info.setAttribute('data-wp-frame-info', '');
    for (const id of ['stageText', 'missionText', 'hpText']) info.append(document.getElementById(id).parentElement);
    // Remaining energy/deck/discard fields remain game-owned and live.
    const oldUtility = document.getElementById('battleUtilityBtn');
    if (oldUtility) { oldUtility.hidden = true; oldUtility.style.display = 'none'; }
    play.append(info, hud, battle.querySelector('.battlefield'), battle.querySelector('.action-area'));
    battle.prepend(battleHeader, play);
    battle.dataset.wpFramePlayFill = '';
    root.setAttribute('data-wp-frame-root', '');
    mounted = core.mount({ root, localeSelect, playUI: true, scenes: {
      main: { root: main, header: oldMainHeader, content: mainContent },
      stage: { root: stage, header: stageHeader, content: workspace },
      battle: { root: battle, header: battleHeader, content: play, headerInfo: info },
    }});
    const result = root.querySelector('#resultPanel');
    const leave = root.querySelector('#leavePanel');
    const visible = node => Boolean(node && !node.hidden && !node.classList.contains('hidden') && node.getClientRects().length);
    const syncOverlay = () => {
      if (!mounted) return;
      const scene = document.body.dataset.screen;
      if (!['main', 'stage', 'battle'].includes(scene)) return;
      mounted.activate(scene, { covered: scene === 'battle' && (visible(result) || visible(leave)) });
    };
    window.addEventListener('weightplay:tutorial-open', event => {
      if (event.detail?.gameId === 'beast-deck') document.body.dataset.wpFrameTutorial = 'true';
    }, { signal: frameEvents.signal });
    window.addEventListener('weightplay:tutorial-close', event => {
      if (event.detail?.gameId === 'beast-deck') document.body.removeAttribute('data-wp-frame-tutorial');
    }, { signal: frameEvents.signal });
    overlayObserver = new MutationObserver(syncOverlay);
    for (const node of [result, leave]) {
      if (node) overlayObserver.observe(node, { attributes: true, attributeFilter: ['class', 'hidden', 'aria-hidden'] });
    }
    syncOverlay();
    window.addEventListener('pagehide', event => {
      if (event.persisted || !mounted) return;
      overlayObserver?.disconnect();
      overlayObserver = null;
      frameEvents.abort();
      mounted.destroy();
      mounted = null;
    });
    return mounted;
  };
})();
