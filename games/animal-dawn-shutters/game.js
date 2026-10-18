(function () {
  "use strict";
  /* WP-GAME-ANALYTICS-ADAPTER */
  // Only replayable lifecycle signals live here; all metrics/timers/GA4 stay shared.
  const __wpMeasurement = { screen: null, roundKey: null, started: false, ended: false, restart: false, outcome: "complete" };
  const __wpReadMeasurement = () => ({ ...__wpMeasurement,
    screen: ((({main:"main",stage:"stage",battle:"battle",})[state.screen] ?? null) === "battle" && (__wpMeasurement.ended)) ? null : (({main:"main",stage:"stage",battle:"battle",})[state.screen] ?? null), ended: Boolean(__wpMeasurement.ended), outcome: __wpMeasurement.outcome,
    paused: Boolean(state?.paused || state?.suspended), node: document.body,
    activityMode: "input", idleSeconds: 300
  });
  function __wpNotifyMeasurement() { try { window.WonderAnalytics?.game?.observeState(__wpReadMeasurement); } catch { /* Optional telemetry. */ } }
  // Explicit authored replay actions count only when a new round was actually created.
  function __wpReplayStart(action) {
    const previous = __wpMeasurement.roundKey, value = action();
    if (__wpMeasurement.roundKey !== previous) { __wpMeasurement.restart = true; __wpNotifyMeasurement(); }
    return value;
  }
  window.addEventListener("weightplay:analytics-ready", __wpNotifyMeasurement);
  __wpNotifyMeasurement();

  const localeMap = window.DAWN_SHUTTERS_LOCALES || {};
  const upgradeKeys = ['goal','tap','matched','liveMatch','mission','linked','independent','chapterLabel','hint','hintMove','moves','allMatched','mismatch','ready','moveHint','check','par','roomCleared','leaveTitle','leaveCopy','continue'];
  const upgradeCopy = {
    en: ['Goal','Tap to change','Matched','{count}/3 matched','Match each window to its goal.','Linked windows','Independent windows','Dawn chapter {number}','A little hint','Try window {number}. Follow its arrow: linked windows move too.','{count} moves','All three match! Let the morning in.','Compare the goal above each window. Your settings are kept.','Tap a window: closed → slit → open. Match all three goals.','Arrows show which other window changes with your tap.','Let the morning in','Perfect route: {count} moves','Room {number} is glowing. A new morning awaits.','Leave this room?','Room {number} will restart. Cleared rooms and best results stay saved.','Keep playing'],
    'zh-Hant': ['目標','點一下調光','已對上','已對上 {count}/3','把每扇窗調成上方的目標光線。','連動窗','獨立調光','晨光篇章 {number}','給我一點提示','試著點第 {number} 扇窗；箭頭指向的窗也會一起改變。','{count} 步','三扇都對上了！讓晨光灑進來。','看看每扇窗上方的目標；目前的調整都會保留。','點窗戶：關閉 → 細縫 → 打開，讓三扇窗都符合目標。','箭頭表示連動方向；點一扇窗，另一扇也會跟著變。','讓晨光灑進來','最佳路線：{count} 步','第 {number} 房亮起來了，下一個清晨等著你。','離開這間房？','第 {number} 房的調整會重來；已完成房間與最佳成績會保留。','繼續調光'],
    'zh-Hans': ['目标','点一下调光','已对上','已对上 {count}/3','把每扇窗调成上方的目标光线。','联动窗','独立调光','晨光篇章 {number}','给我一点提示','试着点第 {number} 扇窗；箭头指向的窗也会一起改变。','{count} 步','三扇都对上了！让晨光洒进来。','看看每扇窗上方的目标；目前的调整都会保留。','点窗户：关闭 → 细缝 → 打开，让三扇窗都符合目标。','箭头表示联动方向；点一扇窗，另一扇也会跟着变。','让晨光洒进来','最佳路线：{count} 步','第 {number} 房亮起来了，下一个清晨等着你。','离开这间房？','第 {number} 房的调整会重来；已完成房间与最佳成绩会保留。','继续调光'],
    ja: ['目標','タップで調整','一致','{count}/3 一致','窓ごとの目標の光に合わせよう。','連動する窓','独立した窓','朝の章 {number}','ヒント','窓 {number} を押そう。矢印の先の窓も動くよ。','{count} 手','全部そろった！朝の光を入れよう。','窓の上の目標を確認しよう。今の状態はそのまま。','窓をタップ：閉じる → すき間 → 開く。','矢印の先の窓も一緒に変わるよ。','朝の光を入れる','最短：{count} 手','部屋 {number} が明るくなった。次の朝へ。','この部屋を出る？','部屋 {number} は最初から。クリア済みの部屋と記録は残る。','続ける'],
    ko: ['목표','눌러 조절','일치','{count}/3 일치','각 창을 위에 표시된 목표에 맞추세요.','연결된 창','독립된 창','새벽 장 {number}','힌트','{number}번 창을 눌러 보세요. 화살표가 가리키는 창도 바뀝니다.','{count}회','모두 맞았어요! 아침 햇살을 들이세요.','창 위의 목표를 확인하세요. 현재 상태는 유지됩니다.','창을 누르면 닫힘 → 틈 → 열림 순서로 바뀝니다.','화살표가 가리키는 창도 함께 바뀝니다.','햇살 들이기','최단: {count}회','{number}번 방이 밝아졌어요. 다음 아침으로!','이 방을 나갈까요?','{number}번 방은 처음부터 시작합니다. 완료한 방과 기록은 저장됩니다.','계속하기'],
    es: ['Meta','Toca para cambiar','Coincide','{count}/3 coinciden','Ajusta cada ventana a su meta.','Ventanas conectadas','Ventanas independientes','Capítulo {number}','Una pista','Prueba la ventana {number}. La flecha indica qué otra ventana cambia.','{count} movimientos','¡Todas coinciden! Deja entrar el amanecer.','Compara las metas sobre las ventanas. Tus ajustes se conservan.','Toca: cerrada → rendija → abierta.','Las flechas indican qué otra ventana cambia al tocar.','Dejar entrar la luz','Ruta óptima: {count} movimientos','La habitación {number} brilla. Te espera otro amanecer.','¿Salir de la habitación?','La habitación {number} se reinicia. Los avances y récords se conservan.','Seguir jugando'],
    'pt-BR': ['Meta','Toque para mudar','Igual','{count}/3 iguais','Ajuste cada janela à sua meta.','Janelas conectadas','Janelas independentes','Capítulo {number}','Uma dica','Tente a janela {number}. A seta indica qual outra janela muda.','{count} movimentos','Tudo certo! Deixe a luz entrar.','Compare as metas acima das janelas. Seus ajustes continuam.','Toque: fechada → fresta → aberta.','As setas mostram qual outra janela também muda.','Deixar a luz entrar','Rota ideal: {count} movimentos','O quarto {number} se iluminou. Outro amanhecer espera.','Sair deste quarto?','O quarto {number} recomeça. Quartos concluídos e recordes ficam salvos.','Continuar'],
    fr: ['But','Toucher pour régler','Accordée','{count}/3 accordées','Accordez chaque fenêtre à son but.','Fenêtres liées','Fenêtres indépendantes','Chapitre {number}','Un indice','Essayez la fenêtre {number}. La flèche montre quelle autre fenêtre change.','{count} coups','Tout est accordé ! Faites entrer le jour.','Comparez les buts au-dessus des fenêtres. Vos réglages restent.','Touchez : fermée → fente → ouverte.','Les flèches montrent quelle autre fenêtre change aussi.','Faire entrer le jour','Minimum : {count} coups','La pièce {number} rayonne. Une autre aube vous attend.','Quitter cette pièce ?','La pièce {number} recommencera. Les pièces finies et les records sont conservés.','Continuer'],
    de: ['Ziel','Tippen zum Ändern','Passt','{count}/3 passen','Stelle jedes Fenster auf sein Ziel ein.','Verbundene Fenster','Einzelne Fenster','Morgenkapitel {number}','Ein Tipp','Versuche Fenster {number}. Der Pfeil zeigt, welches Fenster sich mitändert.','{count} Züge','Alles passt! Lass den Morgen herein.','Vergleiche die Ziele über den Fenstern. Deine Einstellungen bleiben.','Tippen: zu → Spalt → offen.','Pfeile zeigen, welches andere Fenster sich mitändert.','Licht hereinlassen','Optimal: {count} Züge','Zimmer {number} leuchtet. Der nächste Morgen wartet.','Dieses Zimmer verlassen?','Zimmer {number} beginnt neu. Erfolge und Bestwerte bleiben gespeichert.','Weiterspielen'],
    it: ['Meta','Tocca per cambiare','Corretta','{count}/3 corrette','Regola ogni finestra secondo la sua meta.','Finestre collegate','Finestre indipendenti','Capitolo {number}','Un indizio','Prova la finestra {number}. La freccia indica quale altra finestra cambia.','{count} mosse','Tutto corrisponde! Fai entrare il giorno.','Confronta le mete sopra le finestre. Le regolazioni restano.','Tocca: chiusa → fessura → aperta.','Le frecce indicano quale altra finestra cambia insieme.','Fai entrare la luce','Percorso ideale: {count} mosse','La stanza {number} risplende. Ti aspetta una nuova alba.','Uscire dalla stanza?','La stanza {number} ricomincia. Stanze completate e record restano salvati.','Continua'],
    ru: ['Цель','Нажми для смены','Совпало','Совпало: {count}/3','Настрой каждое окно по цели над ним.','Связанные окна','Отдельные окна','Глава {number}','Подсказка','Попробуй окно {number}. По стрелке видно, какое ещё окно изменится.','Ходов: {count}','Всё совпало! Впусти утро.','Сравни цели над окнами. Твои настройки сохраняются.','Нажимай: закрыто → щель → открыто.','Стрелки показывают, какое ещё окно изменится.','Впустить утро','Минимум: {count} ходов','Комната {number} сияет. Впереди новый рассвет.','Выйти из комнаты?','Комната {number} начнётся заново. Пройденные комнаты и рекорды сохранятся.','Продолжить'],
    hi: ['लक्ष्य','बदलने के लिए दबाएँ','मेल हुआ','{count}/3 मेल','हर खिड़की को उसके ऊपर के लक्ष्य से मिलाएँ।','जुड़ी खिड़कियाँ','अलग खिड़कियाँ','सुबह का अध्याय {number}','एक संकेत','खिड़की {number} दबाएँ। तीर वाली खिड़की भी बदलेगी।','{count} चालें','सब मेल खा गए! सुबह की रोशनी आने दें।','खिड़कियों के ऊपर लक्ष्य देखें। आपकी सेटिंग बनी रहेगी।','दबाएँ: बंद → दरार → खुली।','तीर बताते हैं कि कौन सी दूसरी खिड़की साथ बदलेगी।','रोशनी आने दें','न्यूनतम: {count} चालें','कमरा {number} रोशन है। अगली सुबह आपका इंतज़ार करती है।','यह कमरा छोड़ें?','कमरा {number} फिर से शुरू होगा। पूरे कमरे और रिकॉर्ड सुरक्षित रहेंगे।','खेलते रहें'],
    ar: ['الهدف','اضغط للتغيير','مطابقة','{count}/3 مطابقة','اضبط كل نافذة لتطابق الهدف فوقها.','نوافذ مترابطة','نوافذ مستقلة','الفصل {number}','تلميح','جرّب النافذة {number}. تتغير النافذة التي يشير إليها السهم أيضًا.','{count} حركات','تطابقت كلها! دع الصباح يدخل.','قارن الأهداف فوق النوافذ. تبقى إعداداتك كما هي.','اضغط: مغلقة ← شق ← مفتوحة.','توضح الأسهم النافذة الأخرى التي تتغير مع الضغط.','دع الضوء يدخل','الأفضل: {count} حركات','أضاءت الغرفة {number}. ينتظرك صباح جديد.','مغادرة هذه الغرفة؟','ستبدأ الغرفة {number} من جديد. تبقى الغرف المكتملة والأرقام محفوظة.','متابعة اللعب']
  };
  for (const [locale, values] of Object.entries(upgradeCopy)) {
    const dictionary = localeMap[locale];
    if (dictionary) {
      Object.assign(dictionary, Object.fromEntries(upgradeKeys.map((key,index) => [key,values[index]])));
      dictionary.guideOne = dictionary.mission;
      dictionary.guideTwo = dictionary.ready;
      dictionary.guideThree = dictionary.moveHint;
      dictionary.tips = dictionary.moveHint;
    }
  }
  const localeList = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  // Six authored arcs of five rooms keep the calm calibration loop readable
  // while giving the map a real, replayable campaign rather than a slice.
  const rounds = [
    { name: "stageName1", hint: "stageHint1", target: [2, 1, 0] },
    { name: "stageName2", hint: "stageHint2", target: [1, 2, 1] },
    { name: "stageName3", hint: "stageHint3", target: [2, 0, 1] },
    { name: "stageName4", hint: "stageHint4", target: [0, 2, 2] },
    { name: "stageName5", hint: "stageHint5", target: [1, 0, 2] },
    { name: "stageName6", hint: "stageHint6", target: [2, 2, 0] },
    { name: "stageName7", hint: "stageHint7", target: [0, 1, 2] },
    { name: "stageName8", hint: "stageHint8", target: [1, 2, 0] },
    { name: "stageName9", hint: "stageHint9", target: [2, 0, 2] },
    { name: "stageName10", hint: "stageHint10", target: [0, 2, 1] },
    { name: "stageName11", hint: "stageHint11", target: [1, 1, 2] },
    { name: "stageName12", hint: "stageHint12", target: [2, 1, 2] },
    { name: "stageName13", hint: "stageHint13", target: [0, 0, 1] },
    { name: "stageName14", hint: "stageHint14", target: [1, 2, 2] },
    { name: "stageName15", hint: "stageHint15", target: [2, 2, 1] },
    { name: "stageName16", hint: "stageHint16", target: [0, 1, 1] },
    { name: "stageName17", hint: "stageHint17", target: [2, 0, 0] },
    { name: "stageName18", hint: "stageHint18", target: [1, 0, 1] },
    { name: "stageName19", hint: "stageHint19", target: [0, 2, 0] },
    { name: "stageName20", hint: "stageHint20", target: [2, 1, 1] },
    { name: "stageName21", hint: "stageHint21", target: [1, 1, 0] },
    { name: "stageName22", hint: "stageHint22", target: [0, 0, 2] },
    { name: "stageName23", hint: "stageHint23", target: [2, 2, 2] },
    { name: "stageName24", hint: "stageHint24", target: [1, 2, 0] },
    { name: "stageName25", hint: "stageHint25", target: [0, 1, 2] },
    { name: "stageName26", hint: "stageHint26", target: [2, 0, 1] },
    { name: "stageName27", hint: "stageHint27", target: [1, 2, 2] },
    { name: "stageName28", hint: "stageHint28", target: [0, 1, 0] },
    { name: "stageName29", hint: "stageHint29", target: [2, 1, 2] },
    { name: "stageName30", hint: "stageHint30", target: [1, 0, 2] },
  ];
  const levels = ["closed", "slit", "open"];
  const completedStorageKey = "weightplay-animal-dawn-shutters-completed";
  const state = { locale: "en", screen: "main", round: 0, values: [0, 0, 0], moves: 0, completed: [], sound: true, settled: false, hinted: -1, bestRooms: {} };
  const $ = (id) => document.getElementById(id);
  // Interface 7 is injected after the game stylesheet and intentionally uses
  // compact 3px tokens. Dawn Shutters keeps its authored guide cards readable
  // and its compact-landscape controls stationary with a local compatibility
  // layer that is appended after the shared skin has loaded.
  const installInterfaceCompatibility = () => {
    if (document.getElementById("dawnShuttersInterfaceCompatibility")) return;
    const style = document.createElement("style");
    style.id = "dawnShuttersInterfaceCompatibility";
    style.textContent = `
      @layer wp-frame-contract {
      html body #gameGuide.game-page-info.game-page-info-static {
        border-radius: 18px !important;
        padding: 16px 18px !important;
        background: #e8f1ea !important;
        border: 1px solid #eadfc9 !important;
        box-shadow: 0 8px 20px #73552b14 !important;
      }
      html body #gameGuide.game-page-info.game-page-info-static .game-info-sections {
        display: grid !important;
        grid-template-columns: minmax(0, 1fr) !important;
        gap: 12px !important;
        margin-top: 18px !important;
      }
      html body #gameGuide.game-page-info.game-page-info-static .game-info-section {
        min-width: 0 !important;
        padding: 16px !important;
        border: 1px solid #c8ddca !important;
        border-radius: 16px !important;
        background: #f8fff8 !important;
        color: #24324a !important;
      }
      html body #gameGuide.game-page-info.game-page-info-static :is(h2, h3, p, li, dt, dd, strong) {
        color: #24324a !important;
      }
      html body #gameGuide.game-page-info.game-page-info-static .game-info-kicker {
        color: #5b6475 !important;
      }
      html body #gameGuide.game-page-info.game-page-info-static .game-info-related-copy span {
        color: #48556b !important;
      }
      html body #gameGuide.game-page-info.game-page-info-static .game-info-fact {
        background: #f8fff8 !important;
        border: 1px solid #c8ddca !important;
        color: #24324a !important;
      }
      html body #gameGuide.game-page-info.game-page-info-static .game-info-fact span {
        color: #5b6475 !important;
      }
      html body #mainScreen .main-copy .lede,
      html body #mainScreen .main-copy .main-summary {
        color: #e9eef5 !important;
      }
      #mainScreen #mainSettingsBtn { display: none !important; }
      #battleScreen #resultPanel[hidden] {
        display: none !important;
        pointer-events: none !important;
      }
      }
    `;
    const legacySettings = $("mainSettingsBtn");
    if (legacySettings) {
      legacySettings.classList.remove("wp-shell-settings-button");
      legacySettings.removeAttribute("data-wp-settings");
      legacySettings.hidden = true;
      legacySettings.setAttribute("aria-hidden", "true");
      legacySettings.tabIndex = -1;
    }
    // Keep this after dynamically injected shared stylesheets in document
    // order; the local rules are intentionally the final compatibility layer.
    (document.body || document.head).append(style);
  };
  const safeGet = (key, fallback) => { try { return localStorage.getItem(key) || fallback; } catch (_error) { return fallback; } };
  const safeSet = (key, value) => { try { localStorage.setItem(key, value); } catch (_error) {} };
  const ensureGuideDepth = () => {
    const guide = $('gameGuide');
    if (guide) {
      const sections = guide.querySelectorAll('.game-info-section');
      if (sections[6]) { const text = sections[6].querySelector('p'); if (text) text.textContent = copy('mismatch') + ' ' + copy('moveHint'); }
      for (const term of guide.querySelectorAll('dt')) {
        if (/wrong check/i.test(term.textContent)) term.nextElementSibling.textContent = copy('mismatch');
      }
    }
    const sections = document.querySelector("#gameGuide .game-info-sections");
    if (!sections || sections.dataset.wpGuideDepth === "true") return;
    for (const [titleKey, textKey] of [["guideDepthTitle", "guideDepth"], ["guidePracticeTitle", "guidePractice"]]) {
      const article = document.createElement("article");
      article.className = "game-info-section";
      const heading = document.createElement("h3");
      heading.dataset.copy = titleKey;
      const paragraph = document.createElement("p");
      paragraph.dataset.copy = textKey;
      article.append(heading, paragraph);
      sections.append(article);
    }
    sections.dataset.wpGuideDepth = "true";
  };
  const loadCompleted = () => {
    try {
      const parsed = JSON.parse(safeGet(completedStorageKey, "[]"));
      return Array.isArray(parsed) ? [...new Set(parsed.filter((index) => Number.isInteger(index) && index >= 0 && index < rounds.length))] : [];
    } catch (_error) { return []; }
  };
  const saveCompleted = () => safeSet(completedStorageKey, JSON.stringify([...new Set(state.completed)].sort((a, b) => a - b)));
  const copy = (key, vars = {}) => { const dictionary = localeMap[state.locale] || localeMap.en || {}; let value = dictionary[key] || localeMap.en[key] || key; Object.entries(vars).forEach(([name, replacement]) => { value = value.replace(new RegExp("\\{" + name + "\\}", "g"), String(replacement)); }); return value; };
  const bestTotal = () => Number(safeGet("weightplay-animal-dawn-shutters-best", "0")) || 0;
  const showToast = (message) => { $("toast").textContent = message; $("toast").classList.add("visible"); window.clearTimeout(showToast.timer); showToast.timer = window.setTimeout(() => $("toast").classList.remove("visible"), 1800); };
  const applyText = () => { ensureGuideDepth(); document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = copy(node.dataset.copy); }); document.querySelectorAll("[data-copy-aria-label]").forEach((node) => node.setAttribute("aria-label", copy(node.dataset.copyAriaLabel))); $("mainSettingsBtn").setAttribute("aria-label", copy("settings")); $("soundBtn").textContent = state.sound ? copy("soundOn") : copy("soundOff"); $("battleSoundBtn").setAttribute("aria-label", copy("sound")); $("mainProgress").textContent = copy("progress", { count: state.completed.length }); if (state.screen === "stage") renderStages(); if (state.screen === "battle") renderBattle(); };
  const setScreen = (screen) => {
    if ($('leaveDialog')?.open) $('leaveDialog').close();
    $('battleScreen').getAnimations({subtree:true}).forEach(animation => animation.cancel());
    state.screen = screen; document.body.dataset.screen = screen; ["main", "stage", "battle"].forEach((name) => { const element = $(name + "Screen"); element.hidden = name !== screen; element.classList.toggle("active", name === screen); }); const guide = $("gameGuide"); if (guide) guide.hidden = screen !== "main"; const stageReserve = document.querySelector(".stage-ad-reserve"); if (stageReserve) stageReserve.hidden = screen !== "stage"; const battleReserve = document.querySelector(".battle-ad-reserve"); if (battleReserve) battleReserve.hidden = screen !== "battle"; if (screen === "main") applyText(); if (screen === "stage") renderStages(); if (screen === "battle") renderBattle(); window.scrollTo(0, 0);
    { const __wpNextScreen = ({main:"main",stage:"stage",battle:"battle",})[screen] ?? null;
      if (["result"].includes(screen) && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "complete"; }
      else if (true && (__wpNextScreen === "main" || __wpNextScreen === "stage") && __wpMeasurement.screen === "battle" && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "abandon"; }
      __wpMeasurement.screen = __wpNextScreen;  __wpNotifyMeasurement(); }
};
  const stageUnlocked = (index) => index === 0 || state.completed.includes(index - 1);
  const bindStageRail = () => {
    const rail = $("stageList");
    if (!rail || rail.dataset.dragGuardBound === "true") return;
    rail.dataset.dragGuardBound = "true";
    let pointerId = null;
    let startX = 0;
    let startScroll = 0;
    let moved = false;
    let suppressNextClick = false;
    let suppressClickTimer = 0;
    let previousScrollBehavior = "";
    let previousSnapType = "";
    rail.addEventListener("pointerdown", (event) => {
      if (event.isPrimary === false || (event.button !== undefined && event.button !== 0)) return;
      pointerId = event.pointerId;
      startX = event.clientX;
      startScroll = rail.scrollLeft;
      moved = false;
      rail.dataset.dragging = "false";
      previousScrollBehavior = rail.style.getPropertyValue("scroll-behavior");
      previousSnapType = rail.style.getPropertyValue("scroll-snap-type");
      rail.style.setProperty("scroll-behavior", "auto", "important");
      rail.style.setProperty("scroll-snap-type", "none", "important");
    });
    document.addEventListener("pointermove", (event) => {
      if (event.pointerId !== pointerId) return;
      const delta = event.clientX - startX;
      if (!moved && Math.abs(delta) > 4) {
        moved = true;
        rail.dataset.dragging = "true";
        rail.classList.add("stage-dragging");
        try { rail.setPointerCapture?.(event.pointerId); } catch (_error) {}
      }
      if (!moved) return;
      if (event.cancelable) event.preventDefault();
      const railRect = rail.getBoundingClientRect();
      const coordinateScale = railRect.width > 0 ? rail.clientWidth / railRect.width : 1;
      const maximum = Math.max(0, rail.scrollWidth - rail.clientWidth);
      rail.scrollLeft = Math.max(0, Math.min(maximum, startScroll - delta * coordinateScale));
    });
    const finishPointer = (event = {}) => {
      if (pointerId === null || (event.pointerId !== undefined && event.pointerId !== pointerId)) return;
      const didMove = moved;
      pointerId = null;
      moved = false;
      rail.dataset.dragging = "false";
      rail.classList.remove("stage-dragging");
      try { if (rail.hasPointerCapture?.(event.pointerId)) rail.releasePointerCapture(event.pointerId); } catch (_error) {}
      if (previousScrollBehavior) rail.style.setProperty("scroll-behavior", previousScrollBehavior);
      else rail.style.removeProperty("scroll-behavior");
      if (previousSnapType) rail.style.setProperty("scroll-snap-type", previousSnapType);
      else rail.style.removeProperty("scroll-snap-type");
      if (!didMove) return;
      if (event.cancelable) event.preventDefault();
      if (rail.contains(document.activeElement)) document.activeElement?.blur?.();
      suppressNextClick = true;
      window.clearTimeout(suppressClickTimer);
      suppressClickTimer = window.setTimeout(() => { suppressNextClick = false; }, 0);
      const railRect = rail.getBoundingClientRect();
      const cards = [...rail.querySelectorAll("[data-stage]")];
      const nearest = cards.reduce((best, card) => {
        if (!best) return card;
        const cardDistance = Math.abs((card.getBoundingClientRect().left + card.getBoundingClientRect().width / 2) - (railRect.left + railRect.width / 2));
        const bestDistance = Math.abs((best.getBoundingClientRect().left + best.getBoundingClientRect().width / 2) - (railRect.left + railRect.width / 2));
        return cardDistance < bestDistance ? card : best;
      }, null);
      if (nearest) {
        const target = rail.scrollLeft + (nearest.getBoundingClientRect().left + nearest.getBoundingClientRect().width / 2) - (railRect.left + railRect.width / 2);
        const maximum = Math.max(0, rail.scrollWidth - rail.clientWidth);
        rail.scrollTo({ left: Math.max(0, Math.min(maximum, target)), behavior: "smooth" });
      }
    };
    rail.addEventListener("pointerup", finishPointer, true);
    rail.addEventListener("pointercancel", finishPointer, true);
    document.addEventListener("pointerup", finishPointer, true);
    document.addEventListener("pointercancel", finishPointer, true);
    rail.addEventListener("click", (event) => {
      if (!suppressNextClick) return;
      suppressNextClick = false;
      window.clearTimeout(suppressClickTimer);
      event.preventDefault();
      event.stopImmediatePropagation();
    }, true);
  };
  // Every chapter has an invertible three-state mechanism. All 27 light
  // patterns remain reachable, including saves made before this rework.
  const chapterLinks = [[], [[0,1]], [[0,1],[1,2]], [[0,1],[1,2],[2,0]], [[0,2],[2,1]], [[0,2],[2,1],[1,0]]];
  const linksFor = (room) => chapterLinks[Math.floor(room / 5)];
  const affectedBy = (room, index) => [index, ...linksFor(room).filter(([from]) => from === index).map(([,to]) => to)];
  const turn = (values, room, index) => values.map((value, slot) => (value + (affectedBy(room, index).includes(slot) ? 1 : 0)) % 3);
  const solve = (values, room) => {
    const target = rounds[room].target.join('');
    const queue = [{values: [...values], path: []}], seen = new Set([values.join('')]);
    for (let n = 0; n < queue.length; n++) {
      const current = queue[n];
      if (current.values.join('') === target) return current.path;
      for (let index = 0; index < 3; index++) {
        const next = turn(current.values, room, index), key = next.join('');
        if (!seen.has(key)) { seen.add(key); queue.push({values: next, path: [...current.path, index]}); }
      }
    }
    return [];
  };
  const levelName = (value) => copy(levels[value]);
  const barMarkup = (value, extra = "") => `<span class="light-bar ${extra} level-${value}" aria-hidden="true"><i></i><i></i><i></i></span>`;
  const starsFor = (moves, room) => moves <= solve([0,0,0], room).length ? 3 : moves <= solve([0,0,0], room).length + 2 ? 2 : 1;
  const renderStages = () => {
    const rail = $('stageList'); bindStageRail();
    rail.innerHTML = rounds.map((round, index) => {
      const done = state.completed.includes(index), unlocked = stageUnlocked(index), best = state.bestRooms[index];
      const stars = Number.isInteger(best) ? '★'.repeat(starsFor(best,index)) + '☆'.repeat(3-starsFor(best,index)) : '';
      return `<button class="stage-card${done ? ' complete' : ''}" type="button" data-stage="${index}" ${unlocked ? '' : 'disabled'}>
        <span class="stage-number">${copy('round',{number:index+1,total:rounds.length})}</span>
        <strong>${copy('chapterLabel',{number:Math.floor(index/5)+1})}</strong>
        <span class="stage-pattern" aria-hidden="true">${round.target.map((v) => barMarkup(v)).join('')}</span>
        <span class="stage-rule">${copy(linksFor(index).length ? 'linked' : 'independent')}</span>
        <b>${stars || (done ? copy('completed') : unlocked ? copy('readyStage') : copy('lockedStage'))}</b></button>`;
    }).join('');
    rail.querySelectorAll('[data-stage]').forEach(button => button.addEventListener('click', () => startRound(Number(button.dataset.stage))));
    const next = rounds.findIndex((_,index) => !state.completed.includes(index));
    const card = rail.querySelector(`[data-stage="${next < 0 ? 29 : next}"]`);
    if (card) rail.scrollLeft = card.offsetLeft - (rail.clientWidth-card.offsetWidth)/2;
  };
  const ensurePlaySurface = () => {
    if ($('roomScene')) return;
    const scene = document.createElement('div'); scene.id = 'roomScene'; scene.setAttribute('aria-hidden','true');
    scene.innerHTML = '<div class="dawn-sun"></div><div class="room-horizon"></div><div class="room-plant"><i></i><i></i><b></b></div><div class="room-table"><span></span></div><div class="room-rays"><i></i><i></i><i></i></div>';
    $('battlePanel').insertBefore(scene, $('shutterBoard'));
    const toolbar = document.createElement('div'); toolbar.className = 'puzzle-tools';
    toolbar.innerHTML = '<span id="moveCount"></span><button id="hintBtn" type="button" class="text-btn"></button>';
    $('battlePanel').insertBefore(toolbar,$('battlePanel').querySelector('.battle-actions'));
    $('hintBtn').addEventListener('click', () => {
      const path = solve(state.values,state.round); state.hinted = path[0] ?? -1;
      $('battleStatus').textContent = state.hinted < 0 ? copy('allMatched') : copy('hintMove',{number:state.hinted+1});
      renderBattle();
    });
    $('shutterBoard').addEventListener('click', event => {
      const button = event.target.closest('[data-shutter]');
      if (!button || state.settled || state.paused) return;
      const index = Number(button.dataset.shutter), affected = affectedBy(state.round,index);
      state.values = turn(state.values,state.round,index); state.moves++; state.hinted = -1;
      $('battleStatus').textContent = copy('changed',{name:copy('shutter',{number:index+1}),level:levelName(state.values[index])});
      renderBattle();
      for (const slot of affected) {
        const window = $('shutterBoard').querySelector(`[data-shutter="${slot}"]`);
        window.getAnimations().forEach(animation => animation.cancel());
        window.animate([{filter:'brightness(1.3)'},{filter:'brightness(1)'}],{duration:matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 220});
      }
    });
  };
  const renderBattle = () => {
    ensurePlaySurface();
    const round = rounds[state.round], count = state.values.filter((value,index) => value === round.target[index]).length;
    $('battleHeading').textContent = copy('round',{number:state.round+1,total:rounds.length});
    $('roundHint').textContent = copy('mission');
    $('progressBadge').textContent = copy('liveMatch',{count});
    $('progressBadge').dataset.complete = String(count === 3);
    $('battlePanel').dataset.arc = Math.floor(state.round/5);
    $('battlePanel').style.setProperty('--room-light', String(state.values.reduce((a,b) => a+b,0)/6));
    $('roomScene').dataset.ready = String(count === 3);
    const links = linksFor(state.round);
    $('targetBars').innerHTML = `<span class="link-caption">${copy(links.length ? 'linked' : 'independent')}</span><span class="link-diagram" dir="ltr">${links.map(([a,b]) => `${a+1} → ${b+1}`).join(' · ') || '1 · 2 · 3'}</span>`;
    // Preserve the three button identities and keyboard focus through every move.
    if (!$('shutterBoard').children.length) $('shutterBoard').innerHTML = state.values.map((_,index) => `<button type="button" class="shutter-card" data-shutter="${index}"><span class="window-target"></span><span class="shutter-window"><span class="window-sky"></span><span class="window-slats"><i></i><i></i><i></i><i></i></span><span class="window-light"></span><span class="window-number">${index+1}</span></span><strong></strong><span class="state-dots" aria-hidden="true"><i></i><i></i><i></i></span><small></small><span class="match-state"></span></button>`).join('');
    state.values.forEach((value,index) => {
      const button = $('shutterBoard').children[index], matched = value === round.target[index];
      button.className = `shutter-card level-${value}${matched ? ' matched' : ''}${state.hinted === index ? ' suggested' : ''}`;
      button.setAttribute('aria-label',`${copy('shutter',{number:index+1})}. ${levelName(value)}. ${copy('target')}: ${levelName(round.target[index])}. ${copy('tap')}`);
      button.querySelector('.window-target').textContent = `${copy('goal')}: ${levelName(round.target[index])}`;
      button.querySelector('strong').textContent = levelName(value);
      button.querySelector('small').textContent = copy('tap');
      button.querySelector('.match-state').textContent = matched ? `✓ ${copy('matched')}` : '○';
      button.querySelectorAll('.state-dots i').forEach((dot,slot) => dot.classList.toggle('on',slot === value));
    });
    $('moveCount').textContent = copy('moves',{count:state.moves});
    $('hintBtn').textContent = copy('hint');
    $('battlePanel').querySelector('.move-hint').textContent = copy(links.length ? 'moveHint' : 'ready');
    $('checkBtn').classList.toggle('all-matched', count === 3);
    if (count === 3) $('battleStatus').textContent = copy('allMatched');
    $('resultPanel').hidden = true; $('battlePanel').hidden = false;
    __wpNotifyMeasurement();
  };
  const resetRound = () => {
    state.values = [0,0,0]; state.moves = 0; state.hinted = -1; state.settled = false;
    $('battleStatus').textContent = copy('ready'); renderBattle();
    if (state.screen === 'battle') { __wpMeasurement.roundKey = {}; __wpMeasurement.restart = false; __wpMeasurement.started = true; __wpMeasurement.ended = false; __wpMeasurement.outcome = 'complete'; __wpMeasurement.screen = 'battle'; __wpNotifyMeasurement(); }
  };
  const showResult = () => {
    state.settled = true;
    const final = state.round === rounds.length-1, total = state.moves, previousBest = bestTotal();
    if (final && (!previousBest || total < previousBest)) safeSet('weightplay-animal-dawn-shutters-best',String(total));
    if (!Number.isInteger(state.bestRooms[state.round]) || total < state.bestRooms[state.round]) state.bestRooms[state.round] = total;
    safeSet('weightplay-animal-dawn-shutters-room-bests',JSON.stringify(state.bestRooms));
    if (!state.completed.includes(state.round)) { state.completed.push(state.round); saveCompleted(); }
    $('battlePanel').hidden = true; $('resultPanel').hidden = false;
    $('resultHeading').textContent = copy(final ? 'finishTitle' : 'resultTitle');
    $('resultText').textContent = copy('roomCleared',{number:state.round+1});
    const stars = starsFor(total,state.round);
    $('resultStats').innerHTML = `<div class="result-stars" aria-label="${stars}/3">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</div><strong>${copy('moves',{count:total})}</strong><span>${copy('par',{count:solve([0,0,0],state.round).length})}</span>`;
    $('resultPrimaryBtn').textContent = copy('next'); $('resultPrimaryBtn').disabled = final;
    $('resultPrimaryBtn').onclick = () => { if (!final) startRound(state.round+1); };
    $('resultMapBtn').textContent = copy('stages');
    $('resultHomeBtn').textContent = copy('replay');
    $('resultHomeBtn').onclick = () => startRound(state.round);
    $('mainProgress').textContent = copy('progress',{count:state.completed.length});
    $('resultPrimaryBtn').focus({preventScroll:true});
    __wpMeasurement.ended = true; __wpMeasurement.outcome = 'complete'; __wpMeasurement.screen = null; __wpNotifyMeasurement();
  };
  const checkRound = () => {
    if (state.values.every((value,index) => value === rounds[state.round].target[index])) { showResult(); }
    else {
      $('battleStatus').textContent = copy('mismatch');
      $('battleStatus').animate([{opacity:.3},{opacity:1}],{duration:240});
      $('shutterBoard').classList.remove('checked'); void $('shutterBoard').offsetWidth; $('shutterBoard').classList.add('checked');
    }
  };
  const startRound = (index) => {
    state.round = Math.max(0,Math.min(rounds.length-1,index)); state.values = [0,0,0]; state.moves = 0; state.hinted = -1; state.settled = false;
    window.WeightPlayScreenFrame?.showResultGet?.('animal-dawn-shutters',false);
    setScreen('battle'); $('battleStatus').textContent = copy('ready');
    __wpMeasurement.roundKey = {}; __wpMeasurement.restart = false; __wpMeasurement.started = true; __wpMeasurement.ended = false; __wpMeasurement.outcome = 'complete'; __wpMeasurement.screen = 'battle'; __wpNotifyMeasurement();
  };
  const requestLeave = () => {
    if (state.settled || !state.moves) { setScreen('stage'); return; }
    let dialog = $('leaveDialog');
    if (!dialog) {
      dialog = document.createElement('dialog'); dialog.id = 'leaveDialog';
      dialog.innerHTML = '<h2 id="leaveTitle"></h2><p id="leaveCopy"></p><button id="continueBtn" class="primary-btn" type="button"></button><button id="leaveBtn" class="secondary-btn" type="button"></button>';
      $('battleScreen').querySelector('.battle-canvas').append(dialog);
      $('continueBtn').onclick = () => dialog.close();
      $('leaveBtn').onclick = () => { dialog.close(); setScreen('stage'); };
      dialog.addEventListener('close',() => { state.paused = false; if (state.screen === 'battle') $('battleBackBtn').focus({preventScroll:true}); });
    }
    $('leaveTitle').textContent = copy('leaveTitle'); $('leaveCopy').textContent = copy('leaveCopy',{number:state.round+1});
    $('continueBtn').textContent = copy('continue'); $('leaveBtn').textContent = copy('stages');
    dialog.setAttribute('aria-labelledby','leaveTitle'); state.paused = true; dialog.showModal(); $('continueBtn').focus();
  };
  const localeRoute = { en: "en", "zh-Hant": "zh-tw", "zh-Hans": "zh-cn", ja: "ja", ko: "ko", es: "es", "pt-BR": "pt-br", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const applyLocale = (locale) => {
    state.locale = localeList.includes(locale) && localeMap[locale] ? locale : "en";
    safeSet("weightplay-locale", state.locale);
    safeSet("weightPlayLocale", state.locale);
    const route = location.pathname.match(/^\/(en|zh-tw|zh-cn|ja|ko|es|pt-br|fr|de|it|ru|hi|ar)\/games\/animal-dawn-shutters\/?$/);
    if (route && route[1] !== localeRoute[state.locale]) {
      location.assign(`/${localeRoute[state.locale]}/games/animal-dawn-shutters/${location.search}${location.hash}`);
      return;
    }
    document.documentElement.lang = state.locale;
    document.documentElement.dir = state.locale === "ar" ? "rtl" : "ltr";
    $("languageSelect").value = state.locale;
    applyText();
  };
  const bind = () => { $("startBtn").addEventListener("click", () => setScreen("stage")); $("mapBtn").addEventListener("click", () => setScreen("stage")); $("mainSettingsBtn")?.addEventListener("click", () => { const open = $("settingsPanel").hidden; $("settingsPanel").hidden = !open; $("mainSettingsBtn").setAttribute("aria-expanded", String(open)); }); $("closeSettingsBtn")?.addEventListener("click", () => { $("settingsPanel").hidden = true; $("mainSettingsBtn")?.setAttribute("aria-expanded", "false"); }); $("stageBackBtn").addEventListener("click", () => setScreen("main")); $("stageInfoBtn").addEventListener("click", () => showToast(copy("mapIntro"))); $("battleBackBtn").addEventListener("click", requestLeave); $("checkBtn").addEventListener("click", checkRound); $("resetBtn").addEventListener("click", function (...args) { return __wpReplayStart(() => resetRound.apply(this, args)); }); $("resultMapBtn").addEventListener("click", () => setScreen("stage"));  [$('soundBtn'), $('battleSoundBtn')].forEach((button) => button.addEventListener("click", () => { state.sound = !state.sound; safeSet("weightplay-animal-dawn-shutters-sound", state.sound ? "on" : "off"); applyText(); })); $("languageSelect").addEventListener("change", (event) => applyLocale(event.target.value)); };
  // Shared, committed rewards retain their canonical marker. Remove only
  // this game's duplicate toast after the shared Result feedback is mounted.
  window.addEventListener('weightplay:castle-reward', event => {
    if (event.detail?.gameId !== 'animal-dawn-shutters' || !state.settled) return;
    queueMicrotask(() => {
      if (!state.settled || state.screen !== 'battle') return;
      const marker = window.WeightPlayScreenFrame?.showResultGet?.('animal-dawn-shutters',true);
      if (marker) window.WeightPlayCastle?.dismissRewardNotice?.('animal-dawn-shutters');
    });
  });
  const init = () => { installInterfaceCompatibility();
    const battle = $('battleScreen');
    for (const id of ['stageBackBtn','battleBackBtn']) {
      const button = $(id); button.removeAttribute('data-copy'); button.dataset.copyAriaLabel = 'back'; button.textContent = '←';
    }
    battle.dataset.wpBattleMinWidth = '390'; battle.dataset.wpBattleMinHeight = '788';
    battle.dataset.wpBattleLandscapeWidth = '760'; battle.dataset.wpBattleLandscapeHeight = '334'; state.sound = safeGet("weightplay-animal-dawn-shutters-sound", "on") !== "off"; state.completed = loadCompleted();
    try { const saved = JSON.parse(safeGet('weightplay-animal-dawn-shutters-room-bests','{}')); if (saved && !Array.isArray(saved) && typeof saved === 'object') state.bestRooms = Object.fromEntries(Object.entries(saved).filter(([room,moves]) => /^([0-9]|[12][0-9])$/.test(room) && Number.isInteger(moves) && moves >= 0)); } catch {}
    bind(); const routeLocale = document.documentElement.lang; const initialLocale = localeList.includes(routeLocale) && localeMap[routeLocale] ? routeLocale : safeGet("weightplay-locale", "en"); applyLocale(initialLocale); resetRound(); setScreen("main"); };
  init();
}());
