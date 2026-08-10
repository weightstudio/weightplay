(function (root) {
  "use strict";

  const engine = root.WPCardEngine;
  if (!engine) return;

  const { Card, Deck, Foundation, SoundEngine } = engine;
  const SUITS = ["spades", "hearts", "clubs", "diamonds"];
  const SYMBOLS = { spades: "♠", hearts: "♥", clubs: "♣", diamonds: "♦" };
  const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  const LOCALES = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];

  const COMMON = {
    en: { start: "Start Game", restart: "Restart", newGame: "New Game", undo: "Undo", hint: "Hint", how: "How to play", settings: "Settings", sound: "Sound", soundOn: "Sound: On", soundOff: "Sound: Off", moves: "Moves", score: "Score", stock: "Stock", waste: "Waste", freeCells: "Free Cells", foundations: "Foundations", tableau: "Tableau", combo: "Combo", draw: "Draw card", win: "Game Complete", lose: "No more moves", winText: "A clean table. Nice work!", loseText: "Try Undo or start a fresh deal.", close: "Close", back: "Back", empty: "Empty", selected: "Selected", noMoves: "No legal move found.", wrong: "That move is not legal.", pairWrong: "Choose two available cards that add to 13.", pairClear: "Pair cleared!", stockEmpty: "The stock is empty.", tutorialTitle: "Read the table, then make one clear move.", tutorialGoal: "Clear every card using the classic rules.", tutorialControl: "Tap a card and its destination, or drag it with a mouse or finger.", tutorialFinish: "Use Hint when you need a nudge; Undo is always safe.", ariaCard: "{rank} of {suit}", ariaBack: "Face-down card", ariaPile: "{name}, {count} cards" },
    "zh-Hant": { start: "開始遊戲", restart: "重新開始", newGame: "新遊戲", undo: "還原", hint: "提示", how: "玩法說明", settings: "設定", sound: "音效", soundOn: "音效：開", soundOff: "音效：關", moves: "步數", score: "分數", stock: "牌庫", waste: "棄牌區", freeCells: "暫存格", foundations: "收牌區", tableau: "主牌欄", combo: "連鎖", draw: "翻牌", win: "遊戲完成", lose: "沒有可走的牌", winText: "桌面清空了，做得漂亮！", loseText: "試試還原，或開始一局新牌。", close: "關閉", back: "返回", empty: "空位", selected: "已選取", noMoves: "找不到合法走法。", wrong: "這個移動不符合規則。", pairWrong: "請選兩張可用且總和為 13 的牌。", pairClear: "牌對已清除！", stockEmpty: "牌庫已空。", tutorialTitle: "先看懂桌面，再做出清楚的一步。", tutorialGoal: "依經典規則清除所有牌。", tutorialControl: "點牌與目的地，或用手指／滑鼠拖曳。", tutorialFinish: "需要方向時使用提示；還原永遠安全。", ariaCard: "{suit} {rank}", ariaBack: "覆蓋牌", ariaPile: "{name}，{count} 張牌" },
    "zh-Hans": { start: "开始游戏", restart: "重新开始", newGame: "新游戏", undo: "撤销", hint: "提示", how: "玩法说明", settings: "设置", sound: "音效", soundOn: "音效：开", soundOff: "音效：关", moves: "步数", score: "分数", stock: "牌库", waste: "弃牌区", freeCells: "暂存格", foundations: "收牌区", tableau: "主牌列", combo: "连锁", draw: "翻牌", win: "游戏完成", lose: "没有可走的牌", winText: "桌面清空了，做得漂亮！", loseText: "试试撤销，或开始一局新牌。", close: "关闭", back: "返回", empty: "空位", selected: "已选取", noMoves: "找不到合法走法。", wrong: "这个移动不符合规则。", pairWrong: "请选择两张可用且总和为 13 的牌。", pairClear: "牌对已清除！", stockEmpty: "牌库已空。", tutorialTitle: "先看懂桌面，再做出清楚的一步。", tutorialGoal: "按经典规则清除所有牌。", tutorialControl: "点击牌与目的地，或用手指／鼠标拖曳。", tutorialFinish: "需要方向时使用提示；撤销永远安全。", ariaCard: "{suit} {rank}", ariaBack: "盖牌", ariaPile: "{name}，{count} 张牌" },
    ja: { start: "ゲーム開始", restart: "リスタート", newGame: "新しいゲーム", undo: "元に戻す", hint: "ヒント", how: "遊び方", settings: "設定", sound: "サウンド", soundOn: "サウンド：オン", soundOff: "サウンド：オフ", moves: "手数", score: "スコア", stock: "山札", waste: "捨て札", freeCells: "フリーセル", foundations: "組札", tableau: "場札", combo: "コンボ", draw: "カードをめくる", win: "ゲームクリア", lose: "手がありません", winText: "すべてのカードを片付けました！", loseText: "元に戻すか、新しいゲームを始めましょう。", close: "閉じる", back: "戻る", empty: "空き", selected: "選択中", noMoves: "合法手がありません。", wrong: "その移動はルールに合いません。", pairWrong: "合計13になる使える2枚を選んでください。", stockEmpty: "山札がありません。", tutorialTitle: "場を読み、確かな一手を選びます。", tutorialGoal: "クラシックなルールで全カードを片付けます。", tutorialControl: "カードと行き先をタップするか、指やマウスでドラッグします。", tutorialFinish: "迷ったらヒント、いつでも元に戻せます。", ariaCard: "{suit}の{rank}", ariaBack: "裏向きのカード", ariaPile: "{name}、{count}枚" },
    ko: { start: "게임 시작", restart: "다시 시작", newGame: "새 게임", undo: "실행 취소", hint: "힌트", how: "게임 방법", settings: "설정", sound: "사운드", soundOn: "사운드: 켜짐", soundOff: "사운드: 꺼짐", moves: "이동", score: "점수", stock: "덱", waste: "버린 카드", freeCells: "프리 셀", foundations: "기초 더미", tableau: "테이블", combo: "콤보", draw: "카드 뒤집기", win: "게임 완료", lose: "더 이상 이동할 수 없음", winText: "모든 카드를 정리했습니다!", loseText: "실행 취소하거나 새 게임을 시작해 보세요.", close: "닫기", back: "뒤로", empty: "빈칸", selected: "선택됨", noMoves: "가능한 수가 없습니다.", wrong: "규칙에 맞지 않는 이동입니다.", pairWrong: "합이 13이 되는 사용 가능한 카드 두 장을 고르세요.", stockEmpty: "덱이 비었습니다.", tutorialTitle: "테이블을 읽고 확실한 한 수를 선택하세요.", tutorialGoal: "클래식 규칙으로 모든 카드를 치우세요.", tutorialControl: "카드와 목적지를 누르거나 손가락과 마우스로 드래그하세요.", tutorialFinish: "필요하면 힌트를 쓰고 언제든 실행 취소하세요.", ariaCard: "{suit} {rank}", ariaBack: "뒤집힌 카드", ariaPile: "{name}, 카드 {count}장" },
    es: { start: "Iniciar partida", restart: "Reiniciar", newGame: "Nueva partida", undo: "Deshacer", hint: "Pista", how: "Cómo jugar", settings: "Ajustes", sound: "Sonido", soundOn: "Sonido: activado", soundOff: "Sonido: desactivado", moves: "Movimientos", score: "Puntuación", stock: "Mazo", waste: "Descarte", freeCells: "Celdas libres", foundations: "Fundaciones", tableau: "Tapiz", combo: "Combo", draw: "Robar carta", win: "Partida completada", lose: "Sin movimientos", winText: "¡Has despejado la mesa!", loseText: "Deshaz un movimiento o empieza una nueva partida.", close: "Cerrar", back: "Atrás", empty: "Vacío", selected: "Seleccionada", noMoves: "No hay movimientos legales.", wrong: "Ese movimiento no es legal.", pairWrong: "Elige dos cartas disponibles que sumen 13.", stockEmpty: "El mazo está vacío.", tutorialTitle: "Lee la mesa y elige una jugada clara.", tutorialGoal: "Elimina todas las cartas con las reglas clásicas.", tutorialControl: "Toca la carta y su destino, o arrástrala con el dedo o el ratón.", tutorialFinish: "Usa Pista si dudas; Deshacer siempre es seguro.", ariaCard: "{rank} de {suit}", ariaBack: "Carta boca abajo", ariaPile: "{name}, {count} cartas" },
    "pt-BR": { start: "Iniciar jogo", restart: "Reiniciar", newGame: "Novo jogo", undo: "Desfazer", hint: "Dica", how: "Como jogar", settings: "Configurações", sound: "Som", soundOn: "Som: ligado", soundOff: "Som: desligado", moves: "Movimentos", score: "Pontuação", stock: "Monte", waste: "Descarte", freeCells: "Células livres", foundations: "Fundações", tableau: "Mesa", combo: "Combo", draw: "Virar carta", win: "Jogo concluído", lose: "Sem movimentos", winText: "A mesa foi limpa!", loseText: "Desfaça um movimento ou comece um novo jogo.", close: "Fechar", back: "Voltar", empty: "Vazio", selected: "Selecionada", noMoves: "Não há movimento legal.", wrong: "Esse movimento não é válido.", pairWrong: "Escolha duas cartas disponíveis que somem 13.", stockEmpty: "O monte está vazio.", tutorialTitle: "Leia a mesa e escolha uma jogada clara.", tutorialGoal: "Remova todas as cartas com as regras clássicas.", tutorialControl: "Toque na carta e no destino, ou arraste com o dedo ou mouse.", tutorialFinish: "Use Dica quando precisar; Desfazer é seguro.", ariaCard: "{rank} de {suit}", ariaBack: "Carta virada", ariaPile: "{name}, {count} cartas" },
    fr: { start: "Commencer", restart: "Recommencer", newGame: "Nouvelle partie", undo: "Annuler", hint: "Indice", how: "Comment jouer", settings: "Réglages", sound: "Son", soundOn: "Son : activé", soundOff: "Son : désactivé", moves: "Coups", score: "Score", stock: "Pioche", waste: "Défausse", freeCells: "Cellules libres", foundations: "Fondations", tableau: "Tableau", combo: "Combo", draw: "Piocher", win: "Partie terminée", lose: "Plus de coups", winText: "La table est vide, bravo !", loseText: "Annulez un coup ou commencez une nouvelle partie.", close: "Fermer", back: "Retour", empty: "Vide", selected: "Sélectionnée", noMoves: "Aucun coup légal.", wrong: "Ce déplacement est interdit.", pairWrong: "Choisissez deux cartes disponibles dont la somme vaut 13.", stockEmpty: "La pioche est vide.", tutorialTitle: "Lisez la table et choisissez un coup clair.", tutorialGoal: "Retirez toutes les cartes avec les règles classiques.", tutorialControl: "Touchez la carte et sa destination, ou faites-la glisser.", tutorialFinish: "Utilisez Indice en cas de doute ; Annuler est toujours possible.", ariaCard: "{rank} de {suit}", ariaBack: "Carte face cachée", ariaPile: "{name}, {count} cartes" },
    de: { start: "Spiel starten", restart: "Neu starten", newGame: "Neues Spiel", undo: "Rückgängig", hint: "Tipp", how: "So wird gespielt", settings: "Einstellungen", sound: "Ton", soundOn: "Ton: an", soundOff: "Ton: aus", moves: "Züge", score: "Punkte", stock: "Stapel", waste: "Ablage", freeCells: "Freie Felder", foundations: "Fundamente", tableau: "Spielfeld", combo: "Combo", draw: "Karte ziehen", win: "Spiel beendet", lose: "Keine Züge mehr", winText: "Der Tisch ist leer – gut gespielt!", loseText: "Mache einen Zug rückgängig oder starte neu.", close: "Schließen", back: "Zurück", empty: "Leer", selected: "Ausgewählt", noMoves: "Kein legaler Zug gefunden.", wrong: "Dieser Zug ist nicht erlaubt.", pairWrong: "Wähle zwei verfügbare Karten mit der Summe 13.", stockEmpty: "Der Stapel ist leer.", tutorialTitle: "Lies das Spielfeld und wähle einen klaren Zug.", tutorialGoal: "Räume alle Karten nach den klassischen Regeln ab.", tutorialControl: "Klicke Karte und Ziel oder ziehe mit Finger oder Maus.", tutorialFinish: "Nutze Tipp bei Bedarf; Rückgängig bleibt sicher.", ariaCard: "{rank} von {suit}", ariaBack: "Verdeckte Karte", ariaPile: "{name}, {count} Karten" },
    it: { start: "Inizia partita", restart: "Ricomincia", newGame: "Nuova partita", undo: "Annulla", hint: "Suggerimento", how: "Come si gioca", settings: "Impostazioni", sound: "Audio", soundOn: "Audio: attivo", soundOff: "Audio: disattivo", moves: "Mosse", score: "Punteggio", stock: "Tallone", waste: "Scarti", freeCells: "Celle libere", foundations: "Basi", tableau: "Tavolo", combo: "Combo", draw: "Pesca carta", win: "Partita completata", lose: "Nessuna mossa", winText: "Hai svuotato il tavolo!", loseText: "Annulla una mossa o inizia una nuova partita.", close: "Chiudi", back: "Indietro", empty: "Vuoto", selected: "Selezionata", noMoves: "Nessuna mossa legale.", wrong: "Mossa non consentita.", pairWrong: "Scegli due carte disponibili la cui somma sia 13.", stockEmpty: "Il tallone è vuoto.", tutorialTitle: "Leggi il tavolo e scegli una mossa chiara.", tutorialGoal: "Elimina tutte le carte con le regole classiche.", tutorialControl: "Tocca carta e destinazione oppure trascina con dito o mouse.", tutorialFinish: "Usa Suggerimento se serve; Annulla è sempre disponibile.", ariaCard: "{rank} di {suit}", ariaBack: "Carta coperta", ariaPile: "{name}, {count} carte" },
    ru: { start: "Начать игру", restart: "Начать заново", newGame: "Новая игра", undo: "Отменить", hint: "Подсказка", how: "Как играть", settings: "Настройки", sound: "Звук", soundOn: "Звук: вкл.", soundOff: "Звук: выкл.", moves: "Ходы", score: "Очки", stock: "Колода", waste: "Сброс", freeCells: "Свободные ячейки", foundations: "Домики", tableau: "Стол", combo: "Комбо", draw: "Взять карту", win: "Игра завершена", lose: "Ходов нет", winText: "Все карты убраны!", loseText: "Отмените ход или начните новую игру.", close: "Закрыть", back: "Назад", empty: "Пусто", selected: "Выбрано", noMoves: "Нет допустимых ходов.", wrong: "Так ходить нельзя.", pairWrong: "Выберите две доступные карты с суммой 13.", stockEmpty: "Колода пуста.", tutorialTitle: "Изучите стол и выберите понятный ход.", tutorialGoal: "Уберите все карты по классическим правилам.", tutorialControl: "Нажмите карту и цель или перетащите её пальцем или мышью.", tutorialFinish: "Если сомневаетесь, используйте подсказку; отмена всегда доступна.", ariaCard: "{rank} масти {suit}", ariaBack: "Рубашка карты", ariaPile: "{name}, карт: {count}" },
    hi: { start: "खेल शुरू करें", restart: "फिर शुरू करें", newGame: "नया खेल", undo: "पूर्ववत", hint: "संकेत", how: "कैसे खेलें", settings: "सेटिंग", sound: "ध्वनि", soundOn: "ध्वनि: चालू", soundOff: "ध्वनि: बंद", moves: "चालें", score: "स्कोर", stock: "डेक", waste: "फेंकी गई", freeCells: "खाली सेल", foundations: "फाउंडेशन", tableau: "टेबल", combo: "कॉम्बो", draw: "कार्ड पलटें", win: "खेल पूरा", lose: "कोई चाल नहीं", winText: "सभी कार्ड साफ़ हो गए!", loseText: "पूर्ववत करें या नया खेल शुरू करें।", close: "बंद करें", back: "वापस", empty: "खाली", selected: "चयनित", noMoves: "कोई मान्य चाल नहीं मिली।", wrong: "यह चाल मान्य नहीं है।", pairWrong: "13 का योग बनाने वाले दो उपलब्ध कार्ड चुनें।", stockEmpty: "डेक खाली है।", tutorialTitle: "टेबल पढ़ें और एक स्पष्ट चाल चुनें।", tutorialGoal: "क्लासिक नियमों से सभी कार्ड हटाएँ।", tutorialControl: "कार्ड और लक्ष्य पर टैप करें या उंगली/माउस से खींचें।", tutorialFinish: "ज़रूरत हो तो संकेत लें; पूर्ववत सुरक्षित है।", ariaCard: "{suit} का {rank}", ariaBack: "उलटा कार्ड", ariaPile: "{name}, {count} कार्ड" },
    ar: { start: "ابدأ اللعبة", restart: "إعادة البدء", newGame: "لعبة جديدة", undo: "تراجع", hint: "تلميح", how: "طريقة اللعب", settings: "الإعدادات", sound: "الصوت", soundOn: "الصوت: تشغيل", soundOff: "الصوت: إيقاف", moves: "الحركات", score: "النقاط", stock: "الرزمة", waste: "المهملات", freeCells: "الخلايا الحرة", foundations: "الأساسات", tableau: "الطاولة", combo: "تتابع", draw: "اقلب بطاقة", win: "اكتملت اللعبة", lose: "لا توجد حركات", winText: "أزلت كل البطاقات!", loseText: "تراجع عن حركة أو ابدأ لعبة جديدة.", close: "إغلاق", back: "رجوع", empty: "فارغ", selected: "محدد", noMoves: "لا توجد حركة قانونية.", wrong: "هذه الحركة غير قانونية.", pairWrong: "اختر بطاقتين متاحتين مجموعهما 13.", stockEmpty: "الرزمة فارغة.", tutorialTitle: "اقرأ الطاولة واختر حركة واضحة.", tutorialGoal: "أزل كل البطاقات بالقواعد الكلاسيكية.", tutorialControl: "اضغط البطاقة ووجهتها أو اسحبها بإصبعك أو الفأرة.", tutorialFinish: "استخدم التلميح عند الحاجة؛ التراجع آمن دائماً.", ariaCard: "{rank} من {suit}", ariaBack: "بطاقة مقلوبة", ariaPile: "{name}، {count} بطاقات" },
  };

  const PAIR_CLEAR_COPY = {
    en: "Pair cleared!",
    "zh-Hant": "牌對已清除！",
    "zh-Hans": "牌对已清除！",
    ja: "ペアを消去しました！",
    ko: "한 쌍을 지웠습니다!",
    es: "¡Pareja eliminada!",
    "pt-BR": "Par removido!",
    fr: "Paire retirée !",
    de: "Paar entfernt!",
    it: "Coppia rimossa!",
    ru: "Пара убрана!",
    hi: "जोड़ी हटा दी गई!",
    ar: "تمت إزالة الزوج!",
  };
  Object.entries(PAIR_CLEAR_COPY).forEach(([locale, message]) => {
    if (COMMON[locale]) COMMON[locale].pairClear = message;
  });

  const TRIPEAKS_CHAIN_COPY = {
    en: { chain: "Chain continues: {count} cards in a row.", peak: "Peak cleared! Combo ×{count}." },
    "zh-Hant": { chain: "連鎖延續：連續打出 {count} 張牌。", peak: "峰頂清除了！連鎖 ×{count}。" },
    "zh-Hans": { chain: "连锁延续：连续打出 {count} 张牌。", peak: "峰顶清除了！连锁 ×{count}。" },
    ja: { chain: "チェイン継続：{count}枚連続。", peak: "ピークをクリア！コンボ ×{count}。" },
    ko: { chain: "콤보 지속: {count}장 연속입니다.", peak: "피크 클리어! 콤보 ×{count}." },
    es: { chain: "La cadena continúa: {count} cartas seguidas.", peak: "¡Cima despejada! Combo ×{count}." },
    "pt-BR": { chain: "A sequência continua: {count} cartas seguidas.", peak: "Pico limpo! Combo ×{count}." },
    fr: { chain: "La chaîne continue : {count} cartes d’affilée.", peak: "Pic dégagé ! Combo ×{count}." },
    de: { chain: "Die Kette geht weiter: {count} Karten in Folge.", peak: "Gipfel geräumt! Combo ×{count}." },
    it: { chain: "La catena continua: {count} carte di fila.", peak: "Cima liberata! Combo ×{count}." },
    ru: { chain: "Цепочка продолжается: {count} карт подряд.", peak: "Вершина очищена! Комбо ×{count}." },
    hi: { chain: "चेन जारी है: लगातार {count} कार्ड।", peak: "चोटी साफ़! कॉम्बो ×{count}।" },
    ar: { chain: "تستمر السلسلة: {count} بطاقات متتالية.", peak: "تم تنظيف القمة! السلسلة ×{count}." },
  };
  Object.entries(TRIPEAKS_CHAIN_COPY).forEach(([locale, copy]) => {
    if (COMMON[locale]) {
      COMMON[locale].tripeaksChain = copy.chain;
      COMMON[locale].peakClear = copy.peak;
    }
  });

  const GOLF_STOCK_COPY = {
    en: { safe: "Stock: {count} cards left.", low: "Stock low: {count} left. Protect your next move.", final: "Final stock card—make it count." },
    "zh-Hant": { safe: "牌庫還有 {count} 張。", low: "牌庫偏少：剩 {count} 張，保留下一步。", final: "最後一張牌庫牌，抓準這一步。" },
    "zh-Hans": { safe: "牌库还有 {count} 张。", low: "牌库偏少：剩 {count} 张，保留下一步。", final: "最后一张牌库牌，抓准这一步。" },
    ja: { safe: "山札はあと{count}枚。", low: "山札わずか：残り{count}枚。次の一手を守ろう。", final: "最後の山札。勝負の一手です。" },
    ko: { safe: "덱에 {count}장이 남았습니다.", low: "덱이 얼마 남지 않았습니다: {count}장.", final: "마지막 덱 카드입니다. 신중하게!" },
    es: { safe: "Quedan {count} cartas en el mazo.", low: "Quedan pocas: {count}. Protege tu próxima jugada.", final: "Última carta del mazo: aprovéchala." },
    "pt-BR": { safe: "Restam {count} cartas no monte.", low: "Poucas cartas: restam {count}. Proteja a próxima jogada.", final: "Última carta do monte: faça valer." },
    fr: { safe: "Il reste {count} cartes dans la pioche.", low: "Pioche presque vide : {count} restantes. Protégez votre prochain coup.", final: "Dernière carte de la pioche : à vous de jouer." },
    de: { safe: "Noch {count} Karten im Stapel.", low: "Stapel fast leer: noch {count}. Schütze deinen nächsten Zug.", final: "Letzte Karte im Stapel – nutze sie gut." },
    it: { safe: "Restano {count} carte nel tallone.", low: "Tallone quasi vuoto: ne restano {count}. Proteggi la prossima mossa.", final: "Ultima carta del tallone: sfruttala bene." },
    ru: { safe: "В колоде осталось карт: {count}.", low: "Колода почти пуста: осталось {count}. Берегите следующий ход.", final: "Последняя карта колоды. Используйте её." },
    hi: { safe: "डेक में {count} कार्ड बचे हैं।", low: "डेक कम है: {count} कार्ड। अगली चाल बचाएँ।", final: "डेक का आखिरी कार्ड—इसे सही खेलें।" },
    ar: { safe: "تبقى {count} بطاقات في الرزمة.", low: "الرزمة قليلة: تبقى {count}. احمِ حركتك التالية.", final: "هذه آخر بطاقة في الرزمة، أحسن استخدامها." },
  };
  Object.entries(GOLF_STOCK_COPY).forEach(([locale, copy]) => {
    if (COMMON[locale]) {
      COMMON[locale].golfStockSafe = copy.safe;
      COMMON[locale].golfStockLow = copy.low;
      COMMON[locale].golfStockFinal = copy.final;
    }
  });

  const GOLF_MASTERY_COPY = {
    en: { combo: "Run of {count}! Best chain: {best}.", recap: "Best chain: {best} cards." },
    "zh-Hant": { combo: "連出 {count} 張！最佳連鎖：{best} 張。", recap: "最佳連鎖：{best} 張。" },
    "zh-Hans": { combo: "连出 {count} 张！最佳连锁：{best} 张。", recap: "最佳连锁：{best} 张。" },
    ja: { combo: "連続{count}枚！自己ベストは{best}枚。", recap: "ベスト連鎖：{best}枚。" },
    ko: { combo: "연속 {count}장! 최고 연속: {best}장.", recap: "최고 연속: {best}장." },
    es: { combo: "¡Racha de {count}! Mejor cadena: {best}.", recap: "Mejor cadena: {best} cartas." },
    "pt-BR": { combo: "Sequência de {count}! Melhor sequência: {best}.", recap: "Melhor sequência: {best} cartas." },
    fr: { combo: "Série de {count} ! Meilleure série : {best}.", recap: "Meilleure série : {best} cartes." },
    de: { combo: "Serie mit {count}! Beste Serie: {best}.", recap: "Beste Serie: {best} Karten." },
    it: { combo: "Serie di {count}! Migliore: {best}.", recap: "Migliore serie: {best} carte." },
    ru: { combo: "Серия из {count}! Лучшая серия: {best}.", recap: "Лучшая серия: {best} карт." },
    hi: { combo: "लगातार {count} कार्ड! सर्वश्रेष्ठ श्रृंखला: {best}।", recap: "सर्वश्रेष्ठ श्रृंखला: {best} कार्ड।" },
    ar: { combo: "سلسلة من {count}! أفضل سلسلة: {best}.", recap: "أفضل سلسلة: {best} بطاقة." },
  };
  Object.entries(GOLF_MASTERY_COPY).forEach(([locale, copy]) => {
    if (COMMON[locale]) {
      COMMON[locale].golfComboLong = copy.combo;
      COMMON[locale].golfResultRecap = copy.recap;
    }
  });

  const YUKON_COACH_COPY = {
    en: "Try this first move: select the {source}, then move it to the {destination}.",
    "zh-Hant": "先試試這一步：選取 {source}，再移到 {destination}。",
    "zh-Hans": "先试试这一步：选取 {source}，再移到 {destination}。",
    ja: "最初の一手を試しましょう：{source}を選び、{destination}へ移します。",
    ko: "첫 수를 시도해 보세요. {source}을(를) 선택한 뒤 {destination}(으)로 옮기세요.",
    es: "Prueba esta primera jugada: selecciona {source} y muévela a {destination}.",
    "pt-BR": "Tente esta primeira jogada: selecione {source} e mova para {destination}.",
    fr: "Essayez ce premier coup : sélectionnez {source}, puis déplacez-la vers {destination}.",
    de: "Probiere diesen ersten Zug: Wähle {source} und verschiebe sie auf {destination}.",
    it: "Prova questa prima mossa: seleziona {source} e spostala su {destination}.",
    ru: "Попробуйте первый ход: выберите {source} и переместите на {destination}.",
    hi: "यह पहली चाल आज़माएँ: {source} चुनें और {destination} पर ले जाएँ।",
    ar: "جرّب هذه الحركة الأولى: اختر {source} ثم انقلها إلى {destination}.",
  };
  Object.entries(YUKON_COACH_COPY).forEach(([locale, message]) => {
    if (COMMON[locale]) COMMON[locale].yukonCoach = message;
  });

  const PYRAMID_COACH_COPY = {
    en: "Two legal pairs are open. Pick the pair that reveals more cards.",
    "zh-Hant": "目前有兩組合法牌對。優先選能翻出更多牌的那一組。",
    "zh-Hans": "现在有两组合法牌对。优先选择能翻开更多牌的那一组。",
    ja: "今は合法なペアが2組あります。より多くのカードをめくれる組を選びましょう。",
    ko: "지금은 합법적인 카드 쌍이 두 개 열려 있습니다. 더 많은 카드를 드러내는 쌍을 골라 보세요.",
    es: "Hay dos parejas legales. Elige la que revele más cartas.",
    "pt-BR": "Há dois pares legais. Escolha o par que revele mais cartas.",
    fr: "Deux paires légales sont ouvertes. Choisissez celle qui révèle le plus de cartes.",
    de: "Zwei legale Paare sind offen. Wähle das Paar, das mehr Karten aufdeckt.",
    it: "Ci sono due coppie legali. Scegli quella che scopre più carte.",
    ru: "Доступны две пары. Выберите ту, которая откроет больше карт.",
    hi: "दो वैध जोड़ियाँ खुली हैं। वह जोड़ी चुनें जो ज़्यादा कार्ड खोले।",
    ar: "هناك زوجان قانونيان متاحان. اختر الزوج الذي يكشف بطاقات أكثر.",
  };
  Object.entries(PYRAMID_COACH_COPY).forEach(([locale, message]) => {
    if (COMMON[locale]) COMMON[locale].pyramidCoach = message;
  });

  const VARIANTS = {
    freecell: { titles: { en: "FreeCell Solitaire", "zh-Hant": "空當接龍", "zh-Hans": "空当接龙", ja: "フリーセルソリティア", ko: "프리셀 솔리테어", es: "Solitario FreeCell", "pt-BR": "Paciência FreeCell", fr: "Solitaire FreeCell", de: "FreeCell-Solitär", it: "Solitario FreeCell", ru: "Пасьянс «Свободная ячейка»", hi: "फ्रीसेल सॉलिटेयर", ar: "سوليتير الخلية الحرة" }, target: { en: "Build four suit foundations from Ace to King using eight open columns and four temporary cells.", "zh-Hant": "利用 8 個全攤主牌欄與 4 個暫存格，將四種花色從 A 收到 K。", "zh-Hans": "利用 8 个全摊主牌列和 4 个暂存格，将四种花色从 A 收到 K。", ja: "8列の場札と4つのフリーセルを使い、4つの組札をAからKまで作ります。", ko: "8개 공개 열과 4개의 프리 셀로 네 기초 더미를 A부터 K까지 만드세요.", es: "Construye cuatro fundaciones por palo, del As al Rey, usando ocho columnas y cuatro celdas libres.", "pt-BR": "Monte quatro fundações por naipe, do Ás ao Rei, usando oito colunas e quatro células livres.", fr: "Construisez quatre fondations par couleur, de l’As au Roi, avec huit colonnes et quatre cellules libres.", de: "Baue vier farbige Fundamente von Ass bis König mit acht offenen Spalten und vier freien Feldern.", it: "Costruisci quattro basi per seme dall'Asso al Re usando otto colonne e quattro celle libere.", ru: "Соберите четыре масти от туза до короля в восьми открытых колонках и четырёх свободных ячейках.", hi: "आठ खुली कॉलम और चार खाली सेल से चारों सूट की फाउंडेशन A से K तक बनाएँ।", ar: "ابنِ أربع أساسات حسب النوع من الآس إلى الملك باستخدام ثمانية أعمدة وأربع خلايا حرة." }, colorRule: "alternate" },
    pyramid: { titles: { en: "Pyramid Solitaire", "zh-Hant": "金字塔接龍", "zh-Hans": "金字塔接龙", ja: "ピラミッドソリティア", ko: "피라미드 솔리테어", es: "Solitario Pyramid", "pt-BR": "Paciência Pyramid", fr: "Solitaire Pyramid", de: "Pyramiden-Solitär", it: "Solitario Pyramid", ru: "Пасьянс «Пирамида»", hi: "पिरामिड सॉलिटेयर", ar: "سوليتير الهرم" }, target: { en: "Remove exposed pairs that add to 13. Kings clear alone; uncovered cards are the only cards you may use.", "zh-Hant": "消除總和為 13 的可用牌對；K 可單獨消除，只有未被覆蓋的牌才能使用。", "zh-Hans": "消除总和为 13 的可用牌对；K 可单独消除，只有未被覆盖的牌才能使用。", ja: "合計13になる表向きのペアを消します。Kは1枚で消せます。", ko: "합이 13인 공개 카드 쌍을 제거하세요. K는 혼자 제거할 수 있습니다.", es: "Elimina parejas expuestas que sumen 13. Los Reyes se eliminan solos.", "pt-BR": "Remova pares expostos que somem 13. Reis são removidos sozinhos.", fr: "Retirez les paires visibles dont la somme vaut 13. Les Rois partent seuls.", de: "Entferne sichtbare Paare mit Summe 13. Könige werden allein entfernt.", it: "Rimuovi le coppie scoperte che sommano 13. I Re si eliminano da soli.", ru: "Убирайте открытые пары с суммой 13. Короли убираются по одному.", hi: "खुले कार्डों के ऐसे जोड़े हटाएँ जिनका योग 13 हो। K अकेला हटता है।", ar: "أزل الأزواج المكشوفة التي مجموعها 13. يُزال الملك منفرداً." }, colorRule: "pair" },
    tripeaks: { titles: { en: "TriPeaks Solitaire", "zh-Hant": "三峰接龍", "zh-Hans": "三峰接龙", ja: "トライピークスソリティア", ko: "트라이픽스 솔리테어", es: "Solitario TriPeaks", "pt-BR": "Paciência TriPeaks", fr: "Solitaire TriPeaks", de: "TriPeaks-Solitär", it: "Solitario TriPeaks", ru: "Пасьянс «Три пика»", hi: "ट्राईपीक्स सॉलिटेयर", ar: "سوليتير القمم الثلاث" }, target: { en: "Clear three peaks by playing an exposed card one rank above or below the waste card. Build long Combos.", "zh-Hant": "將可用牌放到棄牌區頂牌的上一級或下一級，清除三座山並累積連鎖。", "zh-Hans": "将可用牌放到弃牌区顶牌的上一级或下一级，清除三座山并累积连锁。", ja: "捨て札の1つ上または下のランクを出して、3つの山を崩します。", ko: "버린 카드보다 한 단계 높거나 낮은 공개 카드를 내어 세 봉우리를 없애고 콤보를 만드세요.", es: "Juega una carta expuesta un rango arriba o abajo del descarte para despejar las tres cimas.", "pt-BR": "Jogue uma carta exposta um valor acima ou abaixo do descarte para limpar os três picos.", fr: "Jouez une carte visible d’un rang au-dessus ou au-dessous de la défausse pour vider les trois pics.", de: "Spiele eine offene Karte einen Rang über oder unter der Ablage, um die drei Gipfel zu räumen.", it: "Gioca una carta scoperta di un grado sopra o sotto lo scarto per liberare le tre cime.", ru: "Кладите открытую карту на один ранг выше или ниже сброса и очищайте три вершины.", hi: "कचरे के कार्ड से एक ऊपर या नीचे की खुली पत्ती खेलकर तीनों चोटियाँ हटाएँ।", ar: "العب بطاقة مكشوفة أعلى أو أدنى بدرجة من بطاقة المهملات لإزالة القمم الثلاث." }, colorRule: "sequence" },
    golf: { titles: { en: "Golf Solitaire", "zh-Hant": "高爾夫接龍", "zh-Hans": "高尔夫接龙", ja: "ゴルフソリティア", ko: "골프 솔리테어", es: "Solitario Golf", "pt-BR": "Paciência Golf", fr: "Solitaire Golf", de: "Golf-Solitär", it: "Solitario Golf", ru: "Пасьянс «Гольф»", hi: "गोल्फ सॉलिटेयर", ar: "سوليتير الغولف" }, target: { en: "Clear the seven columns by playing a card one rank above or below the waste card, planning the longest run.", "zh-Hant": "將 7 欄牌逐一清除；每次只能放棄牌區頂牌上一級或下一級的牌，規劃最長路線。", "zh-Hans": "将 7 列牌逐一清除；每次只能放弃牌区顶牌上一级或下一级的牌，规划最长路线。", ja: "捨て札の1つ上または下を出して7列を空にし、長い連続手を狙います。", ko: "버린 카드보다 한 단계 높거나 낮은 카드를 내어 7개 열을 비우세요.", es: "Despeja siete columnas jugando una carta un rango arriba o abajo del descarte y busca la serie más larga.", "pt-BR": "Limpe sete colunas jogando uma carta um valor acima ou abaixo do descarte e planeje a sequência mais longa.", fr: "Videz sept colonnes en jouant une carte un rang au-dessus ou au-dessous de la défausse.", de: "Räume sieben Spalten mit Karten einen Rang über oder unter der Ablage und plane lange Serien.", it: "Svuota sette colonne giocando una carta di un grado sopra o sotto lo scarto e pianifica la serie più lunga.", ru: "Очистите семь колонок, кладя карты на ранг выше или ниже сброса и планируя длинную серию.", hi: "कचरे के कार्ड से एक ऊपर या नीचे की पत्ती खेलकर सात कॉलम साफ़ करें और लंबी श्रृंखला बनाएँ।", ar: "أفرغ الأعمدة السبعة ببطاقات أعلى أو أدنى بدرجة من بطاقة المهملات وخطط لأطول سلسلة." }, colorRule: "sequence" },
    yukon: { titles: { en: "Yukon Solitaire", "zh-Hant": "育空接龍", "zh-Hans": "育空接龙", ja: "ユーコンソリティア", ko: "유콘 솔리테어", es: "Solitario Yukon", "pt-BR": "Paciência Yukon", fr: "Solitaire Yukon", de: "Yukon-Solitär", it: "Solitario Yukon", ru: "Пасьянс «Юкон»", hi: "युकोन सॉलिटेयर", ar: "سوليتير يوكون" }, target: { en: "Build four foundations from Ace to King. Move any exposed card with every exposed card below it; no Stock is used.", "zh-Hant": "建立四個 A 到 K 的花色收牌區。可移動任一張正面牌及其下方所有正面牌，沒有牌庫。", "zh-Hans": "建立四个 A 到 K 的花色收牌区。可移动任一张正面牌及其下方所有正面牌，没有牌库。", ja: "4つの組札をAからKまで作ります。表向きのカードとその下の表向きの列をまとめて動かせます。", ko: "네 기초 더미를 A부터 K까지 만드세요. 공개 카드와 아래의 모든 공개 카드를 함께 옮길 수 있으며 덱은 없습니다.", es: "Construye cuatro fundaciones del As al Rey. Mueve cualquier carta visible con todas las visibles debajo; no hay mazo.", "pt-BR": "Monte quatro fundações do Ás ao Rei. Mova qualquer carta exposta com todas as expostas abaixo; não há monte.", fr: "Construisez quatre fondations de l’As au Roi. Déplacez une carte visible avec toutes celles visibles dessous ; sans pioche.", de: "Baue vier Fundamente von Ass bis König. Bewege jede offene Karte mit allen offenen Karten darunter; ohne Stapel.", it: "Costruisci quattro basi dall'Asso al Re. Muovi una carta scoperta con tutte le scoperte sotto; non c'è tallone.", ru: "Соберите четыре масти от туза до короля. Перемещайте открытую карту со всеми открытыми картами ниже; колоды нет.", hi: "चार फाउंडेशन A से K तक बनाएँ। किसी भी खुले कार्ड के साथ नीचे के सभी खुले कार्ड चलाएँ; डेक नहीं है।", ar: "ابنِ أربع أساسات من الآس إلى الملك. حرّك أي بطاقة مكشوفة مع كل المكشوف أسفلها؛ لا توجد رزمة." }, colorRule: "alternate" },
  };

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const safeLocale = () => {
    const value = root.WonderI18n?.actualLocale?.() || root.WonderI18n?.locale?.() || document.documentElement.lang || "en";
    return LOCALES.includes(value) ? value : "en";
  };
  const text = (value, params = {}) => String(value || "").replace(/\{(\w+)\}/gu, (_match, key) => params[key] ?? "");
  const rankName = (rank) => RANKS[rank - 1] || String(rank);
  const isRed = (card) => card?.suit === "hearts" || card?.suit === "diamonds";
  const cardJSON = (card) => card ? card.toJSON() : null;
  const fromJSON = (raw) => raw ? Card.from(raw) : null;
  const deepCards = (raw = []) => raw.map(fromJSON);

  class ClassicSolitaire {
    constructor(variant) {
      this.variant = variant;
      this.history = [];
      this.seed = 0;
      this.newGame(Date.now());
    }

    newGame(seed = Date.now()) {
      this.seed = (Number(seed) || Date.now()) >>> 0;
      this.history = [];
      this.moves = 0;
      this.combo = 0;
      this.bestCombo = 0;
      this.won = false;
      this.lost = false;
      this.selected = null;
      this.deck = Deck.buildShuffled(this.seed);
      this.foundations = SUITS.map((suit) => new Foundation(suit));
      this.freeCells = [null, null, null, null];
      this.stock = [];
      this.waste = [];
      this.tableau = [];
      this.cards = [];
      if (this.variant === "freecell") this.setupFreeCell();
      if (this.variant === "yukon") this.setupYukon();
      if (this.variant === "golf") this.setupGolf();
      if (this.variant === "pyramid") this.setupPyramid();
      if (this.variant === "tripeaks") this.setupTriPeaks();
      return this;
    }

    setupFreeCell() {
      this.tableau = Array.from({ length: 8 }, () => []);
      this.deck.cards.forEach((card, index) => { card.faceUp = true; this.tableau[index % 8].push(card); });
    }

    setupYukon() {
      const lengths = [1, 6, 7, 8, 9, 10, 11];
      let offset = 0;
      this.tableau = lengths.map((length, column) => {
        const cards = this.deck.cards.slice(offset, offset + length);
        offset += length;
        // Yukon deals one face-up card in the first column and five face-up
        // cards at the bottom of every other column.
        cards.forEach((card, index) => { card.faceUp = column === 0 || index >= Math.max(0, length - 5); });
        return cards;
      });
    }

    setupGolf() {
      this.tableau = Array.from({ length: 7 }, () => []);
      let offset = 0;
      for (let row = 0; row < 5; row += 1) for (let column = 0; column < 7; column += 1) {
        const card = this.deck.cards[offset++]; card.faceUp = true; this.tableau[column].push(card);
      }
      this.stock = this.deck.cards.slice(offset);
      this.stock.forEach((card) => { card.faceUp = false; });
      this.drawStock(true);
    }

    setupPyramid() {
      const positions = [];
      for (let row = 0; row < 7; row += 1) for (let column = 0; column <= row; column += 1) positions.push({ row, column });
      this.cards = positions.map((position, index) => ({ card: this.deck.cards[index], removed: false, ...position, coveredBy: [] }));
      this.cards.forEach((entry) => { entry.card.faceUp = true; });
      for (let row = 0; row < 6; row += 1) for (let column = 0; column <= row; column += 1) {
        const current = this.cards.findIndex((entry) => entry.row === row && entry.column === column);
        const left = this.cards.findIndex((entry) => entry.row === row + 1 && entry.column === column);
        const right = this.cards.findIndex((entry) => entry.row === row + 1 && entry.column === column + 1);
        this.cards[current].coveredBy = [left, right];
      }
      this.stock = this.deck.cards.slice(28);
      this.stock.forEach((card) => { card.faceUp = false; });
    }

    setupTriPeaks() {
      const positions = [
        [0, 1], [0, 5], [0, 9],
        [1, 0], [1, 2], [1, 4], [1, 6], [1, 8], [1, 10],
        [2, 0], [2, 1], [2, 2], [2, 4], [2, 5], [2, 6], [2, 8], [2, 9], [2, 10],
        ...Array.from({ length: 10 }, (_value, index) => [3, index]),
      ];
      this.cards = positions.map(([row, column], index) => ({ card: this.deck.cards[index], removed: false, row, column, coveredBy: [] }));
      this.cards.forEach((entry) => { entry.card.faceUp = true; });
      const cover = [[3, 4], [5, 6], [7, 8], [9, 10], [10, 11], [12, 13], [13, 14], [15, 16], [16, 17], [18, 19], [19, 20], [20, 21], [21, 22], [22, 23], [23, 24], [24, 25], [25, 26], [26, 27]];
      cover.forEach((value, index) => { this.cards[index].coveredBy = value; });
      this.stock = this.deck.cards.slice(28);
      this.stock.forEach((card) => { card.faceUp = false; });
      this.drawStock(true);
    }

    snapshot() {
      return {
        seed: this.seed, moves: this.moves, combo: this.combo, bestCombo: this.bestCombo, won: this.won, lost: this.lost,
        foundations: this.foundations.map((pile) => pile.cards.map(cardJSON)),
        freeCells: this.freeCells.map(cardJSON), stock: this.stock.map(cardJSON), waste: this.waste.map(cardJSON),
        tableau: this.tableau.map((pile) => pile.map(cardJSON)),
        cards: this.cards.map((entry) => ({ card: cardJSON(entry.card), removed: entry.removed, row: entry.row, column: entry.column, coveredBy: entry.coveredBy })),
      };
    }

    restore(raw) {
      if (!raw) return;
      this.seed = raw.seed >>> 0; this.moves = raw.moves || 0; this.combo = raw.combo || 0; this.bestCombo = raw.bestCombo || 0; this.won = Boolean(raw.won); this.lost = Boolean(raw.lost);
      this.foundations = SUITS.map((suit, index) => Foundation.fromJSON(suit, raw.foundations?.[index] || []));
      this.freeCells = (raw.freeCells || []).map(fromJSON); this.stock = deepCards(raw.stock); this.waste = deepCards(raw.waste);
      this.tableau = (raw.tableau || []).map(deepCards);
      this.cards = (raw.cards || []).map((entry) => ({ card: fromJSON(entry.card), removed: Boolean(entry.removed), row: entry.row, column: entry.column, coveredBy: entry.coveredBy || [] }));
      this.selected = null;
    }

    pushHistory() { this.history.push(clone(this.snapshot())); }
    undo() { const previous = this.history.pop(); if (!previous) return false; this.restore(previous); return true; }
    top(column) { return this.tableau[column]?.at(-1) || null; }
    foundationFor(card) { return this.foundations[SUITS.indexOf(card?.suit)]; }
    foundationReady(card) { return this.foundationFor(card)?.isReadyFor(card) || false; }
    available(index) { const entry = this.cards[index]; return Boolean(entry && !entry.removed && entry.coveredBy.every((covered) => this.cards[covered]?.removed)); }
    remainingCards() { return this.cards.filter((entry) => !entry.removed).length; }
    sourceCard(source) {
      if (!source) return null;
      if (source.zone === "tableau") return this.tableau[source.pile]?.[source.row] || null;
      if (source.zone === "free") return this.freeCells[source.index] || null;
      if (source.zone === "waste") return this.waste.at(-1) || null;
      if (source.zone === "pyramid" || source.zone === "peak") return this.cards[source.index]?.card || null;
      return null;
    }

    sourceKey(source) { return source ? `${source.zone}:${source.index ?? source.pile ?? "top"}:${source.row ?? ""}` : ""; }

    hasLegalPair(source) {
      const card = this.sourceCard(source);
      if (!card) return false;
      if (card.rank === 13) return true;
      if (source.zone === "pyramid" && !this.available(source.index)) return false;
      if (source.zone === "waste") return this.cards.some((entry, index) => this.available(index) && Number(entry.card.rank) + Number(card.rank) === 13);
      return this.cards.some((entry, index) => index !== source.index && this.available(index) && Number(entry.card.rank) + Number(card.rank) === 13)
        || (this.waste.at(-1) ? Number(this.waste.at(-1).rank) + Number(card.rank) === 13 : false);
    }

    groupFrom(source) {
      if (!source) return [];
      if (source.zone === "free") return this.freeCells[source.index] ? [this.freeCells[source.index]] : [];
      if (source.zone === "tableau") {
        const pile = this.tableau[source.pile] || [];
        return pile.slice(source.row).filter(Boolean);
      }
      return this.sourceCard(source) ? [this.sourceCard(source)] : [];
    }

    validDescending(group) {
      return group.length > 0 && group.every((card) => card?.faceUp) && group.every((card, index) => index === 0 || (group[index - 1].rank === card.rank + 1 && isRed(group[index - 1]) !== isRed(card)));
    }

    canMoveToTableau(group, target) {
      const first = group[0];
      if (!first) return false;
      if (!target) return this.variant === "freecell" || first.rank === 13;
      return target.faceUp && target.rank === first.rank + 1 && isRed(target) !== isRed(first);
    }

    freeCellCapacity(destinationColumn = null) {
      const free = this.freeCells.filter(Boolean).length;
      const empty = this.tableau.filter((pile) => pile.length === 0).length - (destinationColumn !== null && this.tableau[destinationColumn]?.length === 0 ? 1 : 0);
      return Math.max(1, free + 1) * Math.pow(2, Math.max(0, empty));
    }

    legalTableauSource(source) {
      const group = this.groupFrom(source);
      if (!group.length) return false;
      // Yukon deliberately permits an arbitrary exposed tail. Only the first
      // card must fit the destination; the cards below it do not need to form
      // a red-black descending sequence of their own.
      if (this.variant === "yukon") return group.every((card) => card.faceUp);
      if (!this.validDescending(group)) return false;
      if (this.variant === "freecell") return true;
      return group.length === 1;
    }

    exposedTableauSource(source) {
      if (source?.zone !== "tableau") return true;
      const pile = this.tableau[source.pile] || [];
      return source.row === pile.length - 1;
    }

    removeSource(source, count = null) {
      const group = this.groupFrom(source);
      if (!group.length) return [];
      if (source.zone === "tableau") return this.tableau[source.pile].splice(source.row, count || group.length);
      if (source.zone === "free") { const card = this.freeCells[source.index]; this.freeCells[source.index] = null; return card ? [card] : []; }
      if (source.zone === "waste") return [this.waste.pop()];
      return [];
    }

    revealColumn(column) {
      const pile = this.tableau[column];
      const card = pile?.at(-1);
      if (card && !card.faceUp) { card.faceUp = true; return true; }
      return false;
    }

    moveFreeCell(source, destination) {
      const card = this.sourceCard(source);
      if (!card || !card.faceUp) return false;
      const group = destination.zone === "tableau" ? this.groupFrom(source) : [card];
      if (!group.length || (destination.zone === "tableau" && source.zone === "tableau" && !this.legalTableauSource(source))) return false;
      if (destination.zone === "free") {
        if (group.length !== 1 || this.freeCells[destination.index] || !this.exposedTableauSource(source)) return false;
      } else if (destination.zone === "foundation") {
        if (group.length !== 1 || destination.index !== SUITS.indexOf(group[0].suit) || !this.foundationReady(group[0]) || !this.exposedTableauSource(source)) return false;
      } else if (destination.zone === "tableau") {
        if (source.zone === "tableau" && source.pile === destination.pile) return false;
        if (!this.canMoveToTableau(group, this.top(destination.pile))) return false;
        if (group.length > this.freeCellCapacity(destination.pile)) return false;
      } else return false;
      this.pushHistory();
      const moving = this.removeSource(source, group.length);
      if (destination.zone === "free") this.freeCells[destination.index] = moving[0];
      if (destination.zone === "foundation") this.foundationFor(moving[0]).cards.push(moving[0]);
      if (destination.zone === "tableau") this.tableau[destination.pile].push(...moving);
      if (source.zone === "tableau") this.revealColumn(source.pile);
      this.moves += 1;
      this.checkWin();
      return true;
    }

    moveYukon(source, destination) {
      const card = this.sourceCard(source);
      if (source.zone !== "tableau" || !card || !card.faceUp) return false;
      const group = destination.zone === "tableau" ? this.groupFrom(source) : [card];
      if (destination.zone === "foundation") { if (destination.index !== SUITS.indexOf(card.suit) || !this.foundationReady(card) || !this.exposedTableauSource(source)) return false; }
      else if (destination.zone === "tableau") { if (!this.legalTableauSource(source) || source.pile === destination.pile || !this.canMoveToTableau(group, this.top(destination.pile))) return false; }
      else return false;
      this.pushHistory();
      const moving = this.removeSource(source, group.length);
      if (destination.zone === "foundation") this.foundationFor(moving[0]).cards.push(moving[0]);
      else this.tableau[destination.pile].push(...moving);
      this.revealColumn(source.pile); this.moves += 1; this.checkWin(); return true;
    }

    moveClassic(source, destination) {
      return this.variant === "freecell" ? this.moveFreeCell(source, destination) : this.moveYukon(source, destination);
    }

    pairPyramid(source) {
      if (!source) return false;
      const card = this.sourceCard(source);
      if (!card || (source.zone === "pyramid" && !this.available(source.index))) return false;
      const key = this.sourceKey(source);
      if (Number(card.rank) === 13) {
        this.pushHistory();
        if (source.zone === "pyramid") this.cards[source.index].removed = true; else this.waste.pop();
        this.moves += 1; this.selected = null; this.checkWin(); return true;
      }
      if (!this.selected) { this.selected = { ...source }; return true; }
      if (this.sourceKey(this.selected) === key) { this.selected = null; return true; }
      const other = this.sourceCard(this.selected);
      if (!other || Number(other.rank) + Number(card.rank) !== 13) return false;
      this.pushHistory();
      if (this.selected.zone === "pyramid") this.cards[this.selected.index].removed = true; else this.waste.pop();
      if (source.zone === "pyramid") this.cards[source.index].removed = true; else this.waste.pop();
      this.moves += 1; this.selected = null; this.checkWin(); return true;
    }

    sequencePlay(source) {
      const card = this.sourceCard(source);
      if (!card || (source.zone !== "tableau" && !(this.variant === "tripeaks" && source.zone === "peak"))) return false;
      if (this.variant === "tripeaks" && !this.available(source.index)) return false;
      if (this.variant === "golf" && source.row !== this.tableau[source.pile].length - 1) return false;
      const waste = this.waste.at(-1);
      if (!waste || Math.abs(waste.rank - card.rank) !== 1) return false;
      this.pushHistory();
      if (this.variant === "tripeaks") this.cards[source.index].removed = true;
      else this.tableau[source.pile].pop();
      this.waste.push(card); this.moves += 1; this.combo += 1; this.bestCombo = Math.max(this.bestCombo, this.combo); this.checkWin(); return true;
    }

    drawStock(initial = false) {
      if (!this.stock.length) { if (!initial) this.lost = true; return false; }
      if (!initial) this.pushHistory();
      const card = this.stock.pop(); card.faceUp = true; this.waste.push(card); this.combo = 0; if (!initial) { this.moves += 1; this.checkWin(); } return true;
    }

    checkWin() {
      if (this.variant === "pyramid" && this.remainingCards() === 0) this.won = true;
      if (this.variant === "tripeaks" && this.remainingCards() === 0) this.won = true;
      if (this.variant === "golf" && this.tableau.every((pile) => pile.length === 0)) this.won = true;
      if ((this.variant === "freecell" || this.variant === "yukon") && this.foundations.every((pile) => pile.cards.length === 13)) this.won = true;
      if (this.won) this.lost = false;
      if (!this.won && !this.stock.length && this.legalMoves().length === 0) this.lost = true;
    }

    legalMoves() {
      if (this.won || this.lost) return [];
      const moves = [];
      if (this.variant === "freecell" || this.variant === "yukon") {
        const sources = [];
        if (this.variant === "freecell") this.freeCells.forEach((card, index) => { if (card) sources.push({ zone: "free", index }); });
        this.tableau.forEach((pile, pileIndex) => pile.forEach((card, row) => { if (card.faceUp) sources.push({ zone: "tableau", pile: pileIndex, row }); }));
        sources.forEach((source) => {
          const card = this.sourceCard(source);
          const group = this.groupFrom(source);
          if (card && this.foundationReady(card) && this.exposedTableauSource(source)) moves.push({ source, destination: { zone: "foundation", index: SUITS.indexOf(card.suit) }, kind: "foundation" });
          if (this.variant === "freecell" && source.zone === "tableau" && this.exposedTableauSource(source)) {
            const freeIndex = this.freeCells.findIndex((cell) => !cell);
            if (freeIndex >= 0) moves.push({ source, destination: { zone: "free", index: freeIndex }, kind: "free" });
          }
          if (source.zone === "tableau" && !this.legalTableauSource(source)) return;
          this.tableau.forEach((_pile, pile) => { if (pile !== source.pile && this.canMoveToTableau(group, this.top(pile)) && (this.variant === "yukon" || group.length <= this.freeCellCapacity(pile))) moves.push({ source, destination: { zone: "tableau", pile }, kind: "tableau" });
          });
        });
      } else if (this.variant === "pyramid") {
        this.cards.forEach((entry, index) => { if (this.available(index)) { if (entry.card.rank === 13) moves.push({ source: { zone: "pyramid", index }, kind: "clear" }); else this.cards.forEach((other, otherIndex) => { if (otherIndex > index && this.available(otherIndex) && entry.card.rank + other.card.rank === 13) moves.push({ source: { zone: "pyramid", index }, destination: { zone: "pyramid", index: otherIndex }, kind: "pair" }); }); } });
        const waste = this.waste.at(-1);
        if (waste?.rank === 13) moves.push({ source: { zone: "waste" }, kind: "clear" });
        if (waste && waste.rank !== 13) this.cards.forEach((entry, index) => { if (this.available(index) && waste.rank + entry.card.rank === 13) moves.push({ source: { zone: "waste" }, destination: { zone: "pyramid", index }, kind: "pair" }); });
      } else {
        if (this.variant === "tripeaks") {
          this.cards.forEach((entry, index) => {
            if (!entry.removed && this.available(index) && this.waste.at(-1) && Math.abs(entry.card.rank - this.waste.at(-1).rank) === 1) moves.push({ source: { zone: "peak", index }, kind: "sequence" });
          });
        } else {
          this.tableau.forEach((pile, pileIndex) => pile.forEach((card, row) => { const source = { zone: "tableau", pile: pileIndex, row }; if (row === pile.length - 1 && this.waste.at(-1) && Math.abs(card.rank - this.waste.at(-1).rank) === 1) moves.push({ source, kind: "sequence" }); }));
        }
      }
      return moves;
    }

    tryHint() { const move = this.legalMoves()[0] || null; this.selected = move?.source ? { ...move.source } : null; return move; }
  }

  function cardMarkup(card, source, extra = "", row = null) {
    if (!card) return "";
    const rank = rankName(card.rank);
    const symbol = SYMBOLS[card.suit] || "";
    const label = card.faceUp ? text((COMMON[safeLocale()] || COMMON.en).ariaCard, { rank, suit: card.suit }) : (COMMON[safeLocale()] || COMMON.en).ariaBack;
    const rowStyle = Number.isInteger(row) ? ` style="--row:${row}"` : "";
    return `<button type="button" class="classic-card ${card.faceUp ? `front ${isRed(card) ? "red" : "black"}` : "back"} ${extra}"${rowStyle} data-card-id="${String(card.id).replaceAll('"', "&quot;")}" data-source='${JSON.stringify(source)}' aria-label="${label.replaceAll('"', "&quot;")}">${card.faceUp ? `<span class="rank top">${rank}</span><span class="suit">${symbol}</span><span class="rank bottom">${rank}</span>` : "<span class=\"back-mark\">✦</span>"}</button>`;
  }

  class ClassicView {
    constructor(config) {
      this.config = config;
      this.game = new ClassicSolitaire(config.variant);
      this.locale = safeLocale();
      this.audio = new SoundEngine("card_games_sound_v1");
      this.active = false;
      this.drag = null;
      this.hintTimer = null;
      this.hintMove = null;
      this.renderedCombo = 0;
      this.pendingMoveRects = null;
      this.pendingRemovedMotions = [];
      this.yukonCoachRetired = false;
      this.yukonCoachMove = null;
      this.pyramidCoachRetired = false;
      this.pyramidCoachMoves = null;
      this.nodes = {};
    }

    t(key, params) { const copy = COMMON[this.locale] || COMMON.en; return text(copy[key] || COMMON.en[key] || key, params); }
    variantCopy() { const copy = VARIANTS[this.config.variant] || VARIANTS.freecell; return { title: copy.titles[this.locale] || copy.titles.en, target: copy.target[this.locale] || copy.target.en }; }
    resetYukonCoach() { this.yukonCoachRetired = false; this.yukonCoachMove = null; }
    retireYukonCoach() { if (this.config.variant === "yukon") { this.yukonCoachRetired = true; this.yukonCoachMove = null; } }
    resetPyramidCoach() { this.pyramidCoachRetired = false; this.pyramidCoachMoves = null; }
    retirePyramidCoach() { if (this.config.variant === "pyramid") { this.pyramidCoachRetired = true; this.pyramidCoachMoves = null; } }
    prepareYukonCoach() {
      if (this.config.variant !== "yukon" || this.yukonCoachRetired || this.game.moves > 0 || this.game.won || this.game.lost) { this.yukonCoachMove = null; return; }
      if (!this.yukonCoachMove) this.yukonCoachMove = this.game.legalMoves().find((move) => move.kind === "tableau" && move.source?.zone === "tableau" && move.destination?.zone === "tableau") || null;
    }
    preparePyramidCoach() {
      if (this.config.variant !== "pyramid" || this.pyramidCoachRetired || this.game.moves > 0 || this.game.won || this.game.lost) { this.pyramidCoachMoves = null; return; }
      if (!this.pyramidCoachMoves) {
        const choices = this.game.legalMoves().filter((move) => move.kind === "pair" && move.source?.zone === "pyramid" && move.destination?.zone === "pyramid");
        this.pyramidCoachMoves = choices.length >= 2 ? choices.slice(0, 2) : null;
      }
    }
    yukonCoachText() {
      const move = this.yukonCoachMove;
      if (!move) return "";
      const fallback = (zone, index) => zone === "tableau" ? `${this.t("tableau")} ${Number(index) + 1}` : this.t("empty");
      const cardLabel = (card, fallbackLabel) => {
        if (!card) return fallbackLabel;
        const template = (COMMON[this.locale] || COMMON.en).ariaCard || COMMON.en.ariaCard;
        return text(template, { rank: rankName(card.rank), suit: card.suit }) || fallbackLabel;
      };
      const source = cardLabel(this.game.sourceCard(move.source), fallback(move.source?.zone, move.source?.pile));
      const destination = move.destination?.zone === "tableau"
        ? cardLabel(this.game.top(move.destination.pile), fallback(move.destination.zone, move.destination.pile))
        : fallback(move.destination?.zone, move.destination?.index);
      return text(YUKON_COACH_COPY[this.locale] || YUKON_COACH_COPY.en, { source, destination });
    }
    pyramidCoachText() { return this.pyramidCoachMoves?.length >= 2 ? this.t("pyramidCoach") : ""; }
    pyramidCoachClass(index) {
      if (this.config.variant !== "pyramid" || !this.pyramidCoachMoves?.length) return "";
      const pairIndexes = this.pyramidCoachMoves
        .map((move, pairIndex) => [move.source?.index, move.destination?.index].includes(index) ? pairIndex : -1)
        .filter((pairIndex) => pairIndex >= 0);
      return pairIndexes.length ? ` pyramid-coach-choice ${pairIndexes.map((pairIndex) => `pyramid-coach-pair-${pairIndex}`).join(" ")}` : "";
    }
    setText(selector, value) { const node = document.querySelector(selector); if (node) node.textContent = value; }
    setupNodes() {
      const ids = ["loadingPanel", "mainScreen", "battleScreen", "startBtn", "restartBtn", "newGameBtn", "battleBackBtn", "battleNewBtn", "battleRestartBtn", "undoBtn", "hintBtn", "tutorialBtn", "audioMenuBtn", "audioPopover", "localeSelect", "soundBtn", "soundStateText", "moveCount", "scoreValue", "comboValue", "boardStatus", "freeCells", "foundationArea", "stockPile", "wastePile", "tableauArea", "resultOverlay", "resultTitle", "resultText", "resultNewGame", "resultRestart", "resultClose", "toast"];
      ids.forEach((id) => { this.nodes[id] = document.getElementById(id); });
      this.nodes.board = document.getElementById("classicBoard");
    }
    mount() {
      this.setupNodes();
      if (!this.nodes.mainScreen || !this.nodes.board) return;
      this.locale = safeLocale();
      this.bind(); this.refreshCopy(); this.renderMain();
      this.nodes.loadingPanel?.classList.add("hidden");
      if (this.nodes.loadingPanel) this.nodes.loadingPanel.hidden = true;
    }
    bind() {
      this.nodes.startBtn?.addEventListener("click", () => this.showBattle());
      this.nodes.restartBtn?.addEventListener("click", () => { this.clearFeedback(); this.resetYukonCoach(); this.resetPyramidCoach(); this.game.newGame(this.game.seed); this.showBattle(); });
      this.nodes.newGameBtn?.addEventListener("click", () => { this.clearFeedback(); this.resetYukonCoach(); this.resetPyramidCoach(); this.game.newGame(Date.now()); this.showBattle(); });
      this.nodes.battleBackBtn?.addEventListener("click", () => this.showMain());
      this.nodes.battleNewBtn?.addEventListener("click", () => { this.clearFeedback(); this.resetYukonCoach(); this.resetPyramidCoach(); this.game.newGame(Date.now()); this.render(); });
      this.nodes.battleRestartBtn?.addEventListener("click", () => { this.clearFeedback(); this.resetYukonCoach(); this.resetPyramidCoach(); this.game.newGame(this.game.seed); this.render(); });
      this.nodes.undoBtn?.addEventListener("click", () => { if (this.game.undo()) { this.feedback(this.t("undo")); this.render(); } else this.feedback(this.t("noMoves")); });
      this.nodes.hintBtn?.addEventListener("click", () => this.hint());
      this.nodes.resultNewGame?.addEventListener("click", () => { this.clearFeedback(); this.resetYukonCoach(); this.resetPyramidCoach(); this.game.newGame(Date.now()); this.hideResult(); this.render(); });
      this.nodes.resultRestart?.addEventListener("click", () => { this.clearFeedback(); this.resetYukonCoach(); this.resetPyramidCoach(); this.game.newGame(this.game.seed); this.hideResult(); this.render(); });
      this.nodes.resultClose?.addEventListener("click", () => this.showMain());
      this.nodes.localeSelect?.addEventListener("change", (event) => { this.locale = event.target.value; try { localStorage.setItem("weightPlayLocale", this.locale); } catch (_error) {} this.refreshCopy(); this.render(); });
      this.nodes.soundBtn?.addEventListener("click", () => { this.audio.setEnabled(!this.audio.enabled); this.refreshSound(); });
      this.nodes.audioMenuBtn?.addEventListener("click", () => {
        const open = this.nodes.audioPopover?.classList.toggle("is-hidden") === false;
        this.nodes.audioMenuBtn.setAttribute("aria-expanded", String(open));
      });
      this.nodes.board.addEventListener("click", (event) => this.handleClick(event));
      this.nodes.board.addEventListener("pointerdown", (event) => this.handlePointerDown(event));
      this.nodes.board.addEventListener("pointermove", (event) => this.handlePointerMove(event));
      this.nodes.board.addEventListener("pointerup", (event) => this.handlePointerUp(event));
      this.nodes.stockPile?.addEventListener("click", () => { if (["pyramid", "tripeaks", "golf"].includes(this.config.variant)) { if (this.game.drawStock()) { const stockRemaining = this.game.stock.length; this.clearFeedback(); this.audio.draw(); this.render(); if (this.config.variant === "golf") this.showGolfStockCue(stockRemaining); } else this.feedback(this.t("stockEmpty")); } });
      root.addEventListener("wonder:locale-change", () => { this.locale = safeLocale(); this.refreshCopy(); this.render(); });
    }
    refreshSound() { if (this.nodes.soundBtn) { this.nodes.soundBtn.setAttribute("aria-pressed", String(this.audio.enabled)); this.nodes.soundBtn.textContent = this.audio.enabled ? this.t("soundOn") : this.t("soundOff"); } }
    refreshCopy() {
      const copy = this.variantCopy();
      document.documentElement.lang = this.locale;
      document.documentElement.dir = this.locale === "ar" ? "rtl" : "ltr";
      this.setText("[data-copy=title]", copy.title); this.setText("[data-copy=target]", copy.target); this.setText("[data-copy=type]", this.config.variant === "freecell" || this.config.variant === "yukon" ? this.t("foundations") : this.config.variant === "pyramid" ? "13" : this.t("combo"));
      ["startBtn", "restartBtn", "newGameBtn", "battleNewBtn", "battleRestartBtn", "undoBtn", "hintBtn", "resultNewGame", "resultRestart", "resultClose"].forEach((id) => { const node = this.nodes[id]; if (!node) return; const normalized = id.toLowerCase(); node.textContent = normalized.includes("restart") ? this.t("restart") : normalized.includes("new") ? this.t("newGame") : normalized.includes("undo") ? this.t("undo") : normalized.includes("hint") ? this.t("hint") : normalized === "resultclose" ? this.t("close") : this.t("start"); });
      this.setText("[data-label=free-cells]", this.t("freeCells")); this.setText("[data-label=foundations]", this.t("foundations")); this.setText("[data-label=stock]", this.t("stock")); this.setText("[data-label=waste]", this.t("waste")); this.setText("[data-label=tableau]", this.t("tableau"));
      this.refreshSound();
    }
    showMain() { this.active = false; this.nodes.battleScreen.hidden = true; this.nodes.mainScreen.hidden = false; document.body.dataset.screen = "main"; this.renderMain(); window.dispatchEvent(new Event("weightplay:shell-sync")); }
    showBattle() { this.active = true; this.nodes.mainScreen.hidden = true; this.nodes.battleScreen.hidden = false; document.body.dataset.screen = "battle"; this.render(); window.dispatchEvent(new Event("weightplay:battle-open")); window.dispatchEvent(new Event("weightplay:battle-sync")); window.dispatchEvent(new Event("weightplay:shell-sync")); this.nodes.battleBackBtn?.focus({ preventScroll: true }); }
    renderMain() { this.setText("#statistics", ""); }
    captureMoveRects() {
      return new Map([...this.nodes.board.querySelectorAll("[data-card-id]")].map((node) => [node.dataset.cardId, node.getBoundingClientRect()]));
    }
    captureRemovedMotions(sources = [], cue = "") {
      const wanted = new Set(sources.filter(Boolean).map((source) => JSON.stringify(source)));
      return [...this.nodes.board.querySelectorAll("[data-source]")]
        .filter((node) => wanted.has(node.dataset.source))
        .map((node) => ({ node: node.cloneNode(true), rect: node.getBoundingClientRect(), cue }));
    }
    animateMovedCards() {
      const previous = this.pendingMoveRects;
      this.pendingMoveRects = null;
      if (!previous || typeof Element.prototype.animate !== "function") return;
      this.nodes.board.querySelectorAll("[data-card-id]").forEach((node) => {
        const from = previous.get(node.dataset.cardId);
        if (!from) return;
        const to = node.getBoundingClientRect();
        const x = from.left - to.left;
        const y = from.top - to.top;
        if (Math.abs(x) < 1 && Math.abs(y) < 1) return;
        node.classList.add("is-moving");
        const animation = node.animate(
          [{ translate: `${x}px ${y}px` }, { translate: "0 0" }],
          { duration: 260, easing: "cubic-bezier(.2,.8,.25,1)", fill: "none" },
        );
        animation.addEventListener("finish", () => node.classList.remove("is-moving"), { once: true });
      });
    }
    animateRemovedCards() {
      const motions = this.pendingRemovedMotions;
      this.pendingRemovedMotions = [];
      motions.forEach(({ node, rect, cue }) => {
        node.classList.add("classic-card-motion");
        if (cue) node.classList.add(`classic-${cue}-motion`);
        node.removeAttribute("data-source");
        node.removeAttribute("data-card-id");
        Object.assign(node.style, { position: "fixed", left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px`, margin: "0" });
        document.body.append(node);
        const finish = () => node.remove();
        if (typeof node.animate === "function") {
          const pairCue = cue === "pair";
          const animation = node.animate(
            pairCue
              ? [{ opacity: 1, transform: "translateY(0) scale(1)" }, { opacity: 1, transform: "translateY(-8px) scale(1.08)" }, { opacity: 0, transform: "translateY(-20px) scale(.78)" }]
              : [{ opacity: 1, transform: "translateY(0) scale(1)" }, { opacity: 0, transform: "translateY(-14px) scale(.86)" }],
            { duration: pairCue ? 340 : 260, easing: "cubic-bezier(.2,.8,.25,1)", fill: "forwards" },
          );
          animation.addEventListener("finish", finish, { once: true });
        } else window.setTimeout(finish, 260);
      });
    }
    validTargets() {
      if (this.config.variant !== "freecell" || !this.game.selected) return new Set();
      const selected = JSON.stringify(this.game.selected);
      return new Set(this.game.legalMoves()
        .filter((move) => JSON.stringify(move.source) === selected)
        .map((move) => JSON.stringify(move.destination)));
    }
    markValidTargets() {
      const targets = this.validTargets();
      this.nodes.board.querySelectorAll("[data-dest]").forEach((node) => {
        let destination = null;
        try { destination = JSON.parse(node.dataset.dest); } catch (_error) {}
        node.classList.toggle("valid-target", Boolean(destination && targets.has(JSON.stringify(destination))));
      });
    }
    canSelect(source) {
      if (!source) return false;
      if (source.zone === "free") return Boolean(this.game.freeCells[source.index]);
      if (source.zone !== "tableau") return false;
      return Boolean(this.game.sourceCard(source)?.faceUp && this.game.legalTableauSource(source));
    }
    cardDestination(source) { if (source.zone === "tableau") return { zone: "tableau", pile: source.pile }; if (source.zone === "free") return { zone: "free", index: source.index }; return null; }
    sequenceCueSize(source, destination) {
      if (this.config.variant !== "freecell" || source?.zone !== "tableau" || destination?.zone !== "tableau") return 0;
      return this.game.groupFrom(source).length;
    }
    showSequenceCue(size) {
      if (size < 2 || !this.nodes.boardStatus) return;
      const message = this.config.sequenceCue?.[this.locale];
      if (!message) return;
      this.nodes.boardStatus.dataset.state = "success";
      this.nodes.boardStatus.textContent = text(message, { count: size });
      clearTimeout(this.statusTimer);
      this.statusTimer = setTimeout(() => {
        if (this.nodes.boardStatus && !this.game.won && !this.game.lost) {
          delete this.nodes.boardStatus.dataset.state;
          this.nodes.boardStatus.textContent = "";
        }
      }, 1400);
    }
    showTriPeaksCue(clearedPeak) {
      if (this.config.variant !== "tripeaks" || !this.nodes.boardStatus || this.game.won || this.game.lost) return;
      this.nodes.boardStatus.dataset.state = clearedPeak ? "peak" : "success";
      this.nodes.boardStatus.textContent = this.t(clearedPeak ? "peakClear" : "tripeaksChain", { count: this.game.combo });
      clearTimeout(this.statusTimer);
      this.statusTimer = setTimeout(() => {
        if (this.nodes.boardStatus && !this.game.won && !this.game.lost) {
          delete this.nodes.boardStatus.dataset.state;
          this.nodes.boardStatus.textContent = "";
        }
      }, 1400);
    }
    showGolfStockCue(count) {
      if (this.config.variant !== "golf" || !this.nodes.boardStatus || this.game.won || this.game.lost || count <= 0) return;
      const key = count === 1 ? "golfStockFinal" : count <= 5 ? "golfStockLow" : "golfStockSafe";
      this.nodes.boardStatus.dataset.state = count <= 5 ? "stock-low" : "stock";
      this.nodes.boardStatus.textContent = this.t(key, { count });
      clearTimeout(this.statusTimer);
      this.statusTimer = setTimeout(() => {
        if (this.nodes.boardStatus && !this.game.won && !this.game.lost) {
          delete this.nodes.boardStatus.dataset.state;
          this.nodes.boardStatus.textContent = "";
        }
      }, 1400);
    }
    showGolfComboCue() {
      if (this.config.variant !== "golf" || !this.nodes.boardStatus || this.game.won || this.game.lost || this.game.combo < 2) return;
      this.nodes.boardStatus.dataset.state = "golf-combo";
      this.nodes.boardStatus.textContent = this.t("golfComboLong", { count: this.game.combo, best: this.game.bestCombo });
      clearTimeout(this.statusTimer);
      this.statusTimer = setTimeout(() => {
        if (this.nodes.boardStatus && !this.game.won && !this.game.lost) {
          delete this.nodes.boardStatus.dataset.state;
          this.nodes.boardStatus.textContent = "";
        }
      }, 1500);
    }
    showPairCue() {
      if (!this.nodes.boardStatus || this.game.won || this.game.lost) return;
      this.nodes.boardStatus.dataset.state = "pair";
      this.nodes.boardStatus.textContent = this.t("pairClear");
      clearTimeout(this.statusTimer);
      this.statusTimer = setTimeout(() => {
        if (this.nodes.boardStatus && !this.game.won && !this.game.lost) {
          delete this.nodes.boardStatus.dataset.state;
          this.nodes.boardStatus.textContent = "";
        }
      }, 1250);
    }
    handleClick(event) {
      if (event.target.closest("[data-action=clear-toast]")) return;
      const card = event.target.closest("[data-source]");
      const destination = event.target.closest("[data-dest]");
      if (!card && !destination) return;
      const source = card ? JSON.parse(card.dataset.source) : null;
      const hintedSequenceSource = this.hintMove
        && (this.config.variant === "tripeaks" || this.config.variant === "golf")
        && JSON.stringify(source) === JSON.stringify(this.hintMove.source);
      const hintedPyramidClear = this.hintMove
        && this.config.variant === "pyramid"
        && this.hintMove.kind === "clear"
        && JSON.stringify(source) === JSON.stringify(this.hintMove.source);
      if (card && this.game.selected && JSON.stringify(source) === JSON.stringify(this.game.selected) && !hintedSequenceSource && !hintedPyramidClear) {
        this.game.selected = null;
        this.render();
        return;
      }
      if (hintedPyramidClear) { this.game.selected = null; this.hintMove = null; }
      const dest = destination ? JSON.parse(destination.dataset.dest) : (source ? this.cardDestination(source) : null);
      if (card && (this.config.variant === "freecell" || this.config.variant === "yukon") && this.game.selected && source?.zone === "tableau" && this.game.selected.zone === "tableau" && dest?.zone === "tableau" && dest.pile === this.game.selected.pile) {
        this.game.selected = source;
        this.render();
        return;
      }
      if (this.config.variant === "pyramid") {
        if (!source) return;
        const previousSelected = this.game.selected;
        const movesBefore = this.game.moves;
        const sources = previousSelected ? [previousSelected, source] : [source];
        this.pendingMoveRects = previousSelected || this.game.sourceCard(source)?.rank === 13 ? this.captureMoveRects() : null;
        const pairCleared = Boolean(previousSelected && JSON.stringify(previousSelected) !== JSON.stringify(source) && Number(this.game.sourceCard(source)?.rank) !== 13);
        this.pendingRemovedMotions = previousSelected || this.game.sourceCard(source)?.rank === 13 ? this.captureRemovedMotions(sources, pairCleared ? "pair" : "") : [];
        if (this.game.pairPyramid(source)) {
          const pairMoved = pairCleared && this.game.moves > movesBefore;
          this.clearFeedback(); this.hintMove = null; this.audio.place(); if (pairMoved) this.retirePyramidCoach(); this.render();
          if (pairMoved) this.showPairCue();
          if (this.game.moves === movesBefore && !this.game.hasLegalPair(source)) this.feedback(this.t("noMoves"));
        } else {
          this.pendingMoveRects = null; this.pendingRemovedMotions = []; this.feedback(this.t("pairWrong"));
        }
        return;
      }
      if (this.config.variant === "tripeaks" || this.config.variant === "golf") {
        this.pendingMoveRects = source ? this.captureMoveRects() : null;
        const clearedPeak = this.config.variant === "tripeaks" && source?.zone === "peak" && this.game.cards[source.index]?.row === 0;
        if (source && this.game.sequencePlay(source)) { this.clearFeedback(); this.hintMove = null; this.audio.place(); this.render(); if (this.config.variant === "tripeaks") this.showTriPeaksCue(clearedPeak); if (this.config.variant === "golf") this.showGolfComboCue(); } else { this.pendingMoveRects = null; if (source) this.feedback(this.t("wrong")); }
        return;
      }
      if (!source && !dest) return;
      if (this.game.selected && dest) {
        this.pendingMoveRects = this.captureMoveRects();
        const sequenceSize = this.sequenceCueSize(this.game.selected, dest);
        if (this.game.moveClassic(this.game.selected, dest)) { this.clearFeedback(); this.hintMove = null; this.audio.place(); this.retireYukonCoach(); this.game.selected = null; this.render(); this.showSequenceCue(sequenceSize); }
        else { this.pendingMoveRects = null; this.feedback(this.t("wrong")); }
        return;
      }
      if (dest && !source && !this.game.selected) { this.feedback(this.t("wrong")); return; }
      if (source) {
        if (!this.canSelect(source)) { this.feedback(this.t("wrong")); return; }
        this.clearFeedback();
        this.hintMove = null;
        this.game.selected = this.game.selected && JSON.stringify(this.game.selected) === JSON.stringify(source) ? null : source;
        if (this.game.selected && !this.game.legalMoves().some((move) => JSON.stringify(move.source) === JSON.stringify(this.game.selected))) {
          this.game.selected = null;
          this.feedback(this.t("noMoves"));
        }
        this.render();
      }
    }
    handlePointerDown(event) {
      const card = event.target.closest("[data-source]"); if (!card) return;
      this.drag = { source: JSON.parse(card.dataset.source), startX: event.clientX, startY: event.clientY, moved: false, card };
      card.setPointerCapture?.(event.pointerId);
    }
    handlePointerMove(event) { if (!this.drag) return; const dx = event.clientX - this.drag.startX; const dy = event.clientY - this.drag.startY; if (!this.drag.moved && Math.hypot(dx, dy) > 8) this.drag.moved = true; }
    handlePointerUp(event) {
      if (!this.drag) return; const drag = this.drag; this.drag = null; if (!drag.moved) return;
      const target = document.elementFromPoint(event.clientX, event.clientY)?.closest?.("[data-source], [data-dest]");
      if (!target) { this.feedback(this.t("wrong")); return; }
      const source = drag.source; const targetSource = target.dataset.source ? JSON.parse(target.dataset.source) : null; const dest = target.dataset.dest ? JSON.parse(target.dataset.dest) : this.cardDestination(targetSource);
      if ((this.config.variant === "freecell" || this.config.variant === "yukon") && dest) {
        this.pendingMoveRects = this.captureMoveRects();
        const sequenceSize = this.sequenceCueSize(source, dest);
        if (this.game.moveClassic(source, dest)) { this.clearFeedback(); this.hintMove = null; this.audio.place(); this.retireYukonCoach(); this.render(); this.showSequenceCue(sequenceSize); }
        else { this.pendingMoveRects = null; this.feedback(this.t("wrong")); }
      }
      else if (this.config.variant === "pyramid") {
        const movesBefore = this.game.moves;
        this.pendingMoveRects = this.captureMoveRects();
        const pairCleared = Boolean(targetSource && JSON.stringify(source) !== JSON.stringify(targetSource) && Number(this.game.sourceCard(source)?.rank) !== 13);
        this.pendingRemovedMotions = this.captureRemovedMotions([source, targetSource], pairCleared ? "pair" : "");
        this.game.pairPyramid(source);
        if (targetSource && JSON.stringify(source) !== JSON.stringify(targetSource) && this.game.moves === movesBefore) this.game.pairPyramid(targetSource);
        if (this.game.moves !== movesBefore) { this.clearFeedback(); this.hintMove = null; this.audio.place(); if (pairCleared) this.retirePyramidCoach(); this.render(); if (pairCleared) this.showPairCue(); }
        else { this.pendingMoveRects = null; this.pendingRemovedMotions = []; this.feedback(this.t("pairWrong")); }
      }
      else if (this.config.variant === "tripeaks") {
        this.pendingMoveRects = this.captureMoveRects();
        const clearedPeak = source?.zone === "peak" && this.game.cards[source.index]?.row === 0;
        if (this.game.sequencePlay(source)) { this.clearFeedback(); this.hintMove = null; this.audio.place(); this.render(); this.showTriPeaksCue(clearedPeak); }
        else { this.pendingMoveRects = null; this.feedback(this.t("wrong")); }
      }
      else this.feedback(this.t("wrong"));
    }
    hint() { const move = this.game.tryHint(); if (!move) { this.hintMove = null; this.feedback(this.game.won ? this.t("winText") : this.t("noMoves")); return; } this.clearFeedback(); this.hintMove = move; this.render(); clearTimeout(this.hintTimer); this.hintTimer = setTimeout(() => { this.game.selected = null; this.hintMove = null; this.render(); }, 2400); }
    clearFeedback() { if (!this.nodes.toast) return; this.nodes.toast.hidden = true; this.nodes.toast.textContent = ""; clearTimeout(this.toastTimer); }
    feedback(message) { if (!this.nodes.toast) return; this.nodes.toast.setAttribute("role", "alert"); this.nodes.toast.setAttribute("aria-live", "assertive"); this.nodes.toast.textContent = message; this.nodes.toast.hidden = false; if (this.nodes.boardStatus && !this.game.won && !this.game.lost) this.nodes.boardStatus.textContent = message; clearTimeout(this.toastTimer); clearTimeout(this.statusTimer); this.toastTimer = setTimeout(() => { this.nodes.toast.hidden = true; }, 1800); this.statusTimer = setTimeout(() => { if (this.nodes.boardStatus && !this.game.won && !this.game.lost) this.nodes.boardStatus.textContent = ""; }, 1800); }
    hideResult() { if (this.nodes.resultOverlay) this.nodes.resultOverlay.hidden = true; }
    showResult() { if (!this.nodes.resultOverlay || (!this.game.won && !this.game.lost)) return; this.nodes.resultOverlay.hidden = false; this.nodes.resultTitle.textContent = this.game.won ? this.t("win") : this.t("lose"); const recap = this.config.variant === "golf" ? ` ${this.t("golfResultRecap", { best: this.game.bestCombo })}` : ""; this.nodes.resultText.textContent = `${this.game.won ? this.t("winText") : this.t("loseText")}${recap}`; }
    render() {
      this.hideResult();
      this.nodes.moveCount.textContent = String(this.game.moves);
      this.nodes.scoreValue.textContent = this.config.variant === "tripeaks" || this.config.variant === "golf" ? String(this.game.bestCombo) : String(this.game.foundations.reduce((sum, pile) => sum + pile.cards.length, 0));
      this.nodes.comboValue.textContent = this.game.combo ? `×${this.game.combo}` : "—";
      this.nodes.comboValue.setAttribute("aria-live", "polite");
      if ((this.config.variant === "tripeaks" || this.config.variant === "golf") && this.game.combo > 0 && this.game.combo !== this.renderedCombo) {
        this.nodes.comboValue.classList.remove("combo-pop");
        void this.nodes.comboValue.offsetWidth;
        this.nodes.comboValue.classList.add("combo-pop");
      } else if (!this.game.combo) this.nodes.comboValue.classList.remove("combo-pop");
      this.renderedCombo = this.game.combo;
      this.prepareYukonCoach();
      this.preparePyramidCoach();
      delete this.nodes.boardStatus.dataset.state;
      this.nodes.boardStatus.textContent = this.game.won ? this.t("win") : this.game.lost ? this.t("lose") : this.pyramidCoachText() || this.yukonCoachText();
      if (!this.game.won && !this.game.lost && this.pyramidCoachMoves?.length >= 2) this.nodes.boardStatus.dataset.state = "pyramid-coach";
      else if (!this.game.won && !this.game.lost && this.yukonCoachMove) this.nodes.boardStatus.dataset.state = "coach";
      this.renderSlots(); this.renderTableau(); this.markValidTargets(); this.showResult(); this.animateMovedCards(); this.animateRemovedCards();
    }
    renderSlots() {
      const selectedClass = (source) => this.game.selected && JSON.stringify(this.game.selected) === JSON.stringify(source) ? " selected" : "";
      const usesFreeCells = this.game.variant === "freecell";
      const usesFoundations = this.game.variant === "freecell" || this.game.variant === "yukon";
      const usesStock = ["pyramid", "tripeaks", "golf"].includes(this.game.variant);
      const setGroup = (node, visible) => { const group = node?.closest(".board-group"); if (group) group.hidden = !visible; return group; };
      const updateGroupLayout = (node) => { const container = node?.closest(".board-top, .board-middle"); if (!container) return; const count = [...container.children].filter((child) => !child.hidden).length; container.dataset.visibleGroups = String(count); container.hidden = count === 0; };
      if (this.nodes.freeCells) this.nodes.freeCells.innerHTML = usesFreeCells ? this.game.freeCells.map((card, index) => `<div class="classic-slot free-slot" data-dest='${JSON.stringify({ zone: "free", index })}' aria-label="${this.t("freeCells")} ${index + 1}">${card ? cardMarkup(card, { zone: "free", index }, `slot-card${selectedClass({ zone: "free", index })}`) : `<span>${this.t("empty")}</span>`}</div>`).join("") : "";
      if (this.nodes.foundationArea) this.nodes.foundationArea.innerHTML = usesFoundations ? this.game.foundations.map((pile, index) => { const card = pile.top(); return `<div class="classic-slot foundation-slot" data-dest='${JSON.stringify({ zone: "foundation", index })}' aria-label="${this.t("foundations")} ${index + 1}">${card ? cardMarkup(card, { zone: "foundation", index }, "slot-card") : `<span>${SYMBOLS[SUITS[index]]}</span>`}</div>`; }).join("") : "";
      const stockCount = this.game.stock.length;
      if (this.nodes.stockPile) this.nodes.stockPile.innerHTML = stockCount ? `<span class="stock-back">✦</span><b>${stockCount}</b>` : `<span>${this.t("empty")}</span>`;
      if (this.nodes.wastePile) { const card = this.game.waste.at(-1); this.nodes.wastePile.innerHTML = card ? cardMarkup(card, { zone: "waste" }, `slot-card${selectedClass({ zone: "waste" })}`) : `<span>${this.t("empty")}</span>`; }
      setGroup(this.nodes.freeCells, usesFreeCells);
      setGroup(this.nodes.foundationArea, usesFoundations);
      setGroup(this.nodes.stockPile, usesStock);
      setGroup(this.nodes.wastePile, usesStock);
      updateGroupLayout(this.nodes.freeCells); updateGroupLayout(this.nodes.stockPile);
    }
    renderTableau() {
      const area = this.nodes.tableauArea; if (!area) return;
      area.className = `tableau-area variant-${this.config.variant}`;
      if (this.config.variant === "pyramid") area.innerHTML = Array.from({ length: 7 }, (_v, row) => `<div class="pyramid-row">${this.game.cards.filter((entry) => entry.row === row).map((entry) => { const cardIndex = this.game.cards.indexOf(entry); const availableClass = this.game.available(cardIndex) ? "available" : "covered"; return entry.removed ? `<div class="removed-card"></div>` : cardMarkup(entry.card, { zone: "pyramid", index: cardIndex }, `${availableClass}${this.pyramidCoachClass(cardIndex)}`); }).join("")}</div>`).join("");
      else if (this.config.variant === "tripeaks") area.innerHTML = Array.from({ length: 4 }, (_v, row) => `<div class="peak-row">${this.game.cards.filter((entry) => entry.row === row).map((entry) => { const index = this.game.cards.indexOf(entry); return entry.removed ? `<div class="removed-card"></div>` : cardMarkup(entry.card, { zone: "peak", index }, this.game.available(index) ? "available" : "covered"); }).join("")}</div>`).join("");
      else {
        const coachSource = this.yukonCoachMove?.source;
        const coachDestination = this.yukonCoachMove?.destination;
        const isCoachSource = (source) => this.config.variant === "yukon" && coachSource && JSON.stringify(source) === JSON.stringify(coachSource);
        const isCoachDestination = (destination) => this.config.variant === "yukon" && coachDestination && JSON.stringify(destination) === JSON.stringify(coachDestination);
        area.innerHTML = this.game.tableau.map((pile, pileIndex) => {
          const destination = { zone: "tableau", pile: pileIndex };
          const destinationClass = isCoachDestination(destination) ? " yukon-coach-destination" : "";
          const cards = pile.length ? pile.map((card, row) => {
            const source = { zone: "tableau", pile: pileIndex, row };
            const selectedClass = this.game.selected?.zone === "tableau" && this.game.selected.pile === pileIndex && this.game.selected.row === row ? " selected" : "";
            const coachClass = isCoachSource(source) ? " yukon-coach-source" : "";
            return cardMarkup(card, source, `${row === pile.length - 1 ? "available" : "stacked"}${selectedClass}${coachClass}`, row);
          }).join("") : `<span>${this.t("empty")}</span>`;
          return `<div class="classic-pile ${pile.length ? "" : "empty-pile"}${destinationClass}" data-dest='${JSON.stringify(destination)}' aria-label="${this.t("tableau")} ${pileIndex + 1}">${cards}</div>`;
        }).join("");
        if (this.config.variant === "freecell") {
          const step = Number.parseFloat(getComputedStyle(area).getPropertyValue("--classic-pile-step")) || 19;
          area.querySelectorAll(".classic-pile").forEach((node, pileIndex) => {
            const count = this.game.tableau[pileIndex]?.length || 0;
            const cardHeight = node.getBoundingClientRect().height;
            node.style.setProperty("--classic-pile-height", `${cardHeight + Math.max(0, count - 1) * step}px`);
          });
        }
      }
      if (this.game.selected) area.querySelectorAll("[data-source]").forEach((node) => { try { if (JSON.stringify(JSON.parse(node.dataset.source)) === JSON.stringify(this.game.selected)) node.classList.add("selected"); } catch (_error) {} });
    }
  }

  root.WPClassicSolitaire = Object.freeze({ mount(config) { const view = new ClassicView(config); view.mount(); root.__classicSolitaireView = view; return view; }, variants: VARIANTS });
})(window);
