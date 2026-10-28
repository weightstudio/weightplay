// Unconnected host adapter. Invoke only from the real kill path while the
// exact dead enemy is still in the host's live-enemy array. This function
// mutates neither the host array nor the candidate round.
import {stepInterceptorRound} from './beacon-interceptor-round-candidate.mjs';

export function confirmInterceptorDeath(round,enemies,enemy,{practice,stage}={}) {
  if (practice!==true || stage!==51 || !Array.isArray(enemies) || !enemy ||
      enemy.beaconInterceptor!==true || typeof enemy.beaconInterceptorId!=='string' ||
      !enemy.beaconInterceptorId || !Number.isFinite(enemy.hp) || enemy.hp>0 ||
      !enemies.includes(enemy) || round?.cue?.id!==enemy.beaconInterceptorId ||
      enemies.filter(item=>item?.beaconInterceptor===true && item.beaconInterceptorId===enemy.beaconInterceptorId).length!==1)
    return {state:round,events:[]};
  return stepInterceptorRound(round,{defeatedId:enemy.beaconInterceptorId});
}
