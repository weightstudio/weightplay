import {ChessSession} from './full-rules.mjs';
import {ChessAI} from './ai-client.mjs';
import {ChessBoard3D} from './board-3d.mjs?v=20260909-knight-v17';
import {chessLocales} from './full-locales.mjs';
import {boardLocales,squareDescription} from './board-locales.mjs';
import {challenges,challengePassed,challengeOutcome,loadChallengeProgress,unlockChallenge,recordChallengeClear} from './challenges.mjs';
import {challengeLocales} from './challenge-locales.mjs';
import {campaignLocales} from './campaign-locales.mjs';
import {tacticsLocales} from './tactics-locales.mjs';
import {stagePreviews,clearStagePreviews,stagePreviewStats} from './stage-previews.mjs?v=20260909-knight-v17';
import {renderRulesReference} from './rules-reference.mjs';
import {mainLocales} from './main-locales.mjs';
import {resultLocales} from './result-locales.mjs';
import {leaveLocales} from './leave-locales.mjs';
import {stageLocales} from './stage-locales.mjs';
import {entryLocale,lobbyHref} from './locale-entry.mjs';
const $=id=>document.getElementById(id),saveKey='weightplay_chess_complete_v1';
let savedLocale;try{savedLocale=localStorage.getItem('weightPlayLocale');}catch{}
let locale=entryLocale(location.href,savedLocale,document.documentElement.lang);
let session=new ChessSession(),view=null,selected=null,active=false,busy=false,focused='e2',epoch=0,promotion=null,currentChallenge=null,progress,outcomeKey=null;
try{progress=loadChallengeProgress(localStorage);}catch{progress={cleared:[]};}const ai=new ChessAI();
const text=key=>key==='title'?(window.WEIGHTPLAY_GAME_TITLES?.chess?.[locale]??chessLocales[locale].title):chessLocales[locale][key]??challengeLocales[locale][key]??campaignLocales[locale][key]??tacticsLocales[locale][key];
const challengeButton=$('challenges');
const nextButton=$('nextChallenge');
let stageRail=null,stagePreviewMap=null;
// Keep the physical advertisement boundary outside the uniformly scaled play
// surface. Result remains a substate of this same mounted Canvas.
const battleCanvas=document.createElement('div');battleCanvas.id='battleCanvas';
battleCanvas.dataset.wpLogicalBattleCanvas='';battleCanvas.dataset.wpBattleReturnOnly='';
const battleReserve=$('battle').querySelector('.reserve');battleReserve.dataset.wpAdReserve='';
for(const node of [...$('battle').children])if(node!==battleReserve)battleCanvas.append(node);
$('battle').insertBefore(battleCanvas,battleReserve);
$('hint').dataset.wpPrimaryAction='';
function fitBattle(){
 if($('battle').hidden)return;
 const vv=window.visualViewport,css=getComputedStyle($('battle'));
 const inset=edge=>parseFloat(css.getPropertyValue(`--safe-${edge}`))||0;
 const safeWidth=Math.max(1,(vv?.width||innerWidth)-inset('left')-inset('right'));
 const width=Math.min(920,safeWidth),height=Math.max(57,(vv?.height||innerHeight)-inset('top')-inset('bottom'));
 const scale=Math.min(width/390,Math.max(1,height-56)/480);
 Object.assign($('battle').style,{width:`${width}px`,height:`${height}px`,left:`${(vv?.offsetLeft||0)+inset('left')+(safeWidth-width)/2}px`,top:`${(vv?.offsetTop||0)+inset('top')}px`});
 Object.assign(battleCanvas.style,{width:`${width/scale}px`,height:`${Math.max(1,height-56)/scale}px`,transform:`scale(${scale})`});
 battleCanvas.style.setProperty('--wp-battle-canvas-scale',String(scale));
}
function showScene(name){
 const result=name==='result',scene=result?'battle':name;
 for(const [type,id] of Object.entries({main:'mainScene',stage:'stages',battle:'battle'})){
  const root=$(id);root.hidden=type!==scene;root.inert=type!==scene;
 }
 for(const node of [$('arena'),$('controls'),$('saved'),$('battle').querySelector('.topbar')]){node.hidden=result;node.inert=result;}
 $('result').hidden=!result;$('result').inert=!result;$('battle').classList.toggle('is-result',result);
 if(!result){$('resultBoard').removeAttribute('src');$('resultBoard').hidden=true;}
 $('main').hidden=scene!=='main';document.body.dataset.screen=scene;
 if(scene==='battle')fitBattle();
 window.dispatchEvent(new CustomEvent('weightplay:shell-sync'));
}
const sound=name=>{if(!document.hidden)window.WonderSound?.play(name);};
function saved(){try{const data=localStorage.getItem(saveKey);return data?ChessSession.restore(JSON.parse(data)):null;}catch{return null;}}
function updateMain(){const copy=mainLocales[locale];challengeButton.textContent=copy.start;$('intro').textContent=copy.intro;$('exit').setAttribute('aria-label',copy.back);const count=document.createElement('bdi');count.dir='ltr';count.textContent=`${progress.cleared.length} / ${challenges.length}`;$('campaignProgress').replaceChildren(document.createTextNode(copy.progress+' · '),count);}
function persist(){if(currentChallenge){$('saved').textContent='';return;}try{localStorage.setItem(saveKey,JSON.stringify(session.serialize()));$('saved').textContent=text('saved');}catch{$('saved').textContent='';}}
function localize(){
 for(const button of $('promoteChoices').children)button.textContent=text({q:'queen',r:'rook',b:'bishop',n:'knight'}[button.dataset.piece]);
 if($('saved').textContent)$('saved').textContent=text('saved');
 $('locale').setAttribute('aria-label',boardLocales[locale].language);
 document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';
 $('exit').href=lobbyHref(locale,location.href);
 for(const id of ['title','stageTitle'])$(id).dataset.runtimeLocalize='off';
 for(const [id,key] of Object.entries({title:'title',start:'start',resume:'resume',intro:'intro',guideTitle:'guide',undo:'undo',restart:'restart',hint:'hint',again:'start',resultBack:'back',promoteTitle:'promote',confirmText:'confirm',confirmYes:'start',confirmNo:'cancel',errorText:'unavailable',errorRetry:'retry',errorBack:'back'}))$(id).textContent=text(key);
 // Return artwork is permanent. Localization owns its accessible name only.
 $('back').setAttribute('aria-label',text('back'));$('back').setAttribute('title',text('back'));
 $('arena').setAttribute('aria-label',`${text('title')}. ${text('help')}`);
 document.title=text('title');renderRulesReference($('guide'),locale);updateMain();nextButton.textContent=text('next');
 $('stageTitle').textContent=text('title');$('stageBack').setAttribute('aria-label',text('back'));$('stageList').setAttribute('aria-label',text('select'));
 if(!$('stages').hidden)renderStages();
 if(!$('result').hidden&&outcomeKey){$('outcome').textContent=text(outcomeKey);$('again').textContent=text(currentChallenge?'retry':'start');}
 if(active)render();
}
const languageNames={en:'English','zh-Hant':'繁體中文','zh-Hans':'简体中文',ja:'日本語',ko:'한국어',es:'Español','pt-BR':'Português',fr:'Français',de:'Deutsch',it:'Italiano',ru:'Русский',hi:'हिन्दी',ar:'العربية'};
for(const key of Object.keys(chessLocales)){const o=document.createElement('option');o.value=key;o.textContent=languageNames[key];$('locale').append(o);}$('locale').value=locale;$('locale').onchange=()=>{locale=$('locale').value;try{localStorage.setItem('weightPlayLocale',locale);}catch{}localize();window.dispatchEvent(new CustomEvent('wonder:locale-change'));window.dispatchEvent(new CustomEvent('weightplay:shell-sync'));};
function stop(){epoch++;ai.cancel();busy=false;selected=null;promotion=null;for(const button of $('controls').querySelectorAll('button'))button.disabled=false;if($('promotion').open)$('promotion').close();view?.dispose();view=null;}
function renderStages(){
 const list=$('stageList');
 try{stagePreviewMap=stagePreviews(challenges);list.dataset.previewError='';}catch{stagePreviewMap=null;list.dataset.previewError='PREVIEW_UNAVAILABLE';}
 const bind=(b,index)=>{const c=challenges[index];
  if(!b.children.length){const img=document.createElement('img');img.width=256;img.height=256;img.alt='';img.draggable=false;const number=document.createElement('strong');number.className='stage-number';const label=document.createElement('span');label.className='stage-goal';const badge=document.createElement('small');badge.className='stage-state';b.append(img,number,label,badge);}
  b.className='stage-card';b.querySelector('.stage-number').textContent=String(c.id);
  const image=stagePreviewMap?.get(c.fen),img=b.querySelector('img');img.hidden=!image;if(image&&img.getAttribute('src')!==image)img.src=image;
  b.querySelector('.stage-goal').textContent=text(c.kind);
  const cleared=progress.cleared.includes(c.id),unlocked=unlockChallenge(progress,c.id),state=cleared?'cleared':unlocked?'ready':'locked',copy=stageLocales[locale];
  b.dataset.stage=String(c.id);b.dataset.cleared=String(cleared);b.dataset.state=state;
  b.querySelector('.stage-state').textContent=copy[state];
  b.setAttribute('aria-label',`${copy.stage} ${c.id}. ${copy[state]}. ${text(c.kind)}`);
  b.setAttribute('aria-disabled',String(!unlocked));
 };
 if(!stageRail)stageRail=window.WeightPlayStageV6.install(list,{total:challenges.length,poolSize:9,bind,
  initialIndex:()=>Math.min(challenges.length-1,Math.max(0,...progress.cleared)),
  onChange:(index,{pool})=>{const label=pool.find(card=>Number(card.dataset.stageIndex)===index)?.querySelector('.stage-goal');const clipped=label&&label.scrollHeight>label.clientHeight+1;const description=clipped?text(challenges[index].kind):'';if($('stageDescription').textContent!==description){$('stageDescription').textContent=description;$('stageDescription').scrollTop=0;}$('stageDescription').hidden=!clipped;},
  activate:index=>{if(unlockChallenge(progress,index+1))begin(false,index+1);}});
 else stageRail.refresh();
 $('stageTab').textContent=resultLocales[locale].stages;
 list.dataset.previewCount=String(stagePreviewStats().count);list.dataset.previewBytes=String(stagePreviewStats().encodedBytes);
}
function fitStage(){
 if($('stages').hidden)return;
 const root=$('stages'),canvas=$('stageCanvas'),vv=window.visualViewport,css=getComputedStyle(root);
 const inset=edge=>parseFloat(css.getPropertyValue(`--safe-${edge}`))||0;
 const width=Math.min(920,Math.max(1,(vv?.width||innerWidth)-inset('left')-inset('right')));
 const height=Math.max(57,(vv?.height||innerHeight)-inset('top')-inset('bottom'));
 const scale=Math.min(width/390,(height-56)/480);
 Object.assign(root.style,{width:`${width}px`,height:`${height}px`,left:`${(vv?.offsetLeft||0)+inset('left')+((vv?.width||innerWidth)-inset('left')-inset('right')-width)/2}px`,top:`${(vv?.offsetTop||0)+inset('top')}px`});
 Object.assign(canvas.style,{width:`${width/scale}px`,height:`${(height-56)/scale}px`,transform:`scale(${scale})`});
 canvas.dataset.wpLogicalStageCanvas='';
 canvas.style.setProperty('--wp-stage-canvas-scale',String(scale));
 $('stageReserve').dataset.wpAdReserve='';
 root.dataset.scale=String(scale);stageRail?.center();
}
function stages(){$('resume').hidden=!saved();active=false;stop();showScene('stage');fitStage();renderStages();}
function settleChallenge(move){
 const passed=challengeOutcome(currentChallenge,session.game,move);if(passed===null)return false;
 if(passed){try{progress=recordChallengeClear(localStorage,progress,currentChallenge.id);}catch{progress={cleared:[...new Set([...progress.cleared,currentChallenge.id])]};}}
 finishResult(passed?'cleared':'tryAgain',move);
 return true;
}
function finishResult(key,move=null){
 active=false;busy=true;ai.cancel();const fence=epoch;
 for(const button of $('controls').querySelectorAll('button'))button.disabled=true;
 const finish=()=>{
  if(epoch!==fence)return;
  let image;try{image=view?.snapshot();}catch{image=null;}
  stop();outcomeKey=key;showScene('result');
  if(image){$('resultBoard').src=image;$('resultBoard').hidden=false;}
  updateResult();sound(['cleared','win'].includes(key)?'win':'wrong');$('outcome').focus({preventScroll:true});
 };
 if(view){view.setPosition(session.game.board(),[],session.game.isCheck()?session.turn:null);view.setFocus(null,null);view.animateMove(move,finish);}else finish();
}
function updateResult(){
 const copy=resultLocales[locale],history=session.game.history({verbose:true}),white=history.filter(m=>m.color==='w');
 $('outcome').textContent=text(outcomeKey);$('result').dataset.outcome=outcomeKey;
 const reason={CHECKMATE:'checkmate',STALEMATE:'stalemate',REPETITION:'repetition',INSUFFICIENT_MATERIAL:'material',FIFTY_MOVES:'fifty'}[session.status().reason];
 $('resultReason').textContent=currentChallenge?[`${currentChallenge.id}. ${text(currentChallenge.kind)}`,copy[reason]].filter(Boolean).join(' · '):copy[reason]||'';
 $('resultBoard').alt=copy.position;$('resultStats').replaceChildren();
 for(const [label,value] of [[copy.moves,white.length],[copy.captures,white.filter(m=>m.captured).length],[copy.lastMove,history.at(-1)?.san||'—']]){
  const cell=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=String(value);cell.append(dt,dd);$('resultStats').append(cell);
 }
 $('resultBack').textContent=copy.stages;$('again').textContent=copy.replay;nextButton.textContent=text('next');nextButton.hidden=false;
 nextButton.disabled=!currentChallenge||outcomeKey!=='cleared'||!challenges.some(c=>c.id===currentChallenge.id+1);
}
function main(){updateMain();currentChallenge=null;nextButton.hidden=true;active=false;stop();for(const d of document.querySelectorAll('dialog[open]'))d.close();showScene('main');$('resume').hidden=!saved();}
function fail(reason='RENDERER_UNAVAILABLE'){
 // Freeze the in-memory position, not a possibly older persistent save.
 // Invalidate pending replies/animations before disposing their renderer.
 active=false;epoch++;ai.cancel();busy=false;promotion=null;
 view?.dispose();view=null;
 for(const dialog of document.querySelectorAll('dialog[open]'))if(dialog!==$('error'))dialog.close();
 $('error').dataset.reason=typeof reason==='string'?reason:'RENDERER_UNAVAILABLE';
 if(!$('error').open)$('error').showModal();
}
function recover(){
 $('error').close();epoch++;ai.cancel();busy=false;selected=null;promotion=null;
 // Keep session, challenge, move history and focus. Retry is not Restart.
 active=true;
 try{view=new ChessBoard3D($('arena'),{onSquare:select,onUnavailable:fail});render();if(active){persist();reply();$('arena').focus();}}catch{fail();}
}
function begin(resume=false,challengeId=null){stop();currentChallenge=challenges.find(c=>c.id===challengeId)||null;focused='e2';nextButton.hidden=true;session=resume?saved()||new ChessSession():new ChessSession();if(currentChallenge)session.game.load(currentChallenge.fen);active=true;showScene('battle');try{view=new ChessBoard3D($('arena'),{onSquare:select,onUnavailable:fail});render();persist();reply();}catch{fail();}}
function render(){if(!active)return;const state=session.status();if(state.ended){finishResult(state.winner==='w'?'win':state.winner==='b'?'lose':'draw');return;}
view?.setPosition(session.game.board(),selected?session.moves(selected).map(m=>m.to):[],session.game.isCheck()?session.turn:null);$('status').textContent=currentChallenge?`${currentChallenge.id}. ${text(currentChallenge.kind)}${currentChallenge.computer?' · '+session.game.history({verbose:true}).filter(m=>m.color==='w').length+'/'+currentChallenge.maxMoves+(busy?' · '+text('thinking'):''):''}`:busy?(session.turn==='b'?text('thinking'):text('hint')+'…'):text(state.reason==='CHECK'?'check':'turn');$('hint').disabled=busy||session.turn!=='w';$('undo').disabled=session.game.history().length===0;
 $('arena').dataset.fen=session.fen;$('arena').dataset.turn=session.turn;describeFocus();
}
function finishMatch(move){const state=session.status();if(!state.ended)return false;persist();finishResult(state.winner==='w'?'win':state.winner==='b'?'lose':'draw',move);return true;}
async function reply(){if((currentChallenge&&!currentChallenge.computer)||!active||session.turn!=='b'||session.status().ended)return;busy=true;render();const fence=epoch,fen=session.fen;const answer=await ai.request(fen,{maxDepth:3,timeMs:180,maxNodes:6000});if(fence!==epoch||!active||session.fen!==fen)return;busy=false;if(answer.cancelled)return;if(answer.error||!answer.move){fail(answer.error||'EMPTY_SEARCH_RESULT');return;}const result=session.move(answer.move.from,answer.move.to,answer.move.promotion);if(!result.ok){fail();return;}if(currentChallenge&&settleChallenge(result.move))return;if(!currentChallenge&&finishMatch(result.move))return;persist();render();view?.animateMove(result.move);}
function commit(from,to,piece){const result=session.move(from,to,piece);if(!result.ok)return result;sound(result.move.captured?'hit':'click');selected=null;if(currentChallenge&&settleChallenge(result.move))return result;if(!currentChallenge&&finishMatch(result.move))return result;persist();render();reply();view?.animateMove(result.move);return result;}
function select(square){if(!active||busy||session.turn!=='w'||$('promotion').open)return;focused=square;const piece=session.game.get(square);if(piece?.color==='w'){selected=square;render();return;}if(!selected){describeFocus();return;}const result=commit(selected,square);if(result?.reason==='ILLEGAL_MOVE')describeFocus(boardLocales[locale].invalid);if(result?.reason==='PROMOTION_REQUIRED'){promotion={from:selected,to:square};$('promoteChoices').replaceChildren();for(const type of result.choices){const button=document.createElement('button');button.dataset.piece=type;button.textContent=text({q:'queen',r:'rook',b:'bishop',n:'knight'}[type]);button.onclick=()=>{const move=promotion;promotion=null;$('promotion').close();if(move)commit(move.from,move.to,type);};$('promoteChoices').append(button);}$('promotion').showModal();}}
function describeFocus(message=''){
 const t=boardLocales[locale],parts=[squareDescription(session.game,focused,locale)];
 if(selected)parts.push(t.selected+': '+squareDescription(session.game,selected,locale));
 if(message)parts.push(message);
 $('keyboard').textContent=parts.join(' · ');
 view?.setFocus(focused,selected);$('arena').dataset.focused=focused;
}
$('arena').onkeydown=e=>{if(!active||$('promotion').open)return;const delta={ArrowLeft:-1,ArrowRight:1,ArrowUp:8,ArrowDown:-8}[e.key];if(delta){e.preventDefault();let index=(Number(focused[1])-1)*8+focused.charCodeAt(0)-97;const file=index%8;if((delta===-1&&file===0)||(delta===1&&file===7))return;index=Math.max(0,Math.min(63,index+delta));focused=String.fromCharCode(97+index%8)+(Math.floor(index/8)+1);describeFocus();}else if(e.key==='Enter'||e.key===' '){e.preventDefault();select(focused);}else if(e.key==='Escape'){e.preventDefault();selected=null;render();}};

