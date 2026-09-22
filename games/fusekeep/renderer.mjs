import * as T from './vendor/three/three.module.min.js';
import {createModelKit} from './models.mjs';
import {PADS,TROOPS,LIMITS} from './data.mjs';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const FIELD=1,FORMATION=2;
const point=(x,y,z)=>new T.Vector3(x,y,z);
/** One context, fixed simulation world and co-located native interaction targets.
 * Short layouts split the views, not the simulation or available information. */
export class Arena {
 constructor(host,{onLost=()=>{},onLayout=()=>{},reducedMotion=false}={}){
  this.host=host;this.onLayout=onLayout;this.reducedMotion=reducedMotion;this.dead=false;
  this.entities=new Map();this.particles=[];this.owned=[];this.frameTimes=[];
  this.drag=null;this.time=0;this.selected=-1;this.focused=-1;this.views=[];this.lastBattle=null;
  this.kit=createModelKit(T);this.ray=new T.Raycaster();this.ndc=new T.Vector2();this.dragPlane=new T.Plane(point(0,1,0),-.42);
  try{
   this.renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});
   this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
   this.renderer.outputColorSpace=T.SRGBColorSpace;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.18;
   this.canvas=this.renderer.domElement;this.canvas.setAttribute('aria-hidden','true');host.append(this.canvas);
   this.lost=e=>{e.preventDefault();if(!this.dead)onLost();};this.canvas.addEventListener('webglcontextlost',this.lost);
   this.scene=new T.Scene();this.scene.background=new T.Color(0x416578);
   const hemi=new T.HemisphereLight(0xe3fbff,0x566580,2.4);hemi.layers.enableAll();this.scene.add(hemi);
   const sun=new T.DirectionalLight(0xffdfa7,3.2);sun.position.set(-8,16,9);sun.layers.enableAll();this.scene.add(sun);
   const rim=new T.DirectionalLight(0x86e8ff,1.1);rim.position.set(8,6,-8);rim.layers.enableAll();this.scene.add(rim);
   this.fullCamera=this.camera();this.fieldCamera=this.camera();this.boardCamera=this.camera();
   this.fullCamera.layers.enable(FIELD);this.fullCamera.layers.enable(FORMATION);this.fieldCamera.layers.set(FIELD);this.boardCamera.layers.set(FORMATION);
   this.box=this.own(new T.BoxGeometry(1,1,1));
   this.materials={
    stone:this.mat(0x607ca9),tile:this.mat(0x7cc5db),gold:this.mat(0xffd36a),warning:this.mat(0xff8b5c),
    ice:this.mat(0x8ee5ff,.34),valid:this.mat(0x72e7a9),dark:this.mat(0x213a57),red:this.mat(0xef7654),shield:this.mat(0x8acafa,.22),
   };
   this.field=this.kit.scenery(this.fieldBoxes());this.field.layers.set(FIELD);this.scene.add(this.field);
   this.platform=this.kit.scenery([[0,.03,6.8,9.4,.3,6.5,0x829ab5],[0,.22,9.65,9.4,.25,.3,0xddeefa]]);
   this.platform.layers.set(FORMATION);this.scene.add(this.platform);
   this.pads=PADS.map((p,index)=>{
    const root=new T.Group();root.position.set(p.x,0,p.z);root.layers.set(FORMATION);
    const base=this.cube(this.materials.stone,1.95,.27,1.38,0,.15,0);
    const top=this.cube(this.materials.tile,1.72,.08,1.16,0,.32,0);top.userData.pad=index;
    const edge=this.cube(this.materials.gold,1.8,.07,.1,0,.36,.62);edge.visible=false;
    const ice=this.cube(this.materials.ice,1.46,1.85,1.12,0,1.2,0);ice.visible=false;
    root.add(base,top,edge,ice);this.scene.add(root);return {root,top,edge,ice};
   });
   this.shotMesh=new T.InstancedMesh(this.box,this.mat(0xffffff),LIMITS.shots);
   this.shotMesh.instanceMatrix.setUsage(T.DynamicDrawUsage);this.shotMesh.frustumCulled=false;
   this.shotMesh.layers.enable(FIELD);this.shotMesh.layers.enable(FORMATION);this.shotMesh.count=0;this.scene.add(this.shotMesh);
   this.fxMesh=new T.InstancedMesh(this.box,this.mat(0xffffff),LIMITS.effects);
   this.fxMesh.instanceMatrix.setUsage(T.DynamicDrawUsage);this.fxMesh.frustumCulled=false;
   this.fxMesh.layers.enable(FIELD);this.fxMesh.layers.enable(FORMATION);this.fxMesh.count=0;this.scene.add(this.fxMesh);
   this.dummy=new T.Object3D();this.color=new T.Color();this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(host);this.resize();
  }catch(error){this.dispose();throw error;}
 }
 own(resource){this.owned.push(resource);return resource;}
 mat(color,opacity=1){return this.own(new T.MeshStandardMaterial({color,roughness:.68,metalness:.12,transparent:opacity<1,opacity,depthWrite:opacity===1}));}
 cube(material,w,h,d,x=0,y=0,z=0){const mesh=new T.Mesh(this.box,material);mesh.scale.set(w,h,d);mesh.position.set(x,y,z);mesh.layers.set(FORMATION);return mesh;}
 camera(){return new T.OrthographicCamera(-5,5,8,-8,.1,100);}
 fieldBoxes(){
  const b=[[0,-.3,-2.3,9.4,.4,12.8,0x253d4a],[0,.55,3.95,9.5,1.4,.85,0x33485e],[0,1.3,3.95,9.5,.2,1,0x83929d],[0,.9,4.4,9.3,.14,.08,0xc99742]];
  for(let z=-8;z<=3;z++)for(let x=-4;x<=4;x++)b.push([x,-.06,z,.97,.05,.97,(x+z)%2?0x355566:0x466878]);
  for(const x of [-4.6,4.6]){
   b.push([x,.22,-2.35,.28,.65,12.5,0x738daf]);
   for(let z=-8;z<=3;z+=2)b.push([x,.62,z,.58,.23,.8,0xf0fcff]);
   for(const z of [-6,0])b.push([x,.7,z,.3,1.1,.3,0x5a7d7d],[x,1.4,z,.94,.65,.87,0x59ab94],[x,1.94,z,.66,.55,.61,0x83c9ad],[x,2.25,z,.64,.15,.6,0xe5f7f2]);
  }
  b.push([-1.85,1.04,-8,.8,2.3,1.1,0xb2ccdf],[1.85,1.04,-8,.8,2.3,1.1,0xb2ccdf],[0,2.32,-8,4.65,.56,1.1,0xe4f3ff],[0,1,-8.4,2.95,2,.2,0x273e60],[0,2.76,-8,.65,.34,.72,0xffd17b]);
  for(let x=-4;x<=4;x+=2)b.push([x,1.6,3.95,.82,.52,1,0x64798a]);
  for(const x of [-4.25,4.25])b.push([x,1.02,3.95,1.1,2.2,1.35,0x354c65],[x,2.18,3.95,1.3,.25,1.5,0x91a3b0],[x,1.5,4.66,.4,.7,.08,0xd2a64d]);
  return b;
 }
 fit(camera,rect,{x=4.95,z0,z1,y=2.8,elevation=42,depth=10}){
  const center=(z0+z1)/2;camera.position.set(0,elevation,center+depth);camera.lookAt(0,.4,center);camera.updateMatrixWorld(true);
  let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
  for(const xx of [-x,x])for(const yy of [0,y])for(const zz of [z0,z1]){
   const v=point(xx,yy,zz).applyMatrix4(camera.matrixWorldInverse);
   minX=Math.min(minX,v.x);maxX=Math.max(maxX,v.x);minY=Math.min(minY,v.y);maxY=Math.max(maxY,v.y);
  }
  const aspect=Math.max(.01,rect.w/rect.h);let width=maxX-minX+.25,height=maxY-minY+.25;
  if(width/height<aspect)width=height*aspect;else height=width/aspect;
  const cx=(minX+maxX)/2,cy=(minY+maxY)/2;
  Object.assign(camera,{left:cx-width/2,right:cx+width/2,top:cy+height/2,bottom:cy-height/2});camera.updateProjectionMatrix();
 }
 resize(){
  if(this.dead)return;
  const w=this.host.clientWidth,h=this.host.clientHeight;if(w<2||h<2)return;
  const physicalScale=Math.max(.1,this.host.getBoundingClientRect().width/w);
  this.w=w;this.h=h;this.renderer.setSize(w,h,false);
  const full={x:0,y:0,w,h,camera:this.fullCamera};this.fit(this.fullCamera,full,{z0:-8.6,z1:9.4});
  this.views=[full];this.boardView=full;this.fieldView=full;
  const a=this.project(PADS[0].x,.38,PADS[0].z,full),b=this.project(PADS[3].x,.38,PADS[3].z,full);
  if(Math.abs(a.y-b.y)*physicalScale<49||w/h>1.4||w/h<1){
   let field,formation;
   if(w/h>1.35){
    const bw=Math.min(w*.47,Math.max(240/physicalScale,w*.36));
    field={x:0,y:0,w:Math.max(1,w-bw-4),h,camera:this.fieldCamera};formation={x:w-bw,y:0,w:bw,h,camera:this.boardCamera};
   }else{
    const bh=Math.min(h*.42,Math.max(168/physicalScale,h*.27));
    field={x:0,y:0,w,h:Math.max(1,h-bh-4),camera:this.fieldCamera};formation={x:0,y:h-bh,w,h:bh,camera:this.boardCamera};
   }
   this.fit(this.fieldCamera,field,{z0:-8.6,z1:4.75,y:3.25});this.fit(this.boardCamera,formation,{x:4.75,z0:4.3,z1:9.35,y:2.1,elevation:28,depth:16});
   this.views=[field,formation];this.boardView=formation;this.fieldView=field;
  }
  this.host.dataset.cameraLayout=this.views.length===1?'continuous':this.boardView.y?'stacked':'side-by-side';
  this.onLayout(this.padScreens());if(this.lastBattle)this.render(this.lastBattle,[],this.selected,this.focused);
 }
 project(x,y,z,view=this.fieldView){
  if(!view)return {x:0,y:0};const p=point(x,y,z).project(view.camera);
  return {x:view.x+(p.x+1)*view.w/2,y:view.y+(1-p.y)*view.h/2};
 }
 padScreens(){return PADS.map((p,i)=>({index:i,...this.project(p.x,.88,p.z,this.boardView)}));}
 setRay(clientX,clientY){
  const rect=this.host.getBoundingClientRect(),view=this.boardView;
  if(!view||rect.width<2||rect.height<2)return false;
  const x=(clientX-rect.left)*this.w/rect.width,y=(clientY-rect.top)*this.h/rect.height;
  if(x<view.x||x>view.x+view.w||y<view.y||y>view.y+view.h)return false;
  this.ndc.set((x-view.x)/view.w*2-1,1-(y-view.y)/view.h*2);this.ray.layers.set(FORMATION);this.ray.setFromCamera(this.ndc,view.camera);return true;
 }
 padAt(clientX,clientY){
  if(!this.setRay(clientX,clientY))return -1;this.scene.updateMatrixWorld(true);
  // The lifted soldier must never intercept its own destination ray.
  const units=Array.from(this.entities.values()).filter(item=>item.pad!==undefined&&item.pad!==this.drag?.from).map(item=>item.mesh);
  const hits=this.ray.intersectObjects([...units,...this.pads.map(p=>p.top)],false);
  return hits.length?hits[0].object.userData.pad??-1:-1;
 }
 dragTo(from,clientX,clientY){
  if(!this.setRay(clientX,clientY)){this.drag=null;return;}
  const position=point(0,0,0);
  if(this.ray.ray.intersectPlane(this.dragPlane,position))this.drag={from,position:point(clamp(position.x,-4,4),.55,clamp(position.z,4.3,9.35))};
 }
 clearDrag(){this.drag=null;}
 burst(x,y,z,color,count=10){
  count=this.reducedMotion?Math.min(3,count):count;
  for(let i=0;i<count&&this.particles.length<LIMITS.effects;i++){
   const angle=i*2.399963,velocity=.65+(i%4)*.22;
   this.particles.push({x,y,z,vx:Math.cos(angle)*velocity,vy:.8+(i%3)*.4,vz:Math.sin(angle)*velocity,color,start:this.time,duration:.55});
  }
 }
 makeEntity(unit,hostile,index){
  const root=new T.Group(),mesh=this.kit.figure(unit.type,hostile);root.add(mesh);root.layers.set(hostile?FIELD:FORMATION);mesh.layers.set(hostile?FIELD:FORMATION);
  const item={root,mesh,pad:hostile?undefined:index,attack:0,hit:0,rank:unit.rank||0};
  if(!hostile){
   mesh.userData.pad=index;
   for(let i=0;i<unit.rank;i++)root.add(this.cube(this.materials.gold,.13,.1,.12,(i-(unit.rank-1)/2)*.17,.13,.49));
  }else{
   const bar=new T.Group();bar.layers.set(FIELD);
   const back=this.cube(this.materials.dark,1.1,.1,.025),front=this.cube(this.materials.red,1,.06,.03,0,0,.02);
   back.layers.set(FIELD);front.layers.set(FIELD);bar.add(back,front);this.scene.add(bar);item.bar=bar;item.barFill=front;
   const halo=this.cube(this.materials.shield,1.7,2.1,1.25,0,1,0);halo.layers.set(FIELD);halo.visible=false;root.add(halo);item.halo=halo;
  }
  this.scene.add(root);return item;
 }
 render(battle,events=[],selected=-1,focused=-1){
  if(this.dead||!this.w||!this.h)return;
  const started=performance.now();this.time=battle.time;this.lastBattle=battle;this.selected=selected;this.focused=focused;
  for(const e of events){
   if(e.type==='shot'){const item=this.entities.get(e.unitId);if(item)item.attack=battle.time+.15;}
   if(e.type==='hit'){const item=this.entities.get(e.id);if(item)item.hit=battle.time+.1;}
   if(e.type==='merge'||e.type==='summon'){const p=PADS[e.to??e.pad];this.burst(p.x,1,p.z,e.type==='merge'?0xffd36a:0x91f0ca,18);}
   if(e.type==='impact'){
    this.burst(e.x,.85,e.z,TROOPS[e.troop].color,e.troop==='bear'?16:5);
    if(e.troop==='rabbit')for(const target of e.targets||[])this.burst(target.x,1,target.z,0xe8c1ff,3);
   }
   if(e.type==='kill')this.burst(e.x,.65,e.z,e.boss?0xffd36a:0xddeff3,e.boss?26:8);
   if(e.type==='heal')this.burst(e.x,1.3,e.z,0x87f2a4,7);
   if(e.type==='spell')for(let i=0;i<8;i++)this.burst((i%3-1)*2,1,-6+i*1.15,0x9cf2ff,6);
  }
  const live=new Set();
  battle.board.forEach((unit,index)=>{
   if(!unit)return;live.add(unit.id);let item=this.entities.get(unit.id);
   if(!item){item=this.makeEntity(unit,false,index);this.entities.set(unit.id,item);}
   item.pad=index;item.mesh.userData.pad=index;item.root.position.set(PADS[index].x,.42,PADS[index].z);
   if(this.drag?.from===index)item.root.position.copy(this.drag.position);
   item.mesh.scale.setScalar(.75+(unit.rank-1)*.045);item.mesh.position.y=this.reducedMotion?0:Math.sin(battle.time*2.3+index)*.025;
   item.mesh.rotation.x=!this.reducedMotion&&item.attack>battle.time?-.13:0;
   const target=battle.targetList(index)[0];
   item.mesh.rotation.y=target?Math.atan2(-(target.x-PADS[index].x),-(target.z-PADS[index].z)):0;
  });
  battle.enemies.forEach(enemy=>{
   live.add(enemy.id);let item=this.entities.get(enemy.id);if(!item){item=this.makeEntity(enemy,true);this.entities.set(enemy.id,item);}
   const scale=enemy.boss?1.48:enemy.type==='small'?.7:1.12;
   item.root.position.set(enemy.x,.08,enemy.z);item.mesh.scale.setScalar(scale);item.mesh.rotation.y=Math.PI;
   item.mesh.rotation.z=!this.reducedMotion&&enemy.stun<=0?Math.sin(battle.time*7+enemy.id)*.035:0;
   item.mesh.position.y=!this.reducedMotion&&item.hit>battle.time?.09:0;
   item.bar.position.set(enemy.x,scale*1.83+.28,enemy.z);item.bar.quaternion.copy(this.fieldView.camera.quaternion);
   const health=clamp(enemy.hp/enemy.maxHp,0,1);item.barFill.scale.x=Math.max(.01,health);item.barFill.position.x=-(1-health)*.5;
   item.halo.visible=Boolean(enemy.cast||enemy.armored||enemy.slow>0);item.halo.material=enemy.cast?this.materials.ice:this.materials.shield;
  });
  for(const [id,item] of this.entities)if(!live.has(id)){this.scene.remove(item.root);if(item.bar)this.scene.remove(item.bar);this.entities.delete(id);}
  this.pads.forEach((visual,index)=>{
   const warned=battle.warnings.some(w=>w.indices.includes(index))||battle.enemies.some(e=>e.cast?.indices?.includes(index));
   const match=selected>=0&&['move','merge'].includes(battle.canMove(selected,index));
   visual.top.material=battle.frozen[index]>0?this.materials.ice:warned?this.materials.warning:match?this.materials.valid:this.materials.tile;
   visual.ice.visible=battle.frozen[index]>0;visual.edge.visible=index===selected||index===focused;
   visual.edge.material=warned?this.materials.warning:this.materials.gold;
  });
  this.shotMesh.count=Math.min(battle.shots.length,LIMITS.shots);
  battle.shots.slice(0,LIMITS.shots).forEach((shot,index)=>{
   const progress=clamp(1-shot.remaining/shot.duration,0,1),from=point(shot.from.x,1.32,shot.from.z),to=point(shot.x,.9,shot.z);
   this.dummy.position.lerpVectors(from,to,progress);this.dummy.position.y+=Math.sin(progress*Math.PI)*(shot.troop==='bear'?.9:.12);
   this.dummy.scale.set(shot.troop==='bear'?.24:.09,shot.troop==='bear'?.24:.09,.38);this.dummy.lookAt(to);this.dummy.updateMatrix();
   this.shotMesh.setMatrixAt(index,this.dummy.matrix);this.shotMesh.setColorAt(index,this.color.setHex(TROOPS[shot.troop].color));
  });
  this.shotMesh.instanceMatrix.needsUpdate=true;if(this.shotMesh.instanceColor)this.shotMesh.instanceColor.needsUpdate=true;
  this.particles=this.particles.filter(p=>battle.time-p.start<p.duration);this.fxMesh.count=this.particles.length;
  this.particles.forEach((p,index)=>{
   const age=battle.time-p.start,size=.12*(1-age/p.duration);this.dummy.position.set(p.x+p.vx*age,p.y+p.vy*age-1.5*age*age,p.z+p.vz*age);
   this.dummy.rotation.set(age*4,age*3,age);this.dummy.scale.setScalar(size);this.dummy.updateMatrix();this.fxMesh.setMatrixAt(index,this.dummy.matrix);this.fxMesh.setColorAt(index,this.color.setHex(p.color));
  });
  this.fxMesh.instanceMatrix.needsUpdate=true;if(this.fxMesh.instanceColor)this.fxMesh.instanceColor.needsUpdate=true;
  this.renderer.info.autoReset=false;this.renderer.info.reset();this.renderer.setScissorTest(false);this.renderer.setViewport(0,0,this.w,this.h);this.renderer.clear();this.renderer.setScissorTest(true);
  for(const view of this.views){this.renderer.setViewport(view.x,this.h-view.y-view.h,view.w,view.h);this.renderer.setScissor(view.x,this.h-view.y-view.h,view.w,view.h);this.renderer.render(this.scene,view.camera);}
  this.renderer.setScissorTest(false);this.frameTimes.push(performance.now()-started);if(this.frameTimes.length>120)this.frameTimes.shift();
 }
 resources(){
  const info=this.renderer?.info;
  return {disposed:this.dead,contexts:this.dead?0:1,entities:this.entities.size,effects:this.particles.length,
   geometries:info?.memory.geometries??0,textures:info?.memory.textures??0,programs:info?.programs?.length??0,
   drawCalls:info?.render.calls??0,triangles:info?.render.triangles??0,frameSamples:[...this.frameTimes],cameraLayout:this.host.dataset.cameraLayout};
 }
 dispose(){
  if(this.dead)return;this.dead=true;this.observer?.disconnect();this.canvas?.removeEventListener('webglcontextlost',this.lost);
  this.scene?.clear();this.entities.clear();this.particles=[];this.lastBattle=null;this.drag=null;this.kit?.dispose();
  for(const resource of this.owned)resource.dispose();this.owned=[];
  this.shotMesh?.dispose();this.fxMesh?.dispose();this.renderer?.dispose();this.renderer?.forceContextLoss();this.canvas?.remove();
 }
}
/** Squad portraits use the same model identities with no retained renderer. */
export function makePortraits(types){
 let renderer,kit;const result={};
 try{
  renderer=new T.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});kit=createModelKit(T);
  renderer.setSize(192,192,false);renderer.setPixelRatio(1);renderer.outputColorSpace=T.SRGBColorSpace;
  const scene=new T.Scene(),camera=new T.OrthographicCamera(-1.15,1.15,1.2,-1.2,.1,30);
  camera.position.set(3,2.8,-5);camera.lookAt(0,1,0);
  scene.add(new T.HemisphereLight(0xe5fbff,0x61728b,2.8));const sun=new T.DirectionalLight(0xffe0b1,3);sun.position.set(-3,6,-5);scene.add(sun);
  for(const type of types){const mesh=kit.figure(type);scene.add(mesh);renderer.render(scene,camera);result[type]=renderer.domElement.toDataURL('image/png');scene.remove(mesh);}
  return result;
 }finally{kit?.dispose();renderer?.dispose();renderer?.forceContextLoss();}
}
