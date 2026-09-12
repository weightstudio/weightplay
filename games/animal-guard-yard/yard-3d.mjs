import * as THREE from '../animal-skyspire-drop/vendor/three/three.module.min.js';
import {modelParts,MODEL_KEYS} from './block-models.mjs';
export function mergeParts(parts){
 const source=new THREE.BoxGeometry(1,1,1).toNonIndexed(),p=[],n=[],c=[];
 for(const [x,y,z,w,h,d,colour] of parts){const color=new THREE.Color(colour);for(let i=0;i<source.attributes.position.count;i++){p.push(source.attributes.position.getX(i)*w+x,source.attributes.position.getY(i)*h+y,source.attributes.position.getZ(i)*d+z);n.push(source.attributes.normal.getX(i),source.attributes.normal.getY(i),source.attributes.normal.getZ(i));c.push(color.r,color.g,color.b);}}
 source.dispose();const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(n,3));g.setAttribute('color',new THREE.Float32BufferAttribute(c,3));return g;
}
function light(scene){scene.add(new THREE.HemisphereLight('#d8f1ff','#334845',2));const sun=new THREE.DirectionalLight('#ffe6b0',3.2);sun.position.set(-7,12,8);scene.add(sun);const rim=new THREE.DirectionalLight('#78c7dc',1.2);rim.position.set(8,5,-8);scene.add(rim);}
export function renderPortraits(){
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});renderer.setSize(256,256);renderer.outputColorSpace=THREE.SRGBColorSpace;
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(28,1,.1,50);camera.position.set(2,1.9,4);camera.lookAt(0,.85,0);light(scene);const mat=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.8});const result={};
 for(const key of MODEL_KEYS){const g=mergeParts(modelParts(key)),m=new THREE.Mesh(g,mat);scene.add(m);const bounds=new THREE.Box3().setFromObject(m),center=bounds.getCenter(new THREE.Vector3()),size=bounds.getSize(new THREE.Vector3());const distance=Math.max(size.x,size.y,size.z)*2.7;camera.position.copy(center).add(new THREE.Vector3(2,1.1,4).normalize().multiplyScalar(distance));camera.lookAt(center);renderer.render(scene,camera);result[key]=renderer.domElement.toDataURL('image/png');scene.remove(m);g.dispose();}mat.dispose();renderer.dispose();renderer.forceContextLoss();return result;
}
class Yard3D{
 constructor(host){
  this.host=host;this.resources=[];this.actors=new Map();this.geometries=new Map();this.dead=false;this.lastSize='';
  this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));this.renderer.outputColorSpace=THREE.SRGBColorSpace;
  this.renderer.domElement.className='yard-3d-canvas';this.renderer.domElement.setAttribute('aria-hidden','true');host.prepend(this.renderer.domElement);
  this.scene=new THREE.Scene();this.scene.background=new THREE.Color('#18382f');light(this.scene);this.camera=new THREE.OrthographicCamera(-4.5,4.5,4.5,-4.5,.1,100);this.camera.position.set(0,20,12);this.camera.lookAt(0,0,0);
  this.mat=this.own(new THREE.MeshStandardMaterial({vertexColors:true,roughness:.88}));this.box=this.own(new THREE.BoxGeometry(1,1,1));this.stageGroup=new THREE.Group();this.scene.add(this.stageGroup);
  this.fxMat=this.own(new THREE.MeshBasicMaterial({color:'#ffe197'}));this.shots=Array.from({length:72},()=>{const m=new THREE.Mesh(this.box,this.fxMat);m.visible=false;this.scene.add(m);return m;});
  this.shotMats={cat:this.fxMat,owl:this.own(new THREE.MeshBasicMaterial({color:'#8be8e0'})),fox:this.own(new THREE.MeshBasicMaterial({color:'#bce589'}))};
  this.onLost=e=>{e.preventDefault();this.dispose();host.dataset.renderer='fallback';};this.renderer.domElement.addEventListener('webglcontextlost',this.onLost);
  host.dataset.renderer='3d';window.guardYardRenderStats={active:1,drawCalls:0,geometries:0};
 }
 own(r){this.resources.push(r);return r;}
 geom(kind){if(!this.geometries.has(kind))this.geometries.set(kind,this.own(mergeParts(modelParts(kind))));return this.geometries.get(kind);}
 rebuild(w,h,rows,cols,blocked){
  const key=`${w}:${h}:${rows}:${cols}`;if(key===this.lastSize)return;this.lastSize=key;this.renderer.setSize(w,h,false);const viewH=9*h/w;this.depth=viewH/.857493;this.camera.top=viewH/2;this.camera.bottom=-viewH/2;this.camera.updateProjectionMatrix();
  for(const m of this.stageGroup.children){m.geometry.dispose();}this.stageGroup.clear();const parts=[];
  for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
   const x=(col+.5)/cols*9-4.5,z=((row+.5)/rows-.5)*this.depth;
   parts.push([x,-.14,z,9/cols-.025,.2,this.depth/rows-.04,row%2?'#294939':'#35533c']);
   parts.push([x,-.015,z,9/cols-.11,.035,this.depth/rows-.18,(row+col)%2?'#496342':'#54714b']);
   // Inlaid stepping stones and tiny authored grass tufts make the lanes read horizontally.
   parts.push([x,.015,z,9/cols-.3,.05,.28,'#7d8975']);
   const edge=z-this.depth/rows*.36;
   for(let i=0;i<3;i++)parts.push([x-.32+i*.16,.065,edge,.055,.15+i*.025,.06,'#728c49']);
   if((row+col)%4===0){parts.push([x+.35,.075,edge,.09,.18,.08,'#658242']);parts.push([x+.35,.19,edge,.13,.09,.13,'#d2b369']);}
   if(blocked?.some(c=>c[0]===row&&c[1]===col))for(const a of modelParts('stone'))parts.push([a[0]*.65+x,a[1]*.65,a[2]*.65+z,a[3]*.65,a[4]*.65,a[5]*.65,a[6]]);
  }
  for(const s of [-1,1])for(let i=0;i<rows;i++){const z=((i+.5)/rows-.5)*this.depth;parts.push([s*4.48,.02,z,.12,.2,this.depth/rows-.02,'#294f4a']);}
  const ground=new THREE.Mesh(mergeParts(parts),this.mat);this.stageGroup.add(ground);
 }
 render(state){if(this.dead)return;const w=this.host.clientWidth,h=this.host.clientHeight;if(!w||!h)return;this.rebuild(w,h,state.rows,state.cols,state.blocked);const alive=new Set();
  for(const e of state.entities){if(e.dead||e.hp<=0)continue;alive.add(e);let m=this.actors.get(e);if(!m){m=new THREE.Mesh(this.geom(e.kind==='guard'?e.id:e.type),this.mat);this.scene.add(m);this.actors.set(e,m);}
   const scale=(e.isBoss?1.1:.94)*Math.min(1,this.depth/state.rows/1.7),x=e.kind==='guard'?(e.col+.5)/state.cols:e.x;
   const hit=e.hitMs>0&&!state.reduced?Math.sin(e.hitMs*.04)*.045:0;
   m.scale.setScalar(scale);m.position.set((x-.5)*9+hit,0,((e.row+.5)/state.rows-.5)*this.depth+scale*.47);
   m.rotation.y=e.kind==='guard'?.85:-.85;m.rotation.z=hit*.6;
   if(e.attackCount!==m.userData.attackCount){m.userData.attackCount=e.attackCount;m.userData.attackUntil=state.time+110;}
   if(!state.reduced&&m.userData.attackUntil>state.time)m.rotation.z-=.07;
   if(e.shellClosed)m.scale.y*=.78;
   if(e.burrowWarned||e.rushChargeMs>0)m.position.y=state.reduced?0:.04+Math.sin(state.time*.022)*.035;
   e.hpEl.dataset.effect=e.shellClosed?'shield':e.burrowWarned||e.rushChargeMs>0?'warning':e.slowMs>0||e.roarSlowMs>0?'slow':'';
  }
  for(const [e,m] of this.actors)if(!alive.has(e)){this.scene.remove(m);this.actors.delete(e);}
  this.shots.forEach((m,i)=>{const shot=state.projectiles[i];m.visible=!!shot;if(shot){m.material=this.shotMats[shot.unitId]||this.fxMat;m.scale.set(shot.isPiercing?.26:.13,.1,.1);m.position.set((shot.x-.5)*9,.55,(shot.y-.5)*this.depth+.33);m.rotation.z=state.reduced?0:state.time*.005;}});
  this.renderer.render(this.scene,this.camera);window.guardYardRenderStats={active:1,drawCalls:this.renderer.info.render.calls,geometries:this.renderer.info.memory.geometries,triangles:this.renderer.info.render.triangles,actors:this.actors.size};
 }
 dispose(){if(this.dead)return;this.dead=true;this.renderer.domElement.removeEventListener('webglcontextlost',this.onLost);for(const m of this.stageGroup.children)m.geometry.dispose();for(const r of this.resources)r.dispose();this.actors.clear();this.geometries.clear();this.renderer.dispose();this.renderer.forceContextLoss();this.renderer.domElement.remove();this.host.dataset.renderer='fallback';window.guardYardRenderStats={active:0,drawCalls:0,geometries:0,actors:0};}
}
window.GuardYard3D=Yard3D;
window.dispatchEvent(new Event('guard-yard-3d-ready'));
