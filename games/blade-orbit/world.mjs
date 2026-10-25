import * as T from '../purrch-grove/vendor/three/three.module.min.js';
import {ARCS} from './stages.mjs?v=5';
import {LIMITS} from './model.mjs?v=5';
const PALETTE={ember:0xffac52,frost:0x82e7ff,storm:0xb9a3ff,iron:0xc6e8ec};
const ENEMY_COLORS={guard:0x667e91,charger:0xd85b85,ranger:0x9b6bd1,healer:0x4fc1aa,splitter:0x9877ed,small:0x9e7ac4,chaser:0x6852a1,stalker:0x32a9bc,bomber:0xd77c35,summoner:0x72993f};
export class World {
 constructor(host,onLoss=()=>{}){
  this.host=host;this.abort=new AbortController();this.time=0;this.fx=[];this.remains=[];this.shake=0;this.peakEffects=0;this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  this.materials=new Map();this.geometries=[];this.box=this.geo(new T.BoxGeometry(1,1,1));this.tip=this.geo(new T.ConeGeometry(.5,1,4));this.ring=this.geo(new T.TorusGeometry(1,.025,4,48));this.gem=this.geo(new T.OctahedronGeometry(.5,0));
  this.renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));this.renderer.outputColorSpace=T.SRGBColorSpace;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.25;
  this.renderer.domElement.setAttribute('aria-label','3D sword arena');this.renderer.domElement.tabIndex=0;host.prepend(this.renderer.domElement);
  this.scene=new T.Scene();this.scene.background=new T.Color(0x10313d);this.scene.fog=new T.Fog(0x10313d,40,80);
  this.scene.add(new T.HemisphereLight(0xd1efff,0x263631,2.3));const sun=new T.DirectionalLight(0xffdb9a,3.3);sun.position.set(-6,14,8);this.scene.add(sun);const rim=new T.DirectionalLight(0x72d5ff,2);rim.position.set(8,8,-9);this.scene.add(rim);
  this.camera=new T.OrthographicCamera(-10,10,12,-12,.1,100);this.camera.position.set(0,27,20);this.camera.lookAt(0,0,0);
  this.matrix=new T.Matrix4();this.euler=new T.Euler();this.quat=new T.Quaternion();this.pos=new T.Vector3();this.scale=new T.Vector3();this.color=new T.Color();this.hitTint=new T.Color();this.hitLight=new T.Color(0xffefcc);
  this.batches={};this.batch('floor',900);this.batch('scenery',600);this.batch('enemy',2400);this.batch('sword',200);this.batch('swordTip',60,this.tip);this.batch('loot',600);this.batch('gem',350,this.gem);this.batch('fx',300,this.box,false,true);this.batch('hazard',200,this.ring,false,true);this.batch('projectile',110,this.gem,false,true);this.batch('goal',40);this.batch('shadow',130,this.geo(new T.CircleGeometry(1,16)),true);
  this.batch('slash',40,this.geo(new T.RingGeometry(.68,1,24,1,0,Math.PI*.9)),false,true);
  this.batch('trail',48,this.geo(new T.RingGeometry(.95,1.025,20,1,0,.48)),true,true);
  this.batch('pulse',80,this.ring,true,true);this.batch('telegraph',220,this.box,true,true);
  // Only thin danger boundaries render above actors; their footprint remains the simulation radius.
  this.batch('dangerBorder',200,this.geo(new T.TorusGeometry(1,.085,4,48)),true,true);
  this.batch('dangerRing',200,this.geo(new T.TorusGeometry(1,.04,4,48)),true,true);
  this.batch('dangerLaneBorder',400,this.box,true,true);this.batch('dangerLane',400,this.box,true,true);
  for(const name of ['dangerBorder','dangerRing','dangerLaneBorder','dangerLane']){const mesh=this.batches[name].mesh;mesh.material.depthTest=false;mesh.material.depthWrite=false;mesh.material.opacity=name.endsWith('Border')||name==='dangerBorder'?.85:.95;mesh.renderOrder=name.endsWith('Border')||name==='dangerBorder'?8:9;}
  this.batches.trail.mesh.material.opacity=.22;this.batches.slash.mesh.material.transparent=true;this.batches.slash.mesh.material.opacity=.72;this.batches.slash.mesh.material.depthWrite=false;
  this.hero=this.makeHero();this.scene.add(this.hero);this.arc=-1;this.layout='';
  this.renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();onLoss();},{signal:this.abort.signal});
  this.resizeObserver=new ResizeObserver(()=>this.fit());this.resizeObserver.observe(host);this.fit();
 }
 geo(g){this.geometries.push(g);return g;}
 material(color){if(!this.materials.has(color))this.materials.set(color,new T.MeshStandardMaterial({color,roughness:.58,metalness:.16}));return this.materials.get(color);}
 cube(parent,color,size,position,rot=0){const m=new T.Mesh(this.box,this.material(color));m.scale.set(...size);m.position.set(...position);m.rotation.z=rot;parent.add(m);return m;}
 batch(name,max,geometry=this.box,flat=false,glow=false){const mat=flat||glow?new T.MeshBasicMaterial({color:0xffffff,transparent:flat,opacity:flat?(glow?.48:.19):1,depthWrite:!flat,side:T.DoubleSide}):new T.MeshStandardMaterial({color:0xffffff,roughness:.65,metalness:.1});const mesh=new T.InstancedMesh(geometry,mat,max);mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);mesh.frustumCulled=false;mesh.count=0;this.scene.add(mesh);this.batches[name]={mesh,max,n:0};}
 part(name,x,y,z,sx,sy,sz,color,rx=0,ry=0,rz=0){const b=this.batches[name];if(b.n>=b.max)return;this.pos.set(x,y,z);this.scale.set(sx,sy,sz);this.euler.set(rx,ry,rz);this.quat.setFromEuler(this.euler);this.matrix.compose(this.pos,this.quat,this.scale);b.mesh.setMatrixAt(b.n,this.matrix);b.mesh.setColorAt(b.n,this.color.set(color));b.n++;}
 finish(name){const b=this.batches[name];b.mesh.count=b.n;b.mesh.instanceMatrix.needsUpdate=true;if(b.mesh.instanceColor)b.mesh.instanceColor.needsUpdate=true;}
 dangerRing(x,z,r,color){this.part('dangerBorder',x,.055,z,r,r,1,0x12212d,-Math.PI/2);this.part('dangerRing',x,.06,z,r,r,1,color,-Math.PI/2);}
 dangerLane(x,z,a,length,color){
  const segment=(cx,cz,angle,size)=>{this.part('dangerLaneBorder',cx,.05,cz,size,.025,.24,0x12212d,0,-angle);this.part('dangerLane',cx,.06,cz,size,.025,.085,color,0,-angle);};
  segment(x+Math.cos(a)*length/2,z+Math.sin(a)*length/2,a,length);
  for(const side of [-1,1]){const angle=a+side*.62,endX=x+Math.cos(a)*length*.86,endZ=z+Math.sin(a)*length*.86;segment(endX-Math.cos(angle)*.3,endZ-Math.sin(angle)*.3,angle,.6);}
 }
 makeHero(){
  const root=new T.Group(),body=new T.Group();root.add(body);root.userData.body=body;
  this.cube(body,0xe77b24,[.64,.65,.44],[0,.72,0]);this.cube(body,0xffe6af,[.36,.48,.07],[0,.74,.26]);
  this.cube(body,0xf58b2c,[.94,.75,.64],[0,1.36,0]);this.cube(body,0xffd28a,[.68,.27,.22],[0,1.13,.36]);
  this.cube(body,0x4d3632,[.17,.1,.1],[0,1.23,.51]);
  for(const side of [-1,1]){
   this.cube(body,0xee8025,[.28,.4,.31],[side*.35,1.87,-.02],side*-.13);this.cube(body,0x4e3635,[.25,.12,.29],[side*.39,2.09,-.02],side*-.13);this.cube(body,0xffddac,[.14,.23,.045],[side*.35,1.88,.15],side*-.13);
   this.cube(body,0xfff4cf,[.27,.28,.045],[side*.25,1.43,.336]);this.cube(body,0x123342,[.13,.23,.055],[side*.22,1.42,.37]);this.cube(body,0x4ad9ff,[.065,.14,.058],[side*.2,1.43,.38]);this.cube(body,0xffffff,[.045,.06,.06],[side*.22,1.5,.4]);
   const leg=new T.Group();leg.position.set(side*.24,.36,0);body.add(leg);this.cube(leg,0x8c522b,[.26,.38,.3],[0,-.04,0]);this.cube(leg,0xffdca0,[.28,.16,.4],[0,-.23,.08]);root.userData[side===1?'rightLeg':'leftLeg']=leg;
   this.cube(body,0xce6e24,[.24,.42,.27],[side*.49,.78,.04],side*.15);this.cube(body,0xffc64b,[.31,.28,.32],[side*.55,.58,.12]);this.cube(body,0xffef80,[.18,.1,.07],[side*.55,.6,.3]);
  }
  this.cube(body,0xffd449,[.12,.23,.045],[0,1.7,.337],-.4);
  this.cube(body,0x24b9ec,[.78,.16,.61],[0,.99,.04]);const scarf=new T.Group();body.add(scarf);root.userData.scarf=scarf;for(let i=0;i<4;i++)this.cube(scarf,i%2?0x1688c7:0x36d7ed,[.23,.14,.27],[.22+i*.18,.98+i*.035,-.3-i*.2]);
  const tail=new T.Group();tail.position.set(0,.55,-.26);tail.rotation.x=-.65;body.add(tail);this.cube(tail,0xe47d23,[.35,.55,.34],[0,.2,-.18]);this.cube(tail,0xffdba1,[.36,.28,.35],[0,.57,-.18]);
  root.scale.setScalar(.82);return root;
 }
 terrain(run){
  if(this.arc===run.stage.arc&&this.layout===run.stage.layout)return;this.arc=run.stage.arc;this.layout=run.stage.layout;
  const a=ARCS[this.arc];this.batches.floor.n=0;this.batches.scenery.n=0;
  for(let x=-14;x<=14;x++)for(let z=-14;z<=14;z++){
   const inside=Math.abs(x)<=8&&Math.abs(z)<=9,c=new T.Color(inside?a.floor:0x173f48);c.multiplyScalar(.85+((x*17+z*7+500)%11)/40);
   this.part('floor',x,-.16,z,.99,.3,.99,c);
  }
  for(let i=0;i<38;i++){const a=i/38*Math.PI*2,x=Math.cos(a)*10.4,z=Math.sin(a)*11.8;this.part('scenery',x,.45,z,.8,.9,.9,0x24515b,0,a);this.part('scenery',x,1.05,z,1,.3,1.1,0x3e7780,0,a);if(i%3===0){this.part('scenery',x,1.9,z,.48,1.5,.48,0x2d5763,0,a);this.part('scenery',x,2.7,z,.8,.2,.8,0x477b85,0,a);this.part('scenery',x,2.9,z,.24,.3,.24,ARCS[this.arc].accent,0,a);}}
  for(const p of run.pillars){this.part('scenery',p.x,.8,p.z,1.4,1.6,1.4,0x3b6972);this.part('scenery',p.x,1.7,p.z,1.6,.2,1.6,0x6b9291);this.part('scenery',p.x,1.91,p.z,.35,.25,.35,a.accent);}
  for(let i=0;i<12;i++){const x=(i%2?1:-1)*(8.7+(i%3)*.5),z=-8+(i*7)%17;for(let j=0;j<3;j++)this.part('scenery',x+j*.24,.25+j*.18,z,.33,.5+j*.1,.3,j%2?0x3caa90:0x287c6c,0,j*.6,j*.1);}
  this.finish('floor');this.finish('scenery');
 }
 fit(){const rect=this.host.getBoundingClientRect();if(rect.width<1||rect.height<1)return;this.width=rect.width;this.height=rect.height;this.renderer.setSize(rect.width,rect.height,false);const aspect=rect.width/rect.height;const halfH=Math.max(5.4,6/aspect);this.camera.left=-halfH*aspect;this.camera.right=halfH*aspect;this.camera.top=halfH;this.camera.bottom=-halfH;this.camera.updateProjectionMatrix();}
 sword(x,y,z,a,color,tier=0,scale=1,guardColor=0xe6b85a){const s=scale,c=Math.cos(a),q=Math.sin(a);this.part('sword',x,y,z,1.05*s,.12*s,(.14+tier*.025)*s,color,0,-a);this.part('swordTip',x+c*.65*s,y,z+q*.65*s,.22*s,.35*s,.17*s,color,0,-a,-Math.PI/2);this.part('sword',x-c*.38*s,y,z-q*.38*s,.13*s,.17*s,.45*s,guardColor,0,-a);this.part('sword',x-c*.58*s,y,z-q*.58*s,.27*s,.13*s,.13*s,0x805236,0,-a);}
 enemy(e,fade=1){const boss=e.boss,s=(boss?1.7:e.kind==='small'?.55:e.elite?1.2:1)*fade,reaction=this.reduced?0:(e.recoil||0)/.18;
  const y=.42+(this.reduced?0:Math.sin((this.time-e.born)*8)*.045),base=(boss?[0,0x6554b8,0x94704f,0x6ea3bf,0x8068bc,0x975391,0xb78857][boss]:ENEMY_COLORS[e.kind])||0x8b6eae,color=e.flash>0?this.hitTint.set(base).lerp(this.hitLight,.32*Math.min(1,e.flash/.13)):base;
  const slim=e.kind==='stalker'?.7:e.kind==='bomber'?1.2:1;
  this.part('enemy',e.x,y*s,e.z,.78*s*slim*(1+reaction*.15),.72*s*(1-reaction*.2),.7*s,color,(e.impactZ||0)*reaction*.22,0,(e.impactX||0)*-reaction*.22);
  this.part('enemy',e.x,y*s-.22*s,e.z+.12*s,.55*s,.28*s,.5*s,color);
  for(const side of [-1,1]){this.part('enemy',e.x+side*.21*s,y*s+.1*s,e.z+.36*s,.14*s,.16*s,.045*s,0xf4eaff);this.part('enemy',e.x+side*.2*s,y*s+.09*s,e.z+.39*s,.06*s,.1*s,.03*s,0xff67d9);this.part('enemy',e.x+side*.39*s,y*s+.43*s,e.z-.05*s,.2*s,.3*s,.25*s,0x382d58,0,0,-side*.3);this.part('enemy',e.x+side*.29*s,.1,e.z,.2*s,.18*s,.3*s,0x292e45);}
  if(e.shield>0)this.part('enemy',e.x,y*s,e.z+.5*s,.82*s,.7*s,.12*s,0x8cc3cc);
  if(e.kind==='healer'){this.part('enemy',e.x,y*s+.65*s,e.z,.55*s,.1*s,.16*s,0x8fffd5);this.part('enemy',e.x,y*s+.65*s,e.z,.16*s,.1*s,.55*s,0x8fffd5);}
  if(e.kind==='ranger')this.part('gem',e.x,y*s+.6*s,e.z,.4,.6,.4,0xeb9fff,0,this.time);
  if(e.kind==='charger')for(const side of [-1,1])this.part('enemy',e.x+side*.43*s,y*s+.23,e.z+.38*s,.18*s,.18*s,.72*s,0xffbba4,0,-side*.25);
  if(e.kind==='splitter')for(const side of [-1,1])this.part('gem',e.x+side*.36*s,y*s+.6,e.z-.12,.3*s,.7*s,.3*s,0xe2b0ff,0,side*.4,side*.3);
  if(e.kind==='stalker')for(const side of [-1,1]){this.part('enemy',e.x+side*.55*s,y*s+.07,e.z,.7*s,.13*s,.24*s,0x7ef7ef,0,side*.65);this.part('enemy',e.x+side*.4*s,.16,e.z-.28,.16*s,.16*s,.72*s,0x154760,0,-side*.3);}
  if(e.kind==='bomber'){this.part('enemy',e.x,y*s,e.z+.4*s,.56*s,.47*s,.16*s,0x472d42);this.part('fx',e.x,y*s,e.z+.5*s,.22*s,.27*s,.05*s,e.mode==='detonate'?0xffed9e:0xffaf5c);this.part('enemy',e.x,y*s+.62,e.z,.12,.4,.12,0x594252);this.part('gem',e.x,y*s+.88,e.z,.2,.25,.2,0xffb04c);}
  if(e.kind==='summoner'){this.part('enemy',e.x,y*s+.54,e.z,1.05*s,.13*s,.85*s,0x364b39);this.part('enemy',e.x,y*s+.72,e.z,.58*s,.28*s,.52*s,0xb3cb67);this.part('enemy',e.x+.6*s,.72,e.z,.12,1.4,.12,0x53684d);this.part('gem',e.x+.6*s,1.5,e.z,.34,.45,.34,0xc5ff8a);}
  if(boss){for(let i=-1;i<=1;i++)this.part('enemy',e.x+i*.45,y*s+.9,e.z,.28,.4+(i===0?.3:0),.32,0xffd377);}
  if(e.elite){this.part('enemy',e.x,y*s+1,e.z,.55,.14,.4,0xffd26d);this.part('gem',e.x,y*s+1.18,e.z,.22,.28,.22,0xfff2bf);this.part('hazard',e.x,.04,e.z,.72,.72,1,0xf6c35b,-Math.PI/2);}
  if(e.burn>0)for(let i=0;i<3;i++)this.part('fx',e.x+Math.cos(i*2.1)*.3,.5+(this.reduced?.2:((this.time*1.6+i*.3)%1))*.65,e.z+Math.sin(i*2.1)*.3,.12,.24,.12,0xffac52,0,0,.25);
  if(e.slow>0){this.part('pulse',e.x,.06,e.z,.58*s,.58*s,1,0x8be7ff,-Math.PI/2);for(const side of [-1,1])this.part('gem',e.x+side*.38*s,.2,e.z+.25,.16,.4,.16,0x9ff1ff,0,0,side*.3);}
  if(e.hp>0&&e.hp<e.maxHp&&!boss){this.part('enemy',e.x,y*s+.94*s,e.z,.8*s,.065,.05,0x233749);this.part('fx',e.x-(1-e.hp/e.maxHp)*.4*s,y*s+.94*s,e.z+.01,.8*s*e.hp/e.maxHp,.065,.055,e.elite?0xffd26d:0xa6efd2);}
  this.part('shadow',e.x,.012,e.z,.55*s,.42*s,1,0x071f28,-Math.PI/2);
  if(e.mode==='windup'||e.mode==='volley'){const a=Math.atan2(e.dz,e.dx),color=e.kind==='stalker'?0x80f4ee:e.mode==='volley'?0xec98ff:0xff977d,length=e.kind==='stalker'?3.8:5.8,fan=e.mode==='volley'&&boss?3:0;for(let i=-fan;i<=fan;i++)this.dangerLane(e.x,e.z,a+i*.26,length,color);this.dangerRing(e.x,e.z,.7*s,color);}
  if(e.mode==='detonate'){this.dangerRing(e.x,e.z,2.05,0xffb05c);const progress=1-Math.max(0,e.wind)/.95;this.part('pulse',e.x,.06,e.z,.25+1.8*progress,.25+1.8*progress,1,0xffd280,-Math.PI/2);}
  if(e.mode==='summon'||e.mode==='mend'){const radius=e.mode==='summon'?1.15:1.5;this.part('hazard',e.x,.06,e.z,radius,radius,1,0xb0fa83,-Math.PI/2);this.part('pulse',e.x,.6,e.z,.55,.55,1,0xcaff9c,-Math.PI/2,0,this.reduced?0:this.time);}
 }
 addFx(effect,priority=false){if(this.fx.length>=LIMITS.effects){if(!priority)return;this.fx.shift();}this.fx.push(effect);this.peakEffects=Math.max(this.peakEffects,this.fx.length);}
 feedback(event){
  const {type}=event,x=event.x??0,z=event.z??0;
  if(['defeat','detonate'].includes(type)&&this.remains.length<16)this.remains.push({...event,born:this.time,life:.22,flash:0,shield:0,mode:'defeated'});
  const strong=type==='break'||type==='hurt'||type==='evolve'||type==='detonate'||type==='enrage'||event.boss||event.critical;
  if(!this.reduced&&(type==='hurt'||event.critical||type==='defeat'&&event.boss||type==='detonate'))this.shake=Math.max(this.shake,type==='hurt'?.18:event.boss?.24:.07);
  const color=type==='hurt'?0xff758c:type==='break'||type==='block'?0xaff5ff:type==='chain'?0xc7b2ff:type==='mend'||type==='summon'?0xb4ff8f:type==='detonate'||type==='eruption'?0xffae61:type==='pickup'?event.kind==='sword'||event.kind==='cache'?0xffdd7b:0x80ffe2:type==='defeat'?ENEMY_COLORS[event.kind]||0xc7a0ff:PALETTE[event.element]||0xffdf8b;
  if(type==='hit'||type==='break'||type==='block')this.addFx({type:'slash',x,z,y:.75,angle:event.angle||0,life:this.reduced?.1:.22,max:.22,size:event.critical?1.05:.7,color:type==='hit'?0xfff6df:color},strong);
  if(['defeat','hurt','evolve','pickup','objective','break','detonate','summon','mend','enrage','eruption'].includes(type))this.addFx({type:'pulse',x,z,y:.12,life:this.reduced?.16:.42,max:.42,size:type==='detonate'?2.05:type==='evolve'||event.boss?3:type==='eruption'?event.r||1.4:type==='pickup'?.6:1.15,color},strong);
  if(['hit','defeat','hurt','evolve','break','block','detonate','eruption'].includes(type)){
   const count=this.reduced?2:type==='defeat'?event.boss?20:6:strong?12:3;
   for(let i=0;i<count;i++){const a=i/count*Math.PI*2+(event.angle||0),speed=strong?3.2:2;this.addFx({type:'shard',x,z,y:.65,vx:Math.cos(a)*speed,vz:Math.sin(a)*speed,vy:1.8+i%3*.7,life:this.reduced?.12:.28+i%3*.09,max:.46,color:i%3===0?0xfff2cf:color,size:strong?.16:.095},strong&&i<3);}
  }
  if(type==='chain')for(let i=0;i<3;i++){const x1=x+(event.toX-x)*i/3,z1=z+(event.toZ-z)*i/3+(i===1?.18:0),x2=x+(event.toX-x)*(i+1)/3,z2=z+(event.toZ-z)*(i+1)/3+(i===0?.18:0);this.addFx({type:'line',x:(x1+x2)/2,z:(z1+z2)/2,y:.8,life:.18,max:.18,color,length:Math.hypot(x2-x1,z2-z1),angle:Math.atan2(z2-z1,x2-x1)});}
  if(type==='dash'&&!this.reduced)for(let i=0;i<5;i++)this.addFx({type:'line',x:x-event.dx*i*.25,z:z-event.dz*i*.25,y:.65,life:.24,max:.24,color:0x90eeff,length:.7,angle:Math.atan2(event.dz,event.dx)});
 }
 render(run,dt=0){
  this.time+=dt;this.terrain(run);for(const name of Object.keys(this.batches))if(!['floor','scenery'].includes(name))this.batches[name].n=0;
  const p=run.player;this.hero.position.set(p.x,0,p.z);this.hero.rotation.y=p.face;
  const hurtGlow=p.inv>0&&(!this.reduced||p.inv>.8)?0x6d2828:0;
  if(this.hurtGlow!==hurtGlow){this.hurtGlow=hurtGlow;this.hero.traverse(node=>{if(node.isMesh)node.material.emissive.setHex(hurtGlow);});}
  const walk=Math.min(1,Math.hypot(p.vx,p.vz)/3.2)*(this.reduced?.3:1);this.hero.userData.rightLeg.rotation.x=Math.sin(this.time*14)*.5*walk;this.hero.userData.leftLeg.rotation.x=-Math.sin(this.time*14)*.5*walk;this.hero.userData.body.position.y=Math.abs(Math.sin(this.time*14))*.05*walk;this.hero.userData.scarf.rotation.x=this.reduced?0:Math.sin(this.time*7)*.16;
  this.part('shadow',p.x,.013,p.z,.6,.5,1,0x061d28,-Math.PI/2);
  const bladeColor=run.up.evolve?0xffd26b:PALETTE[run.path||'iron'];
  const blades=run.bladePositions();for(let i=0;i<blades.length;i++){const b=blades[i];this.sword(b.x,.72,b.z,b.a,bladeColor,run.tier,1,run.save.prismInlayOwned&&run.save.prismInlayEquipped?0x72e8ff:0xe6b85a);if(!this.reduced){const a=-b.a-(i>=12?.48:0);this.part('trail',p.x,.69,p.z,b.r,b.r,1,bladeColor,-Math.PI/2,0,a);}}
  this.part('pulse',p.x,.045,p.z,run.radius,run.radius,1,bladeColor,-Math.PI/2);
  if(p.dash>0&&!this.reduced)for(let i=1;i<=3;i++)this.part('fx',p.x-p.vx*i*.025,.5,p.z-p.vz*i*.025,.25,.45,.25,0x94eaff);
  for(const e of run.enemies)this.enemy(e);
  for(const e of this.remains){e.life-=dt;if(e.life>0)this.enemy(e,e.life/.22);}
  this.remains=this.remains.filter(e=>e.life>0);
  for(const item of run.pickups){const y=.24+Math.sin(this.time*3+item.id)*.07;if(item.kind==='sword')this.sword(item.x,y,item.z,this.time*.8,0xffe39b,0,.48);
   else if(item.kind==='xp')this.part('gem',item.x,y,item.z,.25,.42,.25,0x66ffd9,0,this.time);
   else if(item.kind==='heal'){this.part('loot',item.x,y,item.z,.42,.11,.15,0xff869b);this.part('loot',item.x,y,item.z,.15,.11,.42,0xff869b);}
   else {this.part('loot',item.x,.35,item.z,.85,.6,.6,0xd9a047);this.part('loot',item.x,.68,item.z,.9,.1,.65,0xffd66b);this.part('loot',item.x,.4,item.z+.32,.15,.22,.06,0x70fbe9);}}
  for(const h of run.hazards){this.dangerRing(h.x,h.z,h.r,h.delay>0?0xffc178:0xff607b);if(h.delay>0){const progress=Math.max(.12,1-h.delay/1.25);this.part('pulse',h.x,.06,h.z,h.r*progress,h.r*progress,1,0xffd599,-Math.PI/2);}else {this.part('pulse',h.x,.1,h.z,h.r,h.r,1,0xff9c52,-Math.PI/2);if(h.kind==='storm')this.part('fx',h.x,1.3,h.z,.12,2.6,.12,0xe3d2ff,0,0,.2);}}
  for(const b of run.projectiles){this.part('projectile',b.x,.56,b.z,.26,.26,.26,0xff7cdd,this.time,0,this.time);if(!this.reduced)this.part('telegraph',b.x-b.vx*.06,.55,b.z-b.vz*.06,.55,.065,.1,0xffa8e6,0,-Math.atan2(b.vz,b.vx));}
  for(const g of run.goals){if(g.done)continue;if(g.kind==='beacons'){this.part('hazard',g.x,.05,g.z,1.5,1.5,1,0x69dfe2,-Math.PI/2);this.part('goal',g.x,.25,g.z,.8,.5,.8,0x3f8898);this.part('gem',g.x,1+g.progress*.25,g.z,.5,.8,.5,0x9cffe8,0,this.time);}else{this.part('goal',g.x,.5,g.z,1.2,1,1.2,0x704c86);for(let i=0;i<3;i++)this.part('goal',g.x+(i-1)*.35,1.15,g.z,.2,.5,.3,0xcf7cc8,0,0,(i-1)*.3);}}
  for(const f of this.fx){f.life-=dt;if(f.life<=0)continue;const remain=Math.max(0,f.life/f.max);
   if(f.type==='line'){this.part('fx',f.x,f.y,f.z,f.length,.045*remain,.07*remain,f.color,0,-f.angle);continue;}
   if(f.type==='pulse'){const radius=f.size*(this.reduced?1:1-remain*.75);this.part('pulse',f.x,f.y,f.z,radius,radius,remain,f.color,-Math.PI/2);continue;}
   if(f.type==='slash'){const size=f.size*(.8+.2*remain);this.part('slash',f.x,f.y,f.z,size,size,remain,f.color,-Math.PI/2,0,-f.angle-.9);continue;}
   if(!this.reduced){f.x+=f.vx*dt;f.z+=f.vz*dt;f.y+=f.vy*dt;f.vy-=dt*7;}const size=f.size*remain;this.part('fx',f.x,Math.max(.03,f.y),f.z,size,size*.6,size*1.8,f.color,this.reduced?0:this.time*3,this.time);
  }
  this.fx=this.fx.filter(f=>f.life>0);this.shake=Math.max(0,this.shake-dt);
  const cx=Math.max(-3,Math.min(3,p.x)),cz=Math.max(-4,Math.min(4,p.z));
  this.camera.position.set(cx+(this.shake?Math.sin(this.time*90)*this.shake*.35:0),27,20+cz);this.camera.lookAt(cx,0,cz);
  for(const name of Object.keys(this.batches))if(!['floor','scenery'].includes(name))this.finish(name);
  this.renderer.render(this.scene,this.camera);
 }
 point(x,z,y=.6){const v=new T.Vector3(x,y,z).project(this.camera);return {x:(v.x*.5+.5)*this.width,y:(-.5*v.y+.5)*this.height};}
 stats(){return {revision:T.REVISION,calls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,geometries:this.renderer.info.memory.geometries,textures:this.renderer.info.memory.textures,effects:this.fx.length,peakEffects:this.peakEffects,reducedMotion:this.reduced};}
 portraits(){
  const result={};const visible=this.scene.children.map(n=>[n,n.visible]);for(const [n]of visible)if(n.isMesh||n===this.hero)n.visible=false;
  const object=new T.Group();this.scene.add(object);const oldBackground=this.scene.background;this.scene.background=null;this.renderer.setClearColor(0x172d41,0);this.renderer.setSize(96,96,false);const cam=new T.OrthographicCamera(-1,1,1,-1,.1,20);cam.position.set(2,2.4,4);cam.lookAt(0,0,0);
  for(const key of ['sword','prism','power','reach','speed','ember','frost','storm','evolve','gem','heal','coin']){
   object.clear();const col=PALETTE[key]|| (key==='evolve'?0xffd16a:0xc6e9ed);
   if(['sword','prism','power','ember','frost','storm','evolve'].includes(key)){
    this.cube(object,col,[.18,1.05,.12],[0,.12,0],-.45);this.cube(object,key==='prism'?0x72e8ff:0xefbd55,[.6,.12,.18],[-.22,-.32,0],-.45);this.cube(object,0x866143,[.12,.35,.12],[-.32,-.5,0],-.45);const tip=new T.Mesh(this.tip,this.material(col));tip.position.set(.3,.73,0);tip.scale.set(.24,.35,.2);tip.rotation.z=-.45;object.add(tip);
   }else if(key==='heal'){this.cube(object,0xff8ca7,[.85,.24,.22],[0,0,0]);this.cube(object,0xff8ca7,[.24,.85,.22],[0,0,0]);}
   else if(key==='coin'){const m=new T.Mesh(this.geo(new T.CylinderGeometry(.55,.55,.18,8)),this.material(0xffcd59));m.rotation.x=Math.PI/2;object.add(m);this.cube(object,0xfff19b,[.18,.48,.06],[0,0,.13]);}
   else if(key==='gem'){const m=new T.Mesh(this.gem,this.material(0x67f8d7));m.scale.set(.9,1.4,.9);object.add(m);}
   else {const m=new T.Mesh(this.ring,this.material(key==='speed'?0x72d9ff:0xbca5ff));m.scale.setScalar(.65);object.add(m);for(let i=0;i<3;i++){const a=i*2.1;this.cube(object,key==='speed'?0xa3ecff:0xdfcbff,[.22,.4,.18],[Math.cos(a)*.65,Math.sin(a)*.65,0],a);}}
   this.renderer.render(this.scene,cam);result[key]=this.renderer.domElement.toDataURL('image/png');
  }
  this.scene.remove(object);this.scene.background=oldBackground;for(const [n,v]of visible)n.visible=v;this.fit();return result;
 }
 dispose(){this.abort.abort();this.resizeObserver.disconnect();for(const b of Object.values(this.batches)){b.mesh.geometry=null;b.mesh.material.dispose();}for(const g of this.geometries)g.dispose();for(const m of this.materials.values())m.dispose();this.scene.clear();this.renderer.dispose();this.renderer.forceContextLoss();this.renderer.domElement.remove();this.fx=[];}
}
