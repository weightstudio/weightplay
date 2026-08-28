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

  const HEARTS_COPY = {
    en: { help: "Follow suit. Hearts and Q♠ are penalty cards." },
    "zh-Hant": { help: "請跟同花色出牌。紅心與黑桃皇后是扣分牌。" },
    "zh-Hans": { help: "请跟同花色出牌。红心和黑桃皇后是扣分牌。" },
    ja: { help: "リードされたスートに従いましょう。ハートとスペードのQはペナルティカードです。" },
    ko: { help: "가능하면 같은 무늬를 따라 내세요. 하트와 스페이드 Q는 벌점 카드입니다." },
    es: { help: "Sigue el palo. Los corazones y la Q de picas son cartas de penalización." },
    "pt-BR": { help: "Siga o naipe. Copas e a Q de espadas são cartas de penalidade." },
    fr: { help: "Suivez la couleur. Les cœurs et la Q de pique sont des cartes pénalisantes." },
    de: { help: "Bediene die Farbe. Herzen und die Pik-Dame bringen Strafpunkte." },
    it: { help: "Segui il seme. I cuori e la Q di picche sono carte penalizzanti." },
    ru: { help: "Следуйте масти. Червы и дама пик — штрафные карты." },
    hi: { help: "यदि संभव हो तो वही सूट चलें। हार्ट और स्पेड की Q दंड कार्ड हैं।" },
    ar: { help: "اتبع اللون. القلوب وملكة البستوني بطاقات جزاء." },
  };

  const HEARTS_PASS_COPY = {
    en: { safe: "Pass preview: no Hearts or Q♠ selected.", risk: "Pass preview: {penalties} selected · {points} potential penalty points.", void: "Passing these cards leaves you void in {suit}." },
    "zh-Hant": { safe: "傳牌預覽：未選紅心或黑桃 Q。", risk: "傳牌預覽：已選 {penalties} · 可能送出 {points} 分。", void: "傳出這些牌後，你的 {suit} 將缺門。" },
    "zh-Hans": { safe: "传牌预览：未选红心或黑桃 Q。", risk: "传牌预览：已选 {penalties} · 可能送出 {points} 分。", void: "传出这些牌后，你的 {suit} 将缺门。" },
    ja: { safe: "パスのプレビュー：ハートとスペードQは未選択です。", risk: "パスのプレビュー：{penalties}を選択 · ペナルティ候補 {points} 点。", void: "これらを渡すと{suit}が空になります。" },
    ko: { safe: "패스 미리보기: 하트와 스페이드 Q를 선택하지 않았습니다.", risk: "패스 미리보기: {penalties} 선택 · 잠재 벌점 {points}점.", void: "이 카드를 넘기면 {suit} 무늬가 비게 됩니다." },
    es: { safe: "Vista previa del pase: no has elegido corazones ni Q♠.", risk: "Vista previa del pase: {penalties} elegidas · {points} puntos de penalización posibles.", void: "Al pasar estas cartas te quedas sin {suit}." },
    "pt-BR": { safe: "Prévia da passagem: nenhum coração ou Q♠ selecionado.", risk: "Prévia da passagem: {penalties} selecionadas · {points} pontos de penalidade possíveis.", void: "Ao passar estas cartas, você fica sem {suit}." },
    fr: { safe: "Aperçu du passage : aucun cœur ni Q♠ sélectionné.", risk: "Aperçu du passage : {penalties} sélectionnés · {points} points de pénalité possibles.", void: "En passant ces cartes, vous n’aurez plus de {suit}." },
    de: { safe: "Passvorschau: Kein Herz und keine Pik-Dame ausgewählt.", risk: "Passvorschau: {penalties} ausgewählt · {points} mögliche Strafpunkte.", void: "Wenn du diese Karten abgibst, hast du keine {suit} mehr." },
    it: { safe: "Anteprima del passaggio: nessun cuore o Q♠ selezionato.", risk: "Anteprima del passaggio: {penalties} selezionati · {points} possibili punti di penalità.", void: "Passando queste carte resterai senza {suit}." },
    ru: { safe: "Предпросмотр передачи: червей и дамы пик нет.", risk: "Предпросмотр передачи: выбраны {penalties} · возможный штраф {points} очков.", void: "После передачи этих карт масть {suit} закончится." },
    hi: { safe: "पास का पूर्वावलोकन: कोई हार्ट या स्पेड Q नहीं चुना गया।", risk: "पास का पूर्वावलोकन: {penalties} चुने गए · संभावित दंड {points} अंक।", void: "ये पत्ते देने पर आपके पास {suit} नहीं रहेगा।" },
    ar: { safe: "معاينة التمرير: لم يتم اختيار قلوب أو Q♠.", risk: "معاينة التمرير: تم اختيار {penalties} · نقاط الجزاء المحتملة {points}.", void: "بتمرير هذه البطاقات ستصبح بلا {suit}." },
  };

  const HEARTS_RESULT_COPY = {
    en: { lesson: "{hearts} Hearts + Q♠ {queen} = {raw} penalty points. Next pass: shed a high-risk card when it protects your hand.", moon: "Shooting the Moon changed the final totals." },
    "zh-Hant": { lesson: "紅心 {hearts} 張 + 黑桃 Q {queen} 分 = {raw} 扣分。下次傳牌：能保護手牌時，試著送走高風險牌。", moon: "「全收懲罰牌」改變了最終總分。" },
    "zh-Hans": { lesson: "红心 {hearts} 张 + 黑桃 Q {queen} 分 = {raw} 扣分。下次传牌：能保护手牌时，试着送走高风险牌。", moon: "「全收惩罚牌」改变了最终总分。" },
    ja: { lesson: "ハート {hearts} 枚 + スペードQ {queen} 点 = ペナルティ {raw} 点。次のパスでは手札を守れる高リスク札を手放しましょう。", moon: "シューティング・ザ・ムーンで最終合計が変わりました。" },
    ko: { lesson: "하트 {hearts}장 + 스페이드 Q {queen}점 = 벌점 {raw}점입니다. 다음 패스에서는 손패를 지켜 줄 고위험 카드를 넘겨 보세요.", moon: "문샷으로 최종 합계가 바뀌었습니다." },
    es: { lesson: "{hearts} corazones + Q♠ {queen} = {raw} puntos de penalización. En el próximo pase, entrega una carta de riesgo si protege tu mano.", moon: "Disparar a la Luna cambió los totales finales." },
    "pt-BR": { lesson: "{hearts} copas + Q♠ {queen} = {raw} pontos de penalidade. Na próxima passagem, passe uma carta de risco se isso proteger sua mão.", moon: "Atirar na Lua alterou os totais finais." },
    fr: { lesson: "{hearts} cœurs + Q♠ {queen} = {raw} points de pénalité. Au prochain passage, donnez une carte risquée si cela protège votre main.", moon: "La Lune a modifié les totaux finaux." },
    de: { lesson: "{hearts} Herzen + Pik-Dame {queen} = {raw} Strafpunkte. Gib beim nächsten Pass eine riskante Karte ab, wenn es deine Hand schützt.", moon: "Durch Shooting the Moon wurden die Endsumme angepasst." },
    it: { lesson: "{hearts} cuori + Q♠ {queen} = {raw} punti di penalità. Al prossimo passaggio, cedi una carta rischiosa se protegge la tua mano.", moon: "Shooting the Moon ha modificato i totali finali." },
    ru: { lesson: "{hearts} червей + Q♠ {queen} = {raw} штрафных очков. В следующей передаче отдайте рискованную карту, если это защитит вашу руку.", moon: "«Застрелить Луну» изменило итоговые суммы." },
    hi: { lesson: "{hearts} हार्ट + स्पेड Q {queen} = {raw} दंड अंक। अगले पास में हाथ बचाने के लिए जोखिम वाला पत्ता देने की कोशिश करें।", moon: "शूटिंग द मून से अंतिम कुल बदल गया।" },
    ar: { lesson: "{hearts} قلوب + Q♠ {queen} = {raw} نقطة جزاء. في التمرير التالي، مرّر بطاقة عالية المخاطر إذا حمت يدك.", moon: "تسبّب جمع كل بطاقات الجزاء في تغيير الإجماليات النهائية." },
  };

  // Hearts owns the Arabic shell because the generic route catalog does not
  // know the card game's guide facts, named opponents, or first-trick cue.
  // Keep this bounded to the reviewed locale so other card-game routes retain
  // their existing shared ownership until they receive their own repair.
  const HEARTS_SHELL_COPY = {
    ar: {
      title: "القلوب",
      summary: "تجنب بطاقات الجزاء، واتبع النوع، وقرر متى تخاطر بجمع كل الجزاء.",
      guideKicker: "دليل ألعاب WeightPlay الأصلية",
      guideSummary: "اتبع النوع خلال ثلاث عشرة خدعة، وتجنب القلوب وملكة البستوني، وقرر إن كنت ستخاطر بجمع كل بطاقات الجزاء.",
      gameplayLabel: "طريقة اللعب",
      gameplay: "لعبة خدع التهرب الكلاسيكية",
      genreLabel: "النوع",
      genre: "بطاقات · عائلية · استراتيجية",
      difficultyLabel: "الصعوبة",
      difficulty: "من السهل إلى التحدي",
      timeLabel: "الوقت التقريبي",
      time: "5–15 دقيقة",
      skillsLabel: "المهارات المتدرَّبة",
      skills: "التخطيط · التركيز · التعرّف على الأنماط",
      howTo: "كيفية اللعب",
      howToCopy: "اختر ثلاث بطاقات لتمريرها، ثم العب بطاقة قانونية من يدك. تبدأ أول خدعة ببطاقة 2♣؛ والفائز يقود الخدعة التالية.",
      preview: "حالة المعاينة",
      previewCopy: "هذه معاينة المالك غير موجودة في الكتالوج العام الرسمي.",
      faq: "الأسئلة الشائعة",
      faqQuestion: "هل يُحفظ التقدم؟",
      faqAnswer: "نعم، في هذا المتصفح فقط.",
      opponents: ["أنت", "أوركيد", "مانجو", "نوفا"],
      lead: "تبدأ أول خدعة ببطاقة 2♣",
      metaDescription: "تجنب بطاقات الجزاء، واتبع النوع، وقرر متى تخاطر بجمع كل الجزاء في لعبة القلوب ضمن معاينة المالك.",
    },
  };

  const heartsShellCopy = () => HEARTS_SHELL_COPY[currentLocale()] || null;

  const SPADES_COPY = {
    en: { bid: "Bid the tricks your team expects to take. ♠ is always trump.", play: "Follow suit when possible; a spade wins the trick." },
    "zh-Hant": { bid: "叫出你和隊友預計能贏的墩數。♠ 永遠是王牌。", play: "能跟同花色就跟牌；黑桃可以贏得這一墩。" },
    "zh-Hans": { bid: "叫出你和队友预计能赢的墩数。♠ 永远是王牌。", play: "能跟同花色就跟牌；黑桃可以赢得这一墩。" },
    ja: { bid: "チームで取れると思うトリック数をビッドします。♠は常に切り札です。", play: "できるだけ同じスートを出し、♠でトリックを取ります。" },
    ko: { bid: "팀이 가져갈 트릭 수를 선언하세요. ♠는 항상 으뜸패입니다.", play: "가능하면 같은 무늬를 내세요. ♠가 트릭을 이깁니다." },
    es: { bid: "Apuesta las bazas que tu equipo espera ganar. ♠ siempre es triunfo.", play: "Sigue el palo cuando puedas; una pica gana la baza." },
    "pt-BR": { bid: "Declare as vazas que sua equipe espera vencer. ♠ sempre é trunfo.", play: "Siga o naipe quando puder; uma espada vence a vaza." },
    fr: { bid: "Annoncez les plis que votre équipe pense remporter. ♠ est toujours l'atout.", play: "Suivez la couleur si possible ; un ♠ remporte le pli." },
    de: { bid: "Biete die Stiche, die dein Team voraussichtlich gewinnt. ♠ ist immer Trumpf.", play: "Bediene die Farbe, wenn möglich; Pik gewinnt den Stich." },
    it: { bid: "Dichiara le prese che la tua squadra pensa di vincere. ♠ è sempre briscola.", play: "Segui il seme quando puoi; una ♠ vince la presa." },
    ru: { bid: "Закажите число взяток, которое ваша команда рассчитывает взять. ♠ всегда козырь.", play: "По возможности следуйте масти; ♠ выигрывает взятку." },
    hi: { bid: "आपकी टीम जितनी बाज़ियाँ लेने की उम्मीद करती है, उतनी बोली लगाएँ। ♠ हमेशा तुरुप है।", play: "संभव हो तो उसी सूट का पत्ता चलें; ♠ बाज़ी जीतता है।" },
    ar: { bid: "راهن على عدد اللمّات التي يتوقع فريقك الفوز بها. ♠ هي الحكم دائماً.", play: "اتبع النوع إن أمكن؛ ♠ تفوز باللّمة." },
  };

  const SPADES_PROGRESS_COPY = {
    en: { label: "Contract", behind: "{tricks}/{bid} tricks · Need {remaining} more", on: "{tricks}/{bid} tricks · On contract", ahead: "{tricks}/{bid} tricks · Overtricks: {bags}" },
    "zh-Hant": { label: "合約", behind: "{tricks}/{bid} 墩 · 還需 {remaining} 墩", on: "{tricks}/{bid} 墩 · 已達合約", ahead: "{tricks}/{bid} 墩 · 超墩：{bags}" },
    "zh-Hans": { label: "合约", behind: "{tricks}/{bid} 墩 · 还需 {remaining} 墩", on: "{tricks}/{bid} 墩 · 已达合约", ahead: "{tricks}/{bid} 墩 · 超墩：{bags}" },
    ja: { label: "契約", behind: "{tricks}/{bid}トリック · あと{remaining}トリック", on: "{tricks}/{bid}トリック · 契約達成", ahead: "{tricks}/{bid}トリック · 超過トリック：{bags}" },
    ko: { label: "계약", behind: "{tricks}/{bid} 트릭 · {remaining}개 더 필요", on: "{tricks}/{bid} 트릭 · 계약 달성", ahead: "{tricks}/{bid} 트릭 · 초과 트릭: {bags}" },
    es: { label: "Contrato", behind: "{tricks}/{bid} bazas · Faltan {remaining}", on: "{tricks}/{bid} bazas · Contrato cumplido", ahead: "{tricks}/{bid} bazas · Bazas extra: {bags}" },
    "pt-BR": { label: "Contrato", behind: "{tricks}/{bid} vazas · Faltam {remaining}", on: "{tricks}/{bid} vazas · Contrato cumprido", ahead: "{tricks}/{bid} vazas · Vazas extras: {bags}" },
    fr: { label: "Contrat", behind: "{tricks}/{bid} plis · Encore {remaining}", on: "{tricks}/{bid} plis · Contrat atteint", ahead: "{tricks}/{bid} plis · Plis en plus : {bags}" },
    de: { label: "Vertrag", behind: "{tricks}/{bid} Stiche · Noch {remaining}", on: "{tricks}/{bid} Stiche · Vertrag erfüllt", ahead: "{tricks}/{bid} Stiche · Überstiche: {bags}" },
    it: { label: "Contratto", behind: "{tricks}/{bid} prese · Ne mancano {remaining}", on: "{tricks}/{bid} prese · Contratto raggiunto", ahead: "{tricks}/{bid} prese · Prese extra: {bags}" },
    ru: { label: "Контракт", behind: "{tricks}/{bid} взяток · Осталось {remaining}", on: "{tricks}/{bid} взяток · Контракт выполнен", ahead: "{tricks}/{bid} взяток · Сверх контракта: {bags}" },
    hi: { label: "अनुबंध", behind: "{tricks}/{bid} बाज़ियाँ · {remaining} और चाहिए", on: "{tricks}/{bid} बाज़ियाँ · अनुबंध पूरा", ahead: "{tricks}/{bid} बाज़ियाँ · अतिरिक्त बाज़ियाँ: {bags}" },
    ar: { label: "العقد", behind: "{tricks}/{bid} لَمّات · تحتاج إلى {remaining} أخرى", on: "{tricks}/{bid} لَمّات · اكتمل العقد", ahead: "{tricks}/{bid} لَمّات · لَمّات إضافية: {bags}" },
  };

  const SPADES_TRICK_COPY = {
    en: { live: "Led suit: {suit}. Current winner: {card}.", trump: "Led suit: {suit}. Spades is taking the trick with {card}.", settled: "Trick settled: {card} wins." },
    "zh-Hant": { live: "首引花色：{suit}。目前領先：{card}。", trump: "首引花色：{suit}。黑桃以 {card} 贏得這一墩。", settled: "這一墩結算：{card} 獲勝。" },
    "zh-Hans": { live: "首引花色：{suit}。目前领先：{card}。", trump: "首引花色：{suit}。黑桃以 {card} 赢得这一墩。", settled: "这一墩结算：{card} 获胜。" },
    ja: { live: "リードされたスート：{suit}。現在の勝ち札：{card}。", trump: "リードされたスート：{suit}。スペードの {card} がこのトリックを取っています。", settled: "このトリックの勝ち札：{card}。" },
    ko: { live: "리드된 무늬: {suit}. 현재 승리 카드: {card}.", trump: "리드된 무늬: {suit}. 스페이드 {card}가 트릭을 가져가고 있습니다.", settled: "트릭 결과: {card} 승리." },
    es: { live: "Palo de salida: {suit}. Carta ganadora actual: {card}.", trump: "Palo de salida: {suit}. La pica {card} está ganando la baza.", settled: "Baza resuelta: gana {card}." },
    "pt-BR": { live: "Naipe de saída: {suit}. Carta vencedora atual: {card}.", trump: "Naipe de saída: {suit}. A espada {card} está vencendo a vaza.", settled: "Vaza resolvida: {card} venceu." },
    fr: { live: "Couleur demandée : {suit}. Carte gagnante actuelle : {card}.", trump: "Couleur demandée : {suit}. Le {card} de pique remporte le pli.", settled: "Pli résolu : {card} gagne." },
    de: { live: "Angespielte Farbe: {suit}. Aktuelle Gewinnerkarte: {card}.", trump: "Angespielte Farbe: {suit}. Pik {card} gewinnt den Stich.", settled: "Stich entschieden: {card} gewinnt." },
    it: { live: "Seme di uscita: {suit}. Carta vincente attuale: {card}.", trump: "Seme di uscita: {suit}. La picche {card} sta vincendo la presa.", settled: "Presa risolta: vince {card}." },
    ru: { live: "Ведущая масть: {suit}. Текущая карта-победитель: {card}.", trump: "Ведущая масть: {suit}. Пики {card} выигрывают взятку.", settled: "Взятка завершена: победила карта {card}." },
    hi: { live: "लीड सूट: {suit}। अभी जीत रहा पत्ता: {card}।", trump: "लीड सूट: {suit}। स्पेड का {card} बाज़ी जीत रहा है।", settled: "बाज़ी पूरी: {card} जीता।" },
    ar: { live: "النوع المقاد: {suit}. البطاقة الفائزة حالياً: {card}.", trump: "النوع المقاد: {suit}. البستوني {card} يفوز باللّمة.", settled: "حُسمت اللّمة: فازت {card}." },
  };

  const SPADES_SHELL_COPY = {
    en: { title: "Spades", summary: "Bid your tricks, use spades as trump, and coordinate with an AI teammate.", guideKicker: "WeightPlay Original Game Guide", guideSummary: "Two teams bid before a trick-taking hand. Spades are always trump, and bags record overtricks.", gameplayLabel: "Gameplay", gameplay: "Classic Trump Trick-Taking", genreLabel: "Genre", genre: "Card · Family · Strategy", difficultyLabel: "Difficulty", difficulty: "Easy to Challenging", timeLabel: "Estimated Play Time", time: "5-15 minutes", skillsLabel: "Skills Trained", skills: "Planning · Focus · Pattern Recognition", howTo: "How to Play", howToCopy: "Bid the number of tricks your team expects, follow suit when possible, and use spades at the right moment to win the contract.", preview: "Preview status", previewCopy: "This owner preview is not in the formal public catalog.", faq: "FAQ", faqQuestion: "Is progress saved?", faqAnswer: "Yes, only in this browser.", quickGuide: "How to play", quickGuideCopy: "Bid your team's expected tricks, follow suit when possible, and use spades at the right moment.", opponents: ["You", "AI North", "AI East", "AI West"], metaDescription: "Bid tricks with your team, follow suit, and use spades as trump in this owner-preview card game." },
    "zh-Hant": { title: "黑桃", summary: "叫出團隊預計贏得的墩數，善用黑桃王牌，和 AI 隊友協作。", guideKicker: "WeightPlay 原創遊戲指南", guideSummary: "兩隊先叫牌，再進行吃墩牌局。黑桃永遠是王牌，超墩會記入袋分。", gameplayLabel: "玩法", gameplay: "經典王牌吃墩", genreLabel: "類型", genre: "卡牌 · 家庭 · 策略", difficultyLabel: "難度", difficulty: "由簡單到具挑戰", timeLabel: "預計遊玩時間", time: "5–15 分鐘", skillsLabel: "訓練技能", skills: "規劃 · 專注 · 模式辨識", howTo: "玩法說明", howToCopy: "叫出團隊預計贏得的墩數，能跟花色時就跟牌，並在關鍵時機使用黑桃贏下合約。", preview: "預覽狀態", previewCopy: "這是擁有者預覽，尚未列入正式公開目錄。", faq: "常見問題", faqQuestion: "進度會保存嗎？", faqAnswer: "會，只保存在這個瀏覽器中。", quickGuide: "玩法說明", quickGuideCopy: "叫出團隊預計贏得的墩數，能跟花色時就跟牌，並在關鍵時機使用黑桃。", opponents: ["你", "AI 北位", "AI 東位", "AI 西位"], metaDescription: "和團隊叫牌、跟花色，並在這款擁有者預覽卡牌遊戲中善用黑桃王牌。" },
    "zh-Hans": { title: "黑桃", summary: "叫出团队预计赢得的墩数，善用黑桃王牌，和 AI 队友协作。", guideKicker: "WeightPlay 原创游戏指南", guideSummary: "两队先叫牌，再进行吃墩牌局。黑桃永远是王牌，超墩会记入袋分。", gameplayLabel: "玩法", gameplay: "经典王牌吃墩", genreLabel: "类型", genre: "卡牌 · 家庭 · 策略", difficultyLabel: "难度", difficulty: "从简单到具挑战", timeLabel: "预计游玩时间", time: "5–15 分钟", skillsLabel: "训练技能", skills: "规划 · 专注 · 模式识别", howTo: "玩法说明", howToCopy: "叫出团队预计赢得的墩数，能跟花色时就跟牌，并在关键时机使用黑桃赢下合约。", preview: "预览状态", previewCopy: "这是拥有者预览，尚未列入正式公开目录。", faq: "常见问题", faqQuestion: "进度会保存吗？", faqAnswer: "会，只保存在这个浏览器中。", quickGuide: "玩法说明", quickGuideCopy: "叫出团队预计赢得的墩数，能跟花色时就跟牌，并在关键时机使用黑桃。", opponents: ["你", "AI 北位", "AI 东位", "AI 西位"], metaDescription: "和团队叫牌、跟花色，并在这款拥有者预览卡牌游戏中善用黑桃王牌。" },
    ja: { title: "スペード", summary: "チームの獲得予想トリックをビッドし、スペードを切り札にして AI の味方と協力します。", guideKicker: "WeightPlay オリジナルゲームガイド", guideSummary: "2チームがビッドしてからトリックを競います。スペードは常に切り札で、超過トリックはバッグとして記録されます。", gameplayLabel: "遊び方", gameplay: "クラシックな切り札トリック", genreLabel: "ジャンル", genre: "カード · ファミリー · 戦略", difficultyLabel: "難易度", difficulty: "簡単から挑戦的", timeLabel: "プレイ時間の目安", time: "5～15分", skillsLabel: "鍛えられる力", skills: "計画 · 集中 · パターン認識", howTo: "遊び方", howToCopy: "チームの獲得予想トリックをビッドし、可能なら同じスートを出し、要所でスペードを使って契約を達成します。", preview: "プレビュー状態", previewCopy: "この所有者プレビューは正式な公開カタログには含まれていません。", faq: "よくある質問", faqQuestion: "進行状況は保存されますか？", faqAnswer: "はい。このブラウザ内だけに保存されます。", quickGuide: "遊び方", quickGuideCopy: "チームの獲得予想をビッドし、可能なら同じスートを出し、要所でスペードを使います。", opponents: ["あなた", "AI 北", "AI 東", "AI 西"], metaDescription: "チームでビッドし、スートに従い、所有者プレビューのカードゲームでスペードを切り札として使います。" },
    ko: { title: "스페이드", summary: "팀이 가져갈 트릭을 선언하고 스페이드를 으뜸패로 사용하며 AI 팀원과 협력하세요.", guideKicker: "WeightPlay 오리지널 게임 가이드", guideSummary: "두 팀이 먼저 비드한 뒤 트릭을 겨룹니다. 스페이드는 항상 으뜸패이며 초과 트릭은 백으로 기록됩니다.", gameplayLabel: "게임 방식", gameplay: "클래식 으뜸패 트릭 게임", genreLabel: "장르", genre: "카드 · 가족 · 전략", difficultyLabel: "난이도", difficulty: "쉬움부터 도전적", timeLabel: "예상 플레이 시간", time: "5~15분", skillsLabel: "훈련 능력", skills: "계획 · 집중 · 패턴 인식", howTo: "플레이 방법", howToCopy: "팀이 가져갈 트릭을 비드하고, 가능하면 같은 무늬를 내며, 중요한 순간에 스페이드를 사용해 계약을 이행하세요.", preview: "프리뷰 상태", previewCopy: "이 소유자 프리뷰는 공식 공개 카탈로그에 포함되지 않습니다.", faq: "자주 묻는 질문", faqQuestion: "진행 상황이 저장되나요?", faqAnswer: "네. 이 브라우저에만 저장됩니다.", quickGuide: "플레이 방법", quickGuideCopy: "팀의 예상 트릭을 비드하고, 가능하면 같은 무늬를 내며, 중요한 순간에 스페이드를 사용하세요.", opponents: ["나", "AI 북", "AI 동", "AI 서"], metaDescription: "팀과 비드하고 무늬를 따라 내며, 소유자 프리뷰 카드 게임에서 스페이드를 으뜸패로 사용하세요." },
    es: { title: "Picas", summary: "Apuesta las bazas de tu equipo, usa las picas como triunfo y coordínate con tu compañera o compañero de IA.", guideKicker: "Guía de juego original de WeightPlay", guideSummary: "Dos equipos apuestan antes de una mano de bazas. Las picas siempre son triunfo y las bazas extra se registran como bolsas.", gameplayLabel: "Jugabilidad", gameplay: "Bazas clásicas con triunfo", genreLabel: "Género", genre: "Cartas · Familiar · Estrategia", difficultyLabel: "Dificultad", difficulty: "De fácil a desafiante", timeLabel: "Tiempo estimado", time: "5-15 minutos", skillsLabel: "Habilidades", skills: "Planificación · Concentración · Reconocimiento de patrones", howTo: "Cómo jugar", howToCopy: "Apuesta las bazas que espera ganar tu equipo, sigue el palo cuando puedas y usa las picas en el momento justo para cumplir el contrato.", preview: "Estado de la vista previa", previewCopy: "Esta vista previa del propietario aún no está en el catálogo público oficial.", faq: "Preguntas frecuentes", faqQuestion: "¿Se guarda el progreso?", faqAnswer: "Sí, solo en este navegador.", quickGuide: "Cómo jugar", quickGuideCopy: "Apuesta las bazas de tu equipo, sigue el palo cuando puedas y usa las picas en el momento justo.", opponents: ["Tú", "IA Norte", "IA Este", "IA Oeste"], metaDescription: "Apuesta con tu equipo, sigue el palo y usa las picas como triunfo en este juego de cartas de vista previa del propietario." },
    "pt-BR": { title: "Espadas", summary: "Declare as vazas da sua equipe, use espadas como trunfo e coordene-se com seu parceiro de IA.", guideKicker: "Guia de jogo original da WeightPlay", guideSummary: "Duas equipes fazem seus lances antes de uma mão de vazas. Espadas sempre são trunfo, e as vazas extras viram bolsas.", gameplayLabel: "Como jogar", gameplay: "Vazas clássicas com trunfo", genreLabel: "Gênero", genre: "Cartas · Família · Estratégia", difficultyLabel: "Dificuldade", difficulty: "De fácil a desafiador", timeLabel: "Tempo estimado", time: "5–15 minutos", skillsLabel: "Habilidades", skills: "Planejamento · Foco · Reconhecimento de padrões", howTo: "Como jogar", howToCopy: "Declare as vazas que sua equipe espera vencer, siga o naipe quando puder e use espadas no momento certo para cumprir o contrato.", preview: "Status da prévia", previewCopy: "Esta prévia do proprietário ainda não faz parte do catálogo público oficial.", faq: "Perguntas frequentes", faqQuestion: "O progresso é salvo?", faqAnswer: "Sim, apenas neste navegador.", quickGuide: "Como jogar", quickGuideCopy: "Declare as vazas da sua equipe, siga o naipe quando puder e use espadas no momento certo.", opponents: ["Você", "IA Norte", "IA Leste", "IA Oeste"], metaDescription: "Declare com sua equipe, siga o naipe e use espadas como trunfo neste jogo de cartas em prévia do proprietário." },
    fr: { title: "Pique", summary: "Annoncez les plis de votre équipe, utilisez le pique comme atout et coordonnez-vous avec votre partenaire IA.", guideKicker: "Guide du jeu original WeightPlay", guideSummary: "Deux équipes annoncent avant une manche de plis. Le pique est toujours l'atout et les plis supplémentaires deviennent des sacs.", gameplayLabel: "Jeu", gameplay: "Plis classiques avec atout", genreLabel: "Genre", genre: "Cartes · Famille · Stratégie", difficultyLabel: "Difficulté", difficulty: "De facile à exigeant", timeLabel: "Durée estimée", time: "5 à 15 minutes", skillsLabel: "Compétences", skills: "Planification · Concentration · Reconnaissance des motifs", howTo: "Comment jouer", howToCopy: "Annoncez les plis prévus par votre équipe, fournissez la couleur si possible et jouez pique au bon moment pour réussir le contrat.", preview: "État de l'aperçu", previewCopy: "Cet aperçu propriétaire ne figure pas encore dans le catalogue public officiel.", faq: "FAQ", faqQuestion: "La progression est-elle sauvegardée ?", faqAnswer: "Oui, uniquement dans ce navigateur.", quickGuide: "Comment jouer", quickGuideCopy: "Annoncez les plis de votre équipe, fournissez la couleur si possible et jouez pique au bon moment.", opponents: ["Vous", "IA Nord", "IA Est", "IA Ouest"], metaDescription: "Annoncez avec votre équipe, fournissez la couleur et utilisez le pique comme atout dans ce jeu de cartes en aperçu propriétaire." },
    de: { title: "Pik", summary: "Biete die Stiche deines Teams, nutze Pik als Trumpf und koordiniere dich mit deinem KI-Partner.", guideKicker: "Originaler WeightPlay-Spielguide", guideSummary: "Zwei Teams reizen vor einer Stichrunde. Pik ist immer Trumpf, und Überstiche werden als Bags gezählt.", gameplayLabel: "Spielweise", gameplay: "Klassisches Stichspiel mit Trumpf", genreLabel: "Genre", genre: "Karten · Familie · Strategie", difficultyLabel: "Schwierigkeit", difficulty: "Einfach bis anspruchsvoll", timeLabel: "Geschätzte Spielzeit", time: "5–15 Minuten", skillsLabel: "Trainierte Fähigkeiten", skills: "Planung · Fokus · Mustererkennung", howTo: "So wird gespielt", howToCopy: "Biete die erwarteten Stiche deines Teams, bediene möglichst die Farbe und setze Pik im richtigen Moment ein, um den Kontrakt zu erfüllen.", preview: "Vorschaustatus", previewCopy: "Diese Besitzer-Vorschau gehört noch nicht zum offiziellen öffentlichen Katalog.", faq: "FAQ", faqQuestion: "Wird der Fortschritt gespeichert?", faqAnswer: "Ja, nur in diesem Browser.", quickGuide: "So wird gespielt", quickGuideCopy: "Biete die Stiche deines Teams, bediene möglichst die Farbe und setze Pik im richtigen Moment ein.", opponents: ["Du", "KI Nord", "KI Ost", "KI West"], metaDescription: "Biete mit deinem Team, bediene die Farbe und nutze Pik als Trumpf in diesem Kartenspiel der Besitzer-Vorschau." },
    it: { title: "Picche", summary: "Dichiara le prese della tua squadra, usa le picche come briscola e collabora con il compagno IA.", guideKicker: "Guida al gioco originale WeightPlay", guideSummary: "Due squadre dichiarano prima di una mano di prese. Le picche sono sempre briscola e le prese extra diventano sacchi.", gameplayLabel: "Come si gioca", gameplay: "Prese classiche con briscola", genreLabel: "Genere", genre: "Carte · Famiglia · Strategia", difficultyLabel: "Difficoltà", difficulty: "Da facile a impegnativo", timeLabel: "Tempo stimato", time: "5–15 minuti", skillsLabel: "Abilità allenate", skills: "Pianificazione · Concentrazione · Riconoscimento degli schemi", howTo: "Come si gioca", howToCopy: "Dichiara le prese previste dalla tua squadra, segui il seme quando puoi e usa le picche al momento giusto per rispettare il contratto.", preview: "Stato anteprima", previewCopy: "Questa anteprima del proprietario non è ancora nel catalogo pubblico ufficiale.", faq: "Domande frequenti", faqQuestion: "I progressi vengono salvati?", faqAnswer: "Sì, solo in questo browser.", quickGuide: "Come si gioca", quickGuideCopy: "Dichiara le prese della tua squadra, segui il seme quando puoi e usa le picche al momento giusto.", opponents: ["Tu", "IA Nord", "IA Est", "IA Ovest"], metaDescription: "Dichiara con la tua squadra, segui il seme e usa le picche come briscola in questo gioco di carte in anteprima." },
    ru: { title: "Пики", summary: "Заявляйте взятки своей команды, используйте пики как козырь и координируйте игру с напарником-ИИ.", guideKicker: "Оригинальный игровой гид WeightPlay", guideSummary: "Две команды делают заявки перед розыгрышем взяток. Пики всегда козырь, а лишние взятки записываются как мешки.", gameplayLabel: "Как играть", gameplay: "Классические взятки с козырем", genreLabel: "Жанр", genre: "Карты · Семейная · Стратегия", difficultyLabel: "Сложность", difficulty: "От простой до сложной", timeLabel: "Примерное время", time: "5–15 минут", skillsLabel: "Развиваемые навыки", skills: "Планирование · Внимание · Распознавание шаблонов", howTo: "Как играть", howToCopy: "Заявляйте ожидаемые взятки команды, по возможности ходите в масть и вовремя используйте пики, чтобы выполнить контракт.", preview: "Статус предпросмотра", previewCopy: "Этот предпросмотр владельца ещё не входит в официальный публичный каталог.", faq: "Частые вопросы", faqQuestion: "Прогресс сохраняется?", faqAnswer: "Да, только в этом браузере.", quickGuide: "Как играть", quickGuideCopy: "Заявляйте взятки команды, по возможности ходите в масть и вовремя используйте пики.", opponents: ["Вы", "ИИ Север", "ИИ Восток", "ИИ Запад"], metaDescription: "Делайте заявки с командой, ходите в масть и используйте пики как козырь в этой карточной игре предпросмотра." },
    hi: { title: "स्पेड्स", summary: "अपनी टीम की बाज़ियों पर बोली लगाएँ, स्पेड्स को तुरुप बनाएँ और AI साथी के साथ तालमेल करें।", guideKicker: "WeightPlay मूल गेम गाइड", guideSummary: "बाज़ियों वाले हाथ से पहले दो टीमें बोली लगाती हैं। स्पेड्स हमेशा तुरुप है और अतिरिक्त बाज़ियाँ बैग के रूप में दर्ज होती हैं।", gameplayLabel: "गेमप्ले", gameplay: "क्लासिक तुरुप बाज़ी खेल", genreLabel: "शैली", genre: "कार्ड · परिवार · रणनीति", difficultyLabel: "कठिनाई", difficulty: "आसान से चुनौतीपूर्ण", timeLabel: "अनुमानित समय", time: "5–15 मिनट", skillsLabel: "अभ्यास कौशल", skills: "योजना · ध्यान · पैटर्न पहचान", howTo: "कैसे खेलें", howToCopy: "अपनी टीम की अपेक्षित बाज़ियों पर बोली लगाएँ, संभव हो तो उसी सूट का पत्ता चलें और अनुबंध जीतने के लिए सही समय पर स्पेड्स खेलें।", preview: "प्रीव्यू स्थिति", previewCopy: "यह मालिक का प्रीव्यू आधिकारिक सार्वजनिक कैटलॉग में शामिल नहीं है।", faq: "अक्सर पूछे जाने वाले प्रश्न", faqQuestion: "क्या प्रगति सहेजी जाती है?", faqAnswer: "हाँ, केवल इसी ब्राउज़र में।", quickGuide: "कैसे खेलें", quickGuideCopy: "अपनी टीम की बाज़ियों पर बोली लगाएँ, संभव हो तो सूट का पालन करें और सही समय पर स्पेड्स खेलें।", opponents: ["आप", "AI उत्तर", "AI पूर्व", "AI पश्चिम"], metaDescription: "अपनी टीम के साथ बोली लगाएँ, सूट का पालन करें और इस मालिक-प्रीव्यू कार्ड गेम में स्पेड्स को तुरुप बनाएँ।" },
    ar: { title: "البستوني", summary: "راهن على لمّات فريقك، واستخدم البستوني حكماً، وتعاون مع زميلك من الذكاء الاصطناعي.", guideKicker: "دليل ألعاب WeightPlay الأصلية", guideSummary: "يقدّم فريقان العطاءات قبل جولة اللمّات. البستوني حكم دائماً، وتُسجَّل اللمّات الزائدة كأكياس.", gameplayLabel: "طريقة اللعب", gameplay: "لعبة لمّات كلاسيكية بحكم", genreLabel: "النوع", genre: "بطاقات · عائلية · استراتيجية", difficultyLabel: "الصعوبة", difficulty: "من السهل إلى التحدي", timeLabel: "الوقت التقريبي", time: "5–15 دقيقة", skillsLabel: "المهارات المتدرَّبة", skills: "التخطيط · التركيز · التعرّف على الأنماط", howTo: "كيفية اللعب", howToCopy: "راهن على عدد اللمّات التي يتوقع فريقك الفوز بها، واتبع النوع إن أمكن، واستخدم البستوني في اللحظة المناسبة للفوز بالعقد.", preview: "حالة المعاينة", previewCopy: "هذه معاينة المالك غير موجودة في الكتالوج العام الرسمي.", faq: "الأسئلة الشائعة", faqQuestion: "هل يُحفظ التقدم؟", faqAnswer: "نعم، في هذا المتصفح فقط.", quickGuide: "كيفية اللعب", quickGuideCopy: "راهن على لمّات فريقك، واتبع النوع إن أمكن، واستخدم البستوني في اللحظة المناسبة.", opponents: ["أنت", "الذكاء الاصطناعي شمالاً", "الذكاء الاصطناعي شرقاً", "الذكاء الاصطناعي غرباً"], metaDescription: "راهن مع فريقك، واتبع النوع، واستخدم البستوني حكماً في لعبة البطاقات هذه ضمن معاينة المالك." },
  };

  // War's static shell predates the shared card-game runtime and therefore
  // still contains English control labels on the Arabic route. Keep the
  // repair owned by the card-game runtime so Main, Battle, and Result stay in
  // one exact Arabic tuple while every other locale keeps its route copy.
  const WAR_SHELL_COPY = {
    ar: {
      title: "الحرب",
      summary: "يكشف كلا اللاعبين عن بطاقة واحدة. الرتبة الأعلى تفوز بالمجموع؛ الرتب المقيدة تؤدي إلى حرب ببطاقات إضافية.",
      guideKicker: "دليل ألعاب WeightPlay الأصلية",
      guideSummary: "يكشف كلا اللاعبين عن بطاقة واحدة. الرتبة الأعلى تفوز بالمجموع؛ الرتب المقيدة تؤدي إلى حرب ببطاقات إضافية.",
      gameplayLabel: "طريقة اللعب",
      gameplay: "لعبة بطاقات كلاسيكية لكشف الأوراق",
      genreLabel: "النوع",
      genre: "بطاقات · عائلية · استراتيجية",
      difficultyLabel: "الصعوبة",
      difficulty: "سهل",
      timeLabel: "وقت اللعب المقدر",
      time: "3-8 دقائق",
      skillsLabel: "المهارات المتدرَّبة",
      skills: "التركيز · التعرّف على الأنماط",
      howTo: "طريقة اللعب",
      howToCopy: "اضغط على «اقلب» للكشف، ثم شاهد تحرك الكومة. اللاعب الذي يجمع كل بطاقة يفوز.",
      preview: "حالة المعاينة",
      previewCopy: "معاينة المالك هذه غير موجودة في الكتالوج العام الرسمي.",
      faq: "الأسئلة الشائعة",
      faqQuestion: "هل يُحفظ التقدم؟",
      faqAnswer: "نعم، في هذا المتصفح فقط.",
      quickGuide: "طريقة اللعب",
      quickGuideCopy: "اضغط على «اقلب» للكشف، ثم شاهد تحرك الكومة. اللاعب الذي يجمع كل بطاقة يفوز.",
      metaDescription: "يكشف كلا اللاعبين عن بطاقة واحدة. الرتبة الأعلى تفوز بالمجموع؛ الرتب المقيدة تؤدي إلى حرب ببطاقات إضافية.",
    },
  };

  // Battle owns a separate localized quick-guide surface because the shared
  // route shell can be static (and therefore bypass the generic localizer).
  // Keep this complete for every supported locale so the Battle return name
  // and quick-guide never fall back to English on a localized route.
  const WAR_BATTLE_COPY = {
    en: { quickGuide: "How to play", quickGuideCopy: "Flip together and watch the collision. The higher rank takes the pot; tied ranks trigger a War." },
    "zh-Hant": { quickGuide: "玩法說明", quickGuideCopy: "一起翻牌，點數較高者收下牌堆；平手時進入戰爭。" },
    "zh-Hans": { quickGuide: "玩法说明", quickGuideCopy: "一起翻牌，点数较高者收下牌堆；平手时进入战争。" },
    ja: { quickGuide: "遊び方", quickGuideCopy: "一緒にめくって、ランクの高い方が山を取り、同点なら戦争に進みます。" },
    ko: { quickGuide: "플레이 방법", quickGuideCopy: "함께 뒤집어 더 높은 숫자가 더미를 가져가며, 동점이면 전쟁이 시작됩니다." },
    es: { quickGuide: "Cómo jugar", quickGuideCopy: "Voltea a la vez: el rango más alto gana el bote y los empates inician una guerra." },
    "pt-BR": { quickGuide: "Como jogar", quickGuideCopy: "Vire ao mesmo tempo: o maior valor leva o monte e os empates iniciam uma guerra." },
    fr: { quickGuide: "Comment jouer", quickGuideCopy: "Retournez ensemble : la valeur la plus haute remporte le pot et une égalité déclenche une bataille." },
    de: { quickGuide: "So wird gespielt", quickGuideCopy: "Decke gleichzeitig auf: Der höhere Rang gewinnt den Stapel, bei Gleichstand beginnt ein Krieg." },
    it: { quickGuide: "Come si gioca", quickGuideCopy: "Gira insieme: il valore più alto prende il piatto e un pareggio avvia una guerra." },
    ru: { quickGuide: "Как играть", quickGuideCopy: "Открывайте карты одновременно: старшая карта забирает стопку, а при равенстве начинается война." },
    hi: { quickGuide: "कैसे खेलें", quickGuideCopy: "साथ में पलटें: बड़ी रैंक ढेर जीतती है और बराबरी पर युद्ध शुरू होता है।" },
    ar: { quickGuide: "طريقة اللعب", quickGuideCopy: "اقلبا البطاقتين معًا؛ تفوز الرتبة الأعلى بالكومة، وعند التعادل تبدأ الحرب." },
  };

  const SPADES_CLASSIC_GUIDE_TITLES = {
    en: "Spades Guide",
    "zh-Hant": "黑桃遊戲指南",
    "zh-Hans": "黑桃游戏指南",
    ja: "スペードゲームガイド",
    ko: "스페이드 게임 가이드",
    es: "Guía de Picas",
    "pt-BR": "Guia de Espadas",
    fr: "Guide du jeu de Pique",
    de: "Pik-Spielguide",
    it: "Guida al gioco di Picche",
    ru: "Гид по игре «Пики»",
    hi: "स्पेड्स गेम गाइड",
    ar: "دليل لعبة البستوني",
  };

  const spadesShellCopy = () => SPADES_SHELL_COPY[currentLocale()] || SPADES_SHELL_COPY.en;
  const spadesOpponentNames = () => spadesShellCopy().opponents;
  const ownLocalizedText = (node, value) => {
    if (!node) return;
    const text = String(value ?? "");
    if (node.textContent !== text) node.textContent = text;
    if (node.getAttribute("data-runtime-localize") !== "off") node.setAttribute("data-runtime-localize", "off");
  };
  const warShellCopy = () => WAR_SHELL_COPY[currentLocale()] || null;
  const warBattleCopy = () => WAR_BATTLE_COPY[currentLocale()] || WAR_BATTLE_COPY.en;
  let warShellSyncing = false;
  const syncWarShell = () => {
    const copy = warShellCopy();
    if (warShellSyncing) return;
    warShellSyncing = true;
    try {
      const labels = TEXT[currentLocale()] || TEXT.en;
      if (copy) {
        const guideRoot = document.querySelector(".game-page-info");
        if (guideRoot) guideRoot.setAttribute("data-runtime-localize", "off");
        const pageTitle = `${copy.title} - دليل اللعبة | WeightPlay`;
        if (document.title !== pageTitle) document.title = pageTitle;
        const summary = document.querySelector('meta[name="description"]');
        if (summary && summary.content !== copy.metaDescription) summary.content = copy.metaDescription;
        document.querySelectorAll('meta[property="og:title"], meta[name="twitter:title"]').forEach((node) => { if (node.content !== pageTitle) node.content = pageTitle; });
        document.querySelectorAll('meta[property="og:description"], meta[name="twitter:description"]').forEach((node) => { if (node.content !== copy.metaDescription) node.content = copy.metaDescription; });
        const jsonLd = document.querySelector('script[type="application/ld+json"]');
        if (jsonLd) {
          try {
            const data = JSON.parse(jsonLd.textContent);
            data.name = copy.title;
            data.description = copy.metaDescription;
            data.inLanguage = currentLocale();
            jsonLd.textContent = JSON.stringify(data);
          } catch (_error) {}
        }
        document.querySelectorAll("[data-card-title]").forEach((node) => ownLocalizedText(node, copy.title));
        document.querySelectorAll("[data-card-summary]").forEach((node) => ownLocalizedText(node, copy.summary));
        ownLocalizedText(document.querySelector(".main-copy .eyebrow"), copy.guideKicker);
        ownLocalizedText(document.querySelector(".game-info-kicker"), copy.guideKicker);
        ownLocalizedText(document.querySelector(".game-info-title h2"), copy.title);
        ownLocalizedText(document.querySelector(".game-info-title p"), copy.guideSummary);
        const facts = [...document.querySelectorAll(".game-info-fact")];
        [[copy.gameplayLabel, copy.gameplay], [copy.genreLabel, copy.genre], [copy.difficultyLabel, copy.difficulty], [copy.timeLabel, copy.time], [copy.skillsLabel, copy.skills]].forEach(([label, value], index) => {
          const fact = facts[index];
          if (!fact) return;
          ownLocalizedText(fact.querySelector("span"), label);
          ownLocalizedText(fact.querySelector("strong"), value);
        });
        const sections = [...document.querySelectorAll(".game-info-section")];
        const guide = sections.find((section) => section.querySelector("ol"));
        ownLocalizedText(guide?.querySelector("h3"), copy.howTo);
        ownLocalizedText(guide?.querySelector("li"), copy.howToCopy);
        const preview = sections.find((section) => section.classList.contains("game-info-parent"));
        ownLocalizedText(preview?.querySelector("h3"), copy.preview);
        ownLocalizedText(preview?.querySelector("p"), copy.previewCopy);
        const faq = sections.find((section) => section.querySelector("dl"));
        ownLocalizedText(faq?.querySelector("h3"), copy.faq);
        ownLocalizedText(faq?.querySelector("dt"), copy.faqQuestion);
        ownLocalizedText(faq?.querySelector("dd"), copy.faqAnswer);
      }
      ownLocalizedText(document.querySelector("#startBtn"), labels.start);
      ownLocalizedText(document.querySelector("#restartBtn"), labels.restart);
      ownLocalizedText(document.querySelector("#newGameBtn"), labels.newGame);
      ownLocalizedText(document.querySelector(".settings-title"), labels.settings);
      ownLocalizedText(document.querySelector("#soundBtn"), `${labels.sound}: On`);
      const settings = document.querySelector("#audioMenuBtn");
      if (settings) settings.setAttribute("aria-label", labels.settings);
      const language = document.querySelector("#localeSelect");
      if (language) language.setAttribute("aria-label", labels.language);
      const mainReturn = document.querySelector(".main-return");
      if (mainReturn) mainReturn.setAttribute("aria-label", labels.back === "Back" ? "Back to WeightPlay" : labels.back);
      const battleBack = document.querySelector("#battleBackBtn");
      if (battleBack) {
        battleBack.setAttribute("aria-label", labels.back);
        battleBack.setAttribute("data-runtime-localize", "off");
      }
      ownLocalizedText(document.querySelector(".card-game-player-header strong"), labels.hand);
      ownLocalizedText(document.querySelector("#resultTitle"), labels.roundOver);
      ownLocalizedText(document.querySelector("#resultNewGame"), labels.newGame);
      ownLocalizedText(document.querySelector("#resultRestart"), labels.restart);
      ownLocalizedText(document.querySelector("#resultClose"), labels.close);
    } finally {
      warShellSyncing = false;
    }
  };
  let spadesShellSyncing = false;
  const syncSpadesShell = () => {
    if (spadesShellSyncing) return;
    spadesShellSyncing = true;
    const copy = spadesShellCopy();
    try {
      const guideRoot = document.querySelector(".game-page-info");
      if (guideRoot) {
        const ariaLabel = `${copy.title} game information`;
        if (guideRoot.getAttribute("aria-label") !== ariaLabel) guideRoot.setAttribute("aria-label", ariaLabel);
        if (guideRoot.getAttribute("data-runtime-localize") !== "off") guideRoot.setAttribute("data-runtime-localize", "off");
        if (guideRoot.classList.contains("classic-guide")) {
          const headings = [...guideRoot.querySelectorAll("h2, h3")];
          const paragraphs = [...guideRoot.querySelectorAll("p")];
          ownLocalizedText(headings[0], SPADES_CLASSIC_GUIDE_TITLES[currentLocale()] || SPADES_CLASSIC_GUIDE_TITLES.en);
          ownLocalizedText(paragraphs[0], copy.guideSummary);
          ownLocalizedText(headings[1], copy.howTo);
          ownLocalizedText(paragraphs[1], copy.howToCopy);
          ownLocalizedText(headings[2], copy.preview);
          ownLocalizedText(paragraphs[2], copy.previewCopy);
        }
      }
      const pageTitle = `${copy.title} | WeightPlay`;
      if (document.title !== pageTitle) document.title = pageTitle;
      const summary = document.querySelector('meta[name="description"]');
      if (summary && summary.content !== copy.metaDescription) summary.content = copy.metaDescription;
      document.querySelectorAll('meta[property="og:title"], meta[name="twitter:title"]').forEach((node) => { if (node.content !== pageTitle) node.content = pageTitle; });
      document.querySelectorAll('meta[property="og:description"], meta[name="twitter:description"]').forEach((node) => { if (node.content !== copy.metaDescription) node.content = copy.metaDescription; });
      const jsonLd = document.querySelector('script[type="application/ld+json"]');
      if (jsonLd) { try { const data = JSON.parse(jsonLd.textContent); data.name = copy.title; data.description = copy.metaDescription; data.inLanguage = currentLocale(); const nextJsonLd = JSON.stringify(data); if (jsonLd.textContent !== nextJsonLd) jsonLd.textContent = nextJsonLd; } catch (_error) {} }
      document.querySelectorAll("[data-card-title]").forEach((node) => ownLocalizedText(node, copy.title));
      document.querySelectorAll("[data-card-summary]").forEach((node) => ownLocalizedText(node, copy.summary));
      ownLocalizedText(document.querySelector(".game-info-kicker"), copy.guideKicker);
      ownLocalizedText(document.querySelector(".game-info-title h2"), copy.title);
      ownLocalizedText(document.querySelector(".game-info-title p"), copy.guideSummary);
      const facts = [...document.querySelectorAll(".game-info-fact")];
      [[copy.gameplayLabel, copy.gameplay], [copy.genreLabel, copy.genre], [copy.difficultyLabel, copy.difficulty], [copy.timeLabel, copy.time], [copy.skillsLabel, copy.skills]].forEach(([label, value], index) => { const fact = facts[index]; if (!fact) return; ownLocalizedText(fact.querySelector("span"), label); ownLocalizedText(fact.querySelector("strong"), value); });
      const sections = [...document.querySelectorAll(".game-info-section")];
      const guide = sections.find((section) => section.querySelector("ol"));
      ownLocalizedText(guide?.querySelector("h3"), copy.howTo);
      ownLocalizedText(guide?.querySelector("li"), copy.howToCopy);
      const preview = sections.find((section) => section.classList.contains("game-info-parent"));
      ownLocalizedText(preview?.querySelector("h3"), copy.preview);
      ownLocalizedText(preview?.querySelector("p"), copy.previewCopy);
      const faq = sections.find((section) => section.querySelector("dl"));
      ownLocalizedText(faq?.querySelector("h3"), copy.faq);
      ownLocalizedText(faq?.querySelector("dt"), copy.faqQuestion);
      ownLocalizedText(faq?.querySelector("dd"), copy.faqAnswer);
      ownLocalizedText(document.querySelector("#startBtn"), t("start"));
      ownLocalizedText(document.querySelector("#restartBtn"), t("restart"));
      ownLocalizedText(document.querySelector("#newGameBtn"), t("newGame"));
      ownLocalizedText(document.querySelector("#battleBackBtn"), `← ${t("back")}`);
      const battleBack = document.querySelector("#battleBackBtn");
      if (battleBack && battleBack.getAttribute("aria-label") !== t("back")) battleBack.setAttribute("aria-label", t("back"));
      ownLocalizedText(document.querySelector("#soundBtn"), `${t("sound")}: On`);
      const settings = document.querySelector("#audioMenuBtn");
      if (settings && settings.getAttribute("aria-label") !== t("settings")) settings.setAttribute("aria-label", t("settings"));
      const language = document.querySelector("#localeSelect");
      if (language && language.getAttribute("aria-label") !== t("language")) language.setAttribute("aria-label", t("language"));
      ownLocalizedText(document.querySelector(".card-game-player-header strong"), t("hand"));
      ownLocalizedText(document.querySelector("#resultTitle"), t("roundOver"));
      ownLocalizedText(document.querySelector("#resultNewGame"), t("newGame"));
      ownLocalizedText(document.querySelector("#resultRestart"), t("restart"));
      ownLocalizedText(document.querySelector("#resultClose"), t("close"));
    } finally {
      spadesShellSyncing = false;
    }
  };

  let heartsShellSyncing = false;
  const syncHeartsShell = () => {
    if (heartsShellSyncing) return;
    const copy = heartsShellCopy();
    if (!copy) return;
    heartsShellSyncing = true;
    try {
      const guideRoot = document.querySelector(".game-page-info");
      if (guideRoot) {
        if (guideRoot.getAttribute("aria-label") !== `${copy.title} game information`) guideRoot.setAttribute("aria-label", `${copy.title} game information`);
        guideRoot.setAttribute("data-runtime-localize", "off");
      }
      const pageTitle = `${copy.title} | WeightPlay`;
      if (document.title !== pageTitle) document.title = pageTitle;
      const summary = document.querySelector('meta[name="description"]');
      if (summary && summary.content !== copy.metaDescription) summary.content = copy.metaDescription;
      document.querySelectorAll('meta[property="og:title"], meta[name="twitter:title"]').forEach((node) => { if (node.content !== pageTitle) node.content = pageTitle; });
      document.querySelectorAll('meta[property="og:description"], meta[name="twitter:description"]').forEach((node) => { if (node.content !== copy.metaDescription) node.content = copy.metaDescription; });
      const jsonLd = document.querySelector('script[type="application/ld+json"]');
      if (jsonLd) { try { const data = JSON.parse(jsonLd.textContent); data.name = copy.title; data.description = copy.metaDescription; data.inLanguage = currentLocale(); jsonLd.textContent = JSON.stringify(data); } catch (_error) {} }
      document.querySelectorAll("[data-card-title]").forEach((node) => ownLocalizedText(node, copy.title));
      document.querySelectorAll("[data-card-summary]").forEach((node) => ownLocalizedText(node, copy.summary));
      ownLocalizedText(document.querySelector(".game-info-kicker"), copy.guideKicker);
      ownLocalizedText(document.querySelector(".game-info-title h2"), copy.title);
      ownLocalizedText(document.querySelector(".game-info-title p"), copy.guideSummary);
      const facts = [...document.querySelectorAll(".game-info-fact")];
      [[copy.gameplayLabel, copy.gameplay], [copy.genreLabel, copy.genre], [copy.difficultyLabel, copy.difficulty], [copy.timeLabel, copy.time], [copy.skillsLabel, copy.skills]].forEach(([label, value], index) => {
        const fact = facts[index];
        if (!fact) return;
        ownLocalizedText(fact.querySelector("span"), label);
        ownLocalizedText(fact.querySelector("strong"), value);
      });
      const sections = [...document.querySelectorAll(".game-info-section")];
      const guide = sections.find((section) => section.querySelector("ol"));
      ownLocalizedText(guide?.querySelector("h3"), copy.howTo);
      ownLocalizedText(guide?.querySelector("li"), copy.howToCopy);
      const preview = sections.find((section) => section.classList.contains("game-info-parent"));
      ownLocalizedText(preview?.querySelector("h3"), copy.preview);
      ownLocalizedText(preview?.querySelector("p"), copy.previewCopy);
      const faq = sections.find((section) => section.querySelector("dl"));
      ownLocalizedText(faq?.querySelector("h3"), copy.faq);
      ownLocalizedText(faq?.querySelector("dt"), copy.faqQuestion);
      ownLocalizedText(faq?.querySelector("dd"), copy.faqAnswer);
      ownLocalizedText(document.querySelector("#startBtn"), t("start"));
      ownLocalizedText(document.querySelector("#restartBtn"), t("restart"));
      ownLocalizedText(document.querySelector("#newGameBtn"), t("newGame"));
      ownLocalizedText(document.querySelector("#battleBackBtn"), `← ${t("back")}`);
      const battleBack = document.querySelector("#battleBackBtn");
      if (battleBack) battleBack.setAttribute("aria-label", t("back"));
      ownLocalizedText(document.querySelector(".settings-title"), copy.preview === "حالة المعاينة" ? "الإعدادات" : t("settings"));
      ownLocalizedText(document.querySelector("#soundBtn"), `${t("sound")}: On`);
      const settings = document.querySelector("#audioMenuBtn");
      if (settings) settings.setAttribute("aria-label", t("settings"));
      const language = document.querySelector("#localeSelect");
      if (language) language.setAttribute("aria-label", t("language"));
      ownLocalizedText(document.querySelector(".card-game-player-header strong"), t("hand"));
      ownLocalizedText(document.querySelector("#resultTitle"), t("roundOver"));
      ownLocalizedText(document.querySelector("#resultNewGame"), t("newGame"));
      ownLocalizedText(document.querySelector("#resultRestart"), t("restart"));
      ownLocalizedText(document.querySelector("#resultClose"), t("close"));
    } finally {
      heartsShellSyncing = false;
    }
  };

  const OLD_MAID_RISK = {
    en: { held: "Old Maid in hand — clear pairs and pass it on.", hidden: "The Old Maid is still hidden." },
    "zh-Hant": { held: "鬼牌在你手上——消除配對並設法傳出去。", hidden: "鬼牌仍藏在某位玩家手中。" },
    "zh-Hans": { held: "鬼牌在你手上——消除配对并设法传出去。", hidden: "鬼牌仍藏在某位玩家手中。" },
    ja: { held: "ババが手札にあります。ペアを消して相手に渡しましょう。", hidden: "ババはまだ誰かの手札に隠れています。" },
    ko: { held: "조커가 내 손에 있습니다. 짝을 없애고 넘겨보세요.", hidden: "조커는 아직 누군가의 손에 숨어 있습니다." },
    es: { held: "Tienes la Solterona: forma parejas e intenta pasarla.", hidden: "La Solterona sigue oculta." },
    "pt-BR": { held: "O Mico está na sua mão: forme pares e tente passá-lo.", hidden: "O Mico continua escondido." },
    fr: { held: "Le Pouilleux est dans votre main : formez des paires et passez-le.", hidden: "Le Pouilleux est encore caché." },
    de: { held: "Der Schwarze Peter ist auf deiner Hand: bilde Paare und gib ihn weiter.", hidden: "Der Schwarze Peter ist noch verborgen." },
    it: { held: "L'Asino è nella tua mano: crea coppie e prova a passarlo.", hidden: "L'Asino è ancora nascosto." },
    ru: { held: "Старая дева у вас: собирайте пары и постарайтесь передать её.", hidden: "Старая дева всё ещё скрыта." },
    hi: { held: "ओल्ड मेड आपके हाथ में है—जोड़े हटाएँ और इसे आगे दें।", hidden: "ओल्ड मेड अभी भी छिपी हुई है।" },
    ar: { held: "العانس في يدك—كوّن الأزواج وحاول تمريرها.", hidden: "بطاقة العانس ما زالت مخفية." },
  };

  const OLD_MAID_COPY = {
    en: { help: "Draw one hidden card from {name}. Pairs disappear automatically.", pair: "A pair disappeared. Your next blind draw is ready.", risk: "The Old Maid stays in your hand. Try to clear it.", none: "No pair disappeared. Watch the next blind draw." },
    "zh-Hant": { help: "從 {name} 抽一張背面牌。配對會自動消除。", pair: "成功消除一對牌。準備迎接下一次盲抽。", risk: "鬼牌仍在你手上。想辦法把它清掉。", none: "沒有消除配對。留意下一次盲抽。" },
    "zh-Hans": { help: "从 {name} 抽一张背面牌。配对会自动消除。", pair: "成功消除一对牌。准备迎接下一次盲抽。", risk: "鬼牌仍在你手上。想办法把它清掉。", none: "没有消除配对。留意下一次盲抽。" },
    ja: { help: "{name} から裏向きのカードを1枚引きます。ペアは自動で消えます。", pair: "ペアが1組消えました。次の裏引きに備えましょう。", risk: "ババが手札に残っています。手放す方法を考えましょう。", none: "ペアは消えませんでした。次の裏引きに注意しましょう。" },
    ko: { help: "{name}에게서 뒷면 카드 한 장을 뽑습니다. 짝은 자동으로 사라집니다.", pair: "짝 하나가 사라졌습니다. 다음 뒷면 카드 뽑기를 준비하세요.", risk: "버바가 내 패에 남아 있습니다. 넘길 방법을 찾아보세요.", none: "사라진 짝이 없습니다. 다음 뒷면 카드 뽑기를 주의하세요." },
    es: { help: "Roba una carta oculta de {name}. Las parejas desaparecen automáticamente.", pair: "Una pareja desapareció. Prepárate para el próximo robo a ciegas.", risk: "La Solterona sigue en tu mano. Intenta deshacerte de ella.", none: "No desapareció ninguna pareja. Cuidado con el próximo robo." },
    "pt-BR": { help: "Compre uma carta virada de {name}. Os pares desaparecem automaticamente.", pair: "Um par desapareceu. Prepare-se para a próxima compra às cegas.", risk: "O Mico continua na sua mão. Tente passá-lo.", none: "Nenhum par desapareceu. Atenção à próxima compra às cegas." },
    fr: { help: "Piochez une carte cachée chez {name}. Les paires disparaissent automatiquement.", pair: "Une paire a disparu. Préparez-vous pour la prochaine pioche à l’aveugle.", risk: "Le Pouilleux reste dans votre main. Essayez de vous en défaire.", none: "Aucune paire n’a disparu. Attention à la prochaine pioche." },
    de: { help: "Ziehe eine verdeckte Karte von {name}. Paare verschwinden automatisch.", pair: "Ein Paar ist verschwunden. Bereite dich auf den nächsten Blindzug vor.", risk: "Der Schwarze Peter bleibt auf deiner Hand. Versuche, ihn loszuwerden.", none: "Kein Paar ist verschwunden. Achte auf den nächsten Blindzug." },
    it: { help: "Pesca una carta coperta da {name}. Le coppie spariscono automaticamente.", pair: "Una coppia è sparita. Preparati alla prossima pesca alla cieca.", risk: "L'Asino è ancora nella tua mano. Prova a passarlo.", none: "Nessuna coppia è sparita. Attenzione alla prossima pesca." },
    ru: { help: "Возьмите закрытую карту у {name}. Пары исчезают автоматически.", pair: "Пара исчезла. Приготовьтесь к следующему слепому добору.", risk: "Старая дева осталась у вас в руке. Постарайтесь передать её.", none: "Пара не исчезла. Следующий слепой добор всё ещё рискован." },
    hi: { help: "{name} से एक छिपा हुआ पत्ता लें। जोड़े अपने-आप हटते हैं।", pair: "एक जोड़ा हट गया। अगली छिपी हुई चाल के लिए तैयार रहें।", risk: "ओल्ड मेड आपके हाथ में बनी हुई है। इसे आगे देने का रास्ता खोजें।", none: "कोई जोड़ा नहीं हटा। अगली छिपी हुई चाल पर ध्यान दें।" },
    ar: { help: "اسحب بطاقة مقلوبة من {name}. تختفي الأزواج تلقائياً.", pair: "اختفى زوج واحد. استعد للسحب الأعمى التالي.", risk: "ما زالت بطاقة العانس في يدك. حاول تمريرها.", none: "لم يختفِ أي زوج. انتبه إلى السحب الأعمى التالي." },
  };

  const OLD_MAID_BATTLE_COPY = {
    en: { quickGuide: "How to play", quickGuideCopy: "Draw one hidden card from the next hand. Pairs disappear automatically; avoid ending with the Old Maid." },
    "zh-Hant": { quickGuide: "玩法說明", quickGuideCopy: "從下一位玩家的手牌抽一張背面牌。配對會自動消除，別讓鬼牌留在手上。" },
    "zh-Hans": { quickGuide: "玩法说明", quickGuideCopy: "从下一位玩家的手牌抽一张背面牌。配对会自动消除，别让鬼牌留在手上。" },
    ja: { quickGuide: "遊び方", quickGuideCopy: "次のプレイヤーの手札から裏向きのカードを1枚引きます。ペアは自動で消え、ババを残さないようにします。" },
    ko: { quickGuide: "플레이 방법", quickGuideCopy: "다음 플레이어의 뒷면 패에서 한 장을 뽑습니다. 짝은 자동으로 사라지며 버바를 남기지 마세요." },
    es: { quickGuide: "Cómo jugar", quickGuideCopy: "Roba una carta oculta de la siguiente mano. Las parejas desaparecen automáticamente; evita quedarte con la Solterona." },
    "pt-BR": { quickGuide: "Como jogar", quickGuideCopy: "Compre uma carta virada da próxima mão. Os pares desaparecem automaticamente; não fique com o Mico." },
    fr: { quickGuide: "Comment jouer", quickGuideCopy: "Piochez une carte cachée dans la main suivante. Les paires disparaissent automatiquement ; évitez de garder le Pouilleux." },
    de: { quickGuide: "So wird gespielt", quickGuideCopy: "Ziehe eine verdeckte Karte aus der nächsten Hand. Paare verschwinden automatisch; behalte nicht den Schwarzen Peter." },
    it: { quickGuide: "Come si gioca", quickGuideCopy: "Pesca una carta coperta dalla mano successiva. Le coppie spariscono automaticamente; non restare con l’Asino." },
    ru: { quickGuide: "Как играть", quickGuideCopy: "Возьмите закрытую карту из следующей руки. Пары исчезают автоматически; не оставайтесь со Старой девой." },
    hi: { quickGuide: "कैसे खेलें", quickGuideCopy: "अगली बाज़ी से एक छिपा हुआ पत्ता लें। जोड़े अपने-आप हटते हैं; ओल्ड मेड अपने पास न रखें।" },
    ar: { quickGuide: "طريقة اللعب", quickGuideCopy: "اسحب بطاقة مقلوبة من يد اللاعب التالي. تختفي الأزواج تلقائياً؛ وتجنب إنهاء الجولة وبطاقة العانس في يدك." },
  };

  const OLD_MAID_PROGRESS_COPY = {
    en: { label: "Blind-draw pairs", copy: "Clear pairs and avoid the Old Maid." },
    "zh-Hant": { label: "盲抽配對", copy: "消除配對，別讓鬼牌留在手上。" },
    "zh-Hans": { label: "盲抽配对", copy: "消除配对，别让鬼牌留在手上。" },
    ja: { label: "裏引きのペア", copy: "ペアを消し、ババを残さない。" },
    ko: { label: "뒷면 뽑기 짝", copy: "짝을 없애고 버바를 남기지 마세요." },
    es: { label: "Parejas a ciegas", copy: "Forma parejas y evita quedarte con la Solterona." },
    "pt-BR": { label: "Pares às cegas", copy: "Elimine pares e não fique com o Mico." },
    fr: { label: "Paires à l’aveugle", copy: "Éliminez les paires et évitez de garder le Pouilleux." },
    de: { label: "Blind gezogene Paare", copy: "Bilde Paare und behalte nicht den Schwarzen Peter." },
    it: { label: "Coppie alla cieca", copy: "Elimina le coppie e non restare con l’Asino." },
    ru: { label: "Слепые пары", copy: "Убирайте пары и не оставайтесь со Старой девой." },
    hi: { label: "छिपे जोड़े", copy: "जोड़े हटाएँ और ओल्ड मेड अपने पास न रखें।" },
    ar: { label: "أزواج السحب الأعمى", copy: "أزل الأزواج وتجنب الاحتفاظ بالعانس." },
  };

  const OLD_MAID_NAMES = {
    en: ["You", "Fox", "Panda", "Otter"],
    "zh-Hant": ["你", "狐狸", "熊貓", "水獺"],
    "zh-Hans": ["你", "狐狸", "熊猫", "水獭"],
    ja: ["あなた", "キツネ", "パンダ", "カワウソ"],
    ko: ["나", "여우", "판다", "수달"],
    es: ["Tú", "Zorro", "Panda", "Nutria"],
    "pt-BR": ["Você", "Raposa", "Panda", "Lontra"],
    fr: ["Vous", "Renard", "Panda", "Loutre"],
    de: ["Du", "Fuchs", "Panda", "Fischotter"],
    it: ["Tu", "Volpe", "Panda", "Lontra"],
    ru: ["Вы", "Лиса", "Панда", "Выдра"],
    hi: ["आप", "लोमड़ी", "पांडा", "ऊदबिलाव"],
    ar: ["أنت", "الثعلب", "الباندا", "قضاعة"],
  };

  const oldMaidText = (key, values = {}) => {
    const dictionary = OLD_MAID_COPY[currentLocale()] || OLD_MAID_COPY.en;
    return (dictionary[key] || OLD_MAID_COPY.en[key] || key).replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? ""));
  };

  let oldMaidShellSyncing = false;
  const syncOldMaidShell = () => {
    if (oldMaidShellSyncing) return;
    oldMaidShellSyncing = true;
    try {
      const labels = TEXT[currentLocale()] || TEXT.en;
      const progressCopy = OLD_MAID_PROGRESS_COPY[currentLocale()] || OLD_MAID_PROGRESS_COPY.en;
      ownLocalizedText(document.querySelector("[data-wp-main-progress] strong"), progressCopy.label);
      ownLocalizedText(document.querySelector("[data-wp-main-progress] span"), progressCopy.copy);
      ["#startBtn", "#restartBtn", "#newGameBtn"].forEach((selector, index) => ownLocalizedText(document.querySelector(selector), [labels.start, labels.restart, labels.newGame][index]));
      ownLocalizedText(document.querySelector(".settings-title"), labels.settings);
      ownLocalizedText(document.querySelector("#soundBtn"), `${labels.sound}: On`);
      ownLocalizedText(document.querySelector("#battleBackBtn"), `← ${labels.back}`);
      ownLocalizedText(document.querySelector("#resultNewGame"), labels.newGame);
      ownLocalizedText(document.querySelector("#resultRestart"), labels.restart);
      ownLocalizedText(document.querySelector("#resultClose"), labels.back);
      const settings = document.querySelector("#audioMenuBtn");
      if (settings) settings.setAttribute("aria-label", labels.settings);
      const mainReturn = document.querySelector(".main-return");
      if (mainReturn) mainReturn.setAttribute("aria-label", labels.back === "Back" ? "Back to WeightPlay" : labels.back);
      const battleBack = document.querySelector("#battleBackBtn");
      if (battleBack) {
        battleBack.setAttribute("aria-label", labels.back);
        battleBack.setAttribute("data-runtime-localize", "off");
      }
      const language = document.querySelector("#localeSelect");
      if (language) language.setAttribute("aria-label", labels.language);
      const battleUtility = document.querySelector("[data-wp-battle-utility]");
      if (battleUtility) {
        battleUtility.setAttribute("aria-label", labels.settings);
        battleUtility.title = labels.settings;
      }
    } finally {
      oldMaidShellSyncing = false;
    }
  };

  const OLD_MAID_RESULT = {
    en: { lost: "You kept the Old Maid. Final holder: {holder}.", cleared: "You cleared the risk. Final holder: {holder}." },
    "zh-Hant": { lost: "你在最後留下鬼牌。最後持有者：{holder}。", cleared: "你在最後成功清掉風險。最後持有者：{holder}。" },
    "zh-Hans": { lost: "你在最后留下鬼牌。最后持有者：{holder}。", cleared: "你在最后成功清掉风险。最后持有者：{holder}。" },
    ja: { lost: "最後までババを持っていました。最後の持ち主：{holder}。", cleared: "ババの危険を切り抜けました。最後の持ち主：{holder}。" },
    ko: { lost: "마지막에 조커를 들고 있었습니다. 최종 보유자: {holder}.", cleared: "조커 위험을 넘겼습니다. 최종 보유자: {holder}." },
    es: { lost: "Conservaste la Solterona al final. Último dueño: {holder}.", cleared: "Superaste el riesgo. Último dueño: {holder}." },
    "pt-BR": { lost: "Você ficou com o Mico no fim. Último dono: {holder}.", cleared: "Você se livrou do risco. Último dono: {holder}." },
    fr: { lost: "Vous avez gardé le Pouilleux à la fin. Dernier détenteur : {holder}.", cleared: "Vous avez écarté le risque. Dernier détenteur : {holder}." },
    de: { lost: "Du hattest am Ende den Schwarzen Peter. Letzter Besitzer: {holder}.", cleared: "Du bist dem Risiko entkommen. Letzter Besitzer: {holder}." },
    it: { lost: "Alla fine avevi l'Asino. Ultimo possessore: {holder}.", cleared: "Hai superato il rischio. Ultimo possessore: {holder}." },
    ru: { lost: "В конце Старая дева осталась у вас. Последний держатель: {holder}.", cleared: "Вы избежали риска. Последний держатель: {holder}." },
    hi: { lost: "अंत में ओल्ड मेड आपके पास थी। अंतिम धारक: {holder}।", cleared: "आपने जोखिम पार कर लिया। अंतिम धारक: {holder}।" },
    ar: { lost: "احتفظت بالعانس حتى النهاية. الحامل الأخير: {holder}.", cleared: "تجاوزت خطر العانس. الحامل الأخير: {holder}." },
  };

  const GIN_PATH = {
    en: { reduce: "Reduce deadwood by {count} to unlock Knock · Gin at 0", ready: "Knock ready at {deadwood} deadwood · Gin at 0", gin: "Gin ready · 0 deadwood" },
    "zh-Hant": { reduce: "死牌再減少 {count} 點即可敲牌 · 0 點達成金牌", ready: "死牌 {deadwood} 點，可敲牌 · 0 點達成金牌", gin: "金牌已就緒 · 死牌 0 點" },
    "zh-Hans": { reduce: "死牌再减少 {count} 点即可敲牌 · 0 点达成金牌", ready: "死牌 {deadwood} 点，可敲牌 · 0 点达成金牌", gin: "金牌已就绪 · 死牌 0 点" },
    ja: { reduce: "デッドウッドをあと {count} 点減らすとノック · 0 点でジン", ready: "デッドウッド {deadwood} 点、ノック可能 · 0 点でジン", gin: "ジン可能 · デッドウッド 0 点" },
    ko: { reduce: "데드우드를 {count}점 더 줄이면 노크 · 0점이면 진", ready: "데드우드 {deadwood}점, 노크 가능 · 0점이면 진", gin: "진 가능 · 데드우드 0점" },
    es: { reduce: "Reduce la madera muerta en {count} para golpear · Gin con 0", ready: "Puedes golpear con {deadwood} de madera muerta · Gin con 0", gin: "Gin listo · 0 de madera muerta" },
    "pt-BR": { reduce: "Reduza a madeira morta em {count} para bater · Gin com 0", ready: "Pode bater com {deadwood} de madeira morta · Gin com 0", gin: "Gin pronto · 0 de madeira morta" },
    fr: { reduce: "Réduisez le bois mort de {count} pour frapper · Gin à 0", ready: "Frappe possible avec {deadwood} de bois mort · Gin à 0", gin: "Gin prêt · 0 bois mort" },
    de: { reduce: "Totholz um {count} senken zum Klopfen · Gin bei 0", ready: "Klopfen bereit bei {deadwood} Totholz · Gin bei 0", gin: "Gin bereit · 0 Totholz" },
    it: { reduce: "Riduci le carte morte di {count} per battere · Gin a 0", ready: "Puoi battere con {deadwood} carte morte · Gin a 0", gin: "Gin pronto · 0 carte morte" },
    ru: { reduce: "Уменьшите дедвуд ещё на {count}, чтобы стучать · Джин при 0", ready: "Можно стучать: дедвуд {deadwood} · Джин при 0", gin: "Джин готов · дедвуд 0" },
    hi: { reduce: "नॉक खोलने के लिए डेडवुड {count} और घटाएँ · 0 पर जिन", ready: "{deadwood} डेडवुड पर नॉक तैयार · 0 पर जिन", gin: "जिन तैयार · 0 डेडवुड" },
    ar: { reduce: "خفّض الخشب الميت {count} إضافية لفتح الطرق · جين عند 0", ready: "الطرق متاح عند {deadwood} خشب ميت · جين عند 0", gin: "جين جاهز · 0 خشب ميت" },
  };

  const ginPathText = (deadwood) => {
    const dictionary = GIN_PATH[currentLocale()] || GIN_PATH.en;
    const template = deadwood === 0 ? dictionary.gin : deadwood <= 10 ? dictionary.ready : dictionary.reduce;
    return template.replaceAll("{deadwood}", String(deadwood)).replaceAll("{count}", String(Math.max(0, deadwood - 10)));
  };

  const GIN_SHELL_COPY = {
    en: { quickGuide: "How to play", quickGuideCopy: "Draw from the stock or discard, then discard one card. Knock with a low Deadwood hand or reach Gin.", resultTitle: "Round complete", winner: "You win!", loser: "AI wins", newGame: "New Game", restart: "Restart", close: "Close" },
    "zh-Hant": { quickGuide: "玩法", quickGuideCopy: "從牌庫或棄牌堆抽一張，再棄一張牌。用低死牌敲牌，或完成金牌。", resultTitle: "本局完成", winner: "你贏了！", loser: "AI 獲勝", newGame: "新遊戲", restart: "重新開始", close: "關閉" },
    "zh-Hans": { quickGuide: "玩法", quickGuideCopy: "从牌库或弃牌堆抽一张，再弃一张牌。用低死牌敲牌，或完成金牌。", resultTitle: "本局完成", winner: "你赢了！", loser: "AI 获胜", newGame: "新游戏", restart: "重新开始", close: "关闭" },
    ja: { quickGuide: "遊び方", quickGuideCopy: "山札または捨て札から1枚引き、1枚捨てます。デッドウッドを減らしてノックするか、ジンを目指します。", resultTitle: "ラウンド終了", winner: "あなたの勝ち！", loser: "AIの勝ち", newGame: "新しいゲーム", restart: "再スタート", close: "閉じる" },
    ko: { quickGuide: "게임 방법", quickGuideCopy: "덱이나 버린 카드에서 한 장을 뽑고 한 장을 버리세요. 데드우드를 줄여 노크하거나 진을 완성하세요.", resultTitle: "라운드 완료", winner: "승리했습니다!", loser: "AI 승리", newGame: "새 게임", restart: "다시 시작", close: "닫기" },
    es: { quickGuide: "Cómo jugar", quickGuideCopy: "Roba del mazo o del descarte y luego descarta una carta. Golpea con poca madera muerta o consigue Gin.", resultTitle: "Ronda completada", winner: "¡Has ganado!", loser: "Gana la IA", newGame: "Nueva partida", restart: "Reiniciar", close: "Cerrar" },
    "pt-BR": { quickGuide: "Como jogar", quickGuideCopy: "Compre do monte ou do descarte e depois descarte uma carta. Bata com pouca madeira morta ou faça Gin.", resultTitle: "Rodada concluída", winner: "Você venceu!", loser: "A IA venceu", newGame: "Novo jogo", restart: "Reiniciar", close: "Fechar" },
    fr: { quickGuide: "Comment jouer", quickGuideCopy: "Piochez dans la pioche ou la défausse, puis défaussez une carte. Frappez avec peu de bois mort ou faites Gin.", resultTitle: "Manche terminée", winner: "Vous gagnez !", loser: "L’IA gagne", newGame: "Nouvelle partie", restart: "Recommencer", close: "Fermer" },
    de: { quickGuide: "So wird gespielt", quickGuideCopy: "Ziehe vom Stapel oder aus der Ablage und wirf dann eine Karte ab. Klopfe mit wenig Totholz oder erreiche Gin.", resultTitle: "Runde beendet", winner: "Du gewinnst!", loser: "Die KI gewinnt", newGame: "Neues Spiel", restart: "Neu starten", close: "Schließen" },
    it: { quickGuide: "Come si gioca", quickGuideCopy: "Pesca dal mazzo o dagli scarti, poi scarta una carta. Batti con poche carte morte o realizza Gin.", resultTitle: "Mano conclusa", winner: "Hai vinto!", loser: "Vince l’IA", newGame: "Nuova partita", restart: "Ricomincia", close: "Chiudi" },
    ru: { quickGuide: "Как играть", quickGuideCopy: "Берите карту из колоды или сброса, затем сбрасывайте одну карту. Стучите с малым дедвудом или соберите джин.", resultTitle: "Раунд завершён", winner: "Вы выиграли!", loser: "Победил ИИ", newGame: "Новая игра", restart: "Начать заново", close: "Закрыть" },
    hi: { quickGuide: "कैसे खेलें", quickGuideCopy: "गड्डी या फेंके हुए पत्तों से एक पत्ता लें, फिर एक पत्ता छोड़ें। कम डेडवुड पर नॉक करें या जिन बनाएँ।", resultTitle: "राउंड पूरा", winner: "आप जीत गए!", loser: "AI जीत गया", newGame: "नया खेल", restart: "फिर शुरू करें", close: "बंद करें" },
    ar: { quickGuide: "طريقة اللعب", quickGuideCopy: "اسحب من الرزمة أو من الرمي، ثم ارمِ بطاقة واحدة. استخدم الطرق مع خشب ميت قليل أو حقق جين.", resultTitle: "اكتملت الجولة", winner: "لقد فزت!", loser: "فاز الذكاء الاصطناعي", newGame: "لعبة جديدة", restart: "إعادة البدء", close: "إغلاق" },
  };

  const GIN_MAIN_COPY = {
    en: { eyebrow: "Classic Card Game · Owner Preview", summary: "Draw and discard to build sets and runs while keeping Deadwood low." },
    "zh-Hant": { eyebrow: "經典卡牌遊戲 · 擁有者預覽", summary: "從牌庫或棄牌堆抽牌與棄牌，組成牌組和順子並降低死牌。" },
    "zh-Hans": { eyebrow: "经典卡牌游戏 · 拥有者预览", summary: "从牌库或弃牌堆抽牌与弃牌，组成牌组和顺子并降低死牌。" },
    ja: { eyebrow: "クラシックカードゲーム · オーナープレビュー", summary: "山札や捨て札から引いて捨て、セットと連続を作りながら残り札を減らします。" },
    ko: { eyebrow: "클래식 카드 게임 · 소유자 프리뷰", summary: "덱에서 뽑고 카드를 버리며 세트와 연속을 만들고 데드우드를 줄이세요." },
    es: { eyebrow: "Juego clásico de cartas · Vista previa del propietario", summary: "Roba y descarta para formar grupos y escaleras mientras reduces las cartas sin combinar." },
    "pt-BR": { eyebrow: "Jogo clássico de cartas · Prévia do proprietário", summary: "Compre e descarte para formar conjuntos e sequências enquanto reduz as cartas sem combinação." },
    fr: { eyebrow: "Jeu de cartes classique · Aperçu propriétaire", summary: "Piochez et défaussez pour former des combinaisons et des suites tout en réduisant les cartes isolées." },
    de: { eyebrow: "Klassisches Kartenspiel · Besitzer-Vorschau", summary: "Ziehe und wirf ab, um Gruppen und Folgen zu bilden und nicht kombinierte Karten zu verringern." },
    it: { eyebrow: "Gioco classico di carte · Anteprima del proprietario", summary: "Pesca e scarta per creare combinazioni e sequenze riducendo le carte non combinate." },
    ru: { eyebrow: "Классическая карточная игра · Предпросмотр владельца", summary: "Берите и сбрасывайте карты, собирая комбинации и последовательности и уменьшая число лишних карт." },
    hi: { eyebrow: "क्लासिक कार्ड गेम · मालिक का प्रीव्यू", summary: "सेट और क्रम बनाने के लिए पत्ते लें और छोड़ें तथा बिना संयोजन वाले पत्तों को कम करें।" },
    ar: { eyebrow: "لعبة بطاقات كلاسيكية · معاينة المالك", summary: "اسحب وارمِ البطاقات لتكوين مجموعات وتسلسلات مع خفض البطاقات غير المجمّعة." },
  };

  const ginShellText = (key) => {
    const dictionary = GIN_SHELL_COPY[currentLocale()] || GIN_SHELL_COPY.en;
    return dictionary[key] || GIN_SHELL_COPY.en[key] || key;
  };

  let ginShellSyncing = false;
  const syncGinShell = () => {
    if (ginShellSyncing) return;
    ginShellSyncing = true;
    try {
      const copy = GIN_MAIN_COPY[currentLocale()] || GIN_MAIN_COPY.en;
      const labels = TEXT[currentLocale()] || TEXT.en;
      ownLocalizedText(document.querySelector(".main-copy .eyebrow"), copy.eyebrow);
      ownLocalizedText(document.querySelector("#startBtn"), labels.start);
      ownLocalizedText(document.querySelector("#restartBtn"), labels.restart);
      ownLocalizedText(document.querySelector("#newGameBtn"), labels.newGame);
      ownLocalizedText(document.querySelector(".settings-title"), labels.settings);
      ownLocalizedText(document.querySelector("#soundBtn"), `${labels.sound}: On`);
      const settings = document.querySelector("#audioMenuBtn");
      if (settings) settings.setAttribute("aria-label", labels.settings);
      const language = document.querySelector("#localeSelect");
      if (language) language.setAttribute("aria-label", labels.language);
      const battleBack = document.querySelector("#battleBackBtn");
      if (battleBack) {
        battleBack.setAttribute("aria-label", labels.back);
        battleBack.setAttribute("data-runtime-localize", "off");
      }
      const mainReturn = document.querySelector(".main-return");
      if (mainReturn) mainReturn.setAttribute("aria-label", labels.back === "Back" ? "Back to WeightPlay" : labels.back);
    } finally {
      ginShellSyncing = false;
    }
  };

  const CRIBBAGE_SHELL_COPY = {
    en: { title: "Cribbage", summary: "Discard two cards to the crib, peg without passing 31, then score hands using classic combinations.", guideKicker: "WeightPlay Original Game Guide", guideSummary: "Discard two cards to the crib, peg without passing 31, then score hands using classic combinations.", gameplayLabel: "Gameplay", gameplay: "Classic Pegging Card Game", genreLabel: "Genre", genre: "Card · Family · Strategy", difficultyLabel: "Difficulty", difficulty: "Easy to Challenging", timeLabel: "Estimated Play Time", time: "5-15 minutes", skillsLabel: "Skills Trained", skills: "Planning · Focus · Pattern Recognition", howTo: "How to Play", howToCopy: "Pairs, runs, and fifteens score points. The first player to reach 121 wins.", preview: "Preview status", previewCopy: "This owner preview is not in the formal public catalog.", faq: "FAQ", faqQuestion: "Is progress saved?", faqAnswer: "Yes, only in this browser.", quickGuide: "How to play", quickGuideCopy: "Pairs, runs, and fifteens score points. The first player to reach 121 wins.", metaDescription: "Choose two cards for the crib, peg toward 31, and score classic combinations in this owner-preview Cribbage game." },
    "zh-Hant": { title: "克里比奇", summary: "送兩張牌進入 crib，在不超過 31 的情況下出牌，再用經典組合為手牌計分。", guideKicker: "WeightPlay 原創遊戲指南", guideSummary: "將兩張牌送入 crib，在不超過 31 的情況下出牌，再用經典組合為手牌計分。", gameplayLabel: "玩法", gameplay: "經典計數卡牌遊戲", genreLabel: "類型", genre: "卡牌 · 家庭 · 策略", difficultyLabel: "難度", difficulty: "由簡單到具挑戰", timeLabel: "預計遊玩時間", time: "5–15 分鐘", skillsLabel: "訓練技能", skills: "規劃 · 專注 · 模式辨識", howTo: "玩法說明", howToCopy: "對子、順子和十五都能得分；先到 121 分的玩家獲勝。", preview: "預覽狀態", previewCopy: "這是擁有者預覽，尚未列入正式公開目錄。", faq: "常見問題", faqQuestion: "進度會保存嗎？", faqAnswer: "會，只保存在這個瀏覽器中。", quickGuide: "玩法說明", quickGuideCopy: "對子、順子和十五都能得分；先到 121 分的玩家獲勝。", metaDescription: "選兩張牌送入 crib，朝 31 點出牌，並在這款擁有者預覽的克里比奇遊戲中用經典組合得分。" },
    "zh-Hans": { title: "克里比奇", summary: "将两张牌送入 crib，在不超过 31 的情况下出牌，再用经典组合为手牌计分。", guideKicker: "WeightPlay 原创游戏指南", guideSummary: "将两张牌送入 crib，在不超过 31 的情况下出牌，再用经典组合为手牌计分。", gameplayLabel: "玩法", gameplay: "经典计数卡牌游戏", genreLabel: "类型", genre: "卡牌 · 家庭 · 策略", difficultyLabel: "难度", difficulty: "从简单到具挑战", timeLabel: "预计游玩时间", time: "5–15 分钟", skillsLabel: "训练技能", skills: "规划 · 专注 · 模式识别", howTo: "玩法说明", howToCopy: "对子、顺子和十五都能得分；先到 121 分的玩家获胜。", preview: "预览状态", previewCopy: "这是拥有者预览，尚未列入正式公开目录。", faq: "常见问题", faqQuestion: "进度会保存吗？", faqAnswer: "会，只保存在这个浏览器中。", quickGuide: "玩法说明", quickGuideCopy: "对子、顺子和十五都能得分；先到 121 分的玩家获胜。", metaDescription: "选两张牌送入 crib，朝 31 点出牌，并在这款拥有者预览的克里比奇游戏中用经典组合得分。" },
    ja: { title: "クリベッジ", summary: "2枚をクリブに送り、31を超えないようにペギングし、定番の組み合わせで手札を得点化します。", guideKicker: "WeightPlay オリジナルゲームガイド", guideSummary: "2枚をクリブに送り、31を超えないようにペギングし、定番の組み合わせで手札を得点化します。", gameplayLabel: "遊び方", gameplay: "クラシックなペギングカードゲーム", genreLabel: "ジャンル", genre: "カード · ファミリー · 戦略", difficultyLabel: "難易度", difficulty: "簡単から挑戦的", timeLabel: "プレイ時間の目安", time: "5～15分", skillsLabel: "鍛えられる力", skills: "計画 · 集中 · パターン認識", howTo: "遊び方", howToCopy: "ペア、ラン、15で得点します。最初に121点へ到達したプレイヤーが勝ちです。", preview: "プレビュー状態", previewCopy: "この所有者プレビューは正式な公開カタログには含まれていません。", faq: "よくある質問", faqQuestion: "進行状況は保存されますか？", faqAnswer: "はい。このブラウザ内だけに保存されます。", quickGuide: "遊び方", quickGuideCopy: "ペア、ラン、15で得点します。最初に121点へ到達したプレイヤーが勝ちです。", metaDescription: "2枚をクリブに送り、31を目指してペギングし、定番の組み合わせで得点するクリベッジです。" },
    ko: { title: "크리비지", summary: "두 장을 크립에 보내고 31을 넘지 않게 페깅한 뒤 고전 조합으로 패의 점수를 계산하세요.", guideKicker: "WeightPlay 오리지널 게임 가이드", guideSummary: "두 장을 크립에 보내고 31을 넘지 않게 페깅한 뒤 고전 조합으로 패의 점수를 계산하세요.", gameplayLabel: "게임 방식", gameplay: "클래식 페깅 카드 게임", genreLabel: "장르", genre: "카드 · 가족 · 전략", difficultyLabel: "난이도", difficulty: "쉬움부터 도전적", timeLabel: "예상 플레이 시간", time: "5~15분", skillsLabel: "훈련 능력", skills: "계획 · 집중 · 패턴 인식", howTo: "플레이 방법", howToCopy: "페어, 런, 15로 점수를 얻습니다. 먼저 121점에 도달한 플레이어가 승리합니다.", preview: "프리뷰 상태", previewCopy: "이 소유자 프리뷰는 공식 공개 카탈로그에 포함되지 않습니다.", faq: "자주 묻는 질문", faqQuestion: "진행 상황이 저장되나요?", faqAnswer: "네. 이 브라우저에만 저장됩니다.", quickGuide: "플레이 방법", quickGuideCopy: "페어, 런, 15로 점수를 얻습니다. 먼저 121점에 도달한 플레이어가 승리합니다.", metaDescription: "두 장을 크립에 보내고 31을 향해 페깅하며 고전 조합으로 점수를 얻는 크리비지 소유자 프리뷰입니다." },
    es: { title: "Cribbage", summary: "Envía dos cartas a la cuna, juega sin superar 31 y puntúa la mano con combinaciones clásicas.", guideKicker: "Guía de juegos originales de WeightPlay", guideSummary: "Envía dos cartas a la cuna, juega sin superar 31 y puntúa la mano con combinaciones clásicas.", gameplayLabel: "Jugabilidad", gameplay: "Juego clásico de conteo de cartas", genreLabel: "Género", genre: "Cartas · Familiar · Estrategia", difficultyLabel: "Dificultad", difficulty: "De fácil a desafiante", timeLabel: "Tiempo estimado", time: "5-15 minutos", skillsLabel: "Habilidades", skills: "Planificación · Concentración · Reconocimiento de patrones", howTo: "Cómo jugar", howToCopy: "Las parejas, las escaleras y los quince dan puntos. Gana quien llegue primero a 121.", preview: "Estado de la vista previa", previewCopy: "Esta vista previa del propietario aún no está en el catálogo público oficial.", faq: "Preguntas frecuentes", faqQuestion: "¿Se guarda el progreso?", faqAnswer: "Sí, solo en este navegador.", quickGuide: "Cómo jugar", quickGuideCopy: "Las parejas, las escaleras y los quince dan puntos. Gana quien llegue primero a 121.", metaDescription: "Envía dos cartas a la cuna, juega hacia 31 y puntúa combinaciones clásicas en este Cribbage de vista previa del propietario." },
    "pt-BR": { title: "Cribbage", summary: "Envie duas cartas ao crib, faça o pegging sem passar de 31 e pontue a mão com combinações clássicas.", guideKicker: "Guia de jogos originais WeightPlay", guideSummary: "Envie duas cartas ao crib, faça o pegging sem passar de 31 e pontue a mão com combinações clássicas.", gameplayLabel: "Como jogar", gameplay: "Jogo clássico de contagem de cartas", genreLabel: "Gênero", genre: "Cartas · Família · Estratégia", difficultyLabel: "Dificuldade", difficulty: "De fácil a desafiador", timeLabel: "Tempo estimado", time: "5–15 minutos", skillsLabel: "Habilidades", skills: "Planejamento · Foco · Reconhecimento de padrões", howTo: "Como jogar", howToCopy: "Pares, sequências e quinze valem pontos. Vence quem chegar primeiro a 121.", preview: "Status da prévia", previewCopy: "Esta prévia do proprietário ainda não faz parte do catálogo público oficial.", faq: "Perguntas frequentes", faqQuestion: "O progresso é salvo?", faqAnswer: "Sim, apenas neste navegador.", quickGuide: "Como jogar", quickGuideCopy: "Pares, sequências e quinze valem pontos. Vence quem chegar primeiro a 121.", metaDescription: "Envie duas cartas ao crib, avance até 31 e pontue combinações clássicas neste Cribbage em prévia do proprietário." },
    fr: { title: "Cribbage", summary: "Envoyez deux cartes au crib, jouez sans dépasser 31, puis marquez la main avec des combinaisons classiques.", guideKicker: "Guide des jeux originaux WeightPlay", guideSummary: "Envoyez deux cartes au crib, jouez sans dépasser 31, puis marquez la main avec des combinaisons classiques.", gameplayLabel: "Jeu", gameplay: "Jeu de cartes classique à comptage", genreLabel: "Genre", genre: "Cartes · Famille · Stratégie", difficultyLabel: "Difficulté", difficulty: "De facile à exigeant", timeLabel: "Durée estimée", time: "5 à 15 minutes", skillsLabel: "Compétences", skills: "Planification · Concentration · Reconnaissance des motifs", howTo: "Comment jouer", howToCopy: "Les paires, suites et quinze rapportent des points. Le premier à atteindre 121 gagne.", preview: "État de l’aperçu", previewCopy: "Cet aperçu propriétaire ne figure pas encore dans le catalogue public officiel.", faq: "Questions fréquentes", faqQuestion: "La progression est-elle sauvegardée ?", faqAnswer: "Oui, uniquement dans ce navigateur.", quickGuide: "Comment jouer", quickGuideCopy: "Les paires, suites et quinze rapportent des points. Le premier à atteindre 121 gagne.", metaDescription: "Envoyez deux cartes au crib, visez 31 et marquez des combinaisons classiques dans ce Cribbage en aperçu propriétaire." },
    de: { title: "Cribbage", summary: "Lege zwei Karten in den Crib, spiele ohne über 31 zu kommen und werte die Hand mit klassischen Kombinationen.", guideKicker: "WeightPlay-Leitfaden für Originalspiele", guideSummary: "Lege zwei Karten in den Crib, spiele ohne über 31 zu kommen und werte die Hand mit klassischen Kombinationen.", gameplayLabel: "Spielweise", gameplay: "Klassisches Zähl-Kartenspiel", genreLabel: "Genre", genre: "Karten · Familie · Strategie", difficultyLabel: "Schwierigkeit", difficulty: "Einfach bis anspruchsvoll", timeLabel: "Geschätzte Spielzeit", time: "5–15 Minuten", skillsLabel: "Trainierte Fähigkeiten", skills: "Planung · Fokus · Mustererkennung", howTo: "So wird gespielt", howToCopy: "Paare, Folgen und Fünfzehner bringen Punkte. Wer zuerst 121 erreicht, gewinnt.", preview: "Vorschaustatus", previewCopy: "Diese Besitzer-Vorschau gehört noch nicht zum offiziellen öffentlichen Katalog.", faq: "Häufig gestellte Fragen", faqQuestion: "Wird der Fortschritt gespeichert?", faqAnswer: "Ja, nur in diesem Browser.", quickGuide: "So wird gespielt", quickGuideCopy: "Paare, Folgen und Fünfzehner bringen Punkte. Wer zuerst 121 erreicht, gewinnt.", metaDescription: "Lege zwei Karten in den Crib, spiele Richtung 31 und werte klassische Kombinationen in dieser Cribbage-Besitzer-Vorschau." },
    it: { title: "Cribbage", summary: "Manda due carte nel crib, gioca senza superare 31 e assegna i punti alla mano con combinazioni classiche.", guideKicker: "Guida ai giochi originali WeightPlay", guideSummary: "Manda due carte nel crib, gioca senza superare 31 e assegna i punti alla mano con combinazioni classiche.", gameplayLabel: "Come si gioca", gameplay: "Gioco classico di conteggio delle carte", genreLabel: "Genere", genre: "Carte · Famiglia · Strategia", difficultyLabel: "Difficoltà", difficulty: "Da facile a impegnativo", timeLabel: "Tempo stimato", time: "5–15 minuti", skillsLabel: "Abilità allenate", skills: "Pianificazione · Concentrazione · Riconoscimento degli schemi", howTo: "Come si gioca", howToCopy: "Coppie, sequenze e quindici fanno punti. Vince chi raggiunge per primo 121.", preview: "Stato anteprima", previewCopy: "Questa anteprima del proprietario non è ancora nel catalogo pubblico ufficiale.", faq: "Domande frequenti", faqQuestion: "I progressi vengono salvati?", faqAnswer: "Sì, solo in questo browser.", quickGuide: "Come si gioca", quickGuideCopy: "Coppie, sequenze e quindici fanno punti. Vince chi raggiunge per primo 121.", metaDescription: "Manda due carte nel crib, gioca verso 31 e segna combinazioni classiche in questo Cribbage in anteprima." },
    ru: { title: "Криббедж", summary: "Отправьте две карты в криб, играйте, не переходя 31, затем начисляйте очки за классические комбинации.", guideKicker: "Руководство по оригинальным играм WeightPlay", guideSummary: "Отправьте две карты в криб, играйте, не переходя 31, затем начисляйте очки за классические комбинации.", gameplayLabel: "Как играть", gameplay: "Классическая карточная игра с подсчётом", genreLabel: "Жанр", genre: "Карты · Семейная · Стратегия", difficultyLabel: "Сложность", difficulty: "От простой до сложной", timeLabel: "Примерное время", time: "5–15 минут", skillsLabel: "Развиваемые навыки", skills: "Планирование · Внимание · Распознавание шаблонов", howTo: "Как играть", howToCopy: "Пары, последовательности и пятнадцать приносят очки. Побеждает первый игрок, набравший 121.", preview: "Статус предпросмотра", previewCopy: "Этот предпросмотр владельца ещё не входит в официальный публичный каталог.", faq: "Частые вопросы", faqQuestion: "Прогресс сохраняется?", faqAnswer: "Да, только в этом браузере.", quickGuide: "Как играть", quickGuideCopy: "Пары, последовательности и пятнадцать приносят очки. Побеждает первый игрок, набравший 121.", metaDescription: "Отправляйте две карты в криб, двигайтесь к 31 и набирайте очки за классические комбинации в Cribbage." },
    hi: { title: "क्रिबेज", summary: "दो पत्ते क्रिब में भेजें, 31 से आगे जाए बिना पेगिंग करें और क्लासिक संयोजनों से हाथ के अंक पाएँ।", guideKicker: "WeightPlay मौलिक गेम गाइड", guideSummary: "दो पत्ते क्रिब में भेजें, 31 से आगे जाए बिना पेगिंग करें और क्लासिक संयोजनों से हाथ के अंक पाएँ।", gameplayLabel: "गेमप्ले", gameplay: "क्लासिक अंक-गणना कार्ड गेम", genreLabel: "शैली", genre: "कार्ड · परिवार · रणनीति", difficultyLabel: "कठिनाई", difficulty: "आसान से चुनौतीपूर्ण", timeLabel: "अनुमानित समय", time: "5–15 मिनट", skillsLabel: "अभ्यास कौशल", skills: "योजना · ध्यान · पैटर्न पहचान", howTo: "कैसे खेलें", howToCopy: "जोड़े, रन और पंद्रह अंक देते हैं। 121 तक पहले पहुँचने वाला खिलाड़ी जीतता है।", preview: "प्रीव्यू स्थिति", previewCopy: "यह मालिक का प्रीव्यू आधिकारिक सार्वजनिक कैटलॉग में शामिल नहीं है।", faq: "अक्सर पूछे जाने वाले प्रश्न", faqQuestion: "क्या प्रगति सहेजी जाती है?", faqAnswer: "हाँ, केवल इसी ब्राउज़र में।", quickGuide: "कैसे खेलें", quickGuideCopy: "जोड़े, रन और पंद्रह अंक देते हैं। 121 तक पहले पहुँचने वाला खिलाड़ी जीतता है।", metaDescription: "दो पत्ते क्रिब में भेजें, 31 की ओर पेगिंग करें और इस मालिक-प्रीव्यू क्रिबेज गेम में क्लासिक संयोजनों से अंक पाएँ।" },
    ar: { title: "كريبدج", summary: "أرسل بطاقتين إلى الكريب، والعب من دون تجاوز 31، ثم احسب نقاط اليد باستخدام التركيبات الكلاسيكية.", guideKicker: "دليل ألعاب WeightPlay الأصلية", guideSummary: "أرسل بطاقتين إلى الكريب، والعب من دون تجاوز 31، ثم احسب نقاط اليد باستخدام التركيبات الكلاسيكية.", gameplayLabel: "طريقة اللعب", gameplay: "لعبة بطاقات كلاسيكية للعدّ", genreLabel: "النوع", genre: "بطاقات · عائلية · استراتيجية", difficultyLabel: "الصعوبة", difficulty: "من السهل إلى التحدي", timeLabel: "وقت اللعب المقدر", time: "5–15 دقيقة", skillsLabel: "المهارات المتدرَّبة", skills: "التخطيط · التركيز · التعرّف على الأنماط", howTo: "كيفية اللعب", howToCopy: "تمنح الأزواج والتتابعات و15 نقاطًا. يفوز أول لاعب يصل إلى 121.", preview: "حالة المعاينة", previewCopy: "هذه معاينة المالك غير موجودة في الكتالوج العام الرسمي.", faq: "الأسئلة الشائعة", faqQuestion: "هل يُحفظ التقدم؟", faqAnswer: "نعم، في هذا المتصفح فقط.", quickGuide: "كيفية اللعب", quickGuideCopy: "تمنح الأزواج والتتابعات و15 نقاطًا. يفوز أول لاعب يصل إلى 121.", metaDescription: "أرسل بطاقتين إلى الكريب، والعب نحو 31، واحسب نقاط التركيبات الكلاسيكية في لعبة كريبدج ضمن معاينة المالك." },
  };

  const cribbageShellCopy = () => CRIBBAGE_SHELL_COPY[currentLocale()] || CRIBBAGE_SHELL_COPY.en;
  const CRIBBAGE_PROGRESS_COPY = {
    en: { label: "Race to 121", copy: "First player to reach 121 wins." },
    "zh-Hant": { label: "121 分競賽", copy: "先到 121 分的玩家獲勝。" },
    "zh-Hans": { label: "121 分竞赛", copy: "先到 121 分的玩家获胜。" },
    ja: { label: "121点レース", copy: "先に121点へ到達したプレイヤーが勝ちです。" },
    ko: { label: "121점 레이스", copy: "먼저 121점에 도달한 플레이어가 승리합니다." },
    es: { label: "Carrera a 121", copy: "Gana quien llegue primero a 121." },
    "pt-BR": { label: "Corrida até 121", copy: "Vence quem chegar primeiro a 121." },
    fr: { label: "Course vers 121", copy: "Le premier à atteindre 121 gagne." },
    de: { label: "Rennen bis 121", copy: "Wer zuerst 121 erreicht, gewinnt." },
    it: { label: "Corsa a 121", copy: "Vince chi raggiunge per primo 121." },
    ru: { label: "Гонка до 121", copy: "Побеждает тот, кто первым наберёт 121." },
    hi: { label: "121 तक दौड़", copy: "जो पहले 121 तक पहुँचे, वही जीतता है।" },
    ar: { label: "سباق إلى 121", copy: "يفوز أول لاعب يصل إلى 121." },
  };
  const CRIBBAGE_SELECTION_COPY = {
    en: { status: "Select cards: {count}/2 to the crib.", quickGuide: "How to play", quickGuideCopy: "Pairs, runs, and fifteens score points. The first player to reach 121 wins." },
    "zh-Hant": { status: "選擇牌：{count}/2 張送入 crib。", quickGuide: "玩法說明", quickGuideCopy: "對子、順子和十五都能得分；先到 121 分的玩家獲勝。" },
    "zh-Hans": { status: "选择牌：{count}/2 张送入 crib。", quickGuide: "玩法说明", quickGuideCopy: "对子、顺子和十五都能得分；先到 121 分的玩家获胜。" },
    ja: { status: "カードを選択：クリブへ {count}/2 枚。", quickGuide: "遊び方", quickGuideCopy: "ペア、ラン、15で得点します。最初に121点へ到達したプレイヤーが勝ちです。" },
    ko: { status: "카드 선택: 크립에 {count}/2장.", quickGuide: "플레이 방법", quickGuideCopy: "페어, 런, 15로 점수를 얻습니다. 먼저 121점에 도달한 플레이어가 승리합니다." },
    es: { status: "Elige cartas: {count}/2 para la cuna.", quickGuide: "Cómo jugar", quickGuideCopy: "Las parejas, las escaleras y los quince dan puntos. Gana quien llegue primero a 121." },
    "pt-BR": { status: "Escolha cartas: {count}/2 para o crib.", quickGuide: "Como jogar", quickGuideCopy: "Pares, sequências e quinze valem pontos. Vence quem chegar primeiro a 121." },
    fr: { status: "Choisissez des cartes : {count}/2 pour le crib.", quickGuide: "Comment jouer", quickGuideCopy: "Les paires, suites et quinze rapportent des points. Le premier à atteindre 121 gagne." },
    de: { status: "Karten wählen: {count}/2 für den Crib.", quickGuide: "So wird gespielt", quickGuideCopy: "Paare, Folgen und Fünfzehner bringen Punkte. Wer zuerst 121 erreicht, gewinnt." },
    it: { status: "Scegli le carte: {count}/2 nel crib.", quickGuide: "Come si gioca", quickGuideCopy: "Coppie, sequenze e quindici fanno punti. Vince chi raggiunge per primo 121." },
    ru: { status: "Выберите карты: {count}/2 в криб.", quickGuide: "Как играть", quickGuideCopy: "Пары, последовательности и пятнадцать приносят очки. Побеждает первый игрок, набравший 121." },
    hi: { status: "पत्ते चुनें: क्रिब में {count}/2.", quickGuide: "कैसे खेलें", quickGuideCopy: "जोड़े, रन और पंद्रह अंक देते हैं। 121 तक पहले पहुँचने वाला खिलाड़ी जीतता है।" },
    ar: { status: "اختر البطاقات: {count}/2 إلى الكريب.", quickGuide: "طريقة اللعب", quickGuideCopy: "تمنح الأزواج والتتابعات و15 نقاطًا. يفوز أول لاعب يصل إلى 121." },
  };
  const cribbageSelectionText = (count) => {
    const copy = CRIBBAGE_SELECTION_COPY[currentLocale()] || CRIBBAGE_SELECTION_COPY.en;
    return copy.status.replace("{count}", String(count));
  };

  let cribbageShellSyncing = false;
  const syncCribbageShell = () => {
    if (cribbageShellSyncing) return;
    cribbageShellSyncing = true;
    try {
      const copy = cribbageShellCopy();
      const labels = TEXT[currentLocale()] || TEXT.en;
      const guideRoot = document.querySelector(".game-page-info");
      if (guideRoot) guideRoot.setAttribute("data-runtime-localize", "off");
      const pageTitle = `${copy.title} | WeightPlay`;
      if (document.title !== pageTitle) document.title = pageTitle;
      const summary = document.querySelector('meta[name="description"]');
      if (summary && summary.content !== copy.metaDescription) summary.content = copy.metaDescription;
      document.querySelectorAll('meta[property="og:title"], meta[name="twitter:title"]').forEach((node) => { if (node.content !== pageTitle) node.content = pageTitle; });
      document.querySelectorAll('meta[property="og:description"], meta[name="twitter:description"]').forEach((node) => { if (node.content !== copy.metaDescription) node.content = copy.metaDescription; });
      const jsonLd = document.querySelector('script[type="application/ld+json"]');
      if (jsonLd) { try { const data = JSON.parse(jsonLd.textContent); data.name = copy.title; data.description = copy.metaDescription; data.inLanguage = currentLocale(); jsonLd.textContent = JSON.stringify(data); } catch (_error) {} }
      document.querySelectorAll("[data-card-title]").forEach((node) => ownLocalizedText(node, copy.title));
      document.querySelectorAll("[data-card-summary]").forEach((node) => ownLocalizedText(node, copy.summary));
      ownLocalizedText(document.querySelector(".main-copy .eyebrow"), copy.guideKicker);
      ownLocalizedText(document.querySelector(".game-info-kicker"), copy.guideKicker);
      ownLocalizedText(document.querySelector(".game-info-title h2"), copy.title);
      ownLocalizedText(document.querySelector(".game-info-title p"), copy.guideSummary);
      const facts = [...document.querySelectorAll(".game-info-fact")];
      [[copy.gameplayLabel, copy.gameplay], [copy.genreLabel, copy.genre], [copy.difficultyLabel, copy.difficulty], [copy.timeLabel, copy.time], [copy.skillsLabel, copy.skills]].forEach(([label, value], index) => {
        const fact = facts[index];
        if (!fact) return;
        ownLocalizedText(fact.querySelector("span"), label);
        ownLocalizedText(fact.querySelector("strong"), value);
      });
      const sections = [...document.querySelectorAll(".game-info-section")];
      const guide = sections.find((section) => section.querySelector("ol"));
      ownLocalizedText(guide?.querySelector("h3"), copy.howTo);
      ownLocalizedText(guide?.querySelector("li"), copy.howToCopy);
      const preview = sections.find((section) => section.classList.contains("game-info-parent"));
      ownLocalizedText(preview?.querySelector("h3"), copy.preview);
      ownLocalizedText(preview?.querySelector("p"), copy.previewCopy);
      const faq = sections.find((section) => section.querySelector("dl"));
      ownLocalizedText(faq?.querySelector("h3"), copy.faq);
      ownLocalizedText(faq?.querySelector("dt"), copy.faqQuestion);
      ownLocalizedText(faq?.querySelector("dd"), copy.faqAnswer);
      ownLocalizedText(document.querySelector("#startBtn"), labels.start);
      ownLocalizedText(document.querySelector("#restartBtn"), labels.restart);
      ownLocalizedText(document.querySelector("#newGameBtn"), labels.newGame);
      const progressCopy = CRIBBAGE_PROGRESS_COPY[currentLocale()] || CRIBBAGE_PROGRESS_COPY.en;
      ownLocalizedText(document.querySelector("[data-wp-main-progress] strong"), progressCopy.label);
      ownLocalizedText(document.querySelector("[data-wp-main-progress] span"), progressCopy.copy);
      ownLocalizedText(document.querySelector(".settings-title"), labels.settings);
      ownLocalizedText(document.querySelector("#soundBtn"), `${labels.sound}: On`);
      const settings = document.querySelector("#audioMenuBtn");
      if (settings) settings.setAttribute("aria-label", labels.settings);
      const battleUtility = document.querySelector("[data-wp-battle-utility]");
      if (battleUtility) {
        battleUtility.setAttribute("aria-label", labels.settings);
        battleUtility.title = labels.settings;
      }
      const language = document.querySelector("#localeSelect");
      if (language) language.setAttribute("aria-label", labels.language);
      const battleBack = document.querySelector("#battleBackBtn");
      if (battleBack) {
        battleBack.setAttribute("aria-label", labels.back);
        battleBack.setAttribute("data-runtime-localize", "off");
      }
      const mainReturn = document.querySelector(".main-return");
      if (mainReturn) mainReturn.setAttribute("aria-label", labels.back === "Back" ? "Back to WeightPlay" : labels.back);
      ownLocalizedText(document.querySelector(".card-game-player-header strong"), labels.hand);
      ownLocalizedText(document.querySelector("#resultTitle"), labels.roundOver);
      ownLocalizedText(document.querySelector("#resultNewGame"), labels.newGame);
      ownLocalizedText(document.querySelector("#resultRestart"), labels.restart);
      ownLocalizedText(document.querySelector("#resultClose"), labels.close);
    } finally {
      cribbageShellSyncing = false;
    }
  };

  const GIN_BATTLE_COPY = {
    en: { yourHand: "Your hand", meldCards: "Meld cards", deadwood: "Deadwood", draw: "Draw", stock: "Stock", discard: "Discard", discardAction: "Discard", knock: "Knock", gin: "Gin", emptyDiscard: "No discard card" },
    "zh-Hant": { yourHand: "你的手牌", meldCards: "組牌張數", deadwood: "死牌", draw: "抽牌", stock: "牌庫", discard: "棄牌", discardAction: "棄牌", knock: "敲牌", gin: "金牌", emptyDiscard: "目前沒有棄牌" },
    "zh-Hans": { yourHand: "你的手牌", meldCards: "组牌张数", deadwood: "死牌", draw: "抽牌", stock: "牌库", discard: "弃牌", discardAction: "弃牌", knock: "敲牌", gin: "金牌", emptyDiscard: "目前没有弃牌" },
    ja: { yourHand: "あなたの手札", meldCards: "メルドの枚数", deadwood: "デッドウッド", draw: "引く", stock: "山札", discard: "捨て札", discardAction: "捨てる", knock: "ノック", gin: "ジン", emptyDiscard: "捨て札はありません" },
    ko: { yourHand: "내 손패", meldCards: "멜드 카드", deadwood: "데드우드", draw: "뽑기", stock: "덱", discard: "버림", discardAction: "버리기", knock: "노크", gin: "진", emptyDiscard: "버린 카드가 없습니다" },
    es: { yourHand: "Tu mano", meldCards: "Cartas en combinaciones", deadwood: "Madera muerta", draw: "Robar", stock: "Mazo", discard: "Descarte", discardAction: "Descartar", knock: "Golpear", gin: "Gin", emptyDiscard: "No hay carta de descarte" },
    "pt-BR": { yourHand: "Sua mão", meldCards: "Cartas em combinações", deadwood: "Madeira morta", draw: "Comprar", stock: "Monte", discard: "Descarte", discardAction: "Descartar", knock: "Bater", gin: "Gin", emptyDiscard: "Não há carta no descarte" },
    fr: { yourHand: "Votre main", meldCards: "Cartes en combinaisons", deadwood: "Bois mort", draw: "Piocher", stock: "Pioche", discard: "Défausse", discardAction: "Défausser", knock: "Frapper", gin: "Gin", emptyDiscard: "Aucune carte défaussée" },
    de: { yourHand: "Deine Hand", meldCards: "Meldkarten", deadwood: "Totholz", draw: "Ziehen", stock: "Stapel", discard: "Ablage", discardAction: "Abwerfen", knock: "Klopfen", gin: "Gin", emptyDiscard: "Keine Ablagekarte" },
    it: { yourHand: "La tua mano", meldCards: "Carte in combinazioni", deadwood: "Carte morte", draw: "Pesca", stock: "Mazzo", discard: "Scarti", discardAction: "Scarta", knock: "Battere", gin: "Gin", emptyDiscard: "Nessuna carta negli scarti" },
    ru: { yourHand: "Ваша рука", meldCards: "Карт в комбинациях", deadwood: "Дедвуд", draw: "Взять", stock: "Колода", discard: "Сброс", discardAction: "Сбросить", knock: "Стучать", gin: "Джин", emptyDiscard: "В сбросе нет карты" },
    hi: { yourHand: "आपके पत्ते", meldCards: "मेल्ड कार्ड", deadwood: "डेडवुड", draw: "पत्ता लें", stock: "गड्डी", discard: "फेंके पत्ते", discardAction: "पत्ता छोड़ें", knock: "नॉक", gin: "जिन", emptyDiscard: "फेंका हुआ पत्ता नहीं है" },
    ar: { yourHand: "يدك", meldCards: "بطاقات المجموعات", deadwood: "الخشب الميت", draw: "اسحب", stock: "الرزمة", discard: "الرمي", discardAction: "ارمِ", knock: "الطرق", gin: "جين", emptyDiscard: "لا توجد بطاقة مرمية" },
  };

  const ginBattleText = (key, values = {}) => {
    const dictionary = GIN_BATTLE_COPY[currentLocale()] || GIN_BATTLE_COPY.en;
    let value = dictionary[key] || GIN_BATTLE_COPY.en[key] || key;
    Object.entries(values).forEach(([name, replacement]) => { value = value.replaceAll(`{${name}}`, String(replacement)); });
    return value;
  };

  const GIN_PLAN_COPY = {
    en: { set: "Plan: protect a same-rank pair while trimming unrelated deadwood.", run: "Plan: protect a suited sequence while trimming unrelated deadwood.", both: "Plan: protect a pair or suited sequence while trimming unrelated deadwood.", trim: "Plan: lower deadwood while looking for a set or suited sequence.", ready: "Plan: Knock is ready; protect your strongest meld shape when discarding.", gin: "Plan: Gin is ready; keep your complete meld shape when discarding." },
    "zh-Hant": { set: "規劃：保留同點數對子，同時減少無關死牌。", run: "規劃：保留同花色順子，同時減少無關死牌。", both: "規劃：保留對子或同花色順子，同時減少無關死牌。", trim: "規劃：降低死牌，並尋找可組成刻子或順子的方向。", ready: "規劃：敲牌已就緒；棄牌時保留最強的組牌形狀。", gin: "規劃：金牌已就緒；棄牌時維持完整組牌。" },
    "zh-Hans": { set: "规划：保留同点数对子，同时减少无关死牌。", run: "规划：保留同花色顺子，同时减少无关死牌。", both: "规划：保留对子或同花色顺子，同时减少无关死牌。", trim: "规划：降低死牌，并寻找可组成刻子或顺子的方向。", ready: "规划：敲牌已就绪；弃牌时保留最强的组合形状。", gin: "规划：金牌已就绪；弃牌时维持完整组合。" },
    ja: { set: "方針：同じランクのペアを守り、関係ないデッドウッドを減らします。", run: "方針：同じスートの連続を守り、関係ないデッドウッドを減らします。", both: "方針：ペアか同じスートの連続を守り、関係ないデッドウッドを減らします。", trim: "方針：デッドウッドを減らし、セットか同じスートの連続を目指します。", ready: "方針：ノック可能。捨て札では最も強いメルドの形を守りましょう。", gin: "方針：ジン可能。捨て札では完成したメルドを保ちましょう。" },
    ko: { set: "계획: 같은 숫자 한 쌍을 지키면서 관계없는 데드우드를 줄이세요.", run: "계획: 같은 무늬 연속을 지키면서 관계없는 데드우드를 줄이세요.", both: "계획: 한 쌍이나 같은 무늬 연속을 지키면서 데드우드를 줄이세요.", trim: "계획: 데드우드를 줄이며 세트나 같은 무늬 연속을 찾으세요.", ready: "계획: 노크 가능. 버릴 때 가장 강한 멜드 형태를 지키세요.", gin: "계획: 진 가능. 버릴 때 완성된 멜드를 지키세요." },
    es: { set: "Plan: protege una pareja del mismo rango y reduce la madera muerta que sobra.", run: "Plan: protege una secuencia del mismo palo y reduce la madera muerta que sobra.", both: "Plan: protege una pareja o secuencia del mismo palo mientras reduces la madera muerta.", trim: "Plan: reduce la madera muerta mientras buscas un trío o una secuencia del mismo palo.", ready: "Plan: puedes golpear; al descartar, protege tu mejor combinación.", gin: "Plan: Gin listo; al descartar, conserva tus combinaciones completas." },
    "pt-BR": { set: "Plano: proteja um par do mesmo valor e reduza a madeira morta restante.", run: "Plano: proteja uma sequência do mesmo naipe e reduza a madeira morta restante.", both: "Plano: proteja um par ou uma sequência do mesmo naipe enquanto reduz a madeira morta.", trim: "Plano: reduza a madeira morta enquanto busca uma trinca ou sequência.", ready: "Plano: pode bater; ao descartar, preserve sua melhor combinação.", gin: "Plano: Gin disponível; ao descartar, mantenha sua combinação completa." },
    fr: { set: "Plan : protégez une paire de même valeur et réduisez le bois mort inutile.", run: "Plan : protégez une suite de même couleur et réduisez le bois mort inutile.", both: "Plan : protégez une paire ou une suite de même couleur en réduisant le bois mort.", trim: "Plan : réduisez le bois mort en cherchant un brelan ou une suite.", ready: "Plan : frappe possible ; gardez votre meilleure combinaison en défaussant.", gin: "Plan : Gin possible ; gardez votre combinaison complète en défaussant." },
    de: { set: "Plan: Schütze ein gleichrangiges Paar und senke unnötiges Totholz.", run: "Plan: Schütze eine gleichfarbige Folge und senke unnötiges Totholz.", both: "Plan: Schütze ein Paar oder eine gleichfarbige Folge und senke Totholz.", trim: "Plan: Senke Totholz und suche eine Gruppe oder gleichfarbige Folge.", ready: "Plan: Klopfen möglich; bewahre beim Abwerfen deine stärkste Meldung.", gin: "Plan: Gin möglich; bewahre beim Abwerfen deine vollständigen Meldungen." },
    it: { set: "Piano: proteggi una coppia dello stesso valore e riduci le carte morte inutili.", run: "Piano: proteggi una sequenza dello stesso seme e riduci le carte morte inutili.", both: "Piano: proteggi una coppia o una sequenza dello stesso seme riducendo le carte morte.", trim: "Piano: riduci le carte morte cercando un tris o una sequenza.", ready: "Piano: puoi battere; nello scarto proteggi la combinazione migliore.", gin: "Piano: Gin possibile; nello scarto mantieni le combinazioni complete." },
    ru: { set: "План: берегите пару одного достоинства и сокращайте лишний дедвуд.", run: "План: берегите последовательность одной масти и сокращайте лишний дедвуд.", both: "План: берегите пару или последовательность одной масти, сокращая дедвуд.", trim: "План: сокращайте дедвуд и ищите группу или последовательность одной масти.", ready: "План: можно стучать; при сбросе сохраняйте лучшую комбинацию.", gin: "План: Джин готов; при сбросе сохраняйте полные комбинации." },
    hi: { set: "योजना: एक ही रैंक की जोड़ी बचाएँ और अनावश्यक डेडवुड घटाएँ।", run: "योजना: एक ही सूट का क्रम बचाएँ और अनावश्यक डेडवुड घटाएँ।", both: "योजना: जोड़ी या एक ही सूट का क्रम बचाते हुए डेडवुड घटाएँ।", trim: "योजना: डेडवुड घटाएँ और सेट या एक ही सूट का क्रम खोजें।", ready: "योजना: नॉक तैयार है; पत्ता छोड़ते समय अपनी मजबूत मेल्ड बचाएँ।", gin: "योजना: जिन तैयार है; पत्ता छोड़ते समय पूरी मेल्ड बनाए रखें।" },
    ar: { set: "الخطة: حافظ على زوج من الرتبة نفسها وخفّض الخشب الميت الزائد.", run: "الخطة: حافظ على تسلسل من النوع نفسه وخفّض الخشب الميت الزائد.", both: "الخطة: حافظ على زوج أو تسلسل من النوع نفسه مع خفض الخشب الميت.", trim: "الخطة: خفّض الخشب الميت وابحث عن مجموعة أو تسلسل من النوع نفسه.", ready: "الخطة: الطرق جاهز؛ حافظ على أقوى مجموعة عند الرمي.", gin: "الخطة: جين جاهز؛ حافظ على مجموعاتك المكتملة عند الرمي." },
  };

  const ginPlanText = (hand, deadwood) => {
    const dictionary = GIN_PLAN_COPY[currentLocale()] || GIN_PLAN_COPY.en;
    const rankCounts = new Map();
    hand.forEach((item) => rankCounts.set(item.rank, (rankCounts.get(item.rank) || 0) + 1));
    const hasPair = [...rankCounts.values()].some((count) => count === 2);
    const hasRun = SUITS.some((suit) => {
      const ranks = [...new Set(hand.filter((item) => item.suit === suit).map((item) => item.rank))].sort((a, b) => a - b);
      let length = 1;
      for (let index = 1; index <= ranks.length; index += 1) {
        if (index < ranks.length && ranks[index] === ranks[index - 1] + 1) length += 1;
        else { if (length === 2) return true; length = 1; }
      }
      return false;
    });
    const key = deadwood === 0 ? "gin" : deadwood <= 10 ? "ready" : hasPair && hasRun ? "both" : hasPair ? "set" : hasRun ? "run" : "trim";
    return dictionary[key] || GIN_PLAN_COPY.en[key];
  };
  const GIN_RESULT_COPY = {
    en: { breakdown: "{reason} · Meld cards {meldCards} · Your deadwood {deadwood} · AI deadwood {aiDeadwood} · Score {playerScore} / {aiScore}", gin: "Gin", knock: "Knock at {deadwood}", stock: "Stock settled" },
    "zh-Hant": { breakdown: "{reason} · 組牌 {meldCards} 張 · 你的死牌 {deadwood} 點 · AI 死牌 {aiDeadwood} 點 · 分數 {playerScore} / {aiScore}", gin: "金牌", knock: "敲牌：{deadwood} 點死牌", stock: "牌庫結算" },
    "zh-Hans": { breakdown: "{reason} · 组牌 {meldCards} 张 · 你的死牌 {deadwood} 点 · AI 死牌 {aiDeadwood} 点 · 分数 {playerScore} / {aiScore}", gin: "金牌", knock: "敲牌：{deadwood} 点死牌", stock: "牌库结算" },
    ja: { breakdown: "{reason} · メルド {meldCards}枚 · あなたのデッドウッド {deadwood} · AIのデッドウッド {aiDeadwood} · スコア {playerScore} / {aiScore}", gin: "ジン", knock: "ノック可能（デッドウッド {deadwood}）", stock: "山札切れで精算" },
    ko: { breakdown: "{reason} · 멜드 카드 {meldCards}장 · 내 데드우드 {deadwood} · AI 데드우드 {aiDeadwood} · 점수 {playerScore} / {aiScore}", gin: "진", knock: "노크 ({deadwood} 데드우드)", stock: "덱 소진 정산" },
    es: { breakdown: "{reason} · Cartas en combinaciones {meldCards} · Tu madera muerta {deadwood} · Madera muerta de la IA {aiDeadwood} · Puntuación {playerScore} / {aiScore}", gin: "Gin", knock: "Golpe con {deadwood} de madera muerta", stock: "Reparto resuelto por mazo agotado" },
    "pt-BR": { breakdown: "{reason} · Cartas em combinações {meldCards} · Sua madeira morta {deadwood} · Madeira morta da IA {aiDeadwood} · Pontuação {playerScore} / {aiScore}", gin: "Gin", knock: "Batida com {deadwood} de madeira morta", stock: "Mão resolvida com o monte vazio" },
    fr: { breakdown: "{reason} · Cartes en combinaisons {meldCards} · Votre bois mort {deadwood} · Bois mort de l’IA {aiDeadwood} · Score {playerScore} / {aiScore}", gin: "Gin", knock: "Frappe à {deadwood} de bois mort", stock: "Pioche épuisée : main réglée" },
    de: { breakdown: "{reason} · Meldkarten {meldCards} · Dein Totholz {deadwood} · KI-Totholz {aiDeadwood} · Punkte {playerScore} / {aiScore}", gin: "Gin", knock: "Klopfen bei {deadwood} Totholz", stock: "Stapel leer: Hand abgerechnet" },
    it: { breakdown: "{reason} · Carte in combinazioni {meldCards} · Le tue carte morte {deadwood} · Carte morte dell’IA {aiDeadwood} · Punteggio {playerScore} / {aiScore}", gin: "Gin", knock: "Battuta con {deadwood} carte morte", stock: "Tallone esaurito: mano conclusa" },
    ru: { breakdown: "{reason} · Карт в комбинациях: {meldCards} · Ваш дедвуд: {deadwood} · Дедвуд ИИ: {aiDeadwood} · Счёт: {playerScore} / {aiScore}", gin: "Джин", knock: "Стучок при дедвуде {deadwood}", stock: "Колода закончилась: рука завершена" },
    hi: { breakdown: "{reason} · मेल्ड कार्ड {meldCards} · आपका डेडवुड {deadwood} · AI डेडवुड {aiDeadwood} · स्कोर {playerScore} / {aiScore}", gin: "जिन", knock: "{deadwood} डेडवुड पर नॉक", stock: "डेक खत्म: हाथ का हिसाब पूरा" },
    ar: { breakdown: "{reason} · بطاقات في مجموعات {meldCards} · خشبك الميت {deadwood} · خشب الذكاء الاصطناعي الميت {aiDeadwood} · النتيجة {playerScore} / {aiScore}", gin: "جين", knock: "طرق عند {deadwood} من الخشب الميت", stock: "انتهت الرزمة: حُسمت اليد" },
  };

  const ginResultText = (key, values = {}) => {
    const dictionary = GIN_RESULT_COPY[currentLocale()] || GIN_RESULT_COPY.en;
    const apply = (template) => template.replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? ""));
    return apply(dictionary.breakdown.replace("{reason}", apply(dictionary[key] || dictionary.stock)));
  };

  const CRIB_TRANSITION = {
    en: { player: "Your crib holds the 4 contributed cards", ai: "AI's crib holds the 4 contributed cards", next: "Starter {starter} · Peg toward 31" },
    "zh-Hant": { player: "本輪 4 張貢獻牌屬於你的 crib", ai: "本輪 4 張貢獻牌屬於 AI 的 crib", next: "starter {starter} · 出牌朝 31 點前進" },
    "zh-Hans": { player: "本轮 4 张贡献牌属于你的 crib", ai: "本轮 4 张贡献牌属于 AI 的 crib", next: "starter {starter} · 出牌朝 31 点前进" },
    ja: { player: "4枚のクリブはあなたのもの", ai: "4枚のクリブはAIのもの", next: "スターター {starter} · 31を目指してプレイ" },
    ko: { player: "기여한 4장의 크립은 내 것", ai: "기여한 4장의 크립은 AI 것", next: "스타터 {starter} · 합계 31을 향해 내세요" },
    es: { player: "Las 4 cartas aportadas forman tu cuna", ai: "Las 4 cartas aportadas forman la cuna de la IA", next: "Inicial {starter} · Juega hacia 31" },
    "pt-BR": { player: "As 4 cartas contribuídas formam seu crib", ai: "As 4 cartas contribuídas formam o crib da IA", next: "Inicial {starter} · Jogue até 31" },
    fr: { player: "Les 4 cartes données forment votre crib", ai: "Les 4 cartes données forment le crib de l'IA", next: "Carte de départ {starter} · Visez 31" },
    de: { player: "Die 4 beigesteuerten Karten bilden deinen Crib", ai: "Die 4 beigesteuerten Karten bilden den KI-Crib", next: "Starter {starter} · Spiele Richtung 31" },
    it: { player: "Le 4 carte contribuite formano il tuo crib", ai: "Le 4 carte contribuite formano il crib dell'IA", next: "Starter {starter} · Gioca verso 31" },
    ru: { player: "4 отданные карты образуют ваш криб", ai: "4 отданные карты образуют криб ИИ", next: "Стартовая {starter} · Играйте к 31" },
    hi: { player: "दिए गए 4 पत्ते आपका क्रिब बनाते हैं", ai: "दिए गए 4 पत्ते AI का क्रिब बनाते हैं", next: "स्टार्टर {starter} · 31 की ओर पत्ता चलें" },
    ar: { player: "البطاقات الأربع المقدمة تكوّن الكريب الخاص بك", ai: "البطاقات الأربع المقدمة تكوّن كريب الذكاء الاصطناعي", next: "بطاقة البداية {starter} · العب نحو 31" },
  };

  const cribTransitionText = (starter, dealer) => {
    const copy = CRIB_TRANSITION[currentLocale()] || CRIB_TRANSITION.en;
    return `${dealer === 0 ? copy.player : copy.ai} · ${copy.next.replaceAll("{starter}", cardText(starter))}`;
  };

  const CRIB_CHOICE_PAYOFF = {
    en: "Tradeoff: {cards} feed {owner} crib; your 4-card hand stays for pegging. Starter {starter} is revealed — plan toward 31.",
    "zh-Hant": "取捨：{cards} 送入{owner} crib；你留下 4 張手牌出牌。starter {starter} 已翻開，朝 31 點規劃。",
    "zh-Hans": "取舍：{cards} 送入{owner} crib；你留下 4 张手牌出牌。starter {starter} 已翻开，朝 31 点规划。",
    ja: "選択の結果：{cards} は{owner}のクリブへ。残り4枚でペギングします。スターター {starter} 公開、31を目指そう。",
    ko: "선택 결과: {cards}는 {owner} 크립으로 갑니다. 남은 4장으로 페깅합니다. 스타터 {starter} 공개 — 31을 노리세요.",
    es: "Consecuencia: {cards} van a la cuna {owner}; conservas 4 cartas para el pegging. Sale el inicial {starter}: planifica hacia 31.",
    "pt-BR": "Consequência: {cards} vão para o crib {owner}; você fica com 4 cartas para o pegging. O inicial {starter} foi revelado — mire rumo a 31.",
    fr: "Conséquence : {cards} vont dans le crib {owner} ; gardez 4 cartes pour le pegging. La carte {starter} est révélée : visez 31.",
    de: "Folge: {cards} gehen in den Crib {owner}; deine 4 Karten bleiben fürs Pegging. Starter {starter} ist aufgedeckt — spiele Richtung 31.",
    it: "Conseguenza: {cards} vanno nel crib {owner}; tieni 4 carte per il pegging. Lo starter {starter} è scoperto: punta a 31.",
    ru: "Последствие: {cards} отправлены в криб {owner}; 4 карты остаются для пеггинга. Открыта стартовая {starter} — стремитесь к 31.",
    hi: "नतीजा: {cards} {owner} क्रिब में गए; पेगिंग के लिए 4 पत्ते बचे। स्टार्टर {starter} खुला है—31 की ओर योजना बनाएँ।",
    ar: "النتيجة: ذهبت {cards} إلى كريب {owner}؛ تبقى لك 4 بطاقات للعدّ. ظهرت بطاقة البداية {starter} — خطط نحو 31.",
  };

  const CRIB_OWNER_COPY = {
    en: { your: "your", ai: "the AI" },
    "zh-Hant": { your: "你的", ai: "AI 的" },
    "zh-Hans": { your: "你的", ai: "AI 的" },
    ja: { your: "あなた", ai: "AI" },
    ko: { your: "내", ai: "AI" },
    es: { your: "tu", ai: "de la IA" },
    "pt-BR": { your: "seu", ai: "da IA" },
    fr: { your: "votre", ai: "de l’IA" },
    de: { your: "deinen", ai: "der KI" },
    it: { your: "tuo", ai: "dell’IA" },
    ru: { your: "ваш", ai: "ИИ" },
    hi: { your: "आपके", ai: "AI के" },
    ar: { your: "الخاص بك", ai: "الذكاء الاصطناعي" },
  };

  const cribChoicePayoffText = (cards, starter, dealer) => {
    const copy = CRIB_CHOICE_PAYOFF[currentLocale()] || CRIB_CHOICE_PAYOFF.en;
    const ownerCopy = CRIB_OWNER_COPY[currentLocale()] || CRIB_OWNER_COPY.en;
    return copy.replaceAll("{cards}", cards.map(cardText).join(" + ")).replaceAll("{starter}", cardText(starter)).replaceAll("{owner}", ownerCopy[dealer === 0 ? "your" : "ai"] || ownerCopy.ai);
  };

  const CRIBBAGE_RESULT_MASTERY_COPY = {
    en: { round: "Pegging this deal: {score} points.", target: "Next-deal target: reach {target} pegging points." },
    "zh-Hant": { round: "本局出牌得分：{score} 分。", target: "下一局目標：出牌得分達到 {target} 分。" },
    "zh-Hans": { round: "本局出牌得分：{score} 分。", target: "下一局目标：出牌得分达到 {target} 分。" },
    ja: { round: "このディールのペギング得点：{score}点。", target: "次のディールの目標：ペギングで{target}点に到達。" },
    ko: { round: "이번 딜 페깅 점수: {score}점.", target: "다음 딜 목표: 페깅 {target}점에 도달하세요." },
    es: { round: "Puntos de pegging en esta mano: {score}.", target: "Objetivo de la próxima mano: alcanza {target} puntos de pegging." },
    "pt-BR": { round: "Pontos de pegging nesta mão: {score}.", target: "Meta da próxima mão: alcance {target} pontos de pegging." },
    fr: { round: "Points de pegging pour cette donne : {score}.", target: "Objectif de la prochaine donne : atteindre {target} points de pegging." },
    de: { round: "Pegging-Punkte in dieser Runde: {score}.", target: "Ziel der nächsten Runde: {target} Pegging-Punkte erreichen." },
    it: { round: "Punti di pegging in questa mano: {score}.", target: "Obiettivo della prossima mano: raggiungi {target} punti di pegging." },
    ru: { round: "Очки пеггинга в этой раздаче: {score}.", target: "Цель следующей раздачи: набрать {target} очков пеггинга." },
    hi: { round: "इस डील में पेगिंग अंक: {score}।", target: "अगले डील का लक्ष्य: पेगिंग में {target} अंक पाएँ।" },
    ar: { round: "نقاط العدّ في هذه الجولة: {score}.", target: "هدف الجولة التالية: حقّق {target} نقطة في العدّ." },
  };

  const cribbageResultMasteryText = (score) => {
    const copy = CRIBBAGE_RESULT_MASTERY_COPY[currentLocale()] || CRIBBAGE_RESULT_MASTERY_COPY.en;
    const target = Math.max(1, Number(score) + 1);
    return `${copy.round.replace("{score}", String(score))} · ${copy.target.replace("{target}", String(target))}`;
  };

  const CRIB_PEGGING_RESET_COPY = {
    en: { go: "Go ends this count — reset to 0. Watch for a pair, run, 15, or 31 in the next sequence.", thirtyOne: "31 ends this count — reset to 0. Watch for a pair, run, 15, or another 31." },
    "zh-Hant": { go: "Go 結束這次計數，重設為 0。下一段留意對子、順子、15 或 31。", thirtyOne: "31 結束這次計數，重設為 0。下一段留意對子、順子、15 或下一個 31。" },
    "zh-Hans": { go: "Go 结束这次计数，重设为 0。下一段留意对子、顺子、15 或 31。", thirtyOne: "31 结束这次计数，重设为 0。下一段留意对子、顺子、15 或下一个 31。" },
    ja: { go: "Goでこのカウントは終了し、0に戻ります。次の並びでペア、ラン、15、31を狙おう。", thirtyOne: "31でこのカウントは終了し、0に戻ります。次の並びでペア、ラン、15、次の31を狙おう。" },
    ko: { go: "Go로 이 카운트가 끝나 0으로 돌아갑니다. 다음 순서에서 페어·런·15·31을 노리세요.", thirtyOne: "31로 이 카운트가 끝나 0으로 돌아갑니다. 다음 순서에서 페어·런·15·다음 31을 노리세요." },
    es: { go: "Go termina este conteo y vuelve a 0. Busca pareja, escalera, 15 o 31 en la siguiente secuencia.", thirtyOne: "31 termina este conteo y vuelve a 0. Busca pareja, escalera, 15 o otro 31." },
    "pt-BR": { go: "Go encerra esta contagem e ela volta a 0. Busque par, sequência, 15 ou 31 na próxima sequência.", thirtyOne: "31 encerra esta contagem e ela volta a 0. Busque par, sequência, 15 ou outro 31." },
    fr: { go: "Go termine ce compte et revient à 0. Cherchez une paire, une suite, 15 ou 31 dans la prochaine séquence.", thirtyOne: "31 termine ce compte et revient à 0. Cherchez une paire, une suite, 15 ou un autre 31." },
    de: { go: "Go beendet diese Zählung und setzt sie auf 0 zurück. Suche in der nächsten Folge nach Paar, Lauf, 15 oder 31.", thirtyOne: "31 beendet diese Zählung und setzt sie auf 0 zurück. Suche in der nächsten Folge nach Paar, Lauf, 15 oder einem weiteren 31." },
    it: { go: "Go chiude questo conteggio e si torna a 0. Cerca una coppia, una scala, 15 o 31 nella prossima sequenza.", thirtyOne: "31 chiude questo conteggio e si torna a 0. Cerca una coppia, una scala, 15 o un altro 31." },
    ru: { go: "Go завершает этот счёт, и он сбрасывается на 0. В следующей серии ищите пару, ряд, 15 или 31.", thirtyOne: "31 завершает этот счёт, и он сбрасывается на 0. В следующей серии ищите пару, ряд, 15 или новый 31." },
    hi: { go: "Go से यह गिनती खत्म होकर 0 पर लौटती है। अगली श्रृंखला में जोड़ी, रन, 15 या 31 देखें।", thirtyOne: "31 से यह गिनती खत्म होकर 0 पर लौटती है। अगली श्रृंखला में जोड़ी, रन, 15 या अगला 31 देखें।" },
    ar: { go: "تنهي Go هذا العد ويعود إلى 0. ابحث عن زوج أو تسلسل أو 15 أو 31 في السلسلة التالية.", thirtyOne: "ينهي 31 هذا العد ويعود إلى 0. ابحث عن زوج أو تسلسل أو 15 أو 31 آخر في السلسلة التالية." },
  };

  const cribPeggingResetText = (reason) => {
    const copy = CRIB_PEGGING_RESET_COPY[currentLocale()] || CRIB_PEGGING_RESET_COPY.en;
    return copy[reason] || copy.go;
  };

  const CRIB_PEGGING_COACH = {
    en: { play: "Play a card. Pairs, runs, 15, and 31 points count during pegging.", go: "Say Go. Pairs, runs, 15, and 31 points count during pegging." },
    "zh-Hant": { play: "出一張牌。出牌計數中，對子、順子、15 和 31 都能得分。", go: "喊 Go。出牌計數中，對子、順子、15 和 31 都能得分。" },
    "zh-Hans": { play: "出一张牌。出牌计数中，对子、顺子、15 和 31 都能得分。", go: "喊 Go。出牌计数中，对子、顺子、15 和 31 都能得分。" },
    ja: { play: "カードを1枚出そう。ペギングではペア、ラン、15、31で得点できます。", go: "Goを宣言しよう。ペギングではペア、ラン、15、31で得点できます。" },
    ko: { play: "카드를 한 장 내세요. 페깅에서는 페어·런·15·31이 점수를 줍니다.", go: "Go를 선언하세요. 페깅에서는 페어·런·15·31이 점수를 줍니다." },
    es: { play: "Juega una carta. Durante el pegging, las parejas, las escaleras, 15 y 31 dan puntos.", go: "Di Go. Durante el pegging, las parejas, las escaleras, 15 y 31 dan puntos." },
    "pt-BR": { play: "Jogue uma carta. No pegging, pares, sequências, 15 e 31 valem pontos.", go: "Diga Go. No pegging, pares, sequências, 15 e 31 valem pontos." },
    fr: { play: "Jouez une carte. Au pegging, les paires, suites, 15 et 31 rapportent des points.", go: "Dites Go. Au pegging, les paires, suites, 15 et 31 rapportent des points." },
    de: { play: "Spiele eine Karte. Beim Pegging bringen Paare, Folgen, 15 und 31 Punkte.", go: "Sage Go. Beim Pegging bringen Paare, Folgen, 15 und 31 Punkte." },
    it: { play: "Gioca una carta. Nel pegging, coppie, scale, 15 e 31 fanno guadagnare punti.", go: "Dichiara Go. Nel pegging, coppie, scale, 15 e 31 fanno guadagnare punti." },
    ru: { play: "Сыграйте карту. В пеггинге пары, серии, 15 и 31 приносят очки.", go: "Скажите Go. В пеггинге пары, серии, 15 и 31 приносят очки." },
    hi: { play: "एक पत्ता खेलें। पेगिंग में जोड़ी, रन, 15 और 31 अंक देते हैं।", go: "गो कहें। पेगिंग में जोड़ी, रन, 15 और 31 अंक देते हैं।" },
    ar: { play: "العب بطاقة. في العدّ، تمنح الأزواج والتتابعات و15 و31 نقاطًا.", go: "قل «جو». في العدّ، تمنح الأزواج والتتابعات و15 و31 نقاطًا." },
  };

  const cribPeggingCoachText = (hasPlayableCard) => {
    const copy = CRIB_PEGGING_COACH[currentLocale()] || CRIB_PEGGING_COACH.en;
    return copy[hasPlayableCard ? "play" : "go"];
  };

  const CRIB_PEGGING_SCORE_COPY = {
    en: { join: " + ", reasons: { fifteen: "15", thirtyOne: "31", pair: "pair", three: "three of a kind", four: "four of a kind", run: "run of {length}" }, earned: "Peg score +{points}: {reasons}. Count {count}/31.", zero: "Peg score +0. Count {count}/31.", go: "Go: +1 point. The count resets to 0." },
    "zh-Hant": { join: "＋", reasons: { fifteen: "15", thirtyOne: "31", pair: "對子", three: "三條", four: "四條", run: "{length} 張順子" }, earned: "出牌得分＋{points}：{reasons}。計數：{count}/31。", zero: "出牌得分＋0。計數：{count}/31。", go: "Go：＋1 分。計數重設為 0。" },
    "zh-Hans": { join: "＋", reasons: { fifteen: "15", thirtyOne: "31", pair: "对子", three: "三条", four: "四条", run: "{length} 张顺子" }, earned: "出牌得分＋{points}：{reasons}。计数：{count}/31。", zero: "出牌得分＋0。计数：{count}/31。", go: "Go：＋1 分。计数重设为 0。" },
    ja: { join: "＋", reasons: { fifteen: "15", thirtyOne: "31", pair: "ペア", three: "スリーカード", four: "フォーカード", run: "{length}枚のラン" }, earned: "ペギング得点＋{points}：{reasons}。カウント {count}/31。", zero: "ペギング得点＋0。カウント {count}/31。", go: "Go：＋1点。カウントは0に戻ります。" },
    ko: { join: " + ", reasons: { fifteen: "15", thirtyOne: "31", pair: "페어", three: "트리플", four: "포카드", run: "{length}장 런" }, earned: "페깅 점수 +{points}: {reasons}. 카운트 {count}/31.", zero: "페깅 점수 +0. 카운트 {count}/31.", go: "Go: +1점. 카운트가 0으로 돌아갑니다." },
    es: { join: " + ", reasons: { fifteen: "15", thirtyOne: "31", pair: "pareja", three: "trío", four: "póquer", run: "escalera de {length}" }, earned: "Puntos de pegging +{points}: {reasons}. Cuenta {count}/31.", zero: "Puntos de pegging +0. Cuenta {count}/31.", go: "Go: +1 punto. La cuenta vuelve a 0." },
    "pt-BR": { join: " + ", reasons: { fifteen: "15", thirtyOne: "31", pair: "par", three: "trinca", four: "quadra", run: "sequência de {length}" }, earned: "Pontos de pegging +{points}: {reasons}. Contagem {count}/31.", zero: "Pontos de pegging +0. Contagem {count}/31.", go: "Go: +1 ponto. A contagem volta a 0." },
    fr: { join: " + ", reasons: { fifteen: "15", thirtyOne: "31", pair: "paire", three: "brelan", four: "carré", run: "suite de {length}" }, earned: "Score de pegging +{points} : {reasons}. Compte {count}/31.", zero: "Score de pegging +0. Compte {count}/31.", go: "Go : +1 point. Le compte revient à 0." },
    de: { join: " + ", reasons: { fifteen: "15", thirtyOne: "31", pair: "Paar", three: "Drilling", four: "Vierling", run: "Folge mit {length}" }, earned: "Pegging-Punkte +{points}: {reasons}. Zählung {count}/31.", zero: "Pegging-Punkte +0. Zählung {count}/31.", go: "Go: +1 Punkt. Die Zählung wird auf 0 gesetzt." },
    it: { join: " + ", reasons: { fifteen: "15", thirtyOne: "31", pair: "coppia", three: "tris", four: "poker", run: "scala di {length}" }, earned: "Punti di pegging +{points}: {reasons}. Conteggio {count}/31.", zero: "Punti di pegging +0. Conteggio {count}/31.", go: "Go: +1 punto. Il conteggio torna a 0." },
    ru: { join: " + ", reasons: { fifteen: "15", thirtyOne: "31", pair: "пара", three: "тройка", four: "каре", run: "ряд из {length}" }, earned: "Очки пеггинга +{points}: {reasons}. Счёт {count}/31.", zero: "Очки пеггинга +0. Счёт {count}/31.", go: "Go: +1 очко. Счёт сбрасывается до 0." },
    hi: { join: " + ", reasons: { fifteen: "15", thirtyOne: "31", pair: "जोड़ी", three: "तीन एक जैसे", four: "चार एक जैसे", run: "{length} पत्तों की रन" }, earned: "पेगिंग अंक +{points}: {reasons}। गिनती {count}/31।", zero: "पेगिंग अंक +0। गिनती {count}/31।", go: "Go: +1 अंक। गिनती 0 पर लौटती है।" },
    ar: { join: " + ", reasons: { fifteen: "15", thirtyOne: "31", pair: "زوج", three: "ثلاثية", four: "رباعية", run: "تسلسل من {length}" }, earned: "نقاط العدّ +{points}: {reasons}. العدّ {count}/31.", zero: "نقاط العدّ +0. العدّ {count}/31.", go: "Go: +1 نقطة. يعود العدّ إلى 0." },
  };

  const cribPeggingScoreText = (points, reasons, count) => {
    const copy = CRIB_PEGGING_SCORE_COPY[currentLocale()] || CRIB_PEGGING_SCORE_COPY.en;
    const labels = reasons.map((reason) => {
      const template = copy.reasons[reason.key] || CRIB_PEGGING_SCORE_COPY.en.reasons[reason.key];
      return template.replace("{length}", String(reason.length || ""));
    }).join(copy.join);
    const template = points ? copy.earned : copy.zero;
    return template.replace("{points}", String(points)).replace("{reasons}", labels).replace("{count}", String(count));
  };

  const cribPeggingGoText = () => (CRIB_PEGGING_SCORE_COPY[currentLocale()] || CRIB_PEGGING_SCORE_COPY.en).go;

  const CASINO_COPY = {
    en: { selectPrompt: "Select a hand card, then table cards with the same value or a matching sum.", captureHint: "Value {value}: {rank} same-value option(s), {sum} sum combination(s). Highlighted cards are candidates; you choose the capture.", buildPreview: "Build preview: {cards} = {value}. Press Build to commit; no cards are chosen automatically.", trailPrompt: "Choose table cards to Capture or Build, or Trail this card when no capture is available.", trail: "Trail", captureFeedback: "Captured {count} cards · {special} · immediate card bonus +{bonus}. Majority bonus settles at round end.", specialNone: "No special-card bonus", specialTen: "10♦ bonus +2", specialTwo: "2♠ bonus +3", specialSpade: "Spades ×{count} bonus +{bonus}", resultBreakdown: "Captured {cards} cards · special bonuses +{immediate} · majority bonus: {majority} · final score: {score}." },
    "zh-Hant": { selectPrompt: "先選一張手牌，再選相同點數或合計相符的桌面牌。", captureHint: "點數 {value}：同點 {rank} 個選項、合計 {sum} 種組合。高亮牌是候選，你自行選擇捕獲。", buildPreview: "建牌預覽：{cards} = {value}。按下「建立牌組」確認；不會自動選牌。", trailPrompt: "選擇桌面牌來捕獲或建立牌組；沒有可捕獲的牌時，可將這張牌出到桌面。", trail: "出牌", captureFeedback: "捕獲 {count} 張牌 · {special} · 即時牌面獎勵 +{bonus}。最多牌獎勵在本局結算。", specialNone: "沒有特殊牌獎勵", specialTen: "10♦ 獎勵 +2", specialTwo: "2♠ 獎勵 +3", specialSpade: "黑桃 ×{count} 獎勵 +{bonus}", resultBreakdown: "捕獲 {cards} 張牌 · 特殊獎勵 +{immediate} · 最多牌獎勵：{majority} · 最終得分：{score}。" },
    "zh-Hans": { selectPrompt: "先选一张手牌，再选相同点数或合计相符的桌面牌。", captureHint: "点数 {value}：同点 {rank} 个选项、合计 {sum} 种组合。高亮牌是候选，由你选择捕获。", buildPreview: "建牌预览：{cards} = {value}。按下“建立牌组”确认；不会自动选牌。", trailPrompt: "选择桌面牌来捕获或建立牌组；没有可捕获的牌时，可将这张牌出到桌面。", trail: "出牌", captureFeedback: "捕获 {count} 张牌 · {special} · 即时牌面奖励 +{bonus}。最多牌奖励在本局结算。", specialNone: "没有特殊牌奖励", specialTen: "10♦ 奖励 +2", specialTwo: "2♠ 奖励 +3", specialSpade: "黑桃 ×{count} 奖励 +{bonus}", resultBreakdown: "捕获 {cards} 张牌 · 特殊奖励 +{immediate} · 最多牌奖励：{majority} · 最终得分：{score}。" },
    ja: { selectPrompt: "手札を1枚選び、同じ値または合計が一致する場札を選びます。", captureHint: "値 {value}：同じ値 {rank} 件、合計 {sum} 通り。ハイライトは候補です。取るカードは自分で選びます。", buildPreview: "ビルド予告：{cards} = {value}。ビルドを押して確定します。自動選択はありません。", trailPrompt: "場札を選んで獲得またはビルドします。獲得できないときは、このカードを場に出します。", trail: "場に出す", captureFeedback: "{count}枚を獲得 · {special} · 即時カードボーナス +{bonus}。最多カード報酬はラウンド終了時に計算されます。", specialNone: "特別カードボーナスなし", specialTen: "10♦ ボーナス +2", specialTwo: "2♠ ボーナス +3", specialSpade: "スペード {count}枚のボーナス +{bonus}", resultBreakdown: "{cards}枚を獲得 · 特別ボーナス +{immediate} · 最多カード報酬：{majority} · 最終スコア：{score}。" },
    ko: { selectPrompt: "손패를 한 장 고른 뒤 같은 값이거나 합이 맞는 테이블 카드를 고르세요.", captureHint: "값 {value}: 같은 값 {rank}개, 합 조합 {sum}개입니다. 강조된 카드는 후보이며 잡을 카드는 직접 고릅니다.", buildPreview: "빌드 미리보기: {cards} = {value}. 빌드를 눌러 확정하세요. 카드는 자동 선택되지 않습니다.", trailPrompt: "테이블 카드를 골라 잡거나 빌드하세요. 잡을 수 없을 때는 이 카드를 테이블에 내려놓습니다.", trail: "내려놓기", captureFeedback: "{count}장 획득 · {special} · 즉시 카드 보너스 +{bonus}. 최다 카드 보너스는 라운드 종료 시 계산됩니다.", specialNone: "특수 카드 보너스 없음", specialTen: "10♦ 보너스 +2", specialTwo: "2♠ 보너스 +3", specialSpade: "스페이드 {count}장 보너스 +{bonus}", resultBreakdown: "{cards}장 획득 · 특별 보너스 +{immediate} · 최다 카드 보너스: {majority} · 최종 점수: {score}." },
    es: { selectPrompt: "Elige una carta de tu mano y después cartas de mesa del mismo valor o con una suma igual.", captureHint: "Valor {value}: {rank} opción(es) del mismo valor y {sum} combinación(es) de suma. Las cartas resaltadas son candidatas; tú eliges la captura.", buildPreview: "Vista previa de Build: {cards} = {value}. Pulsa Build para confirmar; no se eligen cartas automáticamente.", trailPrompt: "Elige cartas de mesa para capturar o construir; si no puedes capturar, juega esta carta sobre la mesa.", trail: "Jugar", captureFeedback: "Capturaste {count} cartas · {special} · bonificación inmediata +{bonus}. La mayoría de cartas se puntúa al final.", specialNone: "Sin bonificación de carta especial", specialTen: "Bonificación de 10♦ +2", specialTwo: "Bonificación de 2♠ +3", specialSpade: "Bonificación de picas ×{count}: +{bonus}", resultBreakdown: "Capturaste {cards} cartas · bonificaciones especiales +{immediate} · mayoría: {majority} · puntuación final: {score}." },
    "pt-BR": { selectPrompt: "Escolha uma carta da mão e depois cartas da mesa com o mesmo valor ou uma soma igual.", captureHint: "Valor {value}: {rank} opção(ões) do mesmo valor e {sum} combinação(ões) de soma. As cartas destacadas são candidatas; você escolhe a captura.", buildPreview: "Prévia da construção: {cards} = {value}. Pressione Construir para confirmar; nenhuma carta é escolhida automaticamente.", trailPrompt: "Escolha cartas da mesa para capturar ou construir; se não puder capturar, jogue esta carta na mesa.", trail: "Jogar", captureFeedback: "Você capturou {count} cartas · {special} · bônus imediato +{bonus}. A maioria de cartas é pontuada no fim.", specialNone: "Sem bônus de carta especial", specialTen: "Bônus do 10♦ +2", specialTwo: "Bônus do 2♠ +3", specialSpade: "Bônus de espadas ×{count}: +{bonus}", resultBreakdown: "Você capturou {cards} cartas · bônus especiais +{immediate} · maioria de cartas: {majority} · pontuação final: {score}." },
    fr: { selectPrompt: "Choisissez une carte de votre main, puis des cartes de table de même valeur ou d'une somme égale.", captureHint: "Valeur {value} : {rank} option(s) de même valeur et {sum} combinaison(s) de somme. Les cartes en évidence sont candidates ; vous choisissez la capture.", buildPreview: "Aperçu du build : {cards} = {value}. Appuyez sur Construire pour confirmer ; aucune carte n'est choisie automatiquement.", trailPrompt: "Choisissez des cartes à capturer ou à construire ; sans capture possible, posez cette carte sur la table.", trail: "Poser", captureFeedback: "{count} cartes capturées · {special} · bonus immédiat +{bonus}. La majorité des cartes est comptée à la fin.", specialNone: "Aucun bonus de carte spéciale", specialTen: "Bonus du 10♦ +2", specialTwo: "Bonus du 2♠ +3", specialSpade: "Bonus de pique ×{count} : +{bonus}", resultBreakdown: "{cards} cartes capturées · bonus spéciaux +{immediate} · majorité : {majority} · score final : {score}." },
    de: { selectPrompt: "Wähle eine Handkarte und dann Tischkarten mit gleichem Wert oder passender Summe.", captureHint: "Wert {value}: {rank} gleiche-Wert-Option(en), {sum} Summenkombination(en). Hervorgehobene Karten sind Kandidaten; du wählst selbst.", buildPreview: "Bau-Vorschau: {cards} = {value}. Drücke Bauen zum Bestätigen; Karten werden nicht automatisch gewählt.", trailPrompt: "Wähle Tischkarten zum Nehmen oder Bauen; wenn kein Nehmen möglich ist, spiele diese Karte auf den Tisch.", trail: "Ausspielen", captureFeedback: "{count} Karten genommen · {special} · sofortiger Kartenbonus +{bonus}. Die Kartenmehrheit zählt am Ende.", specialNone: "Kein Sonderkartenbonus", specialTen: "10♦-Bonus +2", specialTwo: "2♠-Bonus +3", specialSpade: "Pik-Bonus ×{count}: +{bonus}", resultBreakdown: "{cards} Karten genommen · Sonderboni +{immediate} · Kartenmehrheit: {majority} · Endpunktzahl: {score}." },
    it: { selectPrompt: "Scegli una carta dalla mano, poi carte sul tavolo dello stesso valore o con una somma uguale.", captureHint: "Valore {value}: {rank} opzione/i dello stesso valore e {sum} combinazione/i di somma. Le carte evidenziate sono candidate; scegli tu la cattura.", buildPreview: "Anteprima costruzione: {cards} = {value}. Premi Costruisci per confermare; nessuna carta viene scelta automaticamente.", trailPrompt: "Scegli le carte da catturare o costruire; se non puoi catturare, gioca questa carta sul tavolo.", trail: "Gioca", captureFeedback: "{count} carte catturate · {special} · bonus immediato +{bonus}. La maggioranza delle carte vale a fine mano.", specialNone: "Nessun bonus da carta speciale", specialTen: "Bonus 10♦ +2", specialTwo: "Bonus 2♠ +3", specialSpade: "Bonus di picche ×{count}: +{bonus}", resultBreakdown: "{cards} carte catturate · bonus speciali +{immediate} · maggioranza: {majority} · punteggio finale: {score}." },
    ru: { selectPrompt: "Выберите карту из руки, затем карты на столе с тем же значением или подходящей суммой.", captureHint: "Значение {value}: вариантов того же значения — {rank}, комбинаций по сумме — {sum}. Выделенные карты — кандидаты; выбор остаётся за вами.", buildPreview: "Предпросмотр сбора: {cards} = {value}. Нажмите «Собрать», чтобы подтвердить; карты не выбираются автоматически.", trailPrompt: "Выберите карты для взятия или сбора; если взять нельзя, выложите эту карту на стол.", trail: "Выложить", captureFeedback: "Взято карт: {count} · {special} · немедленный бонус за карты: +{bonus}. Большинство карт учитывается в конце раунда.", specialNone: "Нет бонуса за особую карту", specialTen: "Бонус 10♦ +2", specialTwo: "Бонус 2♠ +3", specialSpade: "Бонус пик ×{count}: +{bonus}", resultBreakdown: "Взято карт: {cards} · особые бонусы: +{immediate} · большинство карт: {majority} · итоговый счёт: {score}." },
    hi: { selectPrompt: "हाथ से एक पत्ता चुनें, फिर उसी मान या बराबर योग वाले मेज के पत्ते चुनें।", captureHint: "मान {value}: समान मान के {rank} विकल्प, योग के {sum} संयोजन। उभरे पत्ते उम्मीदवार हैं; पकड़ आप चुनते हैं।", buildPreview: "बनाने का पूर्वावलोकन: {cards} = {value}। पुष्टि के लिए बनाएँ दबाएँ; पत्ते अपने-आप नहीं चुने जाते।", trailPrompt: "पकड़ने या बनाने के लिए मेज के पत्ते चुनें; जब कोई पकड़ संभव न हो, तो इस पत्ते को मेज पर रखें।", trail: "मेज पर रखें", captureFeedback: "{count} पत्ते लिए · {special} · तुरंत कार्ड बोनस +{bonus}। सबसे अधिक पत्तों का अंक राउंड के अंत में जुड़ेगा।", specialNone: "कोई विशेष कार्ड बोनस नहीं", specialTen: "10♦ बोनस +2", specialTwo: "2♠ बोनस +3", specialSpade: "स्पेड बोनस ×{count}: +{bonus}", resultBreakdown: "{cards} पत्ते लिए · विशेष बोनस +{immediate} · अधिकांश पत्तों का बोनस: {majority} · अंतिम स्कोर: {score}।" },
    ar: { selectPrompt: "اختر بطاقة من يدك، ثم بطاقات على الطاولة بالقيمة نفسها أو بمجموع مطابق.", captureHint: "القيمة {value}: {rank} خيار بالقيمة نفسها و{sum} تركيبة مجموع. البطاقات المميزة مرشحة؛ وأنت تختار الالتقاط.", buildPreview: "معاينة البناء: {cards} = {value}. اضغط «بناء» للتأكيد؛ لا يتم اختيار البطاقات تلقائياً.", trailPrompt: "اختر بطاقات لالتقاطها أو بنائها؛ إذا لم يتوفر التقاط، ضع هذه البطاقة على الطاولة.", trail: "ضع على الطاولة", captureFeedback: "تم التقاط {count} بطاقة · {special} · مكافأة البطاقات الفورية +{bonus}. تُحتسب أغلبية البطاقات عند نهاية الجولة.", specialNone: "لا توجد مكافأة لبطاقة خاصة", specialTen: "مكافأة 10♦ +2", specialTwo: "مكافأة 2♠ +3", specialSpade: "مكافأة البستوني ×{count}: +{bonus}", resultBreakdown: "تم التقاط {cards} بطاقة · المكافآت الخاصة +{immediate} · مكافأة الأغلبية: {majority} · النتيجة النهائية: {score}." },
  };

  const CASINO_INTENT_COPY = {
    en: { existingBuildChoice: "Existing Build selected: {cards} = {value}. Capture takes this stored group; Build with {hand} creates a new group at {newValue}. Choose Capture or Build; no action is automatic.", capturePayoffLabel: "Capture payoff" },
    "zh-Hant": { existingBuildChoice: "已選取現有牌組：{cards} = {value}。捕獲會拿走這組牌；用 {hand} 建牌會建立新的 {newValue} 牌組。請選擇捕獲或建牌；不會自動執行。", capturePayoffLabel: "捕獲回饋" },
    "zh-Hans": { existingBuildChoice: "已选取现有牌组：{cards} = {value}。捕获会拿走这组牌；用 {hand} 建牌会建立新的 {newValue} 牌组。请选择捕获或建牌；不会自动执行。", capturePayoffLabel: "捕获反馈" },
    ja: { existingBuildChoice: "既存ビルドを選択中：{cards} = {value}。キャプチャーは保存済みの組を取ります。{hand} でビルドすると新しい {newValue} の組になります。キャプチャーかビルドを選んでください。自動実行はありません。", capturePayoffLabel: "キャプチャーの成果" },
    ko: { existingBuildChoice: "기존 빌드를 선택했습니다: {cards} = {value}. 캡처는 저장된 그룹을 가져가고, {hand}로 빌드하면 {newValue} 새 그룹을 만듭니다. 캡처 또는 빌드를 직접 선택하세요. 자동 실행은 없습니다.", capturePayoffLabel: "캡처 보상" },
    es: { existingBuildChoice: "Build existente seleccionado: {cards} = {value}. Capturar toma este grupo guardado; construir con {hand} crea un grupo nuevo de {newValue}. Elige Capturar o Construir; no se hace nada automáticamente.", capturePayoffLabel: "Recompensa de captura" },
    "pt-BR": { existingBuildChoice: "Construção existente selecionada: {cards} = {value}. Capturar pega este grupo salvo; construir com {hand} cria um novo grupo de {newValue}. Escolha Capturar ou Construir; nenhuma ação é automática.", capturePayoffLabel: "Retorno da captura" },
    fr: { existingBuildChoice: "Build existant sélectionné : {cards} = {value}. Capturer prend ce groupe enregistré ; construire avec {hand} crée un nouveau groupe de {newValue}. Choisissez Capturer ou Construire ; aucune action n'est automatique.", capturePayoffLabel: "Gain de capture" },
    de: { existingBuildChoice: "Vorhandener Build ausgewählt: {cards} = {value}. Nehmen nimmt diese gespeicherte Gruppe; Bauen mit {hand} erstellt eine neue Gruppe mit {newValue}. Wähle Nehmen oder Bauen; nichts geschieht automatisch.", capturePayoffLabel: "Fang-Belohnung" },
    it: { existingBuildChoice: "Costruzione esistente selezionata: {cards} = {value}. Cattura prende questo gruppo salvato; costruire con {hand} crea un nuovo gruppo da {newValue}. Scegli Cattura o Costruisci; nessuna azione è automatica.", capturePayoffLabel: "Ricompensa della cattura" },
    ru: { existingBuildChoice: "Выбран существующий сбор: {cards} = {value}. Взятие забирает сохранённую группу; сбор с картой {hand} создаёт новую группу со значением {newValue}. Выберите «Взять» или «Собрать» — автоматического действия нет.", capturePayoffLabel: "Результат взятия" },
    hi: { existingBuildChoice: "मौजूदा समूह चुना गया: {cards} = {value}। पकड़ने पर यह सुरक्षित समूह लिया जाएगा; {hand} से बनाने पर {newValue} का नया समूह बनेगा। पकड़ें या बनाएँ चुनें; कोई कार्रवाई अपने-आप नहीं होगी।", capturePayoffLabel: "पकड़ का लाभ" },
    ar: { existingBuildChoice: "تم اختيار بناء موجود: {cards} = {value}. الالتقاط يأخذ هذه المجموعة المحفوظة؛ والبناء باستخدام {hand} ينشئ مجموعة جديدة بقيمة {newValue}. اختر الالتقاط أو البناء؛ لا يوجد إجراء تلقائي.", capturePayoffLabel: "مكافأة الالتقاط" },
  };

  const CASINO_BUILD_COPY = {
    en: "Build unavailable: {value} is above the playable 1–10 range. Remove a table card or choose a legal group.",
    "zh-Hant": "無法建牌：{value} 超過可被手牌捕獲的 1–10 範圍。請移除一張桌面牌，或改選合法牌組。",
    "zh-Hans": "无法建牌：{value} 超过可由手牌捕获的 1–10 范围。请移除一张桌面牌，或改选合法牌组。",
    ja: "ビルド不可：{value} は手札で取れる 1〜10 の範囲を超えています。場札を1枚外すか、合法な組み合わせを選んでください。",
    ko: "빌드 불가: {value}은(는) 손패로 잡을 수 있는 1~10 범위를 넘습니다. 테이블 카드를 한 장 빼거나 합법적인 그룹을 고르세요.",
    es: "Build no disponible: {value} supera el rango jugable de 1–10. Retira una carta de mesa o elige un grupo legal.",
    "pt-BR": "Construção indisponível: {value} ultrapassa o intervalo jogável de 1–10. Remova uma carta da mesa ou escolha um grupo legal.",
    fr: "Build impossible : {value} dépasse la plage jouable de 1 à 10. Retirez une carte de table ou choisissez un groupe légal.",
    de: "Bauen nicht möglich: {value} liegt über dem spielbaren Bereich 1–10. Entferne eine Tischkarte oder wähle eine legale Gruppe.",
    it: "Costruzione non disponibile: {value} supera l'intervallo giocabile 1–10. Rimuovi una carta dal tavolo o scegli un gruppo legale.",
    ru: "Сбор недоступен: {value} выше игрового диапазона 1–10. Уберите карту со стола или выберите допустимую группу.",
    hi: "बनाना उपलब्ध नहीं: {value} खेलने योग्य 1–10 सीमा से अधिक है। मेज़ से एक पत्ता हटाएँ या कानूनी समूह चुनें।",
    ar: "لا يمكن البناء: القيمة {value} تتجاوز النطاق القابل للالتقاط من 1 إلى 10. أزل بطاقة من الطاولة أو اختر مجموعة قانونية.",
  };

  const casinoText = (key, values = {}) => {
    const dictionary = CASINO_COPY[currentLocale()] || CASINO_COPY.en;
    const intentCopy = CASINO_INTENT_COPY[currentLocale()] || CASINO_INTENT_COPY.en;
    let value = dictionary[key] || intentCopy[key] || (key === "buildUnavailable" ? CASINO_BUILD_COPY[currentLocale()] : "") || CASINO_COPY.en[key] || CASINO_INTENT_COPY.en[key] || CASINO_BUILD_COPY.en || key;
    Object.entries(values).forEach(([name, replacement]) => { value = value.replaceAll(`{${name}}`, String(replacement)); });
    return value;
  };

  const CASINO_PROGRESS_COPY = {
    en: { label: "Capture progress", copy: "Capture table cards by rank or sum." },
    "zh-Hant": { label: "捕獲進度", copy: "按點數或合計捕獲桌面牌。" },
    "zh-Hans": { label: "捕获进度", copy: "按点数或合计捕获桌面牌。" },
    ja: { label: "キャプチャー進行", copy: "同じ値または合計で場札を獲得します。" },
    ko: { label: "캡처 진행", copy: "같은 값이나 합으로 테이블 카드를 잡으세요." },
    es: { label: "Progreso de capturas", copy: "Captura cartas de mesa por valor o suma." },
    "pt-BR": { label: "Progresso de capturas", copy: "Capture cartas da mesa por valor ou soma." },
    fr: { label: "Progression des captures", copy: "Capturez les cartes de table par valeur ou somme." },
    de: { label: "Fangfortschritt", copy: "Nimm Tischkarten nach Wert oder Summe." },
    it: { label: "Progresso delle catture", copy: "Cattura le carte del tavolo per valore o somma." },
    ru: { label: "Прогресс взятия", copy: "Забирайте карты стола по значению или сумме." },
    hi: { label: "पकड़ की प्रगति", copy: "मान या योग से मेज़ के पत्ते पकड़ें।" },
    ar: { label: "تقدّم الالتقاط", copy: "التقط بطاقات الطاولة بالقيمة أو بالمجموع." },
  };

  let casinoShellSyncing = false;
  const syncCasinoShell = () => {
    if (casinoShellSyncing) return;
    casinoShellSyncing = true;
    try {
      const labels = TEXT[currentLocale()] || TEXT.en;
      const progressCopy = CASINO_PROGRESS_COPY[currentLocale()] || CASINO_PROGRESS_COPY.en;
      ownLocalizedText(document.querySelector("[data-wp-main-progress] strong"), progressCopy.label);
      ownLocalizedText(document.querySelector("[data-wp-main-progress] span"), progressCopy.copy);
      const settings = document.querySelector("#audioMenuBtn");
      if (settings) settings.setAttribute("aria-label", labels.settings);
      const battleUtility = document.querySelector("[data-wp-battle-utility]");
      if (battleUtility) {
        battleUtility.setAttribute("aria-label", labels.settings);
        battleUtility.title = labels.settings;
      }
      // Casino owns its Result actions so the generic route localizer cannot
      // partially translate them (for example, Arabic `جديد Game`). Keep the
      // action labels tied to the active locale for both the initial mount and
      // every Settings locale transaction.
      [
        [document.querySelector("#resultTitle"), labels.roundOver],
        [document.querySelector("#resultNewGame"), labels.newGame],
        [document.querySelector("#resultRestart"), labels.restart],
        [document.querySelector("#resultClose"), labels.close],
      ].forEach(([node, value]) => ownLocalizedText(node, value));
    } finally {
      casinoShellSyncing = false;
    }
  };

  const t = (key, values = {}) => {
    const dictionary = TEXT[currentLocale()] || TEXT.en;
    let value = key === "cribbage" ? (TITLES.cribbage[currentLocale()] || TITLES.cribbage.en) : (dictionary[key] || TEXT.en[key] || key);
    Object.entries(values).forEach(([name, replacement]) => { value = value.replaceAll(`{${name}}`, String(replacement)); });
    return value;
  };
  const WAR_SWING_COPY = {
    en: { player: "You take the pot: {count} cards.", ai: "AI takes the pot: {count} cards." },
    "zh-Hant": { player: "你收下這墩：{count} 張牌。", ai: "AI 收下這墩：{count} 張牌。" },
    "zh-Hans": { player: "你收下这墩：{count} 张牌。", ai: "AI 收下这墩：{count} 张牌。" },
    ja: { player: "あなたが場の札を獲得：{count}枚。", ai: "AIが場の札を獲得：{count}枚。" },
    ko: { player: "당신이 더미를 가져갑니다: {count}장.", ai: "AI가 더미를 가져갑니다: {count}장." },
    es: { player: "Te llevas el bote: {count} cartas.", ai: "La IA se lleva el bote: {count} cartas." },
    "pt-BR": { player: "Você leva o monte: {count} cartas.", ai: "A IA leva o monte: {count} cartas." },
    fr: { player: "Vous remportez le pot : {count} cartes.", ai: "L’IA remporte le pot : {count} cartes." },
    de: { player: "Du gewinnst den Stapel: {count} Karten.", ai: "Die KI gewinnt den Stapel: {count} Karten." },
    it: { player: "Prendi il piatto: {count} carte.", ai: "L'IA prende il piatto: {count} carte." },
    ru: { player: "Вы забираете стопку: {count} карт.", ai: "ИИ забирает стопку: {count} карт." },
    hi: { player: "आपने ढेर जीता: {count} पत्ते।", ai: "AI ने ढेर जीता: {count} पत्ते।" },
    ar: { player: "لقد فزت بالكومة: {count} بطاقة.", ai: "فاز الذكاء الاصطناعي بالكومة: {count} بطاقة." },
  };
  const warSwingText = (winner, count) => {
    const dictionary = WAR_SWING_COPY[currentLocale()] || WAR_SWING_COPY.en;
    return (dictionary[winner] || WAR_SWING_COPY.en[winner]).replaceAll("{count}", String(count));
  };
  const WAR_GUIDANCE_COPY = {
    en: { flip: "Flip together and watch the collision.", war: "Place three cards down, then reveal the next card." },
    "zh-Hant": { flip: "一起翻牌，看看牌面如何碰撞。", war: "各放下三張牌，再翻開下一張牌。" },
    "zh-Hans": { flip: "一起翻牌，看看牌面如何碰撞。", war: "各放下三张牌，再翻开下一张牌。" },
    ja: { flip: "一緒にめくって、カードのぶつかり合いを見届けよう。", war: "お互いに3枚を伏せて置き、次の1枚をめくります。" },
    ko: { flip: "함께 뒤집고 카드가 맞붙는 순간을 지켜보세요.", war: "각자 카드 세 장을 내려놓고 다음 카드를 뒤집으세요." },
    es: { flip: "Voltea a la vez y observa el choque.", war: "Coloca tres cartas y luego revela la siguiente." },
    "pt-BR": { flip: "Vire ao mesmo tempo e veja o confronto.", war: "Coloque três cartas e depois revele a próxima." },
    fr: { flip: "Retournez en même temps et observez le duel.", war: "Posez trois cartes, puis retournez la suivante." },
    de: { flip: "Decke gleichzeitig auf und beobachte den Kartenkampf.", war: "Lege drei Karten ab und decke dann die nächste auf." },
    it: { flip: "Gira insieme e guarda lo scontro.", war: "Metti tre carte, poi gira la successiva." },
    ru: { flip: "Открывайте одновременно и смотрите, какая карта победит.", war: "Положите по три карты, затем откройте следующую." },
    hi: { flip: "साथ में पलटें और टकराव देखें।", war: "तीन पत्ते रखें, फिर अगला पत्ता पलटें।" },
    ar: { flip: "اقلبا البطاقتين معًا وشاهد المواجهة.", war: "ضع ثلاث بطاقات، ثم اقلب البطاقة التالية." },
  };
  const warGuidanceText = (phase) => {
    const dictionary = WAR_GUIDANCE_COPY[currentLocale()] || WAR_GUIDANCE_COPY.en;
    return dictionary[phase] || WAR_GUIDANCE_COPY.en[phase];
  };
  const WAR_RESULT_COPY = {
    en: "WAR {wars} · Biggest pot {largest} cards · Next: trigger and win a WAR.",
    "zh-Hant": "戰爭 {wars} 次 · 最大底池 {largest} 張 · 下一局：觸發並贏下戰爭。",
    "zh-Hans": "战争 {wars} 次 · 最大底池 {largest} 张 · 下一局：触发并赢下战争。",
    ja: "戦争 {wars}回 · 最大ポット {largest}枚 · 次の目標：戦争を起こして勝つ。",
    ko: "전쟁 {wars}회 · 최대 더미 {largest}장 · 다음 목표: 전쟁을 일으켜 승리하세요.",
    es: "Guerras: {wars} · Bote mayor: {largest} cartas · Próximo: provoca y gana una guerra.",
    "pt-BR": "Guerras: {wars} · Maior monte: {largest} cartas · Próxima: provoque e vença uma guerra.",
    fr: "Batailles : {wars} · Plus gros pot : {largest} cartes · Ensuite : déclenchez et gagnez une bataille.",
    de: "Kriege: {wars} · Größter Stapel: {largest} Karten · Nächstes Ziel: einen Krieg auslösen und gewinnen.",
    it: "Guerre: {wars} · Piatto massimo: {largest} carte · Prossimo: innesca e vinci una guerra.",
    ru: "Войн: {wars} · Крупнейший банк: {largest} карт · Цель: вызвать и выиграть войну.",
    hi: "युद्ध: {wars} · सबसे बड़ा ढेर: {largest} पत्ते · अगला लक्ष्य: युद्ध शुरू करके जीतें।",
    ar: "الحروب: {wars} · أكبر كومة: {largest} بطاقة · الهدف التالي: أشعل حربًا واربحها.",
  };
  const warResultText = (wars, largest) => {
    const template = WAR_RESULT_COPY[currentLocale()] || WAR_RESULT_COPY.en;
    return template.replaceAll("{wars}", String(wars)).replaceAll("{largest}", String(largest));
  };
  const SPEED_LEGAL_COPY = {
    en: "{card} — legal play",
    "zh-Hant": "{card} — 可出牌",
    "zh-Hans": "{card} — 可出牌",
    ja: "{card} — 出せます",
    ko: "{card} — 낼 수 있음",
    es: "{card} — jugada legal",
    "pt-BR": "{card} — jogada válida",
    fr: "{card} — coup légal",
    de: "{card} — gültiger Zug",
    it: "{card} — giocata valida",
    ru: "{card} — допустимый ход",
    hi: "{card} — मान्य चाल",
    ar: "{card} — لعب قانوني",
  };
  const SPEED_COACH_COPY = {
    en: "Play immediately: one rank above or below either center card.",
    "zh-Hant": "立即出牌：比任一中央牌高一點或低一點即可。",
    "zh-Hans": "立即出牌：比任一中央牌高一点或低一点即可。",
    ja: "すぐに、どちらかの中央カードより1ランク上か下のカードを出します。",
    ko: "바로 플레이하세요. 어느 중앙 카드보다 한 단계 높거나 낮은 카드면 됩니다.",
    es: "Juega de inmediato: una carta un rango por encima o por debajo de cualquiera de las cartas centrales.",
    "pt-BR": "Jogue imediatamente: uma carta um valor acima ou abaixo de qualquer carta central.",
    fr: "Jouez immédiatement : une carte d’un rang au-dessus ou au-dessous de l’une des cartes centrales.",
    de: "Spiele sofort: eine Karte, die einen Rang über oder unter einer der mittleren Karten liegt.",
    it: "Gioca subito: una carta di un valore sopra o sotto una delle carte centrali.",
    ru: "Играйте сразу: карта на один ранг выше или ниже любой центральной карты.",
    hi: "तुरंत खेलें: किसी भी केंद्रीय कार्ड से एक रैंक ऊपर या नीचे वाला कार्ड।",
    ar: "العب فورًا: بطاقة أعلى أو أدنى بدرجة من أي بطاقة مركزية.",
  };
  const SPEED_DECISION_COPY = {
    en: { none: "No legal card is ready; scan both center cards for the next shared refresh.", one: "One legal card is ready; play it, then scan the refill.", many: "{count} legal cards are ready; choose one, then scan the refill." },
    "zh-Hant": { none: "目前沒有可出的牌；留意兩張中央牌的下一次同步更新。", one: "目前有一張可出的牌；出牌後重新掃描補牌。", many: "目前有 {count} 張可出的牌；選一張後重新掃描補牌。" },
    "zh-Hans": { none: "目前没有可出的牌；留意两张中央牌的下一次同步更新。", one: "目前有一张可出的牌；出牌后重新扫描补牌。", many: "目前有 {count} 张可出的牌；选一张后重新扫描补牌。" },
    ja: { none: "今は出せるカードがありません。次の中央カード更新を両方確認しましょう。", one: "出せるカードは1枚です。出したら補充された手札をもう一度確認しましょう。", many: "出せるカードは{count}枚です。1枚選んだら補充された手札を確認しましょう。" },
    ko: { none: "지금 낼 수 있는 카드가 없습니다. 다음 중앙 카드 갱신을 양쪽에서 확인하세요.", one: "낼 수 있는 카드가 한 장 있습니다. 낸 뒤 보충된 패를 다시 살펴보세요.", many: "낼 수 있는 카드가 {count}장 있습니다. 한 장을 고른 뒤 보충된 패를 살펴보세요." },
    es: { none: "No hay una carta legal lista; revisa ambas cartas centrales en la próxima renovación.", one: "Hay una carta legal; juégala y vuelve a revisar la reposición.", many: "Hay {count} cartas legales; elige una y revisa la reposición." },
    "pt-BR": { none: "Nenhuma carta válida está pronta; observe as duas cartas centrais na próxima renovação.", one: "Há uma carta válida; jogue-a e confira a reposição.", many: "Há {count} cartas válidas; escolha uma e confira a reposição." },
    fr: { none: "Aucune carte jouable pour l'instant ; surveillez les deux cartes centrales au prochain renouvellement.", one: "Une carte est jouable ; jouez-la puis vérifiez la nouvelle main.", many: "{count} cartes sont jouables ; choisissez-en une puis vérifiez la nouvelle main." },
    de: { none: "Keine spielbare Karte bereit; beobachte beide mittleren Karten bei der nächsten Erneuerung.", one: "Eine Karte ist spielbar; spiele sie und prüfe danach die neue Hand.", many: "{count} Karten sind spielbar; wähle eine und prüfe danach die neue Hand." },
    it: { none: "Nessuna carta giocabile al momento; controlla entrambe le carte centrali al prossimo aggiornamento.", one: "C'è una carta giocabile; usala e poi controlla la nuova mano.", many: "Ci sono {count} carte giocabili; scegline una e poi controlla la nuova mano." },
    ru: { none: "Сейчас нет подходящих карт; следите за обновлением обеих центральных карт.", one: "Подходит одна карта; сыграйте её и проверьте пополнение руки.", many: "Подходят {count} карты; выберите одну и проверьте пополнение руки." },
    hi: { none: "अभी कोई मान्य पत्ता नहीं है; अगले साझा बदलाव के लिए दोनों केंद्रीय पत्तों पर नज़र रखें।", one: "एक मान्य पत्ता तैयार है; उसे चलाकर फिर भरी हुई हाथ की जाँच करें।", many: "{count} मान्य पत्ते तैयार हैं; एक चुनकर फिर भरी हुई हाथ की जाँच करें।" },
    ar: { none: "لا توجد بطاقة صالحة الآن؛ راقب البطاقتين المركزيتين عند التحديث المشترك التالي.", one: "توجد بطاقة صالحة واحدة؛ العبها ثم راجع البطاقات الجديدة.", many: "توجد {count} بطاقات صالحة؛ اختر واحدة ثم راجع البطاقات الجديدة." },
  };
  const GO_FISH_COPY = {
    en: { pending: "Choose a rank to ask {opponent}", ready: "Ask {opponent} for {rank}", book: "Book complete: {rank} · progress {books}/13", result: "Books: {books} · Completed ranks: {completed}", target: "Next-deal target: build {rank} to a four-card book ({count}/4 now).", fullTarget: "Next-deal target: beat this full-book run again." },
    "zh-Hant": { pending: "選擇要向 {opponent} 詢問的點數", ready: "向 {opponent} 詢問 {rank}", book: "完成 {rank} 組牌 · 進度 {books}/13", result: "完成組牌：{books} · 已完成點數：{completed}", target: "下一局目標：把 {rank} 湊成四張（目前 {count}/4）。", fullTarget: "下一局目標：再次挑戰完成全部組牌。" },
    "zh-Hans": { pending: "选择要向 {opponent} 询问的点数", ready: "向 {opponent} 询问 {rank}", book: "完成 {rank} 组牌 · 进度 {books}/13", result: "完成组牌：{books} · 已完成点数：{completed}", target: "下一局目标：把 {rank} 凑成四张（目前 {count}/4）。", fullTarget: "下一局目标：再次挑战完成全部组牌。" },
    ja: { pending: "{opponent} に尋ねるランクを選択", ready: "{opponent} に {rank} を質問", book: "{rank} の組が完成 · 進捗 {books}/13", result: "完成した組：{books} · 完成ランク：{completed}", target: "次の目標：{rank} を4枚そろえる（現在 {count}/4）。", fullTarget: "次の目標：全組完成の記録をもう一度目指す。" },
    ko: { pending: "{opponent}에게 물을 랭크를 선택", ready: "{opponent}에게 {rank}을(를) 질문", book: "{rank} 세트 완성 · 진행 {books}/13", result: "완성 세트: {books} · 완성 랭크: {completed}", target: "다음 목표: {rank} 네 장 세트 만들기 (현재 {count}/4).", fullTarget: "다음 목표: 모든 세트 완성을 다시 노려 보세요." },
    es: { pending: "Elige el rango para preguntar a {opponent}", ready: "Pregunta a {opponent} por {rank}", book: "Grupo de {rank} completado · progreso {books}/13", result: "Grupos: {books} · Rangos completados: {completed}", target: "Objetivo de la próxima partida: completa el grupo de {rank} ({count}/4).", fullTarget: "Objetivo de la próxima partida: vuelve a completar todos los grupos." },
    "pt-BR": { pending: "Escolha o valor para perguntar a {opponent}", ready: "Pergunte a {opponent} pelo valor {rank}", book: "Grupo de {rank} completo · progresso {books}/13", result: "Grupos: {books} · Valores completos: {completed}", target: "Meta da próxima rodada: complete o grupo de {rank} ({count}/4).", fullTarget: "Meta da próxima rodada: tente completar todos os grupos novamente." },
    fr: { pending: "Choisissez la valeur à demander à {opponent}", ready: "Demandez {rank} à {opponent}", book: "Carré de {rank} complété · progression {books}/13", result: "Familles : {books} · Valeurs complétées : {completed}", target: "Objectif de la prochaine manche : complétez le carré de {rank} ({count}/4).", fullTarget: "Objectif de la prochaine manche : complétez à nouveau toutes les familles." },
    de: { pending: "Wähle den Rang für {opponent}", ready: "Frage {opponent} nach {rank}", book: "Vierling {rank} komplett · Fortschritt {books}/13", result: "Vierlinge: {books} · Vollständige Ränge: {completed}", target: "Ziel für die nächste Runde: Vervollständige den Vierling {rank} ({count}/4).", fullTarget: "Ziel für die nächste Runde: Schaffe wieder alle Vierlinge." },
    it: { pending: "Scegli il valore da chiedere a {opponent}", ready: "Chiedi {rank} a {opponent}", book: "Combinazione di {rank} completata · progresso {books}/13", result: "Combinazioni: {books} · Valori completati: {completed}", target: "Obiettivo della prossima partita: completa la combinazione di {rank} ({count}/4).", fullTarget: "Obiettivo della prossima partita: completa di nuovo tutte le combinazioni." },
    ru: { pending: "Выберите ранг для вопроса к {opponent}", ready: "Спросите у {opponent} про {rank}", book: "Собрана четвёрка {rank} · прогресс {books}/13", result: "Четвёрки: {books} · Собранные ранги: {completed}", target: "Цель следующей партии: соберите четвёрку {rank} ({count}/4).", fullTarget: "Цель следующей партии: снова соберите все четвёрки." },
    hi: { pending: "तय करें कि {opponent} से कौन-सी रैंक पूछनी है", ready: "{opponent} से {rank} पूछें", book: "{rank} का सेट पूरा · प्रगति {books}/13", result: "सेट: {books} · पूरी हुई रैंक: {completed}", target: "अगले खेल का लक्ष्य: {rank} का चार-पत्तों वाला सेट पूरा करें ({count}/4)।", fullTarget: "अगले खेल का लक्ष्य: फिर से सभी सेट पूरे करें।" },
    ar: { pending: "اختر الرتبة التي ستسأل عنها {opponent}", ready: "اسأل {opponent} عن {rank}", book: "اكتملت مجموعة {rank} · التقدم {books}/13", result: "المجموعات: {books} · الرتب المكتملة: {completed}", target: "هدف الجولة التالية: أكمل مجموعة {rank} من أربع بطاقات (الآن {count}/4).", fullTarget: "هدف الجولة التالية: حاول إكمال كل المجموعات مرة أخرى." },
  };
  const GO_FISH_PROGRESS_COPY = {
    en: { label: "Book progress", copy: "Complete four-of-a-kind books." },
    "zh-Hant": { label: "組牌進度", copy: "完成四張同點數牌的組牌。" },
    "zh-Hans": { label: "组牌进度", copy: "完成四张同点数牌的组牌。" },
    ja: { label: "組の進捗", copy: "同じランク4枚の組を完成させます。" },
    ko: { label: "세트 진행", copy: "같은 랭크 네 장 세트를 완성하세요." },
    es: { label: "Progreso de grupos", copy: "Completa grupos de cuatro cartas del mismo rango." },
    "pt-BR": { label: "Progresso dos grupos", copy: "Complete grupos de quatro cartas do mesmo valor." },
    fr: { label: "Progression des familles", copy: "Complétez des familles de quatre cartes du même rang." },
    de: { label: "Vierlingsfortschritt", copy: "Bilde Vierlinge aus vier Karten desselben Rangs." },
    it: { label: "Progresso delle combinazioni", copy: "Completa combinazioni di quattro carte dello stesso valore." },
    ru: { label: "Прогресс четвёрок", copy: "Соберите четвёрки из четырёх карт одного ранга." },
    hi: { label: "सेट की प्रगति", copy: "एक ही रैंक के चार पत्तों का सेट पूरा करें।" },
    ar: { label: "تقدّم المجموعات", copy: "أكمل مجموعات من أربع بطاقات من الرتبة نفسها." },
  };
  const GO_FISH_BATTLE_COPY = {
    en: { heading: "How to play", paragraph: "Complete four-of-a-kind books. Choose two, three, or four players in the preview build." },
    "zh-Hant": { heading: "遊戲玩法", paragraph: "完成四張同點數牌的組牌。預覽版可選擇兩人、三人或四人。" },
    "zh-Hans": { heading: "游戏玩法", paragraph: "完成四张同点数牌的组牌。预览版可选择两人、三人或四人。" },
    ja: { heading: "遊び方", paragraph: "同じランク4枚の組を完成させます。プレビュー版では2〜4人を選べます。" },
    ko: { heading: "게임 방법", paragraph: "같은 랭크 네 장 세트를 완성하세요. 프리뷰에서는 2·3·4인 게임을 선택할 수 있습니다." },
    es: { heading: "Cómo jugar", paragraph: "Completa grupos de cuatro cartas del mismo rango. En la vista previa puedes elegir 2, 3 o 4 jugadores." },
    "pt-BR": { heading: "Como jogar", paragraph: "Complete grupos de quatro cartas do mesmo valor. A prévia permite escolher 2, 3 ou 4 jogadores." },
    fr: { heading: "Comment jouer", paragraph: "Complétez des familles de quatre cartes du même rang. L’aperçu permet de choisir 2, 3 ou 4 joueurs." },
    de: { heading: "Spielanleitung", paragraph: "Bilde Vierlinge aus vier Karten desselben Rangs. In der Vorschau kannst du 2, 3 oder 4 Spieler wählen." },
    it: { heading: "Come si gioca", paragraph: "Completa combinazioni di quattro carte dello stesso valore. Nell’anteprima puoi scegliere 2, 3 o 4 giocatori." },
    ru: { heading: "Как играть", paragraph: "Соберите четвёрки из четырёх карт одного ранга. В предпросмотре можно выбрать 2, 3 или 4 игроков." },
    hi: { heading: "कैसे खेलें", paragraph: "एक ही रैंक के चार पत्तों का सेट पूरा करें। प्रीव्यू में 2, 3 या 4 खिलाड़ी चुनें।" },
    ar: { heading: "طريقة اللعب", paragraph: "أكمل مجموعات من أربع بطاقات من الرتبة نفسها. يمكنك اختيار لاعبين أو ثلاثة أو أربعة في المعاينة." },
  };
  const goFishBattleCopy = () => GO_FISH_BATTLE_COPY[currentLocale()] || GO_FISH_BATTLE_COPY.en;
  const goFishText = (key, values = {}) => {
    const dictionary = GO_FISH_COPY[currentLocale()] || GO_FISH_COPY.en;
    let value = dictionary[key] || GO_FISH_COPY.en[key] || key;
    Object.entries(values).forEach(([name, replacement]) => { value = value.replaceAll(`{${name}}`, String(replacement)); });
    return value;
  };
  let goFishShellSyncing = false;
  const syncGoFishShell = () => {
    if (goFishShellSyncing) return;
    goFishShellSyncing = true;
    try {
      const labels = TEXT[currentLocale()] || TEXT.en;
      const progressCopy = GO_FISH_PROGRESS_COPY[currentLocale()] || GO_FISH_PROGRESS_COPY.en;
      ownLocalizedText(document.querySelector("[data-wp-main-progress] strong"), progressCopy.label);
      ownLocalizedText(document.querySelector("[data-wp-main-progress] span"), progressCopy.copy);
      const settings = document.querySelector("#audioMenuBtn");
      if (settings) settings.setAttribute("aria-label", labels.settings);
      const battleUtility = document.querySelector("[data-wp-battle-utility]");
      if (battleUtility) {
        battleUtility.setAttribute("aria-label", labels.settings);
        battleUtility.title = labels.settings;
      }
    } finally {
      goFishShellSyncing = false;
    }
  };
  const heartsText = () => (HEARTS_COPY[currentLocale()] || HEARTS_COPY.en).help;
  const heartsPassText = (handCards, selected) => {
    const copy = HEARTS_PASS_COPY[currentLocale()] || HEARTS_PASS_COPY.en;
    const selectedCards = [...selected].map((index) => handCards[index]).filter(Boolean);
    if (selectedCards.length !== 3) return `${t("selectCards")}: ${selectedCards.length}/3`;
    const hearts = selectedCards.filter((item) => item.suit === "hearts").length;
    const queen = selectedCards.some((item) => item.suit === "spades" && item.rank === 12);
    const penalties = [hearts ? `♥ × ${hearts}` : "", queen ? "Q♠" : ""].filter(Boolean).join(" + ");
    const points = hearts + (queen ? 13 : 0);
    let text = (hearts || queen ? copy.risk : copy.safe)
      .replaceAll("{penalties}", penalties)
      .replaceAll("{points}", String(points));
    const voidSuits = SUITS.filter((suit) => {
      const inHand = handCards.filter((item) => item.suit === suit).length;
      const selectedInSuit = selectedCards.filter((item) => item.suit === suit).length;
      return selectedInSuit > 0 && inHand === selectedInSuit;
    }).map((suit) => SYMBOLS[suit]);
    if (voidSuits.length) text += ` ${copy.void.replaceAll("{suit}", voidSuits.join(" / "))}`;
    return text;
  };
  const heartsResultText = (hearts, queen, moon) => {
    const copy = HEARTS_RESULT_COPY[currentLocale()] || HEARTS_RESULT_COPY.en;
    let text = copy.lesson.replaceAll("{hearts}", String(hearts)).replaceAll("{queen}", String(queen)).replaceAll("{raw}", String(hearts + queen));
    if (moon) text += ` ${copy.moon}`;
    return text;
  };
  const spadesText = (phase) => (SPADES_COPY[currentLocale()] || SPADES_COPY.en)[phase] || SPADES_COPY.en.play;
  const spadesProgressText = (tricks, bid) => {
    const dictionary = SPADES_PROGRESS_COPY[currentLocale()] || SPADES_PROGRESS_COPY.en;
    const state = tricks < bid ? "behind" : tricks === bid ? "on" : "ahead";
    const values = { tricks, bid, remaining: Math.max(0, bid - tricks), bags: Math.max(0, tricks - bid) };
    let text = dictionary[state] || SPADES_PROGRESS_COPY.en[state];
    Object.entries(values).forEach(([name, replacement]) => { text = text.replaceAll(`{${name}}`, String(replacement)); });
    return { state, text: `${dictionary.label || SPADES_PROGRESS_COPY.en.label}: ${text}` };
  };
  const spadesTrickText = (leadSuit, winnerCard, settled = false) => {
    const dictionary = SPADES_TRICK_COPY[currentLocale()] || SPADES_TRICK_COPY.en;
    const key = settled ? "settled" : winnerCard?.suit === "spades" && leadSuit !== "spades" ? "trump" : "live";
    let text = dictionary[key] || SPADES_TRICK_COPY.en[key];
    text = text.replaceAll("{suit}", SYMBOLS[leadSuit] || "—");
    return text.replaceAll("{card}", cardText(winnerCard));
  };

  const CRAZY_EIGHTS_COPY = {
    en: { summary: "Non-wild cards by suit: {counts}. A suit with more cards can keep more options open.", suits: ["Clubs", "Diamonds", "Hearts", "Spades"] },
    "zh-Hant": { summary: "各花色的非萬用牌：{counts}。手上牌較多的花色，通常能保留更多選擇。", suits: ["梅花", "方塊", "紅心", "黑桃"] },
    "zh-Hans": { summary: "各花色的非万能牌：{counts}。手中牌较多的花色，通常能保留更多选择。", suits: ["梅花", "方块", "红心", "黑桃"] },
    ja: { summary: "ワイルドではないカードのスート別枚数：{counts}。枚数の多いスートを選ぶと、次の選択肢を残しやすくなります。", suits: ["クラブ", "ダイヤ", "ハート", "スペード"] },
    ko: { summary: "와일드가 아닌 카드의 무늬별 수: {counts}. 카드가 많은 무늬를 고르면 다음 선택지를 더 남길 수 있습니다.", suits: ["클럽", "다이아몬드", "하트", "스페이드"] },
    es: { summary: "Cartas no comodín por palo: {counts}. Elegir un palo con más cartas puede mantener más opciones abiertas.", suits: ["tréboles", "diamantes", "corazones", "picas"] },
    "pt-BR": { summary: "Cartas não coringa por naipe: {counts}. Escolher um naipe com mais cartas pode manter mais opções abertas.", suits: ["paus", "ouros", "copas", "espadas"] },
    fr: { summary: "Cartes non jokers par couleur : {counts}. Choisir une couleur plus présente peut garder davantage d'options.", suits: ["trèfles", "carreaux", "cœurs", "piques"] },
    de: { summary: "Nicht-Wildkarten nach Farbe: {counts}. Eine Farbe mit mehr Karten kann mehr Möglichkeiten offenhalten.", suits: ["Kreuz", "Karo", "Herz", "Pik"] },
    it: { summary: "Carte non jolly per seme: {counts}. Scegliere un seme più numeroso può lasciare più opzioni aperte.", suits: ["fiori", "quadri", "cuori", "picche"] },
    ru: { summary: "Обычные карты по мастям: {counts}. Масть с большим числом карт может сохранить больше вариантов.", suits: ["крести", "бубны", "черви", "пики"] },
    hi: { summary: "गैर-वाइल्ड पत्ते सूट के अनुसार: {counts}। जिस सूट के पत्ते अधिक हों, उसे चुनने से अधिक विकल्प खुले रह सकते हैं।", suits: ["क्लब", "डायमंड", "हार्ट", "स्पेड"] },
    ar: { summary: "البطاقات غير الجوكر حسب النوع: {counts}. اختيار النوع الذي تملك منه بطاقات أكثر قد يبقي خيارات أكثر متاحة.", suits: ["النوادي", "الماس", "القلوب", "البستوني"] },
  };

  const CRAZY_EIGHTS_RESULT_COPY = {
    en: {
      summary: "Cards left in your hand: {cards} · Draws taken: {draws}.",
      wild: "After your last Eight, you chose {suit}; {kept} non-wild card(s) in that suit remained.",
      noWild: "No Eight suit choice was made this round.",
    },
    "zh-Hant": {
      summary: "手上剩餘：{cards} 張 · 抽牌：{draws} 次。",
      wild: "上一次出八後選了 {suit}；該花色還剩 {kept} 張非萬用牌。",
      noWild: "本局沒有選擇八的花色。",
    },
    "zh-Hans": {
      summary: "手中剩余：{cards} 张 · 抽牌：{draws} 次。",
      wild: "上一次出八后选择了 {suit}；该花色还剩 {kept} 张非万能牌。",
      noWild: "本局没有选择八的花色。",
    },
    ja: {
      summary: "手札の残り：{cards}枚 · 引いた回数：{draws}回。",
      wild: "最後の8の後に {suit} を選択。残ったワイルド以外の同スートは {kept}枚。",
      noWild: "このラウンドでは8のスートを選びませんでした。",
    },
    ko: {
      summary: "남은 손패: {cards}장 · 뽑은 횟수: {draws}회.",
      wild: "마지막 8 뒤에 {suit}을(를) 선택했고, 그 무늬의 와일드가 아닌 카드 {kept}장이 남았습니다.",
      noWild: "이번 라운드에는 8의 무늬를 선택하지 않았습니다.",
    },
    es: {
      summary: "Cartas restantes: {cards} · Robos: {draws}.",
      wild: "Tras tu último 8 elegiste {suit}; quedaron {kept} cartas no comodín de ese palo.",
      noWild: "No elegiste un palo para un 8 en esta ronda.",
    },
    "pt-BR": {
      summary: "Cartas restantes na mão: {cards} · Compras: {draws}.",
      wild: "Após seu último 8, você escolheu {suit}; restaram {kept} cartas não coringa desse naipe.",
      noWild: "Você não escolheu um naipe para um 8 nesta rodada.",
    },
    fr: {
      summary: "Cartes restantes en main : {cards} · Pioches : {draws}.",
      wild: "Après votre dernier 8, vous avez choisi {suit} ; il restait {kept} carte(s) non joker de cette couleur.",
      noWild: "Aucune couleur n'a été choisie pour un 8 dans cette manche.",
    },
    de: {
      summary: "Karten auf der Hand: {cards} · Ziehvorgänge: {draws}.",
      wild: "Nach deiner letzten Acht hast du {suit} gewählt; dort blieben {kept} Nicht-Wildkarten.",
      noWild: "In dieser Runde wurde keine Farbe für eine Acht gewählt.",
    },
    it: {
      summary: "Carte rimaste in mano: {cards} · Pescate: {draws}.",
      wild: "Dopo l'ultimo 8 hai scelto {suit}; sono rimaste {kept} carte non jolly di quel seme.",
      noWild: "In questa mano non hai scelto un seme per un 8.",
    },
    ru: {
      summary: "Карт в руке: {cards} · Доборов: {draws}.",
      wild: "После последней восьмёрки вы выбрали масть {suit}; в ней осталось обычных карт: {kept}.",
      noWild: "В этом раунде масть для восьмёрки не выбиралась.",
    },
    hi: {
      summary: "हाथ में बचे पत्ते: {cards} · पत्ता लेने की बारियाँ: {draws}।",
      wild: "अपने आखिरी आठ के बाद आपने {suit} चुना; उस सूट के {kept} गैर-वाइल्ड पत्ते बचे।",
      noWild: "इस राउंड में आठ का सूट नहीं चुना गया।",
    },
    ar: {
      summary: "البطاقات المتبقية في يدك: {cards} · مرات السحب: {draws}.",
      wild: "بعد آخر ثمانية اخترت {suit}؛ بقيت {kept} بطاقة غير جوكر من هذا النوع.",
      noWild: "لم يتم اختيار نوع لبطاقة ثمانية في هذه الجولة.",
    },
  };

  const crazyEightsText = (key, values = {}) => {
    const dictionary = CRAZY_EIGHTS_COPY[currentLocale()] || CRAZY_EIGHTS_COPY.en;
    let value = dictionary[key] || CRAZY_EIGHTS_COPY.en[key] || key;
    Object.entries(values).forEach(([name, replacement]) => { value = value.replaceAll(`{${name}}`, String(replacement)); });
    return value;
  };

  const crazyEightsResultText = (key, values = {}) => {
    const dictionary = CRAZY_EIGHTS_RESULT_COPY[currentLocale()] || CRAZY_EIGHTS_RESULT_COPY.en;
    let value = dictionary[key] || CRAZY_EIGHTS_RESULT_COPY.en[key] || key;
    Object.entries(values).forEach(([name, replacement]) => { value = value.replaceAll(`{${name}}`, String(replacement)); });
    return value;
  };

  const CRAZY_EIGHTS_PROGRESS_COPY = {
    en: { label: "Play progress", copy: "Match suit or rank, then use an Eight to change the active suit." },
    "zh-Hant": { label: "遊玩進度", copy: "配對花色或點數，再用 8 改變目前花色。" },
    "zh-Hans": { label: "游玩进度", copy: "配对花色或点数，再用 8 改变当前花色。" },
    ja: { label: "プレイ進行", copy: "スートかランクを合わせ、8で場のスートを変えます。" },
    ko: { label: "플레이 진행", copy: "무늬나 랭크를 맞추고 8로 활성 무늬를 바꾸세요." },
    es: { label: "Progreso de juego", copy: "Combina palo o rango y usa un ocho para cambiar el palo activo." },
    "pt-BR": { label: "Progresso da partida", copy: "Combine naipe ou valor e use um oito para mudar o naipe ativo." },
    fr: { label: "Progression de la partie", copy: "Associez couleur ou valeur, puis utilisez un huit pour changer la couleur active." },
    de: { label: "Spielfortschritt", copy: "Passe Farbe oder Rang an und ändere mit einer Acht die aktive Farbe." },
    it: { label: "Progresso della partita", copy: "Abbina seme o valore e usa un otto per cambiare il seme attivo." },
    ru: { label: "Прогресс игры", copy: "Совмещайте масть или ранг, а восьмёркой меняйте активную масть." },
    hi: { label: "खेल की प्रगति", copy: "सूट या रैंक मिलाएँ और आठ से सक्रिय सूट बदलें।" },
    ar: { label: "تقدّم اللعب", copy: "طابق النوع أو الرتبة، ثم استخدم الثمانية لتغيير النوع النشط." },
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
  const speedLegalLabel = (item) => (SPEED_LEGAL_COPY[currentLocale()] || SPEED_LEGAL_COPY.en).replace("{card}", cardText(item));
  const speedDecisionText = (legalCount) => {
    const dictionary = SPEED_DECISION_COPY[currentLocale()] || SPEED_DECISION_COPY.en;
    const key = legalCount === 0 ? "none" : legalCount === 1 ? "one" : "many";
    return (dictionary[key] || SPEED_DECISION_COPY.en[key]).replace("{count}", String(legalCount));
  };
  const speedCoachText = (legalCount) => `${SPEED_COACH_COPY[currentLocale()] || SPEED_COACH_COPY.en}${Number.isFinite(legalCount) ? ` ${speedDecisionText(legalCount)}` : ""}`;

  function cardMarkup(item, index, options = {}) {
    const hidden = options.hidden || item?.faceDown;
    const classes = ["playing-card", isRed(item) ? "is-red" : "", hidden ? "is-face-down" : "", options.selected ? "is-selected" : "", options.className || ""].filter(Boolean).join(" ");
    const label = hidden ? t("cards") : cardText(item);
    const ariaLabel = options.ariaLabel || (hidden ? t("cards") : label);
    const runtimeLocalizeOff = options.runtimeLocalizeOff ? ' data-runtime-localize="off"' : "";
    return `<button type="button" class="${classes}" data-card-index="${index}" aria-label="${ariaLabel}"${runtimeLocalizeOff} ${options.disabled ? "disabled" : ""}>${hidden ? "" : label}</button>`;
  }
  function cardsMarkup(cards, options = {}) { return (cards || []).map((item, index) => cardMarkup(item, index, { ...options, selected: options.selected?.has(index) })).join(""); }
  function opponentMarkup(name, count, extra = "") { return `<div class="opponent-card"><strong>${name}</strong><span>${count} ${t("cards")}${extra ? ` · ${extra}` : ""}</span></div>`; }
  const HEARTS_CARD_COUNT_COPY = {
    en: { one: "card", other: "cards" },
    "zh-Hant": { other: "張牌" },
    "zh-Hans": { other: "张牌" },
    ja: { other: "枚" },
    ko: { other: "장" },
    es: { one: "carta", other: "cartas" },
    "pt-BR": { one: "carta", other: "cartas" },
    fr: { one: "carte", other: "cartes" },
    de: { one: "Karte", other: "Karten" },
    it: { one: "carta", other: "carte" },
    ru: { one: "карта", few: "карты", many: "карт", other: "карты" },
    hi: { one: "पत्ता", other: "पत्ते" },
    ar: { zero: "بطاقات", one: "بطاقة", two: "بطاقتان", few: "بطاقات", many: "بطاقة", other: "بطاقة" },
  };
  function heartsCardLabel(count) {
    const locale = currentLocale();
    const copy = HEARTS_CARD_COUNT_COPY[locale] || HEARTS_CARD_COUNT_COPY.en;
    const category = new Intl.PluralRules(locale).select(count);
    return copy[category] || copy.other || HEARTS_CARD_COUNT_COPY.en.other;
  }
  function heartsOpponentMarkup(name, count, extra = "") {
    return `<div class="opponent-card"><strong>${name}</strong><span>${count} ${heartsCardLabel(count)}${extra ? ` · ${extra}` : ""}</span></div>`;
  }
  function spadesOpponentMarkup(name, count, bid) { return `<div class="opponent-card"><strong>${name}</strong><span>${count} ${t("cards")} · <span class="spades-bid-label" data-runtime-localize="off">${t("bid")}: ${bid}</span></span></div>`; }
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
    let battleUtility = document.querySelector("[data-wp-battle-utility]");
    const localeSelect = document.querySelector("#localeSelect");
    const guideContent = () => {
      const heartsShell = id === "hearts" ? heartsShellCopy() : null;
      const warBattle = id === "war" ? warBattleCopy() : null;
      const goFishBattle = id === "go-fish" ? goFishBattleCopy() : null;
      const oldMaidBattle = id === "old-maid" ? (OLD_MAID_BATTLE_COPY[currentLocale()] || OLD_MAID_BATTLE_COPY.en) : null;
      const source = id === "spades" ? spadesShellCopy().quickGuideCopy : id === "gin-rummy" ? ginShellText("quickGuideCopy") : id === "cribbage" ? cribbageShellCopy().quickGuideCopy : oldMaidBattle?.quickGuideCopy || goFishBattle?.paragraph || warBattle?.quickGuideCopy || heartsShell?.howToCopy || (CARD_GAME_GUIDES[id] || "Follow the on-screen prompt, complete the round, and use Restart to try again.");
      const heading = id === "spades" ? spadesShellCopy().quickGuide : id === "gin-rummy" ? ginShellText("quickGuide") : id === "cribbage" ? cribbageShellCopy().quickGuide : oldMaidBattle?.quickGuide || goFishBattle?.heading || warBattle?.quickGuide || heartsShell?.howTo || (root.WeightPlayGameRuntimeLocalizer?.translate?.("How to play") || "How to play");
      const paragraph = id === "spades" || id === "gin-rummy" || id === "cribbage" || oldMaidBattle || goFishBattle || warBattle || heartsShell ? source : (root.WeightPlayGameRuntimeLocalizer?.translate?.(source) || source);
      return { heading, paragraph, localized: Boolean(oldMaidBattle || goFishBattle || warBattle || heartsShell) };
    };
    const quickGuide = document.createElement("p");
    quickGuide.className = "card-game-quick-guide";
    quickGuide.setAttribute("role", "note");
    quickGuide.dataset.cardQuickGuide = "true";
    const updateQuickGuide = () => {
      const { heading, paragraph, localized } = guideContent();
      quickGuide.replaceChildren();
      const quickGuideLabel = document.createElement("strong");
      quickGuideLabel.textContent = heading;
      quickGuide.append(quickGuideLabel);
      if (paragraph) quickGuide.append(document.createTextNode(`: ${paragraph}`));
      if (localized || id === "spades" || id === "gin-rummy" || id === "cribbage") quickGuide.setAttribute("data-runtime-localize", "off");
      else quickGuide.removeAttribute("data-runtime-localize");
    };
    updateQuickGuide();
    if (!main || !battle || !table || !hand || !actions) return;
    const ensureGoFishMainProgress = () => {
      const copy = document.querySelector(".wp-standard-main-copy") || document.querySelector(".main-copy");
      if (!copy || copy.querySelector("[data-wp-main-progress]")) return;
      const progress = document.createElement("div");
      progress.className = "main-progress";
      progress.dataset.wpMainProgress = "true";
      progress.setAttribute("role", "status");
      progress.setAttribute("aria-live", "polite");
      progress.innerHTML = "<strong></strong><span></span>";
      const actions = copy.querySelector(".main-actions,[data-card-main-controls]");
      if (actions) copy.insertBefore(progress, actions);
      else copy.append(progress);
    };
    const ensureGoFishBattleUtility = () => {
      const topbar = battle.querySelector(".card-game-topbar");
      if (!topbar || topbar.querySelector("[data-wp-battle-utility]")) return;
      const utility = document.createElement("button");
      utility.type = "button";
      utility.className = "battle-utility header-icon-btn";
      utility.dataset.wpBattleUtility = "true";
      utility.setAttribute("aria-label", "Settings");
      utility.title = "Settings";
      utility.textContent = "⚙";
      topbar.append(utility);
    };
    if (id === "go-fish") {
      ensureGoFishMainProgress();
      ensureGoFishBattleUtility();
      battleUtility = document.querySelector("[data-wp-battle-utility]");
      syncGoFishShell();
      window.addEventListener("wonder:locale-change", syncGoFishShell);
      window.addEventListener("weightplay:shell-sync", syncGoFishShell);
      window.setTimeout(syncGoFishShell, 0);
      window.setTimeout(syncGoFishShell, 400);
    }
    const ensureCrazyEightsMainProgress = () => {
      const copy = document.querySelector(".wp-standard-main-copy") || document.querySelector(".main-copy");
      if (!copy || copy.querySelector("[data-wp-main-progress]")) return;
      const progress = document.createElement("div");
      progress.className = "main-progress";
      progress.dataset.wpMainProgress = "true";
      progress.setAttribute("role", "status");
      progress.setAttribute("aria-live", "polite");
      progress.innerHTML = "<strong></strong><span></span>";
      const controls = copy.querySelector(".main-actions,[data-card-main-controls]");
      if (controls) copy.insertBefore(progress, controls);
      else copy.append(progress);
    };
    const ensureCrazyEightsBattleUtility = () => {
      const topbar = battle.querySelector(".card-game-topbar");
      if (!topbar || topbar.querySelector("[data-wp-battle-utility]")) return;
      const utility = document.createElement("button");
      utility.id = "battleUtilityBtn";
      utility.type = "button";
      utility.className = "battle-utility header-icon-btn";
      utility.dataset.wpBattleUtility = "true";
      utility.setAttribute("aria-label", "Settings");
      utility.title = "Settings";
      utility.textContent = "⚙";
      topbar.append(utility);
    };
    let crazyEightsShellSyncing = false;
    const syncCrazyEightsShell = () => {
      if (crazyEightsShellSyncing) return;
      crazyEightsShellSyncing = true;
      try {
        const labels = TEXT[currentLocale()] || TEXT.en;
        const progressCopy = CRAZY_EIGHTS_PROGRESS_COPY[currentLocale()] || CRAZY_EIGHTS_PROGRESS_COPY.en;
        ownLocalizedText(document.querySelector("[data-wp-main-progress] strong"), progressCopy.label);
        ownLocalizedText(document.querySelector("[data-wp-main-progress] span"), progressCopy.copy);
        const settings = document.querySelector("#audioMenuBtn");
        if (settings) settings.setAttribute("aria-label", labels.settings);
        const utility = document.querySelector("[data-wp-battle-utility]");
        if (utility) {
          utility.setAttribute("aria-label", labels.settings);
          utility.title = labels.settings;
        }
      } finally {
        crazyEightsShellSyncing = false;
      }
    };
    if (id === "crazy-eights") {
      ensureCrazyEightsMainProgress();
      ensureCrazyEightsBattleUtility();
      battleUtility = document.querySelector("[data-wp-battle-utility]");
      syncCrazyEightsShell();
      window.addEventListener("wonder:locale-change", syncCrazyEightsShell);
      window.addEventListener("weightplay:shell-sync", syncCrazyEightsShell);
      window.setTimeout(syncCrazyEightsShell, 0);
      window.setTimeout(syncCrazyEightsShell, 400);
      statusText?.setAttribute("aria-live", "polite");
      statusText?.setAttribute("aria-atomic", "true");
    }
    if (id === "hearts" || id === "crazy-eights" || id === "gin-rummy" || id === "cribbage") resultText?.setAttribute("data-runtime-localize", "off");
    if (id === "gin-rummy") {
      syncGinShell();
      statusText?.setAttribute("data-runtime-localize", "off");
      const playerHandLabel = document.querySelector(".card-game-player-header strong");
      if (playerHandLabel) {
        playerHandLabel.textContent = ginBattleText("yourHand");
        playerHandLabel.setAttribute("data-runtime-localize", "off");
      }
      const resultLabels = [
        [resultTitle, "resultTitle"],
        [document.querySelector("#resultNewGame"), "newGame"],
        [document.querySelector("#resultRestart"), "restart"],
        [document.querySelector("#resultClose"), "close"],
      ];
      resultLabels.forEach(([node, key]) => {
        if (!node) return;
        node.textContent = ginShellText(key);
        node.setAttribute("data-runtime-localize", "off");
      });
    }
    if (id === "cribbage") {
      syncCribbageShell();
      window.addEventListener("weightplay:shell-sync", syncCribbageShell);
      statusText?.setAttribute("data-runtime-localize", "off");
      const shellTitle = document.querySelector(".main-header [data-card-title]");
      if (shellTitle && !shellTitle.dataset.cribbageShellObserver) {
        shellTitle.dataset.cribbageShellObserver = "true";
        new MutationObserver(() => {
          const copy = cribbageShellCopy();
          if (shellTitle.textContent !== copy.title) ownLocalizedText(shellTitle, copy.title);
        }).observe(shellTitle, { childList: true, characterData: true, subtree: true });
      }
      window.setTimeout(syncCribbageShell, 0);
      window.setTimeout(syncCribbageShell, 400);
      window.setTimeout(syncCribbageShell, 1200);
    }
    if (id === "war") statusText?.setAttribute("data-runtime-localize", "off");
    if (id === "war") {
      syncWarShell();
      window.addEventListener("weightplay:shell-sync", syncWarShell);
    }
    if (id === "old-maid") {
      syncOldMaidShell();
      window.addEventListener("wonder:locale-change", syncOldMaidShell);
      window.addEventListener("weightplay:shell-sync", syncOldMaidShell);
      window.setTimeout(syncOldMaidShell, 0);
      statusText?.setAttribute("data-runtime-localize", "off");
    }
    if (id === "casino") {
      syncCasinoShell();
      window.addEventListener("wonder:locale-change", syncCasinoShell);
      window.addEventListener("weightplay:shell-sync", syncCasinoShell);
      window.setTimeout(syncCasinoShell, 0);
      window.setTimeout(syncCasinoShell, 400);
      statusText?.setAttribute("aria-live", "polite");
      statusText?.setAttribute("aria-atomic", "true");
    }
    rootElement.dataset.wpCardGame = id;
    const title = TITLES[id]?.[currentLocale()] || TITLES[id]?.en || id;
    document.querySelectorAll("img.cover").forEach((image) => {
      image.src = `../../assets/card-games-${id}-cover.webp`;
      image.alt = title;
    });
    document.querySelectorAll("[data-card-title]").forEach((node) => { node.textContent = title; node.setAttribute("data-runtime-localize", "off"); });
    document.querySelectorAll("[data-card-summary]").forEach((node) => { node.textContent = gameSummary(id); });
    if (id === "spades") {
      syncSpadesShell();
      window.addEventListener("weightplay:shell-sync", syncSpadesShell);
      const shellTitle = document.querySelector(".main-header [data-card-title]");
      if (shellTitle && !shellTitle.dataset.spadesShellObserver) {
        shellTitle.dataset.spadesShellObserver = "true";
        new MutationObserver(() => {
          if (shellTitle.textContent !== spadesShellCopy().title) ownLocalizedText(shellTitle, spadesShellCopy().title);
        }).observe(shellTitle, { childList: true, characterData: true, subtree: true });
      }
      window.setTimeout(syncSpadesShell, 0);
      window.setTimeout(syncSpadesShell, 400);
    }
    if (id === "hearts") {
      syncHeartsShell();
      window.addEventListener("weightplay:shell-sync", syncHeartsShell);
      const shellTitle = document.querySelector(".main-header [data-card-title]");
      if (shellTitle && !shellTitle.dataset.heartsShellObserver) {
        shellTitle.dataset.heartsShellObserver = "true";
        new MutationObserver(() => {
          const copy = heartsShellCopy();
          if (copy && shellTitle.textContent !== copy.title) ownLocalizedText(shellTitle, copy.title);
        }).observe(shellTitle, { childList: true, characterData: true, subtree: true });
      }
      window.setTimeout(syncHeartsShell, 0);
      window.setTimeout(syncHeartsShell, 400);
      window.setTimeout(syncHeartsShell, 1200);
    }
    if (localeSelect) localeSelect.value = currentLocale();
    const resultCloseButton = document.querySelector("#resultClose");
    if (id === "old-maid" && resultCloseButton) {
      resultCloseButton.textContent = t("back");
      resultCloseButton.setAttribute("aria-label", t("back"));
      resultCloseButton.dataset.cardResultReturn = "main";
    }
    if (loading) { loading.hidden = true; loading.remove(); }
    let sound = root.WPCardEngine?.SoundEngine ? new root.WPCardEngine.SoundEngine("card_games_next_sound_v1") : null;
    battleUtility?.addEventListener("click", () => {
      const next = !sound?.enabled;
      sound?.setEnabled(next);
      battleUtility.setAttribute("aria-pressed", String(next));
      battleUtility.textContent = next ? "⚙" : "🔇";
    });
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
      isBattleActive() { return !battle.hidden && rootElement.dataset.screen === "battle"; },
      openBattle() { resultRecorded = false; main.hidden = true; battle.hidden = false; rootElement.dataset.screen = "battle"; render(); window.dispatchEvent(new Event("weightplay:battle-open")); window.dispatchEvent(new Event("weightplay:battle-sync")); window.dispatchEvent(new Event("weightplay:shell-sync")); },
      openMain() { battle.hidden = true; main.hidden = false; rootElement.dataset.screen = "main"; result.hidden = true; window.scrollTo({ top: 0, left: 0, behavior: "auto" }); window.dispatchEvent(new Event("weightplay:shell-sync")); },
      result(won, message = "") {
        if (!resultRecorded) { resultRecorded = true; updateStatsView(writeStats(won)); }
        resultTitle.textContent = id === "gin-rummy" ? ginShellText(won ? "winner" : "loser") : (won ? t("winner") : t("loser"));
        resultText.textContent = message || (id === "gin-rummy" ? ginShellText("resultTitle") : t("roundOver"));
        if (id === "cribbage") {
          result.dataset.outcome = won ? "win" : "loss";
          resultText.dataset.cribbageResultMastery = message ? "true" : "false";
        }
        result.hidden = false;
        sound?.[won ? "win" : "reject"]?.();
      },
      beep(name = "place") { sound?.[name]?.(); },
    };
    const render = () => {
      if (!game) return;
      const view = game.view() || {};
      opponents.innerHTML = view.opponents || "";
      center.innerHTML = view.center || "";
      hand.innerHTML = view.hand || "";
      actions.innerHTML = view.actions || "";
      if (id === "hearts" && heartsShellCopy()) {
        [opponents, center, hand, actions, status, statusText].forEach((node) => node?.setAttribute("data-runtime-localize", "off"));
      }
      updateQuickGuide();
      if (quickGuide.textContent) actions.prepend(quickGuide);
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
    document.querySelector("#resultClose")?.addEventListener("click", () => { if (id === "old-maid") controller.openMain(); else { result.hidden = true; render(); } });
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
    // War resolves every player action synchronously. Re-rendering its action
    // row on a timer replaces the visible Flip button while a click is being
    // dispatched, so keep the polling loop only for games with delayed AI or
    // other asynchronous state transitions.
    const battleRenderTimer = id === "war" ? null : window.setInterval(() => {
      if (!battle.hidden) render();
    }, 180);
    window.addEventListener("beforeunload", () => {
      if (battleRenderTimer !== null) window.clearInterval(battleRenderTimer);
    }, { once: true });
    let mainControlAttempts = 0;
    const mainControlTimer = window.setInterval(() => { ensureMainControls(); mainControlAttempts += 1; if (document.querySelector("[data-card-main-controls]") || mainControlAttempts > 40) window.clearInterval(mainControlTimer); }, 50);
  }

  function gameSummary(id) {
    if (id === "gin-rummy") return (GIN_MAIN_COPY[currentLocale()] || GIN_MAIN_COPY.en).summary;
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

  // Keep the first-turn rule visible inside Battle. These source strings are
  // already owned by every runtime locale catalog, so the shared localizer
  // can present the same coach without duplicating ten x thirteen translations.
  const CARD_GAME_GUIDES = {
    hearts: "Choose three cards to pass, then play a legal card from your hand. The first trick starts with the Two of Clubs; the winner leads the next trick.",
    spades: "Bid the number of tricks your team expects, follow suit when possible, and use spades at the right moment to win the contract.",
    "gin-rummy": "Draw from the stock or discard, then discard one card. Knock with a low Deadwood hand or reach Gin.",
    "crazy-eights": "When no card is legal, draw. The first player to empty their hand wins.",
    cribbage: "Pairs, runs, and fifteens score points. The first player to reach 121 wins.",
    "go-fish": "Complete four-of-a-kind books. Choose two, three, or four players in the preview build.",
    war: "Press Flip to reveal, then watch the pile move. The player who collects every card wins.",
    speed: "Tap quickly and keep your hand replenished. There is no waiting for the opponent's turn.",
    "old-maid": "Pairs vanish immediately. The last player holding the special Old Maid card loses.",
    casino: "Build combinations for later capture, collect Spades, and watch for the Ten of Diamonds and Two of Spades bonuses.",
  };

  function makeFallback(controller, id) {
    return { reset() {}, view() { return { phase: TITLES[id]?.en || id, help: gameSummary(id), hand: "", opponents: "", center: "", actions: "" }; }, action() {}, card() {} };
  }

  function makeHearts(controller) {
    const s = { hands: [], scores: [0, 0, 0, 0], penaltyHearts: [0, 0, 0, 0], penaltyQueens: [0, 0, 0, 0], turn: 0, lead: 0, trick: [], heartsBroken: false, phase: "pass", selected: new Set(), passReceived: false, winner: null };
    const aiNames = heartsShellCopy()?.opponents || ["You", "Orchid", "Mango", "Nova"];
    const legal = (handCards, trick) => { const leadSuit = trick[0]?.card.suit; const following = leadSuit ? handCards.filter((item) => item.suit === leadSuit) : []; return following.length ? following : handCards.filter((item) => s.heartsBroken || (item.suit !== "hearts" && !(item.suit === "spades" && item.rank === 12)) || handCards.every((candidate) => candidate.suit === "hearts" || (candidate.suit === "spades" && candidate.rank === 12))); };
    const scoreTrick = () => { const hearts = s.trick.filter((entry) => entry.card.suit === "hearts").length; const queen = s.trick.some((entry) => entry.card.suit === "spades" && entry.card.rank === 12) ? 13 : 0; const points = hearts + queen; const winner = trickWinner(s.trick); s.scores[winner] += points; s.penaltyHearts[winner] += hearts; s.penaltyQueens[winner] += queen; if (hearts) s.heartsBroken = true; s.trick = []; s.turn = winner; s.lead = winner; return { points, winner }; };
    const finish = () => { const moon = s.scores.findIndex((score) => score === 26); if (moon >= 0) { s.scores = s.scores.map((score, index) => index === moon ? score - 26 : score + 26); } const playerWon = s.scores[0] === Math.min(...s.scores); const lesson = heartsResultText(s.penaltyHearts[0], s.penaltyQueens[0], moon >= 0); controller.result(playerWon, `${t("score")}: ${s.scores[0]} · ${t("points")}: ${s.scores.join(" / ")} · ${lesson}`); };
    const play = (player, item) => { const handCards = s.hands[player]; const index = handCards.indexOf(item); if (index < 0) return; const legalCards = legal(handCards, s.trick); if (!legalCards.includes(item)) return; if (!s.trick.length && player === 0 && s.hands[0].length === 13 && !(item.suit === "clubs" && item.rank === 2)) return; handCards.splice(index, 1); s.trick.push({ player, card: item }); if (item.suit === "hearts") s.heartsBroken = true; s.turn = (player + 1) % 4; if (s.trick.length === 4) { scoreTrick(); if (!s.hands.some((cards) => cards.length)) { finish(); return; } } if (s.turn !== 0) setTimeout(() => aiTurn(), 220); };
    const aiTurn = () => { if (s.phase !== "play" || s.turn === 0) return; const item = chooseAiCard(s.hands[s.turn], legal(s.hands[s.turn], s.trick), "low"); if (item) play(s.turn, item); };
    return {
      reset() { Object.assign(s, { hands: [[], [], [], []], scores: [0, 0, 0, 0], penaltyHearts: [0, 0, 0, 0], penaltyQueens: [0, 0, 0, 0], turn: 0, lead: 0, trick: [], heartsBroken: false, phase: "pass", selected: new Set(), passReceived: false }); deck().forEach((item, index) => s.hands[index % 4].push(item)); s.hands.forEach((cards) => cards.sort((a, b) => a.suit.localeCompare(b.suit) || a.rank - b.rank)); },
      card(index) { if (s.phase === "pass" && s.turn === 0) { if (s.selected.has(index)) s.selected.delete(index); else if (s.selected.size < 3) s.selected.add(index); } else if (s.phase === "play" && s.turn === 0) play(0, s.hands[0][index]); },
      action(action) { if (action === "pass" && s.phase === "pass" && s.selected.size === 3) { const selected = [...s.selected].sort((a, b) => b - a).map((index) => s.hands[0].splice(index, 1)[0]); selected.forEach((item) => s.hands[1].push(item)); const aiPass = s.hands[1].slice(0, 3); aiPass.forEach((item) => s.hands[1].splice(s.hands[1].indexOf(item), 1)); s.hands[0].push(...aiPass); s.hands.forEach((cards) => cards.sort((a, b) => a.suit.localeCompare(b.suit) || a.rank - b.rank)); s.phase = "play"; s.turn = s.hands.findIndex((cards) => cards.some((item) => item.suit === "clubs" && item.rank === 2)); if (s.turn !== 0) setTimeout(() => aiTurn(), 220); } },
      view() { const trickHtml = s.trick.map((entry) => `<div>${aiNames[entry.player]} ${cardMarkup(entry.card, 0)}</div>`).join(""); const action = s.phase === "pass" ? `<button class="primary-btn" data-action="pass" ${s.selected.size !== 3 ? "disabled" : ""}>${t("pass")} 3</button>` : `<p class="card-help">${s.heartsBroken ? "♥ " : ""}${t("yourTurn")}</p>`; const lead = heartsShellCopy()?.lead || "2♣ leads the first trick"; return { phase: s.phase === "pass" ? t("pass") : (s.heartsBroken ? "♥" : "♥ · " + t("waiting")), status: s.turn === 0 ? t("yourTurn") : t("aiTurn"), help: s.phase === "pass" ? heartsPassText(s.hands[0], s.selected) : heartsText(), score: s.scores[0], opponents: s.hands.slice(1).map((cards, index) => heartsOpponentMarkup(aiNames[index + 1], cards.length, `${t("points")}: ${s.scores[index + 1]}`)).join(""), center: `<div class="card-table-label">${t("table")}</div><div class="table-row">${trickHtml || `<span>${lead}</span>`}</div>`, hand: cardsMarkup(s.hands[0], { selected: s.selected, hidden: false }), actions: action }; },
    };
  }

  function makeSpades(controller) {
    const s = { hands: [[], [], [], []], bids: [null, null, null, null], tricks: [0, 0], turn: 0, trick: [], lastTrick: null, phase: "bid", scores: [0, 0] };
    const names = spadesOpponentNames();
    const legal = (cards) => { const lead = s.trick[0]?.card.suit; const suited = lead ? cards.filter((item) => item.suit === lead) : []; return suited.length ? suited : cards; };
    const finish = () => { const own = s.tricks[0] >= s.bids[0] + s.bids[2]; const enemy = s.tricks[1] >= s.bids[1] + s.bids[3]; s.scores[0] += own ? 10 * (s.bids[0] + s.bids[2]) + Math.max(0, s.tricks[0] - s.bids[0] - s.bids[2]) : -10 * (s.bids[0] + s.bids[2]); s.scores[1] += enemy ? 10 * (s.bids[1] + s.bids[3]) + Math.max(0, s.tricks[1] - s.bids[1] - s.bids[3]) : -10 * (s.bids[1] + s.bids[3]); controller.result(s.scores[0] >= s.scores[1], `${t("score")}: ${s.scores[0]} — ${s.scores[1]}`); };
    const currentWinnerEntry = () => { const winner = trickWinner(s.trick, "spades"); return s.trick.find((entry) => entry.player === winner) || null; };
    const play = (player, item) => { const cards = s.hands[player]; if (!legal(cards).includes(item)) return; if (!s.trick.length) s.lastTrick = null; cards.splice(cards.indexOf(item), 1); s.trick.push({ player, card: item }); s.turn = (player + 1) % 4; if (s.trick.length === 4) { const winningEntry = currentWinnerEntry(); const winner = winningEntry?.player; s.lastTrick = winningEntry ? { card: winningEntry.card, leadSuit: s.trick[0]?.card.suit } : null; s.tricks[winner % 2 === 0 ? 0 : 1] += 1; s.trick = []; s.turn = winner; if (!s.hands[0].length) { finish(); return; } } if (s.turn !== 0) setTimeout(aiTurn, 180); };
    const aiTurn = () => { if (s.phase !== "play" || s.turn === 0) return; play(s.turn, chooseAiCard(s.hands[s.turn], legal(s.hands[s.turn]), s.turn % 2 ? "low" : "high")); };
    return {
      reset() { Object.assign(s, { hands: [[], [], [], []], bids: [null, null, null, null], tricks: [0, 0], turn: 0, trick: [], lastTrick: null, phase: "bid", scores: [0, 0] }); deck().forEach((item, index) => s.hands[index % 4].push(item)); },
      card(index) { if (s.phase === "play" && s.turn === 0) play(0, s.hands[0][index]); },
      action(action, selected) { if (s.phase === "bid" && action === "bid") { s.bids[0] = Number(selected); s.bids[1] = 2 + Math.floor(Math.random() * 3); s.bids[2] = 2 + Math.floor(Math.random() * 4); s.bids[3] = 2 + Math.floor(Math.random() * 3); s.phase = "play"; s.turn = 0; } },
      view() {
        const bidControls = Array.from({ length: 14 }, (_, i) => `<button class="secondary-btn" data-action="bid" data-value="${i}" ${s.bids[0] !== null ? "disabled" : ""}>${i}</button>`).join("");
        const progress = s.phase === "play" ? spadesProgressText(s.tricks[0], s.bids[0] + s.bids[2]) : null;
        const liveWinner = s.trick.length ? currentWinnerEntry() : null;
        const winnerEntry = liveWinner || s.lastTrick;
        const leadSuit = s.trick[0]?.card.suit || s.lastTrick?.leadSuit;
        const settled = !s.trick.length && Boolean(s.lastTrick);
        const winnerCard = winnerEntry?.card;
        const trickCue = winnerCard ? `<div class="card-spades-trick-cue" data-spades-trick-cue data-trick-phase="${settled ? "settled" : "live"}" data-trick-led-suit="${SYMBOLS[leadSuit] || ""}" data-trick-winner-card="${cardText(winnerCard)}" data-runtime-localize="off" role="status" aria-live="polite">${spadesTrickText(leadSuit, winnerCard, settled)}</div>` : "";
        const trickHtml = s.trick.length ? s.trick.map((entry) => { const isLed = entry.card.suit === leadSuit; const isWinner = entry === liveWinner; const classes = ["card-spades-trick-card", isLed ? "is-led" : "", isWinner ? "is-winner" : ""].filter(Boolean).join(" "); return `<span class="${classes}" data-trick-led="${isLed}" data-trick-winner="${isWinner}">${cardMarkup(entry.card, 0, { className: isWinner ? "card-spades-winner-card" : "", disabled: true })}</span>`; }).join("") : s.lastTrick ? `<span class="card-spades-trick-card is-settled-winner" data-trick-led="${s.lastTrick.card.suit === leadSuit}" data-trick-winner="true" data-trick-settled="true">${cardMarkup(s.lastTrick.card, 0, { className: "card-spades-winner-card", disabled: true })}</span>` : "";
        return {
          phase: s.phase === "bid" ? t("bid") : `${t("score")}: ${s.scores[0]} / ${s.scores[1]}`,
          status: s.turn === 0 ? t("yourTurn") : t("aiTurn"),
          help: spadesText(s.phase === "bid" ? "bid" : "play"),
          score: s.scores[0],
          opponents: names.slice(1).map((name, index) => spadesOpponentMarkup(name, s.hands[index + 1].length, s.bids[index + 1] ?? "—")).join(""),
          center: `<div class="card-table-label">${t("table")} · ${s.tricks[0]} / ${s.tricks[1]}</div>${progress ? `<div class="card-spades-progress" data-progress-state="${progress.state}" data-runtime-localize="off" role="status" aria-live="polite">${progress.text}</div>` : ""}${trickCue}<div class="table-row">${trickHtml || `♠ ${t("waiting")}`}</div>`,
          hand: cardsMarkup(s.hands[0]),
          actions: s.phase === "bid" ? `<div class="card-choice-panel">${bidControls}</div>` : "",
        };
      },
    };
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
    return { reset() { const cards = deck(); Object.assign(s, { player: cards.slice(0, 26), ai: cards.slice(26), pot: [], phase: "ready", last: null, war: false, playerCard: null, aiCard: null }); }, card() {}, action(action) { if (action === "flip" && s.phase === "ready") drawBattle(); else if (action === "flip" && s.phase === "war") addWar(); }, view() { return { phase: s.war ? t("war") : t("flip"), status: t("yourTurn"), help: warGuidanceText(s.war ? "war" : "flip"), score: s.player.length, opponents: opponentMarkup("AI", s.ai.length), center: `<div class="card-table-label">${t("war")}</div><div class="table-row ${s.war ? "card-war-flash" : ""}">${s.playerCard ? cardMarkup(s.playerCard, 0) : ""}${s.aiCard ? cardMarkup(s.aiCard, 0) : ""}</div><div>${t("cards")}: ${s.pot.length}</div>`, hand: `<div class="card-help">${s.player.length} ${t("cards")}</div>`, actions: `<button class="primary-btn" data-action="flip">${s.war ? t("war") : t("flip")}</button>` }; } };
  }

  function makeWarFixed(controller) {
    const s = { player: [], ai: [], pot: [], phase: "ready", playerCard: null, aiCard: null, swingCue: "", warCount: 0, largestPot: 0 };
    const finish = (playerWins) => controller.result(playerWins, `${t("cards")}: ${s.player.length} / ${s.ai.length} · ${warResultText(s.warCount, s.largestPot)}`);
    const settle = () => {
      const playerWins = s.playerCard.rank > s.aiCard.rank;
      s.largestPot = Math.max(s.largestPot, s.pot.length);
      s.swingCue = warSwingText(playerWins ? "player" : "ai", s.pot.length);
      (playerWins ? s.player : s.ai).push(...s.pot.sort(() => Math.random() - 0.5));
      s.pot = [];
      s.phase = "ready";
      if (!s.player.length || !s.ai.length) finish(playerWins);
    };
    const reveal = () => {
      s.swingCue = "";
      if (!s.player.length || !s.ai.length) { finish(Boolean(s.player.length)); return; }
      s.playerCard = s.player.shift();
      s.aiCard = s.ai.shift();
      s.pot.push(s.playerCard, s.aiCard);
      if (s.playerCard.rank === s.aiCard.rank) { s.warCount += 1; s.phase = "war"; }
      else settle();
    };
    const continueWar = () => {
      if (s.player.length < 4 || s.ai.length < 4) {
        const playerWins = s.player.length >= 4;
        s.largestPot = Math.max(s.largestPot, s.pot.length);
        (playerWins ? s.player : s.ai).push(...s.pot);
        s.pot = [];
        finish(playerWins);
        return;
      }
      s.pot.push(...s.player.splice(0, 3), ...s.ai.splice(0, 3));
      reveal();
    };
    return {
      reset() { const cards = deck(); Object.assign(s, { player: cards.slice(0, 26), ai: cards.slice(26), pot: [], phase: "ready", playerCard: null, aiCard: null, swingCue: "", warCount: 0, largestPot: 0 }); },
      card() {},
      action(action) { if (action === "flip" && s.phase === "ready") reveal(); else if (action === "flip" && s.phase === "war") continueWar(); },
      view() { const swingCue = s.swingCue ? `<p class="card-choice-summary card-war-swing" role="status" aria-live="polite">${s.swingCue}</p>` : ""; return { phase: s.phase === "war" ? t("war") : t("flip"), status: t("yourTurn"), help: warGuidanceText(s.phase === "war" ? "war" : "flip"), score: s.player.length, opponents: opponentMarkup("AI", s.ai.length), center: `<div class="card-table-label">${t("war")}</div>${swingCue}<div class="table-row ${s.phase === "war" ? "card-war-flash" : ""}">${s.playerCard ? cardMarkup(s.playerCard, 0) : ""}${s.aiCard ? cardMarkup(s.aiCard, 0) : ""}</div><div>${t("cards")}: ${s.pot.length}</div>`, hand: `<div class="card-help">${s.player.length} ${t("cards")}</div>`, actions: `<button class="primary-btn" data-action="flip">${s.phase === "war" ? t("war") : t("flip")}</button>` }; }
    };
  }

  function makeSpeed(controller) {
    const s = { hand: [], stock: [], aiHand: [], aiStock: [], centers: [], turn: true, timer: null, over: false };
    const canPlay = (item, centerCard) => item && centerCard && (item.rank === centerCard.rank + 1 || item.rank === centerCard.rank - 1 || (item.rank === 1 && centerCard.rank === 13) || (item.rank === 13 && centerCard.rank === 1));
    const refill = () => { while (s.hand.length < 5 && s.stock.length) s.hand.push(s.stock.pop()); while (s.aiHand.length < 5 && s.aiStock.length) s.aiHand.push(s.aiStock.pop()); };
    const check = () => { if ((!s.hand.length && !s.stock.length) || (!s.aiHand.length && !s.aiStock.length)) { s.over = true; controller.result(!s.hand.length && !s.stock.length, `${t("cards")}: ${s.hand.length + s.stock.length} / ${s.aiHand.length + s.aiStock.length}`); clearTimeout(s.timer); } };
    const aiLoop = () => { if (s.over) return; const candidates = s.aiHand.flatMap((item, index) => s.centers.map((centerCard, centerIndex) => canPlay(item, centerCard) ? { item, index, centerIndex } : [])); if (candidates.length) { const pick = candidates[Math.floor(Math.random() * candidates.length)]; s.aiHand.splice(pick.index, 1); s.centers[pick.centerIndex] = pick.item; refill(); } else if (s.aiStock.length) { s.centers[0] = s.stock.length ? s.stock.pop() : s.centers[0]; s.centers[1] = s.aiStock.pop(); } check(); s.timer = setTimeout(aiLoop, 420); };
    return { reset() { const cards = deck(); Object.assign(s, { hand: cards.splice(0, 20), stock: cards.splice(0, 6), aiHand: cards.splice(0, 20), aiStock: cards, centers: [deck()[0], deck()[1]], turn: true, over: false }); refill(); clearTimeout(s.timer); s.timer = setTimeout(aiLoop, 420); }, card(index) { if (s.over) return; const item = s.hand[index]; const centerIndex = s.centers.findIndex((centerCard) => canPlay(item, centerCard)); if (centerIndex < 0) return; s.hand.splice(index, 1); s.centers[centerIndex] = item; refill(); check(); }, action() {}, view() { const legalCount = s.hand.filter((item) => s.centers.some((centerCard) => canPlay(item, centerCard))).length; return { phase: "Speed", status: t("yourTurn"), help: speedCoachText(legalCount), score: s.hand.length + s.stock.length, opponents: opponentMarkup("AI", s.aiHand.length + s.aiStock.length), center: `<div class="card-speed-lane"><div class="card-speed-pile">${cardMarkup(s.centers[0], 0)}</div><div class="card-speed-pile">${cardMarkup(s.centers[1], 0)}</div></div>`, hand: cardsMarkup(s.hand), actions: `<span class="card-help">${s.stock.length} ${t("stock")} · ${s.aiStock.length} ${t("cards")} ${t("waiting")}</span>` }; } };
  }

  function makeOldMaid(controller) {
    const s = { players: [[], [], [], []], turn: 0, selected: 0, books: [0, 0, 0, 0], over: false };
    const names = OLD_MAID_NAMES[currentLocale()] || OLD_MAID_NAMES.en;
    const oldMaidOpponentMarkup = (name, count, extra = "") => `<div class="opponent-card"><strong data-runtime-localize="off">${name}</strong><span>${count} ${t("cards")}${extra ? ` · ${extra}` : ""}</span></div>`;
    const pair = (player) => { const byRank = new Map(); s.players[player].forEach((item, index) => { const list = byRank.get(item.rank) || []; list.push(index); byRank.set(item.rank, list); }); [...byRank.values()].filter((list) => list.length >= 2).forEach((list) => { const indexes = list.slice(0, 2).sort((a, b) => b - a); indexes.forEach((index) => s.players[player].splice(index, 1)); s.books[player] += 1; }); };
    const finishIfDone = () => { const active = s.players.filter((cards) => cards.length); if (active.length <= 1) { const loser = s.players.findIndex((cards) => cards.length); controller.result(loser !== 0, loser === 0 ? t("oldMaid") : `${names[loser]} ${t("oldMaid")}`); s.over = true; } };
    const next = () => { s.turn = (s.turn + 1) % 4; while (!s.players[s.turn].length && s.players.some((cards) => cards.length)) s.turn = (s.turn + 1) % 4; if (s.turn !== 0) setTimeout(aiTurn, 320); };
    const drawFrom = (player, index) => { const target = (player + 1) % 4; const source = s.players[target]; if (!source.length) return; const item = source.splice(Math.min(index, source.length - 1), 1)[0]; s.players[player].push(item); pair(player); finishIfDone(); if (!s.over) next(); };
    const aiTurn = () => { if (s.turn === 0 || s.over) return; drawFrom(s.turn, Math.floor(Math.random() * s.players[(s.turn + 1) % 4].length)); };
    return { reset() { const cards = deck(); const oldMaidIndex = cards.findIndex((item) => item.suit === "spades" && item.rank === 12); const oldMaid = cards.splice(oldMaidIndex, 1)[0]; oldMaid.oldMaid = true; Object.assign(s, { players: [[], [], [], []], turn: 0, selected: 0, books: [0, 0, 0, 0], over: false }); cards.push(oldMaid); cards.forEach((item, index) => s.players[index % 4].push(item)); s.players.forEach(pair); }, card(index) { if (s.turn === 0 && !s.over) drawFrom(0, index); }, action() {}, view() { const target = s.players[1]; return { phase: t("oldMaid"), status: s.turn === 0 ? t("yourTurn") : t("aiTurn"), help: oldMaidText("help", { name: names[(s.turn + 1) % 4] }), score: s.books[0], opponents: names.slice(1).map((name, index) => oldMaidOpponentMarkup(name, s.players[index + 1].length, `${s.books[index + 1]} ${t("pairs")}`)).join(""), center: `<div class="card-table-label">${t("oldMaid")}</div><div class="table-row">${target.map((_, index) => cardMarkup({ faceDown: true }, index)).join("")}</div>`, hand: cardsMarkup(s.players[0]), actions: "" }; } };
  }

  function makeCasino(controller) {
    const s = { player: [], ai: [], stock: [], table: [], captured: [[], []], selectedCard: null, selectedTable: new Set(), phase: "play", score: [0, 0], feedback: "" };
    const tableValue = (entry) => entry.buildValue || value(entry.card);
    const entryCards = (entry) => entry?.buildCards?.length ? entry.buildCards : [entry?.card].filter(Boolean);
    const combinations = (items, target) => { const output = []; const walk = (start, chosen, total) => { if (total === target && chosen.length) output.push(chosen.slice()); if (total >= target) return; for (let i = start; i < items.length; i += 1) walk(i + 1, [...chosen, i], total + tableValue(items[i])); }; walk(0, [], 0); return output; };
    const captureOptions = (item) => {
      if (!item) return { rankMatches: [], sumCombos: [], candidates: [] };
      const target = value(item);
      const rankMatches = s.table.map((entry, index) => tableValue(entry) === target ? index : -1).filter((index) => index >= 0);
      const sumCombos = combinations(s.table, target).filter((combo) => combo.length > 1);
      const candidates = [...new Set([...rankMatches, ...sumCombos.flat()])];
      return { rankMatches, sumCombos, candidates };
    };
    const canCapture = (item) => { const options = captureOptions(item); return Boolean(item && (options.rankMatches.length || options.sumCombos.length)); };
    const immediateBonus = (cards) => cards.reduce((total, item) => total + (item.suit === "spades" ? 1 : 0) + (item.suit === "diamonds" && item.rank === 10 ? 2 : 0) + (item.suit === "spades" && item.rank === 2 ? 2 : 0), 0);
    const specialBonusSummary = (cards) => {
      const parts = [];
      if (cards.some((item) => item.suit === "diamonds" && item.rank === 10)) parts.push(casinoText("specialTen"));
      if (cards.some((item) => item.suit === "spades" && item.rank === 2)) parts.push(casinoText("specialTwo"));
      const ordinarySpades = cards.filter((item) => item.suit === "spades" && item.rank !== 2).length;
      if (ordinarySpades) parts.push(casinoText("specialSpade", { count: ordinarySpades, bonus: ordinarySpades }));
      return parts.length ? parts.join(" · ") : casinoText("specialNone");
    };
    const capture = (indices, cardIndex) => { const item = s.player.splice(cardIndex, 1)[0]; const picked = indices.map((index) => s.table[index]); const capturedCards = [item, ...picked.flatMap(entryCards)]; s.table = s.table.filter((_, index) => !indices.includes(index)); s.captured[0].push(...capturedCards); s.feedback = casinoText("captureFeedback", { count: capturedCards.length, special: specialBonusSummary(capturedCards), bonus: immediateBonus(capturedCards) }); s.selectedCard = null; s.selectedTable.clear(); aiTurn(); };
    const trail = (cardIndex) => { const item = s.player[cardIndex]; if (!item || s.selectedTable.size || canCapture(item)) return; s.player.splice(cardIndex, 1); s.table.push({ card: item }); s.selectedCard = null; s.selectedTable.clear(); aiTurn(); };
    const scoreCasino = (cards) => cards.reduce((score, item) => score + (item.suit === "spades" ? 1 : 0) + (item.suit === "diamonds" && item.rank === 10 ? 2 : 0) + (item.suit === "spades" && item.rank === 2 ? 2 : 0), 0) + (cards.length >= 27 ? 3 : 0);
    const resultBreakdown = (cards) => casinoText("resultBreakdown", { cards: cards.length, immediate: immediateBonus(cards), majority: cards.length >= 27 ? "+3" : "—", score: scoreCasino(cards) });
    const finish = () => { const playerScore = scoreCasino(s.captured[0]); const aiScore = scoreCasino(s.captured[1]); controller.result(playerScore >= aiScore, `${t("score")}: ${playerScore} / ${aiScore} · ${resultBreakdown(s.captured[0])}`); };
    const dealNextHand = () => { for (let i = 0; i < 4 && s.stock.length; i += 1) { s.player.push(s.stock.pop()); if (s.stock.length) s.ai.push(s.stock.pop()); } };
    const aiTurn = () => { if (!s.ai.length) { if (s.stock.length) dealNextHand(); else { finish(); return; } } const aiCard = s.ai.pop(); const same = s.table.map((entry, index) => ({ entry, index })).filter(({ entry }) => tableValue(entry) === value(aiCard)); const combo = combinations(s.table, value(aiCard))[0]; if (same.length || combo) { const indices = same.length ? same.map((entry) => entry.index) : combo; s.captured[1].push(aiCard, ...indices.flatMap((index) => entryCards(s.table[index]))); s.table = s.table.filter((_, index) => !indices.includes(index)); } else s.table.push({ card: aiCard }); if (!s.ai.length && s.stock.length) dealNextHand(); if (!s.stock.length && (!s.ai.length || !s.player.length)) finish(); };
    return {
      reset() {
        Object.assign(s, { player: [], ai: [], stock: deck(), table: [], captured: [[], []], selectedCard: null, selectedTable: new Set(), phase: "play", score: [0, 0], feedback: "" });
        for (let i = 0; i < 4; i += 1) { s.player.push(s.stock.pop()); s.ai.push(s.stock.pop()); s.table.push({ card: s.stock.pop() }); }
      },
      card(index) {
        if (s.selectedCard === null) { s.selectedCard = index; return; }
        const tableIndex = index;
        if (tableIndex < s.table.length) {
          if (s.selectedTable.has(tableIndex)) s.selectedTable.delete(tableIndex);
          else s.selectedTable.add(tableIndex);
        }
      },
      action(action) {
        if (action === "clear-selection") { s.selectedCard = null; s.selectedTable.clear(); }
        if (action === "capture" && s.selectedCard !== null) {
          const indices = [...s.selectedTable];
          const item = s.player[s.selectedCard];
          const valid = indices.length && (indices.some((index) => tableValue(s.table[index]) === value(item)) || combinations(s.table, value(item)).some((combo) => combo.length === indices.length && combo.every((index) => indices.includes(index))));
          if (valid) capture(indices, s.selectedCard);
        }
        if (action === "trail" && s.selectedCard !== null) trail(s.selectedCard);
        if (action === "build" && s.selectedCard !== null && s.selectedTable.size) {
          const indices = [...s.selectedTable];
          const item = s.player[s.selectedCard];
          const builtValue = value(item) + indices.reduce((total, index) => total + tableValue(s.table[index]), 0);
          if (!item || builtValue > 10) return;
          s.player.splice(s.selectedCard, 1);
          const built = { card: item, buildValue: builtValue, buildCards: [item, ...indices.flatMap((index) => entryCards(s.table[index]))] };
          s.table = s.table.filter((_, index) => !indices.includes(index));
          s.table.push(built);
          s.selectedCard = null;
          s.selectedTable.clear();
          aiTurn();
        }
      },
      view() {
        const selectedItem = s.selectedCard === null ? null : s.player[s.selectedCard];
        const options = captureOptions(selectedItem);
        const trailReady = selectedItem && !s.selectedTable.size && !canCapture(selectedItem);
        const candidateIndexes = new Set(options.candidates);
        const tableMarkup = s.table.map((entry, index) => {
          const candidateClass = candidateIndexes.has(index) ? " is-capture-candidate" : "";
          if (entry.buildValue) return `<span class="card-build${candidateClass}">${entry.buildCards.map((item) => cardMarkup(item, index, { className: candidateIndexes.has(index) ? "is-capture-candidate" : "" })).join("")}<small>=${entry.buildValue}</small></span>`;
          return cardMarkup(entry.card, index, { selected: s.selectedTable.has(index), className: candidateIndexes.has(index) ? "is-capture-candidate" : "" });
        }).join("");
        const captureHint = selectedItem && options.candidates.length
          ? `<p class="card-choice-summary card-casino-capture-hint" role="status" aria-live="polite">${casinoText("captureHint", { value: value(selectedItem), rank: options.rankMatches.length, sum: options.sumCombos.length })}</p>`
          : "";
        const selectedBuildCards = selectedItem && s.selectedTable.size
          ? [selectedItem, ...[...s.selectedTable].flatMap((index) => entryCards(s.table[index]))]
          : [];
        const selectedBuildValue = selectedItem && s.selectedTable.size
          ? value(selectedItem) + [...s.selectedTable].reduce((total, index) => total + tableValue(s.table[index]), 0)
          : null;
        const buildPreview = selectedBuildCards.length > 1
          ? `<p class="card-choice-summary card-casino-build-preview" role="status" aria-live="polite" aria-atomic="true">${casinoText("buildPreview", { cards: selectedBuildCards.map(cardText).join(" + "), value: selectedBuildValue })}</p>`
          : "";
        const buildUnavailable = selectedBuildValue > 10
          ? `<p class="card-choice-summary card-casino-build-unavailable" role="status" aria-live="polite" aria-atomic="true">${casinoText("buildUnavailable", { value: selectedBuildValue })}</p>`
          : "";
        const selectedBuildEntry = selectedItem && [...s.selectedTable]
          .map((index) => s.table[index])
          .find((entry) => entry?.buildValue && tableValue(entry) === value(selectedItem));
        const selectedBuildCue = selectedBuildEntry
          ? `<p class="card-choice-summary card-casino-build-intent" role="status" aria-live="polite" aria-atomic="true">${casinoText("existingBuildChoice", { cards: entryCards(selectedBuildEntry).map(cardText).join(" + "), value: selectedBuildEntry.buildValue, hand: cardText(selectedItem), newValue: value(selectedItem) + selectedBuildEntry.buildValue })}</p>`
          : "";
        const payoffCue = s.feedback
          ? `<p class="card-choice-summary card-casino-payoff" role="status" aria-live="polite" aria-atomic="true"><strong>${casinoText("capturePayoffLabel")}</strong><span>${s.feedback}</span></p>`
          : "";
        return {
          phase: t("capture"),
          status: t("yourTurn"),
          help: s.feedback || (selectedItem ? (trailReady ? casinoText("trailPrompt") : `${t("selectCards")}: ${cardText(selectedItem)} · ${s.selectedTable.size}`) : casinoText("selectPrompt")),
          score: s.captured[0].length,
          opponents: opponentMarkup("AI", s.ai.length, `${t("cards")}: ${s.captured[1].length}`),
          center: `<div class="card-table-label">${t("table")}</div>${captureHint}${selectedBuildCue}${buildPreview}${buildUnavailable}${payoffCue}<div class="table-row">${tableMarkup}</div>`,
          hand: cardsMarkup(s.player, { selected: new Set(s.selectedCard === null ? [] : [s.selectedCard]) }),
          actions: `<button class="primary-btn" data-action="capture" ${s.selectedCard === null || !s.selectedTable.size ? "disabled" : ""}>${t("capture")}</button><button class="secondary-btn" data-action="build" ${s.selectedCard === null || !s.selectedTable.size || selectedBuildValue > 10 ? "disabled" : ""}>${t("build")}</button><button class="secondary-btn" data-action="trail" ${!trailReady ? "disabled" : ""}>${casinoText("trail")}</button><button class="secondary-btn" data-action="clear-selection">${t("close")}</button>`
        };
      }
    };
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
    const s = { hands: [[], [], [], []], stock: [], discard: [], activeSuit: null, pendingSuit: false, turn: 0, playerDraws: 0, playerWildSuit: null, playerWildSuitCards: 0 };
    const names = ["You", "AI North", "AI East", "AI West"];
    const legal = (item) => item && (item.rank === 8 || item.suit === s.activeSuit || item.rank === s.discard.at(-1)?.rank);
    const draw = (player) => { if (s.stock.length) { s.hands[player].push(s.stock.pop()); if (player === 0) s.playerDraws += 1; } };
    const wildSuitName = (suit) => {
      const copy = CRAZY_EIGHTS_COPY[currentLocale()] || CRAZY_EIGHTS_COPY.en;
      const index = SUITS.indexOf(suit);
      return `${copy.suits[index] || suit} ${SYMBOLS[suit] || ""}`.trim();
    };
    const resultBreakdown = () => {
      const summary = crazyEightsResultText("summary", { cards: s.hands[0].length, draws: s.playerDraws });
      const wild = s.playerWildSuit
        ? crazyEightsResultText("wild", { suit: wildSuitName(s.playerWildSuit), kept: s.playerWildSuitCards })
        : crazyEightsResultText("noWild");
      return `${summary} · ${wild}`;
    };
    const finish = (player) => controller.result(player === 0, `${names[player]} — ${s.hands[player].length} ${t("cards")} · ${resultBreakdown()}`);
    const suitPreview = () => {
      const copy = CRAZY_EIGHTS_COPY[currentLocale()] || CRAZY_EIGHTS_COPY.en;
      const counts = SUITS.map((suit, index) => `${copy.suits[index]} ${s.hands[0].filter((item) => item.suit === suit && item.rank !== 8).length}`).join(" · ");
      return crazyEightsText("summary", { counts });
    };
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
      reset() { Object.assign(s, { hands: [[], [], [], []], stock: deck(), discard: [], activeSuit: null, pendingSuit: false, turn: 0, playerDraws: 0, playerWildSuit: null, playerWildSuitCards: 0 }); for (let i = 0; i < 5; i += 1) s.hands.forEach((cards) => cards.push(s.stock.pop())); s.discard.push(s.stock.pop()); s.activeSuit = s.discard[0].suit; },
      card(index) { if (s.turn === 0 && !s.pendingSuit) play(0, s.hands[0][index]); },
      action(action, selected) { if (action === "draw" && s.turn === 0 && !s.pendingSuit) { draw(0); const drawn = s.hands[0].at(-1); if (legal(drawn)) play(0, drawn); } if (action === "suit" && s.turn === 0 && s.pendingSuit) { s.activeSuit = selected; s.playerWildSuit = selected; s.playerWildSuitCards = s.hands[0].filter((item) => item.suit === selected && item.rank !== 8).length; s.pendingSuit = false; next(); } },
      view() { return { phase: `${t("play")} ${SYMBOLS[s.activeSuit] || "8"}`, status: s.turn === 0 ? t("yourTurn") : t("aiTurn"), help: s.pendingSuit ? t("chooseSuit") : `${t("play")}: ${rankText(s.discard.at(-1).rank)}${SYMBOLS[s.activeSuit]}`, score: s.hands[0].length, opponents: names.slice(1).map((name, index) => opponentMarkup(name, s.hands[index + 1].length)).join(""), center: `<div class="card-table-label">${t("discard")}</div><div class="table-row">${cardMarkup(s.discard.at(-1), 0)}${s.stock.length ? `<button class="playing-card is-face-down" data-action="draw" aria-label="${t("draw")}"></button>` : ""}</div>${s.pendingSuit ? `<p class="card-choice-summary" role="status" aria-live="polite">${suitPreview()}</p><div class="card-choice-panel">${SUITS.map((suit) => `<button class="secondary-btn" data-action="suit" data-value="${suit}">${SYMBOLS[suit]}</button>`).join("")}</div>` : ""}`, hand: cardsMarkup(s.hands[0]), actions: `<button class="secondary-btn" data-action="draw" ${s.pendingSuit ? "disabled" : ""}>${t("draw")}</button>` }; }
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
    const finish = (winner, reasonKey) => {
      s.over = true;
      s.score[winner] += 1;
      const playerStats = meldStats(s.player);
      const aiStats = meldStats(s.ai);
      controller.result(winner === 0, ginResultText(reasonKey, {
        meldCards: playerStats.meldCards,
        deadwood: playerStats.deadwood,
        aiDeadwood: aiStats.deadwood,
        playerScore: s.score[0],
        aiScore: s.score[1],
      }));
    };
    const drawCard = (fromDiscard) => { const item = fromDiscard ? s.discard.pop() : s.stock.pop(); if (item) { s.player.push(item); s.drawn = true; } };
    const chooseAiDiscard = () => { let bestIndex = 0; let bestDeadwood = -1; s.ai.forEach((_, index) => { const candidate = s.ai.filter((__, itemIndex) => itemIndex !== index); const deadwood = meldStats(candidate).deadwood; if (deadwood > bestDeadwood) { bestDeadwood = deadwood; bestIndex = index; } }); return bestIndex; };
    const aiTurn = () => { if (s.turn !== 1 || s.over) return; if (s.discard.length && Math.random() > .45) s.ai.push(s.discard.pop()); else if (s.stock.length) s.ai.push(s.stock.pop()); const discardIndex = chooseAiDiscard(); const discarded = s.ai.splice(discardIndex, 1)[0]; if (discarded) s.discard.push(discarded); const stats = meldStats(s.ai); if (stats.deadwood === 0) finish(1, "gin"); else if (stats.deadwood <= 10) finish(1, "knock"); else if (!s.stock.length) { const playerStats = meldStats(s.player); finish(playerStats.deadwood <= stats.deadwood ? 0 : 1, "stock"); } else { s.turn = 0; s.drawn = false; } };
    const discardMarkup = () => s.discard.at(-1)
      ? cardMarkup(s.discard.at(-1), 0, { runtimeLocalizeOff: true })
      : `<span class="card-empty-slot" data-runtime-localize="off" role="status">${ginBattleText("emptyDiscard")}</span>`;
    return {
      reset() { Object.assign(s, { player: [], ai: [], stock: deck(), discard: [], turn: 0, drawn: false, selected: new Set(), score: [0, 0], over: false }); for (let i = 0; i < 10; i += 1) { s.player.push(s.stock.pop()); s.ai.push(s.stock.pop()); } s.discard.push(s.stock.pop()); },
      card(index) { if (s.turn === 0 && s.drawn && !s.over) { s.selected = s.selected.has(index) ? new Set() : new Set([index]); } },
      action(action) { if (s.turn !== 0 || s.over) return; if (action === "draw-stock" && !s.drawn) drawCard(false); if (action === "draw-discard" && !s.drawn) drawCard(true); if (action === "discard" && s.drawn && s.selected.size === 1) { const index = [...s.selected][0]; const discarded = s.player.splice(index, 1)[0]; if (discarded) s.discard.push(discarded); s.selected.clear(); const stats = meldStats(s.player); if (stats.deadwood === 0) finish(0, "gin"); else if (!s.stock.length) { const aiStats = meldStats(s.ai); finish(stats.deadwood <= aiStats.deadwood ? 0 : 1, "stock"); } else { s.turn = 1; s.drawn = false; setTimeout(aiTurn, 320); } } if (action === "knock" && s.drawn) { const stats = meldStats(s.player); if (stats.deadwood <= 10) { const aiStats = meldStats(s.ai); finish(stats.deadwood <= aiStats.deadwood ? 0 : 1, stats.deadwood === 0 ? "gin" : "knock"); } } },
      view() {
        const stats = meldStats(s.player);
        const pathState = stats.deadwood === 0 ? "is-gin" : stats.deadwood <= 10 ? "is-ready" : "";
        const plan = s.drawn ? `<div class="card-gin-plan" data-gin-plan data-runtime-localize="off" role="status" aria-live="polite">${ginPlanText(s.player, stats.deadwood)}</div>` : "";
        const phase = s.turn === 0 ? (s.drawn ? ginBattleText("discard") : ginBattleText("draw")) : t("aiTurn");
        const help = `${ginBattleText("meldCards")}: ${stats.meldCards} · ${ginBattleText("deadwood")}: ${stats.deadwood}`;
        const tableLabel = `${ginBattleText("stock")} · ${s.stock.length} · ${ginBattleText("discard")}`;
        const stockButton = `<button class="playing-card is-face-down" data-action="draw-stock" data-runtime-localize="off" aria-label="${ginBattleText("stock")}"${!s.stock.length ? " disabled" : ""}></button>`;
        const actions = `<button class="secondary-btn" data-action="draw-stock" data-runtime-localize="off"${s.drawn || !s.stock.length ? " disabled" : ""}>${ginBattleText("draw")} ${ginBattleText("stock")}</button><button class="secondary-btn" data-action="draw-discard" data-runtime-localize="off"${s.drawn ? " disabled" : ""}>${ginBattleText("draw")} ${ginBattleText("discard")}</button><button class="primary-btn" data-action="discard" data-runtime-localize="off"${!s.drawn || s.selected.size !== 1 ? " disabled" : ""}>${ginBattleText("discardAction")}</button><button class="secondary-btn" data-action="knock" data-runtime-localize="off"${!s.drawn || stats.deadwood > 10 ? " disabled" : ""}>${ginBattleText("knock")}</button>`;
        return { phase, status: s.turn === 0 ? t("yourTurn") : t("aiTurn"), help, score: s.score[0], opponents: opponentMarkup("AI", s.ai.length, t("score") + ": " + s.score[1]), center: `<div class="card-table-label" data-runtime-localize="off">${tableLabel}</div><div class="card-gin-path ${pathState}" data-runtime-localize="off" role="status" aria-live="polite">${ginPathText(stats.deadwood)}</div>${plan}<div class="table-row">${stockButton}${discardMarkup()}</div>`, hand: cardsMarkup(s.player, { selected: s.selected }), actions };
      }
    };
  }

  function makeCribbageFixed(controller) {
    const s = { hand: [], ai: [], crib: [], playerCrib: [], stock: [], starter: null, playerPeg: [], aiPeg: [], pegSequence: [], roundPegScore: [0, 0], count: 0, turn: 0, phase: "discard", score: [0, 0], selected: new Set(), passed: [false, false], lastPegPlayer: null, resetCue: "", pegCue: "", round: 1, dealer: 1 };
    const combinations = (cards, target) => { let points = 0; const total = 1 << cards.length; for (let mask = 1; mask < total; mask += 1) { const chosen = cards.filter((_, index) => mask & (1 << index)); if (sum(chosen) === target) points += 2; } return points; };
    const scoreCards = (cards, isCrib = false) => {
      let points = combinations(cards, 15);
      const counts = new Map();
      cards.forEach((item) => counts.set(item.rank, (counts.get(item.rank) || 0) + 1));
      counts.forEach((count) => { if (count >= 2) points += (count * (count - 1)); });
      let longestRun = 0;
      let runPoints = 0;
      for (let mask = 1; mask < 1 << cards.length; mask += 1) {
        const ranks = cards.filter((_, index) => mask & (1 << index)).map((item) => item.rank).sort((a, b) => a - b);
        if (ranks.length < 3 || new Set(ranks).size !== ranks.length || ranks.some((rank, index) => index && rank !== ranks[index - 1] + 1)) continue;
        if (ranks.length > longestRun) { longestRun = ranks.length; runPoints = ranks.length; }
        else if (ranks.length === longestRun) runPoints += ranks.length;
      }
      points += runPoints;
      const firstFour = cards.slice(0, -1);
      const starter = cards.at(-1);
      if (firstFour.length >= 4 && firstFour.every((item) => item.suit === firstFour[0].suit)) {
        if (isCrib) points += starter?.suit === firstFour[0].suit ? 5 : 0;
        else points += 4 + (starter?.suit === firstFour[0].suit ? 1 : 0);
      }
      if (starter && firstFour.some((item) => item.rank === 11 && item.suit === starter.suit)) points += 1;
      return points;
    };
    const legalPeg = (player) => (player === 0 ? s.hand : s.ai).filter((item) => s.count + value(item) <= 31);
    const finish = () => { if (s.score[0] >= 121 || s.score[1] >= 121) { controller.result(s.score[0] >= s.score[1], `${t("score")}: ${s.score[0]} / ${s.score[1]} · ${cribbageResultMasteryText(s.roundPegScore[0])}`); return true; } return false; };
    const scorePegCard = (player, item) => {
      (player === 0 ? s.playerPeg : s.aiPeg).push(item);
      s.pegSequence.push(item);
      let points = 0;
      const reasons = [];
      const nextCount = s.count + value(item);
      if (nextCount === 15) { points += 2; reasons.push({ key: "fifteen" }); }
      if (nextCount === 31) { points += 2; reasons.push({ key: "thirtyOne" }); }
      let sameRank = 1;
      for (let index = s.pegSequence.length - 2; index >= 0 && s.pegSequence[index].rank === item.rank; index -= 1) sameRank += 1;
      if (sameRank === 2) { points += 2; reasons.push({ key: "pair" }); }
      if (sameRank === 3) { points += 6; reasons.push({ key: "three" }); }
      if (sameRank >= 4) { points += 12; reasons.push({ key: "four" }); }
      for (let length = Math.min(7, s.pegSequence.length); length >= 3; length -= 1) {
        const ranks = s.pegSequence.slice(-length).map((cardItem) => cardItem.rank);
        if (new Set(ranks).size === length && Math.max(...ranks) - Math.min(...ranks) === length - 1) { points += length; reasons.push({ key: "run", length }); break; }
      }
      s.score[player] += points;
      s.roundPegScore[player] += points;
      s.pegCue = cribPeggingScoreText(points, reasons, nextCount);
    };
    const settleRound = () => {
      const nonDealer = 1 - s.dealer;
      const hands = [s.roundPlayerHand, s.roundAiHand];
      s.score[nonDealer] += scoreCards([...hands[nonDealer], s.starter]);
      if (finish()) return;
      s.score[s.dealer] += scoreCards([...hands[s.dealer], s.starter]);
      if (finish()) return;
      s.score[s.dealer] += scoreCards([...s.crib, s.starter], true);
      if (!finish()) startRound();
    };
    const scheduleTurn = (player) => { s.turn = player; if (player === 1) setTimeout(aiPeg, 240); };
    const resetPegCount = (leader, reason = "go") => {
      s.count = 0;
      s.pegSequence = [];
      s.passed = [false, false];
      if (!s.hand.length && !s.ai.length) { settleRound(); return; }
      s.resetCue = cribPeggingResetText(reason);
      const availableLeader = (leader === 0 ? s.hand : s.ai).length ? leader : 1 - leader;
      scheduleTurn(availableLeader);
    };
    const passPeg = (player) => {
      if (player === 0) s.resetCue = "";
      if (legalPeg(player).length) return;
      s.passed[player] = true;
      const other = 1 - player;
      if (legalPeg(other).length) { scheduleTurn(other); return; }
      if (s.lastPegPlayer !== null && s.count < 31) { s.score[s.lastPegPlayer] += 1; s.roundPegScore[s.lastPegPlayer] += 1; s.pegCue = cribPeggingGoText(); if (finish()) return; }
      resetPegCount(s.lastPegPlayer === null ? other : 1 - s.lastPegPlayer, "go");
    };
    const playPeg = (player, item) => {
      if (player === 0) s.resetCue = "";
      if (!item || s.count + value(item) > 31) { passPeg(player); return; }
      const hand = player === 0 ? s.hand : s.ai;
      const index = hand.indexOf(item);
      if (index < 0) return;
      hand.splice(index, 1);
      scorePegCard(player, item);
      s.count += value(item);
      s.lastPegPlayer = player;
      s.passed[player] = false;
      if (finish()) return;
      if (s.count === 31) { resetPegCount(1 - player, "thirtyOne"); return; }
      if (!s.hand.length && !s.ai.length) { s.score[player] += 1; if (!finish()) settleRound(); return; }
      scheduleTurn(1 - player);
    };
    const aiPeg = () => { if (s.phase !== "pegging" || s.turn !== 1) return; const item = legalPeg(1).sort((a, b) => b.rank - a.rank)[0]; if (item) playPeg(1, item); else passPeg(1); };
    function startRound() { const cards = deck(); const round = s.round + 1; Object.assign(s, { hand: [], ai: [], crib: [], playerCrib: [], stock: cards, starter: null, playerPeg: [], aiPeg: [], pegSequence: [], roundPegScore: [0, 0], count: 0, turn: 0, phase: "discard", selected: new Set(), passed: [false, false], lastPegPlayer: null, resetCue: "", pegCue: "", round, dealer: round % 2 === 1 ? 1 : 0 }); for (let i = 0; i < 6; i += 1) { s.hand.push(s.stock.pop()); s.ai.push(s.stock.pop()); } }
    return {
      reset() { Object.assign(s, { score: [0, 0], round: 0, dealer: 0 }); startRound(); },
      card(index) { if (s.phase === "discard" && s.turn === 0) { if (s.selected.has(index)) s.selected.delete(index); else if (s.selected.size < 2) s.selected.add(index); } else if (s.phase === "pegging" && s.turn === 0) playPeg(0, s.hand[index]); },
      action(action) { if (action === "send-crib" && s.phase === "discard" && s.selected.size === 2) { const selectedCards = [...s.selected].sort((a, b) => a - b).map((index) => s.hand[index]).filter(Boolean); s.playerCrib = selectedCards; [...s.selected].sort((a, b) => b - a).forEach((index) => s.crib.push(s.hand.splice(index, 1)[0])); s.selected.clear(); s.crib.push(...s.ai.splice(0, 2)); s.roundPlayerHand = [...s.hand]; s.roundAiHand = [...s.ai]; s.starter = s.stock.pop(); s.phase = "pegging"; s.playerPeg = []; s.aiPeg = []; s.pegSequence = []; s.count = 0; s.passed = [false, false]; s.lastPegPlayer = null; s.resetCue = ""; s.pegCue = ""; if (s.starter.rank === 11) { s.score[s.dealer] += 2; if (finish()) return; } scheduleTurn(1 - s.dealer); } if (action === "go" && s.phase === "pegging" && s.turn === 0) passPeg(0); },
      view() { const playable = legalPeg(0); const resetCue = s.resetCue ? `<div class="card-crib-transition card-crib-reset" role="status" aria-live="polite">${s.resetCue}</div>` : ""; const choiceCue = s.playerCrib.length === 2 && s.starter ? `<span class="card-crib-choice-plan">${cribChoicePayoffText(s.playerCrib, s.starter, s.dealer)}</span>` : ""; const pegCue = s.phase === "pegging" && s.pegCue ? `<div class="card-crib-score-cue" role="status" aria-live="polite">${s.pegCue}</div>` : ""; return { phase: s.phase === "discard" ? t("selectCards") : `${t("score")}: ${s.count}/31`, status: s.turn === 0 ? t("yourTurn") : t("aiTurn"), help: s.phase === "discard" ? cribbageSelectionText(s.selected.size) : s.turn === 0 ? cribPeggingCoachText(playable.length > 0) : t("aiTurn"), score: s.score[0], opponents: opponentMarkup("AI", s.ai.length, `${t("score")}: ${s.score[1]}`), center: `<div class="card-table-label">${t("cribbage")} · Round ${s.round} · ${s.starter ? cardText(s.starter) : ""}</div>${s.phase === "pegging" ? `<div class="card-crib-transition" role="status" aria-live="polite">${cribTransitionText(s.starter, s.dealer)} ${choiceCue}</div>${resetCue}` : ""}${makePegBoard(s.score[0], s.score[1])}<div class="table-row">${cardsMarkup(s.playerPeg)}${cardsMarkup(s.aiPeg)}</div>${pegCue}`, hand: cardsMarkup(s.hand, { selected: s.selected }), actions: s.phase === "discard" ? `<button class="primary-btn" data-action="send-crib" ${s.selected.size !== 2 ? "disabled" : ""}>${t("submit")}</button>` : `<button class="secondary-btn" data-action="go" ${s.turn !== 0 || playable.length ? "disabled" : ""}>Go</button>` }; }
    };
  }

  function makeGoFishFixed(controller) {
    const s = { players: [[], [], [], []], stock: [], turn: 0, selectedOpponent: 1, selectedRank: null, books: [0, 0, 0, 0], bookRanks: [[], [], [], []], bookCue: "", playerCount: 4 };
    const names = ["You", "Otter", "Fox", "Panda"];
    const removeBooks = (player) => { const completedRanks = []; for (let rank = 1; rank <= 13; rank += 1) { if (s.players[player].filter((item) => item.rank === rank).length === 4) { s.players[player] = s.players[player].filter((item) => item.rank !== rank); s.books[player] += 1; if (!s.bookRanks[player].includes(rank)) { s.bookRanks[player].push(rank); completedRanks.push(rank); } } } if (player === 0 && completedRanks.length) s.bookCue = completedRanks.map(rankText).join(" · "); };
    const refillEmptyHand = (player) => { const handSize = s.playerCount === 2 ? 7 : 5; if (!s.players[player].length) while (s.stock.length && s.players[player].length < handSize) s.players[player].push(s.stock.pop()); };
    const resultTargetText = () => { const missing = Array.from({ length: 13 }, (_, index) => index + 1).filter((rank) => !s.bookRanks[0].includes(rank)); if (!missing.length) return goFishText("fullTarget"); const counts = new Map(); s.players[0].forEach((item) => counts.set(item.rank, (counts.get(item.rank) || 0) + 1)); const [rank, count] = missing.map((value) => [value, counts.get(value) || 0]).sort((a, b) => b[1] - a[1] || a[0] - b[0])[0]; return goFishText("target", { rank: rankText(rank), count }); };
    const finish = () => { for (let player = 0; player < s.playerCount; player += 1) removeBooks(player); const winner = s.books.slice(0, s.playerCount).indexOf(Math.max(...s.books.slice(0, s.playerCount))); const completed = s.bookRanks[0].length ? s.bookRanks[0].map(rankText).join(" · ") : "—"; const resultSummary = goFishText("result", { books: s.books.slice(0, s.playerCount).join(" / "), completed }); controller.result(winner === 0, `${resultSummary} · ${resultTargetText()}`); };
    const deal = () => { s.players = [[], [], [], []]; s.stock = deck(); s.turn = 0; s.selectedOpponent = s.playerCount === 2 ? 1 : Math.min(s.selectedOpponent, s.playerCount - 1); s.selectedRank = null; s.books = [0, 0, 0, 0]; s.bookRanks = [[], [], [], []]; s.bookCue = ""; const handSize = s.playerCount === 2 ? 7 : 5; for (let i = 0; i < handSize; i += 1) for (let player = 0; player < s.playerCount; player += 1) s.players[player].push(s.stock.pop()); for (let player = 0; player < s.playerCount; player += 1) { removeBooks(player); refillEmptyHand(player); } s.bookCue = ""; };
    const next = () => { s.turn = (s.turn + 1) % s.playerCount; refillEmptyHand(s.turn); if (s.turn !== 0) setTimeout(aiTurn, 300); };
    const ask = (target, rank) => { s.bookCue = ""; const matching = s.players[target].filter((item) => item.rank === rank); if (matching.length) { s.players[target] = s.players[target].filter((item) => item.rank !== rank); s.players[0].push(...matching); removeBooks(0); refillEmptyHand(0); s.selectedRank = null; } else { if (s.stock.length) s.players[0].push(s.stock.pop()); s.selectedRank = null; next(); } if (!s.stock.length) { for (let player = 0; player < s.playerCount; player += 1) removeBooks(player); if (s.players.slice(0, s.playerCount).every((cards) => !cards.length)) finish(); } };
    const aiTurn = () => { if (!controller.isBattleActive() || s.turn === 0) return; refillEmptyHand(s.turn); const ranks = [...new Set(s.players[s.turn].map((item) => item.rank))]; if (!ranks.length) { if (!s.stock.length && s.players.slice(0, s.playerCount).every((cards) => !cards.length)) finish(); else next(); return; } const targets = Array.from({ length: s.playerCount }, (_, index) => index).filter((index) => index !== s.turn); const target = targets[Math.floor(Math.random() * targets.length)]; const rank = ranks[Math.floor(Math.random() * ranks.length)]; const matching = s.players[target].filter((item) => item.rank === rank); if (matching.length) { s.players[s.turn].push(...matching); s.players[target] = s.players[target].filter((item) => item.rank !== rank); removeBooks(s.turn); refillEmptyHand(s.turn); } else if (s.stock.length) s.players[s.turn].push(s.stock.pop()); removeBooks(s.turn); if (!s.stock.length && s.players.slice(0, s.playerCount).every((cards) => !cards.length)) finish(); else next(); };
    return {
      reset() { deal(); },
      card(index) { if (s.turn === 0 && s.players[0][index]) s.selectedRank = s.players[0][index].rank; },
      action(action, valueArg) { if (action === "players") { const count = Number(valueArg); if (count >= 2 && count <= 4) { s.playerCount = count; deal(); } return; } if (s.turn !== 0) return; if (action === "opponent") s.selectedOpponent = Math.min(Number(valueArg), s.playerCount - 1); if (action === "rank") { const rank = Number(valueArg); if (s.players[0].some((item) => item.rank === rank)) s.selectedRank = rank; } if (action === "ask" && s.selectedRank && s.players[0].some((item) => item.rank === s.selectedRank)) ask(s.selectedOpponent, s.selectedRank); },
      view() { const rankCounts = s.players[0].reduce((counts, item) => counts.set(item.rank, (counts.get(item.rank) || 0) + 1), new Map()); if (s.selectedRank && !rankCounts.has(s.selectedRank)) s.selectedRank = null; const target = [...rankCounts.entries()].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0] || [null, 0]; const heldRanks = new Set(rankCounts.keys()); const rankControls = RANKS.map((rank, index) => { const value = index + 1; const held = heldRanks.has(value); return `<button class="secondary-btn ${s.selectedRank === value ? "is-selected" : ""}" data-action="rank" data-value="${value}" aria-pressed="${s.selectedRank === value}" ${held ? "" : "disabled"}>${rank}</button>`; }).join(""); const playerControls = [2, 3, 4].map((count) => `<button class="secondary-btn ${s.playerCount === count ? "is-selected" : ""}" data-action="players" data-value="${count}" aria-label="${count} players">${count}</button>`).join(""); const completed = s.bookRanks[0].length ? s.bookRanks[0].map(rankText).join(" · ") : "—"; const targetText = target[0] ? `${rankText(target[0])} ${target[1]}/4` : "—"; const requestSummary = goFishText(s.selectedRank ? "ready" : "pending", { rank: s.selectedRank ? rankText(s.selectedRank) : "", opponent: names[s.selectedOpponent] }); const bookCue = s.bookCue ? `<p class="card-choice-summary card-go-fish-book-cue" data-go-fish-book-cue data-runtime-localize="off" role="status" aria-live="polite">${goFishText("book", { rank: s.bookCue, books: s.books[0] })}</p>` : ""; return { phase: `${t("ask")} ${s.playerCount}P`, status: s.turn === 0 ? t("yourTurn") : t("aiTurn"), help: `${t("ask")}: ${names[s.selectedOpponent]} — ${t("chooseRank")}`, score: s.books[0], opponents: names.slice(1, s.playerCount).map((name, index) => `<button class="opponent-card" data-action="opponent" data-value="${index + 1}"><strong>${name}</strong><span>${s.players[index + 1].length} ${t("cards")} — ${s.books[index + 1]} ${t("books")}</span></button>`).join(""), center: `<div class="card-table-label">${t("stock")}: ${s.stock.length}</div><div class="table-row"><button class="playing-card is-face-down" data-action="draw" aria-label="${t("stock")}"></button><div class="card-book-progress" aria-live="polite"><strong>${t("books")}: ${s.books[0]}/13</strong><span>${completed}</span><span>${t("target")}: ${targetText}</span></div></div>${bookCue}<p class="card-choice-summary" data-go-fish-request-summary role="status" aria-live="polite">${requestSummary}</p><div class="card-choice-panel">${rankControls}</div>`, hand: cardsMarkup(s.players[0]), actions: `<div class="card-choice-panel">${playerControls}</div><button class="primary-btn" data-action="ask" ${!s.selectedRank || s.selectedOpponent >= s.playerCount || !heldRanks.has(s.selectedRank) ? "disabled" : ""}>${t("ask")}</button>` }; }
    };
  }

  function makeSpeedFixed(controller) {
    const s = { hand: [], stock: [], aiHand: [], aiStock: [], centers: [], waste: [], timer: null, over: false, lastPlayerAt: 0 };
    const canPlay = (item, centerCard) => item && centerCard && (item.rank === centerCard.rank + 1 || item.rank === centerCard.rank - 1 || (item.rank === 1 && centerCard.rank === 13) || (item.rank === 13 && centerCard.rank === 1));
    const refill = (hand, stock) => { while (hand.length < 5 && stock.length) hand.push(stock.pop()); };
    const replaceCenter = (index, item) => { if (s.centers[index]) s.waste.push(s.centers[index]); s.centers[index] = item; };
    const finishIfDone = () => { const playerEmpty = !s.hand.length && !s.stock.length; const aiEmpty = !s.aiHand.length && !s.aiStock.length; if (playerEmpty || aiEmpty) { s.over = true; clearTimeout(s.timer); controller.result(playerEmpty, `${t("cards")}: ${s.hand.length + s.stock.length} / ${s.aiHand.length + s.aiStock.length}`); } };
    const aiLoop = () => {
      if (s.over || !controller.isBattleActive()) return;
      const candidates = s.aiHand.flatMap((item, index) => s.centers.map((centerCard, centerIndex) => canPlay(item, centerCard) ? { index, centerIndex, item } : []));
      if (candidates.length) {
        const playerIsActive = Date.now() - s.lastPlayerAt < 1500;
        const playerCanPlay = s.hand.some((item) => s.centers.some((centerCard) => canPlay(item, centerCard)));
        if (playerIsActive) {
          if (!playerCanPlay && s.stock.length && s.aiStock.length) {
            replaceCenter(0, s.stock.pop());
            replaceCenter(1, s.aiStock.pop());
          } else if (!playerCanPlay && s.waste.length >= 2) {
            for (let index = s.waste.length - 1; index; index -= 1) { const swap = Math.floor(Math.random() * (index + 1)); [s.waste[index], s.waste[swap]] = [s.waste[swap], s.waste[index]]; }
            const nextCenters = [s.waste.pop(), s.waste.pop()];
            s.waste.push(...s.centers);
            s.centers = nextCenters;
          }
        } else {
          const pick = candidates[Math.floor(Math.random() * candidates.length)];
          s.aiHand.splice(pick.index, 1);
          replaceCenter(pick.centerIndex, pick.item);
          refill(s.aiHand, s.aiStock);
        }
      } else {
        refill(s.aiHand, s.aiStock);
        const playerCanPlay = s.hand.some((item) => s.centers.some((centerCard) => canPlay(item, centerCard)));
        if (!playerCanPlay) {
          if (s.stock.length && s.aiStock.length) {
            replaceCenter(0, s.stock.pop());
            replaceCenter(1, s.aiStock.pop());
          } else if (s.waste.length >= 2) {
            for (let index = s.waste.length - 1; index; index -= 1) { const swap = Math.floor(Math.random() * (index + 1)); [s.waste[index], s.waste[swap]] = [s.waste[swap], s.waste[index]]; }
            const nextCenters = [s.waste.pop(), s.waste.pop()];
            s.waste.push(...s.centers);
            s.centers = nextCenters;
          }
        }
      }
      finishIfDone();
      if (!s.over) s.timer = setTimeout(aiLoop, 850);
    };
    return {
      reset() { const cards = deck(); Object.assign(s, { hand: cards.splice(0, 5), stock: cards.splice(0, 20), aiHand: cards.splice(0, 5), aiStock: cards.splice(0, 20), centers: cards.splice(0, 2), waste: [], over: false, lastPlayerAt: Date.now() }); clearTimeout(s.timer); s.timer = setTimeout(aiLoop, 850); },
      card(index) { if (s.over) return; const item = s.hand[index]; const centerIndex = s.centers.findIndex((centerCard) => canPlay(item, centerCard)); if (centerIndex < 0) return; s.hand.splice(index, 1); replaceCenter(centerIndex, item); s.lastPlayerAt = Date.now(); refill(s.hand, s.stock); finishIfDone(); },
      action() {},
      view() { const legalCount = s.hand.filter((item) => s.centers.some((centerCard) => canPlay(item, centerCard))).length; const handMarkup = s.hand.map((item, index) => { const legal = s.centers.some((centerCard) => canPlay(item, centerCard)); return cardMarkup(item, index, { className: legal ? "card-speed-legal" : "", ariaLabel: legal ? speedLegalLabel(item) : undefined, runtimeLocalizeOff: legal }); }).join(""); return { phase: "Speed", status: t("yourTurn"), help: speedCoachText(legalCount), score: s.hand.length + s.stock.length, opponents: opponentMarkup("AI", s.aiHand.length + s.aiStock.length), center: `<div class="card-speed-lane"><div class="card-speed-pile">${cardMarkup(s.centers[0], 0)}</div><div class="card-speed-pile">${cardMarkup(s.centers[1], 0)}</div></div>`, hand: handMarkup, actions: `<span class="card-help">${s.stock.length} ${t("stock")} · ${s.aiStock.length} ${t("cards")} ${t("waiting")}</span>` }; }
    };
  }

  function makeOldMaidFixed(controller) {
    const s = { players: [[], [], [], []], turn: 0, books: [0, 0, 0, 0], over: false, drawCue: "" };
    const names = OLD_MAID_NAMES[currentLocale()] || OLD_MAID_NAMES.en;
    const oldMaidOpponentMarkup = (name, count, extra = "") => `<div class="opponent-card"><strong data-runtime-localize="off">${name}</strong><span>${count} ${t("cards")}${extra ? ` · ${extra}` : ""}</span></div>`;
    const pair = (player) => { const byRank = new Map(); s.players[player].forEach((item) => { const list = byRank.get(item.rank) || []; list.push(item); byRank.set(item.rank, list); }); byRank.forEach((items) => { const normal = items.filter((item) => !item.oldMaid); for (let pairIndex = 0; pairIndex + 1 < normal.length; pairIndex += 2) { [normal[pairIndex], normal[pairIndex + 1]].forEach((item) => { const index = s.players[player].indexOf(item); if (index >= 0) s.players[player].splice(index, 1); }); s.books[player] += 1; } }); };
    const finishIfDone = () => { const active = s.players.filter((cards) => cards.length); if (active.length <= 1) { const loser = s.players.findIndex((cards) => cards.length); const copy = OLD_MAID_RESULT[currentLocale()] || OLD_MAID_RESULT.en; const lesson = (copy[loser === 0 ? "lost" : "cleared"] || copy.cleared).replace("{holder}", names[loser]); const holderLine = loser === 0 ? t("oldMaid") : `${names[loser]} ${t("oldMaid")}`; s.over = true; controller.result(loser !== 0, `${holderLine} · ${lesson}`); } };
    const targetFor = (player) => { for (let offset = 1; offset < s.players.length; offset += 1) { const target = (player + offset) % s.players.length; if (s.players[target].length) return target; } return -1; };
    const next = () => { s.turn = (s.turn + 1) % 4; while (!s.players[s.turn].length && s.players.some((cards) => cards.length)) s.turn = (s.turn + 1) % 4; if (s.turn !== 0) setTimeout(aiTurn, 320); };
    const drawFrom = (player, index) => { const target = targetFor(player); if (target < 0) { finishIfDone(); return; } if (player === 0) s.drawCue = ""; const source = s.players[target]; const pairsBefore = s.books[player]; const item = source.splice(Math.min(index, source.length - 1), 1)[0]; s.players[player].push(item); pair(player); if (player === 0) { const cueKey = s.books[player] > pairsBefore ? "pair" : s.players[player].some((card) => card.oldMaid) ? "risk" : "none"; s.drawCue = oldMaidText(cueKey); } finishIfDone(); if (!s.over) next(); };
    const aiTurn = () => { if (s.turn !== 0 && !s.over) { const target = targetFor(s.turn); if (target < 0) finishIfDone(); else drawFrom(s.turn, Math.floor(Math.random() * s.players[target].length)); } };
    return {
      reset() { const cards = deck(); const removed = cards.findIndex((item) => item.suit === "spades" && item.rank === 12); cards.splice(removed, 1); const odd = cards.find((item) => item.rank === 12); if (odd) odd.oldMaid = true; Object.assign(s, { players: [[], [], [], []], turn: 0, books: [0, 0, 0, 0], over: false, drawCue: "" }); cards.forEach((item, index) => s.players[index % 4].push(item)); s.players.forEach((_, index) => pair(index)); },
      card(index) { if (s.turn === 0 && !s.over) drawFrom(0, index); },
      action() {},
      view() { const targetIndex = targetFor(0); const target = targetIndex < 0 ? [] : s.players[targetIndex]; const turnTarget = targetFor(s.turn); const playerHasOldMaid = s.players[0].some((item) => item.oldMaid); const riskCopy = (OLD_MAID_RISK[currentLocale()] || OLD_MAID_RISK.en)[playerHasOldMaid ? "held" : "hidden"]; const drawCue = s.drawCue ? `<p class="card-choice-summary card-old-maid-draw-cue" data-old-maid-draw-cue data-runtime-localize="off" role="status" aria-live="polite">${s.drawCue}</p>` : ""; return { phase: t("oldMaid"), status: s.turn === 0 ? t("yourTurn") : t("aiTurn"), help: oldMaidText("help", { name: names[turnTarget < 0 ? 0 : turnTarget] }), score: s.books[0], opponents: names.slice(1).map((name, index) => oldMaidOpponentMarkup(name, s.players[index + 1].length, `${s.books[index + 1]} ${t("pairs")}`)).join(""), center: `<div class="card-table-label">${t("oldMaid")}</div><div class="card-old-maid-risk ${playerHasOldMaid ? "is-held" : ""}" role="status">${riskCopy}</div>${drawCue}<div class="table-row">${target.map((_, index) => cardMarkup({ faceDown: true }, index)).join("")}</div>`, hand: cardsMarkup(s.players[0]), actions: "" }; }
    };
  }

  const GAME_BUILDERS = { hearts: makeHearts, spades: makeSpades, "gin-rummy": makeGinRummyFixed, "crazy-eights": makeCrazyEightsFixed, cribbage: makeCribbageFixed, "go-fish": makeGoFishFixed, war: makeWarFixed, speed: makeSpeedFixed, "old-maid": makeOldMaidFixed, casino: makeCasino };
  root.WPCardGamesNext = Object.freeze({ mount: mountCardGame, titles: TITLES });
})(window);
