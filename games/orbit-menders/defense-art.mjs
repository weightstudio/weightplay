import * as THREE from './vendor/three.module.min.js';

// Original, code-native art for the owner's flat lion defence replacement.
// Owner amendment 2026-10-27: a coherent WeightPlay Block Animals cast/world.
// Reference: assets/weightplay-character-boom-mane-lion-block-v1.webp.
// +Y up, +Z faces the castle. Every object has a ground-level origin.
// Static subassemblies are baked into vertex-coloured geometry; repeated
// enemies share bounded templates. No external texture or private effect engine.
// The same small bevel is used across anatomy, foliage, masonry and props.
// Broad planar faces and stepped silhouettes remain visible at play distance.
const blockGeometry = (() => {
  const shape=new THREE.Shape();shape.moveTo(-.465,-.465);shape.lineTo(.465,-.465);shape.lineTo(.465,.465);shape.lineTo(-.465,.465);shape.closePath();
  const geometry=new THREE.ExtrudeGeometry(shape,{depth:.93,bevelEnabled:true,bevelSize:.035,bevelThickness:.035,bevelSegments:1,steps:1});geometry.translate(0,0,-.465);return geometry;
})();
const cylinderGeometry = new THREE.BoxGeometry(2,1,2);
const coneGeometry = new THREE.ConeGeometry(1,1,4);
const ringGeometry = (()=>{const s=new THREE.Shape();s.moveTo(-1.075,-1.075);s.lineTo(1.075,-1.075);s.lineTo(1.075,1.075);s.lineTo(-1.075,1.075);s.closePath();const hole=new THREE.Path();hole.moveTo(-.925,-.925);hole.lineTo(-.925,.925);hole.lineTo(.925,.925);hole.lineTo(.925,-.925);hole.closePath();s.holes.push(hole);const g=new THREE.ExtrudeGeometry(s,{depth:.1,bevelEnabled:true,bevelSize:.025,bevelThickness:.025,bevelSegments:1,steps:1});g.translate(0,0,-.05);return g;})();
const crystalGeometry = new THREE.OctahedronGeometry(1,0);
const shadowGeometry=new THREE.CircleGeometry(1,24);
const lawnPatchGeometry=new THREE.PlaneGeometry(2,2);
const archGeometry=(()=>{const shape=new THREE.Shape();shape.moveTo(-.38,-.5);shape.lineTo(.38,-.5);shape.lineTo(.38,.34);shape.lineTo(.22,.34);shape.lineTo(.22,.5);shape.lineTo(-.22,.5);shape.lineTo(-.22,.34);shape.lineTo(-.38,.34);shape.closePath();return new THREE.ExtrudeGeometry(shape,{depth:.07,bevelEnabled:true,bevelSize:.02,bevelThickness:.02,bevelSegments:1,steps:1});})();
const shadowMaterial=new THREE.MeshBasicMaterial({color:0x24495a,transparent:true,opacity:.14,depthWrite:false});
const heroShadowMaterial=new THREE.MeshBasicMaterial({color:0x324154,transparent:true,opacity:.23,depthWrite:false});
const polishedGold=new THREE.MeshStandardMaterial({color:0xf5bc4e,metalness:.68,roughness:.28});
const polishedBlue=new THREE.MeshStandardMaterial({color:0x286b8c,metalness:.42,roughness:.31});
const softGeometry = blockGeometry;
const materials=new Map();
function material(color,glow=false){const key=`${color}:${glow}`;if(!materials.has(key))materials.set(key,new THREE.MeshStandardMaterial({color,roughness:.68,metalness:glow?.12:0,emissive:glow?color:0,emissiveIntensity:glow?.65:0}));return materials.get(key);}
const surfaceProfiles={
  paint:{roughness:.55,metalness:.035},stone:{roughness:.86,metalness:.015},
  turf:{roughness:.98,metalness:0},foliage:{roughness:.77,metalness:.01},
  cloth:{roughness:.93,metalness:0},skin:{roughness:.67,metalness:.015},
  metal:{roughness:.3,metalness:.48},wood:{roughness:.87,metalness:0}
};
const bakedMaterials=new Map();
function bakedMaterialFor(family){if(!bakedMaterials.has(family)){const m=new THREE.MeshStandardMaterial({vertexColors:true,...(surfaceProfiles[family]||surfaceProfiles.paint)});m.userData.artSurface=family;bakedMaterials.set(family,m);}return bakedMaterials.get(family);}
function surface(node,family,caster=true,ground=false){node.userData.artSurface=family;node.userData.artShadowCaster=caster;node.userData.artGround=ground;return node;}
function inherited(node,key,fallback){for(let current=node;current;current=current.parent)if(current.userData[key]!==undefined)return current.userData[key];return fallback;}
function add(parent,geometry,color,x,y,z,sx=1,sy=sx,sz=sx,glow=false){const node=new THREE.Mesh(geometry,material(color,glow));node.position.set(x,y,z);node.scale.set(sx,sy,sz);node.receiveShadow=true;parent.add(node);return node;}
// Existing spherical decorations used radii. Keep their visible envelope while
// replacing them with designed cuboids; this helper is no longer a sphere.
const ball=(p,c,x,y,z,sx,sy=sx,sz=sx)=>add(p,blockGeometry,c,x,y,z,sx*2,sy*2,sz*2);
const soft=(p,c,x,y,z,sx,sy,sz)=>add(p,softGeometry,c,x,y,z,sx,sy,sz);
const cylinder=(p,c,x,y,z,sx,sy,sz=sx)=>add(p,cylinderGeometry,c,x,y,z,sx,sy,sz);
function group(parent,name,x=0,y=0,z=0){const g=new THREE.Group();g.name=name;g.position.set(x,y,z);parent?.add(g);return g;}

