/* Content bindings only; common frame remains the sole control owner. */
(() => {
 'use strict';
 const install=()=>{
  const $=id=>document.getElementById(id),root=$('gameFrame');
  if(!root||root.dataset.wpFrame||!window.WeightPlayScreenFrame)return;
  const main=$('main'),stage=$('stage'),battle=$('battle');
  const mh=main.querySelector('header'),content=main.querySelector('.hero'),copy=content.querySelector('.hero-copy');
  main.classList.remove('main-screen','wp-standard-main-screen');content.className='prism-main-content';
  content.querySelector('img').dataset.wpFramePoster='';copy.dataset.wpFrameCopy='';
  copy.querySelector('.main-summary').dataset.wpFrameSummary='';
  copy.querySelector('h1').hidden=true;copy.querySelector('.eyebrow').hidden=true;
  const title=mh.querySelector('strong');title.dataset.wpFrameTitle='';title.dataset.wpGameTitle='';
  mh.querySelector('label').hidden=true;
  const sh=stage.querySelector('header'),sc=stage.querySelector('.stage-workspace');
  sh.querySelector('h2').dataset.wpFrameTitle='';stage.querySelector('.stage-tabs').dataset.wpFrameNav='';
  const bh=battle.querySelector('header'),bc=battle.querySelector('.battle-content'),hud=bc.querySelector('.hud');
  const boardSlot=document.createElement('div');boardSlot.className='prism-board-slot';
  $('grid').before(boardSlot);boardSlot.append($('grid'));
  hud.dataset.wpFrameInfo='';
  for(const node of [...hud.children]){
   const field=document.createElement('div'),label=document.createElement('span');
   label.dataset.t={moves:'hudMoves',linkStatus:'hudPairs',fillStatus:'hudFilled'}[node.id];
   const value=document.createElement('strong');value.id=node.id;
   node.replaceWith(field);field.append(label,value);
  }
  bh.querySelector('div').dataset.wpFrameTitle='';bh.querySelector('div').hidden=true;
  for(const id of ['start','next','leaveContinue'])$(id).dataset.wpFrameAction='primary';
  for(const id of ['undo','hint','reset','resultStages','retry','leaveStages'])$(id).dataset.wpFrameAction='secondary';
  const frame=WeightPlayScreenFrame.mount({root,localeSelect:$('locale'),scenes:{
   main:{root:main,header:mh,content},stage:{root:stage,header:sh,content:sc},battle:{root:battle,header:bh,content:bc,headerInfo:hud}
  }});
  const abort=new AbortController();
  const sync=()=>{
   const scene=document.body.dataset.screen||'main';
   frame.activate(scene,{covered:scene==='battle'&&(!$('result').hidden||!$('leavePanel').hidden)});
  };
  window.addEventListener('weightplay:shell-sync',sync,{signal:abort.signal});
  window.addEventListener('weightplay:prism-covered',sync,{signal:abort.signal});
  window.addEventListener('pagehide',event=>{if(!event.persisted){abort.abort();frame.destroy();}},{signal:abort.signal});
  sync();
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
