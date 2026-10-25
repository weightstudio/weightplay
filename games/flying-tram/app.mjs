import './rebuild-copy.js?v=20261023-v7';
import '../../src/wallet.js';
import {LocalPractice} from '../../src/game-local-practice.mjs';
import {SAVE_KEY,readSave,createFlight,stepFlight,awardFlight,buyLivery,clamp} from './flight-model.mjs?v=20261023-v7';
import {TramScene} from './scene.mjs?v=20261023-v7';

const $=id=>document.getElementById(id), locales=window.FlyingTramLocales, levels=window.FlyingTramLevels;
const stored=()=>{try{return localStorage.getItem(SAVE_KEY);}catch{return null;}};
let save=readSave(stored()), locale=window.WonderI18n?.localeFromPath?.()||window.WonderI18n?.actualLocale?.()||document.documentElement.lang||'en';
if(!locales[locale])locale='en';
const t=(key,vars={})=>{const value=locales[locale]?.[key]??locales.en[key]??key;return typeof value==='string'?value.replace(/\{(\w+)\}/g,(_,name)=>vars[name]??''):value;};
let screen='main', selected=save.unlocked, run=null, scene, selector, modal=null, previousFocus=null;
let raf=0, last=0, accumulator=0, resultDelay=0, hudClock=0, toastClock=0, practice=false, starting=false;
let previewPaint=save.livery, purchaseBusy=false, destroyed=false, sharedPaused=false;
const input={left:false,right:false,boost:false}, held={left:new Set(),right:new Set(),boost:new Set()};
const physicalKeys=new Set(), blockedKeys=new Set();
const sound=window.WeightPlayAudio?.createScope?.();
const play=id=>sound?.play(id);
const lifetime=new AbortController(), listen=(node,event,fn,options={})=>node.addEventListener(event,fn,{...options,signal:lifetime.signal});
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const append=(parent,html)=>parent.insertAdjacentHTML('beforeend',html);

