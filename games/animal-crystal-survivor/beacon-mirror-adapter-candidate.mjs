// Unconnected adapter for real engine-shaped circular hazards.
import {mirrorStart,mirrorZones} from './beacon-mirror-candidate.mjs?v=20261028-mirror1';
function create(side,cycle,hazards){
  if(!Array.isArray(hazards)||hazards.some(h=>h.beaconMirror))throw new Error('MIRROR_HAZARD_UNSETTLED');
  const state={...mirrorStart(side),cycle},zone=mirrorZones[side];
  return {state,hazards:[...hazards,{kind:'circle',beaconMirror:side,x:zone.x,y:zone.y,r:zone.r,warn:state.warn,life:state.life,damage:10,color:side==='A'?'#f97316':'#f59e0b',tick:0,vx:0,vy:0,growth:0,bossSkill:null}]};
}
export function beginMirrorHazard(hazards){return create('A',1,hazards)}
export function nextMirrorHazard(previous,hazards){
  if(!previous||!['A','B'].includes(previous.side)||!Number.isInteger(previous.cycle)||previous.cycle<1)throw new TypeError('INVALID_MIRROR_STATE');
  return create(previous.side==='A'?'B':'A',previous.cycle+1,hazards);
}