// Only use on a finished, static subtree. Animated pivots are baked separately.
// Emits one draw regardless of the original palette/shape count.
function bake(root,direct=false){
  root.updateMatrixWorld(true);const inverse=root.matrixWorld.clone().invert(),batches=new Map(),meshes=[];
  const candidates=[];if(direct)candidates.push(...root.children);else root.traverse(mesh=>candidates.push(mesh));
  for(const mesh of candidates){
    if(!mesh.isMesh||Array.isArray(mesh.material)||mesh.material.emissiveIntensity||mesh.material.transparent||mesh.userData.noBake)continue;
    const family=mesh.userData.artSurface||mesh.material.userData.artSurface||inherited(mesh.parent,'artSurface','paint');
    const caster=inherited(mesh,'artShadowCaster',true),ground=inherited(mesh,'artGround',false),key=`${family}:${caster}:${ground}`;
    if(!batches.has(key))batches.set(key,{family,caster,ground,positions:[],normals:[],colors:[],uvs:[]});
    const out=batches.get(key),baseTransform=inverse.clone().multiply(mesh.matrixWorld),geometry=mesh.geometry.index?mesh.geometry.toNonIndexed():mesh.geometry;
    const pos=geometry.getAttribute('position'),normal=geometry.getAttribute('normal'),uv=geometry.getAttribute('uv'),sourceColors=mesh.material.vertexColors?geometry.getAttribute('color'):null;
    const point=new THREE.Vector3(),direction=new THREE.Vector3(),color=new THREE.Color(),sourceColor=new THREE.Color(),instanceColor=new THREE.Color();
    geometry.computeBoundingBox();const bounds=geometry.boundingBox,height=Math.max(.001,bounds.max.y-bounds.min.y);
    for(let instance=0;instance<(mesh.isInstancedMesh?mesh.count:1);instance++){
      const transform=baseTransform.clone();instanceColor.set(0xffffff);
      if(mesh.isInstancedMesh){const matrix=new THREE.Matrix4();mesh.getMatrixAt(instance,matrix);transform.multiply(matrix);if(mesh.instanceColor)mesh.getColorAt(instance,instanceColor);}
      const normalMatrix=new THREE.Matrix3().getNormalMatrix(transform);
      for(let i=0;i<pos.count;i++){
        point.fromBufferAttribute(pos,i).applyMatrix4(transform);direction.fromBufferAttribute(normal,i).applyMatrix3(normalMatrix).normalize();
        out.positions.push(point.x,point.y,point.z);out.normals.push(direction.x,direction.y,direction.z);
        color.copy(mesh.material.color).multiply(instanceColor);if(sourceColors)color.multiply(sourceColor.fromBufferAttribute(sourceColors,i));
        // Existing vertex colours survive re-baking; contact shading is applied once.
        if(!mesh.userData.artBaked&&family!=='metal'&&family!=='turf')color.multiplyScalar(.87+.13*THREE.MathUtils.smoothstep(pos.getY(i),bounds.min.y,bounds.min.y+height));
        out.colors.push(color.r,color.g,color.b);out.uvs.push(uv?.getX(i)||0,uv?.getY(i)||0);
      }
    }
    meshes.push(mesh);if(geometry!==mesh.geometry)geometry.dispose();
  }
  for(const mesh of meshes)mesh.parent.remove(mesh);
  for(const out of batches.values()){
    const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(out.positions,3));geometry.setAttribute('normal',new THREE.Float32BufferAttribute(out.normals,3));geometry.setAttribute('color',new THREE.Float32BufferAttribute(out.colors,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(out.uvs,2));geometry.computeBoundingSphere();
    const merged=new THREE.Mesh(geometry,bakedMaterialFor(out.family));merged.name=`baked_${out.family}`;merged.receiveShadow=true;merged.castShadow=out.caster&&!out.ground;
    surface(merged,out.family,out.caster,out.ground);merged.userData.artBaked=true;root.add(merged);
  }
  return root;
}

function tree(parent,x,z,scale=1){const g=surface(group(parent,'stepped_block_canopy',x,0,z),'foliage');g.scale.setScalar(scale);cylinder(g,0xaf7961,0,.74,0,.16,1.5);ball(g,0x238f7d,0,1.6,0,.8,.55,.75);ball(g,0x43b388,-.36,1.94,.12,.62,.40,.58);ball(g,0x7ad292,.35,2.08,-.04,.56,.36,.56);ball(g,0xc3ed9f,.08,2.4,.07,.4,.22,.38);for(let i=0;i<3;i++)ball(g,0xffcc70,(i-1)*.25,1.9+(i%2)*.3,.56,.07);}
function shrub(parent,x,z,scale=1){const g=surface(group(parent,'side_shrub',x,0,z),'foliage');g.scale.setScalar(scale);for(let i=0;i<3;i++)ball(g,[0x2b9d8b,0x4cbda1,0x94d9a1][i],(i-1)*.29,.3+(i%2)*.15,0,.43,.4,.38);}
function pawSeal(parent,x,y,z,scale=.3){
  const seal=surface(group(parent,'guardian_paw_seal',x,y,z),'metal');seal.scale.setScalar(scale);
  const rim=add(seal,ringGeometry,0xe7b24b,0,0,0,1,1,.45);rim.rotation.z=Math.PI/8;
  ball(seal,0x266e81,0,0,-.025,.88,.88,.13);
  ball(seal,0xffd878,0,-.12,.12,.35,.29,.08);
  for(let i=0;i<3;i++)ball(seal,0xffe0a0,(i-1)*.31,.23+(i===1?.14:0),.14,.16,.19,.07);
  return seal;
}
function banner(parent,x,z,side=1){const g=surface(group(parent,'castle_banner',x,0,z),'cloth');cylinder(g,0xf4d690,0,1.9,0,.075,3.8);ball(g,0xffcc58,0,3.86,0,.16);soft(g,0xe66c6e,.42*side,3.07,0,.76,1.11,.07);soft(g,0xffe3a7,.42*side,3.1,.047,.08,.72,.028);ball(g,0xffe3a7,.42*side,3.3,.055,.12,.12,.04);}

