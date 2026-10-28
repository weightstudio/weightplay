// Isolated Stage 39 rule candidate. This model cannot write progress or award
// currency; the real combat integration must enforce the same transitions.
import {makeBeaconRound, stepBeaconRound} from './beacon-circuit-candidate.mjs';

export function makeShieldCarrierRound() {
  return {beacon:makeBeaconRound(39), firstAlive:true, firstDrop:false,
    secondShielded:true, secondAlive:true, secondDrop:false};
}

export function stepShieldCarrierRound(previous, action = {}) {
  const next={...previous}, events=[];
  if(action.defeatFirst && next.firstAlive) {
    next.firstAlive=false; next.firstDrop=true; events.push('first-drop');
  }
  if(action.defeatSecond && next.secondAlive && !next.secondShielded) {
    next.secondAlive=false; next.secondDrop=true; events.push('second-drop');
  }
  let pickup=false;
  if(action.pickup && !action.damaged && !next.beacon.charge) {
    if(next.beacon.completed===0 && next.firstDrop) {pickup=true; next.firstDrop=false;}
    else if(next.beacon.completed===1 && next.secondDrop) {pickup=true; next.secondDrop=false;}
  }
  const stepped=stepBeaconRound(next.beacon,{dt:action.dt ?? 0,pickup,
    damaged:Boolean(action.damaged),nearBeacon:action.nearBeacon ?? null});
  next.beacon=stepped.state; events.push(...stepped.events);
  if(stepped.events.includes('beacon-pulsed') && next.beacon.completed===1 && next.secondShielded) {
    next.secondShielded=false; events.push('second-shield-opened');
  }
  // A lost or expired fragment must be recoverable at the same phase.
  if(stepped.events.includes('charge-lost') || stepped.events.includes('charge-expired')) {
    if(next.beacon.completed===0) next.firstDrop=true;
    else if(next.beacon.completed===1 && !next.secondAlive) next.secondDrop=true;
  }
  return {state:next,events};
}

export function shieldCarrierObjective(round, waveCleared, waveGoal) {
  return Boolean(round.beacon.completed===2 && Number.isInteger(waveCleared) &&
    Number.isInteger(waveGoal) && waveGoal>0 && waveCleared>=waveGoal);
}
