// Source-only proposal for a Stage 42 committed runner. The actual engine and
// renderer must consume the same endpoints; this module does not spawn an
// enemy, move it, apply damage, or open a practice entry.
import {beaconCircuitStages} from './beacon-circuit-candidate.mjs?v=20261028-beacon3';
const station=beaconCircuitStages.find(item=>item.stage===42).beacons[0];
export function makeCommittedWarning(id){
  if(typeof id!=='string'||!id)throw new TypeError('INVALID_CHARGE_ID');
  return {id,phase:'warning',remaining:5.5,width:58,x1:station.x-250,y1:station.y,x2:station.x+25,y2:station.y};
}
export function stepCommittedWarning(cue,dt){
  if(!cue||cue.phase!=='warning'||!Number.isFinite(cue.remaining)||!Number.isFinite(dt)||dt<0||dt>.25)throw new RangeError('INVALID_COMMITTED_STEP');
  const remaining=Math.max(0,cue.remaining-dt);
  return {...cue,remaining,phase:remaining<=1e-9?'active':'warning'};
}
export function shouldSpawnCommittedRunner({needsPulse,hasCharge,distance,hasRunner}){
  return needsPulse===true&&hasCharge===true&&hasRunner===false&&Number.isFinite(distance)&&distance<=260;
}

// Returns positions for a host to apply before its normal swept-contact test.
// The fixed path and duration avoid recomputing aim or chase speed mid-dash.
export function stepCommittedRunner(cue,dt){
  if(!cue||![cue.x1,cue.y1,cue.x2,cue.y2].every(Number.isFinite)||!Number.isFinite(dt)||dt<0||dt>.25)throw new RangeError('INVALID_RUNNER_STEP');
  if(cue.phase==='warning'){
    const next=stepCommittedWarning(cue,dt);
    return {cue:next,x:cue.x1,y:cue.y1};
  }
  if(cue.phase==='active'){
    if(cue.progress!==undefined&&(!Number.isFinite(cue.progress)||cue.progress<0||cue.progress>1))throw new RangeError('INVALID_RUNNER_PROGRESS');
    const nextProgress=(cue.progress??0)+dt/.55;
    const progress=nextProgress>=1-1e-9?1:nextProgress;
    return {cue:{...cue,progress,phase:progress>=1?'done':'active'},x:cue.x1+(cue.x2-cue.x1)*progress,y:cue.y1+(cue.y2-cue.y1)*progress};
  }
  throw new RangeError('COMMITTED_RUNNER_NOT_ACTIVE');
}
