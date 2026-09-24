import * as THREE from './vendor/three/three.module.min.js';
import { buildAxe } from './axe-model.js?v=4';

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
    this.biomeBackgrounds=['forest','marsh','frost','canopy','forge','heart'];
    this.backgroundRequest=0;this.backgroundTexture=null;
    this.backdropMaterial=new THREE.MeshBasicMaterial({color:0x8bcac1,depthWrite:false,fog:false,toneMapped:false});
    this.backdropGeometry=new THREE.PlaneGeometry(84,56);
    this.backdrop=new THREE.Mesh(this.backdropGeometry,this.backdropMaterial);this.backdrop.position.set(0,0,-27);this.backdrop.renderOrder=-2;this.s.add(this.backdrop);
    this.world=new THREE.Group();this.s.add(this.world);this.buildWorld();
    this.view=new THREE.Scene();this.view.add(new THREE.HemisphereLight(0xffeec9,0x315264,3));
    const key=new THREE.DirectionalLight(0xffe0a6,3);key.position.set(-2,3,4);this.view.add(key);
    this.vc=new THREE.PerspectiveCamera(48,1,.01,10);this.buildHands();this.resize();
    this.ray=new THREE.Raycaster();this.pointer=new THREE.Vector2();
  }
  material(color,glow=false) {
    const key=color+':'+glow;if(this.materials.has(key))return this.materials.get(key);
    // Keep the whole scene's material palette under the mobile renderer budget.
    // Late-stage bosses borrow their nearest same-emission palette entry rather
    // than creating a burst of one-off GPU materials.
    if(this.materials.size>=64){
      const entries=[...this.materials.entries()];
      const preferred=entries.filter(([candidate])=>candidate.endsWith(':'+glow));
      const candidates=preferred.length?preferred:entries;
      let best=candidates[0],bestDistance=Infinity;
      for(const entry of candidates){
        const candidate=parseInt(entry[0].split(':')[0],10);
        const dr=((candidate>>16)&255)-((color>>16)&255),dg=((candidate>>8)&255)-((color>>8)&255),db=(candidate&255)-(color&255);
        const distance=dr*dr*2+dg*dg*3+db*db;
        if(distance<bestDistance){best=entry;bestDistance=distance;}
      }
      return best[1];
    }
    const m=new THREE.MeshStandardMaterial({color,roughness:.7,metalness:glow?.3:.05,emissive:glow?color:0,emissiveIntensity:glow?.65:0});
    this.materials.set(key,m);return m;
  }
  box(parent,w,h,d,color,x=0,y=0,z=0,glow=false) {
    const mesh=new THREE.Mesh(this.geometry,this.material(color,glow));mesh.scale.set(w,h,d);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
  }
  buildWorld() {
    this.ground=this.box(this.world,34,.22,58,0x3e6850,0,-.15,-17);
    this.box(this.world,4.8,.06,48,0x998666,0,-.025,-16);
    const pathColors=[0xb3a084,0xa49473,0xc0aa80];
    for(let i=0;i<18;i++){
      const x=((i*7)%5-2)*.62,z=3-i*1.95;
      this.box(this.world,.52+(i%3)*.1,.035,.38,pathColors[i%pathColors.length],x,.018,z).rotation.y=(i%4)*.17;
    }
    for(let i=0;i<12;i++){
      const side=i%2?1:-1,x=side*(3.2+(i%3)*.48),z=2-Math.floor(i/2)*3.5;
      this.box(this.world,.5,.14,.6,i%2?0x547953:0x628552,x,-.015,z);
      if(i<8)this.box(this.world,.11,.3,.12,0x82a96a,x-side*.16,.16,z+.08).rotation.z=side*.19;
    }
    // Batch repeating path details by material; their bounded parallax sells forward travel.
    const groups=new Map();for(const mesh of [...this.world.children]){if(mesh===this.ground)continue;const batch=groups.get(mesh.material)||[];batch.push(mesh);groups.set(mesh.material,batch);}
    for(const [material,meshes] of groups){const batch=new THREE.InstancedMesh(this.geometry,material,meshes.length);batch.userData.poses=[];meshes.forEach((m,i)=>{m.updateMatrix();batch.setMatrixAt(i,m.matrix);batch.userData.poses.push({matrix:m.matrix.clone(),travel:m.scale.x<6});this.world.remove(m);});batch.castShadow=true;batch.receiveShadow=true;this.world.add(batch);}
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
    this.setCompanion('nibs');
  }
  setCompanion(id){
    if(this.nibs)this.hand.remove(this.nibs);
    this.nibs=new THREE.Group();this.hand.add(this.nibs);
    if(id!=='nibs'){
      const c=id==='moss'?0x74ab69:id==='frost'?0x8ccce2:0xe68551;
      this.box(this.nibs,.29,.26,.27,c,0,.21,0);
      this.box(this.nibs,.34,.25,.28,c,0,.43,0);
      if(id==='moss'){
        this.box(this.nibs,.39,.19,.34,0x476653,0,.25,-.04);this.box(this.nibs,.21,.13,.22,0xb7d799,0,.37,-.07);
        for(const side of [-1,1])this.box(this.nibs,.12,.07,.2,c,side*.16,.14,.02);
      }else if(id==='frost'){
        for(const side of [-1,1]){
          this.box(this.nibs,.10,.23,.2,0x44798f,side*.18,.23,0);
          this.box(this.nibs,.09,.11,.10,c,side*.13,.59,0);
          this.box(this.nibs,.13,.14,.04,0xeaffef,side*.095,.45,.15);
        }
      }else{
        for(const side of [-1,1])this.box(this.nibs,.06,.15,.07,0xdeb660,side*.10,.6,0);
        this.box(this.nibs,.30,.07,.08,c,.20,.18,-.10);this.box(this.nibs,.10,.13,.09,0xdeb660,.36,.23,-.10);
      }
      for(const side of [-1,1]){this.box(this.nibs,.05,.065,.025,0x201e1a,side*.085,.46,.17);this.box(this.nibs,.015,.02,.012,0xffffff,side*.085,.48,.188);}
      this.box(this.nibs,.065,.055,.055,id==='frost'?0xdeb660:0x694e3d,0,.38,.17);
      this.box(this.nibs,.07,.08,.04,id==='ember'?0xffcd72:0x59ddba,0,.21,.17,true);return;
    }
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
  buildFace(parent,fur,markings=0xd9b77e,eyes=0x2b241f){
    for(const side of [-1,1]){
      this.box(parent,.17,.205,.055,0x40362d,side*.19,2.04,.382);
      this.box(parent,.13,.165,.042,0xfff2d6,side*.19,2.045,.414);
      this.box(parent,.064,.105,.026,eyes,side*.18,2.035,.44);
      this.box(parent,.023,.035,.018,0xffffff,side*.164,2.069,.457,true);
      const brow=this.box(parent,.18,.045,.06,markings,side*.19,2.17,.38);brow.rotation.z=-side*.12;
      this.box(parent,.09,.09,.055,fur,side*.31,1.84,.39);
      this.box(parent,.13,.035,.035,0x45322b,side*.065,1.765,.455).rotation.z=side*.18;
    }
    this.box(parent,.36,.19,.11,0xf1dfb5,0,1.86,.405);
    this.box(parent,.075,.065,.045,0x403128,0,1.927,.48);
    this.box(parent,.035,.03,.02,0xffffff,0,1.94,.505,true);
  }
  enemyModel(e) {
    const g=new THREE.Group();g.userData.uid=e.uid;
    const object=['anchor','root-drain','root-crack'].includes(e.id), mirror=e.id.startsWith('mirror');
    const palette={
      scout:[0x879458,0x394a35,0xd8e992],shield:[0x718455,0x34463b,0xe9ce77],
      charger:[0x9b6945,0x49342c,0xf2bd65],mender:[0x78609a,0x3f3554,0xc7ee9a],
      caller:[0x657f5f,0x35483f,0x83e5d2],brute:[0x67513d,0x3c302a,0xffca61],
      mirror:[0x567e89,0x344b57,0xa4f5f3],'mirror-left':[0x567e89,0x344b57,0xb4f6ff],
      'mirror-right':[0x567e89,0x344b57,0xd6b8ff],thorn:[0x526b3d,0x354735,0xe8a06e],
      emberling:[0xb76c42,0x53372f,0xffbb4d],frostguard:[0x597d85,0x334a58,0xb6f2f2],
      siphon:[0x776293,0x40374e,0xc6a5f2],
      'boss-bell':[0x927b49,0x473b2c,0xffdf8a],'boss-furnace':[0x8e5638,0x49372f,0xff9d48],
      'boss-stag':[0x4f7c85,0x344b50,0xa8f4d6],'boss-loom':[0x526b3d,0x354735,0xc9e887],
      'boss-conductor':[0x6d5a89,0x40374e,0xd0b1ff],'boss-heart':[0x416f60,0x30463f,0x70f2d2],
      anchor:[0x58734b,0x34463a,0xf3ca77],'root-drain':[0x596f49,0x354335,0x8bdbc1],
      'root-crack':[0x66553d,0x40342d,0xff9864]
    }[e.id]||[0x886744,0x443f32,0x62dbc0];
    const [wood,dark,rune]=palette,trim=e.id==='frostguard'?0x9be5ec:e.id==='mirror'||mirror?0xbce5e8:0xd4b87d;
    if(object){
      this.box(g,.8,.22,.8,0x4e6553,0,.11,0);this.box(g,.5,1.4,.5,wood,0,.8,0);
      this.box(g,.44,.44,.44,rune,0,1.55,0,true).rotation.z=Math.PI/4;
      for(const side of [-1,1])this.box(g,.65,.18,.2,wood,side*.45,.4,0).rotation.z=side*.25;
    }else{
      this.box(g,.86,1.0,.66,wood,0,1.15,0);
      for(const side of [-1,1]){
        this.box(g,.34,.65,.38,dark,side*.27,.37,0);
        this.box(g,.43,.2,.65,wood,side*.27,.12,.16);
        this.box(g,.42,.45,.5,0xa48a57,side*.62,1.5,0);
        this.box(g,.46,.13,.52,0x3e493c,side*.62,1.36,.04);
        const arm=new THREE.Group();arm.position.set(side*.62,1.25,0);g.add(arm);
        this.box(arm,.30,.70,.34,wood,0,-.18,0);this.box(arm,.38,.29,.4,dark,0,-.5,.04);
        this.box(arm,.32,.09,.37,0xd7b56c,0,-.36,.035);
        if(side===1)g.userData.arm=arm;
      }
      this.box(g,.82,.68,.7,wood,0,2.0,0);
      this.box(g,.9,.13,.75,dark,0,2.28,0);
      this.buildFace(g,wood,e.boss?0xe9c56e:trim,mirror?0x3c8d9b:e.id==='emberling'?0x733b27:e.id==='frostguard'?0x315564:e.id==='mender'||e.id==='caller'?0x385b47:0x2b241f);
      this.box(g,.56,.37,.14,dark,0,1.44,.36);
      this.box(g,.20,.20,.065,rune,0,1.47,.445,true).rotation.z=Math.PI/4;
      this.box(g,.38,.045,.07,trim,0,1.22,.4);
      for(const side of [-1,1]){
        const leaf=e.id==='scout',ice=e.id==='frostguard',branch=e.id==='thorn'||e.id==='boss-loom';
        const outer=leaf?0x557949:ice?0xd3fbfa:branch?0x738246:trim;
        const inner=leaf?0xc4d987:ice?0x8ee0e8:branch?0xa4bd62:dark;
        const horn=this.box(g,leaf?.19:.16,leaf?.48:ice?.35:branch?.42:.34,leaf?.13:.10,outer,side*.33,leaf?2.58:ice?2.50:branch?2.52:2.45,leaf?-.02:.02);
        horn.rotation.z=leaf?-side*.28:side*(ice?.24:branch?.38:.20);
        this.box(g,leaf?.10:.075,leaf?.29:ice?.18:branch?.22:.18,.055,inner,side*.33,leaf?2.58:2.42,.085).rotation.z=leaf?-side*.28:side*.20;
      }
      for(const side of [-1,1]){
        this.box(g,.09,.67,.065,0xb79968,side*.32,1.17,.35);
        this.box(g,.12,.07,.08,0xd3b174,side*.29,1.48,.4);
      }
      for(const side of [-1,1])this.box(g,.16,.16,.18,0x72553b,side*.18,.03,.03);
    }
    const shield=this.box(g,.65,.9,.12,mirror?0x8ee0e8:0x557e63,-.72,1.04,.28);
    shield.visible=e.shield>0||mirror;g.userData.shield=shield;
    if(e.id==='shield'||e.id==='frostguard'||e.id==='boss-furnace'){
      this.box(g,1.08,.66,.24,e.id==='frostguard'?0x83c7d1:0x657c55,0,1.43,-.42);
      for(const side of [-1,1]){
        this.box(g,.36,.48,.18,e.id==='frostguard'?0xc6f1ed:0x91a86e,side*.29,1.44,-.57);
        this.box(g,.08,.37,.055,e.id==='frostguard'?0x65bdd0:0xd6c28a,side*.29,1.45,-.68);
      }
      this.box(g,.18,.16,.06,0xe7d5a3,0,1.76,-.54,true).rotation.z=Math.PI/4;
    }
    if(e.id==='charger'||e.id==='boss-stag')for(const side of [-1,1]){
      this.box(g,.17,.38,.19,0xd3bf89,side*.45,2.51,-.02).rotation.z=side*-.48;
      this.box(g,.18,.33,.17,0xe1d4ae,side*.53,2.79,.01).rotation.z=side*-.18;
      this.box(g,.24,.11,.16,0xa27c51,side*.56,2.94,.01).rotation.z=side*.12;
    }
    if(e.id==='caller'||e.id==='mender'||e.id==='boss-conductor'){
      this.box(g,.12,2.1,.12,0x604c31,.92,1.1,.1);this.box(g,.35,.35,.3,e.id==='mender'?0x9fea88:0xb396ec,.92,2.2,.1,true).rotation.z=.7;
    }
    if(e.id==='thorn'||e.id==='boss-loom')for(let i=-1;i<=1;i++){
      this.box(g,.17,.48,.18,0x738246,i*.29,2.55,-.02).rotation.z=i*.4;
      this.box(g,.12,.24,.12,0xa4bd62,i*.29,2.83,-.02).rotation.z=i*.4;
    }
    if(e.id==='shield'){
      for(let i=-1;i<=1;i++)this.box(g,.2,.32,.18,i===0?0xd6c48b:0x80905e,i*.32,1.52,-.58).rotation.z=i*.14;
      this.box(g,.12,.14,.04,0xf1d36f,0,2.56,.10,true);
    }
    if(e.id==='scout'){
      this.box(g,.82,.12,.82,0x557949,0,2.38,0);
      this.box(g,.28,.23,.27,0xc3d984,0,2.52,.04,true).rotation.z=Math.PI/4;
      this.box(g,.18,.38,.12,0x90b35e,0,2.68,-.02).rotation.z=.25;
    }
    if(e.id==='emberling'){this.box(g,.27,.45,.25,0xef9f48,.9,1.72,.15,true);this.box(g,.20,.35,.18,0xffd15b,.9,2.05,.15,true);this.box(g,.13,.22,.14,0xffe58a,.9,2.32,.15,true);}
    if(e.id==='frostguard')for(const side of [-1,1]){this.box(g,.25,.5,.25,0x8ee0e8,side*.6,1.9,0,true);this.box(g,.18,.28,.15,0xd9fbff,side*.62,2.15,.02,true);}
    if(e.id==='siphon'){this.box(g,.12,2.0,.12,0x604c31,.92,1.1,.1);this.box(g,.5,.15,.5,0xb396ec,.92,2.2,.1,true);}
    if(e.id==='brute'){
      this.box(g,.62,.68,.58,0x443f32,.9,.85,.1);
      for(const side of [-1,1]){
        this.box(g,.54,.52,.62,0x8a7554,side*.62,1.95,-.04).rotation.z=side*.12;
        this.box(g,.29,.42,.35,0x51483c,side*.72,.61,.04);
      }
      for(const side of [-1,1])this.box(g,.17,.26,.14,0xe5d09b,side*.22,1.78,.42);
      this.box(g,.12,.16,.12,0x7f9d5f,-.5,2.38,-.08);this.box(g,.12,.16,.12,0x7f9d5f,.5,2.38,-.08);
      g.scale.set(1.22,1.08,1.08);
    }
    if(e.id==='scout')g.scale.set(.78,.84,.82);
    if(e.id==='charger'){
      this.box(g,.60,.25,.56,0xc49b61,0,1.05,.40);
      this.box(g,.19,.14,.10,0xffdfa0,0,1.08,.49,true);
      g.scale.set(1.08,.92,1.04);
    }
    if(e.id==='shield'){
      this.box(g,1.25,.24,.86,0x9aaf70,0,1.77,-.42);
      this.box(g,.98,.12,.72,0xd4c58a,0,1.90,-.44);
      for(const side of [-1,1])this.box(g,.17,.62,.52,0x536b49,side*.68,1.12,-.35).rotation.z=side*.14;
    }
    if(e.id==='mender'){
      this.box(g,.72,.19,.08,0xebf0c8,0,1.46,.48,true);
      this.box(g,.20,.47,.075,0xebf0c8,0,1.46,.50,true);
      this.box(g,.62,.18,.64,0x9f84c2,0,.58,-.02);
      for(const side of [-1,1])this.box(g,.14,.44,.13,0xc7ee9a,side*.46,1.78,.02).rotation.z=-side*.24;
    }
    if(e.id==='caller'){
      this.box(g,.38,.54,.34,0xb8a1df,0,2.36,-.02);
      for(const side of [-1,1])this.box(g,.12,.14,.11,0x83e5d2,side*.38,2.32,-.06,true).rotation.z=side*.4;
      this.box(g,.44,.12,.42,0x435a44,0,.56,-.08);
    }
    if(e.id==='mirror'||mirror){
      for(const side of [-1,1]){
        const plate=this.box(g,.27,.78,.12,side<0?0x8dcbd2:0xc2b7e9,side*.57,1.52,.42,true);plate.rotation.z=side*.18;
        this.box(g,.12,.24,.09,0xf0ffff,side*.57,1.60,.50,true);
      }
      const crest=this.box(g,.64,.10,.18,0x9fe8eb,0,2.61,.02,true);crest.rotation.z=Math.PI/4;
    }
    if(e.id==='siphon'){
      for(const side of [-1,1]){
        this.box(g,.10,.12,.10,0x604c31,side*.39,1.92,-.30);
        this.box(g,.075,.82,.075,0xb396ec,side*.39,2.24,-.30,true);
        this.box(g,.20,.18,.19,0xd6c2f5,side*.39,2.68,-.30,true);
      }
      this.box(g,.52,.10,.55,0x514563,0,.52,-.04);
    }
    if(e.boss){
      const crown=this.box(g,.7,.21,.6,0xc3a858,0,2.5,0);crown.rotation.y=.2;
      if(e.id==='boss-bell'){
        this.box(g,.20,.20,.24,0xe3c56e,0,2.78,-.02);
        this.box(g,.72,.56,.72,0xb79a55,.76,1.17,-.04);
        this.box(g,.48,.39,.10,0x453a2e,.76,1.14,.35);
        this.box(g,.09,.24,.08,0xf2d17b,.76,1.02,.42,true);
        this.box(g,.7,.09,.7,0xd7bd70,.76,.88,-.03);
      }
      if(e.id==='boss-furnace'){
        this.box(g,.34,.75,.34,0x564a3b,-.48,2.35,-.28);
        this.box(g,.50,.55,.1,0xef9f48,0,1.3,.39,true);
        for(let i=-1;i<=1;i++)this.box(g,.045,.55,.12,0x554634,i*.14,1.3,.45);
        for(const side of [-1,1])this.box(g,.18,.36,.16,0x665241,side*.48,2.65,-.18).rotation.z=side*.18;
      }
      if(e.id==='boss-loom'){
        for(const side of [-1,1]){
          this.box(g,.7,.13,.18,0x84a456,side*.73,2.17,.20).rotation.z=side*.42;
          this.box(g,.18,.78,.17,0x58754a,side*.97,1.91,.18);
          this.box(g,.13,.45,.13,0xa6bd63,side*1.07,1.42,.21).rotation.z=side*.24;
        }
        this.box(g,.82,.10,.08,0xd0df90,0,1.62,.47);
        this.box(g,.10,.54,.08,0xd0df90,0,1.62,.48);
      }
      if(e.id==='boss-conductor'){
        this.box(g,.86,.12,.72,0x5e4a72,0,2.55,0);
        for(let i=-1;i<=1;i++){
          const orb=this.box(g,.17,.19,.17,0xc9a9f2,i*.31,2.75,0,true);
          if(i===0)g.userData.core=orb;
        }
        this.box(g,.12,2.25,.12,0x604c31,.96,1.22,.04);
        this.box(g,.35,.35,.32,0xb396ec,.96,2.42,.04,true).rotation.z=.7;
      }
      if(e.id==='boss-heart'){
        this.box(g,.76,.72,.16,0x375f56,0,1.30,.36);
        const core=this.box(g,.48,.48,.15,0x53efd0,0,1.31,.49,true);core.rotation.z=.785;g.userData.core=core;
        this.box(g,.16,.62,.08,0xe4d978,0,1.31,.59,true);
        this.box(g,.62,.14,.08,0xe4d978,0,1.31,.60,true);
      }
      g.scale.setScalar(1.2);
    }
    g.userData.baseScale=g.scale.x;g.userData.recoil=0;this.s.add(g);return g;
  }
  setRegion(index){
    const p=[[0x8bcac1,0x3e6850],[0xadc9ab,0x4d6744],[0x91b7c5,0x426162],[0x7baf9c,0x375548],[0x92b6ce,0x496170],[0x7fa999,0x365b48]][index]||[0x8bcac1,0x3e6850];
    this.currentRegion=Math.max(0,Math.min(5,index|0));
    this.s.background.setHex(p[0]);this.s.fog.color.setHex(p[0]);this.ground.material=this.material(p[1]);
    const scene=this.biomeBackgrounds[index]||this.biomeBackgrounds[0],request=++this.backgroundRequest;
    this.backdropMaterial.map=null;this.backdropMaterial.color.setHex(p[0]);this.backdropMaterial.needsUpdate=true;
    this.backgroundTexture?.dispose();this.backgroundTexture=null;
    const src=new URL(`./art/battle-${scene}-v1.webp`,import.meta.url).href;
    new THREE.TextureLoader().load(src,texture=>{
      if(request!==this.backgroundRequest){texture.dispose();return;}
      texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(4,this.r.capabilities.getMaxAnisotropy());
      this.backgroundTexture=texture;this.backdropMaterial.map=texture;this.backdropMaterial.color.setHex(0xffffff);this.backdropMaterial.needsUpdate=true;
    },undefined,error=>console.warn('Pawaxe biome backdrop unavailable:',error.message));
  }
  setEnemies(list){
    for(const [uid,g] of this.models)if(!list.some(e=>e.uid===uid)){this.s.remove(g);this.models.delete(uid);}
    list.forEach((e,i)=>{
      let g=this.models.get(e.uid);
      if(g&&g.userData.enemy?.id!==e.id){this.s.remove(g);this.models.delete(e.uid);g=null;}
      if(!g){g=this.enemyModel(e);this.models.set(e.uid,g);}
      g.userData.baseX=[-1.8,0,1.8,-.95,.95][e.slot];g.userData.baseZ=e.slot>=3?-5.2:-2.7;g.position.set(g.userData.baseX,0,g.userData.baseZ);
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
          const angle=i*Math.PI/4,m=this.box(this.s,.045,.22,.035,0xffd15b,g.position.x+Math.cos(angle)*.18,1.35+Math.sin(angle)*.18,g.userData.baseZ+.55,true);m.rotation.z=angle-Math.PI/2;
          this.effects.push({m,life:.25,vx:Math.cos(angle)*2.6,vy:Math.sin(angle)*2.6,burst:true});
        }
      }
      if(g&&this.effects.length<24){
        for(let i=0;i<4;i++){
          const color=e.source==='lightning'||e.source==='frost'?0x8ee0e8:e.source==='flame'?0xef9f48:e.shield?0x7cf2e0:0xe3c58a;
          const m=this.box(this.s,.07,.07,.07,color,g.position.x,1.35,g.userData.baseZ+.45,true);
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
    this.axe.scale.setScalar(Math.min(.62,aspect*.58));
    this.axe.position.set(Math.min(.80,halfW*.78),-.53,-2);
    this.axeRest=this.axe.position.clone();
    this.hand.position.set(-Math.min(.7,halfW*.68),-.7,-2);
    this.hand.scale.setScalar(Math.min(.75,aspect*.95));
  }
  render(dt,combat){
    this.clock+=dt;
    for(const g of this.models.values()){
      const e=g.userData.enemy;g.userData.recoil=Math.max(0,g.userData.recoil-dt);
      g.userData.attackKick=Math.max(0,(g.userData.attackKick||0)-dt);
      const wind=e.warned?Math.max(0,1-e.t/e.warn):0;
      g.position.x=g.userData.baseX;g.position.z=g.userData.baseZ+Math.sin(wind*Math.PI)*.3-g.userData.recoil+Math.sin(g.userData.attackKick/.2*Math.PI)*.7;
      g.rotation.z=g.userData.recoil*1.3;g.position.y=this.reduced?0:Math.sin(this.clock*2+e.uid)*.025;
      if(g.userData.arm)g.userData.arm.rotation.x=-wind*1.6;
      if(g.userData.core)g.userData.core.scale.y=1+Math.sin(this.clock*3.5)*.06;
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
  metrics(){return{models:this.models.size,effects:this.effects.length,materials:this.materials.size,geometries:this.r.info.memory.geometries,drawCalls:this.r.info.render.calls,lanes:[...this.models].map(([uid,g])=>({uid,x:g.userData.baseX})),axeGeometries:this.ownedGeometry.size,backdropLoaded:Boolean(this.backdropMaterial.map),region:this.currentRegion};}
  dispose(){this.backgroundRequest++;this.backgroundTexture?.dispose();this.backgroundTexture=null;this.backdropMaterial.map=null;this.backdropMaterial.dispose();this.backdropGeometry.dispose();this.world.traverse(o=>{if(o.isInstancedMesh)o.dispose();});this.geometry.dispose();for(const g of this.ownedGeometry)g.dispose();this.ownedGeometry.clear();this.sun.shadow.map?.dispose();for(const m of this.materials.values())m.dispose();this.materials.clear();this.models.clear();this.effects=[];this.r.dispose();}
}
