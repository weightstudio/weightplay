import { DEPTH, WIDTH, equipment } from './stages.mjs?wp-media=8a3de24a47270269';

const OFFSETS = [[-.45, .24], [.43, .31], [0, -.44]];
const limit = (value, min, max) => Math.min(max, Math.max(min, value));
export const distance = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
const clampPoint = (x, z) => ({
  x: limit(x, -WIDTH / 2 + .23, WIDTH / 2 - .23),
  z: limit(z, -DEPTH / 2 + .26, DEPTH / 2 - .26),
});

export function gateState(gate, time) {
  const phase = (time + gate.phase) % gate.period;
  return { open: phase < gate.openFor, warning: phase >= gate.period - .9 };
}

function move(run, entity, x, z) {
  const next = clampPoint(x, z);
  for (const gate of run.stage.gates) {
    if ((entity.z < gate.z) === (next.z < gate.z)) continue;
    const at = (gate.z - entity.z) / (next.z - entity.z);
    const crossing = entity.x + (next.x - entity.x) * at;
    const state = gateState(gate, run.elapsed);
    const entry = Math.abs(crossing - gate.center) < 1.65 && state.open;
    const bypass = gate.side && Math.abs(crossing) > 4.6;
    if (!entry && !bypass) return { x: next.x, z: gate.z + (entity.z < gate.z ? -.07 : .07) };
  }
  return next;
}

function spawn(run, group, start, count) {
  run.lights.push(...OFFSETS.slice(0, count).map(([x, z]) => ({
    x: start.x + x, z: start.z + z, vx: 0, vz: 0, group,
    caught: false, seated: false, sheltered: 0, held: false,
  })));
}

export function newRun(stage, kitId, teaching = false) {
  const kit = equipment.find(item => item.id === kitId) ?? equipment[0];
  const first = stage.lanes[0].start;
  const run = {
    stage, kit, elapsed: 0, lamp: clampPoint(first.x, first.z + (first.z < 0 ? -3.4 : 3.4)),
    stands: stage.lanes.map(lane => ({ ...lane.end, shape: lane.shape, count: 0, flare: 0 })),
    lights: [], count: 0, following: 0, teach: teaching ? 1 : 0, phase: 'play',
    focus: 0, filter: false, ability: 0, cool: 0, events: [], added: stage.id !== 1,
  };
  stage.lanes.forEach((lane, i) => spawn(run, i, lane.start, lane.count));
  return run;
}

export function activate(run) {
  if (run.teach || run.cool > 0 || run.phase !== 'play') return false;
  run.ability = run.kit.id === 'wind' ? 4 : run.kit.id === 'split' ? 2.8 : 1.45;
  run.cool = 6.5;
  if (run.kit.id === 'split') {
    const closest = run.lights.filter(light => light.caught).sort((a, b) => distance(a, run.lamp) - distance(b, run.lamp))[0];
    if (closest) {
      for (const light of run.lights) light.held = light.caught && light.group === closest.group;
    }
  }
  run.events.push({ type: 'ability' });
  return true;
}

export function toggleFilter(run) {
  if (run.teach || run.phase !== 'play' || run.stage.lanes.length < 2) return false;
  run.focus = run.filter ? 1 - run.focus : 0;
  run.filter = !run.filter || run.focus === 1;
  run.events.push({ type: 'filter' });
  return true;
}

