import * as THREE from "../animal-skyspire-drop/vendor/three/three.module.min.js";
import { BOARD_HEIGHT, BOARD_WIDTH } from "./cascade-core.js";

const GEM_COLORS = [0xe64254, 0x278bdc, 0xf0b829, 0x42a85e, 0x9c59c7];
const GATE_COLORS = [0xe64254, 0x278bdc, 0xf0b829, 0x42a85e, 0x9c59c7];
const PALETTE = {
  floor: 0x271845,
  tileA: 0x766096,
  tileB: 0x8b73a7,
  gold: 0xe6a93d,
  goldLight: 0xffd36d,
  wood: 0x75401e,
  woodLight: 0xc98239,
  chain: 0xd9e5ef,
  stone: 0x777582,
  stoneLight: 0xa7a5b2,
  seal: 0xf3d45c,
};

const radians = (degrees) => (degrees * Math.PI) / 180;

function polygonShape(points) {
  const shape = new THREE.Shape();
  points.forEach(([x, y], index) => {
    if (index === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  });
  shape.closePath();
  return shape;
}

function extrudedShape(points, depth = 0.12, bevel = 0.025) {
  const geometry = new THREE.ExtrudeGeometry(polygonShape(points), {
    depth,
    bevelEnabled: true,
    bevelSegments: 1,
    steps: 1,
    bevelSize: bevel,
    bevelThickness: bevel,
    curveSegments: 3,
  });
  geometry.rotateX(-Math.PI / 2);
  geometry.computeVertexNormals();
  return geometry;
}

function octagonPoints(radius, cut = 0.1) {
  return [
    [-radius + cut, -radius], [radius - cut, -radius], [radius, -radius + cut], [radius, radius - cut],
    [radius - cut, radius], [-radius + cut, radius], [-radius, radius - cut], [-radius, -radius + cut],
  ];
}

function starPoints(points, outer, inner, rotation = -Math.PI / 2) {
  return Array.from({ length: points * 2 }, (_, index) => {
    const radius = index % 2 ? inner : outer;
    const angle = rotation + (index * Math.PI) / points;
    return [Math.cos(angle) * radius, Math.sin(angle) * radius];
  });
}

function crystalGeometry(sideCount) {
  const positions = [];
  const indices = [];
  const rings = [
    { y: 0.37, radius: 0 },
    { y: 0.2, radius: 0.2 },
    { y: 0.02, radius: 0.34 },
    { y: -0.16, radius: 0.26 },
    { y: -0.32, radius: 0 },
  ];
  const ringOffsets = [];
  for (const [ringIndex, ring] of rings.entries()) {
    ringOffsets.push(positions.length / 3);
    if (ring.radius === 0) {
      positions.push(0, ring.y, 0);
      continue;
    }
    for (let side = 0; side < sideCount; side += 1) {
      const angle = (side / sideCount) * Math.PI * 2 + (ringIndex % 2 ? 0.14 : 0);
      positions.push(Math.cos(angle) * ring.radius, ring.y, Math.sin(angle) * ring.radius);
    }
  }
  const top = ringOffsets[0];
  const upper = ringOffsets[1];
  const middle = ringOffsets[2];
  const lower = ringOffsets[3];
  const bottom = ringOffsets[4];
  for (let side = 0; side < sideCount; side += 1) {
    const next = (side + 1) % sideCount;
    indices.push(top, upper + side, upper + next);
    indices.push(upper + side, middle + side, middle + next, upper + side, middle + next, upper + next);
    indices.push(middle + side, lower + side, lower + next, middle + side, lower + next, middle + next);
    indices.push(bottom, lower + next, lower + side);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function stoneGeometry() {
  const sides = 7;
  const vertices = [];
  const indices = [];
  const bottom = [];
  const top = [];
  for (let index = 0; index < sides; index += 1) {
    const angle = (index / sides) * Math.PI * 2 + 0.08;
    const radius = index % 2 ? 0.37 : 0.43;
    bottom.push([Math.cos(angle) * radius, 0.05 + (index % 3) * 0.018, Math.sin(angle) * radius]);
    top.push([Math.cos(angle) * radius * (index % 2 ? 0.92 : 1.04), 0.55 + (index % 3) * 0.035, Math.sin(angle) * radius * (index % 2 ? 0.92 : 1.04)]);
  }
  const bottomCenter = vertices.length / 3;
  vertices.push(0, 0.04, 0);
  const bottomStart = vertices.length / 3;
  bottom.forEach((point) => vertices.push(...point));
  const topStart = vertices.length / 3;
  top.forEach((point) => vertices.push(...point));
  const topCenter = vertices.length / 3;
  vertices.push(0, 0.63, 0);
  for (let index = 0; index < sides; index += 1) {
    const next = (index + 1) % sides;
    indices.push(bottomCenter, bottomStart + next, bottomStart + index);
    indices.push(topCenter, topStart + index, topStart + next);
    indices.push(bottomStart + index, bottomStart + next, topStart + next);
    indices.push(bottomStart + index, topStart + next, topStart + index);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function meshMaterial(color, options = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    metalness: options.metalness ?? 0.08,
    roughness: options.roughness ?? 0.52,
    flatShading: options.flatShading ?? false,
    transparent: options.transparent ?? false,
    opacity: options.opacity ?? 1,
    emissive: options.emissive ?? 0x000000,
    emissiveIntensity: options.emissiveIntensity ?? 0,
    side: options.side ?? THREE.FrontSide,
    depthWrite: options.depthWrite ?? true,
  });
}

export class CastleCascade3D {
  constructor(canvas, onCell, onFailure) {
    if (!canvas) throw new Error("Castle Cascade board canvas is missing.");
    if (!("WebGL2RenderingContext" in window)) throw new Error("WebGL 2 is not available in this browser.");
    this.canvas = canvas;
    this.onCell = onCell;
    this.onFailure = onFailure;
    this.owned = new Set();
    this.instances = new Map();
    this.pointerDown = null;
    this.frameTimes = [];
    this.lastFrame = 0;
    this.disposed = false;
    this.lost = false;
    this.reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    try {
      this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "low-power" });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.02;
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x88cbe6);
      this.scene.fog = new THREE.Fog(0x9bd7e8, 17, 32);
      this.camera = new THREE.OrthographicCamera(-5.5, 5.5, 5.5, -5.5, 0.1, 50);
      this.camera.position.set(0, 14, 12);
      this.camera.lookAt(0, 0, 0);
      this.scene.add(new THREE.HemisphereLight(0xd8f4ff, 0x493553, 1.45));
      const sun = new THREE.DirectionalLight(0xffe4b5, 2.2);
      sun.position.set(-5, 12, 8);
      this.scene.add(sun);
      const rim = new THREE.DirectionalLight(0x73d7ff, 1.1);
      rim.position.set(7, 8, -7);
      this.scene.add(rim);

      this.buildEnvironment();
      this.buildBoardInstances();
      this.buildHighlights();
      this.installInput();
      this.installResize();
      this.resize();
      this.board = null;
      this.statsSnapshot = {};
      this.raf = requestAnimationFrame((time) => this.frame(time));
      canvas.dataset.renderer = "three-r180-webgl2";
    } catch (error) {
      this.dispose();
      throw error;
    }
  }

  own(resource) {
    this.owned.add(resource);
    return resource;
  }

  material(color, options) {
    return this.own(meshMaterial(color, options));
  }

  geometry(resource) {
    return this.own(resource);
  }

  staticMesh(geometry, material, position, scale = [1, 1, 1], rotation = [0, 0, 0]) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.scale.set(...scale);
    mesh.rotation.set(...rotation);
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    this.scene.add(mesh);
    return mesh;
  }

  buildEnvironment() {
    const floorGeo = this.geometry(extrudedShape(octagonPoints(5.25, 0.22), 0.38, 0.08));
    const floorMat = this.material(PALETTE.floor, { metalness: 0.12, roughness: 0.72 });
    this.staticMesh(floorGeo, floorMat, [0, -0.45, 0]);

    const trimGeo = this.geometry(extrudedShape(octagonPoints(5.02, 0.24), 0.14, 0.04));
    const trimMat = this.material(PALETTE.gold, { metalness: 0.55, roughness: 0.34 });
    this.staticMesh(trimGeo, trimMat, [0, -0.06, 0]);

    const baseGeo = this.geometry(extrudedShape(octagonPoints(4.82, 0.2), 0.16, 0.025));
    const baseMat = this.material(0x4f3b69, { roughness: 0.58 });
    this.staticMesh(baseGeo, baseMat, [0, 0.01, 0]);

    const wallGeo = this.geometry(new THREE.BoxGeometry(7.4, 1.1, 0.46));
    const towerGeo = this.geometry(extrudedShape(octagonPoints(0.46, 0.12), 1.5, 0.06));
    const wallMat = this.material(0xc18da9, { roughness: 0.76 });
    const trimWall = this.material(0x6e466f, { metalness: 0.08, roughness: 0.7 });
    this.staticMesh(wallGeo, wallMat, [0, 0.42, -5.2]);
    this.staticMesh(towerGeo, wallMat, [-4.0, 0.12, -5.0], [1.1, 1, 1]);
    this.staticMesh(towerGeo, wallMat, [4.0, 0.12, -5.0], [1.1, 1, 1]);

    const battlementGeo = this.geometry(new THREE.BoxGeometry(0.42, 0.5, 0.52));
    for (let index = 0; index < 9; index += 1) {
      const x = -3.4 + index * 0.85;
      this.staticMesh(battlementGeo, trimWall, [x, 1.2, -5.2]);
    }
    const archGeo = this.geometry(new THREE.TorusGeometry(0.86, 0.15, 8, 28, Math.PI));
    this.staticMesh(archGeo, trimMat, [0, 0.94, -4.98]);
    const archLegGeo = this.geometry(new THREE.BoxGeometry(0.28, 0.82, 0.34));
    this.staticMesh(archLegGeo, trimMat, [-0.86, 0.42, -4.98]);
    this.staticMesh(archLegGeo, trimMat, [0.86, 0.42, -4.98]);

    const columnGeo = this.geometry(extrudedShape(octagonPoints(0.16, 0.04), 0.8, 0.02));
    for (const x of [-4.25, 4.25]) this.staticMesh(columnGeo, trimWall, [x, 0.02, -4.65]);
  }

  addInstance(name, geometry, material, maxCount = 120) {
    const mesh = new THREE.InstancedMesh(geometry, material, maxCount);
    mesh.count = 0;
    mesh.frustumCulled = false;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.scene.add(mesh);
    this.instances.set(name, { mesh, count: 0 });
    return mesh;
  }

  buildBoardInstances() {
    const tileGeo = this.geometry(extrudedShape(octagonPoints(0.465, 0.09), 0.2, 0.035));
    const tileMat = this.material(0xffffff, { metalness: 0.08, roughness: 0.54 });
    const tiles = this.addInstance("tiles", tileGeo, tileMat, BOARD_WIDTH * BOARD_HEIGHT);

    this.gemGeometries = Array.from({ length: 5 }, (_, index) => this.geometry(crystalGeometry(5 + index)));
    this.gemMeshes = this.gemGeometries.map((geometry, index) => {
      const material = this.material(GEM_COLORS[index], {
        metalness: 0.24,
        roughness: 0.19,
        flatShading: true,
        emissive: GEM_COLORS[index],
        emissiveIntensity: 0.035,
      });
      return this.addInstance(`gem-${index}`, geometry, material, BOARD_WIDTH * BOARD_HEIGHT);
    });

    this.powerGeometries = {
      arrowH: this.geometry(extrudedShape([[-0.38, -0.11], [0.09, -0.11], [0.09, -0.25], [0.43, 0], [0.09, 0.25], [0.09, 0.11], [-0.38, 0.11]], 0.12, 0.02)),
      arrowV: this.geometry(extrudedShape([[-0.38, -0.11], [0.09, -0.11], [0.09, -0.25], [0.43, 0], [0.09, 0.25], [0.09, 0.11], [-0.38, 0.11]], 0.12, 0.02)),
      bomb: this.geometry(extrudedShape(starPoints(6, 0.36, 0.23), 0.15, 0.025)),
      bird: this.geometry(extrudedShape([[-0.38, 0.14], [-0.11, -0.08], [0, 0.08], [0.11, -0.08], [0.38, 0.14], [0.08, 0.03], [0, 0.24], [-0.08, 0.03]], 0.13, 0.02)),
      prism: this.geometry(extrudedShape(starPoints(8, 0.39, 0.2), 0.14, 0.025)),
    };
    const powerMaterials = {
      arrowH: this.material(0xffefb1, { metalness: 0.55, roughness: 0.22, emissive: 0xffcf45, emissiveIntensity: 0.12 }),
      arrowV: this.material(0xffefb1, { metalness: 0.55, roughness: 0.22, emissive: 0xffcf45, emissiveIntensity: 0.12 }),
      bomb: this.material(0xff7548, { metalness: 0.35, roughness: 0.26, emissive: 0x8f2611, emissiveIntensity: 0.12 }),
      bird: this.material(0x78f0d5, { metalness: 0.38, roughness: 0.22, emissive: 0x087866, emissiveIntensity: 0.12 }),
      prism: this.material(0xffffff, { metalness: 0.42, roughness: 0.2, emissive: 0x7852bb, emissiveIntensity: 0.18 }),
    };
    this.powerMeshes = Object.fromEntries(Object.entries(this.powerGeometries).map(([name, geometry]) => [
      name,
      this.addInstance(`power-${name}`, geometry, powerMaterials[name], BOARD_WIDTH * BOARD_HEIGHT),
    ]));

    this.buildBlockerInstances();

    const boardCell = new THREE.Object3D();
    for (let index = 0; index < BOARD_WIDTH * BOARD_HEIGHT; index += 1) {
      const row = Math.floor(index / BOARD_WIDTH);
      const col = index % BOARD_WIDTH;
      boardCell.position.set(col - 4, 0.08, row - 4);
      boardCell.rotation.set(0, (row + col) % 2 ? radians(22.5) : 0, 0);
      boardCell.updateMatrix();
      tiles.setMatrixAt(index, boardCell.matrix);
      tiles.setColorAt(index, new THREE.Color((row + col) % 2 ? PALETTE.tileA : PALETTE.tileB));
    }
    tiles.count = BOARD_WIDTH * BOARD_HEIGHT;
    tiles.instanceMatrix.needsUpdate = true;
    if (tiles.instanceColor) tiles.instanceColor.needsUpdate = true;
  }

  buildBlockerInstances() {
    const crateBase = this.geometry(extrudedShape(octagonPoints(0.39, 0.08), 0.66, 0.025));
    const plankGeo = this.geometry(new THREE.BoxGeometry(0.64, 0.1, 0.12));
    this.addInstance("crate-base", crateBase, this.material(PALETTE.wood, { roughness: 0.75 }), 81);
    this.addInstance("crate-plank-a", plankGeo, this.material(PALETTE.woodLight, { roughness: 0.7 }), 81);
    this.addInstance("crate-plank-b", plankGeo, this.material(0x9d5c2a, { roughness: 0.75 }), 81);

    const chainGeo = this.geometry(new THREE.TorusGeometry(0.19, 0.045, 7, 14));
    const chainMat = this.material(PALETTE.chain, { metalness: 0.78, roughness: 0.26 });
    this.addInstance("chain-a", chainGeo, chainMat, 81);
    this.addInstance("chain-b", chainGeo, chainMat, 81);

    const keyRing = this.geometry(new THREE.TorusGeometry(0.14, 0.04, 7, 16));
    const keyShaft = this.geometry(new THREE.BoxGeometry(0.38, 0.07, 0.08));
    const keyMat = this.material(PALETTE.goldLight, { metalness: 0.72, roughness: 0.2, emissive: 0x6b430d, emissiveIntensity: 0.08 });
    this.addInstance("key-ring", keyRing, keyMat, 81);
    this.addInstance("key-shaft", keyShaft, keyMat, 81);

    const gateGeo = this.geometry(extrudedShape([[-0.37, -0.35], [-0.37, 0.17], [-0.25, 0.34], [-0.1, 0.42], [0.1, 0.42], [0.25, 0.34], [0.37, 0.17], [0.37, -0.35], [0.23, -0.35], [0.23, 0.16], [0.13, 0.27], [-0.13, 0.27], [-0.23, 0.16], [-0.23, -0.35]], 0.1, 0.02));
    this.gateMeshes = GATE_COLORS.map((color, index) => this.addInstance(
      `gate-${index}`,
      gateGeo,
      this.material(color, { metalness: 0.32, roughness: 0.3, emissive: color, emissiveIntensity: 0.05 }),
      81,
    ));

    const stoneGeo = this.geometry(stoneGeometry());
    this.addInstance("stone", stoneGeo, this.material(PALETTE.stone, { roughness: 0.83, flatShading: true }), 81);
    this.addInstance("stone-crack", this.geometry(new THREE.BoxGeometry(0.38, 0.035, 0.055)), this.material(0x393747, { roughness: 0.8 }), 81);

    const sealGeo = this.geometry(extrudedShape(starPoints(6, 0.36, 0.24), 0.15, 0.025));
    this.addInstance("seal", sealGeo, this.material(PALETTE.seal, { metalness: 0.55, roughness: 0.22, emissive: 0xa36f08, emissiveIntensity: 0.08 }), 81);

    const exitGeo = this.geometry(new THREE.TorusGeometry(0.36, 0.06, 8, 24));
    this.addInstance("exit", exitGeo, this.material(0x75dfff, { metalness: 0.45, roughness: 0.23, emissive: 0x186d9a, emissiveIntensity: 0.12 }), 81);
  }

  buildHighlights() {
    const ringGeo = this.geometry(new THREE.TorusGeometry(0.44, 0.035, 8, 32));
    this.selectedRing = this.staticMesh(ringGeo, this.material(0xffdc58, { metalness: 0.22, roughness: 0.3, emissive: 0x9e5b0b, emissiveIntensity: 0.15 }), [0, 0.68, 0], [1, 1, 1], [Math.PI / 2, 0, 0]);
    this.selectedRing.visible = false;
    this.focusRing = this.staticMesh(ringGeo, this.material(0xffffff, { metalness: 0.12, roughness: 0.35, emissive: 0x537da0, emissiveIntensity: 0.15 }), [0, 0.72, 0], [1, 1, 1], [Math.PI / 2, 0, 0]);
    this.focusRing.visible = false;
  }

  installInput() {
    this.handlePointerDown = (event) => {
      if (event.button !== undefined && event.button !== 0) return;
      this.pointerDown = { id: event.pointerId, x: event.clientX, y: event.clientY };
      this.canvas.setPointerCapture?.(event.pointerId);
    };
    this.handlePointerUp = (event) => {
      const down = this.pointerDown;
      this.pointerDown = null;
      if (!down || down.id !== event.pointerId || this.disposed || this.lost) return;
      if (Math.hypot(event.clientX - down.x, event.clientY - down.y) > 14) return;
      const index = this.indexAt(event.clientX, event.clientY);
      if (index >= 0) this.onCell?.(index);
    };
    this.handlePointerCancel = () => { this.pointerDown = null; };
    this.handleContextLost = (event) => {
      event.preventDefault();
      this.lost = true;
      this.onFailure?.("context-lost");
    };
    this.canvas.addEventListener("pointerdown", this.handlePointerDown);
    this.canvas.addEventListener("pointerup", this.handlePointerUp);
    this.canvas.addEventListener("pointercancel", this.handlePointerCancel);
    this.canvas.addEventListener("webglcontextlost", this.handleContextLost);
  }

  installResize() {
    if ("ResizeObserver" in window) {
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(this.canvas);
    } else {
      this.handleWindowResize = () => this.resize();
      window.addEventListener("resize", this.handleWindowResize);
    }
  }

  resize() {
    if (this.disposed || this.lost) return;
    const rect = this.canvas.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    if (!width || !height) return;
    if (width !== this.width || height !== this.height) {
      this.width = width;
      this.height = height;
      this.renderer.setSize(width, height, false);
      const aspect = width / height;
      const halfHeight = Math.max(6.2, 5.7 / aspect);
      const halfWidth = halfHeight * aspect;
      this.camera.left = -halfWidth;
      this.camera.right = halfWidth;
      this.camera.top = halfHeight;
      this.camera.bottom = -halfHeight;
      this.camera.updateProjectionMatrix();
    }
  }

  indexAt(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return -1;
    this.pointer = this.pointer || new THREE.Vector2();
    this.raycaster = this.raycaster || new THREE.Raycaster();
    this.hitPlane = this.hitPlane || new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.18);
    this.hitPoint = this.hitPoint || new THREE.Vector3();
    this.pointer.set(((clientX - rect.left) / rect.width) * 2 - 1, -(((clientY - rect.top) / rect.height) * 2 - 1));
    this.raycaster.setFromCamera(this.pointer, this.camera);
    if (!this.raycaster.ray.intersectPlane(this.hitPlane, this.hitPoint)) return -1;
    const col = Math.floor(this.hitPoint.x + BOARD_WIDTH / 2);
    const row = Math.floor(this.hitPoint.z + BOARD_HEIGHT / 2);
    if (row < 0 || row >= BOARD_HEIGHT || col < 0 || col >= BOARD_WIDTH) return -1;
    return row * BOARD_WIDTH + col;
  }

  setInstance(name, position, scale = [1, 1, 1], rotation = [0, 0, 0], color) {
    const entry = this.instances.get(name);
    if (!entry || entry.count >= entry.mesh.instanceMatrix.count) return;
    const transform = this.transform || (this.transform = new THREE.Object3D());
    transform.position.set(...position);
    transform.scale.set(...scale);
    transform.rotation.set(...rotation);
    transform.updateMatrix();
    entry.mesh.setMatrixAt(entry.count, transform.matrix);
    if (color !== undefined) entry.mesh.setColorAt(entry.count, new THREE.Color(color));
    entry.count += 1;
  }

  resetInstances() {
    for (const entry of this.instances.values()) entry.count = 0;
  }

  commitInstances() {
    for (const entry of this.instances.values()) {
      entry.mesh.count = entry.count;
      entry.mesh.instanceMatrix.needsUpdate = true;
      if (entry.mesh.instanceColor) entry.mesh.instanceColor.needsUpdate = true;
      entry.mesh.computeBoundingSphere();
    }
  }

  setBoard(board, selectedIndex = -1, focusIndex = -1, highlights = []) {
    if (this.disposed || this.lost) return;
    this.board = board;
    this.resetInstances();

    board.forEach((tile, index) => {
      const row = Math.floor(index / BOARD_WIDTH);
      const col = index % BOARD_WIDTH;
      const x = col - 4;
      const z = row - 4;
      const y = 0.22;
      if (tile.c !== null && tile.c >= 0 && tile.c < this.gemMeshes.length) {
        this.setInstance(`gem-${tile.c}`, [x, y + (tile.gate || tile.stone ? -0.06 : 0.11), z], [0.78, 0.78, 0.78]);
      }
      if (tile.p && this.powerMeshes[tile.p]) {
        this.setInstance(`power-${tile.p}`, [x, y + 0.55, z], [0.74, 0.74, 0.74], tile.p === "arrowV" ? [0, Math.PI / 2, 0] : [0, 0, 0]);
      }
      if (tile.box) {
        this.setInstance("crate-base", [x, y + 0.14, z], [1, 1, 1]);
        this.setInstance("crate-plank-a", [x, y + 0.13, z], [1, 1, 1], [0, radians(34), 0]);
        this.setInstance("crate-plank-b", [x, y + 0.13, z], [1, 1, 1], [0, radians(-34), 0]);
      }
      if (tile.chain) {
        this.setInstance("chain-a", [x - 0.15, y + 0.32, z], [1, 1, 1], [Math.PI / 2, 0, radians(26)]);
        this.setInstance("chain-b", [x + 0.15, y + 0.32, z], [1, 1, 1], [Math.PI / 2, 0, radians(-26)]);
      }
      if (tile.key) {
        this.setInstance("key-ring", [x - 0.11, y + 0.48, z], [1, 1, 1], [Math.PI / 2, 0, 0]);
        this.setInstance("key-shaft", [x + 0.15, y + 0.48, z], [1, 1, 1], [0, radians(-18), 0]);
      }
      if (tile.exit) this.setInstance("exit", [x, y + 0.08, z], [1, 1, 1], [Math.PI / 2, 0, 0]);
      if (tile.gate) this.setInstance(`gate-${tile.gateColor}`, [x, y + 0.48, z], [1, 1, 1]);
      if (tile.stone) {
        this.setInstance("stone", [x, y + 0.18, z], [1, tile.stone > 1 ? 1 : 0.76, 1]);
        if (tile.stone === 1) this.setInstance("stone-crack", [x + 0.05, y + 0.57, z + 0.02], [1, 1, 1], [0, radians(28), radians(-16)]);
      }
      if (tile.seal) this.setInstance("seal", [x, y + 0.48, z], [0.88, 0.88, 0.88]);
    });

    this.commitInstances();
    this.selectedRing.visible = selectedIndex >= 0;
    if (selectedIndex >= 0) this.moveRing(this.selectedRing, selectedIndex, 0.72);
    this.focusRing.visible = focusIndex >= 0 && focusIndex !== selectedIndex;
    if (this.focusRing.visible) this.moveRing(this.focusRing, focusIndex, 0.76);
    this.highlightCells = new Set(highlights);
    this.statsSnapshot = this.stats();
  }

  moveRing(ring, index, height) {
    const row = Math.floor(index / BOARD_WIDTH);
    const col = index % BOARD_WIDTH;
    ring.position.set(col - 4, height, row - 4);
  }

  stats() {
    const rendererInfo = this.renderer?.info;
    return {
      renderer: this.canvas?.dataset.renderer || "released",
      revision: THREE.REVISION,
      geometries: rendererInfo?.memory?.geometries ?? 0,
      textures: rendererInfo?.memory?.textures ?? 0,
      drawCalls: rendererInfo?.render?.calls ?? 0,
      triangles: rendererInfo?.render?.triangles ?? 0,
      instanceMeshes: this.instances.size,
      instances: [...this.instances.values()].reduce((sum, entry) => sum + entry.count, 0),
      pixelRatio: this.renderer?.getPixelRatio?.() ?? 0,
      averageFrameMs: this.frameTimes.length ? this.frameTimes.reduce((sum, value) => sum + value, 0) / this.frameTimes.length : 0,
      reducedMotion: this.reducedMotion,
    };
  }

  frame(time) {
    if (this.disposed) return;
    if (this.lastFrame) {
      this.frameTimes.push(Math.min(250, time - this.lastFrame));
      if (this.frameTimes.length > 120) this.frameTimes.shift();
    }
    this.lastFrame = time;
    if (!this.lost) {
      this.resize();
      this.renderer.render(this.scene, this.camera);
      const stats = this.stats();
      this.canvas.dataset.drawCalls = String(stats.drawCalls);
      this.canvas.dataset.triangles = String(stats.triangles);
      this.canvas.dataset.geometryCount = String(stats.geometries);
      this.canvas.dataset.textureCount = String(stats.textures);
      this.canvas.dataset.averageFrameMs = stats.averageFrameMs.toFixed(2);
    }
    this.raf = requestAnimationFrame((nextTime) => this.frame(nextTime));
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.resizeObserver?.disconnect();
    if (this.handleWindowResize) window.removeEventListener("resize", this.handleWindowResize);
    this.canvas?.removeEventListener("pointerdown", this.handlePointerDown);
    this.canvas?.removeEventListener("pointerup", this.handlePointerUp);
    this.canvas?.removeEventListener("pointercancel", this.handlePointerCancel);
    this.canvas?.removeEventListener("webglcontextlost", this.handleContextLost);
    this.scene?.clear();
    for (const resource of this.owned) resource.dispose?.();
    this.owned.clear();
    this.instances.clear();
    this.renderer?.dispose();
    this.renderer?.forceContextLoss();
    if (this.canvas) this.canvas.dataset.renderer = "released";
  }
}
