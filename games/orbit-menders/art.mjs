import * as THREE from './vendor/three.module.min.js';

// Orbit Menders M1 authored geometry. Local +Y is up, +Z is forward.
// These small immutable geometry/material caches are bounded. Scene ownership
// stays with GameAdapter: collect unique resources during traversal, then dispose.
const box = new THREE.BoxGeometry(1, 1, 1);
const sphere = new THREE.SphereGeometry(1, 32, 20);
const ring = new THREE.TorusGeometry(1, .055, 6, 32);
const materials = new Map();
const palettes = {
  moss: { soil: 0x344746, grass: 0x719a67, light: 0xabc487, trim: 0xeee0b7, accent: 0x50c6bb },
  wind: { soil: 0x3d5571, grass: 0x779cad, light: 0xd3d9ba, trim: 0xf3dfbc, accent: 0xe6aa59 },
  crystal: { soil: 0x353e60, grass: 0x6f729b, light: 0xafa4d8, trim: 0xd4e7e5, accent: 0x71e2da },
  tide: { soil: 0x385c68, grass: 0x689b97, light: 0xa7d2bc, trim: 0xe8dec0, accent: 0x57d9db },
  forge: { soil: 0x3e4654, grass: 0x7d8586, light: 0xc6af87, trim: 0xd1c9b5, accent: 0xf1a15a },
  core: { soil: 0x39445b, grass: 0x76859a, light: 0xa7bbbd, trim: 0xe9e1cb, accent: 0x8bdfd3 },
};
function material(color, metalness = 0, emissive = 0) {
  const key = `${color}:${metalness}:${emissive}`;
  if (!materials.has(key)) materials.set(key, new THREE.MeshStandardMaterial({
    color, metalness, roughness: metalness ? .48 : .82,
    emissive, emissiveIntensity: emissive ? .55 : 0,
  }));
  return materials.get(key);
}
function cube(parent, color, x, y, z, sx, sy, sz, options = {}) {
  const mesh = new THREE.Mesh(box, material(color, options.metalness || 0, options.emissive || 0));
  mesh.position.set(x, y, z); mesh.scale.set(sx, sy, sz);
  mesh.castShadow = options.shadow !== false; mesh.receiveShadow = true;
  mesh.userData.collision = options.collision || 'decorative';
  parent.add(mesh); return mesh;
}
function pivot(parent, x, y, z, name) {
  const group = new THREE.Group(); group.position.set(x, y, z);
  group.name = name; parent.add(group); return group;
}
function instanceBoxes(parent, color, transforms) {
  const mesh = new THREE.InstancedMesh(box, material(color), transforms.length);
  const pose = new THREE.Object3D();
  transforms.forEach((t, i) => {
    pose.position.copy(t.position); pose.quaternion.copy(t.quaternion);
    pose.scale.set(...t.scale); pose.updateMatrix(); mesh.setMatrixAt(i, pose.matrix);
  });
  mesh.instanceMatrix.needsUpdate = true;
  mesh.receiveShadow = true; mesh.castShadow = false;
  mesh.userData.collision = 'decorative-flush-surface'; parent.add(mesh); return mesh;
}

