import * as THREE from "../animal-skyspire-drop/vendor/three/three.module.min.js";
import { SHAPES, PALETTE } from "./garden-core.mjs";

// A single local Three.js context renders the living garden and its matching
// inventory portraits. Motion is finite; an idle or hidden garden has no RAF.
export class GardenScene {
  constructor(host) {
    this.host = host;
    this.dead = false;
    this.visible = false;
    this.raf = 0;
    this.motion = null;
    this.materials = new Map();
    this.geometries = new Set();
    this.icons = new Map();
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "low-power",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor(0, 0);
    this.renderer.domElement.setAttribute("aria-hidden", "true");
    host.prepend(this.renderer.domElement);
    this.scene = new THREE.Scene();
    this.scene.add(new THREE.HemisphereLight(0xe6fff2, 0x4c4939, 2.1));
    const sun = new THREE.DirectionalLight(0xfff1c9, 3.0);
    sun.position.set(-3, 8, 5);
    this.scene.add(sun);
    this.camera = new THREE.OrthographicCamera(-4.7, 4.7, 3.8, -3.8, 0.1, 60);
    this.camera.position.set(6.8, 8.5, 10.6);
    this.camera.lookAt(0, 0.8, 0);
    this.boxGeo = this.track(new THREE.BoxGeometry(1, 1, 1));
    this.runeGeos = Object.fromEntries(
      SHAPES.map((s) => [s, this.runeGeometry(s)]),
    );
    this.world = new THREE.Group();
    this.scene.add(this.world);
    this.box(this.world, [0, -0.36, 0], [7, 0.7, 5.7], "#a8875f");
    this.box(this.world, [0, 0.03, 0], [7.12, 0.17, 5.82], "#7fae6f");
    this.box(this.world, [0, 0.16, 0], [6.75, 0.12, 5.45], "#9bc17d");
    this.box(this.world, [0, 0.25, -2.1], [5.8, 0.2, 0.72], "#d9c99c");
    this.box(this.world, [0, 0.23, 2.45], [5.9, 0.12, 0.38], "#ddd2ae");
    for (let i = 0; i < 9; i++)
      this.box(
        this.world,
        [-3 + i * 0.75, 0.04, 2.86],
        [0.68, 0.31, 0.16],
        i % 2 ? "#8e805f" : "#a79a70",
      );
    for (let i = 0; i < 5; i++)
      this.box(this.world, [3.53, 0.03, -2 + i], [0.17, 0.32, 0.82], "#a79a70");
    // Raised meadow, lantern gate, and a tiny stepped stream behind the beds.
    this.box(this.world, [1.95, 0.43, -1.9], [2.1, 0.5, 1.25], "#668e5d");
    this.box(this.world, [2.1, 0.71, -2.1], [1.7, 0.13, 1.02], "#b4ca83");
    this.box(this.world, [2.95, 0.84, -2], [0.48, 0.13, 1.18], "#66c7c6");
    this.box(this.world, [3.05, 0.51, -1.28], [0.57, 0.45, 0.12], "#86e0d5");
    this.box(this.world, [3.05, 0.26, -0.95], [0.6, 0.12, 0.55], "#66c7c6");
    for (const x of [0.6, 2.1]) {
      this.box(this.world, [x, 1.12, -2.25], [0.16, 1.85, 0.18], "#b7a46e");
      this.box(this.world, [x, 1.95, -2.25], [0.34, 0.16, 0.35], "#e7d7a1");
    }
    this.box(this.world, [1.35, 2.04, -2.25], [1.95, 0.2, 0.26], "#497c59");
    this.box(this.world, [1.35, 1.65, -2.25], [0.32, 0.39, 0.3], "#ffe092");
    for (const [x, z, s] of [
      [-3, -2.2, 0.8],
      [-3, 0.8, 0.5],
      [3.05, 1.7, 0.45],
      [0.1, -2.4, 0.55],
    ])
      this.tree(x, z, s);
    this.taro = new THREE.Group();
    this.taro.position.set(-1.75, 0.28, -1.78);
    this.taro.rotation.y = 0.2;
    this.taro.scale.setScalar(0.74);
    this.world.add(this.taro);
    this.buildTaro();
    this.pots = [];
    for (let i = 0; i < 6; i++) {
      const p = new THREE.Group();
      p.position.set(
        ((i % 3) - 1) * 1.72,
        0.28,
        Math.floor(i / 3) * 1.62 - 0.48,
      );
      this.world.add(p);
      this.box(p, [0, 0.1, 0], [1.35, 0.22, 1.18], "#bfa77b");
      this.box(p, [0, 0.24, 0], [1.19, 0.16, 1.03], "#eadbb0");
      this.box(p, [0, 0.335, 0], [0.97, 0.04, 0.81], "#685944");
      const ring = new THREE.Group();
      p.add(ring);
      for (const x of [-0.61, 0.61])
        this.box(ring, [x, 0.36, 0], [0.06, 0.055, 1.12], "#ffe7a0");
      for (const z of [-0.53, 0.53])
        this.box(ring, [0, 0.36, z], [1.28, 0.055, 0.06], "#ffe7a0");
      ring.visible = false;
      const plant = new THREE.Group();
      plant.position.y = 0.36;
      p.add(plant);
      this.pots.push({ group: p, plant, ring });
    }
    this.flight = new THREE.Group();
    this.world.add(this.flight);
    this.flight.visible = false;
    this.particles = Array.from({ length: 12 }, (_, i) => {
      const m = this.box(
        this.world,
        [0, 0, 0],
        [0.08, 0.08, 0.08],
        i % 2 ? "#fff1ae" : "#d4ffb1",
      );
      m.visible = false;
      return m;
    });
    this.motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
    this.onReduced = () => this.finishMotion();
    this.motionQuery.addEventListener("change", this.onReduced);
    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(host);
    this.onLost = (e) => {
      e.preventDefault();
      this.stop();
      host.dataset.renderer = "lost";
      host.querySelector("#gardenFallback").hidden = false;
    };
    this.onRestored = () => {
      delete host.dataset.renderer;
      host.querySelector("#gardenFallback").hidden = true;
      this.resize();
    };
    this.renderer.domElement.addEventListener("webglcontextlost", this.onLost);
    this.renderer.domElement.addEventListener(
      "webglcontextrestored",
      this.onRestored,
    );
    this.style("dawn");
  }
  track(g) {
    this.geometries.add(g);
    return g;
  }
  material(color) {
    if (!this.materials.has(color))
      this.materials.set(
        color,
        new THREE.MeshStandardMaterial({
          color,
          roughness: 0.83,
          metalness: 0,
        }),
      );
    return this.materials.get(color);
  }
  box(parent, position, scale, color) {
    const m = new THREE.Mesh(this.boxGeo, this.material(color));
    m.position.set(...position);
    m.scale.set(...scale);
    parent.add(m);
    return m;
  }
  tree(x, z, s) {
    const g = new THREE.Group();
    g.position.set(x, 0.2, z);
    g.scale.setScalar(s);
    this.world.add(g);
    this.box(g, [0, 0.5, 0], [0.22, 1, 0.22], "#9b7a4c");
    this.box(g, [0, 1.1, 0], [0.88, 0.65, 0.8], "#518957");
    this.box(g, [-0.13, 1.53, 0], [0.64, 0.35, 0.62], "#89b76e");
    this.box(g, [0.14, 1.77, -0.08], [0.36, 0.16, 0.38], "#b0cb81");
  }
  buildTaro() {
    const t = this.taro;
    for (const x of [-0.47, 0.47]) {
      this.box(t, [x, 0.13, 0.35], [0.39, 0.27, 0.47], "#b8a45b");
      this.box(t, [x, 0.21, -0.36], [0.36, 0.3, 0.43], "#779d54");
    }
    this.box(t, [0, 0.49, -0.1], [1.25, 0.63, 1.1], "#517c49");
    this.box(t, [0, 0.85, -0.2], [1.13, 0.28, 0.98], "#8baf62");
    this.box(t, [0, 0.68, 0.67], [0.98, 0.73, 0.66], "#c6cb76");
    this.box(t, [0, 0.48, 0.99], [0.8, 0.25, 0.28], "#e2d28a");
    this.box(t, [0, 0.28, 0.57], [1.02, 0.14, 0.7], "#806a3c");
    for (const x of [-0.29, 0.29]) {
      this.box(t, [x, 0.77, 1.01], [0.23, 0.27, 0.055], "#fff1cf");
      this.box(t, [x + 0.02, 0.76, 1.045], [0.12, 0.19, 0.05], "#3c3c2d");
    }
    this.box(t, [0, 0.44, 1.145], [0.24, 0.025, 0.02], "#65593a");
    this.box(t, [0, 1.07, -0.21], [0.91, 0.22, 0.77], "#c7c79d");
    this.box(t, [0, 1.22, -0.23], [0.72, 0.16, 0.58], "#76a45a");
    for (const x of [-0.37, 0.37])
      for (const z of [-0.52, 0.08])
        this.box(t, [x, 1.29, z], [0.22, 0.27, 0.22], "#e0d8ad");
    this.box(t, [0, 1.19, 0.18], [0.2, 0.27, 0.055], "#866340");
    this.box(t, [-0.18, 1.53, -0.4], [0.08, 0.5, 0.08], "#9c7b42");
    this.box(t, [-0.18, 1.83, -0.4], [0.4, 0.35, 0.38], "#6f9e4e");
    this.box(t, [0.19, 1.39, -0.31], [0.2, 0.06, 0.35], "#83d8ce");
    this.box(t, [0.45, 1.58, -0.25], [0.04, 0.63, 0.04], "#be9e53");
    this.box(t, [0.59, 1.82, -0.25], [0.27, 0.2, 0.035], "#f3dc84");
  }
  runeGeometry(name) {
    const shape = new THREE.Shape();
    if (name === "circle") shape.absarc(0, 0, 0.48, 0, Math.PI * 2, false);
    else if (name === "heart") {
      shape.moveTo(0, -0.48);
      shape.bezierCurveTo(-0.15, -0.25, -0.55, 0.02, -0.5, 0.29);
      shape.bezierCurveTo(-0.46, 0.6, -0.12, 0.62, 0, 0.36);
      shape.bezierCurveTo(0.12, 0.62, 0.46, 0.6, 0.5, 0.29);
      shape.bezierCurveTo(0.55, 0.02, 0.15, -0.25, 0, -0.48);
    } else {
      let pts =
        name === "triangle"
          ? [
              [0, 0.55],
              [-0.52, -0.38],
              [0.52, -0.38],
            ]
          : name === "square"
            ? [
                [-0.43, -0.43],
                [0.43, -0.43],
                [0.43, 0.43],
                [-0.43, 0.43],
              ]
            : name === "diamond"
              ? [
                  [0, 0.57],
                  [-0.43, 0],
                  [0, -0.57],
                  [0.43, 0],
                ]
              : Array.from({ length: 10 }, (_, i) => {
                  const a = Math.PI / 2 + (i * Math.PI) / 5,
                    r = i % 2 ? 0.24 : 0.54;
                  return [Math.cos(a) * r, Math.sin(a) * r];
                });
      shape.moveTo(...pts[0]);
      pts.slice(1).forEach((p) => shape.lineTo(...p));
      shape.closePath();
    }
    const g = new THREE.ExtrudeGeometry(shape, {
      depth: 0.14,
      bevelEnabled: true,
      bevelSize: 0.035,
      bevelThickness: 0.035,
      bevelSegments: 1,
      steps: 1,
      curveSegments: 8,
    });
    g.center();
    return this.track(g);
  }
  rune(tile, parent) {
    const m = new THREE.Mesh(
      this.runeGeos[tile.shape],
      this.material(PALETTE[tile.color]),
    );
    parent.add(m);
    return m;
  }
  icon(tile) {
    const key = tile.shape + tile.color;
    if (this.icons.has(key)) return this.icons.get(key);
    const s = new THREE.Scene();
    s.add(new THREE.HemisphereLight(0xffffff, 0x88907a, 2.4));
    const l = new THREE.DirectionalLight(0xffffff, 2.3);
    l.position.set(-2, 4, 5);
    s.add(l);
    const mesh = this.rune(tile, s);
    mesh.rotation.set(-0.12, -0.17, 0);
    const c = new THREE.OrthographicCamera(-0.7, 0.7, 0.7, -0.7, 0.1, 10);
    c.position.z = 3;
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(100, 100, false);
    this.renderer.render(s, c);
    const url = this.renderer.domElement.toDataURL("image/png");
    this.icons.set(key, url);
    s.clear();
    this.resize();
    return url;
  }
  style(name) {
    this.host.dataset.style = name;
    this.styleName = name;
    const light = this.scene.children[0];
    light.color.set(
      name === "moon" ? "#bedbff" : name === "sunset" ? "#ffdec1" : "#e6fff2",
    );
    this.render();
  }
  reset(count) {
    this.finishMotion();
    this.count = count;
    this.world.rotation.set(0, 0, 0);
    this.pots.forEach((p, i) => {
      p.plant.clear();
      p.group.visible = i < count;
      p.ring.visible = i === 0;
      p.plant.scale.setScalar(1);
    });
    this.render();
  }
  focus(index) {
    this.pots.forEach((p, i) => (p.ring.visible = i === index));
    this.render();
  }
  grow(index, tile) {
    this.finishMotion();
    const pot = this.pots[index];
    const p = pot.plant;
    p.clear();
    this.box(p, [0, 0.32, 0], [0.1, 0.65, 0.1], "#4a9060");
    const leaf = this.box(p, [-0.18, 0.32, 0], [0.35, 0.13, 0.18], "#82bb68");
    leaf.rotation.z = 0.4;
    const leaf2 = this.box(p, [0.15, 0.45, 0], [0.3, 0.13, 0.18], "#b4cf7b");
    leaf2.rotation.z = -0.4;
    const bloom = this.rune(tile, p);
    bloom.position.y = 0.89;
    bloom.rotation.y = 0.43;
    bloom.scale.setScalar(0.74);
    this.flight.clear();
    const rune = this.rune(tile, this.flight);
    rune.scale.setScalar(0.7);
    this.flight.visible = true;
    const pos = pot.group.position.clone();
    const finish = () => {
      p.scale.setScalar(1);
      this.flight.visible = false;
      this.particles.forEach((m) => (m.visible = false));
    };
    this.animate(
      760,
      (t) => {
        const grow = Math.max(0, (t - 0.24) / 0.76);
        p.scale.setScalar(0.001 + Math.min(1, grow * 1.4));
        this.flight.position.set(
          pos.x,
          2.4 * (1 - t) + 0.9,
          pos.z + 1.7 * (1 - t),
        );
        this.flight.rotation.y = t * 2;
        this.flight.visible = t < 0.55;
        this.particles.forEach((m, i) => {
          const a = (i * Math.PI) / 6,
            q = Math.max(0, (t - 0.32) / 0.68);
          m.visible = q > 0 && q < 1;
          m.position.set(
            pos.x + Math.cos(a) * q * 0.8,
            0.8 + Math.sin(q * Math.PI) * 0.8,
            pos.z + Math.sin(a) * q * 0.7,
          );
          m.scale.setScalar(0.08 * (1 - q));
        });
      },
      finish,
    );
  }
  reject(index) {
    this.finishMotion();
    const p = this.pots[index]?.group;
    if (!p) return;
    const x = p.position.x;
    this.animate(
      220,
      (t) => (p.position.x = x + Math.sin(t * Math.PI * 6) * 0.045 * (1 - t)),
      () => (p.position.x = x),
    );
  }
  animate(duration, step, finish) {
    if (this.motionQuery.matches || !this.visible || document.hidden) {
      finish();
      this.render();
      return;
    }
    const start = performance.now();
    this.motion = { finish };
    const tick = (now) => {
      if (this.dead || !this.motion) return;
      const t = Math.min(1, (now - start) / duration);
      step(t);
      this.render();
      if (t < 1) this.raf = requestAnimationFrame(tick);
      else {
        this.motion = null;
        this.raf = 0;
        finish();
        this.render();
      }
    };
    this.raf = requestAnimationFrame(tick);
  }
  finishMotion() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.motion?.finish();
    this.motion = null;
    this.render();
  }
  stop() {
    this.finishMotion();
  }
  setVisible(value) {
    this.visible = value;
    if (!value) this.stop();
    else this.resize();
  }
  resize() {
    if (this.dead) return;
    const w = this.host.clientWidth,
      h = this.host.clientHeight;
    if (!w || !h) return;
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
    this.renderer.setSize(w, h, false);
    const aspect = w / h,
      span = Math.max(6.2, 9 / aspect);
    this.camera.left = (-span * aspect) / 2;
    this.camera.right = (span * aspect) / 2;
    this.camera.top = span / 2;
    this.camera.bottom = -span / 2;
    this.camera.updateProjectionMatrix();
    this.render();
  }
  render() {
    if (!this.dead && this.visible && this.host.clientWidth)
      this.renderer.render(this.scene, this.camera);
  }
  stats() {
    return {
      calls: this.renderer.info.render.calls,
      triangles: this.renderer.info.render.triangles,
      geometries: this.renderer.info.memory.geometries,
      textures: this.renderer.info.memory.textures,
      animated: Boolean(this.raf),
      contexts: 1,
    };
  }
  destroy() {
    if (this.dead) return;
    this.stop();
    this.dead = true;
    this.observer.disconnect();
    this.motionQuery.removeEventListener("change", this.onReduced);
    this.renderer.domElement.removeEventListener(
      "webglcontextlost",
      this.onLost,
    );
    this.renderer.domElement.removeEventListener(
      "webglcontextrestored",
      this.onRestored,
    );
    this.geometries.forEach((g) => g.dispose());
    this.materials.forEach((m) => m.dispose());
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.renderer.domElement.remove();
    this.icons.clear();
  }
}
