import * as THREE from '../../src/vendor/three/r180-b59af7c93a55a6eb/three.module.min.js?wp-media=8fb26d6ba38abd4b';
import { ballRest, closedBy, flipperAngle, inReach, LANES, PHYSICS, targetPosition } from './model.mjs?v=flippers-v7&wp-media=8fb26d6ba38abd4b';

const STEEL = 0xcfe8ed;
const COPPER = 0xef9b54;
const AURORA = 0x9176ff;
const RAIL_X = { L:-2.42, C:0, R:2.42 };
const RAIL_COLORS = { L:0xffb45f, C:0x74f4ef, R:0xbda3ff };
const Z = PHYSICS.lengthScale;
const SIDE_X = { L:-PHYSICS.pivotX, R:PHYSICS.pivotX };
const clamp = THREE.MathUtils.clamp;
const lerp = THREE.MathUtils.lerp;
const pos = (x, y, z) => new THREE.Vector3(x, y, z);

function projectedTableBounds(camera, mascot) {
  const cabinet = new THREE.Box3(pos(-4.28,-.65,-5.28*Z),pos(4.28,.9,5.28*Z));
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

export function mountTable(host, onLoss, onRestore) {
  const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:false, powerPreference:'high-performance' });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.setClearColor(0x0b1924);
  renderer.domElement.setAttribute('aria-hidden','true');
  host.replaceChildren(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x081d30, 31, 47);
  const camera = new THREE.OrthographicCamera(-5,5,5,-5, .1, 75);
  const tableTarget = new THREE.Vector3(0, .12, -.15);
  scene.add(new THREE.HemisphereLight(0xd3edfa, 0x6d453b, 1.44));
  const daylight = new THREE.DirectionalLight(0xffe1bd, 3.25);
  daylight.position.set(-4, 9, -4);
  scene.add(daylight);
  const rim = new THREE.DirectionalLight(0x8cddff, 1.86);
  rim.position.set(5, 6, 3);
  scene.add(rim);

  const material = (color, metalness = .12, roughness = .49) => new THREE.MeshStandardMaterial({ color, metalness, roughness });
  const enamel = material(0x142736, .28, .41);
  const inlay = new THREE.MeshPhysicalMaterial({
    vertexColors:true, metalness:.18, roughness:.48, clearcoat:.30, clearcoatRoughness:.53,
  });
  const bronze = material(0xb46e47, .43, .33);
  const brass = material(0xe0b566, .52, .28);
  const walnut = material(0x30201d, .16, .37);
  const iron = material(0x182b37, .42, .39);
  const dark = material(0x09101d);
  const metal = material(0x95abbf, .57, .26);
  const jade = material(0x108783, .27, .29);
  const ceramic = material(0xffdb9b);
  const workFloor = new THREE.MeshBasicMaterial({color:0x101923});
  const floorSeam = new THREE.MeshBasicMaterial({color:0x101923});
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
  const graphite = material(0x223844,.40,.38);
  const rubber = material(0x131e23,.10,.54);
  const porcelain = material(0xebd2a5,.22,.36);
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

  fixed(workFloor,0,-.68,0,23,.17,25);
  for (let z=-10;z<=10;z++) {
    fixed(floorSeam,0,-.588,z,21,.012,.036);
    for (let x=-9;x<=9;x+=2.4) {
      fixed(floorSeam,x+(z%2===0 ? -1.2 : 1.2),-.583,z+.51,.036,.013,1.01);
    }
  }
  const cabinetStart = scene.children.length;
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
    const edge = new THREE.Color(night ? 0x151b35 : 0x09303b);
    const center = new THREE.Color(night ? 0x284a72 : 0x1c6267);
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
    color:0x9ac4bc, transparent:true, opacity:.48, side:THREE.DoubleSide, depthWrite:false,
  });
  solid(scene,etchedLines(fieldTraces,.026),etching,0,.281,0);
  const goldInlay = new THREE.MeshBasicMaterial({color:0xba9060,side:THREE.DoubleSide});
  const ghostInk = new THREE.MeshBasicMaterial({color:0x194b52,side:THREE.DoubleSide});
  solid(scene,etchedLines([
    circularPath(0,.55,.94,-2.4,-.7,36),
    circularPath(0,.55,1.11,.40,2.75,38),
    circularPath(0,.55,1.40,3.45,5.98,38),
    ...[-1,1].flatMap(side => [[
      [side*.78,.91],[side*1.39,.44],[side*1.78,.44],[side*2.12,.08],[side*2.12,-.74],
    ],[
      [side*.63,1.79],[side*.91,1.95],[side*1.35,1.95],[side*1.86,1.50],[side*2.17,1.5],[side*2.53,1.16]
    ]]),
  ],.044),ghostInk,0,.2815,0);
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
    fixed(iron,sign*3.96,.14,0,.25,.17,10.04);
    fixed(bronze,sign*4.081,.14,0,.045,.041,9.84);
    fixed(rubber,sign*3.648,.345,0,.11,.18,9.52);
    fixed(stationShell,sign*3.73,.37,.05,.11,.20,9.34);
    fixed(edgeLight,sign*3.674,.464,-.60,.032,.022,7.26);
    for (const z of [-4.2,-2.58,-1.34,.66,2.96,4.22]) {
      fixed(enamel,sign*3.86,.686,z,.156,.056,.268);
      fixed(metal,sign*3.86,.725,z,.092,.018,.125);
    }
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
  // Static details run the full length of the new cabinet.
  for (const instances of placed.values()) {
    for (const item of instances) {
      item[2] *= Z;
      item[5] *= Z;
    }
  }
  for (const mesh of scene.children.slice(cabinetStart)) {
    mesh.position.z *= Z;
    mesh.scale.z *= Z;
  }
  bakeBoxes();

  function guard(x1, z1, x2, z2) {
    const length = Math.hypot(x2-x1,z2-z1);
    const angle = -Math.atan2(z2-z1,x2-x1);
    for (const [mat,y,h,w] of [[rubber,.385,.22,.16],[graphite,.505,.08,.19],[brass,.55,.024,.078]]) {
      const mesh = solid(scene,box,mat,(x1+x2)/2,y,(z1+z2)/2,length,h,w);
      mesh.rotation.y = angle;
    }
    for (const [x,z] of [[x1,z1],[x2,z2]]) solid(scene,jewel,metal,x,.567,z,.147,.052,.147);
  }
  for (const sign of [-1,1]) {
    guard(sign*3.57,PHYSICS.top+.58,sign*2.98,PHYSICS.top+.02);
    const laneMark = solid(scene, etchedLines([[
      [sign*3.50,PHYSICS.pivotZ-1.73],[sign*2.71,PHYSICS.pivotZ+.44],
    ]],.13), goldInlay,0,.283,0);
    laneMark.renderOrder = 1;
    guard(sign*3.54,PHYSICS.pivotZ+1.09,sign*1.19,PHYSICS.drainZ+.02);
  }
  const launchInsert = solid(scene, new THREE.RingGeometry(.29,.34,32).rotateX(-Math.PI/2), porcelain,0,.283,0);
  launchInsert.visible = false;

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
  ].map(([r,y]) => new THREE.Vector2(r,y)),28);
  const targetLens = new THREE.LatheGeometry([
    [0,0],[.30,0],[.30,.07],[.235,.157],[.09,.192],[0,.192],
  ].map(([r,y]) => new THREE.Vector2(r,y)),28);
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
    solid(station,new THREE.TorusGeometry(.584,.019,8,48).rotateX(-Math.PI/2),brass,0,.535,0);
    solid(rotor,new THREE.TorusGeometry(.325,.018,8,40).rotateX(-Math.PI/2),porcelain,0,.115,0);
    for (let i=0;i<6;i++) {
      const angle = i*Math.PI/3;
      solid(station,jewel,brass,Math.cos(angle)*.60,.548,Math.sin(angle)*.60,.108,.055,.108);
    }
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
    gate.position.z = PHYSICS.gateZ;
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
    solid(channel,new THREE.TubeGeometry(raceway,32,.165,10,false),stationShell,0,.119,0);
    solid(channel,new THREE.TubeGeometry(raceway,32,.105,10,false),bronze,0,.187,0);
    const bus = solid(channel,new THREE.TubeGeometry(raceway,32,.041,8,false),lamp,0,.263,0);
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
    channel.scale.z = Z;
    scene.add(channel);
    const bridge = new THREE.Group();
    bridge.position.set(RAIL_X[lane],.27,-1.77*Z);
    bridge.scale.z = Z;
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
    g.position.set(SIDE_X[side], .415, PHYSICS.pivotZ);
    scene.add(g);
    const sign = side === 'L' ? 1 : -1;
    solid(g,paddleShape,dark,0,-.061,0,sign,.64,1.08);
    const paddle = solid(g,paddleShape,brass,0,0,0,sign,1,1);
    solid(g,paddleInsert,jade,0,.163,0,sign,1,1);
    solid(g,jewel,bronze,0,.195,0,.43,.125,.43);
    solid(g,jewel,metal,0,.270,0,.263,.075,.263);
    solid(g,box,ceramic,sign*1.40,.223,.021,.25,.018,.063);
    const ring = solid(scene, new THREE.RingGeometry(.31,.43,12).rotateX(-Math.PI/2), groundGlow.clone(), SIDE_X[side], .292, PHYSICS.pivotZ);
    paddles[side] = {group:g,paddle,ring};
  }

  const ballMat = new THREE.MeshPhysicalMaterial({
    color:STEEL,metalness:.34,roughness:.21,clearcoat:1,clearcoatRoughness:.10,
  });
  const ball = solid(scene,new THREE.SphereGeometry(PHYSICS.radius,32,24),ballMat,0,.6,4);
  const stripe = solid(ball,new THREE.TorusGeometry(.207,.016,8,20), ceramic,0,0,0);
  const shadow = solid(scene, new THREE.CircleGeometry(.31,16).rotateX(-Math.PI/2),
    new THREE.MeshBasicMaterial({ color:0x041220, transparent:true, opacity:.46, depthWrite:false }),0,.281,0);
  const drainLight = solid(scene, box, new THREE.MeshBasicMaterial({color:0x6bf0e3, transparent:true, opacity:0}), 0,.39,4.28*Z,1.8,.08,.09);
  const trailMat = new THREE.MeshBasicMaterial({ color:0x81e4ff, transparent:true, opacity:.22, depthWrite:false });
  const trail = Array.from({ length:3 }, (_, i) => solid(scene,new THREE.SphereGeometry(.075,9,6),trailMat,0,.4,0,1-i*.10,1-i*.10,1-i*.10));
  const sparkMaterial = new THREE.MeshBasicMaterial({color:0xffe5a9, transparent:true, depthWrite:false});
  const sparks = new THREE.InstancedMesh(new THREE.BoxGeometry(.046,.061,.13),sparkMaterial,14);
  const sparkMarker = new THREE.Object3D();
  const sparkOrigin = pos(0,0,0);
  let sparkTime = -Infinity;
  sparks.frustumCulled = false;
  scene.add(sparks);

  // Rux is cut from the same stepped-anatomy shapes as the approved reference.
  const rux = new THREE.Group();
  rux.position.set(-3.39, .29, -4.17*Z);
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
  let lastWidth = 0, lastHeight = 0, lastPixelRatio = 0;
  const previousBall = new THREE.Vector2();
  let rolling = false;
  const rollAxis = new THREE.Vector3();
  const point = pos(0,.504,0);
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

  // Frame the static cabinet and mascot once per view so animation cannot
  // change the zoom. The desktop angle makes better use of a wide play area.
  const tableViews = [[0, 21, 8.4], [0, 17.6, 11.5]].map(position => {
    camera.position.set(...position);
    camera.lookAt(tableTarget);
    const bounds = projectedTableBounds(camera, rux);
    return { position, size:bounds.getSize(new THREE.Vector2()), center:bounds.getCenter(new THREE.Vector2()) };
  });
  let lastView;

  function resize() {
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (!width || !height) return;
    const desktop = getComputedStyle(host).getPropertyValue('--flux-desktop-table').trim() === '1';
    const original = tableViews[0];
    const wideView = desktop && width / height > original.size.x / original.size.y;
    const view = wideView ? tableViews[1] : original;
    const bounds = host.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const scale = Math.max(bounds.width/width,bounds.height/height);
    const density = Math.min((window.devicePixelRatio || 1)*scale,3,Math.sqrt(2_300_000/(width*height)));
    const pixelRatio = Math.round(density*64)/64;
    if (width === lastWidth && height === lastHeight && view === lastView && pixelRatio === lastPixelRatio) return;
    lastPixelRatio = pixelRatio;
    lastWidth = width;
    lastHeight = height;
    if (view !== lastView) {
      camera.position.set(...view.position);
      camera.lookAt(tableTarget);
      lastView = view;
    }
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    const margin = Math.min(width,height) * (wideView ? .012 : .011);
    const unitsPerPixel = Math.max(view.size.x / (width-2*margin), view.size.y / (height-2*margin));
    const halfWidth = width*unitsPerPixel/2;
    const halfHeight = height*unitsPerPixel/2;
    camera.left = view.center.x-halfWidth;
    camera.right = view.center.x+halfWidth;
    camera.top = view.center.y+halfHeight;
    camera.bottom = view.center.y-halfHeight;
    camera.updateProjectionMatrix();
    return true;
  }

  const observer = new ResizeObserver(() => {
    if (!lost && !removed && resize()) renderer.render(scene,camera);
  });
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

  function respond(event, motionTime) {
    if (event.type === 'strike') strikeTime = motionTime;
    if (event.lane) {
      contactLane = event.lane;
      contactTime = motionTime;
    }
    if (event.point) {
      sparkOrigin.set(event.point.x,.53,event.point.z);
      sparkTime = motionTime;
    }
  }

  function render(state, finish, time, reduced) {
    if (lost || removed) return;
    resize();
    if (state.stage.chapter !== lastChapter) {
      lastChapter = state.stage.chapter;
      const night = lastChapter > 1;
      colorField(night);
      daylight.color.setHex(night ? 0xe0c6fc : 0xffe1bd);
      rim.color.setHex(night ? 0x68b8fa : 0x8cddff);
      scene.fog.color.setHex(night ? 0x0b1426 : 0x0a1824);
      renderer.setClearColor(night ? 0x0b1426 : 0x0a1824);
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

    const goal = state.stage.order[state.index];
    const contactKick = clamp(1 - (time-contactTime)/280,0,1);
    const strikeKick = clamp(1 - (time-strikeTime)/255,0,1);
    for (const lane of LANES) {
      const { station, rotor, gate, arm, armLight, ring, channel, bus, bridge } = rails[lane];
      const location = targetPosition(lane,state.stage.railSpread);
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
      const enabled = goal === lane && !blocked;
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
      const ready = inReach(state,side);
      group.rotation.y = flipperAngle(state,side);
      const lift = Math.abs(group.rotation.y + (side === 'L' ? .13 : -.13));
      ring.visible = ready || lift > .01;
      ring.material.opacity = ready ? .55 : .17 + lift*.27;
    }
    if (state.phase === 'ready') {
      const rest = ballRest(state.side);
      point.set(rest.x,.504,rest.z);
      launchInsert.position.set(rest.x,.285,rest.z);
    } else {
      point.set(state.ball.x,.504,state.ball.z);
    }
    if (state.phase === 'drain') point.y -= Math.min(.45,state.elapsed*.0033);
    const moving = state.phase === 'shot' || state.phase === 'return';
    if (moving && rolling && !reduced) {
      const dx = point.x-previousBall.x;
      const dz = point.z-previousBall.y;
      const distance = Math.hypot(dx,dz);
      if (distance > .001 && distance < 2) {
        rollAxis.set(dz/distance,0,-dx/distance);
        ball.rotateOnWorldAxis(rollAxis,distance/PHYSICS.radius);
      }
    }
    rolling = moving;
    previousBall.set(point.x,point.z);
    ball.position.copy(point);
    ball.visible = !(state.phase === 'drain' && state.elapsed > 120) && (state.phase !== 'complete' || state.won);
    launchInsert.visible = state.phase === 'ready';
    stripe.visible = finish !== 'steel';
    shadow.position.set(point.x,.282,point.z);
    shadow.visible = ball.visible && state.phase !== 'drain';
    drainLight.material.opacity = state.shield ? .96 : 0;
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
