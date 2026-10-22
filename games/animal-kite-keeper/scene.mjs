import * as THREE from './vendor/three/three.module.min.js';

const palettes = {
  meadow: [0x218e82, 0xffd67b, 0xf5f4d9], coral: [0xf18373, 0xffdc94, 0xa12d62],
  moon: [0x678be4, 0xe3edff, 0xbeb0e5], gold: [0xe9b849, 0xfff3bc, 0xb46d28],
  aurora: [0x56e6cc, 0xa69af2, 0xffc5e5],
};
const world = ([x, y], height = 0) => new THREE.Vector3(x - 2, height, y - 2);
const ease = value => 1 - (1 - value) ** 3;

/** One retained renderer. Route replacement reuses every geometry/material. */
export class SkyScene {
  constructor(host, { onLoss, onLabels }) {
    this.host = host; this.onLabels = onLabels; this.onLoss = onLoss;
    this.geometry = new Map(); this.material = new Map(); this.raf = 0; this.paused = true; this.motion = null;
    this.reduced = matchMedia('(prefers-reduced-motion: reduce)');
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.32;
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.domElement.setAttribute('aria-hidden', 'true');
    host.prepend(this.renderer.domElement);
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-2.85, 2.85, 2.85, -2.85, .1, 80);
    this.camera.position.set(0, 10, 4.5); this.camera.lookAt(0, .05, 0);
    this.scene.add(new THREE.HemisphereLight(0xe6f9ff, 0x406c68, 2.5));
    const sun = new THREE.DirectionalLight(0xffe6b0, 3.6); sun.position.set(-4, 9, 5); this.scene.add(sun);
    const rim = new THREE.DirectionalLight(0x9dc8ef, 1.7); rim.position.set(4, 4, -6); this.scene.add(rim);
    this.route = new THREE.Group(); this.scene.add(this.route);
    this.kite = this.buildKite(); this.scene.add(this.kite);
    this.landing = new THREE.Group();
    this.box(this.landing, [0, .17, 0], [.73, .025, .73], 'cursor', 0xf8df98);
    this.box(this.landing, [0, .19, 0], [.61, .025, .61], 'cursorInner', 0x427d74);
    this.scene.add(this.landing);
    this.lossHandler = event => { event.preventDefault(); this.cancel(); this.paused = true; this.onLoss(); };
    this.renderer.domElement.addEventListener('webglcontextlost', this.lossHandler);
    this.resize = new ResizeObserver(() => this.resizeToHost()); this.resize.observe(host);
    this.motionHandler = () => { this.cancel(true); this.render(); };
    this.reduced.addEventListener('change', this.motionHandler);
  }
  mat(key, color, options = {}) {
    if (!this.material.has(key)) this.material.set(key, new THREE.MeshStandardMaterial({ color, roughness: .72, metalness: .05, ...options }));
    return this.material.get(key);
  }
  geo(key, make) { if (!this.geometry.has(key)) this.geometry.set(key, make()); return this.geometry.get(key); }
  box(parent, point, size, key, color, options) {
    const mesh = new THREE.Mesh(this.geo('box', () => new THREE.BoxGeometry(1, 1, 1)), this.mat(key, color, options));
    mesh.position.set(...point); mesh.scale.set(...size); parent.add(mesh); return mesh;
  }
  roundedTile() {
    return this.geo('tile', () => {
      const shape = new THREE.Shape(); const s = .44, r = .06;
      shape.moveTo(-s + r, -s); shape.lineTo(s - r, -s); shape.lineTo(s, -s + r); shape.lineTo(s, s - r);
      shape.lineTo(s - r, s); shape.lineTo(-s + r, s); shape.lineTo(-s, s - r); shape.lineTo(-s, -s + r); shape.closePath();
      const geometry = new THREE.ExtrudeGeometry(shape, { depth: .09, bevelEnabled: true, bevelThickness: .035, bevelSize: .035, bevelSegments: 1, steps: 1 });
      geometry.rotateX(-Math.PI / 2); return geometry;
    });
  }
  buildKite() {
    const kite = new THREE.Group(), cloth = new THREE.Group(); cloth.rotation.x = -.28; kite.add(cloth);
    // Four separately shaded cloth panels, raised central spar and stitched edge.
    const corners = [[0, .1, -.46], [.35, 0, 0], [0, 0, .56], [-.35, 0, 0]];
    for (let i = 0; i < 4; i++) {
      const geometry = this.geo(`cloth${i}`, () => {
        const geo = new THREE.BufferGeometry(); const a = corners[i], b = corners[(i + 1) % 4];
        geo.setAttribute('position', new THREE.Float32BufferAttribute([0, .09, 0, ...a, ...b], 3)); geo.computeVertexNormals(); return geo;
      });
      cloth.add(new THREE.Mesh(geometry, this.mat(`cloth${i % 3}`, palettes.meadow[i % 3], { side: THREE.DoubleSide, roughness: .52 })));
    }
    this.box(cloth, [0, .105, .045], [.025, .025, 1.02], 'spar', 0x633b26);
    this.box(cloth, [0, .105, 0], [.71, .025, .025], 'spar', 0x633b26);
    this.box(cloth, [0, .13, 0], [.11, .035, .11], 'brass', 0xe6bb5c, { metalness: .65, roughness: .32 });
    this.tail = new THREE.Group(); kite.add(this.tail);
    for (let i = 0; i < 4; i++) {
      const node = new THREE.Group(); node.position.set(Math.sin(i * 1.1) * .05, -.04 - i * .055, .61 + i * .12);
      this.box(node, [0, 0, 0], [.015, .015, .15], 'rope', 0xe8d7a2);
      const bow = this.box(node, [0, 0, .025], [.13, .018, .055], `cloth${i % 3}`, palettes.meadow[i % 3]); bow.rotation.y = i % 2 ? .35 : -.35;
      this.tail.add(node);
    }
    kite.scale.setScalar(.9); return kite;
  }
  skin(name) { const colors = palettes[name] || palettes.meadow; colors.forEach((color, i) => this.material.get(`cloth${i}`).color.setHex(color)); this.render(); }
  buildLantern(parent, point, dock = false) {
    const group = new THREE.Group(); group.position.copy(world(point)); parent.add(group);
    const base = dock ? .68 : .29, center = dock ? .25 : .36;
    this.box(group, [0, .17, 0], [base, .09, base], 'brass', 0xe6bb5c);
    this.box(group, [0, center, 0], [dock ? .48 : .17, dock ? .13 : .25, dock ? .48 : .17], 'light', 0xffe4a3, { emissive: 0xf7ae39, emissiveIntensity: .7 });
    for (const sign of [-1, 1]) {
      this.box(group, [sign * (dock ? .29 : .13), .39, 0], [.04, dock ? .43 : .35, dock ? .6 : .26], 'brass', 0xe6bb5c);
    }
    this.box(group, [0, dock ? .63 : .57, 0], [dock ? .71 : .35, .07, dock ? .38 : .33], 'roof', 0x327f77);
    this.box(group, [0, dock ? .69 : .62, 0], [dock ? .53 : .21, .06, dock ? .24 : .21], 'roofTop', 0x5ea995);
    if (dock) {
      const pennant = this.box(group, [.27, .86, 0], [.06, .38, .06], 'brass', 0xe6bb5c);
      this.box(pennant, [1, .24, 0], [3.1, .31, 1], 'cloth0', 0x218e82);
    }
    return group;
  }
  setStage(stage, state, skin) {
    this.cancel(); this.route.clear(); this.stage = stage; this.sparks = [];
    const matrix = new THREE.Matrix4(), color = new THREE.Color();
    const tiles = new THREE.InstancedMesh(this.roundedTile(), this.mat('tiles', 0xffffff), 25);
    const foundations = new THREE.InstancedMesh(this.geo('box', () => new THREE.BoxGeometry(1, 1, 1)), this.mat('stone', 0x52716b), 25);
    const chapterColor = [0xa9cdb7, 0xb2d6cc, 0xa7cdd2, 0xbfc6db, 0xc4cbdc, 0xb5d5cf][stage.chapter];
    for (let y = 0; y < 5; y++) for (let x = 0; x < 5; x++) {
      const index = y * 5 + x;
      matrix.makeTranslation(x - 2, .04, y - 2); tiles.setMatrixAt(index, matrix);
      color.setHex(chapterColor).multiplyScalar((x + y) % 2 ? .92 : 1.08); tiles.setColorAt(index, color);
      matrix.compose(new THREE.Vector3(x - 2, -.16, y - 2), new THREE.Quaternion(), new THREE.Vector3(.94, .32 + ((x * 3 + y) % 3) * .05, .94)); foundations.setMatrixAt(index, matrix);
      if (stage.grid[y][x] === '#') {
        const base = new THREE.Group(); base.position.copy(world([x, y])); this.route.add(base);
        this.box(base, [0, .23, 0], [.84, .25, .81], 'cloudLow', 0xc1d4d5);
        this.box(base, [-.14, .45, .04], [.54, .25, .68], 'cloudMid', 0xe2e9e3);
        this.box(base, [.20, .37, -.10], [.39, .21, .52], 'cloudHigh', 0xf5f6eb);
        this.box(base, [-.16, .6, -.10], [.29, .11, .34], 'cloudHigh', 0xf5f6eb);
      }
    }
    this.route.add(tiles, foundations);
    // Inlaid perimeter and the stepped lower island keep the board spatially legible.
    for (const sign of [-1, 1]) {
      this.box(this.route, [sign * 2.47, -.03, 0], [.035, .07, 4.96], 'trim', 0xd2b875);
      this.box(this.route, [0, -.03, sign * 2.47], [4.96, .07, .035], 'trim', 0xd2b875);
    }
    this.box(this.route, [0, -.4, 0], [4.3, .25, 4.3], 'lowerStone', 0x456862);
    this.box(this.route, [.2, -.61, -.05], [3.3, .24, 3.1], 'lowerStone', 0x456862);
    this.dock = this.buildLantern(this.route, stage.dock, true);
    this.sparks = stage.sparks.map(point => this.buildLantern(this.route, point));
    for (const current of stage.currents) {
      const group = new THREE.Group(); group.position.copy(world(current.point, .17));
      group.rotation.y = { north: 0, east: -Math.PI / 2, south: Math.PI, west: Math.PI / 2 }[current.direction];
      const arrow = new THREE.Mesh(this.geo('arrow', () => {
        const shape = new THREE.Shape(); shape.moveTo(0, -.31); shape.lineTo(.27, -.04); shape.lineTo(.10, -.04); shape.lineTo(.10, .29); shape.lineTo(-.10, .29); shape.lineTo(-.10, -.04); shape.lineTo(-.27, -.04); shape.closePath();
        const geo = new THREE.ExtrudeGeometry(shape, { depth: .025, bevelEnabled: true, bevelThickness: .015, bevelSize: .01, bevelSegments: 1 }); geo.rotateX(Math.PI / 2); return geo;
      }), this.mat('current', 0x53c9d4, { emissive: 0x057882, emissiveIntensity: .27, roughness: .38 }));
      group.add(arrow); this.route.add(group);
    }
    this.trail = new THREE.InstancedMesh(this.geo('box', () => new THREE.BoxGeometry(1, 1, 1)), this.mat('trail', 0xe8e9ae, { transparent: true, opacity: .68 }), 64);
    this.trail.count = 0; this.route.add(this.trail);
    this.state = state; this.skin(skin); this.sync(state); this.resizeToHost();
  }
  sync(state, points = []) {
    this.state = state; this.kite.position.copy(world(state.point, .66)); this.kite.rotation.set(0, 0, 0);
    this.landing.position.copy(world(state.point));
    this.sparks.forEach((spark, i) => { spark.visible = !(state.mask & (1 << i)); });
    if (this.trail) {
      const matrix = new THREE.Matrix4();
      this.trail.count = Math.min(points.length, 64);
      points.slice(-64).forEach((point, i) => { matrix.compose(world(point, .15), new THREE.Quaternion(), new THREE.Vector3(.13, .018, .13)); this.trail.setMatrixAt(i, matrix); });
      this.trail.instanceMatrix.needsUpdate = true;
    }
    this.render();
  }
  move(trace, state, points, done) {
    this.cancel();
    if (this.reduced.matches) { this.sync(state, points); done(); return; }
    const from = this.kite.position.clone(); const destinations = trace.map(point => world(point, .66));
    this.motion = { from, destinations, state, points, done, elapsed: 0, last: 0, duration: Math.min(620, 230 * trace.length) };
    this.schedule();
  }
  schedule() { if (!this.paused && !this.raf && this.motion) this.raf = requestAnimationFrame(time => this.tick(time)); }
  tick(time) {
    this.raf = 0; const motion = this.motion; if (!motion || this.paused) return;
    if (motion.last) motion.elapsed += Math.min(time - motion.last, 40); motion.last = time;
    const progress = Math.min(1, motion.elapsed / motion.duration), leg = progress * motion.destinations.length;
    const index = Math.min(motion.destinations.length - 1, Math.floor(leg));
    const start = index ? motion.destinations[index - 1] : motion.from, target = motion.destinations[index];
    this.kite.position.lerpVectors(start, target, ease(Math.min(1, leg - index)));
    this.kite.position.y += Math.sin(progress * Math.PI) * .12;
    this.kite.rotation.z = -(target.x - start.x) * Math.sin(progress * Math.PI) * .18;
    this.kite.rotation.x = (target.z - start.z) * Math.sin(progress * Math.PI) * .15;
    this.tail.rotation.y = Math.sin(progress * Math.PI * 2) * .18;
    this.render();
    if (progress >= 1) { this.motion = null; this.tail.rotation.y = 0; this.sync(motion.state, motion.points); motion.done(); }
    else this.schedule();
  }
  cancel(finish = false) {
    cancelAnimationFrame(this.raf); this.raf = 0;
    const motion = this.motion; this.motion = null;
    if (motion && finish) { this.sync(motion.state, motion.points); motion.done(); }
  }
  setPaused(paused) {
    this.paused = paused;
    if (paused) { cancelAnimationFrame(this.raf); this.raf = 0; if (this.motion) this.motion.last = 0; }
    else { this.resizeToHost(); this.schedule(); }
  }
  project(point, height = .72) {
    const vector = world(point, height).project(this.camera);
    return { x: (vector.x + 1) / 2 * this.host.clientWidth, y: (1 - vector.y) / 2 * this.host.clientHeight };
  }
  resizeToHost() {
    const width = this.host.clientWidth, height = this.host.clientHeight;
    if (!width || !height) return;
    this.renderer.setSize(width, height, false);
    const aspect = width / height, half = 2.70;
    this.camera.left = -half * Math.max(1, aspect); this.camera.right = -this.camera.left;
    this.camera.top = half * Math.max(1, 1 / aspect); this.camera.bottom = -this.camera.top;
    this.camera.updateProjectionMatrix(); this.render();
  }
  render() {
    if (!this.stage || this.renderer.getContext().isContextLost()) return;
    this.renderer.render(this.scene, this.camera);
    this.onLabels?.(this.stage.sparks.map(point => this.project(point, .73)), this.state);
    // Read-only diagnostic counters; never an input or progress backdoor.
    this.host.dataset.renderStats = JSON.stringify({ calls: this.renderer.info.render.calls, geometries: this.renderer.info.memory.geometries, textures: this.renderer.info.memory.textures, dpr: this.renderer.getPixelRatio(), triangles: this.renderer.info.render.triangles });
  }
  dispose() {
    this.cancel(); this.resize.disconnect(); this.reduced.removeEventListener('change', this.motionHandler);
    this.renderer.domElement.removeEventListener('webglcontextlost', this.lossHandler);
    this.geometry.forEach(geometry => geometry.dispose()); this.material.forEach(material => material.dispose());
    this.renderer.dispose(); this.renderer.forceContextLoss(); this.renderer.domElement.remove();
  }
}
