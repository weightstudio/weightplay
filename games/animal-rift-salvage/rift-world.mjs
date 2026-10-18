import * as T from './vendor/three/three.module.min.js';

// Geometry and animation are presentation only. The game owns all outcomes.
const TAU = Math.PI * 2;
export const CHAPTER_COLORS = ['#54ead4', '#ffbd68', '#64c6ff', '#cf9dff', '#ff9277', '#edbbff'];
const COLORS = {ready: 0x65ffe0, near: 0xffc557, large: 0xf58187, shield: 0xbc91ff};
const ease = t => 1 - (1 - t) ** 3;

export class RiftWorld {
  constructor(canvas, {onLost, onRestored}) {
    this.canvas = canvas;
    this.renderer = new T.WebGLRenderer({canvas, antialias:true, alpha:false, powerPreference:'high-performance'});
    this.renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1));
    this.renderer.outputColorSpace = T.SRGBColorSpace;
    this.renderer.toneMapping = T.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.scene = new T.Scene();
    this.scene.background = new T.Color('#09172a');
    this.scene.fog = new T.FogExp2('#09172a', .00036);
    this.camera = new T.OrthographicCamera(-600,600,600,-600,1,5000);
    this.camera.position.set(0,1150,720);
    this.camera.lookAt(0,0,0);
    this.ray = new T.Raycaster();
    this.ground = new T.Plane(new T.Vector3(0,1,0),0);
    this.point = new T.Vector3();
    this.pointer = new T.Vector2();
    this.matrix = new T.Object3D();
    this.models = new Map();
    this.geometries = new Set();
    this.materials = new Set();
    this.reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    this.material = this.mat({vertexColors:true, roughness:.72, metalness:.22});
    this.floorMaterial = this.mat({vertexColors:true, roughness:.82, metalness:.32});
    this.glow = this.mat({color:0x71fbe4, emissive:0x3be9ce, emissiveIntensity:1.4, roughness:.4});
    this.scene.add(new T.HemisphereLight(0xcceeff,0x18283e,1.05));
    const key = new T.DirectionalLight(0xffe6bb,3.2);key.position.set(-400,950,600);this.scene.add(key);
    const rim = new T.DirectionalLight(0x60bfff,2.4);rim.position.set(600,400,-550);this.scene.add(rim);
    this.staticGroup = new T.Group();this.scene.add(this.staticGroup);
    this.dynamic = new T.Group();this.scene.add(this.dynamic);
    this.objects = new Map();this.proxies = [];this.particles = [];this.shots = [];
    this.buildStation();this.buildModels();this.buildPlayer();
    this.effectMesh = new T.InstancedMesh(this.geo(new T.BoxGeometry(1,1,1)),this.glow,96);
    this.effectMesh.count=0;this.effectMesh.frustumCulled=false;this.scene.add(this.effectMesh);
    this.shotMesh = new T.InstancedMesh(this.geo(new T.BoxGeometry(13,13,24)),this.mat({color:0xffe4a1,toneMapped:false,depthTest:false},T.MeshBasicMaterial),48);
    this.shotMesh.count=0;this.shotMesh.frustumCulled=false;this.shotMesh.renderOrder=5;this.scene.add(this.shotMesh);
    this.shotOutline=new T.InstancedMesh(this.geo(new T.BoxGeometry(21,19,32)),this.mat({color:0xa63647,toneMapped:false,depthTest:false},T.MeshBasicMaterial),48);
    this.shotOutline.count=0;this.shotOutline.frustumCulled=false;this.shotOutline.renderOrder=4;this.scene.add(this.shotOutline);
    this.aimMesh=new T.InstancedMesh(this.geo(new T.BoxGeometry(1,1,1)),this.mat({color:0xffb55c,toneMapped:false,transparent:true,opacity:.7,depthTest:false,depthWrite:false},T.MeshBasicMaterial),192);
    this.aimMesh.count=0;this.aimMesh.frustumCulled=false;this.aimMesh.renderOrder=3;this.scene.add(this.aimMesh);
    this.markerGeo = this.geo(new T.RingGeometry(.88,1,8));this.markerGeo.rotateX(-Math.PI/2);
    this.markers = Object.fromEntries(Object.entries(COLORS).map(([state,color])=>{
      const mesh=new T.InstancedMesh(this.markerGeo,this.mat({color,side:T.DoubleSide,toneMapped:false},T.MeshBasicMaterial),90);
      mesh.count=0;mesh.frustumCulled=false;this.scene.add(mesh);return [state,mesh];
    }));
    this.target = new T.Mesh(this.markerGeo,this.glow);this.target.scale.set(19,1,19);this.scene.add(this.target);
    const shadowCanvas=document.createElement('canvas');shadowCanvas.width=shadowCanvas.height=64;
    const shadowContext=shadowCanvas.getContext('2d'),gradient=shadowContext.createRadialGradient(32,32,2,32,32,32);
    gradient.addColorStop(0,'rgba(0,0,0,.65)');gradient.addColorStop(.55,'rgba(0,0,0,.35)');gradient.addColorStop(1,'rgba(0,0,0,0)');shadowContext.fillStyle=gradient;shadowContext.fillRect(0,0,64,64);
    this.shadowTexture=new T.CanvasTexture(shadowCanvas);
    const shadowGeo=this.geo(new T.PlaneGeometry(1,1));shadowGeo.rotateX(-Math.PI/2);
    this.shadows=new T.InstancedMesh(shadowGeo,this.mat({map:this.shadowTexture,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1},T.MeshBasicMaterial),96);this.shadows.frustumCulled=false;this.scene.add(this.shadows);
    this.wakeMesh=new T.InstancedMesh(this.geo(new T.BoxGeometry(5,2,5)),this.mat({color:0xffdc87,toneMapped:false},T.MeshBasicMaterial),22);this.wakeMesh.frustumCulled=false;this.wakeMesh.count=0;this.scene.add(this.wakeMesh);
    this.routeGeometry=this.geo(new T.BufferGeometry());this.routeGeometry.setAttribute('position',new T.BufferAttribute(new Float32Array(9),3));
    this.route=new T.Line(this.routeGeometry,this.mat({color:0xa5fff0,transparent:true,opacity:.62},T.LineBasicMaterial));this.scene.add(this.route);
    this.onLost=e=>{e.preventDefault();this.lost=true;onLost?.();};
    this.onRestored=()=>{this.lost=false;onRestored?.();};
    canvas.addEventListener('webglcontextlost',this.onLost);
    canvas.addEventListener('webglcontextrestored',this.onRestored);
    canvas.dataset.renderer='three-webgl2';this.resize();
  }
  mat(options,Class=T.MeshStandardMaterial){const m=new Class(options);this.materials.add(m);return m;}
  geo(g){this.geometries.add(g);return g;}
  // Bake authored cuboids into one colored mesh instead of one draw call per block.
  boxes(parts){
    const p=[],n=[],c=[];
    for(const [x,y,z,w,h,d,color,angle=0] of parts){
      const g=new T.BoxGeometry(w,h,d).toNonIndexed();g.rotateY(angle);g.translate(x,y,z);
      p.push(...g.attributes.position.array);n.push(...g.attributes.normal.array);
      const rgb=new T.Color(color);for(let i=0;i<g.attributes.position.count;i++)c.push(rgb.r,rgb.g,rgb.b);g.dispose();
    }
    const g=this.geo(new T.BufferGeometry());g.setAttribute('position',new T.Float32BufferAttribute(p,3));
    g.setAttribute('normal',new T.Float32BufferAttribute(n,3));g.setAttribute('color',new T.Float32BufferAttribute(c,3));g.computeBoundingSphere();return g;
  }
  buildStation(){
    const deck=[],trim=[],machinery=[];
    for(let x=-480;x<=480;x+=60)for(let z=-480;z<=480;z+=60){
      if(Math.hypot(x,z)>465)continue;
      const shade=((x+z)/60)%3===0?'#254657':'#1c3648';
      deck.push([x,-19,z,58,28,58,shade]);
      if(Math.abs(x)<35||Math.abs(z)<35)trim.push([x,-3,z,26,1,2,'#53737a']);
    }
    // The stepped floating foundation remains subordinate to the playable deck.
    for(let i=0;i<40;i++){
      const a=i/40*TAU,x=Math.sin(a)*480,z=Math.cos(a)*480;
      deck.push([x,-52,z,73,54,60,'#132737',-a]);
      trim.push([x,-7,z,55,7,18,i%5===0?'#d3a969':'#416270',-a]);
      if(i%2===0)trim.push([x,0,z,22,3,6,'#76c7be',-a]);
      if(i%5===0){machinery.push([x,-100,z,42,72,48,'#172c41',-a],[x,-137,z,24,10,26,'#51bebf',-a]);}
    }
    for(const side of [-1,1]){
      for(let k=0;k<3;k++){
        const x=side*(530+k*80),z=-230+k*160;
        machinery.push([x,-65,z,95,65,140,'#1a2f44'],[x,-28,z,99,10,146,'#8f794f'],[x,12,z,61,69,85,'#304b60'],[x,53,z,65,13,90,'#466274'],[x,34,z+44,32,12,2,'#67d8d0']);
      }
      const x=side*405;
      machinery.push([x,35,-490,62,118,65,'#21394d'],[x,96,-490,78,12,82,'#ad935e'],[x,145,-490,36,88,40,'#314c61'],[x,193,-490,60,10,65,'#b5a46e'],[x,226,-490,25,60,28,'#4b7080']);
      machinery.push([x-side*75,198,-490,180,22,30,'#997d4c'],[x-side*160,176,-490,20,62,20,'#35526a']);
    }
    this.staticGroup.add(new T.Mesh(this.boxes(deck),this.floorMaterial),new T.Mesh(this.boxes(trim),this.material),new T.Mesh(this.boxes(machinery),this.material));
    const crystal=[];
    for(let i=0;i<45;i++){
      const a=i*2.399,r=680+(i%7)*71,y=-100-(i%5)*65,s=18+i%4*12;
      crystal.push([Math.sin(a)*r,y,Math.cos(a)*r,s,s*1.5,s,'#38536b',a]);
    }
    this.staticGroup.add(new T.Mesh(this.boxes(crystal),this.material));
    const stars=[];for(let i=0;i<95;i++)stars.push([Math.sin(i*7.13)*1600,-250+(i%9)*105,-1000+Math.cos(i*3.71)*850,3,3,3,i%3?'#719ab1':'#e8bd77']);
    this.staticGroup.add(new T.Mesh(this.boxes(stars),this.material));
    const skyline=[];
    for(let i=0;i<13;i++){
      const x=-620+i*95,z=-710+Math.sin(i*1.7)*75,h=60+(i*37)%140;
      skyline.push([x,-40,z,68,45,100,'#20344f'],[x,h/2-20,z,48,h,52,'#29435c'],[x,h-16,z,57,8,61,'#5c7182']);
      for(let j=0;j<3;j++)skyline.push([x-13+j*13,h-37,z+27,5,12,2,j%2?'#77b7ba':'#a99164']);
    }
    this.staticGroup.add(new T.Mesh(this.boxes(skyline),this.material));
    const moon=[];
    for(let x=-4;x<=4;x++)for(let y=-4;y<=4;y++)if(x*x+y*y<21){
      const shade=x+y>0?'#789dac':(x*3+y*7)%5===0?'#526d8b':'#aec2c3';
      moon.push([-290+x*25,275+y*25,-1090,25,25,16,shade]);
    }
    this.staticGroup.add(new T.Mesh(this.boxes(moon),this.material));
    const boundaryGeo=this.geo(new T.RingGeometry(440,444,64));boundaryGeo.rotateX(-Math.PI/2);
    this.boundary=new T.Mesh(boundaryGeo,this.mat({color:0x64c7c5,emissive:0x237a86,emissiveIntensity:.5,side:T.DoubleSide}));this.boundary.position.y=1;this.scene.add(this.boundary);
    const center=[];for(let i=0;i<8;i++){const a=i*TAU/8;center.push([Math.sin(a)*70,-3,Math.cos(a)*70,26,2,5,'#63766f',-a]);}
    this.staticGroup.add(new T.Mesh(this.boxes(center),this.material));
  }
  buildModels(){
    const definitions={
      shard:[[0,.6,0,1.1,1.15,1.1,'#a7ffdd',.25],[.28,1.3,0,.55,.4,.6,'#e1fff0',.25],[-.4,.3,.3,.6,.6,.6,'#2eb9a7']],
      crate:[[0,.6,0,1.5,1.2,1.35,'#b1814a'],[0,1.22,0,1.66,.2,1.5,'#e3bd77'],[-.61,.6,.7,.2,1.2,.13,'#e6c994'],[.61,.6,.7,.2,1.2,.13,'#e6c994'],[0,.63,.72,.43,.43,.1,'#254c63'],[0,.63,.79,.22,.22,.07,'#8ee8de']],
      prism:[[0,.7,0,1.25,1.4,1.25,'#9362c1',Math.PI/4],[0,1.51,0,.75,.24,.75,'#e1b2ff',Math.PI/4],[0,.52,.7,.3,.8,.13,'#ca91ee']],
      tower:[[0,.24,0,1.55,.48,1.4,'#60798a'],[-.3,.93,-.15,.85,1.2,.85,'#8196a4'],[-.3,1.58,-.15,1.02,.18,1,'#e1bd70'],[.5,.62,.18,.5,.8,.66,'#476879'],[-.3,1.06,.29,.27,.42,.06,'#77ffe4'],[-.3,1.9,-.15,.43,.48,.5,'#435d73']],
      crown:[[0,.22,0,1.6,.4,1.45,'#91773c'],[0,.51,0,1.8,.25,1.6,'#ffc966'],[-.62,.96,0,.38,.75,.4,'#ffe2a3'],[.62,.96,0,.38,.75,.4,'#ffe2a3'],[0,1.14,-.54,.4,1.12,.35,'#ffe2a3'],[0,.79,.61,.42,.45,.27,'#90ffe5']],
      anchor:[[0,.24,0,1.8,.45,1.55,'#466d89'],[0,.67,0,.52,.6,.62,'#77b8d7'],[0,1.01,0,1.1,.3,.82,'#b8edff'],[-.65,.55,0,.32,.58,.8,'#a7dbea'],[.65,.55,0,.32,.58,.8,'#a7dbea']],
      core:[[0,.23,0,1.7,.36,1.65,'#88704d'],[0,.67,0,1.1,.6,1.1,'#50caba'],[0,1.23,0,1.4,.66,1.05,'#ffe6aa'],[-.32,1.3,.55,.23,.24,.08,'#273c51'],[.32,1.3,.55,.23,.24,.08,'#273c51'],[0,1.04,.63,.2,.15,.2,'#f3a747'],[-.59,1.65,0,.24,.32,.5,'#e9c577'],[.59,1.65,0,.24,.32,.5,'#e9c577']],
    };
    for(const [name,parts] of Object.entries(definitions))this.models.set(name,this.boxes(parts));
    this.turretGeo=this.boxes([[0,15,0,48,30,46,'#644459'],[0,34,0,34,20,32,'#b36570'],[0,40,26,17,17,42,'#efba98'],[0,40,48,11,11,5,'#ff7796']]);
  }
  buildPlayer(){
    this.player=new T.Group();this.scene.add(this.player);
    const hull=[];
    for(let i=0;i<8;i++){
      const a=i*TAU/8;hull.push([Math.sin(a)*32,9,Math.cos(a)*32,24,14,13,'#d7ba75',a],[Math.sin(a)*32,18,Math.cos(a)*32,20,4,11,'#78f9e0',a]);
    }
    hull.push([0,12,0,42,13,37,'#284958'],[-27,11,-19,15,22,21,'#54717c'],[27,11,-19,15,22,21,'#54717c']);
    this.hull=new T.Mesh(this.boxes(hull),this.material);this.player.add(this.hull);
    const owl=[
      [0,34,0,33,31,25,'#a67845'],[0,36,13,24,24,4,'#f7dfab'],
      [0,58,0,47,29,29,'#bb955a'],[-12,59,15,19,20,5,'#fff0bf'],[12,59,15,19,20,5,'#fff0bf'],
      [-12,59,19,12,12,3,'#183243'],[12,59,19,12,12,3,'#183243'],[-12,61,21,5,5,2,'#b1ffeb'],[12,61,21,5,5,2,'#b1ffeb'],
      [0,49,20,9,8,12,'#eaa942'],[-21,75,0,10,12,21,'#907442'],[21,75,0,10,12,21,'#907442'],
      [0,79,0,53,8,38,'#293e69'],[0,89,-2,35,15,27,'#354f80'],[-5,99,-2,25,7,24,'#476292'],
      [8,89,13,4,14,3,'#ffe3a2'],[14,89,13,8,4,3,'#ffe3a2'],[12,83,13,7,4,3,'#ffe3a2'],
      [-12,20,12,11,7,16,'#e9af60'],[12,20,12,11,7,16,'#e9af60'],[24,32,-1,12,19,16,'#86614a'],[24,36,8,9,9,3,'#e6cb8c'],
    ];
    this.owl=new T.Mesh(this.boxes(owl),this.material);this.player.add(this.owl);
    this.wings=[-1,1].map(side=>{const w=new T.Mesh(this.boxes([[side*5,0,0,12,27,19,'#775e4f'],[side*8,-9,0,13,10,20,'#344f78'],[side*8,3,10,4,4,1,'#e7ca79']]),this.material);w.position.set(side*22,37,0);this.player.add(w);return w;});
    this.player.scale.setScalar(1.05);
    this.playerGlow=new T.Mesh(this.geo(new T.RingGeometry(38,40,8)),this.glow);this.playerGlow.rotation.x=-Math.PI/2;this.playerGlow.position.y=2;this.player.add(this.playerGlow);
  }
  reset(run){
    this.clearRun();this.run=run;this.lastTime=run.elapsed;this.size=1.05;
    const theme=new T.Color(CHAPTER_COLORS[run.zone.chapter]);this.glow.color.copy(theme);this.glow.emissive.copy(theme);
    this.floorMaterial.color.copy(theme).lerp(new T.Color('#ffffff'),.72);
    for(const o of run.zone.objects){const mesh=new T.Mesh(this.models.get(o.type),this.material);mesh.scale.setScalar(o.r);mesh.position.set(o.x-500,4,o.y-500);mesh.rotation.y=o.phase*.35;this.dynamic.add(mesh);this.objects.set(o.id,{mesh,active:true});}
    this.turrets=run.zone.turrets.map(o=>{const mesh=new T.Mesh(this.turretGeo,this.material);this.dynamic.add(mesh);return mesh;});
    this.rivals=run.zone.rivals.map((o,i)=>{const mesh=new T.Mesh(this.models.get('anchor'),this.mat({color:i?0xbe8dff:0x73bfea,roughness:.5,metalness:.4}));mesh.scale.setScalar(24);this.dynamic.add(mesh);return mesh;});
    // Rival materials have per-run ownership; all other resources are reused.
  }
  clearRun(){
    for(const m of this.rivals||[]){m.material.dispose();this.materials.delete(m.material);}
    this.dynamic.clear();this.objects.clear();this.proxies=[];this.particles=[];this.run=null;
    if(this.effectMesh)this.effectMesh.count=0;if(this.shotMesh)this.shotMesh.count=0;if(this.shotOutline)this.shotOutline.count=0;if(this.aimMesh)this.aimMesh.count=0;
  }
  collect(o,run){
    const obj=this.objects.get(o.id);if(!obj)return;
    if(this.reducedMotion.matches){obj.mesh.visible=false;obj.active=false;this.pulse=1;return;}
    if(this.proxies.length>=32){const old=this.proxies.shift();old.mesh.visible=false;}
    this.proxies.push({mesh:obj.mesh,x:o.x,z:o.y,age:0,r:o.r});obj.active=false;
    const count=this.reducedMotion.matches?0:(o.type==='core'?14:6);
    for(let i=0;i<count&&this.particles.length<96;i++)this.particles.push({x:o.x-500,z:o.y-500,y:10,life:.45,max:.45,vx:Math.sin(i*2.399)*65,vz:Math.cos(i*2.399)*65,vy:70+i%3*25});
    this.pulse=1;
  }
  resize(){
    const rect=this.canvas.getBoundingClientRect();if(rect.width<1||rect.height<1)return;
    this.width=rect.width;this.height=rect.height;this.renderer.setSize(rect.width,rect.height,false);
    const aspect=rect.width/rect.height,span=1020;
    const halfW=aspect<1?span/2:span*aspect/2,halfH=aspect<1?span/aspect/2:span/2;
    this.camera.left=-halfW;this.camera.right=halfW;this.camera.top=halfH;this.camera.bottom=-halfH;this.camera.updateProjectionMatrix();this.camera.updateMatrixWorld();
  }
  worldPoint(clientX,clientY){
    const r=this.canvas.getBoundingClientRect();this.pointer.set((clientX-r.left)/r.width*2-1,-(clientY-r.top)/r.height*2+1);
    this.ray.setFromCamera(this.pointer,this.camera);this.ray.ray.intersectPlane(this.ground,this.point);
    return{x:Math.max(55,Math.min(945,this.point.x+500)),y:Math.max(55,Math.min(945,this.point.z+500))};
  }
  project(x,y,height=0){this.point.set(x-500,height,y-500).project(this.camera);return{x:(this.point.x+1)*this.width/2,y:(1-this.point.y)*this.height/2};}
  render(run,capacity,radius,wake){
    if(this.lost||!run)return;if(this.run!==run)this.reset(run);
    const dt=run.paused?0:Math.max(0,Math.min(.05,run.elapsed-this.lastTime));this.lastTime=run.elapsed;
    const reduced=this.reducedMotion.matches,time=reduced?0:run.elapsed;
    const counts={ready:0,near:0,large:0,shield:0};let shadowCount=0;
    for(const o of run.zone.objects){
      const item=this.objects.get(o.id);if(!item)continue;
      if(!o.active){if(item.active){item.mesh.visible=false;item.active=false;}continue;}
      const state=o.shielded&&run.prismKeys<3?'shield':o.r<=capacity?'ready':o.r<=capacity*1.27?'near':'large';
      const mesh=item.mesh;mesh.position.set(o.x-500,4+(state==='ready'?Math.sin(time*2+o.phase)*2:0),o.y-500);
      const scale=o.r;mesh.scale.setScalar(scale);
      this.matrix.position.set(o.x-500,1.5,o.y-500);this.matrix.rotation.set(0,0,0);this.matrix.scale.set(o.r+7,1,o.r+7);this.matrix.updateMatrix();this.markers[state].setMatrixAt(counts[state]++,this.matrix.matrix);
      this.matrix.position.set(o.x-500,0.6,o.y-495);this.matrix.scale.set(o.r*3.2,1,o.r*2.6);this.matrix.updateMatrix();this.shadows.setMatrixAt(shadowCount++,this.matrix.matrix);
    }
    for(const [s,m] of Object.entries(this.markers)){m.count=counts[s];m.instanceMatrix.needsUpdate=true;}
    for(const p of this.proxies){
      p.age+=dt;const t=Math.min(1,p.age/.3),e=ease(t);p.mesh.visible=t<1;
      p.mesh.position.set((p.x+(run.x-p.x)*e)-500,reduced?4:6+Math.sin(t*Math.PI)*48,(p.z+(run.y-p.z)*e)-500);
      p.mesh.scale.setScalar(p.r*(reduced?1:1-e*.95));
    }
    this.proxies=this.proxies.filter(p=>p.age<.3);
    this.particles=this.particles.filter(p=>(p.life-=dt)>0);
    this.particles.forEach((p,i)=>{p.x+=p.vx*dt;p.z+=p.vz*dt;p.y+=p.vy*dt;p.vy-=230*dt;this.matrix.position.set(p.x,p.y,p.z);this.matrix.scale.setScalar(5*p.life/p.max);this.matrix.rotation.set(p.life*4,0,p.life*3);this.matrix.updateMatrix();this.effectMesh.setMatrixAt(i,this.matrix.matrix);});
    this.effectMesh.count=this.particles.length;this.effectMesh.instanceMatrix.needsUpdate=true;
    const shots=run.bullets.slice(0,48);shots.forEach((b,i)=>{this.matrix.position.set(b.x-500,17,b.y-500);this.matrix.rotation.set(0,Math.atan2(b.vx,b.vy),0);this.matrix.scale.set(1,1,1);this.matrix.updateMatrix();this.shotMesh.setMatrixAt(i,this.matrix.matrix);this.shotOutline.setMatrixAt(i,this.matrix.matrix);});this.shotMesh.count=shots.length;this.shotMesh.instanceMatrix.needsUpdate=true;this.shotOutline.count=shots.length;this.shotOutline.instanceMatrix.needsUpdate=true;
    let aimCount=0;
    for(const turret of run.zone.turrets){
      if(!turret.warning)continue;
      for(const offset of turret.pattern==='crossfire'?[-.18,.18]:[0]){
        const angle=turret.angle+offset,dx=Math.cos(angle),dy=Math.sin(angle);
        for(let d=42;d<880&&aimCount<192;d+=44){
          const x=turret.x+dx*d,y=turret.y+dy*d;if(Math.hypot(x-500,y-500)>442)break;
          this.matrix.position.set(x-500,3,y-500);this.matrix.rotation.set(0,Math.PI/2-angle,0);this.matrix.scale.set(5,1,23);this.matrix.updateMatrix();this.aimMesh.setMatrixAt(aimCount++,this.matrix.matrix);
        }
      }
    }
    this.aimMesh.count=aimCount;this.aimMesh.instanceMatrix.needsUpdate=true;
    run.zone.turrets.forEach((o,i)=>{this.turrets[i].position.set(o.x-500,2,o.y-500);this.turrets[i].rotation.y=Math.PI/2-o.angle;});
    run.zone.rivals.forEach((o,i)=>{this.rivals[i].position.set(o.x-500,8,o.y-500);this.rivals[i].rotation.y=time*.4;this.rivals[i].scale.setScalar(o.threshold*1.1);});
    this.size+=(Math.min(1.8,1.05+(radius-34)*.018)-this.size)*(reduced?1:Math.min(1,dt*12));
    this.player.position.set(run.x-500,3+(reduced?0:Math.sin(time*3)*1.5),run.y-500);this.player.scale.setScalar(this.size);
    this.matrix.position.set(run.x-500,.7,run.y-497);this.matrix.rotation.set(0,0,0);this.matrix.scale.set(110*this.size,1,95*this.size);this.matrix.updateMatrix();this.shadows.setMatrixAt(shadowCount++,this.matrix.matrix);this.shadows.count=shadowCount;this.shadows.instanceMatrix.needsUpdate=true;
    const trail=wake?run.wakeTrail.slice(-22):[];trail.forEach((p,i)=>{this.matrix.position.set(p.x-500,5,p.y-500);this.matrix.scale.setScalar((i+1)/trail.length);this.matrix.updateMatrix();this.wakeMesh.setMatrixAt(i,this.matrix.matrix);});this.wakeMesh.count=trail.length;this.wakeMesh.instanceMatrix.needsUpdate=true;
    this.player.rotation.z=reduced?0:-run.vx*.00023;this.player.rotation.x=reduced?0:run.vy*.00016;
    this.wings.forEach((w,i)=>w.rotation.z=reduced?0:(i?1:-1)*(.1+Math.sin(time*5)*.06));
    this.pulse=Math.max(0,(this.pulse||0)-dt*4);this.playerGlow.scale.setScalar(1+(reduced?0:this.pulse*.25));
    this.playerGlow.material.color.set(run.knockCooldown>0||run.dying>0?0xff7d8c:CHAPTER_COLORS[run.zone.chapter]);
    const limit=run.zone.storm?Math.max(285,442-run.elapsed/run.zone.timer*155):442;
    this.boundary.scale.setScalar(limit/442);this.boundary.material.color.set(run.zone.storm?0xd293f5:0x4d929e);
    this.target.visible=Boolean(run.target);if(run.target)this.target.position.set(run.target.x-500,3,run.target.y-500);
    const route=run.zone.index===0&&run.score<20?run.zone.objects.filter(o=>o.active&&o.r<=capacity&&(!o.shielded||run.prismKeys>=3)).sort((a,b)=>Math.hypot(a.x-run.x,a.y-run.y)-Math.hypot(b.x-run.x,b.y-run.y)||a.id-b.id).slice(0,2):[];
    this.route.visible=route.length>0;if(route.length){const a=this.routeGeometry.attributes.position;a.setXYZ(0,run.x-500,3,run.y-500);route.forEach((p,i)=>a.setXYZ(i+1,p.x-500,3,p.y-500));this.routeGeometry.setDrawRange(0,route.length+1);a.needsUpdate=true;this.routeGeometry.computeBoundingSphere();}
    this.renderer.render(this.scene,this.camera);
  }
  stats(){return{renderer:'REALTIME_3D',revision:T.REVISION,drawCalls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,geometries:this.renderer.info.memory.geometries,textures:this.renderer.info.memory.textures,materials:this.materials.size,objects:this.objects.size,proxies:this.proxies.length,particles:this.particles.length,contexts:1,lost:Boolean(this.lost)};}
  dispose(){this.clearRun();this.canvas.removeEventListener('webglcontextlost',this.onLost);this.canvas.removeEventListener('webglcontextrestored',this.onRestored);for(const g of this.geometries)g.dispose();for(const m of this.materials)m.dispose();this.shadowTexture.dispose();this.renderer.dispose();this.renderer.forceContextLoss();}
}
