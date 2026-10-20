import { HABITATS, SPECIES, FOODS, FEATURES, APPROACHES, PHASES, UPGRADES } from './data.js';

const byId = (list, id) => list.find(entry => entry.id === id);
const integer = (value, fallback = 0, max = Number.MAX_SAFE_INTEGER) => Number.isFinite(value) ? Math.max(0, Math.min(max, Math.floor(value))) : fallback;
const validId = (list, id, fallback) => byId(list, id) ? id : fallback;
const result = (ok, type, messageKey, params = {}, extra = {}) => ({ ok, type, messageKey, params, ...extra });
const petFor = (state, id) => state.pets[id] || { trust: 0, growth: 0, careTurn: -1, collected: false, adult: false };
export const trustNeeded = (state, species) => Math.max(1, species.trustRequired - Math.floor(state.upgrades.kit / 2) - Math.floor(state.upgrades.notebook / 2));
export const currentNeed = (state, id) => {
  const species = byId(SPECIES, id);
  return species ? species.needs[petFor(state,id).growth % species.needs.length] : null;
};
export function createState() {
  return { version: 1, habitat: 'meadow', selectedTarget: 'clover-rabbit', food: 'greens', feature: 'grass', phase: 'day', turn: 0,
    resources: { supplies: 30, crystals: 0 }, pets: {}, unlocked: ['meadow'], upgrades: { kit: 0, notebook: 0 }, encounter: null };
}

export function normalizeState(raw) {
  const state = createState();
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return state;
  state.turn = integer(raw.turn);
  state.resources.supplies = integer(raw.resources?.supplies, 30);
  state.resources.crystals = integer(raw.resources?.crystals);
  state.upgrades.kit = integer(raw.upgrades?.kit, 0, 3);
  state.upgrades.notebook = integer(raw.upgrades?.notebook, 0, 3);
  state.unlocked = HABITATS.filter(h => h.index === 0 || (Array.isArray(raw.unlocked) && raw.unlocked.includes(h.id))).map(h => h.id);
  state.habitat = state.unlocked.includes(raw.habitat) ? raw.habitat : 'meadow';
  state.selectedTarget = validId(SPECIES, raw.selectedTarget, 'clover-rabbit');
  if (HABITATS[byId(SPECIES,state.selectedTarget).habitat].id !== state.habitat) state.selectedTarget = SPECIES.find(s => HABITATS[s.habitat].id === state.habitat).id;
  state.food = validId(FOODS, raw.food, state.food);
  state.feature = validId(FEATURES, raw.feature, state.feature);
  state.phase = validId(PHASES, raw.phase, state.phase);
  for (const species of SPECIES) {
    const saved = raw.pets?.[species.id];
    if (!saved || typeof saved !== 'object') continue;
    const growth = integer(saved.growth);
    const collected = saved.collected === true || saved.adult === true || growth >= 3;
    state.pets[species.id] = { trust: integer(saved.trust, 0, species.trustRequired), growth,
      careTurn: Number.isFinite(saved.careTurn) ? Math.max(-1,Math.min(state.turn,Math.floor(saved.careTurn))) : state.turn,
      collected, adult: collected && (saved.adult === true || growth >= 3) };
    if (state.pets[species.id].adult && growth < 3) state.pets[species.id].growth = 3;
    if (collected) state.pets[species.id].trust = Math.max(state.pets[species.id].trust, trustNeeded(state,species));
  }
  const pending = raw.encounter;
  if (pending && byId(SPECIES,pending.speciesId) && pending.turn === state.turn && !petFor(state,pending.speciesId).collected) {
    const species = byId(SPECIES,pending.speciesId);
    if (state.unlocked.includes(HABITATS[species.habitat].id) && requirements(state,species).length === 0 &&
        species.food === state.food && species.feature === state.feature && (!species.phase || species.phase === state.phase)) {
      state.encounter = { speciesId: species.id, turn: state.turn };
    }
  }
  return state;
}

export function stats(state) {
  const values = Object.values(state.pets);
  return { collected: values.filter(p => p.collected).length, adults: values.filter(p => p.adult).length,
    total: SPECIES.length, habitats: state.unlocked.length, trust: values.reduce((sum,p) => sum+p.trust,0) };
}

// Only permanent prerequisites. Preparation clues are species.food/feature/phase.
export function requirements(state, input) {
  const species = typeof input === 'string' ? byId(SPECIES,input) : input;
  if (!species) return [{ key: 'invalidTarget', params: {} }];
  const missing = [];
  const habitat = HABITATS[species.habitat];
  if (!state.unlocked.includes(habitat.id)) missing.push({ key: 'habitatLocked', params: { habitat: habitat.id } });
  if (species.adultRequired && !petFor(state,species.adultRequired).adult) missing.push({ key: 'needAdult', params: { adult: species.adultRequired } });
  if (state.upgrades.kit < species.kitRequired) missing.push({ key: 'needKit', params: { level: species.kitRequired } });
  if (state.upgrades.notebook < species.notebookRequired) missing.push({ key: 'needNotebook', params: { level: species.notebookRequired } });
  return missing;
}

