// Isolated Stage 33 adapter candidate; callers still need real-engine tests.
import {beginLaneChoiceCycle,pulseLaneChoice} from './beacon-lanes-candidate.mjs';
const centres={A:256,B:768};
function laneHazard(lane){return {kind:'lane',beaconLane:lane.side,x:centres[lane.side],y:880,width:220,height:1760,warn:lane.warn,life:lane.life,damage:10,color:'#f59e0b',tick:0,vx:0,vy:0,r:100,growth:0,bossSkill:null}}
export function beginBeaconLanes(choice,hazards){
  if(!Array.isArray(hazards)||hazards.some(hazard=>hazard.beaconLane))throw new Error('UNSETTLED_BEACON_HAZARDS');
  const step=beginLaneChoiceCycle(choice);
  return {choice:step.state,hazards:[...hazards,...step.state.lanes.map(laneHazard)],events:step.events};
}
export function pulseBeaconLane(choice,hazards,side){
  if(!Array.isArray(hazards))throw new TypeError('INVALID_HAZARDS');
  const step=pulseLaneChoice(choice,side);
  if(step.events.includes(`lane-cancelled:${side}`)){
    const matches=hazards.filter(hazard=>hazard.beaconLane===side&&hazard.warn>0);
    if(matches.length!==1)throw new Error('BEACON_LANE_STATE_MISMATCH');
    return {choice:step.state,hazards:hazards.filter(hazard=>hazard!==matches[0]),events:step.events};
  }
  return {choice:step.state,hazards,events:step.events};
}