export function createPangolin() {
  const hero = new THREE.Group(); hero.name = 'MaoMao_block_pangolin';
  const body = pivot(hero, 0, .58, -.025, 'body');
  // Warm square anatomy, broad clawed feet, and overlapping armor distinguish
  // the repairer from an unadorned voxel or a smooth primitive animal doll.
  cube(body, 0xb47e4b, 0, .02, 0, .57, .55, .65);
  cube(body, 0xddb77c, 0, -.06, .315, .4, .39, .07);
  const head = pivot(body, 0, .37, .235, 'head');
  cube(head, 0xc89155, 0, .005, .015, .53, .44, .44);
  cube(head, 0xe8c893, 0, -.08, .31, .28, .19, .29);
  cube(head, 0x27363b, 0, -.025, .465, .135, .08, .045);
  for (const side of [-1, 1]) {
    cube(head, 0x9a673e, side * .24, .19, -.04, .1, .13, .1);
    cube(head, 0xf2dcaf, side * .174, .04, .242, .12, .15, .025);
    cube(head, 0x20353b, side * .163, .038, .259, .055, .095, .02);
    cube(head, 0xfff8e4, side * .173 - .013, .068, .272, .026, .028, .012);
    cube(head, 0x775236, side * .17, .15, .24, .15, .04, .04).rotation.z = -side * .12;
  }
  const armor = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 3; col++) {
      const tile = cube(body, [0x665e47, 0x82724d, 0xa18b5d][(row + col) % 3],
        (col - 1) * .188, .28 - row * .115, -.32 - Math.sin(row / 3 * Math.PI) * .045,
        .205, .15, .16);
      tile.rotation.x = -.18 + row * .12; tile.rotation.z = (1 - col) * .07;
      armor.push(tile);
    }
  }
  const legs = [];
  for (const side of [-1, 1]) {
    for (const fore of [-1, 1]) {
      const leg = pivot(hero, side * .225, .32, fore * .22, `leg_${side}_${fore}`);
      cube(leg, 0xa97143, 0, -.085, 0, .155, .27, .18);
      cube(leg, 0x3c5558, 0, -.25, .04, .205, .13, .27);
      for (const claw of [-1, 0, 1]) cube(leg, 0xe3d6b1, claw * .055, -.267, .18, .035, .05, .08);
      legs.push(leg);
    }
  }
  const tail = pivot(hero, 0, .46, -.31, 'tail');
  for (let i = 0; i < 5; i++) {
    cube(tail, i % 2 ? 0x9c8556 : 0x786949, 0, -.055 * i, -.11 - i * .14,
      .34 - i * .05, .22 - i * .025, .205);
  }
  const backpack = pivot(body, -.31, .1, -.07, 'asymmetric_tool_pack');
  backpack.rotation.z = -.12;
  cube(backpack, 0x315d62, -.02, 0, -.11, .2, .39, .25, { metalness: .25 });
  cube(backpack, 0xedb961, -.13, .015, -.08, .07, .27, .17);
  cube(backpack, 0x84d4cd, -.02, .18, .03, .15, .06, .1, { emissive: 0x275a52 });
  cube(backpack, 0xd7caa2, -.035, .29, -.1, .045, .25, .045, { metalness: .4 });
  const glove = pivot(body, .33, -.05, .18, 'rectangular_gravity_glove');
  cube(glove, 0x3b666b, 0, -.045, .06, .18, .27, .22, { metalness: .35 });
  cube(glove, 0xe8b65a, 0, -.02, .2, .26, .22, .11, { metalness: .3 });
  cube(glove, 0x75e7da, 0, -.02, .266, .13, .105, .035, { emissive: 0x3d9e91 });
  const fingers = [];
  for (const side of [-1, 1]) {
    const finger = cube(glove, 0xf1d59b, side * .155, -.02, .21, .055, .26, .1, { metalness: .2 });
    fingers.push(finger);
  }
  cube(body, 0x294b50, 0, -.19, .333, .48, .08, .035);
  cube(body, 0xeac36b, 0, -.19, .359, .1, .1, .035, { metalness: .4 });
  hero.userData.parts = { body, head, legs, tail, glove, fingers, armor, backpack };
  hero.userData.dimensions = { height: 1.25, footOrigin: true, forward: '+Z' };
  return hero;
}

function onSurface(parent, radius, direction, name) {
  const group = new THREE.Group(); group.name = name;
  const normal = new THREE.Vector3(...direction).normalize();
  group.position.copy(normal).multiplyScalar(radius);
  group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
  group.userData.collision = 'decorative'; parent.add(group); return group;
}
function createTree(parent, scale = 1) {
  const tree = new THREE.Group(); tree.scale.setScalar(scale); parent.add(tree);
  cube(tree, 0x786345, 0, .6, 0, .26, 1.2, .28);
  cube(tree, 0x577f58, 0, 1.3, 0, 1.3, .65, 1.05);
  cube(tree, 0x83a563, -.14, 1.8, -.02, .96, .5, .92);
  cube(tree, 0xb4c886, -.19, 2.1, .06, .56, .2, .57);
  cube(tree, 0x6d965b, .61, 1.32, .02, .46, .37, .44);
  return tree;
}
function createWorkshop(parent, scale) {
  const building = new THREE.Group(); parent.add(building); building.scale.setScalar(scale);
  cube(building, 0xe2c693, 0, .68, 0, 1.65, 1.36, 1.35);
  cube(building, 0x466972, 0, 1.43, -.04, 1.9, .2, 1.65);
  cube(building, 0x557e81, 0, 1.61, -.1, 1.5, .18, 1.35);
  cube(building, 0x344e57, -.23, .43, .69, .48, .86, .06);
  cube(building, 0x83d8cc, .47, .85, .69, .4, .39, .045, { emissive: 0x295d55 });
  cube(building, 0xe8b969, .47, .85, .725, .05, .4, .025);
  cube(building, 0xeee1be, -.22, 1.06, .78, .8, .12, .35);
  cube(building, 0x45656b, .56, 1.89, -.35, .22, .6, .23);
  cube(building, 0xd0c6a4, .56, 2.19, -.35, .36, .12, .36);
  return building;
}

