/* Canopy Cut v17: game-owned simulation and declared shared scene slots. */
(() => {
  const practiceRequested=location.protocol==='http:'&&['localhost','127.0.0.1','[::1]'].includes(location.hostname)&&new URLSearchParams(location.search).get('practice')==='1';
  let practiceAuthorized=false,practiceStarting=false,dawn=null,dawnCopy=null,practiceAdapter=null,stagePageStart=0;
  /* WP-GAME-ANALYTICS-ADAPTER */
  // Only replayable lifecycle signals live here; all metrics/timers/GA4 stay shared.
  const __wpMeasurement = { screen: null, roundKey: null, started: false, ended: false, restart: false, outcome: "complete" };
  const __wpReadMeasurement = () => ({ ...__wpMeasurement,
    screen: ((({main:"main",stage:"stage",battle:"battle",})[state.screen] ?? null) === "battle" && (__wpMeasurement.ended)) ? null : (({main:"main",stage:"stage",battle:"battle",})[state.screen] ?? null), ended: Boolean(__wpMeasurement.ended), outcome: __wpMeasurement.outcome,
    paused: Boolean(state?.paused || state?.suspended), stageId: state.stage, node: document.body,
    activityMode: "input", idleSeconds: 300
  });
  function __wpNotifyMeasurement() { if(practiceRequested)return;try { window.WonderAnalytics?.game?.observeState(__wpReadMeasurement); } catch { /* Optional telemetry. */ } }
  // Explicit authored replay actions count only when a new round was actually created.
  function __wpReplayStart(action) {
    const previous = __wpMeasurement.roundKey, value = action();
    if (__wpMeasurement.roundKey !== previous) { __wpMeasurement.restart = true; __wpNotifyMeasurement(); }
    return value;
  }
  window.addEventListener("weightplay:analytics-ready", __wpNotifyMeasurement);
  __wpNotifyMeasurement();

  const $ = (id) => document.getElementById(id);
  if(practiceRequested&&$('localeSelect'))$('localeSelect').disabled=true;
  const emitAnalytics = (event, detail = {}) => {
    if(practiceRequested)return;
    try {
      window.dispatchEvent(new CustomEvent("wp-canopy-analytics", { detail: { event, ...detail } }));
    } catch {
      // Analytics must never block a player action or alter the game state.
    }
  };
  const loadingPanel = $("loadingPanel");
  if (loadingPanel) { const hideLoading = () => { loadingPanel.hidden = true; loadingPanel.classList.add("hidden"); }; if (document.readyState === "complete") hideLoading(); else window.addEventListener("load", hideLoading, { once: true }); }
  const canvas = $("arena");
  const ctx = canvas.getContext("2d");
  const propArt = new Image();
  propArt.src = "assets/animal-canopy-cut-props.png";
  const localeCopy = {
    en: { stageTitle: "Harvest Chapters", chapter: "Chapter", waves: "5 waves", learnPath: "learn the path", fasterArcs: "faster arcs", backMain: "Back to Main", backStages: "Back to Stages", stageSections: "Stage sections", stages: "Stages", waveLabel: "Chapter {chapter} · Wave {wave} / 5", ready: "Ready…", swipe: "Swipe safe fruit.", seedPod: "Seed pod! Chain ended.", chain: "Chain x{chain}!", clean: "Clean harvest!", waveEnded: "Wave ended", waveClear: "Wave clear", resultCopy: "Chapter {chapter} · Wave {wave} · Score {score} · Chain {chain} · Best {best}", nextWave: "Next Wave", retry: "Retry", replay: "Replay Canopy", canvas: "Canopy Cut play area", hint: "Drag across targets. A dark seed pod ends the chain.", bestScore: "Best score" },
    "zh-Hant": { stageTitle: "樹冠章節", chapter: "第", waves: "5 波", learnPath: "熟悉路線", fasterArcs: "更快弧線", backMain: "返回主頁", backStages: "返回關卡", stageSections: "關卡區域", stages: "關卡", waveLabel: "第 {chapter} 章 · 波次 {wave} / 5", ready: "準備好了……", swipe: "滑過安全果實。", seedPod: "種莢！連擊結束。", chain: "連擊 x{chain}！", clean: "採收漂亮！", waveEnded: "波次結束", waveClear: "波次完成", resultCopy: "第 {chapter} 章 · 波次 {wave} · 分數 {score} · 連擊 {chain} · 最佳 {best}", nextWave: "下一波", retry: "重試", replay: "重玩樹冠快採", canvas: "樹冠快採遊戲區", hint: "劃過目標。深色種莢會結束連擊。", bestScore: "最佳成績" },
    "zh-Hans": { stageTitle: "树冠章节", chapter: "第", waves: "5 波", learnPath: "熟悉路线", fasterArcs: "更快弧线", backMain: "返回主页", backStages: "返回关卡", stageSections: "关卡区域", stages: "关卡", waveLabel: "第 {chapter} 章 · 波次 {wave} / 5", ready: "准备好了……", swipe: "划过安全果实。", seedPod: "种荚！连击结束。", chain: "连击 x{chain}！", clean: "采收漂亮！", waveEnded: "波次结束", waveClear: "波次完成", resultCopy: "第 {chapter} 章 · 波次 {wave} · 分数 {score} · 连击 {chain} · 最佳 {best}", nextWave: "下一波", retry: "重试", replay: "重玩树冠快切", canvas: "树冠快切游戏区", hint: "划过目标。深色种荚会结束连击。", bestScore: "最佳成绩" },
    ja: { stageTitle: "キャノピーのチャプター", chapter: "チャプター", waves: "5ウェーブ", learnPath: "道筋を覚える", fasterArcs: "速い弧", backMain: "メインへ戻る", backStages: "ステージへ戻る", stageSections: "ステージ区画", stages: "ステージ", waveLabel: "チャプター {chapter} · ウェーブ {wave} / 5", ready: "準備完了…", swipe: "安全な果実をなぞってください。", seedPod: "種のさや！連続が終了しました。", chain: "チェーン x{chain}!", clean: "きれいな収穫！", waveEnded: "ウェーブ終了", waveClear: "ウェーブクリア", resultCopy: "チャプター {chapter} · ウェーブ {wave} · スコア {score} · チェーン {chain} · ベスト {best}", nextWave: "次のウェーブ", retry: "リトライ", replay: "キャノピーカットを再プレイ", canvas: "キャノピーカットのプレイエリア", hint: "ターゲットをなぞります。暗い種のさやでチェーンが終了します。", bestScore: "ベストスコア" },
    ko: { stageTitle: "캐노피 챕터", chapter: "챕터", waves: "웨이브 5개", learnPath: "경로 익히기", fasterArcs: "더 빠른 궤적", backMain: "메인으로 돌아가기", backStages: "스테이지로 돌아가기", stageSections: "스테이지 구역", stages: "스테이지", waveLabel: "챕터 {chapter} · 웨이브 {wave} / 5", ready: "준비 완료…", swipe: "안전한 과일을 스와이프하세요.", seedPod: "씨앗 꼬투리! 연속이 끝났습니다.", chain: "연속 x{chain}!", clean: "깔끔한 수확!", waveEnded: "웨이브 종료", waveClear: "웨이브 클리어", resultCopy: "챕터 {chapter} · 웨이브 {wave} · 점수 {score} · 연속 {chain} · 최고 {best}", nextWave: "다음 웨이브", retry: "다시 시도", replay: "캐노피 컷 다시 하기", canvas: "캐노피 컷 플레이 영역", hint: "대상을 가로질러 스와이프하세요. 어두운 씨앗 꼬투리를 맞히면 연속이 끝납니다.", bestScore: "최고 점수" },
    es: { stageTitle: "Capítulos de la copa", chapter: "Capítulo", waves: "5 oleadas", learnPath: "aprende la ruta", fasterArcs: "arcos más rápidos", backMain: "Volver al inicio", backStages: "Volver a las fases", stageSections: "Secciones de fases", stages: "Fases", waveLabel: "Capítulo {chapter} · Oleada {wave} / 5", ready: "Listo…", swipe: "Desliza por la fruta segura.", seedPod: "¡Vaina de semillas! La racha terminó.", chain: "¡Cadena x{chain}!", clean: "¡Cosecha limpia!", waveEnded: "Oleada terminada", waveClear: "Oleada superada", resultCopy: "Capítulo {chapter} · Oleada {wave} · Puntuación {score} · Cadena {chain} · Mejor {best}", nextWave: "Siguiente oleada", retry: "Reintentar", replay: "Repetir Corte de la copa", canvas: "Zona de juego Corte de la copa", hint: "Desliza por los objetivos. Una vaina oscura termina la cadena.", bestScore: "Mejor puntuación" },
    "pt-BR": { stageTitle: "Capítulos da copa", chapter: "Capítulo", waves: "5 ondas", learnPath: "aprenda o caminho", fasterArcs: "arcos mais rápidos", backMain: "Voltar ao início", backStages: "Voltar às fases", stageSections: "Seções de fases", stages: "Fases", waveLabel: "Capítulo {chapter} · Onda {wave} / 5", ready: "Pronto…", swipe: "Deslize pelas frutas seguras.", seedPod: "Vagem de sementes! A sequência terminou.", chain: "Sequência x{chain}!", clean: "Colheita limpa!", waveEnded: "Onda encerrada", waveClear: "Onda concluída", resultCopy: "Capítulo {chapter} · Onda {wave} · Pontuação {score} · Sequência {chain} · Melhor {best}", nextWave: "Próxima onda", retry: "Tentar de novo", replay: "Repetir Corte na Copa", canvas: "Área de jogo Corte na Copa", hint: "Deslize pelos alvos. Uma vagem escura encerra a sequência.", bestScore: "Melhor pontuação" },
    fr: { stageTitle: "Chapitres de la canopée", chapter: "Chapitre", waves: "5 vagues", learnPath: "apprendre le chemin", fasterArcs: "arcs plus rapides", backMain: "Retour à l'accueil", backStages: "Retour aux niveaux", stageSections: "Sections des niveaux", stages: "Niveaux", waveLabel: "Chapitre {chapter} · Vague {wave} / 5", ready: "Prêt…", swipe: "Glisse sur les fruits sûrs.", seedPod: "Gousse de graines ! La série est terminée.", chain: "Série x{chain} !", clean: "Récolte parfaite !", waveEnded: "Vague terminée", waveClear: "Vague réussie", resultCopy: "Chapitre {chapter} · Vague {wave} · Score {score} · Série {chain} · Meilleur {best}", nextWave: "Vague suivante", retry: "Réessayer", replay: "Rejouer Coupe de la canopée", canvas: "Zone de jeu Coupe de la canopée", hint: "Glisse sur les cibles. Une gousse sombre termine la série.", bestScore: "Meilleur score" },
    de: { stageTitle: "Kronen-Schnitt-Kapitel", chapter: "Kapitel", waves: "5 Wellen", learnPath: "den Weg lernen", fasterArcs: "schnellere Bögen", backMain: "Zur Startseite", backStages: "Zu den Stufen", stageSections: "Stufenbereiche", stages: "Stufen", waveLabel: "Kapitel {chapter} · Welle {wave} / 5", ready: "Bereit…", swipe: "Wische über sichere Früchte.", seedPod: "Samenschote! Die Serie ist beendet.", chain: "Serie x{chain}!", clean: "Saubere Ernte!", waveEnded: "Welle beendet", waveClear: "Welle geschafft", resultCopy: "Kapitel {chapter} · Welle {wave} · Punkte {score} · Serie {chain} · Beste {best}", nextWave: "Nächste Welle", retry: "Erneut versuchen", replay: "Kronen-Schnitt erneut spielen", canvas: "Spielbereich Kronen-Schnitt", hint: "Wische über die Ziele. Eine dunkle Samenschote beendet die Serie.", bestScore: "Bester Score" },
    it: { stageTitle: "Capitoli del taglio nella chioma", chapter: "Capitolo", waves: "5 ondate", learnPath: "impara il percorso", fasterArcs: "archi più rapidi", backMain: "Torna all'inizio", backStages: "Torna ai livelli", stageSections: "Sezioni dei livelli", stages: "Livelli", waveLabel: "Capitolo {chapter} · Ondata {wave} / 5", ready: "Pronto…", swipe: "Scorri sulla frutta sicura.", seedPod: "Baccello! La serie è terminata.", chain: "Serie x{chain}!", clean: "Raccolto perfetto!", waveEnded: "Ondata terminata", waveClear: "Ondata superata", resultCopy: "Capitolo {chapter} · Ondata {wave} · Punteggio {score} · Serie {chain} · Migliore {best}", nextWave: "Ondata successiva", retry: "Riprova", replay: "Rigioca Taglio nella chioma", canvas: "Area di gioco Taglio nella chioma", hint: "Scorri sui bersagli. Un baccello scuro termina la serie.", bestScore: "Miglior punteggio" },
    ru: { stageTitle: "Главы среза кроны", chapter: "Глава", waves: "5 волн", learnPath: "изучите путь", fasterArcs: "быстрые дуги", backMain: "На главную", backStages: "К уровням", stageSections: "Разделы уровней", stages: "Уровни", waveLabel: "Глава {chapter} · Волна {wave} / 5", ready: "Готово…", swipe: "Проведите по безопасным фруктам.", seedPod: "Семенной стручок! Серия завершена.", chain: "Серия x{chain}!", clean: "Чистый сбор!", waveEnded: "Волна завершена", waveClear: "Волна пройдена", resultCopy: "Глава {chapter} · Волна {wave} · Счёт {score} · Серия {chain} · Лучший {best}", nextWave: "Следующая волна", retry: "Повторить", replay: "Повторить срез в кронах", canvas: "Игровая зона среза кроны", hint: "Проводите по целям. Тёмный семенной стручок завершает серию.", bestScore: "Лучший счёт" },
    hi: { stageTitle: "कैनोपी अध्याय", chapter: "अध्याय", waves: "5 लहरें", learnPath: "रास्ता सीखें", fasterArcs: "तेज़ चाप", backMain: "मुख्य पृष्ठ पर लौटें", backStages: "स्तरों पर लौटें", stageSections: "स्तर अनुभाग", stages: "स्तर", waveLabel: "अध्याय {chapter} · लहर {wave} / 5", ready: "तैयार…", swipe: "सुरक्षित फलों पर स्वाइप करें।", seedPod: "बीज की फली! सिलसिला समाप्त।", chain: "सिलसिला x{chain}!", clean: "साफ़ कटाई!", waveEnded: "लहर समाप्त", waveClear: "लहर पूरी", resultCopy: "अध्याय {chapter} · लहर {wave} · स्कोर {score} · सिलसिला {chain} · सर्वश्रेष्ठ {best}", nextWave: "अगली लहर", retry: "फिर कोशिश करें", replay: "कैनोपी कट फिर खेलें", canvas: "कैनोपी कट का खेल क्षेत्र", hint: "लक्ष्यों पर स्वाइप करें। गहरे रंग की बीज फली सिलसिला समाप्त कर देती है।", bestScore: "सर्वश्रेष्ठ स्कोर" },
    ar: { stageTitle: "فصول قطع المظلة", chapter: "الفصل", waves: "5 موجات", learnPath: "تعلّم المسار", fasterArcs: "أقواس أسرع", backMain: "العودة إلى الرئيسية", backStages: "العودة إلى المراحل", stageSections: "أقسام المراحل", stages: "المراحل", waveLabel: "الفصل {chapter} · الموجة {wave} / 5", ready: "جاهز…", swipe: "مرّر على الثمار الآمنة.", seedPod: "قرن البذور! انتهى التتابع.", chain: "التتابع x{chain}!", clean: "حصاد نظيف!", waveEnded: "انتهت الموجة", waveClear: "اكتملت الموجة", resultCopy: "الفصل {chapter} · الموجة {wave} · النتيجة {score} · التتابع {chain} · الأفضل {best}", nextWave: "الموجة التالية", retry: "إعادة المحاولة", replay: "إعادة قطع مظلة الأشجار", canvas: "منطقة لعب قطع المظلة", hint: "مرّر عبر الأهداف. ينهي قرن البذور الداكن التتابع.", bestScore: "أفضل نتيجة" },
  };
  const keyCopy = {
    en: { label: "Target key", safe: "Safe fruit", hazard: "Dark seed pod" },
    "zh-Hant": { label: "目標圖例", safe: "安全果實", hazard: "深色種莢" },
    "zh-Hans": { label: "目标图例", safe: "安全果实", hazard: "深色种荚" },
    ja: { label: "ターゲット凡例", safe: "安全な果実", hazard: "暗い種のさや" },
    ko: { label: "대상 키", safe: "안전한 과일", hazard: "어두운 씨앗 꼬투리" },
    es: { label: "Clave de objetivos", safe: "Fruta segura", hazard: "Vaina de semillas oscura" },
    "pt-BR": { label: "Legenda dos alvos", safe: "Fruta segura", hazard: "Vagem de sementes escura" },
    fr: { label: "Légende des cibles", safe: "Fruit sûr", hazard: "Gousse sombre" },
    de: { label: "Ziel-Legende", safe: "Sichere Frucht", hazard: "Dunkle Samenschote" },
    it: { label: "Legenda obiettivi", safe: "Frutto sicuro", hazard: "Baccello scuro" },
    ru: { label: "Обозначения целей", safe: "Безопасный фрукт", hazard: "Тёмный стручок" },
    hi: { label: "लक्ष्य कुंजी", safe: "सुरक्षित फल", hazard: "गहरी बीज की फली" },
    ar: { label: "مفتاح الأهداف", safe: "ثمرة آمنة", hazard: "قرن بذور داكن" },
  };
  let TOTAL_STAGES = 30;
  const stageDefs = [
    { id: 1, arc: 1, name: "First Spark", nameZh: "初見星火", nameAr: "الشرارة الأولى", mechanic: "learn", count: 3, hazard: .08, duration: 13, speed: 7.2 },
    { id: 2, arc: 1, name: "Twin Arcs", nameZh: "雙弧採收", nameAr: "قوسان متعاقبان", mechanic: "split", count: 4, hazard: .1, duration: 13, speed: 7.5 },
    { id: 3, arc: 1, name: "High Bough", nameZh: "高枝路線", nameAr: "غصن مرتفع", mechanic: "long", count: 4, hazard: .12, duration: 14, speed: 7.8 },
    { id: 4, arc: 1, name: "Sidewind", nameZh: "側風初試", nameAr: "نسمة جانبية", mechanic: "wind", count: 4, hazard: .12, duration: 14, speed: 7.8, wind: .34 },
    { id: 5, arc: 1, name: "Lantern Checkpoint", nameZh: "燈籠檢查點", nameAr: "نقطة تفتيش الفانوس", mechanic: "checkpoint", count: 4, hazard: .14, duration: 15, speed: 8, checkpoint: true, wind: .22 },
    { id: 6, arc: 2, name: "Crosswind Lesson", nameZh: "交叉風課", nameAr: "درس الرياح المتقاطعة", mechanic: "wind", count: 4, hazard: .14, duration: 14, speed: 8, wind: -.42 },
    { id: 7, arc: 2, name: "Breezy Baskets", nameZh: "風中果籃", nameAr: "سلال في النسيم", mechanic: "wind", count: 5, hazard: .15, duration: 15, speed: 8.2, wind: .48 },
    { id: 8, arc: 2, name: "Wind Switch", nameZh: "變向風", nameAr: "تبدّل الريح", mechanic: "windSwitch", count: 5, hazard: .16, duration: 15, speed: 8.3, wind: .58 },
    { id: 9, arc: 2, name: "Gust Gap", nameZh: "陣風缺口", nameAr: "فجوة الهبّة", mechanic: "gust", count: 5, hazard: .18, duration: 15, speed: 8.5, wind: -.62, weave: .8 },
    { id: 10, arc: 2, name: "Windkeeper Checkpoint", nameZh: "守風者檢查點", nameAr: "نقطة حارس الريح", mechanic: "checkpoint", count: 5, hazard: .18, duration: 16, speed: 8.6, checkpoint: true, wind: .64, weave: .9 },
    { id: 11, arc: 3, name: "Twilight Thread", nameZh: "暮光細線", nameAr: "خيط الشفق", mechanic: "shadow", count: 4, hazard: .2, duration: 15, speed: 8.4, shadow: true },
    { id: 12, arc: 3, name: "Shadow Choice", nameZh: "暗影選擇", nameAr: "اختيار الظل", mechanic: "shadow", count: 5, hazard: .22, duration: 15, speed: 8.6, shadow: true, weave: 1 },
    { id: 13, arc: 3, name: "Quiet Glow", nameZh: "靜光辨識", nameAr: "وهج هادئ", mechanic: "focus", count: 5, hazard: .22, duration: 16, speed: 8.7, shadow: true },
    { id: 14, arc: 3, name: "Mixed Lanterns", nameZh: "混合燈影", nameAr: "فوانيس مختلطة", mechanic: "shadow", count: 5, hazard: .24, duration: 16, speed: 8.8, shadow: true, wind: .34, weave: 1.1 },
    { id: 15, arc: 3, name: "Twilight Checkpoint", nameZh: "暮光檢查點", nameAr: "نقطة تفتيش الشفق", mechanic: "checkpoint", count: 5, hazard: .24, duration: 16, speed: 8.9, checkpoint: true, shadow: true, wind: -.35 },
    { id: 16, arc: 4, name: "Moving Canopy", nameZh: "移動樹冠", nameAr: "مظلة متحركة", mechanic: "weave", count: 5, hazard: .22, duration: 16, speed: 8.8, weave: 1.5 },
    { id: 17, arc: 4, name: "Weave the Branches", nameZh: "穿梭枝間", nameAr: "نسج الأغصان", mechanic: "weave", count: 5, hazard: .24, duration: 17, speed: 9, weave: 1.9, wind: .28 },
    { id: 18, arc: 4, name: "Split Gust", nameZh: "分流陣風", nameAr: "هبّة متشعبة", mechanic: "weave", count: 6, hazard: .25, duration: 17, speed: 9.1, weave: 2.1, wind: -.4 },
    { id: 19, arc: 4, name: "Narrow Window", nameZh: "窄窗時機", nameAr: "نافذة ضيقة", mechanic: "rush", count: 6, hazard: .27, duration: 16, speed: 9.4, weave: 2.2 },
    { id: 20, arc: 4, name: "Bough Guardian Checkpoint", nameZh: "枝冠守護檢查點", nameAr: "نقطة حارس الأغصان", mechanic: "checkpoint", count: 6, hazard: .28, duration: 17, speed: 9.5, checkpoint: true, weave: 2.2, wind: .46 },
    { id: 21, arc: 5, name: "Signal Orchard", nameZh: "訊號果園", nameAr: "بستان الإشارة", mechanic: "signal", count: 5, hazard: .26, duration: 17, speed: 9.2, shadow: true, wind: .42 },
    { id: 22, arc: 5, name: "Pulse Path", nameZh: "脈衝路線", nameAr: "مسار النبض", mechanic: "rhythm", count: 6, hazard: .28, duration: 17, speed: 9.4, weave: 1.6, wind: -.46, rhythm: true },
    { id: 23, arc: 5, name: "Hazard Rhythm", nameZh: "危險節拍", nameAr: "إيقاع الخطر", mechanic: "rhythm", count: 6, hazard: .3, duration: 17, speed: 9.6, shadow: true, wind: .52, rhythm: true },
    { id: 24, arc: 5, name: "Last Light Relay", nameZh: "最後光 relay", nameAr: "تتابع الضوء الأخير", mechanic: "signal", count: 6, hazard: .3, duration: 18, speed: 9.7, shadow: true, weave: 2, wind: -.55, rhythm: true },
    { id: 25, arc: 5, name: "Signal Checkpoint", nameZh: "訊號檢查點", nameAr: "نقطة تفتيش الإشارة", mechanic: "checkpoint", count: 6, hazard: .3, duration: 18, speed: 9.8, checkpoint: true, shadow: true, wind: .58, weave: 2, rhythm: true },
    { id: 26, arc: 6, name: "Mastery Glide", nameZh: "熟練滑行", nameAr: "انسياب الإتقان", mechanic: "mastery", count: 6, hazard: .3, duration: 18, speed: 9.7, wind: -.62, weave: 2.2, rhythm: true },
    { id: 27, arc: 6, name: "Full Canopy", nameZh: "完整樹冠", nameAr: "المظلة الكاملة", mechanic: "mastery", count: 6, hazard: .32, duration: 18, speed: 9.9, shadow: true, wind: .64, weave: 2.4, rhythm: true },
    { id: 28, arc: 6, name: "Storm and Shadow", nameZh: "風暴與暗影", nameAr: "العاصفة والظل", mechanic: "mastery", count: 6, hazard: .34, duration: 18, speed: 10.1, shadow: true, wind: -.68, weave: 2.5, rhythm: true },
    { id: 29, arc: 6, name: "Harvest Relay", nameZh: "採收接力", nameAr: "تتابع الحصاد", mechanic: "mastery", count: 6, hazard: .35, duration: 19, speed: 10.2, shadow: true, wind: .7, weave: 2.6, rhythm: true },
    { id: 30, arc: 6, name: "Grand Canopy Finale", nameZh: "樹冠大結局", nameAr: "ختام المظلة الكبير", mechanic: "checkpoint", count: 6, hazard: .35, duration: 19, speed: 10.3, checkpoint: true, shadow: true, wind: -.72, weave: 2.8, rhythm: true },
  ];
  const stageCopy = {
    en: { stage: "Stage", total: "{unlocked}/{total} stages unlocked", ready: "Ready", locked: "Clear the previous stage", cleared: "Cleared", checkpoint: "Checkpoint", objective: { learn: "Read the first safe glow.", split: "Choose between two clear arcs.", long: "Follow a longer rising arc.", wind: "Adjust your swipe for the crosswind.", windSwitch: "Read the wind before committing.", gust: "Leave room for the gust gap.", shadow: "Separate safe glow from dark pods.", focus: "Wait for the readable safe signal.", weave: "Track the moving canopy rhythm.", rush: "Choose a safe path in a shorter window.", signal: "Follow the active light signal.", rhythm: "Match the pulse without chasing danger.", mastery: "Combine wind, weave, signal, and hazard reading.", checkpoint: "Harvest the checkpoint fruit before the next arc." }, checkpointHit: "Checkpoint fruit harvested.", checkpointMiss: "Checkpoint fruit was not harvested; replay to mark the clear." },
    "zh-Hant": { stage: "第", total: "已解鎖 {unlocked}/{total} 關", ready: "可遊玩", locked: "先完成上一關", cleared: "已完成", checkpoint: "檢查點", objective: { learn: "辨識第一道安全微光。", split: "在兩條清楚弧線中選擇。", long: "跟上更長的上升弧線。", wind: "配合交叉風調整滑動。", windSwitch: "出手前先讀懂風向。", gust: "為陣風缺口留下空間。", shadow: "分辨安全微光與深色種莢。", focus: "等待清楚的安全訊號。", weave: "追蹤移動樹冠的節奏。", rush: "在較短窗口選擇安全路線。", signal: "跟上目前的光訊號。", rhythm: "配合脈衝，不追逐危險。", mastery: "結合風向、穿梭、訊號與危險判讀。", checkpoint: "在下一段弧線前採到檢查點果實。" }, checkpointHit: "已採到檢查點果實。", checkpointMiss: "尚未採到檢查點果實；可重玩來完成標記。" },
    ar: { stage: "المرحلة", total: "تم فتح {unlocked} من {total} مرحلة", ready: "جاهزة", locked: "أكمل المرحلة السابقة", cleared: "مكتملة", checkpoint: "نقطة تفتيش", objective: { learn: "ميّز الوهج الآمن الأول.", split: "اختر بين قوسين واضحين.", long: "اتبع قوسًا صاعدًا أطول.", wind: "عدّل تمريرتك مع الريح المتقاطعة.", windSwitch: "اقرأ الريح قبل الالتزام.", gust: "اترك مساحة لفجوة الهبّة.", shadow: "افصل الوهج الآمن عن قرون البذور الداكنة.", focus: "انتظر الإشارة الآمنة الواضحة.", weave: "تتبّع إيقاع المظلة المتحركة.", rush: "اختر مسارًا آمنًا خلال نافذة أقصر.", signal: "اتبع إشارة الضوء النشطة.", rhythm: "طابق النبض من دون مطاردة الخطر.", mastery: "اجمع بين الريح والحركة والإشارة وقراءة الخطر.", checkpoint: "احصد ثمرة نقطة التفتيش قبل القوس التالي." }, checkpointHit: "تم حصاد ثمرة نقطة التفتيش.", checkpointMiss: "لم تُحصد ثمرة نقطة التفتيش؛ أعد اللعب لتسجيلها." },
  };
  const stageArcs = {
    en: ["First Light", "Windy Boughs", "Twilight Orchard", "Moving Canopy", "Signal Orchard", "Mastery Grove"],
    "zh-Hant": ["初光果園", "風行枝間", "暮光果園", "移動樹冠", "訊號果園", "熟練林地"],
    ar: ["بستان الضوء الأول", "أغصان الريح", "بستان الشفق", "المظلة المتحركة", "بستان الإشارة", "غابة الإتقان"],
  };
  const stageLabel = () => stageCopy[currentLocale()] || stageCopy.en;
  const arcLabel = (arc) => arc>6?(dawnCopy?.[currentLocale()]?.chapter||dawnCopy?.en.chapter||'Dawn Orchard'):(stageArcs[currentLocale()] || stageArcs.en)[arc - 1] || stageArcs.en[arc - 1];
  const stageName = (definition) => definition.id>30?`${dawnCopy?.[currentLocale()]?.chapter||dawnCopy?.en.chapter||'Dawn Orchard'} ${definition.id}`:currentLocale() === "zh-Hant" ? definition.nameZh : currentLocale() === "ar" ? definition.nameAr : definition.name;
  const stageFor = (number) => stageDefs[Math.max(0, Math.min(TOTAL_STAGES - 1, number - 1))];
  const normalizeProgress = (value) => {
    const source = value && typeof value === "object" ? value : {};
    const cleared = {};
    Object.keys(source.cleared && typeof source.cleared === "object" ? source.cleared : {}).forEach((key) => {
      const number = Number(key);
      if (Number.isInteger(number) && number >= 1 && number <= TOTAL_STAGES && source.cleared[key]) cleared[number] = true;
    });
    let frontier = 1;
    while (cleared[frontier] && frontier < TOTAL_STAGES) frontier += 1;
    const requested = Number(source.unlocked);
    const unlocked = Math.min(TOTAL_STAGES, Math.max(1, Number.isFinite(requested) ? Math.floor(requested) : 1));
    return { unlocked: Math.max(unlocked, frontier), cleared, best: source.best && typeof source.best === "object" ? source.best : {}, checkpoints: source.checkpoints && typeof source.checkpoints === "object" ? source.checkpoints : {} };
  };
  const loadProgress = () => {
    try { return normalizeProgress(JSON.parse(localStorage.getItem("wp-canopy-progress-v15") || localStorage.getItem("wp-canopy-progress-v14") || localStorage.getItem("wp-canopy-progress-v13") || "{}")); } catch { return normalizeProgress({}); }
  };
  const saveProgress = () => { if(practiceRequested)return;try { localStorage.setItem("wp-canopy-progress-v15", JSON.stringify(progress)); } catch {} };
  const progress = practiceRequested?normalizeProgress({}):loadProgress();
  const state = { screen: "main", stage: Math.min(progress.unlocked, TOTAL_STAGES), chapter: 1, wave: 1, score: 0, best: practiceRequested?0:(() => { try { return Math.max(0, Number.isFinite(Number(localStorage.getItem("wp-canopy-best"))) ? Number(localStorage.getItem("wp-canopy-best")) : 0); } catch { return 0; } })(), chain: 0, misses: 0, targets: [], stroke: [], active: false, strokeInputType: "unknown", elapsed: 0, last: 0, spawn: 0, ready: 0, previewUntil: 0, previewSafeShown: false, checkpointSpawned: false, checkpointHit: false, seed: 1, raf: 0, status: "ready", resultWin: null, bestImproved: false, cardsLocale: "" };
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  const syncArenaSize = () => {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const width = rect.width, height = rect.height;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const nextWidth = Math.round(width * dpr), nextHeight = Math.round(height * dpr);
    if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
      canvas.width = nextWidth; canvas.height = nextHeight;
      state.round?.resize(width, height);
      state.stroke = []; state.previousPoint = null; state.active = false;
    }
    state.arenaWidth = width; state.arenaHeight = height;
  };
  const currentLocale = () => localeCopy[window.WeightPlayFiveGameLocale?.locale] ? window.WeightPlayFiveGameLocale.locale : (localeCopy[document.documentElement.lang] ? document.documentElement.lang : "en");
  const copy = () => localeCopy[currentLocale()] || localeCopy.en;
  const fill = (value, values) => value.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
  const dawnText=(name,vars={})=>fill(dawnCopy?.[currentLocale()]?.[name]||dawnCopy?.en?.[name]||name,vars);
  const label = (key, values = {}) => fill(copy()[key] || localeCopy.en[key] || key, values);
  const key = () => keyCopy[currentLocale()] || keyCopy.en;
  const config = () => stageFor(state.stage);
  const dawnButton=document.createElement('button'),dawnButtonText=document.createElement('span'),dawnImage=document.createElement('img');
  const practiceStatusText=practiceRequested?document.createElement('span'):null;
  if(practiceStatusText)$('battle-status').replaceChildren(practiceStatusText);
  function movePracticeBadge(owner){const badge=document.querySelector('[data-wp-local-practice]');if(!badge||!owner)return;if(badge.parentElement!==owner){badge.style.position='static';badge.style.transform='none';badge.style.marginInlineStart='8px';owner.append(badge);}if(badge.style.display!=='inline-block')badge.style.display='inline-block';}
  dawnButton.type='button';dawnButton.className='dawn-net';dawnButton.hidden=true;dawnImage.src='/games/animal-canopy-cut/assets/dawn-canopy-net-v1.png';dawnImage.alt='';dawnImage.width=48;dawnImage.height=48;dawnButton.append(dawnImage,dawnButtonText);$('stage-objective').parentElement.append(dawnButton);
  dawnButton.addEventListener('click',()=>{if(state.screen!=='battle'||state.paused||state.ready>0||!practiceAuthorized||state.stage<=30)return;if(state.round?.useNet()){renderHud();draw();}});
  const pagePrev=document.createElement('button'),pageNext=document.createElement('button'),stageNav=document.querySelector('#stage-screen nav');
  pagePrev.type=pageNext.type='button';pagePrev.className='dawn-page-prev';pageNext.className='dawn-page-next';pagePrev.hidden=pageNext.hidden=true;stageNav.prepend(pagePrev);stageNav.append(pageNext);
  pagePrev.addEventListener('click',()=>{if(!practiceAuthorized)return;stagePageStart=Math.max(0,stagePageStart-9);stageCards();(pagePrev.disabled?pageNext:pagePrev).focus({preventScroll:true});});
  pageNext.addEventListener('click',()=>{if(!practiceAuthorized)return;stagePageStart=Math.min(Math.floor((TOTAL_STAGES-1)/9)*9,stagePageStart+9);stageCards();(pageNext.disabled?pagePrev:pageNext).focus({preventScroll:true});});
  function show(name) { audioScope?.stop(); state.screen = name; state.active = false; state.pointerId = null; state.stroke = []; effects.length = 0; state.paused = false; $("pause-panel").hidden = true; frameController.activate(name === "result" ? "battle" : name, {covered:name === "result"}); document.body.dataset.screen = name === "result" ? "battle" : name; cancelAnimationFrame(state.raf); const result = document.querySelector("#result-screen");const badge=document.querySelector('[data-wp-local-practice]');if(badge&&name==='result')badge.style.display='none'; document.querySelectorAll(".screen").forEach((el) => { const isResult = el === result && name === "result"; const keepBattle = name === "result" && el.id === "battle-screen"; const on = isResult || keepBattle || el.dataset.screen === name; el.hidden = !on; el.classList.toggle("active", on); }); if (name === "battle") (__wpNotifyMeasurement(), result?.setAttribute("hidden", "")); if (!reducedMotion) $(name === "result" ? "result-screen" : `${name}-content`)?.animate([{opacity:.4},{opacity:1}],{duration:180}); if (name === "battle") { state.last = performance.now(); state.raf = requestAnimationFrame(frame); }
    { const __wpNextScreen = ({main:"main",stage:"stage",battle:"battle",})[name] ?? null;
      if (["result"].includes(name) && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = state.resultWin ? "win" : "loss"; }
      else if (true && (__wpNextScreen === "main" || __wpNextScreen === "stage") && __wpMeasurement.screen === "battle" && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "abandon"; }
      __wpMeasurement.screen = __wpNextScreen;  __wpNotifyMeasurement(); }
}
  function stageCards() {
    const copy = stageLabel();
    const unlocked = Math.max(1, Math.min(TOTAL_STAGES, progress.unlocked));
    $("stage-list").dataset.wpStageRecommendation = String(unlocked);
    $("stage-progress").textContent = practiceAuthorized?dawnText('practice'):fill(copy.total, { unlocked, total: TOTAL_STAGES });
    if(practiceAuthorized&&state.screen==='stage')movePracticeBadge($('stage-progress'));
    const displayed=practiceAuthorized?stageDefs.slice(stagePageStart,stagePageStart+9):stageDefs;
    pagePrev.hidden=pageNext.hidden=!practiceAuthorized;if(practiceAuthorized){pagePrev.textContent='‹';pageNext.textContent='›';pagePrev.setAttribute('aria-label',dawnText('previous'));pageNext.setAttribute('aria-label',dawnText('next'));pagePrev.disabled=stagePageStart===0;pageNext.disabled=stagePageStart+9>=TOTAL_STAGES;}
    $("stage-list").innerHTML = displayed.map((definition) => {
      const available = practiceAuthorized||definition.id <= unlocked;
      const cleared = Boolean(progress.cleared[definition.id]);
      const selected = definition.id === state.stage;
      const status = cleared ? copy.cleared : available ? copy.ready : copy.locked;
      const checkpoint = definition.checkpoint ? ` · ${copy.checkpoint}` : "";
      const objective = definition.id>30?dawnText('goal',{n:0,goal:definition.markedGoal}):copy.objective[definition.mechanic] || stageCopy.en.objective[definition.mechanic];
      const aria = `${copy.stage} ${definition.id} · ${stageName(definition)} · ${objective}${checkpoint} · ${status}`;
      return `<button class="stage-card${available ? " unlocked" : " locked"}${cleared ? " cleared" : ""}${selected ? " selected" : ""}" type="button" data-wp-enter-battle data-stage="${definition.id}" data-chapter="${Math.ceil(definition.id / 5)}" data-wave="${((definition.id - 1) % 5) + 1}" aria-label="${aria}" aria-disabled="${available ? "false" : "true"}" aria-posinset="${definition.id}" aria-setsize="${TOTAL_STAGES}"${available ? "" : " disabled"}><span data-wp-item-content><span class="stage-number">${String(definition.id).padStart(2, "0")}</span><strong>${stageName(definition)}</strong><small>${arcLabel(definition.arc)}${checkpoint}</small><span>${objective}</span><b>${status}${progress.checkpoints?.[definition.id] ? " · ◆" : ""}</b></span></button>`;
    }).join("");
    $("stage-list").querySelectorAll("button.unlocked").forEach((button) => button.addEventListener("click", () => {
      emitAnalytics("chapter_open", { from: "stage", outcome: "opened", stage: Number(button.dataset.stage) });
      startStage(Number(button.dataset.stage));
    }));
    state.cardsLocale = currentLocale();
    renderCollectionBadges();
    if (state.screen === "stage") requestAnimationFrame(centerStageCard);
  }
  function centerStageCard() {
    const anchor = Math.max(1, Math.min(TOTAL_STAGES, practiceAuthorized?state.stage:progress.unlocked));
    const card = $("stage-list")?.querySelector(`[data-stage="${anchor}"]`);
    card?.scrollIntoView({ block: "center", inline: "center" });
    markStageCard(card);
  }
  function markStageCard(selected) {
    $("stage-list").querySelectorAll('[data-stage]').forEach(card => {
      card.classList.toggle('selected', card === selected);
      if (card === selected) card.setAttribute('aria-current','true');
      else card.removeAttribute('aria-current');
    });
  }
  $("stage-list").addEventListener('wonder:stage-snap', () => {
    const rail = $("stage-list").getBoundingClientRect(), center = rail.x + rail.width / 2;
    const cards = [...$("stage-list").querySelectorAll('[data-stage]')];
    const nearest = cards.reduce((a,b) => { const distance = c => {const r=c.getBoundingClientRect();return Math.abs(r.x+r.width/2-center);}; return !a || distance(b)<distance(a) ? b : a; },null);
    markStageCard(nearest);
  });

  async function startStage(stage = 1, from = "stage") {
    const nextStage = Math.max(1, Math.min(TOTAL_STAGES, Number(stage) || 1));
    if(practiceRequested){if(!practiceAuthorized||practiceStarting||window.__canopyCutPracticeAnalyticsSafe!==true)return false;practiceStarting=true;try{if(!await practiceAdapter.validate()||!practiceAuthorized)return false;}finally{practiceStarting=false;}}
    else if (nextStage > progress.unlocked) return false;
    state.stage = nextStage;
    if(practiceAuthorized)stagePageStart=Math.floor((nextStage-1)/9)*9;
    state.roundStartedAt = Date.now();
    state.chapter = Math.ceil(nextStage / 5);
    state.wave = ((nextStage - 1) % 5) + 1;
    state.score = 0; state.chain = 0; state.misses = 0; state.targets = []; state.stroke = []; state.strokeInputType = "unknown";
    state.elapsed = 0; state.spawn = 0; state.ready = .8; state.settle = 0; state.statusUntil = 0; state.paused = false; state.active = false; state.pointerId = null; state.previewUntil = 0; state.previewSafeShown = false; state.checkpointSpawned = false; state.checkpointHit = false; state.status = "ready"; state.resultWin = null;
    state.seed = nextStage * 100 + 1;
    emitAnalytics("wave_start", { from, outcome: "started", stage: nextStage });
    $("score-label").textContent = "0";
    $("next").hidden = false;
    $("next").disabled = false;
    show("battle"); syncArenaSize(); state.round = nextStage>30&&practiceAuthorized?dawn.makeDawnRound(CanopyEngine.Round,stageFor(nextStage),state.arenaWidth,state.arenaHeight):new CanopyEngine.Round(stageFor(nextStage), state.arenaWidth, state.arenaHeight); renderLocalized(); sound("game.start", .26);

    __wpMeasurement.roundKey = {}; __wpMeasurement.restart = false; __wpMeasurement.started = true; __wpMeasurement.ended = false; __wpMeasurement.outcome = "complete"; __wpMeasurement.screen = "battle"; __wpNotifyMeasurement();
    return true;
}
  const playCopy = {
    en: ["Harvest", "Misses", "Time", "Continue", "Paused", "Three fruit missed", "Avoid the dark pods", "Keep harvesting until the timer ends", "Best chain", "Clean harvest", "New best!"],
    "zh-Hant": ["採收", "漏接", "時間", "繼續", "已暫停", "漏接三顆果實", "小心深色種莢", "持續採收，撐到時間結束", "最高連擊", "完美採收", "新紀錄！"],
    "zh-Hans": ["采收", "漏接", "时间", "继续", "已暂停", "漏接三颗果实", "小心深色种荚", "持续采收，撑到时间结束", "最高连击", "完美采收", "新纪录！"],
    ja: ["収穫", "ミス", "時間", "続ける", "一時停止", "果実を3個逃しました", "暗いさやを避けよう", "時間切れまで収穫しよう", "最高チェーン", "完璧な収穫", "新記録！"],
    ko: ["수확", "놓침", "시간", "계속", "일시 정지", "과일 3개를 놓쳤어요", "어두운 꼬투리를 피하세요", "시간이 끝날 때까지 수확하세요", "최고 연속", "완벽한 수확", "새 기록!"],
    es: ["Cosecha", "Fallos", "Tiempo", "Continuar", "En pausa", "Tres frutas perdidas", "Evita las vainas oscuras", "Cosecha hasta que termine el tiempo", "Mejor cadena", "Cosecha perfecta", "¡Nuevo récord!"],
    "pt-BR": ["Colheita", "Erros", "Tempo", "Continuar", "Pausado", "Três frutas perdidas", "Evite as vagens escuras", "Colha até o tempo acabar", "Melhor sequência", "Colheita perfeita", "Novo recorde!"],
    fr: ["Récolte", "Ratés", "Temps", "Continuer", "En pause", "Trois fruits manqués", "Évite les gousses sombres", "Récolte jusqu’à la fin du temps", "Meilleure série", "Récolte parfaite", "Nouveau record !"],
    de: ["Ernte", "Fehler", "Zeit", "Weiter", "Pause", "Drei Früchte verpasst", "Meide dunkle Schoten", "Ernte bis zum Ablauf der Zeit", "Beste Serie", "Perfekte Ernte", "Neuer Rekord!"],
    it: ["Raccolto", "Errori", "Tempo", "Continua", "In pausa", "Tre frutti persi", "Evita i baccelli scuri", "Raccogli fino allo scadere del tempo", "Migliore serie", "Raccolto perfetto", "Nuovo record!"],
    ru: ["Урожай", "Промахи", "Время", "Продолжить", "Пауза", "Пропущено три фрукта", "Избегайте тёмных стручков", "Собирайте до конца времени", "Лучшая серия", "Идеальный урожай", "Новый рекорд!"],
    hi: ["फसल", "चूक", "समय", "जारी रखें", "रुका हुआ", "तीन फल छूट गए", "गहरी फलियों से बचें", "समय खत्म होने तक फल लें", "सर्वश्रेष्ठ सिलसिला", "बढ़िया फसल", "नया रिकॉर्ड!"],
    ar: ["الحصاد", "الإخفاقات", "الوقت", "متابعة", "متوقف", "فاتتك ثلاث ثمار", "تجنب القرون الداكنة", "احصد حتى ينتهي الوقت", "أفضل تتابع", "حصاد مثالي", "رقم قياسي جديد!"],
  };
  const ui = i => (playCopy[currentLocale()] || playCopy.en)[i];
  const scoreCaption = () => ({en:"Score","zh-Hant":"分數","zh-Hans":"分数",ja:"スコア",ko:"점수",es:"Puntos","pt-BR":"Pontos",fr:"Score",de:"Punkte",it:"Punti",ru:"Счёт",hi:"स्कोर",ar:"النقاط"}[currentLocale()] || "Score");
  const audioScope = window.WeightPlayAudio?.createScope();
  const sound = (id, volume) => audioScope?.play(id, { volume });
  window.WeightPlayAudio?.preload(["game.start","game.checkpoint","reward.collect","alert.warning","feedback.error","result.win","result.lose"]);
  window.addEventListener("pagehide",()=>audioScope?.stop());
  const effects = [];
  const frameController = window.WeightPlayScreenFrame.mount({root: $("app"), localeSelect: $("localeSelect"), scenes: {
    main: {root: $("main-screen"), header: $("main-header"), content: $("main-content")},
    stage: {root: $("stage-screen"), header: $("stage-header"), content: $("stage-content")},
    battle: {root: $("battle-screen"), header: $("battle-header"), content: $("battle-content"), headerInfo: $("battle-info")},
  }});
  frameController.activate("main");
  function point(e) { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top, life: .2 }; }
  function syncRound() {
    if (!state.round) return;
    for (const name of ["score", "chain", "misses", "targets", "checkpointHit"]) state[name] = state.round[name];
    state.elapsed = state.round.time;
  }
  function writeText(id, value) { const node = $(id), text = String(value); if (node.textContent !== text) node.textContent = text; }
  function renderStatus() {
    let message = state.paused ? ui(4) : state.status==='dawnUnripe'?dawnText('waiting'):state.status === "miss" ? `${ui(1)} ${state.misses}/3` : state.status === "targetPreview" ? (state.stage>30&&practiceAuthorized?dawnText('guide'):ui(7)) : label(state.status, {chain: state.chain});
    if(practiceStatusText){if(practiceStatusText.textContent!==message)practiceStatusText.textContent=message;if(practiceAuthorized&&state.screen==='battle')movePracticeBadge($('battle-status'));}else writeText("battle-status", message);
    $("battle-status").dataset.dawn=String(state.stage>30&&practiceAuthorized);
    $("battle-status").dataset.targetPreview = state.status === "targetPreview" ? "active" : "inactive";
    $("battle-status").dataset.tone = ["miss", "seedPod"].includes(state.status) ? "danger" : "normal";
  }
  function renderHud() {
    writeText("score-label", state.score);
    writeText("time-label", `${Math.max(0, Math.ceil(config().duration - state.elapsed))}s`);
    writeText("harvest-label", `${ui(0)} ${state.round?.harvested || 0}`);
    writeText("miss-label", `${ui(1)} ${state.misses}/3`);
    $("miss-label").dataset.danger = String(state.misses > 0);
    $("round-meter").value = Math.min(config().duration, state.elapsed);
    $("round-meter").max = config().duration;
    dawnButton.hidden=!(practiceAuthorized&&state.stage>30);
    if(!dawnButton.hidden){const round=state.round;dawnButtonText.textContent=dawnText('uses',{n:round?.netUses??2});dawnButton.setAttribute('aria-label',`${dawnText('net')} · ${dawnButtonText.textContent}`);dawnButton.disabled=!round||round.finished||state.paused||state.ready>0||round.netUses===0||round.time<round.netReadyAt||!round.targets.some(t=>!t.hazard&&t.y-t.r<round.height);$('stage-objective').textContent=dawnText('goal',{n:round?.markedHarvested??0,goal:config().markedGoal});}
  }
  function consumeEvents() {
    syncRound();
    for (const e of state.round.drain()) {
      if (e.type === "harvest" || e.type === "hazard") {
        const t = e.target;
        effects.push({ ...t, type: e.type, life: .6, duration: .6, points: e.points });
        emitAnalytics(e.type === "harvest" ? "safe_hit" : "hazard_hit", {inputType: state.strokeInputType, from: "battle", outcome: e.type === "harvest" ? "safe" : "hazard", stage: state.stage});
        if (e.type === "harvest") {
          state.status = state.chain > 1 ? "chain" : "clean";
          sound(t.checkpoint ? "game.checkpoint" : "reward.collect", t.checkpoint ? .5 : .24);
          $("score-label").animate([{opacity:.55},{opacity:1}], {duration:180});
        } else { state.status = "seedPod"; sound("feedback.error", .34); }
        state.statusUntil = state.round.time + .85;
      } else if (e.type === "miss") {
        state.status = "miss"; state.statusUntil = state.round.time + 1;
        sound("alert.warning", .25);
        effects.push({...e.target, y: state.arenaHeight - 28, type:"miss", life:.65, duration:.65});
      } else if(e.type==='unripe'){state.status='dawnUnripe';state.statusUntil=state.round.time+.85;}
      else if (e.type === "finish") state.settle = .65;
    }
    renderStatus(); renderHud();
  }
  function hitAt(p, previous = p) {
    if (!state.round || state.round.finished || state.paused || state.ready > 0) return;
    state.round.swipe(previous, p); consumeEvents(); draw();
  }
  function finish() {
    state.active = false; state.stroke = []; state.pointerId = null;
    const round = state.round, previousBest = state.best;
    state.best = Math.max(state.best, state.score);
    state.bestImproved = state.best > previousBest;
    if(!practiceRequested)try { localStorage.setItem("wp-canopy-best", String(state.best)); } catch {}
    state.resultWin = round.won;
    if (state.resultWin) {
      progress.cleared[state.stage] = true;
      progress.unlocked = Math.max(progress.unlocked, Math.min(TOTAL_STAGES, state.stage + 1));
      progress.best[state.stage] = Math.max(Number(progress.best[state.stage] || 0), state.score);
      progress.checkpoints ||= {};
      progress.checkpoints[state.stage] ||= round.checkpointHit;
      saveProgress();
    }
    const outcome = state.resultWin ? "success" : round.reason === "hazard" ? "hazard" : "no_moves";
    emitAnalytics("wave_result", {from:"battle", outcome, stage:state.stage});
    if (state.wave === 5) emitAnalytics("chapter_final_wave", {chapter:state.chapter, from:"battle", outcome, stage:state.stage});
    show("result"); renderLocalized();
    sound(state.resultWin ? "result.win" : "result.lose", state.resultWin ? .5 : .35);
    $("retry").focus({preventScroll:true});
    __wpMeasurement.ended = true; __wpMeasurement.outcome = state.resultWin ? "win" : "loss"; __wpMeasurement.screen = null; __wpNotifyMeasurement();
  }
  function renderResult() {
    if (state.resultWin === null) return;
    const round = state.round;
    $("result-title").textContent = state.resultWin ? label("waveClear") : label("waveEnded");
    $("result-copy").textContent = state.resultWin ? (round.misses === 0 ? ui(9) : ui(7)) : round.reason==='quota'?dawnText('quota'):round.reason === "hazard" ? ui(6) : ui(5);
    if(practiceRequested)$("result-copy").textContent+=` · ${dawnText('practice')}`;
    $("result-score").textContent = String(state.score);
    $("result-stats").textContent = `${ui(0)} ${round.harvested} · ${ui(8)} ${round.peakChain} · ${ui(1)} ${round.misses}/3`;
    $("result-record").textContent = state.bestImproved ? ui(10) : `${label("bestScore")}: ${state.best}`;
    $("result-checkpoint").textContent = config().checkpoint ? (round.checkpointHit ? stageLabel().checkpointHit : stageLabel().checkpointMiss) : "";
    $("result-checkpoint").hidden = !config().checkpoint;
    $("to-stages").textContent = label("stages");
    const hasNext = state.resultWin && state.stage < TOTAL_STAGES;
    $("next").hidden = false; $("next").disabled = !hasNext;
    $("next").setAttribute("aria-disabled", String(!hasNext));
    $("next").textContent = hasNext ? `${stageLabel().stage} ${state.stage + 1}` : label("nextWave");
    $("retry").textContent = label("retry");
    const awarded = practiceRequested?null:collectionHistory()[`animal-canopy-cut:stage-${state.stage}`];
    if(!practiceRequested)window.ShowResultGet?.("animal-canopy-cut", Boolean(state.resultWin && awarded && awarded >= state.roundStartedAt));
  }
  function collectionHistory() {
    try { return (window.WeightPlayCastle?.read() || JSON.parse(localStorage.getItem('weightplayCastleV1') || '{}')).completions || {}; }
    catch { return {}; }
  }
  function renderCollectionBadges() {
    if(practiceRequested)return;
    const history = collectionHistory();
    $("stage-list").querySelectorAll('[data-stage]').forEach(card => {
      const id = Number(card.dataset.stage), saved = history[`animal-canopy-cut:stage-${id}`];
      const value = saved ? 'collected' : progress.cleared[id] ? 'unknown' : 'not-collected';
      card.dataset.wpGetGameId = 'animal-canopy-cut'; card.dataset.wpGetIndex = String(id - 1);
      if (card.dataset.wpGetState !== value) card.dataset.wpGetState = value;
      window.ShowGet?.('animal-canopy-cut', id - 1);
    });
  }
  for(const event of ['weightplay:castle-ready','weightplay:castle-updated','weightplay:castle-reward'])window.addEventListener(event,()=>{renderCollectionBadges();if(state.screen==='result')renderResult();});
  function renderLocalized() {
    const targetKey = key(), currentStage = stageFor(state.stage);
    $("stage-header").querySelector("h2").textContent = label("stageTitle");
    document.querySelector('[data-wp-return="stage"]').setAttribute("aria-label", label("backMain"));
    document.querySelector('#stage-screen nav').setAttribute("aria-label", label("stageSections"));
    document.querySelector('#stage-screen nav [data-wp-frame-stage-slot="stages"]').textContent = label("stages");
    document.querySelector('[data-wp-return="battle"]').setAttribute("aria-label", label("backStages"));
    canvas.setAttribute("aria-label", `${label("canvas")}. ${ui(7)}. ${ui(6)}.`);
    $("battle-key").setAttribute("aria-label", targetKey.label);
    $("safe-key").textContent = targetKey.safe; $("hazard-key").textContent = targetKey.hazard;
    $("main-progress").textContent = practiceAuthorized?dawnText('practice'):`${stageLabel().total.replace("{unlocked}",progress.unlocked).replace("{total}",TOTAL_STAGES)} · ${label("bestScore")}: ${state.best}`;
    $("wave-label").textContent = `${stageLabel().stage} ${state.stage}`;
    $("score-caption").textContent = scoreCaption(); $("time-caption").textContent = ui(2);
    $("stage-objective").textContent = stageName(currentStage);
    $("stage-objective").title = currentStage.id>30?dawnText('guide'):stageLabel().objective[currentStage.mechanic];
    $("resume").textContent = ui(3); $("pause-title").textContent = ui(4);
    $("round-meter").setAttribute("aria-label", ui(2));
    renderStatus(); renderHud();
    if (state.cardsLocale !== currentLocale() || state.screen === "stage") stageCards();
    renderResult(); draw(); frameController.refresh();
  }
  const crops = [[140,0,430,355],[715,0,610,350],[1380,0,565,354],[130,352,480,330]];
  function renderKeys() { document.querySelectorAll('.key-art').forEach(node => { const c=crops[Number(node.dataset.kind)], scale=60/Math.max(c[2],c[3]), g=node.getContext('2d');g.clearRect(0,0,64,64);g.drawImage(propArt,...c,(64-c[2]*scale)/2,(64-c[3]*scale)/2,c[2]*scale,c[3]*scale); }); }
  propArt.addEventListener('load',renderKeys);
  if(propArt.complete && propArt.naturalWidth)renderKeys();
  function sprite(t, x, y, size, alpha = 1) {
    if (!propArt.complete || !propArt.naturalWidth) return;
    const crop = crops[t.hazard ? 3 : t.kind];
    const scale = size / Math.max(crop[2], crop[3]);
    ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x,y); ctx.rotate(t.rotation || 0);
    ctx.drawImage(propArt,...crop,-crop[2]*scale/2,-crop[3]*scale/2,crop[2]*scale,crop[3]*scale); ctx.restore();
  }
  function draw() {
    syncArenaSize();
    const w = state.arenaWidth, h = state.arenaHeight;
    if (!w || !h) return;
    const scale = canvas.width / w; ctx.setTransform(scale,0,0,scale,0,0); ctx.clearRect(0,0,w,h);
    const c = config(), tint = ctx.createLinearGradient(0,0,0,h);
    tint.addColorStop(0,c.shadow ? "rgba(16,22,51,.85)" : "rgba(9,37,46,.58)"); tint.addColorStop(1,"rgba(5,26,31,.92)");
    ctx.fillStyle=tint;ctx.fillRect(0,0,w,h);
    if(c.wind) {ctx.strokeStyle="#a5ecd74d";ctx.lineWidth=2;for(let i=0;i<4;i++){const y=h*(.2+i*.17),x=((state.elapsed*(c.wind>0?35:-35)+i*w*.3)%w+w)%w;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+25,y-3);ctx.stroke();}}
    if(c.rhythm||c.mechanic==="signal"||c.mechanic==="focus") {const pulse=Math.max(0,1-Math.abs((state.round?.nextSpawn||0)-state.elapsed)*2);ctx.fillStyle=`rgba(141,240,207,${.08+pulse*.14})`;ctx.fillRect(0,h-8,w,8);}
    for (const t of state.targets) {
      ctx.save();ctx.translate(t.x,t.y);
      ctx.beginPath();ctx.arc(0,0,t.r+4,0,Math.PI*2);
      ctx.fillStyle=t.hazard?"#2a152bcc":t.checkpoint?"#f2ce6244":"#8df0cf22";ctx.fill();
      ctx.lineWidth=t.checkpoint?3:1.5;ctx.strokeStyle=t.hazard?"#ff869c":t.checkpoint?"#ffe38a":"#b3f0cb99";ctx.stroke();
      if(t.hazard){ctx.strokeStyle="#ffabc0";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-t.r*.55,-t.r*.55);ctx.lineTo(t.r*.55,t.r*.55);ctx.moveTo(t.r*.55,-t.r*.55);ctx.lineTo(-t.r*.55,t.r*.55);ctx.stroke();}
      ctx.restore();sprite(t,t.x,t.y,t.r*2.4);
      if(t.marked){const ripe=t.age>=t.ripeAge;ctx.save();ctx.translate(t.x,t.y);ctx.lineWidth=3;ctx.strokeStyle=ripe?'#fff2a0':'#b8d7e4';ctx.setLineDash(ripe?[]:[5,4]);ctx.beginPath();ctx.arc(0,0,t.r+8,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle=ripe?'#fff2a0':'#d5e9f1';ctx.font='bold 14px system-ui';ctx.textAlign='center';ctx.fillText(ripe?'◆':'…',0,-t.r-10);ctx.restore();}
    }
    for (const e of effects) {
      const k=1-e.life/e.duration, travel=reducedMotion?0:k;
      if(e.type==="harvest") {
        for(const side of [-1,1]){ctx.save();ctx.beginPath();ctx.rect(e.x+(side<0?-e.r*2:0)+side*travel*20,e.y-e.r*2, e.r*2,e.r*4);ctx.clip();sprite(e,e.x+side*travel*20,e.y+travel*travel*35,e.r*2.4,1-k);ctx.restore();}
        if(!reducedMotion)for(let i=0;i<6;i++){const a=i*Math.PI/3;ctx.fillStyle=e.checkpoint?"#ffe38a":"#abefd0";ctx.globalAlpha=1-k;ctx.fillRect(e.x+Math.cos(a)*k*48,e.y+Math.sin(a)*k*35,3,3);}
        ctx.globalAlpha=1-k;ctx.fillStyle="#fff2b9";ctx.textAlign="center";ctx.font="800 18px system-ui";ctx.fillText(`+${e.points}`,e.x,Math.max(22,e.y-e.r-travel*28));ctx.globalAlpha=1;
      } else {ctx.globalAlpha=(1-k)*.7;ctx.strokeStyle="#ff8798";ctx.lineWidth=3;ctx.beginPath();ctx.arc(e.x,e.y, e.r+(reducedMotion?0:k*20),0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;}
    }
    for(let i=1;i<state.stroke.length;i++){const a=state.stroke[i-1],b=state.stroke[i];ctx.strokeStyle=`rgba(255,241,179,${Math.min(1,b.life/.2)})`;ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
    if(state.ready>0){ctx.fillStyle="#f8edc6";ctx.textAlign="center";ctx.font="800 28px system-ui";ctx.fillText(label("ready"),w/2,h*.45);}
  }
  function frame(now) {
    if(state.screen!=="battle")return;
    const dt=Math.min(.05, Math.max(0,(now-state.last)/1000));state.last=now;
    if(!state.paused){
      if(state.ready>0){state.ready-=dt;if(state.ready<=0){state.status="targetPreview";renderStatus();}}
      else if(state.settle>0){state.settle-=dt;if(state.settle<=0){finish();return;}}
      else {state.round.step(dt);consumeEvents();if(state.statusUntil && state.round.time>state.statusUntil){state.status="swipe";state.statusUntil=0;renderStatus();}}
      for(const e of effects)e.life-=dt;
      for(let i=effects.length-1;i>=0;i--)if(effects[i].life<=0)effects.splice(i,1);
      for(const p of state.stroke)p.life-=dt;
      state.stroke=state.stroke.filter(p=>p.life>0);
    }
    draw();state.raf=requestAnimationFrame(frame);
  }
  function stopStroke() {state.active=false;state.pointerId=null;state.previousPoint=null;}
  function pause() {
    if(state.screen!=="battle" || state.paused)return;
    state.paused=true;stopStroke();state.stroke=[];$("pause-panel").hidden=false;renderStatus();__wpNotifyMeasurement();
  }
  $("resume").addEventListener("click",()=>{state.paused=false;$("pause-panel").hidden=true;state.last=performance.now();renderStatus();__wpNotifyMeasurement();});
  document.addEventListener("visibilitychange",()=>{if(document.hidden)pause();});
  window.addEventListener("blur",pause);
  window.addEventListener("weightplay:interaction-state",()=>{if(document.querySelector('#battle-screen [data-wp-settings][aria-expanded="true"]'))pause();});
  canvas.addEventListener("pointerdown",e=>{if(state.screen!=="battle"||state.ready>0||state.paused||state.active||state.round?.finished)return;e.preventDefault();canvas.setPointerCapture(e.pointerId);state.pointerId=e.pointerId;state.active=true;state.strokeInputType=e.pointerType||"unknown";const p=point(e);state.stroke=[p];state.previousPoint=p;hitAt(p);});
  canvas.addEventListener("pointermove",e=>{if(!state.active||e.pointerId!==state.pointerId)return;const p=point(e);hitAt(p,state.previousPoint);state.stroke.push(p);state.previousPoint=p;if(state.stroke.length>32)state.stroke.shift();});
  ["pointerup","pointercancel","lostpointercapture"].forEach(event=>canvas.addEventListener(event,e=>{if(e.pointerId!==state.pointerId)return;if(state.active)emitAnalytics("pointer_stroke",{inputType:state.strokeInputType,from:"battle",outcome:event==="pointerup"?"completed":"cancelled"});stopStroke();}));
  $("start-game").addEventListener("click",()=>{if(practiceRequested&&!practiceAuthorized)return;show("stage");renderLocalized()}); document.querySelectorAll("[data-back]").forEach((b)=>b.addEventListener("click",()=>{if(b.dataset.back==="stage")emitAnalytics("stage_return",{from:state.screen==="result"?"result":"battle",outcome:"returned"});show(b.dataset.back);renderLocalized()})); $("retry").addEventListener("click",()=>{emitAnalytics("retry",{from:"result",outcome:"retry",stage:state.stage});__wpReplayStart(() => startStage(state.stage,"result"))}); $("next").addEventListener("click",()=>{if(!state.resultWin||state.stage>=TOTAL_STAGES)return;emitAnalytics("next_wave",{from:"result",outcome:"next_stage",stage:state.stage+1});startStage(state.stage+1,"result")}); $("to-stages").addEventListener("click",()=>{emitAnalytics("stage_return",{from:"result",outcome:"returned",stage:state.stage});show("stage");renderLocalized()}); $("localeSelect")?.addEventListener("change",()=>setTimeout(renderLocalized,0)); window.addEventListener("wonder:locale-change", renderLocalized); stageCards(); renderLocalized();
  if(practiceRequested){
    // Read-only local-test observation; no method can move targets or settle a round.
    window.__CANOPY_CUT_PRACTICE_SNAPSHOT__=()=>practiceAuthorized&&state.round?{stage:state.stage,time:state.round.time,score:state.round.score,won:state.round.won,finished:state.round.finished,markedHarvested:state.round.markedHarvested??0,targets:state.round.targets.map(t=>({x:t.x,y:t.y,r:t.r,hazard:t.hazard,marked:!!t.marked,ripe:!t.marked||t.age>=t.ripeAge}))}:null;
    const practiceStatus=document.createElement('p');practiceStatus.setAttribute('role','status');$('start-game').after(practiceStatus);
    const waitForEntryReady=()=>new Promise(resolve=>{let done=false;const observer=new MutationObserver(check),timer=setTimeout(()=>finish(false),25000);function finish(ok){if(done)return;done=true;clearTimeout(timer);observer.disconnect();resolve(ok);}function check(){const root=document.documentElement;if(window.WeightPlayGameEntryLoader?.isActive&&root.dataset.wpGameEntryLoaderInstalled==='true'&&root.dataset.wpGameEntryLoaderActive!=='true')finish(true);else if(document.querySelector('.wp-game-entry-loader[data-state="error"]'))finish(false);}observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-wp-game-entry-loader-installed','data-wp-game-entry-loader-active'],childList:true,subtree:true});check();});
    void Promise.all([import('/src/game-local-practice.mjs'),import('./dawn-levels.mjs?v=20261027-cut-dawn1'),import('./dawn-round.mjs?v=20261027-cut-dawn1'),import('./dawn-copy.mjs?v=20261027-cut-dawn1'),waitForEntryReady()]).then(([practice,levels,round,copy,ready])=>{
      dawn={...levels,...round};dawnCopy=copy.DAWN_COPY;practiceAdapter=practice.LocalPractice;practiceStatus.textContent=dawnText('practice');
      if(!ready||window.__canopyCutPracticeAnalyticsSafe!==true)return false;
      return practiceAdapter.register({gameId:'animal-canopy-cut',stageIds:Array.from({length:60},(_,i)=>i+1),enable(value){
        practiceAuthorized=value===true&&window.__canopyCutPracticeAnalyticsSafe===true;
        $('start-game').disabled=!practiceAuthorized;
        if(practiceAuthorized){if(stageDefs.length===30)stageDefs.push(...dawn.DAWN_LEVELS);TOTAL_STAGES=60;progress.unlocked=60;practiceStatus.textContent=dawnText('practice');}
        else{stageDefs.splice(30);TOTAL_STAGES=30;progress.unlocked=1;stagePageStart=0;state.stage=1;state.round=null;state.resultWin=null;dawnButton.hidden=true;document.querySelector('[data-wp-local-practice]')?.remove();practiceStatus.textContent=dawnText('expired');show('main');}
        stageCards();renderLocalized();
      },startStage:id=>startStage(Number(id),'stage')});
    }).then(ok=>{if(!ok&&!practiceAuthorized){$('start-game').disabled=true;practiceStatus.textContent=dawnText('expired');}}).catch(()=>{$('start-game').disabled=true;practiceStatus.textContent=dawnText('expired');});
  }
})();
