import { createEnemyImpactLayer } from './game-enemy-impact-3d.mjs?v=world-hit-1&wp-media=b835eac6524ea17a';

const atlasUrls = new Map([
  ["fire", new URL("./effects/fire-impact-v1.webp?wp-media=b835eac6524ea17a", import.meta.url).href],
  ["wind", new URL("./effects/wind-impact-v1.webp?wp-media=b835eac6524ea17a", import.meta.url).href],
  ["water", new URL("./effects/water-impact-v1.webp?wp-media=b835eac6524ea17a", import.meta.url).href],
  ["light", new URL("./effects/light-impact-v1.webp?wp-media=b835eac6524ea17a", import.meta.url).href],
  ["dark", new URL("./effects/dark-impact-v1.webp?wp-media=b835eac6524ea17a", import.meta.url).href],
]);
const TILE_SIZE = 192;
const COLUMNS = 6;
const NORMAL_FRAMES = 24;
const NORMAL_DURATION = 0.8;
const STRONG_DURATION = 0.94;
const STILL_DURATION = 0.20;
const atlasPromises = new Map();

// Prepare only the elements this scene actually uses. Concurrent callers share each decode.
export function loadElementImpactAtlas(element) {
  const url = atlasUrls.get(element);
  if (!url) return Promise.reject(new RangeError("Unknown impact element: " + element));
  if (!atlasPromises.has(element)) {
    const atlas = new Image();
    atlas.src = url;
    atlasPromises.set(element, atlas.decode().then(() => atlas).catch(error => {
      atlasPromises.delete(element);
      throw error;
    }));
  }
  return atlasPromises.get(element);
}

// Time is in seconds from contact. The returned source rectangle also supports a texture atlas.
export function elementImpactFrame(elapsed, { strong = false, reducedMotion = false } = {}) {
  const duration = reducedMotion ? STILL_DURATION : strong ? STRONG_DURATION : NORMAL_DURATION;
  if (!Number.isFinite(elapsed) || elapsed < 0 || elapsed >= duration) return null;
  const progress = elapsed / duration;
  const frame = reducedMotion ? NORMAL_FRAMES : Math.floor(progress * NORMAL_FRAMES);
  return {
    sx: (frame % COLUMNS) * TILE_SIZE,
    sy: Math.floor(frame / COLUMNS) * TILE_SIZE,
    size: TILE_SIZE,
    opacity: reducedMotion ? 0.84 * (1 - progress) : strong ? 1 : 0.86,
    scale: reducedMotion ? 1 : strong ? 1.17 : 1,
  };
}

// Coordinates and radius use the caller's canvas units. A negative directionX mirrors the effect.
export function drawElementImpact(ctx, atlas, {
  x, y, radius, elapsed, directionX = 1, strong = false, reducedMotion = false,
}) {
  const frame = elementImpactFrame(elapsed, { strong, reducedMotion });
  if (!frame || !atlas?.naturalWidth || ![x, y, radius].every(Number.isFinite) || radius <= 0) return;
  const extent = radius * frame.scale;
  ctx.save();
  ctx.translate(x, y);
  if (directionX < 0) ctx.scale(-1, 1);
  ctx.globalAlpha *= frame.opacity;
  ctx.drawImage(atlas, frame.sx, frame.sy, frame.size, frame.size,
    -extent, -extent, extent * 2, extent * 2);
  ctx.restore();
}

// Keep runtime events on the owning scene's clock, including pauses and restarts.
export function createElementImpactQueue(limit = 10) {
  const effects = [];
  return {
    add(effect) {
      if (effects.length >= limit) effects.shift();
      effects.push({ ...effect, elapsed: 0 });
    },
    advance(delta, reducedMotion = false) {
      for (let index = effects.length - 1; index >= 0; index--) {
        const effect = effects[index];
        effect.elapsed += delta;
        if (!elementImpactFrame(effect.elapsed, { strong: effect.strong, reducedMotion })) {
          effects.splice(index, 1);
        }
      }
    },
    forEach(draw) { effects.forEach(draw); },
    clear() { effects.length = 0; },
  };
}

export { createEnemyImpactLayer as createThreeElementImpactLayer };

// Use the scene clock so a pause freezes both the sprite and its lifetime.
export function createSceneElementImpacts(three, scene, elements, limit = 8) {
  const layers = new Map(elements.map(element =>
    [element, createEnemyImpactLayer(three, scene, element, limit)]));
  const queue = createElementImpactQueue(limit);
  return {
    add(element, contact) {
      if (!layers.get(element)?.ready) return false;
      queue.add({ ...contact, element });
      return true;
    },
    render(camera, dt, reducedMotion) {
      for (const layer of layers.values()) layer.begin();
      queue.forEach(hit => layers.get(hit.element).draw(camera, { ...hit, reducedMotion }));
      queue.advance(dt, reducedMotion);
    },
    clear() {
      queue.clear();
      for (const layer of layers.values()) layer.begin();
    },
    dispose() {
      queue.clear();
      for (const layer of layers.values()) layer.dispose();
      layers.clear();
    },
  };
}

// The positioned parent supplies the coordinate system (board cell or playfield).
export function playElementImpactAt(parent, atlas, {
  left = '50%', top = '50%', size = '105%', zIndex = 5, ...options
} = {}) {
  if (!parent?.isConnected || !atlas?.naturalWidth) return;
  parent.querySelector(':scope > canvas.wp-element-impact')?.remove();
  const canvas = document.createElement('canvas');
  canvas.className = 'wp-element-impact';
  canvas.width = canvas.height = TILE_SIZE;
  canvas.setAttribute('aria-hidden', 'true');
  Object.assign(canvas.style, { position: 'absolute', left, top, width: size, height: 'auto',
    aspectRatio: '1', transform: 'translate(-50%,-50%)', pointerEvents: 'none', zIndex: String(zIndex) });
  parent.append(canvas);
  playElementImpactOnCanvas(canvas, atlas, options);
}

// The caller places and owns the canvas in its action layer.
export function playElementImpactOnCanvas(canvas, atlas, {
  strong = false, directionX = 1, radius = canvas.width / (strong ? 2.34 : 2),
  reducedMotion = false, isPaused = () => false,
} = {}) {
  const ctx = canvas.getContext("2d");
  let previous = performance.now(), elapsed = 0;
  function render(now) {
    if (!isPaused()) elapsed += Math.max(0, (now - previous) / 1000);
    previous = now;
    if (!canvas.isConnected || !elementImpactFrame(elapsed, { strong, reducedMotion })) {
      canvas.remove();
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawElementImpact(ctx, atlas, {
      x: canvas.width / 2, y: canvas.height / 2, radius, elapsed, strong, directionX, reducedMotion,
    });
    requestAnimationFrame(render);
  }
  render(previous);
}
