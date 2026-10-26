import {GAME_ID,SAVE_KEY,STAGES,PLAYBOOKS,COSMETICS,PORTRAITS,CAST} from './content.mjs';
import {Match,DT,normalizeSave,saveWin,unlockedStage,clamp} from './simulation.mjs';
import {FieldRenderer} from './render.mjs';
import {COPY,tr,localeSegments} from './i18n.mjs';
import {coachText,stageLesson} from './coaching.mjs';
import {drawInterceptionDiagram} from './interception-diagram.mjs';
import {tacticalChallenge} from './mastery.mjs';
import {createPlaybookChoices} from './playbook-choices.mjs';
import {LocalPractice} from '../../src/game-local-practice.mjs';
const $=id=>document.getElementById(id),abort=new AbortController();
const listen=(node,event,fn,options={})=>node.addEventListener(event,fn,{...options,signal:abort.signal});
const text=(node,value)=>{if(node.textContent!==String(value))node.textContent=String(value);};
const make=(tag,className='',copy='')=>{const n=document.createElement(tag);n.className=className;n.textContent=copy;return n;};
const atlasCache=new Map();
function atlas(kind,index){
  const canvas=make('canvas','collection-art');canvas.width=canvas.height=256;canvas.setAttribute('aria-hidden','true');
  if(!atlasCache.has(kind)){const image=new Image();image.src=`/games/meadow-touchdown/assets/${kind}.webp`;atlasCache.set(kind,image.decode().then(()=>image));}
  atlasCache.get(kind).then(image=>{if(disposed)return;const cols=kind==='icons'?3:2,side=image.width/cols;canvas.getContext('2d').drawImage(image,index%cols*side,Math.floor(index/cols)*side,side,side,0,0,256,256);}).catch(()=>{});
  return canvas;
}
let locale=window.WonderI18n?.actualLocale?.()||'en';
if(!COPY[locale])locale='en';
const t=(key,v)=>tr(locale,key,v),copy=()=>COPY[locale];
const c=(key,v)=>coachText(locale,key,v),castName=id=>id[0].toUpperCase()+id.slice(1);
const seconds=value=>new Intl.NumberFormat(locale,{style:'unit',unit:'second',unitDisplay:'short',maximumFractionDigits:1}).format(value);
let save,saveReadable=true;
function readSave(){const raw=localStorage.getItem(SAVE_KEY);return normalizeSave(raw===null?{}:JSON.parse(raw));}
try{save=readSave();}catch{save=normalizeSave();saveReadable=false;}
let screen='main',tab='stages',selection=unlockedStage(save)-1,match=null,renderer=null,frame=null,rail=null,playChoices=null,modal=null,modalFocus=null;
let raf=0,lastFrame=0,accumulator=0,visualTime=0,eventId=0,resultPending=false,resultSaved=false,resultReward=false,practiceMode=false,practiceRun=false,busyStart=false;
let feedbackUntil=0,drag=null,purchase=null,purchaseBusy=false,disposed=false,roundSerial=0,celebrationTime=0;
let lesson=null,lessonValues={},booksBefore=[],trialBook=null,reviewRemaining=0;
const seenLessons=new Set();
const keys=new Set();
const sound=window.WeightPlayAudio?.createScope();
const audio={snap:'game.start',throw:'projectile.launch',catch:'impact.soft',relayThrow:'projectile.launch',relayCatch:'impact.soft',sidestep:'movement.dash',flag:'impact.soft',drop:'sport.bounce',firstDown:'game.checkpoint',switch:'alert.warning',feint:'alert.warning',intercept:'alert.warning',leg:'sport.goal',win:'result.win',lose:'result.lose'};
function clearInput(){keys.clear();if(drag){try{$('actionBtn').releasePointerCapture(drag.id);}catch{}drag=null;}$('actionBtn').dataset.dragging='false';accumulator=0;}
function paused(){return !!modal||document.hidden||!$('wp-frame-battle-settings')?.hidden&&!!$('wp-frame-battle-settings');}
function announce(){
  window.WonderAnalytics?.game?.observeState(()=>({screen,roundKey:match&&!practiceRun?`${GAME_ID}:${roundSerial}`:null,stageId:match?.stage.id,started:!practiceRun&&!!match?.snapCount,ended:!practiceRun&&!!match?.result&&(!match.result.won||resultSaved),outcome:match?.result?.won?'win':'lose',paused:paused()||match?.phase==='ready'||match?.phase==='dead',locale,activityMode:'state',keyboardKeys:['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyA','KeyD','KeyR']}));
  window.dispatchEvent(new Event('weightplay:interaction-state'));
}
async function persist(change){
  if(practiceMode||practiceRun)return false;
  try{
    if(!navigator.locks?.request)throw Error('LOCK_REQUIRED');
    await navigator.locks.request(SAVE_KEY,()=>{
      const current=readSave(),next=normalizeSave(change(current)),bytes=JSON.stringify(next);
      try{localStorage.setItem(SAVE_KEY,bytes);}catch(error){if(localStorage.getItem(SAVE_KEY)!==bytes)throw error;}
      if(localStorage.getItem(SAVE_KEY)!==bytes)throw Error('UNCONFIRMED');save=next;saveReadable=true;
    });return true;
  }catch{saveReadable=false;return false;}
}
function owns(id){return window.WeightPlayWallet?.owns?.(`${GAME_ID}:${id}`)===true;}
function cosmetics(){return {kit:owns(save.equippedKit)?save.equippedKit:'classic',stands:owns(save.equippedStands)?save.equippedStands:'classic'};}
function rewardState(stage){try{const raw=JSON.parse(localStorage.getItem('weightplayCastleV1')||'null');return raw?.completions?.[`${GAME_ID}:${stage.id}`]?'collected':raw===null||raw?.version===2?'not-collected':'unknown';}catch{return 'unknown';}}
function stageConfig(){return {count:STAGES.length,gameId:GAME_ID,poster:'/games/meadow-touchdown/assets/cover.webp',background:'/assets/lobby-block-atmosphere.svg',stage:i=>{
  const s=STAGES[i],cleared=save.completedStageIds.includes(s.id),challenge=tacticalChallenge(s.number,null,save);
  const goal=s.special==='pair'?t('pairMissing'):s.special==='gate'?t('wrongGate'):s.special==='relay'?t('relayMissing'):copy().rules[0];
  const challengeDetails=challenge?[`${c('challengeTitle')}: ${c(challenge.goal)}`,challenge.best===null?c('noRecord'):c(challenge.bestKey,{n:challenge.best}),challenge.completed?c('challengeDone'):c('challengeOptional')]:[];
  return {id:s.id,kicker:t('stage',{n:s.number}),title:copy().stageNames[i],subtitle:copy().arcs[s.arc],status:t(cleared?'completed':s.number<=unlockedStage(save)||practiceMode?'unlocked':'locked'),locked:!practiceMode&&s.number>unlockedStage(save),cleared,rewardState:rewardState(s),poster:`/games/meadow-touchdown/assets/arc-${s.arc+1}.webp`,summary:challenge?`${c('challengeTitle')}: ${c(challenge.goal)} ${challenge.best===null?c('noRecord'):c(challenge.bestKey,{n:challenge.best})}`:goal,details:[goal,...challengeDetails,copy().rules[3],s.checkpoint?copy().rules[s.number===30?6:5]:copy().rules[4]]};}};}
