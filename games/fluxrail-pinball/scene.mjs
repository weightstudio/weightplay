import * as THREE from '../../src/vendor/three/r180-b59af7c93a55a6eb/three.module.min.js?wp-media=551689fe4d88ccb3';
import { aim, closedBy, LANES, returnProgress, RETURN_END, RETURN_OPEN } from './model.mjs?wp-media=551689fe4d88ccb3';

const STEEL = 0xcfe8ed;
const COPPER = 0xef9b54;
const AURORA = 0x9176ff;
const RAIL_X = { L:-2.42, C:0, R:2.42 };
const RAIL_COLORS = { L:0xffb45f, C:0x74f4ef, R:0xbda3ff };
const SIDE_X = { L:-2.84, R:2.84 };
const lerp = THREE.MathUtils.lerp;
const clamp = THREE.MathUtils.clamp;
const pos = (x, y, z) => new THREE.Vector3(x, y, z);

function cubic(a, b, c, d, amount) {
  const k = 1 - amount;
  return a.clone().multiplyScalar(k * k * k)
    .addScaledVector(b, 3 * k * k * amount)
    .addScaledVector(c, 3 * k * amount * amount)
    .addScaledVector(d, amount * amount * amount);
}

function contact(side, progress) {
  const fraction = clamp((progress - RETURN_OPEN) / (RETURN_END - RETURN_OPEN), 0, 1);
  const reach = lerp(.28, 1.7, fraction);
  return pos(SIDE_X[side] + (side === 'L' ? reach : -reach), .62, 3.18 + reach * .13);
}

function target(lane, spread) {
  return pos(RAIL_X[lane] * spread, .62, -3.52);
}

function destination(state) {
  const end = target(state.lane, state.stage.railSpread);
  if (state.hit ? state.hit.blocked : closedBy(state, state.lane)) end.z += .94;
  return end;
}

function ballPosition(state) {
  const p = returnProgress(state);
  const sign = state.side === 'L' ? -1 : 1;
  if (state.phase === 'ready') return pos(3.42, .59, 3.38);
  if (state.phase === 'return') {
    if (state.source === 'serve') {
      const rail = pos(3.42, .6, -3.27);
      if (p < .16) return cubic(pos(3.42,.59,3.38), pos(3.54,.6,1.15), pos(3.5,.6,-1.03), rail, p / .16);
      if (p < RETURN_OPEN) {
        return cubic(rail, pos(sign * 3.7,.6,-4.25), pos(sign * 3.56,.64,1.9),
          contact(state.side, RETURN_OPEN), (p - .16) / (RETURN_OPEN - .16));
      }
      return contact(state.side, p);
    }
    if (p >= RETURN_OPEN && state.source !== 'rescue') return contact(state.side, p);
    if (state.source === 'rescue') {
      const end = contact(state.side, RETURN_OPEN);
      return p < RETURN_OPEN
        ? cubic(pos(0,.65,4.45), pos(sign*1.3,1.3,1.1), pos(sign*3.7,.75,2.4), end, p/RETURN_OPEN)
        : contact(state.side, p);
    }
    const initial = destination(state);
    return cubic(initial, pos(sign * 4.09,.65,-3.55), pos(sign * 4.15,.65,2.66),
      contact(state.side, RETURN_OPEN), p / RETURN_OPEN);
  }
  if (state.phase === 'shot') {
    const start = contact(state.side, state.catchAt);
    const end = destination(state);
    return cubic(start, pos(start.x*.92,.69,1.3), pos(end.x,.7,-1.5), end, p);
  }
  if (state.phase === 'drain' || !state.won) {
    return pos(lerp(sign*1.14, 0, p), lerp(.6,.12,p), lerp(3.41,4.68,p));
  }
  return destination(state);
}