export function createPlanet(field) {
  const root = new THREE.Group(); root.name = `planet_${field.id || 'moss'}`;
  const radius = Number.isFinite(field.radius) ? field.radius : 6;
  const palette = palettes[field.theme] || palettes.moss;
  const surface = new THREE.Mesh(sphere, material(palette.soil));
  surface.scale.setScalar(radius); surface.receiveShadow = true;
  surface.userData.collision = 'sphere'; surface.userData.radius = radius; root.add(surface);
  // Flush inset panels echo ceramic workshop plating without a private terrain
  // texture. Most of each slab stays below the collision sphere.
  const poses = [], lightPoses = [], goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const count = radius > 8 ? 180 : 84, size = radius > 8 ? 1.65 : .96;
  for (let i = 0; i < count; i++) {
    const y = 1 - (i + .5) / count * 2;
    const r = Math.sqrt(1 - y * y), a = goldenAngle * i;
    const up = new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r);
    const pose = { position: up.clone().multiplyScalar(radius - .24),
      quaternion: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), up),
      scale: [size, .37, size * .92] };
    (i % 6 === 0 ? lightPoses : poses).push(pose);
  }
  instanceBoxes(root, palette.grass, poses); instanceBoxes(root, palette.light, lightPoses);
  const ceramic = new THREE.Mesh(ring, material(palette.trim, .12));
  ceramic.scale.setScalar(radius + .015); ceramic.rotation.x = Math.PI / 2;
  ceramic.userData.collision = 'decorative-flush-surface'; root.add(ceramic);
  const ornamentScale = Math.min(1.2, radius / 9);
  for (const [i, direction] of [[0, [-.65, .55, -.5]], [1, [.72, .18, -.65]], [2, [-.3, -.85, .4]]]) {
    createTree(onSurface(root, radius, direction, `tree_site_${i}`), ornamentScale * (i === 1 ? .8 : 1));
  }
  createWorkshop(onSurface(root, radius, [.55, -.35, .76], 'exit_workshop'), Math.min(1, radius / 8));
  root.userData.surfaceRadius = radius;
  root.userData.collisionContract = 'Sphere is solid; inset plates, ring, and scenery are decorative. Add authored blockers before accepting scenery collision QA.';
  return root;
}

export function makeAnchor() {
  const root = new THREE.Group(); root.name = 'forked_diamond_anchor';
  cube(root, 0x345960, 0, .1, 0, 1, .2, .95, { metalness: .35 });
  cube(root, 0xf1cf84, 0, .24, 0, .64, .08, .64, { metalness: .35 });
  const gate = pivot(root, 0, 1.08, 0, 'diamond_gate');
  for (const side of [-1, 1]) {
    for (const half of [-1, 1]) {
      const arm = cube(gate, 0x66dfcf, side * .27, half * .27, 0, .12, .73, .15, { metalness: .2, emissive: 0x20665c });
      arm.rotation.z = -side * half * Math.PI / 4;
    }
    const prong = cube(root, 0x42737a, side * .55, .63, 0, .12, .9, .2, { metalness: .4 });
    prong.rotation.z = -side * .15;
  }
  const core = cube(gate, 0xf9e0a1, 0, 0, 0, .17, .17, .22, { emissive: 0x8c6a24 });
  core.rotation.z = Math.PI / 4;
  root.userData.parts = { gate, core }; return root;
}

