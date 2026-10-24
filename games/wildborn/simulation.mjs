import { ORIGINS, LINEAGES, FAUNA, FOOD, SPECIES, evolutionThreshold, nextSpecies, combatTraits, LIMITS, STEP, rng, hash, habitat, coverAt, treeAt } from './content.mjs';

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const distance = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
const angleDifference = (a, b) => Math.atan2(Math.sin(a - b), Math.cos(a - b));

export function createLife(seed = Date.now(), options = {}) {
  const random = rng(seed);
  const draw = ORIGINS[Math.floor(random() * ORIGINS.length)];
  const origin = ORIGINS.includes(options.origin) ? options.origin : draw;
  const base = LINEAGES[origin];
  const legacy = {hp:finite(options.legacy?.hp,0,1e8),power:finite(options.legacy?.power,0,1e7)};
  const state = {
    seed: seed >>> 0, id:options.id || `life-${seed >>> 0}`, random, time: 0, status: 'alive', cause: '',
    player: { x: 0, z: 0, angle: Math.PI, origin, species:origin, form: 0, growth: 0, maturity: 0, legacy,
      hp: base.hp+legacy.hp, maxHp: base.hp+legacy.hp, hunger: 100, stamina: 100, power: .8+legacy.power, size: .75,
      speed: base.speed, radius: .34, invulnerable: 0, attack: 0, attackDone: false, cooldown: 0,
      dash: 0, dashCooldown: 0, moving: false, hidden: false, water: false, adaptation: null,
      habitats: { water: 0, cover: 0, open: 0 }, kills: 0, eaten: 0, travel: 0, damage: 0 },
    fauna: [], food: [], events: [], eventId: 0, nextId: 0, spawnTimer: 0,
    visited: new Set(['meadow']), consumed: new Map(), foodCell: '', lowHunger: false, lowHp: false,
  };
  replenishFood(state, true);
  for (let i = 0; i < 26; i++) spawnFauna(state, true);
  event(state, 'birth', state.player, { origin });
  return state;
}

function event(s, type, actor, extra = {}) {
  s.events.push({ id: ++s.eventId, type, x: actor.x, z: actor.z, time: s.time, ...extra });
  if (s.events.length > LIMITS.events) s.events.splice(0, s.events.length - LIMITS.events);
}

export function powerFor(p) { return .8 + p.form * 1.55 + (p.legacy?.power || 0); }
export function growthProgress(p) {
  const previous=evolutionThreshold(p.form), next=evolutionThreshold(p.form+1);
  return clamp((p.growth-previous)/(next-previous),0,1);
}

function evolve(s) {
  const p = s.player;
  if(p.growth < evolutionThreshold(p.form+1))return;
  const from=p.species;
  // A bounded number per tick still lets extreme accumulated growth settle over
  // subsequent fixed steps, without an unbounded single-frame loop.
  let count=0;
  while(p.growth >= evolutionThreshold(p.form+1) && count++<8){p.species=nextSpecies(p.species,s.random);p.form++;}
  p.maturity=Math.max(0,p.form-3);
  if (!p.adaptation) {
    const h = p.habitats;
    p.adaptation = h.water > h.cover && h.water > h.open * .16 ? 'aquatic' : h.cover > h.open * .16 ? 'camouflage' : 'swift';
  }
  const previousMax = p.maxHp;
  p.maxHp = LINEAGES[p.origin].hp + p.form * 32 + p.legacy.hp;
  p.hp = Math.min(p.maxHp, p.hp + p.maxHp - previousMax + 12);
  p.power = powerFor(p);
  p.radius = Math.min(.94,.34 + p.form * .075);
  event(s, 'evolution', p, { from, species:p.species, form:p.form, adaptation:p.adaptation });
}

