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
      this.renderer.toneMappingExposure = 1.1;
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color('#142538');
      this.camera = new THREE.OrthographicCamera(-VIEW_W / 2, VIEW_W / 2, VIEW_H / 2, -VIEW_H / 2, .1, 100);
      this.raycaster = new THREE.Raycaster();
      this.groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      this.vector = new THREE.Vector3();
      this.pointer = new THREE.Vector2();
      this.scene.add(new THREE.HemisphereLight(0xa9d8ff, 0x364051, 1.65));
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
      const rim = new THREE.DirectionalLight(0x639eff, 1.15);
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
        voxel: this.own(new THREE.BoxGeometry(1, 1, 1)),
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
        cyan: 0x7bb5c1, gold: 0xe3b34f, violet: 0x696d88, pink: 0x826879,
        dark: 0x303c41, grass: 0x4e5547, leaf: 0x437647, bark: 0x645e50,
        stone: 0x566f94, paleStone: 0x8aa5c5, bone: 0xf5e6c6, iron: 0x30393b, ember: 0xffb15b,
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
        const floorTexture = this.own(new THREE.DataTexture(new Uint8Array([235,243,255,255, 210,226,248,255, 224,236,252,255, 245,248,255,255]), 2, 2));
        floorTexture.magFilter = THREE.NearestFilter;
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
        const floorMaterial = this.own(new THREE.MeshStandardMaterial({ color: 0x536776, roughness: .85, metalness: .04 }));
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
    this.mesh('voxel', 'dark', court, 8, -.3, 13.75, 180, .4, 180);
    const tiles = [0x647e9e, 0x718ba8, 0x587492].map(color => this.own(new THREE.MeshStandardMaterial({ color, roughness: .62, metalness: .08 })));
    for (let x = 0; x < 12; x++) for (let z = 0; z < 20; z++) {
      this.mesh('voxel', tiles[(x * 7 + z * 11 + (x*z)%5) % 3], court, (x + .5) * WIDTH / UNIT / 12, -.065, (z + .5) * HEIGHT / UNIT / 20,
        WIDTH / UNIT / 12 - .045, .13, HEIGHT / UNIT / 20 - .045);
    }
    for (const side of [0, 1, 2, 3]) {
      const wall = new THREE.Group();
      const vertical = side < 2;
      const length = vertical ? HEIGHT / UNIT : WIDTH / UNIT;
      wall.position.set(vertical ? (side ? WIDTH / UNIT + .65 : -.65) : WIDTH / UNIT / 2, 0, vertical ? HEIGHT / UNIT / 2 : (side === 2 ? -.65 : HEIGHT / UNIT + .65));
      if (vertical) wall.rotation.y = Math.PI / 2;
      wall.userData = { normalX: vertical ? (side ? 1 : -1) : 0, normalZ: vertical ? 0 : (side === 2 ? -1 : 1) };
      court.add(wall); this.courtyardWalls.push(wall);
      this.mesh('voxel', 'dark', wall, 0, .15, 0, length + 1.5, .3, 1.5);
      const count = Math.ceil(length / 1.2);
      for (let row = 0; row < 5; row++) {
        for (let i = 0; i < count; i++) {
          const x = -length / 2 + (i + .5) * length / count;
          const stone = this.mesh('voxel', (i + row * 3) % 5 === 0 ? 'paleStone' : 'stone', wall, x, .45 + row * .46, 0, length / count - .055, .42, .87 + Math.sin(i * 1.7 + row) * .06);
          stone.rotation.z = 0;
        }
      }
      this.mesh('voxel', 'paleStone', wall, 0, 2.62, 0, length + .3, .18, 1.15);
      for (let i = 0; i < count; i += 2) {
        this.mesh('voxel', 'stone', wall, -length / 2 + (i + .5) * length / count, 3.03, 0, .68, .64, 1.0);
      }
      for (let i = 0; i <= count; i += 3) {
        const x = -length / 2 + i * length / count;
        this.mesh('voxel', 'dark', wall, x, 1.4, 0, .58, 2.8, 1.25);
        this.mesh('voxel', 'stone', wall, x, 2.87, 0, .85, .2, 1.48);
        this.mesh('voxel', 'paleStone', wall, x, 3.1, 0, .66, .3, 1.2);
        if (i % 2 === 0) {
          const outside = (side === 0 || side === 2) ? -1 : 1;
          this.mesh('voxel', 'stone', wall, x, 1.45, outside * 2.2, 2.6, 2.9, 2.5);
          this.mesh('voxel', 'dark', wall, x, 2.98, outside * 2.2, 2.85, .18, 2.8);
          this.mesh('voxel', 'paleStone', wall, x, 3.14, outside * 2.2, 2.6, .12, 2.5);
          for (const edge of [-1,1]) for (const offset of [-.85,0,.85])
            this.mesh('voxel', 'stone', wall, x + offset, 3.47, outside * 2.2 + edge * 1.1, .55, .6, .5);
        }
      }
    }
    for (const wall of this.courtyardWalls) {
      for (const x of [-3.4,3.4]) {
        this.mesh('voxel', 'velvet', wall, x, 1.75, -.47, .68, 1.12, .035);
        this.mesh('voxel', 'gold', wall, x, 2.34, -.49, .85, .08, .065);
        this.mesh('voxel', 'cyan', wall, x, 1.86, -.50, .16, .32, .045);
      }
    }
    // Gatehouse stays outside the simulated arena; layered lintels and door.
    const gate = new THREE.Group(); gate.position.set(8, 0, -2.6); court.add(gate);
    gate.userData = { normalX: 0, normalZ: -1 };
    this.courtyardWalls.push(gate);
    this.mesh('voxel', 'dark', gate, 0, 1.7, 0, 6.2, 3.4, 2.5);
    this.mesh('voxel', 'iron', gate, 0, 1.3, 1.28, 2.7, 2.6, .15);
    for (let i = -2; i <= 2; i++) this.mesh('voxel', 'bark', gate, i * .49, 1.3, 1.39, .43, 2.4, .1);
    this.mesh('voxel', 'bone', gate, 0, 2.1, 1.54, .8, .68, .22);
    for (const sign of [-1, 1]) this.mesh('voxel', 'eye', gate, sign * .15, 2.13, 1.665, .20, .23, .04);
    this.mesh('voxel', 'bone', gate, 0, 1.82, 1.59, .3, .14, .1);
    for (const x of [-1.9, 1.9]) {
      this.mesh('voxel', 'stone', gate, x, 1.6, 1.2, .65, 3.2, .8);
      this.mesh('voxel', 'paleStone', gate, x, 3.3, 1.2, .95, .24, 1);
    }
    this.mesh('voxel', 'paleStone', gate, 0, 3.6, 0, 6.8, .35, 3.1);
    this.mesh('voxel', 'stone', gate, 0, 3.85, 0, 5.9, .2, 2.5);
    for (let i = 0; i < 7; i++) this.mesh('voxel', 'dark', gate, -2.7 + i * .9, 4.15, 0, .65, .55, 2.3);
    for (const [x, z] of [[1,1], [15,1], [1,26.5], [15,26.5]]) {
      const lamp = new THREE.Group(); lamp.position.set(x,0,z); court.add(lamp);
      this.mesh('voxel', 'stone', lamp, 0,.15,0,.7,.3,.7);
      this.mesh('voxel', 'bark', lamp, 0,.9,0,.16,1.4,.16);
      this.mesh('voxel', 'iron', lamp, 0,1.7,0,.45,.1,.45);
      this.mesh('voxel', 'gold', lamp, 0,1.85,0,.36,.25,.36);
      this.mesh('voxel', 'ember', lamp, 0,2.13,0,.24,.48,.24);
      this.mesh('voxel', 'ember', lamp, .06,2.43,0,.12,.22,.12);
      this.mesh('voxel', 'white', lamp, 0,2.14,.125,.10,.25,.03);
      const light = new THREE.PointLight(0xffa34c, 14, 8, 2);
      light.position.set(x, 2.1, z); this.scene.add(light);
    }
    for (let i = 0; i < 36; i++) {
      const side = i % 2, z = .6 + Math.floor(i / 2) * 1.5;
      const x = side ? WIDTH / UNIT + 1.5 : -1.5;
      this.mesh('voxel', i % 3 ? 'stone' : 'paleStone', court, x + Math.sin(i) * .3, .12, z, .35 + i % 3 * .1, .2, .6).rotation.y = i * 1.31;
      if (i % 6 === 0) {
        this.mesh('voxel', 'dark', court, x, .14, z, .9, .25, .8);
        for (let j = -1; j <= 1; j++) this.mesh('voxel', 'cyan', court, x + j*.22, .48 + (j===0?.25:0), z, .18, j===0?.8:.45, .22).rotation.z = j*.25;
      }
    }
    // Thin worn threshold slabs give the playable floor a physical scale cue.
    for (let i = 0; i < 12; i++) {
      const x = 2 + i % 6 * 2.4, z = i < 6 ? .2 : HEIGHT / UNIT - .2;
      this.mesh('voxel', 'stone', court, x, -.005, z, 2.32, .04, .55);
    }
    const damp = this.own(new THREE.MeshBasicMaterial({ color: 0x18242d, transparent: true, opacity: .16, depthWrite: false }));
    const dampGeometry = this.geo.plane;
    for (let i = 0; i < 9; i++) {
      const puddle = this.mesh('disc', damp, court, 2 + (i * 3.77) % 12, .012, 2 + (i * 5.31) % 23, .7 + i % 3 * .3, .35 + i % 2 * .2, 1);
      puddle.geometry = dampGeometry;
      puddle.rotation.x = -Math.PI / 2; puddle.rotation.z = 0;
    }
    court.traverse(object => { if (object.isMesh && !object.material.transparent) object.userData.staticShadow = true; });
  }

  character(type) {
    if (type === 'hero') return this.ranger();
    const block = (shape, material, parent, x, y, z, sx, sy = sx, sz = sx) => {
      const radial = shape === 'ball' || shape === 'crystal';
      return this.mesh('voxel', material, parent, x, y, z, sx * (shape === 'box' ? 1 : 2), sy * (radial ? 2 : 1), sz * (shape === 'box' ? 1 : 2));
    };
    const root = new THREE.Group(), rig = new THREE.Group();
    root.add(rig);
    const tank = type === 'tank', archer = type === 'archer';
    const trim = tank ? 'iron' : archer ? 'leaf' : type === 'runner' ? 'pink' : 'robe';
    const contact = this.mesh('disc', this.shadow, root, 0, .02, 0, .48);
    contact.rotation.x = -Math.PI / 2;
    const legs = [];
    for (const sign of [-1, 1]) {
      const leg = new THREE.Group(); leg.position.set(sign * .14, .25, 0); rig.add(leg);
      block('rod', 'bone', leg, 0, 0, 0, .055, .34, .055);
      block('ball', 'bone', leg, 0, -.15, .085, .1, .065, .17);
      legs.push(leg);
      block('ball', 'bone', rig, sign * .25, .74, 0, .09, .09, .09);
      block('rod', 'bone', rig, sign * .3, .58, .03, .047, .29, .047).rotation.z = sign * .3;
      block('ball', 'bone', rig, sign * .34, .45, .09, .075, .08, .07);
    }
    block('ball', trim, rig, 0, .57, -.025, tank ? .28 : .2, .26, .15);
    block('rod', 'bone', rig, 0, .59, .13, .045, .4, .045);
    for (let i = 0; i < 3; i++) block('rod', 'bone', rig, 0, .53 + i * .085, .17, .025, .31 - i * .025, .025).rotation.z = Math.PI / 2;
    block('box', trim, rig, 0, .34, 0, .33, .11, .2);
    // Square ivory skull, pixel sockets and separated block teeth.
    block('ball', 'bone', rig, 0, 1.12, .015, .35, .34, .29);
    block('ball', 'bone', rig, 0, .91, .15, .25, .13, .2);
    for (const sign of [-1, 1]) {
      block('ball', 'eye', rig, sign * .135, 1.14, .277, .108, .125, .034);
      block('crystal', tank ? 'ember' : 'cyan', rig, sign * .135, 1.14, .309, .028, .036, .016);
    }
    block('cone', 'eye', rig, 0, 1.015, .31, .038, .08, .02).rotation.z = Math.PI;
    block('box', 'eye', rig, 0, .9, .319, .22, .055, .015);
    for (let i = -1; i <= 1; i++) block('box', 'bone', rig, i * .062, .911, .337, .045, .045, .02);
    if (archer) {
      block('box', 'leaf', rig, 0, 1.44, -.04, .72, .16, .58);
      block('box', 'leaf', rig, 0, 1.57, -.10, .48, .12, .38);
      for (const [y, z] of [[.39,.15],[.49,.24],[.69,.30],[.89,.24],[.99,.15]])
        block('box', 'bark', rig, .4, y, z, .055, .17, .075);
      block('rod', 'bone', rig, .4, .69, .19, .014, .7, .014);
    } else {
      block('rod', 'bark', rig, .34, .53, .14, .035, .24, .035);
      block('box', 'gold', rig, .34, .65, .14, .22, .045, .09);
      block('crystal', 'paleStone', rig, .34, .87, .14, .06, .26, .035);
    }
    if (tank) {
      block('ball', 'iron', rig, 0, 1.35, -.035, .36, .15, .28);
      block('box', 'iron', rig, -.37, .65, .2, .28, .43, .1);
      block('crystal', 'gold', rig, -.37, .66, .275, .07, .1, .025);
    }
    for (const sign of [-1,1]) {
      block('box', 'bone', rig, sign*.13, .66, .18, .045, .30, .045);
      if (tank) {
        block('box','iron',rig,sign*.28,.82,0,.24,.13,.30);
        block('box','gold',rig,sign*.28,.9,.01,.16,.04,.25);
      }
    }
    if (tank) {
      for (const sign of [-1,1]) block('box','gold',rig,-.37+sign*.135,.65,.265,.035,.45,.035);
      block('box','gold',rig,-.37,.85,.265,.28,.035,.035);
    }
    const shield = this.mesh('ring', 'cyan', root, 0, .08, 0, .64);
    shield.rotation.x = -Math.PI / 2; shield.visible = false;
    const chargeCrest = block('crystal', 'ember', rig, 0, 1.46, .08, .11, .24, .14);
    chargeCrest.visible = false;
    root.userData = { rig, legs, shield, chargeCrest, skeleton: true };
    return root;
  }

  ranger() {
    const root = new THREE.Group(), rig = new THREE.Group();
    root.add(rig);
    const contact = this.mesh('disc', this.shadow, root, 0, .02, 0, .48);
    contact.rotation.x = -Math.PI / 2;
    const legs = [];
    // Original voxel adventurer: straight limbs, square face and layered tunic.
    for (const sign of [-1, 1]) {
      const leg = new THREE.Group(); leg.position.set(sign * .12, .56, 0); rig.add(leg);
      this.mesh('voxel', 'velvet', leg, 0, -.23, 0, .21, .46, .23);
      this.mesh('voxel', 'leather', leg, 0, -.48, .025, .215, .13, .28);
      legs.push(leg);
      this.mesh('voxel', 'robe', rig, sign * .34, .95, 0, .20, .24, .26);
      this.mesh('voxel', 'fox', rig, sign * .34, .67, 0, .18, .33, .22);
      this.mesh('voxel', 'leather', rig, sign * .34, .51, .01, .19, .075, .235);
    }
    this.mesh('voxel', 'robe', rig, 0, .81, 0, .46, .54, .25);
    this.mesh('voxel', 'velvet', rig, 0, .78, -.15, .40, .57, .055);
    this.mesh('voxel', 'leather', rig, 0, .58, .005, .47, .075, .27);
    this.mesh('voxel', 'gold', rig, 0, .58, .15, .09, .065, .025);
    for (const sign of [-1, 1]) {
      this.mesh('voxel', 'ivory', rig, sign * .09, 1.01, .137, .075, .08, .025);
      this.mesh('voxel', 'gold', rig, sign * .19, .84, .139, .025, .37, .025);
    }
    for (const sign of [-1,1]) {
      this.mesh('voxel', 'robe', rig, sign*.15, .48, .02, .20, .22, .30);
      this.mesh('voxel', 'gold', rig, sign*.15, .38, .185, .20, .035, .025);
      this.mesh('voxel', 'gold', rig, sign*.40, 1.065, .02, .065, .04, .28);
      this.mesh('voxel', 'leather', rig, sign*.24, .61, .12, .08, .13, .12);
    }
    for (let i=0;i<4;i++) this.mesh('voxel','bark',rig,-.17+i*.105,1.65+(i%2)*.018,-.03,.105,.035,.32);
    this.mesh('voxel', 'cyan', rig, 0, .94, .15, .065, .065, .025);
    this.mesh('voxel', 'fox', rig, 0, 1.35, 0, .48, .48, .43);
    this.mesh('voxel', 'bark', rig, 0, 1.59, -.015, .50, .10, .46);
    this.mesh('voxel', 'bark', rig, 0, 1.36, -.205, .49, .40, .06);
    for (const sign of [-1, 1]) {
      this.mesh('voxel', 'bark', rig, sign * .22, 1.46, 0, .065, .20, .43);
      this.mesh('voxel', 'ivory', rig, sign * .115, 1.36, .219, .11, .055, .016);
      this.mesh('voxel', 'eye', rig, sign * .10, 1.36, .23, .043, .055, .018);
      this.mesh('voxel', 'bark', rig, sign * .115, 1.43, .222, .11, .025, .015);
    }
    this.mesh('voxel', 'leather', rig, 0, 1.285, .23, .065, .055, .035);
    this.mesh('voxel', 'bark', rig, 0, 1.215, .22, .10, .025, .016);
    // Asymmetric pixel fringe avoids a helmet-like solid hairline.
    this.mesh('voxel', 'bark', rig, -.07, 1.515, .215, .19, .07, .035);
    this.mesh('voxel', 'bark', rig, .055, 1.48, .215, .06, .14, .035);
    this.mesh('voxel', 'bark', rig, .43, .93, .15, .065, 1.80, .065);
    this.mesh('voxel', 'gold', rig, .43, 1.72, .15, .11, .18, .11);
    const dragon = new THREE.Group();
    dragon.position.set(.43, 1.95, .15);
    rig.add(dragon);
    this.mesh('voxel', 'velvet', dragon, 0, .035, -.055, .30, .25, .32);
    this.mesh('voxel', 'velvet', dragon, 0, .005, .16, .24, .15, .23);
    this.mesh('voxel', 'gold', dragon, 0, -.085, .13, .25, .045, .29);
    for (const sign of [-1, 1]) {
      this.mesh('voxel', 'gold', dragon, sign * .11, .22, -.15, .075, .20, .075);
      this.mesh('voxel', 'gold', dragon, sign * .16, .34, -.17, .14, .065, .07);
      this.mesh('voxel', 'robe', dragon, sign * .19, .025, -.09, .08, .16, .13);
      this.mesh('voxel', this.magicImpact, dragon, sign * .156, .08, .015, .018, .05, .07);
      this.mesh('voxel', 'ivory', dragon, sign * .075, -.06, .23, .035, .055, .035);
    }
    const muzzle = this.mesh('crystal', this.magicCore, dragon, 0, .015, .34, .105, .105, .105);
    const castGlow = this.mesh('crystal', this.magicGlow, dragon, 0, .015, .34, .17, .17, .17);
    const shield = this.mesh('ring', 'cyan', root, 0, .08, 0, .64); shield.visible = false;
    // Hero-only palette and gentle material fill: dungeon lighting is unchanged.
    const palette = { fox: 0xe9be96, ivory: 0xf0e9d9, robe: 0x238f9a,
      velvet: 0x244965, leather: 0x9f7957, gold: 0xe2b456,
      bark: 0x68472e, eye: 0x17314d, cyan: 0x8dc9d5 };
    const replacements = new Map();
    for (const [name, color] of Object.entries(palette)) {
      const material = this.own(this.mat[name].clone());
      material.color.setHex(color);
      material.emissive.setHex(color);
      material.emissiveIntensity = name === 'eye' ? 0 : .055;
      material.roughness = .52;
      material.metalness = name === 'gold' ? .3 : .03;
      replacements.set(this.mat[name], material);
    }
    root.traverse(part => {
      if (part.isMesh && replacements.has(part.material)) part.material = replacements.get(part.material);
    });
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
    // All six guardians share the skeleton rig; crowns and wings identify patterns.
    const root = this.character(type === 'bossCinder' ? 'runner' : 'tank');
    const rig = root.userData.rig;
    if (type === 'bossPrism' || type === 'bossTempest') {
      root.userData.wings = [];
      for (const sign of [-1, 1]) {
        const wing = new THREE.Group(); wing.position.set(sign * .2, .8, -.12); rig.add(wing);
        for (let i = 0; i < 4; i++) {
          const rib = this.mesh('voxel', 'bone', wing, sign * (.2 + i * .12), .2, -i * .11, .03, .7 - i * .1, .03);
          rib.rotation.z = -sign * (.5 + i * .18);
        }
        root.userData.wings.push(wing);
      }
    }
    if (type === 'bossRoot') {
      for (const sign of [-1, 1]) {
        const branch = this.mesh('voxel', 'bark', rig, sign * .4, 1.5, -.04, .07, .9, .07);
        branch.rotation.z = -sign * .4;
        this.mesh('voxel', 'leaf', rig, sign * .6, 1.95, -.04, .22, .35, .2);
      }
    } else if (type === 'bossCinder') {
      for (let i = 0; i < 5; i++) this.mesh('voxel', 'gold', rig, (i - 2) * .16, 1.35, -.1, .11, .3 + (i % 2) * .12, .1);
    } else if (type === 'bossEclipse') {
      for (const sign of [-1, 1]) {
        this.mesh('voxel', 'gold', rig, sign * .57, 1.6, -.07, .06, .06, 1.2);
        this.mesh('voxel', 'gold', rig, 0, 1.6, -.07 + sign * .57, 1.2, .06, .06);
      }
      this.mesh('voxel', 'cyan', rig, 0, .65, .3, .2, .3, .12);
    } else {
      for (let i = 0; i < 5; i++) this.mesh('voxel', 'gold', rig, (i - 2) * .13, 1.5, .04, .07, .25 + (i % 2) * .1, .07);
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

  hitFeedback(object, enemy) {
    const hit = Math.max(0, Math.min(1, (enemy.hit || 0) / .16));
    object.userData.rig.traverse(part => {
      if (!part.isMesh) return;
      part.userData.restMaterial ||= part.material;
      part.material = hit > .5 ? this.mat.white : part.userData.restMaterial;
    });
    object.userData.rig.scale.set(1 + hit * .07, 1 - hit * .06, 1 + hit * .07);
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
    // Brief world-space camera impulse; never changes simulation or input state.
    const punch = this.reducedMotion ? 0 : Math.max(0, ...(state.sparks || []).map(effect =>
      (effect.punch || 0) * Math.max(0, 1 - ((effect.duration || .45) - effect.life) / .16)));
    if (punch) {
      const offset = new THREE.Vector3(Math.sin(now * .11) * punch, Math.cos(now * .14) * punch * .45, 0);
      this.camera.position.add(offset);
    }
    const aspect = width / height;
    const groundCosine = 30 / Math.hypot(30, 22);
    const c = Math.abs(Math.cos(this.azimuth)), s = Math.abs(Math.sin(this.azimuth));
    const baseWidth = (WIDTH * c + HEIGHT * s) / UNIT + 3;
    const baseHeight = (WIDTH * s + HEIGHT * c) / UNIT * groundCosine + 4;
    const fittedHeight = Math.max(baseHeight, baseWidth / aspect) / 1.85;
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
    for (const type of ['basic', 'runner', 'tank', 'archer']) {
      const enemies = state.enemies.filter(e => !e.isBoss && (e.image === type || (type === 'basic' && !['runner', 'tank', 'archer'].includes(e.image))));
      this.pool(type, enemies.length, () => this.character(type), (object, i) => {
        const e = enemies[i];
        this.setPosition(object, e);
        this.hitFeedback(object, e);
        object.scale.setScalar(e.size / 64);
        object.userData.rig.rotation.y = e.bowAim ? Math.atan2(e.bowAim.x, e.bowAim.y) : Math.atan2(state.player.x - e.x, state.player.y - e.y);
        object.userData.legs.forEach((leg, j) => { leg.rotation.x = Math.sin(t * (type === 'runner' ? 15 : 9) + j * Math.PI + i) * .5; });
        object.userData.shield.visible = Boolean(e.shielded);
        object.userData.chargeCrest.visible = e.role === 'charger';
      }, 18);
    }
    for (const type of ['bossRoot', 'bossPrism', 'bossBriar', 'bossCinder', 'bossTempest', 'bossEclipse']) {
      const bosses = state.enemies.filter(e => e.isBoss && e.image === type);
      this.pool(type, bosses.length, () => this.boss(type), (object, i) => {
        this.setPosition(object, bosses[i]);
        this.hitFeedback(object, bosses[i]);
        object.scale.setScalar(bosses[i].size / 64);
        object.userData.rig.rotation.y = Math.atan2(state.player.x - bosses[i].x, state.player.y - bosses[i].y);
        object.userData.shield.visible = Boolean(bosses[i].shielded);
        object.userData.wings?.forEach((wing, j) => { wing.rotation.z = Math.sin(t * 4) * .18 * (j ? 1 : -1); });
      }, 1);
    }
    const chargingStage = ['charge', 'chargeRoots', 'briar', 'convergence'].includes(state.stageConfig?.modifier);
    const charging = state.enemies.filter(e => (e.isBoss ? ['bossBriar', 'bossTempest'].includes(e.image) : e.role !== 'archer' && (chargingStage || e.role === 'charger')) && e.chargeTimer <= .65);
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
    const archers = state.enemies.filter(e => e.bowAim);
    this.pool('bowCues', archers.length, () => {
      const group = new THREE.Group();
      this.mesh('box', this.warning, group, 0, .04, 4, .13, .025, 8);
      this.mesh('crystal', 'gold', group, 0, .07, 7.8, .13, .06, .25);
      return group;
    }, (object, i) => {
      this.setPosition(object, archers[i]);
      object.rotation.y = Math.atan2(archers[i].bowAim.x, archers[i].bowAim.y);
    }, 5);
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
    const deaths = (state.sparks || []).filter(effect => effect.kind === 'voxelDeath').slice(-12);
    this.pool('debris', deaths.length, () => {
      const group = new THREE.Group();
      for (let j = 0; j < 10; j++) this.mesh('voxel', j < 7 ? 'bone' : 'iron', group);
      return group;
    }, (object, i) => {
      const effect = deaths[i], age = Math.max(0, 1 - effect.life / .7);
      object.position.set(effect.x / UNIT, 0, effect.y / UNIT);
      const spread = (effect.boss ? 1.65 : 1) * (this.reducedMotion ? .35 : 1);
      for (let j = 0; j < 10; j++) {
        const part = object.children[j], angle = j * 2.39996 + effect.x * .01;
        const radius = .12 + age * (1.0 + j % 3 * .3) * spread;
        const lift = effect.height + (1.8 + j % 4 * .28) * age - 4.5 * age * age;
        part.position.set(Math.cos(angle) * radius, Math.max(.06, lift), Math.sin(angle) * radius);
        const size = (j === 0 ? .32 : .10 + (j % 3) * .035) * (effect.boss ? 1.4 : 1);
        part.scale.setScalar(size * Math.max(.001, Math.min(1, (1 - age) * 4)));
        part.rotation.set(age * (j + 2), angle + age * 5, age * 4);
      }
    }, 12);
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
      if (spark.kind === 'voxelDeath') { object.visible = false; return; }
      const magic = spark.kind === 'magicHit';
      const age = 1 - spark.life / .45;
      this.setPosition(object, spark, magic ? spark.height : .35 + age * .5);
      object.children.forEach((child, j) => { child.visible = magic ? j > 0 : j === 0; });
      const effectMaterial = spark.element === 'critical' ? this.mat.gold : this.elementMaterials[spark.element] || this.magicImpact;
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
        for (const [part, radius] of [[glow, .17], [core, .055]]) {
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
      const arrow = new THREE.Group(); group.add(arrow);
      this.mesh('rod', 'gold', arrow, 0, .7, 0, .035, .7, .035).rotation.x = Math.PI / 2;
      this.mesh('crystal', this.magicImpact, arrow, 0, .7, .37, .09, .05, .18);
      group.userData = { circle, lane, outline, arrow };
      return group;
    }, (object, i) => {
      const hazard = state.hazards[i];
      this.setPosition(object, hazard);
      const { circle, lane, outline, arrow } = object.userData;
      arrow.visible = hazard.kind === 'arrow';
      arrow.rotation.y = Math.atan2(hazard.vx || 0, hazard.vy || 0);
      circle.visible = hazard.kind !== 'lane' && !arrow.visible;
      lane.visible = hazard.kind === 'lane';
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
