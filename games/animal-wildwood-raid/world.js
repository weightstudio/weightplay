import * as THREE from './vendor/three/three.module.min.js';
import {GroundCues} from './ground-cues.js';
import {axePose,ease,enemyWind,enemyStroke} from './combat-pose.js';
const palette={wood:0x765139,dark:0x302a2c,orange:0xc9763e,cream:0xffdfae,teal:0x258f85,gold:0xf4be58,leaf:0x397a50,moss:0x69905b,stone:0x738782,white:0xd9f3e4,cyan:0x79f4d3,purple:0x875b99,red:0xf2745e,ground:0x537555};
export class WildwoodWorld {
 constructor(canvas,sim){
  this.canvas=canvas;this.sim=sim;this.parts=[];this.models=new Map();this.batches=new Map();this.effects=[];this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  this.renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  this.scene=new THREE.Scene();this.cues=new GroundCues(this.scene);this.scene.background=new THREE.Color(0x173d3c);
  this.ground=new THREE.TextureLoader().load(new URL('./art/ground-v1.webp',import.meta.url).href);this.ground.colorSpace=THREE.SRGBColorSpace;this.ground.wrapS=this.ground.wrapT=THREE.RepeatWrapping;this.ground.repeat.set(2,2);
  this.camera=new THREE.OrthographicCamera(-9,9,11,-11,.1,70);this.camera.position.set(0,20,16);this.camera.lookAt(0,0,0);
  const shape=new THREE.Shape();shape.moveTo(-.46,-.46);shape.lineTo(.46,-.46);shape.lineTo(.46,.46);shape.lineTo(-.46,.46);shape.closePath();
  this.geometry=new THREE.ExtrudeGeometry(shape,{depth:.92,bevelEnabled:true,bevelSize:.04,bevelThickness:.04,bevelSegments:1,steps:1});this.geometry.translate(0,0,-.46);
  this.scene.add(new THREE.HemisphereLight(0xd3f3ee,0x345040,2.3));this.sun=new THREE.DirectionalLight(0xffe0a0,3);this.sun.position.set(-6,15,9);this.sun.castShadow=true;this.sun.shadow.mapSize.set(1024,1024);Object.assign(this.sun.shadow.camera,{left:-12,right:12,top:12,bottom:-12,far:40});this.sun.shadow.normalBias=.04;this.scene.add(this.sun);
  this.root=new THREE.Group();this.static=new THREE.Group();this.root.add(this.static);this.box(this.static,'ground',[0,-.35,0],[15,.6,18]);
  // Authored stone border and stepping-stone trail establish the entire playable area.
  for(let i=0;i<19;i++){for(const side of [-1,1])this.box(this.static,i%3?'stone':'moss',[side*7.4,-.05,-8.3+i*.92],[.6,.5,.6]);}
  for(let i=0;i<11;i++)this.box(this.static,i%2?'moss':'stone',[Math.sin(i*.8)*.5,-.025,7-i*1.4],[1.35,.12,1]);
  for(let i=0;i<14;i++){const x=(i%2?1:-1)*(7.8+i%3*.35),z=-8+Math.floor(i/2)*2.5;this.tree(this.static,x,z,.8, true);}
  this.box(this.static,'wood',[0,-.8,0],[15,1,18]);
  this.box(this.static,'ground',[0,-1.45,0],[60,.3,60]);
  // Forest continues beyond the arena so a following camera never exposes an empty backdrop.
  for(const side of [-1,1])for(let i=0;i<17;i++){
   const x=-15+i*1.9,z=side*(11.4+(i%3)*1.3);
   this.tree(this.static,x,z,.85+(i%4)*.12,true);
   if(i%2===0)this.box(this.static,'stone',[x+.7,-.7,z-1],[.9,.6,.7]);
  }
  for(let i=0;i<48;i++){const x=(i%2?1:-1)*(8.8+Math.floor(i/14)*1.8),z=-17+(i%14)*2.5;this.tree(this.static,x,z,1+(i%3)*.18,true);}
  for(let i=0;i<24;i++){const x=(i%2?1:-1)*(5.7+i%3*.2),z=-7+i*.6;this.box(this.static,'leaf',[x,.1,z],[.12,.32,.12]);const flower=this.box(this.static,i%2?'cream':'gold',[x,.3,z],[.2,.12,.2]);flower.rotation.y=i;}
  this.heroModel=this.character('hero');this.root.add(this.heroModel);this.exit=new THREE.Group();this.root.add(this.exit);
  this.box(this.exit,'gold',[-1,.8,0],[.25,1.8,.3]);this.box(this.exit,'gold',[1,.8,0],[.25,1.8,.3]);this.box(this.exit,'gold',[0,1.7,0],[2.2,.24,.3]);this.box(this.exit,'cyan',[0,.1,0],[1.8,.1,1.2]);
  this.resize();
 }
 box(parent,color,pos,scale){const n=new THREE.Object3D();n.position.set(...pos);n.scale.set(...scale);parent.add(n);this.parts.push({node:n,color});return n;}
 tree(parent,x,z,scale=1,decor=false){const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(scale);parent.add(g);this.box(g,'wood',[0,.65,0],[.4,1.3,.4]);this.box(g,'gold',[0,.55,.22],[.22,.25,.06]);for(let i=0;i<3;i++)this.box(g,i%2?'moss':'leaf',[0,1.3+i*.5,0],[1.4-i*.3,.65,1.3-i*.3]);return g;}
 character(kind,type=''){
  const g=new THREE.Group(),hero=kind==='hero',friend=kind==='friend',boss=kind==='boss';const color=hero?'orange':friend?'cream':type==='caster'||type==='mosswitch'?'purple':type==='ram'||type==='hornroot'?'wood':'moss';
  this.box(g,hero?'leaf':color,[0,.7,0],[.62,.75,.48]);this.box(g,color,[0,1.28,0],[.78,.62,.65]);
  this.box(g,hero||friend?'cream':'wood',[0,1.12,.37],[.5,.22,.2]);
  for(const s of [-1,1]){
   this.box(g,'cream',[s*.27,1.25,.33],[.2,.25,.08]);this.box(g,'dark',[s*.16,1.4,.35],[.095,.105,.04]);this.box(g,'white',[s*.17,1.425,.375],[.03,.035,.015]);this.box(g,color,[s*.29,1.67,0],[.2,friend?.5:.25,.2]);this.box(g,'dark',[s*.29,1.69,.08],[.1,.1,.04]);
  }
  this.box(g,'dark',[0,1.2,.49],[.12,.08,.08]);
  const legs=[];for(const sign of [-1,1]){const hip=new THREE.Group();hip.position.set(sign*.2,.49,0);g.add(hip);this.box(hip,'dark',[0,-.25,0],[.25,.48,.34]);this.box(hip,hero?'wood':'dark',[0,-.43,.08],[.29,.17,.4]);legs.push(hip);}
  const arm=new THREE.Group();arm.position.set(.42,.9,0);g.add(arm);this.box(arm,color,[0,-.18,0],[.22,.48,.25]);
  const offarm=new THREE.Group();offarm.position.set(-.43,.98,0);g.add(offarm);this.box(offarm,color,[0,-.25,0],[.24,.55,.28]);
  if(hero){
   this.box(g,'teal',[0,1,.03],[.73,.16,.64]);this.box(g,'teal',[-.2,.75,.3],[.22,.4,.12]);this.box(g,'gold',[0,.49,.27],[.13,.12,.06]);
   const tail=new THREE.Group();tail.position.set(0,.6,-.25);tail.rotation.x=-.65;g.add(tail);for(let i=0;i<5;i++)this.box(tail,i%2?'dark':'orange',[0,0,-i*.28],[.36,.36,.35]);
   this.box(arm,'wood',[0,-.04,.4],[.13,1.25,.13]);this.box(arm,'white',[.22,.5,.4],[.65,.48,.19]);this.box(arm,'gold',[.07,.48,.4],[.12,.51,.22]);this.box(g,'gold',[-.43,.4,.2],[.18,.23,.18]);
  }else if(['shield','ironbark','stumpback'].includes(type)){
   this.box(arm,'wood',[0,-.1,.35],[.7,.95,.18]);this.box(arm,'gold',[0,-.1,.46],[.55,.14,.04]);this.box(arm,'cyan',[0,-.1,.49],[.17,.3,.04]);
  }else if(['caster','shaman','mosswitch'].includes(type)){this.box(arm,'wood',[0,0,.2],[.13,1.6,.13]);this.box(arm,type==='caster'?'purple':'cyan',[0,.75,.2],[.38,.4,.38]);}
  if(['ram','hornroot','heartwood'].includes(type))for(const s of [-1,1]){this.box(g,'cream',[s*.5,1.6,0],[.45,.18,.2]);this.box(g,'cream',[s*.68,1.8,0],[.17,.5,.18]);if(boss)this.box(g,'gold',[s*.8,1.9,0],[.4,.14,.16]);}
  if(type==='stormowl'){for(const sign of [-1,1]){this.box(g,'teal',[sign*.72,1,0],[.65,.7,.23]);this.box(g,'white',[sign*.93,.8,.05],[.3,.6,.18]);}this.box(g,'gold',[0,1.25,.52],[.23,.3,.3]);}
  if(type==='rootweaver'){for(const sign of [-1,1])for(let i=0;i<3;i++){const root=this.box(g,'wood',[sign*(.5+i*.22),.2,0],[.28,.35,.7]);root.rotation.z=sign*.3;}this.box(g,'purple',[0,1.75,0],[.6,.32,.6]);}
  if(boss){g.scale.setScalar(1.35);this.box(g,'cyan',[0,.74,.27],[.25,.35,.07]);for(let i=-1;i<=1;i++)this.box(g,'gold',[i*.24,1.72,0],[.14,.35+Math.abs(i)*.1,.18]);}
  g.userData={legs,arm,offarm,kind,type};return g;
 }
 model(e){
  let g=new THREE.Group();
  if(['enemy','boss','friend'].includes(e.kind))g=this.character(e.kind,e.type);
  else if(e.kind==='tree')g=this.tree(new THREE.Group(),0,0,.9);
  else if(e.kind==='cage'){
   const rabbit=this.character('friend');rabbit.scale.setScalar(.6);g.add(rabbit);for(const x of [-.65,.65])for(const z of [-.5,.5])this.box(g,'wood',[x,.65,z],[.12,1.4,.12]);this.box(g,'wood',[0,1.25,0],[1.45,.12,1.2]);this.box(g,'gold',[0,.7,.55],[.22,.25,.1]);
  }else{
   this.box(g,'stone',[0,.15,0],[1,.3,1]);this.box(g,'stone',[0,.55,0],[.6,.7,.6]);const crystal=this.box(g,e.kind==='totem'?'purple':'cyan',[0,1.12,0],[.34,.55,.34]);crystal.rotation.z=.3;
  }
  this.root.add(g);return g;
 }
 batch(color){if(this.batches.has(color))return this.batches.get(color);const material=new THREE.MeshStandardMaterial({color:color==='ground'?0xffffff:palette[color]||color,map:color==='ground'?this.ground:null,roughness:.72,metalness:['gold','white'].includes(color)?.35:.05,emissive:color==='cyan'?0x39aa8b:0,emissiveIntensity:.35});const mesh=new THREE.InstancedMesh(this.geometry,material,2048);mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);mesh.castShadow=mesh.receiveShadow=true;mesh.frustumCulled=false;mesh.count=0;this.scene.add(mesh);this.batches.set(color,mesh);return mesh;}
 resize(){const r=this.canvas.getBoundingClientRect();this.renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);const aspect=r.width/Math.max(1,r.height);const halfH=Math.max(4.8,4.8/aspect),halfW=halfH*aspect;Object.assign(this.camera,{left:-halfW,right:halfW,top:halfH,bottom:-halfH});this.camera.updateProjectionMatrix();}
 consume(events){for(const e of events)if(['hit','hurt','defeat','wardBlock','pulse','mastery','pickup'].includes(e.type)){
   for(let i=0;i<(this.reduced?2:e.type==='defeat'?6:3)&&this.effects.length<24;i++){const g=new THREE.Group();this.root.add(g);this.box(g,e.type==='hurt'?'red':e.type==='pickup'?'cyan':'gold',[0,0,0],[.13,.13,.13]);this.effects.push({g,x:e.x??this.sim.hero.x,z:e.z??this.sim.hero.z,angle:i*2.4,life:.35,total:.35});}
  }}
 render(dt=0){
  const sim=this.sim,h=sim.hero;this.heroModel.position.set(h.x,Math.sin(sim.time*10)*(h.attack?.015:0),h.z);this.heroModel.rotation.y=h.angle;
  this.camera.position.set(h.x,20,h.z+16);this.camera.lookAt(h.x,0,h.z);this.camera.updateMatrixWorld();
  const nearby=()=>true; // Camera clipping only: never spawn scenery in the middle of the visible arena.
  const walking=this.lastHero&&Math.hypot(h.x-this.lastHero.x,h.z-this.lastHero.z)>.001;this.lastHero={x:h.x,z:h.z};
  this.walkBlend=(this.walkBlend||0)+((walking?1:0)-(this.walkBlend||0))*(1-Math.exp(-dt*14));
  const stride=Math.sin(sim.time*12)*this.walkBlend,rig=this.heroModel.userData;
  if(h.attack&&h.attack!==this.lastAttack){this.attackBegan=sim.time-(h.attack.total-h.attack.left);this.attackStart=rig.arm.rotation.x;this.lastAttack=h.attack;}
  const elapsed=sim.time-(this.attackBegan??-10),attacking=elapsed<.62;
  const weight=attacking?ease(elapsed/.18)*(1-ease((elapsed-.36)/.26)):0;
  rig.arm.rotation.set(attacking?axePose(elapsed,this.attackStart,stride*.55):stride*.55,weight*.65,-weight*.55);
  rig.offarm.rotation.x=-stride*.65-weight*.22;this.heroModel.rotation.z=stride*.085;
  this.heroModel.rotation.x=this.walkBlend*.1+weight*.15;
  this.heroModel.position.y=h.recoil>0?.1:Math.abs(stride)*.085;
  rig.legs.forEach((leg,i)=>leg.rotation.x=h.dash>0?.9:Math.sin(sim.time*12+i*Math.PI)*.82*this.walkBlend);
  this.exit.position.set(sim.exit.x,0,sim.exit.z);this.exit.visible=sim.ready()&&nearby(sim.exit);
  for(const e of sim.ents){let g=this.models.get(e.uid);if(!g){g=this.model(e);this.models.set(e.uid,g);}const falling=e.hp<=0&&sim.time-(e.defeatedAt??-10)<.5;g.visible=e.hp>0||falling;g.position.set(e.x,e.recoil?Math.sin(e.recoil*30)*.05:0,e.z);g.rotation.y=e.angle||0;g.rotation.z=falling?(sim.time-e.defeatedAt)*2.8:e.recoil>0?Math.sin(e.recoil*40)*.18:0;
   if(g.userData.arm)g.userData.arm.rotation.x=e.wind?enemyWind(1-e.wind.left/e.wind.total):e.swing?enemyStroke(.36-e.swing):0;
   const previous=g.userData.previous,moving=previous&&Math.hypot(e.x-previous.x,e.z-previous.z)>.001;if(g.userData.legs)g.userData.legs.forEach((leg,i)=>leg.rotation.x=moving?Math.sin(sim.time*9+i*Math.PI)*.7:0);g.userData.previous={x:e.x,z:e.z};
  }
  for(const [uid,g] of this.models)if(!sim.ents.some(e=>e.uid===uid)){this.root.remove(g);this.parts=this.parts.filter(p=>!isChild(p.node,g));this.models.delete(uid);}
  // Dynamic markers use the same instanced geometry and are recycled each frame.
  if(this.dynamic){this.root.remove(this.dynamic);const old=this.dynamic;this.parts=this.parts.filter(p=>!isChild(p.node,old));}
  this.dynamic=new THREE.Group();this.root.add(this.dynamic);const d=this.dynamic;
  this.cues.render(sim);
  for(const hazard of sim.hazards||[])if(hazard.delay<=0)for(let i=0;i<4;i++)this.box(d,'wood',[hazard.x+Math.cos(i*1.57)*.6,.5,hazard.z+Math.sin(i*1.57)*.6],[.16,1,.16]);
  for(const e of sim.ents)if(e.hp<=0&&e.spawn){this.box(d,e.kind==='tree'?'wood':'gold',[e.x,.06,e.z],[e.kind==='tree'?.4:1.3,.12,e.kind==='tree'?.4:1.3]);}
  for(const o of sim.obstacles)if(o.hp>0&&nearby(o)){this.box(d,o.breakable?'wood':'stone',[o.x,.5,o.z],[o.w*2,1,o.h*2]);this.box(d,'moss',[o.x,1.03,o.z],[o.w*1.9,.12,o.h*1.9]);}
  for(const z of sim.zones)if(nearby(z))this.box(d,z.type==='mud'?'wood':z.type==='thorn'?(sim.time%3>2.1?'red':'purple'):'teal',[z.x,.01,z.z],[z.r*2,.035,z.r*2]);
  for(const f of sim.fields)this.box(d,'teal',[f.x,.04,f.z],[f.r*2,.045,f.r*2]);
  for(const p of sim.shots)if(nearby(p))this.box(d,p.enemy?'purple':'gold',[p.x,.5,p.z],[.2,.2,.4]);
  for(const p of sim.drops){if(!nearby(p))continue;const item=new THREE.Group();item.position.set(p.x,.4+Math.sin(sim.time*3)*.1,p.z);item.rotation.y=sim.time;d.add(item);
   if(p.kind==='heart'){for(const sign of [-1,1]){const leaf=this.box(item,'cyan',[sign*.1,.1,0],[.25,.35,.1]);leaf.rotation.z=sign*.5;}this.box(item,'leaf',[0,-.13,0],[.06,.3,.06]);}
   else if(p.kind==='boots'){for(const sign of [-1,1]){this.box(item,'wood',[sign*.16,0,0],[.2,.4,.22]);this.box(item,'cream',[sign*.16,-.14,.1],[.23,.13,.35]);}}
   else{this.box(item,'gold',[0,0,0],[.32,.42,.3]);this.box(item,'wood',[0,.24,0],[.4,.17,.38]);this.box(item,'wood',[0,.37,0],[.08,.16,.08]);}
  }
  if(h.ward)this.box(d,'cyan',[h.x,.65,h.z-.4],[.85,1,.08]);
  for(const fx of this.effects){fx.life-=dt;const t=(1-fx.life/fx.total);fx.g.position.set(fx.x+Math.cos(fx.angle)*t,.5+Math.sin(t*Math.PI)*.6,fx.z+Math.sin(fx.angle)*t);fx.g.scale.setScalar(Math.max(0,1-t));}
  for(const fx of this.effects.filter(x=>x.life<=0)){this.root.remove(fx.g);this.parts=this.parts.filter(p=>!isChild(p.node,fx.g));}this.effects=this.effects.filter(x=>x.life>0);
  this.root.updateMatrixWorld(true);for(const mesh of this.batches.values())mesh.count=0;
  for(const p of this.parts){let visible=true;for(let node=p.node;node;node=node.parent)if(!node.visible){visible=false;break;}if(!visible)continue;const b=this.batch(p.color);if(b.count<2048)b.setMatrixAt(b.count++,p.node.matrixWorld);}
  for(const mesh of this.batches.values())mesh.instanceMatrix.needsUpdate=true;
  this.renderer.render(this.scene,this.camera);
 }
 metrics(){return {drawCalls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,geometries:this.renderer.info.memory.geometries,materials:this.batches.size+1,cues:{vertices:this.cues.count,kinds:this.cues.kinds},models:this.models.size,effects:this.effects.length,visibleObjects:[...this.models.values()].filter(g=>g.visible).length,heroPose:{arm:this.heroModel.userData.arm.rotation.x,leg:this.heroModel.userData.legs[0].rotation.x}};}
 project(x,z,height=.5){const v=new THREE.Vector3(x,height,z).project(this.camera);return {x:(v.x+1)/2,y:(1-v.y)/2};}
 dispose(){this.cues.dispose();this.sun.shadow.map?.dispose();this.ground.dispose();this.geometry.dispose();for(const b of this.batches.values()){b.dispose();b.material.dispose();}this.batches.clear();this.parts=[];this.models.clear();this.effects=[];this.renderer.dispose();}
}
function isChild(n,parent){for(let p=n;p;p=p.parent)if(p===parent)return true;return false;}
