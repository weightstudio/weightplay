import * as THREE from './vendor/three/three.module.min.js';
import {sampleTrack, angle, clamp} from './physics.mjs';
import {VEHICLES} from './data.mjs';

const PALETTES=[
  {sky:0x9bd3e6,ground:0x419b92,verge:0xe8ce93,leaf:0x278878,rock:0xd8b481,building:0x3d879c},
  {sky:0xa8d7ef,ground:0x478251,verge:0x9dba69,leaf:0x23664b,rock:0x858e78,building:0xced3b2},
  {sky:0xffd3a1,ground:0xae6948,verge:0xe6b779,leaf:0x65884a,rock:0xbc8055,building:0xa45444},
  {sky:0xb6d8ea,ground:0x849b9f,verge:0xdce7de,leaf:0x345c62,rock:0xaec0c4,building:0x647887},
  {sky:0x172b4e,ground:0x172937,verge:0x264958,leaf:0x35777b,rock:0x293e59,building:0x30526e},
];
const lerp=(a,b,t)=>a+(b-a)*t;

/** Owns every GPU object it creates. Simulation remains in physics.mjs. */
export class RaceRenderer{
  constructor(canvas,race,{onContextLost=()=>{},quality='auto'}={}){
    this.canvas=canvas;this.race=race;this.resources=new Set();this.materials=new Map();this.disposed=false;
    this.abort=new AbortController();this.firstFrame=true;this.cameraPosition=new THREE.Vector3();this.lookPosition=new THREE.Vector3();
    this.reducedMotion=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches||false;
    this.quality=quality==='low'||((globalThis.navigator?.hardwareConcurrency||8)<=4)?'low':'normal';
    try{
      this.renderer=new THREE.WebGLRenderer({canvas,antialias:this.quality!=='low',alpha:false,powerPreference:'high-performance',preserveDrawingBuffer:false});
      this.renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio||1,this.quality==='low'?1:1.6));
      this.renderer.outputColorSpace=THREE.SRGBColorSpace;
      this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.1;
      this.scene=new THREE.Scene();const colors=PALETTES[race.track.palette];
      this.scene.background=new THREE.Color(colors.sky);this.scene.fog=new THREE.Fog(colors.sky,75,210);
      this.camera=new THREE.PerspectiveCamera(60,1,.1,400);
      this.scene.add(new THREE.HemisphereLight(0xe2f5ff,colors.ground,2));
      const sun=new THREE.DirectionalLight(0xffedcd,2.8);sun.position.set(-55,100,-35);this.scene.add(sun);
      const rim=new THREE.DirectionalLight(0x9adff5,.8);rim.position.set(40,20,40);this.scene.add(rim);
      this.box=this.own(new THREE.BoxGeometry(1,1,1));
      this.wheelGeometry=this.own(new THREE.CylinderGeometry(.45,.45,.35,10));
      this.shadowGeometry=this.own(new THREE.CircleGeometry(1,16));
      this.buildTrack();this.buildScenery();this.buildObjects();
      this.karts=race.cars.map(car=>this.buildKart(car.stats.characterId||car.stats.id,car.id===0?car.stats.color:VEHICLES[(car.id+race.stage.arc)%4].color));
      this.karts.forEach(kart=>this.scene.add(kart.root));
      this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(canvas.parentElement||canvas);
      canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();if(!this.disposed)onContextLost();},{signal:this.abort.signal});
      this.resize();canvas.dataset.renderer='three-webgl2';
    }catch(error){this.dispose();throw error;}
  }
  own(resource){this.resources.add(resource);return resource;}
  mat(color,roughness=.68,metalness=.05){
    const key=`${color}/${roughness}/${metalness}`;
    if(!this.materials.has(key))this.materials.set(key,this.own(new THREE.MeshStandardMaterial({color,roughness,metalness})));
    return this.materials.get(key);
  }
  boxPart(parent,material,x,y,z,w,h,d){
    const mesh=new THREE.Mesh(this.box,material);mesh.position.set(x,y,z);mesh.scale.set(w,h,d);parent.add(mesh);return mesh;
  }
  instances(material,transforms){
    if(!transforms.length)return null;
    const mesh=new THREE.InstancedMesh(this.box,material,transforms.length),dummy=new THREE.Object3D();
    transforms.forEach((v,i)=>{dummy.position.set(v[0],v[1],v[2]);dummy.rotation.set(v[7]||0,v[6]||0,0);dummy.scale.set(v[3],v[4],v[5]);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);});
    mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();this.scene.add(mesh);return mesh;
  }
  ribbon(inner,outer,material,height=.02,{start=0,end=1,stripe=false,wet=false}={}){
    const track=this.race.track,positions=[],colors=[],indices=[];
    const first=Math.floor(start*(track.points.length-1)),last=Math.ceil(end*(track.points.length-1));
    for(let i=first;i<=last;i++){
      const p=sampleTrack(track,i/(track.points.length-1)*track.length);
      const tint=new THREE.Color(stripe?(Math.floor(i/3)%2?0xf3ebc9:0xe96b56):0xffffff);
      for(const side of [inner,outer]){positions.push(p.x+p.nx*side,p.y+height,p.z+p.nz*side);colors.push(tint.r,tint.g,tint.b);}
      if(i<last){const j=(i-first)*2;indices.push(j,j+2,j+1,j+1,j+2,j+3);}
    }
    const geometry=this.own(new THREE.BufferGeometry());geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
    if(stripe)geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
    geometry.setIndex(indices);geometry.computeVertexNormals();
    const mesh=new THREE.Mesh(geometry,material);this.scene.add(mesh);return mesh;
  }
  buildTrack(){
    const {track,stage}=this.race,palette=PALETTES[track.palette];
    const asphalt=this.mat(0x34404b,.92),shoulder=this.mat(palette.verge,.95);
    // Double-side protects ribbon visibility on tight bank transitions; meshes stay world-space.
    asphalt.side=THREE.DoubleSide;shoulder.side=THREE.DoubleSide;
    const curb=this.own(new THREE.MeshStandardMaterial({vertexColors:true,roughness:.8,side:THREE.DoubleSide}));
    this.ribbon(-track.width-2,track.width+2,shoulder,-.09);
    this.ribbon(-track.width,track.width,asphalt,0);
    for(const side of [-1,1])this.ribbon(side*(track.width-.7),side*track.width,curb,.025,{stripe:true});
    const wetMaterial=this.own(new THREE.MeshStandardMaterial({color:0x53899b,roughness:.16,metalness:.25,transparent:true,opacity:.62,side:THREE.DoubleSide}));
    for(const [start,end]of stage.wet)this.ribbon(-track.width+.75,track.width-.75,wetMaterial,.038,{start,end});
    const marks=[],rails=[],posts=[];
    for(let s=0;s<track.length;s+=7){const p=sampleTrack(track,s);marks.push([p.x,p.y+.045,p.z,.16,.025,2.7,p.heading,-p.slope]);}
    for(let s=0;s<track.length;s+=4.5)for(const side of [-1,1]){
      const p=sampleTrack(track,s,side*(track.width+1.9));rails.push([p.x,p.y+.85,p.z,.22,.36,4.7,p.heading,-p.slope]);
      if(Math.round(s/4.5)%3===0)posts.push([p.x,p.y+.45,p.z,.26,.9,.3,p.heading]);
    }
    this.instances(this.mat(0xd5e8da,.8),marks);this.instances(this.mat(0xb9c6c9,.4,.35),rails);this.instances(this.mat(0x56676b),posts);
    const start=sampleTrack(track,0);this.startArch=new THREE.Group();this.startArch.position.set(start.x,start.y,start.z);this.startArch.rotation.y=start.heading;
    const dark=this.mat(0x152c3b),gold=this.mat(0xf7ca58);
    for(const side of [-1,1])this.boxPart(this.startArch,dark,side*(track.width-.1),3.3,0,.7,6.6,.8);
    this.boxPart(this.startArch,gold,0,6.4,0,track.width*2+.6,.8,.8);
    for(let n=-7;n<=7;n++)this.boxPart(this.startArch,this.mat(n%2?0xffffff:0x132331),n,6.45,.46,.95,.58,.06);
    this.scene.add(this.startArch);
    const startSquares=[];
    for(let x=-Math.floor(track.width);x<track.width;x++)for(let z=0;z<2;z++)if((x+z)%2===0){
      startSquares.push([start.x+start.nx*(x+.5)+start.tx*z,start.y+.045,start.z+start.nz*(x+.5)+start.tz*z,1,.025,1,start.heading]);
    }
    this.instances(this.mat(0xf0efe5),startSquares);
  }
  buildScenery(){
    const track=this.race.track,palette=PALETTES[track.palette];
    const ground=new THREE.Mesh(this.own(new THREE.PlaneGeometry(2500,2500)),this.mat(palette.ground,.95));ground.rotation.x=-Math.PI/2;ground.position.y=-2.8;this.scene.add(ground);
    const trunks=[],leaves=[],tops=[],rocks=[],walls=[],roofs=[],windows=[];
    const stride=this.quality==='low'?22:13;
    for(let s=0,i=0;s<track.length;s+=stride,i++)for(const side of [-1,1]){
      const offset=side*(track.width+9+(i%5)*3),p=sampleTrack(track,s,offset),height=3+(i%4)*.7;
      if(track.palette===0&&side===-1){
        if(i%3===0){walls.push([p.x,p.y+1,p.z,5,2,3,p.heading]);roofs.push([p.x,p.y+2.1,p.z,5.2,.25,3.2,p.heading]);}
      }else if(track.palette===2){
        rocks.push([p.x,p.y+height*.6-1,p.z,4+(i%3),height*2,5+(i%2),p.heading]);
        if(i%3===0){trunks.push([p.x+3,p.y+1.5,p.z,1,3,.9,p.heading]);leaves.push([p.x+3,p.y+2,p.z,2,.7,.8,p.heading]);}
      }else if(track.palette===4){
        walls.push([p.x,p.y+height*1.6-1,p.z,6,height*3.2,5,p.heading]);
        roofs.push([p.x,p.y+height*3.2-.8,p.z,6.2,.3,5.2,p.heading]);
        windows.push([p.x,p.y+height*2,p.z,6.1,.35,5.1,p.heading]);
      }else{
        trunks.push([p.x,p.y+1.2,p.z,.6,2.4,.6,p.heading]);
        leaves.push([p.x,p.y+height,p.z,3.5,2.2,3.5,p.heading]);
        tops.push([p.x,p.y+height+1.4,p.z,2.2,1.4,2.2,p.heading]);
        if(i%4===0)rocks.push([p.x+3,p.y+.1,p.z-4,2.4,1.6,2.6,p.heading]);
      }
    }
    this.instances(this.mat(0x665140),trunks);this.instances(this.mat(palette.leaf),leaves);this.instances(this.mat(track.palette===3?0xe4ebe1:0x529b70),tops);
    this.instances(this.mat(palette.rock),rocks);this.instances(this.mat(palette.building),walls);this.instances(this.mat(track.palette===4?0x35e1d2:0xda9c71),roofs);
    this.instances(this.mat(0xf6c86c,.35),windows);
    // Authored cuboid clouds break up the empty sky without a texture/download.
    const clouds=[];
    for(let i=0;i<12;i++){
      const p=sampleTrack(track,track.length*i/12,(i%2?1:-1)*(55+i%3*18));
      for(let k=0;k<3;k++)clouds.push([p.x+k*6,30+i%4*4+k%2*2,p.z,10,3+k%2*2,6,p.heading]);
    }
    this.instances(this.mat(track.palette===4?0x526784:0xe3f1ee,1),clouds);
    if(this.race.stage.wind){
      const flags=[];for(let f=this.race.stage.wind[0];f<this.race.stage.wind[1];f+=.04){const p=sampleTrack(track,f*track.length,track.width+3);flags.push([p.x,p.y+3,p.z,.14,6,.14,p.heading]);flags.push([p.x+1,p.y+5.7,p.z,2,.6,.18,p.heading]);}this.instances(this.mat(0xfad773),flags);
    }
  }
  buildKart(id,color){
    const root=new THREE.Group(),body=new THREE.Group();root.add(body);
    const paint=this.mat(color,.34,.24),dark=this.mat(0x142b39,.58),white=this.mat(0xffedcf),black=this.mat(0x151f29),steel=this.mat(0xb4c4ca,.38,.65);
    this.boxPart(body,dark,0,.5,0,1.9,.32,3.1);
    this.boxPart(body,paint,0,.82,.7,1.65,.48,1.55);
    this.boxPart(body,paint,0,.83,-.95,1.7,.46,.75);
    this.boxPart(body,white,0,1.085,.8,.23,.035,1.2);
    this.boxPart(body,dark,0,.67,1.65,1.7,.2,.24);
    this.boxPart(body,steel,0,.75,-1.56,1.1,.16,.22);
    this.boxPart(body,paint,0,1.38,-1.25,2.1,.16,.4);
    this.boxPart(body,dark,0,1.13,-1.2,.28,.5,.16);
    const wheels=[];
    for(const x of [-1.02,1.02])for(const z of [-.95,1.05]){
      const wheel=new THREE.Mesh(this.wheelGeometry,black);wheel.position.set(x,.46,z);wheel.rotation.z=Math.PI/2;body.add(wheel);wheels.push(wheel);
      this.boxPart(body,steel,x*1.18,.46,z,.04,.35,.35);
    }
    // The roster keeps its old save IDs, while each kart now carries a core-cast identity.
    const isFia=id==='spark-paw-fox'||id==='fox';
    const isMimi=id==='rainbow-hop-rabbit'||id==='hare';
    const isPanko=id==='drum-belly-panda'||id==='panda';
    const isNori=id==='bubble-fin-otter'||id==='penguin';
    const animal=isFia?0xe58c43:isMimi?0xe4d6bd:isPanko?0xeee8da:0x8c5a43;
    const fur=this.mat(animal),driver=new THREE.Group();driver.position.set(0,1.05,-.25);body.add(driver);
    this.boxPart(driver,paint,0,.15,0,.65,.6,.52);
    this.boxPart(driver,fur,0,.75,0,.87,.8,.73);
    if(isMimi){
      const bands=[0xef718f,0xf4a34c,0xf5d34d,0x68bc82];
      for(const s of [-1,1])for(let i=0;i<bands.length;i++)
        this.boxPart(driver,this.mat(bands[i]),s*(.27+i*.018),1.27+i*.17,-.1,.24,.18,.25);
    }else if(isFia){
      for(const s of [-1,1]){
        this.boxPart(driver,fur,s*.34,1.32,-.08,.3,.42,.32);
        this.boxPart(driver,this.mat(0xffcf83),s*.34,1.35,.09,.13,.23,.035);
      }
    }else if(isPanko){
      for(const s of [-1,1])this.boxPart(driver,black,s*.34,1.22,-.08,.3,.3,.34);
    }else{
      for(const s of [-1,1])this.boxPart(driver,fur,s*.36,1.18,-.08,.25,.25,.3);
    }
    this.boxPart(driver,white,0,isFia ? .57 : .52,.4,isFia ? .65 : .48,isFia ? .3 : .22,isFia ? .25 : .2);
    for(const s of [-1,1]){
      if(isPanko)this.boxPart(driver,black,s*.25,.8,.376,.29,.28,.04);
      this.boxPart(driver,isPanko?white:black,s*.23,.83,.411,.11,.12,.04);
      this.boxPart(driver,fur,s*.49,.15,.37,.23,.23,.6);
    }
    this.boxPart(driver,black,0,.64,.54,.16,.12,.1);
    const gold=this.mat(0xffd35d,.3,.26);
    if(isFia){
      const boltTop=this.boxPart(driver,gold,0,1.22,.39,.16,.21,.07);boltTop.rotation.z=-.28;
      const boltMid=this.boxPart(driver,gold,.07,1.13,.4,.15,.13,.07);boltMid.rotation.z=.28;
      this.boxPart(driver,this.mat(0x20b9d8,.32),0,.38,-.34,1.02,.14,.18);
      this.boxPart(driver,this.mat(0x20b9d8,.32),-.38,.39,-.63,.19,.13,.45);
      this.boxPart(driver,gold,-.38,.42,-.61,.16,.16,.08);
    }else if(isMimi){
      this.boxPart(driver,this.mat(0x168e9e,.35),.45,.4,-.34,.34,.42,.25);
      const star=this.boxPart(driver,gold,.48,.46,-.19,.22,.22,.08);star.rotation.z=Math.PI/4;
    }else if(isPanko){
      this.boxPart(driver,this.mat(0xb93637,.36),0,.32,.48,.44,.36,.15);
      this.boxPart(driver,gold,0,.32,.57,.38,.3,.05);
      this.boxPart(driver,this.mat(0xf4c64f,.3),0,.32,.61,.16,.16,.035);
      for(const s of [-1,1]){
        const stick=this.boxPart(driver,this.mat(0x75b45c,.4),s*.39,1.3,-.24,.075,.54,.075);
        stick.rotation.z=s*.34;
      }
    }else if(isNori){
      const frame=this.mat(0xe7bf58,.3,.25),glass=this.mat(0x68d9ed,.17,.12);
      for(const s of [-1,1]){
        this.boxPart(driver,frame,s*.23,1.22,.4,.31,.24,.075);
        this.boxPart(driver,glass,s*.23,1.22,.445,.21,.14,.035);
        this.boxPart(driver,this.mat(0x88eaff,.22),s*.64,1.44,-.08,.15,.15,.15);
      }
      this.boxPart(driver,this.mat(0xef7661,.42),.43,.28,-.04,.13,.16,.13);
    }
    // Two side rails of the racing visor preserve the animal's square silhouette.
    this.boxPart(driver,dark,0,1.04,.06,.94,.16,.83);
    this.boxPart(driver,this.mat(0x63d9df,.17,.3),0,.96,.465,.75,.12,.05);
    const exhaust=new THREE.Group();body.add(exhaust);
    this.boxPart(exhaust,this.mat(0x66efff,.25),-.45,.67,-1.95,.25,.25,.75);
    this.boxPart(exhaust,this.mat(0xfac359,.3),.45,.67,-1.95,.25,.25,.75);exhaust.visible=false;
    const shadow=new THREE.Mesh(this.shadowGeometry,this.own(new THREE.MeshBasicMaterial({color:0x091c25,transparent:true,opacity:.2,depthWrite:false})));
    shadow.rotation.x=-Math.PI/2;shadow.position.y=.035;shadow.scale.set(1.4,2,1);root.add(shadow);
    return {root,body,wheels,driver,exhaust,shadow};
  }
  buildObjects(){
    const {race}=this;
    const coneGeometry=this.own(new THREE.CylinderGeometry(.13,.56,1.25,4));
    for(const p of race.cones){const mesh=new THREE.Mesh(coneGeometry,this.mat(0xf39338));mesh.position.set(p.x,p.y+.63,p.z);mesh.rotation.y=Math.PI/4;this.scene.add(mesh);this.boxPart(this.scene,this.mat(0x122b3b),p.x,p.y+.1,p.z,1.1,.2,1.1);}
    const padMat=this.own(new THREE.MeshStandardMaterial({color:0x57e0d0,emissive:0x146d73,emissiveIntensity:.45,roughness:.4}));
    for(const p of race.pads){const group=new THREE.Group();group.position.set(p.x,p.y+.09,p.z);group.rotation.set(-p.slope,p.heading,0);this.boxPart(group,this.mat(0x15515c),0,0,0,4.8,.13,3.3);for(let k=0;k<3;k++)this.boxPart(group,padMat,0,.08,k-1,3.6,.04,.25);this.scene.add(group);}
    const hoop=this.own(new THREE.TorusGeometry(1.45,.15,5,8)),gold=this.own(new THREE.MeshStandardMaterial({color:0xf8cd61,emissive:0x694610,emissiveIntensity:.35,metalness:.45,roughness:.32}));
    this.rings=race.rings.map(p=>{const mesh=new THREE.Mesh(hoop,gold);mesh.position.set(p.x,p.y+1.7,p.z);mesh.rotation.y=p.heading;this.scene.add(mesh);return mesh;});
    const arrowShape=new THREE.Shape();arrowShape.moveTo(-.8,0);arrowShape.lineTo(0,1.1);arrowShape.lineTo(.8,0);arrowShape.lineTo(.34,0);arrowShape.lineTo(.34,-.8);arrowShape.lineTo(-.34,-.8);arrowShape.lineTo(-.34,0);arrowShape.closePath();
    this.arrow=new THREE.Mesh(this.own(new THREE.ExtrudeGeometry(arrowShape,{depth:.18,bevelEnabled:false})),this.mat(0xffd568));this.scene.add(this.arrow);
    this.sparks=new THREE.InstancedMesh(this.box,this.mat(0x86e9ff,.25),24);this.sparks.count=0;this.scene.add(this.sparks);this.sparkDummy=new THREE.Object3D();
    // Fixed pools: no meshes/materials are allocated for repeated racing events.
    this.effectDummy=new THREE.Object3D();this.effectColor=new THREE.Color();
    this.particles=new THREE.InstancedMesh(this.box,this.own(new THREE.MeshBasicMaterial({color:0xffffff})),64);
    this.particles.count=0;this.particles.frustumCulled=false;this.scene.add(this.particles);this.bursts=[];
    this.skids=new THREE.InstancedMesh(this.box,this.own(new THREE.MeshBasicMaterial({color:0x14232b,transparent:true,opacity:.45,depthWrite:false})),64);
    this.skids.count=0;this.skids.frustumCulled=false;this.scene.add(this.skids);this.skidHistory=[];this.lastSkid=-1;
    this.streaks=new THREE.InstancedMesh(this.box,this.own(new THREE.MeshBasicMaterial({color:0x9defff,transparent:true,opacity:.38,depthWrite:false})),20);
    this.streaks.count=0;this.streaks.frustumCulled=false;this.scene.add(this.streaks);
    this.cameraKick=0;
  }
  feedback(event){
    const car=this.race.player;
    if(event.type==='recover'){this.bursts.length=0;this.skidHistory.length=0;this.firstFrame=true;this.cameraKick=0;return;}
    const colors={contact:0xff9568,ring:0xffdc69,driftCharge:[0,0x73e7ff,0xffce57,0xf592ff][event.value],driftBoost:0xffcf68,pad:0x64ffdc,boost:0x65dfff,draftBoost:0x65ffdd};
    const color=colors[event.type];if(!color||this.reducedMotion)return;
    if(event.type==='contact')this.cameraKick=.18;
    if(this.bursts.length>=4)this.bursts.shift();
    this.bursts.push({x:car.x,y:car.y+.6,z:car.z,time:this.race.time,color,contact:event.type==='contact'});
  }
  projectWorld(source){
    const p=new THREE.Vector3(source.x,source.y,source.z).project(this.camera);
    return {x:(p.x+1)/2,y:(1-p.y)/2,visible:p.z>=-1&&p.z<=1&&Math.abs(p.x)<=1&&Math.abs(p.y)<=1};
  }
  resize(){
    if(this.disposed||!this.renderer)return;
    const rect=this.canvas.getBoundingClientRect(),width=Math.max(1,Math.round(rect.width)),height=Math.max(1,Math.round(rect.height));
    if(width===this.width&&height===this.height)return;
    this.width=width;this.height=height;this.renderer.setSize(width,height,false);this.camera.aspect=width/height;
    // Constant horizontal field of view: a wide desktop gains scenery, not farther hazards.
    this.camera.fov=THREE.MathUtils.radToDeg(2*Math.atan(Math.tan(THREE.MathUtils.degToRad(65)/2)/this.camera.aspect));
    this.baseFov=clamp(this.camera.fov,38,82);this.camera.fov=this.baseFov;this.camera.updateProjectionMatrix();
  }
  render(race,delta=0,alpha=1,{hero=false}={}){
    if(this.disposed)return;
    this.resize();
    race.cars.forEach((car,index)=>{
      const kart=this.karts[index],yaw=car.prevYaw+angle(car.yaw-car.prevYaw)*alpha;
      kart.root.position.set(lerp(car.prevX,car.x,alpha),lerp(car.prevY,car.y,alpha),lerp(car.prevZ,car.z,alpha));
      kart.root.rotation.set(0,yaw,0);
      const power=car.boost||car.miniBoost>0||car.draftBoost>0;
      kart.body.rotation.x=-car.slope+(this.reducedMotion?0:car.impact*.13-(power?.035:0));
      kart.body.rotation.z=this.reducedMotion?0:-car.steer*clamp(car.speed/35,0,1)*(car.drifting?.13:.065);
      kart.body.position.y=this.reducedMotion?0:Math.sin(race.time*car.speed*.7)*Math.min(.035,car.speed*.001)+Math.sin(car.impact*16)*car.impact*.08;
      kart.exhaust.visible=power;kart.exhaust.scale.z=power?1.15+Math.sin(race.time*45)*.2:1;kart.driver.rotation.y=car.steer*.16;
      kart.driver.rotation.z=this.reducedMotion?0:car.steer*.06;
      kart.wheels.forEach(w=>w.rotation.x=race.time*car.speed*1.5);
    });
    this.rings.forEach((mesh,i)=>{mesh.visible=!race.player.collected.has(`${race.player.completedLaps}:${i}`);if(!this.reducedMotion){mesh.rotation.z=race.time*.6;mesh.position.y=race.rings[i].y+1.7+Math.sin(race.time*2+i)*.15;}});
    const gate=race.track.gates[race.player.nextGate];this.arrow.position.set(gate.x,gate.y+5,gate.z);this.arrow.rotation.set(0,gate.heading,0);
    this.arrow.visible=!hero;
    const car=race.player,p=this.karts[0].root.position;
    const heading=sampleTrack(race.track,car.near.s+12).heading;
    const followYaw=car.yaw+angle(heading-car.yaw)*.15;
    const power=car.boost||car.miniBoost>0||car.draftBoost>0;
    const pull=this.reducedMotion?0:clamp(car.speed/40,0,1)*1.1+(power?.8:0);
    const target=new THREE.Vector3(p.x-Math.sin(followYaw)*(9+pull),p.y+6.4,p.z-Math.cos(followYaw)*(9+pull));
    const look=new THREE.Vector3(p.x+Math.sin(followYaw)*10,p.y+.8,p.z+Math.cos(followYaw)*10);
    const desiredFov=hero?43:this.baseFov+(this.reducedMotion?0:(power?5:0)+clamp(car.speed/40,0,1)*2);
    this.camera.fov=lerp(this.camera.fov,desiredFov,hero?1:1-Math.exp(-delta*6));this.camera.updateProjectionMatrix();
    if(hero){target.set(p.x+8,p.y+6,p.z+10);look.set(p.x,p.y+1,p.z);}
    const ease=this.firstFrame||hero?1:1-Math.exp(-Math.min(delta,.1)*(this.reducedMotion?14:7));
    this.cameraPosition.lerp(target,ease);this.lookPosition.lerp(look,ease);this.camera.position.copy(this.cameraPosition);
    if(!this.reducedMotion&&!hero&&this.cameraKick>0){this.camera.position.x+=Math.sin(race.time*65)*this.cameraKick;this.cameraKick=Math.max(0,this.cameraKick-delta*1.4);}
    this.camera.lookAt(this.lookPosition);this.firstFrame=false;
    this.sparks.count=car.drifting&&!this.reducedMotion?12:0;
    this.sparks.material.color.setHex([0x9dc9df,0x73e7ff,0xffce57,0xf592ff][car.driftLevel]);
    for(let i=0;i<this.sparks.count;i++){
      const side=i%2?1:-1,back=1.5+(i%6)*.32;
      this.sparkDummy.position.set(p.x-Math.sin(car.yaw)*back+Math.cos(car.yaw)*side,p.y+.2+((i+race.time*12)%3)*.07,p.z-Math.cos(car.yaw)*back-Math.sin(car.yaw)*side);
      this.sparkDummy.scale.set(.09,.09,.2);this.sparkDummy.rotation.set(0,car.yaw,0);this.sparkDummy.updateMatrix();this.sparks.setMatrixAt(i,this.sparkDummy.matrix);
    }
    if(this.sparks.count)this.sparks.instanceMatrix.needsUpdate=true;
    if(!hero&&!this.reducedMotion){
      if(car.drifting&&race.time-this.lastSkid>.045){
        this.lastSkid=race.time;
        for(const side of [-1,1])this.skidHistory.push({x:p.x-Math.sin(car.yaw)+Math.cos(car.yaw)*side,y:p.y+.055,z:p.z-Math.cos(car.yaw)-Math.sin(car.yaw)*side,yaw:car.motion,time:race.time});
        if(this.skidHistory.length>64)this.skidHistory.splice(0,this.skidHistory.length-64);
      }
      this.skidHistory=this.skidHistory.filter(v=>race.time-v.time<2.5);this.skids.count=this.skidHistory.length;
      this.skidHistory.forEach((v,i)=>{this.effectDummy.position.set(v.x,v.y,v.z);this.effectDummy.rotation.set(0,v.yaw,0);this.effectDummy.scale.set(.16,.012,.65);this.effectDummy.updateMatrix();this.skids.setMatrixAt(i,this.effectDummy.matrix);});
      if(this.skids.count)this.skids.instanceMatrix.needsUpdate=true;
      this.bursts=this.bursts.filter(v=>race.time-v.time<.55);this.particles.count=this.bursts.length*16;
      this.bursts.forEach((v,b)=>{const age=race.time-v.time;
        for(let i=0;i<16;i++){const a=i*Math.PI/8,r=age*(v.contact?6:4),size=.14*(1-age/.55);
          this.effectDummy.position.set(v.x+Math.cos(a)*r,v.y+Math.sin(i*2)*age+age*2-age*age*5,v.z+Math.sin(a)*r);
          this.effectDummy.scale.set(size,size,size);this.effectDummy.rotation.set(age*4,a,age*3);this.effectDummy.updateMatrix();this.particles.setMatrixAt(b*16+i,this.effectDummy.matrix);this.particles.setColorAt(b*16+i,this.effectColor.setHex(v.color));}
      });
      if(this.particles.count){this.particles.instanceMatrix.needsUpdate=true;this.particles.instanceColor.needsUpdate=true;}
      this.streaks.count=power?20:car.drafting?10:0;
      for(let i=0;i<this.streaks.count;i++){const side=i%2?1:-1,back=((i*.83+race.time*car.speed*.65)%16)-4;
        this.effectDummy.position.set(p.x-Math.sin(followYaw)*back+Math.cos(followYaw)*side*(3+i%3*.6),p.y+.45+i%4*.5,p.z-Math.cos(followYaw)*back-Math.sin(followYaw)*side*(3+i%3*.6));
        this.effectDummy.rotation.set(0,followYaw,0);this.effectDummy.scale.set(.025,.025,power?1.8:.8);this.effectDummy.updateMatrix();this.streaks.setMatrixAt(i,this.effectDummy.matrix);}
      if(this.streaks.count)this.streaks.instanceMatrix.needsUpdate=true;
    }
    this.renderer.render(this.scene,this.camera);
  }
  metrics(){const info=this.renderer?.info;return {renderer:!!this.renderer&&!this.disposed,quality:this.quality,drawCalls:info?.render.calls||0,triangles:info?.render.triangles||0,geometries:info?.memory.geometries||0,textures:info?.memory.textures||0,ownedResources:this.resources.size};}
  dispose(){
    if(this.disposed)return;this.disposed=true;this.resizeObserver?.disconnect();this.abort?.abort();
    this.scene?.clear();for(const resource of this.resources)resource.dispose?.();this.resources.clear();this.materials.clear();
    this.renderer?.renderLists?.dispose();this.renderer?.dispose();this.renderer?.forceContextLoss();this.renderer=null;
  }
}

/** Creates real PNG render data, not a raster substitute for the playable world. */
export function renderArtwork(race,size=640){
  const canvas=document.createElement('canvas');canvas.width=size;canvas.height=size;
  canvas.style.cssText=`position:fixed;left:-10000px;top:0;width:${size}px;height:${size}px`;
  document.body.append(canvas);let view;
  try{view=new RaceRenderer(canvas,race,{quality:'low'});view.render(race,0,1,{hero:true});return canvas.toDataURL('image/png');}
  finally{view?.dispose();canvas.remove();}
}
