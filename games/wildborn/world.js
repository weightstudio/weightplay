import * as THREE from '/games/animal-skyspire-drop/vendor/three/three.module.min.js';
import { LINEAGES, FAUNA, SPECIES, anatomy, combatTraits, LIMITS, hash, habitat, groundHeight, coverAt, treeAt, riverX } from './content.mjs';

const colors = { meadow: 0x819b67, forest: 0x546f57, marsh: 0x759b80, dryland: 0xb8a178, water: 0x548f8d };
const mix = (a, b, t) => a + (b - a) * t;

class Boxes {
  constructor(scene, geometry, materialCache, capacity = 2400, opacity = 1) {
    this.scene = scene; this.geometry = geometry; this.materialCache = materialCache;
    this.capacity = capacity; this.opacity = opacity; this.batches = new Map(); this.dummy = new THREE.Object3D();
  }
  get(color) {
    if (!this.batches.has(color)) {
      if (!this.materialCache.has(color)) this.materialCache.set(color, new THREE.MeshStandardMaterial({ color, roughness: .86, metalness: 0, transparent: this.opacity < 1, opacity: this.opacity, depthWrite: this.opacity === 1 }));
      const mesh = new THREE.InstancedMesh(this.geometry, this.materialCache.get(color), this.capacity);
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); mesh.count = 0;
      mesh.castShadow = this.opacity === 1; mesh.receiveShadow = true; mesh.frustumCulled = false;
      this.scene.add(mesh); this.batches.set(color, mesh);
    }
    return this.batches.get(color);
  }
  begin() { for (const mesh of this.batches.values()) mesh.count = 0; }
  box(color, x, y, z, sx, sy, sz, rx = 0, ry = 0, rz = 0) {
    const mesh = this.get(color); if (mesh.count >= this.capacity) return;
    this.dummy.position.set(x, y, z); this.dummy.scale.set(sx, sy, sz); this.dummy.rotation.set(rx, ry, rz); this.dummy.updateMatrix();
    mesh.setMatrixAt(mesh.count++, this.dummy.matrix);
  }
  matrix(color, matrix) {
    const mesh = this.get(color); if (mesh.count >= this.capacity) return;
    mesh.setMatrixAt(mesh.count++, matrix);
  }
  end() { for (const mesh of this.batches.values()) mesh.instanceMatrix.needsUpdate = true; }
  dispose() { for (const mesh of this.batches.values()) { this.scene.remove(mesh); mesh.dispose(); } this.batches.clear(); }
}

