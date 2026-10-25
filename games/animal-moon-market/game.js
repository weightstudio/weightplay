import { LOCALES, ROUTE_LOCALE_MAP, SHELL_COPY, COPY, GOODS, HELPERS, STAGES, START_LABELS, LEAVE_COPY } from './market-data.js?v=17';
import { MARKET_COPY } from './market-copy.js?v=17';
import { readSave, writeSave, forecast, makePlan, makeRun, validatePlan, openMarket, serve, mistake, restock, nextRound, settle, rating, buyUpgrade, UPGRADE_COST } from './market-model.js?v=17';
import { MarketScene } from './market-scene.js?v=17';
import { LocalPractice } from '../../src/game-local-practice.mjs';

const $ = id => document.getElementById(id);
const route = window.__WEIGHTPLAY_ROUTE_LOCALE__ || ROUTE_LOCALE_MAP[location.pathname.split('/').filter(Boolean)[0]?.toLowerCase()];
let save = readSave(localStorage), locale = LOCALES.includes(route) ? route : 'en';
const state = { locale, stage: Math.max(0, save.unlocked - 1), unlocked: save.unlocked, cleared: new Set(save.cleared), best: save.best, practice: false };
const t = key => MARKET_COPY[locale]?.[key] ?? COPY[locale]?.[key] ?? MARKET_COPY.en[key] ?? COPY.en[key] ?? key;
const fill = (s, values) => Object.entries(values).reduce((out,[key,v])=>out.replaceAll(`{${key}}`,String(v)),s);
const art = name => `assets/${name}-v17.webp`;
const audio = window.WeightPlayAudio.createScope();
const sound = id => audio.play(id);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let frame, stageUI, scene, screen = 'main', run = makeRun(0, save.upgrades), practiceRun = false;
let blocked = false, modal = '', lastFocus = null, nextInputAt = 0, saveFailed = false, disposed = false;
const effects = new Set();
function cancelEffects() { for (const effect of effects) { effect.animation?.cancel(); if(effect.remove)effect.node.remove(); } effects.clear(); }
function animate(node, frames, options, remove = false) {
  if (reduced.matches) { if (remove) node.remove(); return; }
  const entry = { node, remove, animation: node.animate(frames, { duration: 220, easing: 'cubic-bezier(.2,.7,.3,1)', ...options }) };
  effects.add(entry); entry.animation.finished.catch(()=>{}).finally(()=>{effects.delete(entry);if(remove)node.remove();});
}
function status(text, kind = '') { $('planStatus').textContent = text; $('planStatus').className = `market-status ${kind}`; $('planStatus').title = text; }
function syncSave() { state.unlocked = save.unlocked; state.cleared = new Set(save.cleared); state.best = save.best; }
function track(name, payload = {}) { if (!practiceRun && !state.practice) window.WonderAnalytics?.track?.(name,{game_id:'animal-moon-market',game_version:'v17',interface_version:9,...payload}); }
function ruleText(rule) {
  const helper = rule.jobs ? Object.keys(rule.jobs)[0] : '';
  const key = rule.ordered ? (helper ? 'ruleBoth' : 'ruleOrder') : (helper ? 'ruleJobs' : 'ruleAny');
  return fill(COPY[locale]?.[key] || COPY.en[key], { helper: helper ? t(helper === 'orla' ? 'helperOrla' : 'helperRux') : '', task: helper ? t(rule.jobs[helper]) : '' });
}
function compactRule(f) {
  const helper = f.jobs ? Object.keys(f.jobs)[0] : '';
  return [f.ordered ? 'Ⅰ → Ⅱ' : 'Ⅰ ↔ Ⅱ', helper ? `${t(helper === 'orla' ? 'helperOrla' : 'helperRux')} · ${t(f.jobs[helper])}` : t('helpers')].join('  ·  ');
}
function updatePause() {
  const sharedOpen = [...document.querySelectorAll('.wp-frame-popover')].some(n => !n.hidden && n.getClientRects().length);
  blocked = Boolean(modal || document.hidden || sharedOpen || screen !== 'battle');
  scene?.setPaused(blocked);
  if (blocked) { audio.stop(); cancelEffects(); }
}
function setScreen(name) {
  cancelEffects(); modal=''; screen=name;
  for(const id of ['helpModal','leaveModal','resultCard'])$(id).hidden=true;
  $('battleLive').inert=false;$('battleLive').removeAttribute('aria-hidden');
  for(const id of ['main','stage','battle']) { const root=$(id+'Screen'),active=id===name; root.hidden=!active;root.inert=!active;root.classList.toggle('active',active); }
  document.body.dataset.screen=name; frame?.frame.activate(name);
  if(name!=='battle') { scene?.setActive(false); audio.stop();window.scrollTo(0,0); }
  else scene?.setActive(true);
  if(name==='stage'){shopTab(false);stageUI?.select(state.stage,{center:true,notify:false});stageUI?.refresh(state.stage);frame?.syncStageInfo();}
  updatePause();window.WeightPlayBattleCanvas?.sync?.();
}
function showModal(id, focus) {
  lastFocus=document.activeElement;modal=id;$(id).hidden=false;$('battleLive').inert=true;$('battleLive').setAttribute('aria-hidden','true');
  updatePause();$(focus).focus({preventScroll:true});
  animate($(id),[{opacity:0},{opacity:1}],{duration:160});
}
function closeModal() {
  if(modal)$(modal).hidden=true;modal='';$('battleLive').inert=false;$('battleLive').removeAttribute('aria-hidden');updatePause();
  (lastFocus?.isConnected?lastFocus:$('battleBack')).focus({preventScroll:true});
}
async function startStage(index) {
  if(!Number.isInteger(index)||index<0||index>=30)return;
  const wantsPractice = state.practice || (practiceRun && screen==='battle');
  if(wantsPractice && !await LocalPractice.validate())return;
  if(!wantsPractice&&index>=state.unlocked)return;
  practiceRun=wantsPractice;state.stage=index;run=makeRun(index,save.upgrades);saveFailed=false;nextInputAt=0;
  setScreen('battle');
  try { if(!scene)scene=new MarketScene($('marketCanvas'),actStall,tick); }
  catch(error){console.error('Moon Market renderer initialization failed',error);window.WeightPlayGameEntryLoader?.fail?.(t('retryHint'),()=>location.reload());return;}
  scene.setActive(true);render();updatePause();sound('game.start');track('market_stage_start',{stage:index+1});
}
function demandDOM(f) {
  $('forecast').replaceChildren(...f.demand.map((good,i)=>{const n=document.createElement('span');n.className='demand-chip';n.title=`${t('demand')}: ${t(good)} × ${f.counts[i]}`;n.setAttribute('aria-label',n.title);n.innerHTML=`<img src="${art(good)}" alt=""><span>×${f.counts[i]}</span>`;n.dataset.good=good;n.dataset.count=f.counts[i];return n;}));
}
function render() {
  const f=forecast(run.stage,run.round),serving=run.phase==='serve';
  $('battleLive').dataset.phase=serving?'serve':'plan';$('battleLive').dataset.stage=String(run.stage+1);$('battleLive').dataset.round=String(run.round+1);
  $('shiftLabel').textContent=`${t('stage')} ${run.stage+1} / 30`;$('roundLabel').textContent=`${t('round')} ${run.round+1} / ${STAGES[run.stage].rounds.length}`;
  demandDOM(f);$('coinHud').textContent=run.earned;$('coinHud').parentElement.setAttribute('aria-label',`${t('earned')}: ${run.earned}`);
  $('marketPhase').textContent=t(serving?'serve':'plan');$('ruleText').textContent=compactRule(f);$('ruleText').title=ruleText(f);
  for(let i=0;i<2;i++) {
    const b=$('stall'+i),good=run.plan.shelf[i];b.disabled=run.phase==='round';b.dataset.product=good;b.querySelector('img').src=art(good);b.querySelector('span').textContent=t(good);b.querySelector('strong').textContent=serving?`×${run.plan.stock[i]}`:'↻';
    b.setAttribute('aria-label',`${i+1}. ${t(good)} · ${serving?t('tapStall'):t('cycleGood')} · ${run.plan.stock[i]}`);
    $('stock'+i).textContent=run.plan.stock[i];
    document.querySelector(`[data-quantity="${i}"] [data-delta="-1"]`).disabled=run.phase!=='plan'||run.plan.stock[i]<=1;
    document.querySelector(`[data-quantity="${i}"] [data-delta="1"]`).disabled=run.phase!=='plan'||run.plan.stock[i]>=6||run.plan.stock[0]+run.plan.stock[1]>=f.budget;
  }
  for(const helper of HELPERS) {
    const b=$(helper.id==='orla'?'helperOrla':'helperRux');b.disabled=run.phase!=='plan';b.querySelector('span').textContent=t(helper.copy);b.querySelector('b').textContent=t(run.plan.jobs[helper.id]);b.dataset.job=run.plan.jobs[helper.id];
    b.setAttribute('aria-label',`${t(helper.copy)}: ${t(run.plan.jobs[helper.id])} · ${t('switchJob')}`);
  }
  $('orderCard').hidden=!serving;$('serviceScore').hidden=!serving;$('openButton').hidden=serving;$('resetButton').hidden=serving;$('restockButton').hidden=!serving;
  $('openButton').textContent=t(run.phase==='round'?'nextRound':'open');$('resetButton').textContent=t('reset');$('resetButton').disabled=run.phase!=='plan';
  $('restockButton').textContent=t(run.restocks?'freeRestock':'restock');
  $('restockButton').disabled=serving&&run.plan.stock[run.plan.shelf.indexOf(run.orders[run.customer])]>=6;
  if(serving){
    const good=run.orders[run.customer];$('orderImage').src=art(good);$('orderName').textContent=t(good);$('orderName').dataset.good=good;$('orderLabel').textContent=t('order');$('customerCount').textContent=`${run.customer+1}/${run.orders.length}`;
    $('serviceScore').textContent=`${t('misses')} ${run.mistakes}/3`;$('patience').hidden=!run.patienceLimit;
    status(t('tapStall'));
  } else if(run.phase==='round') status(t('roundGood'),'success');
  else status(`${t('budget')} ${run.plan.stock[0]+run.plan.stock[1]}/${f.budget} · ${t('cycleGood')}`);
  scene?.update(run,save);frame?.syncStageInfo();
}
function reward(side, coins, origin) {
  if(reduced.matches)return;
  const pop=document.createElement('span');pop.className='reward-pop';pop.textContent=`+${coins}${run.streak>=3?' ✦':''}`;$('burstLayer').append(pop);
  animate(pop,[{opacity:0,transform:'translate(-50%,0)'},{opacity:1,offset:.25},{opacity:0,transform:'translate(-50%,-45px)'}],{duration:480},true);
  const from=origin||(()=>{const r=$('stall'+side).getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};})();
  const target=$('coinHud').getBoundingClientRect();const node=document.createElement('img');node.src=art('coin');node.className='reward-flight';node.style.left=`${from.x-16}px`;node.style.top=`${from.y-16}px`;document.body.append(node);
  animate(node,[{transform:'translate(0,0) scale(.6)',opacity:0},{opacity:1,offset:.15},{transform:`translate(${target.x+target.width/2-from.x}px,${target.y+target.height/2-from.y}px) scale(.45)`,opacity:0}],{duration:420},true);
}
function actStall(side,origin) {
  if(blocked||screen!=='battle'||performance.now()<nextInputAt)return;
  if(run.phase==='plan') {run.plan.shelf[side]=GOODS[(GOODS.indexOf(run.plan.shelf[side])+1)%GOODS.length];render();scene.pulse(side);sound('board.move');return;}
  if(run.phase!=='serve')return;
  const result=serve(run,side);nextInputAt=performance.now()+180;
  if(result.kind==='served') {sound('reward.coin');scene.pulse(side);scene.arrive();render();reward(side,result.coins,origin);if(run.phase==='won')showResult(true);else if(run.phase==='round'){sound('game.checkpoint');render();}}
  else {sound('feedback.error');render();status(t(result.kind),'error');animate($('stall'+side),[{transform:'translateX(0)'},{transform:'translateX(-4px)'},{transform:'translateX(4px)'},{transform:'translateX(0)'}],{duration:160});if(run.phase==='lost')showResult(false);}
}
function tick(dt) {
  if(blocked||run.phase!=='serve'||!run.patienceLimit)return;
  run.patience=Math.max(0,run.patience-dt);$('patience').value=run.patience/run.patienceLimit;$('patience').dataset.low=String(run.patience<5);
  if(!run.patience){mistake(run);sound('feedback.error');render();status(t('late'),'error');if(run.phase==='lost')showResult(false);}
}
function commitWin() {
  if(practiceRun){run.settled=true;return true;}
  if(run.settled)return true;
  const candidate=settle(readSave(localStorage),run);if(!candidate)return false;
  try {writeSave(localStorage,candidate);save=candidate;run.settled=true;syncSave();track('market_stage_complete',{stage:run.stage+1,stars:rating(run),coins:run.earned});window.WonderAnalytics?.completeStage?.(run.stage+1);return true;}
  catch{return false;}
}
function showResult(won) {
  saveFailed=won&&!commitWin();
  $('resultEyebrow').textContent=t(won?'earned':'loss');$('resultTitle').textContent=won?`${run.earned} ${t('coins')}`:t('loss');
  $('resultCopy').textContent=won?(saveFailed?t('saveError'):practiceRun?'LOCAL PRACTICE · '+t('notSaved'):t('stageGood')):t('retryHint');
  $('resultStars').textContent=won?'★'.repeat(rating(run))+'☆'.repeat(3-rating(run)):'☆ ☆ ☆';
  $('marketMark').textContent=`${t('stage')} ${run.stage+1} · ${t('misses')} ${run.mistakes} · ${t(saveFailed?'notSaved':'saved')}`;
  if(practiceRun||!won)$('marketMark').textContent=`${t('stage')} ${run.stage+1} · ${t('misses')} ${run.mistakes}`;
  $('stagesButton').textContent=t('stages');$('replayButton').textContent=t('replay');$('nextButton').textContent=t(saveFailed?'retrySave':run.stage===29?'cleared':'nextStage');
  $('nextButton').disabled=!won;$('resultCard').dataset.outcome=won?'won':'lost';
  showModal('resultCard',won?'nextButton':'replayButton');sound(won?'result.win':'result.lose');
}
function shopTab(shop) {
  $('marketShop').hidden=!shop;$('stageWorkspace').dataset.view=shop?'shop':'stages';
  for(const n of [$('stageGrid'),$('stageWorkspace').querySelector('.wp-stage-i9-briefing')]){n.inert=shop;if(shop)n.setAttribute('aria-hidden','true');else n.removeAttribute('aria-hidden');}
  for(const [id,selected] of [['stageTabButton',!shop],['shopTabButton',shop]]){$(id).setAttribute('aria-selected',String(selected));$(id).setAttribute('aria-pressed',String(selected));}
  if(shop)renderShop();else stageUI?.refresh(state.stage);
}
function diamondAmount(amount) {
  const node=document.createElement('span');node.className='market-diamonds';
  const icon=document.createElement('img');icon.src='/assets/weightplay-diamond.svg';icon.alt='';icon.width=20;icon.height=20;
  node.append(icon,document.createTextNode(String(amount)));return node;
}
function renderShop() {
  save=readSave(localStorage);syncSave();$('shopTitle').textContent=t('shop');$('shopBalance').replaceChildren(document.createTextNode(`${save.coins} ${t('coins')} · `),diamondAmount(window.WeightPlayWallet.read().diamonds));
  for(const id of ['bell','crate','gold']) {
    let card=$('upgrade-'+id);
    if(!card){card=document.createElement('article');card.id='upgrade-'+id;card.className='shop-item';card.innerHTML=`<img src="${art(id==='gold'?'lanterns':id)}" alt=""><div><h3></h3><p></p><small></small></div><button type="button" data-upgrade="${id}"></button>`;$('shopItems').append(card);card.querySelector('button').addEventListener('click',()=>purchase(id));}
    card.querySelector('h3').textContent=t(id+'Name');card.querySelector('p').textContent=t(id+'Desc');
    const owned=save.upgrades[id],button=card.querySelector('button'),cost=card.querySelector('small');
    cost.replaceChildren(owned?document.createTextNode(t('owned')):id==='gold'?diamondAmount(UPGRADE_COST[id]):document.createTextNode(`${UPGRADE_COST[id]} ${t('coins')}`));
    button.textContent=owned?(id==='gold'?t(save.goldEnabled?'using':'use'):t('owned')):t('buy');button.disabled=state.practice||(owned&&id!=='gold');
    if(id==='gold')button.setAttribute('aria-pressed',String(save.goldEnabled));
  }
}
async function purchase(id) {
  if(state.practice)return;
  if(id==='gold'&&save.upgrades.gold){const next={...save,goldEnabled:!save.goldEnabled};try{writeSave(localStorage,next);save=next;sound('board.move');}catch{$('shopMessage').textContent=t('saveError');return;}}
  else {const result=(await buyUpgrade(localStorage,save,id,window.WeightPlayWallet));if(result.error){$('shopMessage').textContent=t(result.error);sound('feedback.error');return;}save=result.save;sound('shop.purchase');$('shopMessage').textContent=`${t(id+'Name')} · ${t('owned')}`;}
  renderShop();scene?.update(run,save);animate($('upgrade-'+id),[{opacity:.5},{opacity:1}],{duration:220});
}
function applyCopy() {
  state.locale=locale;document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';$('locale').value=locale;
  document.querySelectorAll('[data-copy]').forEach(n=>n.textContent=t(n.dataset.copy));$('startButton').textContent=START_LABELS[locale];
  $('mainProgress').textContent=fill(COPY[locale].ready,{cleared:state.cleared.size,unlocked:state.unlocked});
  $('mainScreen').querySelector('[data-wp-return="main"]').setAttribute('aria-label',SHELL_COPY[locale].mainBack);$('posterImage').alt=t('artAlt');$('orlaGuide').alt=t('orlaAlt');
  $('stageBack').setAttribute('aria-label',t('back'));$('battleBack').setAttribute('aria-label',t('stages'));$('stageGrid').setAttribute('aria-label',t('stages'));$('shopTabButton').textContent=t('shop');
  $('helpButton').setAttribute('aria-label',t('hint'));$('helpTitle').textContent=t('hint');$('helpCopy').textContent=t('guide');$('helpClose').textContent=LEAVE_COPY[locale][2];
  $('marketCanvas').setAttribute('aria-label',t('tapStall'));$('orderLabel').textContent=t('order');
  const leave=LEAVE_COPY[locale];$('leaveTitle').textContent=leave[0];$('leaveCopy').textContent=leave[1].replace('{stage}',String(run.stage+1));$('leaveContinue').textContent=leave[2];$('leaveStages').textContent=leave[3];
  document.querySelectorAll('.quantity').forEach((n,i)=>n.querySelectorAll('button').forEach(b=>b.setAttribute('aria-label',`${b.dataset.delta==='1'?'+':'−'} ${i+1} · ${t('stock')}`)));
  stageUI?.refresh(state.stage);frame?.syncStageInfo();if(screen==='battle')render();
}

