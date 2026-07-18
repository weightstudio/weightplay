(() => {
  const $ = (id) => document.getElementById(id);
  const saveKey = 'animal_skyport_dispatch_save';
  const strings = {
    en: { title:'Animal Skyport Dispatch', language:'Language', headline:'Keep Cloudline Skyport moving.', intro:'Draw safe routes, match airships to docks, and protect the shift from congestion.', start:'Start Game', chooseShift:'Choose a shift', best:'Best shift: {n}', shift:'Shift {n}/5', objective:'Serve {done}/{goal} flights', errors:'Errors {done}/3', stageReady:'Ready', stageLocked:'Locked', stageReplay:'Replay', service:'Use repair service', dragHint:'Drag the airship, or press Enter and use arrow keys, to choose its dock.', menu:'Main Menu', next:'Next Shift', retry:'Retry Shift', win:'Shift complete!', lose:'Skyport congested!', winCopy:'Clear routing earns a new skyport record.', loseCopy:'Three unsafe arrivals closed the shift. Retry is free.', repair:'Repair parts {n}' },
    'zh-Hant': { title:'\u52d5\u7269\u5929\u7a7a\u6e2f\u8abf\u5ea6\u968a', language:'\u8a9e\u8a00', headline:'\u8b93\u96f2\u7dda\u5929\u7a7a\u6e2f\u6301\u7e8c\u904b\u4f5c\u3002', intro:'\u7e6a\u51fa\u5b89\u5168\u822a\u7dda\uff0c\u914d\u5c0d\u98db\u8239\u8207\u78bc\u982d\uff0c\u4fdd\u8b77\u73ed\u6b21\u4e0d\u88ab\u58c5\u585e\u3002', start:'\u958b\u59cb\u904a\u6232', chooseShift:'\u9078\u64c7\u73ed\u6b21', best:'\u6700\u4f73\u73ed\u6b21\uff1a{n}', shift:'\u73ed\u6b21 {n}/5', objective:'\u5b8c\u6210 {done}/{goal} \u67b6\u98db\u8239', errors:'\u5931\u8aa4 {done}/3', stageReady:'\u53ef\u958b\u59cb', stageLocked:'\u672a\u89e3\u9396', stageReplay:'\u53ef\u91cd\u73a9', service:'\u4f7f\u7528\u7dad\u4fee\u670d\u52d9', dragHint:'\u62d6\u66f3\u98db\u8239，\u6216\u6309 Enter \u5f8c\u7528\u65b9\u5411\u9375\u9078\u64c7\u78bc\u982d\u3002', menu:'\u56de\u4e3b\u9078\u55ae', next:'\u4e0b\u4e00\u73ed', retry:'\u91cd\u8a66\u73ed\u6b21', win:'\u73ed\u6b21\u5b8c\u6210\uff01', lose:'\u5929\u7a7a\u6e2f\u58c5\u585e\uff01', winCopy:'\u6e05\u6670\u8abf\u5ea6\u70ba\u5929\u7a7a\u6e2f\u5beb\u4e0b\u65b0\u7d00\u9304\u3002', loseCopy:'\u4e09\u6b21\u4e0d\u5b89\u5168\u9032\u5834\u95dc\u9589\u4e86\u73ed\u6b21\uff0c\u91cd\u8a66\u514d\u8cbb\u3002', repair:'\u7dad\u4fee\u96f6\u4ef6 {n}' }
  };
  Object.assign(strings.en, {
    guideTitle: 'How to dispatch',
    guideBody: 'Choose a shift, read each flight request, then guide the airship to the highlighted matching dock before congestion builds.',
    backToLobby: 'Back to lobby',
    back: 'Back',
    coverAlt: 'Skyport dispatch animals',
    shiftSelection: 'Shift selection',
    medals: 'Medals {n}/3',
    blueprintStamps: 'Blueprint stamps',
    total: 'Total {n}',
    shiftUnlocked: 'Shift {n} unlocked',
    allShiftsComplete: 'All shifts complete',
    shifts: 'Shifts',
    contractDescription: 'Priority contract: finish with no errors for 20 bonus sky coins.',
    insurance: 'Insure 5 Diamonds',
    insuranceActive: 'Insurance active',
    insuranceConfirm: 'Confirm 5 · {before}→{after}',
    insuranceDecision: 'Protect the 20-coin bonus on failure. Confirm: {before} → {after} Diamonds.',
    insuranceLabel: 'Protect this run\'s 20-coin contract bonus on failure. Costs 5 Diamonds. Current balance {balance}.',
    insuranceConfirmLabel: 'Confirm contract insurance. Spend 5 Diamonds. Balance {before} to {after}.',
    insuranceNeed: 'Need 5 Diamonds. Current balance {balance}/5.',
    insuranceSelect: 'Select the priority contract before buying insurance.',
    keyboardFlight: 'Press Enter to select this airship, then use arrow keys to choose a dock and Enter to dispatch.',
    keyboardChooseDock: 'Airship selected. Use arrow keys to choose a dock, then press Enter to dispatch. Escape cancels.',
    keyboardDockCorrect: '{dock}. Correct target for {flight}. Press Enter to dispatch. Fuel {fuel} to {remaining}.',
    keyboardDockWrong: '{dock}. Wrong target for {flight}; the correct target is {target}. Pressing Enter now adds 1 Error.',
    keyboardDockBlocked: '{dock}. Correct target for {flight}, but {step}. Pressing Enter now adds 1 Error.',
    routeCancelled: 'Route cancelled. No error added.',
  });
  Object.assign(strings['zh-Hant'], {
    guideTitle: '\u5982\u4f55\u8abf\u5ea6',
    guideBody: '\u9078\u64c7\u73ed\u6b21\u3001\u8b80\u61c2\u6bcf\u67b6\u98db\u8239\u7684\u9700\u6c42\uff0c\u518d\u65bc\u58c5\u585e\u524d\u5c07\u98db\u8239\u5f15\u5c0e\u81f3\u9ad8\u4eae\u7684\u5c0d\u61c9\u78bc\u982d\u3002',
    backToLobby: '\u56de\u5230\u5927\u5ef3',
    back: '\u8fd4\u56de',
    coverAlt: '\u5929\u7a7a\u6e2f\u8abf\u5ea6\u52d5\u7269',
    shiftSelection: '\u73ed\u6b21\u9078\u64c7',
    medals: '\u52f3\u7ae0 {n}/3',
    blueprintStamps: '\u85cd\u5716\u5370\u7ae0',
    total: '\u7d2f\u7a4d {n}',
    shiftUnlocked: '\u5df2\u89e3\u9396\u7b2c {n} \u73ed',
    allShiftsComplete: '\u4e94\u500b\u73ed\u6b21\u5168\u90e8\u5b8c\u6210',
    shifts: '\u73ed\u6b21\u9078\u64c7',
    contractDescription: '\u512a\u5148\u5408\u7d04\uff1a\u7121\u932f\u8aa4\u5b8c\u6210\u53ef\u7372\u5f97 20 \u5929\u7a7a\u5e63\u3002',
    insurance: '\u4fdd\u96aa 5 \u947d\u77f3',
    insuranceActive: '\u5df2\u6295\u4fdd',
    insuranceConfirm: '\u78ba\u8a8d 5 \u00b7 {before}\u2192{after}',
    insuranceDecision: '\u5931\u6557\u6642\u4fdd\u7559 20 \u5929\u7a7a\u5e63\u734e\u52f5\u3002\u78ba\u8a8d\uff1a{before} \u2192 {after} \u9846\u947d\u77f3\u3002',
    insuranceLabel: '\u5931\u6557\u6642\u4fdd\u7559\u672c\u6b21\u5408\u7d04\u7684 20 \u5929\u7a7a\u5e63\u734e\u52f5\u3002\u82b1\u8cbb 5 \u9846\u947d\u77f3\u3002\u76ee\u524d\u9918\u984d {balance}\u3002',
    insuranceConfirmLabel: '\u78ba\u8a8d\u8cfc\u8cb7\u5408\u7d04\u4fdd\u96aa\u3002\u82b1\u8cbb 5 \u9846\u947d\u77f3\u3002\u9918\u984d {before} \u8b8a\u70ba {after}\u3002',
    insuranceNeed: '\u9700\u8981 5 \u9846\u947d\u77f3\u3002\u76ee\u524d\u9918\u984d {balance}/5\u3002',
    insuranceSelect: '\u8acb\u5148\u52fe\u9078\u512a\u5148\u5408\u7d04\uff0c\u518d\u8cfc\u8cb7\u4fdd\u96aa\u3002',
    keyboardFlight: '\u6309 Enter \u9078\u64c7\u98db\u8239\uff0c\u518d\u7528\u65b9\u5411\u9375\u9078\u78bc\u982d\uff0c\u6309 Enter \u8abf\u5ea6\u3002',
    keyboardChooseDock: '\u5df2\u9078\u64c7\u98db\u8239\u3002\u7528\u65b9\u5411\u9375\u9078\u78bc\u982d\uff0c\u6309 Enter \u8abf\u5ea6\uff1bEscape \u53d6\u6d88\u3002',
    keyboardDockCorrect: '{dock}\u3002\u9019\u662f{flight}\u7684\u6b63\u78ba\u76ee\u6a19\u3002\u6309 Enter \u8abf\u5ea6\uff1b\u71c3\u6599 {fuel} \u2192 {remaining}\u3002',
    keyboardDockWrong: '{dock}\u3002\u9019\u4e0d\u662f{flight}\u7684\u6b63\u78ba\u76ee\u6a19\uff1b\u6b63\u78ba\u76ee\u6a19\u662f{target}\u3002\u73fe\u5728\u6309 Enter \u6703\u589e\u52a0 1 \u6b21\u5931\u8aa4\u3002',
    keyboardDockBlocked: '{dock}\u3002\u9019\u662f{flight}\u7684\u6b63\u78ba\u76ee\u6a19\uff0c\u4f46{step}\u3002\u73fe\u5728\u6309 Enter \u6703\u589e\u52a0 1 \u6b21\u5931\u8aa4\u3002',
    routeCancelled: '\u822a\u7dda\u5df2\u53d6\u6d88\uff0c\u4e0d\u8a08\u5165\u932f\u8aa4\u3002',
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
  let routePointerId = null;
  let suppressClick = false;
  let insuranceActive = false;
  let insurancePending = false;
  let insuranceConfirmTimer = 0;
  let insuranceConfirmDueAt = 0;
  let insuranceConfirmRemaining = 0;
  const t = (key, values = {}) => Object.entries(values).reduce((value, [name, replacement]) => value.replace(`{${name}}`, replacement), strings[locale][key]);
  const persist = () => localStorage.setItem(saveKey, JSON.stringify(save));
  const show = (id) => {
    ['mainScreen','stageScreen','battleShell','result'].forEach((screen) => $(screen).classList.toggle('hidden', screen !== id && !(id === 'result' && screen === 'battleShell')));
    const resultOpen = id === 'result';
    $('battleLive').inert = resultOpen;
    $('battleLive').setAttribute('aria-hidden', resultOpen ? 'true' : 'false');
    $('mainHeader').classList.toggle('hidden', id !== 'mainScreen');
    document.body.classList.toggle('skyport-playing', id === 'battleShell' || id === 'result');
    requestAnimationFrame(() => {
      if ($(id)?.classList.contains('hidden')) return;
      const target = id === 'mainScreen'
        ? $('startBtn')
        : id === 'stageScreen'
          ? document.querySelector('.stage-card.selected:not(:disabled)') || document.querySelector('.stage-card:not(:disabled)')
          : id === 'result'
            ? $('nextBtn')
            : $('flight');
      target?.focus({preventScroll:true});
    });
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
    renderContractControls();
    renderStages();
  }
  function clearInsuranceConfirmation() {
    clearTimeout(insuranceConfirmTimer);
    insuranceConfirmTimer = 0;
    insuranceConfirmDueAt = 0;
    insuranceConfirmRemaining = 0;
    insurancePending = false;
  }
  function armInsuranceConfirmation(delay) {
    insuranceConfirmRemaining = Math.max(0, Number(delay) || 0);
    insuranceConfirmDueAt = performance.now() + insuranceConfirmRemaining;
    insuranceConfirmTimer = setTimeout(() => {
      insuranceConfirmTimer = 0;
      insuranceConfirmDueAt = 0;
      insuranceConfirmRemaining = 0;
      insurancePending = false;
      renderContractControls();
    }, insuranceConfirmRemaining);
  }
  function suspendInsuranceConfirmation() {
    if (!insurancePending || !insuranceConfirmTimer) return;
    insuranceConfirmRemaining = Math.max(0, insuranceConfirmDueAt - performance.now());
    clearTimeout(insuranceConfirmTimer);
    insuranceConfirmTimer = 0;
    insuranceConfirmDueAt = 0;
  }
  function resumeInsuranceConfirmation() {
    if (!insurancePending || insuranceConfirmTimer || document.hidden) return;
    armInsuranceConfirmation(insuranceConfirmRemaining);
  }
  function renderContractControls(message = '') {
    const balance = window.WeightPlayWallet?.read?.().diamonds || 0;
    $('contractToggle').checked = Boolean(state.contract);
    $('contractToggle').disabled = insuranceActive;
    $('contractText').textContent = message || (insurancePending ? t('insuranceDecision', {before:balance, after:Math.max(0,balance-5)}) : state.contract ? t('contractDescription') : t('insuranceSelect'));
    $('insuranceBtn').textContent = insuranceActive ? t('insuranceActive') : insurancePending ? t('insuranceConfirm', {before:balance, after:Math.max(0,balance-5)}) : t('insurance');
    $('insuranceBtn').disabled = insuranceActive || !state.contract;
    $('insuranceBtn').classList.toggle('is-confirming', insurancePending);
    $('insuranceBtn').setAttribute('aria-label', insurancePending ? t('insuranceConfirmLabel', {before:balance, after:Math.max(0,balance-5)}) : t('insuranceLabel', {balance}));
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
      card.innerHTML = `<strong>${t('shift', {n:shift})}</strong><span>${t('objective', {done:0, goal:config.goal})}</span><small><span>${t(availability)}</span><span class="stage-medals">${t('medals', {n:save.medals?.[shift] || 0})}</span></small>`;
      card.onclick = () => { state.shift = shift; startBattle(); };
      $('stageRail').append(card);
    }
  }
  function renderHud() {
    $('shiftText').textContent = t('shift', {n:state.shift});
    $('scoreText').textContent = `${state.done}/${state.goal} \u00b7 ${t('errors', {done:state.errors})}`;
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
    const steps = [
      { id: 'repair', text: labels.repair, complete: !state.storm || state.serviced },
      { id: 'conflict', text: labels.conflict, complete: !state.conflict },
      { id: 'crew', text: labels.crew, complete: !state.needsCrew || state.crewAssigned },
      { id: 'dock', text: labels.drag + dockName, complete: false }
    ].filter((step) => step.id === 'dock' || !((step.id === 'repair' && !state.storm) || (step.id === 'conflict' && !state.requiresConflict) || (step.id === 'crew' && !state.needsCrew)));
    const currentStepIndex = Math.max(0, steps.findIndex((step) => !step.complete));
    const currentStep = steps[currentStepIndex];
    const stepLabel = locale === 'zh-Hant'
      ? `步驟 ${currentStepIndex + 1}/${steps.length}：${currentStep.text}`
      : `Step ${currentStepIndex + 1}/${steps.length}: ${currentStep.text}`;
    document.querySelector('.task-destination').textContent = locale === 'zh-Hant'
      ? `本架：${flightName} → ${dockName}`
      : `Current: ${flightName} -> ${dockName}`;
    // Keep the task strip focused on the action the player can take now. Showing
    // only the final drag step made late flights look like they had skipped rules.
    document.querySelector('.task-steps').textContent = stepLabel;
    const actionLabel = (id, text) => {
      const index = steps.findIndex((step) => step.id === id);
      return `${locale === 'zh-Hant' ? '步驟' : 'Step'} ${index + 1}/${steps.length}: ${text}`;
    };
    if (state.storm) $('serviceBtn').textContent = actionLabel('repair', locale === 'zh-Hant' ? '維修服務' : 'Repair service');
    if (state.conflict) $('clearRouteBtn').textContent = actionLabel('conflict', locale === 'zh-Hant' ? '清除航線衝突' : 'Clear conflict');
    if (state.needsCrew) $('assignCrewBtn').textContent = actionLabel('crew', locale === 'zh-Hant' ? '指派組員' : 'Assign crew');
    $('flight').setAttribute('aria-label', `${locale === 'zh-Hant' ? `${flightName}\uff0c\u76ee\u6a19 ${dockName}` : `${flightName}, target ${dockName}`}. ${t('keyboardFlight')}`);
    $('flight').dataset.destination = locale === 'zh-Hant' ? `\u9001\u5f80 ${dockName}` : `TO ${dockName.toUpperCase()}`;
    document.querySelectorAll('.dock').forEach((dock) => {
      const label = labels.docks[dock.dataset.dock];
      const isTarget = dock.dataset.dock === state.dock;
      const blockingStep = state.storm && !state.serviced
        ? labels.repair
        : state.conflict
          ? labels.conflict
          : !state.crewAssigned
            ? labels.crew
            : state.fuel <= 0
              ? (locale === 'zh-Hant' ? '\u5fc5\u9808\u5148\u88dc\u5145\u71c3\u6599' : 'Fuel must be restored first')
              : '';
      const keyboardLabel = !isTarget
        ? t('keyboardDockWrong', {dock:label, flight:flightName, target:dockName})
        : blockingStep
          ? t('keyboardDockBlocked', {dock:label, flight:flightName, step:blockingStep})
          : t('keyboardDockCorrect', {dock:label, flight:flightName, fuel:state.fuel, remaining:Math.max(0, state.fuel - 1)});
      dock.querySelector('.dock-label').textContent = label;
      dock.setAttribute('aria-label', state.selected ? keyboardLabel : label);
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
    cancelRouteGesture({restoreGuidance:false});
    clearInsuranceConfirmation();
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
    state.requiresConflict = state.shift >= 3 && state.flightIndex % 4 === 1;
    state.conflict = state.requiresConflict;
    // Shift 1 teaches only matching and routing; crew arrives after the player
    // has a stable mental model of docks.
    state.needsCrew = state.shift >= 2 && ['cargo','repair','festival','heavy'].includes(kind);
    state.crewAssigned = !state.needsCrew;
    state.serviced = !state.storm;
    state.selected = false;
    setDockKeyboardMode(false);
    $('flight').style.backgroundImage = `url('../../assets/animal-skyport-dispatch-airship-${kind}.webp')`;
    $('weatherZone').classList.toggle('hidden', !state.storm);
    $('weatherZone').src = '../../assets/animal-skyport-dispatch-weather-storm.webp';
    $('serviceBtn').classList.toggle('hidden', !state.storm);
    $('clearRouteBtn').classList.toggle('hidden', !state.conflict);
    $('assignCrewBtn').classList.toggle('hidden', !state.needsCrew);
    // The task card is the durable instruction. Keep the floating layer empty
    // until an actual success or error needs immediate feedback.
    $('feedback').textContent = '';
    $('routeLine').style.opacity = '0';
    $('routeLine').classList.remove('is-guidance');
  }
  function result(win) {
    cancelRouteGesture({restoreGuidance:false});
    const insuredRun = insuranceActive;
    show('result');
    $('resultTitle').textContent = win ? t('win') : t('lose');
    $('resultCopy').textContent = win ? t('winCopy') : (state.lastError || t('loseCopy'));
    const resultLabels = locale === 'zh-Hant'
      ? { reputation: '\u8072\u671b', coins: '\u5929\u7a7a\u5e63', medals: '\u52f3\u7ae0', safe: '\u5b89\u5168\u8abf\u5ea6', errors: '\u932f\u8aa4', protected: '\u5408\u7d04\u734e\u52f5\u5df2\u4fdd\u7559', retry: '\u514d\u8cbb\u91cd\u8a66' }
      : { reputation: 'Reputation', coins: 'Sky coins', medals: 'Medals', safe: 'Safe routing', errors: 'Errors', protected: 'Contract bonus protected', retry: 'Retry is free' };
    const coinReward = shiftConfig[state.shift].coin + (state.contract && state.errors === 0 ? 20 : 0);
    const unlockEvidence = state.shift < 5 ? t('shiftUnlocked', {n:state.shift + 1}) : t('allShiftsComplete');
    $('resultRewards').innerHTML = win
      ? `<span>${resultLabels.reputation} +${state.done * 5} \u00b7 ${t('total', {n:save.reputation})}</span><span>${resultLabels.coins} +${coinReward} \u00b7 ${t('total', {n:save.coins})}</span><span>${t('blueprintStamps')} +${shiftConfig[state.shift].stamps} \u00b7 ${t('total', {n:save.stamps})}</span><span>${resultLabels.medals} ${save.medals[state.shift] || 1}/3</span><span>${unlockEvidence}</span>`
      : `<span>${resultLabels.safe} ${state.done}/${state.goal}</span><span>${resultLabels.errors} ${state.errors}/3</span><span>${insuredRun ? resultLabels.protected : resultLabels.retry}</span>`;
    const terminalWin = win && state.shift >= 5;
    $('nextBtn').textContent = terminalWin ? t('shifts') : win ? t('next') : t('retry');
    $('nextBtn').onclick = () => {
      if (terminalWin) { show('stageScreen'); renderStages(); return; }
      state.shift = win ? state.shift + 1 : state.shift;
      startBattle();
    };
    $('nextBtn').focus({ preventScroll: true });
    insuranceActive = false;
  }
  function trapResultFocus(event) {
    if (event.repeat && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      return;
    }
    if (event.key !== 'Tab' || $('result').classList.contains('hidden')) return;
    const first = $('nextBtn');
    const last = $('menuBtn');
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
  function finish(ok) {
    if (ok && state.serviced && !state.conflict && state.crewAssigned && state.fuel > 0) {
      state.done += 1;
      state.matched += 1;
      state.fuel -= 1;
      if (state.needsCrew) state.crew = state.maxCrew;
      $('feedback').textContent = locale === 'zh-Hant' ? '\u78bc\u982d\u914d\u5c0d\u6210\u529f\u3002' : 'Dock matched.';
      if (state.done >= state.goal) {
        renderHud();
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
  function cancelRouteGesture({announce=false, restoreGuidance=true} = {}) {
    const wasDragging = dragging;
    dragging = false;
    inputMode = '';
    routePointerId = null;
    if (wasDragging) suppressClick = true;
    $('routeLine').style.opacity = '0';
    $('routeLine').classList.remove('is-guidance');
    if (announce && wasDragging) $('feedback').textContent = t('routeCancelled');
    if (restoreGuidance && wasDragging && state.kind && !$('battleShell').classList.contains('hidden')) renderGuidanceLine();
  }
  function routePointer(event) {
    const mode = event.type.startsWith('pointer') ? 'pointer' : 'mouse';
    const isStart = event.type === 'pointerdown' || event.type === 'mousedown';
    const isEnd = event.type === 'pointerup' || event.type === 'mouseup';
    const flight = $('flight');
    const field = $('routeField').getBoundingClientRect();
    if (isStart) {
      if ((mode === 'pointer' && event.isPrimary === false) || (event.button !== undefined && event.button !== 0)) return;
      if (inputMode && inputMode !== mode) return;
      if (mode === 'pointer' && routePointerId !== null && routePointerId !== event.pointerId) return;
      inputMode = mode;
      if (mode === 'pointer') routePointerId = event.pointerId;
      dragging = true;
      flight.setPointerCapture?.(event.pointerId);
    }
    if (!dragging || inputMode !== mode) return;
    if (mode === 'pointer' && event.pointerId !== routePointerId) return;
    const fromX = flight.offsetLeft + 36;
    const fromY = flight.offsetTop + 36;
    const dx = event.clientX - field.left - fromX;
    const dy = event.clientY - field.top - fromY;
    const length = Math.hypot(dx, dy);
    $('routeLine').classList.remove('is-guidance');
    Object.assign($('routeLine').style, {left:`${fromX}px`, top:`${fromY}px`, width:`${length}px`, transform:`rotate(${Math.atan2(dy, dx)}rad)`, opacity:'1'});
    if (!isEnd) return;
    let target = null;
    let nearest = Infinity;
    document.querySelectorAll('.dock').forEach((dock) => {
      const box = dock.getBoundingClientRect();
      const distance = Math.hypot(event.clientX - (box.left + box.width / 2), event.clientY - (box.top + box.height / 2));
      if (distance < nearest) { nearest = distance; target = dock; }
    });
    const targetRadius = Math.max(64, target?.getBoundingClientRect().width || 0);
    if (nearest > targetRadius) {
      cancelRouteGesture({announce:true});
      return;
    }
    dragging = false;
    inputMode = '';
    routePointerId = null;
    suppressClick = length > 4;
    finish(target?.dataset.dock === state.dock);
  }
  function dockNodes() {
    return [...document.querySelectorAll('.dock')];
  }
  function setDockKeyboardMode(active) {
    dockNodes().forEach((dock) => {
      dock.tabIndex = active ? 0 : -1;
      dock.classList.remove('is-keyboard-choice');
    });
  }
  function selectFlightWithKeyboard() {
    state.selected = true;
    setDockKeyboardMode(true);
    renderFlightTask();
    $('feedback').textContent = t('keyboardChooseDock');
    const firstDock = dockNodes()[0];
    firstDock?.classList.add('is-keyboard-choice');
    firstDock?.focus({preventScroll:true});
  }
  function focusAdjacentDock(current, direction) {
    const docks = dockNodes();
    const index = docks.indexOf(current);
    const next = docks[(index + direction + docks.length) % docks.length];
    docks.forEach((dock) => dock.classList.toggle('is-keyboard-choice', dock === next));
    next?.focus({preventScroll:true});
  }
  function finishKeyboardDock(dock) {
    if (!state.selected) return;
    state.selected = false;
    setDockKeyboardMode(false);
    finish(dock.dataset.dock === state.dock);
    window.requestAnimationFrame(() => $('flight').focus({preventScroll:true}));
  }
  function focusCurrentBattleAction() {
    const nextAction = [
      state.storm && !state.serviced ? $('serviceBtn') : null,
      state.conflict ? $('clearRouteBtn') : null,
      state.needsCrew && !state.crewAssigned ? $('assignCrewBtn') : null,
      $('flight'),
    ].find((node) => node && !node.classList.contains('hidden') && !node.disabled);
    nextAction?.focus({preventScroll:true});
  }
  $('startBtn').onclick = () => { state.shift = save.unlocked; show('stageScreen'); renderStages(); };
  $('contractToggle').onchange = (event) => { clearInsuranceConfirmation(); state.contract = event.target.checked; renderContractControls(); };
  $('stageRail').addEventListener('keydown', (event) => {
    if (event.repeat && (event.key === 'Enter' || event.key === ' ')) event.preventDefault();
  });
  $('insuranceBtn').addEventListener('keydown', (event) => {
    if (event.repeat && (event.key === 'Enter' || event.key === ' ')) event.preventDefault();
  });
  $('insuranceBtn').onclick = () => {
    if (insuranceActive || !state.contract) return;
    const balance = window.WeightPlayWallet?.read?.().diamonds || 0;
    if (balance < 5) { clearInsuranceConfirmation(); renderContractControls(t('insuranceNeed', {balance})); return; }
    if (!insurancePending) {
      insurancePending = true;
      renderContractControls();
      armInsuranceConfirmation(5000);
      return;
    }
    clearInsuranceConfirmation();
    if (!window.WeightPlayWallet?.spendDiamonds?.(5)) { renderContractControls(t('insuranceNeed', {balance:window.WeightPlayWallet?.read?.().diamonds || 0})); return; }
    insuranceActive = true;
    state.contract = true;
    renderContractControls();
    requestAnimationFrame(() => {
      (document.querySelector('.stage-card.selected:not(:disabled)') || document.querySelector('.stage-card:not(:disabled)'))?.focus({preventScroll:true});
    });
  };
  $('stageBack').onclick = () => { clearInsuranceConfirmation(); renderContractControls(); show('mainScreen'); };
  $('battleBack').onclick = () => { cancelRouteGesture({restoreGuidance:false}); show('stageScreen'); renderStages(); };
  $('menuBtn').onclick = () => show('mainScreen');
  $('result').addEventListener('keydown', trapResultFocus);
  $('serviceBtn').onclick = () => {
    if (state.storm && !state.serviced && state.parts) {
      state.parts -= 1;
      state.serviced = true;
      $('serviceBtn').classList.add('hidden');
      $('feedback').textContent = locale === 'zh-Hant' ? '\u98db\u8239\u5df2\u53ef\u5b89\u5168\u9032\u5834\u3002' : 'Flight cleared for safe approach.';
      renderHud();
      focusCurrentBattleAction();
    }
  };
  $('clearRouteBtn').onclick = () => { if (state.conflict && state.fuel > 0) { state.fuel -= 1; state.conflict = false; $('clearRouteBtn').classList.add('hidden'); $('feedback').textContent = locale === 'zh-Hant' ? '\u822a\u7dda\u5df2\u6e05\u7406\u3002' : 'Route cleared.'; renderHud(); focusCurrentBattleAction(); } };
  $('assignCrewBtn').onclick = () => { if (state.needsCrew && !state.crewAssigned && state.crew > 0) { state.crew -= 1; state.crewAssigned = true; $('assignCrewBtn').classList.add('hidden'); $('feedback').textContent = locale === 'zh-Hant' ? '\u7d44\u54e1\u5df2\u6307\u6d3e\u3002' : 'Crew assigned.'; renderHud(); focusCurrentBattleAction(); } };
  $('flight').addEventListener('pointerdown', routePointer);
  $('flight').addEventListener('mousedown', routePointer);
  $('flight').addEventListener('click', (event) => {
    if (suppressClick) { suppressClick = false; event.stopImmediatePropagation(); return; }
    state.selected = true;
    $('feedback').textContent = locale === 'zh-Hant' ? '\u5df2\u9078\u64c7\u98db\u8239\uff0c\u8acb\u9ede\u9078\u78bc\u982d\u3002' : 'Flight selected. Choose a dock.';
  }, true);
  $('flight').addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    if (event.repeat) return;
    selectFlightWithKeyboard();
  });
  document.querySelectorAll('.dock').forEach((dock) => dock.addEventListener('click', () => {
    if (!state.selected) return;
    state.selected = false;
    setDockKeyboardMode(false);
    finish(dock.dataset.dock === state.dock);
  }));
  document.querySelectorAll('.dock').forEach((dock) => dock.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      focusAdjacentDock(dock, -1);
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      focusAdjacentDock(dock, 1);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      finishKeyboardDock(dock);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      state.selected = false;
      setDockKeyboardMode(false);
      renderFlightTask();
      $('feedback').textContent = t('routeCancelled');
      $('flight').focus({preventScroll:true});
    }
  }));
  window.addEventListener('pointermove', routePointer);
  window.addEventListener('pointerup', routePointer);
  window.addEventListener('pointercancel', (event) => { if (dragging && event.pointerId === routePointerId) cancelRouteGesture({announce:true}); });
  window.addEventListener('mousemove', routePointer);
  window.addEventListener('mouseup', routePointer);
  $('flight').addEventListener('lostpointercapture', (event) => { if (dragging && event.pointerId === routePointerId) cancelRouteGesture({announce:true}); });
  window.addEventListener('blur', () => { if (dragging) cancelRouteGesture({announce:true}); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (dragging) cancelRouteGesture({announce:true});
      suspendInsuranceConfirmation();
    } else resumeInsuranceConfirmation();
  });
  window.addEventListener('pagehide', suspendInsuranceConfirmation);
  window.addEventListener('pageshow', resumeInsuranceConfirmation);
  $('localeSelect').onchange = (event) => { locale = event.target.value; localStorage.setItem('weightPlayLocale', locale); localize(); };
  localize();
})();
