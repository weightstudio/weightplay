import * as THREE from './vendor/three.module.min.js';

// Per-game owner visual amendment, 2026-10-27: rounded Boom Mane Leo.
// Reference inspected: assets/weightplay-boom-mane-lion.png. This is an original
// code-native adaptation of the WeightPlay character, not third-party artwork.
// +Y up, +Z forward; all geometry/material caches are small and bounded.
const round = (() => {
  const s = new THREE.Shape(); s.moveTo(-.38,-.38); s.lineTo(.38,-.38);
  s.lineTo(.38,.38); s.lineTo(-.38,.38); s.closePath();
  const g = new THREE.ExtrudeGeometry(s,{depth:.76,bevelEnabled:true,bevelSize:.12,bevelThickness:.12,bevelSegments:3,steps:1});
  g.translate(0,0,-.38); return g;
})();
const sphere = new THREE.SphereGeometry(1,24,16);
const flowerSphere = new THREE.SphereGeometry(1,10,8);
const cylinder = new THREE.CylinderGeometry(1,1,1,16);
const torus = new THREE.TorusGeometry(1,.075,6,32);
const sparkGeometry = new THREE.LatheGeometry([
  new THREE.Vector2(0,0),new THREE.Vector2(.28,.07),new THREE.Vector2(.4,.27),
  new THREE.Vector2(.31,.58),new THREE.Vector2(.12,.84),new THREE.Vector2(0,1),
],10);
const materials = new Map(), planetGeometries = new Map();
const palettes = {
  moss:{grass:0x65cb4e,light:0xa0e865,soil:0xdc9760,trim:0xffedbd,accent:0x51ddd2},
  wind:{grass:0x7bd8b0,light:0xc1efa4,soil:0xd79b6d,trim:0xffecc6,accent:0x65dbed},
  crystal:{grass:0x9ac3ec,light:0xc4ddfa,soil:0x9a8dbb,trim:0xe9e6ff,accent:0x7bf2e0},
  tide:{grass:0x65d0a6,light:0xb8ecc2,soil:0xdaaf83,trim:0xfff1ce,accent:0x63e7e8},
  forge:{grass:0xabbf82,light:0xd5db99,soil:0xc98468,trim:0xffdeb0,accent:0xffc85a},
  core:{grass:0x95d7bd,light:0xcdf2c5,soil:0x9da9c2,trim:0xf9f3dc,accent:0x8ee7ee},
};
function mat(color,metalness=0,emissive=0){
  const key=`${color}:${metalness}:${emissive}`;
  if(!materials.has(key))materials.set(key,new THREE.MeshStandardMaterial({color,metalness,roughness:metalness ? .34 : .69,emissive,emissiveIntensity:emissive ? .6 : 0}));
  return materials.get(key);
}
function mesh(parent,geometry,color,x,y,z,sx=1,sy=sx,sz=sx,options={}){
  const m=new THREE.Mesh(geometry,mat(color,options.metalness||0,options.emissive||0));
  m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=options.shadow!==false;m.receiveShadow=true;
  m.userData.collision=options.collision||'ornamental';parent.add(m);return m;
}
const ball=(p,c,x,y,z,sx,sy=sx,sz=sx,o={})=>mesh(p,sphere,c,x,y,z,sx,sy,sz,o);
const soft=(p,c,x,y,z,sx,sy,sz,o={})=>mesh(p,round,c,x,y,z,sx,sy,sz,o);
function group(parent,x=0,y=0,z=0,name=''){const g=new THREE.Group();g.position.set(x,y,z);g.name=name;parent.add(g);return g;}
function tube(points,radius=.02){return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),20,radius,8,false);}
function band(parent,color,x,y,z,radius,sx=1,sy=1,sz=1){const m=mesh(parent,torus,color,x,y,z,radius*sx,radius*sy,radius*sz,{metalness:.15});return m;}

