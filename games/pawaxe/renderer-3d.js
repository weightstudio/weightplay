import * as THREE from './vendor/three/three.module.min.js';
// Retry the failed model dependency as well as its parent renderer module.
const modelUrl=(file,version)=>{
  const url=new URL(file,import.meta.url);url.searchParams.set('v',version);
  const retry=new URL(import.meta.url).searchParams.get('retry');
  if(retry)url.searchParams.set('retry',retry);
  return url.href;
};
const [{buildAxe},{buildEnemy,buildCompanion,buildPaw}]=await Promise.all([
  import(modelUrl('./axe-model.js','7')),import(modelUrl('./actor-models.js','3'))
]);

// One renderer per run. Geometry/material caches are bounded and disposed together.
export class PawRenderer {
  constructor(canvas) {
    this.canvas=canvas; this.materials=new Map(); this.models=new Map(); this.effects=[];this.ownedGeometry=new Set();this.handDetails=[];this.disposed=false;this.surfaceReady=false;
    try{
    const outline=new THREE.Shape();outline.moveTo(-.44,-.44);outline.lineTo(.44,-.44);outline.lineTo(.44,.44);outline.lineTo(-.44,.44);outline.closePath();
    this.geometry=new THREE.ExtrudeGeometry(outline,{depth:.88,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.035,bevelThickness:.035});this.geometry.translate(0,0,-.44);
    const normals=this.geometry.attributes.normal,faceShade=new Float32Array(normals.count*3),faceLight=new THREE.Vector3(-.32,.72,.62).normalize(),faceNormal=new THREE.Vector3();
    for(let i=0;i<normals.count;i++){
      faceNormal.fromBufferAttribute(normals,i);
      const shade=.68+Math.max(0,faceNormal.dot(faceLight))*.38+Math.max(0,faceNormal.y)*.12,offset=i*3;
      faceShade[offset]=faceShade[offset+1]=faceShade[offset+2]=shade;
    }
    this.geometry.setAttribute('color',new THREE.BufferAttribute(faceShade,3));
    this.clock=0; this.swingTime=0; this.shake=0;
    this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    try{this.r=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'low-power'});}
    catch(firstError){
      // Some mobile GPUs reject the multisampled context but accept a plain one.
      this.r=new THREE.WebGLRenderer({canvas,antialias:false,powerPreference:'default'});
    }
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
    // Subtle relief preserves the authored face planes and clean toy-like finish.
    this.actorBatchMaterials=new Map([
      [false,new THREE.MeshPhysicalMaterial({color:0xffffff,vertexColors:true,bumpMap:this.surfaceTexture,bumpScale:.065,roughness:.62,metalness:.02,clearcoat:.12,clearcoatRoughness:.55})],
      [true,new THREE.MeshPhysicalMaterial({color:0xffffff,vertexColors:true,bumpMap:this.surfaceTexture,bumpScale:.035,roughness:.48,metalness:.16,emissive:0xffffff,emissiveIntensity:.06,clearcoat:.16,clearcoatRoughness:.48})]
    ]);
    this.actorBatches=[];this.viewBatches=[];
    this.batchScratch=new THREE.Matrix4();this.batchHiddenMatrix=new THREE.Matrix4().makeScale(0,0,0);
    // Keep the bounded generated grain as a fast fallback, then replace its
    // single GPU texture with the authored neutral Block Animals surface map.
    new THREE.TextureLoader().load(new URL('./art/materials/forest-guardian-surface-v10.webp',import.meta.url).href,texture=>{
      if(this.disposed){texture.dispose();return;}
      texture.colorSpace=THREE.NoColorSpace;texture.wrapS=THREE.RepeatWrapping;texture.wrapT=THREE.RepeatWrapping;
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
    this.s=new THREE.Scene(); this.s.background=new THREE.Color(0x8bcac1);this.s.fog=new THREE.Fog(0x8bcac1,10,38);
    this.effectBatch=new THREE.InstancedMesh(this.geometry,this.batchMaterials.get(true),24);this.effectBatch.count=0;this.effectBatch.instanceMatrix.setUsage(THREE.DynamicDrawUsage);this.effectBatch.castShadow=false;this.effectBatch.receiveShadow=false;this.s.add(this.effectBatch);this.effectScratch=new THREE.Object3D();
    this.c=new THREE.PerspectiveCamera(48,1,.08,70);this.c.position.set(0,2.3,6);this.c.lookAt(0,1.4,-3);
    this.s.add(new THREE.HemisphereLight(0xfffbf2,0x344f54,1.35));
    const sun=new THREE.DirectionalLight(0xfff2dc,2.6);sun.position.set(-4,9,6);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-8;sun.shadow.camera.right=8;sun.shadow.camera.top=10;sun.shadow.camera.bottom=-8;sun.shadow.bias=-.001;sun.shadow.normalBias=.03;this.sun=sun;this.s.add(sun);
    const rim=new THREE.DirectionalLight(0x69e4d2,1.9);rim.position.set(3,3,-8);this.s.add(rim);
    const fill=new THREE.DirectionalLight(0xffc982,.58);fill.position.set(5,4,5);this.s.add(fill);
    this.biomeBackgrounds=['forest','marsh','frost','canopy','forge','heart'];
    this.backgroundRequest=0;this.backgroundTexture=null;
    this.contactGeometry=new THREE.CircleGeometry(.62,20);
    this.contactMaterial=new THREE.MeshBasicMaterial({color:0x17251d,transparent:true,opacity:.28,depthWrite:false,toneMapped:false,side:THREE.DoubleSide});
    this.backdropMaterial=new THREE.MeshBasicMaterial({color:0xdde1d6,transparent:true,opacity:.18,depthWrite:false,fog:false,toneMapped:false});
    this.backdropGeometry=new THREE.PlaneGeometry(84,56);
    this.backdrop=new THREE.Mesh(this.backdropGeometry,this.backdropMaterial);this.backdrop.position.set(0,0,-27);this.backdrop.renderOrder=-2;this.s.add(this.backdrop);
    this.world=new THREE.Group();this.s.add(this.world);this.buildWorld();
    this.view=new THREE.Scene();this.view.add(new THREE.HemisphereLight(0xffeec9,0x315264,1.25));
    const key=new THREE.DirectionalLight(0xfff5e8,2.8);key.position.set(-2,3,4);this.view.add(key);
    const toolFill=new THREE.DirectionalLight(0xffd197,.55);toolFill.position.set(2,-1,4);this.view.add(toolFill);
    this.vc=new THREE.PerspectiveCamera(48,1,.01,10);this.buildHands();this.rebuildBoxBatches(this.view,[this.hand,this.nibs,this.axe],'viewBatches');this.resize();
    this.ray=new THREE.Raycaster();this.pointer=new THREE.Vector2();
    }catch(error){this.dispose();throw error;}
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
    // A continuous opaque trail gives the cast a calm, grounded stage.
    // Trees frame the arena; small scattered chips no longer compete with it.
    this.ground=this.box(this.world,70,.22,80,0x547d68,0,-.15,-25);this.ground.material=this.groundTint(0x547d68,1);
    this.path=this.box(this.world,5.8,.06,80,0xb2a383,0,-.025,-25);this.path.material=this.groundTint(0xb2a383,1);
    for(const side of [-1,1]){
      this.box(this.world,.32,.04,80,0x789578,side*3.05,-.015,-25);
      for(let row=0;row<8;row++){
        const z=-8-row*5.1,x=side*(4.6+(row%3)*1.25),h=4.8+(row%3)*.7;
        // Stepped trunks, a few broad canopy masses, and a quiet shaded underside.
        this.box(this.world,.74,h,.78,0x665f4e,x,h/2,z);
        this.box(this.world,.17,h*.82,.08,0x81765a,x-side*.22,h*.45,z+.42);
        this.box(this.world,1.12,.26,1.1,0x5b6953,x,.08,z);
        this.box(this.world,3.1,.65,2.7,0x345f51,x,h-.15,z);
        this.box(this.world,3.5,.85,2.9,0x4c8063,x-side*.20,h+.55,z);
        this.box(this.world,2.6,.65,2.4,0x739779,x-side*.42,h+1.28,z);
        this.box(this.world,1.5,.38,1.6,0x8aa885,x-side*.62,h+1.75,z);
        this.box(this.world,1.35,.55,1.3,0x5b896b,x+side*1.30,h+.55,z+.38);
        if(row%2===0){
          this.box(this.world,1.35,.35,1.05,0x527d60,side*3.95,.10,z+1.4);
          this.box(this.world,.95,.22,.8,0x719478,side*3.85,.35,z+1.4);
        }
      }
    }
    // Batch repeating path details by material; their bounded parallax sells forward travel.
    const groups=new Map([[false,[]],[true,[]]]);for(const mesh of [...this.world.children]){if(mesh===this.ground||mesh===this.path)continue;groups.get(Boolean(mesh.userData.wpBatchGlow)).push(mesh);}
    for(const [glow,meshes] of groups){if(!meshes.length)continue;const batch=new THREE.InstancedMesh(this.geometry,this.batchMaterials.get(glow),meshes.length);batch.userData.poses=[];meshes.forEach((m,i)=>{m.updateMatrix();batch.setMatrixAt(i,m.matrix);batch.setColorAt(i,new THREE.Color(m.userData.wpBatchColor));batch.userData.poses.push({matrix:m.matrix.clone(),travel:m.position.z<=-8&&m.scale.z<6});this.world.remove(m);});batch.instanceMatrix.needsUpdate=true;batch.instanceColor.needsUpdate=true;batch.castShadow=true;batch.receiveShadow=true;this.world.add(batch);}
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
    this.axeArm=buildPaw(this,{side:-1,grip:true});this.axe.add(this.axeArm);
    this.axeArm.position.set(.015,-.22,-.11);
    this.hand=buildPaw(this,{side:1});this.view.add(this.hand);
    this.setCompanion('nibs');
  }
  setCompanion(id){
    const previous=this.nibs;
    if(previous){
      // Sources are detached for instancing; follow their saved parent chains
      // so nested face/ear meshes retire with the old companion.
      const belongsToPrevious=mesh=>{
        let parent=mesh.userData.wpBatchParent||mesh.parent;
        while(parent){if(parent===previous)return true;parent=parent.parent;}
        return false;
      };
      if(Array.isArray(this.hand.userData.wpBatchSources)){
        this.hand.userData.wpBatchSources=this.hand.userData.wpBatchSources.filter(mesh=>!belongsToPrevious(mesh));
      }
      this.hand.remove(previous);
    }
    this.nibs=buildCompanion(this,id);
    // Ally faces into the adventure; the player remains first-person paws only.
    this.nibs.scale.setScalar(.48);this.nibs.rotation.y=Math.PI*.57;
    this.hand.add(this.nibs);
    this.rebuildCompanionBatches();
  }
  rebuildCompanionBatches(){
    // setCompanion replaces meshes after the constructor's first batch pass.
    // Retire the previous ally's sources and keep the selected ally's colors.
    if(this.viewBatches?.length)this.rebuildBoxBatches(this.view,[this.hand,this.nibs,this.axe],'viewBatches');
  }
  enemyModel(e) {
    const g=buildEnemy(this,e);this.s.add(g);return g;
  }
  scaleEnemy(g,e){
    g.scale.copy(g.userData.authoredScale);
    const rear=e.slot>=3,narrow=this.canvas.clientWidth<440&&this.canvas.clientWidth/Math.max(1,this.canvas.clientHeight)<1.2;
    if(narrow){
      // The outer actors previously touched the canvas edge at 390px. Keep
      // five enemies legible with smaller cuboid proportions on phones while
      // preserving their distinct, fixed formation positions.
      g.scale.multiplyScalar(e.boss?.86:rear?.78:.94);
    }else if(!e.boss){g.scale.x*=rear?.84:.94;g.scale.y*=rear?.92:1;g.scale.z*=rear?.84:.94;}
    else if(this.canvas.clientWidth<700&&this.canvas.clientWidth/Math.max(1,this.canvas.clientHeight)<1.2)g.scale.multiplyScalar(.94);
    const viewport=this.canvas.getBoundingClientRect();
    if(e.boss&&viewport.width/Math.max(1,viewport.height)>2.5&&viewport.height<260)g.scale.multiplyScalar(.80);
    g.userData.baseScale.copy(g.scale);
  }
  enemyLaneX(e,slots){
    const base=slots[e.slot],narrow=this.canvas.clientWidth<440&&this.canvas.clientWidth/Math.max(1,this.canvas.clientHeight)<1.2;
    if(!narrow||!e.boss)return base;
    // Large Boss silhouettes can extend past the phone canvas when an outer
    // lane also recoils into its attack frame. Inset only Boss anchors; normal
    // enemy and survivor lanes remain fixed.
    return base+([.30,0,-.30,.16,-.16][e.slot]||0);
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
    this.r.setSize(w,h,false);const aspect=w/h,shortWide=aspect>2.5&&h<260;this.c.aspect=aspect;
    this.c.fov=shortWide?28:THREE.MathUtils.radToDeg(2*Math.atan(Math.tan(THREE.MathUtils.degToRad(48/2))/Math.min(1,aspect/.78)));
    this.c.updateProjectionMatrix();this.vc.aspect=aspect;this.vc.fov=shortWide?30:48;this.vc.updateProjectionMatrix();
    const halfW=Math.tan(THREE.MathUtils.degToRad(this.vc.fov/2))*2*aspect;
    this.axe.scale.setScalar(Math.min(.58,aspect*.52));
    this.axe.position.set(halfW*.58,shortWide?-.30:-.60,-2);
    this.axeRest=this.axe.position.clone();
    // Keep the companion palm visible while bringing both hands into one
    // coherent first-person action silhouette at phone and desktop sizes.
    this.hand.position.set(-halfW*(shortWide?.55:.50),shortWide?-.38:-.68,-2);
    this.hand.scale.setScalar(Math.min(.69,aspect*.79));
    this.axeArm.scale.setScalar(this.hand.scale.x/this.axe.scale.x);
    this.c.lookAt(0,shortWide?1.90:aspect>1.45?1.62:1.4,-3);
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
      if(g.userData.core){
        const core=g.userData.core;core.userData.restScaleY??=core.scale.y;
        core.scale.y=core.userData.restScaleY*(1+(this.reduced?0:Math.sin(this.clock*3.5)*.06));
      }
      g.userData.shield.visible=e.shield>0||e.reflect>0;
      if(g.userData.shieldAssembly)g.userData.shieldAssembly.visible=e.shield>0;
      if(g.userData.quadrupedLegs){
        const stride=this.reduced?0:.07+wind*.26+Math.max(0,1-g.userData.attackKick/.2)*.12;
        for(const leg of g.userData.quadrupedLegs)leg.group.rotation.x=Math.sin(this.clock*7+leg.phase)*stride;
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
        const projection=this.swingPoint.clone().project(this.c),halfH=Math.tan(THREE.MathUtils.degToRad(this.vc.fov/2))*2;
        const contact=this.swingContact/this.swingDuration,reach=p<contact?Math.sin(p/contact*Math.PI/2):Math.cos((p-contact)/(1-contact)*Math.PI/2);
        const tip=this.axe.userData.tip.clone().multiplyScalar(this.axe.scale.x).applyEuler(this.axe.rotation);
        const aim=new THREE.Vector3(projection.x*halfH*this.vc.aspect-tip.x,projection.y*halfH-tip.y,-2-tip.z);
        this.axe.position.copy(this.axeRest).lerp(aim,Math.max(0,reach));
      }
    }else{this.axe.position.copy(this.axeRest);this.axe.rotation.z=combat?.guard?-.95:-.18;this.axe.rotation.x=0;}
    if(combat?.guard&&combat.pending===null&&this.swingTime>0)this.swingTime=0;
    this.allyPulse=Math.max(0,(this.allyPulse||0)-dt);this.nibs.rotation.y=Math.PI*.57+Math.sin(this.clock*1.2)*.08;
    this.nibs.position.y=.18+(this.allyPulse>0&&!this.reduced?Math.sin(this.allyPulse*8)*.06:0);
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
    const player=project(new THREE.Vector3(0,.78,.10).applyMatrix4(this.hand.matrixWorld),this.vc);
    const enemies=[...this.models].map(([uid,g])=>({uid,...project(
      new THREE.Vector3(0,g.userData.hudTopLocal||3,0).applyMatrix4(g.matrixWorld),this.c
    )}));
    return{player,enemies};
  }
  metrics(){return{models:this.models.size,effects:this.effects.length,materials:this.materials.size+this.batchMaterials.size+this.actorBatchMaterials.size+(this.groundMaterials?.size||0)+2,geometries:this.r.info.memory.geometries,textures:this.r.info.memory.textures,drawCalls:this.r.info.render.calls,surfaceLoaded:this.surfaceReady,faceShading:Boolean(this.geometry.attributes.color),lanes:[...this.models].map(([uid,g])=>({uid,id:g.userData.enemy?.id,hp:g.userData.enemy?.hp,slot:g.userData.enemy?.slot,x:g.position.x,z:g.position.z,scale:g.scale.toArray(),visible:g.visible})),axeGeometries:this.ownedGeometry.size,backdropLoaded:Boolean(this.backdropMaterial.map),backdropScaleX:this.backdrop.scale.x,backdropTextureRepeatY:this.backdropMaterial.map?.repeat.y??null,region:this.currentRegion};}
  dispose(){
    if(this.disposed)return;
    this.disposed=true;this.backgroundRequest=(this.backgroundRequest||0)+1;
    this.backgroundTexture?.dispose();this.backgroundTexture=null;
    if(this.backdropMaterial)this.backdropMaterial.map=null;
    for(const resource of [this.backdropMaterial,this.backdropGeometry,this.contactGeometry,this.contactMaterial,this.surfaceTexture,this.effectBatch,this.geometry,this.sun?.shadow?.map])resource?.dispose();
    this.world?.traverse(o=>{if(o.isInstancedMesh)o.dispose();});
    for(const batch of [...(this.actorBatches||[]),...(this.viewBatches||[]),...this.handDetails])batch.dispose();
    this.actorBatches=[];this.viewBatches=[];this.handDetails=[];
    for(const g of this.ownedGeometry)g.dispose();this.ownedGeometry.clear();
    for(const collection of [this.groundMaterials,this.actorBatchMaterials,this.batchMaterials,this.materials]){
      if(!collection)continue;
      for(const resource of collection.values())resource.dispose();
      collection.clear();
    }
    this.models.clear();this.effects=[];this.r?.dispose();
  }
}