function collectionStatus(node,id,owned){window.WeightPlayScreenFrame.setItemCollectionStatus(node,{itemId:id,state:owned?'collected':'not-collected',labels:{collected:t('unlocked'),'not-collected':t('locked'),unknown:'?'}});}
function statusSlot(node){const s=make('span');s.dataset.wpItemCollectionStatus='';for(const type of ['icon','label']){const el=make('span');el.setAttribute(`data-wp-item-collection-${type}`,'');s.append(el);}node.append(s);}
function buildCollections(){
  for(const [i,b] of PLAYBOOKS.entries()){
    const card=make('article','collection-card');card.dataset.book=b.id;
    const img=atlas('icons',i);
    card.append(img,make('strong'),make('p'));statusSlot(card);const button=make('button');card.append(button);
    listen(button,'click',async()=>{if(!save.unlockedPlaybooks.includes(b.id))return;if(await persist(s=>({...s,selectedPlaybook:b.id})))renderCollections();else text($('shopStatus'),t('storage'));});$('bookCards').append(card);
  }
  for(const [i,item] of COSMETICS.entries()){
    const card=make('article','collection-card');card.dataset.cosmetic=item.id;const img=atlas('cosmetics',i);card.append(img,make('strong'),make('p'));statusSlot(card);const button=make('button');card.append(button);listen(button,'click',()=>chooseCosmetic(item));$('cosmeticCards').append(card);
  }
  const classic=make('button','classic-button');classic.dataset.t='classic';listen(classic,'click',async()=>{await persist(s=>({...s,equippedKit:'classic',equippedStands:'classic'}));renderCollections();});$('lockerPanel').insertBefore(classic,$('pennants'));
  for(let i=0;i<6;i++){const card=make('article');card.dataset.pennant=String(i);const img=new Image();img.src=`/games/meadow-touchdown/assets/arc-${i+1}.webp`;img.alt='';img.loading='lazy';card.append(img,make('strong'));statusSlot(card);$('pennants').append(card);}
}
function renderCollections(){
  for(const [i,b] of PLAYBOOKS.entries()){
    const card=$('bookCards').children[i],owned=save.unlockedPlaybooks.includes(b.id),selected=save.selectedPlaybook===b.id;
    text(card.querySelector('strong'),copy().bookNames[i]);text(card.querySelector('p'),copy().bookHints[i]);collectionStatus(card,b.id,owned);card.dataset.selected=String(selected);
    const btn=card.querySelector('button');text(btn,owned?t(selected?'selected':'select'):t('unlockAt',{n:b.unlock}));btn.disabled=!owned||practiceMode;
  }
  for(const [i,item] of COSMETICS.entries()){
    const card=$('cosmeticCards').children[i],owned=owns(item.id),equipped=(i===0?save.equippedKit:save.equippedStands)===item.id&&owned;
    text(card.querySelector('strong'),t(i===0?'kit':'stands'));text(card.querySelector('p'),t('permanent'));collectionStatus(card,item.id,owned);
    text(card.querySelector('button'),owned?t(equipped?'equipped':'equip'):t('buy',{n:item.cost}));card.querySelector('button').disabled=purchaseBusy||practiceMode;card.dataset.selected=String(equipped);
  }
  for(let i=0;i<6;i++){const card=$('pennants').children[i];text(card.querySelector('strong'),copy().arcs[i]);collectionStatus(card,`pennant-${i}`,save.ownedPennants.includes(i));}
  $('lockerPanel').querySelector('.classic-button').disabled=practiceMode;
  const wallet=window.WeightPlayWallet.read();text($('diamondCount'),wallet.available?wallet.diamonds:'—');$('diamondCount').parentElement.setAttribute('aria-label',`${t('balance')}: ${wallet.available?wallet.diamonds:'—'}`);
  text($('medalCount'),`${t('medals')} ${Object.values(save.bestMedalsByStage).flat().filter(Boolean).length} / 90`);
}
async function chooseCosmetic(item){
  if(purchaseBusy||practiceMode)return;
  if(owns(item.id)){if(await persist(s=>({...s,[item.id==='aurora-kit'?'equippedKit':'equippedStands']:item.id})))renderCollections();else text($('shopStatus'),t('storage'));return;}
  purchase=item;text($('purchaseTitle'),t(item.id==='aurora-kit'?'kit':'stands'));text($('purchaseText'),t('purchaseConfirm',{n:item.cost}));openModal('purchaseDialog');
}
async function buy(){
  if(purchaseBusy||practiceMode||!purchase)return;purchaseBusy=true;$('confirmBuy').disabled=true;
  const item=purchase,result=await window.WeightPlayWallet.purchasePermanent(item.sku,item.cost);
  if(result.ok&&owns(item.id)){sound?.play('shop.purchase');await persist(s=>({...s,[item.id==='aurora-kit'?'equippedKit':'equippedStands']:item.id}));text($('shopStatus'),t('unlocked'));}
  else{text($('shopStatus'),t(result.reason==='insufficient'?'insufficient':'storage'));sound?.play('feedback.error');}
  purchaseBusy=false;$('confirmBuy').disabled=false;closeModal();renderCollections();
}
function setTab(next){
  tab=next;for(const id of ['stages','books','locker']){const active=id===next;$(`${id}Panel`).hidden=!active;$(`${id}Panel`).classList.toggle('hidden',!active);$(`${id}Tab`).setAttribute('aria-selected',String(active));$(`${id}Tab`).tabIndex=active?0:-1;}
  if(next==='stages')rail?.refresh(selection);else renderCollections();
}
function setScreen(next){
  clearInput();closeModal(false);cancelAnimationFrame(raf);raf=0;reviewRemaining=0;screen=next;
  $('mainGroup').hidden=next!=='main';$('mainScreen').hidden=next!=='main';$('stageScreen').hidden=next!=='stage';$('battleScreen').hidden=next!=='battle';document.body.dataset.screen=next;
  window.dispatchEvent(new Event('weightplay:stage-sync'));
  frame.activate(next);text($('mainProgress'),`${t('stage',{n:unlockedStage(save)})} / ${STAGES.length}`);
  if(next==='stage'){releaseRenderer();match=null;practiceRun=false;rail.setConfig(stageConfig(),selection);setTab('stages');}
  if(next==='main'){releaseRenderer();match=null;practiceRun=false;}
  announce();
}
function releaseRenderer(){if(!renderer)return;const lost=renderer.lost;renderer.dispose();renderer=null;if(lost){const canvas=$('field');canvas.replaceWith(canvas.cloneNode(false));}sound?.stop();}
function openModal(id){
  if(modal===id)return;clearInput();modalFocus=document.activeElement;modal=id;$(id).hidden=false;
  if(screen==='battle'){$('battleLive').inert=true;frame.activate('battle',{covered:true});}
  if(screen==='stage'){$('stageContent').inert=true;$('stageScreen').querySelector('nav').inert=true;$('stageScreen').querySelector('header').inert=true;}
  $(id).querySelector('button:not(:disabled)')?.focus({preventScroll:true});announce();
}
function closeModal(restore=true){
  if(!modal)return;$(modal).hidden=true;modal=null;clearInput();$('battleLive').inert=false;$('stageContent').inert=false;$('stageScreen').querySelector('nav').inert=false;$('stageScreen').querySelector('header').inert=false;
  if(frame)frame.activate(screen);if(restore){const target=modalFocus?.isConnected&&modalFocus.matches('button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href],[tabindex]:not([tabindex="-1"])')&&modalFocus.getClientRects().length&&!modalFocus.closest('[hidden],[inert]')?modalFocus:screen==='battle'?match?.bookChoiceRequired?playChoices?.focusTarget():$('actionBtn'):null;target?.focus({preventScroll:true});}lastFrame=performance.now();announce();
}
function renderHelp(){
  const m=match,stageKey=stageLesson[m?.stage.number],special=!!m?.stage.special;
  const content=lesson?[c(lesson,lessonValues)]:[c(special&&stageKey?stageKey:m?.phase==='run'?'run':stageKey||'aim')];
  if(!lesson&&m?.phase==='run'){
    if(m.stage.special==='relay'){
      content.push(c('relayGoal',{n:m.leg-1+(m.relayed?1:0)}));
      content.push(m.relayed?c('relayDriveDone',{n:m.leg}):m.relayTarget()?c('relayNow',{name:castName(m.relayTarget().id)}):c('relayFindSupport',{action:t('relay')}));
    }else if(special)content.push(c('run'));
  }
  if(!lesson&&m?.stage.special==='gate')content.push(c(m.gate<0?'openLeft':'openRight'));
  if(!lesson&&m?.stage.special==='pair')content.push(c('pairGoal',{n:m.caught.size}));
  if(!lesson&&m?.bookChoiceRequired)content.push(c('chooseBook'));
  const challenge=tacticalChallenge(m?.stage.number);
  if(challenge)content.push(`${c('challengeTitle')}: ${c(challenge.goal)} ${c('challengeOptional')}`);
  $('helpCopy').replaceChildren(...content.map(value=>make('p','',value)));
  $('helpBasics').hidden=!!lesson;$('helpBasics').open=false;text($('helpBasicsTitle'),c('basicControls'));
  $('helpBasicsCopy').replaceChildren(...[copy().rules[1],copy().rules[2]].map(value=>make('p','',value)));
  $('helpDialog').querySelector('.coach-portrait').src=lesson==='relayNow'&&match?.relayTarget()?PORTRAITS[match.relayTarget().id]:PORTRAITS.orla;
  $('helpDialog').classList.toggle('focused-lesson',!!lesson);
}
function showHelp(){lesson=null;delete $('helpDialog').dataset.seen;renderHelp();openModal('helpDialog');}
function showLesson(key,values={}){
  const seen=`v2-${key}`;if(seenLessons.has(seen)||save.tutorialSeen.includes(seen))return false;
  seenLessons.add(seen);lesson=key;lessonValues=values;$('helpDialog').dataset.seen=seen;renderHelp();
  renderer?.draw(match,visualTime,cosmetics());openModal('helpDialog');return true;
}
function missText(){const miss=match.lastMiss;return c(`miss${miss.kind[0].toUpperCase()}${miss.kind.slice(1)}`,{name:castName(miss.receiver)});}
function interceptionText(){return c(`intercept${match.interception.side}`);}
async function startStage(index,{practice=practiceMode,book=null}={}){
  if(busyStart||!Number.isInteger(index)||index<0||index>=STAGES.length)return;
  if(!practice&&index>=unlockedStage(save))return;busyStart=true;
  try{
    if(practice&&!await LocalPractice.validate())return;
    setScreen('battle');practiceRun=practice;selection=index;booksBefore=[...save.unlockedPlaybooks];trialBook=null;match=new Match(index+1,book&&save.unlockedPlaybooks.includes(book)?book:save.selectedPlaybook);roundSerial++;eventId=0;visualTime=0;celebrationTime=0;resultPending=false;resultSaved=false;resultReward=false;feedbackUntil=0;
    $('fieldCondition').replaceChildren();delete $('fieldCondition').dataset.mode;
    $('interceptionReview').hidden=true;drawInterceptionDiagram($('interceptionDiagram'),null);
    if(!match.availableBooks().includes(match.book))match.book='P1';
    renderer??=new FieldRenderer($('field'),()=>{clearInput();openModal('graphicsDialog');});renderer.reset(match);renderer.resize();renderPlayChoices();renderHud();renderer.draw(match,0,cosmetics());
    if(!stageLesson[index+1]||!showLesson(stageLesson[index+1]))$('actionBtn').focus({preventScroll:true});
    lastFrame=performance.now();accumulator=0;raf=requestAnimationFrame(loop);announce();
  }catch(error){console.error(error);openModal('graphicsDialog');}finally{busyStart=false;}
}
function renderPlayChoices(){
  if(!match||!playChoices)return;
  const allowed=match.availableBooks().filter(id=>save.unlockedPlaybooks.includes(id));
  if(!allowed.includes(match.book)||match.book===match.blockedBook)match.book=allowed.find(id=>id!==match.blockedBook)||'P1';
  playChoices.render({allowed,blocked:match.blockedBook,required:match.bookChoiceRequired,selected:match.book,ready:match.phase==='ready',names:copy().bookNames,hints:copy().bookHints,resting:name=>c('bookResting',{name})});
}
function chooseBook(id){
  if(!match||paused()||!match.selectBook(id))return;
  clearInput();renderPlayChoices();feedbackUntil=match.totalTime+1.35;text($('feedback'),copy().bookHints[PLAYBOOKS.findIndex(b=>b.id===id)]);renderHud();$('actionBtn').focus({preventScroll:true});announce();
}
function renderHud(){
  if(!match)return;const m=match;
  text($('downValue'),`${m.down} / 4`);text($('yardsValue'),Math.max(0,Math.ceil(m.firstDown-m.s-1e-7)));text($('clockValue'),Math.ceil(m.clock));text($('stageCaption'),`${t('stage',{n:m.stage.number})} · ${copy().stageNames[m.stage.number-1]}`);
  const condition=$('fieldCondition');
  if(m.stage.special==='pair'){
    text($('stageCaption'),`${t('stage',{n:m.stage.number})} · ${c('pairGoal',{n:Math.min(2,m.caught.size)})}`);
    if(condition.dataset.mode!=='pair'){condition.dataset.mode='pair';condition.replaceChildren(...CAST.map(id=>{const token=make('span','receiver-token');token.dataset.receiver=id;const img=new Image();img.src=PORTRAITS[id];img.alt='';token.append(img,make('span','',castName(id)),make('b'));return token;}));}
    condition.setAttribute('aria-label',c('pairGoal',{n:Math.min(2,m.caught.size)}));
    for(const token of condition.children){const caught=m.caught.has(token.dataset.receiver);token.dataset.caught=String(caught);text(token.querySelector('b'),caught?'✓':'○');token.title=`${castName(token.dataset.receiver)} · ${c(caught?'received':'pending')}`;token.setAttribute('aria-label',token.title);}
  }else{text(condition,[m.wind?`${m.wind>0?'→':'←'} ${Math.abs(m.wind)}${m.stage.special==='gust'?' ↔':''}`:'',m.stage.special==='gate'?c(m.gate<0?'openLeft':'openRight'):'',m.stage.special==='relay'?c('relayGoal',{n:m.leg-1+(m.relayed?1:0)}):''].filter(Boolean).join(' · '));}
  $('playChoice').hidden=m.phase!=='ready';playChoices?.setReady(m.phase==='ready');
  $('actionBtn').disabled=m.bookChoiceRequired||!reviewRemaining&&!['ready','live','run'].includes(m.phase);text($('actionBtn'),reviewRemaining?c('viewResult'):m.bookChoiceRequired?c('chooseBook'):t(m.phase==='ready'?'snap':m.phase==='live'?'drag':m.phase==='run'?'stop':'throw'));
  $('leftBtn').disabled=m.phase!=='run'||m.lane===0;$('rightBtn').disabled=m.phase!=='run'||m.lane===4;$('relayBtn').disabled=!m.relayTarget();$('relayBtn').style.visibility=m.stage.special==='relay'?'visible':'hidden';
  if(m.bookChoiceRequired)text($('feedback'),c('chooseBook'));
  else if(reviewRemaining)text($('feedback'),interceptionText());
  else if(m.lastMiss&&['ready','dead'].includes(m.phase))text($('feedback'),missText());
  else if(m.totalTime>=feedbackUntil)text($('feedback'),m.phase==='ready'?m.blockedBook?copy().rules[12]:t('ready'):m.phase==='live'?`${t('throw')} ${seconds(Math.round(Math.max(0,m.stage.throwTime-m.elapsed)*10)/10)}`:m.phase==='run'?t('catch'):'');
}
async function commitResult(){
  if(!match?.result?.won||practiceRun||resultPending)return;resultPending=true;const owned=match;
  const ok=await persist(s=>saveWin(s,owned.stage,owned.result));
  if(match!==owned){resultPending=false;return;}resultSaved=ok;
  if(ok){
    const result=await window.WonderAnalytics?.completeStage(owned.stage.id);resultReward=result?.credited===true;
    if(result?.credited||result?.reason==='already-claimed')await persist(s=>({...s,pendingStageCompletions:s.pendingStageCompletions.filter(id=>id!==owned.stage.id)}));
  }
  resultPending=false;renderResult();announce();
}
function renderResult(){
  if(!match?.result)return;const r=match.result;text($('resultStage'),`${t('stage',{n:match.stage.number})} · ${copy().stageNames[match.stage.number-1]}`);text($('resultTitle'),t(r.won?'win':'lose'));text($('resultReason'),match.interception?interceptionText():t(r.reason));
  $('interceptionReview').hidden=!match.interception;text($('interceptionLegend'),`${c('interceptDiagram')} ${c(match.interception?.flight.lateral?'interceptPositions':'interceptRoutes')}`);drawInterceptionDiagram($('interceptionDiagram'),match.interception);
  text($('resultMedals'),r.won?`${t('medals')} ${r.medals.filter(Boolean).length} / 3 · ${seconds(Math.round(r.activeMs/1000))}`:'');
  $('medalDetails').hidden=!r.won;
  for(const [i,key] of ['medalClear','medalEarly','medalClean'].entries())text($('medalDetails').children[i],`${r.medals[i]?'✓':'○'} ${c(key)}`);
  const challenge=tacticalChallenge(match.stage.number,r,save);$('tacticalChallenge').hidden=!r.won||!challenge;
  if(r.won&&challenge){
    text($('challengeTitle'),c('challengeTitle'));text($('challengeGoal'),c(challenge.goal));
    text($('challengeRun'),challenge.current===null?'':c(challenge.currentKey,{n:challenge.current}));
    text($('challengeBest'),challenge.best===null?c('noRecord'):c(challenge.bestKey,{n:challenge.best}));
    text($('challengeStatus'),practiceRun?`${c(challenge.reached?'challengeReached':'challengeOpen')} ${c('practiceRecords')}`:c(challenge.completed?'challengeDone':challenge.reached?'challengeReached':'challengeOpen'));
    $('tacticalChallenge').dataset.completed=String(practiceRun?challenge.reached:challenge.completed);
    if($('challengeArt').dataset.stage!==String(match.stage.number)){
      $('challengeArt').dataset.stage=String(match.stage.number);
      if(match.stage.number===6)$('challengeArt').replaceChildren(atlas('icons',1));
      else $('challengeArt').replaceChildren(...CAST.map(id=>{const image=new Image();image.src=PORTRAITS[id];image.alt=castName(id);return image;}));
    }
  }
  const unlocked=PLAYBOOKS.find(b=>b.unlock===match.stage.number&&resultSaved&&!booksBefore.includes(b.id));
  trialBook=unlocked?.id||null;
  const champion=r.won&&match.stage.number===30,checkpoint=r.won&&match.stage.checkpoint;
  const reward=$('resultMilestone'),rewardKey=unlocked?unlocked.id:checkpoint?`cup-${match.stage.arc}`:'';
  reward.hidden=!rewardKey;
  if(reward.dataset.art!==rewardKey){reward.dataset.art=rewardKey;const art=unlocked?atlas('icons',PLAYBOOKS.indexOf(unlocked)):new Image();if(!unlocked){art.src=`/games/meadow-touchdown/assets/arc-${match.stage.arc+1}.webp`;art.alt='';}art.classList.add('milestone-art');$('milestoneArt').replaceChildren(art);}
  if(unlocked&&!$('milestoneArt').querySelector('.milestone-pennant')){const pennant=new Image();pennant.className='milestone-pennant';pennant.src=`/games/meadow-touchdown/assets/arc-${match.stage.arc+1}.webp`;$('milestoneArt').append(pennant);}
  const pennant=$('milestoneArt').querySelector('.milestone-pennant');if(pennant)pennant.alt=copy().arcs[match.stage.arc];
  text($('milestoneTitle'),unlocked?`${c('newPlay')} · ${copy().bookNames[PLAYBOOKS.indexOf(unlocked)]}`:champion?copy().arcs[5]:copy().arcs[match.stage.arc]);
  text($('milestoneCopy'),unlocked?`${copy().bookHints[PLAYBOOKS.indexOf(unlocked)]} ${c('tryNext',{name:copy().bookNames[PLAYBOOKS.indexOf(unlocked)]})}`:champion?c('champion'):t('pennants'));
  if(champion)text($('resultTitle'),`${copy().arcs[5]} · ${t('win')}`);
  text($('resultSave'),r.won&&!practiceRun&&!resultPending?t(resultSaved?'saved':'saveError'):'');$('retrySave').hidden=!r.won||practiceRun||resultSaved||resultPending;$('retrySave').disabled=resultPending;
  $('resultNext').disabled=!r.won||selection>=29||(!practiceRun&&(!resultSaved||unlockedStage(save)<=selection+1));
  window.ShowResultGet(GAME_ID,resultReward);if(resultReward)window.WeightPlayCastle?.dismissRewardNotice?.(GAME_ID);
}
function settle(){reviewRemaining=0;openModal('resultPanel');if(match.result.won&&!practiceRun)commitResult();renderResult();announce();}
function action(){if(screen!=='battle'||paused()||!match)return;window.WeightPlayAudio?.unlock();if(reviewRemaining){settle();}else if(match.phase==='ready'){match.snap();}else if(match.phase==='live'){match.pass();}else if(match.phase==='run'){match.stop();}renderHud();announce();}
function processEvents(){
  for(const event of match.events){if(event.id<=eventId)continue;eventId=event.id;if(audio[event.type])sound?.play(audio[event.type]);if(COPY.en[event.type]){text($('feedback'),event.type==='incomplete'&&match.lastMiss?missText():t(event.type));feedbackUntil=match.totalTime+1.35;}
    if(event.type==='catch'&&match.stage.number===1&&!match.result)showLesson('run');
  }
  if(match?.stage.special==='relay'&&match.relayTarget()&&!modal)showLesson('relayNow',{name:castName(match.relayTarget().id)});
}
function loop(now){
  raf=0;if(disposed||screen!=='battle'||!match)return;const delta=Math.min(.08,Math.max(0,(now-lastFrame)/1000));lastFrame=now;
  if(!paused()&&!match.result){accumulator+=delta;while(accumulator>=DT){
    if(match.phase==='live'){const dx=(keys.has('ArrowRight')?1:0)-(keys.has('ArrowLeft')?1:0),dy=(keys.has('ArrowUp')?1:0)-(keys.has('ArrowDown')?1:0);if(dx||dy)match.setAim(match.aim.x+dx*7*DT,match.aim.y+dy*7*DT);}
    const phase=match.phase;match.step(DT);visualTime+=DT;accumulator-=DT;if(match.phase==='ready'&&phase!=='ready'){renderPlayChoices();if(match.bookChoiceRequired)playChoices?.focusTarget()?.focus({preventScroll:true});}if(phase!==match.phase)announce();processEvents();if(match.result){if(match.interception){reviewRemaining=.95;clearInput();announce();}else settle();accumulator=0;break;}if(paused()){accumulator=0;break;}
  }}else accumulator=0;
  if(reviewRemaining&&!paused()){reviewRemaining=Math.max(0,reviewRemaining-delta);if(!reviewRemaining)settle();}
  const celebrating=match.result&&!reviewRemaining&&!document.hidden&&celebrationTime<1.3;
  if(celebrating){const step=Math.min(delta,1.3-celebrationTime);visualTime+=step;celebrationTime+=step;}
  renderHud();if(!paused()||celebrating)renderer?.draw(match,visualTime,cosmetics());raf=requestAnimationFrame(loop);
}
function applyLocale(){
  const candidate=window.WonderI18n?.actualLocale?.()||'en';locale=COPY[candidate]?candidate:'en';document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';
  for(const node of document.querySelectorAll('[data-t]'))if(typeof COPY[locale][node.dataset.t]==='string')text(node,t(node.dataset.t));
  for(const node of document.querySelectorAll('[data-aria]'))node.setAttribute('aria-label',t(node.dataset.aria));
  $('gameGuide').setAttribute('aria-label',t('guideAria'));
  $('gameGuide').querySelector('.game-info-tags').replaceChildren(...copy().guideTags.map(value=>make('span','',value)));
  const title=window.WEIGHTPLAY_GAME_TITLES?.[GAME_ID]?.[locale];if(title){for(const node of document.querySelectorAll('[data-wp-game-title]'))text(node,title);document.title=`${title} | WeightPlay`;}
  $('poster').alt=t('posterAlt');text($('mainProgress'),`${t('stage',{n:unlockedStage(save)})} / 30`);renderCollections();rail?.setConfig(stageConfig(),selection);if(match){renderPlayChoices();renderHud();renderResult();}if(modal==='helpDialog')renderHelp();frame?.refresh();
}
async function boot(){
  buildCollections();playChoices=createPlaybookChoices($('playOptions'),{onChoose:chooseBook,signal:abort.signal});frame=window.WeightPlayScreenFrame.mount({root:$('gameFrame'),playUI:true,scenes:{main:{root:$('mainScreen'),header:$('mainScreen').querySelector('header'),content:$('mainContent')},stage:{root:$('stageScreen'),header:$('stageScreen').querySelector('header'),content:$('stageContent')},battle:{root:$('battleScreen'),header:$('battleScreen').querySelector('header'),content:$('battleContent'),headerInfo:$('battleInfo')}}});
  const group=window.WeightPlayScreenFrame.createGroup();for(const node of [...$('battleInfo').children])group.add(node);frame.battleTopUI.add(group);
  frame.commonDownButton.add($('booksTab')).add($('stagesTab')).add($('lockerTab'));frame.activate('main');
  rail=window.WeightPlayPlayUI.mountStage({page:$('stagesPanel'),rail:$('stageRail'),config:stageConfig(),selected:selection,onSelect:i=>selection=i,onStart:i=>startStage(i),isActive:()=>screen==='stage'&&tab==='stages'&&!modal});
  listen($('startBtn'),'click',()=>setScreen('stage'));listen($('stageBack'),'click',()=>setScreen('main'));
  for(const id of ['stages','books','locker'])listen($(`${id}Tab`),'click',()=>setTab(id));
  for(const id of ['books','stages','locker'])listen($(`${id}Tab`),'keydown',event=>{
    const ids=['books','stages','locker'],index=ids.indexOf(id),direction=document.documentElement.dir==='rtl'?-1:1;
    let next;if(event.key==='Home')next=0;else if(event.key==='End')next=2;else if(event.key==='ArrowRight')next=(index+direction+3)%3;else if(event.key==='ArrowLeft')next=(index-direction+3)%3;else return;
    event.preventDefault();event.stopPropagation();setTab(ids[next]);$(`${ids[next]}Tab`).focus({preventScroll:true});
  });
  listen($('battleBack'),'click',()=>{if(!match||match.result||!match.snapCount){setScreen('stage');return;}text($('leaveCopy'),copy().rules[11].replace('{stage}',copy().stageNames[selection]));openModal('leaveDialog');});
  listen($('helpBtn'),'click',showHelp);listen($('helpClose'),'click',async()=>{const seen=$('helpDialog').dataset.seen;closeModal();if(seen&&!practiceRun){await persist(s=>({...s,tutorialSeen:[...s.tutorialSeen,seen]}));delete $('helpDialog').dataset.seen;}});
  listen($('continueBtn'),'click',()=>closeModal());listen($('leaveBtn'),'click',()=>setScreen('stage'));
  listen($('resultStages'),'click',()=>setScreen('stage'));listen($('resultReplay'),'click',()=>{window.WonderAnalytics?.game?.markRestart();startStage(selection,{practice:practiceRun,book:match?.book});});listen($('resultNext'),'click',()=>{if(!$('resultNext').disabled)startStage(selection+1,{practice:practiceRun,book:trialBook});});listen($('retrySave'),'click',commitResult);
  listen($('leftBtn'),'click',()=>{if(!paused())match?.changeLane(-1);});listen($('rightBtn'),'click',()=>{if(!paused())match?.changeLane(1);});listen($('relayBtn'),'click',()=>{if(!paused())match?.lateral();});
  listen($('actionBtn'),'click',e=>{if(e.detail===0)action();});
  listen($('actionBtn'),'pointerdown',e=>{if(e.button!==0||paused()||!match)return;e.preventDefault();if(reviewRemaining||match.phase==='ready'||match.phase==='run'){action();return;}if(match.phase!=='live')return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,aim:{...match.aim},moved:0};$('actionBtn').setPointerCapture(e.pointerId);$('actionBtn').dataset.dragging='true';});
  listen($('actionBtn'),'pointermove',e=>{if(!drag||e.pointerId!==drag.id||paused())return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.moved=Math.max(drag.moved,Math.hypot(dx,dy));match.setAim(drag.aim.x+dx*.06,drag.aim.y-dy*.12);});
  listen($('actionBtn'),'pointerup',e=>{if(!drag||e.pointerId!==drag.id)return;const moved=drag.moved;clearInput();if(moved>=8&&!paused())match.pass();});
  for(const name of ['pointercancel','lostpointercapture'])listen($('actionBtn'),name,()=>clearInput());
  listen(document,'keydown',e=>{
    if(e.key==='Tab'&&modal){const buttons=[...$(modal).querySelectorAll('button:not(:disabled),select,summary')].filter(n=>n.getClientRects().length&&!n.closest('[hidden]')),first=buttons[0],last=buttons.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}return;}
    if(e.key==='Escape'){if(modal&&modal!=='resultPanel'&&modal!=='graphicsDialog'){e.preventDefault();closeModal();}else if(screen==='battle'&&!paused()&&!match?.result){e.preventDefault();text($('leaveCopy'),copy().rules[11].replace('{stage}',copy().stageNames[selection]));openModal('leaveDialog');}return;}
    if(screen!=='battle'||paused()||!match||e.target.closest('select,input,textarea,#playChoice'))return;
    if([' ','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','a','d','A','D','r','R'].includes(e.key)){e.preventDefault();if(e.repeat)return;keys.add(e.key);if(e.key===' ')action();else if(match.phase==='run'){if(['ArrowLeft','a','A'].includes(e.key))match.changeLane(-1);if(['ArrowRight','d','D'].includes(e.key))match.changeLane(1);if(['r','R'].includes(e.key))match.lateral();}}
  });listen(document,'keyup',e=>keys.delete(e.key));
  listen(document,'visibilitychange',()=>{clearInput();lastFrame=performance.now();if(document.hidden)sound?.stop();});listen(window,'blur',clearInput);
  listen(window,'weightplay:interaction-state',()=>{if(paused())clearInput();});listen(window,'wonder:locale-change',applyLocale);listen(window,'weightplay:wallet-change',renderCollections);
  listen(window,'storage',e=>{if(e.key===SAVE_KEY&&screen!=='battle'){try{save=readSave();applyLocale();}catch{saveReadable=false;}}if(e.key==='weightplayWallet')renderCollections();});
  listen($('cancelBuy'),'click',()=>{if(!purchaseBusy)closeModal();});listen($('confirmBuy'),'click',buy);listen($('reloadBtn'),'click',()=>location.reload());listen($('graphicsBack'),'click',()=>setScreen('stage'));
  listen(window,'pagehide',e=>{clearInput();cancelAnimationFrame(raf);raf=0;sound?.stop();if(!e.persisted){disposed=true;renderer?.dispose();rail.destroy();frame.destroy();sound?.dispose();abort.abort();}});listen(window,'pageshow',e=>{if(e.persisted&&screen==='battle'){lastFrame=performance.now();raf=requestAnimationFrame(loop);}});
  applyLocale();setTab('stages');window.WeightPlayGameEntryLoader.begin(1);await $('poster').decode();window.WeightPlayGameEntryLoader.assetProgress(1,1);$('startBtn').disabled=false;window.WeightPlayGameEntryLoader.ready();
  window.WeightPlayAudio?.preload([...new Set(Object.values(audio))]);
  await LocalPractice.register({gameId:GAME_ID,stageIds:STAGES.map(s=>s.id),enable:enabled=>{practiceMode=enabled;rail.setConfig(stageConfig(),selection);renderCollections();},startStage:id=>startStage(STAGES.findIndex(s=>s.id===id),{practice:true})});
  for(const id of practiceMode?[]:[...save.pendingStageCompletions]){
    const receipt=await window.WonderAnalytics?.completeStage(id);
    if(receipt?.credited||receipt?.reason==='already-claimed')await persist(s=>({...s,pendingStageCompletions:s.pendingStageCompletions.filter(value=>value!==id)}));
  }
  // Read-only engineering observations; no state mutation or alternate gameplay path.
  window.meadowTouchdownSnapshot=()=>({screen,tab,modal,stage:match?.stage.number,phase:match?.phase,reviewRemaining,interception:match?.interception?structuredClone(match.interception):null,clock:match?.clock,elapsed:match?.elapsed,spot:match?.s,aim:match?{...match.aim}:null,runner:match?.runner?{x:match.runner.x,y:match.runner.y,id:match.runner.id}:null,defenders:match?.defenders.map(d=>({x:d.x,y:d.y,kind:d.kind})),book:match?.book,result:match?.result?structuredClone(match.result):null,paused:paused(),practice:practiceRun,saveReadable,unlocked:unlockedStage(save),render:renderer?.stats()});
}
boot().catch(error=>{console.error(error);window.WeightPlayGameEntryLoader?.fail(undefined,()=>location.reload());});
