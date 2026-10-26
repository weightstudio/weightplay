// PROTOTYPE_NOT_IN_GAME: integration must call cancel() whenever the stage,
// attempt, or puzzle state changes, and dispose() on teardown. No sync fallback.
const CODES = new Set(['invalid_request','worker_failed']);
const ACTIONS = new Set(['valve','route','clip','transfer','capture']);
const error = code => ({status:'error',code});
const cancelled = () => ({status:'cancelled'});

export function createHintClient({createWorker, documentTarget = globalThis.document,
  windowTarget = globalThis.window, timeoutMs = 5000} = {}) {
  let active = null, disposed = false, nextId = 0;
  const timeout = Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 5000;
  const bindings = [];
  const bind = (target, name, callback) => {
    if (!target?.addEventListener) return;
    target.addEventListener(name, callback);
    bindings.push(() => target.removeEventListener(name, callback));
  };
  function finish(pending, result) {
    if (active !== pending) return;
    active = null;
    clearTimeout(pending.timer);
    for (const [event, listener] of pending.listeners) {
      try { pending.worker.removeEventListener?.(event,listener); } catch (_) { /* Termination still settles the request. */ }
    }
    try { pending.worker.terminate(); } catch (_) { /* Already settled. */ }
    pending.resolve(result);
  }
  function cancel() { if (active) finish(active,cancelled()); }
  function dispose() {
    if (disposed) return;
    disposed = true;
    cancel();
    for (const remove of bindings.splice(0)) { try { remove(); } catch (_) { /* Continue teardown. */ } }
  }
  bind(documentTarget,'visibilitychange',() => { if (documentTarget.hidden || documentTarget.visibilityState === 'hidden') cancel(); });
  bind(windowTarget,'pagehide',cancel);
  bind(windowTarget,'unload',dispose);
  function request(stageNumber,state) {
    cancel();
    if (disposed) return Promise.resolve(error('disposed'));
    if (documentTarget?.hidden || documentTarget?.visibilityState === 'hidden') return Promise.resolve(cancelled());
    let worker;
    try {
      if (createWorker) worker = createWorker();
      else if (typeof globalThis.Worker === 'function') worker = new globalThis.Worker(new URL('./stage60-hint-worker.mjs?v=20261027-dewline-v19',import.meta.url), {type:'module'});
      else return Promise.resolve(error('unsupported'));
      if (!worker || typeof worker.postMessage !== 'function' || typeof worker.addEventListener !== 'function' || typeof worker.terminate !== 'function') {
        try { worker?.terminate?.(); } catch (_) {}
        return Promise.resolve(error('worker_failed'));
      }
    } catch (_) { return Promise.resolve(error('worker_failed')); }
    const id = ++nextId;
    return new Promise(resolve => {
      const pending = {worker,resolve,timer:null,listeners:[]};
      active = pending;
      const onMessage = event => {
        const message = event.data;
        if (active !== pending || message?.id !== id) return;
        if (message.type !== 'result') return finish(pending,error('invalid_result'));
        if (message.status === 'error') return finish(pending,error(CODES.has(message.code) ? message.code : 'invalid_result'));
        if ((message.status === 'ready' || message.status === 'unreachable') && message.action === null)
          return finish(pending,{status:message.status,action:null});
        if (message.status === 'step' && message.action && typeof message.action === 'object' && ACTIONS.has(message.action.type))
          return finish(pending,{status:'step',action:message.action});
        return finish(pending,error('invalid_result'));
      };
      const onError = event => { event?.preventDefault?.(); finish(pending,error('worker_failed')); };
      pending.listeners = [['message',onMessage],['error',onError],['messageerror',onError]];
      try {
        for (const [event, listener] of pending.listeners) worker.addEventListener(event,listener);
        pending.timer = setTimeout(() => finish(pending,error('timeout')),timeout);
        worker.postMessage({type:'solve',id,stageNumber,state});
      } catch (_) { finish(pending,error('worker_failed')); }
    });
  }
  return Object.freeze({request,cancel,dispose});
}
