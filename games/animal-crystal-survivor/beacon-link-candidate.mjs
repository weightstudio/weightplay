// Unconnected Stage 41 circuit draft; no persistence, reward or runtime access.
import {makeBeaconRound,stepBeaconRound} from './beacon-circuit-candidate.mjs?v=20261028-beacon3';
export function makeLinkRound(){return {beacon:makeBeaconRound(41),linkRemaining:0};}
export function stepLinkRound(previous,action={}){
  const dt=action.dt??0;if(!Number.isFinite(dt)||dt<0||dt>.25)throw new RangeError('INVALID_LINK_STEP');
  let beacon={...previous.beacon},remaining=previous.linkRemaining,events=[];
  if(beacon.completed===1){remaining=Math.max(0,remaining-dt);if(remaining<=1e-9){remaining=0;beacon={...beacon,charge:0,dwell:0,completed:0,lastPulse:null};events.push('link-expired')}}
  const stepped=stepBeaconRound(beacon,{dt,pickup:Boolean(action.pickup),damaged:Boolean(action.damaged),nearBeacon:action.nearBeacon??null});
  beacon=stepped.state;events.push(...stepped.events);
  if(stepped.events.includes('beacon-pulsed')&&beacon.completed===1){remaining=20;events.push('link-started')}
  if(beacon.completed===2)remaining=0;
  return {state:{beacon,linkRemaining:remaining},events};
}
export function linkObjective(state,waves,goal){return state.beacon.completed===2&&Number.isInteger(waves)&&Number.isInteger(goal)&&goal>0&&waves>=goal}
