// Isolated adapter for the existing engine hazard shape; not connected to play.
import {prismWaveStart,prismWaveStep} from './beacon-prism-candidate.mjs?v=20261028-prism2';
const centre={A:256,B:768};
export function beginPrismHazards(hazards){
  if(!Array.isArray(hazards)||hazards.some(h=>h.beaconPrism))throw new Error('PRISM_HAZARDS_UNSETTLED');
  const state=prismWaveStart();
  const additions=['A','B'].map(side=>({kind:'lane',beaconPrism:side,x:centre[side],y:880,width:220,height:1760,warn:state[`lane${side}`].warn,life:state[`lane${side}`].life,damage:10,color:side==='A'?'#f59e0b':'#c084fc',tick:0,vx:0,vy:0,r:100,growth:0,bossSkill:null}));
  return {state,hazards:[...hazards,...additions]};
}
export function pulsePrismHazard(previous,hazards,side){
  if(!Array.isArray(hazards)||!['A','B'].includes(side))throw new TypeError('INVALID_PRISM_PULSE');
  const targets=hazards.filter(h=>h.beaconPrism===side&&h.life>0);
  if(targets.length!==1)throw new Error('PRISM_HAZARD_MISMATCH');
  // The engine owns hazard clocks. Synchronize the selected lane before the
  // model decision so an expired or missing actual hazard never counts.
  const model={...previous,[`lane${side}`]:{...previous[`lane${side}`],warn:targets[0].warn,life:targets[0].life}};
  const step=prismWaveStep(model,{pulse:side});
  return {state:step.state,hazards:step.events.length?hazards.filter(h=>h!==targets[0]):hazards,events:step.events};
}