function replenishFood(s, initial = false) {
  const p = s.player, cx = Math.round(p.x / 4.8), cz = Math.round(p.z / 4.8);
  const cell = `${cx},${cz},${Math.floor(s.time / 8)}`;
  if (!initial && s.foodCell === cell) return;
  s.foodCell = cell;
  s.food = s.food.filter(f => distance(f, p) < 32 && !f.consumed);
  const existing = new Set(s.food.map(f => f.id));
  if (initial) {
    for (let i = 0; i < 8; i++) {
      const a = i * 2.399;
      s.food.push({ id: `first-${i}`, x: Math.cos(a) * (1.9 + i * .75), z: Math.sin(a) * (1.9 + i * .75), kind: i % 3 ? 'seed' : 'berry' });
    }
  }
  for (let r = 0; r <= 6 && s.food.length < LIMITS.food; r++) {
    for (let gx = cx - r; gx <= cx + r && s.food.length < LIMITS.food; gx++) {
      for (let gz = cz - r; gz <= cz + r && s.food.length < LIMITS.food; gz++) {
        if (r && Math.abs(gx - cx) !== r && Math.abs(gz - cz) !== r) continue;
        const id = `f${gx},${gz}`, n = hash(gx, gz, s.seed + 130);
        if (n > .7 || existing.has(id) || (s.consumed.get(id) ?? -1) > s.time) continue;
        const x = gx * 4.8 + (hash(gx, gz, s.seed + 112) - .5) * 3;
        const z = gz * 4.8 + (hash(gx, gz, s.seed + 113) - .5) * 3;
        const biome = habitat(x, z);
        const kind = biome === 'water' || biome === 'marsh' ? 'insect' : biome === 'forest' ? n < .33 ? 'mushroom' : 'berry' : n < .35 ? 'seed' : 'berry';
        s.food.push({ id, x, z, kind }); existing.add(id);
      }
    }
  }
  while (s.consumed.size > LIMITS.memory) s.consumed.delete(s.consumed.keys().next().value);
}

function spawnFauna(s, initial = false) {
  const p = s.player, r = s.random;
  const names = ['beetle','mouse','chick','rabbit','mantis','fox',...(s.time>70||p.form>=2?['boar','wolf']:[]),...(p.form>=4?['raptor','mammoth']:[]),...(p.form>=7?['tyrannosaur','wyvern']:[]),...(p.form>=10?['giant']:[])];
  let kind = names[Math.floor(r() * names.length)];
  // The initial woodland contains readable predators, but no contact at birth.
  if (initial && s.fauna.length === 0) kind = 'beetle';
  const def = FAUNA[kind], angle = r() * Math.PI * 2;
  const d = initial && s.fauna.length === 0 ? 3.8 : (def.prey ? 6 : 12) + r() * 13;
  const growth = 1 + Math.min(1.4,Math.max(0,s.time-180)/800) + Math.max(0,p.form-12)*.10;
  s.fauna.push({ id: ++s.nextId, kind, x: p.x + Math.sin(angle) * d, z: p.z + Math.cos(angle) * d,
    angle: r() * Math.PI * 2, power: def.power * growth, hp: def.hp * growth, maxHp: def.hp * growth,
    speed: def.speed, state: 'wander', timer: r() * 3, attack: 0, cooldown: 1, hit: 0,
    targetX: 0, targetZ: 0, dead: false, noticed: false, radius: Math.min(1.1,.28 + def.power * .055) });
}

function moveActor(s, a, dx, dz) {
  let nx = a.x + dx, nz = a.z + dz;
  const cx = Math.round(nx / 7), cz = Math.round(nz / 7);
  for (let x = cx - 1; x <= cx + 1; x++) for (let z = cz - 1; z <= cz + 1; z++) {
    const t = treeAt(x, z, s.seed); if (!t) continue;
    const ox = nx - t.x, oz = nz - t.z, d = Math.hypot(ox, oz), min = t.radius + a.radius;
    if (d < min) { nx = t.x + (ox / (d || 1)) * min; nz = t.z + (oz / (d || 1)) * min; }
  }
  a.x = nx; a.z = nz;
}

