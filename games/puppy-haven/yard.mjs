import * as THREE from './vendor/three/three.module.min.js';
import {BREEDS} from './simulation.mjs';
const SPAWNS=[[-.9,.4],[.9,.4],[-2.7,.4],[2.7,.4],[-.9,2],[.9,2],[-2.7,2],[2.7,2],[-.9,-1.2],[.9,-1.2],[-2.7,-1.2],[2.7,-1.2]];

// Every visible dog/prop is authored world geometry. Shared resources live only
// for this renderer and are disposed once when the yard closes.
export class Yard {
 constructor(host,onPick,onLoss){
  this.host=host;this.onPick=onPick;this.dogs=new Map();this.departures=[];this.poops=new Map();this.materials=new Map();this.portraits=new Map();this.abort=new AbortController();
  this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  this.scene=new THREE.Scene();this.scene.background=new THREE.Color(0xd2e4d5);
  this.camera=new THREE.OrthographicCamera(-6,6,6,-6,.1,80);this.camera.position.set(9,12,14);this.camera.lookAt(0,0,0);
  this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});
  this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));this.renderer.outputColorSpace=THREE.SRGBColorSpace;
  host.append(this.renderer.domElement);this.renderer.domElement.setAttribute('aria-label','3D dog garden');
  this.box=new THREE.BoxGeometry(1,1,1);this.ray=new THREE.Raycaster();this.point=new THREE.Vector2();
  this.scene.add(new THREE.HemisphereLight(0xfff8df,0x527863,2.8));const sun=new THREE.DirectionalLight(0xffe7ba,3);sun.position.set(-5,12,8);this.scene.add(sun);
  this.buildGarden();
  this.marker=this.cube(this.scene,0xeabf59,[.9,.035,.9],[0,.025,0]);this.marker.rotation.y=Math.PI/4;
  this.renderer.domElement.addEventListener('click',e=>this.pick(e),{signal:this.abort.signal});
  this.renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();onLoss();},{signal:this.abort.signal});
  this.resize=new ResizeObserver(()=>this.fit());this.resize.observe(host);this.fit();
 }
 material(color){if(!this.materials.has(color))this.materials.set(color,new THREE.MeshStandardMaterial({color,roughness:.86}));return this.materials.get(color);}
 cube(parent,color,size,pos,rot=0){const m=new THREE.Mesh(this.box,this.material(color));m.scale.set(...size);m.position.set(...pos);m.rotation.z=rot;parent.add(m);return m;}
 buildGarden(){
  const s=this.scene;
  this.cube(s,0x90b994,[8.6,.24,6.9],[0,-.18,0]);this.cube(s,0xf2d9ad,[8.85,.18,7.1],[0,-.38,0]);
  // Designed cream stone path, perimeter fence, coral cottage and planters.
  for(let i=0;i<5;i++)this.cube(s,i%2?0xe5d9bd:0xf3e6cf,[.8,.045,.72],[-1.6+i*.8,-.025,2.6]);
  for(const z of [-3.3,3.3]){
   for(let i=0;i<10;i++)this.cube(s,0xdfc79d,[.13,.7,.13],[-4+i*.89,.28,z]);
   this.cube(s,0xf2d8aa,[8.1,.12,.1],[0,.24,z]);this.cube(s,0xf2d8aa,[8.1,.12,.1],[0,.53,z]);
  }
  for(const x of [-4.15,4.15]){for(let i=0;i<7;i++)this.cube(s,0xdfc79d,[.13,.7,.13],[x,.28,-2.8+i*.94]);this.cube(s,0xf2d8aa,[.1,.12,6.5],[x,.36,0]);}
  const house=new THREE.Group();house.position.set(2.8,0,-2.4);s.add(house);
  this.cube(house,0xcd8068,[1.5,1.1,1.15],[0,.55,0]);this.cube(house,0x805340,[1.8,.16,.85],[-.35,1.24,0],.48);this.cube(house,0x805340,[1.8,.16,.85],[.35,1.24,0],-.48);
  this.cube(house,0x4c5d53,[.58,.73,.03],[0,.38,.59]);this.cube(house,0xf7dbab,[.12,.87,.12],[-.36,.43,.62]);this.cube(house,0xf7dbab,[.12,.87,.12],[.36,.43,.62]);this.cube(house,0xf7dbab,[.82,.12,.12],[0,.9,.62]);
  this.cube(s,0xd4a18d,[1.5,.1,.9],[2.7,.02,-.9]);this.cube(s,0xf4dba7,[.8,.08,.55],[-2.9,.04,-2.3]);this.cube(s,0x79bfc0,[.6,.16,.42],[-2.9,.12,-2.3]);this.cube(s,0x9bd7db,[.42,.02,.26],[-2.9,.21,-2.3]);
  for(const x of [-3.6,0,3.65]){this.cube(s,0xcda47c,[.55,.3,.5],[x,.08,-2.9]);this.cube(s,0x528b64,[.65,.55,.58],[x,.46,-2.9]);this.cube(s,0xf7dda3,[.17,.17,.15],[x+.1,.76,-2.8]);}
 }
 makeDog(d){
  const b=BREEDS.find(b=>b.id===d.breed),g=new THREE.Group(),body=new THREE.Group(),head=new THREE.Group();g.add(body);body.add(head);
  const low=b.long?.16:.29,bodyLength=b.long?1.02:.78;
  this.cube(body,b.coat,[.57,.48,bodyLength],[0,low+.32,0]);
  this.cube(body,b.spots?0xfaf3e3:b.cream,[.38,.35,.15],[0,low+.28,.43]);
  const legs=[];for(const x of [-.2,.2])for(const z of [-bodyLength*.32,bodyLength*.32]){
   const joint=new THREE.Group();joint.position.set(x,low,z);body.add(joint);this.cube(joint,b.coat,[.17,low+.15,.19],[0,0,0]);this.cube(joint,0xffefdb,[.18,.11,.22],[0,-low/2,.035]);legs.push(joint);
  }
  head.position.set(0,low+.7,.35);
  this.cube(head,b.coat,[.65,.57,.55],[0,0,0]);
  this.cube(head,b.spots?0xfaf3e3:b.cream,[.54,.24,.25],[0,-.16,.29]);
  this.cube(head,0x303b36,[.2,.12,.1],[0,-.09,.46]);
  this.cube(head,0x623b37,[.16,.035,.035],[0,-.24,.425]);this.cube(head,0xe4a09a,[.1,.1,.035],[0,-.27,.43]);
  for(const x of [-.2,.2]){
   if(b.id==='husky')this.cube(head,b.cream,[.24,.25,.035],[x,.03,.29]);
   this.cube(head,b.id==='husky'?0x508eae:0x333c35,[.1,.12,.04],[x,.035,.32]);this.cube(head,0xffffff,[.035,.04,.025],[x-.012,.062,.347]);
   const ear=new THREE.Group();ear.position.set(x*1.46,b.ears==='up'?.37:.04,-.02);ear.rotation.z=b.ears==='up'?-Math.sign(x)*.17:Math.sign(x)*.12;head.add(ear);
   this.cube(ear,b.coat,[.18,b.ears==='up'?.33:.44,.22],[0,0,0]);this.cube(ear,b.ears==='up'?0xe6a696:0x7e573b,[.1,.2,.035],[0,0,.12]);
  }
  this.cube(body,d.sex==='F'?0xcb7e89:0x79aaa9,[.59,.08,.16],[0,low+.55,.31]);
  const tail=new THREE.Group();tail.position.set(0,low+.48,-bodyLength*.54);body.add(tail);this.cube(tail,b.coat,[.16,.28,.25],[0,.08,-.06],-.1);this.cube(tail,b.cream,[.17,.13,.2],[0,.25,-.12]);
  if(b.spots)for(const [x,y,z] of [[.29,.55,0],[-.29,.55,-.2],[.1,.74,-.2],[-.2,.76,.2]])this.cube(body,0x41494a,[.08,.14,.18],[x,y,z]);
  if(b.saddle)this.cube(body,0x4c5147,[.58,.12,.48],[0,low+.58,-.15]);
  const occupied=new Set([...this.dogs.values()].map(o=>o.slot));const slot=Math.max(0,SPAWNS.findIndex((_,i)=>!occupied.has(i))),home=SPAWNS[slot];g.position.set(home[0],0,home[1]);g.rotation.y=.15;this.scene.add(g);
  const obj={g,body,head,tail,legs,id:d.id,slot,home,phase:d.id*1.9,effect:0};g.traverse(o=>{o.userData.dog=d.id;});this.dogs.set(d.id,obj);return obj;
 }
 fit(){if(this.disposed)return;const {width:w,height:h}=this.host.getBoundingClientRect();if(w<1||h<1)return;this.renderer.setSize(w,h,false);const aspect=w/h,half=Math.max(4.7,5.9/aspect);this.camera.left=-half*aspect;this.camera.right=half*aspect;this.camera.top=half;this.camera.bottom=-half;this.camera.updateProjectionMatrix();}
 pick(e){const rect=this.renderer.domElement.getBoundingClientRect();this.point.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);this.ray.setFromCamera(this.point,this.camera);const hits=this.ray.intersectObjects([...this.dogs.values()].map(d=>d.g).concat([...this.poops.values()]),true);for(const hit of hits){if(hit.object.userData.dog){this.onPick('dog',hit.object.userData.dog);return;}if(hit.object.userData.poop){this.onPick('poop',hit.object.userData.poop);return;}}}
 effect(id){const dog=this.dogs.get(id);if(dog)dog.effect=.7;}
 portrait(breed){
  if(this.portraits.has(breed))return this.portraits.get(breed);
  const id=-1,obj=this.makeDog({id,breed,sex:'F'});this.scene.remove(obj.g);this.dogs.delete(id);obj.g.position.set(0,0,0);
  const scene=new THREE.Scene();scene.background=new THREE.Color(0xd2e4d5);scene.add(obj.g);scene.add(new THREE.HemisphereLight(0xfff8df,0x527863,3));
  const light=new THREE.DirectionalLight(0xffe7ba,3);light.position.set(-3,5,4);scene.add(light);
  const camera=new THREE.OrthographicCamera(-.85,.85,1.35,-.35,.1,20);camera.position.set(1.7,1.2,3);camera.lookAt(0,.5,0);camera.updateProjectionMatrix();
  this.renderer.setSize(128,128,false);this.renderer.render(scene,camera);const url=this.renderer.domElement.toDataURL('image/png');this.portraits.set(breed,url);scene.clear();this.fit();return url;
 }
 render(s,dt,visualDt=dt){
  const active=new Set(s.dogs.map(d=>d.id));
  for(const [id,o]of this.dogs)if(!active.has(id)){this.dogs.delete(id);for(const prior of this.departures)this.scene.remove(prior.g);this.departures.length=0;this.departures.push({g:o.g,left:.22});}
  for(let i=this.departures.length-1;i>=0;i--){const o=this.departures[i];o.left-=visualDt;o.g.scale.multiplyScalar(this.reduced?.2:Math.max(.1,1-visualDt*12));if(o.left<=0){this.scene.remove(o.g);this.departures.splice(i,1);}}
  for(const d of s.dogs){const o=this.dogs.get(d.id)||this.makeDog(d);o.effect=Math.max(0,o.effect-visualDt);const t=s.clock+o.phase;
   const scale=d.age==='puppy'?.68+d.growth*.002:1.35;o.g.scale.setScalar(scale);
   const moving=!this.reduced&&!o.effect;
   // Idle strolls stay inside the same full visible yard; visual positions do not own care state.
   if(moving){o.g.position.x=o.home[0]+Math.sin(t*.35)*.09;o.g.position.z=THREE.MathUtils.clamp(o.home[1]+Math.cos(t*.42)*.06,-1.2,2);}
   o.tail.rotation.z=this.reduced?0:Math.sin(t*8)*(o.effect?.6:.22);o.head.rotation.z=this.reduced?0:Math.sin(t*1.2)*.035;o.body.position.y=this.reduced?0:Math.sin(t*3)*.012+(o.effect?Math.sin(o.effect/.7*Math.PI)*.16:0);
   for(let i=0;i<o.legs.length;i++)o.legs[i].rotation.x=moving?Math.sin(t*3+i*Math.PI)*.07:0;
  }
  const live=new Set(s.poops.map(p=>p.id));for(const [id,g]of this.poops)if(!live.has(id)){g.scale.multiplyScalar(this.reduced?.1:.7);if(g.scale.x<.04){this.scene.remove(g);this.poops.delete(id);}}
  for(const p of s.poops)if(!this.poops.has(p.id)){const g=new THREE.Group();g.position.set(p.x,.02,p.z);this.cube(g,0x79604a,[.32,.13,.28],[0,.06,0]);this.cube(g,0x896b50,[.23,.12,.2],[.01,.16,0]);g.traverse(o=>{o.userData.poop=p.id;});this.scene.add(g);this.poops.set(p.id,g);}
  const selected=this.dogs.get(s.selected);if(selected){this.marker.position.x=selected.g.position.x;this.marker.position.z=selected.g.position.z;}
  this.renderer.render(this.scene,this.camera);
 }
 stats(){const r=this.renderer.info;return {revision:THREE.REVISION,calls:r.render.calls,triangles:r.render.triangles,geometries:r.memory.geometries,textures:r.memory.textures,dogs:this.dogs.size,slots:[...this.dogs.values()].map(d=>({id:d.id,slot:d.slot}))};}
 dispose(){if(this.disposed)return;this.disposed=true;this.abort.abort();this.resize.disconnect();this.renderer.setAnimationLoop(null);this.box.dispose();for(const m of this.materials.values())m.dispose();this.renderer.dispose();this.renderer.forceContextLoss();this.renderer.domElement.remove();this.dogs.clear();this.departures.length=0;this.poops.clear();this.materials.clear();this.portraits.clear();}
}
