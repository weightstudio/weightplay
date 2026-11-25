export const GAME_ID = 'moss-trail-patrol';
export const SAVE_KEY = 'weightplay.moss-trail-patrol.v1';
export const TOTAL_STAGES = 60;
export const MAX_SHARDS = 6;
export const PAINT = { id: 'moss-trail-patrol.amber-lantern', cost: 6 };
export const kits = { base: 0, bracer: 5, lens: 15, canopy: 31 };
export const costs = { camp: 2, lantern: 2, lure: 1, plank: 1 };

const foes = {
  s: { health: 2, pattern: [{ name: 'jab', hit: 1 }] },
  r: { health: 4, pattern: [{ name: 'heavy', hit: 2 }, { name: 'opening', hit: 0 }] },
  m: { health: 4, pattern: [{ name: 'evade', hit: 0, armor: 1 }, { name: 'jab', hit: 2 }] },
  g: { health: 5, pattern: [{ name: 'armor', hit: 0, armor: 1 }, { name: 'jab', hit: 2 }] },
  b: { health: 8, pattern: [{ name: 'heavy', hit: 3 }, { name: 'opening', hit: 0 }, { name: 'armor', hit: 0, armor: 1 }] },
};

export function normalizeSave(raw) {
  const future = Number.isInteger(raw?.schema) && raw.schema > 1;
  const value = { schema: 1, best: {}, kit: 'base', paint: false, tutorial: false, completed: 0, future };
  if (!raw || future) return value;
  for (let i = 1; i <= TOTAL_STAGES; i++) {
    const best = raw.best?.[i];
    if (Number.isInteger(best) && best >= 1 && best <= 3) value.best[i] = best;
  }
  while (value.best[value.completed + 1]) value.completed++;
  if (Object.hasOwn(kits, raw.kit) && kits[raw.kit] <= value.completed) value.kit = raw.kit;
  value.paint = raw.paint === true;
  value.tutorial = raw.tutorial === true;
  return value;
}

export function start(stage, kit = 'base') {
  return {
    stage, kit, hp: stage.maxHealth, shards: stage.laps + 1,
    marks: Array(stage.sites.length).fill(null), lap: 0, site: -1, wins: 0, skipped: false,
    result: '', reason: '', foe: null, bossCleared: false, turns: 0, ward: false,
  };
}

function after(run, index = run.site + 1) {
  const { stage } = run;
  const site = stage.sites[index];
  if (!site) return null;
  const enemy = site.enemy === 'b' && run.lap + 1 < stage.laps ? '.' : site.enemy;
  return { ...site, enemy, index, high: (index + run.lap + stage.id) % 2 === 0, mark: run.marks[index] };
}

export function preview(run) { return after(run); }

export function intent(run) {
  if (!run.foe) return null;
  const { code, turn, mark } = run.foe;
  const pattern = foes[code].pattern;
  const cue = pattern[turn % pattern.length];
  return { ...cue, hit: cue.hit + Number(mark === 'lure' && turn === 0) };
}

export function legal(run, action) {
  if (run.result) return false;
  if (run.foe) return action === 'strike' || (action === 'guard' && intent(run).hit > 0 && !run.foe.counter);
  if (action === 'trail') return true;
  const site = preview(run);
  if (!site) return false;
  if (action === 'bypass') {
    return run.stage.id >= 21 && !run.skipped && site.enemy !== 'b'
      && (site.enemy === '.' || run.stage.total > run.stage.required);
  }
  if (!Object.hasOwn(costs, action) || site.mark || run.shards < costs[action]) return false;
  if (action === 'camp') return run.stage.id >= 3;
  if (action === 'lantern') return run.stage.id >= 6 && site.enemy !== '.';
  if (action === 'lure') return run.stage.id >= 11 && site.enemy !== '.' && site.enemy !== 'b';
  return run.stage.id >= 31 && site.terrain === 't';
}

