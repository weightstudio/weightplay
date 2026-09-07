// Viewport-independent simulation; no DOM, clocks, timers, or test-only win path.
export const WIDTH = 600, HEIGHT = 600, TARGET = 7;
export const DIFFICULTIES = [
  { speed: 245, aiSpeed: 145, aiError: 48, aiWidth: 112, playerWidth: 128 },
  { speed: 285, aiSpeed: 210, aiError: 30, aiWidth: 106, playerWidth: 116 },
  { speed: 320, aiSpeed: 270, aiError: 18, aiWidth: 98, playerWidth: 106 },
];
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export class Match {
  constructor(difficulty = 0, random = Math.random) {
    this.difficulty = clamp(Math.floor(Number(difficulty) || 0), 0, 2);
    this.config = DIFFICULTIES[this.difficulty]; this.random = random;
    this.player = 300; this.aim = 300; this.cpu = 300;
    this.you = 0; this.them = 0; this.rally = 0; this.bestRally = 0;
    this.phase = 'ready'; this.lastPoint = null; this.aiClock = 0; this.aiAim = 300;
    this.ball = { x: 300, y: 300, vx: 0, vy: 0, radius: 9 };
  }
  move(x) { if (Number.isFinite(x)) this.aim = clamp(x, this.config.playerWidth / 2 + 8, WIDTH - this.config.playerWidth / 2 - 8); }
  serve() {
    if (!['ready', 'point'].includes(this.phase)) return false;
    const speed = this.config.speed;
    const angle = (this.random() - 0.5) * 0.65;
    this.ball = { x: 300, y: 300, vx: Math.sin(angle) * speed, vy: Math.cos(angle) * speed, radius: 9 };
    this.rally = 0; this.aiClock = 0; this.phase = 'playing'; return true;
  }
  pause() { if (this.phase === 'playing') this.phase = 'paused'; }
  resume() { if (this.phase === 'paused') this.phase = 'playing'; }
  step(dt) {
    if (this.phase !== 'playing' || !Number.isFinite(dt) || dt <= 0) return [];
    const events = []; let remaining = Math.min(dt, 0.05);
    while (remaining > 0 && this.phase === 'playing') {
      const d = Math.min(remaining, 1 / 240); remaining -= d;
      this.player += clamp(this.aim - this.player, -1000 * d, 1000 * d);
      this.aiClock -= d;
      if (this.aiClock <= 0) {
        this.aiClock = 0.14;
        this.aiAim = this.ball.vy < 0 ? this.ball.x + (this.random() - 0.5) * this.config.aiError * 2 : 300;
      }
      this.cpu = clamp(this.cpu + clamp(this.aiAim - this.cpu, -this.config.aiSpeed * d, this.config.aiSpeed * d), this.config.aiWidth / 2 + 8, WIDTH - this.config.aiWidth / 2 - 8);
      const b = this.ball, previousY = b.y;
      b.x += b.vx * d; b.y += b.vy * d;
      if (b.x < b.radius) { b.x = b.radius; b.vx = Math.abs(b.vx); events.push('wall'); }
      if (b.x > WIDTH - b.radius) { b.x = WIDTH - b.radius; b.vx = -Math.abs(b.vx); events.push('wall'); }
      const hit = (center, width, y, direction) => {
        const offset = clamp((b.x - center) / (width / 2), -1, 1);
        const speed = Math.min(560, Math.hypot(b.vx, b.vy) + 13);
        b.x = clamp(b.x, b.radius, WIDTH - b.radius); b.y = y;
        b.vx = Math.sin(offset * 1.08) * speed;
        b.vy = direction * Math.max(110, Math.cos(offset * 1.08) * speed);
        this.rally++; this.bestRally = Math.max(this.bestRally, this.rally); events.push('hit');
      };
      if (b.vy > 0 && previousY <= 544 && b.y >= 544 && Math.abs(b.x - this.player) <= this.config.playerWidth / 2 + b.radius) hit(this.player, this.config.playerWidth, 544, -1);
      else if (b.vy < 0 && previousY >= 56 && b.y <= 56 && Math.abs(b.x - this.cpu) <= this.config.aiWidth / 2 + b.radius) hit(this.cpu, this.config.aiWidth, 56, 1);
      if (b.y < -b.radius || b.y > HEIGHT + b.radius) {
        this.lastPoint = b.y < 0 ? 'you' : 'cpu';
        if (this.lastPoint === 'you') this.you++; else this.them++;
        b.vx = 0; b.vy = 0;
        this.phase = Math.max(this.you, this.them) >= TARGET ? 'finished' : 'point';
        events.push('point');
      }
    }
    return events;
  }
}
