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
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.shadowMap.autoUpdate = false;
      this.renderer.shadowMap.needsUpdate = true;
      this.renderer.localClippingEnabled = true;
      // The camera's actual viewport is the visibility boundary. Never cut
      // approaching enemies at an invisible rectangle inside that viewport.
      this.viewPlanes = [];
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = .95;
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color('#202a2b');
      this.camera = new THREE.OrthographicCamera(-VIEW_W / 2, VIEW_W / 2, VIEW_H / 2, -VIEW_H / 2, .1, 100);
      this.raycaster = new THREE.Raycaster();
      this.groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      this.vector = new THREE.Vector3();
      this.pointer = new THREE.Vector2();
      this.scene.add(new THREE.HemisphereLight(0xa9b8c0, 0x262522, 1.35));
      const sun = new THREE.DirectionalLight(0xffe2b9, 2.5);
      sun.position.set(-6, 24, 24);
      sun.target.position.set(8, 0, 14);
      sun.castShadow = true;
      sun.shadow.mapSize.set(1024, 1024);
      Object.assign(sun.shadow.camera, { left: -25, right: 25, top: 25, bottom: -25, near: 1, far: 75 });
      sun.shadow.bias = -.0006;
      sun.shadow.normalBias = .035;
      this.sun = sun;
      this.scene.add(sun.target);
      this.scene.add(sun);
      const rim = new THREE.DirectionalLight(0x718f9c, .7);
      rim.position.set(10, 6, -8);
      this.scene.add(rim);
      const blockShape = new THREE.Shape();
      blockShape.moveTo(-.46, -.46); blockShape.lineTo(.46, -.46);
      blockShape.lineTo(.46, .46); blockShape.lineTo(-.46, .46); blockShape.closePath();
      const stoneBlock = new THREE.ExtrudeGeometry(blockShape, { depth: .92, bevelEnabled: true, bevelSegments: 1, steps: 1, bevelSize: .04, bevelThickness: .04 });
      stoneBlock.translate(0, 0, -.46);
      this.geo = {
        ball: this.own(new THREE.SphereGeometry(1, 12, 8)),
        heroBall: this.own(new THREE.SphereGeometry(1, 20, 12)),
        heroCone: this.own(new THREE.ConeGeometry(1, 1, 24)),
        cone: this.own(new THREE.ConeGeometry(1, 1, 6)),
        crystal: this.own(new THREE.OctahedronGeometry(1)),
        box: this.own(stoneBlock),
        rod: this.own(new THREE.CylinderGeometry(1, 1, 1, 8)),
        ring: this.own(new THREE.TorusGeometry(1, .045, 4, 40)),
        disc: this.own(new THREE.CircleGeometry(1, 40)),
        plane: this.own(new THREE.PlaneGeometry(1, 1)),
        fineRing: this.own(new THREE.TorusGeometry(1, .008, 4, 64)),
        outsideZone: this.own(new THREE.RingGeometry(1, 50, 64)),
      };
      this.mat = {};
      this.magicCore = this.own(new THREE.MeshBasicMaterial({ color: 0xe6ffff, toneMapped: false }));
      this.magicGlow = this.own(new THREE.MeshBasicMaterial({ color: 0x38d9ff, transparent: true, opacity: .36, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
      this.magicImpact = this.own(new THREE.MeshBasicMaterial({ color: 0x8ff5ff, transparent: true, opacity: .85, blending: THREE.AdditiveBlending, depthTest: false, depthWrite: false, toneMapped: false }));
      this.elementMaterials = { shatter: this.magicImpact };
      for (const [element, color] of [['chain', 0xc3a1ff], ['burst', 0xffb05c]]) {
        const material = this.own(this.magicImpact.clone());
        material.color.setHex(color);
        this.elementMaterials[element] = material;
      }
      this.shotVisuals = new WeakMap();
      const colors = { fur: 0x947a54, cream: 0xccbd9e, mane: 0x554535,
        cloth: 0x34464b, pants: 0x292c2e, leather: 0x514138, eye: 0x13191d,
        cyan: 0x7bb5c1, gold: 0xc09b61, violet: 0x696d88, pink: 0x826879,
        dark: 0x303c41, grass: 0x4e5547, leaf: 0x414d42, bark: 0x645e50,
        stone: 0x817b6d, paleStone: 0xaaa18c, iron: 0x30393b, ember: 0xffb15b,
        white: 0xfff5cb, danger: 0xff704e, safe: 0x85ffc3,
        fox: 0xd99a61, ivory: 0xffe4be, robe: 0x345e70, velvet: 0x234354 };
      for (const [name, color] of Object.entries(colors)) {
        this.mat[name] = this.own(new THREE.MeshStandardMaterial({ color, roughness: .72,
          metalness: ['gold', 'iron'].includes(name) ? .6 : .02,
          emissive: ['cyan', 'ember'].includes(name) ? color : 0,
          emissiveIntensity: name === 'ember' ? 2 : .2 }));
      }
      this.shadow = this.own(new THREE.MeshBasicMaterial({ color: 0x102f30, transparent: true, opacity: .25, depthWrite: false }));
      this.warning = this.own(new THREE.MeshBasicMaterial({ color: 0xff735d, transparent: true, opacity: .3, depthWrite: false, side: THREE.DoubleSide }));
      this.activeHazard = this.own(new THREE.MeshBasicMaterial({ color: 0xff482c, transparent: true, opacity: .65, depthWrite: false, side: THREE.DoubleSide }));
      this.hazardPalette = new Map(['#60a5fa', '#65a30d', '#c084fc', '#f97316', '#fb923c', '#84cc16', '#f59e0b'].map(color => [color, [.28, .7, 1].map(opacity => this.own(new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false, side: THREE.DoubleSide, clippingPlanes: this.viewPlanes })))]));
      this.buildGarden(Boolean(floorImage?.complete && floorImage.naturalWidth));
      if (floorImage?.complete && floorImage.naturalWidth) {
        const floorTexture = this.own(new THREE.Texture(floorImage));
        floorTexture.colorSpace = THREE.SRGBColorSpace;
        floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set(14, 18);
        floorTexture.anisotropy = Math.min(4, this.renderer.capabilities.getMaxAnisotropy());
        floorTexture.needsUpdate = true;
        const masonryTexture = this.own(floorTexture.clone());
        masonryTexture.repeat.set(.25, .15);
        masonryTexture.offset.set(.35, .1);
        masonryTexture.needsUpdate = true;
        this.mat.stone.map = this.mat.paleStone.map = masonryTexture;
        const floorMaterial = this.own(new THREE.MeshStandardMaterial({ map: floorTexture, color: 0xc6c0b1, roughness: .57, metalness: .12 }));
        const floor = this.mesh('plane', floorMaterial, this.scene, WIDTH / UNIT / 2, -.015, HEIGHT / UNIT / 2, 70, 90, 1);
        floor.rotation.x = -Math.PI / 2;
        const exterior = new THREE.Shape();
        exterior.moveTo(-35, -45); exterior.lineTo(35, -45); exterior.lineTo(35, 45); exterior.lineTo(-35, 45); exterior.closePath();
        const opening = new THREE.Path();
        opening.moveTo(-8.6, -14.35); opening.lineTo(-8.6, 14.35); opening.lineTo(8.6, 14.35); opening.lineTo(8.6, -14.35); opening.closePath();
        exterior.holes.push(opening);
        const border = new THREE.Mesh(this.own(new THREE.ShapeGeometry(exterior)), this.own(new THREE.MeshBasicMaterial({ color: 0x101e25, transparent: true, opacity: .48, depthWrite: false })));
        border.rotation.x = -Math.PI / 2;
        border.position.set(WIDTH / UNIT / 2, -.01, HEIGHT / UNIT / 2);
        this.scene.add(border);
      }
      this.hero = this.character('hero');
      this.hero.scale.setScalar(1.75);
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
    const court = new THREE.Group();
    this.scene.add(court);
    this.courtyardWalls = [];
    this.mesh('box', 'dark', court, 8, -.3, 13.75, 180, .4, 180);
    for (const side of [0, 1, 2, 3]) {
      const wall = new THREE.Group();
      const vertical = side < 2;
      const length = vertical ? HEIGHT / UNIT : WIDTH / UNIT;
      wall.position.set(vertical ? (side ? WIDTH / UNIT + .65 : -.65) : WIDTH / UNIT / 2, 0, vertical ? HEIGHT / UNIT / 2 : (side === 2 ? -.65 : HEIGHT / UNIT + .65));
      if (vertical) wall.rotation.y = Math.PI / 2;
      wall.userData = { normalX: vertical ? (side ? 1 : -1) : 0, normalZ: vertical ? 0 : (side === 2 ? -1 : 1) };
      court.add(wall); this.courtyardWalls.push(wall);
      this.mesh('box', 'dark', wall, 0, .15, 0, length + 1.5, .3, 1.5);
      const count = Math.ceil(length / 1.2);
      for (let row = 0; row < 5; row++) {
        for (let i = 0; i < count; i++) {
          const x = -length / 2 + (i + .5) * length / count;
          const stone = this.mesh('box', (i + row * 3) % 5 === 0 ? 'paleStone' : 'stone', wall, x, .45 + row * .46, 0, length / count - .055, .42, .87 + Math.sin(i * 1.7 + row) * .06);
          stone.rotation.z = Math.sin(i * 13 + row * 3) * .008;
        }
      }
      this.mesh('box', 'paleStone', wall, 0, 2.62, 0, length + .3, .18, 1.15);
      for (let i = 0; i <= count; i += 3) {
        const x = -length / 2 + i * length / count;
        this.mesh('box', 'dark', wall, x, 1.4, 0, .58, 2.8, 1.25);
        this.mesh('box', 'stone', wall, x, 2.87, 0, .85, .2, 1.48);
        this.mesh('box', 'paleStone', wall, x, 3.1, 0, .66, .3, 1.2);
        if (i % 2 === 0) {
          const outside = (side === 0 || side === 2) ? -1 : 1;
          this.mesh('box', 'stone', wall, x, 1.45, outside * 2.2, 2.6, 2.9, 2.5);
          this.mesh('box', 'dark', wall, x, 2.98, outside * 2.2, 2.85, .18, 2.8);
          this.mesh('box', 'paleStone', wall, x, 3.14, outside * 2.2, 2.6, .12, 2.5);
          for (let r = -1; r <= 1; r++) this.mesh('box', 'iron', wall, x + r * .76, 3.25, outside * 2.2, .05, .12, 2.65);
        }
      }
    }
    // Gatehouse stays outside the simulated arena; layered lintels and door.
    const gate = new THREE.Group(); gate.position.set(8, 0, -2.6); court.add(gate);
    gate.userData = { normalX: 0, normalZ: -1 };
    this.courtyardWalls.push(gate);
    this.mesh('box', 'dark', gate, 0, 1.7, 0, 6.2, 3.4, 2.5);
    this.mesh('box', 'iron', gate, 0, 1.3, 1.28, 2.7, 2.6, .15);
    for (let i = -2; i <= 2; i++) this.mesh('box', 'bark', gate, i * .49, 1.3, 1.39, .43, 2.4, .1);
    for (const x of [-1.9, 1.9]) {
      this.mesh('box', 'stone', gate, x, 1.6, 1.2, .65, 3.2, .8);
      this.mesh('box', 'paleStone', gate, x, 3.3, 1.2, .95, .24, 1);
    }
    this.mesh('box', 'paleStone', gate, 0, 3.6, 0, 6.8, .35, 3.1);
    this.mesh('box', 'stone', gate, 0, 3.85, 0, 5.9, .2, 2.5);
    for (let i = 0; i < 7; i++) this.mesh('box', 'dark', gate, -2.7 + i * .9, 4.15, 0, .65, .55, 2.3);
    for (const [x, z] of [[1,1], [15,1], [1,26.5], [15,26.5]]) {
      const lamp = new THREE.Group(); lamp.position.set(x,0,z); court.add(lamp);
      this.mesh('box', 'stone', lamp, 0,.15,0,.7,.3,.7);
      this.mesh('rod', 'iron', lamp, 0,.9,0,.09,1.4,.09);
      this.mesh('box', 'iron', lamp, 0,1.7,0,.45,.1,.45);
      this.mesh('crystal', 'ember', lamp, 0,1.9,0,.15,.3,.15);
      this.mesh('cone', 'iron', lamp, 0,2.2,0,.35,.25,.35);
      const light = new THREE.PointLight(0xffa34c, 7, 7, 2);
      light.position.set(x, 2.1, z); this.scene.add(light);
    }
    for (let i = 0; i < 36; i++) {
      const side = i % 2, z = .6 + Math.floor(i / 2) * 1.5;
      const x = side ? WIDTH / UNIT + 1.5 : -1.5;
      this.mesh('box', i % 3 ? 'stone' : 'paleStone', court, x + Math.sin(i) * .3, .12, z, .35 + i % 3 * .1, .2, .6).rotation.y = i * 1.31;
      if (i % 4 === 0) this.mesh('ball', 'leaf', court, x, .28, z, .4, .18, .35);
    }
    // Thin worn threshold slabs give the playable floor a physical scale cue.
    for (let i = 0; i < 12; i++) {
      const x = 2 + i % 6 * 2.4, z = i < 6 ? .2 : HEIGHT / UNIT - .2;
      this.mesh('box', 'stone', court, x, -.005, z, 2.32, .04, .55);
    }
    const damp = this.own(new THREE.MeshBasicMaterial({ color: 0x18242d, transparent: true, opacity: .16, depthWrite: false }));
    const dampGeometry = this.own(new THREE.CircleGeometry(1, 16));
    const dampVertices = dampGeometry.attributes.position;
    for (let i = 1; i < dampVertices.count; i++) {
      const radius = .8 + Math.sin((i % 16) * 2.4) * .17;
      dampVertices.setXY(i, dampVertices.getX(i) * radius, dampVertices.getY(i) * radius);
    }
    for (let i = 0; i < 9; i++) {
      const puddle = this.mesh('disc', damp, court, 2 + (i * 3.77) % 12, .012, 2 + (i * 5.31) % 23, .7 + i % 3 * .3, .35 + i % 2 * .2, 1);
      puddle.geometry = dampGeometry;
      puddle.rotation.x = -Math.PI / 2; puddle.rotation.z = i * 1.73;
    }
    court.traverse(object => { if (object.isMesh && !object.material.transparent) object.userData.staticShadow = true; });
  }

  character(type) {
    if (type === 'hero') return this.ranger();
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
      this.mesh('cone', 'cloth', rig, 0, .55, -.26, .38, .95, .13);
      this.mesh('ball', 'iron', rig, 0, 1.26, .02, .34, .23, .28);
      this.mesh('box', 'iron', rig, 0, 1.15, .33, .56, .11, .1);
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
      this.mesh('ball', hero ? 'iron' : 'white', rig, sign * .135, 1.15, .292, .085, .1, .035);
      this.mesh('ball', hero ? 'cyan' : 'eye', rig, sign * .128, 1.15, .392, hero ? .025 : .044, hero ? .02 : .067, .02);
      const arm = this.mesh('ball', color, rig, sign * .35, .67, .015, .11, .24, .13);
      arm.rotation.z = sign * .25;
    }
    const tail = this.mesh('ball', color, rig, -.08, .45, -.42, .18, .2, .4);
    tail.rotation.x = -.45;
    this.mesh('ball', hero ? 'cream' : 'cyan', rig, -.08, .63, -.69, .15, .14, .17);
    if (hero) {
      this.mesh('rod', 'bark', rig, .45, .62, .13, .035, 1.05, .035);
      const gem = this.mesh('crystal', 'cyan', rig, .45, 1.24, .13, .14, .24, .14);
      root.userData.muzzle = gem;
      root.userData.castGlow = this.mesh('ball', this.magicGlow, rig, .45, 1.24, .13, .01, .01, .01);
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

  ranger() {
    const root = new THREE.Group(), rig = new THREE.Group();
    root.add(rig);
    const contact = this.mesh('disc', this.shadow, root, 0, .02, 0, .48);
    contact.rotation.x = -Math.PI / 2;
    const legs = [];
    for (const sign of [-1, 1]) {
      const leg = new THREE.Group(); leg.position.set(sign * .16, .24, .01); rig.add(leg);
      this.mesh('heroBall', 'velvet', leg, 0, 0, 0, .12, .22, .12);
      this.mesh('heroBall', 'leather', leg, 0, -.12, .09, .15, .1, .22);
      legs.push(leg);
      this.mesh('heroBall', 'robe', rig, sign * .33, .66, .03, .14, .24, .16).rotation.z = sign * .3;
      this.mesh('heroBall', 'fox', rig, sign * .37, .48, .13, .105, .115, .1);
    }
    this.mesh('heroCone', 'robe', rig, 0, .57, 0, .36, .7, .29);
    this.mesh('heroBall', 'velvet', rig, 0, .74, -.17, .39, .35, .2);
    this.mesh('ring', 'gold', rig, 0, .34, 0, .31, .31, .26).rotation.x = Math.PI / 2;
    this.mesh('heroBall', 'ivory', rig, 0, .8, .17, .3, .11, .18);
    this.mesh('crystal', 'cyan', rig, 0, .78, .33, .07, .11, .05);
    // Large smooth cheeks, raised ears and readable eyes define the silhouette.
    this.mesh('heroBall', 'fox', rig, 0, 1.15, .01, .42, .39, .34);
    for (const sign of [-1, 1]) {
      const ear = this.mesh('heroCone', 'fox', rig, sign * .29, 1.53, -.015, .18, .46, .15);
      ear.rotation.z = -sign * .19;
      this.mesh('heroCone', 'ivory', rig, sign * .29, 1.55, .085, .105, .29, .055).rotation.z = -sign * .19;
      this.mesh('heroBall', 'ivory', rig, sign * .2, 1.03, .27, .205, .19, .13);
      this.mesh('heroBall', 'eye', rig, sign * .155, 1.19, .318, .082, .115, .045);
      this.mesh('heroBall', 'cyan', rig, sign * .151, 1.18, .357, .038, .058, .017);
      this.mesh('heroBall', 'white', rig, sign * .15 - .018, 1.218, .373, .022, .028, .013);
      this.mesh('heroBall', 'fox', rig, sign * .16, 1.325, .285, .105, .035, .045).rotation.z = sign * .13;
    }
    this.mesh('heroBall', 'ivory', rig, 0, 1.015, .37, .17, .105, .1);
    this.mesh('heroBall', 'eye', rig, 0, 1.067, .453, .055, .037, .025);
    this.mesh('heroBall', 'velvet', rig, 0, 1.47, -.17, .27, .13, .24);
    this.mesh('heroCone', 'robe', rig, .04, 1.64, -.19, .2, .38, .2).rotation.z = -.28;
    this.mesh('crystal', 'gold', rig, .08, 1.76, -.12, .055, .08, .04);
    const tail = this.mesh('heroBall', 'fox', rig, -.27, .44, -.36, .22, .24, .48);
    tail.rotation.z = -.35;
    this.mesh('heroBall', 'ivory', rig, -.31, .58, -.67, .18, .17, .23);
    this.mesh('rod', 'bark', rig, .47, .66, .15, .04, 1.25, .04);
    this.mesh('rod', 'gold', rig, .47, 1.18, .15, .07, .2, .07);
    const dragon = new THREE.Group();
    dragon.position.set(.47, 1.4, .15);
    rig.add(dragon);
    this.mesh('ball', 'velvet', dragon, 0, .035, -.055, .19, .15, .23);
    this.mesh('ball', 'gold', dragon, 0, -.055, .13, .16, .055, .21);
    for (const sign of [-1, 1]) {
      this.mesh('cone', 'gold', dragon, sign * .13, .21, -.17, .055, .25, .065).rotation.x = -.3;
      this.mesh('crystal', this.magicImpact, dragon, sign * .155, .09, .06, .035, .04, .055);
    }
    this.mesh('crystal', 'gold', dragon, 0, .19, -.09, .045, .12, .16);
    const muzzle = this.mesh('heroBall', this.magicCore, dragon, 0, .015, .28, .11, .11, .11);
    this.mesh('ring', 'gold', dragon, 0, .015, .28, .15, .15, .15);
    const castGlow = this.mesh('heroBall', this.magicGlow, dragon, 0, .015, .28, .18, .18, .18);
    const shield = this.mesh('ring', 'cyan', root, 0, .08, 0, .64); shield.visible = false;
    root.userData = { rig, legs, muzzle, castGlow, shield, dragon };
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
    const targetX = WIDTH / UNIT / 2 * .3 + state.player.x / UNIT * .7;
    const targetZ = HEIGHT / UNIT / 2 * .3 + state.player.y / UNIT * .7;
    const dt = Math.min(.05, Math.max(0, (now - (this.focusTime ?? now)) / 1000));
    if (!this.focus) this.focus = { x: targetX, z: targetZ };
    const blend = 1 - Math.exp(-7 * dt);
    this.focus.x += (targetX - this.focus.x) * blend;
    this.focus.z += (targetZ - this.focus.z) * blend;
    this.focusTime = now;
    const cx = this.focus.x;
    const cz = this.focus.z;
    this.landscape = width > height;
    const azimuth = .55 + (this.landscape ? Math.PI / 2 : 0);
    if (this.azimuth !== azimuth) this.renderer.shadowMap.needsUpdate = true;
    this.azimuth = azimuth;
    this.camera.position.set(cx + Math.sin(this.azimuth) * 22, 30, cz + Math.cos(this.azimuth) * 22);
    this.camera.lookAt(cx, 0, cz);
    const aspect = width / height;
    const groundCosine = 30 / Math.hypot(30, 22);
    const c = Math.abs(Math.cos(this.azimuth)), s = Math.abs(Math.sin(this.azimuth));
    const baseWidth = (WIDTH * c + HEIGHT * s) / UNIT + 3;
    const baseHeight = (WIDTH * s + HEIGHT * c) / UNIT * groundCosine + 4;
    const fittedHeight = Math.max(baseHeight, baseWidth / aspect) / 1.6;
    if (resized || !this.bounds) {
      this.camera.left = -fittedHeight * aspect / 2;
      this.camera.right = fittedHeight * aspect / 2;
      this.camera.top = fittedHeight / 2;
      this.camera.bottom = -fittedHeight / 2;
      this.camera.updateProjectionMatrix();
    }
    this.bounds = { left: 0, right: WIDTH / UNIT, top: 0, bottom: HEIGHT / UNIT };
    this.camera.updateMatrixWorld();
    this.courtyardWalls?.forEach(wall => {
      const facing = wall.userData.normalX * Math.sin(this.azimuth) + wall.userData.normalZ * Math.cos(this.azimuth);
      wall.scale.y = facing > .1 ? .2 : 1;
    });
    this.setPosition(this.hero, state.player);
    this.setPosition(this.range, state.player, .035);
    this.range.scale.setScalar((state.player.range || 180) / UNIT);
    const t = this.reducedMotion ? 0 : now / 1000;
    const previous = this.hero.userData.previous;
    const moving = previous && Math.hypot(state.player.x - previous.x, state.player.y - previous.y) > .05;
    if (moving) this.hero.userData.rig.rotation.y = Math.atan2(state.player.x - previous.x, state.player.y - previous.y);
    if (!moving && !previous) this.hero.userData.rig.rotation.y = this.azimuth;
    // Locomotion owns body facing. Only the dragon staff head tracks attacks.
    const target = state.shots[state.shots.length - 1]?.target || this.hero.userData.aimTarget;
    if (target) {
      this.hero.updateMatrixWorld(true);
      const pivot = this.hero.userData.dragon.getWorldPosition(new THREE.Vector3());
      this.hero.userData.dragon.rotation.y = Math.atan2(target.x / UNIT - pivot.x, target.y / UNIT - pivot.z) - this.hero.userData.rig.rotation.y;
      this.hero.userData.aimTarget = state.enemies.includes(target) ? target : null;
    }
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
      const cue = new THREE.Group();
      this.mesh('fineRing', 'danger', cue).rotation.x = -Math.PI / 2;
      this.mesh('box', this.warning, cue, 0, 0, 1.6, .18, .02, 3.2);
      return cue;
    }, (cue, i) => {
      const enemy = charging[i];
      this.setPosition(cue, enemy, .06);
      cue.children[0].material = enemy.chargeTimer <= 0 ? this.mat.danger : this.mat.gold;
      cue.children[0].scale.setScalar(enemy.size / UNIT * .7);
      cue.children[1].visible = Boolean(enemy.chargeAim);
      cue.rotation.y = enemy.chargeAim ? Math.atan2(enemy.chargeAim.x, enemy.chargeAim.y) : 0;
    }, 19);
    const chilled = state.enemies.filter(e => e.chill > 0);
    this.pool('chilled', chilled.length, () => new THREE.Mesh(this.geo.ring, this.magicGlow), (object, i) => {
      this.setPosition(object, chilled[i], .12);
      object.rotation.x = -Math.PI / 2;
      object.scale.setScalar((chilled[i].size || 64) / UNIT * .65);
    }, 55);
    this.pool('xp', state.xpDrops.length, () => new THREE.Mesh(this.geo.crystal, this.mat.cyan), (object, i) => {
      this.setPosition(object, state.xpDrops[i], .16);
      object.scale.set(.09, .16, .09);
      object.rotation.y = t + i;
    }, 100);
    this.hero.userData.castGlow.scale.setScalar(.11 + .16 * (state.player.castPulse || 0) / .18);
    this.hero.updateMatrixWorld(true);
    this.pool('shots', state.shots.length, () => {
      const group = new THREE.Group();
      this.mesh('crystal', this.magicCore, group, 0, 0, 0, .12, .12, .23);
      this.mesh('ball', this.magicGlow, group, 0, 0, 0, .23, .23, .32);
      for (let j = 0; j < 5; j++) this.mesh('crystal', this.magicGlow, group);
      return group;
    }, (object, i) => {
      const shot = state.shots[i];
      let visual = this.shotVisuals.get(shot);
      if (!visual) {
        visual = { muzzle: this.hero.userData.muzzle.getWorldPosition(new THREE.Vector3()) };
        this.shotVisuals.set(shot, visual);
      }
      // Keep authoritative homing/damage unchanged; move its visible origin to
      // the actual transformed staff crystal, converging on the enemy's torso.
      const traveled = Math.hypot(shot.x - (shot.originX ?? shot.px), shot.y - (shot.originY ?? shot.py));
      const remaining = Math.hypot(shot.target.x - shot.x, shot.target.y - shot.y);
      const progress = traveled / Math.max(1, traveled + remaining);
      const originX = (shot.originX ?? shot.px) / UNIT;
      const originZ = (shot.originY ?? shot.py) / UNIT;
      const position = new THREE.Vector3(shot.x / UNIT + (visual.muzzle.x - originX) * (1 - progress),
        visual.muzzle.y * (1 - progress) + (shot.target.size || 64) / UNIT * .8 * progress,
        shot.y / UNIT + (visual.muzzle.z - originZ) * (1 - progress));
      object.position.copy(position);
      object.lookAt(shot.target.x / UNIT, (shot.target.size || 64) / UNIT * .8, shot.target.y / UNIT);
      const length = Math.min(1.35, position.distanceTo(visual.muzzle));
      for (let j = 0; j < 5; j++) {
        const tail = object.children[j + 2];
        tail.position.set(0, 0, -length * (j + 1) / 5);
        tail.scale.setScalar(.17 * (1 - j / 6));
      }
    }, 160);
    this.pool('sparks', (state.sparks || []).length, () => {
      const group = new THREE.Group();
      this.mesh('crystal', 'gold', group);
      this.mesh('ring', this.magicImpact, group);
      for (let j = 0; j < 8; j++) this.mesh('crystal', this.magicImpact, group);
      this.mesh('rod', this.elementMaterials.chain, group);
      for (let j = 0; j < 8; j++) {
        this.mesh('rod', this.elementMaterials.chain, group);
        this.mesh('rod', this.magicImpact, group);
      }
      return group;
    }, (object, i) => {
      const spark = state.sparks[i];
      const magic = spark.kind === 'magicHit';
      const age = 1 - spark.life / .45;
      this.setPosition(object, spark, magic ? spark.height : .35 + age * .5);
      object.children.forEach((child, j) => { child.visible = magic ? j > 0 : j === 0; });
      const effectMaterial = this.elementMaterials[spark.element] || this.magicImpact;
      object.children.slice(1, 10).forEach(child => { child.material = effectMaterial; });
      object.children[0].scale.setScalar(Math.max(.02, (1 - age) * .22));
      const ring = object.children[1];
      ring.quaternion.copy(this.camera.quaternion);
      if (spark.radius) ring.rotation.set(-Math.PI / 2, 0, 0);
      ring.scale.setScalar(.3 + (1 - Math.pow(1 - age, 3)) * (spark.radius || (this.reducedMotion ? .5 : 1.4)));
      const bolt = object.children[10];
      bolt.visible = magic && Number.isFinite(spark.fromX);
      const boltDelta = spark.fromPlayer ? this.hero.userData.muzzle.getWorldPosition(new THREE.Vector3()).sub(object.position)
        : new THREE.Vector3((spark.fromX - spark.x) / UNIT, spark.fromHeight - spark.height, (spark.fromY - spark.y) / UNIT);
      if (bolt.visible) {
        const delta = boltDelta;
        bolt.position.copy(delta).multiplyScalar(.5);
        bolt.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.clone().normalize());
        bolt.scale.set(.065 * (1 - age), delta.length(), .065 * (1 - age));
      }
      for (let j = 0; j < 8; j++) {
        const glow = object.children[11 + j * 2], core = object.children[12 + j * 2];
        glow.visible = core.visible = bolt.visible;
        if (!bolt.visible) continue;
        const delta = boltDelta;
        const offset = new THREE.Vector3(-delta.z, .6, delta.x).normalize();
        const a = delta.clone().multiplyScalar(j / 8).addScaledVector(offset, j === 0 ? 0 : (j % 2 ? .26 : -.26));
        const b = delta.clone().multiplyScalar((j + 1) / 8).addScaledVector(offset, j === 7 ? 0 : (j % 2 ? -.26 : .26));
        const direction = b.clone().sub(a);
        for (const [part, radius] of [[glow, .12], [core, .04]]) {
          part.position.copy(a).add(b).multiplyScalar(.5);
          part.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
          part.scale.set(radius * (1 - age * .6), direction.length(), radius * (1 - age * .6));
        }
      }
      for (let j = 0; j < 8; j++) {
        const shard = object.children[j + 2], angle = j * Math.PI / 4;
        const radius = .12 + age * (this.reducedMotion ? .4 : 1.25);
        shard.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius * .7, Math.sin(angle * 3) * radius * .5);
        shard.scale.setScalar(Math.max(.001, (1 - age) * (spark.element ? .23 : .14)));
        shard.rotation.set(angle, age * 4, angle);
      }
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
      const key = `${object.geometry.uuid}:${object.material.uuid}:${Boolean(object.userData.staticShadow)}`;
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
        batch.castShadow = Boolean(objects[0].userData.staticShadow);
        batch.receiveShadow = true;
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

  movementVector(x, y) {
    const angle = this.azimuth || 0;
    return { x: x * Math.cos(angle) + y * Math.sin(angle), y: -x * Math.sin(angle) + y * Math.cos(angle) };
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
      ownedTextureObjects: [...this.owned].filter(resource => resource.isTexture).length,
      shadowMap: Boolean(this.sun?.shadow.map),
      calls: this.renderer?.info.render.calls || 0,
      triangles: this.renderer?.info.render.triangles || 0,
      pools: Object.fromEntries([...this.pools].map(([key, values]) => [key, values.length])) };
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.canvas.removeEventListener('webglcontextlost', this.onLost);
    this.scene?.clear();
    this.sun?.shadow.map?.dispose();
    this.sun?.shadow.mapPass?.dispose();
    if (this.sun) { this.sun.shadow.map = null; this.sun.shadow.mapPass = null; }
    for (const resource of this.owned) resource.dispose();
    this.owned.clear();
    this.pools.clear();
    for (const batch of this.batches.values()) batch.dispose();
    this.batches.clear();
    this.renderer?.dispose();
    this.renderer?.forceContextLoss();
  }
}
