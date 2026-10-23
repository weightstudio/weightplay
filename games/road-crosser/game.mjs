import { createWorld, requestMove, advance, signalState, readJourney, saveJourney, readBest, buyAurora, COST, readCampaign, recordClear, CAMPAIGN_KEY, missingCargo, useSignal } from './model.mjs?v=23';
import { createRenderer } from './renderer.mjs?v=23';
import { EXTRA } from './copy.mjs?v=23';
import { LEVELS } from './levels.mjs?v=23';
import { CAMPAIGN_COPY, stageName } from './campaign-copy.mjs?v=23';
import { createStageConfig } from './stage-config.mjs?v=23';
import { LocalPractice } from '../../src/game-local-practice.mjs';

const $ = id => document.getElementById(id);
const locale = EXTRA[document.documentElement.lang] ? document.documentElement.lang : 'en';
const copy = window.RoadCrosserCopy[locale] || window.RoadCrosserCopy.en;
const extra = EXTRA[locale], leaveCopy = window.RoadCrosserLeaveCopy[locale] || window.RoadCrosserLeaveCopy.en;
const campaignCopy = CAMPAIGN_COPY[locale];
const t = key => campaignCopy[key] ?? extra[key] ?? copy[key] ?? key;
const lifetime = new AbortController();
const listen = (node, type, listener, options = {}) => node.addEventListener(type, listener, { ...options, signal: lifetime.signal });
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const audio = window.WeightPlayAudio.createScope();
const play = cue => audio.play(cue);
let storage;
try { storage = window.localStorage; } catch { storage = { getItem() { return null; }, setItem() { throw Error('Storage unavailable'); }, removeItem() {} }; }
let journey = readJourney(storage), best = readBest(storage), screen = 'main', panel = null, ready = false;
let campaign = readCampaign(storage), selector, practiceMode = false, practiceRun = false, starting = false;
let world = null, total = 0, runLanterns = 0, raf = 0, last = 0, paused = true, renderer, gesture, generation = 0;
let purchaseBusy = false, transient = 0, committedRoute = false, resultDone = false, focusReturn;
const effects = new Set();
const canvas = $('gameCanvas');
const main = $('mainScreen'), stage = $('stageScreen'), battle = $('battleScreen'), stageContent = battle.querySelector('.battle-stage');

document.querySelectorAll('[data-copy]').forEach(node => { if (!node.hasAttribute('data-wp-game-title')) node.textContent = t(node.dataset.copy); });
document.querySelectorAll('[data-extra]').forEach(node => { node.textContent = t(node.dataset.extra); });
document.querySelectorAll('[data-copy-aria]').forEach(node => node.setAttribute('aria-label', t(node.dataset.copyAria)));
for (const [id, label] of [['helpBtn','help'],['campBtn','camp']]) {
  $(id).setAttribute('aria-label', t(label)); $(id).title = t(label);
}
$('helpBtn').textContent = '?';
$('campBtn').replaceChildren(Object.assign(document.createElement('span'), { className: 'lantern-art' }));
$('medalList').setAttribute('aria-label',t('medals'));
$('localeSelect').value = locale;
canvas.setAttribute('aria-label', window.WEIGHTPLAY_GAME_TITLES?.['road-crosser']?.[locale] || copy.canvasLabel);
$('leaveTitle').textContent = leaveCopy[0]; $('continueBtn').textContent = leaveCopy[2]; $('leaveBtn').textContent = leaveCopy[3];
$('homeBtn').textContent = t('stages'); $('stageTab').textContent = t('stages');
$('nextBtn').textContent = t('nextStage'); $('signalBtn').setAttribute('aria-label',t('signalTool')); $('signalBtn').title=t('charge');
$('helpCampaign').textContent=t('medalRules'); $('helpCharge').textContent=t('charge'); $('helpCargo').textContent=t('cargo');
$('resultBestLabel').textContent=t('stageBest');
for (const node of battle.querySelectorAll('button:not([data-wp-return])')) node.dataset.wpFrameAction = node.matches('#retryBtn,#continueBtn,#confirmBuy') ? 'primary' : 'secondary';
const frame = window.WeightPlayScreenFrame.mount({ root: $('roadCrosserApp'), localeSelect: $('localeSelect'), playUI: true,
  scenes: { main: { root: main, header: main.querySelector('header'), content: main.querySelector('.hero-card') },
    stage: {root:stage,header:stage.querySelector('header'),content:$('stageContent')},
    battle: { root: battle, header: battle.querySelector('header'), content: stageContent } } });
