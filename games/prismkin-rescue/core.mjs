export const ID = 'prismkin-rescue';
export const SAVE_KEY = 'weightplay.prismkin-rescue.v1';
export const DEFAULT_TRAITS = ['leap', 'guard'];
export const TRAITS = ['leap', 'guard', 'anchor', 'echo'];
export const LOOKS = {glass: 8, amber: 16, dawn: 24};
export const LESSON = {first: 7, creature: 21};
export const CHAPTER_SIZE = 30;

export const col = (tile, width) => tile % width;
export const row = (tile, width) => Math.floor(tile / width);
export function distance(a, b, width) {
  return Math.abs(col(a, width) - col(b, width)) + Math.abs(row(a, width) - row(b, width));
}
export function neighbors(at, width) {
  return [
    row(at, width) > 0 ? at - width : -1,
    col(at, width) < width - 1 ? at + 1 : -1,
    row(at, width) < width - 1 ? at + width : -1,
    col(at, width) > 0 ? at - 1 : -1
  ];
}
export function newRun(stage, {traits = DEFAULT_TRAITS, lesson = false} = {}) {
  return {
    stage, traits: [...traits], active: 0, positions: [...stage.start], carry: [-1, -1],
    saved: 0, steps: 0, phase: 0, light: stage.light, rope: stage.rope, warmth: 0,
    nextTide: 0, reverse: false, held: 0, echo: false, longPass: false, imprint: false,
    lesson: lesson && stage.id === 1 ? 0 : -1, status: 'active'
  };
}
export function tide(run) {
  return run.stage.tides[run.nextTide] || [];
}
export function isGateOpen(run, gate) {
  return run.held > 0 || gate.plates.every(tile => run.positions.includes(tile));
}
export function targetState(run, i) {
  return run.saved & 1 << i ? 'saved' : run.carry.includes(i) ? 'tethered' : 'lost';
}
export function check(run, action) {
  const {active, positions, stage, carry} = run;
  const other = 1 - active, from = positions[active];
  if (run.status !== 'active') return 'finished';
  if (run.lesson === 0 && (action.type !== 'move' || action.tile !== LESSON.first) ||
      run.lesson === 1 && (action.type !== 'select' || action.unit !== 1) ||
      run.lesson === 2 && (action.type !== 'move' || action.tile !== LESSON.creature)) return 'followCue';
  if (action.type === 'select') return action.unit === other ? 'select' : 'choosePartner';
  if (action.type === 'wait') return 'wait';
  if (action.type === 'pass') {
    const d = distance(from, positions[other], stage.width);
    if (carry[active] < 0 || carry[other] >= 0) return 'needLead';
    if (d <= 1) return 'pass';
    return d === 2 && !run.longPass && run.traits.includes('anchor') ? 'anchorPass' : 'needNearby';
  }
  if (action.type !== 'move' || !Number.isInteger(action.tile)) return 'invalidTile';
  const to = action.tile, w = stage.width;
  if (!stage.tiles.has(to) || to === positions[other]) return 'blocked';
  const gate = stage.gates.find(g => g.tile === to);
  if (gate && !isGateOpen(run, gate)) return 'closedGate';
  const d = distance(from, to, w);
  if (d === 1) return 'walk';
  if (d === 2 && (row(from, w) === row(to, w) || col(from, w) === col(to, w))) {
    const between = (from + to) / 2;
    if (stage.phaseTiles.has(between)) return run.rope && carry[active] >= 0 ? 'rope' : 'needRope';
    if (stage.gaps.has(between)) return run.traits[active] === 'leap' ? 'leap' : 'needLeap';
  }
  return 'invalidTile';
}
export const VALID = new Set(['select', 'wait', 'pass', 'anchorPass', 'walk', 'rope', 'leap']);
export function play(run, action) {
  const effect = check(run, action);
  if (!VALID.has(effect)) return {run, ok: false, cue: effect};
  const {stage, active} = run;
  const teaching = run.lesson >= 0;
  const next = {...run, positions: [...run.positions], carry: [...run.carry], held: Math.max(0, run.held - 1)};
  const events = [effect];
  if (effect === 'select') {
    next.active = action.unit;
    next.held = run.held;
  } else {
    if (action.type === 'move') {
      next.positions[active] = action.tile;
      if (effect === 'rope') next.rope--;
      if (stage.relay.has(action.tile)) {
        next.reverse = !next.reverse;
        events.push('reversed');
      }
      if (stage.gates.some(g => g.plates.includes(run.positions[active])) &&
          next.traits[active] === 'echo' && !next.echo) {
        next.echo = true; next.held = 1; events.push('echo');
      }
    } else if (effect === 'pass' || effect === 'anchorPass') {
      next.carry[1 - active] = next.carry[active]; next.carry[active] = -1;
      if (effect === 'anchorPass') next.longPass = true;
    }
    for (const [unit, tile] of next.positions.entries()) {
      if (tile === stage.home && next.carry[unit] >= 0) {
        next.saved |= 1 << next.carry[unit]; next.carry[unit] = -1; events.push('delivered');
      }
      const lost = stage.targets.findIndex((t, i) => t === tile && targetState(next, i) === 'lost');
      if (lost >= 0 && next.carry[unit] < 0) {
        next.carry[unit] = lost; events.push('tethered');
      }
      if (!next.imprint && tile === stage.imprint) {
        next.imprint = true; events.push('imprint');
      }
    }
    if (!teaching) {
      next.steps++;
      const danger = new Set(tide(run));
      for (const [unit, tile] of next.positions.entries()) {
        if (!danger.has(tile) || stage.shelters.has(tile) || tile === stage.home) continue;
        if (next.traits[unit] === 'guard') { events.push('sheltered'); continue; }
        const warm = stage.warm.indexOf(tile);
        if (warm !== -1 && !(next.warmth & 1 << warm)) {
          next.warmth |= 1 << warm; events.push('warmed'); continue;
        }
        next.light = Math.max(0, next.light - 1);
        events.push('dimmed');
      }
      const period = stage.tides.length;
      if (period) next.nextTide = (run.nextTide + (next.reverse ? period - 1 : 1)) % period;
    }
    if (next.saved === (1 << stage.targets.length) - 1) next.status = 'won';
    else if (next.light === 0 && stage.light > 0) next.status = 'dark';
    else if (next.steps >= stage.limit) next.status = 'outOfSteps';
  }
  if (teaching) {
    next.lesson++;
    if (next.lesson === 3) {
      next.lesson = -1;
      events.push('lessonDone');
    }
  }
  return {ok: true, run: next, events, cue: events.at(-1)};
}

