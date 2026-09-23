import {VISUALS,shotFrame,launchScale} from './presentation.mjs?v=3';
import * as T from './vendor/three/three.module.min.js';
import {COLORS,SYMBOLS} from './levels.mjs?v=3';
import {RULES,gatePhase,unlocked} from './engine.mjs';
const POINTS=Array.from({length:40},(_,i)=>{const s=Math.floor(i/10),n=i%10;return s===0?[-6,4.5-n]:s===1?[-4.5+n,-6]:s===2?[6,-4.5+n]:[4.5-n,6];});
export function beltPosition(progress){const p=((progress%40)+40)%40,i=Math.floor(p),f=p-i,a=POINTS[i],b=POINTS[(i+1)%40];return {x:a[0]+(b[0]-a[0])*f,z:a[1]+(b[1]-a[1])*f,heading:Math.atan2(b[0]-a[0],b[1]-a[1])};}
/** All game outcomes come from engine.mjs. This class owns only graphics. */
export class Arena{
 constructor(host,{onLost=()=>{},reducedMotion=false}={}){
  this.host=host;this.dead=false;this.reducedMotion=reducedMotion;this.resourcesOwned=new Set();this.effects=[];this.previousTicks=0;this.last=null;this.visibleCells=[];this.color=new T.Color();
  try{
   this.renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
   this.renderer.outputColorSpace=T.SRGBColorSpace;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=.95;
   this.canvas=this.renderer.domElement;this.canvas.setAttribute('aria-hidden','true');host.append(this.canvas);
   this.lost=e=>{e.preventDefault();if(!this.dead)onLost();};this.canvas.addEventListener('webglcontextlost',this.lost);
   this.scene=new T.Scene();this.scene.background=new T.Color(VISUALS.floor);this.camera=new T.OrthographicCamera(-8,8,8,-8,.1,100);this.camera.position.set(0,24,11);this.camera.lookAt(0,0,0);
   this.scene.add(new T.HemisphereLight(0xe6f2ee,0x1a2933,1.35));const sun=new T.DirectionalLight(0xffdfad,1.8);sun.position.set(-8,15,9);this.scene.add(sun);
   const fill=new T.DirectionalLight(0xbbe6ff,.55);fill.position.set(8,8,-8);this.scene.add(fill);
   this.box=this.own(new T.BoxGeometry(1,1,1));this.plane=this.own(new T.PlaneGeometry(1,1));this.dummy=new T.Object3D();
   this.mats={stone:this.mat(VISUALS.frame),floor:this.mat(VISUALS.floor),board:this.mat(VISUALS.board),cream:this.mat('#fff0d3'),fur:this.mat('#cf7044'),ear:this.mat('#54392e'),ink:this.mat('#172939'),belt:this.mat(VISUALS.belt),steel:this.mat(VISUALS.slat),gold:this.mat('#f1c861'),open:this.mat('#64d4aa'),shut:this.mat('#f28d73')};
   this.paints=COLORS.map(c=>this.mat(c));
   this.fxMaterial=this.own(new T.MeshBasicMaterial({color:0xffffff,toneMapped:false}));
   this.fxDark=this.own(new T.MeshBasicMaterial({color:0x0c1923,toneMapped:false}));
   this.fxCore=this.own(new T.MeshBasicMaterial({color:0xfff3cd,toneMapped:false}));
   this.ring=this.own(new T.RingGeometry(.24,.34,12));
   this.scene.add(this.cube(this.mats.floor,16,.3,16,0,-.4,0),this.cube(this.mats.stone,10.8,.4,10.8,0,0,0),this.cube(this.mats.board,10.25,.08,10.25,0,.23,0));
   this.tiles=this.instances(this.mats.belt,44);
   POINTS.forEach(([x,z],i)=>this.put(this.tiles,i,x,.07,z,i<10||i>=20&&i<30?1.48:.98,.22,i<10||i>=20&&i<30?.98:1.48));
   [[-5.65,-5.65],[5.65,-5.65],[5.65,5.65],[-5.65,5.65]].forEach(([x,z],i)=>this.put(this.tiles,40+i,x,.07,z,1.35,.22,1.35));this.tiles.count=44;this.tiles.instanceMatrix.needsUpdate=true;
   this.slats=this.instances(this.mats.steel,80);
   this.inlays=this.instances(this.mats.floor,22);
   for(let i=0;i<11;i++){this.put(this.inlays,i,i-5,.278,0,.024,.018,10.1);this.put(this.inlays,i+11,0,.278,i-5,10.1,.018,.024);}this.inlays.count=22;this.inlays.instanceMatrix.needsUpdate=true;
   this.supports=this.instances(this.mats.stone,100);this.voxels=this.paints.map(m=>this.instances(m,100));
   this.glyphs=SYMBOLS.map((glyph,i)=>{const texture=this.textTexture(glyph,128);const mat=this.own(new T.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false}));return this.instances(mat,100,this.plane);});
   this.armor=this.instances(this.mats.cream,200);this.keys=this.instances(this.mats.gold,24);this.locks=this.instances(this.mats.ink,200);
   this.shutters=Array.from({length:4},(_,i)=>{const side=i%2===0;const mesh=this.cube(this.mats.open,side?.1:10.2,.16,side?10.2:.1,side?(i===0?-5.3:5.3):0,.39,side?0:(i===1?-5.3:5.3));this.scene.add(mesh);return mesh;});
   this.couriers=Array.from({length:4},()=>{const unit=this.fox();this.scene.add(unit.root);return unit;});
   this.beams=this.instances(this.fxMaterial,VISUALS.maxEffects);
   this.shotHeads=this.instances(this.fxMaterial,VISUALS.maxEffects);
   this.shotBorders=this.instances(this.fxDark,VISUALS.maxEffects);
   this.shotCores=this.instances(this.fxCore,VISUALS.maxEffects);
   this.sparkles=this.instances(this.fxMaterial,VISUALS.maxEffects*4);
   this.rings=this.instances(this.own(new T.MeshBasicMaterial({color:0xffffff,side:T.DoubleSide,transparent:true,opacity:.7,depthWrite:false,toneMapped:false})),VISUALS.maxEffects,this.ring);
   this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(host);this.resize();
  }catch(error){this.dispose();throw error;}
 }
 own(value){this.resourcesOwned.add(value);return value;}
 mat(color){return this.own(new T.MeshStandardMaterial({color,roughness:.94,metalness:0}));}
 cube(mat,w,h,d,x=0,y=0,z=0){const mesh=new T.Mesh(this.box,mat);mesh.scale.set(w,h,d);mesh.position.set(x,y,z);return mesh;}
 instances(material,count,geometry=this.box){const mesh=new T.InstancedMesh(geometry,material,count);mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);mesh.frustumCulled=false;mesh.count=0;this.scene.add(mesh);this.resourcesOwned.add(mesh);return mesh;}
 put(mesh,i,x,y,z,w,h,d,rx=0,ry=0,rz=0){const o=this.dummy;o.position.set(x,y,z);o.scale.set(w,h,d);o.rotation.set(rx,ry,rz);o.updateMatrix();mesh.setMatrixAt(i,o.matrix);}
 textTexture(text,size=128,bg=null){const canvas=document.createElement('canvas');canvas.width=canvas.height=size;const c=canvas.getContext('2d');if(bg){c.fillStyle=bg;c.fillRect(0,0,size,size);}c.fillStyle='#fff6df';c.shadowColor='#0b1821';c.shadowBlur=size*.10;c.font=`900 ${size*.66}px system-ui`;c.textAlign='center';c.textBaseline='middle';c.fillText(text,size/2,size*.52);const texture=this.own(new T.CanvasTexture(canvas));texture.colorSpace=T.SRGBColorSpace;return texture;}
 fox(){
  const root=new T.Group(),m=this.mats;root.visible=false;const add=(mat,w,h,d,x,y,z)=>{const mesh=this.cube(mat,w,h,d,x,y,z);root.add(mesh);return mesh;};
  add(m.fur,.62,.48,.68,0,.63,0);add(m.cream,.43,.3,.04,0,.64,.36);
  const legs=[[-.21,-.23],[.21,-.23],[-.21,.23],[.21,.23]].map(([x,z])=>add(m.ear,.16,.3,.18,x,.23,z));
  add(m.fur,.73,.56,.58,0,1.04,.16);add(m.cream,.5,.25,.3,0,.91,.52);add(m.ink,.19,.12,.1,0,.98,.72);
  [-1,1].forEach(sign=>{add(m.fur,.22,.38,.22,sign*.25,1.43,.13);add(m.ear,.12,.23,.07,sign*.25,1.46,.26);add(m.ink,.09,.13,.035,sign*.19,1.15,.47);add(m.cream,.025,.04,.01,sign*.18,1.18,.492);});
  add(m.ear,.08,.57,.56,-.25,.67,-.04);add(m.ear,.08,.57,.56,.25,.67,-.04);
  const tank=add(this.paints[0],.48,.53,.3,0,.85,-.46);add(m.steel,.5,.05,.32,0,1.13,-.46);add(m.steel,.5,.05,.32,0,.58,-.46);
  const tail=new T.Group();tail.position.set(0,.58,-.3);tail.rotation.x=-.6;tail.add(this.cube(m.fur,.27,.27,.63,0,0,-.35),this.cube(m.cream,.28,.28,.2,0,0,-.71));root.add(tail);
  const nozzle=add(m.steel,.17,.17,.57,.38,.79,.39);add(m.ink,.19,.19,.09,.38,.79,.72);
  const labelTexture=this.textTexture('A 10');const material=this.own(new T.SpriteMaterial({map:labelTexture,depthTest:false}));const label=new T.Sprite(material);label.scale.set(1.15,1.15,1);label.position.set(0,2,0);root.add(label);
  return {root,tank,tail,legs,nozzle,label,labelTexture,labelText:''};
 }
 updateLabel(unit,text){if(unit.labelText===text)return;unit.labelText=text;const c=unit.labelTexture.image.getContext('2d');c.clearRect(0,0,128,128);c.fillStyle='#162d3c';c.fillRect(3,35,122,52);c.fillStyle='#fff4d4';c.font='bold 30px system-ui';c.textAlign='center';c.textBaseline='middle';c.fillText(text,64,62);unit.labelTexture.needsUpdate=true;}
 resize(){if(this.dead||!this.renderer)return;const r=this.host.getBoundingClientRect();if(r.width<2||r.height<2)return;const w=Math.round(r.width),h=Math.round(r.height);if(this.width===w&&this.height===h)return;this.width=w;this.height=h;this.renderer.setSize(w,h,false);const aspect=w/h,vertical=Math.max(7.5,8/aspect);this.camera.left=-vertical*aspect;this.camera.right=vertical*aspect;this.camera.top=vertical;this.camera.bottom=-vertical;this.camera.updateProjectionMatrix();if(this.last)this.draw(this.last,[],0);}
 paint(mesh,index,color){mesh.setColorAt(index,this.color.set(COLORS[color]));}
 draw(state,events=[],delta=0){
  if(this.dead)return;this.last=state;
  if(state.ticks<this.previousTicks){this.effects=[];this.visibleCells=[];}
  this.previousTicks=state.ticks;
  const dt=Math.max(0,Math.min(.1,delta));
  this.effects=this.effects.filter(e=>(e.age+=dt)<VISUALS.effectLife);
  for(const e of events)if(e.type==='hit'){
   const from=beltPosition(e.node),old=this.visibleCells[e.index];
   if(this.effects.length===VISUALS.maxEffects)this.effects.shift();
   this.effects.push({...e,age:0,x:from.x,z:from.z,tx:e.index%10-4.5,tz:Math.floor(e.index/10)-4.5,
    old:old?{...old}:null,ty:old?old.y+.2:.95});
  }
  // Keep the just-hit cap visible until its pigment projectile actually arrives.
  const pending=new Map();
  for(const e of this.effects)if(state.status==='running'&&e.cleared&&e.old&&!shotFrame(e,this.reducedMotion).impact&&!pending.has(e.index))pending.set(e.index,e.old);
  const counts=Array(5).fill(0);let supportCount=0,armorCount=0,keyCount=0,lockCount=0;
  state.board.forEach((cell,index)=>{
   const saved=pending.get(index),top=saved||cell[0];
   if(!top)return;
   const x=index%10-4.5,z=Math.floor(index/10)-4.5,y=saved?.y??(.43+cell.length*.13),i=counts[top.color]++;
   this.put(this.supports,supportCount++,x,y/2,z,.84,y,.84);
   this.put(this.voxels[top.color],i,x,y,z,.91,.23,.91);
   this.put(this.glyphs[top.color],i,x+.26,y+.122,z+.26,.32,.32,1,-Math.PI/2);
   if(top.hp===2){this.put(this.armor,armorCount++,x-.32,y+.15,z-.31,.16,.06,.16);this.put(this.armor,armorCount++,x+.32,y+.15,z+.31,.16,.06,.16);}
   if(top.key){this.put(this.keys,keyCount++,x,y+.19,z,.14,.07,.62);this.put(this.keys,keyCount++,x,y+.19,z-.23,.46,.07,.12);this.put(this.keys,keyCount++,x+.13,y+.19,z+.2,.28,.07,.1);}
   if(!unlocked(state,top)){this.put(this.locks,lockCount++,x-.24,y+.18,z-.22,.30,.07,.28);this.put(this.locks,lockCount++,x-.24,y+.23,z-.33,.18,.12,.07);}
  });
  this.visibleCells=state.board.map(cell=>cell.length?{...cell[0],y:.43+cell.length*.13}:null);
  [this.supports,...this.voxels,...this.glyphs,this.armor,this.keys,this.locks].forEach(mesh=>{mesh.instanceMatrix.needsUpdate=true;});
  this.supports.count=supportCount;this.armor.count=armorCount;this.keys.count=keyCount;this.locks.count=lockCount;counts.forEach((n,i)=>{this.voxels[i].count=n;this.glyphs[i].count=n;});
  this.shutters.forEach((mesh,i)=>{mesh.visible=state.shutters;mesh.material=i%2===gatePhase(state)?this.mats.open:this.mats.shut;mesh.scale.y=i%2===gatePhase(state)?.08:.5;});
  const conveyorTime=this.reducedMotion?0:state.ticks*RULES.nodesPerSecond/RULES.hz;
  for(let i=0;i<80;i++){const p=beltPosition(i*.5+(state.reverse?-conveyorTime:conveyorTime));this.put(this.slats,i,p.x,.205,p.z,1.06,.035,.065,0,p.heading);}
  this.slats.count=80;this.slats.instanceMatrix.needsUpdate=true;
  // Keep model identities attached to courier IDs when active[] compacts.
  const liveIds=new Set(state.active.map(u=>u.id));
  this.couriers.forEach(model=>{if(!liveIds.has(model.id)){model.id=null;model.root.visible=false;}});
  for(const unit of state.active){
   const model=this.couriers.find(m=>m.id===unit.id)||this.couriers.find(m=>m.id==null);if(!model)continue;
   model.id=unit.id;model.root.visible=true;
   let progress=unit.age*RULES.nodesPerSecond/RULES.hz;if(state.reverse)progress=39-progress;const p=beltPosition(progress);
   const recent=this.effects.findLast(e=>e.id===unit.id&&e.age<.18);
   model.root.position.set(p.x,.19+(this.reducedMotion?0:Math.sin(unit.age*.26)*.045),p.z);
   model.root.scale.setScalar(launchScale(unit.age,this.reducedMotion));
   model.root.rotation.y=recent?Math.atan2(recent.tx-p.x,recent.tz-p.z):p.heading;
   model.tank.material=this.paints[unit.color];model.nozzle.scale.z=.57-(recent&&!this.reducedMotion ? .06*(1-recent.age/.18):0);
   model.tail.rotation.z=this.reducedMotion?0:Math.sin(unit.age*.08)*.18;
   model.legs.forEach((leg,k)=>leg.rotation.x=this.reducedMotion?0:Math.sin(unit.age*.2+k%2*Math.PI)*.2);
   this.updateLabel(model,`${SYMBOLS[unit.color]} ${unit.ammo}`);
  }
  let bi=0,hi=0,pi=0,ri=0;
  for(const e of this.effects){
   const f=shotFrame(e,this.reducedMotion);
   if(!f.impact){
    const heading=Math.atan2(e.tx-e.x,e.tz-e.z),size=VISUALS.projectileSize;
    this.put(this.shotBorders,hi,f.x,f.y-.10,f.z,size+.14,.045,size+.14,0,heading);
    this.put(this.shotHeads,hi,f.x,f.y,f.z,size,.22,size,0,heading);this.paint(this.shotHeads,hi,e.color);
    this.put(this.shotCores,hi++,f.x,f.y+.125,f.z,.11,.04,.11);
    if(!this.reducedMotion){const length=Math.min(.9,Math.hypot(e.tx-e.x,e.tz-e.z)*f.progress);this.put(this.beams,bi,f.x-Math.sin(heading)*length*.5,f.y-.025,f.z-Math.cos(heading)*length*.5,VISUALS.trailWidth,.07,Math.max(.001,length),0,heading);this.paint(this.beams,bi++,e.color);}
   }else{
    const p=Math.min(1,f.burst),scale=.6+p*.8;
    this.put(this.rings,ri,e.tx,e.ty-.03,e.tz,scale,scale,1,-Math.PI/2);this.paint(this.rings,ri++,e.color);
    if(!this.reducedMotion)for(let j=0;j<(e.cleared?4:2);j++){
     const angle=j*Math.PI/2+e.index*.37,radius=p*.85,size=(1-p)*.20;
     this.put(this.sparkles,pi,e.tx+Math.cos(angle)*radius,e.ty+Math.sin(p*Math.PI)*.6,e.tz+Math.sin(angle)*radius,size,size,size,p*6,j+p*3);this.paint(this.sparkles,pi++,e.color);
    }
   }
  }
  for(const [mesh,count] of [[this.beams,bi],[this.shotHeads,hi],[this.shotBorders,hi],[this.shotCores,hi],[this.sparkles,pi],[this.rings,ri]]){
   mesh.count=count;mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;
  }
  this.renderer.render(this.scene,this.camera);
 }
 /** Five portraits rendered from this game's actual meshes, not third-party images. */
 portraits(){
  const scene=new T.Scene();scene.background=new T.Color('#203a40');scene.add(new T.HemisphereLight(0xffffff,0x556677,3));const light=new T.DirectionalLight(0xffdfad,1.8);light.position.set(-3,5,5);scene.add(light);
  const model=this.couriers[0],parent=model.root.parent,position=model.root.position.clone(),rotation=model.root.rotation.clone(),scale=model.root.scale.clone(),visible=model.root.visible;
  scene.add(model.root);model.root.position.set(0,0,0);model.root.rotation.set(0,0,0);model.root.scale.setScalar(1);model.root.visible=true;model.label.visible=false;
  const camera=new T.OrthographicCamera(-1.35,1.35,1.55,-1.15,.1,20);camera.position.set(3,2.8,4);camera.lookAt(0,.75,0);
  const out=[];try{this.renderer.setSize(128,128,false);for(let i=0;i<5;i++){model.tank.material=this.paints[i];this.renderer.render(scene,camera);out.push(this.canvas.toDataURL('image/webp',.85));}}
  finally{parent.add(model.root);model.root.position.copy(position);model.root.rotation.copy(rotation);model.root.scale.copy(scale);model.root.visible=visible;model.label.visible=true;this.width=0;this.resize();}return out;
 }
 stats(){return {contexts:this.dead?0:1,drawCalls:this.renderer?.info.render.calls||0,triangles:this.renderer?.info.render.triangles||0,geometries:this.renderer?.info.memory.geometries||0,textures:this.renderer?.info.memory.textures||0,programs:this.renderer?.info.programs?.length||0,effects:this.effects.length,projectiles:this.shotHeads?.count||0,visualVersion:3,owned:this.resourcesOwned.size};}
 dispose(){if(this.dead)return;this.dead=true;this.observer?.disconnect();this.canvas?.removeEventListener('webglcontextlost',this.lost);this.effects=[];this.visibleCells=[];this.last=null;
  for(const resource of this.resourcesOwned)resource.dispose?.();this.resourcesOwned.clear();this.scene?.clear();this.renderer?.renderLists?.dispose();this.renderer?.dispose();this.renderer?.forceContextLoss();this.canvas?.remove();
 }
}