// Authored cuboid character kits. Every part has a deliberate anatomical role;
// animation changes local limbs/antennae/feathers, never simulation position.
export function creatureParts(kind, form, colorOverride, mutation=0) {
  const lineage = LINEAGES[kind];
  const color = colorOverride || (kind==='caterpillar'&&form===1?0xe0ead0:kind==='mouse'&&form===1?0x9b7958:lineage?.color || FAUNA[kind]?.color || 0xd7bb94);
  const parts = [];
  const add = (color, x,y,z,sx,sy,sz, role='', rx=0,ry=0,rz=0) => parts.push({color,x,y,z,sx,sy,sz,role,rx,ry,rz});
  const black = 0x263c37, ivory = 0xfff1cc, feet = 0xcb8d49;
  const insect = kind === 'beetle' || kind === 'mantis';
  const bird = kind === 'chick' || kind === 'duckling';
  if (['human','ape'].includes(kind)) {
    const human=kind==='human',skin=human?0xd6a376:0x775852,cloth=form===2||form===4?0x567b83:0x406c58;
    add(human?cloth:skin,0,.93,0,human?.66:.86,.9,.48,'body');
    add(skin,0,1.67,.07,.65,.63,.58,'head');add(human?0x775852:0x263c37,0,1.99,.04,.69,.16,.61,'head');
    add(human?skin:0xd6a376,0,1.51,.39,.42,.23,.19,'head');
    [-1,1].forEach(side=>{
      add(black,side*.18,1.74,.375,.095,.12,.035,'head');add(ivory,side*.19,1.77,.4,.025,.035,.02,'head');
      add(skin,side*(human?.46:.58),.96,.03,human?.22:.31,human?.79:1.05,.27,`arm${side}`);
      add(cloth,side*.2,.36,0,.25,.66,.27,`leg${side>0?1:0}`);add(0x775852,side*.2,.07,.13,.3,.15,.45,`leg${side>0?1:0}`);
      if(form>=3)add(ivory,side*.47,1.3,0,.36,.22,.55,'armor');
    });
    if(human){add(0xe0c478,0,.67,.255,.66,.13,.065,'belt');
      if(form!==2){add(0x755d47,.62,1.1,.37,.07,1.8,.08,'weapon');if(form>0)add(0xe0ead0,.62,2.1,.37,.20,.35,.12,'weapon');}
      else {add(0x755d47,.62,1,.2,.1,1.8,.1,'weapon');add(0x90cbc3,.62,2.04,.2,.34,.37,.34,'weapon');}
      if(form>=2)add(cloth,0,1.05,-.34,.76,1.15,.09,'tail',-.16);
      if(form===1){add(0x9b7958,.24,1.14,-.32,.28,.77,.25,'quiver',0,0,.3);add(0xe0ead0,.3,1.63,-.32,.09,.35,.09,'quiver',0,0,.3);add(0x9b7958,0,1.21,.28,.65,.15,.09,'armor');}
      if(form>=4){for(let i=-1;i<=1;i++)add(0xf8db7d,i*.2,2.14+(.12-Math.abs(i)*.08),.05,.12,.3,.14,'head');}
    }
    else if(form>0){
      add(0xab9b92,0,1.14,-.31,.82,.72,.18,'body');
      add(0x775852,0,1.87,.38,.67,.15,.15,'head');
      [-1,1].forEach(side=>add(0x775852,side*.58,.37,.14,.38,.3,.4,`arm${side}`));
    }
  } else if (['raptor','dinosaur','dragon','serpent','phoenix','mammoth','glider','swan'].includes(kind)) {
    const mammoth=kind==='mammoth',serpent=kind==='serpent',dragon=kind==='dragon',bird=kind==='phoenix'||kind==='swan',glider=kind==='glider';
    const hide=mammoth?0x9b7958:dragon?0x567b83:serpent?0x386f66:bird?kind==='swan'?0xf1dbc0:0xddaa46:glider?0xab9b92:0x729b79;
    const cy=mammoth?.91:serpent?.43:1, headY=mammoth?1.35:serpent?1.18:bird?1.8:1.52;
    add(hide,0,cy,-.16,mammoth?1.25:.85,mammoth?1.1:.76,mammoth?1.6:1.25,'body');
    add(0xe0b985,0,cy-.15,.26,mammoth?.85:.63,.53,.43,'body');
    if(bird||serpent)add(hide,0,headY-.35,.54,.29,.82,.32,'neck');
    add(hide,0,headY,.65,mammoth?.94:.75,.62,.75,'head');
    add(bird?feet:mammoth?hide:0xa6bd71,0,headY-.14,1.14,bird?.32:.61,.28,bird?.51:.59,'head');
    [-1,1].forEach(side=>{
      add(ivory,side*.295,headY+.08,1.04,.17,.2,.055,'head');add(black,side*.295,headY+.08,1.08,.08,.11,.025,'head');
      if(mammoth){add(hide,side*.63,1.35,.57,.48,.7,.16,'ear');add(ivory,side*.42,.92,1.28,.17,.19,.78,'head');add(ivory,side*.42,1.11,1.62,.15,.47,.17,'head');}
      if(!serpent)for(let i=0;i<(mammoth?2:1);i++){
        const z=mammoth?(.41-i*1.12):-.36;
        add(hide,side*(mammoth?.44:.37),.39,z,mammoth?.33:.3,.78,.36,`leg${i+(side>0?1:0)}`);
        add(mammoth?0x775852:ivory,side*(mammoth?.44:.37),.08,z+.18,.35,.17,.61,`leg${i+(side>0?1:0)}`);
      }
      if(dragon||bird||glider){for(let i=0;i<3;i++)add(i%2?0x90cbc3:hide,side*(.64+i*.38),1.1-i*.06,-.1-i*.25,.58,.12,.9-i*.13,`wing${side}`,0,side*.14,side*.1);
        add(ivory,side*1.65,.98,-.6,.25,.08,.51,`wing${side}`);
      }else if(!mammoth&&!serpent){add(hide,side*.48,1.03,.34,.18,.37,.21,`arm${side}`);add(ivory,side*.48,.9,.56,.2,.11,.3,`arm${side}`);}
      if(dragon||form>=3)add(ivory,side*.28,headY+.5,.5,.14,.53,.14,'head',-.2,0,side*.25);
      if(dragon&&form>=2){add(0xf8db7d,side*.57,1.44,-.28,.32,.44,.52,'armor');add(0x90cbc3,side*1.2,.82,-.88,.63,.10,.72,`wing${side}`,0,side*.4);}
    });
    if(mammoth){add(hide,0,.94,1.5,.26,.8,.29,'head');add(hide,0,.61,1.65,.28,.24,.5,'head',-.4);}
    else for(let i=0;i<4;i++){const scale=1-i*.18;add(hide,Math.sin(i*.7)*.15,cy*.7-i*.08,-.95-i*.4,.48*scale,.42*scale,.65,'tail',-.1);}
    if(dragon||kind==='dinosaur'||serpent)for(let i=0;i<5;i++)add(form>=3?0xf8db7d:0xe0c478,0,cy+.5-i*.07,-.1-i*.38,.14,.32,.25,'spine',0,0,.2);
    if(kind==='raptor'&&form>0)for(let i=0;i<3;i++)add(0xddaa46,0,1.94+i*.13,.64-i*.18,.17,.35,.19,'head',-.3);
    if(kind==='phoenix'){
      for(let i=-2;i<=2;i++)add(i%2?0xf8db7d:0xddaa46,i*.27,.83+Math.abs(i)*.09,-1.5,.21,.12,1.8-Math.abs(i)*.2,'tail',-.2,i*.2);
      for(let i=0;i<3;i++)add(0xf8db7d,0,2.11+i*.13,.64-i*.16,.15,.38,.15,'head',-.3);
    }
    if(dragon&&form===1)[-1,1].forEach(side=>{add(0xe0c478,side*.49,1.24,.4,.36,.19,.48,'armor');add(0x25796e,side*.33,1.91,.49,.25,.2,.42,'head');});
  } else if (kind === 'caterpillar') {
    if (form < 2) {
      for (let i = 0; i < 5; i++) {
        add(i % 2 ? (form===1?0xd5d486:0x87b757) : color, 0,.27,-i*.24,.5-i*.035,.42-i*.03,.3,`segment${i}`);
        add(0xe5bd66,-.22,.08,-i*.24,.12,.15,.1,`leg${i}`); add(0xe5bd66,.22,.08,-i*.24,.12,.15,.1,`leg${i+1}`);
      }
      add(color,0,.48,.23,.6,.53,.44,'head');
      if(form===1)add(0xe0ead0,0,.56,-.5,.56,.2,.72,'body');
      [-1,1].forEach(side=>{add(ivory,side*.19,.56,.461,.18,.2,.04,'head');add(black,side*.19,.55,.49,.09,.11,.04,'head');add(0xd8b66b,side*.19,.85,.23,.055,.3,.06,'antenna',0,0,side*.3);});
    } else {
      add(0xe0b985,0,.8,0,.32,.65,.72,'body'); add(ivory,0,1.11,.32,.48,.46,.4,'head');
      [-1,1].forEach(side=>{
        for(let i=0;i<3;i++)add(form===3?0x90cbc3:0xd5d486,side*(.42+i*.24),.9,-i*.12,.46,.08,.83-i*.12,`wing${side}`,0,side*.2,side*.08);
        add(0xf2ca7a,side*.68,.95,-.03,.24,.07,.26,`wing${side}`);
        if(form>=3)add(0x90cbc3,side*.58,.88,-.77,.24,.09,.65,`wing${side}`,0,side*.2);
        add(black,side*.16,1.18,.53,.09,.12,.04,'head'); add(0xb7ba8a,side*.17,1.52,.28,.045,.36,.05,'antenna',0,0,side*.3);
      });
    }
  } else if (insect) {
    const mantis=kind==='mantis';
    add(color,0,.42,-.25,mantis?.4:.65,.4,mantis?1.2:.9,'body');
    add(mantis?0x80b168:0x25796e,0,.57,-.25,.56,.17,.73,'body');
    add(0xc9bf73,0,.68,-.25,.04,.025,.69,'body');
    add(color,0,.57,.34,.55,.43,.43,'head');
    [-1,1].forEach(side=>{
      add(ivory,side*.19,.65,.56,.17,.18,.04,'head');add(black,side*.18,.65,.59,.09,.1,.03,'head');
      add(0x546b49,side*.17,.88,.35,.045,.3,.05,'antenna',0,0,side*.35);
      for(let i=0;i<3;i++){add(0x406c58,side*.43,.29,.19-i*.32,.43,.09,.1,`leg${i+(side>0?1:0)}`,0,side*.3,side*.2);add(0x406c58,side*.63,.14,.19-i*.32,.08,.26,.08,`leg${i+(side>0?1:0)}`);}
      if(form>0||mantis){add(mantis?0xa9c27a:0xe0c478,side*.24,.68,.73,.12,.13,.5,'head',-.25,side*.35);add(mantis?0xa9c27a:0xe0c478,side*.32,.78,.98,.11,.24,.1,'head');}
      if(form>1)add(0xe2c886,side*.25,.82,-.32,.14,.3,.2,'spine',0,0,side*.4);
      if(form===3&&!mantis)add(0x90cbc3,side*.46,.65,-.28,.24,.32,.94,'armor',0,0,side*.24);
      if(mantis){add(0xa9c27a,side*.55,.86,.65,.13,.65,.14,`arm${side}`,0,0,side*.3);add(ivory,side*.49,.6,.95,.11,.16,.62,`arm${side}`);}
    });
  } else if (bird) {
    const duck=kind==='duckling';
    const bodyColor=duck&&form>1?0x6d8d74:form>0?0xf1dbc0:color;
    add(bodyColor,0,.57,-.08,.7,.67,.82,'body');
    add(duck&&form>0?0x386f66:color,0,.99,.28,.67,.63,.59,'head');
    add(0xffe4a1,0,.4,.27,.5,.32,.3,'body');
    add(feet,0,.91,.65,duck?.48:.23,.17,duck?.4:.27,'head');
    if(duck&&form>0)add(ivory,0,.79,.37,.53,.11,.53,'head');
    [-1,1].forEach(side=>{
      add(black,side*.25,1.08,.585,.105,.15,.045,'head');add(ivory,side*.26,1.12,.616,.035,.04,.02,'head');
      add(duck?0xe7d9af:0xf0b852,side*.41,.64,-.14,.17,.38,.58,`wing${side}`,0,0,side*.12);
      add(feet,side*.22,.15,.01,.11,.3,.12,`leg${side>0?0:1}`);add(feet,side*.22,.035,.15,duck?.29:.2,.07,.31,`leg${side>0?0:1}`);
    });
    add(duck?0xf1dec2:0xddaa46,0,.77,-.58,.33,.29,.29,'tail',-.4);
    if(!duck&&form>0){for(let i=0;i<3;i++)add(0xc9644c,0,1.4+i*.045,.1+i*.17,.15,.2,.18,'head');add(0xcf7156,0,.75,.58,.15,.23,.12,'head');}
    if(form>1)for(let i=0;i<3;i++)add(duck?0x567b83:0x4a8f83,(i-1)*.14,.94+i*.12,-.67,.16,.6,.14,'tail',-.55);
    if(form===3){[-1,1].forEach(side=>add(0xf8db7d,side*.47,.7,-.15,.08,.48,.65,`wing${side}`));add(0xf5dc8d,0,1.48,.24,.1,.19,.12,'head');}
  } else {
    const pig=kind==='piglet'||kind==='boar', rabbit=kind==='rabbit', mouse=kind==='mouse';
    const fox=kind==='fox', wolf=kind==='wolf';
    const bodyColor=pig&&form>1?0xa77f68:pig&&form===1?0xd6a376:color;
    add(bodyColor,0,.6,-.12,pig?.88:.66,.64,1.1,'body');
    add(bodyColor,0,.91,.46,pig?.78:.67,.67,.64,'head');
    add(pig?0xd38f85:ivory,0,.78,.85,pig?.44:.39,.28,.34,'head');
    add(black,0,.84,1.035,pig?.18:.15,.11,.055,'head');
    [-1,1].forEach(side=>{
      add(black,side*.235,1.02,.793,.105,.13,.04,'head');add(ivory,side*.25,1.065,.817,.035,.04,.02,'head');
      add(bodyColor,side*.29,rabbit?1.63:1.35,.39,rabbit?.22:mouse?.36:.25,rabbit?.8:mouse?.35:.32,.18,'ear',0,0,-side*.16);
      add(pig?0xbb7276:0xd4aaa0,side*.29,rabbit?1.64:1.37,.489,rabbit?.10:.13,rabbit?.55:.14,.025,'ear');
      for(let i=0;i<2;i++){add(bodyColor,side*.26,.25,i===0?.3:-.48,.2,.42,.24,`leg${i+(side>0?1:0)}`);add(pig?0x775852:ivory,side*.26,.065,(i===0?.3:-.48)+.06,.22,.12,.3,`leg${i+(side>0?1:0)}`);}
      if(pig&&form>1)add(ivory,side*.3,.73,.98,.11,.34,.12,'head',-.3,0,side*.15);
    });
    if(mouse){add(0xc6a297,0,.46,-1.02,.08,.09,.85,'tail',.18);add(0xc6a297,.14,.39,-1.42,.32,.08,.08,'tail');}
    else if(fox||wolf||(!pig&&form>1)){add(bodyColor,0,.6,-1.05,.32,.36,.85,'tail',-.25);add(ivory,0,.73,-1.45,.29,.3,.28,'tail',-.25);}
    else add(bodyColor,0,.57,-.76,.21,.22,.2,'tail');
    if(form>1||wolf)for(let i=0;i<3;i++)add(pig?0x665c4b:0x56746e,0,1.02,-i*.27,.19,.22,.2,'spine');
    if(form===1&&(pig||mouse))add(pig?0x775852:0xe0b985,0,1.02,-.31,.20,.23,.68,'spine');
    if(form===3){add(0xc1b278,0,1.39,.36,.36,.14,.26,'head');[-1,1].forEach(side=>add(0x99b58d,side*.42,.77,-.15,.13,.4,.8,'armor'));}
  }
  if(form>=4){
    // Mythic anatomy has a bounded vocabulary: orbiting crest, shoulder fins,
    // stepped dorsal crystals and extra tail feathers, not a tint-only upgrade.
    for(let i=0;i<3;i++)add(0x90cbc3,(i-1)*.24,1.35+(i===1?.27:0),-.3,.16,.35,.16,'spine',0,0,(i-1)*.3);
    if(form%2===1)[-1,1].forEach(side=>add(0xf8db7d,side*.65,1.02,-.4,.16,.75,.27,`wing${side}`,0,0,side*.5));
    if(form>=6)for(let i=0;i<3;i++)add(0xe0ead0,(i-1)*.25,.7,-1.1,.15,.2,.75,'tail',-.25);
  }
  if(mutation){[-1,1].forEach(side=>{
    add(mutation===2?0x90cbc3:0xf8db7d,side*(.5+mutation*.09),.9,-.37,.15,.35+mutation*.19,.4,'armor',0,0,side*.35);
    add(0xe0ead0,side*.28,1.88+mutation*.07,.15,.11,.2+mutation*.14,.14,'head',-.2,0,side*.22);
  });}
  return parts;
}

