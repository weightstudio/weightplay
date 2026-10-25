import { STAGES, createState, step, solve, starRating, normalizeSave, recordWin, availableSkins, SKINS, SAVE_KEY, LEGACY_SOLVED_KEY } from './model.mjs?v=19';
import { FLIGHT_COPY } from './flight-copy.mjs?v=19';
import { SkyScene } from './scene.mjs?v=19';

const $ = id => document.getElementById(id), abort = new AbortController();
const on = (node, event, handler, options = {}) => node.addEventListener(event, handler, { ...options, signal: abort.signal });
const routeLocales = { en: 'en', 'zh-tw': 'zh-Hant', 'zh-cn': 'zh-Hans', ja: 'ja', ko: 'ko', es: 'es', 'pt-br': 'pt-BR', fr: 'fr', de: 'de', it: 'it', ru: 'ru', hi: 'hi', ar: 'ar' };
const locale = routeLocales[location.pathname.split('/').filter(Boolean)[0]] || 'en';
const copy = (key, values = {}) => {
  const value = FLIGHT_COPY[locale][key] ?? window.KITE_KEEPER_LOCALES[locale]?.[key] ?? key;
  return typeof value === 'string' ? value.replace(/\{(\w+)\}/g, (_, token) => String(values[token] ?? '')) : value;
};
let writable = true;
function readJSON(key, fallback) { try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; } }
function legacyIds() { const ids = readJSON(LEGACY_SOLVED_KEY, []); return Array.isArray(ids) ? ids : []; }
let save = normalizeSave(readJSON(SAVE_KEY, {}), legacyIds());
try {
  localStorage.setItem(`${SAVE_KEY}-probe`, '1'); localStorage.removeItem(`${SAVE_KEY}-probe`);
  if (localStorage.getItem('wonderSoundMuted') === null && localStorage.getItem('weightplay-kite-keeper-sound') === 'off') window.WeightPlayAudio?.setMuted?.(true);
} catch { writable = false; }
const audio = window.WeightPlayAudio?.createScope?.();
window.WeightPlayAudio?.preload?.(['game.start', 'board.move', 'reward.collect', 'result.win', 'feedback.error', 'feedback.hint', 'reward.unlock', 'shop.purchase']);
const sound = event => audio?.play(event), host = window.mountKiteKeeperFrame();
$('mainProgress').after($('saveWarning'));
let screen = 'main', stageTab = 'stages', overlay = null, returnFocus = null, selected = STAGES.findIndex(route => !save.solved.includes(route.id));
if (selected < 0) selected = 0;
let stage = STAGES[selected], state = createState(stage), history = [], trail = [], assisted = false, busy = false;
let scene = null, generation = 0, purchasing = false, pointer = null, suppressPointer = false;
const effects = new Set(), totalStars = () => Object.values(save.records).reduce((sum, record) => sum + record.stars, 0);
function settingsOpen() { return Boolean(document.querySelector('[data-wp-settings][aria-expanded="true"]')); }
function paused() { return screen !== 'battle' || Boolean(overlay) || document.hidden || settingsOpen() || !$('skyError').hidden; }
function syncPause() { scene?.setPaused(paused()); if (paused()) audio?.stop(); }
function storageWarning() { $('saveWarning').hidden = writable; $('saveWarning').textContent = copy('storageError'); }
function persist() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); localStorage.setItem(LEGACY_SOLVED_KEY, JSON.stringify(save.solved)); }
  catch { writable = false; }
  storageWarning(); return writable;
}
function animate(node, frames, duration = 160) {
  if (!node?.animate || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const animation = node.animate(frames, { duration, easing: 'cubic-bezier(.2,.8,.2,1)' }); effects.add(animation);
  animation.finished.catch(() => {}).finally(() => effects.delete(animation));
}
function cancelEffects() { effects.forEach(animation => animation.cancel()); effects.clear(); document.querySelectorAll('.light-flight').forEach(node => node.remove()); }
function status(key, values = {}) { $('status').textContent = key ? copy(key, values) : writable ? '' : copy('storageError'); }
function sceneChange(next) {
  generation++; busy = false; scene?.cancel(); cancelEffects(); closeOverlay(false); screen = next; host.activate(next);
  $('battleContent').inert = false; $('stageWorkspace').inert = false; if (next === 'stage') selectStageTab('stages'); syncPause(); updateProgress();
  animate($(next === 'main' ? 'mainHero' : next === 'stage' ? 'stageWorkspace' : 'battleContent'), [{ opacity: .55 }, { opacity: 1 }]);
}
function stageName(route) { return `${copy('chapterNames')[route.chapter]} · ${route.id}`; }
function objective(route) { return copy(route.ordered ? 'ordered' : route.sparks.length ? 'collect' : 'navigate'); }
function stageRecord(index) {
  const route = STAGES[index], record = save.records[route.id];
  return { id: route.id, kicker: copy('map'), title: stageName(route), subtitle: objective(route),
    status: record ? '★'.repeat(record.stars) + '☆'.repeat(3 - record.stars) : save.solved.includes(route.id) ? '✓' : '',
    summary: copy('par', { count: route.par }), details: [copy('gustBudget', { used: 0, max: route.budget })],
    poster: '/games/animal-kite-keeper/assets/animal-kite-keeper-cover-block-v1.webp', locked: false, cleared: save.solved.includes(route.id) };
}
const rail = window.WeightPlayPlayUI.mountStage({
  page: $('stageWorkspace'), rail: $('stageList'), selected,
  config: { count: STAGES.length, poster: '/games/animal-kite-keeper/assets/animal-kite-keeper-cover-block-v1.webp', background: '/assets/lobby-block-atmosphere.svg', stage: stageRecord },
  onSelect(index) { selected = index; updateProgress(); }, onStart: startRoute, isActive: () => screen === 'stage' && stageTab === 'stages' && !overlay,
});
$('stageWorkspace').append($('equipmentScreen'));
function updateProgress() {
  $('mainProgress').textContent = copy('completeCount', { count: save.solved.length }); $('best').textContent = copy('stars', { count: totalStars() });
  host.stageProgress.textContent = `${selected + 1} / 30`; host.routeTitle.textContent = stageName(stage); host.progressPill.textContent = `${state.moves} / ${stage.budget}`; storageWarning();
}
function labels(positions, current) {
  const nodes = $('boardLabels').children;
  positions.forEach((point, i) => {
    if (!nodes[i]) return;
    nodes[i].style.left = `${point.x}px`; nodes[i].style.top = `${point.y}px`; nodes[i].hidden = Boolean(current.mask & (1 << i));
    nodes[i].classList.toggle('next-light', !stage.ordered || (current.mask & ((1 << i) - 1)) === (1 << i) - 1);
  });
}
function ensureScene() {
  if (scene) return true;
  try {
    scene = new SkyScene($('flightBoard'), { onLabels: labels, onLoss() { $('skyError').hidden = false; busy = false; syncPause(); } });
    $('skyError').hidden = true; return true;
  } catch (error) { $('skyError').hidden = false; document.body.dataset.kiteRenderError = String(error?.message || error); return false; }
}
function startRoute(index) {
  selected = index; stage = STAGES[index]; sceneChange('battle'); state = createState(stage); history = []; trail = []; assisted = false; $('skyError').hidden = true;
  $('windGrid').querySelectorAll('.hinted').forEach(node => node.classList.remove('hinted'));
  $('boardLabels').replaceChildren(...stage.sparks.map((_, i) => { const label = document.createElement('span'); label.className = 'lantern-number'; label.textContent = stage.ordered ? String(i + 1) : '◆'; return label; }));
  if (ensureScene()) scene.setStage(stage, state, save.skin);
  $('battleScreen').dataset.chapter = String(stage.chapter); renderBattle(); status(''); syncPause(); sound('game.start');
  window.dispatchEvent(new Event('weightplay:kite-keeper-route-start')); $('flightBoard').focus({ preventScroll: true });
}
function renderBattle() {
  updateProgress(); $('prompt').textContent = objective(stage); $('currentRule').textContent = stage.currents.length ? copy('current') : copy('par', { count: stage.par });
  $('gusts').textContent = copy('gustBudget', { used: state.moves, max: stage.budget });
  $('lightCount').textContent = copy('lanterns', { used: state.mask.toString(2).replace(/0/g, '').length, max: stage.sparks.length }); $('lights').hidden = !stage.sparks.length;
  $('par').textContent = copy('par', { count: stage.par }); $('position').textContent = copy('position', { x: state.point[0] + 1, y: state.point[1] + 1 });
  $('flightBoard').setAttribute('aria-label', `${copy('ariaKite')}. ${$('position').textContent}. ${copy('legend')}`); $('assisted').hidden = !assisted;
  for (const button of $('windGrid').querySelectorAll('button')) button.disabled = busy || state.won || state.failed;
  $('undoBtn').disabled = busy || !history.length || state.won; $('hintBtn').disabled = busy || state.won || state.failed;
  $('battleContent').dataset.flightState = state.won ? 'won' : state.failed ? 'failed' : busy ? 'moving' : 'ready'; $('battleContent').dataset.stage = String(stage.id);
  if (state.failed) status('exhausted');
}
function collectFlight(bits) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const board = $('flightBoard').getBoundingClientRect(), target = $('lights').getBoundingClientRect();
  stage.sparks.forEach((point, i) => {
    if (!(bits & (1 << i))) return;
    const source = scene.project(point), dot = document.createElement('span'); dot.className = 'light-flight';
    const x = board.left + source.x, y = board.top + source.y; dot.style.left = `${x}px`; dot.style.top = `${y}px`; document.body.append(dot);
    const animation = dot.animate([{ transform: 'translate(-50%,-50%) scale(1)', opacity: 1 }, { transform: `translate(${target.left + target.width / 2 - x}px,${target.top + target.height / 2 - y}px) scale(.3)`, opacity: 0 }], { duration: 420, easing: 'cubic-bezier(.3,.2,.25,1)' });
    effects.add(animation); animation.finished.catch(() => {}).finally(() => { effects.delete(animation); dot.remove(); });
  });
}
function chooseWind(direction) {
  if (paused() || busy || state.won || state.failed || suppressPointer) return;
  const result = step(stage, state, direction); $('windGrid').querySelectorAll('.hinted').forEach(node => node.classList.remove('hinted'));
  if (!result.ok) { status('blocked'); sound('feedback.error'); animate($('flightBoard'), [{ transform: 'translateX(0)' }, { transform: 'translateX(-3px)' }, { transform: 'translateX(3px)' }, { transform: 'translateX(0)' }], 120); return; }
  history.push({ state, trail: [...trail] }); trail.push([...state.point], ...result.trace); state = result.state; busy = true; const token = generation;
  status(''); renderBattle(); sound('board.move');
  scene.move(result.trace, state, trail, () => {
    if (token !== generation) return;
    busy = false; renderBattle();
    if (result.collected) { sound('reward.collect'); collectFlight(result.collected); }
    if (state.won) finishRoute(); else if (state.point[0] === stage.dock[0] && state.point[1] === stage.dock[1]) status('dockEarly');
  });
}
function finishRoute() {
  const previousUnlocks = availableSkins(save).length; save = recordWin(save, stage, state, assisted); const stored = persist();
  if (stored && availableSkins(save).length > previousUnlocks) sound('reward.unlock');
  const stars = starRating(stage, state, assisted); $('resultTitle').textContent = copy(save.solved.length === 30 ? 'finished' : 'resultTitle');
  $('resultStars').textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars); $('resultStars').setAttribute('aria-label', `${stars} / 3`);
  $('resultText').textContent = copy('resultSummary', { moves: state.moves, stars }); $('resultBest').textContent = writable ? copy('savedBest', { count: save.records[stage.id].best }) : copy('storageError'); $('nextBtn').hidden = stage.id === 30;
  openOverlay('resultScreen', $('nextBtn').hidden ? $('replayBtn') : $('nextBtn')); sound('result.win'); updateProgress();
}
function undo() {
  if (paused() || busy || !history.length || state.won) return;
  const old = history.pop(); state = old.state; trail = old.trail; assisted = true; generation++; cancelEffects(); scene.cancel(); scene.sync(state, trail); renderBattle(); status(''); sound('board.move');
}
function hint() {
  if (paused() || busy || state.won || state.failed) return;
  const solution = solve(stage, state);
  if (!solution?.length || solution.length + state.moves > stage.budget) { status('noHint'); sound('feedback.error'); return; }
  assisted = true; renderBattle(); status('hintMove', { wind: copy(solution[0]) });
  $('windGrid').querySelectorAll('button').forEach(button => button.classList.toggle('hinted', button.dataset.wind === solution[0])); sound('feedback.hint');
}
function openOverlay(id, focus) {
  if (overlay) closeOverlay(false); returnFocus = document.activeElement; overlay = id; $(id).hidden = false;
  $(screen === 'stage' ? 'stageWorkspace' : 'battleContent').inert = true; host.familyButtons.forEach(button => { button.inert = true; }); host.activate(screen, { covered: true }); syncPause();
  animate($(id).querySelector('.dialog-card'), [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }]); focus?.focus({ preventScroll: true });
}
function closeOverlay(restore = true) {
  if (!overlay) return;
  $(overlay).hidden = true; overlay = null; $('battleContent').inert = false; $('stageWorkspace').inert = false; host.familyButtons.forEach(button => { button.inert = false; }); host.activate(screen); syncPause();
  if (restore && returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
}
function toStage() { sceneChange('stage'); rail.refresh(selected); }
function selectStageTab(tab) {
  stageTab = tab; $('stageWorkspace').dataset.kiteTab = tab; $('equipmentScreen').hidden = tab !== 'equipment'; $('stageList').inert = tab !== 'stages';
  host.familyButtons.forEach(button => { button.setAttribute('aria-pressed', String(button.dataset.routeFamily === tab)); button.classList.toggle('is-active', button.dataset.routeFamily === tab); });
  if (tab === 'equipment') { $('shopStatus').textContent = writable ? '' : copy('storageError'); renderEquipment(); } else rail.refresh(selected);
}
function walletBalance() { return window.WeightPlayWallet?.read?.().diamonds || 0; }
function renderEquipment() {
  $('walletBalance').textContent = String(walletBalance()); const available = availableSkins(save);
  $('equipmentList').replaceChildren(...SKINS.map((skin, i) => {
    const row = document.createElement('div'); row.className = `equipment-item skin-${skin}`;
    const swatch = document.createElement('img'); swatch.className = 'skin-preview'; swatch.alt = ''; swatch.width = 224; swatch.height = 224;
    swatch.src = new URL(`./assets/equipment/kite-${skin}.png`, import.meta.url).href;
    const name = document.createElement('strong'); name.textContent = copy('skinNames')[i];
    const action = document.createElement('button'); action.type = 'button'; action.dataset.skin = skin;
    action.textContent = skin === save.skin ? copy('equipped') : available.includes(skin) ? copy('equip') : skin === 'aurora' ? copy('buy') : copy('unlockAt', { count: [0, 5, 15, 30][i] });
    action.disabled = purchasing || skin === save.skin || !available.includes(skin) && (skin !== 'aurora' || !writable); action.addEventListener('click', () => equip(skin)); row.append(swatch, name, action); return row;
  }));
}
async function equip(skin) {
  if (purchasing) return;
  if (availableSkins(save).includes(skin)) { save = { ...save, skin }; persist(); scene?.skin(skin); renderEquipment(); return; }
  if (skin !== 'aurora' || !writable) return;
  purchasing = true; renderEquipment();
  const purchase = () => {
    const walletAction = () => {
    const fresh = normalizeSave(readJSON(SAVE_KEY, save), [...save.solved, ...legacyIds()]);
    if (fresh.aurora) { save = { ...fresh, skin }; persist(); return true; }
    if (walletBalance() < 12) { $('shopStatus').textContent = copy('insufficient', { count: walletBalance() }); sound('feedback.error'); return false; }
    const next = { ...fresh, aurora: true, skin };
    try {
      // Ownership is durable before charging. A crash in between can only
      // grant a free cosmetic; it cannot lose the player's diamonds.
      localStorage.setItem(SAVE_KEY, JSON.stringify(next));
      if (!window.WeightPlayWallet.spendDiamonds(12)) { localStorage.setItem(SAVE_KEY, JSON.stringify(fresh)); return false; }
      save = next; $('shopStatus').textContent = copy('purchased'); sound('shop.purchase'); return true;
    } catch {
      try { localStorage.setItem(SAVE_KEY, JSON.stringify(fresh)); } catch { /* Preserve the safe no-charge failure. */ }
      writable = false; storageWarning(); $('shopStatus').textContent = copy('storageError'); return false;
    }
  
    };
    return window.WeightPlayWallet?.withTransaction ? window.WeightPlayWallet.withTransaction("animal-kite-keeper:game.js:purchase", walletAction) : walletAction();
};
  try { if (navigator.locks) await navigator.locks.request('weightplay-kite-keeper-aurora', purchase); else purchase(); }
  finally { purchasing = false; scene?.skin(save.skin); renderEquipment(); }
}
function localize() {
  document.documentElement.lang = locale; document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(node => { if (!node.closest('#gameGuide')) node.textContent = copy(node.dataset.i18n); });
  $('localeSelect').value = locale; $('boardLegend').textContent = copy('legend'); $('stageBack').setAttribute('aria-label', copy('back')); $('battleBack').setAttribute('aria-label', copy('stages'));
  updateProgress(); rail.refresh(selected); renderBattle();
}
on($('startBtn'), 'click', toStage); on($('stageBack'), 'click', () => sceneChange('main'));
on($('battleBack'), 'click', () => { if (state.moves || busy) openOverlay('leaveScreen', $('stayBtn')); else toStage(); });
on($('windGrid'), 'click', event => { const button = event.target.closest('[data-wind]'); if (button) chooseWind(button.dataset.wind); });
on($('undoBtn'), 'click', undo); on($('hintBtn'), 'click', hint); on($('resetBtn'), 'click', () => { if (!paused()) startRoute(selected); });
on($('replayBtn'), 'click', () => startRoute(selected)); on($('nextBtn'), 'click', () => { if (selected < 29) startRoute(selected + 1); }); on($('resultStagesBtn'), 'click', toStage);
on($('stayBtn'), 'click', () => closeOverlay()); on($('leaveBtn'), 'click', toStage); on($('equipmentClose'), 'click', () => selectStageTab('stages'));
on($('retrySky'), 'click', () => { scene?.dispose(); scene = null; if (ensureScene()) { scene.setStage(stage, state, save.skin); if (state.won) finishRoute(); } syncPause(); renderBattle(); });
host.familyButtons.forEach(button => on(button, 'click', () => selectStageTab(button.dataset.routeFamily)));
on(document, 'keydown', event => {
  if (screen === 'stage' && stageTab === 'equipment' && event.key === 'Escape') { selectStageTab('stages'); host.familyButtons[0].focus(); return; }
  if (overlay) {
    if (event.key === 'Escape') { event.preventDefault(); overlay === 'resultScreen' ? toStage() : closeOverlay(); }
    if (event.key === 'Tab') {
      const controls = [...$(overlay).querySelectorAll('button:not(:disabled)')].filter(node => !node.hidden), index = controls.indexOf(document.activeElement);
      if (event.shiftKey && index <= 0) { event.preventDefault(); controls.at(-1)?.focus(); }
      else if (!event.shiftKey && index === controls.length - 1) { event.preventDefault(); controls[0]?.focus(); }
    } return;
  }
  if (paused() || event.repeat || event.target.closest('input,select,textarea')) return;
  const wind = { ArrowUp: 'north', ArrowRight: 'east', ArrowDown: 'south', ArrowLeft: 'west' }[event.key];
  if (wind) { event.preventDefault(); chooseWind(wind); } else if (event.key.toLowerCase() === 'z') undo();
});
on(document, 'pointerdown', () => { suppressPointer = settingsOpen(); }, { capture: true }); on(document, 'click', () => { suppressPointer = false; });
on($('flightBoard'), 'pointerdown', event => { if (paused() || busy) return; pointer = { id: event.pointerId, x: event.clientX, y: event.clientY }; $('flightBoard').setPointerCapture(event.pointerId); });
on($('flightBoard'), 'pointerup', event => {
  if (!pointer || pointer.id !== event.pointerId) return;
  const dx = event.clientX - pointer.x, dy = event.clientY - pointer.y; pointer = null; if (Math.max(Math.abs(dx), Math.abs(dy)) < 28) return;
  chooseWind(Math.abs(dx) > Math.abs(dy) ? dx > 0 ? 'east' : 'west' : dy > 0 ? 'south' : 'north');
});
on($('flightBoard'), 'pointercancel', () => { pointer = null; }); on(window, 'weightplay:interaction-state', syncPause);
on(document, 'visibilitychange', () => { pointer = null; cancelEffects(); syncPause(); });
on(window, 'storage', event => { if (event.key === SAVE_KEY || event.key === LEGACY_SOLVED_KEY) { save = normalizeSave(readJSON(SAVE_KEY, save), [...save.solved, ...legacyIds()]); updateProgress(); } if (screen === 'stage' && stageTab === 'equipment') renderEquipment(); });
on($('localeSelect'), 'change', event => {
  const next = event.target.value, target = Object.entries(routeLocales).find(([, key]) => key === next)?.[0]; if (!target || next === locale) return;
  const preview = new URLSearchParams(location.search).getAll('preview'); location.assign(`/${target}/games/animal-kite-keeper/index.html${preview.length === 1 && preview[0] === '1' ? '?preview=1' : ''}`);
});
on(window, 'pagehide', event => { scene?.setPaused(true); audio?.stop(); cancelEffects(); if (!event.persisted) { generation++; scene?.dispose(); rail.destroy?.(); host.frame.destroy?.(); audio?.dispose(); abort.abort(); } });
on(window, 'pageshow', syncPause);
localize(); host.activate('main'); storageWarning(); $('startBtn').disabled = false; document.body.setAttribute('aria-busy', 'false');
