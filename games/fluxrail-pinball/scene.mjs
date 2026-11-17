import * as THREE from '../../src/vendor/three/r180-b59af7c93a55a6eb/three.module.min.js?wp-media=6a11f491c1d7042e';
import { aim, closedBy, LANES, returnProgress, RETURN_END, RETURN_OPEN } from './model.mjs?wp-media=6a11f491c1d7042e';

const STEEL = 0xcfe8ed;
const COPPER = 0xef9b54;
const AURORA = 0x9176ff;
const RAIL_X = { L:-2.42, C:0, R:2.42 };
const RAIL_COLORS = { L:0xffb45f, C:0x74f4ef, R:0xbda3ff };
const SIDE_X = { L:-2.84, R:2.84 };
const lerp = THREE.MathUtils.lerp;
const clamp = THREE.MathUtils.clamp;
const pos = (x, y, z) => new THREE.Vector3(x, y, z);

export const FLIPPER_STROKE_MS = 150;

function flipperLift(elapsed) {
  const rise = 24;
  if (elapsed < rise) return .72 + .28*elapsed/rise;
  return Math.pow(clamp(1 - (elapsed-rise)/(FLIPPER_STROKE_MS-rise), 0, 1), 1.4);
}

function projectedTableBounds(camera, mascot) {
  const cabinet = new THREE.Box3(pos(-4.24,-.61,-5.3),pos(4.24,.9,5.3));
  const bounds = new THREE.Box2();
  camera.updateMatrixWorld(true);
  for (const {min,max} of [cabinet, new THREE.Box3().setFromObject(mascot)]) {
    for (const x of [min.x,max.x]) {
      for (const y of [min.y,max.y]) {
        for (const z of [min.z,max.z]) {
          const view = pos(x,y,z).applyMatrix4(camera.matrixWorldInverse);
          bounds.expandByPoint(new THREE.Vector2(view.x,view.y));
        }
      }
    }
  }
  return bounds;
}

function horizontalShape(points, depth, bevel) {
  const shape = new THREE.Shape(points.map(([x,z]) => new THREE.Vector2(x,-z)));
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth, steps:1, bevelEnabled:true, bevelSegments:2, bevelSize:bevel, bevelThickness:bevel,
  });
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}

function cabinetPanel(width, length, corner, depth, bevel) {
  const x = width/2, z = length/2;
  return horizontalShape([
    [-x+corner,-z],[x-corner,-z],[x,-z+corner],[x,z-corner],
    [x-corner,z],[-x+corner,z],[-x,z-corner],[-x,-z+corner],
  ],depth,bevel);
}

function circularPath(x,z,radius,start,end,segments) {
  return Array.from({length:segments+1},(_,index) => {
    const angle = lerp(start,end,index/segments);
    return [x+Math.cos(angle)*radius,z+Math.sin(angle)*radius];
  });
}