const group = window.WeightPlayScreenFrame.createGroup();
for (const node of [...$('battleInfo').children]) group.add(node);
$('battleInfo').remove(); frame.battleTopUI.add(group);
frame.stageTopUI.add($('stageSummary'));
const stageConfig=createStageConfig({locale,getSave:()=>campaign,isPractice:()=>practiceMode});
function showStages() { updateHud(); setScreen('stage'); }
function renderStages() {
  $('stageSummary').textContent=`${t('cleared')} ${campaign.medals.filter(v=>v&1).length} / 30`;
  if(!selector)selector=window.WeightPlayPlayUI.mountStage({page:$('stageContent'),rail:$('stageRail'),config:stageConfig,
    selected:campaign.unlocked-1,onStart:index=>start(index+1),isActive:()=>screen==='stage'});
  else selector.refresh(campaign.unlocked-1);
}

function animate(node, frames, duration = 160) {
  if (!node || document.hidden) return;
  const animation = node.animate(motion.matches ? [{ opacity: .7 }, { opacity: 1 }] : frames,
    { duration: motion.matches ? 60 : duration, easing: 'cubic-bezier(.2,.7,.3,1)' });
  effects.add(animation); animation.finished.catch(() => {}).finally(() => effects.delete(animation));
}
function cancelEffects() { for (const animation of effects) animation.cancel(); effects.clear(); document.querySelectorAll('.reward-flight').forEach(node => node.remove()); }
function saved() {
  if(practiceMode||practiceRun)return false;
  try { saveJourney(storage, journey); return true; }
  catch { notice(t('storage'), 4); return false; }
}
function notice(text, seconds = 2) { $('battleMessage').textContent = text; transient = seconds; }
function updateHud() {
  $('stageValue').textContent = `${world?.stage || 1} / 30`;
  $('scoreValue').textContent = total + (world?.score || 0);
  $('bestValue').textContent = best;
  $('lanternValue').textContent = `${world?.lanterns || 0} / 3`;
  $('mainProgress').textContent = `${t('cleared')} ${campaign.medals.filter(v=>v&1).length} / 30`;
  $('signalBtn').hidden = !world?.level.charge;
  $('signalBtn').disabled = !world?.charges || world?.state!=='playing';
  $('signalCount').textContent = world?.charges || 0;
}
function setScreen(next) {
  generation++; cancelAnimationFrame(raf); cancelEffects(); audio.stop(); gesture = null;
  screen = next; panel = null;
  if(next!=='stage')selector?.cancel();
  for (const id of ['leaveDialog','helpPanel','campPanel']) $(id).hidden = true;
  main.hidden = next !== 'main'; stage.hidden = next !== 'stage'; battle.hidden = !['battle','result'].includes(next);
  const result = next === 'result'; $('resultScreen').hidden = !result; $('resultScreen').inert = !result;
  stageContent.hidden = result; stageContent.inert = result;
  document.querySelector('[data-wp-game-guide]').hidden = next !== 'main';
  document.body.dataset.screen = next === 'result' ? 'battle' : next;
  battle.dataset.substate = result ? 'result' : 'play';
  frame.activate(next === 'result' ? 'battle' : next);
  if(next==='stage')renderStages();
  paused = true;
  renderer?.clear();
  const ticket = generation;
  requestAnimationFrame(() => {
    if (ticket !== generation || lifetime.signal.aborted) return;
    renderer?.resize(); if (world) renderer?.draw(world, 0, journey.equipped === 'aurora');
    (next === 'main' ? $('startBtn') : next==='stage' ? $('stageRail').querySelector('[aria-current="true"]') : result ? ($('nextBtn').hidden?$('retryBtn'):$('nextBtn')) : canvas)?.focus({ preventScroll: true });
    animate(result ? $('resultScreen').firstElementChild : next === 'main' ? main.querySelector('.hero-card') : next==='stage' ? $('stageContent') : stageContent,
      [{ opacity: .65 }, { opacity: 1 }]);
    syncPause();
  });
}
function isBlocked() { return screen !== 'battle' || Boolean(panel) || document.hidden || Boolean(battle.querySelector('[data-wp-settings][aria-expanded="true"]')); }
function syncPause() {
  const next = isBlocked();
  if (paused === next) return;
  paused = next; cancelAnimationFrame(raf); world && (world.queued = null); gesture = null;
  if (!paused) { last = performance.now(); raf = requestAnimationFrame(loop); }
  else { cancelEffects(); audio.stop(); }
}
function openPanel(name, opener) {
  if (!['battle','result'].includes(screen) || purchaseBusy || panel === name) return;
  // The shared header remains reachable while a panel is open. Replace the
  // previous panel so Back cannot stack an obscured confirmation beneath it.
  if (panel) $(panel).hidden = true;
  $('purchaseConfirm').hidden = true;
  panel = name; focusReturn = opener || document.activeElement;
  $(name).hidden = false; stageContent.inert = true; $('resultScreen').inert = true;
  if (name === 'campPanel') refreshCamp();
  if (name === 'leaveDialog') $('leaveText').textContent = leaveCopy[1].replace('{n}', world?.stage || 1);
  syncPause(); animate($(name).firstElementChild, [{ opacity: .6, transform: 'translateY(5px)' }, { opacity: 1, transform: 'none' }]);
  $(name).querySelector('button')?.focus({ preventScroll: true });
}
function closePanel() {
  if (!panel || purchaseBusy) return;
  $(panel).hidden = true; panel = null; $('purchaseConfirm').hidden = true;
  stageContent.inert = screen !== 'battle'; $('resultScreen').inert = screen !== 'result';
  syncPause(); focusReturn?.focus({ preventScroll: true });
}
async function start(id=world?.stage||1, {practice=false}={}) {
  if (!ready || purchaseBusy || starting) return;
  id=Number(id);if(!Number.isInteger(id)||id<1||id>30)return;
  const requestedPractice=practice||practiceMode||practiceRun;
  if(!requestedPractice&&id>campaign.unlocked)return;
  starting=true;const ticket=generation;
  try {
    if(requestedPractice&&!await LocalPractice.validate())return;
    if(ticket!==generation||lifetime.signal.aborted)return;
    practiceRun=requestedPractice;
    total=0;runLanterns=0;world=createWorld(id);committedRoute=false;resultDone=false;
    setScreen('battle');updateHud();notice(t(world.level.hint),4);play('game.start');
  } finally { starting=false; }
}
function move(direction) {
  if (isBlocked() || !world) return;
  requestMove(world, direction); consumeEvents();
}
function flyLantern(event) {
  if (motion.matches || document.hidden) { animate($('lanternValue'), [{ opacity: .5 }, { opacity: 1 }]); return; }
  const board = canvas.getBoundingClientRect(), destination = $('lanternValue').getBoundingClientRect();
  const node = document.createElement('span'); node.className = 'reward-flight lantern-art'; node.setAttribute('aria-hidden','true');
  const x = board.left + event.x / 10 * board.width, y = board.top + (event.row + .5) / 9 * board.height;
  Object.assign(node.style, { left: `${x - 12}px`, top: `${y - 12}px` }); document.body.append(node);
  const animation = node.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 },
    { transform: `translate(${destination.left + destination.width / 2 - x}px,${destination.top + destination.height / 2 - y}px) scale(.4)`, opacity: .15 }],
    { duration: 420, easing: 'cubic-bezier(.2,.7,.3,1)' });
  effects.add(animation); animation.finished.then(() => animate($('lanternValue'), [{ opacity: .4 }, { opacity: 1 }])).catch(() => {}).finally(() => { effects.delete(animation); node.remove(); });
}
function consumeEvents() {
  for (const event of world.events.splice(0)) {
    renderer?.event(event);
    if (event.type === 'step') play('movement.jump');
    if (event.type === 'blocked') { notice(t(({rock:'roadRock',cargo:'needCargo',dock:'needDock'})[event.reason]||'edge')); play('feedback.error'); }
    if (event.type === 'pickup') { if(!practiceMode&&!practiceRun){journey.lanterns++;saved();} notice(`${t('pickup')} +25`); play('reward.collect'); flyLantern(event); }
    if (event.type === 'signal') { notice(t('signalUsed'),2.4);play('game.checkpoint'); }
    if (event.type === 'impact') { notice(t(event.reason === 'water' ? 'roadWater' : 'roadCrash')); play(event.reason === 'water' ? 'water.splash' : 'player.hurt'); }
    if (event.type === 'checkpoint' && !committedRoute) {
      committedRoute = true;
      if(!practiceMode&&!practiceRun){
        recordClear(campaign,world);
        try { storage.setItem(CAMPAIGN_KEY,JSON.stringify(campaign)); }
        catch { notice(t('storage'),4); }
      }
      notice(`${t('roadGoal')} · ${world.stage}/30`, 3); play('game.checkpoint');
      animate($('stageValue'), [{ opacity: .4 }, { opacity: 1 }], 220);
    }
  }
  updateHud();
}
function finish(win) {
  if (resultDone) return;
  resultDone = true;
  const finalScore = total + world.score;
  const route = world.stage;
  $('nextBtn').hidden = !win || route===30;
  setScreen('result'); updateHud();
  $('resultTitle').textContent = t(win ? 'winTitle' : 'loseTitle');
  $('resultCopy').textContent = win ? route===30?t('complete'):t('medalRules') : `${t(world.reason === 'water' ? 'roadWater' : 'roadCrash')} ${t(world.level.hint)}`;
  $('resultScore').textContent = finalScore; $('resultBest').textContent = campaign.best[route-1];
  $('resultLanterns').textContent = runLanterns + world.lanterns;
  $('resultRoute').textContent = `${route} / 30 · ${stageName(world.level,locale)}`;
  const mask=win?(1|(world.lanterns===3?2:0)|((world.level.charge?world.charges===1:world.moves<=world.level.budget)?4:0)):0;
  $('resultMedals').textContent=[1,2,4].map(bit=>mask&bit?'★':'☆').join(' ');
  $('resultScreen').dataset.outcome = win ? 'win' : 'lose'; play(win ? 'result.win' : 'result.lose');
}
function loop(now) {
  if (paused || isBlocked() || !world) return;
  const dt = Math.min(.1, Math.max(0, (now - last) / 1000)); last = now;
  advance(world, dt); consumeEvents();
  transient -= dt;
  if (transient <= 0 && world.state === 'playing') {
    const nearSignal=world.level.signals.find(s=>s.row===world.player.row-1||s.row===world.player.row);
    $('battleMessage').textContent = world.freeze>0?t('signalUsed'):nearSignal?t(signalState(world,nearSignal.row)==='go'?'signalGo':'signalStop'):
      missingCargo(world)?`${t('cargo')} ${world.level.required.length-missingCargo(world)}/${world.level.required.length}`:
      world.player.row<3?t('dock'):t(world.level.hint);
  }
  renderer.draw(world, dt, journey.equipped === 'aurora');
  if (world.state === 'impact' && world.phaseTime >= .48) { finish(false); return; }
  if (world.state === 'arriving' && world.phaseTime >= .7) {
    finish(true); return;
  }
  raf = requestAnimationFrame(loop);
}
function refreshCamp() {
  journey = readJourney(storage);
  $('masteryCount').textContent = `${campaign.medals.filter(v=>v&1).length} / 30`;
  $('savedLanterns').textContent = journey.lanterns;
  $('diamondBalance').textContent = window.WeightPlayWallet?.read().diamonds || 0;
  $('medalList').replaceChildren(...campaignCopy.arcs.map((name, i) => {
    const count=campaign.medals.slice(i*5,i*5+5).filter(v=>v&1).length;
    const row = document.createElement('li'), image = document.createElement('span'), label = document.createElement('span'), amount = document.createElement('strong');
    image.className = 'lantern-art'; image.setAttribute('aria-hidden','true'); row.dataset.earned = count > 0;
    label.textContent = name; amount.textContent = `${count} / 5`; row.append(image,label,amount); return row;
  }));
  $('buyBtn').textContent = journey.aurora ? `${t('equip')} · ${t('aurora')}` : `${t('buy')} · ${COST}`;
  $('buyBtn').disabled = practiceMode||practiceRun||(journey.aurora && journey.equipped === 'aurora');
  $('equipGold').disabled = practiceMode||practiceRun||journey.equipped === 'gold';
  $('ownership').textContent = journey.aurora ? t('owned') : `${COST}`;
  $('campPreview').classList.toggle('aurora', journey.equipped === 'aurora');
}
function equip(name) {
  if(practiceMode||practiceRun)return;
  const prior = journey.equipped; journey.equipped = name;
  if (!saved()) journey.equipped = prior;
  refreshCamp(); renderer?.draw(world, 0, journey.equipped === 'aurora');
}
async function purchase() {
  if (purchaseBusy || practiceMode || practiceRun) return;
  purchaseBusy = true; $('confirmBuy').disabled = true;
  try {
    const transact = () => buyAurora(storage, window.WeightPlayWallet);
    const result = navigator.locks ? await navigator.locks.request('weightplay-road-crosser-purchase', transact) : transact();
    if (result.ok) { journey = result.journey; play('shop.purchase'); $('campNotice').textContent = t('owned'); }
    else { $('campNotice').textContent = t(result.reason === 'funds' ? 'funds' : 'storage'); play('feedback.error'); }
    $('purchaseConfirm').hidden = true; refreshCamp(); renderer?.draw(world, 0, journey.equipped === 'aurora');
    animate($('campPreview'), [{ opacity: .5 }, { opacity: 1 }], 220);
  } catch {
    $('campNotice').textContent = t('storage'); play('feedback.error');
  } finally { purchaseBusy = false; $('confirmBuy').disabled = false; $('buyBtn').focus({ preventScroll: true }); }
}

