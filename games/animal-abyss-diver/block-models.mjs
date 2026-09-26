/* WeightPlay original Block Animals props and reef. Three r180 (local MIT build).
   Model coordinates: Y up, fish nose -X. No game state or input in this module. */
import * as THREE from '../animal-skyspire-drop/vendor/three/three.module.min.js';
export { THREE };
const C={navy:0x062e46,stone:0x155369,edge:0x287889,moss:0x46aba0,sand:0x93b7a8,gold:0xffc45f,darkGold:0xc88729,cream:0xffecc1,orange:0xf6813c,coral:0xfa698c,teal:0x30b8c0,blue:0x3cdafa,ink:0x122b3c,white:0xf2ffff};
export function library(){
 const geometry=new THREE.BoxGeometry(1,1,1),materials=new Map();
 function material(color,glow=0){const key=color+':'+glow;if(!materials.has(key))materials.set(key,new THREE.MeshStandardMaterial({color,roughness:.53,metalness:color===C.gold?.3:.06,emissive:glow?color:0,emissiveIntensity:glow}));return materials.get(key);}
 function box(parent,x,y,z,w,h,d,color,glow=0){const m=new THREE.Mesh(geometry,material(color,glow));m.position.set(x,y,z);m.scale.set(w,h,d);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 function dispose(){geometry.dispose();for(const m of materials.values())m.dispose();materials.clear();}
 return{box,geometry,materials,dispose};
}
export function fish(lib,shark=false){
 const g=new THREE.Group(),b=(...a)=>lib.box(g,...a),body=shark?C.teal:C.gold,back=shark?0x146782:C.orange;
 b(0,0,0,2.25,1.22,.98,body);b(-.38,.45,0,1.55,.54,.88,body);b(-.7,-.48,0,1.44,.34,.85,C.cream);
 b(-1.25,-.03,0,.45,.81,.86,body);b(-1.49,-.19,0,.13,.12,.57,C.ink);b(-1.22,-.4,0,.5,.16,.6,C.cream);
 for(const s of [-1,1]){
  b(-.87,.2,s*.52,.53,.54,.08,C.cream);b(-.96,.19,s*.57,.27,.32,.045,C.ink);b(-1.0,.3,s*.601,.10,.10,.02,C.white);
  b(-.32,-.07,s*.51,.085,.46,.055,back);b(-.12,-.07,s*.51,.085,.39,.055,back);
  const fin=b(.39,-.39,s*.69,.65,.17,.48,back);fin.rotation.z=s*.14;
  b(.63,.16,s*.501,.22,.23,.022,shark?0x4ce0d1:C.cream);
 }
 b(.1,.78,0,.77,.38,.17,back);b(.32,1.05,0,.35,.3,.15,back);
 if(shark){b(.45,1.26,0,.14,.18,.13,C.teal);b(-1.4,-.34,0,.05,.12,.09,C.white);}
 const tail=new THREE.Group();tail.position.x=1.12;g.add(tail);
 lib.box(tail,.17,0,0,.45,.67,.65,body);lib.box(tail,.54,0,0,.34,.47,.4,back);
 lib.box(tail,.81,0,0,.3,1.43,.17,back);lib.box(tail,1.03,.49,0,.19,.57,.16,body);lib.box(tail,1.03,-.49,0,.19,.57,.16,body);
 g.userData.tail=tail;return g;
}
export function prop(lib,type='relic'){
 const g=new THREE.Group(),b=(...a)=>lib.box(g,...a);
 if(type==='relic'||type==='treasure'||type==='salvage'){
  b(0,-.16,0,1.8,1.12,1.32,0x785642);b(0,.48,0,1.9,.27,1.4,C.gold);b(0,-.72,0,1.93,.14,1.44,C.darkGold);
  for(const x of [-.71,.71]){b(x,-.04,.69,.14,1.13,.1,C.gold);b(x,-.04,-.69,.14,1.13,.1,C.gold);}
  for(const y of [-.52,.21])b(0,y,.677,1.57,.055,.04,0x9c6f49);
  b(0,.01,.78,.38,.46,.16,C.gold);b(0,.04,.879,.12,.17,.03,C.ink);
  const gem=b(0,.94,0,.52,.52,.52,C.blue,.24);gem.rotation.set(.18,.48,.2);
  if(type==='treasure')for(const [x,z]of[[-.59,-.29],[.57,.19],[.27,-.4]])b(x,.77,z,.32,.25,.31,C.gold);
 }else if(type==='oxygen'){
  for(const x of [-.43,.43]){b(x,0,0,.7,1.58,.72,C.teal);b(x,.91,0,.32,.3,.3,C.gold);b(x,-.84,0,.72,.17,.76,C.ink);b(x,.16,.38,.25,.59,.05,C.cream);}
  for(const y of [-.39,.49])b(0,y,0,1.6,.13,.81,C.ink);b(0,1.15,0,1.17,.15,.25,C.gold);
 }else if(type==='sonar'||type==='pulse'||type==='power'){
  b(0,-.18,0,1.48,1.33,.68,C.teal);b(0,-.21,.39,1.15,.94,.13,C.gold);b(0,-.16,.48,.89,.66,.04,C.navy);
  for(let i=0;i<3;i++)b(-.28+i*.27,-.35+i*.14,.52,.15,.19+i*.17,.035,C.blue,.3);
  b(-.39,.72,0,.12,.48,.12,C.ink);b(-.39,1,0,.32,.16,.22,C.gold);b(.41,.59,.1,.25,.15,.28,C.orange);
 }else if(type==='shield'){
  for(let i=0;i<4;i++){const y=.69-i*.44,w=1.69-Math.max(0,i-1)*.39;b(0,y,0,w,.45,.3,C.gold);b(0,y,.17,w-.22,.32,.05,C.teal);}
  b(0,-.7,0,.4,.3,.3,C.darkGold);b(0,.16,.24,.16,1.12,.06,C.cream);b(0,.24,.24,.79,.15,.06,C.cream);
 }else if(type==='current'||type==='surface'){
  for(let k=0;k<3;k++){const row=new THREE.Group();row.position.set((k-1)*.65,(k-1)*.15,0);g.add(row);for(let i=0;i<3;i++)for(const s of [-1,1])lib.box(row,i*.22,s*i*.22,0,.25,.25,.35,k===1?C.cream:C.blue,.12);}
  if(type==='surface')g.rotation.z=Math.PI/2;
 }else if(type==='beacon'){
  b(0,-.59,0,1.7,.35,1.1,C.orange);b(0,-.27,0,1.28,.36,.82,C.cream);b(0,.19,0,.3,.8,.3,C.gold);b(0,.75,0,.7,.39,.64,C.blue,.3);b(0,1,0,.84,.12,.74,C.cream);
 }else if(type==='hazard'||type==='danger'){
  b(0,-.63,0,2,.26,1.45,C.stone);for(const [x,z,h]of[[-.62,-.22,1.05],[0,.23,1.55],[.64,-.12,.86]]){b(x,h/2-.53,z,.49,h,.47,C.coral);b(x,h-.32,z,.24,.4,.23,C.cream);b(x-.14,h/2-.28,z,.52,.18,.48,C.orange);}
 }else{
  b(0,0,0,1.22,1.22,1.22,C.teal,.1);for(const x of [-.67,.67])for(const y of [-.67,.67])b(x,y,.59,.27,.27,.2,C.blue,.3);
  b(0,.19,.63,.45,.17,.07,C.cream);b(.2,-.02,.63,.17,.3,.07,C.cream);b(0,-.35,.64,.17,.17,.07,C.cream);
 }
 return g;
}
export function world(lib){
 const root=new THREE.Group(),b=(...a)=>lib.box(root,...a);
 b(0,-3,0,24,.9,20,C.navy);b(0,-2.63,-3,11,.3,12,0x326f7a);
 for(const side of [-1,1]){
  for(let tier=0;tier<4;tier++)b(side*(5.7+tier*.9),-2.45+tier*.77,-1,3.9,.79,17, tier%2?C.stone:0x205c72);
  for(const z of [-6,-2,2]){
   const x=side*4.5;b(x,-1.96,z,1.5,.4,1.5,C.edge);b(x,-.23,z,.87,3.06,.94,C.stone);b(x,1.42,z,1.48,.33,1.5,C.edge);
   for(let n=0;n<4;n++){b(x,-1.7+n*.74,z+.48,.91,.048,.03,0x3a8990);b(x,-1.4+n*.74,z+.51,.16,.2,.05,C.moss,.08);}
  }
  for(let k=0;k<8;k++){
   const x=side*(3.5+(k%3)*1.06),z=-6+k*1.3,h=.5+(k%4)*.32,c=k%2?C.coral:C.orange;
   b(x,-2.3+h/2,z,.2,h,.25,c);b(x+side*.25,-2.3+h*.65,z,.69,.2,.26,c);b(x+side*.48,-2.3+h*.65+.26,z,.22,.55,.24,c);
   if(k%2===0)b(x-side*.25,-2.3+h*.45+.19,z,.21,.55,.24,0xffa66e);
  }
 }
 for(let i=-3;i<=3;i++)b(i*1.27,2.05,-5,1.2,.61,1.33,i%2?C.edge:C.stone);
 for(let i=0;i<3;i++)b(0,-2.36+i*.18,-4-i*.7,4.6-i*.64,.18,1.9,C.edge);
 for(let i=0;i<20;i++){const x=Math.sin(i*6.29)*8,z=Math.cos(i*8.21)*7;b(x,-2.36,z,.31+(i%3)*.12,.19,.34,i%4?C.edge:C.sand);}
 root.updateMatrixWorld(true);const batches=new Map();root.traverse(o=>{if(o.isMesh){const arr=batches.get(o.material)||[];arr.push(o.matrixWorld.clone());batches.set(o.material,arr);}});
 const group=new THREE.Group();for(const [mat,matrices]of batches){const mesh=new THREE.InstancedMesh(lib.geometry,mat,matrices.length);matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);}
 return group;
}
export function sceneSetup(background=null){
 const scene=new THREE.Scene();if(background!==null){scene.background=new THREE.Color(background);scene.fog=new THREE.Fog(background,15,36);}
 scene.add(new THREE.HemisphereLight(0xcdfaff,0x284559,2.3));
 const key=new THREE.DirectionalLight(0xffe4b5,3.3);key.position.set(-5,8,6);scene.add(key);
 const rim=new THREE.DirectionalLight(0x41d9ff,2.2);rim.position.set(5,2,-4);scene.add(rim);
 return scene;
}
export function fitObject(camera,object,aspect=1,padding=1.3){
 const bounds=new THREE.Box3().setFromObject(object),size=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3());
 const half=Math.max(size.y/2,size.x/(2*aspect),size.z/2)*padding;
 camera.left=-half*aspect;camera.right=half*aspect;camera.top=half;camera.bottom=-half;camera.near=.1;camera.far=100;
 camera.position.copy(center).add(new THREE.Vector3(4,2.8,8));camera.lookAt(center);camera.updateProjectionMatrix();
}
