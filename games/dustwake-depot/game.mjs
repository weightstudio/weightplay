import {STAGES, TOOLS, starsForElapsed} from './campaign.mjs';
import {createRun} from './core.mjs';
import {mountRenderer} from './render.mjs';
import {LOCALES, ROUTES, text, title, stageCopy, notice, renderStaticGuide} from './copy.mjs';
import {LocalPractice} from '../../src/game-local-practice.mjs';

const GAME_ID = 'dustwake-depot';
const SAVE_KEY = 'weightplay:dustwake-depot:v1';
const SKU = 'dustwake-depot:amber-garden';
const $ = id => { const node = document.getElementById(id); if (!node) throw Error(`DUSTWAKE_NODE:${id}`); return node; };
const params = new URLSearchParams(location.search);
const local = ['localhost','127.0.0.1','[::1]'].includes(location.hostname);
const practiceSession = local && params.get('practice') === '1';
const preview = params.getAll('preview').length === 1 && params.get('preview') === '1';
const abort = new AbortController();
const listen = (node, name, handler, options = {}) => node.addEventListener(name, handler, {...options, signal:abort.signal});
const roots = {main:$('mainScreen'),stage:$('stageScreen'),battle:$('battleScreen')};
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const routeLocale = ROUTES.indexOf(location.pathname.split('/')[1]);
let locale = routeLocale >= 0 ? LOCALES[routeLocale] : window.WonderI18n?.actualLocale?.() || document.documentElement.lang;
if (!LOCALES.includes(locale)) locale = 'en';
const t = (key, vars) => text(locale,key,vars);
let writable = true;
const blank = () => ({schema:1,highestUnlocked:1,cleared:[],bestStars:{},bestTime:{},selectedTool:'breeze',skin:'moss',tutorialSeen:{}});
function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw === null) return blank();
    const value = JSON.parse(raw);
    if (!value || value.schema !== 1 || !Array.isArray(value.cleared) || typeof value.tutorialSeen !== 'object') throw Error('INVALID_SAVE');
    const clean = blank();
    clean.cleared = [...new Set(value.cleared.filter(n=>Number.isInteger(n)&&n>=1&&n<=60))];
    clean.highestUnlocked = Math.max(1,Math.min(60,Number.isInteger(value.highestUnlocked)?value.highestUnlocked:1),...clean.cleared.map(n=>Math.min(60,n+1)));
    clean.selectedTool = TOOLS[value.selectedTool] ? value.selectedTool : 'breeze';
    clean.skin = value.skin === 'amber' ? 'amber' : 'moss';
    for (const id of clean.cleared) {
      const stars = value.bestStars?.[id], time = value.bestTime?.[id];
      if (Number.isInteger(stars)&&stars>=1&&stars<=3) clean.bestStars[id]=stars;
      if (Number.isFinite(time)&&time>0) clean.bestTime[id]=time;
    }
    for (const [key, seen] of Object.entries(value.tutorialSeen || {})) if (/^(basic|wet|gate|portable|press|rule[0-9]+)$/.test(key)&&seen===true) clean.tutorialSeen[key]=true;
    return clean;
  } catch { writable=false; return blank(); }
}
let save = loadSave();
const ownedTool = id => TOOLS[id]?.unlockAfter===0 || save.cleared.includes(TOOLS[id]?.unlockAfter);
if (!ownedTool(save.selectedTool)) save.selectedTool='breeze';
const ownsAmber = () => window.WeightPlayWallet?.owns?.(SKU) === true;
if (!ownsAmber()) save.skin='moss';
let screen='main', tab='stages', selected=save.highestUnlocked-1, run=null, renderer=null, frame=null, selector=null;
let serial=0, resultShown=false, saveSucceeded=false, overlayOpen=false, overlayCancel=null, overlayBusy=false, previousFocus=null;
let backgroundPaused=false, settingsPaused=false, lastFrame=performance.now(), raf=0, disposed=false, statusUntil=0, lastNotice='';
let compressionStarted=null, purchasePending=false, rendererCreates=0, rendererDisposals=0;
let materialImages=null, materialBitmapsCreated=0, materialBitmapsClosed=0;
const pendingMaterialBitmaps=new Set();
function registerLoadingMaterialBitmap(bitmap) {
  materialBitmapsCreated++;
  if(disposed) { bitmap.close();materialBitmapsClosed++;throw Error('DUSTWAKE_ENTRY_DISPOSED'); }
  pendingMaterialBitmaps.add(bitmap);return bitmap;
}
function closeMaterialBitmaps(includeCached=false) {
  const bitmaps=new Set(pendingMaterialBitmaps);
  if(includeCached&&materialImages)for(const bitmap of Object.values(materialImages))bitmaps.add(bitmap);
  for(const bitmap of bitmaps) { bitmap.close();materialBitmapsClosed++; }
  pendingMaterialBitmaps.clear();if(includeCached)materialImages=null;
}
function materialBitmapSnapshot() {
  return {ready:Boolean(materialImages),cachedCount:materialImages?2:0,pendingCount:pendingMaterialBitmaps.size,
    created:materialBitmapsCreated,closed:materialBitmapsClosed,
    dimensions:materialImages?{stone:[materialImages.stone.width,materialImages.stone.height],moss:[materialImages.moss.width,materialImages.moss.height]}:null};
}
const keys=new Set(), renderHistory=[], animations=new Set(), toolCards=new Map(), skinCards=new Map();
const sound = window.WeightPlayAudio?.createScope?.();
function play(id) { sound?.play(id); }
function persist(next=save) {
  if (practiceSession) return false;
  if (!writable) { $('saveWarning').hidden=false; return false; }
  try {
    const serialized=JSON.stringify(next);
    localStorage.setItem(SAVE_KEY,serialized);
    if(localStorage.getItem(SAVE_KEY)!==serialized)throw Error('SAVE_UNCONFIRMED');
    save=next; $('saveWarning').hidden=true; return true;
  } catch { $('saveWarning').hidden=false; return false; }
}
function paused() { return overlayOpen||resultShown||backgroundPaused||settingsPaused||document.hidden; }
function measurement() {
  if(practiceSession)return;
  window.WonderAnalytics?.game?.observeState?.(()=>({screen,node:roots[screen],locale,roundKey:run?serial:null,
    stageId:run?.state.stage.id??null,stageIdAuthoritative:true,started:Boolean(run),ended:Boolean(run&&run.state.status!=='playing'),
    outcome:run?.state.status==='win'?'win':'lose',paused:paused(),rewardEligible:true,saveSucceeded,
    activityMode:'state',keyboardKeys:['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d','W','A','S','D',' ','c','C']}));
}
function animate(node) {
  if(!node?.animate)return;
  const a=node.animate([{opacity:0},{opacity:1}],{duration:reduced.matches?60:180,easing:'ease-out'});
  animations.add(a);a.finished.then(()=>animations.delete(a),()=>animations.delete(a));
}
function stopInput() {
  keys.clear();
  if(run?.state.status==='playing')run.setTarget(run.state.player.x,run.state.player.z);
}
function disposeRenderer() {
  if(!renderer)return;
  const before=renderer.getMetrics();renderer.dispose();const after=renderer.getMetrics();
  renderHistory.push({stage:run?.state.stage.id,before,after});if(renderHistory.length>6)renderHistory.shift();
  renderer=null;rendererDisposals++;sound?.stop();
}
function setScreen(next) {
  if(screen==='battle'&&next!=='battle') { disposeRenderer();run=null;resultShown=false;compressionStarted=null; }
  screen=next; document.body.dataset.screen=next;
  for(const [name,node] of Object.entries(roots))node.hidden=name!==next;
  $('gameGuide').hidden=next!=='main';
  frame.activate(next,{covered:overlayOpen||resultShown});
  if(next==='stage')selector.refresh(selected);
  if(next==='main')$('mainProgress').textContent=t('progress',{stage:save.highestUnlocked,total:60});
  measurement();
}
function status(code, duration=2300) {
  lastNotice=code||'';
  $('statusLine').textContent=code?notice(locale,code):'';statusUntil=performance.now()+duration;
}
function closeOverlay({restore=true}={}) {
  if(!overlayOpen)return;
  // Closing a foreground dialog is an explicit return to play, including after
  // an OS interruption while the dialog was already open.
  if(!document.hidden)backgroundPaused=false;
  overlayOpen=false;overlayCancel=null;overlayBusy=false;$('gameOverlay').hidden=true;
  $('stageWorkspace').inert=false;$('stageTabs').inert=false;$('battleLive').inert=resultShown;
  frame.activate(screen,{covered:resultShown});
  if(restore&&previousFocus?.isConnected&&!previousFocus.disabled)previousFocus.focus({preventScroll:true});
  previousFocus=null;measurement();
}
function showOverlay(heading, body, actions, cancel=null) {
  if(overlayOpen)closeOverlay({restore:false});
  stopInput();previousFocus=document.activeElement;overlayOpen=true;overlayCancel=cancel;
  const overlay=$('gameOverlay');roots[screen].append(overlay);
  $('modalTitle').textContent=heading;$('modalBody').replaceChildren();
  for(const line of Array.isArray(body)?body:[body]) {
    if(line instanceof Node)$('modalBody').append(line);
    else { const p=document.createElement('p');p.textContent=line;$('modalBody').append(p); }
  }
  $('modalActions').replaceChildren();
  for(const action of actions) {
    const button=document.createElement('button');button.type='button';button.textContent=action.label;
    button.addEventListener('click',()=>{if(!overlayBusy)void action.action(button);});$('modalActions').append(button);
  }
  overlay.hidden=false;$('battleLive').inert=true;
  if(screen==='stage') { $('stageWorkspace').inert=true;$('stageTabs').inert=true; }
  frame.activate(screen,{covered:true});animate(overlay.querySelector('.modal-card'));$('modalActions').querySelector('button')?.focus({preventScroll:true});measurement();
}
function pauseDialog() {
  if(!run||run.state.status!=='playing'||overlayOpen)return;
  const resume=()=>{backgroundPaused=false;closeOverlay();$('arena').focus({preventScroll:true});};
  showOverlay(t('leaveTitle'),t('leaveBody'),[
    {label:t('continue'),action:resume},
    {label:t('stages'),action:()=>{closeOverlay({restore:false});setScreen('stage');}}
  ],resume);
}
function tutorial(force=false) {
  const s=run.state.stage, pending=[];
  if(force||!save.tutorialSeen.basic)pending.push(['basic',t('tutorialMove'),t('tutorialBag')]);
  if((force||!save.tutorialSeen.wet)&&s.dust.some(p=>p.kind==='wet'))pending.push(['wet',t('tutorialWet')]);
  if((force||!save.tutorialSeen.gate)&&s.gates.length)pending.push(['gate',t('tutorialGate')]);
  if((force||!save.tutorialSeen.portable)&&s.pads.length)pending.push(['portable',t('tutorialPortable')]);
  if((force||!save.tutorialSeen.press)&&run.state.toolId==='press')pending.push(['press',t('tutorialPress'),t('compressionRule')]);
  if(force||(s.checkpoint&&!save.tutorialSeen[`rule${s.id}`]))pending.push([`rule${s.id}`,...stageCopy(locale,s).details]);
  if(!pending.length)return;
  const finish=()=>{ for(const [key] of pending)save.tutorialSeen[key]=true;persist();closeOverlay();$('arena').focus({preventScroll:true}); };
  showOverlay(force?t('help'):t('tutorialTitle'),pending.flatMap(row=>row.slice(1)),[{label:t('continue'),action:finish}],finish);
}
function stageRecord(index) {
  const stage=STAGES[index],c=stageCopy(locale,stage),cleared=save.cleared.includes(stage.id);
  const locked=stage.id>save.highestUnlocked&&!LocalPractice.enabled;
  return {id:stage.id,kicker:`${t('chapter')} ${stage.chapter} · ${t('stage')} ${stage.id}`,title:c.title,subtitle:c.summary,
    summary:c.chapter,details:c.details,status:cleared?t('cleared'):locked?t('locked'):t('ready'),locked,cleared};
}
function refreshStages() { selector?.setConfig(stageConfig(),selected); }
function stageConfig() { return {gameId:GAME_ID,count:STAGES.length,poster:'/games/dustwake-depot/art/poster.webp',background:'/assets/lobby-block-atmosphere.svg',stage:stageRecord}; }
function setTab(next) {
  tab=next;$('stagePage').hidden=next!=='stages';$('teamPanel').hidden=next!=='team';$('equipmentPanel').hidden=next!=='equipment';
  $('stagePage').classList.toggle('hidden',next!=='stages');
  for(const [id,name] of [['tabTeam','team'],['tabStages','stages'],['tabEquipment','equipment']])$(id).setAttribute('aria-selected',String(name===next));
  const wallet=$('walletBalance').closest('.management-wallet');
  if(next!=='stages') { const panel=$(next==='team'?'teamPanel':'equipmentPanel');panel.querySelector('h2').after(wallet);renderManagement(); }
  if(next==='stages')selector.refresh(selected);
  measurement();
}
function card(container,iconClass,heading,description) {
  const article=document.createElement('article');article.className='management-card';
  const icon=document.createElement('span');icon.className=`tool-icon ${iconClass}`;icon.setAttribute('aria-hidden','true');
  const copy=document.createElement('div');copy.className='management-copy';const h=document.createElement('h3'),p=document.createElement('p'),small=document.createElement('small');
  h.textContent=heading;p.textContent=description;copy.append(h,p,small);
  const button=document.createElement('button');button.type='button';article.append(icon,copy,button);container.append(article);
  return {article,icon,h,p,small,button};
}
function renderManagement() {
  const balance=window.WeightPlayWallet?.read?.();$('walletBalance').textContent=balance?.available?String(balance.diamonds):'—';
  for(const [id,tool] of Object.entries(TOOLS)) {
    const nameKey=`tool${id[0].toUpperCase()+id.slice(1)}`;
    if(!toolCards.has(id)) {
      const nodes=card($('toolList'),`icon-${id}`,t(nameKey),t(`${nameKey}Description`));
      nodes.button.id=`equip-${id}`;
      listen(nodes.button,'click',()=>{if(!ownedTool(id))return;save.selectedTool=id;persist();renderManagement();});
      toolCards.set(id,nodes);
    }
    const nodes=toolCards.get(id),owned=ownedTool(id);nodes.h.textContent=t(nameKey);nodes.p.textContent=t(`${nameKey}Description`);
    nodes.small.textContent=owned?t('free'):t('unlockAfter',{n:tool.unlockAfter});
    nodes.button.textContent=save.selectedTool===id?t('equipped'):owned?t('equip'):t('locked');
    nodes.button.disabled=!owned;nodes.button.setAttribute('aria-pressed',String(save.selectedTool===id));
  }
  for(const id of ['moss','amber']) {
    if(!skinCards.has(id)) {
      const nodes=card($('skinList'),'icon-depot','','');nodes.article.classList.add('skin-card');
      const image=document.createElement('img');image.src=id==='moss'?'/assets/weightplay-character-moss-shell-turtle-block-v1.webp':'/games/dustwake-depot/art/poster.webp';image.alt='';image.width=80;image.height=80;nodes.icon.replaceWith(image);
      nodes.button.id=`skin-${id}`;listen(nodes.button,'click',()=>{if(id==='amber'&&!ownsAmber())purchaseAmber();else{save.skin=id;persist();renderManagement();}});skinCards.set(id,nodes);
    }
    const nodes=skinCards.get(id),owned=id==='moss'||ownsAmber();nodes.h.textContent=t(id==='moss'?'defaultSkin':'amberGarden');
    nodes.p.textContent=id==='moss'?t('noStatsChange'):t('amberDescription');nodes.small.textContent=owned?t('owned'):`${t('price',{n:5})} · ${t('permanent')} · ${t('cosmetic')}`;
    nodes.button.textContent=save.skin===id&&owned?t('equipped'):owned?t('equip'):t('buy');nodes.button.disabled=practiceSession&&!owned;
    nodes.button.setAttribute('aria-pressed',String(save.skin===id&&owned));
  }
  $('managementStatus').textContent=practiceSession?t('practice'):'';
}
function purchaseAmber() {
  if(practiceSession||purchasePending)return;
  if(ownsAmber()){save.skin='amber';persist();renderManagement();return;}
  const cost=document.createElement('p'),diamond=document.createElement('img');diamond.src='/assets/weightplay-diamond.svg';diamond.width=24;diamond.height=24;diamond.alt=t('balance');
  cost.append(diamond,` ${t('price',{n:5})} · ${t('balance')}: ${window.WeightPlayWallet.read().diamonds}`);
  showOverlay(t('purchaseTitle'),[t('purchaseBody'),t('amberDescription'),t('noStatsChange'),cost],[
    {label:t('cancel'),action:()=>closeOverlay()},
    {label:t('confirm'),action:async(button)=>{
      if(purchasePending)return;purchasePending=true;overlayBusy=true;button.disabled=true;
      let result;try{result=await window.WeightPlayWallet.purchasePermanent(SKU,5);}catch{result={ok:false};}
      purchasePending=false;overlayBusy=false;
      if(result?.ok&&ownsAmber()) {save.skin='amber';persist();closeOverlay();renderManagement();play('shop.purchase');}
      else {button.disabled=false;const p=document.createElement('p');p.setAttribute('role','status');p.textContent=result?.reason==='insufficient'?t('insufficient'):t('purchaseError');$('modalBody').append(p);button.focus({preventScroll:true});play('feedback.error');}
    }}
  ],()=>{if(!purchasePending)closeOverlay();});
}
function updateHUD() {
  if(!run)return;
  const s=run.state;
  $('deliveredStat').querySelector('[data-stat-value]').textContent=`${s.delivered} / ${s.stage.target}`;
  $('bagStat').querySelector('[data-stat-value]').textContent=`${s.bagLoad} / ${s.capacity}`;
  $('timeStat').querySelector('[data-stat-value]').textContent=String(Math.ceil(s.timeLeft));
  $('modeButton').querySelector('[data-copy]').textContent=t(s.mode);
  $('modeButton').querySelector('.tool-icon').className=`tool-icon icon-${s.mode}`;
  $('modeButton').setAttribute('aria-pressed',String(s.mode==='brush'));
  $('compressButton').querySelector('[data-copy]').textContent=`${t('toolPress')} ${s.compressionLeft}`;
  $('compressButton').setAttribute('aria-label',t('compressionCount',{n:s.compressionLeft}));
  $('compressButton').disabled=s.toolId!=='press'||!s.compressionLeft;
  $('deployButton').disabled=!s.stage.pads.length||!s.deploymentLeft;
  if(performance.now()>statusUntil) {
    lastNotice='';
    const carried=s.toolId==='press'?`${t('bag')} · ${t('total')}: ${s.bagCargo}`:'';
    if($('statusLine').textContent!==carried)$('statusLine').textContent=carried;
  }
}
function feedback(events) {
  for(const event of events) {
    if(event.type==='collect'||event.type==='brush')play('reward.collect');
    else if(event.type==='deposit') {
      if(lastNotice==='depot-closed'){lastNotice='';statusUntil=0;}
      play('feedback.success');
    }
    else if(event.type==='reject'){status(event.code);play('feedback.error');}
    else if(event.type==='deploy')play('mechanism.unlock');
    else if(event.type==='compress'){compressionStarted=null;play('feedback.success');}
    else if(event.type==='gate'&&event.amount)play('mechanism.unlock');
  }
}
function perform(method,...args) {
  if(screen!=='battle'||!run||paused()||run.state.status!=='playing')return;
  const result=run[method](...args);
  if(result?.ok===false&&result.code&&result.code!=='ended')status(result.code);
  if(method==='compress'&&result?.ok)compressionStarted=run.state.elapsed;
  updateHUD();
}
function deployDialog() {
  if(!run||paused())return;
  const buttons=run.state.stage.pads.map((_,i)=>({label:t('pad',{n:i+1}),action:()=>{closeOverlay();perform('deploy',i);}}));
  buttons.push({label:t('cancel'),action:()=>closeOverlay()});
  showOverlay(t('choosePad'),[t('deployOnce'),...stageCopy(locale,run.state.stage).details.filter(line=>line!==t('seconds',{n:run.state.stage.seconds}))],buttons,()=>closeOverlay());
}
function starsFor(state) { return starsForElapsed(state.stage.id,state.elapsed); }
function finishRound() {
  if(resultShown||!run)return;
  resultShown=true;stopInput();const state=run.state,won=state.status==='win',stars=won?starsFor(state):0;
  const newTool=won&&!practiceSession&&!save.cleared.includes(state.stage.id)?Object.values(TOOLS).find(tool=>tool.unlockAfter===state.stage.id):null;
  if(won&&!practiceSession) {
    const next={...save,cleared:[...new Set([...save.cleared,state.stage.id])],bestStars:{...save.bestStars},bestTime:{...save.bestTime},tutorialSeen:{...save.tutorialSeen},highestUnlocked:Math.max(save.highestUnlocked,Math.min(60,state.stage.id+1))};
    next.bestStars[state.stage.id]=Math.max(next.bestStars[state.stage.id]||0,stars);
    next.bestTime[state.stage.id]=Math.min(next.bestTime[state.stage.id]||Infinity,state.elapsed);
    saveSucceeded=persist(next);
    if(saveSucceeded)window.WonderAnalytics?.completeStage?.(state.stage.id);
  }
  $('resultTitle').textContent=won?t('win'):state.notice==='time-up'?t('lose'):t('stageRule');
  $('resultStars').dataset.outcome=won?'win':'lose';
  $('resultStars').textContent=won?`${t('stars')} ${stars} / 3`:state.notice==='minimum-load'
    ?t('strandedLoadRetry',{have:state.bagCargo,need:state.stage.rules.minLoad})
    :notice(locale,state.notice);
  const unlockCopy=newTool&&saveSucceeded?t('toolUnlocked',{tool:t(`tool${newTool.id[0].toUpperCase()+newTool.id.slice(1)}`)}):'';
  $('resultStats').textContent=`${unlockCopy?unlockCopy+' ':''}${t('delivered')}: ${state.delivered} / ${state.stage.target} · ${t('seconds',{n:state.elapsed.toFixed(1)})} · ${t('starGoals',{three:state.stage.starSeconds[0],two:state.stage.starSeconds[1]})} · ${practiceSession?t('practice'):won?(saveSucceeded?t('saved'):t('saveError')):''}`;
  $('resultNext').disabled=!won||state.stage.id===60||(!practiceSession&&!saveSucceeded);
  $('resultPanel').hidden=false;$('battleLive').inert=true;frame.activate('battle',{covered:true});animate($('resultPanel').querySelector('.modal-card'));
  $('resultStages').focus({preventScroll:true});play(won?'result.win':'result.lose');refreshStages();measurement();
}
async function startStage(index) {
  const attempt=++serial;
  if(practiceSession&&!await LocalPractice.validate()) {if(attempt!==serial)return;showOverlay(t('practice'),t('practice'),[{label:t('stages'),action:()=>{closeOverlay();setScreen('stage');}}]);return;}
  if(attempt!==serial||disposed)return;
  const stage=STAGES[index];if(!stage||(!practiceSession&&stage.id>save.highestUnlocked))return;
  if(overlayOpen)closeOverlay({restore:false});disposeRenderer();stopInput();
  selected=index;saveSucceeded=false;resultShown=false;compressionStarted=null;backgroundPaused=false;settingsPaused=false;statusUntil=0;lastNotice='';
  $('statusLine').textContent='';
  $('resultPanel').hidden=true;$('battleLive').inert=false;
  run=createRun(stage.id,ownedTool(save.selectedTool)?save.selectedTool:'breeze');run.state.skin=ownsAmber()&&save.skin==='amber'?'amber':'moss';
  setScreen('battle');
  try {
    renderer=mountRenderer({container:$('arena'),reducedMotion:reduced.matches,materialImages,onPointer:point=>{
      if(point.phase==='cancel')stopInput();
      else if(point.phase==='down'||point.phase==='move')perform('setTarget',point.x,point.z);
    },onStatus:(state)=>{
      if(state==='contextlost'||state==='error') {stopInput();showOverlay(t('graphicsError'),t(state==='contextlost'?'contextLost':'graphicsError'),[
        {label:t('replay'),action:()=>{closeOverlay({restore:false});void startStage(selected);}},
        {label:t('stages'),action:()=>{closeOverlay({restore:false});setScreen('stage');}}
      ]);}
    }});rendererCreates++;
    renderer.render(run.state,0);updateHUD();
    if(renderer.getMetrics().ready) {
      play('game.start');tutorial();$('arena').focus({preventScroll:true});
    }
  } catch {
    disposeRenderer();showOverlay(t('graphicsError'),t('graphicsError'),[
      {label:t('replay'),action:()=>{closeOverlay({restore:false});void startStage(selected);}},
      {label:t('stages'),action:()=>{closeOverlay({restore:false});setScreen('stage');}}
    ]);
  }
  measurement();
}
function updateLocale() {
  for(const node of document.querySelectorAll('[data-copy]'))node.textContent=t(node.dataset.copy);
  for(const node of document.querySelectorAll('[data-copy-aria]'))node.setAttribute('aria-label',t(node.dataset.copyAria));
  for(const node of document.querySelectorAll('[data-copy-alt]'))node.setAttribute('alt',t(node.dataset.copyAlt));
  for(const node of document.querySelectorAll('[data-dustwake-stat-label]'))node.textContent=t(node.dataset.dustwakeStatLabel);
  const localeSource=document.getElementById('localeSelect');if(localeSource)localeSource.value=locale;
  document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';
  $('mainProgress').textContent=t('progress',{stage:save.highestUnlocked,total:60});
  if($('gameGuide').lang!==locale) {
    const next=document.createRange().createContextualFragment(renderStaticGuide(locale));$('gameGuide').replaceWith(next);
  }
  $('gameGuide').hidden=screen!=='main';
  document.title=`${title(locale)} | WeightPlay`;renderManagement();refreshStages();updateHUD();
}
function loop(now) {
  if(disposed)return;
  const dt=Math.min(.067,Math.max(0,(now-lastFrame)/1000));lastFrame=now;
  if(screen==='battle'&&run&&renderer) {
    if(!paused()&&run.state.status==='playing') {
      const x=(keys.has('ArrowRight')||keys.has('d')?1:0)-(keys.has('ArrowLeft')||keys.has('a')?1:0);
      const z=(keys.has('ArrowDown')||keys.has('s')?1:0)-(keys.has('ArrowUp')||keys.has('w')?1:0);
      if(x||z) {
        const direction=renderer.mapScreenDirection?.(x,z)??{x,z};
        run.setTarget(run.state.player.x+direction.x*.24,run.state.player.z+direction.z*.24);
      }
      run.update(dt);
    }
    const events=run.consumeEvents();feedback(events);
    const compressionProgress=compressionStarted===null?0:Math.min(1,run.state.elapsed-compressionStarted);
    renderer.render({...run.state,events,compressing:compressionStarted!==null,compressionProgress},paused()?0:dt);
    updateHUD();if(run.state.status!=='playing'&&!resultShown)finishRound();
  }
  raf=requestAnimationFrame(loop);
}
function cleanup() {
  if(disposed)return;disposed=true;serial++;cancelAnimationFrame(raf);stopInput();disposeRenderer();closeMaterialBitmaps(true);
  for(const a of animations)a.cancel();animations.clear();selector?.destroy();frame?.destroy();sound?.dispose();abort.abort();
}