// Batch only static direct children. Named animation pivots and dynamic sparks
// retain their identity. The scene owner must dispose every InstancedMesh too.
function batchDirect(parent){
  const batches=new Map();
  for(const child of [...parent.children])if(child.isMesh&&!child.isInstancedMesh&&!child.userData.dynamic){
    const key=`${child.geometry.uuid}:${child.material.uuid}`;
    if(!batches.has(key))batches.set(key,[]);batches.get(key).push(child);
  }
  for(const items of batches.values())if(items.length>1){
    const inst=new THREE.InstancedMesh(items[0].geometry,items[0].material,items.length);
    items.forEach((item,i)=>{item.updateMatrix();inst.setMatrixAt(i,item.matrix);parent.remove(item);});
    inst.instanceMatrix.needsUpdate=true;inst.castShadow=true;inst.receiveShadow=true;
    inst.userData.collision='ornamental';parent.add(inst);
  }
}
function batchScenery(root){
  root.updateMatrixWorld(true);const batches=new Map();
  root.traverse(child=>{if(child.isMesh&&!child.isInstancedMesh){const key=`${child.geometry.uuid}:${child.material.uuid}`;if(!batches.has(key))batches.set(key,[]);batches.get(key).push(child);}});
  for(const items of batches.values())if(items.length>1){
    const inst=new THREE.InstancedMesh(items[0].geometry,items[0].material,items.length);
    items.forEach((item,i)=>{inst.setMatrixAt(i,item.matrixWorld);item.parent.remove(item);});
    inst.instanceMatrix.needsUpdate=true;inst.castShadow=true;inst.receiveShadow=true;
    inst.userData.collision='ornamental';root.add(inst);
  }
}

const smileGeometry=tube([[-.095,-.025,.302],[-.06,-.065,.319],[0,-.075,.326],[.06,-.065,.319],[.095,-.025,.302]],.008);
const browGeometry=tube([[-.065,0,0],[-.025,.032,0],[.025,.027,0],[.057,-.005,0]],.014);
const capeGeometry=(()=>{
  const s=new THREE.Shape();s.moveTo(-.23,0);s.quadraticCurveTo(0,.055,.23,0);
  s.bezierCurveTo(.3,-.18,.47,-.46,.36,-.59);s.quadraticCurveTo(.05,-.5,-.34,-.6);
  s.bezierCurveTo(-.47,-.47,-.3,-.18,-.23,0);
  const g=new THREE.ExtrudeGeometry(s,{depth:.025,bevelEnabled:true,bevelSize:.018,bevelThickness:.012,bevelSegments:2,curveSegments:12});
  const a=g.attributes.position;for(let i=0;i<a.count;i++){const y=a.getY(i),x=a.getX(i);a.setZ(i,a.getZ(i)-Math.sin(Math.min(1,Math.max(0,-y/.62))*Math.PI)*.16-x*x*.15);}
  g.computeVertexNormals();return g;
})();
const capeTrim=tube([[-.34,-.6,-.025],[-.16,-.565,-.04],[.05,-.55,-.045],[.24,-.56,-.025],[.36,-.59,-.025]],.014);
const tailGeometry=tube([[0,0,0],[.12,-.04,-.2],[.3,0,-.27],[.43,.14,-.21],[.44,.24,-.13]],.035);

