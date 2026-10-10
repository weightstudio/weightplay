// Integer footprints are shared with rendering: shots never change columns.
const target = (kind, hp, lane, row = 1, span = 2) => ({ kind, hp, maxHp: hp, lane, row, span, charging: false });
export const SIEGE_LEVELS = {
  4: [[target("castle", 12, 0), target("castle", 16, 3, 0, 3), target("castle", 12, 7)]],
  9: [[target("bramble", 12, 1, 1), target("castle", 18, 5, 0, 3)]],
  14: [[target("ram", 15, 1, 0), target("castle", 18, 5)], [target("bramble", 15, 5), target("castle", 20, 0, 0, 3)]],
  19: [[target("bramble", 15, 0), target("ram", 15, 6, 0)], [target("castle", 22, 0, 0, 3), target("castle", 22, 6, 0, 3)]],
  24: [[target("castle", 22, 0, 0, 3), target("bramble", 16, 1, 2), target("ram", 16, 6)], [target("bramble", 18, 0), target("castle", 26, 4, 0, 3)]],
  29: [[target("bramble", 16, 1), target("ram", 16, 6)], [target("castle", 24, 0, 0, 3), target("bramble", 18, 1, 2), target("ram", 18, 6)], [target("castle", 30, 3, 0, 3), target("bramble", 18, 0), target("ram", 18, 7)]],
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
  const attacks = [];
  for (const index of batch.directHits) {
    if (batch.before[index].c === null || batch.cleared[index].c !== null) continue;
    const lane = index % 9, power = powers.has(index);
    const victim = siege.targets.filter(item => item.hp > 0 && lane >= item.lane && lane < item.lane + item.span)
      .sort((a, b) => b.row - a.row)[0];
    const hpBefore = victim?.hp ?? 0;
    const damage = victim ? Math.min(victim.hp, power ? (combo ? 5 : 3) : 1) : 0;
    if (victim) {
      victim.hp -= damage;
      if (!victim.hp) siege.defeated += 1;
    }
    attacks.push({ index, lane, color: batch.before[index].c, power, combo, targetId: victim?.id ?? null,
      miss: !victim, damage, hpBefore, hpAfter: victim?.hp ?? 0 });
  }
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

// One enemy turn per accepted action, after all match-first/power cascades.
export function advanceSiegeTurn(siege, board, freshWave = false) {
  if (!siege || siege.complete || freshWave) return null;
  const before = siegeSnapshot(siege), boardBefore = board.map(tile => ({ ...tile }));
  const movements = [], infestations = [];
  for (const enemy of siege.targets) {
    if (!enemy.hp || enemy.kind === "castle") continue;
    const fromRow = enemy.row;
    if (enemy.kind === "ram" && !enemy.charging) {
      enemy.charging = true;
      movements.push({ id: enemy.id, fromRow, toRow: fromRow, charging: true });
      continue;
    }
    enemy.charging = false;
    const toRow = Math.min(4, fromRow + (enemy.kind === "ram" ? 2 : 1));
    movements.push({ id: enemy.id, fromRow, toRow, charging: false });
    enemy.row = toRow;
    if (toRow === 4) {
      // Preserve a playable bottom area. Never refill a partly-cleared grass row.
      const row = Array.from({ length: 6 }, (_, i) => i).find(r => board.slice(r * 9, r * 9 + 9).every(tile => !tile.grass));
      if (row !== undefined) {
        const cells = Array.from({ length: 9 }, (_, col) => row * 9 + col);
        cells.forEach(index => { board[index].grass = 1; });
        infestations.push({ id: enemy.id, row, cells });
      }
      enemy.row = 2;
    }
  }
  return movements.length ? { before, after: siegeSnapshot(siege), boardBefore,
    boardAfter: board.map(tile => ({ ...tile })), movements, infestations } : null;
}
