import {boards, relationAt, move, solved, solution, normalizeProgress} from './puzzle.mjs';
import {MeadowScene} from './meadow-scene.mjs';
import {locales, translate} from './copy.mjs';
import {ownsAmber, unlockAmber} from './collection.mjs';

window.MAGNET_MEADOW_REBUILD_COPY=locales;

const $ = id => document.getElementById(id);
const locale = locales[document.documentElement.lang] ? document.documentElement.lang : 'en';
const dictionary = window.MAGNET_MEADOW_LOCALES?.[locale] || window.MAGNET_MEADOW_LOCALES.en;
const copy = (key,values={}) => {
  if(key==='arc')return `${values.number} / 6`;
  let text = locales[locale][key] ?? dictionary[key] ?? key;
  for(const [name,value] of Object.entries(values)) text=String(text).replaceAll(`{${name}}`,value);
  return text;
};
const progressKey='weightplay-animal-magnet-meadow-progress-v17';
const legacyKey='weightplay-animal-magnet-meadow-completed-v1';
const readJSON = key => {try{return JSON.parse(localStorage.getItem(key)||'null');}catch{return null;}};
let progress=normalizeProgress(readJSON(progressKey)||{},readJSON(legacyKey)||[]);
if(!ownsAmber(localStorage))progress.theme='moon';
const state={screen:'main',round:0,positions:{},moves:0,selected:'a',history:[],assisted:false,result:false,drag:null};
let scene, stageController, browseIndex=0, layout, purchaseBusy=false, lastFocus=null;
const motion=new Set();
const audio=window.WeightPlayAudio?.createScope();
const cues=['game.start','board.move','board.undo','feedback.error','feedback.hint','puzzle.match','result.win','shop.purchase'];
window.WeightPlayAudio?.preload(cues);
const sound=id=>audio?.play(id);
const board=()=>boards[state.round];
const active=()=>state.screen==='battle'&&!state.result&&!document.querySelector('dialog[open]')&&!document.hidden&&!scene?.lost;
const reduce=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const unlocked=index=>index===0||Array.from({length:index},(_,i)=>i).every(i=>progress.completed.includes(i));
const nextIndex=()=>Math.min(boards.length-1,Array.from({length:boards.length},(_,i)=>i).find(i=>!progress.completed.includes(i))??boards.length-1);
const rewardState=index=>{
  const claims=window.WeightPlayCastle?.read?.().completions;
  return claims ? (claims[`animal-magnet-meadow:stage-animal-magnet-meadow-${index+1}`]?'collected':'not-collected') : 'unknown';
};
const effect=(element,error=false)=>{
  const animation=element.animate(error?[{filter:'brightness(1)'},{filter:'brightness(1.6)'},{filter:'brightness(1)'}]:[{opacity:.35},{opacity:1}],{duration:reduce()?70:error?140:160,easing:'ease-out'});
  motion.add(animation);animation.finished.catch(()=>{}).finally(()=>motion.delete(animation));
};
const settle=()=>{cancelDrag();motion.forEach(a=>a.cancel());motion.clear();scene?.settle();audio?.stop();};
function status(key,values={},kind='') { $('battleStatus').textContent=copy(key,values);$('battleStatus').dataset.kind=kind; }
function applyCopy() {
  document.querySelectorAll('[data-copy]').forEach(el=>{const key=el.dataset.copy;if(dictionary[key]||locales[locale][key])el.textContent=copy(key);});
  document.querySelectorAll('[data-copy-aria-label]').forEach(el=>el.setAttribute('aria-label',copy(el.dataset.copyAriaLabel)));
  document.querySelectorAll('[data-copy-alt]').forEach(el=>el.alt=copy(el.dataset.copyAlt));
  $('targetText').setAttribute('aria-label',copy('goal'));
  $('magnetTrack').setAttribute('aria-label',copy('title'));
  // Replace obsolete campaign-total and no-purchase claims with current rules in every locale.
  const guide={guideOne:copy('helpRule'),guideTwo:locales[locale].rules.slice(0,3).join(' '),guideThree:copy('incorrect')+' '+copy('aligned'),guideCampaign:locales[locale].arcs.map((name,i)=>`${i*5+1}–${i*5+5}: ${name}`).join(' · ')+'. '+copy('permanent'),guideMechanics:locales[locale].rules.join(' '),guideProgress:copy('masteryNote')};
  for(const [key,text]of Object.entries(guide))document.querySelector(`[data-copy="${key}"]`).textContent=text;
  $('languageSelect').value=locale;
  updateProgress();
}
function updateProgress() {
  $('mainProgress').textContent=copy('progress',{count:progress.completed.length}).replace('/3','/30');
  if($('sharedStageProgress'))$('sharedStageProgress').textContent=copy('stageLabel',{n:browseIndex+1});
}
applyCopy();
const frame=window.mountMagnetMeadowFrame();
function setScreen(name) {
  window.WeightPlayCastle?.dismissRewardNotice?.('animal-magnet-meadow');
  settle(); state.screen=name;
  for(const key of ['main','stage','battle']) $(key+'Screen').hidden=key!==name;
  $('guideScreen').hidden=name!=='main';
  document.body.dataset.screen=name;frame.activate(name);scene?.pause(name!=='battle'||state.result);
  if(name==='stage')renderStages();
  updateProgress();effect($(name+'Screen'));
}
function mechanicLabel(b) {
  const rules=locales[locale].rules;
  return [rules[b.relation==='push'?1:0],b.relation==='flip'?rules[2]:'',b.anchors.length?rules[3]:'',b.blocked.length?rules[4]:'',b.stones.length===3?rules[5]:''].filter(Boolean).join(' ');
}
function renderStages() {
  if(!stageController) stageController=window.WeightPlayPlayUI.mountStage({
    page:$('stageWorkspace'),rail:$('stageList'),config:window.MagnetMeadowStageConfig({rounds:boards,unlocked,completed:index=>progress.completed.includes(index),mastery:index=>progress.stars[index]||0,rewardState,copy:(key,values)=>key==='round'?copy('stageLabel',{n:values.number}):copy(key,values),roundTitle:index=>`${locales[locale].arcs[boards[index].arc-1]} · ${index%5+1}`,roundHint:index=>[mechanicLabel(boards[index]),progress.best[index]?copy('best',{n:progress.best[index]}):''].filter(Boolean).join(' '),mechanicLabel}),
    selected:browseIndex,isActive:()=>state.screen==='stage',onSelect:index=>{browseIndex=index;updateProgress();},onStart:startRound,
  });
  stageController.refresh(browseIndex);
}
function placeNodes(next) {
  layout=next;
  next.pads.forEach((point,index)=>{const el=$('slotGrid').children[index];if(el){el.style.left=`${point.x}px`;el.style.top=`${point.y}px`;}});
  for(const [id,point]of Object.entries(next.stones)){const el=$('stone-'+id);if(el){el.style.left=`${point.x}px`;el.style.top=`${point.y}px`;}}
}
function createBoard() {
  $('slotGrid').replaceChildren();$('stoneLayer').replaceChildren();$('targetText').replaceChildren();
  for(let index=0;index<board().boardSize;index++) {
    const el=document.createElement('button');el.type='button';el.className='dock';el.dataset.dock=index;el.dataset.blocked=board().blocked.includes(index);el.textContent=String(index+1);
    const target=board().stones.find(id=>board().target[id]===index);
    if(target){const marker=document.createElement('span');marker.className='dock-target';marker.dataset.stone=target;marker.textContent=target.toUpperCase();el.append(marker);}
    el.setAttribute('aria-label',copy('slot',{number:index+1})+(target?` · ${target.toUpperCase()}`:'')+(board().blocked.includes(index)?` · ${copy('blocked')}`:''));
    el.addEventListener('click',()=>{if(active())commit(state.selected,index);});
    el.addEventListener('pointerenter',event=>{if(active()&&!state.drag&&event.pointerType==='mouse')preview(index);});
    el.addEventListener('focus',()=>{if(active())preview(index);});
    el.addEventListener('pointerleave',()=>{if(!state.drag)clearPreview();});
    $('slotGrid').append(el);
  }
  for(const id of board().stones) {
    const el=document.createElement('button');el.type='button';el.id='stone-'+id;el.className='stone';el.dataset.stone=id;el.dataset.anchor=board().anchors.includes(id);el.textContent=id.toUpperCase();
    el.addEventListener('pointerdown',event=>{
      if(!active()||event.button!==0)return;select(id);if(board().anchors.includes(id))return;
      state.drag={id,pointerId:event.pointerId,element:el,startX:event.clientX,startY:event.clientY,moved:false};el.setPointerCapture(event.pointerId);
    });
    el.addEventListener('click',event=>{if(event.detail===0&&active())select(id);});
    $('stoneLayer').append(el);
    const chip=document.createElement('span');chip.className='target-chip';chip.dataset.stone=id;chip.textContent=`${id.toUpperCase()} → ${board().target[id]+1}`;$('targetText').append(chip);
  }
}
function ensureScene() {
  if(scene)return true;
  try{scene=new MeadowScene($('magnetTrack'),placeNodes,ready=>{$('renderRecovery').hidden=ready;if(!ready)settle();});return true;}
  catch(error){$('renderRecovery').hidden=false;console.error('Magnet Meadow renderer unavailable',error);return false;}
}
function startRound(index) {
  if(!unlocked(index))return;
  state.round=index;state.positions={...board().initial};state.moves=0;state.history=[];state.assisted=false;state.result=false;state.selected=board().stones.find(id=>!board().anchors.includes(id));browseIndex=index;
  $('battlePanel').hidden=false;$('resultPanel').hidden=true;createBoard();setScreen('battle');
  if(ensureScene())scene.load(board(),state.positions,progress.theme);
  window.WonderAnalytics?.track?.('stage_start',{game_id:'animal-magnet-meadow',stage_id:`animal-magnet-meadow-${index+1}`});
  render(false);status('ready');sound('game.start');$('stone-'+state.selected).focus({preventScroll:true});
}
function render(animate=true) {
  $('sharedBattleStage').textContent=copy('stageLabel',{n:state.round+1});$('sharedBattleMoves').textContent=copy('moves',{n:state.moves});
  $('battleHeading').textContent=locales[locale].arcs[board().arc-1];
  $('relationBadge').textContent=(board().relation==='flip'?'⇄ ':'')+copy(relationAt(board(),state.moves)==='pull'?'relationPull':'relationPush');
  $('relationBadge').title=mechanicLabel(board());
  $('undoBtn').disabled=!state.history.length;$('checkBtn').dataset.ready=String(solved(board(),state.positions));
  for(const id of board().stones){const el=$('stone-'+id);el.setAttribute('aria-pressed',String(state.selected===id));el.setAttribute('aria-label',`${id.toUpperCase()} · ${copy('slot',{number:state.positions[id]+1})}${board().anchors.includes(id)?' · '+copy('anchor'):''}`);el.dataset.position=state.positions[id];$('targetText').querySelector(`[data-stone="${id}"]`).dataset.matched=state.positions[id]===board().target[id];}
  $('magnetTrack').dataset.stage=state.round+1;$('magnetTrack').dataset.moves=state.moves;$('magnetTrack').dataset.relation=relationAt(board(),state.moves);
  clearPreview();scene?.update(state.positions,state.selected,animate);
}
function select(id) {
  state.selected=id;render(false);status(board().anchors.includes(id)?'anchor':'selected',{id:id.toUpperCase()});
}
function clearPreview() {
  for(const el of $('slotGrid').children){delete el.dataset.candidate;delete el.dataset.invalid;}
  scene?.preview(null);
}
function preview(destination,showStatus=true) {
  if(!active())return;clearPreview();const next=move(board(),state.positions,state.moves,state.selected,destination);
  const dock=$('slotGrid').children[destination];if(dock)dock.dataset[next.ok?'candidate':'invalid']='true';
  if(next.ok){scene?.preview(next.positions);if(showStatus)status('preview',{route:board().stones.map(id=>`${id.toUpperCase()}${next.positions[id]+1}`).join(' · ')});}
  else if(next.reason!=='same'&&showStatus)status(next.reason,{},'error');
  return next;
}
function commit(id,destination) {
  if(!active())return;
  const next=move(board(),state.positions,state.moves,id,destination);
  if(!next.ok){render();if(next.reason!=='same'){status(next.reason,{},'error');sound('feedback.error');effect($('battleStatus'),true);}return;}
  state.history.push({positions:{...state.positions},moves:state.moves});state.positions=next.positions;state.moves=next.moves;render();
  const complete=solved(board(),state.positions);status(complete?'aligned':'selected',{id:state.selected.toUpperCase()},complete?'success':'');sound(complete?'puzzle.match':'board.move');
}
function nearest(event) {
  const rect=$('magnetTrack').getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)return -1;
  const x=(event.clientX-rect.left)*$('magnetTrack').clientWidth/rect.width,y=(event.clientY-rect.top)*$('magnetTrack').clientHeight/rect.height;
  const distances=layout.pads.map(p=>Math.hypot(p.x-x,p.y-y));const nearest=distances.indexOf(Math.min(...distances));return distances[nearest]<=76?nearest:-1;
}
function cancelDrag() {
  const drag=state.drag;state.drag=null;
  if(drag?.element.hasPointerCapture(drag.pointerId))drag.element.releasePointerCapture(drag.pointerId);
  scene?.settle();clearPreview();
}
$('magnetTrack').addEventListener('pointermove',event=>{
  const drag=state.drag;if(!drag||drag.pointerId!==event.pointerId||!active())return;
  if(Math.hypot(event.clientX-drag.startX,event.clientY-drag.startY)>6)drag.moved=true;
  if(!drag.moved)return;
  const destination=nearest(event);if(destination>=0)preview(destination);else clearPreview();
  const rect=$('magnetTrack').getBoundingClientRect();scene?.drag(drag.id,(event.clientX-rect.left)*$('magnetTrack').clientWidth/rect.width,(event.clientY-rect.top)*$('magnetTrack').clientHeight/rect.height);
});
$('magnetTrack').addEventListener('pointerup',event=>{
  const drag=state.drag;if(!drag||drag.pointerId!==event.pointerId)return;const destination=nearest(event);state.drag=null;
  if(drag.element.hasPointerCapture(drag.pointerId))drag.element.releasePointerCapture(drag.pointerId);
  if(drag.moved&&destination>=0)commit(drag.id,destination);else{render();if(drag.moved)status('outside',{},'error');}
});
$('magnetTrack').addEventListener('pointercancel',cancelDrag);
$('magnetTrack').addEventListener('lostpointercapture',()=>{if(state.drag)cancelDrag();});
$('magnetTrack').addEventListener('keydown',event=>{
  if(!active())return;
  const key=event.key;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(key)){
    event.preventDefault();const current=event.target.dataset.dock!==undefined?Number(event.target.dataset.dock):state.positions[state.selected];
    let destination=current;
    if(key==='ArrowLeft'||key==='ArrowRight')destination=Math.max(0,Math.min(board().boardSize-1,current+(key==='ArrowRight'?1:-1)));
    else {const point=layout.pads[current];const candidates=layout.pads.map((p,i)=>({p,i})).filter(({p})=>key==='ArrowDown'?p.y>point.y+20:p.y<point.y-20).sort((a,b)=>(Math.abs(a.p.x-point.x)+Math.abs(a.p.y-point.y))-(Math.abs(b.p.x-point.x)+Math.abs(b.p.y-point.y)));destination=candidates[0]?.i??current;}
    $('slotGrid').children[destination].focus();
  }else if(key==='Escape'){event.preventDefault();clearPreview();$('stone-'+state.selected).focus();}
});
$('undoBtn').addEventListener('click',()=>{if(!active()||!state.history.length)return;cancelDrag();const old=state.history.pop();state.positions=old.positions;state.moves=old.moves;render();status('ready');sound('board.undo');});
$('resetBtn').addEventListener('click',()=>{if(active()){startRound(state.round);sound('board.undo');}});
$('hintBtn').addEventListener('click',()=>{
  if(!active())return;cancelDrag();const path=solution(board(),state.positions,state.moves);if(!path?.length){status(solved(board(),state.positions)?'aligned':'noRoute');return;}
  state.assisted=true;state.selected=path[0].id;render(false);preview(path[0].destination,false);status('hintStep',{id:path[0].id.toUpperCase(),n:path[0].destination+1});sound('feedback.hint');
});
function persist(next) {
  try {localStorage.setItem(progressKey,JSON.stringify(next));progress=next;return true;}catch{return false;}
}
function finish() {
  if(!active())return;if(!solved(board(),state.positions)){status('incorrect',{},'error');sound('feedback.error');effect($('battleStatus'),true);return;}
  const optimal=solution(board()).length;const stars=Math.min(state.assisted?2:3,state.moves===optimal?3:state.moves<=optimal+2?2:1);
  const latest=normalizeProgress(readJSON(progressKey)||progress,readJSON(legacyKey)||[]);
  const next={...latest,theme:progress.theme,completed:[...new Set([...latest.completed,state.round])].sort((a,b)=>a-b),best:{...latest.best,[state.round]:Math.min(latest.best[state.round]||Infinity,state.moves)},stars:{...latest.stars,[state.round]:Math.max(latest.stars[state.round]||0,stars)}};
  if(!persist(next)){status('unsaved',{},'error');sound('feedback.error');return;}
  state.result=true;settle();scene?.pause(true);$('battlePanel').hidden=true;$('resultPanel').hidden=false;
  $('resultHeading').textContent=copy(state.round===29?'finish':'complete');$('resultStars').textContent='★'.repeat(stars)+'☆'.repeat(3-stars);$('resultStars').setAttribute('aria-label',copy('mastery',{n:stars}));
  $('resultText').textContent=copy('saved');$('resultStats').replaceChildren();
  for(const text of [copy('moves',{n:state.moves}),copy('best',{n:progress.best[state.round]}),copy('optimal',{n:optimal})]){const span=document.createElement('span');span.textContent=text;$('resultStats').append(span);}
  $('resultPrimaryBtn').hidden=state.round===29;updateProgress();effect($('resultPanel'));sound('result.win');$('resultHeading').focus();
  const reward=window.WonderAnalytics?.completeStage?.(`animal-magnet-meadow-${state.round+1}`);
  window.WeightPlayScreenFrame?.showResultGet?.('animal-magnet-meadow',reward?.credited===true);
}
$('checkBtn').addEventListener('click',finish);
function openDialog(id) {settle();lastFocus=document.activeElement;$(id).showModal();effect($(id));}
function closeDialog(id) {$(id).close();lastFocus?.focus({preventScroll:true});}
function toMap(){state.result=false;browseIndex=nextIndex();setScreen('stage');}
$('startBtn').addEventListener('click',toMap);$('mapBtn').addEventListener('click',toMap);$('stageTabButton').addEventListener('click',()=>{});
$('stageBackBtn').addEventListener('click',()=>setScreen('main'));
$('battleBackBtn').addEventListener('click',()=>{if(state.result||!state.moves)toMap();else openDialog('leaveDialog');});
$('keepPlayingBtn').addEventListener('click',()=>closeDialog('leaveDialog'));
$('leaveConfirmBtn').addEventListener('click',()=>{closeDialog('leaveDialog');toMap();});
$('resultMapBtn').addEventListener('click',toMap);$('resultPrimaryBtn').addEventListener('click',()=>startRound(state.round+1));$('resultHomeBtn').addEventListener('click',()=>startRound(state.round));
$('reloadBtn').addEventListener('click',()=>location.reload());$('recoveryMapBtn').addEventListener('click',toMap);
function updateGarden(){
  const owned=ownsAmber(localStorage);$('walletBalance').textContent=copy('balance',{n:window.WeightPlayWallet?.read().diamonds||0});
  $('amberLabel').textContent=copy(owned?(progress.theme==='amber'?'equipped':'equip'):'buy');$('moonBtn').textContent=copy('moon')+(progress.theme==='moon'?' ✓':'');
  $('amberBtn').disabled=purchaseBusy||owned&&progress.theme==='amber';$('purchaseBtn').disabled=purchaseBusy;
}
function equip(theme){const next={...progress,theme};if(!persist(next)){$('gardenStatus').textContent=copy('storageError');return;}$('gardenStatus').textContent=copy('equipped');updateGarden();effect($('gardenStatus'));}
$('gardenBtn').addEventListener('click',()=>{$('purchaseConfirm').hidden=true;$('gardenStatus').textContent='';updateGarden();openDialog('gardenDialog');});
$('gardenCloseBtn').addEventListener('click',()=>closeDialog('gardenDialog'));
$('moonBtn').addEventListener('click',()=>equip('moon'));
$('amberBtn').addEventListener('click',()=>{if(ownsAmber(localStorage))equip('amber');else{$('purchaseConfirm').hidden=false;$('purchaseCancelBtn').focus();}});
$('purchaseCancelBtn').addEventListener('click',()=>{$('purchaseConfirm').hidden=true;$('amberBtn').focus();});
$('purchaseBtn').addEventListener('click',async()=>{
  if(purchaseBusy)return;purchaseBusy=true;updateGarden();
  const operation=()=>unlockAmber(localStorage,window.WeightPlayWallet);
  let outcome;try{outcome=navigator.locks?await navigator.locks.request('weightplay-magnet-meadow-amber',operation):operation();}catch{outcome={ok:false,reason:'storageError'};}
  purchaseBusy=false;$('purchaseConfirm').hidden=true;
  if(outcome.ok){equip('amber');$('gardenStatus').textContent=copy('purchased');if(!outcome.alreadyOwned)sound('shop.purchase');}
  else{$('gardenStatus').textContent=copy(outcome.reason);sound('feedback.error');}
  updateGarden();$('gardenStatus').tabIndex=-1;$('gardenStatus').focus();
});
for(const dialog of document.querySelectorAll('dialog'))dialog.addEventListener('close',()=>{lastFocus?.focus({preventScroll:true});});
document.addEventListener('keydown',event=>{
  if(event.key==='Tab'&&state.result&&state.screen==='battle'){
    const buttons=[...$('resultPanel').querySelectorAll('button:not([hidden])')];const first=buttons[0],last=buttons.at(-1);
    if(event.shiftKey&&(document.activeElement===first||document.activeElement===$('resultHeading'))){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  }
});
document.addEventListener('visibilitychange',()=>{if(document.hidden)settle();scene?.pause(document.hidden||state.screen!=='battle'||state.result);});
window.addEventListener('blur',settle);
window.addEventListener('focus',()=>scene?.pause(document.hidden||state.screen!=='battle'||state.result));
window.addEventListener('pagehide',event=>{settle();if(!event.persisted){stageController?.destroy?.();scene?.dispose();audio?.dispose();}});
window.addEventListener('pageshow',()=>scene?.pause(document.hidden||state.screen!=='battle'||state.result));
window.addEventListener('storage',event=>{if([progressKey,legacyKey].includes(event.key)){progress=normalizeProgress(readJSON(progressKey)||{},readJSON(legacyKey)||[]);updateProgress();if(state.screen==='stage')renderStages();}if($('gardenDialog').open)updateGarden();});
let tutorialFocus=null;
window.addEventListener('weightplay:tutorial-open',event=>{if(event.detail.gameId!=='animal-magnet-meadow')return;settle();tutorialFocus=document.activeElement;$('gameFrame').inert=true;$('guideScreen').inert=true;document.querySelector('.wp-tutorial-close')?.focus();});
window.addEventListener('weightplay:tutorial-close',event=>{if(event.detail.gameId!=='animal-magnet-meadow')return;$('gameFrame').inert=false;$('guideScreen').inert=false;tutorialFocus?.focus({preventScroll:true});});
document.addEventListener('keydown',event=>{const tutorial=document.querySelector('.wp-tutorial-backdrop');if(!tutorial)return;const first=tutorial.querySelector('.wp-tutorial-close'),last=tutorial.querySelector('.wp-tutorial-action');if(event.key==='Escape'){event.preventDefault();first.click();}else if(event.key==='Tab'){if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}});
const tutorialStyle=document.createElement('link');tutorialStyle.rel='stylesheet';tutorialStyle.href='/src/tutorial.css';document.head.append(tutorialStyle);
const tutorialScript=document.createElement('script');tutorialScript.src='/src/tutorial.js?v=20261022-magnet-v17';document.body.append(tutorialScript);
setScreen('main');
