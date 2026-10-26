// Repository-pinned Three r180, reused without modifying the existing runtime.
import * as T from '/games/purrch-grove/vendor/three/three.module.min.js';
import {FIELD,POCKETS} from './model.mjs';
import {ITEMS} from './campaign.mjs';
const PALETTE=[0x4da8dd,0xe77f58,0xb4a0e8,0x76c69b];
export class Harbor{
 constructor(host,{aim=()=>{},fineAim=()=>{},cancel=()=>{},loss=()=>{}}={}){
  this.host=host;this.abort=new AbortController();this.materials=new Map();this.textures=[];this.ballMeshes=new Map();this.effects=[];this.exits=new Map();this.reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;this.time=0;this.lastModel=null;this.shotTime=-10;
  const outline=new T.Shape();outline.moveTo(-.47,-.47);outline.lineTo(.47,-.47);outline.lineTo(.47,.47);outline.lineTo(-.47,.47);outline.closePath();this.box=new T.ExtrudeGeometry(outline,{depth:.94,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.03,bevelThickness:.03});this.box.translate(0,0,-.47);this.sphere=new T.SphereGeometry(FIELD.r,28,18);this.ring=new T.TorusGeometry(.47,.035,6,36);this.cylinder=new T.CylinderGeometry(1,1,1,20);this.circle=new T.CircleGeometry(1,32);
  this.renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power',preserveDrawingBuffer:false});this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));this.renderer.outputColorSpace=T.SRGBColorSpace;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=.92;this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=T.PCFSoftShadowMap;this.renderer.setClearColor(0x153b4b);this.renderer.domElement.tabIndex=0;this.renderer.domElement.setAttribute('role','img');host.prepend(this.renderer.domElement);
  this.scene=new T.Scene();this.scene.fog=new T.Fog(0x284f59,35,65);this.camera=new T.OrthographicCamera(-6,6,10,-10,.1,90);this.camera.position.set(0,30,10);this.camera.lookAt(0,0,.2);
  this.scene.add(new T.HemisphereLight(0xffead2,0x214b64,1.6));const sun=new T.DirectionalLight(0xffdcaa,2.5);sun.position.set(-9,18,-8);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-8,right:8,top:12,bottom:-12,near:1,far:45});sun.shadow.bias=-.00025;sun.shadow.normalBias=.025;this.scene.add(sun);const fill=new T.DirectionalLight(0x7bdde3,.55);fill.position.set(8,5,9);this.scene.add(fill);
  this.build();this.batchBoxes(this.scene);this.makeNori();this.batchBoxes(this.nori);this.makeAim();this.winAge=10;
  this.ray=new T.Raycaster();this.pointer=new T.Vector2();this.plane=new T.Plane(new T.Vector3(0,1,0),-FIELD.r);this.point=new T.Vector3();let held=null,initialAngle=0;
  const point=(e,fine=false)=>{const r=this.renderer.domElement.getBoundingClientRect();this.pointer.set((e.clientX-r.left)/r.width*2-1,1-(e.clientY-r.top)/r.height*2);this.ray.setFromCamera(this.pointer,this.camera);if(this.ray.ray.intersectPlane(this.plane,this.point)){const cue=this.lastModel?.cue;if(fine&&cue){const next=Math.atan2(this.point.x-cue.x,cue.z-this.point.z),delta=Math.atan2(Math.sin(next-initialAngle),Math.cos(next-initialAngle));fineAim(initialAngle+delta*.12);}else{aim(this.point.x,this.point.z);if(cue)initialAngle=Math.atan2(this.point.x-cue.x,cue.z-this.point.z);}}};
  const on=(name,fn)=>this.renderer.domElement.addEventListener(name,fn,{signal:this.abort.signal});
  on('pointerdown',e=>{if(e.button!==0)return;held=e.pointerId;this.renderer.domElement.setPointerCapture(e.pointerId);point(e);});
  on('pointermove',e=>{if(held===e.pointerId)point(e,true);});
  on('pointerup',e=>{if(held!==e.pointerId)return;point(e,true);held=null;if(this.renderer.domElement.hasPointerCapture(e.pointerId))this.renderer.domElement.releasePointerCapture(e.pointerId);});
  on('pointercancel',()=>{held=null;cancel();});on('lostpointercapture',()=>{held=null;});
  on('webglcontextlost',e=>{e.preventDefault();loss();});
  this.resize=new ResizeObserver(()=>this.fit());this.resize.observe(host);this.fit();
 }
 mat(color,roughness=.62,metalness=.05){const key=[color,roughness,metalness].join(':');if(!this.materials.has(key))this.materials.set(key,new T.MeshStandardMaterial({color,roughness,metalness}));return this.materials.get(key);}
 cube(parent,color,size,pos,rz=0){const m=new T.Mesh(this.box,this.mat(color));m.scale.set(...size);m.position.set(...pos);m.rotation.z=rz;m.receiveShadow=true;parent.add(m);return m;}
 batchBoxes(parent){const groups=new Map();for(const mesh of [...parent.children])if(mesh.isMesh&&mesh.geometry===this.box){const key=mesh.material.id+':'+mesh.castShadow;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(mesh);}for(const meshes of groups.values())if(meshes.length>1){const batch=new T.InstancedMesh(this.box,meshes[0].material,meshes.length);batch.castShadow=meshes[0].castShadow;batch.receiveShadow=true;meshes.forEach((mesh,i)=>{mesh.updateMatrix();batch.setMatrixAt(i,mesh.matrix);parent.remove(mesh);});batch.instanceMatrix.needsUpdate=true;batch.computeBoundingSphere();parent.add(batch);}}
 disk(parent,color,r,pos){const m=new T.Mesh(this.circle,this.mat(color));m.rotation.x=-Math.PI/2;m.scale.set(r,r,1);m.position.set(...pos);parent.add(m);return m;}
 build(){
  const s=this.scene;this.cube(s,0x176174,[100,.15,100],[0,-2.3,0]);
  // Designed harbor deck, not an image plane standing in for interactive geometry.
  for(let i=0;i<15;i++)this.cube(s,i%3===0?0x4d6b6b:0x426262,[.92,.2,24],[-6.8+i*.97,-1.85,0]);
  this.cube(s,0x3a2926,[10.9,.85,16.9],[0,-.95,0]);this.cube(s,0x976444,[10.65,.26,16.65],[0,-.4,0]);
  const weave=this.clothTexture();this.cloth=new T.Mesh(new T.BoxGeometry(9,.14,14),new T.MeshStandardMaterial({color:0x0d847f,roughness:.95,map:weave,bumpMap:weave,bumpScale:.014}));this.cloth.position.y=-.09;this.cloth.receiveShadow=true;s.add(this.cloth);
  this.cube(s,0x152e37,[10.2,.08,15.2],[0,-.2,0]);s.remove(this.cloth);s.add(this.cloth);
  for(const x of [-4.85,4.85])for(const z of [-3.65,3.65]){this.cube(s,0x277b72,[.68,.32,6.1],[x,.04,z]);this.cube(s,0xd6b574,[.06,.05,6.1],[x+Math.sign(x)*.36,.23,z]);this.cube(s,0x754e39,[.42,.45,6.5],[x+Math.sign(x)*.55,-.05,z]);}
  for(const z of [-7.35,7.35]){this.cube(s,0x277b72,[7.55,.32,.68],[0,.04,z]);this.cube(s,0xd6b574,[7.6,.05,.06],[0,.23,z+Math.sign(z)*.36]);this.cube(s,0x754e39,[8,.45,.42],[0,-.05,z+Math.sign(z)*.55]);}
  for(const x of [-5.15,5.15])for(const z of [-5,-2.2,2.2,5])this.cube(s,0xe2c38a,[.11,.035,.16],[x,.2,z]);
  this.pockets=[];for(const [i,[x,z]]of POCKETS.entries()){
   this.disk(s,0x071921,.72,[x,.016,z]);const rim=new T.Mesh(new T.TorusGeometry(.72,.075,7,28),this.mat(0xc8ab6b,.35,.55));rim.rotation.x=-Math.PI/2;rim.position.set(x,-.01,z);s.add(rim);
   const lid=this.disk(s,0xc5764e,.65,[x,.04,z]);this.pockets.push(lid);
  }
  for(const z of [-8.9,8.9])for(const x of [-6.15,6.15]){
   this.cube(s,0x5c4a36,[.28,2.1,.28],[x,-.8,z]);this.cube(s,0xd9ad5a,[.72,.13,.72],[x,.3,z]);this.cube(s,0x68513a,[.63,.7,.63],[x,.7,z]);const glow=this.cube(s,0xffd486,[.52,.55,.52],[x,.7,z]);glow.material=this.mat(0xffd486,.35);glow.material.emissive=new T.Color(0xd17b30);glow.material.emissiveIntensity=.6;this.cube(s,0xa87942,[.85,.15,.85],[x,1.1,z]);
  }
  this.cue=new T.Group();const shaft=new T.Mesh(this.cylinder,this.mat(0xe1b779,.3));shaft.scale.set(.043,4,.043);shaft.rotation.x=Math.PI/2;shaft.position.z=2.65;this.cue.add(shaft);const grip=new T.Mesh(this.cylinder,this.mat(0x79503f,.5));grip.scale.set(.075,1.4,.075);grip.rotation.x=Math.PI/2;grip.position.z=3.8;this.cue.add(grip);this.cueGrip=grip;for(const z of [1,3.15,4.45]){const ring=new T.Mesh(this.cylinder,this.mat(0xe4bd71,.3,.6));ring.scale.set(.08,.08,.08);ring.rotation.x=Math.PI/2;ring.position.z=z;this.cue.add(ring);}s.add(this.cue);
 }
 clothTexture(){const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle='#eeeeee';x.fillRect(0,0,256,256);for(let i=0;i<256;i+=2){x.fillStyle=i%4===0?'#ffffff':'#dadada';x.fillRect(i,0,1,256);x.globalAlpha=.3;x.fillRect(0,i,256,1);x.globalAlpha=1;}const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(7,12);t.colorSpace=T.SRGBColorSpace;this.textures.push(t);return t;}
 makeNori(){
  const n=this.nori=new T.Group();n.position.set(-3.3,-.15,8.4);n.scale.setScalar(.9);n.rotation.y=.15;this.scene.add(n);
  const c=(color,size,pos)=>this.cube(n,color,size,pos);
  c(0x795033,[1.5,1.65,.95],[0,-.2,0]);c(0xe7d2a2,[.86,1.1,.12],[0,-.15,.51]);
  for(const x of [-.48,.48]){c(0x5d3c2b,[.5,.6,.65],[x,-1.28,.15]);c(0x95663e,[.55,.25,.85],[x,-1.52,.33]);}
  c(0x9c6a43,[1.75,1.4,1.15],[0,1.22,0]);c(0xb48151,[1.3,.25,1.05],[0,2.02,0]);
  for(const x of [-1.0,1.0]){c(0x80502f,[.38,.48,.5],[x,1.76,0]);c(0xc99a6a,[.2,.27,.12],[x,1.76,.27]);}
  for(const x of [-.42,.42]){c(0xf0dcac,[.65,.55,.4],[x,.86,.69]);c(0xf5f1d6,[.46,.56,.06],[x,1.37,.604]);c(0x102d35,[.22,.39,.08],[x,1.36,.66]);c(0x45b7c5,[.11,.2,.09],[x-.045,1.32,.71]);c(0xffffff,[.07,.09,.1],[x+.04,1.48,.715]);c(0x5b3928,[.51,.1,.14],[x,1.74,.64]);}
  c(0x3c2a24,[.34,.24,.27],[0,1.08,.99]);c(0xa46943,[.65,.2,.35],[0,.61,.64]);
  for(const x of [-.47,.47]){c(0xd6ac4b,[.76,.62,.16],[x,1.94,.61]);c(0x187d95,[.57,.43,.13],[x,1.94,.71]);c(0x6cd5e1,[.4,.29,.05],[x-.05,2,.79]);}
  c(0x775334,[.18,.1,.16],[0,1.94,.65]);
  for(const x of [-.72,.72]){const arm=c(0x147f87,[.53,.93,.7],[x,.13,.22]);arm.rotation.z=x<0?-.35:.35;c(0xe4cf9c,[.55,.16,.72],[x,-.28,.24]);c(0x8d5d39,[.47,.4,.55],[x,-.48,.3]);}
  c(0x166f79,[.63,1.6,1.03],[-.6,-.18,0]);c(0x168a90,[.63,1.6,1.03],[.6,-.18,0]);
  c(0xb0d7c4,[.1,1.45,.11],[-.25,-.16,.57]);c(0xb0d7c4,[.1,1.45,.11],[.25,-.16,.57]);
  c(0x644d35,[.18,1.8,.12],[0,-.1,.66]).rotation.z=-.45;c(0xe7b64d,[.24,.23,.1],[0,.4,.77]);
  for(const [size,pos]of [[[.12,.55,.12],[0,0,.86]],[[.4,.1,.12],[0,.1,.86]],[[.1,.2,.12],[-.16,.22,.86]]])c(0xf37559,size,pos);
  for(let i=0;i<4;i++)c(i%2?0x98683c:0x805632,[.55,.38,.65],[.35+i*.28,-1.0-i*.05,-.65-i*.48]);
  n.traverse(o=>{if(o.isMesh)o.castShadow=true;});
 }
 makeAim(){
  this.aimGeometry=new T.BufferGeometry();this.aimGeometry.setAttribute('position',new T.BufferAttribute(new Float32Array(360),3));this.aimLine=new T.LineSegments(this.aimGeometry,new T.LineBasicMaterial({color:0xdffbf4,transparent:true,opacity:.85,depthTest:false}));this.aimLine.renderOrder=3;this.scene.add(this.aimLine);
  this.ghost=new T.Mesh(this.ring,new T.MeshBasicMaterial({color:0xe7fff8,transparent:true,opacity:.65}));this.ghost.scale.setScalar(FIELD.r/.47);this.ghost.rotation.x=-Math.PI/2;this.ghost.position.y=.015;this.scene.add(this.ghost);
  this.pathGeometry=new T.BufferGeometry();this.pathGeometry.setAttribute('position',new T.BufferAttribute(new Float32Array(72),3));this.targetLine=new T.LineSegments(this.pathGeometry,new T.LineBasicMaterial({color:0xffd07d,transparent:true,opacity:.9,depthTest:false}));this.targetLine.renderOrder=4;this.scene.add(this.targetLine);
 }
 fit(){const r=this.host.getBoundingClientRect();if(r.width<2||r.height<2)return;this.renderer.setSize(r.width,r.height,false);const aspect=r.width/r.height,wide=aspect>1.22;this.camera.up.set(wide?1:0,wide?0:1,0);this.camera.lookAt(0,0,.1);const worldW=wide?19.2:11.1,worldH=wide?11.1:19.2,h=Math.max(worldH,worldW/aspect);this.camera.left=-h*aspect/2;this.camera.right=h*aspect/2;this.camera.top=h/2;this.camera.bottom=-h/2;this.camera.updateProjectionMatrix();}
 label(number){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');x.fillStyle='#fbf1da';x.beginPath();x.arc(64,64,46,0,Math.PI*2);x.fill();x.fillStyle='#172b37';x.font='800 62px system-ui';x.textAlign='center';x.textBaseline='middle';x.fillText(String(number),64,67);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;this.textures.push(t);return t;}
 makeBall(b){const root=new T.Group(),color=b.kind==='cue'?0xfff5d8:b.kind.startsWith('lantern')?0xeac66f:b.kind==='key'?0xf0a248:PALETTE[(b.number-1)%4];const body=new T.Mesh(this.sphere,this.mat(color,.18,.12));body.castShadow=true;root.add(body);const shadow=this.disk(root,0x124348,.38,[.025,-FIELD.r+.015,.025]);shadow.material=this.mat(0x124348,.95);if(b.kind!=='cue'){const sprite=new T.Sprite(new T.SpriteMaterial({map:this.label(b.order||b.number),depthTest:false,depthWrite:false}));sprite.renderOrder=2;sprite.scale.set(.42,.42,1);sprite.position.y=.32;root.add(sprite);if(b.kind.includes('bank')){const ring=new T.Mesh(this.ring,this.mat(0x98f0e2,.3,.3));ring.rotation.x=-Math.PI/2;ring.position.y=-.28;root.add(ring);}}
  root.userData={body,kind:b.kind};this.scene.add(root);this.ballMeshes.set(b.id,root);return root;}
 effect(event){
  if(event.type==='shot'){this.shotTime=this.time;this.lastShot={x:event.x,z:event.z,angle:this.aimAngle||0};}
  if(event.type==='clear')this.winAge=0;
  if(event.type==='pot'||event.type==='foul'){const mesh=this.ballMeshes.get(event.id);if(mesh)this.exits.set(event.id,{start:this.time,x:event.x,z:event.z});}
  if(['contact','bank','pot','unlock','clear'].includes(event.type)){
   const count=this.reduced?2:event.type==='clear'?16:event.type==='pot'?8:3;for(let i=0;i<count&&this.effects.length<48;i++){const m=new T.Mesh(this.box,this.mat(event.type==='pot'?0xffd180:0x9df6e5,.3));m.scale.setScalar(.045+i%2*.025);m.position.set(event.x||0,.25,event.z||0);this.scene.add(m);const a=i*2.399;this.effects.push({mesh:m,age:0,vx:Math.sin(a)*(1+i%3),vz:Math.cos(a)*(1+i%3),vy:1.2+i%2});}
  }
 }
 aim(model,angle){
  const c=model.cue,u={x:Math.sin(angle),z:-Math.cos(angle)},active=model.balls.filter(b=>b.active&&b.kind!=='cue');let dist=20,hit=null;
  const wall=Math.min(u.x>0?(FIELD.x-FIELD.r-c.x)/u.x:u.x<0?(-FIELD.x+FIELD.r-c.x)/u.x:1e5,u.z>0?(FIELD.z-FIELD.r-c.z)/u.z:u.z<0?(-FIELD.z+FIELD.r-c.z)/u.z:1e5);dist=Math.min(dist,wall);
  for(const b of active){const dx=c.x-b.x,dz=c.z-b.z,p=dx*u.x+dz*u.z,q=dx*dx+dz*dz-(2*FIELD.r)**2,disc=p*p-q;if(disc<0)continue;const t=-p-Math.sqrt(disc);if(t>0&&t<dist){dist=t;hit=b;}}
  const end={x:c.x+u.x*dist,z:c.z+u.z*dist};let points=[];for(let d=.45;d<dist;d+=.36){points.push([c.x+u.x*d,.08,c.z+u.z*d],[c.x+u.x*Math.min(d+.16,dist),.08,c.z+u.z*Math.min(d+.16,dist)]);}
  const a=this.aimGeometry.attributes.position;for(let i=0;i<Math.min(points.length,a.count);i++)a.setXYZ(i,...points[i]);this.aimGeometry.setDrawRange(0,Math.min(points.length,a.count));a.needsUpdate=true;
  this.ghost.visible=Boolean(hit);this.ghost.position.set(end.x,.04,end.z);this.targetLine.visible=Boolean(hit);
  if(hit){
   let dx=hit.x-end.x,dz=hit.z-end.z,len=Math.hypot(dx,dz);dx/=len;dz/=len;
   // Trace the same ball-centre cushion boundary and open-pocket sensor as
   // simulation. Extending a centre ray to the outside wood falsely suggested
   // a pocket even when the ball would first strike a cushion jaw.
   let x=hit.x,z=hit.z,sx=x,sz=z,banks=0;const segments=[],push=()=>{segments.push([sx,.15,sz],[x,.15,z]);sx=x;sz=z;};
   for(let i=0;i<320;i++){
    x+=dx*.04;z+=dz*.04;
    if(model.open.some(j=>Math.hypot(x-POCKETS[j][0],z-POCKETS[j][1])<FIELD.pocket)||active.some(b=>b!==hit&&Math.hypot(x-b.x,z-b.z)<FIELD.r*2)){push();break;}
    let bounced=false;if(Math.abs(x)>FIELD.x-FIELD.r){x=Math.sign(x)*(FIELD.x-FIELD.r);dx=-dx*.88;bounced=true;}if(Math.abs(z)>FIELD.z-FIELD.r){z=Math.sign(z)*(FIELD.z-FIELD.r);dz=-dz*.88;bounced=true;}
    if(bounced){const speed=Math.hypot(dx,dz);dx/=speed;dz/=speed;}
    if(bounced){push();if(++banks>=2)break;}if(i===319)push();
   }
   const p=this.pathGeometry.attributes.position;for(let i=0;i<segments.length;i++)p.setXYZ(i,...segments[i]);p.needsUpdate=true;this.pathGeometry.setDrawRange(0,segments.length);
  }
 }
 sync(model,angle,power,dt=0){
  this.time+=dt;this.lastModel=model;
  const desired=new Set(model.balls.map(b=>b.id));for(const [id,m]of this.ballMeshes)if(!desired.has(id)){this.scene.remove(m);this.ballMeshes.delete(id);this.exits.delete(id);}
  for(const b of model.balls){const m=this.ballMeshes.get(b.id)||this.makeBall(b),exit=this.exits.get(b.id);if(b.active){this.exits.delete(b.id);m.visible=true;m.scale.setScalar(1);m.position.set(b.x,FIELD.r,b.z);m.userData.body.rotation.x+=b.vz*dt/FIELD.r;m.userData.body.rotation.z-=b.vx*dt/FIELD.r;}else if(exit){const p=Math.min(1,(this.time-exit.start)/.28);m.position.set(exit.x,FIELD.r-p*.65,exit.z);m.scale.setScalar(1-p*.85);m.visible=p<1;}else m.visible=false;}
  this.pockets.forEach((lid,i)=>{lid.visible=!model.open.includes(i);});
  const ready=!model.moving&&!model.outcome,stroke=(this.time-this.shotTime)/.14;this.aimAngle=angle;this.cue.visible=ready||Boolean(this.lastShot&&stroke<1);this.aimLine.visible=ready&&model.cue.active;this.ghost.visible=ready;this.targetLine.visible=ready;
  if(ready){this.cue.position.set(model.cue.x,FIELD.r+.04,model.cue.z);this.cue.rotation.y=-angle;this.cue.translateZ(power*.15);this.aim(model,angle);}
  else if(this.cue.visible){this.cue.position.set(this.lastShot.x,FIELD.r+.04,this.lastShot.z);this.cue.rotation.y=-this.lastShot.angle;this.cue.translateZ(-.34*Math.sin(Math.min(1,stroke)*Math.PI));}
  for(let i=this.effects.length-1;i>=0;i--){const e=this.effects[i];e.age+=dt;e.mesh.position.x+=e.vx*dt;e.mesh.position.z+=e.vz*dt;e.mesh.position.y+=e.vy*dt;e.vy-=5*dt;e.mesh.rotation.x+=dt*4;e.mesh.scale.multiplyScalar(Math.exp(-dt*2));if(e.age>.45){this.scene.remove(e.mesh);this.effects.splice(i,1);}}
  if(!this.reduced)this.nori.rotation.z=Math.sin(this.time*1.3)*.012;
  this.winAge+=dt;const cheer=this.reduced?0:Math.sin(Math.min(1,this.winAge/.65)*Math.PI);this.nori.rotation.x=-.48+cheer*.1;this.nori.position.y=-.15+cheer*.14;
  this.renderer.render(this.scene,this.camera);
 }
 style(id){const item=ITEMS.find(i=>i.id===id)||ITEMS[0];this.cloth.material.color.setHex(item.cloth);this.cueGrip.material=this.mat(item.color,.3,.2);}
 thumbnail(id){
  const item=ITEMS.find(i=>i.id===id)||ITEMS[0],s=new T.Scene();s.background=new T.Color(0x183d4b);s.add(new T.HemisphereLight(0xffebcc,0x264455,2));
  const l=new T.DirectionalLight(0xffdca0,3);l.position.set(-3,7,5);l.castShadow=true;l.shadow.mapSize.set(512,512);Object.assign(l.shadow.camera,{left:-5,right:5,top:5,bottom:-5,near:1,far:25});l.shadow.bias=-.0003;s.add(l);
  this.cube(s,0x6f4a35,[5.1,.3,5.1],[0,-.2,0]);const felt=this.cube(s,item.cloth,[4.7,.09,4.7],[0,0,0]);felt.material=this.mat(item.cloth,.95);felt.material.map=this.cloth.material.map;felt.material.bumpMap=felt.material.map;felt.material.bumpScale=.014;
  const c=this.cue.clone();c.position.set(-1.1,.3,-1.9);c.rotation.y=.3;c.children[1].material=this.mat(item.color,.3,.2);
  for(const part of c.children){part.scale.x*=3;part.scale.z*=3;part.castShadow=true;}s.add(c);
  for(const [color,x,z]of [[0xfff5d8,1,-.9],[0x4da8dd,1.1,.05]]){const ball=new T.Mesh(this.sphere,this.mat(color,.18,.12));ball.position.set(x,.4,z);ball.castShadow=true;s.add(ball);}
  const camera=new T.OrthographicCamera(-3.1,3.1,3.1,-3.1,.1,30);camera.position.set(3,9,6);camera.lookAt(0,0,0);this.renderer.setSize(256,256,false);this.renderer.render(s,camera);const data=this.renderer.domElement.toDataURL('image/png');this.fit();return data;
 }
 stats(){return {revision:T.REVISION,calls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,geometries:this.renderer.info.memory.geometries,textures:this.renderer.info.memory.textures,effects:this.effects.length};}
 dispose(){this.abort.abort();this.resize.disconnect();const geo=new Set(),mat=new Set(this.materials.values()),tex=new Set(this.textures);this.scene.traverse(n=>{if(n.isInstancedMesh)n.dispose();if(n.geometry)geo.add(n.geometry);for(const m of Array.isArray(n.material)?n.material:n.material?[n.material]:[]){mat.add(m);if(m.map)tex.add(m.map);}});for(const g of geo)g.dispose();for(const m of mat)m.dispose();for(const t of tex)t.dispose();this.renderer.dispose();this.renderer.forceContextLoss();this.renderer.domElement.remove();this.effects=[];this.ballMeshes.clear();this.exits.clear();this.materials.clear();}
}
