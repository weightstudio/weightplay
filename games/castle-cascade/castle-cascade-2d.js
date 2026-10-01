import { BOARD_HEIGHT, BOARD_WIDTH } from "./cascade-core.js";

const COLS = 5;
const ROWS = 4;
const SPRITE = { crate: 5, chain: 6, key: 7, exit: 8, gate: 9, stone: 10, seal: 11, arrow: 12, bomb: 13, bird: 14, prism: 15, spark: 16, ripple: 17 };
const GEM_COLORS = ["#ed3a50", "#168ce7", "#ffd23d", "#39c76e", "#bd58e9"];

function roundRect(ctx, x, y, w, h, radius) {
  const r = Math.max(0, Math.min(radius, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export class CastleCascade2D {
  constructor(canvas, onCell, onFailure, onSwap) {
    if (!canvas) throw new Error("Castle Cascade board canvas is missing.");
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) throw new Error("Canvas 2D is not available in this browser.");
    this.canvas = canvas;
    this.context = context;
    this.onCell = onCell;
    this.onFailure = onFailure;
    this.onSwap = onSwap;
    this.pressedIndex = -1;
    this.dragOffset = { x: 0, y: 0 };
    this.sprites = [];
    this.disposed = false;
    this.lost = false;
    this.failed = false;
    this.board = null;
    this.selectedIndex = -1;
    this.focusIndex = -1;
    this.highlightCells = new Set();
    this.pointerDown = null;
    this.width = 0;
    this.height = 0;
    this.pixelRatio = 1;
    this.raf = 0;
    this.motion = null;
    this.lastFrame = 0;
    this.frameTimes = [];
    this.motionPreference = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    this.reducedMotion = this.motionPreference?.matches ?? false;
    this.handleMotionPreference = (event) => {
      this.reducedMotion = event.matches;
      if (event.matches) { this.cancelMotion(); this.highlightUntil = 0; }
      this.invalidate();
    };
    this.motionPreference?.addEventListener?.("change", this.handleMotionPreference);
    this.assets = {
      atlas: this.loadImage(new URL("./assets/castle-cascade-board-sprites-v3.webp", import.meta.url).href),
    };
    this.installInput();
    this.installResize();
    this.resize();
    canvas.dataset.renderer = "canvas-2d";
    this.invalidate();
  }

  loadImage(source) {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      if (this.disposed) return;
      if (source.includes("board-sprites")) this.prepareAtlas(image);
      this.invalidate();
    };
    image.onerror = () => {
      if (this.disposed || this.failed) return;
      this.failed = true;
      this.onFailure?.("assets-error");
    };
    image.src = source;
    return image;
  }

  prepareAtlas(atlas) {
    const source = document.createElement("canvas");
    source.width = atlas.naturalWidth;
    source.height = atlas.naturalHeight;
    const context = source.getContext("2d", { willReadFrequently: true });
    context.drawImage(atlas, 0, 0);
    // Normalize each actual opaque silhouette, not the generated sheet's margins.
    const pixels = context.getImageData(0, 0, source.width, source.height).data;
    for (let index = 0; index < COLS * ROWS; index += 1) {
      const left = Math.round((index % COLS) * source.width / COLS);
      const top = Math.round(Math.floor(index / COLS) * source.height / ROWS);
      const right = Math.round(((index % COLS) + 1) * source.width / COLS);
      const bottom = Math.round((Math.floor(index / COLS) + 1) * source.height / ROWS);
      let x0 = right, y0 = bottom, x1 = left, y1 = top;
      const columns = new Uint16Array(right - left), rows = new Uint16Array(bottom - top);
      for (let y = top; y < bottom; y += 1) for (let x = left; x < right; x += 1) {
        if (pixels[(y * source.width + x) * 4 + 3] < 128) continue;
        columns[x - left] += 1; rows[y - top] += 1;
      }
      // Ignore isolated generation specks so they cannot change centering/scale.
      columns.forEach((count, x) => { if (count >= 7) { x0 = Math.min(x0, left+x); x1 = Math.max(x1, left+x); } });
      rows.forEach((count, y) => { if (count >= 7) { y0 = Math.min(y0, top+y); y1 = Math.max(y1, top+y); } });
      if (x1 < x0) continue;
      const sprite = document.createElement("canvas");
      sprite.width = sprite.height = 256;
      const sw = x1 - x0 + 1, sh = y1 - y0 + 1;
      const ratio = 236 / Math.max(sw, sh);
      sprite.getContext("2d").drawImage(atlas, x0, y0, sw, sh,
        (256 - sw * ratio) / 2, (256 - sh * ratio) / 2, sw * ratio, sh * ratio);
      this.sprites[index] = sprite;
    }
  }

  installInput() {
    this.handlePointerDown = (event) => {
      if (event.button !== undefined && event.button !== 0 || this.motion && this.motion.kind !== "entrance") return;
      if (this.motion?.kind === "entrance") this.cancelMotion();
      const index = this.indexAt(event.clientX, event.clientY);
      if (index < 0) return;
      event.preventDefault();
      this.pointerDown = { id: event.pointerId, x: event.clientX, y: event.clientY, index };
      this.pressedIndex = index;
      this.canvas.setPointerCapture?.(event.pointerId);
      this.invalidate();
    };
    this.handlePointerMove = (event) => {
      if (!this.pointerDown || event.pointerId !== this.pointerDown.id) return;
      const rect = this.canvas.getBoundingClientRect();
      const cell = this.boardBounds.size / BOARD_WIDTH;
      const dx = (event.clientX - this.pointerDown.x) * this.width / rect.width;
      const dy = (event.clientY - this.pointerDown.y) * this.height / rect.height;
      this.dragOffset = Math.abs(dx) > Math.abs(dy)
        ? { x: clamp(dx, -cell * .24, cell * .24), y: 0 }
        : { x: 0, y: clamp(dy, -cell * .24, cell * .24) };
      this.invalidate();
    };
    this.handlePointerUp = (event) => {
      const down = this.pointerDown;
      this.handlePointerCancel();
      if (!down || down.id !== event.pointerId || this.disposed || this.lost || this.failed) return;
      const dx = event.clientX - down.x, dy = event.clientY - down.y;
      if (Math.hypot(dx, dy) > 14) {
        const col = down.index % BOARD_WIDTH, row = Math.floor(down.index / BOARD_WIDTH);
        const horizontal = Math.abs(dx) > Math.abs(dy);
        const nextCol = col + (horizontal ? Math.sign(dx) : 0);
        const nextRow = row + (horizontal ? 0 : Math.sign(dy));
        if (nextCol >= 0 && nextCol < BOARD_WIDTH && nextRow >= 0 && nextRow < BOARD_HEIGHT)
          this.onSwap?.(down.index, nextRow * BOARD_WIDTH + nextCol);
        return;
      }
      const index = this.indexAt(event.clientX, event.clientY);
      if (index === down.index) this.onCell?.(index);
    };
    this.handlePointerCancel = () => {
      this.pointerDown = null;
      this.pressedIndex = -1;
      this.dragOffset = { x: 0, y: 0 };
      this.invalidate();
    };
    this.handleContextLost = (event) => {
      event.preventDefault(); this.lost = true; this.cancelMotion();
      this.onFailure?.("context-lost");
    };
    this.handleContextRestored = () => {
      if (this.disposed) return;
      this.lost = false; this.resize(); this.invalidate();
    };
    this.canvas.addEventListener("pointerdown", this.handlePointerDown);
    this.canvas.addEventListener("pointermove", this.handlePointerMove);
    this.canvas.addEventListener("pointerup", this.handlePointerUp);
    this.canvas.addEventListener("pointercancel", this.handlePointerCancel);
    this.canvas.addEventListener("contextlost", this.handleContextLost);
    this.canvas.addEventListener("contextrestored", this.handleContextRestored);
  }

  installResize() {
    if ("ResizeObserver" in window) {
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(this.canvas);
    } else {
      this.handleWindowResize = () => this.resize();
      window.addEventListener("resize", this.handleWindowResize);
    }
  }

  resize() {
    if (this.disposed || this.lost) return;
    const rect = this.canvas.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    if (width === this.width && height === this.height && ratio === this.pixelRatio) return;
    this.width = width;
    this.height = height;
    this.pixelRatio = ratio;
    this.canvas.width = Math.round(width * ratio);
    this.canvas.height = Math.round(height * ratio);
    this.context.setTransform(ratio, 0, 0, ratio, 0, 0);
    this.invalidate();
  }

  indexAt(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const bounds = this.boardBounds;
    if (!rect.width || !rect.height || !bounds) return -1;
    const x = ((clientX - rect.left) / rect.width) * this.width;
    const y = ((clientY - rect.top) / rect.height) * this.height;
    if (x < bounds.x || y < bounds.y || x >= bounds.x + bounds.size || y >= bounds.y + bounds.size) return -1;
    const col = Math.floor(((x - bounds.x) / bounds.size) * BOARD_WIDTH);
    const row = Math.floor(((y - bounds.y) / bounds.size) * BOARD_HEIGHT);
    return row >= 0 && row < BOARD_HEIGHT && col >= 0 && col < BOARD_WIDTH ? row * BOARD_WIDTH + col : -1;
  }

  setBoard(board, selectedIndex = -1, focusIndex = -1, highlights = []) {
    if (this.disposed || this.lost || this.failed) return;
    this.cancelMotion();
    this.board = board;
    this.selectedIndex = selectedIndex;
    this.focusIndex = focusIndex;
    this.highlightCells = new Set(highlights);
    this.highlightStarted = performance.now();
    this.highlightUntil = this.highlightCells.size && !this.reducedMotion ? this.highlightStarted + 460 : this.highlightStarted;
    this.invalidate();
  }

  invalidate() {
    if (this.disposed || this.lost || this.raf) return;
    this.raf = requestAnimationFrame((time) => this.frame(time));
  }

  frame(time) {
    this.raf = 0;
    if (this.disposed || this.lost || this.failed) return;
    if (this.lastFrame && this.motion) {
      this.frameTimes.push(Math.min(250, time - this.lastFrame));
      if (this.frameTimes.length > 60) this.frameTimes.shift();
    }
    this.lastFrame = time;
    if (this.motion?.onImpact && !this.motion.impactPlayed && time >= this.motion.started + this.motion.duration * .22) {
      this.motion.impactPlayed = true;
      this.motion.onImpact();
    }
    this.draw(time);
    if (this.motion && time >= this.motion.started + this.motion.duration) {
      const finished = this.motion;
      this.motion = null;
      this.board = finished.finalBoard || this.board;
      finished.resolve?.(true);
      this.invalidate();
    }
    if (this.motion) this.invalidate();
    else if (this.highlightCells.size && !this.reducedMotion && time < this.highlightUntil) this.invalidate();
    else if (this.highlightCells.size) {
      this.highlightCells.clear();
      if (!this.reducedMotion) this.invalidate();
    }
  }

  draw(time = performance.now()) {
    const ctx = this.context;
    const w = this.width;
    const h = this.height;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);
    const unit = Math.min(w, h);
    const size = unit * 0.946;
    const bounds = { x: (w - size) / 2, y: (h - size) / 2, size };
    this.boardBounds = bounds;
    this.drawFrame(bounds);
    ctx.save();
    // Impact impulse affects only artwork. HUD and input rectangles never move.
    const active = this.motion;
    if (active?.kind === "clear" && active.batch.visualEffects?.length) {
      const p = clamp((time - active.started) / active.duration, 0, 1);
      const impulse = p > .2 && p < .5 ? Math.sin((p - .2) / .3 * Math.PI) : 0;
      const strength = active.batch.visualEffects.some(e => e.type === "combo-burst") ? 2.4 : 1.2;
      ctx.translate(Math.sin(p * 68) * impulse * strength, Math.cos(p * 79) * impulse * strength * .6);
    }
    const motion = this.motion;
    const board = motion?.kind === "swap" ? motion.before
      : motion?.kind === "clear" ? motion.batch.before
        : motion?.kind === "gravity" ? motion.cleared : this.board;
    if (board) {
      const hidden = motion?.kind === "entrance" ? new Set(Array.from({ length: 81 }, (_, i) => i)) : motion?.kind === "swap" ? new Set(motion.indices)
        : motion?.kind === "clear" ? new Set([...motion.batch.directHits, ...motion.batch.adjacentHits])
          : motion?.kind === "gravity" ? motion.hidden : null;
      this.drawTiles(bounds, time, hidden);
      if (motion?.kind === "swap") this.drawSwapMotion(bounds, motion, time);
      else if (motion?.kind === "clear") this.drawClearMotion(bounds, motion, time);
      else if (motion?.kind === "gravity") this.drawGravityMotion(bounds, motion, time);
      else if (motion?.kind === "entrance") this.drawEntrance(bounds, motion, time);
      else if (motion?.kind === "victory") this.drawVictory(bounds, motion, time);
    }
    ctx.restore();
    if (!motion) this.drawFocus(bounds);
    this.canvas.dataset.renderer = "canvas-2d";
    this.canvas.dataset.imageAssetCount = String(Object.values(this.assets).filter((img) => img?.complete && img.naturalWidth).length);
    this.canvas.dataset.averageFrameMs = this.frameTimes.length
      ? (this.frameTimes.reduce((sum, value) => sum + value, 0) / this.frameTimes.length).toFixed(2) : "0.00";
  }

  drawFrame(bounds) {
    const ctx = this.context;
    const cell = bounds.size / BOARD_WIDTH;
    const inset = cell * .12;
    const gold = ctx.createLinearGradient(0, bounds.y, 0, bounds.y + bounds.size);
    gold.addColorStop(0, "#fff1a5"); gold.addColorStop(.3, "#e6a821"); gold.addColorStop(1, "#ad681a");
    ctx.save();
    ctx.shadowColor = "#26355366"; ctx.shadowBlur = cell * .28; ctx.shadowOffsetY = cell * .12;
    roundRect(ctx, bounds.x - inset, bounds.y - inset, bounds.size + inset * 2, bounds.size + inset * 2, cell * .18);
    ctx.fillStyle = gold; ctx.fill();
    ctx.shadowBlur = ctx.shadowOffsetY = 0;
    ctx.strokeStyle = "#fff2b0"; ctx.lineWidth = Math.max(1.2, cell * .035); ctx.stroke();
    for (let i = 0; i < BOARD_WIDTH * BOARD_HEIGHT; i += 1) {
      const row = Math.floor(i / BOARD_WIDTH), col = i % BOARD_WIDTH;
      ctx.fillStyle = (row + col) % 2 ? "#bed6ee" : "#cbe0f4";
      ctx.fillRect(bounds.x + col * cell, bounds.y + row * cell, cell + .25, cell + .25);
    }
    ctx.strokeStyle = "#728dbb"; ctx.lineWidth = cell * .035;
    ctx.strokeRect(bounds.x, bounds.y, bounds.size, bounds.size);
    ctx.restore();
  }

  drawTiles(bounds, time, hidden = null) {
    const cell = bounds.size / BOARD_WIDTH;
    this.board.forEach((tile, index) => {
      if (!tile || hidden?.has(index)) return;
      const x = bounds.x + (index % BOARD_WIDTH) * cell;
      const y = bounds.y + Math.floor(index / BOARD_WIDTH) * cell;
      const cx = x + cell / 2;
      const cy = y + cell / 2;
      const pressed = index === this.pressedIndex;
      this.drawTile(tile, index, cx + (pressed ? this.dragOffset.x : 0), cy + (pressed ? this.dragOffset.y : 0), cell, 1, pressed ? 1.06 : 1);
      if (this.highlightCells.has(index)) this.drawImpact(x, y, cell, time);
    });
  }

  drawTile(tile, index, cx, cy, cell, alpha = 1, scale = 1) {
    if (!tile) return;
    const ctx = this.context;
    ctx.save();
    ctx.globalAlpha *= alpha;
    if (tile.exit) this.drawSprite(SPRITE.exit, cx, cy, cell * scale, 0.78, 0.68);
    if (!tile.box && !tile.stone && !tile.gate && !tile.p && tile.c !== null && tile.c >= 0 && tile.c < GEM_COLORS.length)
      this.drawGem(tile.c, cx, cy, cell * scale);
    if (tile.stone === 1) { ctx.save(); ctx.globalAlpha *= .78; }
    if (tile.box) this.drawSprite(SPRITE.crate, cx, cy, cell * scale, 0.96);
    if (tile.chain) this.drawSprite(SPRITE.chain, cx, cy, cell * scale, 0.96);
    if (tile.gate) {
      this.drawSprite(SPRITE.gate, cx, cy, cell * scale, 0.94, 0.92);
      this.drawGateColor(cx, cy, cell * scale, tile.gateColor);
    }
    if (tile.stone) this.drawSprite(SPRITE.stone, cx, cy, cell * scale, tile.stone > 1 ? 0.94 : 0.84);
    if (tile.stone === 1) ctx.restore();
    if (tile.seal) this.drawSprite(SPRITE.seal, cx, cy, cell * scale, 0.82);
    if (tile.key) this.drawSprite(SPRITE.key, cx, cy, cell * scale, 0.70);
    if (tile.p) this.drawPower(tile.p, cx, cy, cell * scale);
    ctx.restore();
  }

  drawGem(color, cx, cy, size) {
    const ctx = this.context;
    ctx.save();
    ctx.fillStyle = "#35547530";
    ctx.beginPath(); ctx.ellipse(cx, cy + size * .32, size * .29, size * .095, 0, 0, Math.PI * 2); ctx.fill();
    this.drawSprite(color, cx, cy, size, .96);
    ctx.restore();
  }

  drawPower(power, cx, cy, cell) {
    const ctx = this.context;
    const sprite = power.startsWith("arrow") ? SPRITE.arrow : SPRITE[power];
    if (sprite === undefined) return;
    ctx.save();
    const color = power.startsWith("arrow") ? "#ffe585" : power === "bomb" ? "#62caff" : power === "bird" ? "#73f1dc" : "#dc82ff";
    const glow = ctx.createRadialGradient(cx, cy, cell * .08, cx, cy, cell * .52);
    glow.addColorStop(0, color + "88"); glow.addColorStop(1, color + "00");
    ctx.fillStyle = glow; ctx.fillRect(cx - cell * .52, cy - cell * .52, cell * 1.04, cell * 1.04);
    ctx.translate(cx, cy);
    if (power === "arrowV") ctx.rotate(Math.PI / 2);
    this.drawSprite(sprite, 0, 0, cell, .94);
    ctx.restore();
  }

  drawGateColor(cx, cy, cell, colorIndex) {
    const ctx = this.context;
    const radius = cell * 0.105;
    const x = cx + cell * 0.30;
    const y = cy - cell * 0.30;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius + cell * 0.035, 0, Math.PI * 2);
    ctx.fillStyle = "#281a47";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = GEM_COLORS[clamp(Number(colorIndex) || 0, 0, 4)];
    ctx.fill();
    ctx.lineWidth = Math.max(1, cell * 0.022);
    ctx.strokeStyle = "#fff0a8";
    ctx.stroke();
    ctx.restore();
  }

  drawSprite(sprite, cx, cy, cell, scale = .9, alpha = 1) {
    const image = this.sprites[sprite];
    if (!image) return;
    const size = cell * scale;
    const ctx = this.context;
    ctx.save(); ctx.globalAlpha *= alpha;
    ctx.drawImage(image, cx - size / 2, cy - size / 2, size, size);
    ctx.restore();
  }

  drawImpact(x, y, cell, time) {
    const duration = Math.max(1, this.highlightUntil - this.highlightStarted);
    const progress = this.reducedMotion ? 0.45 : clamp((time - this.highlightStarted) / duration, 0, 1);
    const scale = 0.60 + progress * 0.46;
    const alpha = this.reducedMotion ? 0.70 : 1 - progress * 0.72;
    const cx = x + cell / 2;
    const cy = y + cell / 2;
    this.context.save();
    this.context.globalAlpha = alpha;
    this.drawSprite(SPRITE.ripple, cx, cy, cell * scale, 1.1, 0.78);
    this.drawSprite(SPRITE.spark, cx, cy, cell * scale, 0.82, 0.96);
    this.context.restore();
  }

  cancelMotion() {
    if (!this.motion) return;
    const motion = this.motion;
    this.motion = null;
    motion.resolve?.(false);
  }

  runMotion(motion) {
    this.cancelMotion();
    if (this.disposed || this.lost || this.failed) return Promise.resolve(false);
    if (this.reducedMotion) {
      this.board = motion.finalBoard || this.board;
      motion.onImpact?.();
      this.invalidate();
      return Promise.resolve(false);
    }
    return new Promise((resolve) => {
      motion.started = performance.now();
      this.lastFrame = 0;
      motion.resolve = resolve;
      this.motion = motion;
      this.highlightCells.clear();
      this.invalidate();
    });
  }

  animateSwap(before, after, a, b, accepted) {
    this.board = before;
    this.selectedIndex = -1;
    return this.runMotion({
      kind: "swap",
      before,
      after,
      finalBoard: accepted ? after : before,
      indices: [a, b],
      a,
      b,
      accepted,
      combo: Boolean(accepted && before[a]?.p && before[b]?.p),
      duration: accepted ? 210 : 290,
    });
  }

  animateEntrance() {
    if (!this.board) return Promise.resolve(false);
    return this.runMotion({ kind: "entrance", finalBoard: this.board, duration: 460 });
  }

  drawEntrance(bounds, motion, time) {
    const cell = bounds.size / BOARD_WIDTH;
    const elapsed = time - motion.started;
    this.board.forEach((tile, index) => {
      const row = Math.floor(index / BOARD_WIDTH), col = index % BOARD_WIDTH;
      const p = clamp((elapsed - row * 15 - col * 8) / 260, 0, 1);
      if (!p) return;
      const scale = 1 + 2.7 * (p - 1) ** 3 + 1.7 * (p - 1) ** 2;
      this.drawTile(tile, index, bounds.x + (col + .5) * cell, bounds.y + (row + .5) * cell, cell, Math.min(1, p * 3), Math.max(.01, scale));
    });
  }

  animateVictory() {
    return this.runMotion({ kind: "victory", finalBoard: this.board, duration: 620 });
  }

  drawVictory(bounds, motion, time) {
    const p = clamp((time - motion.started) / motion.duration, 0, 1);
    const cell = bounds.size / BOARD_WIDTH;
    for (let i = 0; i < 42; i += 1) {
      const startX = bounds.x + ((i * 17) % 43) / 43 * bounds.size;
      const x = startX + Math.sin(i * 9 + p * 5) * cell * .7;
      const y = bounds.y + bounds.size * .7 - Math.sin(p * Math.PI * .9) * bounds.size * (.6 + i % 3 * .1) + p * p * cell;
      const ctx = this.context;
      ctx.save(); ctx.globalAlpha *= Math.sin(p * Math.PI);
      ctx.translate(x, y); ctx.rotate(i + p * 8);
      ctx.fillStyle = ["#ffd15b", "#fff6cc", "#49c8ef", "#f078a0"][i % 4];
      ctx.fillRect(-cell * .035, -cell * .07, cell * .07, cell * .14); ctx.restore();
    }
  }

  animateClear(batch, onImpact, chainDepth = 0) {
    this.board = batch.before;
    const effects = batch.visualEffects || [];
    const duration = effects.some(e => e.type === "bird-carry") ? 1100
      : effects.some(e => e.type === "combo-burst") ? 780
      : effects.some(e => ["bird", "flock", "bird-carry"].includes(e.type)) ? 700
        : effects.length ? 620 : 360;
    return this.runMotion({ kind: "clear", batch, onImpact, chainDepth, finalBoard: batch.cleared, duration });
  }

  animateGravity(cleared, after, movements = [], deliveredKeys = []) {
    this.board = cleared;
    const moving = movements.filter((item) => item.fromIndex !== item.toIndex || item.isNew || item.isDelivery);
    for (const index of deliveredKeys) {
      if (moving.some((item) => item.toIndex === index && item.payload?.key)) continue;
      const row = Math.floor(index / BOARD_WIDTH);
      const col = index % BOARD_WIDTH;
      moving.push({
        fromIndex: index,
        toIndex: index,
        fromRow: row,
        toRow: row,
        col,
        payload: { ...(cleared[index] || {}), p: null, key: 1 },
        isDelivery: true,
      });
    }
    if (!moving.length) {
      this.board = after;
      this.invalidate();
      return Promise.resolve(true);
    }
    const hidden = new Set();
    moving.forEach((item) => {
      if (item.fromIndex !== null) hidden.add(item.fromIndex);
      hidden.add(item.toIndex);
    });
    const stagger = (item) => (item.col % 3) * 9 + (item.spawnOrder || 0) * 22;
    const travel = (item) => 180 + Math.min(9, Math.abs(item.toRow - item.fromRow)) * 23;
    const duration = Math.max(...moving.map((item) => stagger(item) + travel(item)));
    return this.runMotion({
      kind: "gravity",
      cleared,
      after,
      finalBoard: after,
      movements: moving,
      deliveredKeys,
      hidden,
      stagger,
      travel,
      duration,
    });
  }

  drawSwapMotion(bounds, motion, time) {
    const elapsed = clamp((time - motion.started) / motion.duration, 0, 1);
    const progress = motion.accepted ? 1 - (1 - elapsed) ** 3
      : elapsed < 0.48 ? 1 - (1 - elapsed / 0.48) ** 3 : 1 - ((elapsed - 0.48) / 0.52) ** 3;
    const cell = bounds.size / BOARD_WIDTH;
    const tiles = [motion.before[motion.a], motion.before[motion.b]];
    const from = [motion.a, motion.b];
    const to = [motion.b, motion.a];
    for (let item = 0; item < 2; item += 1) {
      const fromRow = Math.floor(from[item] / BOARD_WIDTH);
      const fromCol = from[item] % BOARD_WIDTH;
      const toRow = Math.floor(to[item] / BOARD_WIDTH);
      const toCol = to[item] % BOARD_WIDTH;
      const x = bounds.x + (fromCol + (toCol - fromCol) * progress + 0.5) * cell;
      const y = bounds.y + (fromRow + (toRow - fromRow) * progress + 0.5) * cell;
      const scale = 1 + Math.sin(progress * Math.PI) * 0.045;
      this.drawTile(tiles[item], to[item], x, y, cell, 1, scale);
    }
    if (motion.combo) this.drawComboLink(bounds, motion, progress, cell);
  }

  hitStart(batch, index) {
    const row = Math.floor(index / BOARD_WIDTH), col = index % BOARD_WIDTH;
    const arrivals = [];
    const effects = batch.visualEffects || [];
    for (const effect of effects) {
      const origin = effect.index ?? effect.origins?.[0];
      if (!Number.isInteger(origin)) continue;
      const r = Math.floor(origin / BOARD_WIDTH), c = origin % BOARD_WIDTH;
      const distance = Math.hypot(row - r, col - c);
      const carried = effects.some(e => e.type === "bird-carry" && e.target === origin)
        && ["arrow", "bomb"].includes(effect.type);
      const arrival = (local) => carried ? .60 + local * .40 : local;
      if (effect.type === "arrow" && (effect.axis === "h" ? row === r : col === c))
        arrivals.push(arrival(.22 + Math.abs(effect.axis === "h" ? col - c : row - r) / 8 * .42));
      if (["bomb", "nova"].includes(effect.type) && Math.max(Math.abs(row-r), Math.abs(col-c)) <= effect.radius)
        arrivals.push(arrival(.22 + distance / Math.max(1, effect.radius * 1.42) * .25));
      if (["cross", "siege"].includes(effect.type)) arrivals.push(.22 + Math.min(Math.abs(row-r), Math.abs(col-c)) * .015 + Math.max(Math.abs(row-r), Math.abs(col-c)) / 8 * .38);
      if (["bird", "bird-carry"].includes(effect.type) && index === effect.target) arrivals.push(.68);
      if (effect.type === "flock" && effect.targets?.includes(index)) arrivals.push(.68);
      if (["prism", "prism-combo", "spectrum"].includes(effect.type) && effect.targets?.includes(index)) arrivals.push(.28 + distance * .018);
    }
    return arrivals.length ? Math.min(...arrivals) : .22;
  }

  drawClearMotion(bounds, motion, time) {
    const { batch } = motion;
    const progress = clamp((time - motion.started) / motion.duration, 0, 1);
    const cell = bounds.size / BOARD_WIDTH;
    const center = index => ({ x: bounds.x + (index % BOARD_WIDTH + .5) * cell, y: bounds.y + (Math.floor(index / BOARD_WIDTH) + .5) * cell });
    for (const index of batch.directHits) {
      const tile = batch.before[index];
      if (!tile) continue;
      const after = batch.cleared[index];
      const { x: cx, y: cy } = center(index);
      const start = this.hitStart(batch, index);
      const hit = clamp((progress - start) / .28, 0, 1);
      if (progress < start) {
        const prepare = clamp(progress / start, 0, 1);
        this.drawTile(tile, index, cx, cy, cell, 1, 1 + Math.sin(prepare * Math.PI) * .085);
        if (tile.p) this.drawRing(cx, cy, cell * (.43 - prepare * .14), prepare * .6, "#fff3b7", cell * .04);
        continue;
      }
      // Blocked/key pieces persist. Only actual removed layers or payload break.
      const survives = after && (after.key || after.stone || after.gate);
      if (survives) this.drawTile(after, index, cx + Math.sin(hit * 26) * (1-hit) * cell * .035, cy, cell);
      else if (hit < .45) this.drawTile(tile, index, cx, cy, cell, 1 - hit / .45, 1.1 - hit * .88);
      if (hit > 0 && hit < 1) {
        const material = tile.box ? SPRITE.crate : tile.stone ? SPRITE.stone : tile.chain ? SPRITE.chain : tile.gate ? SPRITE.gate : tile.p ? (tile.p.startsWith("arrow") ? SPRITE.arrow : SPRITE[tile.p]) : tile.c;
        // A remaining gate/stone gets recoil only, not a false destruction.
        const removed = !survives || tile.stone > (after.stone || 0) || tile.chain && !after.chain;
        if (removed && Number.isInteger(material)) this.drawFragments(material, cx, cy, cell, hit, batch.directHits.length > 30 ? 3 : tile.box ? 8 : 5, index);
        const flash = Math.max(0, 1 - hit * 4);
        this.drawSprite(SPRITE.spark, cx, cy, cell, .62 + hit * .7, flash);
        this.drawRing(cx, cy, cell * (.16 + hit * .6), (1-hit) * .55, GEM_COLORS[tile.c] || "#ffd074", cell * .028);
      }
    }
    for (const index of batch.adjacentHits) {
      const tile = batch.before[index], after = batch.cleared[index];
      if (!tile || !after) continue;
      const { x: cx, y: cy } = center(index);
      const boxRemoved = tile.box && !after.box, chainRemoved = tile.chain && !after.chain;
      if (!boxRemoved && !chainRemoved) { this.drawTile(tile, index, cx, cy, cell); continue; }
      const neighbors = batch.directHits.filter(hit => Math.abs(Math.floor(hit / BOARD_WIDTH) - Math.floor(index / BOARD_WIDTH)) + Math.abs(hit % BOARD_WIDTH - index % BOARD_WIDTH) === 1);
      const start = neighbors.length ? Math.min(...neighbors.map(hit => this.hitStart(batch, hit))) : .22;
      const hit = clamp((progress - start) / .30, 0, 1);
      if (progress < start) { this.drawTile(tile, index, cx, cy, cell); continue; }
      // Neighbor gem remains opaque throughout; only removed obstacle fragments fly.
      this.drawTile(after, index, cx, cy, cell);
      if (hit < .24) {
        if (boxRemoved) this.drawSprite(SPRITE.crate, cx, cy, cell, .96 + hit * .3, 1-hit/.24);
        if (chainRemoved) this.drawSprite(SPRITE.chain, cx, cy, cell, .96 + hit * .3, 1-hit/.24);
      }
      if (boxRemoved) this.drawFragments(SPRITE.crate, cx, cy, cell, hit, 8, index);
      if (chainRemoved) this.drawFragments(SPRITE.chain, cx, cy, cell, hit, 6, index);
      this.drawSprite(SPRITE.spark, cx, cy, cell, .7, Math.max(0, 1-hit*5));
    }
    this.drawSpecialEffects(bounds, batch.visualEffects || [], progress, cell);
    if (batch.createdSpecial) {
      const { at, power } = batch.createdSpecial;
      const { x: cx, y: cy } = center(at);
      const appear = clamp((progress - .54) / .40, 0, 1);
      if (appear > 0) {
        for (const index of batch.directHits.slice(0, 8)) {
          const from = center(index);
          const p = Math.min(1, appear * 1.7);
          const x = from.x + (cx-from.x) * p, y = from.y + (cy-from.y) * p;
          this.drawSprite(SPRITE.spark, x, y, cell, .23, (1-p)*.8);
        }
        const ease = 1 + 2.7 * (appear-1) ** 3 + 1.7 * (appear-1) ** 2;
        this.context.save(); this.context.globalAlpha *= Math.min(1, appear*3);
        this.drawPower(power, cx, cy, cell * Math.max(.01, ease)); this.context.restore();
        this.drawRing(cx, cy, cell * (.22 + appear * .56), 1-appear, "#fff7bf", cell * .05);
      }
    }
    if (motion.chainDepth > 0) {
      const p = clamp((progress - .15) / .62, 0, 1);
      const alpha = Math.sin(p * Math.PI);
      if (alpha > 0) {
        const ctx = this.context;
        ctx.save(); ctx.globalAlpha *= alpha;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.font = `900 ${cell * .62}px system-ui, sans-serif`;
        ctx.strokeStyle = "#6d390f"; ctx.lineWidth = cell * .085;
        const label = `×${motion.chainDepth + 1}`;
        ctx.strokeText(label, bounds.x + bounds.size/2, bounds.y + bounds.size * .42 - p*cell*.7);
        ctx.fillStyle = "#fff3b7"; ctx.fillText(label, bounds.x + bounds.size/2, bounds.y + bounds.size * .42 - p*cell*.7);
        ctx.restore();
      }
    }
  }

  drawFragments(sprite, cx, cy, cell, progress, count, seed) {
    if (progress <= 0 || progress >= 1 || !this.sprites[sprite]) return;
    const ctx = this.context, image = this.sprites[sprite];
    const alpha = Math.min(1, (1-progress) * 2.2);
    ctx.save(); ctx.globalAlpha *= alpha;
    for (let part=0; part<count; part+=1) {
      const angle = (part/count) * Math.PI * 2 + seed * .71;
      const speed = .55 + ((part*7+seed)%5)*.16;
      const distance = progress * cell * speed;
      const x = cx + Math.cos(angle) * distance;
      const y = cy + Math.sin(angle) * distance - Math.sin(progress*Math.PI)*cell*.3 + progress*progress*cell*.64;
      const sx = 24 + (part%3)*70, sy = 24 + (Math.floor(part/3)%3)*70;
      const size = cell * (.16 + part%2*.035) * (1-progress*.45);
      ctx.save(); ctx.translate(x,y); ctx.rotate(angle + progress*(part%2?4:-4));
      ctx.drawImage(image, sx, sy, 68, 68, -size/2, -size/2, size, size);
      ctx.restore();
    }
    ctx.restore();
  }

  drawComboLink(bounds, motion, progress, cell) {
    const centerOf = (index) => {
      const row = Math.floor(index / BOARD_WIDTH);
      const col = index % BOARD_WIDTH;
      return {
        x: bounds.x + (col + 0.5) * cell,
        y: bounds.y + (row + 0.5) * cell,
      };
    };
    const a = centerOf(motion.a);
    const b = centerOf(motion.b);
    const midpoint = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    const pulse = Math.sin(progress * Math.PI);
    if (pulse <= 0) return;
    this.context.save();
    this.context.globalCompositeOperation = "lighter";
    this.context.globalAlpha *= pulse * 0.9;
    this.drawBeam(a.x, a.y, midpoint.x, midpoint.y, "#fff2ac", cell * 0.085, cell * 0.2);
    this.drawBeam(b.x, b.y, midpoint.x, midpoint.y, "#91f2ff", cell * 0.085, cell * 0.2);
    this.drawRing(midpoint.x, midpoint.y, cell * (0.14 + pulse * 0.34), pulse, "#fff8d1", cell * 0.055);
    this.drawSprite(SPRITE.spark, midpoint.x, midpoint.y, cell * (0.34 + pulse * 0.52), 0.86, pulse);
    this.context.restore();
  }

  drawGravityMotion(bounds, motion, time) {
    this.context.save();
    this.context.beginPath();
    this.context.rect(bounds.x, bounds.y, bounds.size, bounds.size);
    this.context.clip();
    const elapsed = time - motion.started;
    const cell = bounds.size / BOARD_WIDTH;
    for (const item of motion.movements) {
      const local = clamp((elapsed - motion.stagger(item)) / motion.travel(item), 0, 1);
      const falling = clamp(local / .79, 0, 1);
      const eased = falling * falling;
      const fromRow = item.fromRow;
      const rowProgress = item.isDelivery ? -local * 0.42 : fromRow + (item.toRow - fromRow) * eased;
      const y = bounds.y + (rowProgress + 0.5) * cell;
      const x = bounds.x + (item.col + 0.5) * cell;
      const rebound = local > .79 ? Math.sin((local - .79) / .21 * Math.PI * 2) * (1 - (local - .79) / .21) : 0;
      const landing = item.isDelivery ? 1 : 1 + rebound * .11;
      const delivering = motion.deliveredKeys.includes(item.toIndex) && item.payload.key;
      const fade = item.isDelivery ? 1 - local : delivering && local > 0.76 ? 1 - (local - 0.76) / 0.24 : 1;
      const ctx = this.context;
      ctx.save(); ctx.translate(x, y); ctx.scale(landing, 1 / landing);
      this.drawTile(item.payload, item.toIndex, 0, 0, cell, fade);
      ctx.restore();
      if (local > .79 && !item.isDelivery) this.drawRing(x, y + cell * .31, cell * (.16 + (local - .79) * .7), (1 - local) * 1.4, "#ffffff", cell * .025);
    }
    motion.cleared.forEach((tile, index) => {
      if (!tile.box && !tile.chain && !tile.gate && !tile.stone && !tile.seal) return;
      const row = Math.floor(index / BOARD_WIDTH);
      const col = index % BOARD_WIDTH;
      const overlay = { ...tile, c: null, p: null, key: 0, exit: 0 };
      this.drawTile(overlay, index, bounds.x + (col + 0.5) * cell, bounds.y + (row + 0.5) * cell, cell);
    });
    for (const index of motion.deliveredKeys) {
      const keyMotion = motion.movements.find((item) => item.toIndex === index && item.payload.key);
      if (!keyMotion) continue;
      const local = clamp((elapsed - motion.stagger(keyMotion)) / motion.travel(keyMotion), 0, 1);
      if (local > 0.76) {
        const row = Math.floor(index / BOARD_WIDTH);
        const col = index % BOARD_WIDTH;
        const p = clamp((local - 0.76) / 0.24, 0, 1);
        const cx = bounds.x + (col + 0.5) * cell;
        const cy = bounds.y + (row + 0.5) * cell;
        this.drawRing(cx, cy, cell * (0.18 + p * 0.38), 1 - p, "#ffdc62", cell * 0.035);
        this.drawSprite(SPRITE.spark, cx, cy, cell, 0.42 + p * 0.23, 1 - p * 0.38);
      }
    }
    this.context.restore();
  }

  drawSpecialEffects(bounds, effects, batchProgress, cell) {
    for (const effect of effects) {
      const carried = effects.some(e => e.type === "bird-carry" && e.target === effect.index)
        && ["arrow", "bomb"].includes(effect.type);
      const progress = carried ? clamp((batchProgress - .60) / .40, 0, 1) : batchProgress;
      if (carried && batchProgress <= .60) continue;
      const center = effect.index ?? effect.origins?.[0] ?? 40;
      const row = Math.floor(center / BOARD_WIDTH);
      const col = center % BOARD_WIDTH;
      const cx = bounds.x + (col + 0.5) * cell;
      const cy = bounds.y + (row + 0.5) * cell;
      if (effect.type === "arrow") {
        this.drawRocketLine(bounds, cx, cy, effect.axis === "h", progress, cell);
      } else if (effect.type === "bomb" || effect.type === "nova") {
        const charge = clamp(progress/.22, 0, 1);
        if (progress < .22) {
          this.drawRing(cx, cy, cell * (.65-charge*.3), charge*.9, "#ffd279", cell*.075);
          this.drawSprite(SPRITE.spark, cx, cy, cell, .32+charge*.2, charge);
        }
        const blast = clamp((progress-.22)/.52, 0, 1);
        if (blast > 0 && blast < 1) {
          const radius = cell * (.3+blast*(effect.radius+.7));
          const ctx = this.context;
          const glow = ctx.createRadialGradient(cx,cy,0,cx,cy,Math.max(1,radius));
          glow.addColorStop(0, "#fff4c300"); glow.addColorStop(.72,"#ffcc6570"); glow.addColorStop(1,"#ffac3000");
          ctx.save(); ctx.globalAlpha *= 1-blast; ctx.fillStyle=glow;
          ctx.fillRect(cx-radius,cy-radius,radius*2,radius*2); ctx.restore();
          this.drawRing(cx, cy, radius, 1-blast, "#ffc34f", cell * .14);
          this.drawRing(cx, cy, radius*.91, 1-blast, "#fff9d5", cell * .046);
          this.drawParticleBurst(cx,cy,cell,blast,effect.type==="nova"?16:10,effect.radius+1.2,"#ffd175",center);
        }
      } else if (effect.type === "bird" || effect.type === "bird-carry") {
        const target = effect.target ?? effect.index;
        this.drawBirdFlight(bounds, effect.index, target, progress, cell);
        const hitProgress = clamp((progress - 0.62) / 0.38, 0, 1);
        if (hitProgress > 0) {
          const tr = Math.floor(target / BOARD_WIDTH);
          const tc = target % BOARD_WIDTH;
          this.drawParticleBurst(bounds.x + (tc + 0.5) * cell, bounds.y + (tr + 0.5) * cell, cell, hitProgress, 7, 1.05, "#95f4df", target);
        }
      } else if (effect.type === "flock") {
        (effect.targets || []).forEach((target, targetIndex) => this.drawBirdFlight(bounds, effect.origins[targetIndex] ?? effect.origins[0], target, progress, cell));
      } else if (effect.type === "prism" || effect.type === "prism-combo" || effect.type === "spectrum") {
        const local = clamp((progress-.22)/.56, 0, 1);
        const targets = effect.targets || [];
        // At most 24 rays per frame, evenly distributed across the actual targets.
        const stride = Math.max(1, Math.ceil(targets.length/24));
        for (let i=0; i<targets.length; i+=stride) {
          const target = targets[i];
          const tx = bounds.x + (target%BOARD_WIDTH+.5)*cell;
          const ty = bounds.y + (Math.floor(target/BOARD_WIDTH)+.5)*cell;
          const p = clamp((local-(i%4)*.035)/.82,0,1);
          if (p<=0 || p>=1) continue;
          const color = GEM_COLORS[(i+Math.floor(progress*12))%GEM_COLORS.length];
          const envelope = Math.sin(p*Math.PI);
          this.context.save(); this.context.globalAlpha *= envelope*.78;
          this.drawLightning(cx,cy,tx,ty,color,cell, i);
          this.context.restore();
          this.drawSprite(SPRITE.spark,tx,ty,cell,.4,envelope);
        }
      } else if (effect.type === "cross") {
        this.drawRocketLine(bounds,cx,cy,true,progress,cell);
        this.drawRocketLine(bounds,cx,cy,false,progress,cell);
      } else if (effect.type === "siege") {
        for (const offset of [-1,0,1]) {
          if (row+offset>=0 && row+offset<BOARD_HEIGHT) this.drawRocketLine(bounds,cx,cy+offset*cell,true,progress,cell);
          if (col+offset>=0 && col+offset<BOARD_WIDTH) this.drawRocketLine(bounds,cx+offset*cell,cy,false,progress,cell);
        }
      } else if (effect.type === "combo-burst") {
        this.drawComboBurst(bounds, effect, progress, cell);
      }
    }
  }

  drawRocketLine(bounds,cx,cy,horizontal,progress,cell) {
    const p=clamp((progress-.22)/.48,0,1);
    if (p<=0 || p>=1) return;
    const ctx=this.context;
    for (const sign of [-1,1]) {
      const end=horizontal ? (sign<0?bounds.x:bounds.x+bounds.size) : (sign<0?bounds.y:bounds.y+bounds.size);
      const travel=(end-(horizontal?cx:cy))*p;
      const x=cx+(horizontal?travel:0), y=cy+(horizontal?0:travel);
      ctx.save(); ctx.globalAlpha*=Math.min(1,(1-p)*4);
      this.drawBeam(cx,cy,x,y,"#ffb73e",cell*.18,cell*.20);
      this.drawBeam(cx,cy,x,y,"#fff9dd",cell*.055,cell*.10);
      ctx.translate(x,y); if (!horizontal) ctx.rotate(Math.PI/2);
      this.drawSprite(SPRITE.arrow,0,0,cell,.63);
      ctx.restore();
    }
  }

  drawLightning(x1,y1,x2,y2,color,cell,seed) {
    const ctx=this.context, dx=x2-x1, dy=y2-y1;
    const length=Math.max(1,Math.hypot(dx,dy));
    ctx.save(); ctx.lineCap="round"; ctx.strokeStyle=color;
    ctx.lineWidth=cell*.065; ctx.shadowColor=color; ctx.shadowBlur=cell*.18;
    ctx.beginPath(); ctx.moveTo(x1,y1);
    for (let step=1;step<6;step+=1) {
      const p=step/6, offset=Math.sin(step*17+seed)*cell*.2;
      ctx.lineTo(x1+dx*p-dy/length*offset,y1+dy*p+dx/length*offset);
    }
    ctx.lineTo(x2,y2); ctx.stroke();
    ctx.shadowBlur=0; ctx.strokeStyle="#fff9f1"; ctx.lineWidth=cell*.023; ctx.stroke(); ctx.restore();
  }

  drawComboBurst(bounds, effect, progress, cell) {
    const origins = (effect.origins || []).filter((index) => Number.isInteger(index) && index >= 0 && index < BOARD_WIDTH * BOARD_HEIGHT);
    const points = origins.length ? origins : [effect.index];
    const centers = points.map((index) => ({
      x: bounds.x + ((index % BOARD_WIDTH) + 0.5) * cell,
      y: bounds.y + (Math.floor(index / BOARD_WIDTH) + 0.5) * cell,
    }));
    const cx = centers.reduce((sum, point) => sum + point.x, 0) / centers.length;
    const cy = centers.reduce((sum, point) => sum + point.y, 0) / centers.length;
    const phase = clamp(progress, 0, 1);
    const envelope = Math.sin(Math.PI * phase);
    if (envelope <= 0) return;
    const isSpectrum = effect.powers?.includes("prism");
    const firstColor = isSpectrum ? "#f0a9ff" : "#ffe28a";
    const secondColor = isSpectrum ? "#9cf4ff" : "#9ceeff";
    const radius = cell * (0.35 + phase * 3.9);
    const ctx = this.context;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha *= envelope * 0.72;
    this.drawRing(cx, cy, radius, 0.9, firstColor, cell * (0.11 - phase * 0.045));
    this.drawRing(cx, cy, radius * 0.68, 0.66, secondColor, cell * 0.045);
    ctx.lineCap = "round";
    for (let ray = 0; ray < 12; ray += 1) {
      const angle = ray * Math.PI / 6 + phase * 0.34;
      const inner = radius * (0.18 + (ray % 3) * 0.035);
      const outer = radius * (0.83 + (ray % 2) * 0.13);
      const color = ray % 2 ? firstColor : secondColor;
      this.drawBeam(
        cx + Math.cos(angle) * inner,
        cy + Math.sin(angle) * inner,
        cx + Math.cos(angle) * outer,
        cy + Math.sin(angle) * outer,
        color,
        cell * 0.055,
        Math.min(cell * 0.24, 11),
      );
    }
    ctx.restore();
    this.drawParticleBurst(cx, cy, cell, phase, 14, 4.2, firstColor, effect.index || 0);
    const targets = effect.targets || [];
    const targetStride = Math.max(1, Math.ceil(targets.length / 18));
    let shownTargets = 0;
    for (let targetIndex = 0; targetIndex < targets.length && shownTargets < 18; targetIndex += targetStride) {
      const target = targets[targetIndex];
      const local = clamp((phase - 0.12 - (targetIndex % 6) * 0.035) / 0.54, 0, 1);
      const hit = Math.sin(local * Math.PI);
      if (!hit) continue;
      const tr = Math.floor(target / BOARD_WIDTH);
      const tc = target % BOARD_WIDTH;
      this.drawRing(bounds.x + (tc + 0.5) * cell, bounds.y + (tr + 0.5) * cell, cell * (0.12 + local * 0.25), hit * 0.82, targetIndex % 2 ? firstColor : secondColor, cell * 0.032);
      shownTargets += 1;
    }
  }

  drawBirdFlight(bounds, from, to, progress, cell) {
    if (!Number.isInteger(from) || !Number.isInteger(to) || from < 0 || to < 0) return;
    const fromX = bounds.x + ((from % BOARD_WIDTH) + 0.5) * cell;
    const fromY = bounds.y + (Math.floor(from / BOARD_WIDTH) + 0.5) * cell;
    const toX = bounds.x + ((to % BOARD_WIDTH) + 0.5) * cell;
    const toY = bounds.y + (Math.floor(to / BOARD_WIDTH) + 0.5) * cell;
    progress = clamp((progress - .12) / .56, 0, 1);
    if (progress >= 1) return;
    const arc = Math.sin(progress * Math.PI) * cell * 1.8;
    const x = fromX + (toX - fromX) * progress;
    const y = fromY + (toY - fromY) * progress - arc;
    for (let trail=1; trail<=5; trail+=1) {
      const p = Math.max(0, progress-trail*.025);
      this.drawSprite(SPRITE.spark,fromX+(toX-fromX)*p,fromY+(toY-fromY)*p-Math.sin(p*Math.PI)*cell*1.8,cell,.2, (1-trail/6)*.55);
    }
    const sprite = SPRITE.bird;
    this.drawSprite(sprite, x, y, cell, 0.82 + Math.sin(progress * Math.PI) * 0.08, 1 - progress * 0.15);
  }

  drawBeam(x1, y1, x2, y2, color, width, glow) {
    const ctx = this.context;
    ctx.save();
    ctx.lineCap = "round";
    ctx.globalAlpha *= 0.9;
    ctx.shadowColor = color;
    ctx.shadowBlur = glow;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }

  drawRing(cx, cy, radius, alpha, color, width) {
    const ctx = this.context;
    ctx.save();
    ctx.globalAlpha *= clamp(alpha, 0, 1);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(1, radius), 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  drawParticleBurst(cx, cy, cell, progress, count, spread, color, seed = 0) {
    const pulse = Math.sin(clamp(progress, 0, 1) * Math.PI);
    if (pulse <= 0.02) return;
    const ctx = this.context;
    const particles = Math.min(16, Math.max(0, count));
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha *= pulse * 0.9;
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = Math.min(cell * 0.18, 8);
    for (let particle = 0; particle < particles; particle += 1) {
      const angle = (particle / particles) * Math.PI * 2 + (seed % 11) * 0.13 + progress * 0.42;
      const distance = cell * (0.2 + progress * Math.min(6, spread)) * (0.78 + (particle % 3) * 0.11);
      const x = cx + Math.cos(angle) * distance;
      const y = cy + Math.sin(angle) * distance;
      const size = cell * (0.045 + (particle % 2) * 0.018) * (1 - progress * 0.32);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle + progress * 1.8);
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.68, 0);
      ctx.lineTo(0, size);
      ctx.lineTo(-size * 0.68, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  drawFocus(bounds) {
    const ctx = this.context;
    const cell = bounds.size / BOARD_WIDTH;
    for (const [index, selected] of [[this.focusIndex, false], [this.selectedIndex, true]]) {
      if (!Number.isInteger(index) || index < 0 || index >= BOARD_WIDTH * BOARD_HEIGHT || (index === this.selectedIndex && !selected)) continue;
      const row = Math.floor(index / BOARD_WIDTH);
      const col = index % BOARD_WIDTH;
      const inset = cell * (selected ? 0.075 : 0.13);
      ctx.save();
      roundRect(ctx, bounds.x + col * cell + inset, bounds.y + row * cell + inset, cell - inset * 2, cell - inset * 2, cell * 0.17);
      ctx.lineWidth = Math.max(1.7, cell * (selected ? 0.07 : 0.045));
      ctx.strokeStyle = selected ? "#fff0a3" : "#ffffffd9";
      ctx.shadowColor = selected ? "#ffc94a" : "#7fe7ff";
      ctx.shadowBlur = cell * (selected ? 0.2 : 0.13);
      if (!selected) ctx.setLineDash([cell * 0.1, cell * 0.06]);
      ctx.stroke();
      ctx.restore();
    }
  }

  stats() {
    return {
      renderer: this.canvas?.dataset.renderer || "released",
      imageAssets: Object.values(this.assets || {}).filter((image) => image?.complete && image.naturalWidth).length,
      averageFrameMs: this.frameTimes.length ? this.frameTimes.reduce((sum, value) => sum + value, 0) / this.frameTimes.length : 0,
      reducedMotion: this.reducedMotion,
    };
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.cancelMotion();
    if (this.raf) cancelAnimationFrame(this.raf);
    this.resizeObserver?.disconnect();
    this.motionPreference?.removeEventListener?.("change", this.handleMotionPreference);
    if (this.handleWindowResize) window.removeEventListener("resize", this.handleWindowResize);
    this.canvas?.removeEventListener("pointerdown", this.handlePointerDown);
    this.canvas?.removeEventListener("pointermove", this.handlePointerMove);
    this.canvas?.removeEventListener("pointerup", this.handlePointerUp);
    this.canvas?.removeEventListener("pointercancel", this.handlePointerCancel);
    this.canvas?.removeEventListener("contextlost", this.handleContextLost);
    this.canvas?.removeEventListener("contextrestored", this.handleContextRestored);
    for (const image of Object.values(this.assets || {})) {
      image.onload = null;
      image.onerror = null;
    }
    if (this.canvas) this.canvas.dataset.renderer = "released";
    this.highlightCells.clear();
    this.board = null;
    this.onCell = null;
    this.onFailure = null;
    this.onSwap = null;
    this.sprites.length = 0;
  }
}