export function createArena(){
  const root=new THREE.Group();root.name='original_sunrise_guardian_courtyard';surface(root,'turf',false,true);
  soft(root,0x437f79,0,-.64,.4,29.5,.8,27.5);soft(root,0x63b67e,0,-.17,.4,28.9,.26,27);
  // Low-contrast stone paths are ground-level decoration, never obstacles.
  soft(root,0x76bf82,0,-.015,-1.2,20.9,.05,21.2);
  // Authored, flush lawn colour islands bring surface scale without new hit
  // regions, moving decoration or high-contrast false hazards.
  for(let row=0;row<8;row++)for(let col=0;col<8;col++){
    const x=-9.4+col*2.65+Math.sin(row*3+col)*.3,z=-9.4+row*2.1;
    const patch=add(root,lawnPatchGeometry,(row+col)%3?0x71bd83:0x6bb980,x,.013,z,.53+(col%3)*.15,.3+(row%3)*.1,1);
    patch.rotation.set(-Math.PI/2,0,(row*.7+col)*.4);
  }
  // Five gentle converging routes communicate the incoming pressure at once.
  // They are paint/stone insets on the flat ground, never collision geometry.
  for(let lane=-2;lane<=2;lane++){
    const start=new THREE.Vector3(lane*4,0,-10.5),end=new THREE.Vector3(lane*.22,0,-2.2),delta=end.clone().sub(start),mid=start.clone().add(end).multiplyScalar(.5);
    const road=soft(root,lane%2?0x8ecb89:0x9bd18b,mid.x,.018,mid.z,1.58,.022,delta.length());road.rotation.y=Math.atan2(delta.x,delta.z);
    for(let dash=0;dash<5;dash++){const t=(dash+.5)/5,point=start.clone().lerp(end,t);const mark=soft(root,0x63b798,point.x,.042,point.z,.54,.025,.12);mark.rotation.y=road.rotation.y;}
  }
  const walk=surface(group(root,'warm_stone_walk'),'stone',false,true);
  soft(walk,0xb7bc7f,0,.025,1,2.45,.025,17);
  for(let row=0;row<9;row++)for(let col=0;col<2;col++){const tile=soft(walk,(row+col)%2?0xd4d4a1:0xe0dcb1,(col-.5)*1.03,.05,-8.8+row*1.95,.95,.03,1.76);tile.rotation.y=(row%2?.018:-.012);}
  // Edges define the full combat footprint without confusing extra entrances.
  for(const side of [-1,1]){
    soft(root,0x4d9f7c,side*12.65,.11,-.3,1.5,.3,23.6);soft(root,0xe0cf8f,side*13.5,.04,-.3,.19,.16,24);
    for(let i=0;i<6;i++){shrub(root,side*12.7,-9.4+i*3.8,.85+(i%2)*.16);for(let j=0;j<3;j++){cylinder(root,0x4b9a76,side*(11.8+j*.17),.16,-8.7+i*3.8,.024,.34);ball(root,[0xffd675,0xffa5b0,0xf4f2d8][j],side*(11.8+j*.17),.34,-8.7+i*3.8,.10,.075,.10);}}
    for(let i=0;i<3;i++){
      // Alternating planter families break the mirrored shrub repetition.
      const z=-7.5+i*7.2;const pot=surface(group(root,'coral_courtyard_planter',side*12.65,0,z),'stone');
      cylinder(pot,i%2?0xe0b86e:0xce8470,0,.18,0,.48,.34,.4);cylinder(pot,0xefcb91,0,.36,0,.53,.09,.44);ball(pot,0x398f77,0,.48,0,.43,.29,.35);
      for(let petal=0;petal<3;petal++){const a=petal*2.399;ball(pot,i%2?0xffd16e:0xf7a6ae,Math.sin(a)*.23,.67+(petal%2)*.07,Math.cos(a)*.2,.14,.12,.13);}
    }
    for(let i=0;i<5;i++){
      const stone=soft(root,i%2?0x7bae89:0xa4c7a3,side*(10.55-(i%2)*.4),.052,-7.5+i*3.1,.44,.075,.3);stone.rotation.y=side*(.35+i*.7);
      for(let blade=0;blade<2;blade++){const grass=soft(root,0x4ea67c,side*(10.1+blade*.11),.09,-6.8+i*3.1,.045,.12,.055);grass.rotation.z=side*.18;}
    }
    // Original repair-garden props stay outside the actual combat footprint.
    const cabinet=surface(group(root,'garden_guard_supply',side*12.65,0,8.9),'wood');
    soft(cabinet,0x609891,0,.33,0,.78,.66,.68);soft(cabinet,0xe4bf72,0,.69,0,.86,.12,.75);
    for(const band of [-1,1])soft(cabinet,0x287d83,band*.22,.34,.35,.055,.49,.04);
    soft(cabinet,0xf4d691,0,.43,.38,.21,.16,.035);
    tree(root,side*14.7,-10.8,side<0?1.56:1.7);tree(root,side*15.4,-3,side<0?1.83:1.63);tree(root,side*15.1,5.4,side<0?1.35:1.48);
    // Distant rolling hills keep the active courtyard clearly flat.
    ball(root,side<0?0x58b2a2:0x72c4ae,side*21,-1.4,-17,12,5,8);ball(root,0x8bd4b2,side*13,-1.5,-24,11,6,7);
  }
  // Incoming gateway is deliberately low and behind the spawn line.
  soft(root,0x397d83,0,.24,-13.1,21,.5,1.1);
  for(let lane=-2;lane<=2;lane++){
    const gate=surface(group(root,'incoming_gate',lane*4,0,-12.5),'stone');
    soft(gate,0x3e7b86,0,.87,-.38,2.5,1.6,.12);
    for(const side of [-1,1]){soft(gate,0xc5ddba,side*1.48,.85,0,.34,1.7,.52);soft(gate,0x42b9bb,side*1.48,.95,.29,.13,1.15,.07);}
    soft(gate,0xd9e5b8,0,1.79,0,3.35,.24,.69);soft(gate,0xf2c86c,0,1.99,.02,.44,.25,.57);
    soft(gate,0x387d84,0,1.54,.39,2.65,.08,.055);
    if(lane===0)pawSeal(gate,0,1.64,.43,.32);
    for(const side of [-1,1]){const chevron=soft(root,0x39b8af,lane*4+side*.17,.069,-10.45,.13,.035,.55);chevron.rotation.y=side*.7;}
  }
  for(const side of [-1,1]){soft(root,0xf0e8c5,side*10.7,.95,-12.4,1.5,1.95,1.6);ball(root,0xf7d18a,side*10.7,2,-12.4,.89,.31,.9);banner(root,side*10.7,-12.3,side);}
  for(let i=0;i<5;i++){const x=(i-2)*3.75;soft(root,0xf4d58e,x,.035,-10.8,1.5,.06,.25);soft(root,0xffedbe,x,.035,-10.45,.7,.06,.16);}
  // Fortress forecourt frames the protected area without covering targets.
  const forecourt=surface(group(root,'fortress_stone_terrace'),'stone',false,true);
  soft(forecourt,0x719b84,0,.09,0,7.3,.22,6.2);soft(forecourt,0xe6c995,0,.23,0,6.9,.14,5.4);
  for(const side of [-1,1]){
    // Flush guardian-yard inlays add authored detail while targets stay clear.
    const inlay=add(root,ringGeometry,0x62ae8c,side*6.7,.045,2.2,.94,.94,.94);inlay.rotation.x=-Math.PI/2;
    for(let i=0;i<4;i++){const a=i*Math.PI/2,mark=soft(root,0xa3d39b,side*6.7+Math.sin(a)*.65,.052,2.2+Math.cos(a)*.65,.12,.025,.24);mark.rotation.y=a;}
  }
  for(const side of [-1,1]){banner(root,side*5.9,10.3,-side);soft(root,0xf0dec1,side*8.9,.52,11.3,4,.9,1.6);soft(root,0xe68179,side*8.9,1.05,11.3,4.2,.18,1.8);for(let i=0;i<4;i++)soft(root,0xf6e8cf,side*(7.5+i*.9),1.29,11.3,.54,.55,1.15);}
  bake(root);root.userData.playBounds={minX:-11,maxX:11,minZ:-10,maxZ:7};root.userData.assetType='finished_procedural_original';return root;
}

