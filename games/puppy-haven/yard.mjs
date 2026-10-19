import * as THREE from './vendor/three/three.module.min.js';
import {BREEDS,MEAL_SPOTS,DOG_SPOTS} from './simulation.mjs';
const SPAWNS=DOG_SPOTS;

// Every visible dog/prop is authored world geometry. Shared resources live only
// for this renderer and are disposed once when the yard closes.
export class Yard {
 constructor(host,onPick,onLoss){
  this.host=host;this.onPick=onPick;this.dogs=new Map();this.departures=[];this.poops=new Map();this.materials=new Map();this.portraits=new Map();this.abort=new AbortController();
  this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  this.scene=new THREE.Scene();this.scene.background=new THREE.Color(0xd2e4d5);
  this.camera=new THREE.OrthographicCamera(-6,6,6,-6,.1,80);this.camera.position.set(9,12,14);this.camera.lookAt(0,0,0);
  this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});
  this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.15;this.renderer.info.autoReset=false;this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  host.append(this.renderer.domElement);this.renderer.domElement.setAttribute('aria-label','3D dog garden');
  this.box=new THREE.BoxGeometry(1,1,1);this.ray=new THREE.Raycaster();this.point=new THREE.Vector2();
  this.scene.add(new THREE.HemisphereLight(0xfff8df,0x527863,1.65));const sun=new THREE.DirectionalLight(0xffe7ba,3);sun.position.set(-5,12,8);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-6,right:6,top:6,bottom:-6,near:1,far:35});sun.shadow.normalBias=.025;sun.shadow.bias=-.00015;sun.shadow.camera.updateProjectionMatrix();this.sun=sun;this.scene.add(sun);
  this.buildGarden();this.buildGardenDetails();
  // One instanced depth proxy uses the existing box geometry. Six anatomical
  // pieces per resident keep the shadow pass bounded, even at full capacity.
  this.shadowProxyMaterial=new THREE.MeshBasicMaterial({colorWrite:false,depthWrite:false});this.shadowProxy=new THREE.InstancedMesh(this.box,this.shadowProxyMaterial,78);this.shadowProxy.count=0;this.shadowProxy.castShadow=true;this.shadowProxy.frustumCulled=false;this.shadowProxy.instanceMatrix.setUsage(THREE.DynamicDrawUsage);this.scene.add(this.shadowProxy);this.detailMaterial=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.85});this.dogDetails=new THREE.InstancedMesh(this.box,this.detailMaterial,156);this.dogDetails.count=0;this.dogDetails.receiveShadow=true;this.dogDetails.frustumCulled=false;this.dogDetails.instanceMatrix.setUsage(THREE.DynamicDrawUsage);this.scene.add(this.dogDetails);
  this.marker=new THREE.Group();this.scene.add(this.marker);this.marker.position.y=-.055;this.marker.rotation.y=.15;
  this.bowls=new THREE.InstancedMesh(this.box,this.detailMaterial,36);this.bowls.count=0;this.bowls.receiveShadow=true;this.bowls.frustumCulled=false;this.scene.add(this.bowls);this.bowlTransform=new THREE.Object3D();this.bowlColor=new THREE.Color();this.bowlAges=new Map();
  for(const z of [-.46,.46])this.cube(this.marker,0xeabf59,[.96,.008,.045],[0,0,z]);
  for(const x of [-.46,.46])this.cube(this.marker,0xeabf59,[.045,.008,.96],[x,0,0]);
  this.renderer.domElement.addEventListener('click',e=>this.pick(e),{signal:this.abort.signal});
  this.renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();onLoss();},{signal:this.abort.signal});
  this.resize=new ResizeObserver(()=>this.fit());this.resize.observe(host);this.fit();
 }
 material(color){if(!this.materials.has(color))this.materials.set(color,new THREE.MeshStandardMaterial({color,roughness:[0x303b36,0x333c35,0x508eae].includes(color)?.28:.82}));return this.materials.get(color);}
 cube(parent,color,size,pos,rot=0){const m=new THREE.Mesh(this.box,this.material(color));m.scale.set(...size);m.position.set(...pos);m.rotation.z=rot;m.receiveShadow=true;parent.add(m);return m;}
 buildGarden(){
  const s=this.scene;
  this.cube(s,0x90b994,[8.6,.24,6.9],[0,-.18,0]);this.cube(s,0xf2d9ad,[8.85,.18,7.1],[0,-.38,0]);
  // Designed cream stone path, perimeter fence, coral cottage and planters.
  for(let i=0;i<5;i++)this.cube(s,i%2?0xe5d9bd:0xf3e6cf,[.8,.045,.72],[-1.6+i*.8,-.0785,2.6]);
  for(const z of [-3.3,3.3]){
   for(let i=0;i<10;i++)this.cube(s,0xdfc79d,[.13,.7,.13],[-4+i*.89,.28,z]);
   this.cube(s,0xf2d8aa,[8.1,.12,.1],[0,.24,z]);this.cube(s,0xf2d8aa,[8.1,.12,.1],[0,.53,z]);
  }
  for(const x of [-4.15,4.15]){for(let i=0;i<7;i++)this.cube(s,0xdfc79d,[.13,.7,.13],[x,.28,-2.8+i*.94]);this.cube(s,0xf2d8aa,[.1,.12,6.5],[x,.36,0]);}
  const house=new THREE.Group();house.position.set(2.8,0,-2.7);s.add(house);
  this.cube(house,0xcd8068,[1.5,1.1,1.15],[0,.55,0]);this.cube(house,0x805340,[1.8,.16,.85],[-.35,1.24,0],.48);this.cube(house,0x805340,[1.8,.16,.85],[.35,1.24,0],-.48);
  for(const z of [-.28,0,.28]){this.cube(house,0x9c6650,[1.8,.035,.035],[-.396,1.329,z],.48);this.cube(house,0x9c6650,[1.8,.035,.035],[.396,1.329,z],-.48);}
  this.cube(house,0x4c5d53,[.58,.73,.03],[0,.38,.59]);this.cube(house,0xf7dbab,[.12,.87,.12],[-.36,.43,.62]);this.cube(house,0xf7dbab,[.12,.87,.12],[.36,.43,.62]);this.cube(house,0xf7dbab,[.82,.12,.12],[0,.9,.62]);house.traverse(o=>{if(o.isMesh)o.castShadow=true;});
  this.cube(s,0xd4a18d,[1.5,.1,.9],[2.7,-.106,-1.75]);this.cube(s,0xf4dba7,[.8,.08,.55],[-2.9,.04,-2.3]);this.cube(s,0x79bfc0,[.6,.16,.42],[-2.9,.12,-2.3]);this.cube(s,0x9bd7db,[.42,.02,.26],[-2.9,.21,-2.3]);
  for(const x of [-3.6,0,3.65]){this.cube(s,0xcda47c,[.55,.3,.5],[x,.08,-2.9]);this.cube(s,0x528b64,[.65,.55,.58],[x,.46,-2.9]);this.cube(s,0xf7dda3,[.17,.17,.15],[x+.1,.76,-2.8]);}
 }
 buildGardenDetails(){
  // One batch owns the lawn's subtle mown blocks and the planted edge. These
  // low props stay outside resident slots and never take part in picking.
  const shapes=[],add=(color,size,pos)=>shapes.push({color,size,pos});
  const lawn=[0x8db490,0x90b994,0x95bb97,0x8ab28d];
  for(let x=0;x<10;x++)for(let z=0;z<8;z++)add(lawn[(x*3+z*5)%lawn.length],[.78,.001,.75],[-3.78+x*.84,-.0585,-2.95+z*.82]);
  for(const x of [-3.75,3.75])for(const z of [-2,-.8,.5,1.8]){
   for(let k=0;k<3;k++)add(k%2?0x789c68:0x628d60,[.08,.16+k*.025,.08],[x+(k-1)*.1,.02,z+(k%2)*.08]);
   add(0x52865d,[.22,.08,.22],[x,.04,z+.22]);add(0x759e67,[.12,.16,.12],[x,.13,z+.22]);
   for(const [dx,dz]of [[-.08,0],[.08,0],[0,-.08],[0,.08]])add(z<0?0xf0d99c:0xcb8577,[.1,.055,.1],[x+dx,.23,z+.22+dz]);
   add(0xf7e9bf,[.075,.065,.075],[x,.235,z+.22]);
  }
  this.gardenDetailMaterial=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.94});this.gardenDetails=new THREE.InstancedMesh(this.box,this.gardenDetailMaterial,shapes.length);this.gardenDetails.receiveShadow=true;
  const transform=new THREE.Object3D(),color=new THREE.Color();for(let i=0;i<shapes.length;i++){const part=shapes[i];transform.position.set(...part.pos);transform.scale.set(...part.size);transform.updateMatrix();this.gardenDetails.setMatrixAt(i,transform.matrix);this.gardenDetails.setColorAt(i,color.set(part.color));}this.scene.add(this.gardenDetails);
 }

 makeDog(d){
  const b=BREEDS.find(b=>b.id===d.breed),g=new THREE.Group(),body=new THREE.Group(),head=new THREE.Group();g.add(body);body.add(head);
  const low=b.long?.16:.29,bodyLength=b.long?1.02:.78,detailParts=[];const detail=(anchor,color,size,pos,rot=0)=>{const node=new THREE.Object3D();node.position.set(...pos);node.scale.set(...size);node.rotation.z=rot;anchor.add(node);detailParts.push({node,color});};
  const torso=this.cube(body,b.coat,[.57,.48,bodyLength],[0,low+.32,0]);
  this.cube(body,b.spots?0xfaf3e3:b.cream,[.38,.35,.15],[0,low+.28,.43]);
  const legs=[],paws=[];for(const x of [-.2,.2])for(const z of [-bodyLength*.32,bodyLength*.32]){
   const joint=new THREE.Group();joint.position.set(x,low,z);body.add(joint);this.cube(joint,b.coat,[.17,low+.15,.19],[0,0,0]);paws.push(this.cube(joint,0xffefdb,[.18,.11,.22],[0,-low/2,.035]));legs.push(joint);
  }
  head.position.set(0,low+.7,.35);
  const skull=this.cube(head,b.coat,[.65,.57,.55],[0,0,0]);
  const muzzle=['husky','labrador'].includes(b.id)?.31:b.id==='beagle'?.28:.25,reach=muzzle-.25;this.cube(head,b.spots?0xfaf3e3:b.cream,[.54,.24,muzzle],[0,-.16,.29+reach/2]);
  this.cube(head,0x303b36,[.2,.12,.1],[0,-.09,.46+reach]);
  this.cube(head,0x623b37,[.16,.035,.035],[0,-.24,.425+reach]);this.cube(head,0xe4a09a,[.1,.1,.035],[0,-.27,.43+reach]);
  for(const x of [-.2,.2]){
   if(b.id==='husky')detail(head,b.cream,[.24,.25,.035],[x,.03,.29]);
   this.cube(head,b.id==='husky'?0x508eae:0x333c35,[.1,.12,.04],[x,.035,.32]);this.cube(head,0xffffff,[.035,.04,.025],[x-.012,.062,.347]);
   const ear=new THREE.Group();ear.position.set(x*1.46,b.ears==='up'?.37:.04,-.02);ear.rotation.z=b.ears==='up'?-Math.sign(x)*.17:Math.sign(x)*.12;head.add(ear);
   this.cube(ear,b.coat,[.18,b.ears==='up'?.33:.44,.22],[0,0,0]);this.cube(ear,b.ears==='up'?0xe6a696:0x7e573b,[.1,.2,.035],[0,0,.12]);
  }
  for(const x of [-1,1]){detail(head,b.id==='husky'?b.coat:(b.spots?0x343b44:b.cream),[.14,.045,.045],[x*.2,.15,.325],-x*.07);detail(head,b.spots?0xfaf3e3:b.cream,[.13,.17,.15],[x*.27,-.12,.22]);detail(body,b.spots?0xfaf3e3:b.cream,[.025,.12,.5],[x*.289,low+.15,-.04]);}
  if(['corgi','beagle','shorgi'].includes(b.id))detail(head,0xfff2d8,[.12,.28,.035],[0,.015,.295]);else if(b.id==='husky')detail(head,b.cream,[.1,.31,.035],[0,.035,.295]);
  for(const i of [1,3])detail(legs[i],b.spots?0xfaf3e3:b.cream,[.18,.08,.19],[0,-low/2+.08,.025]);
  this.cube(body,d.sex==='F'?0xcb7e89:0x79aaa9,[.59,.08,.16],[0,low+.55,.31]);
  const tail=new THREE.Group();tail.position.set(0,low+.48,-bodyLength*.54);body.add(tail);if(['labrador','dalmatian'].includes(b.id)){this.cube(tail,b.coat,[.14,.15,.42],[0,.05,-.16]);this.cube(tail,b.cream,[.12,.12,.18],[0,.08,-.43]);}else{this.cube(tail,b.coat,[b.id==='husky'?.22:.16,b.long?.2:.28,.25],[0,.08,-.06],-.1);this.cube(tail,b.cream,[b.id==='husky'?.23:.17,.13,.2],[0,b.long?.19:.25,-.12]);if(b.id==='shiba')detail(tail,b.cream,[.12,.1,.14],[.1,.24,-.02]);}
  if(b.spots)for(const [x,y,z] of [[.29,.55,0],[-.29,.55,-.2],[.1,.74,-.2],[-.2,.76,.2]].slice(0,b.saddle?3:4))detail(body,0x41494a,[.08,.14,.18],[x,y,z]);
  if(b.saddle)detail(body,0x4c5147,[.58,.12,.48],[0,low+.58,-.15]);
  const occupied=new Set([...this.dogs.values()].map(o=>o.slot));const slot=Math.max(0,SPAWNS.findIndex((_,i)=>!occupied.has(i))),home=SPAWNS[slot],baseY=.055-low/2;g.position.set(home[0],-.06,home[1]);body.position.y=baseY;g.rotation.y=.15;this.scene.add(g);
  const obj={g,body,head,tail,legs,paws,shadowParts:[torso,skull,...paws],detailParts,id:d.id,slot,home,baseY,phase:d.id*1.9,effect:0,enterT:0,visualScale:d.age==='puppy'?.68+d.growth*.0067:1.35};g.traverse(o=>{o.userData.dog=d.id;});this.dogs.set(d.id,obj);return obj;
 }
 fillDetails(mesh,objects){
  const signature=objects.map(o=>o.id??'departure').join(','),recolor=mesh.userData.signature!==signature;let count=0;const color=new THREE.Color();
  for(const object of objects)for(const part of object.detailParts){if(count>=156)throw new Error('Dog detail instance bound exceeded');mesh.setMatrixAt(count,part.node.matrixWorld);if(recolor)mesh.setColorAt(count,color.set(part.color));count++;}
  mesh.count=count;mesh.instanceMatrix.needsUpdate=true;if(recolor&&mesh.instanceColor)mesh.instanceColor.needsUpdate=true;mesh.userData.signature=signature;
 }

 fit(){if(this.disposed)return;const {width:w,height:h}=this.host.getBoundingClientRect();if(w<1||h<1)return;this.renderer.setSize(w,h,false);const aspect=w/h,half=Math.max(4.7,5.9/aspect);this.camera.left=-half*aspect;this.camera.right=half*aspect;this.camera.top=half;this.camera.bottom=-half;this.camera.updateProjectionMatrix();}
 pick(e){const rect=this.renderer.domElement.getBoundingClientRect();this.point.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);this.ray.setFromCamera(this.point,this.camera);const hits=this.ray.intersectObjects([...this.dogs.values()].map(d=>d.g).concat([...this.poops.values()]),true);for(const hit of hits){if(hit.object.userData.dog){this.onPick('dog',hit.object.userData.dog);return;}if(hit.object.userData.poop){this.onPick('poop',hit.object.userData.poop);return;}}}
 effect(id,type='pet'){const dog=this.dogs.get(id);if(dog){dog.effect=.7;dog.action=type;}}
 foodPortrait(grade){
  const key=`food-${grade}`;if(this.portraits.has(key))return this.portraits.get(key);
  const scene=new THREE.Scene();scene.background=new THREE.Color(0xd2e4d5);
  scene.add(new THREE.HemisphereLight(0xfff8df,0x527863,3));const light=new THREE.DirectionalLight(0xffe7ba,3);light.position.set(-3,5,4);scene.add(light);
  const bowl=new THREE.Group();scene.add(bowl);const color=[0x759999,0xc99b5d,0xa36e62][grade];
  this.cube(bowl,color,[1.2,.16,.9],[0,.08,0]);this.cube(bowl,0x526b5b,[.94,.04,.64],[0,.18,0]);
  for(const z of [-.4,.4])this.cube(bowl,color,[1.2,.25,.1],[0,.25,z]);for(const x of [-.55,.55])this.cube(bowl,color,[.1,.25,.72],[x,.25,0]);
  // Three grades have visibly different contents, not just recoloured bowls.
  for(let x=0;x<4;x++)for(let z=0;z<3;z++)this.cube(bowl,grade===0?0x8d5b36:grade===1?(z%2?0xd0a36b:0x865031):((x+z)%3===0?0x70934e:(x+z)%3===1?0xd68e63:0xe3c595),[.17,.12+((x+z)%2)*.035,.15],[-.32+x*.21,.24,-.23+z*.21],(x-z)*.12);
  if(grade===1)for(const x of [-.25,.22])this.cube(bowl,0xe8cf93,[.17,.08,.23],[x,.36,.04],.2);
  if(grade===2)for(const x of [-.3,.08,.32])this.cube(bowl,0x527c45,[.14,.08,.16],[x,.35,-.15],-.15);
  const camera=new THREE.OrthographicCamera(-.85,.85,.85,-.85,.1,20);camera.position.set(1.6,2.2,2.8);camera.lookAt(0,.15,0);camera.updateProjectionMatrix();
  this.renderer.setSize(128,128,false);this.renderer.info.reset();this.renderer.render(scene,camera);const url=this.renderer.domElement.toDataURL('image/png');this.portraits.set(key,url);scene.clear();this.fit();return url;
 }
 portrait(breed){
  if(this.portraits.has(breed))return this.portraits.get(breed);
  const id=-1,obj=this.makeDog({id,breed,sex:'F'});this.scene.remove(obj.g);this.dogs.delete(id);obj.g.position.set(0,0,0);
  const scene=new THREE.Scene();scene.background=new THREE.Color(0xd2e4d5);scene.add(obj.g);scene.add(new THREE.HemisphereLight(0xfff8df,0x527863,3));
  const light=new THREE.DirectionalLight(0xffe7ba,3);light.position.set(-3,5,4);scene.add(light);
  const camera=new THREE.OrthographicCamera(-1.05,1.05,1.05,-1.05,.1,20);camera.position.set(2.6,1.8,3);camera.lookAt(0,.6,0);camera.updateProjectionMatrix();
  const details=new THREE.InstancedMesh(this.box,this.detailMaterial,156);scene.add(details);scene.updateMatrixWorld(true);this.fillDetails(details,[obj]);this.renderer.setSize(128,128,false);this.renderer.info.reset();this.renderer.render(scene,camera);const url=this.renderer.domElement.toDataURL('image/png');this.portraits.set(breed,url);scene.clear();details.dispose();this.fit();return url;
 }
 render(s,dt,visualDt=dt,renderFrame=true){
  const active=new Set(s.dogs.map(d=>d.id));
  for(const [id,o]of this.dogs)if(!active.has(id)){this.dogs.delete(id);for(const prior of this.departures)this.scene.remove(prior.g);this.departures.length=0;this.departures.push({g:o.g,shadowParts:o.shadowParts,detailParts:o.detailParts,left:.22});}
  for(let i=this.departures.length-1;i>=0;i--){const o=this.departures[i];o.left-=visualDt;o.g.scale.multiplyScalar(this.reduced?.2:Math.max(.1,1-visualDt*12));if(o.left<=0){this.scene.remove(o.g);this.departures.splice(i,1);}}
  for(const d of s.dogs){const o=this.dogs.get(d.id)||this.makeDog(d);o.effect=Math.max(0,o.effect-visualDt);const t=s.clock+o.phase;
   o.enterT=Math.min(.22,o.enterT+visualDt);const scale=d.age==='puppy'?.68+d.growth*.0067:1.35;o.visualScale=this.reduced?scale:o.visualScale+(scale-o.visualScale)*Math.min(1,visualDt/.15);o.g.scale.setScalar(o.visualScale*(this.reduced?1:Math.sin(o.enterT/.22*Math.PI/2)));
   const moving=['walk','seek'].includes(d.activity);
   // Essential travel follows authoritative saved positions even in reduced
   // motion; decorative bounce/wag is optional. No render callback feeds dogs.
   const follow=Math.min(1,visualDt*14);o.g.position.x+=(d.x-o.g.position.x)*follow;o.g.position.z+=(d.z-o.g.position.z)*follow;
   let turn=d.heading-o.g.rotation.y;turn=Math.atan2(Math.sin(turn),Math.cos(turn));o.g.rotation.y+=turn*Math.min(1,visualDt*7);
   o.head.rotation.x=d.activity==='eat'?.35+(this.reduced?0:Math.sin(t*9)*.06):this.reduced?0:o.action==='feed'&&o.effect?Math.sin(o.effect/.7*Math.PI)*.28:0;
   o.tail.rotation.z=this.reduced?0:Math.sin(t*8)*(o.effect?.6:.22);o.head.rotation.z=this.reduced?0:Math.sin(t*1.2)*.035;o.body.position.y=o.baseY+(this.reduced?0:Math.sin(t*3)*.012+(o.effect?Math.sin(o.effect/.7*Math.PI)*.16:0));
   for(let i=0;i<o.legs.length;i++)o.legs[i].rotation.x=moving&&!this.reduced?Math.sin(t*7+(i%2)*Math.PI)*.22:0;
  }
  let bowlCount=0;const liveBowls=new Set(s.bowls.map(b=>b.id));for(const id of this.bowlAges.keys())if(!liveBowls.has(id))this.bowlAges.delete(id);
  for(const bowl of s.bowls){const age=Math.min(.22,(this.bowlAges.get(bowl.id)||0)+visualDt);this.bowlAges.set(bowl.id,age);const eater=s.dogs.find(d=>d.foodId===bowl.id&&d.activity==='eat'),exit=eater?Math.min(1,(3-eater.eatTime)/.22):1,k=this.reduced?1:Math.max(.01,Math.min(age/.22,exit)),[x,z]=MEAL_SPOTS[bowl.spot],color=[0xb7824d,0x72958a,0xd7ac61][bowl.grade];
   for(const [size,pos,tint]of [[[.64,.08,.64],[0,.015,0],color],[[.08,.14,.64],[-.28,.1,0],color],[[.08,.14,.64],[.28,.1,0],color],[[.48,.14,.08],[0,.1,-.28],color],[[.48,.14,.08],[0,.1,.28],color],[[.44,.07,.44],[0,.105,0],[0x87603d,0xc99457,0xb6754e][bowl.grade]]]){this.bowlTransform.position.set(x+pos[0]*k,-.04+pos[1]*k,z+pos[2]*k);this.bowlTransform.scale.set(...size.map(n=>n*k));this.bowlTransform.updateMatrix();this.bowls.setMatrixAt(bowlCount,this.bowlTransform.matrix);this.bowls.setColorAt(bowlCount++,this.bowlColor.set(tint));}
  }this.bowls.count=bowlCount;this.bowls.instanceMatrix.needsUpdate=true;if(this.bowls.instanceColor)this.bowls.instanceColor.needsUpdate=true;
  const live=new Set(s.poops.map(p=>p.id));for(const [id,g]of this.poops)if(!live.has(id)){g.userData.exit=(g.userData.exit||0)+visualDt;g.scale.setScalar(Math.max(.001,1-g.userData.exit/(this.reduced?.1:.22)));if(g.userData.exit>=(this.reduced?.1:.22)){this.scene.remove(g);this.poops.delete(id);}}
  for(const p of s.poops)if(!this.poops.has(p.id)){const g=new THREE.Group();g.position.set(p.x,.02,p.z);this.cube(g,0x79604a,[.32,.13,.28],[0,.06,0]);this.cube(g,0x896b50,[.23,.12,.2],[.01,.16,0]);g.userData.enter=0;g.scale.setScalar(.001);g.traverse(o=>{o.userData.poop=p.id;});this.scene.add(g);this.poops.set(p.id,g);}
  for(const [id,g]of this.poops)if(live.has(id)){g.userData.enter=Math.min(.18,g.userData.enter+visualDt);g.scale.setScalar(this.reduced?1:Math.max(.001,Math.sin(g.userData.enter/.18*Math.PI/2)));g.children[1].material=this.material(this.reduced&&g.userData.enter<.12?0xb79b73:0x896b50);}
  const selected=this.dogs.get(s.selected);if(selected){const k=this.reduced?1:Math.min(1,visualDt/.09);this.marker.position.x+=(selected.g.position.x-this.marker.position.x)*k;this.marker.position.z+=(selected.g.position.z-this.marker.position.z)*k;}
  this.scene.updateMatrixWorld(true);let shadowCount=0;for(const dog of [...this.dogs.values(),...this.departures])for(const part of dog.shadowParts)this.shadowProxy.setMatrixAt(shadowCount++,part.matrixWorld);this.shadowProxy.count=shadowCount;this.shadowProxy.instanceMatrix.needsUpdate=true;this.fillDetails(this.dogDetails,[...this.dogs.values(),...this.departures]);
  if(renderFrame){this.renderer.info.reset();this.renderer.render(this.scene,this.camera);this.lastFrame={calls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles};}
 }
 stats(){const r=this.renderer.info;return {revision:THREE.REVISION,calls:this.lastFrame?.calls||0,triangles:this.lastFrame?.triangles||0,geometries:r.memory.geometries,textures:r.memory.textures,shadowInstances:this.shadowProxy.count,detailInstances:this.dogDetails.count,shadowMapSize:this.sun.shadow.mapSize.x,portraitCache:this.portraits.size,bowls:this.bowlAges.size,bowlInstances:this.bowls.count,departures:this.departures.length,droppings:this.poops.size,dogs:this.dogs.size,slots:[...this.dogs.values()].map(d=>({id:d.id,slot:d.slot})),pawClearance:[...this.dogs.values()].map(d=>Math.max(...d.paws.map(p=>Math.abs(new THREE.Box3().setFromObject(p).min.y+.06))))};}
 dispose(){if(this.disposed)return;this.disposed=true;this.abort.abort();this.resize.disconnect();this.renderer.setAnimationLoop(null);this.sun.shadow.dispose();this.bowls.dispose();this.bowlAges.clear();this.shadowProxy.dispose();this.shadowProxyMaterial.dispose();this.dogDetails.dispose();this.detailMaterial.dispose();this.gardenDetails.dispose();this.gardenDetailMaterial.dispose();this.box.dispose();for(const m of this.materials.values())m.dispose();this.renderer.dispose();this.renderer.forceContextLoss();this.renderer.domElement.remove();this.dogs.clear();this.departures.length=0;this.poops.clear();this.materials.clear();this.portraits.clear();}
}
