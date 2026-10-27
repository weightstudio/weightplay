import * as THREE from './vendor/three.module.min.js';
import { createLion } from './art.mjs';

// Original, code-native art for the owner's flat lion defence replacement.
// Rounded character exception: docs/game-specs/orbit-menders.md, 2026-10-27.
// +Y up, +Z faces the castle. Every object has a ground-level origin.
// Static subassemblies are baked into vertex-coloured geometry; repeated
// enemies share bounded templates. No external texture or private effect engine.
const ballGeometry = new THREE.SphereGeometry(1,16,12);
const cylinderGeometry = new THREE.CylinderGeometry(1,1,1,20);
const coneGeometry = new THREE.ConeGeometry(1,1,16);
const ringGeometry = new THREE.TorusGeometry(1,.075,6,32);
const crystalGeometry = new THREE.OctahedronGeometry(1,0);
const shadowGeometry=new THREE.CircleGeometry(1,24);
const shadowMaterial=new THREE.MeshBasicMaterial({color:0x24495a,transparent:true,opacity:.14,depthWrite:false});
const heroShadowMaterial=new THREE.MeshBasicMaterial({color:0x324154,transparent:true,opacity:.23,depthWrite:false});
const polishedGold=new THREE.MeshStandardMaterial({color:0xf5bc4e,metalness:.68,roughness:.28});
const polishedBlue=new THREE.MeshStandardMaterial({color:0x286b8c,metalness:.42,roughness:.31});
const softGeometry = (() => {
  const shape=new THREE.Shape();shape.moveTo(-.38,-.38);shape.lineTo(.38,-.38);shape.lineTo(.38,.38);shape.lineTo(-.38,.38);shape.closePath();
  const result=new THREE.ExtrudeGeometry(shape,{depth:.76,bevelEnabled:true,bevelSize:.12,bevelThickness:.12,bevelSegments:2,steps:1});result.translate(0,0,-.38);return result;
})();
const materials=new Map();
function material(color,glow=false){const key=`${color}:${glow}`;if(!materials.has(key))materials.set(key,new THREE.MeshStandardMaterial({color,roughness:.68,metalness:glow?.12:0,emissive:glow?color:0,emissiveIntensity:glow?.65:0}));return materials.get(key);}
const bakedMaterial=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.72,metalness:.03});
function add(parent,geometry,color,x,y,z,sx=1,sy=sx,sz=sx,glow=false){const node=new THREE.Mesh(geometry,material(color,glow));node.position.set(x,y,z);node.scale.set(sx,sy,sz);node.receiveShadow=true;parent.add(node);return node;}
const ball=(p,c,x,y,z,sx,sy=sx,sz=sx)=>add(p,ballGeometry,c,x,y,z,sx,sy,sz);
const soft=(p,c,x,y,z,sx,sy,sz)=>add(p,softGeometry,c,x,y,z,sx,sy,sz);
const cylinder=(p,c,x,y,z,sx,sy,sz=sx)=>add(p,cylinderGeometry,c,x,y,z,sx,sy,sz);
function group(parent,name,x=0,y=0,z=0){const g=new THREE.Group();g.name=name;g.position.set(x,y,z);parent?.add(g);return g;}

// Only use on a finished, static subtree. Animated pivots are baked separately.
// Emits one draw regardless of the original palette/shape count.
function bake(root,direct=false){
  root.updateMatrixWorld(true);const inverse=root.matrixWorld.clone().invert();const positions=[],normals=[],colors=[],uvs=[];const meshes=[];
  const candidates=[];if(direct)candidates.push(...root.children);else root.traverse(mesh=>candidates.push(mesh));
  for(const mesh of candidates)if(mesh.isMesh&&!mesh.material.emissiveIntensity&&!mesh.material.transparent&&!mesh.userData.noBake){meshes.push(mesh);const baseTransform=inverse.clone().multiply(mesh.matrixWorld),geometry=mesh.geometry.index?mesh.geometry.toNonIndexed():mesh.geometry;
    const pos=geometry.getAttribute('position'),normal=geometry.getAttribute('normal'),uv=geometry.getAttribute('uv'),point=new THREE.Vector3(),direction=new THREE.Vector3(),color=mesh.material.color;
    for(let instance=0;instance<(mesh.isInstancedMesh?mesh.count:1);instance++){
      const transform=baseTransform.clone();if(mesh.isInstancedMesh){const instanceTransform=new THREE.Matrix4();mesh.getMatrixAt(instance,instanceTransform);transform.multiply(instanceTransform);}const normalMatrix=new THREE.Matrix3().getNormalMatrix(transform);
      for(let i=0;i<pos.count;i++){point.fromBufferAttribute(pos,i).applyMatrix4(transform);direction.fromBufferAttribute(normal,i).applyMatrix3(normalMatrix).normalize();positions.push(point.x,point.y,point.z);normals.push(direction.x,direction.y,direction.z);colors.push(color.r,color.g,color.b);uvs.push(uv?.getX(i)||0,uv?.getY(i)||0);}
    }
    if(geometry!==mesh.geometry)geometry.dispose();
  }
  if(!meshes.length)return root;const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geometry.computeBoundingSphere();
  for(const mesh of meshes)mesh.parent.remove(mesh);const merged=new THREE.Mesh(geometry,bakedMaterial);merged.name='baked_original_art';merged.receiveShadow=true;root.add(merged);return root;
}

