import { STAGES, SAVE_KEY, LEGACY_KEY, STEP, wrap, createRun, launch, focus, step, normalizeSave, recordClear, starsFor } from './orchard-model.mjs';
import { LocalPractice } from '../../src/game-local-practice.mjs';

const $ = id => document.getElementById(id);
const locales = window.ORBIT_ORCHARD_LOCALES;
const routeLocales = { 'zh-tw': 'zh-Hant', 'zh-cn': 'zh-Hans', 'pt-br': 'pt-BR' };
const route = location.pathname.split('/').filter(Boolean)[0];
let locale = routeLocales[route] || (locales.__localeKeys.includes(route) ? route : 'en');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const read = key => { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; } };
let save = normalizeSave(read(SAVE_KEY), read(LEGACY_KEY));
let frame, rail, scene, run, screen = 'main', selected = save.highestUnlocked - 1;
let raf = 0, last = 0, accumulator = 0, visualTime = 0, finishAt = 0, starting = false, generation = 0;
let modal = null, modalReturn = null, practice = false, practiceRun = false, storageFailed = false, themeBusy = false;
let sceneFailed = false, statusKey = 'ready', statusVars = {}, heldDirection = 0;
const held = new Set();
const abort = new AbortController();
const listen = (target, name, handler, opts = {}) => target.addEventListener(name, handler, { ...opts, signal: abort.signal });
const t = (key, vars = {}) => String(locales[locale]?.[key] ?? locales.en[key] ?? key).replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
const stars = () => Object.values(save.stars).reduce((a, b) => a + b, 0);
const playSound = id => window.WeightPlayAudio?.play(id);
function status(key, vars = {}) { statusKey = key; statusVars = vars; $('battleStatus').textContent = t(key, vars); }
function settingsOpen() { return Boolean(document.querySelector('#battleScreen [data-wp-settings][aria-expanded="true"]')); }
function active() { return screen === 'battle' && !modal && !document.hidden && !settingsOpen() && !sceneFailed; }
function themeOwned() {
  const record = read('weightplay-orbit-aurora-v1');
  if (record?.owned) return true;
  // A completed wallet debit with an interrupted entitlement write is recoverable.
  if (record?.pending && Number.isFinite(record.before) && window.WeightPlayWallet?.read().diamonds === record.before - 8) {
    try { localStorage.setItem('weightplay-orbit-aurora-v1', JSON.stringify({ owned: true })); } catch { /* Journal remains recoverable. */ }
    return true;
  }
  return false;
}
let aurora = themeOwned();
async function ensureScene(token = generation) {
  if (!scene) {
    const { OrchardScene } = await import('./orchard-scene.mjs');
    if (token !== generation) return null;
    scene ||= new OrchardScene($('orchardCanvas'), $('fruitLabels'), () => showSceneError());
  }
  return scene;
}
function progress() {
  const copy = t('facts', { cleared: save.cleared.length, total: STAGES.length, stars: stars() });
  document.querySelectorAll('[data-wp-main-progress]').forEach(node => { if (node.textContent !== copy) node.textContent = copy; });
  $('campaignProgress').textContent = `${save.cleared.length} / ${STAGES.length}`;
  $('campaignProgress').setAttribute('aria-label', copy);
}
function applyCopy() {
  document.documentElement.lang = locale; document.documentElement.dir = locales[locale].direction || 'ltr';
  document.querySelectorAll('[data-copy]').forEach(node => { node.textContent = t(node.dataset.copy); });
  document.querySelectorAll('[data-copy-aria-label]').forEach(node => node.setAttribute('aria-label', t(node.dataset.copyAriaLabel)));
  $('aimLeft').setAttribute('aria-label', `${t('aim')} −`); $('aimRight').setAttribute('aria-label', `${t('aim')} +`);
  $('orchardCanvas').setAttribute('aria-label', t('aimHelp'));
  progress(); rail?.refresh(selected); if (run) updateHud();
  if (screen === 'result') renderResult();
}
function setScreen(next) {
  stopLoop(); clearHeld(); modal = null;
  document.querySelectorAll('.orchard-modal').forEach(node => { node.hidden = true; });
  $('battleContent').inert = false; $('battleContent').hidden = next === 'result';
  $('resultScreen').hidden = next !== 'result';
  ['main', 'stage', 'battle'].forEach(name => { $(`${name}Screen`).hidden = name !== (next === 'result' ? 'battle' : next); });
  screen = next; document.body.dataset.screen = next === 'result' ? 'battle' : next;
  $('guideSection').hidden = next !== 'main'; $('app').querySelector('footer').hidden = next !== 'main';
  frame.activate(next === 'result' ? 'battle' : next, { covered: next === 'result' });
  progress();
  if (next === 'stage') rail.refresh(selected);
  if (next === 'battle') { scene?.resize(); requestAnimationFrame(() => { if (screen === 'battle') scene?.resize(); }); startLoop(); }
  window.scrollTo(0, 0);
}
function openMap() { generation++; rail?.cancel(); selected = Math.max(selected, save.highestUnlocked - 1); setScreen('stage'); }
async function startStage(index) {
  if (starting) return;
  const stage = STAGES[index];
  if (!stage || (!practice && stage.id > save.highestUnlocked)) return;
  starting = true; const token = ++generation;
  try {
    if (practice && !await LocalPractice.validate()) return;
    practiceRun = practice; selected = index;
    await ensureScene(token);
    if (token !== generation) return;
    sceneFailed = false; run = createRun(stage); accumulator = 0; visualTime = 0; finishAt = 0;
    scene.setStage(stage); status('ready'); setScreen('battle'); updateHud();
    $('orchardCanvas').focus({ preventScroll: true });
    playSound('game.start');
  } catch (error) { console.error('ORCHARD_RENDER_FAILED', error); setScreen('battle'); showSceneError(); }
  finally { starting = false; }
}
function showSceneError() {
  sceneFailed = true; stopLoop(); modal = null; openModal('sceneError');
}
function stopLoop() { if (raf) cancelAnimationFrame(raf); raf = 0; last = 0; accumulator = 0; }
function startLoop() { if (raf || screen !== 'battle') return; last = 0; raf = requestAnimationFrame(tick); }
function tick(now) {
  raf = 0;
  if (screen !== 'battle' || !scene || !run || sceneFailed) return;
  const dt = last ? Math.min(.05, (now - last) / 1000) : 0; last = now;
  if (active()) {
    visualTime += dt;
    const direction = heldDirection || (held.has('ArrowRight') ? 1 : 0) - (held.has('ArrowLeft') ? 1 : 0);
    if (direction && !run.complete) run.aim = wrap(run.aim + direction * dt * 75);
    accumulator += dt;
    while (accumulator >= STEP) { step(run); accumulator -= STEP; }
    for (const event of run.events.splice(0)) {
      const destination = $('harvestHud').getBoundingClientRect();
      scene.event(event, visualTime, reduced.matches, { x: destination.left + destination.width / 2, y: destination.top + destination.height / 2 });
      if (event.type === 'launch') playSound('projectile.launch');
      if (event.type === 'harvest') { playSound(event.chain > 1 ? 'puzzle.clear' : 'reward.collect'); status(event.chain > 1 ? 'chain' : 'ready', { count: event.chain }); }
      if (event.type === 'block') { playSound('impact.wood'); status('block'); }
      if (event.type === 'miss' || event.type === 'order') { playSound('feedback.error'); status(event.type); }
      if (event.type === 'focus') { playSound('magic.cast'); status('focused', { time: '3.0' }); }
      if (event.type === 'complete') { finishAt = visualTime + .65; playSound('result.win'); }
    }
    if (finishAt && visualTime >= finishAt) { finish(); return; }
  }
  updateHud(); scene.render(run, visualTime, reduced.matches, aurora);
  raf = requestAnimationFrame(tick);
}
function updateHud() {
  if (!run) return;
  $('roundLabel').textContent = `${run.stage.id} / ${STAGES.length}`;
  $('releaseCount').textContent = String(run.shots);
  $('harvestCount').textContent = `${run.harvested.length} / ${run.stage.targets.length}`;
  $('stageArc').textContent = locales[locale].arcNames[run.stage.arc - 1];
  $('parLabel').textContent = t('par', { par: run.stage.par });
  $('aimReadout').textContent = `${Math.round(wrap(run.aim))}°`;
  $('focusBtn').disabled = !active() || run.stage.id < 6 || run.focusUsed;
  $('focusBtn').title = t(run.stage.id < 6 ? 'focusLocked' : run.focusUsed ? 'focusSpent' : 'focus');
  $('focusText').textContent = run.focusLeft > 0 ? t('focused', { time: run.focusLeft.toFixed(1) }) : t('focus');
  $('focusBtn').classList.toggle('is-active', run.focusLeft > 0);
  $('fireBtn').disabled = !active() || run.complete || Boolean(run.projectile) || run.cooldown > 0;
  $('battleContent').classList.toggle('is-frozen', run.focusLeft > 0);
  $('practiceLabel').hidden = !practiceRun;
  $('pauseVeil').hidden = !document.hidden && !settingsOpen();
  $('battleStatus').textContent = t(statusKey, statusVars);
  if (run.focusLeft <= 0 && statusKey === 'focused') status('ready');
}
function finish() {
  finishAt = 0;
  if (!practiceRun) {
    const next = recordClear(save, run.stage, run.shots);
    const newlyUnlocked = next.highestUnlocked > save.highestUnlocked;
    save = next;
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); storageFailed = false; }
    catch { storageFailed = true; }
    if (newlyUnlocked) playSound('reward.unlock');
    if (!storageFailed) window.WonderAnalytics?.completeStage?.(run.stage.id);
  }
  setScreen('result'); renderResult(); $('resultNextBtn').disabled ? $('resultReplayBtn').focus() : $('resultNextBtn').focus();
}
function renderResult() {
  $('resultText').textContent = t('resultLine', { id: run.stage.id, shots: run.shots, stars: starsFor(run.stage, run.shots) });
  $('resultStars').textContent = '★'.repeat(starsFor(run.stage, run.shots)) + '☆'.repeat(3 - starsFor(run.stage, run.shots));
  $('resultStars').setAttribute('aria-label', `${starsFor(run.stage, run.shots)} / 3`);
  $('bestValue').textContent = String(practiceRun ? run.shots : save.best[run.stage.id] || run.shots);
  $('saveWarning').hidden = !storageFailed && !practiceRun; $('saveWarning').textContent = t(practiceRun ? 'practice' : 'saveError');
  $('resultNextBtn').disabled = run.stage.id === STAGES.length;
}
function clearHeld() { held.clear(); heldDirection = 0; }
function openModal(id) {
  if (modal || (screen !== 'battle' && screen !== 'stage')) return;
  clearHeld(); modalReturn = document.activeElement; modal = $(id); modal.hidden = false;
  if (screen === 'battle') $('battleContent').inert = true;
  modal.querySelector('button:not([disabled])')?.focus();
}
function closeModal() {
  if (modal?.id === 'sceneError') return;
  if (!modal) return; modal.hidden = true; modal = null; $('battleContent').inert = false;
  modalReturn?.focus({ preventScroll: true }); last = 0; accumulator = 0;
}
function fire() { if (active() && run) launch(run); }
function trap(event, container) {
  if (event.key !== 'Tab') return;
  const nodes = [...container.querySelectorAll('button:not([disabled]),[tabindex="0"]')].filter(n => !n.hidden);
  if (!nodes.length) return;
  const first = nodes[0], end = nodes.at(-1);
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); end.focus(); }
  else if (!event.shiftKey && document.activeElement === end) { event.preventDefault(); first.focus(); }
}
function renderTheme() {
  aurora = themeOwned(); $('diamondBalance').textContent = String(window.WeightPlayWallet.read().diamonds);
  $('buyTheme').textContent = t(aurora ? 'owned' : 'buy'); $('buyTheme').disabled = aurora || practice || themeBusy;
  $('themeNotice').textContent = practice ? t('practice') : '';
}
async function buyTheme() {
  if (themeBusy || practice || aurora) return; themeBusy = true;
  const purchase = () => {
    if (themeOwned()) { aurora = true; return; }
    const wallet = window.WeightPlayWallet, before = wallet.read().diamonds;
    const journal = read('weightplay-orbit-aurora-v1');
    if (journal?.pending && journal.before !== before) { $('themeNotice').textContent = t('saveError'); return; }
    if (before < 8) { $('themeNotice').textContent = t('insufficient'); return; }
    try {
      localStorage.setItem('weightplay-orbit-aurora-v1', JSON.stringify({ pending: true, before }));
      if (!wallet.spendDiamonds(8)) { localStorage.removeItem('weightplay-orbit-aurora-v1'); $('themeNotice').textContent = t('insufficient'); return; }
      // If this final write fails, the durable pending receipt proves the debit.
      aurora = true; localStorage.setItem('weightplay-orbit-aurora-v1', JSON.stringify({ owned: true }));
      playSound('shop.purchase');
    } catch { $('themeNotice').textContent = t('saveError'); }
  };
  try { if (navigator.locks) await navigator.locks.request('weightplay-orbit-aurora-purchase', purchase); else purchase(); }
  finally { themeBusy = false; $('diamondBalance').textContent = String(window.WeightPlayWallet.read().diamonds); $('buyTheme').textContent = t(aurora ? 'owned' : 'buy'); $('buyTheme').disabled = aurora; }
}

