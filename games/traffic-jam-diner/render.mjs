import * as THREE from './vendor/three/three.module.min.js';

// Static scenery is batched by material. A move never rebuilds the restaurant.
export class DinerScene {
  constructor(canvas,{textures,onPick,onProject,onFailure,onRestore,reduced}){
    this.canvas=canvas;this.textures=textures;this.onProject=onProject;this.reduced=reduced;
    this.scene=new THREE.Scene();this.scene.background=new THREE.Color('#f0d9ad');
    this.camera=new THREE.OrthographicCamera(-4,4,4,-4,.1,60);
    this.camera.position.set(0,-9,15);this.camera.lookAt(0,0,0);
    this.renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;
    this.contextRecovery=this.renderer.getContext().getExtension('WEBGL_lose_context');
    const sky=new THREE.HemisphereLight(0xfff6dc,0x778777,2.4);sky.position.set(0,0,1);this.scene.add(sky);
    this.scene.add(new THREE.AmbientLight(0xffecc8,.45));
    const sun=new THREE.DirectionalLight(0xffffff,2.5);sun.position.set(-4,6,12);this.scene.add(sun);
    this.boxGeometry=new THREE.BoxGeometry(1,1,1);this.ringGeometry=new THREE.RingGeometry(.32,.38,32);
    this.planeGeometry=new THREE.PlaneGeometry(1,1);this.materials=new Map();this.menuMaterials=new Map();
    this.staticGroup=new THREE.Group();this.dynamicGroup=new THREE.Group();
    this.scene.add(this.staticGroup,this.dynamicGroup);
    this.raycaster=new THREE.Raycaster();this.pointer=new THREE.Vector2();
    this.abort=new AbortController();this.animations=new Set();this.guestMeshes=new Map();
    this.canvas.addEventListener('pointerup',event=>{if(!this.stage)return;const node=this.pick(event);if(node!==null)onPick(node);},{signal:this.abort.signal});
    this.canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();this.cancel();onFailure();},{signal:this.abort.signal});
    this.canvas.addEventListener('webglcontextrestored',()=>{onRestore?.();this.draw();},{signal:this.abort.signal});
    this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(canvas);
  }
  material(color,transparent=false){
    const key=`${color}:${transparent}`;
    if(!this.materials.has(key))this.materials.set(key,new THREE.MeshStandardMaterial({color,roughness:.85,transparent,opacity:transparent?.8:1}));
    return this.materials.get(key);
  }
  position(node){const [x,y]=this.stage.points[node];return new THREE.Vector3(x-this.originX,this.originY-y,.12);}
  setStage(stage,style='classic',milestones=0){
    this.cancel();this.stage=stage;this.style=style;this.milestones=milestones;
    this.originX=(Math.min(...stage.points.map(p=>p[0]))+Math.max(...stage.points.map(p=>p[0])))/2;
    this.originY=(Math.min(...stage.points.map(p=>p[1]))+Math.max(...stage.points.map(p=>p[1])))/2;
    for(const mesh of [...this.staticGroup.children]){this.staticGroup.remove(mesh);mesh.dispose?.();}
    const points=stage.points.map((_,i)=>this.position(i));
    const minX=Math.min(...points.map(p=>p.x)),maxX=Math.max(...points.map(p=>p.x));
    const minY=Math.min(...points.map(p=>p.y)),maxY=Math.max(...points.map(p=>p.y));
    const left=Math.min(-2.2,minX-.7),right=Math.max(2.2,maxX+.7);
    const bottom=Math.min(-2.3,minY-.8),top=Math.max(2.1,maxY+1.3);
    this.bounds={left:left-.35,right:right+.35,bottom:bottom-.4,top:top+.5};
    const buckets=new Map();
    const box=(color,x,y,z,w,h,d,rotation=0)=>{
      if(!buckets.has(color))buckets.set(color,[]);
      buckets.get(color).push({x,y,z,w,h,d,rotation});
    };
    const berry=style==='berry-grove',road=berry?0x8b7b9b:0x586d68,edge=berry?0xb3a2bf:0xa4b599;
    box(0xa47b52,0,(top+bottom)/2,-.34,right-left,top-bottom,.40);
    box(0xe8d0a2,0,(top+bottom)/2,-.11,right-left,top-bottom,.12);
    // Fine paving joints, deliberately quieter than the roads.
    for(let x=Math.ceil(left);x<right;x++)box(0xdac295,x,(top+bottom)/2,-.041,.025,top-bottom,.012);
    for(let y=Math.ceil(bottom);y<top;y++)box(0xdac295,0,y,-.04,right-left,.025,.012);
    for(const p of points){box(edge,p.x,p.y,0,.98,.98,.10);box(road,p.x,p.y,.065,.86,.86,.08);}
    const pairs=new Set();
    stage.edges.forEach((neighbors,from)=>neighbors.forEach(to=>{
      const key=[from,to].sort((a,b)=>a-b).join(':');if(pairs.has(key))return;pairs.add(key);
      const a=this.position(from),b=this.position(to),x=(a.x+b.x)/2,y=(a.y+b.y)/2;
      box(road,x,y,.08,Math.abs(a.x-b.x)>.5?1:.84,Math.abs(a.y-b.y)>.5?1:.84,.06);
      box(0xf7e5b4,x,y,.116,Math.abs(a.x-b.x)>.5?.20:.035,Math.abs(a.y-b.y)>.5?.20:.035,.012);
    }));
    for(const [ax,ay,bx,by] of stage.oneWay||[]){
      const a=this.position(stage.ids.get(`${ax},${ay}`)),b=this.position(stage.ids.get(`${bx},${by}`));
      const x=(a.x+b.x)/2,y=(a.y+b.y)/2,angle=Math.atan2(b.y-a.y,b.x-a.x);
      box(0xffd88c,x,y,.13,.22,.045,.025,angle);
      for(const side of [-1,1])box(0xffd88c,x+Math.cos(angle)*.07-Math.sin(angle)*side*.04,y+Math.sin(angle)*.07+Math.cos(angle)*side*.04,.13,.12,.04,.025,angle-side*.7);
    }
    for(const node of stage.pockets){const p=this.position(node);box(0x55a8b4,p.x,p.y,.13,.77,.77,.08);for(const side of [-1,1])box(0xccece1,p.x+side*.30,p.y,.18,.025,.55,.015);}
    const counter=this.position(stage.counter);
    box(0xbc6544,counter.x,counter.y,.18,.88,.88,.20);
    box(0xffd689,counter.x,counter.y,.30,.83,.81,.06);
    box(0xfff1ce,counter.x,counter.y-.24,.34,.65,.10,.04);
    // Diner back wall, block windows and a striped canopy.
    const cafeY=top-.28,cafeWidth=Math.min(4.4,right-left-.5);
    this.flatRoute=maxY-minY<1;this.cafeCue=new THREE.Vector3(0,cafeY-.10,1.65);
    box(0xa84e37,0,cafeY,.46,cafeWidth,.26,1.05);
    box(0xf5e5c3,0,cafeY-.17,.50,cafeWidth-.22,.12,.77);
    for(const x of [-cafeWidth*.31,cafeWidth*.31]){
      box(0x386d6d,x,cafeY-.25,.55,.86,.06,.52);
      box(0x9ed8ce,x,cafeY-.29,.58,.68,.035,.36);
      box(0xf1d39c,x,cafeY-.32,.59,.035,.03,.38);
    }
    box(0x46766b,0,cafeY-.25,.38,.58,.09,.77);
    box(0x9ed8ce,0,cafeY-.31,.55,.40,.03,.29);
    const stripes=12;
    for(let i=0;i<stripes;i++){
      const x=-cafeWidth/2+(i+.5)*cafeWidth/stripes;
      box(i%2?0xffefcc:0xca6a45,x,cafeY-.16,1.06,cafeWidth/stripes,.42,.14);
      box(i%2?0xffefcc:0xca6a45,x,cafeY-.35,.92,cafeWidth/stripes,.06,.24);
    }
    // Finished menu placards reuse the actual snack artwork from the order tray.
    for(const [index,key] of ['bun','tea','berry'].entries()){
      const x=(index-1)*.72;
      box(0x9a633c,x,cafeY-.12,1.39,.60,.14,.62);
      box(0xffe9b2,x,cafeY-.21,1.39,.52,.04,.54);
      const texture=this.textures[`snack_${key}`];
      if(texture){
        if(!this.menuMaterials.has(key))this.menuMaterials.set(key,new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,toneMapped:false}));
        const placard=new THREE.Mesh(this.planeGeometry,this.menuMaterials.get(key));placard.position.set(x,cafeY-.26,1.40);placard.scale.set(.43,.43,1);placard.quaternion.copy(this.camera.quaternion);this.staticGroup.add(placard);
      }
    }
    // Patio rails, lantern cages and flower boxes frame the traffic lanes.
    for(const x of [left+.15,right-.15]){
      box(0x916442,x,bottom+.65,.26,.11,.11,.64);
      box(0x6b684d,x,bottom+.65,.69,.28,.26,.08);
      box(0xffd187,x,bottom+.65,.55,.19,.17,.22);
      box(0x6b684d,x,bottom+.65,.39,.27,.24,.07);
      box(0xa3794a,x,bottom+1.15,.12,.08,1.25,.20);
    }
    for(const x of [-.55,0,.55]){
      box(0xad7351,x,bottom+.13,.03,.48,.28,.23);
      box(0x60824e,x,bottom+.13,.19,.43,.25,.12);
      if(milestones>=2)for(const offset of [-.12,.1]){box(0xe7b17b,x+offset,bottom+.13,.28,.09,.09,.10);box(0xffefd0,x+offset,bottom+.12,.35,.14,.13,.05);}
    }
    // Cafe seating occupies scenery only; it never looks like a legal stop.
    const tableY=bottom+.35;
    for(const x of [left+.65,right-.65]){
      box(0x8f6449,x,tableY,.15,.12,.12,.36);
      box(0xc48450,x,tableY,.36,.58,.50,.12);
      for(const offset of [-.42,.42]){box(0x547e70,x+offset,tableY,.14,.22,.30,.25);box(0x99b99b,x+offset,tableY+.12,.28,.22,.08,.32);}
      box(0xf5e7b7,x,tableY,.44,.16,.16,.06);
    }
    const plant=(x,y)=>{
      box(0xac654a,x,y,.07,.38,.38,.25);
      box(0x386f58,x,y,.34,.48,.46,.28);
      box(0x669257,x-.10,y,.53,.31,.33,.19);
      box(0x94b969,x+.08,y-.05,.63,.22,.23,.14);
    };
    plant(left+.29,top-.35);plant(right-.29,top-.35);
    plant(left+.25,bottom+.20);plant(right-.25,bottom+.20);
    // Earned diner additions are real scene geometry; they never change routes.
    if(milestones>=1){
      box(0xb97c38,0,cafeY-.12,1.84,.78,.13,.50);box(0xffd47e,0,cafeY-.21,1.84,.66,.05,.38);
      box(0xb96c3d,0,cafeY-.25,1.83,.40,.04,.09);box(0x77a45b,0,cafeY-.25,1.88,.43,.04,.05);box(0xffe4a3,0,cafeY-.25,1.98,.46,.04,.14);
    }
    if(milestones>=3)for(const side of [-1,1]){
      const x=side*(right-left)*.23;box(0xa66d48,x,bottom+.45,.32,.72,.28,.12);box(0xe2b576,x,bottom+.58,.55,.72,.10,.30);
      for(const foot of [-.24,.24])box(0x7e654c,x+foot,bottom+.45,.12,.10,.20,.27);
    }
    if(milestones>=4)for(const x of [-1.05,1.05]){
      box(0x645d45,x,cafeY-.36,1.30,.045,.045,.36);box(0xffce78,x,cafeY-.36,1.09,.23,.20,.26);box(0xf6e5b3,x,cafeY-.37,1.09,.10,.205,.19);
    }
    if(milestones>=5)for(let i=0;i<7;i++)box(i%2?0x79b49d:0xd88c59,(i-3)*.30,cafeY-.39,.68,.20,.035,.22);
    if(milestones>=6)for(const side of [-1,1]){
      const x=side*(right-left)*.42;box(0xb98b4d,x,bottom+.20,.38,.25,.22,.62);box(0xffdda0,x,bottom+.20,.76,.38,.30,.12);box(0xdba852,x,bottom+.20,.91,.23,.22,.18);
    }
    for(const [color,items] of buckets){
      const mesh=new THREE.InstancedMesh(this.boxGeometry,this.material(color),items.length),matrix=new THREE.Matrix4();
      items.forEach((item,i)=>{matrix.compose(new THREE.Vector3(item.x,item.y,item.z),new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1),item.rotation),new THREE.Vector3(item.w,item.h,item.d));mesh.setMatrixAt(i,matrix);});
      mesh.instanceMatrix.needsUpdate=true;this.staticGroup.add(mesh);
    }
    this.resize();
  }
  show(state,selected=null,targets=[]){
    this.cancel();this.state=state;
    for(const mesh of [...this.dynamicGroup.children]){this.dynamicGroup.remove(mesh);mesh.traverse(child=>{if(child.userData.ownedMaterial)child.material.dispose();});}
    this.guestMeshes.clear();
    const ring=(node,color,scale=1)=>{const mesh=new THREE.Mesh(this.ringGeometry,this.material(color));mesh.position.copy(this.position(node));mesh.position.z=.20;mesh.scale.setScalar(scale);this.dynamicGroup.add(mesh);};
    for(const node of targets)ring(node,0xffe099,1.06);
    state.positions.forEach((node,i)=>{
      if(node<0)return;
      const animal=this.stage.guests[i].animal,texture=this.textures[animal],group=new THREE.Group();group.position.copy(this.position(node));
      const ratio=texture.image.width/texture.image.height;
      const material=new THREE.MeshBasicMaterial({map:texture,transparent:true,alphaTest:.035,depthWrite:false,toneMapped:false});
      const avatar=new THREE.Mesh(this.planeGeometry,material);avatar.userData.ownedMaterial=true;
      avatar.scale.set(Math.min(1.08,.94*ratio),.94,1);avatar.position.set(0,.15,.57);avatar.quaternion.copy(this.camera.quaternion);avatar.renderOrder=3;
      group.add(avatar);this.dynamicGroup.add(group);this.guestMeshes.set(i,group);
      if(i===selected)ring(node,0xffd17b,1.12);
    });
    this.gateMeshes=[];
    this.stage.gates.forEach((gate,i)=>{
     for(const [branch,[edge,open]] of [[[gate.a,gate.b],state.gates[i]],...(gate.alternate?[[gate.alternate,!state.gates[i]]]:[])].entries()){
      const a=this.position(this.stage.ids.get(`${edge[0][0]},${edge[0][1]}`)),b=this.position(this.stage.ids.get(`${edge[1][0]},${edge[1][1]}`));
      const group=new THREE.Group();group.position.copy(a.clone().add(b).multiplyScalar(.5));
      group.rotation.z=Math.atan2(b.y-a.y,b.x-a.x);
      for(const side of [-1,1]){const post=new THREE.Mesh(this.boxGeometry,this.material(0xe1a866));post.scale.set(.12,.12,.48);post.position.set(0,side*.35,.18);group.add(post);}
      const bar=new THREE.Mesh(this.boxGeometry,this.material(open?0x77ba9a:0xcf6547));
      bar.scale.set(.10,.78,.12);bar.position.z=open ? .78 : .36;bar.userData.gateIndex=i;bar.userData.primary=branch===0;group.add(bar);this.dynamicGroup.add(group);this.gateMeshes.push(bar);
     }
    });
    this.draw();
  }
  move(guest,route){
    const group=this.guestMeshes.get(guest);if(!group||route.length<2)return;
    const points=route.map(node=>this.position(node));group.position.copy(points[0]);this.draw();
    this.tween(this.reduced()?80:Math.min(650,180+route.length*85),progress=>{
      if(this.reduced()){group.position.copy(points.at(-1));return;}
      const value=(1-(1-progress)**2)*(points.length-1),at=Math.min(points.length-2,Math.floor(value));
      group.position.lerpVectors(points[at],points[at+1],value-at);group.position.z+=Math.sin(progress*Math.PI)*.06;
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
      group.traverse(o=>{if(o.material?.transparent)o.material.opacity=1-p;});},done);
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
      // Flat introductory lanes keep one recognisable diner cue. This single
      // anchor does not fit the whole patio or shrink dense multi-row puzzles.
      if(this.flatRoute)play.push(this.cafeCue.clone().applyMatrix4(this.camera.matrixWorldInverse));
      const minX=Math.min(...play.map(p=>p.x)),maxX=Math.max(...play.map(p=>p.x)),minY=Math.min(...play.map(p=>p.y)),maxY=Math.max(...play.map(p=>p.y));
      const offset=new THREE.Vector3((minX+maxX)/2,(minY+maxY)/2,0).applyQuaternion(this.camera.quaternion);this.camera.position.add(offset);this.camera.lookAt(offset);this.camera.updateMatrixWorld();
      const fit=Math.max((maxY-minY)/2+.07,((maxX-minX)/2+.07)/(width/height));this.camera.left=-fit*width/height;this.camera.right=fit*width/height;this.camera.top=fit;this.camera.bottom=-fit;this.camera.updateProjectionMatrix();
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
    this.boxGeometry.dispose();this.ringGeometry.dispose();this.planeGeometry.dispose();this.renderer.dispose();
  }
}
