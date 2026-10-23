import * as THREE from './vendor/three/three.module.min.js';
import {NODES,capacity} from './model.mjs';

const POS={source:[-2.8,-4],cistern:[0,-.3],gardenA:[-2.7,4],gardenB:[2.7,4],waste:[3.1,-4],lowerPond:[-3.3,0]};
const PALETTE={stone:0x66878c,edge:0xa7beb3,earth:0x264c55,sand:0xc6b88a,wood:0x694b3b,brass:0xefb76c,leaf:0x337c6a,lightLeaf:0x70ad77,soil:0x5b5145,water:0x25b7c7,deep:0x126c88,cream:0xffdf96,dark:0x183b47};
const ease=t=>1-Math.pow(1-t,3);

export class RiverScene {
  constructor(host,{onLayout,onError,onRestored}={}) {
    this.host=host;this.onLayout=onLayout;this.onError=onError;this.onRestored=onRestored;
    this.scene=new THREE.Scene();this.scene.background=new THREE.Color(0x102e3d);
    this.camera=new THREE.OrthographicCamera(-6,6,8,-8,.1,100);
    this.camera.position.set(0,15,10);this.camera.lookAt(0,0,0);
    this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});
    this.contextRecovery=this.renderer.getContext().getExtension('WEBGL_lose_context');
    this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;this.renderer.shadowMap.autoUpdate=false;
    this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;
    this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.05;
    this.renderer.domElement.setAttribute('aria-hidden','true');host.prepend(this.renderer.domElement);
    this.scene.add(new THREE.HemisphereLight(0xb8eeff,0x344b36,1.8));
    const sun=new THREE.DirectionalLight(0xffd5a1,2.3);sun.position.set(-5,12,5);this.scene.add(sun);
    sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-12,right:12,top:12,bottom:-12,near:.5,far:35});sun.shadow.bias=-.0005;sun.shadow.normalBias=.04;
    const fill=new THREE.DirectionalLight(0x4ca9ce,1);fill.position.set(5,7,-5);this.scene.add(fill);
    this.geometry=new THREE.BoxGeometry(1,1,1);this.arrowGeometry=new THREE.ConeGeometry(.13,.32,3);this.materials=new Map();
    this.group=new THREE.Group();this.scene.add(this.group);this.staticBatches=new Map();
    this.waters=new Map();this.crops=new Map();this.routes=new Map();this.lanterns=[];
    this.reduced=matchMedia('(prefers-reduced-motion: reduce)');
    this.active=false;this.motion=null;this.frame=0;this.disposed=false;this.lost=false;
    this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(host);
    this.contextLost=e=>{e.preventDefault();this.lost=true;this.stop();this.onError?.();};
    this.contextRestored=()=>{this.lost=false;this.resize();this.draw();this.onRestored?.();};
    this.renderer.domElement.addEventListener('webglcontextlost',this.contextLost);
    this.renderer.domElement.addEventListener('webglcontextrestored',this.contextRestored);
    this.motionChanged=()=>{this.finishMotion();this.draw();};this.reduced.addEventListener('change',this.motionChanged);
  }
  material(color,glow=0) {
    const key=`${color}:${glow}`;
    if(!this.materials.has(key))this.materials.set(key,new THREE.MeshStandardMaterial({color,roughness:.8,metalness:glow?.1:0,emissive:color,emissiveIntensity:glow}));
    return this.materials.get(key);
  }
  box(color,x,y,z,w,h,d,{dynamic=false,rotation=0,glow=0,parent=this.group}={}) {
    const material=this.material(color,glow);
    if(!dynamic && parent===this.group){
      const list=this.staticBatches.get(material)||[];
      list.push({x,y,z,w,h,d,rotation});this.staticBatches.set(material,list);return null;
    }
    const mesh=new THREE.Mesh(this.geometry,material);mesh.position.set(x,y,z);mesh.scale.set(w,h,d);mesh.rotation.y=rotation;mesh.receiveShadow=true;mesh.castShadow=![PALETTE.deep,PALETTE.water,0xa7f6f2].includes(color);parent.add(mesh);return mesh;
  }
  batch() {
    const dummy=new THREE.Object3D();
    for(const [mat,items]of this.staticBatches){
      const mesh=new THREE.InstancedMesh(this.geometry,mat,items.length);
      mesh.castShadow=true;mesh.receiveShadow=true;
      items.forEach((v,i)=>{dummy.position.set(v.x,v.y,v.z);dummy.scale.set(v.w,v.h,v.d);dummy.rotation.set(0,v.rotation,0);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);});
      this.group.add(mesh);
    }
    this.staticBatches.clear();
  }
  build(plan) {
    this.finishMotion();
    for(const child of [...this.group.children]){this.group.remove(child);if(child.isInstancedMesh)child.dispose();}
    this.plan=plan;this.waters.clear();this.crops.clear();this.routes.clear();this.lanterns=[];
    this.box(PALETTE.earth,0,-.65,0,10.6,1.1,12.1);
    this.box(PALETTE.stone,0,-.13,0,10.35,.22,11.85);
    this.box(0x456e6e,0,.02,0,10.1,.12,11.6);
    for(let j=0;j<22;j++){const x=-4.7+(j*17%31)/31*9.4,z=-5.3+(j*11%29)/29*10.6;this.box(j%2?0x527a6c:0x3b625e,x,.091,z,.38,.02,.38);}
    // An authored, layered stone island, with irregular shore stones.
    for(let i=0;i<19;i++){
      const z=-5.5+i*.6;
      this.box(i%2?PALETTE.stone:PALETTE.edge,-5.1,.07,z,.35,.32,.49);
      this.box(i%2?PALETTE.edge:PALETTE.stone,5.1,.07,z,.35,.24,.49);
    }
    for(let i=0;i<16;i++)this.box(PALETTE.stone,-4.7+i*.63,-.28,5.95,.51,.5,.26);
    const visible=new Set(plan.edges.flatMap(e=>[e.from,e.to]));visible.add('source');visible.add('cistern');visible.add('gardenA');visible.add('gardenB');
    for(const node of visible){
      const [x,z]=POS[node],garden=node.startsWith('garden'),w=garden?2.05:1.9,d=garden?1.7:1.75;
      this.box(PALETTE.dark,x,.1,z,w+.2,.25,d+.2);
      this.box(PALETTE.soil,x,.24,z,w-.28,.2,d-.28);
      this.box(PALETTE.edge,x,.38,z-d/2,w+.15,.42,.18);
      this.box(PALETTE.stone,x,.38,z+d/2,w+.15,.42,.18);
      this.box(PALETTE.edge,x-w/2,.38,z,.18,.42,d);
      this.box(PALETTE.stone,x+w/2,.38,z,.18,.42,d);
      const water=this.box(node==='waste'?0x6b7786:PALETTE.water,x,.34,z,w-.3,.06,d-.28,{dynamic:true,glow:.1});
      this.waters.set(node,water);
      if(garden){
        const crops=new THREE.Group();crops.position.set(x,.42,z);this.group.add(crops);
        for(let j=0;j<6;j++){
          const dx=(j%3-1)*.48,dz=(Math.floor(j/3)-.5)*.65;
          this.box(PALETTE.lightLeaf,dx,.24,dz,.14,.45,.14,{dynamic:true,parent:crops});
          this.box(PALETTE.leaf,dx,.23,dz,.42,.15,.25,{dynamic:true,parent:crops});
          this.box(node==='gardenA'?0xf0a85f:0xf6da87,dx,.49,dz,.27,.25,.27,{dynamic:true,parent:crops});
        }
        this.crops.set(node,crops);
      }
      if(node==='source'){
        for(let j=0;j<3;j++)this.box(j%2?PALETTE.edge:PALETTE.stone,x-1+j*.8,.65+j%2*.25,z-1.2,.8,1.15+j%2*.5,.8);
        this.box(PALETTE.water,x,.8,z-1,.3,.8,.1,{glow:.2});
      }
    }
    plan.edges.forEach((edge,index)=>{
      const same=plan.edges.filter(e=>e.from===edge.from&&e.to===edge.to),ordinal=same.indexOf(edge);
      const start=POS[edge.from],end=POS[edge.to];
      let middle=[(start[0]+end[0])/2,(start[1]+end[1])/2];
      if(edge.from==='source'&&edge.to==='gardenB')middle=[4.1,-.1];
      if(edge.from==='source'&&edge.to==='gardenA')middle=[-4.25,.4];
      if(edge.from==='source'&&edge.to==='waste')middle=[.2,-4.65];
      if(edge.from==='lowerPond'&&edge.to==='gardenB')middle=[-.8,2.5];
      if(edge.repair)middle=[1.45,-1.2];
      middle[0]+=(ordinal-(same.length-1)/2)*1.12;
      const points=[new THREE.Vector3(start[0],.28,start[1]),new THREE.Vector3(middle[0],.28,middle[1]),new THREE.Vector3(end[0],.28,end[1])];
      const curve=new THREE.CatmullRomCurve3(points,false,'catmullrom',.05),surfaces=[];
      if(!edge.repair){
        for(let j=0;j<10;j++){
          const a=curve.getPoint(j/10),b=curve.getPoint((j+1)/10),c=a.clone().lerp(b,.5),length=a.distanceTo(b)+.08,rotation=Math.atan2(b.x-a.x,b.z-a.z);
          this.box(PALETTE.dark,c.x,.16,c.z,.63,.17,length,{rotation});
          const sideX=(b.z-a.z)/length*.27,sideZ=-(b.x-a.x)/length*.27;
          for(const sign of [-1,1])this.box(PALETTE.stone,c.x+sideX*sign,.33,c.z+sideZ*sign,.1,.2,length,{rotation});
          surfaces.push(this.box(PALETTE.deep,c.x,.27,c.z,.34,.07,length,{dynamic:true,rotation}));
        }
      }
      if(!edge.repair){const arrow=new THREE.Mesh(this.arrowGeometry,this.material(0xa4d3c5));arrow.position.copy(curve.getPoint(.72));arrow.position.y=.36;arrow.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),curve.getTangent(.72).normalize());this.group.add(arrow);}
      const anchor=curve.getPoint(.5);
      if(edge.repair)anchor.set(middle[0],.3,middle[1]);
      const angle=Math.atan2(end[0]-start[0],end[1]-start[1]);
      const gate=new THREE.Group();gate.position.copy(anchor);gate.rotation.y=angle;this.group.add(gate);
      this.box(PALETTE.wood,-.34,.38,0,.16,.72,.18,{dynamic:true,parent:gate});
      this.box(PALETTE.wood,.34,.38,0,.16,.72,.18,{dynamic:true,parent:gate});
      this.box(PALETTE.brass,0,.77,0,.87,.12,.22,{dynamic:true,parent:gate});
      const shutter=this.box(PALETTE.sand,0,.31,0,.57,.48,.12,{dynamic:true,parent:gate});
      this.routes.set(edge.id,{curve,anchor,gate,shutter,surfaces,index});
    });
    // Willow crowns, wharf, reed beds, lanterns and a block-built beaver keeper.
    for(const [x,z,size]of [[-4.3,-4.7,.9],[4.3,2.5,.7],[4.4,-5,.85],[-4.4,3.6,.7]]){
      this.box(PALETTE.wood,x,.9,z,.26,1.6,.26);
      this.box(PALETTE.leaf,x,1.75,z,size*1.6,.6,size*1.5);
      this.box(PALETTE.lightLeaf,x-.2,2.13,z-.1,size,.45,size);
      this.box(0x508b68,x+.42,1.34,z+.25,.3,1,.42);
    }
    for(const [x,z]of [[-1.35,5.15],[1.3,5.15],[1.7,-3],[4.45,.7]]){
      this.box(PALETTE.wood,x,.67,z,.13,1.2,.13);
      this.box(PALETTE.brass,x,1.36,z,.34,.1,.34);
      this.lanterns.push(this.box(PALETTE.cream,x,1.13,z,.24,.35,.24,{dynamic:true,glow:.35}));
    }
    for(let j=0;j<5;j++)this.box(PALETTE.wood,.2+j*.35,.12,5.25,.29,.15,1.05);
    const keeper=new THREE.Group();keeper.position.set(0,.16,5.1);keeper.rotation.y=-.2;keeper.scale.setScalar(1.15);this.group.add(keeper);
    const k=(c,x,y,z,w,h,d)=>this.box(c,x,y,z,w,h,d,{dynamic:true,parent:keeper});
    k(0x9b633e,0,.46,0,.58,.69,.48);k(0x2c8e98,0,.4,.07,.62,.44,.5);
    k(0xae794e,0,1.01,0,.76,.67,.65);k(0xc99c69,0,.87,.34,.5,.25,.12);
    k(0x71492f,-.31,1.38,0,.24,.23,.27);k(0x71492f,.31,1.38,0,.24,.23,.27);
    k(0x1a363a,-.2,1.12,.34,.12,.13,.04);k(0x1a363a,.2,1.12,.34,.12,.13,.04);
    k(0x2f342f,0,.95,.43,.18,.12,.09);k(0xf9e8c9,-.075,.73,.42,.12,.19,.07);k(0xf9e8c9,.075,.73,.42,.12,.19,.07);
    k(0x318b9a,0,1.35,.14,.77,.16,.12);k(0x9bd7e4,-.2,1.35,.22,.24,.15,.08);k(0x9bd7e4,.2,1.35,.22,.24,.15,.08);
    k(0x8d5838,-.43,.58,.08,.2,.42,.24);k(0x8d5838,.43,.58,.08,.2,.42,.24);
    k(0x544236,-.2,.1,.12,.28,.21,.39);k(0x544236,.2,.1,.12,.28,.21,.39);
    this.parcel=this.box(0xa7f6f2,0,0,0,.25,.2,.4,{dynamic:true,glow:.6});this.parcel.visible=false;
    this.batch();this.resize();
  }
  update(state,selected,theme) {
    this.state=state;this.selected=selected;this.theme=theme;
    for(const [node,mesh]of this.waters){
      const n=state.water[NODES.indexOf(node)],ratio=n/Math.max(1,capacity(this.plan,node));
      if(node!=='waste')mesh.material=this.material(theme?0x49b5e6:PALETTE.water,.1);
      mesh.visible=n>0;mesh.position.y=.29+Math.min(1,ratio)*.14;
      if(this.crops.has(node))this.crops.get(node).scale.y=n>0?.65+.35*ratio:.2;
    }
    for(const [id,route]of this.routes){
      const active=id===selected;
      route.surfaces.forEach(m=>{m.material=this.material(active?0x8bece5:PALETTE.deep,active?.35:0);});
      route.shutter.material=this.material(active?PALETTE.brass:PALETTE.sand,active?.15:0);
      route.shutter.position.y=state.used.includes(id)||state.closed.includes(id)?.31:.31;
    }
    this.scene.background.set(theme?0x142740:0x102e3d);
    this.lanterns.forEach(m=>{m.material=this.material(theme?0xffbd55:PALETTE.cream,theme?1:.35);m.scale.set(theme?.3:.24,theme?.48:.35,theme?.3:.24);});
    this.renderer.shadowMap.needsUpdate=true;this.draw();
  }
  project(point) { const p=this.group.localToWorld(point.clone()).project(this.camera);return {x:(p.x+1)/2,y:(1-p.y)/2}; }
  layout() {
    const nodes={};for(const node of this.waters.keys()){const [x,z]=POS[node];nodes[node]=this.project(new THREE.Vector3(x,.65,z-1));}
    const gates={};for(const [id,r]of this.routes)gates[id]=this.project(r.anchor.clone().add(new THREE.Vector3(0,1.1,0)));
    this.onLayout?.({nodes,gates});
  }
  resize() {
    if(this.disposed)return;
    const width=this.host.clientWidth,height=this.host.clientHeight;if(!width||!height)return;
    this.renderer.setSize(width,height,false);
    const aspect=width/height,wide=aspect>1.25;
    this.group.rotation.y=wide?Math.PI/2:0;
    this.group.scale.set(wide?.72:1,1,wide?1.3:1);this.group.updateMatrixWorld(true);
    const viewH=wide?Math.max(8.3,16.5/aspect):Math.max(12.9,10.85/aspect);
    this.camera.left=-viewH*aspect/2;this.camera.right=viewH*aspect/2;this.camera.top=viewH/2;this.camera.bottom=-viewH/2;
    this.camera.updateProjectionMatrix();this.layout();this.renderer.shadowMap.needsUpdate=true;this.draw();
  }
  animate(before,next,edge,done) {
    this.finishMotion();
    if(this.reduced.matches){this.update(next,this.selected,this.theme);done();return;}
    this.motion={before,next,edge,done,elapsed:0,last:0};this.tick();
  }
  tick() {
    if(!this.active||this.lost||!this.motion||this.frame)return;
    this.frame=requestAnimationFrame(time=>{
      this.frame=0;const motion=this.motion;if(!motion)return;
      const dt=motion.last?Math.min(40,time-motion.last):0;motion.last=time;motion.elapsed+=dt;
      const t=Math.min(1,motion.elapsed/520),route=this.routes.get(motion.edge?.id);
      if(route){
        route.shutter.position.y=.31+Math.sin(t*Math.PI)*.45;
        this.parcel.visible=!motion.edge.repair;
        this.parcel.position.copy(route.curve.getPoint(ease(t)));this.parcel.position.y+=.16;
      }
      for(const [node,mesh]of this.waters){
        const index=NODES.indexOf(node),a=motion.before.water[index],b=motion.next.water[index];
        mesh.visible=a>0||b>0;mesh.position.y=.29+(a+(b-a)*ease(t))/Math.max(1,capacity(this.plan,node))*.14;
        if(this.crops.has(node))this.crops.get(node).scale.y=.2+.8*Math.min(1,(a+(b-a)*ease(t))/Math.max(1,capacity(this.plan,node)));
      }
      this.draw();if(t===1)this.finishMotion();else this.tick();
    });
  }
  finishMotion() {
    this.stop();const motion=this.motion;this.motion=null;
    if(this.parcel)this.parcel.visible=false;
    if(motion){this.update(motion.next,this.selected,this.theme);motion.done?.();}
  }
  cancelMotion() {this.stop();this.motion=null;if(this.parcel)this.parcel.visible=false;}
  stop(){if(this.frame)cancelAnimationFrame(this.frame);this.frame=0;if(this.motion)this.motion.last=0;}
  setActive(value){this.active=Boolean(value);if(!this.active)this.stop();else{this.draw();this.tick();}}
  draw(){if(!this.disposed&&!this.lost&&this.camera)this.renderer.render(this.scene,this.camera);}
  diagnostics(){return {revision:THREE.REVISION,calls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,geometries:this.renderer.info.memory.geometries,textures:this.renderer.info.memory.textures,programs:this.renderer.info.programs?.length,animationPending:Boolean(this.frame)};}
  restore(){this.contextRecovery?.restoreContext();}
  dispose(){this.disposed=true;this.cancelMotion();this.resizeObserver.disconnect();this.reduced.removeEventListener('change',this.motionChanged);this.renderer.domElement.removeEventListener('webglcontextlost',this.contextLost);this.renderer.domElement.removeEventListener('webglcontextrestored',this.contextRestored);this.group.traverse(o=>{if(o.isInstancedMesh)o.dispose();});this.geometry.dispose();this.arrowGeometry.dispose();this.materials.forEach(m=>m.dispose());this.renderer.dispose();this.renderer.domElement.remove();}
}
