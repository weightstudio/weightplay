import {STAGES, VEHICLES, UPGRADE_KEYS, UPGRADE_COSTS, GAME_VERSION, campaignStars} from './data.mjs';
import {createRace, buildTrack, stepRace, pauseRace, resumeRace, recoverCar, STEP} from './physics.mjs';
import {SaveStore} from './store.mjs';
import {RaceInput} from './input.mjs';
import {RaceAudio} from './audio.mjs';
import {CATALOG, LOCALE_ORDER, LOCALE_NAMES, detectLocale, translate} from './locales.mjs';
import {renderGuide} from './guide.mjs';

const $ = id => document.getElementById(id);
const POSTER_URL = new URL('../../Assets/block-apex-poster.webp', import.meta.url).href;
const UPGRADE_ICON_URLS = Object.freeze({
  engine:new URL('../../Assets/block-apex-engine-upgrade.webp',import.meta.url).href,
  tires:new URL('../../Assets/block-apex-tire-upgrade.webp',import.meta.url).href,
  tank:new URL('../../Assets/block-apex-nitro-upgrade.webp',import.meta.url).href,
});
const life = new AbortController();
const listen = (node, type, fn, options={}) => node.addEventListener(type, fn, {...options, signal:life.signal});
const store = new SaveStore();
let locale = detectLocale(), screen = 'main', tab = 'stages', modalKind = null;
let frame, rail, race = null, renderer = null, sound = null, input;
let generation = 0, raf = 0, lastFrame = 0, accumulator = 0, disposed = false;
let settingsPaused = false, feedbackUntil = 0, selectedStage = 1;
let tutorialWaitTimer = 0, waitingForTutorial = false, tutorialWasOpened = false, tutorialPausedRace = false;
let enginePromise = null, busy = false, hudClock = 0, lastCountdown = null;
const art = new Map(), tracks = new Map();
const t = (key, values={}) => translate(locale, key, values);
const text = (tag, value, className='') => { const node=document.createElement(tag); node.textContent=value; if(className)node.className=className; return node; };
const trackFor = stage => {const key=`${stage.track}:${stage.reverse}`;if(!tracks.has(key))tracks.set(key,buildTrack(stage.track,stage.reverse));return tracks.get(key);};
const stageTitle = stage => `${stage.id} · ${CATALOG[locale].names[stage.track]}${stage.reverse ? ` · ${CATALOG[locale].names[11]}` : ''}`;
function goals(stage) {
  return [['finish',t('finishGoal',{n:stage.laps})],
    ...(stage.rivals ? [['position',t('placeGoal',{n:stage.place})]] : []),
    ...(stage.drift ? [['drift',t('driftGoal',{n:stage.drift})]] : []),
    ...(stage.collect ? [['rings',t('ringGoal',{n:stage.collect})]] : []),
    ...(Number.isFinite(stage.contactCap) ? [['clean',t('cleanGoal',{n:stage.contactCap})]] : []),
    ['time',t('timeGoal',{n:stage.limit})]];
}

