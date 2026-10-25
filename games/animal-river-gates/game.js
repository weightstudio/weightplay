import {STAGES} from './stages.mjs?v=20261023-river-gates-v17';
import {NODES,initialState,transition,reasonFor,outcome,capacity} from './model.mjs?v=20261023-river-gates-v17';
import {STORE_KEY,LOOK_KEY,readCampaign,recordWin,readLook,recoverLook,purchaseLook} from './persistence.mjs?v=20261023-river-gates-v17';
import {fallback} from './copy.mjs?v=20261023-river-gates-v17';
import {LocalPractice} from '../../src/game-local-practice.mjs';

const $=id=>document.getElementById(id);
const locales=window.RIVER_GATES_LOCALES||{};
const localeMap={en:'en','zh-tw':'zh-Hant','zh-cn':'zh-Hans',ja:'ja',ko:'ko',es:'es','pt-br':'pt-BR',fr:'fr',de:'de',it:'it',ru:'ru',hi:'hi',ar:'ar'};
const storage={getItem(key){try{return localStorage.getItem(key);}catch{return null;}},setItem(key,value){localStorage.setItem(key,value);}};
const routeLocale=location.pathname.split('/').map(v=>localeMap[v]).find(Boolean);
let locale=routeLocale||storage.getItem('weightPlayLocale')||'en';
if(!locales[locale])locale='en';
const copy=(key,vars={})=>Object.entries(vars).reduce((s,[k,v])=>s.replaceAll('{'+k+'}',String(v)),locales[locale]?.[key]||fallback[key]||key);
const stageText=(p,field)=>{const key=field==='title'?p.titleKey:field==='arc'?p.arcKey:p.mechanicKey;return copy(key)===key?p[field]:copy(key);};
const nodeLabel=(node,plan=currentStage())=>copy(plan.nodeLabels?.[node]||node);
const copyAction=edge=>locales[locale]?.actionLabels?.[edge.label]||(locale==='en'?edge.label:edge.repair?copy('repair'):nodeLabel(edge.from)+' → '+nodeLabel(edge.to));
const phaseName=phase=>copy(phase==='even'?'evenTideBeats':'oddTideBeats');
const isLocal=['localhost','127.0.0.1','[::1]'].includes(location.hostname);
const practiceRequested=isLocal&&new URLSearchParams(location.search).get('practice')==='1';
let campaign=readCampaign(storage),look=readLook(storage),practiceMode=false;
let stageIndex=0,stageBrowseIndex=0,state=null,undoStack=[],selected=null,screen='main',modal=null;
let frame,stageSelector,scene,lifecycle,locked=false,epoch=0,result=null,disposed=false,purchasing=false;
let previousFocus=null,externalPaused=false,layout=null,bootGeneration=0;
const buttons=new Map(),nodeElements=new Map(),goalElements=new Map();
const audio=window.WeightPlayAudio?.createScope();
const currentStage=()=>STAGES[stageIndex];
const stageUnlocked=i=>Boolean(STAGES[i]&&(practiceMode||STAGES[i].id<=campaign.unlockedThrough));
const playSound=id=>audio?.play(id);
const setStatus=(text='',error=false)=>{$('status').textContent=text;$('status').dataset.error=String(error);};

