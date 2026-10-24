export const GAME_ID = 'wildborn';
export const SAVE_KEY = 'weightplay.wildborn.v2';
export const LEGACY_SAVE_KEY = 'weightplay.wildborn.v1';
export const STEP = 1 / 60;
export const ORIGINS = Object.freeze(['beetle', 'caterpillar', 'chick', 'duckling', 'piglet', 'mouse']);
export const LINEAGES = Object.freeze({
  beetle: { color: 0x3eae8d, accent: 0xf4cf6b, speed: 3.2, hp: 88, appetite: .85, trait: 'shell', forms: ['beetle', 'stagbeetle', 'titanbeetle', 'jadeguardian'] },
  caterpillar: { color: 0xa2ca5e, accent: 0xffc965, speed: 3.0, hp: 76, appetite: .7, trait: 'leaf', forms: ['caterpillar', 'silkworm', 'moth', 'moonmoth'] },
  chick: { color: 0xffd46a, accent: 0xe78a41, speed: 3.5, hp: 80, appetite: .9, trait: 'seed', forms: ['chick', 'hen', 'rooster', 'sunbird'] },
  duckling: { color: 0xf5e5a8, accent: 0xe49d43, speed: 3.3, hp: 84, appetite: .85, trait: 'swim', forms: ['duckling', 'duck', 'mallard', 'riverwing'] },
  piglet: { color: 0xe6a399, accent: 0x9a5f65, speed: 3.05, hp: 100, appetite: .75, trait: 'root', forms: ['piglet', 'pig', 'boar', 'grovetusk'] },
  mouse: { color: 0xab9b92, accent: 0xe7b0a1, speed: 3.8, hp: 72, appetite: .85, trait: 'nimble', forms: ['mouse', 'fieldmouse', 'shrew', 'nightstalker'] },
});
export const FAUNA = Object.freeze({
  beetle: { power: .45, hp: 12, speed: 1.7, color: 0x519779, prey: true },
  mouse: { power: .65, hp: 16, speed: 2.5, color: 0x9c8c7b, prey: true },
  chick: { power: .8, hp: 19, speed: 2, color: 0xf6cb65, prey: true },
  rabbit: { power: 1.1, hp: 24, speed: 3, color: 0xe0d1b4, prey: true },
  mantis: { power: 1.6, hp: 35, speed: 2.3, color: 0x719857 },
  fox: { power: 2.6, hp: 52, speed: 2.8, color: 0xc77544 },
  boar: { power: 4.4, hp: 90, speed: 2.3, color: 0x685348 },
  wolf: { power: 6.0, hp: 115, speed: 3.0, color: 0x748b9b },
  raptor: { power: 8, hp: 150, speed: 3.25, color: 0x729b79 },
  mammoth: { power: 11, hp: 245, speed: 2.0, color: 0x9b7958 },
  tyrannosaur: { power: 15, hp: 310, speed: 2.65, color: 0x729b79 },
  wyvern: { power: 20, hp: 380, speed: 3.1, color: 0x567b83 },
  giant: { power: 27, hp: 490, speed: 2.7, color: 0xd6a376 },
});
export const FOOD = Object.freeze({
  berry: { growth: 6, hunger: 15, color: 0xee8869 },
  seed: { growth: 4, hunger: 10, color: 0xffd582 },
  mushroom: { growth: 8, hunger: 19, color: 0xdfab79 },
  insect: { growth: 7, hunger: 13, color: 0x9bd6ac },
  feast: { growth: 18, hunger: 27, color: 0xf4b980 },
});
export const EVOLUTION = Object.freeze([0, 38, 100, 205]);
// Mythic forms keep branching. Rank changes power and a bounded anatomy
// mutation; the finite mesh palette keeps an endless life bounded in memory.
const speciesRows = [
 ['beetle','beetle',0,'stagbeetle,scarab'],['caterpillar','caterpillar',0,'silkworm'],
 ['chick','chick',0,'hen'],['duckling','duckling',0,'duck'],['piglet','piglet',0,'pig'],['mouse','mouse',0,'fieldmouse,glider'],
 ['stagbeetle','beetle',1,'mantis,scarab'],['scarab','beetle',2,'jadeguardian,titanmantis'],
 ['mantis','mantis',1,'titanmantis'],['titanmantis','mantis',3,'jadeguardian,insectdragon'],
 ['jadeguardian','beetle',3,'worldscarab,insectdragon'],['worldscarab','beetle',4,'insectdragon,jadeguardian'],
 ['silkworm','caterpillar',1,'moth'],['moth','caterpillar',2,'moonmoth,sunmoth'],
 ['moonmoth','caterpillar',3,'starwing,insectdragon'],['sunmoth','caterpillar',4,'phoenix,starwing'],
 ['starwing','caterpillar',5,'phoenix,insectdragon'],['insectdragon','dragon',1,'worldscarab,starwing,dragon'],
 ['hen','chick',1,'rooster,raptor'],['rooster','chick',2,'terrorbird,raptor'],
 ['duck','duckling',1,'mallard,swan'],['mallard','duckling',2,'riverwing,plesiosaur'],
 ['swan','swan',1,'riverwing,wyvern'],['riverwing','swan',3,'plesiosaur,wyvern'],
 ['terrorbird','raptor',1,'tyrannosaur,wyvern'],['raptor','raptor',0,'tyrannosaur,wyvern'],
 ['tyrannosaur','dinosaur',2,'dragon,worldsaur'],['plesiosaur','serpent',1,'leviathan,wyvern'],
 ['wyvern','dragon',0,'dragon,phoenix'],['dragon','dragon',2,'stormdragon,worldsaur'],
 ['stormdragon','dragon',4,'cosmicdragon,leviathan'],['cosmicdragon','dragon',5,'worldsaur,phoenix,stormdragon'],
 ['worldsaur','dinosaur',4,'cosmicdragon,leviathan'],['leviathan','serpent',4,'stormdragon,worldsaur'],
 ['phoenix','phoenix',3,'cosmicdragon,starwing'],
 ['pig','piglet',1,'boar'],['boar','boar',2,'mammoth,behemoth'],
 ['mammoth','mammoth',1,'behemoth,earthtitan'],['behemoth','mammoth',3,'earthtitan,worldsaur'],
 ['earthtitan','mammoth',5,'worldsaur,behemoth'],
 ['fieldmouse','mouse',1,'glider,primate'],['glider','glider',1,'primate,ape'],
 ['primate','ape',0,'ape,human'],['ape','ape',1,'human,giant'],
 ['human','human',0,'hunter,shaman'],['hunter','human',1,'giant,shaman'],
 ['shaman','human',2,'celestial,giant'],['giant','human',3,'celestial,colossus'],
 ['celestial','human',4,'colossus,shaman'],['colossus','human',5,'celestial,giant'],
];
export const SPECIES = Object.freeze(Object.fromEntries(speciesRows.map(([id,body,variant,next])=>[id,Object.freeze({id,body,variant,next:Object.freeze(next.split(','))})])));
export function evolutionThreshold(rank) { return rank <= 4 ? [0,26,64,118,192][rank] : 192+(rank-4)*90+(rank-4)*(rank-3)*6; }
export function anatomy(player) { return SPECIES[player.species] || SPECIES[player.origin]; }
export function nextSpecies(id, random) { const next=SPECIES[id].next;return next[Math.min(next.length-1,Math.floor(random()*next.length))]; }
export function combatTraits(player) {
  const body=anatomy(player).body;
  return {reach:body==='dragon'||body==='serpent'?4.5:body==='human'?2.8:body==='mammoth'?2.6:Math.min(2.4,1.35+player.form*.13),
    cone:body==='mammoth'?1.8:body==='dragon'?.78:1.12,
    armor:body==='beetle'?.78:body==='mammoth'?.84:1,
    swims:['dragon','serpent','swan','phoenix'].includes(body),
    breath:body==='dragon'||body==='serpent'};
}
export const LIMITS = Object.freeze({ fauna: 36, food: 110, events: 96, memory: 512, interactionRadius: 19 });
export const AUDIO_EVENTS = Object.freeze(['game.start', 'reward.collect', 'reward.upgrade', 'movement.dash', 'combat.strike', 'combat.critical', 'player.hurt', 'enemy.defeat', 'combat.block', 'water.splash', 'alert.warning', 'result.lose', 'shop.purchase','magic.fire','magic.hit']);

