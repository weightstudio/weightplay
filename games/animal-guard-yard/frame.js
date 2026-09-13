/* Scene bindings only. Shared frame owns navigation artwork and settings. */
(() => {
  let frame;
  window.mountGuardYardFrame = () => {
    if (frame) return frame;
    const root = document.querySelector('.yard-game');
    const main = document.getElementById('mainPanel');
    const stage = document.getElementById('menuPanel');
    stage.dataset.wpStageLandscapeWidth = '760';
    stage.dataset.wpStageLandscapeHeight = '334';
    const battle = document.getElementById('playPanel');
    // Declare the content envelope to the shared scaler before its first fit.
    battle.dataset.wpBattleMinWidth = '390';
    battle.dataset.wpBattleMinHeight = '788';
    battle.dataset.wpBattleLandscapeWidth = '760';
    battle.dataset.wpBattleLandscapeHeight = '334';
    const localeSelect = document.getElementById('localeSelect');
    const mainHeader = root.querySelector('.topbar');
    const title = mainHeader.querySelector('h1');
    const retained = document.createElement('div'); retained.hidden = true;
    retained.append(localeSelect); root.append(retained);
    mainHeader.querySelector('.language-picker').remove();
    mainHeader.append(title); mainHeader.querySelector('.title-block').remove();
    title.setAttribute('data-wp-frame-title','');
    const mainContent = document.createElement('div');
    mainContent.append(...main.childNodes); main.append(mainHeader,mainContent);
    const copy = mainContent.querySelector('.main-entry-copy');
    copy.setAttribute('data-wp-frame-copy','');
    copy.querySelector('strong').hidden=true;
    copy.querySelector('[data-ui="menuHint"]').setAttribute('data-wp-frame-summary','');
    mainContent.querySelector('img').setAttribute('data-wp-frame-poster','');
    const start=document.getElementById('startGameBtn'); start.setAttribute('data-wp-frame-action','primary'); copy.append(start);
    const stageContent = stage.querySelector('.menu-shell');
    const stageHeader = stageContent.querySelector('.stage-screen-head');
    const stageTitle=stageHeader.querySelector('strong');
    stageTitle.setAttribute('data-wp-frame-title','');
    stageTitle.removeAttribute('data-ui');
    stageTitle.textContent='';
    stage.prepend(stageHeader);
    const wallet=stageContent.querySelector('.wallet-row');
    wallet.setAttribute('data-wp-frame-info','');
    wallet.querySelectorAll(':scope > span').forEach(node=>node.setAttribute('data-wp-frame-stat',''));
    stageHeader.append(wallet);
    const nav=document.getElementById('menuTabs'); nav.setAttribute('data-wp-frame-nav','');
    nav.querySelectorAll('button').forEach(n=>n.setAttribute('data-wp-frame-action','tab'));
    const battleContent=battle.querySelector('.fixed-game-shell');
    const battleHeader=battleContent.querySelector('.play-head');
    battleHeader.querySelector('[data-wp-return] .sr-only')?.remove();
    const battleTitle=document.createElement('strong'); battleTitle.setAttribute('data-wp-frame-title',''); battleHeader.append(battleTitle);
    // Keep the existing pause action distinct from shared sound preferences.
    const pause=document.getElementById('pauseBtn');
    pause.textContent='Ⅱ'; battleContent.querySelector('.yard-command-dock').append(pause);
    const info=battleHeader.querySelector('.resource-pill');
    const energy=document.createElement('span');
    energy.append(info.querySelector('.sun-icon'),document.getElementById('energyText'));
    info.prepend(energy); battleContent.prepend(info);
    battle.prepend(battleHeader);
    frame=window.WeightPlayScreenFrame.mount({root,localeSelect,scenes:{
      main:{root:main,header:mainHeader,content:mainContent},
      stage:{root:stage,header:stageHeader,content:stageContent},
      battle:{root:battle,header:battleHeader,content:battleContent,headerInfo:info}
    }});
    return frame;
  };
})();