export function explore(state, targetId = state.selectedTarget, food = state.food, feature = state.feature, phase = state.phase) {
  const species = byId(SPECIES,targetId);
  if (!species) return result(false,'reject','invalidTarget');
  if (state.encounter) return result(false,'reject','encounterPending');
  const habitat = HABITATS[species.habitat];
  if (!state.unlocked.includes(habitat.id)) return result(false,'reject','habitatLocked',{ habitat: habitat.id });
  state.habitat = habitat.id;
  state.selectedTarget = species.id;
  state.food = validId(FOODS,food,state.food);
  state.feature = validId(FEATURES,feature,state.feature);
  state.phase = validId(PHASES,phase,state.phase);
  const earned = 6 + state.upgrades.kit*2 + state.upgrades.notebook + species.habitat;
  state.turn += 1;
  state.resources.supplies += earned;
  const params = { species: species.id, earned };
  const missing = requirements(state,species)[0];
  if (missing) return result(false,'mismatch',missing.key,{ ...params,...missing.params });
  if (state.food !== species.food) return result(false,'mismatch','needFood',{ ...params,food: species.food });
  if (state.feature !== species.feature) return result(false,'mismatch','needFeature',{ ...params,feature: species.feature });
  if (species.phase && state.phase !== species.phase) return result(false,'mismatch','needPhase',{ ...params,phase: species.phase });
  if (petFor(state,species.id).collected) return result(true,'expedition','alreadyCollected',params);
  state.encounter = { speciesId: species.id, turn: state.turn };
  return result(true,'encounter','encounterReady',params,{ encounter: { ...state.encounter } });
}

export function approach(state, choice) {
  if (!state.encounter) return result(false,'reject','noEncounter');
  if (!byId(APPROACHES,choice)) return result(false,'reject','invalidApproach');
  const species = byId(SPECIES,state.encounter.speciesId);
  state.encounter = null; // Every valid choice settles exactly one encounter.
  if (!species) return result(false,'reject','invalidTarget');
  if (choice !== species.approach) return result(false,'mismatch','wrongApproach',{ species: species.id, approach: species.approach });
  const pet = state.pets[species.id] ||= petFor(state,species.id);
  if (pet.collected) return result(true,'expedition','alreadyCollected',{ species: species.id });
  const required = trustNeeded(state,species);
  pet.trust = Math.min(species.trustRequired,pet.trust+1);
  if (pet.trust < required) return result(true,'trust','trustGained',{ species: species.id,trust: pet.trust,required,remaining: required-pet.trust });
  pet.collected = true;
  pet.careTurn = state.turn;
  state.resources.crystals += 2;
  return result(true,'collected','collected',{ species: species.id,crystals: 2,trust: pet.trust,required });
}

export function care(state, petId, action) {
  const species = byId(SPECIES,petId);
  const pet = state.pets[petId];
  if (!species || !pet?.collected) return result(false,'reject','invalidPet');
  if (pet.careTurn >= state.turn) return result(false,'reject','careWait',{ species: petId });
  const need = currentNeed(state,petId);
  if (action !== need) return result(false,'mismatch','wrongCare',{ species: petId,need });
  pet.careTurn = state.turn;
  pet.growth += 1;
  const earned = 3 + state.upgrades.notebook;
  state.resources.supplies += earned;
  const becameAdult = !pet.adult && pet.growth >= 3;
  if (becameAdult) { pet.adult = true; state.resources.crystals += 1; }
  return result(true,becameAdult ? 'adult' : 'care',becameAdult ? 'adult' : 'cared',
    { species: petId,earned,crystals: becameAdult ? 1 : 0,growth: pet.growth,need: currentNeed(state,petId) });
}

export function buy(state, upgradeId) {
  const upgrade = byId(UPGRADES,upgradeId);
  if (!upgrade) return result(false,'reject','invalidUpgrade');
  const current = state.upgrades[upgrade.kind];
  if (current >= upgrade.level) return result(false,'reject','alreadyOwned',{ upgrade: upgradeId });
  if (upgrade.level !== current+1) return result(false,'reject','upgradeOrder',{ level: current+1 });
  if (state.resources[upgrade.currency] < upgrade.cost) return result(false,'reject',upgrade.currency === 'supplies' ? 'needSupplies' : 'needCrystals', { count: upgrade.cost-state.resources[upgrade.currency] });
  state.resources[upgrade.currency] -= upgrade.cost;
  state.upgrades[upgrade.kind] = upgrade.level;
  return result(true,'purchase','bought',{ upgrade: upgradeId,level: upgrade.level });
}

export function unlockHabitat(state, id) {
  const habitat = byId(HABITATS,id);
  if (!habitat) return result(false,'reject','invalidHabitat');
  if (state.unlocked.includes(id)) return result(false,'reject','alreadyOwned',{ habitat: id });
  const counts = stats(state);
  if (counts.collected < habitat.collectedRequired) return result(false,'reject','needCollection',{ count: habitat.collectedRequired-counts.collected });
  if (counts.adults < habitat.adultsRequired) return result(false,'reject','needAdults',{ count: habitat.adultsRequired-counts.adults });
  if (state.resources.supplies < habitat.cost) return result(false,'reject','needSupplies',{ count: habitat.cost-state.resources.supplies });
  state.resources.supplies -= habitat.cost;
  state.unlocked.push(id);
  state.habitat = id;
  state.selectedTarget = SPECIES.find(s => s.habitat === habitat.index).id;
  return result(true,'unlock','habitatUnlocked',{ habitat: id });
}