export function createLion(){
  const hero=new THREE.Group();hero.name='Boom_Mane_Leo_orbit_repairer';
  const body=group(hero,0,.53,0,'body');
  ball(body,0xf6b52f,0,.025,0,.245,.32,.18);
  ball(body,0xffd677,0,.025,.137,.16,.22,.06);
  ball(body,0xffe8ad,0,.19,.13,.13,.12,.05);
  const head=group(body,0,.4,.035,'head');
  const mane=group(head,0,.015,-.065,'explosive_afro');
  // A deep orange core and rear-hemisphere curls give the afro volume from
  // behind. All added volume stays behind the face plane and clear of muzzle.
  const maneColors=[0xe95710,0xf8750b,0xff9b12];
  ball(mane,maneColors[0],0,.045,-.145,.375,.355,.285);
  for(let i=0;i<16;i++){
    const depth=(i+.5)/16,r=Math.sqrt(1-depth*depth),a=i*2.39996323;
    const puff=ball(mane,maneColors[(i+1)%3],Math.cos(a)*r*.31,.06+Math.sin(a)*r*.3,
      -.115-depth*.25,.135+(i%3)*.012,.145+(i%2)*.012,.15);
    puff.rotation.z=a*.17;
  }
  // Asymmetric clustered firework crown, not a shallow uniform braid ring.
  for(let i=0;i<22;i++){
    const a=i/22*Math.PI*2,flare=1+Math.sin(i*2.6)*.09;
    const x=Math.cos(a)*.32*flare,y=Math.sin(a)*.305+.045;
    const puff=ball(mane,maneColors[i%3],x,y,-.025+(i%3)*.018,.145+(i%4)*.011,.15+(i%3)*.009,.135);
    puff.rotation.z=a*.2;
  }
  for(let i=0;i<7;i++){
    const x=(i-3)*.097,y=.27+Math.sin((i/6)*Math.PI)*.04;
    ball(mane,maneColors[(i+1)%3],x,y,-.055,.14,.15,.14);
  }
  batchDirect(mane);
  ball(head,0xffc04b,0,.015,.075,.265,.265,.205);
  // Recessed warm ears and a projecting double muzzle preserve Leo's face.
  for(const side of [-1,1]){
    ball(head,0xf9bc36,side*.238,.115,.067,.10,.115,.07);
    ball(head,0x9e5b20,side*.244,.12,.125,.062,.072,.024);
    ball(head,0xffe5a4,side*.065,-.09,.262,.102,.085,.075);
    ball(head,0xfff5dc,side*.105,.054,.247,.079,.105,.027);
    ball(head,0xb76b24,side*.105,.049,.274,.047,.065,.013);
    ball(head,0x3d251b,side*.105,.05,.285,.025,.047,.009);
    ball(head,0xffffff,side*.105-.014,.082,.294,.016,.021,.005);
    ball(head,0xffeec2,side*.105+.012,.025,.295,.007,.009,.005);
    const brow=mesh(head,browGeometry,0x6f3c1a,side*.105,.178,.255);
    if(side>0)brow.scale.x=-1;
  }
  ball(head,0xffe5a4,0,-.152,.22,.123,.055,.075);
  ball(head,0x81421f,0,-.025,.325,.066,.039,.034);
  mesh(head,smileGeometry,0x81421f,0,-.055,.01);
  // Raised golden forelock with three flame-like tips.
  for(let i=0;i<3;i++){
    const tuft=mesh(head,sparkGeometry,i===1?0xffbd32:0xf59b1e,(i-1)*.065,.195,.13,.105,.20+i*.018,.085);
    tuft.rotation.z=(1-i)*.3;
  }
  batchDirect(head);
  const sparks=[];
  for(let i=0;i<6;i++){
    const a=i/6*Math.PI*2+.15;
    const spark=mesh(mane,sparkGeometry,0xffe27b,Math.cos(a)*.45,Math.sin(a)*.42+.06,.025,.035,.09,.035,{emissive:0x9c4f00});
    spark.rotation.z=a-Math.PI/2;spark.userData.dynamic=true;spark.userData.basePosition=spark.position.clone();sparks.push(spark);
  }
  const cape=group(body,0,.23,-.17,'short_red_cape');
  mesh(cape,capeGeometry,0xd94e25,0,0,0);mesh(cape,capeTrim,0xffcf58,0,0,0);
  const collar=band(body,0xd75224,0,.225,0,.235,1,.82,1);collar.rotation.x=Math.PI/2;
  ball(body,0xffd05b,0,.23,.20,.081,.081,.027,{metalness:.35});
  ball(body,0xc47b20,0,.23,.229,.047,.047,.008,{metalness:.15});
  ball(body,0xffe9a0,0,.23,.24,.021,.021,.006);
  const legs=[];
  for(const side of [-1,1]){
    const leg=group(hero,side*.125,.31,.005,`leg_${side}`);
    ball(leg,0xefaa2f,0,-.1,0,.095,.17,.105);
    ball(leg,0xffd47a,0,-.245,.068,.115,.065,.15);
    const toes=[];for(let i=-1;i<=1;i++)toes.push(ball(leg,0xffe1a0,i*.055,-.25,.168,.028,.035,.041));
    batchDirect(leg);legs.push(leg);
  }
  const arms=[];
  for(const side of [-1,1]){
    const arm=group(body,side*.25,.12,.018,`arm_${side}`);
    arm.rotation.z=-side*.15;
    ball(arm,0xf3ad2d,0,-.075,.015,.09,.155,.095);
    if(side<0)ball(arm,0xffcc61,0,-.18,.05,.1,.105,.105);
    arms.push(arm);
  }
  const glove=group(arms[1],0,-.15,.035,'cyan_repair_glove');
  soft(glove,0x2d9da9,0,0,0,.20,.18,.20,{metalness:.3});
  soft(glove,0x6fe9dc,0,-.005,.115,.22,.19,.07,{metalness:.15});
  ball(glove,0xc3fff0,0,0,.163,.057,.057,.018,{emissive:0x348f77});
  const cuff=band(glove,0xffd368,0,.095,0,.105);cuff.rotation.x=Math.PI/2;
  const tail=group(hero,0,.4,-.12,'flared_tail');mesh(tail,tailGeometry,0xeaa42f,0,0,0);
  const tailFlare=group(tail,.44,.22,-.13,'tail_flare');tailFlare.rotation.z=-.28;
  for(let i=0;i<3;i++){
    const tuft=mesh(tailFlare,sparkGeometry,i%2?0xffcf43:0xf29917,(i-1)*.027,0,0,.10,.17+i*.025,.075);tuft.rotation.z=(1-i)*.3;
  }
  batchDirect(tailFlare);batchDirect(body);
  hero.userData.parts={body,head,legs,arms,tail,glove,mane,cape,sparks,fingers:[],armor:[],backpack:null};
  hero.userData.dimensions={height:1.43,decorativeSparkHeight:1.5,footOrigin:true,forward:'+Z'};
  hero.userData.character='WeightPlay Boom Mane Leo';
  return hero;
}
// Internal compatibility only; the returned mesh and public identity are Leo.
export const createPangolin=createLion;

