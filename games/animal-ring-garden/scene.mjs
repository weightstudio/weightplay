import * as THREE from './vendor/three/three.module.min.js';

const COLORS = [0xffca65, 0x8de2b9, 0xff8f90, 0xb8a2ff];
const FINISHES = {stone:[0x526f78,0xc7ac76],jade:[0x247b69,0xc9e8c7],moonstone:[0x727ca8,0xe8d9ff]};
const TAU = Math.PI * 2;

// One demand-rendered scene. All transforms and pointer picking use its own rect.
export class ConservatoryScene {
  constructor(host, {select, turn, ready}) {
    this.host=host; this.select=select; this.turn=turn; this.ready=ready;
    this.active=false; this.frame=0; this.anim=null; this.disposed=false;
    this.reduced=matchMedia('(prefers-reduced-motion: reduce)');
    this.abort=new AbortController();
    this.renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;
    this.renderer.setClearColor(0x0c1c2b,0);
    this.canvas=this.renderer.domElement;
    this.canvas.setAttribute('aria-hidden','true');
    host.prepend(this.canvas);
    this.scene=new THREE.Scene();
    this.camera=new THREE.OrthographicCamera(-1.8,1.8,1.8,-1.8,.1,30);
    this.camera.position.set(0,0,8);this.camera.lookAt(0,0,0);
    this.scene.add(new THREE.HemisphereLight(0xc6e9ff,0x203c43,2.2));
    const sun=new THREE.DirectionalLight(0xffdc9f,3.4);sun.position.set(-3,5,7);this.scene.add(sun);
    const moon=new THREE.DirectionalLight(0x819dff,2);moon.position.set(4,-2,4);this.scene.add(moon);
    this.root=new THREE.Group();this.root.rotation.x=.17;this.scene.add(this.root);
    this.materials=[];this.geometries=[];this.rings=[];this.picks=[];this.jewels=[];
    const mat=(color,metalness=.25,roughness=.48)=>{const m=new THREE.MeshStandardMaterial({color,metalness,roughness});this.materials.push(m);return m;};
    const geo=g=>{this.geometries.push(g);return g;};
    const mesh=(g,m,parent,x=0,y=0,z=0)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);parent.add(o);return o;};
    this.stone=mat(0x526f78,.34,.55);this.brass=mat(0xc7ac76,.65,.35);
    const dark=mat(0x152e3c,.3,.6),leaf=mat(0x477d71,.1,.7),pale=mat(0xe3e1d1,.18,.6);
    const cylinder=geo(new THREE.CylinderGeometry(1.48,1.54,.14,64));
    const base=mesh(cylinder,dark,this.root,0,0,-.15);base.rotation.x=Math.PI/2;
    mesh(geo(new THREE.TorusGeometry(1.48,.025,6,64)),this.brass,this.root,0,0,-.05);
    const stoneGeo=geo(new THREE.BoxGeometry(.12,.13,.10));
    for(let i=0;i<24;i++){
      const a=i*TAU/24, o=mesh(stoneGeo,i%3?dark:this.brass,this.root,Math.sin(a)*1.39,Math.cos(a)*1.39,-.01);o.rotation.z=-a;
    }
    const shapes=[geo(new THREE.OctahedronGeometry(.115)),geo(new THREE.IcosahedronGeometry(.105,0)),geo(new THREE.ConeGeometry(.12,.20,3)),geo(new THREE.BoxGeometry(.16,.16,.13))];
    this.gemMaterials=COLORS.map(c=>mat(c,.32,.24));
    [1.16,.82,.48].forEach((radius,ring)=>{
      const group=new THREE.Group();this.root.add(group);this.rings.push(group);
      const rim=mesh(geo(new THREE.TorusGeometry(radius,.125,8,64)),this.stone,group);rim.userData.ring=ring;this.picks.push(rim);
      mesh(geo(new THREE.TorusGeometry(radius+.115,.009,5,64)),this.brass,group,0,0,.035);
      mesh(geo(new THREE.TorusGeometry(radius-.115,.009,5,64)),this.brass,group,0,0,.035);
      for(let j=0;j<4;j++){
        const a=Math.PI/2+j*Math.PI/2;
        const gem=mesh(shapes[j],this.gemMaterials[j],group,Math.cos(a)*radius,Math.sin(a)*radius,.15);
        if(j===2)gem.rotation.z=-a+Math.PI/2;
        gem.userData.ring=ring;this.picks.push(gem);this.jewels.push(gem);
      }
      const highlight=mesh(geo(new THREE.TorusGeometry(radius,.009,5,64)),new THREE.MeshBasicMaterial({color:0xfce2a5,transparent:true,opacity:.9}),this.root,0,0,.27);
      this.materials.push(highlight.material);group.userData.highlight=highlight;
    });
    // A tiny, unmistakably cuboid Mimi statue marks the axis of the instrument.
    const cube=geo(new THREE.BoxGeometry(1,1,1));
    const block=(m,x,y,z,sx,sy,sz)=>{const o=mesh(cube,m,this.root,x,y,z);o.scale.set(sx,sy,sz);return o;};
    block(this.brass,0,-.015,.05,.34,.32,.12);
    block(pale,0,0,.19,.22,.19,.15);
    block(pale,-.064,.155,.18,.056,.15,.10);block(pale,.064,.155,.18,.056,.15,.10);
    block(this.gemMaterials[2],-.064,.17,.237,.026,.08,.012);block(this.gemMaterials[3],.064,.17,.237,.026,.08,.012);
    block(dark,-.046,.01,.274,.026,.026,.015);block(dark,.046,.01,.274,.026,.026,.015);
    block(this.gemMaterials[0],0,-.1,.22,.23,.035,.14);
    // Four restrained block-leaf clusters frame, rather than cover, the instrument.
    for(const a of [.65,2.5,3.8,5.55])for(let n=0;n<3;n++){
      const o=mesh(geo(new THREE.BoxGeometry(.07,.20,.05)),leaf,this.root,Math.cos(a)*(1.43+n*.035),Math.sin(a)*(1.43+n*.035),-.08+n*.025);o.rotation.z=a+n*.5;
    }
    // Fixed north marker identifies the three glyphs the player is matching.
    const pointer=mesh(geo(new THREE.ConeGeometry(.075,.13,3)),this.brass,this.root,0,1.44,.20);pointer.rotation.z=Math.PI;
    this.raycaster=new THREE.Raycaster();this.pointer=new THREE.Vector2();
    const options={signal:this.abort.signal};
    this.canvas.addEventListener('pointerdown',e=>this.pointerDown(e),options);
    this.canvas.addEventListener('pointerup',e=>this.pointerUp(e),options);
    this.canvas.addEventListener('pointercancel',()=>{this.gesture=null;},options);
    this.canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();this.cancel();host.dataset.context='lost';this.ready(false);},options);
    this.canvas.addEventListener('webglcontextrestored',()=>{delete host.dataset.context;this.ready(true);this.draw();},options);
    this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(host);
    this.resize();
  }
  pointerDown(e){
    if(!this.active||this.anim)return;
    const r=this.canvas.getBoundingClientRect();
    this.pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);
    this.raycaster.setFromCamera(this.pointer,this.camera);
    const hit=this.raycaster.intersectObjects(this.picks)[0];if(!hit)return;
    const ring=hit.object.userData.ring;this.select(ring);
    this.gesture={ring,x:e.clientX,y:e.clientY,angle:Math.atan2(e.clientY-r.top-r.height/2,e.clientX-r.left-r.width/2)};
    this.canvas.setPointerCapture(e.pointerId);e.preventDefault();
  }
  pointerUp(e){
    const g=this.gesture;this.gesture=null;if(!g)return;
    const r=this.canvas.getBoundingClientRect(),a=Math.atan2(e.clientY-r.top-r.height/2,e.clientX-r.left-r.width/2);
    const delta=Math.atan2(Math.sin(a-g.angle),Math.cos(a-g.angle));
    if(Math.hypot(e.clientX-g.x,e.clientY-g.y)>18&&Math.abs(delta)>.16)this.turn(g.ring,delta>0?1:-1);
  }
  resize(){
    const {width,height}=this.host.getBoundingClientRect();if(width<2||height<2||this.disposed)return;
    const aspect=width/height,half=1.70;
    this.camera.left=-half*Math.max(1,aspect);this.camera.right=-this.camera.left;
    this.camera.top=half/Math.min(1,aspect);this.camera.bottom=-this.camera.top;
    this.camera.updateProjectionMatrix();this.renderer.setSize(width,height,false);this.draw();
  }
  setActive(active){this.active=active;if(!active){this.gesture=null;this.cancel();}else this.resize();}
  setFinish(name){const [a,b]=FINISHES[name]||FINISHES.stone;this.stone.color.setHex(a);this.brass.color.setHex(b);this.draw();}
  selectRing(index){this.rings.forEach((r,i)=>{r.userData.highlight.visible=i===index;});this.draw();}
  setState(rings){this.cancel();rings.forEach((v,i)=>this.rings[i].rotation.z=-v*Math.PI/2);this.draw();}
  animate(rings,deltas,done){
    this.cancel();const from=this.rings.map(r=>r.rotation.z),duration=this.reduced.matches?0:300;
    const start=performance.now();this.anim={done};
    const step=now=>{
      if(!this.anim||this.disposed)return;
      const t=duration?Math.min(1,(now-start)/duration):1,ease=1-(1-t)**3;
      this.rings.forEach((r,i)=>r.rotation.z=from[i]-deltas[i]*Math.PI/2*ease);
      this.draw();if(t<1)this.frame=requestAnimationFrame(step);else{this.frame=0;this.anim=null;this.setState(rings);done();}
    };this.frame=requestAnimationFrame(step);
  }
  cancel(){if(this.frame)cancelAnimationFrame(this.frame);this.frame=0;this.anim=null;}
  draw(){if(this.active&&!this.disposed&&this.host.dataset.context!=='lost')this.renderer.render(this.scene,this.camera);}
  dispose(){this.cancel();this.disposed=true;this.abort.abort();this.resizeObserver.disconnect();this.geometries.forEach(g=>g.dispose());this.materials.forEach(m=>m.dispose());this.renderer.dispose();this.renderer.forceContextLoss();this.canvas.remove();}
}
