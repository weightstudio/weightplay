/* Presentation only: original engine retains every letter, word and score callback. */
(() => {
 'use strict';
 const root=document.getElementById('popularArcade'),main=document.getElementById('mainScreen'),battle=document.getElementById('battleScreen'),result=document.getElementById('resultScreen');
 const header=root.querySelector('.arcade-header'),top=battle.querySelector('.battle-top'),content=main.querySelector('.main-panel'),play=battle.querySelector('.battle-panel'),select=document.getElementById('localeSelect');
 const title=document.getElementById('gameTitle'),back=top.querySelector('[data-wp-return="battle"]'),mainBack=header.querySelector('[data-wp-return="main"]');
 if(!window.WeightPlayScreenFrame||!back||!mainBack)throw Error('HANGMAN_SHARED_FRAME_REQUIRED');
 const parking=document.createElement('div');parking.hidden=true;
 title.dataset.wpFrameTitle='';header.append(title);
 parking.append(...[...header.children].filter(node=>node!==title&&node!==mainBack));main.append(parking);main.prepend(header);
 content.className='hangman-main-content';content.querySelector('.preview-art').dataset.wpFramePoster='';content.querySelector('.main-copy').dataset.wpFrameCopy='';document.getElementById('objective').dataset.wpFrameSummary='';document.getElementById('startBtn').dataset.wpFrameAction='primary';
 const segment=location.pathname.split('/').filter(Boolean)[0];mainBack.href=`/${/^(en|zh-tw|zh-cn|ja|ko|es|pt-br|fr|de|it|ru|hi|ar)$/.test(segment)?segment:'en'}/`;
 const actions=top.querySelector('.control-row');actions.className='hangman-native-actions';for(const button of actions.querySelectorAll('button'))button.dataset.wpFrameAction='secondary';play.append(actions);
 const info=document.createElement('div'),stat=document.createElement('div');stat.append(document.getElementById('roundLabel'));info.append(stat);play.append(info);
 top.querySelector('[data-wp-battle-utility]')?.remove();
 const battleTitle=document.createElement('strong');battleTitle.dataset.wpFrameTitle='';top.append(battleTitle);
 // Retire legacy layout-only wrappers once, before the permanent frame mounts.
 for(const screen of[battle,result]){
  const wrapper=screen.querySelector(':scope > .battle-canvas');if(wrapper){while(wrapper.firstChild)screen.insertBefore(wrapper.firstChild,wrapper);wrapper.remove();}
  if(!window.WeightPlayLayout?.reserveHeight)screen.querySelectorAll('.battle-ad-reserve').forEach(node=>node.remove());
 }
 battle.prepend(top);battle.append(result);battle.dataset.wpBattleCanvasRoot='';battle.dataset.wpFramePlayFill='';battle.dataset.wpFrameLogicalHeader='battle';
 battle.dataset.wpBattleLandscapeWidth='760';battle.dataset.wpBattleLandscapeHeight='334';
 result.dataset.wpBattleSubstate='result';result.setAttribute('role','dialog');result.setAttribute('aria-modal','true');result.setAttribute('aria-labelledby','resultTitle');
 for(const button of result.querySelectorAll('.result-actions button'))button.dataset.wpFrameAction=button.id==='retryBtn'?'primary':'secondary';
 const frame=WeightPlayScreenFrame.mount({root,localeSelect:select,scenes:{main:{root:main,header,content},battle:{root:battle,header:top,content:play,headerInfo:info}}});
 const leave=document.createElement('section');leave.id='hangmanLeave';leave.hidden=true;leave.dataset.wpBattleSubstate='leave-confirmation';leave.setAttribute('role','dialog');leave.setAttribute('aria-modal','true');leave.setAttribute('aria-labelledby','hangmanLeaveTitle');leave.setAttribute('aria-describedby','hangmanLeaveText');
 leave.innerHTML='<h2 id="hangmanLeaveTitle"></h2><div class="hangman-leave-copy"><p id="hangmanLeaveText"></p></div><div class="hangman-leave-actions"><button id="hangmanContinue" type="button" data-wp-frame-action="primary"></button><button id="hangmanLeaveMain" type="button" data-wp-frame-action="secondary"></button></div>';battle.append(leave);
 const continueButton=document.getElementById('hangmanContinue'),leaveButton=document.getElementById('hangmanLeaveMain'),retry=document.getElementById('retryBtn');
 let leaving=false,allowBack=false,previous=null,generation=0,owner=null,suspended=false,unfocused=false,obtained=false,hintUsed=false;
 result.firstElementChild.dataset.wpResultCard='';
 const translate=()=>{document.getElementById('hangmanLeaveTitle').textContent=WeightPlayHangmanInterfaceText('title');document.getElementById('hangmanLeaveText').textContent=WeightPlayHangmanInterfaceText('consequence');continueButton.textContent=WeightPlayHangmanInterfaceText('continue');leaveButton.textContent=WeightPlayHangmanInterfaceText('main');};translate();
 const sync=()=>{
  const phase=document.body.dataset.screen,scene=phase==='main'?'main':'battle',settled=phase==='result',settings=[...root.querySelectorAll('.wp-frame-popover')].some(node=>!node.hidden);
  if(scene==='main')leaving=false;
  if(scene==='main'||(phase==='battle'&&(previous==='main'||previous==='result'))){obtained=false;hintUsed=false;}
  const token=`${phase}:${leaving}:${settings}:${suspended}:${unfocused}:${document.hidden}`;if(token!==owner){generation++;owner=token;}
  battle.hidden=scene!=='battle';play.hidden=settled;play.inert=settled||leaving||settings||suspended||unfocused||document.hidden;
  leave.hidden=!leaving;document.body.toggleAttribute('data-wp-result-active',settled);battle.dataset.wpBattleSubstate=leaving?'leave-confirmation':settled?'result':'live';
  frame.activate(scene,{covered:settled||leaving});
  for(const guide of document.querySelectorAll('.game-page-info')){guide.hidden=scene!=='main';guide.inert=scene!=='main';guide.setAttribute('aria-hidden',String(scene!=='main'));}
  WeightPlayBattleCanvas?.sync();
  if(settled)window.ShowResultGet('hangman',obtained);
  if(phase!==previous){
   if(settled)retry.focus({preventScroll:true});
   if(scene==='main'&&previous)document.getElementById('startBtn').focus({preventScroll:true});
   if(phase==='battle'&&(previous==='main'||previous==='result')){const pending=generation;queueMicrotask(()=>{if(pending===generation&&!play.inert&&document.body.dataset.screen==='battle')document.querySelector('#controls .letter:not([aria-pressed="true"])')?.focus({preventScroll:true});});}
  }
  previous=phase;
 };
 const resume=()=>{leaving=false;sync();back.focus({preventScroll:true});};
 // The existing Hint spends a move even before the first letter is chosen.
 document.getElementById('hintBtn').addEventListener('click',()=>{if(document.body.dataset.screen==='battle')hintUsed=true;});
 document.getElementById('restartBtn').addEventListener('click',()=>{hintUsed=false;});
 back.addEventListener('click',event=>{
  if(allowBack||document.body.dataset.screen!=='battle')return;
  const dirty=hintUsed||!!play.querySelector('.letter[aria-pressed="true"]');if(!dirty)return;
  event.preventDefault();event.stopImmediatePropagation();leaving=true;translate();frame.close();sync();continueButton.focus({preventScroll:true});
 },true);
 continueButton.addEventListener('click',resume);leaveButton.addEventListener('click',()=>{if(!leaving)return;leaving=false;allowBack=true;try{back.click();}finally{allowBack=false;}});
 document.addEventListener('keydown',event=>{
  if(leaving&&event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();resume();return;}
  const dialog=leaving?leave:document.body.dataset.screen==='result'?result:null;if(!dialog||event.key!=='Tab')return;
  const buttons=[...dialog.querySelectorAll('button')].filter(node=>!node.disabled&&!node.hidden),first=buttons[0],last=buttons.at(-1);
  if(event.shiftKey&&(document.activeElement===first||!dialog.contains(document.activeElement))){event.preventDefault();last.focus();}else if(!event.shiftKey&&(document.activeElement===last||!dialog.contains(document.activeElement))){event.preventDefault();first.focus();}
 },true);
 // Observe the existing committed reward. Never create or alter the transaction.
 window.addEventListener('weightplay:castle-reward',event=>{
  if(event.detail?.gameId!=='hangman'||!['battle','result'].includes(document.body.dataset.screen))return;
  const completion=String(event.detail.completionId||'');
  if(!completion||!window.WeightPlayCastle?.read?.().completions?.[`hangman:${completion}`])return;
  obtained=true;const pending=generation;
  queueMicrotask(()=>{
   if(pending!==generation||document.body.dataset.screen!=='result')return;
   window.ShowResultGet('hangman',true);
   window.WeightPlayCastle.dismissRewardNotice('hangman');
  });
 });
 // Main language choice uses the platform's canonical authored locale route.
 // Capture before the legacy native listener selects its in-place locale.
 select.addEventListener('change',()=>{
  if(document.body.dataset.screen==='main')window.WonderI18n?.setLocale?.(select.value,{navigate:true});
 },true);
 window.addEventListener('weightplay:shell-sync',sync);window.addEventListener('weightplay:interaction-state',sync);select.addEventListener('change',translate);
 window.addEventListener('blur',()=>{unfocused=true;sync();});window.addEventListener('focus',()=>{unfocused=false;sync();});document.addEventListener('visibilitychange',sync);
 window.addEventListener('pagehide',()=>{suspended=true;generation++;frame.close();sync();});window.addEventListener('pageshow',()=>{suspended=false;sync();});
 sync();
})();