function init() {
  $('battleScreen').append($('resultScreen'));
  frame = window.WeightPlayScreenFrame.mount({ root: $('app'), localeSelect: $('localeSelect'), playUI: true,
    scenes: {
      main: { root: $('mainScreen'), header: $('mainScreen').querySelector('.topbar'), content: $('mainScreen').querySelector('.hero-card') },
      stage: { root: $('stageScreen'), header: $('stageScreen').querySelector('.panel-head'), content: $('stageScreen').querySelector('.stage-workspace'), headerInfo: $('stageHeaderInfo') },
      battle: { root: $('battleScreen'), header: $('battleScreen').querySelector('.panel-head'), content: $('battlePlayfield'), headerInfo: $('battleHeaderInfo') }
    } });
  const tab = document.createElement('button'); tab.type = 'button'; tab.dataset.copy = 'stages'; tab.dataset.wpFrameAction = 'tab'; tab.setAttribute('aria-current', 'page');
  const themes = document.createElement('button'); themes.type = 'button'; themes.dataset.copy = 'themes'; themes.dataset.wpFrameAction = 'tab';
  listen(themes, 'click', async () => {
    renderTheme(); openModal('themeDialog'); $('buyTheme').disabled = true;
    try { const view = await ensureScene(); if (!view || modal?.id !== 'themeDialog') return; $('themeArt').src = view.previewSeed(); $('themeArt').hidden = false; renderTheme(); }
    catch { $('themeNotice').textContent = t('webglError'); }
  });
  frame.commonDownButton.clear().add(tab).add(themes);
  rail = window.WeightPlayPlayUI.mountStage({ page: $('stageScreen').querySelector('.stage-workspace'), rail: $('orbitList'),
    config: window.WeightPlayOrbitOrchardStageConfig.create({ rounds: STAGES, getCampaign: () => save, localize: t, arcName: stage => locales[locale].arcNames[stage.arc - 1], isPractice: () => practice }),
    selected, onSelect: i => { selected = i; }, onStart: i => { rail.cancel(); startStage(i); }, isActive: () => screen === 'stage' });
  const select = $('localeSelect');
  for (const key of locales.__localeKeys) { const option = document.createElement('option'); option.value = key; option.textContent = locales.en.languageNames[key]; select.append(option); }
  select.value = locale; listen(select, 'change', () => { locale = select.value; applyCopy(); });
  listen($('startBtn'), 'click', openMap); listen($('stageBackBtn'), 'click', () => { generation++; rail.cancel(); setScreen('main'); });
  listen($('battleBackBtn'), 'click', () => openModal('pauseDialog'));
  listen($('fireBtn'), 'click', fire); listen($('focusBtn'), 'click', () => { if (active()) focus(run); });
  listen($('helpBtn'), 'click', () => { $('helpText').textContent = `${t('guideOne')}\n\n${t('guideTwo')}\n\n${t('guideThree')}`; openModal('helpDialog'); });
  document.querySelectorAll('[data-close-modal]').forEach(button => listen(button, 'click', closeModal));
  listen($('pauseStages'), 'click', () => { closeModal(); openMap(); });
  listen($('pauseRestart'), 'click', () => { closeModal(); startStage(selected); });
  listen($('resultMapBtn'), 'click', openMap); listen($('resultNextBtn'), 'click', () => startStage(selected + 1));
  listen($('resultReplayBtn'), 'click', () => startStage(selected)); listen($('buyTheme'), 'click', buyTheme);
  listen($('retry3d'), 'click', () => { scene?.dispose(); scene = null; sceneFailed = false; $('sceneError').hidden = true; startStage(selected); });
  listen($('errorStages'), 'click', () => { $('sceneError').hidden = true; openMap(); });
  const canvas = $('orchardCanvas'); let pointer = null;
  const aimAt = event => { if (!active() || !run || run.complete) return; const a = scene?.aim(event.clientX, event.clientY); if (a !== null && a !== undefined) run.aim = wrap(a); };
  listen(canvas, 'pointerdown', e => { if (!active()) return; pointer = e.pointerId; canvas.setPointerCapture(pointer); aimAt(e); canvas.focus(); });
  listen(canvas, 'pointermove', e => { if (e.pointerId === pointer) aimAt(e); });
  const releasePointer = e => { if (e.pointerId !== pointer) return; pointer = null; if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId); };
  listen(canvas, 'pointerup', releasePointer); listen(canvas, 'pointercancel', releasePointer); listen(canvas, 'lostpointercapture', () => { pointer = null; });
  for (const [id, direction] of [['aimLeft', -1], ['aimRight', 1]]) {
    const button = $(id);
    listen(button, 'pointerdown', e => { if (!active()) return; button.setPointerCapture(e.pointerId); run.aim = wrap(run.aim + direction * 2); heldDirection = direction; });
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) listen(button, type, () => { heldDirection = 0; });
    listen(button, 'click', e => { if (e.detail === 0 && active()) run.aim = wrap(run.aim + direction * 2); });
  }
  listen(document, 'keydown', e => {
    if (modal) { if (e.key === 'Escape') { e.preventDefault(); closeModal(); } else trap(e, modal); return; }
    if (screen === 'result') { trap(e, $('resultScreen')); return; }
    if (!active()) return;
    if (e.key === 'Escape') { e.preventDefault(); openModal('pauseDialog'); return; }
    if (['ArrowLeft','ArrowRight'].includes(e.key)) { e.preventDefault(); if (!held.has(e.key)) run.aim = wrap(run.aim + (e.key === 'ArrowRight' ? 2 : -2)); held.add(e.key); }
    if (e.code === 'Space' && !e.repeat && !e.target.closest('button,select,input')) { e.preventDefault(); fire(); }
    if (e.key.toLowerCase() === 'f' && !e.repeat) { e.preventDefault(); focus(run); }
  });
  listen(document, 'keyup', e => held.delete(e.key));
  listen(window, 'blur', clearHeld);
  listen(document, 'visibilitychange', () => { clearHeld(); last = 0; accumulator = 0; if (document.hidden) stopLoop(); else startLoop(); });
  listen(window, 'weightplay:interaction-state', () => { clearHeld(); last = 0; accumulator = 0; });
  listen(window, 'weightplay:shell-sync', progress);
  listen(window, 'pagehide', () => { generation++; stopLoop(); scene?.dispose(); scene = null; rail?.cancel(); });
  listen(window, 'pageshow', e => { if (e.persisted && screen === 'battle') startStage(selected); });
  applyCopy(); $('app').hidden = false; $('loadingPanel').hidden = true; setScreen('main');
  LocalPractice.register({ gameId: 'animal-orbit-orchard', stageIds: STAGES.map(s => s.id),
    enable: enabled => { practice = enabled; rail.refresh(selected); }, startStage: id => startStage(Number(id) - 1) });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
