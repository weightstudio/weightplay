// Stage 42 isolated design. No runtime, persistence, rewards or combat writes.
import {makeBeaconRound,stepBeaconRound,beaconCircuitStages} from './beacon-circuit-candidate.mjs?v=20261028-beacon3';

const plan=beaconCircuitStages.find(item=>item.stage===42);
const station=plan.beacons[0],stationRadius=plan.lamp.radius;
export function makeChargeRound(){return makeBeaconRound(42)}

// The warning is a fixed world-space segment from an identified live charger.
// Its width is included, so an edge touch counts; invalid or expired warnings
// never authorize spending the fragment.
export function warningCrossesStation(warning){
  if(!warning||warning.live!==true||warning.tag!=='beacon-charge'||warning.phase!=='warning'||
     typeof warning.id!=='string'||!warning.id||!Number.isFinite(warning.remaining)||warning.remaining<=0||
     !Number.isFinite(warning.width)||warning.width<0||
     ![warning.x1,warning.y1,warning.x2,warning.y2].every(Number.isFinite))return false;
  const dx=warning.x2-warning.x1,dy=warning.y2-warning.y1,lengthSquared=dx*dx+dy*dy;
  if(lengthSquared<1e-9)return false;
  const t=Math.max(0,Math.min(1,((station.x-warning.x1)*dx+(station.y-warning.y1)*dy)/lengthSquared));
  return Math.hypot(station.x-(warning.x1+t*dx),station.y-(warning.y1+t*dy))<=stationRadius+warning.width/2;
}

export function stepChargeRound(previous,action={}){
  if(previous.stage!==42)throw new RangeError('INVALID_CHARGE_STAGE');
  const dt=action.dt??0;
  const valid=warningCrossesStation(action.warning)&&action.warning.remaining>dt+1e-9;
  const step=stepBeaconRound(previous,{dt,pickup:Boolean(action.pickup),damaged:Boolean(action.damaged),nearBeacon:valid?action.nearBeacon:null});
  return {state:step.state,events:step.events,interruptId:step.events.includes('beacon-pulsed')?action.warning.id:null};
}
