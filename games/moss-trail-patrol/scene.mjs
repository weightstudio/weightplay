import * as THREE from '../../src/vendor/three/r180-b59af7c93a55a6eb/three.module.min.js?wp-media=b2d3eb8f869f8eea';

const ground = [0x172b27, 0x233f35, 0x315042, 0x397055];
const troopColors = { s: 0xa76ac8, r: 0xd77f54, m: 0x84a8ec, g: 0x9e9cbd, b: 0x9d5676 };
const look = new THREE.Vector3(0, 0.12, 0);
const clamped = p => Math.max(0, Math.min(p, 1));

export function mountScene(host, stage, gilded) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(1.5, devicePixelRatio));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.append(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x172b35);
  scene.fog = new THREE.FogExp2(0x172b35, 0.027);
  const camera = new THREE.OrthographicCamera(-7, 7, 6, -6, 0.1, 130);
  camera.position.set(5.2, 13, 12.8);
  camera.lookAt(look);
  const sun = new THREE.DirectionalLight(0xffd7a0, 3.35);
  sun.position.set(-5, 9, 3);
  const bounce = new THREE.DirectionalLight(0x8ccbef, 0.9);
  bounce.position.set(5, 3, -4);
  scene.add(sun, bounce, new THREE.HemisphereLight(0xc8efd1, 0x273057, 1.65));
  const unit = new THREE.BoxGeometry(1, 1, 1);
  const gem = new THREE.OctahedronGeometry(1, 0);
  const materials = new Map();
  function material(color, glow = false) {
    const key = color + ':' + glow;
    if (!materials.has(key)) {
      materials.set(key, new THREE.MeshStandardMaterial({
        color, roughness: glow ? 0.45 : 0.78,
        emissive: glow ? color : 0, emissiveIntensity: glow ? 0.66 : 0,
      }));
    }
    return materials.get(key);
  }
  function box(parent, color, xyz, size, glow = false, shape = unit) {
    const mesh = new THREE.Mesh(shape, material(color, glow));
    mesh.position.set(...xyz);
    mesh.scale.set(...size);
    parent.add(mesh);
    return mesh;
  }
  const batches = new Map();
  const dummy = new THREE.Object3D();
  function terrain(color, xyz, size, rotation = 0) {
    if (!batches.has(color)) batches.set(color, []);
    batches.get(color).push([xyz, size, rotation]);
  }

  let seed = 9137 + stage.id * 419;
  function random() {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  }

  terrain(ground[0], [0, -0.76, 0], [65, 0.85, 65]);
  terrain(0x286263, [0, -0.39, 0], [9.3, 0.16, 8.8], -0.13);
  terrain(0x327d74, [0.02, -0.29, 0.1], [6.7, 0.09, 6.25], -0.13);
  for (let i = 0; i < 55; i++) {
    const x = random() * 8.7 - 4.4;
    const z = random() * 8.4 - 4.2;
    if (Math.hypot(x, z) < 2.9) terrain(i % 4 ? 0x429088 : 0x51a099, [x, -0.23, z], [random() * 0.5 + 0.13, 0.02, 0.04]);
  }
  for (let i = 0; i < 76; i++) {
    const angle = i * 2.39996 + random() * 0.18;
    const radius = 5.3 + random() * 5.1;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const h = 0.17 + random() * 0.28;
    terrain(ground[i % ground.length], [x, -0.23, z], [0.9 + random(), h, 0.8 + random()], angle);
    if (i % 3 === 0 && z < 3.3) {
      const y = 1.25 + random() * 1.5;
      terrain(0x51412d, [x, y / 2 - 0.12, z], [0.26, y, 0.26], angle);
      terrain(ground[2], [x - 0.1, y + 0.22, z], [1.12, 0.75, 0.97], angle);
      terrain(ground[3], [x + 0.18, y + 0.71, z], [0.7, 0.53, 0.73], angle);
      terrain(0x588579, [x + 0.24, y + 1.01, z], [0.4, 0.21, 0.39], angle);
    } else {
      for (let j = 0; j < 3; j++) {
        terrain(j === 2 && i % 7 === 0 ? 0xffcd6d : ground[(i + j) % 4], [x + j * 0.16, -0.01 + j * 0.06, z - j * 0.1], [0.24, 0.22, 0.2], angle);
      }
    }
  }

  const siteCount = stage.sites.length;
  const shapeCount = Math.max(4, siteCount + 1);
  const positions = Array.from({ length: shapeCount }, (_, i) => {
    const angle = Math.PI / 2 + i * Math.PI * 2 / shapeCount;
    return new THREE.Vector3(Math.cos(angle) * 3.42, 0.21, Math.sin(angle) * 3.42);
  });
  positions.forEach((p, i) => {
    const q = positions[(i + 1) % positions.length];
    const steps = 7;
    for (let j = 1; j < steps; j++) {
      const t = p.clone().lerp(q, j / steps);
      terrain(j % 2 ? 0x5b665c : 0x677666, [t.x, -0.035, t.z], [0.59, 0.39, 0.61], Math.atan2(q.x - p.x, q.z - p.z));
    }
    const record = stage.sites[i - 1];
    const low = record?.terrain === 'h';
    const tide = record?.terrain === 't';
    const color = i === 0 ? 0x9b7542 : tide ? 0x396d8c : low ? 0x655472 : 0x738965;
    terrain(0x304740, [p.x, -0.17, p.z], [1.75, 0.43, 1.75]);
    terrain(color, [p.x, low ? 0.03 : 0.11, p.z], [1.55, low ? 0.28 : 0.38, 1.55]);
    terrain(tide ? 0x72cdd4 : 0xacba85, [p.x, low ? 0.18 : 0.3, p.z], [1.38, 0.025, 1.38]);
    if (tide || low) {
      for (let j = -1; j <= 1; j++) terrain(color, [p.x + j * 0.35, 0.325, p.z], [0.125, 0.04, 0.9], tide ? 0.1 : 0.45);
    }
    if (!record) terrain(0x53694b, [p.x, 0.17, p.z], [0.38, 0.22, 0.54], i);
  });

  for (const [color, placements] of batches) {
    const pile = new THREE.InstancedMesh(unit, material(color), placements.length);
    for (const [i, [xyz, scale, yaw]] of placements.entries()) {
      dummy.position.set(...xyz);
      dummy.scale.set(...scale);
      dummy.rotation.set(0, yaw, 0);
      dummy.updateMatrix();
      pile.setMatrixAt(i, dummy.matrix);
    }
    pile.computeBoundingSphere();
    scene.add(pile);
  }

  const home = new THREE.Group();
  home.position.copy(positions[0]);
  home.position.x += 0.55;
  box(home, 0x816739, [0, 0.11, 0], [0.78, 0.16, 0.6]);
  box(home, 0xc77d49, [0, 0.56, 0], [0.57, 0.68, 0.55]);
  box(home, 0xfbb65d, [0, 0.91, 0], [0.76, 0.16, 0.71]);
  box(home, 0xffcc71, [0, 0.58, 0.29], [0.21, 0.23, 0.06], true);
  scene.add(home);

  const turtle = new THREE.Group();
  const body = new THREE.Group();
  turtle.add(body);
  box(body, 0xbbad55, [0, 0.42, 0.01], [0.93, 0.46, 1.11]);
  box(body, 0x3d592f, [0, 0.71, -0.08], [1.08, 0.38, 1]);
  box(body, 0x6b873c, [0, 0.94, -0.13], [0.91, 0.26, 0.86]);
  box(body, 0x95b746, [0, 1.15, -0.23], [0.63, 0.24, 0.64]);
  box(body, 0x7f8861, [0.16, 1.28, -0.21], [0.29, 0.31, 0.32]);
  box(body, 0xa3c44d, [-0.14, 1.31, -0.21], [0.24, 0.22, 0.31]);
  box(body, 0xc19a5e, [-0.15, 1.53, -0.2], [0.06, 0.45, 0.06]);
  box(body, 0x6bad4d, [0.012, 1.62, -0.2], [0.28, 0.18, 0.07]);
  box(body, 0x8cbd48, [0, 0.67, 0.59], [0.62, 0.49, 0.53]);
  box(body, 0xe2da75, [0, 0.54, 0.88], [0.4, 0.245, 0.19]);
  for (const side of [-1, 1]) {
    box(body, 0xf2edd2, [side * 0.196, 0.75, 0.864], [0.125, 0.15, 0.026]);
    box(body, 0x262d20, [side * 0.193, 0.74, 0.883], [0.052, 0.095, 0.027]);
    box(body, 0xc99f4e, [side * 0.18, 0.45, 0.6], [0.21, 0.16, 0.16]);
  }
  box(body, 0xa56e42, [-0.53, 0.54, 0.22], [0.22, 0.24, 0.36]);
  const legs = [];
  for (const side of [-1, 1]) for (const depth of [-1, 1]) {
    const leg = new THREE.Group();
    leg.position.set(side * 0.38, 0.38, depth * 0.35);
    box(leg, 0x6b9c43, [0, -0.135, 0], [0.23, 0.32, 0.24]);
    box(leg, 0xb9bf76, [0, -0.275, 0.09], [0.24, 0.12, 0.24]);
    body.add(leg);
    legs.push(leg);
  }
  scene.add(turtle);

  const enemyRoot = new THREE.Group();
  scene.add(enemyRoot);
  const enemyModels = new Map();
  for (const [id, color] of Object.entries(troopColors)) {
    const model = new THREE.Group();
    box(model, color, [0, 0.43, 0], [0.69, 0.57, 0.58]);
    box(model, color, [0, 0.73, 0.03], [0.53, 0.29, 0.47]);
    box(model, id === 'b' ? 0xeea592 : 0xd7aee9, [0, 0.95, 0.01], [0.24, 0.23, 0.22]);
    for (const side of [-1, 1]) {
      box(model, 0x422a4e, [side * 0.31, 0.13, 0], [0.22, 0.26, 0.34]);
      box(model, 0xffd58a, [side * 0.14, 0.54, 0.299], [0.115, 0.07, 0.037], true);
      box(model, color, [side * 0.39, 0.42, -0.04], [0.22, 0.28, 0.29]);
      if (id !== 's') box(model, id === 'g' ? 0x677789 : 0xd99870, [side * 0.28, 0.77, 0.13], [0.14, 0.24, 0.19]);
    }
    model.scale.setScalar(id === 'b' ? 1.28 : id === 's' ? 0.83 : 1);
    enemyModels.set(id, model);
    enemyRoot.add(model);
  }
  const landmarks = stage.sites.map((_, i) => {
    const group = new THREE.Group();
    group.position.copy(positions[i + 1]);
    group.position.x += 0.57;
    group.position.z -= 0.42;
    const camp = new THREE.Group();
    box(camp, 0xba6744, [0, 0.26, 0], [0.46, 0.5, 0.52]);
    box(camp, 0xeaa75a, [0, 0.53, 0], [0.66, 0.12, 0.66]);
    box(camp, 0xffdf9a, [0, 0.26, 0.273], [0.15, 0.24, 0.04]);
    const lantern = new THREE.Group();
    box(lantern, 0x8b694d, [0, 0.25, 0], [0.095, 0.5, 0.1]);
    box(lantern, gilded ? 0xff6f21 : 0xffca65, [0, 0.53, 0], [0.26, 0.26, 0.24], true);
    box(lantern, 0xbc8d58, [0, 0.695, 0], [0.34, 0.08, 0.33]);
    const lure = new THREE.Group();
    box(lure, 0xa87ec2, [0, 0.29, 0], [0.3, 0.42, 0.28], true, gem);
    box(lure, 0x594667, [0, 0.056, 0], [0.34, 0.11, 0.34]);
    const plank = new THREE.Group();
    for (let n = -1; n <= 1; n++) box(plank, n === 0 ? 0xae8860 : 0x7e5d45, [n * 0.15, 0.045, 0], [0.14, 0.10, 0.65]);
    group.add(camp, lantern, lure, plank);
    scene.add(group);
    return { group, props: { camp, lantern, lure, plank } };
  });
  const nextMarker = new THREE.Group();
  for (const side of [-1, 1]) {
    box(nextMarker, 0xe2d783, [side * 0.67, 0.1, 0], [0.075, 0.045, 1.25], true);
    box(nextMarker, 0xe2d783, [0, 0.1, side * 0.67], [1.4, 0.045, 0.077], true);
  }
  scene.add(nextMarker);
  const flashes = Array.from({ length: 8 }, (_, i) => box(scene, i >= 5 ? 0x7aeac7 : 0xffd070, [0, 0, 0], [0.13, 0.13, 0.13], true, gem));
  let previous = positions[0];
  let destination = positions[0];
  let animation = '';
  let time = 1;
  let heldEnemy = null;
  const focus = new THREE.Vector3();
  const cameraOrigin = camera.position.clone();
  const contact = new THREE.Vector3();

  function play(run, before, effects) {
    time = 0;
    previous = positions[before.site + 1];
    destination = positions[run.site + 1];
    heldEnemy = before.foe || run.foe?.code;
    animation = effects.find(event => ['move', 'strike', 'counter', 'block', 'placed'].includes(event.kind))?.kind || '';
  }

  function draw(run, dt, reduced) {
    time = Math.min(1.1, time + dt);
    const progress = reduced ? 1 : clamped(time / 0.34);
    const pulse = Math.sin(progress * Math.PI);
    const moving = animation === 'move';
    const striking = animation === 'strike' || animation === 'counter';
    const guarding = animation === 'block';
    const position = positions[run.site + 1];
    turtle.position.copy(position);
    if (moving) turtle.position.copy(previous).lerp(destination, progress);
    if (striking) turtle.position.x += pulse * 0.3;
    turtle.rotation.y = moving && progress < 1 ?
      Math.atan2(destination.x - previous.x, destination.z - previous.z) : 0.67;
    body.position.y = moving && progress < 1 ? Math.abs(Math.sin(progress * Math.PI * 4)) * 0.09 : 0;
    body.rotation.x = guarding ? pulse * -0.22 : striking ? pulse * 0.16 : 0;
    for (const [i, leg] of legs.entries()) {
      leg.rotation.x = moving && progress < 1 ? Math.sin(progress * Math.PI * 4 + i * Math.PI) * 0.43 : 0;
    }

    const foe = run.foe?.code || (striking && progress < 1 ? heldEnemy : null);
    enemyRoot.visible = Boolean(foe);
    enemyRoot.position.copy(position);
    enemyRoot.position.x += 0.83 + (striking ? pulse * 0.28 : guarding ? -pulse * 0.19 : 0);
    enemyRoot.position.z -= 0.53;
    enemyRoot.rotation.y = -0.53;
    enemyRoot.rotation.z = striking ? -pulse * 0.19 : 0;
    for (const [id, enemy] of enemyModels) enemy.visible = id === foe;
    landmarks.forEach(({ group, props }, index) => {
      const marker = run.marks[index];
      group.visible = Boolean(marker);
      group.scale.setScalar(animation === 'placed' && run.site + 1 === index ? 1 + pulse * 0.38 : 1);
      for (const [id, prop] of Object.entries(props)) prop.visible = id === marker;
    });
    nextMarker.visible = !run.foe && !run.result;
    nextMarker.position.copy(positions[run.site + 2] || positions[0]);
    if (run.site + 1 >= stage.sites.length) nextMarker.position.copy(positions[0]);
    flashes.forEach((spark, i) => {
      spark.visible = (striking || guarding || animation === 'placed') && progress > 0.14 && progress < 1;
      if (!spark.visible) return;
      spark.position.copy(animation === 'placed' ? nextMarker.position : position);
      const radius = progress * 0.85;
      spark.position.x += 0.57 + Math.sin(i * 2.39996) * radius;
      spark.position.z += Math.cos(i * 2.39996) * radius;
      spark.position.y += 0.32 + (i % 3) * 0.12 + pulse * 0.31;
      spark.rotation.y = i + progress * 3;
      spark.scale.setScalar((1 - progress) * 0.14);
    });
    const focusTarget = foe ? position.clone().add(new THREE.Vector3(0.38, 0.03, -0.22)) : look;
    const smoothing = reduced ? 1 : 1 - Math.exp(-12 * dt);
    focus.lerp(focusTarget, smoothing);
    camera.position.copy(cameraOrigin).add(focus);
    camera.lookAt(focus);
    const zoom = THREE.MathUtils.lerp(camera.zoom, foe ? 1.52 : 1, smoothing);
    if (Math.abs(zoom - camera.zoom) > 0.001) {
      camera.zoom = zoom;
      camera.updateProjectionMatrix();
    }
    renderer.render(scene, camera);
  }

  function rewardPoint() {
    const bounds = renderer.domElement.getBoundingClientRect();
    contact.copy(enemyRoot.position);
    contact.y += 0.4;
    contact.project(camera);
    return [bounds.left + (contact.x + 1) * bounds.width / 2, bounds.top + (1 - contact.y) * bounds.height / 2];
  }

  function resize() {
    const width = Math.max(host.clientWidth, 1);
    const height = Math.max(host.clientHeight, 1);
    const ratio = width / height;
    const view = Math.max(5.05, 5.25 / ratio);
    camera.left = -view * ratio;
    camera.right = view * ratio;
    camera.top = view;
    camera.bottom = -view;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  function dispose() {
    for (const mat of materials.values()) mat.dispose();
    unit.dispose();
    gem.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement.remove();
  }

  return { canvas: renderer.domElement, play, draw, resize, dispose, rewardPoint, info: renderer.info };
}