// Game content only. Shared frame, rail, settings and loading geometry stay shared.
append(document.querySelector('.stage-tabs'),'<button id="garageBtn" type="button" data-i18n="garage"></button>');
append(document.querySelector('.board-wrap'),'<div class="scene-hud"><div><span id="phaseBadge"></span><strong id="altitudeValue">1.2 m</strong></div><span id="ringValue"></span><div class="route-track" aria-hidden="true"><i id="routeFill"></i></div></div><div id="launchCard" class="launch-card"><span class="launch-line"></span><strong data-i18n="launchHint"></strong><small data-i18n="flightHelp"></small><div class="launch-charge"><i id="chargeFill"></i></div></div><div id="contactFlash" aria-hidden="true"></div>');
append(document.body,`<section id="garagePanel" class="modal-layer garage-layer" role="dialog" aria-modal="true" aria-labelledby="garageTitle" hidden><div class="garage-card"><div class="garage-heading"><h2 id="garageTitle" data-i18n="garage"></h2><span class="wallet-value"><img src="/assets/weightplay-diamond.svg" alt=""><strong id="walletValue"></strong></span><button id="garageClose" data-i18n="close"></button></div><p data-i18n="garageCopy"></p><div id="garagePreview"></div><div class="paint-options" role="group" aria-labelledby="garageTitle"><button data-paint="sunrise"><span class="paint-swatch sunrise"></span><strong data-i18n="sunrise"></strong></button><button data-paint="mint"><span class="paint-swatch mint"></span><strong data-i18n="mint"></strong></button><button data-paint="midnight"><span class="paint-swatch midnight"></span><strong data-i18n="midnight"></strong></button></div><button id="paintAction" class="primary-action"></button><p id="garageStatus" role="status"></p></div></section>`);
append($('resultPanel').querySelector('.result-card'),'<div id="resultMedals" class="medal-row"></div>');
$('resultPanel').querySelector('.result-card').insertBefore($('resultMedals'),$('resultText'));
$('hint').removeAttribute('aria-live');
$('gameCanvas').setAttribute('aria-describedby','hint');
const garageButton=$('garageBtn');
const frame=window.mountFlyingTramFrame();
garageButton.dataset.wpFrameAction='aux';frame.commonDownButton.add(garageButton);
frame.commonDownButton.element.dataset.wpFrameStageNav='';
$('stageTabsBtn').dataset.wpFrameStageSlot='stages';garageButton.dataset.wpFrameStageSlot='equipment';
const board=document.querySelector('.board-wrap');
function translate(){
  document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';
  document.querySelectorAll('[data-i18n]').forEach(node=>node.textContent=t(node.dataset.i18n));
  document.querySelectorAll('[data-wp-game-title]').forEach(node=>node.textContent=t('title'));
  $('localeSelect').value=locale;document.title=`${t('title')} | WeightPlay`;
  $('pauseBtn').setAttribute('aria-label',t('pause'));$('stageBackBtn').setAttribute('aria-label',t('backMain'));$('battleBackBtn').setAttribute('aria-label',t('backStages'));
  $('leftBtn').setAttribute('aria-label',t('tiltLeft'));$('rightBtn').setAttribute('aria-label',t('tiltRight'));$('boostBtn').setAttribute('aria-label',t('boostLabel'));$('gameCanvas').setAttribute('aria-label',t('flightHelp'));
  updateProgress();frame.refresh?.();
}
function updateProgress(){
  const best=Math.max(...save.best);$('mainProgress').textContent=best?t('mainBest',{n:best}):t('mainPrompt');
  $('stageSummary').textContent=t('stageProgress',{n:save.unlocked+1,best});
  const route=t('routes')[selected];$('chapterKicker').textContent=t('routeKicker',{n:selected+1});$('chapterTitle').textContent=route.name;$('chapterRule').textContent=route.rule;
}
function saveProgress(next){
  try{localStorage.setItem(SAVE_KEY,JSON.stringify(next));save=next;return true;}catch{return false;}
}
function clearInput(){for(const key in held){held[key].clear();input[key]=false;}$('leftBtn').classList.remove('pressed');$('rightBtn').classList.remove('pressed');$('boostBtn').classList.remove('pressed');}
function setInput(key,token,active){
  if(active&&(screen!=='battle'||modal||sharedPaused||run?.outcome))return;
  active?held[key].add(token):held[key].delete(token);input[key]=held[key].size>0;$(key==='left'?'leftBtn':key==='right'?'rightBtn':'boostBtn').classList.toggle('pressed',input[key]);
}
function schedule(){if(!raf&&!destroyed){last=performance.now();raf=requestAnimationFrame(loop);}}
function show(next){
  closeModal();clearInput();sound?.stop();scene?.clearEffects();clearTokens();toastClock=0;$('toast').classList.remove('show');
  screen=next;document.body.dataset.screen=next;frame.activate(next);
  $('mainGroup').hidden=next!=='main';$('stageScreen').hidden=next!=='stage';$('battleScreen').hidden=next!=='battle';$('mainGuide').hidden=next!=='main';
  for(const type of ['main','stage','battle'])document.body.classList.toggle(`wp-shell-${type}-active`,type===next);
  document.body.classList.toggle('wp-stage-select-active',next==='stage');
  document.documentElement.style.overflow=next==='main'?'':'hidden';document.body.style.position=next==='main'?'':'fixed';document.body.style.inset=next==='main'?'':'0';document.body.style.width='100%';
  for(const name of ['shell','stage','battle'])window.dispatchEvent(new Event(`weightplay:${name}-sync`));
  window.scrollTo({top:0,left:0,behavior:'instant'});updateProgress();
  if(next==='stage'){selector.refresh(selected);requestAnimationFrame(()=>selector.refresh(selected));}
  if(next==='battle'){scene.resize();schedule();}else{cancelAnimationFrame(raf);raf=0;}
}
function inertBackground(active){
  $('gameFrame').inert=active&&modal?.id==='garagePanel';
  for(const id of ['mainGroup','stageScreen','mainGuide','battleLive'])$(id).inert=active;
  document.querySelector('.battle-canvas > header').inert=active;
}
function openModal(id){
  if(modal)closeModal();for(const key of physicalKeys)blockedKeys.add(key);clearInput();previousFocus=document.activeElement;modal=$(id);modal.hidden=false;
  // Battle dialogs remain in their canvas; only their live siblings are inert.
  inertBackground(true);sound?.stop();modal.querySelector('button:not(:disabled)')?.focus();schedule();
}
function closeModal(){
  if(!modal)return;
  const garage=modal.id==='garagePanel';modal.hidden=true;modal=null;inertBackground(false);
  if(garage){board.prepend($('gameCanvas'));scene?.setGarage(false);scene?.livery(save.livery);}
  previousFocus?.isConnected&&previousFocus.focus();previousFocus=null;clearInput();last=performance.now();accumulator=0;
  if(screen!=='battle'){cancelAnimationFrame(raf);raf=0;}
}
for(const id of ['pausePanel','leavePanel','resultPanel'])document.querySelector('.battle-canvas').append($(id));
append(document.querySelector('.battle-canvas'),'<section id="renderErrorPanel" class="modal-layer" role="dialog" aria-modal="true" aria-labelledby="renderErrorTitle" hidden><div class="dialog-card"><h2 id="renderErrorTitle" data-i18n="renderError"></h2><div class="modal-actions"><button id="renderRetry" type="button" data-i18n="retry"></button><button id="renderExit" type="button" data-i18n="close"></button></div></div></section>');
selector=window.WeightPlayPlayUI.mountStage({page:$('stageWorkspace'),rail:$('stageRail'),
  config:window.FlyingTramStageConfig({save:()=>({...save,unlocked:practice?levels.length-1:save.unlocked}),text:t}),
  selected,isActive:()=>screen==='stage'&&!modal,onSelect(index){selected=index;updateProgress();},onStart:index=>start(index)});