function tree(parent,x,z,scale=1){const g=group(parent,'rounded_canopy',x,0,z);g.scale.setScalar(scale);cylinder(g,0xaf7961,0,.74,0,.16,1.5);ball(g,0x238f7d,0,1.6,0,.8,.75,.75);ball(g,0x43b388,-.36,1.94,.12,.62,.58,.58);ball(g,0x7ad292,.35,2.08,-.04,.56,.55,.56);ball(g,0xc3ed9f,.08,2.4,.07,.4,.33,.38);for(let i=0;i<3;i++)ball(g,0xffcc70,(i-1)*.25,1.9+(i%2)*.3,.56,.07);}
function shrub(parent,x,z,scale=1){const g=group(parent,'side_shrub',x,0,z);g.scale.setScalar(scale);for(let i=0;i<3;i++)ball(g,[0x2b9d8b,0x4cbda1,0x94d9a1][i],(i-1)*.29,.3+(i%2)*.15,0,.43,.4,.38);}
function banner(parent,x,z,side=1){const g=group(parent,'castle_banner',x,0,z);cylinder(g,0xf4d690,0,1.9,0,.075,3.8);ball(g,0xffcc58,0,3.86,0,.16);soft(g,0xe66c6e,.42*side,3.07,0,.76,1.11,.07);soft(g,0xffe3a7,.42*side,3.1,.047,.08,.72,.028);ball(g,0xffe3a7,.42*side,3.3,.055,.12,.12,.04);}

