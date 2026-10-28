import {stepShelterChoice} from './beacon-shelter-choice-candidate.mjs';
// Isolated atomic proposal. Arrays and enemy objects are copied only when an
// effect occurs; host must commit all returned fields together.
export function stepShelterWorld(round,{enemies,hazards},input={}){
  if(!Array.isArray(enemies)||!Array.isArray(hazards))throw new TypeError('invalid choice world');
  const guards=enemies.filter(e=>e?.beaconShelterGuard&&e.hp>0&&e.shielded&&e.shieldHp>0);
  const heat=hazards.filter(h=>h?.beaconShelterHeat&&h.life>0);
  const step=stepShelterChoice(round,{...input,shieldReady:guards.length===1,heatReady:heat.length===1});
  let nextEnemies=enemies,nextHazards=hazards;
  if(step.events.includes('shield-pulse'))nextEnemies=enemies.map(e=>e===guards[0]?{...e,shielded:false,shieldHp:0}:e);
  if(step.events.includes('heat-pulse'))nextHazards=hazards.filter(h=>h!==heat[0]);
  return {round:step.state,enemies:nextEnemies,hazards:nextHazards,events:step.events};
}
