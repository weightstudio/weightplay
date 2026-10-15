import * as THREE from "./vendor/three/three.module.min.js";

const heading = { up: 0, right: -Math.PI / 2, down: Math.PI, left: Math.PI / 2 };
const point = (cell) => new THREE.Vector3(cell % 10 - 4.5, 0, Math.floor(cell / 10) - 4.5);
const notice = {
  en: "3D view unavailable. The grid and controls still work.",
  "zh-Hant": "3D 畫面暫時無法使用，棋盤與控制仍可操作。",
  "zh-Hans": "3D 画面暂时无法使用，棋盘与控制仍可操作。",
  ja: "3D 表示は利用できません。盤面と操作は引き続き使えます。",
  ko: "3D 화면을 사용할 수 없습니다. 보드와 조작은 계속 작동합니다.",
  es: "La vista 3D no está disponible. El tablero y los controles siguen funcionando.",
  "pt-BR": "A visão 3D está indisponível. O tabuleiro e os controles continuam funcionando.",
  fr: "La vue 3D est indisponible. Le plateau et les commandes fonctionnent toujours.",
  de: "Die 3D-Ansicht ist nicht verfügbar. Spielfeld und Steuerung funktionieren weiter.",
  it: "La vista 3D non è disponibile. Il tabellone e i comandi funzionano ancora.",
  ru: "Вид 3D недоступен. Поле и управление продолжают работать.",
  hi: "3D दृश्य उपलब्ध नहीं है। बोर्ड और नियंत्रण अभी भी काम करते हैं।",
  ar: "العرض ثلاثي الأبعاد غير متاح. لا تزال اللوحة وأزرار التحكم تعمل.",
};

function beveledCube() {
  const outline = new THREE.Shape();
  outline.moveTo(-.45, -.45);
  outline.lineTo(.45, -.45); outline.lineTo(.45, .45);
  outline.lineTo(-.45, .45); outline.closePath();
  const geometry = new THREE.ExtrudeGeometry(outline, {
    depth: .9, steps: 1, bevelEnabled: true, bevelSegments: 1,
    bevelSize: .05, bevelThickness: .05, curveSegments: 1,
  });
  geometry.rotateX(-Math.PI / 2); geometry.center();
  return geometry;
}

