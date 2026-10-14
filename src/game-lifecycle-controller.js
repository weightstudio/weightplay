/*
 * Opt-in lifecycle clock for game-owned elapsed-time adapters.
 * It never advances game state or infers economy rules itself.
 */
(() => {
  "use strict";
  const REGISTRY = new Map();
  const now = () => Date.now();

  function register(gameId, options = {}) {
    const id = String(gameId || "").trim();
    if (!id) throw new TypeError("WeightPlayLifecycle.register requires a stable game id");
    const background = options.background ?? "pause";
    if (background !== "pause" && background !== "continue") throw new TypeError('background must be "pause" or "continue"');
    const onElapsed = options.onElapsed;
    const onStateChange = options.onStateChange;
    if (onStateChange !== undefined && typeof onStateChange !== "function") throw new TypeError("onStateChange must be a function");
    if (background === "continue" && typeof onElapsed !== "function") throw new TypeError('background: "continue" requires a game-owned onElapsed adapter');

    let entry = REGISTRY.get(id);
    if (entry) {
      if (entry.background !== background || entry.onElapsed !== onElapsed || entry.onStateChange !== onStateChange) throw new Error(`WeightPlayLifecycle already registered with different options: ${id}`);
      entry.references += 1;
      let leaseDisposed = false;
      return Object.freeze({
        get active() { return entry.active; },
        get hidden() { return entry.hidden; },
        get pauseReasons() { return entry.pauseReasons; },
        setPaused: (...args) => entry.setPaused(...args),
        checkpoint: (...args) => entry.checkpoint(...args),
        dispose() { if (leaseDisposed) return; leaseDisposed = true; entry.release(); },
      });
    }

    const reasons = new Set();
    let hidden = Boolean(document.hidden);
    let anchor = now();
    let disposed = false;
    const elapsedTo = (at) => {
      if (!Number.isFinite(at) || at < anchor) { anchor = Number.isFinite(at) ? at : anchor; return 0; }
      const elapsed = at - anchor; anchor = at; return elapsed;
    };
    const isActive = () => !disposed && !hidden && reasons.size === 0;
    const flush = (at = now(), source = "visible") => {
      const elapsedMs = elapsedTo(at);
      if (elapsedMs > 0 && background === "continue" && reasons.size === 0) {
        try { onElapsed(elapsedMs, { source, gameId: id }); }
        catch (error) { reasons.add("adapter-error"); throw error; }
      }
      return elapsedMs;
    };
    const onVisibility = () => {
      const nextHidden = Boolean(document.hidden);
      if (nextHidden === hidden) return;
      if (nextHidden) {
        hidden = true;
        entry.notifyState("hide");
        flush(now(), "hide");
      } else {
        hidden = false;
        flush(now(), "show");
        entry.notifyState("show");
      }
    };
    const onPageHide = () => { if (!hidden) flush(now(), "pagehide"); };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);

    entry = {
      background, onElapsed, onStateChange, references: 1,
      get active() { return isActive(); },
      get hidden() { return hidden; },
      get pauseReasons() { return [...reasons]; },
      notifyState(source) {
        if (typeof onStateChange !== "function") return;
        try { onStateChange(isActive(), { source, hidden, pauseReasons: [...reasons], gameId: id }); }
        catch (error) { reasons.add("state-error"); throw error; }
      },
      setPaused(reason, paused = true) {
        if (disposed) return false;
        const wasActive = isActive();
        const key = String(reason || "").trim();
        if (!key || key === "hidden") throw new TypeError("Use a named non-hidden pause reason");
        if (paused && !reasons.has(key)) {
          if (reasons.size === 0) {
            try { flush(now(), "pause"); }
            catch (error) {
              // Preserve the explicit user/modal/scene pause even when settling
              // the preceding interval fails; the error reason remains separate.
              reasons.add(key);
              if (wasActive !== isActive()) { try { this.notifyState("pause"); } catch { /* Preserve the elapsed-adapter failure. */ } }
              throw error;
            }
          }
          reasons.add(key);
        } else if (!paused && reasons.has(key)) {
          reasons.delete(key);
          if (reasons.size === 0) anchor = now();
        }
        if (wasActive !== isActive()) this.notifyState(paused ? "pause" : "resume");
        return isActive();
      },
      checkpoint() { return disposed ? 0 : flush(now(), "checkpoint"); },
      release() {
        if (disposed) return;
        this.references -= 1;
        if (this.references > 0) return;
        disposed = true;
        document.removeEventListener("visibilitychange", onVisibility);
        window.removeEventListener("pagehide", onPageHide);
        if (REGISTRY.get(id) === this) REGISTRY.delete(id);
      },
    };
    REGISTRY.set(id, entry);
    try { entry.notifyState("register"); }
    catch (error) { entry.release(); throw error; }
    // Return a lease rather than the registry entry so repeated registration
    // and independent teardown are balanced and idempotent.
    let leaseDisposed = false;
    return Object.freeze({
      get active() { return entry.active; },
      get hidden() { return entry.hidden; },
      get pauseReasons() { return entry.pauseReasons; },
      setPaused: (...args) => entry.setPaused(...args),
      checkpoint: (...args) => entry.checkpoint(...args),
      dispose() { if (leaseDisposed) return; leaseDisposed = true; entry.release(); },
    });
  }
  window.WeightPlayLifecycle = Object.freeze({ register, get registeredGameIds() { return [...REGISTRY.keys()]; } });
})();
