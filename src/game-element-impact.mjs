const atlasUrls = new Map([
  ["fire", new URL("./effects/fire-impact-v1.webp?wp-media=b1c5ab06858eb2d8", import.meta.url).href],
  ["wind", new URL("./effects/wind-impact-v1.webp?wp-media=b1c5ab06858eb2d8", import.meta.url).href],
  ["water", new URL("./effects/water-impact-v1.webp?wp-media=b1c5ab06858eb2d8", import.meta.url).href],
  ["light", new URL("./effects/light-impact-v1.webp?wp-media=b1c5ab06858eb2d8", import.meta.url).href],
  ["dark", new URL("./effects/dark-impact-v1.webp?wp-media=b1c5ab06858eb2d8", import.meta.url).href],
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

// A small pool of camera-facing planes draws the same atlas inside a 3D scene.
// The caller supplies world coordinates and owns the render and teardown.
export function createThreeElementImpactLayer(three, scene, element, limit = 10) {
  const meshes = [];
  let atlas, texture, used = 0, disposed = false;
  loadElementImpactAtlas(element).then(image => {
    if (disposed) return;
    atlas = image;
    texture = new three.Texture(image);
    texture.colorSpace = three.SRGBColorSpace;
    texture.generateMipmaps = false;
    texture.minFilter = three.LinearFilter;
    texture.needsUpdate = true;
  }).catch(() => {}); // Existing gameplay and its fallback feedback can still render.

  function reserve(index) {
    if (meshes[index]) return meshes[index];
    const geometry = new three.PlaneGeometry(2, 2);
    const material = new three.MeshBasicMaterial({
      map: texture, transparent: true, depthTest: false, depthWrite: false, toneMapped: false,
    });
    const mesh = new three.Mesh(geometry, material);
    mesh.frustumCulled = false;
    mesh.renderOrder = 11;
    scene.add(mesh);
    meshes.push(mesh);
    return mesh;
  }

  return {
    get ready() { return Boolean(texture); },
    begin() {
      used = 0;
      for (const mesh of meshes) mesh.visible = false;
    },
    draw(camera, { x, y, z, radius, elapsed, directionX = 1, strong = false, reducedMotion = false }) {
      if (!texture || used >= limit) return false;
      const frame = elementImpactFrame(elapsed, { strong, reducedMotion });
      if (!frame) return false;
      const mesh = reserve(used++);
      // Half-texel inset keeps adjacent atlas tiles out of the linear filter.
      let left = (frame.sx + 0.5) / atlas.naturalWidth;
      let right = (frame.sx + frame.size - 0.5) / atlas.naturalWidth;
      if (directionX < 0) [left, right] = [right, left];
      const top = 1 - (frame.sy + 0.5) / atlas.naturalHeight;
      const bottom = 1 - (frame.sy + frame.size - 0.5) / atlas.naturalHeight;
      const uv = mesh.geometry.attributes.uv;
      uv.setXY(0, left, top).setXY(1, right, top).setXY(2, left, bottom).setXY(3, right, bottom);
      uv.needsUpdate = true;
      mesh.position.set(x, y, z);
      camera.getWorldQuaternion(mesh.quaternion);
      mesh.scale.setScalar(radius * frame.scale);
      mesh.material.opacity = frame.opacity;
      mesh.visible = true;
      return true;
    },
    dispose() {
      disposed = true;
      for (const mesh of meshes) {
        scene.remove(mesh);
        mesh.geometry.dispose();
        mesh.material.dispose();
      }
      meshes.length = 0;
      texture?.dispose();
      texture = undefined;
      atlas = undefined;
    },
  };
}

// Use the scene clock so a pause freezes both the sprite and its lifetime.
export function createSceneElementImpacts(three, scene, elements, limit = 8) {
  const layers = new Map(elements.map(element =>
    [element, createThreeElementImpactLayer(three, scene, element, limit)]));
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
