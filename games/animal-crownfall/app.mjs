import {clone,newState,step,solve,groupAt,actions,powerOf,heroPower,recoveryUndoCount} from './core.mjs?v=20261028-latch1';
import {cameraText} from './camera-copy.mjs';
import {LEVELS} from './levels.mjs';
import {COPY,LOCALES,SEGMENTS,NATIVE,text} from './locales.mjs';
import {NAMES} from './stage-copy.mjs';
import {createCrownfallStageConfig} from './stage-config.mjs?v=20261028-latch33';
import {DETAILS} from './guide.mjs';
import {upgradeText} from './upgrade-copy.mjs';
import {normalize,award,SAVE_KEY} from './save.mjs';
import {masteryFeedback} from './result-copy.mjs';
import {battleObjective} from './objective-copy.mjs?v=20261028-rtl-order1';
import {LocalPractice} from '../../src/game-local-practice.mjs';
import {LATCH_CHAPTER_CANDIDATES} from './latch-chapter-candidate.mjs?v=20261028-latch26';
import {LATCH_COPY,LATCH_NAMES,LATCH_FIND_KEY,LATCH_RUNE_RULE,LATCH_PAIR_RULE,LATCH_BOSS_RULE,LATCH_ARITHMETIC_RULE,LATCH_DUAL_ARITHMETIC_RULE,LATCH_SHIELD_ARITHMETIC_RULE,LATCH_DUAL_SHIELD_RULE,LATCH_DUAL_BOSS_RULE,LATCH_SEALS_RULE,LATCH_DUAL_SEALS_RULE,LATCH_SEAL_SHIELD_RULE,LATCH_DUAL_SEAL_SHIELD_RULE,LATCH_TWO_RUNES_RULE,LATCH_RUNE_ACCESS,LATCH_THREE_SEALS_RULE,LATCH_DUAL_THREE_SEALS_RULE,LATCH_THREE_SEAL_SHIELD_RULE,LATCH_DUAL_THREE_SHIELD_RULE,LATCH_THREE_SEALS_TWO_RUNES_RULE,LATCH_SPIKE_BRIDGE_RULE,LATCH_DUAL_SPIKE_RULE,LATCH_SPIKE_RUNE_RULE,LATCH_DUAL_SPIKE_RUNE_RULE,LATCH_SPIKE_TWO_RUNES_RULE} from './latch-copy.mjs?v=20261028-latch32';
const GAME_INTERFACE_VERSION='9';
function assertGameInterfaceIdentity(){
 const meta=document.querySelector('meta[name="weightplay-interface-version"]');
 if(meta&&meta.content!==GAME_INTERFACE_VERSION)meta.content=GAME_INTERFACE_VERSION;
 if(document.body?.dataset.wpInterfaceVersion!==GAME_INTERFACE_VERSION)document.body?.setAttribute('data-wp-interface-version',GAME_INTERFACE_VERSION);
}
assertGameInterfaceIdentity();
const gameInterfaceIdentityObserver=new MutationObserver(assertGameInterfaceIdentity);
gameInterfaceIdentityObserver.observe(document.head,{subtree:true,childList:true,attributes:true,attributeFilter:['content']});
gameInterfaceIdentityObserver.observe(document.body,{attributes:true,attributeFilter:['data-wp-interface-version']});
const $=id=>document.getElementById(id);
const GAME_ID='animal-crownfall',FIRST_CLEAR_BLOCK_KEY=`${GAME_ID}:first-completion`;
const practiceRequested=location.protocol==='http:'&&['localhost','127.0.0.1','[::1]'].includes(location.hostname)&&new URLSearchParams(location.search).get('practice')==='1';
const tracking=()=>practiceRequested||practiceMode||practiceRun?null:window.WonderAnalytics?.game;
function hasFirstClearBlock(){try{if(window.WeightPlayCastle?.read?.()?.completions?.[FIRST_CLEAR_BLOCK_KEY])return true;}catch{}try{return !!JSON.parse(localStorage.getItem('weightplayCastleV1')||'null')?.completions?.[FIRST_CLEAR_BLOCK_KEY];}catch{return false;}}
$('stage').classList.add('wp-stage-art-shell');
const loading=document.createElement('div');loading.id='loadingPanel';loading.className='loading-panel';loading.hidden=true;loading.setAttribute('role','status');const loadingCard=document.createElement('div');loadingCard.className='loading-card';const loadingText=document.createElement('strong');loadingCard.append(loadingText);loading.append(loadingCard);$('battle').append(loading);
let locale=LOCALES.includes(document.documentElement.lang)?document.documentElement.lang:'en';
const segment=location.pathname.split('/')[1];if(SEGMENTS.includes(segment))locale=LOCALES[SEGMENTS.indexOf(segment)];
else {try{const saved=localStorage.getItem('weightPlayLocale');if(LOCALES.includes(saved))locale=saved;}catch{}}
let save,storageOK=true;try{save=normalize(JSON.parse(localStorage.getItem(SAVE_KEY)||'null'));}catch{save=normalize(null);storageOK=false;}
// Discard legacy practice resumes without touching the stored campaign record.
if(save.run?.practice)save.run=null;
let stageController=null,selectedStageIndex=null,practiceMode=false,practiceRun=false,practiceBadge=null;
let screen='main',state=null,history=[],moveHistory=[],usedHint=false,busy=false,paused=false,renderer=null,modalKind='',hintLevel=0,hintCache=null,pending=null,pendingRoute='',settlingRoute='',transactionBase=null,session=0,targetMoves=0;
const t=(key,args)=>key==='title'?(window.WEIGHTPLAY_GAME_TITLES?.['animal-crownfall']?.[locale]||text(locale,key,args)):text(locale,key,args);
const stageConfig=createCrownfallStageConfig({getLocale:()=>locale,getSave:()=>save,isPractice:()=>practiceMode});
const latchText=index=>(LATCH_COPY[locale]||LATCH_COPY.en)[index];
const chapterRule=id=>id===55?(LATCH_SPIKE_TWO_RUNES_RULE[locale]||LATCH_SPIKE_TWO_RUNES_RULE.en):id===54?(LATCH_DUAL_SPIKE_RUNE_RULE[locale]||LATCH_DUAL_SPIKE_RUNE_RULE.en):id===53?(LATCH_SPIKE_RUNE_RULE[locale]||LATCH_SPIKE_RUNE_RULE.en):id===52?(LATCH_DUAL_SPIKE_RULE[locale]||LATCH_DUAL_SPIKE_RULE.en):id===51?(LATCH_SPIKE_BRIDGE_RULE[locale]||LATCH_SPIKE_BRIDGE_RULE.en):id===50?(LATCH_THREE_SEALS_TWO_RUNES_RULE[locale]||LATCH_THREE_SEALS_TWO_RUNES_RULE.en):id===49?(LATCH_DUAL_THREE_SHIELD_RULE[locale]||LATCH_DUAL_THREE_SHIELD_RULE.en):id===48?(LATCH_THREE_SEAL_SHIELD_RULE[locale]||LATCH_THREE_SEAL_SHIELD_RULE.en):id===47?(LATCH_DUAL_THREE_SEALS_RULE[locale]||LATCH_DUAL_THREE_SEALS_RULE.en):id===46?(LATCH_THREE_SEALS_RULE[locale]||LATCH_THREE_SEALS_RULE.en):id===45?(LATCH_TWO_RUNES_RULE[locale]||LATCH_TWO_RUNES_RULE.en):id===44?(LATCH_DUAL_SEAL_SHIELD_RULE[locale]||LATCH_DUAL_SEAL_SHIELD_RULE.en):id===43?(LATCH_SEAL_SHIELD_RULE[locale]||LATCH_SEAL_SHIELD_RULE.en):id===42?(LATCH_DUAL_SEALS_RULE[locale]||LATCH_DUAL_SEALS_RULE.en):id===41?(LATCH_SEALS_RULE[locale]||LATCH_SEALS_RULE.en):id===40?(LATCH_DUAL_BOSS_RULE[locale]||LATCH_DUAL_BOSS_RULE.en):id===39?(LATCH_DUAL_SHIELD_RULE[locale]||LATCH_DUAL_SHIELD_RULE.en):id===38?(LATCH_SHIELD_ARITHMETIC_RULE[locale]||LATCH_SHIELD_ARITHMETIC_RULE.en):id===37?(LATCH_DUAL_ARITHMETIC_RULE[locale]||LATCH_DUAL_ARITHMETIC_RULE.en):id===36?(LATCH_ARITHMETIC_RULE[locale]||LATCH_ARITHMETIC_RULE.en):id===35?(LATCH_BOSS_RULE[locale]||LATCH_BOSS_RULE.en):id===34?(LATCH_PAIR_RULE[locale]||LATCH_PAIR_RULE.en):id===33?(LATCH_RUNE_RULE[locale]||LATCH_RUNE_RULE.en):id===32?(LATCH_FIND_KEY[locale]||LATCH_FIND_KEY.en):null;
function placePracticeBadge(host){practiceBadge ||= document.querySelector('[data-wp-local-practice]');if(!practiceBadge||!practiceMode||!host)return;practiceBadge.style.cssText='display:inline-block;position:static;transform:none;margin-inline-start:5px;padding:1px 4px;border-radius:3px;background:#ffe59a;color:#392900;font:700 10px sans-serif;pointer-events:none;white-space:nowrap';if(practiceBadge.parentNode!==host)host.append(practiceBadge)}
const stageName=id=>LEVELS[id-1]?.latches?(LATCH_NAMES[locale]||LATCH_NAMES.en)[id-31]:NAMES[locale][id-1];
const u=(key,args)=>upgradeText(locale,key,args);
const idleFeedback=()=>state?.calculation?powerResult(state.calculation):'';
const equation=c=>c ? `${c.before} ${c.operator} ${c.amount} = ${c.after}` : u('calculate');
const powerResult=c=>c?`${t('power')}: ${equation(c)}`:equation(c);
const routeFeedback=route=>`${t('route')}: ${route}`;
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
const persist=()=>{if(practiceRequested||practiceMode||practiceRun)return;try{localStorage.setItem(SAVE_KEY,JSON.stringify(save));storageOK=true;}catch{storageOK=false;}};
const runSave=()=>{if(busy||practiceMode||practiceRun)return;if(state?.status==='playing')save.run={level:state.level,actions:clone(moveHistory),usedHint,campaign:5};else if(state)save.run=null;persist();};
function translate(){document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';document.title=`${t('title')} | WeightPlay`;$('locale').value=locale;document.querySelectorAll('[data-t]').forEach(n=>n.textContent=t(n.dataset.t));document.querySelectorAll('[data-aria]').forEach(n=>n.setAttribute('aria-label',t(n.dataset.aria)));document.querySelectorAll('[data-guide]').forEach(n=>n.textContent=DETAILS[locale][Number(n.dataset.guide)]);document.querySelectorAll('[data-related-game]').forEach(card=>{const id=card.dataset.relatedGame;card.href=`/${SEGMENTS[LOCALES.indexOf(locale)]}/games/${id}/`;const title=window.WEIGHTPLAY_GAME_TITLES[id][locale];card.querySelector('[data-related-title]').textContent=title;card.querySelector('img')?.setAttribute('alt',title);});const guideRoot=$('mainGuide')||document.querySelector('#gameFrame > .game-page-info');const relatedHeading=guideRoot?.querySelector('.game-info-related-section h3');if(relatedHeading)relatedHeading.textContent=DETAILS[locale][33];document.querySelector('meta[name="description"]').content=t('goal');updateMain();if(screen==='stage')renderStages({reset:false});frame?.refresh();}
for(let i=0;i<LOCALES.length;i++)$('locale').add(new Option(NATIVE[i],LOCALES[i]));
window.WonderI18n?.setLocale?.(locale,{navigate:false,dispatch:false});
let frame=window.WeightPlayScreenFrame.mount({root:$('gameFrame'),localeSelect:$('locale'),playUI:true,scenes:{main:{root:$('main'),header:$('main').querySelector('header'),content:$('hero')},stage:{root:$('stage'),header:$('stage').querySelector('header'),content:$('stageContent')},battle:{root:$('battle'),header:$('battle').querySelector('header'),content:$('battleContent'),headerInfo:$('battleInfo')}}});
const stageInfoGroup=window.WeightPlayScreenFrame.createGroup();stageInfoGroup.add($('stageSummary'));frame.stageTopUI.add(stageInfoGroup);
const battleInfoGroup=window.WeightPlayScreenFrame.createGroup();[...$('battleInfo').children].forEach(node=>battleInfoGroup.add(node));frame.battleTopUI.add(battleInfoGroup);
document.querySelector('#battle .wp-frame-popover').append($('reduced').closest('.motion'));
$('locale').addEventListener('change',()=>{locale=$('locale').value;try{localStorage.setItem('weightPlayLocale',locale);}catch{}window.WonderI18n?.setLocale?.(locale,{navigate:false});translate();});
// Keep the shared settings component on this game's selected dictionary.
window.addEventListener('wonder:locale-change',()=>{const next=window.WonderI18n?.actualLocale?.();if(LOCALES.includes(next))locale=next;translate();});
function updateMain(){const cleared=Object.values(save.badges).filter(v=>v[0]).length;$('progress').textContent=`${t('clearBadge')} ${cleared} / 30`;$('resumeSlot').hidden=!save.run;$('resume').textContent=t(save.run?.practice?'resumePractice':'resume');}
function fitScene(){renderer?.resize();}
window.addEventListener('resize',fitScene);window.visualViewport?.addEventListener('resize',fitScene);
function changeScreen(next){const previousScreen=screen;if(next!=='stage')stageController?.cancel();screen=next;tracking()?.screen(next,{node:$(next),locale});document.body.dataset.screen=next;for(const id of ['main','stage','battle'])$(id).hidden=id!==next;const guide=$('mainGuide')||document.querySelector('#gameFrame > .game-page-info');if(guide)guide.hidden=next!=='main';$('generalReserve').hidden=true;frame.activate(next);fitScene();if(next!=='battle'){renderer?.destroy();renderer=null;$('arena').querySelectorAll('.cell-access').forEach(n=>n.remove());}if(next==='main')updateMain();if(next==='stage')renderStages({reset:previousScreen==='main'});window.scrollTo(0,0);}
function renderStages({reset=true}={}){
 const rail=$('stageRail');$('stageSummary').textContent=practiceMode?'':`${t('clearBadge')} ${Object.values(save.badges).filter(v=>v[0]).length} / ${LEVELS.length}`;
 if(practiceMode)placePracticeBadge($('stageSummary'));
 const highest=practiceMode?LEVELS.length-1:save.unlocked-1;
 selectedStageIndex=reset||!Number.isInteger(selectedStageIndex)?highest:Math.max(0,Math.min(selectedStageIndex,highest));
 if(!stageController){
  if(!window.WeightPlayPlayUI)throw new Error('SHARED_PLAY_UI_MISSING');
  stageController=window.WeightPlayPlayUI.mountStage({page:$('stageContent'),rail,config:stageConfig,selected:selectedStageIndex,onSelect:index=>{selectedStageIndex=index;},onStart:index=>startLevel(index+1,null,practiceMode),isActive:()=>screen==='stage'});
 }else stageController.refresh(selectedStageIndex);
}
function label(a,kind,s){if(kind==='hero')return `⚔ ${heroPower(s)}`;if(kind==='enemy'){const p=powerOf(s,a),bonus=p-a.power,shield=a.shield?([49,50,53,54,55].includes(s.level)?`${a.shield==='sun'?'☀':'☾'} ${(LATCH_RUNE_ACCESS[locale]||LATCH_RUNE_ACCESS.en)[a.shield==='sun'?2:3]} `:([45,48].includes(s.level)?`▣${a.shield==='sun'?'☀':'☾'} `:'▣ ')):'';return `${a.boss?'♛ ':s.required.includes(a.id)?'◆ ':''}${shield}${a.direction==='left'?'→ ':a.direction==='right'?'← ':''}${p}${bonus?` (+${bonus})`:''}${a.buff?' ⚑':''}`;}if(['sword','power','multiply'].includes(a.kind))return `${u(a.kind)} ${a.kind==='multiply'?`×${a.amount}`:`+${a.amount||0}`}`;if([49,50,53,54,55].includes(s.level)&&a.kind==='rune')return `${a.link==='sun'?'☀':'☾'} ${(LATCH_RUNE_ACCESS[locale]||LATCH_RUNE_ACCESS.en)[a.link==='sun'?0:1]}`;if([45,48].includes(s.level)&&a.kind==='rune')return `◇${a.link==='sun'?'☀':'☾'}`;return a.kind==='crown'?'♛':`${({key:'◆',rune:'◇',seal:'●'})[a.kind]}${a.link&&a.kind!=='rune'?a.link:''}`;}
function accessibleActorLabel(a,kind,s){if(![45,48,49,50,53,54,55].includes(s.level))return null;const names=LATCH_RUNE_ACCESS[locale]||LATCH_RUNE_ACCESS.en;if(kind==='item'&&a.kind==='rune')return names[a.link==='sun'?0:1];if(kind==='enemy'&&a.shield)return `${names[a.shield==='sun'?2:3]} ${powerOf(s,a)}`;return null;}
function reason(s){if(!s.reason)return t('lost');const code={power:'powerFail',shield:'shieldFail'}[s.reason.code]||s.reason.code;return t(code,s.reason);}
function updateUI(){if(!state)return;document.body.dataset.crownLatchPractice=String(Boolean(state.latches));$('arena').setAttribute('aria-busy',String(busy));$('power').textContent=heroPower(state);$('calculation').textContent=powerResult(state.calculation);$('choice').hidden=!pending||busy;$('moves').textContent=`${state.moves} / ${targetMoves}`;$('stageNumber').textContent=state.level;const objective=battleObjective(locale,state);$('objective').textContent=chapterRule(state.level)||(state.latches?`${objective.goal} · ${latchText(1)}`:objective.goal);$('legend').textContent=objective.progress;if(practiceMode)placePracticeBadge($('legend'));$('undo').disabled=busy||!history.length;$('retry').disabled=busy;$('hint').disabled=busy||state.status!=='playing';$('reduced').checked=save.reduced;if(state.status!=='playing'&&$('feedback').textContent===t('busy'))$('feedback').textContent='';if(!storageOK&&!pendingRoute&&!settlingRoute)$('feedback').textContent=t('storage');}
function draw(highlight=[],preserve=false){renderer?.show(state,highlight,{preserve});$('arena').querySelectorAll('.cell-access').forEach(n=>n.remove());if(state.status==='playing')for(const [x,y] of actions(state)){const b=document.createElement('button');b.className='cell-access';const group=groupAt(state,x,y),contains=pos=>group.some(([a,c])=>a===pos[0]&&c===pos[1]);const latch=state.latches?.find(item=>contains(item.key)||contains(item.lock));const keyPresent=latch&&/^[ABC]$/.test(state.board[latch.key[1]]?.[latch.key[0]]||'');const mark=latch?(contains(latch.key)?latchText(3):latchText(keyPresent?4:5)):'';const pair=latch&&state.latches.length>1?` ${state.latches.indexOf(latch)+1}`:'';b.textContent=`${t('block')} ${t('row')} ${y+1}, ${t('column')} ${x+1}${mark?` · ${mark}${pair}`:''}`;b.addEventListener('click',()=>choose(x,y));$('arena').append(b);}updateUI();}
async function startLevel(id,resume=null,practice=practiceMode,validated=false){
 if(practiceRequested&&!validated)return LocalPractice.challenge(GAME_ID,String(id));
 if(practiceRequested&&(!practiceMode||!LocalPractice.dynamicEnabled||window.__crownfallPracticeSafe!==true))return false;
 if(!practiceRequested&&(practice===true||resume?.practice===true)&&!await LocalPractice.validate())return false;
 practiceRun=LocalPractice.enabled&&(resume?resume.practice===true:practice===true);if((practiceRequested&&!practiceRun)||resume?.practice&&!practiceRun)return false;
 if(!LEVELS[id-1]||(!practiceRun&&id>save.unlocked))return false;
 session++;if(!practiceRun)tracking()?.start({roundKey:session,resumed:!!resume});loadingText.textContent=t('loading');loading.hidden=false;const token=session;busy=true;transactionBase=null;paused=false;pending=null;pendingRoute='';settlingRoute='';hintCache=null;hintLevel=0;modalKind='';$('modal').hidden=true;$('battleContent').inert=false;history=[];moveHistory=[];usedHint=!!resume?.usedHint;state=newState(LEVELS[id-1]);targetMoves=solve(newState(LEVELS[id-1])).moves.length;if(resume)for(const a of resume.actions){history.push(clone(state));state=step(state,...a,{trace:false}).state;moveHistory.push(a);}renderer?.destroy();renderer=null;changeScreen('battle');updateUI();$('feedback').textContent=idleFeedback();try{const {CrownScene}=await import('./render.mjs?v=20261028-latch22');if(token!==session)return false;renderer=new CrownScene($('arena'),{navigationHost:$('mapControls'),label,accessibleLabel:accessibleActorLabel,onPick:choose,isBusy:()=>busy||paused,isPaused:()=>paused,cameraText:key=>cameraText(locale,key),onError:renderFailure,onContact:event=>{if(['hit','fail','pickup','win','clear','phase'].includes(event.type))sound(contactSound(event));if(event.type==='hit'||event.type==='fail'||event.type==='pickup'){$('power').textContent=heroPower(event.state);$('calculation').textContent=powerResult(event.state.calculation);if(event.state.calculation&&!settlingRoute)$('feedback').textContent=powerResult(event.state.calculation);}},reduced:()=>save.reduced||matchMedia('(prefers-reduced-motion: reduce)').matches});busy=false;loading.hidden=true;draw();runSave();window.dispatchEvent(new CustomEvent('weightplay:battle-open',{detail:{gameId:'animal-crownfall'}}));return true;}catch(error){console.error(error);renderFailure();return false;}}
function renderFailure(){loading.hidden=true;session++;renderer?.stop();if(transactionBase){state=clone(transactionBase);history.pop();moveHistory.pop();transactionBase=null;}pending=null;pendingRoute='';settlingRoute='';busy=false;paused=true;$('feedback').textContent='';runSave();showModal('error',t('loadFail'),'',[[t('retry'),()=>startLevel(state.level,null,practiceRun)],[t('stages'),()=>exitBattle()]]);}
function showModal(kind,title,body,buttons,gotBlock=false){modalKind=kind;tracking()?.pause('modal');const modal=$('modal'),card=modal.querySelector('.modal-card');modal.dataset.kind=kind;modal.setAttribute('data-wp-result-screen','');card?.setAttribute('data-wp-result-card','');paused=true;$('modalTitle').textContent=title;$('modalText').textContent=body;$('badges').textContent='';$('modalActions').replaceChildren();for(const [label,fn,disabled=false] of buttons){const b=document.createElement('button');b.textContent=label;b.disabled=disabled;b.dataset.wpFrameAction='secondary';b.addEventListener('click',fn);$('modalActions').append(b);}modal.hidden=false;window.ShowResultGet?.(GAME_ID,kind==='result'&&gotBlock);if(kind!=='result'){modal.removeAttribute('data-wp-result-screen');card?.removeAttribute('data-wp-result-card');}$('battleContent').inert=true;frame.activate('battle',{covered:true});$('modalActions').querySelector('button')?.focus();}
function closeModal(){tracking()?.resume('modal');const restoreBattleFocus=modalKind==='leave';window.ShowResultGet?.(GAME_ID,false);$('modal').removeAttribute('data-wp-result-screen');$('modal .modal-card')?.removeAttribute('data-wp-result-card');paused=false;modalKind='';$('modal').hidden=true;$('battleContent').inert=false;frame.activate('battle');if(restoreBattleFocus)$('battleBack').focus();}
function choose(x,y){
 if(busy||paused||state?.status!=='playing')return;const g=groupAt(state,x,y);if(!g.length)return;
 const preliminary=step(state,x,y,{trace:false});if(preliminary.reason==='latch'){pending=null;pendingRoute='';draw();const pair=state.latches.length>1?` ${state.latches.findIndex(l=>l.id===preliminary.latchId)+1}`:'';$('feedback').textContent=`${latchText(2)}${pair}`;return;}
 if(pending&&g.some(([a,b])=>a===pending[0]&&b===pending[1])){commitChoice();return;}
 pending=[x,y];renderer?.show(state,g);const preview=step(state,x,y);
 const route=preview.events.filter(e=>['approach','pickup','win'].includes(e.type)).map(e=>e.type==='approach'?`⚔ ${e.enemy}`:e.type==='win'?'♛':e.calculation?`${e.calculation.operator}${e.amount}`:u(e.kind));
 pendingRoute=route.join(' → ')||u('routeSafe');$('feedback').textContent=routeFeedback(pendingRoute);
 $('feedback').dataset.risk='false';$('confirmMove').textContent=t('confirm');$('cancelMove').textContent=t('cancel');updateUI();
}
function commitChoice(){if(!pending||busy||paused)return;const [x,y]=pending;pending=null;settlingRoute=pendingRoute;pendingRoute='';playMove(x,y);}
$('confirmMove').addEventListener('click',commitChoice);
 $('cancelMove').addEventListener('click',()=>{pending=null;pendingRoute='';draw();$('feedback').textContent=idleFeedback();});
async function playMove(x,y){
 if(!practiceRun)tracking()?.activity();const before=clone(state),result=step(state,x,y);
 if(!result.valid){busy=false;pendingRoute='';settlingRoute='';$('feedback').textContent=idleFeedback();updateUI();return;}
 busy=true;transactionBase=before;hintCache=null;hintLevel=0;history.push(before);moveHistory.push([x,y]);const token=session;$('feedback').textContent=settlingRoute?`${t('busy')} · ${routeFeedback(settlingRoute)}`:t('busy');updateUI();await renderer?.focusHero();if(token!==session)return;
 let previous=before;for(const event of result.events){if(token!==session)return;await renderer?.animate(event,previous,()=>paused);if(token!==session)return;state=clone(event.state);renderer?.show(state,[],{preserve:true});if((event.type==='hit'||event.type==='phase')&&!settlingRoute)$('feedback').textContent=powerResult(state.calculation);previous=state;updateUI();}
 state=result.state;busy=false;settlingRoute='';transactionBase=null;pending=null;if(state.status!=='playing')$('feedback').textContent='';draw([],true);runSave();
 const rewardWasClaimed=!practiceRun&&state.status==='won'&&hasFirstClearBlock();
 if(state.status!=='playing'&&!practiceRun)tracking()?.end(state.status==='won'?'win':'lose');
 const blockGranted=!practiceRun&&state.status==='won'&&!rewardWasClaimed&&hasFirstClearBlock();
 // Result owns the committed cube feedback; its actions must be usable immediately.
 if(blockGranted)window.WeightPlayCastle?.dismissRewardNotice?.(GAME_ID);
 if(state.status==='won'){
  const par=targetMoves,previousBest=save.best[state.level];
  if(!practiceRun){award(save,state.level,state.moves,usedHint,par);persist();}
  const performance=`${t('moves')}: ${state.moves}${practiceRun?'':` · ${t('best')}: ${save.best[state.level]}`}`;
  const goal=masteryFeedback(locale,{moves:state.moves,previousBest,par,usedHint,practice:practiceRun});
  const resultText=`${stageName(state.level)} · ${performance}. ${goal}${practiceRun?` · ${t('practiceResult')}`:''}`;
  showModal('result',t('won'),resultText,[[t('stages'),exitBattle],[t('next'),()=>startLevel(state.level+1,null,practiceRun),state.level>=LEVELS.length],[t('retry'),()=>startLevel(state.level,null,practiceRun)]],blockGranted);
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
$('hint').addEventListener('click',()=>{if(busy||state.status!=='playing')return;pending=null;pendingRoute='';updateUI();usedHint=true;runSave();hintCache??=solve(state);hintLevel++;if(hintCache.status!=='solved'){if(hintCache.status==='dead'){const undoCount=recoveryUndoCount(history);$('feedback').textContent=undoCount?t(undoCount===1?'deadRecoverOne':'deadRecoverMany',{moves:undoCount}):t('dead');}else $('feedback').textContent=t('noSolution');return;}const [x,y]=hintCache.moves[0],preview=step(state,x,y);renderer.show(state,groupAt(state,x,y));if(hintLevel===1){const target=preview.events.find(e=>e.type==='approach');$('feedback').textContent=target?t('hintTarget',{target:`${t('guard')} ${powerOf(state,state.enemies.find(e=>e.id===target.target))}`}):t('hintRoute');}else if(hintLevel===2)$('feedback').textContent=t('hintRoute');else $('feedback').textContent=t('hintMove',{r:y+1,c:x+1});});
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
const waitForEntry=()=>new Promise(resolve=>{let done=false;const observer=new MutationObserver(check),timer=setTimeout(()=>finish(false),25000);function finish(ok){if(done)return;done=true;clearTimeout(timer);observer.disconnect();resolve(ok)}function check(){const root=document.documentElement;if(window.WeightPlayGameEntryLoader?.isActive&&root.dataset.wpGameEntryLoaderInstalled==='true'&&root.dataset.wpGameEntryLoaderActive!=='true')finish(true);else if(document.querySelector('.wp-game-entry-loader[data-state="error"]'))finish(false)}observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-wp-game-entry-loader-installed','data-wp-game-entry-loader-active'],childList:true,subtree:true});check()});
if(practiceRequested){
 void waitForEntry().then(ready=>{if(!ready||window.__crownfallPracticeSafe!==true)return false;return LocalPractice.register({gameId:GAME_ID,
   acceptStage:id=>Number.isInteger(Number(id))&&Number(id)>=1&&Number(id)<=LEVELS.length,
   enable:enabled=>{practiceMode=enabled===true&&window.__crownfallPracticeSafe===true;$('start').disabled=!practiceMode;if(practiceMode){if(LEVELS.length===30)LEVELS.push(...LATCH_CHAPTER_CANDIDATES);selectedStageIndex=null;changeScreen('stage');}else{session++;renderer?.destroy();renderer=null;state=null;practiceRun=false;LEVELS.splice(30);selectedStageIndex=null;practiceBadge?.remove();practiceBadge=null;document.querySelector('[data-wp-local-practice]')?.remove();changeScreen('main');}},
   startStage:id=>startLevel(Number(id),null,true,true)
 });}).catch(error=>console.error('Local practice setup failed',error));
}else LocalPractice.register({gameId:GAME_ID,stageIds:LEVELS.map(level=>level.id),enable:enabled=>{practiceMode=enabled;changeScreen('stage');},startStage:id=>startLevel(Number(id),null,true)}).catch(error=>console.error('Local practice setup failed',error));

let tutorialOpen=false,tutorialPaused=false,tutorialFocus=null;
function syncTutorial(){const dialog=document.querySelector('.wp-tutorial-backdrop[data-game-id="animal-crownfall"]');const opened=!!dialog;if(opened===tutorialOpen)return;tutorialOpen=opened;if(opened){dialog.setAttribute('data-wp-scroll-owner','');dialog.querySelector('.wp-tutorial-card')?.setAttribute('data-wp-scroll-owner','');tutorialPaused=paused;tutorialFocus=document.activeElement;paused=true;tracking()?.pause('tutorial');$('gameFrame').inert=true;dialog.querySelector('.wp-tutorial-action')?.setAttribute('data-wp-tutorial-next','');dialog.querySelector('button')?.focus();dialog.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();dialog.querySelector('.wp-tutorial-close')?.click();}if(e.key==='Tab'){const buttons=[...dialog.querySelectorAll('button')];e.preventDefault();const i=buttons.indexOf(document.activeElement);buttons[(i+(e.shiftKey?-1:1)+buttons.length)%buttons.length]?.focus();}});}else{paused=tutorialPaused;tracking()?.resume('tutorial');$('gameFrame').inert=false;renderer?.paint();tutorialFocus?.focus();}}
const tutorialObserver=new MutationObserver(syncTutorial);tutorialObserver.observe(document.body,{childList:true});window.addEventListener('pagehide',e=>{if(!e.persisted)tutorialObserver.disconnect();});
