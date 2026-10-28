import * as THREE from '../purrch-grove/vendor/three/three.module.min.js';

// Dustwake's renderer owns only visual state. All route, cargo and timer decisions
// stay in core.mjs. Three r180 is the repository-pinned MIT runtime.
const PARTICLE_LIMIT = 48;
const WORLD = { left: -0.6, right: 9.6, top: -0.65, bottom: 7.65 };
const WARM = { sky: 0xdde9cf, floor: 0xc8d9a8, clean: 0xe5e9c8, stone: 0xc0c7a8, edge: 0x788c66, leaf: 0x6d9e42, dark: 0x3c5a43, metal: 0x986744, light: 0xffd18a };
const COOL = { sky: 0xcddfe7, floor: 0x9bbfc2, clean: 0xd7e6df, stone: 0xa0b8c5, edge: 0x5c7c8d, leaf: 0x548d79, dark: 0x344f62, metal: 0x9c795a, light: 0xb8f4ef };
const clamp = (value, lo, hi) => Math.max(lo, Math.min(hi, value));
const finite = (value, fallback = 0) => Number.isFinite(value) ? value : fallback;
const cellKey = (x, z) => `${Math.round(x)},${Math.round(z)}`;
const color = new THREE.Color();
const v = new THREE.Vector3();
const matrix = new THREE.Matrix4();
const normalMatrix = new THREE.Matrix3();
const quaternion = new THREE.Quaternion();
const scale = new THREE.Vector3();
const identity = new THREE.Quaternion();

// Chamfered, flat-faced cuboids retain the approved stepped Block Animals
// silhouette. Faces, twelve edge bevels and eight corner facets are authored.
function chamferedCube() {
  const a = 0.5, b = 0.425, positions = [];
  const face = (points) => {
    for (let i = 1; i < points.length - 1; i++) positions.push(...points[0], ...points[i], ...points[i + 1]);
  };
  for (let axis = 0; axis < 3; axis++) {
    const u = (axis + 1) % 3, w = (axis + 2) % 3;
    for (const sign of [-1, 1]) {
      const points = [[-b, -b], [b, -b], [b, b], [-b, b]].map(([p, q]) => {
        const out = [0, 0, 0]; out[axis] = sign * a; out[u] = p; out[w] = q; return out;
      });
      if (sign < 0) points.reverse();
      face(points);
    }
  }
  for (let axis = 0; axis < 3; axis++) {
    const u = (axis + 1) % 3, w = (axis + 2) % 3;
    for (const su of [-1, 1]) for (const sw of [-1, 1]) {
      const points = [[-b, a, b], [b, a, b], [b, b, a], [-b, b, a]].map(([p, q, r]) => {
        const out = [0, 0, 0]; out[axis] = p; out[u] = su * q; out[w] = sw * r; return out;
      });
      if (su * sw > 0) points.reverse();
      face(points);
    }
  }
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) {
    const points = [[sx * a, sy * b, sz * b], [sx * b, sy * a, sz * b], [sx * b, sy * b, sz * a]];
    if (sx * sy * sz < 0) points.reverse();
    face(points);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  return geometry;
}

function builder(source) {
  const position = [], normals = [], colors = [];
  const sourcePosition = source.getAttribute('position');
  const sourceNormal = source.getAttribute('normal');
  return {
    box(x, y, z, sx, sy, sz, tint, rotation = 0) {
      color.set(tint);
      quaternion.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, rotation);
      matrix.compose(v.set(x, y, z), quaternion, scale.set(sx, sy, sz));
      normalMatrix.getNormalMatrix(matrix);
      for (let i = 0; i < sourcePosition.count; i++) {
        v.fromBufferAttribute(sourcePosition, i).applyMatrix4(matrix); position.push(v.x, v.y, v.z);
        v.fromBufferAttribute(sourceNormal, i).applyNormalMatrix(normalMatrix); normals.push(v.x, v.y, v.z);
        colors.push(color.r, color.g, color.b);
      }
      return this;
    },
    geometry() {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
      geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      geometry.computeBoundingSphere();
      return geometry;
    }
  };
}

