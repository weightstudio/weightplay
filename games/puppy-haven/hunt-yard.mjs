import * as THREE from './vendor/three/three.module.min.js';
import {Yard} from './yard.mjs';import {CELLS} from './hunt.mjs';
import {bitePose} from './bite-pose.mjs';
export class HuntYard extends Yard{
 constructor(...args){super(...args);this.enemies=new Map();this.deathAges=new Map();this.bars=new THREE.InstancedMesh(this.box,new THREE.MeshBasicMaterial({color:0xffffff,depthTest:false,depthWrite:false}),64);this.bars.count=0;this.bars.renderOrder=99;this.bars.frustumCulled=false;this.scene.add(this.bars);this.barObject=new THREE.Object3D();this.barColor=new THREE.Color();this.barRight=new THREE.Vector3(1,0,0).applyQuaternion(this.camera.quaternion);this.marker.visible=false;}
 buildGarden(){
  this.scene.background=new THREE.Color(0xc3d6c2);this.cube(this.scene,0xaab88b,[8.8,.24,8.2],[0,-.18,-.3]);this.cube(this.scene,0xdbc395,[9,.2,8.4],[0,-.4,-.3]);
  for(let i=0;i<8;i++)for(let j=0;j<6;j++)this.cube(this.scene,(i+j)%3?0xa6ba8a:0x9fb284,[1.05,.012,1.25],[-3.7+i*1.05,-.05,-3.4+j*1.25]);
  for(const [x,z]of [[-4,-3.9],[0,-4.1],[4,-3.9],[-4,-.5],[4,-.5],[-4,3.1],[4,3.1]]){const g=new THREE.Group();g.position.set(x,0,z);this.scene.add(g);this.cube(g,0x886549,[.24,1,.25],[0,.4,0]);this.cube(g,0x527d54,[.95,.7,.9],[0,1.05,0]);this.cube(g,0x79a263,[.65,.5,.65],[.08,1.6,-.03]);this.cube(g,0xb7c285,[.28,.15,.3],[-.25,1.45,.3]);}
  for(const [i,[x,z]]of CELLS.entries()){const color=i<3?0xd1bc79:0x90b6a9;for(const dz of [-.6,.6])this.cube(this.scene,color,[1.15,.02,.055],[x,-.025,z+dz]);for(const dx of [-.55,.55])this.cube(this.scene,color,[.055,.02,1.25],[x+dx,-.025,z]);}
 }
 buildGardenDetails(){this.gardenDetailMaterial=new THREE.MeshStandardMaterial({color:0x799369});this.gardenDetails=new THREE.InstancedMesh(this.box,this.gardenDetailMaterial,1);this.gardenDetails.count=0;this.scene.add(this.gardenDetails);}
 fit(){if(this.disposed)return;const{width:w,height:h}=this.host.getBoundingClientRect();if(w<1||h<1)return;this.renderer.setSize(w,h,false);const aspect=w/h,half=Math.max(5.2,6.6/aspect);Object.assign(this.camera,{left:-half*aspect,right:half*aspect,top:half,bottom:-half});this.camera.updateProjectionMatrix();}
 makeEnemy(u){const g=new THREE.Group();this.scene.add(g);const coat=u.kind==='wolf'?0x6f7c88:u.kind==='fox'?0xc7854b:u.kind==='stag'?0xaf9168:u.kind==='armored'?0x7b796b:0x8e6a4b;const body=this.cube(g,coat,[.72,.55,.92],[0,.36,0]);this.cube(g,coat,[.57,.55,.53],[0,.67,.43]);this.cube(g,u.kind==='fox'?0xffe3b5:0xb9a38c,[.4,.25,.32],[0,.5,.76]);this.cube(g,0x353e37,[.22,.13,.1],[0,.57,.94]);for(const x of [-.23,.23]){this.cube(g,0x313a36,[.08,.09,.05],[x,.77,.71]);this.cube(g,coat,[.18,.32,.22],[x,.99,.35]);}for(const x of [-.23,.23])for(const z of [-.28,.27])this.cube(g,0x655b46,[.18,.38,.2],[x,.1,z]);if(u.kind==='stag')for(const x of [-.28,.28])this.cube(g,0xe0c995,[.09,.55,.12],[x,1.26,.35],x);else if(['boar','armored','boss'].includes(u.kind))for(const x of [-.2,.2])this.cube(g,0xffe4b1,[.09,.26,.12],[x,.51,.88],x);if(u.kind==='armored'||u.kind==='boss')this.cube(g,0xa39d82,[.8,.16,.72],[0,.7,-.1]);const o={g,body,scale:u.kind==='boss'?1.5:1.05};this.enemies.set(u.id,o);return o;}
 pick(e){const rect=this.renderer.domElement.getBoundingClientRect();this.point.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);this.ray.setFromCamera(this.point,this.camera);const at=this.ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0),.03),new THREE.Vector3());if(!at)return;const cell=CELLS.findIndex(([x,z])=>Math.abs(at.x-x)<.8&&Math.abs(at.z-z)<.8);if(cell>=0)this.onPick('cell',cell);}
 worldPoint(id){const o=this.dogs.get(id)||this.enemies.get(id);if(!o)return null;const v=new THREE.Vector3(o.g.position.x,1.9,o.g.position.z).project(this.camera),r=this.renderer.domElement.getBoundingClientRect();return {x:r.left+(v.x+1)*r.width/2,y:r.top+(1-v.y)*r.height/2};}
 renderHunt(h,dt){
  super.render({dogs:h.allies,poops:[],bowls:[],selected:h.allies[0]?.id,clock:h.clock},0,dt,false);const live=new Set(h.enemies.map(u=>u.id));for(const [id,o]of this.enemies)if(!live.has(id)){this.scene.remove(o.g);this.enemies.delete(id);this.deathAges.delete(id);}
  let count=0;for(const u of h.units){const o=u.team?(this.enemies.get(u.id)||this.makeEnemy(u)):this.dogs.get(u.id);if(!o)continue;const g=o.g,k=u.windup>0?(1-u.windup/.18)*.17:0,hurt=u.hurt/.2*.1,rx=u.recoilX||0,rz=u.recoilZ||0,l=Math.hypot(rx,rz)||1;
   const visualClock=h.clock+h.acc,pose=u.team?null:bitePose({...u,windup:u.windup>0?Math.max(.001,u.windup-h.acc):0},visualClock,this.reduced),reach=pose?pose.reach:k;
   g.position.set(u.x+Math.sin(u.heading)*reach+rx/l*hurt,-.06,u.z+Math.cos(u.heading)*reach+rz/l*hurt);g.rotation.y=u.heading;
   const base=u.team?o.scale:1.35;if(u.hp<=0){const age=(this.deathAges.get(u.id)||0)+dt;this.deathAges.set(u.id,age);g.scale.setScalar(base*Math.max(.001,1-age/(this.reduced?.1:.3)));g.visible=age<.3;g.rotation.z=this.reduced?0:Math.min(1,age/.3)*.8;if(!u.team)o.jaw.rotation.x=0;}else{g.visible=true;g.scale.setScalar(base);g.rotation.z=0;if(!u.team){
    o.bitePhase=pose.phase;o.jaw.rotation.x=pose.jaw;o.body.position.y=o.baseY+pose.crouch;o.body.rotation.x=pose.pitch;o.head.rotation.x=pose.head;o.head.rotation.z=0;o.head.position.z=.35+pose.reach*.18;
    if(pose.phase!=='idle'){for(let i=0;i<o.legs.length;i++)o.legs[i].rotation.x=i%2?pose.front:pose.hind;o.tail.rotation.x=pose.tail;}else o.tail.rotation.x=0;
   }}
   if(u.team)o.body.rotation.z=this.reduced?0:(u.activity==='walk'?Math.sin(h.clock*7+u.id)*.035:0);
   if(u.hp<=0)continue;
   for(const [barIndex,[ratio,color,y]]of [[1,0x263c32,2.2],[u.hp/u.maxHp,u.team?0xe17d61:0x65b66b,2.2],[Math.min(1,u.shield/30),0x8cd4db,2.35]].entries()){if(ratio<=0)continue;this.barObject.position.set(u.x,y,u.z).addScaledVector(this.barRight,-(1-ratio)*.4);this.barObject.quaternion.copy(this.camera.quaternion);this.barObject.scale.set((barIndex===0?.86:.8)*ratio,barIndex===0?.16:.1,.018);this.barObject.updateMatrix();this.bars.setMatrixAt(count,this.barObject.matrix);this.bars.setColorAt(count++,this.barColor.set(color));}
  }
  this.bars.count=count;this.bars.instanceMatrix.needsUpdate=true;if(this.bars.instanceColor)this.bars.instanceColor.needsUpdate=true;
  this.scene.updateMatrixWorld(true);let n=0;for(const o of this.dogs.values())for(const part of o.shadowParts)this.shadowProxy.setMatrixAt(n++,part.matrixWorld);this.shadowProxy.count=n;this.shadowProxy.instanceMatrix.needsUpdate=true;this.fillDetails(this.dogDetails,[...this.dogs.values()]);
  this.renderer.info.reset();this.renderer.render(this.scene,this.camera);this.lastFrame={calls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles};
 }
 stats(){return {...super.stats(),enemies:this.enemies.size,healthInstances:this.bars.count,bites:[...this.dogs.values()].map(o=>({id:o.id,phase:o.bitePhase||'idle',jaw:o.jaw.rotation.x,bodyPitch:o.body.rotation.x,bodyY:o.body.position.y,front:o.legs[1].rotation.x,hind:o.legs[0].rotation.x,reach:o.head.position.z-.35}))};}
 dispose(){if(this.disposed)return;this.bars?.material.dispose();this.bars?.dispose();this.enemies?.clear();this.deathAges?.clear();super.dispose();}
}