updateLocale();
if(practiceSession)window.WonderAnalytics?.setEnabled?.(false);
if(!preview&&!practiceSession) {
  $('comingSoon').hidden=false;$('appRoot').hidden=true;$('gameGuide').hidden=true;
  window.WeightPlayGameEntryLoader?.ready?.();
} else {
  $('comingSoon').hidden=true;$('appRoot').hidden=false;
  // The shared Settings controller supplies its canonical language selector and
  // owns availability checks and navigation. Retire the static source first.
  $('localeSelect').closest('label').remove();
  frame=window.WeightPlayScreenFrame.mount({root:$('appRoot'),playUI:true,scenes:{
    main:{root:roots.main,header:$('mainHeader'),content:$('mainHero')},
    stage:{root:roots.stage,header:$('stageHeader'),content:$('stageWorkspace')},
    battle:{root:roots.battle,header:$('battleHeader'),content:$('battleLive')}
  }});
  const group=window.WeightPlayScreenFrame.createGroup();for(const id of ['deliveredStat','bagStat','timeStat'])group.add($(id));frame.battleTopUI.add(group);
  selector=window.WeightPlayPlayUI.mountStage({page:$('stagePage'),rail:$('stageRail'),selected,config:stageConfig(),isActive:()=>screen==='stage'&&tab==='stages',
    onSelect:(index,meta)=>{selected=index;if(meta?.locked)$('managementStatus').textContent=t('locked');},onStart:index=>void startStage(index)});
  listen($('startGame'),'click',()=>{selected=save.highestUnlocked-1;setTab('stages');setScreen('stage');});
  listen($('stageBack'),'click',()=>setScreen('main'));listen($('battleBack'),'click',()=>run?.state.status==='playing'?pauseDialog():setScreen('stage'));
  for(const [id,name] of [['tabTeam','team'],['tabStages','stages'],['tabEquipment','equipment']])listen($(id),'click',()=>setTab(name));
  listen($('modeButton'),'click',()=>perform('setMode',run?.state.mode==='vacuum'?'brush':'vacuum'));
  listen($('compressButton'),'click',()=>perform('compress'));listen($('deployButton'),'click',deployDialog);listen($('helpButton'),'click',()=>tutorial(true));
  listen($('resultStages'),'click',()=>{setTab('stages');setScreen('stage');});
  listen($('resultNext'),'click',()=>{if(!$('resultNext').disabled)void startStage(selected+1);});
  listen($('resultReplay'),'click',()=>{window.WonderAnalytics?.game?.markRestart?.();void startStage(selected);});
  listen(window,'wonder:locale-change',event=>{const next=event.detail?.locale;if(LOCALES.includes(next)){locale=next;updateLocale();frame.refresh();measurement();}});
  listen(window,'weightplay:wallet-change',renderManagement);
  listen(window,'weightplay:interaction-state',()=>{settingsPaused=Boolean(roots.battle.querySelector('.wp-frame-popover:not([hidden])'));if(settingsPaused)stopInput();measurement();});
  listen(document,'keydown',event=>{
    if(event.defaultPrevented)return;
    const panel=overlayOpen?$('gameOverlay'):resultShown?$('resultPanel'):null;
    if(panel&&!panel.hidden) {
      if(event.key==='Escape'&&overlayOpen&&overlayCancel&&!overlayBusy){event.preventDefault();overlayCancel();return;}
      if(event.key==='Tab'){const nodes=[...panel.querySelectorAll('button:not([disabled]),a[href],select')].filter(n=>n.getClientRects().length);const first=nodes[0],last=nodes.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}}return;
    }
    if(screen!=='battle'||!run||event.ctrlKey||event.metaKey||event.altKey||event.target.closest('input,textarea,select'))return;
    if((event.key===' '||event.key==='Enter')&&event.target.closest('button,a[href]'))return;
    const key=event.key.length===1?event.key.toLowerCase():event.key;
    if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d'].includes(key)){event.preventDefault();if(!paused())keys.add(key);}
    else if(key===' '&&!event.repeat){event.preventDefault();perform('setMode',run.state.mode==='vacuum'?'brush':'vacuum');}
    else if(key==='c'&&!event.repeat){event.preventDefault();perform('compress');}
    else if(key==='Escape'){event.preventDefault();pauseDialog();}
  });
  listen(document,'keyup',event=>keys.delete(event.key.length===1?event.key.toLowerCase():event.key));
  listen(document,'visibilitychange',()=>{if(document.hidden){backgroundPaused=true;stopInput();}else if(backgroundPaused&&screen==='battle'&&run?.state.status==='playing'&&!overlayOpen)pauseDialog();measurement();});
  listen(window,'blur',()=>{if(screen==='battle'&&run?.state.status==='playing'){backgroundPaused=true;stopInput();measurement();}});
  listen(window,'focus',()=>{if(backgroundPaused&&screen==='battle'&&run?.state.status==='playing'&&!overlayOpen)pauseDialog();});
  listen(window,'pagehide',event=>{if(!event.persisted)cleanup();else{backgroundPaused=true;stopInput();}});
  listen(window,'pageshow',event=>{if(event.persisted&&screen==='battle'&&run?.state.status==='playing')pauseDialog();});
  Object.defineProperty(window,'DustwakeMetrics',{configurable:true,value:()=>({current:renderer?.getMetrics()??null,rendererCreates,rendererDisposals,history:[...renderHistory],materialBitmapCache:materialBitmapSnapshot(),activeLoops:!disposed&&raf?1:0})});
  setScreen('main');
  const loader=window.WeightPlayGameEntryLoader;
  loader?.begin?.(4);
  let entryAssetsReady=false;
  try {
    const poster=$('mainHero').querySelector('img');await poster.decode();
    if(disposed)throw Error('DUSTWAKE_ENTRY_DISPOSED');
    loader?.assetProgress?.(1,4);
    const atlas=new Image();atlas.src='/games/dustwake-depot/art/tool-atlas.webp';await atlas.decode();
    if(disposed)throw Error('DUSTWAKE_ENTRY_DISPOSED');
    if(atlas.naturalWidth!==atlas.naturalHeight||atlas.naturalWidth%3!==0)throw Error('DUSTWAKE_ATLAS_GRID_INVALID');
    const cell=atlas.naturalWidth/3,inset=4,materialSide=cell-2*inset;
    if(materialSide<1)throw Error('DUSTWAKE_ATLAS_CROP_INVALID');
    loader?.assetProgress?.(2,4);
    const options={imageOrientation:'flipY',premultiplyAlpha:'none',colorSpaceConversion:'default'};
    const stone=registerLoadingMaterialBitmap(await createImageBitmap(atlas,inset,2*cell+inset,materialSide,materialSide,options));
    loader?.assetProgress?.(3,4);
    const moss=registerLoadingMaterialBitmap(await createImageBitmap(atlas,cell+inset,2*cell+inset,materialSide,materialSide,options));
    loader?.assetProgress?.(4,4);
    materialImages=Object.freeze({stone,moss});pendingMaterialBitmaps.clear();
    entryAssetsReady=true;$('startGame').disabled=false;loader?.ready?.();
  } catch {
    closeMaterialBitmaps();
    if(!disposed) { $('startGame').disabled=true;loader?.fail?.(t('loadingError'),()=>location.reload()); }
  }
  if(entryAssetsReady&&!disposed) {
    await LocalPractice.register({gameId:GAME_ID,stageIds:STAGES.map(s=>s.id),enable:enabled=>{if(disposed)return;refreshStages();if(practiceSession&&!enabled&&run?.state.status==='playing'){backgroundPaused=true;stopInput();}},startStage:id=>startStage(Number(id)-1)});
    if(!disposed) {
      if(!writable)$('saveWarning').hidden=false;
      lastFrame=performance.now();raf=requestAnimationFrame(loop);
    }
  }
}
