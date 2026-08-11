(() => {
  const memoryStorage = new Map();
  function readStorage(key) {
    try { return localStorage.getItem(key); } catch { return memoryStorage.get(key) || null; }
  }
  function writeStorage(key, value) {
    memoryStorage.set(key, value);
    try { localStorage.setItem(key, value); } catch {}
  }
  const common = {
    en: {
      close: "Start Playing",
      closeAria: "Close tutorial",
      aria: "How to play",
      lobbyAria: "Back to lobby",
    },
    "zh-Hant": {
      close: "\u958b\u59cb\u904a\u73a9",
      closeAria: "\u95dc\u9589\u6559\u5b78",
      aria: "\u73a9\u6cd5\u8aaa\u660e",
      lobbyAria: "\u8fd4\u56de\u5927\u5ef3",
    },
    "zh-Hans": { close: "开始游戏", closeAria: "关闭教学", aria: "玩法说明", lobbyAria: "返回大厅" },
    ja: { close: "プレイ開始", closeAria: "チュートリアルを閉じる", aria: "遊び方", lobbyAria: "ロビーに戻る" },
    ko: { close: "플레이 시작", closeAria: "튜토리얼 닫기", aria: "플레이 방법", lobbyAria: "로비로 돌아가기" },
    es: { close: "Empezar a jugar", closeAria: "Cerrar tutorial", aria: "Cómo jugar", lobbyAria: "Volver al vestíbulo" },
    "pt-BR": { close: "Começar a jogar", closeAria: "Fechar tutorial", aria: "Como jogar", lobbyAria: "Voltar ao lobby" },
    fr: { close: "Commencer", closeAria: "Fermer le tutoriel", aria: "Comment jouer", lobbyAria: "Retour au lobby" },
    de: { close: "Spielen", closeAria: "Tutorial schließen", aria: "Spielanleitung", lobbyAria: "Zur Lobby" },
    it: { close: "Inizia a giocare", closeAria: "Chiudi tutorial", aria: "Come giocare", lobbyAria: "Torna alla lobby" },
    ru: { close: "Начать игру", closeAria: "Закрыть обучение", aria: "Как играть", lobbyAria: "Вернуться в лобби" },
    hi: { close: "खेलना शुरू करें", closeAria: "ट्यूटोरियल बंद करें", aria: "कैसे खेलें", lobbyAria: "लॉबी में वापस जाएँ" },
    ar: { close: "ابدأ اللعب", closeAria: "إغلاق التعليمات", aria: "طريقة اللعب", lobbyAria: "العودة إلى الردهة" },
  };

  const classicLocales = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const classicNames = {
    freecell: { en: "FreeCell", "zh-Hant": "FreeCell", "zh-Hans": "FreeCell", ja: "フリーセル", ko: "프리셀", es: "FreeCell", "pt-BR": "FreeCell", fr: "FreeCell", de: "FreeCell", it: "FreeCell", ru: "FreeCell", hi: "फ्रीसेल", ar: "فري سيل" },
    pyramid: { en: "Pyramid", "zh-Hant": "金字塔", "zh-Hans": "金字塔", ja: "ピラミッド", ko: "피라미드", es: "Pirámide", "pt-BR": "Pirâmide", fr: "Pyramide", de: "Pyramide", it: "Piramide", ru: "Пирамида", hi: "पिरामिड", ar: "الهرم" },
    tripeaks: { en: "TriPeaks", "zh-Hant": "三峰", "zh-Hans": "三峰", ja: "トライピークス", ko: "트라이픽스", es: "TriPeaks", "pt-BR": "TriPeaks", fr: "TriPeaks", de: "TriPeaks", it: "TriPeaks", ru: "Три Пика", hi: "ट्राईपीक्स", ar: "القمم الثلاث" },
    golf: { en: "Golf", "zh-Hant": "高爾夫", "zh-Hans": "高尔夫", ja: "ゴルフ", ko: "골프", es: "Golf", "pt-BR": "Golf", fr: "Golf", de: "Golf", it: "Golf", ru: "Гольф", hi: "गोल्फ", ar: "الغولف" },
    yukon: { en: "Yukon", "zh-Hant": "育空", "zh-Hans": "育空", ja: "ユーコン", ko: "유콘", es: "Yukon", "pt-BR": "Yukon", fr: "Yukon", de: "Yukon", it: "Yukon", ru: "Юкон", hi: "युकोन", ar: "يوكون" },
  };
  const classicTutorialCopy = {
    en: { suffix: "first moves", choose: "Find a legal card", chooseText: "The highlighted face-up cards are ready for your next decision.", action: "Tap or drag to play", actionText: "Tap a card and its destination, or drag it on desktop.", finish: "Use your helpers", finishText: "Hint suggests one move, Undo rewinds it, and Restart keeps the same deal." },
    "zh-Hant": { suffix: "開始三步", choose: "找出合法牌", chooseText: "高亮的正面牌就是下一步可選的牌。", action: "點按或拖曳出牌", actionText: "點按牌與目的地，桌面版也能直接拖曳。", finish: "使用輔助功能", finishText: "提示會建議一步，還原可以回退，重新開始會保留同一副牌。" },
    "zh-Hans": { suffix: "开始三步", choose: "找出合法牌", chooseText: "高亮的正面牌就是下一步可选的牌。", action: "点按或拖曳出牌", actionText: "点按牌与目的地，桌面版也能直接拖曳。", finish: "使用辅助功能", finishText: "提示会建议一步，撤销可以回退，重新开始会保留同一副牌。" },
    ja: { suffix: "最初の3手", choose: "合法なカードを探す", chooseText: "ハイライトされた表向きのカードが次に選べます。", action: "タップまたはドラッグ", actionText: "カードと移動先をタップするか、デスクトップではドラッグします。", finish: "ヘルパーを使う", finishText: "ヒントは1手を示し、元に戻すは巻き戻し、リスタートは同じ配りを保ちます。" },
    ko: { suffix: "첫 세 수", choose: "가능한 카드 찾기", chooseText: "강조된 앞면 카드가 다음에 선택할 수 있는 카드입니다.", action: "탭하거나 드래그하기", actionText: "카드와 목적지를 탭하거나 데스크톱에서 드래그하세요.", finish: "도움말 사용하기", finishText: "힌트는 한 수를 제안하고 실행 취소는 되돌리며 재시작은 같은 딜을 유지합니다." },
    es: { suffix: "primeros movimientos", choose: "Busca una carta legal", chooseText: "Las cartas descubiertas resaltadas están listas para tu siguiente decisión.", action: "Toca o arrastra para jugar", actionText: "Toca una carta y su destino, o arrástrala en escritorio.", finish: "Usa tus ayudas", finishText: "Pista sugiere un movimiento, Deshacer lo revierte y Reiniciar conserva la partida." },
    "pt-BR": { suffix: "primeiros movimentos", choose: "Encontre uma carta válida", chooseText: "As cartas viradas para cima destacadas estão prontas para sua próxima decisão.", action: "Toque ou arraste para jogar", actionText: "Toque na carta e no destino, ou arraste no computador.", finish: "Use seus auxiliares", finishText: "Dica sugere uma jogada, Desfazer volta atrás e Reiniciar mantém a mesma partida." },
    fr: { suffix: "premiers coups", choose: "Trouvez une carte légale", chooseText: "Les cartes visibles mises en évidence sont prêtes pour votre prochaine décision.", action: "Touchez ou glissez pour jouer", actionText: "Touchez une carte et sa destination, ou glissez-la sur ordinateur.", finish: "Utilisez les aides", finishText: "Indice propose un coup, Annuler le défait et Redémarrer garde la même donne." },
    de: { suffix: "erste Züge", choose: "Finde eine legale Karte", chooseText: "Hervorgehobene offene Karten sind für deine nächste Entscheidung bereit.", action: "Tippen oder ziehen", actionText: "Tippe Karte und Ziel an oder ziehe sie am Desktop.", finish: "Nutze die Helfer", finishText: "Tipp schlägt einen Zug vor, Rückgängig macht ihn zurück und Neustart behält das gleiche Blatt." },
    it: { suffix: "prime mosse", choose: "Trova una carta valida", chooseText: "Le carte scoperte evidenziate sono pronte per la prossima decisione.", action: "Tocca o trascina per giocare", actionText: "Tocca una carta e la destinazione, oppure trascinala sul desktop.", finish: "Usa gli aiuti", finishText: "Suggerimento propone una mossa, Annulla la riavvolge e Riavvia conserva la stessa mano." },
    ru: { suffix: "первых ходов", choose: "Найдите допустимую карту", chooseText: "Выделенные открытые карты готовы для следующего решения.", action: "Нажмите или перетащите", actionText: "Нажмите карту и место назначения или перетащите её на компьютере.", finish: "Используйте подсказки", finishText: "Подсказка предлагает ход, отмена возвращает его, а перезапуск сохраняет ту же раздачу." },
    hi: { suffix: "पहली चालें", choose: "सही कार्ड खोजें", chooseText: "हाइलाइट किए गए खुले कार्ड आपके अगले निर्णय के लिए तैयार हैं।", action: "टैप या ड्रैग करके खेलें", actionText: "कार्ड और लक्ष्य पर टैप करें या डेस्कटॉप पर ड्रैग करें।", finish: "सहायकों का उपयोग करें", finishText: "संकेत एक चाल सुझाता है, अनडू उसे वापस करता है और रीस्टार्ट वही डील रखता है।" },
    ar: { suffix: "الحركات الأولى", choose: "اعثر على بطاقة قانونية", chooseText: "البطاقات المكشوفة المميزة جاهزة لقرارك التالي.", action: "اضغط أو اسحب للعب", actionText: "اضغط البطاقة ووجهتها أو اسحبها على الكمبيوتر.", finish: "استخدم المساعدات", finishText: "يقترح التلميح حركة، ويعيد التراجع الخطوة، وتحافظ إعادة البدء على التوزيع نفسه." },
  };
  const freecellRuleCopy = {
    en: ["Use the four Free Cells", "Store one card in an empty Free Cell, or move it to a legal alternating-color column or its suit Foundation."],
    "zh-Hant": ["使用 4 個暫存格", "空的暫存格一次放 1 張牌；也可以把牌移到合法的紅黑交替主牌欄或對應花色收牌區。"],
    "zh-Hans": ["使用 4 个暂存格", "空的暂存格一次放 1 张牌；也可以把牌移到合法的红黑交替主牌列或对应花色收牌区。"],
    ja: ["4つのフリーセルを使う", "空いているフリーセルには1枚だけ置けます。赤黒交互の場札列か、対応する組札にも移せます。"],
    ko: ["네 프리 셀 사용하기", "빈 프리 셀에는 카드 한 장만 둘 수 있습니다. 합법적인 색 교차 열이나 해당 기초 더미로도 옮길 수 있습니다."],
    es: ["Usa las cuatro celdas libres", "Guarda una carta en una celda libre vacía, o muévela a una columna legal de colores alternos o a su fundación."],
    "pt-BR": ["Use as quatro células livres", "Guarde uma carta em uma célula livre vazia ou mova-a para uma coluna legal de cores alternadas ou para sua fundação."],
    fr: ["Utilisez les quatre cellules libres", "Placez une carte dans une cellule libre vide, ou déplacez-la vers une colonne légale de couleurs alternées ou sa fondation."],
    de: ["Nutze die vier freien Felder", "Lege eine Karte in ein freies Feld oder bewege sie in eine gültige abwechselnde Spalte oder auf ihr Fundament."],
    it: ["Usa le quattro celle libere", "Metti una carta in una cella libera vuota oppure spostala in una colonna valida a colori alterni o nella sua base."],
    ru: ["Используйте четыре свободные ячейки", "Положите одну карту в свободную ячейку или переместите её в допустимую колонку с чередованием цветов либо в её фундамент."],
    hi: ["चार खाली सेल का उपयोग करें", "खाली सेल में एक कार्ड रखें, या उसे वैध लाल-काले कॉलम या उसके फाउंडेशन में ले जाएँ।"],
    ar: ["استخدم الخلايا الحرة الأربع", "ضع بطاقة واحدة في خلية حرة فارغة، أو انقلها إلى عمود قانوني متناوب الألوان أو إلى أساسها."],
  };
  const golfTutorialCopy = {
    en: { title: "Golf — learn in pictures", steps: [["Read Waste", "Play one rank up or down."], ["Keep the chain", "Tap the exposed card."], ["No fit? Draw", "Use Stock when the chain stops."]] },
    "zh-Hant": { title: "高爾夫接龍・看圖就會", steps: [["看棄牌", "接大一階或小一階。"], ["接著走", "點每欄最下面的牌。"], ["接不到？翻牌", "牌路斷了就翻牌庫。"]] },
    "zh-Hans": { title: "高尔夫接龙・看图就会", steps: [["看弃牌", "接大一阶或小一阶。"], ["接着走", "点每列最下面的牌。"], ["接不到？翻牌", "牌路断了就翻牌库。"]] },
    ja: { title: "ゴルフ・絵でわかる", steps: [["捨て札を見る", "1つ上か下を出します。"], ["続けて出す", "各列の一番下をタップ。"], ["出せない？めくる", "山札から1枚めくります。"]] },
    ko: { title: "골프 솔리테어・그림으로", steps: [["버린 카드 보기", "한 단계 위나 아래를 냅니다."], ["계속 잇기", "각 열의 맨 아래 카드를 누릅니다."], ["없으면 뒤집기", "막히면 덱에서 한 장 뽑습니다."]] },
    es: { title: "Golf · aprende con imágenes", steps: [["Mira el descarte", "Juega una carta arriba o abajo."], ["Sigue la cadena", "Toca la carta expuesta."], ["¿No encaja? Roba", "Usa el mazo cuando se corte."]] },
    "pt-BR": { title: "Golf · aprenda por imagens", steps: [["Veja o descarte", "Jogue uma carta acima ou abaixo."], ["Mantenha a sequência", "Toque na carta exposta."], ["Sem encaixe? Compre", "Use o monte quando a sequência parar."]] },
    fr: { title: "Golf · apprenez en images", steps: [["Lisez la défausse", "Jouez une carte au-dessus ou dessous."], ["Gardez la suite", "Touchez la carte exposée."], ["Bloqué ? Piochez", "Utilisez la pioche quand la suite s'arrête."]] },
    de: { title: "Golf · mit Bildern lernen", steps: [["Ablage lesen", "Lege eine Karte höher oder tiefer."], ["Kette halten", "Tippe die offene Karte an."], ["Kein Zug? Ziehen", "Nutze den Stapel, wenn die Kette endet."]] },
    it: { title: "Golf · impara con le immagini", steps: [["Guarda gli scarti", "Gioca una carta sopra o sotto."], ["Continua la serie", "Tocca la carta esposta."], ["Niente mosse? Pesca", "Usa il tallone quando la serie si ferma."]] },
    ru: { title: "Гольф · учимся по картинкам", steps: [["Смотрите сброс", "Кладите карту на один ранг выше или ниже."], ["Продолжайте цепь", "Нажмите открытую карту."], ["Нет хода? Берите", "Используйте колоду, когда цепь прервалась."]] },
    hi: { title: "गोल्फ़ · तस्वीरों से सीखें", steps: [["खुली गड्डी देखें", "एक अंक ऊपर या नीचे का पत्ता रखें।"], ["श्रृंखला जारी रखें", "खुले पत्ते पर टैप करें।"], ["नहीं मिलता? पलटें", "श्रृंखला रुकने पर डेक से पत्ता लें।"]] },
    ar: { title: "غولف · تعلّم بالصور", steps: [["اقرأ الرزمة المكشوفة", "ضع ورقة أعلى أو أسفل برتبة واحدة."], ["واصل السلسلة", "اضغط الورقة المكشوفة."], ["لا تطابق؟ اسحب", "استخدم الرزمة عندما تتوقف السلسلة."]] },
  };

  const golfVisual = (kind) => {
    const card = (x, y, rank, suit, color = "#19263d") => `<g transform="translate(${x} ${y})"><rect width="30" height="42" rx="5" fill="#fffdf5" stroke="#d9e1ea"/><text x="5" y="12" fill="${color}" font-size="9" font-weight="900">${rank}</text><text x="15" y="29" fill="${color}" font-size="13" text-anchor="middle">${suit}</text></g>`;
    const arrow = `<path d="M68 39h22" stroke="#f0b92f" stroke-width="3" stroke-linecap="round"/><path d="m84 33 8 6-8 6" fill="none" stroke="#f0b92f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
    if (kind === "sequence") return `<svg class="wp-tutorial-visual" viewBox="0 0 160 78" aria-hidden="true"><rect x="4" y="7" width="50" height="62" rx="9" fill="#dff7f1" stroke="#63cdbb" stroke-dasharray="4 3"/><text x="29" y="19" fill="#376a66" font-size="7" font-weight="800" text-anchor="middle">WASTE</text>${card(14,25,"7","♥","#c94855")}${arrow}${card(112,18,"6","♠")}${card(125,31,"8","♦","#c94855")}</svg>`;
    if (kind === "expose") return `<svg class="wp-tutorial-visual" viewBox="0 0 160 78" aria-hidden="true"><rect x="8" y="8" width="48" height="62" rx="9" fill="none" stroke="#b7c9e4" stroke-dasharray="4 3"/><rect x="16" y="18" width="30" height="42" rx="5" fill="#245785" stroke="#8fc5ed"/><text x="31" y="44" fill="#d8f2ff" font-size="14" text-anchor="middle">✦</text>${arrow}${card(112,18,"Q","♣")}</svg>`;
    return `<svg class="wp-tutorial-visual" viewBox="0 0 160 78" aria-hidden="true"><rect x="8" y="8" width="48" height="62" rx="9" fill="none" stroke="#b7c9e4" stroke-dasharray="4 3"/><rect x="16" y="18" width="30" height="42" rx="5" fill="#245785" stroke="#8fc5ed"/><path d="M23 30h16M23 39h16M23 48h16" stroke="#bfe2ff" stroke-width="2" stroke-linecap="round"/>${arrow}<rect x="112" y="18" width="30" height="42" rx="5" fill="#fffdf5" stroke="#d9e1ea"/><text x="127" y="42" fill="#c94855" font-size="18" font-weight="900" text-anchor="middle">7</text></svg>`;
  };

  const golfTutorial = () => ({
    title: Object.fromEntries(classicLocales.map((locale) => [locale, golfTutorialCopy[locale].title])),
    steps: [
      { visual: "sequence", ...Object.fromEntries(classicLocales.map((locale) => [locale, golfTutorialCopy[locale].steps[0]])) },
      { visual: "expose", ...Object.fromEntries(classicLocales.map((locale) => [locale, golfTutorialCopy[locale].steps[1]])) },
      { visual: "stock", ...Object.fromEntries(classicLocales.map((locale) => [locale, golfTutorialCopy[locale].steps[2]])) },
    ],
  });

  const classicTutorial = (variant) => ({
    title: Object.fromEntries(classicLocales.map((locale) => [locale, `${classicNames[variant][locale]} — ${classicTutorialCopy[locale].suffix}`])),
    steps: [
      { icon: "1", ...Object.fromEntries(classicLocales.map((locale) => [locale, [classicTutorialCopy[locale].choose, classicTutorialCopy[locale].chooseText]])) },
      { icon: "2", ...Object.fromEntries(classicLocales.map((locale) => [locale, [classicTutorialCopy[locale].action, classicTutorialCopy[locale].actionText]])) },
      { icon: "3", ...Object.fromEntries(classicLocales.map((locale) => [locale, [classicTutorialCopy[locale].finish, classicTutorialCopy[locale].finishText]])) },
      ...(variant === "freecell" ? [{ icon: "4", ...Object.fromEntries(classicLocales.map((locale) => [locale, freecellRuleCopy[locale]])) }] : []),
    ],
  });

  const tutorials = {
    "freecell-solitaire": classicTutorial("freecell"),
    "pyramid-solitaire": classicTutorial("pyramid"),
    "tripeaks-solitaire": classicTutorial("tripeaks"),
    "golf-solitaire": golfTutorial(),
    "yukon-solitaire": classicTutorial("yukon"),
    "block-blast": {
      title: {
        en: "Plan space for every shape.", "zh-Hant": "替每個方塊預留空間。", "zh-Hans": "为每个方块预留空间。", ja: "すべてのピース用に空間を残そう。", ko: "모든 블록을 위한 공간을 남기세요.", es: "Reserva espacio para cada pieza.", "pt-BR": "Reserve espaço para cada peça.", fr: "Gardez de la place pour chaque pièce.", de: "Halte Platz für jede Form frei.", it: "Lascia spazio per ogni pezzo.", ru: "Оставляйте место для каждой фигуры.", hi: "हर आकृति के लिए जगह रखें।", ar: "اترك مساحة لكل قطعة."
      },
      steps: [
        { icon: "1", en: ["Choose a Shape", "Select one of the three fixed shapes."], "zh-Hant": ["選擇方塊", "從三個固定形狀中選一個。"], "zh-Hans": ["选择方块", "从三个固定形状中选择一个。"], ja: ["ピースを選ぶ", "3つの固定ピースから1つ選びます。"], ko: ["블록 선택", "고정된 세 블록 중 하나를 선택하세요."], es: ["Elige una pieza", "Selecciona una de las tres piezas fijas."], "pt-BR": ["Escolha uma peça", "Selecione uma das três peças fixas."], fr: ["Choisissez une pièce", "Sélectionnez l’une des trois pièces fixes."], de: ["Form wählen", "Wähle eine der drei festen Formen."], it: ["Scegli un pezzo", "Seleziona uno dei tre pezzi fissi."], ru: ["Выберите фигуру", "Выберите одну из трёх фигур."], hi: ["आकृति चुनें", "तीन स्थिर आकृतियों में से एक चुनें।"], ar: ["اختر قطعة", "اختر واحدة من القطع الثلاث الثابتة."] },
        { icon: "2", en: ["Place It", "Tap an open cell or drag the shape onto a legal fit."], "zh-Hant": ["放置方塊", "點空格或拖曳到可以放置的位置。"], "zh-Hans": ["放置方块", "点空格或拖到可以放置的位置。"], ja: ["配置する", "空きマスを押すか、置ける場所へドラッグします。"], ko: ["놓기", "빈 칸을 누르거나 놓을 수 있는 곳으로 드래그하세요."], es: ["Colócala", "Toca una celda libre o arrastra la pieza a un lugar válido."], "pt-BR": ["Posicione", "Toque numa célula livre ou arraste para um encaixe válido."], fr: ["Placez-la", "Touchez une case libre ou glissez la pièce vers un emplacement valide."], de: ["Ablegen", "Tippe auf ein freies Feld oder ziehe die Form an eine gültige Stelle."], it: ["Posiziona", "Tocca una cella libera o trascina il pezzo in uno spazio valido."], ru: ["Разместите", "Нажмите свободную клетку или перетащите фигуру на подходящее место."], hi: ["रखें", "खाली खाने पर टैप करें या आकृति को सही जगह खींचें।"], ar: ["ضع القطعة", "اضغط خلية فارغة أو اسحب القطعة إلى موضع صالح."] },
        { icon: "3", en: ["Clear or Finish", "Complete a row or column. The run ends when no remaining shape fits."], "zh-Hant": ["消除或結束", "填滿一列或一行；剩餘方塊都放不下時結束。"], "zh-Hans": ["消除或结束", "填满一行或一列；剩余方块都放不下时结束。"], ja: ["消去と終了", "行か列を完成させます。残りのピースを置けないと終了です。"], ko: ["지우기와 종료", "행이나 열을 완성하세요. 남은 블록을 놓을 수 없으면 종료됩니다."], es: ["Elimina o termina", "Completa una fila o columna. La partida termina si ninguna pieza cabe."], "pt-BR": ["Limpe ou termine", "Complete uma linha ou coluna. A partida termina quando nenhuma peça cabe."], fr: ["Effacez ou terminez", "Complétez une ligne ou colonne. La partie finit si aucune pièce ne tient."], de: ["Löschen oder Ende", "Fülle eine Reihe oder Spalte. Die Runde endet, wenn keine Form mehr passt."], it: ["Elimina o termina", "Completa una riga o colonna. La partita termina se nessun pezzo entra."], ru: ["Очистка и конец", "Заполните ряд или столбец. Игра закончится, если фигуры не помещаются."], hi: ["पंक्ति मिटाएँ", "पंक्ति या स्तंभ पूरा करें। कोई आकृति न समाए तो खेल खत्म होगा।"], ar: ["امسح أو أنهِ", "أكمل صفاً أو عموداً. تنتهي الجولة عندما لا تلائم أي قطعة متبقية."] }
      ]
    },
    "animal-bamboo-pipes": {
      title: Object.fromEntries(Object.entries(window.BAMBOO_LOCALES || {}).map(([lang, copy]) => [lang, copy.summary])),
      steps: [
        {
          icon: "1",
          ...Object.fromEntries(Object.entries(window.BAMBOO_LOCALES || {}).map(([lang, copy]) => [lang, [copy.choose, copy.objective]])),
        },
        {
          icon: "2",
          ...Object.fromEntries(Object.entries(window.BAMBOO_LOCALES || {}).map(([lang, copy]) => [lang, [copy.cue, `${copy.undo} · ${copy.hint} · ${copy.restart}`]])),
        },
        {
          icon: "3",
          ...Object.fromEntries(Object.entries(window.BAMBOO_LOCALES || {}).map(([lang, copy]) => [lang, [copy.clear, `${copy.restored}. ${copy.next}`]])),
        },
      ],
    },
    "animal-tangram": {
      title: {
        en: "Build every animal with seven pieces.", "zh-Hant": "\u7528\u4e03\u584a\u4e03\u5de7\u677f\u5b8c\u6210\u6bcf\u96bb\u52d5\u7269\u3002", "zh-Hans": "用七块七巧板完成每只动物。",
        ja: "7つのピースで動物を完成させよう。", ko: "일곱 조각으로 동물을 완성하세요.", es: "Construye cada animal con siete piezas.",
        "pt-BR": "Monte cada animal com sete peças.", fr: "Construisez chaque animal avec sept pièces.", de: "Baue jedes Tier aus sieben Teilen.",
        it: "Crea ogni animale con sette pezzi.", ru: "Соберите каждое животное из семи деталей.", hi: "सात टुकड़ों से हर जानवर बनाएँ।", ar: "كوّن كل حيوان من سبع قطع.",
      },
      steps: [
        {
          icon: "1", en: ["Read the Outline", "Find a colored piece that matches one faint target."], "zh-Hant": ["\u89c0\u5bdf\u8f2a\u5ed3", "\u627e\u51fa\u8207\u6de1\u8272\u76ee\u6a19\u76f8\u7b26\u7684\u5f69\u8272\u677f\u584a\u3002"], "zh-Hans": ["观察轮廓", "找出与淡色目标相符的彩色板块。"],
          ja: ["輪郭を見る", "薄い目標と同じ形の色付きピースを探します。"], ko: ["윤곽 확인", "희미한 목표와 맞는 색 조각을 찾으세요."], es: ["Observa el contorno", "Busca la pieza de color que coincide con un objetivo tenue."],
          "pt-BR": ["Observe o contorno", "Encontre a peça colorida que corresponde ao alvo claro."], fr: ["Observez le contour", "Trouvez la pièce colorée correspondant à une cible pâle."], de: ["Kontur lesen", "Finde das farbige Teil für die blasse Zielform."],
          it: ["Osserva il contorno", "Trova il pezzo colorato che corrisponde al bersaglio chiaro."], ru: ["Изучите контур", "Найдите цветную деталь для бледной цели."], hi: ["रूपरेखा देखें", "हल्के लक्ष्य से मेल खाता रंगीन टुकड़ा खोजें।"], ar: ["راقب المخطط", "اعثر على القطعة الملونة المطابقة للهدف الباهت."],
        },
        {
          icon: "2", en: ["Drag and Rotate", "Drag the piece into place. Tap it to rotate by 45 degrees."], "zh-Hant": ["\u62d6\u66f3\u4e26\u65cb\u8f49", "\u628a\u677f\u584a\u62d6\u5230\u76ee\u6a19\uff0c\u9ede\u4e00\u4e0b\u53ef\u65cb\u8f49 45 \u5ea6\u3002"], "zh-Hans": ["拖动并旋转", "把板块拖到目标，点一下可旋转 45 度。"],
          ja: ["ドラッグと回転", "ピースを目標へ動かし、タップして45度回転します。"], ko: ["드래그와 회전", "조각을 목표로 옮기고 탭하여 45도 돌리세요."], es: ["Arrastra y gira", "Lleva la pieza a su lugar y tócala para girarla 45 grados."],
          "pt-BR": ["Arraste e gire", "Leve a peça ao lugar e toque para girá-la 45 graus."], fr: ["Glissez et tournez", "Placez la pièce puis touchez-la pour la tourner de 45 degrés."], de: ["Ziehen und drehen", "Ziehe das Teil an seinen Platz und tippe für eine 45-Grad-Drehung."],
          it: ["Trascina e ruota", "Porta il pezzo al suo posto e toccalo per ruotarlo di 45 gradi."], ru: ["Двигайте и вращайте", "Перетащите деталь и нажмите, чтобы повернуть её на 45 градусов."], hi: ["खींचें और घुमाएँ", "टुकड़े को जगह पर खींचें और 45 डिग्री घुमाने के लिए टैप करें।"], ar: ["اسحب وأدر", "اسحب القطعة إلى مكانها واضغط لتدويرها 45 درجة."],
        },
        {
          icon: "3", en: ["Use All Seven", "Match every center and angle to complete the animal and unlock the next shape."], "zh-Hant": ["\u7528\u5b8c\u4e03\u584a", "\u5c0d\u6e96\u6bcf\u584a\u7684\u4e2d\u5fc3\u8207\u89d2\u5ea6\uff0c\u5b8c\u6210\u52d5\u7269\u4e26\u89e3\u9396\u4e0b\u4e00\u95dc\u3002"], "zh-Hans": ["用完七块", "对准每块的中心与角度，完成动物并解锁下一关。"],
          ja: ["7つ全部を使う", "中心と角度を合わせて動物を完成し、次の形を解放します。"], ko: ["일곱 조각 모두 사용", "중심과 각도를 맞춰 동물을 완성하고 다음 모양을 여세요."], es: ["Usa las siete", "Alinea centros y ángulos para completar el animal y abrir la siguiente forma."],
          "pt-BR": ["Use as sete", "Alinhe centros e ângulos para completar o animal e liberar a próxima forma."], fr: ["Utilisez les sept", "Alignez centres et angles pour terminer l’animal et ouvrir la forme suivante."], de: ["Alle sieben nutzen", "Richte Mittelpunkt und Winkel aus, um das Tier und die nächste Form freizuschalten."],
          it: ["Usa tutti e sette", "Allinea centri e angoli per completare l’animale e sbloccare la forma successiva."], ru: ["Используйте все семь", "Совместите центры и углы, завершите животное и откройте следующую форму."], hi: ["सभी सात लगाएँ", "हर केंद्र और कोण मिलाकर जानवर पूरा करें और अगली आकृति खोलें।"], ar: ["استخدم القطع السبع", "طابق المراكز والزوايا لإكمال الحيوان وفتح الشكل التالي."],
        },
      ],
    },
    "animal-prism-garden": {
      title: {
        en: "Calibrate the moonlit prism garden.", "zh-Hant": "校準月光下的幻彩庭園。", "zh-Hans": "校准月光下的幻彩庭园。",
        ja: "月夜のプリズム庭園を調整しよう。", ko: "달빛 프리즘 정원을 조정하세요.", es: "Calibra el jardín prismático nocturno.",
        "pt-BR": "Calibre o jardim prismático noturno.", fr: "Calibrez le jardin prismatique nocturne.", de: "Kalibriere den nächtlichen Prismagarten.",
        it: "Calibra il giardino prismatico notturno.", ru: "Настройте лунный призматический сад.", hi: "चाँदनी प्रिज़्म बगीचा तैयार करें।", ar: "عاير حديقة الموشور القمرية.",
      },
      steps: [
        {
          icon: "1", en: ["Connect Matching Prisms", "Drag from one prism flower to its matching color."], "zh-Hant": ["連接同色晶花", "從一顆晶花拖曳到相同顏色的另一顆。"], "zh-Hans": ["连接同色晶花", "从一颗晶花拖到相同颜色的另一颗。"],
          ja: ["同色をつなぐ", "プリズム花から同色の相手までドラッグします。"], ko: ["같은 프리즘 연결", "프리즘 꽃에서 같은 색 짝까지 드래그하세요."], es: ["Une prismas iguales", "Arrastra de una flor prisma hasta su pareja."],
          "pt-BR": ["Ligue prismas iguais", "Arraste de uma flor prisma até seu par."], fr: ["Reliez les prismes", "Glissez d'une fleur prismatique jusqu'à sa jumelle."], de: ["Gleiche Prismen verbinden", "Ziehe von einer Prismenblume zu ihrem Partner."],
          it: ["Collega i prismi", "Trascina da un fiore prisma fino alla sua coppia."], ru: ["Соединяйте призмы", "Проведите путь от цветка-призмы к его паре."], hi: ["समान प्रिज़्म जोड़ें", "एक प्रिज़्म फूल से उसके समान जोड़े तक खींचें।"], ar: ["صِل الموشورات", "اسحب من زهرة موشور إلى شريكتها المطابقة."],
        },
        {
          icon: "2", en: ["Obey Color Gates", "Only the matching route may cross a marked prism gate."], "zh-Hant": ["遵守顏色閘門", "有標記的閘門只能讓對應顏色通過。"], "zh-Hans": ["遵守颜色闸门", "有标记的闸门只能让对应颜色通过。"],
          ja: ["色ゲートを守る", "印のあるゲートは同色の経路だけ通れます。"], ko: ["색 관문 지키기", "표시된 관문은 같은 색 경로만 통과합니다."], es: ["Respeta las puertas", "Solo la ruta del mismo color cruza una puerta marcada."],
          "pt-BR": ["Respeite os portões", "Só a rota da mesma cor cruza um portão marcado."], fr: ["Respectez les portes", "Seule la route de même couleur franchit une porte marquée."], de: ["Farbtore beachten", "Nur der gleichfarbige Pfad darf ein markiertes Tor passieren."],
          it: ["Rispetta i portali", "Solo il percorso dello stesso colore attraversa un portale."], ru: ["Соблюдайте ворота", "Через ворота проходит только путь соответствующего цвета."], hi: ["रंग द्वार मानें", "चिह्नित द्वार से केवल समान रंग का मार्ग गुजरता है।"], ar: ["التزم بالبوابات", "لا يعبر البوابة المعلّمة إلا المسار المطابق للونها."],
        },
        {
          icon: "3", en: ["Fill Every Tile", "Connect every pair and illuminate the complete board."], "zh-Hant": ["填滿所有格子", "連完每組配對並點亮整個棋盤。"], "zh-Hans": ["填满所有格子", "连完每组配对并点亮整个棋盘。"],
          ja: ["全マスを埋める", "全ペアを結び、盤面全体を光らせます。"], ko: ["모든 칸 채우기", "모든 쌍을 잇고 보드 전체를 밝히세요."], es: ["Llena cada casilla", "Une todas las parejas e ilumina todo el tablero."],
          "pt-BR": ["Preencha todas as casas", "Ligue todos os pares e ilumine o tabuleiro inteiro."], fr: ["Remplissez chaque case", "Reliez toutes les paires et illuminez toute la grille."], de: ["Jedes Feld füllen", "Verbinde alle Paare und beleuchte das ganze Brett."],
          it: ["Riempi ogni casella", "Collega tutte le coppie e illumina l'intera griglia."], ru: ["Заполните все клетки", "Соедините все пары и осветите всё поле."], hi: ["हर खाना भरें", "सभी जोड़े जोड़कर पूरा बोर्ड रोशन करें।"], ar: ["املأ كل الخانات", "صِل كل الأزواج وأضئ اللوحة كاملة."],
        },
      ],
    },
    "animal-color-link": {
      title: { en: "Help every garden bloom.", "zh-Hant": "讓每座花園都盛開。" },
      steps: [
        { icon: "1", en: ["Connect Seeds", "Drag from one colored flower seed to its matching seed."], "zh-Hant": ["連接種子", "從彩色花朵種子拖曳到相同顏色的種子。"] },
        { icon: "2", en: ["Do Not Cross", "Each path owns its cells and cannot cross another color."], "zh-Hant": ["路線不交叉", "每條路線都有自己的格子，不能穿過其他顏色。"] },
        { icon: "3", en: ["Fill the Garden", "Connect every pair and fill every cell to complete the garden."], "zh-Hant": ["填滿花園", "連好所有配對並填滿每一格，就能完成花園。"] },
      ],
    },
    "animal-starlight-trails": {
      title: { en: "Restore every starlight trail.", "zh-Hant": "修復每一條動物星路。" },
      steps: [
        { icon: "1", en: ["Choose a Start", "Tap a star, then drag or tap through connected stars."], "zh-Hant": ["選擇起點", "點一顆星，再拖曳或點選相連的星星。"] },
        { icon: "2", en: ["Use Each Trail Once", "Stars may be revisited, but a glowing used trail cannot be crossed again."], "zh-Hant": ["每條路只走一次", "星星可以再次經過，但發亮的已用星路不能重複走。"] },
        { icon: "3", en: ["Light Everything", "Use every trail to clear the stage. Undo, Restart, and Hint are always available."], "zh-Hant": ["點亮全部", "走完所有星路即可過關，隨時可用上一步、重新開始與提示。"] },
      ],
    },
    "animal-moonlight-heist": {
      title: { en: "Recover the moonlit relic.", "zh-Hant": "找回月光檔案館的文物。" },
      steps: [
        { icon: "1", en: ["Plan a Route", "Hold and drag across the archive, then release to move Fia."], "zh-Hant": ["規劃路線", "按住並拖曳檔案館畫面，放開後讓菲亞移動。"] },
        { icon: "2", en: ["Read Patrols", "Avoid nearby patrols and use your selected gadget when alert rises."], "zh-Hant": ["觀察巡邏", "避開附近巡邏隊，警戒升高時使用已選技能。"] },
        { icon: "3", en: ["Recover and Extract", "Secure the mission object, then reach the extraction gate. Bonus treasure is optional."], "zh-Hant": ["取得並撤離", "取得任務物件後前往撤離門；額外寶藏可以自由選擇。"] },
      ],
    },
    "animal-gearpack-expedition": {
      title: { en: "Build Rux's gearpack.", "zh-Hant": "配置魯克斯的裝備行囊。" },
      steps: [
        { icon: "1", en: ["Choose Gear", "Tap an item in the tray, then tap open backpack cells."], "zh-Hant": ["選擇裝備", "點待放區的裝備，再點行囊中的空格。"] },
        { icon: "2", en: ["Link Materials", "Place matching material tags next to each other for bonuses."], "zh-Hant": ["連結材質", "把相同材質標籤的裝備放在相鄰位置取得加成。"] },
        { icon: "3", en: ["Clear the Route", "Rotate or sell gear, then defeat five encounters."], "zh-Hant": ["完成路線", "旋轉或出售裝備，接著擊敗五場遭遇。"] },
      ],
    },
    "wonder-crash": {
      title: { en: "Protect the wall.", "zh-Hant": "\u5b88\u4f4f\u57ce\u7246\u3002" },
      steps: [
        { icon: "1", en: ["Move", "Tap or drag anywhere to move the hero left and right."], "zh-Hant": ["\u79fb\u52d5", "\u9ede\u6216\u62d6\u66f3\u756b\u9762\u4efb\u4f55\u4f4d\u7f6e\uff0c\u8b93\u4e3b\u89d2\u5de6\u53f3\u79fb\u52d5\u3002"] },
        { icon: "2", en: ["Auto Weapons", "Equipped weapons fire when cooldown is ready."], "zh-Hant": ["\u81ea\u52d5\u6b66\u5668", "\u88dd\u5099\u7684\u6b66\u5668\u51b7\u537b\u5b8c\u6210\u5f8c\u6703\u81ea\u52d5\u653b\u64ca\u3002"] },
        { icon: "3", en: ["Win", "Stop enemies before the wall breaks."], "zh-Hant": ["\u52dd\u5229", "\u5728\u57ce\u7246\u88ab\u7834\u58de\u524d\u64cb\u4f4f\u6575\u4eba\u3002"] },
      ],
    },
    "animal-rescue": {
      title: { en: "Guide animals home.", "zh-Hant": "\u5e36\u52d5\u7269\u56de\u5bb6\u3002" },
      steps: [
        { icon: "1", en: ["Choose Nearby", "Tap a nearby tile to move one step."], "zh-Hant": ["\u9078\u9644\u8fd1", "\u9ede\u9644\u8fd1\u7684\u683c\u5b50\u79fb\u52d5\u4e00\u6b65\u3002"] },
        { icon: "2", en: ["Collect", "Pick up fruit on the way for more stars."], "zh-Hant": ["\u6536\u96c6", "\u8def\u4e0a\u6536\u96c6\u6c34\u679c\uff0c\u53ef\u4ee5\u7372\u5f97\u66f4\u591a\u661f\u661f\u3002"] },
        { icon: "3", en: ["Goal", "Reach the home tile to clear the trail."], "zh-Hant": ["\u76ee\u6a19", "\u5230\u9054\u56de\u5bb6\u683c\u5b50\u5c31\u80fd\u904e\u95dc\u3002"] },
      ],
    },
    "tiny-weather-rescue": {
      title: { en: "Help the animal.", "zh-Hant": "\u5e6b\u52a9\u5c0f\u52d5\u7269\u3002" },
      steps: [
        { icon: "1", en: ["Look", "See what the animal needs."], "zh-Hant": ["\u89c0\u5bdf", "\u770b\u770b\u5c0f\u52d5\u7269\u73fe\u5728\u9700\u8981\u4ec0\u9ebc\u5e6b\u5fd9\u3002"] },
        { icon: "2", en: ["Help", "Tap or drag the matching care item."], "zh-Hant": ["\u5e6b\u5fd9", "\u9ede\u4e00\u4e0b\u6216\u62d6\u66f3\u6b63\u78ba\u7684\u7167\u9867\u9053\u5177\u3002"] },
        { icon: "3", en: ["Clear", "A happy face means you helped correctly."], "zh-Hant": ["\u5b8c\u6210", "\u770b\u5230\u7b11\u81c9\u5c31\u8868\u793a\u4f60\u5e6b\u5c0d\u4e86\u3002"] },
      ],
    },
    "snack-blocks": {
      title: { en: "Match snacks.", "zh-Hant": "\u6d88\u9664\u52d5\u7269\u96f6\u98df\u3002" },
      steps: [
        { icon: "1", en: ["Swap", "Tap or drag a snack to swap with a neighbor."], "zh-Hant": ["\u4ea4\u63db", "\u9ede\u6216\u62d6\u66f3\u96f6\u98df\uff0c\u548c\u65c1\u908a\u7684\u683c\u5b50\u4ea4\u63db\u3002"] },
        { icon: "2", en: ["Match", "Line up 3 or more of the same snack to clear them."], "zh-Hant": ["\u9023\u7dda", "\u9023\u6210 3 \u500b\u4ee5\u4e0a\u76f8\u540c\u96f6\u98df\u5c31\u80fd\u6d88\u9664\u3002"] },
        { icon: "3", en: ["Goal", "Use your moves, then the stage checks your goal."], "zh-Hant": ["\u76ee\u6a19", "\u7528\u5b8c\u6b65\u6578\u5f8c\uff0c\u95dc\u5361\u6703\u6aa2\u67e5\u662f\u5426\u9054\u6210\u76ee\u6a19\u3002"] },
      ],
    },
    "fruit-merge": {
      title: { en: "Merge bigger animals.", "zh-Hant": "\u5408\u6210\u66f4\u5927\u7684\u52d5\u7269\u3002" },
      steps: [
        { icon: "1", en: ["Aim", "Move your finger or mouse to choose where the animal drops."], "zh-Hant": ["\u7784\u6e96", "\u79fb\u52d5\u624b\u6307\u6216\u6ed1\u9f20\uff0c\u9078\u64c7\u52d5\u7269\u843d\u4e0b\u7684\u4f4d\u7f6e\u3002"] },
        { icon: "2", en: ["Drop", "Release or tap Drop to let it fall."], "zh-Hant": ["\u843d\u4e0b", "\u653e\u958b\u6216\u9ede\u843d\u4e0b\u6309\u9215\uff0c\u8b93\u52d5\u7269\u6389\u4e0b\u53bb\u3002"] },
        { icon: "3", en: ["Merge", "Two matching animals merge into the next one. Do not pass the line."], "zh-Hant": ["\u5408\u6210", "\u5169\u500b\u76f8\u540c\u52d5\u7269\u6703\u5408\u6210\u4e0b\u4e00\u968e\uff0c\u4e0d\u8981\u8d85\u904e\u7d05\u7dda\u3002"] },
      ],
    },
    "garden-tiles": {
      title: { en: "Relax and match.", "zh-Hant": "\u8f15\u9b06\u914d\u5c0d\u3002" },
      steps: [
        { icon: "1", en: ["Look", "All tiles are open. Find two matching pictures."], "zh-Hant": ["\u89c0\u5bdf", "\u6240\u6709\u724c\u90fd\u662f\u6253\u958b\u7684\uff0c\u627e\u5230\u5169\u5f35\u76f8\u540c\u5716\u7247\u3002"] },
        { icon: "2", en: ["Match", "Tap two matching tiles to remove them."], "zh-Hant": ["\u914d\u5c0d", "\u9ede\u5169\u5f35\u76f8\u540c\u7684\u724c\u5c31\u80fd\u6d88\u9664\u3002"] },
        { icon: "3", en: ["Clear", "Clear every pair to finish. There is no timer."], "zh-Hant": ["\u5b8c\u6210", "\u628a\u6240\u6709\u914d\u5c0d\u6d88\u9664\u5c31\u904e\u95dc\uff0c\u6c92\u6709\u6642\u9593\u9650\u5236\u3002"] },
      ],
    },
    "campus-dash": {
      title: { en: "Dodge in three lanes.", "zh-Hant": "\u4e09\u689d\u8def\u7dda\u9583\u907f\u3002" },
      steps: [
        { icon: "1", en: ["Move", "Swipe or tap left and right lanes to move."], "zh-Hant": ["\u79fb\u52d5", "\u5de6\u53f3\u6ed1\u6216\u9ede\u8def\u7dda\uff0c\u8b93\u89d2\u8272\u79fb\u52d5\u3002"] },
        { icon: "2", en: ["Avoid", "Dodge obstacles and stay on the open lane."], "zh-Hant": ["\u9583\u907f", "\u907f\u958b\u969c\u7919\u7269\uff0c\u4fdd\u6301\u5728\u5b89\u5168\u8def\u7dda\u4e0a\u3002"] },
        { icon: "3", en: ["Score", "Survive longer to beat your best score."], "zh-Hant": ["\u5f97\u5206", "\u6490\u5f97\u8d8a\u4e45\uff0c\u5c31\u80fd\u6311\u6230\u81ea\u5df1\u7684\u6700\u4f73\u6210\u7e3e\u3002"] },
      ],
    },
    "animal-quiz": {
      title: { en: "Answer animal questions.", "zh-Hant": "\u56de\u7b54\u52d5\u7269\u554f\u984c\u3002" },
      steps: [
        { icon: "1", en: ["Question", "Look at the animal picture and question."], "zh-Hant": ["\u984c\u76ee", "\u770b\u52d5\u7269\u5716\u7247\u548c\u554f\u984c\u3002"] },
        { icon: "2", en: ["Answer", "Tap the answer you think is right."], "zh-Hant": ["\u56de\u7b54", "\u9ede\u9078\u4f60\u89ba\u5f97\u6b63\u78ba\u7684\u7b54\u6848\u3002"] },
        { icon: "3", en: ["Stage", "Finish 10 questions to clear a stage."], "zh-Hant": ["\u95dc\u5361", "\u5b8c\u6210 10 \u984c\u5c31\u80fd\u904e\u95dc\u3002"] },
      ],
    },
    "color-lunchbox": {
      title: { en: "Sort food by color.", "zh-Hant": "\u4f9d\u7167\u984f\u8272\u5206\u985e\u98df\u7269\u3002" },
      steps: [
        { icon: "1", en: ["Look", "Check each food color."], "zh-Hant": ["\u89c0\u5bdf", "\u770b\u6e05\u695a\u6bcf\u500b\u98df\u7269\u7684\u984f\u8272\u3002"] },
        { icon: "2", en: ["Drag", "Drag food into the matching lunchbox."], "zh-Hant": ["\u62d6\u66f3", "\u628a\u98df\u7269\u62d6\u5230\u76f8\u540c\u984f\u8272\u7684\u4fbf\u7576\u76d2\u3002"] },
        { icon: "3", en: ["Clear", "Sort everything correctly to finish."], "zh-Hant": ["\u5b8c\u6210", "\u5168\u90e8\u5206\u985e\u6b63\u78ba\u5c31\u80fd\u904e\u95dc\u3002"] },
      ],
    },
    "star-memory": {
      title: { en: "Find matching cards.", "zh-Hant": "\u627e\u51fa\u76f8\u540c\u5361\u7247\u3002" },
      steps: [
        { icon: "1", en: ["Flip", "Tap a card to reveal it."], "zh-Hant": ["\u7ffb\u724c", "\u9ede\u4e00\u5f35\u5361\u7247\u628a\u5716\u7247\u7ffb\u51fa\u4f86\u3002"] },
        { icon: "2", en: ["Match", "Find two cards with the same picture."], "zh-Hant": ["\u914d\u5c0d", "\u627e\u5230\u5169\u5f35\u5716\u7247\u76f8\u540c\u7684\u5361\u7247\u3002"] },
        { icon: "3", en: ["Clear", "Match all pairs with fewer moves for more stars."], "zh-Hant": ["\u5b8c\u6210", "\u7528\u66f4\u5c11\u6b65\u6578\u914d\u5c0d\u6240\u6709\u5361\u7247\uff0c\u53ef\u4ee5\u62ff\u5230\u66f4\u591a\u661f\u661f\u3002"] },
      ],
    },
    "shape-train": {
      title: { en: "Load the shape train.", "zh-Hant": "\u88dd\u4e0a\u5f62\u72c0\u706b\u8eca\u3002" },
      steps: [
        { icon: "1", en: ["Look", "Check the shape the train needs."], "zh-Hant": ["\u89c0\u5bdf", "\u770b\u770b\u706b\u8eca\u9700\u8981\u54ea\u4e00\u500b\u5f62\u72c0\u3002"] },
        { icon: "2", en: ["Choose", "Tap or drag the matching shape."], "zh-Hant": ["\u9078\u64c7", "\u9ede\u6216\u62d6\u66f3\u76f8\u540c\u7684\u5f62\u72c0\u3002"] },
        { icon: "3", en: ["Help", "Finish all shape friends to clear."], "zh-Hant": ["\u5b8c\u6210", "\u5e6b\u6240\u6709\u5f62\u72c0\u670b\u53cb\u4e0a\u8eca\u5c31\u80fd\u904e\u95dc\u3002"] },
      ],
    },
    "bubble-bakery": {
      title: { en: "Fill bakery orders.", "zh-Hant": "\u5b8c\u6210\u6ce1\u6ce1\u8a02\u55ae\u3002" },
      steps: [
        { icon: "1", en: ["Find Groups", "Tap 2 or more matching connected bubbles."], "zh-Hant": ["\u627e\u7fa4\u7d44", "\u9ede 2 \u9846\u4ee5\u4e0a\u76f8\u9023\u7684\u76f8\u540c\u6ce1\u6ce1\u3002"] },
        { icon: "2", en: ["Collect", "Clear the colors shown in the order bar."], "zh-Hant": ["\u6536\u96c6", "\u6d88\u9664\u8a02\u55ae\u5217\u986f\u793a\u7684\u6ce1\u6ce1\u984f\u8272\u3002"] },
        { icon: "3", en: ["Plan", "Use your moves carefully before they run out."], "zh-Hant": ["\u898f\u5283", "\u6b65\u6578\u7528\u5b8c\u524d\uff0c\u8acb\u4ed4\u7d30\u898f\u5283\u6d88\u9664\u9806\u5e8f\u3002"] },
      ],
    },
    "animal-rope-rescue": {
      title: { en: "Bounce fruit to animals.", "zh-Hant": "\u628a\u6c34\u679c\u5f48\u7d66\u52d5\u7269\u3002" },
      steps: [
        { icon: "1", en: ["Move Leaf", "Drag the leaf trampoline under the falling fruit."], "zh-Hant": ["\u79fb\u52d5\u8449\u5b50", "\u62d6\u66f3\u8449\u5b50\u5f48\u57ab\uff0c\u63a5\u4f4f\u6389\u4e0b\u4f86\u7684\u6c34\u679c\u3002"] },
        { icon: "2", en: ["Cut Vine", "Tap Cut when you are ready to release the fruit."], "zh-Hant": ["\u526a\u85e4\u8513", "\u6e96\u5099\u597d\u6642\u9ede\u526a\u65b7\uff0c\u8b93\u6c34\u679c\u843d\u4e0b\u3002"] },
        { icon: "3", en: ["Feed", "Bounce fruit into the animal basket to clear the stage."], "zh-Hant": ["\u9935\u98df", "\u628a\u6c34\u679c\u5f48\u9032\u52d5\u7269\u7c43\u5b50\u5c31\u80fd\u904e\u95dc\u3002"] },
      ],
    },
    "animal-zoo-idle": {
      title: { en: "Open your safari park.", "zh-Hant": "\u958b\u653e\u4f60\u7684\u8349\u539f\u6a02\u5712\u3002" },
      steps: [
        { icon: "1", en: ["Visitors", "Visitors walk in and leave ticket money in the box."], "zh-Hant": ["\u53c3\u89c0\u8005", "\u53c3\u89c0\u8005\u6703\u8d70\u9032\u4f86\uff0c\u628a\u9580\u7968\u9322\u7559\u5728\u7968\u7bb1\u3002"] },
        { icon: "2", en: ["Care", "Care for animals to raise happiness and attract more visitors."], "zh-Hant": ["\u7167\u9867", "\u7167\u9867\u52d5\u7269\u63d0\u9ad8\u5feb\u6a02\u5ea6\uff0c\u5438\u5f15\u66f4\u591a\u53c3\u89c0\u8005\u3002"] },
        { icon: "3", en: ["Upgrade", "Use coins to upgrade the gate and invite more animals."], "zh-Hant": ["\u5347\u7d1a", "\u7528\u91d1\u5e63\u5347\u7d1a\u5927\u9580\uff0c\u4e26\u9080\u8acb\u66f4\u591a\u52d5\u7269\u3002"] },
      ],
    },
    "zoo-helper-day": {
      title: { en: "Help zoo animals.", "zh-Hant": "\u5e6b\u52a9\u52d5\u7269\u5712\u52d5\u7269\u3002" },
      steps: [
        { icon: "1", en: ["Need", "Look at what the animal needs."], "zh-Hant": ["\u9700\u8981", "\u770b\u770b\u52d5\u7269\u73fe\u5728\u9700\u8981\u4ec0\u9ebc\u3002"] },
        { icon: "2", en: ["Help", "Choose the matching care item."], "zh-Hant": ["\u5e6b\u5fd9", "\u9078\u64c7\u5c0d\u61c9\u7684\u7167\u9867\u9053\u5177\u3002"] },
        { icon: "3", en: ["Clear", "Help enough animals to finish the stage."], "zh-Hant": ["\u5b8c\u6210", "\u5e6b\u52a9\u8db3\u5920\u7684\u52d5\u7269\u5c31\u80fd\u904e\u95dc\u3002"] },
      ],
    },
    "animal-guard-yard": {
      title: { en: "Guard the yard.", "zh-Hant": "\u5b88\u8b77\u5ead\u9662\u3002" },
      steps: [
        { icon: "1", en: ["Collect Sun", "Tap sun drops to gain energy for animal guards."], "zh-Hant": ["\u6536\u96c6\u967d\u5149", "\u9ede\u967d\u5149\u9053\u5177\uff0c\u7372\u5f97\u653e\u7f6e\u52d5\u7269\u5b88\u885b\u7684\u80fd\u91cf\u3002"] },
        { icon: "2", en: ["Place Guards", "Choose an animal, then tap a grass tile to place it."], "zh-Hant": ["\u653e\u7f6e\u5b88\u885b", "\u9078\u64c7\u52d5\u7269\uff0c\u518d\u9ede\u8349\u5730\u683c\u5b50\u653e\u4e0b\u5b83\u3002"] },
        { icon: "3", en: ["Stop Enemies", "Animals attack enemies in their lanes. Do not let enemies enter the yard."], "zh-Hant": ["\u64cb\u4f4f\u6575\u4eba", "\u52d5\u7269\u6703\u653b\u64ca\u540c\u8def\u7dda\u7684\u6575\u4eba\uff0c\u5225\u8b93\u6575\u4eba\u9032\u5165\u5ead\u9662\u3002"] },
      ],
    },
    "animal-hidden-safari": {
      title: { en: "Find hidden animals.", "zh-Hant": "\u627e\u51fa\u8eb2\u85cf\u7684\u52d5\u7269\u3002" },
      steps: [
        { icon: "1", en: ["Look", "Check the target list below the scene."], "zh-Hant": ["\u89c0\u5bdf", "\u770b\u5834\u666f\u4e0b\u65b9\u7684\u76ee\u6a19\u6e05\u55ae\u3002"] },
        { icon: "2", en: ["Find", "Tap animals or safari clues when you spot them."], "zh-Hant": ["\u5c0b\u627e", "\u767c\u73fe\u52d5\u7269\u6216\u63a2\u96aa\u7dda\u7d22\u6642\u5c31\u9ede\u4e00\u4e0b\u3002"] },
        { icon: "?", en: ["Hint", "Use a hint if one target is hard to see."], "zh-Hant": ["\u63d0\u793a", "\u5982\u679c\u67d0\u500b\u76ee\u6a19\u5f88\u96e3\u627e\uff0c\u53ef\u4ee5\u4f7f\u7528\u63d0\u793a\u3002"] },
      ],
    },
    "animal-bubble-safari": {
      title: { en: "Rescue the safari bubbles.", "zh-Hant": "救出泡泡裡的動物。" },
      steps: [
        { icon: "1", en: ["Aim", "Drag to aim, then release to shoot."], "zh-Hant": ["瞄準", "拖曳瞄準，放開後發射泡泡。"] },
        { icon: "2", en: ["Match", "Connect three or more matching animal bubbles."], "zh-Hant": ["配對", "連接三顆以上相同的動物泡泡。"] },
        { icon: "3", en: ["Rescue", "Use wall bounces and special bubbles to complete the stage goal."], "zh-Hant": ["救援", "利用牆面反彈與特殊泡泡完成關卡目標。"] },
      ],
    },
    "animal-habitat-mahjong": {
      title: { en: "Clear the animal habitat.", "zh-Hant": "清空動物棲地牌局。" },
      steps: [
        { icon: "1", en: ["Find a Pair", "Look for two identical animal tiles."], "zh-Hant": ["尋找配對", "找出兩張相同的動物牌。"] },
        { icon: "2", en: ["Check Free Tiles", "A tile needs no cover above and an open left or right side."], "zh-Hant": ["確認自由牌", "牌面上方不能被覆蓋，且左右至少一側要開放。"] },
        { icon: "3", en: ["Clear", "Match every pair; use Hint, Undo, or Shuffle when needed."], "zh-Hant": ["清除", "配對所有牌；需要時可使用提示、復原或洗牌。"] },
      ],
    },
    "animal-reef-fisher": {
      title: { en: "Cast and control tension.", "zh-Hant": "拋竿並控制張力。" },
      steps: [
        { icon: "1", en: ["Cast", "Hold in the reef play area to charge, then release to cast."], "zh-Hant": ["拋竿", "按住礁海畫面蓄力，放開即可拋竿。"] },
        { icon: "2", en: ["Tension", "When a fish is hooked, drag left or right and keep the red marker inside the green safe band."], "zh-Hant": ["張力", "魚上鉤後，左右拖曳紅色標記，讓它留在綠色安全區。"] },
        { icon: "3", en: ["Upgrade", "Use Reef Notes for gear upgrades. Diamonds are optional tools only."], "zh-Hant": ["升級", "用礁石筆記升級裝備；鑽石道具只是選用工具。"] },
      ],
    },
    "animal-auto-squad": {
      title: { en: "Draft and fight.", "zh-Hant": "招募與戰鬥。" },
      steps: [
        { icon: "1", en: ["Draft", "Buy an animal card from the shop using your starting Gold."], "zh-Hant": ["招募", "使用初始金幣從商店購買一隻動物戰士卡牌。"] },
        { icon: "2", en: ["Deploy", "Drag and drop the animal into slot 1 of your active squad."], "zh-Hant": ["派兵", "將動物拖曳並放置到作戰小隊的第一個欄位。"] },
        { icon: "3", en: ["Combine", "Combine three matching animals to level them up and increase stats."], "zh-Hant": ["合成", "收集三隻相同的動物以進行合成升級，大幅強化屬性。"] },
        { icon: "4", en: ["Battle", "Press Start Battle to watch your squad fight automated shadow beast rounds."], "zh-Hant": ["戰鬥", "點擊開始戰鬥，觀看你的小隊在自動戰鬥中擊退影獸。"] }
      ],
    },
  };

  const battleTutorialGames = new Set([
    "freecell-solitaire",
    "pyramid-solitaire",
    "tripeaks-solitaire",
    "golf-solitaire",
    "yukon-solitaire",
  ]);

  function gameIdFromPath() {
    const parts = window.location.pathname.split("/").filter(Boolean);
    const index = parts.indexOf("games");
    return index >= 0 ? parts[index + 1] : "";
  }

  function locale() {
    const value = window.WonderI18n?.locale?.() || readStorage("weightPlayLocale") || readStorage("weightplayLocale") || "en";
    return ["en","zh-Hant","zh-Hans","ja","ko","es","pt-BR","fr","de","it","ru","hi","ar"].includes(value) ? value : "en";
  }

  function textFor(item) {
    return item[locale()] || item.en;
  }

  function seenKey(gameId) {
    return `weightplay_tutorial_seen_${gameId}_v1`;
  }

  function markSeen(gameId) {
    writeStorage(seenKey(gameId), "1");
  }

  function hasSeen(gameId) {
    return readStorage(seenKey(gameId)) === "1";
  }

  function isAutomationRun() {
    const params = new URLSearchParams(window.location.search);
    return params.has("smoke") || params.has("qa") || params.has("test");
  }

  function renderTutorial(backdrop, gameId, fromButton = false) {
    const tutorial = tutorials[gameId];
    if (!tutorial || !backdrop) return;
    const lang = locale();
    const labels = common[lang] || common.en;
    backdrop.innerHTML = `
      <section class="wp-tutorial-card${gameId === "golf-solitaire" ? " golf-tutorial" : ""}">
        <div class="wp-tutorial-head">
          <strong>${tutorial.title[lang] || tutorial.title.en}</strong>
          <button class="wp-tutorial-close" type="button" aria-label="${labels.closeAria}">×</button>
        </div>
        <div class="wp-tutorial-steps">
          ${tutorial.steps
            .map((step) => {
              const [title, body] = textFor(step);
              return `
              <div class="wp-tutorial-step">
                ${step.visual ? golfVisual(step.visual) : `<div class="wp-tutorial-icon">${step.icon}</div>`}
                <div class="wp-tutorial-copy">
                  <b>${title}</b>
                  <span>${body}</span>
                </div>
              </div>
            `;
            })
            .join("")}
        </div>
        <button class="wp-tutorial-action" type="button">${labels.close}</button>
      </section>
    `;
    const close = (startRequested = false) => {
      markSeen(gameId);
      backdrop.remove();
      if (startRequested) {
        window.dispatchEvent(new CustomEvent("weightplay:tutorial-start", { detail: { gameId } }));
      }
      window.WonderAnalytics?.track?.("tutorial_close", { game_id: gameId, from_button: fromButton });
    };
    backdrop.querySelector(".wp-tutorial-close").addEventListener("click", () => close(false));
    backdrop.querySelector(".wp-tutorial-action").addEventListener("click", () => close(true));
  }

  function showTutorial(gameId, fromButton = false) {
    const tutorial = tutorials[gameId];
    if (!tutorial || document.querySelector(".wp-tutorial-backdrop")) return;
    const backdrop = document.createElement("div");
    backdrop.className = "wp-tutorial-backdrop";
    backdrop.dataset.gameId = gameId;
    backdrop.dataset.fromButton = String(fromButton);
    backdrop.setAttribute("role", "dialog");
    backdrop.setAttribute("aria-modal", "true");
    renderTutorial(backdrop, gameId, fromButton);
    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop) backdrop.querySelector(".wp-tutorial-close")?.click();
    });
    document.body.append(backdrop);
    window.WonderAnalytics?.track?.("tutorial_show", { game_id: gameId, from_button: fromButton });
  }

  function loadingIsDone(startTime) {
    const panel = document.getElementById("loadingPanel");
    if (!panel) return true;
    const style = window.getComputedStyle(panel);
    return panel.classList.contains("hidden") || style.display === "none" || Date.now() - startTime > 4200;
  }

  function scheduleFirstShow(gameId) {
    const startTime = Date.now();
    const id = window.setInterval(() => {
      if (!loadingIsDone(startTime)) return;
      window.clearInterval(id);
      showTutorial(gameId);
    }, 250);
  }

  function applyCommonLabels() {
    const lang = locale();
    const labels = common[lang] || common.en;
    document.querySelectorAll(".home-link").forEach((link) => {
      link.setAttribute("aria-label", labels.lobbyAria);
    });
    document.querySelector(".wp-tutorial-button")?.setAttribute("aria-label", labels.aria);
    const openTutorial = document.querySelector(".wp-tutorial-backdrop");
    if (openTutorial?.dataset.gameId) {
      renderTutorial(openTutorial, openTutorial.dataset.gameId, openTutorial.dataset.fromButton === "true");
    }
  }

  function install() {
    const gameId = gameIdFromPath();
    if (!tutorials[gameId]) return;
    applyCommonLabels();
    const button = document.createElement("button");
    button.type = "button";
    button.className = "wp-tutorial-button";
    button.textContent = "?";
    button.addEventListener("click", () => showTutorial(gameId, true));
    document.body.append(button);
    applyCommonLabels();
    window.addEventListener("wonder:locale-change", applyCommonLabels);
    const autoShowEnabled = document.body.dataset.tutorialAutoShow !== "false";
    if (autoShowEnabled && !hasSeen(gameId) && !isAutomationRun()) {
      if (battleTutorialGames.has(gameId)) {
        window.addEventListener("weightplay:battle-open", () => scheduleFirstShow(gameId), { once: true });
      } else {
        scheduleFirstShow(gameId);
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", install, { once: true });
  } else {
    install();
  }
})();
