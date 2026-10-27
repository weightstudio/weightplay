import * as THREE from './vendor/three/three.module.min.js';
import {decorParts,surfaceProperties,createContactShadowMaterial,dinerRoadPalette} from './decor-models.mjs?v=20261027-diner-art-v25';
export {createDecorPreviews} from './decor-models.mjs?v=20261027-diner-art-v25';

// Static scenery is batched by material. A move never rebuilds the restaurant.
export class DinerScene {
  constructor(canvas,{textures,onPick,onProject,onFailure,onRestore,reduced}){
    this.canvas=canvas;this.textures=textures;this.onProject=onProject;this.reduced=reduced;
    this.scene=new THREE.Scene();this.scene.background=new THREE.Color('#ddcfb4');
    this.camera=new THREE.OrthographicCamera(-4,4,4,-4,.1,60);
    this.camera.position.set(0,-9,15);this.camera.lookAt(0,0,0);
    this.renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;
    this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1;
    this.contextRecovery=this.renderer.getContext().getExtension('WEBGL_lose_context');
    const sky=new THREE.HemisphereLight(0xfff7eb,0x879488,1.25);sky.position.set(0,0,4);this.scene.add(sky);
    this.scene.add(new THREE.AmbientLight(0xffffff,.12));
    const sun=new THREE.DirectionalLight(0xfff3df,2);sun.position.set(-3,-4,8);this.scene.add(sun);
    this.boxGeometry=new THREE.BoxGeometry(1,1,1);this.ringGeometry=new THREE.RingGeometry(.32,.38,32);
    this.planeGeometry=new THREE.PlaneGeometry(1,1);this.materials=new Map();this.menuMaterials=new Map();
    this.staticGroup=new THREE.Group();this.frontageGroup=new THREE.Group();this.dynamicGroup=new THREE.Group();
    this.shadowMaterial=createContactShadowMaterial(.22);
    this.scene.add(this.staticGroup,this.frontageGroup,this.dynamicGroup);
    this.raycaster=new THREE.Raycaster();this.pointer=new THREE.Vector2();
    this.abort=new AbortController();this.animations=new Set();this.guestMeshes=new Map();
    this.canvas.addEventListener('pointerup',event=>{if(!this.stage)return;const node=this.pick(event);if(node!==null)onPick(node);},{signal:this.abort.signal});
    this.canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();this.cancel();onFailure();},{signal:this.abort.signal});
    this.canvas.addEventListener('webglcontextrestored',()=>{onRestore?.();this.draw();},{signal:this.abort.signal});
    this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(canvas);
  }
  material(color,transparent=false,surface='paint'){
    const key=`${surface}:${color}:${transparent}`;
    if(!this.materials.has(key))this.materials.set(key,new THREE.MeshStandardMaterial({color,...surfaceProperties(surface),...(transparent?{transparent:true,opacity:.8}:{})}));
    return this.materials.get(key);
  }
  position(node){const [x,y]=this.stage.points[node];return new THREE.Vector3(x-this.originX,this.originY-y,.12);}
  setStage(stage,style='classic',milestones=0){
    this.cancel();this.stage=stage;this.style=style;this.milestones=milestones;
    this.originX=(Math.min(...stage.points.map(p=>p[0]))+Math.max(...stage.points.map(p=>p[0])))/2;
    this.originY=(Math.min(...stage.points.map(p=>p[1]))+Math.max(...stage.points.map(p=>p[1])))/2;
    for(const group of [this.staticGroup,this.frontageGroup])for(const mesh of [...group.children]){group.remove(mesh);mesh.dispose?.();}
    const points=stage.points.map((_,i)=>this.position(i));
    const minX=Math.min(...points.map(p=>p.x)),maxX=Math.max(...points.map(p=>p.x));
    const minY=Math.min(...points.map(p=>p.y)),maxY=Math.max(...points.map(p=>p.y));
    const left=Math.min(-2.2,minX-.7),right=Math.max(2.2,maxX+.7);
    const bottom=Math.min(-2.3,minY-.8),top=Math.max(2.1,maxY+1.3);
    this.bounds={left:left-.35,right:right+.35,bottom:bottom-.4,top:top+.5};
    const sceneBuckets=new Map(),frontageBuckets=new Map(),shadows=[];let buckets=sceneBuckets,frontageOriginY=0;
    const box=(color,x,y,z,w,h,d,rotation=0,surface='paint')=>{
      const key=`${surface}:${color}`;
      if(!buckets.has(key))buckets.set(key,{color,surface,items:[]});
      buckets.get(key).items.push({x,y:buckets===frontageBuckets?y-frontageOriginY:y,z,w,h,d,rotation});
    };
    const addDecor=(index,x,y,z,scale=1)=>{for(const part of decorParts(index))box(part.color,x+part.x*scale,y+part.y*scale,z+part.z*scale,part.w*scale,part.d*scale,part.h*scale,part.rotation,part.surface);};
    const {road,edge,marking}=dinerRoadPalette(style);
    box(0x967553,0,(top+bottom)/2,-.34,right-left,top-bottom,.40,0,'wood');
    box(0xcdbf9f,0,(top+bottom)/2,-.11,right-left,top-bottom,.12,0,'tile');
    // Fine paving joints, deliberately quieter than the roads.
    for(let x=Math.ceil(left);x<right;x++)box(0xb7a98b,x,(top+bottom)/2,-.041,.025,top-bottom,.012,0,'tile');
    for(let y=Math.ceil(bottom);y<top;y++)box(0xb7a98b,0,y,-.04,right-left,.025,.012,0,'tile');
    for(const p of points){box(edge,p.x,p.y,0,.98,.98,.10,0,'tile');box(road,p.x,p.y,.065,.86,.86,.08,0,'road');}
    const pairs=new Set();
    stage.edges.forEach((neighbors,from)=>neighbors.forEach(to=>{
      const key=[from,to].sort((a,b)=>a-b).join(':');if(pairs.has(key))return;pairs.add(key);
      const a=this.position(from),b=this.position(to),x=(a.x+b.x)/2,y=(a.y+b.y)/2;
      box(road,x,y,.08,Math.abs(a.x-b.x)>.5?1:.84,Math.abs(a.y-b.y)>.5?1:.84,.06,0,'road');
      box(marking,x,y,.116,Math.abs(a.x-b.x)>.5?.20:.035,Math.abs(a.y-b.y)>.5?.20:.035,.012,0,'paint');
    }));
    for(const [ax,ay,bx,by] of stage.oneWay||[]){
      const a=this.position(stage.ids.get(`${ax},${ay}`)),b=this.position(stage.ids.get(`${bx},${by}`));
      const x=(a.x+b.x)/2,y=(a.y+b.y)/2,angle=Math.atan2(b.y-a.y,b.x-a.x);
      box(0xffd88c,x,y,.13,.22,.045,.025,angle);
      for(const side of [-1,1])box(0xffd88c,x+Math.cos(angle)*.07-Math.sin(angle)*side*.04,y+Math.sin(angle)*.07+Math.cos(angle)*side*.04,.13,.12,.04,.025,angle-side*.7);
    }
    for(const node of stage.pockets){const p=this.position(node);box(0x55a8b4,p.x,p.y,.13,.77,.77,.08);for(const side of [-1,1])box(0xccece1,p.x+side*.30,p.y,.18,.025,.55,.015);}
    const counter=this.position(stage.counter);
    box(0x9e6148,counter.x,counter.y,.18,.88,.88,.20,0,'wood');
    box(0xe3b66f,counter.x,counter.y,.30,.83,.81,.06,0,'paint');
    box(0xf2e5c4,counter.x,counter.y-.24,.34,.65,.10,.04,0,'ceramic');
    // Diner back wall, block windows and a striped canopy.
    const cafeY=maxY+1,cafeWidth=Math.min(4.4,right-left-.5);
    this.routeMaxY=maxY;this.frontageY=cafeY;frontageOriginY=cafeY;buckets=frontageBuckets;
    box(0x9e604c,0,cafeY,.46,cafeWidth,.26,1.05);
    box(0xe7dbc3,0,cafeY-.17,.50,cafeWidth-.22,.12,.77,0,'tile');
    for(const z of [.18,.43,.68])box(0xd7c8ad,0,cafeY-.235,z,cafeWidth-.26,.016,.018,0,'tile');
    for(const x of [-cafeWidth/2+.08,cafeWidth/2-.08])box(0x926441,x,cafeY-.20,.51,.14,.16,1.10,0,'wood');
    box(0x604934,0,cafeY-.18,.03,cafeWidth+.12,.32,.11,0,'wood');
    for(const x of [-cafeWidth*.31,cafeWidth*.31]){
      box(0x435856,x,cafeY-.25,.55,.86,.06,.52,0,'metal');
      box(0x7ea9a4,x,cafeY-.29,.58,.68,.035,.36,0,'ceramic');
      box(0xeee3c7,x,cafeY-.32,.59,.035,.03,.38,0,'wood');
      box(0xeee3c7,x,cafeY-.32,.59,.70,.03,.035,0,'wood');
    }
    box(0x497c73,0,cafeY-.25,.38,.58,.09,.77);
    box(0x7ea9a4,0,cafeY-.31,.55,.40,.03,.29,0,'ceramic');
    box(0xbe9140,.18,cafeY-.32,.29,.045,.05,.045,0,'metal');
    const stripes=12;
    for(let i=0;i<stripes;i++){
      const x=-cafeWidth/2+(i+.5)*cafeWidth/stripes;
      box(i%2?0xeee3c7:0xc87558,x,cafeY-.16,1.06,cafeWidth/stripes,.42,.14,0,'cloth');
      box(i%2?0xeee3c7:0xc87558,x,cafeY-.35,.92,cafeWidth/stripes,.06,.24,0,'cloth');
    }
    // Finished menu placards reuse the actual snack artwork from the order tray.
    for(const [index,key] of ['bun','tea','berry'].entries()){
      const x=(index-1)*.72;
      box(0x926441,x,cafeY-.12,1.39,.60,.14,.62,0,'wood');
      box(0xeee3c7,x,cafeY-.21,1.39,.52,.04,.54,0,'paint');
      const texture=this.textures[`snack_${key}`];
      if(texture){
        if(!this.menuMaterials.has(key))this.menuMaterials.set(key,new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,toneMapped:false}));
        const placard=new THREE.Mesh(this.planeGeometry,this.menuMaterials.get(key));placard.position.set(x,-.26,1.40);placard.scale.set(.43,.43,1);placard.quaternion.copy(this.camera.quaternion);this.frontageGroup.add(placard);
      }
    }
    if(milestones>=1)addDecor(0,-cafeWidth/2+.42,cafeY-.33,.02,.45);
    if(milestones>=4)for(const x of [-1.17,1.17])addDecor(3,x,cafeY-.34,.70,.34);
    if(milestones>=5)addDecor(4,0,cafeY-.39,.02,.67);
    buckets=sceneBuckets;
    // Patio rails, lantern cages and flower boxes frame the traffic lanes.
    for(const x of [left+.15,right-.15]){
      box(0x926441,x,bottom+.65,.26,.11,.11,.64,0,'wood');
      box(0x435856,x,bottom+.65,.69,.28,.26,.08,0,'metal');
      box(0xe4b865,x,bottom+.65,.55,.19,.17,.22,0,'glow');
      box(0x435856,x,bottom+.65,.39,.27,.24,.07,0,'metal');
      box(0xbe8c58,x,bottom+1.15,.12,.08,1.25,.20,0,'wood');
      shadows.push({x,y:bottom+.65,w:.40,h:.40,z:-.025});
    }
    for(const x of [-.55,0,.55]){
      if(milestones>=2)addDecor(1,x,bottom+.13,-.03,.34);
      else{box(0x926441,x,bottom+.13,.03,.48,.28,.23,0,'wood');box(0x49784e,x,bottom+.13,.19,.43,.25,.12,0,'leaf');}
      shadows.push({x,y:bottom+.13,w:.57,h:.38,z:-.025});
    }
    // Cafe seating occupies scenery only; it never looks like a legal stop.
    const tableY=bottom+.35;
    for(const x of [left+.65,right-.65]){
      box(0x435856,x,tableY,.15,.12,.12,.36,0,'metal');
      box(0xbe8c58,x,tableY,.36,.58,.50,.12,0,'wood');
      for(const offset of [-.42,.42]){box(0x497c73,x+offset,tableY,.14,.22,.30,.25);box(0x497c73,x+offset,tableY+.12,.28,.22,.08,.32);}
      box(0xeee3c7,x,tableY,.44,.16,.16,.06,0,'ceramic');
      shadows.push({x,y:tableY,w:1.42,h:.84,z:-.025});
    }
    const plant=(x,y)=>{
      box(0x9e604c,x,y,.07,.38,.38,.25,0,'ceramic');
      box(0x49784e,x,y,.34,.48,.46,.28,0,'leaf');
      box(0x6d9459,x-.10,y,.53,.31,.33,.19,0,'leaf');
      box(0x86a561,x+.08,y-.05,.63,.22,.23,.14,0,'leaf');
      shadows.push({x,y,w:.60,h:.58,z:-.025});
    };
    plant(left+.29,top-.35);plant(right-.29,top-.35);
    plant(left+.25,bottom+.20);plant(right-.25,bottom+.20);
    // Exact reward-preview models, batched into the scene's fixed material set.
    if(milestones>=3)for(const side of [-1,1]){const x=side*(right-left)*.23;addDecor(2,x,bottom+.40,-.03,.52);shadows.push({x,y:bottom+.40,w:1.10,h:.60,z:-.025});}
    if(milestones>=6)for(const side of [-1,1]){const x=side*(right-left)*.42;addDecor(5,x,bottom+.20,-.03,.48);shadows.push({x,y:bottom+.20,w:.60,h:.50,z:-.025});}
    for(const [group,records] of [[this.staticGroup,sceneBuckets],[this.frontageGroup,frontageBuckets]])for(const {color,surface,items} of records.values()){
      const mesh=new THREE.InstancedMesh(this.boxGeometry,this.material(color,false,surface),items.length),matrix=new THREE.Matrix4();
      items.forEach((item,i)=>{const quaternion=Array.isArray(item.rotation)?new THREE.Quaternion().setFromEuler(new THREE.Euler(...item.rotation)):new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1),item.rotation);matrix.compose(new THREE.Vector3(item.x,item.y,item.z),quaternion,new THREE.Vector3(item.w,item.h,item.d));mesh.setMatrixAt(i,matrix);});mesh.instanceMatrix.needsUpdate=true;group.add(mesh);
    }
    const contact=new THREE.InstancedMesh(this.planeGeometry,this.shadowMaterial,shadows.length),matrix=new THREE.Matrix4();shadows.forEach((item,i)=>{matrix.compose(new THREE.Vector3(item.x,item.y,item.z),new THREE.Quaternion(),new THREE.Vector3(item.w,item.h,1));contact.setMatrixAt(i,matrix);});contact.instanceMatrix.needsUpdate=true;contact.renderOrder=1;this.staticGroup.add(contact);
    this.resize();
  }
  show(state,selected=null,targets=[]){
    this.cancel();this.state=state;
    for(const mesh of [...this.dynamicGroup.children]){this.dynamicGroup.remove(mesh);mesh.traverse(child=>{if(child.userData.ownedMaterial)child.material.dispose();if(child.isInstancedMesh)child.dispose();});}
    this.guestMeshes.clear();
    const ring=(node,color,scale=1)=>{const mesh=new THREE.Mesh(this.ringGeometry,this.material(color));mesh.position.copy(this.position(node));mesh.position.z=.20;mesh.scale.setScalar(scale);this.dynamicGroup.add(mesh);};
    for(const node of targets)ring(node,0xffe099,1.06);
    state.positions.forEach((node,i)=>{
      if(node<0)return;
      const animal=this.stage.guests[i].animal,texture=this.textures[animal],group=new THREE.Group();group.position.copy(this.position(node));
      const contact=new THREE.Mesh(this.planeGeometry,this.shadowMaterial);contact.position.set(0,-.01,.014);contact.scale.set(.82,.46,1);contact.renderOrder=1;group.add(contact);group.userData.contact=contact;
      const ratio=texture.image.width/texture.image.height;
      const material=new THREE.MeshBasicMaterial({map:texture,transparent:true,alphaTest:.035,depthWrite:false,toneMapped:false});
      const avatar=new THREE.Mesh(this.planeGeometry,material);avatar.userData.ownedMaterial=true;
      avatar.scale.set(Math.min(1.08,.94*ratio),.94,1);avatar.position.set(0,.10,.48);avatar.quaternion.copy(this.camera.quaternion);avatar.renderOrder=3;group.userData.avatar=avatar;
      group.add(avatar);this.dynamicGroup.add(group);this.guestMeshes.set(i,group);
      if(i===selected)ring(node,0xffd17b,1.12);
    });
    this.gateMeshes=[];const supports=new Map();
    const support=(surface,color,x,y,z,w,d,h,angle=0)=>{const key=`${surface}:${color}`;if(!supports.has(key))supports.set(key,{surface,color,parts:[]});supports.get(key).parts.push({x,y,z,w,d,h,angle});};
    this.stage.gates.forEach((gate,i)=>{
     for(const [branch,[edge,open]] of [[[gate.a,gate.b],state.gates[i]],...(gate.alternate?[[gate.alternate,!state.gates[i]]]:[])].entries()){
      const a=this.position(this.stage.ids.get(`${edge[0][0]},${edge[0][1]}`)),b=this.position(this.stage.ids.get(`${edge[1][0]},${edge[1][1]}`));
      const group=new THREE.Group();group.position.copy(a.clone().add(b).multiplyScalar(.5));
      const angle=Math.atan2(b.y-a.y,b.x-a.x);group.rotation.z=angle;
      const accent=i%2?0xc87558:0x497c73;
      for(const side of [-1,1]){
        const x=group.position.x-Math.sin(angle)*side*.35,y=group.position.y+Math.cos(angle)*side*.35;
        support('metal',0x435856,x,y,.15,.19,.19,.12,angle);support('paint',accent,x,y,.39,.11,.11,.43,angle);support('metal',0x435856,x,y,.63,.19,.19,.075,angle);
        if(side===1){support('paint',0xeee3c7,x,y,.48,.17,.15,.18,angle);support('metal',0x435856,x+Math.cos(angle)*.055,y+Math.sin(angle)*.055,.59,.18,.055,.055,angle);}
      }
      const bar=new THREE.Mesh(this.boxGeometry,this.material(open?0x8cab8c:0xc87558,false,'paint'));
      bar.scale.set(.10,.78,.12);bar.position.z=open ? .78 : .36;bar.userData.gateIndex=i;bar.userData.primary=branch===0;group.add(bar);this.dynamicGroup.add(group);this.gateMeshes.push(bar);
     }
    });
    for(const {surface,color,parts} of supports.values()){
      const mesh=new THREE.InstancedMesh(this.boxGeometry,this.material(color,false,surface),parts.length),matrix=new THREE.Matrix4();parts.forEach((part,i)=>{matrix.compose(new THREE.Vector3(part.x,part.y,part.z),new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1),part.angle),new THREE.Vector3(part.w,part.d,part.h));mesh.setMatrixAt(i,matrix);});mesh.instanceMatrix.needsUpdate=true;this.dynamicGroup.add(mesh);
    }
    this.draw();
  }
  move(guest,route){
    const group=this.guestMeshes.get(guest);if(!group||route.length<2)return;
    const points=route.map(node=>this.position(node));group.position.copy(points[0]);this.draw();
    this.tween(this.reduced()?80:Math.min(650,180+route.length*85),progress=>{
      if(this.reduced()){group.position.copy(points.at(-1));group.userData.avatar.position.z=.48;return;}
      const value=(1-(1-progress)**2)*(points.length-1),at=Math.min(points.length-2,Math.floor(value));
      group.position.lerpVectors(points[at],points[at+1],value-at);group.userData.avatar.position.z=.48+Math.sin(progress*Math.PI)*.045;
    });
  }
  switchGate(index,previous){
    const bars=this.gateMeshes.filter(bar=>bar.userData.gateIndex===index).map(bar=>({bar,from:(bar.userData.primary?previous:!previous) ? .78 : .36,to:bar.position.z}));
    this.tween(this.reduced()?80:180,p=>{for(const {bar,from,to} of bars)bar.position.z=this.reduced()?to:from+(to-from)*p;});
  }
  depart(guest,done){
    const group=this.guestMeshes.get(guest);if(!group){done?.();return;}
    const start=group.position.clone();
    this.tween(this.reduced()?80:280,p=>{if(!this.reduced()){group.position.x=start.x+p*.5;group.position.y=start.y+p*.15;}
      group.traverse(o=>{if(o.userData.ownedMaterial&&o.material?.transparent)o.material.opacity=1-p;});group.userData.contact.scale.set(.82*(1-p),.46*(1-p),1);},done);
  }
  tween(duration,update,done){
    const motion={raf:0,finish:()=>update(1)};this.animations.add(motion);const start=performance.now();
    // rAF timestamps can precede a late event's performance.now() in that frame.
    const tick=now=>{if(!this.animations.has(motion))return;const p=Math.max(0,Math.min(1,(now-start)/duration));update(p);this.draw();
      if(p<1)motion.raf=requestAnimationFrame(tick);else{this.animations.delete(motion);done?.();}};
    motion.raf=requestAnimationFrame(tick);
  }
  cancel(){for(const animation of this.animations){cancelAnimationFrame(animation.raf);animation.finish();}this.animations.clear();}
  restore(){if(this.isLost()&&this.contextRecovery){this.contextRecovery.restoreContext();return true;}return false;}
  isLost(){return this.renderer.getContext().isContextLost();}
  project(node,z=.16){
    const p=this.position(node);p.z=z;p.project(this.camera);
    return {x:(p.x+1)*this.canvas.clientWidth/2,y:(1-p.y)*this.canvas.clientHeight/2};
  }
  projectEdge(edge){
    const a=this.position(this.stage.ids.get(`${edge[0][0]},${edge[0][1]}`)),b=this.position(this.stage.ids.get(`${edge[1][0]},${edge[1][1]}`));
    const point=a.add(b).multiplyScalar(.5);point.z=.65;point.project(this.camera);
    return {x:(point.x+1)*this.canvas.clientWidth/2,y:(1-point.y)*this.canvas.clientHeight/2};
  }
  pick(event){
    const rect=this.canvas.getBoundingClientRect();this.pointer.set((event.clientX-rect.left)/rect.width*2-1,1-(event.clientY-rect.top)/rect.height*2);
    this.raycaster.setFromCamera(this.pointer,this.camera);const p=new THREE.Vector3();
    if(!this.raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,0,1),-.12),p))return null;
    return this.stage.ids.get(`${Math.round(p.x+this.originX)},${Math.round(this.originY-p.y)}`)??null;
  }
  resize(){
    const width=this.canvas.clientWidth,height=this.canvas.clientHeight;if(!width||!height)return;
    this.renderer.setSize(width,height,false);
    if(this.bounds){
      this.camera.position.set(0,-9,15);this.camera.lookAt(0,0,0);this.camera.updateMatrixWorld();
      // Centre and fit required road/avatar bounds in camera space. Scenery
      // never imposes a zoom floor on the short-landscape playfield.
      const play=[];for(let node=0;node<this.stage.points.length;node++){
        const p=this.position(node);for(const dx of [-.60,.60])for(const dy of [-.25,.65])for(const z of [.02,1.15])play.push(new THREE.Vector3(p.x+dx,p.y+dy,z).applyMatrix4(this.camera.matrixWorldInverse));
      }
      const minX=Math.min(...play.map(p=>p.x)),maxX=Math.max(...play.map(p=>p.x)),minY=Math.min(...play.map(p=>p.y)),maxY=Math.max(...play.map(p=>p.y));
      const offset=new THREE.Vector3((minX+maxX)/2,(minY+maxY)/2,0).applyQuaternion(this.camera.quaternion);this.camera.position.add(offset);this.camera.lookAt(offset);this.camera.updateMatrixWorld();
      const fit=Math.max((maxY-minY)/2+.07,((maxX-minX)/2+.07)/(width/height));this.camera.left=-fit*width/height;this.camera.right=fit*width/height;this.camera.top=fit;this.camera.bottom=-fit;this.camera.updateProjectionMatrix();
      // Compose the storefront inside existing avatar headroom. It cannot
      // alter the camera fit, route scale, hit regions or gameplay bounds.
      const scale=width/height>1.25?.56:1;this.frontageGroup.scale.setScalar(scale);this.frontageGroup.position.set(0,this.routeMaxY+.56+.40*scale,0);this.frontageGroup.updateMatrixWorld(true);
    }
    this.draw();
  }
  draw(){
    if(this.disposed)return;this.renderer.render(this.scene,this.camera);
    const info=this.renderer.info;Object.assign(this.canvas.dataset,{drawCalls:String(info.render.calls),triangles:String(info.render.triangles),geometries:String(info.memory.geometries),textures:String(info.memory.textures),threeRevision:THREE.REVISION});
    if(this.stage)this.onProject?.();
  }
  dispose(){
    this.cancel();this.disposed=true;this.abort.abort();this.observer.disconnect();
    this.scene.traverse(object=>{if(object.userData.ownedMaterial)object.material.dispose();if(object.isInstancedMesh)object.dispose();});
    for(const material of this.materials.values())material.dispose();
    for(const material of this.menuMaterials.values())material.dispose();
    this.shadowMaterial.dispose();this.boxGeometry.dispose();this.ringGeometry.dispose();this.planeGeometry.dispose();this.renderer.dispose();
  }
}
