/** Mahjong events use the platform sample library; this scope owns no audio context. */
export function createCampaignAudio({storage, audio = globalThis.WeightPlayAudio} = {}) {
  let disposed = false;
  const scope = audio?.createScope();
  const events = Object.freeze({select:"board.move",pair:"puzzle.match",undo:"board.undo",win:"result.win",hint:"feedback.hint",shuffle:"card.shuffle",error:"feedback.error"});
  function stop() { scope?.stop(); return Promise.resolve(); }
  function play(kind = "select") {
    if (disposed || !audio || audio.isMuted()) return Promise.resolve();
    const id = events[kind] || (audio.list().includes(kind) ? kind : null);
    if (!id) return Promise.resolve();
    const handle = scope?.play(id);
    return handle?.ended || Promise.resolve();
  }
  function setMuted(value) {
    audio?.setMuted(Boolean(value));
    try { storage?.setItem("wonderSoundMuted", value ? "1" : "0"); } catch (_) { }
    if(value) scope?.stop();
  }
  function dispose() { disposed=true; scope?.dispose(); return Promise.resolve(); }
  return Object.freeze({play,stop,setMuted,isMuted:()=>audio?.isMuted()??true,dispose,
    stats:()=>({disposed,contexts:0,closing:0,nodes:scope?.stats().voices??0})});
}
