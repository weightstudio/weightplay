/* Icefield rescue: deterministic grid simulation with authored realtime voxel assets. */
(() => {
  /* WP-GAME-ANALYTICS-ADAPTER */
  // Only replayable lifecycle signals live here; all metrics/timers/GA4 stay shared.
  const __wpMeasurement = { screen: null, roundKey: null, started: false, ended: false, restart: false, outcome: "complete" };
  const __wpReadMeasurement = () => ({ ...__wpMeasurement,
    keyboardKeys: ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "W", "a", "A", "s", "S", "d", "D", " ", "f", "F"],
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

  const $ = (id) => document.getElementById(id);
  const loadingPanel = $("loadingPanel");
  if (loadingPanel) {
    const hideLoading = () => { loadingPanel.hidden = true; loadingPanel.classList.add("hidden"); };
    if (document.readyState === "complete") hideLoading();
    else window.addEventListener("load", hideLoading, { once: true });
  }
  const canvas = $("arena");
  const activeFlights=new Set();
  let frostScene=null;
  $("start-game").disabled=true;
  canvas.tabIndex=0;
  const cols = 12, rows = 7, cell = 72;

  const ROOMS_PER_CHAPTER = 5;
  const TOTAL_STAGES = 30;
  const CHAPTER_COUNT = Math.ceil(TOTAL_STAGES / ROOMS_PER_CHAPTER);
  const mastery = window.FrostMastery;
  let bestGrades = {};
  try { bestGrades = mastery.normalize(JSON.parse(localStorage.getItem("wp-frost-mastery") || "{}")); } catch {}
  let savedBest = 0;
  try { const n=Number(localStorage.getItem("wp-frost-best")); if(Number.isInteger(n)&&n>=0&&n<=TOTAL_STAGES)savedBest=n; } catch {}
  const state = { screen: "main", chapter: 1, room: 1, best: savedBest, player: null, enemy: null, walls: new Set(), fruits: new Set(), facing: { x: 1, y: 0 }, moves: 0, edits: 0, ticks: 0, raf: 0 };
  const notifyAnalytics = (name, details = {}) => window.__wpFrostAnalytics?.record?.(name, details);
  const key = (x,y) => `${x},${y}`;
  const text = (value) => value === "BREAK THE ICE" ? (FROST_COPY[frostLocale()]?.canvas || value) : window.wpFiveText ? window.wpFiveText(value) : value;
  const FROST_COPY = {
    en: { breakButton: "BREAK ICE", hint: "The blue blocks are breakable. Collect all berries before the drifter reaches you.", controls: "Arrows move. SPACE breaks ice; F builds a short wall.", wallAhead: "Ice wall ahead. Break it, then move through.", cracked: "Ice cracked open — route changed.", noBreak: "Nothing breakable in that direction.", built: "A new ice wall changed the drifter's route.", noBuild: "That space cannot hold a new ice wall.", canvas: "BREAK THE ICE" },
    "zh-tw": { breakButton: "破壞冰塊", hint: "藍色冰塊可以破壞。漂行者追上你前，收集所有莓果。", controls: "方向鍵移動。SPACE 破壞冰塊；F 建造短冰牆。", wallAhead: "前方有冰牆。破壞它再通過。", cracked: "冰層裂開了——路線改變。", noBreak: "那個方向沒有可破壞的冰塊。", built: "新的冰牆改變了漂行者的路線。", noBuild: "那個位置無法建造新的冰牆。", canvas: "破壞冰牆" },
    "zh-cn": { breakButton: "破坏冰块", hint: "蓝色冰块可以破坏。在漂行者追上你前收集所有莓果。", controls: "方向键移动。SPACE 破坏冰块；F 建造短冰墙。", wallAhead: "前方有冰墙。破坏它再通过。", cracked: "冰层裂开了——路线改变。", noBreak: "那个方向没有可破坏的冰块。", built: "新的冰墙改变了漂行者的路线。", noBuild: "那个位置无法建造新的冰墙。", canvas: "破坏冰墙" },
    ja: { breakButton: "氷を壊す", hint: "青いブロックは壊せます。漂流者が追いつく前に、すべてのベリーを集めましょう。", controls: "矢印キーで移動。SPACEで氷を壊し、Fで短い氷壁を作ります。", wallAhead: "前方に氷があります。壊して先へ進みましょう。", cracked: "氷が割れました——ルートが変わりました。", noBreak: "その方向に壊せる氷はありません。", built: "新しい氷壁で漂流者の道が変わりました。", noBuild: "その場所には新しい氷壁を作れません。", canvas: "氷を壊す" },
    ko: { breakButton: "얼음 깨기", hint: "파란 블록은 부술 수 있습니다. 방랑자가 따라오기 전에 모든 베리를 모으세요.", controls: "화살표로 이동하고 SPACE로 얼음을 부수며 F로 짧은 얼음벽을 만듭니다.", wallAhead: "앞에 얼음벽이 있습니다. 부수고 지나가세요.", cracked: "얼음이 갈라졌습니다 — 경로가 바뀌었습니다.", noBreak: "그 방향에는 부술 수 있는 얼음이 없습니다.", built: "새 얼음벽이 방랑자의 경로를 바꿨습니다.", noBuild: "그 공간에는 새 얼음벽을 만들 수 없습니다.", canvas: "얼음 깨기" },
    es: { breakButton: "ROMPER HIELO", hint: "Los bloques azules se pueden romper. Recoge todas las bayas antes de que te alcance el errante.", controls: "Muévete con las flechas; SPACE rompe el hielo y F construye un muro corto.", wallAhead: "Hay un muro de hielo delante. Rómpelo y sigue avanzando.", cracked: "El hielo se abrió: la ruta ha cambiado.", noBreak: "No hay nada rompible en esa dirección.", built: "Un muro de hielo nuevo cambió la ruta del errante.", noBuild: "Ese espacio no puede contener un muro de hielo nuevo.", canvas: "ROMPE EL HIELO" },
    "pt-br": { breakButton: "QUEBRAR GELO", hint: "Os blocos azuis podem ser quebrados. Colete todas as frutas antes que o errante alcance você.", controls: "Mova-se com as setas; SPACE quebra o gelo e F constrói uma parede curta.", wallAhead: "Há uma parede de gelo à frente. Quebre-a e avance.", cracked: "O gelo se abriu — a rota mudou.", noBreak: "Não há nada quebrável nessa direção.", built: "Uma nova parede de gelo mudou a rota do andarilho.", noBuild: "Esse espaço não pode receber uma nova parede de gelo.", canvas: "QUEBRE O GELO" },
    fr: { breakButton: "BRISER LA GLACE", hint: "Les blocs bleus peuvent être brisés. Ramassez toutes les baies avant que le rôdeur ne vous rattrape.", controls: "Déplacez-vous avec les flèches ; ESPACE brise la glace et F construit un petit mur.", wallAhead: "Un mur de glace bloque le chemin. Brisez-le, puis avancez.", cracked: "La glace s'est ouverte — le chemin a changé.", noBreak: "Rien à briser dans cette direction.", built: "Un nouveau mur de glace a changé la route du rôdeur.", noBuild: "Cet espace ne peut pas accueillir un nouveau mur de glace.", canvas: "BRISE LA GLACE" },
    de: { breakButton: "EIS BRECHEN", hint: "Die blauen Blöcke sind zerbrechlich. Sammle alle Beeren, bevor der Wanderer dich erreicht.", controls: "Bewege dich mit den Pfeilen; LEERTASTE bricht Eis und F baut eine kurze Wand.", wallAhead: "Vor dir ist eine Eiswand. Brich sie durch und geh weiter.", cracked: "Das Eis ist aufgebrochen – der Weg hat sich geändert.", noBreak: "In dieser Richtung gibt es nichts Zerbrechliches.", built: "Eine neue Eiswand hat den Weg des Wanderers geändert.", noBuild: "Dort kann keine neue Eiswand gebaut werden.", canvas: "EIS BRECHEN" },
    it: { breakButton: "ROMPI GHIACCIO", hint: "I blocchi blu si possono rompere. Raccogli tutte le bacche prima che il vagabondo ti raggiunga.", controls: "Muoviti con le frecce; SPAZIO rompe il ghiaccio e F costruisce un breve muro.", wallAhead: "C'è una parete di ghiaccio davanti. Rompila e prosegui.", cracked: "Il ghiaccio si è aperto: il percorso è cambiato.", noBreak: "Non c'è nulla da rompere in quella direzione.", built: "Un nuovo muro di ghiaccio ha cambiato il percorso del vagabondo.", noBuild: "Quello spazio non può ospitare una nuova parete di ghiaccio.", canvas: "ROMPI IL GHIACCIO" },
    ru: { breakButton: "ЛОМАТЬ ЛЁД", hint: "Синие блоки можно ломать. Соберите все ягоды, пока странник вас не догнал.", controls: "Двигайтесь стрелками; ПРОБЕЛ ломает лёд, а F строит короткую ледяную стену.", wallAhead: "Впереди ледяная стена. Сломайте её и идите дальше.", cracked: "Лёд треснул — путь изменился.", noBreak: "В этом направлении нечего ломать.", built: "Новая ледяная стена изменила путь странника.", noBuild: "В этом месте нельзя построить новую ледяную стену.", canvas: "ЛОМАЙТЕ ЛЁД" },
    hi: { breakButton: "बर्फ तोड़ें", hint: "नीले ब्लॉक तोड़े जा सकते हैं। भटकने वाला आप तक पहुँचे, उससे पहले सभी बेरियाँ इकट्ठी करें।", controls: "तीरों से चलें; SPACE से बर्फ तोड़ें और F से छोटी दीवार बनाएँ।", wallAhead: "आगे बर्फ की दीवार है। उसे तोड़कर आगे बढ़ें।", cracked: "बर्फ टूट गई — रास्ता बदल गया।", noBreak: "उस दिशा में तोड़ने योग्य कुछ नहीं है।", built: "नई बर्फ की दीवार ने भटकने वाले का रास्ता बदल दिया।", noBuild: "उस जगह नई बर्फ की दीवार नहीं बनाई जा सकती।", canvas: "बर्फ तोड़ें" },
    ar: { breakButton: "كسر الجليد", hint: "يمكن كسر الكتل الزرقاء. اجمع كل التوت قبل أن يلحق بك المتجول.", controls: "تحرك بالأسهم؛ تكسر SPACE الجليد ويبني F جداراً قصيراً.", wallAhead: "يوجد جدار جليدي أمامك. اكسره ثم واصل التقدم.", cracked: "تشقق الجليد — تغيّر المسار.", noBreak: "لا يوجد شيء قابل للكسر في ذلك الاتجاه.", built: "غيّر جدار جليدي جديد مسار المتجول.", noBuild: "لا يمكن بناء جدار جليدي جديد في هذا المكان.", canvas: "اكسر الجليد" },
  };
  const FROST_BUILD_COPY = {
    en: "BUILD ICE", "zh-tw": "建造冰牆", "zh-cn": "建造冰墙", ja: "氷を作る", ko: "얼음벽 만들기",
    es: "CONSTRUIR HIELO", "pt-br": "CONSTRUIR GELO", fr: "CONSTRUIRE DE LA GLACE", de: "EIS BAUEN",
    it: "COSTRUISCI GHIACCIO", ru: "СТРОИТЬ ЛЁД", hi: "बर्फ बनाएँ", ar: "بناء الجليد",
  };
  const frostBuildText = () => FROST_BUILD_COPY[frostLocale()] || FROST_BUILD_COPY.en;
  const FROST_BATTLE_BACK_COPY = {
    en: "Back to Stages", "zh-tw": "返回章節", "zh-cn": "返回章节", ja: "ステージに戻る", ko: "스테이지로 돌아가기",
    es: "Volver a las fases", "pt-br": "Voltar às fases", fr: "Retour aux niveaux", de: "Zurück zu den Stufen",
    it: "Torna ai livelli", ru: "Вернуться к главам", hi: "अध्यायों पर वापस जाएँ", ar: "العودة إلى الفصول",
  };
  const frostBattleBackText = () => FROST_BATTLE_BACK_COPY[frostLocale()] || FROST_BATTLE_BACK_COPY.en;
  const FROST_RETURN_COPY = {
    en: { main: "Back to WeightPlay", stage: "Back to Main", battle: "Back to Stages" },
    "zh-tw": { main: "返回 WeightPlay", stage: "返回主頁", battle: "返回章節" },
    "zh-cn": { main: "返回 WeightPlay", stage: "返回主页", battle: "返回章节" },
    ja: { main: "WeightPlayに戻る", stage: "メインに戻る", battle: "ステージに戻る" },
    ko: { main: "WeightPlay로 돌아가기", stage: "메인으로 돌아가기", battle: "스테이지로 돌아가기" },
    es: { main: "Volver a WeightPlay", stage: "Volver al inicio", battle: "Volver a las fases" },
    "pt-br": { main: "Voltar ao WeightPlay", stage: "Voltar ao início", battle: "Voltar às fases" },
    fr: { main: "Retour à WeightPlay", stage: "Retour à l'accueil", battle: "Retour aux niveaux" },
    de: { main: "Zurück zu WeightPlay", stage: "Zurück zum Start", battle: "Zurück zu den Stufen" },
    it: { main: "Torna a WeightPlay", stage: "Torna alla home", battle: "Torna ai livelli" },
    ru: { main: "Вернуться в WeightPlay", stage: "Вернуться на главную", battle: "Вернуться к главам" },
    hi: { main: "WeightPlay पर वापस जाएँ", stage: "मुख्य पर वापस जाएँ", battle: "अध्यायों पर वापस जाएँ" },
    ar: { main: "العودة إلى WeightPlay", stage: "العودة إلى الرئيسية", battle: "العودة إلى الفصول" },
  };
  const frostReturnText = (destination) => FROST_RETURN_COPY[frostLocale()]?.[destination] || FROST_RETURN_COPY.en[destination];
  const FROST_STAGE_COPY = {
    en: { heading: "Ice Chapters", tab: "Stages", chapter: "Chapter", chapters: ["first thaw", "split routes", "drifter pressure", "final melt"] },
    "zh-tw": { heading: "冰原章節", tab: "章節", chapter: "第", chapterSuffix: "章", chapters: ["初次解凍", "分岔路線", "漂行者壓力", "最後融冰"] },
    "zh-cn": { heading: "冰原章节", tab: "章节", chapter: "第", chapterSuffix: "章", chapters: ["初次解冻", "分岔路线", "漂行者压力", "最终融冰"] },
    ja: { heading: "氷原チャプター", tab: "ステージ", chapter: "チャプター", chapters: ["最初の雪解け", "分岐ルート", "漂流者の追跡", "最後の雪解け"] },
    ko: { heading: "빙설 챕터", tab: "스테이지", chapter: "챕터", chapters: ["첫 해빙", "갈림길", "방랑자의 압박", "마지막 해빙"] },
    es: { heading: "Capítulos de hielo", tab: "Capítulos", chapter: "Capítulo", chapters: ["primer deshielo", "rutas divididas", "presión del errante", "deshielo final"] },
    "pt-br": { heading: "Capítulos de gelo", tab: "Capítulos", chapter: "Capítulo", chapters: ["primeiro degelo", "rotas divididas", "pressão do errante", "degelo final"] },
    fr: { heading: "Chapitres de glace", tab: "Chapitres", chapter: "Chapitre", chapters: ["premier dégel", "routes séparées", "pression du rôdeur", "dégel final"] },
    de: { heading: "Eiskapitel", tab: "Kapitel", chapter: "Kapitel", chapters: ["erstes Tauwetter", "geteilte Wege", "Druck des Wanderers", "letztes Tauwetter"] },
    it: { heading: "Capitoli di ghiaccio", tab: "Capitoli", chapter: "Capitolo", chapters: ["primo disgelo", "percorsi divisi", "pressione del vagabondo", "disgelo finale"] },
    ru: { heading: "Ледяные главы", tab: "Главы", chapter: "Глава", chapters: ["первое таяние", "разветвлённые пути", "натиск странника", "последнее таяние"] },
    hi: { heading: "बर्फीले अध्याय", tab: "अध्याय", chapter: "अध्याय", chapters: ["पहली बर्फ़ पिघलना", "बँटे हुए रास्ते", "भटकने वाले का दबाव", "अंतिम बर्फ़ पिघलना"] },
    ar: { heading: "فصول الجليد", tab: "الفصول", chapter: "الفصل", chapters: ["الذوبان الأول", "مسارات متفرعة", "ضغط المتجول", "الذوبان الأخير"] },
  };
  const FROST_STAGE_LABEL = {
    en: "Stage", "zh-tw": "關卡", "zh-cn": "关卡", ja: "ステージ", ko: "스테이지",
    es: "Fase", "pt-br": "Fase", fr: "Niveau", de: "Stufe", it: "Fase", ru: "Этап", hi: "चरण", ar: "المرحلة",
  };
  const FROST_ROOM_LABEL = {
    en: "Room", "zh-tw": "房間", "zh-cn": "房间", ja: "ルーム", ko: "방",
    es: "Sala", "pt-br": "Sala", fr: "Salle", de: "Raum", it: "Stanza", ru: "Комната", hi: "कमरा", ar: "الغرفة",
  };
  const frostLocale = () => {
    const segment = String(location.pathname).split("/").filter(Boolean)[0]?.toLowerCase() || "en";
    const language = String(document.documentElement.lang || "").toLowerCase();
    const normalized = language === "zh-hant" ? "zh-tw" : language === "zh-hans" ? "zh-cn" : language;
    return FROST_COPY[normalized] ? normalized : (FROST_COPY[segment] ? segment : "en");
  };
  const FROST_FEEDBACK_COPY = {
    en: { berry: "Berry secured — route opens.", berryClear: "Last berry secured — rescue route clear!" },
    "zh-tw": { berry: "莓果已收好——路線打開了。", berryClear: "最後一顆莓果已收好——救援路線暢通！" },
    "zh-cn": { berry: "浆果已收好——路线打开了。", berryClear: "最后一颗浆果已收好——救援路线畅通！" },
    ja: { berry: "ベリーを確保しました——ルートが開きました。", berryClear: "最後のベリーを確保——救援ルートが開通！" },
    ko: { berry: "베리를 확보했습니다 — 경로가 열렸습니다.", berryClear: "마지막 베리를 확보했습니다 — 구조 경로가 열렸습니다!" },
    es: { berry: "Baya asegurada: la ruta se abre.", berryClear: "Última baya asegurada: ¡ruta de rescate libre!" },
    "pt-br": { berry: "Fruta protegida — a rota se abriu.", berryClear: "Última fruta protegida — rota de resgate livre!" },
    fr: { berry: "Baie sécurisée — la route s'ouvre.", berryClear: "Dernière baie sécurisée — route de secours ouverte !" },
    de: { berry: "Beere gesichert – der Weg öffnet sich.", berryClear: "Letzte Beere gesichert – Rettungsweg frei!" },
    it: { berry: "Bacca raccolta: il percorso si apre.", berryClear: "Ultima bacca raccolta: percorso di soccorso libero!" },
    ru: { berry: "Ягода собрана — путь открыт.", berryClear: "Последняя ягода собрана — путь к спасению открыт!" },
    hi: { berry: "बेरी सुरक्षित — रास्ता खुल रहा है।", berryClear: "आखिरी बेरी सुरक्षित — बचाव का रास्ता खुल गया!" },
    ar: { berry: "تم تأمين التوتة — انفتح المسار.", berryClear: "تم تأمين آخر توتة — أصبح طريق الإنقاذ مفتوحًا!" },
  };
  const FROST_RESULT_COPY = {
    en: { winTitle: "Room clear", loseTitle: "Route blocked", winCopy: (c,r) => `All berries recovered in chapter ${c}, room ${r}.`, loseCopy: "The ice route needs another attempt.", stages: "Chapters", next: "Next Room", retry: "Retry Room", replay: "Replay Chapter" },
    "zh-tw": { winTitle: "房間完成", loseTitle: "路線受阻", winCopy: (c,r) => `已收集第${c}章第${r}間的所有莓果。`, loseCopy: "冰道路線需要再試一次。", stages: "章節", next: "下一間", retry: "重試房間", replay: "重玩章節" },
    "zh-cn": { winTitle: "房间完成", loseTitle: "路线受阻", winCopy: (c,r) => `已收集第${c}章第${r}间的所有浆果。`, loseCopy: "冰道路线需要再试一次。", stages: "章节", next: "下一间", retry: "重试房间", replay: "重玩章节" },
    ja: { winTitle: "ルームクリア", loseTitle: "ルート封鎖", winCopy: (c,r) => `チャプター${c}・ルーム${r}のベリーをすべて回収しました。`, loseCopy: "氷のルートをもう一度試しましょう。", stages: "ステージ", next: "次のルーム", retry: "ルームを再挑戦", replay: "チャプターをリプレイ" },
    ko: { winTitle: "방 클리어", loseTitle: "경로 차단", winCopy: (c,r) => `챕터 ${c} 방 ${r}의 베리를 모두 회수했습니다.`, loseCopy: "얼음 경로를 다시 시도해 보세요.", stages: "스테이지", next: "다음 방", retry: "방 다시 시도", replay: "챕터 리플레이" },
    es: { winTitle: "Sala despejada", loseTitle: "Ruta bloqueada", winCopy: (c,r) => `Has recuperado todas las bayas del capítulo ${c}, sala ${r}.`, loseCopy: "La ruta de hielo necesita otro intento.", stages: "Capítulos", next: "Siguiente sala", retry: "Reintentar sala", replay: "Repetir capítulo" },
    "pt-br": { winTitle: "Sala concluída", loseTitle: "Rota bloqueada", winCopy: (c,r) => `Todas as frutas foram recuperadas no capítulo ${c}, sala ${r}.`, loseCopy: "A rota de gelo precisa de outra tentativa.", stages: "Capítulos", next: "Próxima sala", retry: "Tentar sala novamente", replay: "Rejogar capítulo" },
    fr: { winTitle: "Salle réussie", loseTitle: "Route bloquée", winCopy: (c,r) => `Toutes les baies ont été récupérées au chapitre ${c}, salle ${r}.`, loseCopy: "La route de glace demande une nouvelle tentative.", stages: "Chapitres", next: "Salle suivante", retry: "Réessayer la salle", replay: "Rejouer le chapitre" },
    de: { winTitle: "Raum geschafft", loseTitle: "Weg blockiert", winCopy: (c,r) => `Alle Beeren in Kapitel ${c}, Raum ${r}, wurden geborgen.`, loseCopy: "Der Eisweg braucht einen neuen Versuch.", stages: "Kapitel", next: "Nächster Raum", retry: "Raum wiederholen", replay: "Kapitel wiederholen" },
    it: { winTitle: "Stanza completata", loseTitle: "Percorso bloccato", winCopy: (c,r) => `Tutte le bacche del capitolo ${c}, stanza ${r}, sono state recuperate.`, loseCopy: "Il percorso di ghiaccio richiede un altro tentativo.", stages: "Capitoli", next: "Stanza successiva", retry: "Riprova stanza", replay: "Rigioca capitolo" },
    ru: { winTitle: "Комната пройдена", loseTitle: "Путь заблокирован", winCopy: (c,r) => `Все ягоды в главе ${c}, комнате ${r}, собраны.`, loseCopy: "Ледяной путь нужно пройти ещё раз.", stages: "Главы", next: "Следующая комната", retry: "Повторить комнату", replay: "Повторить главу" },
    hi: { winTitle: "कमरा पूरा", loseTitle: "रास्ता बंद", winCopy: (c,r) => `अध्याय ${c}, कमरे ${r} की सभी बेरियाँ सुरक्षित हैं।`, loseCopy: "बर्फ़ीले रास्ते को फिर से आज़माएँ।", stages: "अध्याय", next: "अगला कमरा", retry: "कमरा फिर आज़माएँ", replay: "अध्याय फिर खेलें" },
    ar: { winTitle: "اكتملت الغرفة", loseTitle: "المسار مغلق", winCopy: (c,r) => `تم جمع كل التوت في الفصل ${c}، الغرفة ${r}.`, loseCopy: "يحتاج المسار الجليدي إلى محاولة أخرى.", stages: "الفصول", next: "الغرفة التالية", retry: "إعادة محاولة الغرفة", replay: "إعادة لعب الفصل" },
  };
  const frostText = (key) => FROST_FEEDBACK_COPY[frostLocale()]?.[key] || FROST_COPY[frostLocale()][key] || FROST_COPY.en[key] || key;
  const frostResultText = (key, chapter = state.chapter, room = state.room) => {
    const copy = FROST_RESULT_COPY[frostLocale()] || FROST_RESULT_COPY.en;
    const value = copy[key];
    return typeof value === "function" ? value(chapter, room) : value;
  };
  const frostStageText = () => FROST_STAGE_COPY[frostLocale()] || FROST_STAGE_COPY.en;
  const frostStageLabel = () => FROST_STAGE_LABEL[frostLocale()] || FROST_STAGE_LABEL.en;
  const frostRoomLabel = () => FROST_ROOM_LABEL[frostLocale()] || FROST_ROOM_LABEL.en;
  const masteryCopy = () => mastery.copy[frostLocale()];
  const stageNumber = () => (state.chapter - 1) * ROOMS_PER_CHAPTER + state.room;
  const frostChapterName = (chapter, copy = frostStageText()) => chapter >= 5 ? masteryCopy()[chapter - 5] : copy.chapters[chapter - 1];
  const starsText = value => "★".repeat(value) + "☆".repeat(3 - value);
  function masteryHint() {
    const c = masteryCopy(), rules = mastery.rules(stageNumber());
    return [rules.echo ? c[4] : frostText("hint"), rules.home ? c[5] : "", `${c[2]}: ${state.edits} / ${rules.edits} · ${c[3]}: ${state.moves} / ${rules.steps}`, c[8]].filter(Boolean).join(" ");
  }
  function syncMastery() {
    $("frost-touch-hint").textContent = masteryHint();
    syncCoach();
    document.querySelectorAll("[data-stage-index]").forEach(card => {
      let badge = card.querySelector(".mastery-badge");
      if (!badge) { badge = document.createElement("small"); badge.className = "mastery-badge"; card.append(badge); }
      badge.textContent = `${masteryCopy()[6]} ${starsText(bestGrades[card.dataset.stageIndex] || 0)}`;
    });
  }

  /* FROST_COACH_MODEL_START */
  function planRescueRoute({grid,start,targets,enemy}) {
    if (!grid.length || !targets.length) return null;
    const id = p => `${p.x},${p.y}`;
    const goals = new Set(targets.map(id));
    const queue = [{p:start,path:[]}], seen = new Set([id(start)]);
    for(let i=0;i<queue.length;i++) {
      const {p,path}=queue[i];
      if(goals.has(id(p))) return path;
      for(const [dx,dy] of [[0,-1],[1,0],[0,1],[-1,0]]) {
        const n={x:p.x+dx,y:p.y+dy}, k=id(n);
        if(grid[n.y]?.[n.x]!=='.' || seen.has(k) || (enemy && id(enemy)===k))continue;
        seen.add(k);queue.push({p:n,path:[...path,n]});
      }
    }
    return null;
  }
  /* FROST_COACH_MODEL_END */
  const FROST_COACH_COPY = {
  "en": {
    "objective": "RESCUE MISSION",
    "home": "Bring the supplies back to the gold camp.",
    "collect": "Collect every pink berry.",
    "threat": "Drifter moves in",
    "echo": "Ice edits also move the drifter.",
    "hint": "Show route",
    "hide": "Hide route",
    "undo": "Undo",
    "legend": "Gold: you · Pink: supplies · Red: danger",
    "blocked": "No open route. Face a blue ice block and break it.",
    "route": "Next berry",
    "warning": "Route avoids its current cell. Watch the pursuit counter.",
    "hit": "You walked into the drifter. Choose a different lane.",
    "caught": "The drifter caught you. Watch the counter and block its route.",
    "edge": "Edge of the icefield. Choose another direction.",
    "optional": "Star targets are optional; there is no time limit.",
    "help": "Move one square. Face an ice block, then break it with Space; F builds a wall. H: route · U: undo.",
    "restored": "Last action restored.",
    "up": "Up",
    "down": "Down",
    "left": "Left",
    "right": "Right",
    "facing": "Facing",
    "turn": "Turn the gold arrow toward the block you want to edit.",
    "hitTitle": "You entered danger",
    "caughtTitle": "The drifter caught you",
    "main": "Collect the pink supplies, reshape the ice, and outsmart the drifter. Think at your own pace; there is no time limit.",
    "renderLost": "The icefield display was interrupted. Your saved progress is safe. Restore the display or reload.",
    "renderFailed": "The 3D icefield could not load. Retry the display; saved progress is retained.",
    "renderRetry": "Reload display"
  },
  "zh-tw": {
    "objective": "冰原救援任務",
    "home": "補給收齊了！回到金色營地。",
    "collect": "收集地圖上所有粉紅莓果。",
    "threat": "漂行者行動倒數：",
    "echo": "改動冰牆也會讓漂行者移動。",
    "hint": "顯示路線",
    "hide": "隱藏路線",
    "undo": "退回一步",
    "legend": "金色：你 · 粉紅：補給 · 紅色：危險",
    "blocked": "沒有暢通路線。面向藍色冰牆，再按破冰。",
    "route": "下一顆莓果",
    "warning": "路線避開敵人目前位置；仍須留意追蹤步數。",
    "hit": "你走進了漂行者的位置。重試時改走其他路。",
    "caught": "漂行者追上你了。留意步數，或造牆阻擋。",
    "edge": "已到冰原邊界，請換個方向。",
    "optional": "星星目標是額外挑戰，沒有時間限制。",
    "help": "方向鍵逐格移動；先面向冰牆，再按破冰／Space。F 造牆；H 路線；U 退一步。",
    "restored": "已退回上一步。",
    "up": "向上",
    "down": "向下",
    "left": "向左",
    "right": "向右",
    "facing": "面向",
    "turn": "金色箭頭指向哪一格，破冰和造牆就作用在哪一格。",
    "hitTitle": "走進危險格了",
    "caughtTitle": "被漂行者追上了",
    "main": "收集粉紅補給，用破冰開路、造牆擋住漂行者。沒有倒數計時，想好再走下一步。",
    "renderLost": "冰原畫面暫時中斷；已儲存進度仍保留。可等待畫面恢復，或重新載入。",
    "renderFailed": "立體冰原無法載入；請重試畫面，已儲存進度仍保留。",
    "renderRetry": "重新載入畫面"
  },
  "zh-cn": {
    "objective": "冰原救援任务",
    "home": "补给收齐了！回到金色营地。",
    "collect": "收集地图上所有粉红莓果。",
    "threat": "漂行者行动倒数：",
    "echo": "改动冰墙也会让漂行者移动。",
    "hint": "显示路线",
    "hide": "隐藏路线",
    "undo": "退回一步",
    "legend": "金色：你 · 粉红：补给 · 红色：危险",
    "blocked": "没有畅通路线。面向蓝色冰墙，再按破冰。",
    "route": "下一颗莓果",
    "warning": "路线避开敌人当前位置；仍须留意追踪步数。",
    "hit": "你走进了漂行者的位置。重试时改走其他路。",
    "caught": "漂行者追上你了。留意步数，或造墙阻挡。",
    "edge": "已到冰原边界，请换个方向。",
    "optional": "星星目标是额外挑战，没有时间限制。",
    "help": "方向键逐格移动；先面向冰墙，再按破冰／Space。F 造墙；H 路线；U 退一步。",
    "restored": "已退回上一步。",
    "up": "向上",
    "down": "向下",
    "left": "向左",
    "right": "向右",
    "facing": "面向",
    "turn": "金色箭头指向哪一格，破冰和造墙就作用在哪一格。",
    "hitTitle": "走进危险格了",
    "caughtTitle": "被漂行者追上了",
    "main": "收集粉红补给，用破冰开路、造墙挡住漂行者。没有倒数计时，想好再走下一步。",
    "renderLost": "冰原画面暂时中断；已保存进度仍保留。可等待画面恢复，或重新载入。",
    "renderFailed": "立体冰原无法载入；请重试画面，已保存进度仍保留。",
    "renderRetry": "重新载入画面"
  },
  "ja": {
    "objective": "氷原の救援任務",
    "home": "物資が揃いました。金色のキャンプへ戻ろう。",
    "collect": "ピンクのベリーをすべて集めよう。",
    "threat": "追跡者が動くまで",
    "echo": "氷の変更でも追跡者が動きます。",
    "hint": "ルート表示",
    "hide": "ルート非表示",
    "undo": "一手戻す",
    "legend": "金：自分 · ピンク：物資 · 赤：危険",
    "blocked": "道が塞がれています。青い氷に向いて壊そう。",
    "route": "次のベリー",
    "warning": "敵の現在地を避けるルートです。移動カウントに注意。",
    "hit": "追跡者のいるマスに入りました。別の道を選ぼう。",
    "caught": "追跡者に捕まりました。カウントを見て壁で防ごう。",
    "edge": "氷原の端です。別の方向へ進もう。",
    "optional": "星は追加の目標です。制限時間はありません。",
    "help": "矢印で一マス移動。氷に向いてSpaceで破壊、Fで壁。H：ルート、U：一手戻す。",
    "restored": "一手戻しました。",
    "up": "上",
    "down": "下",
    "left": "左",
    "right": "右",
    "facing": "向き",
    "turn": "金色の矢印が指すマスの氷を壊すか壁を作ります。",
    "hitTitle": "危険なマスに入りました",
    "caughtTitle": "追跡者に捕まりました",
    "main": "ピンクの物資を集め、氷を壊して道を開き、壁で追跡者を防ごう。制限時間はないので、一手ずつ考えよう。",
    "renderLost": "氷原の表示が中断しました。保存済みの進行は残っています。復元を待つか再読込してください。",
    "renderFailed": "3D氷原を読み込めません。保存済みの進行を残して再試行できます。",
    "renderRetry": "表示を再読込"
  },
  "ko": {
    "objective": "빙원 구조 임무",
    "home": "보급품을 모았어요. 금색 야영지로 돌아가세요.",
    "collect": "분홍 열매를 모두 모으세요.",
    "threat": "추적자 이동까지",
    "echo": "얼음을 바꿔도 추적자가 움직입니다.",
    "hint": "경로 보기",
    "hide": "경로 숨기기",
    "undo": "한 수 취소",
    "legend": "금색: 나 · 분홍: 보급품 · 빨강: 위험",
    "blocked": "길이 막혔어요. 파란 얼음을 향한 뒤 깨세요.",
    "route": "다음 열매",
    "warning": "적의 현재 위치를 피하는 경로입니다. 이동 수를 확인하세요.",
    "hit": "추적자가 있는 칸으로 들어갔어요. 다른 길을 고르세요.",
    "caught": "추적자에게 잡혔어요. 이동 수를 보고 벽으로 막으세요.",
    "edge": "빙원 끝입니다. 다른 방향을 고르세요.",
    "optional": "별은 추가 목표이며 시간 제한은 없습니다.",
    "help": "화살표로 한 칸 이동. 얼음을 향해 Space로 깨고 F로 벽을 만드세요. H: 경로, U: 취소.",
    "restored": "이전 행동을 되돌렸어요.",
    "up": "위",
    "down": "아래",
    "left": "왼쪽",
    "right": "오른쪽",
    "facing": "방향",
    "turn": "금색 화살표가 가리키는 칸의 얼음을 바꾸세요.",
    "hitTitle": "위험한 칸에 들어갔어요",
    "caughtTitle": "추적자에게 잡혔어요",
    "main": "분홍 보급품을 모으고 얼음을 깨서 길을 여세요. 벽으로 추적자를 막을 수 있어요. 시간 제한 없이 한 수씩 생각하세요.",
    "renderLost": "빙원 화면이 중단됐어요. 저장한 진행은 유지됩니다. 복구를 기다리거나 새로고침하세요.",
    "renderFailed": "3D 빙원을 불러오지 못했어요. 저장한 진행을 유지하고 다시 시도하세요.",
    "renderRetry": "화면 새로고침"
  },
  "es": {
    "objective": "MISIÓN DE RESCATE",
    "home": "Vuelve al campamento dorado con los suministros.",
    "collect": "Recoge todas las bayas rosas.",
    "threat": "El errante se mueve en",
    "echo": "Cambiar hielo también mueve al errante.",
    "hint": "Ver ruta",
    "hide": "Ocultar ruta",
    "undo": "Deshacer",
    "legend": "Oro: tú · Rosa: suministros · Rojo: peligro",
    "blocked": "No hay paso. Mira hacia el hielo azul y rómpelo.",
    "route": "Siguiente baya",
    "warning": "Evita la posición actual del rival. Vigila el contador.",
    "hit": "Entraste en la casilla del errante. Prueba otro camino.",
    "caught": "El errante te alcanzó. Vigila el contador y bloquea su ruta.",
    "edge": "Borde del campo. Elige otra dirección.",
    "optional": "Las estrellas son opcionales; no hay límite de tiempo.",
    "help": "Flechas: un paso. Mira al hielo y pulsa Espacio para romper; F construye. H: ruta · U: deshacer.",
    "restored": "Última acción restaurada.",
    "up": "Arriba",
    "down": "Abajo",
    "left": "Izquierda",
    "right": "Derecha",
    "facing": "Dirección",
    "turn": "La flecha dorada señala la casilla que vas a modificar.",
    "hitTitle": "Entraste en peligro",
    "caughtTitle": "El errante te alcanzó",
    "main": "Recoge los suministros rosas, rompe hielo para abrir caminos y construye muros para frenar al errante. Piensa sin límite de tiempo.",
    "renderLost": "La vista se interrumpió. El progreso guardado se conserva. Espera o recarga.",
    "renderFailed": "No se pudo cargar el campo 3D. Reintenta; se conserva el progreso guardado.",
    "renderRetry": "Recargar vista"
  },
  "pt-br": {
    "objective": "MISSÃO DE RESGATE",
    "home": "Volte ao acampamento dourado com os suprimentos.",
    "collect": "Colete todas as frutas rosas.",
    "threat": "O andarilho se move em",
    "echo": "Mudar o gelo também move o andarilho.",
    "hint": "Ver rota",
    "hide": "Ocultar rota",
    "undo": "Desfazer",
    "legend": "Dourado: você · Rosa: suprimentos · Vermelho: perigo",
    "blocked": "Sem passagem. Vire para o gelo azul e quebre-o.",
    "route": "Próxima fruta",
    "warning": "Evita a posição atual do rival. Observe o contador.",
    "hit": "Você entrou na casa do andarilho. Tente outro caminho.",
    "caught": "O andarilho alcançou você. Observe o contador e bloqueie a rota.",
    "edge": "Limite do campo. Escolha outra direção.",
    "optional": "As estrelas são opcionais; não há limite de tempo.",
    "help": "Setas: um passo. Vire para o gelo e use Espaço para quebrar; F constrói. H: rota · U: desfazer.",
    "restored": "Última ação restaurada.",
    "up": "Cima",
    "down": "Baixo",
    "left": "Esquerda",
    "right": "Direita",
    "facing": "Direção",
    "turn": "A seta dourada aponta a casa que será modificada.",
    "hitTitle": "Você entrou em perigo",
    "caughtTitle": "O andarilho alcançou você",
    "main": "Colete os suprimentos rosas, quebre gelo para abrir caminhos e faça paredes contra o andarilho. Pense sem limite de tempo.",
    "renderLost": "A imagem foi interrompida. O progresso salvo permanece. Aguarde ou recarregue.",
    "renderFailed": "Não foi possível carregar o campo 3D. Tente de novo; o progresso salvo permanece.",
    "renderRetry": "Recarregar imagem"
  },
  "fr": {
    "objective": "MISSION DE SECOURS",
    "home": "Rapportez les provisions au camp doré.",
    "collect": "Ramassez toutes les baies roses.",
    "threat": "Déplacement du rôdeur dans",
    "echo": "Modifier la glace fait aussi avancer le rôdeur.",
    "hint": "Voir le trajet",
    "hide": "Masquer le trajet",
    "undo": "Annuler",
    "legend": "Or : vous · Rose : provisions · Rouge : danger",
    "blocked": "Passage fermé. Regardez la glace bleue puis brisez-la.",
    "route": "Prochaine baie",
    "warning": "Évite la position actuelle du rôdeur. Surveillez le compteur.",
    "hit": "Vous êtes entré sur la case du rôdeur. Changez de chemin.",
    "caught": "Le rôdeur vous a rattrapé. Surveillez le compteur et bloquez-le.",
    "edge": "Bord du terrain. Choisissez une autre direction.",
    "optional": "Les étoiles sont facultatives ; aucun temps limité.",
    "help": "Flèches : une case. Regardez la glace, Espace la brise ; F construit. H : trajet · U : annuler.",
    "restored": "Dernière action annulée.",
    "up": "Haut",
    "down": "Bas",
    "left": "Gauche",
    "right": "Droite",
    "facing": "Direction",
    "turn": "La flèche dorée indique la case à modifier.",
    "hitTitle": "Vous êtes entré dans le danger",
    "caughtTitle": "Le rôdeur vous a rattrapé",
    "main": "Ramassez les provisions roses, brisez la glace pour ouvrir un chemin et bloquez le rôdeur avec des murs. Prenez votre temps.",
    "renderLost": "L’affichage a été interrompu. La progression enregistrée est conservée. Patientez ou rechargez.",
    "renderFailed": "Impossible de charger le terrain 3D. Réessayez ; la progression enregistrée reste.",
    "renderRetry": "Recharger l’affichage"
  },
  "de": {
    "objective": "RETTUNGSMISSION",
    "home": "Bringe die Vorräte zum goldenen Lager zurück.",
    "collect": "Sammle alle rosa Beeren.",
    "threat": "Wanderer bewegt sich in",
    "echo": "Eisänderungen bewegen auch den Wanderer.",
    "hint": "Route zeigen",
    "hide": "Route ausblenden",
    "undo": "Rückgängig",
    "legend": "Gold: du · Rosa: Vorräte · Rot: Gefahr",
    "blocked": "Kein freier Weg. Schau zum blauen Eis und brich es.",
    "route": "Nächste Beere",
    "warning": "Meidet die aktuelle Gegnerposition. Beachte den Zähler.",
    "hit": "Du bist auf das Feld des Wanderers gegangen. Wähle einen anderen Weg.",
    "caught": "Der Wanderer hat dich erwischt. Beachte den Zähler und blockiere ihn.",
    "edge": "Rand des Feldes. Wähle eine andere Richtung.",
    "optional": "Sterne sind freiwillig; es gibt kein Zeitlimit.",
    "help": "Pfeile: ein Feld. Zum Eis schauen, Leertaste bricht es; F baut. H: Route · U: zurück.",
    "restored": "Letzte Aktion zurückgenommen.",
    "up": "Oben",
    "down": "Unten",
    "left": "Links",
    "right": "Rechts",
    "facing": "Blickrichtung",
    "turn": "Der goldene Pfeil zeigt auf das Feld für die Eisänderung.",
    "hitTitle": "Du bist in die Gefahr gelaufen",
    "caughtTitle": "Der Wanderer hat dich erwischt",
    "main": "Sammle rosa Vorräte, öffne Wege durch Eis und halte den Wanderer mit Wänden auf. Überlege in Ruhe, ohne Zeitlimit.",
    "renderLost": "Die Anzeige wurde unterbrochen. Gespeicherter Fortschritt bleibt erhalten. Warte oder lade neu.",
    "renderFailed": "Das 3D-Feld konnte nicht geladen werden. Wiederholen; gespeicherter Fortschritt bleibt erhalten.",
    "renderRetry": "Anzeige neu laden"
  },
  "it": {
    "objective": "MISSIONE DI SOCCORSO",
    "home": "Riporta le provviste al campo dorato.",
    "collect": "Raccogli tutte le bacche rosa.",
    "threat": "Il vagabondo si muove tra",
    "echo": "Modificare il ghiaccio muove anche il vagabondo.",
    "hint": "Mostra percorso",
    "hide": "Nascondi percorso",
    "undo": "Annulla",
    "legend": "Oro: tu · Rosa: provviste · Rosso: pericolo",
    "blocked": "Nessun passaggio. Guarda il ghiaccio blu e rompilo.",
    "route": "Prossima bacca",
    "warning": "Evita la posizione attuale del rivale. Controlla il contatore.",
    "hit": "Sei entrato nella casella del vagabondo. Cambia strada.",
    "caught": "Il vagabondo ti ha raggiunto. Controlla il contatore e bloccalo.",
    "edge": "Bordo del campo. Scegli un’altra direzione.",
    "optional": "Le stelle sono facoltative; nessun limite di tempo.",
    "help": "Frecce: una casella. Guarda il ghiaccio, Spazio lo rompe; F costruisce. H: percorso · U: annulla.",
    "restored": "Ultima azione annullata.",
    "up": "Su",
    "down": "Giù",
    "left": "Sinistra",
    "right": "Destra",
    "facing": "Direzione",
    "turn": "La freccia dorata indica la casella da modificare.",
    "hitTitle": "Sei entrato nel pericolo",
    "caughtTitle": "Il vagabondo ti ha raggiunto",
    "main": "Raccogli le provviste rosa, rompi il ghiaccio e costruisci muri per fermare il vagabondo. Ragiona senza limiti di tempo.",
    "renderLost": "La vista è stata interrotta. I progressi salvati restano. Attendi o ricarica.",
    "renderFailed": "Impossibile caricare il campo 3D. Riprova: i progressi salvati restano.",
    "renderRetry": "Ricarica vista"
  },
  "ru": {
    "objective": "СПАСАТЕЛЬНАЯ МИССИЯ",
    "home": "Верните припасы в золотой лагерь.",
    "collect": "Соберите все розовые ягоды.",
    "threat": "Странник двинется через",
    "echo": "Изменение льда тоже двигает странника.",
    "hint": "Показать путь",
    "hide": "Скрыть путь",
    "undo": "Отменить ход",
    "legend": "Золото: вы · Розовый: припасы · Красный: опасность",
    "blocked": "Путь закрыт. Повернитесь к синему льду и сломайте его.",
    "route": "Следующая ягода",
    "warning": "Обходит текущую клетку врага. Следите за счётчиком.",
    "hit": "Вы вошли на клетку странника. Выберите другой путь.",
    "caught": "Странник догнал вас. Следите за счётчиком и стройте преграды.",
    "edge": "Край поля. Выберите другое направление.",
    "optional": "Звёзды необязательны; ограничения времени нет.",
    "help": "Стрелки: шаг. Повернитесь ко льду, Пробел ломает его; F строит. H: путь · U: отмена.",
    "restored": "Последний ход отменён.",
    "up": "Вверх",
    "down": "Вниз",
    "left": "Влево",
    "right": "Вправо",
    "facing": "Направление",
    "turn": "Золотая стрелка указывает клетку для изменения льда.",
    "hitTitle": "Вы вошли в опасную клетку",
    "caughtTitle": "Странник вас догнал",
    "main": "Собирайте розовые припасы, ломайте лёд и преграждайте путь страннику стенами. Обдумывайте каждый шаг без ограничения времени.",
    "renderLost": "Отображение прервано. Сохранённый прогресс остаётся. Подождите или перезагрузите.",
    "renderFailed": "Не удалось загрузить 3D-поле. Повторите: сохранённый прогресс остаётся.",
    "renderRetry": "Перезагрузить вид"
  },
  "hi": {
    "objective": "बर्फ़ीला बचाव अभियान",
    "home": "सामान लेकर सुनहरे शिविर में लौटें।",
    "collect": "सभी गुलाबी बेरियाँ इकट्ठी करें।",
    "threat": "पीछा करने वाला चलेगा",
    "echo": "बर्फ बदलने से भी पीछा करने वाला चलता है।",
    "hint": "रास्ता दिखाएँ",
    "hide": "रास्ता छिपाएँ",
    "undo": "एक चाल वापस",
    "legend": "सुनहरा: आप · गुलाबी: सामान · लाल: खतरा",
    "blocked": "रास्ता बंद है। नीली बर्फ की ओर मुड़कर उसे तोड़ें।",
    "route": "अगली बेरी",
    "warning": "दुश्मन की मौजूदा जगह से बचता है। चाल गिनती देखें।",
    "hit": "आप दुश्मन की जगह पर चले गए। दूसरा रास्ता चुनें।",
    "caught": "दुश्मन ने पकड़ लिया। गिनती देखें और दीवार बनाएँ।",
    "edge": "मैदान का किनारा। दूसरी दिशा चुनें।",
    "optional": "तारे वैकल्पिक हैं; समय सीमा नहीं है।",
    "help": "तीर: एक कदम। बर्फ की ओर मुड़ें, Space तोड़ेगा; F दीवार बनाएगा। H: रास्ता · U: वापस।",
    "restored": "पिछली चाल वापस हुई।",
    "up": "ऊपर",
    "down": "नीचे",
    "left": "बाएँ",
    "right": "दाएँ",
    "facing": "दिशा",
    "turn": "सुनहरा तीर उस खाने को दिखाता है जिसकी बर्फ बदलेगी।",
    "hitTitle": "आप खतरे वाले खाने में गए",
    "caughtTitle": "दुश्मन ने आपको पकड़ लिया",
    "main": "गुलाबी सामान इकट्ठा करें, बर्फ तोड़कर रास्ता खोलें और दीवार से दुश्मन को रोकें। बिना समय सीमा हर चाल सोचें।",
    "renderLost": "दृश्य रुक गया। सहेजी प्रगति सुरक्षित है। प्रतीक्षा करें या फिर लोड करें।",
    "renderFailed": "3D मैदान लोड नहीं हुआ। फिर कोशिश करें; सहेजी प्रगति सुरक्षित है।",
    "renderRetry": "दृश्य फिर लोड करें"
  },
  "ar": {
    "objective": "مهمة الإنقاذ",
    "home": "أعد المؤن إلى المخيم الذهبي.",
    "collect": "اجمع كل التوت الوردي.",
    "threat": "يتحرك المتجول بعد",
    "echo": "تغيير الجليد يحرك المتجول أيضاً.",
    "hint": "إظهار المسار",
    "hide": "إخفاء المسار",
    "undo": "تراجع",
    "legend": "ذهبي: أنت · وردي: مؤن · أحمر: خطر",
    "blocked": "الطريق مغلق. واجه الجليد الأزرق ثم اكسره.",
    "route": "التوت التالي",
    "warning": "يتجنب موقع العدو الحالي. راقب عداد الحركة.",
    "hit": "دخلت مربع المتجول. اختر طريقاً آخر.",
    "caught": "أمسك بك المتجول. راقب العداد واسد طريقه.",
    "edge": "حافة الحقل. اختر اتجاهاً آخر.",
    "optional": "النجوم اختيارية؛ لا يوجد حد زمني.",
    "help": "الأسهم: خطوة. واجه الجليد واكسره بمفتاح Space؛ F يبني. H: مسار · U: تراجع.",
    "restored": "تم التراجع عن الحركة الأخيرة.",
    "up": "أعلى",
    "down": "أسفل",
    "left": "يسار",
    "right": "يمين",
    "facing": "الاتجاه",
    "turn": "يشير السهم الذهبي إلى المربع الذي ستغير جليده.",
    "hitTitle": "دخلت مربع الخطر",
    "caughtTitle": "أمسك بك المتجول",
    "main": "اجمع المؤن الوردية، واكسر الجليد لفتح الطريق، وابن جدراناً لصد المتجول. فكر بكل خطوة دون حد زمني.",
    "renderLost": "توقف العرض. يبقى التقدم المحفوظ. انتظر الاستعادة أو أعد التحميل.",
    "renderFailed": "تعذر تحميل الحقل الثلاثي الأبعاد. حاول ثانية؛ يبقى التقدم المحفوظ.",
    "renderRetry": "إعادة تحميل العرض"
  }
};
  /* FROST_COACH_COPY_END */

  const coachText = k => (FROST_COACH_COPY[frostLocale()] || FROST_COACH_COPY.en)[k];
  let history=[], routeShown=false, advicePath=null, lossReason='caught';
  const reducedMotion=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function snapshot() {
    return {player:{...state.player},enemy:{...state.enemy},facing:{...state.facing},walls:new Set(state.walls),fruits:new Set(state.fruits),moves:state.moves,edits:state.edits};
  }
  function remember() { history.push(snapshot());if(history.length>48)history.shift(); }
  function undoRescue() {
    if(state.screen!=='battle'||state.resolving||state.renderBlocked||!history.length)return;
    Object.assign(state,history.pop());
    updateLabels();syncMastery();syncCoach();coachStatus(coachText('restored'));
  }
  function coachStatus(value) {
    const node=$('battle-status');node.textContent=value;
    node.classList.remove('frost-beat');void node.offsetWidth;node.classList.add('frost-beat');
  }
  function syncCoach() {
    const host=$('rescue-coach');if(!host || !state.player)return;
    document.querySelector(".main-summary").textContent=coachText("main");
    const home=mastery.rules(stageNumber()).home && !state.fruits.size;
    $('rescue-objective').textContent=home?coachText('home'):coachText('collect');
    $('rescue-kicker').textContent=coachText('objective');
    $('rescue-count').textContent=`${state.initialFruitCount-state.fruits.size} / ${state.initialFruitCount}`;
    $('rescue-meter').max=state.initialFruitCount||1;$('rescue-meter').value=state.initialFruitCount-state.fruits.size;
    $('rescue-threat').textContent=`${coachText('threat')} ${8-state.moves%8}`;
    host.dataset.danger=String(8-state.moves%8<=2);
    host.dataset.echo=String(mastery.rules(stageNumber()).echo);
    const f=state.facing, name=f.y<0?'up':f.y>0?'down':f.x<0?'left':'right';
    $('rescue-facing').textContent=`${coachText('facing')} ${coachText(name)}`;
    $('rescue-route').textContent=coachText(routeShown?'hide':'hint');
    $('rescue-route').setAttribute('aria-pressed',String(routeShown));
    $('rescue-undo').textContent=coachText('undo');$('rescue-undo').disabled=!history.length||state.resolving;
    $('rescue-legend').textContent=coachText('legend');
    const rule=mastery.rules(stageNumber()),cost=masteryCopy();
    $('rescue-rules').textContent=`${cost[2]}: \u2066${state.edits}/${rule.edits}\u2069\n${cost[3]}: \u2066${state.moves}/${rule.steps}\u2069`;
    const grid=Array.from({length:rows},(_,y)=>Array.from({length:cols},(_,x)=>state.walls.has(key(x,y))?'I':'.').join(''));
    const targets=home?[{x:1,y:5}]:[...state.fruits].map(k=>{const [x,y]=k.split(',').map(Number);return{x,y};});
    advicePath=routeShown?planRescueRoute({grid,start:state.player,targets,enemy:state.enemy}):null;
    $('rescue-advice').textContent=!state.fruits.size&&!home?frostResultText('winTitle'):routeShown?(advicePath?`${home?coachText('home'):coachText('route')} · ${advicePath.length} → ${coachText('warning')}`:coachText('blocked')):coachText(mastery.rules(stageNumber()).echo?'echo':'turn');
    for(const name of ['up','down','left','right'])document.querySelector(`[data-action="${name}"]`)?.setAttribute('aria-label',coachText(name));
    $('frost-touch-hint').textContent=coachText('help');
  }
  function resetCoach() {history=[];routeShown=false;advicePath=null;state.initialFruitCount=state.fruits.size;syncCoach();}
  let battleStatusKey = "controls";
  const setBattleStatus = (key) => {
    battleStatusKey = key;
    const status = $("battle-status");
    status.textContent = frostText(key);
    status.dataset.state = key;
    status.classList.remove("frost-beat");
    if (["cracked", "built", "berry", "berryClear"].includes(key)) {
      void status.offsetWidth;
      status.classList.add("frost-beat");
    }
  };
    const applyFrostLocale = () => {
      document.querySelector('[data-action="break"]')?.replaceChildren(document.createTextNode(frostText("breakButton")));
      document.querySelector('[data-action="build"]')?.replaceChildren(document.createTextNode(frostBuildText()));
      $("arena")?.setAttribute("aria-label", coachText("objective")+". "+coachText("collect"));
      for (const destination of ["main", "stage", "battle"]) {
        const returnControl = document.querySelector(`[data-wp-return="${destination}"]`);
        if (returnControl) {
          const backLabel = destination === "battle" ? frostBattleBackText() : frostReturnText(destination);
          returnControl.setAttribute("aria-label", backLabel);
          returnControl.title = backLabel;
        }
      }
      document.querySelector(".touch-hint")?.replaceChildren(document.createTextNode(frostText("hint")));
      const stageCopy = frostStageText();
      const stageHeading = document.querySelector(".stage-header h2");
      if (stageHeading) stageHeading.textContent = stageCopy.heading;
      const stageTabs = document.querySelector(".stage-tabs");
      if (stageTabs) stageTabs.setAttribute("aria-label", stageCopy.tab);
      const stageTab = document.querySelector(".stage-tabs button");
      if (stageTab) stageTab.textContent = stageCopy.tab;
      document.querySelectorAll("#stage-list [data-wp-stage-card]").forEach((button) => {
        const stage = Number(button.dataset.stageIndex || 0);
        const chapter = Number(button.dataset.chapter || 0);
        const room = Number(button.dataset.room || 0);
        if (!stage || !chapter || !room) return;
        const chapterName = frostChapterName(chapter, stageCopy);
        const label = `${frostStageLabel()} ${stage}: ${stageCopy.chapter} ${chapter}${stageCopy.chapterSuffix || ""}, ${frostRoomLabel()} ${room}`;
        button.innerHTML = `<strong>${frostStageLabel()} ${stage}</strong><span>${chapterName} · ${frostRoomLabel()} ${room}</span><small>${stageCopy.chapter} ${chapter}${stageCopy.chapterSuffix || ""}</small>`;
        button.setAttribute("aria-label", label);
      });
      syncFrostStageAvailability();
      $("result-title").textContent = frostResultText("winTitle");
      $("result-copy").textContent = frostResultText("winCopy", 1, 1);
      $("to-stages").textContent = frostResultText("stages");
      $("next").textContent = frostResultText("next");
      $("retry").textContent = frostResultText("retry");
      setBattleStatus(battleStatusKey);
      syncMastery();
      if (state.screen === "result") renderResult(state.won);
    };
    const frostLocaleObserver = new MutationObserver((records) => {
      const currentLocale = document.documentElement.lang || "";
      if (records.some((record) => record.attributeName === "lang" && record.oldValue !== currentLocale)) {
        applyFrostLocale();
      }
    });
    frostLocaleObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
      attributeOldValue: true,
    });
    const syncBattleStatusLocale = () => {
    const status = $("battle-status");
    const source = status?.textContent?.trim() || "";
    const key = Object.keys(FROST_COPY.en).find((candidate) => FROST_COPY.en[candidate] === source);
    if (key && source !== frostText(key)) {
      battleStatusKey = key;
      status.textContent = frostText(key);
    }
  };
  const frostStatusObserver = new MutationObserver(syncBattleStatusLocale);
  frostStatusObserver.observe($("battle-status"), { childList: true, characterData: true, subtree: true });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", applyFrostLocale, { once: true }); else applyFrostLocale();
  function syncFrostStageAvailability(){const rail=$("stage-list");if(!rail)return;const railRect=rail.getBoundingClientRect();const canvasRect=rail.closest("[data-wp-logical-stage-canvas]")?.getBoundingClientRect()||railRect;const cards=[...rail.querySelectorAll("[data-wp-stage-card]")];cards.forEach((card)=>{const rect=card.getBoundingClientRect();const centerX=rect.left+rect.width/2;const centerY=rect.top+rect.height/2;const inRail=rect.width>1&&rect.height>1&&centerX>railRect.left+2&&centerX<railRect.right-2&&centerY>railRect.top+2&&centerY<railRect.bottom-2&&centerX>canvasRect.left+2&&centerX<canvasRect.right-2&&centerY>canvasRect.top+2&&centerY<canvasRect.bottom-2;card.setAttribute("aria-disabled",String(!inRail));card.tabIndex=inRail?0:-1;});}
  function show(name){if(state.screen==="result"&&name!=="result")window.ShowResultGet?.("animal-frost-maze",false);if(name!=="result")window.WeightPlayCastle?.dismissRewardNotice?.("animal-frost-maze");if(name!=="battle")clearFlights();state.screen=name;frostScene?.setActive(name==="battle"||name==="result");document.body.dataset.screen=name==="result"?"battle":name;cancelAnimationFrame(state.raf);const result=document.querySelector("#result-screen");document.querySelectorAll(".screen").forEach((el)=>{const isResult=el===result&&name==="result";const keepBattle=name==="result"&&el.id==="battle-screen";const on=isResult||keepBattle||el.dataset.screen===name;el.hidden=!on;el.classList.toggle("active",on)});if(name==="result")window.ShowResultGet?.("animal-frost-maze",false);for(const child of $("battle-screen").children)if(child!==result)child.inert=name==="result";if(name==="battle")(__wpNotifyMeasurement(), result?.setAttribute("hidden",""));if(name==="stage")window.requestAnimationFrame(syncFrostStageAvailability);if(name==="battle")state.raf=requestAnimationFrame(frame);window.dispatchEvent(new Event("weightplay:stage-sync"));window.dispatchEvent(new Event("weightplay:shell-sync"));
    { const __wpNextScreen = ({main:"main",stage:"stage",battle:"battle",})[name] ?? null;
      if (["result"].includes(name) && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "complete"; }
      else if (true && (__wpNextScreen === "main" || __wpNextScreen === "stage") && __wpMeasurement.screen === "battle" && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "abandon"; }
      __wpMeasurement.screen = __wpNextScreen;  __wpNotifyMeasurement(); }
}
  function stageCards(){const copy=frostStageText();const stageLabel=frostStageLabel();const roomLabel=frostRoomLabel();const cards=Array.from({length:TOTAL_STAGES},(_,index)=>{const stage=index+1;const chapter=Math.floor(index/ROOMS_PER_CHAPTER)+1;const room=index%ROOMS_PER_CHAPTER+1;const chapterName=frostChapterName(chapter,copy);const label=`${stageLabel} ${stage}: ${copy.chapter} ${chapter}${copy.chapterSuffix || ""}, ${roomLabel} ${room}`;return `<button type="button" class="stage-card" data-wp-stage-card data-wp-enter-battle data-stage-index="${stage}" data-chapter="${chapter}" data-room="${room}" aria-label="${label}"><strong>${stageLabel} ${stage}</strong><span>${chapterName} · ${roomLabel} ${room}</span><small>${copy.chapter} ${chapter}${copy.chapterSuffix || ""}</small></button>`;}).join("");$("stage-list").innerHTML=cards;$("stage-list").querySelectorAll("button").forEach((b)=>b.addEventListener("click",()=>startRoom(Number(b.dataset.chapter),Number(b.dataset.room))));syncFrostStageAvailability();syncMastery();}
  function layoutFor(chapter, room) { const variant=(chapter-1)*ROOMS_PER_CHAPTER+room-1; const walls=new Set([key(3,1),key(3,2),key(3,3),key(5,3),key(6,3),key(8,2),key(8,3),key(8,4),key(4,5),key(5,5),key(7,5)]); const variants=[[2,2],[4,1],[6,4],[9,5],[2,5],[7,1],[9,2],[5,1]]; const extra=variants[variant%variants.length]; walls.add(key(extra[0],extra[1])); if(chapter>=2)walls.add(key(6,1)); if(chapter>=3)walls.add(key(9,4)); if(chapter>=4)walls.add(key(1,2)); const candidates=[[2,1],[5,1],[7,2],[10,4],[2,4],[6,6],[9,6],[10,1],[1,1]]; const fruits=new Set(); candidates.forEach(([x,y],i)=>{if(!walls.has(key(x,y))&&i<5+(variant%3))fruits.add(key(x,y));}); return {walls,fruits,enemy:{x:10-(variant%3),y:1+(variant%2)}}; }
  function buildRoom(){clearFlights();state.renderRound=(state.renderRound||0)+1;window.clearTimeout(state.finishTimer);state.finishTimer=0;const layout=layoutFor(state.chapter,state.room);state.player={x:1,y:5};state.enemy=layout.enemy;state.facing={x:1,y:0};state.moves=0;state.edits=0;state.resolving=false;state.won=false;state.ticks=0;state.walls=layout.walls;state.fruits=layout.fruits;$(`room-label`).textContent=`${frostStageText().chapter} ${state.chapter} · ${frostRoomLabel()} ${state.room} / ${ROOMS_PER_CHAPTER}`;resetCoach();setBattleStatus("controls");updateLabels();syncMastery();coachStatus(coachText("help"));}
  function startRoom(chapter=1,room=1){if(state.renderBlocked)return;state.chapter=chapter;state.room=room;buildRoom();show("battle");window.WeightPlayAudio?.play?.("game.start");
    __wpMeasurement.roundKey = {}; __wpMeasurement.restart = false; __wpMeasurement.started = true; __wpMeasurement.ended = false; __wpMeasurement.outcome = "complete"; __wpMeasurement.screen = "battle"; __wpNotifyMeasurement();
}
  function updateLabels(){$("fruit-label").textContent=`◆ ${state.fruits.size}`;}
  function updateProgress(){const value=`Best rooms: ${state.best}`;$("main-progress").textContent=window.wpFiveText?window.wpFiveText(value):value;}
  function canMove(x,y){return x>=0&&x<cols&&y>=0&&y<rows&&!state.walls.has(key(x,y));}
  function move(dx,dy) {
    if(state.screen!=="battle" || state.resolving || state.renderBlocked) return;
    const previousFacing={...state.facing};
    state.facing={x:dx,y:dy};
    const nx=state.player.x+dx, ny=state.player.y+dy;
    if(!canMove(nx,ny)){syncCoach();if(nx<0||ny<0||nx>=cols||ny>=rows)coachStatus(coachText("edge"));else setBattleStatus("wallAhead");return;}
    const newFacing=state.facing;state.facing=previousFacing;remember();state.facing=newFacing;
    state.player={x:nx,y:ny}; state.moves+=1;
    if(nx===state.enemy.x && ny===state.enemy.y){lossReason="hit";finish(false);return;}
    const collected=state.fruits.delete(key(nx,ny));
    if(collected){notifyAnalytics("berry_collected",{remaining_berries:state.fruits.size});setBattleStatus(state.fruits.size===0?"berryClear":"berry");}
    notifyAnalytics("first_move",{action:`move_${dx}_${dy}`});updateLabels();syncMastery();
    if(state.fruits.size===0 && (!mastery.rules(stageNumber()).home || (nx===1 && ny===5))){
      state.resolving=true;syncCoach();draw();
      const delay=window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches?0:360;
      state.finishTimer=window.setTimeout(()=>finish(true),delay);return;
    }
    if(state.moves%8===0)enemyStep();
    syncCoach();
  }
  function breakIce(){if(state.screen!=="battle"||state.resolving||state.renderBlocked)return;const p=state.player,nx=p.x+state.facing.x,ny=p.y+state.facing.y;if(state.walls.has(key(nx,ny))){remember();state.walls.delete(key(nx,ny));setBattleStatus("cracked");notifyAnalytics("first_edit",{action:"break"});afterEdit();}else setBattleStatus("noBreak");}
  function buildIce(){if(state.screen!=="battle"||state.resolving||state.renderBlocked)return;const p=state.player,nx=p.x+state.facing.x,ny=p.y+state.facing.y;if(nx>0&&nx<cols-1&&ny>0&&ny<rows-1&&!state.walls.has(key(nx,ny))&&!state.fruits.has(key(nx,ny))&&!(state.enemy.x===nx&&state.enemy.y===ny)){remember();setBattleStatus("built");state.walls.add(key(nx,ny));notifyAnalytics("first_edit",{action:"build"});afterEdit();}else setBattleStatus("noBuild");}
  function enemyStep(){const e=state.enemy,p=state.player;const options=[];if(Math.abs(p.x-e.x)>=Math.abs(p.y-e.y))options.push([Math.sign(p.x-e.x),0],[0,Math.sign(p.y-e.y)]);else options.push([0,Math.sign(p.y-e.y)],[Math.sign(p.x-e.x),0]);for(const [dx,dy] of options){if(canMove(e.x+dx,e.y+dy)){e.x+=dx;e.y+=dy;break;}}if(e.x===p.x&&e.y===p.y){lossReason="caught";finish(false);}}
  function draw(){
    if(!frostScene||!state.player)return;
    frostScene.render({stage:state.renderRound||0,roomStage:stageNumber(),player:state.player,enemy:state.enemy,facing:state.facing,
      walls:[...state.walls],fruits:[...state.fruits],route:routeShown?advicePath:null,home:mastery.rules(stageNumber()).home,won:state.won,resolving:state.resolving});
  }
  // Localized Result transaction overrides the prototype fallback above while
  // preserving the existing finish/show flow.
  function afterEdit(){state.edits+=1;syncMastery();if(mastery.rules(stageNumber()).echo)enemyStep();syncCoach();}
  function renderResult(win) {
    const c=masteryCopy(), stage=stageNumber(), rule=mastery.rules(stage);
    $("result-title").textContent=win&&stage===30?c[7]:(win?frostResultText("winTitle"):coachText(lossReason+"Title"));
    $("result-copy").textContent=[win?frostResultText("winCopy"):coachText(lossReason), win?starsText(mastery.grade(stage,state.edits,state.moves)):"",
      `${c[2]}: ${state.edits} / ${rule.edits} · ${c[3]}: ${state.moves} / ${rule.steps}`, c[8]].filter(Boolean).join("\n");
    $("to-stages").textContent=frostResultText("stages");$("next").textContent=frostResultText("next");
    $("next").disabled=!win||stage===30;$("retry").textContent=frostResultText("retry");
  }
  function finish(win) {
    if(state.screen!=="battle")return;
    window.clearTimeout(state.finishTimer);state.finishTimer=0;state.resolving=true;state.won=win;
    if(win){
      state.best=Math.max(state.best,stageNumber());
      bestGrades[stageNumber()]=Math.max(bestGrades[stageNumber()]||0,mastery.grade(stageNumber(),state.edits,state.moves));
      try{localStorage.setItem("wp-frost-best",String(state.best));localStorage.setItem("wp-frost-mastery",JSON.stringify(bestGrades));}catch{}
      updateProgress();
    }
    draw();renderResult(win);show("result");

    __wpMeasurement.ended = true; __wpMeasurement.outcome = (win ? "win" : "lose"); if (__wpMeasurement.screen === "battle") __wpMeasurement.screen = null; __wpNotifyMeasurement();
}
  function frame(){if(state.screen!=="battle")return;state.ticks++;draw();state.raf=requestAnimationFrame(frame);}
  window.addEventListener('weightplay:castle-reward',event=>{
    if(event.detail?.gameId!=='animal-frost-maze'||!(Number(event.detail.amount)>0))return;
    if(state.screen==='result'&&state.won)window.ShowResultGet?.('animal-frost-maze',true);
    window.WeightPlayCastle?.dismissRewardNotice?.('animal-frost-maze');
  });
  const actions={up:()=>move(0,-1),down:()=>move(0,1),left:()=>move(-1,0),right:()=>move(1,0),break:breakIce,build:buildIce};
  // The local runtime translates live state; route navigation also refreshes
  // the authored guide and metadata without the shared DOM translation loop.
  $("localeSelect").addEventListener("change",(event)=>{
    const aliases={"zh-Hant":"zh-tw","zh-Hans":"zh-cn","pt-BR":"pt-br"};
    const locale=aliases[event.target.value]||event.target.value.toLowerCase();
    if(mastery.copy[locale])location.assign(`/${locale}/games/animal-frost-maze/${location.search}`);
  });
  $('rescue-route').addEventListener('click',()=>{if(state.screen!=='battle'||state.resolving||state.renderBlocked)return;routeShown=!routeShown;syncCoach();canvas.focus({preventScroll:true});});
  $('rescue-undo').addEventListener('click',()=>{undoRescue();canvas.focus({preventScroll:true});});
  window.addEventListener('keydown',event=>{
    if(state.screen!=='battle'||[...document.querySelectorAll('.wp-shell-settings-popover')].some(n=>getComputedStyle(n).display!=='none'&&n.getClientRects().length)||/^(INPUT|SELECT|TEXTAREA)$/.test(event.target.tagName))return;
    if(event.code==='KeyU'){event.preventDefault();undoRescue();}
    if(event.code==='KeyH'){event.preventDefault();routeShown=!routeShown;syncCoach();}
  });
  window.addEventListener("keydown",(e)=>{if(state.screen!=="battle"||[...document.querySelectorAll('.wp-shell-settings-popover')].some(n=>getComputedStyle(n).display!=='none'&&n.getClientRects().length)||/^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName))return;const k=e.code;if(k==="Space"&&/^(BUTTON|A)$/.test(e.target.tagName))return;if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","KeyW","KeyA","KeyS","KeyD","Space","KeyF"].includes(k)){e.preventDefault();if(k==="Space")breakIce();else if(k==="KeyF")buildIce();else if(k==="ArrowUp"||k==="KeyW")move(0,-1);else if(k==="ArrowDown"||k==="KeyS")move(0,1);else if(k==="ArrowLeft"||k==="KeyA")move(-1,0);else move(1,0)}});document.querySelectorAll("[data-action]").forEach((b)=>b.addEventListener("click",()=>{actions[b.dataset.action]();canvas.focus({preventScroll:true});}));
  $("start-game").addEventListener("click",()=>{show("stage");stageCards()});document.querySelectorAll("[data-back]").forEach((b)=>b.addEventListener("click",()=>show(b.dataset.back)));$("retry").addEventListener("click",()=>__wpReplayStart(() => startRoom(state.chapter,state.room)));$("next").addEventListener("click",()=>{const currentStage=(state.chapter-1)*ROOMS_PER_CHAPTER+state.room;if(!state.won||currentStage>=TOTAL_STAGES)return;const nextStage=currentStage+1;startRoom(Math.floor((nextStage-1)/ROOMS_PER_CHAPTER)+1,((nextStage-1)%ROOMS_PER_CHAPTER)+1);});$("to-stages").addEventListener("click",()=>{show("stage");stageCards()});$("stage-list").addEventListener("scroll",()=>window.requestAnimationFrame(syncFrostStageAvailability),{passive:true});window.addEventListener("resize",()=>window.requestAnimationFrame(syncFrostStageAvailability));updateProgress();stageCards();buildRoom();draw();

  function clearFlights(){for(const flight of activeFlights){for(const animation of flight.getAnimations())animation.cancel();flight.remove();}activeFlights.clear();}
  function collectFlight(point){
    if(state.screen!=='battle'||activeFlights.size>=6||!point)return;
    const host=$('battle-screen'),r=host.getBoundingClientRect(),to=$('rescue-meter').getBoundingClientRect(),scale=r.width/host.offsetWidth;
    const dot=document.createElement('i');dot.className='rescue-flight';dot.setAttribute('aria-hidden','true');
    dot.style.left=`${(point.x-r.left)/scale}px`;dot.style.top=`${(point.y-r.top)/scale}px`;host.append(dot);activeFlights.add(dot);
    const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animation=dot.animate(reduce?[{opacity:1},{opacity:0}]:[{transform:'translate(-50%,-50%) scale(1)',opacity:1},{transform:`translate(${(to.left+to.width*.6-point.x)/scale}px,${(to.top+to.height*.5-point.y)/scale}px) scale(.4)`,opacity:0}],{duration:reduce?100:320,easing:'cubic-bezier(.2,.7,.2,1)'});
    animation.finished.catch(()=>{}).finally(()=>{dot.remove();activeFlights.delete(dot);});
  }
  function renderNotice(kind) {
    state.renderBlocked=kind!=='ready';$('start-game').disabled=state.renderBlocked;
    let notice=$('frost-render-notice');
    if(!notice){notice=document.createElement('div');notice.id='frost-render-notice';notice.setAttribute('role','alert');const paragraph=document.createElement('p');notice.append(paragraph);const retry=document.createElement('button');retry.type='button';retry.addEventListener('click',()=>location.reload());notice.append(retry);}
    if(kind==='ready'){notice.hidden=true;return;}
    (state.screen==='battle'?$('battle-screen'):state.screen==='stage'?$('stage-screen'):$('main-screen')).append(notice);notice.hidden=false;notice.inert=false;
    notice.querySelector('p').textContent=coachText(kind==='lost'?'renderLost':'renderFailed');notice.querySelector('button').textContent=coachText('renderRetry');
    const panel=$('loadingPanel');if(panel){panel.hidden=true;panel.classList.add('hidden');}
  }
  import('/games/animal-frost-maze/vendor/three/three.module.min.js').then(T=>{
  /* FROST_REALTIME_ASSETS_START */
class FrostScene {
  constructor(canvas, onState) {
    this.canvas=canvas;this.onState=onState;this.disposed=false;this.hidden=false;this.last=0;this.stage=-1;
    this.geometries=new Set();this.materials=new Set();this.effects=[];this.berries=new Map();this.ice=new Map();
    this.renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'low-power'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.75));
    this.renderer.outputColorSpace=T.SRGBColorSpace;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=.96;
    this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=T.PCFSoftShadowMap;
    this.scene=new T.Scene();this.scene.background=new T.Color('#173f58');this.scene.fog=new T.Fog('#173f58',27,62);
    this.camera=new T.OrthographicCamera(-8,8,6,-6,.1,100);this.camera.position.set(6,14,12);this.camera.lookAt(0,0,0);
    this.scene.add(new T.HemisphereLight('#d4f8ff','#233d62',1.45));
    this.sun=new T.DirectionalLight('#ffe2b2',2.5);this.sun.position.set(-8,14,7);this.sun.castShadow=true;
    this.sun.shadow.mapSize.set(1024,1024);Object.assign(this.sun.shadow.camera,{left:-10,right:10,top:9,bottom:-9,near:.5,far:40});
    this.sun.shadow.normalBias=.035;this.sun.shadow.bias=-.0001;this.scene.add(this.sun);
    const rim=new T.DirectionalLight('#5dd7f2',1.2);rim.position.set(8,6,-8);this.scene.add(rim);
    this.box=this.ownGeometry(new T.BoxGeometry(1,1,1));
    this.palette={snow:this.mat('#e7f5f4'),snowShade:this.mat('#b9dbdf'),ice:this.mat('#42b8d8',.17,.25),iceDark:this.mat('#2686b0',.15,.32),iceBright:this.mat('#a8edee',.12,.25),deep:this.mat('#244c6a'),rock:this.mat('#2f6886'),water:this.mat('#0b536e',.2,.27),wood:this.mat('#725a49'),gold:this.mat('#f9bf5d'),berry:this.mat('#ed6d91'),leaf:this.mat('#427e72'),brown:this.mat('#91674f'),cream:this.mat('#f2d8af'),dark:this.mat('#182c3f'),teal:this.mat('#258c98'),goggle:this.mat('#77d5df',.2,.22),red:this.mat('#da6968')};
    this.world=new T.Group();this.scene.add(this.world);this.props=new T.Group();this.world.add(this.props);
    this.terrain=new T.Group();this.world.add(this.terrain);this.buildShelf();
    this.hero=this.buildNori();this.enemy=this.buildDrifter();this.world.add(this.hero,this.enemy);
    this.facing=this.buildMarker('#f8c966');this.facing.scale.setScalar(.82);for(const side of [-1,1]){const arrow=this.cube(this.facing,this.palette.gold,side*.09,.18,.02,.28,.045,.065,false);arrow.rotation.y=side*Math.PI/4;}this.heroMarker=this.buildMarker('#f8c966');this.enemyMarker=this.buildMarker('#ef6f89');this.world.add(this.facing,this.heroMarker,this.enemyMarker);
    this.routeGroup=new T.Group();this.world.add(this.routeGroup);this.routeKey='';
    this.home=this.buildCamp();this.home.position.set(-4.5,.08,2);this.world.add(this.home);
    this.resizeObserver=new ResizeObserver(()=>{this.resize();if(this.target)this.render(this.target);});this.active=false;
    this.onLost=e=>{e.preventDefault();this.lost=true;this.hidden=true;this.onState?.('lost');};
    this.onRestored=()=>{this.lost=false;this.hidden=!this.active||document.hidden;this.onState?.('ready');if(this.target)this.render(this.target);};
    canvas.addEventListener('webglcontextlost',this.onLost);canvas.addEventListener('webglcontextrestored',this.onRestored);
    canvas.dataset.renderBackend='three-r180';this.onState?.('ready');
  }
  ownGeometry(g){this.geometries.add(g);return g;}
  mat(color,metalness=0,roughness=.7){const m=new T.MeshStandardMaterial({color,metalness,roughness});this.materials.add(m);return m;}
  cube(parent,mat,x,y,z,w,h,d,shadow=true){const m=new T.Mesh(this.box,mat);m.position.set(x,y,z);m.scale.set(w,h,d);m.castShadow=shadow;m.receiveShadow=true;parent.add(m);return m;}
  batch(parent,mat,items){const m=new T.InstancedMesh(this.box,mat,items.length),dummy=new T.Object3D();for(let i=0;i<items.length;i++){const [x,y,z,w,h,d]=items[i];dummy.position.set(x,y,z);dummy.scale.set(w,h,d);dummy.updateMatrix();m.setMatrixAt(i,dummy.matrix);}m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  buildShelf(){
    const p=this.palette;
    this.cube(this.world,p.water,0,-1.25,0,70,.2,70,false);
    this.cube(this.world,p.deep,0,-.67,0,12.5,1.15,7.5);
    this.cube(this.world,p.iceDark,0,-.25,0,12.7,.45,7.65);
    this.cube(this.world,p.iceBright,0,-.09,0,12.8,.19,7.8);
    const tiles=[],edges=[];
    for(let y=0;y<7;y++)for(let x=0;x<12;x++)tiles.push([x-5.5,.045,y-3,.976,.15,.976]);
    this.batch(this.world,p.snow,tiles);
    for(let i=0;i<26;i++){const x=-6.35+(i%13)*1.06,z=i<13?-3.87:3.87;edges.push([x,-.21-(i%3)*.09,z,.62,.55,.21]);}
    this.batch(this.world,p.snowShade,edges);
    const floes=[],rock=[],peaks=[];
    for(let i=0;i<16;i++){const x=Math.sin(i*4.19)*13,z=Math.cos(i*2.13)*9;if(Math.abs(x)<7&&Math.abs(z)<4.4)continue;floes.push([x,-.94,z,1.3+(i%3)*.45,.16,.8+(i%4)*.23]);}
    this.batch(this.props,p.iceBright,floes);
    for(let i=0;i<8;i++){const x=-14+i*4,z=-9-(i%3),h=2+(i%3)*1.3;rock.push([x,h*.25-1,z,4,h,3]);peaks.push([x-.15,h*.64-1,z,2.1,h*.55,2.2]);}
    this.batch(this.props,p.rock,rock);this.batch(this.props,p.snowShade,peaks);
    for(const [x,z,size] of [[-7.2,-3.9,.9],[7,-3.5,1.1],[-7.4,2.2,.7],[7.3,3.1,.8]])this.tree(x,z,size);
    const ripples=[];for(let i=0;i<27;i++){const x=Math.sin(i*3.4)*11,z=Math.cos(i*1.7)*7;if(Math.abs(x)<6.6&&Math.abs(z)<4.1)continue;ripples.push([x,-1.12,z,.8+(i%3)*.23,.01,.025]);}this.batch(this.props,p.iceDark,ripples);
    const lamps=[[-6.3,3.5],[6.3,-3.4]];
    for(const [x,z]of lamps){this.cube(this.props,p.wood,x,.44,z,.12,1,.12);this.cube(this.props,p.gold,x,.96,z,.25,.25,.25);this.cube(this.props,p.snow,x,1.12,z,.36,.08,.36);}
    // Authored edge rails indicate the finite playable island without adding cells.
    const posts=[];for(let x=-5.9;x<=6;x+=1.4){posts.push([x,.15,-3.65,.09,.43,.09]);posts.push([x,.15,3.65,.09,.43,.09]);}
    this.batch(this.props,p.wood,posts);
  }
  tree(x,z,s){this.cube(this.props,this.palette.iceDark,x,-.88,z,1.9*s,.85,1.6*s);this.cube(this.props,this.palette.snowShade,x,-.44,z,2*s,.12,1.7*s);const g=new T.Group();g.position.set(x,-.45,z);g.scale.setScalar(s);const p=this.palette;this.cube(g,p.wood,0,.42,0,.22,.9,.22);for(let i=0;i<3;i++){const w=1.4-i*.35;this.cube(g,p.teal,0,.9+i*.45,0,w,.48,w);this.cube(g,p.snow,0,1.16+i*.45,0,w+.03,.1,w+.03);}this.props.add(g);}
  buildNori(){
    const g=new T.Group(),p=this.palette;g.userData.kind='nori';
    // Square-headed otter explorer: signature goggles, fin sleeves, cream box muzzle, toolkit bubbles.
    this.cube(g,p.teal,0,.46,0,.49,.51,.36);this.cube(g,p.brown,0,.87,0,.56,.49,.47);
    this.cube(g,p.brown,-.23,1.12,.03,.17,.17,.16);this.cube(g,p.brown,.23,1.12,.03,.17,.17,.16);
    this.cube(g,p.cream,0,.8,.272,.36,.22,.15);this.cube(g,p.dark,0,.87,.36,.10,.065,.06);
    this.cube(g,p.wood,0,1,.255,.59,.16,.09);for(const x of [-.16,.16]){this.cube(g,p.gold,x,1,.32,.23,.20,.06);this.cube(g,p.goggle,x,1,.361,.16,.13,.025);this.cube(g,p.dark,x,.92,.26,.055,.07,.025);}
    this.cube(g,p.gold,0,.64,.22,.44,.10,.08);this.cube(g,p.gold,-.24,.45,.22,.07,.13,.06);this.cube(g,p.gold,.24,.45,.22,.07,.13,.06);this.cube(g,p.teal,.30,.61,-.06,.12,.15,.25);
    this.cube(g,p.wood,0,.47,-.25,.29,.34,.16);this.cube(g,p.gold,0,.54,-.35,.13,.05,.04);
    this.cube(g,p.brown,0,.2,-.28,.24,.16,.36);
    const arms=[],feet=[];for(const x of [-1,1]){const a=new T.Group();a.position.set(x*.32,.55,0);this.cube(a,p.teal,0,0,0,.19,.28,.29);this.cube(a,p.cream,0,-.15,.02,.17,.12,.23);g.add(a);arms.push(a);const f=this.cube(g,p.dark,x*.17,.15,.07,.21,.22,.32);feet.push(f);}
    g.userData.arms=arms;g.userData.feet=feet;g.userData.heading=0;g.scale.setScalar(1.16);return g;
  }
  buildDrifter(){
    const g=new T.Group(),p=this.palette;g.userData.kind='drifter';
    this.cube(g,p.snowShade,0,.45,0,.65,.51,.63);this.cube(g,p.snow,0,.85,0,.68,.50,.55);
    this.cube(g,p.snowShade,-.28,1.12,0,.23,.19,.20);this.cube(g,p.snowShade,.28,1.12,0,.23,.19,.20);
    this.cube(g,p.iceDark,0,.78,.31,.41,.19,.10);
    this.cube(g,p.dark,-.19,.94,.29,.09,.08,.025);this.cube(g,p.dark,.19,.94,.29,.09,.08,.025);
    this.cube(g,p.red,-.19,1,.31,.14,.04,.03);this.cube(g,p.red,.19,1,.31,.14,.04,.03);
    for(const x of [-1,1]){this.cube(g,p.iceBright,x*.42,.48,0,.22,.47,.26);this.cube(g,p.iceDark,x*.20,.16,.05,.25,.22,.34);}
    this.cube(g,p.iceBright,0,1.18,-.04,.18,.24,.19);g.scale.setScalar(.98);
    return g;
  }
  buildIce(){const g=new T.Group(),p=this.palette;this.cube(g,p.iceDark,0,.3,0,.88,.60,.88);this.cube(g,p.ice,0,.55,-.02,.84,.56,.80);this.cube(g,p.iceBright,-.19,.61,.41,.16,.42,.035);this.cube(g,p.iceBright,0,.87,0,.90,.10,.86);this.cube(g,p.snow,-.18,.94,-.17,.46,.07,.45);this.cube(g,p.ice,.22,.94,.20,.38,.07,.30);this.cube(g,p.iceDark,-.26,.68,.435,.035,.20,.02);this.cube(g,p.iceDark,-.16,.72,.435,.20,.025,.02);return g;}
  buildBerry(){const g=new T.Group(),p=this.palette;this.cube(g,p.berry,-.11,.30,0,.29,.31,.28);this.cube(g,p.berry,.12,.33,-.02,.28,.33,.27);this.cube(g,p.cream,-.17,.41,.15,.06,.09,.015);this.cube(g,p.gold,0,.42,.13,.07,.08,.035);this.cube(g,p.leaf,.02,.48,0,.11,.13,.09);this.cube(g,p.leaf,.14,.48,0,.16,.06,.10);return g;}
  buildCamp(){const g=new T.Group(),p=this.palette;this.cube(g,p.gold,0,.015,0,.88,.035,.88,false);this.cube(g,p.wood,-.37,.15,-.35,.10,.30,.10);this.cube(g,p.wood,.37,.15,-.35,.10,.30,.10);this.cube(g,p.gold,-.37,.34,-.35,.14,.15,.14);this.cube(g,p.gold,.37,.34,-.35,.14,.15,.14);this.cube(g,p.teal,0,.50,-.38,.39,.37,.09);this.cube(g,p.snow,0,.50,-.32,.08,.23,.025);this.cube(g,p.snow,0,.50,-.31,.24,.075,.025);this.cube(g,p.gold,0,.73,-.38,.46,.07,.16);return g;}
  buildMarker(color){const g=new T.Group(),m=this.mat(color,.1,.4);for(const [x,z,w,d]of [[0,-.43,.86,.045],[0,.43,.86,.045],[-.43,0,.045,.86],[.43,0,.045,.86]])this.cube(g,m,x,.14,z,w,.035,d,false);return g;}
  screenPoint(position){const v=new T.Vector3(position.x,.5,position.z).project(this.camera),r=this.canvas.getBoundingClientRect();return{x:r.left+(v.x+1)*r.width/2,y:r.top+(1-v.y)*r.height/2};}
  position(object,p){object.position.x=p.x-5.5;object.position.z=p.y-3;}
  setActive(on){this.active=on;this.hidden=!on||this.lost||document.hidden;if(on){this.resizeObserver.observe(this.canvas);this.resize();}else {this.resizeObserver.disconnect();for(const e of this.effects)this.remove(e.g);this.effects=[];}this.last=0;}
  resize(){const r=this.canvas.getBoundingClientRect();if(r.width<2||r.height<2)return;const w=Math.round(r.width),h=Math.round(r.height);this.renderer.setSize(w,h,false);const aspect=w/h;const width=Math.max(15.4,10.2*aspect),height=width/aspect;this.camera.left=-width/2;this.camera.right=width/2;this.camera.top=height/2;this.camera.bottom=-height/2;this.camera.updateProjectionMatrix();}
  remove(group){group?.removeFromParent();}
  sync(state){
    if(this.stage!==state.stage){this.stage=state.stage;for(const o of this.ice.values())this.remove(o);for(const o of this.berries.values())this.remove(o);this.ice.clear();this.berries.clear();for(const e of this.effects)this.remove(e.g);this.effects=[];this.position(this.hero,state.player);this.position(this.enemy,state.enemy);this.routeKey='';}
    const wallSet=new Set(state.walls),fruitSet=new Set(state.fruits);
    for(const [key,o]of this.ice)if(!wallSet.has(key)){this.burst(o.position,0xa4f6ff);this.remove(o);this.ice.delete(key);}
    for(const key of wallSet)if(!this.ice.has(key)){const[x,y]=key.split(',').map(Number),o=this.buildIce();o.userData.born=performance.now();this.position(o,{x,y});this.terrain.add(o);this.ice.set(key,o);}
    for(const[key,o]of this.berries)if(!fruitSet.has(key)){this.onCollect?.(this.screenPoint(o.position));this.burst(o.position,0xffafc5);this.remove(o);this.berries.delete(key);}
    for(const key of fruitSet)if(!this.berries.has(key)){const[x,y]=key.split(',').map(Number),o=this.buildBerry();o.userData.born=performance.now();this.position(o,{x,y});this.terrain.add(o);this.berries.set(key,o);}
    const routeKey=JSON.stringify(state.route||[]);if(routeKey!==this.routeKey){this.routeKey=routeKey;while(this.routeGroup.children.length)this.routeGroup.remove(this.routeGroup.children[0]);for(const p of state.route||[]){const mark=new T.Mesh(this.box,this.palette.gold);mark.position.set(p.x-5.5,.16,p.y-3);mark.scale.set(.12,.04,.12);this.routeGroup.add(mark);}}
    this.home.visible=!!state.home;const fx=state.player.x+state.facing.x,fy=state.player.y+state.facing.y;this.facing.visible=fx>=0&&fx<12&&fy>=0&&fy<7;this.facing.rotation.y=Math.atan2(state.facing.x,state.facing.y);this.position(this.facing,{x:fx,y:fy});this.position(this.heroMarker,state.player);this.position(this.enemyMarker,state.enemy);
    this.target=state;
  }
  burst(position,color){if(this.effects.length>=24)return;const g=new T.Group();g.position.copy(position);for(let i=0;i<5;i++){const mesh=new T.Mesh(this.box,color===0xffafc5?this.palette.berry:this.palette.iceBright);mesh.scale.setScalar(.08);mesh.position.set(Math.cos(i*2.4)*.1,.35,Math.sin(i*2.4)*.1);g.add(mesh);}this.world.add(g);this.effects.push({g,age:0});}
  render(state,now=performance.now()){
    if(this.disposed||this.hidden)return;this.sync(state);const dt=Math.min(.05,(now-this.last)/1000||.016);this.last=now;
    const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    for(const [o,p]of [[this.hero,state.player],[this.enemy,state.enemy]]){const x=p.x-5.5,z=p.y-3,dist=Math.hypot(o.position.x-x,o.position.z-z),a=reduce||dist>1.05?1:1-Math.exp(-dt*19);o.position.x+=(x-o.position.x)*a;o.position.z+=(z-o.position.z)*a;o.position.y=reduce?0:Math.min(.07,dist*.10)*Math.sin(now*.027);if(o===this.hero){const heading=Math.atan2(state.facing.x,state.facing.y);o.rotation.y=heading;for(let i=0;i<o.userData.arms.length;i++)o.userData.arms[i].rotation.x=reduce?0:Math.sin(now*.024+i*Math.PI)*Math.min(.25,dist*.7);}}
    for(const o of [...this.ice.values(),...this.berries.values()]){const t=reduce?1:Math.min(1,(now-(o.userData.born||0))/180);o.scale.y=Math.max(.01,t);}
    for(const e of this.effects){e.age+=dt;const t=e.age/.48;for(let i=0;i<e.g.children.length;i++){const m=e.g.children[i];m.position.y=.3+(reduce?0:t*(1.2-i*.08));m.position.x=Math.cos(i*2.4)*(.1+t*.35);m.position.z=Math.sin(i*2.4)*(.1+t*.35);m.scale.setScalar(Math.max(.001,.09*(1-t)));}}
    this.effects=this.effects.filter(e=>{if(e.age>=.48){this.remove(e.g);return false;}return true;});
    this.renderer.render(this.scene,this.camera);
    this.canvas.dataset.drawCalls=String(this.renderer.info.render.calls);this.canvas.dataset.triangles=String(this.renderer.info.render.triangles);
    this.canvas.dataset.geometries=String(this.renderer.info.memory.geometries);this.canvas.dataset.textures=String(this.renderer.info.memory.textures);
  }
  dispose(){if(this.disposed)return;this.disposed=true;this.resizeObserver.disconnect();this.canvas.removeEventListener('webglcontextlost',this.onLost);this.canvas.removeEventListener('webglcontextrestored',this.onRestored);this.scene.clear();for(const g of this.geometries)g.dispose();for(const m of this.materials)m.dispose();this.renderer.dispose();}
}

  /* FROST_REALTIME_ASSETS_END */
    try {frostScene=new FrostScene(canvas,renderNotice);frostScene.onCollect=collectFlight;frostScene.setActive(state.screen==='battle'||state.screen==='result');$('start-game').disabled=false;draw();}
    catch(error){renderNotice('failed');console.error('FROST_RENDERER_INIT_FAILED',error.message);}
  }).catch(error=>{renderNotice('failed');console.error('FROST_ENGINE_LOAD_FAILED',error.message);});
  window.addEventListener('visibilitychange',()=>{if(frostScene){frostScene.hidden=document.hidden||state.renderBlocked||!frostScene.active;frostScene.last=0;}});
  window.addEventListener('pagehide',event=>{if(event.persisted){if(frostScene)frostScene.hidden=true;}else {clearFlights();frostScene?.dispose();}});
  window.addEventListener('pageshow',event=>{if(event.persisted&&frostScene){frostScene.hidden=false;frostScene.last=0;draw();}});
})();
