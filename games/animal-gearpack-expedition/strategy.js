/* Pure equipment geometry and encounter rules, shared by play and forecasting. */
(() => {
  "use strict";
  const COLS = 11;
  const ROWS = 7;
  const cellsFor = (placed, item) => item.shape.map(([x, y]) => placed.rotated
    ? [placed.x + y, placed.y + x] : [placed.x + x, placed.y + y]);

  function supplyAccess(placed, catalog) {
    const byId = new Map(catalog.map(item => [item.id, item]));
    const occupied = new Map();
    placed.forEach((entry, index) => {
      const item = byId.get(entry.id);
      if (item) cellsFor(entry, item).forEach(([x, y]) => occupied.set(`${x},${y}`, index));
    });
    const open = new Set(), blocked = new Set(), lanes = [];
    let healing = 0;
    placed.forEach((entry, index) => {
      const item = byId.get(entry.id);
      if (!item?.heal) return;
      const columns = new Map();
      cellsFor(entry, item).forEach(([x, y]) => columns.set(x, Math.min(columns.get(x) ?? ROWS, y)));
      const exits = [...columns].filter(([x, top]) => {
        if (x < 0 || x >= COLS || top < 0 || top >= ROWS) return false;
        for (let y = 0; y < top; y++) if (occupied.has(`${x},${y}`)) return false;
        return true;
      });
      if (!exits.length) { blocked.add(index); return; }
      open.add(index);
      healing += item.heal;
      const [x, top] = exits[0];
      lanes.push({ index, x, top, cells: Array.from({ length: top }, (_, y) => [x, y]) });
    });
    return { open, blocked, lanes, healing, occupied };
  }

  function traits(stats) {
    const active = new Set((stats.blueprints || []).map(value => typeof value === "string" ? value : value.id));
    return { forge: active.has("forge"), nature: active.has("nature"), caravan: active.has("caravan") };
  }

  function counterDamage(enemy, stats, run) {
    const turn = Math.max(0, run.enemyTurn || 0);
    const rage = (enemy.rage || 0) * turn;
    const phase = enemy.phase === "brace-rage" && turn % 2 === 1 ? 4 : 0;
    const isolation = (enemy.isolation || 0) * stats.isolated;
    const heat = (enemy.rowHeat || 0) * stats.topRow;
    const mimic = enemy.mimic ? Math.ceil(Math.max(stats.atk, stats.armor) / 5) : 0;
    const raw = enemy.damage + rage + phase + isolation + heat + mimic;
    return { damage: Math.max(1, raw - stats.armor), raw, rage, phase, isolation, heat, mimic };
  }

  function planStrike(enemy, stats, run) {
    const build = traits(stats);
    const number = Math.max(0, run.playerTurn || 0) + 1;
    const attack = enemy.phase === "brace-rage" && (run.enemyTurn || 0) % 2 === 0
      ? Math.max(1, Math.ceil(stats.atk / 2)) : stats.atk;
    // Overdrive is paid only when it can actually pierce a live shield. Never
    // spend the last two HP or charge for an effect with no applicable target.
    const piercing = run.approach === "overdrive" && run.enemyShield > 0 && run.armor > 2;
    const lifeCost = piercing ? 2 : 0;
    const shieldDamage = piercing ? 0 : Math.min(Math.max(0, run.enemyShield || 0), attack);
    const healthDamage = attack - shieldDamage;
    const reflected = healthDamage > 0 ? Math.max(0, enemy.reflect || 0) : 0;
    const interrupted = build.forge && number % 3 === 0;
    const defeated = healthDamage >= run.enemyHp;
    const counter = counterDamage(enemy, stats, run);
    return { number, attack, piercing, lifeCost, shieldDamage, healthDamage, reflected,
      interrupted, defeated, counterDamage: defeated || interrupted ? 0 : counter.damage,
      counter, cleanse: build.nature && stats.heal > 0 ? 2 : 0, relay: build.caravan };
  }

  function resolveCounter(enemy, stats, run, strike) {
    if (strike.interrupted) return {
      health: run.armor, damage: 0, healed: 0, cleansed: 0,
      corrosion: run.corrosion || 0, enemyTurn: (run.enemyTurn || 0) + 1,
      sealIndex: run.sealIndex || 0, interrupted: true
    };
    const damage = counterDamage(enemy, stats, run).damage;
    const healed = Math.max(0, Math.min(stats.heal, run.maxArmor - run.armor));
    const accumulated = (run.corrosion || 0) + (enemy.corrosion || 0);
    const cleansed = Math.min(accumulated, strike.cleanse);
    return { health: run.armor + healed - damage, damage, healed, cleansed,
      corrosion: accumulated - cleansed, enemyTurn: (run.enemyTurn || 0) + 1,
      sealIndex: (run.sealIndex || 0) + (enemy.rotatingSeal ? 1 : 0), interrupted: false };
  }

  globalThis.WeightPlayGearpackStrategy = Object.freeze({
    cols: COLS, rows: ROWS, cellsFor, supplyAccess, traits, counterDamage, planStrike, resolveCounter
  });
})();
