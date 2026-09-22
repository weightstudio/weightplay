import * as T from './vendor/three/three.module.min.js';
import {COLORS,SYMBOLS} from './levels.mjs';
import {RULES,gatePhase,unlocked} from './engine.mjs';
const POINTS=Array.from({length:40},(_,i)=>{const s=Math.floor(i/10),n=i%10;return s===0?[-6,4.5-n]:s===1?[-4.5+n,-6]:s===2?[6,-4.5+n]:[4.5-n,6];});
export function beltPosition(progress){const p=((progress%40)+40)%40,i=Math.floor(p),f=p-i,a=POINTS[i],b=POINTS[(i+1)%40];return {x:a[0]+(b[0]-a[0])*f,z:a[1]+(b[1]-a[1])*f,heading:Math.atan2(b[0]-a[0],b[1]-a[1])};}
/** All game outcomes come from engine.mjs. This class owns only graphics. */
export class Arena{
 constructor(host,{onLost=()=>{},reducedMotion=false}={}){
  this.host=host;this.dead=false;this.reducedMotion=reducedMotion;this.resourcesOwned=new Set();this.effects=[];this.previousTicks=0;this.last=null;
  try{
   this.renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
   this.renderer.outputColorSpace=T.SRGBColorSpace;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.12;
   this.canvas=this.renderer.domElement;this.canvas.setAttribute('aria-hidden','true');host.append(this.canvas);
   this.lost=e=>{e.preventDefault();if(!this.dead)onLost();};this.canvas.addEventListener('webglcontextlost',this.lost);
   this.scene=new T.Scene();this.scene.background=new T.Color('#233c48');this.camera=new T.OrthographicCamera(-8,8,8,-8,.1,100);this.camera.position.set(0,24,11);this.camera.lookAt(0,0,0);
   this.scene.add(new T.HemisphereLight(0xf4ffec,0x263343,2.5));const sun=new T.DirectionalLight(0xffecc6,3);sun.position.set(-8,15,9);this.scene.add(sun);
   const fill=new T.DirectionalLight(0xbbe6ff,1.1);fill.position.set(8,8,-8);this.scene.add(fill);
   this.box=this.own(new T.BoxGeometry(1,1,1));this.plane=this.own(new T.PlaneGeometry(1,1));this.dummy=new T.Object3D();
   this.mats={stone:this.mat('#395668'),floor:this.mat('#283e49'),cream:this.mat('#fff0d3'),fur:this.mat('#cf7044'),ear:this.mat('#54392e'),ink:this.mat('#172939'),belt:this.mat('#527885'),steel:this.mat('#bcd7d7'),gold:this.mat('#f1c861'),open:this.mat('#64d4aa'),shut:this.mat('#f28d73')};
   this.paints=COLORS.map(c=>this.mat(c));
   this.scene.add(this.cube(this.mats.floor,16,.3,16,0,-.4,0),this.cube(this.mats.stone,10.8,.4,10.8,0,0,0),this.cube(this.mats.cream,10.25,.08,10.25,0,.23,0));
   this.tiles=this.instances(this.mats.belt,44);
   POINTS.forEach(([x,z],i)=>this.put(this.tiles,i,x,.07,z,i<10||i>=20&&i<30?1.48:.98,.22,i<10||i>=20&&i<30?.98:1.48));
   [[-5.65,-5.65],[5.65,-5.65],[5.65,5.65],[-5.65,5.65]].forEach(([x,z],i)=>this.put(this.tiles,40+i,x,.07,z,1.35,.22,1.35));this.tiles.count=44;this.tiles.instanceMatrix.needsUpdate=true;
   this.supports=this.instances(this.mats.stone,100);this.voxels=this.paints.map(m=>this.instances(m,100));
   this.glyphs=SYMBOLS.map((glyph,i)=>{const texture=this.textTexture(glyph,128,COLORS[i]);const mat=this.own(new T.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false}));return this.instances(mat,100,this.plane);});
   this.armor=this.instances(this.mats.cream,200);this.keys=this.instances(this.mats.gold,24);this.locks=this.instances(this.mats.ink,200);
   this.shutters=Array.from({length:4},(_,i)=>{const side=i%2===0;const mesh=this.cube(this.mats.open,side?.1:10.2,.16,side?10.2:.1,side?(i===0?-5.3:5.3):0,.39,side?0:(i===1?-5.3:5.3));this.scene.add(mesh);return mesh;});
   this.couriers=Array.from({length:4},()=>{const unit=this.fox();this.scene.add(unit.root);return unit;});
   this.beams=this.instances(this.mats.cream,64);this.sparkles=this.instances(this.mats.gold,64);
   this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(host);this.resize();
  }catch(error){this.dispose();throw error;}
 }
 own(value){this.resourcesOwned.add(value);return value;}
 mat(color){return this.own(new T.MeshStandardMaterial({color,roughness:.75,metalness:.04}));}
 cube(mat,w,h,d,x=0,y=0,z=0){const mesh=new T.Mesh(this.box,mat);mesh.scale.set(w,h,d);mesh.position.set(x,y,z);return mesh;}
 instances(material,count,geometry=this.box){const mesh=new T.InstancedMesh(geometry,material,count);mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);mesh.frustumCulled=false;mesh.count=0;this.scene.add(mesh);this.resourcesOwned.add(mesh);return mesh;}
 put(mesh,i,x,y,z,w,h,d,rx=0,ry=0,rz=0){const o=this.dummy;o.position.set(x,y,z);o.scale.set(w,h,d);o.rotation.set(rx,ry,rz);o.updateMatrix();mesh.setMatrixAt(i,o.matrix);}
 textTexture(text,size=128,bg=null){const canvas=document.createElement('canvas');canvas.width=canvas.height=size;const c=canvas.getContext('2d');if(bg){c.fillStyle=bg;c.fillRect(0,0,size,size);}c.fillStyle='#182b3c';c.font=`900 ${size*.66}px system-ui`;c.textAlign='center';c.textBaseline='middle';c.fillText(text,size/2,size*.52);const texture=this.own(new T.CanvasTexture(canvas));texture.colorSpace=T.SRGBColorSpace;return texture;}
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
 draw(state,events=[],delta=0){
  if(this.dead)return;this.last=state;
  if(state.ticks<this.previousTicks)this.effects=[];this.previousTicks=state.ticks;
  const counts=Array(5).fill(0);let supportCount=0,armorCount=0,keyCount=0,lockCount=0;
  state.board.forEach((cell,index)=>{if(!cell.length)return;const x=index%10-4.5,z=Math.floor(index/10)-4.5,y=.43+cell.length*.13,top=cell[0],i=counts[top.color]++;
   this.put(this.supports,supportCount++,x,y/2,z,.82,y,.82);this.put(this.voxels[top.color],i,x,y,z,.88,.23,.88);this.put(this.glyphs[top.color],i,x,y+.12,z,.56,.56,1,-Math.PI/2);
   if(top.hp===2){this.put(this.armor,armorCount++,x-.32,y+.15,z-.31,.16,.06,.16);this.put(this.armor,armorCount++,x+.32,y+.15,z+.31,.16,.06,.16);}
   if(top.key){this.put(this.keys,keyCount++,x,y+.19,z,.14,.07,.62);this.put(this.keys,keyCount++,x,y+.19,z-.23,.46,.07,.12);this.put(this.keys,keyCount++,x+.13,y+.19,z+.2,.28,.07,.1);}
   if(!unlocked(state,top)){this.put(this.locks,lockCount++,x,y+.18,z,.52,.07,.52);this.put(this.locks,lockCount++,x,y+.23,z-.2,.3,.16,.09);}
  });
  [this.supports,...this.voxels,...this.glyphs,this.armor,this.keys,this.locks].forEach(mesh=>{mesh.instanceMatrix.needsUpdate=true;});
  this.supports.count=supportCount;this.armor.count=armorCount;this.keys.count=keyCount;this.locks.count=lockCount;counts.forEach((n,i)=>{this.voxels[i].count=n;this.glyphs[i].count=n;});
  this.shutters.forEach((mesh,i)=>{mesh.visible=state.shutters;mesh.material=i%2===gatePhase(state)?this.mats.open:this.mats.shut;mesh.scale.y=i%2===gatePhase(state)?.08:.5;});
  this.couriers.forEach((model,i)=>{const unit=state.active[i];model.root.visible=Boolean(unit);if(!unit)return;
   let progress=unit.age*RULES.nodesPerSecond/RULES.hz;if(state.reverse)progress=39-progress;const p=beltPosition(progress);
   model.root.position.set(p.x,.19,p.z);model.root.rotation.y=p.heading;model.tank.material=this.paints[unit.color];
   model.tail.rotation.z=this.reducedMotion?0:Math.sin(unit.age*.08)*.12;model.legs.forEach((leg,k)=>leg.rotation.x=this.reducedMotion?0:Math.sin(unit.age*.2+k%2*Math.PI)*.15);
   this.updateLabel(model,`${SYMBOLS[unit.color]} ${unit.ammo}`);
  });
  for(const e of events)if(e.type==='hit'&&this.effects.length<64){const from=beltPosition(e.node);this.effects.push({age:0,x:from.x,z:from.z,tx:e.index%10-4.5,tz:Math.floor(e.index/10)-4.5,color:e.color,cleared:e.cleared});}
  let bi=0,pi=0;this.effects=this.effects.filter(e=>(e.age+=delta)<.22);
  for(const e of this.effects){if(e.age<.10){const dx=e.tx-e.x,dz=e.tz-e.z;this.put(this.beams,bi++,(e.x+e.tx)/2,.75,(e.z+e.tz)/2,.055,.055,Math.hypot(dx,dz),0,Math.atan2(dx,dz));}if(e.cleared&&!this.reducedMotion)this.put(this.sparkles,pi++,e.tx,.8+e.age*2,e.tz,.15,.15,.15,e.age*9,e.age*5);}
  this.beams.count=bi;this.sparkles.count=pi;this.beams.instanceMatrix.needsUpdate=true;this.sparkles.instanceMatrix.needsUpdate=true;this.renderer.render(this.scene,this.camera);
 }
 /** Five portraits rendered from this game's actual meshes, not third-party images. */
 portraits(){
  const scene=new T.Scene();scene.background=new T.Color('#dfeae2');scene.add(new T.HemisphereLight(0xffffff,0x556677,3));const light=new T.DirectionalLight(0xffecc6,3);light.position.set(-3,5,5);scene.add(light);
  const model=this.couriers[0],parent=model.root.parent,position=model.root.position.clone(),rotation=model.root.rotation.clone(),visible=model.root.visible;
  scene.add(model.root);model.root.position.set(0,0,0);model.root.rotation.set(0,0,0);model.root.visible=true;model.label.visible=false;
  const camera=new T.OrthographicCamera(-1.35,1.35,1.55,-1.15,.1,20);camera.position.set(3,2.8,4);camera.lookAt(0,.75,0);
  const out=[];try{this.renderer.setSize(128,128,false);for(let i=0;i<5;i++){model.tank.material=this.paints[i];this.renderer.render(scene,camera);out.push(this.canvas.toDataURL('image/webp',.85));}}
  finally{parent.add(model.root);model.root.position.copy(position);model.root.rotation.copy(rotation);model.root.visible=visible;model.label.visible=true;this.width=0;this.resize();}return out;
 }
 stats(){return {contexts:this.dead?0:1,drawCalls:this.renderer?.info.render.calls||0,triangles:this.renderer?.info.render.triangles||0,geometries:this.renderer?.info.memory.geometries||0,textures:this.renderer?.info.memory.textures||0,programs:this.renderer?.info.programs?.length||0,effects:this.effects.length,owned:this.resourcesOwned.size};}
 dispose(){if(this.dead)return;this.dead=true;this.observer?.disconnect();this.canvas?.removeEventListener('webglcontextlost',this.lost);this.effects=[];this.last=null;
  for(const resource of this.resourcesOwned)resource.dispose?.();this.resourcesOwned.clear();this.scene?.clear();this.renderer?.renderLists?.dispose();this.renderer?.dispose();this.renderer?.forceContextLoss();this.canvas?.remove();
 }
}
