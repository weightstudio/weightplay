import {clone,newState,step,solve,groupAt,actions,powerOf,heroPower} from './core.mjs';
import {cameraText} from './camera-copy.mjs';
import {LEVELS} from './levels.mjs';
import {COPY,LOCALES,SEGMENTS,NATIVE,text} from './locales.mjs';
import {NAMES} from './stage-copy.mjs';
import {DETAILS} from './guide.mjs';
import {upgradeText,stageLesson} from './upgrade-copy.mjs';
import {normalize,award,SAVE_KEY} from './save.mjs';
import {masteryFeedback} from './result-copy.mjs';
import {LocalPractice} from '../../src/game-local-practice.mjs';
const $=id=>document.getElementById(id);
const GAME_ID='animal-crownfall',FIRST_CLEAR_BLOCK_KEY=`${GAME_ID}:first-completion`;
const tracking=()=>practiceMode||practiceRun?null:window.WonderAnalytics?.game;
function hasFirstClearBlock(){try{if(window.WeightPlayCastle?.read?.()?.completions?.[FIRST_CLEAR_BLOCK_KEY])return true;}catch{}try{return !!JSON.parse(localStorage.getItem('weightplayCastleV1')||'null')?.completions?.[FIRST_CLEAR_BLOCK_KEY];}catch{return false;}}
$('stage').classList.add('wp-stage-art-shell');
const loading=document.createElement('div');loading.id='loadingPanel';loading.className='loading-panel';loading.hidden=true;loading.setAttribute('role','status');const loadingCard=document.createElement('div');loadingCard.className='loading-card';const loadingText=document.createElement('strong');loadingCard.append(loadingText);loading.append(loadingCard);$('battle').append(loading);
let locale=LOCALES.includes(document.documentElement.lang)?document.documentElement.lang:'en';
const segment=location.pathname.split('/')[1];if(SEGMENTS.includes(segment))locale=LOCALES[SEGMENTS.indexOf(segment)];
else {try{const saved=localStorage.getItem('weightPlayLocale');if(LOCALES.includes(saved))locale=saved;}catch{}}
let save,storageOK=true;try{save=normalize(JSON.parse(localStorage.getItem(SAVE_KEY)||'null'));}catch{save=normalize(null);storageOK=false;}
// Discard legacy practice resumes without touching the stored campaign record.
if(save.run?.practice)save.run=null;
let stageController=null,stageCenterFrame=0,practiceMode=false,practiceRun=false;
let screen='main',state=null,history=[],moveHistory=[],usedHint=false,busy=false,paused=false,renderer=null,modalKind='',hintLevel=0,hintCache=null,pending=null,pendingRoute='',settlingRoute='',transactionBase=null,session=0;
const t=(key,args)=>key==='title'?(window.WEIGHTPLAY_GAME_TITLES?.['animal-crownfall']?.[locale]||text(locale,key,args)):text(locale,key,args);
const stageName=id=>NAMES[locale][id-1];
const u=(key,args)=>upgradeText(locale,key,args);
const idleFeedback=()=>state?.calculation?equation(state.calculation):'';
const equation=c=>c ? `${c.before} ${c.operator} ${c.amount} = ${c.after}` : u('calculate');
const sound=kind=>{if(document.hidden||window.WeightPlayAudio?.isMuted?.())return;window.WeightPlayAudio?.play?.((({lose: "feedback.error",tap: "ui.click"})[kind]) || (kind));};
function contactSound(event){
 if(event.type==='fail')return 'result.lose';
 if(event.type==='win')return 'result.win';
 if(event.type==='pickup')return ['sword','power','multiply'].includes(event.kind)?'reward.upgrade':'reward.collect';
 if(event.type==='phase')return 'alert.boss';
 if(event.type==='hit')return event.boss?'combat.critical':event.state.hero.armed?'weapon.sword.hit':'combat.strike';
 return 'puzzle.clear';
}
// Practice runs never overwrite campaign resume, progress, or reward state.
const persist=()=>{if(practiceMode||practiceRun)return;try{localStorage.setItem(SAVE_KEY,JSON.stringify(save));storageOK=true;}catch{storageOK=false;}};
const runSave=()=>{if(busy||practiceMode||practiceRun)return;if(state?.status==='playing')save.run={level:state.level,actions:clone(moveHistory),usedHint,campaign:5};else if(state)save.run=null;persist();};
function translate(){document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';document.title=`${t('title')} | WeightPlay`;$('locale').value=locale;document.querySelectorAll('[data-t]').forEach(n=>n.textContent=t(n.dataset.t));document.querySelectorAll('[data-aria]').forEach(n=>n.setAttribute('aria-label',t(n.dataset.aria)));document.querySelectorAll('[data-guide]').forEach(n=>n.textContent=DETAILS[locale][Number(n.dataset.guide)]);document.querySelectorAll('[data-related-game]').forEach(card=>{const id=card.dataset.relatedGame;card.href=`/${SEGMENTS[LOCALES.indexOf(locale)]}/games/${id}/`;card.querySelector('[data-related-title]').textContent=window.WEIGHTPLAY_GAME_TITLES[id][locale];});document.querySelector('meta[name="description"]').content=t('goal');updateMain();if(screen==='stage')renderStages();frame?.refresh();}
for(let i=0;i<LOCALES.length;i++)$('locale').add(new Option(NATIVE[i],LOCALES[i]));
window.WonderI18n?.setLocale?.(locale,{navigate:false,dispatch:false});
let frame=window.WeightPlayScreenFrame.mount({root:$('gameFrame'),localeSelect:$('locale'),scenes:{main:{root:$('main'),header:$('main').querySelector('header'),content:$('hero')},stage:{root:$('stage'),header:$('stage').querySelector('header'),content:$('stageContent')},battle:{root:$('battle'),header:$('battle').querySelector('header'),content:$('battleContent'),headerInfo:$('battleInfo')}}});
document.querySelector('#battle .wp-frame-popover').append($('reduced').closest('.motion'));
$('locale').addEventListener('change',()=>{locale=$('locale').value;try{localStorage.setItem('weightPlayLocale',locale);}catch{}window.WonderI18n?.setLocale?.(locale,{navigate:false});translate();});
// Keep the shared settings component on this game's selected dictionary.
window.addEventListener('wonder:locale-change',()=>{const next=window.WonderI18n?.actualLocale?.();if(LOCALES.includes(next))locale=next;translate();});
function updateMain(){const cleared=Object.values(save.badges).filter(v=>v[0]).length;$('progress').textContent=`${t('clearBadge')} ${cleared} / 30`;$('resumeSlot').hidden=!save.run;$('resume').textContent=t(save.run?.practice?'resumePractice':'resume');}
function fitScene(){if(screen==='main')return;const root=$('gameFrame'),land=innerWidth/innerHeight>=1.45;const w=root.clientWidth,h=root.clientHeight;const scale=Math.min(w/(land?760:390),h/(land?(screen==='stage'?360:278):620));const el=$(screen);el.style.width=`${w/scale}px`;el.style.height=`${h/scale}px`;el.style.transform=`scale(${scale})`;el.dataset.canvasScale=scale;stageController?.center();renderer?.resize();}
window.addEventListener('resize',fitScene);window.visualViewport?.addEventListener('resize',fitScene);
function changeScreen(next){if(next!=='stage'){cancelAnimationFrame(stageCenterFrame);if(stageController){stageController.destroy();$('stageRail').replaceChildren();stageController=null;}}for(const id of ['stage','battle']){const node=$(id),active=id===next;node.toggleAttribute('data-wp-logical-stage-canvas',active&&id==='stage');if(!active){for(const key of ['width','height','transform'])node.style.removeProperty(key);delete node.dataset.canvasScale;}}screen=next;tracking()?.screen(next,{node:$(next),locale});document.body.dataset.screen=next;for(const id of ['main','stage','battle'])$(id).hidden=id!==next;const guide=$('mainGuide')||document.querySelector('#gameFrame > .game-page-info');if(guide)guide.hidden=next!=='main';$('generalReserve').hidden=true;frame.activate(next);fitScene();if(next!=='battle'){renderer?.destroy();renderer=null;$('arena').querySelectorAll('.cell-access').forEach(n=>n.remove());}if(next==='main')updateMain();if(next==='stage')renderStages();window.scrollTo(0,0);}
function renderStages(){
 const rail=$('stageRail');$('stageSummary').textContent=`${t('clearBadge')} ${Object.values(save.badges).filter(v=>v[0]).length} / ${LEVELS.length}`;
 if(!stageController)stageController=window.WeightPlayStageV6.install(rail,{total:LEVELS.length,poolSize:9,initialIndex:()=>save.unlocked-1,
 bind(card,index){const level=LEVELS[index],locked=!practiceMode&&level.id>save.unlocked;card.classList.add('stage-card');card.dataset.stage=String(level.id);card.setAttribute('role','listitem');card.setAttribute('aria-disabled',String(locked));if(!card.children.length)card.innerHTML='<span class="number"></span><strong></strong><small></small><small></small>';card.children[0].textContent=String(level.id).padStart(2,'0');card.children[1].textContent=stageName(level.id);card.children[2].textContent=level.id%5===0?t('boss'):t('goal');card.children[3].textContent=practiceMode?t('practice'):locked?t('locked'):(save.badges[level.id]||[false,false,false]).map(v=>v?'★':'☆').join(' ');},
 activate:index=>{if(practiceMode||index<save.unlocked)startLevel(index+1,null,practiceMode);}});
 else stageController.refresh();
 cancelAnimationFrame(stageCenterFrame);const controller=stageController;stageCenterFrame=requestAnimationFrame(()=>{if(screen==='stage'&&stageController===controller)controller.center(save.unlocked-1);});
}
function label(a,kind,s){if(kind==='hero')return `⚔ ${heroPower(s)}`;if(kind==='enemy'){const p=powerOf(s,a),bonus=p-a.power;return `${a.boss?'♛ ':s.required.includes(a.id)?'◆ ':''}${a.shield?'▣ ':''}${a.direction==='left'?'→ ':a.direction==='right'?'← ':''}${p}${bonus?` (+${bonus})`:''}${a.buff?' ⚑':''}`;}if(['sword','power','multiply'].includes(a.kind))return `${u(a.kind)} ${a.kind==='multiply'?`×${a.amount}`:`+${a.amount||0}`}`;return a.kind==='crown'?'♛':`${({key:'◆',rune:'◇',seal:'●'})[a.kind]}${a.link&&a.kind!=='rune'?a.link:''}`;}
function reason(s){if(!s.reason)return t('lost');const code={power:'powerFail',shield:'shieldFail'}[s.reason.code]||s.reason.code;return t(code,s.reason);}
function updateUI(){if(!state)return;$('arena').setAttribute('aria-busy',String(busy));$('power').textContent=heroPower(state);$('calculation').textContent=equation(state.calculation);$('choice').hidden=!pending||busy;$('moves').textContent=state.moves;$('stageNumber').textContent=state.level;$('objective').textContent=stageLesson(locale,state.level);$('legend').textContent=state.sealOrder.length?`● ${state.seals.join('→')||'—'} / ${state.sealOrder.join('→')}`:state.required.length?`◆ ${state.required.filter(id=>state.killed.includes(id)).length}/${state.required.length}`:'';$('undo').disabled=busy||!history.length;$('retry').disabled=busy;$('hint').disabled=busy||state.status!=='playing';$('reduced').checked=save.reduced;if(state.status!=='playing'&&$('feedback').textContent===t('busy'))$('feedback').textContent='';if(!storageOK&&!pendingRoute&&!settlingRoute)$('feedback').textContent=t('storage');}
function draw(highlight=[],preserve=false){renderer?.show(state,highlight,{preserve});$('arena').querySelectorAll('.cell-access').forEach(n=>n.remove());if(state.status==='playing')for(const [x,y] of actions(state)){const b=document.createElement('button');b.className='cell-access';b.textContent=`${t('block')} ${t('row')} ${y+1}, ${t('column')} ${x+1}`;b.addEventListener('click',()=>choose(x,y));$('arena').append(b);}updateUI();}
async function startLevel(id,resume=null,practice=practiceMode){if((practice===true||resume?.practice===true)&&!await LocalPractice.validate())return;practiceRun=LocalPractice.enabled&&(resume?resume.practice===true:practice===true);if(resume?.practice&&!practiceRun)return;if(!LEVELS[id-1]||(!practiceRun&&id>save.unlocked))return;session++;if(!practiceRun)tracking()?.start({roundKey:session,resumed:!!resume});loadingText.textContent=t('loading');loading.hidden=false;const token=session;busy=true;transactionBase=null;paused=false;pending=null;pendingRoute='';settlingRoute='';hintCache=null;hintLevel=0;modalKind='';$('modal').hidden=true;$('battleContent').inert=false;history=[];moveHistory=[];usedHint=!!resume?.usedHint;state=newState(LEVELS[id-1]);if(resume)for(const a of resume.actions){history.push(clone(state));state=step(state,...a,{trace:false}).state;moveHistory.push(a);}renderer?.destroy();renderer=null;changeScreen('battle');updateUI();$('feedback').textContent=idleFeedback();try{const {CrownScene}=await import('./render.mjs');if(token!==session)return;renderer=new CrownScene($('arena'),{navigationHost:$('mapControls'),label,onPick:choose,isBusy:()=>busy||paused,isPaused:()=>paused,cameraText:key=>cameraText(locale,key),onError:renderFailure,onContact:event=>{if(['hit','fail','pickup','win','clear','phase'].includes(event.type))sound(contactSound(event));if(event.type==='hit'||event.type==='fail'||event.type==='pickup'){$('power').textContent=heroPower(event.state);$('calculation').textContent=equation(event.state.calculation);if(event.state.calculation&&!settlingRoute)$('feedback').textContent=equation(event.state.calculation);}},reduced:()=>save.reduced||matchMedia('(prefers-reduced-motion: reduce)').matches});busy=false;loading.hidden=true;draw();runSave();window.dispatchEvent(new CustomEvent('weightplay:battle-open',{detail:{gameId:'animal-crownfall'}}));}catch(error){console.error(error);renderFailure();}}
function renderFailure(){loading.hidden=true;session++;renderer?.stop();if(transactionBase){state=clone(transactionBase);history.pop();moveHistory.pop();transactionBase=null;}pending=null;pendingRoute='';settlingRoute='';busy=false;paused=true;$('feedback').textContent='';runSave();showModal('error',t('loadFail'),'',[[t('retry'),()=>startLevel(state.level,null,practiceRun)],[t('stages'),()=>exitBattle()]]);}
function showModal(kind,title,body,buttons,gotBlock=false){modalKind=kind;tracking()?.pause('modal');const modal=$('modal'),card=modal.querySelector('.modal-card');modal.dataset.kind=kind;modal.setAttribute('data-wp-result-screen','');card?.setAttribute('data-wp-result-card','');paused=true;$('modalTitle').textContent=title;$('modalText').textContent=body;$('badges').textContent='';$('modalActions').replaceChildren();for(const [label,fn,disabled=false] of buttons){const b=document.createElement('button');b.textContent=label;b.disabled=disabled;b.dataset.wpFrameAction='secondary';b.addEventListener('click',fn);$('modalActions').append(b);}modal.hidden=false;window.ShowResultGet?.(GAME_ID,kind==='result'&&gotBlock);if(kind!=='result'){modal.removeAttribute('data-wp-result-screen');card?.removeAttribute('data-wp-result-card');}$('battleContent').inert=true;frame.activate('battle',{covered:true});$('modalActions').querySelector('button')?.focus();}
function closeModal(){tracking()?.resume('modal');const restoreBattleFocus=modalKind==='leave';window.ShowResultGet?.(GAME_ID,false);$('modal').removeAttribute('data-wp-result-screen');$('modal .modal-card')?.removeAttribute('data-wp-result-card');paused=false;modalKind='';$('modal').hidden=true;$('battleContent').inert=false;frame.activate('battle');if(restoreBattleFocus)$('battleBack').focus();}
function choose(x,y){
 if(busy||paused||state?.status!=='playing')return;const g=groupAt(state,x,y);if(!g.length)return;
 if(pending&&g.some(([a,b])=>a===pending[0]&&b===pending[1])){commitChoice();return;}
 pending=[x,y];renderer?.show(state,g);const preview=step(state,x,y);
 const route=preview.events.filter(e=>['approach','pickup','win'].includes(e.type)).map(e=>e.type==='approach'?`⚔ ${e.enemy}`:e.type==='win'?'♛':e.calculation?`${e.calculation.operator}${e.amount}`:u(e.kind));
 pendingRoute=route.join(' → ')||u('routeSafe');$('feedback').textContent=pendingRoute;
 $('feedback').dataset.risk='false';$('confirmMove').textContent=t('confirm');$('cancelMove').textContent=t('cancel');updateUI();
}
function commitChoice(){if(!pending||busy||paused)return;const [x,y]=pending;pending=null;settlingRoute=pendingRoute;pendingRoute='';playMove(x,y);}
$('confirmMove').addEventListener('click',commitChoice);
 $('cancelMove').addEventListener('click',()=>{pending=null;pendingRoute='';draw();$('feedback').textContent=idleFeedback();});
async function playMove(x,y){
 if(!practiceRun)tracking()?.activity();const before=clone(state),result=step(state,x,y);
 if(!result.valid){busy=false;pendingRoute='';settlingRoute='';$('feedback').textContent=idleFeedback();updateUI();return;}
 busy=true;transactionBase=before;hintCache=null;hintLevel=0;history.push(before);moveHistory.push([x,y]);const token=session;$('feedback').textContent=settlingRoute?`${t('busy')} · ${settlingRoute}`:t('busy');updateUI();await renderer?.focusHero();if(token!==session)return;
 let previous=before;for(const event of result.events){if(token!==session)return;await renderer?.animate(event,previous,()=>paused);if(token!==session)return;state=clone(event.state);renderer?.show(state,[],{preserve:true});if((event.type==='hit'||event.type==='phase')&&!settlingRoute)$('feedback').textContent=equation(state.calculation);previous=state;updateUI();}
 state=result.state;busy=false;settlingRoute='';transactionBase=null;pending=null;if(state.status!=='playing')$('feedback').textContent='';draw([],true);runSave();
 const rewardWasClaimed=!practiceRun&&state.status==='won'&&hasFirstClearBlock();
 if(state.status!=='playing'&&!practiceRun)tracking()?.end(state.status==='won'?'win':'lose');
 const blockGranted=!practiceRun&&state.status==='won'&&!rewardWasClaimed&&hasFirstClearBlock();
 // Result owns the committed cube feedback; its actions must be usable immediately.
 if(blockGranted)window.WeightPlayCastle?.dismissRewardNotice?.(GAME_ID);
 if(state.status==='won'){
  const par=solve(newState(LEVELS[state.level-1])).moves.length,previousBest=save.best[state.level];
  if(!practiceRun){award(save,state.level,state.moves,usedHint,par);persist();}
  const performance=`${t('moves')}: ${state.moves}${practiceRun?'':` · ${t('best')}: ${save.best[state.level]}`}`;
  const goal=masteryFeedback(locale,{moves:state.moves,previousBest,par,usedHint,practice:practiceRun});
  const resultText=`${stageName(state.level)} · ${performance}. ${goal}${practiceRun?` · ${t('practiceResult')}`:''}`;
  showModal('result',t('won'),resultText,[[t('stages'),exitBattle],[t('next'),()=>startLevel(state.level+1,null,practiceRun),state.level>=30],[t('retry'),()=>startLevel(state.level,null,practiceRun)]],blockGranted);
  if(!practiceRun)$('badges').textContent=[t('clearBadge'),t('hintBadge'),t('parBadge')].map((name,i)=>`${save.badges[state.level][i]?'★':'☆'} ${name}`).join(' · ');
 }else if(state.status==='lost')showModal('result',t('lost'),`${reason(state)}${practiceRun?` · ${t('practiceResult')}`:''}`,[[t('stages'),exitBattle],[t('next'),()=>startLevel(state.level+1,null,practiceRun),true],[t('retry'),()=>startLevel(state.level,null,practiceRun)]],false);
 else $('feedback').textContent=idleFeedback();
}
function undo(){if(busy||!history.length)return;pending=null;pendingRoute='';closeModal();state=history.pop();moveHistory.pop();hintCache=null;hintLevel=0;draw();runSave();$('feedback').textContent=idleFeedback();}
function exitBattle(){if(!practiceRun)tracking()?.end('abandon');loading.hidden=true;session++;renderer?.stop();if(transactionBase){state=clone(transactionBase);history.pop();moveHistory.pop();transactionBase=null;}busy=false;pending=null;pendingRoute='';settlingRoute='';paused=false;$('modal').hidden=true;$('battleContent').inert=false;runSave();if(practiceRun)practiceMode=true;changeScreen('stage');}
$('start').addEventListener('click',()=>changeScreen('stage'));
$('resume').addEventListener('click',()=>{const run=clone(save.run);startLevel(run.level,run);});$('stageBack').addEventListener('click',()=>changeScreen('main'));
$('battleBack').addEventListener('click',()=>{showModal('leave',t('leave'),t('leaveText'),[[t('continue'),closeModal],[t('stages'),exitBattle]]);});
$('undo').addEventListener('click',undo);$('retry').addEventListener('click',()=>startLevel(state.level,null,practiceRun));$('reduced').addEventListener('change',()=>{save.reduced=$('reduced').checked;persist();});
$('hint').addEventListener('click',()=>{if(busy||state.status!=='playing')return;pending=null;pendingRoute='';updateUI();usedHint=true;runSave();hintCache??=solve(state);hintLevel++;if(hintCache.status!=='solved'){$('feedback').textContent=t(hintCache.status==='dead'?'dead':'noSolution');return;}const [x,y]=hintCache.moves[0],preview=step(state,x,y);renderer.show(state,groupAt(state,x,y));if(hintLevel===1){const target=preview.events.find(e=>e.type==='approach');$('feedback').textContent=target?t('hintTarget',{target:`${t('guard')} ${powerOf(state,state.enemies.find(e=>e.id===target.target))}`}):t('hintRoute');}else if(hintLevel===2)$('feedback').textContent=t('hintRoute');else $('feedback').textContent=t('hintMove',{r:y+1,c:x+1});});
$('modal').addEventListener('keydown',e=>{if(e.key==='Tab'){const a=[...$('modalActions').querySelectorAll('button:not(:disabled)')],i=a.indexOf(document.activeElement);e.preventDefault();a[(i+(e.shiftKey?-1:1)+a.length)%a.length]?.focus();}if(e.key==='Escape'&&modalKind==='leave'){e.preventDefault();closeModal();}});
window.addEventListener('pagehide',e=>{runSave();if(!e.persisted){session++;renderer?.destroy();stageController?.destroy();frame.destroy();}});
window.addEventListener('pageshow',e=>{if(e.persisted)renderer?.resize();});
translate();changeScreen('main');
const entryState=window.__wpCrownfallEntry;
if(entryState){
 entryState.ready=true;
 if(entryState.requested){entryState.requested=false;$('start').removeAttribute('aria-busy');$('start').disabled=false;changeScreen('stage');}
}
// Read-only instrumentation; tests use native controls for gameplay.
window.Crownfall=Object.freeze({get state(){return state&&clone(state);},get save(){return clone(save);},get screen(){return screen;},get busy(){return busy;},cells:()=>renderer?.cellPoints()||[],diagnostics:()=>renderer?.diagnostics()||{contexts:0},get locale(){return locale;}});
LocalPractice.register({gameId:GAME_ID,stageIds:LEVELS.map(level=>level.id),
 enable:enabled=>{practiceMode=enabled;changeScreen('stage');},
 startStage:id=>startLevel(Number(id),null,true)
}).catch(error=>console.error('Local practice setup failed',error));

let tutorialOpen=false,tutorialPaused=false,tutorialFocus=null;
function syncTutorial(){const dialog=document.querySelector('.wp-tutorial-backdrop[data-game-id="animal-crownfall"]');const opened=!!dialog;if(opened===tutorialOpen)return;tutorialOpen=opened;if(opened){dialog.setAttribute('data-wp-scroll-owner','');dialog.querySelector('.wp-tutorial-card')?.setAttribute('data-wp-scroll-owner','');tutorialPaused=paused;tutorialFocus=document.activeElement;paused=true;tracking()?.pause('tutorial');$('gameFrame').inert=true;dialog.querySelector('.wp-tutorial-action')?.setAttribute('data-wp-tutorial-next','');dialog.querySelector('button')?.focus();dialog.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();dialog.querySelector('.wp-tutorial-close')?.click();}if(e.key==='Tab'){const buttons=[...dialog.querySelectorAll('button')];e.preventDefault();const i=buttons.indexOf(document.activeElement);buttons[(i+(e.shiftKey?-1:1)+buttons.length)%buttons.length]?.focus();}});}else{paused=tutorialPaused;tracking()?.resume('tutorial');$('gameFrame').inert=false;tutorialFocus?.focus();}}
const tutorialObserver=new MutationObserver(syncTutorial);tutorialObserver.observe(document.body,{childList:true});window.addEventListener('pagehide',e=>{if(!e.persisted)tutorialObserver.disconnect();});
