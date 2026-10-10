(function () {
  "use strict";
  const additions = {
    en: {
      tag1: "Color-territory logic", tag2: "Cat-placement puzzle", tag3: "No-touch grid deduction",
      faq3Q: "What does Hint show?", faq3A: "Hint highlights a cell that can hold the next correct cat; it does not fill the board.",
      faq4Q: "What happens if a move breaks a rule?", faq4A: "A placement that conflicts with a row, column, patterned territory, or no-touch rule is rejected. Undo restores your previous move.",
      faq5Q: "How do I complete a map?", faq5A: "Place every cat so each row, column, and patterned territory has one, with no cats touching—even diagonally. Solving a map unlocks the next one."
    },
    "zh-Hant": {
      tag1: "彩域推理", tag2: "貓咪配置益智", tag3: "不相鄰棋盤推理",
      faq3Q: "提示會做什麼？", faq3A: "提示會標出可以放置下一隻正確貓咪的格子，不會直接填完棋盤。",
      faq4Q: "違反規則的步驟會怎樣？", faq4A: "若放置位置違反列、欄、圖紋區域或不相鄰規則，遊戲會拒絕這一步；復原可回到上一步。",
      faq5Q: "怎樣才算解開地圖？", faq5A: "放好所有貓咪，讓每列、每欄與每個圖紋區域各有一隻，而且彼此不能碰到，連對角線也不行。解開後會開放下一張地圖。"
    },
    "zh-Hans": {
      tag1: "彩域推理", tag2: "猫咪摆放益智", tag3: "不相邻棋盘推理",
      faq3Q: "提示会显示什么？", faq3A: "提示会标出可以放置下一只正确猫咪的格子，不会直接填完整个棋盘。",
      faq4Q: "违反规则的操作会怎样？", faq4A: "如果放置位置违反行、列、图纹区域或不相邻规则，这一步会被拒绝；撤销可以恢复上一步。",
      faq5Q: "怎样才算解开地图？", faq5A: "放好所有猫咪，让每行、每列和每个图纹区域各有一只，而且猫咪不能接触，包括斜向。解开后会开放下一张地图。"
    },
    ja: {
      tag1: "色分け領域の推理", tag2: "ねこの配置パズル", tag3: "非接触のマス推理",
      faq3Q: "ヒントには何が表示されますか？", faq3A: "次に正しく置けるねこのマスを光らせます。盤面を自動で完成させる機能ではありません。",
      faq4Q: "ルールに反する手を選ぶとどうなりますか？", faq4A: "行・列・模様領域・非接触のルールに反する配置は受け付けられません。「元に戻す」で直前の手を戻せます。",
      faq5Q: "マップのクリア条件は？", faq5A: "各行・列・模様領域にねこを1匹ずつ置き、斜めを含めて互いに触れないようにします。クリアすると次のマップが開きます。"
    },
    ko: {
      tag1: "색 영역 논리", tag2: "고양이 배치 퍼즐", tag3: "비접촉 격자 추리",
      faq3Q: "힌트는 무엇을 보여 주나요?", faq3A: "다음 고양이를 올바르게 놓을 수 있는 칸을 강조합니다. 보드를 자동으로 완성하지는 않습니다.",
      faq4Q: "규칙에 어긋나는 수를 두면 어떻게 되나요?", faq4A: "행, 열, 무늬 영역 또는 비접촉 규칙을 어기는 배치는 거부됩니다. 실행 취소로 직전 수를 되돌릴 수 있습니다.",
      faq5Q: "지도는 어떻게 해결하나요?", faq5A: "모든 행·열·무늬 영역에 고양이를 한 마리씩 두고 대각선을 포함해 서로 닿지 않게 하세요. 해결하면 다음 지도가 열립니다."
    },
    es: {
      tag1: "Lógica de regiones de color", tag2: "Puzzle de colocación de gatos", tag3: "Deducción sin contacto",
      faq3Q: "¿Qué muestra Pista?", faq3A: "Resalta una casilla donde puede colocarse el siguiente gato correcto; no completa el tablero.",
      faq4Q: "¿Qué pasa si una jugada rompe una regla?", faq4A: "Se rechaza una colocación que choque con una fila, columna, región con patrón o regla de no contacto. Deshacer restaura la jugada anterior.",
      faq5Q: "¿Cómo se resuelve un mapa?", faq5A: "Coloca todos los gatos para que cada fila, columna y región con patrón tenga uno, sin que se toquen ni en diagonal. Al resolverlo se desbloquea el siguiente mapa."
    },
    "pt-BR": {
      tag1: "Lógica de territórios coloridos", tag2: "Quebra-cabeça de gatos", tag3: "Dedução sem contato",
      faq3Q: "O que a Dica mostra?", faq3A: "Ela destaca uma casa que pode receber o próximo gato correto; não completa o tabuleiro.",
      faq4Q: "O que acontece se uma jogada viola uma regra?", faq4A: "Uma colocação que conflita com linha, coluna, território com padrão ou regra de não contato é recusada. Desfazer restaura a jogada anterior.",
      faq5Q: "Como resolvo um mapa?", faq5A: "Coloque todos os gatos para que cada linha, coluna e território com padrão tenha um, sem que se toquem, nem na diagonal. Ao resolver, você libera o próximo mapa."
    },
    fr: {
      tag1: "Logique des territoires colorés", tag2: "Puzzle de placement de chats", tag3: "Déduction sans contact",
      faq3Q: "Que montre l’indice ?", faq3A: "Il met en évidence une case pouvant accueillir le prochain chat correct ; il ne résout pas toute la grille.",
      faq4Q: "Que se passe-t-il si un coup enfreint une règle ?", faq4A: "Un placement contraire à une ligne, une colonne, un territoire à motif ou à la règle de non-contact est refusé. Annuler restaure le coup précédent.",
      faq5Q: "Comment terminer une carte ?", faq5A: "Placez tous les chats afin que chaque ligne, colonne et territoire à motif en contienne un, sans qu’ils se touchent, même en diagonale. La carte suivante se débloque ensuite."
    },
    de: {
      tag1: "Logik der Farbgebiete", tag2: "Katzen-Setzrätsel", tag3: "Berührungsfreie Gitterlogik",
      faq3Q: "Was zeigt der Hinweis?", faq3A: "Er markiert ein Feld, auf dem die nächste richtige Katze stehen kann; das Brett wird nicht automatisch gelöst.",
      faq4Q: "Was passiert bei einem regelwidrigen Zug?", faq4A: "Ein Zug, der gegen Zeile, Spalte, Mustergebiet oder das Berührungsverbot verstößt, wird abgelehnt. Mit Rückgängig stellst du den vorherigen Zug wieder her.",
      faq5Q: "Wie löse ich eine Karte?", faq5A: "Setze alle Katzen so, dass jede Zeile, Spalte und jedes Mustergebiet genau eine enthält und sich keine Katzen berühren, auch nicht diagonal. Danach wird die nächste Karte freigeschaltet."
    },
    it: {
      tag1: "Logica dei territori colorati", tag2: "Puzzle di posizionamento felino", tag3: "Deduzione senza contatto",
      faq3Q: "Cosa mostra il Suggerimento?", faq3A: "Evidenzia una casella che può ospitare il prossimo gatto corretto; non completa la griglia.",
      faq4Q: "Cosa succede se una mossa viola una regola?", faq4A: "Il gioco rifiuta una posizione in conflitto con una riga, una colonna, un territorio a motivo o la regola di non contatto. Usa Annulla per ripristinare la mossa precedente.",
      faq5Q: "Come si completa una mappa?", faq5A: "Posiziona tutti i gatti in modo che ogni riga, colonna e territorio a motivo ne contenga uno e che non si tocchino, nemmeno in diagonale. Poi si sblocca la mappa successiva."
    },
    ru: {
      tag1: "Логика цветных областей", tag2: "Головоломка с расстановкой котов", tag3: "Расстановка без соседства",
      faq3Q: "Что показывает подсказка?", faq3A: "Она выделяет клетку, куда можно правильно поставить следующего кота; головоломку она не решает за вас.",
      faq4Q: "Что будет при ходе, нарушающем правило?", faq4A: "Игра отклонит размещение, которое нарушает правило строки, столбца, узорной области или несоприкосновения. Отмена вернёт предыдущий ход.",
      faq5Q: "Как пройти карту?", faq5A: "Расставьте всех котов так, чтобы в каждой строке, колонке и узорной области был один кот, а коты не соприкасались даже по диагонали. После решения откроется следующая карта."
    },
    hi: {
      tag1: "रंगीन क्षेत्र की तर्क-पहेली", tag2: "बिल्ली रखने की पहेली", tag3: "बिना सटे ग्रिड का तर्क",
      faq3Q: "संकेत क्या दिखाता है?", faq3A: "यह उस खाने को चमकाता है जहाँ अगली सही बिल्ली रखी जा सकती है; यह पूरा बोर्ड अपने-आप हल नहीं करता।",
      faq4Q: "नियम तोड़ने वाली चाल पर क्या होता है?", faq4A: "पंक्ति, स्तंभ, पैटर्न वाले क्षेत्र या न छूने के नियम से टकराने वाली जगह अस्वीकार होती है। पूर्ववत करने से पिछली चाल लौटती है।",
      faq5Q: "नक्शा कैसे पूरा होता है?", faq5A: "सभी बिल्लियाँ इस तरह रखें कि हर पंक्ति, स्तंभ और पैटर्न क्षेत्र में एक हो, और वे तिरछे भी न छुएँ। नक्शा हल करने पर अगला नक्शा खुलता है।"
    },
    ar: {
      tag1: "منطق الأقاليم الملونة", tag2: "لغز وضع القطط", tag3: "استنتاج شبكة بلا تجاور",
      faq3Q: "ماذا يعرض التلميح؟", faq3A: "يضيء خلية يمكن أن تستقبل القطة الصحيحة التالية؛ ولا يحل اللوحة تلقائياً.",
      faq4Q: "ماذا يحدث إذا خالفت الحركة قاعدة؟", faq4A: "تُرفض الخلية التي تخالف الصف أو العمود أو الإقليم المزخرف أو قاعدة عدم التلامس. يعيد التراجع الحركة السابقة.",
      faq5Q: "كيف أحل الخريطة؟", faq5A: "ضع القطط بحيث تحتوي كل صفوف وأعمدة وأقاليم مزخرفة على قطة واحدة، من دون تلامس حتى قطرياً. يفتح حل الخريطة الخريطة التالية."
    }
  };
  Object.entries(additions).forEach(([locale, copy]) => Object.assign(window.CAT_COLOR_SUDOKU_LOCALES[locale], copy));
})();
