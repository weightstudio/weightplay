import * as THREE from '../../src/vendor/three/r180-b59af7c93a55a6eb/three.module.min.js?wp-media=1ffff09d797fd821';

const palette = {
  dusk: 0x193d62, depth: 0x2e5271, roof: 0x152638, water: 0x235873, stone: 0xae9574,
  edge: 0x67503c, bronze: 0x9b6540, glow: 0xffcc78, coral: 0xba3e3e,
  shell: 0xd74b37, saffron: 0xf6a532, ivory: 0xffdeb0, ink: 0x2d1c25,
  mint: 0x8ce9b6, teal: 0x25877e, bark: 0x794421, latte: 0xc89460
};

function dimensions(height, tilt) {
  return [tilt * 0.28, 1.9 + height * 0.36];
}

export function mountRig(container, { onLoss, onRestore, harbor = false }) {
  const scene = new THREE.Scene();
  const sky = harbor ? 0x353454 : palette.dusk;
  scene.background = new THREE.Color(sky);
  scene.fog = new THREE.Fog(sky, 13, 29);
  const camera = new THREE.OrthographicCamera();
  camera.position.set(2.2, 6.1, 13);
  camera.lookAt(0, 2.28, -0.4);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.45;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  container.replaceChildren(renderer.domElement);
  scene.add(new THREE.HemisphereLight(0xf3e8ff, 0x334768, 1.65));
  const key = new THREE.DirectionalLight(harbor ? 0xffa97b : 0xffcf9a, 2.8);
  key.position.set(-3.2, 7, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(512, 512);
  Object.assign(key.shadow.camera, { left: -6, right: 6, top: 5, bottom: -5, near: 0.5, far: 20 });
  key.shadow.normalBias = 0.04;
  scene.add(key);

  const cube = new THREE.BoxGeometry(1, 1, 1);
  const face = new THREE.Shape();
  face.moveTo(-0.43, -0.43);
  face.lineTo(0.43, -0.43);
  face.lineTo(0.43, 0.43);
  face.lineTo(-0.43, 0.43);
  face.closePath();
  const quilted = new THREE.ExtrudeGeometry(face, {
    depth: 0.86, bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.07, bevelSegments: 1, steps: 1
  }).translate(0, 0, -0.43);
  const spool = new THREE.CylinderGeometry(1, 1, 1, 12);
  const materials = Object.fromEntries(Object.entries(palette).map(([name, color]) =>
    [name, new THREE.MeshStandardMaterial({ color, roughness: name === 'bronze' ? 0.38 : 0.68 })]));
  if (harbor) {
    materials.water.color.setHex(0x374664);
    materials.stone.color.setHex(0x9f786e);
    materials.depth.color.setHex(0x514d69);
  }
  materials.glow.emissive.setHex(0xff9f45);
  materials.glow.emissiveIntensity = 0.5;
  function put(parent, color, x, y, z, width, height, depth, geometry = cube) {
    const mesh = new THREE.Mesh(geometry, materials[color]);
    mesh.position.set(x, y, z);
    mesh.scale.set(width, height, depth);
    parent.add(mesh);
    return mesh;
  }

  put(scene, 'water', 0, -0.17, -2, 18, 0.18, 18);
  put(scene, 'stone', 0, 0, 1.7, 8.3, 0.28, 6.2);
  put(scene, 'edge', 0, 0, -1.43, 8.6, 0.42, 0.24);
  for (let col = 0; col < 8; col += 1) {
    put(scene, 'edge', (col - 3.5) * 1.03, 0.145, 2.35, 0.02, 0.012, 4.75);
    put(scene, 'stone', (col - 3.5) * 1.03, 0.4, -1.43, 0.3, 0.64, 0.35);
  }
  for (let i = 0; i < 10; i += 1) {
    const side = i < 5 ? -1 : 1;
    const k = i % 5;
    const x = side * (4.4 + (k % 2) * 0.84);
    const z = -0.7 - k * 2.25;
    const h = 3.2 + (i % 3) * 0.74;
    put(scene, k % 2 ? 'dusk' : 'depth', x, h / 2, z, 1.65, h, 1.56);
    put(scene, 'roof', x, h, z, 1.89, 0.19, 1.72);
    put(scene, 'roof', x + side * 0.28, h + 0.21, z, 1.15, 0.23, 1.25);
    for (let floor = 0; floor < 2; floor += 1) {
      put(scene, 'glow', x - side * 0.28, 1.3 + floor * 1.2, z + 0.786, 0.39, 0.57, 0.037);
      put(scene, 'edge', x - side * 0.28, 1.3 + floor * 1.2, z + 0.811, 0.04, 0.59, 0.031);
    }
  }
  for (let index = 0; index < 3; index += 1) {
    const z = -4.4 - index * 2.25;
    for (const side of [-1, 1]) {
      put(scene, 'bronze', side * (2.8 - index * 0.18), 1.72, z, 0.16, 3.5, 0.18);
    }
    put(scene, 'bronze', 0, 3.5, z, 5.7 - index * 0.36, 0.13, 0.16);
    put(scene, 'glow', 0, 3.27, z, 0.26, 0.33, 0.26);
  }
  for (let index = 0; index < 14; index += 1) {
    const z = -2.0 - Math.floor(index / 5) * 0.57;
    put(scene, index % 3 === 0 ? 'glow' : 'depth', (index % 5 - 2) * 0.95, -0.066, z, 0.39, 0.018, 0.045);
  }
  for (const material of Object.values(materials)) {
    const group = scene.children.filter(node => node.isMesh && node.geometry === cube && node.material === material);
    if (group.length < 3) continue;
    const batch = new THREE.InstancedMesh(cube, material, group.length);
    batch.receiveShadow = material === materials.stone;
    group.forEach((mesh, index) => {
      mesh.updateMatrix();
      batch.setMatrixAt(index, mesh.matrix);
      scene.remove(mesh);
    });
    scene.add(batch);
  }

  const gateMaterial = new THREE.MeshStandardMaterial({ color: 0x78c8ea, emissive: 0x143848, roughness: 0.35 });
  const gateRig = new THREE.Group();
  scene.add(gateRig);
  const bars = Array.from({ length: 4 }, () => {
    const mesh = new THREE.Mesh(cube, gateMaterial);
    gateRig.add(mesh);
    return mesh;
  });
  const banners = [-1, 1].map(side => put(gateRig, 'mint', side, 0, 0.04, 0.28, 0.42, 0.08));
  const lamp = put(gateRig, 'glow', 0, 0.96, 0.09, 0.19, 0.19, 0.13);
  const guide = new THREE.Group();
  scene.add(guide);
  put(guide, 'mint', 0, 0, 0, 0.49, 0.028, 0.075);
  put(guide, 'mint', 0, 0, 0, 0.075, 0.028, 0.33);

  const moth = new THREE.Group();
  moth.scale.setScalar(1.13);
  scene.add(moth);
  put(moth, 'shell', 0, 0.23, 0.24, 0.75, 0.59, 0.49, quilted).castShadow = true;
  put(moth, 'saffron', 0, -0.26, 0.12, 0.58, 0.48, 0.47, quilted).castShadow = true;
  put(moth, 'saffron', 0, -0.59, 0.07, 0.43, 0.30, 0.36, quilted);
  put(moth, 'bronze', 0, -0.79, 0, 0.29, 0.21, 0.27);
  const wingRoots = [];
  for (const side of [-1, 1]) {
    const wing = new THREE.Group();
    moth.add(wing);
    wingRoots.push(wing);
    put(wing, 'coral', side * 0.86, 0.2, -0.02, 1.31, 0.66, 0.32, quilted).castShadow = true;
    put(wing, 'coral', side * 1.42, 0.4, -0.1, 0.48, 0.68, 0.29, quilted);
    put(wing, 'saffron', side * 0.91, -0.21, -0.05, 0.93, 0.49, 0.31, quilted).castShadow = true;
    put(wing, 'coral', side * 0.72, -0.46, -0.01, 0.53, 0.32, 0.30);
    put(wing, 'mint', side * 1.05, 0.27, 0.177, 0.31, 0.30, 0.034);
    put(wing, 'saffron', side * 1.05, 0.27, 0.207, 0.15, 0.15, 0.032);
    put(wing, 'ivory', side * 0.75, -0.23, 0.14, 0.45, 0.13, 0.043);
    const trim = put(wing, 'saffron', side * 1.21, 0.48, 0.164, 0.5, 0.056, 0.03);
    trim.rotation.z = side * 0.24;
    for (let stitch = 0; stitch < 4; stitch += 1) {
      put(wing, 'ivory', side * (0.56 + stitch * 0.12), 0.44, 0.167, 0.056, 0.016, 0.025);
    }
    put(wing, 'bronze', side * 1.29, -0.10, 0.13, 0.17, 0.17, 0.14);
    put(moth, 'ink', side * 0.186, 0.245, 0.50, 0.19, 0.22, 0.038);
    put(moth, 'ivory', side * 0.195, 0.284, 0.532, 0.080, 0.078, 0.027);
    const antenna = put(moth, 'bronze', side * 0.25, 0.61, 0.23, 0.092, 0.29, 0.092);
    antenna.rotation.z = -side * 0.3;
    put(moth, 'bronze', side * 0.33, 0.77, 0.24, 0.15, 0.12, 0.14);
  }
  const stripe = put(moth, 'mint', 0, -0.36, 0.38, 0.52, 0.095, 0.05);
  const clasp = put(moth, 'bronze', 0, -0.36, 0.42, 0.19, 0.17, 0.075);
  const claspGem = put(moth, 'mint', 0, -0.36, 0.465, 0.08, 0.08, 0.03);

  const reels = [];
  const ropes = [];
  const endpoints = [];
  for (const side of [-1, 1]) {
    const x = side * 3;
    put(scene, 'edge', x, 0.24, 1.4, 0.78, 0.2, 0.82);
    for (const flange of [-1, 1]) put(scene, 'bronze', x + flange * 0.28, 0.53, 1.4, 0.16, 0.42, 0.58);
    const reel = new THREE.Group();
    reel.position.set(x, 0.54, 1.4);
    scene.add(reel);
    const core = put(reel, 'bronze', 0, 0, 0, 0.23, 0.53, 0.23, spool);
    core.rotation.z = Math.PI / 2;
    for (let loop = -2; loop <= 2; loop += 1) {
      const loopMesh = put(reel, 'glow', loop * 0.087, 0, 0, 0.237, 0.038, 0.237, spool);
      loopMesh.rotation.z = Math.PI / 2;
    }
    put(reel, 'glow', 0, 0.21, 0.11, 0.50, 0.035, 0.035);
    reels.push(reel);
    endpoints.push(new THREE.Vector3(x, 0.76, 1.4));
    ropes.push(put(scene, 'glow', x, 0.76, 1.4, 0.025, 1, 0.025, spool));
  }
  const handler = new THREE.Group();
  handler.position.set(3.54, 0.145, 1.84);
  scene.add(handler);
  put(handler, 'bark', 0, 0.68, 0, 0.45, 0.46, 0.4, quilted).castShadow = true;
  put(handler, 'teal', 0, 0.40, 0, 0.38, 0.39, 0.34);
  put(handler, 'latte', -0.06, 0.635, 0.228, 0.32, 0.20, 0.15);
  put(handler, 'ink', -0.14, 0.692, 0.318, 0.10, 0.063, 0.04);
  put(handler, 'ivory', -0.126, 0.821, 0.21, 0.075, 0.087, 0.029);
  put(handler, 'ivory', 0.127, 0.821, 0.21, 0.075, 0.087, 0.029);
  const arm = put(handler, 'teal', -0.28, 0.43, 0.06, 0.16, 0.28, 0.17);
  put(handler, 'bronze', 0.045, 0.31, 0.18, 0.11, 0.09, 0.05);
  for (const side of [-1, 1]) {
    put(handler, 'bark', side * 0.155, 0.91, 0, 0.16, 0.19, 0.16);
    put(handler, 'bark', side * 0.108, 0.133, 0.07, 0.13, 0.26, 0.25);
  }
  const tail = put(handler, 'ink', 0.27, 0.32, -0.24, 0.16, 0.18, 0.44);
  tail.rotation.y = -0.75;
  put(handler, 'bark', 0.43, 0.40, -0.42, 0.14, 0.18, 0.25);

  const up = new THREE.Vector3(0, 1, 0);
  const anchor = new THREE.Vector3();
  const direction = new THREE.Vector3();
  const moving = { x: 0, y: 2.6, z: 0.6, lean: 0, left: 1, right: 1 };
  let code = 0;
  let stopped = false;
  let lost = false;
  let activeAnimation = null;
  let fitWidth = 0;
  let fitHeight = 0;

  function draw() {
    if (stopped || lost) return;
    moth.position.set(moving.x, moving.y, moving.z);
    moth.rotation.z = -moving.lean * 0.105;
    moth.updateMatrixWorld(true);
    for (let i = 0; i < ropes.length; i += 1) {
      anchor.set((i * 2 - 1) * 1.29, -0.10, 0.17);
      moth.localToWorld(anchor);
      direction.subVectors(anchor, endpoints[i]);
      ropes[i].position.copy(endpoints[i]).addScaledVector(direction, 0.5);
      ropes[i].scale.y = direction.length();
      ropes[i].quaternion.setFromUnitVectors(up, direction.normalize());
    }
    reels[0].rotation.x = moving.left * 1.55;
    reels[1].rotation.x = moving.right * 1.55;
    renderer.render(scene, camera);
    container.dataset.draws = String(renderer.info.render.calls);
    container.dataset.triangles = String(renderer.info.render.triangles);
  }

  function layout() {
    const { clientWidth: width, clientHeight: height } = container;
    if (stopped || !width || !height || (fitWidth === width && fitHeight === height)) return;
    fitWidth = width;
    fitHeight = height;
    const aspect = width / height;
    const span = Math.max(3.28, 4.05 / aspect);
    camera.left = -span * aspect;
    camera.right = span * aspect;
    camera.top = span;
    camera.bottom = -span;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    draw();
  }

  function showGate(gate) {
    if (!gate) return;
    const [x, y] = dimensions((gate.high + gate.low) / 2, (gate.minTilt + gate.maxTilt) / 2);
    gateRig.position.set(x, y, -0.26);
    const halfWidth = 2.05 + Math.min(0.84, (gate.maxTilt - gate.minTilt) * 0.105);
    const halfHeight = 0.84 + 0.17 * (gate.high - gate.low);
    bars[0].position.set(-halfWidth, 0, 0);
    bars[1].position.set(halfWidth, 0, 0);
    bars[2].position.set(0, halfHeight, 0);
    bars[3].position.set(0, -halfHeight, 0);
    bars[0].scale.set(0.085, halfHeight * 2, 0.1);
    bars[1].scale.copy(bars[0].scale);
    bars[2].scale.set(halfWidth * 2, 0.085, 0.1);
    bars[3].scale.copy(bars[2].scale);
    lamp.position.y = halfHeight + 0.13;
    banners.forEach((banner, index) => {
      banner.visible = Boolean(gate.link);
      banner.position.set((index * 2 - 1) * halfWidth, halfHeight, 0.03);
    });
  }

  function show(pose, gate, bronze, preview) {
    if (activeAnimation) activeAnimation();
    const [x, y] = dimensions(pose.left + pose.right, pose.tilt);
    Object.assign(moving, { x, y, z: 0.6, lean: pose.tilt, left: pose.left, right: pose.right });
    stripe.material = bronze ? materials.bronze : materials.mint;
    clasp.visible = bronze;
    claspGem.visible = bronze;
    showGate(gate);
    guide.visible = Boolean(preview?.legal);
    if (guide.visible) {
      const [goalX, goalY] = dimensions(preview.height, preview.tilt);
      guide.position.set(goalX, goalY + 0.52, 1.02);
      guide.rotation.z = -preview.tilt * 0.105;
    }
    gateMaterial.color.setHex(!guide.visible ? 0x78c8ea : preview.match ? 0x86f0b5 : 0xf5a65b);
    draw();
  }

  function animate(pose, passed, reducedMotion) {
    if (activeAnimation) activeAnimation();
    if (stopped || lost) return Promise.resolve();
    guide.visible = false;
    gateMaterial.color.setHex(passed ? 0x8dffc0 : 0xfa9368);
    const original = { ...moving };
    const [x, y] = dimensions(pose.left + pose.right, pose.tilt);
    const target = { x, y, z: passed ? -0.76 : 0.6, lean: pose.tilt, left: pose.left, right: pose.right };
    const motionDuration = reducedMotion ? 1 : 360;
    const holdDuration = reducedMotion ? 165 : 160;
    let elapsed = 0;
    let previousFrame = performance.now();
    return new Promise(resolve => {
      function finish() {
        cancelAnimationFrame(code);
        code = 0;
        activeAnimation = null;
        wingRoots.forEach(wing => { wing.rotation.y = 0; });
        arm.rotation.x = 0;
        resolve();
      }
      activeAnimation = finish;
      function frame(now) {
        if (stopped || lost) return finish();
        if (!document.hidden) elapsed += Math.max(0, Math.min(now - previousFrame, 45));
        previousFrame = now;
        const time = Math.min(1, elapsed / motionDuration);
        const eased = 1 - Math.pow(1 - time, 3);
        for (const field of Object.keys(target)) moving[field] = THREE.MathUtils.lerp(original[field], target[field], eased);
        const sway = reducedMotion ? 0 : Math.sin(time * Math.PI) * 0.21;
        if (!passed) moving.z -= sway * 1.2;
        arm.rotation.x = sway * 4;
        wingRoots[0].rotation.y = -sway;
        wingRoots[1].rotation.y = sway;
        draw();
        if (elapsed < motionDuration + holdDuration) code = requestAnimationFrame(frame);
        else finish();
      }
      code = requestAnimationFrame(frame);
    });
  }

  const observer = new ResizeObserver(layout);
  observer.observe(container);
  const lossEvent = event => {
    event.preventDefault();
    lost = true;
    if (activeAnimation) activeAnimation();
    onLoss();
  };
  const restoreEvent = () => {
    lost = false;
    draw();
    onRestore();
  };
  renderer.domElement.addEventListener('webglcontextlost', lossEvent);
  renderer.domElement.addEventListener('webglcontextrestored', restoreEvent);
  layout();

  return {
    show, animate,
    dispose() {
      if (stopped) return;
      stopped = true;
      if (activeAnimation) activeAnimation();
      observer.disconnect();
      renderer.domElement.removeEventListener('webglcontextlost', lossEvent);
      renderer.domElement.removeEventListener('webglcontextrestored', restoreEvent);
      cube.dispose();
      quilted.dispose();
      spool.dispose();
      key.shadow.dispose();
      gateMaterial.dispose();
      for (const object of scene.children) if (object.isInstancedMesh) object.dispose();
      for (const material of Object.values(materials)) material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    }
  };
}