function damagePlayer(s, amount, cause, attacker) {
  const p = s.player;
  if (p.invulnerable > 0 || s.status !== 'alive') return;
  const resistance = combatTraits(p).armor;
  const applied = Math.min(p.hp,Math.max(1, Math.round(amount * resistance)));
  p.hp = Math.max(0, p.hp - applied); p.invulnerable = .8; p.damage++;
  event(s, 'hurt', p, { amount: applied, cause });
  if (attacker) {
    const d = Math.max(.1, distance(p, attacker));
    moveActor(s, p, (p.x - attacker.x) / d * .55, (p.z - attacker.z) / d * .55);
  }
  if (p.hp <= 0) { s.status = 'dead'; s.cause = cause; p.moving = false; event(s, 'death', p, { cause }); }
}

function strike(s) {
  const p = s.player;
  const traits=combatTraits(p),reach=traits.reach;
  if(traits.breath)event(s,'breath',p,{angle:p.angle,reach});
  let hit = false;
  for (const a of s.fauna) {
    if (a.dead || distance(p, a) > reach + a.radius) continue;
    const angle = Math.atan2(a.x - p.x, a.z - p.z);
    if (Math.abs(angleDifference(angle, p.angle)) > traits.cone) continue;
    const heavy = p.form >= 2 && p.dash > 0;
    const amount = Math.min(a.hp,Math.round((10 + p.power * 6) * (heavy ? 1.5 : 1)));
    a.hp = Math.max(0, a.hp - amount); a.hit = .28;
    const d = Math.max(.1, distance(p, a));
    moveActor(s, a, (a.x - p.x) / d * .7, (a.z - p.z) / d * .7);
    event(s, 'hit', a, { amount, heavy, breath:traits.breath, actor: a.id }); hit = true;
    if (!a.hp) {
      a.dead = true; p.kills++;
      p.growth += 7 + a.power * 3; evolve(s);
      event(s, 'defeat', a, { actor: a.id, kind: a.kind });
      if (s.food.length < LIMITS.food) s.food.push({ id: `loot${a.id}`, x: a.x, z: a.z, kind: 'feast' });
    }
  }
  if (!hit) event(s, 'miss', p);
}

function updateFauna(s, dt) {
  const p = s.player;
  const night = Math.sin(s.time / 240 * Math.PI * 2 + .6) < -.35;
  for (const a of s.fauna) {
    if (a.dead) continue;
    a.cooldown = Math.max(0, a.cooldown - dt); a.hit = Math.max(0, a.hit - dt);
    const d = distance(a, p), def = FAUNA[a.kind], playerPrey = a.power > p.power * .8 && !def.prey;
    const canSee = !p.hidden && (!p.water || a.kind === 'mantis') && d < (night ? 9 : 7.5);
    if (a.state === 'windup') {
      a.attack -= dt;
      if (a.attack <= 0) { a.state = 'lunge'; a.attack = .24; }
    } else if (a.state === 'lunge') {
      a.attack -= dt;
      moveActor(s, a, Math.sin(a.angle) * 6.4 * dt, Math.cos(a.angle) * 6.4 * dt);
      if (distance(a, p) < p.radius + a.radius + .25 && s.time > 7) damagePlayer(s, 10 + a.power * 6, a.kind, a);
      if (a.attack <= 0) { a.state = 'recover'; a.attack = .55; a.cooldown = 1.15; }
    } else if (a.state === 'recover') {
      a.attack -= dt; if (a.attack <= 0) a.state = 'wander';
    } else {
      let speed = a.speed;
      if (d < 6 && (def.prey || p.power > a.power * 1.6)) {
        a.state = 'flee'; a.angle = Math.atan2(a.x - p.x, a.z - p.z); speed *= 1.12;
      } else if (playerPrey && canSee && s.time > 7) {
        a.state = 'chase'; a.angle = Math.atan2(p.x - a.x, p.z - a.z);
        if (!a.noticed) { event(s, 'noticed', a, { actor: a.id }); a.noticed = true; }
        if (d < 2.0 && a.cooldown <= 0) { a.state = 'windup'; a.attack = .52; event(s, 'windup', a, { actor: a.id }); speed = 0; }
      } else {
        a.state = 'wander'; a.noticed = false; a.timer -= dt; speed *= .38;
        if (a.timer <= 0) { a.timer = 1 + s.random() * 4; a.angle += (s.random() - .5) * 2.5; }
        // Predators occasionally pursue smaller fauna, showing the food chain.
        if (!def.prey && Math.floor(s.time * .5 + a.id) % 7 === 0) {
          const prey = s.fauna.find(b => !b.dead && b !== a && FAUNA[b.kind].prey && distance(a, b) < 3.8);
          if (prey) {
            a.angle = Math.atan2(prey.x - a.x, prey.z - a.z); speed = a.speed * .8;
            if (distance(a, prey) < .55 && a.cooldown === 0) {
              prey.hp -= 8; prey.hit = .2; a.cooldown = 1;
              event(s, 'ecology', prey, { actor: prey.id });
              if (prey.hp <= 0) { prey.dead = true; event(s, 'faunaExit', prey, { actor: prey.id }); }
            }
          }
        }
      }
      if (habitat(a.x, a.z) === 'water') speed *= a.kind === 'mantis' ? .8 : .38;
      if (a.hit > 0) speed *= .3;
      moveActor(s, a, Math.sin(a.angle) * speed * dt, Math.cos(a.angle) * speed * dt);
    }
  }
  s.fauna = s.fauna.filter(a => !a.dead && distance(a, p) < 38);
  s.spawnTimer -= dt;
  if (s.spawnTimer <= 0) {
    s.spawnTimer = .7;
    if (s.fauna.length < LIMITS.fauna) spawnFauna(s);
  }
}

