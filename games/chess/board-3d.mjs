// Prototype uses the repository-pinned Three r180 runtime, read-only.
import * as THREE from '../animal-skyspire-drop/vendor/three/three.module.min.js';
export class ChessBoard3D {
 constructor(host,{onSquare=()=>{},onUnavailable=()=>{}}={}){
  this.host=host;this.onSquare=onSquare;this.disposed=false;try{
  this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));this.renderer.setClearColor(0x081c24);
  this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.15;
  host.append(this.renderer.domElement);this.renderer.domElement.style.cssText='width:100%;height:100%;display:block;touch-action:none';
  this.scene=new THREE.Scene();this.camera=new THREE.OrthographicCamera(-5.6,5.6,5.6,-5.6,.1,50);this.camera.position.set(0,11,9.5);this.camera.lookAt(0,0,0);
  this.scene.add(new THREE.HemisphereLight(0xfff4db,0x124453,.85));const light=new THREE.DirectionalLight(0xffefd5,2.1);light.position.set(-4,10,5);light.castShadow=true;light.shadow.bias=-.0002;light.shadow.normalBias=.025;light.shadow.mapSize.set(1024,1024);light.shadow.camera.left=-6;light.shadow.camera.right=6;light.shadow.camera.top=6;light.shadow.camera.bottom=-6;this.scene.add(light);this.light=light;this.createStudio();
  this.materials={ivory:new THREE.MeshPhysicalMaterial({color:0xf0d7a8,metalness:.08,roughness:.28,clearcoat:.55,clearcoatRoughness:.2}),dark:new THREE.MeshPhysicalMaterial({color:0x123743,metalness:.28,roughness:.24,clearcoat:.65,clearcoatRoughness:.18}),gold:new THREE.MeshStandardMaterial({color:0xc99b49,metalness:.72,roughness:.3}),wood:new THREE.MeshStandardMaterial({color:0x362a20,roughness:.48}),lightTile:new THREE.MeshStandardMaterial({color:0xccbf9f,roughness:.54}),darkTile:new THREE.MeshStandardMaterial({color:0x174c43,roughness:.5}),mark:new THREE.MeshBasicMaterial({color:0xefd375,transparent:true,opacity:.7})};
  this.materials.detail=new THREE.MeshStandardMaterial({color:0x152328,roughness:.4});this.addWoodGrain();this.addStoneGrain();
  this.materials.ivory.envMapIntensity=.65;this.materials.dark.envMapIntensity=.85;
  const mesh=(g,m,x,y,z)=>{const a=new THREE.Mesh(g,m);a.position.set(x,y,z);a.receiveShadow=true;this.scene.add(a);return a;};
  mesh(this.beveledSlab(8.55,.26),this.materials.wood,0,-.2,0);mesh(new THREE.BoxGeometry(8.35,.12,8.35),this.materials.gold,0,-.04,0);
  const tile=new THREE.BoxGeometry(.99,.08,.99);for(let r=0;r<8;r++)for(let c=0;c<8;c++)mesh(tile,(r+c)%2?this.materials.darkTile:this.materials.lightTile,c-3.5,.04,r-3.5);
  this.focusMarks=new THREE.Group();this.scene.add(this.focusMarks);
  this.materials.focus=new THREE.MeshBasicMaterial({color:0x64eaff,depthTest:false});
  this.materials.check=new THREE.MeshBasicMaterial({color:0xff665a,depthTest:false});
  this.materials.impact=new THREE.MeshBasicMaterial({color:0xffce75,transparent:true,opacity:0,depthTest:false});
  this.effects=new THREE.Group();this.scene.add(this.effects);this.checkMarks=new THREE.Group();this.scene.add(this.checkMarks);
  this.pieces=new THREE.Group();this.scene.add(this.pieces);this.markers=new THREE.Group();this.scene.add(this.markers);
  this.geometries=new Map();this.addCoordinates();this.ray=new THREE.Raycaster();this.pointer=new THREE.Vector2();this.plane=new THREE.Plane(new THREE.Vector3(0,1,0),-.09);
  this.click=e=>{if(this.disposed)return;const r=this.renderer.domElement.getBoundingClientRect();this.pointer.set((e.clientX-r.left)/r.width*2-1,1-(e.clientY-r.top)/r.height*2);this.ray.setFromCamera(this.pointer,this.camera);const hit=this.ray.intersectObjects(this.pieces.children,true)[0];if(hit){let piece=hit.object;while(piece.parent&&piece.parent!==this.pieces)piece=piece.parent;if(piece.userData.square){this.onSquare(piece.userData.square);return;}}const point=new THREE.Vector3();if(!this.ray.ray.intersectPlane(this.plane,point))return;const c=Math.floor(point.x+4),row=Math.floor(point.z+4);if(c>=0&&c<8&&row>=0&&row<8)this.onSquare(String.fromCharCode(97+c)+(8-row));};
  this.renderer.domElement.addEventListener('pointerup',this.click);
  this.contextLost=e=>{e.preventDefault();if(!this.disposed)onUnavailable();};this.renderer.domElement.addEventListener('webglcontextlost',this.contextLost);
  this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(host);this.resize();
  }catch(error){this.dispose();throw error;}
 }
 createStudio(){
  const studio=new THREE.Scene();studio.background=new THREE.Color(0x34434a);
  const geometry=new THREE.PlaneGeometry(1,1),materials=[];let generator;
  try{
   for(const [x,y,z,w,h,color,intensity] of [[-6,7,4,5,8,0xffefdb,5],[6,4,-3,3,7,0xb9dfff,3],[0,9,-5,7,2,0xffffff,4]]){
    const material=new THREE.MeshBasicMaterial({color,side:THREE.DoubleSide});material.color.multiplyScalar(intensity);materials.push(material);
    const panel=new THREE.Mesh(geometry,material);panel.position.set(x,y,z);panel.scale.set(w,h,1);panel.lookAt(0,0,0);studio.add(panel);
   }
   generator=new THREE.PMREMGenerator(this.renderer);this.environmentTarget=generator.fromScene(studio,.04);this.scene.environment=this.environmentTarget.texture;
  }finally{generator?.dispose();geometry.dispose();for(const material of materials)material.dispose();studio.clear();}
 }
 beveledSlab(width,height){
  const half=width/2,shape=new THREE.Shape();shape.moveTo(-half,-half);shape.lineTo(half,-half);shape.lineTo(half,half);shape.lineTo(-half,half);shape.closePath();
  const geometry=new THREE.ExtrudeGeometry(shape,{depth:height,steps:1,bevelEnabled:true,bevelSegments:3,bevelSize:.045,bevelThickness:.04});geometry.rotateX(-Math.PI/2);geometry.translate(0,-height/2,0);return geometry;
 }
 addWoodGrain(){
  this.materials.wood.onBeforeCompile=shader=>{
   shader.vertexShader='varying vec3 woodPosition;\n'+shader.vertexShader;
   shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nwoodPosition=position;');
   shader.fragmentShader='varying vec3 woodPosition;\n'+shader.fragmentShader;
   shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\nfloat grain=sin(woodPosition.x*75.0+sin(woodPosition.z*2.5)*3.0);diffuseColor.rgb*=0.86+0.14*grain;');
  };this.materials.wood.customProgramCacheKey=()=> 'chess-wood-v1';
 }
 addStoneGrain(){
  // World-space veins continue naturally across the inlaid stone squares.
  // Bounded analytic surface detail: no texture downloads or animation loop.
  for(const [key,strength] of [['lightTile',.10],['darkTile',.18]]){
   const material=this.materials[key];
   material.roughness=.38;material.envMapIntensity=.45;
   material.onBeforeCompile=shader=>{
    shader.vertexShader='varying vec3 stonePosition;\n'+shader.vertexShader;
    shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nstonePosition=(modelMatrix*vec4(position,1.0)).xyz;');
    shader.fragmentShader='varying vec3 stonePosition;\n'+shader.fragmentShader;
    shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
     vec2 stone=stonePosition.xz;
     float bend=sin(stone.y*2.1+sin(stone.x*1.3)*1.4);
     float vein=pow(0.5+0.5*sin(stone.x*8.0+stone.y*3.0+bend*3.0),12.0);
     float fine=sin(stone.x*43.0+stone.y*27.0+bend)*sin(stone.y*39.0-stone.x*19.0);
     diffuseColor.rgb*=1.0-${strength}*vein+0.012*fine;
    `);
   };
   material.customProgramCacheKey=()=>`chess-stone-v1-${key}`;
  }
 }
 addCoordinates(){
  const glyphs='abcdefgh12345678';
  for(let i=0;i<glyphs.length;i++){
   const canvas=document.createElement('canvas');canvas.width=64;canvas.height=64;
   const ctx=canvas.getContext('2d');ctx.font='bold 48px system-ui';ctx.fillStyle='#ffe7b0';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(glyphs[i],32,32);
   const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
   const material=new THREE.SpriteMaterial({map:texture,depthTest:false});this.materials['coordinate-'+i]=material;
   const label=new THREE.Sprite(material);label.scale.set(.25,.25,1);
   if(i<8)label.position.set(i-3.5,.11,4.18);else label.position.set(-4.19,.11,3.5-(i-8));
   label.renderOrder=3;this.scene.add(label);
  }
 }
 geometry(key,make){if(!this.geometries.has(key))this.geometries.set(key,make());return this.geometries.get(key);}
 softenedBox(width,height,depth){
  const bevel=.009,x=width/2-bevel,y=height/2-bevel,shape=new THREE.Shape();
  shape.moveTo(-x,-y);shape.lineTo(x,-y);shape.lineTo(x,y);shape.lineTo(-x,y);shape.closePath();
  const geometry=new THREE.ExtrudeGeometry(shape,{depth:depth-2*bevel,steps:1,bevelEnabled:true,bevelSegments:2,bevelSize:bevel,bevelThickness:bevel});
  geometry.translate(0,0,-depth/2+bevel);return geometry;
 }
 piece(type,color){
  const g=new THREE.Group(),m=this.materials[color==='w'?'ivory':'dark'];
  const add=(key,make,y=0,material=m,x=0,z=0)=>{const mesh=new THREE.Mesh(this.geometry(key,make),material);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;g.add(mesh);return mesh;};
  const height={p:.58,n:.88,b:1,r:.82,q:1.16,k:1.25}[type];
  const profile=[[.30,0],[.325,.025],[.33,.06],[.325,.10],[.30,.14],[.245,.185],[.22,.205],[.205,.235],[.17,.29],[.13,height*.54],[.115,height*.65],[.135,height*.72],[.18,height*.755],[.195,height*.80],[.18,height*.835]];
  add(`body-${type}`,()=>new THREE.LatheGeometry(profile.map(([x,y])=>new THREE.Vector2(x,y)),40));
  add('base-ring',()=>new THREE.TorusGeometry(.306,.012,8,40),.135,this.materials.gold).rotation.x=Math.PI/2;
  if(type==='p')add('pawn-head',()=>new THREE.SphereGeometry(.18,20,12),.56);
  if(type==='b'){const top=add('bishop-head',()=>new THREE.SphereGeometry(.2,20,12),.94);top.scale.set(.85,1.5,.85);add('bishop-cap',()=>new THREE.SphereGeometry(.065,12,8),1.24);const slit=add('bishop-slit',()=>new THREE.BoxGeometry(.022,.25,.018),1.06,this.materials.detail,0,.163);slit.rotation.z=-.48;}
  if(type==='r'){add('rook-top',()=>new THREE.CylinderGeometry(.26,.23,.18,40),.76);for(let i=0;i<6;i++){const a=i*Math.PI/3;add('rook-tooth',()=>this.softenedBox(.13,.16,.13),.9,m,Math.sin(a)*.18,Math.cos(a)*.18);}}
  if(type==='q'){add('queen-crown',()=>new THREE.CylinderGeometry(.26,.16,.19,24),1.06);for(let i=0;i<8;i++){const a=i*Math.PI/4;add('queen-tip',()=>new THREE.SphereGeometry(.047,10,8),1.19,m,Math.sin(a)*.2,Math.cos(a)*.2);}add('queen-orb',()=>new THREE.SphereGeometry(.075,12,8),1.24);}
  if(type==='k'){add('king-crown',()=>new THREE.CylinderGeometry(.22,.16,.15,40),1.15);add('king-cross-v',()=>this.softenedBox(.075,.3,.075),1.36);add('king-cross-h',()=>this.softenedBox(.25,.075,.075),1.42);}
  if(type==='n'){
   const s=new THREE.Shape();s.moveTo(-.19,0);s.lineTo(-.2,.32);s.lineTo(-.1,.65);s.lineTo(-.13,.85);s.lineTo(.02,.78);s.lineTo(.2,.68);s.lineTo(.3,.4);s.lineTo(.17,.35);s.lineTo(.06,.46);s.lineTo(.03,.28);s.lineTo(.18,.03);s.closePath();
   const head=add('knight-head',()=>new THREE.ExtrudeGeometry(s,{depth:.19,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.035,bevelThickness:.03}),.32);head.position.z=-.095;for(const side of [-1,1])add('knight-eye',()=>new THREE.SphereGeometry(.024,10,6),.93,this.materials.detail,.13,side*.133);if(color==='b')g.rotation.y=Math.PI;
  }
  return g;
 }
 squarePosition(square,y=.09){return new THREE.Vector3(square.charCodeAt(0)-97-3.5,y,8-Number(square[1])-3.5);}
 finishAnimation(){cancelAnimationFrame(this.animation);this.animation=null;this.animationComplete=null;for(const motion of this.motions||[])motion.piece.position.copy(motion.target);this.motions=[];this.effects?.clear();}
 setPosition(board,legal=[],checkedColor=null){if(this.disposed)return;this.finishAnimation();this.pieces.clear();this.markers.clear();this.checkMarks.clear();for(const row of board)for(const p of row)if(p){const piece=this.piece(p.type,p.color);piece.position.set(p.square.charCodeAt(0)-97-3.5,.09,8-Number(p.square[1])-3.5);piece.userData.square=p.square;this.pieces.add(piece);
   if(p.type==='k'&&p.color===checkedColor){const ring=new THREE.Mesh(this.geometry('check-ring',()=>new THREE.RingGeometry(.36,.46,32)),this.materials.check);ring.rotation.x=-Math.PI/2;ring.position.copy(this.squarePosition(p.square,.11));ring.renderOrder=3;ring.userData.square=p.square;this.checkMarks.add(ring);}
  }
  for(const square of legal){const mark=new THREE.Mesh(this.geometry('marker',()=>new THREE.RingGeometry(.25,.33,24)),this.materials.mark);mark.rotation.x=-Math.PI/2;mark.position.set(square.charCodeAt(0)-97-3.5,.09,8-Number(square[1])-3.5);this.markers.add(mark);}this.render();
 }
 setFocus(square,selected){if(this.disposed)return;this.focusMarks.clear();for(const [s,material,radius] of [[square,this.materials.focus,.46],[selected,this.materials.mark,.39]]){if(!s)continue;const ring=new THREE.Mesh(this.geometry('focus-'+radius,()=>new THREE.RingGeometry(radius-.035,radius,4,1,Math.PI/4)),material);ring.rotation.x=-Math.PI/2;ring.position.set(s.charCodeAt(0)-97-3.5,.105,8-Number(s[1])-3.5);ring.renderOrder=2;this.focusMarks.add(ring);}this.render();}
 resize(){if(this.disposed)return;const r=this.host.getBoundingClientRect();if(!r.width||!r.height)return;this.renderer.setSize(r.width,r.height,false);const aspect=r.width/r.height,half=4.65;this.camera.left=-half*Math.max(1,aspect);this.camera.right=-this.camera.left;this.camera.top=half/Math.min(1,aspect);this.camera.bottom=-this.camera.top;this.camera.updateProjectionMatrix();this.render();}
 animateMove(move,onComplete=null){
  if(this.disposed)return;this.finishAnimation();
  if(!move||matchMedia('(prefers-reduced-motion: reduce)').matches){this.render();onComplete?.();return;}
  const piece=this.pieces.children.find(p=>p.userData.square===move.to);if(!piece){this.render();onComplete?.();return;}
  this.animationComplete=onComplete;
  this.motions=[{piece,target:piece.position.clone(),from:this.squarePosition(move.from)}];
  const flags=move.flags||'';
  if(flags.includes('k')||flags.includes('q')){
   const rank=move.to[1],kingSide=flags.includes('k'),rook=this.pieces.children.find(p=>p.userData.square===(kingSide?'f':'d')+rank);
   if(rook)this.motions.push({piece:rook,target:rook.position.clone(),from:this.squarePosition((kingSide?'h':'a')+rank)});
  }
  let impact;
  if(move.captured){
   impact=new THREE.Mesh(this.geometry('capture-ring',()=>new THREE.RingGeometry(.3,.36,32)),this.materials.impact);
   impact.rotation.x=-Math.PI/2;impact.position.copy(this.squarePosition(flags.includes('e')?move.to[0]+move.from[1]:move.to,.12));impact.renderOrder=4;this.effects.add(impact);
  }
  for(const motion of this.motions)motion.piece.position.copy(motion.from);
  const start=performance.now(),duration=impact?320:220;
  const frame=now=>{if(this.disposed)return;const elapsed=Math.max(0,now-start),t=Math.min(1,elapsed/220),e=t*t*(3-2*t);
   for(const motion of this.motions){motion.piece.position.lerpVectors(motion.from,motion.target,e);motion.piece.position.y=motion.target.y+Math.sin(Math.PI*t)*.12;}
   if(impact){const pulse=Math.max(0,Math.min(1,(elapsed-100)/220));impact.scale.setScalar(.75+pulse*.55);this.materials.impact.opacity=elapsed<100?0:.85*(1-pulse);}
   const complete=elapsed>=duration?this.animationComplete:null;
   if(elapsed>=duration)this.finishAnimation();else this.animation=requestAnimationFrame(frame);this.render();complete?.();
  };this.render();this.animation=requestAnimationFrame(frame);
 }
 render(){if(!this.disposed)this.renderer.render(this.scene,this.camera);}
 stats(){return {geometries:this.renderer.info.memory.geometries,textures:this.renderer.info.memory.textures,calls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,pieces:this.pieces.children.length,studio:Boolean(this.environmentTarget)};}
 dispose(){
  if(this.disposed)return;this.finishAnimation();this.disposed=true;this.resizeObserver?.disconnect();
  const canvas=this.renderer?.domElement;if(this.click)canvas?.removeEventListener('pointerup',this.click);if(this.contextLost)canvas?.removeEventListener('webglcontextlost',this.contextLost);
  const geometries=new Set();this.scene?.traverse(o=>{if(o.geometry)geometries.add(o.geometry);});for(const g of this.geometries?.values()||[])geometries.add(g);for(const g of geometries)g.dispose();
  for(const m of Object.values(this.materials||{})){m.map?.dispose();m.dispose();}
  if(this.scene)this.scene.environment=null;this.environmentTarget?.dispose();this.environmentTarget=null;this.light?.shadow.map?.dispose();this.renderer?.dispose();this.renderer?.forceContextLoss();canvas?.remove();this.scene?.clear();this.geometries?.clear();
 }
}