export function createTower(){
  const root=new THREE.Group();root.name='sunheart_crystal_fortress';surface(root,'stone');
  const contact=new THREE.Mesh(shadowGeometry,shadowMaterial);contact.name='tower_contact_shadow';surface(contact,'paint',false,true);contact.rotation.x=-Math.PI/2;contact.position.y=.045;contact.scale.set(3.18,2.48,1);root.add(contact);
  soft(root,0x9c8a75,0,.19,0,5.5,.38,4.3);soft(root,0xf3dbb0,0,.47,0,4.85,.5,3.7);soft(root,0xdfb18f,0,.95,0,4.5,.56,3.36);
  soft(root,0xfeefd2,0,1.34,0,5.08,.25,3.85);
  const plateau=1.48;
  for(const side of [-1,1]){
    cylinder(root,0xf1d6af,side*2.15,.82,.05,.63,1.6);cylinder(root,0xd75f61,side*2.15,1.59,.05,.71,.18);cylinder(root,0xffe6ac,side*2.15,1.76,.05,.58,.24);
    for(let i=0;i<5;i++){const a=i*Math.PI*2/5;soft(root,0xf6e6c6,side*2.15+Math.cos(a)*.43,1.99,.05+Math.sin(a)*.43,.28,.4,.25);}
    soft(root,0x579998,side*2.15,.92,.64,.22,.53,.035);soft(root,0xc3e7d4,side*2.15,.93,.665,.1,.33,.02);
    soft(root,0xf0cda9,side*1.56,1.61,-1.48,1.4,.3,.38);
    for(let i=0;i<3;i++)soft(root,0xffebc6,side*(.96+i*.55),1.88,-1.48,.32,.4,.38);
  }
  // Teal reliquary is a narrative main tower target; lion stands in front.
  soft(root,0x4a8992,2.15,1.88,.05,1.22,.9,1.2);soft(root,0xf5cc73,2.15,2.33,.05,1.44,.16,1.42);
  const crystal=add(root,crystalGeometry,0x61e8e0,2.15,2.89,.05,.48,.7,.48,true);crystal.rotation.y=Math.PI/4;crystal.name='tower_crystal';surface(crystal,'metal',false,false);
  const halo=add(root,ringGeometry,0xffd777,2.15,2.8,.05,.68,.68,.68,true);halo.rotation.x=.15;halo.name='tower_halo';surface(halo,'metal',false,false);
  soft(root,0xdc756e,0,.91,1.71,1.1,.84,.06);soft(root,0xfbe0a2,0,.96,1.75,.1,.52,.025);ball(root,0xffd977,0,1.09,1.78,.12,.12,.04);
  // Recessed arch, stone courses and embossed guardian seal give the tower
  // authored depth at the fixed camera, while the platform origin stays1.48.
  add(root,archGeometry,0xbc916d,0,.85,1.76,1.32,1.12,1);
  add(root,archGeometry,0x28697a,0,.83,1.86,1.01,.95,.55);
  for(const side of [-1,1]){
    for(let row=0;row<3;row++)soft(root,0xc49f7b,side*1.63,.49+row*.27,1.716,.93,.035,.025);
    const trim=surface(group(root,'turret_brass_trim',side*2.15,1.59,.05),'metal');
    cylinder(trim,0xe5b25d,0,0,0,.725,.055);
  }
  pawSeal(root,0,1.05,1.967,.265);
  bake(root);root.userData.platformHeight=plateau;root.userData.parts={crystal,halo};root.userData.radius=2.45;return root;
}

