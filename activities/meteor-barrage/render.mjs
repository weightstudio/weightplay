import * as THREE from '../../games/pawflow/vendor/three/three.module.min.js';
import {shieldPositions} from './physics.mjs?v=2';
export class MeteorScene {
  constructor(canvas,arena) {
    this.arena=arena;this.renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.75));this.renderer.setClearColor(0x081424);
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.scene=new THREE.Scene();
    this.camera=new THREE.OrthographicCamera(-180,180,240,-240,.1,1500);this.camera.position.set(180,240,700);
    this.box=new THREE.BoxGeometry(1,1,1);this.rock=new THREE.IcosahedronGeometry(1,0);this.materials=new Map();this.targets=new Map();this.fragments=[];this.trail=[];
    this.scene.add(new THREE.HemisphereLight(0xbdefff,0x18203b,2.3));
    const light=new THREE.DirectionalLight(0xffffff,3.1);light.position.set(-150,480,500);this.scene.add(light);
    const rim=new THREE.DirectionalLight(0xff8844,2.2);rim.position.set(400,300,200);this.scene.add(rim);
    this.static=new THREE.Group();this.scene.add(this.static);
    this.buildWorld();this.cannon=this.buildCannon();this.scene.add(this.cannon);
    this.ball=this.cube(13,13,13,0x8dffff);this.scene.add(this.ball);
    this.aimDots=Array.from({length:13},()=>{const m=this.cube(3,3,3,0x75eeff,true);this.scene.add(m);return m;});
    this.shields=Array.from({length:3},()=>{const g=new THREE.Group();g.add(this.cube(26,21,9,0xa985ff));const p=this.cube(21,16,11,0x49386b);g.add(p);g.add(this.at(this.cube(4,11,13,0xefc9ff,true),0,0,3));this.scene.add(g);return g;});
    this.particles=Array.from({length:60},()=>{const m=this.cube(4,4,4,0x9afaff,true);m.visible=false;this.scene.add(m);return {mesh:m,life:0,vx:0,vy:0,vz:0};});
    // Area damage has its own pool: crowded fragment bursts cannot hide its cause.
    this.ring=new THREE.RingGeometry(.97,1,40);this.disc=new THREE.CircleGeometry(1,40);
    const effectMesh=(geometry,color,opacity)=>{const material=new THREE.MeshBasicMaterial({color,transparent:true,opacity,depthWrite:false});const mesh=new THREE.Mesh(geometry,material);mesh.visible=false;this.scene.add(mesh);return mesh;};
    this.blasts=Array.from({length:4},()=>({life:0,outline:effectMesh(this.ring,0xffb94f,.8),wave:effectMesh(this.ring,0xffedb5,1),fill:effectMesh(this.disc,0xff8c32,.12)}));
    this.links=Array.from({length:12},()=>({life:0,mesh:effectMesh(this.box,0xffd48b,.9)}));
    this.contacts=Array.from({length:12},()=>({life:0,mesh:effectMesh(this.ring,0xa6faff,1)}));
    this.trails=Array.from({length:12},()=>{const m=this.cube(7,7,7,0x3da8cf,true);m.visible=false;this.scene.add(m);return m;});
    this.recoil=0;this.descent=null;this.pendingBreaches=[];this.resize();
  }
  mat(color,glow=false){const key=color+':'+glow;if(!this.materials.has(key))this.materials.set(key,new THREE.MeshStandardMaterial({color,roughness:.62,metalness:.18,emissive:glow?color:0,emissiveIntensity:glow?.9:0}));return this.materials.get(key);}
  cube(w,h,d,color,glow=false){const m=new THREE.Mesh(this.box,this.mat(color,glow));m.scale.set(w,h,d);return m;}
  at(obj,x,y,z=0){obj.position.set(x,y,z);return obj;}
  buildWorld(){
    // Layered orbital dock: structural struts, inset panels, illuminated rails.
    const add=(m,x,y,z)=>this.static.add(this.at(m,x,y,z));
    add(this.cube(1300,1100,10,0x0b1c30),180,240,-100);
    const tiles=[[],[]];for(let row=-4;row<15;row++)for(let col=-9;col<10;col++)tiles[Math.abs(row+col)%2].push([180+col*50,row*50]);
    tiles.forEach((positions,index)=>{const mesh=new THREE.InstancedMesh(this.box,this.mat(index?0x0c2236:0x10283e),positions.length),dummy=new THREE.Object3D();
      positions.forEach(([x,y],i)=>{dummy.position.set(x,y,-88);dummy.scale.set(47,47,3);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);});this.static.add(mesh);});
    for(const x of [7,353]){add(this.cube(12,420,18,0x1b3d53),x,260,-2);add(this.cube(3,409,5,0x36cee1,true),x,260,10);
      for(let i=0;i<8;i++)add(this.cube(20,6,21,0x486076),x,80+i*53,-1);}
    add(this.cube(358,8,22,0x253e56),180,472,0);add(this.cube(331,2,5,0x5ee6f3,true),180,470,15);
    add(this.cube(342,34,22,0x1e3851),180,28,-10);add(this.cube(320,3,8,0xfabf63,true),180,65,0);
    for(let i=0;i<7;i++)add(this.cube(32,12,3,0x3a5c74),30+i*50,26,5);
    for(let i=0;i<35;i++){const x=((i*97)%1100)-370,y=((i*173)%900)-210;add(this.cube(2,2,2,0x6597ac,true),x,y,-75);}
    // Fia: separate cuboid muzzle, angular ears, lightning paws and comet scarf.
    const fox=new THREE.Group();const f=(w,h,d,c,x,y,z=0)=>fox.add(this.at(this.cube(w,h,d,c),x,y,z));
    f(24,20,14,0xec862b,0,0);f(28,26,18,0xfa9b38,0,22);f(9,15,11,0x563836,-10,40);f(9,15,11,0x563836,10,40);
    f(6,10,12,0xffbf77,-10,40,1);f(6,10,12,0xffbf77,10,40,1);f(19,9,7,0xffe9c9,0,16,12);
    f(5,4,4,0x513833,0,20,17);for(const x of [-7,7]){f(5,7,3,0xeaf9ff,x,26,10);f(3,5,4,0x1d3959,x,26,12);}
    f(27,6,19,0x15a4df,0,7);f(26,6,5,0x2586c5,-19,3,5);f(15,5,5,0xffdc43,-38,1,5);
    f(9,11,12,0xf6b743,-17,-1,6);f(9,11,12,0xf6b743,17,-1,6);f(6,5,13,0xffed73,-17,0,7);f(6,5,13,0xffed73,17,0,7);
    f(9,10,12,0x513b37,-7,-13);f(9,10,12,0x513b37,7,-13);fox.position.set(115,34,18);fox.scale.setScalar(.9);this.fox=fox;this.static.add(fox);
  }
  buildCannon(){const g=new THREE.Group();g.add(this.cube(47,24,22,0x335a71));g.add(this.at(this.cube(38,13,27,0x527c90),0,7,1));
    this.barrel=new THREE.Group();this.barrel.add(this.at(this.cube(20,36,21,0x3f7488),0,13,8));this.barrel.add(this.at(this.cube(12,37,24,0x39c5d1),0,15,8));this.barrel.add(this.at(this.cube(24,8,27,0xb2eff5),0,32,8));this.barrel.add(this.at(this.cube(13,7,28,0x123b51),0,35,9));
    g.add(this.barrel);g.position.set(180,34,25);return g;}
  makeTarget(t){const g=new THREE.Group();const c=t.type==='blast'?0xe88932:t.type==='core'?0x9662c5:0x5d728d;
    const body=new THREE.Mesh(this.rock,this.mat(c));body.scale.set(t.r,t.r,t.r*.8);body.rotation.set(.22,.33,.1);g.add(body);
    for(let i=0;i<4;i++){const shard=this.cube(t.r*.52,t.r*.4,t.r*.4,c);shard.position.set(Math.cos(i*1.7)*t.r*.55,Math.sin(i*1.7)*t.r*.55,t.r*.65);shard.rotation.z=i*.6;g.add(shard);}
    const face=this.cube(t.r*.55,t.r*.55,5,t.type==='stone'||t.type==='armor'?0x9bbbd0:0xffcf7c,true);face.rotation.z=Math.PI/4;face.position.z=t.r*.82;g.add(face);
    const armor=new THREE.Group();for(const x of [-1,1])armor.add(this.at(this.cube(8,t.r*1.7,8,0xb4bdcd),x*t.r*.55,0,t.r*.95));g.add(armor);g.userData={body,armor,face};this.scene.add(g);return g;}
  resize(){const {width,height}=this.arena.getBoundingClientRect();this.w=width;this.h=height;this.landscape=width>height*1.35;const aspect=width/Math.max(1,height),vh=Math.max(this.landscape?360:480,(this.landscape?480:360)/aspect),vw=vh*aspect;this.vw=vw;this.vh=vh;
    this.scene.rotation.z=this.landscape?-Math.PI/2:0;this.scene.position.set(this.landscape?-60:0,this.landscape?420:0,0);
    this.fox.rotation.z=this.landscape?Math.PI/2:0;
    this.camera.left=-vw/2;this.camera.right=vw/2;this.camera.top=vh/2;this.camera.bottom=-vh/2;this.camera.updateProjectionMatrix();this.renderer.setSize(width,height,false);}
  point(clientX,clientY){const r=this.arena.getBoundingClientRect(),dx=((clientX-r.left)/r.width-.5)*this.vw,dy=(.5-(clientY-r.top)/r.height)*this.vh;return this.landscape?{x:180-dy,y:240+dx}:{x:180+dx,y:240+dy};}
  screen(x,y){const dx=this.landscape?y-240:x-180,dy=this.landscape?180-x:y-240;return{x:(.5+dx/this.vw)*this.w,y:(.5-dy/this.vh)*this.h};}
  get isAdvancing(){return !!this.descent;}
  get presentationActive(){return this.isAdvancing||this.blasts.some(p=>p.life>0)||this.contacts.some(p=>p.life>0)||this.particles.some(p=>p.life>0);}
  resetPresentation(){
    this.descent=null;this.pendingBreaches=[];this.trail=[];this.recoil=0;
    for(const p of this.particles){p.life=0;p.mesh.visible=false;}
    for(const p of [...this.links,...this.contacts]){p.life=0;p.mesh.visible=false;}
    for(const p of this.blasts){p.life=0;p.outline.visible=p.wave.visible=p.fill.visible=false;}
    for(const m of this.targets.values())m.userData.death=0;
  }
  descend(event,reduced){this.descent={elapsed:0,duration:reduced?.16:.38,reduced,targets:new Map(event.targets.map(t=>[t.id,t]))};}
  targetPosition(t){const move=this.descent?.targets.get(t.id);if(!move)return{x:t.x,y:t.y};const u=Math.min(1,this.descent.elapsed/this.descent.duration),ease=u*u*(3-2*u);return{x:move.x,y:this.descent.reduced?move.toY:move.fromY+(move.toY-move.fromY)*ease};}
  burst(event,reduced){
    if(event.kind==='breach'&&this.descent){this.pendingBreaches.push(event);return;}
    const strong=event.kind==='blast'||event.kind==='core',color=event.kind==='shield'||event.kind==='armor'?0xc3a0ff:strong||event.source?0xffb94f:event.kind==='breach'?0xff6d64:0x88efff;
    this.recoil=Math.max(this.recoil,event.kind==='core'?.24:strong?.16:.07);
    if(['destroy','core'].includes(event.kind)){const target=this.targets.get(event.targetId);if(target)target.userData.death=reduced?.16:.3;}
    if(strong){
      const p=this.blasts.find(p=>p.life<=0)||this.blasts.reduce((a,b)=>a.life<b.life?a:b);p.life=p.duration=reduced?.45:.72;p.radius=event.radius||70;p.reduced=reduced;
      for(const mesh of [p.outline,p.wave,p.fill]){mesh.position.set(event.x,event.y,55);mesh.visible=true;}
    }
    if(event.kind==='hit'&&event.source){const p=this.links.find(p=>p.life<=0);if(p){const dx=event.x-event.source.x,dy=event.y-event.source.y;p.life=p.duration=.56;p.mesh.position.set((event.x+event.source.x)/2,(event.y+event.source.y)/2,57);p.mesh.rotation.z=Math.atan2(dy,dx);p.mesh.scale.set(Math.hypot(dx,dy),reduced?2:3.5,1);p.mesh.visible=true;}}
    if(['hit','armor','shield','breach'].includes(event.kind)){const p=this.contacts.find(p=>p.life<=0);if(p){p.life=p.duration=event.source?.56:.26;p.radius=event.kind==='breach'?27:22;p.reduced=reduced;p.mesh.material.color.setHex(color);p.mesh.position.set(event.x,event.y,58);p.mesh.visible=true;}}
    const count=reduced?2:strong?12:event.kind==='hit'?4:8;let n=0;
    for(const p of this.particles){if(p.life>0)continue;if(n++>=count)break;const a=n*2.4;p.life=p.duration=reduced?.16:strong?.6:.42;p.mesh.visible=true;p.mesh.position.set(event.x,event.y,38);p.vx=Math.cos(a)*(strong?150:80);p.vy=Math.sin(a)*(strong?150:80);p.vz=30;p.size=strong?5:3;p.mesh.material=this.mat(color,true);}
  }
  draw(run,angle,dt,reduced,skin='standard') {
    if(this.descent){this.descent.elapsed+=dt;if(this.descent.elapsed>=this.descent.duration){this.descent=null;for(const event of this.pendingBreaches)this.burst(event,reduced);this.pendingBreaches=[];}}
    const ids=new Set(run.targets.map(t=>t.id));for(const [id,m] of this.targets)if(!ids.has(id)){this.scene.remove(m);this.targets.delete(id);}
    for(const t of run.targets){let m=this.targets.get(t.id);if(m?.userData.type!==t.type){if(m)this.scene.remove(m);m=this.makeTarget(t);m.userData.type=t.type;this.targets.set(t.id,m);}m.userData.death=Math.max(0,(m.userData.death||0)-dt);const movingBreach=this.descent?.targets.get(t.id)?.breached;m.visible=t.hp>0||m.userData.death>0||movingBreach;const p=this.targetPosition(t);m.position.set(p.x,p.y,20);m.rotation.z=reduced?0:Math.sin(run.time*.7+t.x)*.06;
      const k=t.hp<=0&&!movingBreach&&!reduced?Math.max(.05,m.userData.death/.3):t.flash>0&&!reduced?1+t.flash*.35:1;m.scale.setScalar(k);m.userData.armor.visible=!!t.armor;m.userData.face.material=this.mat(t.flash>0?0xffffff:t.type==='stone'||t.type==='armor'?0x9bbbd0:0xffcf7c,true);}
    const core=run.targets.find(t=>t.type==='core'),coreOffset=core?this.targetPosition(core).y-core.y:0;
    for(const m of this.shields)m.visible=false;for(const s of shieldPositions(run)){const m=this.shields[s.index];m.visible=true;m.position.set(s.x,s.y+coreOffset,38);m.rotation.z=s.angle;}
    this.barrel.rotation.z=(angle-90)*Math.PI/180;this.barrel.position.y=!reduced?-this.recoil*18:0;this.recoil=Math.max(0,this.recoil-dt);
    this.barrel.children[1].material=this.mat(skin==='violet'?0xa873e5:0x39c5d1);this.barrel.children[2].material=this.mat(skin==='violet'?0xdfbcff:0xb2eff5);
    this.ball.material=this.mat(skin==='violet'?0xd8a1ff:0x8dffff,true);this.ball.visible=!!run.shot;
    if(run.shot){this.ball.position.set(run.shot.x,run.shot.y,35);this.ball.rotation.z=run.time*7;if(dt>0){this.trail.unshift({x:run.shot.x,y:run.shot.y});if(this.trail.length>12)this.trail.pop();}}else this.trail=[];
    this.trails.forEach((m,i)=>{m.visible=!reduced&&!!this.trail[i];if(m.visible){m.position.set(this.trail[i].x,this.trail[i].y,25);m.scale.setScalar((12-i)*.4);}});
    const rad=angle*Math.PI/180;this.aimDots.forEach((m,i)=>{m.visible=run.status==='ready';let x=180+Math.cos(rad)*(i+1)*14,y=38+Math.sin(rad)*(i+1)*14;if(x<17)x=34-x;if(x>343)x=686-x;m.position.set(x,y,35);});
    for(const p of this.particles)if(p.life>0){p.life=Math.max(0,p.life-dt);p.mesh.visible=p.life>0;if(!reduced){p.mesh.position.x+=p.vx*dt;p.mesh.position.y+=p.vy*dt;p.mesh.position.z+=p.vz*dt;p.mesh.rotation.z+=dt*5;}p.mesh.scale.setScalar(reduced?p.size:Math.max(.1,p.size*p.life/p.duration));}
    for(const p of this.blasts)if(p.life>0){p.life=Math.max(0,p.life-dt);const age=p.duration-p.life,fade=Math.min(1,p.life/.28),radius=p.reduced?p.radius:p.radius*Math.min(1,.12+age/.28*.88);for(const m of [p.outline,p.wave,p.fill])m.visible=p.life>0;p.outline.scale.setScalar(p.radius);p.outline.material.opacity=.72*fade;p.fill.scale.setScalar(p.radius);p.fill.material.opacity=.10*fade;p.wave.scale.setScalar(radius);p.wave.material.opacity=.95*fade;}
    for(const p of this.links)if(p.life>0){p.life=Math.max(0,p.life-dt);p.mesh.visible=p.life>0;p.mesh.material.opacity=.85*Math.min(1,p.life/.25);}
    for(const p of this.contacts)if(p.life>0){p.life=Math.max(0,p.life-dt);p.mesh.visible=p.life>0;p.mesh.scale.setScalar(p.radius*(p.reduced?1:1+(1-p.life/p.duration)*.3));p.mesh.material.opacity=Math.min(1,p.life/.18);}
    this.renderer.render(this.scene,this.camera);
  }
  stats(){return {revision:THREE.REVISION,calls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,geometries:this.renderer.info.memory.geometries,textures:this.renderer.info.memory.textures,advancing:this.isAdvancing,blasts:this.blasts.filter(p=>p.life>0).length,blastRadii:this.blasts.filter(p=>p.life>0).map(p=>p.outline.scale.x),links:this.links.filter(p=>p.life>0).length,contacts:this.contacts.filter(p=>p.life>0).length,particles:this.particles.filter(p=>p.life>0).length};}
  dispose(){this.resetPresentation();this.box.dispose();this.rock.dispose();this.ring.dispose();this.disc.dispose();for(const m of this.materials.values())m.dispose();for(const p of this.blasts)for(const m of [p.outline,p.wave,p.fill])m.material.dispose();for(const p of [...this.links,...this.contacts])p.mesh.material.dispose();this.renderer.dispose();}
}
