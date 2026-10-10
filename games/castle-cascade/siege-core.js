// Authored checkpoint encounters. Positions are normalized within the battlefield.
const target = (kind, hp, x, y = .55, color = null) => ({ kind, hp, maxHp: hp, x, y, color });
export const SIEGE_LEVELS = {
  4: [[target("tower", 14, .22), target("tower", 18, .5, .35), target("tower", 14, .78)]],
  9: [[target("tower", 18, .28), target("tower", 18, .72)], [target("armor", 12, .3), target("tower", 22, .7)]],
  14: [[target("tower", 22, .25), target("keep", 28, .7, .42)], [target("armor", 15, .24), target("keep", 32, .7)]],
  19: [[target("tower", 28, .25, .5, 0), target("tower", 28, .75, .5, 2)], [target("armor", 18, .24), target("keep", 42, .7, .4, 3)]],
  24: [[target("sentinel", 26, .25, .65), target("keep", 34, .7, .35)], [target("sentinel", 26, .2, .65), target("armor", 18, .52, .55), target("keep", 42, .8, .28)]],
  29: [[target("tower", 26, .25, .5, 0), target("tower", 26, .75, .5, 2)], [target("sentinel", 30, .23, .65), target("armor", 21, .53), target("keep", 38, .8, .3)], [target("sentinel", 32, .22, .65), target("armor", 24, .53), target("keep", 55, .8, .3, 4)]],
};

function waveTargets(stage, wave) {
  return SIEGE_LEVELS[stage][wave].map((item, index) => ({ ...item, id: `${wave}-${index}` }));
}
export function createSiege(stage) {
  return SIEGE_LEVELS[stage] ? { stage, wave: 0, totalWaves: SIEGE_LEVELS[stage].length,
    targets: waveTargets(stage, 0), defeated: 0, complete: false } : null;
}
export function siegeSnapshot(siege) {
  return siege ? { ...siege, targets: siege.targets.map(item => ({ ...item })) } : null;
}
export function siegeRemaining(siege) {
  if (!siege || siege.complete) return 0;
  return siege.targets.filter(item => item.hp > 0).length
    + SIEGE_LEVELS[siege.stage].slice(siege.wave + 1).reduce((sum, wave) => sum + wave.length, 0);
}

export function resolveSiegeBatch(siege, batch) {
  if (!siege || siege.complete) return null;
  const before = siegeSnapshot(siege);
  const powers = new Set(batch.powerHits);
  const combo = batch.visualEffects.some(effect => effect.type === "combo-burst");
  const sources = batch.directHits.filter(index => batch.before[index].c !== null && batch.cleared[index].c === null)
    .map(index => ({ index, color: batch.before[index].c, power: powers.has(index), damage: powers.has(index) ? (combo ? 5 : 3) : 1 }));
  for (const index of batch.deliveredKeys) sources.push({ index, color: 2, power: true, damage: 8, delivery: true });
  // At most one packet per target/power tier. Each carries its real total,
  // even when a board-wide combination clears dozens of gems.
  const packets = new Map();
  for (const source of sources) {
    let alive = siege.targets.filter(item => item.hp > 0);
    if (!alive.length) break;
    const guards = alive.filter(item => item.kind === "sentinel");
    if (guards.length) alive = alive.filter(item => item.kind !== "keep");
    const eligible = alive.filter(item => source.power || item.kind !== "armor");
    const candidates = eligible.length ? eligible : alive;
    candidates.sort((a, b) => {
      if (source.power && (a.kind === "armor") !== (b.kind === "armor")) return a.kind === "armor" ? -1 : 1;
      return Math.abs(a.x - (source.index % 9 + .5) / 9) - Math.abs(b.x - (source.index % 9 + .5) / 9);
    });
    const victim = candidates[0];
    const blocked = victim.kind === "armor" && !source.power;
    const damage = blocked ? 0 : Math.min(victim.hp, source.damage * (victim.color === source.color ? 2 : 1));
    const key = `${victim.id}:${source.power}:${Boolean(source.delivery)}`;
    const packet = packets.get(key) || { index: source.index, targetId: victim.id, color: source.color,
      power: source.power, delivery: Boolean(source.delivery), combo, blocked, damage: 0, hpBefore: victim.hp, hpAfter: victim.hp };
    victim.hp -= damage;
    packet.damage += damage;
    packet.hpAfter = victim.hp;
    packets.set(key, packet);
    if (victim.hp === 0) siege.defeated += 1;
  }
  // Packet aggregation can interleave targets/colors. Record monotonic displayed
  // health in playback order rather than replaying intermediate core HP values.
  const shownHp = new Map(before.targets.map(item => [item.id, item.hp]));
  const attacks = [...packets.values()].map(packet => {
    packet.hpBefore = shownHp.get(packet.targetId);
    packet.hpAfter = Math.max(0, packet.hpBefore - packet.damage);
    shownHp.set(packet.targetId, packet.hpAfter);
    return packet;
  });
  const impacted = siegeSnapshot(siege);
  let nextWave = false;
  if (siege.targets.every(item => item.hp === 0)) {
    if (siege.wave + 1 < siege.totalWaves) {
      siege.wave += 1;
      siege.targets = waveTargets(siege.stage, siege.wave);
      nextWave = true;
    } else siege.complete = true;
  }
  return { before, attacks, impacted, after: siegeSnapshot(siege), nextWave };
}
