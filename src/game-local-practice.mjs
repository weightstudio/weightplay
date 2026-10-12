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
  ready,
  async validate() {
    if(!authorized)return false;
    try {
      const res=await fetch('/__weightplay/practice/session',{cache:'no-store',credentials:'same-origin'});
      authorized=res.ok && (await res.json()).authorized===true;
    }catch{authorized=false;}
    if(!authorized)for(const adapter of adapters.values())adapter.enable(false);
    return authorized;
  },
  async register({gameId,stageIds,enable,startStage}) {
    if(!gameId || !Array.isArray(stageIds) || !stageIds.length || typeof enable!=='function' || typeof startStage!=='function')throw Error('Invalid local practice adapter');
    const adapter={ids:new Set(stageIds.map(String)),enable,startStage};adapters.set(gameId,adapter);
    if(!await ready)return false;
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
    const stage=params.get('practiceStage');
    if(stage!==null)await this.challenge(gameId,stage);
    return true;
  },
  async challenge(gameId,stageId) {
    const adapter=adapters.get(gameId);
    if(!authorized || !adapter || !adapter.ids.has(String(stageId)))return false;
    // Recheck server-side session before each direct challenge.
    if(!await this.validate())return false;
    await adapter.startStage(String(stageId),{practice:true,rewards:false,persist:false});
    return true;
  }
});