export class SnakeBoard3D {
  constructor(host) {
    this.host = host;
    this.owned = new Set(); this.abort = new AbortController();
    this.frame = 0; this.disposed = false; this.active = false; this.lost = false;
    this.reduced = matchMedia("(prefers-reduced-motion: reduce)");
    this.layer = document.createElement("div");
    this.layer.className = "snake-scene"; this.layer.setAttribute("aria-hidden", "true");
    this.canvas = document.createElement("canvas"); this.layer.append(this.canvas); host.append(this.layer);
    this.alert = document.createElement("p"); this.alert.className = "snake-render-notice";
    this.alert.setAttribute("role", "status"); this.alert.hidden = true; host.append(this.alert);
    try {
      this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true, powerPreference: "low-power" });
      this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.2;
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.scene = new THREE.Scene();
      this.camera = new THREE.OrthographicCamera(-5.9, 5.9, 5.9, -5.9, .1, 60);
      this.camera.position.set(0, 22, 3); this.camera.lookAt(0, 0, 0);
      this.build();
      document.body.dataset.snakeRenderer = "3d";
    } catch (error) {
      this.renderer?.dispose(); this.renderer = null;
      this.failure = String(error.message || error); this.degrade();
    }
    this.resize = new ResizeObserver(() => this.fit()); this.resize.observe(this.layer);
    this.sceneObserver = new MutationObserver(() => this.setActive());
    this.sceneObserver.observe(document.body, { attributes: true, attributeFilter: ["data-screen"] });
    const options = { signal: this.abort.signal };
    document.addEventListener("visibilitychange", () => this.setActive(), options);
    this.reduced.addEventListener("change", () => this.paint(performance.now()), options);
    this.canvas.addEventListener("webglcontextlost", (event) => {
      event.preventDefault(); this.lost = true; this.degrade();
    }, options);
    this.canvas.addEventListener("webglcontextrestored", () => {
      if (this.disposed) return;
      this.lost = false; this.alert.hidden = true; this.canvas.hidden = false;
      document.body.dataset.snakeRenderer = "3d"; this.setActive();
    }, options);
    window.addEventListener("pagehide", () => this.dispose(), { once: true, signal: this.abort.signal });
    this.fit();
  }

  own(resource) { this.owned.add(resource); return resource; }
  mesh(geometry, material, scale, position, parent = this.scene) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(...scale); mesh.position.set(...position);
    mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
  }

  build() {
    const cube = this.own(beveledCube());
    const box = this.own(new THREE.BoxGeometry(1, 1, 1));
    const eye = this.own(new THREE.SphereGeometry(1, 12, 8));
    const material = (color, extra = {}) => this.own(new THREE.MeshStandardMaterial({ color, roughness: .35, metalness: .15, ...extra }));
    const emerald = this.own(new THREE.MeshPhysicalMaterial({ color: 0x12a45a, roughness: .22, metalness: .2, clearcoat: 1, clearcoatRoughness: .18 }));
    const gold = material(0xe7b343, { metalness: .65, roughness: .25 });
    const stone = material(0x36455d, { roughness: .66 });
    const dark = material(0x111e31, { roughness: .65 });
    const sapphire = material(0x315ce3, { metalness: .3, roughness: .2 });
    const pupil = material(0x10201b, { metalness: 0 });
    const lightGreen = material(0x72ca59);
    const texture = this.own(new THREE.TextureLoader().load(new URL("./assets/observatory-stone-v33.png", import.meta.url).href,
      () => { clearTimeout(this.loadDeadline); if (this.disposed) texture.dispose(); else { this.textureLoaded = true; this.paint(performance.now()); } },
      undefined, () => { clearTimeout(this.loadDeadline); this.failure = "Stone texture load failed"; this.degrade(); }));
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(4, this.renderer.capabilities.getMaxAnisotropy());
    stone.map = texture; stone.needsUpdate = true;
    this.loadDeadline = setTimeout(() => { if (!this.textureLoaded && !this.disposed) { this.failure = "Stone texture load timed out"; this.degrade(); } }, 15000);
    this.scene.add(new THREE.HemisphereLight(0xaccfff, 0x10231a, 2.5));
    const sun = new THREE.DirectionalLight(0xffe4b2, 4.2); sun.position.set(-5, 12, 7);
    sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7 });
    sun.shadow.bias = -.0005; this.scene.add(sun); this.shadow = sun.shadow;
    const fill = new THREE.DirectionalLight(0x6faaff, 2); fill.position.set(6, 7, -5); this.scene.add(fill);
    this.mesh(cube, dark, [10.6, .3, 10.6], [0, -.2, 0]);
    const tiles = new THREE.InstancedMesh(box, stone, 100);
    const transform = new THREE.Object3D();
    for (let cell = 0; cell < 100; cell += 1) {
      transform.position.copy(point(cell)); transform.position.y = -.03;
      transform.scale.set(.97, .12, .97); transform.updateMatrix(); tiles.setMatrixAt(cell, transform.matrix);
    }
    tiles.receiveShadow = true; this.scene.add(tiles);
    for (const sign of [-1, 1]) {
      this.mesh(box, gold, [10.4, .045, .06], [0, .035, sign * 5.12]);
      this.mesh(box, gold, [.06, .045, 10.4], [sign * 5.12, .035, 0]);
    }
    this.body = new THREE.InstancedMesh(cube, emerald, 100);
    this.links = new THREE.InstancedMesh(box, gold, 100);
    this.body.castShadow = this.links.castShadow = true;
    this.body.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.links.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.scene.add(this.body, this.links);
    this.head = new THREE.Group(); this.scene.add(this.head);
    this.mesh(cube, emerald, [.95, .72, .95], [0, .46, 0], this.head);
    this.mesh(cube, lightGreen, [.72, .28, .32], [0, .32, -.48], this.head);
    this.mesh(box, gold, [.97, .73, .08], [0, .46, .34], this.head);
    for (const side of [-1, 1]) {
      this.mesh(eye, gold, [.17, .055, .2], [side * .22, .84, -.13], this.head);
      this.mesh(eye, pupil, [.07, .023, .13], [side * .22, .894, -.16], this.head);
      this.mesh(box, emerald, [.34, .07, .07], [side * .22, .89, .04], this.head);
      this.mesh(box, pupil, [.055, .02, .07], [side * .19, .47, -.55], this.head);
    }
    this.mesh(box, pupil, [.3, .025, .015], [0, .29, -.647], this.head);
    this.obstacles = new THREE.InstancedMesh(cube, sapphire, 2);
    this.pedestals = new THREE.InstancedMesh(cube, dark, 2);
    this.obstacleRims = new THREE.InstancedMesh(box, gold, 2);
    this.obstacles.castShadow = this.pedestals.castShadow = true;
    this.scene.add(this.obstacles, this.pedestals, this.obstacleRims);
    const star = new THREE.Shape();
    for (let index = 0; index < 10; index += 1) {
      const angle = index * Math.PI / 5 - Math.PI / 2, radius = index % 2 ? .2 : .47;
      const x = Math.cos(angle) * radius, y = Math.sin(angle) * radius;
      if (index) star.lineTo(x, y); else star.moveTo(x, y);
    }
    star.closePath();
    const starGeometry = this.own(new THREE.ExtrudeGeometry(star, { depth: .16, bevelEnabled: true, bevelSize: .045, bevelThickness: .045, bevelSegments: 1, steps: 1 }));
    starGeometry.rotateX(-Math.PI / 2); starGeometry.center();
    const starMaterial = material(0xffd34f, { emissive: 0x9c5d00, emissiveIntensity: .35, metalness: .5 });
    this.food = this.mesh(starGeometry, starMaterial, [1, 1, 1], [0, .4, 0]);
    this.transform = transform;
  }

  update(state, locale) {
    if (this.disposed) return;
    this.locale = locale; this.alert.textContent = notice[locale] || notice.en;
    const cells = [...state.trail];
    this.from = this.cells || cells; this.cells = cells; this.direction = state.direction;
    this.startedAt = performance.now(); this.foodChanged = this.foodCell !== state.foodCell;
    this.foodCell = state.foodCell; this.obstacleCells = [...state.obstacles];
    this.body && (this.body.count = this.links.count = Math.max(0, cells.length - 1));
    this.setActive();
  }

  fit() {
    if (this.disposed || !this.renderer) return;
    const box = this.layer.getBoundingClientRect();
    if (box.width < 1 || box.height < 1) return;
    if (Math.abs(box.width - (this.width || 0)) < .5 && Math.abs(box.height - (this.height || 0)) < .5) return;
    this.width = box.width; this.height = box.height;
    this.renderer.setSize(box.width, box.height, false);
    const aspect = box.width / box.height;
    this.camera.left = -5.9 * aspect; this.camera.right = 5.9 * aspect;
    this.camera.updateProjectionMatrix(); this.paint(performance.now());
  }

  setActive() {
    this.active = !this.disposed && !this.lost && !this.failure && document.body.dataset.screen === "battle" && !document.hidden;
    this.layer.classList.toggle("is-active", this.active);
    cancelAnimationFrame(this.frame); this.frame = 0;
    if (this.active) this.paint(performance.now());
  }

  degrade() {
    if (this.disposed) return;
    cancelAnimationFrame(this.frame); this.frame = 0; this.active = false;
    this.canvas.hidden = true; this.alert.hidden = false;
    this.alert.textContent = notice[this.locale] || notice.en;
    document.body.dataset.snakeRenderer = "fallback";
  }

  paint(now) {
    if (!this.renderer || !this.cells || !this.active || this.disposed) return;
    cancelAnimationFrame(this.frame); this.frame = 0;
    const progress = this.reduced.matches ? 1 : Math.min(1, Math.max(0, (now - this.startedAt) / 120));
    const eased = progress * progress * (3 - 2 * progress);
    const position = (index) => {
      const target = point(this.cells[index]), previous = point(this.from[index] ?? this.cells[index]);
      return previous.distanceTo(target) > 2 ? target : previous.lerp(target, eased);
    };
    this.head.position.copy(position(0)); this.head.rotation.y = heading[this.direction] || 0;
    const transform = this.transform;
    for (let index = 1; index < this.cells.length; index += 1) {
      const p = position(index), toward = point(this.cells[index - 1]).sub(point(this.cells[index]));
      const angle = Math.abs(toward.x) > 0 ? Math.PI / 2 : 0;
      transform.position.copy(p); transform.position.y = .39;
      transform.rotation.set(0, angle, 0); transform.scale.set(.84, .58, .84);
      transform.updateMatrix(); this.body.setMatrixAt(index - 1, transform.matrix);
      transform.scale.set(.86, .61, .085); transform.updateMatrix();
      this.links.setMatrixAt(index - 1, transform.matrix);
    }
    this.body.instanceMatrix.needsUpdate = this.links.instanceMatrix.needsUpdate = true;
    this.obstacles.count = this.pedestals.count = this.obstacleRims.count = this.obstacleCells.length;
    this.obstacleCells.forEach((cell, index) => {
      const p = point(cell); transform.rotation.set(0, 0, 0);
      for (const [mesh, scale, y] of [[this.pedestals, [.88, .24, .88], .2], [this.obstacleRims, [.85, .045, .85], .35], [this.obstacles, [.58, .5, .58], .62]]) {
        transform.position.copy(p); transform.position.y = y; transform.scale.set(...scale);
        transform.updateMatrix(); mesh.setMatrixAt(index, transform.matrix);
      }
    });
    for (const mesh of [this.obstacles, this.pedestals, this.obstacleRims]) mesh.instanceMatrix.needsUpdate = true;
    this.food.visible = this.foodCell >= 0;
    if (this.food.visible) {
      this.food.position.copy(point(this.foodCell)); this.food.position.y = .4;
      this.food.scale.setScalar(1 + (this.foodChanged && !this.reduced.matches ? .1 * Math.sin(progress * Math.PI) : 0));
    }
    this.renderer.render(this.scene, this.camera);
    if (progress < 1) this.frame = requestAnimationFrame((time) => this.paint(time));
  }

  diagnostics() {
    return { revision: THREE.REVISION, active: this.active, pendingFrame: Boolean(this.frame),
      textureLoaded: Boolean(this.textureLoaded), failure: this.failure || null, contextLost: this.lost,
      width: this.width || 0, height: this.height || 0,
      calls: this.renderer?.info.render.calls || 0, triangles: this.renderer?.info.render.triangles || 0,
      geometries: this.renderer?.info.memory.geometries || 0, textures: this.renderer?.info.memory.textures || 0 };
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true; this.active = false; cancelAnimationFrame(this.frame); clearTimeout(this.loadDeadline);
    this.abort.abort(); this.resize.disconnect(); this.sceneObserver.disconnect();
    for (const resource of this.owned) resource.dispose();
    this.owned.clear(); this.scene?.clear();
    this.shadow?.dispose(); this.renderer?.dispose(); this.renderer?.forceContextLoss();
    this.layer.remove(); this.alert.remove();
  }
}
