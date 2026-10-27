// Isolated orchestration candidate. It is not imported by the game.
// prepare must build the exact roster and bridge that begin consumes; begin
// must never silently regenerate that roster after the player chose an order.
export function createWaveGate({prepare, show, begin, isCurrent}) {
  if (![prepare, show, begin, isCurrent].every(x => typeof x === 'function')) throw new TypeError('invalid wave gate callbacks');
  let active = null;
  let sequence = 0;
  function invalidate() { if (active) active.phase = 'cancelled'; active = null; }
  function transition({stage, wave, runId, legacyNext}) {
    if (!Number.isInteger(stage) || stage < 1 || stage > 60 || !Number.isInteger(wave) || wave < 1 || wave > 5 || typeof legacyNext !== 'function') return {ok:false, reason:'invalid-wave'};
    if (stage <= 30) { legacyNext(); return {ok:true, legacy:true}; }
    if (active) return {ok:false, reason:'decision-already-open'};
    const ticket = {id:++sequence, stage, wave, runId, phase:'preparing', bundle:null};
    active = ticket;
    try {
      ticket.bundle = prepare({stage, wave, runId});
      if (!ticket.bundle || typeof ticket.bundle.choose !== 'function' || typeof ticket.bundle.start !== 'function') throw Error('invalid prepared wave');
      ticket.phase = 'open';
      // The view sees cues only, never the mutable bridge/start callback.
      const preview = typeof ticket.bundle.preview === 'function' ? ticket.bundle.preview() : null;
      if (active !== ticket || ticket.phase !== 'open') return {ok:false,reason:'decision-changed'};
      show({id:ticket.id, stage, wave, preview});
      if (active !== ticket || ticket.phase !== 'open') return {ok:false,reason:'decision-changed'};
      return {ok:true,id:ticket.id};
    } catch {
      if (active === ticket) ticket.phase = 'halted';
      return {ok:false, reason:'preparation-unconfirmed'};
    }
  }
  function choose(id, type, target) {
    const ticket=active;
    if (!ticket || ticket.id !== id || ticket.phase !== 'open') return {ok:false,reason:'stale-decision'};
    try {
      const result=ticket.bundle.choose(type,target);
      if (active !== ticket || ticket.phase !== 'open') return {ok:false,reason:'decision-changed'};
      return result;
    } catch { if(active===ticket) ticket.phase='halted'; return {ok:false,reason:'choice-unconfirmed'}; }
  }
  function confirm(id) {
    const ticket = active;
    if (!ticket || ticket.id !== id || ticket.phase !== 'open') return {ok:false,reason:'stale-decision'};
    try {
      if (!isCurrent({stage:ticket.stage,wave:ticket.wave,runId:ticket.runId})) return {ok:false,reason:'run-changed'};
      if (active !== ticket || ticket.phase !== 'open') return {ok:false,reason:'decision-changed'};
      // Own the decision before any side effect; repeated clicks/reentrant
      // callbacks cannot spend the same wave's supplies or start it twice.
      ticket.phase='starting';
      const result=ticket.bundle.start();
      if (!result || result.ok !== true) {
        if(active === ticket && ticket.phase === 'starting' && ['target-unavailable','insufficient-supplies'].includes(result?.reason)) {
          ticket.phase='open'; return result;
        }
        if(active === ticket) ticket.phase='halted'; return {ok:false,reason:'start-unconfirmed'};
      }
      if (active !== ticket || ticket.phase !== 'starting') return {ok:false,reason:'decision-changed'};
      begin(ticket.bundle,{stage:ticket.stage,wave:ticket.wave,runId:ticket.runId});
      if (active !== ticket || ticket.phase !== 'starting') return {ok:false,reason:'decision-changed'};
      ticket.phase='started'; active=null;
      return {ok:true};
    } catch { if (active === ticket) ticket.phase='halted'; return {ok:false,reason:'start-unconfirmed'}; }
  }
  return Object.freeze({transition,choose,confirm,invalidate,phase:()=>active?.phase ?? 'idle'});
}
