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
  constructor(canvas, onCell, onFailure) {
    if (!canvas) throw new Error("Castle Cascade board canvas is missing.");
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) throw new Error("Canvas 2D is not available in this browser.");
    this.canvas = canvas;
    this.context = context;
    this.onCell = onCell;
    this.onFailure = onFailure;
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
    this.reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    this.assets = {
      atlas: this.loadImage(new URL("./assets/castle-cascade-board-sprites-v2.webp", import.meta.url).href),
      background: this.loadImage(new URL("./assets/castle-cascade-courtyard-v1.webp", import.meta.url).href),
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
    image.onload = () => { if (!this.disposed) this.invalidate(); };
    image.onerror = () => {
      if (this.disposed || this.failed) return;
      this.failed = true;
      this.onFailure?.("assets-error");
    };
    image.src = source;
    return image;
  }

  installInput() {
    this.handlePointerDown = (event) => {
      if (event.button !== undefined && event.button !== 0) return;
      event.preventDefault();
      this.pointerDown = { id: event.pointerId, x: event.clientX, y: event.clientY };
      this.canvas.setPointerCapture?.(event.pointerId);
    };
    this.handlePointerUp = (event) => {
      const down = this.pointerDown;
      this.pointerDown = null;
      if (!down || down.id !== event.pointerId || this.disposed || this.lost || this.failed) return;
      if (Math.hypot(event.clientX - down.x, event.clientY - down.y) > 14) return;
      const index = this.indexAt(event.clientX, event.clientY);
      if (index >= 0) this.onCell?.(index);
    };
    this.handlePointerCancel = () => { this.pointerDown = null; };
    this.handleContextLost = (event) => {
      event.preventDefault();
      this.lost = true;
      this.onFailure?.("context-lost");
    };
    this.handleContextRestored = () => {
      if (this.disposed) return;
      this.lost = false;
      this.resize();
      this.invalidate();
    };
    this.canvas.addEventListener("pointerdown", this.handlePointerDown);
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
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
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
    if (this.lastFrame) {
      this.frameTimes.push(Math.min(250, time - this.lastFrame));
      if (this.frameTimes.length > 60) this.frameTimes.shift();
    }
    this.lastFrame = time;
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
    const background = this.assets.background;
    if (background?.complete && background.naturalWidth) ctx.drawImage(background, 0, 0, w, h);
    else {
      const fallback = ctx.createLinearGradient(0, 0, 0, h);
      fallback.addColorStop(0, "#35235f");
      fallback.addColorStop(1, "#21163f");
      ctx.fillStyle = fallback;
      ctx.fillRect(0, 0, w, h);
    }
    const unit = Math.min(w, h);
    const size = unit * 0.88;
    const bounds = { x: (w - size) / 2, y: (h - size) / 2, size };
    this.boardBounds = bounds;
    this.drawFrame(bounds);
    const motion = this.motion;
    const board = motion?.kind === "swap" ? motion.before
      : motion?.kind === "clear" ? motion.batch.before
        : motion?.kind === "gravity" ? motion.cleared : this.board;
    if (board) {
      const hidden = motion?.kind === "swap" ? new Set(motion.indices)
        : motion?.kind === "clear" ? new Set([...motion.batch.directHits, ...motion.batch.adjacentHits])
          : motion?.kind === "gravity" ? motion.hidden : null;
      this.drawTiles(bounds, time, hidden);
      if (motion?.kind === "swap") this.drawSwapMotion(bounds, motion, time);
      else if (motion?.kind === "clear") this.drawClearMotion(bounds, motion, time);
      else if (motion?.kind === "gravity") this.drawGravityMotion(bounds, motion, time);
    }
    if (!motion) this.drawFocus(bounds);
    this.canvas.dataset.renderer = "canvas-2d";
    this.canvas.dataset.imageAssetCount = String(Object.values(this.assets).filter((img) => img?.complete && img.naturalWidth).length);
    this.canvas.dataset.averageFrameMs = this.frameTimes.length
      ? (this.frameTimes.reduce((sum, value) => sum + value, 0) / this.frameTimes.length).toFixed(2) : "0.00";
  }

  drawFrame(bounds) {
    const ctx = this.context;
    const cell = bounds.size / BOARD_WIDTH;
    const gap = Math.max(1.2, cell * 0.035);
    for (let i = 0; i < BOARD_WIDTH * BOARD_HEIGHT; i += 1) {
      const row = Math.floor(i / BOARD_WIDTH);
      const col = i % BOARD_WIDTH;
      const x = bounds.x + col * cell + gap / 2;
      const y = bounds.y + row * cell + gap / 2;
      const inner = cell - gap;
      roundRect(ctx, x, y, inner, inner, cell * 0.14);
      ctx.fillStyle = (row + col) % 2 === 0 ? "#3022549c" : "#241942a8";
      ctx.fill();
      ctx.lineWidth = Math.max(0.55, cell * 0.012);
      ctx.strokeStyle = "#dac9f02e";
      ctx.stroke();
    }
  }

  drawTiles(bounds, time, hidden = null) {
    const cell = bounds.size / BOARD_WIDTH;
    this.board.forEach((tile, index) => {
      if (!tile || hidden?.has(index)) return;
      const x = bounds.x + (index % BOARD_WIDTH) * cell;
      const y = bounds.y + Math.floor(index / BOARD_WIDTH) * cell;
      const cx = x + cell / 2;
      const cy = y + cell / 2;
      this.drawTile(tile, index, cx, cy, cell);
      if (this.highlightCells.has(index)) this.drawImpact(x, y, cell, time);
    });
  }

  drawTile(tile, index, cx, cy, cell, alpha = 1, scale = 1) {
    if (!tile) return;
    const ctx = this.context;
    ctx.save();
    ctx.globalAlpha *= alpha;
    if (tile.exit) this.drawSprite(SPRITE.exit, cx, cy, cell * scale, 0.78, 0.68);
    if (tile.c !== null && tile.c >= 0 && tile.c < GEM_COLORS.length) this.drawGem(tile.c, cx, cy, cell * scale * 0.94);
    if (tile.box) this.drawSprite(SPRITE.crate, cx, cy, cell * scale, 0.96);
    if (tile.chain) this.drawSprite(SPRITE.chain, cx, cy, cell * scale, 0.96);
    if (tile.gate) {
      this.drawSprite(SPRITE.gate, cx, cy, cell * scale, 0.94, 0.92);
      this.drawGateColor(cx, cy, cell * scale, tile.gateColor);
    }
    if (tile.stone) this.drawSprite(SPRITE.stone, cx, cy, cell * scale, tile.stone > 1 ? 0.94 : 0.84);
    if (tile.seal) this.drawSprite(SPRITE.seal, cx, cy, cell * scale, 0.82);
    if (tile.key) this.drawSprite(SPRITE.key, cx, cy, cell * scale, 0.70);
    if (tile.p) this.drawPower(tile.p, cx, cy, cell * scale);
    ctx.restore();
  }

  drawGem(color, cx, cy, size) {
    this.drawSprite(color, cx, cy, size, 0.98);
  }

  drawPower(power, cx, cy, cell) {
    const ctx = this.context;
    const sprite = power.startsWith("arrow") ? SPRITE.arrow : SPRITE[power];
    if (sprite === undefined) return;
    ctx.save();
    const color = power.startsWith("arrow") ? "#ffe585" : power === "bomb" ? "#62caff" : power === "bird" ? "#73f1dc" : "#dc82ff";
    ctx.beginPath();
    ctx.arc(cx, cy, cell * 0.36, 0, Math.PI * 2);
    ctx.lineWidth = Math.max(1.2, cell * 0.035);
    ctx.strokeStyle = color + "a8";
    ctx.stroke();
    ctx.translate(cx, cy);
    if (power === "arrowV") ctx.rotate(Math.PI / 2);
    this.drawSprite(sprite, 0, 0, cell, 0.63);
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

  drawSprite(sprite, cx, cy, cell, scale = 0.9, alpha = 1) {
    const atlas = this.assets.atlas;
    if (!atlas?.complete || !atlas.naturalWidth) return;
    const sourceWidth = atlas.naturalWidth / COLS;
    const sourceHeight = atlas.naturalHeight / ROWS;
    const size = cell * scale;
    const ctx = this.context;
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.drawImage(atlas, (sprite % COLS) * sourceWidth, Math.floor(sprite / COLS) * sourceHeight, sourceWidth, sourceHeight, cx - size / 2, cy - size / 2, size, size);
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
      this.invalidate();
      return Promise.resolve(false);
    }
    return new Promise((resolve) => {
      motion.started = performance.now();
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
      duration: accepted ? 190 : 245,
    });
  }

  animateClear(batch) {
    this.board = batch.before;
    return this.runMotion({ kind: "clear", batch, finalBoard: batch.cleared, duration: batch.visualEffects?.length ? 335 : 255 });
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
    const stagger = (item) => (item.col % 3) * 18 + (item.spawnOrder || 0) * 54;
    const travel = (item) => 190 + Math.min(7, Math.abs(item.toRow - item.fromRow)) * 27;
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

  drawClearMotion(bounds, motion, time) {
    const { batch } = motion;
    const progress = clamp((time - motion.started) / motion.duration, 0, 1);
    const cell = bounds.size / BOARD_WIDTH;
    const powerOrigins = new Set((batch.visualEffects || []).flatMap((effect) => [
      ...(Number.isInteger(effect.index) ? [effect.index] : []),
      ...(effect.origins || []),
    ]));
    for (const index of batch.directHits) {
      const tile = batch.before[index];
      if (!tile) continue;
      const row = Math.floor(index / BOARD_WIDTH);
      const col = index % BOARD_WIDTH;
      const alpha = 1 - progress;
      const scale = Math.max(0.25, 1 - progress * 0.72);
      const cx = bounds.x + (col + 0.5) * cell;
      const cy = bounds.y + (row + 0.5) * cell;
      this.drawTile(tile, index, cx, cy, cell, alpha, scale);
      const burst = Math.sin(progress * Math.PI);
      this.context.save();
      this.context.globalAlpha *= (1 - progress) * 0.7;
      this.drawSprite(SPRITE.ripple, cx, cy, cell * (0.34 + progress * 1.06), 0.9);
      this.drawSprite(SPRITE.spark, cx, cy, cell * (0.6 + burst * 0.38), 0.58 + burst * 0.2, 0.92);
      this.context.restore();
      const strong = powerOrigins.has(index);
      const count = strong ? 8 : batch.directHits.length > 24 ? 1 : 3;
      this.drawParticleBurst(cx, cy, cell, progress, count, strong ? 1.8 : 0.78, strong ? "#fff0a6" : "#c5f7ff", index);
    }
    for (const index of batch.adjacentHits) {
      const tile = batch.before[index];
      if (!tile) continue;
      const row = Math.floor(index / BOARD_WIDTH);
      const col = index % BOARD_WIDTH;
      const cx = bounds.x + (col + 0.5) * cell;
      const cy = bounds.y + (row + 0.5) * cell;
      const after = batch.cleared[index] || tile;
      const boxRemoved = Boolean(tile.box && !after.box);
      const chainRemoved = Boolean(tile.chain && !after.chain);
      const tileWithoutHitBlockers = {
        ...tile,
        box: boxRemoved ? 0 : tile.box,
        chain: chainRemoved ? 0 : tile.chain,
      };
      this.drawTile(tileWithoutHitBlockers, index, cx, cy, cell);
      if (!boxRemoved && !chainRemoved) continue;
      const fade = 1 - progress;
      const scale = 1 + Math.sin(progress * Math.PI) * 0.14 - progress * 0.12;
      if (boxRemoved) this.drawSprite(SPRITE.crate, cx, cy, cell * scale, 0.96, fade);
      if (chainRemoved) this.drawSprite(SPRITE.chain, cx, cy, cell * scale, 0.96, fade);
      this.drawParticleBurst(cx, cy, cell, progress, 4, 0.72, "#ffe3a1", index + 9);
    }
    this.drawSpecialEffects(bounds, batch.visualEffects || [], progress, cell);
    if (batch.createdSpecial) {
      const { at, power } = batch.createdSpecial;
      const row = Math.floor(at / BOARD_WIDTH);
      const col = at % BOARD_WIDTH;
      const cx = bounds.x + (col + 0.5) * cell;
      const cy = bounds.y + (row + 0.5) * cell;
      const sprite = power.startsWith("arrow") ? SPRITE.arrow : SPRITE[power];
      if (sprite !== undefined) {
        const appear = clamp((progress - 0.4) / 0.6, 0, 1);
        this.context.save();
        this.context.globalAlpha *= appear;
        this.drawSprite(sprite, cx, cy, cell, 0.48 + appear * 0.38);
        this.context.restore();
        this.drawRing(cx, cy, cell * (0.2 + appear * 0.28), 1 - appear * 0.5, "#ffe68a", cell * 0.035);
      }
    }
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
    const elapsed = time - motion.started;
    const cell = bounds.size / BOARD_WIDTH;
    for (const item of motion.movements) {
      const local = clamp((elapsed - motion.stagger(item)) / motion.travel(item), 0, 1);
      const eased = 1 - (1 - local) ** 3;
      const fromRow = item.fromRow;
      const rowProgress = item.isDelivery ? -local * 0.42 : fromRow + (item.toRow - fromRow) * eased;
      const y = bounds.y + (rowProgress + 0.5) * cell;
      const x = bounds.x + (item.col + 0.5) * cell;
      const landing = item.isDelivery ? 1 : local > 0.82 ? 1 + Math.sin((local - 0.82) / 0.18 * Math.PI) * 0.055 : 1;
      const delivering = motion.deliveredKeys.includes(item.toIndex) && item.payload.key;
      const fade = item.isDelivery ? 1 - local : delivering && local > 0.76 ? 1 - (local - 0.76) / 0.24 : 1;
      this.drawTile(item.payload, item.toIndex, x, y, cell, fade, landing);
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
  }

  drawSpecialEffects(bounds, effects, progress, cell) {
    for (const effect of effects) {
      const center = effect.index ?? effect.origins?.[0] ?? 40;
      const row = Math.floor(center / BOARD_WIDTH);
      const col = center % BOARD_WIDTH;
      const cx = bounds.x + (col + 0.5) * cell;
      const cy = bounds.y + (row + 0.5) * cell;
      if (effect.type === "arrow") {
        const horizontal = effect.axis === "h";
        const startX = horizontal ? bounds.x : cx;
        const startY = horizontal ? cy : bounds.y;
        const endX = horizontal ? bounds.x + bounds.size * progress : cx;
        const endY = horizontal ? cy : bounds.y + bounds.size * progress;
        this.drawBeam(startX, startY, endX, endY, "#fff0a0", cell * 0.12, cell * 0.28);
        this.drawSprite(SPRITE.spark, endX, endY, cell * (0.42 + Math.sin(progress * Math.PI) * 0.22), 0.82, 1 - progress * 0.32);
        this.drawParticleBurst(endX, endY, cell, progress, 5, 0.9, "#fff0a0", center);
      } else if (effect.type === "bomb" || effect.type === "nova") {
        this.drawRing(cx, cy, cell * (0.35 + progress * (effect.radius + 0.45)), 1 - progress * 0.68, "#ffbf53", cell * 0.11);
        this.drawRing(cx, cy, cell * (0.2 + progress * (effect.radius + 0.2)), 1 - progress * 0.8, "#fff4c8", cell * 0.035);
        if (effect.type === "nova") this.drawRing(cx, cy, cell * (0.3 + progress * (effect.radius + 0.8)), 1 - progress * 0.82, "#9af2ff", cell * 0.045);
        this.drawParticleBurst(cx, cy, cell, progress, effect.type === "nova" ? 14 : 8, effect.radius + 1.4, effect.type === "nova" ? "#fff0bd" : "#ffcb68", center);
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
        const hue = ((effect.color || 0) * 64 + progress * 110) % 360;
        const color = `hsl(${hue} 100% 76%)`;
        const span = effect.type === "spectrum" ? bounds.size * 0.78 : bounds.size * 0.5;
        this.drawBeam(bounds.x + bounds.size * (1 - progress), cy, bounds.x + bounds.size * (1 - progress) + span, cy, color, cell * 0.08, cell * 0.28);
        for (const target of effect.targets || []) {
          const tr = Math.floor(target / BOARD_WIDTH);
          const tc = target % BOARD_WIDTH;
          const tx = bounds.x + (tc + 0.5) * cell;
          const ty = bounds.y + (tr + 0.5) * cell;
          this.drawRing(tx, ty, cell * (0.12 + progress * 0.38), 1 - progress * 0.72, color, cell * 0.035);
        }
      } else if (effect.type === "cross") {
        this.drawBeam(bounds.x, cy, bounds.x + bounds.size * progress, cy, "#fff0a0", cell * 0.12, cell * 0.3);
        this.drawBeam(cx, bounds.y, cx, bounds.y + bounds.size * progress, "#a3f7ff", cell * 0.12, cell * 0.3);
      } else if (effect.type === "siege") {
        for (const offset of [-1, 0, 1]) {
          const lineRow = row + offset;
          const lineCol = col + offset;
          if (lineRow >= 0 && lineRow < BOARD_HEIGHT) this.drawBeam(bounds.x, bounds.y + (lineRow + 0.5) * cell, bounds.x + bounds.size * progress, bounds.y + (lineRow + 0.5) * cell, "#ffd980", cell * 0.075, cell * 0.23);
          if (lineCol >= 0 && lineCol < BOARD_WIDTH) this.drawBeam(bounds.x + (lineCol + 0.5) * cell, bounds.y, bounds.x + (lineCol + 0.5) * cell, bounds.y + bounds.size * progress, "#b4f5ff", cell * 0.075, cell * 0.23);
        }
      } else if (effect.type === "combo-burst") {
        this.drawComboBurst(bounds, effect, progress, cell);
      }
    }
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
    const arc = Math.sin(progress * Math.PI) * cell * 1.05;
    const x = fromX + (toX - fromX) * progress;
    const y = fromY + (toY - fromY) * progress - arc;
    this.drawBeam(fromX, fromY, x, y, "#8ff6e1", cell * 0.045, cell * 0.12);
    const sprite = SPRITE.bird;
    this.drawSprite(sprite, x, y, cell, 0.52 + Math.sin(progress * Math.PI) * 0.1, 1 - progress * 0.15);
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
    if (this.handleWindowResize) window.removeEventListener("resize", this.handleWindowResize);
    this.canvas?.removeEventListener("pointerdown", this.handlePointerDown);
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
  }
}