// This rig belongs to the defence game. The archived spherical-adventure Leo
// remains untouched in art.mjs, so other/legacy consumers keep their source.
function createBlockLion(){
  const hero=new THREE.Group();hero.name='Boom_Mane_Leo_block_guardian';surface(hero,'paint');
  const body=group(hero,'body',0,.53,0);
  soft(body,0xf8b632,0,.025,0,.43,.56,.32);
  soft(body,0xffd978,0,.025,.175,.29,.39,.06);
  for(let row=0;row<3;row++)soft(body,0xffe5a0,0,.15-row*.095,.214,.23-row*.045,.085,.035);
  const head=surface(group(body,'head',0,.4,.035),'skin');
  const mane=surface(group(head,'explosive_cube_afro',0,.045,-.045),'paint');
  const colours=[0xe65a14,0xf9840d,0xffb829,0xf9a018];
  // Layered cuboid clusters make a firework crown with intentional depth,
  // rather than a circular fur ring or a single inflated cube.
  soft(mane,0xe97113,0,.02,-.12,.72,.66,.39);
  for(let layer=0;layer<2;layer++)for(let i=0;i<14;i++){
    const a=(i+.5*(layer%2))/14*Math.PI*2,r=.34+(i%3)*.018;
    const block=soft(mane,colours[(i+layer*2)%4],Math.cos(a)*r,.025+Math.sin(a)*r,-.16+layer*.18,.22+(i%3)*.027,.22+(i%2)*.04,.23);
    block.rotation.z=((i%3)-1)*.11;
  }
  for(let i=0;i<5;i++)soft(mane,colours[(i+2)%4],(i-2)*.145,.38+(i%2)*.065,-.035,.18,.20,.22);
  soft(head,0xffc34d,0,.015,.075,.48,.47,.36);
  // Strong rectangular ears, square eyes and a projecting double box muzzle.
  for(const side of [-1,1]){
    soft(head,0xf8bc3b,side*.248,.16,.083,.16,.20,.135);
    soft(head,0x9d5d25,side*.253,.165,.157,.095,.12,.027);
    soft(head,0xfff5de,side*.111,.055,.269,.146,.19,.034);
    soft(head,0x9e5a22,side*.111,.045,.291,.089,.13,.018);
    soft(head,0x392820,side*.111,.046,.305,.054,.106,.011);
    soft(head,0xffffff,side*.111-.015,.087,.314,.028,.035,.009);
    const brow=soft(head,0x79411e,side*.111,.178,.288,.15,.045,.035);brow.rotation.z=side*.22;
    soft(head,0xffe5a4,side*.071,-.09,.292,.154,.135,.13);
  }
  soft(head,0xffe4a4,0,-.17,.273,.23,.07,.14);
  soft(head,0x84451f,0,-.018,.367,.12,.06,.034);
  soft(head,0x84451f,0,-.079,.365,.018,.065,.014);
  soft(head,0x84451f,0,-.114,.366,.13,.016,.016);
  for(const side of [-1,1]){const smile=soft(head,0x84451f,side*.071,-.104,.366,.016,.035,.016);smile.rotation.z=-side*.15;}
  const sparks=[];
  for(let i=0;i<6;i++){
    const a=i/6*Math.PI*2+.18;
    const spark=soft(mane,0xffd85b,Math.cos(a)*.52,Math.sin(a)*.48+.055,.01,.065,.065,.065);
    spark.rotation.z=.26+i*.3;spark.userData.basePosition=spark.position.clone();sparks.push(spark);
  }
  const cape=surface(group(body,'short_red_cape',0,.22,-.19),'cloth');
  // Stepped cloth panels keep the cape readable from front and rear angles.
  soft(cape,0xda4930,0,-.21,-.06,.48,.42,.055);
  soft(cape,0xce3f29,-.18,-.39,-.08,.25,.19,.07);soft(cape,0xe7532e,.18,-.38,-.09,.25,.21,.07);
  soft(cape,0xffc85b,0,-.45,-.04,.53,.045,.055);
  for(const side of [-1,1]){const collar=soft(body,0xe4572d,side*.12,.226,.13,.25,.11,.11);collar.rotation.z=side*.15;soft(body,0xffd35d,side*.12,.186,.19,.23,.035,.035);}
  const badge=surface(group(body,'guardian_paw_badge',0,.21,.235),'metal');
  soft(badge,0xf6c24f,0,0,0,.16,.17,.045);soft(badge,0x824d23,0,0,.028,.119,.13,.018);
  soft(badge,0xffdf7f,0,-.018,.041,.054,.049,.012);
  for(let toe=0;toe<3;toe++)soft(badge,0xffdf7f,(toe-1)*.029,.026+(toe===1?.013:0),.042,.022,.031,.012);
  const legs=[],arms=[];
  for(const side of [-1,1]){
    const leg=group(hero,`leg_${side}`,side*.125,.31,.005);
    soft(leg,0xf0ad31,0,-.105,0,.18,.30,.19);soft(leg,0xffd47a,0,-.244,.065,.22,.13,.28);
    for(let toe=-1;toe<=1;toe++)soft(leg,0xffe7aa,toe*.065,-.247,.202,.055,.09,.049);
    legs.push(leg);
    const arm=group(body,`arm_${side}`,side*.25,.12,.018);arm.rotation.z=-side*.15;
    soft(arm,0xf4ae2f,0,-.075,.015,.18,.27,.19);soft(arm,0xffcf70,0,-.205,.045,.205,.15,.20);
    for(let toe=-1;toe<=1;toe++)soft(arm,0xffe1a1,toe*.058,-.221,.154,.047,.075,.026);
    arms.push(arm);
  }
  const tail=group(hero,'segmented_lion_tail',0,.4,-.13);
  for(let i=0;i<4;i++){const segment=soft(tail,0xe9a431,.08+i*.095,-.025+(i>1?(i-1)*.04:0),-.09-i*.035,.14,.08,.085);segment.rotation.y=-.18;segment.rotation.z=i>1?.2:0;}
  for(let i=0;i<5;i++){const a=i*Math.PI*2/5;soft(tail,colours[i%4],.43+Math.cos(a)*.055,.14+Math.sin(a)*.055,-.21,.11,.11,.11);}
  hero.userData.parts={body,head,mane,cape,arms,legs,tail,sparks};
  hero.userData.character='WeightPlay Boom Mane Leo';hero.userData.style='Block Animals';hero.userData.dimensions={height:1.5,footOrigin:true,forward:'+Z'};
  return hero;
}

