// Canonical shared sample service only: no private AudioContext or oscillator.
// Genuine continuous engine/tyre recordings remain an explicit art/audio handoff.
export const RACE_SOUNDS = Object.freeze({
  countdown:'ui.tick', go:'game.start', lap:'game.checkpoint',
  ring:'reward.collect', contact:'impact.soft', boost:'movement.dash',
  pad:'movement.dash', driftBoost:'movement.dash',
  win:'result.win', lose:'result.lose'
});
export class RaceAudio {
  constructor() {
    this.disposed=false;
    this.service=globalThis.WeightPlayAudio;
    this.scope=this.service?.createScope?.();
    try { Promise.resolve(this.service?.preload?.([...new Set(Object.values(RACE_SOUNDS))])).catch(()=>{}); }
    catch { /* Audio failure never blocks driving. */ }
  }
  unlock() {
    if(this.disposed)return;
    try { Promise.resolve(this.service?.unlock?.()).catch(()=>{}); }
    catch { /* The next valid gesture can retry. */ }
  }
  event(event) {
    if(this.disposed||event.type==='countdown'&&!event.value)return;
    const id=RACE_SOUNDS[event.type];
    if(!id)return; // No dishonest generic beep/click fallback.
    try { this.scope?.play(id); } catch { /* Silent failure, not gameplay failure. */ }
  }
  silence() { this.scope?.stop(); }
  destroy() {
    if(this.disposed)return;
    this.disposed=true;this.scope?.dispose();this.scope=null;this.service=null;
  }
}
