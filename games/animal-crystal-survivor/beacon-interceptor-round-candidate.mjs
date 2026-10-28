// Isolated Stage 51 design experiment. This is not loaded by the game.
// The host must supply truthful pickup, damage and position observations,
// render and resolve the committed interceptor, and never use this model to
// persist progress or award rewards.
import {makeBeaconRound,stepBeaconRound} from './beacon-circuit-candidate.mjs';
import {makeInterceptorCue,stepInterceptorCue} from './beacon-interceptor-candidate.mjs';

export function makeInterceptorRound() {
  return {beacon:makeBeaconRound(51),cue:null,cleared:false,sequence:0,deferDwell:false};
}

// One committed warning/charge per picked-up fragment. While it is pending,
// holding at B does not advance the station; this makes a pickup already at B
// unable to skip the encounter. Moving or shielding may be viable counters;
// this model does not decide collisions, damage, animations or input.
export function stepInterceptorRound(previous, input = {}) {
  const {dt=0,pickup=false,damaged=false,nearBeacon=null,player=null,defeatedId=null}=input;
  if (!previous || previous.beacon?.stage!==51 || !Number.isSafeInteger(previous.sequence) || previous.sequence<0 ||
      !Number.isFinite(dt) || dt<0 || dt>.25 || typeof pickup!=='boolean' || typeof damaged!=='boolean' ||
      !(defeatedId===null || (typeof defeatedId==='string' && defeatedId.length>0)))
    throw new TypeError('INVALID_INTERCEPTOR_ROUND');
  const picking=pickup&&!damaged&&!previous.beacon.charge&&previous.beacon.completed===0;
  // Validate the actual sampled location before calling the shared reducer.
  const initialCue=picking ? makeInterceptorCue(`fragment-${previous.sequence+1}`,player) : null;
  let cue=previous.cue, cleared=previous.cleared, sequence=previous.sequence, deferDwell=previous.deferDwell===true;
  const events=[];
  let justResolved=false;
  // A caller may report only a confirmed death of the exact interceptor.
  // Stale or unrelated enemy deaths never unlock this fragment's station.
  if (cue && !damaged && defeatedId===cue.id) {
    cue=null;cleared=true;justResolved=true;deferDwell=true;events.push('interceptor-defeated');
  } else if (cue && !damaged) {
    const stepped=stepInterceptorCue(cue,dt);
    cue=stepped.cue;
    if (cue.phase==='done') { cue=null; cleared=true; justResolved=true; events.push('interceptor-resolved'); }
  }
  // A newly sampled attack cannot allow same-tick dwell, nor can the tick
  // in which its final movement resolves credit earlier time at the station.
  const canDwell=cleared&&!cue&&!picking&&!justResolved&&!deferDwell;
  const stepped=stepBeaconRound(previous.beacon,{dt,pickup,damaged,nearBeacon:canDwell?nearBeacon:null});
  // A kill callback can occur before the host's later beacon update in the
  // same frame. Consume the guard there, without crediting pre-kill time.
  if(deferDwell&&!justResolved)deferDwell=false;
  events.push(...stepped.events);
  if (stepped.events.includes('charge-picked-up')) {
    sequence++;
    cue=initialCue;
    cleared=false;
    deferDwell=false;
    events.push('interceptor-warning');
  }
  if (stepped.events.some(event=>['charge-lost','charge-expired','beacon-pulsed'].includes(event))) {
    if (cue && stepped.events.some(event=>event==='charge-lost'||event==='charge-expired'))
      events.push('interceptor-cancelled');
    cue=null;
    cleared=false;
    deferDwell=false;
  }
  return {state:{beacon:stepped.state,cue,cleared,sequence,deferDwell},events};
}
