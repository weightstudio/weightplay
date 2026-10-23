import {stages, effects, turn, inspect, hint, distance, COLORS} from './puzzle.mjs';
import {readProgress, saveProgress, mergeProgress, owns, purchaseMoon} from './progress.mjs';
import {workshopCopy} from './workshop-copy.mjs';
import {LocalPractice} from '../../src/game-local-practice.mjs';
const $=id=>document.getElementById(id);
let storage;try{storage=window.localStorage;}catch{storage={getItem:()=>null,setItem:()=>{throw Error('Storage unavailable');},removeItem:()=>{throw Error('Storage unavailable');}};}
const dictionaries=window.ANIMAL_PATCHWORK_PAWS_LOCALES||{};
const guideRoot=document.querySelector('#gameGuide,[data-wp-game-guide],.game-page-info-static');
const names={
 en:['Fern Meadow','Pebble Creek','Moonlit Hollow','Dewdrop Ridge','Clover Gate','Bramble Turn','Gusty Glen','Whistling Pines','Cloudstep Rise','Windwatch Gate','Echo Brook','Murmur Marsh','Ripple Hollow',"Otter’s Crossing",'Echo Bell Gate','Canopy Compass','Sunbeam Fork','Leafline Lookout','Northwind Nest','Compass Crown','Moonlit Braid','Silver Thread','Night Fern','Starfall Crossing','Moonrise Gate',"Keeper’s Path",'Quiet Lanterns','Four Pawprints','Last Meadow',"Guardian’s Seal"],
 'zh-Hant':['蕨葉草地','卵石溪流','月光小谷','露珠山稜','幸運草之門','荊棘轉彎','微風峽谷','呼嘯松林','雲階高地','風望之門','回聲小溪','低語濕地','漣漪小谷','水獺渡口','回聲鐘門','樹冠羅盤','日光岔路','葉線瞭望台','北風鳥巢','羅盤王冠','月光編織','銀絲小徑','夜蕨之地','星落渡口','月升之門','守護者小徑','靜謐燈火','四爪印記','最後草地','守護封印'],
 'zh-Hans':['蕨叶草地','卵石溪流','月光小谷','露珠山岭','幸运草之门','荆棘转弯','微风峡谷','呼啸松林','云阶高地','风望之门','回声小溪','低语湿地','涟漪小谷','水獭渡口','回声钟门','树冠罗盘','日光岔路','叶线瞭望台','北风鸟巢','罗盘王冠','月光编织','银丝小径','夜蕨之地','星落渡口','月升之门','守护者小径','静谧灯火','四爪印记','最后草地','守护封印']};