export function createArena(){
  const root=new THREE.Group();root.name='original_sunrise_guardian_courtyard';
  soft(root,0x437f79,0,-.64,.4,29.5,.8,27.5);soft(root,0x63b67e,0,-.17,.4,28.9,.26,27);
  // Low-contrast stone paths are ground-level decoration, never obstacles.
  soft(root,0x76bf82,0,-.015,-1.2,20.9,.05,21.2);
  // Five gentle converging routes communicate the incoming pressure at once.
  // They are paint/stone insets on the flat ground, never collision geometry.
  for(let lane=-2;lane<=2;lane++){
    const start=new THREE.Vector3(lane*4,0,-10.5),end=new THREE.Vector3(lane*.55,0,6.6),delta=end.clone().sub(start),mid=start.clone().add(end).multiplyScalar(.5);
    const road=soft(root,lane%2?0x8ecb89:0x9bd18b,mid.x,.018,mid.z,1.58,.022,delta.length());road.rotation.y=Math.atan2(delta.x,delta.z);
    for(let dash=0;dash<5;dash++){const t=(dash+.5)/5,point=start.clone().lerp(end,t);const mark=soft(root,0x63b798,point.x,.042,point.z,.54,.025,.12);mark.rotation.y=road.rotation.y;}
  }
  soft(root,0xc6d18e,0,.025,1,2.45,.025,17);
  for(let row=0;row<9;row++)for(let col=0;col<2;col++){const tile=soft(root,(row+col)%2?0xcbd69a:0xd7dda8,(col-.5)*1.03,.05,-8.8+row*1.95,.95,.03,1.76);tile.rotation.y=(row%2?.018:-.012);}
  // Edges define the full combat footprint without confusing extra entrances.
  for(const side of [-1,1]){
    soft(root,0x4d9f7c,side*12.65,.11,-.3,1.5,.3,23.6);soft(root,0xe0cf8f,side*13.5,.04,-.3,.19,.16,24);
    for(let i=0;i<6;i++){shrub(root,side*12.7,-9.4+i*3.8,.85+(i%2)*.16);for(let j=0;j<3;j++){cylinder(root,0x4b9a76,side*(11.8+j*.17),.16,-8.7+i*3.8,.024,.34);ball(root,[0xffd675,0xffa5b0,0xf4f2d8][j],side*(11.8+j*.17),.34,-8.7+i*3.8,.10,.075,.10);}}
    for(let i=0;i<3;i++){
      // Alternating planter families break the mirrored shrub repetition.
      const z=-7.5+i*7.2;const pot=group(root,'coral_courtyard_planter',side*12.65,0,z);
      cylinder(pot,i%2?0xe0b86e:0xce8470,0,.18,0,.48,.34,.4);cylinder(pot,0xefcb91,0,.36,0,.53,.09,.44);ball(pot,0x398f77,0,.48,0,.43,.29,.35);
      for(let petal=0;petal<3;petal++){const a=petal*2.399;ball(pot,i%2?0xffd16e:0xf7a6ae,Math.sin(a)*.23,.67+(petal%2)*.07,Math.cos(a)*.2,.14,.12,.13);}
    }
    for(let i=0;i<5;i++){
      const stone=soft(root,i%2?0x7bae89:0xa4c7a3,side*(10.55-(i%2)*.4),.052,-7.5+i*3.1,.44,.075,.3);stone.rotation.y=side*(.35+i*.7);
      for(let blade=0;blade<2;blade++){const grass=soft(root,0x4ea67c,side*(10.1+blade*.11),.09,-6.8+i*3.1,.045,.12,.055);grass.rotation.z=side*.18;}
    }
    tree(root,side*14.7,-10.8,1.6);tree(root,side*15.4,-3,1.75);tree(root,side*15.1,5.4,1.4);
    // Distant rolling hills keep the active courtyard clearly flat.
    ball(root,side<0?0x58b2a2:0x72c4ae,side*21,-1.4,-17,12,5,8);ball(root,0x8bd4b2,side*13,-1.5,-24,11,6,7);
  }
  // Incoming gateway is deliberately low and behind the spawn line.
  soft(root,0x397d83,0,.24,-13.1,21,.5,1.1);
  for(let lane=-2;lane<=2;lane++){
    const gate=group(root,'incoming_gate',lane*4,0,-12.5);
    soft(gate,0x3e7b86,0,.87,-.38,2.5,1.6,.12);
    for(const side of [-1,1]){soft(gate,0xc5ddba,side*1.48,.85,0,.34,1.7,.52);soft(gate,0x42b9bb,side*1.48,.95,.29,.13,1.15,.07);}
    soft(gate,0xd9e5b8,0,1.79,0,3.35,.24,.69);soft(gate,0xf2c86c,0,1.99,.02,.44,.25,.57);
    for(const side of [-1,1]){const chevron=soft(root,0x39b8af,lane*4+side*.17,.069,-10.45,.13,.035,.55);chevron.rotation.y=side*.7;}
  }
  for(const side of [-1,1]){soft(root,0xf0e8c5,side*10.7,.95,-12.4,1.5,1.95,1.6);ball(root,0xf7d18a,side*10.7,2,-12.4,.89,.31,.9);banner(root,side*10.7,-12.3,side);}
  for(let i=0;i<5;i++){const x=(i-2)*3.75;soft(root,0xf4d58e,x,.035,-10.8,1.5,.06,.25);soft(root,0xffedbe,x,.035,-10.45,.7,.06,.16);}
  // Fortress forecourt frames the protected area without covering targets.
  soft(root,0x9ab58e,0,.09,9.1,10.9,.22,6.2);soft(root,0xe9d4a7,0,.23,9.1,9.7,.14,5.4);
  for(const side of [-1,1]){
    // Flush guardian-yard inlays add authored detail while targets stay clear.
    const inlay=add(root,ringGeometry,0x62ae8c,side*6.7,.045,2.2,.94,.94,.94);inlay.rotation.x=-Math.PI/2;
    for(let i=0;i<4;i++){const a=i*Math.PI/2,mark=soft(root,0xa3d39b,side*6.7+Math.sin(a)*.65,.052,2.2+Math.cos(a)*.65,.12,.025,.24);mark.rotation.y=a;}
  }
  for(const side of [-1,1]){banner(root,side*5.9,10.3,-side);soft(root,0xf0dec1,side*8.9,.52,11.3,4,.9,1.6);soft(root,0xe68179,side*8.9,1.05,11.3,4.2,.18,1.8);for(let i=0;i<4;i++)soft(root,0xf6e8cf,side*(7.5+i*.9),1.29,11.3,.54,.55,1.15);}
  bake(root);root.userData.playBounds={minX:-11,maxX:11,minZ:-10,maxZ:7};root.userData.assetType='finished_procedural_original';return root;
}

