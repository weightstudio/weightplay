/* Internal prototype only. Geometry is temporary until the art gate. */
(() => {
  const $ = (id) => document.getElementById(id);
  const GAME_VERSION = 15;
  const loadingPanel = $("loadingPanel");
  if (loadingPanel) { const hideLoading = () => { loadingPanel.hidden = true; loadingPanel.classList.add("hidden"); }; if (document.readyState === "complete") hideLoading(); else window.addEventListener("load", hideLoading, { once: true }); }
  const canvas = $("arena");
  const ctx = canvas.getContext("2d");
  const heroArt = new Image();
  heroArt.src = "assets/animal-trap-trail-original-assets-v1.png";
  const propArt = new Image();
  propArt.src = "assets/animal-trap-trail-props.png";
  const state = { stage: 1, chapter: 1, room: 1, screen: "main", deaths: 0, bestRoom: Number(localStorage.getItem("wp-trail-best-stage") || localStorage.getItem("wp-trail-best-room") || 0), keys: new Set(), tap: null, player: null, raf: 0, last: 0, pulse: 0, jumpBuffer: 0, firstRoomJumpIntent: 0, firstRoomJumpQueued: false, firstRoomLandingSeen: false, roomTwoJumpIntent: 0, roomTwoJumpQueued: false, roomTwoLandingSeen: false, timingCue: "", statusKey: "", resultKind: "room" };
  const localeAliases = { "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", "pt-br": "pt-BR" };
  const localeCopy = {
    en: { stageTitle: "Trap Chapters", stageSections: "Stages", backMain: "Back to Main", backStages: "Back to Stages", chapter: "Chapter {n}", room: "Room {n}", deaths: "Deaths {n}", battleStatus: "Arrow keys move · Space jumps · E reveals a brief clue.", touchControls: "Touch controls", jump: "JUMP", pulse: "PULSE", touchHint: "Find the lantern. Traps reset only the current room.", canvasAria: "Moonlit Trap Trail play area", chapters: "Chapters", nextRoom: "Next Room", nextChapter: "Next Chapter", replayChapter: "Replay Chapter", retryRoom: "Retry Room", trailClear: "Trail clear", chapterClear: "Chapter clear", roomClear: "Room clear", resultCopy: "Chapter {chapter}, room {room} complete · Deaths {deaths}", gapDeath: "A gap opened — the path resets.", hazardDeath: "A hidden trap sprang — read the cue and retry.", pulseFeedback: "Moon pulse: the next trap cue is highlighted.", readPath: "READ THE PATH", moveLeft: "Move left", moveRight: "Move right", backToWeight: "Back to WeightPlay", loading: "Preparing the moonlit route…", progress: "Best room: {bestRoom} · Deaths: {deaths}", descriptions: ["learn the tells", "watch the delay", "read the reversal", "mixed rule finale"] },
    "zh-Hant": { stageTitle: "陷阱章節", stageSections: "關卡", backMain: "返回主選單", backStages: "返回關卡", chapter: "第 {n} 章", room: "第 {n} 房", deaths: "死亡 {n}", battleStatus: "方向鍵移動 · 空白鍵跳躍 · E 顯示短暫線索。", touchControls: "觸控操作", jump: "跳躍", pulse: "脈衝", touchHint: "尋找燈籠。陷阱只會重置目前房間。", canvasAria: "月影陷阱小徑遊玩區域", chapters: "章節", nextRoom: "下一房間", nextChapter: "下一章", replayChapter: "重玩章節", retryRoom: "重試房間", trailClear: "小徑完成", chapterClear: "章節完成", roomClear: "房間完成", resultCopy: "第 {chapter} 章，第 {room} 房完成 · 死亡 {deaths}", gapDeath: "裂縫打開了——路徑已重置。", hazardDeath: "隱藏陷阱觸發了——讀取線索後重試。", pulseFeedback: "月光脈衝：下一個陷阱線索已標示。", readPath: "讀懂小徑", moveLeft: "左移", moveRight: "右移", backToWeight: "返回 WeightPlay", loading: "正在準備月影小徑…", progress: "最佳房間：{bestRoom} · 死亡：{deaths}", descriptions: ["學會辨認提示", "留意延遲", "讀懂反轉", "混合規則終章"] },
    "zh-Hans": { stageTitle: "陷阱章节", stageSections: "关卡", backMain: "返回主菜单", backStages: "返回关卡", chapter: "第 {n} 章", room: "第 {n} 房", deaths: "死亡 {n}", battleStatus: "方向键移动 · 空格跳跃 · E 显示短暂线索。", touchControls: "触控操作", jump: "跳跃", pulse: "脉冲", touchHint: "寻找灯笼。陷阱只会重置当前房间。", canvasAria: "月影陷阱小径游玩区域", chapters: "章节", nextRoom: "下一房间", nextChapter: "下一章", replayChapter: "重玩章节", retryRoom: "重试房间", trailClear: "小径完成", chapterClear: "章节完成", roomClear: "房间完成", resultCopy: "第 {chapter} 章，第 {room} 房完成 · 死亡 {deaths}", gapDeath: "裂缝打开了——路径已重置。", hazardDeath: "隐藏陷阱触发了——读懂线索后重试。", pulseFeedback: "月光脉冲：下一个陷阱线索已标示。", readPath: "读懂小径", moveLeft: "左移", moveRight: "右移", backToWeight: "返回 WeightPlay", loading: "正在准备月影小径…", progress: "最佳房间：{bestRoom} · 死亡：{deaths}", descriptions: ["学会辨认提示", "留意延迟", "读懂反转", "混合规则终章"] },
    ja: { stageTitle: "トラップ章", stageSections: "ステージ", backMain: "メインへ戻る", backStages: "ステージへ戻る", chapter: "チャプター {n}", room: "ルーム {n}", deaths: "失敗 {n}", battleStatus: "矢印キーで移動 · SPACEでジャンプ · Eで短い手がかりを表示。", touchControls: "タッチ操作", jump: "ジャンプ", pulse: "パルス", touchHint: "ランタンを目指そう。罠でリセットされるのは現在のルームだけです。", canvasAria: "月影トラップトレイルのプレイエリア", chapters: "チャプター", nextRoom: "次のルーム", nextChapter: "次のチャプター", replayChapter: "チャプターを再プレイ", retryRoom: "ルームを再挑戦", trailClear: "トレイルクリア", chapterClear: "チャプタークリア", roomClear: "ルームクリア", resultCopy: "チャプター{chapter}・ルーム{room}をクリア · 失敗 {deaths}", gapDeath: "足場が開いた — 道がリセットされます。", hazardDeath: "隠し罠が発動 — 手がかりを読んで再挑戦。", pulseFeedback: "ムーンパルス：次の罠の手がかりを表示しました。", readPath: "道を読もう", moveLeft: "左へ移動", moveRight: "右へ移動", backToWeight: "WeightPlayへ戻る", loading: "月影の道を準備中…", progress: "ベストルーム：{bestRoom} · 失敗：{deaths}", descriptions: ["手がかりを学ぶ", "遅れに注目", "反転を読む", "混合ルール最終章"] },
    ko: { stageTitle: "함정 챕터", stageSections: "스테이지", backMain: "메인으로 돌아가기", backStages: "스테이지로 돌아가기", chapter: "챕터 {n}", room: "방 {n}", deaths: "실패 {n}", battleStatus: "화살표로 이동 · SPACE로 점프 · E로 짧은 단서를 확인합니다.", touchControls: "터치 조작", jump: "점프", pulse: "펄스", touchHint: "랜턴을 찾으세요. 함정은 현재 방만 초기화합니다.", canvasAria: "달빛 함정 길 플레이 영역", chapters: "챕터", nextRoom: "다음 방", nextChapter: "다음 챕터", replayChapter: "챕터 다시 하기", retryRoom: "방 다시 시도", trailClear: "길 클리어", chapterClear: "챕터 클리어", roomClear: "방 클리어", resultCopy: "챕터 {chapter} · 방 {room} 완료 · 실패 {deaths}", gapDeath: "틈이 열렸습니다 — 길이 초기화됩니다.", hazardDeath: "숨은 함정이 발동했습니다 — 단서를 읽고 다시 시도하세요.", pulseFeedback: "달빛 펄스: 다음 함정 단서를 표시했습니다.", readPath: "길을 읽으세요", moveLeft: "왼쪽 이동", moveRight: "오른쪽 이동", backToWeight: "WeightPlay로 돌아가기", loading: "달빛 길을 준비하는 중…", progress: "최고 방: {bestRoom} · 실패: {deaths}", descriptions: ["단서 익히기", "지연 살피기", "반전 읽기", "혼합 규칙 결말"] },
    es: { stageTitle: "Capítulos de trampas", stageSections: "Fases", backMain: "Volver al inicio", backStages: "Volver a fases", chapter: "Capítulo {n}", room: "Sala {n}", deaths: "Muertes {n}", battleStatus: "Flechas para moverte · ESPACIO para saltar · E muestra una pista breve.", touchControls: "Controles táctiles", jump: "SALTAR", pulse: "PULSO", touchHint: "Encuentra el farol. Las trampas solo reinician la sala actual.", canvasAria: "Zona de juego del Sendero de trampas lunares", chapters: "Capítulos", nextRoom: "Siguiente sala", nextChapter: "Siguiente capítulo", replayChapter: "Repetir capítulo", retryRoom: "Reintentar sala", trailClear: "Sendero despejado", chapterClear: "Capítulo superado", roomClear: "Sala superada", resultCopy: "Capítulo {chapter}, sala {room} completada · Muertes {deaths}", gapDeath: "Se abrió un hueco: el camino se reinicia.", hazardDeath: "Saltó una trampa oculta: lee la pista y vuelve a intentarlo.", pulseFeedback: "Pulso lunar: la pista de la próxima trampa está marcada.", readPath: "LEE EL CAMINO", moveLeft: "Mover a la izquierda", moveRight: "Mover a la derecha", backToWeight: "Volver a WeightPlay", loading: "Preparando el sendero lunar…", progress: "Mejor sala: {bestRoom} · Muertes: {deaths}", descriptions: ["aprende las señales", "mira el retraso", "lee el reverso", "final de reglas mixtas"] },
    "pt-BR": { stageTitle: "Capítulos de armadilhas", stageSections: "Fases", backMain: "Voltar ao início", backStages: "Voltar às fases", chapter: "Capítulo {n}", room: "Sala {n}", deaths: "Mortes {n}", battleStatus: "Setas movem · ESPAÇO pula · E revela uma pista breve.", touchControls: "Controles de toque", jump: "PULAR", pulse: "PULSO", touchHint: "Encontre a lanterna. As armadilhas reiniciam apenas a sala atual.", canvasAria: "Área de jogo da Trilha das Armadilhas Lunares", chapters: "Capítulos", nextRoom: "Próxima sala", nextChapter: "Próximo capítulo", replayChapter: "Repetir capítulo", retryRoom: "Tentar sala novamente", trailClear: "Trilha limpa", chapterClear: "Capítulo concluído", roomClear: "Sala concluída", resultCopy: "Capítulo {chapter}, sala {room} concluída · Mortes {deaths}", gapDeath: "Uma abertura surgiu — o caminho reinicia.", hazardDeath: "Uma armadilha oculta disparou — leia a pista e tente novamente.", pulseFeedback: "Pulso lunar: a pista da próxima armadilha foi destacada.", readPath: "LEIA O CAMINHO", moveLeft: "Mover para a esquerda", moveRight: "Mover para a direita", backToWeight: "Voltar ao WeightPlay", loading: "Preparando a trilha lunar…", progress: "Melhor sala: {bestRoom} · Mortes: {deaths}", descriptions: ["aprenda os sinais", "observe o atraso", "leia a inversão", "final de regras mistas"] },
    fr: { stageTitle: "Chapitres de pièges", stageSections: "Étapes", backMain: "Retour à l’accueil", backStages: "Retour aux étapes", chapter: "Chapitre {n}", room: "Salle {n}", deaths: "Morts {n}", battleStatus: "Les flèches déplacent · ESPACE saute · E révèle un bref indice.", touchControls: "Commandes tactiles", jump: "SAUTER", pulse: "IMPULSION", touchHint: "Trouve la lanterne. Les pièges réinitialisent seulement la salle actuelle.", canvasAria: "Zone de jeu du Sentier des pièges lunaires", chapters: "Chapitres", nextRoom: "Salle suivante", nextChapter: "Chapitre suivant", replayChapter: "Rejouer le chapitre", retryRoom: "Réessayer la salle", trailClear: "Sentier terminé", chapterClear: "Chapitre terminé", roomClear: "Salle terminée", resultCopy: "Chapitre {chapter}, salle {room} terminée · Morts {deaths}", gapDeath: "Un trou s’est ouvert — le chemin se réinitialise.", hazardDeath: "Un piège caché s’est déclenché — lis l’indice et réessaie.", pulseFeedback: "Impulsion lunaire : l’indice du prochain piège est marqué.", readPath: "LIS LE CHEMIN", moveLeft: "Aller à gauche", moveRight: "Aller à droite", backToWeight: "Retour à WeightPlay", loading: "Préparation du sentier lunaire…", progress: "Meilleure salle : {bestRoom} · Morts : {deaths}", descriptions: ["apprends les signes", "observe le délai", "lis l’inversion", "final à règles mixtes"] },
    de: { stageTitle: "Fallen-Kapitel", stageSections: "Abschnitte", backMain: "Zurück zum Start", backStages: "Zurück zu den Abschnitten", chapter: "Kapitel {n}", room: "Raum {n}", deaths: "Tode {n}", battleStatus: "Pfeile bewegen · LEERTASTE springt · E zeigt einen kurzen Hinweis.", touchControls: "Touch-Steuerung", jump: "SPRINGEN", pulse: "IMPULS", touchHint: "Finde die Laterne. Fallen setzen nur den aktuellen Raum zurück.", canvasAria: "Spielbereich des Mondlicht-Fallenpfads", chapters: "Kapitel", nextRoom: "Nächster Raum", nextChapter: "Nächstes Kapitel", replayChapter: "Kapitel wiederholen", retryRoom: "Raum erneut versuchen", trailClear: "Pfad geschafft", chapterClear: "Kapitel geschafft", roomClear: "Raum geschafft", resultCopy: "Kapitel {chapter}, Raum {room} geschafft · Tode {deaths}", gapDeath: "Eine Lücke öffnete sich — der Weg wird zurückgesetzt.", hazardDeath: "Eine versteckte Falle sprang los — lies den Hinweis und versuche es erneut.", pulseFeedback: "Mondimpuls: Der Hinweis auf die nächste Falle ist markiert.", readPath: "LIES DEN WEG", moveLeft: "Nach links", moveRight: "Nach rechts", backToWeight: "Zurück zu WeightPlay", loading: "Mondlicht-Pfad wird vorbereitet…", progress: "Bester Raum: {bestRoom} · Tode: {deaths}", descriptions: ["Hinweise erkennen", "Verzögerung beachten", "Umkehr lesen", "Finale mit Mischregeln"] },
    it: { stageTitle: "Capitoli delle trappole", stageSections: "Fasi", backMain: "Torna all’inizio", backStages: "Torna alle fasi", chapter: "Capitolo {n}", room: "Stanza {n}", deaths: "Morti {n}", battleStatus: "Le frecce muovono · SPAZIO salta · E mostra un breve indizio.", touchControls: "Comandi touch", jump: "SALTA", pulse: "IMPULSO", touchHint: "Trova la lanterna. Le trappole azzerano solo la stanza attuale.", canvasAria: "Area di gioco del Sentiero delle trappole lunari", chapters: "Capitoli", nextRoom: "Stanza successiva", nextChapter: "Capitolo successivo", replayChapter: "Rigioca il capitolo", retryRoom: "Riprova la stanza", trailClear: "Sentiero completato", chapterClear: "Capitolo completato", roomClear: "Stanza completata", resultCopy: "Capitolo {chapter}, stanza {room} completata · Morti {deaths}", gapDeath: "Si è aperto un varco — il percorso viene azzerato.", hazardDeath: "È scattata una trappola nascosta — leggi l’indizio e riprova.", pulseFeedback: "Impulso lunare: l’indizio della prossima trappola è evidenziato.", readPath: "LEGGI IL PERCORSO", moveLeft: "Muovi a sinistra", moveRight: "Muovi a destra", backToWeight: "Torna a WeightPlay", loading: "Preparazione del sentiero lunare…", progress: "Migliore stanza: {bestRoom} · Morti: {deaths}", descriptions: ["impara i segnali", "osserva il ritardo", "leggi l’inversione", "finale con regole miste"] },
    ru: { stageTitle: "Главы с ловушками", stageSections: "Этапы", backMain: "Вернуться в начало", backStages: "Вернуться к этапам", chapter: "Глава {n}", room: "Комната {n}", deaths: "Падения: {n}", battleStatus: "Стрелки двигают · ПРОБЕЛ прыгает · E показывает короткую подсказку.", touchControls: "Сенсорное управление", jump: "ПРЫЖОК", pulse: "ИМПУЛЬС", touchHint: "Найдите фонарь. Ловушки сбрасывают только текущую комнату.", canvasAria: "Игровая зона Лунной тропы ловушек", chapters: "Главы", nextRoom: "Следующая комната", nextChapter: "Следующая глава", replayChapter: "Повторить главу", retryRoom: "Повторить комнату", trailClear: "Тропа пройдена", chapterClear: "Глава пройдена", roomClear: "Комната пройдена", resultCopy: "Глава {chapter}, комната {room} пройдена · Падения: {deaths}", gapDeath: "Открылся провал — путь сброшен.", hazardDeath: "Сработала скрытая ловушка — прочитайте подсказку и попробуйте снова.", pulseFeedback: "Лунный импульс: подсказка следующей ловушки выделена.", readPath: "ЧИТАЙТЕ ПУТЬ", moveLeft: "Двигаться влево", moveRight: "Двигаться вправо", backToWeight: "Вернуться в WeightPlay", loading: "Подготовка лунной тропы…", progress: "Лучшая комната: {bestRoom} · Падения: {deaths}", descriptions: ["изучите подсказки", "следите за задержкой", "читайте разворот", "финал смешанных правил"] },
    hi: { stageTitle: "जाल अध्याय", stageSections: "चरण", backMain: "मुख्य पर लौटें", backStages: "चरणों पर लौटें", chapter: "अध्याय {n}", room: "कमरा {n}", deaths: "मृत्यु {n}", battleStatus: "तीर कुंजियों से चलें · SPACE से कूदें · E से छोटा संकेत दिखाएँ।", touchControls: "टच नियंत्रण", jump: "कूदें", pulse: "पल्स", touchHint: "लालटेन खोजें। जाल केवल वर्तमान कमरे को रीसेट करते हैं।", canvasAria: "चांदनी जाल पथ का खेल क्षेत्र", chapters: "अध्याय", nextRoom: "अगला कमरा", nextChapter: "अगला अध्याय", replayChapter: "अध्याय फिर खेलें", retryRoom: "कमरा फिर आज़माएँ", trailClear: "पथ पूरा", chapterClear: "अध्याय पूरा", roomClear: "कमरा पूरा", resultCopy: "अध्याय {chapter}, कमरा {room} पूरा · मृत्यु {deaths}", gapDeath: "दरार खुल गई — रास्ता रीसेट हो गया।", hazardDeath: "छिपा जाल सक्रिय हुआ — संकेत पढ़कर फिर कोशिश करें।", pulseFeedback: "मून पल्स: अगले जाल का संकेत दिखाया गया है।", readPath: "रास्ता पढ़ें", moveLeft: "बाएँ चलें", moveRight: "दाएँ चलें", backToWeight: "WeightPlay पर लौटें", loading: "चांदनी रास्ता तैयार हो रहा है…", progress: "सर्वश्रेष्ठ कमरा: {bestRoom} · मृत्यु: {deaths}", descriptions: ["संकेत पहचानें", "देरी देखें", "उलटाव पढ़ें", "मिश्रित नियमों का अंत"] },
    ar: { stageTitle: "فصول الفخاخ", stageSections: "المراحل", backMain: "العودة إلى البداية", backStages: "العودة إلى المراحل", chapter: "الفصل {n}", room: "الغرفة {n}", deaths: "الوفيات {n}", battleStatus: "تحرك بالأسهم · اقفز بمفتاح المسافة · يعرض E تلميحاً قصيراً.", touchControls: "عناصر تحكم باللمس", jump: "قفز", pulse: "نبضة", touchHint: "اعثر على المصباح. تعيد الفخاخ ضبط الغرفة الحالية فقط.", canvasAria: "منطقة لعب درب فخاخ ضوء القمر", chapters: "الفصول", nextRoom: "الغرفة التالية", nextChapter: "الفصل التالي", replayChapter: "إعادة الفصل", retryRoom: "إعادة محاولة الغرفة", trailClear: "اكتمل الدرب", chapterClear: "اكتمل الفصل", roomClear: "اكتملت الغرفة", resultCopy: "اكتمل الفصل {chapter}، الغرفة {room} · الوفيات {deaths}", gapDeath: "انفتح شق — تمت إعادة ضبط الطريق.", hazardDeath: "انطلق فخ مخفي — اقرأ التلميح وحاول مجدداً.", pulseFeedback: "نبضة القمر: تم إبراز تلميح الفخ التالي.", readPath: "اقرأ الطريق", moveLeft: "تحرك يساراً", moveRight: "تحرك يميناً", backToWeight: "العودة إلى WeightPlay", loading: "جارٍ تجهيز درب ضوء القمر…", progress: "أفضل غرفة: {bestRoom} · الوفيات: {deaths}", descriptions: ["تعلّم الإشارات", "راقب التأخير", "اقرأ الانعكاس", "نهاية القواعد المختلطة"] },
  };
  const stageTouchHintCopy = {
    en: "Find the lantern. Traps reset only the current stage.",
    "zh-Hant": "尋找燈籠。陷阱只會重置目前關卡。",
    "zh-Hans": "寻找灯笼。陷阱只会重置当前关卡。",
    ja: "ランタンを目指そう。罠でリセットされるのは現在のステージだけです。",
    ko: "랜턴을 찾으세요. 함정은 현재 스테이지만 초기화합니다.",
    es: "Encuentra el farol. Las trampas solo reinician la fase actual.",
    "pt-BR": "Encontre a lanterna. As armadilhas reiniciam apenas a fase atual.",
    fr: "Trouve la lanterne. Les pièges réinitialisent seulement l’étape actuelle.",
    de: "Finde die Laterne. Fallen setzen nur den aktuellen Abschnitt zurück.",
    it: "Trova la lanterna. Le trappole azzerano solo la fase attuale.",
    ru: "Найдите фонарь. Ловушки сбрасывают только текущий этап.",
    hi: "लालटेन खोजें। जाल केवल वर्तमान चरण को रीसेट करते हैं।",
    ar: "اعثر على المصباح. تعيد الفخاخ ضبط المرحلة الحالية فقط."
  };
  const campaignStages = [
    { name: "Moonlit Arrival", nameZh: "月影初行", objective: "Read the first lit landing window.", objectiveZh: "讀懂第一個發光落點。", mechanics: ["gap", "pulse"], gap: 320, spike: 520, fake: 690 },
    { name: "Lantern Footbridge", nameZh: "燈籠木橋", objective: "Clear a narrow gap, then commit to the jump cue.", objectiveZh: "越過窄裂縫，再依線索果斷跳躍。", mechanics: ["gap", "hidden"], gap: 342, spike: 552, fake: 716 },
    { name: "False Floor", nameZh: "假地板", objective: "Use Pulse to confirm the safe tile before the lantern.", objectiveZh: "在燈籠前用脈衝確認安全地板。", mechanics: ["gap", "pulse", "hidden"], gap: 364, spike: 574, fake: 702 },
    { name: "Quiet Switchback", nameZh: "靜默折返", objective: "Keep your rhythm through a longer landing window.", objectiveZh: "維持節奏，穿過較長的落點窗口。", mechanics: ["gap", "hidden"], gap: 386, spike: 590, fake: 728 },
    { name: "Lantern Keeper Check", nameZh: "燈籠守望檢查", objective: "Checkpoint: combine the first arc's gap and trap reads.", objectiveZh: "檢查點：整合第一弧的裂縫與陷阱判讀。", mechanics: ["gap", "pulse", "hidden"], gap: 350, spike: 610, fake: 742 },
    { name: "Tidal Footfall", nameZh: "潮汐踏步", objective: "Watch a platform drift while you cross.", objectiveZh: "留意平台移動，再完成穿越。", mechanics: ["gap", "moving"], gap: 330, spike: 530, fake: 690, moving: true },
    { name: "Delayed Spike", nameZh: "延遲尖刺", objective: "Read the spike's delayed sweep instead of rushing.", objectiveZh: "讀懂尖刺延遲掃動，不要急著衝刺。", mechanics: ["moving", "delay"], gap: 356, spike: 552, fake: 720, moving: true },
    { name: "Windward Ledger", nameZh: "迎風航記", objective: "Counter a soft crosswind with small corrections.", objectiveZh: "用小幅修正抵抗輕微側風。", mechanics: ["moving", "wind"], gap: 374, spike: 574, fake: 704, moving: true, wind: true },
    { name: "Tideglass Route", nameZh: "潮鏡路線", objective: "Pulse once, then trust the moving landing window.", objectiveZh: "使用一次脈衝，再相信移動中的落點窗口。", mechanics: ["moving", "wind", "pulse"], gap: 398, spike: 596, fake: 736, moving: true, wind: true },
    { name: "Tide Bell Check", nameZh: "潮鐘檢查", objective: "Checkpoint: cross the tidal arc without losing momentum.", objectiveZh: "檢查點：保持動能穿越潮汐弧段。", mechanics: ["moving", "wind", "hidden"], gap: 344, spike: 620, fake: 748, moving: true, wind: true },
    { name: "Mirror Step", nameZh: "鏡面步", objective: "Notice the first reversed input before the gap.", objectiveZh: "在裂縫前察覺第一次反轉操作。", mechanics: ["reverse", "gap"], gap: 326, spike: 528, fake: 694, reverse: true },
    { name: "Echo Route", nameZh: "回聲路線", objective: "Use the same landmark reads with reversed movement.", objectiveZh: "在移動反轉下使用相同地標判讀。", mechanics: ["reverse", "hidden"], gap: 352, spike: 556, fake: 714, reverse: true },
    { name: "Glass Decoy", nameZh: "玻璃誘餌", objective: "Read a false floor while the controls stay reversed.", objectiveZh: "在操作反轉時讀出假地板。", mechanics: ["reverse", "hidden", "pulse"], gap: 378, spike: 578, fake: 700, reverse: true },
    { name: "Mirror Current", nameZh: "鏡潮", objective: "Correct direction and timing together.", objectiveZh: "同時修正方向與跳躍時機。", mechanics: ["reverse", "wind"], gap: 402, spike: 602, fake: 734, reverse: true, wind: true },
    { name: "Mirror Warden Check", nameZh: "鏡衛檢查", objective: "Checkpoint: master the reversal before the vault arc.", objectiveZh: "檢查點：在進入穹頂弧段前掌握反轉。", mechanics: ["reverse", "hidden", "pulse"], gap: 348, spike: 624, fake: 750, reverse: true },
    { name: "Low Vault", nameZh: "低穹頂", objective: "Jump the floor trap without touching the low ceiling.", objectiveZh: "跳過地面陷阱，同時避開低穹頂。", mechanics: ["ceiling", "gap"], gap: 334, spike: 536, fake: 688, ceiling: true },
    { name: "Vault Split", nameZh: "穹頂分流", objective: "Choose a clean line through the first double hazard.", objectiveZh: "選擇乾淨路線穿過第一組雙重危險。", mechanics: ["ceiling", "second-gap"], gap: 360, gap2: 748, spike: 560, fake: 706, ceiling: true, secondGap: true },
    { name: "Stone Breath", nameZh: "石窟吐息", objective: "Time a jump while the ceiling cue narrows the route.", objectiveZh: "在穹頂線索收窄路線時掌握跳躍。", mechanics: ["ceiling", "moving", "second-gap"], gap: 382, gap2: 730, spike: 584, fake: 718, ceiling: true, moving: true, secondGap: true },
    { name: "Vault Lantern", nameZh: "穹頂燈火", objective: "Keep a low line, then climb only after the final gap.", objectiveZh: "保持低位，越過最後裂縫後才上跳。", mechanics: ["ceiling", "wind", "second-gap"], gap: 404, gap2: 758, spike: 608, fake: 742, ceiling: true, wind: true, secondGap: true },
    { name: "Vault Seal Check", nameZh: "穹頂封印檢查", objective: "Checkpoint: blend low clearance and double-gap reads.", objectiveZh: "檢查點：整合低空間與雙裂縫判讀。", mechanics: ["ceiling", "wind", "second-gap"], gap: 350, gap2: 742, spike: 626, fake: 754, ceiling: true, wind: true, secondGap: true },
    { name: "Storm Lantern", nameZh: "風暴燈", objective: "Read the route while wind and darkness hide its edges.", objectiveZh: "在風與黑暗遮住邊緣時讀懂路線。", mechanics: ["wind", "dark", "gap"], gap: 328, spike: 538, fake: 696, wind: true, dark: true },
    { name: "Rainline", nameZh: "雨線", objective: "Use the pulse reveal to hold a steady landing.", objectiveZh: "使用脈衝揭示，穩定落在安全區。", mechanics: ["wind", "dark", "pulse"], gap: 354, spike: 562, fake: 714, wind: true, dark: true },
    { name: "Storm Split", nameZh: "風暴分流", objective: "Cross two gaps while the wind changes your drift.", objectiveZh: "在風向改變漂移時越過兩道裂縫。", mechanics: ["wind", "dark", "second-gap"], gap: 376, gap2: 726, spike: 586, fake: 708, wind: true, dark: true, secondGap: true },
    { name: "Thunder Decoy", nameZh: "雷鳴誘餌", objective: "Ignore the false floor and follow the brief pulse cue.", objectiveZh: "忽略假地板，跟隨短暫脈衝線索。", mechanics: ["wind", "dark", "hidden", "second-gap"], gap: 400, gap2: 748, spike: 610, fake: 738, wind: true, dark: true, secondGap: true },
    { name: "Storm Lantern Check", nameZh: "風暴燈檢查", objective: "Checkpoint: finish the storm arc with a clean route read.", objectiveZh: "檢查點：以清楚路線判讀完成風暴弧段。", mechanics: ["wind", "dark", "pulse", "second-gap"], gap: 346, gap2: 738, spike: 628, fake: 756, wind: true, dark: true, secondGap: true },
    { name: "Moon Gate Approach", nameZh: "月門前路", objective: "Combine the gap, reversal, and ceiling lessons.", objectiveZh: "整合裂縫、反轉與穹頂教學。", mechanics: ["gap", "reverse", "ceiling"], gap: 332, spike: 548, fake: 698, reverse: true, ceiling: true },
    { name: "Moon Gate Crosswind", nameZh: "月門側風", objective: "Hold your line through wind, reversal, and a second gap.", objectiveZh: "在風、反轉與第二道裂縫中維持路線。", mechanics: ["wind", "reverse", "second-gap"], gap: 358, gap2: 730, spike: 574, fake: 718, wind: true, reverse: true, secondGap: true },
    { name: "Moon Gate Shadow", nameZh: "月門暗影", objective: "Pulse through darkness, then clear the low ceiling.", objectiveZh: "穿過黑暗脈衝，再避開低穹頂。", mechanics: ["dark", "ceiling", "pulse"], gap: 384, spike: 600, fake: 730, dark: true, ceiling: true },
    { name: "Moon Gate Trial", nameZh: "月門試煉", objective: "Choose deliberate jumps across every mixed-rule cue.", objectiveZh: "依每個混合規則線索做出精準跳躍。", mechanics: ["wind", "reverse", "dark", "second-gap"], gap: 406, gap2: 754, spike: 622, fake: 744, wind: true, reverse: true, dark: true, secondGap: true },
    { name: "Moon Gate Finale", nameZh: "月門終章", objective: "Final checkpoint: read every rule and reach the moon gate.", objectiveZh: "最終檢查點：讀懂全部規則並抵達月門。", mechanics: ["wind", "reverse", "dark", "ceiling", "second-gap"], gap: 350, gap2: 742, spike: 636, fake: 758, wind: true, reverse: true, dark: true, ceiling: true, secondGap: true },
  ].map((stage, index) => ({ ...stage, id: index + 1, arc: Math.floor(index / 5) + 1, room: (index % 5) + 1, checkpoint: (index + 1) % 5 === 0 }));
  const nextStageCopy = { en: "Next Stage", "zh-Hant": "下一關", "zh-Hans": "下一关", ja: "次のステージ", ko: "다음 스테이지", es: "Siguiente fase", "pt-BR": "Próxima fase", fr: "Étape suivante", de: "Nächster Abschnitt", it: "Fase successiva", ru: "Следующий этап", hi: "अगला चरण", ar: "المرحلة التالية" };
  const retryStageCopy = { en: "Retry Stage", "zh-Hant": "重試關卡", "zh-Hans": "重试关卡", ja: "ステージを再挑戦", ko: "스테이지 다시 시도", es: "Reintentar fase", "pt-BR": "Tentar fase novamente", fr: "Réessayer l’étape", de: "Abschnitt erneut", it: "Riprova la fase", ru: "Повторить этап", hi: "चरण फिर आज़माएँ", ar: "إعادة محاولة المرحلة" };
  const landingCueCopy = {
    en: "Moon pulse: land in the lit window after the gap, then jump the spike.",
    "zh-Hant": "月光脈衝：在裂縫後的發光區落地，再跳過尖刺。",
    "zh-Hans": "月光脉冲：在裂缝后的发光区落地，再跳过尖刺。",
    ja: "ムーンパルス：裂け目の先の光る範囲に着地してから、トゲを跳び越えよう。",
    ko: "달빛 펄스: 틈 뒤의 빛나는 구간에 착지한 뒤 가시를 뛰어넘으세요.",
    es: "Pulso lunar: aterriza en la zona iluminada tras el hueco y luego salta las púas.",
    "pt-BR": "Pulso lunar: pouse na faixa iluminada após a abertura e depois pule os espinhos.",
    fr: "Impulsion lunaire : atterrissez dans la zone éclairée après le trou, puis sautez les piques.",
    de: "Mondimpuls: Lande im Lichtfenster hinter der Lücke und springe dann über die Spitzen.",
    it: "Impulso lunare: atterra nella zona illuminata oltre il varco, poi salta gli spuntoni.",
    ru: "Лунный импульс: приземлитесь в светлом окне за провалом, затем перепрыгните шипы.",
    hi: "मून पल्स: दरार के बाद चमकते हिस्से में उतरें, फिर काँटों पर कूदें।",
    ar: "نبضة القمر: اهبط في النافذة المضيئة بعد الشق، ثم اقفز فوق الأشواك.",
  };
  const landingWindowCopy = {
    en: "SAFE LANDING",
    "zh-Hant": "安全落點",
    "zh-Hans": "安全落点",
    ja: "安全な着地点",
    ko: "안전 착지",
    es: "ATERRIZAJE SEGURO",
    "pt-BR": "POUSO SEGURO",
    fr: "ATTERRISSAGE SÛR",
    de: "SICHERE LANDUNG",
    it: "ATTERRAGGIO SICURO",
    ru: "БЕЗОПАСНАЯ ПОСАДКА",
    hi: "सुरक्षित लैंडिंग",
    ar: "هبوط آمن",
  };
  const timingCueCopy = {
    gap: {
      en: "Jump before the dark edge, then land in the lit window.",
      "zh-Hant": "在暗邊前跳起，落在發光區，再跳過尖刺。",
      "zh-Hans": "在暗边前起跳，落在发光区，再跳过尖刺。",
      ja: "暗い端の前で跳び、光る範囲に着地してからトゲを越えよう。",
      ko: "어두운 가장자리 전에 점프해 빛나는 구간에 착지한 뒤 가시를 넘으세요.",
      es: "Salta antes del borde oscuro, aterriza en la zona iluminada y supera las púas.",
      "pt-BR": "Pule antes da borda escura, pouse na faixa iluminada e passe pelos espinhos.",
      fr: "Saute avant le bord sombre, atterris dans la zone éclairée, puis franchis les piques.",
      de: "Springe vor dem dunklen Rand, lande im Lichtfenster und überspringe dann die Spitzen.",
      it: "Salta prima del bordo scuro, atterra nella zona illuminata e supera gli spuntoni.",
      ru: "Прыгните перед тёмным краем, приземлитесь в светлом окне и перепрыгните шипы.",
      hi: "गहरे किनारे से पहले कूदें, चमकते हिस्से में उतरें और फिर काँटों को पार करें।",
      ar: "اقفز قبل الحافة المعتمة، واهبط في النافذة المضيئة، ثم تجاوز الأشواك.",
    },
    landing: {
      en: "Safe landing — press JUMP now to clear the spike.",
      "zh-Hant": "安全落點——現在按下跳躍，越過尖刺。",
      "zh-Hans": "安全落点——现在按下跳跃，越过尖刺。",
      ja: "安全な着地点です。今ジャンプしてトゲを越えよう。",
      ko: "안전 착지입니다. 지금 점프해 가시를 넘으세요.",
      es: "Aterrizaje seguro: pulsa SALTAR ahora para superar las púas.",
      "pt-BR": "Pouso seguro: pressione PULAR agora para passar pelos espinhos.",
      fr: "Atterrissage sûr : appuie sur SAUTER maintenant pour franchir les piques.",
      de: "Sichere Landung: Jetzt SPRINGEN drücken, um die Spitzen zu überwinden.",
      it: "Atterraggio sicuro: premi SALTA ora per superare gli spuntoni.",
      ru: "Безопасная посадка: нажмите ПРЫЖОК сейчас, чтобы преодолеть шипы.",
      hi: "सुरक्षित लैंडिंग — काँटों को पार करने के लिए अभी कूदें।",
      ar: "هبوط آمن — اضغط قفز الآن لتجاوز الأشواك.",
    },
    spike: {
      en: "Jump now — clear the spike, then keep moving right.",
      "zh-Hant": "現在跳躍——越過尖刺後繼續向右。",
      "zh-Hans": "现在跳跃——越过尖刺后继续向右。",
      ja: "今ジャンプ——トゲを越えて右へ進もう。",
      ko: "지금 점프하세요. 가시를 넘고 오른쪽으로 계속 가세요.",
      es: "Salta ahora: supera las púas y sigue a la derecha.",
      "pt-BR": "Pule agora: passe pelos espinhos e continue à direita.",
      fr: "Saute maintenant : franchis les piques, puis continue à droite.",
      de: "Jetzt springen: Spitzen überwinden und weiter nach rechts.",
      it: "Salta ora: supera gli spuntoni e continua a destra.",
      ru: "Прыгайте сейчас: преодолейте шипы и двигайтесь вправо.",
      hi: "अभी कूदें — काँटों को पार करके दाईं ओर बढ़ें।",
      ar: "اقفز الآن — تجاوز الأشواك ثم واصل إلى اليمين.",
    },
    clear: {
      en: "Past the spike — keep moving to the lantern.",
      "zh-Hant": "通過尖刺——繼續前往燈籠。",
      "zh-Hans": "通过尖刺——继续前往灯笼。",
      ja: "トゲを越えた。ランタンまで進もう。",
      ko: "가시를 넘었습니다. 랜턴까지 계속 가세요.",
      es: "Pasadas las púas: sigue hacia el farol.",
      "pt-BR": "Depois dos espinhos: continue até a lanterna.",
      fr: "Après les piques : continue vers la lanterne.",
      de: "Hinter den Spitzen: weiter zur Laterne.",
      it: "Oltre gli spuntoni: continua verso la lanterna.",
      ru: "Шипы позади: двигайтесь к фонарю.",
      hi: "काँटे पीछे हैं — लालटेन की ओर बढ़ें।",
      ar: "تجاوزت الأشواك — واصل إلى المصباح.",
    },
    hidden: {
      en: "Hidden floor ahead — press JUMP before the lantern.",
      "zh-Hant": "前方有隱藏地板——在燈籠前按下跳躍。",
      "zh-Hans": "前方有隐藏地板——在灯笼前按下跳跃。",
      ja: "前方に隠し床。ランタンの前でジャンプしよう。",
      ko: "앞에 숨은 바닥이 있습니다. 랜턴 전에 점프하세요.",
      es: "Hay un suelo oculto delante: pulsa SALTAR antes del farol.",
      "pt-BR": "Há um piso oculto à frente: pressione PULAR antes da lanterna.",
      fr: "Sol caché devant : appuie sur SAUTER avant la lanterne.",
      de: "Vor dir liegt ein versteckter Boden: Drücke vor der Laterne SPRINGEN.",
      it: "Pavimento nascosto avanti: premi SALTA prima della lanterna.",
      ru: "Впереди скрытый пол: нажмите ПРЫЖОК до фонаря.",
      hi: "आगे छिपी ज़मीन है — लालटेन से पहले कूदें।",
      ar: "هناك أرض مخفية أمامك — اضغط قفز قبل المصباح.",
    },
  };
  function format(value, values) { return value.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? ""); }
  function currentLocale() {
    const candidate = window.WeightPlayFiveGameLocale?.locale || document.documentElement.lang || "en";
    return localeCopy[localeAliases[candidate] || candidate] ? (localeAliases[candidate] || candidate) : "en";
  }
  function copy() { return localeCopy[currentLocale()]; }
  function stageFor(stageId = state.stage) { return campaignStages[Math.max(0, Math.min(campaignStages.length - 1, stageId - 1))]; }
  function stageName(stageId = state.stage) {
    const stage = stageFor(stageId);
    return currentLocale() === "zh-Hant" ? stage.nameZh : stage.name;
  }
  function stageObjective(stageId = state.stage) {
    const stage = stageFor(stageId);
    return currentLocale() === "zh-Hant" ? stage.objectiveZh : stage.objective;
  }
  function maxUnlockedStage() { return Math.min(campaignStages.length, Math.max(1, state.bestRoom + 1)); }
  function chapterLabel(number) { return format(copy().chapter, { n: number }); }
  function roomLabel(number) { return format(copy().room, { n: number }); }
  function deathLabel(number) { return format(copy().deaths, { n: number }); }
  function setText(id, value) { const element = $(id); if (element) element.textContent = value; }
  function updateMainProgress() { setText("main-progress", format(copy().progress, { bestRoom: state.bestRoom, deaths: state.deaths })); }
  function firstRoomTimingKey() {
    if (state.chapter !== 1 || state.room !== 1 || !state.player) return "";
    const t = trapData();
    const p = state.player;
    if (p.x < t.gap - 42) return "approach";
    if (p.x < t.gap + 70) return "gap";
    if (p.x < t.spike - 42) return state.firstRoomLandingSeen ? (p.grounded ? "landing" : "spike") : "gap";
    if (p.x < t.spike + 52) return "spike";
    if (p.x < t.fake + 52) return "hidden";
    return "clear";
  }
  function roomTwoTimingKey() {
    if (state.chapter !== 1 || state.room < 2 || state.room > 3 || !state.player) return "";
    const t = trapData();
    const p = state.player;
    if (p.x < t.gap - 42) return "approach";
    if (p.x < t.gap + 70) return "gap";
    if (p.x < t.spike - 42) return state.roomTwoLandingSeen ? (p.grounded ? "landing" : "spike") : "gap";
    if (p.x < t.spike + 52) return "spike";
    if (p.x < t.fake + 52) return "hidden";
    return "clear";
  }
  function guidedTimingKey() {
    return state.chapter === 1 && state.room === 1 ? firstRoomTimingKey() : roomTwoTimingKey();
  }
  function currentBattleStatus() {
    const c = copy();
    if (state.statusKey === "gap") return c.gapDeath;
    if (state.statusKey === "hazard") return c.hazardDeath;
    const guidedRoom = state.chapter === 1 && state.room <= 3;
    if (state.statusKey === "pulse") return guidedRoom && state.timingCue && state.timingCue !== "approach" ? timingCueCopy[state.timingCue][currentLocale()] : c.pulseFeedback;
    if (guidedRoom && state.timingCue && state.timingCue !== "approach") return timingCueCopy[state.timingCue][currentLocale()];
    if (guidedRoom) return landingCueCopy[currentLocale()];
    return c.battleStatus;
  }
  function updateBattleText() {
    const c = copy();
    setText("room-label", `${chapterLabel(state.chapter)} · ${roomLabel(state.room)} · ${stageName(state.stage)} (${state.stage}/30)`);
    setText("death-label", deathLabel(state.deaths));
    setText("battle-status", currentBattleStatus());
  }
  function renderResult() {
    const c = copy();
    const stage = stageFor();
    setText("result-title", state.resultKind === "chapter" ? c.chapterClear : c.roomClear);
    setText("result-copy", format(c.resultCopy, { chapter: state.chapter, room: state.room, deaths: state.deaths }));
    setText("to-stages", c.chapters);
    setText("next", state.stage >= campaignStages.length ? c.replayChapter : stage.checkpoint ? c.nextChapter : nextStageCopy[currentLocale()]);
    setText("retry", retryStageCopy[currentLocale()]);
  }
  function applyCopy() {
    const c = copy();
    const loadingText = document.querySelector("#loadingPanel span"); if (loadingText) loadingText.textContent = c.loading;
    const stageTitle = document.querySelector(".stage-header h2"); if (stageTitle) stageTitle.textContent = c.stageTitle;
    const stageTabs = document.querySelector(".stage-tabs button"); if (stageTabs) stageTabs.textContent = c.stageSections;
    const stageNav = document.querySelector(".stage-tabs"); if (stageNav) stageNav.setAttribute("aria-label", c.stageSections);
    const mainReturn = document.querySelector(".main-return"); if (mainReturn) mainReturn.setAttribute("aria-label", c.backToWeight);
    const stageBack = document.querySelector(".stage-header .back"); if (stageBack) stageBack.setAttribute("aria-label", c.backMain);
    const battleBack = document.querySelector(".battle-header .back"); if (battleBack) battleBack.setAttribute("aria-label", c.backStages);
    const canvasElement = $("arena"); if (canvasElement) canvasElement.setAttribute("aria-label", c.canvasAria);
    const touchControls = document.querySelector(".touch-controls"); if (touchControls) touchControls.setAttribute("aria-label", c.touchControls);
    const jumpButton = document.querySelector('[data-key="Space"]'); if (jumpButton) { jumpButton.textContent = c.jump; jumpButton.setAttribute("aria-label", c.jump); }
    const pulseButton = document.querySelector('[data-key="Pulse"]'); if (pulseButton) { pulseButton.textContent = c.pulse; pulseButton.setAttribute("aria-label", c.pulse); }
    const headerPulse = $("battle-pulse"); if (headerPulse) { headerPulse.textContent = c.pulse; headerPulse.setAttribute("aria-label", c.pulse); }
    const leftButton = document.querySelector('[data-key="ArrowLeft"]'); if (leftButton) leftButton.setAttribute("aria-label", c.moveLeft);
    const rightButton = document.querySelector('[data-key="ArrowRight"]'); if (rightButton) rightButton.setAttribute("aria-label", c.moveRight);
    const touchHint = document.querySelector(".touch-hint"); if (touchHint) touchHint.textContent = stageTouchHintCopy[currentLocale()] || c.touchHint;
    const battleStatus = $("battle-status"); if (battleStatus) battleStatus.setAttribute("aria-live", "polite");
    updateMainProgress(); updateBattleText();
    if (state.screen === "stage") stageCards();
    renderResult();
  }

  function show(name) {
    state.screen = name;
    document.body.dataset.screen = name === "result" ? "battle" : name;
    const guide = document.querySelector(".game-page-info-static");
    if (guide) guide.hidden = name !== "main";
    cancelAnimationFrame(state.raf);
    const result = document.querySelector("#result-screen");
    document.querySelectorAll(".screen").forEach((el) => {
      const isResult = el === result && name === "result";
      const keepBattle = name === "result" && el.id === "battle-screen";
      const on = isResult || keepBattle || el.dataset.screen === name;
      el.hidden = !on;
      el.classList.toggle("active", on);
    });
    if (name === "battle") result?.setAttribute("hidden", "");
    if (name === "battle") { state.last = performance.now(); state.raf = requestAnimationFrame(frame); }
  }
  function syncStageCardVisibility() {
    const rail = $("stage-list");
    if (!rail || state.screen !== "stage") return;
    const railRect = rail.getBoundingClientRect();
    rail.querySelectorAll(".stage-card").forEach((card) => {
      const rect = card.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const insideRail = rect.width > 1 && rect.height > 1
        && center >= railRect.left - 1 && center <= railRect.right + 1
        && rect.bottom >= railRect.top - 1 && rect.top <= railRect.bottom + 1;
      card.classList.toggle("wp-stage-card-clipped", !insideRail);
    });
  }
  function stageCards() {
    const c = copy();
    const unlocked = maxUnlockedStage();
    $("stage-list").innerHTML = campaignStages.map((stage) => {
      const isLocked = stage.id > unlocked;
      const arcDescription = c.descriptions[(stage.arc - 1) % c.descriptions.length];
      const checkpoint = stage.checkpoint ? " · ★" : "";
      return `<button type="button" class="stage-card${isLocked ? " locked" : ""}" data-stage="${stage.id}" data-chapter="${stage.arc}" data-wp-stage-card="${stage.id}" data-wp-enter-battle aria-label="${stageName(stage.id)}: ${stageObjective(stage.id)}"${isLocked ? " disabled aria-disabled=\"true\"" : ""}><strong>${stage.id}. ${stageName(stage.id)}${checkpoint}</strong><small>${stageObjective(stage.id)}</small><em>${chapterLabel(stage.arc)} · ${arcDescription}</em></button>`;
    }).join("");
    $("stage-list").querySelectorAll("button:not([disabled])").forEach((b) => b.addEventListener("click", () => startStage(Number(b.dataset.stage))));
    syncStageCardVisibility();
    window.requestAnimationFrame(() => {
      syncStageCardVisibility();
      document.querySelector(`[data-stage="${Math.min(unlocked, campaignStages.length)}"]`)?.scrollIntoView({ behavior: "auto", block: "nearest", inline: "center" });
    });
  }
  function resetRoom() {
    state.player = { x: 76, y: 390, vy: 0, grounded: false };
    state.keys.clear(); state.tap = null;
    state.pulse = 0; state.jumpBuffer = 0; state.firstRoomJumpIntent = 0; state.firstRoomJumpQueued = false; state.firstRoomLandingSeen = false; state.roomTwoJumpIntent = 0; state.roomTwoJumpQueued = false; state.roomTwoLandingSeen = false; state.timingCue = guidedTimingKey();
    updateBattleText();
  }
  function startStage(stageId = 1) {
    const stage = stageFor(stageId);
    if (stage.id > maxUnlockedStage()) return;
    state.stage = stage.id; state.chapter = stage.arc; state.room = stage.room; state.statusKey = ""; resetRoom(); show("battle");
  }
  function trapData() {
    const stage = stageFor();
    return { ...stage, index: stage.id - 1 };
  }
  function solidAt(x) {
    const t = trapData();
    const drift = t.moving ? Math.sin(performance.now() / 240) * 10 : 0;
    const gapOpen = (x > t.gap + drift && x < t.gap + 66 + drift) || (t.secondGap && x > t.gap2 && x < t.gap2 + 66);
    return !gapOpen && x < 900;
  }
  function hazardAt(x, y) {
    const t = trapData();
    const spikeShift = t.moving ? Math.sin(performance.now() / 230) * 26 : 0;
    const spike = x > t.spike - 20 + spikeShift && x < t.spike + 38 + spikeShift;
    const secondSpike = t.secondGap && x > t.gap2 - 52 && x < t.gap2 - 12;
    const fake = x > t.fake - 18 && x < t.fake + 34 && y > 360;
    const ceiling = t.ceiling && y < 210 && x > 610 && x < 760;
    return spike || secondSpike || fake || ceiling;
  }
  function die(reason) { state.deaths += 1; state.statusKey = reason === "gap" ? "gap" : "hazard"; resetRoom(); }
  function pulse() { if (state.screen !== "battle") return; state.pulse = 60; state.statusKey = "pulse"; updateBattleText(); }
  function armFirstRoomJumpIntent() {
    if (state.chapter !== 1 || state.room !== 1 || !state.player) return;
    const t = trapData();
    if (state.player.x >= t.gap - 54 && state.player.x < t.fake + 34) { state.firstRoomJumpIntent = 360; state.firstRoomJumpQueued = true; }
  }
  function armRoomTwoJumpIntent() {
    if (state.chapter !== 1 || state.room < 2 || state.room > 3 || !state.player) return;
    const t = trapData();
    if (state.player.x >= t.gap - 54 && state.player.x < t.fake + 34) state.roomTwoJumpIntent = 360;
  }
  function finish() {
    state.bestRoom = Math.max(state.bestRoom, state.stage);
    localStorage.setItem("wp-trail-best-room", String(state.bestRoom));
    localStorage.setItem("wp-trail-best-stage", String(state.bestRoom));
    state.resultKind = stageFor().checkpoint || state.stage === campaignStages.length ? "chapter" : "room";
    renderResult();
    show("result");
  }
  function update(dt) {
    const p = state.player; const t = trapData(); const reversed = t.reverse;
    const right = reversed ? (state.keys.has("ArrowLeft") || state.keys.has("KeyA")) : (state.keys.has("ArrowRight") || state.keys.has("KeyD"));
    const left = reversed ? (state.keys.has("ArrowRight") || state.keys.has("KeyD")) : (state.keys.has("ArrowLeft") || state.keys.has("KeyA"));
    const jumpHeld = state.keys.has("Space") || state.keys.has("ArrowUp") || state.keys.has("KeyW");
    const inputStarted = Boolean(state.tap || right || left || jumpHeld);
    const firstRoom = state.chapter === 1 && state.room === 1;
    const roomTwo = state.chapter === 1 && state.room >= 2 && state.room <= 3;
    const guidedRoom = firstRoom || roomTwo;
    const jumpTap = state.tap === "Space" || state.tap === "ArrowUp" || state.tap === "KeyW";
    const jumpRequested = jumpHeld || jumpTap;
    if (firstRoom && jumpRequested) armFirstRoomJumpIntent();
    if (roomTwo && jumpRequested) armRoomTwoJumpIntent();
    if (inputStarted && state.statusKey) state.statusKey = "";
    if (state.tap) {
      if (state.tap === "Space" || state.tap === "ArrowUp" || state.tap === "KeyW") {
        state.jumpBuffer = guidedRoom ? 30 : 12;
      } else {
        const tapRight = state.tap === "ArrowRight" || state.tap === "KeyD";
        if (reversed ? !tapRight : tapRight) p.x += 24; else p.x -= 24;
      }
      state.tap = null;
    }
    if (right) p.x += 3.2 * dt; if (left) p.x -= 3.2 * dt;
    if (t.wind) p.x += Math.sin(performance.now() / 320) * 0.55 * dt;
    if (jumpHeld) state.jumpBuffer = guidedRoom ? 30 : 12;
    if (state.jumpBuffer > 0) state.jumpBuffer = Math.max(0, state.jumpBuffer - dt);
    if (state.firstRoomJumpIntent > 0) state.firstRoomJumpIntent = Math.max(0, state.firstRoomJumpIntent - dt);
    if (state.roomTwoJumpIntent > 0) state.roomTwoJumpIntent = Math.max(0, state.roomTwoJumpIntent - dt);
    p.vy += .46 * dt; p.y += p.vy * dt; p.x = Math.max(30, Math.min(920, p.x));
    const floor = solidAt(p.x) ? 418 : 540;
    if (p.y >= floor - 28) { p.y = floor - 28; p.vy = 0; p.grounded = true; } else p.grounded = false;
    if (state.chapter === 1 && state.room === 1 && p.grounded && p.x >= t.gap + 70 && p.x < t.spike - 42) { state.firstRoomLandingSeen = true; state.firstRoomJumpQueued = true; }
    if (roomTwo && p.grounded && p.x >= t.gap + 70 && p.x < t.spike - 42) { state.roomTwoLandingSeen = true; state.roomTwoJumpQueued = true; }
    if (roomTwo && p.grounded && p.x >= t.spike + 52 && p.x < t.fake + 34) state.roomTwoJumpQueued = true;
    const firstRoomAssistReady = firstRoom && p.grounded && (state.firstRoomJumpIntent > 0 || state.firstRoomJumpQueued || state.firstRoomLandingSeen) && p.x >= t.gap + 64 && p.x < t.fake + 34;
    const roomTwoAssistReady = roomTwo && p.grounded && (state.roomTwoJumpIntent > 0 || state.roomTwoJumpQueued || state.roomTwoLandingSeen) && p.x >= t.gap + 64 && p.x < t.fake + 34;
    if ((state.jumpBuffer > 0 || firstRoomAssistReady || roomTwoAssistReady) && p.grounded) {
      p.vy = guidedRoom ? -11.5 : -10.5;
      p.grounded = false;
      state.jumpBuffer = 0;
      if (firstRoomAssistReady && p.x >= t.fake - 42) { state.firstRoomJumpIntent = 0; state.firstRoomJumpQueued = false; }
      if (roomTwoAssistReady && p.x >= t.fake - 42) { state.roomTwoJumpIntent = 0; state.roomTwoJumpQueued = false; }
    }
    if (p.y > 560) return die("gap");
    if (hazardAt(p.x, p.y) && (p.grounded || (t.ceiling && p.y < 210))) return die("hazard");
    if (p.x > 870 && p.grounded) finish();
    if (state.pulse > 0) state.pulse -= dt;
    const timingCue = guidedTimingKey();
    if (timingCue !== state.timingCue) { state.timingCue = timingCue; updateBattleText(); }
  }
  function draw() {
    const t = trapData(); ctx.clearRect(0,0,960,540); const g = ctx.createLinearGradient(0,0,0,540); g.addColorStop(0,"#101933"); g.addColorStop(1,"#070b16"); ctx.fillStyle = g; ctx.fillRect(0,0,960,540);
    if (t.dark) { ctx.fillStyle = "#050810aa"; ctx.fillRect(0,0,960,540); }
    const gapShift = t.moving ? Math.sin(performance.now() / 240) * 10 : 0; const gapX = t.gap + gapShift;
    ctx.fillStyle="#172b43"; ctx.fillRect(0,418,960,122); ctx.fillStyle="#263f5c"; ctx.fillRect(gapX,418,74,122); ctx.fillStyle="#0a0e1a"; ctx.fillRect(gapX,418,74,8); if(propArt.complete&&propArt.naturalWidth)ctx.drawImage(propArt,930,70,420,560,gapX-8,410,90,118);
    if (t.secondGap) { ctx.fillStyle="#263f5c"; ctx.fillRect(t.gap2,418,74,122); ctx.fillStyle="#0a0e1a"; ctx.fillRect(t.gap2,418,74,8); }
    const spikeShift = t.moving ? Math.sin(performance.now() / 230) * 26 : 0; ctx.fillStyle="#e26b75"; for(let x=t.spike+spikeShift;x<t.spike+42+spikeShift;x+=14){ctx.beginPath();ctx.moveTo(x,418);ctx.lineTo(x+7,392);ctx.lineTo(x+14,418);ctx.fill();} if(propArt.complete&&propArt.naturalWidth)ctx.drawImage(propArt,540,80,400,560,t.spike-18+spikeShift,370,74,84);
    if (t.secondGap) { ctx.fillStyle="#e26b75"; for(let x=t.gap2-52;x<t.gap2-12;x+=14){ctx.beginPath();ctx.moveTo(x,418);ctx.lineTo(x+7,392);ctx.lineTo(x+14,418);ctx.fill();} }
    ctx.fillStyle="#72597d";ctx.fillRect(t.fake,406,38,12); if (t.ceiling) { ctx.fillStyle="#d67b8f"; ctx.fillRect(610,180,150,16); }
    if (t.wind) { ctx.strokeStyle="#8ac7e866"; ctx.lineWidth=3; for (let x = 90; x < 880; x += 150) { const y = 150 + ((x / 10 + performance.now() / 14) % 120); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 62, y - 12); ctx.stroke(); } }
    ctx.fillStyle="#ffd36b";ctx.fillRect(875,345,12,73);ctx.beginPath();ctx.arc(881,336,25,0,Math.PI*2);ctx.fill();ctx.fillStyle="#fff1a1";ctx.beginPath();ctx.arc(881,336,9,0,Math.PI*2);ctx.fill(); if(propArt.complete&&propArt.naturalWidth)ctx.drawImage(propArt,20,20,500,650,830,300,105,136);
    if (state.chapter === 1 && state.room <= 3) {
      const landingStart = t.gap + 78;
      const landingWidth = Math.max(48, Math.min(96, t.spike - 34 - landingStart));
      const landingEnd = landingStart + landingWidth;
      ctx.save();
      ctx.fillStyle = state.timingCue === "landing" || state.pulse > 0 ? "#a4ead566" : "#a4ead533";
      ctx.fillRect(landingStart, 394, landingWidth, 42);
      ctx.strokeStyle = state.timingCue === "landing" || state.pulse > 0 ? "#a4ead5" : "#83cdb8";
      ctx.lineWidth = state.timingCue === "landing" || state.pulse > 0 ? 4 : 2;
      ctx.setLineDash(state.pulse > 0 ? [10, 7] : [6, 8]);
      ctx.strokeRect(landingStart, 394, landingWidth, 42);
      ctx.setLineDash([]);
      ctx.fillStyle = "#dfffee";
      ctx.font = "bold 13px system-ui";
      ctx.fillText(landingWindowCopy[currentLocale()], landingStart + 4, 389);
      ctx.strokeStyle = "#ffd36b";
      ctx.lineWidth = state.timingCue === "spike" ? 5 : 2;
      ctx.beginPath(); ctx.moveTo(landingEnd + 8, 430); ctx.lineTo(t.spike - 30, 430); ctx.lineTo(t.spike - 42, 423); ctx.moveTo(t.spike - 30, 430); ctx.lineTo(t.spike - 42, 437); ctx.stroke();
      ctx.fillStyle = state.timingCue === "spike" ? "#fff1a1" : "#ffe4a3";
      ctx.font = "bold 15px system-ui";
      ctx.fillText(copy().jump, t.spike - 18, 365);
      if (state.timingCue === "hidden") {
        ctx.strokeStyle = "#ffcf73";
        ctx.lineWidth = 4;
        ctx.strokeRect(t.fake - 36, 382, 82, 54);
        ctx.fillStyle = "#fff1a1";
        ctx.fillText(copy().jump, t.fake - 18, 365);
      }
      ctx.restore();
    }
    if (state.pulse > 0) {
      ctx.strokeStyle="#fff1a1"; ctx.lineWidth=6; ctx.strokeRect(t.gap-10,394,94,42); ctx.strokeRect(t.spike-28,382,92,44);
      if (propArt.complete&&propArt.naturalWidth)ctx.drawImage(propArt,1360,60,430,600,t.gap-22,350,124,124);
    }
    const p=state.player;
    if (heroArt.complete && heroArt.naturalWidth) {
      ctx.save(); ctx.translate(p.x, p.y - 42); ctx.rotate(Math.max(-0.12, Math.min(0.12, p.vy * 0.012)));
      ctx.drawImage(heroArt, 10, 12, 485, 705, -42, -62, 84, 122); ctx.restore();
    } else {
      ctx.save();ctx.translate(p.x,p.y);ctx.fillStyle="#a4ead5";ctx.beginPath();ctx.arc(0,0,22,0,Math.PI*2);ctx.fill();ctx.fillStyle="#162841";ctx.fillRect(-13,-5,26,7);ctx.fillStyle="#ffd36b";ctx.fillRect(-11,7,22,6);ctx.restore();
    }
    const c = copy(); ctx.fillStyle="#cbd8e8";ctx.font="bold 18px system-ui";ctx.fillText(c.readPath,24,34);ctx.font="15px system-ui";ctx.fillText(`${stageName(state.stage)} · ${state.stage}/30`,24,60);
  }
  function frame(now) { if (state.screen !== "battle") return; const dt = Math.min((now - state.last) / 16.67, 2); state.last = now; update(dt); if (state.screen === "battle") { draw(); state.raf = requestAnimationFrame(frame); } }
  function pressKey(key, active) {
    if (active) {
      state.keys.add(key);
      if (key === "Space" || key === "ArrowUp" || key === "KeyW") { armFirstRoomJumpIntent(); armRoomTwoJumpIntent(); }
    } else state.keys.delete(key);
  }
  window.addEventListener("keydown", (e) => { const key = e.code === "Space" ? "Space" : e.code; if (["ArrowLeft","ArrowRight","ArrowUp","Space","KeyA","KeyD","KeyW","KeyE"].includes(key)) { e.preventDefault(); if (key === "KeyE") pulse(); else pressKey(key,true); } });
  window.addEventListener("keyup", (e) => pressKey(e.code === "Space" ? "Space" : e.code,false));
  document.querySelectorAll("[data-key]").forEach((button) => { const key = button.dataset.key; if (key === "Pulse") { button.addEventListener("pointerdown", (e) => { e.preventDefault(); pulse(); }); return; } const start = (e) => { e.preventDefault(); if (e.pointerId !== undefined && button.setPointerCapture) { try { button.setPointerCapture(e.pointerId); } catch (_) {} } pressKey(key,true); }; const stop = () => pressKey(key,false); button.addEventListener("pointerdown", start); button.addEventListener("touchstart", start, { passive: false }); ["pointerup","pointercancel","pointerleave","lostpointercapture","touchend","touchcancel"].forEach((event) => button.addEventListener(event, stop)); button.addEventListener("click", () => { state.tap = key; }); });
  $("battle-pulse")?.addEventListener("click", pulse);
  $("stage-list").addEventListener("scroll", syncStageCardVisibility, { passive: true });
  $("start-game").addEventListener("click", () => { show("stage"); stageCards(); }); document.querySelectorAll("[data-back]").forEach((b) => b.addEventListener("click", () => show(b.dataset.back))); $("retry").addEventListener("click", () => { state.statusKey = ""; resetRoom(); show("battle"); }); $("next").addEventListener("click", () => startStage(state.stage >= campaignStages.length ? campaignStages.length : state.stage + 1)); $("to-stages").addEventListener("click", () => { show("stage"); stageCards(); }); document.querySelectorAll("#localeSelect").forEach((select) => select.addEventListener("change", () => window.setTimeout(applyCopy, 0))); stageCards(); resetRoom(); applyCopy(); show("main");
})();
