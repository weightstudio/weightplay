// Pinned repository Three.js r180 (MIT); this module never modifies its vendor source.
import * as THREE from '../block-apex/vendor/three/three.module.min.js';
import { BOARDS, getBoard, trackCenter, trackWidth, featureX, gateIsOpen, tideLabel } from './content.mjs';

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const C={water:0x21b9bd,deep:0x146d85,foam:0xd6fff2,wood:0xa36a35,gold:0xf4c46d,stone:0x526c60,leaf:0x3e7955,teal:0x118e99,cream:0xffedbe,brown:0x9f5e34};
const hash=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);};
// A world row keeps its mesh slot while it remains in the scenery window.
// Assigning variants by the moving window index made visible trees/rocks morph.
const scenerySlot=(row,rows,column,columns)=>((row%rows+rows)%rows)*columns+column;

// Bake designed cuboid parts into one color-vertex mesh; individual joint meshes remain animatable.
function sculpture(parts,material){
  const positions=[],normals=[],colors=[];
  for(const p of parts){
    const g=new THREE.BoxGeometry(...p.size).toNonIndexed();
    if(p.rotation)g.applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(...p.rotation)));
    g.translate(...p.at);
    const a=g.attributes.position.array,n=g.attributes.normal.array,color=new THREE.Color(p.color);
    positions.push(...a);normals.push(...n);
    for(let i=0;i<a.length/3;i++)colors.push(color.r,color.g,color.b);
    g.dispose();
  }
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  geometry.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));
  geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
  geometry.computeBoundingSphere();
  return new THREE.Mesh(geometry,material);
}
const part=(size,at,color,rotation)=>({size,at,color,rotation});

// Deliberately composed silhouettes, not an additional source of track geometry.
// Each cluster is baked once, then its bounded pool follows world-space rows.
function treeParts(kind){
  const trunk=[part([.32,2.4,.36],[0,.95,0],0x85532c),part([.18,1.8,.39],[-.09,.9,.025],0xb98043),
    part([.9,.18,.22],[.35,1.62,.02],0x85532c,[0,0,.23]),part([.68,.2,.24],[-.25,1.86,-.08],0x966336,[0,0,-.3]),
    part([.7,.23,.52],[0,-.19,0],0x795130)];
  if(kind===1)return [...trunk,part([1.95,.63,1.62],[0,1.99,0],0x35684a),part([1.61,.62,1.37],[-.12,2.48,-.05],0x4b9158),
    part([1.13,.55,1.0],[.05,2.99,-.1],0x71ab62),part([.59,.36,.64],[-.03,3.39,-.1],0x9dc574)];
  if(kind===2)return [...trunk,part([1.6,.74,1.44],[-.28,2.2,.02],0x3b7951),part([1.12,.7,1.12],[-.44,2.79,.01],0x6ca25b),
    part([1.13,.65,1.23],[.65,2.06,.03],0x4e8c52),part([.86,.42,.91],[.68,2.53,-.04],0x95be68),
    part([.68,.31,.68],[-.37,3.26,.05],0x9bc16c)];
  return [...trunk,part([1.92,.64,1.69],[0,2.15,0],0x34704a),part([1.56,.64,1.3],[-.13,2.67,-.05],0x5d9a55),
    part([.98,.35,.95],[.04,3.13,-.13],0x91bd68),part([.81,.48,.91],[.85,2.42,.07],0x55934f),
    part([.65,.29,.69],[.91,2.77,.06],0x8ab764)];
}

const WATER_ROWS=77,WATER_COLUMNS=9;
const LIMESTONE_SLOTS=96;
const LIMESTONE_ANCHORS=[[-.04,1.3,-.08],[-.2,1.48,-.1],[.15,1.23,-.08]];
// Three authored rock silhouettes have exposed limestone faces, ledges,
// fissures and short moss caps. No continuous raised grass ribbon remains.
function limestoneParts(kind){
  if(kind===1)return [part([.95,.34,1],[0,.17,0],0x647c73),part([.5,.7,.62],[-.22,.66,-.05],0x96a692),
    part([.38,.5,.5],[.22,.6,.13],0x819782),part([.4,.3,.49],[-.2,1.15,-.1],0xb9c5aa),
    part([.25,.16,.32],[-.2,1.38,-.1],0xd0d7ba),part([.3,.2,.35],[.33,.94,.04],0xa4b198),
    part([.18,.035,.2],[-.25,1.48,-.1],0x74a065),part([.2,.04,.19],[.27,.875,.14],0x688f59),
    part([.03,.31,.035],[-.32,.69,.28],0x5a7265)];
  if(kind===2)return [part([1.1,.32,.94],[0,.16,0],0x60796e),part([.82,.38,.8],[-.08,.5,.02],0x8fa18a),
    part([.63,.36,.65],[.12,.84,-.06],0xa9b79a),part([.48,.18,.52],[.15,1.12,-.08],0xc7d1af),
    part([.34,.22,.4],[-.41,.48,.12],0x7d9580),part([.27,.035,.28],[.15,1.23,-.08],0x7ba36a),
    part([.21,.08,.19],[-.29,.72,.16],0x638c59),part([.04,.22,.035],[.18,.83,.275],0x6b8270)];
  return [part([1,.38,.9],[0,.19,0],0x627b70),part([.72,.26,1],[-.12,.48,.05],0x889e89),
    part([.7,.55,.68],[.02,.83,-.09],0xa9b8a0),part([.53,.2,.5],[-.04,1.18,-.08],0xc5d0b5),
    part([.28,.18,.45],[.45,.47,.1],0x8da18a),part([.35,.035,.31],[-.12,1.3,-.05],0x6e9c5e),
    part([.22,.13,.18],[-.3,1.2,.14],0x5d8957),part([.022,.4,.035],[-.19,.84,.27],0x6c8374)];
}
function stripGeometry(rows,columns,{hardEdges=false,reverse=false}={}){
  const stride=hardEdges?(columns-1)*2:columns,geometry=new THREE.BufferGeometry(),indices=[];
  const position=new THREE.Float32BufferAttribute(new Float32Array(rows*stride*3),3).setUsage(THREE.DynamicDrawUsage);
  const color=new THREE.Float32BufferAttribute(new Float32Array(rows*stride*3),3).setUsage(THREE.DynamicDrawUsage);
  const normal=new THREE.Float32BufferAttribute(new Float32Array(rows*stride*3),3);
  for(let i=0;i<rows*stride;i++)normal.setXYZ(i,0,1,0);
  for(let row=0;row<rows-1;row++)for(let column=0;column<columns-1;column++){
    const a=row*stride+(hardEdges?column*2:column),b=a+stride;
    indices.push(...(reverse?[a,b,a+1,b,b+1,a+1]:[a,a+1,b,b,a+1,b+1]));
  }
  geometry.setAttribute('position',position);geometry.setAttribute('color',color);geometry.setAttribute('normal',normal);geometry.setIndex(indices);
  return geometry;
}

// Six fixed player variants are constructed once. Equipping never creates a
// new material, geometry cache entry, renderer or gameplay modifier.
function makeBoard(material,palette,boardId='brook',cosmetic=false){
  const night=Boolean(cosmetic),drift=boardId==='driftfin',wood=night?0xc3602b:drift?0x124858:C.wood,deck=night?0xf3a650:drift?0x176477:0xe2ac57;
  const accent=night?0x106376:boardId==='reedguard'?0x75b776:boardId==='driftfin'?0x49d6e2:palette.coat;
  const trim=night?0xffd17d:drift?0xe2b45f:0xd2a263,parts=[];
  if(boardId==='driftfin'){
    parts.push(part([.91,.17,2.05],[0,.08,0],wood),part([.8,.16,1.85],[0,.19,0],deck),
      part([.65,.13,.26],[0,.18,-1.07],trim),part([.38,.12,.22],[0,.18,-1.25],trim),
      part([.18,.12,.7],[-.55,.08,.58],accent),part([.18,.12,.7],[.55,.08,.58],accent),
      part([.22,.04,1.78],[0,.285,0],accent),part([.43,.045,.13],[0,.29,-.42],trim,[0,.42,0]),
      part([.43,.045,.13],[0,.29,.2],trim,[0,-.42,0]),part([.12,.23,.56],[0,-.1,.65],accent));
  }else if(boardId==='reedguard'){
    parts.push(part([1.29,.18,1.98],[0,.08,0],wood),part([1.16,.15,1.77],[0,.2,0],night?deck:0xb4c68e),
      part([.15,.2,1.78],[-.62,.22,0],accent),part([.15,.2,1.78],[.62,.22,0],accent),
      part([1.08,.15,.22],[0,.2,-1.03],trim),part([1.08,.15,.22],[0,.2,1.03],trim),
      part([.74,.035,.16],[0,.295,-.43],accent),part([.74,.035,.16],[0,.295,.04],accent),
      part([.74,.035,.16],[0,.295,.51],accent),part([.12,.19,.44],[-.35,-.1,.6],accent),part([.12,.19,.44],[.35,-.1,.6],accent));
  }else{
    parts.push(part([1.14,.17,2.05],[0,.08,0],wood),part([1.02,.16,1.83],[0,.19,0],deck),
      part([.34,.035,1.82],[0,.285,0],accent),part([.9,.12,.26],[0,.18,-1.07],trim),
      part([.82,.12,.22],[0,.18,1.06],trim),part([.12,.23,.46],[0,-.1,.56],accent));
  }
  if(night)parts.push(part([.11,.08,1.55],[-.32,.3,0],0xffb991),part([.11,.08,1.55],[.32,.3,0],0xffb991),
    part([.16,.19,.16],[-.37,.38,.72],0xf47e78),part([.13,.31,.13],[.32,.43,.73],0xf6a7a0),
    part([.28,.04,.35],[0,.04,1.4],0xf47e78),part([.16,.035,.28],[-.2,.035,1.71],0xffc59e),part([.16,.035,.28],[.2,.035,1.71],0xffc59e));
  return sculpture(parts,material);
}