export function createTower(){
  const root=new THREE.Group();root.name='sunheart_crystal_fortress';
  const contact=new THREE.Mesh(shadowGeometry,shadowMaterial);contact.name='tower_contact_shadow';contact.rotation.x=-Math.PI/2;contact.position.y=.045;contact.scale.set(3.18,2.48,1);root.add(contact);
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
  soft(root,0x4a8992,0,1.88,-.73,1.22,.9,1.2);soft(root,0xf5cc73,0,2.33,-.73,1.44,.16,1.42);
  const crystal=add(root,crystalGeometry,0x61e8e0,0,2.89,-.73,.48,.7,.48,true);crystal.rotation.y=Math.PI/4;crystal.name='tower_crystal';
  const halo=add(root,ringGeometry,0xffd777,0,2.8,-.73,.68,.68,.68,true);halo.rotation.x=.15;halo.name='tower_halo';
  soft(root,0xdc756e,0,.91,1.71,1.1,.84,.06);soft(root,0xfbe0a2,0,.96,1.75,.1,.52,.025);ball(root,0xffd977,0,1.09,1.78,.12,.12,.04);
  bake(root);root.userData.platformHeight=plateau;root.userData.parts={crystal,halo};root.userData.radius=2.45;return root;
}

export function createDefender(){
  const hero=createLion();hero.name='Boom_Mane_Leo_sunheart_guard';
  const parts=hero.userData.parts;
  parts.head.scale.setScalar(1.12);
  // Keep Leo's authored identity intact. The independent gun pivot can track
  // aim immediately while body/head follow with a small, bounded lag.
  // A shoulder-height swivelling mount lets Leo keep his expressive face
  // towards the fixed player camera without twisting his neck through180°.
  const mount=group(hero,'defender_cannon_mount',.53,.18,.025);
  cylinder(mount,0x347f8d,0,.07,0,.24,.12);cylinder(mount,0xe9b45b,0,.16,0,.18,.09);cylinder(mount,0x38677d,0,.32,0,.085,.3);ball(mount,0x68d6d4,0,.48,0,.18,.13,.18);
  const gun=group(hero,'defender_cannon',.53,.68,.025);
  soft(gun,0x24667e,0,0,.18,.35,.37,.63);soft(gun,0x58ccda,0,.025,.36,.43,.31,.5);soft(gun,0xffcd62,0,.02,.55,.48,.34,.12);
  const barrel=cylinder(gun,0x274f70,0,.03,.71,.145,.44);barrel.rotation.x=Math.PI/2;
  barrel.material=polishedBlue;barrel.userData.noBake=true;
  const muzzle=group(gun,'defender_muzzle',0,.03,.95);const rim=add(gun,ringGeometry,0xffd56c,0,.03,.936,.165,.165,.165);rim.scale.z=.5;
  rim.material=polishedGold;rim.userData.noBake=true;
  ball(gun,0x74f3ed,0,.03,.945,.105,.105,.025);
  for(const side of [-1,1])soft(gun,0xc4fff3,side*.222,.04,.32,.032,.17,.27);
  soft(gun,0x3685a3,0,-.23,.08,.15,.32,.18);ball(gun,0xffebae,0,.23,.23,.067);
  gun.scale.setScalar(1.22);bake(gun);parts.gun=gun;parts.muzzle=muzzle;parts.barrel=barrel;parts.mount=mount;
  const contact=new THREE.Mesh(shadowGeometry,heroShadowMaterial);contact.name='Leo_contact_shadow';contact.rotation.x=-Math.PI/2;contact.position.y=.012;contact.scale.set(.51,.31,1);hero.add(contact);
  // Preserve every authored animation pivot while collapsing its direct
  // static meshes/instances across colours. No limb or mane identity is lost.
  const heroPivots=[];hero.traverse(node=>{if(node.isGroup&&node!==gun)heroPivots.push(node);});for(const pivot of heroPivots.reverse())bake(pivot,true);
  hero.userData.forward='+Z';hero.userData.weapon='original_cyan_guard_cannon';return hero;
}

