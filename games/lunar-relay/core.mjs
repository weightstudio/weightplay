export const STATIONS = ['E', 'V', 'W'];
export const EQUIPMENT = Object.freeze({ standard: 0, hood: 10, battery: 20, sync: 35 });

/** Only this model changes a turn, bill or confirmed reading. */
export function beginNight(level, equipment = 'standard', teaching = false) {
  return {
    turn: 0, energy: level.energy, readings: {}, confirmed: [],
    equipment, teaching, toolSpent: false, undoSpent: false, previous: null,
  };
}

export function outcome(level, night) {
  const won = Object.keys(level.goals).every(signal => night.confirmed.includes(signal));
  if (won) {
    const stars = level.id === 1 || (night.energy >= level.gold && (level.gold > 1 || night.turn < level.windows.length)) ? 3 : night.energy >= 1 ? 2 : 1;
    return { won, stars };
  }
  return night.turn >= level.windows.length ? { won: false, stars: 0 } : null;
}

export function evaluate(level, state, move) {
  if (move.type === 'undo') {
    return state.previous && !state.undoSpent ? { ok: true } : { reason: 'noUndo' };
  }
  if (outcome(level, state)) return { reason: 'finished' };
  if (state.teaching && (move.type !== 'read' || move.signal !== 'A' || move.stations?.join('') !== 'E')) {
    return { reason: 'lesson' };
  }
  if (move.type === 'rest') {
    const availableCapacity = level.capacity - state.energy;
    const useTool = state.equipment === 'battery' && !state.toolSpent && availableCapacity >= 2;
    return { ok: true, cost: 0, charge: Math.min(availableCapacity, useTool ? 2 : 1), useTool };
  }
  if (move.type !== 'read') return { reason: 'choose' };
  const { signal, stations } = move;
  if (!Object.hasOwn(level.goals, signal) || !Array.isArray(stations) || stations.length === 0) {
    return { reason: 'choose' };
  }
  if (state.confirmed.includes(signal)) return { reason: 'confirmed' };
  const requiresPair = level.goals[signal] === 'Z';
  if (stations.length !== (requiresPair ? 2 : 1) || new Set(stations).size !== stations.length) {
    return { reason: requiresPair ? 'needsPair' : 'oneStation' };
  }
  if (stations.some(station => state.readings[signal]?.includes(station))) return { reason: 'repeat' };
  const slots = stations.map(station => level.windows[state.turn][station]);
  if (slots.some(slot => slot?.signal !== signal)) return { reason: 'notHere' };
  if (slots.some(slot => slot.weather === 'cloud')) return { reason: 'cloud' };
  const glare = slots.filter(slot => slot.weather === 'glare').length;
  if (glare > 1) return { reason: 'tooBright' };
  const matchingTool = requiresPair ? 'sync' : 'hood';
  const useTool = glare === 1 && !state.toolSpent && state.equipment === matchingTool;
  const cost = stations.length + (useTool ? 0 : glare);
  if (state.energy < cost) return { reason: 'noEnergy', cost };
  return { ok: true, cost, glare, useTool };
}

export function takeTurn(level, state, move) {
  const check = evaluate(level, state, move);
  if (!check.ok) return { state, ...check };
  if (move.type === 'undo') {
    return { ok: true, state: { ...state.previous, undoSpent: true, previous: null } };
  }

  const { previous, ...before } = state;
  const next = {
    ...before,
    turn: state.turn + 1,
    energy: Math.min(level.capacity, state.energy - check.cost + (check.charge ?? 0)),
    toolSpent: state.toolSpent || check.useTool,
    previous: state.teaching || state.undoSpent ? null : before,
    teaching: false,
  };
  let confirmed = false;
  if (move.type === 'read') {
    const { signal, stations } = move;
    const readings = [...(state.readings[signal] ?? []), ...stations];
    next.readings = { ...state.readings, [signal]: readings };
    confirmed = level.goals[signal] === 'S' || readings.length === 2;
    if (confirmed) next.confirmed = [...state.confirmed, signal];
  }
  return { ok: true, state: next, confirmed, ...check };
}

export function normalizeProgress(value = {}, count = 60) {
  const input = value && typeof value === 'object' ? value : {};
  const stars = {};
  for (const [key, score] of Object.entries(input.stars ?? {})) {
    const stage = Number(key);
    if (String(stage) === key && Number.isInteger(stage) && stage >= 1 && stage <= count &&
        Number.isInteger(score) && score >= 1 && score <= 3) stars[stage] = score;
  }
  return {
    stars, tutorial: input.tutorial === 1 ? 1 : 0,
    equipment: Object.hasOwn(EQUIPMENT, input.equipment) && (!EQUIPMENT[input.equipment] || stars[EQUIPMENT[input.equipment]])
      ? input.equipment : 'standard',
    finish: ['indigo', 'stone', 'amber'].includes(input.finish) ? input.finish : 'indigo',
  };
}