// A bounded import timeout leaves navigation available even when a dependency fails.
async function engine() {
  if(!enginePromise)enginePromise=import('./renderer.mjs').catch(error=>{enginePromise=null;throw error;});
  let timer;
  try{return await Promise.race([enginePromise,new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('ENGINE_LOAD_TIMEOUT')),12000);})]);}
  finally{clearTimeout(timer);}
}
function syncStorage() {
  $('storageWarning').hidden=store.available;
  $('mainProgress').textContent=t('progress',{n:store.data.unlocked});
  const summary=`${t('coins')}: ${store.data.coins} · ${t('stars')}: ${campaignStars(store.data)}`;
  $('garageSummary').textContent=summary;$('tuningSummary').textContent=summary;
  $('stageStorageWarning').hidden=store.available;
}
function localize() {
  document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';
  document.title=`${t('title')} | WeightPlay`;
  document.querySelector('meta[name="description"]').content=t('pitch');
  for(const node of document.querySelectorAll('[data-i18n]'))node.textContent=t(node.dataset.i18n);
  for(const node of document.querySelectorAll('[data-i18n-aria]'))node.setAttribute('aria-label',t(node.dataset.i18nAria));
  $('poster').alt=t('title');$('localeSelect').value=locale;
  renderGuide($('guide'),locale,t);syncStorage();
  if(rail)rail.refresh();renderManagement();frame?.refresh();
}
function activate(name) {
  screen=name;document.body.dataset.screen=name;
  for(const key of ['main','stage','battle'])$(key+'Screen').hidden=key!==name;
  $('guide').hidden=name!=='main';
  frame.activate(name,{covered:name==='battle'&&modalKind!==null});
  window.dispatchEvent(new Event('resize'));
}
function selectTab(name, focus=false) {
  tab=name;
  for(const value of ['garage','stages','tuning']) {
    const active=value===name, button=$(value+'Tab');
    $(value+'Panel').hidden=!active;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;
    button.classList.toggle('active',active);
  }
  if(name==='stages'){rail.refresh();rail.center(store.data.unlocked-1);}
  else renderManagement();
  if(focus)$(name+'Tab').focus({preventScroll:true});
}
function drawMap(canvas, track, cars=[]) {
  const context=canvas.getContext('2d');if(!context)return;
  const width=canvas.width,height=canvas.height;
  const xs=track.points.map(p=>p.x),zs=track.points.map(p=>p.z);
  const minX=Math.min(...xs),maxX=Math.max(...xs),minZ=Math.min(...zs),maxZ=Math.max(...zs);
  const scale=Math.min((width-24)/(maxX-minX),(height-24)/(maxZ-minZ));
  const ox=(width-(maxX-minX)*scale)/2,oy=(height-(maxZ-minZ)*scale)/2;
  const xy=p=>[ox+(p.x-minX)*scale,height-oy-(p.z-minZ)*scale];
  context.clearRect(0,0,width,height);context.lineCap='round';context.lineJoin='round';
  context.beginPath();track.points.forEach((p,i)=>{const [x,y]=xy(p);i?context.lineTo(x,y):context.moveTo(x,y);});
  context.strokeStyle='#17243a';context.lineWidth=10;context.stroke();context.strokeStyle='#9cddd9';context.lineWidth=4;context.stroke();
  const [sx,sy]=xy(track.gates[0]);context.fillStyle='#f5c84c';context.fillRect(sx-4,sy-4,8,8);
  for(const car of [...cars].reverse()) {const [x,y]=xy(car);context.beginPath();context.arc(x,y,car.id===0?4.5:3,0,Math.PI*2);context.fillStyle=car.id===0?'#ffffff':'#fa8468';context.fill();}
}
function bindStage(card,index) {
  const stage=STAGES[index], record=store.data.records[stage.id], unlocked=stage.id<=store.data.unlocked;
  card.className='stage-card apex-stage-card';card.dataset.stage=String(stage.id);
  card.setAttribute('aria-disabled',String(!unlocked));card.classList.toggle('locked',!unlocked);
  card.dataset.wpStageRecommended=String(stage.id===store.data.unlocked);
  const content=document.createElement('div');content.dataset.wpItemContent='';
  const map=document.createElement('canvas');map.width=192;map.height=116;map.className='apex-track-map';map.setAttribute('aria-hidden','true');
  content.append(map,text('strong',stageTitle(stage)),text('span',record?'★'.repeat(record.stars)+'☆'.repeat(3-record.stars):t(unlocked?'ready':'locked')));
  const objective=text('small',goals(stage).map(([,label])=>label).join(' · '));content.append(objective);
  if(record)content.append(text('small',`${t('best')}: ${record.best.toFixed(1)} s`));
  card.replaceChildren(content);card.setAttribute('aria-label',`${stageTitle(stage)}. ${objective.textContent}. ${t(unlocked?'ready':'locked')}`);
  drawMap(map,trackFor(stage));
}
function renderManagement() {
  if(!input)return;
  syncStorage();const stars=campaignStars(store.data);
  $('vehicles').replaceChildren(...VEHICLES.map((vehicle,index)=>{
    const card=document.createElement('button');card.type='button';card.className='apex-item';card.dataset.vehicle=String(index);
    const allowed=stars>=vehicle.stars;card.setAttribute('aria-disabled',String(!allowed));card.setAttribute('aria-pressed',String(index===store.data.vehicle));
    const content=document.createElement('div');content.dataset.wpItemContent='';
    if(art.has(index)){const img=new Image();img.src=art.get(index);img.alt='';img.width=192;img.height=192;content.append(img);}
    content.append(text('strong',CATALOG[locale].names[7+index]),text('span',index===store.data.vehicle?t('selected'):allowed?t('select'):t('unlocks',{n:vehicle.stars})));
    content.append(text('small',`${t('speed')}: ${Math.round(vehicle.speed*3.6)} km/h · ${t('acceleration')}: ${vehicle.acceleration} · ${t('grip')}: ${vehicle.grip}`));
    card.append(content);return card;
  }));
  $('upgrades').replaceChildren(...UPGRADE_KEYS.map(key=>{
    const level=store.data.tuning[key],cost=UPGRADE_COSTS[level],card=document.createElement('button');
    card.type='button';card.className='apex-item';card.dataset.upgrade=key;
    card.setAttribute('aria-disabled',String(level>=5||store.data.coins<cost));
    const content=document.createElement('div');content.dataset.wpItemContent='';
    const icon=new Image();icon.src=UPGRADE_ICON_URLS[key];icon.alt='';icon.width=64;icon.height=64;icon.className='apex-upgrade-icon';icon.setAttribute('aria-hidden','true');
    const meter=document.createElement('meter');meter.min=0;meter.max=5;meter.value=level;meter.setAttribute('aria-label',t(key));
    content.append(icon,text('strong',t(key)),meter,text('span',`${level} / 5`),text('small',level===5?t('maximum'):`${t('upgrade')} · ${cost} ${t('coins')}`));
    card.append(content);return card;
  }));
}
async function prepareArt() {
  const token=generation;
  $('poster').src=POSTER_URL;$('poster').hidden=false;$('artStatus').hidden=true;
  $('stageScreen').dataset.wpStageArt=POSTER_URL;$('stageScreen').style.setProperty('--wp-stage-art',`url("${POSTER_URL}")`);
  try {
    const {renderArtwork}=await engine();if(disposed||generation!==token||screen==='battle')return;
    for(let index=0;index<VEHICLES.length;index++) {
      if(!art.has(index))art.set(index,renderArtwork(createRace(1,{vehicle:index,tuning:{}}),256));
    }
    renderManagement();
  } catch(error) {
    $('artStatus').textContent=t('error');$('artStatus').hidden=false;document.body.dataset.apexArtError=error.name||'Error';
  }
}
function stopLoop() {cancelAnimationFrame(raf);raf=0;lastFrame=0;accumulator=0;}
function disposeView() {
  if(!renderer)return;
  renderer.scene?.traverse(node=>{if(node.isInstancedMesh)node.dispose();});
  renderer.dispose();renderer=null;
}
function endRace() {
  generation++;busy=false;clearTutorialWait();stopLoop();input.setEnabled(false);
  sound?.destroy();sound=null;disposeView();race=null;settingsPaused=false;
  hideModal();
}
function toStages() {endRace();activate('stage');selectTab('stages');$('stagesTab').focus({preventScroll:true});syncStorage();if(!art.size)void prepareArt();}
function hideModal() {
  modalKind=null;$('battleOverlay').hidden=true;$('battleContent').inert=false;
  if(screen==='battle')frame.activate('battle');
}
function showModal(kind,title,description) {
  modalKind=kind;input.setEnabled(false);stopLoop();sound?.silence();pauseRace(race);
  $('modalTitle').textContent=title;$('modalText').textContent=description;$('modalDetails').replaceChildren();
  for(const group of ['pause','result','error'])$(group+'Actions').hidden=group!==kind;
  $('battleOverlay').hidden=false;$('battleContent').inert=true;frame.activate('battle',{covered:true});
  $('modal').focus({preventScroll:true});
}
function pause() {
  if(screen!=='battle'||modalKind||busy||!race||race.result)return;
  settingsPaused=false;showModal('pause',t('paused'),t('leaveText',{n:race.stage.id}));
}
function continueRace() {
  if(!race||race.result||busy)return;
  hideModal();settingsPaused=false;resumeRace(race);input.setEnabled(true);
  sound?.unlock();$('arena').focus({preventScroll:true});scheduleLoop();
}
function clearTutorialWait() {
  if(tutorialWaitTimer)window.clearTimeout(tutorialWaitTimer);
  tutorialWaitTimer=0;waitingForTutorial=false;tutorialWasOpened=false;tutorialPausedRace=false;
}
function hasSeenSharedTutorial() {
  try{return localStorage.getItem('weightplay_tutorial_seen_block-apex_v1')==='1';}catch{return false;}
}
function isTutorialAutomationRun() {
  const params=new URLSearchParams(location.search);
  return ['smoke','qa','test'].some(key=>params.has(key));
}
function markTutorialSeen() {
  store.data.tutorial=true;store.persist();syncStorage();
}
function onSharedTutorialOpen(event) {
  if(event.detail?.gameId!=='block-apex'||screen!=='battle'||!race)return;
  if(waitingForTutorial) {
    tutorialWasOpened=true;
    if(tutorialWaitTimer)window.clearTimeout(tutorialWaitTimer);
    tutorialWaitTimer=0;
    return;
  }
  if(modalKind||busy||settingsPaused||race.result)return;
  tutorialPausedRace=true;input.setEnabled(false);stopLoop();sound?.silence();pauseRace(race);
}
function onSharedTutorialClose(event) {
  if(event.detail?.gameId!=='block-apex')return;
  if(waitingForTutorial&&tutorialWasOpened) {
    clearTutorialWait();markTutorialSeen();continueRace();
    return;
  }
  if(!tutorialPausedRace)return;
  tutorialPausedRace=false;
  if(screen==='battle'&&race&&!race.result&&!busy&&!modalKind&&!settingsPaused)continueRace();
}
function failed(error,token) {
  if(disposed||token!==generation||screen!=='battle')return;
  busy=false;disposeView();document.body.dataset.apexError=error?.message||'RENDER_FAILED';
  showModal('error',t('retry'),t('error'));
}
async function startRace(id) {
  if(busy||!Number.isInteger(id)||id<1||id>store.data.unlocked||!STAGES[id-1])return;
  endRace();const token=generation;selectedStage=id;busy=true;
  race=createRace(id,store.data);sound=new RaceAudio();sound.unlock();
  activate('battle');showModal('loading',t('loading'),stageTitle(race.stage));
  $('errorActions').hidden=false;$('errorRetry').disabled=true;
  try {
    const {RaceRenderer}=await engine();if(disposed||token!==generation)return;
    const previous=$('arena'),canvas=previous.cloneNode(false);previous.replaceWith(canvas);
    renderer=new RaceRenderer(canvas,race,{onContextLost:()=>failed(new Error('WEBGL_CONTEXT_LOST'),token)});
    if(token!==generation||!renderer)return;
    renderer.render(race,0,1);busy=false;$('errorRetry').disabled=false;
    updateHud();
    if(!store.data.tutorial&&!hasSeenSharedTutorial()&&!isTutorialAutomationRun()) {
      waitingForTutorial=true;tutorialWasOpened=false;hideModal();
      window.dispatchEvent(new Event('weightplay:battle-open'));
      tutorialWaitTimer=window.setTimeout(()=>{
        tutorialWaitTimer=0;
        if(disposed||token!==generation||!waitingForTutorial)return;
        waitingForTutorial=false;tutorialWasOpened=false;markTutorialSeen();
        showModal('pause',t('help'),t('helpText'));
      },1500);
    } else {
      if(store.data.tutorial||hasSeenSharedTutorial())markTutorialSeen();
      continueRace();
    }
  }catch(error){$('errorRetry').disabled=false;failed(error,token);}
}
function showResult() {
  if(!race?.result||modalKind==='result')return;
  const result=race.result,reward=store.settle(result);syncStorage();
  showModal('result',t(result.success?'win':'lose'),t('summary',{rank:result.rank,time:result.time.toFixed(1),stars:result.stars}));
  const list=document.createElement('ul');list.className='apex-goal-results';
  for(const [key,label]of goals(race.stage)){const li=text('li',`${result.goals[key]?'✓':'✕'} ${label}`);li.dataset.met=String(result.goals[key]);list.append(li);}
  $('modalDetails').append(list,text('p',`${t('reward')}: +${reward} ${t('coins')} · ${t('penalty')}: ${race.penalty.toFixed(0)} s`),text('p',race.stage.id===30&&result.success?t('final'):t('resultHelp')));
  $('resultNext').disabled=!result.success||race.stage.id>=STAGES.length||store.data.unlocked<=race.stage.id;
  sound?.event({type:result.success?'win':'lose'});
  $('resultStages').focus({preventScroll:true});
}
function updateHud() {
  if(!race)return;const p=race.player,s=race.stage;
  $('rankValue').textContent=`${race.rank} / ${race.cars.length}`;
  $('lapValue').textContent=`${Math.min(s.laps,p.completedLaps+1)} / ${s.laps}`;
  $('timeValue').textContent=(race.time+race.penalty).toFixed(1);
  $('speedValue').textContent=String(Math.round(p.speed*3.6));$('nitroMeter').max=p.stats.tank;$('nitroMeter').value=p.nitro;$('driftMeter').value=p.driftBank;
  $('raceObjective').textContent=stageTitle(s);
  $('raceTargets').textContent=[...(s.collect?[t('ringGoal',{n:`${p.ringCount}/${s.collect}`} )]:[]),...(s.drift?[t('driftGoal',{n:`${p.driftSeconds.toFixed(1)}/${s.drift}`} )]:[]),...(Number.isFinite(s.contactCap)?[t('cleanGoal',{n:`${p.contacts}/${s.contactCap}`} )]:[])].join(' · ');
  const count=race.status==='countdown'?Math.ceil(race.countdown):null;
  if(count!==lastCountdown){lastCountdown=count;$('countdown').hidden=count===null;$('countdown').textContent=count===null?'':String(count);}
  if(race.time>=feedbackUntil)$('feedback').textContent='';
  drawMap($('minimap'),race.track,race.cars);
}
function processEvents() {
  for(const event of race.events.splice(0)) {
    if(event.type!=='win'&&event.type!=='lose')sound?.event(event);
    let message='';
    if(event.type==='go')message=t('go');
    if(event.type==='driftBoost')message=t('drift')+' + '+t('nitro');
    if(event.type==='recover')message=t('penalty')+' +3 s';
    if(event.type==='lap')message=t('lap')+' '+Math.min(race.stage.laps,event.value+1)+' / '+race.stage.laps;
    if(message){$('feedback').textContent=message;feedbackUntil=race.time+1.5;}
  }
}
function scheduleLoop() {if(!raf&&!disposed&&race&&renderer&&!modalKind&&!settingsPaused&&!document.hidden)raf=requestAnimationFrame(tick);}
function tick(now) {
  raf=0;if(disposed||screen!=='battle'||!race||!renderer||modalKind||settingsPaused)return;
  const token=generation;const delta=lastFrame?Math.min(.1,Math.max(0,(now-lastFrame)/1000)):0;lastFrame=now;
  try {
    const controls=input.read();if(token!==generation||modalKind||settingsPaused)return;
    accumulator=Math.min(accumulator+delta,STEP*12);
    while(accumulator>=STEP&&race.status!=='result'){stepRace(race,controls,STEP);accumulator-=STEP;}
    processEvents();renderer.render(race,delta,Math.min(1,accumulator/STEP));
    hudClock+=delta;if(hudClock>=.08||race.result){hudClock=0;updateHud();}
    if(race.result){showResult();return;}
    scheduleLoop();
  }catch(error){failed(error,token);}
}

