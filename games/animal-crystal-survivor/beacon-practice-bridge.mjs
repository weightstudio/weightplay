// Unconnected local-practice bridge candidate. The current v50 entry does not
// import this file; the future engine caller must supply the listed hooks and
// install its collector/storage guards before calling it.
export async function mountBeaconPractice({localPractice,enable,start,halt,host=globalThis}) {
  if (!localPractice || typeof enable!=='function' || typeof start!=='function' || typeof halt!=='function') throw new TypeError('Invalid practice hooks');
  let closed=false,checking=false,timer=null;
  const revoke=()=>{if(closed)return;closed=true;if(timer!==null)host.clearInterval(timer);host.removeEventListener?.('pagehide',revoke);try{enable(false)}finally{halt()}};
  host.addEventListener?.('pagehide',revoke,{once:true});
  let ok;
  try {ok=await localPractice.register({
    gameId:'animal-crystal-survivor',
    // Only the actual first playable slice may be offered; the other candidate
    // labels are not implementations and must never produce empty stage cards.
    acceptStage:id=>id==='31',
    enable:value=>{if(!value)revoke();else if(!closed)enable(true)},
    // The engine must check isActive again after every await before exposing
    // or resuming a round; the bridge cannot cancel an arbitrary engine await.
    startStage:async id=>{if(closed||id!=='31')return false;const result=await start(31,()=>!closed&&localPractice.dynamicEnabled===true);if(closed){halt();return false}return result},
  })}catch{revoke();return {ok:false,close:revoke}}
  if(!ok||closed||localPractice.dynamicEnabled!==true){revoke();return {ok:false,close:revoke}}
  try {timer=host.setInterval(async()=>{
    if(closed||checking)return;checking=true;
    try{if(!await localPractice.validate())revoke()}catch{revoke()}finally{checking=false}
  },1500)}catch{revoke();return {ok:false,close:revoke}}
  return {ok:true,close:revoke};
}
