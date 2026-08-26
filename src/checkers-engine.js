(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.WPCheckersEngine = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const SIZE = 8;
  const HUMAN = "human";
  const AI = "ai";

  const rowOf = (index) => Math.floor(index / SIZE);
  const columnOf = (index) => index % SIZE;
  const indexOf = (row, column) => row * SIZE + column;
  const inBounds = (row, column) => row >= 0 && row < SIZE && column >= 0 && column < SIZE;
  const cloneBoard = (board) => board.map((piece) => piece ? { ...piece } : null);

  const createInitialBoard = () => Array.from({ length: SIZE * SIZE }, (_, index) => {
    const row = rowOf(index);
    const column = columnOf(index);
    if ((row + column) % 2 === 0) return null;
    if (row <= 2) return { player: AI, king: false };
    if (row >= 5) return { player: HUMAN, king: false };
    return null;
  });

  const directionsFor = (piece) => {
    if (!piece) return [];
    if (piece.king) return [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    const forward = piece.player === HUMAN ? -1 : 1;
    return [[forward, -1], [forward, 1]];
  };

  const movesForPiece = (board, from, capturesOnly = false) => {
    const piece = board[from];
    if (!piece) return [];
    const fromRow = rowOf(from);
    const fromColumn = columnOf(from);
    const moves = [];
    for (const [rowDelta, columnDelta] of directionsFor(piece)) {
      const nearRow = fromRow + rowDelta;
      const nearColumn = fromColumn + columnDelta;
      if (!inBounds(nearRow, nearColumn)) continue;
      const near = indexOf(nearRow, nearColumn);
      if (!board[near]) {
        if (!capturesOnly) moves.push({ from, to: near, captured: -1 });
        continue;
      }
      if (board[near].player === piece.player) continue;
      const landingRow = fromRow + rowDelta * 2;
      const landingColumn = fromColumn + columnDelta * 2;
      if (!inBounds(landingRow, landingColumn)) continue;
      const landing = indexOf(landingRow, landingColumn);
      if (!board[landing]) moves.push({ from, to: landing, captured: near });
    }
    return moves;
  };

  const getLegalMoves = (board, player, forcedFrom = -1) => {
    const sources = forcedFrom >= 0
      ? [forcedFrom]
      : board.map((piece, index) => piece?.player === player ? index : -1).filter((index) => index >= 0);
    const captures = sources.flatMap((from) => movesForPiece(board, from, true));
    if (captures.length) return captures;
    if (forcedFrom >= 0) return [];
    return sources.flatMap((from) => movesForPiece(board, from, false));
  };

  const applyMove = (board, move) => {
    const next = cloneBoard(board);
    const piece = next[move.from];
    if (!piece) throw new Error("Cannot move an empty square.");
    next[move.from] = null;
    if (move.captured >= 0) next[move.captured] = null;
    const destinationRow = rowOf(move.to);
    const promoted = !piece.king && ((piece.player === HUMAN && destinationRow === 0) || (piece.player === AI && destinationRow === SIZE - 1));
    next[move.to] = { ...piece, king: piece.king || promoted };
    return { board: next, captured: move.captured >= 0, promoted };
  };

  const winner = (board, nextPlayer) => {
    const humanCount = board.filter((piece) => piece?.player === HUMAN).length;
    const aiCount = board.filter((piece) => piece?.player === AI).length;
    if (!aiCount) return HUMAN;
    if (!humanCount) return AI;
    return getLegalMoves(board, nextPlayer).length ? "" : (nextPlayer === HUMAN ? AI : HUMAN);
  };

  const chooseAiMove = (board, forcedFrom = -1) => {
    const moves = getLegalMoves(board, AI, forcedFrom);
    if (!moves.length) return null;
    return [...moves].sort((a, b) => {
      const aRow = rowOf(a.to);
      const bRow = rowOf(b.to);
      const aPromotion = !board[a.from]?.king && aRow === SIZE - 1 ? 1 : 0;
      const bPromotion = !board[b.from]?.king && bRow === SIZE - 1 ? 1 : 0;
      const aCapture = a.captured >= 0 ? 1 : 0;
      const bCapture = b.captured >= 0 ? 1 : 0;
      const aCenter = 4 - Math.abs(3.5 - columnOf(a.to));
      const bCenter = 4 - Math.abs(3.5 - columnOf(b.to));
      return bCapture - aCapture || bPromotion - aPromotion || bCenter - aCenter || a.to - b.to;
    })[0];
  };

  return {
    SIZE,
    HUMAN,
    AI,
    createInitialBoard,
    getLegalMoves,
    applyMove,
    winner,
    chooseAiMove,
    rowOf,
    columnOf,
  };
});
