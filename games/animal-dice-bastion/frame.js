/* Content adapter only: controls, imagery and header geometry belong to core. */
(function () {
  'use strict';
  window.mountDiceBastionFrame = function () {
    const root = document.getElementById('gameFrame');
    const main = document.getElementById('mainScreen');
    const stage = document.querySelector('#stageScreen .stage-canvas');
    const battle = document.querySelector('#battleScreen .battle-canvas');
    const mainHeader = main.querySelector('header');
    const stageHeader = stage.querySelector(':scope > header');
    const battleHeader = battle.querySelector('.battle-header');
    const guide = root.querySelector('.game-page-info');
    guide.id = 'mainGuide'; root.after(guide);
    const localeControl = mainHeader.querySelector('.locale-control');
    localeControl.hidden = true; root.append(localeControl);
    mainHeader.querySelector('[data-wp-game-title]').setAttribute('data-wp-frame-title', '');
    const stageTitle = stageHeader.querySelector('[data-wp-game-title]');
    stageTitle.hidden = true; stageTitle.setAttribute('data-wp-frame-title', '');
    stageHeader.append(stageTitle);
    const workspace = document.createElement('div'); workspace.id = 'stageWorkspace';
    workspace.append(document.getElementById('stageSummary'), stage.querySelector('.chapter-panel'),
      document.getElementById('stageRail'), document.getElementById('teamPanel'), document.getElementById('equipmentPanel'));
    stage.append(workspace);
    stageHeader.querySelectorAll(':scope > div,:scope > span').forEach(node => node.remove());
    stage.querySelector('.stage-tabs').setAttribute('data-wp-frame-nav', '');
    const info = document.createElement('div'); info.setAttribute('data-wp-frame-info', '');
    info.append(battleHeader.querySelector('.battle-title'), ...battleHeader.querySelectorAll('.battle-stat'));
    document.getElementById('battleLive').prepend(info);
    const commands = document.querySelector('.command-stack');
    const commandHead = document.createElement('div'); commandHead.className = 'command-head';
    commandHead.append(commands.querySelector('.charge-meter'), document.getElementById('pauseBtn'));
    const actions = document.createElement('div'); actions.className = 'command-actions';
    actions.append(document.getElementById('summonBtn'));
    commands.querySelectorAll('.orders > button').forEach(button => {
      const cell = document.createElement('div'); cell.className = 'command-cell';
      const state = button.querySelector(':scope > small');
      button.querySelector('em').hidden = true;
      cell.append(button, state); actions.append(cell);
    });
    commands.querySelector('.orders').remove();
    commands.prepend(commandHead, actions);
    const title = document.createElement('strong'); title.setAttribute('data-wp-frame-title', '');
    battleHeader.append(title); battle.prepend(battleHeader);
    for (const [selector, slot] of Object.entries({'.main-poster':'poster','.main-copy':'copy','.main-copy > p':'summary','#mainProgress':'progress'})) {
      main.querySelector(selector).setAttribute(`data-wp-frame-${slot}`, '');
    }
    main.querySelectorAll('.main-copy > small,.main-copy > h1').forEach(node => node.hidden = true);
    root.querySelectorAll('button:not([data-wp-return])').forEach(node => {
      node.setAttribute('data-wp-frame-action', node.classList.contains('primary-action') || node.id === 'summonBtn' ? 'primary' : 'secondary');
    });
    const frame = window.WeightPlayScreenFrame.mount({root,localeSelect:document.getElementById('localeSelect'),scenes:{
      main:{root:main,header:mainHeader,content:main.querySelector('.main-hero')},
      stage:{root:stage,header:stageHeader,content:workspace},
      battle:{root:battle,header:battleHeader,content:document.getElementById('battleLive'),headerInfo:info}
    }});
    window.addEventListener('pagehide', event => { if (!event.persisted) frame.destroy(); });
    return frame;
  };
})();
