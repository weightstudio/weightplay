/* Deterministic gameplay, independent of the renderer and browser timers. */
(function (root) {
  "use strict";
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  function segmentDistance(a, b, p) {
    const dx = b.x - a.x, dy = b.y - a.y;
    const t = clamp(((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy || 1), 0, 1);
    return Math.hypot(p.x - a.x - t * dx, p.y - a.y - t * dy);
  }
  class Round {
    constructor(definition, width, height) {
      this.definition = definition;
      this.width = width; this.height = height;
      this.seed = definition.id * 100 + 1;
      this.time = 0; this.nextSpawn = .35; this.group = 0; this.serial = 0;
      this.targets = []; this.events = []; this.score = 0; this.chain = 0;
      this.peakChain = 0; this.harvested = 0; this.misses = 0;
      this.checkpointHit = false; this.checkpointSpawned = false;
      this.finished = false; this.won = false; this.reason = null;
      this.lastHit = -Infinity; this.accumulator = 0;
    }
    random() { this.seed = (this.seed * 1664525 + 1013904223) >>> 0; return this.seed / 4294967296; }
    get radius() { return clamp(Math.min(this.width * .065, this.height * .11), 20, 30); }
    resize(width, height) {
      if (width <= 0 || height <= 0) return;
      const sx = width / this.width, sy = height / this.height;
      this.width = width; this.height = height;
      for (const t of this.targets) { t.x *= sx; t.baseX *= sx; t.y *= sy; t.vx *= sx; t.vy *= sy; t.gravity *= sy; t.r = this.radius; }
    }
    spawn(hazard = false, lane = null) {
      const d = this.definition, r = this.radius;
      const slot = lane ?? this.random();
      const x = r * 2 + slot * Math.max(0, this.width - r * 4);
      // Do not launch a pod through a fruit's readable picking area.
      if (hazard && this.targets.some(t => Math.abs(t.x - x) < r * 3.2)) return;
      const checkpoint = !hazard && d.checkpoint && !this.checkpointSpawned && this.group >= 3;
      if (checkpoint) this.checkpointSpawned = true;
      const flight = 2.8 - (d.id - 1) * .019 - (d.mechanic === "rush" ? .25 : 0);
      const rise = Math.max(r * 2.7, this.height * (d.mechanic === "long" ? .76 : .65));
      const t = { id: ++this.serial, x, baseX: x, y: this.height + r,
        vx: (this.width / 390) * ((this.random() - .5) * 13 + (d.wind || 0) * 45),
        vy: -4 * rise / flight, gravity: 8 * rise / (flight * flight),
        r, age: 0, phase: this.random() * Math.PI * 2, hazard, checkpoint,
        kind: Math.floor(this.random() * 3), rotation: (this.random() - .5) * .4 };
      this.targets.push(t);
      this.events.push({ type: "spawn", target: { ...t } });
    }
    spawnGroup() {
      const d = this.definition;
      const pair = d.mechanic === "split" || (d.rhythm && this.group % 2 === 1) || (d.id >= 16 && this.group % 3 === 2);
      if (pair) { this.spawn(false, .2); this.spawn(false, .8); }
      else this.spawn(false, .12 + this.random() * .76);
      // A guaranteed safe opening teaches the gesture before introducing danger.
      if (d.id > 1 && this.group >= 2 && this.random() < d.hazard * 1.7) this.spawn(true);
      this.group++;
      const gap = Math.max(.78, 1.2 - d.id * .011);
      this.nextSpawn += d.rhythm ? (this.group % 2 ? .6 : 1.25) : d.mechanic === "focus" ? 1.35 : gap;
    }
    swipe(a, b, padding = 5) {
      if (this.finished) return [];
      const hits = this.targets.filter(t => t.y - t.r < this.height && segmentDistance(a, b, t) <= t.r + padding)
        .sort((x, y) => Math.hypot(x.x - a.x, x.y - a.y) - Math.hypot(y.x - a.x, y.y - a.y));
      const collected = [];
      for (const t of hits) {
        this.targets.splice(this.targets.indexOf(t), 1);
        if (t.hazard) {
          this.chain = 0; this.misses = 3;
          this.events.push({ type: "hazard", target: { ...t } });
          this.end("hazard"); break;
        }
        this.chain = this.time - this.lastHit <= 1.65 ? this.chain + 1 : 1;
        this.lastHit = this.time; this.peakChain = Math.max(this.peakChain, this.chain);
        const points = 10 + Math.min(20, (this.chain - 1) * 2) + (t.checkpoint ? 25 : 0);
        this.score += points; this.harvested++;
        this.checkpointHit ||= t.checkpoint;
        const event = { type: "harvest", target: { ...t }, points, chain: this.chain };
        this.events.push(event); collected.push(event);
      }
      return collected;
    }
    step(dt) {
      if (this.finished) return;
      // Fixed integration keeps paths, losses and spawn schedules equal at 30/60/120 Hz.
      this.accumulator += clamp(dt, 0, .1);
      while (this.accumulator >= 1 / 120 && !this.finished) { this.tick(1 / 120); this.accumulator -= 1 / 120; }
    }
    tick(dt) {
      this.time += dt;
      const d = this.definition;
      if (this.time < d.duration && this.time >= this.nextSpawn) this.spawnGroup();
      for (const t of this.targets) {
        t.age += dt;
        const direction = d.mechanic === "windSwitch" && Math.floor(this.time / 3) % 2 ? -1 : 1;
        const gust = d.mechanic === "gust" ? 1 + Math.sin(this.time * 3) : 1;
        t.baseX += t.vx * direction * gust * dt;
        t.x = clamp(t.baseX + Math.sin(t.age * 3.4 + t.phase) * (d.weave || 0) * this.width * .022, t.r, this.width - t.r);
        t.y += t.vy * dt; t.vy += t.gravity * dt;
      }
      const lost = this.targets.filter(t => t.y > this.height + t.r * 1.5 && t.vy > 0);
      for (const t of lost) {
        this.targets.splice(this.targets.indexOf(t), 1);
        if (!t.hazard) {
          this.misses++; this.chain = 0;
          this.events.push({ type: "miss", target: { ...t }, misses: this.misses });
          if (this.misses >= 3) { this.end("misses"); return; }
        }
      }
      if (this.time - this.lastHit > 1.65) this.chain = 0;
      if (this.time >= d.duration && !this.targets.some(t => !t.hazard)) this.end(this.harvested ? "clear" : "empty");
    }
    end(reason) { this.finished = true; this.reason = reason; this.won = reason === "clear"; this.events.push({ type: "finish", won: this.won, reason }); }
    drain() { return this.events.splice(0); }
  }
  const api = { Round, segmentDistance };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.CanopyEngine = api;
})(typeof window === "undefined" ? globalThis : window);
