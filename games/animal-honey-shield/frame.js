/* Game content adapter; all controls and skin are owned by the shared frame. */
(function(){
  'use strict';
  window.mountHoneyShieldFrame=function(){
    const root=document.getElementById('gameFrame');
    const main=document.getElementById('mainScreen');
    const stage=document.querySelector('#stageScreen .stage-canvas');
    const battle=document.querySelector('#battleScreen .battle-canvas');
    const mainHeader=main.querySelector('header'),stageHeader=stage.querySelector('header'),battleHeader=battle.querySelector('header');
    const guide=root.querySelector('.game-page-info');guide.id='mainGuide';root.after(guide);
    const localeSelect=document.getElementById('localeSelect'),localeControl=mainHeader.querySelector('.locale-control');
    localeControl.hidden=true;root.append(localeControl);
    mainHeader.querySelector('[data-wp-game-title]').setAttribute('data-wp-frame-title','');
    const stageTitle=stageHeader.querySelector('[data-wp-game-title]');stageTitle.hidden=true;stageTitle.setAttribute('data-wp-frame-title','');stageHeader.append(stageTitle);
    const workspace=document.createElement('div');workspace.id='stageWorkspace';
    workspace.append(document.getElementById('stageSummary'),stage.querySelector('.chapter-panel'),document.getElementById('stageRail'));
    stage.append(workspace);stageHeader.querySelectorAll(':scope > div,:scope > span').forEach(n=>n.remove());
    stage.querySelector('.stage-tabs').setAttribute('data-wp-frame-nav','');
    const live=document.getElementById('battleLive'),info=battleHeader.querySelector('.battle-title');
    live.prepend(info);live.querySelector('.battle-actions').prepend(document.getElementById('pauseBtn'));
    const battleTitle=document.createElement('strong');battleTitle.setAttribute('data-wp-frame-title','');battleHeader.append(battleTitle);battle.prepend(battleHeader);
    for(const [selector,slot] of Object.entries({'.main-poster':'poster','.main-copy':'copy','.main-copy > p':'summary','#mainProgress':'progress'}))main.querySelector(selector).setAttribute(`data-wp-frame-${slot}`,'');
    main.querySelectorAll('.main-copy > small,.main-copy > h1').forEach(n=>n.hidden=true);
    root.querySelectorAll('button:not([data-wp-return]):not(.stage-card)').forEach(n=>n.setAttribute('data-wp-frame-action',n.classList.contains('primary-action')?'primary':'secondary'));
    document.querySelectorAll('#tutorialPanel button').forEach(n=>n.setAttribute('data-wp-frame-action',n.classList.contains('primary-action')?'primary':'secondary'));
    const frame=window.WeightPlayScreenFrame.mount({root,localeSelect,scenes:{
      main:{root:main,header:mainHeader,content:main.querySelector('.main-hero')},
      stage:{root:stage,header:stageHeader,content:workspace},
      battle:{root:battle,header:battleHeader,content:live,headerInfo:info}
    }});
    frame.activate('main');window.addEventListener('pagehide',event=>{if(!event.persisted)frame.destroy()});
    return frame;
  };
})();
