import * as THREE from './vendor/three/three.module.min.js';

// A projected 3D tile matches each semantic DOM cell. The model owns all rules.
const palettes = {
  daylight: { soil: 0x6c4931, rim: 0x98754a, empty: 0x3c5147, grass: 0x89b958, leaf: 0x4c954f, tip: 0xb1d96c, water: 0x3b97a5, flower: 0xf5cf79, light: 0xffeccb },
  twilight: { soil: 0x494055, rim: 0x746184, empty: 0x3e435d, grass: 0x708ea8, leaf: 0x6386b5, tip: 0xb7bfdc, water: 0x5b7cb9, flower: 0xffbcad, light: 0xe5d7ff },
  aurora: { soil: 0x274957, rim: 0x527b8b, empty: 0x304f65, grass: 0x71bbac, leaf: 0x59b9a7, tip: 0xa6efd5, water: 0x6b82bf, flower: 0xdaa8ef, light: 0xc7ffee },
};

export function createHabitatScene(host, grid, onFailure) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.replaceChildren(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-3, 3, 3, -3, 0.1, 100);
  camera.position.set(0, 20, 20);
  camera.lookAt(0, 0, 0);
  const hemisphere = new THREE.HemisphereLight(0xe4f4e6, 0x172d37, 1.35);
  scene.add(hemisphere);
  const sun = new THREE.DirectionalLight(0xffe5ba, 2.1);
  sun.position.set(-6, 10, 5); scene.add(sun);
  const fill = new THREE.DirectionalLight(0xb0e5ff, .55);
  fill.position.set(5, 4, -6); scene.add(fill);
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const materials = new Map();
  const tilesRoot = new THREE.Group(); scene.add(tilesRoot);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const tiles = [];
  let stage = null, board = [], theme = '', active = false, disposed = false, lost = false;
  let raf = 0, until = 0, previous = 0;
  function material(color) {
    if (!materials.has(color)) materials.set(color, new THREE.MeshStandardMaterial({ color, roughness: .86, metalness: 0 }));
    return materials.get(color);
  }
  function box(parent, color, x, y, z, w, h, d) {
    const mesh = new THREE.Mesh(geometry, material(color));
    mesh.position.set(x, y, z); mesh.scale.set(w, h, d); parent.add(mesh); return mesh;
  }
  function plant(parent, kind, p) {
    const crown = new THREE.Group(); parent.add(crown);
    crown.rotation.y = Math.PI / 7;
    crown.position.z = .12;
    crown.scale.setScalar(.82);
    if (kind === 0) {
      box(crown, 0x815b3c, 0, .18, 0, .12, .37, .12);
      box(crown, p.leaf, 0, .36, 0, .50, .24, .46);
      box(crown, p.tip, -.10, .52, -.04, .32, .16, .32);
      box(crown, p.grass, .20, .31, .06, .23, .18, .26);
    } else if (kind === 1) {
      box(crown, p.leaf, -.14, .06, .10, .35, .07, .28);
      box(crown, p.tip, .10, .10, -.10, .32, .08, .30);
      box(crown, p.flower, .12, .19, -.09, .16, .14, .16);
      box(crown, p.flower, -.23, .12, .16, .10, .09, .10);
    } else {
      [-.20, .08, .23].forEach((x, i) => {
        const z = i % 2 ? .14 : -.07;
        box(crown, p.leaf, x, .13, z, .045, .26 + i * .03, .045);
        box(crown, i === 1 ? p.tip : p.flower, x, .28 + i * .03, z, .16, .09, .16);
      });
    }
    return crown;
  }
  function build(nextStage, nextTheme) {
    stage = nextStage; theme = nextTheme;
    tilesRoot.clear(); tiles.length = 0;
    for (const value of materials.values()) value.dispose();
    materials.clear();
    const p = palettes[theme] || palettes.daylight;
    sun.color.setHex(p.light);
    stage.rows.forEach((_, r) => stage.columns.forEach((__, c) => {
      const index = r * stage.size + c;
      const group = new THREE.Group(); tilesRoot.add(group);
      const base = box(group, p.soil, 0, -.055, 0, .92, .10, .88);
      const top = box(group, p.empty, 0, .005, 0, .91, .025, .87);
      // Small fixed earth details make empty plots readable without mimicking plants.
      box(group, p.rim, -.29, .024, .28, .08, .018, .045);
      box(group, p.rim, .27, .024, -.25, .045, .018, .06);
      const growth = new THREE.Group(); group.add(growth);
      const turf = box(growth, stage.arc === 'pond' || stage.arc === 'crossing' ? p.water : p.grass, 0, .025, 0, .86, .055, .82);
      box(growth, p.empty, .035, .058, .15, .42, .006, .30);
      const flora = plant(growth, stage.arc === 'pond' ? 1 : (index + (stage.number / 5 | 0)) % 3, p);
      const stone = stage.stones.includes(index);
      if (stone) {
        growth.clear();
        box(growth, 0x83948d, 0, .13, 0, .63, .28, .60);
        box(growth, 0xb4b9a1, -.08, .33, -.08, .43, .13, .41);
        box(growth, 0x596d66, .24, .07, .20, .26, .17, .29);
      }
      growth.scale.y = stone ? 1 : .001;
      tiles.push({ group, base, top, turf, flora, growth, stone, value: stone ? 1 : 0, target: stone ? 1 : 0 });
    }));
    resize();
  }
  function resize() {
    if (disposed || lost) return;
    const rect = grid.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    renderer.setSize(Math.round(rect.width), Math.round(rect.height), false);
    const unit = 80;
    camera.left = -rect.width / (unit * 2); camera.right = -camera.left;
    camera.top = rect.height / (unit * 2); camera.bottom = -camera.top;
    camera.updateProjectionMatrix();
    const cells = grid.querySelectorAll('.cell');
    tiles.forEach((tile, index) => {
      const box = cells[index]?.getBoundingClientRect();
      if (!box) return;
      tile.group.position.set((box.x + box.width / 2 - rect.x - rect.width / 2) / unit, 0, (box.y + box.height / 2 - rect.y - rect.height / 2) / unit * Math.SQRT2);
      tile.group.scale.set(box.width / unit, box.width / unit * .70, box.height / unit * Math.SQRT2);
    });
    requestRender();
  }
  function render(now) {
    raf = 0;
    if (!active || disposed || lost || document.hidden) return;
    const dt = Math.min(.06, previous ? (now - previous) / 1000 : .016); previous = now;
    let moving = false;
    for (const tile of tiles) {
      tile.value = reduced.matches ? tile.target : THREE.MathUtils.damp(tile.value, tile.target, 19, dt);
      if (Math.abs(tile.value - tile.target) < .003) tile.value = tile.target;
      else moving = true;
      tile.growth.visible = tile.value > .002;
      tile.growth.scale.y = Math.max(.001, tile.value);
      tile.top.position.y = .005;
    }
    renderer.render(scene, camera);
    host.dataset.drawCalls = String(renderer.info.render.calls);
    host.dataset.triangles = String(renderer.info.render.triangles);
    host.dataset.engine = `three-r${THREE.REVISION}`;
    host.dataset.geometries = String(renderer.info.memory.geometries);
    host.dataset.textures = String(renderer.info.memory.textures);
    if (moving || now < until) raf = requestAnimationFrame(render);
  }
  function requestRender(duration = 0) {
    if (disposed || lost || !active || document.hidden) return;
    until = Math.max(until, performance.now() + (reduced.matches ? 0 : duration));
    if (!raf) raf = requestAnimationFrame(render);
  }
  function setActive(value) {
    if (!value && active && !lost && !disposed && !document.hidden) {
      tiles.forEach(tile => { tile.value = tile.target; tile.growth.visible = tile.value > 0; tile.growth.scale.y = Math.max(.001, tile.value); });
      renderer.render(scene, camera);
    }
    active = value;
    if (!value) { cancelAnimationFrame(raf); raf = 0; previous = 0; }
    else { resize(); requestRender(); }
  }
  function visibility() {
    if (document.hidden) { cancelAnimationFrame(raf); raf = 0; previous = 0; }
    else if (active) { tiles.forEach(tile => tile.value = tile.target); resize(); }
  }
  const observer = new ResizeObserver(resize); observer.observe(grid);
  document.addEventListener('visibilitychange', visibility);
  const contextLost = event => { event.preventDefault(); lost = true; cancelAnimationFrame(raf); raf = 0; onFailure(); };
  renderer.domElement.addEventListener('webglcontextlost', contextLost);
  return {
    update(nextStage, nextBoard, nextTheme) {
      if (disposed || lost) return;
      board = [...nextBoard];
      if (stage?.id !== nextStage.id || theme !== nextTheme) build(nextStage, nextTheme);
      tiles.forEach((tile, index) => tile.target = tile.stone || board[index] ? 1 : 0);
      requestRender(360);
    },
    setActive,
    dispose() {
      if (disposed) return;
      disposed = true; cancelAnimationFrame(raf); observer.disconnect();
      document.removeEventListener('visibilitychange', visibility);
      renderer.domElement.removeEventListener('webglcontextlost', contextLost);
      scene.clear(); geometry.dispose(); materials.forEach(value => value.dispose()); materials.clear();
      renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove(); tiles.length = 0;
    },
  };
}
