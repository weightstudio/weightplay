export const GAME_ID = 'fluxrail-pinball';
export const SAVE_KEY = 'weightplay_fluxrail_pinball_v1';
export const LESSON_KEY = 'weightplay_fluxrail_pinball_tutorial_v1';
export const LANES = Object.freeze(['L', 'C', 'R']);
export const RETURN_OPEN = .44;
export const RETURN_END = .95;
export const POWER_LIMIT = 4;
export const SHOT_MS = 740;
export const DRAIN_MS = 490;
export const END_MS = 510;
export const TOOLS = Object.freeze({ standard: 0, buffer: 4, capacitor: 14, counterweight: 30 });
export const FINISHES = Object.freeze({ copper: 5, aurora: 12 });

const opposite = side => side === 'L' ? 'R' : 'L';
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
export const purchaseKey = id => GAME_ID + ':finish:' + id;

export function cleanSave(value, count) {
  const best = {};
  let unlocked = 1;
  for (let id = 1; id <= count; id++) {
    const stars = value?.best?.[id];
    if (Number.isInteger(stars) && stars >= 1 && stars <= 3) {
      best[id] = stars;
      unlocked = Math.min(count, id + 1);
    }
  }
  const tool = value?.tool;
  return {
    version: 1, best, unlocked,
    tool: Object.hasOwn(TOOLS, tool) && (TOOLS[tool] === 0 || best[TOOLS[tool]]) ? tool : 'standard',
    finish: Object.hasOwn(FINISHES, value?.finish) ? value.finish : 'steel',
  };
}

export function newRun(stage, tool, teaching = false) {
  return {
    stage, tool, teaching,
    phase: 'ready', elapsed: 0, duration: 1, index: 0, balls: stage.balls, charge: stage.charge,
    side: stage.firstSide, pole: stage.initialPole, beat: stage.firstBeat,
    lane: 'C', hit: null, launch: true, source: 'serve', catchAt: 0,
    saves: 0, lost: 0, hits: 0, misses: 0, shield: false, reserve: false,
    usedBuffer: false, usedCapacitor: false, queued: false, won: false,
  };
}

function phase(state, next, duration = 1) {
  state.phase = next;
  state.elapsed = 0;
  state.duration = duration;
}

function feed(state, source, side) {
  state.source = source;
  state.side = side;
  state.queued = false;
  phase(state, 'return', state.teaching ? 3600 : state.stage.returnTime);
}

export function returnProgress(state) {
  return clamp(state.elapsed / state.duration, 0, 1);
}

export function timingLane(side, progress) {
  const slot = Math.floor(3 * (progress - RETURN_OPEN) / (RETURN_END - RETURN_OPEN));
  return LANES[side === 'L' ? clamp(slot, 0, 2) : 2 - clamp(slot, 0, 2)];
}

export function aim(state) {
  if (state.phase !== 'return') return null;
  const progress = returnProgress(state);
  return progress >= RETURN_OPEN && progress < RETURN_END ? timingLane(state.side, progress) : null;
}

export function closedBy(state, lane) {
  if (lane === 'C') return '';
  if (state.stage.shutters && lane === (state.beat ? 'L' : 'R')) return 'shutter';
  if (state.stage.magnetic && lane !== state.pole) return 'polarity';
  return '';
}

function shoot(state, progress, lane) {
  state.lane = lane;
  state.catchAt = progress;
  state.hit = null;
  phase(state, 'shot', SHOT_MS);
  return { type:'strike', lane };
}

export function paddle(state, side) {
  if (state.phase === 'ready') {
    feed(state, 'serve', state.side);
    return { type:'serve' };
  }
  if (state.phase !== 'return') return null;
  if (state.side !== side) return { type:'wrongSide' };
  const progress = returnProgress(state);
  const lane = aim(state);
  if (lane) return shoot(state, progress, lane);
  if (state.tool === 'buffer' && !state.usedBuffer && progress >= .17 && progress < RETURN_OPEN) {
    state.queued = true;
    return { type:'buffered' };
  }
  return { type:'early' };
}

export function togglePole(state) {
  if (!state.stage.magnetic || state.phase !== 'return') return null;
  if (!state.charge) return { type:'lowPower' };
  state.charge--;
  state.pole = opposite(state.pole);
  return { type:'switched' };
}

export function armSave(state) {
  if (!state.stage.magnetic || state.phase !== 'return' || state.shield) return null;
  const cost = state.reserve ? 1 : 2;
  if (state.charge < cost) return { type:'lowPower' };
  state.charge -= cost;
  state.reserve = false;
  state.shield = true;
  return { type:'armed' };
}

function finishShot(state) {
  if (state.teaching) {
    state.teaching = false;
    feed(state, 'rail', state.side);
    return { type:'taught', lane:state.lane };
  }
  const lane = state.lane;
  const blocked = closedBy(state, lane);
  const matched = !blocked && state.stage.order[state.index] === lane;
  state.hit = { lane, blocked, matched };
  if (matched) {
    state.index++;
    state.hits++;
  } else if (blocked) {
    state.misses++;
  }
  if (lane === 'C' && state.stage.magnetic) {
    state.charge = Math.min(POWER_LIMIT, state.charge + 2);
    if (state.tool === 'capacitor' && !state.usedCapacitor) {
      state.usedCapacitor = true;
      state.reserve = true;
    }
  }
  state.beat = 1 - state.beat;
  if (state.index === state.stage.order.length) {
    state.won = true;
    phase(state, 'ending', END_MS);
    return { type:'target', lane, final:true };
  }
  const normalSide = lane === 'C' ? opposite(state.side) : lane;
  const feedback = lane !== 'C' && !blocked && state.stage.feedback;
  if (feedback) state.pole = opposite(state.pole);
  feed(state, blocked || feedback ? 'bridge' : 'rail', feedback ? opposite(normalSide) : normalSide);
  return { type:blocked || (matched ? 'target' : lane === 'C' && state.stage.magnetic ? 'charged' : 'redirected'), lane, feedback };
}

function finishDrain(state) {
  if (state.teaching || state.shield) {
    if (state.shield) state.saves++;
    state.shield = false;
    const side = state.tool === 'counterweight' || state.teaching ? opposite(state.side) : state.side;
    feed(state, 'rescue', side);
    return { type:state.teaching ? 'lessonRetry' : 'saved' };
  }
  state.balls--;
  state.lost++;
  if (state.balls > 0) phase(state, 'ready');
  else phase(state, 'ending', END_MS);
  return { type:'lost' };
}

export function tick(state, milliseconds) {
  if (state.phase === 'ready' || state.phase === 'complete') return null;
  state.elapsed = Math.min(state.duration, state.elapsed + milliseconds);
  if (state.phase === 'return') {
    const progress = returnProgress(state);
    if (state.queued && progress >= RETURN_OPEN) {
      state.usedBuffer = true;
      return shoot(state, RETURN_OPEN, timingLane(state.side, RETURN_OPEN));
    }
    if (progress >= RETURN_END) {
      phase(state, 'drain', DRAIN_MS);
      return { type:'late' };
    }
  }
  if (state.elapsed < state.duration) return null;
  switch (state.phase) {
    case 'shot': return finishShot(state);
    case 'drain': return finishDrain(state);
    case 'ending':
      phase(state, 'complete');
      return { type:'complete', won:state.won };
    default: return null;
  }
}

export function stars(state) {
  if (!state.won) return 0;
  return 1 + Number(state.lost <= 1) + Number(state.lost === 0 && state.misses <= 1);
}
