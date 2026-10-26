import * as THREE from '../animal-skyspire-drop/vendor/three/three.module.min.js';
import {POSITIONS} from './model.js';

export function createScene(host,{onFailure=()=>{}}={}){
 let disposed=false,frames=0;
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.setClearColor(0x182a35);host.append(renderer.domElement);
 renderer.domElement.setAttribute('aria-hidden','true');
 const contextLost=e=>{e.preventDefault();if(!disposed)onFailure('context-lost');};
 renderer.domElement.addEventListener('webglcontextlost',contextLost);
 const world=new THREE.Scene();world.fog=new THREE.Fog(0x182a35,22,65);
 const camera=new THREE.OrthographicCamera(-10,10,8,-8,.1,80);camera.position.set(7,14,16);camera.lookAt(0,0,0);
 world.add(new THREE.HemisphereLight(0xb8e7fa,0x76603e,2.1));
 const light=new THREE.DirectionalLight(0xffd39a,3);light.position.set(-8,12,5);world.add(light);
 const geometry=new THREE.BoxGeometry(1,1,1),materials=new Map(),allGeometry=[geometry];
 const mat=(color,glow=false)=>{const k=String(color)+glow;if(!materials.has(k))materials.set(k,new THREE.MeshStandardMaterial({color,roughness:.58,metalness:.2,...(glow?{emissive:color,emissiveIntensity:.55}:{})}));return materials.get(k);};
 function box(parent,color,x,y,z,sx,sy,sz,glow=false){const m=new THREE.Mesh(geometry,mat(color,glow));m.position.set(x,y,z);m.scale.set(sx,sy,sz);parent.add(m);return m;}
 const ground=box(world,0xc5945a,0,-.3,0,70,.4,70);
 const track=new THREE.Group();world.add(track);
 box(track,0x52606a,0,-.02,-.65,65,.12,.16);box(track,0x52606a,0,-.02,.65,65,.12,.16);
 const ties=[];for(let i=0;i<26;i++)ties.push(box(track,0x634d3f,i*1.5-19.5,-.05,0,.3,.1,2.1));
 const props=new THREE.Group();world.add(props);
 for(let i=0;i<12;i++){
  const x=(i*3.13)%40-20,z=(i%2?1:-1)*(4+(i*1.7)%7),h=.7+(i%4)*.7;
  const rock=new THREE.Group();rock.position.set(x,0,z);rock.rotation.y=i*.7;props.add(rock);
  box(rock,0x976848,0,h*.22,0,1.7,h*.5,1.6);
  box(rock,0xb98658,.13,h*.6,.08,1.25,h*.45,1.2);
  box(rock,0xd3a26b,.1,h*.88,.05,.8,h*.16,.85);
  if(i%4===0){box(props,0x476b55,x,1.4,z,.3,2.7,.35);box(props,0x5e8960,x+.4,1.8,z,1,.3,.35);}
 }
 const train=new THREE.Group();world.add(train);const turrets=[],wheels=[],rings=[];
 for(const x of POSITIONS){
  box(train,0x203c43,x,.65,0,2.65,.5,1.85);box(train,0x216c70,x,1.0,0,2.4,.4,1.6);
  for(const z of [-.9,.9])for(const dx of [-.8,.8]){const w=box(train,0x202b35,x+dx,.38,z,.6,.6,.22);wheels.push(w);box(train,0xd8aa58,x+dx,.38,z*1.05,.2,.2,.1);}
  box(train,0xd3ab60,x,1.25,0,2.5,.12,1.7);
  for(const z of [-.83,.83]){box(train,0x2d8790,x,1.02,z,1.7,.25,.05);box(train,0xd8ac65,x,.72,z,2.2,.08,.08);}
  const turret=new THREE.Group();turret.position.set(x,1.3,0);train.add(turret);turrets.push(turret);
  const ring=box(train,0x63e7d0,x,.95,0,2.72,.08,1.99,true);rings.push(ring);
 }
 for(const x of [-1.5,1.5])box(train,0xd5b176,x,.8,0,.45,.2,.35);
 // Compact locomotive cab and Taro's identifiable square face / garden fortress shell.
 box(train,0x16505a,4.75,1,0,.9,1.3,1.6);box(train,0xd5b176,4.75,1.75,0,1.2,.15,1.85);
 box(train,0x96bd50,4.4,1.8,.4,.65,.6,.6);box(train,0xd5d789,4.4,1.67,.76,.6,.25,.25);
 for(const x of [4.2,4.6]){box(train,0xffffff,x,1.85,.72,.18,.2,.05);box(train,0x283930,x,1.84,.76,.08,.13,.04);}
 box(train,0x698a40,4.6,1.92,-.35,.75,.65,.7);box(train,0xc7c2a1,4.6,2.24,-.35,.75,.16,.7);
 box(train,0x82ae40,4.6,2.4,-.35,.5,.2,.5);box(train,0x6c573b,4.6,2.65,-.35,.08,.5,.08);box(train,0x87be4f,4.78,2.83,-.35,.35,.23,.06);
 box(train,0x9de6dd,5.27,.9,0,.1,.4,.6,true);
 const coil=new THREE.Group();train.add(coil);box(coil,0x334851,5.05,1.95,-.5,.45,.3,.45);const coilLight=box(coil,0x65f4d6,5.05,2.23,-.5,.55,.12,.55,true);
 const crates=[];for(let i=0;i<3;i++){const g=new THREE.Group();g.position.set(-3+i*3,1.0,1.16);train.add(g);box(g,0xd9ac59,0,0,0,.68,.6,.5);box(g,0x725a3b,0,0,.26,.48,.36,.04);box(g,0xffd88c,0,0,.3,.1,.58,.04);crates.push(g);}
 const turnout=new THREE.Group();world.add(turnout);turnout.position.set(-5.7,0,-2.4);box(turnout,0x4e625c,0,.6,0,.16,1.2,.16);const turnoutLever=box(turnout,0xffd18b,0,1.3,0,1.2,.15,.2,true);const freightLight=box(turnout,0xffcd73,-.4,1,0,.24,.24,.24,true),serviceLight=box(turnout,0x71dce9,.4,1,0,.24,.24,.24,true);
 let pulseLife=0,pulseSide=1;
 const colors={gun:0xefb861,piercer:0xf2d98a,frost:0x70dbf0,shield:0x72a5f9,repair:0x95d5a0,empty:0x536b6a};
 let types=[],selected=-1,resizeWidth=0,resizeHeight=0;const barrels=[],recoil=[0,0,0];
 function setModules(s){
  s.mounts.forEach((m,i)=>{
   if(types[i]===m.type)return;types[i]=m.type;turrets[i].clear();
   const t=turrets[i],c=colors[m.type];box(t,0x334d59,0,.05,0,1.2,.2,1.05);
   if(m.type==='empty'){barrels[i]=null;return;}
   box(t,c,0,.35,0,.9,.55,.85);box(t,0xe5d8b0,0,.62,0,.65,.12,.7);
   if(['gun','piercer','frost'].includes(m.type)){
    const b=box(t,m.type==='frost'?0x9aeeff:0x34414b,0,.4,.78,m.type==='piercer'?.2:.28,.22,1.2,m.type==='frost');barrels[i]=b;
    if(m.type==='gun')box(t,0x34414b,.26,.4,.72,.14,.14,1.1);
    if(m.type==='piercer')box(t,c,0,.38,.9,.45,.5,.6);
   }else{barrels[i]=null;box(t,c,0,.95,0,.35,.7,.35,true);if(m.type==='repair'){box(t,0xe3f5cf,0,.95,.22,.6,.16,.1);box(t,0xe3f5cf,0,.95,.22,.16,.6,.12);}else box(t,0x7ecaff,0,1.3,0,.65,.15,.65,true);}
  });
 }
 const enemies=new Map(),bullets=new Map(),sparks=[];
 function enemyModel(e){
  const g=new THREE.Group(),c=e.kind==='armor'?0x806b95:e.kind==='rush'?0xc56b51:e.kind==='jammer'?0x8669b2:e.kind==='ward'?0x426fa0:e.kind==='insulator'?0x79569b:e.kind==='sapper'?0xad7043:e.boss?0xa94847:0x937362;
  const scale=e.boss?1.55:1;
  box(g,0x26343c,0,.2,0,1.2,.4,.8);box(g,c,0,.6,0,1,.6,.7);
  for(const x of [-.35,.35])box(g,0xffd687,x,.7,.4,.18,.13,.08,true);
  box(g,0xd1b29b,0,.3,.5,1.3,.22,.2);
  if(e.armor)box(g,0xb4a6bd,0,1,0,1.2,.17,.85);
  if(e.kind==='jammer'||e.kind==='conductor'||e.kind==='warden'){box(g,0x3c335c,0,1.25,0,.08,.9,.08);box(g,0xb595ee,0,1.7,0,.7,.15,.18,true);}
  if(e.boss){box(g,0xe9bd71,0,1.4,0,.7,.7,.7);g.userData.phaseCap=box(g,0xf3d382,0,1.82,0,1,.18,.95);}
  if(e.ward){g.userData.ward=box(g,e.kind==='insulator'?0xc688ff:0x75d5ff,0,.95,.6,1.4,1.35,.12,true);if(e.kind==='insulator')box(g,0xe7c8ff,0,1.65,0,.85,.18,.9);}
  if(e.kind==='sapper'){for(const x of [-.55,.55])box(g,0xf5c36f,x,.4,.75,.16,.16,.85);g.userData.warning=box(g,0xc98638,0,1.04,0,.35,.28,.35,true);}
  if('stun'in e)g.userData.stun=box(g,0x88ffe5,0,.02,0,1.5,.06,1.3,true);
  g.scale.setScalar(scale);world.add(g);return g;
 }
 const shield=box(world,0x77b6e4,0,.14,0,11,.045,2.6,true);shield.visible=false;
 function resize(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;if(w===resizeWidth&&h===resizeHeight)return;resizeWidth=w;resizeHeight=h;renderer.setSize(w,h,false);const aspect=w/h;const height=Math.max(13,20/aspect);camera.left=-height*aspect/2;camera.right=height*aspect/2;camera.top=height/2;camera.bottom=-height/2;camera.updateProjectionMatrix();}
 const observer=new ResizeObserver(resize);observer.observe(host);
 function render(s,selection,dt=0){
  resize();setModules(s);const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(selected!==selection)selected=selection;
  rings.forEach((r,i)=>{r.material=mat(i===selected?0xffe39c:0x63e7d0,true);r.visible=s.mounts[i].on;turrets[i].visible=true;turrets[i].scale.setScalar(s.jamSlot===i?.75:1);});
  const moving=s.status==='combat';for(const tie of ties)if(moving&&!reduced){tie.position.x-=dt*2.3;if(tie.position.x<-19.5)tie.position.x+=39;}
  for(const w of wheels)if(moving&&!reduced)w.rotation.z-=dt*3;
  if(moving&&!reduced)for(const p of props.children){p.position.x-=dt*.65;if(p.position.x<-22)p.position.x+=44;}
  recoil.forEach((v,i)=>{recoil[i]=Math.max(0,v-dt);if(barrels[i])barrels[i].position.z=.78-(reduced?0:recoil[i]*1.5);});
  ground.material=mat([0xc5945a,0xb8c8cd,0xad7660,0x769e87,0x819db0,0x8b7994][s.route.region]);
  coil.visible=Boolean(s.route.encounters);pulseLife=Math.max(0,pulseLife-dt);coilLight.material=mat(s.cells>0?0x65f4d6:0x426b70,true);coilLight.scale.x=.55+(!reduced&&pulseLife>0?pulseLife*.8:0);
  crates.forEach((g,i)=>{g.visible=s.route.chapter===2&&i<s.cargo;});turnout.visible=s.route.chapter===2;turnoutLever.rotation.z=s.branch==='freight'?.35:s.branch==='service'?-.35:0;freightLight.visible=s.branch!=='service';serviceLight.visible=s.branch!=='freight';
  const ids=new Set(s.enemies.map(e=>e.id));for(const [id,g]of enemies)if(!ids.has(id)){world.remove(g);enemies.delete(id);}
  for(const e of s.enemies){let g=enemies.get(e.id);if(!g){g=enemyModel(e);enemies.set(e.id,g);}g.position.set(e.x,.03+(!reduced&&e.flash>0?.12:0),e.z);g.rotation.z=!reduced&&e.flash>0?Math.sin(e.flash*50)*.12:0;g.scale.y=(e.boss?1.55:1)*(reduced?1:Math.min(1,e.age*5));if(e.telegraph>0)g.rotation.z=reduced?0:Math.sin(e.telegraph*16)*.08;if(g.userData.phaseCap)g.userData.phaseCap.material=mat([0xf3d382,0xfb8d62,0xc8a3ff][e.phase||0],true);if(g.userData.ward)g.userData.ward.visible=e.ward;if(g.userData.stun)g.userData.stun.visible=e.stun>0;if(g.userData.warning){g.userData.warning.material=mat(e.theftClock>0&&!e.raided?0xffc75b:0x805c36,true);g.userData.warning.scale.y=e.theftClock>0&&!e.raided&&!reduced?.28+Math.abs(Math.sin(e.theftClock*15))*.2:.28;}}
  const pids=new Set(s.shots.map(p=>p.id));for(const [id,g]of bullets)if(!pids.has(id)){world.remove(g);bullets.delete(id);}
  for(const p of s.shots){let b=bullets.get(p.id);if(!b){b=box(world,colors[p.type],0,1.8,0,.15,.15,.45,true);bullets.set(p.id,b);}const t=1-p.remaining/p.total;b.position.set(POSITIONS[p.from]+(p.x-POSITIONS[p.from])*t,1.8*(1-t)+.65*t,p.z*t);}
  for(let i=sparks.length-1;i>=0;i--){const p=sparks[i];p.life-=dt;p.mesh.scale.multiplyScalar(Math.max(.01,1-dt*4));if(p.life<=0){world.remove(p.mesh);sparks.splice(i,1);}}
  shield.visible=s.shield>1;shield.material=mat(s.shield>12?0x77b6e4:0x486c87,true);
  renderer.render(world,camera);
  if(frames++%15===0)host.dataset.renderStats=JSON.stringify({revision:THREE.REVISION,live:1,canvases:host.querySelectorAll('canvas').length,calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures});
 }
 function feedback(events){for(const e of events){if(['hit','defeat','wardBlock','wardBreak','cargoLost'].includes(e.type)){
   if(sparks.length>=32)continue;const c=e.type==='wardBlock'?0x84baff:e.type==='wardBreak'?0xa6ffeb:e.type==='cargoLost'?0xff9660:e.type==='defeat'?0xffc765:colors[e.module]||0xffe7bc;const m=box(world,c,e.x,1,e.z,e.type==='defeat'?.8:.4,.5,.5,true);sparks.push({mesh:m,life:.3});
  }if(e.type==='fire')recoil[e.index]=.12;
  if(e.type==='pulse'){pulseLife=.65;pulseSide=e.side;if(sparks.length<31){for(const z of [-2.15,2.15]){const m=box(world,0x8cffe6,pulseSide*6,.2,z,5,.08,.16,true);sparks.push({mesh:m,life:.6});}}}
  if(e.type==='cargoDelivered'&&sparks.length<32){const m=box(world,0xffd277,-3+(e.cargo-1)*3,1,1.16,.9,.8,.7,true);sparks.push({mesh:m,life:.5});}
 }}
 return {render,feedback,info:()=>({revision:THREE.REVISION,calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures}),dispose(){if(disposed)return;disposed=true;observer.disconnect();renderer.domElement.removeEventListener('webglcontextlost',contextLost);world.clear();for(const g of allGeometry)g.dispose();for(const m of materials.values())m.dispose();renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();host.dataset.renderStats=JSON.stringify({revision:THREE.REVISION,live:0,canvases:host.querySelectorAll('canvas').length,calls:0,triangles:0,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures});}};
}
