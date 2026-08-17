(function () {
  "use strict";
  const SEQUENCE_CUE = {
    en: "Sequence opened: {count} cards moved together.",
    "zh-Hant": "順序打開了：{count} 張牌一起移動。",
    "zh-Hans": "顺序展开了：{count} 张牌一起移动。",
    ja: "連続が開きました：{count}枚のカードをまとめて移動。",
    ko: "연속 카드가 열렸습니다: {count}장을 함께 이동했어요.",
    es: "Secuencia abierta: {count} cartas movidas juntas.",
    "pt-BR": "Sequência aberta: {count} cartas movidas juntas.",
    fr: "Suite ouverte : {count} cartes déplacées ensemble.",
    de: "Folge geöffnet: {count} Karten gemeinsam bewegt.",
    it: "Sequenza aperta: {count} carte mosse insieme.",
    ru: "Цепочка открыта: {count} карт перемещено вместе.",
    hi: "क्रम खुला: {count} कार्ड साथ ले जाए गए।",
    ar: "تم فتح التسلسل: نُقلت {count} بطاقات معًا.",
  };
  const FREECELL_HINT_CUE = {
    en: "Hint: the highlighted card is selected; tap a numbered destination.",
    "zh-Hant": "提示：反白牌已選取；請點編號目的地。",
    "zh-Hans": "提示：高亮牌已选取；请点击编号目的地。",
    ja: "ヒント：ハイライトされたカードが選択されています。番号付きの移動先をタップします。",
    ko: "힌트: 강조된 카드가 선택되었습니다. 번호가 표시된 목적지를 누르세요.",
    es: "Pista: la carta resaltada ya está seleccionada; toca un destino numerado.",
    "pt-BR": "Dica: a carta destacada já está selecionada; toque em um destino numerado.",
    fr: "Indice : la carte en surbrillance est sélectionnée ; touchez une destination numérotée.",
    de: "Tipp: Die hervorgehobene Karte ist ausgewählt; wähle ein nummeriertes Ziel.",
    it: "Suggerimento: la carta evidenziata è selezionata; tocca una destinazione numerata.",
    ru: "Подсказка: выделенная карта уже выбрана; нажмите пронумерованную цель.",
    hi: "संकेत: हाइलाइट किया गया कार्ड चुना गया है; क्रमांकित लक्ष्य पर टैप करें।",
    ar: "تلميح: البطاقة المميزة محددة؛ اضغط وجهة مرقمة.",
  };
  const FREECELL_HINT_DESTINATION = {
    en: "Hint destination {index}",
    "zh-Hant": "提示目的地 {index}",
    "zh-Hans": "提示目的地 {index}",
    ja: "ヒントの移動先 {index}",
    ko: "힌트 목적지 {index}",
    es: "Destino de la pista {index}",
    "pt-BR": "Destino da dica {index}",
    fr: "Destination de l’indice {index}",
    de: "Tippziel {index}",
    it: "Destinazione del suggerimento {index}",
    ru: "Цель подсказки {index}",
    hi: "संकेत लक्ष्य {index}",
    ar: "وجهة التلميح {index}",
  };
  const view = window.WPClassicSolitaire?.mount({ variant: "freecell", id: "freecell-solitaire", sequenceCue: SEQUENCE_CUE });
  const ANALYTICS_EVENT = "wp-freecell-analytics";
  const INPUT_TYPES = new Set(["mouse", "touch", "pen", "keyboard", "unknown"]);
  const inputTypeFromEvent = (event) => {
    if (event?.type === "keydown") return "keyboard";
    if (event?.pointerType === "touch") return "touch";
    if (event?.pointerType === "pen") return "pen";
    if (event?.pointerType === "mouse") return "mouse";
    return "unknown";
  };
  const emitAnalytics = (event, detail = {}) => {
    try {
      window.dispatchEvent(new CustomEvent(ANALYTICS_EVENT, { detail: { event, ...detail } }));
    } catch {
      // Measurement must never interrupt a player action or alter game state.
    }
  };
  const bounded = (value, max) => {
    const number = Number(value);
    return Number.isFinite(number) ? Math.max(0, Math.min(max, Math.floor(number))) : 0;
  };
  const safeInputType = (value) => INPUT_TYPES.has(value) ? value : "unknown";
  let lastInputType = "unknown";
  const snapshot = () => {
    const game = view?.game;
    if (!game) return null;
    const foundationCards = game.foundations.reduce((total, foundation) => total + foundation.cards.length, 0);
    const tableauCards = game.tableau.reduce((total, pile) => total + pile.length, 0);
    const freeCellCards = game.freeCells.filter(Boolean).length;
    return {
      seed: game.seed,
      moves: game.moves,
      won: Boolean(game.won),
      lost: Boolean(game.lost),
      foundationCards,
      foundationCompleteCount: game.foundations.filter((foundation) => foundation.cards.length >= 13).length,
      tableauCards,
      tableauPileLengths: game.tableau.map((pile) => pile.length),
      freeCellCards,
      remainingCards: bounded(tableauCards + freeCellCards, 52),
    };
  };
  const analyticsDetails = (state, extra = {}) => ({
    from: "unknown",
    outcome: "unknown",
    inputType: safeInputType(lastInputType),
    moveType: "unknown",
    moveCount: bounded(state?.moves, 200),
    cardCount: 0,
    foundationCards: bounded(state?.foundationCards, 52),
    foundationCompleteCount: bounded(state?.foundationCompleteCount, 4),
    tableauCards: bounded(state?.tableauCards, 52),
    freeCellCards: bounded(state?.freeCellCards, 4),
    remainingCards: bounded(state?.remainingCards, 52),
    ...extra,
  });
  const moveType = (move) => {
    const source = move?.source?.zone;
    const destination = move?.destination?.zone;
    if (source === "tableau" && destination === "foundation") return "tableauToFoundation";
    if (source === "free" && destination === "foundation") return "freeCellToFoundation";
    if (source === "tableau" && destination === "tableau") return "tableauToTableau";
    if (source === "tableau" && destination === "free") return "tableauToFreeCell";
    if (source === "free" && destination === "tableau") return "freeCellToTableau";
    return "unknown";
  };
  let previousState = snapshot();
  if (view?.render) {
    const originalRender = view.render.bind(view);
    view.render = (...args) => {
      const before = previousState || snapshot();
      const result = originalRender(...args);
      const after = snapshot();
      if (before && after && before.seed === after.seed && after.moves > before.moves) {
        const move = view.game.lastFreeCellMove;
        const movingCards = move?.source?.zone === "tableau"
          ? Math.max(1, (before.tableauPileLengths?.[move.source.pile] || 0) - Number(move.source.row || 0))
          : move ? 1 : 0;
        emitAnalytics("card_move", analyticsDetails(after, {
          from: "battle",
          outcome: "moved",
          moveType: moveType(move),
          cardCount: bounded(movingCards, 52),
        }));
        if (after.freeCellCards > before.freeCellCards) {
          emitAnalytics("free_cell_occupy", analyticsDetails(after, {
            from: "battle",
            outcome: "occupied",
            cardCount: 1,
          }));
        }
        for (let index = before.foundationCompleteCount; index < after.foundationCompleteCount; index += 1) {
          emitAnalytics("foundation_complete", analyticsDetails(after, {
            from: "battle",
            outcome: "complete",
            cardCount: 13,
          }));
        }
      }
      if (before && after && !before.won && !before.lost && (after.won || after.lost)) {
        emitAnalytics("result", analyticsDetails(after, {
          from: "battle",
          outcome: after.won ? "complete" : "failed",
        }));
      }
      previousState = after;
      return result;
    };
  }
  const trackButton = (id, event, from, outcome) => {
    view?.nodes?.[id]?.addEventListener("click", () => {
      emitAnalytics(event, analyticsDetails(snapshot(), { from, outcome }));
    });
  };
  document.addEventListener("pointerdown", (event) => { lastInputType = inputTypeFromEvent(event); }, true);
  document.addEventListener("keydown", (event) => { lastInputType = inputTypeFromEvent(event); }, true);
  trackButton("startBtn", "game_start", "main", "started");
  trackButton("restartBtn", "restart", "main", "restart");
  trackButton("newGameBtn", "new_game", "main", "new_game");
  trackButton("battleRestartBtn", "restart", "battle", "restart");
  trackButton("battleNewBtn", "new_game", "battle", "new_game");
  trackButton("resultRestart", "restart", "result", "restart");
  trackButton("resultNewGame", "new_game", "result", "new_game");
  view?.nodes?.battleBackBtn?.addEventListener("click", () => {
    emitAnalytics("main_return", analyticsDetails(snapshot(), { from: "battle", outcome: "returned" }));
  });
  view?.nodes?.resultClose?.addEventListener("click", () => {
    emitAnalytics("close", analyticsDetails(snapshot(), { from: "result", outcome: "closed" }));
    emitAnalytics("main_return", analyticsDetails(snapshot(), { from: "result", outcome: "returned" }));
  });
  const focusHintSource = () => {
    window.requestAnimationFrame(() => {
      if (!view?.active || view.nodes.battleScreen?.hidden) return;
      const source = view.nodes.board?.querySelector("button.classic-card.selected");
      if (source && source.isConnected && !source.closest("[hidden]")) source.focus({ preventScroll: true });
    });
  };
  const hintCueState = { active: false, moves: 0, timer: 0 };
  const ensureHintCueStyles = () => {
    if (document.getElementById("freecell-hint-cue-style")) return;
    const style = document.createElement("style");
    style.id = "freecell-hint-cue-style";
    style.textContent = `
      body[data-wp-game-id="freecell-solitaire"] .freecell-hint-target { position: relative; }
      body[data-wp-game-id="freecell-solitaire"] .freecell-hint-badge {
        position: absolute; top: 4px; right: 4px; z-index: 20; display: grid;
        width: 22px; height: 22px; place-items: center; border: 2px solid #071a2d;
        border-radius: 50%; color: #071a2d; background: #ffd166; box-shadow: 0 2px 8px rgba(0,0,0,.35);
        font: 900 12px/1 "Poppins", "Manrope", "Inter", sans-serif; pointer-events: none;
      }
    `;
    document.head.append(style);
  };
  const clearHintCue = () => {
    hintCueState.active = false;
    window.clearTimeout(hintCueState.timer);
    const board = view?.nodes?.board;
    board?.querySelectorAll(".freecell-hint-target").forEach((node) => {
      node.classList.remove("freecell-hint-target");
      node.querySelectorAll(".freecell-hint-badge").forEach((badge) => badge.remove());
      if (node.dataset.freecellHintAria !== undefined) {
        node.setAttribute("aria-label", node.dataset.freecellHintAria);
        delete node.dataset.freecellHintAria;
      }
    });
    const status = view?.nodes?.boardStatus;
    if (status?.dataset.freecellHint === "true") {
      delete status.dataset.freecellHint;
      delete status.dataset.state;
      if (!view.game.won && !view.game.lost) status.textContent = "";
    }
  };
  const renderHintCue = () => {
    if (!hintCueState.active || !view?.active || view.nodes.battleScreen?.hidden) return;
    const board = view.nodes.board;
    const source = view.game?.selected;
    const destinations = [...(board?.querySelectorAll("[data-dest].valid-target") || [])];
    if (!source || !destinations.length) return clearHintCue();
    ensureHintCueStyles();
    destinations.forEach((node, index) => {
      node.classList.add("freecell-hint-target");
      node.querySelectorAll(".freecell-hint-badge").forEach((badge) => badge.remove());
      const badge = document.createElement("span");
      badge.className = "freecell-hint-badge";
      badge.textContent = String(index + 1);
      badge.setAttribute("aria-hidden", "true");
      node.append(badge);
      if (node.dataset.freecellHintAria === undefined) node.dataset.freecellHintAria = node.getAttribute("aria-label") || "";
      const destinationLabel = (FREECELL_HINT_DESTINATION[view.locale] || FREECELL_HINT_DESTINATION.en).replace("{index}", String(index + 1));
      node.setAttribute("aria-label", `${node.dataset.freecellHintAria} · ${destinationLabel}`);
    });
    const status = view.nodes.boardStatus;
    if (status) {
      status.dataset.freecellHint = "true";
      status.dataset.state = "freecell-hint";
      status.textContent = FREECELL_HINT_CUE[view.locale] || FREECELL_HINT_CUE.en;
    }
    window.clearTimeout(hintCueState.timer);
    hintCueState.timer = window.setTimeout(clearHintCue, 2400);
  };
  const refreshHintCueAfterAction = () => {
    window.requestAnimationFrame(() => {
      if (!hintCueState.active) return;
      if (view.game.moves !== hintCueState.moves || !view.game.selected) return clearHintCue();
      renderHintCue();
    });
  };
  view?.nodes.hintBtn?.addEventListener("click", () => {
    focusHintSource();
    window.requestAnimationFrame(() => {
      if (!view?.game?.selected || !view.game.legalMoves().some((move) => JSON.stringify(move.source) === JSON.stringify(view.game.selected))) return clearHintCue();
      hintCueState.active = true;
      hintCueState.moves = view.game.moves;
      renderHintCue();
    });
  });
  view?.nodes.board?.addEventListener("click", refreshHintCueAfterAction);
  view?.nodes.board?.addEventListener("pointerup", refreshHintCueAfterAction);
  ["battleRestartBtn", "battleNewBtn", "resultRestart", "resultNewGame", "resultClose", "battleBackBtn"].forEach((id) => {
    view?.nodes?.[id]?.addEventListener("click", clearHintCue);
  });
  view?.nodes.localeSelect?.addEventListener("change", () => {
    window.requestAnimationFrame(() => { if (hintCueState.active) renderHintCue(); });
  });
})();
