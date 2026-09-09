import {mountCampaignBoard} from './campaign-board.mjs';
import {createCampaignResultView} from './campaign-result-view.mjs';
import {campaignCopy,campaignFaceLabel} from './campaign-copy.mjs';
import {mahjongStageName} from './campaign-names.mjs';
import {renderCampaignRuleCues} from './campaign-rule-cues.mjs';
import {campaignPairProgress} from './campaign-progress-copy.mjs';

export function createCampaignBattleView({session,locale,onStages,sound}) {
 const root=document.createElement('section');root.className='mjc-battle';root.dataset.screen='battle';root.hidden=true;
 root.innerHTML='<div class="mjc-battle-canvas"><div class="mjc-battle-logical"><div class="mjc-battle-live"><header><button type="button" class="mjc-back" data-wp-return="battle">←</button><div><h2></h2><p></p></div></header><div class="mjc-battle-board"></div><div class="mjc-battle-feedback" role="status"></div><div class="mjc-battle-actions"><button type="button" data-action="hint"></button><button type="button" data-action="undo"></button></div></div><dialog class="mjc-leave"><h2></h2><p></p><button type="button" data-continue></button><button type="button" data-leave></button></dialog></div></div><div class="mjc-battle-reserve" aria-hidden="true"></div>';
 const canvas=root.querySelector('.mjc-battle-canvas'),logical=root.querySelector('.mjc-battle-logical'),live=root.querySelector('.mjc-battle-live'),host=root.querySelector('.mjc-battle-board'),dialog=root.querySelector('dialog'),back=root.querySelector('.mjc-back');
 const feedback=root.querySelector('.mjc-battle-feedback');feedback.removeAttribute('role');
 const message=document.createElement('div'),cues=document.createElement('div');message.className='mjc-feedback-message';message.setAttribute('role','status');cues.className='mjc-rule-cues';feedback.append(message,cues);
 canvas.classList.add('battle-canvas');canvas.dataset.wpBattleReturnOnly='';
 root.querySelector('.mjc-battle-reserve').dataset.wpAdReserve='';
 const progress=document.createElement('span');progress.className='mjc-pair-progress';
 const progressText=document.createElement('span'),progressMeter=document.createElement('progress');
 progress.append(progressText,progressMeter);live.querySelector('header').append(progress);
 const lifetime=new AbortController();let boardView,disposed=false,lastStage=null;
 const focusBoard=()=>host.querySelector('.mjc-tile[tabindex="0"]')?.focus({preventScroll:true});
 const leave=()=>{dialog.close();live.inert=false;boardView?.clearEffects();session.stages();root.hidden=true;onStages();};
 const result=createCampaignResultView({locale,stages:leave,next:()=>{session.next();render()},replay:()=>{session.replay();render();focusBoard()}});logical.append(result.root);
 function fit(){
  if(disposed||root.hidden)return;
  const width=Math.min(920,document.documentElement.clientWidth),height=Math.max(1,(window.visualViewport?.height||innerHeight)-56);
  const wide=width>=680&&width>height*1.3,scale=Math.min(width/(wide?740:390),height/(wide?334:620));
  canvas.dataset.composition=wide?'wide':'portrait';canvas.style.height=height+'px';canvas.style.setProperty('--wp-battle-canvas-scale',String(scale));
  logical.style.width=width/scale+'px';logical.style.height=height/scale+'px';logical.style.transform=`scale(${scale})`;
 }
 function render(){
  if(disposed)throw new Error('Battle view disposed');
  const s=session.snapshot(),c=campaignCopy(locale());root.hidden=s.screen!=='battle';if(root.hidden){lastStage=null;boardView?.clearEffects();return;}
  const enteringStage=lastStage!==s.stage;lastStage=s.stage;
  root.dir=locale()==='ar'?'rtl':'ltr';fit();
  if(!boardView)boardView=mountCampaignBoard(host,s.board,{onTile:id=>{if(dialog.open||session.snapshot().outcome==='complete')return;const before=session.snapshot(),after=session.select(id);if(after.board!==before.board)sound?.play?.(after.outcome==='complete'?'win':'pair');else if(after.selected!==before.selected)sound?.play?.('select');render()},faceLabel:f=>campaignFaceLabel(locale(),f),blockLabel:r=>campaignCopy(locale())[r]||campaignCopy(locale()).rule,orderLabel:(i,next)=>`${campaignCopy(locale()).order} ${i}${next?' · '+campaignCopy(locale()).available:''}`});
  boardView.setState(s.board,{selected:s.selected,hint:s.hint});
  live.hidden=s.outcome==='complete';live.inert=live.hidden||dialog.open;if(live.hidden)boardView.clearEffects();result.render(s);
  live.querySelector('h2').textContent=`${c.stage} ${s.stage} / 30`;
  live.querySelector('header p').textContent=mahjongStageName(locale(),s.stage);back.setAttribute('aria-label',c.back);
  const pairs=campaignPairProgress(s.board,locale());progressText.textContent=pairs.text;
  progressMeter.max=pairs.total;progressMeter.value=pairs.total-pairs.left;progressMeter.setAttribute('aria-label',pairs.text);
  message.textContent=c[s.message]||c.rule;renderCampaignRuleCues(cues,s.board,locale());
  const hint=root.querySelector('[data-action=hint]'),undo=root.querySelector('[data-action=undo]');hint.textContent=c.hint;undo.textContent=c.undo;undo.disabled=!s.canUndo;
  dialog.querySelector('h2').textContent=c.leaveTitle;dialog.querySelector('p').textContent=`${c.stage} ${s.stage}: ${c.leaveConsequence}${s.persistent?'':' '+c.storage}`;
  dialog.querySelector('[data-continue]').textContent=c.continuePlaying;dialog.querySelector('[data-leave]').textContent=c.stages;
  if(enteringStage&&!live.hidden)focusBoard();
 }
 back.addEventListener('click',()=>{const s=session.snapshot();if(!s.board.history.length&&!s.hints&&!s.undos){leave();return;}boardView.clearEffects();live.inert=true;dialog.showModal();dialog.querySelector('[data-continue]').focus();},{signal:lifetime.signal});
 const resume=()=>{dialog.close();live.inert=false;back.focus();};
 dialog.querySelector('[data-continue]').addEventListener('click',resume,{signal:lifetime.signal});dialog.querySelector('[data-leave]').addEventListener('click',leave,{signal:lifetime.signal});
 dialog.addEventListener('cancel',e=>{e.preventDefault();resume()},{signal:lifetime.signal});
 for(const [action,method] of [['hint','requestHint'],['undo','undo']])root.querySelector(`[data-action=${action}]`).addEventListener('click',()=>{session[method]();render()},{signal:lifetime.signal});
 function dispose(){if(disposed)return;disposed=true;lifetime.abort();dialog.close();boardView?.dispose();result.dispose();root.remove();}
 window.addEventListener('resize',fit,{signal:lifetime.signal});window.visualViewport?.addEventListener('resize',fit,{signal:lifetime.signal});
 window.addEventListener('pagehide',event=>{if(!event.persisted)dispose()},{signal:lifetime.signal});
 window.addEventListener('pageshow',event=>{if(event.persisted)fit()},{signal:lifetime.signal});
 return {root,render,dispose};
}
