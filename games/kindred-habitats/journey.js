import {HABITATS,SPECIES,UPGRADES} from './data.js';
import {stats,requirements,currentNeed,explore,approach,care,buy,unlockHabitat} from './engine.js?v6';

const pet=(state,s)=>state.pets[s.id];
const selected=state=>SPECIES.find(s=>s.id===state.selectedTarget)||SPECIES[0];
const available=state=>SPECIES.find(s=>!pet(state,s)?.collected&&requirements(state,s).length===0);
const young=state=>SPECIES.find(s=>pet(state,s)?.collected&&!pet(state,s).adult);
const walkTarget=state=>SPECIES.find(s=>pet(state,s)?.collected)||SPECIES[0];

function upgradeStep(state,species,kind){
  const upgrade=UPGRADES.find(u=>u.kind===kind&&u.level===state.upgrades[kind]+1);
  if(!upgrade)return {kind:'complete',species};
  if(state.resources[upgrade.currency]>=upgrade.cost)return {kind:'upgrade',species,upgrade};
  if(upgrade.currency==='crystals'){
    const target=available(state)||young(state);
    if(target)return {kind:'select',species:target};
  }
  return {kind:'gather',species,walkTarget:walkTarget(state),upgrade};
}

function onward(state){
  const target=available(state)||young(state);
  if(target)return {kind:'select',species:target};
  const counts=stats(state);
  const habitat=HABITATS.find(h=>!state.unlocked.includes(h.id)&&counts.collected>=h.collectedRequired&&counts.adults>=h.adultsRequired);
  if(habitat)return {kind:state.resources.supplies>=habitat.cost?'unlock':'gather',species:selected(state),habitat,walkTarget:walkTarget(state)};
  const blocked=SPECIES.find(s=>!pet(state,s)?.collected&&state.unlocked.includes(HABITATS[s.habitat].id));
  if(blocked){
    if(state.upgrades.kit<blocked.kitRequired)return upgradeStep(state,blocked,'kit');
    if(state.upgrades.notebook<blocked.notebookRequired)return upgradeStep(state,blocked,'notebook');
  }
  return {kind:'complete',species:selected(state)};
}

// Reading the next action never grants rewards, changes preparation or spends.
export function journeyStep(state){
  if(state.encounter)return {kind:'encounter',species:SPECIES.find(s=>s.id===state.encounter.speciesId)};
  const species=selected(state),saved=pet(state,species);
  if(saved?.adult)return onward(state);
  if(saved?.collected)return {kind:saved.careTurn<state.turn?'care':'walk',species,action:currentNeed(state,species.id)};
  const missing=requirements(state,species)[0];
  if(!missing)return {kind:'find',species};
  if(missing.key==='needAdult')return {kind:'select',species:SPECIES.find(s=>s.id===species.adultRequired)};
  if(missing.key==='needKit')return upgradeStep(state,species,'kit');
  if(missing.key==='needNotebook')return upgradeStep(state,species,'notebook');
  return onward(state);
}

// One explicit button press performs exactly one existing engine transaction.
export function takeJourneyAction(state){
  const step=journeyStep(state),s=step.species;
  if(step.kind==='encounter')return approach(state,s.approach);
  if(step.kind==='care')return care(state,s.id,step.action);
  if(step.kind==='find')return explore(state,s.id,s.food,s.feature,s.phase||'day');
  if(step.kind==='walk')return explore(state,s.id);
  if(step.kind==='upgrade')return buy(state,step.upgrade.id);
  if(step.kind==='unlock')return unlockHabitat(state,step.habitat.id);
  if(step.kind==='gather'){
    const oldTarget=state.selectedTarget,oldHabitat=state.habitat;
    const result=explore(state,step.walkTarget.id);
    state.selectedTarget=oldTarget;state.habitat=oldHabitat;
    return result;
  }
  if(step.kind==='select'){
    state.selectedTarget=s.id;state.habitat=HABITATS[s.habitat].id;
    return {ok:true,type:'select',messageKey:'simpleNext',params:{species:s.id}};
  }
  return {ok:true,type:'complete',messageKey:'complete',params:{}};
}