export function hash(x, z, seed = 0) {
  let n = (Math.imul(x | 0, 374761393) + Math.imul(z | 0, 668265263) + Math.imul(seed | 0, 1442695041)) | 0;
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}
export function rng(seed) {
  let s = seed >>> 0;
  const random = () => { s = (s + 0x6d2b79f5) >>> 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  random.state=()=>s;
  return random;
}
export function riverX(z) { return 19 + Math.sin(z / 26) * 8 + Math.sin(z / 10) * 2; }
export function habitat(x, z) {
  const bank = Math.abs(x - riverX(z));
  if (bank < 2.5) return 'water';
  if (bank < 7) return 'marsh';
  if (Math.sin(x / 45) - Math.cos(z / 53) > .48) return 'dryland';
  if (Math.sin((x + 12) / 31) + Math.sin((z - 17) / 28) > .15) return 'forest';
  return 'meadow';
}
export function groundHeight(x, z) {
  const base = Math.sin(x * .065) * .34 + Math.cos(z * .082) * .28 + Math.sin((x + z) * .18) * .10;
  const bank = Math.abs(x - riverX(z));
  return base - Math.max(0, 1 - bank / 4) * .7;
}
export function coverAt(x, z, seed) {
  if (habitat(x, z) === 'water' || habitat(x, z) === 'dryland') return false;
  const gx = Math.round(x / 4.8), gz = Math.round(z / 4.8);
  return hash(gx, gz, seed + 61) < .45 && Math.hypot(x - gx * 4.8, z - gz * 4.8) < 1.65;
}
export function treeAt(gx, gz, seed) {
  const x = gx * 7 + (hash(gx, gz, seed + 18) - .5) * 3;
  const z = gz * 7 + (hash(gx, gz, seed + 32) - .5) * 3;
  const biome = habitat(x, z);
  const chance = biome === 'forest' ? .53 : biome === 'meadow' ? .14 : biome === 'dryland' ? .045 : 0;
  if (Math.hypot(x, z) < 4 || hash(gx, gz, seed + 21) > chance) return null;
  return { x, z, radius: .42, height: 3 + hash(gx, gz, seed + 41) * 2.5 };
}
