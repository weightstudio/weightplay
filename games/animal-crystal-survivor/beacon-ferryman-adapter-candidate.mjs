// Closed-entry adapter for real engine hazards. No storage or rewards.
import {makeFacetLanes} from './beacon-ferryman-lanes-candidate.mjs?v=20261028-facet1';
export function beginFerrymanLanes(phase,hazards){
  if(!Array.isArray(hazards)||hazards.some(h=>h.beaconFacet))throw new Error('FACET_HAZARDS_UNSETTLED');
  const model=makeFacetLanes(phase);
  const additions=['A','B'].map(side=>{const lane=model.lanes[side];return {kind:'lane',beaconFacet:side,facetPhase:phase,x:lane.x,y:880,width:lane.width,height:1760,warn:lane.warn,life:lane.life,damage:10,color:side==='A'?'#f97316':'#c084fc',tick:0,vx:0,vy:0,r:100,growth:0,bossSkill:null}});
  return [...hazards,...additions];
}
export function pulseFerrymanLane(boss,hazards,phase,side){
  if(!boss||!Array.isArray(hazards)||!['A','B'].includes(side)||![0,1].includes(phase))throw new TypeError('INVALID_FACET_PULSE');
  if(boss.image!=='bossFerryman'||!Number.isFinite(boss.hp)||boss.hp<=0||!boss.shielded||boss.ferrymanPhase!==phase||side!==(phase===0?'A':'B'))throw new Error('FACET_BOSS_MISMATCH');
  const target=hazards.filter(h=>h.kind==='lane'&&h.beaconFacet===side&&h.facetPhase===phase&&h.life>0);
  if(target.length!==1)throw new Error('FACET_HAZARD_MISMATCH');
  return {boss:{...boss,shielded:false},hazards:hazards.filter(h=>h!==target[0]),events:[`facet-opened:${side}`,`lane-cancelled:${side}`]};
}
