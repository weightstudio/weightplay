import {HABITATS,SPECIES} from './data.js';
import {requirements,currentNeed} from './engine.js?v5';

// Suggestions never prepare food, grant progress or bypass a prerequisite.
export function suggestedCompanion(state) {
  const available=SPECIES.filter(s=>!state.pets[s.id]?.collected&&requirements(state,s).length===0);
  return available.find(s=>HABITATS[s.habitat].id===state.habitat)||available[0]||null;
}
export function nextStep(state,species) {
  const pet=state.pets[species.id];
  if(pet?.adult)return {kind:'next',target:suggestedCompanion(state)};
  if(pet?.collected)return pet.careTurn<state.turn?{kind:'care',action:currentNeed(state,species.id)}:{kind:'trip'};
  const missing=requirements(state,species)[0];
  if(missing?.key==='needAdult')return {kind:'raise',target:SPECIES.find(s=>s.id===species.adultRequired)};
  if(missing)return {kind:'workshop'};
  return {kind:'prepare'};
}
