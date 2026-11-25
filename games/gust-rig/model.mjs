export const LIMIT = 4;
export const BASICS = Object.freeze(['leftUp', 'rightUp', 'leftDown', 'rightDown', 'hold']);
export const TOOLS = Object.freeze({ tandem: 3, trim: 15, damper: 35 });
const motions = {
  leftUp: [1, 0], rightUp: [0, 1], leftDown: [-1, 0], rightDown: [0, -1],
  hold: [0, 0], togetherUp: [1, 1, 'tandem'], togetherDown: [-1, -1, 'tandem'],
  leanLeft: [1, -1, 'trim'], leanRight: [-1, 1, 'trim'], calm: [0, 0, 'damper']
};

export function initialState(stage, tool = '') {
  return {
    left: stage.left, right: stage.right, index: 0,
    passed: 0, misses: 0, ribbons: 0, linked: false,
    tilt: stage.right - stage.left, tool, used: false, failed: false
  };
}

export function forecast(state, gate, action) {
  const change = motions[action];
  if (!gate || !change || state.failed) return { legal: false, reason: 'unavailable' };
  const [moveLeft, moveRight, requiredTool] = change;
  if (requiredTool && (state.tool !== requiredTool || state.used)) {
    return { legal: false, reason: 'unavailable' };
  }
  if ((gate.lock === 'L' && moveLeft) || (gate.lock === 'R' && moveRight)) {
    return { legal: false, reason: 'locked' };
  }
  const left = state.left + moveLeft;
  const right = state.right + moveRight;
  if (left < 0 || left > LIMIT || right < 0 || right > LIMIT) {
    return { legal: false, reason: 'endOfRope' };
  }
  const height = left + right;
  const tilt = right - left + (action === 'calm' ? 0 : gate.wind);
  let reason = 'centered';
  if (height < gate.low) reason = 'low';
  else if (height > gate.high) reason = 'high';
  else if (tilt < gate.minTilt || tilt > gate.maxTilt) reason = 'side';
  else if (gate.link === 'end' && !state.linked) reason = 'missedRibbon';
  return { legal: true, match: reason === 'centered', left, right, height, tilt, reason, used: Boolean(requiredTool) };
}

export function advance(stage, state, action) {
  const gate = stage.gates[state.index];
  const movement = forecast(state, gate, action);
  if (!movement.legal) return { state, movement };
  const { match, left, right, tilt, used } = movement;
  const missed = state.misses + Number(!match);
  const next = {
    ...state, left, right, tilt,
    index: state.index + 1,
    passed: state.passed + Number(match),
    misses: missed,
    ribbons: state.ribbons + Number(match && gate.link === 'end'),
    linked: match && gate.link === 'start',
    used: state.used || used,
    failed: !match && (gate.hard || missed > stage.missAllowance || gate.link === 'end')
  };
  return { state: next, movement };
}

export function rank(stage, state) {
  if (state.failed) return 0;
  if (state.index < stage.gates.length) return null;
  if (state.ribbons < stage.ribbons) return 0;
  return Math.max(1, 3 - state.misses);
}

export function solve(stage, start = initialState(stage), clean = true) {
  const queue = [{ state: start, route: [] }];
  const seen = new Set();
  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const { state, route } = queue[cursor];
    const key = [state.index, state.left, state.right, state.misses, state.ribbons, state.linked, state.used].join('/');
    if (seen.has(key)) continue;
    seen.add(key);
    const result = rank(stage, state);
    if (result === 3 || (!clean && result > 0)) return route;
    if (result !== null) continue;
    const optional = { tandem: ['togetherUp', 'togetherDown'], trim: ['leanLeft', 'leanRight'], damper: ['calm'] };
    const actions = [...BASICS, ...(optional[state.tool] || [])];
    for (const action of actions) {
      const turn = advance(stage, state, action);
      if (!turn.movement.legal || (clean && !turn.movement.match) || turn.state.failed) continue;
      queue.push({ state: turn.state, route: [...route, action] });
    }
  }
  return null;
}

export function normalizeProgress(value, total) {
  const source = value && typeof value === 'object' ? value : {};
  const stars = {};
  for (const [key, number] of Object.entries(source.stars || {})) {
    const id = Number(key);
    if (String(id) === key && Number.isInteger(id) && id > 0 && id <= total &&
        Number.isInteger(number) && number > 0 && number <= 3) stars[id] = number;
  }
  const tool = Object.hasOwn(TOOLS, source.tool) && stars[TOOLS[source.tool]] ? source.tool : '';
  return { schemaVersion: 1, stars, tool, bronze: source.bronze === true, lesson: source.lesson === true };
}

export function latestStage(progress, total) {
  let id = 1;
  while (id < total && progress.stars[id]) id += 1;
  return id;
}
