(() => {
  const $ = (id) => document.getElementById(id);
  document.body.dataset.wpCombinedSound = 'true';
  // General Stage and Battle own the complete safe physical width. These
  // declarations run before the shared controllers load, so their responsive
  // envelopes supersede the historical numeric desktop maximum.
  const stageScreen = $('stageScreen');
  stageScreen?.setAttribute('data-wp-canvas-max-width', '920');
  stageScreen?.setAttribute('data-wp-stage-landscape-width', '760');
  stageScreen?.setAttribute('data-wp-stage-landscape-height', '334');
  document.querySelector('.battle-canvas')?.setAttribute('data-wp-canvas-max-width', '920');
  const saveKey = 'animal_skyport_dispatch_save';
  const readStorage = (key) => { try { return localStorage.getItem(key); } catch { return null; } };
  const writeStorage = (key, value) => { try { localStorage.setItem(key, value); return true; } catch { return false; } };
  const soundActionLabels = {
    hi: ['ध्वनि म्यूट करें', 'ध्वनि चालू करें'],
    ar: ['كتم الصوت', 'تشغيل الصوت'],
    en: ['Mute sound', 'Turn sound on'],
    'zh-Hant': ['關閉音效', '開啟音效'],
    'zh-Hans': ['关闭音效', '开启音效'],
    ja: ['サウンドをミュート', 'サウンドをオン'],
    ko: ['소리 끄기', '소리 켜기'],
    es: ['Silenciar sonido', 'Activar sonido'],
    'pt-BR': ['Silenciar som', 'Ativar som'],
    fr: ['Couper le son', 'Activer le son'],
    de: ['Ton ausschalten', 'Ton einschalten'],
    it: ['Disattiva audio', 'Attiva audio'],
    ru: ['Выключить звук', 'Включить звук'],
  };
  const playSound = (cue) => window.WonderSound?.play?.(cue);
  function syncSoundToggle() {
    const toggle = $('soundToggle');
    if (!toggle) return;
    const activeLocale = window.WonderI18n?.actualLocale?.() || readStorage('weightPlayLocale') || document.documentElement.lang || 'en';
    const muted = Boolean(window.WonderSound?.isMuted?.());
    const actions = soundActionLabels[activeLocale] || soundActionLabels.en;
    const sourceAction = muted ? 'Turn sound on' : 'Mute sound';
    const action = window.WeightPlayGameRuntimeLocalizer ? sourceAction : actions[muted ? 1 : 0];
    toggle.textContent = muted ? '🔇' : '🔊';
    toggle.title = action;
    toggle.setAttribute('aria-label', action);
    toggle.setAttribute('aria-pressed', String(muted));
  }
  const strings = {
    en: { title:'Animal Skyport Dispatch', language:'Language', headline:'Keep Cloudline Skyport moving.', intro:'Draw safe routes, match airships to docks, and protect the shift from congestion.', start:'Start Game', chooseShift:'Choose a shift', best:'Best shift: {n}', shift:'Shift {n}/30', objective:'Serve {done}/{goal} flights', errors:'Errors {done}/3', stageReady:'Ready', stageLocked:'Locked', stageReplay:'Replay', service:'Use repair service', dragHint:'Drag the airship, or press Enter and use arrow keys, to choose its dock.', menu:'Main Menu', next:'Next Shift', retry:'Retry Shift', win:'Shift complete!', lose:'Skyport congested!', winCopy:'Clear routing earns a new skyport record.', loseCopy:'Three unsafe arrivals closed the shift. Retry is free.', repair:'Repair parts {n}' },
    'zh-Hant': { title:'\u52d5\u7269\u5929\u7a7a\u6e2f\u8abf\u5ea6\u968a', language:'\u8a9e\u8a00', headline:'\u8b93\u96f2\u7dda\u5929\u7a7a\u6e2f\u6301\u7e8c\u904b\u4f5c\u3002', intro:'\u7e6a\u51fa\u5b89\u5168\u822a\u7dda\uff0c\u914d\u5c0d\u98db\u8239\u8207\u78bc\u982d\uff0c\u4fdd\u8b77\u73ed\u6b21\u4e0d\u88ab\u58c5\u585e\u3002', start:'\u958b\u59cb\u904a\u6232', chooseShift:'\u9078\u64c7\u73ed\u6b21', best:'\u6700\u4f73\u73ed\u6b21\uff1a{n}', shift:'\u73ed\u6b21 {n}/30', objective:'\u5b8c\u6210 {done}/{goal} \u67b6\u98db\u8239', errors:'\u5931\u8aa4 {done}/3', stageReady:'\u53ef\u958b\u59cb', stageLocked:'\u672a\u89e3\u9396', stageReplay:'\u53ef\u91cd\u73a9', service:'\u4f7f\u7528\u7dad\u4fee\u670d\u52d9', dragHint:'\u62d6\u66f3\u98db\u8239\uff0c\u6216\u6309 Enter \u5f8c\u7528\u65b9\u5411\u9375\u9078\u64c7\u78bc\u982d\u3002', menu:'\u56de\u4e3b\u9078\u55ae', next:'\u4e0b\u4e00\u73ed', retry:'\u91cd\u8a66\u73ed\u6b21', win:'\u73ed\u6b21\u5b8c\u6210\uff01', lose:'\u5929\u7a7a\u6e2f\u58c5\u585e\uff01', winCopy:'\u6e05\u6670\u8abf\u5ea6\u70ba\u5929\u7a7a\u6e2f\u5beb\u4e0b\u65b0\u7d00\u9304\u3002', loseCopy:'\u4e09\u6b21\u4e0d\u5b89\u5168\u9032\u5834\u95dc\u9589\u4e86\u73ed\u6b21\uff0c\u91cd\u8a66\u514d\u8cbb\u3002', repair:'\u7dad\u4fee\u96f6\u4ef6 {n}' }
  };
  Object.assign(strings.en, {
    leaveTitle: 'Leave this shift?',
    leaveCopy: 'Shift {shift}: {done}/{goal} flights completed and {errors}/3 errors. This shift progress will be lost; saved medals and rewards stay safe.',
    keepPlaying: 'Keep Playing',
    leaveShift: 'Leave Shift',
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
    routeStorm: 'The route touched a red blocked airway.',
    routeSelf: 'The route crossed its own line.',
    routeBeacon: 'Connect every numbered node in order.',
    routeRule: 'Connect every numbered node in order.',
    routeRuleBlocked: 'Connect every numbered node in order · avoid every red line',
    nodeProgress: 'Nodes {done}/{goal}',
  });
  Object.assign(strings['zh-Hant'], {
    leaveTitle: '\u96e2\u958b\u9019\u500b\u73ed\u6b21？',
    leaveCopy: '\u73ed\u6b21 {shift}\uff1a\u5df2\u5b8c\u6210 {done}/{goal} \u67b6\u98db\u8239\uff0c\u932f\u8aa4 {errors}/3\u3002\u672c\u5c40\u9032\u5ea6\u6703\u6d88\u5931\uff1b\u5df2\u5132\u5b58\u7684\u52f3\u7ae0\u8207\u734e\u52f5\u4e0d\u53d7\u5f71\u97ff\u3002',
    keepPlaying: '\u7e7c\u7e8c\u8abf\u5ea6',
    leaveShift: '\u96e2\u958b\u73ed\u6b21',
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
    allShiftsComplete: '\u4e09\u5341\u500b\u73ed\u6b21\u5168\u90e8\u5b8c\u6210',
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
    routeStorm: '\u822a\u7dda\u78b0\u5230\u7d05\u8272\u7981\u884c\u822a\u7dda\u3002',
    routeSelf: '\u822a\u7dda\u4e0d\u80fd\u8207\u81ea\u5df1\u7684\u7dda\u4ea4\u53c9\u3002',
    routeBeacon: '\u5fc5\u9808\u6309\u9806\u5e8f\u9023\u63a5\u6240\u6709\u7de8\u865f\u7bc0\u9ede\u3002',
    routeRule: '\u4f9d\u5e8f\u9023\u63a5\u6bcf\u500b\u7de8\u865f\u7bc0\u9ede\u3002',
    routeRuleBlocked: '\u4f9d\u5e8f\u9023\u63a5\u6bcf\u500b\u7de8\u865f\u7bc0\u9ede \u00b7 \u907f\u958b\u6240\u6709\u7d05\u7dda',
    nodeProgress: '\u7bc0\u9ede {done}/{goal}',
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
  const TOTAL_SHIFTS = 30;
  const STAGE_CARD_POOL_SIZE = 9;
  const shiftConfig = [null,...Array.from({length:TOTAL_SHIFTS},(_,index)=>{const shift=index+1,chapter=Math.floor(index/5),within=index%5;return{goal:4+chapter+(within%3),coin:24+index*6,stamps:1+Math.floor(chapter/2),chapter,layout:within,barriers:shift<=2?0:Math.min(7,1+Math.floor((shift-3)/4)),beacons:Math.min(10,1+Math.floor(index/3))}})];
  const boundedInteger = (value, fallback, minimum, maximum = Number.MAX_SAFE_INTEGER) => {
    const number = Number(value);
    return Number.isFinite(number) ? Math.max(minimum, Math.min(maximum, Math.floor(number))) : fallback;
  };
  const normalizeSave = (data) => {
    const source = data && typeof data === 'object' && !Array.isArray(data) ? data : {};
    const unlocked = boundedInteger(source.unlocked, 1, 1, TOTAL_SHIFTS);
    const medalsSource = source.medals && typeof source.medals === 'object' && !Array.isArray(source.medals) ? source.medals : {};
    const medals = {};
    for (let shift = 1; shift <= TOTAL_SHIFTS; shift += 1) medals[shift] = boundedInteger(medalsSource[shift], 0, 0, 3);
    return {
      best: Math.min(unlocked, boundedInteger(source.best, 1, 1, TOTAL_SHIFTS)),
      unlocked,
      reputation: boundedInteger(source.reputation, 0, 0),
      coins: boundedInteger(source.coins, 0, 0),
      stamps: boundedInteger(source.stamps, 0, 0),
      medals,
      ...(source.insuranceReady === true ? {insuranceReady:true} : {})
    };
  };
  let saved;
  try { saved = JSON.parse(readStorage(saveKey) || '{}'); } catch { saved = {}; }
  // Keep authored runtime text in the English source language. The shared
  // runtime localizer translates that source into all 10 non-English locales
  // and also observes Battle/Result text added after load.
  let locale = 'en';
  let save = normalizeSave(saved);
  writeStorage(saveKey, JSON.stringify(save));
  let state = {contract:Boolean(save.insuranceReady)};
  let centeredShift = save.unlocked;
  let resultActionClaimed = false;
  let dragging = false;
  let inputMode = '';
  let routePointerId = null;
  let routePoints = [];
  let suppressClick = false;
  let insuranceActive = Boolean(save.insuranceReady);
  let insurancePending = false;
  let insuranceConfirmTimer = 0;
  let insuranceConfirmDueAt = 0;
  let insuranceConfirmRemaining = 0;
  let windowFocused = document.hasFocus();
  let stageSettleTimer = 0;
  let stageWindowStart = 0;
  let stageCardPool = [];
  let stageBrowseLogical = Math.max(0, centeredShift - 1);
  let stageSettleFrame = 0;
  let cancelStagePointer = () => {};
  const t = (key, values = {}) => Object.entries(values).reduce((value, [name, replacement]) => value.replace(`{${name}}`, replacement), strings[locale][key]);
  function normalizeResultActions() {
    const panel = $('result');
    if (!panel) return;
    let actions = panel.querySelector('.result-actions');
    if (!actions) {
      actions = document.createElement('div');
      actions.className = 'result-actions';
      panel.append(actions);
    }
    let retry = $('retryBtn');
    if (!retry) {
      retry = document.createElement('button');
      retry.id = 'retryBtn';
      retry.type = 'button';
      retry.className = 'secondary';
    }
    [$('menuBtn'), $('nextBtn'), retry].forEach((button) => {
      button.type = 'button';
      button.classList.remove('primary');
      button.classList.add('secondary');
      actions.append(button);
    });
  }
  normalizeResultActions();
  const persist = () => writeStorage(saveKey, JSON.stringify(save));
  const show = (id) => {
    if (id !== 'stageScreen') cancelStageMotion();
    ['mainScreen','stageScreen','battleShell','result'].forEach((screen) => $(screen).classList.toggle('hidden', screen !== id && !(id === 'result' && screen === 'battleShell')));
    const resultOpen = id === 'result';
    $('battleLive').inert = resultOpen;
    $('battleLive').setAttribute('aria-hidden', resultOpen ? 'true' : 'false');
    $('mainHeader').classList.toggle('hidden', id !== 'mainScreen');
    document.body.classList.toggle('skyport-protected-screen', id !== 'mainScreen');
    document.body.classList.toggle('skyport-playing', id === 'battleShell' || id === 'result');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if ($(id)?.classList.contains('hidden')) return;
        const target = id === 'mainScreen'
          ? $('startBtn')
          : id === 'stageScreen'
            ? document.querySelector(`.stage-card[data-shift="${state.shift}"]`) || document.querySelector('.stage-card[aria-disabled="false"]')
            : id === 'result'
              ? $('nextBtn')
              : $('flight');
        const active = document.activeElement;
        if (active && $(id)?.contains(active) && active !== target) return;
        target?.focus({preventScroll:true});
      });
    });
  };
  function localize() {
    const activeLocale = window.WonderI18n?.actualLocale?.() || readStorage('weightPlayLocale') || 'en';
    document.documentElement.lang = activeLocale;
    document.title = `${t('title')} | WeightPlay`;
    document.querySelectorAll('[data-i18n]').forEach((node) => { node.textContent = t(node.dataset.i18n); });
    $('localeSelect').value = activeLocale;
    $('localeSelect').options[1].textContent = '\u7e41\u9ad4\u4e2d\u6587';
    document.querySelector('.home-link').setAttribute('aria-label', t('backToLobby'));
    document.querySelector('.cover').alt = t('coverAlt');
    $('stageBack').setAttribute('aria-label', t('back'));
    $('battleBack').setAttribute('aria-label', t('back'));
    $('stageRail').setAttribute('aria-label', t('shiftSelection'));
    syncSoundToggle();
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
    if (!insurancePending || insuranceConfirmTimer || document.hidden || !windowFocused) return;
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
  function renderStagesLegacy() {
    if ($('stageScreen').classList.contains('hidden')) return;
    $('bestText').textContent = t('best', {n:save.best || 1});
    $('stageRail').innerHTML = '';
    for (let shift = 1; shift <= TOTAL_SHIFTS; shift += 1) {
      const config = shiftConfig[shift];
      const card = document.createElement('button');
      const locked = shift > save.unlocked;
      card.className = `stage-card${shift === state.shift ? ' selected' : ''}${locked ? ' locked' : ''}`;
      card.dataset.shift = String(shift);
      card.tabIndex = shift === centeredShift ? 0 : -1;
      card.setAttribute('aria-disabled', locked ? 'true' : 'false');
      card.setAttribute('aria-keyshortcuts', 'ArrowLeft ArrowRight Home End');
      const availability = locked ? 'stageLocked' : shift === save.unlocked ? 'stageReady' : 'stageReplay';
      card.innerHTML = `<strong>${t('shift', {n:shift})}</strong><span>${t('objective', {done:0, goal:config.goal})}</span><small><span>${t(availability)}</span><span class="stage-medals">${t('medals', {n:save.medals?.[shift] || 0})}</span></small>`;
      card.addEventListener('focus', () => {
        centeredShift = shift;
        $('stageRail').querySelectorAll('.stage-card').forEach((candidate) => { candidate.tabIndex = candidate === card ? 0 : -1; });
        if (!locked) state.shift = shift;
        syncCenteredStageHighlight(card);
      });
      card.onclick = () => { if (locked) return; state.shift = shift; startBattle(); };
      $('stageRail').append(card);
    }
    requestAnimationFrame(syncCenteredStageHighlight);
  }
  function syncCenteredStageHighlight(explicitCard = null) {
    const rail = $('stageRail');
    const railRect = rail.getBoundingClientRect();
    const center = railRect.left + railRect.width / 2;
    const cards = [...rail.querySelectorAll('.stage-card')];
    const preferred = explicitCard?.matches?.('.stage-card') ? explicitCard : null;
    const nearest = preferred || cards.reduce((best, card) => {
      const rect = card.getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - center);
      return !best || distance < best.distance ? {card, distance} : best;
    }, null)?.card;
    cards.forEach((card) => {
      const centered = card === nearest;
      card.classList.toggle('centered', centered);
      if (centered) card.setAttribute('aria-current', 'true');
      else card.removeAttribute('aria-current');
    });
    if (nearest) centeredShift = Number(nearest.dataset.shift);
  }
  function focusStageCardLegacy(shift) {
    const target = Math.max(1, Math.min(TOTAL_SHIFTS, Number(shift) || 1));
    const card = document.querySelector(`.stage-card[data-shift="${target}"]`);
    if (!card) return;
    centeredShift = target;
    card.scrollIntoView({behavior:'auto', inline:'center', block:'nearest'});
    syncCenteredStageHighlight(card);
    card.focus({preventScroll:true});
  }
  const stageWindowLimit = () => Math.max(0, TOTAL_SHIFTS - STAGE_CARD_POOL_SIZE);
  const desiredStageWindow = (index) => Math.max(0, Math.min(stageWindowLimit(), Math.round(index) - Math.floor(STAGE_CARD_POOL_SIZE / 2)));
  function createStageCard(poolIndex) {
    const card = document.createElement('button');
    card.type = 'button';
    card.dataset.wpStagePoolNode = String(poolIndex + 1);
    return card;
  }
  function bindStageCard(card, index) {
    const shift = index + 1;
    const config = shiftConfig[shift];
    if (!config) return;
    const locked = shift > save.unlocked;
    const availability = locked ? 'stageLocked' : shift === save.unlocked ? 'stageReady' : 'stageReplay';
    card.className = `stage-card${shift === state.shift ? ' selected' : ''}${locked ? ' locked' : ''}`;
    card.dataset.shift = String(shift);
    card.dataset.stage = String(shift);
    card.dataset.stageIndex = String(index);
    card.tabIndex = shift === centeredShift ? 0 : -1;
    card.setAttribute('aria-disabled', locked ? 'true' : 'false');
    card.setAttribute('aria-current', shift === centeredShift ? 'true' : 'false');
    card.setAttribute('aria-posinset', String(shift));
    card.setAttribute('aria-setsize', String(TOTAL_SHIFTS));
    card.setAttribute('aria-keyshortcuts', 'ArrowLeft ArrowRight Home End');
    card.innerHTML = `<strong>${t('shift', {n:shift})}</strong><span>${t('objective', {done:0, goal:config.goal})}</span><small><span>${t(availability)}</span><span class="stage-medals">${t('medals', {n:save.medals?.[shift] || 0})}</span></small>`;
  }
  function buildStagePool() {
    stageWindowStart = desiredStageWindow(stageBrowseLogical);
    stageCardPool = Array.from({length:Math.min(STAGE_CARD_POOL_SIZE, TOTAL_SHIFTS)}, (_, index) => createStageCard(index));
    $('stageRail').replaceChildren(...stageCardPool);
    stageCardPool.forEach((card, index) => bindStageCard(card, stageWindowStart + index));
    Object.assign($('stageRail').dataset, {wpStageVirtualized:'bounded-recycle', wpStagePoolSize:String(stageCardPool.length), wpStageTotal:String(TOTAL_SHIFTS), wpStageWindowStart:String(stageWindowStart), wpStageWindowEnd:String(stageWindowStart + stageCardPool.length - 1), wpStageRecycleCount:'0', wpStageCenterObserver:'manual', wpStageVirtualDrag:'true'});
  }
  function moveStageWindow(targetStart) {
    const target = Math.max(0, Math.min(stageWindowLimit(), targetStart));
    let recycled = 0;
    while (stageWindowStart < target) {
      const card = $('stageRail').firstElementChild;
      stageWindowStart += 1;
      $('stageRail').append(card);
      bindStageCard(card, stageWindowStart + stageCardPool.length - 1);
      recycled += 1;
    }
    while (stageWindowStart > target) {
      const card = $('stageRail').lastElementChild;
      stageWindowStart -= 1;
      $('stageRail').prepend(card);
      bindStageCard(card, stageWindowStart);
      recycled += 1;
    }
    stageCardPool = [...$('stageRail').children];
    Object.assign($('stageRail').dataset, {wpStageWindowStart:String(stageWindowStart), wpStageWindowEnd:String(stageWindowStart + stageCardPool.length - 1)});
    if (recycled) $('stageRail').dataset.wpStageRecycleCount = String(Number($('stageRail').dataset.wpStageRecycleCount || 0) + recycled);
  }
  function ensureStageWindow(index) {
    if (!stageCardPool.length || stageCardPool.some((card) => !card.isConnected)) buildStagePool();
    moveStageWindow(desiredStageWindow(index));
    stageCardPool.forEach((card) => bindStageCard(card, Number(card.dataset.stageIndex)));
    syncCenteredStageHighlight($('stageRail').querySelector(`[data-shift="${Math.round(stageBrowseLogical) + 1}"]`));
  }
  function stageRailPitch() {
    const [first, second] = [...$('stageRail').children].map((card) => card.getBoundingClientRect());
    return first && second ? Math.abs((second.left + second.width / 2) - (first.left + first.width / 2)) : 276;
  }
  function positionStageRail(logical) {
    const value = Math.max(0, Math.min(TOTAL_SHIFTS - 1, logical));
    const anchor = Math.round(value);
    moveStageWindow(desiredStageWindow(anchor));
    $('stageRail').querySelector(`[data-shift="${anchor + 1}"]`)?.scrollIntoView({behavior:'auto', inline:'center', block:'nearest'});
    $('stageRail').scrollLeft += (value - anchor) * stageRailPitch();
    $('stageRail').dataset.wpStageDragLogical = value.toFixed(4);
    return value;
  }
  function cancelStageMotion() {
    clearTimeout(stageSettleTimer);
    if (stageSettleFrame) cancelAnimationFrame(stageSettleFrame);
    stageSettleFrame = 0;
    cancelStagePointer();
    const rail = $('stageRail');
    rail.style.removeProperty('scroll-behavior');
    rail.style.removeProperty('scroll-snap-type');
    rail.classList.remove('wp-stage-dragging');
    delete rail.dataset.wpStageSettling;
  }
  function renderStages() {
    if ($('stageScreen').classList.contains('hidden')) return;
    $('bestText').textContent = t('best', {n:save.best || 1});
    stageBrowseLogical = Math.max(0, centeredShift - 1);
    ensureStageWindow(stageBrowseLogical);
    positionStageRail(stageBrowseLogical);
    requestAnimationFrame(() => positionStageRail(stageBrowseLogical));
  }
  function focusStageCard(shift) {
    const target = Math.max(1, Math.min(TOTAL_SHIFTS, Number(shift) || 1));
    centeredShift = target;
    stageBrowseLogical = target - 1;
    ensureStageWindow(stageBrowseLogical);
    const card = $('stageRail').querySelector(`[data-shift="${target}"]`);
    positionStageRail(stageBrowseLogical);
    syncCenteredStageHighlight(card);
    card?.focus({preventScroll:true});
  }
  function installVirtualStageDrag() {
    const rail = $('stageRail');
    let pointerId = null, startX = 0, lastX = 0, logical = stageBrowseLogical, moved = false, suppressStageClick = false;
    const restore = () => { rail.style.removeProperty('scroll-behavior'); rail.style.removeProperty('scroll-snap-type'); rail.classList.remove('wp-stage-dragging'); delete rail.dataset.wpStageSettling; };
    cancelStagePointer = () => { pointerId = null; moved = false; restore(); };
    rail.addEventListener('pointerdown', (event) => {
      if ($('stageScreen').classList.contains('hidden') || event.isPrimary === false || (event.button !== undefined && event.button !== 0)) return;
      if (stageSettleFrame) cancelAnimationFrame(stageSettleFrame);
      stageSettleFrame = 0; pointerId = event.pointerId; startX = lastX = event.clientX; logical = stageBrowseLogical; moved = false;
      rail.style.setProperty('scroll-behavior', 'auto', 'important'); rail.style.setProperty('scroll-snap-type', 'none', 'important'); event.stopImmediatePropagation();
    }, true);
    document.addEventListener('pointermove', (event) => {
      if (event.pointerId !== pointerId) return;
      const delta = event.clientX - lastX; lastX = event.clientX;
      if (!moved && Math.abs(event.clientX - startX) > 4) { moved = true; rail.classList.add('wp-stage-dragging'); }
      if (moved) { if (event.cancelable) event.preventDefault(); logical = positionStageRail(logical - delta / stageRailPitch()); stageBrowseLogical = logical; stageCardPool.forEach((card) => bindStageCard(card, Number(card.dataset.stageIndex))); syncCenteredStageHighlight(rail.querySelector(`[data-shift="${Math.round(logical) + 1}"]`)); }
      event.stopImmediatePropagation();
    }, true);
    const finish = (event) => {
      if (pointerId === null || (event.pointerId !== undefined && event.pointerId !== pointerId)) return;
      pointerId = null;
      if (!moved) { restore(); return; }
      if (event.cancelable) event.preventDefault(); suppressStageClick = true; setTimeout(() => { suppressStageClick = false; }, 0);
      const from = logical, target = Math.max(0, Math.min(TOTAL_SHIFTS - 1, Math.round(from))), started = performance.now(); rail.dataset.wpStageSettling = 'true';
      const settle = (now) => { const progress = Math.min(1, (now - started) / 340), eased = progress * progress * (3 - 2 * progress); stageBrowseLogical = positionStageRail(from + (target - from) * eased); if (progress < 1) stageSettleFrame = requestAnimationFrame(settle); else { stageSettleFrame = 0; centeredShift = target + 1; ensureStageWindow(target); focusStageCard(target + 1); restore(); } };
      stageSettleFrame = requestAnimationFrame(settle); moved = false; event.stopImmediatePropagation();
    };
    document.addEventListener('pointerup', finish, true); document.addEventListener('pointercancel', finish, true);
    rail.addEventListener('click', (event) => { if (!suppressStageClick) return; suppressStageClick = false; event.preventDefault(); event.stopImmediatePropagation(); }, true);
    rail.addEventListener('click', (event) => { const card = event.target.closest('.stage-card'); if (!card || card.getAttribute('aria-disabled') === 'true') return; state.shift = Number(card.dataset.shift); startBattle(); });
    rail.addEventListener('focusin', (event) => { const card = event.target.closest('.stage-card'); if (!card) return; centeredShift = Number(card.dataset.shift); stageBrowseLogical = centeredShift - 1; if (card.getAttribute('aria-disabled') !== 'true') state.shift = centeredShift; syncCenteredStageHighlight(card); });
  }
  function renderHud() {
    $('shiftText').textContent = t('shift', {n:state.shift});
    $('scoreText').textContent = `${state.done}/${state.goal} \u00b7 ${t('errors', {done:state.errors})}`;
    $('objectiveText').textContent = t('objective', {done:state.done, goal:state.goal});
    $('resourceText').textContent = t('nodeProgress', {done:state.routePassed || 0, goal:state.beacons?.length || 0});
    renderFlightTask();
  }

  function renderFlightTask() {
    if (!state.kind) return;
    const labels = locale === 'zh-Hant'
      ? {flights:flightLabels['zh-Hant'],docks:dockLabels['zh-Hant']}
      : {flights:flightLabels.en,docks:dockLabels.en};
    const flightName = labels.flights[state.kind];
    const dockName = labels.docks[state.dock];
    document.querySelector('.task-destination').textContent = locale === 'zh-Hant'
      ? `目標：${flightName} → ${dockName}`
      : `Target: ${flightName} -> ${dockName}`;
    const routeInstruction = t(state.barriers?.length ? 'routeRuleBlocked' : 'routeRule');
    document.querySelector('.task-steps').textContent = routeInstruction;
    $('flight').setAttribute('aria-label', flightName);
    $('flight').dataset.destination = `\u2192 ${dockName.at(-1)}`;
    document.querySelectorAll('.dock').forEach((dock) => {
      const label = labels.docks[dock.dataset.dock];
      const isTarget = dock.dataset.dock === state.dock;
      const keyboardLabel = !isTarget
        ? t('keyboardDockWrong', {dock:label, flight:flightName, target:dockName})
        : `${label}. ${routeInstruction}`;
      dock.querySelector('.dock-label').textContent = label;
      dock.setAttribute('aria-label', state.selected ? keyboardLabel : label);
      dock.classList.toggle('is-target', isTarget);
      dock.classList.remove('is-alternate');
      dock.querySelector('.dock-target-badge').textContent = isTarget
        ? (locale === 'zh-Hant' ? `前往 ${dockName.at(-1)}` : `GO: ${dockName.at(-1)}`)
        : '';
    });
    requestAnimationFrame(renderGuidanceLine);
  }

  function routeFieldSpace() {
    const element = $('routeField');
    const rect = element.getBoundingClientRect();
    return {
      rect,
      scaleX: rect.width / (element.clientWidth || rect.width || 1),
      scaleY: rect.height / (element.clientHeight || rect.height || 1),
    };
  }
  function routeFieldCenter(node, space) {
    const rect = node?.getBoundingClientRect();
    if (!rect) return null;
    return {
      x: (rect.left + rect.width / 2 - space.rect.left) / space.scaleX,
      y: (rect.top + rect.height / 2 - space.rect.top) / space.scaleY,
    };
  }
  const borderBarriers=[[[.08,.04],[.23,.04]],[[.30,.04],[.45,.04]],[[.55,.04],[.70,.04]],[[.77,.04],[.92,.04]],[[.08,.96],[.23,.96]],[[.31,.96],[.46,.96]],[[.56,.96],[.71,.96]],[[.77,.96],[.92,.96]]];
  const interiorBarriers=[[[.08,.30],[.31,.30]],[[.67,.34],[.92,.34]],[[.10,.70],[.34,.70]],[[.64,.76],[.90,.76]],[[.24,.12],[.24,.36]],[[.76,.53],[.76,.78]],[[.34,.43],[.52,.28]],[[.49,.72],[.68,.57]],[[.15,.48],[.34,.60]],[[.66,.44],[.86,.56]]];
  function routeTargetPoint(){return state.dock==='cargo'?{x:.14,y:.21}:state.dock==='passenger'?{x:.86,y:.21}:{x:.50,y:.84}}
  function segmentGap(a,b,c,d){if(segmentsIntersect(a,b,c,d))return 0;return Math.min(segmentDistance(a,c,d),segmentDistance(b,c,d),segmentDistance(c,a,b),segmentDistance(d,a,b))}
  function distributedBeacons(config){const start={x:.5,y:.5},target=routeTargetPoint(),count=config.beacons,dx=target.x-start.x,dy=target.y-start.y,length=Math.max(.001,Math.hypot(dx,dy)),nx=-dy/length,ny=dx/length,variant=(config.layout+state.flightIndex)%2,baseAmplitude=.28+Math.min(.08,count*.008);return Array.from({length:count},(_,index)=>{const progress=(index+1)/(count+1),side=(index+variant)%2?-1:1,amplitude=baseAmplitude*(.8+Math.sin(progress*Math.PI)*.2);return{x:Math.max(.1,Math.min(.9,start.x+dx*progress+nx*side*amplitude)),y:Math.max(.1,Math.min(.9,start.y+dy*progress+ny*side*amplitude)),order:index+1}})}
  function challengePoints(config){
    const beacons=distributedBeacons(config),nodes=[{x:.5,y:.5},...beacons,routeTargetPoint()],barriers=[],safeRoute=[nodes[0]],blockedLeg=config.barriers?nodes.length-2:-1,metric=point=>({x:point.x*.63,y:point.y});
    for(let leg=0;leg<nodes.length-1;leg++){
      if(leg===blockedLeg){
        const a=nodes[leg],b=nodes[leg+1],dx=b.x-a.x,dy=b.y-a.y,length=Math.max(.001,Math.hypot(dx,dy)),nx=-dy/length,ny=dx/length,mid={x:a.x+dx*.70,y:a.y+dy*.70},half=Math.min(.115,Math.max(.065,length*.22)),barrier={a:{x:mid.x-nx*half,y:mid.y-ny*half},b:{x:mid.x+nx*half,y:mid.y+ny*half},leg,order:1};
        const blockedA=metric(barrier.a),blockedB=metric(barrier.b),clearOfEarlier=safeRoute.slice(1).every((point,index)=>segmentGap(metric(safeRoute[index]),metric(point),blockedA,blockedB)>.035),candidates=[];for(const distance of [half+.12,half+.19,half+.26])for(const side of [1,-1])candidates.push({x:Math.max(.06,Math.min(.94,mid.x+nx*side*distance)),y:Math.max(.07,Math.min(.93,mid.y+ny*side*distance))});
        const clear=detour=>{const trial=[...safeRoute,detour,b].map(metric);for(let index=1;index<trial.length;index++)if(segmentGap(trial[index-1],trial[index],blockedA,blockedB)<.025)return false;for(let index=1;index<trial.length;index++)for(let prior=1;prior<index-2;prior++)if(segmentsIntersect(trial[prior-1],trial[prior],trial[index-1],trial[index]))return false;return true},detour=candidates.find(clear);if(clearOfEarlier&&detour){barrier.detour=detour;barriers.push(barrier);safeRoute.push(detour)}
      }
      safeRoute.push(nodes[leg+1])
    }
    const candidates=interiorBarriers.slice((config.layout+state.flightIndex)%interiorBarriers.length).concat(interiorBarriers,borderBarriers),clearance=.045;for(const [a,b] of candidates){if(barriers.length>=config.barriers)break;const candidate={a:{x:a[0],y:a[1]},b:{x:b[0],y:b[1]},order:barriers.length+1},ca=metric(candidate.a),cb=metric(candidate.b),clearRoute=safeRoute.slice(1).every((point,index)=>segmentGap(metric(safeRoute[index]),metric(point),ca,cb)>clearance),clearNodes=nodes.every(point=>segmentDistance(metric(point),ca,cb)>clearance);if(clearRoute&&clearNodes)barriers.push(candidate)}
    return{barriers,beacons,safeRoute}
  }
  function renderRouteChallenges(){const container=$('routeChallenges'),beacons=state.beacons||[],barriers=state.barriers||[];container.innerHTML='';container.setAttribute('role','group');container.setAttribute('aria-label',`${t('routeRule')} ${t('nodeProgress',{done:0,goal:beacons.length})}`);for(const barrier of barriers){const node=document.createElement('span'),dx=barrier.b.x-barrier.a.x,dy=barrier.b.y-barrier.a.y;node.className='route-barrier';node.setAttribute('role','img');node.setAttribute('aria-label',t('routeRuleBlocked'));node.style.left=`${barrier.a.x*100}%`;node.style.top=`${barrier.a.y*100}%`;node.style.width=`${Math.hypot(dx,dy)*100}%`;node.style.transform=`rotate(${Math.atan2(dy,dx)}rad)`;container.append(node)}for(const beacon of beacons){const node=document.createElement('span');node.className='route-beacon';node.setAttribute('role','img');node.setAttribute('aria-label',`${beacon.order}. ${t('nodeProgress',{done:beacon.order,goal:beacons.length})}`);node.setAttribute('aria-current',beacon.order===1?'step':'false');node.dataset.order=`(${beacon.order})`;node.style.left=`${beacon.x*100}%`;node.style.top=`${beacon.y*100}%`;container.append(node)}}
  function renderRouteTrace(){const svg=$('routeTrace'),field=$('routeField'),progress=routeProgress(routePoints),beacons=state.beacons||[];svg.setAttribute('viewBox',`0 0 ${field.clientWidth} ${field.clientHeight}`);$('routeTracePath').setAttribute('points',routePoints.map(point=>`${point.x},${point.y}`).join(' '));svg.classList.toggle('invalid',progress.barrier||progress.selfCross);state.routePassed=progress.beacons;$('resourceText').textContent=t('nodeProgress',{done:progress.beacons,goal:beacons.length});document.querySelectorAll('.route-beacon').forEach((node,index)=>{const passed=index<progress.beacons;node.classList.toggle('passed',passed);node.setAttribute('aria-current',index===progress.beacons?'step':'false')})}
  function segmentDistance(point,a,b){const dx=b.x-a.x,dy=b.y-a.y,length=dx*dx+dy*dy;if(!length)return Math.hypot(point.x-a.x,point.y-a.y);const t=Math.max(0,Math.min(1,((point.x-a.x)*dx+(point.y-a.y)*dy)/length)),x=a.x+t*dx,y=a.y+t*dy;return Math.hypot(point.x-x,point.y-y)}
  function segmentsIntersect(a,b,c,d){const cross=(p,q,r)=>(q.x-p.x)*(r.y-p.y)-(q.y-p.y)*(r.x-p.x),abC=cross(a,b,c),abD=cross(a,b,d),cdA=cross(c,d,a),cdB=cross(c,d,b),epsilon=.00001;return Math.abs(abC)<epsilon&&segmentDistance(c,a,b)<epsilon||Math.abs(abD)<epsilon&&segmentDistance(d,a,b)<epsilon||Math.abs(cdA)<epsilon&&segmentDistance(a,c,d)<epsilon||Math.abs(cdB)<epsilon&&segmentDistance(b,c,d)<epsilon||(abC>0)!==(abD>0)&&(cdA>0)!==(cdB>0)}
  function routeProgress(points){const field=$('routeField'),width=field.clientWidth,height=field.clientHeight,scale=Math.min(width,height);let beaconIndex=0,barrier=false,selfCross=false;for(let index=1;index<points.length;index++){const a=points[index-1],b=points[index];for(const blocked of state.barriers||[]){const c={x:blocked.a.x*width,y:blocked.a.y*height},d={x:blocked.b.x*width,y:blocked.b.y*height};if(segmentGap(a,b,c,d)<Math.max(7,scale*.018))barrier=true}while(state.beacons?.[beaconIndex]){const beacon=state.beacons[beaconIndex],point={x:beacon.x*width,y:beacon.y*height};if(segmentDistance(point,a,b)<Math.min(width,height)*.07)beaconIndex++;else break}for(let prior=1;prior<index-2;prior++)if(segmentsIntersect(points[prior-1],points[prior],a,b)){selfCross=true;break}}return{barrier,selfCross,beacons:beaconIndex,valid:!barrier&&!selfCross&&beaconIndex===(state.beacons?.length||0)}}
  function repairSafeRoute(){const field=$('routeField'),space=routeFieldSpace(),flight=routeFieldCenter($('flight'),space),start=flight?{x:flight.x/field.clientWidth,y:flight.y/field.clientHeight}:{x:.5,y:.5},target=routeTargetPoint(),base=[start,...(state.beacons||[]).map(point=>({x:point.x,y:point.y}))],toPixels=route=>route.map(point=>({x:point.x*field.clientWidth,y:point.y*field.clientHeight})),valid=route=>routeProgress(toPixels(route)).valid,preferred=state.barriers?.[0]?.detour?[state.barriers[0].detour]:[],direct=[...base,...preferred,target];if(valid(direct)){state.safeRoute=direct;return true}const edge=[];for(const value of [.10,.20,.30,.40,.50,.60,.70,.80,.90])edge.push({x:.055,y:value},{x:.945,y:value},{x:value,y:.065},{x:value,y:.935});for(const point of edge){const route=[...base,point,target];if(valid(route)){state.safeRoute=route;return true}}for(const first of edge)for(const second of edge){const route=[...base,first,second,target];if(valid(route)){state.safeRoute=route;return true}}const grid=[];for(const x of [.08,.22,.36,.50,.64,.78,.92])for(const y of [.08,.22,.36,.50,.64,.78,.92])grid.push({x,y});for(const first of grid)for(const second of grid){const route=[...base,first,second,target];if(valid(route)){state.safeRoute=route;return true}}state.safeRoute=[...base,target];return false}
  function renderGuidanceLine() {
    const space = routeFieldSpace();
    const flight = routeFieldCenter($('flight'), space);
    const dock = state.beacons?.length?{x:state.beacons[0].x*$('routeField').clientWidth,y:state.beacons[0].y*$('routeField').clientHeight}:routeFieldCenter(document.querySelector(`.dock[data-dock="${state.dock}"]`), space);
    if (!space.rect.width || !flight || !dock) return;
    const fromX = flight.x;
    const fromY = flight.y;
    const toX = dock.x;
    const toY = dock.y;
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
    state = {shift, config, done:0, errors:0, goal:config.goal, flightIndex:0, matched:0, selected:false, routePassed:0, contract:Boolean(state.contract)};
    show('battleShell');
    playSound('click');
    nextFlight();
    renderHud();
    focusCurrentBattleAction();
  }
  function nextFlight() {
    const [kind, dock] = flights[state.flightIndex++ % flights.length];
    state.kind = kind;
    state.dock = dock;
    Object.assign(state,challengePoints(state.config));
    state.routeViolation='';
    state.routePassed=0;
    routePoints=[];
    $('routeTracePath').setAttribute('points','');
    renderRouteChallenges();
    repairSafeRoute();
    state.selected = false;
    setDockKeyboardMode(false);
    $('flight').style.backgroundImage = `url('../../assets/animal-skyport-dispatch-airship-${kind}.webp')`;
    $('weatherZone').classList.add('hidden');
    // The task card is the durable instruction. Keep the floating layer empty
    // until an actual success or error needs immediate feedback.
    $('feedback').textContent = '';
    $('routeLine').style.opacity = '0';
    $('routeLine').classList.remove('is-guidance');
    routePoints=[];
    $('routeTracePath').setAttribute('points','');
    $('flightHint').textContent=t('dragHint');
  }
  function result(win) {
    cancelRouteGesture({restoreGuidance:false});
    const insuredRun = insuranceActive;
    show('result');
    if (win) playSound('win');
    $('resultTitle').textContent = win ? t('win') : t('lose');
    $('resultCopy').textContent = win ? t('winCopy') : (state.lastError || t('loseCopy'));
    const resultLabels = locale === 'zh-Hant'
      ? { reputation: '\u8072\u671b', coins: '\u5929\u7a7a\u5e63', medals: '\u52f3\u7ae0', safe: '\u5b89\u5168\u8abf\u5ea6', errors: '\u932f\u8aa4', protected: '\u5408\u7d04\u734e\u52f5\u5df2\u4fdd\u7559', retry: '\u514d\u8cbb\u91cd\u8a66' }
      : { reputation: 'Reputation', coins: 'Sky coins', medals: 'Medals', safe: 'Safe routing', errors: 'Errors', protected: 'Contract bonus protected', retry: 'Retry is free' };
    const coinReward = shiftConfig[state.shift].coin + (state.contract && state.errors === 0 ? 20 : 0);
    const unlockEvidence = state.shift < TOTAL_SHIFTS ? t('shiftUnlocked', {n:state.shift + 1}) : t('allShiftsComplete');
    $('resultRewards').innerHTML = win
      ? `<span>${resultLabels.reputation} +${state.done * 5} \u00b7 ${t('total', {n:save.reputation})}</span><span>${resultLabels.coins} +${coinReward} \u00b7 ${t('total', {n:save.coins})}</span><span>${t('blueprintStamps')} +${shiftConfig[state.shift].stamps} \u00b7 ${t('total', {n:save.stamps})}</span><span>${resultLabels.medals} ${save.medals[state.shift] || 1}/3</span><span>${unlockEvidence}</span>`
      : `<span>${resultLabels.safe} ${state.done}/${state.goal}</span><span>${resultLabels.errors} ${state.errors}/3</span><span>${insuredRun ? `${resultLabels.protected} +20 · ${t('total', {n:save.coins})}` : resultLabels.retry}</span>`;
    const terminalWin = win && state.shift >= TOTAL_SHIFTS;
    resultActionClaimed = false;
    const nextAvailable = win && !terminalWin;
    $('menuBtn').textContent = t('shifts');
    $('nextBtn').textContent = t('next');
    $('retryBtn').textContent = t('retry');
    $('nextBtn').disabled = !nextAvailable;
    [$('menuBtn'), $('retryBtn')].forEach((button) => { button.disabled = false; });
    [$('menuBtn'), $('nextBtn'), $('retryBtn')].forEach((button) => button.classList.remove('primary'));
    const primary = nextAvailable ? $('nextBtn') : terminalWin ? $('menuBtn') : $('retryBtn');
    primary.classList.add('primary');
    $('nextBtn').onclick = () => {
      if (!claimResultAction()) return;
      state.shift += 1;
      startBattle();
    };
    primary.focus({ preventScroll: true });
    insuranceActive = false;
    if (save.insuranceReady) { delete save.insuranceReady; persist(); }
  }
  function claimResultAction() {
    if ($('result').classList.contains('hidden') || resultActionClaimed) return false;
    resultActionClaimed = true;
    [$('menuBtn'), $('nextBtn'), $('retryBtn')].forEach((button) => { button.disabled = true; });
    return true;
  }
  function trapResultFocus(event) {
    if (event.repeat && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      return;
    }
    if (event.key !== 'Tab' || $('result').classList.contains('hidden')) return;
    const enabled = [$('menuBtn'), $('nextBtn'), $('retryBtn')].filter((button) => !button.disabled);
    const first = enabled[0];
    const last = enabled[enabled.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
  function closeLeaveConfirm({restoreFocus=true} = {}) {
    $('leaveConfirm').classList.add('hidden');
    $('battleLive').inert = false;
    $('battleLive').setAttribute('aria-hidden', 'false');
    if (restoreFocus) requestAnimationFrame(() => $('flight').focus({preventScroll:true}));
  }
  function openLeaveConfirm() {
    cancelRouteGesture({restoreGuidance:false});
    state.selected = false;
    setDockKeyboardMode(false);
    $('leaveTitle').textContent = t('leaveTitle');
    $('leaveCopy').textContent = t('leaveCopy', {shift:state.shift, done:state.done, goal:state.goal, errors:state.errors});
    $('leaveCancel').textContent = t('keepPlaying');
    $('leaveConfirmBtn').textContent = t('leaveShift');
    $('battleLive').inert = true;
    $('battleLive').setAttribute('aria-hidden', 'true');
    $('leaveConfirm').classList.remove('hidden');
    requestAnimationFrame(() => $('leaveCancel').focus({preventScroll:true}));
  }
  function trapLeaveFocus(event) {
    if ($('leaveConfirm').classList.contains('hidden')) return;
    if (event.repeat && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      closeLeaveConfirm();
      return;
    }
    if (event.key !== 'Tab') return;
    const first = $('leaveCancel');
    const last = $('leaveConfirmBtn');
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
  function battleDecisionOpen() {
    return !$('leaveConfirm').classList.contains('hidden') || !$('result').classList.contains('hidden');
  }
  function finish(ok, chosenDock = ok ? state.dock : '') {
    if (battleDecisionOpen()) return;
    const primary = chosenDock === state.dock;
    if (primary && !state.routeViolation) {
      state.done += 1;
      state.matched += 1;
      $('feedback').textContent = locale === 'zh-Hant' ? '\u78bc\u982d\u914d\u5c0d\u6210\u529f\u3002' : 'Dock matched.';
      if (state.done >= state.goal) {
        renderHud();
        const config = shiftConfig[state.shift];
        save.best = Math.max(save.best || 1, state.shift);
        save.unlocked = Math.max(save.unlocked || 1, Math.min(TOTAL_SHIFTS, state.shift + 1));
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
      playSound('success');
      nextFlight();
    } else {
      playSound('wrong');
      state.errors += 1;
      state.lastError = state.routeViolation==='barrier'?t('routeStorm'):state.routeViolation==='self'?t('routeSelf'):state.routeViolation==='beacon'?t('routeBeacon'):(locale === 'zh-Hant' ? '碼頭不對：請前往上方指定的碼頭。' : 'Wrong dock: follow the target shown above.');
      state.routeViolation='';
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
    routePoints=[];
    $('routeTracePath').setAttribute('points','');
    if (announce && wasDragging) $('feedback').textContent = t('routeCancelled');
    if (restoreGuidance && wasDragging && state.kind && !$('battleShell').classList.contains('hidden')) renderGuidanceLine();
  }
  function routePointer(event) {
    if (battleDecisionOpen()) {
      if (dragging) cancelRouteGesture({announce:false});
      return;
    }
    const mode = event.type.startsWith('pointer') ? 'pointer' : 'mouse';
    const isStart = event.type === 'pointerdown' || event.type === 'mousedown';
    const isEnd = event.type === 'pointerup' || event.type === 'mouseup';
    const flight = $('flight');
    const field = routeFieldSpace();
    if (isStart) {
      if ((mode === 'pointer' && event.isPrimary === false) || (event.button !== undefined && event.button !== 0)) return;
      if (inputMode && inputMode !== mode) return;
      if (mode === 'pointer' && routePointerId !== null && routePointerId !== event.pointerId) return;
      inputMode = mode;
      if (mode === 'pointer') routePointerId = event.pointerId;
      dragging = true;
      const start=routeFieldCenter(flight,field);
      routePoints=start?[start]:[];
      $('routeLine').style.opacity='0';
      $('routeLine').classList.remove('is-guidance');
      renderRouteTrace();
      flight.setPointerCapture?.(event.pointerId);
    }
    if (!dragging || inputMode !== mode) return;
    if (mode === 'pointer' && event.pointerId !== routePointerId) return;
    const start = routeFieldCenter(flight, field);
    const fromX = start.x;
    const fromY = start.y;
    const dx = (event.clientX - field.rect.left) / field.scaleX - fromX;
    const dy = (event.clientY - field.rect.top) / field.scaleY - fromY;
    const length = Math.hypot(dx, dy);
    const routePoint={x:(event.clientX-field.rect.left)/field.scaleX,y:(event.clientY-field.rect.top)/field.scaleY};
    if(!routePoints.length||Math.hypot(routePoint.x-routePoints.at(-1).x,routePoint.y-routePoints.at(-1).y)>3){routePoints.push(routePoint);renderRouteTrace()}
    $('routeLine').style.opacity='0';
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
    const chosenDock = target?.dataset.dock || '';
    const routeCheck=routeProgress(routePoints);
    state.routeViolation=routeCheck.barrier?'barrier':routeCheck.selfCross?'self':routeCheck.beacons<(state.beacons?.length||0)?'beacon':'';
    finish(chosenDock === state.dock, chosenDock);
  }
  function dockNodes() {
    return [...document.querySelectorAll('.dock')];
  }
  function setDockKeyboardMode() {
    dockNodes().forEach((dock) => {
      dock.tabIndex = -1;
      dock.classList.remove('is-keyboard-choice');
    });
  }
  function selectFlightWithKeyboard() {
    if (battleDecisionOpen()) return;
    state.selected = true;
    setDockKeyboardMode(true);
    renderFlightTask();
    $('feedback').textContent = t('keyboardChooseDock');
    const firstDock = dockNodes()[0];
    if (firstDock) firstDock.tabIndex = 0;
    firstDock?.classList.add('is-keyboard-choice');
    firstDock?.focus({preventScroll:true});
  }
  function focusAdjacentDock(current, direction) {
    const docks = dockNodes();
    const index = docks.indexOf(current);
    const next = docks[(index + direction + docks.length) % docks.length];
    docks.forEach((dock) => {
      const active = dock === next;
      dock.tabIndex = active ? 0 : -1;
      dock.classList.toggle('is-keyboard-choice', active);
    });
    next?.focus({preventScroll:true});
  }
  function finishKeyboardDock(dock) {
    if (battleDecisionOpen() || !state.selected) return;
    state.selected = false;
    setDockKeyboardMode(false);
    const field=$('routeField'),space=routeFieldSpace(),start=routeFieldCenter($('flight'),space),target=routeFieldCenter(dock,space);
    routePoints=[start,...(state.safeRoute||[]).slice(1,-1).map(point=>({x:point.x*field.clientWidth,y:point.y*field.clientHeight})),target].filter(Boolean);
    const routeCheck=routeProgress(routePoints);
    state.routeViolation=routeCheck.barrier?'barrier':routeCheck.selfCross?'self':routeCheck.beacons<(state.beacons?.length||0)?'beacon':'';
    renderRouteTrace();
    finish(dock.dataset.dock === state.dock, dock.dataset.dock);
    window.requestAnimationFrame(() => $('flight').focus({preventScroll:true}));
  }
  function focusCurrentBattleAction() {
    $('flight').focus({preventScroll:true});
  }
  $('startBtn').onclick = () => { state.shift = save.unlocked; centeredShift = state.shift; show('stageScreen'); renderStages(); };
  $('soundToggle').onclick = () => {
    window.WonderSound?.unlock?.();
    const nextMuted = !Boolean(window.WonderSound?.isMuted?.());
    window.WonderSound?.setMuted?.(nextMuted);
    syncSoundToggle();
    if (!nextMuted) playSound('click');
  };
  $('soundToggle').addEventListener('keydown', (event) => {
    if (event.repeat && (event.key === 'Enter' || event.key === ' ')) event.preventDefault();
  });
  $('startBtn').addEventListener('keydown', (event) => {
    if (event.repeat && (event.key === 'Enter' || event.key === ' ')) event.preventDefault();
  });
  $('contractToggle').onchange = (event) => { clearInsuranceConfirmation(); state.contract = event.target.checked; renderContractControls(); };
  $('stageRail').addEventListener('keydown', (event) => {
    const card = event.target.closest('.stage-card');
    if (!card) return;
    if (event.repeat && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); return; }
    const rtl = getComputedStyle($('stageRail')).direction === 'rtl';
    const delta = event.key === 'ArrowLeft' ? (rtl ? 1 : -1) : event.key === 'ArrowRight' ? (rtl ? -1 : 1) : 0;
    const next = event.key === 'Home' ? 1 : event.key === 'End' ? TOTAL_SHIFTS : delta ? Number(card.dataset.shift) + delta : null;
    if (next === null) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    focusStageCard(next);
  }, true);
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
    save.insuranceReady = true;
    persist();
    renderContractControls();
    requestAnimationFrame(() => {
      (document.querySelector(`.stage-card[data-shift="${state.shift}"]`) || document.querySelector('.stage-card[aria-disabled="false"]'))?.focus({preventScroll:true});
    });
  };
  $('stageBack').onclick = () => { clearInsuranceConfirmation(); renderContractControls(); show('mainScreen'); };
  $('battleBack').onclick = openLeaveConfirm;
  $('leaveCancel').onclick = () => closeLeaveConfirm();
  $('leaveConfirmBtn').onclick = () => { closeLeaveConfirm({restoreFocus:false}); show('stageScreen'); renderStages(); };
  $('leaveConfirm').addEventListener('keydown', trapLeaveFocus);
  $('menuBtn').onclick = () => {
    if (!claimResultAction()) return;
    show('stageScreen');
    renderStages();
  };
  $('retryBtn').onclick = () => {
    if (!claimResultAction()) return;
    startBattle();
  };
  $('result').addEventListener('keydown', trapResultFocus);
  $('flight').addEventListener('pointerdown', routePointer);
  $('flight').addEventListener('mousedown', routePointer);
  $('flight').addEventListener('click', (event) => {
    if (suppressClick) { suppressClick = false; event.stopImmediatePropagation(); return; }
    if (battleDecisionOpen()) return;
    state.selected = true;
    $('feedback').textContent = locale === 'zh-Hant' ? '\u5df2\u9078\u64c7\u98db\u8239\uff0c\u8acb\u9ede\u9078\u78bc\u982d\u3002' : 'Flight selected. Choose a dock.';
  }, true);
  $('flight').addEventListener('keydown', (event) => {
    if (battleDecisionOpen()) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    if (event.repeat) return;
    selectFlightWithKeyboard();
  });
  document.querySelectorAll('.dock').forEach((dock) => dock.addEventListener('click', () => {
    if (battleDecisionOpen() || !state.selected) return;
    finishKeyboardDock(dock);
  }));
  document.querySelectorAll('.dock').forEach((dock) => dock.addEventListener('keydown', (event) => {
    if (battleDecisionOpen()) return;
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
  window.addEventListener('blur', () => {
    windowFocused = false;
    if (dragging) cancelRouteGesture({announce:true});
    suspendInsuranceConfirmation();
  });
  window.addEventListener('focus', () => {
    windowFocused = true;
    resumeInsuranceConfirmation();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (dragging) cancelRouteGesture({announce:true});
      suspendInsuranceConfirmation();
    } else resumeInsuranceConfirmation();
  });
  window.addEventListener('pagehide', suspendInsuranceConfirmation);
  window.addEventListener('pageshow', resumeInsuranceConfirmation);
  const changeLocale = (event) => {
    const nextLocale = event.target.value;
    writeStorage('weightPlayLocale', nextLocale);
    window.WonderI18n?.setLocale(nextLocale);
    locale = 'en';
    localize();
  };
  $('localeSelect').onchange = changeLocale;
  if (new URLSearchParams(location.search).get('trial') === '1') {
    window.__animalSkyportDispatchSmoke = {
      totalShifts: TOTAL_SHIFTS,
      configs: shiftConfig.slice(1).map(({goal, stamps, chapter, layout, barriers, beacons}) => ({goal, stamps, chapter, layout, barriers, beacons})),
      startShift(shift) {
        state.shift = Math.max(1, Math.min(TOTAL_SHIFTS, Number(shift) || 1));
        startBattle();
      },
      prepareAndDispatch() {
        state.routeViolation = '';
        finish(true, state.dock);
      },
      snapshot() {
        return {
          shift: state.shift,
          done: state.done,
          goal: state.goal,
          errors: state.errors,
          dock: state.dock,
          beacons: state.beacons?.length || 0,
          barriers: state.barriers?.length || 0,
          routePassed: state.routePassed || 0,
          resultOpen: !$('result').classList.contains('hidden'),
          unlocked: save.unlocked,
          medals: save.medals?.[state.shift] || 0,
        };
      },
      safeRoute(){return(state.safeRoute||[]).map(point=>({...point}))},
      challenges(){return{barriers:(state.barriers||[]).map(item=>JSON.parse(JSON.stringify(item))),beacons:(state.beacons||[]).map(item=>({...item})),target:routeTargetPoint()}},
      auditSafeRoute(){const field=$("routeField"),points=(state.safeRoute||[]).map(point=>({x:point.x*field.clientWidth,y:point.y*field.clientHeight}));return routeProgress(points)},
    };
  }
  installVirtualStageDrag();
  localize();
})();
