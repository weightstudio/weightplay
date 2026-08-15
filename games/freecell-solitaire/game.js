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
  view?.nodes.hintBtn?.addEventListener("click", focusHintSource);
})();