listen($('startBtn'), 'click', showStages); listen($('retryBtn'), 'click', () => start());
listen($('nextBtn'), 'click', () => start(world.stage+1));
listen($('homeBtn'), 'click', showStages); listen($('stageBackBtn'),'click',()=>setScreen('main'));
listen($('battleBackBtn'), 'click', () => screen === 'result' ? showStages() : openPanel('leaveDialog'));
listen($('continueBtn'), 'click', closePanel); listen($('leaveBtn'), 'click', showStages);
listen($('signalBtn'),'click',()=>{if(!isBlocked()&&useSignal(world))consumeEvents();});
listen($('helpBtn'), 'click', () => openPanel('helpPanel', $('helpBtn')));
listen($('campBtn'), 'click', () => openPanel('campPanel', $('campBtn')));
listen($('resultCampBtn'), 'click', () => openPanel('campPanel', $('resultCampBtn')));
for (const button of document.querySelectorAll('[data-close-panel]')) listen(button, 'click', closePanel);
for (const button of document.querySelectorAll('[data-move]')) listen(button, 'click', () => move(button.dataset.move));
listen($('equipGold'), 'click', () => equip('gold'));
listen($('buyBtn'), 'click', () => {
  if (journey.aurora) { equip('aurora'); return; }
  $('campNotice').textContent = ''; $('purchaseConfirm').hidden = false; $('confirmBuy').focus({ preventScroll: true });
});
listen($('cancelBuy'), 'click', () => { $('purchaseConfirm').hidden = true; $('buyBtn').focus(); });
listen($('confirmBuy'), 'click', purchase);
listen(document, 'keydown', event => {
  const modal = panel ? $(panel) : screen === 'result' ? $('resultScreen') : null;
  if (modal) {
    if (event.key === 'Escape' && panel) { event.preventDefault(); closePanel(); return; }
    if (event.key === 'Tab') {
      const nodes = [...modal.querySelectorAll('button:not(:disabled)')].filter(n => n.getClientRects().length), first = nodes[0], end = nodes.at(-1);
      if (!modal.contains(document.activeElement) || (event.shiftKey && document.activeElement === first)) { event.preventDefault(); (event.shiftKey ? end : first)?.focus(); }
      else if (!event.shiftKey && document.activeElement === end) { event.preventDefault(); first?.focus(); }
    }
    return;
  }
  if (event.target.closest('select,input,textarea') || event.repeat) return;
  const direction = { arrowup:'up', arrowdown:'down', arrowleft:'left', arrowright:'right', w:'up', s:'down', a:'left', d:'right' }[event.key.toLowerCase()];
  if (screen === 'battle' && direction && !isBlocked()) { event.preventDefault(); move(direction); }
});
listen(canvas,'pointerdown',event => { if (isBlocked()) return; gesture = { x: event.clientX, y: event.clientY, id: event.pointerId }; canvas.setPointerCapture(event.pointerId); });
listen(canvas,'pointercancel', () => { gesture = null; });
listen(canvas,'pointerup', event => {
  if (!gesture || gesture.id !== event.pointerId) return;
  const dx = event.clientX - gesture.x, dy = event.clientY - gesture.y; gesture = null;
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return;
  move(Math.abs(dx) > Math.abs(dy) ? dx > 0 ? 'right' : 'left' : dy > 0 ? 'down' : 'up');
});
listen(window,'weightplay:interaction-state',syncPause);
listen(document,'visibilitychange',syncPause);
listen(window,'resize',() => { renderer?.resize(); if (world) renderer?.draw(world,0,journey.equipped === 'aurora'); });
listen(window,'storage',() => { journey = readJourney(storage); best = readBest(storage); campaign=readCampaign(storage);updateHud();if(screen==='stage')renderStages(); if (panel === 'campPanel') refreshCamp(); });
listen(window,'pagehide',event => { generation++; selector?.cancel();cancelAnimationFrame(raf); clearTimeout(loadTimeout); cancelEffects(); paused = true; audio.stop(); if (!event.persisted) { lifetime.abort(); selector?.destroy();frame.destroy(); audio.dispose(); } });
listen(window,'pageshow',event => { if (event.persisted) syncPause(); });
// Shared Settings already owns locale navigation. Do not install a competing handler.
updateHud(); setScreen('main');

