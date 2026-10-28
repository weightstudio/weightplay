// Authenticated local-practice bridge; the caller installs collector/storage
// guards and checks authorization around asynchronous engine startup.
export async function mountBeaconPractice({localPractice,enable,start,halt,host=globalThis}) {
  if (!localPractice || typeof enable!=='function' || typeof start!=='function' || typeof halt!=='function') throw new TypeError('Invalid practice hooks');
  let closed=false,checking=false,timer=null;
  const revoke=()=>{if(closed)return;closed=true;if(timer!==null)host.clearInterval(timer);host.removeEventListener?.('pagehide',revoke);try{enable(false)}finally{halt()}};
  host.addEventListener?.('pagehide',revoke,{once:true});
  let ok;
  try {ok=await localPractice.register({
    gameId:'animal-crystal-survivor',
    // Register only wired local slices; 51–60 remain design candidates.
    acceptStage:id=>id==='31'||id==='32'||id==='33'||id==='34'||id==='35'||id==='36'||id==='37'||id==='38'||id==='39'||id==='40'||id==='41'||id==='42'||id==='43'||id==='44'||id==='45'||id==='46'||id==='47'||id==='48'||id==='49'||id==='50',
    enable:value=>{if(!value)revoke();else if(!closed)enable(true)},
    // The engine must check isActive again after every await before exposing
    // or resuming a round; the bridge cannot cancel an arbitrary engine await.
    startStage:async id=>{if(closed||!['31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50'].includes(id))return false;const result=await start(Number(id),()=>!closed&&localPractice.dynamicEnabled===true);if(closed){halt();return false}return result},
  })}catch{revoke();return {ok:false,close:revoke}}
  if(!ok||closed||localPractice.dynamicEnabled!==true){revoke();return {ok:false,close:revoke}}
  try {timer=host.setInterval(async()=>{
    if(closed||checking)return;checking=true;
    try{if(!await localPractice.validate())revoke()}catch{revoke()}finally{checking=false}
  },1500)}catch{revoke();return {ok:false,close:revoke}}
  return {ok:true,close:revoke};
}