export function mountTable(host, onLoss, onRestore) {
  const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:false, powerPreference:'high-performance' });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.setClearColor(0x0b1924);
  renderer.domElement.setAttribute('aria-hidden','true');
  host.replaceChildren(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x091522, 18, 42);
  const camera = new THREE.OrthographicCamera(-5,5,5,-5, .1, 75);
  camera.position.set(0, 14, 11.7);
  camera.lookAt(0, .12, -.15);
  scene.add(new THREE.HemisphereLight(0xbdeaff, 0x80604e, 2.35));
  const daylight = new THREE.DirectionalLight(0xffdeaf, 2.85);
  daylight.position.set(-4, 9, -4);
  scene.add(daylight);
  const rim = new THREE.DirectionalLight(0x55ceff, 2.10);
  rim.position.set(6, 4, 2);
  scene.add(rim);

  const material = (color, metalness = .12, roughness = .49) => new THREE.MeshStandardMaterial({ color, metalness, roughness });
  const enamel = material(0x122d3a);
  const inlay = material(0x266270, .34);
  const bronze = material(0xb76b43, .36, .37);
  const brass = material(0xeab565, .41, .32);
  const walnut = material(0x663d36, .06);
  const iron = material(0x2c3a4a, .38);
  const dark = material(0x07101b);
  const metal = material(0xa0b2be, .56, .31);
  const jade = material(0x27a7a2, .25);
  const ceramic = material(0xf9e0b7);
  const workFloor = material(0x25333e);
  const stationShell = material(0x275264);
  const slate = material(0x62737e);
  const palette = new Map();
  const placed = new Map();
  const box = new THREE.BoxGeometry(1,1,1);
  const jewel = new THREE.CylinderGeometry(.5,.61,1,8);
  const gearCore = new THREE.CylinderGeometry(.5,.5,1,12);
  const groundGlow = new THREE.MeshBasicMaterial({ color:0x62dff3, transparent:true, opacity:.12, depthWrite:false });

  function solid(parent, geometry, mat, x,y,z, sx=1,sy=1,sz=1) {
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.position.set(x,y,z);
    mesh.scale.set(sx,sy,sz);
    parent.add(mesh);
    return mesh;
  }

  function fixed(mat, x,y,z, sx,sy,sz) {
    if (!placed.has(mat)) placed.set(mat, []);
    placed.get(mat).push([x,y,z,sx,sy,sz]);
  }

  function bakeBoxes() {
    const marker = new THREE.Object3D();
    for (const [mat, rows] of placed) {
      const batch = new THREE.InstancedMesh(box, mat, rows.length);
      rows.forEach(([x,y,z,sx,sy,sz], index) => {
        marker.position.set(x,y,z);
        marker.scale.set(sx,sy,sz);
        marker.updateMatrix();
        batch.setMatrixAt(index, marker.matrix);
      });
      scene.add(batch);
    }
  }

  function steppedPaddle() {
    const shape = new THREE.Shape();
    shape.moveTo(-.25,-.19);
    shape.lineTo(.19,-.25);
    shape.lineTo(1.30,-.16);
    shape.lineTo(1.79,-.09);
    shape.lineTo(1.84,.07);
    shape.lineTo(1.58,.16);
    shape.lineTo(.12,.28);
    shape.lineTo(-.24,.20);
    shape.closePath();
    const mesh = new THREE.ExtrudeGeometry(shape, { depth:.13, bevelEnabled:true, bevelSegments:2, steps:1, bevelThickness:.05, bevelSize:.05 });
    mesh.rotateX(-Math.PI / 2);
    return mesh;
  }

  fixed(workFloor, 0,-.63,-.2, 23,.17,22);
  for (let z=-10; z<=10; z++) {
    fixed(iron, 0,-.537, z, 21,.012,.032);
    if (z % 2 === 0) fixed(iron, -6,-.523,z+.5,.04,.01,1.01);
    else fixed(iron, 6,-.523,z+.5,.04,.01,1.01);
  }
  fixed(iron, 0,-.33, 0, 8.2,.55,10.6);
  fixed(walnut, 0,-.12, 0, 8.1,.63,10.48);
  fixed(dark, 0,-.012,0, 7.73,.55,10.14);
  fixed(enamel, 0,.193,0, 7.72,.12,10.04);
  fixed(inlay, 0,.263,0, 7.44,.027,9.74);

  for (const sign of [-1,1]) {
    fixed(walnut, sign*3.96,.39,0, .23,.47,10.13);
    fixed(bronze, sign*3.96,.63,0, .30,.10,10.2);
    fixed(brass, sign*3.96,.691,0, .09,.03,10.21);
    fixed(enamel, sign*3.73,.34,.05, .11,.12,9.34);
    fixed(jade, sign*3.7,.41,-.92, .06,.022,6.3);
    fixed(iron, sign*3.05,-.48,3.73,.37,.3,.52);
    fixed(iron, sign*3.05,-.48,-3.73,.37,.3,.52);
    for (let j=0;j<6;j++) {
      const z = -4.5 + j*1.7;
      fixed(bronze, sign*4.05,.5,z, .34,.43,.29);
      fixed(brass, sign*4.03,.71,z, .16,.045,.15);
      fixed(iron, sign*3.65,.29,z,.14,.06,.38);
    }
    for (const z of [-5.0,5.0]) {
      fixed(brass, sign*3.96,.57,z,.39,.57,.48);
      fixed(iron, sign*3.95,.878,z,.115,.03,.13);
    }
  }

  for (const z of [-5.02,4.99]) {
    fixed(walnut, 0,.32,z,8.05,.44,.27);
    fixed(bronze,0,.57,z,8.03,.12,.28);
    fixed(brass,0,.647,z,7.94,.024,.10);
  }
  fixed(dark,0,.29,4.44,2.02,.05,.73);
  fixed(iron,0,.32,4.8,2.33,.075,.10);
  for (let i=-4; i<=4; i++) fixed(bronze,i*.22,.347,4.46,.052,.032,.67);

  // The centerline wiring is inset into the same cabinet that owns collision coordinates.
  for (const lane of LANES) {
    const x = RAIL_X[lane];
    fixed(enamel,x,.288,-.98,.72,.045,3.38);
    for (const sign of [-1,1]) {
      fixed(bronze,x+sign*.34,.317,-.98,.045,.058,3.38);
      for (let j=0;j<5;j++) fixed(brass,x+sign*.34,.346,-2.56+j*.72,.14,.06,.16);
    }
  }
  for (const sign of [-1,1]) {
    fixed(iron,sign*2.8,.32,1.35,.82,.16,.38);
    fixed(bronze,sign*2.8,.43,1.35,.58,.10,.42);
    fixed(brass,sign*2.8,.49,1.35,.30,.06,.18);
    fixed(iron,sign*2.84,.32,3.18,1.0,.22,.84);
  }
  for (let i=0;i<8;i++) {
    fixed(i%2 ? jade : iron, 0,.282,1.12+i*.279,.21,.019,.12);
  }
  for (const sign of [-1, 1]) {
    for (let row=0; row<3; row++) for (let col=0; col<4; col++) {
      fixed(col%3===0 ? walnut : iron, sign*(6+col*.5), -.25+row*.36,-4.5-col*.17,.49,.34,.55);
    }
    fixed(stationShell, sign*5.5, .66,-4.7,.78,1.5,.43);
    fixed(bronze, sign*5.5,1.44,-4.7,.91,.17,.51);
    fixed(enamel, sign*5.5,.66,-4.45,.56,.85,.15);
    fixed(brass,sign*5.5,.83,-4.34,.36,.24,.055);
  }
  bakeBoxes();

  function gear(parent, mat, radius, thick, x,y,z) {
    const g = new THREE.Group();
    parent.add(g);
    g.position.set(x,y,z);
    solid(g, gearCore, mat, 0,0,0, radius*1.57,thick,radius*1.57);
    for (let i=0;i<8;i++) {
      const a = Math.PI * i / 4;
      const cog = solid(g, box, mat, Math.cos(a)*radius*.84,0,Math.sin(a)*radius*.84,.35*radius,thick,.36*radius);
      cog.rotation.y = -a;
    }
    solid(g, gearCore, iron, 0,thick*.58,0,radius*.62,thick*.30,radius*.62);
    return g;
  }

  const rails = {};
  for (const lane of LANES) {
    const tint = RAIL_COLORS[lane];
    const lamp = new THREE.MeshStandardMaterial({ color:tint, emissive:tint, emissiveIntensity:.32, metalness:.07, roughness:.34 });
    palette.set(lane,lamp);
    const station = new THREE.Group();
    scene.add(station);
    solid(station, box, dark,0,.33,0,1.34,.16,1.15);
    solid(station, box, bronze,0,.43,0,1.21,.16,1.06);
    solid(station, box, iron,0,.55,0,1.06,.18,.87);
    solid(station, jewel, brass,0,.70,0,1.03,.14,1.03);
    const rotor = gear(station, brass, .49, .13, 0,.82,0);
    solid(rotor, jewel, lamp, 0,.16,0,.53,.20,.53);
    solid(rotor, jewel, ceramic,0,.27,0,.21,.07,.21);
    solid(station, box, lamp,0,.57,.46,.47,.085,.032);
    const ring = solid(station, new THREE.RingGeometry(.61,.77,8).rotateX(-Math.PI/2), groundGlow,0,.288,0);
    const gate = new THREE.Group();
    gate.position.z = -2.58;
    scene.add(gate);
    for (const side of [-1,1]) {
      solid(gate,box,iron,side*.42,.51,0,.20,.48,.25);
      solid(gate,box,brass,side*.42,.79,0,.24,.10,.32);
      solid(gate,box,lamp,side*.42,.66,.145,.11,.15,.025);
    }
    const arm = solid(gate,box,bronze,0,.62,0,.78,.17,.14);
    const armLight = solid(gate,box,lamp,0,.622,.083,.56,.05,.033);
    rails[lane] = { station, rotor, ring, gate, arm, armLight };
  }

  const paddles = {};
  const paddleShape = steppedPaddle();
  for (const side of ['L','R']) {
    const g = new THREE.Group();
    g.position.set(SIDE_X[side], .415, 3.18);
    scene.add(g);
    const sign = side === 'L' ? 1 : -1;
    const paddle = solid(g, paddleShape, brass,0,0,0,sign,1,1);
    const pad = solid(g, box,jade, sign*.92,.164,.008, 1.19,.033,.23);
    pad.rotation.y = sign*.028;
    solid(g, jewel, metal,0,.19,0,.37,.18,.37);
    solid(g,box,ceramic,sign*1.52,.19,-.022,.18,.025,.11);
    const ring = solid(scene, new THREE.RingGeometry(.31,.43,12).rotateX(-Math.PI/2), groundGlow.clone(), SIDE_X[side], .292, 3.18);
    paddles[side] = {group:g,paddle,ring};
  }

  const ballMat = material(STEEL,.35,.19);
  const ball = solid(scene,new THREE.SphereGeometry(.229,20,14),ballMat,0,.6,4);
  const stripe = solid(ball,new THREE.TorusGeometry(.207,.016,8,20), ceramic,0,0,0);
  const shadow = solid(scene, new THREE.CircleGeometry(.31,16).rotateX(-Math.PI/2),
    new THREE.MeshBasicMaterial({ color:0x041220, transparent:true, opacity:.46, depthWrite:false }),0,.281,0);
  const drainLight = solid(scene, box, new THREE.MeshBasicMaterial({color:0x6bf0e3, transparent:true, opacity:0}), 0,.39,4.28,1.8,.08,.09);
  const trailMat = new THREE.MeshBasicMaterial({ color:0x81e4ff, transparent:true, opacity:.48, depthWrite:false });
  const trail = Array.from({ length:7 }, (_, i) => solid(scene,new THREE.SphereGeometry(.075,9,6),trailMat,0,.4,0,1-i*.10,1-i*.10,1-i*.10));

  // Rux is cut from the same stepped-anatomy shapes as the approved reference.
  const rux = new THREE.Group();
  rux.position.set(-3.53, .29, -4.24);
  rux.scale.setScalar(.53);
  rux.rotation.y = .23;
  scene.add(rux);
  const hood = material(0x87929f);
  const leather = material(0x895334);
  const ear = material(0xd58f77);
  for (const sign of [-1,1]) {
    solid(rux,box,slate,sign*.41,.33,0,.65,.62,.61);
    solid(rux,box,bronze,sign*.41,.13,.21,.62,.26,.92);
    solid(rux,box,brass,sign*.43,.14,.67,.18,.18,.11);
  }
  solid(rux,box,slate,0,1.03,0,1.42,1.17,.76);
  solid(rux,box,jade,0,1.56,.14,1.51,.29,.82);
  solid(rux,box,leather,0,.76,.04,1.51,.26,.85);
  solid(rux,box,brass,0,.76,.49,.34,.34,.13);
  solid(rux,box,bronze,0,1.28,-.58,1.18,.92,.64);
  solid(rux,box,brass,.35,1.89,-.7,.26,.43,.31);
  solid(rux,box,rails.C.armLight.material,-.34,1.31,-.92,.27,.45,.062);
  const head = new THREE.Group();
  head.position.y = 1.87;
  rux.add(head);
  solid(head,box,hood,0,.49,0,1.62,1.09,1.04);
  solid(head,box,slate,0,.12,.62,1.35,.50,.63);
  solid(head,box,hood,0,.17,.92,1.26,.40,.24);
  for (const sign of [-1,1]) {
    solid(head,box,hood,sign*.59,1.18,0,.43,.55,.38);
    solid(head,box,ear,sign*.59,1.20,.204,.26,.33,.04);
    solid(head,box,dark,sign*.40,.17,1.057,.17,.18,.034);
    solid(head,box,dark,sign*.43,.53,.534,.34,.35,.052);
    solid(head,box,ceramic,sign*.43,.514,.565,.23,.24,.049);
    solid(head,box,dark,sign*.38,.51,.594,.14,.18,.041);
    solid(head,box,brass,sign*.43,.92,.45,.45,.32,.25);
    solid(head,box,jade,sign*.43,.92,.592,.31,.20,.075);
  }
  const horn = gear(head, brass,.38,.19,0,.44,.97);
  horn.rotation.x = Math.PI*.5;
  const armPivots = [];
  for (const sign of [-1,1]) {
    const arm = new THREE.Group();
    arm.position.set(sign*.89,1.38,0);
    rux.add(arm);
    solid(arm,box,jade,0,-.16,0,.49,.40,.49);
    solid(arm,box,slate,0,-.54,.04,.43,.54,.43);
    solid(arm,box,bronze,0,-.51,.259,.44,.19,.12);
    solid(arm,box,hood,0,-.85,.11,.46,.26,.45);
    armPivots.push(arm);
  }

  let lost = false;
  let removed = false;
  let lastFinish = null;
  let lastWidth = 0, lastHeight = 0;
  let strikeSide = '', strikeTime = -Infinity, contactLane = '', contactTime = -Infinity;
  let trailCount = 0, trailClock = 0;
  let lastChapter = 0;
  let lastCall = 0;
  let samples = [];
  const stats = () => {
    const ranked = [...samples].sort((a,b) => a-b);
    return {
      revision:THREE.REVISION, dpr:renderer.getPixelRatio(), calls:renderer.info.render.calls,
      triangles:renderer.info.render.triangles, geometries:renderer.info.memory.geometries,
      textures:renderer.info.memory.textures, frames:ranked.length,
      p50:ranked[Math.floor(ranked.length*.5)] ?? 0, p95:ranked[Math.floor(ranked.length*.95)] ?? 0,
    };
  };

  function resize() {
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (!width || !height || (width === lastWidth && height === lastHeight)) return;
    lastWidth = width;
    lastHeight = height;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height, false);
    const aspect = width / height;
    const span = Math.max(9.64,9.22/aspect) / 2;
    camera.left = -span*aspect;
    camera.right = span*aspect;
    camera.top = span;
    camera.bottom = -span;
    camera.updateProjectionMatrix();
  }

  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();

  function contextLost(event) {
    event.preventDefault();
    lost = true;
    onLoss();
  }

  function contextRestored() {
    lost = false;
    onRestore();
  }

  renderer.domElement.addEventListener('webglcontextlost', contextLost);
  renderer.domElement.addEventListener('webglcontextrestored', contextRestored);

  function respond(event, state, motionTime) {
    if (event.type === 'strike') {
      strikeSide = state.side;
      strikeTime = motionTime;
    }
    if (event.lane && event.type !== 'strike') {
      contactLane = event.lane;
      contactTime = motionTime;
    }
  }

  function render(state, finish, time, reduced) {
    if (lost || removed) return;
    resize();
    if (state.stage.chapter !== lastChapter) {
      lastChapter = state.stage.chapter;
      const night = lastChapter > 1;
      inlay.color.setHex(night ? 0x214560 : 0x296574);
      daylight.color.setHex(night ? 0xb5d9ff : 0xffdeaf);
      rim.color.setHex(night ? 0xaab3ff : 0x55ceff);
      scene.fog.color.setHex(night ? 0x10152e : 0x091522);
      renderer.setClearColor(night ? 0x10152e : 0x0b1924);
    }
    if (finish !== lastFinish) {
      lastFinish = finish;
      const color = finish === 'copper' ? COPPER : finish === 'aurora' ? AURORA : STEEL;
      ballMat.color.setHex(color);
      for (const {paddle} of Object.values(paddles)) {
        if (paddle.material !== brass) paddle.material.dispose();
        paddle.material = finish === 'steel' ? brass : material(color,.38,.35);
      }
    }

    const current = aim(state);
    const goal = state.stage.order[state.index];
    const contactKick = clamp(1 - (time-contactTime)/280,0,1);
    const strikeKick = clamp(1 - (time-strikeTime)/255,0,1);
    for (const lane of LANES) {
      const { station, rotor, gate, arm, armLight, ring } = rails[lane];
      const location = target(lane,state.stage.railSpread);
      station.position.set(location.x,0,location.z);
      gate.position.x = location.x;
      gate.visible = lane !== 'C' && state.stage.magnetic;
      const blocked = !!closedBy(state,lane);
      arm.position.y = blocked ? .59 : .91;
      armLight.position.y = arm.position.y;
      arm.rotation.z = blocked ? 0 : .12;
      const impact = lane === contactLane ? contactKick : 0;
      rotor.position.y = .82 - impact*.094;
      rotor.rotation.y = reduced ? 0 : time*.00062 + impact*.58;
      const enabled = (goal === lane || current === lane) && !blocked;
      palette.get(lane).emissiveIntensity = .17 + (enabled ? .95 : 0) + impact*1.3;
      ring.visible = goal === lane || state.won;
      ring.scale.setScalar(1 + impact*.15);
    }
    for (const [side, {group,ring}] of Object.entries(paddles)) {
      const ready = (side === state.side && state.phase === 'return') || state.phase === 'ready';
      const attack = side === strikeSide ? strikeKick : 0;
      group.rotation.y = (side === 'L' ? 1 : -1) * (-.13 + (reduced ? .38 : .76)*attack);
      ring.visible = ready || attack > 0;
      ring.material.opacity = current && ready ? .58 : .18 + attack*.4;
    }
    const point = ballPosition(state);
    ball.position.copy(point);
    ball.visible = state.phase !== 'complete' || state.won;
    ball.rotation.set(time*.003, time*.0025, time*.00075);
    stripe.visible = finish !== 'steel';
    shadow.position.set(point.x,.282,point.z);
    shadow.scale.setScalar(1+(point.y-.60)*.24);
    drainLight.material.opacity = state.shield ? .96 : 0;
    const moving = state.phase === 'shot' || state.phase === 'return';
    if (time-trailClock > 29 && moving && !reduced) {
      for (let i=trail.length-1;i>0;i--) trail[i].position.copy(trail[i-1].position);
      trail[0].position.copy(point);
      trailCount = Math.min(trail.length, trailCount+1);
      trailClock = time;
    }
    if (!moving || reduced) trailCount=0;
    trail.forEach((mesh, i) => { mesh.visible = moving && !reduced && i<trailCount; });
    armPivots[0].rotation.x = -(strikeKick*.66);
    armPivots[1].rotation.x = -(contactKick*.36);
    head.rotation.x = reduced ? 0 : -strikeKick*.14;
    horn.rotation.y = state.won && !reduced ? time*.004 : 0;
    const elapsed = lastCall ? time-lastCall : 0;
    if (elapsed>0 && elapsed<250) {
      samples.push(elapsed);
      if (samples.length>180) samples.shift();
    }
    lastCall = time;
    renderer.render(scene,camera);
  }

  function dispose() {
    if (removed) return;
    removed = true;
    observer.disconnect();
    renderer.domElement.removeEventListener('webglcontextlost', contextLost);
    renderer.domElement.removeEventListener('webglcontextrestored', contextRestored);
    const geometries = new Set();
    const materials = new Set();
    scene.traverse(node => {
      if (node.geometry) geometries.add(node.geometry);
      if (node.material) materials.add(node.material);
      if (node.isInstancedMesh) node.dispose();
    });
    for (const geometry of geometries) geometry.dispose();
    for (const item of materials) item.dispose();
    for (const item of [groundGlow,brass,metal,workFloor,stationShell]) {
      if (!materials.has(item)) item.dispose();
    }
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement.remove();
    samples = [];
  }

  return { render, respond, dispose, stats };
}
