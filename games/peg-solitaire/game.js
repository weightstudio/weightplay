(() => {
  "use strict";

  const app = window.WPClassicLogic?.mount("peg-solitaire");

  const mainReadyCopy = {
    en: "One fixed board is ready—start the puzzle.",
    "zh-Hant": "固定棋盤已準備好——開始這道謎題吧。",
    "zh-Hans": "固定棋盘已准备好——开始这道谜题吧。",
    ja: "固定盤面を用意しました。パズルを始めましょう。",
    ko: "고정된 보드가 준비됐어요. 퍼즐을 시작하세요.",
    es: "Hay un tablero fijo listo: empieza el rompecabezas.",
    "pt-BR": "Um tabuleiro fixo está pronto — comece o quebra-cabeça.",
    fr: "Un plateau fixe vous attend : commencez le puzzle.",
    de: "Ein festes Brett ist bereit — starte das Rätsel.",
    it: "Una tavola fissa è pronta: inizia il puzzle.",
    ru: "Фиксированное поле готово — начните головоломку.",
    hi: "एक तय बोर्ड तैयार है—पहेली शुरू करें।",
    ar: "لوحة ثابتة جاهزة — ابدأ اللغز.",
  };
  const mainGuideCopy = {
    en: "Play the one fixed board. Use Hint for one safe next idea, Undo to reverse a choice, or New Puzzle to reset the board.",
    "zh-Hant": "遊玩這個固定棋盤。用提示取得一個安全的下一步，用復原撤回選擇，或用新謎題重設棋盤。",
    "zh-Hans": "游玩这个固定棋盘。用提示获取一个安全的下一步，用撤销撤回选择，或用新谜题重置棋盘。",
    ja: "固定盤面を遊びましょう。ヒントで安全な次の一手を確認し、元に戻すで選択を戻し、新しいパズルで盤面をリセットできます。",
    ko: "고정된 보드를 플레이하세요. 힌트로 안전한 다음 수를 확인하고, 실행 취소로 선택을 되돌리거나 새 퍼즐로 보드를 초기화할 수 있어요.",
    es: "Juega en el único tablero fijo. Usa Pista para ver una siguiente jugada segura, Deshacer para revertir una elección o Nuevo puzle para reiniciar el tablero.",
    "pt-BR": "Jogue no único tabuleiro fixo. Use Dica para ver uma próxima jogada segura, Desfazer para reverter uma escolha ou Novo quebra-cabeça para reiniciar o tabuleiro.",
    fr: "Jouez sur l’unique plateau fixe. Utilisez Indice pour voir une prochaine action sûre, Annuler pour revenir sur un choix ou Nouveau puzzle pour réinitialiser le plateau.",
    de: "Spiele auf dem einzigen festen Brett. Nutze Tipp für eine sichere nächste Idee, Rückgängig zum Zurücknehmen einer Wahl oder Neues Rätsel zum Zurücksetzen des Bretts.",
    it: "Gioca sull’unica tavola fissa. Usa Suggerimento per una prossima mossa sicura, Annulla per ripristinare una scelta o Nuovo puzzle per azzerare la tavola.",
    ru: "Играйте на единственном фиксированном поле. Используйте подсказку для безопасного следующего хода, отмену для возврата выбора или новую головоломку для сброса поля.",
    hi: "एकमात्र तय बोर्ड खेलें। सुरक्षित अगली चाल के लिए संकेत, चुनाव पलटने के लिए वापस लें, या बोर्ड रीसेट करने के लिए नई पहेली इस्तेमाल करें।",
    ar: "العب على اللوحة الثابتة الوحيدة. استخدم التلميح لمعرفة فكرة آمنة تالية، أو التراجع لعكس اختيار، أو لغز جديد لإعادة ضبط اللوحة.",
  };
  if (app) {
    const locale = document.documentElement.lang || "en";
    const mainReady = app.root.querySelector(".logic-guide h3");
    if (mainReady) mainReady.textContent = mainReadyCopy[locale] || mainReadyCopy.en;
    const mainGuide = app.root.querySelector(".logic-guide h3 + p");
    if (mainGuide) mainGuide.textContent = mainGuideCopy[locale] || mainGuideCopy.en;
  }

  const lessonCopy = {
    en: {
      success: "One peg left after {moves} moves—you reached the goal. Replay and look for a route that keeps an exit open.",
      failure: "{pegs} pegs remain; the goal is one. Replay and protect an open landing hole before your next jump.",
    },
    "zh-Hant": {
      success: "剩下 1 顆棋子，走了 {moves} 步——你達成目標了。再玩一次，試著保留一條出口路線。",
      failure: "還剩 {pegs} 顆棋子；目標是留下 1 顆。再玩一次，下一步先保留可落子的空洞。",
    },
    "zh-Hans": {
      success: "剩下 1 颗棋子，走了 {moves} 步——你达成目标了。再玩一次，试着保留一条出口路线。",
      failure: "还剩 {pegs} 颗棋子；目标是留下 1 颗。再玩一次，下一步先保留可落子的空洞。",
    },
    ja: {
      success: "{moves}手でペグが1個残り、目標を達成しました。もう一度遊び、出口を残す道を探しましょう。",
      failure: "ペグが{pegs}個残りました。目標は1個です。もう一度遊び、次のジャンプ先を残しましょう。",
    },
    ko: {
      success: "{moves}번 만에 말 1개가 남아 목표를 달성했어요. 다시 하며 출구를 남기는 경로를 찾아 보세요.",
      failure: "말이 {pegs}개 남았어요. 목표는 1개예요. 다시 하며 다음 착지 칸을 열어 두세요.",
    },
    es: {
      success: "Queda una ficha tras {moves} movimientos: has alcanzado el objetivo. Repite y busca una ruta que deje una salida abierta.",
      failure: "Quedan {pegs} fichas; el objetivo es una. Repite y conserva un hueco de llegada antes del próximo salto.",
    },
    "pt-BR": {
      success: "Restou 1 pino após {moves} movimentos — você alcançou o objetivo. Jogue de novo e procure uma rota que mantenha uma saída aberta.",
      failure: "Restaram {pegs} pinos; o objetivo é 1. Jogue de novo e preserve uma casa de chegada antes do próximo salto.",
    },
    fr: {
      success: "Il reste un pion après {moves} coups : objectif atteint. Rejouez et cherchez une route qui garde une sortie ouverte.",
      failure: "Il reste {pegs} pions ; l’objectif est d’en garder un. Rejouez et préservez une case d’arrivée avant le prochain saut.",
    },
    de: {
      success: "Nach {moves} Zügen ist ein Stein übrig — Ziel erreicht. Spiele erneut und halte einen Ausweg offen.",
      failure: "Es sind noch {pegs} Steine übrig; das Ziel ist einer. Spiele erneut und halte vor dem nächsten Sprung ein Zielfeld frei.",
    },
    it: {
      success: "È rimasto un piolo dopo {moves} mosse: hai raggiunto l’obiettivo. Rigioca e cerca un percorso che lasci un’uscita aperta.",
      failure: "Sono rimasti {pegs} pioli; l’obiettivo è uno. Rigioca e lascia libera una casella di arrivo prima del prossimo salto.",
    },
    ru: {
      success: "После {moves} ходов осталась одна фишка — цель достигнута. Сыграйте ещё раз и оставьте открытый путь.",
      failure: "Осталось фишек: {pegs}; цель — одна. Сыграйте ещё раз и оставьте свободную клетку для следующего прыжка.",
    },
    hi: {
      success: "{moves} चालों के बाद 1 गोटी बची—लक्ष्य पूरा हुआ। फिर खेलें और एक खुला रास्ता बचाने की कोशिश करें।",
      failure: "{pegs} गोटियाँ बची हैं; लक्ष्य 1 है। फिर खेलें और अगली छलांग के लिए उतरने की जगह खुली रखें।",
    },
    ar: {
      success: "تبقى حجر واحد بعد {moves} حركات — لقد حققت الهدف. أعد اللعب وابحث عن مسار يترك مخرجًا مفتوحًا.",
      failure: "تبقى {pegs} أحجار؛ الهدف حجر واحد. أعد اللعب واترك حفرة هبوط مفتوحة قبل القفزة التالية.",
    },
  };
  const invalidTargetCopy = {
    en: "That landing hole is not a legal jump. Keep the source selected and choose an empty hole two spaces away over one peg.",
    "zh-Hant": "這個落點不是合法跳法。保留目前棋子，再選擇隔著一顆棋子的兩格外空洞。",
    "zh-Hans": "这个落点不是合法跳法。保留当前棋子，再选择隔着一颗棋子的两格外空洞。",
    ja: "その着地点は合法なジャンプではありません。駒を選んだまま、1個の駒を越えた2マス先の空き穴を選びましょう。",
    ko: "그 착지 칸은 올바른 점프가 아니에요. 말을 선택한 채로 말 하나를 넘어 두 칸 떨어진 빈칸을 고르세요.",
    es: "Ese hueco no permite un salto legal. Mantén seleccionada la ficha y elige un hueco vacío a dos casillas, pasando sobre una ficha.",
    "pt-BR": "Essa casa de chegada não permite um salto válido. Mantenha a peça selecionada e escolha uma casa vazia duas casas adiante, passando sobre uma peça.",
    fr: "Cette case d’arrivée ne permet pas un saut légal. Gardez le pion sélectionné et choisissez un trou vide deux cases plus loin, par-dessus un pion.",
    de: "Dieses Zielfeld erlaubt keinen gültigen Sprung. Lass den Stein ausgewählt und wähle ein leeres Loch zwei Felder weiter über einen Stein.",
    it: "Questa casella d’arrivo non consente un salto valido. Lascia selezionata la pedina e scegli un foro vuoto a due caselle di distanza, oltre una pedina.",
    ru: "Эта клетка не подходит для правильного прыжка. Оставьте фишку выбранной и выберите свободную лунку через одну фишку, через две клетки.",
    hi: "यह उतरने का खाना सही छलांग नहीं बनाता। गोटी चुनी रहने दें और एक गोटी के ऊपर से दो खाने दूर खाली खाना चुनें।",
    ar: "حفرة الهبوط هذه لا تسمح بقفزة قانونية. أبقِ الحجر محددًا واختر حفرة فارغة على بُعد خانتين فوق حجر واحد.",
  };
  const legalTargetLabelCopy = {
    en: "legal landing option",
    "zh-Hant": "合法落點",
    "zh-Hans": "合法落点",
    ja: "合法な着地点",
    ko: "합법적인 착지 칸",
    es: "destino legal",
    "pt-BR": "destino válido",
    fr: "case d’arrivée légale",
    de: "gültiges Zielfeld",
    it: "destinazione valida",
    ru: "подходящее поле",
    hi: "सही उतरने की जगह",
    ar: "خيار هبوط قانوني",
  };
  const hintRouteCopy = {
    en: (source, target) => `Hint: Peg ${source} → Empty hole ${target}.`,
    "zh-Hant": (source, target) => `提示：棋子 ${source} → 空洞 ${target}。`,
    "zh-Hans": (source, target) => `提示：棋子 ${source} → 空洞 ${target}。`,
    ja: (source, target) => `ヒント：ペグ${source} → 空き穴${target}。`,
    ko: (source, target) => `힌트: 페그 ${source} → 빈 칸 ${target}.`,
    es: (source, target) => `Pista: ficha ${source} → hueco vacío ${target}.`,
    "pt-BR": (source, target) => `Dica: pino ${source} → casa vazia ${target}.`,
    fr: (source, target) => `Indice : pion ${source} → trou vide ${target}.`,
    de: (source, target) => `Tipp: Stein ${source} → leeres Loch ${target}.`,
    it: (source, target) => `Suggerimento: piolo ${source} → foro vuoto ${target}.`,
    ru: (source, target) => `Подсказка: фишка ${source} → пустая лунка ${target}.`,
    hi: (source, target) => `संकेत: गोटी ${source} → खाली खाना ${target}।`,
    ar: (source, target) => `تلميح: الحجر ${source} إلى الحفرة الفارغة ${target}.`,
  };
  const locale = document.documentElement.lang || "en";
  const copy = lessonCopy[locale] || lessonCopy.en;
  const invalidTargetMessage = invalidTargetCopy[locale] || invalidTargetCopy.en;
  const legalTargetLabel = legalTargetLabelCopy[locale] || legalTargetLabelCopy.en;
  const hintRouteMessage = hintRouteCopy[locale] || hintRouteCopy.en;
  const status = document.querySelector("#logicStatus");
  const clearInvalidTargetCue = () => {
    if (!status) return;
    status.removeAttribute("data-peg-invalid-target");
    status.classList.remove("is-peg-invalid");
  };
  const showInvalidTargetCue = () => {
    if (!status) return;
    status.textContent = invalidTargetMessage;
    status.dataset.pegInvalidTarget = "true";
    status.classList.add("is-peg-invalid");
  };
  const clearLegalTargetCues = () => {
    document.querySelectorAll(".logic-peg-board .logic-cell.is-legal-target").forEach((cell) => {
      cell.classList.remove("is-legal-target");
      cell.removeAttribute("data-peg-legal-target");
      const baseLabel = cell.dataset.pegBaseAriaLabel;
      if (baseLabel) cell.setAttribute("aria-label", baseLabel);
      delete cell.dataset.pegBaseAriaLabel;
    });
  };
  const showLegalTargetCues = () => {
    clearLegalTargetCues();
    const board = document.querySelector(".logic-peg-board");
    const source = board?.querySelector(".logic-cell.peg.is-selected");
    if (!board || !source) return;
    const cells = [...board.querySelectorAll(".logic-cell")];
    const sourceIndex = cells.indexOf(source);
    if (sourceIndex < 0) return;
    const row = Math.floor(sourceIndex / 7);
    const column = sourceIndex % 7;
    const getCell = (nextRow, nextColumn) => {
      if (nextRow < 0 || nextRow >= 7 || nextColumn < 0 || nextColumn >= 7) return null;
      return cells[nextRow * 7 + nextColumn] || null;
    };
    for (const [rowStep, columnStep] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const middle = getCell(row + rowStep, column + columnStep);
      const target = getCell(row + rowStep * 2, column + columnStep * 2);
      if (!middle?.classList.contains("peg") || !target?.classList.contains("empty")) continue;
      target.classList.add("is-legal-target");
      target.dataset.pegLegalTarget = "true";
      target.dataset.pegBaseAriaLabel = target.getAttribute("aria-label") || "";
      target.setAttribute("aria-label", `${target.dataset.pegBaseAriaLabel} — ${legalTargetLabel}`);
    }
  };
  const clearHintRouteCue = () => {
    if (!status) return;
    status.removeAttribute("data-peg-hint-route");
  };
  const showHintRouteCue = () => {
    if (!status) return;
    const cells = [...document.querySelectorAll(".logic-peg-board .logic-cell.is-hint")];
    const source = cells.find((cell) => cell.classList.contains("peg"));
    const target = cells.find((cell) => cell.classList.contains("empty"));
    if (!source || !target) return;
    const allCells = [...document.querySelectorAll(".logic-peg-board .logic-cell")];
    status.textContent = hintRouteMessage(allCells.indexOf(source) + 1, allCells.indexOf(target) + 1);
    status.dataset.pegHintRoute = "true";
  };
  document.addEventListener("click", (event) => {
    if (event.target?.closest?.("#logicHint")) {
      requestAnimationFrame(showHintRouteCue);
      return;
    }
    if (event.target?.closest?.(".logic-peg-board .logic-cell, #logicUndo, #logicReset, #battleBack, #resultReplay, #resultMenu, #resultClose")) {
      clearHintRouteCue();
      requestAnimationFrame(showLegalTargetCues);
    }
  }, true);
  document.addEventListener("click", (event) => {
    const target = event.target?.closest?.(".logic-peg-board .logic-cell");
    if (!target || target.classList.contains("void")) return;
    const hadSelectedSource = Boolean(document.querySelector(".logic-peg-board .logic-cell.is-selected"));
    const wasEmptyTarget = target.classList.contains("empty");
    const beforePegs = document.querySelectorAll(".logic-peg-board .logic-cell.peg").length;
    clearInvalidTargetCue();
    if (!hadSelectedSource || !wasEmptyTarget) {
      requestAnimationFrame(showLegalTargetCues);
      return;
    }
    requestAnimationFrame(() => {
      const afterPegs = document.querySelectorAll(".logic-peg-board .logic-cell.peg").length;
      const sourceStillSelected = Boolean(document.querySelector(".logic-peg-board .logic-cell.is-selected"));
      const resultVisible = document.querySelector("#logicResult:not([hidden])");
      showLegalTargetCues();
      if (!resultVisible && sourceStillSelected && afterPegs === beforePegs) showInvalidTargetCue();
    });
  }, true);
  document.addEventListener("click", (event) => {
    if (event.target?.closest?.("#logicHint, #logicUndo, #logicReset, #battleBack, #resultReplay, #resultMenu, #resultClose")) {
      clearInvalidTargetCue();
      clearLegalTargetCues();
    }
  }, true);
  const result = document.querySelector("#logicResult");
  const resultText = document.querySelector("#logicResultText");
  if (!result || !resultText) return;

  const fill = (template, values) => Object.entries(values).reduce(
    (value, [key, replacement]) => value.replace(`{${key}}`, String(replacement)),
    template,
  );
  const renderLesson = () => {
    if (result.hidden) {
      resultText.removeAttribute("data-peg-result-base");
      resultText.removeAttribute("data-peg-result-lesson");
      return;
    }
    const pegs = document.querySelectorAll(".logic-peg-board .logic-cell.peg").length;
    const base = resultText.dataset.pegResultBase || resultText.textContent || "";
    const success = pegs === 1;
    const numbers = base.match(/\d+/g) || [];
    const lesson = fill(success ? copy.success : copy.failure, {
      pegs,
      moves: numbers[numbers.length - 1] || 0,
    });
    if (resultText.dataset.pegResultLesson === lesson && resultText.textContent === `${base} · ${lesson}`) return;
    resultText.dataset.pegResultBase = base;
    resultText.dataset.pegResultLesson = lesson;
    resultText.textContent = `${base} · ${lesson}`;
  };

  new MutationObserver(renderLesson).observe(result, {
    attributes: true,
    attributeFilter: ["hidden"],
    childList: true,
    characterData: true,
    subtree: true,
  });
})();
