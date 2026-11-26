import * as T from '/src/vendor/three/r180-b59af7c93a55a6eb/three.module.min.js?wp-media=a5be5bf5d64c04da';

const palette = { peg: 0xe19752, dew: 0x65e6ce, wind: 0xffd366, hinge: 0x78a5ee, lock: 0x8a9da4 };
const plant = [0xf4a569, 0xf0d57b, 0xe589bf, 0x9bd8fc, 0xe2a681];

export function mountGrove(host, stage, finish, { onLost, position, paused, motion }) {
  const renderer = new T.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power' });
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  const canvas = renderer.domElement;
  host.prepend(canvas);
  const scene = new T.Scene();
  const moon = stage.id > 30;
  scene.background = new T.Color(moon ? 0x172d4a : 0x1b5148);
  const camera = new T.OrthographicCamera(-3, 3, 3, -3, .1, 80);
  camera.position.set(.76, .8, 12);
  camera.lookAt(0, -.08, 0);
  const key = new T.DirectionalLight(moon ? 0xb3d4ff : 0xffd6a0, 2.35);
  key.position.set(-3, 5, 8);
  const rim = new T.DirectionalLight(0x92e7d1, .9);
  rim.position.set(4, -1, 5);
  scene.add(new T.HemisphereLight(0xf1fff0, 0x42467d, 2.2), key, rim);
  const materials = new Map();
  const geo = { box: new T.BoxGeometry(), ball: new T.IcosahedronGeometry(1, 1),
    gem: new T.OctahedronGeometry(1), ring: new T.TorusGeometry(1, .09, 6, 28) };
  function material(color, emissive = 0) {
    const key = color + ':' + emissive;
    if (!materials.has(key)) materials.set(key, new T.MeshStandardMaterial({
      color, emissive, emissiveIntensity: emissive ? .42 : 0, roughness: .66, metalness: .08,
    }));
    return materials.get(key);
  }
  function mesh(kind, col, x, y, z, w, h, d, parent = scene, glow = 0) {
    const m = new T.Mesh(geo[kind], material(col, glow));
    m.position.set(x, y, z);
    m.scale.set(w, h, d);
    parent.add(m);
    return m;
  }
  const box = (...args) => mesh('box', ...args);
  const wood = finish === 'amber' ? 0x714029 : finish === 'moon' || moon ? 0x244055 : 0x4e3828;
  const plank = moon ? 0x263b52 : 0x564736;
  const scenery = [];
  function tile(color, x, y, z, w, h, d, angle = 0) {
    scenery.push({ color, x, y, z, w, h, d, angle });
  }
  // The conservatory has actual glass panes, mullions and planting blocks.
  tile(moon ? 0x24445b : 0x36796d, 0, .5, -3, 15, 13, .2);
  for (let c = -5; c <= 5; c++) {
    tile(moon ? 0x517e93 : 0x679b8a, c * 1.5, 2, -2.8, 1.41, 4.85, .055);
    tile(moon ? 0x456c82 : 0x4c8b78, c * 1.5, -2.8, -2.82, 1.42, 3.9, .06);
    tile(0x448079, c * 1.5 - .76, 1, -2.72, .072, 8, .17);
    tile(moon ? 0x5a86a1 : 0x78a992, c * 1.5 - .4, 2.04, -2.69, .037, 3.88, .02, -.19);
    const x = c * 1.31 + .21;
    tile(0x244b43, x, -3.05 - (c & 1) * .12, -.97, 1.21, .36, .55);
    tile(moon ? 0x4d8f80 : 0x6eac78, x, -2.79 - (c & 1) * .12, -.91, 1.02, .18, .42);
    tile(moon ? 0x7e9bc2 : 0xd7b075, x + .25, -2.63 - (c & 1) * .12, -.85, .14, .15, .14);
  }
  for (const y of [-2.8, 1.1, 3.65]) tile(0x48786d, 0, y, -2.66, 18, .105, .17);
  for (const sign of [-1, 1]) {
    tile(0x283b42, sign*3.03, -2.02, -.31, .3, .61, .43);
    tile(0xaa744f, sign*3.03, -1.69, -.23, .42, .12, .53);
    tile(moon ? 0x87d8f7 : 0xffcb70, sign*3.03, -1.44, -.22, .27, .38, .3);
    tile(0xb88150, sign*3.03, -1.22, -.22, .39, .085, .43);
  }
  // Small orchard caretaker at the board's foot: cuboid muzzle, copper clasp,
  // layered moss shell and gardening cap retain Taro's silhouette.
  const mascot = [
    [0x355e4d,-.19,.11,-.12,.48,.34,.32],
    [0x54965b,-.27,.25,-.17,.45,.21,.35],
    [0x83af5d,-.26,.39,-.18,.34,.13,.26],
    [0xaacf6c,-.24,.49,-.18,.25,.09,.18],
    [0x64875a,-.14,.06,.12,.41,.18,.21],
    [0x8aa05b,.04,.26,.07,.27,.24,.25],
    [0xacbd6d,.06,.39,.1,.33,.31,.27],
    [0xd1cc76,.13,.30,.24,.24,.11,.19],
    [0xfbfae2,.02,.42,.25,.068,.095,.02],
    [0xfbfae2,.18,.42,.25,.068,.095,.02],
    [0x303734,.03,.41,.27,.033,.057,.02],
    [0x303734,.19,.41,.27,.033,.057,.02],
    [0x8b6040,.06,.58,.12,.40,.08,.30],
    [0xc19456,.07,.64,.12,.28,.08,.24],
    [0xddd4a0,.02,.18,.23,.26,.13,.025],
    [0xc79854,.02,.24,.249,.075,.057,.025],
    [0x8f9f55,-.28,.04,.18,.13,.13,.17],
    [0xa4ac62,.16,.04,.15,.13,.13,.17],
  ];
  for (const [color,x,y,z,w,h,d] of mascot) tile(color,-2.71+x*.91,-2.92+y*.91,.2+z,w*.91,h*.91,d*.91);
  const backdrop = new T.InstancedMesh(geo.box, material(0xffffff), scenery.length);
  const transform = new T.Object3D();
  scenery.forEach(({color,x,y,z,w,h,d,angle},i) => {
    transform.position.set(x,y,z); transform.scale.set(w,h,d); transform.rotation.z = angle;
    transform.updateMatrix(); backdrop.setMatrixAt(i,transform.matrix); backdrop.setColorAt(i,new T.Color(color));
  });
  scene.add(backdrop);
  box(wood, 0, 0, -.44, 5.52, 5.48, .5);
  box(plank, 0, 0, -.16, 5.26, 5.23, .15);
  for (let c = 0; c < 5; c++) {
    box(c % 2 ? 0x305052 : (moon ? 0x2a425a : 0x504c3e), (c-2) * 1.01, .07, -.048, .91, 4.68, .04);
  }
  for (const sign of [-1, 1]) {
    box(0xb57647, sign * 2.66, 0, .03, .17, 5.4, .35);
    box(0x684b3e, sign * 2.78, 0, -.06, .13, 5.55, .3);
    for (const y of [-2.55, 2.55]) mesh('gem', 0xf9b86c, sign * 2.67, y, .27, .075, .075, .06);
  }
  box(0xab764e, 0, 2.67, -.08, 5.7, .14, .43);
  box(0x906349, 0, -2.68, -.04, 5.7, .14, .52);
  // Tiered planting blocks soften the frame without covering the active board.
  for (const s of [-1, 1]) {
    box(0x243b3a, s*2.86, -2.58, .17, .42, .29, .62);
    box(0x498364, s*2.89, -2.37, .15, .28, .17, .39);
    box(0x6b9b66, s*2.83, -2.22, .15, .19, .13, .29);
    box(0x2b6052, s*2.9, -1.93, -.28, .31, 1.11, .35);
    mesh('gem', moon ? 0x8dceff : 0xffc672, s * 2.87, -1.27, -.1, .15, .21, .15, scene, moon ? 0x8dceff : 0xffc672);
  }
  function at(row, col, z = .48) {
    const y = row >= stage.rows ? -2.38 : 2.44 - (row + 1) * 4.52 / stage.rows;
    return new T.Vector3((col - 2) * .99, y, z);
  }
  const pegs = stage.pegs.map(({ kind }, i) => {
    const p = at(Math.floor(i / 5), i % 5);
    const g = new T.Group();
    scene.add(g);
    g.position.copy(p);
    const base = box(kind === 'lock' ? 0x546773 : 0x755443, 0, 0, -.25, .53, .32, .18, g);
    const lever = new T.Group(); g.add(lever);
    box(palette[kind], .064, .026, -.035, .49, .12, .18, lever);
    mesh('gem', palette[kind], .28, .027, -.012, .123, .101, .09, lever, kind === 'dew' ? palette.dew : 0);
    mesh('gem', 0xf3c07d, -.11, .005, .085, .088, .088, .055, g);
    return { g, base, lever, kind, angle: 0, flash: 0 };
  });
  const seeds = stage.beds.map((c, i) => {
    const p = at(stage.rows, c);
    const pot = new T.Group(); pot.position.copy(p); scene.add(pot);
    box(0xbe7c60, 0, -.09, -.09, .54, .32, .43, pot);
    box(0xe0ae87, 0, .1, -.1, .68, .13, .53, pot);
    box(0x382b29, 0, .176, -.1, .52, .033, .39, pot);
    const flower = new T.Group(); flower.position.y = .18; pot.add(flower);
    box(0x66b876, 0, .24, -.08, .08, .45, .095, flower);
    box(0x4eac73, .12, .15, -.08, .22, .13, .11, flower).rotation.z = .5;
    for (const [x,y] of [[-.14,.42],[.14,.42],[0,.28],[0,.56]]) {
      box(plant[c], x, y, -.04, .155, .16, .14, flower);
    }
    box(0xffda83, 0, .422, .07, .15, .16, .11, flower);
    return { c, i, flower, grow: 0 };
  });
  const mouths = stage.mouths.map(col => {
    const p = at(-1, col);
    return mesh('ring', 0xb98c66, p.x, p.y, .18, .227, .227, .227);
  });
  const seed = mesh('ball', 0xffae60, 0, 0, 0, .16, .16, .16, scene, 0xe16925);
  const traceMaterial = new T.LineBasicMaterial({ color: 0x9aeacf, transparent: true, opacity: .82 });
  const traceGeom = new T.BufferGeometry();
  const tracePoints = new Float32Array(20 * 3);
  traceGeom.setAttribute('position', new T.BufferAttribute(tracePoints, 3));
  const trace = new T.Line(traceGeom, traceMaterial);
  trace.frustumCulled = false;
  scene.add(trace);
  let running = true, raf, age = 0, last = 0, path = [], lastFocus, animated = false, nextFrame;
  let perf = [];
  function updateProjection() {
    const w = Math.max(1, host.clientWidth), h = Math.max(1, host.clientHeight);
    const factor = Math.max(5.84 / h, 6.35 / w);
    camera.left = -w * factor / 2; camera.right = w * factor / 2;
    camera.top = h * factor / 2; camera.bottom = -h * factor / 2;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    renderer.setSize(w, h, false);
    position((r, c) => {
      const p = at(r, c, .54).project(camera);
      return [(p.x + 1) * 50, (1 - p.y) * 50];
    });
  }
  const ro = new ResizeObserver(updateProjection);
  ro.observe(host);
  function contextLoss(e) { e.preventDefault(); onLost(); }
  canvas.addEventListener('webglcontextlost', contextLoss);
  function pose(current, preview, turn, mouth) {
    lastFocus = mouth;
    pegs.forEach((peg, i) => {
      const { lever, base, kind } = peg;
      const d = stage.pegs[i].d * (((current.turned & 1 << i) !== 0) !== (turn === i) ? -1 : 1);
      peg.angle = d * -.39;
      lever.scale.setScalar(i === turn ? 1.18 : 1);
      base.material = material(turn === i ? 0x5fcbaa : 0x755443);
      if (kind === 'dew') lever.visible = !(current.wet & 1 << i);
    });
    seeds.forEach(({ i, flower }) => { flower.visible = current.blooms > i; });
    mouths.forEach((m, i) => { m.material = material(stage.mouths[i] === mouth ? 0xfbd384 : 0xb98c66); });
    trace.visible = Boolean(preview);
    if (preview) {
      preview.path.forEach(({ row, col }, i) => at(row, col, .34).toArray(tracePoints, i * 3));
      traceGeom.setDrawRange(0, preview.path.length);
      traceGeom.attributes.position.needsUpdate = true;
      traceMaterial.color.setHex(preview.matched ? 0x9af6da : 0xffb985);
    }
  }
  function fly(shot, onContact, done) {
    path = shot.path.map(p => at(p.row, p.col));
    age = 0; animated = true;
    seed.visible = true;
    seed.position.copy(path[0]);
    seed.rotation.set(0, 0, 0);
    trace.visible = false;
    let index = 0;
    const period = motion() ? 70 : 152;
    nextFrame = dt => {
      age += dt;
      const next = Math.min(path.length - 1, Math.floor(age / period));
      while (index < next) {
        index++;
        const contact = shot.path[index];
        if (contact.index !== undefined) pegs[contact.index].flash = 1;
        onContact(contact);
      }
      if (index >= path.length - 1) {
        seed.position.copy(path.at(-1));
        nextFrame = undefined;
        animated = false;
        done();
        return;
      }
      const frac = (age % period) / period;
      seed.position.lerpVectors(path[index], path[index + 1], frac);
      seed.position.z += Math.sin(frac * Math.PI) * (motion() ? .04 : .23);
      seed.rotation.x += .003 * dt;
      seed.rotation.z -= .004 * dt;
    };
  }
  seed.visible = false;
  updateProjection();
  function frame(now) {
    if (!running) return;
    const dt = last ? Math.min(now - last, 40) : 0;
    if (last && !paused()) {
      perf.push(now - last);
      if (perf.length > 180) perf.shift();
    }
    last = now;
    if (!paused()) {
      if (animated) nextFrame(dt);
      pegs.forEach(peg => {
        peg.lever.rotation.z += (peg.angle - peg.lever.rotation.z) * (motion() ? 1 : Math.min(1, dt / 70));
        peg.flash = Math.max(0, peg.flash - dt / 140);
        peg.g.position.z = .48 + peg.flash * (motion() ? .04 : .1);
      });
      seeds.forEach(item => {
        if (!item.flower.visible) { item.grow = 0; return; }
        item.grow = Math.min(1, item.grow + dt / (motion() ? 70 : 260));
        item.flower.scale.setScalar(.25 + .75 * Math.sin(item.grow * Math.PI / 2));
      });
    }
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);
  return {
    pose, fly, hideSeed() { seed.visible = false; }, stats: () => ({
      revision: T.REVISION, calls: renderer.info.render.calls, triangles: renderer.info.render.triangles,
      geometries: renderer.info.memory.geometries, textures: renderer.info.memory.textures, dpr: renderer.getPixelRatio(),
      p95: [...perf].sort((a,b) => a-b)[Math.floor(perf.length * .95)] ?? null, mouth: lastFocus,
    }),
    dispose() {
      running = false; cancelAnimationFrame(raf); ro.disconnect();
      canvas.removeEventListener('webglcontextlost', contextLoss);
      Object.values(geo).forEach(g => g.dispose());
      materials.forEach(m => m.dispose()); backdrop.dispose(); traceGeom.dispose(); traceMaterial.dispose();
      renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
    },
  };
}
