// One set of simulation constants for live combat and balance regression.
export const MAX_THREATS = 28;
export const WEAPONS = Object.freeze({
  default: { damage: 6, speed: 11, range: 300, size: 6, pierce: 1, count: 1, interval: 1 },
  'sword-rare': { damage: 10, speed: 12, range: 270, size: 17, pierce: 5, count: 1, interval: 1.2 },
  'dagger-epic': { damage: 3.2, speed: 13, range: 330, size: 7, pierce: 1, count: 3, interval: 1 },
});
export function threatVitals({ behavior, mission = 1, region = 1, room = 1, hpMultiplier = 1, speedMultiplier = 1, pursuitSpeed = 3.5, veteranPower = 1 }) {
  const heavy = ['tank', 'ward', 'regenerator', 'slower'].includes(behavior);
  const difficulty = 1 + (mission - 1) * .035 + (room - 1) * .08;
  const oldHp = (heavy ? 38 : 22) + region * 4;
  const hp = Math.round(oldHp * difficulty * hpMultiplier * 30 * veteranPower);
  const speed = behavior === 'rusher' ? Math.max(4.7, pursuitSpeed * 1.16)
    : behavior === 'orbiter' ? Math.max(4.1, pursuitSpeed * 1.08)
    : heavy ? 2.45 : 3.15;
  return { hp, speed: speed * Math.max(.96, speedMultiplier) };
}
export function reinforcementRoster(region, wave) {
  const pools = [
    ['chaser','rusher','shooter','tank','rusher','splitter'],
    ['shooter','rusher','pulser','chaser','ward','rusher'],
    ['ward','rusher','tank','splitter','shooter','rusher'],
    ['regenerator','slower','rusher','tank','shooter','rusher'],
    ['orbiter','shooter','silencer','rusher','pulser','orbiter'],
    ['ward','rusher','silencer','regenerator','orbiter','pulser'],
  ];
  const pool = pools[Math.max(0, Math.min(5, region - 1))];
  return Array.from({ length: 4 + Math.min(2, Math.floor(wave / 2)) }, (_, i) => pool[(i + wave) % pool.length]);
}
export function insideView(enemy, camera, width, height, zoom) {
  const margin = enemy.size || 24;
  return Math.abs(enemy.x - camera.x) <= width / zoom / 2 - margin
    && Math.abs(enemy.y - camera.y) <= height / zoom / 2 - margin;
}
