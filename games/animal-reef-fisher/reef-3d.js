// WeightPlay original procedural block artwork; Three.js r180 (MIT), local pinned runtime.
import * as THREE from '../animal-skyspire-drop/vendor/three/three.module.min.js';
import { SPOTS, clamp } from './reef-simulation.js';

export class ReefScene {
  constructor(canvas, onFailure) {
    this.canvas = canvas; this.onFailure = onFailure; this.disposed = false;
    this.geometries = new Set(); this.materials = new Map(); this.particles = [];
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'low-power' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.scene = new THREE.Scene(); this.scene.background = new THREE.Color('#8cdae4');
    this.scene.fog = new THREE.Fog('#8cdae4', 19, 38);
    this.camera = new THREE.PerspectiveCamera(38, 1, .1, 70);
    this.camera.position.set(0, 13, 16); this.camera.lookAt(0, 0, .4);
    this.scene.add(new THREE.HemisphereLight('#d9ffff', '#2e6877', 2.5));
    const sun = new THREE.DirectionalLight('#fff0ce', 3.2); sun.position.set(-6, 12, 7); this.scene.add(sun);
    this.box = this.own(new THREE.BoxGeometry(1, 1, 1));
    this.oct = this.own(new THREE.OctahedronGeometry(1));
    this.buildWorld(); this.buildBoat(); this.buildFish(); this.buildLine(); this.buildParticles();
    this.contextLost = (event) => { event.preventDefault(); if (!this.disposed) this.onFailure?.('context'); };
    canvas.addEventListener('webglcontextlost', this.contextLost);
    this.resize(); canvas.dataset.renderer = 'three-webgl2';
  }
  own(geometry) { this.geometries.add(geometry); return geometry; }
  mat(color, glow = false) {
    const key = `${color}:${glow}`;
    if (!this.materials.has(key)) this.materials.set(key, new THREE.MeshStandardMaterial({ color, roughness: .65,
      ...(glow ? { emissive: color, emissiveIntensity: .45 } : {}) }));
    return this.materials.get(key);
  }
  block(parent, color, x, y, z, w, h, d, rotation = 0) {
    const mesh = new THREE.Mesh(this.box, this.mat(color)); mesh.position.set(x, y, z); mesh.scale.set(w, h, d);
    mesh.rotation.z = rotation; parent.add(mesh); return mesh;
  }
  buildWorld() {
    this.world = new THREE.Group(); this.scene.add(this.world);
    this.block(this.world, '#168d9c', 0, -.5, 0, 20, .5, 19);
    this.block(this.world, '#53c9c9', 0, -.2, 0, 17, .16, 16);
    this.block(this.world, '#d6d69b', -7, .1, 3, 3, .7, 8);
    this.block(this.world, '#f3dfad', -6.6, .28, 3, 2, .35, 7);
    // Authored reef shelves, branch coral, kelp, and a distant stepped lighthouse.
    for (let i = 0; i < 12; i++) {
      const a = i * 2.399; const radius = 5.7 + (i % 3) * .45;
      const x = Math.cos(a) * radius, z = Math.sin(a) * radius;
      this.block(this.world, i % 2 ? '#387c84' : '#5fa99c', x, -.08, z, 1.1, .5, .9);
      if (i % 3 === 0) {
        this.block(this.world, '#f18e89', x, .28, z, .2, .9, .2);
        this.block(this.world, '#ffb29b', x + .28, .38, z, .65, .15, .18);
        this.block(this.world, '#f18e89', x + .52, .6, z, .16, .45, .16);
      } else this.block(this.world, '#34977c', x, .3, z, .2, 1.15, .13, -.2);
    }
    this.block(this.world, '#e2d4a4', 5, 1.1, -7, 1.1, 2.5, 1.1);
    this.block(this.world, '#e48255', 5, 2.65, -7, 1.5, .5, 1.5);
    this.block(this.world, '#fff4ae', 5, 2.22, -6.43, .6, .45, .1);
    this.markers = SPOTS.map((spot, index) => {
      const root = new THREE.Group(); root.position.set(spot.x, .04, spot.z); this.scene.add(root);
      const geometry = this.own(new THREE.RingGeometry(.62, .69, 32));
      const material = new THREE.MeshBasicMaterial({ color: '#fff1a2', side: THREE.DoubleSide, transparent: true, opacity: .8 });
      this.materials.set(`spot-${index}`, material);
      const ring = new THREE.Mesh(geometry, material); ring.rotation.x = -Math.PI / 2; root.add(ring);
      this.block(root, ['#ffdd81','#77e6c7','#a4b7ff'][index], 0, -.1, 0, .32 + index * .12, .12, .18);
      return root;
    });
  }
  buildBoat() {
    this.boat = new THREE.Group(); this.boat.position.set(-3.6, .15, 3.1); this.scene.add(this.boat);
    this.block(this.boat, '#884c33', 0, .16, 0, 2.5, .45, 1.5);
    this.block(this.boat, '#d9ab69', 0, .44, 0, 2.15, .16, 1.25);
    for (const side of [-1, 1]) this.block(this.boat, '#b97248', 0, .61, side * .69, 2.5, .32, .13);
    this.block(this.boat, '#f4d39b', 1.18, .42, 0, .2, .44, 1.22);
    this.hero = new THREE.Group(); this.hero.position.set(-.2, .64, 0); this.hero.rotation.y = -.15; this.boat.add(this.hero);
    // Nori: stepped otter anatomy, cream box muzzle, goggles, fin sleeves, coral charm.
    this.block(this.hero, '#76523d', 0, .7, 0, .65, .9, .5);
    this.block(this.hero, '#ef9e48', 0, .72, .12, .73, .62, .4);
    this.block(this.hero, '#ffd580', 0, .75, .35, .12, .6, .06);
    this.block(this.hero, '#95694e', 0, 1.42, .03, .88, .7, .63);
    for (const side of [-1, 1]) {
      this.block(this.hero, '#76523d', side * .39, 1.8, .02, .22, .24, .21);
      this.block(this.hero, '#dba47d', side * .39, 1.82, .14, .12, .13, .04);
      this.block(this.hero, '#9ce6e4', side * .22, 1.47, .39, .38, .3, .12);
      this.block(this.hero, '#eefbf3', side * .22, 1.48, .46, .24, .19, .025);
      this.block(this.hero, '#183b48', side * .22, 1.48, .48, .11, .16, .03);
      this.block(this.hero, '#ffffff', side * .24, 1.53, .501, .035, .045, .018);
      this.block(this.hero, '#dfc199', side * .13, 1.25, .4, .29, .19, .22);
      this.block(this.hero, '#76523d', side * .25, .15, .2, .25, .3, .5);
      const arm = new THREE.Group(); arm.position.set(side * .44, .93, .03); this.hero.add(arm);
      this.block(arm, '#3cc6ce', 0, -.06, .03, .25, .33, .3, side * .18);
      this.block(arm, '#95694e', 0, -.25, .17, .2, .27, .24);
      if (side === 1) this.arm = arm;
      for (const j of [-1, 1]) this.block(this.hero, '#e2caac', side * .37, 1.24 + j * .045, .47, .25, .02, .02, side * j * .15);
    }
    this.block(this.hero, '#294751', 0, 1.29, .54, .15, .09, .1);
    this.block(this.hero, '#e2c483', 0, 1.87, .01, 1.02, .12, .85);
    this.block(this.hero, '#d7ac64', 0, 2.02, -.03, .66, .23, .57);
    this.block(this.hero, '#369aa2', 0, 1.98, .27, .65, .08, .04);
    this.block(this.hero, '#f08979', -.23, .64, .37, .16, .19, .09);
    this.block(this.hero, '#76523d', 0, .2, -.47, .34, .25, .65, -.12);
    this.bubbles = new THREE.Group(); this.hero.add(this.bubbles);
    for (let i = 0; i < 3; i++) this.block(this.bubbles, '#9ae9ef', -.6 - i * .16, .4 + i * .3, .18, .1, .1, .1);
    this.rod = new THREE.Group(); this.rod.position.set(.46, .7, .25); this.rod.rotation.z = -.55; this.hero.add(this.rod);
    this.block(this.rod, '#384951', 0, .3, 0, .07, .8, .07);
    this.block(this.rod, '#e3cb86', 0, .95, 0, .055, .6, .055);
    this.rodTip = new THREE.Object3D(); this.rodTip.position.set(0, 1.28, 0); this.rod.add(this.rodTip);
    this.block(this.rod, '#f4b65d', .08, .22, 0, .18, .2, .12);
  }
  buildFish() {
    this.fishRoot = new THREE.Group(); this.scene.add(this.fishRoot); this.fishes = [];
    const colors = ['#f5b258','#a9d78c','#ed8b80','#9edbdc','#deae54','#f0c55b','#c0b2ea','#5bbfcf','#d6a6c8','#f0db7f','#7098de','#8cddd2'];
    for (let i = 0; i < 12; i++) {
      const root = new THREE.Group(); this.fishRoot.add(root); root.visible = false;
      const ray = [3,10].includes(i), jelly = i === 6, horse = i === 8, puffer = i === 1;
      this.block(root, colors[i], 0, 0, 0, horse ? .36 : puffer ? .7 : 1.05, jelly ? .5 : ray ? .19 : .48, ray ? 1.3 : puffer ? .64 : .43);
      this.block(root, '#e5ead2', .18, -.15, .02, horse ? .3 : .7, .14, .4);
      this.block(root, colors[i], .51, .025, 0, horse ? .4 : .25, .37, .4);
      const tail = new THREE.Group(); tail.position.x = -.58; root.add(tail);
      this.block(tail, colors[i], -.14, 0, 0, .35, ray ? .1 : .5, .11, -.18);
      this.block(root, colors[i], -.04, .31, 0, .4, .27, .1, -.3);
      for (const side of [-1, 1]) {
        this.block(root, '#173e50', .48, .1, side * .22, .09, .11, .025);
        this.block(root, '#ffffff', .5, .12, side * .238, .027, .035, .012);
        this.block(root, colors[i], .05, -.03, side * .34, .28, .08, ray ? .55 : .25, side * .2);
      }
      if (jelly) for (let j = 0; j < 4; j++) this.block(root, '#ccbfef', -.3 + j * .2, -.55, 0, .07, .7, .07, j % 2 ? .2 : -.2);
      if (horse) { this.block(root, colors[i], .3, .5, 0, .35, .6, .29); this.block(root, colors[i], .53, .72, 0, .45, .16, .2); }
      if (puffer) for (let j = 0; j < 4; j++) this.block(root, '#d7b777', -.3 + j * .2, .37, .1, .07, .15, .07);
      if (i === 0 || i === 7) for (let j = 0; j < 3; j++) this.block(root, '#e6f1d5', -.3 + j * .22, .04, .229, .09, .35, .02);
      if ([5,11].includes(i)) for (let j = 0; j < 3; j++) this.block(root, '#fff1a7', -.2 + j * .23, .48 + (j === 1 ? .12 : 0), 0, .15, .22, .17);
      if (i === 9) this.block(root, '#fff6a2', .55, .4, 0, .16, .19, .16);
      this.fishes.push({ root, tail });
    }
    // Merge static mesh parts by material to bound draw calls for twelve authored species.
    // Only the active species is visible. Tail remains independent for struggle animation.
    this.floatRoot = new THREE.Group(); this.scene.add(this.floatRoot);
    this.block(this.floatRoot, '#fff3d3', 0, .05, 0, .16, .2, .16);
    this.block(this.floatRoot, '#f36d50', 0, -.065, 0, .17, .09, .17);
    this.block(this.floatRoot, '#373f48', 0, .2, 0, .035, .18, .035);
  }
  buildLine() {
    this.linePositions = new Float32Array(33 * 3);
    const geometry = this.own(new THREE.BufferGeometry()); geometry.setAttribute('position', new THREE.BufferAttribute(this.linePositions, 3));
    const material = new THREE.LineBasicMaterial({ color: '#fff9d2' }); this.materials.set('line', material);
    this.line = new THREE.Line(geometry, material); this.line.frustumCulled = false; this.scene.add(this.line);
    this.tipVector = new THREE.Vector3();
  }
  buildParticles() {
    this.fxPositions = new Float32Array(96 * 3); this.fxPositions.fill(-100);
    const geometry = this.own(new THREE.BufferGeometry()); geometry.setAttribute('position', new THREE.BufferAttribute(this.fxPositions, 3));
    const material = new THREE.PointsMaterial({ color: '#d5fff9', size: .12, transparent: true, opacity: .85 });
    this.materials.set('particles', material); this.fx = new THREE.Points(geometry, material); this.fx.frustumCulled = false; this.scene.add(this.fx);
  }
  burst(position, rare = false) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    for (let i = 0; i < (rare ? 30 : 16); i++) {
      const a = i * 2.399, speed = .8 + (i % 4) * .2;
      this.particles.push({ x: position.x, y: .08, z: position.z, vx: Math.cos(a) * speed, vz: Math.sin(a) * speed, vy: 1.1 + i % 3 * .35, age: 0 });
    }
    this.particles = this.particles.slice(-96);
  }
  resize() {
    if (this.disposed) return;
    const rect = this.canvas.getBoundingClientRect(); const w = Math.max(1, Math.round(rect.width)), h = Math.max(1, Math.round(rect.height));
    if (this.width === w && this.height === h) return; this.width = w; this.height = h;
    this.renderer.setSize(w, h, false); this.camera.aspect = w / h;
    // Same world information in every arena: fit the fixed authored 14 x 12 envelope.
    const distance = Math.max(18, 14 / (2 * Math.tan(THREE.MathUtils.degToRad(19)) * this.camera.aspect));
    this.camera.position.set(0, distance * .63, distance * .78); this.camera.lookAt(0, .2, .25); this.camera.updateProjectionMatrix();
  }
  pickSpot(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const p = new THREE.Vector3((clientX - rect.left) / rect.width * 2 - 1, -(clientY - rect.top) / rect.height * 2 + 1, .5).unproject(this.camera);
    const ray = p.sub(this.camera.position).normalize(); const t = -this.camera.position.y / ray.y;
    const hit = this.camera.position.clone().addScaledVector(ray, t);
    return SPOTS.reduce((best, spot, i) => Math.hypot(hit.x - spot.x, hit.z - spot.z) < Math.hypot(hit.x - SPOTS[best].x, hit.z - SPOTS[best].z) ? i : best, 0);
  }
  render(s, dt = 0) {
    if (this.disposed) return; this.resize();
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.boat.rotation.z = reduced ? 0 : Math.sin(s.elapsed * 1.1) * .018;
    this.hero.rotation.z = s.phase === 'reel' ? -.1 - s.tension / 900 : s.phase === 'charging' ? -.15 : 0;
    this.rod.rotation.z = s.phase === 'charging' ? -.55 + s.castPower / 150 : s.phase === 'reel' ? -.6 + s.tension / 230 + s.steering * .14 : -.55;
    this.arm.rotation.x = s.reeling ? Math.sin(s.elapsed * 17) * .12 : 0;
    this.markers.forEach((marker, i) => { marker.visible = ['aim','charging'].includes(s.phase); marker.scale.setScalar(i === s.spot ? 1.22 : .8); });
    const active = !['aim','charging'].includes(s.phase);
    this.floatRoot.visible = active && s.phase !== 'landing'; this.floatRoot.position.set(s.float.x, s.float.y + .05, s.float.z);
    this.line.visible = active; this.rodTip.getWorldPosition(this.tipVector);
    for (let i = 0; i <= 32; i++) { const p = i / 32;
      this.linePositions[i*3] = this.tipVector.x + (s.float.x - this.tipVector.x) * p;
      this.linePositions[i*3+1] = this.tipVector.y + (s.float.y - this.tipVector.y) * p - Math.sin(p * Math.PI) * (s.phase === 'reel' ? (100-s.tension)/130 : .45);
      this.linePositions[i*3+2] = this.tipVector.z + (s.float.z - this.tipVector.z) * p;
    }
    this.line.geometry.attributes.position.needsUpdate = true;
    const index = Number(s.fish?.id?.split('-')[1]) - 1;
    this.fishes.forEach((fish, i) => { fish.root.visible = i === index && ['reel','landing','bite'].includes(s.phase); });
    const fish = this.fishes[index];
    if (fish) { fish.root.position.set(s.float.x, s.float.y + (s.phase === 'landing' ? .3 : -.15), s.float.z);
      fish.root.scale.setScalar(s.fish?.boss ? 1.35 : 1); fish.root.rotation.y = s.direction < 0 ? Math.PI : 0;
      fish.root.rotation.z = s.phase === 'landing' ? -.25 : reduced ? 0 : Math.sin(s.elapsed * 9) * (s.cycle === 'run' ? .18 : .05);
      fish.tail.rotation.y = reduced ? 0 : Math.sin(s.elapsed * (s.cycle === 'run' ? 17 : 7)) * .5; }
    this.fxPositions.fill(-100);
    this.particles = this.particles.filter((particle) => particle.age < .8);
    this.particles.forEach((p, i) => { p.age += dt; p.x += p.vx * dt; p.z += p.vz * dt; p.y += p.vy * dt; p.vy -= dt * 4;
      this.fxPositions[i*3] = p.x; this.fxPositions[i*3+1] = Math.max(0, p.y); this.fxPositions[i*3+2] = p.z; });
    this.fx.geometry.attributes.position.needsUpdate = true;
    this.renderer.render(this.scene, this.camera);
  }
  counters() { return { revision: THREE.REVISION, calls: this.renderer.info.render.calls, triangles: this.renderer.info.render.triangles,
    geometries: this.renderer.info.memory.geometries, textures: this.renderer.info.memory.textures, particles: this.particles.length, disposed: this.disposed }; }
  dispose() {
    if (this.disposed) return; this.disposed = true; this.canvas.removeEventListener('webglcontextlost', this.contextLost);
    this.geometries.forEach(g => g.dispose()); this.materials.forEach(m => m.dispose());
    // The stable shell owns this canvas/context. Dispose GPU objects but reuse the
    // same context on Retry; forcing loss here would poison that stable canvas.
    this.renderer.renderLists.dispose(); this.renderer.dispose();
    this.particles.length = 0; this.scene.clear(); this.geometries.clear(); this.materials.clear();
  }
}
