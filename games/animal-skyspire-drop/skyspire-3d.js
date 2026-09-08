import * as THREE from './vendor/three/three.module.min.js';

const assetNames={sky:'sky-city-bg-v18.webp',safe:'safe-texture.webp',danger:'hazard-texture.webp',fragile:'fragile-texture.webp',goal:'goal-texture.webp',fur:'fia-fur-v18.webp'};
const imageAssets={}; // Six bounded decoded sources; no renderer or GPU object is cached here.
let assetPromise;
const clamp=THREE.MathUtils.clamp;

// One renderer per live Battle. Geometry/material ownership never escapes this object.
export class Skyspire3D {
  static loadAssets(){
    return assetPromise ||= Promise.all(Object.entries(assetNames).map(([key,file])=>new Promise((resolve,reject)=>{
      const img=new Image();const timer=setTimeout(()=>{img.onload=img.onerror=null;img.src='';reject(new Error(`Skyspire art timed out: ${key}`));},15000);
      img.onload=()=>{clearTimeout(timer);img.onload=img.onerror=null;imageAssets[key]=img;resolve();};
      img.onerror=()=>{clearTimeout(timer);img.onload=img.onerror=null;reject(new Error(`Skyspire art unavailable: ${key}`));};
      img.src=new URL(`../../assets/animal-skyspire-drop/${file}`,import.meta.url).href;
    })));
  }
  constructor(canvas) {
    this.canvas = canvas;
    this.resources=new Set();
    try {
    this.renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:false, powerPreference:'low-power'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.shadowMap.enabled=true;
    this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    this.scene = new THREE.Scene();
    this.textures={};
    for(const key of Object.keys(assetNames)){
      if(!imageAssets[key])throw new Error(`Skyspire art not ready: ${key}`);
      const texture=this.own(new THREE.Texture(imageAssets[key]));texture.colorSpace=THREE.SRGBColorSpace;texture.needsUpdate=true;
      texture.anisotropy=Math.min(4,this.renderer.capabilities.getMaxAnisotropy());
      if(key!=='sky')texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
      this.textures[key]=texture;
    }
    this.skyTexture=this.textures.sky;
    this.scene.background = this.skyTexture;
    this.scene.backgroundIntensity=.64;
    this.scene.fog = new THREE.FogExp2('#406b87', .009);
    this.camera = new THREE.PerspectiveCamera(43, 1, .1, 180);
    this.buildEnvironment();
    this.rings = [];
    this.stageRoot = new THREE.Group(); this.scene.add(this.stageRoot);
    this.scene.add(new THREE.HemisphereLight(0xa2d6ee, 0x151526, 1.15));
    this.sun=new THREE.DirectionalLight(0xffdeb0,3.5);this.scene.add(this.sun,this.sun.target);
    this.sun.castShadow=true;this.sun.shadow.mapSize.set(1024,1024);
    Object.assign(this.sun.shadow.camera,{left:-5,right:5,top:6,bottom:-6,near:.5,far:35});
    this.sun.shadow.bias=-.0005;this.sun.shadow.normalBias=.035;
    const rim = new THREE.DirectionalLight(0x63dfff, 2.5); rim.position.set(6,2,-6); this.scene.add(rim);
    this.sphere = this.own(new THREE.SphereGeometry(1,32,24));
    this.box = this.own(new THREE.BoxGeometry(1,1,1));
    this.gold = this.mat(0xba8034,.78,.3);
    this.dark = this.mat(0x173148,.55,.42);
    this.teal = this.mat(0x36d2c2,.45,.25);
    this.white = this.mat(0xffe9c5,0,.85);
    this.orange = this.mat(0xda5310,0,.78);
    this.night = this.mat(0x16263e,.1,.3);
    this.blue = this.mat(0x329ad4,.25,.5);
    this.shaftTexture=this.own(this.textures.goal.clone());
    this.core = this.own(new THREE.MeshStandardMaterial({color:0xb6c7bd,metalness:.4,roughness:.53,map:this.shaftTexture}));
    this.crystalMaterial=this.own(new THREE.MeshPhysicalMaterial({color:0x167f96,metalness:.48,roughness:.19,clearcoat:1,emissive:0x052b3a,emissiveIntensity:.25}));
    this.glow = this.own(new THREE.MeshBasicMaterial({color:0x9ffff0}));
    this.buildFox(); this.buildAtmosphere(); this.buildEffects();
    this.cameraY = 0; this.lastTime = 0; this.disposed = false;
    this.reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.resize(); canvas.dataset.renderer = 'three-webgl2';
    } catch(error) {this.dispose();throw error;}
  }
  own(resource) { this.resources.add(resource); return resource; }
  buildEnvironment(){
    const room=new THREE.Scene();
    const walls=new THREE.Mesh(new THREE.BoxGeometry(10,10,10),new THREE.MeshBasicMaterial({color:0x446375,side:THREE.BackSide}));room.add(walls);
    for(const [x,y,z,color] of [[-3,3,2,0xffdfae],[3,1,-3,0x70dfff],[0,4,0,0xffffff]]){
      const panel=new THREE.Mesh(new THREE.SphereGeometry(1.4,8,6),new THREE.MeshBasicMaterial({color}));panel.position.set(x,y,z);room.add(panel);
    }
    const generator=new THREE.PMREMGenerator(this.renderer);
    try{const target=this.own(generator.fromScene(room,.04));this.scene.environment=target.texture;}
    finally{room.traverse(o=>{o.geometry?.dispose();o.material?.dispose()});generator.dispose();}
  }
  mat(color,metalness=0,roughness=.6) {return this.own(new THREE.MeshStandardMaterial({color,metalness,roughness}));}
  mesh(geo,mat,parent,x=0,y=0,z=0,sx=1,sy=sx,sz=sx) {
    const m = new THREE.Mesh(geo,mat); m.position.set(x,y,z); m.scale.set(sx,sy,sz); parent.add(m); return m;
  }
  buildFox() {
    this.hero = new THREE.Group(); this.scene.add(this.hero);
    this.fox = new THREE.Group(); this.hero.add(this.fox);
    const amber=this.mat(0xef8123,0,.85),russet=this.mat(0x94351c,0,.9),pink=this.mat(0xdf927d,0,.9);
    this.textures.fur.repeat.set(3,2);
    for(const mat of [amber,this.orange]){mat.color.setHex(mat===amber?0xffe9cd:0xde9f6c);mat.map=this.textures.fur;mat.bumpMap=this.textures.fur;mat.bumpScale=.009;}
    const eyeWhite=this.mat(0xfff6de,0,.23),iris=this.mat(0x167bac,.18,.17),pupil=this.mat(0x071526,.08,.16);
    const leather=this.mat(0x243844,.08,.75);
    const gem=this.own(new THREE.MeshPhysicalMaterial({color:0x35ddec,metalness:.35,roughness:.12,clearcoat:1,emissive:0x0b566e,emissiveIntensity:.4}));
    this.mesh(this.sphere,this.orange,this.fox,0,-.14,0,.23,.3,.2);
    this.mesh(this.sphere,this.white,this.fox,0,-.12,.15,.15,.22,.075);
    this.mesh(this.sphere,amber,this.fox,0,.25,.01,.35,.3,.26);
    // Sculpted tapered ears, cheek fur and comet-tail silhouette; no 2D character billboard.
    const earGeo=this.own(new THREE.ConeGeometry(1,1,4));
    const tuftGeo=this.own(new THREE.ConeGeometry(1,1,5));
    this.paws=[];this.eyeGroups=[];
    for (const side of [-1,1]) {
      const ear=new THREE.Group();ear.position.set(side*.235,.55,0);ear.rotation.z=-side*.19;this.fox.add(ear);
      this.mesh(earGeo,russet,ear,0,0,0,.15,.42,.15);
      this.mesh(earGeo,amber,ear,0,.005,.02,.12,.36,.13);
      this.mesh(earGeo,pink,ear,0,0,.1,.078,.255,.026);
      this.mesh(this.sphere,this.white,this.fox,side*.18,.15,.19,.2,.12,.09).rotation.z=side*.2;
      for(let i=0;i<3;i++){
        const tuft=this.mesh(tuftGeo,this.white,this.fox,side*(.28+i*.029),.17-i*.048,.09,.073,.145,.055);tuft.rotation.z=-side*(1.1+i*.13);
      }
      const eye=new THREE.Group();eye.position.set(side*.137,.3,.23);eye.rotation.y=side*.13;this.fox.add(eye);this.eyeGroups.push(eye);
      this.mesh(this.sphere,russet,eye,0,0,0,.109,.135,.047);
      this.mesh(this.sphere,eyeWhite,eye,0,-.003,.015,.092,.113,.043);
      this.mesh(this.sphere,iris,eye,-side*.015,-.004,.051,.052,.069,.02);
      this.mesh(this.sphere,pupil,eye,-side*.015,-.004,.068,.027,.046,.012);
      this.mesh(this.sphere,this.glow,eye,-.027,.028,.08,.018);
      const brow=this.mesh(this.sphere,russet,this.fox,side*.14,.435,.218,.078,.014,.018);brow.rotation.z=-side*.13;
      const paw=new THREE.Group();paw.position.set(side*.245,-.18,.12);paw.rotation.z=side*.3;this.fox.add(paw);this.paws.push(paw);
      this.mesh(this.sphere,this.orange,paw,0,.025,0,.09,.18,.08);
      this.mesh(this.sphere,leather,paw,0,-.085,.025,.115,.097,.105);
      this.mesh(this.sphere,this.gold,paw,0,-.071,.1,.085,.055,.028);
      this.mesh(this.own(new THREE.OctahedronGeometry(.055)),gem,paw,0,-.065,.134);
      this.mesh(this.sphere,leather,this.fox,side*.13,-.40,.075,.1,.095,.15);
      this.mesh(this.sphere,this.white,this.fox,side*.13,-.43,.18,.075,.045,.06);
    }
    for(let i=0;i<3;i++){const tuft=this.mesh(tuftGeo,amber,this.fox,(i-1)*.065,.53+i*.015,.06,.065,.18,.06);tuft.rotation.z=-.4;}
    this.mesh(this.sphere,this.white,this.fox,0,.115,.264,.12,.065,.11);
    this.mesh(this.sphere,pupil,this.fox,0,.159,.354,.045,.029,.033);
    const smileCurve=new THREE.QuadraticBezierCurve3(new THREE.Vector3(-.06,.101,.324),new THREE.Vector3(0,.06,.353),new THREE.Vector3(.06,.101,.324));
    this.mesh(this.own(new THREE.TubeGeometry(smileCurve,12,.006,5,false)),russet,this.fox);
    this.mesh(this.own(new THREE.TorusGeometry(.197,.054,10,32)),this.blue,this.fox,0,-.026,0).rotation.x=Math.PI/2;
    this.scarf=new THREE.Group();this.fox.add(this.scarf);
    const scarfShape=new THREE.Shape();scarfShape.moveTo(-.16,-.04);scarfShape.bezierCurveTo(-.33,.06,-.51,.01,-.68,.12);scarfShape.lineTo(-.62,-.015);scarfShape.lineTo(-.74,-.065);scarfShape.bezierCurveTo(-.5,-.13,-.34,-.055,-.17,-.15);scarfShape.closePath();
    this.mesh(this.own(new THREE.ExtrudeGeometry(scarfShape,{depth:.022,bevelEnabled:true,bevelSize:.012,bevelThickness:.008,bevelSegments:2,steps:1})),this.blue,this.scarf,0,.04,-.15);
    this.tail=new THREE.Group();this.tail.position.set(.13,-.29,-.12);this.fox.add(this.tail);
    const tailCurve=new THREE.CatmullRomCurve3([new THREE.Vector3(0,0,0),new THREE.Vector3(.28,.02,-.07),new THREE.Vector3(.46,.17,-.06),new THREE.Vector3(.43,.43,0)]);
    const tailGeo=this.own(new THREE.TubeGeometry(tailCurve,24,.13,12,false));
    this.mesh(tailGeo,amber,this.tail);
    this.mesh(this.sphere,this.white,this.tail,.43,.42,0,.10,.15,.12).rotation.z=.2;
    // One instanced draw for fur accents instead of hundreds of independent objects.
    const fur=new THREE.InstancedMesh(tuftGeo,amber,36);this.fox.add(fur);const pose=new THREE.Object3D();
    for(let i=0;i<36;i++){const a=i*2.39996;pose.position.set(Math.cos(a)*.29,.17+Math.sin(i*1.7)*.19,Math.sin(a)*.18-.03);pose.rotation.set(.1,a,-Math.cos(a)*.8);pose.scale.set(.027,.09,.025);pose.updateMatrix();fur.setMatrixAt(i,pose.matrix);}
    // Head/body alone provide a soft readable contact shadow at a bounded cost.
    this.fox.children[0].castShadow=true;this.fox.children[2].castShadow=true;
    // Fresnel-only rim keeps the face legible instead of a milky transparent ball.
    const shellMat=this.own(new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{tint:{value:new THREE.Color(0x5deeff)}},vertexShader:'varying vec3 n;varying vec3 v;void main(){vec4 p=modelViewMatrix*vec4(position,1.);n=normalize(normalMatrix*normal);v=normalize(-p.xyz);gl_Position=projectionMatrix*p;}',fragmentShader:'varying vec3 n;varying vec3 v;uniform vec3 tint;void main(){float f=pow(1.-abs(dot(normalize(n),normalize(v))),3.);gl_FragColor=vec4(tint,.025+f*.48);#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}'}));
    // Shader include directives must begin on a fresh line.
    shellMat.fragmentShader=shellMat.fragmentShader.replace(';#include',';\n#include');
    this.orb=this.mesh(this.sphere,shellMat,this.hero,0,.10,0,.79);
    this.halo=this.mesh(this.own(new THREE.TorusGeometry(.76,.009,6,64)),this.own(this.glow.clone()),this.hero,0,-.37,0);
    const auraMaterial=this.own(new THREE.MeshBasicMaterial({color:0xc290ff,transparent:true,opacity:.7}));
    this.auraMotes=Array.from({length:6},()=>this.mesh(this.sphere,auraMaterial,this.scene,0,0,0,.045));
    this.halo.rotation.x=Math.PI/2;
    this.shadow=this.mesh(this.own(new THREE.CircleGeometry(.52,32)),this.own(new THREE.MeshBasicMaterial({color:0x061b2d,transparent:true,opacity:.3,depthWrite:false})),this.scene);
    this.shadow.rotation.x=-Math.PI/2;
    this.target=this.mesh(this.own(new THREE.TorusGeometry(.35,.02,5,32)),this.glow,this.scene); this.target.rotation.x=Math.PI/2;
  }
  buildAtmosphere() {
    this.atmosphere=new THREE.Group(); this.scene.add(this.atmosphere);
    // Authored distant matte + actual midground ruins. Six instanced draws,
    // replacing the v17 plain floating cones and 32 overlapping cloud spheres.
    const masonry=this.own(new THREE.MeshStandardMaterial({color:0x577483,map:this.textures.goal,metalness:.32,roughness:.8}));
    const batches=[
      [this.own(new THREE.CylinderGeometry(.65,.85,1,8)),masonry,8],
      [this.own(new THREE.ConeGeometry(.72,1,6)),this.crystalMaterial,8],
      [this.own(new THREE.TorusGeometry(.83,.08,6,12)),this.gold,16],
      [this.own(new THREE.OctahedronGeometry(1)),this.crystalMaterial,12],
      [this.own(new THREE.ConeGeometry(.85,1,8)),masonry,8]
    ];
    for(let type=0;type<batches.length;type++){
      const [geo,mat,count]=batches[type],mesh=new THREE.InstancedMesh(geo,mat,count),p=new THREE.Object3D();this.atmosphere.add(mesh);
      for(let i=0;i<count;i++){
        const tower=type===2?Math.floor(i/2):i,side=tower%2?-1:1;
        const x=side*(6.7+(tower%5)*2.3),y=(Math.floor(tower/2)%5)*5-13,z=-6-(tower%3)*6;
        p.rotation.set(0,tower*.4,0);p.scale.setScalar(1);
        if(type===0){p.position.set(x,y,z);p.scale.set(.8,7+(tower%3),.8);}
        if(type===1){p.position.set(x,y+4.8,z);p.scale.set(.8,2.3,.8);}
        if(type===2){p.position.set(x,y+(i%2?2.8:-2.8),z);p.rotation.x=Math.PI/2;}
        if(type===3){p.position.set(x+Math.sin(i)*1.6,y-2,z-1);p.scale.set(.25,.9+(.2*(i%3)),.25);p.rotation.z=side*.2;}
        if(type===4){p.position.set(x,y-(7+tower%3)/2-1.2,z);p.rotation.z=Math.PI;p.scale.set(.8,2.4,.8);}
        p.updateMatrix();mesh.setMatrixAt(i,p.matrix);
      }
    }
    const positions=new Float32Array(120*3);
    for(let i=0;i<120;i++){positions[i*3]=Math.sin(i*12.98)*14;positions[i*3+1]=Math.cos(i*7.23)*22;positions[i*3+2]=-5-Math.abs(Math.sin(i*3.17))*25;}
    const geo=this.own(new THREE.BufferGeometry()); geo.setAttribute('position',new THREE.BufferAttribute(positions,3));
    this.dust=new THREE.Points(geo,this.own(new THREE.PointsMaterial({color:0xffdeb5,size:.042,transparent:true,opacity:.55})));this.atmosphere.add(this.dust);
  }
  ringGeometry() {
    const shape=new THREE.Shape(); shape.absarc(0,0,3.15,0,Math.PI*2,false);
    const hole=new THREE.Path(); hole.absarc(0,0,1.23,0,Math.PI*2,true); shape.holes.push(hole);
    const g=new THREE.ExtrudeGeometry(shape,{depth:.3,bevelEnabled:true,bevelSize:.055,bevelThickness:.055,bevelSegments:3,steps:1,curveSegments:64});
    g.rotateX(-Math.PI/2); g.translate(0,-.3,0); return this.own(g);
  }
  ringMaterial(ring) {
    const uniforms={gap:{value:ring.gap},gapWidth:{value:ring.gapWidth},hazard:{value:ring.hazard},hazardWidth:{value:ring.hazardWidth},hazard2:{value:ring.hazard2??0},hazard2Width:{value:ring.hazard2Width},fragile:{value:ring.fragile?1:0},cracked:{value:0}};
    const m=this.mat(0xffffff,.34,.53);
    const textures=this.textures;
    m.onBeforeCompile=shader=>{
      for(const [name,u] of Object.entries(uniforms)) shader.uniforms['sky_'+name]=u;
      shader.uniforms.skySafe={value:textures.safe};shader.uniforms.skyDanger={value:textures.danger};shader.uniforms.skyFragile={value:textures.fragile};
      shader.vertexShader='varying vec3 skyPosition;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nskyPosition=position;');
      shader.fragmentShader=`varying vec3 skyPosition;
        uniform float sky_gap,sky_gapWidth,sky_hazard,sky_hazardWidth,sky_hazard2,sky_hazard2Width,sky_fragile,sky_cracked;
        uniform sampler2D skySafe,skyDanger,skyFragile;
        float angularDistance(float a,float b){return abs(atan(sin(a-b),cos(a-b)));}
        `+shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        float a=atan(-skyPosition.z,skyPosition.x);
        if(angularDistance(a,sky_gap)<sky_gapWidth*.5) discard;
        bool danger=angularDistance(a,sky_hazard)<sky_hazardWidth*.5 || (sky_hazard2Width>0. && angularDistance(a,sky_hazard2)<sky_hazard2Width*.5);
        float r=length(skyPosition.xz);
        bool rim=r>3.04 || r<1.34;
        vec2 surfaceUV=vec2(a/6.2831853*10.,(r-1.23)/1.92);
        vec3 stone=texture2D(skySafe,surfaceUV).rgb;
        vec3 violet=texture2D(skyDanger,surfaceUV).rgb;
        vec3 glass=texture2D(skyFragile,surfaceUV).rgb;
        float seam=step(.992,cos(a*30.));
        float edgeShade=.52+.48*smoothstep(-.30,-.02,skyPosition.y);
        diffuseColor.rgb=(danger ? violet : (rim ? vec3(.62,.35,.105) : mix(stone,glass,sky_fragile)))*edgeShade*(1.-seam*.26);
        if(sky_cracked>.5 && abs(sin(a*17.+r*6.))<.07) diffuseColor.rgb=vec3(.015,.07,.15);
        `).replace('#include <emissivemap_fragment>',`#include <emissivemap_fragment>
          if(danger)totalEmissiveRadiance+=violet*vec3(.23,.06,.32);
        `);
    };
    return {material:m,uniforms};
  }
  setStage(stage) {
    // Retry replaces only stage-owned resources; shared fox/sky geometry stays bounded.
    for(const m of this.rings) {this.resources.delete(m.material);m.material.dispose();}
    this.stageRoot.clear(); this.rings=[];
    this.geometry ||= this.ringGeometry();
    const length=stage.ringCount*3+2,center=.8-length/2;
    this.shaftTexture.repeat.set(3,length/3);
    const shaft=this.mesh(this.ownStageShaft || (this.ownStageShaft=this.own(new THREE.CylinderGeometry(.67,.67,1,12))),this.core,this.stageRoot,0,center,0,1,length,1);shaft.castShadow=true;
    for(let k=0;k<10;k++){
      const a=k*Math.PI/5;
      this.mesh(this.box,this.gold,this.stageRoot,Math.cos(a)*.68,center,Math.sin(a)*.68,.035,length,.035);
    }
    for(let i=0;i<stage.ringCount;i++){
      const ring=stage.rings[i], group=new THREE.Group(); group.position.y=-i*3;
      const {material,uniforms}=this.ringMaterial(ring);
      this.mesh(this.geometry,material,group).receiveShadow=true;
      const edges=[];
      for(const sign of [-1,1]){
        const a=ring.gap+sign*ring.gapWidth/2;
        const edge=this.mesh(this.box,this.gold,group,Math.cos(a)*2.19,-.14,-Math.sin(a)*2.19,1.92,.31,.055);
        edge.rotation.y=a;edges.push(edge);
      }
      const band=this.mesh(this.ownBand || (this.ownBand=this.own(new THREE.TorusGeometry(.76,.055,6,32))),this.gold,group,0,-.36,0);band.rotation.x=Math.PI/2;
      for(let k=0;k<5;k++){
        const a=k*Math.PI*2/5;
        const sigil=this.mesh(this.box,this.glow,group,Math.cos(a)*.70,-1.25,Math.sin(a)*.70,.09,.18,.04);
        sigil.rotation.y=-a+Math.PI/2;sigil.rotation.z=Math.PI/4;
      }
      const crystal=this.mesh(this.ownCrystal || (this.ownCrystal=this.own(new THREE.OctahedronGeometry(.22))),this.glow,group,0,.7,1.6);
      crystal.visible=ring.crystal;
      this.stageRoot.add(group);this.rings.push({group,material,uniforms,crystal});
    }
    this.goalMaterial ||= this.own(new THREE.MeshStandardMaterial({color:0xffdf92,map:this.textures.goal,metalness:.6,roughness:.35}));
    this.goal=this.mesh(this.ownGoal || (this.ownGoal=this.own(new THREE.CylinderGeometry(3.3,3.5,.6,48))),this.goalMaterial,this.stageRoot,0,-stage.ringCount*3,0);
    this.goal.receiveShadow=true;
    const gateY=-stage.ringCount*3;
    const arch=this.mesh(this.ownArch||(this.ownArch=this.own(new THREE.TorusGeometry(1,.09,8,40,Math.PI))),this.gold,this.stageRoot,0,gateY+.6,-1.4);arch.scale.set(1.1,1.4,1);
    for(const x of [-1.1,1.1])this.mesh(this.box,this.gold,this.stageRoot,x,gateY+.35,-1.4,.16,.5,.18);
    this.cameraY=0; this.lastCurrent=0;this.lastLandings=0;this.lastTime=0;this.lastRotation=0;this.impact=0;this.particles.forEach(p=>p.life=0);
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
    this.renderer.setSize(r.width,r.height,false);this.camera.aspect=r.width/r.height;this.camera.updateProjectionMatrix();
    // Preserve source aspect rather than stretching the authored environment.
    const imageAspect=1.5,scale=this.camera.aspect/imageAspect;
    this.skyTexture.repeat.set(Math.min(1,scale),Math.min(1,1/scale));this.skyTexture.offset.set((1-this.skyTexture.repeat.x)/2,(1-this.skyTexture.repeat.y)/2);
  }
  render(run,ringAngle,hazardWidthAt,aura=false) {
    if(this.disposed)return;
    const dt=Math.min(.05,Math.max(0,run.elapsed-this.lastTime));this.lastTime=run.elapsed;
    if(run.current!==this.lastCurrent||run.landings!==this.lastLandings){this.burst(run);this.impact=1;this.lastCurrent=run.current;this.lastLandings=run.landings;}
    this.impact=Math.max(0,this.impact-dt*5);
    const targetY=run.height-.7;
    this.cameraY+= (targetY-this.cameraY)*(1-Math.exp(-dt*6));
    // Fit width and height independently through perspective, never stretch the canvas.
    const wide=this.camera.aspect>1.6;
    const distance=Math.max(wide?7.4:10.5,8.2/this.camera.aspect);
    this.camera.position.set(0,this.cameraY+distance*(wide?.5:.64),distance);
    this.camera.lookAt(0,this.cameraY-1,0);
    this.sun.position.set(-5,run.height+9,6);this.sun.target.position.set(0,run.height-2,0);
    this.atmosphere.position.y=this.cameraY*.85;
    this.dust.rotation.y=this.reducedMotion?0:run.elapsed*.012;
    for(let i=0;i<this.rings.length;i++){
      const item=this.rings[i],r=run.stage.rings[i];item.group.visible=!r.broken && i>=run.current-1 && i<run.current+7;
      item.group.rotation.y=run.rotation+ringAngle(r);
      item.uniforms.hazardWidth.value=hazardWidthAt(r);item.uniforms.hazard2Width.value=hazardWidthAt(r,true);item.uniforms.cracked.value=r.cracked?1:0;
      item.crystal.visible=r.crystal;item.crystal.rotation.y=run.elapsed;
    }
    this.hero.position.set(0,run.height,2.42);
    const turn=dt>0?clamp(Math.atan2(Math.sin(run.rotation-this.lastRotation),Math.cos(run.rotation-this.lastRotation))/dt,-3,3):0;this.lastRotation=run.rotation;
    const motion=this.reducedMotion?0:1;
    this.fox.rotation.z=motion*(Math.sin(run.elapsed*3)*.035-turn*.06);
    this.fox.rotation.y=motion*turn*.08;
    this.tail.rotation.z=motion*Math.sin(run.elapsed*5)*.10;
    this.scarf.rotation.y=motion*(Math.sin(run.elapsed*6)*.16+clamp(-run.velocity*.035,-.2,.45));
    this.paws.forEach((p,i)=>{p.rotation.x=motion*(-.18+clamp(run.velocity*.055,-.4,.4));});
    const blink=Math.sin(run.elapsed*1.7)> .996?.16:1;this.eyeGroups.forEach(e=>e.scale.y=blink);
    this.halo.rotation.z=this.reducedMotion?0:run.elapsed*.5;
    const stretch=clamp(Math.abs(run.velocity||0)*.008,0,.08)*motion;
    this.hero.scale.set(1.12*(1-stretch*.3+this.impact*.035),1.12*(1+stretch-this.impact*.06),1.12*(1-stretch*.3));
    this.shadow.position.set(0,-run.current*3+.065,2.42);
    this.target.position.set(0,-run.current*3+.072,2.42);
    const ring=run.stage.rings[run.current];
    const local=ring? -Math.PI/2-run.rotation-ringAngle(ring):0;
    const solid=ring&&!ring.broken&&Math.abs(Math.atan2(Math.sin(local-ring.gap),Math.cos(local-ring.gap)))>=ring.gapWidth/2;
    this.target.visible=!run.ended&&solid;
    this.shadow.visible=!run.ended&&solid;
    this.halo.material.color.setHex(run.power?0xffd56a:aura?0xc290ff:0x9ffff0);
    this.auraMotes.forEach((m,i)=>{m.visible=aura;m.position.set(Math.sin(run.elapsed*3+i)*.28,run.height-.45-i*.16,2.42+Math.cos(run.elapsed*3+i)*.15);});
    for(const p of this.particles){if(p.life<=0||this.reducedMotion){p.mesh.visible=false;continue;}p.life-=dt;p.v.y-=dt*6;p.mesh.position.addScaledVector(p.v,dt);p.mesh.rotation.x+=dt*3;p.mesh.scale.setScalar(.09*Math.max(0,p.life/.6));}
    this.renderer.render(this.scene,this.camera);
  }
  stats(){return {geometries:this.renderer.info.memory.geometries,textures:this.renderer.info.memory.textures,drawCalls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,resources:this.resources.size,artAssets:Object.keys(imageAssets).length,reducedMotion:this.reducedMotion};}
  dispose(){if(this.disposed)return;this.disposed=true;this.scene?.traverse(o=>{if(o.isInstancedMesh)o.dispose();});this.scene?.clear();this.sun?.shadow.dispose();for(const r of this.resources)r.dispose();this.resources.clear();this.renderer?.dispose();this.renderer?.forceContextLoss();this.rings=[];this.particles=[];this.canvas.dataset.renderer='released';}
}
