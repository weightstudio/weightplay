/* Sanctuary Loop presentation only. Never changes collision, time, rewards or saves. */
(function (root) {
  "use strict";
  const clamp01 = (value) => Math.max(0, Math.min(1, value));
  const easeOut = (value) => 1 - (1 - clamp01(value)) ** 3;
  function smoothAngle(from, to, dt) {
    if (!Number.isFinite(from)) return to;
    const delta = Math.atan2(Math.sin(to - from), Math.cos(to - from));
    return from + delta * (1 - Math.exp(-14 * Math.max(0, dt)));
  }
  function create() {
    const media = root.matchMedia?.("(prefers-reduced-motion: reduce)");
    const animations = new Set();
    const reduced = () => Boolean(media?.matches);
    function cancelUI() {
      for (const animation of animations) animation.cancel();
      animations.clear();
    }
    function reveal(node, delay = 0) {
      if (!node?.animate || reduced() || node.hidden) return;
      // Fade the authored content, never transform a shared shell or a hit target.
      if (animations.size >= 24) {
        const oldest = animations.values().next().value;
        oldest.cancel(); animations.delete(oldest);
      }
      const animation = node.animate([{ opacity: 0.35 }, { opacity: 1 }], {
        duration: 210, delay: Math.min(160, Math.max(0, delay)),
        easing: "cubic-bezier(.2,.7,.2,1)", fill: "none",
      });
      animations.add(animation);
      animation.finished.then(() => animations.delete(animation), () => animations.delete(animation));
    }
    function pauseUI(paused) {
      for (const animation of animations) paused ? animation.pause() : animation.play();
    }
    function field() { return { effects: [] }; }
    function emit(state, kind, x, y, now, { cells = [], amount = "" } = {}) {
      if (!state || reduced()) return;
      // One large capture cannot create a cell-sized particle storm or grow memory.
      const stride = Math.max(1, Math.ceil(cells.length / 256));
      const sampled = cells.filter((_, index) => index % stride === 0).slice(0, 256);
      state.effects.push({ kind, x, y, born: now, life: kind === "hurt" ? 0.62 : 0.92, cells: sampled, amount });
      if (state.effects.length > 12) state.effects.splice(0, state.effects.length - 12);
    }
    function updateFacing(run, dt) {
      const { player } = run;
      if (player.dx || player.dy) {
        const target = Math.atan2(player.dy, player.dx) + Math.PI / 2;
        player.visualAngle = reduced() ? target : smoothAngle(player.visualAngle, target, dt);
      }
      for (const hunter of run.hunters) {
        const target = hunter.angle + Math.PI / 2;
        hunter.visualAngle = reduced() ? target : smoothAngle(hunter.visualAngle, target, dt);
      }
    }
    function drawEffects(ctx, state, now, size, grid = 48) {
      if (!state) return;
      state.effects = state.effects.filter((effect) => now - effect.born < effect.life);
      if (reduced()) { state.effects.length = 0; return; }
      ctx.save();
      for (const effect of state.effects) {
        const age = clamp01((now - effect.born) / effect.life);
        const eased = easeOut(age);
        const color = effect.kind === "hurt" ? "#ff8b96" : effect.kind === "marker" ? "#ffe489" : "#87ffe2";
        ctx.fillStyle = color;
        ctx.globalAlpha = (1 - age) * 0.55;
        for (const index of effect.cells) ctx.fillRect((index % grid) * size, Math.floor(index / grid) * size, size, size);
        ctx.globalAlpha = (1 - age) * 0.85;
        ctx.strokeStyle = color;
        ctx.lineWidth = Math.max(2, size * 0.14);
        ctx.beginPath();
        ctx.arc(effect.x * size, effect.y * size, (0.7 + eased * 4.4) * size, 0, Math.PI * 2);
        ctx.stroke();
        for (let index = 0; index < 10; index += 1) {
          const angle = index * Math.PI * 2 / 10;
          const distance = (0.5 + eased * (2 + index % 3)) * size;
          const radius = (0.08 + (1 - age) * 0.1) * size;
          ctx.beginPath();
          ctx.arc(effect.x * size + Math.cos(angle) * distance, effect.y * size + Math.sin(angle) * distance, radius, 0, Math.PI * 2);
          ctx.fill();
        }
        if (effect.amount) {
          ctx.globalAlpha = 1 - age;
          ctx.font = `800 ${Math.max(18, size * 1.7)}px system-ui`;
          ctx.textAlign = "center";
          ctx.lineWidth = 4;
          ctx.strokeStyle = "#071b26";
          const x = Math.max(size * 4, Math.min((grid - 4) * size, effect.x * size));
          const y = Math.max(size * 2, (effect.y - 2 - eased * 2) * size);
          ctx.strokeText(effect.amount, x, y);
          ctx.fillText(effect.amount, x, y);
        }
      }
      ctx.restore();
    }
    function drawSignals(ctx, run, size) {
      ctx.save();
      const pulse = reduced() ? 0.5 : (Math.sin(run.elapsed * 4) + 1) / 2;
      // Objective rings remain in reduced motion; only their breathing is disabled.
      const nextSeal = run.markers.find((marker) => marker.type === "seal" && !marker.done);
      for (const marker of run.markers) {
        if (marker.done || (marker.type === "seal" && marker !== nextSeal)) continue;
        ctx.strokeStyle = marker.type === "seal" ? "#ffe489" : "#8effe4";
        ctx.globalAlpha = 0.6 + pulse * 0.3;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(marker.x * size, marker.y * size, (1.7 + pulse * 0.12) * size, 0, Math.PI * 2);
        ctx.stroke();
      }
      for (const hunter of run.hunters) {
        const phase = hunter.abilityClock % 3.4;
        if (!run.trail.size || hunter.type !== "runner" || phase < 2.65) continue;
        const ready = (phase - 2.65) / 0.75;
        ctx.globalAlpha = 0.85;
        ctx.strokeStyle = "#ffd57d";
        ctx.lineWidth = Math.max(3, size * 0.18);
        ctx.beginPath();
        ctx.arc(hunter.x * size, hunter.y * size, hunter.size * size * 0.64, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ready);
        ctx.stroke();
      }
      ctx.globalAlpha = 0.65;
      ctx.strokeStyle = run.trail.size ? "#ffe489" : "#8effe4";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(run.player.x * size, run.player.y * size, (1.45 + pulse * 0.08) * size, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    return { get reduced() { return reduced(); }, reveal, cancelUI, pauseUI, field, emit, updateFacing, drawEffects, drawSignals };
  }
  const api = { create, smoothAngle, easeOut };
  root.SanctuaryLoopMotion = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
}(typeof window === "undefined" ? globalThis : window));
