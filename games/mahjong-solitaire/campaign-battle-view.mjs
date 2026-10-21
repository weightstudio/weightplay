import {mountCampaignBoard} from './campaign-board.mjs';
import {createCampaignResultView} from './campaign-result-view.mjs?v=20261021-mahjong-v16-i9';
import {campaignCopy,campaignFaceLabel} from './campaign-copy.mjs';
import {mahjongStageName} from './campaign-names.mjs';
import {renderCampaignRuleCues} from './campaign-rule-cues.mjs';
import {campaignPairProgress} from './campaign-progress-copy.mjs';

export function createCampaignBattleView({session,locale,onStages,sound}) {
 const root=document.createElement('section');root.className='mjc-battle';root.dataset.screen='battle';root.dataset.wpBattleCanvasRoot='';root.dataset.wpLogicalBattleCanvas='responsive';
 root.dataset.wpCanvasMaxWidth='920';root.dataset.wpBattleMinWidth='390';root.dataset.wpBattleMinHeight='620';root.dataset.wpBattleLandscapeWidth='760';root.dataset.wpBattleLandscapeHeight='334';root.hidden=true;
 root.innerHTML='<header><button type="button" class="mjc-back" data-wp-return="battle">←</button><h2 data-wp-frame-title hidden></h2></header><div class="mjc-battle-content"><div class="mjc-battle-info" data-wp-frame-info><div class="mjc-battle-heading"><h2></h2><p></p></div><div class="mjc-pair-progress"><span></span><progress></progress></div></div><div class="mjc-battle-live"><div class="mjc-battle-board"></div><div class="mjc-battle-feedback"><div class="mjc-feedback-message" role="status"></div><div class="mjc-rule-cues"></div></div><div class="mjc-battle-actions"><button type="button" data-action="hint"></button><button type="button" data-action="undo"></button></div></div><dialog class="mjc-leave"><h2></h2><p></p><button type="button" data-continue></button><button type="button" data-leave></button></dialog></div>';
 const header=root.querySelector('header'),content=root.querySelector('.mjc-battle-content'),headerInfo=root.querySelector('.mjc-battle-info'),live=root.querySelector('.mjc-battle-live'),host=root.querySelector('.mjc-battle-board'),dialog=root.querySelector('dialog'),back=root.querySelector('.mjc-back');
 const feedback=root.querySelector('.mjc-battle-feedback'),message=feedback.querySelector('.mjc-feedback-message'),cues=feedback.querySelector('.mjc-rule-cues');
 const progressText=headerInfo.querySelector('.mjc-pair-progress>span'),progressMeter=headerInfo.querySelector('progress');
 const lifetime=new AbortController();let boardView,disposed=false,lastStage=null;
 const focusBoard=()=>host.querySelector('.mjc-tile[tabindex="0"]')?.focus({preventScroll:true});
 const leave=()=>{dialog.close();live.inert=false;boardView?.clearEffects();session.stages();onStages();};
 const result=createCampaignResultView({locale,stages:leave,next:()=>{session.next();render()},replay:()=>{session.replay();render();focusBoard()}});content.append(result.root);
 function render(){
  if(disposed)throw new Error('Battle view disposed');
  const s=session.snapshot(),c=campaignCopy(locale());root.hidden=s.screen!=='battle';
  if(root.hidden){lastStage=null;boardView?.clearEffects();return;}
  const enteringStage=lastStage!==s.stage;lastStage=s.stage;
  root.dir=locale()==='ar'?'rtl':'ltr';
  if(!boardView)boardView=mountCampaignBoard(host,s.board,{onTile:id=>{if(dialog.open||session.snapshot().outcome==='complete')return;const before=session.snapshot(),after=session.select(id);if(after.board!==before.board)sound?.play?.(after.outcome==='complete'?'win':'pair');else if(after.selected!==before.selected)sound?.play?.('select');render()},faceLabel:f=>campaignFaceLabel(locale(),f),blockLabel:r=>campaignCopy(locale())[r]||campaignCopy(locale()).rule,orderLabel:(i,next)=>`${campaignCopy(locale()).order} ${i}${next?' · '+campaignCopy(locale()).available:''}`});
  boardView.setState(s.board,{selected:s.selected,hint:s.hint});
  live.hidden=s.outcome==='complete';live.inert=live.hidden||dialog.open;if(live.hidden)boardView.clearEffects();result.render(s);
  headerInfo.querySelector('.mjc-battle-heading h2').textContent=`${c.stage} ${s.stage} / 30`;
  headerInfo.querySelector('.mjc-battle-heading p').textContent=mahjongStageName(locale(),s.stage);back.setAttribute('aria-label',c.back);
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
 window.addEventListener('pagehide',event=>{if(!event.persisted)dispose()},{signal:lifetime.signal});
 return {root,header,content,headerInfo,render,dispose};
}
