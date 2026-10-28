// Isolated adapter for a future committed charger. The caller must schedule
// enemy updates, hit processing and the returned state in the same frame.
import {stepChargeRound,warningCrossesStation} from './beacon-charge-candidate.mjs';

export function warningForEnemy(enemy){
  if(!enemy||!Number.isFinite(enemy.hp)||enemy.hp<=0||enemy.beaconChargeInterrupted||enemy.beaconChargeCue?.phase!=='warning')return null;
  const warning={...enemy.beaconChargeCue,live:true,tag:'beacon-charge'};
  return warningCrossesStation(warning)?warning:null;
}

export function stepLiveChargeRound(previous,action,enemies){
  if(!Array.isArray(enemies))throw new TypeError('INVALID_CHARGE_ENEMIES');
  const candidates=enemies.map(enemy=>({enemy,warning:warningForEnemy(enemy)})).filter(item=>item.warning);
  // The caller must keep IDs unique. Reject ambiguous identities instead of
  // silently interrupting an unrelated charger.
  if(new Set(candidates.map(item=>item.warning.id)).size!==candidates.length)throw new Error('DUPLICATE_CHARGE_ID');
  const chosen=candidates.find(item=>item.warning.remaining>(action.dt??0)+1e-9)||null;
  const step=stepChargeRound(previous,{...action,warning:chosen?.warning||null});
  if(!step.interruptId)return {...step,enemies};
  if(!chosen||chosen.warning.id!==step.interruptId||!enemies.includes(chosen.enemy)||!warningForEnemy(chosen.enemy))throw new Error('CHARGE_CHANGED_BEFORE_PULSE');
  return {...step,enemies:enemies.map(enemy=>enemy===chosen.enemy?{...enemy,beaconChargeCue:null,beaconChargeInterrupted:true,chargeAim:null,chargeTimer:3.5}:enemy)};
}
