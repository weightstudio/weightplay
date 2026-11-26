import * as THREE from '../../src/vendor/three/r180-b59af7c93a55a6eb/three.module.min.js?wp-media=a4d649c8383eff35';

const drawerColors = [0x165950, 0x305d73, 0x82442e, 0x514a71];

export function mountDesk(host, { onLoss, onRestore, onDrawer, onTag }) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  const canvas = renderer.domElement;
  renderer.setClearColor(0x10242b, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  host.append(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-4, 4, 2, -2, 0.1, 80);
  camera.position.set(4.9, 5.9, 9.2);
  camera.lookAt(0, 0.94, 0);
  const geometry = new THREE.BoxGeometry();
  const materials = new Map();
  const material = color => {
    if (!materials.has(color)) materials.set(color, new THREE.MeshStandardMaterial({
      color, roughness: color === 0xc89340 ? 0.37 : 0.75, metalness: color === 0xc89340 ? 0.42 : 0.07
    }));
    return materials.get(color);
  };
  function part(owner, color, position, size) {
    const mesh = new THREE.Mesh(geometry, material(color));
    mesh.position.fromArray(position);
    mesh.scale.fromArray(size);
    owner.add(mesh);
    return mesh;
  }
  const group = (owner, xyz) => {
    const pieces = new THREE.Group();
    pieces.position.fromArray(xyz);
    owner.add(pieces);
    return pieces;
  };
  const pale = 0xffdda5;
  const dark = 0x362623;
  const tan = 0xc17b38;
  const brass = 0xc89340;
  scene.add(new THREE.HemisphereLight(0xffedca, 0x183e59, 2.12));
  const sun = new THREE.DirectionalLight(0xffd9a0, 3.1);
  sun.position.set(-6, 8, 6);
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0x46a79f, 2.2);
  rim.position.set(4, 3, -7);
  scene.add(rim);

  part(scene, 0x26534b, [0, -0.40, 0.10], [7.3, 0.14, 4.22]);
  for (let i = 0; i < 8; i++) {
    part(scene, i % 2 ? 0x2e5453 : 0x376363, [-3.27 + i * 0.93, -0.32, 0.1], [0.9, 0.036, 4.16]);
  }
  part(scene, 0x20343b, [-0.1, 1.05, -1.84], [6.8, 2.85, 0.14]);
  for (const y of [1.23, 2.26]) {
    part(scene, 0x74462c, [-0.08, y, -1.65], [6.5, 0.11, 0.45]);
    part(scene, brass, [-0.08, y + 0.025, -1.41], [6.45, 0.03, 0.02]);
  }
  for (let i = 0; i < 11; i++) {
    const height = [0.35, 0.56, 0.42][i % 3];
    const x = -2.95 + i * 0.52;
    part(scene, drawerColors[i % drawerColors.length], [x, 2.32 + height / 2, -1.62], [0.26, height, 0.23]);
    part(scene, brass, [x, 2.37, -1.49], [0.24, 0.04, 0.035]);
    if (i % 3 === 0) {
      part(scene, 0x6a4632, [x, 1.41, -1.63], [0.51, 0.22, 0.29]);
      part(scene, 0xd8ae69, [x, 1.42, -1.47], [0.23, 0.08, 0.025]);
    }
  }
  part(scene, 0x7c482c, [0, -0.11, 0.35], [6.8, 0.26, 3.6]);
  for (let i = 0; i < 6; i++) {
    part(scene, i % 2 ? 0x955d3b : 0xa46a43, [0, 0.052, -1.13 + i * 0.58], [6.75, 0.08, 0.563]);
  }
  const clerk = group(scene, [2.26, 0.02, -0.82]);
  part(clerk, 0x326253, [0, 0.51, 0], [0.96, 0.78, 0.7]);
  part(clerk, 0x234a42, [0, 0.57, 0.38], [0.8, 0.37, 0.12]);
  part(clerk, 0xb54b37, [0.32, 0.78, 0.43], [0.19, 0.19, 0.08]);
  const head = group(clerk, [0, 1.4, 0]);
  part(head, tan, [0, 0, 0], [1.11, 0.93, 0.89]);
  part(head, pale, [0, 0.04, 0.46], [0.30, 0.82, 0.05]);
  part(head, pale, [0, 0.48, 0], [0.30, 0.04, 0.87]);
  part(head, pale, [0, -0.24, 0.56], [0.62, 0.34, 0.36]);
  part(head, dark, [0, -0.19, 0.77], [0.22, 0.13, 0.09]);
  for (const side of [-1, 1]) {
    part(head, dark, [side * 0.38, 0.51, -0.06], [0.29, 0.29, 0.30]);
    part(head, dark, [side * 0.325, 0.02, 0.462], [0.29, 0.37, 0.06]);
    part(head, 0xfff7dc, [side * 0.32, 0.065, 0.505], [0.155, 0.19, 0.026]);
    part(head, dark, [side * 0.298, 0.053, 0.526], [0.08, 0.138, 0.025]);
    part(clerk, tan, [side * 0.57, 0.35, 0.29], [0.25, 0.26, 0.74]);
    part(clerk, dark, [side * 0.57, 0.30, 0.65], [0.27, 0.26, 0.24]);
  }
  const drawers = drawerColors.map((color, lane) => {
    const x = -2.65 + lane * 1.12;
    const housing = group(scene, [x, 0, 0]);
    housing.userData = { lane };
    part(housing, 0x4d3a28, [0, 0.47, -0.58], [1.01, 0.9, 1.02]);
    part(housing, brass, [0, 0.942, -0.58], [1.04, 0.06, 1.055]);
    const drawer = group(housing, [0, 0.32, 0]);
    part(drawer, color, [0, 0.12, 0], [0.91, 0.53, 0.18]);
    part(drawer, brass, [0, 0.08, 0.12], [0.34, 0.078, 0.16]);
    part(drawer, pale, [0, 0.24, 0.107], [0.28, 0.10, 0.029]);
    const paper = group(drawer, [0, 0.32, 0.31]);
    paper.rotation.x = -0.17;
    part(paper, 0xffe8bf, [0, 0, 0], [0.65, 0.031, 0.57]);
    for (let line = 0; line < 3; line++) {
      part(paper, 0xa7835e, [-0.03, 0.021, -0.13 + line * 0.1], [0.43 - line * 0.055, 0.01, 0.024]);
    }
    paper.visible = false;
    return { housing, drawer, paper, target: 0 };
  });
  const tags = Array.from({ length: 4 }, (_, slot) => {
    const tag = group(scene, [-2.59 + slot * 1.20, 0.113, 1.13]);
    tag.userData = { slot };
    tag.rotation.y = 0.08 * (slot - 1);
    part(tag, pale, [0, 0.025, 0], [1.0, 0.063, 0.68]);
    part(tag, 0x8f684b, [-0.12, 0.063, -0.15], [0.51, 0.011, 0.039]);
    part(tag, 0x8f684b, [-0.22, 0.063, -0.02], [0.31, 0.011, 0.027]);
    const border = part(tag, brass, [0, 0, 0], [1.07, 0.049, 0.75]);
    const seal = part(tag, 0x326e4e, [0.24, 0.065, 0.15], [0.33, 0.03, 0.24]);
    return { tag, border, seal };
  });
  const stamp = group(scene, [2.45, 0.17, 0.95]);
  const base = part(stamp, 0xaf4230, [0, 0.10, 0], [0.64, 0.21, 0.51]);
  part(stamp, 0x562b23, [0, 0.014, 0], [0.62, 0.06, 0.49]);
  part(stamp, 0xac5037, [0, 0.31, 0], [0.24, 0.29, 0.22]);
  part(stamp, 0xdd6347, [0, 0.50, 0], [0.42, 0.16, 0.38]);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let raf = 0;
  let lost = false;
  let closed = false;
  let visual = { active: [0], tagCount: 1, selected: 0, open: new Set(), sealed: new Map() };
  let motion = null;
  const ray = new THREE.Raycaster();
  function pick(event) {
    if (lost || closed || event.button > 0) return;
    const box = canvas.getBoundingClientRect();
    if (!box.width || !box.height) return;
    ray.setFromCamera(new THREE.Vector2(2 * (event.clientX - box.left) / box.width - 1,
      1 - 2 * (event.clientY - box.top) / box.height), camera);
    const targets = drawers.filter(({ housing }) => housing.visible).map(({ housing }) => housing)
      .concat(tags.filter(({ tag }) => tag.visible).map(({ tag }) => tag));
    let piece = ray.intersectObjects(targets, true)[0]?.object;
    while (piece && piece.userData.lane === undefined && piece.userData.slot === undefined) piece = piece.parent;
    if (piece?.userData.lane !== undefined) onDrawer?.(piece.userData.lane);
    else if (piece?.userData.slot !== undefined) onTag?.(piece.userData.slot);
  }
  function render(time = performance.now()) {
    if (closed || lost) return;
    let moving = false;
    for (const { drawer, target } of drawers) {
      const delta = target - drawer.position.z;
      if (!reduced.matches && Math.abs(delta) > 0.012) {
        drawer.position.z += delta * 0.24;
        moving = true;
      } else drawer.position.z = target;
    }
    if (motion && !reduced.matches) {
      const progress = Math.min((time - motion.start) / 300, 1);
      stamp.position.copy(motion.rest);
      stamp.position.lerp(motion.target, Math.sin(Math.PI * progress));
      stamp.position.y += Math.sin(Math.PI * progress) * (progress < 0.5 ? 0.33 : 0.04);
      head.rotation.x = Math.sin(Math.PI * progress) * 0.25;
      if (progress === 1) motion = null;
    }
    renderer.render(scene, camera);
    if ((moving || motion) && !reduced.matches) raf = requestAnimationFrame(render);
  }
  function resize() {
    if (closed || lost) return;
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    const ratio = width / height;
    const w = Math.max(3.95, 1.90 * ratio);
    const h = w / ratio;
    camera.left = -w;
    camera.right = w;
    camera.top = h;
    camera.bottom = -h;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height, false);
    if (!motion) render();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  const loss = event => {
    event.preventDefault();
    lost = true;
    cancelAnimationFrame(raf);
    onLoss?.();
  };
  const restored = () => {
    if (closed) return;
    lost = false;
    motion = null;
    stamp.position.set(2.45, 0.17, 0.95);
    head.rotation.x = 0;
    resize();
    onRestore?.();
  };
  canvas.addEventListener('webglcontextlost', loss);
  canvas.addEventListener('webglcontextrestored', restored);
  canvas.addEventListener('click', pick);
  resize();

  return {
    update(view) {
      visual = view;
      drawers.forEach((entry, lane) => {
        entry.housing.visible = visual.active.includes(lane);
        entry.target = visual.open.has(lane) ? 0.45 : 0;
        entry.paper.visible = visual.open.has(lane);
      });
      tags.forEach(({ tag, border, seal }, slot) => {
        tag.visible = slot < visual.tagCount;
        border.visible = slot === visual.selected;
        seal.visible = visual.sealed.has(slot);
        seal.material = material(visual.sealed.get(slot) ? 0x326e4e : 0xbf4e30);
      });
      base.material = material(view.red ? 0xdd572b : 0x8a4e35);
      if (!motion) {
        cancelAnimationFrame(raf);
        render();
      }
    },
    stamp(slot) {
      if (closed || lost || reduced.matches) return;
      cancelAnimationFrame(raf);
      const rest = new THREE.Vector3(2.45, 0.17, 0.95);
      motion = { start: performance.now(), rest, target: new THREE.Vector3(-2.35 + slot * 1.2, 0.15, 1.28) };
      raf = requestAnimationFrame(render);
    },
    counts() {
      return { ...renderer.info.memory, calls: renderer.info.render.calls, triangles: renderer.info.render.triangles };
    },
    dispose() {
      closed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      canvas.removeEventListener('webglcontextlost', loss);
      canvas.removeEventListener('webglcontextrestored', restored);
      canvas.removeEventListener('click', pick);
      geometry.dispose();
      materials.forEach(value => value.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    }
  };
}
