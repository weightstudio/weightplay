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
    this.lastFrame = 0;
    this.frameTimes = [];
    this.reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    this.assets = {
      atlas: this.loadImage(new URL("./assets/castle-cascade-board-sprites-v1.webp", import.meta.url).href),
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
    if (this.highlightCells.size && !this.reducedMotion && time < this.highlightUntil) this.invalidate();
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
    const size = unit * 0.76;
    const bounds = { x: (w - size) / 2, y: (h - size) / 2 + unit * 0.012, size };
    this.boardBounds = bounds;
    this.drawFrame(bounds);
    if (this.board) this.drawTiles(bounds, time);
    this.drawFocus(bounds);
    this.canvas.dataset.renderer = "canvas-2d";
    this.canvas.dataset.imageAssetCount = String(Object.values(this.assets).filter((img) => img?.complete && img.naturalWidth).length);
    this.canvas.dataset.averageFrameMs = this.frameTimes.length
      ? (this.frameTimes.reduce((sum, value) => sum + value, 0) / this.frameTimes.length).toFixed(2) : "0.00";
  }

  drawFrame(bounds) {
    const ctx = this.context;
    const frame = bounds.size * 0.027;
    ctx.save();
    ctx.shadowColor = "#100b2bc2";
    ctx.shadowBlur = bounds.size * 0.08;
    ctx.shadowOffsetY = bounds.size * 0.018;
    roundRect(ctx, bounds.x - frame, bounds.y - frame, bounds.size + frame * 2, bounds.size + frame * 2, frame * 1.5);
    const plate = ctx.createLinearGradient(0, bounds.y - frame, 0, bounds.y + bounds.size + frame);
    plate.addColorStop(0, "#9e77cc");
    plate.addColorStop(0.12, "#503179");
    plate.addColorStop(0.82, "#3c245f");
    plate.addColorStop(1, "#8a5dba");
    ctx.fillStyle = plate;
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.lineWidth = Math.max(1.4, frame * 0.26);
    ctx.strokeStyle = "#f2ca68";
    ctx.stroke();
    ctx.restore();
    const cell = bounds.size / BOARD_WIDTH;
    const gap = Math.max(1.5, cell * 0.045);
    for (let i = 0; i < BOARD_WIDTH * BOARD_HEIGHT; i += 1) {
      const row = Math.floor(i / BOARD_WIDTH);
      const col = i % BOARD_WIDTH;
      const x = bounds.x + col * cell + gap / 2;
      const y = bounds.y + row * cell + gap / 2;
      const inner = cell - gap;
      roundRect(ctx, x, y, inner, inner, cell * 0.14);
      const fill = ctx.createLinearGradient(x, y, x + inner * 0.2, y + inner);
      if ((row + col) % 2 === 0) {
        fill.addColorStop(0, "#64498dbb");
        fill.addColorStop(1, "#37255fda");
      } else {
        fill.addColorStop(0, "#503777ce");
        fill.addColorStop(1, "#302153e8");
      }
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.lineWidth = Math.max(0.7, cell * 0.018);
      ctx.strokeStyle = "#c7a9ef42";
      ctx.stroke();
    }
  }

  drawTiles(bounds, time) {
    const cell = bounds.size / BOARD_WIDTH;
    this.board.forEach((tile, index) => {
      if (!tile) return;
      const x = bounds.x + (index % BOARD_WIDTH) * cell;
      const y = bounds.y + Math.floor(index / BOARD_WIDTH) * cell;
      const cx = x + cell / 2;
      const cy = y + cell / 2;
      if (tile.exit) this.drawSprite(SPRITE.exit, cx, cy, cell, 0.78, 0.68);
      if (tile.c !== null && tile.c >= 0 && tile.c < GEM_COLORS.length) this.drawGem(tile.c, cx, cy, cell * 0.94);
      if (tile.box) this.drawSprite(SPRITE.crate, cx, cy, cell, 0.96);
      if (tile.chain) this.drawSprite(SPRITE.chain, cx, cy, cell, 0.96);
      if (tile.gate) {
        this.drawSprite(SPRITE.gate, cx, cy, cell, 0.94, 0.92);
        this.drawGateColor(cx, cy, cell, tile.gateColor);
      }
      if (tile.stone) this.drawSprite(SPRITE.stone, cx, cy, cell, tile.stone > 1 ? 0.94 : 0.84);
      if (tile.seal) this.drawSprite(SPRITE.seal, cx, cy, cell, 0.82);
      if (tile.key) this.drawSprite(SPRITE.key, cx, cy, cell, 0.70);
      if (tile.p) this.drawPower(tile.p, cx, cy, cell);
      if (this.highlightCells.has(index)) this.drawImpact(x, y, cell, time);
    });
  }

  drawGem(color, cx, cy, size) {
    const ctx = this.context;
    const glow = ctx.createRadialGradient(cx, cy, size * 0.08, cx, cy, size * 0.72);
    glow.addColorStop(0, GEM_COLORS[color] + "66");
    glow.addColorStop(1, GEM_COLORS[color] + "00");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.72, 0, Math.PI * 2);
    ctx.fill();
    this.drawSprite(color, cx, cy, size, 0.98);
  }

  drawPower(power, cx, cy, cell) {
    const ctx = this.context;
    const sprite = power.startsWith("arrow") ? SPRITE.arrow : SPRITE[power];
    if (sprite === undefined) return;
    ctx.save();
    const color = power.startsWith("arrow") ? "#ffe585" : power === "bomb" ? "#62caff" : "#dc82ff";
    const glow = ctx.createRadialGradient(cx, cy, cell * 0.04, cx, cy, cell * 0.54);
    glow.addColorStop(0, color + "bc");
    glow.addColorStop(1, color + "00");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, cell * 0.54, 0, Math.PI * 2);
    ctx.fill();
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
