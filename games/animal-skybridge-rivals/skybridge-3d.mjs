import * as THREE from './vendor/three/three.module.min.js';
import {LANES,COLORS,clamp,seeded} from './race-core.mjs';

// One retained renderer, one bounded scene; no per-frame geometry/material creation.
export class SkybridgeView {
  constructor(canvas) {
    this.canvas=canvas;this.owned=new Set();this.materials=new Map();this.effects=[];
    this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.motionQuery=matchMedia('(prefers-reduced-motion: reduce)');
    this.motionListener=e=>{this.reduced=e.matches;};this.motionQuery.addEventListener('change',this.motionListener);
    this.renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'low-power'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;
    this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.05;
    this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    this.scene=new THREE.Scene();this.scene.background=new THREE.Color(0xa6dbe5);
    this.scene.fog=new THREE.Fog(0xa6dbe5,65,160);
    this.camera=new THREE.OrthographicCamera(-10,10,16,-16,.1,220);
    this.ray=new THREE.Raycaster();this.ground=new THREE.Plane(new THREE.Vector3(0,1,0),0);this.hit=new THREE.Vector3();
    this.box=this.own(new THREE.BoxGeometry(1,1,1));
    this.ringGeo=this.own(new THREE.TorusGeometry(1,.045,5,36));
    this.cloudGeo=this.own(new THREE.IcosahedronGeometry(1,2));
    this.scene.add(new THREE.HemisphereLight(0xe9faff,0x486377,1.65));
    const sun=new THREE.DirectionalLight(0xffedc4,3.4);sun.position.set(-12,30,10);
    sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);
    Object.assign(sun.shadow.camera,{left:-13,right:13,top:25,bottom:-25,near:1,far:90});
    sun.shadow.bias=-.001;sun.shadow.normalBias=.03;
    this.sun=sun;this.scene.add(sun,sun.target);
    const rim=new THREE.DirectionalLight(0x8dcfff,1.2);rim.position.set(15,8,-20);this.scene.add(rim);
    this.world=new THREE.Group();this.world.scale.z=1.65;this.scene.add(this.world);
    this.ghostMaterial=this.own(new THREE.MeshStandardMaterial({color:0x51819a,transparent:true,opacity:.22,roughness:.8,depthWrite:false}));
    this.actorModels=[];this.pickupInstances=[];this.bridgeInstances=[];this.labels=[];
    this.dummy=new THREE.Object3D();this.tempColor=new THREE.Color();
    this.marker=new THREE.Mesh(this.ringGeo,this.mat(0xffffff,true));this.marker.rotation.x=-Math.PI/2;this.marker.position.y=.06;this.marker.visible=false;this.scene.add(this.marker);
    this.markerLife=0;this.lastNow=0;this.cameraCenter=9;
    canvas.dataset.renderer='three-webgl2';
  }
  own(v){this.owned.add(v);return v;}
  mat(color,glow=false) {
    const key=`${color}:${glow}`;
    if(!this.materials.has(key))this.materials.set(key,this.own(new THREE.MeshStandardMaterial({
      color,roughness:glow?.32:.72,metalness:glow?.25:.05,
      emissive:glow?color:0,emissiveIntensity:glow?.2:0})));
    return this.materials.get(key);
  }
  cube(parent,color,x,y,z,sx,sy,sz,glow=false) {
    const m=new THREE.Mesh(this.box,this.mat(color,glow));m.position.set(x,y,z);m.scale.set(sx,sy,sz);
    m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;
  }
  instance(parent,color,count,positions) {
    const m=new THREE.InstancedMesh(this.box,this.mat(color),count);m.receiveShadow=true;m.castShadow=true;
    positions.forEach((p,i)=>{this.dummy.position.set(p[0],p[1],p[2]);this.dummy.scale.set(p[3],p[4],p[5]);this.dummy.rotation.set(0,0,0);this.dummy.updateMatrix();m.setMatrixAt(i,this.dummy.matrix);});
    parent.add(m);return m;
  }
  tree(parent,x,z,kind=0) {
    this.cube(parent,0x977852,x,.8,z,.35,1.7,.35);
    this.cube(parent,kind?0xc68bb8:0x42897c,x,1.9,z,1.65,1.4,1.5);
    this.cube(parent,kind?0xe3b3c5:0x6db292,x-.28,2.6,z-.1,1.15,.35,1.0);
  }
  character(id) {
    const root=new THREE.Group(),body=new THREE.Group();root.add(body);
    const palettes=[{fur:0xf48b32,light:0xffe6bb,dark:0x674232},{fur:0xe6ae54,light:0xffe2a2,dark:0x945327},
      {fur:0x84ba64,light:0xe2dca5,dark:0x2c6a5c},{fur:0xf4e9df,light:0xffffff,dark:0x26344c}];
    const p=palettes[id],accent=COLORS[id];
    this.cube(body,p.fur,0,.74,0,.66,.72,.48);
    this.cube(body,p.light,0,.73,-.255,.41,.5,.075);
    const head=new THREE.Group();head.position.y=1.42;body.add(head);
    if(id===1){this.cube(head,p.dark,0,0,.06,1.23,1.15,.75);for(let i=0;i<5;i++)this.cube(head,0xc5782c,-.5+i*.25,.58,.1,.23,.25,.55);}
    this.cube(head,p.fur,0,0,0,.94,.78,.66);
    this.cube(head,p.light,0,-.24,-.39,.65,.28,.27);
    this.cube(head,p.dark,0,-.16,-.55,.18,.13,.1);
    for(const sign of [-1,1]) {
      if(id===3)this.cube(head,p.dark,sign*.24,.02,-.35,.32,.33,.06);
      this.cube(head,0xffffff,sign*.225,.055,-.37,.22,.27,.035);
      this.cube(head,id===2?0x22654b:0x2481b2,sign*.2,.04,-.396,.115,.20,.035);
      this.cube(head,0x14253c,sign*.19,.04,-.42,.055,.15,.018);
      this.cube(head,0xffffff,sign*.19,.105,-.435,.048,.055,.014);
      if(id!==2){
        this.cube(head,id===3?p.dark:p.fur,sign*.37,.49,.03,id===0?.25:.28,id===0?.48:.24,.28);
        if(id===0){this.cube(head,p.dark,sign*.37,.74,.03,.24,.12,.27);this.cube(head,p.light,sign*.37,.5,-.12,.12,.24,.035);}
      }
      this.cube(head,p.dark,sign*.225,.25,-.37,.28,.055,.05);
    }
    // Fia's original blue scarf, stepped lightning crest and fox tail.
    this.cube(body,id===0?0x159bd5:accent,0,1.01,-.02,.8,.17,.62);
    const scarf=this.cube(body,id===0?0x159bd5:accent,.33,.83,.27,.23,.48,.11);scarf.rotation.z=-.15;
    this.cube(body,0xffd35a,.28,.94,-.36,.15,.15,.06,true);
    if(id===0){
      this.cube(head,0xffcf3f,.04,.23,-.35,.09,.29,.08);this.cube(head,0xffcf3f,-.045,.10,-.35,.18,.07,.08);
      const tail=new THREE.Group();tail.position.set(0,.45,.28);tail.rotation.x=.7;body.add(tail);
      this.cube(tail,p.fur,0,0,.25,.3,.35,.55);this.cube(tail,p.fur,0,.13,.59,.44,.42,.36);this.cube(tail,p.light,0,.25,.86,.34,.32,.26);
    }
    if(id===2){this.cube(body,p.dark,0,.82,.28,.87,.83,.37);this.cube(body,0x64ac80,0,.9,.5,.56,.52,.12);}
    const limbs=[];
    for(const sign of [-1,1]) {
      const leg=new THREE.Group();leg.position.set(sign*.22,.4,0);body.add(leg);
      this.cube(leg,p.fur,0,-.12,0,.26,.38,.28);this.cube(leg,p.dark,0,-.30,-.05,.29,.2,.4);
      this.cube(leg,p.light,0,-.3,-.24,.24,.13,.035);limbs.push(leg);
      const arm=new THREE.Group();arm.position.set(sign*.47,.97,0);body.add(arm);
      this.cube(arm,p.fur,0,-.2,0,.24,.4,.25);this.cube(arm,p.dark,0,-.4,-.02,.29,.19,.31);limbs.push(arm);
    }
    const stack=new THREE.Group();root.add(stack);
    const tiles=[];for(let i=0;i<20;i++){const m=this.cube(stack,accent,0,1.0+i*.145,.41,.72,.115,.53,true);tiles.push(m);}
    const ring=new THREE.Mesh(this.ringGeo,this.mat(accent,true));ring.rotation.x=-Math.PI/2;ring.scale.setScalar(id===0?.75:.58);ring.position.y=.035;root.add(ring);
    root.scale.set(1.23,1.23,1.23/1.65);
    this.world.add(root);return {root,body,limbs,tiles,ring,head};
  }
  build(race) {
    this.clearWorld();this.race=race;this.cameraCenter=8;this.cameraSector=-1;
    const palette=[0xbadfe8,0xb8dfcc,0xc9dbe8,0xeac4b4,0x8bb3cd,0xa6b2d2][race.stage.chapter];
    this.scene.background.setHex(palette);this.scene.fog.color.setHex(palette);
    for(const platform of race.platforms){
      const mid=(platform.start+platform.end)/2,len=platform.end-platform.start;
      this.cube(this.world,0x64808f,0,-1.05,-mid,16.8,1.8,len+.3);
      this.cube(this.world,0xf0e8d5,0,-.2,-mid,16.9,.45,len+.3);
      this.cube(this.world,0xd1b77e,0,-.42,-mid,17.15,.16,len+.45);
      const paving=[];for(let x=-7;x<=7;x+=2)for(let y=platform.start+.65;y<platform.end;y+=1.7)paving.push([x,.045,-y,1.92,.05,1.6]);
      this.instance(this.world,0xe2dac6,paving.length,paving);
      for(const side of [-1,1]){
        const posts=[];for(let y=platform.start+1;y<platform.end;y+=2)posts.push([side*8.1,.5,-y,.16,1,.16]);
        this.instance(this.world,0xb99550,posts.length,posts);
        this.cube(this.world,0xe5c071,side*8.1,.92,-mid,.13,.12,len-.8,true);
        this.tree(this.world,side*7.25,-platform.start-.5,race.stage.chapter===3);
      }
      // Floating island's stepped underside and suspended blue crystals.
      this.cube(this.world,0x536b82,0,-2.15,-mid,12.5,.7,len*.72);
      for(let i=0;i<4;i++)this.cube(this.world,0x79bfcb,-5+i*3.3,-2.85-(i%2)*.8,-mid,.65,1.5+(i%2),.65,true);
    }
    for(const b of race.bridges){
      const instances=[];
      LANES.forEach((x,l)=>{
        const outline=[];for(let j=0;j<b.steps;j++)outline.push([x,-.18,-b.start-(j+.5)*1.15,1.64,.12,1.06]);
        const ghosts=this.instance(this.world,0x7395a2,b.steps,outline);ghosts.material=this.ghostMaterial;ghosts.castShadow=false;
        const tiles=this.instance(this.world,0xffffff,b.steps,outline);tiles.instanceMatrix.setUsage(THREE.DynamicDrawUsage);instances.push(tiles);
        const gate=new THREE.Group();gate.position.set(x,0,-b.start+.25);this.world.add(gate);
        this.cube(gate,0x285a6b,0,.08,0,1.75,.12,.85);
        for(const sign of [-1,1]){this.cube(gate,0xb8995d,sign*.88,.47,0,.13,.85,.13);this.cube(gate,COLORS[l],sign*.88,.94,0,.24,.16,.24,true);}
        // Arrow in the actual surface plane, pointing toward the bridge.
        for(let k=0;k<3;k++)this.cube(gate,0xffebad,(k-1)*.23,.17,.1+Math.abs(k-1)*.22,.2,.045,.2,true);
        const c=document.createElement('canvas');c.width=128;c.height=56;
        const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;
        const material=new THREE.SpriteMaterial({map:texture,depthTest:false});
        const label=new THREE.Sprite(material);label.position.set(x,.75,-b.start+.85);label.scale.set(1.7,.75,1);this.world.add(label);
        this.labels.push({canvas:c,texture,material,b,l,label,last:-1});
      });this.bridgeInstances.push(instances);
    }
    // The finish has a physical chequered line and an illuminated arch.
    const fy=race.finishY;
    for(let x=-7;x<=7;x++)this.cube(this.world,x%2?0xf9f0d6:0x2c5367,x,.085,-fy,.99,.035,.75);
    for(const sign of [-1,1]){this.cube(this.world,0xd0a558,sign*3,1.75,-fy,.45,3.5,.6);this.cube(this.world,0xefe0aa,sign*3,3.5,-fy,.7,.3,.8);}
    this.cube(this.world,0xf2ce70,0,3.8,-fy,6.5,.48,.65,true);
    for(let i=0;i<5;i++)this.cube(this.world,0xffdf80,(i-2)*.62,4.2+(2-Math.abs(i-2))*.18,-fy,.55,.45,.55,true);
    this.actorModels=race.actors.map(a=>this.character(a.id));
    for(let c=0;c<4;c++){
      const list=race.pickups.filter(p=>p.color===c),m=this.instance(this.world,COLORS[c],list.length,list.map(p=>[p.x,.17,-p.y,.68,.18,.46]));
      m.material=this.mat(COLORS[c],true);m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);this.pickupInstances.push({mesh:m,list});
    }
    this.hazardModels=race.hazards.map(()=>{
      const g=new THREE.Group();this.world.add(g);
      this.cube(g,0x48657d,0,.6,0,1.35,.65,.8);this.cube(g,0x71889b,.55,.75,0,.75,.5,.6);
      for(const x of [-.3,.3])this.cube(g,0xffd36b,x,.63,-.43,.16,.12,.06,true);
      const ring=new THREE.Mesh(this.ringGeo,this.mat(0xffc865,true));ring.rotation.x=-Math.PI/2;ring.scale.setScalar(1.12);ring.position.y=.07;g.add(ring);
      return {g,ring};
    });
    const rng=seeded(82),clouds=[];
    for(let i=0;i<55;i++){
      const x=(rng()-.5)*45,y=-4-rng()*5,z=10-rng()*(race.finishY+25);
      clouds.push([x,y,z,3+rng()*7,.6+rng()*1.2,2+rng()*4]);
    }
    const cloudMesh=new THREE.InstancedMesh(this.cloudGeo,this.mat(0xf3eee7),clouds.length);
    clouds.forEach((p,i)=>{this.dummy.position.set(p[0],p[1],p[2]);this.dummy.scale.set(p[3],p[4],p[5]);this.dummy.rotation.set(0,0,0);this.dummy.updateMatrix();cloudMesh.setMatrixAt(i,this.dummy.matrix);});
    this.world.add(cloudMesh);
    this.particleMesh=new THREE.InstancedMesh(this.box,this.mat(0xffffff,true),96);this.particleMesh.count=0;this.particleMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);this.world.add(this.particleMesh);
    this.resize();
  }
  clearWorld(){
    for(const l of this.labels){l.texture.dispose();l.material.dispose();}this.labels=[];
    this.world.traverse(o=>{if(o.isInstancedMesh)o.dispose();});this.world.clear();
    this.effects.length=0;this.actorModels=[];this.bridgeInstances=[];this.pickupInstances=[];
  }
  resize(){
    const r=this.canvas.getBoundingClientRect();if(r.width<2||r.height<2)return;
    this.width=r.width;this.height=r.height;this.renderer.setSize(r.width,r.height,false);
    this.fitCamera();
  }
  fitCamera(){
    if(!this.race||!this.width)return;
    const aspect=this.width/this.height;
    const sector=clamp(this.race.player.sector,0,this.race.bridges.length-1),b=this.race.bridges[sector];
    const platform=this.race.platforms[sector];
    const span=b.end-platform.start+6;
    // Same sector and all four routes at every ratio; extra area is decorative sky.
    const pitch=aspect>1.8?.48:.68;
    const projectedSpan=span*1.65*Math.sin(pitch)+3;
    const halfH=Math.max(projectedSpan/2,18.8/(2*aspect));
    Object.assign(this.camera,{left:-halfH*aspect,right:halfH*aspect,top:halfH,bottom:-halfH});
    this.camera.updateProjectionMatrix();this.pitch=pitch;
    this.desiredCenter=(platform.start+b.end+4)/2*1.65;
  }
  point(clientX,clientY){
    const r=this.canvas.getBoundingClientRect();
    this.ray.setFromCamera(new THREE.Vector2((clientX-r.left)/r.width*2-1,-(clientY-r.top)/r.height*2+1),this.camera);
    if(!this.ray.ray.intersectPlane(this.ground,this.hit))return null;
    return {x:this.hit.x,y:-this.hit.z/1.65};
  }
  project(x,y,height=0){
    const p=new THREE.Vector3(x,height,-y*1.65).project(this.camera),r=this.canvas.getBoundingClientRect();
    return {x:r.left+(p.x+1)*r.width/2,y:r.top+(1-p.y)*r.height/2};
  }
  acknowledge(x,y){this.marker.position.set(x,.09,-y*1.65);this.markerLife=.6;}
  event(e){
    if(this.reduced&&e.type!=='pickup')return;
    if(!['pickup','build','bump','checkpoint','finish','dash'].includes(e.type))return;
    const amount=e.type==='finish'?36:e.type==='pickup'?3:8;
    for(let i=0;i<amount&&this.effects.length<96;i++)this.effects.push({
      type:e.type,x:e.type==='pickup'?e.fromX:e.x,z:-(e.type==='pickup'?e.fromY:e.y),h:.3,
      tx:e.x,tz:-e.y,color:COLORS[e.id]||COLORS[0],life:e.type==='finish'?1.5:.45,max:e.type==='finish'?1.5:.45,
      vx:Math.sin(i*2.4)*2,vz:Math.cos(i*2.4)*2,vy:2+(i%4),id:e.id});
  }
  render(race,now,paused=false){
    if(!race)return;
    const dt=paused?0:clamp((now-this.lastNow)/1000,0,.04);this.lastNow=now;
    if(this.cameraSector!==race.player.sector){this.cameraSector=race.player.sector;this.fitCamera();}
    this.cameraCenter+=(this.desiredCenter-this.cameraCenter)*(this.reduced?1:Math.min(1,dt*4));
    this.camera.position.set(0,Math.sin(this.pitch)*38,-this.cameraCenter+Math.cos(this.pitch)*38);
    this.camera.lookAt(0,0,-this.cameraCenter);this.camera.updateMatrixWorld();
    this.sun.position.z=12-this.cameraCenter;this.sun.target.position.z=-this.cameraCenter;
    race.actors.forEach((a,i)=>{
      const m=this.actorModels[i],stride=a.moving&&!paused&&!race.ended?Math.sin(race.elapsed*14):0;
      m.root.position.set(a.x,0,-a.y);m.body.position.y=this.reduced?0:Math.abs(stride)*.075;
      // Fia faces travel; the camera sees a readable head and cyan back stack.
      const angle=-a.facing;
      m.body.rotation.y+=Math.atan2(Math.sin(angle-m.body.rotation.y),Math.cos(angle-m.body.rotation.y))*.22;
      m.limbs.forEach((l,j)=>l.rotation.x=this.reduced?0:stride*(j%3?-.6:.6));
      m.body.rotation.z=!this.reduced&&a.stun>0?Math.sin(race.elapsed*45)*.13:0;
      m.tiles.forEach((t,k)=>{t.visible=k<a.stack;t.position.x=Math.sin(race.elapsed*8-k*.15)*(a.moving&&!this.reduced?.025:0);});
      m.ring.scale.setScalar((i===0?.75:.58)*(a.dashTime>0?1.22:1));
      m.ring.visible=a.invulnerable<=0||Math.floor(race.elapsed*10)%2===0;
    });
    for(const {mesh,list} of this.pickupInstances){
      list.forEach((p,i)=>{
        const active=p.readyAt<=race.elapsed,scale=active?clamp((race.elapsed-p.readyAt)*5,0,1):0;
        this.dummy.position.set(p.x,.20+(this.reduced?0:Math.sin(race.elapsed*2+p.phase)*.035),-p.y);
        this.dummy.scale.set(.68*scale,.19*scale,.47*scale);this.dummy.rotation.set(0,0,0);this.dummy.updateMatrix();mesh.setMatrixAt(i,this.dummy.matrix);
      });mesh.instanceMatrix.needsUpdate=true;
    }
    race.bridges.forEach((b,bi)=>LANES.forEach((x,l)=>{
      const m=this.bridgeInstances[bi][l];
      for(let j=0;j<b.steps;j++){
        const owner=b.tiles[l][j],neutral=b.bonuses[l].includes(j),active=owner>=0||neutral;
        this.dummy.position.set(x,active?.04:-.18,-b.start-(j+.5)*1.15);
        this.dummy.scale.set(active?1.62:0,.22,1.1);this.dummy.rotation.set(0,0,0);this.dummy.updateMatrix();m.setMatrixAt(j,this.dummy.matrix);
        m.setColorAt(j,this.tempColor.setHex(neutral?0xf5d995:COLORS[owner]||COLORS[0]));
      }m.instanceMatrix.needsUpdate=true;if(m.instanceColor)m.instanceColor.needsUpdate=true;
    }));
    for(const label of this.labels){
      const n=label.b.tiles[label.l].filter((owner,j)=>owner!==0&&!label.b.bonuses[label.l].includes(j)).length;
      if(n!==label.last){
        label.last=n;const c=label.canvas.getContext('2d');c.clearRect(0,0,128,56);
        c.fillStyle='#143b4ce8';c.beginPath();c.roundRect(2,2,124,52,10);c.fill();
        c.strokeStyle='#8ae9ed';c.lineWidth=2;c.stroke();c.fillStyle='#32e5ef';c.fillRect(20,18,23,14);c.fillStyle='#fff4ca';c.font='bold 30px system-ui';c.textAlign='left';c.fillText(String(n),57,39);label.texture.needsUpdate=true;
      }
    }
    race.hazards.forEach((h,i)=>{const m=this.hazardModels[i];m.g.position.set(h.x,0,-h.y);m.ring.material=this.mat(h.active?0xfa6e4e:0xffd36b,true);m.ring.scale.setScalar(h.radius*(h.active?1:.65));});
    this.markerLife=Math.max(0,this.markerLife-dt);this.marker.visible=this.markerLife>0;this.marker.scale.setScalar(.35+(1-this.markerLife/.6)*.35);
    this.effects=this.effects.filter(p=>{p.life-=dt;return p.life>0;});this.particleMesh.count=this.effects.length;
    this.effects.forEach((p,i)=>{
      const progress=1-p.life/p.max;
      if(p.type==='pickup'){
        const a=race.actors[p.id];p.x+=(a.x-p.x)*dt*12;p.z+=(-a.y-p.z)*dt*12;p.h=.3+progress*1.8;
      }else{p.x+=p.vx*dt;p.z+=p.vz*dt;p.h+=p.vy*dt;p.vy-=8*dt;}
      this.dummy.position.set(p.x,p.h,p.z);this.dummy.scale.setScalar((p.type==='pickup'?.18:.1)*(1-progress*.8));
      this.dummy.rotation.set(progress*4,progress*5,0);this.dummy.updateMatrix();this.particleMesh.setMatrixAt(i,this.dummy.matrix);this.particleMesh.setColorAt(i,this.tempColor.setHex(p.color));
    });this.particleMesh.instanceMatrix.needsUpdate=true;if(this.particleMesh.instanceColor)this.particleMesh.instanceColor.needsUpdate=true;
    this.renderer.render(this.scene,this.camera);
  }
  stats(){return {geometries:this.renderer.info.memory.geometries,textures:this.renderer.info.memory.textures,calls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,effects:this.effects.length,contexts:1};}
  dispose(){this.clearWorld();this.motionQuery.removeEventListener('change',this.motionListener);for(const r of this.owned)r.dispose();this.owned.clear();this.renderer.dispose();}
}
