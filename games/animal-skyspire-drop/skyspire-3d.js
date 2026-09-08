import * as THREE from './vendor/three/three.module.min.js';

// One renderer per live Battle. Geometry/material ownership never escapes this object.
export class Skyspire3D {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:false, powerPreference:'low-power'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#091e39');
    this.scene.fog = new THREE.FogExp2('#163651', .022);
    this.camera = new THREE.PerspectiveCamera(43, 1, .1, 180);
    this.resources = new Set();
    this.rings = [];
    this.stageRoot = new THREE.Group(); this.scene.add(this.stageRoot);
    this.scene.add(new THREE.HemisphereLight(0xb6edff, 0x213951, 3.1));
    const sun = new THREE.DirectionalLight(0xffe6bb, 4.2); sun.position.set(-7,12,8); this.scene.add(sun);
    const rim = new THREE.DirectionalLight(0x5acfff, 3); rim.position.set(6,2,-6); this.scene.add(rim);
    this.sphere = this.own(new THREE.SphereGeometry(1,24,16));
    this.box = this.own(new THREE.BoxGeometry(1,1,1));
    this.gold = this.mat(0xeac174,.72,.28);
    this.dark = this.mat(0x173148,.55,.42);
    this.teal = this.mat(0x36d2c2,.45,.25);
    this.white = this.mat(0xfff1d5,.05,.8);
    this.orange = this.mat(0xe98325,.12,.65);
    this.night = this.mat(0x16263e,.1,.3);
    this.blue = this.mat(0x329ad4,.25,.5);
    this.glow = this.own(new THREE.MeshBasicMaterial({color:0x9ffff0}));
    this.buildFox(); this.buildAtmosphere(); this.buildEffects();
    this.cameraY = 0; this.lastTime = 0; this.disposed = false;
    this.resize(); canvas.dataset.renderer = 'three-webgl2';
  }
  own(resource) { this.resources.add(resource); return resource; }
  mat(color,metalness=0,roughness=.6) {return this.own(new THREE.MeshStandardMaterial({color,metalness,roughness}));}
  mesh(geo,mat,parent,x=0,y=0,z=0,sx=1,sy=sx,sz=sx) {
    const m = new THREE.Mesh(geo,mat); m.position.set(x,y,z); m.scale.set(sx,sy,sz); parent.add(m); return m;
  }
  buildFox() {
    this.hero = new THREE.Group(); this.scene.add(this.hero);
    this.fox = new THREE.Group(); this.hero.add(this.fox);
    this.mesh(this.sphere,this.orange,this.fox,0,-.08,0,.21,.25,.18);
    this.mesh(this.sphere,this.orange,this.fox,0,.2,.02,.32,.27,.24);
    for (const side of [-1,1]) {
      const ear = this.mesh(this.own(new THREE.ConeGeometry(.13,.32,3)),this.orange,this.fox,side*.21,.49,0);
      ear.rotation.z = side*-.22;
      this.mesh(this.sphere,this.white,this.fox,side*.14,.12,.19,.15,.10,.09);
      this.mesh(this.sphere,this.night,this.fox,side*.125,.25,.223,.037,.052,.026);
      this.mesh(this.sphere,this.white,this.fox,side*.116,.27,.245,.012);
      this.mesh(this.sphere,this.orange,this.fox,side*.20,-.14,.13,.075,.12,.09);
    }
    this.mesh(this.sphere,this.night,this.fox,0,.14,.288,.048,.033,.033);
    this.mesh(this.own(new THREE.TorusGeometry(.19,.045,8,24)),this.blue,this.fox,0,-.015,0).rotation.x=Math.PI/2;
    this.tail=this.mesh(this.sphere,this.orange,this.fox,.23,-.18,-.13,.14,.15,.33);
    this.tail.rotation.y=.65;
    this.mesh(this.sphere,this.white,this.fox,.36,-.12,-.31,.095,.11,.13);
    const shellMat=this.own(new THREE.MeshPhysicalMaterial({color:0x8eefff,metalness:.15,roughness:.16,transparent:true,opacity:.16,depthWrite:false,clearcoat:1}));
    this.orb=this.mesh(this.sphere,shellMat,this.hero,0,.09,0,.58);
    this.halo=this.mesh(this.own(new THREE.TorusGeometry(.57,.012,6,64)),this.glow,this.hero,0,.09,0);
    this.halo.rotation.x=.3;
    this.shadow=this.mesh(this.own(new THREE.CircleGeometry(.52,32)),this.own(new THREE.MeshBasicMaterial({color:0x061b2d,transparent:true,opacity:.3,depthWrite:false})),this.scene);
    this.shadow.rotation.x=-Math.PI/2;
    this.target=this.mesh(this.own(new THREE.TorusGeometry(.35,.02,5,32)),this.glow,this.scene); this.target.rotation.x=Math.PI/2;
  }
  buildAtmosphere() {
    this.atmosphere=new THREE.Group(); this.scene.add(this.atmosphere);
    const cloudMat=this.own(new THREE.MeshStandardMaterial({color:0xa8c9df,roughness:1,transparent:true,opacity:.18,depthWrite:false}));
    // Fixed pool, not a per-frame emitter. No external HDR, textures or postprocessing buffers.
    for(let i=0;i<32;i++) {
      const a=i*2.39996, r=14+(i%4)*3;
      this.mesh(this.sphere,cloudMat,this.atmosphere,Math.cos(a)*r,(i%8)*4-14,Math.sin(a)*r-9,3+(i%3),.6,1.6);
    }
    for(let i=0;i<14;i++) {
      const a=i*2.39996,r=11+(i%3)*3;
      const island=new THREE.Group(); island.position.set(Math.cos(a)*r,(i%5)*6-12,-8-Math.abs(Math.sin(a)*r));
      this.mesh(this.own(new THREE.ConeGeometry(1.6,4,5)),this.dark,island,0,-2,0).rotation.z=Math.PI;
      this.mesh(this.own(new THREE.CylinderGeometry(1.7,1.3,.35,6)),this.teal,island);
      this.mesh(this.own(new THREE.OctahedronGeometry(.5)),this.glow,island,0,1.3,0);
      this.atmosphere.add(island);
    }
    const positions=new Float32Array(240*3);
    for(let i=0;i<240;i++){positions[i*3]=Math.sin(i*12.98)*25;positions[i*3+1]=Math.cos(i*7.23)*25;positions[i*3+2]=-8-Math.abs(Math.sin(i*3.17))*35;}
    const geo=this.own(new THREE.BufferGeometry()); geo.setAttribute('position',new THREE.BufferAttribute(positions,3));
    this.atmosphere.add(new THREE.Points(geo,this.own(new THREE.PointsMaterial({color:0xa0eeff,size:.055,transparent:true,opacity:.65}))));
  }
  ringGeometry() {
    const shape=new THREE.Shape(); shape.absarc(0,0,3.15,0,Math.PI*2,false);
    const hole=new THREE.Path(); hole.absarc(0,0,1.23,0,Math.PI*2,true); shape.holes.push(hole);
    const g=new THREE.ExtrudeGeometry(shape,{depth:.3,bevelEnabled:true,bevelSize:.055,bevelThickness:.055,bevelSegments:1,steps:1,curveSegments:64});
    g.rotateX(-Math.PI/2); g.translate(0,-.3,0); return this.own(g);
  }
  ringMaterial(ring) {
    const uniforms={gap:{value:ring.gap},gapWidth:{value:ring.gapWidth},hazard:{value:ring.hazard},hazardWidth:{value:ring.hazardWidth},hazard2:{value:ring.hazard2??0},hazard2Width:{value:ring.hazard2Width},fragile:{value:ring.fragile?1:0},cracked:{value:0}};
    const m=this.mat(0x22caba,.45,.32);
    m.onBeforeCompile=shader=>{
      for(const [name,u] of Object.entries(uniforms)) shader.uniforms['sky_'+name]=u;
      shader.vertexShader='varying vec3 skyPosition;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nskyPosition=position;');
      shader.fragmentShader=`varying vec3 skyPosition;
        uniform float sky_gap,sky_gapWidth,sky_hazard,sky_hazardWidth,sky_hazard2,sky_hazard2Width,sky_fragile,sky_cracked;
        float angularDistance(float a,float b){return abs(atan(sin(a-b),cos(a-b)));}
        `+shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        float a=atan(-skyPosition.z,skyPosition.x);
        if(angularDistance(a,sky_gap)<sky_gapWidth*.5) discard;
        bool danger=angularDistance(a,sky_hazard)<sky_hazardWidth*.5 || (sky_hazard2Width>0. && angularDistance(a,sky_hazard2)<sky_hazard2Width*.5);
        float r=length(skyPosition.xz);
        bool rim=r>3.04 || r<1.34;
        float seam=step(.965,cos(a*24.));
        vec3 stone=mix(vec3(.035,.48,.43),vec3(.18,.79,.82),sky_fragile);
        vec3 violet=vec3(.47,.035,.39);
        diffuseColor.rgb = danger ? violet : (rim ? vec3(.83,.56,.20) : stone*(1.-seam*.20));
        if(danger && step(.87,sin(a*38.+r*14.))>.5) diffuseColor.rgb=vec3(1.,.32,.61);
        if(sky_cracked>.5 && abs(sin(a*17.+r*6.))<.07) diffuseColor.rgb=vec3(.015,.07,.15);
        `);
    };
    return {material:m,uniforms};
  }
  setStage(stage) {
    // Retry replaces only stage-owned resources; shared fox/sky geometry stays bounded.
    for(const m of this.rings) {this.resources.delete(m.material);m.material.dispose();}
    this.stageRoot.clear(); this.rings=[];
    this.geometry ||= this.ringGeometry();
    const shaft=this.mesh(this.ownStageShaft || (this.ownStageShaft=this.own(new THREE.CylinderGeometry(.83,.83,1,12))),this.dark,this.stageRoot,0,-stage.ringCount*1.5,0,1,stage.ringCount*3+9,1);
    for(let i=0;i<stage.ringCount;i++){
      const ring=stage.rings[i], group=new THREE.Group(); group.position.y=-i*3;
      const {material,uniforms}=this.ringMaterial(ring);
      this.mesh(this.geometry,material,group);
      const edges=[];
      for(const sign of [-1,1]){
        const a=ring.gap+sign*ring.gapWidth/2;
        const edge=this.mesh(this.box,this.gold,group,Math.cos(a)*2.19,-.14,-Math.sin(a)*2.19,1.92,.31,.055);
        edge.rotation.y=a;edges.push(edge);
      }
      const band=this.mesh(this.ownBand || (this.ownBand=this.own(new THREE.TorusGeometry(.89,.055,6,24))),this.gold,group,0,-.36,0);band.rotation.x=Math.PI/2;
      const crystal=this.mesh(this.ownCrystal || (this.ownCrystal=this.own(new THREE.OctahedronGeometry(.22))),this.glow,group,0,.7,1.6);
      crystal.visible=ring.crystal;
      this.stageRoot.add(group);this.rings.push({group,material,uniforms,crystal});
    }
    this.goal=this.mesh(this.ownGoal || (this.ownGoal=this.own(new THREE.CylinderGeometry(3.3,3.5,.6,48))),this.gold,this.stageRoot,0,-stage.ringCount*3,0);
    this.cameraY=0; this.lastCurrent=0;this.lastLandings=0;this.lastTime=0;this.particles.forEach(p=>p.life=0);
  }
  buildEffects() {
    this.particles=[];
    for(let i=0;i<36;i++) {const mesh=this.mesh(this.box,this.gold,this.scene,0,0,0,.055);mesh.visible=false;this.particles.push({mesh,life:0,v:new THREE.Vector3()});}
  }
  burst(run) {
    for(let i=0;i<18;i++){const p=this.particles[(this.particleCursor||0)%this.particles.length];this.particleCursor=(this.particleCursor||0)+1;
      p.mesh.position.set(0,run.height,2.42); const a=i*2.4;
      p.v.set(Math.cos(a)*2,1+(i%3)*.7,Math.sin(a)*2);p.life=.6;p.mesh.visible=true;}
  }
  resize(){const r=this.canvas.getBoundingClientRect();if(r.width<1||r.height<1)return;
    this.renderer.setSize(r.width,r.height,false);this.camera.aspect=r.width/r.height;this.camera.updateProjectionMatrix();}
  render(run,ringAngle,hazardWidthAt) {
    if(this.disposed)return;
    const dt=Math.min(.05,Math.max(0,run.elapsed-this.lastTime));this.lastTime=run.elapsed;
    if(run.current!==this.lastCurrent||run.landings!==this.lastLandings){this.burst(run);this.lastCurrent=run.current;this.lastLandings=run.landings;}
    const targetY=run.height-.7;
    this.cameraY+= (targetY-this.cameraY)*(1-Math.exp(-dt*6));
    // Fit width and height independently through perspective, never stretch the canvas.
    const distance=Math.max(10.5,8.2/this.camera.aspect);
    this.camera.position.set(0,this.cameraY+distance*.64,distance);
    this.camera.lookAt(0,this.cameraY-1,0);
    this.atmosphere.position.y=this.cameraY*.85;
    for(let i=0;i<this.rings.length;i++){
      const item=this.rings[i],r=run.stage.rings[i];item.group.visible=!r.broken && i>=run.current-1 && i<run.current+7;
      item.group.rotation.y=run.rotation+ringAngle(r);
      item.uniforms.hazardWidth.value=hazardWidthAt(r);item.uniforms.hazard2Width.value=hazardWidthAt(r,true);item.uniforms.cracked.value=r.cracked?1:0;
      item.crystal.visible=r.crystal;item.crystal.rotation.y=run.elapsed;
    }
    this.hero.position.set(0,run.height,2.42);
    this.fox.rotation.z=Math.sin(run.elapsed*3)*.055;
    this.tail.rotation.x=Math.sin(run.elapsed*5)*.1;
    this.halo.rotation.y=run.elapsed*.5;
    const stretch=THREE.MathUtils.clamp(Math.abs(run.velocity||0)*.013,0,.14);
    this.hero.scale.set(1-stretch*.3,1+stretch,1-stretch*.3);
    this.shadow.position.set(0,-run.current*3+.065,2.42);
    this.target.position.set(0,-run.current*3+.072,2.42);
    this.target.visible=!run.ended;
    this.shadow.visible=!run.ended;
    this.halo.material.color.setHex(run.power?0xffd56a:0x9ffff0);
    for(const p of this.particles){if(p.life<=0){p.mesh.visible=false;continue;}p.life-=dt;p.v.y-=dt*6;p.mesh.position.addScaledVector(p.v,dt);p.mesh.rotation.x+=dt*3;p.mesh.scale.setScalar(.09*Math.max(0,p.life/.6));}
    this.renderer.render(this.scene,this.camera);
  }
  stats(){return {geometries:this.renderer.info.memory.geometries,textures:this.renderer.info.memory.textures,drawCalls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,resources:this.resources.size};}
  dispose(){if(this.disposed)return;this.disposed=true;this.scene.clear();for(const r of this.resources)r.dispose();this.resources.clear();this.renderer.dispose();this.renderer.forceContextLoss();this.rings=[];this.particles=[];this.canvas.dataset.renderer='released';}
}