function stepLight(run, light, dt) {
  if (light.seated) return;
  const lamp = run.lamp;
  const canFollow = !run.filter || run.stands[light.group].shape === run.focus;
  const reach = run.kit.radius + (run.ability > 0 && run.kit.id !== 'wind' ? .65 : 0);
  const near = distance(light, lamp);
  const caught = canFollow && near < reach;
  const drift = run.stage.swing ? Math.cos(run.elapsed * .48) : Math.sign(light.z || 1);
  const atShelter = run.stage.shelter && Math.abs(light.z) < 1.2 && Math.abs(light.x) > 3.6;
  light.sheltered = atShelter ? 1.6 : Math.max(0, light.sheltered - dt);
  const protectedFromWind = light.sheltered > 0 || (caught && run.ability > 0 && run.kit.id === 'wind');
  const holding = light.held && run.ability > 0;
  const wind = protectedFromWind || run.teach || holding ? 0 : run.stage.wind * drift * (caught ? .23 : 1);
  const speed = 3.8 * Math.min(1, near / 1.15) * (run.kit.id === 'wide' && near > 2.8 ? .77 : 1);
  const fraction = caught && near > .03 && !holding ? speed / near : 0;
  const wantX = (lamp.x - light.x) * fraction + wind;
  const wantZ = (lamp.z - light.z) * fraction + (caught || holding || run.teach ? 0 : Math.cos(run.elapsed * .7 + light.group) * .28);
  const response = Math.min(1, dt * (caught ? 6 : 3.8));
  light.vx += (wantX - light.vx) * response;
  light.vz += (wantZ - light.vz) * response;
  Object.assign(light, move(run, light, light.x + light.vx * dt, light.z + light.vz * dt));
  light.caught = caught && !holding;
  if (!run.ability) light.held = false;
  const stand = run.stands[light.group];
  if (distance(light, stand) <= 1.04) {
    light.seated = true;
    light.caught = false;
    stand.count++;
    stand.flare = .55;
    run.count++;
    run.events.push({ type: 'seat', group: light.group });
  }
}

export function advance(run, dt, target) {
  if (run.phase !== 'play') return;
  if (!run.teach) run.elapsed += dt;
  run.ability = Math.max(0, run.ability - dt);
  run.cool = Math.max(0, run.cool - dt);
  for (const stand of run.stands) stand.flare = Math.max(0, stand.flare - dt);
  if (target) {
    const gap = distance(run.lamp, target);
    const movement = Math.min(1, dt * 8.1 / Math.max(gap, .01));
    Object.assign(run.lamp, move(run, run.lamp,
      run.lamp.x + (target.x - run.lamp.x) * movement,
      run.lamp.z + (target.z - run.lamp.z) * movement));
  }
  for (const light of run.lights) stepLight(run, light, dt);
  run.following = run.lights.filter(light => light.caught).length;
  if (run.teach === 1 && run.lights.filter(light => light.caught && Math.hypot(light.vx, light.vz) > .85).length >= 2) {
    run.teach = 2;
    run.events.push({ type: 'gather' });
  }
  if (!run.added && run.count === 3) {
    if (run.teach === 2) run.events.push({ type: 'lesson' });
    run.teach = 0;
    run.added = true;
    spawn(run, 0, { x: 2, z: 4.35 }, 3);
  }
  if (run.count === run.stage.total) run.phase = 'win';
  if (run.elapsed >= run.stage.limit) run.phase = run.count >= run.stage.need ? 'win' : 'lose';
}

export function rating(run) {
  if (run.phase !== 'win') return 0;
  if (run.count < run.stage.total) return 1;
  return run.elapsed <= run.stage.limit * .85 ? 3 : 2;
}

export function readSave(serialized) {
  const root = { schema: 1, stars: {}, kit: 'standard', brass: false, unlocked: 1 };
  try {
    const data = JSON.parse(serialized);
    if (!data) return root;
    if (data.schema > 1) return { ...root, future: true };
    if (data.schema !== 1) return root;
    for (const [stage, stars] of Object.entries(data.stars ?? {})) {
      if (!/^[1-9][0-9]?$/.test(stage) || +stage > 60 || !Number.isInteger(stars) || stars < 1 || stars > 3) continue;
      root.stars[stage] = stars;
    }
    while (root.unlocked < 60 && root.stars[root.unlocked]) root.unlocked++;
    const allowed = equipment.find(item => item.id === data.kit && (!item.unlock || root.stars[item.unlock]));
    root.kit = allowed?.id ?? root.kit;
    root.brass = data.brass === true;
  } catch {}
  return root;
}
