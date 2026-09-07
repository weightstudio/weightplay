/* Internal prototype only. Target art is temporary until the art gate. */
(() => {
  const $ = (id) => document.getElementById(id);
  const emitAnalytics = (event, detail = {}) => {
    try {
      window.dispatchEvent(new CustomEvent("wp-canopy-analytics", { detail: { event, ...detail } }));
    } catch {
      // Analytics must never block a player action or alter the game state.
    }
  };
  const loadingPanel = $("loadingPanel");
  if (loadingPanel) { const hideLoading = () => { loadingPanel.hidden = true; loadingPanel.classList.add("hidden"); }; if (document.readyState === "complete") hideLoading(); else window.addEventListener("load", hideLoading, { once: true }); }
  const canvas = $("arena");
  const CANVAS_WIDTH = 960;
  const DEFAULT_ARENA_HEIGHT = 560;
  const COMPACT_ARENA_HEIGHT = 320;
  const ctx = canvas.getContext("2d");
  const canopyArt = new Image();
  canopyArt.src = "assets/animal-canopy-cut-original-assets-v1.png";
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
  const targetPreviewCopy = {
    en: { message: "First look: safe fruit briefly glows as it enters. Dark seed pods stay unlit—swipe only when the path is clear." },
    "zh-Hant": { message: "先看清楚：安全果實進場時會短暫發光。深色種莢不會發光——看清路線再滑動。" },
    "zh-Hans": { message: "先看清：安全果实入场时会短暂发光。深色种荚不会发光——看清路线再滑动。" },
    ja: { message: "まず見分けましょう。安全な果実は登場時に短く光ります。暗い種のさやは光りません。道筋を見てからなぞってください。" },
    ko: { message: "먼저 구분해 보세요. 안전한 과일은 들어올 때 잠깐 빛납니다. 어두운 씨앗 꼬투리는 빛나지 않으니 경로를 본 뒤 스와이프하세요." },
    es: { message: "Primero distingue: la fruta segura brilla un instante al entrar. Las vainas oscuras no brillan; desliza cuando veas la ruta." },
    "pt-BR": { message: "Primeiro, observe: a fruta segura brilha por um instante ao entrar. As vagens escuras não brilham; deslize quando enxergar o caminho." },
    fr: { message: "Observez d’abord : le fruit sûr brille brièvement à son arrivée. Les gousses sombres restent éteintes ; glissez quand la trajectoire est claire." },
    de: { message: "Erst unterscheiden: Sichere Früchte leuchten kurz beim Eintritt. Dunkle Samenschoten leuchten nicht – wische erst, wenn der Weg klar ist." },
    it: { message: "Prima distingui: la frutta sicura brilla per un attimo quando entra. I baccelli scuri non brillano; scorri quando il percorso è chiaro." },
    ru: { message: "Сначала различите цели: безопасный фрукт ненадолго светится при появлении. Тёмные стручки не светятся — проводите, когда путь понятен." },
    hi: { message: "पहले पहचानें: सुरक्षित फल आते समय थोड़ी देर चमकता है। गहरी बीज की फलियाँ नहीं चमकतीं—रास्ता साफ़ दिखे तभी स्वाइप करें।" },
    ar: { message: "ميّز الهدف أولًا: تضيء الثمرة الآمنة للحظة عند ظهورها. لا تضيء قرون البذور الداكنة؛ مرّر عندما يتضح المسار." },
  };
  const chainPayoffCopy = {
    en: { best: "Chain x{chain} adds +{bonus} to the best-score total. New best: {best}. Keep the clean path into the next wave.", chain: "Chain x{chain} adds +{bonus} to the best-score total. Best remains {best}; carry a clean path into the next wave.", none: "No chain bonus this wave. Best: {best}; try a clean path in the next wave." },
    "zh-Hant": { best: "連擊 x{chain} 為最佳成績加上 +{bonus}。新最佳：{best}。把乾淨路線延續到下一波。", chain: "連擊 x{chain} 為最佳成績加上 +{bonus}。最佳仍是 {best}；下一波再維持乾淨路線。", none: "這一波沒有連擊加成。最佳：{best}；下一波試著保持乾淨路線。" },
    "zh-Hans": { best: "连击 x{chain} 为最佳成绩加上 +{bonus}。新最佳：{best}。把干净路线延续到下一波。", chain: "连击 x{chain} 为最佳成绩加上 +{bonus}。最佳仍是 {best}；下一波再保持干净路线。", none: "这一波没有连击加成。最佳：{best}；下一波试着保持干净路线。" },
    ja: { best: "チェーン x{chain} がベストスコアに +{bonus}。新ベスト: {best}。次のウェーブもきれいな軌道を続けましょう。", chain: "チェーン x{chain} がベストスコアに +{bonus}。ベストは {best} のままです。次のウェーブもきれいな軌道を。", none: "このウェーブはチェーンボーナスなし。ベスト: {best}。次はきれいな軌道を目指しましょう。" },
    ko: { best: "연속 x{chain}이(가) 최고 점수에 +{bonus}를 더했습니다. 새 최고: {best}. 다음 웨이브에도 깔끔한 경로를 이어 보세요.", chain: "연속 x{chain}이(가) 최고 점수에 +{bonus}를 더했습니다. 최고 점수는 {best}로 유지됩니다. 다음 웨이브에도 깔끔한 경로를 이어 보세요.", none: "이번 웨이브에는 연속 보너스가 없습니다. 최고 점수: {best}. 다음 웨이브에서 깔끔한 경로를 시도하세요." },
    es: { best: "¡La cadena x{chain} añade +{bonus} al mejor resultado! Nuevo mejor: {best}. Mantén la ruta limpia en la siguiente oleada.", chain: "Cadena x{chain}: +{bonus} al mejor resultado. El mejor sigue en {best}; mantén una ruta limpia en la siguiente oleada.", none: "Esta oleada no da bonificación de cadena. Mejor: {best}; intenta una ruta limpia en la siguiente oleada." },
    "pt-BR": { best: "A sequência x{chain} adicionou +{bonus} ao melhor resultado. Novo melhor: {best}. Mantenha o caminho limpo na próxima onda.", chain: "A sequência x{chain} adicionou +{bonus} ao melhor resultado. O melhor continua em {best}; mantenha o caminho limpo na próxima onda.", none: "Esta onda não deu bônus de sequência. Melhor: {best}; tente um caminho limpo na próxima onda." },
    fr: { best: "La série x{chain} ajoute +{bonus} au meilleur score. Nouveau record : {best}. Gardez une trajectoire propre à la prochaine vague.", chain: "La série x{chain} ajoute +{bonus} au meilleur score. Le meilleur reste à {best} ; gardez une trajectoire propre à la prochaine vague.", none: "Pas de bonus de série cette vague. Meilleur score : {best} ; essayez une trajectoire propre à la prochaine." },
    de: { best: "Serie x{chain} gibt +{bonus} auf den Bestwert. Neuer Bestwert: {best}. Halte den sauberen Weg in der nächsten Welle.", chain: "Serie x{chain} gibt +{bonus} auf den Bestwert. Der Bestwert bleibt {best}; halte den sauberen Weg in der nächsten Welle.", none: "Diese Welle gab keinen Serienbonus. Bestwert: {best}; versuche in der nächsten Welle einen sauberen Weg." },
    it: { best: "La serie x{chain} aggiunge +{bonus} al miglior punteggio. Nuovo record: {best}. Mantieni il percorso pulito nella prossima ondata.", chain: "La serie x{chain} aggiunge +{bonus} al miglior punteggio. Il record resta {best}; mantieni il percorso pulito nella prossima ondata.", none: "Nessun bonus di serie in questa ondata. Record: {best}; prova un percorso pulito nella prossima." },
    ru: { best: "Серия x{chain} добавила +{bonus} к лучшему результату. Новый рекорд: {best}. Сохраните чистый путь в следующей волне.", chain: "Серия x{chain} добавила +{bonus} к лучшему результату. Лучший результат остаётся {best}; сохраните чистый путь в следующей волне.", none: "В этой волне бонуса за серию нет. Лучший результат: {best}; попробуйте чистый путь в следующей." },
    hi: { best: "सिलसिला x{chain} ने सर्वश्रेष्ठ स्कोर में +{bonus} जोड़ा। नया सर्वश्रेष्ठ: {best}। अगली लहर में साफ़ रास्ता बनाए रखें।", chain: "सिलसिला x{chain} ने सर्वश्रेष्ठ स्कोर में +{bonus} जोड़ा। सर्वश्रेष्ठ {best} पर है; अगली लहर में साफ़ रास्ता बनाए रखें।", none: "इस लहर में सिलसिला बोनस नहीं मिला। सर्वश्रेष्ठ: {best}; अगली लहर में साफ़ रास्ता आज़माएँ।" },
    ar: { best: "أضاف التتابع x{chain} قيمة +{bonus} إلى أفضل نتيجة. أفضل نتيجة جديدة: {best}. حافظ على المسار النظيف في الموجة التالية.", chain: "أضاف التتابع x{chain} قيمة +{bonus} إلى أفضل نتيجة. تبقى أفضل نتيجة {best}؛ حافظ على المسار النظيف في الموجة التالية.", none: "لا توجد مكافأة تتابع في هذه الموجة. الأفضل: {best}؛ حاول اتباع مسار نظيف في الموجة التالية." },
  };
  const settingsCopy = {
    en: "Settings", "zh-Hant": "設定", "zh-Hans": "设置", ja: "設定", ko: "설정",
    es: "Configuración", "pt-BR": "Configurações", fr: "Paramètres", de: "Einstellungen",
    it: "Impostazioni", ru: "Настройки", hi: "सेटिंग्स", ar: "الإعدادات",
  };
  const TOTAL_STAGES = 30;
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
  const arcLabel = (arc) => (stageArcs[currentLocale()] || stageArcs.en)[arc - 1] || stageArcs.en[arc - 1];
  const stageName = (definition) => currentLocale() === "zh-Hant" ? definition.nameZh : currentLocale() === "ar" ? definition.nameAr : definition.name;
  const stageNumber = (chapter, wave) => Math.max(1, Math.min(TOTAL_STAGES, (chapter - 1) * 5 + wave));
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
    const unlocked = Math.min(TOTAL_STAGES, Math.max(1, Number.isFinite(requested) ? requested : 1));
    return { unlocked: Math.max(unlocked, frontier), cleared, best: source.best && typeof source.best === "object" ? source.best : {} };
  };
  const loadProgress = () => {
    try { return normalizeProgress(JSON.parse(localStorage.getItem("wp-canopy-progress-v14") || localStorage.getItem("wp-canopy-progress-v13") || "{}")); } catch { return normalizeProgress({}); }
  };
  const saveProgress = () => { try { localStorage.setItem("wp-canopy-progress-v14", JSON.stringify(progress)); } catch {} };
  const progress = loadProgress();
  const state = { screen: "main", stage: Math.min(progress.unlocked, TOTAL_STAGES), chapter: 1, wave: 1, score: 0, best: Number(localStorage.getItem("wp-canopy-best") || 0), chain: 0, misses: 0, targets: [], stroke: [], active: false, strokeInputType: "unknown", elapsed: 0, last: 0, spawn: 0, ready: 0, previewUntil: 0, previewSafeShown: false, checkpointSpawned: false, checkpointHit: false, seed: 1, raf: 0, status: "ready", resultWin: null, bestImproved: false, cardsLocale: "" };
  const colors = { safe: ["#ffcf64", "#f8896c", "#96e6c1", "#b99cff"], hazard: "#25283b" };
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  const compactLandscape = () => window.matchMedia?.("(orientation: landscape) and (max-height: 460px)")?.matches ?? false;
  const arenaHeight = () => compactLandscape() ? COMPACT_ARENA_HEIGHT : DEFAULT_ARENA_HEIGHT;
  const syncArenaSize = () => {
    const nextHeight = arenaHeight();
    if (canvas.width !== CANVAS_WIDTH) canvas.width = CANVAS_WIDTH;
    if (canvas.height !== nextHeight) canvas.height = nextHeight;
    return nextHeight;
  };
  const currentLocale = () => localeCopy[window.WeightPlayFiveGameLocale?.locale] ? window.WeightPlayFiveGameLocale.locale : (localeCopy[document.documentElement.lang] ? document.documentElement.lang : "en");
  const copy = () => localeCopy[currentLocale()] || localeCopy.en;
  const fill = (value, values) => value.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
  const label = (key, values = {}) => fill(copy()[key] || localeCopy.en[key] || key, values);
  const targetPreviewLabel = () => (targetPreviewCopy[currentLocale()] || targetPreviewCopy.en).message;
  const key = () => keyCopy[currentLocale()] || keyCopy.en;
  const chainLesson = (key, values = {}) => fill((chainPayoffCopy[currentLocale()] || chainPayoffCopy.en)[key], values);
  const config = () => {
    const definition = stageFor(state.stage);
    return {
      ...definition,
      spawnGap: definition.rhythm ? 24 + Math.sin(state.elapsed * 3.2) * 5 : Math.max(22, 38 - definition.count * 2),
    };
  };
  function show(name) { state.screen = name; document.body.dataset.screen = name === "result" ? "battle" : name; cancelAnimationFrame(state.raf); const result = document.querySelector("#result-screen"); document.querySelectorAll(".screen").forEach((el) => { const isResult = el === result && name === "result"; const keepBattle = name === "result" && el.id === "battle-screen"; const on = isResult || keepBattle || el.dataset.screen === name; el.hidden = !on; el.classList.toggle("active", on); }); if (name === "battle") result?.setAttribute("hidden", ""); if (name === "battle") { state.last = performance.now(); state.raf = requestAnimationFrame(frame); } }
  function stageCards() {
    const copy = stageLabel();
    const unlocked = Math.max(1, Math.min(TOTAL_STAGES, progress.unlocked));
    $("stage-list").dataset.wpStageRecommendation = String(unlocked);
    $("stage-progress").textContent = fill(copy.total, { unlocked, total: TOTAL_STAGES });
    $("stage-list").innerHTML = stageDefs.map((definition) => {
      const available = definition.id <= unlocked;
      const cleared = Boolean(progress.cleared[definition.id]);
      const selected = definition.id === state.stage;
      const status = cleared ? copy.cleared : available ? copy.ready : copy.locked;
      const checkpoint = definition.checkpoint ? ` · ${copy.checkpoint}` : "";
      const objective = copy.objective[definition.mechanic] || stageCopy.en.objective[definition.mechanic];
      const aria = `${copy.stage} ${definition.id} · ${stageName(definition)} · ${objective}${checkpoint} · ${status}`;
      return `<button class="stage-card${available ? " unlocked" : " locked"}${cleared ? " cleared" : ""}${selected ? " selected" : ""}" type="button" data-wp-enter-battle data-stage="${definition.id}" data-chapter="${Math.ceil(definition.id / 5)}" data-wave="${((definition.id - 1) % 5) + 1}" aria-label="${aria}" aria-disabled="${available ? "false" : "true"}" aria-posinset="${definition.id}" aria-setsize="${TOTAL_STAGES}"${available ? "" : " disabled"}><span class="stage-number">${String(definition.id).padStart(2, "0")}</span><strong>${stageName(definition)}</strong><small>${arcLabel(definition.arc)}${checkpoint}</small><span>${objective}</span><b>${status}</b></button>`;
    }).join("");
    $("stage-list").querySelectorAll("button.unlocked").forEach((button) => button.addEventListener("click", () => {
      emitAnalytics("chapter_open", { from: "stage", outcome: "opened", stage: Number(button.dataset.stage) });
      startStage(Number(button.dataset.stage));
    }));
    state.cardsLocale = currentLocale();
    if (state.screen === "stage") requestAnimationFrame(centerStageCard);
  }
  function centerStageCard() {
    const anchor = Math.max(1, Math.min(TOTAL_STAGES, progress.unlocked));
    $("stage-list")?.querySelector(`[data-stage="${anchor}"]`)?.scrollIntoView({ block: "center", inline: "center" });
  }
  function random() { state.seed = (state.seed * 1664525 + 1013904223) >>> 0; return state.seed / 4294967296; }
  function startStage(stage = 1, from = "stage") {
    const nextStage = Math.max(1, Math.min(TOTAL_STAGES, Number(stage) || 1));
    if (nextStage > progress.unlocked) return;
    state.stage = nextStage;
    state.chapter = Math.ceil(nextStage / 5);
    state.wave = ((nextStage - 1) % 5) + 1;
    state.score = 0; state.chain = 0; state.misses = 0; state.targets = []; state.stroke = []; state.strokeInputType = "unknown";
    state.elapsed = 0; state.spawn = 0; state.ready = 54; state.previewUntil = 0; state.previewSafeShown = false; state.checkpointSpawned = false; state.checkpointHit = false; state.status = "ready"; state.resultWin = null;
    state.seed = nextStage * 100 + 1;
    emitAnalytics("wave_start", { from, outcome: "started", stage: nextStage });
    $("score-label").textContent = "0";
    $("next").hidden = false;
    $("next").disabled = false;
    show("battle"); renderLocalized();
  }
  function startWave(chapter = 1, wave = 1, from = "stage") { startStage(stageNumber(chapter, wave), from); }
  function addTarget() {
    const c = config();
    const height = syncArenaSize();
    const compact = height === COMPACT_ARENA_HEIGHT;
    const hazard = random() < c.hazard;
    const lane = Math.floor(random() * c.count);
    const kind = hazard ? 3 : Math.floor(random() * 3);
    const cue = !hazard && !state.previewSafeShown;
    const checkpoint = Boolean(c.checkpoint && !hazard && !state.checkpointSpawned && state.elapsed > 1.5);
    if (cue) state.previewSafeShown = true;
    if (checkpoint) state.checkpointSpawned = true;
    state.targets.push({
      x: 110 + (lane + random() * .55) * (740 / c.count),
      y: height - 40,
      vx: (random() - .5) * 1.8 + (c.wind || 0),
      vy: -(c.speed * (compact ? .62 : 1)) - random() * (compact ? 1.2 : 3),
      phase: random() * Math.PI * 2,
      r: hazard ? 24 : checkpoint ? 25 : 22,
      hazard, kind, cue, checkpoint, hit: false, asset: propArt,
      color: hazard ? colors.hazard : checkpoint ? "#ffd36b" : colors.safe[Math.floor(random() * colors.safe.length)],
    });
  }
  function point(e) { const r = canvas.getBoundingClientRect(); return { x: (e.clientX - r.left) * canvas.width / r.width, y: (e.clientY - r.top) * canvas.height / r.height }; }
  function distance(a,b) { return Math.hypot(a.x-b.x,a.y-b.y); }
  function renderStatus() { const preview = state.status === "targetPreview"; const message = preview ? targetPreviewLabel() : label(state.status, state.status === "chain" ? { chain: state.chain } : {}); $("battle-status").textContent = message; $("battle-status").dataset.targetPreview = preview ? "active" : "inactive"; canvas.setAttribute("aria-label", preview ? `${label("canvas")}. ${message}` : label("canvas")); }
  function hitAt(p) { state.targets.forEach((t) => { if (!t.hit && distance(p, t) < t.r + 24) { t.hit = true; if (t.hazard) { emitAnalytics("hazard_hit", { inputType: state.strokeInputType, from: "battle", outcome: "hazard", stage: state.stage }); state.chain = 0; state.misses = 3; state.status = "seedPod"; } else { emitAnalytics("safe_hit", { inputType: state.strokeInputType, from: "battle", outcome: "safe", stage: state.stage }); state.score += 10 + state.chain * 2; state.chain += 1; state.checkpointHit ||= Boolean(t.checkpoint); state.status = state.chain > 1 ? "chain" : "clean"; } renderStatus(); draw(); } }); }
  function finish() {
    const waveScore = state.score + state.chain * 5;
    const previousBest = state.best;
    state.best = Math.max(state.best, waveScore);
    state.bestImproved = state.best > previousBest;
    try { localStorage.setItem("wp-canopy-best", String(state.best)); } catch {}
    state.resultWin = state.misses < 3;
    if (state.resultWin) {
      progress.cleared[state.stage] = true;
      progress.unlocked = Math.max(progress.unlocked, Math.min(TOTAL_STAGES, state.stage + 1));
      progress.best[state.stage] = Math.max(Number(progress.best[state.stage] || 0), waveScore);
      saveProgress();
    }
    const outcome = state.resultWin ? "success" : "hazard";
    emitAnalytics("wave_result", { from: "battle", outcome, stage: state.stage });
    if (state.wave === 5) emitAnalytics("chapter_final_wave", { chapter: state.chapter, from: "battle", outcome, stage: state.stage });
    show("result"); renderLocalized();
  }
  function renderResult() {
    if (state.resultWin === null) return;
    const stageUi = stageLabel();
    const lessonKey = state.chain > 0 ? (state.bestImproved ? "best" : "chain") : "none";
    const lesson = chainLesson(lessonKey, { chain: state.chain, bonus: state.chain * 5, best: state.best });
    const checkpointNote = stageFor(state.stage).checkpoint ? ` · ${state.checkpointHit ? stageUi.checkpointHit : stageUi.checkpointMiss}` : "";
    $("result-title").textContent = state.resultWin ? label("waveClear") : label("waveEnded");
    $("result-copy").textContent = `${stageUi.stage} ${state.stage} · ${label("resultCopy", { chapter: state.chapter, wave: state.wave, score: state.score, chain: state.chain, best: state.best })} · ${lesson}${checkpointNote}`;
    $("to-stages").textContent = label("stages");
    const hasNext = state.resultWin && state.stage < TOTAL_STAGES;
    $("next").hidden = !hasNext;
    $("next").disabled = !hasNext;
    $("next").setAttribute("aria-disabled", String(!hasNext));
    $("next").textContent = hasNext ? `${stageUi.stage} ${state.stage + 1}` : label("replay");
    $("retry").textContent = label("retry");
  }
  function renderLocalized() {
    const targetKey = key();
    const settingsLabel = settingsCopy[currentLocale()] || settingsCopy.en;
    const currentStage = stageFor(state.stage);
    const stageUi = stageLabel();
    document.querySelector("#stage-screen h2").textContent = label("stageTitle");
    document.querySelector("#stage-screen .back").setAttribute("aria-label", label("backMain"));
    document.querySelector("#stage-screen nav").setAttribute("aria-label", label("stageSections"));
    document.querySelector("#stage-screen nav button").textContent = label("stages");
    document.querySelector("#battle-screen .back").setAttribute("aria-label", label("backStages"));
    $("battle-utility")?.setAttribute("aria-label", settingsLabel);
    $("battle-utility")?.setAttribute("title", settingsLabel);
    canvas.setAttribute("aria-label", label("canvas"));
    document.querySelector(".touch-hint").textContent = label("hint");
    $("battle-key")?.setAttribute("aria-label", targetKey.label);
    $("safe-key").textContent = targetKey.safe;
    $("hazard-key").textContent = targetKey.hazard;
    $("main-progress").textContent = `${label("bestScore")}: ${state.best}`;
    $("wave-label").textContent = `${stageUi.stage} ${state.stage} · ${label("waveLabel", { chapter: state.chapter, wave: state.wave })}`;
    $("stage-objective").textContent = `${arcLabel(currentStage.arc)} · ${stageUi.objective[currentStage.mechanic] || stageCopy.en.objective[currentStage.mechanic]}${currentStage.checkpoint ? ` · ${stageUi.checkpoint}` : ""}`;
    renderStatus();
    if (state.cardsLocale !== currentLocale() || state.screen === "stage") stageCards();
    renderResult(); draw();
  }
  function drawHudText(text, color, y) { ctx.save(); ctx.fillStyle = color; ctx.font = "bold 20px system-ui"; const rtl = currentLocale() === "ar"; ctx.direction = rtl ? "rtl" : "ltr"; ctx.textAlign = rtl ? "right" : "left"; ctx.fillText(text, rtl ? CANVAS_WIDTH - 24 : 24, y); ctx.restore(); }
  function draw() { const height = syncArenaSize(); const groundTop = height - 60; const c = config(); ctx.clearRect(0,0,canvas.width,canvas.height); const g=ctx.createLinearGradient(0,0,0,height);g.addColorStop(0,"#123c4b");g.addColorStop(1,"#071923");ctx.fillStyle=g;ctx.fillRect(0,0,CANVAS_WIDTH,height);ctx.fillStyle="#1d5d55";ctx.fillRect(0,groundTop,CANVAS_WIDTH,60); if (c.wind) { ctx.save(); ctx.strokeStyle="rgba(141,240,207,.16)"; ctx.lineWidth=3; for (let i = 0; i < 5; i += 1) { const y = 88 + i * Math.min(62, height / 7); const bend = Math.sin(state.elapsed * 2 + i) * 16; ctx.beginPath(); ctx.moveTo(54 + i * 150, y); ctx.quadraticCurveTo(180 + i * 110, y - bend, 300 + i * 130, y); ctx.stroke(); } ctx.restore(); } drawHudText(label("chain", { chain: state.chain }), "#8df0cf", 38); drawHudText(`${label("bestScore")} ${state.score}`, "#ffd36b", 68);state.stroke.forEach((p,i)=>{ctx.fillStyle=`rgba(255,240,170,${(i+1)/Math.max(1,state.stroke.length)*.55})`;ctx.beginPath();ctx.arc(p.x,p.y,3,0,Math.PI*2);ctx.fill()});state.targets.forEach(t=>{if(t.hit)return;ctx.save();ctx.translate(t.x,t.y);if(t.cue&&state.status==="targetPreview"){const alpha=reducedMotion ? .46 : .24+.2*(Math.sin(performance.now()/180)+1);ctx.beginPath();ctx.arc(0,0,t.r+15,0,Math.PI*2);ctx.strokeStyle=`rgba(141,240,207,${alpha})`;ctx.lineWidth=6;ctx.stroke()}if(t.checkpoint){ctx.beginPath();ctx.arc(0,0,t.r+12,0,Math.PI*2);ctx.strokeStyle="#ffd36b";ctx.lineWidth=4;ctx.stroke()}if(t.hazard&&c.shadow){ctx.beginPath();ctx.arc(0,0,t.r+8,0,Math.PI*2);ctx.strokeStyle="rgba(255,111,129,.75)";ctx.lineWidth=3;ctx.stroke()}if(t.asset?.complete&&t.asset.naturalWidth){const crop=t.hazard?[0,360,620,364]:[[0,0,560,420],[630,0,660,420],[1450,0,700,430]][t.kind];ctx.drawImage(t.asset,crop[0],crop[1],crop[2],crop[3],-t.r-10,-t.r-10,(t.r+10)*2,(t.r+10)*2);}else{ctx.fillStyle=t.color;ctx.beginPath();ctx.arc(0,0,t.r,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#fff8";ctx.lineWidth=4;ctx.stroke();ctx.fillStyle="#173042";ctx.font="bold 24px system-ui";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(t.hazard?"!":"✦",0,0);}ctx.restore()}); }
  function frame(now) { if (state.screen !== "battle") return; const height = syncArenaSize(); const compact = height === COMPACT_ARENA_HEIGHT; const dt=Math.min((now-state.last)/16.67,2); state.last=now; if (state.ready > 0) { state.ready -= dt; if (state.ready <= 0) { state.status = "targetPreview"; state.previewUntil = now + (reducedMotion ? 1050 : 1650); renderStatus(); } draw(); state.raf=requestAnimationFrame(frame); return; } if (state.status === "targetPreview" && now >= state.previewUntil) { state.status = "swipe"; renderStatus(); } const c=config(); state.elapsed += dt/60; state.spawn += dt; if(state.spawn > c.spawnGap){state.spawn=0;addTarget();if(random()<.28)addTarget()} state.targets.forEach(t=>{const wind = c.mechanic === "windSwitch" && Math.floor(state.elapsed) % 4 >= 2 ? -(c.wind || 0) : (c.wind || 0); t.x+=t.vx*dt + Math.sin(state.elapsed*3.4+t.phase)*(c.weave||0)*dt; t.vx += wind * .012 * dt; t.y+=t.vy*dt;t.vy+=(compact ? .12 : .24)*dt;t.x=Math.max(t.r,Math.min(CANVAS_WIDTH-t.r,t.x))}); state.targets=state.targets.filter(t=>t.y<height+60 && !t.hit); if(state.elapsed>c.duration || state.misses>=3){finish();return} $("score-label").textContent=`${state.score} · ${Math.ceil(c.duration-state.elapsed)}s`;draw();state.raf=requestAnimationFrame(frame); }
  canvas.addEventListener("pointerdown",(e)=>{if(state.screen!=="battle"||state.ready>0)return;canvas.setPointerCapture(e.pointerId);state.active=true;state.strokeInputType=e.pointerType||"unknown";state.stroke=[point(e)];hitAt(state.stroke[0])});
  canvas.addEventListener("pointermove",(e)=>{if(!state.active)return;const p=point(e);state.stroke.push(p);hitAt(p);if(state.stroke.length>24)state.stroke.shift()});
  ["pointerup","pointercancel","lostpointercapture"].forEach((event)=>canvas.addEventListener(event,()=>{if(state.active&&state.stroke.length)emitAnalytics("pointer_stroke",{inputType:state.strokeInputType,from:"battle",outcome:event==="pointerup"?"completed":"cancelled"});state.active=false;state.stroke=[];state.strokeInputType="unknown"}));
  $("start-game").addEventListener("click",()=>{show("stage");renderLocalized()}); document.querySelectorAll("[data-back]").forEach((b)=>b.addEventListener("click",()=>{if(b.dataset.back==="stage")emitAnalytics("stage_return",{from:state.screen==="result"?"result":"battle",outcome:"returned"});show(b.dataset.back);renderLocalized()})); $("retry").addEventListener("click",()=>{emitAnalytics("retry",{from:"result",outcome:"retry",stage:state.stage});startStage(state.stage,"result")}); $("next").addEventListener("click",()=>{if(!state.resultWin||state.stage>=TOTAL_STAGES)return;emitAnalytics("next_wave",{from:"result",outcome:"next_stage",stage:state.stage+1});startStage(state.stage+1,"result")}); $("to-stages").addEventListener("click",()=>{emitAnalytics("stage_return",{from:"result",outcome:"returned",stage:state.stage});show("stage");renderLocalized()}); $("localeSelect")?.addEventListener("change",()=>setTimeout(renderLocalized,0)); stageCards(); renderLocalized();
})();
