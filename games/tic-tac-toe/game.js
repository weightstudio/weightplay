window.WPPopularArcade?.mount("tic-tac-toe");

(() => {
  "use strict";

  document.body.dataset.gameVersion = "v39";
  document.body.dataset.wpGameVersion = "v39";
  document.body.dataset.wpInterfaceVersion = "9";

  const labels = {
    en: { lobby: "Back to WeightPlay", battle: "Back to main", settings: "Settings" },
    "zh-Hant": { lobby: "返回 WeightPlay", battle: "返回主頁", settings: "設定" },
    "zh-Hans": { lobby: "返回 WeightPlay", battle: "返回主页", settings: "设置" },
    ja: { lobby: "WeightPlayへ戻る", battle: "メインへ戻る", settings: "設定" },
    ko: { lobby: "WeightPlay로 돌아가기", battle: "메인으로", settings: "설정" },
    es: { lobby: "Volver a WeightPlay", battle: "Volver al inicio", settings: "Configuración" },
    "pt-BR": { lobby: "Voltar ao WeightPlay", battle: "Voltar ao início", settings: "Configurações" },
    fr: { lobby: "Retour à WeightPlay", battle: "Retour à l’accueil", settings: "Paramètres" },
    de: { lobby: "Zurück zu WeightPlay", battle: "Zur Startseite", settings: "Einstellungen" },
    it: { lobby: "Torna a WeightPlay", battle: "Torna alla home", settings: "Impostazioni" },
    ru: { lobby: "Вернуться в WeightPlay", battle: "На главную", settings: "Настройки" },
    hi: { lobby: "WeightPlay पर वापस जाएँ", battle: "मुख्य पृष्ठ", settings: "सेटिंग्स" },
    ar: { lobby: "العودة إلى WeightPlay", battle: "العودة إلى الرئيسية", settings: "الإعدادات" },
  };

  const shell = document.querySelector("#popularArcade");
  const header = document.querySelector(".arcade-header");
  const mainScreen = document.querySelector("#mainScreen");

  const guideToggleLabels = {
    en: "Read the full guide",
    "zh-Hant": "閱讀完整指南",
    "zh-Hans": "阅读完整指南",
    ja: "詳しいガイドを読む",
    ko: "전체 가이드 보기",
    es: "Leer la guía completa",
    "pt-BR": "Ler o guia completo",
    fr: "Lire le guide complet",
    de: "Vollständige Anleitung lesen",
    it: "Leggi la guida completa",
    ru: "Открыть полное руководство",
    hi: "पूरी गाइड पढ़ें",
    ar: "اقرأ الدليل الكامل",
  };

  const mainGoalLabels = {
    en: "Place X, read O's reply, and make three in a row.",
    "zh-Hant": "放下 X，讀懂 O 的回應，連成三格。",
    "zh-Hans": "放下 X，读懂 O 的回应，连成三格。",
    ja: "Xを置き、Oの応手を読み、先に3つ並べましょう。",
    ko: "X를 놓고 O의 응수를 읽어 세 칸을 먼저 이으세요.",
    es: "Coloca X, lee la respuesta de O y alinea tres.",
    "pt-BR": "Coloque X, leia a resposta de O e alinhe três.",
    fr: "Placez X, lisez la réponse de O et alignez trois symboles.",
    de: "Setze X, lies Os Antwort und bringe drei in eine Reihe.",
    it: "Posiziona X, leggi la risposta di O e allineane tre.",
    ru: "Ставьте X, читайте ответ O и выстройте три в ряд.",
    hi: "X रखें, O की चाल पढ़ें और तीन को एक पंक्ति में जोड़ें।",
    ar: "ضع X، اقرأ رد O واجمع ثلاث علامات في صف واحد.",
  };

  const hintFeedback = {
    en: { live: "Try the highlighted empty square. No mark was placed.", suggested: "suggested move" },
    "zh-Hant": { live: "試試看亮起的空格；這次提示沒有放下棋子。", suggested: "建議落子" },
    "zh-Hans": { live: "试试亮起的空格；这次提示没有放下棋子。", suggested: "建议落子" },
    ja: { live: "光っている空きマスを試してください。マークは置いていません。", suggested: "おすすめの手" },
    ko: { live: "강조된 빈 칸에 놓아 보세요. 이번 힌트로 표시는 놓이지 않았습니다.", suggested: "추천 수" },
    es: { live: "Prueba la casilla vacía resaltada. No se colocó ninguna marca.", suggested: "jugada sugerida" },
    "pt-BR": { live: "Tente a casa vazia destacada. Nenhuma marca foi colocada.", suggested: "jogada sugerida" },
    fr: { live: "Essayez la case vide mise en évidence. Aucun symbole n’a été placé.", suggested: "coup suggéré" },
    de: { live: "Probiere das hervorgehobene freie Feld aus. Es wurde kein Zeichen gesetzt.", suggested: "empfohlener Zug" },
    it: { live: "Prova la casella vuota evidenziata. Non è stato posizionato alcun simbolo.", suggested: "mossa suggerita" },
    ru: { live: "Попробуйте выделенную пустую клетку. Знак не был поставлен.", suggested: "рекомендуемый ход" },
    hi: { live: "उभरे हुए खाली खाने में चाल चलें। संकेत से कोई निशान नहीं लगाया गया।", suggested: "सुझाई गई चाल" },
    ar: { live: "جرّب المربع الفارغ المميز. لم توضع أي علامة.", suggested: "الحركة المقترحة" },
  };

  const board = document.querySelector("#board");
  const gameMessage = document.querySelector("#gameMessage");
  const winningLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  const hintPriority = [4, 0, 2, 6, 8, 1, 3, 5, 7];
  let hintTarget = null;

  const clearHint = () => {
    hintTarget = null;
    board?.querySelectorAll(".tic-cell[data-hint-target='true']").forEach((cell) => {
      cell.classList.remove("hint-target");
      delete cell.dataset.hintTarget;
      if (cell.dataset.hintBaseLabel !== undefined) {
        if (cell.dataset.hintBaseLabel) cell.setAttribute("aria-label", cell.dataset.hintBaseLabel);
        delete cell.dataset.hintBaseLabel;
      }
    });
  };

  const applyHint = () => {
    if (document.body.dataset.screen !== "battle" || hintTarget === null) return false;
    const cell = board?.querySelector(`.tic-cell[data-value="${hintTarget}"]`);
    if (!cell || cell.disabled || cell.textContent.trim()) {
      clearHint();
      return false;
    }
    if (cell.dataset.hintTarget !== "true") {
      const locale = document.documentElement.lang || "en";
      const copy = hintFeedback[locale] || hintFeedback.en;
      const label = cell.getAttribute("aria-label") || "";
      cell.dataset.hintBaseLabel = label;
      cell.setAttribute("aria-label", `${label}, ${copy.suggested}`);
      cell.dataset.hintTarget = "true";
      cell.classList.add("hint-target");
    }
    return true;
  };

  const chooseHintTarget = () => {
    const cells = [...(board?.querySelectorAll(".tic-cell") || [])];
    const marks = cells.map((cell) => cell.textContent.trim());
    if (marks.length !== 9) return null;
    const tacticalCell = (mark) => {
      for (const line of winningLines) {
        const occupied = line.filter((index) => marks[index] === mark).length;
        const empty = line.filter((index) => marks[index] === "");
        if (occupied === 2 && empty.length === 1) return empty[0];
      }
      return null;
    };
    const legal = (index) => marks[index] === "" && !cells[index]?.disabled;
    const winning = tacticalCell("X");
    if (winning !== null && legal(winning)) return winning;
    const blocking = tacticalCell("O");
    if (blocking !== null && legal(blocking)) return blocking;
    return hintPriority.find(legal) ?? null;
  };

  const showHint = (event) => {
    const node = event.target?.closest?.("#hintBtn, [data-action='hint']");
    if (!node || document.body.dataset.screen !== "battle") return;
    const target = chooseHintTarget();
    clearHint();
    if (target === null) return;
    hintTarget = target;
    applyHint();
    const locale = document.documentElement.lang || "en";
    gameMessage.textContent = (hintFeedback[locale] || hintFeedback.en).live;
    gameMessage.dataset.tone = "warn";
    gameMessage.dataset.messageKey = "ticHintTarget";
  };

  board?.addEventListener("click", (event) => {
    if (event.target?.closest?.(".tic-cell[data-action='cell']")) clearHint();
  }, true);
  document.addEventListener("click", showHint);
  document.addEventListener("click", (event) => {
    if (event.target?.closest?.("#restartBtn, #retryBtn, #homeBtn, .tic-battle-return, .tic-main-return")) clearHint();
  }, true);
  const hintBoardObserver = new MutationObserver(applyHint);
  if (board) hintBoardObserver.observe(board, { childList: true });
  const hintScreenObserver = new MutationObserver(() => {
    if (document.body.dataset.screen !== "battle") clearHint();
  });
  hintScreenObserver.observe(document.body, { attributes: true, attributeFilter: ["data-screen"] });

  const compactGuide = (section) => {
    if (!section) return;
    const mainActive = document.body.dataset.screen === "main";
    section.hidden = !mainActive; section.inert = !mainActive;
    section.setAttribute("aria-hidden", String(!mainActive));
    const relatedState = section.querySelector('.game-info-related-section a[href], .guide-related a[href]') ? "cards" : "empty";
    if (section.dataset.wpGuideRelatedState !== relatedState) section.dataset.wpGuideRelatedState = relatedState;
    if (section.dataset.wpGuideRelatedInterface !== "9") section.dataset.wpGuideRelatedInterface = "9";
    if (!mainActive) return;
    if (section.dataset.ticTacToeGuideCompact === "true") return;
    section.dataset.ticTacToeGuideCompact = "true";
    section.classList.add("tic-tac-toe-guide-compact");
    const details = document.createElement("details");
    details.className = "tic-tac-toe-guide-details";
    const summary = document.createElement("summary");
    const language = document.documentElement.lang || "en";
    summary.textContent = guideToggleLabels[language] || guideToggleLabels.en;
    details.append(summary);
    while (section.firstChild) details.append(section.firstChild);
    section.append(details);
  };

  window.WeightPlayTicGuide = Object.freeze({refresh: () => document.querySelectorAll(".game-page-info").forEach(compactGuide)});
  const guideObserver = new MutationObserver(() => {
    document.querySelectorAll(".game-page-info").forEach(compactGuide);
  });
  guideObserver.observe(document.body, { childList: true });
  document.querySelectorAll(".game-page-info").forEach(compactGuide);
  if (header && mainScreen && !mainScreen.contains(header)) mainScreen.prepend(header);
  const battleTop = document.querySelector("#battleScreen .battle-top");
  const boardWrap = document.querySelector("#battleScreen .board-wrap");
  boardWrap?.setAttribute("role", "region");
  boardWrap?.setAttribute("tabindex", "0");
  boardWrap?.setAttribute("aria-labelledby", "gameTitle");
  const mainReturn = document.createElement("a");
  mainReturn.className = "tic-main-return";
  mainReturn.href = "/";
  mainReturn.dataset.wpReturn = "main";
  mainReturn.innerHTML = '<span aria-hidden="true">←</span><img src="../../assets/weightplay-logo.png" alt="" width="32" height="32">';
  header?.prepend(mainReturn);

  const battleReturn = document.createElement("button");
  battleReturn.className = "tic-battle-return";
  battleReturn.type = "button";
  battleReturn.dataset.wpReturn = "battle";
  battleReturn.textContent = "←";
  battleTop?.prepend(battleReturn);
  battleReturn.addEventListener("click", () => window.WeightPlayTicFrame?.back());

  const applyLabels = () => {
    const locale = document.documentElement.lang || "en";
    const copy = labels[locale] || labels.en;
    mainReturn.setAttribute("aria-label", copy.lobby);
    battleReturn.setAttribute("aria-label", copy.battle);
    const mainSummary = document.querySelector("#gameTagline");
    if (mainSummary) mainSummary.textContent = mainGoalLabels[locale] || mainGoalLabels.en;
  };
  applyLabels();
  document.querySelector("#localeSelect")?.addEventListener("change", applyLabels);

  const style = document.createElement("style");
  style.dataset.ticTacToeV19 = "true";
  style.textContent = `
    .tic-tac-toe-guide-compact {
      width: min(1040px, calc(100% - 24px));
      margin: 12px auto calc(24px + env(safe-area-inset-bottom));
      padding: 12px;
      border: 1px solid rgba(184, 211, 244, .32);
      border-radius: 14px;
      background: rgba(248, 250, 252, .96);
      box-shadow: 0 8px 20px rgba(8, 17, 31, .12);
    }
    .tic-tac-toe-guide-details {
      border: 0;
      border-radius: 0;
      background: transparent;
      color: var(--wp-ui-text);
      box-shadow: none;
    }
    .tic-tac-toe-guide-details > summary {
      min-height: 48px;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      cursor: pointer;
      font-weight: 800;
      list-style-position: inside;
    }
    .tic-tac-toe-guide-details > summary::after {
      content: "＋";
      font-size: 1.2rem;
      line-height: 1;
    }
    .tic-tac-toe-guide-details[open] > summary::after { content: "−"; }
    .tic-tac-toe-guide-details > :not(summary) {
      margin-inline: 0;
    }
    .tic-tac-toe-guide-details .game-info-hero,
    .tic-tac-toe-guide-details .game-info-sections {
      margin-inline: 12px;
    }
    @media (max-width: 720px) {
      .tic-tac-toe-guide-compact {
        width: min(100% - 16px, 1040px);
        margin-top: 8px;
        padding: 12px;
      }
      .tic-tac-toe-guide-details > summary { padding: 10px 12px; }
    }
  `;
  document.head.append(style);
})();
