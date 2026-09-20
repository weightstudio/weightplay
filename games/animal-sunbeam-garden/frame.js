/* Scene content binding only; shared core owns all header/preferences styling. */
(() => {
  'use strict';
  const install = () => {
    const $ = id => document.getElementById(id);
    const root = $('gameFrame'), main = $('main'), stage = $('stage'), battle = $('battle');
    if (!root || root.dataset.wpFrame || !window.WeightPlayScreenFrame) return;
    const mainHeader = main.querySelector('header');
    const mainContent = main.querySelector('.hero');
    const copy = mainContent.querySelector('div');
    main.classList.remove('main-screen');
    mainContent.className = 'sunbeam-main-content';
    const poster = mainContent.querySelector('img');
    poster.classList.add('main-poster');
    poster.dataset.wpFramePoster = '';
    copy.dataset.wpFrameCopy = '';
    copy.querySelector('[data-t="summary"]').dataset.wpFrameSummary = '';
    copy.querySelector('h1').hidden = true;
    copy.querySelector('.eyebrow').hidden = true;
    const title = mainHeader.querySelector('strong');
    title.dataset.wpFrameTitle = '';
    title.textContent = copy.querySelector('h1').textContent;
    title.removeAttribute('data-t');
    title.dataset.wpGameTitle = '';
    mainHeader.querySelector('label').hidden = true;
    const stageHeader = stage.querySelector('header');
    stageHeader.querySelector('div').hidden = true;
    stageHeader.querySelector('h2').dataset.wpFrameTitle = '';
    const stageContent = document.createElement('section');
    stageContent.className = 'sunbeam-stage-content';
    stageContent.append($('progress'), $('stageGrid'));
    stage.append(stageContent);
    const navigation = stage.querySelector('.stage-tabs');
    navigation.dataset.wpFrameNav = '';
    stage.append(navigation);
    const battleHeader = battle.querySelector('header');
    const battleContent = battle.querySelector('.battle-content');
    const info = document.createElement('div');
    info.dataset.wpFrameInfo = '';
    const levelStat = document.createElement('div');
    for (const [id,tag] of [['chapter','span'],['stageName','strong']]) {
      const old = $(id), node = document.createElement(tag);
      node.id = id; node.textContent = old.textContent; old.replaceWith(node);
      levelStat.append(node);
    }
    const beamStat = document.createElement('div');
    beamStat.append($('beamState'));
    info.append(levelStat, beamStat);
    battleContent.prepend(info);
    const oldTitle = battleHeader.querySelector('div');
    oldTitle.hidden = true;
    oldTitle.dataset.wpFrameTitle = '';
    const help = $('battleHelp');
    battleContent.append(help);
    for (const id of ['start','next','tutorialClose','leaveContinue']) $(id).dataset.wpFrameAction = 'primary';
    for (const id of ['tutorialOpen','undo','hint','reset','resultStages','retry','leaveStage']) $(id).dataset.wpFrameAction = 'secondary';
    const frame = WeightPlayScreenFrame.mount({root, localeSelect:$('locale'), scenes:{
      main:{root:main,header:mainHeader,content:mainContent},
      stage:{root:stage,header:stageHeader,content:stageContent},
      battle:{root:battle,header:battleHeader,content:battleContent,headerInfo:info}
    }});
    const abort = new AbortController();
    const sync = () => {
      const code = ({'zh-Hant':'zh-tw','zh-Hans':'zh-cn','pt-BR':'pt-br'}[document.documentElement.lang] || document.documentElement.lang || 'en');
      const strings = window.SUNBEAM_GUIDE_LOCALES?.[code];
      if (strings) for (const node of document.querySelectorAll('#gameGuide [data-i18n]')) node.textContent = strings[node.dataset.i18n];
      const scene = document.body.dataset.screen || 'main';
      const covered = scene === 'battle' && ($('result').open || $('leave').open || $('tutorialPanel').open);
      frame.activate(scene,{covered});
    };
    window.addEventListener('weightplay:game-view-change',sync,{signal:abort.signal});
    for (const id of ['result','leave','tutorialPanel']) {
      $(id).addEventListener('toggle',sync,{signal:abort.signal});
      $(id).addEventListener('close',sync,{signal:abort.signal});
    }
    window.addEventListener('pagehide',event => {
      if (!event.persisted) {abort.abort();frame.destroy();}
    },{signal:abort.signal});
    sync();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
