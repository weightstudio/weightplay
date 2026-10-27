// Shared local acceptance adapter. No password or production unlock is shipped.
const local = globalThis.location?.protocol==='http:' && ['localhost','127.0.0.1','[::1]'].includes(globalThis.location.hostname);
const params = new URLSearchParams(globalThis.location?.search || '');
const requested = local && params.get('practice')==='1';
// The shared analytics loader runs after page parsing. Disable its local event
// collector before it starts so practice runs do not change analytics counts.
if(requested) {
  const analytics=globalThis.WONDER_SITE?.analytics;
  if(analytics)analytics.enabled=false;
  if(analytics?.gaMeasurementId)globalThis[`ga-disable-${analytics.gaMeasurementId}`]=true;
}
let authorized=false;
const adapters=new Map();
// Dynamic access latches any observed authorization loss until a fresh page.
// Existing finite-list callers retain their previous validate return behavior.
let dynamicRevoked=false,validationSerial=0;
function disableDynamicAdapters(){for(const adapter of [...adapters.values()])try{adapter.enable(false)}catch{/* Keep revoking the original adapters. */}}
async function validateDynamic(){
  if(!authorized||dynamicRevoked)return false;
  const serial=++validationSerial;let valid=false;
  try{const res=await fetch('/__weightplay/practice/session',{cache:'no-store',credentials:'same-origin'});valid=res.ok&&(await res.json()).authorized===true}catch{valid=false}
  if(!valid){dynamicRevoked=true;authorized=false;disableDynamicAdapters();return false}
  if(serial!==validationSerial||dynamicRevoked)return false;
  authorized=true;return serial;
}
async function verify() {
  if(!requested)return false;
  try {
    const response=await fetch('/__weightplay/practice/session',{cache:'no-store',credentials:'same-origin'});
    if(response.ok && (await response.json()).authorized) return authorized=true;
    const password=globalThis.prompt?.('Local practice password');
    if(!password)return false;
    const auth=await fetch('/__weightplay/practice/session',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({password})});
    authorized=auth.ok && (await auth.json()).authorized===true;
    if(!authorized)globalThis.alert?.('Local practice authorization failed.');
  } catch { authorized=false; }
  return authorized;
}
const ready=verify();
export const LocalPractice=Object.freeze({
  get enabled(){return authorized;},
  get dynamicEnabled(){return authorized&&!dynamicRevoked;},
  ready,
  async validate() {
    ++validationSerial;
    if(!authorized){dynamicRevoked=true;return false;}
    try {
      const res=await fetch('/__weightplay/practice/session',{cache:'no-store',credentials:'same-origin'});
      authorized=res.ok && (await res.json()).authorized===true;
    }catch{authorized=false;}
    if(!authorized){dynamicRevoked=true;for(const adapter of adapters.values())adapter.enable(false);}
    return authorized;
  },
  async register({gameId,stageIds,acceptStage,enable,startStage}) {
    const fixed=Array.isArray(stageIds)&&stageIds.length>0&&acceptStage===undefined;
    const dynamic=stageIds===undefined&&typeof acceptStage==='function';
    if(!gameId || (!fixed&&!dynamic) || typeof enable!=='function' || typeof startStage!=='function')throw Error('Invalid local practice adapter');
    const adapter={ids:fixed?new Set(stageIds.map(String)):null,acceptStage:dynamic?acceptStage:null,enable,startStage,busy:false};adapters.set(gameId,adapter);
    if(!await ready)return false;
    if(dynamic && (dynamicRevoked || !authorized || adapters.get(gameId)!==adapter))return false;
    if(!document.querySelector('[data-wp-local-practice]')) {
      const badge=document.createElement('small');badge.dataset.wpLocalPractice='';
      badge.textContent='LOCAL PRACTICE';
      badge.title='No campaign progress or rewards are saved';
      badge.setAttribute('aria-label','Local practice; no campaign progress or rewards are saved.');
      // Keep the local-only marker in the scene header, clear of the Battle
      // actions and the Stage tabs at every supported viewport size.
      badge.style.cssText='position:fixed;top:8px;left:50%;transform:translateX(-50%);z-index:10000;background:#17243a;color:#f5c84c;padding:2px 6px;font:11px monospace;pointer-events:none;white-space:nowrap';
      document.body.append(badge);
    }
    adapter.enable(true);
    if(dynamic && (dynamicRevoked || adapters.get(gameId)!==adapter))return false;
    const stage=params.get('practiceStage');
    if(stage!==null){const started=await this.challenge(gameId,stage);if(dynamic&&!started)return false;}
    return true;
  },
  async challenge(gameId,stageId) {
    const adapter=adapters.get(gameId);
    if(!authorized || !adapter)return false;
    if(adapter.ids){
      if(!adapter.ids.has(String(stageId)))return false;
      if(!await this.validate())return false;
      await adapter.startStage(String(stageId),{practice:true,rewards:false,persist:false});
      return true;
    }
    // Dynamic campaigns use canonical positive safe-integer decimal IDs only.
    // Reject object coercion, alternate spellings and overlapping launches.
    if(typeof stageId!=='string'&&typeof stageId!=='number')return false;
    const id=String(stageId);
    if(!/^[1-9][0-9]*$/.test(id)||!Number.isSafeInteger(Number(id))||adapter.busy)return false;
    adapter.busy=true;
    try {
      const checkedSerial=await validateDynamic();
      if(!checkedSerial||dynamicRevoked||!authorized||validationSerial!==checkedSerial||adapters.get(gameId)!==adapter)return false;
      let accepted=false;try{accepted=adapter.acceptStage(id)===true}catch{return false}
      if(!accepted||!authorized||dynamicRevoked||validationSerial!==checkedSerial||adapters.get(gameId)!==adapter)return false;
      let started;try{started=await adapter.startStage(id,{practice:true,rewards:false,persist:false})}catch{return false}
      return started!==false && authorized && !dynamicRevoked && validationSerial===checkedSerial && adapters.get(gameId)===adapter;
    } finally { adapter.busy=false; }
  }
});
