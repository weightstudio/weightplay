/* Pure tactical rules, shared by the rendered game and deterministic fixtures. */
(() => {
  const distance = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  function plan(enemy, heroes, enemies, canOccupy) {
    const living = heroes.filter(h => h.hp > 0);
    const weak = ['raven', 'runeFox', 'sealRaven'].includes(enemy.id);
    const target = [...living].sort((a, b) =>
      (weak ? a.hp / a.maxHp - b.hp / b.maxHp : 0) || distance(enemy, a) - distance(enemy, b))[0];
    if (!target) return null;
    const origin = {x: enemy.x, y: enemy.y};
    const cell = {x: target.x, y: target.y};
    const pack = enemy.id === 'wolf' && enemies.some(e => e !== enemy && e.hp > 0 && e.id === 'wolf' && distance(e, enemy) === 1);
    const base = {origin, cell, targetId:target.id, tracking:(enemy.range || 1)>1, damage: enemy.atk + (pack ? 1 : 0), repeats: 1 + Math.min(1, enemy.extraActions || 0)};
    if (enemy.id === 'tideTurtle' && enemies.some(e => e !== enemy && e.hp > 0 && !e.allyGuard)) return {...base, kind: 'support'};
    if (enemy.id === 'mirrorWolf' && !enemy.cloneMade && !enemy.isClone) return {...base, kind: 'support'};
    if (['ram', 'rhinoBoss'].includes(enemy.id) && (enemy.x === target.x || enemy.y === target.y)) {
      const dx = Math.sign(target.x - enemy.x), dy = Math.sign(target.y - enemy.y);
      let x = enemy.x + dx, y = enemy.y + dy;
      while ((x !== target.x || y !== target.y) && canOccupy(x, y, enemy)) { x += dx; y += dy; }
      if (x === target.x && y === target.y) return {...base, kind: 'charge', damage: base.damage + 1};
    }
    return {...base, kind: distance(enemy, target) <= (enemy.range || 1) ? 'strike' : 'advance'};
  }
  function pushCell(actor, target) {
    const dx = target.x - actor.x, dy = target.y - actor.y;
    return Math.abs(dx) >= Math.abs(dy)
      ? {x: target.x + Math.sign(dx), y: target.y}
      : {x: target.x, y: target.y + Math.sign(dy)};
  }
  function runeBonus(hero, enemy) { return enemy.runeMark && hero.id !== 'owl' ? 2 : 0; }
  function incoming(amount, guarded, marked, ranged) {
    return Math.max(0, amount + (marked && ranged ? 1 : 0) - (guarded ? 2 : 0));
  }
  function deployment(profile, mission) {
    const chapter = Math.ceil(mission / 5);
    return { levelCap: Math.min(6, chapter + 1), attack: Math.min(profile.bonusAtk || 0, Math.ceil(chapter / 2)), health: Math.min(profile.bonusHp || 0, chapter + 2), energy: Math.min(profile.bonusEnergy || 0, 1) + (profile.training ? 1 : 0) };
  }
  function enemyStats(base, mission) {
    const chapter = Math.ceil(mission / 5);
    return { hp: base.bossKit ? base.hp + 12 + chapter * 3 : base.hp + 3 + chapter, atk: base.atk + Math.floor(chapter / 3) };
  }
  globalThis.WeightPlayRuneTacticsCombat = Object.freeze({plan, pushCell, runeBonus, incoming, deployment, enemyStats});
})();
