// Unconnected synchronous host experiment. This module does not enable a
// practice entry, persist progress or credit rewards. The caller must still
// wire actual combat death, movement, collision, input, cues and cleanup.
import {advanceInterceptorHost,resolveInterceptorDeathHost} from './beacon-interceptor-coordinator-candidate.mjs';
import {beaconCircuitStages} from './beacon-circuit-candidate.mjs';
const plan=beaconCircuitStages.find(stage=>stage.stage===51);

export function stepInterceptorWorld(world,{practice,dt,damage}={}){
  if(practice!==true || world?.stage!==51 || !Array.isArray(world.enemies) ||
     !world.player || !Number.isFinite(world.player.x) || !Number.isFinite(world.player.y) ||
     !Number.isFinite(world.player.pickup) || world.player.pickup<0 ||
     !Number.isFinite(damage) || damage<=0 || !Number.isFinite(dt) || dt<0 || dt>.25)
    return {ok:false,reason:'INVALID_HOST'};
  const drop=world.beaconDrop;
  if(drop!=null && (!Number.isFinite(drop.x)||!Number.isFinite(drop.y)))return {ok:false,reason:'INVALID_DROP'};
  const pickup=Boolean(drop && Math.hypot(drop.x-world.player.x,drop.y-world.player.y)<=world.player.pickup);
  const station=plan.beacons.find(item=>item.id===plan.order[0]);
  const nearBeacon=Math.hypot(world.player.x-station.x,world.player.y-station.y)<=plan.lamp.radius?station.id:null;
  const before=world.interceptorRound;
  let stepped;
  try { stepped=advanceInterceptorHost(before,world.beaconRound,{dt,pickup,nearBeacon,player:world.player},
    {practice:true,stage:51,enemies:world.enemies}); }
  catch { return {ok:false,reason:'INVALID_INTERCEPTOR_INPUT'}; }
  if(!stepped.ok)return stepped;
  const removingId=stepped.cancelledId || (stepped.events.includes('interceptor-resolved') ? before?.cue?.id : null);
  const matches=removingId ? world.enemies.filter(enemy=>enemy?.beaconInterceptor===true && enemy.beaconInterceptorId===removingId) : [];
  if(removingId && matches.length!==1)return {ok:false,reason:'INTERCEPTOR_REMOVAL_UNCONFIRMED'};
  let enemies=removingId ? world.enemies.filter(enemy=>enemy!==matches[0]) : world.enemies;
  if(stepped.events.includes('interceptor-warning')){
    const cue=stepped.state.cue;
    if(!cue || enemies.some(enemy=>enemy?.beaconInterceptor===true && enemy.beaconInterceptorId===cue.id))
      return {ok:false,reason:'INTERCEPTOR_SPAWN_UNCONFIRMED'};
    enemies=[...enemies,{x:cue.x1,y:cue.y1,hp:60,maxHp:60,speed:162,baseSpeed:162,
      size:58,damage,image:'runner',role:'charger',hit:0,touch:0,chargeTimer:3.5,
      beaconInterceptor:true,beaconInterceptorId:cue.id,beaconChargeCue:cue}];
  }
  // Single synchronous commit after every check. Existing enemy objects keep
  // identity so the game's in-flight shots still reference their targets.
  world.interceptorRound=stepped.state;
  world.beaconRound=stepped.state.beacon;
  world.enemies=enemies;
  if(stepped.events.includes('charge-picked-up'))world.beaconDrop=null;
  return {ok:true,events:stepped.events};
}

// A future host invokes this within its kill callback, before the normal kill
// logic removes `enemy` and grants its ordinary XP. A pending cue cancelled by
// earlier damage must not be forgotten when an unrelated enemy dies first.
export function commitInterceptorDeath(world,enemy,{practice}={}){
  if(practice!==true || world?.stage!==51 || !Array.isArray(world.enemies))return {ok:false,reason:'INVALID_HOST'};
  const stepped=resolveInterceptorDeathHost(world.interceptorRound,world.beaconRound,world.enemies,enemy,
    {practice:true,stage:51});
  if(!stepped.ok)return stepped;
  const matches=stepped.cancelledId ? world.enemies.filter(item=>item?.beaconInterceptor===true && item.beaconInterceptorId===stepped.cancelledId) : [];
  if(stepped.cancelledId && matches.length!==1)return {ok:false,reason:'INTERCEPTOR_REMOVAL_UNCONFIRMED'};
  // If this same actor is the victim, the host's existing kill path remains
  // responsible for removing it and granting the ordinary kill/XP exactly once.
  const enemies=matches.length && matches[0]!==enemy ? world.enemies.filter(item=>item!==matches[0]) : world.enemies;
  world.interceptorRound=stepped.state;
  world.beaconRound=stepped.state.beacon;
  world.enemies=enemies;
  return {ok:true,events:stepped.events};
}
