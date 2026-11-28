import * as T from '../../src/vendor/three/r180-b59af7c93a55a6eb/three.module.min.js?wp-media=ad19a5c18bce29d5';
import { WIDTH, DEPTH } from './stages.mjs?wp-media=ad19a5c18bce29d5';
import { gateState } from './model.mjs?wp-media=ad19a5c18bce29d5';

const STONE = 0x465a55;
const GOLD = 0xf3a85c;
const MINT = 0x7be6c0;
const COPPER = 0xa96043;
const NIGHT = 0x0d222b;

export function openGarden(host, stage, reduced) {
  const renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
  renderer.setClearColor(NIGHT, 0);
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  host.replaceChildren(canvas);
  const scene = new T.Scene();
  const camera = new T.OrthographicCamera(-8, 8, 10, -10, .1, 110);
  camera.position.set(0, 20, 12);
  camera.lookAt(0, 0, 0);
  scene.add(new T.HemisphereLight(0xcaf0e6, 0x716458, 1.15));
  const key = new T.DirectionalLight(0xffdbb2, 2.45);
  key.position.set(-7, 9, 7);
  scene.add(key);

  const box = new T.BoxGeometry(1, 1, 1);
  const oct = new T.OctahedronGeometry(1);
  const pool = new Map();
  const materials = new Set();
  const geometries = new Set([box, oct]);
  const color = (value, emission = 0) => {
    const k = value + ':' + emission;
    if (!pool.has(k)) {
      const material = new T.MeshStandardMaterial({ color: value, roughness: .76,
        emissive: value, emissiveIntensity: emission, metalness: .08 });
      pool.set(k, material);
      materials.add(material);
    }
    return pool.get(k);
  };
  function mesh(parent, material, x, y, z, w, h, d, geometry = box) {
    const object = new T.Mesh(geometry, material);
    object.position.set(x, y, z);
    object.scale.set(w, h, d);
    parent.add(object);
    return object;
  }
  const tile = color(STONE);
  mesh(scene, color(0x22392d), 0, -.52, 0, 16, .62, 21);
  mesh(scene, tile, 0, -.23, 0, WIDTH, .4, DEPTH);
  const paving = new T.InstancedMesh(box, color(0xffffff), 188);
  const m = new T.Object3D();
  for (let i = 0; i < paving.count; i++) {
    const x = i % 12;
    const z = Math.floor(i / 12);
    m.position.set(x - 5.5, -.016, z * 1.13 - 8.42);
    m.scale.set(.965, .13, 1.087);
    m.updateMatrix();
    paving.setMatrixAt(i, m.matrix);
    const hue = (x + z) % 8;
    paving.setColorAt(i, new T.Color().setHSL(stage.night ? .53 : .47, .18, .19 + hue * .012));
  }
  scene.add(paving);

  const hedge = new T.InstancedMesh(box, color(0xffffff), 54);
  const petals = new T.InstancedMesh(oct, color(0xffffff), 112);
  for (let i = 0; i < hedge.count; i++) {
    const side = i % 2 ? -1 : 1;
    m.position.set(side * (6.2 + (i % 5) * .24), .26, (i >> 1) * .7 - 9.1);
    m.scale.set(.95, .42 + (i % 7) * .085, .78);
    m.rotation.y = (i % 3) * .15;
    m.updateMatrix();
    hedge.setMatrixAt(i, m.matrix);
    hedge.setColorAt(i, new T.Color().setHSL(.43 + (i % 3) * .02, .29, .23 + (i % 3) * .031));
  }
  for (let i = 0; i < petals.count; i++) {
    const j = i % 7;
    const k = Math.floor(i / 7);
    const side = k % 2 ? -1 : 1;
    m.position.set(side * (6.37 + (k % 3) * .24) + Math.cos(j) * .26, .64 + (j % 3) * .06,
      (k >> 1) * 2.09 - 7.3 + Math.sin(j) * .26);
    m.scale.set(.29, .19, .30);
    m.rotation.y = j * .65;
    m.updateMatrix();
    petals.setMatrixAt(i, m.matrix);
    petals.setColorAt(i, new T.Color([0xe38b59, 0xb84678, 0xdcb26e, 0x8d5fb0][k % 4]));
  }
  scene.add(hedge, petals);
  const paths = new T.InstancedMesh(box, color(0xefb57a, .12), 56);
  for (let i = 0; i < paths.count; i++) {
    m.position.set((i % 2 ? -1 : 1) * 5.89, .071, Math.floor(i / 2) * .64 - 8.65);
    m.scale.set(.11, .025, .28);
    m.rotation.y = 0;
    m.updateMatrix();
    paths.setMatrixAt(i, m.matrix);
  }
  scene.add(paths);
  if (stage.shelter) {
    const fabric = color(0x386d66);
    mesh(scene, fabric, -4.65, .07, 0, 2.1, .07, 2.4);
    mesh(scene, fabric, 4.65, .07, 0, 2.1, .07, 2.4);
  }
  const gates = stage.gates.map(gate => {
    const bronze = color(0xa37055);
    const leftEdge = gate.side ? -4.52 : -6;
    const rightEdge = -leftEdge;
    const left = gate.center - 1.66;
    const right = gate.center + 1.66;
    mesh(scene, color(0x315552), (leftEdge + left) / 2, .31, gate.z, left - leftEdge, .59, .18);
    mesh(scene, color(0x315552), (rightEdge + right) / 2, .31, gate.z, rightEdge - right, .59, .18);
    for (const x of [left, right]) {
      mesh(scene, bronze, x, .55, gate.z, .24, 1.0, .32);
      mesh(scene, color(GOLD,.24), x, 1.12, gate.z, .36,.16,.36);
    }
    const wing = color(0xb36745);
    const a = mesh(scene, wing, gate.center - .8, .34, gate.z, 1.65, .56, .21);
    const b = mesh(scene, wing, gate.center + .8, .34, gate.z, 1.65, .56, .21);
    return { a, b, gate };
  });

  const player = new T.Group();
  scene.add(player);
  const lanternGlow = new T.PointLight(0xffbd7a, 21, 5.2, 2);
  scene.add(lanternGlow);
  const lamp = new T.Group();
  player.add(lamp);
  const charcoal = color(0x232e33);
  const darkBrass = color(0x7c4935);
  const warmGlass = color(0xffd49a, 1.08);
  const lantern = mesh(lamp, darkBrass, 0, .19, -.28, 1.07,.28,.87);
  mesh(lamp, warmGlass, 0,.59,-.28,.62,.63,.57);
  mesh(lamp, darkBrass, 0,.95,-.28,.86,.14,.77);
  mesh(lamp, color(COPPER), 0,1.083,-.28,.57,.16,.51);
  for (const x of [-.49,.49]) mesh(lamp, charcoal,x,.17,-.28,.19,.37,.6);
  const raccoon = new T.Group();
  player.add(raccoon);
  const fur = color(0xaf7855);
  const lightFur = color(0xe9c69d);
  const mask = color(0x384648);
  mesh(raccoon, fur, 0,.56,.55,.66,.68,.55);
  mesh(raccoon, color(0x247f77), 0,.89,.54,.74,.19,.60);
  mesh(raccoon, color(MINT), .22,.73,.24,.15,.27,.095);
  mesh(raccoon, fur, 0,1.11,.53,.84,.66,.68);
  mesh(raccoon, lightFur, 0,1.03,.15,.5,.28,.28);
  mesh(raccoon, mask, 0,1.11,.001,.18,.11,.08);
  for (const x of [-.27,.27]) {
    mesh(raccoon, mask,x,1.24,.182,.265,.22,.08);
    mesh(raccoon, color(0xf8ead3), x,1.25,.136,.095,.105,.035);
    mesh(raccoon, charcoal, x,1.55,.59,.257,.23,.27);
  }
  const paws = [-.23,.23].map(x => mesh(raccoon, charcoal, x,.19,.55,.26,.37,.26));
  mesh(raccoon, fur, 0,.34,1.02,.34,.32,.54);
  mesh(raccoon, mask, 0,.49,1.32,.32,.29,.22);
  mesh(raccoon, fur, 0,.59,1.47,.27,.24,.2);

  const auraGeometry = new T.RingGeometry(.96, 1, 64);
  geometries.add(auraGeometry);
  const shadows = new T.CircleGeometry(1, 28);
  geometries.add(shadows);
  const shadowMat = new T.MeshBasicMaterial({color:0x161d25, opacity:.49, transparent:true, depthWrite:false});
  materials.add(shadowMat);
  const shadow = mesh(scene, shadowMat,0,.09,0,.72,1.15,1,shadows);
  shadow.rotation.x = -Math.PI / 2;
  const auraMat = new T.MeshBasicMaterial({ color: MINT, transparent: true, opacity: .62, side: T.DoubleSide, depthWrite: false });
  materials.add(auraMat);
  const aura = mesh(scene, auraMat, 0, .08, 0, 3, 3, 3, auraGeometry);
  aura.rotation.x = -Math.PI / 2;

  const lightNodes = Array.from({ length: stage.total }, () => {
    const group = new T.Group();
    scene.add(group);
    const spark = mesh(group, color(0xffe7b0, 1.2), 0, 0, 0, .36,.34,.36);
    const rim = mesh(group, color(GOLD,.8), 0, 0, 0, .32,.065,.32);
    const tail = mesh(scene,color(MINT,.75),0,.092,0,.06,.02,1);
    return { group, spark, rim, tail };
  });
  const stands = [];
  for (const [i,lane] of stage.lanes.entries()) {
    const shared = stands.find(stand => stand.x===lane.end.x && stand.z===lane.end.z);
    if (shared) {
      shared.lanes.push(i);
      continue;
    }
    const group = new T.Group();
    group.position.set(lane.end.x,.08,lane.end.z);
    scene.add(group);
    const hot = lane.shape ? 0xf288cc : 0xffc866;
    const base = color(lane.shape ? 0x875186 : 0x9a754c);
    const seat = mesh(group, base, 0,.09,0, 1.56,.18,1.56);
    if (lane.shape) seat.rotation.y = Math.PI / 4;
    const crown = Array.from({length:lane.shape ? 4 : 6}, (_, k) => {
      const angle = k * Math.PI * 2 / (lane.shape ? 4 : 6);
      const petal = mesh(group, color(hot,.2), Math.sin(angle) * .70,.28, Math.cos(angle) * .70, .33,.23,.51, oct);
      petal.rotation.y = angle;
      return petal;
    });
    const core = mesh(group,color(hot,.8),0,.27,0,.37,.19,.37,oct);
    stands.push({ crown,core,color:hot,x:lane.end.x,z:lane.end.z,lanes:[i] });
  }

  const cursor = new T.Vector3(), pointer = new T.Vector2();
  const ray = new T.Raycaster();
  const ground = new T.Plane(new T.Vector3(0, 1, 0), 0);
  let last = null;
  let yaw = 0;
  let clock = 0;
  let turned = false;
  function resize() {
    const width = host.clientWidth, height = host.clientHeight;
    if (!width || !height) return;
    const ratio = width / height;
    turned = height < 420 && ratio > 1.4;
    camera.position.set(turned ? 12 : 0, 20, turned ? 0 : 12);
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();
    const visibleDepth = turned ? Math.max(6.45, 9.7 / ratio) : Math.max(9.5, 6.55 / ratio);
    camera.top = visibleDepth;
    camera.bottom = -visibleDepth;
    camera.left = -visibleDepth * ratio;
    camera.right = visibleDepth * ratio;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function pick(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    pointer.set((clientX - rect.left) * 2 / rect.width - 1, 1 - (clientY - rect.top) * 2 / rect.height);
    ray.setFromCamera(pointer, camera);
    return ray.ray.intersectPlane(ground, cursor) ? { x: cursor.x, z: cursor.z } : null;
  }

  function project(x,z,elevation=.45,logical=false) {
    const rect = logical ? {width:canvas.clientWidth,height:canvas.clientHeight} : canvas.getBoundingClientRect();
    cursor.set(x, elevation, z).project(camera);
    return { x: (cursor.x + 1) * rect.width / 2, y: (1 - cursor.y) * rect.height / 2 };
  }

  function draw(run, dt, brass = false) {
    clock += reduced.matches ? 0 : dt;
    const gone = last && Math.hypot(run.lamp.x - last.x, run.lamp.z - last.z);
    if (gone > .006) {
      const angle = Math.atan2(last.x - run.lamp.x,last.z - run.lamp.z);
      const delta = Math.atan2(Math.sin(angle-yaw),Math.cos(angle-yaw));
      yaw += delta * .2;
    }
    last = { ...run.lamp };
    player.position.set(run.lamp.x, .08, run.lamp.z);
    lanternGlow.position.set(run.lamp.x, 1.35, run.lamp.z);
    shadow.position.set(run.lamp.x,.105,run.lamp.z + .22);
    player.rotation.y = yaw;
    paws.forEach((paw,i) => {
      paw.rotation.x = gone > .006 && !reduced.matches ? Math.sin(clock * 19 + i * Math.PI) * .42 : 0;
    });
    lantern.material = brass ? color(GOLD, .25) : darkBrass;
    aura.position.set(run.lamp.x,.13,run.lamp.z);
    const boosted = run.ability > 0;
    aura.scale.setScalar(run.kit.radius + (boosted && run.kit.id !== 'wind' ? .65 : 0));
    const tint = run.filter ? (run.focus ? 0xf39ed9 : GOLD) : MINT;
    auraMat.color.setHex(boosted ? (run.kit.id === 'wind' ? 0x9ef5ff : 0xffedbf) : tint);
    auraMat.opacity = run.ability > 0 ? .9 : run.following ? .67 : .38;
    for (const item of gates) {
      const state = gateState(item.gate,run.elapsed);
      item.a.position.x = item.gate.center - (state.open ? 1.97 : .81);
      item.b.position.x = item.gate.center + (state.open ? 1.97 : .81);
      item.a.material = item.b.material = color(state.warning ? GOLD : state.open ? MINT : COPPER,.2);
    }
    for (const stand of stands) {
      const arrivals = stand.lanes.reduce((n,i)=>n+run.stands[i].count,0);
      const flare = Math.max(...stand.lanes.map(i=>run.stands[i].flare));
      stand.core.scale.setScalar(.19 + arrivals * .1 + flare * .18);
      stand.crown.forEach(petal => {
        petal.position.y = .27 + arrivals * .074 + flare * (reduced.matches ? .05 : .24);
        petal.rotation.x = arrivals * .19;
        petal.material = color(stand.color,arrivals ? .52 : .16);
      });
    }
    lightNodes.forEach(({ group, spark, rim, tail },i) => {
      const light = run.lights[i];
      group.visible = Boolean(light && !light.seated);
      tail.visible = Boolean(group.visible && light.caught);
      if (!group.visible) return;
      group.position.set(light.x,.55 + Math.sin(clock * 3.3 + i) * .14,light.z);
      spark.rotation.y = clock * 2.4 + i;
      const shape = run.stands[light.group].shape;
      spark.material = color(shape ? 0xf5a6ec : 0xffe1a1,light.caught ? 1.30 : .57);
      rim.rotation.y = shape ? Math.PI/4 : 0;
      rim.visible = light.caught || light.held || light.sheltered > 0;
      rim.material = color(light.held ? 0xedbaff : light.sheltered > 0 ? MINT : GOLD,.8);
      if (tail.visible) {
        const dx = run.lamp.x - light.x, dz = run.lamp.z - light.z;
        tail.position.set(light.x + dx * .2,.123,light.z + dz * .2);
        tail.rotation.y = Math.atan2(dx,dz);
        tail.scale.z = Math.hypot(dx,dz) * .39;
      }
    });
    renderer.render(scene,camera);
  }

  function dispose() {
    for (const geometry of geometries) geometry.dispose();
    for (const material of materials) material.dispose();
    hedge.dispose();
    paving.dispose();
    petals.dispose();
    paths.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  }
  return { canvas, draw, pick, project, resize, dispose, turned: () => turned,
    stats: () => [renderer.info.render.calls,renderer.info.render.triangles,renderer.info.memory.geometries,renderer.info.memory.textures] };
}
