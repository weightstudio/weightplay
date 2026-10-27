// Chapter-only wrapper around the unchanged v23 flight engine. Never opens the campaign gate.
export function createBeaconFlight(F,cfg){const state=F.create(cfg);state.beacons=cfg.beacons.map(()=>false);state.signals=cfg.pulseUses;return state;}
export function signalBeacon(F,state,cfg,axis=0){
 if(!state||state.done||state.phase!=='flight'||state.signals<=0||!Number.isFinite(axis))return {used:false,activated:false};
 state.signals--;const index=cfg.beacons.findIndex((b,i)=>!state.beacons[i]&&b.flight===state.node+1&&F.distance(state,b)<=b.r);
 if(index>=0)state.beacons[index]=true;
 state.vx+=Math.max(-1,Math.min(1,axis))*60;
 state.events.push({type:index>=0?'beacon':'signalMiss',x:state.x,y:state.y,index});
 return {used:true,activated:index>=0,index};
}
export function stepBeaconFlight(F,state,cfg,dt,input){
 F.step(state,cfg,dt,input);
 if(state.done&&state.success&&state.beacons.some(v=>!v)){
  state.success=false;state.reason='beaconMissing';state.score=state.collected.length*100;
  state.events=state.events.filter(e=>e.type!=='win');state.events.push({type:'lose',x:state.x,y:state.y});
 }
}
