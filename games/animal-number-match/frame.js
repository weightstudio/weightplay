/* Game-owned content binding. Shared frame owns navigation, preferences and play UI. */
(() => {
  'use strict';
  const install = () => {
    const $ = id => document.getElementById(id);
    const root=$('gameFrame'),main=$('main'),stage=$('stage'),battle=$('battle');
    const game=window.NUMBER_MATCH_I9,core=window.WeightPlayScreenFrame,playUI=window.WeightPlayPlayUI;
    if (!root || root.dataset.wpFrame || !core || !playUI || !game) return;
    const mh=main.querySelector('header'),content=main.querySelector('.hero'),copy=content.querySelector('div');
    main.classList.remove('main-screen');content.className='number-main-content';
    content.querySelector('img').dataset.wpFramePoster='';copy.dataset.wpFrameCopy='';
    copy.querySelector('.main-summary').dataset.wpFrameSummary='';
    copy.querySelector('h1').hidden=true;copy.querySelector('.eyebrow').hidden=true;
    const title=mh.querySelector('strong');title.dataset.wpFrameTitle='';
    title.dataset.wpGameTitle='';title.textContent=copy.querySelector('h1').textContent;title.removeAttribute('data-t');
    mh.querySelector('label').hidden=true;
    const sh=stage.querySelector('header');sh.querySelector('div').hidden=true;
    sh.querySelector('h2').dataset.wpFrameTitle='';
    const sc=document.createElement('section');sc.className='number-stage-content wp-frame-play-content';sc.dataset.wpFramePlayFill='';sc.append($('stageGrid'));
    const progress=$('progress');progress.dataset.wpFrameProgress='';
    const nav=stage.querySelector('.stage-tabs');nav.dataset.wpFrameNav='';stage.append(nav);
    sh.querySelector('div').hidden=true;sh.querySelector('h2').dataset.wpFrameTitle='';
    progress.remove();
    stage.dataset.wpFramePlayFill='';
    stage.removeAttribute('data-wp-standard-stage-screen');
    stage.removeAttribute('data-wp-logical-stage-canvas');
    stage.removeAttribute('data-wp-canvas-max-width');
    stage.removeAttribute('data-wp-stage-landscape-width');
    stage.removeAttribute('data-wp-stage-landscape-height');
    stage.style.removeProperty('--wp-stage-art');
    stage.replaceChildren(sh,sc,nav);
    const stageAction=nav.querySelector('button');
    nav.replaceChildren(stageAction);
    stageAction.dataset.wpFrameAction='tab';
    stageAction.setAttribute('aria-pressed','true');
    stageAction.setAttribute('aria-current','page');
    const bh=battle.querySelector('header'),bc=battle.querySelector('.battle-content');
    const info=document.createElement('div');info.dataset.wpFrameInfo='';
    const level=document.createElement('div');
    for(const [id,tag] of [['chapter','span'],['stageName','strong']]) {
      const old=$(id),node=document.createElement(tag);node.id=id;node.textContent=old.textContent;old.replaceWith(node);level.append(node);
    }
    const pairs=document.createElement('div');pairs.append($('pairsLeft'));info.append(level,pairs);bc.prepend(info);
    bh.querySelector('div').hidden=true;bh.querySelector('div').dataset.wpFrameTitle='';
    for(const id of ['start','next','tutorialStart','continueBattle']) $(id).dataset.wpFrameAction='primary';
    for(const id of ['tutorialOpen','undo','hint','shuffle','restart','resultStages','retry','leaveBattle']) $(id).dataset.wpFrameAction='secondary';
    const frame=core.mount({root,localeSelect:$('locale'),playUI:true,scenes:{
      main:{root:main,header:mh,content},stage:{root:stage,header:sh,content:sc},
      battle:{root:battle,header:bh,content:bc,headerInfo:info}
    }});
    const stageInfo=core.createGroup();stageInfo.add(progress);frame.stageTopUI.add(stageInfo);
    const battleInfo=core.createGroup();battleInfo.add(level).add(pairs);info.replaceChildren();frame.battleTopUI.add(battleInfo);
    frame.commonDownButton.add(stageAction);
    const selector=playUI.mountStage({
      page:sc,rail:$('stageGrid'),config:game.stageConfig,selected:game.selected(),
      onSelect:game.select,onStart:game.start,isActive:()=>frame.active==='stage'
    });
    game.attach(selector);
    const abort=new AbortController();
    const sync=()=>{
      const code=({'zh-Hant':'zh-tw','zh-Hans':'zh-cn','pt-BR':'pt-br'}[document.documentElement.lang]||document.documentElement.lang||'en');
      const strings=window.NUMBER_GUIDE_LOCALES?.[code];
      if(strings) for(const node of document.querySelectorAll('#gameGuide [data-i18n]')) node.textContent=strings[node.dataset.i18n];
      const scene=document.body.dataset.screen||'main';
      $('gameGuide').hidden=scene!=='main';
      frame.activate(scene,{covered:scene==='battle'&&['result','leaveDialog','tutorialPanel'].some(id=>$(id).open)});
    };
    window.addEventListener('weightplay:shell-sync',sync,{signal:abort.signal});
    window.addEventListener('wonder:locale-change',sync,{signal:abort.signal});
    for(const id of ['result','leaveDialog','tutorialPanel']) for(const event of ['toggle','close']) $(id).addEventListener(event,sync,{signal:abort.signal});
    window.addEventListener('pagehide',event=>{if(!event.persisted){abort.abort();selector.destroy();frame.destroy();}},{signal:abort.signal});
    sync();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
