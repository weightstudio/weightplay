// The flat battlefield's deterministic source of truth. No renderer, DOM or save writes.
export const STEP = 1 / 60;
export const LIMITS = Object.freeze({ enemies: 64, bullets: 160, enemyProjectiles: 80, catchUpSteps: 8 });
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const finite = (n, fallback) => Number.isFinite(n) ? n : fallback;
const TYPES = Object.freeze({
  walker: { hp: 24, speed: 1.0, radius: .56, damage: 11, period: 1.35, windup: .48, points: 100 },
  runner: { hp: 18, speed: 1.85, radius: .47, damage: 8, period: 1.05, windup: .32, points: 130 },
  brute: { hp: 110, speed: .7, radius: .83, damage: 24, period: 1.9, windup: .7, points: 260 },
  bomber: { hp: 38, speed: 1.25, radius: .6, damage: 85, period: 1.2, windup: 1.2, points: 200 },
  spitter: { hp: 46, speed: .9, radius: .6, damage: 24, period: 3.4, windup: .95, points: 220 },
  boss: { hp: 240, speed: .55, radius: 1.25, damage: 65, period: 4.4, windup: 1.1, points: 1800 },
});
function rows(types, { start = .7, gap = 1.2, lanes = [-6, 0, 6], depth = -10.5, hp = 1, speed = 1 } = {}) {
  return types.map((type, i) => ({ at: start + i * gap, type, x: lanes[i % lanes.length], z: depth - (i % 2) * .35, hpScale: hp, speedScale: speed }));
}
function wave(name, spawns, options = {}) {
  return Object.freeze({ name, spawns: Object.freeze([...spawns].sort((a, b) => a.at - b.at).map(Object.freeze)), ...options });
}
function operation(id, name, subtitle, theme, waves, modifier) {
  return Object.freeze({ id, name, title: name, subtitle, theme, waves: Object.freeze(waves), modifier: Object.freeze(modifier) });
}
// Each operation introduces a different pressure and authored formation. These are
// independent defence encounters, never a claimed conversion of the old30 maps.
export const OPERATIONS = Object.freeze([
  operation('D01', '晨光守望', '先瞄準，再開火！守住三波晨光廣場。', 'sunrise', [
    wave('第一道防線', rows(['walker', 'walker', 'walker', 'walker', 'walker', 'walker'], { gap: 1.7, lanes: [-4, 4, 0] })),
    wave('草地急行軍', rows(['walker', 'runner', 'walker', 'walker', 'runner', 'walker', 'runner', 'walker'], { gap: 1.25, lanes: [-7, 7, -2, 2] })),
    wave('巨漢敲門', [...rows(['walker', 'walker', 'runner', 'walker', 'runner', 'walker'], { gap: 1.6, lanes: [-6, 6] }), { at: 3.5, type: 'boss', x: 0, z: -11 }]),
  ], { kind: 'training', label: '三波教學 · 敵人由前方進攻' }),
  operation('D02', '雙翼突襲', '左右快跑殭屍交錯，先處理最靠近主塔的敵人。', 'garden', [
    wave('分頭衝刺', rows(['runner', 'runner', 'walker', 'runner', 'walker', 'runner', 'runner', 'walker'], { gap: .95, lanes: [-9, 9] })),
    wave('中央誘餌', [...rows(['brute', 'walker', 'walker'], { gap: 2.1, lanes: [0] }), ...rows(['runner', 'runner', 'runner', 'runner', 'runner', 'runner'], { start: 2.5, gap: .85, lanes: [-8, 8] })]),
    wave('迴旋跑團', rows(['runner', 'walker', 'runner', 'runner', 'walker', 'runner', 'runner', 'runner', 'walker', 'runner'], { gap: .8, lanes: [-10, -4, 10, 4] })),
    wave('快攻隊長', [...rows(['runner', 'runner', 'walker', 'runner', 'runner', 'walker', 'runner', 'runner'], { gap: .95, lanes: [-8, 8] }), { at: 4, type: 'boss', x: 0, z: -11, hpScale: 1.35, speedScale: 1.3 }]),
  ], { kind: 'rush', label: '雙翼包抄 · 快跑者加速10%', runnerSpeed: 1.1 }),
  operation('D03', '鐵甲橋頭', '重甲擋在前方，利用爆破和強化火力拆解防線。', 'foundry', [
    wave('重甲先鋒', rows(['brute', 'walker', 'walker', 'brute', 'walker', 'walker', 'brute'], { gap: 1.3, lanes: [-5, 0, 5] })),
    wave('錯列盾牆', rows(['brute', 'runner', 'brute', 'walker', 'brute', 'runner', 'brute', 'walker'], { gap: 1.15, lanes: [-7, 7, -3, 3] })),
    wave('爆桶開道', [...rows(['brute', 'brute', 'brute', 'brute'], { gap: 2.2, lanes: [-6, 6] }), ...rows(['bomber', 'bomber', 'runner', 'bomber', 'runner'], { start: 1.7, gap: 1.45, lanes: [0, -8, 8] })]),
    wave('鋼盔總督', [...rows(['brute', 'walker', 'brute', 'runner', 'brute', 'walker'], { gap: 1.8, lanes: [-7, 7] }), { at: 2.5, type: 'boss', x: 0, z: -11, hpScale: 2.0 }]),
  ], { kind: 'armour', label: '厚甲部隊 · 重甲生命增加15%', bruteHP: 1.15 }),
  operation('D04', '酸霧水道', '噴吐者會停下蓄力，射程之外也不能放著不管。', 'canal', [
    wave('遠方的綠光', rows(['spitter', 'walker', 'spitter', 'walker', 'runner', 'spitter', 'walker'], { gap: 1.5, lanes: [-7, 7, 0] })),
    wave('兩岸火網', rows(['spitter', 'spitter', 'runner', 'runner', 'spitter', 'walker', 'spitter', 'runner'], { gap: 1.15, lanes: [-10, 10, -4, 4] })),
    wave('緩慢掩護', [...rows(['brute', 'brute', 'brute'], { gap: 2.7, lanes: [-4, 4, 0] }), ...rows(['spitter', 'spitter', 'spitter', 'runner', 'spitter', 'runner'], { start: 1.5, gap: 1.25, lanes: [-8, 8] })]),
    wave('密集酸雨', rows(['runner', 'spitter', 'spitter', 'bomber', 'spitter', 'runner', 'spitter', 'bomber', 'runner', 'spitter'], { gap: .95, lanes: [-9, 9, 0] })),
    wave('水道巨影', [...rows(['spitter', 'runner', 'spitter', 'brute', 'spitter', 'runner', 'spitter'], { gap: 1.6, lanes: [-9, 9] }), { at: 3, type: 'boss', x: 0, z: -11, hpScale: 2.1 }]),
  ], { kind: 'acid', label: '酸液火網 · 噴吐蓄力縮短15%', spitterPeriod: .85 }),
  operation('D05', '爆桶夜市', '爆桶手靠近主塔會引爆；提早擊破可以連鎖清場。', 'market', [
    wave('易燃物登場', rows(['bomber', 'walker', 'walker', 'bomber', 'runner', 'walker', 'bomber', 'walker'], { gap: 1.2, lanes: [-5, 0, 5] })),
    wave('炸桶縱隊', rows(['bomber', 'bomber', 'runner', 'bomber', 'walker', 'bomber', 'runner', 'bomber', 'walker'], { gap: .95, lanes: [-7, 7, -2, 2] })),
    wave('重甲貨運', [...rows(['brute', 'brute', 'brute', 'brute'], { gap: 2.4, lanes: [-5, 5] }), ...rows(['bomber', 'bomber', 'bomber', 'bomber', 'runner', 'runner'], { start: 1.4, gap: 1.1, lanes: [-6, 6] })]),
    wave('煙火混戰', rows(['bomber', 'spitter', 'runner', 'bomber', 'spitter', 'brute', 'bomber', 'runner', 'bomber', 'spitter', 'runner'], { gap: .9, lanes: [-9, 0, 9] })),
    wave('爆破領班', [...rows(['bomber', 'runner', 'bomber', 'brute', 'bomber', 'runner', 'bomber', 'spitter'], { gap: 1.2, lanes: [-8, 8] }), { at: 2, type: 'boss', x: 0, z: -11, hpScale: 2.5 }]),
  ], { kind: 'volatile', label: '爆桶連鎖 · 擊敗爆桶手波及附近敵人', chainRadius: 3.1 }),
  operation('D06', '最後的曙光', '六波混合攻勢，最後擊破會召喚援軍的巨型殭屍。', 'citadel', [
    wave('三路試探', rows(['walker', 'runner', 'brute', 'walker', 'runner', 'spitter', 'walker', 'bomber', 'runner'], { gap: 1, lanes: [-9, 0, 9] })),
    wave('先快後重', [...rows(['runner', 'runner', 'runner', 'runner', 'runner', 'runner'], { gap: .65, lanes: [-8, 8] }), ...rows(['brute', 'spitter', 'brute', 'spitter'], { start: 4, gap: 1.5, lanes: [-5, 5] })]),
    wave('酸桶交錯', rows(['bomber', 'spitter', 'runner', 'spitter', 'bomber', 'brute', 'spitter', 'runner', 'bomber', 'runner'], { gap: .95, lanes: [-8, 8, 0] })),
    wave('鐵甲急行', rows(['brute', 'runner', 'runner', 'brute', 'runner', 'bomber', 'brute', 'spitter', 'runner', 'brute'], { gap: 1.05, lanes: [-9, 9, -3, 3] })),
    wave('總攻前夕', rows(['spitter', 'bomber', 'runner', 'brute', 'runner', 'spitter', 'bomber', 'runner', 'brute', 'spitter', 'bomber', 'runner'], { gap: .8, lanes: [-10, 0, 10] })),
    wave('破曉巨王', [...rows(['brute', 'spitter', 'runner', 'bomber', 'spitter', 'runner', 'brute', 'bomber'], { gap: 1.4, lanes: [-8, 8] }), { at: 2, type: 'boss', x: 0, z: -11, hpScale: 3.1, speedScale: .85 }], { summon: true }),
  ], { kind: 'siege', label: '最終圍城 · 巨王蓄力時呼叫援軍', bossSummons: true }),
]);

