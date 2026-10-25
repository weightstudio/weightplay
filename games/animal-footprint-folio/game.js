import {CASES,SYMBOLS,tokenAt,tokenKey,optionsFor,checkAnswers,normalizeSave,unlocked,settle} from './puzzles.mjs';
import {mark} from './marks.mjs';
import {purchaseInk} from './ink-purchase.mjs';
const GAME='animal-footprint-folio',KEY='weightplay.footprint-folio.v1',POSTER='/assets/interface7-redrawn/animal-footprint-folio.webp';
const $=id=>document.getElementById(id),COPY=window.FOOTPRINT_FOLIO_LOCALES;
const frame=window.__ANIMAL_FOOTPRINT_FOLIO_FRAME__;
const audio=window.WeightPlayAudio?.createScope();
let locale=window.__WEIGHTPLAY_ROUTE_LOCALE__||'en',save,storageOK=true,screen='main',run=null,activeGap=0,stageUI=null,modalKind='',feedbackKey='',shopBusy=false;
try{save=normalizeSave(JSON.parse(localStorage.getItem(KEY)||'null'));if(!window.__WEIGHTPLAY_ROUTE_LOCALE__)locale=localStorage.getItem('weightPlayLocale')||locale;}catch{save=normalizeSave(null);storageOK=false;}
if(!COPY[locale])locale='en';
// The shared official-name adapter follows the effective in-page language.
if(!window.WonderI18n?.actualLocale)window.WonderI18n={...window.WonderI18n,actualLocale:()=>locale};
const t=(key,args={})=>{let value=key==='title'?(window.WEIGHTPLAY_GAME_TITLES?.[GAME]?.[locale]||COPY[locale].title):(COPY[locale]?.[key]??COPY.en[key]??key);for(const[k,v]of Object.entries(args))value=value.replaceAll(`{${k}}`,String(v));return value;};
const level=()=>CASES[(run?.id||1)-1];
const sound=id=>{if(!document.hidden)audio?.play(id);};
const reduce=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
function animate(node,frames,duration=180){if(!node||document.hidden)return;node.getAnimations().forEach(a=>a.cancel());node.animate(reduce()?[{opacity:.6},{opacity:1}]:frames,{duration:reduce()?90:duration,easing:'cubic-bezier(.2,.8,.2,1)'});}
function saveNow(){try{localStorage.setItem(KEY,JSON.stringify(save));storageOK=true;}catch{storageOK=false;}updateStorage();return storageOK;}
function persistRun(){if(run&&!run.awarded&&!modalKind){save.run=structuredClone(run);saveNow();}}
function updateStorage(){$('storageNotice').hidden=storageOK;$('storageNotice').textContent=storageOK?'':t('noSave');}
function rule(l=level()){const dir=l.step===2?'180°':l.step<0?'↺ 90°':'↻ 90°';return t(`${l.kind}Rule`,{n:l.pattern.length,dir});}
function label(token){return t(`symbol_${token.symbol}`)+(level().step?` · ${['↑','→','↓','←'][token.turn]}`:'');}
function setScreen(next){
  if(next!=='stage')stageUI?.cancel();
  audio?.stop();document.querySelectorAll('#app *').forEach(n=>n.getAnimations?.().forEach(a=>a.cancel()));
  screen=next;document.body.dataset.screen=next;
  for(const name of ['main','stage','battle'])$(name+'Screen').hidden=name!==next;
  document.querySelector('[data-wp-game-guide]').hidden=next!=='main';
  frame.activate(next);window.WeightPlayBattleCanvas?.sync?.();
  window.scrollTo(0,0);if(next==='main')updateMain();
  animate($(next==='battle'?'notebook':next+'Screen'),[{opacity:0},{opacity:1}],220);
}
function updateMain(){$('mainProgress').textContent=t('saved',{n:save.stars.filter(Boolean).length});updateStorage();}
function applyCopy(){
  document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';document.title=t('title')+' | WeightPlay';$('locale').value=locale;
  document.querySelectorAll('[data-copy]').forEach(n=>n.textContent=t(n.dataset.copy,{n:3}));
  $('stageBack').setAttribute('aria-label',t('home'));$('battleBack').setAttribute('aria-label',t('stages'));
  document.querySelector('.poster').alt=t('title');
  updateMain();renderShop();if(screen==='stage')stageUI?.refresh();if(run)renderBattle();if(modalKind)renderModal();frame.refresh();
}
function stageConfig(){return {gameId:GAME,count:CASES.length,poster:POSTER,background:'/assets/lobby-block-atmosphere.svg',stage(index){const l=CASES[index],stars=save.stars[index],locked=l.id>unlocked(save);return {id:l.id,kicker:`${t('caseLabel')} ${String(l.id).padStart(2,'0')} / 30`,title:t('region'+l.region),subtitle:rule(l),status:locked?t('locked'):stars?'★'.repeat(stars)+'☆'.repeat(3-stars):t('chooseGap'),summary:t('starsNote'),details:[rule(l),t('chooseGap')],locked,cleared:!!stars,poster:POSTER};}};}
function openStages(){closeModal(false);setScreen('stage');setTab('cases');const selected=unlocked(save)-1;if(!stageUI)stageUI=window.WeightPlayPlayUI.mountStage({page:$('stagePage'),rail:$('stageRail'),config:stageConfig(),selected,isActive:()=>screen==='stage'&&!$('stagePage').hidden,onStart:i=>startCase(i+1)});else stageUI.refresh(selected);renderShop();}
function setTab(tab){$('stagePage').hidden=tab!=='cases';$('stagePage').classList.toggle('hidden',tab!=='cases');$('stagePage').inert=tab!=='cases';$('equipmentPage').hidden=tab!=='equipment';$('casesTab').setAttribute('aria-pressed',String(tab==='cases'));$('equipmentTab').setAttribute('aria-pressed',String(tab==='equipment'));$('casesTab').toggleAttribute('aria-current',tab==='cases');$('equipmentTab').toggleAttribute('aria-current',tab==='equipment');if(tab==='cases')stageUI?.refresh();else{stageUI?.cancel();renderShop();}animate(tab==='cases'?$('stagePage'):$('equipmentPage'),[{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}]);}
function startCase(id,replay=false){
  if(!CASES[id-1]||id>unlocked(save))return;
  closeModal(false);run=!replay&&save.run?.id===id?structuredClone(save.run):{id,answers:{},errors:0,hint:false};
  activeGap=level().gaps.find(i=>!run.answers[i])??level().gaps[0];feedbackKey='chooseGap';
  $('trailBoard').replaceChildren();
  for(let i=0;i<level().length;i++){
    const gap=level().gaps.includes(i),cell=document.createElement(gap?'button':'div');
    cell.className='trail-cell'+(gap?' gap-cell':'');cell.dataset.position=String(i);
    cell.innerHTML='<span class="track-number"></span><span class="track-art"></span><span class="track-caption"></span>';
    if(gap){cell.type='button';cell.addEventListener('click',()=>selectGap(i));}
    $('trailBoard').append(cell);
  }
  for(let i=0;i<4;i++){if($('choices').children[i])continue;const button=document.createElement('button');button.className='choice';button.type='button';button.innerHTML='<span class="choice-art"></span><span class="choice-name"></span><kbd></kbd>';button.addEventListener('click',()=>place(i));$('choices').append(button);}
  setScreen('battle');renderBattle();persistRun();sound('game.start');
  $('trailBoard').querySelector(`[data-position="${activeGap}"]`).focus({preventScroll:true});
}
function selectGap(index){if(modalKind)return;activeGap=index;feedbackKey='chooseGap';renderBattle();}
function renderBattle(){
  if(!run)return;const l=level();document.body.dataset.ink=save.theme;
  $('recordCount').textContent=`${t('caseLabel')} ${l.id} / 30`;$('masteryCount').textContent='★ '+save.stars.reduce((a,b)=>a+b,0)+' / 90';
  $('caseNumber').textContent=String(l.id).padStart(2,'0');$('recordTitle').textContent=t('region'+l.region);$('caseBadge').hidden=!l.checkpoint;
  $('ruleText').textContent=rule();$('directionKey').textContent=l.kind==='mirror'?'→ │ ←':l.kind==='lanes'?'1·3·5·7 / 2·4·6·8':'1 → 2 → 3';
  $('trailBoard').dataset.kind=l.kind;$('trailBoard').style.setProperty('--columns',l.length===6?'3':'4');$('trailBoard').dataset.hint=String(run.hint);$('trailBoard').setAttribute('aria-label',rule());
  const filled=l.gaps.filter(i=>run.answers[i]).length;$('filledCount').textContent=t('filled',{n:filled,total:l.gaps.length});
  for(const cell of $('trailBoard').children){const i=Number(cell.dataset.position),gap=l.gaps.includes(i),token=gap?run.answers[i]:tokenAt(l,i);
    const key=tokenKey(token);if(cell.dataset.key!==key){cell.querySelector('.track-art').innerHTML=token?mark(token):'<span class="unknown">?</span>';cell.dataset.key=key;}
    cell.querySelector('.track-number').textContent=String(i+1).padStart(2,'0');
    cell.querySelector('.track-caption').textContent=token?label(token):'—';
    cell.classList.toggle('active-gap',gap&&i===activeGap);cell.classList.toggle('filled',gap&&!!token);cell.classList.toggle('hint-group',run.hint&&((l.kind==='lanes'&&i%2===activeGap%2)||(l.kind==='mirror'&&i===l.length-1-activeGap)||(['repeat','mixed'].includes(l.kind)&&i%l.pattern.length===activeGap%l.pattern.length)||(l.kind==='turn'&&i<3)));
    cell.setAttribute('aria-label',`${i+1}. ${token?label(token):t('gap')}`);if(gap)cell.setAttribute('aria-pressed',String(i===activeGap));
  }
  const options=optionsFor(l,activeGap);for(let i=0;i<4;i++){const button=$('choices').children[i];if(!button)continue;const token=options[i];button.querySelector('.choice-art').innerHTML=mark(token);button.querySelector('.choice-name').textContent=label(token);button.querySelector('kbd').textContent=String(i+1);button.setAttribute('aria-label',label(token));button.setAttribute('aria-pressed',String(tokenKey(run.answers[activeGap])===tokenKey(token)));}
  $('choiceLabel').textContent=`${t('chooseMarker')} · ${activeGap+1}`;
  $('confirmButton').disabled=filled!==l.gaps.length;$('hintButton').setAttribute('aria-pressed',String(run.hint));
  $('feedback').textContent=feedbackKey==='hint'?rule():t(feedbackKey||'chooseGap');
  $('notebook').classList.toggle('moon-ink',save.theme==='moon');
}
function place(index){
  if(screen!=='battle'||modalKind||!run)return;const target=activeGap,token=optionsFor(level(),target)[index];if(!token)return;
  run.answers[target]={...token};$('trailBoard').children[target].classList.remove('incorrect');feedbackKey='selected';
  renderBattle();animate($('trailBoard').children[target].querySelector('.track-art'),[{transform:'scale(.72)',opacity:.2},{transform:'scale(1)',opacity:1}],170);sound('board.move');persistRun();
  // Keep the selected gap and all choice hit targets stable; multi-gap players choose the next blank.
}
function confirm(){
  if(modalKind||!run||run.awarded||level().gaps.some(i=>!run.answers[i]))return;
  const wrong=checkAnswers(level(),run.answers);
  if(wrong.length){run.errors++;activeGap=wrong[0];feedbackKey='wrong';renderBattle();for(const i of wrong)$('trailBoard').children[i].classList.add('incorrect');animate($('feedback'),[{opacity:.2},{opacity:1}],220);sound('feedback.error');persistRun();return;}
  const result=settle(save,run);if(!result)return;run.awarded=result.stars;saveNow();sound('result.win');modalKind='result';renderBattle();renderModal();
}
function showHint(){if(modalKind||!run)return;run.hint=true;feedbackKey='hint';renderBattle();sound('feedback.hint');persistRun();animate($('feedback'),[{opacity:.2},{opacity:1}]);}
function renderModal(){
  if(!modalKind)return;const result=modalKind==='result';$('modal').hidden=false;$('modal').dataset.kind=modalKind;
  $('modal').toggleAttribute('data-wp-result-screen',result);document.querySelector('.modal-card').toggleAttribute('data-wp-result-card',result);
  $('modalTitle').textContent=t(result?(run.id===30?'successAll':'success'):'leaveTitle');$('modalKicker').textContent=`${t('caseLabel')} ${run.id} · ${t('region'+level().region)}`;
  $('modalCopy').textContent=result?t('starsNote'):(storageOK?t('leaveCopy'):t('noSave'));$('resultRule').textContent=result?rule():'';
  const stars=run.awarded||save.stars[run.id-1];
  $('resultStars').hidden=!result;$('resultStars').textContent=result?'★'.repeat(stars)+'☆'.repeat(3-stars):'';$('resultStars').setAttribute('aria-label',`${stars} / 3 ★`);$('resultSeal').hidden=!result;
  $('modalActions').replaceChildren();const actions=result?[[t('stages'),openStages,false],[t('continue'),()=>startCase(run.id+1),run.id===30],[t('replay'),()=>startCase(run.id,true),false]]:[[t('resume'),()=>closeModal(),false],[t('leave'),openStages,false]];
  for(const[text,fn,disabled]of actions){const b=document.createElement('button');b.type='button';b.textContent=text;b.disabled=disabled;b.addEventListener('click',fn);$('modalActions').append(b);}
  $('battleContent').inert=true;frame.activate('battle',{covered:true});$('modalActions').querySelector('button:not(:disabled)').focus({preventScroll:true});
  animate(document.querySelector('.modal-card'),[{opacity:0,transform:'translateY(12px) scale(.96)'},{opacity:1,transform:'none'}],260);
  if(result)animate($('resultStars'),[{opacity:0,transform:'scale(.8)'},{opacity:1,transform:'scale(1)'}],420);
}
function closeModal(focus=true){modalKind='';$('modal').hidden=true;$('battleContent').inert=false;if(screen==='battle'){frame.activate('battle');if(focus)$('battleBack').focus({preventScroll:true});}}
function back(){if(modalKind)return;persistRun();modalKind='leave';renderModal();audio?.stop();}
function renderShop(){
  $('diamondBalance').textContent=String(window.WeightPlayWallet?.read().diamonds||0);
  $('moonButtonLabel').textContent=t(save.moon?(save.theme==='moon'?'owned':'equip'):'buy');$('moonButton').disabled=shopBusy||save.theme==='moon';$('dayButton').disabled=save.theme==='day';
}
async function buyMoon(){
  if(shopBusy)return;if(save.moon){save.theme='moon';saveNow();renderShop();return;}
  shopBusy=true;renderShop();
  const purchase=async ()=>{
    const result=(await purchaseInk({current:save,read:()=>JSON.parse(localStorage.getItem(KEY)||'null'),write:value=>localStorage.setItem(KEY,JSON.stringify(value)),wallet:window.WeightPlayWallet}));
    save=result.save;$('shopFeedback').textContent=t(result.status==='owned'||result.status==='purchased'?'owned':result.status==='insufficient'?'insufficient':'purchaseError');
    if(result.status==='storage-error')storageOK=false;
    updateStorage();sound(result.status==='purchased'?'reward.unlock':'feedback.error');
  };
  try{if(navigator.locks)await navigator.locks.request('weightplay-footprint-ink',purchase);else purchase();}finally{shopBusy=false;renderShop();animate($('moonButton'),[{opacity:.3},{opacity:1}]);}
}
$('startButton').addEventListener('click',openStages);$('stageBack').addEventListener('click',()=>setScreen('main'));
$('casesTab').addEventListener('click',()=>setTab('cases'));$('equipmentTab').addEventListener('click',()=>setTab('equipment'));
$('battleBack').addEventListener('click',back);$('confirmButton').addEventListener('click',confirm);$('hintButton').addEventListener('click',showHint);
$('moonButton').addEventListener('click',buyMoon);$('dayButton').addEventListener('click',()=>{save.theme='day';saveNow();renderShop();});
$('guideButton').addEventListener('click',()=>document.querySelector('[data-wp-game-guide]').scrollIntoView({behavior:reduce()?'instant':'smooth'}));
$('locale').addEventListener('change',()=>{if(COPY[$('locale').value]){locale=$('locale').value;try{localStorage.setItem('weightPlayLocale',locale);}catch{}applyCopy();}});
window.addEventListener('wonder:locale-change',e=>{const value=e.detail?.locale||window.WonderI18n?.actualLocale?.();if(COPY[value]){locale=value;applyCopy();}});
document.addEventListener('keydown',e=>{
  if(modalKind){if(e.key==='Escape'&&modalKind==='leave'){e.preventDefault();closeModal();}if(e.key==='Tab'){const buttons=[...$('modalActions').querySelectorAll('button:not(:disabled)')],first=buttons[0],last=buttons.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}return;}
  if(screen!=='battle'||e.repeat||e.ctrlKey||e.metaKey||e.altKey||e.target.closest('select,input,.wp-frame-popover'))return;
  if(/^[1-4]$/.test(e.key)){e.preventDefault();place(Number(e.key)-1);}
  if(e.key==='Escape'){e.preventDefault();back();}
});
document.addEventListener('visibilitychange',()=>{if(document.hidden){persistRun();audio?.stop();document.querySelectorAll('#battleScreen *').forEach(n=>n.getAnimations?.().forEach(a=>a.cancel()));}});
window.addEventListener('pagehide',e=>{persistRun();if(!e.persisted){stageUI?.destroy();audio?.dispose();}});
window.WeightPlayAudio?.preload(['board.move','feedback.error','feedback.hint','game.start','result.win','reward.unlock']);
setScreen('main');applyCopy();
