import * as THREE from './vendor/three/three.module.min.js';
import { buildAxe } from './axe-model.js';

// One renderer per run. Geometry/material caches are bounded and disposed together.
export class PawRenderer {
  constructor(canvas) {
    this.canvas=canvas; this.materials=new Map(); this.models=new Map(); this.effects=[];this.ownedGeometry=new Set();
    const outline=new THREE.Shape();outline.moveTo(-.44,-.44);outline.lineTo(.44,-.44);outline.lineTo(.44,.44);outline.lineTo(-.44,.44);outline.closePath();
    this.geometry=new THREE.ExtrudeGeometry(outline,{depth:.88,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.06,bevelThickness:.06});this.geometry.translate(0,0,-.44);
    this.clock=0; this.swingTime=0; this.shake=0;
    this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.r=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'low-power'});
    this.r.setPixelRatio(Math.min(devicePixelRatio||1,1.5)); this.r.outputColorSpace=THREE.SRGBColorSpace;
    this.r.toneMapping=THREE.ACESFilmicToneMapping; this.r.toneMappingExposure=1.15;
    this.r.shadowMap.enabled=true;this.r.shadowMap.type=THREE.PCFSoftShadowMap;
    this.r.info.autoReset=false;
    this.s=new THREE.Scene(); this.s.background=new THREE.Color(0x8bcac1);this.s.fog=new THREE.Fog(0x8bcac1,14,36);
    this.c=new THREE.PerspectiveCamera(48,1,.08,70);this.c.position.set(0,2.3,6);this.c.lookAt(0,1.4,-3);
    this.s.add(new THREE.HemisphereLight(0xfff5d5,0x244641,2.8));
    const sun=new THREE.DirectionalLight(0xffda93,3);sun.position.set(-4,9,6);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-8;sun.shadow.camera.right=8;sun.shadow.camera.top=10;sun.shadow.camera.bottom=-8;sun.shadow.bias=-.001;sun.shadow.normalBias=.03;this.sun=sun;this.s.add(sun);
    const rim=new THREE.DirectionalLight(0x69e4d2,2);rim.position.set(3,3,-8);this.s.add(rim);
    this.world=new THREE.Group();this.s.add(this.world);this.buildWorld();
    this.view=new THREE.Scene();this.view.add(new THREE.HemisphereLight(0xffeec9,0x315264,3));
    const key=new THREE.DirectionalLight(0xffe0a6,3);key.position.set(-2,3,4);this.view.add(key);
    this.vc=new THREE.PerspectiveCamera(48,1,.01,10);this.buildHands();this.resize();
    this.ray=new THREE.Raycaster();this.pointer=new THREE.Vector2();
  }
  material(color,glow=false) {
    const key=color+':'+glow;if(this.materials.has(key))return this.materials.get(key);
    const m=new THREE.MeshStandardMaterial({color,roughness:.7,metalness:glow?.3:.05,emissive:glow?color:0,emissiveIntensity:glow?.65:0});
    this.materials.set(key,m);return m;
  }
  box(parent,w,h,d,color,x=0,y=0,z=0,glow=false) {
    const mesh=new THREE.Mesh(this.geometry,this.material(color,glow));mesh.scale.set(w,h,d);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
  }
  buildWorld() {
    this.ground=this.box(this.world,30,.2,55,0x3e6850,0,-.15,-17);
    this.box(this.world,4.8,.04,45,0x998666,0,-.02,-15);
    for(let i=0;i<24;i++){
      const side=i%2?1:-1,x=side*(3.7+(i%3)*.9),z=2-Math.floor(i/2)*3.2;
      this.box(this.world,.55,4+(i%3),.65,0x594937,x,2,z);
      this.box(this.world,2.8,1.8,2.5,i%2?0x316852:0x3e7850,x,5,z);
      this.box(this.world,2.1,1.4,2,0x578953,x+.25,6,z);
      if(i<10){this.box(this.world,.13,2,.14,0x80a764,x-.6,3.1,z+.4).rotation.z=.22;this.box(this.world,.8,.25,.55,0x6f9a53,x-.5,3.6,z+.4);}
      if(i<12){this.box(this.world,.7,.3,.85,0x657e66,side*2.7,.12,z);this.box(this.world,.18,.28,.18,0xebc869,side*2.2,.14,z-.8);}
    }
    for(let i=0;i<12;i++)this.box(this.world,.7,.03,.5,0xb3a084,Math.sin(i*2)*1.7,.01,3-i*1.6).rotation.y=i;
    // Distinct heart gate gives the path a destination.
    this.box(this.world,.8,5,1,0x516a5c,-2.2,2.5,-15);this.box(this.world,.8,5,1,0x516a5c,2.2,2.5,-15);
    this.box(this.world,5.2,.8,1,0x516a5c,0,5,-15);
    this.box(this.world,1.2,1.2,.3,0x58e9c7,0,3,-15,true).rotation.z=Math.PI/4;
    // Batch static scenery by material; bounded draw calls independent of tree count.
    const horizon=new Set(this.world.children.slice(-4));
    const groups=new Map();for(const mesh of [...this.world.children]){if(mesh===this.ground)continue;const batch=groups.get(mesh.material)||[];batch.push(mesh);groups.set(mesh.material,batch);}
    for(const [material,meshes] of groups){const batch=new THREE.InstancedMesh(this.geometry,material,meshes.length);batch.userData.poses=[];meshes.forEach((m,i)=>{m.updateMatrix();batch.setMatrixAt(i,m.matrix);batch.userData.poses.push({matrix:m.matrix.clone(),travel:m.scale.x<6&&!horizon.has(m)});this.world.remove(m);});batch.castShadow=true;batch.receiveShadow=true;this.world.add(batch);}
  }
  walk(dt,elapsed){
    if(this.reduced)return;
    this.distance=((this.distance||0)+dt*5)%38;
    for(const batch of this.world.children){
      if(!batch.isInstancedMesh)continue;
      batch.userData.poses.forEach(({matrix,travel},i)=>{
        if(!travel)return;
        const moved=matrix.clone();moved.elements[14]=((matrix.elements[14]+this.distance+32)%38+38)%38-32;batch.setMatrixAt(i,moved);
      });batch.instanceMatrix.needsUpdate=true;
    }
    this.c.position.y=2.3+Math.sin(Math.min(.9,elapsed)/.9*Math.PI*4)*.045;
    if(elapsed>=.88)this.c.position.y=2.3;
  }
  buildHands() {
    this.axe=buildAxe(this);this.view.add(this.axe);
    this.hand=new THREE.Group();this.view.add(this.hand);
    this.box(this.hand,.44,.13,.36,0xe18a39,0,0,0);
    this.box(this.hand,.45,.09,.1,0xffdc9b,0,.09,.13);
    this.nibs=new THREE.Group();this.hand.add(this.nibs);
    this.box(this.nibs,.28,.29,.24,0xd39442,0,.19,0);
    this.box(this.nibs,.32,.26,.27,0xe8aa50,0,.43,0);
    this.box(this.nibs,.25,.12,.04,0xffe1a2,0,.37,.15);
    this.box(this.nibs,.05,.055,.03,0x513325,0,.415,.18);
    for(const side of [-1,1]){
      this.box(this.nibs,.095,.115,.095,0xbf7d3e,side*.11,.59,0);
      this.box(this.nibs,.05,.06,.018,0xf0c384,side*.11,.59,.054);
      this.box(this.nibs,.046,.065,.025,0x201e1a,side*.085,.455,.145);
      this.box(this.nibs,.016,.02,.009,0xffffff,side*.085-.008,.474,.16);
      this.box(this.nibs,.075,.10,.10,0xf4ca84,side*.17,.22,.02);
    }
    this.box(this.nibs,.07,.09,.04,0x59ddba,0,.21,.14,true).rotation.z=.6;
  }
  enemyModel(e) {
    const g=new THREE.Group();g.userData.uid=e.uid;
    const object=['anchor','root-drain','root-crack'].includes(e.id), mirror=e.id.startsWith('mirror');
    const wood=e.id==='thorn'||e.id==='boss-loom'?0x526b3d:mirror?0x597d85:0x886744;
    const dark=0x443f32,rune=e.id==='thorn'||e.id==='root-crack'?0xec9864:0x62dbc0;
    if(object){
      this.box(g,.8,.22,.8,0x4e6553,0,.11,0);this.box(g,.5,1.4,.5,wood,0,.8,0);
      this.box(g,.44,.44,.44,rune,0,1.55,0,true).rotation.z=Math.PI/4;
      for(const side of [-1,1])this.box(g,.65,.18,.2,wood,side*.45,.4,0).rotation.z=side*.25;
    }else{
      this.box(g,.85,1.0,.6,wood,0,1.15,0);
      for(const side of [-1,1]){
        this.box(g,.34,.65,.38,dark,side*.27,.37,0);
        this.box(g,.43,.2,.65,wood,side*.27,.12,.16);
        this.box(g,.36,.43,.45,0xa48a57,side*.62,1.5,0);
        const arm=new THREE.Group();arm.position.set(side*.62,1.25,0);g.add(arm);
        this.box(arm,.28,.72,.3,wood,0,-.18,0);this.box(arm,.38,.3,.4,dark,0,-.5,.04);
        if(side===1)g.userData.arm=arm;
      }
      this.box(g,.78,.65,.65,dark,0,1.98,0);
      this.box(g,.9,.16,.74,wood,0,2.26,0);
      this.box(g,.64,.13,.12,wood,0,1.77,.37);
      for(const side of [-1,1])this.box(g,.14,.10,.055,rune,side*.19,2,.34,true);
      this.box(g,.29,.29,.08,rune,0,1.27,.35,true).rotation.z=Math.PI/4;
      this.box(g,.32,.09,.08,0xd8b971,0,1.04,.35);
      for(const side of [-1,1]){
        this.box(g,.07,.67,.05,0xb79968,side*.32,1.17,.33);
        this.box(g,.1,.07,.08,0xd3b174,side*.29,1.48,.37);
        this.box(g,.13,.05,.07,0x2a392f,side*.18,2.09,.38).rotation.z=side*.18;
      }
    }
    const shield=this.box(g,.65,.9,.12,mirror?0x8ee0e8:0x557e63,-.72,1.04,.28);
    shield.visible=e.shield>0||mirror;g.userData.shield=shield;
    if(e.id==='charger'||e.id==='boss-stag')for(const side of [-1,1]){
      this.box(g,.13,.6,.15,0xd3bf89,side*.36,2.52,0).rotation.z=side*-.4;
      this.box(g,.28,.12,.14,0xd3bf89,side*.5,2.7,0);
    }
    if(e.id==='caller'||e.id==='mender'||e.id==='boss-conductor'){
      this.box(g,.12,2.1,.12,0x604c31,.92,1.1,.1);this.box(g,.35,.35,.3,e.id==='mender'?0x9fea88:0xb396ec,.92,2.2,.1,true).rotation.z=.7;
    }
    if(e.id==='thorn'||e.id==='boss-loom')for(let i=-1;i<=1;i++)this.box(g,.15,.42,.16,0x738246,i*.29,2.5,0).rotation.z=i*.4;
    if(e.boss){
      const crown=this.box(g,.7,.21,.6,0xc3a858,0,2.5,0);crown.rotation.y=.2;
      if(e.id==='boss-bell')this.box(g,.6,.65,.6,0xb79a55,1,1,.05);
      if(e.id==='boss-furnace'){this.box(g,.34,.75,.34,0x564a3b,-.48,2.35,-.28);this.box(g,.5,.55,.1,0xef9f48,0,1.3,.39,true);for(let i=-1;i<=1;i++)this.box(g,.045,.55,.12,0x554634,i*.14,1.3,.45);}
      if(e.id==='boss-loom')for(const side of [-1,1]){this.box(g,.6,.1,.15,0x84a456,side*.67,2.2,.2).rotation.z=side*.45;this.box(g,.15,.7,.15,0x58754a,side*.95,1.95,.2);}
      if(e.id==='boss-conductor')for(let i=-1;i<=1;i++)this.box(g,.15,.18+Math.abs(i)*.12,.15,0xb896dd,i*.28,2.66,0,true);
      if(e.id==='boss-heart')this.box(g,.6,.6,.12,0x53efd0,0,1.28,.4,true).rotation.z=.8;
      g.scale.setScalar(1.2);
    }
    g.userData.baseScale=g.scale.x;g.userData.recoil=0;this.s.add(g);return g;
  }
  setRegion(index){
    const p=[[0x8bcac1,0x3e6850],[0xadc9ab,0x4d6744],[0x91b7c5,0x426162],[0x7baf9c,0x375548],[0x92b6ce,0x496170],[0x7fa999,0x365b48]][index]||[0x8bcac1,0x3e6850];
    this.s.background.setHex(p[0]);this.s.fog.color.setHex(p[0]);this.ground.material=this.material(p[1]);
  }
  setEnemies(list){
    for(const [uid,g] of this.models)if(!list.some(e=>e.uid===uid)){this.s.remove(g);this.models.delete(uid);}
    list.forEach((e,i)=>{
      let g=this.models.get(e.uid);
      if(g&&g.userData.enemy?.id!==e.id){this.s.remove(g);this.models.delete(e.uid);g=null;}
      if(!g){g=this.enemyModel(e);this.models.set(e.uid,g);}
      g.userData.baseX=(e.slot-1)*1.8;g.position.set(g.userData.baseX,0,-2.7);
      g.userData.enemy=e;
    });
  }
  swing(strong=false,uid){this.swingTime=strong?.9:.45;this.swingDuration=this.swingTime;this.swingContact=strong?.35:.2;this.swingUid=uid;const g=this.models.get(uid);this.swingPoint=g?new THREE.Vector3(g.position.x,1.3,g.position.z+.4):null;}
  impact(strong=false){if(!this.reduced)this.shake=strong?.16:.07;}
  event(e){
    const g=this.models.get(e.uid);
    if(e.type==='swing'){this.swing(e.heavy,e.uid);if(e.windup)this.swingContact=e.windup;if(e.duration)this.swingTime=this.swingDuration=e.duration;}
    if(g&&['hurt','block','perfect'].includes(e.type))g.userData.attackKick=.2;
    if(['hit','break','perfect','defeat'].includes(e.type)){
      if(g)g.userData.recoil=e.critical?.30:e.heavy?.22:.1;
      if(e.type==='hit'||e.type==='break')this.impact(e.critical||e.heavy||e.type==='break');
      if(g&&e.critical&&this.effects.length<=16){
        for(let i=0;i<8;i++){
          const angle=i*Math.PI/4,m=this.box(this.s,.045,.22,.035,0xffd15b,g.position.x+Math.cos(angle)*.18,1.35+Math.sin(angle)*.18,-2.15,true);m.rotation.z=angle-Math.PI/2;
          this.effects.push({m,life:.25,vx:Math.cos(angle)*2.6,vy:Math.sin(angle)*2.6,burst:true});
        }
      }
      if(g&&this.effects.length<24){
        for(let i=0;i<4;i++){
          const m=this.box(this.s,.07,.07,.07,e.shield?0x7cf2e0:0xe3c58a,g.position.x,1.35,-2.25,true);
          this.effects.push({m,life:.35,vx:Math.sin(i*2+this.clock)*2,vy:1+i*.3});
        }
      }
    }
    if(e.type==='ally')this.allyPulse=.6;
  }
  impactPoint(uid){
    const g=this.models.get(uid);if(!g)return{x:50,y:40};
    const p=new THREE.Vector3(g.position.x,1.7,g.position.z+.4).project(this.c);
    return{x:THREE.MathUtils.clamp((p.x+1)*50,14,86),y:THREE.MathUtils.clamp((1-p.y)*50,30,70)};
  }
  pick(x,y){
    const b=this.canvas.getBoundingClientRect();this.pointer.set((x-b.left)/b.width*2-1,-(y-b.top)/b.height*2+1);
    this.ray.setFromCamera(this.pointer,this.c);
    const hit=this.ray.intersectObjects([...this.models.values()],true)[0];
    if(!hit)return null;let o=hit.object;while(o&&!o.userData.uid)o=o.parent;return o?.userData.uid;
  }
  resize(){
    const b=this.canvas.getBoundingClientRect(),w=Math.max(1,b.width),h=Math.max(1,b.height);
    this.r.setSize(w,h,false);const aspect=w/h;this.c.aspect=aspect;
    this.c.fov=THREE.MathUtils.radToDeg(2*Math.atan(Math.tan(THREE.MathUtils.degToRad(48/2))/Math.min(1,aspect/.78)));
    this.c.updateProjectionMatrix();this.vc.aspect=aspect;this.vc.updateProjectionMatrix();
    const halfW=Math.tan(THREE.MathUtils.degToRad(24))*2*aspect;
    this.axe.scale.setScalar(Math.min(.85,aspect*.95));
    this.axe.position.set(Math.min(.80,halfW*.78),-.53,-2);
    this.axeRest=this.axe.position.clone();
    this.hand.position.set(-Math.min(.7,halfW*.68),-.7,-2);
  }
  render(dt,combat){
    this.clock+=dt;
    for(const g of this.models.values()){
      const e=g.userData.enemy;g.userData.recoil=Math.max(0,g.userData.recoil-dt);
      g.userData.attackKick=Math.max(0,(g.userData.attackKick||0)-dt);
      const wind=e.warned?Math.max(0,1-e.t/e.warn):0;
      g.position.x=g.userData.baseX;g.position.z=-2.7+Math.sin(wind*Math.PI)*.3-g.userData.recoil+Math.sin(g.userData.attackKick/.2*Math.PI)*.7;
      g.rotation.z=g.userData.recoil*1.3;g.position.y=this.reduced?0:Math.sin(this.clock*2+e.uid)*.025;
      if(g.userData.arm)g.userData.arm.rotation.x=-wind*1.6;
      g.userData.shield.visible=e.shield>0||e.reflect>0;
      const scale=g.userData.baseScale;g.scale.setScalar(scale);
    }
    if(this.swingTime>0){
      this.swingTime=Math.max(0,this.swingTime-dt);
      const p=1-this.swingTime/this.swingDuration;
      this.axe.rotation.z=-.15+Math.sin(p*Math.PI*2)*.9;
      this.axe.rotation.x=-Math.sin(p*Math.PI)*.7;
      if(this.swingPoint){
        const projection=this.swingPoint.clone().project(this.c),halfH=Math.tan(THREE.MathUtils.degToRad(24))*2;
        const contact=this.swingContact/this.swingDuration,reach=p<contact?Math.sin(p/contact*Math.PI/2):Math.cos((p-contact)/(1-contact)*Math.PI/2);
        const tip=this.axe.userData.tip.clone().multiplyScalar(this.axe.scale.x).applyEuler(this.axe.rotation);
        const aim=new THREE.Vector3(projection.x*halfH*this.vc.aspect-tip.x,projection.y*halfH-tip.y,-2-tip.z);
        this.axe.position.copy(this.axeRest).lerp(aim,Math.max(0,reach));
      }
    }else{this.axe.position.copy(this.axeRest);this.axe.rotation.z=combat?.guard?-.95:-.18;this.axe.rotation.x=0;}
    if(combat?.guard&&combat.pending===null&&this.swingTime>0)this.swingTime=0;
    this.allyPulse=Math.max(0,(this.allyPulse||0)-dt);this.nibs.rotation.y=Math.sin(this.clock*1.2)*.08;
    this.nibs.position.y=this.allyPulse>0?Math.sin(this.allyPulse*8)*.08:0;
    for(const f of this.effects){f.life-=dt;if(!this.reduced){f.m.position.x+=f.vx*dt;f.m.position.y+=f.vy*dt;if(!f.burst){f.vy-=7*dt;f.m.rotation.x+=dt*6;}}}
    this.effects=this.effects.filter(f=>{if(f.life<=0){this.s.remove(f.m);return false;}return true;});
    this.shake=Math.max(0,this.shake-dt);this.c.position.x=this.shake>0?Math.sin(this.clock*90)*this.shake*.12:0;
    this.r.info.reset();this.r.autoClear=true;this.r.render(this.s,this.c);this.r.autoClear=false;this.r.clearDepth();this.r.render(this.view,this.vc);
  }
  metrics(){return{models:this.models.size,effects:this.effects.length,materials:this.materials.size,geometries:this.r.info.memory.geometries,drawCalls:this.r.info.render.calls,lanes:[...this.models].map(([uid,g])=>({uid,x:g.userData.baseX})),axeGeometries:this.ownedGeometry.size};}
  dispose(){this.world.traverse(o=>{if(o.isInstancedMesh)o.dispose();});this.geometry.dispose();for(const g of this.ownedGeometry)g.dispose();this.ownedGeometry.clear();this.sun.shadow.map?.dispose();for(const m of this.materials.values())m.dispose();this.materials.clear();this.models.clear();this.effects=[];this.r.dispose();}
}