export function step(s, input = {}, dt = STEP) {
  if (s.status !== 'alive' || !Number.isFinite(dt) || dt <= 0) return;
  dt = Math.min(STEP, dt); // Call fixed steps; never apply wall-clock catch-up.
  s.time += dt;
  const p = s.player, def = LINEAGES[p.origin];
  const x = Number.isFinite(input.x) ? input.x : 0, z = Number.isFinite(input.z) ? input.z : 0;
  const length = Math.hypot(x, z), magnitude = Math.min(1, length), mx = length ? x / Math.max(1, length) : 0, mz = length ? z / Math.max(1, length) : 0;
  p.moving = magnitude > .08;
  if (p.moving) p.angle = Math.atan2(mx, mz);
  p.cooldown = Math.max(0, p.cooldown - dt); p.dashCooldown = Math.max(0, p.dashCooldown - dt); p.invulnerable = Math.max(0, p.invulnerable - dt);
  p.dash = Math.max(0, p.dash - dt);
  if (input.attack && p.cooldown <= 0) { p.attack = .34; p.attackDone = false; p.cooldown = .65; event(s, 'attack', p, {angle:p.angle,reach:combatTraits(p).reach}); }
  if (input.dash && p.dashCooldown <= 0 && p.stamina >= 28) {
    p.dash = .24; p.dashCooldown = 1.1; p.stamina -= 28; event(s, 'dash', p);
  }
  const wasWater = p.water;
  p.water = habitat(p.x, p.z) === 'water';
  if (wasWater !== p.water) event(s, 'water', p);
  const camouflage = p.adaptation === 'camouflage' ? .95 : .65;
  const wasHidden=p.hidden;
  p.hidden = coverAt(p.x, p.z, s.seed) && magnitude < camouflage && p.attack <= 0 && p.dash <= 0;
  if(p.hidden&&!wasHidden)event(s,'cover',p);
  p.habitats[p.water ? 'water' : p.hidden ? 'cover' : 'open'] += dt;
  const swim = combatTraits(p).swims || p.origin === 'duckling' || p.adaptation === 'aquatic' || (p.origin === 'caterpillar' && p.form >= 2);
  const speed = (def.speed + Math.min(1.5,p.form*.12)) * (p.adaptation === 'swift' ? 1.15 : 1) * (p.water && !swim ? .48 : 1) * (p.dash > 0 ? 2.65 : 1);
  const dx = p.dash > 0 && !p.moving ? Math.sin(p.angle) : mx;
  const dz = p.dash > 0 && !p.moving ? Math.cos(p.angle) : mz;
  moveActor(s, p, dx * speed * dt, dz * speed * dt);
  p.travel += Math.hypot(dx, dz) * speed * dt;
  p.size = Math.min(1.8,.75 + p.form * .14) + growthProgress(p) * .06;
  p.stamina = Math.min(100, p.stamina + (p.dash > 0 ? 0 : 18 * dt));
  p.hunger = Math.max(0, p.hunger - dt * (.72 + magnitude * .13) * def.appetite);
  if (p.hunger === 0) damagePlayer(s, 4, 'starvation');
  else if (p.hunger > 65 && p.invulnerable === 0) p.hp = Math.min(p.maxHp, p.hp + dt * 1.15);
  if (s.status !== 'alive') return;
  if (p.attack > 0) {
    p.attack -= dt;
    if (!p.attackDone && p.attack <= .22) { p.attackDone = true; strike(s); }
  }
  for (const f of s.food) {
    if (f.consumed || distance(p, f) > .63 + p.radius) continue;
    f.consumed = true;
    const value = FOOD[f.kind];
    const bonus = (p.origin === 'chick' && f.kind === 'seed') || (p.origin === 'piglet' && f.kind === 'mushroom') || (p.origin === 'caterpillar' && f.kind === 'berry');
    const gain = value.growth * (bonus ? 1.35 : 1) * (1+p.form*.24);
    const heal=Math.min(p.maxHp-p.hp,value.hunger*.22);p.hp+=heal;
    p.hunger = Math.min(100, p.hunger + value.hunger); p.growth += gain; p.eaten++;
    s.consumed.set(f.id, s.time + 48);
    event(s, 'food', f, { kind: f.kind, growth: gain,heal }); evolve(s);
  }
  s.food = s.food.filter(f => !f.consumed);
  if (!s.lowHunger && p.hunger < 22) event(s, 'hungry', p);
  if (!s.lowHp && p.hp / p.maxHp < .3) event(s, 'danger', p);
  s.lowHunger = p.hunger < 22; s.lowHp = p.hp / p.maxHp < .3;
  const biome = habitat(p.x, p.z);
  if (!s.visited.has(biome)) { s.visited.add(biome); event(s, 'habitat', p, { biome }); }
  if (s.status === 'alive') updateFauna(s, dt);
  replenishFood(s);
}

