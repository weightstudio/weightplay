window.WPPopularArcade?.mount("chess");

// Chess v11 keeps the target-agency loop while owning the repaired Interface V6
// shell contract, so the shared validator sees the same playable flow.
// The board presents a small, authored agency contract:
// choose a visible white piece, then choose its visible destination.
(function installChessTargetAgency() {
  const ANALYTICS_EVENT = "wp-chess-analytics";
  const INPUT_TYPES = new Set(["mouse", "touch", "pen", "keyboard", "unknown"]);
  const STEPS = [
    { source: 15, target: 14 },
    { source: 10, target: 6 },
    { source: 5, target: 0 },
  ];
  const INITIAL_PIECES = ["♜", "♟", "", "♚", "", "♙", "", "", "", "", "♙", "", "", "", "", "♔"];
  const LOCALE_COPY = {
    en: { round: "Round", score: "Score", moves: "Moves", best: "Best", row: "Row", column: "Column", empty: "empty", target: "target", source: "select this white piece", selected: "selected", piece: "piece", choosePiece: "Choose a white piece.", chooseTarget: "Now choose its visible target.", wrongPiece: "That piece is not the authored move. Choose another white piece.", wrongTarget: "That target is not legal for the selected piece.", targetFirst: "Choose a white piece before choosing a target.", legalMove: "Legal move. Choose the next white piece.", success: "Checkmate sprint cleared!", successCopy: "Three visible chess decisions settled the sprint.", replayTarget: "Next sprint target: clear all 3 moves with at most {n} correction prompts.", hint: "Hint", hintCopy: "Choose the outlined white piece, then its highlighted target.", restart: "Restart", retry: "Play again", home: "Back to main", board: "Chess decision board", step: "Step", pieceNames: { "♜": "black rook", "♟": "black pawn", "♚": "black king", "♙": "white pawn", "♔": "white king" } },
    "zh-Hant": { round: "回合", score: "分數", moves: "步數", best: "最佳", row: "第", column: "欄", empty: "空格", target: "目標", source: "選擇這個白方棋子", selected: "已選取", piece: "棋子", choosePiece: "請選擇一個白方棋子。", chooseTarget: "現在請選擇它可見的目標。", wrongPiece: "這不是目前的著法。請選另一個白方棋子。", wrongTarget: "這個目標不是所選棋子的合法目標。", targetFirst: "請先選擇白方棋子，再選目標。", legalMove: "合法著法。請選擇下一個白方棋子。", success: "將殺衝刺完成！", successCopy: "三個可見的棋局決策已完成本回合。", replayTarget: "下一次衝刺目標：三步完成，最多出現 {n} 次修正提示。", hint: "提示", hintCopy: "請選取有輪廓的白方棋子，再選取標亮的目標。", restart: "重新開始", retry: "再玩一次", home: "回到主頁", board: "西洋棋決策棋盤", step: "步驟", pieceNames: { "♜": "黑車", "♟": "黑兵", "♚": "黑王", "♙": "白兵", "♔": "白王" } },
    "zh-Hans": { round: "回合", score: "分数", moves: "步数", best: "最佳", row: "第", column: "列", empty: "空格", target: "目标", source: "选择这个白方棋子", selected: "已选取", piece: "棋子", choosePiece: "请选择一个白方棋子。", chooseTarget: "现在请选择它可见的目标。", wrongPiece: "这不是当前的着法。请选择另一个白方棋子。", wrongTarget: "这个目标不是所选棋子的合法目标。", targetFirst: "请先选择白方棋子，再选择目标。", legalMove: "合法着法。请选择下一个白方棋子。", success: "将杀冲刺完成！", successCopy: "三个可见的棋局决策已完成本回合。", replayTarget: "下一次冲刺目标：三步完成，最多出现 {n} 次纠正提示。", hint: "提示", hintCopy: "请选择有轮廓的白方棋子，再选择标亮的目标。", restart: "重新开始", retry: "再玩一次", home: "回到主页", board: "国际象棋决策棋盘", step: "步骤", pieceNames: { "♜": "黑车", "♟": "黑兵", "♚": "黑王", "♙": "白兵", "♔": "白王" } },
    ja: { round: "ラウンド", score: "スコア", moves: "手数", best: "ベスト", row: "行", column: "列", empty: "空き", target: "ターゲット", source: "この白駒を選択", selected: "選択中", piece: "駒", choosePiece: "白い駒を選んでください。", chooseTarget: "次に、見えているターゲットを選んでください。", wrongPiece: "その駒は今回の手ではありません。別の白い駒を選んでください。", wrongTarget: "そのターゲットは選択した駒の合法手ではありません。", targetFirst: "先に白い駒を選び、次にターゲットを選んでください。", legalMove: "合法手です。次の白い駒を選んでください。", success: "チェックメイト・スプリント完了！", successCopy: "見える三つのチェス判断でスプリントを決着しました。", replayTarget: "次のスプリント目標：修正ヒントを {n} 回以内にして3手を完了。", hint: "ヒント", hintCopy: "輪郭のある白い駒、次にハイライトされたターゲットを選びます。", restart: "リスタート", retry: "もう一度", home: "メインへ戻る", board: "チェス判断ボード", step: "手", pieceNames: { "♜": "黒ルーク", "♟": "黒ポーン", "♚": "黒キング", "♙": "白ポーン", "♔": "白キング" } },
    ko: { round: "라운드", score: "점수", moves: "수", best: "최고", row: "행", column: "열", empty: "빈 칸", target: "목표", source: "이 백색 기물을 선택", selected: "선택됨", piece: "기물", choosePiece: "백색 기물을 선택하세요.", chooseTarget: "이제 보이는 목표를 선택하세요.", wrongPiece: "그 기물은 현재 수가 아닙니다. 다른 백색 기물을 선택하세요.", wrongTarget: "그 목표는 선택한 기물의 합법적인 목표가 아닙니다.", targetFirst: "먼저 백색 기물을 선택한 다음 목표를 선택하세요.", legalMove: "합법적인 수입니다. 다음 백색 기물을 선택하세요.", success: "체크메이트 스프린트 완료!", successCopy: "보이는 세 번의 체스 결정으로 스프린트를 끝냈습니다.", replayTarget: "다음 스프린트 목표: 수정 안내 없이 3수를 완료하고 수정 안내를 {n}회 이하로 줄이세요.", hint: "힌트", hintCopy: "윤곽선이 있는 백색 기물, 다음으로 강조된 목표를 선택하세요.", restart: "다시 시작", retry: "다시 플레이", home: "메인으로", board: "체스 결정 보드", step: "수", pieceNames: { "♜": "검은 룩", "♟": "검은 폰", "♚": "검은 킹", "♙": "흰 폰", "♔": "흰 킹" } },
    es: { round: "Ronda", score: "Puntuación", moves: "Movimientos", best: "Mejor", row: "Fila", column: "Columna", empty: "vacía", target: "objetivo", source: "elige esta pieza blanca", selected: "seleccionada", piece: "pieza", choosePiece: "Elige una pieza blanca.", chooseTarget: "Ahora elige su objetivo visible.", wrongPiece: "Esa pieza no es la jugada creada. Elige otra pieza blanca.", wrongTarget: "Ese objetivo no es legal para la pieza elegida.", targetFirst: "Elige una pieza blanca antes de elegir un objetivo.", legalMove: "Jugada legal. Elige la siguiente pieza blanca.", success: "¡Sprint de jaque mate superado!", successCopy: "Tres decisiones de ajedrez visibles resolvieron el sprint.", replayTarget: "Objetivo de la próxima partida: completa las 3 jugadas con como máximo {n} avisos de corrección.", hint: "Pista", hintCopy: "Elige la pieza blanca delineada y después su objetivo resaltado.", restart: "Reiniciar", retry: "Jugar otra vez", home: "Volver al inicio", board: "Tablero de decisiones de ajedrez", step: "Paso", pieceNames: { "♜": "torre negra", "♟": "peón negro", "♚": "rey negro", "♙": "peón blanco", "♔": "rey blanco" } },
    "pt-BR": { round: "Rodada", score: "Pontuação", moves: "Jogadas", best: "Recorde", row: "Linha", column: "Coluna", empty: "vazia", target: "alvo", source: "selecione esta peça branca", selected: "selecionada", piece: "peça", choosePiece: "Escolha uma peça branca.", chooseTarget: "Agora escolha o alvo visível dela.", wrongPiece: "Essa peça não faz parte da jogada criada. Escolha outra peça branca.", wrongTarget: "Esse alvo não é legal para a peça escolhida.", targetFirst: "Escolha uma peça branca antes de escolher um alvo.", legalMove: "Jogada legal. Escolha a próxima peça branca.", success: "Sprint de xeque-mate concluído!", successCopy: "Três decisões visíveis de xadrez encerraram o sprint.", replayTarget: "Meta da próxima partida: conclua as 3 jogadas com no máximo {n} avisos de correção.", hint: "Dica", hintCopy: "Escolha a peça branca contornada e depois o alvo destacado.", restart: "Reiniciar", retry: "Jogar novamente", home: "Voltar ao início", board: "Tabuleiro de decisões de xadrez", step: "Etapa", pieceNames: { "♜": "torre preta", "♟": "peão preto", "♚": "rei preto", "♙": "peão branco", "♔": "rei branco" } },
    fr: { round: "Manche", score: "Score", moves: "Coups", best: "Record", row: "Rangée", column: "Colonne", empty: "vide", target: "cible", source: "choisir cette pièce blanche", selected: "sélectionnée", piece: "pièce", choosePiece: "Choisissez une pièce blanche.", chooseTarget: "Choisissez maintenant sa cible visible.", wrongPiece: "Cette pièce ne correspond pas au coup créé. Choisissez une autre pièce blanche.", wrongTarget: "Cette cible n'est pas légale pour la pièce choisie.", targetFirst: "Choisissez une pièce blanche avant une cible.", legalMove: "Coup légal. Choisissez la prochaine pièce blanche.", success: "Sprint de mat terminé !", successCopy: "Trois décisions d'échecs visibles ont conclu le sprint.", replayTarget: "Objectif de la prochaine partie : terminez les 3 coups avec au plus {n} corrections.", hint: "Indice", hintCopy: "Choisissez la pièce blanche entourée, puis la cible en surbrillance.", restart: "Recommencer", retry: "Rejouer", home: "Retour à l'accueil", board: "Échiquier de décision", step: "Étape", pieceNames: { "♜": "tour noire", "♟": "pion noir", "♚": "roi noir", "♙": "pion blanc", "♔": "roi blanc" } },
    de: { round: "Runde", score: "Punktzahl", moves: "Züge", best: "Bestwert", row: "Zeile", column: "Spalte", empty: "leer", target: "Ziel", source: "diese weiße Figur wählen", selected: "ausgewählt", piece: "Figur", choosePiece: "Wähle eine weiße Figur.", chooseTarget: "Wähle jetzt ihr sichtbares Ziel.", wrongPiece: "Diese Figur ist nicht der vorgesehene Zug. Wähle eine andere weiße Figur.", wrongTarget: "Dieses Ziel ist für die gewählte Figur nicht legal.", targetFirst: "Wähle zuerst eine weiße Figur und dann ein Ziel.", legalMove: "Legaler Zug. Wähle die nächste weiße Figur.", success: "Matt-Sprint geschafft!", successCopy: "Drei sichtbare Schachentscheidungen haben den Sprint beendet.", replayTarget: "Ziel für die nächste Runde: Schließe die 3 Züge mit höchstens {n} Korrekturhinweisen ab.", hint: "Tipp", hintCopy: "Wähle die umrandete weiße Figur und dann das markierte Ziel.", restart: "Neustart", retry: "Nochmal spielen", home: "Zurück zum Start", board: "Schach-Entscheidungsbrett", step: "Schritt", pieceNames: { "♜": "schwarzer Turm", "♟": "schwarzer Bauer", "♚": "schwarzer König", "♙": "weißer Bauer", "♔": "weißer König" } },
    it: { round: "Round", score: "Punteggio", moves: "Mosse", best: "Record", row: "Riga", column: "Colonna", empty: "vuota", target: "obiettivo", source: "scegli questo pezzo bianco", selected: "selezionato", piece: "pezzo", choosePiece: "Scegli un pezzo bianco.", chooseTarget: "Ora scegli il suo obiettivo visibile.", wrongPiece: "Quel pezzo non è la mossa prevista. Scegli un altro pezzo bianco.", wrongTarget: "Quell'obiettivo non è legale per il pezzo scelto.", targetFirst: "Scegli un pezzo bianco prima dell'obiettivo.", legalMove: "Mossa legale. Scegli il prossimo pezzo bianco.", success: "Sprint di scacco matto completato!", successCopy: "Tre decisioni visibili di scacchi hanno chiuso lo sprint.", replayTarget: "Obiettivo della prossima partita: completa le 3 mosse con al massimo {n} correzioni.", hint: "Suggerimento", hintCopy: "Scegli il pezzo bianco contornato, poi l'obiettivo evidenziato.", restart: "Ricomincia", retry: "Gioca ancora", home: "Torna al menu", board: "Scacchiera decisionale", step: "Passo", pieceNames: { "♜": "torre nera", "♟": "pedone nero", "♚": "re nero", "♙": "pedone bianco", "♔": "re bianco" } },
    ru: { round: "Раунд", score: "Очки", moves: "Ходы", best: "Рекорд", row: "Ряд", column: "Столбец", empty: "пусто", target: "цель", source: "выберите эту белую фигуру", selected: "выбрано", piece: "фигура", choosePiece: "Выберите белую фигуру.", chooseTarget: "Теперь выберите её видимую цель.", wrongPiece: "Эта фигура не входит в задуманный ход. Выберите другую белую фигуру.", wrongTarget: "Эта цель недопустима для выбранной фигуры.", targetFirst: "Сначала выберите белую фигуру, затем цель.", legalMove: "Ход допустим. Выберите следующую белую фигуру.", success: "Спринт с матом завершён!", successCopy: "Три видимых шахматных решения завершили спринт.", replayTarget: "Цель следующей партии: завершите 3 хода с не более чем {n} исправлениями.", hint: "Подсказка", hintCopy: "Выберите обведённую белую фигуру, затем выделенную цель.", restart: "Начать заново", retry: "Играть снова", home: "На главную", board: "Доска шахматных решений", step: "Шаг", pieceNames: { "♜": "чёрная ладья", "♟": "чёрная пешка", "♚": "чёрный король", "♙": "белая пешка", "♔": "белый король" } },
    hi: { round: "राउंड", score: "स्कोर", moves: "चालें", best: "सर्वश्रेष्ठ", row: "पंक्ति", column: "स्तंभ", empty: "खाली", target: "लक्ष्य", source: "इस सफेद मोहरे को चुनें", selected: "चयनित", piece: "मोहरा", choosePiece: "एक सफेद मोहरा चुनें।", chooseTarget: "अब उसका दिखता हुआ लक्ष्य चुनें।", wrongPiece: "यह मोहरा तय चाल का हिस्सा नहीं है। दूसरा सफेद मोहरा चुनें।", wrongTarget: "यह लक्ष्य चुने हुए मोहरे के लिए वैध नहीं है।", targetFirst: "लक्ष्य चुनने से पहले सफेद मोहरा चुनें।", legalMove: "वैध चाल। अगला सफेद मोहरा चुनें।", success: "चेकमेट स्प्रिंट पूरा!", successCopy: "तीन दिखते हुए शतरंज निर्णयों ने स्प्रिंट पूरा किया।", replayTarget: "अगले स्प्रिंट का लक्ष्य: 3 चालें पूरी करें और अधिकतम {n} सुधार संदेश रखें।", hint: "संकेत", hintCopy: "रेखांकित सफेद मोहरा चुनें, फिर हाइलाइट किया हुआ लक्ष्य चुनें।", restart: "फिर शुरू करें", retry: "फिर खेलें", home: "मुख्य पृष्ठ", board: "शतरंज निर्णय बोर्ड", step: "चरण", pieceNames: { "♜": "काला हाथी", "♟": "काला प्यादा", "♚": "काला राजा", "♙": "सफेद प्यादा", "♔": "सफेद राजा" } },
    ar: { round: "الجولة", score: "النقاط", moves: "النقلات", best: "الأفضل", row: "الصف", column: "العمود", empty: "فارغ", target: "الهدف", source: "اختر هذه القطعة البيضاء", selected: "محددة", piece: "قطعة", choosePiece: "اختر قطعة بيضاء.", chooseTarget: "اختر الآن هدفها الظاهر.", wrongPiece: "هذه القطعة ليست النقلة المحددة. اختر قطعة بيضاء أخرى.", wrongTarget: "هذا الهدف ليس نقلة قانونية للقطعة المحددة.", targetFirst: "اختر قطعة بيضاء قبل اختيار الهدف.", legalMove: "نقلة قانونية. اختر القطعة البيضاء التالية.", success: "اكتملت جولة كش مات!", successCopy: "حسمت ثلاثة قرارات شطرنج ظاهرة الجولة.", replayTarget: "هدف الجولة التالية: أتمم النقلات الثلاث مع بحد أقصى {n} رسائل تصحيح.", hint: "تلميح", hintCopy: "اختر القطعة البيضاء ذات الإطار، ثم الهدف المميز.", restart: "إعادة البدء", retry: "العب مرة أخرى", home: "العودة إلى الرئيسية", board: "لوحة قرارات الشطرنج", step: "الخطوة", pieceNames: { "♜": "رخ أسود", "♟": "بيدق أسود", "♚": "ملك أسود", "♙": "بيدق أبيض", "♔": "ملك أبيض" } },
  };

  const FINISH_BEAT_COPY = {
    en: "Checkmate landed — three clear choices, one calm finish.",
    "zh-Hant": "將軍將死——三次清楚選擇，沉著收官。",
    "zh-Hans": "将杀完成——三次清晰选择，沉着收官。",
    ja: "詰みが決まりました——3つの明確な選択で、落ち着いて決着。",
    ko: "체크메이트 완성 — 세 번의 분명한 선택으로 차분하게 마무리했습니다.",
    es: "¡Jaque mate! Tres decisiones claras y un cierre sereno.",
    "pt-BR": "Xeque-mate! Três decisões claras e um final sereno.",
    fr: "Échec et mat ! Trois choix clairs pour une conclusion maîtrisée.",
    de: "Schachmatt! Drei klare Entscheidungen, ein ruhiger Abschluss.",
    it: "Scacco matto! Tre scelte chiare per una chiusura netta.",
    ru: "Мат завершён — три ясных решения и спокойная развязка.",
    hi: "चेकमेट पूरा — तीन स्पष्ट फैसलों के साथ शांत समापन।",
    ar: "كش مات — ثلاثة قرارات واضحة وختام هادئ."
  };

  const fallback = LOCALE_COPY.en;
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
  const currentLocale = () => document.documentElement.lang || document.querySelector("#localeSelect")?.value || "en";
  const copy = () => LOCALE_COPY[currentLocale()] || fallback;
  const isWhite = (piece) => piece === "♙" || piece === "♔";
  const pieceName = (localeCopy, piece) => piece ? localeCopy.pieceNames[piece] || localeCopy.piece : localeCopy.empty;
  const bounded = (value, allowed) => allowed.has(String(value || "unknown")) ? String(value || "unknown") : "unknown";
  let lastInputType = "unknown";
  let sprint = 0;
  const emitAnalytics = (event, detail = {}) => {
    try {
      window.dispatchEvent(new CustomEvent(ANALYTICS_EVENT, { detail: { event, inputType: bounded(detail.inputType || lastInputType, INPUT_TYPES), ...detail } }));
    } catch {}
  };
  const getEls = () => ({
    main: document.querySelector("#mainScreen"), battle: document.querySelector("#battleScreen"), result: document.querySelector("#resultScreen"), board: document.querySelector("#board"), controls: document.querySelector("#controls"), message: document.querySelector("#gameMessage"), round: document.querySelector("#roundLabel"), resultTitle: document.querySelector("#resultTitle"), resultCopy: document.querySelector("#resultCopy"), resultBeat: document.querySelector("#resultBeat"), resultStats: document.querySelector("#resultStats"), resultTarget: document.querySelector("#resultTarget"), retry: document.querySelector("#retryBtn"), home: document.querySelector("#homeBtn"), hint: document.querySelector("#hintBtn"), restart: document.querySelector("#restartBtn"),
  });
  let state = null;

  const resetState = () => {
    state = { pieces: [...INITIAL_PIECES], step: 0, score: 0, moves: 0, corrections: 0, selected: -1, done: false, success: false, sprint, messageKey: "chessAgencyChoosePiece", tone: "" };
  };
  const applyMessage = (message, tone = "", messageKey = "") => {
    const els = getEls();
    if (!els.message) return;
    els.message.textContent = message;
    els.message.dataset.tone = tone;
    els.message.dataset.messageKey = messageKey;
  };
  const setMessage = (message, tone = "", messageKey = "") => {
    if (state) {
      state.tone = tone;
      state.messageKey = messageKey;
    }
    applyMessage(message, tone, messageKey);
  };
  const localizeMessage = () => {
    const localeCopy = copy();
    const key = state?.messageKey || "chessAgencyChoosePiece";
    const messages = {
      chessAgencyChoosePiece: localeCopy.choosePiece,
      chessAgencyChooseTarget: localeCopy.chooseTarget,
      chessAgencyWrongPiece: localeCopy.wrongPiece,
      chessAgencyWrongTarget: localeCopy.wrongTarget,
      chessAgencyTargetFirst: localeCopy.targetFirst,
      chessAgencyHint: localeCopy.hintCopy,
      chessAgencyLegalMove: `${localeCopy.legalMove} ${localeCopy.step} ${state.step + 1}/3.`,
    };
    applyMessage(messages[key] || localeCopy.choosePiece, state?.tone || "", key);
  };
  const showScreen = (screen) => {
    const els = getEls();
    if (!els.main || !els.battle || !els.result) return;
    els.main.hidden = screen !== "main";
    els.battle.hidden = screen !== "battle";
    els.result.hidden = screen !== "result";
    document.body.dataset.screen = screen;
    document.documentElement.classList.toggle("popular-chess-active", screen !== "main");
    document.body.classList.toggle("wp-mobile-game-mode", screen !== "main");
  };
  const cellLabel = (localeCopy, index, piece, target, selected, candidate) => {
    const row = Math.floor(index / 4) + 1;
    const column = (index % 4) + 1;
    const details = [pieceName(localeCopy, piece), target ? localeCopy.target : "", selected ? localeCopy.selected : "", candidate ? localeCopy.source : ""].filter(Boolean).join(", ");
    return `${localeCopy.row} ${row}, ${localeCopy.column} ${column}, ${details}`;
  };
  const renderBoard = () => {
    if (!state || state.done) return;
    const els = getEls();
    const localeCopy = copy();
    const targetIndex = STEPS[state.step]?.target ?? -1;
    const cells = state.pieces.map((piece, index) => {
      const target = index === targetIndex;
      const candidate = isWhite(piece);
      const selected = state.selected === index;
      const classes = ["chess-cell", target ? "target" : "", candidate ? "agency-source" : "", selected ? "agency-selected" : ""].filter(Boolean).join(" ");
      const label = cellLabel(localeCopy, index, piece, target, selected, candidate);
      return `<button type="button" class="${classes}" data-action="agency-cell" data-cell="${index}" data-piece="${escapeHtml(piece)}"${candidate ? " data-agency-source=\"true\"" : ""}${target ? " data-target=\"true\"" : ""}${selected ? " aria-pressed=\"true\"" : " aria-pressed=\"false\""} aria-label="${escapeHtml(label)}">${escapeHtml(piece)}</button>`;
    }).join("");
    els.board.innerHTML = `<div class="chess-board chess-agency-board" role="group" aria-label="${escapeHtml(localeCopy.board)}" data-agency-step="${state.step + 1}" data-agency-target="${targetIndex}" data-score="${state.score}" data-moves="${state.moves}">${cells}</div>`;
    els.round.textContent = `${localeCopy.round} · ${localeCopy.score}: ${state.score} · ${localeCopy.moves}: ${state.moves} · ${localeCopy.step} ${state.step + 1}/3`;
    els.controls.innerHTML = `<div class="control-row"><span class="round-label" role="status" aria-live="polite" aria-atomic="true">${escapeHtml(state.selected >= 0 ? localeCopy.chooseTarget : localeCopy.choosePiece)}</span></div>`;
  };
  const renderBattle = () => {
    if (!state) resetState();
    if (state.done) return renderResult();
    showScreen("battle");
    renderBoard();
    localizeMessage();
  };
  const renderResult = () => {
    const els = getEls();
    const localeCopy = copy();
    const best = Number(localStorage.getItem("weightplay_popular_chess_best") || 0);
    showScreen("result");
    els.result.dataset.outcome = state.success ? "win" : "loss";
    els.resultTitle.textContent = localeCopy.success;
    els.resultCopy.textContent = localeCopy.successCopy;
    els.resultBeat.textContent = FINISH_BEAT_COPY[currentLocale()] || FINISH_BEAT_COPY.en;
    els.resultStats.innerHTML = `<span class="stat">${escapeHtml(localeCopy.score)}<strong>${state.score}</strong></span><span class="stat">${escapeHtml(localeCopy.moves)}<strong>${state.moves}</strong></span><span class="stat">${escapeHtml(localeCopy.best)}<strong>${Math.max(best, state.score)}</strong></span>`;
    els.resultTarget.textContent = localeCopy.replayTarget.replace("{n}", String(Math.max(0, state.corrections - 1)));
    els.retry.textContent = localeCopy.retry;
    els.home.textContent = localeCopy.home;
  };
  const finish = () => {
    state.done = true;
    state.success = true;
    state.score = Math.max(state.score, state.moves * 10 + 100);
    try {
      const best = Number(localStorage.getItem("weightplay_popular_chess_best") || 0);
      if (state.score > best) localStorage.setItem("weightplay_popular_chess_best", String(state.score));
    } catch {}
    renderResult();
    emitAnalytics("result", { from: "battle", outcome: "cleared", sprint: state.sprint, step: state.step, score: state.score, moves: state.moves, correctionCount: state.corrections });
  };
  const recordCorrection = (reason) => {
    state.corrections += 1;
    emitAnalytics("correction", { from: "battle", outcome: "corrected", sprint: state.sprint, step: state.step + 1, reason, correctionCount: state.corrections });
  };
  const move = (index) => {
    const localeCopy = copy();
    const step = STEPS[state.step];
    if (index === step.target) {
      if (state.selected < 0) {
        recordCorrection("target-first");
        setMessage(localeCopy.targetFirst, "warn", "chessAgencyTargetFirst");
        return;
      }
      if (state.selected !== step.source) {
        recordCorrection("wrong-piece");
        setMessage(localeCopy.wrongPiece, "warn", "chessAgencyWrongPiece");
        return;
      }
      state.pieces[step.target] = state.pieces[step.source];
      state.pieces[step.source] = "";
      state.score += 30;
      state.moves += 1;
      state.step += 1;
      state.selected = -1;
      emitAnalytics("valid_move", { from: "battle", outcome: "advanced", sprint: state.sprint, step: state.step, score: state.score, moves: state.moves, correctionCount: state.corrections });
      if (state.step >= STEPS.length) {
        finish();
        return;
      }
      setMessage(`${localeCopy.legalMove} ${localeCopy.step} ${state.step + 1}/3.`, "good", "chessAgencyLegalMove");
      renderBoard();
      return;
    }
    if (isWhite(state.pieces[index])) {
      state.selected = index;
      setMessage(localeCopy.chooseTarget, "", "chessAgencyChooseTarget");
      renderBoard();
      return;
    }
    recordCorrection(state.selected < 0 ? "target-first" : "wrong-target");
    setMessage(state.selected < 0 ? localeCopy.targetFirst : localeCopy.wrongTarget, "warn", state.selected < 0 ? "chessAgencyTargetFirst" : "chessAgencyWrongTarget");
  };
  const resetAndRender = (from = "battle") => {
    if (from === "main") {
      sprint = 1;
      emitAnalytics("game_start", { from, outcome: "started", sprint });
    } else if (from === "result") {
      sprint = Math.max(2, sprint + 1);
      emitAnalytics("play_again", { from, outcome: "replay", sprint });
    } else {
      emitAnalytics("restart", { from, outcome: "restart", sprint: sprint || 1 });
    }
    resetState();
    setMessage(copy().choosePiece, "", "chessAgencyChoosePiece");
    renderBattle();
  };
  const scheduleShellSync = (fresh = false) => window.setTimeout(() => {
    if (fresh) {
      resetState();
      setMessage(copy().choosePiece, "", "chessAgencyChoosePiece");
    }
    if (document.body.dataset.screen === "battle") renderBattle();
    else if (document.body.dataset.screen === "result" && state?.done) renderResult();
  }, 0);

  const setSettingsOpen = (open) => {
    const menu = document.querySelector("#audioMenuBtn");
    const popover = document.querySelector("#audioPopover");
    if (!popover) return;
    popover.hidden = !open;
    popover.classList.toggle("is-hidden", !open);
    menu?.setAttribute("aria-expanded", String(open));
  };

  const bindShellControls = () => {
    const menu = document.querySelector("#audioMenuBtn");
    const battleUtility = document.querySelector("#battleUtilityBtn");
    const sound = document.querySelector("#soundBtn");
    const localeSelect = document.querySelector("#localeSelect");
    menu?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const popover = document.querySelector("#audioPopover");
      setSettingsOpen(Boolean(popover?.hidden));
    });
    battleUtility?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      setSettingsOpen(true);
    });
    sound?.addEventListener("click", () => {
      const enabled = sound.getAttribute("aria-pressed") !== "true";
      sound.setAttribute("aria-pressed", String(enabled));
      sound.textContent = enabled ? "Sound: On" : "Sound: Off";
    });
    document.addEventListener("click", (event) => {
      const popover = document.querySelector("#audioPopover");
      if (popover?.hidden || event.target?.closest?.(".settings-control") || event.target?.closest?.("#battleUtilityBtn")) return;
      setSettingsOpen(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setSettingsOpen(false);
    });
    localeSelect?.setAttribute("aria-label", "Language");
  };

  resetState();
  document.body.dataset.gameVersion = "v11";
  bindShellControls();
  document.querySelector("#battleBackBtn")?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    emitAnalytics("main_return", { from: "battle", outcome: "returned", sprint: state?.sprint || sprint || 1, correctionCount: state?.corrections || 0 });
    resetState();
    showScreen("main");
  }, { capture: true });
  document.addEventListener("pointerdown", (event) => {
    lastInputType = bounded(event.pointerType, INPUT_TYPES);
  }, { capture: true });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") lastInputType = "keyboard";
  }, { capture: true });
  document.addEventListener("click", (event) => {
    const node = event.target?.closest?.("[data-action], #startBtn, #retryBtn, #homeBtn, #hintBtn, #restartBtn");
    if (!node) return;
    if (node.dataset.action === "agency-cell") {
      event.preventDefault();
      event.stopImmediatePropagation();
      move(Number(node.dataset.cell));
      return;
    }
    if (node.id === "hintBtn" && document.body.dataset.screen === "battle") {
      event.preventDefault();
      event.stopImmediatePropagation();
      const localeCopy = copy();
      setMessage(localeCopy.hintCopy, "warn", "chessAgencyHint");
      emitAnalytics("hint", { from: "battle", outcome: "shown", sprint: state?.sprint || sprint || 1 });
      return;
    }
    if (node.id === "restartBtn" && document.body.dataset.screen === "battle") {
      event.preventDefault();
      event.stopImmediatePropagation();
      resetAndRender("battle");
      return;
    }
    if (node.id === "startBtn" && document.body.dataset.screen === "main") {
      event.preventDefault();
      event.stopImmediatePropagation();
      resetAndRender("main");
      return;
    }
    if (node.id === "retryBtn" && document.body.dataset.screen === "result") {
      event.preventDefault();
      event.stopImmediatePropagation();
      resetAndRender("result");
      return;
    }
    if (node.id === "homeBtn" && document.body.dataset.screen === "result") {
      event.preventDefault();
      event.stopImmediatePropagation();
      emitAnalytics("main_return", { from: "result", outcome: "returned", sprint: state?.sprint || sprint || 1, correctionCount: state?.corrections || 0 });
      resetState();
      showScreen("main");
    }
  }, { capture: true });
  document.addEventListener("change", (event) => {
    if (event.target?.id === "localeSelect") scheduleShellSync();
  }, { capture: true });
})();
