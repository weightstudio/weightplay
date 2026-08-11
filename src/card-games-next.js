(function (root) {
  "use strict";

  const SUITS = ["clubs", "diamonds", "hearts", "spades"];
  const SYMBOLS = { clubs: "♣", diamonds: "♦", hearts: "♥", spades: "♠" };
  const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  const localeMap = { "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", "pt-br": "pt-BR" };
  const currentLocale = () => localeMap[document.documentElement.lang] || root.WonderI18n?.actualLocale?.() || document.documentElement.lang || "en";

  const TITLES = {
    hearts: { en: "Hearts", "zh-Hant": "紅心大戰", "zh-Hans": "红心大战", ja: "ハーツ", ko: "하트", es: "Corazones", "pt-BR": "Copas", fr: "Cœurs", de: "Herz", it: "Cuori", ru: "Черви", hi: "हर्ट्स", ar: "القلوب" },
    spades: { en: "Spades", "zh-Hant": "黑桃", "zh-Hans": "黑桃", ja: "スペード", ko: "스페이드", es: "Picas", "pt-BR": "Espadas", fr: "Pique", de: "Pik", it: "Picche", ru: "Пики", hi: "स्पेड्स", ar: "البستوني" },
    "gin-rummy": { en: "Gin Rummy", "zh-Hant": "金拉米", "zh-Hans": "金拉米", ja: "ジン・ラミー", ko: "진 러미", es: "Gin Rummy", "pt-BR": "Gin Rummy", fr: "Gin rami", de: "Gin Rommé", it: "Gin Rummy", ru: "Джин-рамми", hi: "जिन रमी", ar: "جِن رامي" },
    "crazy-eights": { en: "Crazy Eights", "zh-Hant": "瘋狂八", "zh-Hans": "疯狂八", ja: "クレイジーエイト", ko: "크레이지 에이트", es: "Ochos locos", "pt-BR": "Oito Maluco", fr: "Huit fou", de: "Crazy Eights", it: "Otto pazzo", ru: "Безумные восьмёрки", hi: "क्रेज़ी एट्स", ar: "الثمانيات المجنونة" },
    cribbage: { en: "Cribbage", "zh-Hant": "克里比奇", "zh-Hans": "克里比奇", ja: "クリベッジ", ko: "크리비지", es: "Cribbage", "pt-BR": "Cribbage", fr: "Cribbage", de: "Cribbage", it: "Cribbage", ru: "Криббедж", hi: "क्रिबेज", ar: "كريبدج" },
    "go-fish": { en: "Go Fish", "zh-Hant": "釣魚", "zh-Hans": "钓鱼", ja: "ゴーフィッシュ", ko: "고 피시", es: "A pescar", "pt-BR": "Pescaria", fr: "Va pêcher", de: "Go Fish", it: "Pesca", ru: "Рыбалка", hi: "गो फिश", ar: "اذهب للصيد" },
    war: { en: "War", "zh-Hant": "戰爭", "zh-Hans": "战争", ja: "戦争", ko: "전쟁", es: "Guerra", "pt-BR": "Guerra", fr: "Bataille", de: "Krieg", it: "Guerra", ru: "Война", hi: "युद्ध", ar: "الحرب" },
    speed: { en: "Speed", "zh-Hant": "快手接龍", "zh-Hans": "快手接龙", ja: "スピード", ko: "스피드", es: "Speed", "pt-BR": "Speed", fr: "Speed", de: "Speed", it: "Speed", ru: "Скорость", hi: "स्पीड", ar: "السرعة" },
    "old-maid": { en: "Old Maid", "zh-Hant": "抽鬼牌", "zh-Hans": "抽鬼牌", ja: "ババ抜き", ko: "ババ抜き", es: "La vieja solterona", "pt-BR": "Mico", fr: "Pouilleux", de: "Schwarzer Peter", it: "Asino", ru: "Старая дева", hi: "ओल्ड मेड", ar: "العانس" },
    casino: { en: "Casino", "zh-Hant": "卡西諾", "zh-Hans": "卡西诺", ja: "カシノ", ko: "카지노", es: "Casino", "pt-BR": "Cassino", fr: "Casino", de: "Cassino", it: "Cassino", ru: "Кассино", hi: "कैसिनो", ar: "كاسينو" },
  };

  const STAT_LABELS = { en: "Statistics", "zh-Hant": "統計", "zh-Hans": "统计", ja: "統計", ko: "통계", es: "Estadísticas", "pt-BR": "Estatísticas", fr: "Statistiques", de: "Statistik", it: "Statistiche", ru: "Статистика", hi: "आंकड़े", ar: "الإحصاءات" };

  const TEXT = {
    en: { back: "Back", settings: "Settings", sound: "Sound", language: "Language", start: "Start Game", restart: "Restart", newGame: "New Game", yourTurn: "Your turn", aiTurn: "AI thinking", hand: "Your hand", table: "Table", stock: "Stock", discard: "Discard", points: "Points", score: "Score", select: "Select", play: "Play", draw: "Draw", pass: "Pass", choose: "Choose", chooseSuit: "Choose a suit", chooseRank: "Choose a rank", capture: "Capture", build: "Build", knock: "Knock", gin: "Gin", bid: "Bid", submit: "Submit", flip: "Flip", war: "WAR!", ask: "Ask", goFish: "Go Fish", noLegal: "No legal card — draw", winner: "You win!", loser: "AI wins", roundOver: "Round complete", continue: "Continue", close: "Close", cards: "cards", pairs: "pairs", books: "books", booksMade: "Books", live: "Live", waiting: "Waiting", oldMaid: "Old Maid", chooseOpponent: "Choose an opponent", selectCards: "Select cards", pending: "Pending", made: "made", target: "Target", total: "Total" },
    "zh-Hant": { back: "返回", settings: "設定", sound: "音效", language: "語言", start: "開始遊戲", restart: "重新開始", newGame: "新遊戲", yourTurn: "你的回合", aiTurn: "AI 思考中", hand: "你的手牌", table: "桌面", stock: "牌庫", discard: "棄牌", points: "分數", score: "得分", select: "選擇", play: "出牌", draw: "抽牌", pass: "傳牌", choose: "選擇", chooseSuit: "選擇花色", chooseRank: "選擇點數", capture: "捕獲", build: "建立牌組", knock: "Knock", gin: "Gin", bid: "叫牌", submit: "確認", flip: "翻牌", war: "戰爭！", ask: "詢問", goFish: "釣魚", noLegal: "沒有合法牌——抽牌", winner: "你贏了！", loser: "AI 獲勝", roundOver: "本局完成", continue: "繼續", close: "關閉", cards: "張牌", pairs: "對", books: "組", booksMade: "完成組數", live: "進行中", waiting: "等待", oldMaid: "鬼牌", chooseOpponent: "選擇對手", selectCards: "選擇牌", pending: "待處理", made: "已完成", target: "目標", total: "總計" },
    "zh-Hans": { back: "返回", settings: "设置", sound: "音效", language: "语言", start: "开始游戏", restart: "重新开始", newGame: "新游戏", yourTurn: "你的回合", aiTurn: "AI 思考中", hand: "你的手牌", table: "桌面", stock: "牌库", discard: "弃牌", points: "分数", score: "得分", select: "选择", play: "出牌", draw: "抽牌", pass: "传牌", choose: "选择", chooseSuit: "选择花色", chooseRank: "选择点数", capture: "捕获", build: "建立牌组", knock: "Knock", gin: "Gin", bid: "叫牌", submit: "确认", flip: "翻牌", war: "战争！", ask: "询问", goFish: "钓鱼", noLegal: "没有合法牌——抽牌", winner: "你赢了！", loser: "AI 获胜", roundOver: "本局完成", continue: "继续", close: "关闭", cards: "张牌", pairs: "对", books: "组", booksMade: "完成组数", live: "进行中", waiting: "等待", oldMaid: "鬼牌", chooseOpponent: "选择对手", selectCards: "选择牌", pending: "待处理", made: "已完成", target: "目标", total: "总计" },
    ja: { back: "戻る", settings: "設定", sound: "サウンド", language: "言語", start: "ゲーム開始", restart: "再スタート", newGame: "新しいゲーム", yourTurn: "あなたの番", aiTurn: "AI 思考中", hand: "手札", table: "場", stock: "山札", discard: "捨て札", points: "点", score: "スコア", select: "選択", play: "出す", draw: "引く", pass: "パス", choose: "選択", chooseSuit: "スートを選択", chooseRank: "ランクを選択", capture: "取る", build: "ビルド", knock: "ノック", gin: "ジン", bid: "ビッド", submit: "決定", flip: "めくる", war: "戦争！", ask: "質問", goFish: "ゴーフィッシュ", noLegal: "出せるカードなし — 引く", winner: "あなたの勝ち！", loser: "AI の勝ち", roundOver: "ラウンド終了", continue: "続ける", close: "閉じる", cards: "枚", pairs: "ペア", books: "組", booksMade: "完成組数", live: "進行中", waiting: "待機", oldMaid: "ババ", chooseOpponent: "相手を選択", selectCards: "カードを選択", pending: "待機", made: "完成", target: "目標", total: "合計" },
    ko: { back: "돌아가기", settings: "설정", sound: "소리", language: "언어", start: "게임 시작", restart: "다시 시작", newGame: "새 게임", yourTurn: "당신의 차례", aiTurn: "AI 생각 중", hand: "내 패", table: "테이블", stock: "덱", discard: "버림", points: "점수", score: "점수", select: "선택", play: "내기", draw: "뽑기", pass: "패스", choose: "선택", chooseSuit: "무늬 선택", chooseRank: "랭크 선택", capture: "잡기", build: "빌드", knock: "노크", gin: "진", bid: "비드", submit: "확인", flip: "뒤집기", war: "전쟁!", ask: "질문", goFish: "고 피시", noLegal: "낼 카드 없음 — 뽑기", winner: "승리!", loser: "AI 승리", roundOver: "라운드 완료", continue: "계속", close: "닫기", cards: "장", pairs: "쌍", books: "세트", booksMade: "완성 세트", live: "진행 중", waiting: "대기", oldMaid: "버바", chooseOpponent: "상대 선택", selectCards: "카드 선택", pending: "대기", made: "완성", target: "목표", total: "합계" },
    es: { back: "Volver", settings: "Ajustes", sound: "Sonido", language: "Idioma", start: "Empezar", restart: "Reiniciar", newGame: "Nueva partida", yourTurn: "Tu turno", aiTurn: "La IA piensa", hand: "Tu mano", table: "Mesa", stock: "Mazo", discard: "Descarte", points: "Puntos", score: "Puntuación", select: "Elegir", play: "Jugar", draw: "Robar", pass: "Pasar", choose: "Elegir", chooseSuit: "Elige palo", chooseRank: "Elige rango", capture: "Capturar", build: "Construir", knock: "Cerrar", gin: "Gin", bid: "Apuesta", submit: "Confirmar", flip: "Voltear", war: "¡Guerra!", ask: "Preguntar", goFish: "A pescar", noLegal: "Sin jugada legal — roba", winner: "¡Has ganado!", loser: "Gana la IA", roundOver: "Ronda completada", continue: "Continuar", close: "Cerrar", cards: "cartas", pairs: "parejas", books: "grupos", booksMade: "Grupos", live: "En juego", waiting: "Espera", oldMaid: "Solterona", chooseOpponent: "Elige rival", selectCards: "Elige cartas", pending: "Pendiente", made: "hechos", target: "Meta", total: "Total" },
    "pt-BR": { back: "Voltar", settings: "Configurações", sound: "Som", language: "Idioma", start: "Começar jogo", restart: "Reiniciar", newGame: "Novo jogo", yourTurn: "Sua vez", aiTurn: "IA pensando", hand: "Sua mão", table: "Mesa", stock: "Monte", discard: "Descarte", points: "Pontos", score: "Pontuação", select: "Selecionar", play: "Jogar", draw: "Comprar", pass: "Passar", choose: "Escolher", chooseSuit: "Escolha o naipe", chooseRank: "Escolha o valor", capture: "Capturar", build: "Construir", knock: "Bater", gin: "Gin", bid: "Lance", submit: "Confirmar", flip: "Virar", war: "Guerra!", ask: "Perguntar", goFish: "Pescaria", noLegal: "Sem jogada legal — compre", winner: "Você venceu!", loser: "A IA venceu", roundOver: "Rodada concluída", continue: "Continuar", close: "Fechar", cards: "cartas", pairs: "pares", books: "grupos", booksMade: "Grupos", live: "Em jogo", waiting: "Aguardando", oldMaid: "Mico", chooseOpponent: "Escolha um oponente", selectCards: "Selecione cartas", pending: "Pendente", made: "feitos", target: "Meta", total: "Total" },
    fr: { back: "Retour", settings: "Réglages", sound: "Son", language: "Langue", start: "Commencer", restart: "Recommencer", newGame: "Nouvelle partie", yourTurn: "À vous", aiTurn: "IA réfléchit", hand: "Votre main", table: "Table", stock: "Pioche", discard: "Défausse", points: "Points", score: "Score", select: "Choisir", play: "Jouer", draw: "Piocher", pass: "Passer", choose: "Choisir", chooseSuit: "Choisir une couleur", chooseRank: "Choisir une valeur", capture: "Capturer", build: "Construire", knock: "Frapper", gin: "Gin", bid: "Enchère", submit: "Valider", flip: "Retourner", war: "Bataille !", ask: "Demander", goFish: "À la pêche", noLegal: "Aucune carte — piochez", winner: "Vous gagnez !", loser: "L’IA gagne", roundOver: "Manche terminée", continue: "Continuer", close: "Fermer", cards: "cartes", pairs: "paires", books: "familles", booksMade: "Familles", live: "En cours", waiting: "Attente", oldMaid: "Pouilleux", chooseOpponent: "Choisir un adversaire", selectCards: "Choisir des cartes", pending: "En attente", made: "faites", target: "Objectif", total: "Total" },
    de: { back: "Zurück", settings: "Einstellungen", sound: "Ton", language: "Sprache", start: "Spiel starten", restart: "Neu starten", newGame: "Neues Spiel", yourTurn: "Du bist dran", aiTurn: "KI denkt nach", hand: "Deine Hand", table: "Tisch", stock: "Stapel", discard: "Ablage", points: "Punkte", score: "Punktestand", select: "Auswählen", play: "Spielen", draw: "Ziehen", pass: "Passen", choose: "Wählen", chooseSuit: "Farbe wählen", chooseRank: "Rang wählen", capture: "Nehmen", build: "Bauen", knock: "Klopfen", gin: "Gin", bid: "Gebot", submit: "Bestätigen", flip: "Aufdecken", war: "KRIEG!", ask: "Fragen", goFish: "Fischen", noLegal: "Kein Zug — ziehen", winner: "Du gewinnst!", loser: "KI gewinnt", roundOver: "Runde beendet", continue: "Weiter", close: "Schließen", cards: "Karten", pairs: "Paare", books: "Vierlinge", booksMade: "Vierlinge", live: "Läuft", waiting: "Warten", oldMaid: "Schwarzer Peter", chooseOpponent: "Gegner wählen", selectCards: "Karten wählen", pending: "Offen", made: "fertig", target: "Ziel", total: "Gesamt" },
    it: { back: "Indietro", settings: "Impostazioni", sound: "Audio", language: "Lingua", start: "Inizia partita", restart: "Ricomincia", newGame: "Nuova partita", yourTurn: "Tocca a te", aiTurn: "L'IA pensa", hand: "La tua mano", table: "Tavolo", stock: "Mazzo", discard: "Scarti", points: "Punti", score: "Punteggio", select: "Seleziona", play: "Gioca", draw: "Pesca", pass: "Passa", choose: "Scegli", chooseSuit: "Scegli seme", chooseRank: "Scegli valore", capture: "Cattura", build: "Costruisci", knock: "Batti", gin: "Gin", bid: "Puntata", submit: "Conferma", flip: "Gira", war: "Guerra!", ask: "Chiedi", goFish: "Pesca", noLegal: "Nessuna carta — pesca", winner: "Hai vinto!", loser: "Vince l'IA", roundOver: "Mano completata", continue: "Continua", close: "Chiudi", cards: "carte", pairs: "coppie", books: "quartetti", booksMade: "Quartetti", live: "In corso", waiting: "Attesa", oldMaid: "Asino", chooseOpponent: "Scegli avversario", selectCards: "Scegli carte", pending: "In attesa", made: "fatti", target: "Obiettivo", total: "Totale" },
    ru: { back: "Назад", settings: "Настройки", sound: "Звук", language: "Язык", start: "Начать игру", restart: "Заново", newGame: "Новая игра", yourTurn: "Ваш ход", aiTurn: "ИИ думает", hand: "Ваша рука", table: "Стол", stock: "Колода", discard: "Сброс", points: "Очки", score: "Счёт", select: "Выбрать", play: "Сыграть", draw: "Взять", pass: "Передать", choose: "Выбрать", chooseSuit: "Выберите масть", chooseRank: "Выберите ранг", capture: "Забрать", build: "Собрать", knock: "Стучать", gin: "Джин", bid: "Заявка", submit: "Готово", flip: "Открыть", war: "ВОЙНА!", ask: "Спросить", goFish: "Рыбалка", noLegal: "Нет хода — возьмите карту", winner: "Вы победили!", loser: "Победил ИИ", roundOver: "Раунд завершён", continue: "Продолжить", close: "Закрыть", cards: "карт", pairs: "пар", books: "четвёрок", booksMade: "Четвёрки", live: "Игра идёт", waiting: "Ожидание", oldMaid: "Старая дева", chooseOpponent: "Выберите соперника", selectCards: "Выберите карты", pending: "Ожидается", made: "готово", target: "Цель", total: "Всего" },
    hi: { back: "वापस", settings: "सेटिंग्स", sound: "ध्वनि", language: "भाषा", start: "खेल शुरू करें", restart: "फिर शुरू करें", newGame: "नया खेल", yourTurn: "आपकी चाल", aiTurn: "AI सोच रहा है", hand: "आपके पत्ते", table: "मेज़", stock: "गड्डी", discard: "फेंके पत्ते", points: "अंक", score: "स्कोर", select: "चुनें", play: "चलें", draw: "पत्ता लें", pass: "पास", choose: "चुनें", chooseSuit: "सूट चुनें", chooseRank: "रैंक चुनें", capture: "पकड़ें", build: "बनाएँ", knock: "नॉक", gin: "जिन", bid: "बोली", submit: "पुष्टि", flip: "पलटें", war: "युद्ध!", ask: "पूछें", goFish: "गो फिश", noLegal: "चाल नहीं — पत्ता लें", winner: "आप जीत गए!", loser: "AI जीता", roundOver: "राउंड पूरा", continue: "जारी रखें", close: "बंद करें", cards: "पत्ते", pairs: "जोड़े", books: "सेट", booksMade: "सेट", live: "चल रहा", waiting: "प्रतीक्षा", oldMaid: "ओल्ड मेड", chooseOpponent: "प्रतिद्वंद्वी चुनें", selectCards: "पत्ते चुनें", pending: "बाकी", made: "पूरे", target: "लक्ष्य", total: "कुल" },
    ar: { back: "رجوع", settings: "الإعدادات", sound: "الصوت", language: "اللغة", start: "بدء اللعبة", restart: "إعادة البدء", newGame: "لعبة جديدة", yourTurn: "دورك", aiTurn: "الذكاء الاصطناعي يفكر", hand: "يدك", table: "الطاولة", stock: "الرزمة", discard: "المهملات", points: "النقاط", score: "النتيجة", select: "اختر", play: "العب", draw: "اسحب", pass: "مرر", choose: "اختر", chooseSuit: "اختر النوع", chooseRank: "اختر الرتبة", capture: "التقاط", build: "بناء", knock: "طرق", gin: "جين", bid: "مزايدة", submit: "تأكيد", flip: "اقلب", war: "حرب!", ask: "اسأل", goFish: "اذهب للصيد", noLegal: "لا توجد بطاقة — اسحب", winner: "لقد فزت!", loser: "فاز الذكاء الاصطناعي", roundOver: "انتهت الجولة", continue: "متابعة", close: "إغلاق", cards: "بطاقات", pairs: "أزواج", books: "مجموعات", booksMade: "المجموعات", live: "قيد اللعب", waiting: "انتظار", oldMaid: "العانس", chooseOpponent: "اختر خصماً", selectCards: "اختر البطاقات", pending: "معلّق", made: "مكتمل", target: "الهدف", total: "الإجمالي" },
  };

  const t = (key, values = {}) => {
    const dictionary = TEXT[currentLocale()] || TEXT.en;
    let value = key === "cribbage" ? (TITLES.cribbage[currentLocale()] || TITLES.cribbage.en) : (dictionary[key] || TEXT.en[key] || key);
    Object.entries(values).forEach(([name, replacement]) => { value = value.replaceAll(`{${name}}`, String(replacement)); });
    return value;
  };

  function card(suit, rank, extra = {}) { return { suit, rank, id: `${suit}-${rank}-${Math.random().toString(36).slice(2)}`, ...extra }; }
  function deck() {
    const cards = [];
    SUITS.forEach((suit) => RANKS.forEach((_, index) => cards.push(card(suit, index + 1))));
    for (let i = cards.length - 1; i; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); [cards[i], cards[j]] = [cards[j], cards[i]]; }
    return cards;
  }
  const rankText = (rank) => RANKS[rank - 1] || String(rank);
  const cardText = (item) => item?.oldMaid ? "★" : `${rankText(item.rank)}${SYMBOLS[item.suit] || ""}`;
  const isRed = (item) => item?.suit === "hearts" || item?.suit === "diamonds";
  const value = (item) => Math.min(item?.rank || 0, 10);
  const sum = (cards) => cards.reduce((total, item) => total + value(item), 0);
  const sameCard = (a, b) => a && b && a.suit === b.suit && a.rank === b.rank;
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function cardMarkup(item, index, options = {}) {
    const hidden = options.hidden || item?.faceDown;
    const classes = ["playing-card", isRed(item) ? "is-red" : "", hidden ? "is-face-down" : "", options.selected ? "is-selected" : "", options.className || ""].filter(Boolean).join(" ");
    const label = hidden ? t("cards") : cardText(item);
    return `<button type="button" class="${classes}" data-card-index="${index}" aria-label="${hidden ? t("cards") : label}" ${options.disabled ? "disabled" : ""}>${hidden ? "" : label}</button>`;
  }
  function cardsMarkup(cards, options = {}) { return (cards || []).map((item, index) => cardMarkup(item, index, { ...options, selected: options.selected?.has(index) })).join(""); }
  function opponentMarkup(name, count, extra = "") { return `<div class="opponent-card"><strong>${name}</strong><span>${count} ${t("cards")}${extra ? ` · ${extra}` : ""}</span></div>`; }
  function makePegBoard(player, ai) {
    const cells = Array.from({ length: 61 }, (_, index) => `<span class="card-peg ${index === Math.min(player, 60) ? "is-current is-player" : index < player ? "is-player" : ""} ${index === Math.min(ai, 60) ? "is-current is-ai" : index < ai ? "is-ai" : ""}"></span>`).join("");
    return `<div class="card-peg-board" aria-label="${t("score")}"><div class="card-peg-row">${cells}</div><div class="card-game-topbar"><small>${t("score")}: ${player}</small><small>${t("target")}: 121</small><small>${t("score")}: ${ai}</small></div></div>`;
  }

  function countMelds(hand) {
    const used = new Set();
    const groups = [];
    const byRank = new Map();
    hand.forEach((item, index) => { const list = byRank.get(item.rank) || []; list.push(index); byRank.set(item.rank, list); });
    byRank.forEach((indices) => { if (indices.length >= 3) { groups.push(indices.slice()); indices.forEach((index) => used.add(index)); } });
    const suits = new Map();
    hand.forEach((item, index) => { const list = suits.get(item.suit) || []; list.push({ index, rank: item.rank }); suits.set(item.suit, list); });
    suits.forEach((items) => {
      items.sort((a, b) => a.rank - b.rank);
      let run = [];
      items.forEach((entry) => {
        if (run.length && entry.rank !== run.at(-1).rank + 1) run = [];
        run.push(entry);
        if (run.length >= 3) run.forEach((part) => used.add(part.index));
      });
    });
    return { points: hand.reduce((total, item, index) => total + (used.has(index) ? 0 : value(item)), 0), groups };
  }

  function trickWinner(trick, trump = null) {
    const lead = trick[0]?.card.suit;
    return trick.reduce((best, entry) => {
      if (!best) return entry;
      const bestTrump = trump && best.card.suit === trump;
      const currentTrump = trump && entry.card.suit === trump;
      if (currentTrump && !bestTrump) return entry;
      if (currentTrump === bestTrump && entry.card.suit === (bestTrump ? trump : lead) && best.card.suit !== trump && entry.card.rank > best.card.rank) return entry;
      return best;
    }, null)?.player;
  }

  function chooseAiCard(hand, legal, mode = "low") {
    if (!legal.length) return null;
    const sorted = [...legal].sort((a, b) => (mode === "high" ? b.rank - a.rank : a.rank - b.rank));
    return sorted[Math.floor(Math.random() * Math.min(sorted.length, mode === "high" ? 3 : 4))];
  }

  function mountCardGame({ id }) {
    const rootElement = document.body;
    const main = document.querySelector("#mainScreen");
    const battle = document.querySelector("#battleScreen");
    const loading = document.querySelector("#loadingPanel");
    const table = document.querySelector("#cardGameTable");
    const opponents = document.querySelector("#cardGameOpponents");
    const center = document.querySelector("#cardGameCenter");
    const hand = document.querySelector("#cardGameHand");
    const actions = document.querySelector("#cardGameActions");
    const status = document.querySelector("#cardGameStatus");
    const statusText = document.querySelector("#cardGameStatusText");
    const result = document.querySelector("#resultOverlay");
    const resultTitle = document.querySelector("#resultTitle");
    const resultText = document.querySelector("#resultText");
    const audioButton = document.querySelector("#soundBtn");
    const localeSelect = document.querySelector("#localeSelect");
    if (!main || !battle || !table || !hand || !actions) return;
    rootElement.dataset.wpCardGame = id;
    const title = TITLES[id]?.[currentLocale()] || TITLES[id]?.en || id;
    document.querySelectorAll("img.cover").forEach((image) => {
      image.src = `../../assets/card-games-${id}-cover.webp`;
      image.alt = title;
    });
    document.querySelectorAll("[data-card-title]").forEach((node) => { node.textContent = title; node.setAttribute("data-runtime-localize", "off"); });
    document.querySelectorAll("[data-card-summary]").forEach((node) => { node.textContent = gameSummary(id); });
    if (localeSelect) localeSelect.value = currentLocale();
    if (loading) { loading.hidden = true; loading.remove(); }
    let sound = root.WPCardEngine?.SoundEngine ? new root.WPCardEngine.SoundEngine("card_games_next_sound_v1") : null;
    let resultRecorded = false;
    const statsKey = `weightplay.cardgame.stats.${id}`;
    const readStats = () => { try { return JSON.parse(localStorage.getItem(statsKey) || "{\"played\":0,\"wins\":0,\"losses\":0}"); } catch (_error) { return { played: 0, wins: 0, losses: 0 }; } };
    const writeStats = (won) => { const stats = readStats(); stats.played += 1; stats[won ? "wins" : "losses"] += 1; try { localStorage.setItem(statsKey, JSON.stringify(stats)); } catch (_error) {} return stats; };
    const statsContainer = document.querySelector(".card-game-stats");
    const statsNode = document.createElement("div");
    statsNode.className = "card-stat card-stat-history";
    statsNode.setAttribute("aria-label", STAT_LABELS[currentLocale()] || STAT_LABELS.en);
    statsContainer?.append(statsNode);
    const updateStatsView = (stats = readStats()) => { statsNode.innerHTML = `<small>${STAT_LABELS[currentLocale()] || STAT_LABELS.en}</small><strong>${stats.wins}W · ${stats.losses}L</strong>`; };
    updateStatsView();
    let game;
    const controller = {
      id,
      openBattle() { resultRecorded = false; main.hidden = true; battle.hidden = false; rootElement.dataset.screen = "battle"; render(); },
      openMain() { battle.hidden = true; main.hidden = false; rootElement.dataset.screen = "main"; result.hidden = true; },
      result(won, message = "") { if (!resultRecorded) { resultRecorded = true; updateStatsView(writeStats(won)); } resultTitle.textContent = won ? t("winner") : t("loser"); resultText.textContent = message || (won ? t("roundOver") : t("roundOver")); result.hidden = false; sound?.[won ? "win" : "reject"]?.(); },
      beep(name = "place") { sound?.[name]?.(); },
    };
    const render = () => {
      if (!game) return;
      const view = game.view() || {};
      if (id === "casino" && !view.hand && view.opponents?.includes("0 cards")) controller.result(true, `${t("score")}: ${view.score}`);
      opponents.innerHTML = view.opponents || "";
      center.innerHTML = view.center || "";
      hand.innerHTML = view.hand || "";
      actions.innerHTML = view.actions || "";
      status.textContent = view.status || "";
      statusText.textContent = view.help || "";
      document.querySelector("#cardGameScore").textContent = view.score || "0";
      document.querySelector("#cardGamePhase").textContent = view.phase || title;
      if (view.cssClass) table.className = `card-table-center ${view.cssClass}`;
      if (view.refreshTimer) clearTimeout(view.refreshTimer);
    };
    const clickHandler = (event) => {
      const actionNode = event.target.closest("[data-action]");
      const cardNode = event.target.closest("[data-card-index]");
      if (actionNode) { game.action(actionNode.dataset.action, actionNode.dataset.value); controller.beep(actionNode.dataset.action === "flip" ? "flip" : "place"); render(); return; }
      if (cardNode && game.card) { game.card(Number(cardNode.dataset.cardIndex)); controller.beep("place"); render(); }
    };
    battle.addEventListener("click", clickHandler);
    document.querySelector("#battleBackBtn")?.addEventListener("click", () => controller.openMain());
    document.querySelector("#resultNewGame")?.addEventListener("click", () => { result.hidden = true; game.reset(); controller.openBattle(); });
    document.querySelector("#resultRestart")?.addEventListener("click", () => { resultRecorded = false; result.hidden = true; game.reset(); render(); });
    document.querySelector("#resultClose")?.addEventListener("click", () => { result.hidden = true; render(); });
    document.querySelector("#startBtn")?.addEventListener("click", () => { game.reset(); controller.openBattle(); });
    document.querySelector("#restartBtn")?.addEventListener("click", () => { game.reset(); controller.openBattle(); });
    document.querySelector("#newGameBtn")?.addEventListener("click", () => { game.reset(); controller.openBattle(); });
    document.querySelector("#battleRestartBtn")?.addEventListener("click", () => { game.reset(); render(); });
    document.querySelector("#battleNewBtn")?.addEventListener("click", () => { game.reset(); render(); });
    audioButton?.addEventListener("click", () => { const next = !sound?.enabled; sound?.setEnabled(next); audioButton.textContent = `${t("sound")}: ${next ? "On" : "Off"}`; });
    localeSelect?.addEventListener("change", () => { try { localStorage.setItem("weightPlayLocale", localeSelect.value); } catch (_error) {} window.location.reload(); });
    const ensureMainControls = () => {
      const copy = document.querySelector(".wp-standard-main-copy") || document.querySelector(".main-copy");
      if (!copy || copy.querySelector("[data-card-main-controls]")) return;
      const row = document.createElement("div");
      row.className = "card-main-controls";
      row.dataset.cardMainControls = "true";
      const restart = document.createElement("button");
      restart.type = "button";
      restart.className = "secondary-btn";
      restart.textContent = t("restart");
      restart.addEventListener("click", () => { game.reset(); controller.openBattle(); });
      const newGame = document.createElement("button");
      newGame.type = "button";
      newGame.className = "secondary-btn";
      newGame.textContent = t("newGame");
      newGame.addEventListener("click", () => { game.reset(); controller.openBattle(); });
      row.append(restart, newGame);
      copy.append(row);
    };
    game = GAME_BUILDERS[id]?.(controller) || makeFallback(controller, id);
    game.reset();
    render();
    const battleRenderTimer = window.setInterval(() => {
      if (!battle.hidden) render();
    }, 180);
    window.addEventListener("beforeunload", () => window.clearInterval(battleRenderTimer), { once: true });
    let mainControlAttempts = 0;
    const mainControlTimer = window.setInterval(() => { ensureMainControls(); mainControlAttempts += 1; if (document.querySelector("[data-card-main-controls]") || mainControlAttempts > 40) window.clearInterval(mainControlTimer); }, 50);
  }

  function gameSummary(id) {
    const summaries = {
      hearts: "Avoid penalty cards, follow suit, and decide whether to risk Shooting the Moon.",
      spades: "Bid your tricks, use spades as trump, and coordinate with an AI teammate.",
      "gin-rummy": "Draw and discard to build sets and runs while keeping Deadwood low.",
      "crazy-eights": "Match suit or rank, then use an Eight to change the active suit.",
      cribbage: "Choose a crib, score pairs/runs/fifteens, and peg your way toward 121.",
      "go-fish": "Ask for ranks, collect four-of-a-kind books, and read the table.",
      war: "Reveal cards together; tied ranks trigger a dramatic War.",
      speed: "Play one rank above or below the center cards in a race against the AI.",
      "old-maid": "Pair ranks, draw from the next hand, and avoid being left with the Old Maid.",
      casino: "Capture table cards by rank or sum, then score cards and special bonuses.",
    };
    return summaries[id] || summaries.hearts;
  }

  function makeFallback(controller, id) {
    return { reset() {}, view() { return { phase: TITLES[id]?.en || id, help: gameSummary(id), hand: "", opponents: "", center: "", actions: "" }; }, action() {}, card() {} };
  }

  function makeHearts(controller) {
    const s = { hands: [], scores: [0, 0, 0, 0], turn: 0, lead: 0, trick: [], heartsBroken: false, phase: "pass", selected: new Set(), passReceived: false, winner: null };
    const aiNames = ["You", "Orchid", "Mango", "Nova"];
    const legal = (handCards, trick) => { const leadSuit = trick[0]?.card.suit; const following = leadSuit ? handCards.filter((item) => item.suit === leadSuit) : []; return following.length ? following : handCards.filter((item) => s.heartsBroken || (item.suit !== "hearts" && !(item.suit === "spades" && item.rank === 12)) || handCards.every((candidate) => candidate.suit === "hearts" || (candidate.suit === "spades" && candidate.rank === 12))); };
    const scoreTrick = () => { const points = s.trick.reduce((total, entry) => total + (entry.card.suit === "hearts" ? 1 : entry.card.suit === "spades" && entry.card.rank === 12 ? 13 : 0), 0); const winner = trickWinner(s.trick); s.scores[winner] += points; if (s.trick.some((entry) => entry.card.suit === "hearts")) s.heartsBroken = true; s.trick = []; s.turn = winner; s.lead = winner; return { points, winner }; };
    const finish = () => { const moon = s.scores.findIndex((score) => score === 26); if (moon >= 0) { s.scores = s.scores.map((score, index) => index === moon ? score - 26 : score + 26); } const playerWon = s.scores[0] === Math.min(...s.scores); controller.result(playerWon, `${t("score")}: ${s.scores[0]} · ${t("points")}: ${s.scores.join(" / ")}`); };
    const play = (player, item) => { const handCards = s.hands[player]; const index = handCards.indexOf(item); if (index < 0) return; const legalCards = legal(handCards, s.trick); if (!legalCards.includes(item)) return; if (!s.trick.length && player === 0 && s.hands[0].length === 13 && !(item.suit === "clubs" && item.rank === 2)) return; handCards.splice(index, 1); s.trick.push({ player, card: item }); if (item.suit === "hearts") s.heartsBroken = true; s.turn = (player + 1) % 4; if (s.trick.length === 4) { scoreTrick(); if (!s.hands.some((cards) => cards.length)) { finish(); return; } } if (s.turn !== 0) setTimeout(() => aiTurn(), 220); };
    const aiTurn = () => { if (s.phase !== "play" || s.turn === 0) return; const item = chooseAiCard(s.hands[s.turn], legal(s.hands[s.turn], s.trick), "low"); if (item) play(s.turn, item); };
    return {
      reset() { Object.assign(s, { hands: [[], [], [], []], scores: [0, 0, 0, 0], turn: 0, lead: 0, trick: [], heartsBroken: false, phase: "pass", selected: new Set(), passReceived: false }); deck().forEach((item, index) => s.hands[index % 4].push(item)); s.hands.forEach((cards) => cards.sort((a, b) => a.suit.localeCompare(b.suit) || a.rank - b.rank)); },
      card(index) { if (s.phase === "pass" && s.turn === 0) { if (s.selected.has(index)) s.selected.delete(index); else if (s.selected.size < 3) s.selected.add(index); } else if (s.phase === "play" && s.turn === 0) play(0, s.hands[0][index]); },
      action(action) { if (action === "pass" && s.phase === "pass" && s.selected.size === 3) { const selected = [...s.selected].sort((a, b) => b - a).map((index) => s.hands[0].splice(index, 1)[0]); selected.forEach((item) => s.hands[1].push(item)); const aiPass = s.hands[1].slice(0, 3); aiPass.forEach((item) => s.hands[1].splice(s.hands[1].indexOf(item), 1)); s.hands[0].push(...aiPass); s.hands.forEach((cards) => cards.sort((a, b) => a.suit.localeCompare(b.suit) || a.rank - b.rank)); s.phase = "play"; s.turn = s.hands.findIndex((cards) => cards.some((item) => item.suit === "clubs" && item.rank === 2)); if (s.turn !== 0) setTimeout(() => aiTurn(), 220); } },
      view() { const trickHtml = s.trick.map((entry) => `<div>${aiNames[entry.player]} ${cardMarkup(entry.card, 0)}</div>`).join(""); const action = s.phase === "pass" ? `<button class="primary-btn" data-action="pass" ${s.selected.size !== 3 ? "disabled" : ""}>${t("pass")} 3</button>` : `<p class="card-help">${s.heartsBroken ? "♥ " : ""}${t("yourTurn")}</p>`; return { phase: s.phase === "pass" ? t("pass") : (s.heartsBroken ? "♥" : "♥ · " + t("waiting")), status: s.turn === 0 ? t("yourTurn") : t("aiTurn"), help: s.phase === "pass" ? `${t("selectCards")}: ${s.selected.size}/3` : "Follow suit. Hearts and Q♠ are penalty cards.", score: s.scores[0], opponents: s.hands.slice(1).map((cards, index) => opponentMarkup(aiNames[index + 1], cards.length, `${t("points")}: ${s.scores[index + 1]}`)).join(""), center: `<div class="card-table-label">${t("table")}</div><div class="table-row">${trickHtml || "<span>2♣ leads the first trick</span>"}</div>`, hand: cardsMarkup(s.hands[0], { selected: s.selected, hidden: false }), actions: action }; },
    };
  }

  function makeSpades(controller) {
    const s = { hands: [[], [], [], []], bids: [null, null, null, null], tricks: [0, 0], turn: 0, trick: [], phase: "bid", scores: [0, 0] };
    const names = ["You", "AI North", "AI East", "AI West"];
    const legal = (cards) => { const lead = s.trick[0]?.card.suit; const suited = lead ? cards.filter((item) => item.suit === lead) : []; return suited.length ? suited : cards; };
    const finish = () => { const own = s.tricks[0] >= s.bids[0] + s.bids[2]; const enemy = s.tricks[1] >= s.bids[1] + s.bids[3]; s.scores[0] += own ? 10 * (s.bids[0] + s.bids[2]) + Math.max(0, s.tricks[0] - s.bids[0] - s.bids[2]) : -10 * (s.bids[0] + s.bids[2]); s.scores[1] += enemy ? 10 * (s.bids[1] + s.bids[3]) + Math.max(0, s.tricks[1] - s.bids[1] - s.bids[3]) : -10 * (s.bids[1] + s.bids[3]); controller.result(s.scores[0] >= s.scores[1], `${t("score")}: ${s.scores[0]} — ${s.scores[1]}`); };
    const play = (player, item) => { const cards = s.hands[player]; if (!legal(cards).includes(item)) return; cards.splice(cards.indexOf(item), 1); s.trick.push({ player, card: item }); s.turn = (player + 1) % 4; if (s.trick.length === 4) { const winner = trickWinner(s.trick, "spades"); s.tricks[winner % 2 === 0 ? 0 : 1] += 1; s.trick = []; s.turn = winner; if (!s.hands[0].length) { finish(); return; } } if (s.turn !== 0) setTimeout(aiTurn, 180); };
    const aiTurn = () => { if (s.phase !== "play" || s.turn === 0) return; play(s.turn, chooseAiCard(s.hands[s.turn], legal(s.hands[s.turn]), s.turn % 2 ? "low" : "high")); };
    return { reset() { Object.assign(s, { hands: [[], [], [], []], bids: [null, null, null, null], tricks: [0, 0], turn: 0, trick: [], phase: "bid", scores: [0, 0] }); deck().forEach((item, index) => s.hands[index % 4].push(item)); }, card(index) { if (s.phase === "play" && s.turn === 0) play(0, s.hands[0][index]); }, action(action, selected) { if (s.phase === "bid" && action === "bid") { s.bids[0] = Number(selected); s.bids[1] = 2 + Math.floor(Math.random() * 3); s.bids[2] = 2 + Math.floor(Math.random() * 4); s.bids[3] = 2 + Math.floor(Math.random() * 3); s.phase = "play"; s.turn = 0; } }, view() { const bidControls = Array.from({ length: 14 }, (_, i) => `<button class="secondary-btn" data-action="bid" data-value="${i}" ${s.bids[0] !== null ? "disabled" : ""}>${i}</button>`).join(""); return { phase: s.phase === "bid" ? t("bid") : `${t("score")}: ${s.scores[0]} / ${s.scores[1]}`, status: s.turn === 0 ? t("yourTurn") : t("aiTurn"), help: s.phase === "bid" ? "Bid the tricks your team expects to take. ♠ is always trump." : "Follow suit when possible; a spade wins the trick.", score: s.scores[0], opponents: names.slice(1).map((name, index) => opponentMarkup(name, s.hands[index + 1].length, `${t("bid")}: ${s.bids[index + 1] ?? "—"}`)).join(""), center: `<div class="card-table-label">${t("table")} · ${s.tricks[0]} / ${s.tricks[1]}</div><div class="table-row">${s.trick.map((entry) => cardMarkup(entry.card, 0)).join("") || `♠ ${t("waiting")}`}</div>`, hand: cardsMarkup(s.hands[0]), actions: s.phase === "bid" ? `<div class="card-choice-panel">${bidControls}</div>` : "" }; } };
  }

  function makeCrazyEights(controller) {
    const s = { hands: [[], [], [], []], stock: [], discard: [], activeSuit: null, pendingSuit: false, turn: 0, phase: "play" };
    const names = ["You", "AI North", "AI East", "AI West"];
    const legal = (item) => item.rank === 8 || item.suit === s.activeSuit || item.rank === s.discard.at(-1)?.rank;
    const draw = (player) => { if (s.stock.length) s.hands[player].push(s.stock.pop()); };
    const finish = (player) => { controller.result(player === 0, `${names[player]} · ${s.hands[player].length === 0 ? "0" : s.hands[player].length} ${t("cards")}`); };
    const next = () => { s.turn = (s.turn + 1) % 4; if (s.turn !== 0) setTimeout(aiTurn, 260); };
    const play = (player, item) => { if (!item || !legal(item)) return; s.hands[player].splice(s.hands[player].indexOf(item), 1); s.discard.push(item); if (!s.hands[player].length) { finish(player); return; } if (item.rank === 8) { s.activeSuit = player === 0 ? null : SUITS[Math.floor(Math.random() * SUITS.length)]; s.pendingSuit = player === 0; if (!s.pendingSuit) next(); } else { s.activeSuit = item.suit; s.pendingSuit = false; next(); } };
    const aiTurn = () => { if (s.turn === 0) return; const item = chooseAiCard(s.hands[s.turn].filter(legal), s.hands[s.turn].filter(legal), "low"); if (item) play(s.turn, item); else { draw(s.turn); if (s.hands[s.turn].at(-1) && legal(s.hands[s.turn].at(-1))) play(s.turn, s.hands[s.turn].at(-1)); else next(); } };
    return { reset() { Object.assign(s, { hands: [[], [], [], []], stock: deck(), discard: [], activeSuit: null, turn: 0, phase: "play" }); for (let i = 0; i < 5; i += 1) s.hands.forEach((cards) => cards.push(s.stock.pop())); s.discard.push(s.stock.pop()); s.activeSuit = s.discard[0].suit; }, card(index) { if (s.turn !== 0) return; const item = s.hands[0][index]; if (item?.rank === 8) { s.hands[0].splice(index, 1); s.discard.push(item); s.activeSuit = null; if (!s.hands[0].length) finish(0); else s.turn = 1, setTimeout(aiTurn, 220); } else if (item) play(0, item); }, action(action, selected) { if (action === "draw" && s.turn === 0) { draw(0); if (s.hands[0].at(-1) && legal(s.hands[0].at(-1))) play(0, s.hands[0].at(-1)); } if (action === "suit" && s.turn === 0 && s.activeSuit === null) { s.activeSuit = selected; s.turn = 1; setTimeout(aiTurn, 220); } }, view() { return { phase: `${t("play")} · ${SYMBOLS[s.activeSuit] || "8"}`, status: s.turn === 0 ? t("yourTurn") : t("aiTurn"), help: s.activeSuit ? `${t("play")}: ${rankText(s.discard.at(-1).rank)}${SYMBOLS[s.activeSuit]}` : t("chooseSuit"), score: s.hands[0].length, opponents: names.slice(1).map((name, index) => opponentMarkup(name, s.hands[index + 1].length)).join(""), center: `<div class="card-table-label">${t("discard")}</div><div class="table-row">${cardMarkup(s.discard.at(-1), 0)}${s.stock.length ? `<button class="playing-card is-face-down" data-action="draw" aria-label="${t("draw")}"></button>` : ""}</div>${s.activeSuit === null ? `<div class="card-choice-panel">${SUITS.map((suit) => `<button class="secondary-btn" data-action="suit" data-value="${suit}">${SYMBOLS[suit]}</button>`).join("")}</div>` : ""}`, hand: cardsMarkup(s.hands[0]), actions: `<button class="secondary-btn" data-action="draw">${t("draw")}</button>` }; } };
  }

  function makeGinRummy(controller) {
    const s = { player: [], ai: [], stock: [], discard: [], turn: 0, drawn: false, phase: "draw", selected: new Set(), score: [0, 0] };
    const finish = (winner, reason) => { controller.result(winner === 0, `${reason} · ${t("score")}: ${s.score[0]} / ${s.score[1]}`); };
    const drawCard = (fromDiscard = false) => { const item = fromDiscard ? s.discard.pop() : s.stock.pop(); if (item) s.player.push(item); s.drawn = true; };
    const endHand = () => { const playerMeld = countMelds(s.player).points; const aiMeld = countMelds(s.ai).points; const player = Math.max(0, 10 - playerMeld); const ai = Math.max(0, 10 - aiMeld); const winner = player <= ai ? 0 : 1; s.score[winner] += Math.max(1, Math.abs(player - ai) + (player === 0 ? 25 : 0)); finish(winner, `Deadwood ${player} / ${ai}`); };
    const aiTurn = () => { if (s.turn !== 1) return; if (s.discard.length && Math.random() > .45) s.ai.push(s.discard.pop()); else if (s.stock.length) s.ai.push(s.stock.pop()); const meld = countMelds(s.ai); const discardIndex = s.ai.reduce((best, item, index) => value(item) > value(s.ai[best]) ? index : best, 0); const discarded = s.ai.splice(discardIndex, 1)[0]; if (discarded) s.discard.push(discarded); if (meld.points <= 2) endHand(); else { s.turn = 0; s.phase = "draw"; s.drawn = false; } };
    return { reset() { Object.assign(s, { player: [], ai: [], stock: deck(), discard: [], turn: 0, drawn: false, phase: "draw", selected: new Set(), score: [0, 0] }); for (let i = 0; i < 10; i += 1) { s.player.push(s.stock.pop()); s.ai.push(s.stock.pop()); } s.discard.push(s.stock.pop()); }, card(index) { if (s.turn !== 0) return; if (!s.drawn) return; if (s.selected.has(index)) s.selected.delete(index); else s.selected = new Set([index]); }, action(action) { if (s.turn !== 0) return; if (action === "draw-stock" && !s.drawn) drawCard(false); if (action === "draw-discard" && !s.drawn) drawCard(true); if (action === "discard" && s.drawn && s.selected.size === 1) { const index = [...s.selected][0]; s.discard.push(s.player.splice(index, 1)[0]); s.selected.clear(); s.turn = 1; s.phase = "draw"; s.drawn = false; setTimeout(aiTurn, 320); } if (action === "knock" && s.drawn && countMelds(s.player).points <= 10) endHand(); }, view() { const meld = countMelds(s.player); return { phase: s.turn === 0 ? (s.drawn ? t("discard") : t("draw")) : t("aiTurn"), status: s.turn === 0 ? t("yourTurn") : t("aiTurn"), help: `Meld ${s.player.length - meld.points}/${s.player.length} · Deadwood ${meld.points}`, score: s.score[0], opponents: opponentMarkup("AI", s.ai.length, `${t("score")}: ${s.score[1]}`), center: `<div class="card-table-label">${t("stock")} · ${s.stock.length} · ${t("discard")}</div><div class="table-row"><button class="playing-card is-face-down" data-action="draw-stock" aria-label="${t("stock")}"></button>${cardMarkup(s.discard.at(-1), 0, { className: "is-selected" })}</div>`, hand: cardsMarkup(s.player, { selected: s.selected }), actions: `<button class="secondary-btn" data-action="draw-stock" ${s.drawn ? "disabled" : ""}>${t("draw")} ${t("stock")}</button><button class="secondary-btn" data-action="draw-discard" ${s.drawn ? "disabled" : ""}>${t("draw")} ${t("discard")}</button><button class="primary-btn" data-action="discard" ${!s.drawn || s.selected.size !== 1 ? "disabled" : ""}>${t("discard")}</button><button class="secondary-btn" data-action="knock" ${!s.drawn ? "disabled" : ""}>${t("knock")}</button>` }; } };
  }

  function makeGoFish(controller) {
    const s = { players: [], stock: [], turn: 0, selectedOpponent: 1, selectedRank: null, books: [0, 0, 0, 0], playerCount: 4 };
    const names = ["You", "Otter", "Fox", "Panda"];
    const removeBooks = (player) => { for (let rank = 1; rank <= 13; rank += 1) { if (s.players[player].filter((item) => item.rank === rank).length === 4) { s.players[player] = s.players[player].filter((item) => item.rank !== rank); s.books[player] += 1; } } };
    const finish = () => { const max = Math.max(...s.books); const winner = s.books.indexOf(max); controller.result(winner === 0, `${t("booksMade")}: ${s.books.join(" / ")}`); };
    const next = () => { s.turn = (s.turn + 1) % s.playerCount; if (s.turn !== 0) setTimeout(aiTurn, 300); };
    const ask = (target, rank) => { const matching = s.players[target].filter((item) => item.rank === rank); if (matching.length) { s.players[target] = s.players[target].filter((item) => item.rank !== rank); s.players[0].push(...matching); removeBooks(0); } else if (s.stock.length) { s.players[0].push(s.stock.pop()); } else next(); if (matching.length) { s.selectedRank = null; } else next(); if (!s.stock.length && s.players.every((cards) => !cards.length)) finish(); };
    const aiTurn = () => { if (s.turn === 0) return; const ranks = [...new Set(s.players[s.turn].map((item) => item.rank))]; if (!ranks.length) { next(); return; } const target = s.turn === 1 ? 0 : Math.floor(Math.random() * s.playerCount); const rank = ranks[Math.floor(Math.random() * ranks.length)]; const matching = s.players[target].filter((item) => item.rank === rank); if (matching.length) { s.players[s.turn].push(...matching); s.players[target] = s.players[target].filter((item) => item.rank !== rank); removeBooks(s.turn); } else if (s.stock.length) s.players[s.turn].push(s.stock.pop()); removeBooks(s.turn); next(); };
    return { reset() { Object.assign(s, { players: [[], [], [], []], stock: deck(), turn: 0, selectedOpponent: 1, selectedRank: null, books: [0, 0, 0, 0], playerCount: 4 }); for (let i = 0; i < 5; i += 1) s.players.forEach((cards) => cards.push(s.stock.pop())); s.players.forEach((_, index) => removeBooks(index)); }, card() {}, action(action, valueArg) { if (s.turn !== 0) return; if (action === "opponent") s.selectedOpponent = Number(valueArg); if (action === "rank") s.selectedRank = Number(valueArg); if (action === "ask" && s.selectedRank) ask(s.selectedOpponent, s.selectedRank); }, view() { const rankControls = RANKS.map((rank, index) => `<button class="secondary-btn" data-action="rank" data-value="${index + 1}">${rank}</button>`).join(""); return { phase: t("ask"), status: t("yourTurn"), help: `${t("ask")}: ${names[s.selectedOpponent]} · ${t("chooseRank")}`, score: s.books[0], opponents: names.slice(1).map((name, index) => `<button class="opponent-card" data-action="opponent" data-value="${index + 1}"><strong>${name}</strong><span>${s.players[index + 1].length} ${t("cards")} · ${s.books[index + 1]} ${t("books")}</span></button>`).join(""), center: `<div class="card-table-label">${t("stock")}: ${s.stock.length}</div><div class="table-row"><button class="playing-card is-face-down" data-action="draw" aria-label="${t("stock")}"></button><span>${s.books[0]} ${t("books")}</span></div><div class="card-choice-panel">${rankControls}</div>`, hand: cardsMarkup(s.players[0]), actions: `<button class="primary-btn" data-action="ask" ${!s.selectedRank ? "disabled" : ""}>${t("ask")}</button>` }; } };
  }

  function makeWar(controller) {
    const s = { player: [], ai: [], pot: [], phase: "ready", last: null, war: false, playerCard: null, aiCard: null };
    const drawBattle = () => { if (!s.player.length || !s.ai.length) { controller.result(Boolean(s.player.length), `${t("cards")}: ${s.player.length} / ${s.ai.length}`); return; } s.playerCard = s.player.shift(); s.aiCard = s.ai.shift(); s.pot.push(s.playerCard, s.aiCard); s.phase = "reveal"; if (s.playerCard.rank === s.aiCard.rank) { s.war = true; s.phase = "war"; } else { settle(); } };
    const settle = () => { const playerWins = s.playerCard.rank > s.aiCard.rank; const winner = playerWins ? s.player : s.ai; winner.push(...s.pot.sort(() => Math.random() - .5)); s.pot = []; s.phase = "ready"; s.war = false; if (!s.player.length || !s.ai.length) controller.result(playerWins, `${t("cards")}: ${s.player.length} / ${s.ai.length}`); };
    const addWar = () => { if (s.player.length < 4 || s.ai.length < 4) { s.player.push(...s.pot); s.pot = []; controller.result(Boolean(s.player.length), t("war")); return; } s.pot.push(...s.player.splice(0, 3), ...s.ai.splice(0, 3)); s.playerCard = s.player.shift(); s.aiCard = s.ai.shift(); s.pot.push(s.playerCard, s.aiCard); if (s.playerCard.rank !== s.aiCard.rank) settle(); else s.phase = "war"; };
    return { reset() { const cards = deck(); Object.assign(s, { player: cards.slice(0, 26), ai: cards.slice(26), pot: [], phase: "ready", last: null, war: false, playerCard: null, aiCard: null }); }, card() {}, action(action) { if (action === "flip" && s.phase === "ready") drawBattle(); else if (action === "flip" && s.phase === "war") addWar(); }, view() { return { phase: s.war ? t("war") : t("flip"), status: t("yourTurn"), help: s.war ? "Place three cards down, then reveal the next card." : "Flip together and watch the collision.", score: s.player.length, opponents: opponentMarkup("AI", s.ai.length), center: `<div class="card-table-label">${t("war")}</div><div class="table-row ${s.war ? "card-war-flash" : ""}">${s.playerCard ? cardMarkup(s.playerCard, 0) : ""}${s.aiCard ? cardMarkup(s.aiCard, 0) : ""}</div><div>${t("cards")}: ${s.pot.length}</div>`, hand: `<div class="card-help">${s.player.length} ${t("cards")}</div>`, actions: `<button class="primary-btn" data-action="flip">${s.war ? t("war") : t("flip")}</button>` }; } };
  }

  function makeWarFixed(controller) {
    const s = { player: [], ai: [], pot: [], phase: "ready", playerCard: null, aiCard: null };
    const finish = (playerWins) => controller.result(playerWins, `${t("cards")}: ${s.player.length} / ${s.ai.length}`);
    const settle = () => {
      const playerWins = s.playerCard.rank > s.aiCard.rank;
      (playerWins ? s.player : s.ai).push(...s.pot.sort(() => Math.random() - 0.5));
      s.pot = [];
      s.phase = "ready";
      if (!s.player.length || !s.ai.length) finish(playerWins);
    };
    const reveal = () => {
      if (!s.player.length || !s.ai.length) { finish(Boolean(s.player.length)); return; }
      s.playerCard = s.player.shift();
      s.aiCard = s.ai.shift();
      s.pot.push(s.playerCard, s.aiCard);
      if (s.playerCard.rank === s.aiCard.rank) s.phase = "war";
      else settle();
    };
    const continueWar = () => {
      if (s.player.length < 4 || s.ai.length < 4) {
        const playerWins = s.player.length >= 4;
        (playerWins ? s.player : s.ai).push(...s.pot);
        s.pot = [];
        finish(playerWins);
        return;
      }
      s.pot.push(...s.player.splice(0, 3), ...s.ai.splice(0, 3));
      reveal();
    };
    return {
      reset() { const cards = deck(); Object.assign(s, { player: cards.slice(0, 26), ai: cards.slice(26), pot: [], phase: "ready", playerCard: null, aiCard: null }); },
      card() {},
      action(action) { if (action === "flip" && s.phase === "ready") reveal(); else if (action === "flip" && s.phase === "war") continueWar(); },
      view() { return { phase: s.phase === "war" ? t("war") : t("flip"), status: t("yourTurn"), help: s.phase === "war" ? "Place three cards down, then reveal the next card." : "Flip together and watch the collision.", score: s.player.length, opponents: opponentMarkup("AI", s.ai.length), center: `<div class="card-table-label">${t("war")}</div><div class="table-row ${s.phase === "war" ? "card-war-flash" : ""}">${s.playerCard ? cardMarkup(s.playerCard, 0) : ""}${s.aiCard ? cardMarkup(s.aiCard, 0) : ""}</div><div>${t("cards")}: ${s.pot.length}</div>`, hand: `<div class="card-help">${s.player.length} ${t("cards")}</div>`, actions: `<button class="primary-btn" data-action="flip">${s.phase === "war" ? t("war") : t("flip")}</button>` }; }
    };
  }

  function makeSpeed(controller) {
    const s = { hand: [], stock: [], aiHand: [], aiStock: [], centers: [], turn: true, timer: null, over: false };
    const canPlay = (item, centerCard) => item && centerCard && (item.rank === centerCard.rank + 1 || item.rank === centerCard.rank - 1 || (item.rank === 1 && centerCard.rank === 13) || (item.rank === 13 && centerCard.rank === 1));
    const refill = () => { while (s.hand.length < 5 && s.stock.length) s.hand.push(s.stock.pop()); while (s.aiHand.length < 5 && s.aiStock.length) s.aiHand.push(s.aiStock.pop()); };
    const check = () => { if ((!s.hand.length && !s.stock.length) || (!s.aiHand.length && !s.aiStock.length)) { s.over = true; controller.result(!s.hand.length && !s.stock.length, `${t("cards")}: ${s.hand.length + s.stock.length} / ${s.aiHand.length + s.aiStock.length}`); clearTimeout(s.timer); } };
    const aiLoop = () => { if (s.over) return; const candidates = s.aiHand.flatMap((item, index) => s.centers.map((centerCard, centerIndex) => canPlay(item, centerCard) ? { item, index, centerIndex } : [])); if (candidates.length) { const pick = candidates[Math.floor(Math.random() * candidates.length)]; s.aiHand.splice(pick.index, 1); s.centers[pick.centerIndex] = pick.item; refill(); } else if (s.aiStock.length) { s.centers[0] = s.stock.length ? s.stock.pop() : s.centers[0]; s.centers[1] = s.aiStock.pop(); } check(); s.timer = setTimeout(aiLoop, 420); };
    return { reset() { const cards = deck(); Object.assign(s, { hand: cards.splice(0, 20), stock: cards.splice(0, 6), aiHand: cards.splice(0, 20), aiStock: cards, centers: [deck()[0], deck()[1]], turn: true, over: false }); refill(); clearTimeout(s.timer); s.timer = setTimeout(aiLoop, 420); }, card(index) { if (s.over) return; const item = s.hand[index]; const centerIndex = s.centers.findIndex((centerCard) => canPlay(item, centerCard)); if (centerIndex < 0) return; s.hand.splice(index, 1); s.centers[centerIndex] = item; refill(); check(); }, action() {}, view() { return { phase: "Speed", status: t("yourTurn"), help: "Play immediately: one rank above or below either center card.", score: s.hand.length + s.stock.length, opponents: opponentMarkup("AI", s.aiHand.length + s.aiStock.length), center: `<div class="card-speed-lane"><div class="card-speed-pile">${cardMarkup(s.centers[0], 0)}</div><div class="card-speed-pile">${cardMarkup(s.centers[1], 0)}</div></div>`, hand: cardsMarkup(s.hand), actions: `<span class="card-help">${s.stock.length} ${t("stock")} · ${s.aiStock.length} ${t("cards")} ${t("waiting")}</span>` }; } };
  }

  function makeOldMaid(controller) {
    const s = { players: [[], [], [], []], turn: 0, selected: 0, books: [0, 0, 0, 0], over: false };
    const names = ["You", "Fox", "Panda", "Otter"];
    const pair = (player) => { const byRank = new Map(); s.players[player].forEach((item, index) => { const list = byRank.get(item.rank) || []; list.push(index); byRank.set(item.rank, list); }); [...byRank.values()].filter((list) => list.length >= 2).forEach((list) => { const indexes = list.slice(0, 2).sort((a, b) => b - a); indexes.forEach((index) => s.players[player].splice(index, 1)); s.books[player] += 1; }); };
    const finishIfDone = () => { const active = s.players.filter((cards) => cards.length); if (active.length <= 1) { const loser = s.players.findIndex((cards) => cards.length); controller.result(loser !== 0, loser === 0 ? t("oldMaid") : `${names[loser]} ${t("oldMaid")}`); s.over = true; } };
    const next = () => { s.turn = (s.turn + 1) % 4; while (!s.players[s.turn].length && s.players.some((cards) => cards.length)) s.turn = (s.turn + 1) % 4; if (s.turn !== 0) setTimeout(aiTurn, 320); };
    const drawFrom = (player, index) => { const target = (player + 1) % 4; const source = s.players[target]; if (!source.length) return; const item = source.splice(Math.min(index, source.length - 1), 1)[0]; s.players[player].push(item); pair(player); finishIfDone(); if (!s.over) next(); };
    const aiTurn = () => { if (s.turn === 0 || s.over) return; drawFrom(s.turn, Math.floor(Math.random() * s.players[(s.turn + 1) % 4].length)); };
    return { reset() { const cards = deck(); const oldMaidIndex = cards.findIndex((item) => item.suit === "spades" && item.rank === 12); const oldMaid = cards.splice(oldMaidIndex, 1)[0]; oldMaid.oldMaid = true; Object.assign(s, { players: [[], [], [], []], turn: 0, selected: 0, books: [0, 0, 0, 0], over: false }); cards.push(oldMaid); cards.forEach((item, index) => s.players[index % 4].push(item)); s.players.forEach(pair); }, card(index) { if (s.turn === 0 && !s.over) drawFrom(0, index); }, action() {}, view() { const target = s.players[1]; return { phase: t("oldMaid"), status: s.turn === 0 ? t("yourTurn") : t("aiTurn"), help: `Draw one hidden card from ${names[(s.turn + 1) % 4]}. Pairs disappear automatically.`, score: s.books[0], opponents: names.slice(1).map((name, index) => opponentMarkup(name, s.players[index + 1].length, `${s.books[index + 1]} ${t("pairs")}`)).join(""), center: `<div class="card-table-label">${t("oldMaid")}</div><div class="table-row">${target.map((_, index) => cardMarkup({ faceDown: true }, index)).join("")}</div>`, hand: cardsMarkup(s.players[0]), actions: "" }; } };
  }

  function makeCasino(controller) {
    const s = { player: [], ai: [], stock: [], table: [], captured: [[], []], selectedCard: null, selectedTable: new Set(), phase: "play", score: [0, 0] };
    const tableValue = (entry) => entry.buildValue || value(entry.card);
    const combinations = (items, target) => { const output = []; const walk = (start, chosen, total) => { if (total === target && chosen.length) output.push(chosen.slice()); if (total >= target) return; for (let i = start; i < items.length; i += 1) walk(i + 1, [...chosen, i], total + tableValue(items[i])); }; walk(0, [], 0); return output; };
    const capture = (indices, cardIndex) => { const item = s.player.splice(cardIndex, 1)[0]; const picked = indices.map((index) => s.table[index]); s.table = s.table.filter((_, index) => !indices.includes(index)); s.captured[0].push(item, ...picked.map((entry) => entry.card)); s.selectedCard = null; s.selectedTable.clear(); aiTurn(); };
    const scoreCasino = (cards) => cards.reduce((score, item) => score + (item.suit === "spades" ? 1 : 0) + (item.suit === "diamonds" && item.rank === 10 ? 2 : 0) + (item.suit === "spades" && item.rank === 2 ? 2 : 0), score) + (cards.length >= 27 ? 3 : 0);
    const finish = () => { const playerScore = scoreCasino(s.captured[0]); const aiScore = scoreCasino(s.captured[1]); controller.result(playerScore >= aiScore, `${t("score")}: ${playerScore} / ${aiScore}`); };
    const aiTurn = () => { if (!s.ai.length) { if (s.stock.length) { for (let i = 0; i < 4 && s.stock.length; i += 1) { s.player.push(s.stock.pop()); if (s.stock.length) s.ai.push(s.stock.pop()); } } else { finish(); return; } } const aiCard = s.ai.pop(); const same = s.table.map((entry, index) => ({ entry, index })).filter(({ entry }) => tableValue(entry) === value(aiCard)); const combo = combinations(s.table, value(aiCard))[0]; if (same.length || combo) { const indices = same.length ? same.map((entry) => entry.index) : combo; s.captured[1].push(aiCard, ...indices.map((index) => s.table[index].card)); s.table = s.table.filter((_, index) => !indices.includes(index)); } else s.table.push({ card: aiCard }); if (!s.stock.length && (!s.ai.length || !s.player.length)) finish(); };
    return { reset() { Object.assign(s, { player: [], ai: [], stock: deck(), table: [], captured: [[], []], selectedCard: null, selectedTable: new Set(), phase: "play", score: [0, 0] }); for (let i = 0; i < 4; i += 1) { s.player.push(s.stock.pop()); s.ai.push(s.stock.pop()); s.table.push({ card: s.stock.pop() }); } }, card(index) { if (s.selectedCard === null) { s.selectedCard = index; return; } const tableIndex = index; if (tableIndex < s.table.length) { if (s.selectedTable.has(tableIndex)) s.selectedTable.delete(tableIndex); else s.selectedTable.add(tableIndex); } }, action(action) { if (action === "clear-selection") { s.selectedCard = null; s.selectedTable.clear(); } if (action === "capture" && s.selectedCard !== null) { const indices = [...s.selectedTable]; const item = s.player[s.selectedCard]; const valid = indices.length && (indices.some((index) => tableValue(s.table[index]) === value(item)) || combinations(s.table, value(item)).some((combo) => combo.length === indices.length && combo.every((index) => indices.includes(index)))); if (valid) capture(indices, s.selectedCard); } if (action === "build" && s.selectedCard !== null && s.selectedTable.size) { const item = s.player.splice(s.selectedCard, 1)[0]; const indices = [...s.selectedTable]; const built = { card: item, buildValue: value(item) + indices.reduce((total, index) => total + tableValue(s.table[index]), 0), buildCards: [item, ...indices.map((index) => s.table[index].card)] }; s.table = s.table.filter((_, index) => !indices.includes(index)); s.table.push(built); s.selectedCard = null; s.selectedTable.clear(); aiTurn(); } }, view() { const selectedItem = s.selectedCard === null ? null : s.player[s.selectedCard]; return { phase: t("capture"), status: t("yourTurn"), help: selectedItem ? `${t("selectCards")}: ${cardText(selectedItem)} · ${s.selectedTable.size}` : "Select a hand card, then table cards with the same value or a matching sum.", score: s.captured[0].length, opponents: opponentMarkup("AI", s.ai.length, `${t("cards")}: ${s.captured[1].length}`), center: `<div class="card-table-label">${t("table")}</div><div class="table-row">${s.table.map((entry, index) => entry.buildValue ? `<span class="card-build">${entry.buildCards.map((item) => cardMarkup(item, 0)).join("")}<small>=${entry.buildValue}</small></span>` : cardMarkup(entry.card, index, { selected: s.selectedTable.has(index) })).join("")}</div>`, hand: cardsMarkup(s.player, { selected: new Set(s.selectedCard === null ? [] : [s.selectedCard]) }), actions: `<button class="primary-btn" data-action="capture" ${s.selectedCard === null || !s.selectedTable.size ? "disabled" : ""}>${t("capture")}</button><button class="secondary-btn" data-action="build" ${s.selectedCard === null || !s.selectedTable.size ? "disabled" : ""}>${t("build")}</button><button class="secondary-btn" data-action="clear-selection">${t("close")}</button>` }; } };
  }

  function makeCribbage(controller) {
    const s = { hand: [], ai: [], crib: [], stock: [], starter: null, pegging: [], count: 0, turn: 0, phase: "discard", score: [0, 0], selected: new Set() };
    const scoreCards = (cards) => { let points = 0; const total = sum(cards); if (total === 15) points += 2; for (let i = 1; i < cards.length; i += 1) if (cards[i].rank === cards[i - 1].rank) points += 2; const sorted = cards.map((item) => item.rank).sort((a, b) => a - b); if (sorted.length >= 3 && sorted.every((rank, index) => !index || rank === sorted[index - 1] + 1)) points += sorted.length; return points; };
    const finish = () => { const playerScore = scoreCards([...s.hand, s.starter]) + scoreCards(s.pegging); const aiScore = scoreCards([...s.ai, s.starter]); s.score[0] += playerScore; s.score[1] += aiScore; controller.result(s.score[0] >= s.score[1], `${t("score")}: ${s.score[0]} / ${s.score[1]}`); };
    const playPeg = (player, item) => { if (s.count + value(item) > 31) { s.turn = (player + 1) % 2; if (s.turn === 1) setTimeout(aiPeg, 260); return; } const handCards = player === 0 ? s.hand : s.ai; handCards.splice(handCards.indexOf(item), 1); s.pegging.push(item); s.count += value(item); if (s.count === 31 || (!s.hand.length && !s.ai.length)) { s.phase = "score"; finish(); return; } s.turn = (player + 1) % 2; if (s.turn === 1) setTimeout(aiPeg, 260); };
    const aiPeg = () => { const item = s.ai.find((candidate) => s.count + value(candidate) <= 31); if (item) playPeg(1, item); else { s.turn = 0; } };
    return { reset() { Object.assign(s, { hand: [], ai: [], crib: [], stock: deck(), starter: null, pegging: [], count: 0, turn: 0, phase: "discard", score: [0, 0], selected: new Set() }); for (let i = 0; i < 6; i += 1) { s.hand.push(s.stock.pop()); s.ai.push(s.stock.pop()); } }, card(index) { if (s.phase === "discard" && s.turn === 0) { if (s.selected.has(index)) s.selected.delete(index); else if (s.selected.size < 2) s.selected.add(index); } if (s.phase === "pegging" && s.turn === 0) playPeg(0, s.hand[index]); }, action(action) { if (action === "send-crib" && s.selected.size === 2) { [...s.selected].sort((a, b) => b - a).forEach((index) => s.crib.push(s.hand.splice(index, 1)[0])); s.crib.push(...s.ai.splice(0, 2)); s.starter = s.stock.pop(); s.phase = "pegging"; s.turn = 0; s.pegging = []; s.count = 0; } if (action === "new-round") this.reset(); }, view() { return { phase: s.phase === "discard" ? t("selectCards") : `${t("score")}: ${s.count}/31`, status: s.turn === 0 ? t("yourTurn") : t("aiTurn"), help: s.phase === "discard" ? `${t("selectCards")}: ${s.selected.size}/2 to the crib.` : "Peg without passing 31; pairs, runs and 15s score.", score: s.score[0], opponents: opponentMarkup("AI", s.ai.length, `${t("score")}: ${s.score[1]}`), center: `<div class="card-table-label">${t("cribbage")} · ${s.starter ? cardText(s.starter) : ""}</div>${makePegBoard(s.score[0], s.score[1])}<div class="table-row">${cardsMarkup(s.pegging)}</div>`, hand: cardsMarkup(s.hand, { selected: s.selected }), actions: s.phase === "discard" ? `<button class="primary-btn" data-action="send-crib" ${s.selected.size !== 2 ? "disabled" : ""}>${t("submit")}</button>` : "" }; } };
  }

  function makeCrazyEightsFixed(controller) {
    const s = { hands: [[], [], [], []], stock: [], discard: [], activeSuit: null, pendingSuit: false, turn: 0 };
    const names = ["You", "AI North", "AI East", "AI West"];
    const legal = (item) => item && (item.rank === 8 || item.suit === s.activeSuit || item.rank === s.discard.at(-1)?.rank);
    const draw = (player) => { if (s.stock.length) s.hands[player].push(s.stock.pop()); };
    const finish = (player) => controller.result(player === 0, `${names[player]} — ${s.hands[player].length} ${t("cards")}`);
    const next = () => { s.turn = (s.turn + 1) % 4; if (s.turn !== 0) setTimeout(aiTurn, 260); };
    const play = (player, item) => {
      if (!legal(item)) return;
      s.hands[player].splice(s.hands[player].indexOf(item), 1);
      s.discard.push(item);
      if (!s.hands[player].length) { finish(player); return; }
      if (item.rank === 8) {
        s.activeSuit = player === 0 ? null : SUITS[Math.floor(Math.random() * SUITS.length)];
        s.pendingSuit = player === 0;
        if (!s.pendingSuit) next();
      } else { s.activeSuit = item.suit; s.pendingSuit = false; next(); }
    };
    const aiTurn = () => {
      if (s.turn === 0) return;
      const legalCards = s.hands[s.turn].filter(legal);
      const item = chooseAiCard(s.hands[s.turn], legalCards, "low");
      if (item) play(s.turn, item);
      else { draw(s.turn); const drawn = s.hands[s.turn].at(-1); if (legal(drawn)) play(s.turn, drawn); else next(); }
    };
    return {
      reset() { Object.assign(s, { hands: [[], [], [], []], stock: deck(), discard: [], activeSuit: null, pendingSuit: false, turn: 0 }); for (let i = 0; i < 5; i += 1) s.hands.forEach((cards) => cards.push(s.stock.pop())); s.discard.push(s.stock.pop()); s.activeSuit = s.discard[0].suit; },
      card(index) { if (s.turn === 0 && !s.pendingSuit) play(0, s.hands[0][index]); },
      action(action, selected) { if (action === "draw" && s.turn === 0 && !s.pendingSuit) { draw(0); const drawn = s.hands[0].at(-1); if (legal(drawn)) play(0, drawn); } if (action === "suit" && s.turn === 0 && s.pendingSuit) { s.activeSuit = selected; s.pendingSuit = false; next(); } },
      view() { return { phase: `${t("play")} ${SYMBOLS[s.activeSuit] || "8"}`, status: s.turn === 0 ? t("yourTurn") : t("aiTurn"), help: s.pendingSuit ? t("chooseSuit") : `${t("play")}: ${rankText(s.discard.at(-1).rank)}${SYMBOLS[s.activeSuit]}`, score: s.hands[0].length, opponents: names.slice(1).map((name, index) => opponentMarkup(name, s.hands[index + 1].length)).join(""), center: `<div class="card-table-label">${t("discard")}</div><div class="table-row">${cardMarkup(s.discard.at(-1), 0)}${s.stock.length ? `<button class="playing-card is-face-down" data-action="draw" aria-label="${t("draw")}"></button>` : ""}</div>${s.pendingSuit ? `<div class="card-choice-panel">${SUITS.map((suit) => `<button class="secondary-btn" data-action="suit" data-value="${suit}">${SYMBOLS[suit]}</button>`).join("")}</div>` : ""}`, hand: cardsMarkup(s.hands[0]), actions: `<button class="secondary-btn" data-action="draw" ${s.pendingSuit ? "disabled" : ""}>${t("draw")}</button>` }; }
    };
  }

  function makeGinRummyFixed(controller) {
    const s = { player: [], ai: [], stock: [], discard: [], turn: 0, drawn: false, selected: new Set(), score: [0, 0], over: false };
    const meldStats = (hand) => {
      const used = new Set();
      const byRank = new Map();
      hand.forEach((item, index) => { const list = byRank.get(item.rank) || []; list.push(index); byRank.set(item.rank, list); });
      byRank.forEach((indices) => { if (indices.length >= 3) indices.forEach((index) => used.add(index)); });
      SUITS.forEach((suit) => { const indices = hand.map((item, index) => ({ item, index })).filter(({ item }) => item.suit === suit).sort((a, b) => a.item.rank - b.item.rank); let run = []; indices.forEach((entry) => { if (run.length && entry.item.rank !== run.at(-1).item.rank + 1) run = []; run.push(entry); if (run.length >= 3) run.forEach((part) => used.add(part.index)); }); });
      const deadwood = hand.reduce((total, item, index) => total + (used.has(index) ? 0 : value(item)), 0);
      return { deadwood, meldCards: used.size };
    };
    const finish = (winner, reason) => { s.over = true; s.score[winner] += 1; controller.result(winner === 0, `${reason} — ${t("score")}: ${s.score[0]} / ${s.score[1]}`); };
    const drawCard = (fromDiscard) => { const item = fromDiscard ? s.discard.pop() : s.stock.pop(); if (item) { s.player.push(item); s.drawn = true; } };
    const chooseAiDiscard = () => { let bestIndex = 0; let bestDeadwood = -1; s.ai.forEach((_, index) => { const candidate = s.ai.filter((__, itemIndex) => itemIndex !== index); const deadwood = meldStats(candidate).deadwood; if (deadwood > bestDeadwood) { bestDeadwood = deadwood; bestIndex = index; } }); return bestIndex; };
    const aiTurn = () => { if (s.turn !== 1 || s.over) return; if (s.discard.length && Math.random() > .45) s.ai.push(s.discard.pop()); else if (s.stock.length) s.ai.push(s.stock.pop()); const discardIndex = chooseAiDiscard(); const discarded = s.ai.splice(discardIndex, 1)[0]; if (discarded) s.discard.push(discarded); const stats = meldStats(s.ai); if (stats.deadwood === 0) finish(1, t("gin")); else if (stats.deadwood <= 10) finish(1, `${t("knock")} ${stats.deadwood}`); else { s.turn = 0; s.drawn = false; } };
    return {
      reset() { Object.assign(s, { player: [], ai: [], stock: deck(), discard: [], turn: 0, drawn: false, selected: new Set(), score: [0, 0], over: false }); for (let i = 0; i < 10; i += 1) { s.player.push(s.stock.pop()); s.ai.push(s.stock.pop()); } s.discard.push(s.stock.pop()); },
      card(index) { if (s.turn === 0 && s.drawn && !s.over) { s.selected = s.selected.has(index) ? new Set() : new Set([index]); } },
      action(action) { if (s.turn !== 0 || s.over) return; if (action === "draw-stock" && !s.drawn) drawCard(false); if (action === "draw-discard" && !s.drawn) drawCard(true); if (action === "discard" && s.drawn && s.selected.size === 1) { const index = [...s.selected][0]; const discarded = s.player.splice(index, 1)[0]; if (discarded) s.discard.push(discarded); s.selected.clear(); const stats = meldStats(s.player); if (stats.deadwood === 0) finish(0, t("gin")); else if (!s.stock.length) { const aiStats = meldStats(s.ai); finish(stats.deadwood <= aiStats.deadwood ? 0 : 1, `${t("score")} ${stats.deadwood} / ${aiStats.deadwood}`); } else { s.turn = 1; s.drawn = false; setTimeout(aiTurn, 320); } } if (action === "knock" && s.drawn) { const stats = meldStats(s.player); if (stats.deadwood <= 10) { const aiStats = meldStats(s.ai); finish(stats.deadwood <= aiStats.deadwood ? 0 : 1, `${t("knock")} ${stats.deadwood} / ${aiStats.deadwood}`); } } },
      view() { const stats = meldStats(s.player); return { phase: s.turn === 0 ? (s.drawn ? t("discard") : t("draw")) : t("aiTurn"), status: s.turn === 0 ? t("yourTurn") : t("aiTurn"), help: `Meld cards ${stats.meldCards} · Deadwood ${stats.deadwood}`, score: s.score[0], opponents: opponentMarkup("AI", s.ai.length, `${t("score")}: ${s.score[1]}`), center: `<div class="card-table-label">${t("stock")} · ${s.stock.length} · ${t("discard")}</div><div class="table-row"><button class="playing-card is-face-down" data-action="draw-stock" aria-label="${t("stock")}"></button>${cardMarkup(s.discard.at(-1), 0)}</div>`, hand: cardsMarkup(s.player, { selected: s.selected }), actions: `<button class="secondary-btn" data-action="draw-stock" ${s.drawn ? "disabled" : ""}>${t("draw")} ${t("stock")}</button><button class="secondary-btn" data-action="draw-discard" ${s.drawn ? "disabled" : ""}>${t("draw")} ${t("discard")}</button><button class="primary-btn" data-action="discard" ${!s.drawn || s.selected.size !== 1 ? "disabled" : ""}>${t("discard")}</button><button class="secondary-btn" data-action="knock" ${!s.drawn || stats.deadwood > 10 ? "disabled" : ""}>${t("knock")}</button>` }; }
    };
  }

  function makeCribbageFixed(controller) {
    const s = { hand: [], ai: [], crib: [], stock: [], starter: null, playerPeg: [], aiPeg: [], count: 0, turn: 0, phase: "discard", score: [0, 0], selected: new Set(), passed: [false, false], pegPoints: [0, 0], round: 1 };
    const combinations = (cards, target) => { let points = 0; const total = 1 << cards.length; for (let mask = 1; mask < total; mask += 1) { const chosen = cards.filter((_, index) => mask & (1 << index)); if (sum(chosen) === target) points += 2; } return points; };
    const scoreCards = (cards, isCrib = false) => {
      let points = combinations(cards, 15);
      const counts = new Map();
      cards.forEach((item) => counts.set(item.rank, (counts.get(item.rank) || 0) + 1));
      counts.forEach((count) => { if (count >= 2) points += (count * (count - 1)); });
      const unique = [...counts.keys()].sort((a, b) => a - b);
      for (let length = unique.length; length >= 3; length -= 1) { let found = false; for (let start = 0; start <= unique.length - length; start += 1) { const run = unique.slice(start, start + length); if (run.every((rank, index) => !index || rank === run[index - 1] + 1)) { points += length; found = true; break; } } if (found) break; }
      const firstFour = cards.slice(0, -1); if (firstFour.length >= 4 && firstFour.every((item) => item.suit === firstFour[0].suit)) points += 4; if (cards.at(-1)?.rank === 11 && cards.at(-1)?.suit === cards.find((item) => item.rank === 11)?.suit) points += 1;
      return points + (isCrib ? 0 : 0);
    };
    const legalPeg = (player) => (player === 0 ? s.hand : s.ai).filter((item) => s.count + value(item) <= 31);
    const finish = () => { if (s.score[0] >= 121 || s.score[1] >= 121) { controller.result(s.score[0] >= s.score[1], `${t("score")}: ${s.score[0]} / ${s.score[1]}`); return true; } return false; };
    const scorePegCard = (player, item) => { const sequence = player === 0 ? s.playerPeg : s.aiPeg; sequence.push(item); const last = sequence.at(-1); let points = 0; if (s.count + value(item) === 15 || s.count + value(item) === 31) points += 2; if (sequence.length >= 2 && sequence.at(-1).rank === sequence.at(-2).rank) points += 2; if (sequence.length >= 3) { const ranks = sequence.slice(-3).map((cardItem) => cardItem.rank).sort((a, b) => a - b); if (ranks[2] === ranks[1] + 1 && ranks[1] === ranks[0] + 1) points += 3; } if (last) s.pegPoints[player] += points; };
    const nextPegTurn = () => { if (s.passed[0] && s.passed[1]) { const playerCards = [...s.hand, ...s.playerPeg]; const aiCards = [...s.ai, ...s.aiPeg]; s.score[0] += scoreCards([...s.roundPlayerHand, s.starter]) + s.pegPoints[0]; s.score[1] += scoreCards([...s.roundAiHand, s.starter]) + scoreCards([...s.crib, s.starter], true) + s.pegPoints[1]; if (finish()) return; startRound(); return; } s.turn = (s.turn + 1) % 2; if (s.turn === 1) setTimeout(aiPeg, 240); };
    const passPeg = (player) => { s.passed[player] = true; nextPegTurn(); };
    const playPeg = (player, item) => { if (!item || s.count + value(item) > 31) { passPeg(player); return; } const hand = player === 0 ? s.hand : s.ai; const index = hand.indexOf(item); if (index < 0) return; hand.splice(index, 1); scorePegCard(player, item); s.count += value(item); s.passed[player] = false; if (!s.hand.length && !s.ai.length) { s.passed = [true, true]; nextPegTurn(); } else { nextPegTurn(); } };
    const aiPeg = () => { if (s.phase !== "pegging" || s.turn !== 1) return; const item = legalPeg(1).sort((a, b) => b.rank - a.rank)[0]; if (item) playPeg(1, item); else passPeg(1); };
    function startRound() { const cards = deck(); Object.assign(s, { hand: [], ai: [], crib: [], stock: cards, starter: null, playerPeg: [], aiPeg: [], count: 0, turn: 0, phase: "discard", selected: new Set(), passed: [false, false], pegPoints: [0, 0], round: s.round + 1 }); for (let i = 0; i < 6; i += 1) { s.hand.push(s.stock.pop()); s.ai.push(s.stock.pop()); } }
    return {
      reset() { Object.assign(s, { score: [0, 0], round: 0 }); startRound(); },
      card(index) { if (s.phase === "discard" && s.turn === 0) { if (s.selected.has(index)) s.selected.delete(index); else if (s.selected.size < 2) s.selected.add(index); } else if (s.phase === "pegging" && s.turn === 0) playPeg(0, s.hand[index]); },
      action(action) { if (action === "send-crib" && s.phase === "discard" && s.selected.size === 2) { [...s.selected].sort((a, b) => b - a).forEach((index) => s.crib.push(s.hand.splice(index, 1)[0])); s.crib.push(...s.ai.splice(0, 2)); s.roundPlayerHand = [...s.hand]; s.roundAiHand = [...s.ai]; s.starter = s.stock.pop(); s.phase = "pegging"; s.turn = 0; s.playerPeg = []; s.aiPeg = []; s.count = 0; s.passed = [false, false]; s.pegPoints = [0, 0]; } if (action === "go" && s.phase === "pegging" && s.turn === 0) passPeg(0); },
      view() { const playable = legalPeg(0); return { phase: s.phase === "discard" ? t("selectCards") : `${t("score")}: ${s.count}/31`, status: s.turn === 0 ? t("yourTurn") : t("aiTurn"), help: s.phase === "discard" ? `${t("selectCards")}: ${s.selected.size}/2 to the crib.` : `${playable.length ? "Play a card" : "Go"}. Pair, run, 15, and 31 points count during pegging.`, score: s.score[0], opponents: opponentMarkup("AI", s.ai.length, `${t("score")}: ${s.score[1]}`), center: `<div class="card-table-label">${t("cribbage")} · Round ${s.round} · ${s.starter ? cardText(s.starter) : ""}</div>${makePegBoard(s.score[0], s.score[1])}<div class="table-row">${cardsMarkup(s.playerPeg)}${cardsMarkup(s.aiPeg)}</div>`, hand: cardsMarkup(s.hand, { selected: s.selected }), actions: s.phase === "discard" ? `<button class="primary-btn" data-action="send-crib" ${s.selected.size !== 2 ? "disabled" : ""}>${t("submit")}</button>` : `<button class="secondary-btn" data-action="go" ${playable.length ? "disabled" : ""}>Go</button>` }; }
    };
  }

  function makeGoFishFixed(controller) {
    const s = { players: [[], [], [], []], stock: [], turn: 0, selectedOpponent: 1, selectedRank: null, books: [0, 0, 0, 0], playerCount: 4 };
    const names = ["You", "Otter", "Fox", "Panda"];
    const removeBooks = (player) => { for (let rank = 1; rank <= 13; rank += 1) { if (s.players[player].filter((item) => item.rank === rank).length === 4) { s.players[player] = s.players[player].filter((item) => item.rank !== rank); s.books[player] += 1; } } };
    const finish = () => { for (let player = 0; player < s.playerCount; player += 1) removeBooks(player); const winner = s.books.slice(0, s.playerCount).indexOf(Math.max(...s.books.slice(0, s.playerCount))); controller.result(winner === 0, `${t("booksMade")}: ${s.books.slice(0, s.playerCount).join(" / ")}`); };
    const deal = () => { s.players = [[], [], [], []]; s.stock = deck(); s.turn = 0; s.selectedOpponent = s.playerCount === 2 ? 1 : Math.min(s.selectedOpponent, s.playerCount - 1); s.selectedRank = null; s.books = [0, 0, 0, 0]; const handSize = s.playerCount === 2 ? 7 : 5; for (let i = 0; i < handSize; i += 1) for (let player = 0; player < s.playerCount; player += 1) s.players[player].push(s.stock.pop()); for (let player = 0; player < s.playerCount; player += 1) removeBooks(player); };
    const next = () => { s.turn = (s.turn + 1) % s.playerCount; if (s.turn !== 0) setTimeout(aiTurn, 300); };
    const ask = (target, rank) => { const matching = s.players[target].filter((item) => item.rank === rank); if (matching.length) { s.players[target] = s.players[target].filter((item) => item.rank !== rank); s.players[0].push(...matching); removeBooks(0); s.selectedRank = null; } else { if (s.stock.length) s.players[0].push(s.stock.pop()); next(); } if (!s.stock.length) { for (let player = 0; player < s.playerCount; player += 1) removeBooks(player); if (s.players.slice(0, s.playerCount).every((cards) => !cards.length)) finish(); } };
    const aiTurn = () => { if (s.turn === 0) return; const ranks = [...new Set(s.players[s.turn].map((item) => item.rank))]; if (!ranks.length) { if (!s.stock.length && s.players.slice(0, s.playerCount).every((cards) => !cards.length)) finish(); else next(); return; } const targets = Array.from({ length: s.playerCount }, (_, index) => index).filter((index) => index !== s.turn); const target = targets[Math.floor(Math.random() * targets.length)]; const rank = ranks[Math.floor(Math.random() * ranks.length)]; const matching = s.players[target].filter((item) => item.rank === rank); if (matching.length) { s.players[s.turn].push(...matching); s.players[target] = s.players[target].filter((item) => item.rank !== rank); removeBooks(s.turn); } else if (s.stock.length) s.players[s.turn].push(s.stock.pop()); removeBooks(s.turn); if (!s.stock.length && s.players.slice(0, s.playerCount).every((cards) => !cards.length)) finish(); else next(); };
    return {
      reset() { deal(); },
      card() {},
      action(action, valueArg) { if (action === "players") { const count = Number(valueArg); if (count >= 2 && count <= 4) { s.playerCount = count; deal(); } return; } if (s.turn !== 0) return; if (action === "opponent") s.selectedOpponent = Math.min(Number(valueArg), s.playerCount - 1); if (action === "rank") s.selectedRank = Number(valueArg); if (action === "ask" && s.selectedRank) ask(s.selectedOpponent, s.selectedRank); },
      view() { const rankControls = RANKS.map((rank, index) => `<button class="secondary-btn" data-action="rank" data-value="${index + 1}">${rank}</button>`).join(""); const playerControls = [2, 3, 4].map((count) => `<button class="secondary-btn ${s.playerCount === count ? "is-selected" : ""}" data-action="players" data-value="${count}" aria-label="${count} players">${count}</button>`).join(""); return { phase: `${t("ask")} ${s.playerCount}P`, status: s.turn === 0 ? t("yourTurn") : t("aiTurn"), help: `${t("ask")}: ${names[s.selectedOpponent]} — ${t("chooseRank")}`, score: s.books[0], opponents: names.slice(1, s.playerCount).map((name, index) => `<button class="opponent-card" data-action="opponent" data-value="${index + 1}"><strong>${name}</strong><span>${s.players[index + 1].length} ${t("cards")} — ${s.books[index + 1]} ${t("books")}</span></button>`).join(""), center: `<div class="card-table-label">${t("stock")}: ${s.stock.length}</div><div class="table-row"><button class="playing-card is-face-down" data-action="draw" aria-label="${t("stock")}"></button><span>${s.books[0]} ${t("books")}</span></div><div class="card-choice-panel">${rankControls}</div>`, hand: cardsMarkup(s.players[0]), actions: `<div class="card-choice-panel">${playerControls}</div><button class="primary-btn" data-action="ask" ${!s.selectedRank || s.selectedOpponent >= s.playerCount ? "disabled" : ""}>${t("ask")}</button>` }; }
    };
  }

  function makeSpeedFixed(controller) {
    const s = { hand: [], stock: [], aiHand: [], aiStock: [], centers: [], timer: null, over: false };
    const canPlay = (item, centerCard) => item && centerCard && (item.rank === centerCard.rank + 1 || item.rank === centerCard.rank - 1 || (item.rank === 1 && centerCard.rank === 13) || (item.rank === 13 && centerCard.rank === 1));
    const refill = (hand, stock) => { while (hand.length < 5 && stock.length) hand.push(stock.pop()); };
    const finishIfDone = () => { const playerEmpty = !s.hand.length && !s.stock.length; const aiEmpty = !s.aiHand.length && !s.aiStock.length; if (playerEmpty || aiEmpty) { s.over = true; clearTimeout(s.timer); controller.result(playerEmpty, `${t("cards")}: ${s.hand.length + s.stock.length} / ${s.aiHand.length + s.aiStock.length}`); } };
    const aiLoop = () => {
      if (s.over) return;
      const candidates = s.aiHand.flatMap((item, index) => s.centers.map((centerCard, centerIndex) => canPlay(item, centerCard) ? { index, centerIndex, item } : []));
      if (candidates.length) { const pick = candidates[Math.floor(Math.random() * candidates.length)]; s.aiHand.splice(pick.index, 1); s.centers[pick.centerIndex] = pick.item; refill(s.aiHand, s.aiStock); }
      else refill(s.aiHand, s.aiStock);
      finishIfDone();
      if (!s.over) s.timer = setTimeout(aiLoop, 420);
    };
    return {
      reset() { const cards = deck(); Object.assign(s, { hand: cards.splice(0, 20), stock: cards.splice(0, 6), aiHand: cards.splice(0, 20), aiStock: cards.splice(0, 6), centers: [deck()[0], deck()[1]], over: false }); clearTimeout(s.timer); s.timer = setTimeout(aiLoop, 420); },
      card(index) { if (s.over) return; const item = s.hand[index]; const centerIndex = s.centers.findIndex((centerCard) => canPlay(item, centerCard)); if (centerIndex < 0) return; s.hand.splice(index, 1); s.centers[centerIndex] = item; refill(s.hand, s.stock); finishIfDone(); },
      action() {},
      view() { return { phase: "Speed", status: t("yourTurn"), help: "Play immediately: one rank above or below either center card.", score: s.hand.length + s.stock.length, opponents: opponentMarkup("AI", s.aiHand.length + s.aiStock.length), center: `<div class="card-speed-lane"><div class="card-speed-pile">${cardMarkup(s.centers[0], 0)}</div><div class="card-speed-pile">${cardMarkup(s.centers[1], 0)}</div></div>`, hand: cardsMarkup(s.hand), actions: `<span class="card-help">${s.stock.length} ${t("stock")} · ${s.aiStock.length} ${t("cards")} ${t("waiting")}</span>` }; }
    };
  }

  function makeOldMaidFixed(controller) {
    const s = { players: [[], [], [], []], turn: 0, books: [0, 0, 0, 0], over: false };
    const names = ["You", "Fox", "Panda", "Otter"];
    const pair = (player) => { const byRank = new Map(); s.players[player].forEach((item) => { const list = byRank.get(item.rank) || []; list.push(item); byRank.set(item.rank, list); }); byRank.forEach((items) => { const normal = items.filter((item) => !item.oldMaid); for (let pairIndex = 0; pairIndex + 1 < normal.length; pairIndex += 2) { [normal[pairIndex], normal[pairIndex + 1]].forEach((item) => { const index = s.players[player].indexOf(item); if (index >= 0) s.players[player].splice(index, 1); }); s.books[player] += 1; } }); };
    const finishIfDone = () => { const active = s.players.filter((cards) => cards.length); if (active.length <= 1) { const loser = s.players.findIndex((cards) => cards.length); s.over = true; controller.result(loser !== 0, loser === 0 ? t("oldMaid") : `${names[loser]} ${t("oldMaid")}`); } };
    const targetFor = (player) => { for (let offset = 1; offset < s.players.length; offset += 1) { const target = (player + offset) % s.players.length; if (s.players[target].length) return target; } return -1; };
    const next = () => { s.turn = (s.turn + 1) % 4; while (!s.players[s.turn].length && s.players.some((cards) => cards.length)) s.turn = (s.turn + 1) % 4; if (s.turn !== 0) setTimeout(aiTurn, 320); };
    const drawFrom = (player, index) => { const target = targetFor(player); if (target < 0) { finishIfDone(); return; } const source = s.players[target]; const item = source.splice(Math.min(index, source.length - 1), 1)[0]; s.players[player].push(item); pair(player); finishIfDone(); if (!s.over) next(); };
    const aiTurn = () => { if (s.turn !== 0 && !s.over) { const target = targetFor(s.turn); if (target < 0) finishIfDone(); else drawFrom(s.turn, Math.floor(Math.random() * s.players[target].length)); } };
    return {
      reset() { const cards = deck(); const removed = cards.findIndex((item) => item.suit === "spades" && item.rank === 12); cards.splice(removed, 1); const odd = cards.find((item) => item.rank === 12); if (odd) odd.oldMaid = true; Object.assign(s, { players: [[], [], [], []], turn: 0, books: [0, 0, 0, 0], over: false }); cards.forEach((item, index) => s.players[index % 4].push(item)); s.players.forEach((_, index) => pair(index)); },
      card(index) { if (s.turn === 0 && !s.over) drawFrom(0, index); },
      action() {},
      view() { const targetIndex = targetFor(0); const target = targetIndex < 0 ? [] : s.players[targetIndex]; const turnTarget = targetFor(s.turn); return { phase: t("oldMaid"), status: s.turn === 0 ? t("yourTurn") : t("aiTurn"), help: `Draw one hidden card from ${names[turnTarget < 0 ? 0 : turnTarget]}. Pairs disappear automatically.`, score: s.books[0], opponents: names.slice(1).map((name, index) => opponentMarkup(name, s.players[index + 1].length, `${s.books[index + 1]} ${t("pairs")}`)).join(""), center: `<div class="card-table-label">${t("oldMaid")}</div><div class="table-row">${target.map((_, index) => cardMarkup({ faceDown: true }, index)).join("")}</div>`, hand: cardsMarkup(s.players[0]), actions: "" }; }
    };
  }

  const GAME_BUILDERS = { hearts: makeHearts, spades: makeSpades, "gin-rummy": makeGinRummyFixed, "crazy-eights": makeCrazyEightsFixed, cribbage: makeCribbageFixed, "go-fish": makeGoFishFixed, war: makeWarFixed, speed: makeSpeedFixed, "old-maid": makeOldMaidFixed, casino: makeCasino };
  root.WPCardGamesNext = Object.freeze({ mount: mountCardGame, titles: TITLES });
})(window);