function arrive(run, next, events) {
  if (!next) {
    run.lap++;
    run.site = -1;
    if (run.lap === run.stage.laps) {
      const cleared = run.wins >= run.stage.required && (!run.stage.boss || run.bossCleared);
      run.result = cleared ? 'win' : 'loss';
      run.reason = cleared ? 'home' : 'missed';
    }
    events.push({ kind: 'home' });
    return;
  }
  run.site = next.index;
  if (next.mark === 'lantern' && run.kit === 'lens') run.ward = true;
  if (next.mark === 'camp') {
    const before = run.hp;
    run.hp = Math.min(run.stage.maxHealth, run.hp + 2 + Number(run.kit === 'canopy' && run.lap === 0));
    if (run.hp > before) events.push({ kind: 'heal', amount: run.hp - before });
  }
  if (next.terrain === 'h') {
    run.hp = Math.max(0, run.hp - 1);
    events.push({ kind: 'hurt', amount: 1 });
  }
  if (next.terrain === 't' && next.high) {
    if (next.mark === 'plank') events.push({ kind: 'saved' });
    else if (run.shards > 0) {
      run.shards--;
      events.push({ kind: 'washed' });
    }
  }
  if (run.hp === 0) {
    run.result = 'loss';
    run.reason = 'hollow';
  } else if (next.enemy !== '.') {
    const health = foes[next.enemy].health - Number(next.mark === 'lure');
    run.foe = { code: next.enemy, hp: health, max: health, mark: next.mark, turn: 0, counter: false, lit: next.mark === 'lantern' };
    if (next.enemy === 'b') events.push({ kind: 'boss' });
  }
}

function fight(run, action, events) {
  const foe = run.foe;
  const cue = intent(run);
  run.turns++;
  if (action === 'guard') {
    foe.counter = true;
    foe.turn++;
    events.push({ kind: 'block', amount: cue.hit });
    return;
  }
  const damage = 2 + (foe.counter ? 1 + Number(run.kit === 'bracer') : 0) + Number(foe.lit)
    - (foe.lit ? 0 : (cue.armor ?? 0));
  events.push({ kind: foe.counter ? 'counter' : 'strike', amount: damage });
  foe.hp = Math.max(0, foe.hp - damage);
  const interrupted = foe.lit && cue.name === 'heavy';
  foe.lit = false;
  foe.counter = false;
  foe.turn++;
  if (foe.hp === 0) {
    run.wins++;
    run.bossCleared ||= foe.code === 'b';
    const before = run.shards;
    const bag = (foe.code === 'm' ? 2 : 1) + Number(foe.mark === 'lure');
    run.shards = Math.min(MAX_SHARDS, run.shards + bag);
    events.push({ kind: 'defeat', amount: run.shards - before });
    run.foe = null;
  } else if (cue.hit > 0 && run.ward && !interrupted) {
    run.ward = false;
    events.push({ kind: 'block', amount: cue.hit });
  } else if (cue.hit > 0 && !interrupted) {
    run.hp = Math.max(0, run.hp - cue.hit);
    events.push({ kind: 'hurt', amount: cue.hit });
    if (!run.hp) {
      run.result = 'loss';
      run.reason = 'foeHurt';
    }
  } else if (cue.hit > 0) {
    events.push({ kind: 'interrupted' });
  }
}

export function act(run, action) {
  if (!legal(run, action)) return null;
  const events = [];
  if (run.foe) {
    fight(run, action, events);
  } else if (action === 'trail' || action === 'bypass') {
    const skip = action === 'bypass';
    if (skip) run.skipped = true;
    events.push({ kind: 'move' });
    arrive(run, after(run, run.site + (skip ? 2 : 1)), events);
  } else {
    run.marks[run.site + 1] = action;
    run.shards -= costs[action];
    events.push({ kind: 'placed', mark: action });
  }
  return events;
}

export function stars(run) {
  if (run.result !== 'win') return 0;
  if (run.wins === run.stage.total && run.hp >= run.stage.goldHealth && run.turns <= run.stage.goldTurns) return 3;
  return run.hp >= 6 ? 2 : 1;
}