function boot() {
  if(!window.WeightPlayScreenFrame||!window.WeightPlayStageV6)throw new Error('SHARED_RUNTIME_MISSING');
  for(let i=0;i<LOCALE_ORDER.length;i++)$('localeSelect').add(new Option(LOCALE_NAMES[i],LOCALE_ORDER[i]));
  localize();
  frame=window.WeightPlayScreenFrame.mount({root:$('app'),localeSelect:$('localeSelect'),scenes:{
    main:{root:$('mainScreen'),header:$('mainHeader'),content:$('mainContent')},
    stage:{root:$('stageScreen'),header:$('stageHeader'),content:$('stageContent')},
    battle:{root:$('battleScreen'),header:$('battleHeader'),content:$('battleContent'),headerInfo:$('hudStats')}
  }});
  input=new RaceInput($('driveControls'),{pause,recover:()=>{if(race&&!modalKind)recoverCar(race);},gesture:()=>sound?.unlock()});
  rail=window.WeightPlayStageV6.install($('stageRail'),{total:STAGES.length,poolSize:9,initialIndex:()=>store.data.unlocked-1,bind:bindStage,activate:index=>{if(screen==='stage'&&tab==='stages')void startRace(index+1);}});
  if(!rail)throw new Error('STAGE_RAIL_MISSING');
  listen($('start'),'click',()=>{activate('stage');selectTab('stages');});
  listen($('stageBack'),'click',()=>{activate('main');$('start').focus({preventScroll:true});});
  listen($('battleBack'),'click',pause);
  for(const name of ['garage','stages','tuning'])listen($(name+'Tab'),'click',()=>selectTab(name));
  listen(document.querySelector('[data-wp-frame-stage-nav]'),'keydown',event=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();const tabs=['garage','stages','tuning'];const direction=locale==='ar'?-1:1;
    const next=event.key==='Home'?0:event.key==='End'?2:(tabs.indexOf(tab)+(event.key==='ArrowRight'?direction:-direction)+3)%3;
    selectTab(tabs[next],true);
  });
  listen($('vehicles'),'click',event=>{const card=event.target.closest('[data-vehicle]');if(!card)return;const ok=store.select(Number(card.dataset.vehicle));if(!ok)window.WeightPlayAudio?.play('feedback.error');renderManagement();$('vehicles').querySelector(`[data-vehicle="${card.dataset.vehicle}"]`)?.focus({preventScroll:true});});
  listen($('upgrades'),'click',event=>{const card=event.target.closest('[data-upgrade]');if(!card)return;const ok=store.buy(card.dataset.upgrade);window.WeightPlayAudio?.play(ok?'reward.upgrade':'feedback.error');renderManagement();$('upgrades').querySelector(`[data-upgrade="${card.dataset.upgrade}"]`)?.focus({preventScroll:true});});
  listen($('recover'),'click',()=>{if(race&&!modalKind)recoverCar(race);});
  listen($('continue'),'click',continueRace);listen($('leave'),'click',toStages);
  listen($('resultStages'),'click',toStages);listen($('errorStages'),'click',toStages);
  listen($('resultNext'),'click',()=>{if(!$('resultNext').disabled)void startRace(selectedStage+1);});
  listen($('resultReplay'),'click',()=>void startRace(selectedStage));listen($('errorRetry'),'click',()=>void startRace(selectedStage));
  listen($('localeSelect'),'change',event=>{
    const chosen=event.target.value;if(!CATALOG[chosen]||screen!=='main')return;
    locale=chosen;try{localStorage.setItem('weightPlayLocale',locale);}catch{/* Session language remains usable. */}
    const url=new URL(location.href);url.searchParams.set('lang',locale);history.replaceState(null,'',url);
    localize();window.dispatchEvent(new CustomEvent('wonder:locale-change',{detail:{locale}}));
  });
  listen(window,'weightplay:tutorial-open',onSharedTutorialOpen);
  listen(window,'weightplay:tutorial-close',onSharedTutorialClose);
  listen(window,'weightplay:interaction-state',()=>{
    if(screen!=='battle'||!race||modalKind||busy||race.result)return;
    const open=Boolean($('battleHeader').querySelector('.wp-frame-popover:not([hidden])'));
    if(open&&!settingsPaused){settingsPaused=true;pauseRace(race);input.setEnabled(false);stopLoop();sound?.silence();}
    else if(!open&&settingsPaused){settingsPaused=false;resumeRace(race);input.setEnabled(true);scheduleLoop();}
  });
  listen(document,'keydown',event=>{
    if(!modalKind||event.defaultPrevented)return;
    if(event.key==='Escape'&&modalKind==='pause'){event.preventDefault();continueRace();return;}
    if(event.key==='Tab') {
      const nodes=[...$('modal').querySelectorAll('button:not(:disabled),a[href],input,select,[tabindex="0"]')].filter(node=>node.getClientRects().length);
      if(!nodes.length){event.preventDefault();$('modal').focus();return;}
      const first=nodes[0],last=nodes.at(-1);
      if(event.shiftKey&&(document.activeElement===first||document.activeElement===$('modal'))){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&(document.activeElement===last||document.activeElement===$('modal'))){event.preventDefault();first.focus();}
    }
  });
  const background=()=>{if(screen==='battle'&&race&&!race.result&&!modalKind&&!busy){settingsPaused=false;pause();}};
  listen(window,'blur',background);listen(document,'visibilitychange',()=>{if(document.hidden)background();});
  listen(window,'pagehide',event=>{if(event.persisted){background();return;}destroy();});
  listen(window,'pageshow',event=>{if(event.persisted&&!disposed)frame.activate(screen,{covered:!!modalKind});});
  activate('main');renderManagement();document.body.dataset.apexBooted='true';document.body.dataset.apexVersion=GAME_VERSION;
  window.BlockApex=Object.freeze({snapshot:()=>({version:GAME_VERSION,screen,modal:modalKind,stage:race?.stage.id,status:race?.status,time:race?.time,unlocked:store.data.unlocked,
    player:race?{x:race.player.x,z:race.player.z,speed:race.player.speed,gates:race.player.gates,lap:race.player.completedLaps}:null,
    resources:renderer?.metrics()||{renderer:false},raf:!!raf,pool:$('stageRail').children.length})});
  void prepareArt();
}
function destroy() {
  if(disposed)return;endRace();disposed=true;life.abort();input?.destroy();rail?.destroy();frame?.destroy();art.clear();tracks.clear();delete window.BlockApex;
}
try{boot();}catch(error){console.error('Block Apex boot failed',error);$('bootError').hidden=false;document.body.dataset.apexError=error.message;}
