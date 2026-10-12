import * as THREE from './vendor/three/three.module.min.js';
import { buildAxe } from './axe-model.js?v=5';

// One renderer per run. Geometry/material caches are bounded and disposed together.
export class PawRenderer {
  constructor(canvas) {
    this.canvas=canvas; this.materials=new Map(); this.models=new Map(); this.effects=[];this.ownedGeometry=new Set();this.handDetails=[];this.disposed=false;this.surfaceReady=false;
    const outline=new THREE.Shape();outline.moveTo(-.44,-.44);outline.lineTo(.44,-.44);outline.lineTo(.44,.44);outline.lineTo(-.44,.44);outline.closePath();
    this.geometry=new THREE.ExtrudeGeometry(outline,{depth:.88,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.06,bevelThickness:.06});this.geometry.translate(0,0,-.44);
    const normals=this.geometry.attributes.normal,faceShade=new Float32Array(normals.count*3),faceLight=new THREE.Vector3(-.32,.72,.62).normalize(),faceNormal=new THREE.Vector3();
    for(let i=0;i<normals.count;i++){
      faceNormal.fromBufferAttribute(normals,i);
      const shade=.68+Math.max(0,faceNormal.dot(faceLight))*.38+Math.max(0,faceNormal.y)*.12,offset=i*3;
      faceShade[offset]=faceShade[offset+1]=faceShade[offset+2]=shade;
    }
    this.geometry.setAttribute('color',new THREE.BufferAttribute(faceShade,3));
    this.clock=0; this.swingTime=0; this.shake=0;
    this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.r=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'low-power'});
    this.r.setPixelRatio(Math.min(devicePixelRatio||1,1.5)); this.r.outputColorSpace=THREE.SRGBColorSpace;
    const grainSize=64,grain=new Uint8Array(grainSize*grainSize*4);let grainSeed=0x51f15e;
    for(let i=0;i<grainSize*grainSize;i++){
      grainSeed^=grainSeed<<13;grainSeed^=grainSeed>>>17;grainSeed^=grainSeed<<5;
      const value=238+(grainSeed>>>0)%18,offset=i*4;grain[offset]=grain[offset+1]=grain[offset+2]=value;grain[offset+3]=255;
    }
    this.surfaceTexture=new THREE.DataTexture(grain,grainSize,grainSize,THREE.RGBAFormat);
    this.surfaceTexture.colorSpace=THREE.NoColorSpace;this.surfaceTexture.generateMipmaps=true;
    this.surfaceTexture.minFilter=THREE.LinearMipmapLinearFilter;this.surfaceTexture.magFilter=THREE.LinearFilter;
    this.surfaceTexture.anisotropy=Math.min(2,this.r.capabilities.getMaxAnisotropy());this.surfaceTexture.needsUpdate=true;
    // All authored cuboid colors travel as instance colors, so the rendered
    // forest, cast and first-person hands share two bounded materials instead
    // of issuing one draw call for every sculpted block.
    this.batchMaterials=new Map([
      [false,new THREE.MeshStandardMaterial({color:0xffffff,vertexColors:true,bumpMap:this.surfaceTexture,bumpScale:.035,roughness:.78,metalness:.05})],
      [true,new THREE.MeshStandardMaterial({color:0xffffff,vertexColors:true,bumpMap:this.surfaceTexture,bumpScale:.025,roughness:.52,metalness:.24,emissive:0xffffff,emissiveIntensity:.18})]
    ]);
    // Give the live cast and Fia/Nibs clearly visible carved facets at phone
    // size. The v40 side-by-side render showed that sub-.6 bump strength was
    // imperceptible in play, so use legible relief without tinting the species
    // palette or adding draws.
    this.actorBatchMaterials=new Map([
      [false,new THREE.MeshPhysicalMaterial({color:0xffffff,vertexColors:true,bumpMap:this.surfaceTexture,bumpScale:1.25,roughness:.66,metalness:.06,clearcoat:.18,clearcoatRoughness:.58})],
      [true,new THREE.MeshPhysicalMaterial({color:0xffffff,vertexColors:true,bumpMap:this.surfaceTexture,bumpScale:.85,roughness:.46,metalness:.22,emissive:0xffffff,emissiveIntensity:.18,clearcoat:.24,clearcoatRoughness:.46})]
    ]);
    this.actorBatches=[];this.viewBatches=[];
    this.batchScratch=new THREE.Matrix4();this.batchHiddenMatrix=new THREE.Matrix4().makeScale(0,0,0);
    // Keep the bounded generated grain as a fast fallback, then replace its
    // single GPU texture with the authored neutral Block Animals surface map.
    new THREE.TextureLoader().load(new URL('./art/materials/forest-guardian-surface-v10.webp',import.meta.url).href,texture=>{
      if(this.disposed){texture.dispose();return;}
      texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=THREE.RepeatWrapping;texture.wrapT=THREE.RepeatWrapping;
      texture.generateMipmaps=true;texture.minFilter=THREE.LinearMipmapLinearFilter;texture.magFilter=THREE.LinearFilter;
      texture.anisotropy=Math.min(2,this.r.capabilities.getMaxAnisotropy());
      const fallback=this.surfaceTexture;this.surfaceTexture=texture;
      for(const material of this.materials.values()){material.map=null;material.bumpMap=texture;material.needsUpdate=true;}
      for(const material of this.batchMaterials.values()){material.map=null;material.bumpMap=texture;material.needsUpdate=true;}
      for(const material of this.actorBatchMaterials.values()){material.map=null;material.bumpMap=texture;material.needsUpdate=true;}
      for(const material of this.groundMaterials||[]){material.map=null;material.bumpMap=texture;material.needsUpdate=true;}
      fallback.dispose();this.surfaceReady=true;
    },undefined,error=>console.warn('Pawaxe surface texture unavailable:',error.message));
    this.r.toneMapping=THREE.ACESFilmicToneMapping; this.r.toneMappingExposure=1.0;
    this.r.shadowMap.enabled=true;this.r.shadowMap.type=THREE.PCFSoftShadowMap;
    this.r.info.autoReset=false;
    this.s=new THREE.Scene(); this.s.background=new THREE.Color(0x8bcac1);this.s.fog=new THREE.Fog(0x8bcac1,14,36);
    this.effectBatch=new THREE.InstancedMesh(this.geometry,this.batchMaterials.get(true),24);this.effectBatch.count=0;this.effectBatch.instanceMatrix.setUsage(THREE.DynamicDrawUsage);this.effectBatch.castShadow=false;this.effectBatch.receiveShadow=false;this.s.add(this.effectBatch);this.effectScratch=new THREE.Object3D();
    this.c=new THREE.PerspectiveCamera(48,1,.08,70);this.c.position.set(0,2.3,6);this.c.lookAt(0,1.4,-3);
    this.s.add(new THREE.HemisphereLight(0xfff5d5,0x244641,1.15));
    const sun=new THREE.DirectionalLight(0xffda93,3);sun.position.set(-4,9,6);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-8;sun.shadow.camera.right=8;sun.shadow.camera.top=10;sun.shadow.camera.bottom=-8;sun.shadow.bias=-.001;sun.shadow.normalBias=.03;this.sun=sun;this.s.add(sun);
    const rim=new THREE.DirectionalLight(0x69e4d2,1.9);rim.position.set(3,3,-8);this.s.add(rim);
    const fill=new THREE.DirectionalLight(0xffc982,.58);fill.position.set(5,4,5);this.s.add(fill);
    this.biomeBackgrounds=['forest','marsh','frost','canopy','forge','heart'];
    this.backgroundRequest=0;this.backgroundTexture=null;
    this.contactGeometry=new THREE.CircleGeometry(.62,20);
    this.contactMaterial=new THREE.MeshBasicMaterial({color:0x17251d,transparent:true,opacity:.28,depthWrite:false,toneMapped:false,side:THREE.DoubleSide});
    this.backdropMaterial=new THREE.MeshBasicMaterial({color:0xdde1d6,depthWrite:false,fog:false,toneMapped:false});
    this.backdropGeometry=new THREE.PlaneGeometry(84,56);
    this.backdrop=new THREE.Mesh(this.backdropGeometry,this.backdropMaterial);this.backdrop.position.set(0,0,-27);this.backdrop.renderOrder=-2;this.s.add(this.backdrop);
    this.world=new THREE.Group();this.s.add(this.world);this.buildWorld();
    this.view=new THREE.Scene();this.view.add(new THREE.HemisphereLight(0xffeec9,0x315264,1.25));
    const key=new THREE.DirectionalLight(0xffe0a6,2.8);key.position.set(-2,3,4);this.view.add(key);
    const toolFill=new THREE.DirectionalLight(0xffd197,.55);toolFill.position.set(2,-1,4);this.view.add(toolFill);
    this.vc=new THREE.PerspectiveCamera(48,1,.01,10);this.buildHands();this.rebuildBoxBatches(this.view,[this.hand,this.nibs,this.axeArm],'viewBatches');this.resize();
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
    const m=new THREE.MeshStandardMaterial({color,bumpMap:this.surfaceTexture,bumpScale:glow?.025:.035,roughness:glow?.52:.78,metalness:glow?.34:.05,emissive:glow?color:0,emissiveIntensity:glow?.65:0});
    this.materials.set(key,m);return m;
  }
  box(parent,w,h,d,color,x=0,y=0,z=0,glow=false) {
    const mesh=new THREE.Mesh(this.geometry,this.batchMaterials.get(Boolean(glow)));mesh.scale.set(w,h,d);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;mesh.userData.wpBatchColor=color;mesh.userData.wpBatchGlow=Boolean(glow);parent.add(mesh);return mesh;
  }
  rebuildBoxBatches(scene,roots,field){
    for(const batch of this[field]){scene.remove(batch);batch.dispose();}
    this[field]=[];
    const sources=new Map([[false,[]],[true,[]]]);
    for(const root of roots){
      // Keep detached source meshes on their model root so a later roster
      // rebuild (for example, a boss summoning or losing a support) can batch
      // every surviving actor again. Traversing the root alone only finds new
      // meshes after the first pass because the originals are instanced.
      const found=Array.isArray(root.userData.wpBatchSources)&&root.userData.wpBatchSources.length
        ?root.userData.wpBatchSources:[];
      if(!found.length)root.traverse(mesh=>{
        if(mesh.isMesh&&!mesh.isInstancedMesh&&mesh.geometry===this.geometry&&mesh.parent)found.push(mesh);
      });
      root.userData.wpBatchSources=found;
      for(const mesh of found){
        const parent=mesh.userData.wpBatchParent||mesh.parent;if(!parent)continue;
        mesh.updateMatrix();mesh.userData.wpBatchParent=parent;mesh.userData.wpBatchRoot=root;
        sources.get(Boolean(mesh.userData.wpBatchGlow)).push(mesh);parent.remove(mesh);
      }
    }
    for(const [glow,meshes] of sources){
      if(!meshes.length)continue;
      const materialSet=field==='actorBatches'||field==='viewBatches'?this.actorBatchMaterials:this.batchMaterials;
      const batch=new THREE.InstancedMesh(this.geometry,materialSet.get(glow),meshes.length);
      batch.instanceMatrix.setUsage(THREE.DynamicDrawUsage);batch.userData.wpBatchSources=meshes;
      batch.castShadow=true;batch.receiveShadow=true;
      meshes.forEach((mesh,index)=>batch.setColorAt(index,new THREE.Color(mesh.userData.wpBatchColor)));
      batch.instanceColor.needsUpdate=true;scene.add(batch);this[field].push(batch);
    }
  }
  updateBoxBatches(scene,batches){
    scene.updateMatrixWorld(true);
    for(const batch of batches){
      batch.userData.wpBatchSources.forEach((mesh,index)=>{
        const parent=mesh.userData.wpBatchParent;let visible=mesh.visible,node=parent;
        while(node){visible=visible&&node.visible;node=node.parent;}
        if(visible){parent.updateWorldMatrix(true,false);mesh.updateMatrix();this.batchScratch.copy(parent.matrixWorld).multiply(mesh.matrix);batch.setMatrixAt(index,this.batchScratch);}
        else batch.setMatrixAt(index,this.batchHiddenMatrix);
      });
      batch.instanceMatrix.needsUpdate=true;
    }
  }
  groundTint(color,opacity){const material=this.material(color).clone();material.transparent=true;material.opacity=opacity;material.depthWrite=false;this.groundMaterials.add(material);return material;}
  buildWorld() {
    this.groundMaterials=new Set();
    // Keep real 3D contact and shadows while the authored biome trail remains
    // visible through the ground instead of being masked by a solid colour.
    this.ground=this.box(this.world,34,.22,58,0x3e6850,0,-.15,-17);this.ground.material=this.groundTint(0x3e6850,.12);
    this.path=this.box(this.world,4.8,.06,48,0x998666,0,-.025,-16);this.path.material=this.groundTint(0x998666,.30);
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
    // Layer low, authored block-foliage and trail stones into the otherwise
    // broad walkable plane. buildWorld batches these by material below, so the
    // extra ground detail stays bounded in draw calls on mobile.
    const foliage=[0x315b45,0x47734d,0x71925a,0x91a968],stem=0x526844;
    for(let i=0;i<24;i++){
      const side=i%2?1:-1,row=Math.floor(i/2),x=side*(2.55+(row%6)*.58),z=1.4-Math.floor(row/6)*3.45-(row%3)*.34;
      const leaf=this.box(this.world,.24+(row%3)*.07,.085,.46,foliage[row%foliage.length],x,-.015,z);
      leaf.rotation.y=side*(.18+(row%4)*.11);leaf.rotation.z=side*.14;
      if(row%2===0){
        const sprout=this.box(this.world,.11,.26,.11,stem,x-side*.08,.1,z+.05);sprout.rotation.z=side*.18;
      }
      if(row%5===0)this.box(this.world,.13,.11,.13,row%10?0xe5b65e:0x7fc9b2,x+side*.1,.13,z+.1,true);
    }
    const trailStone=[0xc0aa80,0x9b8c6e,0xd1bc91];
    for(let i=0;i<36;i++){
      const side=i%2?1:-1,row=Math.floor(i/2),x=side*(.78+(row%5)*.22),z=1.8-Math.floor(row/5)*1.95-(row%2)*.24;
      if(z< -1.4&&z> -6.4)continue;
      const stone=this.box(this.world,.16+(row%3)*.05,.025,.15+(row%4)*.035,trailStone[row%trailStone.length],x,.012,z);
      stone.rotation.y=side*(row%5)*.13;
    }
    // Batch repeating path details by material; their bounded parallax sells forward travel.
    const groups=new Map([[false,[]],[true,[]]]);for(const mesh of [...this.world.children]){if(mesh===this.ground||mesh===this.path)continue;groups.get(Boolean(mesh.userData.wpBatchGlow)).push(mesh);}
    for(const [glow,meshes] of groups){if(!meshes.length)continue;const batch=new THREE.InstancedMesh(this.geometry,this.batchMaterials.get(glow),meshes.length);batch.userData.poses=[];meshes.forEach((m,i)=>{m.updateMatrix();batch.setMatrixAt(i,m.matrix);batch.setColorAt(i,new THREE.Color(m.userData.wpBatchColor));batch.userData.poses.push({matrix:m.matrix.clone(),travel:m.scale.x<6});this.world.remove(m);});batch.instanceMatrix.needsUpdate=true;batch.instanceColor.needsUpdate=true;batch.castShadow=true;batch.receiveShadow=true;this.world.add(batch);}
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
    this.axeArm=new THREE.Group();this.axe.add(this.axeArm);
    // Give the axe a forearm at its grip. The earlier composition placed
    // Fia's companion hand at one edge and the unsupported axe at the other,
    // making the weapon read like a floating prop instead of an action.
    this.box(this.axeArm,.30,.44,.25,0xd96f30,0,-.50,-.13);
    this.box(this.axeArm,.32,.11,.28,0x1769d2,0,-.30,.006);
    this.box(this.axeArm,.29,.027,.29,0x30d5ed,0,-.265,.03,true);
    this.box(this.axeArm,.34,.055,.28,0xf0c384,0,-.365,.006);
    // A compact spark mark ties the gripping arm to Fia's blue cuff motif.
    this.box(this.axeArm,.095,.034,.026,0xffd34e,.09,-.43,.018,true);
    this.box(this.axeArm,.055,.074,.026,0xffd34e,.075,-.48,.018,true);
    this.box(this.axeArm,.105,.034,.026,0xffd34e,.09,-.525,.018,true);
    this.hand=new THREE.Group();this.view.add(this.hand);
    // Carry Fia's recognizable comet-blue cuff and spark-paw motif into the
    // first-person view. The earlier plain orange forearm lost her identity
    // beside the finished square lobby portrait.
    this.box(this.hand,.42,.18,.34,0xe18a39,0,.015,0);
    this.box(this.hand,.38,.075,.14,0xffdc9b,0,.09,.12);
    this.box(this.hand,.34,.11,.34,0x1769d2,0,-.105,.015);
    this.box(this.hand,.37,.03,.35,0x30d5ed,0,-.045,.015,true);
    this.box(this.hand,.10,.075,.11,0x1769d2,-.20,-.115,-.055);
    this.box(this.hand,.075,.065,.10,0x30d5ed,-.275,-.16,-.055,true);

    const makeMarks=(color,glow,parts)=>{
      const marks=new THREE.InstancedMesh(this.geometry,this.material(color,glow),parts.length);
      const pose=new THREE.Object3D();
      parts.forEach(([x,y,z,w,h,d,rotation],index)=>{
        pose.position.set(x,y,z);pose.rotation.set(0,0,rotation);pose.scale.set(w,h,d);pose.updateMatrix();
        marks.setMatrixAt(index,pose.matrix);
      });
      marks.instanceMatrix.needsUpdate=true;marks.castShadow=false;this.hand.add(marks);this.handDetails.push(marks);
    };
    makeMarks(0x30d5ed,true,[
      [-.07,-.045,.205,.13,.035,.025,-.25],
      [.015,-.105,.205,.075,.035,.025,.5],
      [-.035,-.16,.205,.12,.035,.025,-.25]
    ]);
    makeMarks(0xffd65c,true,[
      [.17,-.095,.205,.09,.035,.025,0],
      [.17,-.095,.205,.035,.09,.025,0],
      [.17,-.095,.205,.06,.06,.025,.78],
      [.17,-.095,.205,.06,.06,.025,-.78]
    ]);
    makeMarks(0xffdc9b,false,[
      [-.105,-.205,.185,.085,.07,.035,0],
      [0,-.215,.185,.085,.08,.035,0],
      [.105,-.205,.185,.085,.07,.035,0]
    ]);
    makeMarks(0x604c3f,false,[
      [-.105,-.255,.198,.035,.045,.025,.12],
      [0,-.262,.198,.035,.045,.025,0],
      [.105,-.255,.198,.035,.045,.025,-.12]
    ]);
    // Extend the cuff into a readable Fia forearm instead of ending at a
    // floating wrist block. The sleeve stays cuboid, with a stepped fur edge,
    // scarf-blue cuff, and the poster's warm-gold spark mark.
    const forearm=new THREE.Group();forearm.position.set(-.015,-.13,-.055);forearm.rotation.z=-.08;this.hand.add(forearm);
    this.box(forearm,.34,.48,.29,0xd96f30,0,-.23,-.025);
    this.box(forearm,.27,.16,.31,0xf39b43,-.025,-.12,.035);
    this.box(forearm,.34,.055,.31,0x1769d2,0,-.055,.015);
    this.box(forearm,.30,.025,.32,0x30d5ed,0,-.035,.02,true);
    this.box(forearm,.11,.24,.055,0xb95829,-.19,-.27,.11);
    // Three stepped lightning facets read as the same spark-paw mark as Fia's
    // scarf, but remain small enough not to compete with Nibs on a phone.
    const bolt=this.box(forearm,.095,.075,.035,0xffd34e,.015,-.20,.145,true);bolt.rotation.z=-.32;
    const boltStep=this.box(forearm,.065,.11,.035,0xffd34e,-.015,-.275,.145,true);boltStep.rotation.z=.38;
    const boltFoot=this.box(forearm,.105,.065,.035,0xffd34e,.025,-.35,.145,true);boltFoot.rotation.z=-.28;
    // Separate cream paw pads and tiny dark claws make the front edge read as
    // Fia's hand, not an extra flat sleeve plate.
    for(const x of [-.13,-.045,.045,.13]){
      this.box(this.hand,.062,.085,.075,0xffe5c8,x,-.215,.19);
      this.box(this.hand,.027,.035,.025,0x594237,x,-.27,.225);
    }
    const thumb=this.box(this.hand,.105,.12,.12,0xffe5c8,.215,-.105,.12);thumb.rotation.z=-.48;
    const thumbClaw=this.box(this.hand,.035,.04,.03,0x594237,.255,-.145,.18);thumbClaw.rotation.z=-.48;
    this.setCompanion('nibs');
  }
  setCompanion(id){
    const previous=this.nibs;
    if(previous){
      this.hand.remove(previous);
      if(Array.isArray(this.hand.userData.wpBatchSources)){
        this.hand.userData.wpBatchSources=this.hand.userData.wpBatchSources.filter(mesh=>mesh.userData.wpBatchParent!==previous);
      }
    }
    this.nibs=new THREE.Group();this.hand.add(this.nibs);
    this.nibs.userData.companionId=id;
    // Keep the ally as a small companion perched on the first-person paw. Its
    // ears, muzzle and scarf stay visible without reading like a second hero.
    this.nibs.scale.setScalar(.40);
    this.nibs.position.set(-.38,.08,.22);
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
      this.box(this.nibs,.07,.08,.04,id==='ember'?0xffcd72:0x59ddba,0,.21,.17,true);
      this.rebuildCompanionBatches();return;
    }
    this.box(this.nibs,.30,.25,.24,0xb7632c,0,.18,0);
    this.box(this.nibs,.32,.25,.27,0xd27a34,0,.405,0);
    this.box(this.nibs,.21,.10,.045,0xf1d3a8,0,.36,.15);
    this.box(this.nibs,.045,.045,.028,0x513325,0,.405,.18);
    // Stepped fox ears and a clear blue scarf make the tiny ally read as a
    // character instead of a stack of same-sized cubes.
    for(const side of [-1,1]){
      const earBase=this.box(this.nibs,.09,.12,.08,0x984b25,side*.105,.565,0);earBase.rotation.z=-side*.16;
      const earTip=this.box(this.nibs,.065,.11,.065,0xc36c35,side*.12,.655,0);earTip.rotation.z=-side*.20;
      const earInner=this.box(this.nibs,.042,.075,.022,0xf0a98c,side*.105,.585,.052);earInner.rotation.z=-side*.16;
    }
    this.box(this.nibs,.25,.085,.055,0x1769d2,0,.275,.18);
    this.box(this.nibs,.19,.026,.025,0x30d5ed,0,.31,.214,true);
    const pendant=this.box(this.nibs,.09,.10,.05,0xf6bf3e,0,.19,.19,true);pendant.rotation.z=Math.PI/4;
    this.box(this.nibs,.036,.04,.022,0x30d5ed,0,.19,.222,true);
    const tail=this.box(this.nibs,.16,.11,.13,0x8f4d29,-.19,.15,-.105);tail.rotation.z=.42;
    for(const side of [-1,1]){
      this.box(this.nibs,.05,.06,.018,0xf0c384,side*.11,.59,.054);
      this.box(this.nibs,.046,.060,.025,0x201e1a,side*.085,.43,.145);
      this.box(this.nibs,.016,.02,.009,0xffffff,side*.085-.008,.448,.16);
      this.box(this.nibs,.075,.09,.10,0xe8c28a,side*.17,.20,.02);
    }
    this.box(this.nibs,.07,.08,.04,0x59ddba,0,.20,.14,true).rotation.z=.6;
    this.rebuildCompanionBatches();
  }
  rebuildCompanionBatches(){
    // setCompanion replaces meshes after the constructor's first batch pass.
    // Rebuild so the selected ally keeps its authored instance colors in view.
    if(this.viewBatches?.length)this.rebuildBoxBatches(this.view,[this.hand,this.nibs,this.axeArm],'viewBatches');
  }
  buildFace(parent,fur,markings=0xd9b77e,eyes=0x2b241f,profile='scout'){
    // Layered cuboid masks, eyes and muzzle shapes give each forest species a
    // readable face at the live Battle scale without introducing new assets.
    const faces={
      scout:{plate:0x74834b,brow:0xd8e992,iris:0x34442d,muzzle:0xe9d5ab,cheek:0xaabc6c,nose:0x41342c,symbol:0xc4df77},
      shield:{plate:0x3c5340,brow:0xe9ce77,iris:0x705734,muzzle:0xcbb990,cheek:0x758650,nose:0x372e26,browAngle:.28,symbol:0xe9ce77},
      charger:{plate:0x8f6041,brow:0xf2bd65,iris:0x493426,muzzle:0xe8d7b5,cheek:0xc49b61,nose:0x403128,muzzleWidth:.52,nostrils:true},
      'boss-stag':{plate:0x385f58,brow:0xa8f4d6,iris:0x215c54,muzzle:0xe4e6c7,cheek:0x83b8a0,nose:0x33463d,muzzleWidth:.54,symbol:0x70e4ca,glowEyes:true},
      mirror:{plate:0x91cdd3,brow:0xf0ffff,iris:0x2b8993,muzzle:0xe5f4ec,cheek:0xc0edf0,nose:0x52757a,symbol:0x8ee0e8,seam:true,glowEyes:true},
      emberling:{plate:0x984d32,brow:0xffca61,iris:0x55321f,muzzle:0xc7784c,cheek:0xd2864c,nose:0x512d24,fangs:true,nostrils:true,glowEyes:true},
      brute:{plate:0x544234,brow:0xffca61,iris:0x4a2f1b,muzzle:0xa27b4e,cheek:0x826341,nose:0x423126,muzzleWidth:.56,browAngle:.27,fangs:true},
      mender:{plate:0x73618e,brow:0xc7ee9a,iris:0x32533b,muzzle:0xe4d4b5,cheek:0xa69ac6,nose:0x443a36,cheekMark:0xc7ee9a,symbol:0xc7ee9a},
      caller:{plate:0x546b4d,brow:0x83e5d2,iris:0x285247,muzzle:0xe4d8b7,cheek:0x789164,nose:0x34483d,symbol:0x83e5d2,glowEyes:true},
      thorn:{plate:0x405835,brow:0xe8a06e,iris:0x7b412c,muzzle:0xd7c79c,cheek:0x687b44,nose:0x44362d,browAngle:.32,cheekMark:0xe8a06e,fangs:true},
      frostguard:{plate:0x91c5cb,brow:0xe9ffff,iris:0x285e6c,muzzle:0xe3f4ec,cheek:0xb8e5e8,nose:0x45636a,cheekMark:0x8ee0e8,symbol:0xb6f2f2,glowEyes:true},
      siphon:{plate:0x57476d,brow:0xc6a5f2,iris:0x3d2d57,muzzle:0xc4b9d1,cheek:0x796b90,nose:0x41384c,browAngle:.25,cheekMark:0xc6a5f2},
      'boss-bell':{plate:0x79653f,brow:0xffdf8a,iris:0x534328,muzzle:0xe1d2a8,cheek:0xaa9260,nose:0x44392d,symbol:0xffdf8a},
      'boss-furnace':{plate:0x643e30,brow:0xff9d48,iris:0x61311e,muzzle:0x885138,cheek:0xa3643d,nose:0x4e2c24,symbol:0xff9d48,glowEyes:true,fangs:true},
      'boss-loom':{plate:0x405731,brow:0xc9e887,iris:0x4b5c22,muzzle:0xd6d6a3,cheek:0x738246,nose:0x3c4932,browAngle:.34,cheekMark:0xc6dc79},
      'boss-conductor':{plate:0x59496f,brow:0xd0b1ff,iris:0x4a3765,muzzle:0xd6c6e7,cheek:0x8d79aa,nose:0x473c52,symbol:0xd0b1ff,glowEyes:true},
      'boss-heart':{plate:0x376053,brow:0x70f2d2,iris:0x174c43,muzzle:0xcee4ca,cheek:0x6fa18a,nose:0x30473e,symbol:0x70f2d2,glowEyes:true}
    };
    const face=faces[profile]||faces.scout;
    this.box(parent,.58,.43,.055,face.plate||fur,0,2.035,.363);
    if(face.seam)this.box(parent,.035,.30,.035,0x4c9da5,0,2.035,.401);
    for(const side of [-1,1]){
      const x=side*.205;
      this.box(parent,.225,.245,.065,0x40362d,x,2.04,.397);
      this.box(parent,.175,.19,.05,0xfff2d6,x,2.045,.439);
      this.box(parent,.092,.135,.035,face.iris||eyes,x-side*.012,2.04,.477,Boolean(face.glowEyes));
      this.box(parent,.034,.045,.02,0xffffff,x-side*.038,2.078,.499,true);
      const brow=this.box(parent,.235,.075,.08,face.brow||markings,x,2.205,.391);
      brow.rotation.z=side*(face.browAngle||.15);
      this.box(parent,.12,.105,.065,face.cheek||fur,side*.32,1.835,.411);
      this.box(parent,.15,.12,.085,face.muzzle||0xf1dfb5,side*.145,1.82,.487);
      if(face.cheekMark){
        const mark=this.box(parent,.052,.16,.035,face.cheekMark,side*.323,1.835,.457,true);
        mark.rotation.z=side*.22;
      }
      if(face.fangs)this.box(parent,.065,.105,.055,0xf0e1bd,side*.17,1.72,.523);
      if(face.nostrils)this.box(parent,.032,.027,.02,0x4c3027,side*.10,1.91,.557);
    }
    this.box(parent,face.muzzleWidth||.43,.235,.15,face.muzzle||0xf1dfb5,0,1.835,.438);
    this.box(parent,.11,.075,.065,face.nose||0x403128,0,1.954,.526);
    this.box(parent,.038,.032,.022,0xfff5da,0,1.974,.548,true);
    this.box(parent,.20,.035,.04,0x45322b,0,1.695,.507);
    if(face.symbol){
      const symbol=this.box(parent,.15,.13,.055,face.symbol,0,2.292,.423,true);
      symbol.rotation.z=Math.PI/4;
    }
  }
  enemyModel(e) {
    const g=new THREE.Group();g.userData.uid=e.uid;
    // A small, shared contact shadow makes feet read against the illustrated
    // trail even on screens where the transparent 3D floor reveals the biome.
    const contact=new THREE.Mesh(this.contactGeometry,this.contactMaterial);
    contact.rotation.x=-Math.PI/2;contact.scale.set(1,.48,1);contact.position.y=-.034;contact.renderOrder=-1;g.add(contact);
    const object=['anchor','root-drain','root-crack'].includes(e.id), mirror=e.id.startsWith('mirror');
    const antlered=e.id==='charger'||e.id==='boss-stag';
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
    }else if(antlered){
      // The charger family is a true four-legged forest guardian, rather than
      // another upright block fighter. Keep the face, legs and antlers readable
      // as separate shapes at the small live-Battle scale.
      const stagBoss=e.id==='boss-stag';
      this.box(g,1.04,.58,.76,wood,0,.82,-.04).rotation.z=-.04;
      this.box(g,.78,.13,.82,dark,0,1.16,-.04);
      const neck=this.box(g,.55,.72,.62,wood,0,1.30,.30);neck.rotation.z=-.16;neck.rotation.x=-.10;
      this.box(g,.76,.56,.62,wood,0,1.78,.42);
      this.box(g,.40,.24,.22,0xf1dfb5,0,1.72,.79);
      this.box(g,.09,.07,.045,0x403128,0,1.83,.91);
      this.box(g,.47,.10,.13,trim,0,2.08,.49,true);
      this.buildFace(g,wood,stagBoss?0xf0d77d:trim,0x2b241f,stagBoss?'boss-stag':'charger');
      // Four short, jointed legs and broad hooves replace the old human stance.
      const legs=[];
      for(const side of [-1,1])for(const front of [-1,1]){
        const x=side*.36,z=front*.28,leg=new THREE.Group();leg.position.set(x,.61,z);g.add(leg);
        this.box(leg,.22,.48,.24,dark,0,-.25,0);
        this.box(leg,.28,.15,.34,front>0?0x6a5540:0x584936,0,-.53,.015);
        this.box(leg,.10,.20,.27,0xc6ad7a,0,-.31,.04);
        legs.push({group:leg,phase:front>0?0:Math.PI});
      }
      g.userData.quadrupedLegs=legs;
      // A stepped saddle and bright shoulder stripe distinguish the two
      // antlered animals without changing the combat target or hurtbox.
      this.box(g,.72,.12,.53,stagBoss?0x466c5c:0xc49b61,0,1.16,-.10);
      for(const side of [-1,1]){
        this.box(g,.09,.42,.54,stagBoss?0xa9ddbd:0xd9c17b,side*.47,.94,-.06,true);
        this.box(g,.17,.19,.19,0x5c4533,side*.16,1.99,.12);
      }
      const tail=new THREE.Group();tail.position.set(0,1.0,-.40);g.add(tail);g.userData.tail=tail;
      const tailStem=this.box(tail,.14,.38,.15,wood,0,-.12,-.08);tailStem.rotation.x=-.42;tailStem.rotation.z=-.23;
      this.box(tail,.22,.17,.20,stagBoss?0xc8f1d9:0xf0cc79,0,-.30,-.26,true);
    }else if(e.id==='shield'){
      // The shield class is a squat shell guardian with a separate forward
      // buckler, so its silhouette reads differently before color is noticed.
      this.box(g,1.22,.82,.94,wood,0,.82,-.08);
      this.box(g,1.04,.15,.74,dark,0,1.25,-.09);
      this.box(g,.64,.58,.57,wood,0,1.48,.28);
      const face=new THREE.Group();face.position.set(0,-.62,.08);g.add(face);this.buildFace(face,wood,trim,0x2b241f,'shield');
      this.box(g,.16,.12,.06,rune,0,1.15,.60,true);
      for(const side of [-1,1])for(const fore of [-1,1]){
        const x=side*.52,z=fore*.30;
        this.box(g,.23,.37,.25,dark,x,.36,z);
        this.box(g,.31,.15,.35,0x594a38,x,.105,z+.025);
      }
      for(const side of [-1,1]){
        const seam=this.box(g,.08,.56,.045,trim,side*.30,.85,.42);seam.rotation.z=side*.22;
      }
      this.box(g,.16,.27,.18,0xa38b62,0,.55,-.58);
    }else if(mirror){
      // Mirror sentinels hover around a faceted chest core rather than sharing
      // the ordinary two-legged stance. The side prisms carry their identity.
      this.box(g,.56,.96,.50,wood,0,1.00,0);
      this.box(g,.78,.34,.58,dark,0,1.28,.02);
      this.box(g,.65,.56,.56,wood,0,1.83,.06);
      this.buildFace(g,wood,0xc4eced,0x3c8d9b,'mirror');
      const core=this.box(g,.31,.31,.12,rune,0,1.28,.37,true);core.rotation.z=Math.PI/4;g.userData.core=core;
      for(const side of [-1,1]){
        for(let shard=0;shard<3;shard++){
          const fin=this.box(g,.18,.46,.14,side<0?0x8dcbd2:0xc2b7e9,side*(.55+shard*.16),1.58-shard*.37,-.02+shard*.07,true);
          fin.rotation.z=side*(.24+shard*.16);
        }
        this.box(g,.25,.18,.24,0xf0ffff,side*.83,.53,.10,true).rotation.z=side*.42;
      }
    }else if(e.id==='emberling'){
      // A quick fire salamander stays low to the ground; its rising tail flame
      // provides the one tall accent in an otherwise compact profile.
      this.box(g,.72,.44,.78,wood,0,.57,-.04);
      this.box(g,.47,.34,.56,dark,0,.38,-.10);
      this.box(g,.57,.49,.58,wood,0,1.02,.30);
      const face=new THREE.Group();face.position.y=-.92;g.add(face);this.buildFace(face,wood,trim,0x733b27,'emberling');
      for(const side of [-1,1])for(const fore of [-1,1]){
        this.box(g,.17,.25,.18,dark,side*.27,.23,fore*.27);
        this.box(g,.22,.12,.25,0x674431,side*.27,.08,fore*.27+.03);
      }
      const tail=new THREE.Group();tail.position.set(.33,.76,-.39);g.add(tail);g.userData.tail=tail;
      const stem=this.box(tail,.17,.47,.16,0xef9f48,0,.18,-.05,true);stem.rotation.z=-.24;
      this.box(tail,.20,.29,.17,0xffd15b,.05,.50,-.04,true);
      this.box(tail,.14,.20,.14,0xffe58a,.09,.73,-.03,true);
    }else if(e.id==='brute'){
      // The behemoth hunches forward under a broad split-log mantle, with
      // oversized fists and short planted feet instead of a scout's proportions.
      this.box(g,1.02,.91,.86,wood,0,.96,-.03);
      this.box(g,1.44,.63,.88,dark,0,1.52,-.04);
      this.box(g,.82,.57,.70,wood,0,1.96,.12);
      this.buildFace(g,wood,0xf0d2a0,0x2b241f,'brute');
      this.box(g,.58,.28,.17,0x443f32,0,1.42,.45);
      for(const side of [-1,1]){
        this.box(g,.49,.74,.52,wood,side*.71,1.08,.02).rotation.z=-side*.14;
        this.box(g,.54,.42,.58,dark,side*.79,.53,.12);
        this.box(g,.38,.43,.49,0x8a7554,side*.85,1.77,-.12);
        this.box(g,.44,.11,.50,0xc2a96d,side*.86,1.51,.05);
        this.box(g,.38,.38,.43,0x4d5136,side*.30,.20,.04);
      }
      this.box(g,.78,.15,.57,0x879759,0,1.22,-.49);
      for(const side of [-1,1])this.box(g,.18,.26,.16,0xadc36d,side*.39,2.31,-.07,true);
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
      this.buildFace(g,wood,e.boss?0xe9c56e:trim,mirror?0x3c8d9b:e.id==='emberling'?0x733b27:e.id==='frostguard'?0x315564:e.id==='mender'||e.id==='caller'?0x385b47:0x2b241f,e.id);
      this.box(g,.56,.37,.14,dark,0,1.44,.36);
      this.box(g,.20,.20,.065,rune,0,1.47,.445,true).rotation.z=Math.PI/4;
      this.box(g,.38,.045,.07,trim,0,1.22,.4);
      for(const side of [-1,1]){
        const ice=e.id==='frostguard',branch=e.id==='thorn'||e.id==='boss-loom';
        const outer=ice?0xd3fbfa:branch?0x738246:trim;
        const inner=ice?0x8ee0e8:branch?0xa4bd62:dark;
        const horn=this.box(g,.16,ice?.35:branch?.42:.34,.10,outer,side*.33,ice?2.50:branch?2.52:2.45,.02);
        horn.rotation.z=side*(ice?.24:branch?.38:.20);
        this.box(g,.075,ice?.18:branch?.22:.18,.055,inner,side*.33,2.42,.085).rotation.z=side*.20;
      }
      for(const side of [-1,1]){
        this.box(g,.09,.67,.065,0xb79968,side*.32,1.17,.35);
        this.box(g,.12,.07,.08,0xd3b174,side*.29,1.48,.4);
      }
      for(const side of [-1,1])this.box(g,.16,.16,.18,0x72553b,side*.18,.03,.03);
    }
    const shield=this.box(g,.65,.9,.12,mirror?0x8ee0e8:0x557e63,-.72,1.04,.28);
    shield.visible=e.shield>0||mirror;g.userData.shield=shield;
    if(e.id==='shield'){
      const guard=new THREE.Group();guard.position.set(.65,1.12,.47);g.add(guard);
      const slab=this.box(guard,1.10,1.18,.20,0x557e63,0,0,0);
      slab.rotation.z=-.10;
      this.box(guard,.88,.78,.045,0x82965e,0,.02,.13);
      this.box(guard,.92,.095,.055,0xd8c783,0,.29,.17);
      this.box(guard,.92,.095,.055,0xd8c783,0,-.27,.17);
      this.box(guard,.11,.68,.055,0xd8c783,0,.01,.18);
      const sigil=this.box(guard,.29,.29,.07,0xf1d36f,0,.03,.22,true);sigil.rotation.z=Math.PI/4;
      guard.visible=e.shield>0;g.userData.shieldAssembly=guard;
    }
    if(e.id==='frostguard'||e.id==='boss-furnace'){
      this.box(g,1.08,.66,.24,e.id==='frostguard'?0x83c7d1:0x657c55,0,1.43,-.42);
      for(const side of [-1,1]){
        this.box(g,.36,.48,.18,e.id==='frostguard'?0xc6f1ed:0x91a86e,side*.29,1.44,-.57);
        this.box(g,.08,.37,.055,e.id==='frostguard'?0x65bdd0:0xd6c28a,side*.29,1.45,-.68);
      }
      this.box(g,.18,.16,.06,0xe7d5a3,0,1.76,-.54,true).rotation.z=Math.PI/4;
    }
    if(antlered)for(const side of [-1,1]){
      const boss=e.id==='boss-stag',base=boss?2.12:2.08;
      const beam=this.box(g,.13,boss?.74:.48,.13,boss?0xe2d1a0:0xd3bf89,side*.22,base,.38);beam.rotation.z=side*.35;
      const outer=this.box(g,.12,boss?.58:.37,.12,boss?0xe2d1a0:0xd3bf89,side*(boss?.48:.39),base+(boss?.25:.17),.37);outer.rotation.z=-side*.34;
      const tine=this.box(g,.10,boss?.42:.28,.10,boss?0xe2d1a0:0xd3bf89,side*(boss?.66:.52),base+(boss?.57:.40),.36);tine.rotation.z=side*.15;
      this.box(g,.12,.12,.12,boss?0x70e4ca:0xf2bd65,side*(boss?.52:.4),base+(boss?.53:.39),.43,true);
    }
    if(e.id==='caller'||e.id==='mender'||e.id==='boss-conductor'){
      this.box(g,.12,2.1,.12,0x604c31,.92,1.1,.1);this.box(g,.35,.35,.3,e.id==='mender'?0x9fea88:0xb396ec,.92,2.2,.1,true).rotation.z=.7;
    }
    if(e.id==='thorn'||e.id==='boss-loom')for(let i=-1;i<=1;i++){
      this.box(g,.17,.48,.18,0x738246,i*.29,2.55,-.02).rotation.z=i*.4;
      this.box(g,.12,.24,.12,0xa4bd62,i*.29,2.83,-.02).rotation.z=i*.4;
    }
    if(e.id==='shield'){
      for(let i=-1;i<=1;i++){
        const ridge=this.box(g,.20,.34,.20,i===0?0xd6c48b:0x80905e,i*.32,1.36,-.58);ridge.rotation.z=i*.14;
      }
      this.box(g,.28,.16,.22,0xf1d36f,0,1.80,.06,true).rotation.z=Math.PI/4;
    }
    if(e.id==='scout'){
      const leafLeft=this.box(g,.14,.25,.11,0x90b35e,-.13,2.46,-.02,true);leafLeft.rotation.z=.42;
      const leafRight=this.box(g,.14,.25,.11,0x90b35e,.13,2.46,-.02,true);leafRight.rotation.z=-.42;
      this.box(g,.14,.10,.10,0x557949,0,2.34,-.02);
    }
    if(e.id==='emberling'){this.box(g,.27,.45,.25,0xef9f48,.9,1.72,.15,true);this.box(g,.20,.35,.18,0xffd15b,.9,2.05,.15,true);this.box(g,.13,.22,.14,0xffe58a,.9,2.32,.15,true);}
    if(e.id==='frostguard')for(const side of [-1,1]){this.box(g,.25,.5,.25,0x8ee0e8,side*.6,1.9,0,true);this.box(g,.18,.28,.15,0xd9fbff,side*.62,2.15,.02,true);}
    if(e.id==='siphon'){this.box(g,.12,2.0,.12,0x604c31,.92,1.1,.1);this.box(g,.5,.15,.5,0xb396ec,.92,2.2,.1,true);}
    if(e.id==='brute'){
      for(const side of [-1,1]){
        const spine=this.box(g,.16,.30,.17,0xa5b76b,side*.48,2.34,-.10,true);spine.rotation.z=side*-.28;
        this.box(g,.15,.19,.18,0x698050,side*.57,1.70,-.04);
      }
      for(const side of [-1,1])this.box(g,.17,.26,.14,0xe5d09b,side*.22,1.78,.42);
      g.scale.set(1.22,1.08,1.08);
    }
    if(e.id==='scout')g.scale.set(.92,.82,.90);
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
      for(const side of [-1,1]){
        const petal=this.box(g,.35,.62,.16,0xc7ee9a,side*.48,1.80,.02,true);petal.rotation.z=-side*.30;
        this.box(g,.10,.30,.08,0xebf0c8,side*.65,1.82,.13,true).rotation.z=-side*.25;
      }
      this.box(g,.68,.12,.10,0xf2e4b3,0,.73,.37,true);
    }
    if(e.id==='caller'){
      this.box(g,.38,.54,.34,0xb8a1df,0,2.36,-.02);
      for(const side of [-1,1])this.box(g,.12,.14,.11,0x83e5d2,side*.38,2.32,-.06,true).rotation.z=side*.4;
      this.box(g,.44,.12,.42,0x435a44,0,.56,-.08);
    }
    if(e.id==='mirror'||mirror){
      for(const side of [-1,1]){
        const plate=this.box(g,.40,.88,.12,side<0?0x8dcbd2:0xc2b7e9,side*.69,1.52,.42,true);plate.rotation.z=side*.27;
        const glint=this.box(g,.10,.52,.06,0xf0ffff,side*.72,1.60,.50,true);glint.rotation.z=side*.27;
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
      if(e.id!=='boss-stag'){const crown=this.box(g,.7,.21,.6,0xc3a858,0,2.5,0);crown.rotation.y=.2;}
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
          this.box(g,.94,.16,.20,0x84a456,side*.83,2.14,.20).rotation.z=side*.48;
          this.box(g,.22,.92,.19,0x58754a,side*1.14,1.86,.18).rotation.z=side*.16;
          this.box(g,.15,.51,.15,0xa6bd63,side*1.27,1.34,.21).rotation.z=side*.30;
          this.box(g,.13,.22,.15,0xc6dc79,side*1.36,1.02,.22,true);
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
        for(const side of [-1,1]){
          const petal=this.box(g,.68,.42,.13,0x70ad8b,side*.55,1.34,.16,true);petal.rotation.z=side*.38;
          const vein=this.box(g,.08,.37,.045,0xc5e995,side*.62,1.36,.25,true);vein.rotation.z=side*.38;
        }
      }
    }
    if(e.boss){
      const bossScale={
        'boss-bell':[1.08,1.25,1.08],'boss-furnace':[1.25,1.12,1.15],
      'boss-stag':[1.10,1.22,1.08],'boss-loom':[1.16,1.13,1.05],
        'boss-conductor':[.95,1.28,.95],'boss-heart':[1.22,1.20,1.15]
      }[e.id]||[1.2,1.2,1.2];
      g.scale.set(...bossScale);
    }else{
      // Distinct proportions reinforce each enemy silhouette; keep these
      // transforms intact during animation instead of flattening every model
      // back to a uniform scale on each render frame.
      const silhouette={
        shield:[.90,1.0,1.08],mender:[.88,1.10,.91],caller:[.83,1.17,.90],
        mirror:[1.02,1.02,1.08],'mirror-left':[.91,1.10,.92],'mirror-right':[1.11,.96,.98],
        thorn:[1.12,1.08,1.06],emberling:[.72,.72,.74],frostguard:[1.18,1.08,1.05],
        siphon:[.86,1.18,.88]
      }[e.id];
      if(silhouette)g.scale.set(...silhouette);
    }
    // Give phone-size faces and species silhouettes enough screen area to read
    // between the target cards and the player's foreground action.
    g.scale.y*=1.12;
    // Retain authored proportions so the fixed formation can fit itself to a
    // narrow phone without changing any survivor's lane or identity.
    g.userData.authoredScale=g.scale.clone();g.userData.baseScale=g.scale.clone();g.userData.recoil=0;
    g.updateMatrixWorld(true);
    const bounds=new THREE.Box3().setFromObject(g);
    g.userData.hudTopLocal=Math.max(.65,(bounds.max.y-g.position.y)/Math.max(.001,g.scale.y));
    this.s.add(g);return g;
  }
  scaleEnemy(g,e){
    g.scale.copy(g.userData.authoredScale);
    const rear=e.slot>=3,narrow=this.canvas.clientWidth<440&&this.canvas.clientWidth/Math.max(1,this.canvas.clientHeight)<1.2;
    if(narrow){
      // The outer actors previously touched the canvas edge at 390px. Keep
      // five enemies legible with smaller cuboid proportions on phones while
      // preserving their distinct, fixed formation positions.
      if(e.boss){g.scale.x*=.78;g.scale.z*=.78;}
      else{g.scale.x*=rear?.64:.74;g.scale.y*=rear?1.06:1;g.scale.z*=rear?.68:.78;}
    }else if(!e.boss){g.scale.x*=rear?.84:.94;g.scale.y*=rear?.92:1;g.scale.z*=rear?.84:.94;}
    const portraitBoss=e.id==='boss-loom'&&this.canvas.clientWidth>=440&&this.canvas.clientWidth<700&&this.canvas.clientWidth/Math.max(1,this.canvas.clientHeight)<1.05;
    if(portraitBoss)g.scale.x*=.70;
    g.userData.baseScale.copy(g.scale);
  }
  enemyLaneX(e,slots){
    const base=slots[e.slot],narrow=this.canvas.clientWidth<440&&this.canvas.clientWidth/Math.max(1,this.canvas.clientHeight)<1.2;
    if(e.id==='boss-loom'&&this.canvas.clientWidth>=440&&this.canvas.clientWidth<700&&this.canvas.clientWidth/Math.max(1,this.canvas.clientHeight)<1.05)return base+(e.slot===0 ? .28 : 0);
    if(!narrow||!e.boss)return base;
    // Large Boss silhouettes can extend past the phone canvas when an outer
    // lane also recoils into its attack frame. Inset only Boss anchors; normal
    // enemy and survivor lanes remain fixed.
    return base+([1.10,0,-1.10,.46,-.46][e.slot]||0);
  }
  setRegion(index){
    const p=[[0x8bcac1,0x3e6850],[0xadc9ab,0x4d6744],[0x91b7c5,0x426162],[0x7baf9c,0x375548],[0x92b6ce,0x496170],[0x7fa999,0x365b48]][index]||[0x8bcac1,0x3e6850];
    this.currentRegion=Math.max(0,Math.min(5,index|0));
    this.s.background.setHex(p[0]);this.s.fog.color.setHex(p[0]);this.ground.material.color.setHex(p[1]);this.ground.material.needsUpdate=true;
    const scene=this.biomeBackgrounds[index]||this.biomeBackgrounds[0],request=++this.backgroundRequest;
    this.backdropMaterial.map=null;this.backdropMaterial.color.setHex(0xdde1d6);this.backdropMaterial.needsUpdate=true;
    this.backgroundTexture?.dispose();this.backgroundTexture=null;
    const src=new URL(`./art/battle-${scene}-v1.webp`,import.meta.url).href;
    new THREE.TextureLoader().load(src,texture=>{
      if(request!==this.backgroundRequest){texture.dispose();return;}
      texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(4,this.r.capabilities.getMaxAnisotropy());
      this.backgroundTexture=texture;this.backdropMaterial.map=texture;this.backdropMaterial.color.setHex(0xdde1d6);this.backdropMaterial.needsUpdate=true;
      this.fitBackdrop();
    },undefined,error=>console.warn('Pawaxe biome backdrop unavailable:',error.message));
  }
  setEnemies(list){
    let modelsChanged=false;
    for(const [uid,g] of this.models)if(!list.some(e=>e.uid===uid)){this.s.remove(g);this.models.delete(uid);modelsChanged=true;}
    const wide=this.canvas.clientWidth/Math.max(1,this.canvas.clientHeight)>1.45;
    const slots=wide?[-2.4,0,2.4,-1.52,1.52]:[-2.0,0,2.0,-1.3,1.3];
    list.forEach((e,i)=>{
      let g=this.models.get(e.uid);
      if(g&&g.userData.enemy?.id!==e.id){this.s.remove(g);this.models.delete(e.uid);g=null;modelsChanged=true;}
      if(!g){g=this.enemyModel(e);this.models.set(e.uid,g);modelsChanged=true;}
      g.userData.baseX=this.enemyLaneX(e,slots);g.userData.baseZ=e.slot>=3?-6.8:-2.7;g.position.set(g.userData.baseX,0,g.userData.baseZ);
      g.userData.enemy=e;this.scaleEnemy(g,e);
    });
    if(modelsChanged)this.rebuildBoxBatches(this.s,[...this.models.values()],'actorBatches');
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
          const angle=i*Math.PI/4;
          this.effects.push({life:.25,vx:Math.cos(angle)*2.6,vy:Math.sin(angle)*2.6,burst:true,x:g.position.x+Math.cos(angle)*.18,y:1.35+Math.sin(angle)*.18,z:g.userData.baseZ+.55,sx:.045,sy:.22,sz:.035,rotation:angle-Math.PI/2,color:0xffd15b});
        }
      }
      if(g&&this.effects.length<24){
        for(let i=0;i<4;i++){
          const color=e.source==='lightning'||e.source==='frost'?0x8ee0e8:e.source==='flame'?0xef9f48:e.shield?0x7cf2e0:0xe3c58a;
          this.effects.push({life:.35,vx:Math.sin(i*2+this.clock)*2,vy:1+i*.3,x:g.position.x,y:1.35,z:g.userData.baseZ+.45,sx:.07,sy:.07,sz:.07,rotation:0,rx:0,color});
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
    const hit=this.ray.intersectObjects(this.actorBatches,false)[0];
    if(hit?.instanceId!==undefined)return hit.object.userData.wpBatchSources[hit.instanceId]?.userData.wpBatchRoot?.userData.uid||null;
    return null;
  }
  resize(){
    const b=this.canvas.getBoundingClientRect(),w=Math.max(1,b.width),h=Math.max(1,b.height);
    this.r.setSize(w,h,false);const aspect=w/h;this.c.aspect=aspect;
    this.c.fov=THREE.MathUtils.radToDeg(2*Math.atan(Math.tan(THREE.MathUtils.degToRad(48/2))/Math.min(1,aspect/.78)));
    this.c.updateProjectionMatrix();this.vc.aspect=aspect;this.vc.updateProjectionMatrix();
    const halfW=Math.tan(THREE.MathUtils.degToRad(24))*2*aspect;
    this.axe.scale.setScalar(Math.min(.58,aspect*.52));
    this.axe.position.set(halfW*.18,-.57,-2);
    this.axeRest=this.axe.position.clone();
    // Keep the companion palm visible while bringing both hands into one
    // coherent first-person action silhouette at phone and desktop sizes.
    this.hand.position.set(-halfW*(aspect>1.45?.42:.18),-.57,-2);
    this.hand.scale.setScalar(Math.min(.69,aspect*.79));
    this.c.lookAt(0,aspect>1.45?1.62:1.4,-3);
    this.fitBackdrop();
    const wide=w/h>1.45,slots=wide?[-2.4,0,2.4,-1.52,1.52]:[-2.0,0,2.0,-1.3,1.3];
    for(const g of this.models.values())if(g.userData.enemy){const enemy=g.userData.enemy,slot=enemy.slot;g.userData.baseX=this.enemyLaneX(enemy,slots);g.position.x=g.userData.baseX;this.scaleEnemy(g,enemy);}
  }
  fitBackdrop(){
    const viewDirection=this.c.getWorldDirection(new THREE.Vector3());
    const depth=(this.backdrop.position.z-this.c.position.z)/viewDirection.z;
    const visibleWidth=2*depth*Math.tan(THREE.MathUtils.degToRad(this.c.fov/2))*this.c.aspect;
    const imageAspect=this.backgroundTexture?.image?.width/this.backgroundTexture?.image?.height||1681/936;
    this.backdrop.scale.x=Math.max(imageAspect*56/84,visibleWidth/84);
    const map=this.backdropMaterial.map;
    if(map){
      const planeAspect=84*this.backdrop.scale.x/56;
      map.wrapT=THREE.ClampToEdgeWrapping;
      map.repeat.set(1,Math.min(1,imageAspect/planeAspect));
      map.offset.set(0,(1-map.repeat.y)/2);
      map.needsUpdate=true;
    }
  }
  render(dt,combat){
    this.clock+=dt;
    this.hand.rotation.set(0,0,0);
    for(const g of this.models.values()){
      const e=g.userData.enemy;g.userData.recoil=Math.max(0,g.userData.recoil-dt);
      g.userData.attackKick=Math.max(0,(g.userData.attackKick||0)-dt);
      const wind=e.warned?Math.max(0,1-e.t/e.warn):0;
      g.position.x=g.userData.baseX;g.position.z=g.userData.baseZ+Math.sin(wind*Math.PI)*.3-g.userData.recoil+Math.sin(g.userData.attackKick/.2*Math.PI)*.7;
      g.rotation.z=g.userData.recoil*1.3;g.position.y=this.reduced?0:Math.sin(this.clock*2+e.uid)*.025;
      if(g.userData.arm)g.userData.arm.rotation.x=-wind*1.6;
      if(g.userData.core)g.userData.core.scale.y=1+Math.sin(this.clock*3.5)*.06;
      g.userData.shield.visible=e.shield>0||e.reflect>0;
      if(g.userData.shieldAssembly)g.userData.shieldAssembly.visible=e.shield>0;
      if(g.userData.quadrupedLegs){
        const stride=this.reduced?0:.07+wind*.26+Math.max(0,1-g.userData.attackKick/.2)*.12;
        for(const leg of g.userData.quadrupedLegs)leg.group.rotation.z=Math.sin(this.clock*7+leg.phase)*stride;
        if(g.userData.tail)g.userData.tail.rotation.x=this.reduced?0:Math.sin(this.clock*2.3)*.16;
      }
      g.scale.copy(g.userData.baseScale);
    }
    this.updateBoxBatches(this.s,this.actorBatches);
    if(this.swingTime>0){
      this.swingTime=Math.max(0,this.swingTime-dt);
      const p=1-this.swingTime/this.swingDuration;
      this.axe.rotation.z=-.15+Math.sin(p*Math.PI*2)*.9;
      this.axe.rotation.x=-Math.sin(p*Math.PI)*.7;
      this.hand.rotation.x=-Math.sin(p*Math.PI)*.10;
      this.hand.rotation.z=Math.sin(p*Math.PI)*.045;
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
    this.updateBoxBatches(this.view,this.viewBatches);
    for(const f of this.effects){f.life-=dt;if(!this.reduced){f.x+=f.vx*dt;f.y+=f.vy*dt;if(!f.burst){f.vy-=7*dt;f.rx+=dt*6;}}}
    this.effects=this.effects.filter(f=>f.life>0);
    this.effectBatch.count=this.effects.length;
    this.effects.forEach((f,index)=>{
      this.effectScratch.position.set(f.x,f.y,f.z);this.effectScratch.rotation.set(f.rx||0,0,f.rotation);this.effectScratch.scale.set(f.sx,f.sy,f.sz);this.effectScratch.updateMatrix();
      this.effectBatch.setMatrixAt(index,this.effectScratch.matrix);this.effectBatch.setColorAt(index,new THREE.Color(f.color));
    });
    this.effectBatch.instanceMatrix.needsUpdate=true;if(this.effectBatch.instanceColor)this.effectBatch.instanceColor.needsUpdate=true;
    this.shake=Math.max(0,this.shake-dt);this.c.position.x=this.shake>0?Math.sin(this.clock*90)*this.shake*.12:0;
    this.r.info.reset();this.r.autoClear=true;this.r.render(this.s,this.c);this.r.autoClear=false;this.r.clearDepth();this.r.render(this.view,this.vc);
  }
  actorBounds(){
    this.s.updateMatrixWorld(true);this.c.updateMatrixWorld(true);this.c.matrixWorldInverse.copy(this.c.matrixWorld).invert();
    const rect=this.canvas.getBoundingClientRect(),actorBounds=[];
    for(const [uid,g] of this.models){
      const box=new THREE.Box3();
      for(const source of g.userData.wpBatchSources||[]){const parent=source.userData.wpBatchParent;parent.updateWorldMatrix(true,false);source.updateMatrix();const matrix=parent.matrixWorld.clone().multiply(source.matrix);box.union(new THREE.Box3().setFromBufferAttribute(this.geometry.attributes.position).applyMatrix4(matrix));}
      if(box.isEmpty())box.setFromObject(g);
      const corners=[];
      for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z])corners.push(new THREE.Vector3(x,y,z).project(this.c));
      if(!corners.length)continue;
      const xs=corners.map(p=>rect.left+(p.x+1)*rect.width/2),ys=corners.map(p=>rect.top+(1-p.y)*rect.height/2);
      actorBounds.push({uid,left:Math.min(...xs),right:Math.max(...xs),top:Math.min(...ys),bottom:Math.max(...ys)});
    }
    return actorBounds;
  }
  hudAnchors(){
    const rect=this.canvas.getBoundingClientRect();
    this.s.updateMatrixWorld(true);this.c.updateMatrixWorld(true);this.view.updateMatrixWorld(true);this.vc.updateMatrixWorld(true);
    const project=(point,camera)=>{
      point.project(camera);
      return{x:rect.left+(point.x+1)*rect.width/2,y:rect.top+(1-point.y)*rect.height/2,
        visible:point.z>-1&&point.z<1&&point.x>-1.08&&point.x<1.08&&point.y>-1.08&&point.y<1.08};
    };
    const player=project(new THREE.Vector3(0,.45,.10).applyMatrix4(this.hand.matrixWorld),this.vc);
    const enemies=[...this.models].map(([uid,g])=>({uid,...project(
      new THREE.Vector3(0,g.userData.hudTopLocal||3,0).applyMatrix4(g.matrixWorld),this.c
    )}));
    return{player,enemies};
  }
  metrics(){return{models:this.models.size,effects:this.effects.length,materials:this.materials.size+this.batchMaterials.size+this.actorBatchMaterials.size+(this.groundMaterials?.size||0)+2,geometries:this.r.info.memory.geometries,textures:this.r.info.memory.textures,drawCalls:this.r.info.render.calls,surfaceLoaded:this.surfaceReady,faceShading:Boolean(this.geometry.attributes.color),lanes:[...this.models].map(([uid,g])=>({uid,id:g.userData.enemy?.id,hp:g.userData.enemy?.hp,slot:g.userData.enemy?.slot,x:g.position.x,z:g.position.z,scale:g.scale.toArray(),visible:g.visible})),axeGeometries:this.ownedGeometry.size,backdropLoaded:Boolean(this.backdropMaterial.map),backdropScaleX:this.backdrop.scale.x,backdropTextureRepeatY:this.backdropMaterial.map?.repeat.y??null,region:this.currentRegion};}
  dispose(){this.disposed=true;this.backgroundRequest++;this.backgroundTexture?.dispose();this.backgroundTexture=null;this.backdropMaterial.map=null;this.backdropMaterial.dispose();this.backdropGeometry.dispose();this.contactGeometry.dispose();this.contactMaterial.dispose();this.surfaceTexture.dispose();this.world.traverse(o=>{if(o.isInstancedMesh)o.dispose();});this.effectBatch.dispose();for(const batch of [...this.actorBatches,...this.viewBatches])batch.dispose();this.actorBatches=[];this.viewBatches=[];for(const marks of this.handDetails)marks.dispose();this.handDetails=[];this.geometry.dispose();for(const g of this.ownedGeometry)g.dispose();this.ownedGeometry.clear();this.sun.shadow.map?.dispose();for(const m of this.groundMaterials)m.dispose();this.groundMaterials.clear();for(const m of this.actorBatchMaterials.values())m.dispose();this.actorBatchMaterials.clear();for(const m of this.batchMaterials.values())m.dispose();this.batchMaterials.clear();for(const m of this.materials.values())m.dispose();this.materials.clear();this.models.clear();this.effects=[];this.r.dispose();}
}
