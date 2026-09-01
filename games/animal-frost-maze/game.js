/* Internal prototype only. Grid art is temporary until the art gate. */
(() => {
  const $ = (id) => document.getElementById(id);
  const loadingPanel = $("loadingPanel");
  if (loadingPanel) {
    const hideLoading = () => { loadingPanel.hidden = true; loadingPanel.classList.add("hidden"); };
    if (document.readyState === "complete") hideLoading();
    else window.addEventListener("load", hideLoading, { once: true });
  }
  const canvas = $("arena");
  const ctx = canvas.getContext("2d");
  const cols = 12, rows = 7, cell = 72;
  const heroArt = new Image(); heroArt.src = "assets/animal-frost-maze-original-assets-v1.png";
  const drifterArt = heroArt;
  const berryArt = heroArt;
  const propArt = new Image(); propArt.src = "assets/animal-frost-maze-props.png";
  const ROOMS_PER_CHAPTER = 5;
  const TOTAL_STAGES = 30;
  const CHAPTER_COUNT = Math.ceil(TOTAL_STAGES / ROOMS_PER_CHAPTER);
  const state = { screen: "main", chapter: 1, room: 1, best: Number(localStorage.getItem("wp-frost-best") || 0), player: null, enemy: null, walls: new Set(), fruits: new Set(), facing: { x: 1, y: 0 }, moves: 0, ticks: 0, raf: 0 };
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
  const FROST_SETTINGS_COPY = {
    en: "Settings", "zh-tw": "設定", "zh-cn": "设置", ja: "設定", ko: "설정",
    es: "Configuración", "pt-br": "Configurações", fr: "Paramètres", de: "Einstellungen",
    it: "Impostazioni", ru: "Настройки", hi: "सेटिंग्स", ar: "الإعدادات",
  };
  const frostSettingsText = () => FROST_SETTINGS_COPY[frostLocale()] || FROST_SETTINGS_COPY.en;
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
  const frostChapterName = (chapter, copy = frostStageText()) => copy.chapters[chapter - 1] || `${copy.chapter} ${chapter}`;
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
      $("arena")?.setAttribute("aria-label", frostText("canvas"));
      const battleUtility = $("battle-utility");
      if (battleUtility) {
        const settingsLabel = frostSettingsText();
        battleUtility.setAttribute("aria-label", settingsLabel);
        battleUtility.title = settingsLabel;
      }
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
  function show(name){state.screen=name;document.body.dataset.screen=name==="result"?"battle":name;cancelAnimationFrame(state.raf);const result=document.querySelector("#result-screen");document.querySelectorAll(".screen").forEach((el)=>{const isResult=el===result&&name==="result";const keepBattle=name==="result"&&el.id==="battle-screen";const on=isResult||keepBattle||el.dataset.screen===name;el.hidden=!on;el.classList.toggle("active",on)});if(name==="battle")result?.setAttribute("hidden","");if(name==="stage")window.requestAnimationFrame(syncFrostStageAvailability);if(name==="battle")state.raf=requestAnimationFrame(frame);}
  function stageCards(){const copy=frostStageText();const stageLabel=frostStageLabel();const roomLabel=frostRoomLabel();const cards=Array.from({length:TOTAL_STAGES},(_,index)=>{const stage=index+1;const chapter=Math.floor(index/ROOMS_PER_CHAPTER)+1;const room=index%ROOMS_PER_CHAPTER+1;const chapterName=frostChapterName(chapter,copy);const label=`${stageLabel} ${stage}: ${copy.chapter} ${chapter}${copy.chapterSuffix || ""}, ${roomLabel} ${room}`;return `<button type="button" class="stage-card" data-wp-stage-card data-wp-enter-battle data-stage-index="${stage}" data-chapter="${chapter}" data-room="${room}" aria-label="${label}"><strong>${stageLabel} ${stage}</strong><span>${chapterName} · ${roomLabel} ${room}</span><small>${copy.chapter} ${chapter}${copy.chapterSuffix || ""}</small></button>`;}).join("");$("stage-list").innerHTML=cards;$("stage-list").querySelectorAll("button").forEach((b)=>b.addEventListener("click",()=>startRoom(Number(b.dataset.chapter),Number(b.dataset.room))));syncFrostStageAvailability();}
  function layoutFor(chapter, room) { const variant=(chapter-1)*ROOMS_PER_CHAPTER+room-1; const walls=new Set([key(3,1),key(3,2),key(3,3),key(5,3),key(6,3),key(8,2),key(8,3),key(8,4),key(4,5),key(5,5),key(7,5)]); const variants=[[2,2],[4,1],[6,4],[9,5],[2,5],[7,1],[9,2],[5,1]]; const extra=variants[variant%variants.length]; walls.add(key(extra[0],extra[1])); if(chapter>=2)walls.add(key(6,1)); if(chapter>=3)walls.add(key(9,4)); if(chapter>=4)walls.add(key(1,2)); const candidates=[[2,1],[5,1],[7,2],[10,4],[2,4],[6,6],[9,6],[10,1],[1,1]]; const fruits=new Set(); candidates.forEach(([x,y],i)=>{if(!walls.has(key(x,y))&&i<5+(variant%3))fruits.add(key(x,y));}); return {walls,fruits,enemy:{x:10-(variant%3),y:1+(variant%2)}}; }
  function buildRoom(){window.clearTimeout(state.finishTimer);state.finishTimer=0;const layout=layoutFor(state.chapter,state.room);state.player={x:1,y:5};state.enemy=layout.enemy;state.facing={x:1,y:0};state.moves=0;state.ticks=0;state.walls=layout.walls;state.fruits=layout.fruits;$(`room-label`).textContent=`${frostStageText().chapter} ${state.chapter} · ${frostRoomLabel()} ${state.room} / ${ROOMS_PER_CHAPTER}`;setBattleStatus("controls");updateLabels();}
  function startRoom(chapter=1,room=1){state.chapter=chapter;state.room=room;buildRoom();show("battle");}
  function updateLabels(){$("fruit-label").textContent=`Berries ${state.fruits.size}`;}
  function updateProgress(){const value=`Best rooms: ${state.best}`;$("main-progress").textContent=window.wpFiveText?window.wpFiveText(value):value;}
  function canMove(x,y){return x>=0&&x<cols&&y>=0&&y<rows&&!state.walls.has(key(x,y));}
  function move(dx,dy){if(state.screen!=="battle")return;state.facing={x:dx,y:dy};const nx=state.player.x+dx,ny=state.player.y+dy;if(canMove(nx,ny)){state.player.x=nx;state.player.y=ny;const collected=state.fruits.delete(key(nx,ny));if(collected){notifyAnalytics("berry_collected",{remaining_berries:state.fruits.size,collected_count:5-state.fruits.size});setBattleStatus(state.fruits.size===0?"berryClear":"berry");}notifyAnalytics("first_move",{action:`move_${dx}_${dy}`});updateLabels();if(state.fruits.size===0){const delay=window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches?0:360;state.finishTimer=window.setTimeout(()=>finish(true),delay);return;}state.moves+=1;if(state.moves%8===0)enemyStep();}else setBattleStatus("wallAhead");}
  function breakIce(){const p=state.player,nx=p.x+state.facing.x,ny=p.y+state.facing.y;if(state.walls.delete(key(nx,ny))){setBattleStatus("cracked");notifyAnalytics("first_edit",{action:"break"});}else setBattleStatus("noBreak");}
  function buildIce(){const p=state.player,nx=p.x+state.facing.x,ny=p.y+state.facing.y;if(nx>0&&nx<cols-1&&ny>0&&ny<rows-1&&!state.walls.has(key(nx,ny))&&!state.fruits.has(key(nx,ny))&&!(state.enemy.x===nx&&state.enemy.y===ny)){setBattleStatus("built");state.walls.add(key(nx,ny));notifyAnalytics("first_edit",{action:"build"});}else setBattleStatus("noBuild");}
  function enemyStep(){const e=state.enemy,p=state.player;const options=[];if(Math.abs(p.x-e.x)>=Math.abs(p.y-e.y))options.push([Math.sign(p.x-e.x),0],[0,Math.sign(p.y-e.y)]);else options.push([0,Math.sign(p.y-e.y)],[Math.sign(p.x-e.x),0]);for(const [dx,dy] of options){if(canMove(e.x+dx,e.y+dy)){e.x+=dx;e.y+=dy;break;}}if(e.x===p.x&&e.y===p.y)finish(false);}
  function finish(win){window.clearTimeout(state.finishTimer);state.finishTimer=0;const currentStage=(state.chapter-1)*ROOMS_PER_CHAPTER+state.room;if(win){state.best=Math.max(state.best,currentStage);localStorage.setItem("wp-frost-best",String(state.best));updateProgress();}$("result-title").textContent=win?"Room clear":"Route blocked";$("result-copy").textContent=win?`All berries recovered in chapter ${state.chapter}, room ${state.room}.`:`The ice route needs another attempt.`;$("next").textContent=currentStage>=TOTAL_STAGES?"Replay Chapter":"Next Room";show("result");}
  function draw(){ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle="#061b2c";ctx.fillRect(0,0,canvas.width,canvas.height);for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){ctx.strokeStyle="#174c68";ctx.strokeRect(x*cell,y*cell,cell,cell);if(state.walls.has(key(x,y))){ctx.fillStyle="#6dd4e8";ctx.fillRect(x*cell+6,y*cell+6,cell-12,cell-12);ctx.fillStyle="#c8f7ff";ctx.fillRect(x*cell+18,y*cell+18,cell-36,5);if(propArt.complete&&propArt.naturalWidth)ctx.drawImage(propArt,0,0,500,650,x*cell+7,y*cell+5,cell-14,cell-10);}}state.fruits.forEach((v)=>{const [x,y]=v.split(",").map(Number);if(propArt.complete&&propArt.naturalWidth)ctx.drawImage(propArt,480,0,350,600,x*cell+12,y*cell+12,48,48);else if(berryArt.complete&&berryArt.naturalWidth)ctx.drawImage(berryArt,625,5,310,340,x*cell+12,y*cell+12,48,48);else{ctx.fillStyle="#ff8198";ctx.beginPath();ctx.arc(x*cell+36,y*cell+36,15,0,Math.PI*2);ctx.fill();ctx.fillStyle="#ffd36b";ctx.fillRect(x*cell+30,y*cell+17,12,7);}});actor(state.enemy,drifterArt,"#d8f2ff","#176079",[25,760,570,500]);actor(state.player,heroArt,"#ffd36b","#24465b",[10,5,600,780]);ctx.fillStyle="#c5e0ea";ctx.font="bold 17px system-ui";ctx.fillText(text("BREAK THE ICE"),18,28);}
  function actor(o,art,body,ink,crop){ctx.save();ctx.translate(o.x*cell+36,o.y*cell+36);if(art.complete&&art.naturalWidth)ctx.drawImage(art,crop[0],crop[1],crop[2],crop[3],-28,-28,56,56);else{ctx.fillStyle=body;ctx.beginPath();ctx.arc(0,0,22,0,Math.PI*2);ctx.fill();ctx.fillStyle=ink;ctx.fillRect(-13,-5,26,8);ctx.fillRect(-9,10,18,7);}ctx.restore();}
  // Localized Result transaction overrides the prototype fallback above while
  // preserving the existing finish/show flow.
  function finish(win){window.clearTimeout(state.finishTimer);state.finishTimer=0;const currentStage=(state.chapter-1)*ROOMS_PER_CHAPTER+state.room;if(win){state.best=Math.max(state.best,currentStage);localStorage.setItem("wp-frost-best",String(state.best));updateProgress();}$("result-title").textContent=frostResultText(win?"winTitle":"loseTitle");$("result-copy").textContent=frostResultText(win?"winCopy":"loseCopy");$("to-stages").textContent=frostResultText("stages");$("next").textContent=frostResultText(currentStage>=TOTAL_STAGES?"replay":"next");$("retry").textContent=frostResultText("retry");show("result");}
  function frame(){if(state.screen!=="battle")return;state.ticks++;draw();state.raf=requestAnimationFrame(frame);}
  const actions={up:()=>move(0,-1),down:()=>move(0,1),left:()=>move(-1,0),right:()=>move(1,0),break:breakIce,build:buildIce};
  window.addEventListener("keydown",(e)=>{const k=e.code;if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","KeyW","KeyA","KeyS","KeyD","Space","KeyF"].includes(k)){e.preventDefault();if(k==="Space")breakIce();else if(k==="KeyF")buildIce();else if(k==="ArrowUp"||k==="KeyW")move(0,-1);else if(k==="ArrowDown"||k==="KeyS")move(0,1);else if(k==="ArrowLeft"||k==="KeyA")move(-1,0);else move(1,0)}});document.querySelectorAll("[data-action]").forEach((b)=>b.addEventListener("pointerdown",()=>actions[b.dataset.action]()));
  $("start-game").addEventListener("click",()=>{show("stage");stageCards()});document.querySelectorAll("[data-back]").forEach((b)=>b.addEventListener("click",()=>show(b.dataset.back)));$("retry").addEventListener("click",()=>startRoom(state.chapter,state.room));$("next").addEventListener("click",()=>{const currentStage=(state.chapter-1)*ROOMS_PER_CHAPTER+state.room;const nextStage=currentStage>=TOTAL_STAGES?1:currentStage+1;startRoom(Math.floor((nextStage-1)/ROOMS_PER_CHAPTER)+1,((nextStage-1)%ROOMS_PER_CHAPTER)+1);});$("to-stages").addEventListener("click",()=>{show("stage");stageCards()});$("stage-list").addEventListener("scroll",()=>window.requestAnimationFrame(syncFrostStageAvailability),{passive:true});window.addEventListener("resize",()=>window.requestAnimationFrame(syncFrostStageAvailability));updateProgress();stageCards();buildRoom();draw();
})();
