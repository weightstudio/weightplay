/* Bind existing permanent game content; shared core owns controls and skin. */
(() => {
  'use strict';
  const byId = id => document.getElementById(id);
  const root = byId('gameFrame');
  const main = byId('mainScreen');
  const stage = byId('stageScreen').querySelector('.stage-canvas');
  const battle = byId('battleScreen').querySelector('.battle-canvas');
  const headers = [main, stage, battle].map(node => node.querySelector('header'));
  const legacy = headers[0].querySelector('.header-utilities');
  legacy.hidden = true;
  root.append(legacy);
  legacy.append(byId('battleSoundBtn'));
  headers[0].querySelector('strong').dataset.wpFrameTitle = '';
  headers[1].querySelector('.stage-title-group').hidden = true;
  for (const header of headers.slice(1)) {
    const title = document.createElement('strong');
    title.dataset.wpFrameTitle = '';
    title.hidden = true;
    header.append(title);
  }
  const hero = main.querySelector('.main-hero');
  hero.className = 'spider-main-content';
  hero.querySelector('.poster-frame').dataset.wpFramePoster = '';
  const copy = hero.querySelector('.main-copy');
  copy.className = 'spider-main-copy';
  copy.dataset.wpFrameCopy = '';
  copy.querySelector('h1').hidden = true;
  copy.querySelector('.eyebrow').hidden = true;
  copy.querySelector('.menu-hint').dataset.wpFrameSummary = '';
  const info = document.createElement('div');
  info.dataset.wpFrameInfo = '';
  // Score remains with the board; three compact fields occupy the common HUD.
  for (const id of ['moveCount','timeValue','completedValue']) info.append(byId(id).parentElement);
  info.querySelectorAll('small').forEach(label => {
    const span = document.createElement('span');
    for (const attr of label.attributes) span.setAttribute(attr.name, attr.value);
    span.textContent = label.textContent;
    label.replaceWith(span);
  });
  const board = byId('boardShell');
  board.prepend(byId('scoreValue').parentElement, info);
  for (const id of ['startBtn','stageStartBtn','resultNewGame','tutorialDone','confirmYes']) byId(id).dataset.wpFrameAction = 'primary';
  for (const id of ['restartBtn','newGameBtn','resultRestart','resultClose','tutorialSkip','confirmNo','undoBtn','hintBtn','copyReplayLinkBtn','helpBtn']) byId(id).dataset.wpFrameAction = 'secondary';
  const frame = WeightPlayScreenFrame.mount({root, localeSelect:byId('localeSelect'), scenes:{
    main:{root:main,header:headers[0],content:hero},
    stage:{root:stage,header:headers[1],content:stage.querySelector('.stage-content')},
    battle:{root:battle,header:headers[2],content:board,headerInfo:info},
  }});
  const sync = () => {
    const scene = ['stage','battle'].includes(document.body.dataset.screen) ? document.body.dataset.screen : 'main';
    const covered = scene === 'battle' && ['resultOverlay','tutorialOverlay','confirmOverlay'].some(id=>!byId(id).hidden);
    byId('gameGuide').hidden = scene !== 'main';
    board.inert = scene !== 'battle' || covered;
    frame.activate(scene,{covered});
  };
  window.SpiderFrame = {sync};
  window.addEventListener('pagehide',event=>{if(!event.persisted){frame.destroy();delete window.SpiderFrame;}},{once:true});
  sync();
})();
