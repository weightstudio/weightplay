import * as THREE from './vendor/three/three.module.min.js';
import {GroundCues} from './ground-cues.js';
import {axePose,chopBody,ease,enemyWind,enemyStroke} from './combat-pose.js?v=20261003-wildwood-axe-v12a';
const palette={wood:0x765139,dark:0x302a2c,orange:0xc9763e,cream:0xffdfae,teal:0x258f85,gold:0xf4be58,leaf:0x397a50,moss:0x69905b,stone:0x738782,steel:0x617781,edge:0xe6edf2,white:0xd9f3e4,cyan:0x79f4d3,purple:0x875b99,red:0xf2745e,ground:0x537555,treeBark:0x624b39,treeBarkLight:0x87694b,canopyShade:0x315b3b,canopyMid:0x4d7749,canopyTop:0x769354,canopyShadeFern:0x375b40,canopyMidFern:0x58784c,canopyTopFern:0x84995d,canopyShadeCool:0x315743,canopyMidCool:0x4c7558,canopyTopCool:0x77947a};
export function createBlockGeometry(){
 const shape=new THREE.Shape();shape.moveTo(-.46,-.46);shape.lineTo(.46,-.46);shape.lineTo(.46,.46);shape.lineTo(-.46,.46);shape.closePath();
 const geometry=new THREE.ExtrudeGeometry(shape,{depth:.92,bevelEnabled:true,bevelSize:.04,bevelThickness:.04,bevelSegments:2,steps:1});geometry.translate(0,0,-.46);geometry.computeBoundingBox();
 // ExtrudeGeometry's stock cap/side UVs use shape coordinates, including
 // negative values. Project each face into one full, bounded surface tile.
 const position=geometry.attributes.position,normal=geometry.attributes.normal,uv=geometry.attributes.uv,{min,max}=geometry.boundingBox;
 const unit=(value,low,high)=>Math.max(0,Math.min(1,(value-low)/(high-low)));
 for(let i=0;i<position.count;i++){
  const x=position.getX(i),y=position.getY(i),z=position.getZ(i),nx=Math.abs(normal.getX(i)),ny=Math.abs(normal.getY(i)),nz=Math.abs(normal.getZ(i));
  const u=nx>=ny&&nx>=nz?unit(z,min.z,max.z):unit(x,min.x,max.x);
  const v=ny>=nx&&ny>=nz?unit(z,min.z,max.z):unit(y,min.y,max.y);
  uv.setXY(i,u,v);
 }
 uv.needsUpdate=true;return geometry;
}
export function createCanopyGeometry(){
 // Faceted rounded leaf masses make a broad crown with an organic edge. The
 // small deterministic wobble keeps neighboring clusters from reading as
 // identical balls while retaining the game's low-poly finish.
 const geometry=new THREE.IcosahedronGeometry(1,1),position=geometry.attributes.position,colors=new Float32Array(position.count*3);
 for(let i=0;i<position.count;i++){
  const x=position.getX(i),y=position.getY(i),z=position.getZ(i);
  const wobble=1+.05*Math.sin(x*8.1+z*5.3+y*4.7),facet=.94+.08*Math.sin(x*9.7-y*5.2+z*7.1),height=.83+.18*y;
  position.setXYZ(i,x*.62*wobble,.5+y*.52,z*.58*wobble);
  colors[i*3]=facet*height;colors[i*3+1]=facet*(height+.015);colors[i*3+2]=facet*(height-.025);
 }
 position.needsUpdate=true;geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geometry.computeVertexNormals();geometry.computeBoundingBox();return geometry;
}
export function createTrunkGeometry(){
 const geometry=new THREE.CylinderGeometry(.19,.27,1.38,7,1,false);geometry.computeVertexNormals();geometry.computeBoundingBox();return geometry;
}
function createGroundTexture(){
 // Use the softly painted moss tile for natural depth without large stones,
 // sharp paths, or repeated high-contrast grass marks in the combat space.
 const url=new URL('./art/ground-moss-v4.jpg',import.meta.url).href;
 const texture=new THREE.TextureLoader().load(url);
 texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
 texture.repeat.set(3.2,3.2);texture.anisotropy=4;return texture;
}
export class WildwoodWorld {
 constructor(canvas,sim){
  this.canvas=canvas;this.sim=sim;this.parts=[];this.models=new Map();this.batches=new Map();this.effects=[];this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  this.renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  this.scene=new THREE.Scene();this.cues=new GroundCues(this.scene);this.scene.background=new THREE.Color(0x173d3c);
  this.ground=createGroundTexture();this.ground.anisotropy=Math.min(4,this.renderer.capabilities.getMaxAnisotropy());
  this.camera=new THREE.OrthographicCamera(-9,9,11,-11,.1,70);this.camera.position.set(0,26,12);this.camera.lookAt(0,0,0);
  this.geometry=createBlockGeometry();this.canopyGeometry=createCanopyGeometry();this.trunkGeometry=createTrunkGeometry();
  this.scene.add(new THREE.HemisphereLight(0xd3f3ee,0x345040,2.3));this.sun=new THREE.DirectionalLight(0xffe0a0,3);this.sun.position.set(-6,15,9);this.sun.castShadow=true;this.sun.shadow.mapSize.set(1024,1024);Object.assign(this.sun.shadow.camera,{left:-12,right:12,top:12,bottom:-12,far:40});this.sun.shadow.normalBias=.04;this.scene.add(this.sun);
  this.root=new THREE.Group();this.static=new THREE.Group();this.root.add(this.static);
  // One continuous forest floor removes the raised arena slab, checker-like
  // stone rails, and square stepping path that crowded the old view.
  this.box(this.static,'ground',[0,-.18,0],[60,.3,60]);
  // Keep a sparse tree line beyond the playable clearing; objective trees stay
  // visually distinct and the center remains open for combat.
  for(const side of [-1,1])for(let i=0;i<6;i++){
   const x=-12.5+i*5,z=side*11.2;
   this.tree(this.static,x,z,.98+(i%3)*.1,true);
  }
  for(const side of [-1,1])for(let i=0;i<2;i++){
   const x=side*10.6,z=-4+i*8;
   this.tree(this.static,x,z,1.02+i*.1,true);
  }
  this.heroModel=this.character('hero');this.root.add(this.heroModel);this.exit=new THREE.Group();this.root.add(this.exit);
  this.box(this.exit,'gold',[-1,.8,0],[.25,1.8,.3]);this.box(this.exit,'gold',[1,.8,0],[.25,1.8,.3]);this.box(this.exit,'gold',[0,1.7,0],[2.2,.24,.3]);this.box(this.exit,'cyan',[0,.1,0],[1.8,.1,1.2]);
  this.resize();
 }
 box(parent,color,pos,scale){const n=new THREE.Object3D();n.position.set(...pos);n.scale.set(...scale);parent.add(n);this.parts.push({node:n,color,shape:'block'});return n;}
 foliage(parent,color,pos,scale){const n=new THREE.Object3D();n.position.set(...pos);n.scale.set(...scale);parent.add(n);this.parts.push({node:n,color,shape:'canopy'});return n;}
 woodSegment(parent,color,pos,scale,rotation=[0,0,0]){const n=new THREE.Object3D();n.position.set(...pos);n.scale.set(...scale);n.rotation.set(...rotation);parent.add(n);this.parts.push({node:n,color,shape:'trunk'});return n;}
 tree(parent,x,z,scale=1,decor=false){
  const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(scale);parent.add(g);
  this.woodSegment(g,'treeBark',[0,.69,0],[1,1,1]);this.box(g,'treeBarkLight',[-.075,.72,.195],[.075,.78,.025]);
  for(const sign of [-1,1]){const root=this.box(g,'treeBark',[sign*.12,.075,0],[.26,.12,.24]);root.rotation.z=-sign*.24;}
  for(const sign of [-1,1])this.woodSegment(g,'treeBark',[sign*.17,1.26,0],[.68,.37,.68],[0,0,sign*-.78]);
  const crown=new THREE.Group(),variation=Math.abs(Math.sin(x*2.17+z*1.31));crown.rotation.y=variation*Math.PI*.5;g.add(crown);
  const width=(decor?.96:1.04)+variation*.08,skew=(variation-.5)*.12,depth=(variation-.5)*.1;
  const colors=variation<.34?['canopyShade','canopyMid','canopyTop']:variation<.68?['canopyShadeFern','canopyMidFern','canopyTopFern']:['canopyShadeCool','canopyMidCool','canopyTopCool'];
  this.foliage(crown,colors[0],[0,1.38,-.035],[1.42*width,1.28,1.28*width]);
  this.foliage(crown,colors[1],[skew,1.66,.02],[1.22*width,1.22,1.10*width]);
  this.foliage(crown,colors[1],[-.42*width,1.60,.12],[.88*width,.94,.83*width]);
  this.foliage(crown,colors[1],[.42*width,1.62,-.08],[.88*width,.94,.83*width]);
  this.foliage(crown,colors[2],[skew*.45,1.98,depth*.25],[.88*width,.88,.80*width]);
  this.foliage(crown,colors[2],[skew*.2,2.17,depth*.18],[.55*width,.56,.52*width]);
  g.userData.crown=crown;return g;
 }
 character(kind,type=''){
  const g=new THREE.Group(),hero=kind==='hero',friend=kind==='friend',boss=kind==='boss';const color=hero?'orange':friend?'cream':type==='caster'||type==='mosswitch'?'purple':type==='ram'||type==='hornroot'?'wood':'moss';
  this.box(g,hero?'leaf':color,[0,.7,0],[.62,.75,.48]);this.box(g,color,[0,1.28,0],[.78,.62,.65]);
  this.box(g,hero||friend?'cream':'wood',[0,1.12,.37],[.5,.22,.2]);
  for(const s of [-1,1]){
   this.box(g,'cream',[s*.27,1.25,.33],[.2,.25,.08]);this.box(g,'dark',[s*.16,1.4,.39],[.095,.105,.04]);this.box(g,'white',[s*.17,1.425,.416],[.03,.035,.015]);this.box(g,color,[s*.29,1.67,0],[.2,friend?.5:.25,.2]);this.box(g,'dark',[s*.29,1.69,.115],[.1,.1,.04]);
  }
  this.box(g,'dark',[0,1.2,.49],[.12,.08,.08]);
  const legs=[];for(const sign of [-1,1]){const hip=new THREE.Group();hip.position.set(sign*.2,.49,0);g.add(hip);this.box(hip,'dark',[0,-.25,0],[.25,.48,.34]);this.box(hip,hero?'wood':'dark',[0,-.43,.08],[.29,.17,.4]);legs.push(hip);}
  const arm=new THREE.Group();arm.position.set(hero?.43:.42,hero?1.12:.9,0);g.add(arm);this.box(arm,color,[0,hero?-.14:-.18,0],[.22,hero?.3:.48,.25]);
  let elbow,bladeTip;
  const offarm=new THREE.Group();offarm.position.set(-.43,.98,0);g.add(offarm);this.box(offarm,color,[0,-.25,0],[.24,.55,.28]);
  if(hero){
   this.box(g,'teal',[0,1,.03],[.73,.16,.64]);this.box(g,'teal',[-.2,.75,.3],[.22,.4,.12]);this.box(g,'gold',[0,.49,.27],[.13,.12,.06]);
   const tail=new THREE.Group();tail.position.set(0,.6,-.25);tail.rotation.x=-.65;g.add(tail);for(let i=0;i<5;i++)this.box(tail,i%2?'dark':'orange',[0,0,-i*.28],[.36,.36,.35]);
   elbow=new THREE.Group();elbow.position.set(0,-.20,0);arm.add(elbow);
   this.box(elbow,'orange',[0,-.11,0],[.23,.25,.25]);this.box(elbow,'dark',[0,-.24,.02],[.25,.16,.27]);
   // Keep the wood shaft, metal socket and flared cutting head in one angled
   // assembly. Its forward rake exposes the blade to the high-angle camera
   // while the lower haft remains visibly in Brindle's weapon hand.
   const axe=new THREE.Group();axe.position.set(0,.08,.45);axe.rotation.x=.82;elbow.add(axe);
   this.box(axe,'wood',[0,0,0],[.13,.92,.16]);
   for(let i=0;i<3;i++)this.box(axe,'teal',[0,-.28+i*.08,0],[.17,.045,.19]);
   this.box(axe,'gold',[0,-.38,.015],[.19,.10,.20]);
   // A compact poll and socket overlap the haft; stepped steel cheeks widen
   // into a bright, single-bit edge with readable bevel and fitted hardware.
   this.box(axe,'dark',[-.12,.39,.13],[.29,.24,.29]);
   this.box(axe,'steel',[.03,.39,.13],[.38,.36,.32]);
   this.box(axe,'steel',[.40,.39,.14],[.54,.43,.32]);
   this.box(axe,'steel',[.88,.39,.14],[.52,.54,.30]);
   const blade=this.box(axe,'steel',[1.36,.39,.14],[.64,.64,.28]);blade.rotation.z=-.10;
   const edge=this.box(axe,'edge',[1.70,.39,.25],[.24,.58,.27]);edge.rotation.z=-.10;
   const edgeFace=this.box(axe,'edge',[1.71,.39,.37],[.08,.50,.045]);edgeFace.rotation.z=-.10;
   this.box(axe,'gold',[.06,.40,.31],[.085,.085,.06]);
   this.box(axe,'cyan',[.68,.40,.315],[.16,.12,.055]);
   bladeTip=new THREE.Object3D();bladeTip.position.set(1.82,.15,.384);axe.add(bladeTip);
   this.box(g,'gold',[-.43,.4,.2],[.18,.23,.18]);
  }else if(['shield','ironbark','stumpback'].includes(type)){
   this.box(arm,'wood',[0,-.1,.35],[.7,.95,.18]);this.box(arm,'gold',[0,-.1,.46],[.55,.14,.04]);this.box(arm,'cyan',[0,-.1,.49],[.17,.3,.04]);
  }else if(['caster','shaman','mosswitch'].includes(type)){this.box(arm,'wood',[0,0,.2],[.13,1.6,.13]);this.box(arm,type==='caster'?'purple':'cyan',[0,.75,.2],[.38,.4,.38]);}
  if(['ram','hornroot','heartwood'].includes(type))for(const s of [-1,1]){this.box(g,'cream',[s*.5,1.6,0],[.45,.18,.2]);this.box(g,'cream',[s*.68,1.8,0],[.17,.5,.18]);if(boss)this.box(g,'gold',[s*.8,1.9,0],[.4,.14,.16]);}
  if(type==='stormowl'){for(const sign of [-1,1]){this.box(g,'teal',[sign*.72,1,0],[.65,.7,.23]);this.box(g,'white',[sign*.93,.8,.05],[.3,.6,.18]);}this.box(g,'gold',[0,1.25,.52],[.23,.3,.3]);}
  if(type==='rootweaver'){for(const sign of [-1,1])for(let i=0;i<3;i++){const root=this.box(g,'wood',[sign*(.5+i*.22),.2,0],[.28,.35,.7]);root.rotation.z=sign*.3;}this.box(g,'purple',[0,1.75,0],[.6,.32,.6]);}
  if(boss){g.scale.setScalar(1.35);this.box(g,'cyan',[0,.74,.27],[.25,.35,.07]);for(let i=-1;i<=1;i++)this.box(g,'gold',[i*.24,1.72,0],[.14,.35+Math.abs(i)*.1,.18]);}
  g.userData={legs,arm,offarm,elbow,bladeTip,kind,type};return g;
 }
 model(e){
  let g=new THREE.Group();
  if(['enemy','boss','friend'].includes(e.kind))g=this.character(e.kind,e.type);
  else if(e.kind==='tree'){g=this.tree(new THREE.Group(),0,0,.9);g.userData.crown.rotation.y=(e.uid%7)*Math.PI/14;}
  else if(e.kind==='cage'){
   const rabbit=this.character('friend');rabbit.scale.setScalar(.6);g.add(rabbit);for(const x of [-.65,.65])for(const z of [-.5,.5])this.box(g,'wood',[x,.65,z],[.12,1.4,.12]);this.box(g,'wood',[0,1.25,0],[1.45,.12,1.2]);this.box(g,'gold',[0,.7,.55],[.22,.25,.1]);
  }else{
   this.box(g,'stone',[0,.15,0],[1,.3,1]);this.box(g,'stone',[0,.55,0],[.6,.7,.6]);const crystal=this.box(g,e.kind==='totem'?'purple':'cyan',[0,1.12,0],[.34,.55,.34]);crystal.rotation.z=.3;
  }
  this.root.add(g);return g;
 }
 batch(color,shape='block'){
  const key=shape==='block'?color:`${shape}:${color}`;
  if(this.batches.has(key))return this.batches.get(key);
  const steel=color==='steel',edge=color==='edge';
  // Model geometry provides the block silhouette. Fur, cloth, faces and props
  // use their authored colors, not pictures of stone walls baked onto every face.
  const canopy=shape==='canopy',trunk=shape==='trunk',geometry=canopy?this.canopyGeometry:trunk?this.trunkGeometry:this.geometry,material=new THREE.MeshStandardMaterial({color:color==='ground'?0xffffff:(palette[color]??0xffffff),map:color==='ground'?this.ground:null,vertexColors:canopy,roughness:(canopy||trunk)? .88 : steel? .38 : edge? .24 : .72,metalness:steel? .58 : edge? .68 : color==='gold'? .28 : .03,emissive:color==='cyan'?0x237a71:0,emissiveIntensity:.24,flatShading:canopy||trunk});
  const mesh=new THREE.InstancedMesh(geometry,material,2048);mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);mesh.castShadow=mesh.receiveShadow=true;mesh.frustumCulled=false;mesh.count=0;this.scene.add(mesh);this.batches.set(key,mesh);return mesh;
 }
 resize(){const r=this.canvas.getBoundingClientRect();this.renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);const aspect=r.width/Math.max(1,r.height);const halfH=Math.max(4.8,4.8/aspect),halfW=halfH*aspect;Object.assign(this.camera,{left:-halfW,right:halfW,top:halfH,bottom:-halfH});this.camera.updateProjectionMatrix();}
 consume(events){for(const e of events)if(['hit','hurt','defeat','blocked','immune','wardBlock','pulse','mastery','pickup','dash','spawn','respawn','totemSpawn'].includes(e.type)){
   if(e.type==='defeat'&&['enemy','boss'].includes(e.kind)){
    const actor=this.sim.ents.find(a=>a.uid===e.uid),colors=['moss','wood','cream','dark'];
    if(['caster','shaman','mosswitch'].includes(actor?.type))colors[0]='purple';
    if(['ram','hornroot','heartwood'].includes(actor?.type))colors[0]='wood';
    if(actor?.type==='stormowl')colors[0]='teal';
    const count=this.reduced?4:e.kind==='boss'?12:8;
    // Defeats take priority over old chips, with the same 24-piece budget.
    while(this.effects.length+count>24){const old=this.effects.shift();this.root.remove(old.g);this.parts=this.parts.filter(p=>!isChild(p.node,old.g));}
    for(let i=0;i<count;i++){const g=new THREE.Group();this.root.add(g);const size=(e.kind==='boss'?.4:.3)*(i%3===0?1.3:1);this.box(g,colors[i%colors.length],[0,0,0],[size,size,size]);this.effects.push({g,x:e.x,z:e.z,angle:i*2.4,life:.7,total:.7,shatter:true,height:.45+(i%3)*.4,spread:this.reduced?.3:1.1+(i%3)*.25});}
    continue;
   }
   const arrival=['spawn','respawn','totemSpawn'].includes(e.type),count=this.reduced?2:arrival?4:e.type==='defeat'?6:3,color=e.type==='hurt'?'red':e.type==='totemSpawn'?'purple':['pickup','blocked','immune','dash','spawn','respawn'].includes(e.type)?'cyan':'gold';
   for(let i=0;i<count&&this.effects.length<24;i++){const g=new THREE.Group();this.root.add(g);this.box(g,color,[0,0,0],[arrival?0.16:0.13,arrival?0.16:0.13,arrival?0.16:0.13]);this.effects.push({g,x:e.x??this.sim.hero.x,z:e.z??this.sim.hero.z,angle:i*2.4,life:arrival?0.42:0.35,total:arrival?0.42:0.35});}
  }}
 render(dt=0){
  const sim=this.sim,h=sim.hero;this.heroModel.position.set(h.x,Math.sin(sim.time*10)*(h.attack?.015:0),h.z);this.heroModel.rotation.y=h.angle;
  this.camera.position.set(h.x,26,h.z+12);this.camera.lookAt(h.x,0,h.z);this.camera.updateMatrixWorld();
  const nearby=()=>true; // Camera clipping only: never spawn scenery in the middle of the visible arena.
  const walking=this.lastHero&&Math.hypot(h.x-this.lastHero.x,h.z-this.lastHero.z)>.001;this.lastHero={x:h.x,z:h.z};
  this.walkBlend=(this.walkBlend||0)+((walking?1:0)-(this.walkBlend||0))*(1-Math.exp(-dt*14));
  const stride=Math.sin(sim.time*12)*this.walkBlend,rig=this.heroModel.userData;
  if(h.attack&&h.attack!==this.lastAttack){this.attackBegan=sim.time-(h.attack.total-h.attack.left);this.attackStart=rig.arm.rotation.x;this.lastAttack=h.attack;}
  if(h.moving&&sim.time-(this.attackBegan??-10)<.66){this.attackBegan=-10;this.recovery={at:sim.time,x:rig.arm.rotation.x,y:rig.arm.rotation.y,z:rig.arm.rotation.z,elbow:rig.elbow.rotation.x,lean:this.heroModel.rotation.x,brace:rig.offarm.rotation.x,drop:this.heroModel.position.y};}
  const elapsed=sim.time-(this.attackBegan??-10),attacking=elapsed<.66;
  const body=attacking?chopBody(elapsed):{elbow:0,lean:0,brace:0,drop:0};
  rig.arm.rotation.set(attacking?axePose(elapsed,this.attackStart,stride*.4):stride*.4,0,0);
  rig.elbow.rotation.x=body.elbow;rig.offarm.rotation.x=-stride*.65-body.brace;this.heroModel.rotation.z=stride*.085;
  this.heroModel.rotation.x=this.walkBlend*.1+body.lean;
  this.heroModel.position.y=h.recoil>0?.1:Math.abs(stride)*.085+body.drop;
  if(this.recovery){const blend=ease((sim.time-this.recovery.at)/.18),r=this.recovery,mix=(a,b)=>a*(1-blend)+b*blend;rig.arm.rotation.set(mix(r.x,rig.arm.rotation.x),r.y*(1-blend),r.z*(1-blend));rig.elbow.rotation.x=mix(r.elbow,body.elbow);rig.offarm.rotation.x=mix(r.brace,rig.offarm.rotation.x);this.heroModel.rotation.x=mix(r.lean,this.heroModel.rotation.x);this.heroModel.position.y=mix(r.drop,this.heroModel.position.y);if(blend>=1)this.recovery=null;}
  rig.legs.forEach((leg,i)=>leg.rotation.x=h.dash>0?.9:Math.sin(sim.time*12+i*Math.PI)*.82*this.walkBlend);
  this.exit.position.set(sim.exit.x,0,sim.exit.z);this.exit.visible=sim.ready()&&nearby(sim.exit);
  for(const e of sim.ents){let g=this.models.get(e.uid);if(!g){g=this.model(e);this.models.set(e.uid,g);}const falling=e.hp<=0&&!['enemy','boss'].includes(e.kind)&&sim.time-(e.defeatedAt??-10)<.5;g.visible=e.hp>0||falling;g.position.set(e.x,e.recoil?Math.sin(e.recoil*30)*.05:0,e.z);g.rotation.y=e.angle||0;g.rotation.z=falling?(sim.time-e.defeatedAt)*2.8:e.recoil>0?Math.sin(e.recoil*40)*.18:0;
   if(g.userData.arm)g.userData.arm.rotation.x=e.wind?enemyWind(1-e.wind.left/e.wind.total):e.swing?enemyStroke(.36-e.swing):0;
   const previous=g.userData.previous,moving=previous&&Math.hypot(e.x-previous.x,e.z-previous.z)>.001;if(g.userData.legs)g.userData.legs.forEach((leg,i)=>leg.rotation.x=moving?Math.sin(sim.time*9+i*Math.PI)*.7:0);g.userData.previous={x:e.x,z:e.z};
  }
  for(const [uid,g] of this.models)if(!sim.ents.some(e=>e.uid===uid)){this.root.remove(g);this.parts=this.parts.filter(p=>!isChild(p.node,g));this.models.delete(uid);}
  // Dynamic markers use the same instanced geometry and are recycled each frame.
  if(this.dynamic){this.root.remove(this.dynamic);const old=this.dynamic;this.parts=this.parts.filter(p=>!isChild(p.node,old));}
  this.dynamic=new THREE.Group();this.root.add(this.dynamic);const d=this.dynamic;
  this.cues.render(sim);
  for(const e of sim.ents)if(e.hp<=0&&e.kind==='tree'&&e.spawn)this.box(d,'wood',[e.x,.06,e.z],[.4,.12,.4]);
  for(const o of sim.obstacles)if(o.hp>0&&nearby(o)){this.box(d,o.breakable?'wood':'stone',[o.x,.5,o.z],[o.w*2,1,o.h*2]);this.box(d,'moss',[o.x,1.03,o.z],[o.w*1.9,.12,o.h*1.9]);}
  for(const p of sim.shots)if(nearby(p))this.box(d,p.enemy?'purple':'gold',[p.x,.5,p.z],[.2,.2,.4]);
  for(const p of sim.drops){if(!nearby(p))continue;const item=new THREE.Group();item.position.set(p.x,.4+Math.sin(sim.time*3)*.1,p.z);item.rotation.y=sim.time;d.add(item);
   if(p.kind==='heart'){for(const sign of [-1,1]){const leaf=this.box(item,'cyan',[sign*.1,.1,0],[.25,.35,.1]);leaf.rotation.z=sign*.5;}this.box(item,'leaf',[0,-.13,0],[.06,.3,.06]);}
   else if(p.kind==='boots'){for(const sign of [-1,1]){this.box(item,'wood',[sign*.16,0,0],[.2,.4,.22]);this.box(item,'cream',[sign*.16,-.14,.1],[.23,.13,.35]);}}
   else{this.box(item,'gold',[0,0,0],[.32,.42,.3]);this.box(item,'wood',[0,.24,0],[.4,.17,.38]);this.box(item,'wood',[0,.37,0],[.08,.16,.08]);}
  }
  if(h.ward)this.box(d,'cyan',[h.x,.65,h.z-.4],[.85,1,.08]);
  for(const fx of this.effects){fx.life-=dt;const t=(1-fx.life/fx.total);if(fx.shatter){fx.g.position.set(fx.x+Math.cos(fx.angle)*t*fx.spread,Math.max(.08,fx.height+1.6*t-2.6*t*t),fx.z+Math.sin(fx.angle)*t*fx.spread);if(!this.reduced)fx.g.rotation.set(t*3,fx.angle+t*2,t*2);fx.g.scale.setScalar(1-ease((t-.55)/.45));}else{fx.g.position.set(fx.x+Math.cos(fx.angle)*t,.5+Math.sin(t*Math.PI)*.6,fx.z+Math.sin(fx.angle)*t);fx.g.scale.setScalar(Math.max(0,1-t));}}
  for(const fx of this.effects.filter(x=>x.life<=0)){this.root.remove(fx.g);this.parts=this.parts.filter(p=>!isChild(p.node,fx.g));}this.effects=this.effects.filter(x=>x.life>0);
  this.root.updateMatrixWorld(true);for(const mesh of this.batches.values())mesh.count=0;
  for(const p of this.parts){let visible=true;for(let node=p.node;node;node=node.parent)if(!node.visible){visible=false;break;}if(!visible)continue;const b=this.batch(p.color,p.shape||'block');if(b.count<2048)b.setMatrixAt(b.count++,p.node.matrixWorld);}
  for(const mesh of this.batches.values())mesh.instanceMatrix.needsUpdate=true;
  this.renderer.render(this.scene,this.camera);
 }
 metrics(){return {drawCalls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,geometries:this.renderer.info.memory.geometries,materials:this.batches.size+1,cues:{vertices:this.cues.count,kinds:this.cues.kinds},models:this.models.size,effects:this.effects.length,fragments:this.effects.filter(f=>f.shatter).length,deadHostileModels:this.sim.ents.filter(e=>e.hp<=0&&['enemy','boss'].includes(e.kind)&&this.models.get(e.uid)?.visible).length,deathSlabs:this.parts.filter(p=>p.node.parent===this.dynamic&&p.color==='gold'&&p.node.position.y===.06).length,visibleObjects:[...this.models.values()].filter(g=>g.visible).length,bladeTip:this.heroModel.userData.bladeTip.getWorldPosition(new THREE.Vector3()).toArray(),heroPose:{elbow:this.heroModel.userData.elbow.rotation.x,arm:this.heroModel.userData.arm.rotation.x,leg:this.heroModel.userData.legs[0].rotation.x}};}
 project(x,z,height=.5){const v=new THREE.Vector3(x,height,z).project(this.camera);return {x:(v.x+1)/2,y:(1-v.y)/2};}
 dispose(){this.cues.dispose();this.sun.shadow.map?.dispose();this.ground.dispose();this.geometry.dispose();this.canopyGeometry.dispose();this.trunkGeometry.dispose();for(const b of this.batches.values()){b.dispose();b.material.dispose();}this.batches.clear();this.parts=[];this.models.clear();this.effects=[];this.renderer.dispose();}
}
function isChild(n,parent){for(let p=n;p;p=p.parent)if(p===parent)return true;return false;}