let locale=workshopCopy[document.documentElement.lang]?document.documentElement.lang:'en';
function t(key,vars={}){
 let text=workshopCopy[locale][key]??window.ANIMAL_PATCHWORK_PAWS_CAMPAIGN_LOCALES?.[locale]?.[key]??dictionaries[locale]?.[key]??dictionaries.en?.[key]??key;
 const match=key.match(/^stage(\d+)$/);if(match){const i=Number(match[1])-1;text=names[locale]?.[i]??window.ANIMAL_PATCHWORK_PAWS_CAMPAIGN_LOCALES?.[locale]?.[key]??`${workshopCopy[locale][`arc${Math.floor(i/5)+1}`]} · ${i%5+1}`;}
 return Object.entries(vars).reduce((s,[k,v])=>s.replaceAll(`{${k}}`,String(v)),text);
}
let progress=readProgress(storage), stage=stages[0], rotations=[], history=[], moves=0, usedHint=false, screen='main', completed=false, practice=false, renderer=null, renderFailed=false, modal=null, restoreFocus=null, buying=false, failureMarked=false;
let frameUI=null, generation=0, pendingResult=0, audio=null, lastMatched=0, checkResult=null, destroyed=false;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const buttons=[];
const play=(id)=>{try{(audio||window.WeightPlayAudio)?.play(id);}catch{/* Sound failure never blocks play. */}};
const cancel=()=>{clearTimeout(pendingResult);pendingResult=0;generation++;$('boardSquare').getAnimations().forEach(animation=>animation.cancel());};
const safeSave=()=>{try{progress=mergeProgress(readProgress(storage),progress);saveProgress(storage,progress);$('saveNotice').hidden=true;return true;}catch{$('saveNotice').hidden=false;$('saveNotice').textContent=t('saveError');return false;}};
const fabric=()=>owns(progress,progress.fabric)?progress.fabric:'linen';
function show(next){
 cancel();closeModal();screen=next;document.body.dataset.screen=next;
 for(const name of ['main','stage','battle']){const root=$(`${name}Screen`);root.hidden=name!==next;root.inert=name!==next;root.setAttribute('aria-hidden',String(name!==next));}
 if(guideRoot)guideRoot.hidden=next!=='main';frameUI.frame.activate(next);renderer?.setActive(next==='battle');
 window.dispatchEvent(new CustomEvent('weightplay:game-view-change',{detail:{view:next}}));
 if(next==='stage')frameUI.refreshStage(Math.min(stage.number-1,progress.unlocked-1));
 if(next==='main')$('best').textContent=`${progress.cleared.length} / 30 · ${Object.values(progress.records).filter(r=>r.mastered).length} / 30 ★`;
}
function openModal(panel){
 cancel();if(modal)closeModal();restoreFocus=document.activeElement;modal=panel;
 panel.showModal();panel.querySelector('button:not(:disabled)')?.focus();renderer?.setActive(false);
}
function closeModal(){if(!modal)return;modal.close();modal=null;restoreFocus?.focus?.({preventScroll:true});renderer?.setActive(screen==='battle');}
async function start(index){
 if(!Number.isInteger(index)||index<0||index>=30||(!practice&&index>=progress.unlocked))return;
 if(practice&&!await LocalPractice.validate())return;
 stage=stages[index];rotations=stage.initial.slice();history=[];moves=0;usedHint=false;completed=false;failureMarked=false;checkResult=null;
 $('status').textContent=t('objective');$('patchTitle').textContent=t(stage.name);$('progressPill').textContent=`${stage.number} / 30`;
 $('ruleText').textContent=t(stage.rule);$('chapterLabel').textContent=t(stage.arc);
 $('masteryTarget').textContent=t('mastery',{n:distance(stage,stage.initial)});
 // Complete the scene before the shared frame measures its logical canvas.
 buildBoard();renderer?.load(stage,rotations,fabric());updateBoard();show('battle');
 $('checkBtn').disabled=false;buttons[0]?.focus({preventScroll:true});
 if(!practice)window.WonderAnalytics?.track?.('stage_start',{stage_id:String(stage.number)});
}
function buildBoard(){
 $('board').replaceChildren();$('seamLayer').replaceChildren();buttons.length=0;
 $('board').style.setProperty('--n',stage.size);$('boardSquare').dataset.size=stage.size;$('boardSquare').dataset.fabric=fabric();
 stage.tiles.forEach((_,i)=>{
  const button=document.createElement('button');button.type='button';button.className='quilt-tile';button.dataset.tile=String(i);button.setAttribute('role','gridcell');
  const face=document.createElement('span');face.className='flat-face';face.setAttribute('aria-hidden','true');
  for(let d=0;d<4;d++){const arm=document.createElement('span');arm.className=`flat-arm arm-${d}`;face.append(arm);}button.append(face);
  const badge=document.createElement('span');badge.className='tile-badge';badge.setAttribute('aria-hidden','true');button.append(badge);
  button.addEventListener('click',()=>rotate(i));
  const preview=()=>highlight(effects(stage,i).map(c=>c[0]));button.addEventListener('pointerenter',preview);button.addEventListener('focus',preview);
  button.addEventListener('pointerleave',()=>highlight([]));button.addEventListener('blur',()=>highlight([]));
  button.addEventListener('keydown',event=>{const delta={ArrowUp:-stage.size,ArrowDown:stage.size,ArrowLeft:-1,ArrowRight:1}[event.key];if(delta!==undefined){event.preventDefault();buttons[Math.max(0,Math.min(buttons.length-1,i+delta))]?.focus();}});
  $('board').append(button);buttons.push(button);
 });
}
function highlight(indices){buttons.forEach((b,i)=>b.classList.toggle('linked-preview',indices.includes(i)));}
function updateBoard(changes=[]){
 const state=inspect(stage,rotations), n=stage.size;
 buttons.forEach((b,i)=>{
  const linked=effects(stage,i),fixed=!linked.length;
  b.setAttribute('aria-label',`${t('turnTile',{n:i+1})}. ${fixed?t('anchor'):t('linked',{n:linked.map(c=>c[0]+1).join(', ')})}. ${state.edges[i].join(' / ')}`);
  b.setAttribute('aria-disabled',String(fixed||completed));
  b.querySelector('.tile-badge').textContent=fixed?'⊙':stage.mode==='wind'&&stage.pair.includes(i)?'A':stage.mode==='echo'?`${Math.min(i,8-i)+1} ↔`:stage.mode==='braid'?'↻ + →':stage.mode==='guardian'?'+':String(i+1);
  b.classList.toggle('fixed',fixed);b.classList.toggle('hinted',false);
  b.querySelectorAll('.flat-arm').forEach((arm,d)=>{const c=state.edges[i][d];arm.style.background=COLORS[c];arm.textContent=c?'│'.repeat(c):'';arm.hidden=!c;});
 });
 $('seamLayer').replaceChildren();
 for(const s of [...state.seams,...state.borders]){
  if(!s.ok&&!failureMarked)continue;
  const mark=document.createElement('span'),r=Math.floor(s.a/n),c=s.a%n;
  mark.className=`seam-mark ${s.ok?'joined':'mismatch'} d${s.dir}`;mark.textContent=s.ok?'':'!';
  mark.style.left=`${(c+([.5,1,.5,0][s.dir]))/n*100}%`;mark.style.top=`${(r+([0,.5,1,.5][s.dir]))/n*100}%`;
  $('seamLayer').append(mark);
 }
 $('moves').textContent=t('turns',{n:moves});$('seamCount').textContent=t('connections',{n:state.matched,total:state.total});
 $('undoBtn').disabled=!history.length||completed;$('hintBtn').disabled=completed||state.solved;$('resetBtn').disabled=completed;
 $('checkBtn').classList.toggle('is-ready',state.solved);renderer?.update(rotations,changes);
 if(state.matched>lastMatched&&changes.length)play('puzzle.match');lastMatched=state.matched;
 if(state.solved&&!completed)$('status').textContent=t('ready');
 return state;
}
function rotate(i){
 if(screen!=='battle'||modal||completed)return;
 const changes=effects(stage,i);if(!changes.length){$('status').textContent=t('lockedTile');play('feedback.error');return;}
 history.push(rotations.slice());rotations=turn(stage,rotations,i);moves++;failureMarked=false;
 $('status').textContent=t(stage.rule);play('board.rotate');updateBoard(changes);highlight(changes.map(c=>c[0]));
}
function undo(){if(!history.length||completed)return;rotations=history.pop();moves--;failureMarked=false;play('board.undo');updateBoard();$('status').textContent=t('undoDone');}
function reset(){if(completed)return;rotations=stage.initial.slice();history=[];moves=0;usedHint=false;failureMarked=false;play('board.undo');updateBoard();$('status').textContent=t('resetDone');}
function suggest(){if(completed)return;const i=hint(stage,rotations);if(i<0)return;usedHint=true;highlight(effects(stage,i).map(c=>c[0]));buttons[i].classList.add('hinted');buttons[i].focus({preventScroll:true});$('status').textContent=t('hintText',{n:i+1});play('feedback.hint');}
function check(){
 if(completed||modal)return;
 failureMarked=true;const state=updateBoard();
 if(!state.solved){$('status').textContent=t('wrong');play('feedback.error');$('boardSquare').animate([{opacity:.6},{opacity:1}],{duration:reduced.matches?60:180});return;}
 completed=true;$('checkBtn').disabled=true;
 const mastered=!usedHint&&moves<=distance(stage,stage.initial),previous=progress.records[stage.number-1];
 checkResult={mastered,moves,best:Math.min(previous?.turns??Infinity,moves)};
 if(!practice){
  progress.cleared=[...new Set([...progress.cleared,stage.number-1])].sort((a,b)=>a-b);progress.unlocked=Math.min(30,Math.max(progress.unlocked,stage.number+1));
  progress.records[stage.number-1]={turns:checkResult.best,mastered:mastered||previous?.mastered===true};
  if(safeSave())window.WonderAnalytics?.completeStage?.(String(stage.number));
 }
 updateBoard();play('result.win');$('status').textContent=t('finish');
 const token=++generation;pendingResult=setTimeout(()=>{pendingResult=0;if(token===generation&&screen==='battle'&&!modal&&!document.hidden)result();},reduced.matches?0:240);
}
function result(){
 if(!completed||!checkResult)return;
 $('resultTitle').textContent=t(checkResult.mastered?'masterResult':'clearResult');
 $('resultText').textContent=stage.number===30?t('allDone'):`${t(stage.name)} · ${t('turns',{n:checkResult.moves})}`;
 $('resultBest').textContent=`${t('bestMoves',{n:checkResult.best})}${usedHint?' · '+t('helpUsed'):''}`;
 $('resultMedal').textContent=checkResult.mastered?'★★★':'★';
 $('nextBtn').disabled=stage.number===30;openModal($('resultScreen'));
}
function renderCollection(){
 $('collectionBalance').replaceChildren();const diamond=document.createElement('img');diamond.src='/assets/weightplay-diamond.svg';diamond.alt='';diamond.width=22;diamond.height=22;$('collectionBalance').append(diamond,document.createTextNode(t('balance',{n:window.WeightPlayWallet?.read().diamonds??0})));$('fabricCards').replaceChildren();
 for(const name of ['linen','sage','river','moon']){
  const card=document.createElement('article');card.className='fabric-card';const swatch=document.createElement('div');swatch.className=`fabric-swatch ${name}`;swatch.setAttribute('aria-hidden','true');
  const title=document.createElement('h3');title.textContent=t(name);const note=document.createElement('p');note.textContent=t({linen:'free',sage:'earn5',river:'earn10',moon:'moonOffer'}[name]);
  const button=document.createElement('button');button.type='button';const owned=owns(progress,name);button.textContent=t(fabric()===name?'equipped':owned?'equip':name==='moon'?'buy':name==='sage'?'earn5':'earn10');button.disabled=buying||practice||fabric()===name||(!owned&&name!=='moon');
  button.addEventListener('click',async()=>{
   if(buying||practice)return;
   if(owned){progress.fabric=name;if(safeSave()){play('ui.tick');renderer?.setFabric(name);$('boardSquare').dataset.fabric=name;}renderCollection();return;}
   buying=true;renderCollection();
   try{
    const operation=()=>purchaseMoon(storage,window.WeightPlayWallet);
    const purchase=navigator.locks?await navigator.locks.request('weightplay-patchwork-fabric-purchase',operation):operation();
    progress=purchase.data;$('collectionStatus').textContent=t({funds:'funds',storage:'saveError',bought:'bought',owned:'bought'}[purchase.status]);
    if(purchase.status==='bought'){play('shop.purchase');renderer?.setFabric(fabric());$('boardSquare').dataset.fabric=fabric();}
   }finally{buying=false;renderCollection();}
  });
  card.append(swatch,title,note,button);$('fabricCards').append(card);
 }
}
function localize(){
 $('localeSelect').value=locale;document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';
 document.querySelectorAll('[data-i18n]').forEach(node=>{if(node.hasAttribute('data-wp-game-title'))return;node.textContent=t(node.dataset.i18n);});
 $('prompt').textContent=t('objective');$('board').setAttribute('aria-label',t('objective'));
 $('stageBackBtn').setAttribute('aria-label',t('back'));$('battleBackBtn').setAttribute('aria-label',t('back'));
 const leave=window.ANIMAL_PATCHWORK_PAWS_LEAVE_COPY?.[locale]||window.ANIMAL_PATCHWORK_PAWS_LEAVE_COPY?.en;
 if(leave){$('leaveTitle').textContent=leave.title;$('leaveBody').textContent=leave.body.replace('{stage}',t(stage.name));document.querySelector('[data-wp-leave-continue]').textContent=leave.continue;document.querySelector('[data-wp-leave-confirm]').textContent=leave.leave;}
 const guide=guideRoot;guide.querySelector('.game-info-title > p').textContent=t('intro');
 const sections=guide.querySelector('.game-info-sections'),faq=sections.querySelector('.game-info-section:has(dl)');sections.replaceChildren();
 for(const [title,body] of [[t('guideTitle'),`${t('objective')} ${t('guideControls')}`],...Array.from({length:6},(_,i)=>[t(`arc${i+1}`),t(`rule${i+1}`)]),[t('guideProgressTitle'),t('guideProgress')],[t('collection'),t('collectionIntro')+' '+t('moonOffer')]]){const article=document.createElement('article');article.className='game-info-section';const heading=document.createElement('h3');heading.textContent=title;const p=document.createElement('p');p.textContent=body;article.append(heading,p);sections.append(article);}
 if(faq)sections.append(faq);
 collectionButton.textContent=t('collection');
 $('best').textContent=`${progress.cleared.length} / 30 · ${Object.values(progress.records).filter(r=>r.mastered).length} / 30 ★`;
 frameUI?.refreshStage();
 if(screen==='battle'){buildBoard();updateBoard();$('patchTitle').textContent=t(stage.name);$('chapterLabel').textContent=t(stage.arc);$('ruleText').textContent=t(stage.rule);$('masteryTarget').textContent=t('mastery',{n:distance(stage,stage.initial)});}
}
const collectionButton=document.createElement('button');collectionButton.type='button';collectionButton.id='collectionBtn';collectionButton.addEventListener('click',()=>{progress=readProgress(storage);renderCollection();$('collectionStatus').textContent='';openModal($('collectionDialog'));});
frameUI=window.mountAnimalPatchworkPawsFrame({patches:stages,getState:()=>({unlockedStage:practice?30:progress.unlocked,cleared:new Set(progress.cleared)}),text:t,onSelect:()=>{},onStart:start});
frameUI.frame.commonDownButton.add(window.WeightPlayScreenFrame.createGroup().add(collectionButton));
$('startBtn').addEventListener('click',()=>{stage=stages[progress.unlocked-1];show('stage');});
$('stageBackBtn').addEventListener('click',()=>show('main'));
$('battleBackBtn').addEventListener('click',()=>{if(completed){result();return;}$('leaveBody').textContent=(window.ANIMAL_PATCHWORK_PAWS_LEAVE_COPY[locale]||window.ANIMAL_PATCHWORK_PAWS_LEAVE_COPY.en).body.replace('{stage}',t(stage.name));openModal($('leaveConfirm'));});
$('checkBtn').addEventListener('click',check);$('resetBtn').addEventListener('click',reset);$('undoBtn').addEventListener('click',undo);$('hintBtn').addEventListener('click',suggest);
$('resultMapBtn').addEventListener('click',()=>show('stage'));$('replayBtn').addEventListener('click',()=>start(stage.number-1));$('nextBtn').addEventListener('click',()=>start(stage.number));
$('closeCollection').addEventListener('click',closeModal);
$('leaveConfirm').querySelector('[data-wp-leave-continue]').addEventListener('click',()=>{closeModal();if(completed)result();});
$('leaveConfirm').querySelector('[data-wp-leave-confirm]').addEventListener('click',()=>show('stage'));
for(const dialog of document.querySelectorAll('dialog'))dialog.addEventListener('cancel',e=>{e.preventDefault();if(dialog===$('resultScreen'))show('stage');else closeModal();});
$('localeSelect').addEventListener('change',e=>{locale=workshopCopy[e.target.value]?e.target.value:'en';localize();});
window.addEventListener('storage',()=>{progress=readProgress(storage);if(modal===$('collectionDialog'))renderCollection();if(screen==='stage')frameUI.refreshStage();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancel();audio?.stop?.();}else if(completed&&screen==='battle'&&!modal)result();});
window.addEventListener('pagehide',e=>{cancel();audio?.stop?.();renderer?.setActive(false);if(!e.persisted){destroyed=true;renderer?.dispose();audio?.dispose?.();}});
window.addEventListener('pageshow',()=>renderer?.setActive(screen==='battle'&&!modal));
async function boot(){
 localize();show('main');
 try{audio=window.WeightPlayAudio?.createScope?.('animal-patchwork-paws');window.WeightPlayAudio?.preload?.(['board.rotate','board.undo','feedback.hint','feedback.error','puzzle.match','result.win','shop.purchase']);}catch{}
 try{const {createQuiltRenderer}=await import('./quilt-renderer.mjs');const loaded=await createQuiltRenderer($('quiltScene'));if(destroyed){loaded.dispose();return;}renderer=loaded;$('boardSquare').classList.add('has-3d');if(screen==='battle'){renderer.load(stage,rotations,fabric());renderer.setActive(!modal);}}
 catch{renderFailed=true;$('renderNotice').hidden=false;$('renderNotice').textContent=t('renderFallback');}
 await LocalPractice.register({gameId:'animal-patchwork-paws',stageIds:stages.map(s=>String(s.number)),enable:enabled=>{practice=enabled;frameUI.refreshStage();},startStage:id=>start(Number(id)-1)});
 window.WeightPlayGameEntryLoader?.ready?.();
}
boot();