export const UPGRADE_INFO = Object.freeze({
  power: Object.freeze({ id: 'power', name: '高能彈匣', description: '每發傷害 +25% · 爆破威力 +15%' }),
  rapid: Object.freeze({ id: 'rapid', name: '極速槍管', description: '連射速度 +20%' }),
  spread: Object.freeze({ id: 'spread', name: '扇形火網', description: '增加兩發側彈，拓寬防線' }),
  repair: Object.freeze({ id: 'repair', name: '緊急修復', description: '恢復主塔30%生命，增加5%最大生命' }),
});

// First intersection in [0,1]; never treats the infinite line as a hit.
export function segmentCircle(ax, az, bx, bz, cx, cz, radius) {
  const dx = bx - ax, dz = bz - az, ox = ax - cx, oz = az - cz;
  const a = dx * dx + dz * dz, c = ox * ox + oz * oz - radius * radius;
  if (c <= 0) return 0;
  if (a < 1e-12) return null;
  const b = 2 * (ox * dx + oz * dz), discriminant = b * b - 4 * a * c;
  if (discriminant < 0) return null;
  const t = (-b - Math.sqrt(discriminant)) / (2 * a);
  return t >= 0 && t <= 1 ? t : null;
}

export class DefenseRun {
  constructor({ operation: selected = 0, assist = false } = {}) {
    const index = typeof selected === 'string' ? OPERATIONS.findIndex(o => o.id === selected) : selected;
    if (!Number.isInteger(index) || !OPERATIONS[index]) throw new RangeError('Unknown defence operation');
    this.operation = OPERATIONS[index]; this.operationIndex = index; this.assist = Boolean(assist);
    this.state = 'playing'; this.maxHP = this.assist ? 1400 : 1000; this.towerHP = this.maxHP;
    this.wave = 1; this.totalWaves = this.operation.waves.length; this.time = 0; this.waveTime = -1;
    this.score = 0; this.kills = 0; this.shots = 0; this.hits = 0;
    this.enemies = []; this.bullets = []; this.enemyProjectiles = []; this.events = [];
    this.weapon = { damage: 30, rate: 6, spread: 0, blastDamage: 95, blastRadius: 4.2 };
    this.upgrades = { power: 0, rapid: 0, spread: 0, repair: 0 }; this.upgradeOptions = [];
    this.blastCooldown = 0; this.fireCooldown = 0; this.accumulator = 0; this.steps = 0;
    this.nextSpawn = 0; this.nextId = 1; this.pendingBlast = false; this.blastHeld = false;
    this.aim = { x: 0, z: -2 }; this.result = null;
    this.emit('wave-start', { wave: 1, name: this.currentWave.name });
  }
  get currentWave() { return this.operation.waves[this.wave - 1]; }
  get remainingSpawns() { return this.currentWave.spawns.length - this.nextSpawn; }
  get blastReady() { return this.blastCooldown <= 0 && this.state === 'playing'; }
  emit(type, details = {}) { this.events.push({ type, time: this.time, ...details }); }
  drainEvents() { const result = this.events; this.events = []; return result; }
  chooseUpgrade(id) {
    if (this.state !== 'upgrade' || !this.upgradeOptions.includes(id)) return false;
    this.upgrades[id]++;
    if (id === 'power') { this.weapon.damage *= 1.25; this.weapon.blastDamage *= 1.15; }
    if (id === 'rapid') this.weapon.rate = Math.min(14, this.weapon.rate * 1.2);
    if (id === 'spread') this.weapon.spread = Math.min(3, this.weapon.spread + 1);
    if (id === 'repair') { this.maxHP = Math.round(this.maxHP * 1.05); this.towerHP = Math.min(this.maxHP, this.towerHP + Math.round(this.maxHP * .3)); }
    this.emit('upgrade', { id, wave: this.wave });
    this.wave++; this.waveTime = -1.5; this.nextSpawn = 0; this.state = 'playing';
    this.fireCooldown = 0; this.blastCooldown = Math.max(0, this.blastCooldown - 2); this.accumulator = 0;
    this.upgradeOptions = []; this.blastHeld = false; this.pendingBlast = false;
    this.emit('wave-start', { wave: this.wave, name: this.currentWave.name });
    return true;
  }
  advance(delta, input = {}) {
    if (this.state !== 'playing') { this.accumulator = 0; this.blastHeld = Boolean(input.blast); return 0; }
    this.aim.x = clamp(finite(input.aimX, this.aim.x), -12, 12);
    this.aim.z = clamp(finite(input.aimZ, this.aim.z), -12, 9);
    if (input.blast && !this.blastHeld) this.pendingBlast = true;
    this.blastHeld = Boolean(input.blast);
    const dt = clamp(finite(delta, 0), 0, STEP * LIMITS.catchUpSteps);
    this.accumulator = Math.min(this.accumulator + dt, STEP * LIMITS.catchUpSteps);
    let count = 0;
    while (this.accumulator + 1e-10 >= STEP && count < LIMITS.catchUpSteps && this.state === 'playing') {
      this.step(STEP, Boolean(input.firing)); this.accumulator = Math.max(0, this.accumulator - STEP); count++;
    }
    if (this.state !== 'playing') this.accumulator = 0;
    return count;
  }
  step(dt, firing) {
    this.steps++; this.time += dt; this.waveTime += dt;
    this.fireCooldown = Math.max(0, this.fireCooldown - dt); this.blastCooldown = Math.max(0, this.blastCooldown - dt);
    if (this.pendingBlast) { this.pendingBlast = false; this.useBlast(); }
    const spawns = this.currentWave.spawns;
    while (this.nextSpawn < spawns.length && spawns[this.nextSpawn].at <= this.waveTime && this.enemies.length < LIMITS.enemies) {
      this.spawn(spawns[this.nextSpawn++]);
    }
    if (firing && this.fireCooldown <= 1e-9) this.fire();
    this.moveBullets(dt);
    for (const e of this.enemies) if (e.hp > 0) this.updateEnemy(e, dt);
    this.moveEnemyProjectiles(dt);
    this.enemies = this.enemies.filter(e => e.hp > 0);
    if (this.state === 'playing' && this.nextSpawn === spawns.length && this.enemies.length === 0 && this.enemyProjectiles.length === 0) this.clearWave();
  }
  spawn(spec) {
    const type = TYPES[spec.type] ? spec.type : 'walker', data = TYPES[type], mod = this.operation.modifier;
    const hp = data.hp * (spec.hpScale || 1) * (type === 'brute' ? mod.bruteHP || 1 : 1);
    const enemy = {
      id: this.nextId++, type, x: spec.x, z: spec.z, px: spec.x, pz: spec.z,
      hp, maxHP: hp, radius: data.radius, speed: data.speed * (spec.speedScale || 1) * (type === 'runner' ? mod.runnerSpeed || 1 : 1),
      age: 0, hit: 0, attack: 0, warning: false, attackTimer: data.period,
      bossTimer: 5, summons: 0, armour: type === 'brute' ? .75 : 1,
    };
    this.enemies.push(enemy); this.emit('spawn', { id: enemy.id, enemyType: type, x: enemy.x, z: enemy.z });
    return enemy;
  }
  fire() {
    if (this.bullets.length >= LIMITS.bullets) return;
    const dx = this.aim.x, dz = this.aim.z - 7.9, length = Math.hypot(dx, dz);
    if (length < .15) return;
    const angle = Math.atan2(dx, dz), spread = this.weapon.spread;
    const offsets = [0];
    for (let i = 1; i <= spread; i++) offsets.push(i * .075, -i * .075);
    for (const offset of offsets) {
      if (this.bullets.length >= LIMITS.bullets) break;
      this.bullets.push({ id: this.nextId++, x: 0, z: 7.9, px: 0, pz: 7.9, startX: 0, startZ: 7.9, aimX: this.aim.x, aimZ: this.aim.z, travel: 0, vx: Math.sin(angle + offset) * 46, vz: Math.cos(angle + offset) * 46, life: 1.1, damage: this.weapon.damage * (offset ? .7 : 1), side: offset !== 0 });
    }
    this.shots++; this.fireCooldown = 1 / this.weapon.rate;
    this.emit('shot', { x: 0, z: 7.9, aimX: this.aim.x, aimZ: this.aim.z, angle, count: offsets.length });
  }
  moveBullets(dt) {
    const alive = [];
    for (const b of this.bullets) {
      b.px = b.x; b.pz = b.z; b.x += b.vx * dt; b.z += b.vz * dt; b.travel += Math.hypot(b.vx, b.vz) * dt; b.life -= dt;
      let closest = null, fraction = Infinity;
      for (const e of this.enemies) {
        if (e.hp <= 0) continue;
        const t = segmentCircle(b.px, b.pz, b.x, b.z, e.x, e.z, e.radius + .14);
        if (t !== null && t < fraction) { closest = e; fraction = t; }
      }
      if (closest) {
        const x = b.px + (b.x - b.px) * fraction, z = b.pz + (b.z - b.pz) * fraction;
        this.hits++; this.damageEnemy(closest, b.damage, 'shot', x, z);
        for (const e of this.enemies) if (e !== closest && e.hp > 0 && Math.hypot(e.x - x, e.z - z) < .95 + e.radius * .25) this.damageEnemy(e, b.damage * .35, 'splash', x, z);
      } else if (b.life > 0 && Math.abs(b.x) < 15 && b.z > -15 && b.z < 13) alive.push(b);
    }
    this.bullets = alive;
  }
  useBlast() {
    if (!this.blastReady) return false;
    this.blastCooldown = 8;
    this.emit('blast', { x: this.aim.x, z: this.aim.z, radius: this.weapon.blastRadius, damage: this.weapon.blastDamage });
    for (const e of [...this.enemies]) if (e.hp > 0 && Math.hypot(e.x - this.aim.x, e.z - this.aim.z) <= this.weapon.blastRadius + e.radius) this.damageEnemy(e, this.weapon.blastDamage, 'blast', e.x, e.z);
    this.enemyProjectiles = this.enemyProjectiles.filter(p => Math.hypot(p.x - this.aim.x, p.z - this.aim.z) > this.weapon.blastRadius);
    return true;
  }
  damageEnemy(e, damage, source, x = e.x, z = e.z) {
    if (e.hp <= 0 || this.state !== 'playing') return 0;
    const applied = Math.min(e.hp, damage * (source === 'shot' || source === 'splash' ? e.armour : 1));
    e.hp = Math.max(0, e.hp - applied); e.hit = .16;
    if (e.type !== 'boss' && e.type !== 'brute') e.z -= .1;
    this.emit('hit', { id: e.id, enemyType: e.type, x, z, damage: applied, hp: e.hp, maxHP: e.maxHP, source, armoured: e.armour < 1 && source === 'shot' });
    if (e.hp === 0) {
      this.kills++; this.score += TYPES[e.type].points;
      this.emit('kill', { id: e.id, enemyType: e.type, x: e.x, z: e.z, score: TYPES[e.type].points, source });
      if (e.type === 'bomber') {
        const radius = this.operation.modifier.chainRadius || 2.5;
        this.emit('chain', { x: e.x, z: e.z, radius, damage: 45 });
        for (const target of [...this.enemies]) if (target !== e && target.hp > 0 && Math.hypot(target.x - e.x, target.z - e.z) < radius) this.damageEnemy(target, 45, 'chain', target.x, target.z);
      }
    }
    return applied;
  }
  updateEnemy(e, dt) {
    e.px = e.x; e.pz = e.z; e.age += dt; e.hit = Math.max(0, e.hit - dt);
    const data = TYPES[e.type], dx = -e.x, dz = 9 - e.z, distance = Math.hypot(dx, dz);
    const range = e.type === 'spitter' ? 10 : e.type === 'boss' ? 7 : 2.25;
    e.attack = 0;
    if (distance > range) {
      const speed = e.speed * (e.hit > 0 ? .5 : 1), step = Math.min(distance - range, speed * dt);
      e.x += dx / distance * step; e.z += dz / distance * step;
      e.attackTimer = Math.min(e.attackTimer, data.period); e.warning = false;
    } else {
      const periodScale = e.type === 'spitter' ? this.operation.modifier.spitterPeriod || 1 : 1;
      e.attackTimer -= dt;
      if (e.attackTimer <= data.windup && !e.warning) {
        e.warning = true; this.emit(e.type === 'boss' ? 'boss-warning' : 'enemy-warning', { id: e.id, enemyType: e.type, x: e.x, z: e.z, duration: data.windup, damage: data.damage });
        if (e.type === 'boss' && this.currentWave.summon && e.summons < 5) {
          e.summons++;
          for (const sign of [-1, 1]) if (this.enemies.length < LIMITS.enemies) this.spawn({ type: 'runner', x: clamp(e.x + sign * 2.4, -11, 11), z: e.z - 1.4 });
        }
      }
      if (e.warning) e.attack = 1 - Math.max(0, e.attackTimer) / data.windup;
      if (e.attackTimer <= 0) {
        if (e.type === 'spitter') this.spit(e, data.damage);
        else {
          this.damageTower(data.damage, e.type, e.x, e.z);
          if (e.type === 'bomber') { e.hp = 0; this.emit('detonate', { id: e.id, enemyType: e.type, x: e.x, z: e.z, damage: data.damage, radius: 2.5 }); }
        }
        e.attackTimer = data.period * periodScale; e.warning = false;
      }
    }
  }
  spit(e, damage) {
    if (this.enemyProjectiles.length >= LIMITS.enemyProjectiles) return;
    const dx = -e.x, dz = 9 - e.z, d = Math.hypot(dx, dz);
    const projectile = { id: this.nextId++, x: e.x, z: e.z, px: e.x, pz: e.z, vx: dx / d * 8, vz: dz / d * 8, damage, source: e.type, life: 4 };
    this.enemyProjectiles.push(projectile); this.emit('projectile', { id: projectile.id, x: e.x, z: e.z, damage });
  }
  moveEnemyProjectiles(dt) {
    const alive = [];
    for (const p of this.enemyProjectiles) {
      p.px = p.x; p.pz = p.z; p.x += p.vx * dt; p.z += p.vz * dt; p.life -= dt;
      if (segmentCircle(p.px, p.pz, p.x, p.z, 0, 9, 1.7) !== null) this.damageTower(p.damage, p.source, p.x, p.z);
      else if (p.life > 0) alive.push(p);
    }
    this.enemyProjectiles = alive;
  }
  damageTower(damage, source, x, z) {
    if (this.state !== 'playing') return;
    const applied = Math.min(this.towerHP, damage); this.towerHP -= applied;
    this.emit('tower-hit', { x, z, damage: applied, hp: this.towerHP, source });
    if (this.towerHP <= 0) this.finish('lost');
  }
  clearWave() {
    this.bullets = []; this.emit('wave-clear', { wave: this.wave, score: this.score, hp: this.towerHP });
    if (this.wave === this.totalWaves) this.finish('won');
    else {
      this.state = 'upgrade'; this.fireCooldown = 0;
      const choices = this.wave % 2 === 1 ? ['power', 'rapid', 'repair'] : ['spread', 'power', 'repair'];
      this.upgradeOptions = choices.filter(id => id !== 'spread' || this.weapon.spread < 3);
      if (this.upgradeOptions.length < 3) this.upgradeOptions.unshift('rapid');
    }
  }
  finish(state) {
    if (this.state === 'won' || this.state === 'lost') return;
    this.state = state; this.accumulator = 0; this.pendingBlast = false;
    this.result = Object.freeze({ state, operationId: this.operation.id, score: this.score, kills: this.kills, time: this.time, towerHP: this.towerHP, maxHP: this.maxHP, shots: this.shots, hits: this.hits, mode: this.assist ? 'assist' : 'standard' });
    this.emit(state === 'won' ? 'victory' : 'defeat', { ...this.result });
  }
}
