import * as THREE from './vendor/three/three.module.min.js';
import {FRUITS} from './model.mjs';

// Authored original block orchard. Shared geometry/materials belong to this renderer only.
export class OrchardScene {
  constructor(canvas,onPick,onFailure) {
    this.canvas=canvas;this.onPick=onPick;this.onFailure=onFailure;this.active=false;this.disposed=false;
    this.materials=new Map();this.boxGeometry=new THREE.BoxGeometry(1,1,1);this.owned=[this.boxGeometry];
    this.renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'low-power'});
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;
    this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.25;
    this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    this.scene=new THREE.Scene();this.scene.background=new THREE.Color(0x97c9bd);
    this.camera=new THREE.OrthographicCamera(-5,5,5,-5,.1,70);
    this.camera.position.set(7.2,8.4,12);this.camera.lookAt(0,.7,0);
    this.scene.add(new THREE.HemisphereLight(0xdcefff,0x627047,2.4));
    this.sun=new THREE.DirectionalLight(0xffebbd,3.2);this.sun.position.set(-4,9,5);this.sun.castShadow=true;
    Object.assign(this.sun.shadow.camera,{left:-7,right:7,top:7,bottom:-7,near:.5,far:24});
    this.sun.shadow.mapSize.set(512,512);this.sun.shadow.bias=-.001;this.scene.add(this.sun);
    this.world=new THREE.Group();this.scene.add(this.world);this.trees=[];this.crates=[];
    this.build();
    this.raycaster=new THREE.Raycaster();this.pointer=new THREE.Vector2();
    this.click=event=>{
      if(!this.active)return;
      const r=canvas.getBoundingClientRect();this.pointer.set((event.clientX-r.left)/r.width*2-1,-(event.clientY-r.top)/r.height*2+1);
      this.raycaster.setFromCamera(this.pointer,this.camera);
      const hits=this.raycaster.intersectObjects(this.trees.map(t=>t.root),true);
      if(hits.length){let n=hits[0].object;while(n&&n.userData.tree===undefined)n=n.parent;if(n)this.onPick(n.userData.tree);}
    };
    canvas.addEventListener('pointerup',this.click);
    this.lost=event=>{event.preventDefault();this.setActive(false);this.onFailure();};
    canvas.addEventListener('webglcontextlost',this.lost);
    this.resizeObserver=new ResizeObserver(()=>{this.resize();});this.resizeObserver.observe(canvas.parentElement);
    this.motion=matchMedia('(prefers-reduced-motion: reduce)');
    this.motionChanged=()=>{if(this.motion.matches){this.effect='';cancelAnimationFrame(this.raf);this.raf=0;this.trees.forEach(t=>t.crown.rotation.z=0);this.deer.rotation.z=0;this.render();}};
    this.motion.addEventListener('change',this.motionChanged);
    canvas.dataset.renderer=`three-${THREE.REVISION}`;
  }
  material(color) {
    if(!this.materials.has(color))this.materials.set(color,new THREE.MeshStandardMaterial({color,roughness:.86,metalness:.02}));
    return this.materials.get(color);
  }
  box(parent,x,y,z,w,h,d,color,rotation=0) {
    const m=new THREE.Mesh(this.boxGeometry,this.material(color));m.position.set(x,y,z);m.scale.set(w,h,d);m.rotation.y=rotation;
    m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;
  }
  build() {
    const b=(...a)=>this.box(this.world,...a);
    b(0,-.58,0,8.8,.7,6.4,0xa38356);b(0,-.18,0,9,.28,6.6,0x668b47);
    b(0,-.015,0,8.8,.08,6.4,0x8fb568);
    // A garden path, stone border and stepped flower beds support the orchard silhouettes.
    for(let i=0;i<9;i++)b(-3.5+i*.85,.04,1.18,.78,.09,.67,i%2?0xd6c695:0xe8d7a8,.03*(i%3-1));
    for(let i=0;i<6;i++)b(1.65,.045,-2.65+i*.82,.65,.09,.7,0xd6c695);
    for(const x of [-4.15,4.15])for(let i=0;i<6;i++){b(x,.36,-2.8+i*1.08,.13,.8,.13,0xeee2bb);if(i<5)b(x,.44,-2.25+i*1.08,.1,.12,1.02,0xd9c995);}
    for(let i=0;i<9;i++){b(-3.9+i*.97,.36,-3,.13,.8,.13,0xeee2bb);if(i<8)b(-3.42+i*.97,.45,-3,.94,.12,.1,0xd9c995);}
    // Back terrace flowers: deterministic placement, no ever-growing random pool.
    for(let i=0;i<16;i++){
      const x=-3.7+(i%8)*.48,z=-2.65+Math.floor(i/8)*.35;
      b(x,.13,z,.055,.24,.055,0x477b45);b(x,.29,z,.14,.10,.14,i%3?0xf5d57b:0xf3a4a0);
    }
    const positions=[[-2.75,-.65],[0,-1.05],[2.65,-.5]];
    positions.forEach(([x,z],i)=>{
      const root=new THREE.Group();root.position.set(x,0,z);root.userData.tree=i;this.world.add(root);
      this.box(root,0,.08,0,1.65,.18,1.55,0x9b7448);
      this.box(root,0,.21,0,1.43,.12,1.32,0x6c8c43);
      this.box(root,0,.9,0,.27,1.55,.29,0x82532f);
      this.box(root,-.28,1.35,0,.64,.17,.19,0xa77644,-.25);
      this.box(root,.26,1.65,0,.65,.17,.2,0x9d6635,.35);
      const crown=new THREE.Group();root.add(crown);
      const leafColors=[0x507c39,0x6a9947,0x7fa747];
      this.box(crown,0,2.05,0,1.6,1.08,1.35,leafColors[i]);
      this.box(crown,-.48,1.87,.25,.82,.78,.95,0x89b256);
      this.box(crown,.48,2.24,-.17,.82,.76,.94,0x94bc63);
      this.box(crown,-.17,2.73,-.03,1.05,.50,.93,0xa4c974);
      this.box(crown,.23,2.12,.67,.9,.62,.38,0x749c43);
      const fruits=new THREE.Group();crown.add(fruits);
      [[-.65,2.02,.55],[.18,2.49,.53],[.6,1.91,.48],[-.1,1.72,.65],[.63,2.46,-.32]].forEach(([a,y,c])=>{
        const size=i===1?.24:.29;this.box(fruits,a,y,c,size,i===1?.35:.27,size,FRUITS[i].color,.15);
        this.box(fruits,a+.03,y+.18,c,.055,.13,.055,0x72502c);
        this.box(fruits,a+.09,y+.24,c,.16,.045,.09,0x426b32,.5);
      });
      fruits.children.forEach(mesh=>mesh.userData.baseScale=mesh.scale.clone());
      const ring=new THREE.Group();root.add(ring);
      for(const side of [-1,1]){
        this.box(ring,side*.88,.13,0,.055,.05,1.8,0xffe48a);
        this.box(ring,0,.13,side*.88,1.8,.05,.055,0xffe48a);
      }
      this.trees.push({root,crown,fruits,ring});
    });
    // Rain barrel, irrigation pond and compost bay, all visible gameplay objects.
    b(3.1,.12,2.1,1.4,.25,1.35,0xc8c5a5);this.waterSurface=b(3.1,.26,2.1,1.18,.08,1.12,0x5cb8bd);
    b(3.55,.55,1.1,.65,.92,.62,0x727e66);b(3.55,1.02,1.1,.7,.08,.66,0xbaa783);
    b(-.55,.2,2.5,.9,.3,.75,0x5f6238);this.compostHeap=b(-.55,.40,2.5,.7,.27,.58,0x876647);
    for(let i=0;i<2;i++){
      const crate=new THREE.Group();crate.position.set(.65+i*.69,.25,2.3);this.world.add(crate);
      this.box(crate,0,-.1,0,.6,.13,.55,0xb78a4f);
      for(const side of [-1,1]){this.crates.push(this.box(crate,side*.27,.06,0,.07,.37,.6,0xc79a57));this.crates.push(this.box(crate,0,.06,side*.26,.58,.37,.06,0xd4ab66));}
    }
    this.deer=new THREE.Group();this.deer.position.set(-2.3,0,2.05);this.deer.rotation.y=.18;this.world.add(this.deer);
    const d=(...args)=>this.box(this.deer,...args);
    for(const x of [-.17,.17]){d(x,.27,0,.18,.53,.22,0xa87443);d(x,.07,.05,.2,.12,.27,0x644b37);}
    d(0,.71,0,.56,.53,.37,0x698952);d(0,.69,.21,.39,.43,.07,0xd5c19a);d(0,.85,.26,.16,.12,.035,0x8a6944);
    d(-.37,.7,0,.15,.48,.18,0x9b794d,.18);d(.37,.7,.08,.15,.48,.18,0x9b794d,-.18);
    d(0,1.25,0,.64,.64,.5,0xc9975e);d(0,1.13,.31,.43,.23,.23,0xf2dbb3);d(0,1.19,.45,.15,.10,.07,0x594532);
    for(const x of [-.19,.19]){d(x,1.38,.266,.13,.14,.025,0x2e3631);d(x-.025,1.41,.285,.035,.04,.015,0xfff1cd);}
    for(const side of [-1,1]){
      d(side*.43,1.53,0,.23,.25,.16,0xb18350);d(side*.43,1.55,.09,.12,.12,.02,0xf1c998);
      d(side*.24,1.86,-.1,.105,.59,.105,0x765332);d(side*.38,2.04,-.1,.36,.10,.105,0x8e6740);d(side*.51,2.16,-.1,.1,.29,.1,0x8e6740);
    }
    // A small copper watering can held beside the gardener.
    d(.47,.49,.25,.26,.27,.25,0xc7a65e);d(.64,.55,.30,.25,.065,.07,0xe1c67c,-.4);
    this.cloud=new THREE.Group();this.cloud.position.set(-1.6,4.3,-3.5);this.scene.add(this.cloud);
    for(let i=0;i<4;i++)this.box(this.cloud,i*.6,Math.sin(i)*.16,0,.8,.45,.5,0xe9f2dd);
  }
  resize() {
    if(this.disposed)return;
    const {width,height}=this.canvas.getBoundingClientRect();if(width<1||height<1)return;
    if(width===this.width&&height===this.height)return;
    this.width=width;this.height=height;
    this.renderer.setSize(width,height,false);
    const aspect=width/height,vertical=Math.max(8.5,11.5/aspect);
    this.camera.left=-vertical*aspect/2;this.camera.right=vertical*aspect/2;
    this.camera.top=vertical/2;this.camera.bottom=-vertical/2;this.camera.updateProjectionMatrix();
    this.render();
  }
  update(profile,event='') {
    if(this.disposed||!profile.run)return;
    this.profile=profile;
    profile.run.growth.forEach((growth,i)=>{
      this.trees[i].fruits.visible=growth>0;
      this.trees[i].fruits.children.forEach(mesh=>mesh.scale.copy(mesh.userData.baseScale).multiplyScalar(growth===2?1:.55));
      this.trees[i].ring.visible=profile.run.selected===i;
    });
    this.crates.forEach(mesh=>mesh.material=this.material(profile.gold?0xecc15c:0xc99a58));
    this.compostHeap.scale.y=profile.compost?.4:.27;
    this.waterSurface.scale.y=.04+profile.run.resources[1]*.015;
    this.sun.intensity=2.1+profile.run.resources[0]*.17;
    if(event&&!this.motion.matches){this.effectStart=performance.now();this.effect=event;}
    this.render();this.schedule();
  }
  setActive(active) {
    this.active=active&&!this.disposed;cancelAnimationFrame(this.raf);this.raf=0;
    if(this.active){this.resize();this.render();this.schedule();}
    else{this.effect='';this.trees.forEach(t=>t.crown.rotation.z=0);this.deer.rotation.z=0;}
  }
  schedule() {
    if(!this.active||this.raf||!this.effect)return;
    this.raf=requestAnimationFrame(time=>{this.raf=0;const p=Math.min(1,(time-this.effectStart)/650);
      this.trees.forEach((t,i)=>t.crown.rotation.z=Math.sin(p*Math.PI*4+i*.4)*.035*(1-p));
      this.deer.rotation.z=Math.sin(p*Math.PI)*.04;
      if(p>=1){this.effect='';this.deer.rotation.z=0;}
      this.render();this.schedule();
    });
  }
  render() {
    if(this.disposed||!this.width||!this.active)return;
    this.renderer.render(this.scene,this.camera);
    const info=this.renderer.info;
    Object.assign(this.canvas.dataset,{drawCalls:String(info.render.calls),triangles:String(info.render.triangles),geometries:String(info.memory.geometries),textures:String(info.memory.textures)});
  }
  dispose() {
    if(this.disposed)return;
    this.setActive(false);this.disposed=true;this.resizeObserver.disconnect();
    this.canvas.removeEventListener('pointerup',this.click);this.canvas.removeEventListener('webglcontextlost',this.lost);
    this.motion.removeEventListener('change',this.motionChanged);
    this.owned.forEach(resource=>resource.dispose());this.materials.forEach(material=>material.dispose());
    this.sun.shadow.map?.dispose();this.renderer.dispose();this.renderer.forceContextLoss();
  }
}