$('startButton').addEventListener('click',()=>{save=readSave(localStorage);syncSave();state.stage=save.unlocked-1;applyCopy();setScreen('stage');sound('board.move');});
$('stageBack').addEventListener('click',()=>{applyCopy();setScreen('main');});
$('stageTabButton').addEventListener('click',()=>shopTab(false));$('shopTabButton').addEventListener('click',()=>shopTab(true));
$('battleBack').addEventListener('click',()=>{if(modal)return;applyCopy();showModal('leaveModal','leaveContinue');sound('feedback.hint');});
$('leaveContinue').addEventListener('click',closeModal);$('leaveStages').addEventListener('click',()=>setScreen('stage'));
$('helpButton').addEventListener('click',()=>showModal('helpModal','helpClose'));$('helpClose').addEventListener('click',closeModal);
for(let i=0;i<2;i++)$('stall'+i).addEventListener('click',()=>actStall(i));
$('marketCanvas').addEventListener('keydown',e=>{if(e.key==='1'||e.key==='2'){e.preventDefault();actStall(Number(e.key)-1);}});
for(const n of document.querySelectorAll('.quantity'))n.addEventListener('click',e=>{const b=e.target.closest('[data-delta]');if(!b||blocked||run.phase!=='plan')return;const side=Number(n.dataset.quantity);const next=run.plan.stock[side]+Number(b.dataset.delta);if(next<1||next>6||next+run.plan.stock[1-side]>forecast(run.stage,run.round).budget)return;run.plan.stock[side]=next;render();scene.pulse(side);sound('board.move');});
for(const id of ['helperOrla','helperRux'])$(id).addEventListener('click',()=>{if(blocked||run.phase!=='plan')return;[run.plan.jobs.orla,run.plan.jobs.rux]=[run.plan.jobs.rux,run.plan.jobs.orla];render();sound('board.move');});
$('openButton').addEventListener('click',()=>{if(blocked)return;if(run.phase==='round'){nextRound(run);nextInputAt=0;render();sound('game.checkpoint');return;}const error=openMarket(run,save.upgrades);if(error){status(t(error),'error');sound('feedback.error');return;}render();scene.arrive();sound('game.start');});
$('resetButton').addEventListener('click',()=>{if(blocked||run.phase!=='plan')return;run.plan=makePlan(run.stage,run.round);render();sound('board.move');});
$('restockButton').addEventListener('click',()=>{if(blocked)return;const error=restock(run);render();status(error?t(error):t('ready'),error?'error':'success');sound(error?'feedback.error':'reward.collect');});
$('stagesButton').addEventListener('click',()=>setScreen('stage'));$('replayButton').addEventListener('click',()=>startStage(run.stage));
$('nextButton').addEventListener('click',()=>{if(run.phase!=='won')return;if(saveFailed){showResult(true);return;}if(run.stage===29)setScreen('stage');else startStage(run.stage+1);});
for(const id of ['helpModal','leaveModal','resultCard'])$(id).addEventListener('keydown',e=>{if(e.key!=='Tab')return;const buttons=[...$(id).querySelectorAll('button:not([disabled])')],first=buttons[0],last=buttons.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});
window.addEventListener('keydown',e=>{if(e.key!=='Escape'||screen!=='battle')return;e.preventDefault();if(modal==='helpModal'||modal==='leaveModal')closeModal();else if(!modal)$('battleBack').click();});
$('locale').addEventListener('change',e=>{const next=e.target.value;if(LOCALES.includes(next)){locale=next;applyCopy();window.WonderI18n?.setLocale?.(next,{navigate:false});}});
window.addEventListener('wonder:locale-change',e=>{if(LOCALES.includes(e.detail?.locale)&&locale!==e.detail.locale){locale=e.detail.locale;applyCopy();}});
const config=window.createAnimalMoonMarketStageConfig({stages:STAGES,state,t,ruleText});
frame=window.mountAnimalMoonMarketFrame({stageConfig:config,getSelectedStage:()=>state.stage,setSelectedStage:index=>{state.stage=index;},startStage,getStageInfo:()=>({label:`${t('stage')} ${state.stage+1}`,progress:`${state.cleared.size}/30 · ${state.unlocked}/30`})});stageUI=frame.stageUI;
const coverObserver=new MutationObserver(updatePause);coverObserver.observe($('gameFrame'),{subtree:true,attributes:true,attributeFilter:['hidden','aria-expanded']});
document.addEventListener('visibilitychange',updatePause);window.addEventListener('pageshow',()=>{updatePause();if(screen==='battle')scene?.setActive(true);});
window.addEventListener('pagehide',event=>{cancelEffects();audio.stop();scene?.setActive(false);if(event.persisted)return;disposed=true;coverObserver.disconnect();document.removeEventListener('visibilitychange',updatePause);scene?.dispose();audio.dispose();});
$('marketCanvas').addEventListener('webglcontextlost',e=>{e.preventDefault();scene?.setActive(false);window.WeightPlayGameEntryLoader?.fail?.(t('retryHint'),()=>location.reload());});
applyCopy();setScreen('main');
// Own readiness explicitly: authenticated deep entries may leave Main before
// the shared automatic Main observer sees the poster finish loading.
const bootAssets=[...new Set([$('posterImage').src,$('orlaGuide').src,...HELPERS.map(h=>h.art),...['berries','lanterns','acorns','coin','bell','crate'].map(art)])];
const loader=window.WeightPlayGameEntryLoader;loader?.begin?.(bootAssets.length);
try {
  let loaded=0;
  await Promise.all(bootAssets.map(src=>new Promise((resolve,reject)=>{
    const image=new Image();const timeout=setTimeout(()=>reject(new Error('MARKET_ASSET_TIMEOUT')),15000);
    image.onload=()=>{clearTimeout(timeout);loader?.assetProgress?.(++loaded,bootAssets.length);resolve();};
    image.onerror=()=>{clearTimeout(timeout);reject(new Error('MARKET_ASSET_FAILED'));};image.src=src;
  })));
  if(!disposed){
    scene=new MarketScene($('marketCanvas'),actStall,tick);loader?.ready?.();
    LocalPractice.register({gameId:'animal-moon-market',stageIds:STAGES.map((_,i)=>i+1),enable:enabled=>{state.practice=enabled;stageUI.refresh(state.stage);},startStage:id=>startStage(Number(id)-1)});
  }
} catch { if(!disposed)loader?.fail?.(undefined,()=>location.reload()); }