// Input is the authoritative world-yaw of the shot, atan2(dx,dz). This is a
// visual rig only: it never snaps targets, changes collisions or delays fire.
export function aimDefender(hero,{angle=Math.PI,recoil=0,time=0,reduced=false}={}){
  const p=hero.userData.parts;if(!p?.gun)return;const yaw=Number.isFinite(angle)?angle:Math.PI,hit=Math.min(1,Math.max(0,recoil));
  hero.rotation.y=Math.sin(yaw)*.24;const localYaw=yaw-hero.rotation.y;
  p.gun.rotation.y=localYaw;p.gun.position.set(.53-Math.sin(localYaw)*hit*.075,.68,.025-Math.cos(localYaw)*hit*.075);
  p.body.rotation.x=-hit*.025;p.head.rotation.y=Math.sin(yaw)*.065;p.head.rotation.x=-.045-hit*.018;
  p.arms[1].rotation.set(-.75,.1,-.35);p.arms[0].rotation.set(-.15,0,.1);
  if(p.mane)p.mane.rotation.z=reduced?0:Math.sin(time*2)*.012;
  if(p.cape)p.cape.rotation.x=reduced?0:Math.sin(time*3)*.035;
  if(p.tail)p.tail.rotation.y=reduced?0:Math.sin(time*2.4)*.08;
}

const PALETTES={
  walker:{skin:0x9bd49a,light:0xc0e9ae,shirt:0x618fc1,pants:0x36546e,hair:0x377c73,scale:1},
  runner:{skin:0x7bd5b5,light:0xb6f0c8,shirt:0xe9a64c,pants:0x4f6785,hair:0x2d8d82,scale:.91},
  brute:{skin:0xb2a0d3,light:0xd1bde8,shirt:0x6a5a92,pants:0x454768,hair:0x574778,scale:1.42},
  bomber:{skin:0xb0d790,light:0xdae9a3,shirt:0xd7756a,pants:0x745865,hair:0x518664,scale:1.06},
  spitter:{skin:0x7fc6a7,light:0xbae4b3,shirt:0x9c74b8,pants:0x475d77,hair:0x376c6b,scale:1.08},
  boss:{skin:0xa394ce,light:0xccb5df,shirt:0x484b80,pants:0x303b63,hair:0x403d6c,scale:2.35},
};
const templates=new Map();
function buildZombie(type){
  const p=PALETTES[type]||PALETTES.walker,root=new THREE.Group();root.name=`sunheart_${type}_zombie`;root.scale.setScalar(p.scale);
  const body=group(root,'body',0,.63,0);
  soft(body,p.shirt,0,.04,0,.54,.61,.33);soft(body,p.light,0,.31,.03,.18,.13,.21);
  soft(body,0xe1e5c7,-.11,.11,.18,.045,.11,.02);soft(body,0x355f69,.15,-.01,.18,.09,.13,.025);soft(body,0xd7d9be,0,-.23,0,.57,.07,.35);
  const head=group(root,'head',0,1.19,.02);
  soft(head,p.skin,0,0,0,.63,.59,.47);soft(head,p.light,-.09,-.13,.245,.34,.17,.12);
  ball(head,p.skin,-.34,.005,.015,.1,.15,.11);ball(head,p.skin,.34,.005,.015,.1,.15,.11);
  for(const side of [-1,1]){
    ball(head,0xf8f3d5,side*.145,.055,.258,.11,.125,.04);ball(head,0x32364c,side*.145,.04,.294,.047,.071,.018);ball(head,0xffffff,side*.155,.072,.31,.018,.023,.007);
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
  const shadow=new THREE.Mesh(shadowGeometry,shadowMaterial);shadow.name='contact_shadow';shadow.rotation.x=-Math.PI/2;shadow.position.y=.04;shadow.scale.set(.48,.3,1);root.add(shadow);
  root.userData.parts=parts;root.userData.type=type;root.userData.groundOrigin=true;root.userData.height=1.66*root.userData.baseScale;root.userData.originalScale=root.scale.clone();return root;
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

export const ART_PROVENANCE=Object.freeze({author:'WeightPlay owner-directed code-native production',date:'2026-10-27',engine:'Three.js 0.180.0',reference:'/assets/weightplay-boom-mane-lion.png',externalAssets:[],bounds:{x:[-14,14],z:[-12,13]},enemyTypes:Object.keys(PALETTES)});

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
  return {createArena:()=>owned(createArena()),createTower:()=>owned(createTower()),createDefender:()=>owned(createDefender()),createZombie:type=>owned(createZombie(type)),animateZombie,aimDefender,
    dispose(){for(const geometry of geometries.values())geometry.dispose();for(const mat of sceneMaterials.values())mat.dispose();geometries.clear();sceneMaterials.clear();},
    get resources(){return {geometries:geometries.size,materials:sceneMaterials.size};}};
}