async function start(index){
  if(starting||index<0||index>=levels.length)return;
  starting=true;
  try{
    if(practice&&!await LocalPractice.validate())return;
    if(!practice&&index>save.unlocked)return;
    selected=index;run=createFlight(levels[index]);run.practice=practice;resultDelay=0;accumulator=0;hudClock=0;
    scene.reset(run);scene.livery(save.livery);$('stageLabel').textContent=t('routes')[index].name;
    show('battle');updateHUD();play('game.start');
  }finally{starting=false;}
}
function toast(text){$('toast').textContent=text;$('toast').classList.add('show');toastClock=2.2;}
function clearTokens(){document.querySelectorAll('.flight-score-token').forEach(n=>{n.getAnimations().forEach(a=>a.cancel());n.remove();});}
function scoreToken(points,event){
  if(reduced.matches)return;
  const from=$('gameCanvas').getBoundingClientRect(),to=$('scoreLabel').getBoundingClientRect();
  const token=document.createElement('span');token.className='flight-score-token';token.textContent=`+${points}`;document.body.append(token);
  const point=scene.project(event.x||0,event.y||run.y);
  const x=from.left+from.width*point.x,y=from.top+from.height*point.y;
  token.style.left=`${x}px`;token.style.top=`${y}px`;
  const animation=token.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${to.left+to.width/2-x}px,${to.top-y}px) scale(.5)`,opacity:0}],{duration:550,easing:'cubic-bezier(.2,.7,.3,1)'});
  animation.finished.then(()=>token.remove(),()=>token.remove());
}
function events(){
  for(const event of run.events.splice(0)){
    if(['ring','flip','hit','land','launch'].includes(event.type))scene.event(event);
    if(event.type==='launch')play('movement.jump');
    if(event.type==='ring'){play('reward.collect');scoreToken(300,event);}
    if(event.type==='flip'){play('feedback.success');toast(t('flip',{n:run.flips}));scoreToken(650,event);}
    if(event.type==='hit'){play('impact.metal');toast(t(event.reason));$('contactFlash').getAnimations().forEach(a=>a.cancel());$('contactFlash').animate([{opacity:.45},{opacity:0}],{duration:180});}
    if(event.type==='approach'){play('alert.warning');toast(t('landingHint'));}
    if(event.type==='land'){play('movement.land');resultDelay=.8;}
    if(event.type==='fail'){play('feedback.error');resultDelay=.6;}
  }
}
function updateHUD(){
  if(!run)return;
  $('scoreLabel').textContent=String(Math.round(run.score));$('timeValue').textContent=String(Math.max(0,Math.ceil(run.duration-run.elapsed)));
  const tea=Math.round(100-run.spill),meter=$('cupFill').parentElement;
  $('cupFill').style.width=`${tea}%`;$('cupFill').style.background=tea>65?'#61d7b5':tea>35?'#f2c975':'#e58474';$('teaValue').textContent=`${tea}%`;
  meter.setAttribute('role','meter');meter.setAttribute('aria-label',t('tea'));meter.setAttribute('aria-valuemin','0');meter.setAttribute('aria-valuemax','100');meter.setAttribute('aria-valuenow',String(tea));
  $('altitudeValue').textContent=`${run.y.toFixed(1)} m`;$('ringValue').textContent=t('ringCount',{n:run.rings});
  $('phaseBadge').textContent=t(run.phase==='ready'?'ready':run.phase==='approach'?'approach':run.phase==='finished'?(run.outcome.won?'winTitle':'loseTitle'):'cruise');$('phaseBadge').dataset.phase=run.phase;
  $('routeFill').style.width=`${run.progress*100}%`;$('launchCard').hidden=run.phase!=='ready';$('chargeFill').style.width=`${run.charge*100}%`;
  let hint=run.phase==='ready'?t('launchHint'):run.phase==='approach'?t('landingHint'):run.phase==='finished'?t(run.outcome.reason):t('flightHint');
  const hazard=run.gates.find(h=>!h.passed&&h.at-run.progress<.13);
  if(hazard&&run.phase!=='approach')hint=t(hazard.lane==='low'?'hazardRise':'hazardLower');
  else if(run.thermalForce)hint=t(run.thermalForce>0?'thermalUp':'thermalDown');
  $('hint').textContent=hint;$('readout').textContent=`${t('windShort')} ${run.wind<0?'←':'→'}`;
}
function result(){
  if(run.settled)return;run.settled=true;clearInput();const won=run.outcome.won;
  let persisted=true, unlockedPaint=false;
  if(won&&!run.practice){const next=awardFlight(save,run);unlockedPaint=!save.liveries.includes('mint')&&next.liveries.includes('mint');persisted=saveProgress(next);if(persisted)window.WonderAnalytics?.completeStage?.(String(run.id));}
  play(won?'result.win':'result.lose');
  $('resultTitle').textContent=t(won?'winTitle':'loseTitle');$('resultScore').textContent=run.score;$('resultFlips').textContent=run.flips;$('resultBest').textContent=save.best[run.index];
  $('resultText').textContent=won?t('winCopy',{n:t('routes')[run.index].name}):t(run.outcome.reason);
  $('skillReport').textContent=!persisted?t('saveError'):run.practice?t('practice'):unlockedPaint?t('garageUnlock'):won&&run.checkpoint?t('checkpointCleared'):t('ringCount',{n:run.rings});
  const earned=won?(1|(run.spill<=35?2:0)|(run.rings===3&&run.flips>0?4:0)):0;
  $('resultMedals').replaceChildren();['medalClear','medalTea','medalAir'].forEach((key,i)=>{const cell=document.createElement('span');cell.className=(earned&(1<<i))?'earned':'';cell.textContent=`${(earned&(1<<i))?'◆':'◇'} ${t(key)}`;$('resultMedals').append(cell);});
  $('nextBtn').disabled=!won||run.index===levels.length-1||(!run.practice&&!persisted);openModal('resultPanel');updateProgress();
}
function loop(now){
  raf=0;if(destroyed||!scene)return;
  const dt=Math.min(.05,(now-last)/1000||0);last=now;
  if(modal?.id==='garagePanel')scene.render(null,dt);
  else if(screen==='battle'&&run){
    if(!modal&&!sharedPaused&&!document.hidden){
      accumulator+=dt;while(accumulator>=1/60){stepFlight(run,input,1/60);accumulator-=1/60;}events();
      if(run.outcome&&!run.settled){resultDelay-=dt;if(resultDelay<=0)result();}
      hudClock-=dt;if(hudClock<=0){updateHUD();hudClock=.08;}
      toastClock-=dt;if(toastClock<=0)$('toast').classList.remove('show');
    }
    scene.render(run,dt,Boolean(modal)||sharedPaused);
  }
  if(screen==='battle'||modal?.id==='garagePanel')raf=requestAnimationFrame(loop);
}
function garage(){previewPaint=save.livery;openModal('garagePanel');$('garagePreview').append($('gameCanvas'));scene.setGarage(true);scene.livery(previewPaint);renderGarage();schedule();}
function renderGarage(){
  $('walletValue').textContent=window.WeightPlayWallet.read().diamonds;
  document.querySelectorAll('[data-paint]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.paint===previewPaint)));
  const owned=save.liveries.includes(previewPaint), equipped=save.livery===previewPaint;
  $('paintAction').disabled=purchaseBusy||equipped||(!owned&&previewPaint==='mint')||practice;
  $('paintAction').textContent=t(equipped?'equipped':owned?'equip':previewPaint==='mint'?'mintLock':'buy');
  $('garageStatus').textContent=practice?t('practice'):!owned&&previewPaint==='midnight'?t('garageCopy'):'';
}
async function paint(){
  if(purchaseBusy||practice)return;purchaseBusy=true;renderGarage();
  try{
    if(save.liveries.includes(previewPaint)){if(!saveProgress({...save,livery:previewPaint}))throw Error('save');}
    else if(previewPaint==='midnight'){
      const purchased=(await buyLivery(localStorage,window.WeightPlayWallet));
      if(!purchased.ok){$('garageStatus').textContent=t('funds');play('feedback.error');return;}
      save=purchased.save;play('reward.collect');
    }
    renderGarage();scene.livery(save.livery);
  }catch{$('garageStatus').textContent=t('saveError');play('feedback.error');}
  finally{purchaseBusy=false;$('paintAction').disabled=save.livery===previewPaint||(!save.liveries.includes(previewPaint)&&previewPaint==='mint');}
}

for(const [id,key] of [['leftBtn','left'],['rightBtn','right'],['boostBtn','boost']]){
  const button=$(id);listen(button,'pointerdown',e=>{e.preventDefault();button.setPointerCapture(e.pointerId);setInput(key,e.pointerId,true);});
  for(const event of ['pointerup','pointercancel','lostpointercapture'])listen(button,event,e=>setInput(key,e.pointerId,false));
  listen(button,'contextmenu',e=>e.preventDefault());
}
const keyMap={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',Space:'boost',ArrowUp:'boost',KeyW:'boost'};
listen(window,'keydown',e=>{
  if(keyMap[e.code]){if(blockedKeys.has(e.code)){e.preventDefault();return;}if(!modal)physicalKeys.add(e.code);}
  if(modal){
    if(e.key==='Escape'){e.preventDefault();if(!['resultPanel','renderErrorPanel'].includes(modal.id))closeModal();return;}
    if(e.key==='Tab'){const buttons=[...modal.querySelectorAll('button:not(:disabled),[tabindex="0"]')].filter(n=>n.offsetParent!==null);if(!buttons.length)return;const index=buttons.indexOf(document.activeElement);e.preventDefault();buttons[(index+(e.shiftKey?-1:1)+buttons.length)%buttons.length].focus();}return;
  }
  if(screen==='battle'&&e.key==='Escape'){e.preventDefault();if(!run?.outcome)openModal('pausePanel');return;}
  const key=keyMap[e.code];if(key&&screen==='battle'){e.preventDefault();setInput(key,e.code,true);}
});
listen(window,'keyup',e=>{physicalKeys.delete(e.code);if(blockedKeys.delete(e.code))e.preventDefault();const key=keyMap[e.code];if(key)setInput(key,e.code,false);});
listen(window,'weightplay:interaction-state',()=>{
  sharedPaused=Boolean(document.querySelector('[data-wp-settings][aria-expanded="true"]'));
  if(sharedPaused){clearInput();sound?.stop();}accumulator=0;last=performance.now();
});
const pauseHidden=()=>{clearInput();if(screen==='battle'&&!modal&&!run?.outcome)openModal('pausePanel');};
listen(window,'blur',pauseHidden);listen(document,'visibilitychange',()=>{if(document.hidden)pauseHidden();});
const click=(id,fn)=>listen($(id),'click',fn);
click('startBtn',()=>{selected=save.unlocked;show('stage');});click('stageBackBtn',()=>show('main'));
click('battleBackBtn',()=>run?.outcome?show('stage'):openModal('leavePanel'));
click('pauseBtn',()=>{if(!run?.outcome)openModal('pausePanel');});click('resumeBtn',closeModal);click('leaveContinueBtn',closeModal);
for(const id of ['leaveStagesBtn','pauseStagesBtn','resultStagesBtn'])click(id,()=>{selected=save.unlocked;run=null;show('stage');});
click('retryBtn',()=>start(selected));click('nextBtn',()=>start(selected+1));click('garageBtn',garage);click('garageClose',closeModal);click('paintAction',paint);
click('renderRetry',()=>location.reload());click('renderExit',()=>location.assign('/'));
document.querySelectorAll('[data-paint]').forEach(b=>listen(b,'click',()=>{previewPaint=b.dataset.paint;scene.livery(previewPaint);renderGarage();}));
listen($('localeSelect'),'change',()=>{locale=$('localeSelect').value;translate();selector.refresh(selected);});
listen(window,'storage',e=>{if(e.key===SAVE_KEY){save=readSave(stored());updateProgress();if(screen==='stage')selector.refresh(selected);}});
listen(reduced,'change',()=>{if(scene){scene.reduced=reduced.matches;scene.clearEffects();}clearTokens();});
listen($('gameCanvas'),'webglcontextlost',e=>{e.preventDefault();clearInput();openModal('renderErrorPanel');});
listen($('gameCanvas'),'webglcontextrestored',()=>{location.reload();});
listen(window,'pagehide',event=>{clearInput();sound?.stop();if(event.persisted){pauseHidden();return;}destroyed=true;cancelAnimationFrame(raf);clearTokens();scene?.dispose();selector?.destroy?.();sound?.dispose();lifetime.abort();});
translate();
window.WeightPlayGameEntryLoader?.begin?.(1);
try{
  scene=new TramScene($('gameCanvas'));scene.livery(save.livery);show('main');
  window.WeightPlayAudio?.preload?.(['movement.jump','movement.land','impact.metal','reward.collect']);
  $('loadingPanel').hidden=true;window.WeightPlayGameEntryLoader?.assetProgress?.(1,1);window.WeightPlayGameEntryLoader?.ready?.();
}catch(error){window.WeightPlayGameEntryLoader?.fail?.(t('renderError'),()=>location.reload());throw error;}
await LocalPractice.register({gameId:'flying-tram',stageIds:levels.map(l=>l.id),enable:enabled=>{practice=enabled;selector.refresh(selected);},startStage:id=>start(Number(id)-1)});
