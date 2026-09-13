/* Scene/content binding only. All header, icon and settings styling is shared. */
(function () {
  'use strict';
  let mounted;
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
    mainContent.querySelector('.cover').setAttribute('data-wp-frame-poster', '');
    const copy = mainContent.querySelector('.menu-copy');
    copy.setAttribute('data-wp-frame-copy', '');
    copy.querySelector('[data-ui="menuHint"]').setAttribute('data-wp-frame-summary', '');
    copy.querySelector('[data-ui="menuTitle"]').hidden = true;
    document.getElementById('mainProgress')?.setAttribute('data-wp-frame-progress', '');
    document.getElementById('mainStartBtn').setAttribute('data-wp-frame-action', 'primary');
    const stageHeader = stage.querySelector(':scope > header');
    stageHeader.querySelector('strong').setAttribute('data-wp-frame-title', '');
    stageHeader.querySelector('strong').hidden = true;
    stage.querySelector('.beast-stage-tabs').setAttribute('data-wp-frame-nav', '');
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
    root.setAttribute('data-wp-frame-root', '');
    mounted = core.mount({ root, localeSelect, scenes: {
      main: { root: main, header: oldMainHeader, content: mainContent },
      stage: { root: stage, header: stageHeader, content: workspace },
      battle: { root: battle, header: battleHeader, content: play, headerInfo: info },
    }});
    window.addEventListener('pagehide', event => { if (!event.persisted && mounted) { mounted.destroy(); mounted = null; } });
    return mounted;
  };
})();