export function createDefender(){
 const hero=createBlockLion(),parts=hero.userData.parts;
 hero.name='Boom_Mane_Leo_fixed_rear_operator';parts.head.scale.setScalar(1.12);
 const controls=surface(group(hero,'two_hand_turret_controls',0,.58,.35),'metal');
 soft(controls,0x245a74,0,0,0,.65,.13,.25);
 for(const side of[-1,1]){soft(controls,0xf8c35a,side*.22,.13,0,.065,.24,.065);soft(controls,0x7ff4e9,side*.22,.25,0,.13,.07,.15);}
 const pivots=[];hero.traverse(n=>{if(n.isGroup)pivots.push(n);});for(const pivot of pivots.reverse())bake(pivot,true);
 hero.rotation.y=Math.PI;hero.userData.forward='-Z';return hero;
}
export function aimDefender(hero,{recoil=0,time=0,reduced=false}={}){
 const p=hero.userData.parts;hero.rotation.y=Math.PI;
 p.head.rotation.set(-.04,0,0);p.body.rotation.set(0,0,0);
 p.arms[0].rotation.set(-1.05,0,-.1);p.arms[1].rotation.set(-1.05,0,.1);
 if(p.mane)p.mane.rotation.z=reduced?0:Math.sin(time*2)*.009;
 if(p.cape)p.cape.rotation.x=reduced?0:Math.sin(time*3)*.025;
}
// Shared dimensions with defense.mjs: pivot(0,2.42,0), muzzle at local+Z2.18.
export function createTurret(){
 const root=surface(new THREE.Group(),'metal');root.name='central_swivel_guardian_cannon';
 cylinder(root,0x25536e,0,1.64,0,.85,.25);cylinder(root,0xf2c35e,0,1.82,0,.67,.12);
 const pivot=group(root,'turret_yaw',0,2.42,0),slide=group(pivot,'turret_barrel'),breech=group(pivot,'turret_recoil');
 soft(breech,0x2d6785,0,0,.35,1.0,.7,1.2);soft(slide,0x5ec9d5,0,.05,.7,.9,.58,.7);
 soft(slide,0x25465f,0,0,1.37,.58,.5,1.12);soft(slide,0xf7cb67,0,0,1.95,.78,.7,.23);
 soft(slide,0x183b55,0,0,2.085,.55,.49,.05);soft(slide,0x81fff4,0,0,2.13,.31,.28,.035,true);
 for(const side of[-1,1]){soft(slide,0xe3e9cf,side*.53,0,.2,.15,.38,.65);for(let n=0;n<3;n++)soft(slide,0x9cf4e4,side*.47,.1,.45+n*.22,.055,.2,.12,true);}
 const muzzle=group(slide,'turret_true_muzzle',0,0,2.18);bake(slide);bake(root,true);
 bake(breech);root.userData.parts={pivot,slide,breech,muzzle};return root;
}
export function aimTurret(root,{angle=Math.PI,recoil=0,aurora=false}={}){const p=root.userData.parts;p.pivot.rotation.y=angle;p.breech.position.z=-recoil*.13;root.userData.aurora=aurora;}