function onSurface(parent,radius,direction,name){
  const g=new THREE.Group();g.name=name;const up=new THREE.Vector3(...direction).normalize();
  g.position.copy(up).multiplyScalar(radius);g.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),up);
  g.userData.collision='ornamental';parent.add(g);return g;
}
function tree(parent,scale=1){
  const root=group(parent);root.scale.setScalar(scale);
  mesh(root,cylinder,0xb97a45,0,.58,0,.14,1.16,.14);
  ball(root,0x32a95f,0,1.25,0,.6,.54,.55);
  ball(root,0x56c956,-.27,1.53,.035,.44,.39,.42);
  ball(root,0x8ade55,.22,1.58,.015,.42,.4,.4);
  ball(root,0xa8ec72,.03,1.82,.035,.28,.24,.28);
  for(const [x,y,z] of [[-.45,1.4,.2],[.29,1.6,.32],[.06,1.9,.15]])ball(root,0xffce5a,x,y,z,.075);
  return root;
}
function workshop(parent,scale){
  const root=group(parent);root.scale.setScalar(scale);
  mesh(root,cylinder,0xffdda4,0,.65,0,.77,1.3,.67);
  soft(root,0xffefca,0,.12,0,1.6,.24,1.45);
  ball(root,0xec8550,0,1.26,0,.95,.35,.86);
  ball(root,0xf1a460,0,1.48,0,.7,.2,.65);
  soft(root,0x449ba6,-.21,.46,.655,.45,.86,.12);
  const window=band(root,0xf7b957,.38,.79,.638,.20,1,1,.45);
  ball(root,0x8be8e5,.38,.79,.65,.165,.165,.035,{emissive:0x245a60});
  soft(root,0xffdf8b,-.24,.97,.71,.72,.12,.4);
  mesh(root,cylinder,0x50b6bb,.39,1.75,-.15,.105,.65,.105);
  ball(root,0xffe4ad,.39,2.08,-.15,.17,.09,.17);
  return root;
}
function getPlanetGeometry(theme){
  if(planetGeometries.has(theme))return planetGeometries.get(theme);
  const p=palettes[theme]||palettes.moss,g=new THREE.SphereGeometry(1,96,64),colors=[];
  const grass=new THREE.Color(p.grass),light=new THREE.Color(p.light),soil=new THREE.Color(p.soil),cream=new THREE.Color(p.trim);
  const point=new THREE.Vector3();
  for(let i=0;i<g.attributes.position.count;i++){
    point.fromBufferAttribute(g.attributes.position,i);let color;
    if(point.y>-.19){const shade=Math.min(1,Math.max(0,(point.y+.19)/1.19));color=grass.clone().lerp(light,shade*.2);}
    else if((point.y<-.32&&point.y>-.39)||(point.y<-.7&&point.y>-.76))color=cream;
    else color=soil.clone().lerp(cream,Math.max(0,-point.y-.8));
    colors.push(color.r,color.g,color.b);
  }
  g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));planetGeometries.set(theme,g);return g;
}
export function createPlanet(field){
  const root=new THREE.Group();root.name=`rounded_workshop_planet_${field.id||'moss'}`;
  const radius=Number.isFinite(field.radius)?field.radius:6,theme=palettes[field.theme]?field.theme:'moss';
  const key=`planet:${theme}`;if(!materials.has(key))materials.set(key,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.84}));
  const surface=new THREE.Mesh(getPlanetGeometry(theme),materials.get(key));surface.scale.setScalar(radius);surface.receiveShadow=true;
  surface.userData.collision='sphere';surface.userData.radius=radius;root.add(surface);
  const scale=Math.min(1.2,radius/8.5);
  for(const [i,d] of [[0,[-.65,.55,-.5]],[1,[.72,.18,-.65]],[2,[-.3,-.85,.4]]])tree(onSurface(root,radius,d,`ornamental_tree_${i}`),scale*(i===1?.8:1));
  workshop(onSurface(root,radius,[.55,-.35,.76],'ornamental_workshop'),Math.min(1,radius/7.5));
  // Tiny flowers never resemble an alternate solid landing surface. Their
  // deterministic positions deliberately avoid the main x=0 training meridian.
  const flowerColors=[0xffe6a0,0xff95ad,0xa9e6ff];
  for(let i=0;i<18;i++){
    const a=i*2.39996323,y=.12+(i%7)/8,rad=Math.sqrt(1-y*y),normal=[Math.cos(a)*rad,y,Math.sin(a)*rad];
    if(Math.abs(normal[0])<.14)continue;
    const flower=onSurface(root,radius,normal,`ornamental_flower_${i}`);flower.scale.setScalar(Math.min(1,radius/8));
    const c=flowerColors[i%3];
    for(let j=0;j<4;j++){const r=j*Math.PI/2;mesh(flower,flowerSphere,c,Math.cos(r)*.065,.07,Math.sin(r)*.065,.061,.035,.061);}
    mesh(flower,flowerSphere,0xffc95a,0,.1,0,.045,.035,.045);
  }
  batchScenery(root);
  root.userData.surfaceRadius=radius;
  root.userData.collisionContract='Exact-radius sphere is solid. Trees, workshop, flowers and color bands are ornamental; none claim extra solid ground.';
  return root;
}

