/* Pure decisions for the additional Word Trails stages. The existing ten
 * stages continue to use their original input rules. */
(() => {
  'use strict';

  const isAdjacent = (a, b, size) => a !== b
    && Math.abs(Math.floor(a / size) - Math.floor(b / size)) <= 1
    && Math.abs(a % size - b % size) <= 1;
  const contains = (items, value) => Array.isArray(items) && items.includes(value);

  function allowedCategory(stage, found, committed) {
    if (!stage.categoryOrder) return null;
    const initial = stage.categoryOrder === 'A→N' ? 'animal'
      : stage.categoryOrder === 'N→A' ? 'nature' : committed;
    if (!initial) return null;
    const complete = stage.targets.filter(target => target.category === initial)
      .every(target => found.has(target.id));
    return complete ? (initial === 'animal' ? 'nature' : 'animal') : initial;
  }

  function chooseTarget(stage, state, id) {
    const target = stage.targets.find(item => item.id === id);
    if (!target || state.found.has(id)) return { ok: false, reason: 'unavailable' };
    const allowed = allowedCategory(stage, state.found, state.committedCategory);
    if (allowed && target.category !== allowed) return { ok: false, reason: 'lockedCategory' };
    return { ok: true, target: id };
  }

  function moveBridge(stage, state, index) {
    if (!contains(stage.bridges, index)) return { ok: false, reason: 'unavailable' };
    return { ok: true, bridge: index, path: [], found: state.found };
  }

  function append(stage, state, index) {
    if (!Number.isInteger(index) || index < 0 || index >= stage.board.length
      || contains(stage.blocked, index) || state.path.includes(index)) {
      return { ok: false, reason: 'unavailable' };
    }
    if (contains(stage.bridges, index) && index !== state.bridge) {
      return { ok: false, reason: 'bridgeBlocked' };
    }
    if (stage.categoryOrder && !state.target) return { ok: false, reason: 'selectTarget' };
    const previous = state.path.at(-1);
    if (previous !== undefined && !isAdjacent(previous, index, stage.size)) {
      return { ok: false, reason: 'notAdjacent' };
    }
    const gate = (stage.oneWays || []).find(item => item.index === index);
    if (gate && previous !== gate.from) return { ok: false, reason: 'wrongDirection' };
    if (contains(stage.wildcards, index)
      && state.path.some(cell => contains(stage.wildcards, cell))) {
      return { ok: false, reason: 'oneWildPerPath' };
    }
    return { ok: true, path: [...state.path, index] };
  }

  function submit(stage, state) {
    if (!state.path.length) return { ok: false, reason: 'empty' };
    if (stage.categoryOrder && !state.target) return { ok: false, reason: 'selectTarget' };
    // Recheck the entire submitted route. This keeps pointer cancellation,
    // target changes, hints and future callers from bypassing move rules.
    let checkedPath = [];
    for (const cell of state.path) {
      const step = append(stage, { ...state, path: checkedPath }, cell);
      if (!step.ok) return step;
      checkedPath = step.path;
    }
    const allowed = allowedCategory(stage, state.found, state.committedCategory);
    const matches = stage.targets.filter(target => {
      if (state.found.has(target.id) || (allowed && target.category !== allowed)
        || (state.target && target.id !== state.target)
        || target.tokens.length !== state.path.length) return false;
      return state.path.every((cell, i) => contains(stage.wildcards, cell)
        || stage.board[cell] === target.tokens[i]);
    });
    if (matches.length !== 1) return { ok: false, reason: 'try' };
    const target = matches[0];
    return { ok: true, target, committedCategory: state.committedCategory || target.category };
  }

  globalThis.WordTrailsStage60Rules = Object.freeze({
    isAdjacent, allowedCategory, chooseTarget, moveBridge, append, submit,
  });
})();