const PALETTES={
  walker:{skin:0x9bd49a,light:0xc0e9ae,shirt:0x618fc1,pants:0x36546e,hair:0x377c73,scale:1},
  runner:{skin:0x7bd5b5,light:0xb6f0c8,shirt:0xe9a64c,pants:0x4f6785,hair:0x2d8d82,scale:.91},
  brute:{skin:0xb2a0d3,light:0xd1bde8,shirt:0x6a5a92,pants:0x454768,hair:0x574778,scale:1.42},
  bomber:{skin:0xb0d790,light:0xdae9a3,shirt:0xd7756a,pants:0x745865,hair:0x518664,scale:1.06},
  spitter:{skin:0x7fc6a7,light:0xbae4b3,shirt:0x9c74b8,pants:0x475d77,hair:0x376c6b,scale:1.08},
  shield:{skin:0x8fc4cd,light:0xc7eeec,shirt:0x405b98,pants:0x344969,hair:0x254e6d,scale:1.12},
  healer:{skin:0x9dd0b5,light:0xe2f4d2,shirt:0xe6dfb5,pants:0x517e79,hair:0x2a8e80,scale:1.02},
  splitter:{skin:0xdcb18c,light:0xf6d59e,shirt:0xa86c80,pants:0x6c5368,hair:0x6c456b,scale:1.16},
  boss:{skin:0xa394ce,light:0xccb5df,shirt:0x484b80,pants:0x303b63,hair:0x403d6c,scale:2.35},
};
const templates=new Map();
function buildZombie(type){
  const p=PALETTES[type]||PALETTES.walker,root=new THREE.Group();root.name=`sunheart_${type}_zombie`;surface(root,'cloth');root.scale.setScalar(p.scale);
  const body=group(root,'body',0,.63,0);
  soft(body,p.shirt,0,.04,0,.54,.61,.33);soft(body,p.light,0,.31,.03,.18,.13,.21);
  soft(body,0xe1e5c7,-.11,.11,.18,.045,.11,.02);soft(body,0x355f69,.15,-.01,.18,.09,.13,.025);soft(body,0xd7d9be,0,-.23,0,.57,.07,.35);
  const head=surface(group(root,'head',0,1.19,.02),'skin');head.scale.set(1.1,1.08,1.04);
  soft(head,p.skin,0,0,0,.63,.59,.47);soft(head,p.light,-.09,-.13,.245,.34,.17,.12);
  ball(head,p.skin,-.34,.005,.015,.1,.15,.11);ball(head,p.skin,.34,.005,.015,.1,.15,.11);
  for(const side of [-1,1]){
    ball(head,0xfff9df,side*.15,.055,.258,.119,.135,.044);ball(head,0x243547,side*.15,.04,.299,.052,.077,.018);ball(head,0xffffff,side*.155,.072,.31,.018,.023,.007);
    const brow=soft(head,p.hair,side*.145,.198,.258,.18,.055,.055);brow.rotation.z=-side*.18;
  }
  soft(head,0x4f665f,.04,-.145,.305,.26,.092,.035);soft(head,0xf7efd3,-.037,-.137,.331,.058,.073,.025);soft(head,0xf7efd3,.106,-.135,.331,.055,.065,.025);
  soft(head,p.hair,0,.275,-.05,.64,.11,.44);for(let i=0;i<3;i++){const tuft=soft(head,p.hair,(i-1)*.18,.33+i*.025,-.08,.15,.18,.24);tuft.rotation.z=(i-1)*-.2;}
  if(type==='runner'){
    soft(head,0xdf7859,0,.19,.03,.69,.1,.5);soft(head,0xffce70,0,.19,.292,.13,.11,.03);
  }
  if(type==='brute'||type==='boss'){
    soft(body,type==='boss'?0x756aab:0x8d7dad,0,.1,.19,.62,.36,.16);
    for(const side of [-1,1]){soft(body,0xbbb3d2,side*.35,.24,0,.23,.22,.47);soft(body,0xefe1bc,side*.35,.25,.24,.11,.11,.04);}
    soft(head,0x5c628a,0,.34,-.035,.76,.16,.58);soft(head,0xf4c369,0,.35,.28,.18,.17,.05);
    for(const side of [-1,1]){const horn=add(head,coneGeometry,0xffe4ad,side*.27,.57,-.06,.095,.36,.095);horn.rotation.z=-side*.35;}
  }
  if(type==='bomber'){
    // Broad coral canister and yellow rings remain visible from overhead.
    cylinder(body,0xce6a60,0,.03,-.31,.31,.64);cylinder(body,0xf3be73,0,.29,-.31,.34,.08);cylinder(body,0xf3be73,0,-.21,-.31,.34,.08);
    const fuse=soft(body,0x726353,.12,.45,-.31,.055,.24,.055);fuse.rotation.z=-.4;
    add(body,crystalGeometry,0xffcb50,.16,.61,-.31,.07,.11,.07,true).name='fuse_spark';
  }
  if(type==='spitter'){
    for(const side of [-1,1]){ball(head,0xc6a1d3,side*.23,-.13,.24,.15,.15,.11);ball(body,0x91bf84,side*.17,.14,-.26,.19,.24,.15);}
    ball(head,0x698e69,.02,-.14,.33,.11,.11,.07);ball(head,0xd5e899,.02,-.14,.39,.071,.071,.014);
  }
  if(type==='shield'){
    const shield=group(body,'front_energy_shield',0,.05,.39);soft(shield,0x315a90,0,0,0,.9,1.02,.18);soft(shield,0x6fe4eb,0,0,.11,.71,.83,.065);soft(shield,0xf6dd85,0,0,.16,.13,.68,.03);soft(shield,0xf6dd85,0,0,.16,.55,.13,.03);
  }
  if(type==='healer'){
    soft(head,0xffefd2,0,.32,0,.72,.19,.55);soft(head,0x52b99b,0,.34,.29,.12,.16,.04);soft(head,0x52b99b,0,.34,.29,.34,.065,.04);
    soft(body,0x3f8d86,0,.08,-.34,.48,.66,.24);for(const side of[-1,1])soft(body,0x95ffd6,side*.22,.16,-.49,.11,.38,.09,true);
  }
  if(type==='splitter'){
    for(const side of[-1,1]){soft(body,0x845294,side*.28,.17,-.19,.36,.62,.4);soft(body,0xf7c18b,side*.28,.17,-.42,.075,.49,.035);}
    soft(head,0xffdb95,0,.26,.06,.12,.58,.55);
  }
  const legs=[],arms=[];
  for(const side of [-1,1]){
    const leg=group(root,`leg_${side}`,side*.16,.36,0);soft(leg,p.pants,0,-.11,0,.22,.32,.23);soft(leg,0x3b515f,0,-.3,.075,.28,.13,.39);soft(leg,0x6e8890,0,-.26,.205,.24,.045,.08);bake(leg);legs.push(leg);
    const arm=group(root,`arm_${side}`,side*.35,.85,.02);arm.rotation.x=-.62;arm.rotation.z=-side*.09;soft(arm,p.shirt,0,-.12,0,.20,.29,.24);soft(arm,p.skin,0,-.34,.02,.19,.24,.20);soft(arm,p.light,0,-.47,.055,.23,.13,.24);bake(arm);arms.push(arm);
  }
  if(type==='boss'){
    const crown=group(head,'boss_crown',0,.42,-.03);cylinder(crown,0xd6a25f,0,0,0,.43,.10);
    for(let i=0;i<5;i++){const a=i*2*Math.PI/5;const point=add(crown,coneGeometry,0xf6cb78,Math.cos(a)*.35,.17,Math.sin(a)*.35,.09,.34,.09);point.rotation.z=Math.cos(a)*-.12;}
    soft(body,0x9472ad,0,.08,-.22,.7,.66,.08);soft(body,0xe4b36a,0,-.24,-.27,.72,.08,.04);
  }
  bake(body);bake(head);root.userData.type=type;root.userData.baseScale=p.scale;
  return root;
}
export function createZombie(type='walker'){
  if(!PALETTES[type])type='walker';if(!templates.has(type))templates.set(type,buildZombie(type));
  const root=templates.get(type).clone(true);const parts={body:root.getObjectByName('body'),head:root.getObjectByName('head'),arms:[root.getObjectByName('arm_-1'),root.getObjectByName('arm_1')],legs:[root.getObjectByName('leg_-1'),root.getObjectByName('leg_1')],fuse:root.getObjectByName('fuse_spark')};
  if(parts.fuse)parts.fuse.userData.originalScale=parts.fuse.scale.clone();
  const shadow=new THREE.Mesh(shadowGeometry,shadowMaterial);shadow.name='contact_shadow';surface(shadow,'paint',false,true);shadow.rotation.x=-Math.PI/2;shadow.position.y=.04;shadow.scale.set(.48,.3,1);root.add(shadow);
  root.userData.parts=parts;root.userData.type=type;root.userData.groundOrigin=true;root.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(root);root.userData.height=bounds.max.y;root.userData.bounds={min:bounds.min.toArray(),max:bounds.max.toArray()};root.userData.originalScale=root.scale.clone();return root;
}