let confirmationAction=null;
function askConfirmation(action){
 if(!active||$('confirmation').open)return;
 active=false;epoch++;ai.cancel();busy=false;view?.finishAnimation();view?.render();
 confirmationAction=action;
 const copy=leaveLocales[locale];
 $('confirmText').textContent=action==='restart'?text('confirm'):currentChallenge?`${currentChallenge.id}. ${text(currentChallenge.kind)} — ${copy[2]}`:saved()?.fen===session.fen?copy[3]:copy[4];
 $('confirmYes').textContent=action==='restart'?text('restart'):copy[1];
 $('confirmNo').textContent=copy[0];
 $('confirmation').showModal();$('confirmNo').focus();
}
function cancelConfirmation(){
 if(!confirmationAction)return;
 const target=confirmationAction==='leave'?'back':'restart';
 confirmationAction=null;$('confirmation').close();active=true;render();reply();$(target).focus();
}
$('confirmation').addEventListener('keydown',event=>{
 if(event.key!=='Tab')return;
 event.preventDefault();
 (document.activeElement===$('confirmNo')?$('confirmYes'):$('confirmNo')).focus();
});
$('start').onclick=()=>begin();$('resume').onclick=()=>begin(true);$('back').onclick=()=>active?askConfirmation('leave'):stages();$('resultBack').onclick=stages;$('again').onclick=()=>begin(false,currentChallenge?.id);
$('undo').onclick=()=>{epoch++;ai.cancel();busy=false;selected=null;session.undoTurn();persist();render();};
$('restart').onclick=()=>askConfirmation('restart');$('confirmNo').onclick=cancelConfirmation;$('confirmation').addEventListener('cancel',event=>{event.preventDefault();cancelConfirmation();});$('confirmYes').onclick=()=>{const action=confirmationAction;if(!action)return;confirmationAction=null;$('confirmation').close();if(action==='leave')stages();else begin(false,currentChallenge?.id);};
$('hint').onclick=async()=>{
 if(busy||session.turn!=='w')return;
 if(currentChallenge&&!currentChallenge.computer){
  const candidate=session.moves().find(move=>{const copy=new ChessSession(session.game.pgn());const played=copy.game.move(move);return challengePassed(currentChallenge,copy.game,played);});
  if(candidate){selected=candidate.from;focused=selected;}
  render();if(!candidate)$('status').textContent=text('hintUnproven');return;
 }
 const fence=epoch,fen=session.fen;
 const options=currentChallenge?{challenge:{goal:currentChallenge.goal,remaining:currentChallenge.maxMoves-session.game.history({verbose:true}).filter(move=>move.color==='w').length}}:{maxDepth:2,timeMs:120};
 busy=true;render();const answer=await ai.request(fen,options);
 if(epoch!==fence||!active||session.fen!==fen)return;
 busy=false;if(answer.move){selected=answer.move.from;focused=selected;}
 render();if(!answer.move)$('status').textContent=text('hintUnproven');
};
function leaveRecovery(){$('error').close();currentChallenge?stages():main();}
$('errorRetry').onclick=recover;$('errorBack').onclick=leaveRecovery;
$('error').addEventListener('cancel',event=>{event.preventDefault();leaveRecovery();});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&active){epoch++;ai.cancel();busy=false;}else if(!document.hidden&&active){render();reply();}});
window.addEventListener('pagehide',()=>{active=false;stop();stageRail?.destroy();stageRail=null;stagePreviewMap=null;clearStagePreviews();$('stageList').replaceChildren();});window.addEventListener('pageshow',e=>{if(e.persisted)main();});
window.addEventListener('resize',fitStage);window.visualViewport?.addEventListener('resize',fitStage);window.visualViewport?.addEventListener('scroll',fitStage);
window.addEventListener('resize',fitBattle);window.visualViewport?.addEventListener('resize',fitBattle);window.visualViewport?.addEventListener('scroll',fitBattle);
challengeButton.onclick=stages;$('stageBack').onclick=main;nextButton.onclick=()=>begin(false,currentChallenge.id+1);
localize();main();
