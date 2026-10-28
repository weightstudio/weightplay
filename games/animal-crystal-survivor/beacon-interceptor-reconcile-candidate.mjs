// Unconnected reconciliation experiment for a host which still owns
// state.beaconRound. This is not an atomic transaction or a cross-tab lock.
const record=value=>value!==null && typeof value==='object' && !Array.isArray(value);
function sameExcept(a,b,ignored=[]){
  if(!record(a)||!record(b))return false;
  const keysA=Object.keys(a).sort(),keysB=Object.keys(b).sort();
  return keysA.length===keysB.length && keysA.every((key,i)=>key===keysB[i] && (ignored.includes(key)||Object.is(a[key],b[key])));
}

// Fail closed for any change other than the current host's loss/expiry shape.
// A caller must still remove the exact live cue/actor after receiving the
// cancellation event, and coordinate the call with real host update order.
export function reconcileInterceptorRound(round,authoritative){
  if(!record(round)||round.beacon?.stage!==51||!record(authoritative)||authoritative.stage!==51)
    return {ok:false,reason:'INVALID_ROUND'};
  if(sameExcept(round.beacon,authoritative))return {ok:true,state:round,events:[]};
  if(round.beacon.charge>0 && authoritative.charge===0 && authoritative.dwell===0 &&
     sameExcept(round.beacon,authoritative,['charge','dwell'])) {
    return {ok:true,state:{...round,beacon:authoritative,cue:null,cleared:false,deferDwell:false},
      events:round.cue?['interceptor-cancelled']:[]};
  }
  return {ok:false,reason:'UNEXPECTED_BEACON_CHANGE'};
}