export function animateZombie(mesh,{time=0,speed=0,hit=0,attack=0,death=0,reduced=false}={}){
  const p=mesh.userData.parts;if(!p)return;const moving=Math.min(1,Math.abs(speed)),phase=time*(mesh.userData.type==='runner'?11:6.5),stride=Math.sin(phase)*.42*moving;
  mesh.scale.copy(mesh.userData.originalScale);mesh.rotation.z=0;p.arms[0].rotation.z=.09;p.arms[1].rotation.z=-.09;
  p.legs[0].rotation.x=stride;p.legs[1].rotation.x=-stride;
  p.arms[0].rotation.x=-.63-stride*.3-attack*.85;p.arms[1].rotation.x=-.63+stride*.3-attack*.85;
  p.body.rotation.z=reduced?0:Math.sin(phase)*.045*moving;p.body.position.y=.63+(reduced?0:Math.abs(Math.sin(phase))*.035*moving);
  p.head.rotation.z=reduced?0:Math.sin(phase*.5)*.045*moving;p.head.rotation.x=-hit*.16+attack*.09;
  p.body.scale.set(1+hit*.09,1-hit*.12,1+hit*.07);
  if(p.fuse){p.fuse.visible=true;p.fuse.scale.copy(p.fuse.userData.originalScale).multiplyScalar(reduced?1:1+Math.sin(time*11)*.18);}
  if(death>0){const t=Math.min(1,death);mesh.scale.copy(mesh.userData.originalScale).multiplyScalar(Math.max(.001,1-t*t));mesh.rotation.z=(reduced?0:.7)*t;p.arms[0].rotation.z=-.1-t;p.arms[1].rotation.z=.1+t;}
}

export const ART_PROVENANCE=Object.freeze({author:'WeightPlay owner-directed code-native production',date:'2026-10-27',engine:'Three.js 0.180.0',style:'WeightPlay Block Animals',reference:'/assets/weightplay-character-boom-mane-lion-block-v1.webp',externalAssets:[],bounds:{x:[-14,14],z:[-12,13]},enemyTypes:Object.keys(PALETTES)});

// Use this factory for a running Battle. Module-level shapes/templates are
// immutable authoring sources, never GPU resources shared between scenes.
// Every active scene receives its own deduplicated clones. Scene teardown may
// dispose these normally, including pooled roots that are currently detached.
export function createDefenseArt(){
  const geometries=new Map(),sceneMaterials=new Map();
  function owned(root){root.traverse(node=>{if(!node.isMesh)return;
    const source=node.geometry;if(!geometries.has(source.uuid))geometries.set(source.uuid,source.clone());node.geometry=geometries.get(source.uuid);
    const copy=sourceMaterial=>{if(!sceneMaterials.has(sourceMaterial.uuid))sceneMaterials.set(sourceMaterial.uuid,sourceMaterial.clone());return sceneMaterials.get(sourceMaterial.uuid);};
    node.material=Array.isArray(node.material)?node.material.map(copy):copy(node.material);
  });return root;}
  return {createArena:()=>owned(createArena()),createTower:()=>owned(createTower()),createDefender:()=>owned(createDefender()),createTurret:()=>owned(createTurret()),aimTurret,createZombie:type=>owned(createZombie(type)),animateZombie,aimDefender,
    dispose(){for(const geometry of geometries.values())geometry.dispose();for(const mat of sceneMaterials.values())mat.dispose();geometries.clear();sceneMaterials.clear();},
    get resources(){return {geometries:geometries.size,materials:sceneMaterials.size};}};
}