export function normalizeSave(value, count = 60) {
  const saved = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const clears = {};
  for (const [id, record] of Object.entries(saved.clears ?? {})) {
    if (!/^[1-9]\d*$/.test(id) || +id > count || !Number.isInteger(record?.steps) ||
        record.steps < 1 || record.steps > 200) continue;
    clears[id] = {steps: record.steps, imprint: record.imprint === true};
  }
  let unlocked = 1;
  while (unlocked < count && clears[unlocked]) unlocked++;
  const finds = Object.values(clears).filter(c => c.imprint).length;
  const available = new Set(['leap', 'guard']);
  if (finds >= 2) available.add('anchor');
  if (finds >= 5 && clears[30]) available.add('echo');
  return {
    schema: 1, clears, unlocked, finds, available: [...available],
    traits: DEFAULT_TRAITS.map((base, i) => available.has(saved.traits?.[i]) ? saved.traits[i] : base),
    tutorialRevision: saved.tutorialRevision === 1 ? 1 : 0,
    look: Object.hasOwn(LOOKS, saved.look) ? saved.look : 'original'
  };
}
export function recordClear(save, run, count) {
  if (run.status !== 'won') return save;
  const id = run.stage.id, old = save.clears[id];
  return normalizeSave({...save, clears: {...save.clears, [id]: {
    steps: Math.min(run.steps, old?.steps ?? Infinity), imprint: run.imprint || !!old?.imprint
  }}}, count);
}
