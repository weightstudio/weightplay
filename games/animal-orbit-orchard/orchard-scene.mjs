import * as THREE from '../animal-skyspire-drop/vendor/three/three.module.min.js';
import { targetPosition, gateAngle, shotPosition } from './orchard-model.mjs';

// One reusable scene. Authored meshes share geometry/materials across all stages.
export class OrchardScene {
  constructor(canvas, labels, onContextLost) {
    this.canvas = canvas; this.labels = labels; this.effects = []; this.fruits = [];
    this.geometries = new Set(); this.materials = new Map(); this.disposed = false;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'low-power' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    this.renderer.setClearColor(0x071826);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x071826, 25, 52);
    this.camera = new THREE.OrthographicCamera(-7, 7, 7, -7, .1, 70);
    this.camera.position.set(0, 11, 9.5); this.camera.lookAt(0, 0, 0);
    this.scene.add(new THREE.HemisphereLight(0xb7d9ff, 0x18323c, 1.7));
    const key = new THREE.DirectionalLight(0xffe0a0, 3); key.position.set(-5, 10, 6); this.scene.add(key);
    const rim = new THREE.DirectionalLight(0x83cfff, 2.1); rim.position.set(5, 5, -8); this.scene.add(rim);
    this.boxGeometry = this.geo(new THREE.BoxGeometry(1, 1, 1));
    this.sphereGeometry = this.geo(new THREE.IcosahedronGeometry(1, 1));
    this.ray = new THREE.Raycaster(); this.plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -.75);
    this.world = new THREE.Group(); this.scene.add(this.world);
    this.stageGroup = new THREE.Group(); this.scene.add(this.stageGroup);
    this.decorate(); this.buildLauncher(); this.buildSquirrel();
    this.path = [];
    for (let i = 0; i < 21; i++) {
      const dot = this.mesh(this.sphereGeometry, this.mat('path', 0xffd67c, { emissive: 0x8a5815, emissiveIntensity: .8 }));
      dot.scale.setScalar(i < 15 ? .045 : .03); this.scene.add(dot); this.path.push(dot);
    }
    this.seed = this.mesh(this.sphereGeometry, this.mat('seed', 0xffe7a0, { emissive: 0xffb32a, emissiveIntensity: 1.2 }));
    this.seed.scale.set(.13, .13, .13); this.scene.add(this.seed);
    this.trail = Array.from({ length: 8 }, (_, i) => {
      const p = this.mesh(this.sphereGeometry, this.mat('trail', 0xffd982, { emissive: 0xe3a848, emissiveIntensity: .8, transparent: true, opacity: .4 }));
      p.scale.setScalar(.095 * (1 - i / 9)); p.visible = false; this.scene.add(p); return p;
    });
    this.effectPool = Array.from({ length: 40 }, () => {
      const p = this.mesh(this.boxGeometry, this.mat('spark', 0xffd16c, { emissive: 0xc68023, emissiveIntensity: .7 }));
      p.visible = false; this.scene.add(p); return p;
    });
    this.onLoss = e => { e.preventDefault(); onContextLost(); };
    canvas.addEventListener('webglcontextlost', this.onLoss);
    this.resizeObserver = new ResizeObserver(() => this.resize()); this.resizeObserver.observe(canvas);
    // Read-only renderer diagnostics; never exposes or changes gameplay state.
    Object.defineProperty(canvas, 'orchardRendererInfo', { configurable: true, get: () => Object.freeze(this.metrics()) });
    this.resize();
  }
  geo(g) { this.geometries.add(g); return g; }
  mat(key, color, extra = {}) {
    if (!this.materials.has(key)) this.materials.set(key, new THREE.MeshStandardMaterial({ color, roughness: .68, metalness: .05, ...extra }));
    return this.materials.get(key);
  }
  mesh(g, m) { return new THREE.Mesh(g, m); }
  box(parent, x, y, z, w, h, d, color, name = String(color), extra = {}) {
    const mesh = this.mesh(this.boxGeometry, this.mat(name, color, extra));
    mesh.position.set(x, y, z); mesh.scale.set(w, h, d); parent.add(mesh); return mesh;
  }
  cylinder(parent, radius, depth, y, color, key = String(color), segments = 48) {
    const mesh = this.mesh(this.geo(new THREE.CylinderGeometry(radius, radius, depth, segments)), this.mat(key, color));
    mesh.position.y = y; parent.add(mesh); return mesh;
  }
  ring(parent, radius, width, y, material, start = 0, length = Math.PI * 2) {
    const mesh = this.mesh(this.geo(new THREE.TorusGeometry(radius, width, 6, Math.max(12, Math.round(length * 18)), length)), material);
    mesh.rotation.x = Math.PI / 2; mesh.rotation.z = start; mesh.position.y = y; parent.add(mesh); return mesh;
  }
  decorate() {
    const gold = this.mat('brass', 0xc69b51, { metalness: .68, roughness: .31 });
    this.cylinder(this.world, 5.65, .65, -.65, 0x183949, 'foundation', 64);
    this.cylinder(this.world, 5.72, .12, -.28, 0x6e7257, 'stone-trim', 64);
    this.cylinder(this.world, 5.5, .2, -.12, 0x294e4c, 'garden', 64);
    this.cylinder(this.world, 5.0, .055, .015, 0x122531, 'slate', 64);
    for (const r of [2.9, 4.1, 4.5]) this.ring(this.world, r, .018, .12, gold);
    this.ring(this.world, 5.48, .055, .09, gold);
    for (let i = 0; i < 60; i++) {
      const a = i * Math.PI / 30, r = i % 5 === 0 ? 4.92 : 4.96;
      const tick = this.box(this.world, Math.cos(a) * r, .06, Math.sin(a) * r,
        i % 5 === 0 ? .24 : .1, .018, .025, 0xc69b51, 'brass'); tick.rotation.y = -a;
    }
    for (let i = 0; i < 12; i++) {
      const a = i * Math.PI / 6;
      const tile = this.box(this.world, Math.cos(a) * 1.6, .05, Math.sin(a) * 1.6, .36, .025, .1, 0x34515b, 'engraving');
      tile.rotation.y = -a;
    }
    for (let i = 0; i < 40; i++) {
      const a = i * Math.PI * 2 / 40;
      const tile = this.box(this.world, Math.cos(a) * 5.53, -.59, Math.sin(a) * 5.53, .64, .56, .25,
        i % 3 ? 0x254352 : 0x3a5260, `stone${i % 3 ? 0 : 1}`);
      tile.rotation.y = -a + Math.PI / 2;
      if (i % 5 === 0) {
        const x = Math.cos(a) * 5.12, z = Math.sin(a) * 5.12;
        this.box(this.world, x, .28, z, .12, .55, .12, 0x6c543d, 'wood');
        this.box(this.world, x, .63, z, .27, .4, .27, 0xffd48a, 'lamp', { emissive: 0xffb94b, emissiveIntensity: 1.4 });
        this.box(this.world, x, .9, z, .37, .13, .37, 0xb99652, 'lamp-cap');
        this.box(this.world, x, .37, z, .37, .09, .37, 0xb99652, 'lamp-cap');
      }
    }
    // Stepped orchard trees on the outer rim. All 3D silhouettes are bespoke.
    for (let i = 0; i < 10; i++) {
      const a = (i / 10 * Math.PI * 2) + .12, x = Math.cos(a) * 5.12, z = Math.sin(a) * 5.12;
      const tree = new THREE.Group(); tree.position.set(x, 0, z); tree.rotation.y = a; tree.scale.y = 1.25; this.world.add(tree);
      this.box(tree, 0, .1, 0, .6, .2, .65, 0x40565b, 'planter');
      this.box(tree, 0, .5, 0, .18, .85, .18, 0x674c34, 'wood');
      for (let j = 0; j < 3; j++) this.box(tree, (j - 1) * .21, 1.02 + (j === 1 ? .16 : 0), 0,
        .5, .44, .52, [0x37765d, 0x539571, 0x28654e][j], `leaves${j}`);
      this.box(tree, .25, 1.04, .29, .13, .14, .13, 0xffbd6c, 'apple');
      this.box(tree, -.22, 1.12, .29, .1, .12, .1, 0xffbd6c, 'apple');
    }
    // Background points and distant floating stone volumes stay outside gameplay.
    const positions = [];
    for (let i = 0; i < 100; i++) {
      const a = i * 2.399963, r = 9 + (i % 17) * .7;
      positions.push(Math.cos(a) * r, 2 + (i % 9), Math.sin(a) * r - 9);
    }
    const stars = this.geo(new THREE.BufferGeometry()); stars.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    this.starsMaterial = new THREE.PointsMaterial({ color: 0xa9dcdf, size: .035, transparent: true, opacity: .65 });
    this.scene.add(new THREE.Points(stars, this.starsMaterial));
  }
  buildLauncher() {
    const gold = this.mat('brass', 0xc69b51, { metalness: .68, roughness: .31 });
    this.cylinder(this.world, .85, .16, .16, 0x647c78, 'pedestal');
    this.cylinder(this.world, .62, .18, .32, 0xb99652, 'launcher-base');
    this.cylinder(this.world, .38, .35, .57, 0x29566b, 'navy');
    this.launcher = new THREE.Group(); this.launcher.position.y = .75; this.scene.add(this.launcher);
    this.box(this.launcher, .32, 0, 0, 1.05, .28, .31, 0xc69b51, 'brass');
    this.box(this.launcher, .81, 0, 0, .13, .38, .42, 0xc69b51, 'brass');
    this.box(this.launcher, .884, 0, 0, .02, .21, .24, 0x112b39, 'bore');
    this.box(this.launcher, .25, .2, 0, .45, .06, .09, 0x7bd8c2, 'sight', { emissive: 0x22b594, emissiveIntensity: .6 });
    this.ring(this.world, .7, .026, .27, gold);
  }
  buildSquirrel() {
    this.squirrel = new THREE.Group(); this.squirrel.position.set(-1.25, .15, .55); this.squirrel.scale.setScalar(.9); this.world.add(this.squirrel);
    const g = this.squirrel;
    this.box(g, 0, .62, 0, .6, .85, .48, 0x9b5a33, 'fur');
    this.box(g, 0, .68, .12, .65, .64, .39, 0x203e63, 'vest');
    this.box(g, 0, .7, .34, .17, .45, .08, 0xdab283, 'muzzle');
    this.box(g, -.21, .1, .15, .29, .2, .45, 0x9b5a33, 'fur');
    this.box(g, .21, .1, .15, .29, .2, .45, 0x9b5a33, 'fur');
    this.box(g, 0, 1.27, .06, .78, .65, .64, 0xb97441, 'face');
    this.box(g, -.27, 1.71, .015, .2, .36, .2, 0xb97441, 'face');
    this.box(g, .27, 1.71, .015, .2, .36, .2, 0xb97441, 'face');
    this.box(g, -.27, 1.7, .13, .1, .19, .025, 0xdab283, 'muzzle');
    this.box(g, .27, 1.7, .13, .1, .19, .025, 0xdab283, 'muzzle');
    this.box(g, 0, 1.1, .41, .44, .25, .23, 0xdab283, 'muzzle');
    this.box(g, 0, 1.24, .55, .14, .1, .06, 0x1d2330, 'eyes');
    for (const x of [-.21, .21]) {
      this.box(g, x, 1.36, .397, .12, .17, .06, 0x1d2330, 'eyes');
      this.box(g, x - .025, 1.405, .435, .035, .04, .02, 0xf9eddb, 'eye-glint');
      this.box(g, x * 1.8, .62, .16, .24, .41, .29, 0xb97441, 'face');
    }
    this.box(g, -.18, .83, .35, .12, .12, .045, 0xc69b51, 'brass');
    this.box(g, 0, .39, .36, .055, .055, .03, 0xc69b51, 'brass');
    this.box(g, 0, .54, .36, .055, .055, .03, 0xc69b51, 'brass');
    this.tail = new THREE.Group(); g.add(this.tail);
    [[0,.35,-.46,.4,.35,.4],[0,.65,-.7,.62,.5,.4],[0,1.15,-.83,.8,.55,.43],[0,1.57,-.7,.7,.4,.44],[0,1.72,-.4,.47,.23,.4]].forEach(v => this.box(this.tail, ...v, 0x9b5a33, 'fur'));
    this.box(this.tail, 0, 1.22, -1.06, .52, .68, .04, 0xc68b53, 'tail-highlight');
  }
  fruitMesh(index) {
    const g = new THREE.Group();
    const colors = [0xf7ab4e, 0x97d389, 0xce9fe8, 0xf4d36b];
    const key = `fruit${index % 4}`;
    this.box(g, 0, 0, 0, .47, .39, .47, colors[index % 4], key);
    this.box(g, 0, .04, 0, .37, .5, .37, colors[index % 4], key);
    this.box(g, 0, .32, 0, .055, .16, .055, 0x6c543d, 'wood');
    const leaf = this.box(g, .12, .34, 0, .24, .065, .15, 0x69a86d, 'leaf'); leaf.rotation.z = .35;
    this.box(g, -.15, .12, .243, .09, .12, .015, 0xfff4cf, 'fruit-glint');
    return g;
  }
  setStage(stage) {
    // Stage-owned TorusGeometry only; shared fruit geometry/materials stay cached.
    this.stageGroup.traverse(o => { if (o.userData.stageGeometry) { o.geometry.dispose(); this.geometries.delete(o.geometry); } });
    this.stageGroup.clear(); this.labels.replaceChildren(); this.effects.length = 0;
    this.effectPool.forEach(p => { p.visible = false; });
    this.fruits = stage.targets.map((target, i) => {
      const mesh = this.fruitMesh(i); this.stageGroup.add(mesh);
      const halo = this.ring(this.stageGroup, .45, .024, .3, this.mat('halo', 0xffe2a2, { emissive: 0xb88a3b, emissiveIntensity: .8 }));
      halo.userData.stageGeometry = true;
      const label = document.createElement('span'); label.className = 'fruit-label'; label.textContent = String(i + 1); label.hidden = !stage.ordered;
      this.labels.append(label);
      return { mesh, halo, label, takenAt: null };
    });
    this.gates = stage.gates.map(item => {
      const g = new THREE.Group(); this.stageGroup.add(g);
      const barrier = this.ring(g, item.radius, .105, .75,
        this.mat('gate', 0xd58472, { metalness: .25, roughness: .5 }), 0, item.width * Math.PI / 180);
      barrier.userData.stageGeometry = true;
      const band = this.ring(g, item.radius, .018, .9, this.mat('gate-edge', 0xffd0a0, { emissive: 0xaf6854, emissiveIntensity: .6 }), 0, item.width * Math.PI / 180);
      band.userData.stageGeometry = true;
      return g;
    });
  }
  resize() {
    if (this.disposed) return;
    const r = this.canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const aspect = r.width / r.height, span = Math.max(12.5, 11.8 / aspect);
    this.camera.left = -span * aspect / 2; this.camera.right = span * aspect / 2;
    this.camera.top = span / 2; this.camera.bottom = -span / 2; this.camera.updateProjectionMatrix();
    this.renderer.setSize(Math.round(r.width), Math.round(r.height), false);
  }
  point(clientX, clientY) {
    const r = this.canvas.getBoundingClientRect();
    this.ray.setFromCamera(new THREE.Vector2((clientX - r.left) / r.width * 2 - 1, -(clientY - r.top) / r.height * 2 + 1), this.camera);
    return this.ray.ray.intersectPlane(this.plane, new THREE.Vector3());
  }
  aim(clientX, clientY) {
    const p = this.point(clientX, clientY);
    return p && Math.hypot(p.x, p.z) > .3 ? Math.atan2(p.z, p.x) * 180 / Math.PI : null;
  }
  event(event, now, reduced, destination) {
    if (event.type === 'launch') { this.firedAt = now; return; }
    if (!['harvest', 'block', 'order'].includes(event.type)) return;
    const count = reduced ? 2 : event.type === 'harvest' ? 8 : 5;
    for (let i = 0; i < count; i++) {
      const mesh = this.effectPool.find(p => !p.visible); if (!mesh) break;
      mesh.visible = true; mesh.scale.setScalar(reduced ? .045 : .06 + i % 3 * .025);
      mesh.position.set(event.x, .8, event.z);
      this.effects.push({ mesh, start: now, x: event.x, z: event.z, angle: i * 2.39996, duration: .48 });
    }
    if (event.type === 'harvest') {
      const fruit = this.fruits[event.index]; fruit.takenAt = now;
      fruit.from = { x: event.x, z: event.z }; fruit.to = destination ? this.point(destination.x, destination.y) : null;
    }
  }
  render(run, visualTime, reduced = false, aurora = false) {
    if (this.disposed) return;
    this.launcher.rotation.y = -run.aim * Math.PI / 180;
    const recoil = !reduced && this.firedAt !== undefined ? Math.max(0, 1 - (visualTime - this.firedAt) / .16) * .1 : 0;
    this.launcher.position.set(-Math.cos(run.aim * Math.PI / 180) * recoil, .75, -Math.sin(run.aim * Math.PI / 180) * recoil);
    this.squirrel.rotation.y = -.22;
    this.tail.rotation.x = reduced ? 0 : Math.sin(visualTime * 1.4) * .035;
    const rect = { width: this.canvas.clientWidth, height: this.canvas.clientHeight };
    this.fruits.forEach((fruit, i) => {
      const taken = run.harvested.includes(i), p = targetPosition(run, i);
      fruit.halo.position.x = p.x; fruit.halo.position.z = p.z;
      fruit.halo.visible = !taken && (!run.stage.ordered || i === run.harvested.length);
      fruit.label.hidden = !run.stage.ordered || taken;
      fruit.label.classList.toggle('is-next', i === run.harvested.length);
      if (taken) {
        const f = fruit.takenAt === null ? 1 : Math.min(1, (visualTime - fruit.takenAt) / .45);
        fruit.mesh.visible = f < 1;
        const eased = 1 - (1 - f) ** 3;
        fruit.mesh.position.set(fruit.from?.x || p.x, .9, fruit.from?.z || p.z);
        if (!reduced && fruit.to) {
          fruit.mesh.position.x += (fruit.to.x - fruit.mesh.position.x) * eased;
          fruit.mesh.position.z += (fruit.to.z - fruit.mesh.position.z) * eased;
        }
        fruit.mesh.scale.setScalar(Math.max(.01, 1 - eased));
      } else {
        fruit.mesh.visible = true; fruit.mesh.scale.setScalar(1);
        fruit.mesh.position.set(p.x, .88 + (reduced ? 0 : Math.sin(visualTime * 2 + i) * .035), p.z);
        fruit.mesh.rotation.y = .2 + (reduced ? 0 : Math.sin(visualTime * .5 + i) * .12);
        const labelPosition = new THREE.Vector3(p.x, 1.45, p.z).project(this.camera);
        fruit.label.style.transform = `translate(${(labelPosition.x + 1) / 2 * rect.width}px,${(1 - labelPosition.y) / 2 * rect.height}px) translate(-50%,-50%)`;
      }
    });
    this.gates.forEach((mesh, i) => { mesh.rotation.y = -(gateAngle(run, run.stage.gates[i]) - run.stage.gates[i].width / 2) * Math.PI / 180; });
    for (let i = 0; i < this.path.length; i++) {
      const p = shotPosition(run.stage, run.aim, .9 + i * .185);
      this.path[i].position.set(p.x, .77, p.z); this.path[i].visible = !run.complete && !run.projectile;
    }
    this.seed.visible = Boolean(run.projectile);
    if (run.projectile) this.seed.position.set(run.projectile.x, .8, run.projectile.z);
    const seedMat = this.materials.get('seed');
    seedMat.color.setHex(aurora ? 0xb0a2ff : 0xffe7a0); seedMat.emissive.setHex(aurora ? 0x8470ff : 0xffb32a);
    const trailMat = this.materials.get('trail'); trailMat.color.copy(seedMat.color); trailMat.emissive.copy(seedMat.emissive);
    this.trail.forEach((mesh, i) => {
      mesh.visible = !reduced && Boolean(run.projectile) && run.projectile.r > .8 + i * .09;
      if (mesh.visible) { const p = shotPosition(run.stage, run.projectile.aim, run.projectile.r - (i + 1) * .09); mesh.position.set(p.x, .8, p.z); }
    });
    for (const effect of this.effects) {
      const t = (visualTime - effect.start) / effect.duration;
      if (t >= 1) { effect.mesh.visible = false; continue; }
      const r = reduced ? 0 : t * .75;
      effect.mesh.position.set(effect.x + Math.cos(effect.angle) * r, .9 + Math.sin(t * Math.PI) * .6, effect.z + Math.sin(effect.angle) * r);
      effect.mesh.rotation.set(t * 4, t * 3, t); effect.mesh.scale.setScalar((1 - t) * .1);
    }
    this.effects = this.effects.filter(e => e.mesh.visible);
    this.renderer.render(this.scene, this.camera);
  }
  metrics() {
    return { revision: THREE.REVISION, calls: this.renderer.info.render.calls,
      triangles: this.renderer.info.render.triangles, ...this.renderer.info.memory,
      effects: this.effects.length, dpr: this.renderer.getPixelRatio() };
  }
  previewSeed() {
    // Render the purchasable seed with the same renderer and actual materials.
    const preview = new THREE.Scene(); preview.background = new THREE.Color(0x132e3c);
    preview.add(new THREE.HemisphereLight(0xe6deff, 0x304a65, 3));
    const light = new THREE.DirectionalLight(0xffffff, 4); light.position.set(-2, 3, 4); preview.add(light);
    const seed = this.mesh(this.sphereGeometry, this.mat('aurora-preview', 0xb0a2ff, { emissive: 0x6050a9, emissiveIntensity: .6, metalness: .3 }));
    seed.scale.set(.55, .8, .55); seed.rotation.z = -.3; preview.add(seed);
    const leaf = this.box(seed, .4, .9, 0, .7, .1, .25, 0x8be5c4, 'preview-leaf'); leaf.rotation.z = .5;
    const camera = new THREE.OrthographicCamera(-1.3, 1.3, 1.3, -1.3, .1, 20); camera.position.set(2, 1.5, 4); camera.lookAt(0, .15, 0);
    this.renderer.setSize(192, 192, false); this.renderer.render(preview, camera);
    const data = this.canvas.toDataURL('image/png'); this.resize(); return data;
  }
  dispose() {
    if (this.disposed) return; this.disposed = true;
    this.resizeObserver.disconnect(); this.canvas.removeEventListener('webglcontextlost', this.onLoss);
    delete this.canvas.orchardRendererInfo;
    this.geometries.forEach(g => g.dispose()); this.materials.forEach(m => m.dispose()); this.starsMaterial.dispose();
    this.renderer.dispose(); this.renderer.forceContextLoss(); this.effects.length = 0; this.labels.replaceChildren();
  }
}