function buoyGlyph(shape,color=C.cream){
  const z=.145,y=1.4;
  if(shape==='bar')return [part([.54,.13,.07],[.22,y+.16,z],color),part([.54,.13,.07],[.22,y-.16,z],color)];
  if(shape==='cross')return [part([.18,.57,.07],[.22,y,z],color),part([.57,.18,.075],[.22,y,z+.01],color)];
  if(shape==='diamond')return [part([.4,.4,.08],[.22,y,z],color,[0,0,Math.PI/4]),part([.14,.14,.04],[.22,y,z+.065],0x6a492b,[0,0,Math.PI/4])];
  return [part([.53,.11,.07],[.22,y+.22,z],color),part([.53,.11,.07],[.22,y-.22,z],color),
    part([.11,.44,.07],[.0,y,z],color),part([.11,.44,.07],[.44,y,z],color)];
}

function phasePlaque(ready,material){
  const frame=ready?0x43d69f:0xf49372,ink=ready?0xbaffe0:0xffd2b5;
  const parts=[part([.94,.82,.1],[0,0,0],ready?0x103b35:0x47292b),
    part([1.04,.06,.13],[0,.44,0],frame),part([1.04,.06,.13],[0,-.44,0],frame),
    part([.06,.82,.13],[-.5,0,0],frame),part([.06,.82,.13],[.5,0,0],frame)];
  if(ready)parts.push(part([.15,.34,.08],[-.17,-.1,.1],ink,[0,0,.65]),part([.15,.65,.08],[.12,.02,.1],ink,[0,0,-.55]));
  else parts.push(part([.14,.64,.08],[0,0,.1],ink,[0,0,.72]),part([.14,.64,.08],[0,0,.1],ink,[0,0,-.72]));
  return sculpture(parts,material);
}

function makeRacer(material,species='otter'){
  const group=new THREE.Group(),body=new THREE.Group();group.add(body);
  const palette=species==='fox'?{fur:0xd87934,coat:0x2882a1,muzzle:0xffe3b4}:species==='rabbit'?{fur:0xe3d9bc,coat:0x9472b4,muzzle:0xfff5d9}:species==='turtle'?{fur:0x8ca068,coat:0x5e7651,muzzle:0xd2daa3}:{fur:C.brown,coat:C.teal,muzzle:C.cream};
  const board=makeBoard(material,palette,species==='fox'?'driftfin':species==='turtle'?'reedguard':'brook');group.add(board);
  const torso=sculpture([
    part([.7,.76,.48],[0,.91,0],palette.coat),part([.58,.56,.13],[0,.89,.29],palette.muzzle),
    part([.73,.09,.5],[0,.58,0],0xffdf9a),part([.075,.57,.035],[-.28,.99,.27],0x45bcb5),
    part([.1,.82,.08],[.18,.9,.37],0x5d402b,[0,0,-.38]),part([.2,.16,.1],[.08,.88,.42],C.gold),
    part([.08,.26,.09],[-.18,.83,.43],0xef6952),part([.22,.08,.09],[-.18,.83,.43],0xef6952),
    part([.3,.3,.45],[-.27,.43,.12],palette.fur),part([.3,.3,.45],[.27,.43,-.1],palette.fur),
    part([.38,.16,.57],[-.31,.31,.28],palette.fur),part([.38,.16,.57],[.31,.31,.08],palette.fur)
  ],material);body.add(torso);
  const head=new THREE.Group();head.position.set(0,1.42,.05);body.add(head);
  const headParts=[
    part([.91,.77,.69],[0,.2,0],palette.fur),part([.8,.14,.6],[0,.64,-.02],palette.fur),
    part([.23,.28,.25],[-.5,.45,0],palette.fur),part([.23,.28,.25],[.5,.45,0],palette.fur),
    part([.16,.17,.1],[-.51,.45,.15],0xba8560),part([.16,.17,.1],[.51,.45,.15],0xba8560),
    part([.75,.27,.24],[0,.04,.43],palette.muzzle),part([.32,.25,.18],[-.19,-.02,.55],palette.muzzle),
    part([.32,.25,.18],[.19,-.02,.55],palette.muzzle),part([.17,.14,.15],[0,.14,.62],0x3b2d29),
    part([.18,.08,.08],[0,-.12,.52],0x743b2d),
    part([.24,.27,.05],[-.24,.3,.376],0xfff8df),part([.24,.27,.05],[.24,.3,.376],0xfff8df),
    part([.12,.2,.055],[-.21,.29,.413],0x102b32),part([.12,.2,.055],[.27,.29,.413],0x102b32),
    part([.045,.075,.02],[-.225,.35,.45],0xeaffff),part([.045,.075,.02],[.255,.35,.45],0xeaffff)
  ];
  if(species==='otter'){
    headParts.push(part([.76,.09,.52],[0,.73,-.04],0xbd8049),part([1.02,.14,.12],[0,.62,-.35],0x155764),
      part([.15,.12,.15],[0,.62,.39],0xc48a36));
    for(const x of [-.26,.26])headParts.push(part([.44,.34,.12],[x,.62,.38],C.gold),
      part([.38,.08,.13],[x,.77,.39],0xffe3a0),part([.32,.23,.035],[x,.63,.46],0x32b8ca),
      part([.11,.14,.02],[x-.07,.68,.485],0xe5ffff),part([.13,.04,.02],[x+.045,.55,.485],0x168393));
  }
  if(species==='fox')headParts.push(part([.25,.42,.23],[-.35,.74,0],palette.fur),part([.25,.42,.23],[.35,.74,0],palette.fur));
  if(species==='rabbit')headParts.push(part([.22,.78,.24],[-.29,.92,0],palette.fur),part([.22,.78,.24],[.29,.98,0],palette.fur),part([.1,.52,.045],[-.29,.94,.15],0xd7a8bc),part([.1,.52,.045],[.29,1,.15],0xd7a8bc));
  if(species==='turtle')torso.add(scultShell(material));
  head.add(sculpture(headParts,material));
  const arms=[];for(const sign of [-1,1]){
    const arm=new THREE.Group();arm.position.set(sign*.43,1.11,0);arm.rotation.z=sign*.4;
    arm.add(sculpture([part([.29,.45,.36],[0,-.16,.04],palette.coat),part([.32,.14,.39],[0,-.42,.07],0x4db2ae),part([.32,.25,.35],[0,-.56,.1],palette.fur)],material));body.add(arm);arms.push(arm);
  }
  const tail=sculpture([part([.42,.25,.55],[0,.46,-.46],palette.fur),part([.43,.22,.58],[0,.43,-.86],palette.fur),part([.36,.19,.4],[0,.42,-1.25],palette.fur),part([.31,.11,.24],[0,.48,-1.47],0x48b2b4)],material);body.add(tail);
  body.rotation.y=-.5;
  return {group,body,head,arms,board,species,palette};
}
function scultShell(material){return sculpture([part([.91,.66,.33],[0,1,-.34],0x546e3b),part([.7,.38,.12],[0,1.2,-.55],0x90aa62),part([.23,.17,.2],[-.22,1.42,-.46],0x5c8d4b),part([.26,.22,.22],[.15,1.43,-.45],0x85b54d)],material);}