export function lifeSummary(s) {
  return { seconds: Math.floor(s.time), origin: s.player.origin, species:s.player.species, form: s.player.form,
    maturity: s.player.maturity, eaten: s.player.eaten, kills: s.player.kills,
    habitats: [...s.visited], cause: s.cause, distance: Math.floor(s.player.travel) };
}

const finite=(value,min,max)=>Number.isFinite(value)?clamp(value,min,max):min;
export function normalizeRecords(raw={},old={}) {
  const source=raw?.schema===2?raw:old||{};
  const clean={schema:2,best:finite(source.best,0,1e10),lives:finite(source.lives,0,1e9),
    discoveries:Array.isArray(source.discoveries)?source.discoveries.filter(x=>typeof x==='string').slice(-128):[],moonTrail:source.moonTrail===true,
    legacy:{hp:finite(source.legacy?.hp,0,1e8),power:finite(source.legacy?.power,0,1e7)},
    bag:Array.isArray(source.bag)?[...new Set(source.bag.filter(x=>ORIGINS.includes(x)))]:[],lastOrigin:ORIGINS.includes(source.lastOrigin)?source.lastOrigin:null,
    settled:Array.isArray(source.settled)?source.settled.filter(x=>typeof x==='string').slice(-64):[],checkpoint:null};
  if(source.checkpoint&&restoreLife(source.checkpoint))clean.checkpoint=source.checkpoint;
  return clean;
}
export function drawOrigin(records,random=Math.random){
  if(!records.bag.length){records.bag=[...ORIGINS];for(let i=records.bag.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[records.bag[i],records.bag[j]]=[records.bag[j],records.bag[i]];}
    if(records.bag.at(-1)===records.lastOrigin)[records.bag[0],records.bag[records.bag.length-1]]=[records.bag.at(-1),records.bag[0]];
  }
  const origin=records.bag.pop();records.lastOrigin=origin;return origin;
}
export function inheritLife(records,s){
  if(s.status!=='dead'||records.settled.includes(s.id))return {hp:0,power:0};
  const gain={hp:Math.max(1,Math.floor(s.player.form*32*.20)),power:Math.max(.04,Math.round(s.player.form*1.55*.20*100)/100)};
  records.legacy.hp+=gain.hp;records.legacy.power=Math.round((records.legacy.power+gain.power)*100)/100;
  records.settled.push(s.id);records.settled=records.settled.slice(-64);records.lives++;
  records.best=Math.max(records.best,Math.floor(s.time));records.checkpoint=null;
  records.discoveries=[...new Set([...records.discoveries,s.player.species])].slice(-128);
  return gain;
}
export function checkpointLife(s){
  if(s.status!=='alive')return null;
  const {random,visited,consumed,events,...rest}=s;
  return JSON.parse(JSON.stringify({...rest,player:{...s.player,attack:0,attackDone:true,dash:0,moving:false},version:2,rngState:random.state(),visited:[...visited],consumed:[...consumed].slice(-LIMITS.memory),events:[]}));
}
export function restoreLife(value){
  try{
    if(!value||value.version!==2||value.status!=='alive'||typeof value.id!=='string'||!value.id||value.id.length>100)return null;
    const p=value.player;
    if(!p||!ORIGINS.includes(p.origin)||!SPECIES[p.species]||!Number.isInteger(p.form)||p.form<0||p.form>1e6)return null;
    for(const n of [value.seed,value.rngState,value.time,p.x,p.z,p.hp,p.maxHp,p.power,p.growth,p.hunger,p.stamina,p.legacy?.hp,p.legacy?.power])if(!Number.isFinite(n)||Math.abs(n)>1e12)return null;
    for(const key of ['angle','size','radius','invulnerable','cooldown','dashCooldown','kills','eaten','travel','damage','maturity','speed'])if(!Number.isFinite(p[key])||Math.abs(p[key])>1e10)return null;
    for(const key of ['water','cover','open'])if(!Number.isFinite(p.habitats?.[key])||p.habitats[key]<0)return null;
    for(const key of ['eventId','nextId','spawnTimer'])if(!Number.isFinite(value[key])||value[key]<0)return null;
    if(p.hp<=0||p.hp>p.maxHp||p.hunger<0||p.hunger>100||p.stamina<0||p.stamina>100||p.growth<evolutionThreshold(p.form)||p.growth>=evolutionThreshold(p.form+1))return null;
    if(!Array.isArray(value.fauna)||value.fauna.length>LIMITS.fauna||!Array.isArray(value.food)||value.food.length>LIMITS.food||!Array.isArray(value.consumed)||value.consumed.length>LIMITS.memory)return null;
    for(const a of value.fauna)if(!FAUNA[a.kind]||!['wander','flee','chase','windup','lunge','recover'].includes(a.state)||![a.x,a.z,a.hp,a.power,a.angle,a.timer,a.attack,a.cooldown,a.radius].every(Number.isFinite))return null;
    for(const f of value.food)if(!FOOD[f.kind]||typeof f.id!=='string'||![f.x,f.z].every(Number.isFinite))return null;
    if(!value.consumed.every(v=>Array.isArray(v)&&typeof v[0]==='string'&&Number.isFinite(v[1])))return null;
    const s=JSON.parse(JSON.stringify(value));delete s.version;delete s.rngState;
    s.random=rng(value.rngState);s.visited=new Set(Array.isArray(value.visited)?value.visited.filter(v=>['water','marsh','meadow','forest','dryland'].includes(v)):[]);s.consumed=new Map(value.consumed);s.events=[];
    s.player.attack=0;s.player.attackDone=true;s.player.dash=0;s.player.moving=false;
    return s;
  }catch{return null;}
}
