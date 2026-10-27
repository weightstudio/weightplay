/* Flip Foundry: visible aim, deterministic ballistic contact, four landings per chapter. */
import {COURSES,TOTAL_STAGES} from './campaign-data.mjs';
import {launchState,stepFlight,simulate,invert,canInvert,targetAt,suggestedPulseWindows} from './model.mjs?v=20261027-flip-miss-direction-v19';
import {readProgress,completeStage,persistProgressChecked} from './progress.mjs?v=20261027-flip-pending-candidate';
import {createProgressConfirmation} from './progress-confirmation.mjs?v=20261027-flip-pending-candidate';
import {createMeasurementQueue} from './measurement-queue.mjs?v=stage-reward-v19';
import {campaignCopy,ruleLabels,CLARITY_COPY} from './campaign-copy.mjs';
import {createPendingSummaryView} from './pending-summary-view.mjs?v=20261027-flip-summary-candidate2';
import {FoundryScene} from './scene.mjs?v=20261027-flip-miss-direction-v19';
(() => {
  /* WP-GAME-ANALYTICS-ADAPTER */
  // Only replayable lifecycle signals live here; all metrics/timers/GA4 stay shared.
  const __wpMeasurement = { screen: null, roundKey: null, started: false, ended: false, restart: false, outcome: "complete" };
  const __wpEnqueueMeasurement = createMeasurementQueue(() => window.WonderAnalytics);
  let __wpReady = false;
  const __wpReadMeasurement = () => ({ ...__wpMeasurement,
    stageIdAuthoritative: true, stageId: __wpMeasurement.roundKey ? state.chapter : null,
    screen: ((({main:"main",stage:"stage",battle:"battle",})[state.screen] ?? null) === "battle" && (__wpMeasurement.ended)) ? null : (({main:"main",stage:"stage",battle:"battle",})[state.screen] ?? null), ended: Boolean(__wpMeasurement.ended), outcome: __wpMeasurement.outcome,
    paused: Boolean(state?.paused || state?.suspended), node: document.body,
    activityMode: "input", idleSeconds: 300
  });
  function __wpNotifyMeasurement() { if (__wpReady) __wpEnqueueMeasurement(__wpReadMeasurement()); }
  // Explicit authored replay actions count only when a new round was actually created.
  function __wpReplayStart(action) {
    const previous = __wpMeasurement.roundKey, value = action();
    if (__wpMeasurement.roundKey !== previous) { __wpMeasurement.restart = true; __wpNotifyMeasurement(); }
    return value;
  }
  window.addEventListener("weightplay:analytics-ready", __wpNotifyMeasurement);
  __wpNotifyMeasurement();

  const $ = (id) => document.getElementById(id);
  const canvas = $("arena");
  $("stage-list").dataset.wpStageRecommendation = "first";
  const arenaFrame = document.querySelector(".arena-frame");
  const ctx = canvas.getContext("2d");
  const loadingPanel = $("loadingPanel");
  const localeCopy = {
    en: { preparing: "Preparing the foundry…", stageTitle: "Foundry Chapters", chapter: "Chapter", platforms: "4 platforms", wideStarts: "wide starts", precisionFinish: "precision finish", newSpacing: "new spacing", backMain: "Back to Main", backStages: "Back to Stages", stageSections: "Stage sections", stages: "Stages", surface: "Chapter {chapter} · Platform {platform} / 4", ready: "Swipe upward from the canister.", rotation: "Watch the rotation…", miss: "Too soft or too wild…", perfect: "Perfect landing — next platform ready.", canvas: "Flip Foundry play area", hint: "Swipe up. Shorter swipes stay low; longer swipes climb farther.", bestStreak: "Best streak", streak: "STREAK", best: "BEST", routeClear: "Foundry route clear", chapterClear: "Chapter clear", failed: "Landing failed", resultCopy: "Chapter {chapter} · Platform {platform} · Streak {streak} · Best {best}", stagesAction: "Stages", nextSurface: "Next Surface", retry: "Retry", nextChapter: "Next Chapter", replayFoundry: "Replay Foundry", retryPlatform: "Retry Platform" },
    "zh-Hant": { preparing: "正在準備工坊……", stageTitle: "工坊章節", chapter: "第", platforms: "4 個平台", wideStarts: "寬闊起步", precisionFinish: "精準收尾", newSpacing: "新的間距", backMain: "返回主頁", backStages: "返回章節", stageSections: "章節區域", stages: "章節", surface: "第 {chapter} 章 · 平台 {platform} / 4", ready: "向上滑動晶體罐。", rotation: "觀察旋轉……", miss: "力道太弱或方向太偏……", perfect: "完美落地——下一個平台準備好了。", canvas: "翻轉工坊遊戲區", hint: "向上滑動。短滑動會保持低位；長滑動會飛得更遠。", bestStreak: "最佳連勝", streak: "連勝", best: "最佳", routeClear: "工坊路線完成", chapterClear: "章節完成", failed: "落地失敗", resultCopy: "第 {chapter} 章 · 平台 {platform} · 連勝 {streak} · 最佳 {best}", stagesAction: "章節", nextSurface: "下一個平台", retry: "重試", nextChapter: "下一章", replayFoundry: "重玩翻轉工坊", retryPlatform: "重試平台" },
    "zh-Hans": { preparing: "正在准备工坊……", stageTitle: "工坊章节", chapter: "第", platforms: "4 个平台", wideStarts: "宽阔起步", precisionFinish: "精准收尾", newSpacing: "新的间距", backMain: "返回主页", backStages: "返回章节", stageSections: "章节区域", stages: "章节", surface: "第 {chapter} 章 · 平台 {platform} / 4", ready: "向上滑动晶体罐。", rotation: "观察旋转……", miss: "力度太弱或方向太偏……", perfect: "完美落地——下一个平台准备好了。", canvas: "翻转工坊游戏区", hint: "向上滑动。短滑动会保持低位；长滑动会飞得更远。", bestStreak: "最佳连胜", streak: "连胜", best: "最佳", routeClear: "工坊路线完成", chapterClear: "章节完成", failed: "落地失败", resultCopy: "第 {chapter} 章 · 平台 {platform} · 连胜 {streak} · 最佳 {best}", stagesAction: "章节", nextSurface: "下一个平台", retry: "重试", nextChapter: "下一章", replayFoundry: "重玩翻转工坊", retryPlatform: "重试平台" },
    ja: { preparing: "工房を準備中…", stageTitle: "工房チャプター", chapter: "チャプター", platforms: "4つの足場", wideStarts: "広いスタート", precisionFinish: "精密なゴール", newSpacing: "新しい間隔", backMain: "メインへ戻る", backStages: "チャプターへ戻る", stageSections: "チャプターの区画", stages: "チャプター", surface: "チャプター {chapter} · 足場 {platform} / 4", ready: "クリスタル容器を上へスワイプ。", rotation: "回転を見てください…", miss: "力が弱すぎるか、方向が大きく外れました…", perfect: "完璧な着地です。次の足場の準備完了。", canvas: "フリップ工房のプレイエリア", hint: "上へスワイプ。短いスワイプは低く、長いスワイプはより遠くへ飛びます。", bestStreak: "最高連続記録", streak: "連続", best: "最高", routeClear: "工房ルートクリア", chapterClear: "チャプタークリア", failed: "着地失敗", resultCopy: "チャプター {chapter} · 足場 {platform} · 連続 {streak} · 最高 {best}", stagesAction: "チャプター", nextSurface: "次の足場", retry: "再挑戦", nextChapter: "次のチャプター", replayFoundry: "フリップ工房を再プレイ", retryPlatform: "足場を再挑戦" },
    ko: { preparing: "공방을 준비하는 중…", stageTitle: "공방 챕터", chapter: "챕터", platforms: "플랫폼 4개", wideStarts: "넓은 시작", precisionFinish: "정밀한 마무리", newSpacing: "새 간격", backMain: "메인으로 돌아가기", backStages: "챕터로 돌아가기", stageSections: "챕터 구역", stages: "챕터", surface: "챕터 {chapter} · 플랫폼 {platform} / 4", ready: "크리스털 용기를 위로 스와이프하세요.", rotation: "회전을 지켜보세요…", miss: "힘이 너무 약하거나 방향이 크게 빗나갔습니다…", perfect: "완벽한 착지입니다. 다음 플랫폼이 준비되었습니다.", canvas: "플립 공방 플레이 영역", hint: "위로 스와이프하세요. 짧게 하면 낮게, 길게 하면 더 멀리 날아갑니다.", bestStreak: "최고 연속 기록", streak: "연속", best: "최고", routeClear: "공방 경로 클리어", chapterClear: "챕터 클리어", failed: "착지 실패", resultCopy: "챕터 {chapter} · 플랫폼 {platform} · 연속 {streak} · 최고 {best}", stagesAction: "챕터", nextSurface: "다음 플랫폼", retry: "다시 시도", nextChapter: "다음 챕터", replayFoundry: "플립 공방 다시 하기", retryPlatform: "플랫폼 다시 시도" },
    es: { preparing: "Preparando el taller…", stageTitle: "Capítulos del taller", chapter: "Capítulo", platforms: "4 plataformas", wideStarts: "inicio amplio", precisionFinish: "final de precisión", newSpacing: "nuevo espacio", backMain: "Volver al inicio", backStages: "Volver a capítulos", stageSections: "Secciones de capítulos", stages: "Capítulos", surface: "Capítulo {chapter} · Plataforma {platform} / 4", ready: "Desliza hacia arriba el recipiente.", rotation: "Observa la rotación…", miss: "Demasiado suave o demasiado desviado…", perfect: "Aterrizaje perfecto: la siguiente plataforma está lista.", canvas: "Zona de juego del taller de giros", hint: "Desliza hacia arriba. Los gestos cortos se quedan bajos; los largos llegan más lejos.", bestStreak: "Mejor racha", streak: "RACHA", best: "MEJOR", routeClear: "Ruta del taller completada", chapterClear: "Capítulo completado", failed: "Aterrizaje fallido", resultCopy: "Capítulo {chapter} · Plataforma {platform} · Racha {streak} · Mejor {best}", stagesAction: "Capítulos", nextSurface: "Siguiente plataforma", retry: "Reintentar", nextChapter: "Siguiente capítulo", replayFoundry: "Repetir Taller de giros", retryPlatform: "Reintentar plataforma" },
    "pt-BR": { preparing: "Preparando a oficina…", stageTitle: "Capítulos da oficina", chapter: "Capítulo", platforms: "4 plataformas", wideStarts: "início amplo", precisionFinish: "final de precisão", newSpacing: "novo espaçamento", backMain: "Voltar ao início", backStages: "Voltar aos capítulos", stageSections: "Seções de capítulos", stages: "Capítulos", surface: "Capítulo {chapter} · Plataforma {platform} / 4", ready: "Deslize o recipiente para cima.", rotation: "Observe a rotação…", miss: "Fraco demais ou fora da direção…", perfect: "Pouso perfeito — a próxima plataforma está pronta.", canvas: "Área de jogo da Oficina do Giro", hint: "Deslize para cima. Gestos curtos ficam baixos; gestos longos alcançam mais longe.", bestStreak: "Melhor sequência", streak: "SEQUÊNCIA", best: "MELHOR", routeClear: "Rota da oficina concluída", chapterClear: "Capítulo concluído", failed: "Pouso falhou", resultCopy: "Capítulo {chapter} · Plataforma {platform} · Sequência {streak} · Melhor {best}", stagesAction: "Capítulos", nextSurface: "Próxima plataforma", retry: "Tentar de novo", nextChapter: "Próximo capítulo", replayFoundry: "Repetir Oficina do Giro", retryPlatform: "Tentar plataforma de novo" },
    fr: { preparing: "Préparation de l'atelier…", stageTitle: "Chapitres de l'atelier", chapter: "Chapitre", platforms: "4 plateformes", wideStarts: "départ large", precisionFinish: "fin précise", newSpacing: "nouvel espacement", backMain: "Retour à l'accueil", backStages: "Retour aux chapitres", stageSections: "Sections des chapitres", stages: "Chapitres", surface: "Chapitre {chapter} · Plateforme {platform} / 4", ready: "Fais glisser le réservoir vers le haut.", rotation: "Observe la rotation…", miss: "Trop faible ou trop dévié…", perfect: "Atterrissage parfait : la prochaine plateforme est prête.", canvas: "Zone de jeu de l'Atelier du flip", hint: "Glisse vers le haut. Les gestes courts restent bas ; les gestes longs vont plus loin.", bestStreak: "Meilleure série", streak: "SÉRIE", best: "MEILLEUR", routeClear: "Parcours de l'atelier terminé", chapterClear: "Chapitre terminé", failed: "Atterrissage raté", resultCopy: "Chapitre {chapter} · Plateforme {platform} · Série {streak} · Meilleur {best}", stagesAction: "Chapitres", nextSurface: "Plateforme suivante", retry: "Réessayer", nextChapter: "Chapitre suivant", replayFoundry: "Rejouer l'Atelier du flip", retryPlatform: "Réessayer la plateforme" },
    de: { preparing: "Werkstatt wird vorbereitet…", stageTitle: "Werkstatt-Kapitel", chapter: "Kapitel", platforms: "4 Plattformen", wideStarts: "breiter Start", precisionFinish: "präzises Finale", newSpacing: "neuer Abstand", backMain: "Zur Startseite", backStages: "Zu den Kapiteln", stageSections: "Kapitelbereiche", stages: "Kapitel", surface: "Kapitel {chapter} · Plattform {platform} / 4", ready: "Wische den Behälter nach oben.", rotation: "Beobachte die Drehung…", miss: "Zu schwach oder zu weit daneben…", perfect: "Perfekte Landung — die nächste Plattform ist bereit.", canvas: "Spielbereich der Flip-Werkstatt", hint: "Wische nach oben. Kurze Wischer bleiben niedrig, lange Wischer reichen weiter.", bestStreak: "Beste Serie", streak: "SERIE", best: "BESTE", routeClear: "Werkstattroute geschafft", chapterClear: "Kapitel geschafft", failed: "Landung fehlgeschlagen", resultCopy: "Kapitel {chapter} · Plattform {platform} · Serie {streak} · Beste {best}", stagesAction: "Kapitel", nextSurface: "Nächste Plattform", retry: "Erneut versuchen", nextChapter: "Nächstes Kapitel", replayFoundry: "Flip-Werkstatt erneut spielen", retryPlatform: "Plattform erneut versuchen" },
    it: { preparing: "Preparazione dell'officina…", stageTitle: "Capitoli dell'officina", chapter: "Capitolo", platforms: "4 piattaforme", wideStarts: "partenza ampia", precisionFinish: "finale di precisione", newSpacing: "nuova distanza", backMain: "Torna all'inizio", backStages: "Torna ai capitoli", stageSections: "Sezioni dei capitoli", stages: "Capitoli", surface: "Capitolo {chapter} · Piattaforma {platform} / 4", ready: "Scorri verso l'alto sul contenitore.", rotation: "Osserva la rotazione…", miss: "Troppo debole o troppo fuori direzione…", perfect: "Atterraggio perfetto: la piattaforma successiva è pronta.", canvas: "Area di gioco dell'Officina del flip", hint: "Scorri verso l'alto. I gesti brevi restano bassi; quelli lunghi arrivano più lontano.", bestStreak: "Migliore serie", streak: "SERIE", best: "MIGLIORE", routeClear: "Percorso dell'officina completato", chapterClear: "Capitolo completato", failed: "Atterraggio fallito", resultCopy: "Capitolo {chapter} · Piattaforma {platform} · Serie {streak} · Migliore {best}", stagesAction: "Capitoli", nextSurface: "Piattaforma successiva", retry: "Riprova", nextChapter: "Capitolo successivo", replayFoundry: "Rigioca l'Officina del flip", retryPlatform: "Riprova la piattaforma" },
    ru: { preparing: "Мастерская готовится…", stageTitle: "Главы мастерской", chapter: "Глава", platforms: "4 платформы", wideStarts: "широкий старт", precisionFinish: "точная концовка", newSpacing: "новый интервал", backMain: "На главную", backStages: "К главам", stageSections: "Разделы глав", stages: "Главы", surface: "Глава {chapter} · Платформа {platform} / 4", ready: "Проведите по контейнеру вверх.", rotation: "Следите за вращением…", miss: "Слишком слабый бросок или сильный уход в сторону…", perfect: "Идеальная посадка — следующая платформа готова.", canvas: "Игровая зона мастерской переворотов", hint: "Проведите вверх. Короткий жест оставит контейнер ниже, длинный отправит его дальше.", bestStreak: "Лучшая серия", streak: "СЕРИЯ", best: "ЛУЧШИЙ", routeClear: "Маршрут мастерской пройден", chapterClear: "Глава пройдена", failed: "Посадка не удалась", resultCopy: "Глава {chapter} · Платформа {platform} · Серия {streak} · Лучший {best}", stagesAction: "Главы", nextSurface: "Следующая платформа", retry: "Повторить", nextChapter: "Следующая глава", replayFoundry: "Повторить мастерскую переворотов", retryPlatform: "Повторить платформу" },
    hi: { preparing: "कार्यशाला तैयार हो रही है…", stageTitle: "कार्यशाला अध्याय", chapter: "अध्याय", platforms: "4 प्लेटफ़ॉर्म", wideStarts: "खुली शुरुआत", precisionFinish: "सटीक अंत", newSpacing: "नई दूरी", backMain: "मुख्य पृष्ठ पर लौटें", backStages: "अध्यायों पर लौटें", stageSections: "अध्याय अनुभाग", stages: "अध्याय", surface: "अध्याय {chapter} · प्लेटफ़ॉर्म {platform} / 4", ready: "कंटेनर पर ऊपर की ओर स्वाइप करें।", rotation: "घुमाव देखें…", miss: "बहुत हल्का या दिशा बहुत भटकी हुई…", perfect: "बेहतरीन लैंडिंग — अगला प्लेटफ़ॉर्म तैयार है।", canvas: "फ्लिप कार्यशाला का खेल क्षेत्र", hint: "ऊपर स्वाइप करें। छोटे स्वाइप नीचे रखते हैं; लंबे स्वाइप दूर ले जाते हैं।", bestStreak: "सर्वश्रेष्ठ सिलसिला", streak: "सिलसिला", best: "सर्वश्रेष्ठ", routeClear: "कार्यशाला मार्ग पूरा", chapterClear: "अध्याय पूरा", failed: "लैंडिंग विफल", resultCopy: "अध्याय {chapter} · प्लेटफ़ॉर्म {platform} · सिलसिला {streak} · सर्वश्रेष्ठ {best}", stagesAction: "अध्याय", nextSurface: "अगला प्लेटफ़ॉर्म", retry: "फिर कोशिश करें", nextChapter: "अगला अध्याय", replayFoundry: "फ्लिप कार्यशाला फिर खेलें", retryPlatform: "प्लेटफ़ॉर्म फिर आज़माएँ" },
    ar: { preparing: "جارٍ تجهيز الورشة…", stageTitle: "فصول الورشة", chapter: "الفصل", platforms: "4 منصات", wideStarts: "بداية واسعة", precisionFinish: "نهاية دقيقة", newSpacing: "تباعد جديد", backMain: "العودة إلى الرئيسية", backStages: "العودة إلى الفصول", stageSections: "أقسام الفصول", stages: "الفصول", surface: "الفصل {chapter} · المنصة {platform} / 4", ready: "مرّر إلى الأعلى على الحاوية البلورية.", rotation: "راقب الدوران…", miss: "القوة ضعيفة أو المسار منحرف جداً…", perfect: "هبوط مثالي — المنصة التالية جاهزة.", canvas: "منطقة لعب ورشة القلب", hint: "مرّر إلى الأعلى. التمريرات القصيرة تبقي الحاوية منخفضة؛ والطويلة تجعلها تصعد أبعد.", bestStreak: "أفضل تتابع", streak: "التتابع", best: "الأفضل", routeClear: "اكتمل مسار الورشة", chapterClear: "اكتمل الفصل", failed: "فشل الهبوط", resultCopy: "الفصل {chapter} · المنصة {platform} · التتابع {streak} · الأفضل {best}", stagesAction: "الفصول", nextSurface: "المنصة التالية", retry: "إعادة المحاولة", nextChapter: "الفصل التالي", replayFoundry: "إعادة لعب ورشة القلب", retryPlatform: "إعادة محاولة المنصة" },
  };
  const storage=(()=>{try{return localStorage;}catch{return {getItem:()=>null,setItem:()=>{}};}})();
  let progress=readProgress(storage,TOTAL_STAGES),world=null;
  const pendingProgress=createProgressConfirmation(TOTAL_STAGES);
  const initialSelection=progress.cleared[6]?Math.min(TOTAL_STAGES,progress.unlocked)-1:Math.max(0,COURSES.findIndex(course=>!progress.cleared[course.id]));
  const state = { screen: "main", chapter: 1, platform: 1, selectedChapterIndex: initialSelection, stageController: null, streak: 0, best: (()=>{try{return Math.max(0,Number(storage.getItem("wp-flip-best"))||0)}catch{return 0}})(), drag: null, flight: null, raf: 0, status: "ready", resultWin: null, resultSaveConfirmed:null, cardsLocale: "", nozzle:'direct',clock:0,attempts:0,graphicsLost:false };
  __wpReady = true; __wpNotifyMeasurement();
  const currentLocale = () => localeCopy[window.WeightPlayFiveGameLocale?.locale] ? window.WeightPlayFiveGameLocale.locale : (localeCopy[document.documentElement.lang] ? document.documentElement.lang : "en");
  const copy = () => localeCopy[currentLocale()] || localeCopy.en;
  const expansion = () => campaignCopy(currentLocale(),TOTAL_STAGES);
  const stageTitle = id => `${expansion().stage} ${id} / ${TOTAL_STAGES}`;
  const fill = (value, values) => value.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
  const label = (key, values = {}) => fill(copy()[key] || localeCopy.en[key] || key, values);
  const chapterPoster = "/games/animal-flip-foundry/assets/animal-flip-foundry-cover.png";
  const chapterConfig = Object.freeze({
    gameId: "animal-flip-foundry",
    count: TOTAL_STAGES,
    poster: chapterPoster,
    background: "/assets/lobby-block-atmosphere.svg",
    stage(index) {
      if (!Number.isInteger(index) || index < 0 || index >= TOTAL_STAGES) throw new RangeError(`FLIP_CHAPTER_INDEX:${index}`);
      const id = index + 1;
      const c = copy();
      const title = stageTitle(id),e=expansion();
      const rules=[...new Set(COURSES[index].encounters.flatMap(encounter=>ruleLabels(encounter,e)))];
      const focus = id<=6?(id === 1 ? c.wideStarts : id === 6 ? c.precisionFinish : c.newSpacing):rules.join(' · ');
      return {
        id,
        kicker: id<=30?e.gearworks:e.observatory,
        title,
        subtitle: c.platforms,
        status: id>progress.unlocked?e.locked:progress.cleared[id]?e.cleared:c.platforms,
        summary: focus,
        details: [focus, `${title} · ${c.platforms}`],
        locked: id>progress.unlocked,
        cleared: Boolean(progress.cleared[id]),
        poster: chapterPoster,
      };
    },
  });
  const screenFrame = window.WeightPlayScreenFrame.mount({
    root: $("app"),
    localeSelect: $("localeSelect"),
    playUI: true,
    scenes: {
      main: {root:$("main-screen"), header:$("main-screen").querySelector("header"), content:$("main-content")},
      stage: {root:$("stage-screen"), header:$("stage-screen").querySelector("header"), content:$("stage-content")},
      battle: {root:$("battle-screen"), header:$("battle-screen").querySelector("header"), content:$("battle-play-content"), headerInfo:$("battle-info")},
    },
  });
  screenFrame.activate("main");
  state.stageController = window.WeightPlayPlayUI.mountStage({
    page:$("stage-content"),
    rail:$("stage-list"),
    config:chapterConfig,
    selected:state.selectedChapterIndex,
    onSelect:index => { state.selectedChapterIndex = index; },
    onStart:index => start(index + 1, 1),
    isActive:() => state.screen === "stage",
  });
  const saveStatuses={};
  const focusForScreen=()=>state.screen==='result'?$('retry'):state.screen==='battle'?canvas:state.screen==='stage'?document.querySelector('#stage-list button[aria-current="true"]')||$('stage-list'):$('start-game');
  for(const [screen,anchor,position] of [['main',$('main-progress'),'afterend'],['stage',$('stage-list'),'beforebegin'],['battle',$('battle-status'),'beforebegin'],['result',$('result-copy'),'afterend']]){
    const host=document.createElement('div');host.id=`${screen}-save-status`;anchor.insertAdjacentElement(position,host);
    saveStatuses[screen]=createPendingSummaryView({document,host,detailsId:`${screen}-pending-details`,focusFallback:focusForScreen});
  }
  function renderSaveStatuses(){
    const pending=pendingProgress.stages();
    for(const [screen,view] of Object.entries(saveStatuses))view.update({pending,language:currentLocale(),stage:expansion().stage,visible:state.screen===screen});
    $('result-screen').setAttribute('aria-describedby',pending.length?'result-copy result-pending-details-status':'result-copy');
  }
  const fitArena = () => {
    if (!arenaFrame || !canvas) return;
    const width = Math.max(1, arenaFrame.clientWidth);
    const height = Math.max(1, arenaFrame.clientHeight);
    const scale = Math.min(width / 960, height / 520);
    canvas.width = Math.max(960, Math.round(width / scale));
    canvas.height = Math.max(520, Math.round(height / scale));
    canvas.style.width = `${Math.max(1, Math.floor(canvas.width * scale))}px`;
    canvas.style.height = `${Math.max(1, Math.floor(canvas.height * scale))}px`;
    world?.resize(canvas.width,canvas.height,Math.floor(canvas.width*scale),Math.floor(canvas.height*scale));
    drawScene();
  };
  const scheduleArenaFit = () => requestAnimationFrame(() => requestAnimationFrame(fitArena));
  const arenaObserver = arenaFrame && typeof ResizeObserver === "function" ? new ResizeObserver(fitArena) : null;
  arenaObserver?.observe(arenaFrame);
  window.addEventListener("resize", scheduleArenaFit, { passive: true });
  if (loadingPanel) { const hideLoading = () => { loadingPanel.hidden = true; loadingPanel.classList.add("hidden"); }; if (document.readyState === "complete") hideLoading(); else window.addEventListener("load", hideLoading, { once: true }); }
  function show(name) {
    state.drag = null;
    state.charge = null;
    state.lastFrame = 0;
    audio?.stop();
    state.screen = name;
    if(name!=='result')window.WeightPlayCastle?.dismissRewardNotice?.('animal-flip-foundry');
    canvas.inert=name!=='battle';
    document.getElementById('foundry-tools')?.toggleAttribute('inert',name!=='battle');
    document.body.dataset.screen = name === "result" ? "battle" : name;
    cancelAnimationFrame(state.raf);
    const result = $("result-screen");
    document.querySelectorAll(".screen").forEach((element) => {
      const isResult = element === result && name === "result";
      const keepBattle = name === "result" && element.id === "battle-screen";
      const active = isResult || keepBattle || element.dataset.screen === name;
      element.hidden = !active;
      element.classList.toggle("active", active);
    });

    if (name === "result") {
      screenFrame.activate("battle", {covered:true});
      $("retry").focus({preventScroll:true});
      scheduleArenaFit();
    } else {
      screenFrame.activate(name);
    }
    renderSaveStatuses();
    if (name === "battle") {
      result?.setAttribute("hidden", "");
      scheduleArenaFit();
      state.raf = requestAnimationFrame(frame);
      canvas.focus({preventScroll:true});
    } else if (name === "stage") {
      state.stageController?.refresh(state.selectedChapterIndex);
      state.stageController?.select(state.selectedChapterIndex, {center:true,focus:true});
    } else if (name === "main") {
      $("start-game").focus({preventScroll:true});
    }
    { const __wpNextScreen = ({main:"main",stage:"stage",battle:"battle",})[name] ?? null;
      if (["result"].includes(name) && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "complete"; }
      else if (true && (__wpNextScreen === "main" || __wpNextScreen === "stage") && __wpMeasurement.screen === "battle" && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "abandon"; }
      __wpMeasurement.screen = __wpNextScreen;  __wpNotifyMeasurement(); }
}
  function cards() {
    state.cardsLocale = currentLocale();
    state.stageController?.refresh(state.selectedChapterIndex);
    state.stageController?.select(state.selectedChapterIndex, {center:true});
  }
  const audio = window.WeightPlayAudio?.createScope();
  window.WeightPlayAudio?.preload(['projectile.launch','movement.land','mechanism.unlock','result.lose','result.win'])?.catch(()=>{});
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const tools=document.createElement('div');tools.id='foundry-tools';
  tools.innerHTML='<div class="foundry-nozzle"><button id="foundry-direct" type="button"></button><button id="foundry-loft" type="button"></button></div><button id="foundry-invert" type="button"></button><output id="foundry-charge"></output>';
  $('reset-surface').removeAttribute('data-wp-battle-utility');$('reset-surface').removeAttribute('data-wp-primary-action');tools.append($('reset-surface'));
  document.querySelector('.touch-hint').before(tools);
  const recovery=document.createElement('div');recovery.className='foundry-recovery';recovery.hidden=true;
  recovery.innerHTML='<p></p><button type="button"></button>';arenaFrame.append(recovery);
  function createWorld(){
    try{world?.dispose();world=new FoundryScene(arenaFrame,()=>{state.graphicsLost=true;state.drag=null;state.charge=null;recovery.hidden=false;},()=>{state.graphicsLost=false;recovery.hidden=true;state.lastFrame=0;state.accumulator=0;fitArena();});state.graphicsLost=false;recovery.hidden=true;fitArena();}
    catch(error){state.graphicsLost=true;recovery.hidden=false;console.warn('FOUNDRY_WEBGL_UNAVAILABLE',error.message);}
  }
  recovery.querySelector('button').addEventListener('click',createWorld);
  function chooseNozzle(value){if(state.screen!=='battle'||state.flight||state.settle||state.chapter<7)return;state.nozzle=value;updateTools();drawScene();canvas.focus({preventScroll:true});}
  $('foundry-direct').addEventListener('click',()=>chooseNozzle('direct'));
  $('foundry-loft').addEventListener('click',()=>chooseNozzle('loft'));
  $('foundry-invert').addEventListener('click',pulse);
  function pulse(){
    if(state.screen!=='battle'||document.hidden||state.graphicsLost||!state.flight)return;
    const next=invert(state.flight,config()),e=expansion();
    if(next){state.flight=next;audio?.play('mechanism.unlock');updateTools();}
    else setStatus(state.flight.cells?e.blocked:e.spent);
  }
  function updateTools(){
    const c=config(),e=expansion();tools.hidden=false;tools.querySelector('.foundry-nozzle').hidden=state.chapter<7;
    $('foundry-direct').textContent=e.direct;$('foundry-loft').textContent=e.loft;
    tools.querySelector('.foundry-nozzle').setAttribute('aria-label',e.nozzle);
    for(const name of ['direct','loft']){$('foundry-'+name).disabled=!!state.flight||!!state.settle;$('foundry-'+name).setAttribute('aria-pressed',String(state.nozzle===name));}
    $('foundry-invert').hidden=!c.polarity;$('foundry-invert').textContent=e.invert;
    $('foundry-invert').disabled=!canInvert(state.flight,c);
    $('foundry-charge').hidden=!c.polarity;
    $('foundry-charge').textContent=`${(state.flight?.sign??c.polarity)>0?'+':'−'} · ${e.cell} ${state.flight?.cells??1} / 1`;
    recovery.querySelector('p').textContent=e.webgl;recovery.querySelector('button').textContent=e.recover;
  }
  const clarity = CLARITY_COPY;
  const tip = n => (clarity[currentLocale()] || clarity.en)[n] || (clarity[currentLocale()] || clarity.en)[n === 13 ? 6 : n === 14 ? 7 : n];
  function updateGuide() {
    const guide = document.querySelector('.game-page-info');
    if (!guide) return;
    const e=expansion(),intro=guide.querySelector('.game-info-title > p');if(intro)intro.textContent=e.intro;
    const host=guide.querySelector('.game-info-sections');if(!host)return;
    const related=host.querySelector('.game-info-related-section');
    const sections=[[e.gearworks,tip(1)+' '+e.aimGuide],[e.observatory,e.magnetGuide],[`${e.stage} 1–${TOTAL_STAGES}`,e.saveGuide]];
    host.replaceChildren(...sections.map(([heading,copy])=>{const section=document.createElement('div');section.className='game-info-section';const h=document.createElement('h3'),p=document.createElement('p');h.textContent=heading;p.textContent=copy;section.append(h,p);return section;}),...(related?[related]:[]));
  }
  const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
  const save = (key,value) => { try { localStorage.setItem(key,String(value)); } catch {} };
  function config() {
    return COURSES[state.chapter-1].encounters[state.platform-1];
  }
  function trajectory(force) {
    const c=config(),result=simulate(c,force,state.nozzle,state.clock,suggestedPulseWindows(c)||[]);
    return {...result.flight,points:result.path.filter((_,i)=>i%4===0),t:result.flight.age,hit:result.hit};
  }
  function setStatus(text){ const el=$('battle-status'); if(el.textContent!==text) el.textContent=text; }
  function forceNow(){ return state.charge!==null && state.charge!==undefined ? clamp((performance.now()-state.charge)*.16,0,300) : state.drag?.force || 0; }
  function renderResult() { if (state.resultWin === null) return; const c = copy(),e=expansion(); const nextAvailable = state.resultWin && state.chapter < TOTAL_STAGES; $("result-title").textContent = state.resultWin ? (state.chapter === TOTAL_STAGES ? c.routeClear : e.cleared) : c.failed; $("result-copy").textContent = (state.resultWin ? c.platforms : state.missReason || tip(6)) + " · " + stageTitle(state.chapter) + " · " + label("resultCopy", { chapter: Math.ceil(state.chapter/30), platform: state.platform, streak: state.streak, best: state.best }); $("to-stages").textContent = e.stage; $("retry").textContent = c.retry; $("next").textContent = nextAvailable?`${e.stage} ${state.chapter+1}`:c.nextChapter; $("next").disabled = !nextAvailable; $("next").setAttribute("aria-disabled", String(!nextAvailable)); }
  function renderLocalized() {
    const c = copy();
    const mainTitle = document.querySelector(".main-title")?.textContent || "Flip Foundry";
    document.querySelector(".main-summary")?.removeAttribute("data-five-copy");
    $("loadingPanel")?.querySelector("strong")?.replaceChildren(document.createTextNode(mainTitle));
    $("loadingPanel")?.querySelector("span")?.replaceChildren(document.createTextNode(c.preparing));
    document.querySelector("#stage-screen h2").textContent = expansion().stage;
    document.querySelector('#stage-screen [data-wp-return="stage"]').setAttribute("aria-label", c.backMain);
    const stageNavigation = document.querySelector("#stage-screen [data-wp-frame-nav]");
    if (stageNavigation) {
      stageNavigation.setAttribute("aria-label", `${expansion().stage} 1–${TOTAL_STAGES}`);
      const stageTab = stageNavigation.querySelector("button");
      if (stageTab) stageTab.textContent = expansion().stage;
    }
    document.querySelector('#battle-screen [data-wp-return="battle"]').setAttribute("aria-label", expansion().stage);
    $("reset-surface").textContent = "↻";
    $("reset-surface").title = c.retry;
    $("reset-surface").setAttribute("aria-label", c.retry);
    $("arena").setAttribute("aria-label", c.canvas);
    $("main-progress").textContent = `${expansion().cleared}: ${Object.keys(progress.cleared).length} / ${TOTAL_STAGES} · ${c.bestStreak}: ${state.best}`;
    $("surface-label").textContent = `${state.chapter} / ${TOTAL_STAGES}`;
    $("chapter-stat-label").textContent = expansion().stage;
    $("streak-stat-label").textContent = c.streak;
    $("best-stat-label").textContent = c.best;
    $("streak-label").textContent = String(state.streak);
    $("best-streak-label").textContent = String(state.best);
    $("battle-status").textContent = state.status === "ready" ? tip(4) : state.status === "perfect" ? tip(11) : label(state.status);
    document.querySelector(".touch-hint").textContent = state.chapter<=6?tip(1):ruleLabels(config(),expansion()).join(' · ');
    document.querySelector(".main-summary").textContent = expansion().intro;
    canvas.setAttribute("aria-label", `${c.canvas}. ${expansion().stage} ${state.chapter} / ${TOTAL_STAGES}. ${state.platform} / 4. ${tip(10)}`);
    if (state.cardsLocale !== currentLocale()) cards();
    renderSaveStatuses();
    renderResult();
    updateTools();
    drawScene();
  }
  function start(chapter = 1, platform = 1) { if(!Number.isInteger(chapter)||chapter<1||chapter>TOTAL_STAGES||chapter>progress.unlocked||!Number.isInteger(platform)||platform<1||platform>4)return; if(platform===1||chapter!==state.chapter)state.attempts=0;state.chapter = chapter; state.platform = platform; state.selectedChapterIndex = chapter - 1; state.streak = 0; state.flight = null; state.settle = null; state.accumulator = 0; state.charge = null; state.clock=0;state.nozzle='direct';state.status = "ready"; state.resultWin = null; state.resultSaveConfirmed=null; show("battle"); renderLocalized();
    __wpMeasurement.roundKey = {}; __wpMeasurement.restart = false; __wpMeasurement.started = true; __wpMeasurement.ended = false; __wpMeasurement.outcome = "complete"; __wpMeasurement.saveSucceeded = null; __wpMeasurement.screen = "battle"; __wpNotifyMeasurement();
}
  function launch(force) {
    if(state.flight || state.settle || state.screen!=='battle'||state.graphicsLost||document.hidden) return;
    if(force<16){setStatus(tip(4));return;}
    const c=config(),prediction=trajectory(force);state.attempts++;
    state.flight={...launchState(c,force,state.nozzle,state.clock),duration:prediction.t,angle:0,trail:[]};
    state.lastFrame=0;state.status='rotation';state.missReason='';
    setStatus(copy().rotation); audio?.play('projectile.launch');
  }
  function tick(){
    state.clock++;
    if(state.settle){
      state.settle.t--;
      if(state.settle.t<=0){const win=state.settle.win;state.settle=null;state.flight=null;if(win && state.platform<4){state.platform++;state.clock=0;state.status='perfect';renderLocalized();}else finish(win);}
      return;
    }
    if(!state.flight)return;
    const c=config(),f=stepFlight(state.flight,c);state.flight=f;
    f.angle=Math.min(1,f.age/f.duration)*Math.PI*2;
    f.trail.push({x:f.x,y:f.y}); if(f.trail.length>14)f.trail.shift();
    updateTools();
    if(f.status==='landed'){f.angle=0;resolveLanding(true);return;}
    if(f.status==='miss'){const e=expansion();state.missReason=({ring:e.ringMiss,roof:e.roofMiss,polarity:e.signMiss,short:tip(6),long:tip(7)})[f.reason];resolveLanding(false);}
  }
  function frame(now){
    if(state.screen!=='battle')return;
    if(!document.hidden&&!state.graphicsLost){
      const elapsed=state.lastFrame?Math.min(50,now-state.lastFrame):16.667;
      state.accumulator=(state.accumulator||0)+elapsed;
      while(state.accumulator>=16.667){tick();state.accumulator-=16.667;}
      drawScene();
    }
    state.lastFrame=now;
    if(state.screen==='battle')state.raf=requestAnimationFrame(frame);
  }
  function rect(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(x,y,w,h);}
  function text(value,x,y,size=24,color='#ecf6ff',align='left'){
    ctx.save();ctx.fillStyle=color;ctx.font=`700 ${size}px system-ui`;ctx.textAlign=align;ctx.direction=currentLocale()==='ar'?'rtl':'ltr';ctx.fillText(value,x,y);ctx.restore();
  }
  function drawScene(){
    const c=config(),h=canvas.height,f=state.flight,offset=h-135,e=expansion();
    const target=targetAt(c,state.clock);
    world?.draw(c,{height:h,clock:state.clock,flight:f,angle:f?.angle||0,nozzle:state.nozzle,reduced:reducedMotion.matches,stage:state.chapter,settle:state.settle});
    ctx.clearRect(0,0,canvas.width,h);ctx.save();ctx.translate((canvas.width-960)/2,offset);
    text(state.chapter<=30?e.gearworks:e.observatory,48,58-offset,25,'#b5d4dc');
    for(let i=0;i<4;i++){const x=690+i*58;rect(x,32-offset,40,10,i<state.platform-1?'#7cebc5':i===state.platform-1?'#ffca78':'#365563');text(String(i+1),x+20,77-offset,19,'#c7e1e5','center');}
    if(c.wind)text(c.wind>0?'→ → →':'← ← ←',810,150-offset,26,'#9ed9ef','center');
    c.fields.forEach(field=>text(field.wind>0?'→ → →':'← ← ←',field.x+field.width/2,-265,25,'#80cee8','center'));
    c.rings.forEach((r,i)=>{
      const passed=f&&f.ring>i,color=passed?'#7cebc5':r.sign<0?'#eeb6ff':r.sign>0?'#9ee8ff':'#ffca78';
      ctx.strokeStyle=color;ctx.lineWidth=3;ctx.setLineDash([5,7]);ctx.strokeRect(r.x-12,r.y-r.radius,24,r.radius*2);ctx.setLineDash([]);
      text(passed?'✓':r.sign?(r.sign>0?'+':'−'):String(i+1),r.x,r.y-r.radius-23,31,color,'center');
      if(r.relay)text('↻',r.x+32,r.y+r.radius+39,25,'#b0ffe0','center');
    });
    c.silence.forEach(z=>text('E ×',(z[0]+z[1])/2,-315,22,'#d0cfe2','center'));
    if(c.receiverSign)text(c.receiverSign>0?'+':'−',target.x,target.y-88,35,'#e7dcff','center');
    text(tip(2),190,48,21,'#c3dde2','center');text(tip(3),target.x,target.y-64,22,'#c1f2db','center');
    const force=forceNow();
    if(!f&&!state.settle){
      const aiming=!!state.drag||state.charge!=null,preview=trajectory(aiming?force:150);
      ctx.strokeStyle=aiming?(preview.hit?'#8bf0bd':'#ffca78'):'#9fbeca77';ctx.lineWidth=3;ctx.setLineDash(aiming?[]:[5,10]);
      ctx.beginPath();ctx.moveTo(190,-36);preview.points.forEach(p=>ctx.lineTo(p.x,p.y));ctx.stroke();ctx.setLineDash([]);
      for(const x of suggestedPulseWindows(c)||[]){const p=preview.points.find(p=>p.x>=x);if(p){ctx.strokeStyle='#ddc9ff';ctx.lineWidth=2;ctx.strokeRect(x-13,p.y-58,26,116);text('E',x,p.y-68,23,'#f3dfff','center');}}
      if(aiming){ctx.strokeStyle=preview.hit?'#8bf0bd':'#ffca78';ctx.lineWidth=3;ctx.strokeRect(preview.x-22,preview.y-34,44,68);const reason=({ring:e.ringMiss,roof:e.roofMiss,polarity:e.signMiss})[preview.reason];setStatus(preview.hit?tip(8):reason|| (preview.x<target.x?tip(13):tip(14)));}
      else text('↑',190,-112,56,'#ffca78','center');
      rect(48,87,864,9,'#365462');rect(48,87,864*force/300,9,preview.hit?'#7cebc5':'#ffca78');
      if(aiming)text(tip(5),480,64,21,'#f2f7ef','center');
    }else if(f&&!reducedMotion.matches){f.trail.forEach((p,i)=>{ctx.globalAlpha=i/f.trail.length*.3;rect(p.x-3,p.y-3,6,6,'#b6ffdf');});ctx.globalAlpha=1;}
    if(state.settle?.win)text(tip(11),480,target.y-170,32,'#b5f3d6','center');
    ctx.restore();
  }
  function resolveLanding(win){
    const f=state.flight;if(!f)return;
    if(win){state.streak++;state.best=Math.max(state.best,state.streak);save('wp-flip-best',state.best);audio?.play('movement.land');setStatus(tip(11));}
    else{audio?.play('result.lose');setStatus(state.missReason||tip(6));}
    state.settle={win,t:36,x:f.x}; if(!win)state.flight=null;
  }
  function finish(win){let saved=false;if(win){pendingProgress.win(state.chapter,state.attempts);const ticket=pendingProgress.ticket();const result=persistProgressChecked(storage,completeStage(progress,state.chapter,state.attempts,TOTAL_STAGES),TOTAL_STAGES,ticket);progress=result.progress;saved=result.saved;pendingProgress.confirm(result.confirmation);}state.resultWin=win;state.resultSaveConfirmed=win?saved:null;state.status=win?'perfect':'miss';__wpMeasurement.ended=true;__wpMeasurement.outcome=win?'win':'lose';__wpMeasurement.saveSucceeded=saved;renderLocalized();show('result');
    if(win)audio?.play('result.win');
    __wpMeasurement.ended=true;__wpMeasurement.outcome=win?'win':'lose';__wpMeasurement.screen=null;__wpNotifyMeasurement();
  }
  function pos(event) { const rect = canvas.getBoundingClientRect(); return { x: (event.clientX - rect.left) * canvas.width / rect.width, y: (event.clientY - rect.top) * canvas.height / rect.height }; }
  canvas.tabIndex=0;
  canvas.setAttribute('role','application');
  canvas.addEventListener('pointerdown',event=>{
    if(state.screen!=='battle'||state.graphicsLost||state.flight||state.settle||state.drag||state.charge!=null||event.button>0)return;
    canvas.focus({preventScroll:true});canvas.setPointerCapture(event.pointerId);
    state.drag={...pos(event),id:event.pointerId,force:0};setStatus(tip(4));
  });
  canvas.addEventListener('pointermove',event=>{if(state.drag?.id!==event.pointerId)return;state.drag.force=clamp(state.drag.y-pos(event).y,0,300);});
  canvas.addEventListener('pointerup',event=>{
    if(state.drag?.id!==event.pointerId)return;
    const force=clamp(state.drag.y-pos(event).y,0,300);state.drag=null;launch(force);
  });
  ['pointercancel','lostpointercapture'].forEach(name=>canvas.addEventListener(name,()=>{state.drag=null;}));
  canvas.addEventListener('keydown',event=>{if(state.screen!=='battle'||state.graphicsLost)return;if(event.code==='KeyE'){event.preventDefault();if(!event.repeat)pulse();return;}if(event.code==='KeyQ'){event.preventDefault();if(!event.repeat)chooseNozzle(state.nozzle==='direct'?'loft':'direct');return;}if(event.code!=='Space')return;event.preventDefault();if(!event.repeat&&!state.flight&&!state.settle&&!state.drag)state.charge=performance.now();});
  canvas.addEventListener('keyup',event=>{if(event.code!=='Space'||state.charge==null)return;event.preventDefault();const force=forceNow();state.charge=null;launch(force);});
  canvas.addEventListener('blur',()=>{state.charge=null;state.drag=null;});
  document.addEventListener('visibilitychange',()=>{state.drag=null;state.charge=null;state.lastFrame=0;state.accumulator=0;});
  window.addEventListener('pagehide',()=>{cancelAnimationFrame(state.raf);audio?.dispose();arenaObserver?.disconnect();world?.dispose();});
  $("start-game").addEventListener("click", () => { show("stage"); renderLocalized(); });
  document.querySelectorAll("[data-back]").forEach((button) => button.addEventListener("click", () => { show(button.dataset.back); renderLocalized(); }));
  $("reset-surface").addEventListener("click", () => __wpReplayStart(() => start(state.chapter, state.platform)));
  $("retry").addEventListener("click", () => __wpReplayStart(() => start(state.chapter, state.platform)));
  $("next").addEventListener("click", () => { if (!state.resultWin || state.chapter >= TOTAL_STAGES) return; start(state.chapter + 1, 1); });
  $("to-stages").addEventListener("click", () => { show("stage"); renderLocalized(); });
  const bindLocale = () => { renderLocalized(); updateGuide(); $("localeSelect")?.addEventListener("change", () => setTimeout(()=>{renderLocalized();updateGuide();}, 0)); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bindLocale, { once: true }); else bindLocale();
  createWorld();
  Object.defineProperty(window,'FlipFoundryDiagnostics',{value:Object.freeze({snapshot:()=>structuredClone({screen:state.screen,stage:state.chapter,platform:state.platform,total:TOTAL_STAGES,clock:state.clock,nozzle:state.nozzle,flight:state.flight,settle:state.settle,unlocked:progress.unlocked,cleared:Object.keys(progress.cleared).map(Number),resultWin:state.resultWin,attempts:state.attempts,graphicsLost:state.graphicsLost,render:world?.stats()})}),writable:false});
  cards();
  renderLocalized();
  window.addEventListener("load",()=>{renderLocalized();updateGuide();},{once:true});
})();