export class RapidsRenderer{
  constructor(container,{onContextLost=()=>{}}={}){
    this.container=container;this.disposed=false;this.reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));this.renderer.setClearColor(0x73c9c0);
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.04;
    this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    this.canvas=this.renderer.domElement;this.canvas.setAttribute('aria-hidden','true');this.canvas.className='rapids-world';container.prepend(this.canvas);
    this.scene=new THREE.Scene();this.scene.fog=new THREE.Fog(0xa6d8cb,46,82);
    this.camera=new THREE.PerspectiveCamera(48,1,.1,110);
    this.skyLight=new THREE.HemisphereLight(0xd9f5ff,0x294c48,.8);this.scene.add(this.skyLight);
    this.sun=new THREE.DirectionalLight(0xffe2a0,2.65);this.sun.castShadow=true;
    this.sun.shadow.mapSize.set(1024,1024);Object.assign(this.sun.shadow.camera,{left:-40,right:40,top:44,bottom:-44,near:.5,far:120});
    this.sun.shadow.camera.updateProjectionMatrix();
    this.sun.shadow.bias=-.00035;this.sun.shadow.normalBias=.035;this.sun.shadow.radius=2;
    this.scene.add(this.sun,this.sun.target);
    this.material=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.6,metalness:.025});
    this.waterMat=new THREE.MeshStandardMaterial({color:0xffffff,vertexColors:true,roughness:.28,metalness:.025});
    this.waterColors=Array.from({length:WATER_COLUMNS},()=>new THREE.Color());
    this.waterDeep=new THREE.Color();this.waterEdge=new THREE.Color();
    this.ridgeMat=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.94});
    this.ridgeSlots=Array.from({length:LIMESTONE_SLOTS},()=>({}));
    this.woodMat=new THREE.MeshStandardMaterial({color:C.wood,roughness:.8});
    this.bankMat=new THREE.MeshStandardMaterial({color:0xb5874a,roughness:.87});
    this.shoreMat=new THREE.MeshStandardMaterial({color:0xffffff,vertexColors:true,roughness:.92});
    this.rockMat=new THREE.MeshStandardMaterial({color:C.stone,roughness:1});
    this.leafMat=new THREE.MeshStandardMaterial({color:0xffffff,vertexColors:true,roughness:.86});
    this.foamMat=new THREE.MeshBasicMaterial({color:C.foam,transparent:true,opacity:.65});
    this.currentMat=new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:.34,depthWrite:false});
    this.targetMat=new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:.88,depthWrite:false});
    this.box=new THREE.BoxGeometry(1,1,1);this.dummy=new THREE.Object3D();this.tmp=new THREE.Vector3();this.tint=new THREE.Color();
    const inst=(count,material,parts=null)=>{const geometry=parts?sculpture(parts,material).geometry:this.box,m=new THREE.InstancedMesh(geometry,material,count);m.frustumCulled=false;this.scene.add(m);return m;};
    // A large following slab avoids exposing a rectangular terrain edge in
    // short landscape; all raised scenery remains outside the authored water.
    this.ground=new THREE.Mesh(this.box,new THREE.MeshStandardMaterial({color:0x41664c,roughness:.96}));this.ground.scale.set(220,.4,240);this.ground.receiveShadow=true;this.scene.add(this.ground);
    // One shared surface has continuous lateral color and no overlapping
    // per-metre panels. Its top is the authoritative water contact plane y=0.
    this.water=new THREE.Mesh(stripGeometry(WATER_ROWS,WATER_COLUMNS),this.waterMat);this.water.frustumCulled=false;this.water.receiveShadow=true;this.scene.add(this.water);
    this.ridges=Array.from({length:3},(_,kind)=>inst(LIMESTONE_SLOTS/3,this.ridgeMat,limestoneParts(kind)));
    this.banks=inst(152,this.bankMat);this.shores=inst(152,this.shoreMat);
    this.shores.geometry=sculpture([part([1,.51,1.04],[.5,-.14,0],0x6b6148),part([.96,.16,1.06],[.52,.04,0],0x9b8553),part([.85,.17,1.025],[.58,.2,0],0x688d51),part([.72,.09,1.015],[.64,.325,0],0x91b36b)],this.shoreMat).geometry;
    this.rocks=inst(64,this.shoreMat,[part([1,.55,1],[0,.27,0],0x65776b),part([.83,.32,.84],[.06,.7,-.03],0x91a28a),part([.51,.16,.64],[-.1,.94,.01],0xb2bda1),part([.5,.045,.42],[.2,.86,.18],0x578664)]);
    this.trees=Array.from({length:3},(_,kind)=>inst(kind===2?26:27,this.leafMat,treeParts(kind)));
    this.outerTrees=inst(32,this.leafMat,treeParts(2));
    this.reeds=inst(72,this.leafMat,[part([.07,.73,.07],[-.15,.2,0],0x4f8857,[0,0,-.14]),part([.07,.95,.08],[.03,.32,.08],0x70a263,[0,0,.1]),part([.08,.64,.07],[.2,.16,-.05],0x3d7653,[0,0,.23]),part([.14,.27,.12],[.02,.89,.08],0xbea16d)]);
    this.flowers=inst(40,this.leafMat,[part([.06,.33,.06],[0,.1,0],0x4a8654),part([.23,.09,.22],[0,.31,0],0xf6d273),part([.1,.08,.1],[0,.39,0],0xfff0b8),part([.12,.08,.17],[-.1,.08,0],0x6da45c)]);
    this.foam=inst(76,this.foamMat,[part([1,.016,.42],[0,0,-.34],C.foam),part([.72,.016,.23],[.18,0,.05],C.foam),part([.48,.016,.17],[-.15,0,.3],C.foam)]);
    this.glints=inst(48,new THREE.MeshBasicMaterial({color:0xe1fff2,transparent:true,opacity:.3,depthWrite:false}));
    this.ribbons=inst(76,new THREE.MeshBasicMaterial({color:0xaaf8eb,transparent:true,opacity:.16,depthWrite:false}));
    this.wakes=inst(32,this.foamMat.clone());this.wakes.material.color.setHex(0xffffff);this.contactShadows=inst(4,new THREE.MeshBasicMaterial({color:0x174b52,transparent:true,opacity:.16,depthWrite:false}));
    this.lanternPosts=inst(24,this.woodMat);this.lanternCaps=inst(24,this.bankMat);this.lanternLights=inst(24,new THREE.MeshBasicMaterial({color:0xffd785}));
    this.models=[makeRacer(this.material,'otter'),makeRacer(this.material,'fox'),makeRacer(this.material,'turtle'),makeRacer(this.material,'rabbit')];this.models.forEach(m=>this.scene.add(m.group));
    this.models.forEach(model=>model.group.traverse(node=>{if(node.isMesh){node.castShadow=true;node.receiveShadow=true;}}));
    for(const mesh of [this.banks,this.shores,this.rocks,...this.trees,...this.ridges,this.outerTrees]){mesh.castShadow=true;mesh.receiveShadow=true;}
    this.models.forEach((model,index)=>model.group.scale.setScalar(index===0?1.14:1.06));
    this.boardVariants=new Map();this.appearance={boardId:'brook',cosmetic:false};
    const originalBoard=this.models[0].board;this.models[0].group.remove(originalBoard);originalBoard.geometry.dispose();
    for(const board of BOARDS)for(const cosmetic of [false,true]){const variant=makeBoard(this.material,this.models[0].palette,board.id,cosmetic);variant.visible=false;variant.castShadow=true;variant.receiveShadow=true;this.models[0].group.add(variant);this.boardVariants.set(`${board.id}:${cosmetic}`,variant);}
    this.setAppearance('brook',false);
    this.responses=new Map();this.motionPoint=new THREE.Vector3();this.motionUp=new THREE.Vector3(0,1,0);
    this.anchorFrom=new THREE.Vector3();this.anchorTo=new THREE.Vector3();this.anchorDirection=new THREE.Vector3();this.bankPoint=new THREE.Vector3();
    this.ropeMat=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.68});this.phaseMat=new THREE.MeshBasicMaterial({vertexColors:true});
    this.anchorRope=sculpture([part([1,1,.75],[0,0,0],0x73502b),part([.58,1,.38],[0,0,.39],0xffe5b4),part([.12,1,.18],[-.39,0,.35],0xc99443),part([.12,1,.18],[.39,0,.35],0xc99443)],this.ropeMat);
    this.anchorMarker=new THREE.Mesh(this.box,this.foamMat);this.anchorClasp=sculpture([part([.24,.15,.24],[0,0,0],0x73502b),part([.15,.16,.16],[0,.015,.015],0xffdf8f)],this.ropeMat);
    this.anchorRope.visible=this.anchorMarker.visible=this.anchorClasp.visible=false;this.scene.add(this.anchorRope,this.anchorMarker,this.anchorClasp);
    this.featureRoot=new THREE.Group();this.scene.add(this.featureRoot);this.featureNodes=[];
    this.particles=inst(64,new THREE.MeshBasicMaterial({color:0xaaffee,transparent:true,opacity:.85}));this.particleData=[];
    this.onLost=e=>{e.preventDefault();onContextLost();};this.canvas.addEventListener('webglcontextlost',this.onLost);
    this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(container);this.resize();
  }
  // Returns viewport CSS pixels, never drawing-buffer/DPR coordinates.
  projectToViewport(s,x=0,y=0){
    if(this.disposed||!this.stage)return null;
    const box=this.container.getBoundingClientRect();if(!box.width||!box.height)return null;
    this.motionPoint.set(this.worldX(s,x),y,-s).project(this.camera);
    if(![this.motionPoint.x,this.motionPoint.y,this.motionPoint.z].every(Number.isFinite)||Math.abs(this.motionPoint.x)>1||Math.abs(this.motionPoint.y)>1||Math.abs(this.motionPoint.z)>1)return null;
    return {x:box.left+(this.motionPoint.x+1)*box.width/2,y:box.top+(1-this.motionPoint.y)*box.height/2};
  }
  respond(event){
    const kind=event.type==='land'&&event.clean===true?'land':event.type==='hit'?'hit':event.type==='bump'?'bump':null;
    if(kind){if(this.responses.size>=4&&!this.responses.has(event.racerId))this.responses.delete(this.responses.keys().next().value);this.responses.set(event.racerId,{kind,time:event.time,duration:kind==='bump'?.12:.22});}
    if(event.type==='fall'||event.type==='recover')this.responses.delete(event.racerId);
  }
  reaction(id,time){
    const response=this.responses.get(id);if(!response)return null;
    const age=Math.max(0,time-response.time);if(age>=response.duration){this.responses.delete(id);return null;}
    return {kind:response.kind,weight:this.reduce?0:1-age/response.duration};
  }
  bayBankPoint(bay,time,out){
    const at=bay.s+(bay.length||0)/2,side=featureX(bay,time)<0?-1:1;
    return out.set(this.worldX(at)+side*(trackWidth(at,this.stage)*this.xSpread/2+.58),1.12,-at);
  }
  updateAnchor(race){
    const p=race.player,bay=p.anchored&&this.stage.features.find(feature=>feature.id===p.anchorBayId&&feature.kind==='bay');
    this.anchorRope.visible=this.anchorMarker.visible=this.anchorClasp.visible=Boolean(bay);
    if(!bay){this.anchorVisualId=null;return;}
    if(this.anchorVisualId!==bay.id){this.anchorVisualId=bay.id;this.anchorVisualAt=race.activeTime;}
    const progress=this.reduce?1:clamp((race.activeTime-this.anchorVisualAt)/.16,0,1);
    this.bayBankPoint(bay,race.activeTime,this.anchorTo);
    const side=Math.sign(this.anchorTo.x-this.worldX(p.s,p.x))||1;
    this.anchorFrom.set(this.worldX(p.s,p.x)+side*.6,(p.y||0)+.33,-p.s+.65);
    this.anchorDirection.copy(this.anchorTo).sub(this.anchorFrom);const distance=this.anchorDirection.length();
    this.anchorRope.position.copy(this.anchorFrom).addScaledVector(this.anchorDirection,progress/2);
    this.camera.updateMatrixWorld(true);this.motionPoint.copy(this.anchorFrom).applyMatrix4(this.camera.matrixWorldInverse);
    const width=clamp(2.4*2*Math.max(.5,-this.motionPoint.z)*Math.tan(this.camera.fov*Math.PI/360)/this.height,.1,.32);
    this.anchorRope.scale.set(width,Math.max(.001,distance*progress),width);
    if(distance>.001)this.anchorRope.quaternion.setFromUnitVectors(this.motionUp,this.anchorDirection.normalize());
    this.anchorMarker.position.copy(this.anchorTo);this.anchorMarker.scale.setScalar(.22+.1*progress);this.anchorClasp.position.copy(this.anchorFrom);this.anchorClasp.scale.setScalar(.8+.2*progress);
  }
  addPhaseMarker(root,phase,{x=0,z=0,landing=false}={}){
    const marker=new THREE.Group();marker.position.set(x,landing?1.15:2.2,z);
    marker.add(phasePlaque(true,this.phaseMat),phasePlaque(false,this.phaseMat));
    if(landing){const glyph=[part([.48,.55,.1],[-.82,0,0],0x233b44)];
      if(phase==='early')glyph.push(part([.3,.07,.06],[-.82,.1,.09],C.cream),part([.3,.07,.06],[-.82,-.1,.09],C.cream));
      else glyph.push(part([.08,.33,.06],[-.82,0,.09],C.cream),part([.33,.08,.06],[-.82,0,.09],C.cream));
      marker.add(sculpture(glyph,this.phaseMat));
    }
    root.add(marker);root.userData.phaseVisual=marker;root.userData.phaseRequired=phase;marker.userData.pulseScale=1;
  }
  updatePhaseMarker(node,time){
    const marker=node.userData.phaseVisual;if(!marker)return;
    const ready=tideLabel(time)===node.userData.phaseRequired;
    if(node.userData.phaseReady!==undefined&&node.userData.phaseReady!==ready)node.userData.phaseChangedAt=time;
    node.userData.phaseReady=ready;marker.children[0].visible=ready;marker.children[1].visible=!ready;
    const age=time-(node.userData.phaseChangedAt??-100),weight=age>=0&&age<.18?1-age/.18:0;
    marker.userData.pulseScale=this.reduce?1:1+.12*Math.sin(weight*Math.PI);
    marker.visible=!(node.userData.feature.kind==='landing'&&this.lastRace?.player.landedRampIds?.includes(node.userData.feature.rampId));
  }
  fitPhaseMarker(node){
    const marker=node.userData.phaseVisual;if(!marker||!node.visible||!marker.visible)return;
    const parentScale=node.userData.lateralScale?this.xSpread:1,x=node.position.x+marker.position.x*parentScale,y=node.position.y+marker.position.y,z=node.position.z+marker.position.z;
    this.motionPoint.set(x,y+.41,z).project(this.camera);const top=this.motionPoint.y;
    this.motionPoint.set(x,y-.41,z).project(this.camera);const pixels=Math.abs(top-this.motionPoint.y)*this.height/2;
    const size=clamp(14/Math.max(1,pixels),1,2.2)*marker.userData.pulseScale;
    marker.scale.set(size/parentScale,size,size);
  }
  updateGateIndicator(node,time){
    const indicator=node.userData.phaseIndicator;if(!indicator)return;
    const open=gateIsOpen(node.userData.feature,time);
    if(node.userData.lastOpen!==undefined&&node.userData.lastOpen!==open)node.userData.phaseAt=time;
    node.userData.lastOpen=open;indicator.children[0].visible=open;indicator.children[1].visible=!open;
    const age=time-(node.userData.phaseAt??-100),weight=age>=0&&age<.22?1-age/.22:0;
    indicator.scale.setScalar(this.reduce?1:1+.14*Math.sin(weight*Math.PI));indicator.children[2].visible=this.reduce&&weight>0;
  }
  updateBridgeFeedback(node,time){
    const f=node.userData.feature,low=f.tidal&&tideLabel(time)==='early';
    node.userData.bridgeDeck.position.y=2.5+(low?f.lowClearance:f.clearance);
    const indicator=node.userData.heightIndicator;if(!indicator)return;
    if(node.userData.bridgeLow!==undefined&&node.userData.bridgeLow!==low)node.userData.bridgeChangedAt=time;
    node.userData.bridgeLow=low;indicator.children[0].visible=!low;indicator.children[1].visible=low;
    const age=time-(node.userData.bridgeChangedAt??-100),changing=age>=0&&age<.22;
    const scale=this.reduce?1:1+(changing?.14*Math.sin(age/.22*Math.PI):0);
    indicator.scale.set(scale/this.xSpread,scale,scale);indicator.children[2].visible=this.reduce&&changing;
  }
  updateCurrentFeedback(node,time){
    const f=node.userData.feature;let direction=f.direction||0;
    if(f.tidal&&tideLabel(time+(f.phase||0))==='late')direction*=-1;
    if(f.tidal&&node.userData.flowDirection!==undefined&&node.userData.flowDirection!==direction)node.userData.flowChangedAt=time;
    node.userData.flowDirection=direction;
    const age=time-(node.userData.flowChangedAt??-100),changing=f.tidal&&age>=0&&age<.18;
    const scale=this.reduce?1:1+(changing?.13*Math.sin(age/.18*Math.PI):0);
    for(const arrow of node.userData.directionRoot.children){
      arrow.rotation.y=direction>0?-Math.PI/2:direction<0?Math.PI/2:0;arrow.scale.setScalar(scale);
      if(arrow.userData.tideEmphasis)arrow.userData.tideEmphasis.visible=this.reduce&&changing;
    }
  }
  resize(){if(this.disposed)return;const r=this.container.getBoundingClientRect();if(!r.width||!r.height)return;this.width=r.width;this.height=r.height;this.aspect=r.width/r.height;this.xSpread=clamp(this.aspect/.62,1,3.15);this.renderer.setSize(r.width,r.height,false);this.camera.aspect=this.aspect;this.camera.updateProjectionMatrix();if(this.lastRace&&this.stage)this.render(this.lastRace,0);}
  worldX(s,x=0){return (trackCenter(s,this.stage)+x*trackWidth(s,this.stage)/2)*this.xSpread;}
  featureWidth(s,width=1){return trackWidth(s,this.stage)*width/2;}
  featureOffset(feature,distance){return trackCenter(feature.s+distance,this.stage)-trackCenter(feature.s,this.stage)+(feature.x||0)*(trackWidth(feature.s+distance,this.stage)-trackWidth(feature.s,this.stage))/2;}
  updateSurfaces(s){
    const first=Math.floor(s)-13.5,position=this.water.geometry.attributes.position,color=this.water.geometry.attributes.color;
    for(let row=0;row<WATER_ROWS;row++){
      const at=first+row,x=this.worldX(at),half=trackWidth(at,this.stage)*this.xSpread/2;
      const light=1+.025*Math.sin(at*.19)+.012*Math.sin(at*.53);
      for(let column=0;column<WATER_COLUMNS;column++){
        const index=row*WATER_COLUMNS+column,u=column/(WATER_COLUMNS-1)*2-1,c=this.waterColors[column];
        position.setXYZ(index,x+u*half,0,-at);color.setXYZ(index,c.r*light,c.g*light,c.b*light);
      }
    }
    position.needsUpdate=true;color.needsUpdate=true;
    for(let i=0;i<LIMESTONE_SLOTS;i++){
      // Keep the retiring ridge (and its tree) behind the short-landscape view.
      const row=Math.floor(s/6)-3+Math.floor(i/8),side=i%8<4?-1:1,layer=i%4,seed=row*37+side*17+layer*53;
      const poolIndex=scenerySlot(row,LIMESTONE_SLOTS/8,i%8,8),slot=this.ridgeSlots[poolIndex],at=row*6+(hash(seed+1)-.5)*3.8,distance=15.8+layer*6.4+(hash(seed+2)-.5)*2.6;
      slot.active=Math.sin(row*.84+side*1.6+layer*.71)+.6*Math.sin(row*1.39+layer*.45)>-.85&&hash(seed+7)>.12;
      slot.at=at;slot.x=this.worldX(at)+side*(trackWidth(at,this.stage)*this.xSpread/2+distance);slot.side=side;slot.seed=seed;slot.kind=poolIndex%3;
      slot.sx=3.2+hash(seed+3)*2.6;slot.sy=1.35+hash(seed+4)*2.15;slot.sz=3.5+hash(seed+5)*2;slot.rotation=(hash(seed+6)-.5)*.56;
      const mesh=this.ridges[slot.kind],index=Math.floor(poolIndex/3);
      this.matrix(mesh,index,[slot.x,-.55,-at],slot.active?[slot.sx,slot.sy,slot.sz]:[0,0,0],slot.rotation);
      this.tint.setHex(this.stage.chapter===2?0xadc0cd:0xf3ecd9).multiplyScalar(.9+hash(seed+9)*.12);mesh.setColorAt(index,this.tint);
    }
    for(const mesh of this.ridges){mesh.instanceMatrix.needsUpdate=true;mesh.instanceColor.needsUpdate=true;}
  }
  matrix(mesh,index,at,scale,rotY=0){const d=this.dummy;d.position.set(...at);d.scale.set(...scale);d.rotation.set(0,rotY,0);d.updateMatrix();mesh.setMatrixAt(index,d.matrix);}
  setAppearance(boardId='brook',cosmetic=false){
    if(this.disposed)return this.appearance;
    const id=getBoard(boardId).id,night=cosmetic===true||cosmetic==='coral-night'||cosmetic?.id==='coral-night'||cosmetic?.coralNight===true;
    for(const variant of this.boardVariants.values())variant.visible=false;
    const board=this.boardVariants.get(`${id}:${night}`);board.visible=true;this.models[0].board=board;
    this.appearance={boardId:id,cosmetic:night};
    if(this.wakes){for(let index=0;index<32;index++)this.wakes.setColorAt(index,this.tint.setHex(index<8&&night?0xff9b82:C.foam));this.wakes.instanceColor.needsUpdate=true;}
    if(this.particles)this.particles.material.color.setHex(night?0xffa29b:0xaaffee);
    return this.appearance;
  }
  setStage(stage){
    this.responses.clear();this.anchorVisualId=null;this.anchorRope.visible=this.anchorMarker.visible=this.anchorClasp.visible=false;
    this.stage=stage;this.featureRoot.traverse(o=>{if(o.isMesh)o.geometry?.dispose();});this.featureRoot.clear();this.featureNodes=[];this.particleData=[];
    const dusk=stage.chapter===2;this.scene.fog.color.setHex(dusk?0x8b94b6:0x9bcab9);this.renderer.setClearColor(dusk?0x8b94b6:0x9bcab9);
    this.waterDeep.setHex(dusk?0x1b7897:0x138e9c);this.waterEdge.setHex(dusk?0x63acb7:0x58bcb0);
    this.waterColors.forEach((color,column)=>color.lerpColors(this.waterDeep,this.waterEdge,Math.abs(column/(WATER_COLUMNS-1)*2-1)**2.2));
    this.bankMat.color.setHex(dusk?0x91a09b:0xb5874a);this.rockMat.color.setHex(dusk?0x60758a:0x7b8970);this.skyLight.color.setHex(dusk?0xb9d5ff:0xd9f5ff);this.sun.color.setHex(dusk?0xffce9c:0xffe2a0);
    this.ground.material.color.setHex(dusk?0x405b68:0x41664c);
    for(const f of stage.features||[]){const root=new THREE.Group();root.userData.feature=f;const k=f.kind;
      const parts=[];root.userData.lateralScale=['obstacle','rock','log','pillar','wheel','ramp','gate','bridge','current','flow','fork','gap','landing'].includes(k);
      if(['obstacle','rock','log','pillar','wheel'].includes(k)){
        const isWood=f.material==='wood'||['log','wheel'].includes(k),w=this.featureWidth(f.s,f.width||.43),h=f.height||.75,length=f.length||1.8;
        if(k==='wheel'){
          const rotor=new THREE.Group();rotor.position.set(0,h*.55,-length/2);
          const spokeParts=[part([.32,.32,.38],[0,0,0],0x724728)];
          for(let j=0;j<6;j++)spokeParts.push(part([w,.12,.3],[0,0,0],j%2?0xb68246:0xe0b378,[0,0,j*Math.PI/3]));
          rotor.add(sculpture(spokeParts,this.material));root.add(rotor);root.userData.rotor=rotor;
          parts.push(part([.18,h*.8,.2],[0,h*.4,.22-length/2],0x6d462d));
        }else if(isWood){
          parts.push(part([w,h*.75,length],[0,h*.38,-length*.15],0x9c632f),part([w*.92,h*.25,length*.92],[0,h*.86,-length*.15],0xcf9b5c),
            part([w*.92,.035,length*.7],[0,h*1.005,-length*.15],0xe6bb7c),part([w*.12,.035,length*.68],[-w*.28,h*1.035,-length*.15],0x85532e),
            part([w*.1,.035,length*.6],[w*.19,h*1.035,-length*.12],0xab7139),part([w*.65,h*.43,.035],[0,h*.4,length*.36],0xe2b47b),
            part([w*.39,h*.23,.04],[0,h*.4,length*.38],0xa66c37));
          for(const p of parts)p.at[2]-=length*.35;
        }else{
          parts.push(part([w,h*.63,length*.8],[0,h*.32,-length/2],0x667b70),part([w*.78,h*.3,length*.64],[w*.08,h*.76,.04-length/2],0x91a08b),part([w*.4,h*.17,length*.4],[-w*.15,h*.99,-length/2],0x435d57));
        }
      }else if(k==='ramp'){
        const w=this.featureWidth(f.s,f.width||1.12),length=f.length||4;
        parts.push(part([w,.18,length],[0,.07,1-length/2],0xbf8b46,[.08,0,0]),part([w*.16,.035,length*.9],[0,.2,1-length/2],C.cream,[.08,0,0]),
          part([.09,.16,length],[w/2,.2,1-length/2],0xe6ba67,[.08,0,0]),part([.09,.16,length],[-w/2,.2,1-length/2],0xe6ba67,[.08,0,0]));
      }else if(['flag','buoy','bonus'].includes(k)){
        const color=f.role==='bonus'||k==='bonus'?0xf6c965:0xff8969;
        parts.push(part([.11,1.55,.11],[0,.7,0],0x805d38),part([.82,.78,.11],[.22,1.4,.03],0x493f35),
          part([.73,.69,.055],[.22,1.4,.105],color),part([.48,.18,.48],[0,.06,0],C.gold),...buoyGlyph(f.shape||'square'));
        root.userData.collected=false;root.userData.collectProgress=0;
        if(f.tidePhase)this.addPhaseMarker(root,f.tidePhase);
        const lane=sculpture([part([this.featureWidth(f.s,f.width||.82),.035,.24],[0,.025,0],color)],this.currentMat);lane.userData.lateralScale=true;root.add(lane);
      }else if(k==='gate'){
        const w=this.featureWidth(f.s,f.width||1.1),height=f.height||1.2,bandHeight=Math.min(.07,height*.15);
        // Side posts identify the sluice without an overhead beam intersecting
        // the standing character or the legal jump arc. The cross-water piece
        // alone carries the same board-clearance height as the simulation.
        for(const side of [-1,1])parts.push(part([.16,2.35,.24],[side*(w/2+.13),1.175,0],C.wood),part([.4,.14,.42],[side*(w/2+.13),2.42,0],C.gold));
        const barrier=sculpture([part([w,height,.26],[0,height/2,0],0xd59045),part([w,bandHeight,.3],[0,height-bandHeight/2,0],C.cream)],this.material);root.add(barrier);root.userData.barrier=barrier;root.userData.barrierHeight=height;
        const phase=new THREE.Group();phase.position.set(-w/2-.13,2.65,0);
        phase.add(sculpture([part([.58,.13,.14],[0,0,0],0xaaffd4)],this.targetMat),sculpture([part([.14,.46,.14],[0,0,0],0xffb18b)],this.targetMat),sculpture([part([.74,.07,.18],[0,-.31,0],C.cream)],this.targetMat));
        root.add(phase);root.userData.phaseIndicator=phase;
      }else if(['anchor','mooring','bay'].includes(k)){
        parts.push(part([.8,.2,1.1],[0,.02,0],C.wood),part([.2,.12,.2],[0,.18,0],0xe68166));
        if(k==='bay'){
          const post=sculpture([part([.7,.2,.8],[0,.04,0],0x6a4a2c),part([.25,.95,.27],[0,.57,0],0xb07849),part([.46,.16,.46],[0,1.12,0],C.gold),part([.14,.2,.14],[0,1.12,.2],0xffe8b3)],this.material);
          post.castShadow=true;post.receiveShadow=true;root.add(post);root.userData.bankPost=post;
        }
      }else if(k==='bridge'){
        const height=2.5+(f.clearance||.9),length=f.length||10,deckParts=[];
        for(const d of [0,length]){const w=this.featureWidth(f.s+d,f.width||2),x=this.featureOffset(f,d);for(const side of [-1,1])parts.push(part([.25,height,.3],[x+side*w/2,height/2,-d],C.gold));}
        for(let i=0;i<5;i++){const d=i*length/4,w=this.featureWidth(f.s+d,f.width||2),x=this.featureOffset(f,d);deckParts.push(part([w+.35,.24,.3],[x,0,-d],C.wood));}
        for(const side of [-1,1])deckParts.push(part([.16,.2,length],[side*this.featureWidth(f.s+length/2,f.width||2)/2,.06,-length/2],0xe6c27d));
        const deck=new THREE.Group();deck.add(sculpture(deckParts,this.material));deck.position.y=height;root.add(deck);root.userData.bridgeDeck=deck;
        if(f.tidal){
          // Neutral height-only arrows never imply that a jump route is safe.
          const indicator=new THREE.Group();indicator.position.set(-this.featureWidth(f.s,f.width||2)/2-.35,height+1,0);
          const arrowParts=[part([.76,.76,.1],[0,0,0],0x274552),part([.11,.43,.08],[0,-.03,.1],0xf7e8bd),part([.1,.31,.08],[-.085,.17,.1],0xf7e8bd,[0,0,-.7]),part([.1,.31,.08],[.085,.17,.1],0xf7e8bd,[0,0,.7])];
          const up=sculpture(arrowParts,this.phaseMat),down=sculpture(arrowParts,this.phaseMat);down.rotation.z=Math.PI;
          const emphasis=sculpture([part([.94,.06,.13],[0,.46,0],0xfff3cf),part([.94,.06,.13],[0,-.46,0],0xfff3cf),part([.06,.86,.13],[-.44,0,0],0xfff3cf),part([.06,.86,.13],[.44,0,0],0xfff3cf)],this.phaseMat);emphasis.visible=false;
          indicator.add(up,down,emphasis);root.add(indicator);root.userData.heightIndicator=indicator;
        }
      }else if(['current','flow'].includes(k)){
        const length=f.length||8,segments=Math.max(1,Math.ceil(length/6)),flowParts=[];
        for(let i=0;i<segments;i++){const d=(i+.5)*length/segments;flowParts.push(part([this.featureWidth(f.s+d,f.width||.55),.02,length/segments+.06],[this.featureOffset(f,d),.025,-d],f.speed<12?0xc9ac73:0x60dfcf));}
        root.add(sculpture(flowParts,this.currentMat));
        const directionRoot=new THREE.Group();root.add(directionRoot);root.userData.directionRoot=directionRoot;
        const count=Math.min(6,Math.max(2,Math.round(length/10)));
        for(let i=0;i<count;i++){
          const arrow=new THREE.Group(),d=(i+.5)*length/count;arrow.position.set(this.featureOffset(f,d),0,-d);
          arrow.add(sculpture([part([.13,.06,.83],[0,.08,.11],C.cream),part([.13,.06,.57],[-.16,.08,-.22],C.cream,[0,-.67,0]),part([.13,.06,.57],[.16,.08,-.22],C.cream,[0,.67,0])],this.material));
          if(f.tidal){
            const emphasis=sculpture([part([.06,.025,1.14],[-.4,.04,0],0xfff0c9),part([.06,.025,1.14],[.4,.04,0],0xfff0c9),part([.74,.025,.06],[0,.04,-.55],0xfff0c9),part([.74,.025,.06],[0,.04,.55],0xfff0c9)],this.phaseMat);
            emphasis.visible=false;arrow.add(emphasis);arrow.userData.tideEmphasis=emphasis;
          }
          directionRoot.add(arrow);
        }
      }else if(k==='fork'){
        const length=f.length||50,segments=Math.ceil(length/5);
        for(let i=0;i<segments;i++){const d=(i+.5)*length/segments,w=this.featureWidth(f.s+d,f.width||.2),x=this.featureOffset(f,d);parts.push(part([w,.45,length/segments+.05],[x,.12,-d],0x997342),part([w*.75,.14,length/segments],[x,.42,-d],0xc4a363));}
      }else if(k==='gap'){
        const length=f.length||2,segments=Math.max(2,Math.ceil(length/.5));
        for(let i=0;i<segments;i++){const d=(i+.5)*length/segments,w=this.featureWidth(f.s+d,f.width||1);parts.push(part([w,.045,length/segments+.02],[this.featureOffset(f,d),.035,-d],0x123f55));}
        for(const d of [0,length])parts.push(part([this.featureWidth(f.s+d,f.width||1),.065,.14],[this.featureOffset(f,d),.08,-d],0xf1c36b));
      }
      if(parts.length)root.add(sculpture(parts,this.material));
      root.traverse(node=>{if(node.isMesh&&node.material===this.material){node.castShadow=true;node.receiveShadow=true;}});
      this.featureRoot.add(root);this.featureNodes.push(root);
      if(k==='ramp')for(const [index,target] of (f.targets||[f.target]).entries()){
        const landing=new THREE.Group(),length=target.sEnd-target.sStart,segments=Math.max(1,Math.ceil(length/3));
        landing.userData.lateralScale=true;
        landing.userData.feature={kind:'landing',id:`${f.id}:landing:${index}`,s:target.sStart,x:target.x,width:target.width,length,tidePhase:target.tidePhase,rampId:f.id};
        const frameParts=[],landingFeature=landing.userData.feature;
        for(let i=0;i<segments;i++){const d=(i+.5)*length/segments,w=this.featureWidth(target.sStart+d,target.width),x=this.featureOffset(landingFeature,d);for(const side of [-1,1])frameParts.push(part([.1,.07,length/segments+.08],[x+side*w/2,.06,-d],0xb2ffe0));}
        for(const d of [0,length]){const w=this.featureWidth(target.sStart+d,target.width),x=this.featureOffset(landingFeature,d);frameParts.push(part([w,.07,.12],[x,.06,-d],0xb2ffe0));for(const side of [-1,1])frameParts.push(part([.22,.32,.22],[x+side*w/2,.2,-d],0xffdf8c));}
        landing.add(sculpture(frameParts,this.targetMat));
        const centerX=this.featureOffset(landingFeature,length/2);
        if(!target.tidePhase){const reticle=sculpture([part([.68,.045,.12],[centerX,.08,-length/2],0xffe6aa),part([.12,.045,.68],[centerX,.08,-length/2],0xffe6aa)],this.targetMat);landing.add(reticle);}
        if(target.tidePhase)this.addPhaseMarker(landing,target.tidePhase,{x:centerX,z:-length/2,landing:true});
        this.featureRoot.add(landing);this.featureNodes.push(landing);
      }
    }
    const finish=new THREE.Group(),finishWidth=trackWidth(stage.length,stage);finish.add(sculpture([part([.35,3.2,.35],[-finishWidth/2-.1,1.4,0],C.wood),part([.35,3.2,.35],[finishWidth/2+.1,1.4,0],C.wood),part([finishWidth+.7,.4,.5],[0,3,0],C.gold),part([.8,.6,.12],[-finishWidth/2+.5,2.55,0],0xe7755e),part([.8,.6,.12],[finishWidth/2-.5,2.55,0],0xe7755e)],this.material));finish.children[0].castShadow=true;finish.children[0].receiveShadow=true;finish.userData.feature={kind:'finish',s:stage.length,x:0};finish.userData.lateralScale=true;this.featureRoot.add(finish);this.featureNodes.push(finish);
  }
  burst(s,x=0,strength=1){if(this.reduce)return;for(let i=0;i<Math.round(10*strength);i++){if(this.particleData.length>=64)this.particleData.shift();this.particleData.push({x:this.worldX(s,x),y:.3,z:-s,vx:(hash(i+s)-.5)*4,vy:2+hash(i*3+s)*3,vz:(hash(i*5+s)-.5)*4,life:.45+hash(i+s)*.3});}}
  render(race,dt=0){
    if(this.disposed||!race?.stage)return;
    this.lastRace=race;if(this.stage!==race.stage)this.setStage(race.stage);
    this.reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const p=race.player,s=p.s,clock=race.activeTime||0,decorativeClock=this.reduce?0:clock;
    this.ground.position.set(this.worldX(s+20),-.74,-s-40);
    const lightX=this.worldX(s+14);this.sun.target.position.set(lightX,0,-s-14);this.sun.position.set(lightX-18,30,-s+8);this.sun.target.updateMatrixWorld();
    this.updateSurfaces(s);
    for(let i=0;i<76;i++){
      const at=Math.floor(s)-13+i,w=trackWidth(at,this.stage)*this.xSpread,x=this.worldX(at);
      this.matrix(this.banks,i*2,[x-w/2-.18,.02,-at],[.35,.45,1.1]);this.matrix(this.banks,i*2+1,[x+w/2+.18,.02,-at],[.35,.45,1.1]);
      for(let sideIndex=0;sideIndex<2;sideIndex++){
        const side=sideIndex?1:-1,index=i*2+sideIndex,seed=Math.floor(at/4)+side*17,shoreWidth=1.7+hash(seed)*.8;
        this.matrix(this.shores,index,[x+side*(w/2+.35),-.25+hash(seed)*.06,-at],[shoreWidth,1,1.09],side<0?Math.PI:0);
        this.tint.setHex(this.stage.chapter===2?0x99bac4:0xf0efd9).multiplyScalar(.88+hash(seed+4)*.16);this.shores.setColorAt(index,this.tint);
      }
      const ribbonAt=at+(decorativeClock*.8)%1;
      this.matrix(this.ribbons,i,[this.worldX(ribbonAt)+(hash(i*3+2)-.5)*w*.7,.012,-ribbonAt],[.05+w*.009,.012,.3+hash(i+7)*1.1],(hash(i+11)-.5)*.12);
    }
    for(let i=0;i<64;i++){
      const row=Math.floor(s/4)-3+Math.floor(i/4),at=row*4+(hash(row+i%4)-.5)*1.4,side=i%2?1:-1,layer=Math.floor(i%4/2),seed=row*3+side*19+layer*31,w=trackWidth(at,this.stage)*this.xSpread;
      const rockX=this.worldX(at)+side*(w/2+1.6+layer*2.5+hash(seed)*1.4),rockHeight=.45+hash(seed+7)*.9;
      this.matrix(this.rocks,i,[rockX,-.4,-at+.5],[.85+hash(seed+2)*1.2,rockHeight,1.05+hash(seed+8)*1.25],(hash(seed+5)-.5)*.6);
      this.tint.setHex(this.stage.chapter===2?0x9bb8cb:0xf4e9cd).multiplyScalar(.88+hash(seed+12)*.15);this.rocks.setColorAt(i,this.tint);
    }
    for(let i=0;i<80;i++){
      const row=Math.floor(s/4)-4+Math.floor(i/4),side=i%2?1:-1,layer=Math.floor(i%4/2),seed=row*11+side*19+layer*47;
      const at=row*4+(hash(seed+3)-.5)*2,w=trackWidth(at,this.stage)*this.xSpread,distance=3.6+layer*4.7+hash(seed+11)*2.8,treeX=this.worldX(at)+side*(w/2+distance);
      const poolIndex=scenerySlot(row,20,i%4,4),size=.88+hash(seed+7)*.45,tree=this.trees[poolIndex%3],index=Math.floor(poolIndex/3);
      this.matrix(tree,index,[treeX,-.28,-at],[size,1.06+hash(seed+9)*.45,size],(hash(seed+5)-.5)*.5);
      this.tint.setHex(this.stage.chapter===2?0x99b9c7:0xf4f4d4).multiplyScalar(.88+hash(seed+14)*.18);tree.setColorAt(index,this.tint);
    }
    for(let i=0;i<32;i++){
      const slot=this.ridgeSlots[i*3],anchor=LIMESTONE_ANCHORS[slot.kind],active=slot.active&&hash(slot.seed+8)>.26;
      const cos=Math.cos(slot.rotation),sin=Math.sin(slot.rotation),lx=anchor[0]*slot.sx,lz=anchor[2]*slot.sz;
      const size=active?.7+hash(slot.seed+11)*.35:0;
      this.matrix(this.outerTrees,i,[slot.x+cos*lx+sin*lz,-.29+anchor[1]*slot.sy,-slot.at-sin*lx+cos*lz],[size,active?1.0+hash(slot.seed+12)*.25:0,size],slot.rotation);
      this.tint.setHex(this.stage.chapter===2?0x8facb9:0xe5ebc8).multiplyScalar(.91+hash(slot.seed+13)*.1);this.outerTrees.setColorAt(i,this.tint);
    }
    for(let i=0;i<72;i++){
      const row=Math.floor(s/3)-4+Math.floor(i/3),poolIndex=scenerySlot(row,24,i%3,3),side=poolIndex%2?1:-1,seed=row*13+i%3*17,at=row*3+hash(seed)*1.2,w=trackWidth(at,this.stage)*this.xSpread;
      this.matrix(this.reeds,poolIndex,[this.worldX(at)+side*(w/2+.58+hash(seed+2)*.9),.01,-at],[.7+hash(seed+3)*.4,.65+hash(seed+4)*.55,.7+hash(seed+5)*.4],side*.3);
    }
    for(let i=0;i<40;i++){
      const row=Math.floor(s/4)-3+Math.floor(i/2),side=i%2?1:-1,seed=row*17+side*23,at=row*4+hash(seed)*1.5,w=trackWidth(at,this.stage)*this.xSpread;
      this.matrix(this.flowers,i,[this.worldX(at)+side*(w/2+1.2+hash(seed+2)*1.7),.14,-at],[.8+hash(seed+3)*.35,.8+hash(seed+4)*.3,.8+hash(seed+5)*.35],hash(seed+6)*Math.PI);
    }
    for(let i=0;i<48;i++){
      const row=Math.floor(s/2)-5+i,at=row*2+hash(row+4),w=trackWidth(at,this.stage)*this.xSpread;
      this.matrix(this.glints,i,[this.worldX(at)+(hash(row+2)-.5)*w*.76,.023,-at],[.08+hash(row+7)*.12,.008,.12+hash(row+5)*.34],-.7);
    }
    for(let i=0;i<76;i++){const at=Math.floor(s/2)*2-8+Math.floor(i/2)*2+decorativeClock%1,side=i%2?1:-1,w=trackWidth(at,this.stage)*this.xSpread;this.matrix(this.foam,i,[this.worldX(at)+side*w*(.405+hash(i+7)*.035),.022,-at],[.1+w*.015,.022,.32+hash(i+3)*.75],side*.18);}
    for(let i=0;i<24;i++){
      const at=(Math.floor(s/10)-3+Math.floor(i/2))*10,side=i%2?1:-1,x=this.worldX(at)+side*(trackWidth(at,this.stage)*this.xSpread/2+.52);
      this.matrix(this.lanternPosts,i,[x,.56,-at],[.14,1.24,.14]);this.matrix(this.lanternCaps,i,[x,1.44,-at],[.38,.12,.38]);this.matrix(this.lanternLights,i,[x,1.24,-at],[.22,.28,.22]);
    }
    for(const mesh of [this.banks,this.shores,this.rocks,...this.trees,this.outerTrees,this.reeds,this.flowers,this.glints,this.foam,this.ribbons,this.lanternPosts,this.lanternCaps,this.lanternLights]){mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;}
    for(const node of this.featureNodes){const f=node.userData.feature,delta=f.s-s;node.visible=f.s+(f.length||0)>=s-12&&delta<=42;node.position.set(this.worldX(f.s,featureX(f,clock)||0),0,-f.s);node.scale.set(node.userData.lateralScale?this.xSpread:1,1,1);for(const child of node.children)if(child.userData.lateralScale)child.scale.x=this.xSpread;
      if(f.kind==='buoy'||f.kind==='flag'||f.kind==='bonus'){
        const taken=(f.role==='bonus'||f.kind==='bonus'?p.bonusFlags:p.flags)?.includes(f.id)||false;
        if(taken&&!node.userData.collected){node.userData.collected=true;node.userData.collectProgress=0;}
        if(!taken&&node.userData.collected){node.userData.collected=false;node.userData.collectProgress=0;}
        if(node.userData.collected){
          node.userData.collectProgress=Math.min(1,node.userData.collectProgress+Math.max(0,dt)/(this.reduce ? .1 : .36));
          const progress=node.userData.collectProgress;
          if(progress>=1)node.visible=false;
          else if(!this.reduce){const eased=1-(1-progress)**3;node.position.y=eased*.9;const scale=1-eased*.88;node.scale.setScalar(scale);}
        }
      }
      if(!node.visible)continue;
      if(node.userData.bankPost){this.bayBankPoint(f,clock,this.bankPoint);const post=node.userData.bankPost;post.position.set(this.bankPoint.x-node.position.x,0,this.bankPoint.z-node.position.z);post.visible=-this.bankPoint.z-s>=-12&&-this.bankPoint.z-s<=42;}
      this.updatePhaseMarker(node,clock);this.updateGateIndicator(node,clock);
      if(node.userData.barrier){node.userData.barrier.position.y=gateIsOpen(f,clock)?-node.userData.barrierHeight-.12:0;}
      if(node.userData.bridgeDeck)this.updateBridgeFeedback(node,clock);
      if(node.userData.rotor)node.userData.rotor.rotation.z=clock*Math.PI*2/(f.period||4.2);
      if(node.userData.directionRoot)this.updateCurrentFeedback(node,clock);
      if(node.userData.inactiveMark)node.userData.inactiveMark.visible=tideLabel(clock)!==f.tidePhase;
    }
    const racers=[p,...(race.rivals||[])];
    this.models.forEach((model,i)=>{const r=racers[i];model.group.visible=Boolean(r)&&r.s-s>-12&&r.s-s<42;if(!r)return;model.group.position.set(this.worldX(r.s,r.x),r.y||0,-r.s);model.group.rotation.y=clamp(-(r.vx||0)*.1,-.35,.35);const response=this.reaction(r.id,clock),weight=response?.weight||0,land=response?.kind==='land',hit=response?.kind==='hit';model.body.position.y=land?-.09*weight:0;model.body.scale.y=land?1-.08*weight:1;model.body.rotation.x=land?.07*weight:hit?-.1*weight:0;model.body.rotation.z=clamp(-(r.vx||0)*.1,-.22,.22)+(hit?.16:response?.kind==='bump'?.05:0)*weight*(Math.sign(r.vx)||1);model.board.rotation.x=(r.y||0)>.05?clamp((r.vy||0)*-.035,-.2,.2):0;model.arms.forEach((arm,j)=>arm.rotation.z=(j===0?-1:1)*(.4+((r.y||0)>.05?.5:0)));});
    for(let i=0;i<4;i++){
      const r=racers[i],visible=Boolean(r)&&r.s-s>-12&&r.s-s<42;
      this.matrix(this.contactShadows,i,visible?[this.worldX(r.s,r.x),.013,-r.s]:[0,-1000,0],visible?[1.05+(r.y||0)*.16,.012,1.9+(r.y||0)*.2]:[0,0,0]);
      for(let j=0;j<8;j++){
        const index=i*8+j,side=j%2?1:-1,distance=.7+Math.floor(j/2)*.62,waking=visible&&r.grounded&&(r.speed||0)>1&&!r.anchored;
        this.matrix(this.wakes,index,waking?[this.worldX(r.s,r.x)+side*(.35+distance*.18),.034,-r.s+distance]:[0,-1000,0],waking?[.09,.025,.53+distance*.08]:[0,0,0],side*.46);
      }
    }
    this.wakes.instanceMatrix.needsUpdate=true;this.contactShadows.instanceMatrix.needsUpdate=true;
    this.particleData=this.particleData.filter(v=>{v.life-=dt;if(v.life<=0)return false;v.x+=v.vx*dt;v.y+=v.vy*dt;v.z+=v.vz*dt;v.vy-=8*dt;return true;});
    for(let i=0;i<64;i++){const v=this.particleData[i];this.matrix(this.particles,i,v?[v.x,v.y,v.z]:[0,-1000,0],v?[.08,.08,.08]:[0,0,0]);}this.particles.instanceMatrix.needsUpdate=true;
    const cx=this.worldX(s+8),cameraHeight=this.aspect>1.4?20:23;
    this.camera.position.set(cx+3*this.xSpread,cameraHeight,-s+16);this.camera.lookAt(cx,.3,-s-13);
    this.camera.updateMatrixWorld(true);for(const node of this.featureNodes)this.fitPhaseMarker(node);
    this.updateAnchor(race);
    this.renderer.render(this.scene,this.camera);
  }
  measure(){return {revision:THREE.REVISION,calls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,geometries:this.renderer.info.memory.geometries,textures:this.renderer.info.memory.textures,pixelRatio:this.renderer.getPixelRatio(),activeBoard:this.appearance.boardId,cosmetic:this.appearance.cosmetic,shadowMapSize:this.sun.shadow.mapSize.x};}
  dispose(){if(this.disposed)return;this.disposed=true;this.resizeObserver.disconnect();this.canvas.removeEventListener('webglcontextlost',this.onLost);const geometries=new Set(),materials=new Set([this.material,this.waterMat,this.ridgeMat,this.woodMat,this.rockMat,this.leafMat,this.foamMat,this.currentMat,this.targetMat,this.ropeMat,this.phaseMat]);this.scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m));});for(const g of geometries)g.dispose();for(const m of materials)m.dispose();this.sun.shadow.dispose();this.renderer.dispose();this.canvas.remove();this.responses.clear();this.anchorVisualId=null;this.particleData.length=0;this.boardVariants.clear();this.featureNodes.length=0;this.lastRace=null;}
}
