(() => {
  "use strict";

  const loadingCopy = {
    en: "Opening the mosaic archive…",
    "zh-Hant": "正在開啟拼圖檔案館…",
    "zh-Hans": "正在打开拼图档案馆…",
    ja: "モザイク資料館を開いています…",
    ko: "모자이크 기록관을 여는 중…",
    es: "Abriendo el archivo de mosaicos…",
    "pt-BR": "Abrindo o arquivo de mosaicos…",
    fr: "Ouverture des archives de mosaïques…",
    de: "Mosaikarchiv wird geöffnet…",
    it: "Apertura dell’archivio dei mosaici…",
    ru: "Открываем архив мозаик…",
    hi: "मोज़ेक संग्रह खोला जा रहा है…",
    ar: "جارٍ فتح أرشيف الفسيفساء…",
  };
  const dictionaries = {
    fr: {
      "Use Paint for confirmed cells and Mark for confirmed empty cells.": "Utilisez Peindre pour les cellules confirmées et Marquer pour les cellules vides confirmées.",
      "Utilisez Paint pour les cellules confirmées et Mark pour les cellules vides confirmées.": "Utilisez Peindre pour les cellules confirmées et Marquer pour les cellules vides confirmées.",
      "Animal Mosaic Clues": "Mosaïques Animales",
      "Start Game": "Commencer",
      "Deduction mosaic puzzle": "Puzzle mosaïque de déduction",
      "Read every row and column clue to uncover a hidden animal portrait.": "Lisez chaque indice de ligne et de colonne pour révéler un portrait animal caché.",
      "Original WeightPlay logic puzzle": "Puzzle logique original de WeightPlay",
      "Every number describes a continuous run.": "Chaque nombre décrit une suite continue.",
      "Paint cells that must be filled, cross cells that must stay empty, and use intersecting clues to solve each mosaic without guessing.": "Peignez les cases à remplir, marquez celles qui restent vides et croisez les indices pour résoudre chaque mosaïque sans deviner.",
      "How to play": "Comment jouer",
      "Thirty mosaics": "Trente mosaïques",
      "Six chapters grow from guided 5×5 signs to deduction-rich 12×12 portraits.": "Six chapitres vont de grilles guidées 5×5 à des portraits 12×12 riches en déductions.",
      "Choose a Mosaic": "Choisir une mosaïque",
      "Drag the rail. The centred glowing card is selected.": "Faites glisser le rail. La carte lumineuse centrée est sélectionnée.",
      "Mosaic selector": "Sélecteur de mosaïque",
      Back: "Retour",
      "Back to WeightPlay": "Retour à WeightPlay",
      "Woodland Signs": "Signes de la forêt",
      "River Tracks": "Traces de rivière",
      "Moon Garden": "Jardin lunaire",
      "Coral Archive": "Archives de corail",
      "Sky Atlas": "Atlas céleste",
      "Grand Menagerie": "Grande ménagerie",
      Marks: "Marques",
      Errors: "Erreurs",
      Filled: "Remplies",
      "Nonogram mosaic board": "Plateau de mosaïque nonogramme",
      "Use the clues to reveal every filled cell.": "Utilisez les indices pour révéler chaque case remplie.",
      "A clue such as 3 1 means a run of three filled cells, at least one empty cell, then one filled cell.": "Un indice comme 3 1 signifie une suite de trois cases remplies, au moins une case vide, puis une case remplie.",
      Continue: "Continuer",
      "Leave this mosaic?": "Quitter cette mosaïque ?",
      "Your completed progress is safe. This attempt will restart.": "Votre progression terminée est sauvegardée. Cette tentative sera recommencée.",
      "Stage Map": "Carte des étapes",
      "Stage Complete": "Étape terminée",
      "The hidden animal mosaic is complete.": "La mosaïque animale cachée est terminée.",
      Time: "Temps",
      Mistakes: "Erreurs",
      Hints: "Indices",
      Retry: "Rejouer",
      "Next Stage": "Étape suivante",
      Ready: "Prête",
      Locked: "Verrouillée",
      "Cleared · Replay": "Terminée · Rejouer",
      "Complete the previous stage first.": "Terminez d’abord l’étape précédente.",
    },
    ar: {
      "Animal Mosaic Clues": "ألغاز فسيفساء الحيوانات",
      "Start Game": "ابدأ اللعبة",
      "Deduction mosaic puzzle": "لغز فسيفساء استنتاجي",
      "Read every row and column clue to uncover a hidden animal portrait.": "اقرأ دليل كل صف وعمود للكشف عن صورة حيوان مخفية.",
      "Original WeightPlay logic puzzle": "لغز منطقي أصلي من WeightPlay",
      "Every number describes a continuous run.": "يصف كل رقم سلسلة متصلة.",
      "Paint cells that must be filled, cross cells that must stay empty, and use intersecting clues to solve each mosaic without guessing.": "لوّن الخانات التي يجب ملؤها، وضع علامة على الخانات التي يجب أن تبقى فارغة، واستخدم الأدلة المتقاطعة لحل كل فسيفساء من دون تخمين.",
      "How to play": "طريقة اللعب",
      "Thirty mosaics": "ثلاثون فسيفساء",
      "Six chapters grow from guided 5×5 signs to deduction-rich 12×12 portraits.": "تمتد الفصول الستة من ألغاز 5×5 الموجّهة إلى صور 12×12 الغنية بالاستنتاجات.",
      "Choose a Mosaic": "اختر فسيفساء",
      "Drag the rail. The centred glowing card is selected.": "اسحب الشريط. البطاقة المضيئة في الوسط هي المحددة.",
      "Mosaic selector": "محدد الفسيفساء",
      Back: "رجوع",
      "Back to WeightPlay": "العودة إلى WeightPlay",
      "Woodland Signs": "إشارات الغابة",
      "River Tracks": "آثار النهر",
      "Moon Garden": "حديقة القمر",
      "Coral Archive": "أرشيف المرجان",
      "Sky Atlas": "أطلس السماء",
      "Grand Menagerie": "حديقة الحيوانات الكبرى",
      Marks: "العلامات",
      Errors: "الأخطاء",
      Filled: "الممتلئة",
      "Nonogram mosaic board": "لوحة فسيفساء الأرقام",
      "Use the clues to reveal every filled cell.": "استخدم الأدلة لكشف كل خانة يجب ملؤها.",
      "A clue such as 3 1 means a run of three filled cells, at least one empty cell, then one filled cell.": "دليل مثل 3 1 يعني سلسلة من ثلاث خانات ممتلئة، تليها خانة فارغة واحدة على الأقل، ثم خانة ممتلئة.",
      Continue: "متابعة",
      "Leave this mosaic?": "مغادرة هذه الفسيفساء؟",
      "Your completed progress is safe. This attempt will restart.": "تقدمك المحفوظ آمن. ستُعاد هذه المحاولة من البداية.",
      "Stage Map": "خريطة المراحل",
      "Stage Complete": "اكتملت المرحلة",
      "The hidden animal mosaic is complete.": "اكتملت فسيفساء الحيوان المخفية.",
      Time: "الوقت",
      Mistakes: "الأخطاء",
      Hints: "التلميحات",
      Retry: "إعادة المحاولة",
      Replay: "إعادة اللعب",
      "Next Stage": "المرحلة التالية",
      Ready: "جاهزة",
      Locked: "مقفلة",
      "Cleared · Replay": "مكتملة · إعادة اللعب",
      "Complete the previous stage first.": "أكمل المرحلة السابقة أولًا.",
      Paint: "تلوين",
      "Mark ×": "علامة ×",
      Undo: "تراجع",
      Hint: "تلميح",
      Restart: "إعادة البدء",
      "That cell conflicts with the clues.": "هذه الخانة تتعارض مع الأدلة.",
      "Hint: one certain cell was painted.": "تلميح: تم تلوين خانة مؤكدة.",
      "Every filled cell is already visible.": "كل الخانات الممتلئة ظاهرة بالفعل.",
      "Nothing to undo.": "لا يوجد شيء للتراجع عنه.",
    },
  };
  const chapters = {
    "zh-Hans": ["林间踪迹", "河流足迹", "月光花园", "珊瑚档案", "天空图谱", "动物大观园"],
    "zh-Hant": ["森林信號", "河流足跡", "月光花園", "珊瑚檔案", "天空圖譜", "動物大觀園"],
    ja: ["森のしるし", "川の足跡", "月の庭", "サンゴの記録", "空の地図", "大動物園"],
    ko: ["숲의 흔적", "강의 발자국", "달빛 정원", "산호 기록", "하늘 지도", "동물 대전"],
    es: ["Señales del bosque", "Huellas del río", "Jardín lunar", "Archivo coral", "Atlas del cielo", "Gran colección"],
    "pt-BR": ["Sinais da floresta", "Trilhas do rio", "Jardim lunar", "Arquivo de coral", "Atlas do céu", "Grande zoológico"],
    fr: ["Signes de la forêt", "Traces de rivière", "Jardin lunaire", "Archives de corail", "Atlas céleste", "Grande ménagerie"],
    de: ["Waldzeichen", "Flussspuren", "Mondgarten", "Korallenarchiv", "Himmelsatlas", "Große Menagerie"],
    it: ["Segni del bosco", "Tracce del fiume", "Giardino lunare", "Archivio corallino", "Atlante del cielo", "Grande serraglio"],
    ru: ["Лесные знаки", "Следы реки", "Лунный сад", "Коралловый архив", "Небесный атлас", "Большой зверинец"],
    hi: ["वन संकेत", "नदी के निशान", "चंद्र उद्यान", "प्रवाल अभिलेख", "आकाश एटलस", "विशाल पशु संग्रह"],
    ar: ["إشارات الغابة", "آثار النهر", "حديقة القمر", "أرشيف المرجان", "أطلس السماء", "حديقة الحيوانات الكبرى"],
  };
  const configCopies = {
    "zh-Hans": { title: "动物马赛克线索", posterAlt: "猫头鹰揭开狐狸马赛克", pitch: "阅读每一行和每一列的线索，揭开隐藏的动物图像。", guideTitle: "每个数字代表一段连续填色。", guideIntro: "填入确定的格子，标记确定的空格，并利用交叉线索解开马赛克，无需猜测。", growth: "六个章节从引导式 5×5 图案发展到推理丰富的 12×12 动物肖像。", objective: "使用线索揭开所有应填的格子。", help: "例如 3 1 表示连续填满三个格子，至少空一个格子，再填满一个格子。", win: "隐藏的动物马赛克完成了。", fail: "检查交叉线索，再尝试一个推理。", how: ["从外侧向内阅读每行和每列的连续数字。", "用填色标记确定的格子，用 × 标记确定的空格。", "完成所有连续段，揭开隐藏的动物。"], chapters: chapters["zh-Hans"], localeCopy: { stage: "第 {n} 关", locked: "已锁定", cleared: "已完成 · 重玩", ready: "准备就绪", lockedHint: "请先完成上一关。", paint: "填色", mark: "标记 ×", undo: "撤销", hint: "提示", restart: "重新开始", conflict: "该格与线索冲突。", nothingToUndo: "没有可撤销的步骤。", hintApplied: "提示：已填入一个确定的格子。", allVisible: "所有应填格都已显示。", marks: "标记", errors: "错误", canvas: "数织马赛克棋盘", replay: "重玩" } },
    "zh-Hant": { title: "動物馬賽克線索", posterAlt: "貓頭鷹揭開狐狸馬賽克", pitch: "閱讀每一列與每一行的線索，找出藏在格子裡的動物圖像。", guideTitle: "每個數字都代表一段連續的填滿格。", guideIntro: "填上確定的格子、標記確定的留白，並用交叉線索逐步解開馬賽克。", growth: "六個章節從引導式 5×5 圖案逐步發展到需要更多推理的 12×12 動物肖像。", objective: "使用線索揭開所有應填的格子。", help: "例如 3 1 代表連續填滿三格、至少留白一格，再填滿一格。", win: "隱藏的動物馬賽克完成了。", fail: "請檢查交叉線索，再嘗試另一個推理。", how: ["從外側閱讀每一列與每一行的連續數字。", "對確定的格子使用填色，對確定空白的格子使用標記。", "完成所有連續段，揭開隱藏的動物。"], chapters: chapters["zh-Hant"], localeCopy: { stage: "第 {n} 關", locked: "已鎖定", cleared: "已完成 · 重玩", ready: "準備好了", lockedHint: "請先完成上一關。", paint: "填色", mark: "標記 ×", undo: "復原", hint: "提示", restart: "重新開始", conflict: "該格與線索衝突。", nothingToUndo: "沒有可復原的步驟。", hintApplied: "提示：已填上一個可確定的格子。", allVisible: "所有應填格都已顯示。", marks: "標記", errors: "錯誤", canvas: "數織馬賽克棋盤", replay: "重玩" } },
    ja: { title: "どうぶつモザイク手掛かり", posterAlt: "フクロウがキツネのモザイクを見せる", pitch: "行と列の手掛かりを読み、隠れた動物の絵を完成させます。", guideTitle: "数字は連続する塗りつぶしの長さを示します。", guideIntro: "確定したマスを塗り、空白に印を付け、交差する手掛かりから推理します。", growth: "6章30枚。案内付き5×5から推理の多い12×12の動物画へ進みます。", objective: "手掛かりで塗るべきマスをすべて見つけます。", help: "3 1 の手掛かりは、3マスを塗り、1マス以上空け、1マスを塗るという意味です。", win: "隠れた動物モザイクが完成しました。", fail: "交差する手掛かりを見直して、別の推理を試しましょう。", how: ["外側から内側へ、各行と列の数字を読みます。", "確定したマスは塗り、確定した空白は × で印を付けます。", "すべての連続部分を完成させます。"], chapters: chapters.ja, localeCopy: { stage: "ステージ {n}", locked: "ロック中", cleared: "クリア済み・もう一度", ready: "準備完了", lockedHint: "先に前のステージをクリアしてください。", paint: "塗る", mark: "印 ×", undo: "元に戻す", hint: "ヒント", restart: "やり直す", conflict: "このマスは手掛かりと矛盾します。", nothingToUndo: "元に戻せる手順がありません。", hintApplied: "ヒント：確定できるマスを1つ塗りました。", allVisible: "塗るべきマスはすべて表示済みです。", marks: "印", errors: "ミス", canvas: "ノノグラムモザイク盤面", replay: "もう一度" } },
    ko: { title: "동물 모자이크 단서", posterAlt: "부엉이가 여우 모자이크를 보여 줌", pitch: "행과 열의 단서를 읽고 숨은 동물 그림을 완성하세요.", guideTitle: "각 숫자는 이어진 칸의 길이를 뜻합니다.", guideIntro: "채울 칸은 칠하고 빈칸은 표시하며 교차 단서로 추리합니다.", growth: "6개 장, 30개 모자이크가 안내형 5×5에서 추리 중심 12×12 그림으로 이어집니다.", objective: "단서로 채워야 할 모든 칸을 드러내세요.", help: "3 1 단서는 세 칸을 채우고 한 칸 이상 비운 뒤 한 칸을 채운다는 뜻입니다.", win: "숨은 동물 모자이크가 완성되었습니다.", fail: "교차 단서를 다시 확인하고 다른 추리를 시도하세요.", how: ["바깥쪽에서 안쪽으로 각 행과 열의 숫자를 읽으세요.", "확실한 칸은 칠하고 확실한 빈칸은 ×로 표시하세요.", "모든 연속 구간을 완성하세요."], chapters: chapters.ko, localeCopy: { stage: "{n}단계", locked: "잠김", cleared: "완료 · 다시 보기", ready: "준비됨", lockedHint: "먼저 이전 단계를 완료하세요.", paint: "칠하기", mark: "표시 ×", undo: "실행 취소", hint: "힌트", restart: "다시 시작", conflict: "이 칸은 단서와 맞지 않습니다.", nothingToUndo: "취소할 단계가 없습니다.", hintApplied: "힌트: 확실한 칸 하나를 칠했습니다.", allVisible: "채울 칸이 모두 표시되었습니다.", marks: "표시", errors: "실수", canvas: "노노그램 모자이크 보드", replay: "다시 보기" } },
    es: { title: "Pistas de mosaicos animales", posterAlt: "Un búho revela un mosaico de zorro", pitch: "Lee las pistas de cada fila y columna para descubrir un retrato animal oculto.", guideTitle: "Cada número indica una serie continua.", guideIntro: "Rellena las casillas confirmadas, marca las vacías y cruza las pistas sin adivinar.", growth: "Seis capítulos pasan de dibujos guiados 5×5 a retratos 12×12 llenos de deducciones.", objective: "Usa las pistas para revelar cada casilla que debe estar rellena.", help: "Una pista 3 1 significa tres casillas rellenas, al menos una vacía y después una rellena.", win: "El mosaico animal oculto está completo.", fail: "Revisa las pistas cruzadas y prueba otra deducción.", how: ["Lee los números de cada fila y columna desde el borde hacia dentro.", "Usa Pintar para las casillas confirmadas y × para las vacías.", "Completa todas las series para revelar el animal."], chapters: chapters.es, localeCopy: { stage: "Fase {n}", locked: "Bloqueada", cleared: "Completada · Repetir", ready: "Lista", lockedHint: "Completa primero la fase anterior.", paint: "Pintar", mark: "Marcar ×", undo: "Deshacer", hint: "Pista", restart: "Reiniciar", conflict: "Esta casilla contradice las pistas.", nothingToUndo: "No hay nada que deshacer.", hintApplied: "Pista: se pintó una casilla segura.", allVisible: "Todas las casillas rellenas ya están visibles.", marks: "Marcas", errors: "Errores", canvas: "Tablero de mosaico nonogram", replay: "Repetir" } },
    "pt-BR": { title: "Pistas de Mosaicos Animais", posterAlt: "Uma coruja revela um mosaico de raposa", pitch: "Leia as pistas de cada linha e coluna para revelar um retrato animal escondido.", guideTitle: "Cada número indica uma sequência contínua.", guideIntro: "Pinte as casas confirmadas, marque as vazias e use as pistas cruzadas sem chutar.", growth: "Seis capítulos vão de padrões guiados 5×5 a retratos 12×12 cheios de dedução.", objective: "Use as pistas para revelar cada casa que deve ser preenchida.", help: "A pista 3 1 significa três casas preenchidas, pelo menos uma vazia e depois uma preenchida.", win: "O mosaico animal escondido está completo.", fail: "Revise as pistas cruzadas e tente outra dedução.", how: ["Leia os números de cada linha e coluna da borda para dentro.", "Use Pintar nas casas confirmadas e × nas casas vazias.", "Complete todas as sequências para revelar o animal."], chapters: chapters["pt-BR"], localeCopy: { stage: "Fase {n}", locked: "Bloqueada", cleared: "Concluída · Jogar novamente", ready: "Pronta", lockedHint: "Conclua a fase anterior primeiro.", paint: "Pintar", mark: "Marcar ×", undo: "Desfazer", hint: "Dica", restart: "Reiniciar", conflict: "Esta casa contradiz as pistas.", nothingToUndo: "Não há nada para desfazer.", hintApplied: "Dica: uma casa certa foi pintada.", allVisible: "Todas as casas preenchidas já estão visíveis.", marks: "Marcas", errors: "Erros", canvas: "Tabuleiro de mosaico nonogram", replay: "Jogar novamente" } },
    fr: { title: "Indices de mosaïques animaliers", posterAlt: "Un hibou révèle une mosaïque de renard", pitch: "Lisez les indices de chaque ligne et colonne pour révéler un portrait animal caché.", guideTitle: "Chaque nombre décrit une suite continue.", guideIntro: "Peignez les cases confirmées, marquez les vides et croisez les indices sans deviner.", growth: "Six chapitres vont de grilles guidées 5×5 à des portraits 12×12 riches en déductions.", objective: "Utilisez les indices pour révéler chaque case à remplir.", help: "Un indice 3 1 signifie trois cases remplies, au moins une vide, puis une case remplie.", win: "La mosaïque animale cachée est terminée.", fail: "Relisez les indices croisés et essayez une autre déduction.", how: ["Lisez les nombres de chaque ligne et colonne du bord vers l’intérieur.", "Utilisez Peindre pour les cases confirmées et × pour les vides.", "Terminez toutes les suites pour révéler l’animal."], chapters: chapters.fr, localeCopy: { stage: "Étape {n}", locked: "Verrouillée", cleared: "Terminée · Rejouer", ready: "Prête", lockedHint: "Terminez d’abord l’étape précédente.", paint: "Peindre", mark: "Marquer ×", undo: "Annuler", hint: "Indice", restart: "Recommencer", conflict: "Cette case contredit les indices.", nothingToUndo: "Rien à annuler.", hintApplied: "Indice : une case certaine a été peinte.", allVisible: "Toutes les cases remplies sont déjà visibles.", marks: "Marques", errors: "Erreurs", canvas: "Plateau de mosaïque nonogramme", replay: "Rejouer" } },
    de: { title: "Tierische Mosaik-Hinweise", posterAlt: "Eine Eule enthüllt ein Fuchsmosaik", pitch: "Lies die Hinweise jeder Zeile und Spalte, um ein verborgenes Tierbild aufzudecken.", guideTitle: "Jede Zahl beschreibt eine zusammenhängende Reihe.", guideIntro: "Fülle sichere Felder, markiere Leerfelder und löse durch Kreuzhinweise ohne Raten.", growth: "Sechs Kapitel führen von geführten 5×5-Mustern zu deduktionsreichen 12×12-Tierbildern.", objective: "Nutze die Hinweise, um jedes zu füllende Feld aufzudecken.", help: "Der Hinweis 3 1 bedeutet drei gefüllte Felder, mindestens ein leeres Feld und danach ein gefülltes Feld.", win: "Das verborgene Tiermosaik ist fertig.", fail: "Prüfe die Kreuzhinweise und versuche eine andere Deduktion.", how: ["Lies die Zahlen jeder Zeile und Spalte vom Rand nach innen.", "Färbe sichere Felder und markiere sichere Leerfelder mit ×.", "Vervollständige alle Reihen, um das Tier aufzudecken."], chapters: chapters.de, localeCopy: { stage: "Stufe {n}", locked: "Gesperrt", cleared: "Abgeschlossen · Wiederholen", ready: "Bereit", lockedHint: "Schließe zuerst die vorige Stufe ab.", paint: "Färben", mark: "Markieren ×", undo: "Rückgängig", hint: "Hinweis", restart: "Neustart", conflict: "Dieses Feld widerspricht den Hinweisen.", nothingToUndo: "Nichts rückgängig zu machen.", hintApplied: "Hinweis: Ein sicheres Feld wurde gefärbt.", allVisible: "Alle gefüllten Felder sind bereits sichtbar.", marks: "Markierungen", errors: "Fehler", canvas: "Nonogramm-Mosaikraster", replay: "Wiederholen" } },
    it: { title: "Indizi dei mosaici animali", posterAlt: "Un gufo rivela un mosaico di volpe", pitch: "Leggi gli indizi di ogni riga e colonna per scoprire un ritratto animale nascosto.", guideTitle: "Ogni numero descrive una sequenza continua.", guideIntro: "Colora le caselle confermate, segna quelle vuote e incrocia gli indizi senza indovinare.", growth: "Sei capitoli portano da schemi guidati 5×5 a ritratti 12×12 ricchi di deduzioni.", objective: "Usa gli indizi per rivelare ogni casella da riempire.", help: "L’indizio 3 1 significa tre caselle piene, almeno una vuota e poi una casella piena.", win: "Il mosaico animale nascosto è completo.", fail: "Rivedi gli indizi incrociati e prova un’altra deduzione.", how: ["Leggi i numeri di ogni riga e colonna dal bordo verso l’interno.", "Usa Colora per le caselle confermate e × per quelle vuote.", "Completa tutte le sequenze per rivelare l’animale."], chapters: chapters.it, localeCopy: { stage: "Livello {n}", locked: "Bloccato", cleared: "Completato · Ripeti", ready: "Pronto", lockedHint: "Completa prima il livello precedente.", paint: "Colora", mark: "Segna ×", undo: "Annulla", hint: "Suggerimento", restart: "Ricomincia", conflict: "Questa casella contraddice gli indizi.", nothingToUndo: "Niente da annullare.", hintApplied: "Suggerimento: è stata colorata una casella certa.", allVisible: "Tutte le caselle piene sono già visibili.", marks: "Segni", errors: "Errori", canvas: "Griglia del mosaico nonogram", replay: "Ripeti" } },
    ru: { title: "Подсказки для мозаик с животными", posterAlt: "Сова открывает мозаику с лисой", pitch: "Читайте подсказки строк и столбцов, чтобы открыть скрытый портрет животного.", guideTitle: "Каждое число обозначает непрерывный ряд.", guideIntro: "Закрашивайте подтверждённые клетки, отмечайте пустые и решайте по пересечениям без угадывания.", growth: "Шесть глав ведут от направляемых схем 5×5 к портретам 12×12, насыщенным дедукцией.", objective: "Используйте подсказки, чтобы открыть все клетки, которые нужно закрасить.", help: "Подсказка 3 1 означает три закрашенные клетки, хотя бы одну пустую, затем ещё одну закрашенную.", win: "Скрытая мозаика с животным готова.", fail: "Проверьте пересекающиеся подсказки и попробуйте другой вывод.", how: ["Читайте числа каждой строки и столбца от края к центру.", "Закрашивайте подтверждённые клетки и отмечайте пустые знаком ×.", "Завершите все ряды, чтобы увидеть животное."], chapters: chapters.ru, localeCopy: { stage: "Этап {n}", locked: "Закрыт", cleared: "Завершён · Повторить", ready: "Готов", lockedHint: "Сначала завершите предыдущий этап.", paint: "Закрасить", mark: "Отметить ×", undo: "Отменить", hint: "Подсказка", restart: "Начать заново", conflict: "Эта клетка противоречит подсказкам.", nothingToUndo: "Нечего отменять.", hintApplied: "Подсказка: закрашена одна однозначная клетка.", allVisible: "Все заполненные клетки уже видны.", marks: "Отметки", errors: "Ошибки", canvas: "Поле мозаики-ноннограммы", replay: "Повторить" } },
    hi: { title: "जानवर मोज़ेक संकेत", posterAlt: "उल्लू लोमड़ी का मोज़ेक दिखाता है", pitch: "छिपे हुए पशु चित्र को खोलने के लिए हर पंक्ति और स्तंभ के संकेत पढ़ें।", guideTitle: "हर संख्या लगातार खानों की एक श्रृंखला बताती है।", guideIntro: "पक्के खानों में रंग भरें, खाली खानों को चिह्नित करें और कटते संकेतों से बिना अनुमान लगाए हल करें।", growth: "छह अध्यायों में मार्गदर्शित 5×5 चित्रों से गहन निष्कर्ष वाले 12×12 पशु चित्रों तक 30 मोज़ेक हैं।", objective: "संकेतों से हर भरे जाने वाले खाने को उजागर करें।", help: "3 1 संकेत का अर्थ है तीन भरे खाने, कम से कम एक खाली खाना, फिर एक भरा खाना।", win: "छिपा हुआ पशु मोज़ेक पूरा हो गया।", fail: "कटते संकेतों को फिर देखें और दूसरा निष्कर्ष आज़माएँ।", how: ["हर पंक्ति और स्तंभ के अंक किनारे से भीतर की ओर पढ़ें।", "पक्के खानों में रंग भरें और पक्के खाली खानों पर × लगाएँ।", "सभी श्रृंखलाएँ पूरी करके पशु प्रकट करें।"], chapters: chapters.hi, localeCopy: { stage: "चरण {n}", locked: "लॉक", cleared: "पूरा · फिर खेलें", ready: "तैयार", lockedHint: "पहले पिछला चरण पूरा करें।", paint: "रंग भरें", mark: "चिह्न ×", undo: "पूर्ववत", hint: "संकेत", restart: "फिर शुरू करें", conflict: "यह खाना संकेतों से मेल नहीं खाता।", nothingToUndo: "पूर्ववत करने के लिए कुछ नहीं है।", hintApplied: "संकेत: एक निश्चित खाने में रंग भरा गया।", allVisible: "सभी भरे हुए खाने पहले ही दिखाई दे रहे हैं।", marks: "चिह्न", errors: "गलतियाँ", canvas: "नॉनोग्राम मोज़ेक ग्रिड", replay: "फिर खेलें" } },
  };
  for (const [locale, copy] of Object.entries(configCopies)) {
    const dictionary = {
      "Animal Mosaic Clues": copy.title, "Start Game": ({"zh-Hans":"开始游戏","zh-Hant":"開始遊戲",ja:"ゲーム開始",ko:"게임 시작",es:"Empezar", "pt-BR":"Começar", fr:"Commencer", de:"Spiel starten", it:"Inizia", ru:"Начать игру", hi:"खेल शुरू करें"})[locale] || "Start Game",
      "Deduction mosaic puzzle": copy.gameplay || "", "Read every row and column clue to uncover a hidden animal portrait.": copy.pitch,
      "Original WeightPlay logic puzzle": copy.guideTitle, "Every number describes a continuous run.": copy.guideTitle,
      "How to play": copy.localeCopy.hint, "Choose a Mosaic": copy.title, "Mosaic selector": copy.title,
      Back: copy.localeCopy.undo, "Back to WeightPlay": copy.title, Marks: copy.localeCopy.marks, Errors: copy.localeCopy.errors,
      Filled: copy.localeCopy.paint, "Nonogram mosaic board": copy.localeCopy.canvas, "Use the clues to reveal every filled cell.": copy.objective,
      "A clue such as 3 1 means a run of three filled cells, at least one empty cell, then one filled cell.": copy.help,
      Continue: copy.localeCopy.ready, "Leave this mosaic?": copy.title, "Your completed progress is safe. This attempt will restart.": copy.fail,
      "Stage Map": copy.localeCopy.stage, "Stage Complete": copy.win, "The hidden animal mosaic is complete.": copy.win,
      Time: "Time", Mistakes: copy.localeCopy.errors, Hints: copy.localeCopy.hint, Retry: copy.localeCopy.replay, "Next Stage": copy.localeCopy.stage,
      Ready: copy.localeCopy.ready, Locked: copy.localeCopy.locked, "Cleared · Replay": copy.localeCopy.cleared, "Complete the previous stage first.": copy.localeCopy.lockedHint,
      Paint: copy.localeCopy.paint, "Mark ×": copy.localeCopy.mark, Undo: copy.localeCopy.undo, Hint: copy.localeCopy.hint, Restart: copy.localeCopy.restart,
      "That cell conflicts with the clues.": copy.localeCopy.conflict, "Hint: one certain cell was painted.": copy.localeCopy.hintApplied,
      "Every filled cell is already visible.": copy.localeCopy.allVisible, "Nothing to undo.": copy.localeCopy.nothingToUndo,
    };
    dictionaries[locale] = { ...(dictionaries[locale] || {}), ...dictionary };
  }
  const locale = () => window.WonderI18n?.actualLocale?.() || document.documentElement.lang || "en";
  const activeLocale = locale();
  const dictionary = dictionaries[activeLocale] || {};

  const showTransition = (target) => {
    document.body.classList.add("locale-transitioning");
    const loading = document.getElementById("loading");
    if (!loading) return;
    loading.hidden = false;
    loading.style.position = "fixed";
    loading.style.inset = "0";
    loading.style.zIndex = "9999";
    const label = loading.querySelector("strong");
    if (label) label.textContent = loadingCopy[target] || loadingCopy.en;
  };
  document.getElementById("localeSelect")?.addEventListener("change", (event) => showTransition(event.currentTarget.value), { capture: true });

  const translate = (value) => {
    if (typeof value !== "string" || !value.trim()) return value;
    const leading = value.match(/^\s*/u)?.[0] || "";
    const trailing = value.match(/\s*$/u)?.[0] || "";
    const core = value.slice(leading.length, value.length - trailing.length || undefined);
    if (dictionary[core]) return `${leading}${dictionary[core]}${trailing}`;
    let next = core;
    for (const [source, translated] of Object.entries(dictionary).sort((a, b) => b[0].length - a[0].length)) {
      next = next.replaceAll(source, translated);
    }
    if (activeLocale === "fr") {
      next = next.replace(/\bStage\s+(\d+)\b/gu, "Étape $1");
      next = next.replace(/(\d+)\s+marks\b/gu, "$1 marques");
      next = next.replace(/(\d+)\s+errors\b/gu, "$1 erreurs");
    }
    if (activeLocale === "ar") {
      next = next.replace(/\bStage\s+(\d+)\b/gu, "المرحلة $1");
      next = next.replace(/(\d+)\s+marks\b/gu, "$1 علامة");
      next = next.replace(/(\d+)\s+errors\b/gu, "$1 خطأ");
    }
    return `${leading}${next}${trailing}`;
  };

  const translateNode = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      if (!["SCRIPT", "STYLE", "NOSCRIPT", "OPTION"].includes(node.parentElement?.tagName || "")) {
        const next = translate(node.data);
        if (next !== node.data) node.data = next;
      }
      return;
    }
    if (!(node instanceof Element)) return;
    for (const name of ["aria-label", "aria-description", "title", "placeholder", "alt"]) {
      if (!node.hasAttribute(name)) continue;
      const value = node.getAttribute(name) || "";
      const next = translate(value);
      if (next !== value) node.setAttribute(name, next);
    }
  };
  const translateTree = (root) => {
    translateNode(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) translateNode(walker.currentNode);
  };

  const config = window.BlockTrilogyConfig;
  const ownedConfig = configCopies[activeLocale];
  if (config && ownedConfig) {
    Object.assign(config, ownedConfig, { chapters: [...ownedConfig.chapters], localeCopy: { ...(config.localeCopy || {}), ...(ownedConfig.localeCopy || {}) } });
  } else if (config && chapters[activeLocale]) {
    config.title = translate(config.title);
    config.posterAlt = translate(config.posterAlt);
    for (const key of ["pitch", "guideTitle", "guideIntro", "growth", "objective", "help", "win", "fail"]) config[key] = translate(config[key]);
    config.how = Array.isArray(config.how) ? config.how.map(translate) : config.how;
    config.chapters = [...chapters[activeLocale]];
  }

  const loading = document.querySelector("#loading strong");
  if (loading) loading.textContent = loadingCopy[activeLocale] || loadingCopy.en;
  document.body.dataset.mosaicLocaleOwnership = "ready";
  if (!Object.keys(dictionary).length) return;
  translateTree(document.body);
  new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === "characterData") translateNode(record.target);
      else for (const node of record.addedNodes) translateTree(node);
    }
  }).observe(document.body, { childList: true, subtree: true, characterData: true });
})();
