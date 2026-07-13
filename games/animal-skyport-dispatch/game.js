(() => {
  const $ = (id) => document.getElementById(id);
  const saveKey = 'animal_skyport_dispatch_save';
  const strings = {
    en: { title:'Animal Skyport Dispatch', language:'Language', headline:'Keep Cloudline Skyport moving.', intro:'Draw safe routes, match airships to docks, and protect the shift from congestion.', start:'Start Game', chooseShift:'Choose a shift', best:'Best shift: {n}', shift:'Shift {n}/5', objective:'Serve {done}/{goal} flights', stageReady:'Ready', stageLocked:'Locked', stageReplay:'Replay', service:'Use repair service', dragHint:'Drag the airship to its matching dock.', menu:'Main Menu', next:'Next Shift', retry:'Retry Shift', win:'Shift complete!', lose:'Skyport congested!', winCopy:'Clear routing earns a new skyport record.', loseCopy:'Three unsafe arrivals closed the shift. Retry is free.', repair:'Repair parts {n}' },
    'zh-Hant': { title:'\u52d5\u7269\u5929\u7a7a\u6e2f\u8abf\u5ea6\u968a', language:'\u8a9e\u8a00', headline:'\u8b93\u96f2\u7dda\u5929\u7a7a\u6e2f\u6301\u7e8c\u904b\u4f5c\u3002', intro:'\u7e6a\u51fa\u5b89\u5168\u822a\u7dda\uff0c\u914d\u5c0d\u98db\u8239\u8207\u78bc\u982d\uff0c\u4fdd\u8b77\u73ed\u6b21\u4e0d\u88ab\u58c5\u585e\u3002', start:'\u958b\u59cb\u904a\u6232', chooseShift:'\u9078\u64c7\u73ed\u6b21', best:'\u6700\u4f73\u73ed\u6b21\uff1a{n}', shift:'\u73ed\u6b21 {n}/5', objective:'\u5b8c\u6210 {done}/{goal} \u67b6\u98db\u8239', stageReady:'\u53ef\u958b\u59cb', stageLocked:'\u672a\u89e3\u9396', stageReplay:'\u53ef\u91cd\u73a9', service:'\u4f7f\u7528\u7dad\u4fee\u670d\u52d9', dragHint:'\u628a\u98db\u8239\u62d6\u66f3\u5230\u5c0d\u61c9\u78bc\u982d\u3002', menu:'\u56de\u4e3b\u9078\u55ae', next:'\u4e0b\u4e00\u73ed', retry:'\u91cd\u8a66\u73ed\u6b21', win:'\u73ed\u6b21\u5b8c\u6210\uff01', lose:'\u5929\u7a7a\u6e2f\u58c5\u585e\uff01', winCopy:'\u6e05\u6670\u8abf\u5ea6\u70ba\u5929\u7a7a\u6e2f\u5beb\u4e0b\u65b0\u7d00\u9304\u3002', loseCopy:'\u4e09\u6b21\u4e0d\u5b89\u5168\u9032\u5834\u95dc\u9589\u4e86\u73ed\u6b21\uff0c\u91cd\u8a66\u514d\u8cbb\u3002', repair:'\u7dad\u4fee\u96f6\u4ef6 {n}' }
  };
  Object.assign(strings.en, {
    guideTitle: 'How to dispatch',
    guideBody: 'Choose a shift, read each flight request, then guide the airship to the highlighted matching dock before congestion builds.',
    backToLobby: 'Back to lobby',
    back: 'Back',
    coverAlt: 'Skyport dispatch animals',
    shiftSelection: 'Shift selection',
  });
  Object.assign(strings['zh-Hant'], {
    guideTitle: '\u5982\u4f55\u8abf\u5ea6',
    guideBody: '\u9078\u64c7\u73ed\u6b21\u3001\u8b80\u61c2\u6bcf\u67b6\u98db\u8239\u7684\u9700\u6c42\uff0c\u518d\u65bc\u58c5\u585e\u524d\u5c07\u98db\u8239\u5f15\u5c0e\u81f3\u9ad8\u4eae\u7684\u5c0d\u61c9\u78bc\u982d\u3002',
    backToLobby: '\u56de\u5230\u5927\u5ef3',
    back: '\u8fd4\u56de',
    coverAlt: '\u5929\u7a7a\u6e2f\u8abf\u5ea6\u52d5\u7269',
    shiftSelection: '\u73ed\u6b21\u9078\u64c7',
  });
  const flights = [['cargo','cargo'], ['passenger','passenger'], ['repair','repair'], ['festival','passenger'], ['heavy','cargo']];
  const flightLabels = {
    en: {cargo:'Cargo airship', passenger:'Passenger airship', repair:'Repair airship', festival:'Festival airship', heavy:'Heavy cargo airship'},
    'zh-Hant': {cargo:'貨運飛船', passenger:'旅客飛船', repair:'維修飛船', festival:'節慶飛船', heavy:'重型貨運飛船'}
  };
  const dockLabels = {
    en: {cargo:'Cargo Dock A', passenger:'Passenger Dock B', repair:'Repair Dock C'},
    'zh-Hant': {cargo:'貨運碼頭 A', passenger:'旅客碼頭 B', repair:'維修碼頭 C'}
  };
  Object.assign(flightLabels['zh-Hant'], {
    cargo: '\u8ca8\u904b\u98db\u8239',
    passenger: '\u65c5\u5ba2\u98db\u8239',
    repair: '\u7dad\u4fee\u98db\u8239',
    festival: '\u7bc0\u6176\u98db\u8239',
    heavy: '\u91cd\u578b\u8ca8\u904b\u98db\u8239'
  });
  Object.assign(dockLabels['zh-Hant'], {
    cargo: '\u8ca8\u904b\u78bc\u982d A',
    passenger: '\u65c5\u5ba2\u78bc\u982d B',
    repair: '\u7dad\u4fee\u78bc\u982d C'
  });
  const shiftConfig = [null, {goal:4, parts:2, stormEvery:0, coin:24, stamps:1}, {goal:6, parts:2, stormEvery:0, coin:36, stamps:1}, {goal:7, parts:2, stormEvery:3, coin:48, stamps:2}, {goal:8, parts:4, stormEvery:2, coin:62, stamps:2}, {goal:10, parts:5, stormEvery:2, coin:80, stamps:3}];
  const saved = JSON.parse(localStorage.getItem(saveKey) || '{}');
  let locale = localStorage.getItem('weightPlayLocale') || 'en';
  let save = {best:1, unlocked:1, reputation:0, coins:0, stamps:0, medals:{}, ...saved};
  let state = {};
  let dragging = false;
  let inputMode = '';
  let suppressClick = false;
  let insuranceActive = false;
  const t = (key, values = {}) => Object.entries(values).reduce((value, [name, replacement]) => value.replace(`{${name}}`, replacement), strings[locale][key]);
  const persist = () => localStorage.setItem(saveKey, JSON.stringify(save));
  const show = (id) => {
    ['mainScreen','stageScreen','battleShell','result'].forEach((screen) => $(screen).classList.toggle('hidden', screen !== id && !(id === 'result' && screen === 'battleShell')));
    $('mainHeader').classList.toggle('hidden', id !== 'mainScreen');
    document.body.classList.toggle('skyport-playing', id === 'battleShell' || id === 'result');
  };
  function localize() {
    document.documentElement.lang = locale;
    document.title = `${t('title')} - Internal Trial`;
    document.querySelectorAll('[data-i18n]').forEach((node) => { node.textContent = t(node.dataset.i18n); });
    $('localeSelect').value = locale;
    $('localeSelect').options[1].textContent = '\u7e41\u9ad4\u4e2d\u6587';
    document.querySelector('.home-link').setAttribute('aria-label', t('backToLobby'));
    document.querySelector('.cover').alt = t('coverAlt');
    $('stageBack').setAttribute('aria-label', t('back'));
    $('battleBack').setAttribute('aria-label', t('back'));
    $('stageRail').setAttribute('aria-label', t('shiftSelection'));
    $('contractText').textContent = locale === 'zh-Hant' ? '\u512a\u5148\u5408\u7d04\uff1a\u7121\u932f\u8aa4\u5b8c\u6210\u6642\u7372\u5f97\u984d\u5916\u5929\u7a7a\u5e63\u3002' : 'Priority contract: finish with no errors for bonus sky coins.';
    $('insuranceBtn').textContent = insuranceActive ? (locale === 'zh-Hant' ? '\u5df2\u6295\u4fdd' : 'Insurance active') : (locale === 'zh-Hant' ? '\u4fdd\u96aa 5 \u947d\u77f3' : 'Insure 5 diamonds');
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
      const availability = shift > save.unlocked ? 'stageLocked' : shift === save.unlocked ? 'stageReady' : 'stageReplay';
      card.innerHTML = `<strong>${t('shift', {n:shift})}</strong><span>${t('objective', {done:0, goal:config.goal})}</span><small>${t(availability)}</small>`;
      card.onclick = () => { state.shift = shift; startBattle(); };
      $('stageRail').append(card);
    }
  }
  function renderHud() {
    $('shiftText').textContent = t('shift', {n:state.shift});
    $('scoreText').textContent = `${state.done}/${state.goal}`;
    $('objectiveText').textContent = t('objective', {done:state.done, goal:state.goal});
    const crewLabel = locale === 'zh-Hant' ? '\u7d44\u54e1' : 'Crew';
    const fuelLabel = locale === 'zh-Hant' ? '\u71c3\u6599' : 'Fuel';
    $('resourceText').textContent = `${crewLabel} ${state.crew}/${state.maxCrew} · ${fuelLabel} ${state.fuel} · ${t('repair', {n:state.parts})}`;
    renderFlightTask();
  }

  function renderFlightTask() {
    if (!state.kind) return;
    const labels = locale === 'zh-Hant'
      ? {
          flights: {cargo:'\u8ca8\u904b\u98db\u8239', passenger:'\u65c5\u5ba2\u98db\u8239', repair:'\u7dad\u4fee\u98db\u8239', festival:'\u7bc0\u6176\u98db\u8239', heavy:'\u91cd\u578b\u8ca8\u904b\u98db\u8239'},
          docks: {cargo:'\u8ca8\u904b\u78bc\u982d A', passenger:'\u65c5\u5ba2\u78bc\u982d B', repair:'\u7dad\u4fee\u78bc\u982d C'},
          repair:'\u5148\u6309\u7dad\u4fee\u670d\u52d9', conflict:'\u5148\u6e05\u9664\u822a\u7dda\u885d\u7a81', crew:'\u5148\u6307\u6d3e\u7d44\u54e1', drag:'\u518d\u62d6\u5230 '
        }
      : {
          flights: flightLabels.en, docks: dockLabels.en,
          repair:'use repair service first', conflict:'clear route conflict first', crew:'assign crew first', drag:'then drag to '
        };
    const flightName = labels.flights[state.kind];
    const dockName = labels.docks[state.dock];
    const steps = [];
    if (state.storm && !state.serviced) steps.push(labels.repair);
    if (state.conflict) steps.push(labels.conflict);
    if (state.needsCrew && !state.crewAssigned) steps.push(labels.crew);
    steps.push(labels.drag + dockName);
    const numberedSteps = steps.map((step, index) => `${index + 1}. ${step}`);
    document.querySelector('.task-destination').textContent = locale === 'zh-Hant'
      ? `本架：${flightName} → ${dockName}`
      : `Current: ${flightName} -> ${dockName}`;
    // Keep the task strip focused on the action the player can take now. Showing
    // only the final drag step made late flights look like they had skipped rules.
    document.querySelector('.task-steps').textContent = numberedSteps[0];
    let nextStep = 1;
    if (state.storm) $('serviceBtn').textContent = `${nextStep++}. ${locale === 'zh-Hant' ? '維修服務' : 'Repair service'}`;
    if (state.conflict) $('clearRouteBtn').textContent = `${nextStep++}. ${locale === 'zh-Hant' ? '清除航線衝突' : 'Clear conflict'}`;
    if (state.needsCrew) $('assignCrewBtn').textContent = `${nextStep}. ${locale === 'zh-Hant' ? '指派組員' : 'Assign crew'}`;
    $('flight').setAttribute('aria-label', locale === 'zh-Hant' ? `${flightName}\uff0c\u76ee\u6a19 ${dockName}` : `${flightName}, target ${dockName}`);
    $('flight').dataset.destination = locale === 'zh-Hant' ? `\u9001\u5f80 ${dockName}` : `TO ${dockName.toUpperCase()}`;
    document.querySelectorAll('.dock').forEach((dock) => {
      const label = labels.docks[dock.dataset.dock];
      const isTarget = dock.dataset.dock === state.dock;
      dock.querySelector('.dock-label').textContent = label;
      dock.setAttribute('aria-label', label);
      dock.classList.toggle('is-target', isTarget);
      dock.querySelector('.dock-target-badge').textContent = isTarget
        ? (locale === 'zh-Hant' ? `前往 ${dockName.at(-1)}` : `GO: ${dockName.at(-1)}`)
        : '';
    });
    requestAnimationFrame(renderGuidanceLine);
  }

  function renderGuidanceLine() {
    const field = $('routeField').getBoundingClientRect();
    const flight = $('flight').getBoundingClientRect();
    const dock = document.querySelector(`.dock[data-dock="${state.dock}"]`)?.getBoundingClientRect();
    if (!field.width || !flight.width || !dock) return;
    const fromX = flight.left - field.left + flight.width / 2;
    const fromY = flight.top - field.top + flight.height / 2;
    const toX = dock.left - field.left + dock.width / 2;
    const toY = dock.top - field.top + dock.height / 2;
    Object.assign($('routeLine').style, {
      left: `${fromX}px`, top: `${fromY}px`, width: `${Math.hypot(toX - fromX, toY - fromY)}px`,
      transform: `rotate(${Math.atan2(toY - fromY, toX - fromX)}rad)`, opacity: '0.9'
    });
    $('routeLine').classList.add('is-guidance');
  }
  function startBattle() {
    const shift = state.shift || 1;
    const config = shiftConfig[shift];
    state = {shift, done:0, errors:0, parts:config.parts, crew:2, maxCrew:2, fuel:config.goal+4, goal:config.goal, stormEvery:config.stormEvery, flightIndex:0, matched:0, selected:false, contract:Boolean(state.contract)};
    show('battleShell');
    nextFlight();
    renderHud();
  }
  function nextFlight() {
    const [kind, dock] = flights[state.flightIndex++ % flights.length];
    state.kind = kind;
    state.dock = dock;
    state.storm = state.stormEvery > 0 && state.flightIndex % state.stormEvery === 0;
    state.conflict = state.shift >= 3 && state.flightIndex % 4 === 1;
    // Shift 1 teaches only matching and routing; crew arrives after the player
    // has a stable mental model of docks.
    state.needsCrew = state.shift >= 2 && ['cargo','repair','festival','heavy'].includes(kind);
    state.crewAssigned = !state.needsCrew;
    state.serviced = !state.storm;
    $('flight').style.backgroundImage = `url('../../assets/animal-skyport-dispatch-airship-${kind}.webp')`;
    $('weatherZone').classList.toggle('hidden', !state.storm);
    $('weatherZone').src = '../../assets/animal-skyport-dispatch-weather-storm.webp';
    $('serviceBtn').classList.toggle('hidden', !state.storm);
    $('clearRouteBtn').classList.toggle('hidden', !state.conflict);
    $('assignCrewBtn').classList.toggle('hidden', !state.needsCrew);
    $('feedback').textContent = state.storm ? (locale === 'zh-Hant' ? '\u66b4\u98a8\u822a\u7dda\uff1a\u5148\u5b8c\u6210\u7dad\u4fee\u670d\u52d9\u3002' : 'Storm route: service first.') : t('dragHint');
    if (!state.storm && state.flightIndex <= 3) {
      $('feedback').textContent = locale === 'zh-Hant'
        ? '\u5c07\u98db\u8239\u62d6\u5230\u91d1\u8272\u300c\u62d6\u5230\u9019\u88e1\u300d\u78bc\u982d\u3002'
        : 'Drag the airship to the gold DRAG HERE dock.';
    }
    const destination = dockLabels[locale][dock];
    const nextAction = state.storm
      ? (locale === 'zh-Hant' ? '\u5148\u4f7f\u7528\u7dad\u4fee\u670d\u52d9' : 'Use repair service first')
      : state.conflict
        ? (locale === 'zh-Hant' ? '\u5148\u6e05\u9664\u822a\u7dda\u885d\u7a81' : 'Clear the route conflict first')
        : state.needsCrew
          ? (locale === 'zh-Hant' ? '\u5148\u6307\u6d3e\u7d44\u54e1' : 'Assign crew first')
          : (locale === 'zh-Hant' ? `\u5c07\u98db\u8239\u62d6\u5230\u91d1\u8272\u76ee\u6a19\uff1a${destination}` : `Drag the airship to the gold target: ${destination}`);
    $('feedback').textContent = locale === 'zh-Hant' ? `\u4e0b\u4e00\u6b65\uff1a${nextAction}` : `Next: ${nextAction}`;
    $('routeLine').style.opacity = '0';
    $('routeLine').classList.remove('is-guidance');
  }
  function result(win) {
    show('result');
    $('resultTitle').textContent = win ? t('win') : t('lose');
    $('resultCopy').textContent = win ? t('winCopy') : (state.lastError || t('loseCopy'));
    const resultLabels = locale === 'zh-Hant'
      ? { reputation: '\u8072\u671b', coins: '\u5929\u7a7a\u5e63', medals: '\u52f3\u7ae0', safe: '\u5b89\u5168\u8abf\u5ea6', errors: '\u932f\u8aa4', protected: '\u5408\u7d04\u734e\u52f5\u5df2\u4fdd\u7559', retry: '\u514d\u8cbb\u91cd\u8a66' }
      : { reputation: 'Reputation', coins: 'Sky coins', medals: 'Medals', safe: 'Safe routing', errors: 'Errors', protected: 'Contract bonus protected', retry: 'Retry is free' };
    $('resultRewards').innerHTML = win
      ? `<span>${resultLabels.reputation} +${state.done * 5}</span><span>${resultLabels.coins} +${shiftConfig[state.shift].coin + (state.contract && state.errors === 0 ? 20 : 0)}</span><span>${resultLabels.medals} ${save.medals[state.shift] || 1}/3</span>`
      : `<span>${resultLabels.safe} ${state.done}/${state.goal}</span><span>${resultLabels.errors} ${state.errors}/3</span><span>${insuranceActive ? resultLabels.protected : resultLabels.retry}</span>`;
    $('nextBtn').textContent = win && state.shift < 5 ? t('next') : t('retry');
    $('nextBtn').onclick = () => { state.shift = win ? Math.min(5, state.shift + 1) : state.shift; startBattle(); };
  }
  function finish(ok) {
    if (ok && state.serviced && !state.conflict && state.crewAssigned && state.fuel > 0) {
      state.done += 1;
      state.matched += 1;
      state.fuel -= 1;
      if (state.needsCrew) state.crew = state.maxCrew;
      $('feedback').textContent = locale === 'zh-Hant' ? '\u78bc\u982d\u914d\u5c0d\u6210\u529f\u3002' : 'Dock matched.';
      if (state.done >= state.goal) {
        const config = shiftConfig[state.shift];
        save.best = Math.max(save.best || 1, state.shift);
        save.unlocked = Math.max(save.unlocked || 1, Math.min(5, state.shift + 1));
        save.reputation = (save.reputation || 0) + state.done * 5;
        const contractBonus = state.contract && state.errors === 0 ? 20 : 0;
        save.coins = (save.coins || 0) + config.coin + contractBonus;
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
      state.lastError = state.conflict ? (locale === 'zh-Hant' ? '先清除航線衝突，再拖曳飛船。' : 'Clear the route conflict before dragging.') : !state.crewAssigned ? (locale === 'zh-Hant' ? '這架需要組員：先按「指派組員」，再拖曳飛船。' : 'This flight needs crew: assign crew before dragging.') : state.storm && !state.serviced ? (locale === 'zh-Hant' ? '暴風航線需要先完成維修服務。' : 'Storm route: repair service is required first.') : state.fuel <= 0 ? (locale === 'zh-Hant' ? '燃料不足，無法派遣。' : 'Fuel depleted.') : (locale === 'zh-Hant' ? '碼頭不對：請依上方任務卡前往目標碼頭。' : 'Wrong dock: follow the task card target.');
      $('feedback').textContent = state.lastError;
      if (state.errors >= 3) { if (insuranceActive && state.contract) { save.coins = (save.coins || 0) + 20; persist(); } result(false); }
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
    $('routeLine').classList.remove('is-guidance');
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
  $('contractToggle').onchange = (event) => { state.contract = event.target.checked; };
  $('insuranceBtn').onclick = () => {
    if (insuranceActive) return;
    if (!confirm(locale === 'zh-Hant' ? '\u82b1\u8cbb 5 \u947d\u77f3\uff0c\u5728\u5931\u6557\u6642\u4fdd\u7559\u5408\u7d04\u734e\u52f5\u55ce\uff1f' : 'Spend 5 diamonds to protect this run\'s contract bonus on failure?')) return;
    if (!window.WeightPlayWallet?.spendDiamonds?.(5)) { $('contractText').textContent = locale === 'zh-Hant' ? '\u947d\u77f3\u4e0d\u8db3\u3002' : 'Not enough diamonds.'; return; }
    insuranceActive = true; localize();
  };
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
  $('clearRouteBtn').onclick = () => { if (state.conflict && state.fuel > 0) { state.fuel -= 1; state.conflict = false; $('clearRouteBtn').classList.add('hidden'); $('feedback').textContent = locale === 'zh-Hant' ? '\u822a\u7dda\u5df2\u6e05\u7406\u3002' : 'Route cleared.'; renderHud(); } };
  $('assignCrewBtn').onclick = () => { if (state.needsCrew && !state.crewAssigned && state.crew > 0) { state.crew -= 1; state.crewAssigned = true; $('assignCrewBtn').classList.add('hidden'); $('feedback').textContent = locale === 'zh-Hant' ? '\u7d44\u54e1\u5df2\u6307\u6d3e\u3002' : 'Crew assigned.'; renderHud(); } };
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
