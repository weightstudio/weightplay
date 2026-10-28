// Stage 44 isolated rules; the caller must provide real pickup and position.
import {makeBeaconRound,stepBeaconRound} from './beacon-circuit-candidate.mjs?v=20261028-beacon3';
export function makeLitOrder(){return makeBeaconRound(44)}
function valid(state){return state?.stage===44&&Number.isInteger(state.completed)&&state.completed>=0&&state.completed<=2}
export function litStation(state){if(!valid(state))throw new RangeError('INVALID_LIT_ORDER');return state.completed===0?'B':state.completed===1?'C':null}
export function carrierPolicy(state,wave){
  if(!valid(state)||!Number.isInteger(wave)||wave<1)throw new RangeError('INVALID_LIT_WAVE');
  if(state.completed===0)return {allowed:true,shielded:true};
  if(state.completed===1)return {allowed:wave>=2,shielded:false};
  return {allowed:false,shielded:false};
}
export function stepLitOrder(previous,action={}){return stepBeaconRound(previous,action)}
export function litOrderObjective(state,waveCleared,goal){return state.stage===44&&state.completed===2&&Number.isInteger(waveCleared)&&Number.isInteger(goal)&&goal>0&&waveCleared>=goal}