export function createWorld(container, callbacks = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(1.5, devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.16;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.className='wildborn-canvas'; renderer.domElement.setAttribute('aria-hidden','true');
  container.prepend(renderer.domElement);
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x8bada3); scene.fog = new THREE.Fog(0x8bada3, 29, 58);
  const camera = new THREE.OrthographicCamera(-10,10,15,-15,.1,100);
  const hemi = new THREE.HemisphereLight(0xe9f5d5,0x2e4b4d,2.6); scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffe0a5,3.2);sun.position.set(-12,23,9);sun.castShadow=true;
  sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-22;sun.shadow.camera.right=22;sun.shadow.camera.top=22;sun.shadow.camera.bottom=-22;
  sun.shadow.camera.near=.1;sun.shadow.camera.far=65;sun.shadow.normalBias=.06;sun.shadow.bias=-.0003;scene.add(sun);scene.add(sun.target);
  const moon = new THREE.DirectionalLight(0x8eb9ec,.1);moon.position.set(8,13,-9);scene.add(moon);
  const geometry = new THREE.BoxGeometry(1,1,1), materials=new Map();
  const environment = new Boxes(scene,geometry,materials,3500), actors=new Boxes(scene,geometry,materials,700);
  const ghostMaterials=new Map(), foliage=new Boxes(scene,geometry,materials,400), cutaway=new Boxes(scene,geometry,ghostMaterials,100,.18), trees=[];
  const groundMat=new THREE.MeshStandardMaterial({vertexColors:true,roughness:1});
  const ground=new THREE.Mesh(new THREE.BufferGeometry(),groundMat);ground.receiveShadow=true;scene.add(ground);
  const waterMat=new THREE.MeshStandardMaterial({color:0x75b9b0,roughness:.3,metalness:.12,transparent:true,opacity:.76});
  const water=new THREE.Mesh(new THREE.BufferGeometry(),waterMat);water.receiveShadow=true;scene.add(water);
  const ringGeometry=new THREE.RingGeometry(.52,.59,48);ringGeometry.rotateX(-Math.PI/2);
  const ringMat=new THREE.MeshBasicMaterial({color:0xffe6a5,transparent:true,opacity:.75,depthWrite:false,side:THREE.DoubleSide});
  const ring=new THREE.Mesh(ringGeometry,ringMat);scene.add(ring);
  const arcGeometry=new THREE.RingGeometry(.62,1.10,28,1,-Math.PI/2-1.05,2.1);arcGeometry.rotateX(-Math.PI/2);
  const arcMaterial=new THREE.MeshBasicMaterial({color:0xffedba,transparent:true,opacity:.8,depthWrite:false,side:THREE.DoubleSide});
  const attackArc=new THREE.Mesh(arcGeometry,arcMaterial);attackArc.visible=false;scene.add(attackArc);
  const arcOutlineMaterial=new THREE.MeshBasicMaterial({color:0x315f52,transparent:true,opacity:.7,depthWrite:false,side:THREE.DoubleSide});
  const arcOutline=new THREE.Mesh(arcGeometry,arcOutlineMaterial);arcOutline.visible=false;scene.add(arcOutline);
  const shadowGeometry=new THREE.CircleGeometry(.5,24);shadowGeometry.rotateX(-Math.PI/2);
  const shadowMat=new THREE.MeshBasicMaterial({color:0x153c30,transparent:true,opacity:.20,depthWrite:false});
  const playerShadow=new THREE.Mesh(shadowGeometry,shadowMat);scene.add(playerShadow);
  const particleGeometry=new THREE.BufferGeometry(), particlePositions=new Float32Array(240*3), particleColors=new Float32Array(240*3);
  particleGeometry.setAttribute('position',new THREE.BufferAttribute(particlePositions,3));particleGeometry.setAttribute('color',new THREE.BufferAttribute(particleColors,3));
  const particleMat=new THREE.PointsMaterial({size:.20,vertexColors:true,transparent:true,opacity:.9,depthWrite:false});
  const particles=new THREE.Points(particleGeometry,particleMat);particles.frustumCulled=false;scene.add(particles);
  const effectList=[], kits=new Map(), root=new THREE.Object3D(), part=new THREE.Object3D(), matrix=new THREE.Matrix4();
  const pulses=Array.from({length:8},()=>{const material=ringMat.clone(),mesh=new THREE.Mesh(ringGeometry,material);mesh.visible=false;scene.add(mesh);return {mesh,material,age:0,life:0};});
  const floatLayer=document.createElement('div');floatLayer.className='wb-feedback';floatLayer.ariaHidden='true';container.append(floatLayer);
  const floats=Array.from({length:12},()=>{const node=document.createElement('span');node.className='wb-float';node.hidden=true;floatLayer.append(node);return {node,age:0,life:0,x:0,z:0};});
  const eventCounts={};let lastTrail=0;
  let state=null, chunk='', lastEvent=0, visualTime=0, width=1,height=1, disposed=false, lost=false, shake=0, evolution=0;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');

  function terrain(s) {
    const cx=Math.round(s.player.x/16)*16,cz=Math.round(s.player.z/16)*16;
    const key=`${s.seed},${cx},${cz}`;if(chunk===key)return;chunk=key;
    const positions=[],normColors=[];const col=new THREE.Color();const base=new THREE.Color();
    const push=(x,z,color)=>{positions.push(x,groundHeight(x,z),z);normColors.push(color.r,color.g,color.b);};
    for(let x=cx-48;x<cx+48;x+=3)for(let z=cz-48;z<cz+48;z+=3){
      base.setHex(colors[habitat(x+1.5,z+1.5)]);col.copy(base).multiplyScalar(.92+hash(x,z,s.seed+4)*.16);
      push(x,z,col);push(x,z+3,col);push(x+3,z+3,col);push(x,z,col);push(x+3,z+3,col);push(x+3,z,col);
    }
    const next=new THREE.BufferGeometry();next.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));next.setAttribute('color',new THREE.Float32BufferAttribute(normColors,3));next.computeVertexNormals();
    ground.geometry.dispose();ground.geometry=next;
    const waterPositions=[];
    for(let z=cz-52;z<cz+52;z+=2){const x=riverX(z),x2=riverX(z+2);const y=groundHeight(x,z)+.36,y2=groundHeight(x2,z+2)+.36;
      waterPositions.push(x-2.7,y,z,x2-2.7,y2,z+2,x2+2.7,y2,z+2,x-2.7,y,z,x2+2.7,y2,z+2,x+2.7,y,z);}
    const wg=new THREE.BufferGeometry();wg.setAttribute('position',new THREE.Float32BufferAttribute(waterPositions,3));wg.computeVertexNormals();water.geometry.dispose();water.geometry=wg;
    environment.begin();trees.length=0;
    const gx=Math.floor(cx/7),gz=Math.floor(cz/7);
    for(let ix=gx-7;ix<=gx+7;ix++)for(let iz=gz-7;iz<=gz+7;iz++){
      const t=treeAt(ix,iz,s.seed);if(!t)continue;const y=groundHeight(t.x,t.z), h=t.height;
      trees.push(t);
      environment.box(0x755d47,t.x,y+h*.4,t.z,.43,h*.8,.48);
      environment.box(0x9b7958,t.x-.05,y+h*.38,t.z+.255,.12,h*.7,.045);
      environment.box(0x8d7550,t.x+.6,y+h*.55,t.z,.9,.17,.2,0,0,.4);
    }
    for(let x=Math.floor((cx-42)/4.8);x<=(cx+42)/4.8;x++)for(let z=Math.floor((cz-42)/4.8);z<=(cz+42)/4.8;z++){
      const px=x*4.8,pz=z*4.8,biome=habitat(px,pz),n=hash(x,z,s.seed+61);
      if(coverAt(px,pz,s.seed))for(let i=0;i<9;i++){
        const a=i*2.399,r=.3+hash(x+i,z,s.seed)*1.15;
        const xx=px+Math.cos(a)*r,zz=pz+Math.sin(a)*r,yy=groundHeight(xx,zz),h=.5+hash(x,z+i,s.seed)*.7;
        environment.box(i%2?0x78945d:0x93aa69,xx,yy+h*.5,zz,.10,h,.18,-.12,0,Math.cos(a)*.22);
      }
      if(biome==='marsh'&&n<.6)for(let i=0;i<3;i++){
        const xx=px+i*.32,yy=groundHeight(xx,pz);environment.box(0x708d58,xx,yy+.55,pz,.06,1.1,.07);environment.box(0x9a7556,xx,yy+1.05,pz,.15,.38,.14);
      }
      if(biome!=='water'&&n>.84){
        const yy=groundHeight(px,pz);environment.box(0x88938b,px,yy+.3,pz,.9,.6,.75,0,.25);
        environment.box(0xa2ab99,px-.22,yy+.56,pz-.03,.6,.18,.5,0,.25);
      }
      if(biome==='meadow'&&n>.55&&n<.8)for(let i=0;i<3;i++){
        const xx=px+i*.35,zz=pz+Math.sin(i)*.4,yy=groundHeight(xx,zz);
        environment.box(0x738856,xx,yy+.16,zz,.045,.32,.045);
        environment.box(i===0?0xedbd69:0xf4e4a7,xx,yy+.35,zz,.24,.065,.24);
        environment.box(0xb8954c,xx,yy+.39,zz,.07,.05,.07);
      }
    }
    environment.end();
  }

  function drawCreature(a, isPlayer, t) {
    const p=state.player,def=isPlayer?anatomy(p):(SPECIES[a.kind]||{body:a.kind,variant:0});
    const form=def.variant,mutation=isPlayer&&p.form>=10?1+p.form%3:0;
    const kind=def.body;
    const kitKey=`${kind}:${form}:${mutation}`;
    if(!kits.has(kitKey)){if(kits.size>=64)kits.delete(kits.keys().next().value);kits.set(kitKey,creatureParts(kind,form,undefined,mutation));}
    const size=isPlayer?p.size:(['mammoth','tyrannosaur','wyvern','giant'].includes(a.kind)?1.55:a.kind==='boar'?1.3:a.kind==='wolf'?1.25:a.kind==='fox'?1.1:.75);
    const d=Math.hypot(a.x-p.x,a.z-p.z);if(!isPlayer&&d>LIMITS.interactionRadius)return;
    const move=isPlayer?(p.moving||p.dash>0):a.state!=='windup'&&a.state!=='recover';
    const phase=t*(isPlayer?9:7)+(a.id||0);
    let bob=move&&!reduced.matches?Math.sin(phase*2)*.024:0;
    const waterHere=habitat(a.x,a.z)==='water';
    if(waterHere)bob-=.10;
    const hit=isPlayer?p.invulnerable:a.hit;
    let yaw=a.angle, lean=0;
    if(isPlayer&&p.attack>0){lean=-Math.sin((.34-p.attack)/.34*Math.PI)*.3;yaw+=Math.sin(p.attack/.34*Math.PI)*.16;}
    else if(!isPlayer&&a.state==='windup')lean=.22;
    else if(!isPlayer&&a.state==='lunge')lean=-.25;
    root.position.set(a.x,groundHeight(a.x,a.z)+.03+bob,a.z);root.scale.setScalar(size);root.rotation.set(lean,yaw,0);root.updateMatrix();
    for(const v of kits.get(kitKey)){
      let rx=v.rx,ry=v.ry,rz=v.rz,yy=v.y;
      if(v.role.startsWith('leg')&&move){const leg=Number(v.role.slice(3))||0;rx+=Math.sin(phase+leg*Math.PI)*.45;}
      if(v.role.startsWith('arm')&&move)rx-=Math.sin(phase+(Number(v.role.slice(3))>0?Math.PI:0))*.4;
      if((v.role==='weapon'||v.role.startsWith('arm'))&&isPlayer&&p.attack>0)rx-=Math.sin(p.attack/.34*Math.PI)*1.1;
      if(v.role.startsWith('wing')&&!reduced.matches){const side=Number(v.role.slice(4));rz+=side*Math.sin(phase)*((kind==='caterpillar'&&form>1)?.38:move?.12:.04);}
      if(v.role==='tail'&&!reduced.matches)ry+=Math.sin(t*4)*.12;
      if(v.role.startsWith('segment')&&move&&!reduced.matches)yy+=Math.sin(phase-Number(v.role.slice(7))*.7)*.06;
      if(v.role==='antenna'&&!reduced.matches)rz+=Math.sin(t*3)*.06;
      part.position.set(v.x,yy,v.z);part.scale.set(v.sx,v.sy,v.sz);part.rotation.set(rx,ry,rz);part.updateMatrix();
      matrix.multiplyMatrices(root.matrix,part.matrix);
      const flash=hit>0&&(reduced.matches?hit>.55:Math.sin(t*18)>0);
      actors.matrix(flash?0xffd7b2:v.color,matrix);
    }
    if(!isPlayer&&(a.state==='windup'||a.state==='chase')){
      const h=groundHeight(a.x,a.z)+2.0*size;
      actors.box(a.state==='windup'?0xf6c085:0xd98c68,a.x,h,a.z,.09,.31,.09);
      actors.box(0xf6c085,a.x,h-.24,a.z,.09,.09,.09);
    }
  }

  function drawFood(f,t) {
    if(Math.hypot(f.x-state.player.x,f.z-state.player.z)>LIMITS.interactionRadius)return;
    const y=groundHeight(f.x,f.z), rise=reduced.matches?0:Math.sin(t*2+f.x)*.035;
    if(f.kind==='berry'){
      actors.box(0x547d52,f.x,y+.14,f.z,.58,.27,.48);
      [[-.17,0],[.16,.1],[0,-.16]].forEach(([x,z],i)=>actors.box(i===0?0xd77f6b:0xef9e7c,f.x+x,y+.35+rise,f.z+z,.20,.22,.20));
      actors.box(0xa6bd71,f.x+.08,y+.51+rise,f.z,.20,.05,.09,0,0,-.25);
    }else if(f.kind==='seed'){
      for(let i=0;i<3;i++){actors.box(0xb49e5c,f.x+(i-1)*.15,y+.2,f.z,.05,.4,.05);actors.box(0xf4d087,f.x+(i-1)*.15,y+.4+rise,f.z,.13,.22,.14,0,0,(i-1)*.2);}
    }else if(f.kind==='mushroom'){
      actors.box(0xe4d4b0,f.x,y+.2,f.z,.16,.4,.17);
      actors.box(0xd09970,f.x,y+.43+rise,f.z,.58,.18,.48);actors.box(0xe8bb7f,f.x-.04,y+.55+rise,f.z,.34,.1,.30);
      actors.box(0xf3e4bc,f.x-.16,y+.54+rise,f.z+.1,.09,.04,.08);
    }else if(f.kind==='insect'){
      actors.box(0xb8dbaa,f.x,y+.30+rise,f.z,.2,.16,.36);
      actors.box(0xe0ead0,f.x,y+.43+rise,f.z,.56,.04,.19,0,t,0);
    }else{
      actors.box(0xd6a376,f.x,y+.18+rise,f.z,.44,.31,.43);
      actors.box(0xf1ce8f,f.x-.06,y+.35+rise,f.z,.25,.06,.31);
    }
  }

  function spawnEffect(e) {
    eventCounts[e.type]=(eventCounts[e.type]||0)+1;
    const count=({evolution:64,birth:26,food:16,hit:e.heavy?28:18,hurt:16,dash:12,footstep:2,defeat:28,water:14,cover:9,breath:28})[e.type]||0;
    const color=e.type==='hurt'?0xf3a08b:e.type==='food'?0x9cd8c4:e.type==='evolution'||e.type==='birth'?0xf8db7d:e.type==='water'?0x90cbc3:e.type==='cover'?0xa6bd71:0xf5d2a0;
    for(let i=0;i<(reduced.matches?Math.min(count,6):count)&&effectList.length<240;i++){
      const a=i*2.399+e.id,force=e.type==='evolution'?2.7:e.type==='hit'||e.type==='defeat'?2.5:1.2;
      const breath=e.type==='breath',d=breath?i/count*e.reach:0;
      effectList.push({x:e.x+Math.sin(e.angle||0)*d,z:e.z+Math.cos(e.angle||0)*d,y:groundHeight(e.x,e.z)+.6+(breath?Math.sin(i)*.18:0),vx:Math.sin(a)*force,vz:Math.cos(a)*force,vy:1.6+(i%4)*.4,age:0,life:reduced.matches?.3:e.type==='evolution'?1.1:.48+(i%4)*.1,color,fly:e.type==='food',chunk:['hit','hurt','defeat','dash','cover','breath'].includes(e.type)});
    }
    if(['hit','hurt','food','evolution','birth','water','defeat'].includes(e.type)){
      const pulse=pulses.find(f=>f.age>=f.life)||pulses[0];
      Object.assign(pulse,{x:e.x,z:e.z,age:0,life:e.type==='evolution'?1.2:.45,max:e.type==='evolution'?4:e.type==='defeat'?2.2:e.type==='food'?.9:1.5});
      pulse.material.color.setHex(color);
    }
    if(e.type==='food'||e.type==='hit'||e.type==='hurt'){
      const f=floats.find(f=>f.age>=f.life)||floats[0];Object.assign(f,{age:0,life:.85,x:e.x,z:e.z,food:e.type==='food'});
      f.node.textContent=e.type==='food'?`+${Math.round(e.growth)} ✦`:`−${Math.round(e.amount)}`;
      f.node.dataset.kind=e.type;f.node.hidden=false;
    }
    if(!reduced.matches&&(e.type==='hurt'||e.type==='hit'))shake=Math.min(.14,Math.max(shake,e.type==='hurt'||e.heavy?.12:.055));
    if(e.type==='evolution'){
      evolution=1.2;const pulse=pulses.find(f=>f.age>=f.life)||pulses[1];Object.assign(pulse,{x:e.x,z:e.z,age:-.12,life:1.25,max:3.2});pulse.material.color.setHex(0x90cbc3);
    }
  }

  function resize() {
    if(disposed)return;const b=container.getBoundingClientRect();width=Math.max(1,b.width);height=Math.max(1,b.height);
    renderer.setSize(width,height,false);
    const aspect=width/height,span=7.2;
    camera.left=-span*Math.max(1,aspect);camera.right=span*Math.max(1,aspect);
    camera.top=span*Math.max(1,1/aspect);camera.bottom=-span*Math.max(1,1/aspect);camera.updateProjectionMatrix();
  }
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(container);
  function onLost(event){event.preventDefault();lost=true;callbacks.onContextLost?.();}
  function onRestored(){lost=false;chunk='';callbacks.onContextRestored?.();}
  renderer.domElement.addEventListener('webglcontextlost',onLost);
  renderer.domElement.addEventListener('webglcontextrestored',onRestored);
  resize();

  function render(next,dt=0,appearance=false) {
    if(disposed||lost||!next)return;state=next;visualTime+=Math.min(.05,dt);const p=state.player;
    terrain(state);
    foliage.begin();cutaway.begin();
    for(const t of trees){const y=groundHeight(t.x,t.z),h=t.height;
      const boxes=Math.abs(t.x-p.x)<2.2&&t.z-p.z>-.4&&t.z-p.z<h*1.15?cutaway:foliage;
      boxes.box(0x627a51,t.x,y+h*.78,t.z,2.9,1.3,2.8);
      boxes.box(0x75905a,t.x-.3,y+h,t.z-.1,2.45,.85,2.2);
      boxes.box(0x8fa667,t.x-.45,y+h*1.13,t.z-.25,1.45,.4,1.6);
      boxes.box(0x4b7156,t.x+.8,y+h*.68,t.z+.1,1.2,.9,1.6);
    }
    foliage.end();cutaway.end();
    for(const e of state.events)if(e.id>lastEvent)spawnEffect(e);lastEvent=state.eventId;
    actors.begin();
    for(const f of state.food)drawFood(f,visualTime);
    for(const a of state.fauna)drawCreature(a,false,visualTime);
    drawCreature(p,true,visualTime);
    // Water glints and distant motes are decorative, never simulation objects.
    for(let i=0;i<12;i++){
      const z=p.z-16+i*2.7,x=riverX(z)+Math.sin(i*7)*1.8;
      if(Math.hypot(x-p.x,z-p.z)<20)actors.box(0xd0e5cf,x,groundHeight(x,z)+.43,z,.15+Math.sin(visualTime+i)*.05,.025,.50,0,.2);
    }
    if(appearance)for(let i=0;i<5;i++){const a=visualTime*.8+i*Math.PI*2/5;actors.box(0xa4d3d0,p.x+Math.sin(a)*.9,groundHeight(p.x,p.z)+.3+i*.12,p.z+Math.cos(a)*.9,.08,.08,.08);}
    if(p.moving&&visualTime-lastTrail>.09){lastTrail=visualTime;spawnEffect({id:Math.floor(visualTime*10),type:p.water?'water':p.dash>0?'dash':'footstep',x:p.x,z:p.z});}
    let n=0;for(let i=effectList.length-1;i>=0;i--){const f=effectList[i];f.age+=dt;if(f.age>f.life){effectList.splice(i,1);continue;}
      if(!reduced.matches){if(f.fly){f.x=mix(f.x,p.x,Math.min(1,dt*9));f.z=mix(f.z,p.z,Math.min(1,dt*9));f.y=mix(f.y,groundHeight(p.x,p.z)+.75,dt*9);}else{f.x+=f.vx*dt;f.z+=f.vz*dt;f.y+=f.vy*dt;f.vy-=2*dt;}}
      if(f.chunk){const size=Math.max(.02,.14*(1-f.age/f.life));actors.box(f.color,f.x,f.y,f.z,size,size*.7,size,reduced.matches?0:f.age*8,f.age*4);}
      particlePositions[n*3]=f.x;particlePositions[n*3+1]=f.y;particlePositions[n*3+2]=f.z;const c=new THREE.Color(f.color);particleColors[n*3]=c.r;particleColors[n*3+1]=c.g;particleColors[n*3+2]=c.b;n++;
    }
    actors.end();
    particleGeometry.setDrawRange(0,n);particleGeometry.attributes.position.needsUpdate=true;particleGeometry.attributes.color.needsUpdate=true;
    const night=Math.max(0,-Math.sin(state.time/240*Math.PI*2+.6));
    const fogDay=new THREE.Color(0x9fb5a3),fogNight=new THREE.Color(0x465e77);scene.fog.color.copy(fogDay).lerp(fogNight,night*.8);scene.background.copy(scene.fog.color);
    hemi.intensity=2.6-night*1.5;sun.intensity=3.1-night*2.35;moon.intensity=night*.8;
    const y=groundHeight(p.x,p.z);shake=Math.max(0,shake-dt);evolution=Math.max(0,evolution-dt);
    const sx=shake&&!reduced.matches?Math.sin(visualTime*90)*shake:0;
    camera.position.set(p.x+sx,y+20,p.z+18);camera.lookAt(p.x,y+.2,p.z);
    sun.position.set(p.x-12,y+23,p.z+9);sun.target.position.set(p.x,y,p.z);
    ring.position.set(p.x,y+.045,p.z);ring.scale.setScalar(p.size*(1+evolution*.45));ringMat.opacity=p.hidden?.28:.72;
    attackArc.visible=p.attack>0;attackArc.position.set(p.x,y+.32,p.z);attackArc.rotation.y=p.angle+(reduced.matches?0:(.17-p.attack)*3);attackArc.scale.setScalar(combatTraits(p).reach);arcMaterial.opacity=p.attack>.22?.28:.92;
    arcOutline.visible=attackArc.visible;arcOutline.position.set(p.x,y+.29,p.z);arcOutline.rotation.copy(attackArc.rotation);arcOutline.scale.setScalar(combatTraits(p).reach*1.08);arcOutlineMaterial.opacity=arcMaterial.opacity*.75;
    playerShadow.position.set(p.x,y+.03,p.z);playerShadow.scale.set(p.size*1.8,1,p.size*1.5);
    for(const f of pulses){f.age+=dt;f.mesh.visible=f.age>=0&&f.age<f.life;if(!f.mesh.visible)continue;const q=f.age/f.life;f.mesh.position.set(f.x,groundHeight(f.x,f.z)+.1,f.z);f.mesh.scale.setScalar(reduced.matches?f.max*.5:.3+q*f.max);f.material.opacity=(1-q)*.85;}
    camera.updateMatrixWorld();
    for(const f of floats){f.age+=dt;f.node.hidden=f.age>=f.life;if(f.node.hidden)continue;
      const q=f.age/f.life,fx=f.food&&!reduced.matches?mix(f.x,p.x,q):f.x,fz=f.food&&!reduced.matches?mix(f.z,p.z,q):f.z;
      const v=new THREE.Vector3(fx,groundHeight(fx,fz)+1+(reduced.matches?0:q*.9),fz).project(camera);
      f.node.style.left=`${(v.x*.5+.5)*width}px`;f.node.style.top=`${(-.5*v.y+.5)*height}px`;f.node.style.opacity=String(Math.min(1,(1-q)*3));
    }
    renderer.render(scene,camera);
  }

  return {
    canvas:renderer.domElement, render, resize,
    reset(eventId=0){chunk='';lastEvent=eventId;effectList.length=0;visualTime=0;lastTrail=0;shake=0;evolution=0;for(const f of floats){f.age=f.life;f.node.hidden=true;}for(const f of pulses){f.age=f.life;f.mesh.visible=false;}},
    project(x,y,z){const v=new THREE.Vector3(x,y,z).project(camera);return {x:(v.x*.5+.5)*width,y:(-.5*v.y+.5)*height};},
    inspect(){return {engine:THREE.REVISION,calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures,programs:renderer.info.programs?.length||0,particles:effectList.length,pulses:pulses.filter(f=>f.age<f.life).length,floaters:floats.filter(f=>f.age<f.life).length,events:{...eventCounts},kitCount:kits.size,contexts:disposed?0:1};},
    dispose(){if(disposed)return;disposed=true;resizeObserver.disconnect();renderer.domElement.removeEventListener('webglcontextlost',onLost);renderer.domElement.removeEventListener('webglcontextrestored',onRestored);environment.dispose();actors.dispose();foliage.dispose();cutaway.dispose();ground.geometry.dispose();water.geometry.dispose();geometry.dispose();ringGeometry.dispose();arcGeometry.dispose();arcMaterial.dispose();arcOutlineMaterial.dispose();shadowGeometry.dispose();particleGeometry.dispose();groundMat.dispose();waterMat.dispose();ringMat.dispose();shadowMat.dispose();particleMat.dispose();for(const f of pulses)f.material.dispose();floatLayer.remove();for(const m of [...materials.values(),...ghostMaterials.values()])m.dispose();renderer.dispose();renderer.domElement.remove();effectList.length=0;kits.clear();materials.clear();ghostMaterials.clear();},
  };
}