const loader = window.WeightPlayGameEntryLoader;
let loadFailed = false, loaded = 0;
const atlas = new Image(), terrain = new Image();
const required = [atlas, terrain, document.querySelector('.main-poster')];
loader.begin(required.length);
function failLoad(error) {
  if (lifetime.signal.aborted || ready || loadFailed) return;
  loadFailed = true; clearTimeout(loadTimeout); $('startBtn').disabled = true;
  console.error('Road Crosser required asset failed:', error?.message || 'timeout');
  loader.fail(undefined, () => location.reload());
}
const loadTimeout = setTimeout(() => failLoad(new Error('Required assets timed out')), 20000);
function requiredImage(image, source) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const cleanup = () => { image.removeEventListener('load', complete); image.removeEventListener('error', failure); };
    const complete = () => {
      if (settled) return; settled = true; cleanup();
      if (!image.naturalWidth) { reject(Error(source || image.src)); return; }
      if (!loadFailed && !lifetime.signal.aborted) loader.assetProgress(++loaded, required.length);
      resolve();
    };
    const failure = () => { if (settled) return; settled = true; cleanup(); reject(Error(source || image.src)); };
    image.addEventListener('load', complete, { once: true }); image.addEventListener('error', failure, { once: true });
    if (source) image.src = source;
    if (image.complete && image.src) complete();
    lifetime.signal.addEventListener('abort', cleanup, { once: true });
  });
}
Promise.all([requiredImage(atlas,'/games/road-crosser/art/courier-atlas-v22.webp'),
  requiredImage(terrain,'/games/road-crosser/art/terrain-v22.webp'), requiredImage(required[2])]).then(() => {
  if (loadFailed || lifetime.signal.aborted) return;
  renderer = createRenderer(canvas, atlas, terrain, () => motion.matches); renderer.resize();
  clearTimeout(loadTimeout); ready = true; $('startBtn').disabled = false; loader.ready();
  LocalPractice.register({gameId:'road-crosser',stageIds:LEVELS.map(l=>l.id),
    enable:enabled=>{practiceMode=enabled;if(screen==='stage')renderStages();},startStage:id=>start(Number(id),{practice:true})});
}).catch(failLoad);

// Read-only engineering observation; play always uses the visible controls.
window.__roadCrosserSmoke = Object.freeze({ snapshot: () => ({ screen, stage: world?.stage || 1, score: total + (world?.score || 0), best,
  player: world ? { ...world.player } : null, traffic: world?.traffic.map(c => c.x), logs: world?.logs.map(l => l.x),
  paused, leaveOpen: panel === 'leaveDialog', panel, ready, phase: world?.state, journey: { ...journey, clears: [...journey.clears] },
  campaign:structuredClone(campaign),practiceRun,moves:world?.moves,charges:world?.charges,missingCargo:world?missingCargo(world):0 }) });
