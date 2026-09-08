// Prototype uses the repository-pinned Three r180 runtime, read-only.
import * as THREE from '../animal-skyspire-drop/vendor/three/three.module.min.js';
export class ChessBoard3D {
 constructor(host,{onSquare=()=>{},onUnavailable=()=>{}}={}){
  this.host=host;this.onSquare=onSquare;this.disposed=false;
  this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));this.renderer.setClearColor(0x081c24);
  this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;this.renderer.outputColorSpace=THREE.SRGBColorSpace;
  host.append(this.renderer.domElement);this.renderer.domElement.style.cssText='width:100%;height:100%;display:block;touch-action:none';
  this.scene=new THREE.Scene();this.camera=new THREE.OrthographicCamera(-5.6,5.6,5.6,-5.6,.1,50);this.camera.position.set(0,13,8.8);this.camera.lookAt(0,0,0);
  this.scene.add(new THREE.HemisphereLight(0xfff4db,0x124453,2.4));const light=new THREE.DirectionalLight(0xffefd5,3.1);light.position.set(-4,10,5);light.castShadow=true;light.shadow.mapSize.set(1024,1024);light.shadow.camera.left=-6;light.shadow.camera.right=6;light.shadow.camera.top=6;light.shadow.camera.bottom=-6;this.scene.add(light);this.light=light;
  this.materials={ivory:new THREE.MeshStandardMaterial({color:0xf6dfac,metalness:.22,roughness:.32}),dark:new THREE.MeshStandardMaterial({color:0x153f4e,metalness:.38,roughness:.26}),gold:new THREE.MeshStandardMaterial({color:0xc99b49,metalness:.72,roughness:.3}),wood:new THREE.MeshStandardMaterial({color:0x362a20,roughness:.48}),lightTile:new THREE.MeshStandardMaterial({color:0xccbf9f,roughness:.54}),darkTile:new THREE.MeshStandardMaterial({color:0x174c43,roughness:.5}),mark:new THREE.MeshBasicMaterial({color:0xefd375,transparent:true,opacity:.7})};
  const mesh=(g,m,x,y,z)=>{const a=new THREE.Mesh(g,m);a.position.set(x,y,z);a.receiveShadow=true;this.scene.add(a);return a;};
  mesh(new THREE.BoxGeometry(8.6,.35,8.6),this.materials.wood,0,-.2,0);mesh(new THREE.BoxGeometry(8.35,.12,8.35),this.materials.gold,0,-.04,0);
  const tile=new THREE.BoxGeometry(.99,.08,.99);for(let r=0;r<8;r++)for(let c=0;c<8;c++)mesh(tile,(r+c)%2?this.materials.darkTile:this.materials.lightTile,c-3.5,.04,r-3.5);
  this.focusMarks=new THREE.Group();this.scene.add(this.focusMarks);
  this.materials.focus=new THREE.MeshBasicMaterial({color:0x64eaff,depthTest:false});
  this.pieces=new THREE.Group();this.scene.add(this.pieces);this.markers=new THREE.Group();this.scene.add(this.markers);
  this.geometries=new Map();this.ray=new THREE.Raycaster();this.pointer=new THREE.Vector2();this.plane=new THREE.Plane(new THREE.Vector3(0,1,0),-.09);
  this.click=e=>{if(this.disposed)return;const r=this.renderer.domElement.getBoundingClientRect();this.pointer.set((e.clientX-r.left)/r.width*2-1,1-(e.clientY-r.top)/r.height*2);this.ray.setFromCamera(this.pointer,this.camera);const hit=this.ray.intersectObjects(this.pieces.children,true)[0];if(hit){let piece=hit.object;while(piece.parent&&piece.parent!==this.pieces)piece=piece.parent;if(piece.userData.square){this.onSquare(piece.userData.square);return;}}const point=new THREE.Vector3();if(!this.ray.ray.intersectPlane(this.plane,point))return;const c=Math.floor(point.x+4),row=Math.floor(point.z+4);if(c>=0&&c<8&&row>=0&&row<8)this.onSquare(String.fromCharCode(97+c)+(8-row));};
  this.renderer.domElement.addEventListener('pointerup',this.click);
  this.contextLost=e=>{e.preventDefault();if(!this.disposed)onUnavailable();};this.renderer.domElement.addEventListener('webglcontextlost',this.contextLost);
  this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(host);this.resize();
 }
 geometry(key,make){if(!this.geometries.has(key))this.geometries.set(key,make());return this.geometries.get(key);}
 piece(type,color){
  const g=new THREE.Group(),m=this.materials[color==='w'?'ivory':'dark'];
  const add=(key,make,y=0,material=m,x=0,z=0)=>{const mesh=new THREE.Mesh(this.geometry(key,make),material);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;g.add(mesh);return mesh;};
  const height={p:.58,n:.88,b:1,r:.82,q:1.16,k:1.25}[type];
  const profile=[[.29,0],[.32,.035],[.32,.11],[.27,.15],[.22,.19],[.16,.27],[.105,height*.7],[.18,height*.77],[.19,height*.82]];
  add(`body-${type}`,()=>new THREE.LatheGeometry(profile.map(([x,y])=>new THREE.Vector2(x,y)),24));
  add('base-ring',()=>new THREE.TorusGeometry(.29,.02,6,24),.13,this.materials.gold).rotation.x=Math.PI/2;
  if(type==='p')add('pawn-head',()=>new THREE.SphereGeometry(.18,20,12),.56);
  if(type==='b'){const top=add('bishop-head',()=>new THREE.SphereGeometry(.2,20,12),.94);top.scale.set(.85,1.5,.85);add('bishop-cap',()=>new THREE.SphereGeometry(.065,12,8),1.24);}
  if(type==='r'){add('rook-top',()=>new THREE.CylinderGeometry(.26,.23,.18,24),.76);for(let i=0;i<6;i++){const a=i*Math.PI/3;add('rook-tooth',()=>new THREE.BoxGeometry(.13,.16,.13),.9,m,Math.sin(a)*.18,Math.cos(a)*.18);}}
  if(type==='q'){add('queen-crown',()=>new THREE.CylinderGeometry(.26,.16,.19,24),1.06);for(let i=0;i<8;i++){const a=i*Math.PI/4;add('queen-tip',()=>new THREE.SphereGeometry(.047,10,8),1.19,m,Math.sin(a)*.2,Math.cos(a)*.2);}add('queen-orb',()=>new THREE.SphereGeometry(.075,12,8),1.24);}
  if(type==='k'){add('king-crown',()=>new THREE.CylinderGeometry(.22,.16,.15,24),1.15);add('king-cross-v',()=>new THREE.BoxGeometry(.075,.3,.075),1.36);add('king-cross-h',()=>new THREE.BoxGeometry(.25,.075,.075),1.42);}
  if(type==='n'){
   const s=new THREE.Shape();s.moveTo(-.19,0);s.lineTo(-.2,.32);s.lineTo(-.1,.65);s.lineTo(-.13,.85);s.lineTo(.02,.78);s.lineTo(.2,.68);s.lineTo(.3,.4);s.lineTo(.17,.35);s.lineTo(.06,.46);s.lineTo(.03,.28);s.lineTo(.18,.03);s.closePath();
   const head=add('knight-head',()=>new THREE.ExtrudeGeometry(s,{depth:.19,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.035,bevelThickness:.03}),.32);head.position.z=-.095;if(color==='b')g.rotation.y=Math.PI;
  }
  return g;
 }
 setPosition(board,legal=[]){if(this.disposed)return;cancelAnimationFrame(this.animation);this.animation=null;this.pieces.clear();this.markers.clear();for(const row of board)for(const p of row)if(p){const piece=this.piece(p.type,p.color);piece.position.set(p.square.charCodeAt(0)-97-3.5,.09,8-Number(p.square[1])-3.5);piece.userData.square=p.square;this.pieces.add(piece);}
  for(const square of legal){const mark=new THREE.Mesh(this.geometry('marker',()=>new THREE.RingGeometry(.25,.33,24)),this.materials.mark);mark.rotation.x=-Math.PI/2;mark.position.set(square.charCodeAt(0)-97-3.5,.09,8-Number(square[1])-3.5);this.markers.add(mark);}this.render();
 }
 setFocus(square,selected){if(this.disposed)return;this.focusMarks.clear();for(const [s,material,radius] of [[square,this.materials.focus,.46],[selected,this.materials.mark,.39]]){if(!s)continue;const ring=new THREE.Mesh(this.geometry('focus-'+radius,()=>new THREE.RingGeometry(radius-.035,radius,4,1,Math.PI/4)),material);ring.rotation.x=-Math.PI/2;ring.position.set(s.charCodeAt(0)-97-3.5,.105,8-Number(s[1])-3.5);ring.renderOrder=2;this.focusMarks.add(ring);}this.render();}
 resize(){if(this.disposed)return;const r=this.host.getBoundingClientRect();if(!r.width||!r.height)return;this.renderer.setSize(r.width,r.height,false);const aspect=r.width/r.height,half=4.65;this.camera.left=-half*Math.max(1,aspect);this.camera.right=-this.camera.left;this.camera.top=half/Math.min(1,aspect);this.camera.bottom=-this.camera.top;this.camera.updateProjectionMatrix();this.render();}
 animateMove(move){
  if(this.disposed||!move||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  cancelAnimationFrame(this.animation);const piece=this.pieces.children.find(p=>p.userData.square===move.to);if(!piece)return;
  const target=piece.position.clone(),from=target.clone();from.x=move.from.charCodeAt(0)-97-3.5;from.z=8-Number(move.from[1])-3.5;const start=performance.now();
  const frame=now=>{if(this.disposed)return;const t=Math.min(1,(now-start)/180),e=t*t*(3-2*t);piece.position.lerpVectors(from,target,e);piece.position.y=target.y+Math.sin(Math.PI*t)*.12;this.render();if(t<1)this.animation=requestAnimationFrame(frame);else this.animation=null;};this.animation=requestAnimationFrame(frame);
 }
 render(){if(!this.disposed)this.renderer.render(this.scene,this.camera);}
 stats(){return {geometries:this.renderer.info.memory.geometries,textures:this.renderer.info.memory.textures,calls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,pieces:this.pieces.children.length};}
 dispose(){if(this.disposed)return;this.disposed=true;cancelAnimationFrame(this.animation);this.animation=null;this.resizeObserver.disconnect();this.renderer.domElement.removeEventListener('pointerup',this.click);this.renderer.domElement.removeEventListener('webglcontextlost',this.contextLost);const geometries=new Set();this.scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);});for(const g of this.geometries.values())geometries.add(g);for(const g of geometries)g.dispose();for(const m of Object.values(this.materials))m.dispose();this.light.shadow.map?.dispose();this.renderer.dispose();this.renderer.forceContextLoss();this.renderer.domElement.remove();this.scene.clear();this.geometries.clear();}
}