function syncActivity(){
  const active=screen==='battle'&&!modal&&!externalPaused&&!document.hidden&&$('renderRecovery').hidden;
  // A failed context is independently gated by the renderer.
  scene?.setActive(active);
  lifecycle?.setPaused('scene-away',screen!=='battle');
  lifecycle?.setPaused('modal',Boolean(modal)||externalPaused);
  $('battlePlayWorkspace').inert=Boolean(modal)||screen==='result'||externalPaused;
}
function closeModal({focus=true}={}){
  const old=modal;modal=null;
  ['leaveDialog','stationDialog','resultScreen'].forEach(id=>$(id).hidden=true);
  $('stageList').inert=false;
  $('stationBtn').setAttribute('aria-selected','false');
  $('stageTabButton').setAttribute('aria-selected','true');
  if(old==='stationDialog')frame?.activate('stage',{covered:false});
  if(old==='leaveDialog')frame?.activate('battle',{covered:false});
  syncActivity();if(focus&&previousFocus?.isConnected)previousFocus.focus();
}
function openModal(id,initial){
  previousFocus=document.activeElement;modal=id;$(id).hidden=false;
  if(id==='stationDialog'){$('stageList').inert=true;frame?.activate('stage',{covered:true});}
  else frame?.activate('battle',{covered:true});
  syncActivity();$(initial)?.focus();
}
function show(next){
  closeModal({focus:false});
  if(next!=='battle'&&next!=='result'){epoch++;scene?.cancelMotion();locked=false;audio?.stop();}
  screen=next;document.body.dataset.screen=next;
  $('mainScreen').hidden=next!=='main';$('stageScreen').hidden=next!=='stage';
  $('battleScreen').hidden=next!=='battle'&&next!=='result';
  document.querySelectorAll('.game-page-info').forEach(guide=>{guide.hidden=next!=='main';});
  frame?.activate(next==='result'?'battle':next,{covered:next==='result'});
  if(next==='stage')renderStages();
  if(next==='main')$('mainProgress').textContent=copy('progress',{current:campaign.solved.length,total:30});
  syncActivity();
}
function stageRecord(index){
  const p=STAGES[index],solved=campaign.solved.includes(p.id);
  return {id:p.id,kicker:stageText(p,'arc'),title:stageText(p,'title'),subtitle:copy('stageDemand',{a:p.demands[0],b:p.demands[1]}),
    status:solved?copy('solved'):stageUnlocked(index)?copy('open'):copy('locked'),
    summary:copy('stageReserve',{label:nodeLabel('cistern',p),value:p.reserve,waste:p.wasteMax||0}),
    details:[locale==='en'||locales[locale]?.[p.mechanicKey]?stageText(p,'mechanic'):'',copy('targetMoves',{n:p.par||p.solution.length}),campaign.best[p.id]?copy('bestMoves',{n:campaign.best[p.id]}):''].filter(Boolean),
    poster:'/assets/interface7-redrawn/animal-river-gates.webp',locked:!stageUnlocked(index),cleared:solved};
}
function renderStages(){
  $('progress').textContent=copy('progress',{current:campaign.solved.length,total:30});
  if(!stageSelector)stageSelector=window.WeightPlayPlayUI.mountStage({
    page:$('stageWorkspace'),rail:$('stageList'),selected:stageBrowseIndex,
    config:{count:STAGES.length,poster:'/assets/interface7-redrawn/animal-river-gates.webp',background:'/assets/lobby-block-atmosphere.svg',stage:stageRecord},
    isActive:()=>screen==='stage'&&!modal,
    onSelect(index){stageBrowseIndex=index;},onStart(index){startStage(index);}
  });else stageSelector.refresh(stageBrowseIndex);
}
function renderStatic(){
  document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';document.body.dataset.locale=locale;
  $('localeSelect').value=locale;
  document.querySelectorAll('[data-river-i18n]').forEach(el=>el.textContent=copy(el.dataset.riverI18n));
  $('mainPoster').alt=copy('posterAlt');$('mainProgress').textContent=copy('progress',{current:campaign.solved.length,total:30});
  $('stageTabButton').textContent=copy('stages');
  for(const id of ['backBtn','stageBack','battleBackBtn'])$(id).setAttribute('aria-label',copy('back'));
  for(const [id,key]of [['waitBtn','waitAction'],['undoBtn','undo']]){$(id).setAttribute('aria-label',copy(key));$(id).title=copy(key);}
  $('riverBoard').setAttribute('aria-label',copy('riverGates'));
  $('gateGrid').setAttribute('aria-label',copy('riverGates'));
  $('goals').setAttribute('aria-label',copy('stageDemand',{a:currentStage().demands[0],b:currentStage().demands[1]}));
  if(screen==='stage')renderStages();if(state)renderBattle();
  if(screen==='result')renderResult();if(modal==='stationDialog')renderShop();
}
function positionUI(value){
  layout=value;
  const width=$('riverBoard').clientWidth,height=$('riverBoard').clientHeight;
  if(!width||!height)return;
  const occupied=[];
  for(const [id,p]of Object.entries(value.gates)){
    const el=buttons.get(id);if(!el)continue;
    for(const [dx,dy]of [[0,0],[0,-50],[0,50],[-50,0],[50,0],[-36,-36],[36,36]]){
      const x=Math.max(26,Math.min(width-26,p.x*width+dx)),y=Math.max(26,Math.min(height-26,p.y*height+dy));
      const box={x:x-25,y:y-25,w:50,h:50};
      if(occupied.some(r=>box.x<r.x+r.w&&box.x+box.w>r.x&&box.y<r.y+r.h&&box.y+box.h>r.y))continue;
      el.style.left=x+'px';el.style.top=y+'px';occupied.push(box);break;
    }
  }
  for(const [node,p]of Object.entries(value.nodes)){
    const el=nodeElements.get(node);if(el){
      const w=el.offsetWidth||70,h=el.offsetHeight||40;
      const candidates=[[0,0],[0,-38],[0,38],[50,0],[-50,0],[0,-66],[0,66],[66,-30],[-66,-30]];
      let chosen;
      for(const [dx,dy]of candidates){
        const x=Math.max(w/2+4,Math.min(width-w/2-4,p.x*width+dx)),y=Math.max(h/2+4,Math.min(height-h/2-4,p.y*height+dy));
        const box={x:x-w/2,y:y-h/2,w,h};
        if(!occupied.some(r=>box.x<r.x+r.w&&box.x+box.w>r.x&&box.y<r.y+r.h&&box.y+box.h>r.y)){chosen={x,y,box};break;}
      }
      if(chosen){el.style.left=chosen.x+'px';el.style.top=chosen.y+'px';occupied.push(chosen.box);}
      else{el.style.left=p.x*100+'%';el.style.top=p.y*100+'%';}
    }
  }
}
function buildBoard(){
  const plan=currentStage();buttons.clear();nodeElements.clear();goalElements.clear();
  $('gateGrid').replaceChildren();$('nodeLabels').replaceChildren();$('goals').replaceChildren();
  for(const node of ['gardenA','gardenB','cistern']){
    const goal=document.createElement('div');goal.className='goal';
    const name=document.createElement('span'),value=document.createElement('strong');goal.append(name,value);
    goalElements.set(node,{root:goal,name,value});$('goals').append(goal);
  }
  const visible=new Set(plan.edges.flatMap(e=>[e.from,e.to]));
  for(const node of visible){
    const el=document.createElement('div');el.className='node-label';el.dataset.node=node;
    const name=document.createElement('span'),value=document.createElement('strong');el.append(name,value);
    nodeElements.set(node,el);$('nodeLabels').append(el);
  }
  plan.edges.forEach((edge,index)=>{
    const el=document.createElement('button');el.type='button';el.className='gate-pin';el.dataset.action=edge.id;el.textContent=String(index+1);
    el.addEventListener('click',()=>{
      if(locked||modal||screen!=='battle'||externalPaused)return;
      selected=edge.id;setStatus();renderBattle();
      if(reasonFor(plan,state,edge))playSound('feedback.error');
    });
    buttons.set(edge.id,el);$('gateGrid').append(el);
  });
  scene.build(plan);if(layout)positionUI(layout);
}
function edgeDetail(edge){
  const plan=currentStage(),reason=reasonFor(plan,state,edge);
  const constraints=[];
  const prerequisite=plan.edges.find(e=>edge.requires?.delivered===e.id||(edge.requiresFlag&&e.setsFlag===edge.requiresFlag));
  if(prerequisite)constraints.push(copy('order')+': '+copyAction(prerequisite));
  if(edge.phase)constraints.push(phaseName(edge.phase));
  if(edge.once)constraints.push(copy('oneUse'));
  if(edge.beforeBeat!==undefined)constraints.push(copy('tide')+' ≤ '+edge.beforeBeat);
  if(edge.repair)constraints.push(copy('repairCost',{n:edge.repairCost||1}));
  const delta=edge.repair?copy('repair'):copy('routeReady',{from:nodeLabel(edge.from),to:nodeLabel(edge.to)});
  return [reason?copy('disabled',{reason:copy(reason,{phase:phaseName(edge.phase)})}):delta,...constraints].join(' · ');
}
function renderBattle(){
  if(!state)return;
  const plan=currentStage();
  $('progressPill').textContent=plan.id+' / 30';
  $('battleTideStat').textContent=copy('tide')+' '+state.beat+'/'+plan.beats;
  $('battlePlayWorkspace').dataset.theme=look.owned&&look.selected?'lantern':'willow';
  for(const [node,{root,name,value}]of goalElements){
    const index=NODES.indexOf(node),target=node==='cistern'?plan.reserve:plan.demands[node==='gardenA'?0:1];
    name.textContent=node==='cistern'?copy('reserve'):nodeLabel(node);
    value.textContent=state.water[index]+'/'+target;root.dataset.done=String(state.water[index]>=target);
  }
  for(const [node,el]of nodeElements){
    el.children[0].textContent=nodeLabel(node);
    const current=state.water[NODES.indexOf(node)];
    el.children[1].textContent=node.startsWith('garden')?current+'/'+capacity(plan,node):String(current);
    el.dataset.done=String(node.startsWith('garden')&&current>=capacity(plan,node));
    el.setAttribute('aria-label',nodeLabel(node)+' '+el.children[1].textContent);
  }
  for(const edge of plan.edges){
    const el=buttons.get(edge.id),reason=reasonFor(plan,state,edge);if(!el)continue;
    el.setAttribute('aria-pressed',String(selected===edge.id));el.dataset.blocked=String(Boolean(reason));
    el.disabled=locked;el.setAttribute('aria-label',(plan.edges.indexOf(edge)+1)+'. '+copyAction(edge)+'. '+edgeDetail(edge));
  }
  const edge=plan.edges.find(e=>e.id===selected);
  $('routeTitle').textContent=edge?copyAction(edge):copy('selectGate');
  const objective=[plan.window?copy('windowGoal',plan.window):'',plan.order?copy('orderGoal'):'',!plan.window&&!plan.order?copy('reserveGoal',{n:plan.reserve}):''].filter(Boolean).join(' · ');
  $('routeDetail').textContent=edge?edgeDetail(edge):copy('prompt')+' '+objective+' · '+phaseName(state.beat%2?'odd':'even');
  $('checkBtn').disabled=locked||!edge||Boolean(reasonFor(plan,state,edge))||screen!=='battle';
  $('waitBtn').disabled=locked||state.beat>=plan.beats;
  $('waitBtn').title=copy('wait')+' · '+phaseName(state.beat%2?'odd':'even');
  $('undoBtn').disabled=locked||!undoStack.length;
  scene?.update(state,selected,look.owned&&look.selected);
  if(layout)positionUI(layout);
}
function perform(id){
  if(locked||modal||screen!=='battle'||externalPaused||document.hidden)return;
  const plan=currentStage(),next=transition(plan,state,id);
  if(next.reason){setStatus(copy(next.reason),true);playSound('feedback.error');return;}
  const before=state;undoStack.push(before);state=next.state;locked=true;
  const token=epoch,edge=plan.edges.find(e=>e.id===id);renderBattle();
  playSound(id==='wait'?'ui.tick':edge?.repair?'mechanism.unlock':'water.splash');
  scene.animate(before,state,edge,()=>{
    if(token!==epoch||disposed)return;locked=false;selected=null;renderBattle();
    const end=outcome(plan,state);
    if(end.kind!=='playing')finish(end);
    else setStatus(id==='wait'?copy('waiting',{beat:state.beat}):copy('incomplete'));
  });
}
function undo(){
  if(locked||!undoStack.length)return;
  closeModal({focus:false});screen='battle';document.body.dataset.screen='battle';result=null;
  frame.activate('battle',{covered:false});state=undoStack.pop();selected=null;setStatus();renderBattle();syncActivity();playSound('board.undo');$('undoBtn').focus();
}
async function startStage(index){
  if(practiceRequested&&!(await LocalPractice.validate()))return;
  if(!stageUnlocked(index)||!scene)return;
  epoch++;scene.cancelMotion();locked=false;stageIndex=index;stageBrowseIndex=index;result=null;
  state=initialState(currentStage());undoStack=[];selected=null;
  show('battle');buildBoard();setStatus();renderBattle();scene.resize();syncActivity();
  playSound('game.start');buttons.values().next().value?.focus();
  window.dispatchEvent(new CustomEvent('weightplay:battle-open',{detail:{gameId:'animal-river-gates'}}));
}
function finish(end){
  if(result)return;result=end;
  if(end.kind==='win'&&!practiceRequested){
    const next=recordWin(campaign,currentStage().id,state.beat);
    try{storage.setItem(STORE_KEY,JSON.stringify(next));campaign=next;window.WonderAnalytics?.completeStage(currentStage().id);}
    catch{result.saveFailed=true;}
  }
  screen='result';document.body.dataset.screen='result';
  renderResult();openModal('resultScreen','nextBtn');playSound(end.kind==='win'?'result.win':'result.lose');
}
function renderResult(){
  if(!result)return;const win=result.kind==='win',plan=currentStage();
  $('resultKicker').textContent=plan.id+' / 30 · '+stageText(plan,'title');
  $('resultTitle').textContent=win?copy('resultTitle'):copy('lossTitle');
  $('resultText').textContent=result.saveFailed?copy('progressSaveError'):win?copy('stageMoves',{n:state.beat}):copy(result.reason);
  $('resultRecord').textContent=win?copy('targetMoves',{n:plan.par||plan.solution.length})+(campaign.best[plan.id]?' · '+copy('bestMoves',{n:campaign.best[plan.id]}):''):copy('undoHelp');
  const hasNext=win&&stageIndex<29&&stageUnlocked(stageIndex+1);
  $('nextBtn').textContent=win?(hasNext?copy('nextStageAction'):copy('stages')):copy('undo');
  $('replayBtn').textContent=win?copy('replay'):copy('retry');
  $('resultMapBtn').hidden=win&&!hasNext;
  $('resultScreen').dataset.final=String(win&&!hasNext);
  $('resultScreen').dataset.outcome=result.kind;
}
function renderShop(){
  $('walletBalance').textContent=copy('balance',{n:window.WeightPlayWallet?.read().diamonds||0});
  $('buyLookBtn').textContent=look.owned?(look.selected?copy('equipped'):copy('equip')):copy('buy');
  $('buyLookBtn').disabled=purchasing||Boolean(look.owned&&look.selected)||practiceRequested;
  $('freeLookBtn').textContent=copy('freeLook')+(!look.selected?' · '+copy('equipped'):'');
  $('freeLookBtn').disabled=purchasing||!look.selected||practiceRequested;
}
async function purchase(){
  if(purchasing||practiceRequested)return;
  purchasing=true;renderShop();
  const run=async ()=>{
    if(look.owned){
      try{const next={owned:true,selected:true};storage.setItem(LOOK_KEY,JSON.stringify(next));look=next;return {ok:true};}catch{return {ok:false,reason:'saveError'};}
    }
    const purchased=(await purchaseLook(storage,window.WeightPlayWallet));look=readLook(storage);return purchased;
  };
  let purchaseResult;
  try{purchaseResult=navigator.locks?await navigator.locks.request('weightplay-river-station-purchase',run):await run();}
  catch{purchaseResult={ok:false,reason:'saveError'};}
  purchasing=false;renderShop();$('shopStatus').textContent=copy(purchaseResult.ok?'purchaseDone':purchaseResult.reason);
  if(purchaseResult.ok)playSound('shop.purchase');else playSound('feedback.error');
}
function bind(){
  const help=document.querySelector('.wp-tutorial-button');
  if(help){help.className='secondary';help.dataset.wpTutorialAction='embedded';help.textContent=help.getAttribute('aria-label');$('leaveDialog').querySelector('.dialog-card').append(help);help.addEventListener('click',()=>closeModal({focus:false}));}
  $('startBtn').addEventListener('click',()=>{stageBrowseIndex=Math.max(0,campaign.unlockedThrough-1);show('stage');});
  $('backBtn').addEventListener('click',()=>{location.href=window.WONDER_SITE?.localeHome?.()||'/';});
  $('stageBack').addEventListener('click',()=>show('main'));
  $('battleBackBtn').addEventListener('click',()=>{if(screen==='result'){show('stage');return;}openModal('leaveDialog','continueBtn');});
  $('checkBtn').addEventListener('click',()=>selected&&perform(selected));
  $('waitBtn').addEventListener('click',()=>perform('wait'));
  $('undoBtn').addEventListener('click',undo);
  $('continueBtn').addEventListener('click',()=>closeModal());
  $('resetBtn').addEventListener('click',()=>startStage(stageIndex));
  $('leaveStageBtn').addEventListener('click',()=>show('stage'));
  $('resultMapBtn').addEventListener('click',()=>show('stage'));
  $('replayBtn').addEventListener('click',()=>startStage(stageIndex));
  $('nextBtn').addEventListener('click',()=>{if(result?.kind==='loss')undo();else if(stageIndex<29&&stageUnlocked(stageIndex+1))startStage(stageIndex+1);else show('stage');});
  $('stationBtn').addEventListener('click',()=>{
    if(screen!=='stage')return;renderShop();$('shopStatus').textContent='';
    openModal('stationDialog','closeStationBtn');$('stationBtn').setAttribute('aria-selected','true');$('stageTabButton').setAttribute('aria-selected','false');
  });
  $('stageTabButton').addEventListener('click',()=>{if(modal==='stationDialog')closeModal();});
  $('closeStationBtn').addEventListener('click',()=>closeModal());
  $('buyLookBtn').addEventListener('click',purchase);
  $('freeLookBtn').addEventListener('click',()=>{if(practiceRequested)return;try{const next={...look,selected:false};storage.setItem(LOOK_KEY,JSON.stringify(next));look=next;renderShop();}catch{$('shopStatus').textContent=copy('saveError');}});
  $('restoreView').addEventListener('click',()=>scene?.restore());
  $('localeSelect').addEventListener('change',event=>{
    locale=event.target.value;if(!locales[locale])locale='en';
    try{storage.setItem('weightPlayLocale',locale);}catch{}
    renderStatic();window.dispatchEvent(new CustomEvent('wonder:locale-change',{detail:{locale}}));
  });
  document.addEventListener('keydown',event=>{
    const tutorial=document.querySelector('.wp-tutorial-backdrop');
    const activeDialog=tutorial||(modal?$(modal):null);
    if(!activeDialog)return;
    if(event.key==='Escape'){event.preventDefault();if(tutorial)tutorial.querySelector('.wp-tutorial-close')?.click();else if(modal==='leaveDialog'||modal==='stationDialog')closeModal();return;}
    if(event.key!=='Tab')return;
    const focusable=[...activeDialog.querySelectorAll('button:not(:disabled),[tabindex="0"]')].filter(el=>!el.hidden);
    if(!focusable.length)return;const first=focusable[0],last=focusable.at(-1);
    if(event.shiftKey&&(document.activeElement===first||!activeDialog.contains(document.activeElement))){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&(document.activeElement===last||!activeDialog.contains(document.activeElement))){event.preventDefault();first.focus();}
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden)audio?.stop();syncActivity();});
  for(const name of ['weightplay:tutorial-open','weightplay:tutorial-close'])window.addEventListener(name,()=>{externalPaused=Boolean(document.querySelector('.wp-tutorial-backdrop'));syncActivity();if(externalPaused)document.querySelector('.wp-tutorial-action')?.focus();else if(screen==='battle')buttons.values().next().value?.focus();});
  const observer=new MutationObserver(()=>{
    const next=Boolean(document.querySelector('.wp-tutorial-backdrop,.wp-frame-popover:not([hidden])'));
    if(next!==externalPaused){externalPaused=next;syncActivity();}
  });
  observer.observe(document.body,{subtree:true,attributes:true,attributeFilter:['hidden','class'],childList:true});
  window.addEventListener('pagehide',event=>{
    if(disposed)return;
    scene?.setActive(false);audio?.stop();
    if(event.persisted)return;
    disposed=true;epoch++;scene?.dispose();audio?.dispose();stageSelector?.destroy?.();lifecycle?.dispose?.();observer.disconnect();
  });
  window.addEventListener('pageshow',()=>syncActivity());
}
function registerLifecycle(){
  if(!window.WeightPlayLifecycle){window.addEventListener('weightplay:lifecycle-ready',registerLifecycle,{once:true});return;}
  lifecycle=window.WeightPlayLifecycle.register('animal-river-gates',{background:'pause',onStateChange(active){scene?.setActive(active&&screen==='battle'&&!modal&&!externalPaused);}});
  syncActivity();
}
async function boot(){
  const generation=++bootGeneration;
  document.querySelectorAll('[data-i18n]').forEach(el=>{el.dataset.riverI18n=el.dataset.i18n;el.removeAttribute('data-i18n');});
  let loader;
  try{
    // The shared frame inserts its loader asynchronously. Wait for that same
    // component before taking readiness ownership; practice may enter Battle
    // immediately, so the Main-only automatic bridge is not sufficient.
    loader=window.WeightPlayGameEntryLoader?.isActive?window.WeightPlayGameEntryLoader:await new Promise((resolve,reject)=>{
      const script=document.querySelector('script[data-wp-game-entry-loader-bootstrap]');
      if(!script){reject(Error('Shared entry loader unavailable'));return;}
      script.addEventListener('load',()=>resolve(window.WeightPlayGameEntryLoader),{once:true});
      script.addEventListener('error',()=>reject(Error('Shared entry loader failed')),{once:true});
    });
    loader.begin();
    const {RiverScene}=await import('./river-scene.mjs?v=20261023-river-gates-v17');
    if(generation!==bootGeneration||disposed)return;
    scene=new RiverScene($('riverBoard'),{
      onLayout:positionUI,onError:()=>{$('renderRecovery').hidden=false;syncActivity();},
      onRestored:()=>{$('renderRecovery').hidden=true;renderBattle();syncActivity();}
    });
    frame=window.mountAnimalRiverGatesFrame();
    bind();registerLifecycle();
    if(!practiceRequested){
      try{storage.setItem(STORE_KEY,JSON.stringify(campaign));look=recoverLook(storage,window.WeightPlayWallet);}catch{}
    }
    $('app').hidden=false;show('main');renderStatic();
    const poster=$('mainPoster');if(!poster.complete||!poster.naturalWidth)await poster.decode();
    scene.build(STAGES[0]);scene.update(initialState(STAGES[0]),null,look.owned&&look.selected);
    loader?.ready();
    window.WeightPlayAudio?.preload(['game.start','water.splash','mechanism.unlock','board.undo','ui.tick','feedback.error','result.win','result.lose','shop.purchase']);
    LocalPractice.register({gameId:'animal-river-gates',stageIds:STAGES.map(p=>p.id),enable(value){practiceMode=value;if(screen==='stage')renderStages();},startStage:id=>startStage(Number(id)-1)});
  }catch(error){
    console.error('River station failed to initialize',error);
    loader?.fail(undefined,()=>location.reload());
  }
}
// Read-only diagnostics; verification drives the actual controls and authorized
// practice adapter, never a solution or state-injection hook.
window.__RIVER_STATION_DIAGNOSTICS__=()=>({screen,stage:currentStage().id,beat:state?.beat,water:state?.water.slice(),locked,practice:practiceRequested,renderer:scene?.diagnostics()});
boot();
