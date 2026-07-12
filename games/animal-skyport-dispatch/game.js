(() => {
  const $ = (id) => document.getElementById(id);
  const saveKey = 'animal_skyport_dispatch_save';
  const strings = {
    en: { title:'Animal Skyport Dispatch', language:'Language', headline:'Keep Cloudline Skyport moving.', intro:'Draw safe routes, match airships to docks, and protect the shift from congestion.', start:'Start Game', chooseShift:'Choose a shift', best:'Best shift: {n}', shift:'Shift {n}/5', objective:'Serve {done}/{goal} flights', service:'Use repair service', dragHint:'Drag the airship to its matching dock.', menu:'Main Menu', next:'Next Shift', retry:'Retry Shift', win:'Shift complete!', lose:'Skyport congested!', winCopy:'Clear routing earns a new skyport record.', loseCopy:'Three unsafe arrivals closed the shift. Retry is free.', repair:'Repair parts {n}' },
    'zh-Hant': { title:'\u52d5\u7269\u5929\u7a7a\u6e2f\u8abf\u5ea6\u968a', language:'\u8a9e\u8a00', headline:'\u8b93\u96f2\u7dda\u5929\u7a7a\u6e2f\u6301\u7e8c\u904b\u4f5c\u3002', intro:'\u7e6a\u51fa\u5b89\u5168\u822a\u7dda\uff0c\u914d\u5c0d\u98db\u8239\u8207\u78bc\u982d\uff0c\u4fdd\u8b77\u73ed\u6b21\u4e0d\u88ab\u58c5\u585e\u3002', start:'\u958b\u59cb\u904a\u6232', chooseShift:'\u9078\u64c7\u73ed\u6b21', best:'\u6700\u4f73\u73ed\u6b21\uff1a{n}', shift:'\u73ed\u6b21 {n}/5', objective:'\u5b8c\u6210 {done}/{goal} \u67b6\u98db\u8239', service:'\u4f7f\u7528\u7dad\u4fee\u670d\u52d9', dragHint:'\u628a\u98db\u8239\u62d6\u66f3\u5230\u5c0d\u61c9\u78bc\u982d\u3002', menu:'\u56de\u4e3b\u9078\u55ae', next:'\u4e0b\u4e00\u73ed', retry:'\u91cd\u8a66\u73ed\u6b21', win:'\u73ed\u6b21\u5b8c\u6210\uff01', lose:'\u5929\u7a7a\u6e2f\u58c5\u585e\uff01', winCopy:'\u6e05\u6670\u8abf\u5ea6\u70ba\u5929\u7a7a\u6e2f\u5beb\u4e0b\u65b0\u7d00\u9304\u3002', loseCopy:'\u4e09\u6b21\u4e0d\u5b89\u5168\u9032\u5834\u95dc\u9589\u4e86\u73ed\u6b21\uff0c\u91cd\u8a66\u514d\u8cbb\u3002', repair:'\u7dad\u4fee\u96f6\u4ef6 {n}' }
  };
  const flights = [['cargo','cargo'], ['passenger','passenger'], ['repair','repair'], ['festival','passenger'], ['heavy','cargo']];
  const shiftConfig = [null, {goal:4, parts:2, stormEvery:0, coin:24, stamps:1}, {goal:6, parts:2, stormEvery:0, coin:36, stamps:1}, {goal:7, parts:2, stormEvery:3, coin:48, stamps:2}, {goal:8, parts:3, stormEvery:2, coin:62, stamps:2}, {goal:10, parts:3, stormEvery:2, coin:80, stamps:3}];
  const saved = JSON.parse(localStorage.getItem(saveKey) || '{}');
  let locale = localStorage.getItem('weightPlayLocale') || 'en';
  let save = {best:1, unlocked:1, reputation:0, coins:0, stamps:0, medals:{}, ...saved};
  let state = {};
  let dragging = false;
  let inputMode = '';
  let suppressClick = false;
  const t = (key, values = {}) => Object.entries(values).reduce((value, [name, replacement]) => value.replace(`{${name}}`, replacement), strings[locale][key]);
  const persist = () => localStorage.setItem(saveKey, JSON.stringify(save));
  const show = (id) => {
    ['mainScreen','stageScreen','battleShell','result'].forEach((screen) => $(screen).classList.toggle('hidden', screen !== id));
    $('mainHeader').classList.toggle('hidden', id !== 'mainScreen');
    document.body.classList.toggle('skyport-playing', id === 'battleShell');
  };
  function localize() {
    document.documentElement.lang = locale;
    document.title = `${t('title')} - Internal Trial`;
    document.querySelectorAll('[data-i18n]').forEach((node) => { node.textContent = t(node.dataset.i18n); });
    $('localeSelect').value = locale;
    renderStages();
  }
  function renderStages() {
    if ($('stageScreen').classList.contains('hidden')) return;
    $('bestText').textContent = t('best', {n:save.best || 1});
    $('stageRail').innerHTML = '';
    for (let shift = 1; shift <= 5; shift += 1) {
      const config = shiftConfig[shift];
      const card = document.createElement('button');
      card.className = `stage-card${shift === state.shift ? ' selected' : ''}`;
      card.disabled = shift > save.unlocked;
      card.innerHTML = `<strong>${t('shift', {n:shift})}</strong><span>${t('objective', {done:0, goal:config.goal})}</span><small>${shift > save.unlocked ? 'Locked' : shift === save.unlocked ? 'Ready' : 'Replay'}</small>`;
      card.onclick = () => { state.shift = shift; startBattle(); };
      $('stageRail').append(card);
    }
  }
  function renderHud() {
    $('shiftText').textContent = t('shift', {n:state.shift});
    $('scoreText').textContent = `${state.done}/${state.goal}`;
    $('objectiveText').textContent = t('objective', {done:state.done, goal:state.goal});
    $('resourceText').textContent = t('repair', {n:state.parts});
  }
  function startBattle() {
    const shift = state.shift || 1;
    const config = shiftConfig[shift];
    state = {shift, done:0, errors:0, parts:config.parts, goal:config.goal, stormEvery:config.stormEvery, flightIndex:0, matched:0, selected:false};
    show('battleShell');
    nextFlight();
    renderHud();
  }
  function nextFlight() {
    const [kind, dock] = flights[state.flightIndex++ % flights.length];
    state.kind = kind;
    state.dock = dock;
    state.storm = state.stormEvery > 0 && state.flightIndex % state.stormEvery === 0;
    state.serviced = !state.storm;
    $('flight').style.backgroundImage = `url('../../assets/animal-skyport-dispatch-airship-${kind}.webp')`;
    $('weatherZone').classList.toggle('hidden', !state.storm);
    $('weatherZone').src = '../../assets/animal-skyport-dispatch-weather-storm.webp';
    $('feedback').textContent = state.storm ? (locale === 'zh-Hant' ? '\u66b4\u98a8\u822a\u7dda\uff1a\u5148\u5b8c\u6210\u7dad\u4fee\u670d\u52d9\u3002' : 'Storm route: service first.') : t('dragHint');
    $('routeLine').style.opacity = '0';
  }
  function result(win) {
    show('result');
    $('resultTitle').textContent = win ? t('win') : t('lose');
    $('resultCopy').textContent = win ? t('winCopy') : t('loseCopy');
    $('resultRewards').innerHTML = win
      ? `<span>Reputation +${state.done * 5}</span><span>Sky coins +${shiftConfig[state.shift].coin}</span><span>Medals ${save.medals[state.shift] || 1}/3</span>`
      : `<span>Safe routing ${state.done}/${state.goal}</span><span>Errors ${state.errors}/3</span><span>Retry is free</span>`;
    $('nextBtn').textContent = win && state.shift < 5 ? t('next') : t('retry');
    $('nextBtn').onclick = () => { state.shift = win ? Math.min(5, state.shift + 1) : state.shift; startBattle(); };
  }
  function finish(ok) {
    if (ok && state.serviced) {
      state.done += 1;
      state.matched += 1;
      $('feedback').textContent = locale === 'zh-Hant' ? '\u78bc\u982d\u914d\u5c0d\u6210\u529f\u3002' : 'Dock matched.';
      if (state.done >= state.goal) {
        const config = shiftConfig[state.shift];
        save.best = Math.max(save.best || 1, state.shift);
        save.unlocked = Math.max(save.unlocked || 1, Math.min(5, state.shift + 1));
        save.reputation = (save.reputation || 0) + state.done * 5;
        save.coins = (save.coins || 0) + config.coin;
        save.stamps = (save.stamps || 0) + config.stamps;
        save.medals = save.medals || {};
        save.medals[state.shift] = Math.max(save.medals[state.shift] || 0, 1 + (state.errors === 0 ? 1 : 0) + (state.matched === state.goal ? 1 : 0));
        persist();
        result(true);
        return;
      }
      nextFlight();
    } else {
      state.errors += 1;
      $('feedback').textContent = state.storm && !state.serviced ? (locale === 'zh-Hant' ? '\u9700\u5148\u5b8c\u6210\u670d\u52d9' : 'Service required') : (locale === 'zh-Hant' ? '\u78bc\u982d\u4e0d\u5c0d\uff0c\u8acb\u91cd\u8a66\u3002' : 'Unsafe dock. Try again.');
      if (state.errors >= 3) result(false);
    }
    renderHud();
  }
  function routePointer(event) {
    const mode = event.type.startsWith('pointer') ? 'pointer' : 'mouse';
    const isStart = event.type === 'pointerdown' || event.type === 'mousedown';
    const isEnd = event.type === 'pointerup' || event.type === 'mouseup';
    const flight = $('flight');
    const field = $('routeField').getBoundingClientRect();
    if (isStart) {
      if (inputMode && inputMode !== mode) return;
      inputMode = mode;
      dragging = true;
      flight.setPointerCapture?.(event.pointerId);
    }
    if (!dragging || inputMode !== mode) return;
    const fromX = flight.offsetLeft + 36;
    const fromY = flight.offsetTop + 36;
    const dx = event.clientX - field.left - fromX;
    const dy = event.clientY - field.top - fromY;
    const length = Math.hypot(dx, dy);
    Object.assign($('routeLine').style, {left:`${fromX}px`, top:`${fromY}px`, width:`${length}px`, transform:`rotate(${Math.atan2(dy, dx)}rad)`, opacity:'1'});
    if (!isEnd) return;
    dragging = false;
    inputMode = '';
    suppressClick = length > 4;
    let target = null;
    let nearest = Infinity;
    document.querySelectorAll('.dock').forEach((dock) => {
      const box = dock.getBoundingClientRect();
      const distance = Math.hypot(event.clientX - (box.left + box.width / 2), event.clientY - (box.top + box.height / 2));
      if (distance < nearest) { nearest = distance; target = dock; }
    });
    finish(nearest <= Math.max(64, target?.getBoundingClientRect().width || 0) ? target?.dataset.dock === state.dock : false);
  }
  $('startBtn').onclick = () => { state.shift = save.unlocked; show('stageScreen'); renderStages(); };
  $('stageBack').onclick = () => show('mainScreen');
  $('battleBack').onclick = () => { show('stageScreen'); renderStages(); };
  $('menuBtn').onclick = () => show('mainScreen');
  $('serviceBtn').onclick = () => {
    if (state.storm && state.parts) {
      state.parts -= 1;
      state.serviced = true;
      $('feedback').textContent = locale === 'zh-Hant' ? '\u98db\u8239\u5df2\u53ef\u5b89\u5168\u9032\u5834\u3002' : 'Flight cleared for safe approach.';
      renderHud();
    }
  };
  $('flight').addEventListener('pointerdown', routePointer);
  $('flight').addEventListener('mousedown', routePointer);
  $('flight').addEventListener('click', (event) => {
    if (suppressClick) { suppressClick = false; event.stopImmediatePropagation(); return; }
    state.selected = true;
    $('feedback').textContent = locale === 'zh-Hant' ? '\u5df2\u9078\u64c7\u98db\u8239\uff0c\u8acb\u9ede\u9078\u78bc\u982d\u3002' : 'Flight selected. Choose a dock.';
  }, true);
  document.querySelectorAll('.dock').forEach((dock) => dock.addEventListener('click', () => {
    if (!state.selected) return;
    state.selected = false;
    finish(dock.dataset.dock === state.dock);
  }));
  window.addEventListener('pointermove', routePointer);
  window.addEventListener('pointerup', routePointer);
  window.addEventListener('mousemove', routePointer);
  window.addEventListener('mouseup', routePointer);
  $('localeSelect').onchange = (event) => { locale = event.target.value; localStorage.setItem('weightPlayLocale', locale); localize(); };
  localize();
})();