export function makeAnchor(){
  const root=new THREE.Group();root.name='curved_fork_diamond_anchor';
  soft(root,0x388fa1,0,.1,0,1,.2,.95,{metalness:.25});
  soft(root,0xffe2a1,0,.24,0,.64,.08,.64,{metalness:.2});
  const gate=group(root,0,1.08,0,'diamond_gate');
  for(const side of [-1,1])for(const half of [-1,1]){
    const arm=soft(gate,0x6df4d6,side*.27,half*.27,0,.12,.73,.15,{emissive:0x247964});arm.rotation.z=-side*half*Math.PI/4;
  }
  for(const side of [-1,1]){
    const path=tube([[side*.43,.25,0],[side*.59,.6,0],[side*.55,.95,0]],.055);
    mesh(root,path,0xffd069,0,0,0);
  }
  const core=ball(gate,0xffecac,0,0,0,.12,.12,.12,{emissive:0x886326});
  batchDirect(gate);root.userData.parts={gate,core};return root;
}
export function makeTerminal(){
  const root=new THREE.Group();root.name='rounded_repair_terminal';
  soft(root,0x318fa1,0,.1,0,.7,.2,.7,{metalness:.25});
  mesh(root,cylinder,0x56b9b4,0,.54,0,.21,.8,.21,{metalness:.15});
  const console=group(root,0,.96,.03,'console');console.rotation.x=-.25;
  soft(console,0xffd589,0,0,0,.76,.14,.5,{metalness:.15});
  const display=soft(console,0x65e5d2,0,.085,-.06,.51,.035,.2,{emissive:0x326d5e});
  for(const side of [-1,1])ball(console,side<0?0xfff1c8:0xf4a46c,side*.18,.09,.145,.07,.035,.055);
  root.userData.parts={console,display};return root;
}
export function makeCheckpoint(){
  const root=new THREE.Group();root.name='rounded_safe_checkpoint';
  const perimeter=band(root,0x77ebc4,0,.035,0,.54);perimeter.rotation.x=Math.PI/2;perimeter.scale.z=.7;
  mesh(root,cylinder,0x3f97a3,-.4,.56,-.35,.045,1.1,.045,{metalness:.2});
  const flag=soft(root,0xffd77d,-.16,1.02,-.35,.48,.26,.065);
  ball(root,0x6bdcc2,-.16,1.02,-.303,.068,.068,.02,{emissive:0x2d6d52});
  root.userData.parts={flag};return root;
}
export function makeArchive(){
  const root=new THREE.Group();root.name='rounded_repair_archive';
  const record=group(root,0,.85,0,'archive_record');
  soft(record,0x308ab5,0,0,0,.44,.56,.13,{metalness:.2});
  soft(record,0xffd882,-.19,0,.01,.07,.61,.18,{metalness:.25});
  soft(record,0xffd882,.17,.22,.035,.16,.09,.17,{metalness:.25});
  for(let i=0;i<3;i++)soft(record,0xc3fff0,.025,.12-i*.12,.082,.23-i*.035,.035,.035,{emissive:0x3c7562});
  batchDirect(record);root.userData.parts={record};return root;
}
export function makeBridge(options={}){
  if(typeof options==='number')options={length:options};
  const length=options.length||4,width=options.width||2.2,root=new THREE.Group();root.name='rounded_ceramic_bridge';
  // Exact unchanged collision contract: top y=0, long axis Z.
  soft(root,0xffe4af,0,-.14,0,width,.28,length,{collision:'authored-platform'});
  for(const side of [-1,1]){
    soft(root,0x459faa,side*(width/2-.055),.08,0,.11,.16,length,{metalness:.2});
    soft(root,0x8bffd3,side*(width/2-.17),.012,0,.06,.025,length-.12,{emissive:0x2c7151});
  }
  for(let z=-length/2+.35;z<length/2;z+=.7)soft(root,0xe9bb76,0,.012,z,width-.42,.025,.045);
  batchDirect(root);root.userData.collision={type:'box',halfExtents:[width/2,.14,length/2],offset:[0,-.14,0]};return root;
}
export function createDrone(){
  const root=new THREE.Group();root.name='KouKou_rounded_three_leaf_tool_drone';
  ball(root,0xffd693,0,0,0,.17,.12,.17);
  ball(root,0x64e5d0,0,.12,0,.083,.035,.083,{emissive:0x255d4d});
  soft(root,0x2b7292,0,-.015,.16,.17,.08,.045);
  ball(root,0xccfff2,0,-.015,.19,.055,.022,.012,{emissive:0x396e60});
  const rotor=group(root,0,.02,0,'tool_leaves');
  for(let i=0;i<3;i++){
    const leaf=group(rotor);leaf.rotation.y=i*Math.PI*2/3;
    soft(leaf,0x4ca9b6,0,0,-.26,.12,.09,.35,{metalness:.25});
    ball(leaf,0xffd994,0,0,-.44,.13,.055,.085,{metalness:.2});
    ball(leaf,0x8df3d2,0,.065,-.42,.065,.018,.045,{emissive:0x34715b});
  }
  root.userData.parts={rotor};return root;
}
