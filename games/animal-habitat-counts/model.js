/* Pure campaign/save operations. Presentation never decides a puzzle result. */
(function (root) {
  'use strict';
  const int = (value, fallback, max) => Number.isFinite(Number(value)) ? Math.min(max, Math.max(0, Math.floor(Number(value)))) : fallback;
  function normalize(saved, stages) {
    const known = new Set(stages.map(stage => stage.id));
    const completed = [...new Set(Array.isArray(saved?.completed) ? saved.completed.filter(id => known.has(id)) : [])];
    const furthest = completed.reduce((max, id) => Math.max(max, stages.findIndex(stage => stage.id === id) + 1), 0);
    const unlocked = Math.max(1, Math.min(stages.length, Math.max(furthest + 1, int(saved?.unlocked, 1, stages.length))));
    const themes = ['daylight', ...(completed.length >= 5 ? ['twilight'] : []), ...(Array.isArray(saved?.themes) && saved.themes.includes('aurora') ? ['aurora'] : [])];
    const theme = themes.includes(saved?.theme) ? saved.theme : 'daylight';
    const activeStage = stages.find(stage => stage.id === saved?.active?.stageId && stage.number <= unlocked);
    const active = activeStage && Array.isArray(saved.active.board) && saved.active.board.length === activeStage.size ** 2
      ? snapshot(createRun(activeStage, saved.active), activeStage) : null;
    return { completed, unlocked, lens: int(saved?.lens, 0, 2), themes, theme, active };
  }
  function createRun(stage, saved) {
    const length = stage.size ** 2;
    const board = Array.from({ length }, (_, i) => !stage.stones.includes(i) && saved?.board?.[i] === 1 ? 1 : 0);
    const marks = Array.from({ length }, (_, i) => !stage.stones.includes(i) && !board[i] && saved?.marks?.[i] === 1 ? 1 : 0);
    return { board, marks, checks: int(saved?.checks, 0, 999999), revealed: new Set((Array.isArray(saved?.revealed) ? saved.revealed : []).filter(id => stage.zones.some(zone => zone.id === id && zone.hidden))), history: [] };
  }
  const snapshot = (run, stage) => ({ stageId: stage.id, board: [...run.board], marks: [...run.marks], checks: run.checks, revealed: [...run.revealed] });
  function remember(run) {
    run.history.push({ board: [...run.board], marks: [...run.marks] });
    if (run.history.length > 80) run.history.shift();
  }
  function toggle(run, stage, index, mode = 'plant') {
    if (!Number.isInteger(index) || index < 0 || index >= run.board.length || stage.stones.includes(index)) return false;
    remember(run);
    if (mode === 'mark') { run.marks[index] = run.marks[index] ? 0 : 1; run.board[index] = 0; }
    else { run.board[index] = run.board[index] ? 0 : 1; run.marks[index] = 0; }
    return true;
  }
  function clear(run) {
    if (!run.board.some(Boolean) && !run.marks.some(Boolean)) return false;
    remember(run); run.board.fill(0); run.marks.fill(0); return true;
  }
  function undo(run) {
    const prior = run.history.pop();
    if (!prior) return false;
    run.board = prior.board; run.marks = prior.marks; return true;
  }
  function settle(progress, stage, run) {
    const first = !progress.completed.includes(stage.id);
    const before = progress.lens;
    if (first) {
      progress.completed.push(stage.id);
      progress.completed.sort();
      progress.unlocked = Math.max(progress.unlocked, Math.min(30, stage.number + 1));
      if (stage.checkpoint) progress.lens = Math.min(2, progress.lens + stage.lensReward);
    }
    const earnedTheme = progress.completed.length >= 5 && !progress.themes.includes('twilight');
    if (earnedTheme) progress.themes.push('twilight');
    progress.active = null;
    return { first, lens: progress.lens - before, earnedTheme, checks: run.checks };
  }
  root.HabitatModel = Object.freeze({ normalize, createRun, snapshot, toggle, clear, undo, settle });
})(typeof window !== 'undefined' ? window : globalThis);