export function mountRenderer({ container, onPointer = () => {}, onStatus = () => {}, reducedMotion = false }) {
  if (!container?.appendChild) throw new TypeError('Dustwake renderer requires an arena container.');
  let renderer, scene, camera, disposed = false, lost = false, ready = false, renderFailed = false;
  let state = null, stageKey = '', stageGroup = null, frame = 0, previousFrameTime = 0;
  let recoveryAttempted = false, recoveryTimer = null, resolveRecovery = null;
  let activePointer = null, lastPointer = null, lastElapsed = 0, pendingRestored = false;
  const geometries = new Set(), materials = new Set(), stageGeometries = new Set(), listeners = [];
  const textures = new Set();
  const frameTimes = [], renderTimes = [], seenEvents = new Set(), initialPiles = new Map();
  const particles = Array.from({ length: PARTICLE_LIMIT }, () => ({ active: false, age: 0, duration: 0.3 }));
  const gates = [], depotModels = [], padModels = [];
  const peaks = { calls: 0, triangles: 0, geometries: 0, textures: 0 };
  let compressionConfirm = 0;
  let floor, dryDust, wetDust, specks, hero, targetRing, targetStem, trail;
  const floorColors = Array.from({ length: 80 }, () => new THREE.Color());
  const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2();
  const ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), hit = new THREE.Vector3();
  const status = (type, detail = {}) => { if (!disposed) onStatus(type, { revision: THREE.REVISION, ...detail }); };
  const keepGeometry = (geometry) => (geometries.add(geometry), geometry);
  const keepMaterial = (material) => (materials.add(material), material);
  const listen = (element, type, fn, options) => {
    element.addEventListener(type, fn, options); listeners.push(() => element.removeEventListener(type, fn, options));
  };
  const mesh = (geometry, material, parent = scene) => {
    const object = new THREE.Mesh(geometry, material); object.castShadow = true; object.receiveShadow = true; parent.add(object); return object;
  };
  let block, plain, matte, glossy, bronze, glow, closedLamp, warningLamp, ringMaterial, particleMaterial, numberMaterial;

  // One bounded functional-number atlas serves all deployment positions. These
  // are world labels, not substitute illustrated gameplay artwork.
  function makeNumberAtlas() {
    const canvas = document.createElement('canvas'); canvas.width = 384; canvas.height = 128;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Deployment number labels could not be created.');
    context.clearRect(0, 0, 384, 128); context.fillStyle = '#fff5d5';
    context.font = '800 96px system-ui, sans-serif'; context.textAlign = 'center'; context.textBaseline = 'middle';
    for (let i = 0; i < 3; i++) context.fillText(String(i + 1), i * 128 + 64, 69);
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearMipmapLinearFilter; texture.magFilter = THREE.LinearFilter;
    textures.add(texture);
    return keepMaterial(new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, toneMapped: false }));
  }

  function makeNumberLabel(number, parent) {
    const geometry = keepGeometry(new THREE.PlaneGeometry(.42, .56)); stageGeometries.add(geometry);
    const uv = geometry.getAttribute('uv');
    for (let i = 0; i < uv.count; i++) uv.setX(i, (number - 1 + uv.getX(i)) / 3);
    const label = mesh(geometry, numberMaterial, parent);
    label.name = `deployment-position-${number}`;
    label.rotation.x = -Math.PI / 2; label.position.y = .068;
    label.castShadow = false; label.receiveShadow = false;
    return label;
  }

  function groupFromBuild(build, parent, { stage = false, material = matte } = {}) {
    const geometry = build.geometry();
    keepGeometry(geometry); if (stage) stageGeometries.add(geometry);
    return mesh(geometry, material, parent);
  }

  function makeTaro() {
    const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
    const build = () => builder(block);
    const torso = build();
    torso.box(0, .26, -.02, .51, .23, .64, 0xd4c46c).box(0, .32, .24, .43, .22, .22, 0xded189)
      .box(0, .37, .38, .50, .09, .14, 0x347c41).box(-.09, .25, .39, .11, .25, .055, 0x3d9b47)
      .box(.08, .29, .40, .12, .18, .06, 0x4dba53);
    groupFromBuild(torso, body);
    const shellRoot = new THREE.Group(); body.add(shellRoot);
    const shell = build();
    shell.box(0, .43, -.08, .72, .23, .77, 0x87703b).box(0, .55, -.08, .68, .15, .73, 0x76a93d)
      .box(0, .64, -.12, .51, .12, .51, 0x9bc64a).box(0, .73, -.16, .30, .12, .32, 0x6c9c39);
    for (const x of [-.28, .28]) for (let z = -.36; z < .3; z += .16) {
      shell.box(x, .58, z, .12, .12, .12, 0xc7c9ab).box(x * .82, .67, z - .01, .10, .07, .10, 0x81b537);
    }
    for (const x of [-.17, .17]) shell.box(x, .74, .06, .11, .16, .11, 0xc6c9ad);
    shell.box(0, .83, .05, .25, .08, .12, 0xd8d7bf).box(0, .72, .096, .10, .13, .02, 0x65452f)
      .box(.025, .72, .112, .025, .03, .012, 0xf9ce64);
    for (let i = 0; i < 3; i++) shell.box(0, .59 + i * .035, .29 - i * .06, .15, .035, .09, 0xd8d7bf);
    for (const [x, z] of [[-.22, -.27], [.23, -.25], [.24, .20]]) {
      shell.box(x, .76, z, .035, .16, .035, 0x836039).box(x, .85, z, .14, .12, .13, 0x5d9633)
        .box(x - .025, .89, z, .10, .08, .11, 0x86b934);
    }
    shell.box(.105, .91, -.21, .025, .24, .025, 0x9a6d39).box(.175, .97, -.21, .14, .09, .025, 0x569c37)
      .box(.175, .955, -.192, .013, .036, .008, 0xe3dc67).box(.159, .975, -.192, .027, .018, .008, 0xe3dc67)
      .box(.188, .983, -.192, .024, .018, .008, 0xe3dc67);
    shell.box(-.26, .64, .23, .024, .035, .09, 0x40b9cf).box(-.27, .60, .31, .05, .025, .12, 0x5ed5df);
    for (const [x, z] of [[-.21, .12], [.21, .10]]) {
      shell.box(x, .72, z, .025, .025, .025, 0xf6c751).box(x, .72, z, .065, .018, .025, 0xfff3ce)
        .box(x, .72, z, .025, .018, .065, 0xfff3ce);
    }
    groupFromBuild(shell, shellRoot);
    const amber = new THREE.Group(); shellRoot.add(amber);
    const amberBuild = build();
    for (const [x, z] of [[-.3, -.25], [.3, -.25], [.3, .23]]) {
      amberBuild.box(x, .73, z, .06, .12, .06, 0x9a6a37).box(x, .82, z, .09, .09, .09, 0xf9bb40)
        .box(x, .87, z, .11, .025, .11, 0x7c5332).box(x, .76, z, .11, .025, .11, 0x7c5332);
    }
    amberBuild.box(-.13, .80, -.28, .08, .035, .06, 0xe6b73f).box(.10, .68, .24, .07, .025, .05, 0xf4d266);
    groupFromBuild(amberBuild, amber, { material: glossy });
    const head = new THREE.Group(); head.position.set(0, .44, .42); body.add(head);
    const face = build();
    face.box(0, .035, 0, .39, .31, .30, 0x73aa3a).box(0, .18, -.015, .42, .09, .31, 0x9d8a4f)
      .box(0, .235, -.025, .30, .055, .24, 0xc6a967).box(-.15, -.045, .12, .12, .15, .12, 0xb1c95c)
      .box(.15, -.045, .12, .12, .15, .12, 0xb1c95c).box(0, -.005, .175, .24, .10, .13, 0xc2d56c)
      .box(-.065, .015, .247, .025, .025, .008, 0x6f9141).box(.065, .015, .247, .025, .025, .008, 0x6f9141)
      .box(0, -.09, .17, .15, .045, .03, 0x743d2e).box(0, -.105, .19, .10, .02, .025, 0xea8a62);
    for (const x of [-.13, .13]) {
      face.box(x, .065, .159, .10, .14, .024, 0xf5f4d8).box(x + .007, .06, .176, .059, .105, .013, 0x273a27)
        .box(x - .006, .088, .185, .025, .035, .008, 0xffffff).box(x, .145, .17, .12, .03, .04, 0x477f33);
    }
    face.box(0, .21, .133, .12, .09, .027, 0x3e7f35).box(0, .20, .151, .012, .04, .012, 0xd7d76b)
      .box(-.017, .22, .151, .028, .018, .012, 0xe0dd78).box(.017, .23, .151, .028, .018, .012, 0xe0dd78);
    groupFromBuild(face, head);
    const legs = [];
    for (const x of [-.245, .245]) for (const z of [-.27, .24]) {
      const leg = new THREE.Group(); leg.position.set(x, .20, z); body.add(leg);
      const limb = build(); limb.box(0, -.04, 0, .17, .22, .18, 0x65a342).box(0, -.145, .035, .21, .08, .23, 0x82b54a);
      for (const toe of [-.065, 0, .065]) limb.box(toe, -.16, .145, .055, .065, .065, 0xe1ddbd);
      groupFromBuild(limb, leg); legs.push(leg);
    }
    const bags = new THREE.Group(); body.add(bags);
    const bagBuild = build();
    for (const x of [-.37, .37]) bagBuild.box(x, .35, -.015, .15, .25, .29, 0x8f5e35)
      .box(x, .48, .005, .17, .055, .30, 0xb28a4e).box(x * 1.22, .38, .08, .025, .06, .08, 0xecc564);
    bagBuild.box(-.37, .58, .035, .045, .19, .045, 0xeee2b8).box(-.43, .57, .035, .045, .17, .045, 0xd8cba6)
      .box(-.43, .40, .15, .14, .25, .07, 0x318a87).box(-.43, .40, .19, .085, .15, .018, 0xe9bd5c)
      .box(-.43, .525, .15, .16, .035, .085, 0xb58a4b).box(-.43, .275, .15, .16, .035, .085, 0xb58a4b);
    groupFromBuild(bagBuild, bags);
    const cargo = new THREE.Group(); bags.add(cargo);
    const fill = build(); fill.box(-.37, .53, -.08, .12, .10, .16, 0xe1ad4b).box(.37, .53, -.08, .12, .10, .16, 0xe1ad4b);
    groupFromBuild(fill, cargo);
    const tool = new THREE.Group(); tool.position.set(.15, .09, .63); body.add(tool);
    const tube = build(); tube.box(.19, .19, -.22, .07, .09, .40, 0x7b6950).box(.19, .12, -.01, .085, .18, .085, 0xaa8c52)
      .box(.10, .06, .02, .28, .07, .10, 0xcfb37a);
    groupFromBuild(tube, tool);
    const vacuum = new THREE.Group(); tool.add(vacuum);
    groupFromBuild(build().box(0, 0, .055, .38, .12, .20, 0x298e91).box(0, -.035, .16, .30, .045, .025, 0x273e3b)
      .box(0, .065, .045, .28, .025, .12, 0xe1c67f).box(0, .072, .045, .18, .012, .07, 0xf8cb64)
      .box(-.18, 0, .055, .035, .13, .21, 0xb98e4e).box(.18, 0, .055, .035, .13, .21, 0xb98e4e), vacuum);
    const brush = new THREE.Group(); tool.add(brush);
    const brushBuild = build(); brushBuild.box(0, .04, .06, .38, .07, .18, 0xe0c78e);
    for (let x = -.15; x <= .16; x += .06) for (const z of [0, .09]) brushBuild.box(x, -.02, z, .035, .08, .05, 0x4e8685);
    groupFromBuild(brushBuild, brush);
    const press = new THREE.Group(); shellRoot.add(press);
    groupFromBuild(build().box(.40, .35, -.02, .24, .045, .27, 0x716b59)
      .box(.515, .51, -.06, .035, .30, .035, 0xc0a569).box(.285, .51, -.06, .035, .30, .035, 0xc0a569)
      .box(.40, .67, -.06, .27, .05, .12, 0xd4aa57), press);
    const pressPlaten = new THREE.Group(); press.add(pressPlaten);
    pressPlaten.name = 'taro-compression-platen';
    groupFromBuild(build().box(.40, .58, -.02, .23, .055, .25, 0xd4aa57)
      .box(.40, .625, -.06, .04, .07, .04, 0x788989), pressPlaten);
    const pressSignalMaterial = keepMaterial(new THREE.MeshStandardMaterial({ color: 0xffd28b, emissive: 0xe3a33e, emissiveIntensity: .12, roughness: .4 }));
    const pressSignal = mesh(block, pressSignalMaterial, press);
    pressSignal.scale.set(.16, .025, .025); pressSignal.position.set(.40, .67, .01);
    root.scale.setScalar(.82);
    return { root, body, head, shellRoot, legs, amber, bags, cargo, tool, vacuum, brush, press, pressPlaten, pressSignalMaterial };
  }

  function makeDepot(x, z, portable, palette) {
    const root = new THREE.Group(); root.position.set(x, 0, z); stageGroup.add(root);
    const b = builder(plain);
    b.box(0, .02, 0, .89, .07, .87, palette.edge).box(0, .063, .04, .74, .025, .65, palette.clean)
      .box(0, .27, -.30, .77, .46, .25, palette.metal).box(0, .51, -.30, .85, .08, .31, 0x369a9e)
      .box(0, .34, -.159, .48, .17, .025, 0x284c45).box(0, .285, -.135, .37, .045, .07, palette.light)
      .box(-.33, .66, -.27, .055, .35, .055, 0xa49d7b).box(-.33, .85, -.27, .14, .11, .14, palette.light)
      .box(-.33, .925, -.27, .17, .04, .17, palette.metal);
    for (const xSide of [-.35, .35]) b.box(xSide, .15, -.18, .075, .23, .08, 0xd9c28b);
    if (portable) b.box(.29, .66, -.27, .06, .25, .06, palette.metal).box(.29, .80, -.27, .16, .07, .12, 0x68c1bd);
    else for (const xSide of [-.24, .24]) b.box(xSide, .12, .28, .08, .04, .10, 0xd4ae65);
    groupFromBuild(b, root, { stage: true });
    const ring = mesh(keepGeometry(new THREE.TorusGeometry(.37, .022, 4, 32)), ringMaterial, root);
    stageGeometries.add(ring.geometry); ring.rotation.x = -Math.PI / 2; ring.position.y = .084;
    const lamp = mesh(block, glow, root); lamp.scale.set(.09, .07, .06); lamp.position.set(.22, .36, -.14);
    return { root, ring, lamp, x, z, portable };
  }

  function makeGate(definition, index, palette, walls) {
    const x = definition.x ?? definition.cell?.[0] ?? 4, z = definition.z ?? definition.cell?.[1] ?? 3;
    const root = new THREE.Group(); root.position.set(x, 0, z); stageGroup.add(root);
    const verticalWall = walls.has(cellKey(x, z - 1)) || walls.has(cellKey(x, z + 1));
    if (verticalWall) root.rotation.y = Math.PI / 2;
    const b = builder(plain);
    for (const side of [-1, 1]) b.box(side * .42, .36, 0, .12, .70, .15, palette.edge)
      .box(side * .42, .73, 0, .17, .07, .20, palette.metal).box(side * .42, .05, 0, .23, .08, .30, palette.stone);
    b.box(0, .75, 0, .85, .08, .10, palette.metal);
    groupFromBuild(b, root, { stage: true });
    const barrier = new THREE.Group(); root.add(barrier);
    const bars = builder(plain);
    for (const y of [.20, .40]) bars.box(0, y, 0, .76, .08, .065, 0xcd874d);
    for (const xSide of [-.28, -.12, .04, .20]) bars.box(xSide, .30, .038, .045, .28, .025, 0xf5d180);
    groupFromBuild(bars, barrier, { stage: true });
    const fan = new THREE.Group(); fan.position.set(-.42, .48, .10); root.add(fan);
    const blades = builder(plain);
    blades.box(0, 0, 0, .055, .055, .06, 0xf1d19a);
    for (const r of [0, Math.PI / 2]) {
      const strip = mesh(block, bronze, fan); strip.scale.set(.18, .035, .025); strip.rotation.z = r;
    }
    groupFromBuild(blades, fan, { stage: true });
    const lamp = mesh(block, glow, root); lamp.scale.set(.12, .05, .07); lamp.position.set(.26, .81, 0);
    const airflow = new THREE.Group(); root.add(airflow);
    for (let i = 0; i < 3; i++) {
      const bar = mesh(plain, ringMaterial, airflow); bar.scale.set(.52 - i * .08, .008, .025);
      bar.position.set(0, .03, .18 + i * .13);
    }
    return { root, barrier, fan, lamp, airflow, definition, index, lastOpen: null, openStartedAt: 0 };
  }

  function rebuildStage(next) {
    if (stageGroup) scene.remove(stageGroup);
    for (const geometry of stageGeometries) { geometry.dispose(); geometries.delete(geometry); }
    stageGeometries.clear(); gates.length = 0; depotModels.length = 0; padModels.length = 0;
    initialPiles.clear(); seenEvents.clear(); compressionConfirm = 0; particles.forEach(p => { p.active = false; });
    hero.pressPlaten.position.y = 0;
    stageGroup = new THREE.Group(); scene.add(stageGroup);
    const chapter = Number(next.stage?.chapter) || (Number(next.stage?.id) > 30 ? 2 : 1);
    const palette = chapter === 2 ? COOL : WARM;
    scene.background.set(palette.sky);
    const walls = new Set((next.stage?.walls || []).map(([x, z]) => cellKey(x, z)));
    for (let x = 0; x < 10; x++) { walls.add(cellKey(x, 0)); walls.add(cellKey(x, 7)); }
    for (let z = 0; z < 8; z++) { walls.add(cellKey(0, z)); walls.add(cellKey(9, z)); }
    const architecture = builder(plain), vegetation = builder(plain);
    architecture.box(4.5, -.35, 3.5, 10.15, .60, 8.16, palette.dark)
      .box(4.5, -.095, 3.5, 10.05, .12, 8.05, palette.edge);
    for (let x = 0; x < 10; x++) for (const z of [-.48, 7.48]) architecture.box(x, -.28, z, .88, .25, .08, palette.metal);
    for (let z = 0; z < 8; z++) for (const x of [-.48, 9.48]) architecture.box(x, -.28, z, .08, .25, .88, palette.metal);
    for (const key of walls) {
      const [x, z] = key.split(',').map(Number), border = x === 0 || x === 9 || z === 0 || z === 7;
      architecture.box(x, .12, z, .88, .29, .88, palette.stone).box(x, .285, z, .94, .055, .94, palette.clean);
      if (!border) {
        architecture.box(x, .37, z, .70, .13, .62, palette.edge).box(x, .46, z, .75, .06, .67, palette.leaf);
        for (const side of [-1, 1]) vegetation.box(x + side * .2, .53, z, .11, .11, .13, palette.leaf);
      } else if ((x + z * 3) % 4 === 0 && !(x === 0 && z === 6)) {
        vegetation.box(x, .40, z, .17, .23, .17, 0x8c734b).box(x, .59, z, .48, .24, .42, palette.leaf)
          .box(x - .09, .75, z, .30, .16, .32, chapter === 2 ? 0x75aaa1 : 0x98bd53);
      } else if ((x + z) % 3 === 0) {
        vegetation.box(x, .36, z, .20, .10, .20, palette.leaf).box(x + .1, .41, z, .10, .08, .12, palette.leaf);
      }
      if (border && (x * 3 + z) % 9 === 0) architecture.box(x, .4, z, .14, .20, .14, palette.metal)
        .box(x, .56, z, .20, .14, .20, palette.light).box(x, .65, z, .24, .04, .24, palette.edge);
    }
    groupFromBuild(architecture, stageGroup, { stage: true });
    groupFromBuild(vegetation, stageGroup, { stage: true });
    const base = next.stage?.depot || [1, 6]; depotModels.push(makeDepot(base[0], base[1], false, palette));
    for (const [padIndex, [x, z]] of (next.stage?.pads || []).entries()) {
      const root = new THREE.Group(); root.position.set(x, .024, z); stageGroup.add(root);
      const b = builder(plain);
      for (const side of [-1, 1]) {
        b.box(side * .33, 0, 0, .07, .025, .72, 0x6babb5).box(0, 0, side * .33, .72, .025, .07, 0x6babb5);
        b.box(side * .22, .02, -.22, .06, .025, .06, 0xe7e5bf);
      }
      b.box(0, .022, 0, .48, .035, .62, 0x345b67);
      groupFromBuild(b, root, { stage: true }); makeNumberLabel(padIndex + 1, root);
      padModels.push({ root, x, z, number: padIndex + 1 });
    }
    (next.stage?.gates || []).forEach((gate, i) => gates.push(makeGate(gate, i, palette, walls)));
    for (const pile of next.piles || []) initialPiles.set(String(pile.id), { x: pile.x, z: pile.z, max: pile.max || pile.remaining || 1, kind: pile.kind });
    const floorBase = new THREE.Color(palette.floor);
    for (let z = 0; z < 8; z++) for (let x = 0; x < 10; x++) {
      const i = z * 10 + x;
      floorColors[i].copy(floorBase).offsetHSL(0, 0, ((x * 13 + z * 7) % 5 - 2) * .012);
      matrix.compose(v.set(x, -.045, z), identity, scale.set(.965, .07, .965)); floor.setMatrixAt(i, matrix); floor.setColorAt(i, floorColors[i]);
    }
    floor.instanceMatrix.needsUpdate = true; floor.instanceColor.needsUpdate = true;
    stageKey = `${next.stage?.id}:${chapter}`;
    lastElapsed = finite(next.elapsed);
  }

  function updateDepots(next) {
    const palette = Number(next.stage?.chapter) === 2 ? COOL : WARM;
    for (const [x, z] of next.depots || []) if (!depotModels.some(d => d.x === x && d.z === z)) depotModels.push(makeDepot(x, z, true, palette));
    for (const pad of padModels) pad.root.visible = !depotModels.some(d => d.x === pad.x && d.z === pad.z);
    const t = finite(next.elapsed);
    for (const depot of depotModels) {
      const window = next.stage?.rules?.depotWindow;
      const available = !window || (typeof window === 'number' ? t % 6 < window : (window === 'gate' || window === 'gates') ? next.gateStates?.every(Boolean) : t % ((window.openSeconds || 3) + (window.closedSeconds || 3)) < (window.openSeconds || 3));
      depot.lamp.scale.y = available ? .07 : .025;
      depot.lamp.material = available ? glow : closedLamp;
      depot.ring.scale.setScalar(reducedMotion ? 1 : 1 + Math.sin(t * 2.2) * .035);
      depot.ring.visible = available;
    }
  }

  function updatePiles(next) {
    let dryIndex = 0, wetIndex = 0;
    const totals = new Map(), remaining = new Map();
    for (const item of initialPiles.values()) {
      const key = cellKey(item.x, item.z); totals.set(key, (totals.get(key) || 0) + item.max);
    }
    for (const pile of next.piles || []) {
      const amount = Math.max(0, finite(pile.remaining)), key = cellKey(pile.x, pile.z);
      remaining.set(key, (remaining.get(key) || 0) + amount);
      if (!amount) continue;
      const wet = pile.kind === 'wet', collection = finite(pile.collecting);
      // A group is one core hit region, but each remaining cargo unit retains a
      // separate, countable mound. Completed units disappear one at a time.
      const units = Math.min(4, Math.ceil(amount));
      for (let unit = 0; unit < units; unit++) for (let j = 0; j < (wet ? 2 : 3); j++) {
        const object = wet ? wetDust : dryDust, index = wet ? wetIndex++ : dryIndex++;
        if (index >= object.instanceMatrix.count) break;
        const active = unit === units - 1 ? collection : 0;
        const jitter = active && !reducedMotion ? Math.sin(finite(next.elapsed) * 30 + j) * .008 : 0;
        const x = pile.x + (unit % 2 ? .18 : -.18) + (j % 2 ? .035 : -.035) + jitter;
        const z = pile.z + (unit < 2 ? -.18 : .18) + (j === 2 ? .03 : -.02);
        const size = (wet ? .17 : .12) * (1 - active * .18);
        quaternion.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, (j * .7 + finite(pile.x)) % 1.5);
        matrix.compose(v.set(x, wet ? .035 + j * .008 : .055 + (j === 2 ? .06 : 0), z), quaternion,
          scale.set(size * (wet ? 1.2 : 1), wet ? .045 : size, size));
        object.setMatrixAt(index, matrix);
        color.set(wet ? (j % 2 ? 0x547d8d : 0x365b70) : (j % 2 ? 0xd6a457 : 0xf0c77b));
        object.setColorAt(index, color);
      }
    }
    dryDust.count = Math.min(dryIndex, dryDust.instanceMatrix.count); wetDust.count = Math.min(wetIndex, wetDust.instanceMatrix.count);
    for (const object of [dryDust, wetDust]) { object.instanceMatrix.needsUpdate = true; if (object.instanceColor) object.instanceColor.needsUpdate = true; }
    const palette = Number(next.stage?.chapter) === 2 ? COOL : WARM;
    const cleanTint = new THREE.Color(palette.clean);
    for (let i = 0; i < 80; i++) {
      const key = cellKey(i % 10, Math.floor(i / 10)); color.copy(floorColors[i]);
      if (totals.has(key)) color.lerp(cleanTint, 1 - clamp((remaining.get(key) || 0) / totals.get(key), 0, 1));
      floor.setColorAt(i, color);
    }
    floor.instanceColor.needsUpdate = true;
  }

  function spawnParticle(event, i, targetX, targetZ, tint, type) {
    const p = particles.find(item => !item.active); if (!p) return;
    Object.assign(p, { active: true, age: 0, duration: reducedMotion ? .09 : (type === 'deposit' ? .42 : .28),
      x: finite(event.x) + ((i % 3) - 1) * .07, z: finite(event.z) + (Math.floor(i / 3) - .5) * .07,
      targetX: finite(targetX), targetZ: finite(targetZ), tint, type, seed: i });
  }

  function updateEffects(next, dt) {
    for (const event of next.events || []) {
      const key = String(event.id); if (seenEvents.has(key)) continue;
      seenEvents.add(key); if (seenEvents.size > 256) seenEvents.delete(seenEvents.values().next().value);
      if (event.type === 'collect' || event.type === 'brush') {
        for (let i = 0; i < (reducedMotion ? 1 : 3); i++) spawnParticle(event, i, next.player?.x, next.player?.z, event.type === 'brush' ? 0x8ed4db : 0xf0c66a, 'collect');
      } else if (event.type === 'deposit') {
        const closest = depotModels.reduce((a, b) => Math.hypot(a.x - finite(event.x), a.z - finite(event.z)) < Math.hypot(b.x - finite(event.x), b.z - finite(event.z)) ? a : b, depotModels[0]);
        for (let i = 0; i < (reducedMotion ? 2 : 9); i++) spawnParticle(event, i, event.targetX ?? closest?.x, event.targetZ ?? closest?.z, next.skin === 'amber' ? 0xffc556 : 0x9ee4a4, 'deposit');
      } else if (['deploy', 'compress', 'win'].includes(event.type)) {
        if (event.type === 'compress') compressionConfirm = .32;
        for (let i = 0; i < (reducedMotion ? 2 : 10); i++) spawnParticle(event, i, finite(event.x) + Math.sin(i * 2) * .65, finite(event.z) + Math.cos(i * 2) * .65, next.skin === 'amber' ? 0xffcf67 : 0xbdeeb5, 'burst');
      }
    }
    let count = 0;
    for (const p of particles) {
      if (!p.active) continue;
      p.age += dt; const t = clamp(p.age / p.duration, 0, 1);
      if (t >= 1) { p.active = false; continue; }
      const x = reducedMotion ? p.targetX : THREE.MathUtils.lerp(p.x, p.targetX, t);
      const z = reducedMotion ? p.targetZ : THREE.MathUtils.lerp(p.z, p.targetZ, t);
      const y = reducedMotion ? .35 : .10 + Math.sin(t * Math.PI) * .40 + (p.type === 'collect' ? t * .32 : 0);
      const size = (.045 + p.seed % 3 * .01) * (1 - t * .7);
      matrix.compose(v.set(x, y, z), identity, scale.set(size, size, size)); specks.setMatrixAt(count, matrix);
      color.set(p.tint); specks.setColorAt(count, color); count++;
    }
    specks.count = count; specks.instanceMatrix.needsUpdate = true; if (specks.instanceColor) specks.instanceColor.needsUpdate = true;
  }

  function updateCompression(next, dt) {
    const progress = next.compressing ? clamp(finite(next.compressionProgress), 0, 1) : 0;
    const eased = .5 - .5 * Math.cos(progress * Math.PI);
    // The platen follows the read-only render proxy through the whole one-second
    // action; it never completes or charges a compression transaction itself.
    if (reducedMotion) hero.pressPlaten.position.y = 0;
    else if (next.compressing) hero.pressPlaten.position.y = -.16 * eased;
    else hero.pressPlaten.position.y = Math.min(0, hero.pressPlaten.position.y + dt * .8);
    if (next.compressing && !reducedMotion) hero.cargo.scale.y *= 1 - eased * .34;
    compressionConfirm = Math.max(0, compressionConfirm - dt);
    hero.pressSignalMaterial.emissiveIntensity = .12 + (next.compressing ? .55 * eased : compressionConfirm * 1.9);
  }

  function pointFromEvent(event, clampOutside = false) {
    if (!renderer || !camera) return null;
    const rect = renderer.domElement.getBoundingClientRect(); if (rect.width <= 0 || rect.height <= 0) return null;
    pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
    raycaster.setFromCamera(pointer, camera); if (!raycaster.ray.intersectPlane(ground, hit)) return null;
    if (!clampOutside && (hit.x < -.45 || hit.x > 9.45 || hit.z < -.45 || hit.z > 7.45)) return null;
    return { x: clamp(hit.x, 0, 9), z: clamp(hit.z, 0, 7) };
  }

  function cancelPointer() {
    if (activePointer === null) return;
    const id = activePointer; activePointer = null;
    if (lastPointer) onPointer({ phase: 'cancel', ...lastPointer });
    if (renderer?.domElement.hasPointerCapture?.(id)) renderer.domElement.releasePointerCapture(id);
  }

  function resize() {
    if (!renderer || disposed) return;
    const rect = container.getBoundingClientRect(), width = Math.max(1, rect.width), height = Math.max(1, rect.height);
    const dpr = Math.min(1.5, globalThis.devicePixelRatio || 1);
    if (renderer.getPixelRatio() !== dpr) renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    const aspect = width / height, center = new THREE.Vector3(4.5, .15, 3.5);
    camera.position.set(4.5, 17.0, 14.15); camera.lookAt(center); camera.updateMatrixWorld(true);
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const x of [WORLD.left, WORLD.right]) for (const z of [WORLD.top, WORLD.bottom]) for (const y of [-.65, 1.1]) {
      v.set(x, y, z).applyMatrix4(camera.matrixWorldInverse);
      minX = Math.min(minX, v.x); maxX = Math.max(maxX, v.x); minY = Math.min(minY, v.y); maxY = Math.max(maxY, v.y);
    }
    const viewWidth = Math.max(maxX - minX, (maxY - minY) * aspect) * 1.035;
    const viewHeight = viewWidth / aspect, offsetX = (minX + maxX) / 2, offsetY = (minY + maxY) / 2;
    camera.left = offsetX - viewWidth / 2; camera.right = offsetX + viewWidth / 2;
    camera.top = offsetY + viewHeight / 2; camera.bottom = offsetY - viewHeight / 2; camera.updateProjectionMatrix();
  }

  function render(next, dt = 0) {
    if (disposed || !renderer || lost || renderFailed || !next?.stage) return;
    try {
      state = next;
      if (next.status !== 'playing') cancelPointer();
      const nextKey = `${next.stage.id}:${Number(next.stage.chapter) || (Number(next.stage.id) > 30 ? 2 : 1)}`;
      if (nextKey !== stageKey || finite(next.elapsed) < lastElapsed - .05) rebuildStage(next);
      lastElapsed = finite(next.elapsed);
      updateDepots(next); updatePiles(next);
      const t = finite(next.elapsed), moving = !!next.player?.moving, brushing = !!next.player?.brushing;
      hero.root.position.set(finite(next.player?.x, 1), 0, finite(next.player?.z, 6));
      hero.root.rotation.y = finite(next.player?.angle);
      hero.body.position.y = reducedMotion ? 0 : moving ? Math.sin(t * 15) * .018 : Math.sin(t * 2) * .004;
      hero.legs.forEach((leg, i) => { leg.rotation.x = !reducedMotion && moving ? Math.sin(t * 15 + (i === 0 || i === 3 ? 0 : Math.PI)) * .22 : 0; });
      hero.head.rotation.x = reducedMotion ? 0 : brushing ? -.07 + Math.sin(t * 22) * .018 : 0;
      hero.tool.position.x = .15 + (!reducedMotion && brushing ? Math.sin(t * 23) * .045 : 0);
      hero.brush.visible = next.mode === 'brush'; hero.vacuum.visible = !hero.brush.visible;
      hero.press.visible = next.toolId === 'press'; hero.amber.visible = next.skin === 'amber';
      hero.bags.scale.set(next.toolId === 'cargo' ? 1.12 : 1, 1, next.toolId === 'cargo' ? 1.1 : 1);
      const load = finite(next.bagLoad ?? next.bagWeight ?? next.bagCargo), capacity = next.capacity || (next.toolId === 'cargo' ? 12 : 8);
      hero.cargo.visible = load > 0; hero.cargo.scale.y = .25 + clamp(load / capacity, 0, 1);
      targetRing.visible = !!next.target && next.status === 'playing'; targetStem.visible = targetRing.visible;
      if (targetRing.visible) {
        targetRing.position.set(next.target.x, .035, next.target.z); targetStem.position.set(next.target.x, .045, next.target.z);
        targetRing.scale.setScalar(reducedMotion ? 1 : .95 + Math.sin(t * 5) * .06);
      }
      trail.visible = !!next.target && next.status === 'playing';
      if (trail.visible) {
        const p = next.player, dx = next.target.x - p.x, dz = next.target.z - p.z, distance = Math.min(1.5, Math.hypot(dx, dz));
        trail.position.set(p.x + dx / Math.max(.001, Math.hypot(dx, dz)) * distance / 2, .018, p.z + dz / Math.max(.001, Math.hypot(dx, dz)) * distance / 2);
        trail.rotation.y = Math.atan2(dx, dz); trail.scale.set(.035, .012, distance);
        // The short intention mark is suppressed where it would imply a route
        // through a wall. Only core chooses the actual path around obstacles.
        for (let step = .1; step <= distance; step += .1) {
          const sx = p.x + dx / Math.max(.001, Math.hypot(dx, dz)) * step;
          const sz = p.z + dz / Math.max(.001, Math.hypot(dx, dz)) * step;
          if (next.stage.walls?.some(([wx, wz]) => Math.abs(sx - wx) < .55 && Math.abs(sz - wz) < .55)) { trail.visible = false; break; }
        }
      }
      for (const gate of gates) {
        const open = !!next.gateStates?.[gate.index];
        if (open && gate.lastOpen !== true) gate.openStartedAt = t;
        gate.lastOpen = open;
        gate.barrier.position.y = open ? .42 : 0;
        gate.barrier.scale.y = open ? .16 : 1;
        gate.fan.rotation.z = reducedMotion ? 0 : t * (open ? 1.5 : 5);
        gate.lamp.scale.y = open ? .065 : .03; gate.airflow.visible = open;
        const warning = open && t - gate.openStartedAt > finite(gate.definition.openSeconds, 3) - 1;
        gate.lamp.material = warning ? warningLamp : open ? glow : closedLamp;
        gate.lamp.scale.x = warning && !reducedMotion ? .12 + Math.sin(t * 9) * .025 : .12;
      }
      const now = performance.now(), interval = previousFrameTime ? now - previousFrameTime : 0; previousFrameTime = now;
      const visualDt = clamp(finite(dt, 0), 0, .08);
      updateEffects(next, visualDt); updateCompression(next, visualDt);
      const start = performance.now(); renderer.render(scene, camera); const renderMs = performance.now() - start;
      frame++;
      if (frame > 30 && interval > 0 && interval < 250) { frameTimes.push(interval); renderTimes.push(renderMs); if (frameTimes.length > 240) { frameTimes.shift(); renderTimes.shift(); } }
      const info = renderer.info;
      peaks.calls = Math.max(peaks.calls, info.render.calls); peaks.triangles = Math.max(peaks.triangles, info.render.triangles);
      peaks.geometries = Math.max(peaks.geometries, info.memory.geometries); peaks.textures = Math.max(peaks.textures, info.memory.textures);
      if (!ready || pendingRestored) {
        const restored = pendingRestored; ready = true; pendingRestored = false;
        status(restored ? 'restored' : 'ready', { stageId: next.stage.id, frame, width: renderer.domElement.clientWidth, height: renderer.domElement.clientHeight });
        if (resolveRecovery) { resolveRecovery(true); resolveRecovery = null; clearTimeout(recoveryTimer); recoveryTimer = null; }
      }
    } catch (error) { renderFailed = true; ready = false; cancelPointer(); status('error', { message: String(error?.message || error), stageId: next?.stage?.id }); }
  }

  function summary(samples) {
    if (!samples.length) return { samples: 0, averageMs: null, p95Ms: null };
    const sorted = [...samples].sort((a, b) => a - b);
    return { samples: samples.length, averageMs: samples.reduce((sum, n) => sum + n, 0) / samples.length, p95Ms: sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * .95) - 1)] };
  }

  function getMetrics() {
    const info = renderer?.info;
    return { revision: THREE.REVISION, ready, disposed, renderFailed, contextLost: lost, recoveryAttempted, stageId: state?.stage?.id ?? null,
      frames: frame, warmupFrames: 30, frameSamples: summary(frameTimes), renderSamples: summary(renderTimes),
      calls: info?.render.calls ?? 0, triangles: info?.render.triangles ?? 0, geometries: info?.memory.geometries ?? 0,
      textures: info?.memory.textures ?? 0, ownedGeometries: geometries.size, ownedMaterials: materials.size,
      ownedTextures: textures.size,
      particles: particles.filter(p => p.active).length, particleLimit: PARTICLE_LIMIT, peaks: { ...peaks },
      pixelRatio: renderer?.getPixelRatio() || 0, buffer: renderer ? { width: renderer.domElement.width, height: renderer.domElement.height } : null,
      viewport: renderer ? { width: renderer.domElement.clientWidth, height: renderer.domElement.clientHeight } : null,
      renderer: renderer?.getContext()?.getParameter(renderer.getContext().RENDERER) || null,
      scope: 'Actual active WebGL renderer counters and bounded render intervals; no physical-device FPS claim.' };
  }

  function recover() {
    if (disposed || !renderer) return Promise.resolve(false);
    if (!lost) return Promise.resolve(!renderFailed);
    if (recoveryAttempted) return Promise.resolve(false);
    recoveryAttempted = true;
    return new Promise(resolve => {
      resolveRecovery = resolve;
      recoveryTimer = setTimeout(() => { if (resolveRecovery) { resolveRecovery(false); resolveRecovery = null; } status('error', { message: 'WebGL restoration did not complete. Re-enter the stage to retry safely.' }); }, 3500);
      try { renderer.forceContextRestore(); } catch (error) { clearTimeout(recoveryTimer); recoveryTimer = null; resolveRecovery = null; resolve(false); status('error', { message: String(error?.message || error) }); }
    });
  }

  function dispose() {
    if (disposed) return;
    cancelPointer(); disposed = true;
    resizeObserver?.disconnect(); listeners.splice(0).forEach(remove => remove());
    if (recoveryTimer) clearTimeout(recoveryTimer); if (resolveRecovery) resolveRecovery(false);
    resolveRecovery = null; recoveryTimer = null;
    particles.forEach(p => { p.active = false; }); seenEvents.clear(); initialPiles.clear();
    for (const geometry of geometries) geometry.dispose();
    for (const material of materials) material.dispose();
    for (const texture of textures) texture.dispose();
    scene?.traverse(object => {
      if (object.isInstancedMesh) object.dispose();
      if (object.isLight && object.shadow) {
        if (object.shadow.dispose) object.shadow.dispose();
        else { object.shadow.map?.dispose(); object.shadow.mapPass?.dispose(); }
      }
    });
    geometries.clear(); materials.clear(); textures.clear(); stageGeometries.clear();
    scene?.clear(); renderer?.renderLists.dispose(); renderer?.dispose(); renderer?.forceContextLoss(); renderer?.domElement.remove();
    state = null; stageGroup = null; ready = false;
  }

  let resizeObserver;
  const api = { render, resize, getMetrics, recover, dispose };
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const canvas = renderer.domElement; canvas.dataset.dustwakeRenderer = 'three-r180'; canvas.setAttribute('aria-hidden', 'true');
    canvas.style.display = 'block'; canvas.style.width = '100%'; canvas.style.height = '100%'; canvas.style.touchAction = 'none';
    container.appendChild(canvas);
    scene = new THREE.Scene(); scene.background = new THREE.Color(WARM.sky);
    camera = new THREE.OrthographicCamera(-6, 6, 5, -5, .1, 70);
    const hemi = new THREE.HemisphereLight(0xe4f7ff, 0x536445, 2.5); scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffe2b3, 3.1); key.position.set(-2, 12, 8); key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024); key.shadow.camera.left = -8; key.shadow.camera.right = 8;
    key.shadow.camera.top = 8; key.shadow.camera.bottom = -8; key.shadow.camera.near = .1; key.shadow.camera.far = 30;
    key.shadow.bias = -.0008; key.shadow.normalBias = .035; key.target.position.set(4.5, 0, 3.5); scene.add(key, key.target);
    block = keepGeometry(chamferedCube());
    const indexedBox = new THREE.BoxGeometry(1, 1, 1);
    plain = keepGeometry(indexedBox.toNonIndexed()); indexedBox.dispose();
    matte = keepMaterial(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .82, metalness: .03 }));
    glossy = keepMaterial(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .38, metalness: .15 }));
    bronze = keepMaterial(new THREE.MeshStandardMaterial({ color: 0xb89b5e, roughness: .5, metalness: .35 }));
    glow = keepMaterial(new THREE.MeshStandardMaterial({ color: 0xbef2ad, emissive: 0x4ba04f, emissiveIntensity: .45, roughness: .45 }));
    closedLamp = keepMaterial(new THREE.MeshStandardMaterial({ color: 0xe9a58f, emissive: 0xa34829, emissiveIntensity: .45, roughness: .45 }));
    warningLamp = keepMaterial(new THREE.MeshStandardMaterial({ color: 0xffda8b, emissive: 0xca8e2d, emissiveIntensity: .45, roughness: .45 }));
    numberMaterial = makeNumberAtlas();
    ringMaterial = keepMaterial(new THREE.MeshBasicMaterial({ color: 0xeff8c1, transparent: true, opacity: .78, depthWrite: false }));
    particleMaterial = keepMaterial(new THREE.MeshBasicMaterial({ vertexColors: true }));
    const floorMaterial = keepMaterial(new THREE.MeshStandardMaterial({ roughness: .92, metalness: 0 }));
    floor = new THREE.InstancedMesh(plain, floorMaterial, 80); floor.receiveShadow = true; floor.frustumCulled = false; scene.add(floor);
    const dryMaterial = keepMaterial(new THREE.MeshStandardMaterial({ roughness: .90, metalness: .03 }));
    const wetMaterial = keepMaterial(new THREE.MeshStandardMaterial({ roughness: .24, metalness: .20 }));
    dryDust = new THREE.InstancedMesh(block, dryMaterial, 256); wetDust = new THREE.InstancedMesh(block, wetMaterial, 192);
    for (const object of [dryDust, wetDust]) { object.castShadow = true; object.receiveShadow = true; object.frustumCulled = false; object.count = 0; scene.add(object); }
    specks = new THREE.InstancedMesh(plain, particleMaterial, PARTICLE_LIMIT); specks.count = 0; specks.frustumCulled = false; scene.add(specks);
    hero = makeTaro(); scene.add(hero.root);
    targetRing = mesh(keepGeometry(new THREE.TorusGeometry(.22, .025, 4, 28)), ringMaterial); targetRing.rotation.x = -Math.PI / 2;
    targetRing.castShadow = false; targetRing.receiveShadow = false; targetRing.visible = false;
    targetStem = mesh(plain, ringMaterial); targetStem.scale.set(.06, .025, .14); targetStem.visible = false; targetStem.castShadow = false;
    trail = mesh(plain, keepMaterial(new THREE.MeshBasicMaterial({ color: 0xf6f2c6, transparent: true, opacity: .32, depthWrite: false }))); trail.visible = false; trail.castShadow = false;
    listen(canvas, 'pointerdown', event => {
      if (event.target !== canvas || activePointer !== null || lost || renderFailed || state?.status !== 'playing' || event.button > 0) return;
      const p = pointFromEvent(event); if (!p) return;
      event.preventDefault(); activePointer = event.pointerId; lastPointer = p;
      canvas.setPointerCapture(event.pointerId); onPointer({ phase: 'down', ...p });
    }, { passive: false });
    listen(canvas, 'pointermove', event => {
      if (event.pointerId !== activePointer) return;
      const p = pointFromEvent(event, true); if (!p) return; event.preventDefault(); lastPointer = p; onPointer({ phase: 'move', ...p });
    }, { passive: false });
    listen(canvas, 'pointerup', event => {
      if (event.pointerId !== activePointer) return;
      const p = pointFromEvent(event, true) || lastPointer; activePointer = null;
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
      if (p) onPointer({ phase: 'up', ...p });
    });
    listen(canvas, 'pointercancel', cancelPointer); listen(canvas, 'lostpointercapture', cancelPointer); listen(globalThis, 'blur', cancelPointer);
    listen(canvas, 'webglcontextlost', event => { event.preventDefault(); lost = true; ready = false; cancelPointer(); status('contextlost', { stageId: state?.stage?.id }); });
    listen(canvas, 'webglcontextrestored', () => { lost = false; pendingRestored = true; resize(); if (state) render(state, 0); });
    if (typeof ResizeObserver !== 'undefined') { resizeObserver = new ResizeObserver(resize); resizeObserver.observe(container); }
    listen(globalThis, 'resize', resize); resize();
  } catch (error) {
    status('error', { message: String(error?.message || error), capability: 'WebGL2' });
    // Initialization failures still release every partially created owned resource.
    dispose();
  }
  return api;
}
