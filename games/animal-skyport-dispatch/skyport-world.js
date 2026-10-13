// Original WeightPlay Block Animals harbor. Three.js 0.180.0 / MIT, local only.
import * as THREE from '../animal-skyspire-drop/vendor/three/three.module.min.js';

export class SkyportWorld {
  constructor(field) {
    this.field = field;
    this.resources = new Set();
    this.materials = new Map();
    this.frame = 0;
    this.time = 0;
    this.last = 0;
    this.paused = false;
    this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'skyport-world';
    this.canvas.setAttribute('aria-hidden', 'true');
    field.prepend(this.canvas);
    try {
      this.renderer = new THREE.WebGLRenderer({canvas:this.canvas, antialias:true, alpha:true, powerPreference:'low-power'});
      this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.08;
      this.scene = new THREE.Scene();
      this.camera = new THREE.OrthographicCamera(-200,200,300,-300,1,2000);
      this.camera.position.set(0,0,1000);
      this.box = this.own(new THREE.BoxGeometry(1,1,1));
      this.scene.add(new THREE.HemisphereLight(0xf5f9ff,0x41556e,1.6));
      const sun = new THREE.DirectionalLight(0xffe2b2,2.5); sun.position.set(-200,400,600); this.scene.add(sun);
      const rim = new THREE.DirectionalLight(0x8ee5ff,1.8); rim.position.set(350,50,-50); this.scene.add(rim);
      this.docks = ['cargo','passenger','repair'].map((kind,i)=>this.buildDock(kind,i));
      this.ship = this.buildShip(); this.scene.add(this.ship);
      this.departure = this.buildShip(); this.departure.visible=false; this.scene.add(this.departure);
      this.observer = new ResizeObserver(()=>this.resize()); this.observer.observe(field);
      this.onLost = event => {event.preventDefault(); this.lost=true; this.stop(); field.dispatchEvent(new CustomEvent('skyport:context-lost'));};
      this.canvas.addEventListener('webglcontextlost',this.onLost);
      this.resize(); this.start();
      field.dataset.world = 'ready';
    } catch(error) {this.dispose(); throw error;}
  }
  own(value) {this.resources.add(value); return value;}
  mat(color,metal=0) {
    const key=`${color}:${metal}`;
    if(!this.materials.has(key)) this.materials.set(key,this.own(new THREE.MeshStandardMaterial({color,roughness:metal?.4:.83,metalness:metal})));
    return this.materials.get(key);
  }
  cube(parent,color,x,y,z,w,h,d,metal=0) {
    const mesh=new THREE.Mesh(this.box,this.mat(color,metal));
    mesh.position.set(x,y,z); mesh.scale.set(w,h,d); parent.add(mesh); return mesh;
  }
  buildOwl(parent,x,y,z,scale=1) {
    const owl=new THREE.Group(); owl.position.set(x,y,z); owl.scale.setScalar(scale); parent.add(owl);
    this.cube(owl,0x263e57,0,0,0,15,18,12);
    this.cube(owl,0x896348,0,17,0,23,20,18);
    for(const side of [-1,1]) {
      this.cube(owl,0xffe7bf,side*5.7,17,9.3,9.5,14,2);
      this.cube(owl,0xdeb466,side*5.7,18,11,6,8,1,.2);
      this.cube(owl,0x101e30,side*5.7,18,12,4,6,1);
      this.cube(owl,0xffffff,side*5.7-1,20,12.8,1.5,2,1);
      this.cube(owl,0x634c3f,side*11,2,0,6,16,9);
      this.cube(owl,0xc5a077,side*13,-3,2,5,10,8);
      this.cube(owl,0xc99a43,side*5,-12,4,6,4,8,.2);
    }
    this.cube(owl,0xe8b44f,0,12,12,4,6,4,.2);
    this.cube(owl,0x182d49,0,29,0,28,4,22);
    this.cube(owl,0x223955,-2,34,-1,21,7,17);
    // Three gold tiles form Orla's stepped crescent, with navy negative space.
    for(const [cx,cy] of [[2,35],[0,33],[2,31]]) this.cube(owl,0xffd36c,cx,cy,8,3,3,1,.5);
    this.cube(owl,0xd0a257,0,2,6.6,12,2,1,.4);
    this.cube(owl,0xe4c883,7,-1,7,5,10,3);
    return owl;
  }
  buildDock(kind,index) {
    const group=new THREE.Group(); group.rotation.set(.43,-.32,0); this.scene.add(group);
    const colors=[0xd6a145,0x438b9a,0xd37c66]; const color=colors[index];
    this.cube(group,0x3a5263,0,-16,0,68,22,51);
    this.cube(group,0x799794,5,-35,0,45,20,32);
    this.cube(group,0x476e77,7,-49,-2,25,15,18);
    this.cube(group,0xc2b589,0,-1,0,77,8,60);
    this.cube(group,0x28485a,0,5,0,67,4,50);
    for(let i=-3;i<=3;i++) this.cube(group,0x916f4b,i*9,7.1,0,8,1,47);
    for(let i=-2;i<=2;i++) this.cube(group,color,i*12,7,0,8,1,37,.25);
    for(const side of [-1,1]) {
      this.cube(group,0x28485a,side*34,18,-23,4,27,4);
      this.cube(group,0xf3c96b,side*34,32,-23,7,6,7,.35);
      this.cube(group,0xffedaa,side*34,38,-23,5,7,5);
    }
    this.cube(group,0xd9c694,-22,27,-17,17,38,17);
    for(let i=0;i<3;i++)this.cube(group,0xab936a,-22,14+i*10,-7.8,18,1,1);
    this.cube(group,color,-22,49,-17,23,6,23);
    this.cube(group,0x28485a,-22,34,-8,9,11,1);
    this.cube(group,0xa4d6d4,-22,34,-7,6,8,1);
    this.cube(group,0xdfaf5c,26,31,-18,2,48,2,.5);
    this.cube(group,color,34,46,-18,15,17,1);
    if(kind==='cargo') for(let i=0;i<3;i++) {this.cube(group,0x9b6c3c,20-i*11,14,14,10,12,10);this.cube(group,0xe4bd77,20-i*11,14,19.2,2,12,1);}
    if(kind==='repair') {this.cube(group,0xe9dcca,15,13,14,22,10,13);this.cube(group,color,15,13,21,5,9,1);}
    this.buildOwl(group,-8,16,5,.55);
    group.userData.kind=kind;
    return group;
  }
  buildShip() {
    const ship=new THREE.Group(); const model=new THREE.Group(); ship.add(model); model.rotation.set(.22,-.35,-.06);
    // Layered rectangular envelope: deliberate stepped silhouette and ribbing.
    for(const [w,h,d,y] of [[70,21,27,13],[56,12,34,27],[56,9,32,-1]]) {
      const m=this.cube(model,0xf5e3b7,0,y,0,w,h,d); m.userData.hull=true;
    }
    for(const x of [-22,0,22]) {
      const rib=this.cube(model,0x247f8a,x,13,0,7,29,29,.15); rib.userData.trim=true;
      const top=this.cube(model,0x247f8a,x,29,0,7,6,34,.15); top.userData.trim=true;
    }
    this.cube(model,0x1b3c53,38,12,0,9,14,19);
    this.cube(model,0xe0b157,-42,11,0,17,4,23,.4);
    for(const x of [-19,19]) this.cube(model,0x947044,x,-9,0,2,17,2,.3);
    this.cube(model,0x5a4137,0,-22,0,45,13,20);
    this.cube(model,0xe4b75e,0,-16,0,48,3,24,.4);
    for(const x of [-14,-3,8]) this.cube(model,0x93cfce,x,-23,10.3,6,6,1,.15);
    this.cube(model,0xdba354,23,-21,0,6,10,21,.3);
    this.buildOwl(model,8,-10,4,.32);
    const propeller=new THREE.Group(); propeller.position.set(-43,13,0); model.add(propeller);
    this.cube(propeller,0x31515b,0,0,0,3,32,4,.3);
    this.cube(propeller,0xe3b45b,0,0,0,6,5,7,.5);
    ship.userData={model,propeller}; return ship;
  }
  center(element) {
    const a=this.field.getBoundingClientRect(),b=element.getBoundingClientRect();
    return {x:(b.left+b.width/2-a.left)/a.width*this.width-this.width/2,y:this.height/2-(b.top+b.height/2-a.top)/a.height*this.height};
  }
  resize() {
    if(this.disposed)return;
    const w=this.field.clientWidth,h=this.field.clientHeight;if(!w||!h)return;
    this.width=w;this.height=h;
    this.renderer.setSize(w,h,false);
    Object.assign(this.camera,{left:-w/2,right:w/2,top:h/2,bottom:-h/2});this.camera.updateProjectionMatrix();
    this.docks.forEach(dock=>{const p=this.center(this.field.querySelector(`[data-dock="${dock.userData.kind}"]`));dock.position.set(p.x,p.y-5,0);});
    const p=this.center(this.field.querySelector('#flight'));this.anchor=p;this.ship.position.set(p.x,p.y,35);
    this.render();
  }
  update({kind,chapter=0,gold=false}) {
    this.field.dataset.chapter=String(chapter+1);
    const colors={cargo:0x248e97,passenger:0x3c76ac,repair:0xcd705a,festival:0x9659a7,heavy:0x4d6a69};
    for(const ship of [this.ship]) ship.traverse(m=>{if(m.userData.trim)m.material=this.mat(gold?0xd5a544:(colors[kind]||colors.cargo),.3);});
    this.arrivedAt=this.time;this.kind=kind;this.resize();
  }
  dispatch(points) {
    // Bounded visual proxy. Accepted state is already committed by the game.
    this.departure.traverse(m=>{if(m.userData.trim)m.material=this.ship.children[0].children.find(n=>n.userData.trim).material;});
    this.travel={points:points.map(p=>({x:p.x/this.width,y:p.y/this.height})),start:this.time};
    this.departure.visible=!this.reduced;
  }
  reject() {this.rejectedAt=this.time;}
  setPaused(value) {this.paused=value;if(value)this.stop();else this.start();}
  start() {
    if(this.frame||this.disposed||this.lost||this.paused)return;
    this.last=0;
    const tick=now=>{
      if(this.disposed||this.paused||this.lost)return;
      const dt=this.last?Math.min((now-this.last)/1000,.04):0;this.last=now;this.time+=dt;
      if(this.anchor){
        const arrival=Math.min(1,(this.time-(this.arrivedAt||0))/.32);
        const shake=Math.max(0,1-(this.time-(this.rejectedAt??-10))/.22);
        this.ship.position.x=this.anchor.x+(this.reduced?0:Math.sin(shake*25)*shake*4);
        this.ship.position.y=this.anchor.y+(this.reduced?0:(1-arrival)*22);
        this.ship.userData.propeller.rotation.x=this.reduced?0:this.time*8;
      }
      if(this.travel){
        const p=Math.min(1,(this.time-this.travel.start)/.65), path=this.travel.points;
        const lengths=path.slice(1).map((point,i)=>Math.hypot(point.x-path[i].x,(point.y-path[i].y)*this.height/this.width));
        let distance=lengths.reduce((a,b)=>a+b,0)*p,index=0;
        while(index<lengths.length-1&&distance>lengths[index])distance-=lengths[index++];
        const a=path[index],b=path[index+1]||a,t=lengths[index]?distance/lengths[index]:0;
        if(a){this.departure.position.set((a.x+(b.x-a.x)*t-.5)*this.width,(.5-a.y-(b.y-a.y)*t)*this.height,55);this.departure.scale.setScalar(1-p*.4);}
        if(p>=1){this.travel=null;this.departure.visible=false;}
      }
      this.render();this.frame=requestAnimationFrame(tick);
    };this.frame=requestAnimationFrame(tick);
  }
  stop(){if(this.frame)cancelAnimationFrame(this.frame);this.frame=0;this.last=0;}
  render(){if(!this.disposed&&!this.lost)this.renderer?.render(this.scene,this.camera);}
  stats(){return{renderer:'Three.js 0.180.0',drawCalls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,geometries:this.renderer.info.memory.geometries,textures:this.renderer.info.memory.textures,materials:this.materials.size,raf:Boolean(this.frame),disposed:Boolean(this.disposed)};}
  dispose(){this.disposed=true;this.stop();this.observer?.disconnect();this.canvas?.removeEventListener('webglcontextlost',this.onLost);this.resources.forEach(r=>r.dispose());this.resources.clear();this.renderer?.dispose();this.renderer?.forceContextLoss();this.canvas?.remove();delete this.field.dataset.world;}
}
