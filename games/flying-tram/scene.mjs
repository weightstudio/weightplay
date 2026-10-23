import * as THREE from './vendor/three/three.module.min.js';
import {padX} from './flight-model.mjs';

const PALETTES = {sunrise:[0x197498,0xffc05c], mint:[0x167f70,0xb8ffbc], midnight:[0x494b94,0xec94ff]};
export class TramScene {
  constructor(canvas) {
    this.canvas = canvas; this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:false, powerPreference:'low-power'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.6)); this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor(0x8eb6bc); this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.scene = new THREE.Scene(); this.scene.fog = new THREE.Fog(0x8eb6bc,35,90);
    this.camera = new THREE.OrthographicCamera(-12,12,10,-10,.1,150);
    this.boxGeo = new THREE.BoxGeometry(1,1,1); this.materials = new Map();
    this.scene.add(new THREE.HemisphereLight(0xffe4c1,0x34536f,2.4));
    const sun = new THREE.DirectionalLight(0xffe0b0,3.1); sun.position.set(-7,16,12); sun.castShadow=true;
    sun.shadow.mapSize.set(512,512); Object.assign(sun.shadow.camera,{left:-18,right:18,top:14,bottom:-12}); sun.shadow.normalBias=.06;
    this.scene.add(sun);
    this.city = new THREE.Group(); this.scene.add(this.city); this.buildCity();
    this.world = new THREE.Group(); this.scene.add(this.world);
    this.tram = new THREE.Group(); this.scene.add(this.tram); this.buildTram();
    this.particles = []; this.rings = []; this.gates = []; this.time=0; this.impact=0;this.frames=0;this.landingAge=1;
    this.resizeObserver=new ResizeObserver(()=>this.resize()); this.resizeObserver.observe(canvas);
    this.reset(null); this.resize();
  }
  material(color, glow=false) {
    const key=`${color}/${glow}`;
    if(!this.materials.has(key)) this.materials.set(key,new THREE.MeshStandardMaterial({color,roughness:.72,metalness:.1,emissive:glow?color:0,emissiveIntensity:glow?.65:0}));
    return this.materials.get(key);
  }
  box(parent, x,y,z, sx,sy,sz, color, glow=false) {
    const node=new THREE.Mesh(this.boxGeo,this.material(color,glow));
    node.position.set(x,y,z); node.scale.set(sx,sy,sz); parent.add(node); return node;
  }
  buildCity() {
    const matrix=new THREE.Matrix4(), quat=new THREE.Quaternion(), pos=new THREE.Vector3(), scale=new THREE.Vector3();
    const buildings=new THREE.InstancedMesh(this.boxGeo,this.material(0x406d83),44);
    const windows=new THREE.InstancedMesh(this.boxGeo,this.material(0xffcb87,true),264);
    let w=0;
    for(let i=0;i<44;i++) {
      const x=(i%22-11)*3.4, z=-8-Math.floor(i/22)*14, h=3+(i*17%13)*.8;
      pos.set(x,-8+h/2,z);scale.set(2.3,h,3);matrix.compose(pos,quat,scale); buildings.setMatrixAt(i,matrix);
      for(let j=0;j<6;j++) {pos.set(x+((j%2)-.5)*.85,-5+Math.floor(j/2)*1.3,z+1.52);scale.set(.32,.56,.04);matrix.compose(pos,quat,scale);windows.setMatrixAt(w++,matrix);}
      if(i%4===0)this.box(this.city,x,-8+h+.35,z,2.5,.7,3.3,0x70a1a7);
    }
    this.city.add(buildings,windows);
    for(let i=0;i<6;i++) {
      const cloud=new THREE.Group();cloud.position.set((i-2.5)*8,3+(i%3)*1.6,-18-(i%2)*8);
      this.box(cloud,0,0,0,4,.65,1.7,0xf5e3cc);this.box(cloud,-.6,.45,0,2,.5,1.7,0xf5e3cc);
      this.city.add(cloud);
    }
    const sunGeo = new THREE.SphereGeometry(3.5,16,12); this.sunGeo=sunGeo;
    const sun=new THREE.Mesh(sunGeo,new THREE.MeshBasicMaterial({color:0xffdca0}));this.sunMaterial=sun.material;
    sun.position.set(2,3,-40);this.city.add(sun);
    this.box(this.city,0,-12,0,160,2,70,0x4b718b);
  }
  buildTram() {
    const g=this.tram;
    this.body=this.box(g,0,-.06,0,3.3,.66,1.52,0x197498);
    this.body.castShadow=true;
    this.trim=this.box(g,0,.37,0,3.4,.18,1.59,0xffc05c);
    this.box(g,0,-.5,0,2.9,.24,1.3,0x18364c);
    this.box(g,0,.85,-.58,2.9,1.02,.18,0x174762);
    for(const x of [-1.43,-.48,.48,1.43])this.box(g,x,.87,0,.13,1.05,1.43,0xffc05c);
    for(const x of [-.97,0,.97])this.box(g,x,.88,-.72,.74,.69,.06,0x72cdd6,true);
    this.roof=this.box(g,0,1.45,0,3.5,.23,1.7,0x197498);
    this.box(g,0,1.61,0,2.7,.1,1.3,0xffc05c);
    this.box(g,-.85,1.84,0,.18,.45,.18,0x233d55);this.box(g,-.55,2.04,0,.8,.12,.16,0xffc05c);
    for(const x of [-1.8,1.8]) {
      this.box(g,x,-.17,0,.3,.52,1.25,0xffc05c);
      this.box(g,x,.05,.49,.09,.22,.22,0xfff4bf,true);
      for(const z of [-.57,.57])this.box(g,x*.69,-.67,z,.57,.25,.25,0x345367);
    }
    // Fia: fox ears, white muzzle, oversized paws, lightning cheek and scarf.
    const fox=new THREE.Group();fox.position.set(.55,.49,.45);g.add(fox);this.fox=fox;
    this.box(fox,0,.16,0,.55,.49,.38,0xd37c32);
    this.box(fox,0,.63,0,.72,.61,.48,0xf4ad57);
    for(const x of [-.25,.25]) {this.box(fox,x,1.01,0,.22,.32,.34,0xeaa04b);this.box(fox,x,1.03,.18,.12,.18,.04,0x814f61);}
    this.box(fox,.12,.51,.31,.47,.22,.23,0xffebce);this.box(fox,.22,.55,.45,.17,.13,.09,0x193748);
    for(const x of [-.17,.2])this.box(fox,x,.71,.255,.1,.14,.035,0x18364c);
    this.box(fox,-.29,.58,.26,.13,.09,.045,0xffe1a3);this.box(fox,-.24,.51,.26,.13,.08,.045,0xffe1a3);
    this.box(fox,0,.32,.13,.64,.13,.45,0x47ced0);
    const scarf=this.box(fox,-.48,.28,.06,.55,.15,.18,0x47ced0);scarf.rotation.z=-.25;
    this.box(fox,-.32,.05,.33,.27,.2,.29,0xffddb4);this.box(fox,.34,.05,.33,.27,.2,.29,0xffddb4);
    // Bubble tea remains visible in the front window, with liquid and pearls.
    this.cup=new THREE.Group();this.cup.position.set(-.74,.54,.64);g.add(this.cup);
    this.box(this.cup,0,.19,0,.34,.45,.3,0xf5d69a);
    this.tea=this.box(this.cup,0,.1,.16,.31,.24,.03,0xa86541);
    this.box(this.cup,0,.44,0,.4,.06,.35,0xf6f0dc);this.box(this.cup,.05,.65,0,.045,.42,.045,0xe36d68);
    for(let i=0;i<3;i++)this.box(this.cup,-.1+i*.1,-.005,.18,.06,.06,.025,0x49314c);
    this.jets=[];
    for(const x of [-1.05,1.05]) {
      this.box(g,x,-.68,0,.5,.24,.58,0x35536e);
      const jet=this.box(g,x,-1.05,0,.28,.65,.32,0x6df4eb,true);this.jets.push(jet);
    }
    this.shadow=this.box(this.scene,0,.48,.1,3.1,.012,1.4,0x345b69);
  }
  livery(id) {
    const colors=PALETTES[id]||PALETTES.sunrise;
    this.body.material=this.material(colors[0]);this.roof.material=this.material(colors[0]);this.trim.material=this.material(colors[1]);
  }
  pad(x, departure=false) {
    const g=new THREE.Group();g.position.x=x;this.world.add(g);
    this.box(g,0,-3,0,5.3,6,4.4,0x335b6f);
    const top=this.box(g,0,.25,0,5.6,.4,4.7,0x678c93);top.receiveShadow=true;
    this.box(g,0,.46,0,4.8,.04,2.3,0x284e60);
    for(const z of [-1.35,1.35])this.box(g,0,.5,z,5.1,.08,.1,departure?0xffc36c:0x78ffcc,true);
    for(const x of [-2.3,2.3])for(const z of [-1.7,1.7]) {this.box(g,x,.82,z,.16,.75,.16,0xffc05c);this.box(g,x,1.26,z,.25,.18,.25,0x78ffcc,true);}
    for(const x of [-1.3,0,1.3])this.box(g,x,.49,0,.48,.04,1.35,0xf7dfac);
    return g;
  }
  reset(flight) {
    this.clearEffects(); this.world.clear();this.rings=[];this.gates=[];this.thermal=null;
    this.departure=this.pad(0,true);this.arrival=this.pad(55);
    if(!flight)return;
    flight.pickups.forEach(r=>{
      const g=new THREE.Group();g.position.set((r.at-flight.progress)*60,r.y,0);this.world.add(g);
      for(let i=0;i<8;i++) {const a=i*Math.PI/4; const b=this.box(g,Math.cos(a)*.95,Math.sin(a)*.95,0,.72,.14,.18,0xffd47a,true);b.rotation.z=a+Math.PI/2;}
      this.rings.push(g);
    });
    flight.gates.forEach(h=>{
      const g=new THREE.Group();g.position.set(h.at*60,0,0);this.world.add(g);
      const low=h.lane==='low', center=low?2.3:7.8;
      this.box(g,0,center,0,.55,low?3:3.4,2.2,0x284957);
      for(let i=0;i<4;i++)this.box(g,0,center-1.1+i*.7,1.14,.59,.25,.08,0xff9d5c,true);
      this.box(g,0,low?4.2:5.9,0,.8,.12,2.45,0xffa65b,true);
      this.gates.push(g);
    });
    if(flight.thermal) {
      this.thermal=new THREE.Group();this.world.add(this.thermal);
      const color=flight.thermal[2]>0?0x7af1cb:0x90b9fa;
      for(let i=0;i<8;i++) {const arrow=this.box(this.thermal,(i%2)*1.6-.8,1+i*.9,0,.13,.45,.13,color,true);arrow.rotation.z=flight.thermal[2]>0?-.4:.4;}
    }
  }
  event(event) {
    if(event.type==='land')this.landingAge=0;
    if(this.reduced)return;
    this.impact=event.type==='hit'?.18:0;
    const count=event.type==='land'?22:event.type==='hit'?12:9;
    const color=event.type==='hit'?0xffa66c:event.type==='land'?0x78f8cf:0xffd06c;
    for(let i=0;i<count&&this.particles.length<48;i++) {
      const p=this.box(this.scene,event.x||0,event.y||2,.8,.09,.09,.09,color,true);
      this.particles.push({node:p,life:.65+(i%4)*.12,vx:Math.sin(i*2.4)*3,vy:1.2+(i%4)*.7,vz:Math.cos(i*2.4)*1.2});
    }
  }
  clearEffects() {for(const p of this.particles)this.scene.remove(p.node);this.particles=[];this.impact=0;this.landingAge=1;}
  resize() {
    const rect=this.canvas.getBoundingClientRect();if(rect.width<1||rect.height<1)return;
    this.renderer.setSize(rect.width,rect.height,false);
    const aspect=rect.width/rect.height;
    const height=this.garage?5.6:aspect>1.4?11.5:aspect>.85?15:21;
    const width=height*aspect;
    this.camera.left=-width/2;this.camera.right=width/2;this.camera.top=height/2;this.camera.bottom=-height/2;
    const focus=this.garage?new THREE.Vector3(0,2.3,0):new THREE.Vector3(aspect>1.4?3:1.5,aspect>1.4?4.5:5.8,0);
    this.camera.position.copy(focus).add(new THREE.Vector3(3,6,24));this.camera.lookAt(focus);this.camera.updateProjectionMatrix();
  }
  setGarage(value){this.garage=value;this.world.visible=!value;this.city.visible=!value;this.shadow.visible=!value;this.resize();}
  render(s, dt=0, frozen=false) {
    if(!s)s={y:1.2,angle:0,phase:'ready',charge:0,progress:0,jet:0,spill:0,pickups:[],gates:[]};
    if(!frozen)this.time+=dt;
    this.tram.position.set(0,this.garage?1.8:s.y,0);
    this.tram.rotation.set(0,this.garage?-.18:0,this.garage?0:-s.angle);
    if(!frozen)this.landingAge=Math.min(1,this.landingAge+dt);
    const compression=this.reduced||this.garage?0:s.phase==='ready'?s.charge*.07:this.landingAge<.4?Math.sin(this.landingAge/.4*Math.PI)*.12:0;
    this.tram.scale.y=1-compression;
    this.tea.scale.y=Math.max(.1,1-s.spill/110);this.cup.rotation.z=this.garage?0:Math.sin(this.time*5)*Math.min(.17,s.spill/200);
    this.fox.rotation.z=this.garage||this.reduced?0:Math.sin(this.time*3)*.025;
    this.jets.forEach((jet,i)=>{jet.visible=!this.garage&&s.jet>.05;jet.scale.y=(.1+s.jet*.9)*(this.reduced?1:1+Math.sin(this.time*35+i)*.14);});
    this.shadow.visible=!this.garage&&s.y<4.5;this.shadow.scale.x=3.1+Math.max(0,s.y-1.2)*.2;
    if(!this.garage){
      this.departure.position.x=-s.progress*60;this.arrival.position.x=padX(s);
      this.city.position.x=-s.progress*7;
      this.rings.forEach((g,i)=>{g.position.x=(s.pickups[i].at-s.progress)*60;g.visible=!s.pickups[i].collected&&g.position.x>-8;g.rotation.y=this.reduced?0:Math.sin(this.time*1.3)*.15;});
      this.gates.forEach((g,i)=>{g.position.x=(s.gates[i].at-s.progress)*60;g.visible=g.position.x>-10&&g.position.x<30;});
      if(this.thermal){this.thermal.position.x=((s.thermal[0]+s.thermal[1])/2-s.progress)*60;this.thermal.position.y=this.reduced?0:Math.sin(this.time*3)*.3;}
    }
    if(!frozen) {
      this.impact=Math.max(0,this.impact-dt);
      if(this.impact>0)this.tram.position.x=Math.sin(this.time*95)*this.impact*.6;
      for(let i=this.particles.length-1;i>=0;i--){const p=this.particles[i];p.life-=dt;p.node.position.x+=p.vx*dt;p.node.position.y+=p.vy*dt;p.node.position.z+=p.vz*dt;p.vy-=5*dt;p.node.scale.setScalar(Math.max(.01,Math.min(.12,p.life*.2)));if(p.life<=0){this.scene.remove(p.node);this.particles.splice(i,1);}}
    }
    this.renderer.render(this.scene,this.camera);
    if(++this.frames%60===0)this.canvas.dataset.renderStats=JSON.stringify(this.stats());
  }
  project(x,y){const p=new THREE.Vector3(x,y,.8).project(this.camera);return {x:(p.x+1)/2,y:(1-p.y)/2};}
  stats(){const i=this.renderer.info;return {calls:i.render.calls,triangles:i.render.triangles,geometries:i.memory.geometries,textures:i.memory.textures,particles:this.particles.length};}
  dispose(){this.resizeObserver.disconnect();this.clearEffects();this.boxGeo.dispose();this.sunGeo.dispose();this.sunMaterial.dispose();for(const m of this.materials.values())m.dispose();this.renderer.dispose();}
}
