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
  const startLabels = {
    en: 'Start Dispatch', 'zh-Hant': '\u958b\u59cb\u8abf\u5ea6', 'zh-Hans': '\u5f00\u59cb\u8c03\u5ea6', ja: '\u30c7\u30a3\u30b9\u30d1\u30c3\u30c1\u958b\u59cb',
    ko: '\ubc30\ucc28 \uc2dc\uc791', es: 'Iniciar despacho', 'pt-BR': 'Iniciar despacho', fr: 'Lancer la r\u00e9partition', de: 'Dispatch starten',
    it: 'Avvia dispacciamento', ru: '\u041d\u0430\u0447\u0430\u0442\u044c \u0434\u0438\u0441\u043f\u0435\u0442\u0447\u0435\u0440\u0438\u0437\u0430\u0446\u0438\u044e', hi: '\u0921\u093f\u0938\u0948\u092a\u091a \u0936\u0941\u0930\u0942 \u0915\u0930\u0947\u0902', ar: '\u0627\u0628\u062f\u0623 \u0627\u0644\u0625\u0631\u0633\u0627\u0644',
  };
  const resultLabelsByLocale = {
    en: { reputation:'Reputation', coins:'Sky coins', blueprintStamps:'Blueprint stamps', medals:'Medals', safe:'Safe routing', errors:'Errors', protected:'Contract bonus protected', retry:'Retry is free', total:'Total', shiftUnlocked:'Shift {n} unlocked', allShiftsComplete:'All shifts complete' },
    'zh-Hant': { reputation:'\u8072\u671b', coins:'\u5929\u7a7a\u5e63', blueprintStamps:'\u85cd\u5716\u5370\u7ae0', medals:'\u52f3\u7ae0', safe:'\u5b89\u5168\u8abf\u5ea6', errors:'\u932f\u8aa4', protected:'\u5408\u7d04\u734e\u52f5\u5df2\u4fdd\u7559', retry:'\u514d\u8cbb\u91cd\u8a66', total:'\u7e3d\u8a08', shiftUnlocked:'\u5df2\u89e3\u9396\u7b2c {n} \u73ed', allShiftsComplete:'\u5168\u90e8\u73ed\u6b21\u5b8c\u6210' },
    'zh-Hans': { reputation:'声望', coins:'天空币', blueprintStamps:'蓝图印章', medals:'勋章', safe:'安全调度', errors:'错误', protected:'合约奖励已保留', retry:'免费重试', total:'总计', shiftUnlocked:'已解锁第 {n} 班', allShiftsComplete:'全部班次完成' },
    ja: { reputation:'評判', coins:'スカイコイン', blueprintStamps:'設計図スタンプ', medals:'メダル', safe:'安全な運航', errors:'ミス', protected:'契約ボーナスを保護', retry:'リトライ無料', total:'合計', shiftUnlocked:'シフト {n} を解放', allShiftsComplete:'全シフト完了' },
    ko: { reputation:'평판', coins:'스카이 코인', blueprintStamps:'청사진 스탬프', medals:'메달', safe:'안전 운항', errors:'오류', protected:'계약 보너스 보호', retry:'무료 재시도', total:'합계', shiftUnlocked:'근무 {n} 잠금 해제', allShiftsComplete:'모든 근무 완료' },
    es: { reputation:'Reputación', coins:'Monedas celestes', blueprintStamps:'Sellos de plano', medals:'Medallas', safe:'Ruta segura', errors:'Errores', protected:'Bono de contrato protegido', retry:'Reintento gratis', total:'Total', shiftUnlocked:'Turno {n} desbloqueado', allShiftsComplete:'Todos los turnos completados' },
    'pt-BR': { reputation:'Reputação', coins:'Moedas celestes', blueprintStamps:'Selos de projeto', medals:'Medalhas', safe:'Rota segura', errors:'Erros', protected:'Bônus do contrato protegido', retry:'Repetir é grátis', total:'Total', shiftUnlocked:'Turno {n} desbloqueado', allShiftsComplete:'Todos os turnos concluídos' },
    fr: { reputation:'Réputation', coins:'Pièces célestes', blueprintStamps:'Timbres de plan', medals:'Médailles', safe:'Route sûre', errors:'Erreurs', protected:'Bonus du contrat protégé', retry:'Rejouer est gratuit', total:'Total', shiftUnlocked:'Shift {n} débloqué', allShiftsComplete:'Tous les shifts terminés' },
    de: { reputation:'Ruf', coins:'Himmelsmünzen', blueprintStamps:'Bauplanmarken', medals:'Medaillen', safe:'Sichere Route', errors:'Fehler', protected:'Vertragsbonus geschützt', retry:'Kostenlos erneut spielen', total:'Gesamt', shiftUnlocked:'Schicht {n} freigeschaltet', allShiftsComplete:'Alle Schichten abgeschlossen' },
    it: { reputation:'Reputazione', coins:'Monete celesti', blueprintStamps:'Timbri del progetto', medals:'Medaglie', safe:'Rotta sicura', errors:'Errori', protected:'Bonus contratto protetto', retry:'Riprova gratis', total:'Totale', shiftUnlocked:'Turno {n} sbloccato', allShiftsComplete:'Tutti i turni completati' },
    ru: { reputation:'Репутация', coins:'Небесные монеты', blueprintStamps:'Чертёжные марки', medals:'Медали', safe:'Безопасный маршрут', errors:'Ошибки', protected:'Бонус контракта сохранён', retry:'Повтор бесплатен', total:'Всего', shiftUnlocked:'Смена {n} открыта', allShiftsComplete:'Все смены завершены' },
    hi: { reputation:'प्रतिष्ठा', coins:'स्काई कॉइन', blueprintStamps:'ब्लूप्रिंट स्टैम्प', medals:'पदक', safe:'सुरक्षित मार्ग', errors:'त्रुटियाँ', protected:'अनुबंध बोनस सुरक्षित', retry:'मुफ्त पुनः प्रयास', total:'कुल', shiftUnlocked:'शिफ्ट {n} अनलॉक', allShiftsComplete:'सभी शिफ्ट पूरी' },
    ar: { reputation:'السمعة', coins:'عملات السماء', blueprintStamps:'طوابع المخطط', medals:'الأوسمة', safe:'توجيه آمن', errors:'الأخطاء', protected:'تمت حماية مكافأة العقد', retry:'إعادة المحاولة مجانية', total:'المجموع', shiftUnlocked:'تم فتح المناوبة {n}', allShiftsComplete:'اكتملت كل المناوبات' },
  };
  const playSound = (cue) => window.WonderSound?.play?.(cue);
  function syncSoundToggle() {
    const toggle = $('soundToggle');
    if (!toggle) return;
    const activeLocale = window.WonderI18n?.actualLocale?.() || readStorage('weightPlayLocale') || document.documentElement.lang || 'en';
    const muted = Boolean(window.WonderSound?.isMuted?.());
    const actions = soundActionLabels[activeLocale] || soundActionLabels.en;
    const sourceAction = muted ? 'Turn sound on' : 'Mute sound';
    const action = actions[muted ? 1 : 0];
    toggle.textContent = muted ? '🔇' : '🔊';
    toggle.title = action;
    toggle.setAttribute('aria-label', action);
    toggle.setAttribute('aria-pressed', String(muted));
  }
  const strings = {
    en: { title:'Animal Skyport Dispatch', language:'Language', headline:'Keep Cloudline Skyport moving.', intro:'Draw safe routes, match airships to docks, and protect the shift from congestion.', start:'Start Dispatch', chooseShift:'Choose a shift', best:'Best shift: {n}', shift:'Shift {n}/30', objective:'Serve {done}/{goal} flights', errors:'Errors {done}/3', stageReady:'Ready', stageLocked:'Locked', stageReplay:'Replay', service:'Use repair service', dragHint:'Drag the airship, or press Enter and use arrow keys, to choose its dock.', menu:'Main Menu', next:'Next Shift', retry:'Retry Shift', win:'Shift complete!', lose:'Skyport congested!', winCopy:'Clear routing earns a new skyport record.', loseCopy:'Three unsafe arrivals closed the shift. Retry is free.', repair:'Repair parts {n}', nextShiftPreview:'Next Shift {shift}: serve {goal} flights · {rule}' },
    'zh-Hant': { title:'\u52d5\u7269\u5929\u7a7a\u6e2f\u8abf\u5ea6\u968a', language:'\u8a9e\u8a00', headline:'\u8b93\u96f2\u7dda\u5929\u7a7a\u6e2f\u6301\u7e8c\u904b\u4f5c\u3002', intro:'\u7e6a\u51fa\u5b89\u5168\u822a\u7dda\uff0c\u914d\u5c0d\u98db\u8239\u8207\u78bc\u982d\uff0c\u4fdd\u8b77\u73ed\u6b21\u4e0d\u88ab\u58c5\u585e\u3002', start:'\u958b\u59cb\u8abf\u5ea6', chooseShift:'\u9078\u64c7\u73ed\u6b21', best:'\u6700\u4f73\u73ed\u6b21\uff1a{n}', shift:'\u73ed\u6b21 {n}/30', objective:'\u5b8c\u6210 {done}/{goal} \u67b6\u98db\u8239', errors:'\u5931\u8aa4 {done}/3', stageReady:'\u53ef\u958b\u59cb', stageLocked:'\u672a\u89e3\u9396', stageReplay:'\u53ef\u91cd\u73a9', service:'\u4f7f\u7528\u7dad\u4fee\u670d\u52d9', dragHint:'\u62d6\u66f3\u98db\u8239\uff0c\u6216\u6309 Enter \u5f8c\u7528\u65b9\u5411\u9375\u9078\u64c7\u78bc\u982d\u3002', menu:'\u56de\u4e3b\u9078\u55ae', next:'\u4e0b\u4e00\u73ed', retry:'\u91cd\u8a66\u73ed\u6b21', win:'\u73ed\u6b21\u5b8c\u6210\uff01', lose:'\u5929\u7a7a\u6e2f\u58c5\u585e\uff01', winCopy:'\u6e05\u6670\u8abf\u5ea6\u70ba\u5929\u7a7a\u6e2f\u5beb\u4e0b\u65b0\u7d00\u9304\u3002', loseCopy:'\u4e09\u6b21\u4e0d\u5b89\u5168\u9032\u5834\u95dc\u9589\u4e86\u73ed\u6b21\uff0c\u91cd\u8a66\u514d\u8cbb\u3002', repair:'\u7dad\u4fee\u96f6\u4ef6 {n}', nextShiftPreview:'\u4e0b\u4e00\u73ed {shift}\uff1a\u5b8c\u6210 {goal} \u67b6\u98db\u8239 \u00b7 {rule}' }
  };
  Object.assign(strings.en, {
    leaveTitle: 'Leave this shift?',
    leaveCopy: 'Shift {shift}: {done}/{goal} flights completed and {errors}/3 errors. This shift progress will be lost; saved medals and rewards stay safe.',
    keepPlaying: 'Keep Playing',
    leaveShift: 'Leave Shift',
    guideTitle: 'How to dispatch',
    guideBody: 'Choose a shift, connect the numbered nodes in order, avoid red blocked airways when they appear, and guide each airship to its matching dock.',
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
    nextShiftPreview: 'Next Shift {shift}: serve {goal} flights · {rule}',
  });
  Object.assign(strings['zh-Hant'], {
    leaveTitle: '\u96e2\u958b\u9019\u500b\u73ed\u6b21？',
    leaveCopy: '\u73ed\u6b21 {shift}\uff1a\u5df2\u5b8c\u6210 {done}/{goal} \u67b6\u98db\u8239\uff0c\u932f\u8aa4 {errors}/3\u3002\u672c\u5c40\u9032\u5ea6\u6703\u6d88\u5931\uff1b\u5df2\u5132\u5b58\u7684\u52f3\u7ae0\u8207\u734e\u52f5\u4e0d\u53d7\u5f71\u97ff\u3002',
    keepPlaying: '\u7e7c\u7e8c\u8abf\u5ea6',
    leaveShift: '\u96e2\u958b\u73ed\u6b21',
    guideTitle: '\u5982\u4f55\u8abf\u5ea6',
    guideBody: '\u9078\u64c7\u73ed\u6b21\u3001\u4f9d\u5e8f\u9023\u63a5\u7de8\u865f\u7bc0\u9ede\uff1b\u51fa\u73fe\u7d05\u8272\u5c01\u9396\u822a\u7dda\u6642\u907f\u958b\uff0c\u518d\u5c07\u6bcf\u8266\u98db\u8239\u5f15\u5c0e\u5230\u76f8\u7b26\u78bc\u982d\u3002',
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
    nextShiftPreview: '\u4e0b\u4e00\u73ed {shift}\uff1a\u5b8c\u6210 {goal} \u67b6\u98db\u8239 \u00b7 {rule}',
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
  Object.assign(flightLabels, {
    'zh-Hans': {cargo:'货运飞船', passenger:'客运飞船', repair:'维修飞船', festival:'节庆飞船', heavy:'重型货运飞船'},
    ja: {cargo:'貨物飛行船', passenger:'旅客飛行船', repair:'修理飛行船', festival:'祭典飛行船', heavy:'大型貨物飛行船'},
    ko: {cargo:'화물 비행선', passenger:'여객 비행선', repair:'수리 비행선', festival:'축제 비행선', heavy:'대형 화물 비행선'},
    es: {cargo:'Dirigible de carga', passenger:'Dirigible de pasajeros', repair:'Dirigible de reparación', festival:'Dirigible del festival', heavy:'Dirigible de carga pesada'},
    'pt-BR': {cargo:'Aeronave de carga', passenger:'Aeronave de passageiros', repair:'Aeronave de reparo', festival:'Aeronave do festival', heavy:'Aeronave de carga pesada'},
    fr: {cargo:'Dirigeable cargo', passenger:'Dirigeable passagers', repair:'Dirigeable de réparation', festival:'Dirigeable du festival', heavy:'Dirigeable cargo lourd'},
    de: {cargo:'Frachtluftschiff', passenger:'Passagierluftschiff', repair:'Reparaturluftschiff', festival:'Festluftschiff', heavy:'Schwerlastluftschiff'},
    it: {cargo:'Aeronave cargo', passenger:'Aeronave passeggeri', repair:'Aeronave di riparazione', festival:'Aeronave del festival', heavy:'Aeronave cargo pesante'},
    ru: {cargo:'Грузовой дирижабль', passenger:'Пассажирский дирижабль', repair:'Ремонтный дирижабль', festival:'Праздничный дирижабль', heavy:'Тяжёлый грузовой дирижабль'},
    hi: {cargo:'कार्गो एयरशिप', passenger:'यात्री एयरशिप', repair:'मरम्मत एयरशिप', festival:'उत्सव एयरशिप', heavy:'भारी कार्गो एयरशिप'},
    ar: {cargo:'منطاد شحن', passenger:'منطاد ركاب', repair:'منطاد إصلاح', festival:'منطاد احتفال', heavy:'منطاد شحن ثقيل'},
  });
  Object.assign(dockLabels, {
    'zh-Hans': {cargo:'货运码头 A', passenger:'客运码头 B', repair:'维修码头 C'},
    ja: {cargo:'貨物ドック A', passenger:'旅客ドック B', repair:'修理ドック C'},
    ko: {cargo:'화물 도크 A', passenger:'여객 도크 B', repair:'수리 도크 C'},
    es: {cargo:'Muelle de carga A', passenger:'Muelle de pasajeros B', repair:'Muelle de reparación C'},
    'pt-BR': {cargo:'Doca de carga A', passenger:'Doca de passageiros B', repair:'Doca de reparo C'},
    fr: {cargo:'Quai cargo A', passenger:'Quai passagers B', repair:'Quai de réparation C'},
    de: {cargo:'Frachtdock A', passenger:'Passagierdock B', repair:'Reparaturdock C'},
    it: {cargo:'Molo cargo A', passenger:'Molo passeggeri B', repair:'Molo riparazioni C'},
    ru: {cargo:'Грузовой док A', passenger:'Пассажирский док B', repair:'Ремонтный док C'},
    hi: {cargo:'कार्गो डॉक A', passenger:'यात्री डॉक B', repair:'मरम्मत डॉक C'},
    ar: {cargo:'رصيف الشحن A', passenger:'رصيف الركاب B', repair:'رصيف الإصلاح C'},
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
  const skyportDynamicText = {
    en: {
      shift:'Shift {n}/30', objective:'Serve {done}/{goal} flights', errors:'Errors {done}/3', nodeProgress:'Nodes {done}/{goal}',
      dragHint:'Drag the airship, or press Enter and use arrow keys, to choose its dock.', routeRule:'Connect every numbered node in order.', routeRuleBlocked:'Connect every numbered node in order · avoid every red line',
      targetDestination:'Target: {flight} → {dock}', dockBadge:'GO: {dock}', dockMatched:'Dock matched.', flightSelected:'Flight selected. Choose a dock.', wrongDock:'Wrong dock: follow the target shown above.',
      routeCancelled:'Route cancelled. No error added.', routeStorm:'The route touched a red blocked airway.', routeSelf:'The route crossed its own line.', routeBeacon:'Connect every numbered node in order.',
      backToLobby:'Back to lobby', back:'Back', shiftSelection:'Shift selection', language:'Language',
    },
    'zh-Hant': {
      shift:'班次 {n}/30', objective:'完成 {done}/{goal} 架飛船', errors:'錯誤 {done}/3', nodeProgress:'節點 {done}/{goal}',
      dragHint:'拖曳飛船，或按 Enter 後用方向鍵選擇碼頭。', routeRule:'依序連接每個編號節點。', routeRuleBlocked:'依序連接每個編號節點 · 避開所有紅線',
      targetDestination:'目標：{flight} → {dock}', dockBadge:'前往 {dock}', dockMatched:'碼頭配對成功。', flightSelected:'已選擇飛船，請選擇碼頭。', wrongDock:'碼頭不對：請前往上方指定的碼頭。',
      routeCancelled:'航線已取消，不計入錯誤。', routeStorm:'航線碰到紅色禁行航線。', routeSelf:'航線不能與自己的線交叉。', routeBeacon:'必須按順序連接所有編號節點。',
      backToLobby:'回到大廳', back:'返回', shiftSelection:'班次選擇', language:'語言',
    },
    'zh-Hans': {
      shift:'班次 {n}/30', objective:'完成 {done}/{goal} 架飞船', errors:'错误 {done}/3', nodeProgress:'节点 {done}/{goal}',
      dragHint:'拖动飞艇，或按 Enter 后使用方向键选择码头。', routeRule:'按顺序连接每个编号节点。', routeRuleBlocked:'按顺序连接每个编号节点 · 避开所有红线',
      targetDestination:'目标：{flight} → {dock}', dockBadge:'前往 {dock}', dockMatched:'码头匹配成功。', flightSelected:'已选择飞艇，请选择码头。', wrongDock:'码头不对：请前往上方指定的码头。',
      routeCancelled:'航线已取消，不计入错误。', routeStorm:'航线碰到了红色禁行航线。', routeSelf:'航线不能与自己的线交叉。', routeBeacon:'必须按顺序连接所有编号节点。',
      backToLobby:'返回大厅', back:'返回', shiftSelection:'班次选择', language:'语言',
    },
    ja: {
      shift:'シフト {n}/30', objective:'{done}/{goal}便を運航', errors:'エラー {done}/3', nodeProgress:'ノード {done}/{goal}',
      dragHint:'飛行船をドラッグするか、Enterを押して矢印キーでドックを選択。', routeRule:'番号付きノードを順番にすべて接続。', routeRuleBlocked:'番号付きノードを順番にすべて接続 · 赤い線をすべて避ける',
      targetDestination:'目標：{flight} → {dock}', dockBadge:'移動先 {dock}', dockMatched:'ドックに正しく到着しました。', flightSelected:'飛行船を選択しました。ドックを選んでください。', wrongDock:'ドックが違います。上の目標ドックへ向かってください。',
      routeCancelled:'ルートをキャンセルしました。エラーは増えません。', routeStorm:'ルートが赤い通行禁止空路に触れました。', routeSelf:'ルートが自分自身と交差しました。', routeBeacon:'番号付きノードを順番に接続してください。',
      backToLobby:'ロビーに戻る', back:'戻る', shiftSelection:'シフト選択', language:'言語',
    },
    ko: {
      shift:'교대 {n}/30', objective:'비행선 {done}/{goal}대 처리', errors:'오류 {done}/3', nodeProgress:'노드 {done}/{goal}',
      dragHint:'비행선을 드래그하거나 Enter를 누른 뒤 화살표 키로 도크를 선택하세요.', routeRule:'번호가 있는 모든 노드를 순서대로 연결하세요.', routeRuleBlocked:'번호가 있는 모든 노드를 순서대로 연결하세요 · 모든 빨간 선을 피하세요',
      targetDestination:'목표: {flight} → {dock}', dockBadge:'이동: {dock}', dockMatched:'도크가 일치했습니다.', flightSelected:'비행선을 선택했습니다. 도크를 선택하세요.', wrongDock:'도크가 올바르지 않습니다. 위에 표시된 목표로 가세요.',
      routeCancelled:'경로를 취소했습니다. 오류가 추가되지 않았습니다.', routeStorm:'경로가 빨간 통행 금지 항로에 닿았습니다.', routeSelf:'경로가 자기 선과 교차했습니다.', routeBeacon:'모든 번호 노드를 순서대로 연결하세요.',
      backToLobby:'로비로 돌아가기', back:'뒤로', shiftSelection:'교대 선택', language:'언어',
    },
    es: {
      shift:'Turno {n}/30', objective:'Sirve {done}/{goal} vuelos', errors:'Errores {done}/3', nodeProgress:'Nodos {done}/{goal}',
      dragHint:'Arrastra la aeronave o pulsa Enter y usa las flechas para elegir el muelle.', routeRule:'Conecta todos los nodos numerados en orden.', routeRuleBlocked:'Conecta todos los nodos numerados en orden · evita todas las líneas rojas',
      targetDestination:'Objetivo: {flight} → {dock}', dockBadge:'IR a {dock}', dockMatched:'Muelle correcto.', flightSelected:'Aeronave seleccionada. Elige un muelle.', wrongDock:'Muelle incorrecto: sigue el objetivo mostrado arriba.',
      routeCancelled:'Ruta cancelada. No se añade ningún error.', routeStorm:'La ruta tocó una vía aérea roja bloqueada.', routeSelf:'La ruta se cruzó consigo misma.', routeBeacon:'Conecta todos los nodos numerados en orden.',
      backToLobby:'Volver al vestíbulo', back:'Atrás', shiftSelection:'Selección de turno', language:'Idioma',
    },
    'pt-BR': {
      shift:'Turno {n}/30', objective:'Atenda {done}/{goal} voos', errors:'Erros {done}/3', nodeProgress:'Nós {done}/{goal}',
      dragHint:'Arraste a aeronave ou pressione Enter e use as setas para escolher a doca.', routeRule:'Conecte todos os nós numerados em ordem.', routeRuleBlocked:'Conecte todos os nós numerados em ordem · evite todas as linhas vermelhas',
      targetDestination:'Alvo: {flight} → {dock}', dockBadge:'IR para {dock}', dockMatched:'Doca correta.', flightSelected:'Aeronave selecionada. Escolha uma doca.', wrongDock:'Doca errada: siga o alvo mostrado acima.',
      routeCancelled:'Rota cancelada. Nenhum erro foi adicionado.', routeStorm:'A rota tocou uma via aérea vermelha bloqueada.', routeSelf:'A rota cruzou a si mesma.', routeBeacon:'Conecte todos os nós numerados em ordem.',
      backToLobby:'Voltar ao lobby', back:'Voltar', shiftSelection:'Seleção de turno', language:'Idioma',
    },
    fr: {
      shift:'Shift {n}/30', objective:'Servir {done}/{goal} vols', errors:'Erreurs {done}/3', nodeProgress:'Nœuds {done}/{goal}',
      dragHint:'Faites glisser le dirigeable, ou appuyez sur Entrée puis utilisez les flèches pour choisir le quai.', routeRule:'Reliez tous les nœuds numérotés dans l’ordre.', routeRuleBlocked:'Reliez tous les nœuds numérotés dans l’ordre · évitez toutes les lignes rouges',
      targetDestination:'Cible : {flight} → {dock}', dockBadge:'ALLER à {dock}', dockMatched:'Quai correct.', flightSelected:'Dirigeable sélectionné. Choisissez un quai.', wrongDock:'Mauvais quai : suivez la cible affichée ci-dessus.',
      routeCancelled:'Route annulée. Aucune erreur ajoutée.', routeStorm:'La route a touché une voie aérienne rouge bloquée.', routeSelf:'La route a croisé sa propre ligne.', routeBeacon:'Reliez tous les nœuds numérotés dans l’ordre.',
      backToLobby:'Retour au lobby', back:'Retour', shiftSelection:'Sélection du shift', language:'Langue',
    },
    de: {
      shift:'Schicht {n}/30', objective:'Flüge: {done}/{goal}', errors:'Fehler {done}/3', nodeProgress:'Knoten {done}/{goal}',
      dragHint:'Ziehe das Luftschiff oder drücke Enter und wähle das Dock mit den Pfeiltasten.', routeRule:'Verbinde alle nummerierten Knoten der Reihe nach.', routeRuleBlocked:'Verbinde alle nummerierten Knoten der Reihe nach · meide alle roten Linien',
      targetDestination:'Ziel: {flight} → {dock}', dockBadge:'ZU {dock}', dockMatched:'Richtiges Dock.', flightSelected:'Luftschiff ausgewählt. Wähle ein Dock.', wrongDock:'Falsches Dock: Folge dem oben angezeigten Ziel.',
      routeCancelled:'Route abgebrochen. Kein Fehler hinzugefügt.', routeStorm:'Die Route berührte eine rote gesperrte Luftstraße.', routeSelf:'Die Route kreuzte sich selbst.', routeBeacon:'Verbinde alle nummerierten Knoten der Reihe nach.',
      backToLobby:'Zur Lobby', back:'Zurück', shiftSelection:'Schichtauswahl', language:'Sprache',
    },
    it: {
      shift:'Turno {n}/30', objective:'Servi {done}/{goal} voli', errors:'Errori {done}/3', nodeProgress:'Nodi {done}/{goal}',
      dragHint:'Trascina l’aeronave oppure premi Invio e usa le frecce per scegliere il molo.', routeRule:'Collega tutti i nodi numerati in ordine.', routeRuleBlocked:'Collega tutti i nodi numerati in ordine · evita tutte le linee rosse',
      targetDestination:'Obiettivo: {flight} → {dock}', dockBadge:'VAI a {dock}', dockMatched:'Molo corretto.', flightSelected:'Aeronave selezionata. Scegli un molo.', wrongDock:'Molo errato: segui l’obiettivo mostrato sopra.',
      routeCancelled:'Rotta annullata. Nessun errore aggiunto.', routeStorm:'La rotta ha toccato una via aerea rossa bloccata.', routeSelf:'La rotta ha attraversato se stessa.', routeBeacon:'Collega tutti i nodi numerati in ordine.',
      backToLobby:'Torna alla lobby', back:'Indietro', shiftSelection:'Selezione del turno', language:'Lingua',
    },
    ru: {
      shift:'Смена {n}/30', objective:'Обслужено рейсов: {done}/{goal}', errors:'Ошибки {done}/3', nodeProgress:'Узлы {done}/{goal}',
      dragHint:'Перетащите дирижабль или нажмите Enter и выберите док стрелками.', routeRule:'Соедините все пронумерованные узлы по порядку.', routeRuleBlocked:'Соедините все пронумерованные узлы по порядку · избегайте всех красных линий',
      targetDestination:'Цель: {flight} → {dock}', dockBadge:'К {dock}', dockMatched:'Док выбран верно.', flightSelected:'Дирижабль выбран. Выберите док.', wrongDock:'Неверный док: следуйте цели выше.',
      routeCancelled:'Маршрут отменён. Ошибок нет.', routeStorm:'Маршрут коснулся красного запрещённого воздушного пути.', routeSelf:'Маршрут пересёк сам себя.', routeBeacon:'Соедините все пронумерованные узлы по порядку.',
      backToLobby:'Вернуться в лобби', back:'Назад', shiftSelection:'Выбор смены', language:'Язык',
    },
    hi: {
      shift:'शिफ्ट {n}/30', objective:'{done}/{goal} उड़ानें पूरी करें', errors:'त्रुटियाँ {done}/3', nodeProgress:'नोड {done}/{goal}',
      dragHint:'एयरशिप खींचें, या Enter दबाकर तीर कुंजियों से डॉक चुनें।', routeRule:'सभी क्रमांकित नोड को क्रम से जोड़ें।', routeRuleBlocked:'सभी क्रमांकित नोड को क्रम से जोड़ें · सभी लाल रेखाओं से बचें',
      targetDestination:'लक्ष्य: {flight} → {dock}', dockBadge:'यहाँ जाएँ: {dock}', dockMatched:'सही डॉक।', flightSelected:'एयरशिप चुना गया। डॉक चुनें।', wrongDock:'गलत डॉक: ऊपर दिखाए गए लक्ष्य का पालन करें।',
      routeCancelled:'मार्ग रद्द। कोई त्रुटि नहीं जोड़ी गई।', routeStorm:'मार्ग लाल प्रतिबंधित वायुमार्ग से टकराया।', routeSelf:'मार्ग खुद को पार कर गया।', routeBeacon:'सभी क्रमांकित नोड को क्रम से जोड़ें।',
      backToLobby:'लॉबी पर लौटें', back:'वापस', shiftSelection:'शिफ्ट चयन', language:'भाषा',
    },
    ar: {
      shift:'المناوبة {n}/30', objective:'خدمة {done}/{goal} رحلات', errors:'الأخطاء {done}/3', nodeProgress:'العقد {done}/{goal}',
      dragHint:'اسحب المنطاد، أو اضغط Enter ثم استخدم الأسهم لاختيار الرصيف.', routeRule:'صِل كل العقد المرقمة بالترتيب.', routeRuleBlocked:'صِل كل العقد المرقمة بالترتيب · تجنب كل الخطوط الحمراء',
      targetDestination:'الهدف: {flight} ← {dock}', dockBadge:'اذهب إلى {dock}', dockMatched:'الرصيف مطابق.', flightSelected:'تم اختيار المنطاد. اختر رصيفًا.', wrongDock:'الرصيف غير صحيح: اتبع الهدف الظاهر أعلاه.',
      routeCancelled:'أُلغي المسار. لم تتم إضافة خطأ.', routeStorm:'لامس المسار ممرًا جويًا أحمر محظورًا.', routeSelf:'تقاطع المسار مع نفسه.', routeBeacon:'صِل كل العقد المرقمة بالترتيب.',
      backToLobby:'العودة إلى الردهة', back:'رجوع', shiftSelection:'اختيار المناوبة', language:'اللغة',
    },
  };
  Object.entries({
    en: {keyboardChooseDock:'Airship selected. Use arrow keys to choose a dock, then press Enter to dispatch. Escape cancels.'},
    'zh-Hant': {keyboardChooseDock:'已選擇飛船。用方向鍵選碼頭，按 Enter 調度；Escape 取消。'},
    'zh-Hans': {keyboardChooseDock:'已选择飞艇。使用方向键选择码头，然后按 Enter 调度。Escape 取消。'},
    ja: {keyboardChooseDock:'飛行船を選択しました。矢印キーでドックを選び、Enterでディスパッチ。Escapeでキャンセル。'},
    ko: {keyboardChooseDock:'비행선을 선택했습니다. 화살표 키로 도크를 선택한 후 Enter를 눌러 배차하세요. Escape로 취소합니다.'},
    es: {keyboardChooseDock:'Aeronave seleccionada. Usa las flechas para elegir un muelle, pulsa Enter para despachar. Escape cancela.'},
    'pt-BR': {keyboardChooseDock:'Aeronave selecionada. Use as setas para escolher uma doca e pressione Enter para despachar. Escape cancela.'},
    fr: {keyboardChooseDock:'Dirigeable sélectionné. Utilisez les flèches pour choisir un quai, puis appuyez sur Entrée pour répartir. Échap annule.'},
    de: {keyboardChooseDock:'Luftschiff ausgewählt. Wähle mit den Pfeiltasten ein Dock und drücke Enter zum Dispatch. Escape bricht ab.'},
    it: {keyboardChooseDock:'Aeronave selezionata. Usa le frecce per scegliere un molo, poi premi Invio per il dispatch. Escape annulla.'},
    ru: {keyboardChooseDock:'Дирижабль выбран. Выберите док стрелками и нажмите Enter для отправки. Escape отменяет выбор.'},
    hi: {keyboardChooseDock:'एयरशिप चुना गया। तीर कुंजियों से डॉक चुनें, फिर डिस्पैच के लिए Enter दबाएँ। Escape रद्द करता है।'},
    ar: {keyboardChooseDock:'تم اختيار المنطاد. استخدم الأسهم لاختيار الرصيف، ثم اضغط Enter للإرسال. يلغي Escape العملية.'},
  }).forEach(([localeKey, copy]) => Object.assign(skyportDynamicText[localeKey] || (skyportDynamicText[localeKey] = {}), copy));
  // Keyboard dock feedback is game-owned dynamic copy. Keep every required
  // locale complete so the assistive aria-label never falls back to English.
  Object.entries({
    en: { keyboardDockCorrect:'{dock}. Correct target for {flight}. Press Enter to dispatch. Fuel {fuel} to {remaining}.', keyboardDockWrong:'{dock}. Wrong target for {flight}; the correct target is {target}. Pressing Enter now adds 1 Error.', keyboardDockBlocked:'{dock}. Correct target for {flight}, but {step}. Pressing Enter now adds 1 Error.' },
    'zh-Hant': { keyboardDockCorrect:'{dock}。這是{flight}的正確目標。按 Enter 調度；燃料 {fuel} → {remaining}。', keyboardDockWrong:'{dock}。這不是{flight}的正確目標；正確目標是{target}。現在按 Enter 會增加 1 次錯誤。', keyboardDockBlocked:'{dock}。這是{flight}的正確目標，但{step}。現在按 Enter 會增加 1 次錯誤。' },
    'zh-Hans': { keyboardDockCorrect:'{dock}。这是{flight}的正确目标。按 Enter 调度；燃料 {fuel} → {remaining}。', keyboardDockWrong:'{dock}。这不是{flight}的正确目标；正确目标是{target}。现在按 Enter 会增加 1 次错误。', keyboardDockBlocked:'{dock}。这是{flight}的正确目标，但{step}。现在按 Enter 会增加 1 次错误。' },
    ja: { keyboardDockCorrect:'{dock}。{flight}の正しい目標です。Enterで出発。燃料 {fuel} → {remaining}。', keyboardDockWrong:'{dock}。{flight}の目標ではありません。正しい目標は{target}です。Enterでエラーが1増えます。', keyboardDockBlocked:'{dock}。{flight}の目標ですが、{step}。Enterでエラーが1増えます。' },
    ko: { keyboardDockCorrect:'{dock}. {flight}의 올바른 목표입니다. Enter로 출발하세요. 연료 {fuel} → {remaining}.', keyboardDockWrong:'{dock}. {flight}의 목표가 아닙니다. 올바른 목표는 {target}입니다. Enter를 누르면 오류가 1 증가합니다.', keyboardDockBlocked:'{dock}. {flight}의 목표지만 {step}. Enter를 누르면 오류가 1 증가합니다.' },
    es: { keyboardDockCorrect:'{dock}. Objetivo correcto para {flight}. Pulsa Enter para despachar. Combustible {fuel} → {remaining}.', keyboardDockWrong:'{dock}. Objetivo incorrecto para {flight}; el objetivo correcto es {target}. Pulsar Enter suma 1 error.', keyboardDockBlocked:'{dock}. Objetivo correcto para {flight}, pero {step}. Pulsar Enter suma 1 error.' },
    'pt-BR': { keyboardDockCorrect:'{dock}. Alvo correto para {flight}. Pressione Enter para despachar. Combustível {fuel} → {remaining}.', keyboardDockWrong:'{dock}. Alvo errado para {flight}; o alvo correto é {target}. Pressionar Enter adiciona 1 erro.', keyboardDockBlocked:'{dock}. Alvo correto para {flight}, mas {step}. Pressionar Enter adiciona 1 erro.' },
    fr: { keyboardDockCorrect:'{dock}. Cible correcte pour {flight}. Appuyez sur Entrée pour répartir. Carburant {fuel} → {remaining}.', keyboardDockWrong:'{dock}. Mauvaise cible pour {flight} ; la bonne cible est {target}. Entrée ajoute 1 erreur.', keyboardDockBlocked:'{dock}. Cible correcte pour {flight}, mais {step}. Entrée ajoute 1 erreur.' },
    de: { keyboardDockCorrect:'{dock}. Richtiges Ziel für {flight}. Drücke Enter zum Dispatch. Treibstoff {fuel} → {remaining}.', keyboardDockWrong:'{dock}. Falsches Ziel für {flight}; das richtige Ziel ist {target}. Enter fügt 1 Fehler hinzu.', keyboardDockBlocked:'{dock}. Richtiges Ziel für {flight}, aber {step}. Enter fügt 1 Fehler hinzu.' },
    it: { keyboardDockCorrect:'{dock}. Obiettivo corretto per {flight}. Premi Invio per il dispatch. Carburante {fuel} → {remaining}.', keyboardDockWrong:'{dock}. Obiettivo errato per {flight}; quello corretto è {target}. Invio aggiunge 1 errore.', keyboardDockBlocked:'{dock}. Obiettivo corretto per {flight}, ma {step}. Invio aggiunge 1 errore.' },
    ru: { keyboardDockCorrect:'{dock}. Верная цель для {flight}. Нажмите Enter для отправки. Топливо {fuel} → {remaining}.', keyboardDockWrong:'{dock}. Неверная цель для {flight}; верная цель — {target}. Enter добавит 1 ошибку.', keyboardDockBlocked:'{dock}. Верная цель для {flight}, но {step}. Enter добавит 1 ошибку.' },
    hi: { keyboardDockCorrect:'{dock}। {flight} के लिए सही लक्ष्य। भेजने के लिए Enter दबाएँ। ईंधन {fuel} → {remaining}।', keyboardDockWrong:'{dock}। {flight} के लिए गलत लक्ष्य; सही लक्ष्य {target} है। Enter दबाने पर 1 त्रुटि बढ़ेगी।', keyboardDockBlocked:'{dock}। {flight} का सही लक्ष्य है, लेकिन {step}। Enter दबाने पर 1 त्रुटि बढ़ेगी।' },
    ar: { keyboardDockCorrect:'{dock}. الهدف الصحيح لـ {flight}. اضغط Enter للإرسال. الوقود {fuel} ← {remaining}.', keyboardDockWrong:'{dock}. هذا ليس هدف {flight} الصحيح؛ الهدف الصحيح هو {target}. الضغط على Enter يضيف خطأً واحداً.', keyboardDockBlocked:'{dock}. هذا هدف {flight} الصحيح، لكن {step}. الضغط على Enter يضيف خطأً واحداً.' },
  }).forEach(([localeKey, copy]) => Object.assign(skyportDynamicText[localeKey] || (skyportDynamicText[localeKey] = {}), copy));
  const skyportUiText = {
    'zh-Hant': {title:'動物天空港調度隊', headline:'讓雲線天空港持續運作。', intro:'繪出安全航線，配對飛船與碼頭，保護班次不被壅塞。', start:'開始調度', chooseShift:'選擇班次', best:'最佳班次：{n}', stageReady:'可開始', stageLocked:'未解鎖', stageReplay:'可重玩', menu:'回主選單', shifts:'班次選擇', next:'下一班', retry:'重試班次', win:'班次完成！', lose:'天空港壅塞！', winCopy:'清晰調度為天空港寫下新紀錄。', loseCopy:'三次不安全進場關閉了班次，重試免費。', nextShiftPreview:'下一班 {shift}：完成 {goal} 架飛船 · {rule}', guideTitle:'如何調度', guideBody:'選擇班次、依序連接編號節點；出現紅色封鎖航線時避開，再將每艘飛船引導到相符碼頭。'},
    'zh-Hans': {title:'动物天空港调度队', headline:'让云线天空港持续运作。', intro:'绘出安全航线，匹配飞艇与码头，保护班次不被拥堵。', start:'开始调度', chooseShift:'选择班次', best:'最佳班次：{n}', stageReady:'可开始', stageLocked:'未解锁', stageReplay:'可重玩', menu:'返回主菜单', shifts:'班次选择', next:'下一班', retry:'重试班次', win:'班次完成！', lose:'天空港拥堵！', winCopy:'清晰调度为天空港写下新纪录。', loseCopy:'三次不安全进场结束了班次，重试免费。', nextShiftPreview:'下一班 {shift}：完成 {goal} 架飞艇 · {rule}', guideTitle:'如何调度', guideBody:'选择班次，按顺序连接编号节点；出现红色封锁航线时避开，再将每艘飞艇引导到匹配码头。'},
    ja: {title:'動物スカイポート・ディスパッチ', headline:'クラウドライン空港を動かし続けよう。', intro:'安全なルートを描き、飛行船をドックへ振り分け、混雑からシフトを守ります。', start:'ディスパッチ開始', chooseShift:'シフトを選択', best:'ベストシフト：{n}', stageReady:'開始可能', stageLocked:'ロック中', stageReplay:'リプレイ', menu:'メインメニュー', shifts:'シフト選択', next:'次のシフト', retry:'シフトをリトライ', win:'シフト完了！', lose:'スカイポート混雑！', winCopy:'正確な運航で新記録を更新しました。', loseCopy:'3回の危険な到着でシフト終了。リトライは無料です。', nextShiftPreview:'次のシフト {shift}：{goal}便を運航 · {rule}', guideTitle:'ディスパッチ方法', guideBody:'シフトを選び、番号付きノードを順番に接続。赤い通行禁止空路がある場合は避け、各飛行船を対応するドックへ導きます。'},
    ko: {title:'동물 스카이포트 디스패치', headline:'클라우드라인 스카이포트를 계속 움직이세요.', intro:'안전한 경로를 그리고 비행선을 도크에 배정해 혼잡으로부터 교대를 지키세요.', start:'배차 시작', chooseShift:'교대 선택', best:'최고 교대: {n}', stageReady:'시작 가능', stageLocked:'잠김', stageReplay:'다시 플레이', menu:'메인 메뉴', shifts:'교대 선택', next:'다음 교대', retry:'교대 재시도', win:'교대 완료!', lose:'스카이포트 혼잡!', winCopy:'정확한 운항으로 새 기록을 세웠습니다.', loseCopy:'위험한 도착 세 번으로 교대가 종료되었습니다. 재시도는 무료입니다.', nextShiftPreview:'다음 교대 {shift}: 비행선 {goal}대 처리 · {rule}', guideTitle:'배차 방법', guideBody:'교대를 선택하고 번호 노드를 순서대로 연결하세요. 빨간 통행 금지 항로가 나타나면 피하고 각 비행선을 맞는 도크로 안내하세요.'},
    es: {title:'Despacho de animales Skyport', headline:'Mantén Skyport Cloudline en movimiento.', intro:'Dibuja rutas seguras, empareja aeronaves con muelles y protege el turno de la congestión.', start:'Iniciar despacho', chooseShift:'Elegir turno', best:'Mejor turno: {n}', stageReady:'Listo', stageLocked:'Bloqueado', stageReplay:'Repetir', menu:'Menú principal', shifts:'Turnos', next:'Siguiente turno', retry:'Reintentar turno', win:'¡Turno completado!', lose:'¡Skyport congestionado!', winCopy:'Una ruta clara establece un nuevo récord del Skyport.', loseCopy:'Tres llegadas inseguras cerraron el turno. Reintentar es gratis.', nextShiftPreview:'Siguiente turno {shift}: sirve {goal} vuelos · {rule}', guideTitle:'Cómo despachar', guideBody:'Elige un turno, conecta los nodos numerados en orden, evita las vías aéreas rojas bloqueadas y guía cada aeronave a su muelle.'},
    'pt-BR': {title:'Despacho de animais Skyport', headline:'Mantenha o Skyport Cloudline em movimento.', intro:'Desenhe rotas seguras, combine aeronaves com docas e proteja o turno do congestionamento.', start:'Iniciar despacho', chooseShift:'Escolher turno', best:'Melhor turno: {n}', stageReady:'Pronto', stageLocked:'Bloqueado', stageReplay:'Jogar novamente', menu:'Menu principal', shifts:'Turnos', next:'Próximo turno', retry:'Repetir turno', win:'Turno concluído!', lose:'Skyport congestionado!', winCopy:'Uma rota clara cria um novo recorde no Skyport.', loseCopy:'Três chegadas inseguras encerraram o turno. Repetir é grátis.', nextShiftPreview:'Próximo turno {shift}: atenda {goal} voos · {rule}', guideTitle:'Como despachar', guideBody:'Escolha um turno, conecte os nós numerados em ordem, evite as vias aéreas vermelhas e guie cada aeronave até sua doca.'},
    fr: {title:'Dispatch animal Skyport', headline:'Gardez le Skyport Cloudline en mouvement.', intro:'Tracez des routes sûres, associez les dirigeables aux quais et protégez le shift contre la congestion.', start:'Lancer la répartition', chooseShift:'Choisir un shift', best:'Meilleur shift : {n}', stageReady:'Prêt', stageLocked:'Verrouillé', stageReplay:'Rejouer', menu:'Menu principal', shifts:'Shifts', next:'Shift suivant', retry:'Rejouer le shift', win:'Shift terminé !', lose:'Skyport congestionné !', winCopy:'Une route claire établit un nouveau record du Skyport.', loseCopy:'Trois arrivées dangereuses ont fermé le shift. Rejouer est gratuit.', nextShiftPreview:'Shift suivant {shift} : servir {goal} vols · {rule}', guideTitle:'Comment répartir', guideBody:'Choisissez un shift, reliez les nœuds numérotés dans l’ordre, évitez les voies rouges bloquées et guidez chaque dirigeable vers son quai.'},
    de: {title:'Tierischer Skyport-Dispatch', headline:'Halte den Cloudline-Skyport in Bewegung.', intro:'Zeichne sichere Routen, ordne Luftschiffe Docks zu und schütze die Schicht vor Staus.', start:'Dispatch starten', chooseShift:'Schicht wählen', best:'Beste Schicht: {n}', stageReady:'Bereit', stageLocked:'Gesperrt', stageReplay:'Erneut spielen', menu:'Hauptmenü', shifts:'Schichten', next:'Nächste Schicht', retry:'Schicht wiederholen', win:'Schicht abgeschlossen!', lose:'Skyport überlastet!', winCopy:'Eine klare Route bringt einen neuen Skyport-Rekord.', loseCopy:'Drei unsichere Ankünfte beendeten die Schicht. Wiederholen ist kostenlos.', nextShiftPreview:'Nächste Schicht {shift}: {goal} Flüge bedienen · {rule}', guideTitle:'So dispatchst du', guideBody:'Wähle eine Schicht, verbinde nummerierte Knoten der Reihe nach, meide rote gesperrte Luftstraßen und führe jedes Luftschiff zum passenden Dock.'},
    it: {title:'Dispatch del porto celeste animale', headline:'Mantieni in movimento il porto celeste Cloudline.', intro:'Disegna rotte sicure, abbina le aeronavi ai moli e proteggi il turno dalla congestione.', start:'Avvia dispacciamento', chooseShift:'Scegli turno', best:'Turno migliore: {n}', stageReady:'Pronto', stageLocked:'Bloccato', stageReplay:'Rigioca', menu:'Menu principale', shifts:'Turni', next:'Turno successivo', retry:'Ripeti turno', win:'Turno completato!', lose:'Porto celeste congestionato!', winCopy:'Una rotta chiara stabilisce un nuovo record.', loseCopy:'Tre arrivi non sicuri hanno chiuso il turno. Riprova gratis.', nextShiftPreview:'Turno successivo {shift}: servi {goal} voli · {rule}', guideTitle:'Come effettuare il dispatch', guideBody:'Scegli un turno, collega i nodi numerati in ordine, evita le vie aeree rosse bloccate e guida ogni aeronave al molo corretto.'},
    ru: {title:'Диспетчерская Skyport для животных', headline:'Поддерживайте движение аэропорта Cloudline.', intro:'Рисуйте безопасные маршруты, направляйте дирижабли к докам и защищайте смену от заторов.', start:'Начать диспетчеризацию', chooseShift:'Выбрать смену', best:'Лучшая смена: {n}', stageReady:'Готово', stageLocked:'Закрыто', stageReplay:'Повторить', menu:'Главное меню', shifts:'Смены', next:'Следующая смена', retry:'Повторить смену', win:'Смена завершена!', lose:'Аэропорт Skyport перегружен!', winCopy:'Чёткий маршрут установил новый рекорд.', loseCopy:'Три небезопасных прибытия завершили смену. Повтор бесплатен.', nextShiftPreview:'Следующая смена {shift}: обслужить рейсов — {goal} · {rule}', guideTitle:'Как диспетчеризировать', guideBody:'Выберите смену, соединяйте пронумерованные узлы по порядку, избегайте красных запрещённых путей и ведите каждый дирижабль к нужному доку.'},
    hi: {title:'पशु स्काईपोर्ट डिस्पैच', headline:'क्लाउडलाइन स्काईपोर्ट को गतिशील रखें।', intro:'सुरक्षित मार्ग बनाएँ, एयरशिप को डॉक से मिलाएँ और शिफ्ट को भीड़ से बचाएँ।', start:'डिस्पैच शुरू करें', chooseShift:'शिफ्ट चुनें', best:'सर्वश्रेष्ठ शिफ्ट: {n}', stageReady:'तैयार', stageLocked:'लॉक', stageReplay:'फिर खेलें', menu:'मुख्य मेनू', shifts:'शिफ्ट', next:'अगली शिफ्ट', retry:'शिफ्ट फिर से खेलें', win:'शिफ्ट पूरी!', lose:'स्काईपोर्ट में भीड़!', winCopy:'साफ़ मार्ग ने स्काईपोर्ट का नया रिकॉर्ड बनाया।', loseCopy:'तीन असुरक्षित आगमन से शिफ्ट बंद हो गई। फिर से खेलना मुफ़्त है।', nextShiftPreview:'अगली शिफ्ट {shift}: {goal} उड़ानें पूरी करें · {rule}', guideTitle:'डिस्पैच कैसे करें', guideBody:'शिफ्ट चुनें, क्रमांकित नोड को क्रम से जोड़ें, लाल प्रतिबंधित वायुमार्ग से बचें और हर एयरशिप को सही डॉक तक पहुँचाएँ।'},
    ar: {title:'إرسال سكايبورت الحيوان', headline:'حافظ على حركة ميناء كلاودلاين الجوي.', intro:'ارسم مسارات آمنة، وطابق المناطيد مع الأرصفة، واحمِ المناوبة من الازدحام.', start:'ابدأ الإرسال', chooseShift:'اختر المناوبة', best:'أفضل مناوبة: {n}', stageReady:'جاهزة', stageLocked:'مغلقة', stageReplay:'إعادة اللعب', menu:'القائمة الرئيسية', shifts:'المناوبات', next:'المناوبة التالية', retry:'إعادة المناوبة', win:'اكتملت المناوبة!', lose:'ازدحم سكايبورت!', winCopy:'سجّل التوجيه الواضح رقمًا قياسيًا جديدًا للميناء.', loseCopy:'أنهت ثلاث وصولات غير آمنة المناوبة. إعادة المحاولة مجانية.', nextShiftPreview:'المناوبة التالية {shift}: خدمة {goal} رحلات · {rule}', guideTitle:'كيفية الإرسال', guideBody:'اختر مناوبة، وصِل العقد المرقمة بالترتيب، وتجنب الممرات الجوية الحمراء المحظورة، ووجّه كل منطاد إلى رصيفه المطابق.'},
  };
  const skyportStageText = {
    'zh-Hant': {medals:'勳章 {n}/3', contractDescription:'優先合約：無錯誤完成可獲得 20 天空幣。', insurance:'保險 5 鑽石', insuranceSelect:'請先勾選優先合約，再購買保險。', insuranceLabel:'保護本次合約的 20 天空幣獎勵。花費 5 顆鑽石。'},
    'zh-Hans': {medals:'勋章 {n}/3', contractDescription:'优先合约：无错误完成可获得 20 天空币。', insurance:'保险 5 钻石', insuranceSelect:'请先勾选优先合约，再购买保险。', insuranceLabel:'保护本次合约的 20 天空币奖励。花费 5 颗钻石。'},
    ja: {medals:'メダル {n}/3', contractDescription:'優先契約：ミスなしで完了するとスカイコイン20枚。', insurance:'保険 5ダイヤ', insuranceSelect:'保険を購入する前に優先契約を選択してください。', insuranceLabel:'失敗時に契約のスカイコイン20枚ボーナスを守ります。ダイヤ5個。'},
    ko: {medals:'메달 {n}/3', contractDescription:'우선 계약: 오류 없이 완료하면 스카이 코인 20개를 받습니다.', insurance:'보험 5 다이아', insuranceSelect:'보험을 구매하기 전에 우선 계약을 선택하세요.', insuranceLabel:'실패 시 계약 보너스 스카이 코인 20개를 보호합니다. 다이아 5개가 필요합니다.'},
    es: {medals:'Medallas {n}/3', contractDescription:'Contrato prioritario: termina sin errores para obtener 20 monedas celestes.', insurance:'Asegurar 5 diamantes', insuranceSelect:'Selecciona el contrato prioritario antes de comprar el seguro.', insuranceLabel:'Protege las 20 monedas del contrato si fallas. Cuesta 5 diamantes.'},
    'pt-BR': {medals:'Medalhas {n}/3', contractDescription:'Contrato prioritário: termine sem erros para ganhar 20 moedas celestes.', insurance:'Segurar 5 diamantes', insuranceSelect:'Selecione o contrato prioritário antes de comprar o seguro.', insuranceLabel:'Protege o bônus de 20 moedas do contrato em caso de falha. Custa 5 diamantes.'},
    fr: {medals:'Médailles {n}/3', contractDescription:'Contrat prioritaire : terminez sans erreur pour gagner 20 pièces célestes.', insurance:'Assurer 5 diamants', insuranceSelect:'Sélectionnez le contrat prioritaire avant d’acheter l’assurance.', insuranceLabel:'Protège le bonus de 20 pièces du contrat en cas d’échec. Coûte 5 diamants.'},
    de: {medals:'Medaillen {n}/3', contractDescription:'Prioritätsvertrag: Schließe die Schicht ohne Fehler für 20 Himmelsmünzen ab.', insurance:'5 Diamanten versichern', insuranceSelect:'Wähle den Prioritätsvertrag, bevor du die Versicherung kaufst.', insuranceLabel:'Schützt den Vertragsbonus von 20 Himmelsmünzen bei einem Fehlschlag. Kostet 5 Diamanten.'},
    it: {medals:'Medaglie {n}/3', contractDescription:'Contratto prioritario: completa senza errori per ottenere 20 monete celesti.', insurance:'Assicura 5 diamanti', insuranceSelect:'Seleziona il contratto prioritario prima di acquistare l’assicurazione.', insuranceLabel:'Protegge il bonus di 20 monete del contratto in caso di fallimento. Costa 5 diamanti.'},
    ru: {medals:'Медали {n}/3', contractDescription:'Приоритетный контракт: завершите без ошибок и получите 20 небесных монет.', insurance:'Страховка за 5 алмазов', insuranceSelect:'Выберите приоритетный контракт перед покупкой страховки.', insuranceLabel:'Защищает бонус контракта в 20 небесных монет при провале. Стоит 5 алмазов.'},
    hi: {medals:'पदक {n}/3', contractDescription:'प्राथमिकता अनुबंध: बिना त्रुटि पूरा करें और 20 स्काई कॉइन पाएँ।', insurance:'5 डायमंड का बीमा', insuranceSelect:'बीमा खरीदने से पहले प्राथमिकता अनुबंध चुनें।', insuranceLabel:'असफलता पर 20 स्काई कॉइन के अनुबंध बोनस को बचाता है। कीमत 5 डायमंड।'},
    ar: {medals:'الأوسمة {n}/3', contractDescription:'العقد ذو الأولوية: أكمل دون أخطاء لتحصل على 20 عملة سماء إضافية.', insurance:'تأمين 5 ماسات', insuranceSelect:'اختر العقد ذا الأولوية قبل شراء التأمين.', insuranceLabel:'يحمي مكافأة العقد البالغة 20 عملة سماء عند الفشل. التكلفة 5 ماسات.'},
  };
  const activeLocale = () => {
    const routeLocale = document.documentElement.lang;
    if (routeLocale && skyportDynamicText[routeLocale]) return routeLocale;
    const runtimeLocale = window.WonderI18n?.actualLocale?.();
    if (runtimeLocale && skyportDynamicText[runtimeLocale]) return runtimeLocale;
    const storedLocale = readStorage('weightPlayLocale');
    return skyportDynamicText[storedLocale] ? storedLocale : 'en';
  };
  const t = (key, values = {}) => {
    const template = skyportDynamicText[activeLocale()]?.[key] ?? skyportUiText[activeLocale()]?.[key] ?? skyportStageText[activeLocale()]?.[key] ?? strings[locale]?.[key] ?? strings.en?.[key] ?? key;
    return Object.entries(values).reduce((value, [name, replacement]) => String(value).replace(`{${name}}`, replacement), template);
  };
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
    const activeLocale = window.WonderI18n?.actualLocale?.() || readStorage('weightPlayLocale') || document.documentElement.lang || 'en';
    document.documentElement.lang = activeLocale;
    document.title = `${t('title')} | WeightPlay`;
    document.querySelectorAll('[data-i18n]').forEach((node) => { node.textContent = t(node.dataset.i18n); });
    $('localeSelect').value = activeLocale;
    $('mainProgress').textContent = t('best', {n:save.best || 1});
    $('localeSelect').options[1].textContent = '\u7e41\u9ad4\u4e2d\u6587';
    document.querySelector('.home-link').setAttribute('aria-label', t('backToLobby'));
    document.querySelector('.cover').alt = t('coverAlt');
    $('startBtn').textContent = startLabels[activeLocale] || startLabels.en;
    $('stageBack').setAttribute('aria-label', t('back'));
    $('battleBack').setAttribute('aria-label', t('back'));
    $('stageRail').setAttribute('aria-label', t('shiftSelection'));
    syncSoundToggle();
    renderContractControls();
    renderStages();
  }
  function setBattleHelp(open) {
    const button = $('battleHelp');
    const popover = $('battleHelpPopover');
    if (!button || !popover) return;
    popover.classList.toggle('hidden', !open);
    button.setAttribute('aria-expanded', String(open));
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
    const active = activeLocale();
    const labels = {
      flights:flightLabels[active] || flightLabels.en,
      docks:dockLabels[active] || dockLabels.en,
    };
    const flightName = labels.flights[state.kind];
    const dockName = labels.docks[state.dock];
    document.querySelector('.task-destination').textContent = t('targetDestination', {flight:flightName, dock:dockName});
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
      dock.querySelector('.dock-target-badge').textContent = isTarget ? t('dockBadge', {dock:dockName.at(-1)}) : '';
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
    setBattleHelp(false);
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
    setBattleHelp(false);
    show('result');
    if (win) playSound('win');
    $('resultTitle').textContent = win ? t('win') : t('lose');
    $('resultCopy').textContent = win ? t('winCopy') : (state.lastError || t('loseCopy'));
    const activeLocale = window.WonderI18n?.actualLocale?.() || readStorage('weightPlayLocale') || document.documentElement.lang || 'en';
    const resultLabels = resultLabelsByLocale[activeLocale] || resultLabelsByLocale.en;
    const totalLabel = (value) => `${resultLabels.total} ${value}`;
    const coinReward = shiftConfig[state.shift].coin + (state.contract && state.errors === 0 ? 20 : 0);
    const unlockEvidence = state.shift < TOTAL_SHIFTS ? resultLabels.shiftUnlocked.replace('{n}', state.shift + 1) : resultLabels.allShiftsComplete;
    $('resultRewards').innerHTML = win
      ? `<span>${resultLabels.reputation} +${state.done * 5} · ${totalLabel(save.reputation)}</span><span>${resultLabels.coins} +${coinReward} · ${totalLabel(save.coins)}</span><span>${resultLabels.blueprintStamps} +${shiftConfig[state.shift].stamps} · ${totalLabel(save.stamps)}</span><span>${resultLabels.medals} ${save.medals[state.shift] || 1}/3</span><span>${unlockEvidence}</span>`
      : `<span>${resultLabels.safe} ${state.done}/${state.goal}</span><span>${resultLabels.errors} ${state.errors}/3</span><span>${insuredRun ? `${resultLabels.protected} +20 · ${totalLabel(save.coins)}` : resultLabels.retry}</span>`;
    const terminalWin = win && state.shift >= TOTAL_SHIFTS;
    resultActionClaimed = false;
    const nextAvailable = win && !terminalWin;
    const nextPreview = $('nextShiftPreview');
    if (nextPreview) {
      nextPreview.textContent = nextAvailable
        ? t('nextShiftPreview', {shift: state.shift + 1, goal: shiftConfig[state.shift + 1].goal, rule: t(shiftConfig[state.shift + 1].barriers ? 'routeRuleBlocked' : 'routeRule')})
        : '';
    }
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
      $('feedback').textContent = t('dockMatched');
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
      state.lastError = state.routeViolation==='barrier'?t('routeStorm'):state.routeViolation==='self'?t('routeSelf'):state.routeViolation==='beacon'?t('routeBeacon'):t('wrongDock');
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
  $('battleHelp').onclick = () => setBattleHelp($('battleHelpPopover').classList.contains('hidden'));
  $('battleHelp').addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { event.preventDefault(); setBattleHelp(false); }
  });
  $('battleHelpPopover').addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { event.preventDefault(); setBattleHelp(false); $('battleHelp').focus({preventScroll:true}); }
  });
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
    $('feedback').textContent = t('flightSelected');
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