export function makeTerminal() {
  const root = new THREE.Group(); root.name = 'repair_terminal';
  cube(root, 0x354e54, 0, .1, 0, .7, .2, .7, { metalness: .35 });
  cube(root, 0x537c7a, 0, .54, 0, .38, .8, .38, { metalness: .25 });
  const console = pivot(root, 0, .96, .03, 'console'); console.rotation.x = -.25;
  cube(console, 0xe7c485, 0, 0, 0, .76, .14, .5, { metalness: .25 });
  const display = cube(console, 0x69d7c9, 0, .085, -.06, .51, .035, .2, { emissive: 0x265e54 });
  for (const side of [-1, 1]) cube(console, side < 0 ? 0xf7ddb2 : 0xf1a45c,
    side * .18, .09, .145, .13, .05, .09);
  root.userData.parts = { console, display }; return root;
}

export function makeCheckpoint() {
  const root = new THREE.Group(); root.name = 'safe_checkpoint';
  for (const side of [-1, 1]) {
    cube(root, 0x7ed5bd, side * .45, .035, 0, .09, .07, 1.1, { emissive: 0x194c3d });
    cube(root, 0x7ed5bd, 0, .035, side * .5, .9, .07, .09, { emissive: 0x194c3d });
  }
  cube(root, 0x3d5d60, -.4, .56, -.35, .1, 1.1, .12, { metalness: .3 });
  const flag = cube(root, 0xf2d18c, -.16, 1.02, -.35, .48, .26, .065);
  cube(root, 0x70c9b3, -.16, 1.02, -.309, .12, .12, .03, { emissive: 0x225a49 });
  root.userData.parts = { flag }; return root;
}

export function makeArchive() {
  const root = new THREE.Group(); root.name = 'repair_archive';
  const record = pivot(root, 0, .85, 0, 'archive_record');
  cube(record, 0x366678, 0, 0, 0, .44, .56, .13, { metalness: .25 });
  cube(record, 0xf2d58f, -.19, 0, .01, .07, .61, .18, { metalness: .3 });
  cube(record, 0xf2d58f, .17, .22, .035, .16, .09, .17, { metalness: .3 });
  for (let i = 0; i < 3; i++) cube(record, 0xa4eee0, .025, .12 - i * .12, .082,
    .23 - i * .035, .035, .035, { emissive: 0x3e756b });
  root.userData.parts = { record }; return root;
}

export function makeBridge(options = {}) {
  if (typeof options === 'number') options = { length: options };
  const length = options.length || 4, width = options.width || 2.2;
  const root = new THREE.Group(); root.name = 'ceramic_rail_bridge';
  // Top of deck is local y=0; length follows local Z. The parent supplies the
  // matching physical platform and moves that same platform with this Group.
  cube(root, 0xb1b999, 0, -.14, 0, width, .28, length, { collision: 'authored-platform' });
  for (const side of [-1, 1]) {
    cube(root, 0x355d63, side * (width / 2 - .055), .08, 0, .11, .16, length, { metalness: .3 });
    cube(root, 0x8de0c9, side * (width / 2 - .17), .012, 0, .06, .025, length - .12, { emissive: 0x285e4c });
  }
  for (let z = -length / 2 + .35; z < length / 2; z += .7) {
    cube(root, 0xe3d5b2, 0, .012, z, width - .42, .025, .045);
  }
  root.userData.collision = { type: 'box', halfExtents: [width / 2, .14, length / 2], offset: [0, -.14, 0] };
  return root;
}

export function createDrone() {
  const root = new THREE.Group(); root.name = 'KouKou_three_leaf_tool_drone';
  cube(root, 0xe4c58c, 0, 0, 0, .28, .2, .28, { metalness: .25 });
  cube(root, 0x4ebdaf, 0, .12, 0, .14, .05, .14, { emissive: 0x20564e });
  cube(root, 0x254c54, 0, -.015, .16, .17, .08, .045);
  cube(root, 0xa5eee0, 0, -.015, .19, .1, .035, .02, { emissive: 0x346b62 });
  const rotor = pivot(root, 0, .02, 0, 'tool_leaves');
  for (let i = 0; i < 3; i++) {
    const leaf = pivot(rotor, 0, 0, 0, `tool_leaf_${i}`); leaf.rotation.y = i * Math.PI * 2 / 3;
    cube(leaf, 0x3f7277, 0, 0, -.26, .12, .09, .35, { metalness: .35 });
    cube(leaf, 0xe6cf99, 0, 0, -.44, .25, .1, .14, { metalness: .35 });
    cube(leaf, 0x7be0c9, 0, .065, -.42, .12, .025, .07, { emissive: 0x2d6d5c });
  }
  root.userData.parts = { rotor }; return root;
}