function etchedLines(paths, width) {
  const positions = [];
  for (const path of paths) {
    for (let index=1;index<path.length;index++) {
      const [a,b] = path[index-1], [c,d] = path[index];
      const length = Math.hypot(c-a,d-b);
      const x = -(d-b)*width/(2*length), z = (c-a)*width/(2*length);
      positions.push(a+x,0,b+z,c+x,0,d+z,a-x,0,b-z,
        a-x,0,b-z,c+x,0,d+z,c-x,0,d-z);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  return geometry;
}

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
  renderer.toneMappingExposure = 1;
  renderer.setClearColor(0x0b1924);
  renderer.domElement.setAttribute('aria-hidden','true');
  host.replaceChildren(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x081d30, 22, 39);
  const camera = new THREE.OrthographicCamera(-5,5,5,-5, .1, 75);
  camera.position.set(0, 18, 10.4);
  camera.lookAt(0, .12, -.15);
  scene.add(new THREE.HemisphereLight(0xb3d8ef, 0x74412b, 1.86));
  const daylight = new THREE.DirectionalLight(0xffc196, 3.1);
  daylight.position.set(-4, 9, -4);
  scene.add(daylight);
  const rim = new THREE.DirectionalLight(0x65cfff, 2.46);
  rim.position.set(5, 6, 3);
  scene.add(rim);

  const material = (color, metalness = .12, roughness = .49) => new THREE.MeshStandardMaterial({ color, metalness, roughness });
  const enamel = material(0x142736, .28, .41);
  const inlay = new THREE.MeshPhysicalMaterial({
    vertexColors:true, metalness:.16, roughness:.45, clearcoat:.65, clearcoatRoughness:.39,
  });
  const bronze = material(0xa64528, .5, .34);
  const brass = material(0xdca347, .47, .24);
  const walnut = material(0x44241f, .07);
  const iron = material(0x1a2e41, .36);
  const dark = material(0x09101d);
  const metal = material(0x95abbf, .57, .26);
  const jade = material(0x108783, .27, .29);
  const ceramic = material(0xffdb9b);
  const workFloor = new THREE.MeshBasicMaterial({color:0x1a2230});
  const floorSeam = new THREE.MeshBasicMaterial({color:0x101721});
  const stationShell = material(0x0b3542, .35, .38);
  const edgeLight = new THREE.MeshBasicMaterial({color:0x2eaca9});
  const ember = new THREE.MeshBasicMaterial({color:0xffa343});
  const slate = material(0x62737e);
  const palette = new Map();
  const placed = new Map();
  const box = new THREE.BoxGeometry(1,1,1);
  const jewel = new THREE.CylinderGeometry(.5,.61,1,8);
  const gearCore = new THREE.CylinderGeometry(.5,.5,1,12);
  const gearTeeth = horizontalShape(Array.from({length:40},(_,index) => {
    const angle = index*Math.PI/20;
    const radius = index%4===1 || index%4===2 ? .97 : .78;
    return [Math.cos(angle)*radius,Math.sin(angle)*radius];
  }),1,.034);
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

  fixed(workFloor,0,-.68,0,23,.17,22);
  for (let z=-10;z<=10;z++) {
    fixed(floorSeam,0,-.588,z,21,.012,.036);
    for (let x=-9;x<=9;x+=2.4) {
      fixed(floorSeam,x+(z%2===0 ? -1.2 : 1.2),-.583,z+.51,.036,.013,1.01);
    }
  }
  solid(scene,cabinetPanel(8.07,10.28,.30,.34,.10),iron,0,-.49,0);
  solid(scene,cabinetPanel(8.08,10.24,.26,.27,.09),walnut,0,-.17,0);
  solid(scene,cabinetPanel(7.95,10.21,.22,.12,.077),bronze,0,.02,0);
  fixed(enamel,0,.136,0,7.78,.23,10.04);

  const field = new THREE.PlaneGeometry(7.42,9.74,44,58);
  field.rotateX(-Math.PI/2);
  const fieldPositions = field.getAttribute('position');
  const fieldColors = new Float32Array(fieldPositions.count*3);
  const fieldTint = new THREE.Color();
  function colorField(night) {
    const edge = new THREE.Color(night ? 0x101b39 : 0x092135);
    const center = new THREE.Color(night ? 0x3068a0 : 0x1c7580);
    for (let i=0;i<fieldPositions.count;i++) {
      const x = fieldPositions.getX(i), z = fieldPositions.getZ(i);
      const light = Math.exp(-(x*x*.105+(z+1.6)**2*.056));
      const lacquer = .97 + .026*Math.sin(x*26+z*10);
      fieldTint.copy(edge).lerp(center,light*.82).multiplyScalar(lacquer);
      fieldTint.toArray(fieldColors,i*3);
    }
    field.getAttribute('color').needsUpdate = true;
  }
  field.setAttribute('color',new THREE.BufferAttribute(fieldColors,3));
  solid(scene,field,inlay,0,.275,0);
  const outerLine = [[-3.50,-4.60],[3.50,-4.60],[3.55,-4.54],[3.55,4.44],[3.23,4.67],
    [-3.23,4.67],[-3.55,4.44],[-3.55,-4.54],[-3.50,-4.60]];
  const fieldTraces = [
    outerLine,
    ...[-1,1].flatMap(side => [
      [[3.32*side,-4.10],[3.32*side,-2.20],[3.07*side,-1.98],[3.07*side,.44],
        [2.57*side,.94],[1.62*side,.94],[1.43*side,1.12]],
      [[3.31*side,1.76],[3.31*side,2.42],[2.79*side,2.69],[2.13*side,2.69],[1.81*side,2.96]],
      [[.32*side,1.59],[.68*side,1.95],[.68*side,2.44],[1.21*side,3.04],[1.21*side,3.69]],
    ]),
    circularPath(0,1.44,.85,-.37,3.50,29),
    circularPath(0,1.44,1.08,3.60,6.21,25),
  ];
  const etching = new THREE.MeshBasicMaterial({
    color:0x6796a5, transparent:true, opacity:.39, side:THREE.DoubleSide, depthWrite:false,
  });
  solid(scene,etchedLines(fieldTraces,.026),etching,0,.281,0);
  const goldInlay = new THREE.MeshBasicMaterial({color:0xa56d4f,side:THREE.DoubleSide});
  solid(scene,etchedLines([
    [[-3.27,-4.47],[3.27,-4.47]],
    [[-3.26,3.91],[-3.08,4.26],[-1.23,4.26],[-.96,4.57],[.96,4.57],[1.23,4.26],[3.08,4.26],[3.26,3.91]],
    Array.from({length:33},(_,index) => {
      const angle = index*Math.PI/16;
      const radius = index%4===1 || index%4===2 ? .57 : .47;
      return [Math.cos(angle)*radius,1.44+Math.sin(angle)*radius];
    }),
    [[-.30,1.44],[0,1.14],[.30,1.44],[0,1.74],[-.30,1.44]],
  ],.035),goldInlay,0,.282,0);

  for (const sign of [-1,1]) {
    fixed(walnut,sign*3.96,.39,0,.23,.47,10.13);
    fixed(bronze,sign*3.96,.60,0,.30,.17,10.2);
    fixed(brass,sign*3.96,.695,0,.11,.038,10.16);
    fixed(stationShell,sign*3.73,.37,.05,.11,.20,9.34);
    fixed(edgeLight,sign*3.674,.464,-.60,.032,.022,7.26);
    for (const z of [-3.16,-.60,1.96,3.96]) {
      fixed(iron,sign*4.02,.46,z,.35,.38,.58);
      fixed(bronze,sign*4.03,.64,z,.34,.20,.54);
      fixed(brass,sign*4.02,.757,z,.24,.052,.39);
      fixed(ember,sign*4.02,.786,z,.07,.027,.19);
    }
    for (const z of [-5.0,5.0]) {
      fixed(brass,sign*3.96,.57,z,.39,.57,.48);
      fixed(bronze,sign*3.96,.865,z,.275,.085,.35);
      fixed(ember,sign*3.96,.912,z,.107,.025,.157);
    }
    fixed(iron,sign*2.8,.32,1.35,.82,.16,.38);
    fixed(bronze,sign*2.8,.43,1.35,.58,.10,.42);
    fixed(ember,sign*2.8,.49,1.35,.34,.045,.087);
    fixed(iron,sign*2.84,.32,3.18,1.0,.22,.84);
    fixed(iron,sign*5.42,.02,-4.71,.71,1.05,.69);
    fixed(bronze,sign*5.42,.56,-4.71,.74,.11,.71);
    fixed(ember,sign*5.42,.25,-4.347,.42,.08,.025);
  }
  for (const z of [-5.02,4.99]) {
    fixed(walnut,0,.32,z,8.05,.44,.27);
    fixed(bronze,0,.57,z,8.03,.12,.28);
    fixed(brass,0,.647,z,7.94,.035,.1);
  }
  fixed(dark,0,.29,4.44,2.05,.05,.78);
  fixed(bronze,0,.337,4.83,2.29,.092,.115);
  for (let i=-4;i<=4;i++) fixed(i%2 ? bronze : brass,i*.22,.347,4.48,.061,.047,.67);
  fixed(stationShell,0,-.049,5.183,4.77,.132,.045);
  for (let i=-8;i<=8;i++) fixed(iron,i*.24,-.039,5.214,.12,.070,.021);
  bakeBoxes();

  function gear(parent, mat, radius, thick, x,y,z) {
    const g = new THREE.Group();
    parent.add(g);
    g.position.set(x,y,z);
    solid(g,gearTeeth,mat,0,-thick/2,0,radius,thick,radius);
    solid(g,gearCore,iron,0,thick*.55,0,radius*1.20,thick*.30,radius*1.20);
    return g;
  }

  const targetSocket = new THREE.LatheGeometry([
    [.63,0],[.70,.05],[.70,.14],[.54,.23],[.52,.36],[.41,.42],[.35,.42],
  ].map(([r,y]) => new THREE.Vector2(r,y)),12);
  const targetLens = new THREE.LatheGeometry([
    [0,0],[.30,0],[.30,.07],[.235,.157],[.09,.192],[0,.192],
  ].map(([r,y]) => new THREE.Vector2(r,y)),12);
  const haloGeometry = new THREE.PlaneGeometry(2.34,2.34).rotateX(-Math.PI/2);
  const rails = {};
  for (const lane of LANES) {
    const tint = RAIL_COLORS[lane];
    const lamp = new THREE.MeshStandardMaterial({ color:tint, emissive:tint, emissiveIntensity:.18, metalness:.25, roughness:.3 });
    palette.set(lane,lamp);
    const station = new THREE.Group();
    scene.add(station);
    solid(station,gearCore,dark,0,.326,0,1.48,.09,1.48);
    solid(station,targetSocket,bronze,0,.34,0);
    solid(station,gearCore,iron,0,.68,0,1.08,.21,1.08);
    const rotor = gear(station,brass,.52,.13,0,.82,0);
    solid(rotor,targetLens,lamp,0,.069,0);
    solid(station,box,lamp,0,.52,.604,.34,.071,.027);
    const halo = new THREE.ShaderMaterial({
      uniforms:{ tint:{value:new THREE.Color(tint)}, strength:{value:.42} },
      vertexShader:`varying vec2 lensUV; void main(){lensUV=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
      fragmentShader:`uniform vec3 tint; uniform float strength; varying vec2 lensUV;
        void main() {
          float edge=length(lensUV-0.5)*2.0;
          gl_FragColor=vec4(tint,(1.0-smoothstep(0.34,0.98,edge))*strength);
          #include <colorspace_fragment>
        }`,
      transparent:true,depthWrite:false,
    });
    const ring = solid(station,haloGeometry,halo,0,.283,0);
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
    const channel = new THREE.Group();
    const bend = lane === 'L' ? -.26 : lane === 'R' ? .26 : .14;
    const raceway = new THREE.CatmullRomCurve3([
      pos(0,0,-3.35),pos(0,0,-2.63),pos(bend,0,-1.63),
      pos(bend,0,-.64),pos(0,0,.11),pos(0,0,.47),
    ]);
    solid(channel,new THREE.TubeGeometry(raceway,28,.175,8,false),stationShell,0,.26,0);
    solid(channel,new THREE.TubeGeometry(raceway,28,.124,8,false),bronze,0,.313,0);
    const bus = solid(channel,new THREE.TubeGeometry(raceway,28,.055,7,false),lamp,0,.432,0);
    const cradles = new THREE.InstancedMesh(box,brass,6);
    const marker = new THREE.Object3D();
    marker.scale.set(.12,.078,.20);
    let cradleIndex = 0;
    for (const z of [-2.06,-.83,.30]) {
      const x = z > 0 ? 0 : bend*.92;
      for (const sign of [-1,1]) {
        marker.position.set(x+sign*.17,.35,z);
        marker.rotation.y = sign*.20;
        marker.updateMatrix();
        cradles.setMatrixAt(cradleIndex++,marker.matrix);
      }
    }
    channel.add(cradles);
    scene.add(channel);
    const bridge = new THREE.Group();
    bridge.position.set(RAIL_X[lane],.27,-1.77);
    const turn = lane==='L' ? 1 : -1;
    const curve = new THREE.CatmullRomCurve3([
      pos(0,.05,-1.66),pos(turn*.29,.18,-1.17),pos(turn*.34,.31,.15),
      pos(turn*.8,.22,1.57),pos(turn*1.31,.07,1.93),
    ]);
    solid(bridge,new THREE.TubeGeometry(curve,20,.034,6,false),lamp,0,0,0);
    scene.add(bridge);
    rails[lane] = { station, rotor, ring, gate, arm, armLight, channel, bus, bridge };
  }

  const paddles = {};
  const paddleShape = steppedPaddle();
  const paddleInsert = horizontalShape([
    [.28,-.118],[1.33,-.087],[1.67,-.021],[1.67,.037],[1.46,.103],[.42,.164],[.18,.114],
  ],.032,.027);
  for (const side of ['L','R']) {
    const g = new THREE.Group();
    g.position.set(SIDE_X[side], .415, 3.18);
    scene.add(g);
    const sign = side === 'L' ? 1 : -1;
    solid(g,paddleShape,dark,0,-.061,0,sign,.64,1.08);
    const paddle = solid(g,paddleShape,brass,0,0,0,sign,1,1);
    solid(g,paddleInsert,jade,0,.163,0,sign,1,1);
    solid(g,jewel,bronze,0,.195,0,.43,.125,.43);
    solid(g,jewel,metal,0,.270,0,.263,.075,.263);
    solid(g,box,ceramic,sign*1.40,.223,.021,.25,.018,.063);
    const ring = solid(scene, new THREE.RingGeometry(.31,.43,12).rotateX(-Math.PI/2), groundGlow.clone(), SIDE_X[side], .292, 3.18);
    paddles[side] = {group:g,paddle,ring};
  }

  const ballMat = new THREE.MeshPhysicalMaterial({
    color:STEEL,metalness:.54,roughness:.23,clearcoat:1,clearcoatRoughness:.10,
  });
  const ball = solid(scene,new THREE.SphereGeometry(.229,20,14),ballMat,0,.6,4);
  const stripe = solid(ball,new THREE.TorusGeometry(.207,.016,8,20), ceramic,0,0,0);
  const shadow = solid(scene, new THREE.CircleGeometry(.31,16).rotateX(-Math.PI/2),
    new THREE.MeshBasicMaterial({ color:0x041220, transparent:true, opacity:.46, depthWrite:false }),0,.281,0);
  const drainLight = solid(scene, box, new THREE.MeshBasicMaterial({color:0x6bf0e3, transparent:true, opacity:0}), 0,.39,4.28,1.8,.08,.09);
  const trailMat = new THREE.MeshBasicMaterial({ color:0x81e4ff, transparent:true, opacity:.48, depthWrite:false });
  const trail = Array.from({ length:7 }, (_, i) => solid(scene,new THREE.SphereGeometry(.075,9,6),trailMat,0,.4,0,1-i*.10,1-i*.10,1-i*.10));
  const sparkMaterial = new THREE.MeshBasicMaterial({color:0xffe5a9, transparent:true, depthWrite:false});
  const sparks = new THREE.InstancedMesh(new THREE.BoxGeometry(.046,.061,.13),sparkMaterial,14);
  const sparkMarker = new THREE.Object3D();
  const sparkOrigin = pos(0,0,0);
  let sparkTime = -Infinity;
  sparks.frustumCulled = false;
  scene.add(sparks);

  // Rux is cut from the same stepped-anatomy shapes as the approved reference.
  const rux = new THREE.Group();
  rux.position.set(-3.39, .29, -4.17);
  rux.scale.setScalar(.64);
  rux.rotation.y = .23;
  scene.add(rux);
  const hood = material(0x87929f);
  const leather = material(0x895334);
  const ear = material(0xd58f77);
  const sculptedBlock = cabinetPanel(.94,.94,.11,.90,.045);
  sculptedBlock.translate(0,-.45,0);
  const goggleGlass = new THREE.MeshStandardMaterial({
    color:0x27b4ad,emissive:0x137579,emissiveIntensity:.5,metalness:.35,roughness:.19,
  });
  for (const sign of [-1,1]) {
    solid(rux,sculptedBlock,slate,sign*.41,.33,0,.65,.62,.61);
    solid(rux,sculptedBlock,bronze,sign*.41,.13,.21,.62,.26,.92);
    solid(rux,box,brass,sign*.43,.14,.67,.18,.18,.11);
  }
  solid(rux,sculptedBlock,slate,0,1.03,0,1.42,1.17,.76);
  solid(rux,box,jade,0,1.56,.14,1.51,.29,.82);
  solid(rux,box,jade,-.47,1.36,.51,.36,.51,.14);
  solid(rux,box,leather,0,.76,.04,1.51,.26,.85);
  solid(rux,box,brass,0,.76,.49,.34,.34,.13);
  solid(rux,box,bronze,0,1.28,-.58,1.18,.92,.64);
  solid(rux,box,iron,0,1.31,-.916,.88,.63,.077);
  for (const x of [-.23,0,.23]) solid(rux,box,ember,x,1.31,-.959,.085,.40,.041);
  solid(rux,box,brass,.35,1.89,-.7,.26,.43,.31);
  solid(rux,box,rails.C.armLight.material,-.34,1.31,-.92,.27,.45,.062);
  const head = new THREE.Group();
  head.position.y = 1.87;
  rux.add(head);
  solid(head,sculptedBlock,hood,0,.49,0,1.62,1.09,1.04);
  solid(head,sculptedBlock,slate,0,.12,.62,1.35,.50,.63);
  solid(head,sculptedBlock,hood,0,.17,.92,1.26,.40,.24);
  for (const sign of [-1,1]) {
    solid(head,box,hood,sign*.59,1.18,0,.43,.55,.38);
    solid(head,box,ear,sign*.59,1.20,.204,.26,.33,.04);
    solid(head,box,dark,sign*.40,.17,1.057,.17,.18,.034);
    solid(head,box,dark,sign*.43,.53,.534,.34,.35,.052);
    solid(head,box,ceramic,sign*.43,.514,.565,.23,.24,.049);
    solid(head,box,dark,sign*.38,.51,.594,.14,.18,.041);
    solid(head,box,bronze,sign*.43,.92,.45,.52,.37,.25);
    solid(head,box,brass,sign*.43,.92,.588,.44,.31,.065);
    solid(head,box,goggleGlass,sign*.43,.92,.63,.34,.22,.064);
  }
  const horn = gear(head, brass,.38,.19,0,.44,.97);
  horn.rotation.x = Math.PI*.5;
  const armPivots = [];
  for (const sign of [-1,1]) {
    const arm = new THREE.Group();
    arm.position.set(sign*.89,1.38,0);
    rux.add(arm);
    solid(arm,sculptedBlock,jade,0,-.16,0,.49,.40,.49);
    solid(arm,sculptedBlock,slate,0,-.54,.04,.43,.54,.43);
    solid(arm,box,bronze,0,-.51,.259,.44,.19,.12);
    solid(arm,box,hood,0,-.85,.11,.46,.26,.45);
    armPivots.push(arm);
  }

  let lost = false;
  let removed = false;
  let lastFinish = null;
  let lastWidth = 0, lastHeight = 0;
  let strikeTime = -Infinity, contactLane = '', contactTime = -Infinity;
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

  const visibleTable = projectedTableBounds(camera,rux);
  const viewSize = visibleTable.getSize(new THREE.Vector2());
  const viewCenter = visibleTable.getCenter(new THREE.Vector2());

  function resize() {
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (!width || !height || (width === lastWidth && height === lastHeight)) return;
    lastWidth = width;
    lastHeight = height;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height, false);
    const margin = Math.min(width,height)*.026;
    const unitsPerPixel = Math.max(viewSize.x / (width-2*margin), viewSize.y / (height-2*margin));
    const halfWidth = width*unitsPerPixel/2;
    const halfHeight = height*unitsPerPixel/2;
    camera.left = viewCenter.x-halfWidth;
    camera.right = viewCenter.x+halfWidth;
    camera.top = viewCenter.y+halfHeight;
    camera.bottom = viewCenter.y-halfHeight;
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
      strikeTime = motionTime;
      sparkOrigin.copy(contact(state.side,state.catchAt));
      sparkTime = motionTime;
    }
    if (event.lane && event.type !== 'strike') {
      contactLane = event.lane;
      contactTime = motionTime;
      sparkOrigin.copy(destination(state));
      sparkTime = motionTime;
    }
  }

  function render(state, finish, time, reduced, flipperTime) {
    if (lost || removed) return;
    resize();
    if (state.stage.chapter !== lastChapter) {
      lastChapter = state.stage.chapter;
      const night = lastChapter > 1;
      colorField(night);
      daylight.color.setHex(night ? 0xe0c6fc : 0xffc196);
      rim.color.setHex(night ? 0x68b8fa : 0x65cfff);
      scene.fog.color.setHex(night ? 0x0e1631 : 0x081d30);
      renderer.setClearColor(night ? 0x0e1631 : 0x081d30);
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
      const { station, rotor, gate, arm, armLight, ring, channel, bus, bridge } = rails[lane];
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
      const lit = state.stage.order.slice(0,state.index).includes(lane);
      palette.get(lane).emissiveIntensity = .13 + (enabled ? .83 : 0) + (lit ? .64 : 0) + impact*.79;
      ring.visible = goal === lane || lit;
      ring.scale.setScalar(1 + impact*.15);
      ring.material.uniforms.strength.value = (blocked ? .18 : .44) + impact*.23;
      channel.position.x = location.x;
      bus.visible = enabled || lit;
      bridge.position.x = location.x;
      bridge.visible = state.stage.feedback && lane!=='C';
    }
    for (const [side, {group,ring}] of Object.entries(paddles)) {
      const ready = (side === state.side && state.phase === 'return') || state.phase === 'ready';
      const attack = flipperLift(time-flipperTime[side]);
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
    const sparkPhase = (time-sparkTime)/265;
    sparks.visible = !reduced && sparkPhase<1;
    if (sparks.visible) {
      sparkMaterial.opacity = (1-sparkPhase)*.82;
      for (let index=0;index<sparks.count;index++) {
        const angle=index*2.39996;
        const radius=.04+sparkPhase*(.34+index*.022);
        sparkMarker.position.set(sparkOrigin.x+Math.cos(angle)*radius,
          sparkOrigin.y+.12+Math.sin(Math.PI*sparkPhase)*.38,
          sparkOrigin.z+Math.sin(angle)*radius);
        sparkMarker.rotation.set(angle,2*angle,sparkPhase);
        sparkMarker.updateMatrix();
        sparks.setMatrixAt(index,sparkMarker.matrix);
      }
      sparks.instanceMatrix.needsUpdate=true;
    }
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
