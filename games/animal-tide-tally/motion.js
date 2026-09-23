/* Decorative motion only. Puzzle state never lives in an animation callback. */
(function (root) {
  'use strict';
  class TideMotion {
    constructor(preference = root.matchMedia?.('(prefers-reduced-motion: reduce)')) {
      this.preference = preference;
      this.reduced = Boolean(preference?.matches);
      this.animations = new Set();
      this.reasons = new Set();
      this.generation = 0;
      this.disposed = false;
      this.onPreference = event => {
        this.reduced = Boolean(event.matches);
        if (this.reduced) for (const record of [...this.animations]) {
          if (record.ambient) record.animation.cancel();
          else { try { record.animation.finish(); } catch { record.animation.cancel(); } }
        }
      };
      preference?.addEventListener?.('change', this.onPreference);
    }
    animate(node, frames, options = {}) {
      if (this.disposed) return Promise.resolve(false);
      if (this.reduced || !node?.animate) return Promise.resolve(true);
      const generation = this.generation;
      let animation;
      try {
        animation = node.animate(frames, {
          duration: 320, easing: 'cubic-bezier(.2,.75,.25,1)', fill: 'none', ...options
        });
      } catch { return Promise.resolve(true); }
      const record = {animation, ambient: options.iterations === Infinity};
      this.animations.add(record);
      if (this.reasons.size) animation.pause();
      return animation.finished.then(
        () => !this.disposed && generation === this.generation,
        () => false
      ).finally(() => this.animations.delete(record));
    }
    enter(nodes, direction = 1) {
      return Promise.all([...nodes].map((node, index) => this.animate(node, [
        {opacity: .15, transform: `translate(${direction * 24}px, 10px)`},
        {opacity: 1, transform: 'translate(0, 0)'}
      ], {duration: 340, delay: Math.min(index, 8) * 24}))).then(results => results.every(Boolean));
    }
    pulse(node, wrong = false) {
      return this.animate(node, wrong ? [
        {transform: 'translateX(0)'}, {transform: 'translateX(-5px)'},
        {transform: 'translateX(5px)'}, {transform: 'translateX(-3px)'},
        {transform: 'translateX(0)'}
      ] : [
        {transform: 'scale(1)', opacity: 1},
        {transform: 'scale(1.12)', opacity: .8},
        {transform: 'scale(1)', opacity: 1}
      ], {duration: wrong ? 240 : 320});
    }
    pause(reason) {
      if (this.disposed || this.reasons.has(reason)) return;
      this.reasons.add(reason);
      for (const {animation} of this.animations) if (animation.playState === 'running') animation.pause();
    }
    resume(reason) {
      this.reasons.delete(reason);
      if (this.disposed || this.reasons.size) return;
      for (const {animation} of this.animations) if (animation.playState === 'paused') animation.play();
    }
    cancel() {
      this.generation++;
      for (const {animation} of this.animations) animation.cancel();
      this.animations.clear();
    }
    snapshot() {
      return {generation: this.generation, active: this.animations.size,
        paused: [...this.reasons], reduced: this.reduced, disposed: this.disposed};
    }
    destroy() {
      this.cancel(); this.disposed = true; this.reasons.clear();
      this.preference?.removeEventListener?.('change', this.onPreference);
    }
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = TideMotion;
  else root.AnimalTideMotion = TideMotion;
})(globalThis);
