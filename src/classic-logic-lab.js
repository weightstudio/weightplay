(function () {
  "use strict";

  const LOCALES = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const ROUTE_LOCALES = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const LOCALE_SELECTION_PATH_KEY = "classicLogicLocaleSelectionPath";
  const LOCALE_SELECTION_VALUE_KEY = "classicLogicLocaleSelectionValue";
  const localeLabels = { en: "English", "zh-Hant": "繁體中文", "zh-Hans": "简体中文", ja: "日本語", ko: "한국어", es: "Español", "pt-BR": "Português", fr: "Français", de: "Deutsch", it: "Italiano", ru: "Русский", hi: "हिन्दी", ar: "العربية" };
  const shared = {
    en: { settings: "Settings", sound: "Sound", on: "On", off: "Off", language: "Language", preview: "Owner Preview · Not public", start: "Start Game", back: "Back to WeightPlay", menu: "Menu", replay: "Replay", reset: "New Puzzle", hint: "Hint", undo: "Undo", moves: "Moves", time: "Time", goal: "Goal", how: "How to play", ready: "Choose a level and start.", solved: "Puzzle solved!", failed: "Try again and read the board.", win: "You cleared it!", lose: "Round over", close: "Close", easy: "Easy", medium: "Medium", hard: "Hard", submit: "Submit", clear: "Clear", rotate: "Rotate", place: "Place", readyFleet: "Ready Fleet", choose: "Choose", player: "You", opponent: "Opponent", selectSource: "Select a source", selectTarget: "Select a destination", noMoves: "No legal moves remain.", turn: "Your turn", thinking: "Thinking…", score: "Score", level: "Level", flagMode: "Flag mode", revealMode: "Reveal mode", codePick: "Pick a color", correct: "Correct", near: "Near", hit: "Hit", miss: "Miss", sunk: "Sunk", placeShip: "Place your ship", attack: "Choose a target", noRepeat: "Choose an open water cell." },
    "zh-Hant": { settings: "設定", sound: "音效", on: "開", off: "關", language: "語言", preview: "Owner Preview · 尚未公開", start: "開始遊戲", back: "返回 WeightPlay", menu: "選單", replay: "再玩一次", reset: "新謎題", hint: "提示", undo: "還原", moves: "步數", time: "時間", goal: "目標", how: "玩法提示", ready: "選擇難度後開始。", solved: "謎題完成！", failed: "再試一次，先讀懂盤面。", win: "你成功破解了！", lose: "回合結束", close: "關閉", easy: "簡單", medium: "中等", hard: "困難", submit: "送出", clear: "清除", rotate: "旋轉", place: "放置", readyFleet: "艦隊就位", choose: "選擇", player: "你", opponent: "對手", selectSource: "選擇起點", selectTarget: "選擇目標", noMoves: "沒有合法步可走。", turn: "你的回合", thinking: "思考中…", score: "分數", level: "難度", flagMode: "插旗模式", revealMode: "翻開模式", codePick: "選擇顏色", correct: "位置正確", near: "顏色正確", hit: "命中", miss: "未命中", sunk: "擊沉", placeShip: "配置你的船艦", attack: "選擇攻擊座標", noRepeat: "請選擇尚未攻擊的海域。" },
    "zh-Hans": { settings: "设置", sound: "音效", on: "开", off: "关", language: "语言", preview: "Owner Preview · 尚未公开", start: "开始游戏", back: "返回 WeightPlay", menu: "菜单", replay: "再玩一次", reset: "新谜题", hint: "提示", undo: "撤销", moves: "步数", time: "时间", goal: "目标", how: "玩法提示", ready: "选择难度后开始。", solved: "谜题完成！", failed: "再试一次，先读懂盘面。", win: "你成功破解了！", lose: "回合结束", close: "关闭", easy: "简单", medium: "中等", hard: "困难", submit: "提交", clear: "清除", rotate: "旋转", place: "放置", readyFleet: "舰队就位", choose: "选择", player: "你", opponent: "对手", selectSource: "选择起点", selectTarget: "选择目标", noMoves: "没有合法步可走。", turn: "你的回合", thinking: "思考中…", score: "分数", level: "难度", flagMode: "插旗模式", revealMode: "翻开模式", codePick: "选择颜色", correct: "位置正确", near: "颜色正确", hit: "命中", miss: "未命中", sunk: "击沉", placeShip: "配置你的船舰", attack: "选择攻击坐标", noRepeat: "请选择尚未攻击的海域。" },
    ja: { settings: "設定", sound: "サウンド", on: "オン", off: "オフ", language: "言語", preview: "Owner Preview · 未公開", start: "ゲーム開始", back: "WeightPlay に戻る", menu: "メニュー", replay: "もう一度", reset: "新しいパズル", hint: "ヒント", undo: "元に戻す", moves: "手数", time: "時間", goal: "目標", how: "遊び方", ready: "難易度を選んで開始します。", solved: "クリア！", failed: "もう一度、盤面を読みましょう。", win: "解けました！", lose: "ラウンド終了", close: "閉じる", easy: "初級", medium: "中級", hard: "上級", submit: "決定", clear: "消去", rotate: "回転", place: "配置", readyFleet: "艦隊を準備", choose: "選択", player: "あなた", opponent: "相手", selectSource: "始点を選択", selectTarget: "移動先を選択", noMoves: "合法手がありません。", turn: "あなたの番", thinking: "考え中…", score: "スコア", level: "難易度", flagMode: "旗モード", revealMode: "開くモード", codePick: "色を選ぶ", correct: "位置一致", near: "色一致", hit: "命中", miss: "外れ", sunk: "撃沈", placeShip: "艦船を配置", attack: "座標を攻撃", noRepeat: "未攻撃の海域を選んでください。" },
    ko: { settings: "설정", sound: "소리", on: "켜짐", off: "꺼짐", language: "언어", preview: "Owner Preview · 공개 전", start: "게임 시작", back: "WeightPlay로 돌아가기", menu: "메뉴", replay: "다시 하기", reset: "새 퍼즐", hint: "힌트", undo: "되돌리기", moves: "이동", time: "시간", goal: "목표", how: "플레이 방법", ready: "난이도를 고르고 시작하세요.", solved: "퍼즐 완료!", failed: "보드를 읽고 다시 도전하세요.", win: "클리어했습니다!", lose: "라운드 종료", close: "닫기", easy: "쉬움", medium: "보통", hard: "어려움", submit: "제출", clear: "지우기", rotate: "회전", place: "배치", readyFleet: "함대 준비", choose: "선택", player: "나", opponent: "상대", selectSource: "출발지 선택", selectTarget: "목적지 선택", noMoves: "가능한 수가 없습니다.", turn: "내 차례", thinking: "생각 중…", score: "점수", level: "난이도", flagMode: "깃발 모드", revealMode: "열기 모드", codePick: "색상 선택", correct: "위치 일치", near: "색상 일치", hit: "명중", miss: "빗나감", sunk: "침몰", placeShip: "배를 배치하세요", attack: "좌표를 공격하세요", noRepeat: "아직 공격하지 않은 칸을 고르세요." },
    es: { settings: "Ajustes", sound: "Sonido", on: "Activado", off: "Desactivado", language: "Idioma", preview: "Owner Preview · No público", start: "Empezar", back: "Volver a WeightPlay", menu: "Menú", replay: "Repetir", reset: "Nuevo puzzle", hint: "Pista", undo: "Deshacer", moves: "Movimientos", time: "Tiempo", goal: "Objetivo", how: "Cómo jugar", ready: "Elige una dificultad y empieza.", solved: "¡Puzzle resuelto!", failed: "Lee el tablero y vuelve a intentarlo.", win: "¡Lo has conseguido!", lose: "Fin de la ronda", close: "Cerrar", easy: "Fácil", medium: "Media", hard: "Difícil", submit: "Enviar", clear: "Borrar", rotate: "Girar", place: "Colocar", readyFleet: "Flota lista", choose: "Elegir", player: "Tú", opponent: "Rival", selectSource: "Elige un origen", selectTarget: "Elige un destino", noMoves: "No quedan movimientos legales.", turn: "Tu turno", thinking: "Pensando…", score: "Puntuación", level: "Nivel", flagMode: "Modo bandera", revealMode: "Modo revelar", codePick: "Elige un color", correct: "Posición correcta", near: "Color correcto", hit: "Impacto", miss: "Agua", sunk: "Hundido", placeShip: "Coloca tus barcos", attack: "Elige un objetivo", noRepeat: "Elige una casilla de agua sin atacar." },
    "pt-BR": { settings: "Configurações", sound: "Som", on: "Ligado", off: "Desligado", language: "Idioma", preview: "Owner Preview · Não público", start: "Começar", back: "Voltar ao WeightPlay", menu: "Menu", replay: "Jogar de novo", reset: "Novo quebra-cabeça", hint: "Dica", undo: "Desfazer", moves: "Movimentos", time: "Tempo", goal: "Objetivo", how: "Como jogar", ready: "Escolha uma dificuldade e comece.", solved: "Quebra-cabeça resolvido!", failed: "Leia o tabuleiro e tente outra vez.", win: "Você conseguiu!", lose: "Fim da rodada", close: "Fechar", easy: "Fácil", medium: "Médio", hard: "Difícil", submit: "Enviar", clear: "Limpar", rotate: "Girar", place: "Colocar", readyFleet: "Frota pronta", choose: "Escolher", player: "Você", opponent: "Oponente", selectSource: "Escolha a origem", selectTarget: "Escolha o destino", noMoves: "Não há movimentos legais.", turn: "Sua vez", thinking: "Pensando…", score: "Pontuação", level: "Nível", flagMode: "Modo bandeira", revealMode: "Modo revelar", codePick: "Escolha uma cor", correct: "Posição certa", near: "Cor certa", hit: "Acerto", miss: "Água", sunk: "Afundado", placeShip: "Posicione seus navios", attack: "Escolha um alvo", noRepeat: "Escolha uma casa ainda não atacada." },
    fr: { settings: "Réglages", sound: "Son", on: "Activé", off: "Désactivé", language: "Langue", preview: "Owner Preview · Non public", start: "Commencer", back: "Retour à WeightPlay", menu: "Menu", replay: "Rejouer", reset: "Nouveau puzzle", hint: "Indice", undo: "Annuler", moves: "Coups", time: "Temps", goal: "But", how: "Comment jouer", ready: "Choisissez une difficulté et commencez.", solved: "Puzzle terminé !", failed: "Relisez le plateau et réessayez.", win: "C'est gagné !", lose: "Fin de la manche", close: "Fermer", easy: "Facile", medium: "Moyen", hard: "Difficile", submit: "Valider", clear: "Effacer", rotate: "Tourner", place: "Placer", readyFleet: "Flotte prête", choose: "Choisir", player: "Vous", opponent: "Adversaire", selectSource: "Choisissez un départ", selectTarget: "Choisissez une destination", noMoves: "Aucun coup légal.", turn: "À vous", thinking: "Réflexion…", score: "Score", level: "Niveau", flagMode: "Mode drapeau", revealMode: "Mode révélation", codePick: "Choisissez une couleur", correct: "Bonne position", near: "Bonne couleur", hit: "Touché", miss: "À l'eau", sunk: "Coulé", placeShip: "Placez vos navires", attack: "Choisissez une cible", noRepeat: "Choisissez une case d'eau intacte." },
    de: { settings: "Einstellungen", sound: "Ton", on: "An", off: "Aus", language: "Sprache", preview: "Owner Preview · Nicht öffentlich", start: "Spiel starten", back: "Zurück zu WeightPlay", menu: "Menü", replay: "Nochmal", reset: "Neues Rätsel", hint: "Tipp", undo: "Rückgängig", moves: "Züge", time: "Zeit", goal: "Ziel", how: "So wird gespielt", ready: "Wähle eine Schwierigkeit und starte.", solved: "Rätsel gelöst!", failed: "Lies das Brett und versuche es erneut.", win: "Geschafft!", lose: "Runde beendet", close: "Schließen", easy: "Leicht", medium: "Mittel", hard: "Schwer", submit: "Senden", clear: "Löschen", rotate: "Drehen", place: "Platzieren", readyFleet: "Flotte bereit", choose: "Wählen", player: "Du", opponent: "Gegner", selectSource: "Start wählen", selectTarget: "Ziel wählen", noMoves: "Keine legalen Züge mehr.", turn: "Du bist dran", thinking: "Denkt nach…", score: "Punktzahl", level: "Stufe", flagMode: "Flaggenmodus", revealMode: "Aufdecken", codePick: "Farbe wählen", correct: "Position richtig", near: "Farbe richtig", hit: "Treffer", miss: "Wasser", sunk: "Versenkt", placeShip: "Platziere deine Schiffe", attack: "Wähle ein Ziel", noRepeat: "Wähle ein noch nicht angegriffenes Feld." },
    it: { settings: "Impostazioni", sound: "Suono", on: "Attivo", off: "Disattivo", language: "Lingua", preview: "Owner Preview · Non pubblico", start: "Inizia", back: "Torna a WeightPlay", menu: "Menu", replay: "Rigioca", reset: "Nuovo puzzle", hint: "Suggerimento", undo: "Annulla", moves: "Mosse", time: "Tempo", goal: "Obiettivo", how: "Come si gioca", ready: "Scegli una difficoltà e inizia.", solved: "Puzzle risolto!", failed: "Leggi la tavola e riprova.", win: "Ce l'hai fatta!", lose: "Fine del round", close: "Chiudi", easy: "Facile", medium: "Media", hard: "Difficile", submit: "Invia", clear: "Cancella", rotate: "Ruota", place: "Posiziona", readyFleet: "Flotta pronta", choose: "Scegli", player: "Tu", opponent: "Avversario", selectSource: "Scegli la partenza", selectTarget: "Scegli la destinazione", noMoves: "Non ci sono mosse legali.", turn: "Tocca a te", thinking: "Sta pensando…", score: "Punteggio", level: "Livello", flagMode: "Modalità bandiera", revealMode: "Modalità scopri", codePick: "Scegli un colore", correct: "Posizione corretta", near: "Colore corretto", hit: "Colpito", miss: "Acqua", sunk: "Affondato", placeShip: "Posiziona le navi", attack: "Scegli un bersaglio", noRepeat: "Scegli una casella non ancora attaccata." },
    ru: { settings: "Настройки", sound: "Звук", on: "Вкл.", off: "Выкл.", language: "Язык", preview: "Owner Preview · Не опубликовано", start: "Начать игру", back: "Вернуться в WeightPlay", menu: "Меню", replay: "Снова", reset: "Новая задача", hint: "Подсказка", undo: "Отменить", moves: "Ходы", time: "Время", goal: "Цель", how: "Как играть", ready: "Выберите сложность и начните.", solved: "Задача решена!", failed: "Изучите поле и попробуйте ещё раз.", win: "Победа!", lose: "Раунд окончен", close: "Закрыть", easy: "Легко", medium: "Средне", hard: "Сложно", submit: "Готово", clear: "Очистить", rotate: "Повернуть", place: "Поставить", readyFleet: "Флот готов", choose: "Выбрать", player: "Вы", opponent: "Соперник", selectSource: "Выберите начало", selectTarget: "Выберите цель", noMoves: "Ходов не осталось.", turn: "Ваш ход", thinking: "Думает…", score: "Счёт", level: "Уровень", flagMode: "Флажки", revealMode: "Открытие", codePick: "Выберите цвет", correct: "Верная позиция", near: "Верный цвет", hit: "Попадание", miss: "Мимо", sunk: "Потоплен", placeShip: "Расставьте корабли", attack: "Выберите цель", noRepeat: "Выберите ещё не атакованную клетку." },
    hi: { settings: "सेटिंग्स", sound: "ध्वनि", on: "चालू", off: "बंद", language: "भाषा", preview: "Owner Preview · सार्वजनिक नहीं", start: "गेम शुरू करें", back: "WeightPlay पर लौटें", menu: "मेनू", replay: "फिर खेलें", reset: "नई पहेली", hint: "संकेत", undo: "पहले जैसा", moves: "चालें", time: "समय", goal: "लक्ष्य", how: "कैसे खेलें", ready: "कठिनाई चुनकर शुरू करें।", solved: "पहेली हल हो गई!", failed: "बोर्ड पढ़ें और फिर कोशिश करें।", win: "आप जीत गए!", lose: "राउंड समाप्त", close: "बंद करें", easy: "आसान", medium: "मध्यम", hard: "कठिन", submit: "जमा करें", clear: "साफ़", rotate: "घुमाएँ", place: "रखें", readyFleet: "बेड़ा तैयार", choose: "चुनें", player: "आप", opponent: "प्रतिद्वंद्वी", selectSource: "शुरुआत चुनें", selectTarget: "गंतव्य चुनें", noMoves: "कोई वैध चाल नहीं बची।", turn: "आपकी बारी", thinking: "सोच रहा है…", score: "स्कोर", level: "स्तर", flagMode: "झंडा मोड", revealMode: "खोलने का मोड", codePick: "रंग चुनें", correct: "सही स्थान", near: "सही रंग", hit: "हिट", miss: "चूक", sunk: "डूबा", placeShip: "अपने जहाज़ रखें", attack: "लक्ष्य चुनें", noRepeat: "ऐसा खाना चुनें जिस पर हमला न हुआ हो।" },
    ar: { settings: "الإعدادات", sound: "الصوت", on: "تشغيل", off: "إيقاف", language: "اللغة", preview: "Owner Preview · غير منشورة", start: "ابدأ اللعبة", back: "العودة إلى WeightPlay", menu: "القائمة", replay: "العب مجددًا", reset: "لغز جديد", hint: "تلميح", undo: "تراجع", moves: "الحركات", time: "الوقت", goal: "الهدف", how: "طريقة اللعب", ready: "اختر الصعوبة وابدأ.", solved: "تم حل اللغز!", failed: "اقرأ اللوحة وحاول مرة أخرى.", win: "لقد نجحت!", lose: "انتهت الجولة", close: "إغلاق", easy: "سهل", medium: "متوسط", hard: "صعب", submit: "إرسال", clear: "مسح", rotate: "تدوير", place: "وضع", readyFleet: "الأسطول جاهز", choose: "اختر", player: "أنت", opponent: "الخصم", selectSource: "اختر البداية", selectTarget: "اختر الوجهة", noMoves: "لا توجد حركة قانونية.", turn: "دورك", thinking: "يفكر…", score: "النتيجة", level: "المستوى", flagMode: "وضع العلم", revealMode: "وضع الكشف", codePick: "اختر لونًا", correct: "موضع صحيح", near: "لون صحيح", hit: "إصابة", miss: "ماء", sunk: "غارقة", placeShip: "ضع سفنك", attack: "اختر هدفًا", noRepeat: "اختر مربعًا لم تهاجمه بعد." },
  };

  const L = (en, zhH, zhS, ja, ko, es, pt, fr, de, it, ru, hi, ar) => ({ en, "zh-Hant": zhH, "zh-Hans": zhS, ja, ko, es, "pt-BR": pt, fr, de, it, ru, hi, ar });
  const codeSlotCopy = {
    empty: L("Slot {slot}: empty. Pick a color.", "第 {slot} 格：空白。請選擇顏色。", "第 {slot} 格：空白。请选择颜色。", "スロット{slot}：空白。色を選びます。", "슬롯 {slot}: 비어 있습니다. 색상을 고르세요.", "Casilla {slot}: vacía. Elige un color.", "Espaço {slot}: vazio. Escolha uma cor.", "Case {slot} : vide. Choisissez une couleur.", "Feld {slot}: leer. Wähle eine Farbe.", "Casella {slot}: vuota. Scegli un colore.", "Ячейка {slot}: пусто. Выберите цвет.", "खाना {slot}: खाली है। रंग चुनें।", "الخانة {slot}: فارغة. اختر لونًا."),
    filled: L("Slot {slot}: color {color}. Select to remove it.", "第 {slot} 格：顏色 {color}。選擇即可移除。", "第 {slot} 格：颜色 {color}。选择即可移除。", "スロット{slot}：色{color}。選択すると外せます。", "슬롯 {slot}: 색상 {color}. 선택하면 제거합니다.", "Casilla {slot}: color {color}. Selecciónala para quitarlo.", "Espaço {slot}: cor {color}. Selecione para remover.", "Case {slot} : couleur {color}. Sélectionnez-la pour la retirer.", "Feld {slot}: Farbe {color}. Zum Entfernen auswählen.", "Casella {slot}: colore {color}. Seleziona per rimuoverlo.", "Ячейка {slot}: цвет {color}. Выберите, чтобы убрать его.", "खाना {slot}: रंग {color}। हटाने के लिए चुनें।", "الخانة {slot}: اللون {color}. اخترها لإزالته.")
  };
  const mineCopy = {
    inputSupport: L("Mouse + touch", "滑鼠＋觸控", "鼠標＋觸控", "マウス＋タッチ", "마우스 + 터치", "Ratón + táctil", "Mouse + toque", "Souris + tactile", "Maus + Touch", "Mouse + tocco", "Мышь + сенсор", "माउस + टच", "الفأرة + اللمس"),
    flags: L("Flags", "旗標", "标记", "旗", "깃발", "Banderas", "Bandeiras", "Drapeaux", "Markierungen", "Bandiere", "Флаги", "झंडे", "الأعلام"),
    cell: L("Row {row}, Column {col}: {state}", "第 {row} 行，第 {col} 列：{state}", "第 {row} 行，第 {col} 列：{state}", "{row} 行 {col} 列：{state}", "{row}행 {col}열: {state}", "Fila {row}, columna {col}: {state}", "Linha {row}, coluna {col}: {state}", "Ligne {row}, colonne {col} : {state}", "Zeile {row}, Spalte {col}: {state}", "Riga {row}, colonna {col}: {state}", "Строка {row}, столбец {col}: {state}", "पंक्ति {row}, स्तंभ {col}: {state}", "الصف {row}، العمود {col}: {state}"),
    covered: L("covered", "未翻開", "未翻开", "未開封", "닫힘", "oculta", "coberta", "cachée", "verdeckt", "coperta", "закрыта", "छिपा हुआ", "مغطاة"),
    flagged: L("flagged", "已插旗", "已插旗", "旗付き", "깃발 표시", "marcada", "marcada", "marquée", "markiert", "segnalata", "с флагом", "झंडा लगा", "عليها علم"),
    mine: L("mine", "地雷", "地雷", "地雷", "지뢰", "mina", "mina", "mine", "Mine", "mina", "мина", "माइन", "لغم"),
    safe: L("safe, no adjacent mines", "安全，周圍沒有地雷", "安全，周围没有地雷", "安全、隣接地雷なし", "안전, 인접 지뢰 없음", "segura, sin minas adyacentes", "segura, sem minas adjacentes", "sûre, aucune mine adjacente", "sicher, keine Minen daneben", "sicura, nessuna mina adiacente", "безопасно, рядом нет мин", "सुरक्षित, पास में कोई माइन नहीं", "آمنة، لا ألغام مجاورة"),
    adjacent: L("{count} adjacent mines", "附近有 {count} 顆地雷", "附近有 {count} 颗地雷", "隣接地雷 {count} 個", "인접 지뢰 {count}개", "{count} minas adyacentes", "{count} minas adjacentes", "{count} mines adjacentes", "{count} angrenzende Minen", "{count} mine adiacenti", "мин рядом: {count}", "पास की माइन {count}개", "{count} ألغام مجاورة"),
    hintGuide: L("The highlighted cell is safe. Read nearby numbers: each number counts adjacent mines, and flags help you test the next reveal.", "高亮格是安全的。先讀附近數字：每個數字代表相鄰地雷數，旗標能幫你驗證下一次翻開。", "高亮格是安全的。先读附近数字：每个数字代表相邻地雷数，标记能帮你验证下一次翻开。", "ハイライトされたマスは安全です。周囲の数字は隣接する地雷の数なので、旗と照らして次のマスを自分で開きましょう。", "강조된 칸은 안전합니다. 주변 숫자는 인접한 지뢰 수이므로 깃발과 비교해 다음 칸을 직접 여세요.", "La casilla resaltada es segura. Cada número cuenta las minas adyacentes; compara las banderas y elige tú la próxima casilla.", "A casa destacada é segura. Cada número conta as minas vizinhas; compare as bandeiras e escolha você a próxima casa.", "La case surlignée est sûre. Chaque nombre compte les mines adjacentes ; comparez les drapeaux avant de choisir vous-même la prochaine case.", "Das markierte Feld ist sicher. Jede Zahl zählt die angrenzenden Minen; vergleiche sie mit den Markierungen und öffne das nächste Feld selbst.", "La casella evidenziata è sicura. Ogni numero conta le mine adiacenti: confronta le bandiere e scegli tu la prossima casella.", "Выделенная клетка безопасна. Каждое число показывает соседние мины: сравните его с флажками и сами выберите следующую клетку.", "हाइलाइट किया गया खाना सुरक्षित है। हर संख्या पास की खानों की गिनती बताती है; झंडों से मिलाकर अगला खाना खुद खोलें।", "الخانة المميزة آمنة. كل رقم يحسب الألغام المجاورة؛ قارنها بالأعلام واختر الخانة التالية بنفسك."),
    hintContext: L("A nearby {count} touches {flags} flagged cells and {hidden} covered cells. Use that count to check the highlighted reveal yourself.", "附近的 {count} 旁有 {flags} 個旗標和 {hidden} 個未翻開格。用這個數字驗證高亮格，再自行翻開。", "附近的 {count} 旁有 {flags} 个标记和 {hidden} 个未翻开格。用这个数字验证高亮格，再自行翻开。", "近くの {count} は旗 {flags} 個と未開封マス {hidden} 個に接しています。その数字でハイライトを確かめ、自分で開きましょう。", "근처의 {count}은(는) 깃발 {flags}개와 닫힌 칸 {hidden}개에 닿아 있습니다. 그 숫자로 강조된 칸을 확인한 뒤 직접 여세요.", "Un {count} cercano toca {flags} banderas y {hidden} casillas ocultas. Usa ese número para comprobar la casilla resaltada y ábrela tú.", "Um {count} próximo toca {flags} bandeiras e {hidden} casas cobertas. Use esse número para conferir a casa destacada e abra-a você.", "Un {count} voisin touche {flags} drapeaux et {hidden} cases cachées. Utilisez ce nombre pour vérifier la case surlignée, puis ouvrez-la vous-même.", "Eine nahe {count} berührt {flags} markierte und {hidden} verdeckte Felder. Nutze diese Zahl, prüfe das markierte Feld und öffne es selbst.", "Un {count} vicino tocca {flags} bandiere e {hidden} caselle coperte. Usa quel numero per verificare la casella evidenziata e aprila tu.", "Рядом с числом {count} находятся {flags} флажков и {hidden} закрытых клеток. Проверьте выделенную клетку по этому числу и откройте её сами.", "पास का {count} {flags} झंडे और {hidden} छिपे खानों को छूता है। इस संख्या से हाइलाइट किए खाने को जाँचें और उसे खुद खोलें।", "الرقم {count} المجاور يلامس {flags} أعلام و{hidden} خانات مغطاة. استخدم هذا الرقم للتحقق من الخانة المميزة ثم افتحها بنفسك."),
    hintProof: L("A nearby {count} already has {flags} flagged cells and only the highlighted covered cell left, so that cell is safe. Reveal it yourself.", "附近的 {count} 已有 {flags} 個旗標，且只剩高亮的未翻開格，因此它是安全的。請自行翻開。", "附近的 {count} 已有 {flags} 个标记，且只剩高亮的未翻开格，因此它是安全的。请自行翻开。", "近くの {count} にはすでに旗が {flags} 個あり、残る未開封マスはハイライトだけです。安全なので自分で開きましょう。", "근처의 {count}에는 이미 깃발이 {flags}개 있고 닫힌 칸은 강조된 칸만 남았습니다. 안전하므로 직접 여세요.", "Un {count} cercano ya tiene {flags} banderas y solo queda la casilla resaltada sin abrir, así que es segura. Ábrela tú.", "Um {count} próximo já tem {flags} bandeiras e só resta a casa destacada coberta, então ela é segura. Abra-a você.", "Un {count} voisin a déjà {flags} drapeaux et il ne reste que la case surlignée cachée : elle est donc sûre. Ouvrez-la vous-même.", "Eine nahe {count} hat bereits {flags} Markierungen, und nur das markierte verdeckte Feld bleibt übrig — es ist sicher. Öffne es selbst.", "Un {count} vicino ha già {flags} bandiere e resta solo la casella coperta evidenziata: è sicura. Aprila tu.", "Рядом с числом {count} уже стоят {flags} флажков, и закрытой остаётся только выделенная клетка — она безопасна. Откройте её сами.", "पास के {count} पर पहले से {flags} झंडे हैं और केवल हाइलाइट किया खाना छिपा है, इसलिए वह सुरक्षित है। उसे खुद खोलें।", "الرقم {count} المجاور لديه بالفعل {flags} أعلام ولم تبقَ إلا الخانة المميزة المغطاة، لذا فهي آمنة. افتحها بنفسك."),
    resultSuccess: L("Safe cells: {safe} · Flags placed: {flags}/{total} · Time: {time}s · All safe cells cleared.", "安全格：{safe} · 已插旗：{flags}/{total} · 時間：{time} 秒 · 已清除所有安全格。", "安全格：{safe} · 已插旗：{flags}/{total} · 时间：{time} 秒 · 已清除所有安全格。", "安全マス：{safe} ・ 置いた旗：{flags}/{total} ・ 時間：{time}秒 ・ すべての安全マスを開きました。", "안전 칸: {safe} · 설치한 깃발: {flags}/{total} · 시간: {time}초 · 모든 안전 칸을 열었습니다.", "Casillas seguras: {safe} · Banderas colocadas: {flags}/{total} · Tiempo: {time}s · Has abierto todas las casillas seguras.", "Casas seguras: {safe} · Bandeiras colocadas: {flags}/{total} · Tempo: {time}s · Você abriu todas as casas seguras.", "Cases sûres : {safe} · Drapeaux posés : {flags}/{total} · Temps : {time}s · Toutes les cases sûres sont ouvertes.", "Sichere Felder: {safe} · Gesetzte Markierungen: {flags}/{total} · Zeit: {time}s · Alle sicheren Felder sind geöffnet.", "Caselle sicure: {safe} · Bandiere posizionate: {flags}/{total} · Tempo: {time}s · Hai aperto tutte le caselle sicure.", "Безопасные клетки: {safe} · Флаги: {flags}/{total} · Время: {time} с · Все безопасные клетки открыты.", "सुरक्षित खाने: {safe} · लगाए गए झंडे: {flags}/{total} · समय: {time} सेकंड · सभी सुरक्षित खाने खुल गए हैं।", "الخلايا الآمنة: {safe} · الأعلام الموضوعة: {flags}/{total} · الوقت: {time} ث · تم فتح كل الخلايا الآمنة."),
    resultFailure: L("Mine hit · Safe cells: {safe} · Flags placed: {flags}/{total} · Time: {time}s.", "踩到地雷 · 安全格：{safe} · 已插旗：{flags}/{total} · 時間：{time} 秒。", "踩到地雷 · 安全格：{safe} · 已插旗：{flags}/{total} · 时间：{time} 秒。", "地雷に当たりました ・ 安全マス：{safe} ・ 置いた旗：{flags}/{total} ・ 時間：{time}秒。", "지뢰를 밟았습니다 · 안전 칸: {safe} · 설치한 깃발: {flags}/{total} · 시간: {time}초.", "Has tocado una mina · Casillas seguras: {safe} · Banderas colocadas: {flags}/{total} · Tiempo: {time}s.", "Você atingiu uma mina · Casas seguras: {safe} · Bandeiras colocadas: {flags}/{total} · Tempo: {time}s.", "Mine touchée · Cases sûres : {safe} · Drapeaux posés : {flags}/{total} · Temps : {time}s.", "Mine getroffen · Sichere Felder: {safe} · Gesetzte Markierungen: {flags}/{total} · Zeit: {time}s.", "Hai colpito una mina · Caselle sicure: {safe} · Bandiere posizionate: {flags}/{total} · Tempo: {time}s.", "Вы подорвались на мине · Безопасные клетки: {safe} · Флаги: {flags}/{total} · Время: {time} с.", "माइन लग गई · सुरक्षित खाने: {safe} · लगाए गए झंडे: {flags}/{total} · समय: {time} सेकंड।", "أصبت لغمًا · الخلايا الآمنة: {safe} · الأعلام الموضوعة: {flags}/{total} · الوقت: {time} ث."),
  };
  const sudokuCopy = {
    cell: L("Row {row}, Column {col}: {state}", "第 {row} 行，第 {col} 列：{state}", "第 {row} 行，第 {col} 列：{state}", "{row}行 {col}列：{state}", "{row}행 {col}열: {state}", "Fila {row}, columna {col}: {state}", "Linha {row}, coluna {col}: {state}", "Ligne {row}, colonne {col} : {state}", "Zeile {row}, Spalte {col}: {state}", "Riga {row}, colonna {col}: {state}", "Строка {row}, столбец {col}: {state}", "पंक्ति {row}, स्तंभ {col}: {state}", "الصف {row}، العمود {col}: {state}"),
    empty: L("empty, editable", "空白，可填寫", "空白，可填写", "空欄、入力可能", "비어 있음, 입력 가능", "vacía, editable", "vazia, editável", "vide, modifiable", "leer, bearbeitbar", "vuota, modificabile", "пусто, можно ввести", "खाली, भरा जा सकता है", "فارغة، قابلة للإدخال"),
    given: L("given {value}", "題目 {value}", "题目 {value}", "問題 {value}", "주어진 숫자 {value}", "dada {value}", "dado {value}", "donnée {value}", "vorgegeben {value}", "dato {value}", "дано {value}", "दिया गया {value}", "معطاة {value}"),
    filled: L("filled {value}, editable", "已填 {value}，可修改", "已填 {value}，可修改", "入力済み {value}、変更可能", "입력됨 {value}, 수정 가능", "rellena {value}, editable", "preenchida com {value}, editável", "remplie {value}, modifiable", "ausgefüllt {value}, bearbeitbar", "compilata {value}, modificabile", "введено {value}, можно изменить", "भरा हुआ {value}, बदला जा सकता है", "مملوءة بـ {value}، قابلة للتعديل"),
    hinted: L("Hinted cell; {state}", "提示格；{state}", "提示格；{state}", "ヒントのマス；{state}", "힌트 칸; {state}", "casilla sugerida; {state}", "casa indicada; {state}", "case suggérée ; {state}", "Hinweisfeld; {state}", "casella suggerita; {state}", "клетка подсказки; {state}", "संकेत वाला खाना; {state}", "خانة التلميح؛ {state}"),
  };
  const sudokuFeedback = {
    ready: L(
      "Choose a cell, then enter a number. Hint marks one safe next step.",
      "選擇格子後輸入數字。提示會標出一個安全的下一步。",
      "选择格子后输入数字。提示会标出一个安全的下一步。",
      "マスを選び、数字を入力します。ヒントは安全な次の一手を示します。",
      "칸을 고른 뒤 숫자를 입력하세요. 힌트는 안전한 다음 수를 표시합니다.",
      "Elige una casilla e introduce un número. La pista marca un siguiente paso seguro.",
      "Escolha uma casa e insira um número. A dica marca um próximo passo seguro.",
      "Choisissez une case et saisissez un chiffre. L’indice marque une prochaine étape sûre.",
      "Wähle ein Feld und gib eine Zahl ein. Der Tipp markiert einen sicheren nächsten Schritt.",
      "Scegli una casella e inserisci un numero. Il suggerimento indica un prossimo passo sicuro.",
      "Выберите клетку и введите число. Подсказка отметит безопасный следующий шаг.",
      "खाना चुनकर संख्या भरें। संकेत अगला सुरक्षित कदम दिखाता है।",
      "اختر خانة ثم أدخل رقمًا. يحدد التلميح خطوة آمنة تالية."
    ),
    correct: L(
      "Correct placement. {remaining} cells remain.",
      "填入正確。剩下 {remaining} 格。",
      "填入正确。还剩 {remaining} 格。",
      "正しい入力です。残り {remaining} マスです。",
      "올바른 입력입니다. {remaining}칸이 남았습니다.",
      "Colocación correcta. Quedan {remaining} casillas.",
      "Preenchimento correto. Restam {remaining} casas.",
      "Placement correct. Il reste {remaining} cases.",
      "Richtige Eingabe. {remaining} Felder bleiben.",
      "Inserimento corretto. Restano {remaining} caselle.",
      "Верное заполнение. Осталось клеток: {remaining}.",
      "सही भराव। {remaining} खाने बाकी हैं।",
      "إدخال صحيح. تبقت {remaining} خانات."
    ),
    cleared: L(
      "Cell cleared. {remaining} cells remain.",
      "已清除格子。剩下 {remaining} 格。",
      "已清除格子。还剩 {remaining} 格。",
      "マスを消去しました。残り {remaining} マスです。",
      "칸을 지웠습니다. {remaining}칸이 남았습니다.",
      "Casilla borrada. Quedan {remaining} casillas.",
      "Casa limpa. Restam {remaining} casas.",
      "Case effacée. Il reste {remaining} cases.",
      "Feld gelöscht. {remaining} Felder bleiben.",
      "Casella cancellata. Restano {remaining} caselle.",
      "Клетка очищена. Осталось клеток: {remaining}.",
      "खाना साफ़ किया। {remaining} खाने बाकी हैं।",
      "تم مسح الخانة. تبقت {remaining} خانات."
    ),
    invalid: L(
      "That number conflicts with the row, column, or box. Try another.",
      "這個數字與列、欄或宮衝突，請換一個。",
      "这个数字与行、列或宫冲突，请换一个。",
      "その数字は行・列・ブロックと重なります。別の数字を試してください。",
      "그 숫자는 행, 열 또는 박스와 충돌합니다. 다른 숫자를 시도하세요.",
      "Ese número entra en conflicto con la fila, columna o bloque. Prueba otro.",
      "Esse número entra em conflito com a linha, coluna ou bloco. Tente outro.",
      "Ce chiffre entre en conflit avec la ligne, la colonne ou le bloc. Essayez-en un autre.",
      "Diese Zahl steht im Konflikt mit Zeile, Spalte oder Block. Versuche eine andere.",
      "Quel numero entra in conflitto con riga, colonna o blocco. Provane un altro.",
      "Это число конфликтует со строкой, столбцом или блоком. Попробуйте другое.",
      "यह संख्या पंक्ति, स्तंभ या बॉक्स से टकराती है। दूसरी संख्या आज़माएँ।",
      "هذا الرقم يتعارض مع الصف أو العمود أو المربع. جرّب رقمًا آخر."
    ),
    hint: L(
      "Hint marks a safe next cell. You still choose the number.",
      "提示會標出安全的下一格，數字仍由你選擇。",
      "提示会标出安全的下一格，数字仍由你选择。",
      "ヒントは安全な次のマスを示します。数字は自分で選びます。",
      "힌트는 안전한 다음 칸을 표시합니다. 숫자는 직접 고르세요.",
      "La pista marca una casilla segura. Tú eliges el número.",
      "A dica marca uma próxima casa segura. Você escolhe o número.",
      "L’indice marque une prochaine case sûre. Vous choisissez le chiffre.",
      "Der Tipp markiert ein sicheres nächstes Feld. Die Zahl wählst du selbst.",
      "Il suggerimento indica una prossima casella sicura. Scegli tu il numero.",
      "Подсказка отмечает безопасную следующую клетку. Число выбираете вы.",
      "संकेत अगला सुरक्षित खाना दिखाता है। संख्या आप चुनें।",
      "يحدد التلميح خانة آمنة تالية. أنت تختار الرقم."
    ),
    undo: L(
      "Undo restored the previous cell. {remaining} cells remain.",
      "還原了上一格。剩下 {remaining} 格。",
      "撤销了上一格。还剩 {remaining} 格。",
      "前のマスを元に戻しました。残り {remaining} マスです。",
      "이전 칸을 되돌렸습니다. {remaining}칸이 남았습니다.",
      "Deshacer restauró la casilla anterior. Quedan {remaining} casillas.",
      "Desfazer restaurou a casa anterior. Restam {remaining} casas.",
      "Annulation effectuée. Il reste {remaining} cases.",
      "Rückgängig hat das vorherige Feld wiederhergestellt. {remaining} Felder bleiben.",
      "Annullamento eseguito. Restano {remaining} caselle.",
      "Отмена восстановила предыдущую клетку. Осталось клеток: {remaining}.",
      "पहले वाली खाना वापस आई। {remaining} खाने बाकी हैं।",
      "استعاد التراجع الخانة السابقة. تبقت {remaining} خانات."
    ),
    goal: L(
      "Next step: replay {level} in {target} moves or try {next}.",
      "下一步：用 {target} 步重玩{level}，或挑戰{next}。",
      "下一步：用 {target} 步重玩{level}，或挑战{next}。",
      "次の一手：{level}を{target}手で再挑戦するか、{next}に進みましょう。",
      "다음 목표: {target}번으로 {level}을 다시 풀거나 {next}에 도전하세요.",
      "Siguiente paso: repite {level} en {target} movimientos o prueba {next}.",
      "Próximo passo: refaça {level} em {target} movimentos ou tente {next}.",
      "Étape suivante : rejouez {level} en {target} coups ou essayez {next}.",
      "Nächster Schritt: Spiele {level} in {target} Zügen erneut oder versuche {next}.",
      "Prossimo passo: rigioca {level} in {target} mosse o prova {next}.",
      "Следующий шаг: пройдите {level} за {target} ходов или попробуйте {next}.",
      "अगला लक्ष्य: {level} को {target} चालों में फिर हल करें या {next} आज़माएँ।",
      "الخطوة التالية: أعد حل {level} خلال {target} حركات أو جرّب {next}."
    ),
    hardGoal: L(
      "Next step: replay {level} in {target} moves or fewer.",
      "下一步：用 {target} 步或更少重玩{level}。",
      "下一步：用 {target} 步或更少重玩{level}。",
      "次の一手：{level}を{target}手以下で再挑戦しましょう。",
      "다음 목표: {level}을 {target}번 이하로 다시 풀어 보세요.",
      "Siguiente paso: repite {level} en {target} movimientos o menos.",
      "Próximo passo: refaça {level} em {target} movimentos ou menos.",
      "Étape suivante : rejouez {level} en {target} coups ou moins.",
      "Nächster Schritt: Spiele {level} in höchstens {target} Zügen erneut.",
      "Prossimo passo: rigioca {level} in {target} mosse o meno.",
      "Следующий шаг: пройдите {level} за {target} ходов или меньше.",
      "अगला लक्ष्य: {level} को {target} चालों या कम में फिर हल करें।",
      "الخطوة التالية: أعد حل {level} خلال {target} حركات أو أقل."
    ),
  };
  const navalCopy = {
    cell: L("Row {row}, Column {col}: {state}", "第 {row} 行，第 {col} 列：{state}", "第 {row} 行，第 {col} 列：{state}", "{row}行 {col}列：{state}", "{row}행 {col}열: {state}", "Fila {row}, columna {col}: {state}", "Linha {row}, coluna {col}: {state}", "Ligne {row}, colonne {col} : {state}", "Zeile {row}, Spalte {col}: {state}", "Riga {row}, colonna {col}: {state}", "Строка {row}, столбец {col}: {state}", "पंक्ति {row}, स्तंभ {col}: {state}", "الصف {row}، العمود {col}: {state}"),
    emptyPlacement: L("empty placement cell", "空白配置格", "空白放置格", "配置できる空きマス", "배치 가능한 빈 칸", "casilla vacía para colocar", "casa vazia para posicionar", "case vide à placer", "leeres Feld zum Platzieren", "casella vuota da posizionare", "свободная клетка для постановки", "रखने के लिए खाली खाना", "خانة فارغة للوضع"),
    ownWater: L("unshot water", "尚未被攻擊的海水", "尚未被攻击的海水", "未攻撃の海域", "아직 공격받지 않은 물", "agua sin disparar", "água ainda não atingida", "eau non ciblée", "unbeschossenes Wasser", "acqua non attaccata", "необстрелянная вода", "अभी तक न निशाना बनाया गया पानी", "ماء لم يُستهدف بعد"),
    yourShip: L("your ship", "你的船艦", "你的舰船", "自分の艦船", "내 함선", "tu barco", "seu navio", "votre navire", "dein Schiff", "la tua nave", "ваш корабль", "आपका जहाज़", "سفينتك"),
    yourShipHit: L("your ship hit", "你的船艦已被命中", "你的舰船已被命中", "自分の艦船に命中", "내 함선 피격", "tu barco alcanzado", "seu navio atingido", "votre navire touché", "dein Schiff getroffen", "la tua nave colpita", "ваш корабль подбит", "आपके जहाज़ पर प्रहार", "أصيبت سفينتك"),
    opponentMiss: L("opponent missed water", "對手未命中的海水", "对手未命中的海水", "相手が外した海域", "상대가 빗나간 물", "agua donde el rival falló", "água onde o oponente errou", "eau où l’adversaire a manqué", "vom Gegner verfehltes Wasser", "acqua dove l’avversario ha mancato", "вода, по которой соперник промахнулся", "पानी पर प्रतिद्वंद्वी की चूक", "ماء أخطأه الخصم"),
    unknownTarget: L("unknown target", "未知目標", "未知目标", "未知の目標", "알 수 없는 목표", "objetivo desconocido", "alvo desconhecido", "cible inconnue", "unbekanntes Ziel", "bersaglio sconosciuto", "неизвестная цель", "अज्ञात लक्ष्य", "هدف مجهول"),
    hitShip: L("hit ship", "命中船艦", "命中舰船", "艦船に命中", "함선 명중", "barco alcanzado", "navio atingido", "navire touché", "Schiff getroffen", "nave colpita", "корабль поражён", "जहाज़ पर प्रहार", "إصابة سفينة"),
    missedWater: L("missed water", "未命中海水", "未命中海水", "外れた海域", "빗나간 물", "agua sin impacto", "água sem acerto", "eau manquée", "Wasser verfehlt", "acqua mancata", "мимо по воде", "पानी पर चूक", "طلقة أخطأت الماء"),
  };
  const hanoiCopy = {
    minimumMoves: L("Moves: {moves} · Minimum: {minimum}", "步數：{moves} · 最少：{minimum}", "步数：{moves} · 最少：{minimum}", "手数：{moves} ・ 最短：{minimum}", "이동: {moves} · 최소: {minimum}", "Movimientos: {moves} · Mínimo: {minimum}", "Movimentos: {moves} · Mínimo: {minimum}", "Coups : {moves} · Minimum : {minimum}", "Züge: {moves} · Minimum: {minimum}", "Mosse: {moves} · Minimo: {minimum}", "Ходы: {moves} · Минимум: {minimum}", "चालें: {moves} · न्यूनतम: {minimum}", "الحركات: {moves} · الحد الأدنى: {minimum}"),
    pegLabel: L("Peg {peg}", "第 {peg} 根柱", "第 {peg} 根柱", "ペグ {peg}", "페그 {peg}", "Poste {peg}", "Pino {peg}", "Piquet {peg}", "Stab {peg}", "Perno {peg}", "Колышек {peg}", "खूंटी {peg}", "الوتد {peg}"),
    goalPeg: L("The full tower is on Peg {peg}. Move it to the goal peg before finishing.", "完整塔目前在第 {peg} 根柱，請先移到目標柱再完成。", "完整塔目前在第 {peg} 根柱，请先移到目标柱再完成。", "すべてのディスクがペグ {peg} にあります。完成するには目標ペグへ移してください。", "전체 탑이 페그 {peg}에 있습니다. 완료하려면 목표 페그로 옮기세요.", "La torre completa está en el poste {peg}. Muévela al poste objetivo antes de terminar.", "A torre completa está no pino {peg}. Mova-a para o pino objetivo antes de concluir.", "La tour complète est sur le piquet {peg}. Déplacez-la vers le piquet cible avant de terminer.", "Der vollständige Turm steht auf Stab {peg}. Verschiebe ihn zum Zielstab, bevor du abschließt.", "La torre completa è sul perno {peg}. Spostala sul perno obiettivo prima di concludere.", "Башня целиком стоит на колышке {peg}. Переместите её на целевой колышек, чтобы завершить.", "पूरा टावर खूंटी {peg} पर है। पूरा करने से पहले इसे लक्ष्य खूंटी पर ले जाएँ।", "البرج الكامل على الوتد {peg}. انقله إلى الوتد الهدف قبل الإنهاء."),
  };
  function fillTemplate(template, values) { return Object.entries(values).reduce((value, [key, replacement]) => value.replace(`{${key}}`, String(replacement)), template); }
  function mineCellLabel(row, col, state) { return fillTemplate(text(mineCopy.cell), { row, col, state }); }
  const connectOpponentThinking = L(
    "Opponent thinking…", "對手思考中…", "对手思考中…", "相手が考えています…", "상대가 생각 중…", "El rival está pensando…", "O oponente está pensando…", "L’adversaire réfléchit…", "Der Gegner denkt nach…", "L’avversario sta pensando…", "Соперник думает…", "प्रतिद्वंद्वी सोच रहा है…", "الخصم يفكر…"
  );
  const fourPreview = L(
    "Owner Preview · Not public", "擁有者預覽 · 尚未公開", "所有者预览 · 尚未公开", "オーナー向けプレビュー · 未公開", "소유자 미리보기 · 공개 전", "Vista previa del propietario · No público", "Prévia do proprietário · Não público", "Aperçu propriétaire · Non public", "Vorschau für den Eigentümer · Nicht öffentlich", "Anteprima del proprietario · Non pubblico", "Предпросмотр для владельца · Не опубликовано", "मालिक का पूर्वावलोकन · सार्वजनिक नहीं", "معاينة المالك · غير منشورة"
  );
  const connectCellLabel = L(
    "Column {column}, Row {row}", "第 {column} 欄，第 {row} 列", "第 {column} 列，第 {row} 行", "第{column}列、第{row}行", "{column}열, {row}행", "Columna {column}, fila {row}", "Coluna {column}, linha {row}", "Colonne {column}, ligne {row}", "Spalte {column}, Zeile {row}", "Colonna {column}, riga {row}", "Столбец {column}, строка {row}", "स्तंभ {column}, पंक्ति {row}", "العمود {column}، الصف {row}"
  );
  const connectHint = {
    win: L(
      "Column {column} completes four now. You still choose whether to play it.",
      "第 {column} 欄現在能連成四子。要不要落子，仍由你決定。",
      "第 {column} 列现在能连成四子。要不要落子，仍由你决定。",
      "第 {column} 列なら今すぐ4つつながります。置くかどうかはあなたが決めます。",
      "{column}열에 놓으면 지금 네 개가 이어집니다. 둘지는 직접 결정하세요.",
      "La columna {column} completa cuatro ahora. Tú decides si jugarla.",
      "A coluna {column} completa quatro agora. Você ainda decide se vai jogar.",
      "La colonne {column} aligne quatre pions maintenant. C’est vous qui décidez de la jouer.",
      "Spalte {column} bildet jetzt vier in einer Reihe. Du entscheidest selbst, ob du sie spielst.",
      "La colonna {column} completa quattro ora. Sei tu a decidere se giocarla.",
      "Столбец {column} прямо сейчас замыкает ряд из четырёх. Решать, играть ли его, вам.",
      "कॉलम {column} अभी चार की लाइन पूरी करता है। चाल चलनी है या नहीं, यह आप तय करते हैं।",
      "العمود {column} يكمل أربعة الآن. ما زلت أنت من يقرر اللعب."
    ),
    block: L(
      "Column {column} blocks the opponent’s four-in-a-row threat. You still choose the move.",
      "第 {column} 欄能擋住對手的四子威脅。要不要落子，仍由你決定。",
      "第 {column} 列可以挡住对手的四子威胁。要不要落子，仍由你决定。",
      "第 {column} 列なら相手の4つ並びを防げます。置くかどうかはあなたが決めます。",
      "{column}열은 상대의 네 개 연결 위협을 막습니다. 둘지는 직접 결정하세요.",
      "La columna {column} bloquea la amenaza de cuatro del rival. Tú decides si jugarla.",
      "A coluna {column} bloqueia a ameaça de quatro do oponente. Você decide se vai jogar.",
      "La colonne {column} bloque la menace de quatre de l’adversaire. C’est vous qui décidez.",
      "Spalte {column} blockiert die Vierer-Drohung des Gegners. Du entscheidest selbst.",
      "La colonna {column} blocca la minaccia di quattro dell’avversario. Decidi tu se giocarla.",
      "Столбец {column} блокирует угрозу соперника собрать ряд из четырёх. Решать вам.",
      "कॉलम {column} प्रतिद्वंद्वी की चार की लाइन वाली धमकी रोकता है। चाल आप चुनते हैं।",
      "العمود {column} يصد تهديد الخصم بإكمال أربعة. وما زلت أنت من يختار الحركة."
    ),
    center: L(
      "Column {column} keeps the centre open for more lines. You still choose the move.",
      "第 {column} 欄能保留更多中央連線。要不要落子，仍由你決定。",
      "第 {column} 列可以保留更多中央连线。要不要落子，仍由你决定。",
      "第 {column} 列なら中央の連結を広げやすくなります。置くかどうかはあなたが決めます。",
      "{column}열은 중앙 연결을 열어 둡니다. 둘지는 직접 결정하세요.",
      "La columna {column} mantiene abierto el centro para más líneas. Tú decides si jugarla.",
      "A coluna {column} mantém o centro aberto para criar mais linhas. Você decide se vai jogar.",
      "La colonne {column} garde le centre ouvert pour créer d’autres lignes. C’est vous qui décidez.",
      "Spalte {column} hält die Mitte für weitere Reihen offen. Du entscheidest selbst.",
      "La colonna {column} lascia aperto il centro per altre linee. Decidi tu se giocarla.",
      "Столбец {column} оставляет центр открытым для новых линий. Решать вам.",
      "कॉलम {column} बीच की राह खुली रखता है ताकि और लाइनें बन सकें। चाल आप चुनते हैं।",
      "العمود {column} يبقي الوسط مفتوحًا لمزيد من الخطوط. وما زلت أنت من يختار."
    ),
    wait: L(
      "The opponent is thinking. Ask for a Hint after your turn returns.",
      "對手正在思考，等你的回合回來再使用提示。",
      "对手正在思考，等你的回合回来再使用提示。",
      "相手が考えています。自分の番に戻ってからヒントを使いましょう。",
      "상대가 생각 중입니다. 내 차례가 돌아오면 힌트를 사용하세요.",
      "El rival está pensando. Usa la pista cuando vuelva tu turno.",
      "O oponente está pensando. Use a dica quando sua vez voltar.",
      "L’adversaire réfléchit. Utilisez l’indice quand votre tour reviendra.",
      "Der Gegner denkt nach. Nutze den Tipp, sobald du wieder dran bist.",
      "L’avversario sta pensando. Usa il suggerimento quando torna il tuo turno.",
      "Соперник думает. Используйте подсказку, когда снова наступит ваш ход.",
      "प्रतिद्वंद्वी सोच रहा है। आपकी बारी लौटने पर संकेत लें।",
      "الخصم يفكر. استخدم التلميح بعد عودة دورك."
    ),
  };
  const connectResult = {
    win: L(
      "Replay goal: Match this {moves}-drop clear, then try {nextLevel}.",
      "再玩目標：用 {moves} 次落子完成，再挑戰{nextLevel}。",
      "重玩目标：用 {moves} 次落子完成，再挑战{nextLevel}。",
      "リプレイ目標：{moves}手でクリアしてから、{nextLevel}に挑戦しましょう。",
      "다시 하기 목표: {moves}번 놓기로 클리어한 뒤 {nextLevel}에 도전하세요.",
      "Meta de repetición: completa en {moves} jugadas y luego prueba {nextLevel}.",
      "Meta da revanche: vença em {moves} jogadas e depois tente {nextLevel}.",
      "Objectif de revanche : gagnez en {moves} coups, puis essayez {nextLevel}.",
      "Replay-Ziel: Schaffe den Sieg in {moves} Zügen und probiere dann {nextLevel}.",
      "Obiettivo replay: vinci in {moves} mosse, poi prova {nextLevel}.",
      "Цель повтора: победите за {moves} ходов, затем попробуйте {nextLevel}.",
      "फिर खेलने का लक्ष्य: {moves} चालों में जीतें, फिर {nextLevel} आज़माएँ।",
      "هدف الإعادة: حقق الفوز خلال {moves} حركات، ثم جرّب {nextLevel}."
    ),
    hard: L(
      "Replay goal: Beat this clear with {target} player drops or fewer.",
      "再玩目標：用 {target} 次落子或更少擊敗本局。",
      "重玩目标：用 {target} 次落子或更少赢下本局。",
      "リプレイ目標：{target}手以下でこの盤面に勝ちましょう。",
      "다시 하기 목표: {target}번 이하로 이 판을 이겨 보세요.",
      "Meta de repetición: gana esta partida en {target} jugadas o menos.",
      "Meta da revanche: vença esta partida em {target} jogadas ou menos.",
      "Objectif de revanche : gagnez cette partie en {target} coups ou moins.",
      "Replay-Ziel: Gewinne diese Partie in höchstens {target} Zügen.",
      "Obiettivo replay: vinci questa partita in {target} mosse o meno.",
      "Цель повтора: победите в этой партии за {target} ходов или меньше.",
      "फिर खेलने का लक्ष्य: इस गेम को {target} चालों या कम में जीतें।",
      "هدف الإعادة: اربح هذه الجولة خلال {target} حركات أو أقل."
    ),
    loss: L(
      "Replay goal: Clear this {level} board in {moves} player drops or fewer.",
      "再玩目標：在 {level} 棋盤用 {moves} 次落子或更少完成。",
      "重玩目标：在{level}棋盘用 {moves} 次落子或更少完成。",
      "リプレイ目標：{level}の盤面を{moves}手以下でクリアしましょう。",
      "다시 하기 목표: {level} 보드를 {moves}번 이하로 클리어하세요.",
      "Meta de repetición: completa este tablero {level} en {moves} jugadas o menos.",
      "Meta da revanche: complete este tabuleiro {level} em {moves} jogadas ou menos.",
      "Objectif de revanche : terminez ce plateau {level} en {moves} coups ou moins.",
      "Replay-Ziel: Schaffe dieses {level}-Brett in höchstens {moves} Zügen.",
      "Obiettivo replay: completa questa tavola {level} in {moves} mosse o meno.",
      "Цель повтора: пройдите поле {level} за {moves} ходов или меньше.",
      "फिर खेलने का लक्ष्य: इस {level} बोर्ड को {moves} चालों या कम में पूरा करें।",
      "هدف الإعادة: أكمل لوحة {level} خلال {moves} حركات أو أقل."
    ),
  };
  const codeRemaining = L(
    "Slots remaining", "剩餘欄位", "剩余栏位", "残りのスロット", "남은 칸", "Espacios restantes", "Espaços restantes", "Emplacements restants", "Verbleibende Felder", "Spazi rimanenti", "Осталось ячеек", "बाकी स्थान", "الخانات المتبقية"
  );
  const reversiDifficultyPolicy = {
    easy: L(
      "Easy captures the fewest discs it can.", "簡單：電腦會選擇翻轉最少棋子的走法。", "简单：电脑会选择翻转最少棋子的走法。", "かんたん：コンピューターは返す石が最も少ない手を選びます。", "쉬움: 컴퓨터가 가장 적은 돌을 뒤집는 수를 둡니다.", "Fácil captura la menor cantidad posible de fichas.", "Fácil captura o menor número possível de peças.", "Facile retourne le moins de pions possible.", "Leicht dreht möglichst wenige Steine um.", "Facile cattura il minor numero possibile di pedine.", "Легко: компьютер переворачивает как можно меньше фишек.", "आसान स्तर कम से कम मोहरे पलटता है।", "السهل يقلب أقل عدد ممكن من الأقراص."
    ),
    medium: L(
      "Medium captures the most discs available now.", "中等：電腦會選擇當下翻轉最多棋子的走法。", "中等：电脑会选择当前翻转最多棋子的走法。", "ふつう：今すぐ最も多くの石を返せる手を選びます。", "보통: 지금 가장 많은 돌을 뒤집는 수를 둡니다.", "Medio captura la mayor cantidad disponible ahora.", "Médio captura o maior número disponível agora.", "Moyen retourne le plus de pions possible immédiatement.", "Mittel dreht sofort möglichst viele Steine um.", "Medio cattura subito il maggior numero di pedine.", "Средне: компьютер сразу переворачивает максимум фишек.", "मध्यम स्तर अभी सबसे अधिक मोहरे पलटता है।", "المتوسط يقلب أكبر عدد متاح الآن من الأقراص."
    ),
    hard: L(
      "Hard hunts corners and safe edges, and avoids risky corner traps.", "困難：電腦會搶角落與安全邊線，並避開危險的角落陷阱。", "困难：电脑会抢角落与安全边线，并避开危险的角落陷阱。", "むずかしい：角と安全な辺を狙い、危険な角のわなを避けます。", "어려움: 모서리와 안전한 가장자리를 노리고 위험한 모서리 함정을 피합니다.", "Difícil busca esquinas y bordes seguros, y evita trampas junto a las esquinas.", "Difícil busca cantos e bordas seguras e evita armadilhas perto dos cantos.", "Difficile vise les coins et les bords sûrs, et évite les pièges près des coins.", "Schwer sucht Ecken und sichere Kanten und meidet riskante Eckfallen.", "Difficile cerca angoli e bordi sicuri ed evita le trappole vicino agli angoli.", "Сложно: компьютер стремится к углам и безопасным краям, избегая ловушек у углов.", "कठिन स्तर कोनों और सुरक्षित किनारों को चुनता है तथा कोने के जाल से बचता है।", "الصعب يطارد الزوايا والحواف الآمنة ويتجنب أفخاخ الزوايا الخطرة."
    ),
  };
  const reversiReply = L(
    "{level} AI chose {square} and captured {count}.", "{level} 電腦選擇 {square}，翻轉 {count} 枚棋子。", "{level} 电脑选择 {square}，翻转 {count} 枚棋子。", "{level} AI は {square} を選び、{count} 個返しました。", "{level} AI가 {square}을 선택해 {count}개를 뒤집었습니다.", "La IA {level} eligió {square} y capturó {count}.", "A IA {level} escolheu {square} e capturou {count}.", "L’IA {level} a choisi {square} et retourné {count} pion(s).", "KI {level} wählte {square} und drehte {count} Stein(e) um.", "L'IA {level} ha scelto {square} e catturato {count} pedina/e.", "ИИ ({level}) выбрал {square} и перевернул {count} фишек.", "{level} AI ने {square} चुना और {count} मोहरे पलटे।", "اختار الذكاء {level} الخانة {square} وقلب {count} قرصًا."
  );
  const reversiPayoff = {
    corner: L(
      "Corner secured: this disc cannot be flipped.", "角落已守住：這枚棋子無法被翻轉。", "角落已守住：这枚棋子无法被翻转。", "角を確保：この石は返されません。", "모서리 확보: 이 돌은 뒤집히지 않습니다.", "Esquina asegurada: esta ficha no puede voltearse.", "Canto garantido: esta peça não pode ser virada.", "Coin sécurisé : ce pion ne peut pas être retourné.", "Ecke gesichert: Dieser Stein kann nicht umgedreht werden.", "Angolo assicurato: questa pedina non può essere rovesciata.", "Угол закреплён: эту фишку нельзя перевернуть.", "कोना सुरक्षित: इस मोहरे को पलटा नहीं जा सकता।", "تم تأمين الزاوية: لا يمكن قلب هذا القرص."
    ),
    cornerAdjacent: L(
      "Corner-adjacent move: keep the open corner in mind.", "靠角落走法：留意仍開放的角落。", "靠角落走法：留意仍开放的角落。", "角の隣の手：空いた角を意識しましょう。", "모서리 옆 수: 열린 모서리를 염두에 두세요.", "Jugada junto a la esquina: vigila la esquina abierta.", "Jogada junto ao canto: fique de olho no canto aberto.", "Coup près du coin : gardez le coin ouvert en tête.", "Zug neben der Ecke: Behalte die offene Ecke im Blick.", "Mossa vicino all'angolo: tieni d'occhio l'angolo aperto.", "Ход рядом с углом: следите за свободным углом.", "कोने के पास चाल: खुले कोने पर ध्यान दें।", "حركة بجانب الزاوية: راقب الزاوية المفتوحة."
    ),
    edge: L(
      "Edge move: the boundary can shape your next options.", "邊線走法：邊界會影響下一步選擇。", "边线走法：边界会影响下一步选择。", "辺の手：境界が次の選択肢を形作ります。", "가장자리 수: 경계가 다음 선택지를 만들 수 있습니다.", "Jugada de borde: el límite puede orientar tus próximas opciones.", "Jogada na borda: o limite pode orientar suas próximas opções.", "Coup sur le bord : la limite peut guider vos prochains choix.", "Kantenzug: Die Grenze kann deine nächsten Optionen formen.", "Mossa sul bordo: il limite può guidare le prossime scelte.", "Ход у края: граница может повлиять на следующие варианты.", "किनारे की चाल: सीमा आपके अगले विकल्पों को आकार दे सकती है।", "حركة على الحافة: قد يوجّه الحد خياراتك التالية."
    ),
    mobilityUp: L(
      "More options opened: {count} legal moves now.", "選擇變多：現在有 {count} 個合法走法。", "选择变多：现在有 {count} 个合法走法。", "選択肢が増加：合法手は {count} 個です。", "선택지 증가: 이제 합법적인 수가 {count}개입니다.", "Más opciones: ahora hay {count} jugadas legales.", "Mais opções: agora há {count} jogadas legais.", "Plus de choix : {count} coups légaux maintenant.", "Mehr Optionen: Jetzt gibt es {count} legale Züge.", "Più opzioni: ora ci sono {count} mosse legali.", "Вариантов больше: теперь доступно ходов: {count}.", "विकल्प बढ़े: अब {count} कानूनी चालें हैं।", "خيارات أكثر: هناك الآن {count} حركات قانونية."
    ),
    mobilityDown: L(
      "Fewer options now: {count} legal moves remain.", "選擇變少：現在剩下 {count} 個合法走法。", "选择变少：现在剩下 {count} 个合法走法。", "選択肢が減少：合法手は {count} 個残っています。", "선택지 감소: 이제 합법적인 수가 {count}개 남았습니다.", "Menos opciones: quedan {count} jugadas legales.", "Menos opções: restam {count} jogadas legais.", "Moins de choix : il reste {count} coups légaux.", "Weniger Optionen: {count} legale Züge bleiben.", "Meno opzioni: restano {count} mosse legali.", "Вариантов меньше: осталось ходов: {count}.", "विकल्प घटे: अब {count} कानूनी चालें बची हैं।", "خيارات أقل: تبقى {count} حركات قانونية."
    ),
    mobilitySteady: L(
      "Position held: {count} legal moves remain.", "局勢維持：現在剩下 {count} 個合法走法。", "局势维持：现在剩下 {count} 个合法走法。", "位置を維持：合法手は {count} 個残っています。", "포지션 유지: 합법적인 수가 {count}개 남았습니다.", "Posición estable: quedan {count} jugadas legales.", "Posição mantida: restam {count} jogadas legais.", "Position stable : il reste {count} coups légaux.", "Position gehalten: {count} legale Züge bleiben.", "Posizione mantenuta: restano {count} mosse legali.", "Позиция сохранена: осталось ходов: {count}.", "स्थिति कायम: अब {count} कानूनी चालें बची हैं।", "الوضع ثابت: تبقى {count} حركات قانونية."
    ),
  };
  const quickStart = L(
    "Choose a level, read the rule above, then use Hint for one safe next idea, Undo to reverse a choice, or New Puzzle to reset the board.",
    "選擇難度、閱讀上方規則，再用提示查看一個安全方向、用還原撤回選擇，或用新謎題重設盤面。",
    "选择难度、阅读上方规则，再用提示查看一个安全方向、用撤销撤回选择，或用新谜题重置盘面。",
    "難易度を選び、上のルールを読んでから、ヒントで安全な次の手を確認し、元に戻すで選択を戻すか、新しいパズルで盤面をリセットします。",
    "난이도를 고르고 위 규칙을 읽은 뒤 힌트로 안전한 다음 수를 확인하거나 되돌리기로 선택을 취소하고 새 퍼즐로 보드를 초기화하세요.",
    "Elige una dificultad, lee la regla y usa Pista para ver una idea segura, Deshacer para revertir una elección o Nuevo puzzle para reiniciar el tablero.",
    "Escolha uma dificuldade, leia a regra e use Dica para ver uma ideia segura, Desfazer para voltar uma escolha ou Novo quebra-cabeça para reiniciar o tabuleiro.",
    "Choisissez une difficulté, lisez la règle, puis utilisez Indice pour voir une idée sûre, Annuler pour revenir en arrière ou Nouveau puzzle pour réinitialiser le plateau.",
    "Wähle eine Schwierigkeit, lies die Regel und nutze Tipp für eine sichere Idee, Rückgängig zum Zurücknehmen oder Neues Rätsel zum Zurücksetzen.",
    "Scegli una difficoltà, leggi la regola e usa Suggerimento per vedere un'idea sicura, Annulla per tornare indietro o Nuovo puzzle per azzerare la tavola.",
    "Выберите сложность, прочитайте правило и используйте подсказку для безопасной идеи, отмену для возврата хода или новую задачу для сброса поля.",
    "कठिनाई चुनें, नियम पढ़ें और सुरक्षित विचार के लिए संकेत, चुनाव पलटने के लिए पहले जैसा, या बोर्ड रीसेट करने के लिए नई पहेली इस्तेमाल करें।",
    "اختر مستوى الصعوبة واقرأ القاعدة، ثم استخدم التلميح لمعرفة فكرة آمنة، أو التراجع لعكس اختيار، أو لغز جديد لإعادة ضبط اللوحة."
  );
  const lightsCopy = {
    bestLabel: L(
      "Best: {moves} moves",
      "最佳：{moves} 步",
      "最佳：{moves} 步",
      "ベスト：{moves}手",
      "최고 기록: {moves}수",
      "Mejor marca: {moves} movimientos",
      "Melhor: {moves} movimentos",
      "Meilleur : {moves} coups",
      "Bestwert: {moves} Züge",
      "Migliore: {moves} mosse",
      "Лучший результат: {moves} ходов",
      "सर्वश्रेष्ठ: {moves} चालें",
      "الأفضل: {moves} حركة"
    ),
    hintExplanation: L(
      "Hint marks one solver step; you still choose the tile.",
      "提示會標出一步解法；仍由你選擇要按哪一格。",
      "提示会标出一步解法；仍由你选择要按哪一格。",
      "ヒントは解法の一手を示します。押すマスは自分で選びます。",
      "힌트는 해법의 한 수를 표시합니다. 누를 칸은 직접 고르세요.",
      "La pista marca un paso de la solución; tú eliges la casilla.",
      "A dica marca um passo da solução; você ainda escolhe a casa.",
      "L’indice marque une étape de la solution ; vous choisissez toujours la case.",
      "Der Tipp markiert einen Lösungsschritt; das Feld wählst du selbst.",
      "Il suggerimento indica un passo della soluzione; scegli tu la casella.",
      "Подсказка отмечает один шаг решения; клетку выбираете вы.",
      "संकेत हल का एक कदम दिखाता है; खाना आपको खुद चुनना है।",
      "يحدد التلميح خطوة من الحل؛ وما زلت تختار الخلية."
    ),
    hintedCell: L(
      "Hint: Row {row}, Column {col}: {state}",
      "提示：第 {row} 列，第 {col} 欄：{state}",
      "提示：第 {row} 行，第 {col} 列：{state}",
      "ヒント：{row}行 {col}列：{state}",
      "힌트: {row}행 {col}열: {state}",
      "Pista: fila {row}, columna {col}: {state}",
      "Dica: linha {row}, coluna {col}: {state}",
      "Indice : ligne {row}, colonne {col} : {state}",
      "Tipp: Zeile {row}, Spalte {col}: {state}",
      "Suggerimento: riga {row}, colonna {col}: {state}",
      "Подсказка: строка {row}, столбец {col}: {state}",
      "संकेत: पंक्ति {row}, स्तंभ {col}: {state}",
      "تلميح: الصف {row}، العمود {col}: {state}"
    ),
    cellOn: L(
      "Light on",
      "亮燈",
      "亮灯",
      "点灯",
      "켜짐",
      "encendida",
      "acesa",
      "allumée",
      "an",
      "accesa",
      "включена",
      "चालू",
      "مضاءة"
    ),
    cellOff: L(
      "Light off",
      "熄燈",
      "熄灯",
      "消灯",
      "꺼짐",
      "apagada",
      "apagada",
      "éteinte",
      "aus",
      "spenta",
      "выключена",
      "बंद",
      "مطفأة"
    ),
    cellLabel: L(
      "Row {row}, Column {col}: {state}",
      "第 {row} 列，第 {col} 欄：{state}",
      "第 {row} 行，第 {col} 列：{state}",
      "{row}行 {col}列：{state}",
      "{row}행 {col}열: {state}",
      "Fila {row}, columna {col}: {state}",
      "Linha {row}, coluna {col}: {state}",
      "Ligne {row}, colonne {col} : {state}",
      "Zeile {row}, Spalte {col}: {state}",
      "Riga {row}, colonna {col}: {state}",
      "Строка {row}, столбец {col}: {state}",
      "पंक्ति {row}, स्तंभ {col}: {state}",
      "الصف {row}، العمود {col}: {state}"
    )
  };
  const titles = {
    "minefield-logic": L("Minefield Logic", "地雷邏輯", "地雷逻辑", "マインフィールド・ロジック", "마인필드 로직", "Lógica del campo minado", "Lógica do Campo Minado", "Logique du champ miné", "Minenfeld-Logik", "Logica del campo minato", "Логика минного поля", "माइनफील्ड लॉजिक", "منطق حقل الألغام"),
    sudoku: L("Sudoku", "數獨", "数独", "数独", "스도쿠", "Sudoku", "Sudoku", "Sudoku", "Sudoku", "Sudoku", "Судоку", "सुडोकू", "سودوكو"),
    "lights-out": L("Lights Out", "熄燈遊戲", "熄灯游戏", "ライツアウト", "라이트 아웃", "Apaga las luces", "Apague as Luzes", "Extinction des lumières", "Licht aus", "Spegni le luci", "Погаси свет", "लाइट्स आउट", "إطفاء الأنوار"),
    "peg-solitaire": L("Peg Solitaire", "孔明棋", "孔明棋", "ペグ・ソリティア", "페그 솔리테어", "Solitario de clavijas", "Solitário de Pinos", "Solitaire à pions", "Peg-Solitaire", "Solitario con pioli", "Пег-солитер", "पेग सॉलिटेयर", "سوليتير القفز"),
    "sliding-15": L("Sliding 15", "十五滑塊", "十五滑块", "スライディング15", "15 퍼즐", "Quince deslizante", "Quinze Deslizante", "Taquin 15", "Schiebepuzzle 15", "Puzzle 15 scorrevole", "Пятнашки", "स्लाइडिंग 15", "لغز الخمسة عشر"),
    "code-breaker": L("Code Breaker", "密碼推理", "密码推理", "コードブレーカー", "코드 브레이커", "Descifra el código", "Quebra-Código", "Casse-code", "Codeknacker", "Codice segreto", "Взломщик кодов", "कोड ब्रेकर", "كاسر الشفرة"),
    "tower-of-hanoi": L("Tower of Hanoi", "河內塔", "河内塔", "ハノイの塔", "하노이 탑", "Torres de Hanói", "Torre de Hanói", "Tours de Hanoï", "Türme von Hanoi", "Torre di Hanoi", "Ханойская башня", "हनोई टावर", "برج هانوي"),
    reversi: L("Reversi", "黑白棋", "黑白棋", "リバーシ", "리버시", "Reversi", "Reversi", "Reversi", "Reversi", "Reversi", "Реверси", "रिवर्सी", "ريفيرسي"),
    "four-in-a-row": L("Four in a Row", "四子棋", "四子棋", "四目並べ", "사목", "Cuatro en línea", "Quatro em Linha", "Puissance quatre", "Vier gewinnt", "Forza quattro", "Четыре в ряд", "कनेक्ट फोर", "أربع على التوالي"),
    "naval-battle": L("Naval Battle", "海戰棋", "海战棋", "海戦ゲーム", "해전", "Batalla naval", "Batalha Naval", "Bataille navale", "Seeschlacht", "Battaglia navale", "Морской бой", "नौसैनिक युद्ध", "المعركة البحرية"),
  };
  const types = {
    "minefield-logic": L("Deduction Puzzle", "推理益智", "推理益智", "推理パズル", "추리 퍼즐", "Rompecabezas de deducción", "Quebra-cabeça de dedução", "Puzzle de déduction", "Logikrätsel", "Puzzle deduttivo", "Логическая головоломка", "तर्क पहेली", "لغز استنتاج"),
    sudoku: L("Number Logic", "數字邏輯", "数字逻辑", "数字ロジック", "숫자 논리", "Lógica numérica", "Lógica numérica", "Logique numérique", "Zahlenlogik", "Logica numerica", "Числовая логика", "संख्या तर्क", "منطق الأرقام"),
    "lights-out": L("Switch Puzzle", "開關益智", "开关益智", "スイッチパズル", "스위치 퍼즐", "Puzzle de interruptores", "Puzzle de interruptores", "Puzzle de boutons", "Schalterrätsel", "Puzzle di interruttori", "Головоломка с переключателями", "स्विच पहेली", "لغز المفاتيح"),
    "peg-solitaire": L("Jump-and-Clear Puzzle", "跳躍消除益智", "跳跃消除益智", "ジャンプ消去パズル", "점프 제거 퍼즐", "Puzzle de saltos", "Puzzle de saltos", "Puzzle de sauts", "Sprung-Puzzle", "Puzzle a salti", "Прыжковая головоломка", "कूदकर हटाने की पहेली", "لغز القفز والإزالة"),
    "sliding-15": L("Sliding Number Puzzle", "數字滑塊", "数字滑块", "数字スライドパズル", "숫자 슬라이드 퍼즐", "Puzzle numérico deslizante", "Puzzle numérico deslizante", "Taquin numérique", "Zahlen-Schiebepuzzle", "Puzzle numerico scorrevole", "Числовой пятнашки", "संख्या स्लाइड पहेली", "لغز الأرقام المنزلق"),
    "code-breaker": L("Pattern Deduction", "圖案推理", "图案推理", "パターン推理", "패턴 추리", "Deducción de patrones", "Dedução de padrões", "Déduction de motifs", "Musterlogik", "Deduzione di schemi", "Логика узора", "पैटर्न तर्क", "استنتاج الأنماط"),
    "tower-of-hanoi": L("Planning Puzzle", "規劃益智", "规划益智", "計画パズル", "계획 퍼즐", "Puzzle de planificación", "Puzzle de planejamento", "Puzzle de planification", "Planungsrätsel", "Puzzle di pianificazione", "Головоломка планирования", "योजना पहेली", "لغز التخطيط"),
    reversi: L("Strategy Board Game", "策略棋盤遊戲", "策略棋盘游戏", "戦略ボードゲーム", "전략 보드게임", "Juego de estrategia", "Jogo de estratégia", "Jeu de stratégie", "Strategiespiel", "Gioco strategico", "Стратегическая игра", "रणनीति बोर्ड गेम", "لعبة لوحية استراتيجية"),
    "four-in-a-row": L("Gravity Strategy Game", "重力策略遊戲", "重力策略游戏", "重力ストラテジー", "중력 전략 게임", "Estrategia con gravedad", "Estratégia de gravidade", "Stratégie gravitaire", "Schwerkraft-Strategie", "Strategia gravitazionale", "Стратегия с гравитацией", "गुरुत्व रणनीति", "استراتيجية الجاذبية"),
    "naval-battle": L("Hidden-Grid Strategy", "隱藏棋盤策略", "隐藏棋盘策略", "隠し盤面ストラテジー", "숨은 보드 전략", "Estrategia de cuadrícula oculta", "Estratégia de grade oculta", "Stratégie de grille cachée", "Verdeckte-Raster-Strategie", "Strategia a griglia nascosta", "Стратегия скрытой сетки", "रणनीति छिपी ग्रिड", "استراتيجية الشبكة المخفية"),
  };
  const blurbs = {
    "minefield-logic": L("Reveal safe cells, read the numbers, and mark every hidden mine.", "翻開安全格、讀懂數字，標記所有隱藏地雷。", "翻开安全格、读懂数字，标记所有隐藏地雷。", "安全なマスを開き、数字を読み、地雷を見つけます。", "안전한 칸을 열고 숫자를 읽어 지뢰를 표시하세요.", "Abre casillas seguras, lee los números y marca las minas.", "Abra casas seguras, leia os números e marque as minas.", "Ouvrez les cases sûres, lisez les chiffres et marquez les mines.", "Öffne sichere Felder, lies die Zahlen und markiere Minen.", "Apri le caselle sicure, leggi i numeri e segnala le mine.", "Открывайте безопасные клетки, читайте числа и отмечайте мины.", "सुरक्षित खाने खोलें, संख्याएँ पढ़ें और खानों को चिह्नित करें।", "افتح الخلايا الآمنة واقرأ الأرقام وحدد الألغام."),
    sudoku: L("Fill every row, column, and 3×3 box with numbers 1–9.", "讓每一行、每一列與每個 3×3 宮格都填入 1～9。", "让每一行、每一列和每个 3×3 宫格都填入 1～9。", "各行・各列・3×3ブロックに1～9を入れます。", "각 행·열·3×3 구역에 1~9를 채우세요.", "Completa filas, columnas y cajas 3×3 con 1–9.", "Preencha linhas, colunas e blocos 3×3 com 1–9.", "Remplissez les lignes, colonnes et blocs 3×3 avec 1–9.", "Fülle Zeilen, Spalten und 3×3-Blöcke mit 1–9.", "Riempi righe, colonne e blocchi 3×3 con 1–9.", "Заполните строки, столбцы и блоки 3×3 числами 1–9.", "हर पंक्ति, कॉलम और 3×3 बॉक्स में 1–9 भरें।", "املأ كل صف وعمود ومربع 3×3 بالأرقام 1–9."),
    "lights-out": L("Switch a tile and its neighbors; turn every light off in as few moves as possible.", "點擊一格與鄰近格，盡量用最少步數關掉全部燈。", "点击一格及相邻格，尽量用最少步数关掉所有灯。", "マスと上下左右を切り替え、すべての灯りを消します。", "칸과 상하좌우를 바꿔 모든 불을 끄세요.", "Cambia una casilla y sus vecinas para apagar todas las luces.", "Alterne uma casa e suas vizinhas para apagar todas as luzes.", "Basculez une case et ses voisines pour tout éteindre.", "Schalte ein Feld samt Nachbarn und lösche alle Lichter.", "Inverti una casella e le vicine per spegnerle tutte.", "Переключайте клетку и соседей, чтобы погасить все огни.", "खाने और उसके पड़ोसियों को बदलकर सभी लाइट बंद करें।", "بدّل الخلية وجيرانها لإطفاء كل الأضواء."),
    "peg-solitaire": L("Jump a peg over a neighbor into an empty hole and leave one peg.", "讓棋子跳過相鄰棋子到空洞，最後只留下 1 顆。", "让棋子跳过相邻棋子到空洞，最后只留下 1 颗。", "駒を隣の駒越しに空き穴へ跳ばし、最後に1個を残します。", "말을 이웃 말 너머 빈칸으로 뛰어 마지막 하나를 남기세요.", "Salta una ficha sobre otra hasta un hueco y deja solo una.", "Pule uma peça sobre outra até um buraco e deixe apenas uma.", "Sautez un pion par-dessus un voisin vers un trou vide.", "Springe über einen Nachbarn in ein Loch und lasse einen Stein übrig.", "Salta su una pedina vicina verso un foro vuoto e lasciane una.", "Перепрыгивайте через соседнюю фишку в пустую лунку и оставьте одну.", "गोटी को पड़ोसी गोटी के ऊपर से खाली खाने में कूदाएँ और एक छोड़ें।", "اقفز بقطعة فوق جارتها إلى حفرة فارغة واترك قطعة واحدة."),
    "sliding-15": L("Slide neighboring numbers into the empty space and restore 1–15.", "把相鄰數字滑入空位，還原 1～15 的順序。", "把相邻数字滑入空位，还原 1～15 的顺序。", "空きマスへ数字を滑らせ、1～15の順に戻します。", "빈칸으로 이웃 숫자를 밀어 1~15 순서로 맞추세요.", "Desliza números vecinos al hueco y ordena del 1 al 15.", "Deslize números vizinhos para o espaço vazio e ordene 1–15.", "Faites glisser les nombres voisins pour remettre 1–15 en ordre.", "Schiebe Nachbarzahlen in die Lücke und ordne 1–15.", "Fai scorrere i numeri vicini e riordina 1–15.", "Сдвигайте соседние числа в пустоту и соберите 1–15.", "पड़ोसी संख्याओं को खाली जगह में सरकाकर 1–15 बनाएँ।", "حرّك الأرقام المجاورة إلى الفراغ ورتب 1–15."),
    "code-breaker": L("Guess the hidden four-color code using exact-position and color-only clues.", "利用位置正確與顏色正確的提示，推理四格隱藏色碼。", "利用位置正确和颜色正确的提示，推理四格隐藏色码。", "位置一致と色一致のヒントで4色コードを推理します。", "위치와 색상 힌트로 네 칸의 비밀 색 코드를 추리하세요.", "Adivina el código de cuatro colores con pistas de posición y color.", "Adivinhe o código de quatro cores com pistas de posição e cor.", "Trouvez le code de quatre couleurs grâce aux indices de position et de couleur.", "Errate den Vierfarben-Code mit Positions- und Farbhilfen.", "Indovina il codice di quattro colori con indizi di posizione e colore.", "Угадайте код из четырёх цветов по подсказкам позиции и цвета.", "स्थान और रंग संकेतों से चार रंगों का कोड खोजें।", "خمّن رمزًا من أربعة ألوان باستخدام تلميحات الموضع واللون."),
    "tower-of-hanoi": L("Move every disk to the goal peg without putting a larger disk on a smaller one.", "把所有圓盤移到目標柱，大盤不能放在小盤上。", "把所有圆盘移到目标柱，大盘不能放在小盘上。", "大きい円盤を小さい円盤に置かず、すべてを目標へ移します。", "큰 원판을 작은 원판 위에 놓지 않고 모두 목표 기둥으로 옮기세요.", "Mueve todos los discos sin poner uno grande sobre uno pequeño.", "Mova todos os discos sem colocar um maior sobre um menor.", "Déplacez tous les disques sans poser un grand sur un petit.", "Bewege alle Scheiben, ohne eine größere auf eine kleinere zu legen.", "Sposta tutti i dischi senza mettere uno grande su uno piccolo.", "Перенесите все диски, не кладя большой на маленький.", "सभी डिस्क को छोटे पर बड़ी रखे बिना लक्ष्य खंभे पर ले जाएँ।", "انقل كل الأقراص دون وضع قرص كبير فوق صغير."),
    reversi: L("Place discs to surround the opponent; the player with more discs at the end wins.", "放置棋子夾住對手，結束時棋子較多者獲勝。", "放置棋子夹住对手，结束时棋子较多者获胜。", "相手の石を挟み、最後に石が多い方が勝ちです。", "상대 돌을 둘러싸 뒤집고 마지막에 돌이 많은 쪽이 승리합니다.", "Rodea y voltea fichas rivales; gana quien tenga más al final.", "Cerque e vire as peças rivais; vence quem tiver mais no fim.", "Encadrez les pions adverses ; le plus grand nombre gagne.", "Umschließe gegnerische Steine; am Ende gewinnt die größere Zahl.", "Circonda e rovescia le pedine rivali; vince chi ne ha di più.", "Окружайте фишки соперника; побеждает тот, у кого их больше.", "प्रतिद्वंद्वी की गोटियों को घेरें; अंत में अधिक गोटियाँ जीतती हैं।", "أحط قطع الخصم واقلبها؛ يفوز من يملك قطعًا أكثر."),
    "four-in-a-row": L("Drop discs into a column and connect four horizontally, vertically, or diagonally.", "把棋子投入直立棋盤，橫、直或斜線連成四子。", "把棋子投入直立棋盘，横、直或斜线连成四子。", "列に石を落とし、横・縦・斜めに4つ並べます。", "열에 말을 떨어뜨려 가로·세로·대각선으로 네 개를 잇세요.", "Suelta fichas y conecta cuatro en línea, columna o diagonal.", "Solte peças e conecte quatro na linha, coluna ou diagonal.", "Faites tomber les pions et alignez-en quatre.", "Lasse Steine fallen und verbinde vier waagerecht, senkrecht oder diagonal.", "Fai cadere le pedine e collegane quattro in fila.", "Опускайте фишки и соедините четыре по линии, столбцу или диагонали.", "गोटी गिराकर क्षैतिज, लंबवत या तिरछे चार जोड़ें।", "أسقط القطع ووصل أربعًا أفقيًا أو عموديًا أو قطريًا."),
    "naval-battle": L("Place your fleet, fire at hidden coordinates, and sink every enemy ship first.", "配置艦隊、攻擊隱藏座標，率先擊沉敵方所有船艦。", "配置舰队、攻击隐藏坐标，率先击沉敌方所有船舰。", "艦隊を配置し、隠れた座標を撃って敵艦を沈めます。", "함대를 배치하고 숨은 좌표를 공격해 상대 함대를 먼저 침몰시키세요.", "Coloca tu flota, dispara a coordenadas ocultas y hunde todos los barcos.", "Posicione sua frota, ataque coordenadas ocultas e afunde todos os navios.", "Placez votre flotte, tirez sur les coordonnées cachées et coulez tous les navires.", "Platziere deine Flotte, feuere auf geheime Koordinaten und versenke alle Schiffe.", "Posiziona la flotta, spara alle coordinate nascoste e affonda tutte le navi.", "Расставьте флот, стреляйте по скрытым координатам и потопите все корабли.", "बेड़ा रखें, छिपे निर्देशांकों पर गोली चलाएँ और सभी जहाज़ डुबाएँ।", "ضع أسطولك وأطلق على الإحداثيات المخفية وأغرق كل سفن العدو."),
  };
  const metadataDescriptions = {
    "minefield-logic": L(
      "Owner preview: Reveal safe cells, read the numbers, and mark every hidden mine.",
      "擁有者預覽：翻開安全格、讀懂數字，並標記所有隱藏地雷。",
      "所有者预览：翻开安全格、读懂数字，并标记所有隐藏地雷。",
      "オーナー向けプレビュー：安全なマスを開き、数字を読み、隠れた地雷すべてに印を付けます。",
      "소유자 미리보기: 안전한 칸을 열고 숫자를 읽어 숨은 지뢰를 모두 표시하세요.",
      "Vista previa del propietario: descubre casillas seguras, lee los números y marca todas las minas ocultas.",
      "Prévia do proprietário: revele casas seguras, leia os números e marque todas as minas ocultas.",
      "Aperçu propriétaire : révélez les cases sûres, lisez les chiffres et marquez toutes les mines cachées.",
      "Vorschau für den Eigentümer: Decke sichere Felder auf, lies die Zahlen und markiere alle versteckten Minen.",
      "Anteprima del proprietario: scopri le caselle sicure, leggi i numeri e segnala tutte le mine nascoste.",
      "Предпросмотр для владельца: открывайте безопасные клетки, читайте числа и отмечайте все скрытые мины.",
      "मालिक का पूर्वावलोकन: सुरक्षित खाने खोलें, संख्याएँ पढ़ें और सभी छिपी खानों को चिह्नित करें।",
      "معاينة للمالك: اكشف الخلايا الآمنة، واقرأ الأرقام، وحدد جميع الألغام المخفية."
    ),
    "code-breaker": L(
      "Owner preview: Guess the hidden four-color code using exact-position and color-only clues.",
      "擁有者預覽：利用位置正確與顏色正確的提示，推理四格隱藏色碼。",
      "所有者预览：利用位置正确和颜色正确的提示，推理四格隐藏色码。",
      "オーナー向けプレビュー：位置一致と色一致のヒントで4色の秘密コードを推理します。",
      "소유자 미리보기: 위치와 색상 힌트로 네 칸의 비밀 색 코드를 추리하세요.",
      "Vista previa del propietario: adivina el código oculto de cuatro colores con pistas de posición y color.",
      "Prévia do proprietário: adivinhe o código oculto de quatro cores usando pistas de posição e cor.",
      "Aperçu propriétaire : devinez le code caché de quatre couleurs grâce aux indices de position et de couleur.",
      "Vorschau für den Eigentümer: Errate den geheimen Vierfarben-Code mit Positions- und Farbhilfen.",
      "Anteprima del proprietario: indovina il codice segreto di quattro colori usando indizi di posizione e colore.",
      "Предпросмотр для владельца: угадайте секретный код из четырёх цветов по подсказкам позиции и цвета.",
      "मालिक का पूर्वावलोकन: स्थान और रंग संकेतों से चार रंगों का छिपा कोड खोजें।",
      "معاينة للمالك: خمّن الرمز السري من أربعة ألوان باستخدام تلميحات الموضع واللون."
    ),
    "tower-of-hanoi": L(
      "Owner preview: Move every disk to the goal peg without putting a larger disk on a smaller one.",
      "擁有者預覽：把所有圓盤移到目標柱，大盤不能放在小盤上。",
      "所有者预览：把所有圆盘移到目标柱，大盘不能放在小盘上。",
      "オーナー向けプレビュー：大きな円盤を小さな円盤に置かず、すべてを目標ペグへ移します。",
      "소유자 미리보기: 큰 원판을 작은 원판 위에 놓지 않고 모든 원판을 목표 기둥으로 옮기세요.",
      "Vista previa del propietario: mueve todos los discos al poste objetivo sin poner uno grande sobre uno pequeño.",
      "Prévia do proprietário: mova todos os discos para o pino objetivo sem colocar um maior sobre um menor.",
      "Aperçu propriétaire : déplacez tous les disques vers le piquet cible sans poser un grand sur un petit.",
      "Vorschau für den Eigentümer: Bewege alle Scheiben zum Zielstab, ohne eine größere auf eine kleinere zu legen.",
      "Anteprima del proprietario: sposta tutti i dischi sul perno obiettivo senza mettere uno grande su uno piccolo.",
      "Предпросмотр для владельца: перенесите все диски на целевой колышек, не кладя большой на маленький.",
      "मालिक का पूर्वावलोकन: बड़ी डिस्क को छोटी पर रखे बिना सभी डिस्क लक्ष्य खूंटी पर ले जाएँ।",
      "معاينة للمالك: انقل كل الأقراص إلى الوتد الهدف دون وضع قرص كبير فوق صغير."
    ),
  };

  const CONFIG = {
    "minefield-logic": { accent: "#73d5ff", blurb: blurbs["minefield-logic"], type: types["minefield-logic"], build: buildMines },
    sudoku: { accent: "#a997ff", blurb: blurbs.sudoku, type: types.sudoku, build: buildSudoku },
    "lights-out": { accent: "#ffd166", blurb: blurbs["lights-out"], type: types["lights-out"], build: buildLights },
    "peg-solitaire": { accent: "#6ee7b7", blurb: blurbs["peg-solitaire"], type: types["peg-solitaire"], build: buildPeg },
    "sliding-15": { accent: "#7cc7ff", blurb: blurbs["sliding-15"], type: types["sliding-15"], build: buildSliding },
    "code-breaker": { accent: "#ff9ed2", blurb: blurbs["code-breaker"], type: types["code-breaker"], build: buildCode },
    "tower-of-hanoi": { accent: "#ffae7a", blurb: blurbs["tower-of-hanoi"], type: types["tower-of-hanoi"], build: buildHanoi },
    reversi: { accent: "#71e0b5", blurb: blurbs.reversi, type: types.reversi, build: buildReversi },
    "four-in-a-row": { accent: "#ff7e8d", blurb: blurbs["four-in-a-row"], type: types["four-in-a-row"], build: buildConnect },
    "naval-battle": { accent: "#63d0d7", blurb: blurbs["naval-battle"], type: types["naval-battle"], build: buildNaval },
  };

  let locale = "en";
  let soundOn = true;
  let activeGame = null;
  let app = null;

  function routeLocale() {
    const segment = window.location.pathname.split("/").filter(Boolean)[0] || "";
    return ROUTE_LOCALES[segment] || (LOCALES.includes(document.documentElement.lang) ? document.documentElement.lang : "");
  }
  function currentLocale(id) {
    const saved = localStorageSafe("weightPlayLocale") || localStorageSafe("weightplayLocale") || "en";
    // Localized Lights Out routes must own their locale instead of inheriting
    // a previously selected language from another route in this shared lab.
    if (["four-in-a-row", "sliding-15", "sudoku", "lights-out"].includes(id)) {
      const selectedPath = localStorageSafe(LOCALE_SELECTION_PATH_KEY);
      const selectedValue = localStorageSafe(LOCALE_SELECTION_VALUE_KEY);
      if (selectedPath === window.location.pathname && LOCALES.includes(selectedValue)) return selectedValue;
      const routed = routeLocale();
      if (LOCALES.includes(routed)) return routed;
    }
    return LOCALES.includes(saved) ? saved : "en";
  }
  function localStorageSafe(key, value) {
    try { if (value === undefined) return localStorage.getItem(key); localStorage.setItem(key, value); } catch { return null; }
    return value;
  }
  function text(map) { return map?.[locale] ?? map?.en ?? ""; }
  function t(key) { return shared[locale]?.[key] ?? shared.en[key] ?? key; }
  function updateMetadata(id) {
    const descriptionMap = metadataDescriptions[id];
    if (!descriptionMap) return;
    let description = document.querySelector('meta[name="description"]');
    if (!description) {
      description = document.createElement("meta");
      description.name = "description";
      document.head.append(description);
    }
    description.content = text(descriptionMap);
  }
  function esc(value) { return String(value).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[ch])); }
  function announce(message, kind = "") { if (!app) return; app.status.textContent = message; app.status.className = `logic-status-line ${kind}`; }
  function beep(kind = "click") {
    if (!soundOn || !window.AudioContext && !window.webkitAudioContext) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext; const ctx = new Ctx(); const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.type = "sine"; osc.frequency.value = kind === "success" ? 660 : kind === "wrong" ? 170 : 330; gain.gain.setValueAtTime(.0001, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(.08, ctx.currentTime + .01); gain.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + .14); osc.connect(gain).connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + .16); osc.addEventListener("ended", () => ctx.close(), { once: true });
    } catch { /* Audio is an optional enhancement. */ }
  }
  function saveBest(id, value) { const old = Number(localStorageSafe(`classicLogicBest:${id}`) || 0); if (!old || value < old) localStorageSafe(`classicLogicBest:${id}`, value); return Math.min(old || value, value); }
  function makeButton(label, className = "logic-secondary") { const button = document.createElement("button"); button.type = "button"; button.className = className; button.textContent = label; return button; }
  function selectDifficulty(value = "easy") { const select = document.createElement("select"); select.className = "logic-select"; select.setAttribute("aria-label", t("level")); for (const [valueKey, labelKey] of [["easy", "easy"], ["medium", "medium"], ["hard", "hard"]]) { const option = document.createElement("option"); option.value = valueKey; option.textContent = t(labelKey); if (valueKey === value) option.selected = true; select.append(option); } return select; }
  function neighbours(index, rows, cols) { const r = Math.floor(index / cols); const c = index % cols; return [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].filter(([rr, cc]) => rr >= 0 && rr < rows && cc >= 0 && cc < cols).map(([rr, cc]) => rr * cols + cc); }
  function rng(seed) { let value = seed >>> 0; return () => { value = (value * 1664525 + 1013904223) >>> 0; return value / 4294967296; }; }

  function mount(id) {
    if (!CONFIG[id]) return;
    locale = currentLocale(id);
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    const cfg = CONFIG[id];
    document.documentElement.style.setProperty("--logic-accent", cfg.accent);
    document.body.dataset.logicGame = id;
    const title = text(titles[id]);
    const poster = id === "naval-battle"
      ? "../../assets/naval-battle-cover-v1.webp"
      : id === "sliding-15"
      ? "../../assets/sliding-15-cover-v1.webp"
      : id === "lights-out"
      ? "../../assets/lights-out-cover-v2.webp"
      : id === "peg-solitaire"
        ? "../../assets/peg-solitaire-cover-v2.webp"
          : id === "code-breaker"
          ? "../../assets/code-breaker-cover-v2.webp"
          : id === "four-in-a-row"
            ? "../../assets/four-in-a-row-cover-v1.webp"
            : "../../assets/classic-logic-lab-cover.webp";
    document.title = `${title} | WeightPlay`;
    updateMetadata(id);
    app = { id, cfg, title, root: document.querySelector("#logicApp") || document.body };
    const preview = id === "four-in-a-row" ? text(fourPreview) : t("preview");
    app.root.innerHTML = `
      <div class="logic-lab">
          <main class="logic-main main-screen" id="logicMain" data-screen="main">
          <header class="logic-header wp-main-shell-header"><a class="logic-return wp-shell-return" data-wp-return="main" href="/" aria-label="${esc(t("back"))}"><span aria-hidden="true">←</span><img src="../../assets/weightplay-logo.png" alt=""></a><h1>${esc(title)}</h1><div class="logic-header-tools"><button id="settingsButton" class="logic-icon-button wp-shell-settings-button" data-wp-settings type="button" aria-label="${esc(t("settings"))}" aria-expanded="false">⚙</button><div id="settingsPanel" class="logic-settings wp-shell-settings-popover" hidden><h2>${esc(t("settings"))}</h2><div class="logic-setting-row wp-shell-sound-row"><span>${esc(t("sound"))}</span><button id="soundButton" type="button"></button></div><label class="logic-setting-row"><span>${esc(t("language"))}</span><select id="localePicker" aria-label="${esc(t("language"))}"></select></label></div></div></header>
          <section class="logic-hero"><div class="logic-poster"><img class="main-poster" src="${poster}" alt=""></div><div class="logic-copy main-copy"><p class="logic-kicker">${esc(preview)}</p><h2>${esc(title)}</h2><p>${esc(text(cfg.blurb))}</p><div class="logic-facts"><span>${esc(text(cfg.type))}</span><span>${esc(t("moves"))} + ${esc(t("hint"))}</span><span>${esc(text(mineCopy.inputSupport))}</span></div><div class="logic-progress-slot" data-wp-main-progress>${esc(t("ready"))}</div><button id="startButton" class="logic-primary" data-wp-main-start type="button">${esc(t("start"))}</button></div></section>
          <section class="logic-guide"><h2>${esc(t("how"))}</h2><p>${esc(text(cfg.blurb))}</p><h3>${esc(t("ready"))}</h3><p>${esc(text(quickStart))}</p></section>
        </main>
        <section class="logic-battle-screen battle-screen" id="logicBattle" data-screen="battle" data-wp-logical-battle-canvas hidden><header class="logic-battle-header"><button id="battleBack" class="logic-battle-back" data-wp-return="battle" data-wp-battle-utility type="button" aria-label="${esc(t("menu"))}">←</button><h1>${esc(title)}</h1><span id="battleChip" class="logic-status-chip">${esc(t("turn"))}</span></header><div class="logic-battle-wrap"><div id="logicTutorial" class="logic-tutorial"></div><div id="logicStatus" class="logic-status-line" role="status" aria-live="polite">${esc(t("ready"))}</div><div class="logic-board-panel"><div id="logicBoard" class="logic-board-area battle-canvas"></div></div><div class="logic-action-row"><button id="logicHint" class="logic-secondary" type="button">${esc(t("hint"))}</button><button id="logicUndo" class="logic-secondary" type="button">${esc(t("undo"))}</button><button id="logicReset" class="logic-secondary" type="button">${esc(t("reset"))}</button></div></div><div class="logic-result" id="logicResult" hidden role="dialog" aria-modal="true" aria-labelledby="logicResultTitle"><div class="logic-result-card"><h2 id="logicResultTitle"></h2><p id="logicResultText"></p><div class="logic-result-actions"><button id="resultReplay" class="logic-primary" type="button">${esc(t("replay"))}</button><button id="resultMenu" class="logic-secondary" type="button">${esc(t("menu"))}</button><button id="resultClose" class="logic-secondary" type="button">${esc(t("close"))}</button></div></div></div></section>
        <div class="battle-ad-reserve" data-wp-ad-reserve aria-hidden="true"></div></div>`;
    app.main = app.root.querySelector("#logicMain"); app.battle = app.root.querySelector("#logicBattle"); app.board = app.root.querySelector("#logicBoard"); app.tutorial = app.root.querySelector("#logicTutorial"); app.status = app.root.querySelector("#logicStatus"); app.result = app.root.querySelector("#logicResult"); app.resultTitle = app.root.querySelector("#logicResultTitle"); app.resultText = app.root.querySelector("#logicResultText"); app.battleChip = app.root.querySelector("#battleChip");
    const picker = app.root.querySelector("#localePicker"); for (const key of LOCALES) { const option = document.createElement("option"); option.value = key; option.textContent = localeLabels[key]; option.selected = key === locale; picker.append(option); }
    const settings = app.root.querySelector("#settingsPanel"); const settingsButton = app.root.querySelector("#settingsButton"); settingsButton.addEventListener("click", () => { settings.hidden = !settings.hidden; settingsButton.setAttribute("aria-expanded", String(!settings.hidden)); });
    app.root.querySelector("#soundButton").addEventListener("click", () => { soundOn = !soundOn; updateSoundButton(); beep(); });
    picker.addEventListener("change", () => {
      localStorageSafe("weightPlayLocale", picker.value);
      if (["four-in-a-row", "sliding-15", "sudoku"].includes(id)) {
        localStorageSafe(LOCALE_SELECTION_PATH_KEY, window.location.pathname);
        localStorageSafe(LOCALE_SELECTION_VALUE_KEY, picker.value);
      }
      window.location.reload();
    });
    function updateSoundButton() { app.root.querySelector("#soundButton").textContent = `${t("sound")}: ${soundOn ? t("on") : t("off")}`; app.root.querySelector("#soundButton").setAttribute("aria-pressed", String(soundOn)); }
    updateSoundButton();
    app.root.querySelector("#startButton").addEventListener("click", () => startGame());
    app.root.querySelector("#battleBack").addEventListener("click", () => showMain());
    app.root.querySelector("#logicHint").addEventListener("click", () => activeGame?.hint?.());
    app.root.querySelector("#logicUndo").addEventListener("click", () => activeGame?.undo?.());
    app.root.querySelector("#logicReset").addEventListener("click", () => activeGame?.reset?.());
    app.root.querySelector("#resultReplay").addEventListener("click", () => { app.result.hidden = true; activeGame?.reset?.(); });
    app.root.querySelector("#resultMenu").addEventListener("click", showMain);
    app.root.querySelector("#resultClose").addEventListener("click", () => { app.result.hidden = true; });
    app.showMain = showMain;
    app.startGame = startGame;
    return app;

    function resetScroll() { window.scrollTo(0, 0); document.documentElement.scrollTop = 0; document.body.scrollTop = 0; }
    function startGame() { resetScroll(); app.main.hidden = true; app.battle.hidden = false; document.body.classList.add("logic-playing"); app.tutorial.textContent = text(cfg.blurb); app.result.hidden = true; activeGame = cfg.build(app); activeGame.reset(); if (app.status.textContent === t("ready")) announce(t("turn")); resetScroll(); window.WonderAnalytics?.track?.("classic_logic_trial_start", { game_id: id, locale }); }
    function showMain() { activeGame?.stop?.(); activeGame = null; app.result.hidden = true; app.battle.hidden = true; app.main.hidden = false; document.body.classList.remove("logic-playing"); resetScroll(); }
  }

  function finish(won, detail = "") { if (!app) return; beep(won ? "success" : "wrong"); app.resultTitle.textContent = won ? t("win") : t("lose"); app.resultText.textContent = detail || (won ? t("solved") : t("failed")); app.result.hidden = false; app.battleChip.textContent = won ? t("solved") : t("lose"); }
  function setChip(value) { if (app) app.battleChip.textContent = value; }
  function cell(textValue, className, label, handler) { const b = document.createElement("button"); b.type = "button"; b.className = `logic-cell ${className || ""}`; b.textContent = textValue || ""; if (label) b.setAttribute("aria-label", label); b.addEventListener("click", handler); return b; }
  function historyApi(getState, setState) { const past = []; return { save() { past.push(JSON.stringify(getState())); if (past.length > 80) past.shift(); }, undo() { const value = past.pop(); if (!value) { announce(t("ready")); return; } setState(JSON.parse(value)); } }; }

  function buildMines() {
    let difficulty = "easy", rows = 9, cols = 9, mineCount = 10, mines = new Set(), revealed = new Set(), flags = new Set(), first = true, flagMode = false, timer = 0, timerId = null, hintIndex = -1, history = [];
    const panel = document.createElement("div"); const toolbar = document.createElement("div"); toolbar.className = "logic-board-toolbar"; const select = selectDifficulty(); const mode = makeButton(t("revealMode"), "logic-mini"); const flag = makeButton(t("flagMode"), "logic-mini"); const timerChip = document.createElement("span"); timerChip.className = "logic-status-chip"; const flagChip = document.createElement("span"); flagChip.className = "logic-status-chip"; toolbar.append(select, mode, flag, timerChip, flagChip); panel.append(toolbar); const board = document.createElement("div"); board.className = "logic-minesweeper-board"; panel.append(board); app.board.replaceChildren(panel);
    function configure() { const value = select.value; difficulty = value; rows = value === "easy" ? 9 : 16; cols = value === "easy" ? 9 : value === "medium" ? 16 : 30; mineCount = value === "easy" ? 10 : value === "medium" ? 40 : 99; }
    function generate() { mines = new Set(); const random = rng(0x41a7 + rows * 97 + cols); while (mines.size < mineCount) mines.add(Math.floor(random() * rows * cols)); }
    function render() { board.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`; board.replaceChildren(); for (let i = 0; i < rows * cols; i += 1) { const count = neighbours(i, rows, cols).filter((n) => mines.has(n)).length; const isMine = mines.has(i); const open = revealed.has(i); const marked = flags.has(i); const row = Math.floor(i / cols) + 1; const col = (i % cols) + 1; const state = open ? (isMine ? text(mineCopy.mine) : count ? fillTemplate(text(mineCopy.adjacent), { count }) : text(mineCopy.safe)) : marked ? text(mineCopy.flagged) : text(mineCopy.covered); const label = mineCellLabel(row, col, state); const b = cell(open ? (isMine ? "✦" : count || "") : marked ? "⚑" : "", `${open ? "is-revealed" : ""} ${isMine && open ? "is-mine" : ""} ${marked ? "is-flag" : ""} ${count ? `n${Math.min(count, 4)}` : ""}`, label, () => clickCell(i)); b.addEventListener("contextmenu", (event) => { event.preventDefault(); toggleFlag(i); }); if (i === hintIndex) b.classList.add("is-hint"); board.append(b); } timerChip.textContent = `${t("time")}: ${timer}s`; flagChip.textContent = `${text(mineCopy.flags)}: ${mineCount - flags.size}/${mineCount}`; }
    function snapshot() { return { mines: [...mines], revealed: [...revealed], flags: [...flags], first, flagMode, timer, hintIndex }; }
    function startTimer() { clearInterval(timerId); timerId = setInterval(() => { timer += 1; timerChip.textContent = `${t("time")}: ${timer}s`; }, 1000); }
    function resultDetail(won) { return fillTemplate(text(won ? mineCopy.resultSuccess : mineCopy.resultFailure), { safe: won ? revealed.size : Math.max(0, revealed.size - 1), flags: flags.size, total: mineCount, time: timer }); }
    function reveal(i) { if (revealed.has(i) || flags.has(i)) return; const previous = snapshot(); if (first) { while (mines.has(i)) { generate(); } previous.mines = [...mines]; first = false; startTimer(); } history.push(previous); if (mines.has(i)) { revealed.add(i); clearInterval(timerId); render(); finish(false, resultDetail(false)); return; } const queue = [i]; while (queue.length) { const current = queue.shift(); if (revealed.has(current) || flags.has(current)) continue; revealed.add(current); const count = neighbours(current, rows, cols).filter((n) => mines.has(n)).length; if (!count) neighbours(current, rows, cols).forEach((n) => { if (!revealed.has(n)) queue.push(n); }); } hintIndex = -1; render(); if (revealed.size >= rows * cols - mineCount) { clearInterval(timerId); finish(true, resultDetail(true)); } else announce(t("turn")); }
    function toggleFlag(i) { if (revealed.has(i) || (!flags.has(i) && flags.size >= mineCount)) return; history.push(snapshot()); if (flags.has(i)) flags.delete(i); else flags.add(i); hintIndex = -1; render(); announce(t("turn")); }
    function clickCell(i) { if (flagMode) toggleFlag(i); else reveal(i); }
    function reset() { clearInterval(timerId); configure(); mines = new Set(); revealed = new Set(); flags = new Set(); first = true; flagMode = false; timer = 0; hintIndex = -1; history = []; app.result.hidden = true; setChip(t("turn")); generate(); mode.textContent = t("revealMode"); flag.textContent = t("flagMode"); announce(t("ready")); render(); }
    function hintEvidence(index) {
      return neighbours(index, rows, cols).map((clue) => {
        if (!revealed.has(clue) || mines.has(clue)) return null;
        const count = neighbours(clue, rows, cols).filter((n) => mines.has(n)).length;
        const adjacentFlags = neighbours(clue, rows, cols).filter((n) => flags.has(n)).length;
        const covered = neighbours(clue, rows, cols).filter((n) => !revealed.has(n));
        const unflaggedCovered = covered.filter((n) => !flags.has(n));
        return unflaggedCovered.length === 1 && unflaggedCovered[0] === index && count === adjacentFlags ? { count, flags: adjacentFlags } : null;
      }).find(Boolean);
    }
    function hintContext(index) {
      return neighbours(index, rows, cols).map((clue) => {
        if (!revealed.has(clue) || mines.has(clue)) return null;
        const around = neighbours(clue, rows, cols);
        return {
          count: around.filter((n) => mines.has(n)).length,
          flags: around.filter((n) => flags.has(n)).length,
          hidden: around.filter((n) => !revealed.has(n)).length,
        };
      }).find(Boolean);
    }
    function hint() {
      const available = [...Array(rows * cols).keys()].filter((i) => !mines.has(i) && !revealed.has(i) && !flags.has(i));
      const proof = available.map((index) => ({ index, evidence: hintEvidence(index) })).find((entry) => entry.evidence);
      const contextual = proof || available.map((index) => ({ index, context: hintContext(index) })).find((entry) => entry.context);
      const target = contextual?.index ?? available[0];
      hintIndex = target ?? -1;
      render();
      if (proof) announce(fillTemplate(text(mineCopy.hintProof), proof.evidence));
      else if (contextual?.context) announce(fillTemplate(text(mineCopy.hintContext), contextual.context));
      else announce(text(mineCopy.hintGuide));
    }
    select.addEventListener("change", reset); mode.addEventListener("click", () => { flagMode = false; mode.classList.add("is-selected"); flag.classList.remove("is-selected"); }); flag.addEventListener("click", () => { flagMode = true; flag.classList.add("is-selected"); mode.classList.remove("is-selected"); });
    function undo() { const previous = history.pop(); if (!previous) { announce(t("ready")); return; } clearInterval(timerId); mines = new Set(previous.mines); revealed = new Set(previous.revealed); flags = new Set(previous.flags); first = previous.first; flagMode = previous.flagMode; timer = previous.timer; hintIndex = -1; app.result.hidden = true; setChip(t("turn")); mode.classList.toggle("is-selected", !flagMode); flag.classList.toggle("is-selected", flagMode); if (!first) startTimer(); render(); announce(`${t("undo")} · ${t("turn")}`); }
    return { reset, hint, undo, stop() { clearInterval(timerId); } };
  }

  function buildSudoku() {
    const solution = [5,3,4,6,7,8,9,1,2,6,7,2,1,9,5,3,4,8,1,9,8,3,4,2,5,6,7,8,5,9,7,6,1,4,2,3,4,2,6,8,5,3,7,9,1,7,1,3,9,2,4,8,5,6,9,6,1,5,3,7,2,8,4,2,8,7,4,1,9,6,3,5,3,4,5,2,8,6,1,7,9,1,9,6,3,7,2,4,8,5,7,2,8,5,4,1,3,9,6];
    const masks = { easy: [0,4,9,16,23,30,37,42,50,57,64,71,78], medium: [0,1,4,7,9,11,16,18,23,26,28,30,35,37,40,42,47,50,52,57,59,62,64,66,71,73,76,78], hard: [0,1,2,4,7,9,11,13,16,18,20,23,26,28,30,33,35,37,40,42,45,47,50,52,54,57,59,62,64,66,69,71,73,76,78,80] }; let difficulty = "easy", values = [], given = new Set(), selected = -1, hintIndex = -1, history = []; const panel = document.createElement("div"); const toolbar = document.createElement("div"); toolbar.className = "logic-board-toolbar"; const select = selectDifficulty(); toolbar.append(select); panel.append(toolbar); const board = document.createElement("div"); board.className = "logic-sudoku-board"; panel.append(board); const keypad = document.createElement("div"); keypad.className = "logic-keypad"; panel.append(keypad); app.board.replaceChildren(panel);
    function feedback(key, replacements = {}) { return fillTemplate(text(sudokuFeedback[key]), replacements); }
    function remainingCells() { return values.reduce((count, value, index) => count + (!given.has(index) && !value ? 1 : 0), 0); }
    function resultGoal() { const target = Math.max(1, history.length - 1); return difficulty === "hard" ? feedback("hardGoal", { level: t(difficulty), target }) : feedback("goal", { level: t(difficulty), target, next: t(difficulty === "easy" ? "medium" : "hard") }); }
    function render() { board.replaceChildren(); for (let i = 0; i < 81; i += 1) { const value = values[i] || ""; const state = given.has(i) ? fillTemplate(text(sudokuCopy.given), { value }) : value ? fillTemplate(text(sudokuCopy.filled), { value }) : text(sudokuCopy.empty); const labelState = i === hintIndex ? fillTemplate(text(sudokuCopy.hinted), { state }) : state; const label = fillTemplate(text(sudokuCopy.cell), { row: Math.floor(i / 9) + 1, col: (i % 9) + 1, state: labelState }); const b = cell(value, `${given.has(i) ? "given" : ""} ${i === selected ? "is-selected" : ""} ${i === hintIndex ? "is-hint" : ""}`, label, () => { if (!given.has(i)) { selected = i; render(); } }); board.append(b); } keypad.replaceChildren(); for (let n = 1; n <= 9; n += 1) { const b = makeButton(String(n), "logic-mini"); b.addEventListener("click", () => enter(n)); keypad.append(b); } const clear = makeButton(t("clear"), "logic-mini"); clear.addEventListener("click", () => enter(0)); keypad.append(clear); }
    function enter(value) { if (selected < 0 || given.has(selected)) return; const previous = values[selected]; if (previous === (value || 0)) { announce(feedback("ready")); return; } values[selected] = 0; if (value && !sudokuCanPlace(values, selected, value)) { values[selected] = previous; hintIndex = -1; render(); announce(feedback("invalid"), "is-error"); beep("wrong"); return; } history.push({ index: selected, value: previous }); values[selected] = value || 0; hintIndex = -1; render(); const remaining = remainingCells(); if (sudokuComplete(values)) finish(true, `${t("solved")} · ${resultGoal()}`); else { announce(feedback(value ? "correct" : "cleared", { remaining }), "is-good"); beep(value ? "success" : "click"); } }
    function reset() { difficulty = select.value; const baseSolution = solution.slice(0, 81); values = baseSolution.map((v, i) => masks[difficulty].includes(i) ? 0 : v); given = new Set(baseSolution.map((_, i) => i).filter((i) => !masks[difficulty].includes(i))); selected = -1; hintIndex = -1; history = []; app.result.hidden = true; setChip(t("turn")); render(); announce(feedback("ready")); }
    function hint() { hintIndex = values.findIndex((v, i) => !given.has(i) && v !== solution[i]); if (hintIndex >= 0) { selected = hintIndex; render(); announce(feedback("hint"), "is-good"); } }
    function undo() { const previous = history.pop(); if (!previous) { announce(feedback("ready")); return; } values[previous.index] = previous.value; selected = previous.index; hintIndex = -1; app.result.hidden = true; setChip(t("turn")); render(); announce(feedback("undo", { remaining: remainingCells() }), "is-good"); }
    select.addEventListener("change", reset); return { reset, hint, undo };
  }

  function sudokuCanPlace(values, index, value) { const row = Math.floor(index / 9), col = index % 9; for (let i = 0; i < 9; i += 1) { if (values[row * 9 + i] === value || values[i * 9 + col] === value) return false; } const br = Math.floor(row / 3) * 3, bc = Math.floor(col / 3) * 3; for (let r = br; r < br + 3; r += 1) for (let c = bc; c < bc + 3; c += 1) if (values[r * 9 + c] === value) return false; return true; }
  function sudokuComplete(values) { if (values.length < 81 || values.slice(0, 81).some((value) => value < 1 || value > 9)) return false; for (let i = 0; i < 9; i += 1) { if (new Set(values.slice(i * 9, i * 9 + 9)).size !== 9) return false; if (new Set(Array.from({ length: 9 }, (_, r) => values[r * 9 + i])).size !== 9) return false; } for (let br = 0; br < 9; br += 3) for (let bc = 0; bc < 9; bc += 3) { const box = []; for (let r = br; r < br + 3; r += 1) for (let c = bc; c < bc + 3; c += 1) box.push(values[r * 9 + c]); if (new Set(box).size !== 9) return false; } return true; }
  function buildLights() {
    let boardState = []; let moves = 0; let hintIndex = -1; let history = []; const initialMoves = [0, 2, 5, 7, 12, 14, 16, 18, 20, 22, 24]; const panel = document.createElement("div"); const board = document.createElement("div"); board.className = "logic-lights-board"; panel.append(board); const info = document.createElement("div"); info.className = "logic-live"; panel.append(info); app.board.replaceChildren(panel);
    function copy(key, replacements = {}) { return Object.entries(replacements).reduce((value, [token, replacement]) => value.replace(`{${token}}`, String(replacement)), text(lightsCopy[key])); }
    function toggle(i) { history.push({ boardState: boardState.slice(), moves }); const next = new Set([i, ...neighbours(i, 5, 5)]); next.forEach((n) => { boardState[n] = !boardState[n]; }); moves += 1; hintIndex = -1; render(); if (boardState.every((v) => !v)) { const best = saveBest("lights-out", moves); finish(true, `${t("solved")} ${t("moves")}: ${moves} · ${copy("bestLabel", { moves: best })}`); announce(t("solved")); } else announce(t("turn")); }
    function render() { board.replaceChildren(); boardState.forEach((on, i) => { const row = Math.floor(i / 5) + 1; const col = (i % 5) + 1; const state = copy(on ? "cellOn" : "cellOff"); const label = i === hintIndex ? copy("hintedCell", { row, col, state }) : copy("cellLabel", { row, col, state }); const b = cell(on ? "●" : "", on ? "on" : "", label, () => toggle(i)); if (i === hintIndex) b.classList.add("is-hint"); board.append(b); }); info.textContent = `${t("moves")}: ${moves}`; }
    function reset() { boardState = Array(25).fill(false); initialMoves.forEach((i) => { const set = [i, ...neighbours(i, 5, 5)]; set.forEach((n) => { boardState[n] = !boardState[n]; }); }); moves = 0; hintIndex = -1; history = []; app.result.hidden = true; setChip(t("turn")); render(); announce(t("ready")); }
    function hint() { const solution = solveLights(boardState); hintIndex = solution[0] ?? -1; render(); const hinted = hintIndex >= 0 ? copy("hintedCell", { row: Math.floor(hintIndex / 5) + 1, col: (hintIndex % 5) + 1, state: copy(boardState[hintIndex] ? "cellOn" : "cellOff") }) : ""; announce(hinted ? `${text(lightsCopy.hintExplanation)} ${hinted}` : text(lightsCopy.hintExplanation)); }
    function solveLights(start) { for (let mask = 0; mask < 32; mask += 1) { const state = start.slice(); const movesFound = []; for (let c = 0; c < 5; c += 1) if (mask & (1 << c)) { movesFound.push(c); apply(c); } for (let r = 1; r < 5; r += 1) for (let c = 0; c < 5; c += 1) if (state[(r - 1) * 5 + c]) { const index = r * 5 + c; movesFound.push(index); apply(index); } if (state.every((v) => !v)) return movesFound; function apply(i) { [i, ...neighbours(i, 5, 5)].forEach((n) => { state[n] = !state[n]; }); } } return []; }
    function undo() { const previous = history.pop(); if (!previous) { announce(t("ready")); return; } boardState = previous.boardState.slice(); moves = previous.moves; hintIndex = -1; app.result.hidden = true; setChip(t("turn")); render(); announce(`${t("undo")} · ${t("moves")}: ${moves}`); }
    return { reset, hint, undo };
  }

  function buildPeg() {
    const valid = Array.from({ length: 49 }, (_, i) => { const r = Math.floor(i / 7), c = i % 7; return (r >= 2 && r <= 4) || (c >= 2 && c <= 4); }); let pegs = []; let selected = -1; let hintPair = []; let moves = 0; let history = []; const board = document.createElement("div"); board.className = "logic-peg-board"; app.board.replaceChildren(board);
    function legalMoves() { const found = []; for (let i = 0; i < 49; i += 1) if (pegs[i]) for (const n of neighbours(i, 7, 7)) { const beyond = n + (n - i); if (beyond >= 0 && beyond < 49 && valid[beyond] && pegs[n] && !pegs[beyond]) found.push([i, n, beyond]); } return found; }
    function render() { board.replaceChildren(); for (let i = 0; i < 49; i += 1) { if (!valid[i]) { board.append(cell("", "void", "", () => {})); continue; } const b = cell(pegs[i] ? "●" : "", `${pegs[i] ? "peg" : "empty"} ${i === selected ? "is-selected" : ""} ${hintPair.includes(i) ? "is-hint" : ""}`, pegs[i] ? `Peg ${i + 1}` : `Empty hole ${i + 1}`, () => choose(i)); board.append(b); } }
    function choose(i) { if (!valid[i]) return; if (selected < 0) { if (pegs[i]) { selected = i; announce(t("selectTarget")); } } else if (pegs[i]) { selected = i; announce(t("selectTarget")); } else { const move = legalMoves().find(([from, , to]) => from === selected && to === i); if (move) { history.push({ pegs: pegs.slice(), moves }); pegs[move[0]] = false; pegs[move[1]] = false; pegs[move[2]] = true; moves += 1; selected = -1; if (pegs.filter(Boolean).length === 1) finish(true, `${t("solved")} ${t("moves")}: ${moves}`); else if (!legalMoves().length) finish(false, t("noMoves")); else announce(`${t("turn")} · ${t("moves")}: ${moves}`); } else announce(t("selectTarget")); } hintPair = []; render(); }
    function reset() { pegs = valid.map((v, i) => v && i !== 24); selected = -1; hintPair = []; moves = 0; history = []; app.result.hidden = true; setChip(t("turn")); render(); announce(t("selectSource")); }
    function hint() { const move = legalMoves()[0]; hintPair = move ? [move[0], move[2]] : []; render(); announce(t("hint")); }
    function undo() { const previous = history.pop(); if (!previous) { selected = -1; hintPair = []; render(); announce(t("selectSource")); return; } pegs = previous.pegs; moves = previous.moves; selected = -1; hintPair = []; app.result.hidden = true; setChip(t("turn")); render(); announce(`${t("undo")} · ${t("moves")}: ${moves} · ${t("selectSource")}`); }
    return { reset, hint, undo };
  }

  function buildSliding() {
    let tiles = [], blank = 15, history = [], hintIndex = -1; const panel = document.createElement("div"); const board = document.createElement("div"); board.className = "logic-sliding-board"; panel.append(board); const label = document.createElement("div"); label.className = "logic-live"; panel.append(label); app.board.replaceChildren(panel);
    function render() { board.replaceChildren(); tiles.forEach((value, i) => { const b = cell(value === 0 ? "" : String(value), value === 0 ? "blank" : "", value === 0 ? "Empty space" : `Tile ${value}`, () => move(i)); if (i === hintIndex) b.classList.add("is-hint"); board.append(b); }); label.textContent = `${t("moves")}: ${history.length}`; }
    function move(i) { if (!neighbours(i, 4, 4).includes(blank)) { announce(t("failed")); return; } history.push(tiles.slice()); [tiles[i], tiles[blank]] = [tiles[blank], tiles[i]]; blank = i; hintIndex = -1; render(); if (tiles.every((v, index) => v === (index === 15 ? 0 : index + 1))) finish(true, `${t("solved")} · ${t("moves")}: ${history.length}`); else announce(`${t("turn")} · ${t("moves")}: ${history.length}`); }
    function reset() { tiles = [...Array(15).keys()].map((n) => n + 1).concat(0); blank = 15; history = []; const random = rng(0x1571); let last = -1; for (let n = 0; n < 35; n += 1) { const options = neighbours(blank, 4, 4).filter((i) => i !== last); const next = options[Math.floor(random() * options.length)]; [tiles[next], tiles[blank]] = [tiles[blank], tiles[next]]; last = blank; blank = next; } hintIndex = -1; app.result.hidden = true; setChip(t("turn")); render(); announce(t("ready")); }
    function hint() { const target = neighbours(blank, 4, 4).find((i) => tiles[i] !== i + 1); hintIndex = target ?? -1; render(); announce(t("hint")); }
    return { reset, hint, undo() { const previous = history.pop(); if (!previous) { hintIndex = -1; render(); announce(t("ready")); return; } tiles = previous; blank = tiles.indexOf(0); hintIndex = -1; app.result.hidden = true; setChip(t("turn")); render(); announce(`${t("undo")} · ${t("moves")}: ${history.length}`); } };
  }

  function buildCode() {
    let secret = [], guess = [], history = [], turn = 0; const colors = ["#ff6b6b", "#ffd166", "#6ee7b7", "#6ec8ff", "#b69cff", "#ff9ed2"]; const panel = document.createElement("div"); panel.className = "logic-code-board"; const slots = document.createElement("div"); slots.className = "logic-code-slots"; const palette = document.createElement("div"); palette.className = "logic-code-colors"; const legend = document.createElement("p"); legend.className = "logic-live logic-code-legend"; const submit = makeButton(t("submit"), "logic-primary"); const historyBox = document.createElement("div"); historyBox.className = "logic-code-history"; panel.append(slots, palette, legend, submit, historyBox); app.board.replaceChildren(panel);
    function makeSecret() { const random = rng((Date.now() ^ Math.floor(performance.now())) >>> 0); return Array.from({ length: 4 }, () => Math.floor(random() * colors.length)); }
    function render() { legend.textContent = `${t("correct")}: ● · ${t("near")}: ○`; slots.replaceChildren(); for (let i = 0; i < 4; i += 1) { const b = makeButton("", "logic-code-slot"); const color = guess[i]; b.dataset.color = color ?? ""; b.setAttribute("aria-label", color === undefined ? fillTemplate(text(codeSlotCopy.empty), { slot: i + 1 }) : fillTemplate(text(codeSlotCopy.filled), { slot: i + 1, color: color + 1 })); b.addEventListener("click", () => { guess.splice(i, 1); render(); }); slots.append(b); } palette.replaceChildren(); colors.forEach((color, i) => { const b = makeButton("", "logic-color"); b.dataset.color = i; b.style.background = color; b.setAttribute("aria-label", `${t("codePick")} ${i + 1}`); b.addEventListener("click", () => { if (guess.length < 4) guess.push(i); render(); }); palette.append(b); }); historyBox.replaceChildren(...history.map((row) => { const el = document.createElement("div"); el.className = "logic-guess-row"; el.innerHTML = `<span>${row.guess.map((v) => `<i class="logic-code-slot" data-color="${v}"></i>`).join("")}</span><span class="logic-feedback">${row.exact} ● ${row.near} ○</span>`; return el; })); }
    function submitGuess() { if (guess.length !== 4) { announce(`${t("codePick")} · ${text(codeRemaining)}: ${4 - guess.length}`); return; } const exact = guess.filter((v, i) => v === secret[i]).length; const counts = Array(6).fill(0); secret.forEach((v, i) => { if (guess[i] !== v) counts[v] += 1; }); const near = guess.reduce((total, v, i) => total + (v !== secret[i] && counts[v] > 0 ? (counts[v] -= 1, 1) : 0), 0); history.push({ guess: guess.slice(), exact, near }); turn += 1; if (exact === 4) { render(); announce(t("solved")); finish(true, `${t("solved")} ${t("correct")}: 4`); } else if (turn >= 10) { render(); announce(t("lose")); finish(false, `${t("failed")} ${t("correct")}: ${secret.map((v) => v + 1).join(" · ")}`); } else { guess = []; render(); announce(`${t("correct")}: ${exact} · ${t("near")}: ${near} · ${t("turn")}`); } }
    function reset() { secret = makeSecret(); guess = []; history = []; turn = 0; app.result.hidden = true; setChip(t("turn")); render(); announce(t("ready")); }
    function hint() { if (guess.length < 4) guess.push(secret[guess.length]); render(); const remaining = 4 - guess.length; announce(remaining ? `${t("hint")} · ${text(codeRemaining)}: ${remaining}` : `${t("hint")} · ${t("submit")}`); }
    submit.addEventListener("click", submitGuess); return { reset, hint, undo() { history.pop(); turn = history.length; render(); } };
  }

  function buildHanoi() {
    let count = 3, towers = [], selected = -1, moves = 0, history = []; const panel = document.createElement("div"); const toolbar = document.createElement("div"); toolbar.className = "logic-board-toolbar"; const select = selectDifficulty(); const target = document.createElement("span"); target.className = "logic-live logic-hanoi-target"; target.setAttribute("aria-live", "polite"); toolbar.append(select, target); const board = document.createElement("div"); board.className = "logic-hanoi-board"; panel.append(toolbar, board); app.board.replaceChildren(panel);
    function minimumMoves() { return (2 ** count) - 1; }
    function legalDestination(index) { if (selected < 0 || selected === index) return false; const from = towers[selected]; const disk = from?.[from.length - 1]; const to = towers[index]; return Boolean(disk) && (!to.length || to[to.length - 1] > disk); }
    function render(status = `${t("moves")}: ${moves}`) { target.textContent = fillTemplate(text(hanoiCopy.minimumMoves), { moves, minimum: minimumMoves() }); board.replaceChildren(); towers.forEach((tower, index) => { const peg = document.createElement("button"); peg.type = "button"; peg.className = `logic-tower ${selected === index ? "is-selected" : ""} ${legalDestination(index) ? "is-legal-destination" : ""}`; peg.setAttribute("aria-label", fillTemplate(text(hanoiCopy.pegLabel), { peg: index + 1 })); tower.forEach((disk) => { const diskEl = document.createElement("span"); diskEl.className = "logic-disk"; diskEl.style.width = `${30 + disk * (56 / count)}%`; diskEl.textContent = disk; peg.append(diskEl); }); peg.addEventListener("click", () => clickPeg(index)); board.append(peg); }); announce(status); }
    function clickPeg(index) { if (selected < 0) { if (towers[index].length) { selected = index; render(t("selectTarget")); } else render(t("selectSource")); return; } if (selected === index) { selected = -1; render(t("selectSource")); return; } const from = towers[selected], to = towers[index]; const disk = from[from.length - 1]; if (disk && (!to.length || to[to.length - 1] > disk)) { history.push({ towers: towers.map((tower) => tower.slice()), moves }); from.pop(); to.push(disk); moves += 1; selected = -1; beep(); if (to.length === count && index === 2) finish(true, `${t("solved")} ${t("moves")}: ${moves}`); else if (to.length === count) render(fillTemplate(text(hanoiCopy.goalPeg), { peg: index + 1 })); else render(); } else { selected = -1; render(t("failed")); } }
    function reset() { count = select.value === "easy" ? 3 : select.value === "medium" ? 4 : 5; towers = [Array.from({ length: count }, (_, i) => count - i), [], []]; selected = -1; moves = 0; history = []; app.result.hidden = true; setChip(t("turn")); render(); }
    function hint() { const index = towers.findIndex((tower) => tower.length); selected = index; render(t("hint")); }
    function undo() { const previous = history.pop(); if (!previous) { selected = -1; render(t("ready")); return; } towers = previous.towers.map((tower) => tower.slice()); moves = previous.moves; selected = -1; app.result.hidden = true; setChip(t("turn")); render(`${t("undo")} · ${t("moves")}: ${moves}`); }
    select.addEventListener("change", reset); return { reset, hint, undo };
  }

  function buildReversi() {
    let boardState = [], player = 1, difficulty = "easy", locked = false, playerPayoff = null; const panel = document.createElement("div"); const toolbar = document.createElement("div"); toolbar.className = "logic-board-toolbar"; const select = selectDifficulty(); toolbar.append(select); const policy = document.createElement("p"); policy.className = "logic-live logic-reversi-policy"; const reply = document.createElement("p"); reply.className = "logic-live logic-reversi-reply"; reply.setAttribute("aria-live", "polite"); const board = document.createElement("div"); board.className = "logic-reversi-board"; panel.append(toolbar, policy, board, reply); app.board.replaceChildren(panel);
    function legal(color) { const moves = []; for (let i = 0; i < 64; i += 1) if (!boardState[i] && flips(i, color).length) moves.push(i); return moves; }
    function flips(i, color) { const found = []; const r = Math.floor(i / 8), c = i % 8; for (const [dr, dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) { const line = []; let rr = r + dr, cc = c + dc; while (rr >= 0 && rr < 8 && cc >= 0 && cc < 8 && boardState[rr * 8 + cc] === 3 - color) { line.push(rr * 8 + cc); rr += dr; cc += dc; } if (line.length && rr >= 0 && rr < 8 && cc >= 0 && cc < 8 && boardState[rr * 8 + cc] === color) found.push(...line); } return found; }
    const corners = new Set([0, 7, 56, 63]); const edges = new Set([...Array(8).keys(), ...Array(8).keys()].flatMap((n) => [n, 56 + n, n * 8, n * 8 + 7])); const cornerTraps = new Map([[9, 0], [14, 7], [49, 56], [54, 63], [1, 0], [8, 0], [6, 7], [15, 7], [48, 56], [57, 56], [55, 63], [62, 63]]);
    function formatPayoff(move) { if (!move) return ""; if (corners.has(move.index)) return text(reversiPayoff.corner); const corner = cornerTraps.get(move.index); if (corner !== undefined && move.cornerOpen) return text(reversiPayoff.cornerAdjacent); if (edges.has(move.index)) return text(reversiPayoff.edge); if (move.afterMoves > move.beforeMoves) return fillTemplate(text(reversiPayoff.mobilityUp), { count: move.afterMoves }); if (move.afterMoves < move.beforeMoves) return fillTemplate(text(reversiPayoff.mobilityDown), { count: move.afterMoves }); return fillTemplate(text(reversiPayoff.mobilitySteady), { count: move.afterMoves }); }
    function render() { board.replaceChildren(); const moves = new Set(legal(player)); for (let i = 0; i < 64; i += 1) { const b = cell("", `${boardState[i] === 1 ? "black" : boardState[i] === 2 ? "white" : ""} ${moves.has(i) && !locked ? "legal" : ""}`, `Row ${Math.floor(i / 8) + 1}, Column ${(i % 8) + 1}`, () => play(i)); if (boardState[i]) { const disc = document.createElement("span"); disc.className = "disc"; b.append(disc); } board.append(b); } setChip(`${t("player")}: ${boardState.filter((v) => v === 1).length} · ${t("opponent")}: ${boardState.filter((v) => v === 2).length}`); }
    function play(i) { if (locked || !legal(player).includes(i)) return; const beforeMoves = legal(player).length; boardState[i] = 1; flips(i, 1).forEach((n) => { boardState[n] = 1; }); const corner = cornerTraps.get(i); playerPayoff = { index: i, beforeMoves, afterMoves: legal(player).length, cornerOpen: corner !== undefined && boardState[corner] === 0 }; locked = true; render(); setTimeout(aiTurn, 240); }
    function hardScore(i) { const row = Math.floor(i / 8), col = i % 8; let score = flips(i, 2).length * 4 + 12 - Math.abs(row - 3.5) - Math.abs(col - 3.5); if (corners.has(i)) score += 1000; else if (edges.has(i)) score += 120; const corner = cornerTraps.get(i); if (corner !== undefined && !boardState[corner]) score -= 240; return score; }
    function chooseAiMove(moves) { const ranked = moves.map((index) => ({ index, captures: flips(index, 2).length, hard: hardScore(index) })); ranked.sort((a, b) => difficulty === "easy" ? a.captures - b.captures || b.index - a.index : difficulty === "medium" ? b.captures - a.captures || a.index - b.index : b.hard - a.hard || b.captures - a.captures || a.index - b.index); return ranked[0]; }
    function formatReply(choice) { const square = `${String.fromCharCode(65 + choice.index % 8)}${Math.floor(choice.index / 8) + 1}`; return text(reversiReply).replace("{level}", t(difficulty)).replace("{square}", square).replace("{count}", String(choice.captures)); }
    function aiTurn() { const moves = legal(2); if (!moves.length) { if (!legal(1).length) end(); else { reply.textContent = formatPayoff(playerPayoff); playerPayoff = null; delete reply.dataset.aiChoice; delete reply.dataset.aiCaptures; locked = false; render(); } return; } const choice = chooseAiMove(moves); boardState[choice.index] = 2; flips(choice.index, 2).forEach((n) => { boardState[n] = 2; }); reply.textContent = [formatReply(choice), formatPayoff(playerPayoff)].filter(Boolean).join(" "); playerPayoff = null; reply.dataset.aiChoice = String(choice.index); reply.dataset.aiCaptures = String(choice.captures); const playerMoves = legal(1), nextAiMoves = legal(2); if (!playerMoves.length) { render(); if (!nextAiMoves.length) end(); else { locked = true; setTimeout(aiTurn, 240); } } else { locked = false; render(); } }
    function end() { render(); const p = boardState.filter((v) => v === 1).length, a = boardState.filter((v) => v === 2).length; finish(p > a, `${t("score")}: ${p} – ${a}`); }
    function reset() { difficulty = select.value; boardState = Array(64).fill(0); boardState[27] = 2; boardState[28] = 1; boardState[35] = 1; boardState[36] = 2; playerPayoff = null; locked = false; policy.textContent = text(reversiDifficultyPolicy[difficulty]); reply.textContent = ""; delete reply.dataset.aiChoice; delete reply.dataset.aiCaptures; render(); announce(t("turn")); }
    function hint() { const move = legal(1)[0]; if (move !== undefined) { const target = board.children[move]; target?.classList.add("is-hint"); announce(t("hint")); } }
    select.addEventListener("change", reset); return { reset, hint, undo() { announce(t("undo")); } };
  }

  function buildConnect() {
    let grid = [], difficulty = "easy", locked = false, hintColumn = -1, playerMoves = 0, history = [], aiTimer = null; const panel = document.createElement("div"); const toolbar = document.createElement("div"); toolbar.className = "logic-board-toolbar"; const select = selectDifficulty(); toolbar.append(select); const board = document.createElement("div"); board.className = "logic-connect-board"; panel.append(toolbar, board); app.board.replaceChildren(panel);
    function render() { board.replaceChildren(); const hintRow = hintColumn >= 0 ? [...Array(6).keys()].reverse().find((r) => !grid[r * 7 + hintColumn]) : -1; for (let r = 0; r < 6; r += 1) for (let c = 0; c < 7; c += 1) { const value = grid[r * 7 + c]; const hintClass = hintRow === r && hintColumn === c && !value ? "is-hint" : ""; const label = fillTemplate(text(connectCellLabel), { column: c + 1, row: r + 1 }); const b = cell("", `${value === 1 ? "red" : value === 2 ? "yellow" : ""} ${hintClass}`, label, () => drop(c)); if (value) { const disc = document.createElement("span"); disc.className = "disc"; b.append(disc); } board.append(b); } setChip(`${t("player")}: ${grid.filter((v) => v === 1).length} · ${t("opponent")}: ${grid.filter((v) => v === 2).length}`); }
    function resultGoal(won) { const level = t(difficulty); const nextLevel = difficulty === "easy" ? t("medium") : t("hard"); const target = Math.max(1, playerMoves - 1); const copy = won ? (difficulty === "hard" ? connectResult.hard : connectResult.win) : connectResult.loss; return fillTemplate(text(copy), { level, moves: playerMoves, nextLevel, target }); }
    function clearAiTimer() { if (aiTimer !== null) { clearTimeout(aiTimer); aiTimer = null; } }
    function drop(column) { if (locked) return; const row = [...Array(6).keys()].reverse().find((r) => !grid[r * 7 + column]); if (row === undefined) return; history.push({ grid: grid.slice(), playerMoves }); hintColumn = -1; grid[row * 7 + column] = 1; playerMoves += 1; render(); if (hasFour(1)) return finish(true, resultGoal(true)); if (grid.every(Boolean)) return finish(false, resultGoal(false)); locked = true; announce(text(connectOpponentThinking)); aiTimer = setTimeout(() => { aiTimer = null; ai(); }, 250); }
    function hasFour(color) { for (let r = 0; r < 6; r += 1) for (let c = 0; c < 7; c += 1) for (const [dr, dc] of [[0,1],[1,0],[1,1],[1,-1]]) { let n = 0; for (let k = 0; k < 4; k += 1) { const rr = r + dr * k, cc = c + dc * k; if (rr >= 0 && rr < 6 && cc >= 0 && cc < 7 && grid[rr * 7 + cc] === color) n += 1; } if (n === 4) return true; } return false; }
    function ai() { const available = [...new Set([...Array(7).keys()].filter((c) => grid[c] === 0))]; let column = available[Math.floor(Math.random() * available.length)]; const winning = available.find((c) => simulateWin(c, 2)); const block = available.find((c) => simulateWin(c, 1)); if (difficulty !== "easy") column = winning ?? block ?? (difficulty === "hard" ? available.sort((a, b) => Math.abs(3 - a) - Math.abs(3 - b))[0] : column); const row = [...Array(6).keys()].reverse().find((r) => !grid[r * 7 + column]); grid[row * 7 + column] = 2; locked = false; render(); if (hasFour(2) || grid.every(Boolean)) finish(false, resultGoal(false)); else announce(t("turn")); }
    function simulateWin(column, color) { const row = [...Array(6).keys()].reverse().find((r) => !grid[r * 7 + column]); if (row === undefined) return false; grid[row * 7 + column] = color; const result = hasFour(color); grid[row * 7 + column] = 0; return result; }
    function reset() { clearAiTimer(); difficulty = select.value; grid = Array(42).fill(0); locked = false; hintColumn = -1; playerMoves = 0; history = []; app.result.hidden = true; render(); announce(t("turn")); }
    function hint() { if (locked) return announce(text(connectHint.wait)); const available = [...Array(7).keys()].filter((c) => grid[c] === 0); if (!available.length) return announce(t("failed")); const winning = available.find((c) => simulateWin(c, 1)); const block = winning === undefined ? available.find((c) => simulateWin(c, 2)) : undefined; const column = winning ?? block ?? available.slice().sort((a, b) => Math.abs(3 - a) - Math.abs(3 - b) || a - b)[0]; const message = winning !== undefined ? connectHint.win : block !== undefined ? connectHint.block : connectHint.center; hintColumn = column; render(); announce(fillTemplate(text(message), { column: column + 1 })); }
    function undo() { clearAiTimer(); const previous = history.pop(); hintColumn = -1; app.result.hidden = true; locked = false; if (previous) { grid = previous.grid.slice(); playerMoves = previous.playerMoves; } render(); announce(previous ? `${t("undo")} · ${t("turn")}` : t("ready")); }
    select.addEventListener("change", reset); return { reset, hint, undo, stop: clearAiTimer };
  }

  function buildNaval() {
    let phase = "place", orientation = "h", playerShips = [], enemyShips = [], playerShots = new Set(), enemyShots = new Set(), currentShip = 0, locked = false; const ships = [3, 2, 2]; const panel = document.createElement("div"); const toolbar = document.createElement("div"); toolbar.className = "logic-board-toolbar"; const rotate = makeButton(t("rotate"), "logic-secondary"); const ready = makeButton(t("readyFleet"), "logic-primary"); toolbar.append(rotate, ready); const layout = document.createElement("div"); layout.className = "logic-naval-layout"; const playerSide = document.createElement("div"); const enemySide = document.createElement("div"); layout.append(playerSide, enemySide); panel.append(toolbar, layout); app.board.replaceChildren(panel);
    function cellsFor(start, length, dir) { const r = Math.floor(start / 6), c = start % 6; const cells = []; for (let k = 0; k < length; k += 1) { const rr = r + (dir === "v" ? k : 0), cc = c + (dir === "h" ? k : 0); if (rr >= 6 || cc >= 6) return []; cells.push(rr * 6 + cc); } return cells; }
    function validPlacement(cells, shipsList) { return cells.length && !cells.some((i) => shipsList.flat().includes(i)); }
    function renderBoard(host, shipsList, shots, own, clickHandler) { host.replaceChildren(); const title = document.createElement("h3"); title.textContent = own ? `${t("player")} · ${phase === "place" ? t("placeShip") : t("score")}` : `${t("opponent")} · ${t("attack")}`; host.append(title); const grid = document.createElement("div"); grid.className = "logic-naval-board"; for (let i = 0; i < 36; i += 1) { const ship = shipsList.flat().includes(i); const shot = shots.has(i); const state = own ? (shot ? (ship ? text(navalCopy.yourShipHit) : text(navalCopy.opponentMiss)) : (ship ? text(navalCopy.yourShip) : phase === "place" ? text(navalCopy.emptyPlacement) : text(navalCopy.ownWater))) : (shot ? (ship ? text(navalCopy.hitShip) : text(navalCopy.missedWater)) : text(navalCopy.unknownTarget)); const label = fillTemplate(text(navalCopy.cell), { row: Math.floor(i / 6) + 1, col: (i % 6) + 1, state }); const b = cell(shot ? (ship ? "✦" : "·") : "", `${own && ship ? "ship" : ""} ${shot && ship ? "hit" : ""} ${shot && !ship ? "miss" : ""}`, label, () => clickHandler(i)); grid.append(b); } host.append(grid); }
    function render() { const preview = phase === "place" ? playerShips : playerShips; renderBoard(playerSide, preview, enemyShots, true, (i) => place(i)); renderBoard(enemySide, enemyShips, playerShots, false, (i) => attack(i)); enemySide.hidden = phase === "place"; rotate.hidden = phase !== "place"; ready.hidden = phase !== "place"; }
    function place(i) { if (phase !== "place") return; const cells = cellsFor(i, ships[currentShip], orientation); if (!validPlacement(cells, playerShips)) { announce(t("failed")); return; } playerShips.push(cells); currentShip += 1; if (currentShip >= ships.length) announce(t("readyFleet")); render(); }
    function attack(i) { if (phase !== "battle" || locked || playerShots.has(i)) { if (phase === "battle" && playerShots.has(i)) announce(t("noRepeat")); return; } playerShots.add(i); const hit = enemyShips.flat().includes(i); render(); announce(hit ? t("hit") : t("miss")); if (enemyShips.every((ship) => ship.every((cellIndex) => playerShots.has(cellIndex)))) return finish(true, t("win")); locked = true; setTimeout(enemyTurn, 300); }
    function enemyTurn() { const choices = [...Array(36).keys()].filter((i) => !enemyShots.has(i)); const shot = choices[Math.floor(Math.random() * choices.length)]; enemyShots.add(shot); const hit = playerShips.flat().includes(shot); locked = false; render(); announce(hit ? t("hit") : t("miss")); if (playerShips.every((ship) => ship.every((cellIndex) => enemyShots.has(cellIndex)))) finish(false, t("lose")); }
    function startBattle() { if (currentShip < ships.length) { announce(t("placeShip")); return; } phase = "battle"; enemyShips = [[0,1,2], [14,20], [31,32]]; render(); announce(t("attack")); }
    function reset() { phase = "place"; orientation = "h"; playerShips = []; enemyShips = []; playerShots = new Set(); enemyShots = new Set(); currentShip = 0; locked = false; render(); announce(t("placeShip")); }
    rotate.addEventListener("click", () => { orientation = orientation === "h" ? "v" : "h"; announce(`${t("rotate")}: ${orientation.toUpperCase()}`); }); ready.addEventListener("click", startBattle); return { reset, hint() { if (phase === "place") announce(t("hint")); else announce(t("attack")); }, undo() { announce(t("undo")); } };
  }

  window.WPClassicLogic = { mount, config: CONFIG };
}());
