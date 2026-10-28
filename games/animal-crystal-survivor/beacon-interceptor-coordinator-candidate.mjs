// Unconnected host coordination proposal. Returned state/events must be
// committed by the host together with the corresponding exact actor cleanup.
// No browser, persistence, gameplay integration or atomicity is provided.
import {reconcileInterceptorRound} from './beacon-interceptor-reconcile-candidate.mjs';
import {confirmInterceptorDeath} from './beacon-interceptor-death-candidate.mjs';
import {stepInterceptorRound} from './beacon-interceptor-round-candidate.mjs';

function reconcile(round,authoritative,{practice,stage}={}){
  if(practice!==true || stage!==51)return {ok:false,reason:'PRACTICE_ONLY'};
  const synced=reconcileInterceptorRound(round,authoritative);
  if(!synced.ok)return synced;
  const cancelledId=synced.events.includes('interceptor-cancelled') ? round.cue?.id || null : null;
  return {...synced,cancelledId};
}

export function advanceInterceptorHost(round,authoritative,input,context){
  const synced=reconcile(round,authoritative,context);
  if(!synced.ok)return synced;
  const advanced=stepInterceptorRound(synced.state,input);
  // Do not open the station just because a separate model clock elapsed.
  // The caller must provide the exact unique living actor after host movement
  // and swept collision have committed its matching endpoint.
  if(advanced.events.includes('interceptor-resolved')){
    const cue=synced.state.cue, matches=Array.isArray(context?.enemies)
      ? context.enemies.filter(enemy=>enemy?.beaconInterceptor===true && enemy.beaconInterceptorId===cue?.id) : [];
    const actor=matches[0];
    if(matches.length!==1 || !Number.isFinite(actor.hp) || actor.hp<=0 || actor.beaconChargeCue!==null ||
       !Number.isFinite(actor.x) || !Number.isFinite(actor.y) || Math.hypot(actor.x-cue.x2,actor.y-cue.y2)>1e-6)
      return {ok:false,reason:'INTERCEPTOR_COMPLETION_UNCONFIRMED'};
  }
  const events=[...synced.events,...advanced.events];
  const cancelledId=synced.cancelledId || (advanced.events.includes('interceptor-cancelled') ? synced.state.cue?.id || null : null);
  return {ok:true,state:advanced.state,events,cancelledId};
}

// Call from the exact kill path before the host removes `enemy`; first
// reconcile damage that may have happened earlier in the same update.
export function resolveInterceptorDeathHost(round,authoritative,enemies,enemy,context){
  const synced=reconcile(round,authoritative,context);
  if(!synced.ok)return synced;
  const death=confirmInterceptorDeath(synced.state,enemies,enemy,context);
  return {ok:true,state:death.state,events:[...synced.events,...death.events],cancelledId:synced.cancelledId};
}
