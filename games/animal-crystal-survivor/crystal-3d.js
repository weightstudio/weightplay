import * as THREE from '../animal-skyspire-drop/vendor/three/three.module.min.js';

// Rendering only. All coordinates, HP, projectiles and hazards come from game.js.
const UNIT = 64;
const WIDTH = 1024;
const HEIGHT = 1760;
const VIEW_W = WIDTH / 1.6 / UNIT;
const VIEW_H = HEIGHT / 1.6 / UNIT;

export class Crystal3D {
  constructor({ onContextLost = () => {}, floorImage = null } = {}) {
    this.owned = new Set();
    this.pools = new Map();
    this.batches = new Map();
    this.disposed = false;
    this.reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;
    this.canvas = document.createElement('canvas');
    this.contextLost = false;
    this.onLost = (event) => {
      event.preventDefault();
      this.contextLost = true;
      onContextLost();
    };
    this.canvas.addEventListener('webglcontextlost', this.onLost);
    try {
      this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: false });
      this.renderer.setPixelRatio(1);
      this.renderer.localClippingEnabled = true;
      // The camera's actual viewport is the visibility boundary. Never cut
      // approaching enemies at an invisible rectangle inside that viewport.
      this.viewPlanes = [];
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = .95;
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color('#153f41');
      this.camera = new THREE.OrthographicCamera(-VIEW_W / 2, VIEW_W / 2, VIEW_H / 2, -VIEW_H / 2, .1, 100);
      this.raycaster = new THREE.Raycaster();
      this.groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      this.vector = new THREE.Vector3();
      this.pointer = new THREE.Vector2();
      this.scene.add(new THREE.HemisphereLight(0xd4ffff, 0x193930, 1.7));
      const sun = new THREE.DirectionalLight(0xffdfac, 2.2);
      sun.position.set(-8, 18, 12);
      this.scene.add(sun);
      const rim = new THREE.DirectionalLight(0x64dbff, 1.5);
      rim.position.set(10, 6, -8);
      this.scene.add(rim);
      this.geo = {
        ball: this.own(new THREE.SphereGeometry(1, 12, 8)),
        cone: this.own(new THREE.ConeGeometry(1, 1, 6)),
        crystal: this.own(new THREE.OctahedronGeometry(1)),
        box: this.own(new THREE.BoxGeometry(1, 1, 1)),
        rod: this.own(new THREE.CylinderGeometry(1, 1, 1, 8)),
        ring: this.own(new THREE.TorusGeometry(1, .045, 4, 40)),
        disc: this.own(new THREE.CircleGeometry(1, 40)),
        plane: this.own(new THREE.PlaneGeometry(1, 1)),
        fineRing: this.own(new THREE.TorusGeometry(1, .008, 4, 64)),
        outsideZone: this.own(new THREE.RingGeometry(1, 50, 64)),
      };
      this.mat = {};
      const colors = { fur: 0xdb8527, cream: 0xffe2a0, mane: 0xa64a1a,
        cloth: 0x16736b, pants: 0x283c39, leather: 0x986638, eye: 0x192724,
        cyan: 0x49eeff, gold: 0xffc343, violet: 0x7562c7, pink: 0xc254ab,
        dark: 0x334563, grass: 0x386b52, leaf: 0x327955, bark: 0x604939,
        white: 0xfff5cb, danger: 0xff704e, safe: 0x85ffc3 };
      for (const [name, color] of Object.entries(colors)) {
        this.mat[name] = this.own(new THREE.MeshStandardMaterial({ color, roughness: .72,
          metalness: ['gold', 'cyan'].includes(name) ? .35 : .02,
          emissive: ['cyan', 'gold'].includes(name) ? color : 0,
          emissiveIntensity: .22 }));
      }
      this.shadow = this.own(new THREE.MeshBasicMaterial({ color: 0x102f30, transparent: true, opacity: .25, depthWrite: false }));
      this.warning = this.own(new THREE.MeshBasicMaterial({ color: 0xff735d, transparent: true, opacity: .3, depthWrite: false, side: THREE.DoubleSide }));
      this.activeHazard = this.own(new THREE.MeshBasicMaterial({ color: 0xff482c, transparent: true, opacity: .65, depthWrite: false, side: THREE.DoubleSide }));
      this.hazardPalette = new Map(['#60a5fa', '#65a30d', '#c084fc', '#f97316', '#fb923c', '#84cc16', '#f59e0b'].map(color => [color, [.28, .7, 1].map(opacity => this.own(new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false, side: THREE.DoubleSide, clippingPlanes: this.viewPlanes })))]));
      this.buildGarden(Boolean(floorImage?.complete && floorImage.naturalWidth));
      if (floorImage?.complete && floorImage.naturalWidth) {
        const floorTexture = this.own(new THREE.Texture(floorImage));
        floorTexture.colorSpace = THREE.SRGBColorSpace;
        // Reuse only the painted meadow surface. Scenery is authored in 3D,
        // rather than projecting illustrated trees sideways onto the ground.
        floorTexture.repeat.set(.36, .48);
        floorTexture.offset.set(.32, .27);
        floorTexture.needsUpdate = true;
        const floorMaterial = this.own(new THREE.MeshBasicMaterial({ map: floorTexture }));
        const floor = this.mesh('plane', floorMaterial, this.scene, WIDTH / UNIT / 2, -.015, HEIGHT / UNIT / 2, 70, 90, 1);
        floor.rotation.x = -Math.PI / 2;
      }
      this.hero = this.character('hero');
      this.hero.scale.setScalar(1.8);
      this.scene.add(this.hero);
      this.key = this.makeKey();
      this.scene.add(this.key);
      this.safe = this.mesh('ring', 'safe', this.scene, 0, .025, 0);
      this.safe.rotation.x = -Math.PI / 2;
      this.safe.visible = false;
      const darkness = this.own(new THREE.MeshBasicMaterial({ color: 0x160e32, transparent: true, opacity: .38, depthWrite: false, side: THREE.DoubleSide, clippingPlanes: this.viewPlanes }));
      this.outsideZone = this.mesh('outsideZone', darkness, this.scene, 0, .03, 0);
      this.outsideZone.rotation.x = -Math.PI / 2;
      this.outsideZone.visible = false;
      const rangeMaterial = this.own(new THREE.MeshBasicMaterial({ color: 0xb9f7d4, transparent: true, opacity: .5, depthWrite: false }));
      this.range = this.mesh('fineRing', rangeMaterial, this.scene, 0, .025, 0);
      this.range.rotation.x = -Math.PI / 2;
      // Wider screens may reveal scenery, never extra enemies or pickups.
      for (const material of [...Object.values(this.mat), this.shadow, this.warning, this.activeHazard, rangeMaterial]) material.clippingPlanes = this.viewPlanes;
    } catch (error) {
      this.dispose();
      throw error;
    }
  }

  own(resource) { this.owned.add(resource); return resource; }

  mesh(geometry, material, parent, x, y, z, sx = 1, sy = sx, sz = sx) {
    const mesh = new THREE.Mesh(this.geo[geometry], typeof material === 'string' ? this.mat[material] : material);
    mesh.position.set(x, y, z);
    mesh.scale.set(sx, sy, sz);
    parent.add(mesh);
    return mesh;
  }

  buildGarden(texturedFloor = false) {
    const garden = new THREE.Group();
    this.scene.add(garden);
    const terrain = this.own(new THREE.PlaneGeometry(180, 180, 48, 48));
    terrain.rotateX(-Math.PI / 2);
    const positions = terrain.attributes.position;
    const colors = new Float32Array(positions.count * 3);
    const color = new THREE.Color();
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i), z = positions.getZ(i);
      const patch = (Math.sin(x * .72 + Math.cos(z * .41)) + Math.cos(z * .83 - x * .17)) / 4 + .5;
      positions.setY(i, -.22 + Math.sin(x * .3) * Math.cos(z * .4) * .12);
      color.setHSL(.24 + patch * .04, .32, .17 + patch * .13);
      color.toArray(colors, i * 3);
    }
    terrain.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    terrain.computeVertexNormals();
    const terrainMaterial = this.own(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .95 }));
    const ground = new THREE.Mesh(terrain, terrainMaterial);
    ground.position.set(WIDTH / UNIT / 2, 0, HEIGHT / UNIT / 2);
    garden.add(ground);
    // Authored perimeter: layered mossy stone, foliage and crystal clusters.
    // These are scenery only and never introduce unannounced collisions.
    for (let i = 0; i < 72; i++) {
      const side = i % 4, along = Math.floor(i / 4) / 17;
      const irregular = .25 + (Math.sin(i * 2.37) + 1) * .45;
      const x = side < 2 ? (side ? WIDTH / UNIT + irregular : -irregular) : along * WIDTH / UNIT;
      const z = side < 2 ? along * HEIGHT / UNIT : (side === 2 ? -irregular : HEIGHT / UNIT + irregular);
      const rock = this.mesh('crystal', i % 3 ? 'bark' : 'dark', garden, x, .12, z, .35 + i % 3 * .08, .3, .45);
      rock.rotation.set(.1, i * .79, .2);
      this.mesh('ball', 'leaf', garden, x + .12, .3, z, .28, .13, .3);
      if (i % 5 === 0) {
        for (let j = 0; j < 3; j++) {
          const gem = this.mesh('crystal', j === 1 ? 'violet' : 'cyan', garden, x + (j - 1) * .2, .25 + j * .08, z + .15, .13, .4 + j * .12, .14);
          gem.rotation.z = (j - 1) * .3;
        }
      }
    }
    // Deterministic decoration never collides and stays outside the playable field.
    for (let i = 0; i < 34; i++) {
      const side = i % 2;
      const z = .3 + Math.floor(i / 2) * 1.65 + Math.sin(i * 3.7) * .25;
      const setback = .9 + (1 + Math.sin(i * 2.1)) * .7;
      const x = side ? WIDTH / UNIT + setback : -setback;
      const tree = new THREE.Group();
      tree.position.set(x, 0, z);
      tree.scale.setScalar(.85 + (1 + Math.sin(i * 3.1)) * .3);
      garden.add(tree);
      this.mesh('rod', 'bark', tree, 0, .5, 0, .12, 1, .12);
      for (let tier = 0; tier < 3; tier++) {
        const crown = this.mesh('cone', 'leaf', tree, 0, .8 + tier * .38, 0, .65 - tier * .13, .9, .65 - tier * .13);
        crown.rotation.y = i * .8;
      }
      this.mesh('ball', 'grass', tree, .3, 1.15, .12, .55, .4, .52);
    }
    for (const [x, z] of [[.4,.4], [WIDTH / UNIT - .4,.4], [.4,HEIGHT / UNIT - .4], [WIDTH / UNIT - .4,HEIGHT / UNIT - .4]]) {
      const shrine = new THREE.Group(); shrine.position.set(x, 0, z); garden.add(shrine);
      this.mesh('box', 'dark', shrine, 0, .1, 0, .65, .2, .65);
      this.mesh('rod', 'bark', shrine, 0, .5, 0, .2, .75, .2);
      this.mesh('box', 'gold', shrine, 0, .85, 0, .48, .08, .48);
      this.mesh('crystal', 'cyan', shrine, 0, 1.2, 0, .24, .4, .24);
      this.mesh('ring', 'gold', shrine, 0, 1.2, 0, .34).rotation.x = Math.PI / 2;
    }
    // Sparse inlaid stones give motion and scale cues without false obstacles.
    for (let i = 0; i < (texturedFloor ? 0 : 40); i++) {
      const x = .8 + ((i * 137) % 930) / UNIT;
      const z = .8 + ((i * 263) % 1650) / UNIT;
      this.mesh('rod', i % 3 ? 'leaf' : 'cloth', garden, x, -.025, z, .23, .025, .15).rotation.y = i;
    }
  }

  character(type) {
    const root = new THREE.Group();
    const hero = type === 'hero';
    const tank = type === 'tank';
    const runner = type === 'runner';
    const color = hero ? 'fur' : tank ? 'dark' : runner ? 'pink' : 'violet';
    const contact = this.mesh('disc', this.shadow, root, 0, .015, 0, .5);
    contact.rotation.x = -Math.PI / 2;
    const rig = new THREE.Group();
    root.add(rig);
    root.userData.rig = rig;
    const legs = [];
    for (const sign of [-1, 1]) {
      const leg = new THREE.Group();
      leg.position.set(sign * .16, .28, 0);
      rig.add(leg);
      this.mesh('ball', hero ? 'pants' : color, leg, 0, 0, 0, .13, .23, .15);
      this.mesh('ball', color, leg, 0, -.16, .08, .14, .09, .23);
      legs.push(leg);
    }
    root.userData.legs = legs;
    this.mesh('ball', hero ? 'leather' : color, rig, 0, .63, 0, tank ? .43 : .29, .38, .23);
    if (hero) {
      this.mesh('ball', 'cloth', rig, 0, .8, -.17, .32, .25, .09);
      this.mesh('ball', 'gold', rig, 0, .57, .235, .075, .065, .035);
      for (const sign of [-1, 1]) {
        this.mesh('crystal', 'gold', rig, sign * .29, .82, .08, .12, .09, .16);
        this.mesh('crystal', 'cyan', rig, sign * .29, .88, .08, .065, .07, .075);
        this.mesh('rod', 'gold', rig, sign * .19, .7, .22, .018, .27, .018).rotation.z = sign * .2;
      }
      this.mesh('crystal', 'cyan', rig, 0, .77, .26, .075, .11, .035);
    }
    this.mesh('ball', hero ? 'mane' : color, rig, 0, 1.05, -.025, .4, .37, .29);
    this.mesh('ball', color, rig, 0, 1.08, .09, .32, .28, .25);
    this.mesh('ball', hero ? 'cream' : 'dark', rig, 0, .99, .29, .2, .13, .12);
    this.mesh('ball', 'eye', rig, 0, 1.055, .39, .06, .038, .035);
    for (const sign of [-1, 1]) {
      const ear = this.mesh('cone', color, rig, sign * .26, 1.38, 0, .15, .32, .12);
      ear.rotation.z = -sign * .25;
      this.mesh('ball', 'cream', rig, sign * .25, 1.4, .08, .07, .1, .025);
      this.mesh('ball', 'white', rig, sign * .135, 1.15, .292, .085, .1, .035);
      this.mesh('ball', 'eye', rig, sign * .128, 1.15, .322, .044, .067, .02);
      const arm = this.mesh('ball', color, rig, sign * .35, .67, .015, .11, .24, .13);
      arm.rotation.z = sign * .25;
    }
    const tail = this.mesh('ball', color, rig, -.08, .45, -.42, .18, .2, .4);
    tail.rotation.x = -.45;
    this.mesh('ball', hero ? 'cream' : 'cyan', rig, -.08, .63, -.69, .15, .14, .17);
    if (hero) {
      this.mesh('rod', 'bark', rig, .45, .62, .13, .035, 1.05, .035);
      const gem = this.mesh('crystal', 'cyan', rig, .45, 1.24, .13, .14, .24, .14);
      gem.rotation.z = .15;
      this.mesh('crystal', 'cyan', rig, 0, 1.4, .18, .08, .15, .06);
    } else if (tank) {
      for (let i = 0; i < 5; i++) this.mesh('crystal', 'violet', rig, (i - 2) * .16, .9, -.17, .15, .3, .15);
      this.mesh('ball', 'pink', rig, 0, .99, .37, .15, .1, .06);
      for (const sign of [-1, 1]) this.mesh('cone', 'cream', rig, sign * .2, .96, .35, .065, .25, .065).rotation.z = -sign * .4;
    }
    const shield = this.mesh('ring', 'cyan', root, 0, .08, 0, .64);
    shield.rotation.x = -Math.PI / 2;
    shield.visible = false;
    root.userData.shield = shield;
    return root;
  }

  makeKey() {
    const key = new THREE.Group();
    this.mesh('ring', 'gold', key, 0, .6, 0, .19);
    this.mesh('rod', 'gold', key, 0, .29, 0, .045, .4, .045);
    this.mesh('box', 'gold', key, .07, .15, 0, .15, .07, .07);
    return key;
  }

  boss(type) {
    if (type === 'bossPrism' || type === 'bossTempest') return this.flyingBoss(type);
    const root = this.character(type === 'bossCinder' ? 'runner' : 'tank');
    const rig = root.userData.rig;
    if (type === 'bossRoot') {
      for (const sign of [-1, 1]) {
        const branch = this.mesh('rod', 'bark', rig, sign * .4, 1.5, -.04, .07, .9, .07);
        branch.rotation.z = -sign * .4;
        this.mesh('cone', 'leaf', rig, sign * .6, 1.95, -.04, .22, .35, .2);
      }
    } else if (type === 'bossCinder') {
      for (let i = 0; i < 5; i++) this.mesh('crystal', 'gold', rig, (i - 2) * .16, 1.35, -.1, .11, .3 + (i % 2) * .12, .1);
    } else if (type === 'bossEclipse') {
      const halo = this.mesh('ring', 'gold', rig, 0, 1.6, -.07, .6);
      halo.rotation.x = Math.PI / 2;
      this.mesh('crystal', 'cyan', rig, 0, .65, .3, .2, .3, .12);
    } else {
      for (let i = 0; i < 5; i++) this.mesh('cone', 'gold', rig, (i - 2) * .13, 1.5, .04, .07, .25 + (i % 2) * .1, .07);
    }
    return root;
  }

  flyingBoss(type) {
    const moth = type === 'bossPrism';
    const root = new THREE.Group();
    const rig = new THREE.Group();
    root.add(rig);
    root.userData = { rig, legs: [], wings: [] };
    this.mesh('ball', moth ? 'dark' : 'cyan', rig, 0, .85, 0, .22, .24, .52);
    this.mesh('ball', moth ? 'violet' : 'white', rig, 0, 1.02, .4, .23, .23, .23);
    for (const sign of [-1, 1]) {
      this.mesh('ball', 'cyan', rig, sign * .14, 1.08, .58, .07);
      if (moth) {
        const antenna = this.mesh('rod', 'gold', rig, sign * .19, 1.32, .43, .022, .45, .022);
        antenna.rotation.z = -sign * .4;
        this.mesh('crystal', 'pink', rig, sign * .28, 1.55, .43, .065, .1, .065);
      } else {
        this.mesh('cone', 'gold', rig, sign * .14, .48, .1, .05, .24, .05).rotation.x = Math.PI;
      }
      const wing = new THREE.Group();
      wing.position.set(sign * .16, .92, 0);
      rig.add(wing);
      if (moth) {
        for (const [z, size] of [[.25, .65], [-.4, .48]]) {
          const lobe = this.mesh('ball', 'violet', wing, sign * .53, 0, z, size, .07, size * .75);
          lobe.rotation.y = sign * .35;
          this.mesh('crystal', 'pink', wing, sign * .6, .075, z, size * .48, .035, size * .48);
          this.mesh('ball', 'cyan', wing, sign * .7, .11, z, .1, .025, .13);
        }
      } else {
        for (let i = 0; i < 6; i++) {
          const feather = this.mesh('crystal', i % 2 ? 'white' : 'cyan', wing, sign * (.2 + i * .15), 0, -.04 - i * .08, .15, .055, .55 - i * .045);
          feather.rotation.y = -sign * (.2 + i * .12);
        }
      }
      root.userData.wings.push(wing);
    }
    if (!moth) {
      this.mesh('cone', 'gold', rig, 0, .98, .67, .12, .35, .12).rotation.x = Math.PI / 2;
      for (let i = -1; i <= 1; i++) {
        this.mesh('crystal', 'cyan', rig, i * .1, 1.26, .32, .09, .27, .09);
        this.mesh('crystal', 'cyan', rig, i * .14, .8, -.63, .12, .055, .4).rotation.y = i * .2;
      }
    }
    const contact = this.mesh('disc', this.shadow, root, 0, .015, 0, .55);
    contact.rotation.x = -Math.PI / 2;
    const shield = this.mesh('ring', 'cyan', root, 0, .08, 0, .8);
    shield.rotation.x = -Math.PI / 2;
    shield.visible = false;
    root.userData.shield = shield;
    return root;
  }

  pool(name, count, make, update, limit) {
    let pool = this.pools.get(name);
    if (!pool) this.pools.set(name, pool = []);
    const bounded = Math.min(count, limit);
    while (pool.length < bounded) {
      const object = make();
      this.scene.add(object);
      pool.push(object);
    }
    pool.forEach((object, i) => {
      object.visible = i < bounded;
      if (object.visible) update(object, i);
    });
  }

  setPosition(object, item, height = 0) { object.position.set(item.x / UNIT, height, item.y / UNIT); }

  render(state, width, height, now = 0) {
    if (this.disposed || this.contextLost) return false;
    const resized = this.canvas.width !== width || this.canvas.height !== height;
    if (resized) this.renderer.setSize(width, height, false);
    const cx = WIDTH / UNIT / 2;
    const cz = HEIGHT / UNIT / 2;
    this.landscape = width > height;
    this.camera.position.set(cx + (this.landscape ? 12 : 0), 30, cz + (this.landscape ? 0 : 12));
    this.camera.lookAt(cx, 0, cz);
    const aspect = width / height;
    const groundCosine = 30 / Math.hypot(30, 12);
    const baseWidth = (this.landscape ? HEIGHT : WIDTH) / UNIT + 2;
    const baseHeight = ((this.landscape ? WIDTH : HEIGHT) / UNIT + 2) * groundCosine;
    const fittedHeight = Math.max(baseHeight, baseWidth / aspect);
    if (resized || !this.bounds) {
      this.camera.left = -fittedHeight * aspect / 2;
      this.camera.right = fittedHeight * aspect / 2;
      this.camera.top = fittedHeight / 2;
      this.camera.bottom = -fittedHeight / 2;
      this.camera.updateProjectionMatrix();
    }
    this.bounds = { left: 0, right: WIDTH / UNIT, top: 0, bottom: HEIGHT / UNIT };
    this.camera.updateMatrixWorld();
    this.setPosition(this.hero, state.player);
    this.setPosition(this.range, state.player, .035);
    this.range.scale.setScalar((state.player.range || 180) / UNIT);
    const t = this.reducedMotion ? 0 : now / 1000;
    const previous = this.hero.userData.previous;
    const moving = previous && Math.hypot(state.player.x - previous.x, state.player.y - previous.y) > .05;
    if (moving) this.hero.userData.rig.rotation.y = Math.atan2(state.player.x - previous.x, state.player.y - previous.y);
    this.hero.userData.previous = { x: state.player.x, y: state.player.y };
    this.hero.userData.legs.forEach((leg, i) => { leg.rotation.x = moving ? Math.sin(t * 13 + i * Math.PI) * .6 : 0; });
    this.setPosition(this.key, state.key, Math.sin(t * 2) * .06);
    this.key.rotation.y = t * .8;
    for (const type of ['basic', 'runner', 'tank']) {
      const enemies = state.enemies.filter(e => !e.isBoss && (e.image === type || (type === 'basic' && !['runner', 'tank'].includes(e.image))));
      this.pool(type, enemies.length, () => this.character(type), (object, i) => {
        const e = enemies[i];
        this.setPosition(object, e);
        object.scale.setScalar(e.size / 64);
        object.userData.rig.rotation.y = Math.atan2(state.player.x - e.x, state.player.y - e.y);
        object.userData.legs.forEach((leg, j) => { leg.rotation.x = Math.sin(t * (type === 'runner' ? 15 : 9) + j * Math.PI + i) * .5; });
        object.userData.shield.visible = Boolean(e.shielded);
      }, 18);
    }
    for (const type of ['bossRoot', 'bossPrism', 'bossBriar', 'bossCinder', 'bossTempest', 'bossEclipse']) {
      const bosses = state.enemies.filter(e => e.isBoss && e.image === type);
      this.pool(type, bosses.length, () => this.boss(type), (object, i) => {
        this.setPosition(object, bosses[i]);
        object.scale.setScalar(bosses[i].size / 64);
        object.userData.rig.rotation.y = Math.atan2(state.player.x - bosses[i].x, state.player.y - bosses[i].y);
        object.userData.shield.visible = Boolean(bosses[i].shielded);
        object.userData.wings?.forEach((wing, j) => { wing.rotation.z = Math.sin(t * 4) * .18 * (j ? 1 : -1); });
      }, 1);
    }
    const chargingStage = ['charge', 'chargeRoots', 'briar', 'convergence'].includes(state.stageConfig?.modifier);
    const charging = state.enemies.filter(e => (e.isBoss ? ['bossBriar', 'bossTempest'].includes(e.image) : chargingStage) && e.chargeTimer <= .65);
    this.pool('chargeCues', charging.length, () => {
      const cue = new THREE.Mesh(this.geo.fineRing, this.mat.danger);
      cue.rotation.x = -Math.PI / 2;
      return cue;
    }, (cue, i) => {
      this.setPosition(cue, charging[i], .06);
      cue.material = charging[i].chargeTimer <= 0 ? this.mat.danger : this.mat.gold;
      cue.scale.setScalar(charging[i].size / UNIT * .7);
    }, 19);
    this.pool('xp', state.xpDrops.length, () => new THREE.Mesh(this.geo.crystal, this.mat.cyan), (object, i) => {
      this.setPosition(object, state.xpDrops[i], .16);
      object.scale.set(.09, .16, .09);
      object.rotation.y = t + i;
    }, 100);
    this.pool('shots', state.shots.length, () => new THREE.Mesh(this.geo.crystal, this.mat.gold), (object, i) => {
      this.setPosition(object, state.shots[i], .55);
      object.scale.set(.06, .08, .16);
      object.rotation.y = Math.atan2(state.shots[i].target.x - state.shots[i].x, state.shots[i].target.y - state.shots[i].y);
    }, 160);
    this.pool('sparks', (state.sparks || []).length, () => new THREE.Mesh(this.geo.crystal, this.mat.gold), (object, i) => {
      const spark = state.sparks[i];
      this.setPosition(object, spark, .35 + (1 - spark.life / .45) * .5);
      object.scale.setScalar(Math.max(.02, spark.life / .45 * .22));
      object.rotation.set(t * 4, t * 5, 0);
    }, 64);
    this.pool('hazards', state.hazards.length, () => {
      const group = new THREE.Group();
      const circle = this.mesh('disc', this.warning, group, 0, .035, 0);
      const lane = this.mesh('box', this.warning, group, 0, .035, 0);
      const outline = this.mesh('ring', 'danger', group, 0, .04, 0);
      outline.rotation.x = -Math.PI / 2;
      circle.rotation.x = -Math.PI / 2;
      group.userData = { circle, lane, outline };
      return group;
    }, (object, i) => {
      const hazard = state.hazards[i];
      this.setPosition(object, hazard);
      const { circle, lane, outline } = object.userData;
      circle.visible = hazard.kind !== 'lane';
      lane.visible = !circle.visible;
      circle.scale.setScalar((hazard.r || 1) / UNIT);
      outline.visible = circle.visible;
      outline.scale.setScalar((hazard.r || 1) / UNIT);
      const palette = this.hazardPalette.get(hazard.color) || this.hazardPalette.get('#f59e0b');
      circle.material = lane.material = palette[hazard.warn > 0 ? 0 : 1];
      outline.material = palette[2];
      lane.scale.set((hazard.width || 1) / UNIT, .025, (hazard.height || 1) / UNIT);
    }, 64);
    this.safe.visible = Boolean(state.safeZone);
    this.outsideZone.visible = Boolean(state.safeZone);
    if (state.safeZone) {
      this.setPosition(this.safe, state.safeZone, .04);
      this.safe.scale.setScalar(state.safeZone.r / UNIT);
      this.setPosition(this.outsideZone, state.safeZone, .03);
      this.outsideZone.scale.setScalar(state.safeZone.r / UNIT);
    }
    this.syncInstances();
    this.renderer.render(this.scene, this.camera);
    return true;
  }

  syncInstances() {
    // One draw per shared geometry/material rather than per limb or leaf.
    // Logical meshes retain rig transforms but only instance batches render.
    this.scene.updateMatrixWorld(true);
    const groups = new Map();
    this.scene.traverseVisible(object => {
      if (!object.isMesh || object.isInstancedMesh) return;
      object.layers.set(1);
      const key = `${object.geometry.uuid}:${object.material.uuid}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(object);
    });
    for (const batch of this.batches.values()) batch.count = 0;
    for (const [key, objects] of groups) {
      let batch = this.batches.get(key);
      if (!batch || batch.instanceMatrix.count < objects.length) {
        if (batch) { this.scene.remove(batch); batch.dispose(); }
        const capacity = 2 ** Math.ceil(Math.log2(Math.max(8, objects.length)));
        batch = new THREE.InstancedMesh(objects[0].geometry, objects[0].material, capacity);
        batch.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        batch.frustumCulled = false;
        this.scene.add(batch);
        this.batches.set(key, batch);
      }
      batch.count = objects.length;
      objects.forEach((object, i) => batch.setMatrixAt(i, object.matrixWorld));
      batch.instanceMatrix.needsUpdate = true;
    }
  }

  pick(u, v) {
    this.pointer.set(u * 2 - 1, 1 - v * 2);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    if (!this.raycaster.ray.intersectPlane(this.groundPlane, this.vector)) return null;
    return { x: Math.max(this.bounds.left * UNIT, Math.min(this.bounds.right * UNIT, this.vector.x * UNIT)), y: Math.max(this.bounds.top * UNIT, Math.min(this.bounds.bottom * UNIT, this.vector.z * UNIT)) };
  }

  inView(x, y) { const p = this.project(x, y); return p.x >= 0 && p.x <= 1 && p.y >= 0 && p.y <= 1; }

  project(x, y, elevation = 0) {
    this.vector.set(x / UNIT, elevation, y / UNIT).project(this.camera);
    return { x: (this.vector.x + 1) / 2, y: (1 - this.vector.y) / 2 };
  }

  metrics() {
    return { disposed: this.disposed, contextLost: this.contextLost,
      geometries: this.renderer?.info.memory.geometries || 0,
      textures: this.renderer?.info.memory.textures || 0,
      calls: this.renderer?.info.render.calls || 0,
      triangles: this.renderer?.info.render.triangles || 0,
      pools: Object.fromEntries([...this.pools].map(([key, values]) => [key, values.length])) };
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.canvas.removeEventListener('webglcontextlost', this.onLost);
    this.scene?.clear();
    for (const resource of this.owned) resource.dispose();
    this.owned.clear();
    this.pools.clear();
    for (const batch of this.batches.values()) batch.dispose();
    this.batches.clear();
    this.renderer?.dispose();
    this.renderer?.forceContextLoss();
  }
}
