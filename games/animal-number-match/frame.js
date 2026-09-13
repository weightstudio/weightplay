/* Game-owned content binding. Shared frame owns navigation and preferences. */
(() => {
  'use strict';
  const install = () => {
    const $ = id => document.getElementById(id);
    const root=$('gameFrame'),main=$('main'),stage=$('stage'),battle=$('battle');
    if (!root || root.dataset.wpFrame || !window.WeightPlayScreenFrame) return;
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
    const sc=document.createElement('section');sc.className='number-stage-content';sc.append($('progress'),$('stageGrid'));stage.append(sc);
    const nav=stage.querySelector('.stage-tabs');nav.dataset.wpFrameNav='';stage.append(nav);
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
    const frame=WeightPlayScreenFrame.mount({root,localeSelect:$('locale'),scenes:{
      main:{root:main,header:mh,content},stage:{root:stage,header:sh,content:sc},
      battle:{root:battle,header:bh,content:bc,headerInfo:info}
    }});
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
    window.addEventListener('pagehide',event=>{if(!event.persisted){abort.abort();frame.destroy();}},{signal:abort.signal});
    sync();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
