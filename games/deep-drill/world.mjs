import * as THREE from '../animal-rift-salvage/vendor/three/three.module.min.js';
import {ROCKS,seams} from './stages.mjs';
import {HEADS,cellState} from './model.mjs';
import {REGIONS} from './content.mjs';
import {runSeams,sealState} from './systems.mjs';
const palette={brass:0xe5b461,dark:0x153744,teal:0x3cc6bf,steel:0xb2c4cb,glass:0x163e54};
export function createWorld(canvas){
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,preserveDrawingBuffer:true});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setClearColor(0x0a1823);
 renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-5,5,6,-6,.1,80);
 camera.position.set(0,0,24);camera.lookAt(0,0,0);
 scene.add(new THREE.HemisphereLight(0xc6f3ff,0x2b2030,2.5));
 const key=new THREE.DirectionalLight(0xffd49a,3.5);key.position.set(-5,8,10);key.castShadow=true;key.shadow.mapSize.set(512,512);Object.assign(key.shadow.camera,{left:-8,right:8,top:8,bottom:-10,near:.1,far:40});key.shadow.bias=-.001;scene.add(key);
 const rim=new THREE.DirectionalLight(0x53e7e1,2.6);rim.position.set(6,0,5);scene.add(rim);
 const amber=new THREE.PointLight(0xff6b33,12,15,2);amber.position.set(0,-6,3);scene.add(amber);
 const cube=new THREE.BoxGeometry(1,1,1),materials=new Map();
 const material=color=>{if(!materials.has(color))materials.set(color,new THREE.MeshStandardMaterial({color,metalness:.38,roughness:.43,emissive:[0x3cc6bf,0xffa9da,0x75bfff,0xff623d].includes(color)?color:0x000000,emissiveIntensity:.22}));return materials.get(color);};
 const mesh=(geo,color,parent,x,y,z,sx=1,sy=1,sz=1)=>{const m=new THREE.Mesh(geo,material(color));m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;};
 const box=(c,p,x,y,z,sx,sy,sz)=>mesh(cube,c,p,x,y,z,sx,sy,sz);
 const torus=new THREE.TorusGeometry(.38,.07,6,20),boltGeo=new THREE.CylinderGeometry(.055,.055,.08,6);
 const background=box(0x152937,scene,0,-5,-1.2,16,27,.35);
 const rig=new THREE.Group();scene.add(rig);rig.position.set(0,2.1,2.6);rig.scale.setScalar(.95);
 box(palette.dark,rig,0,0,0,1.75,1.2,1.25);
 box(palette.brass,rig,0,-.48,.18,1.92,.22,1.35);
 box(palette.brass,rig,0,.5,.1,1.92,.16,1.3);
 box(palette.glass,rig,0,.12,.7,1.3,.62,.12);
 for(const x of [-.86,.86]){
  box(palette.brass,rig,x,.03,.75,.12,1.03,.15);
  box(palette.dark,rig,x*1.32,-.05,0,.38,1.1,.85);
  box(palette.teal,rig,x*1.33,.04,.47,.17,.5,.08);
  box(0xffdf86,rig,x*.78,-.28,.83,.22,.12,.08);
  for(let i=0;i<3;i++)box(0x42606b,rig,x*1.35,-.35+i*.3,.5,.38,.08,.09);
  for(let i=0;i<3;i++){const bolt=mesh(boltGeo,palette.steel,rig,x,-.35+i*.34,.88);bolt.rotation.x=Math.PI/2;}
  box(palette.brass,rig,x*1.34,.55,0,.44,.12,1.06);
  box(palette.dark,rig,x*1.32,-.58,0,.48,.13,1.08);
 }
 box(0x2c6570,rig,0,-.12,.78,1.42,.09,.13);
 for(let i=0;i<5;i++)box(i%2?0x183844:0x73dad5,rig,-.5+i*.25,-.12,.87,.11,.035,.035);
 for(const x of [-.46,.46]){box(0xea9b37,rig,x,.42,.8,.24,.2,.23);box(0xffdc7b,rig,x,.48,.92,.12,.06,.025);}
 // Fia's authored cuboid face, box muzzle, lightning brow and segmented scarf.
 const fox=new THREE.Group();rig.add(fox);fox.position.set(0,.65,.42);
 box(0xf3932e,fox,0,0,0,.74,.57,.57);
 for(const x of [-.27,.27]){box(0xe27b25,fox,x,.39,0,.23,.34,.24);box(0x593b31,fox,x,.44,.13,.12,.18,.025);}
 box(0xffdfa1,fox,0,-.16,.32,.6,.22,.16);box(0x3b2925,fox,0,-.07,.42,.13,.09,.07);
 for(const x of [-.19,.19]){box(0xf3f6e8,fox,x,.05,.3,.16,.18,.06);box(0x153c50,fox,x,.04,.34,.07,.13,.03);}
 for(const side of [-1,1]){const brow=box(0x5b3b2d,fox,side*.19,.16,.35,.22,.055,.04);brow.rotation.z=side*.17;box(0x70d9f5,fox,side*.19,.01,.36,.045,.085,.025);box(0xffffff,fox,side*.17,.08,.37,.035,.035,.02);}
 box(0x33bdda,fox,0,-.41,.12,.78,.17,.42);box(0xffd259,fox,0,.22,.32,.08,.21,.025);
 for(let i=0;i<3;i++)box(i%2?0xffd65f:0x2bb6df,fox,.45+i*.15,-.3+i*.03,0,.2,.16,.18);
 for(let i=0;i<3;i++)box(0xffd259,fox,i%2?.055:-.01,.25-i*.055,.33,.09,.055,.025);
 for(let i=0;i<4;i++){const scarf=box(i===2?0xf8d56a:0x24a2ca,fox,.47+i*.19,-.26+i*.09,-.12,.22,.2,.17);scarf.rotation.z=.25;}
 const tail=box(0xef8c2b,rig,-.94,.18,-.65,.32,.86,.38);tail.rotation.z=-.55;box(0xffdca0,tail,0,.4,.02,.91,.3,.94);
 const drill=new THREE.Group();rig.add(drill);drill.position.set(0,-.63,.1);
 const cones=[];
 for(let i=0;i<5;i++){
  const geo=new THREE.CylinderGeometry(.7-i*.12,.58-i*.12,.3,8);cones.push(geo);
  const m=mesh(geo,palette.steel,drill,0,-i*.24,0);m.rotation.z=Math.PI;
  m.rotation.y=i*.5;
 }
 const tipGeo=new THREE.ConeGeometry(.14,.38,8);mesh(tipGeo,palette.brass,drill,0,-1.15,0).rotation.z=Math.PI;
 for(let i=0;i<8;i++){const angle=i*Math.PI/4,tooth=box(i%2?0x354c58:0xd9e2e7,drill,Math.cos(angle)*.5,-.2-i*.045,Math.sin(angle)*.5,.13,.24,.12);tooth.rotation.y=-angle;}
 const plasmaRing=mesh(torus,0xbe91ff,rig,0,-.65,.1,1.8,1.8,1.8);plasmaRing.rotation.x=Math.PI/2;plasmaRing.visible=false;
 const terrain=new THREE.Group();scene.add(terrain);
 const rocks=[];const crystalGeo=new THREE.OctahedronGeometry(.3,0);
 for(let row=0;row<5;row++)for(let lane=0;lane<5;lane++){
  const group=new THREE.Group();terrain.add(group);group.position.set((lane-2)*2.55,-row*2.3-.4,0);
  const body=box(0x485d6c,group,0,0,0,2.4,2.15,1.1);
  const ore=[];for(let i=0;i<2;i++){const m=mesh(crystalGeo,0xe4b760,group,(i%2-.5)*1.05,(i%2-.5)*.75,.78);m.rotation.z=i*.7;ore.push(m);}
  const edge=box(0x233c4c,group,-1.1,0,.58,.09,2.05,.1);
  rocks.push({group,body,ore,row,lane,edge});
 }
 // Stepped shaft walls and strata, sharing bounded geometry/materials.
 for(const side of [-1,1])for(let i=0;i<12;i++){
  box(i%3===0?0x3b5361:0x233b49,scene,side*(7.05+(i%3)*.14),4-i*.9,-.1,.85,.82,1.75);
  if(i%3===1)box(0x4dbbc6,scene,side*6.72,4-i*.9,1,.12,.24,.18);
 }
 const outlineGeo=new THREE.EdgesGeometry(new THREE.BoxGeometry(2.43,2.2,1.15));
 const outlineMat=new THREE.LineBasicMaterial({color:0x86f5dd,transparent:true,opacity:.9});
 const outline=new THREE.LineSegments(outlineGeo,outlineMat);scene.add(outline);outline.position.set(0,-.4,0);
 const gates=[];
 for(let arc=0;arc<6;arc++){
  const group=new THREE.Group();scene.add(group);group.visible=false;
  const color=REGIONS[arc].color;box(0x142b39,group,0,-.45,.55,7.8,2.05,1.6);box(color,group,0,.55,1.48,8,.13,.15);box(color,group,0,-1.45,1.48,8,.13,.15);
  const cores=[];
  for(let lane=0;lane<3;lane++){
   const part=new THREE.Group();part.position.set((lane-1)*2.55,-.4,1.6);group.add(part);
   const ring=mesh(torus,color,part,0,0,0,2,2,1),center=mesh(crystalGeo,color,part,0,0,.15,1.1,1.1,1.1);
   const shield=box(0x3f5364,part,0,0,.45,.82,.95,.12);
   const detail=new THREE.Group();part.add(detail);
   if(arc===0)for(let i=0;i<3;i++)box(palette.brass,detail,-.22+i*.22,0,.58,.12,.5,.12);
   if(arc===1)for(const x of [-.62,.62]){box(0x83d7d7,detail,x,0,.13,.16,1.45,.22);box(0xd9e2df,detail,x,.3,.25,.28,.18,.25);}
   if(arc===2)for(let i=0;i<4;i++){const blade=box(0x8b6758,detail,Math.cos(i*Math.PI/2)*.48,Math.sin(i*Math.PI/2)*.48,.55,.4,.25,.14);blade.rotation.z=i*Math.PI/2;}
   if(arc===3)for(let i=0;i<5;i++){const a=i*Math.PI*2/5;mesh(crystalGeo,color,detail,Math.cos(a)*.73,Math.sin(a)*.73,.22,.5,.9,.6);}
   if(arc===4){box(0x93c9a2,detail,0,0,.7,1.35,.14,.15);box(0x93c9a2,detail,0,0,.7,.14,1.35,.15);}
   if(arc===5){const outer=mesh(torus,0xffcf7d,detail,0,0,.3,2.5,2.5,1);outer.rotation.x=.4;for(let i=0;i<3;i++){const a=i*Math.PI*2/3;mesh(crystalGeo,[0x64dbdb,0xc6a3ff,0xffd77c][i],detail,Math.cos(a)*.67,Math.sin(a)*.67,.4,.45,.6,.45);}}
   cores.push({part,ring,center,shield,detail});
  }
  gates.push({group,cores});
 }
 const beamMesh=box(0x75bfff,scene,0,0,3,.13,1,.1);beamMesh.visible=false;let beamTTL=0,contactTTL=0;
 const helpers=[];for(let i=0;i<3;i++){const g=new THREE.Group();scene.add(g);g.position.set(i===0?-3.1:3.1,2.8-i*.44,2.6);box(palette.dark,g,0,0,0,.58,.32,.4);box(palette.brass,g,0,.12,.25,.68,.1,.13);box(palette.teal,g,0,0,.27,.2,.12,.06);mesh(tipGeo,palette.steel,g,0,-.3,0,.6,.6,.6).rotation.z=Math.PI;helpers.push(g);}
 const particles=[];for(let i=0;i<96;i++){const m=box(0xe8c776,scene,0,-100,3,.3,.3,.3);m.castShadow=false;particles.push({m,life:0,maxLife:1,size:.3,vx:0,vy:0});}
 const ringGeometry=new THREE.RingGeometry(.42,.5,24),ringMaterial=new THREE.MeshBasicMaterial({color:0xffdf86,transparent:true,opacity:0,depthWrite:false});
 const impactRing=new THREE.Mesh(ringGeometry,ringMaterial);scene.add(impactRing);impactRing.visible=false;
 const cracks=new THREE.Group();scene.add(cracks);for(let i=0;i<5;i++){const line=box(0xffdf86,cracks,Math.sin(i*1.3)*.3,Math.cos(i*1.3)*.2,0,.045,.7,.025);line.rotation.z=i*1.3;line.castShadow=false;}cracks.visible=false;
 let ringTTL=0,ringLife=.25,ringAnchor={absolute:0,lane:2},burstCount=0,contactCount=0,lastBurst=null;
 // Columns never move in response to steering. Only the rig travels laterally.
 const viewX=lane=>(lane-2)*2.55;
 let currentRow=0,visualRow=0,rowVelocity=0,lastRun=null,frameNumber=0;
 let lastHead=-1,elapsed=0,kick=0,lastSeal=false,gateEnter=0,beamTarget=null;
 const worldY=absolute=>-(absolute-visualRow)*2.3-.4;
 function resize(){const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;
  renderer.setSize(w,h,false);const ratio=w/h;
  // Fixed horizontal field prevents wide-screen information advantages.
  const half=Math.max(8,6.8/ratio);camera.left=-half*ratio;camera.right=half*ratio;
  camera.top=1.8+half;camera.bottom=1.8-half;camera.updateProjectionMatrix();}
 const observer=new ResizeObserver(resize);observer.observe(canvas);resize();
 function update(save,r,dt,drilling,reduced=false){
  frameNumber++;elapsed+=dt;breakPulse=Math.max(0,breakPulse-dt);beamTTL=Math.max(0,beamTTL-dt);beamMesh.visible=beamTTL>0;contactTTL=Math.max(0,contactTTL-dt);helpers.forEach((g,i)=>{g.visible=i<save.helpers;g.rotation.z=!reduced&&drilling?Math.sin(elapsed*12+i)*.04:0;});
  if(r!==lastRun){lastRun=r;visualRow=currentRow=r?.row??0;rowVelocity=0;rig.position.x=viewX(r?.lane??2);kick=0;beamTTL=contactTTL=breakPulse=gateEnter=ringTTL=0;beamTarget=null;beamMesh.visible=false;particles.forEach(p=>{p.life=0;p.m.visible=false;});lastSeal=false;}
  const previousVisualRow=visualRow,targetX=viewX(r?.lane??2);currentRow=r?.row??0;
  rig.position.x=reduced?targetX:rig.position.x+(targetX-rig.position.x)*(1-Math.exp(-dt*22));
  if(r&&dt>0){
   if(reduced){visualRow=currentRow;rowVelocity=0;}
   else{
    // Critically damped absolute-depth tracking retains velocity between rows.
    // Catch-up stiffness bounds the lag at earned high drilling rates; no snap.
    const omega=12+Math.max(0,currentRow-visualRow-.75)*24;
    const change=visualRow-currentRow,step=(rowVelocity+omega*change)*dt,decay=Math.exp(-omega*dt);
    visualRow=currentRow+(change+step)*decay;rowVelocity=(rowVelocity-omega*step)*decay;
   }
  }
  const scrollDelta=(visualRow-previousVisualRow)*2.3;
  kick=Math.max(0,kick-dt*5);rig.position.y=1.5+(drilling&&!reduced?Math.sin(elapsed*55)*.018:0)+kick*.15;
  if(drilling)drill.rotation.y+=dt*(8+save.upgrades.speed*.8);else drill.rotation.y+=dt*.18;
  if(save.head!==lastHead){lastHead=save.head;drill.children.slice(0,6).forEach(m=>{m.material=material(HEADS[save.head].color);});plasmaRing.visible=save.head===3;}
  if(r){outline.position.x=targetX;outline.visible=true;outlineMat.color.setHex(breakPulse>0?0xffdf86:0x86f5dd);
   outline.position.y=worldY(r.row);
   const seal=sealState(r);if(seal&&!lastSeal)gateEnter=reduced?0:1;lastSeal=Boolean(seal);gateEnter=Math.max(0,gateEnter-dt*4);gates.forEach((g,i)=>{g.group.visible=Boolean(seal&&i===r.stage.arc);g.group.position.y=worldY(r.row)+.4-gateEnter*.4;g.group.scale.y=1-gateEnter*.08;if(g.group.visible)g.cores.forEach((c,lane)=>{const weak=lane+1===seal.lane;c.center.material=material(weak?REGIONS[i].color:0x2c4450);c.ring.material=material(weak?0xffdc8d:0x38505c);c.shield.visible=!weak||(i===2&&!seal.open);c.detail.rotation.z=i===4?Math.sin(elapsed*.6)*.15:0;c.part.position.x=viewX(lane+1);c.part.scale.setScalar(weak&&r.seal.hitFlash>0?1+r.seal.hitFlash*.12:1);});});
    rocks.forEach(({group,body,ore,row,lane})=>{
     const offset=row-2,absolute=r.row+offset,valid=absolute>=0&&absolute<r.stage.layers;const kind=valid?runSeams(r,offset)[lane]:'S',rock=ROCKS[kind];
     if(group.userData.identity!==`${r.stage.id}:${absolute}:${lane}:${kind}`){
      group.userData.identity=`${r.stage.id}:${absolute}:${lane}:${kind}`;
      body.material=material(kind==='L'?0x803e36:kind==='I'?0x436878:absolute%2?REGIONS[r.stage.arc].dark:0x4b6070);
      ore.forEach((m,i)=>{m.material=material(rock.color);m.scale.setScalar(kind==='S'?.55:kind==='X'?1.1:.85);m.rotation.y=i*.7+absolute;});
     }
     group.visible=!seal;group.position.set(viewX(lane),worldY(absolute),0);group.userData.valid=valid;group.userData.absolute=absolute;
    });
    background.material=material(REGIONS[r.stage.arc].dark);key.color.setHex(r.stage.arc===2?0xffb987:0xffdfb2);rim.color.setHex(REGIONS[r.stage.arc].color);
   for(const rock of rocks){const valid=rock.group.userData.valid,cell=valid?cellState(r,r.row+rock.row-2,rock.lane):{hp:0};rock.ore.forEach(m=>m.visible=cell.hp>0);rock.body.visible=cell.hp>0;rock.edge.visible=cell.hp>0;const chosen=rock.row===2&&rock.lane===r.lane;rock.body.position.z=contactTTL>0&&chosen?.1:0;rock.body.scale.x=2.4*(chosen?1-r.progress*.06:1);rock.body.rotation.z=0;}
  }
  particles.forEach(p=>{if(reduced)p.life=0;if(p.life>0){p.life=Math.max(0,p.life-dt);p.m.visible=p.life>0;p.m.position.x+=p.vx*dt;p.m.position.y+=p.vy*dt+scrollDelta;p.vy-=dt*10;p.m.rotation.x+=dt*5;p.m.scale.setScalar(p.size*(.35+.65*p.life/p.maxLife));}else p.m.visible=false;});
  ringTTL=Math.max(0,ringTTL-dt);impactRing.visible=ringTTL>0&&!reduced;
  if(impactRing.visible){const f=1-ringTTL/ringLife;impactRing.position.set(viewX(ringAnchor.lane),worldY(ringAnchor.absolute),2.1);impactRing.scale.setScalar(.8+f*2);ringMaterial.opacity=(1-f)*.8;}
  cracks.visible=Boolean(r&&r.progress>0&&r.progress<1&&!sealState(r));if(cracks.visible){cracks.position.set(viewX(r.lane),worldY(r.row),1.85);cracks.scale.setScalar(.6+r.progress*.5);}

  if(beamTarget&&beamTTL>0)positionBeam();
  renderer.render(scene,camera);
 }
 let particleCursor=0,breakPulse=0;
 function burst(lane,color,reduced=false,row=0,strong=false){
  burstCount++;kick=reduced?0:strong?.9:.7;breakPulse=reduced?.12:.18;ringTTL=reduced?0:strong?.32:.25;ringLife=ringTTL||.25;ringAnchor={absolute:currentRow+row,lane};ringMaterial.color.setHex(strong?0xffffff:0xffdf86);
  lastBurst={absolute:currentRow+row,lane,strong,fragments:reduced?0:strong?48:36};
  if(reduced)return;
  for(let i=0;i<(strong?48:36);i++){const p=particles[particleCursor++%particles.length];p.life=p.maxLife=.4+(i%6)*.045;p.size=i%6===0?.7:i%3===0?.42:.25;p.m.position.set(viewX(lane)+(i%2?1:-1)*(.6+i%3*.13),worldY(currentRow+row)+.1,3.8);const a=i*2.399;p.vx=Math.sin(a)*(1.5+i%3);p.vy=Math.cos(a)*(1.5+i%3)+2.5;p.m.material=material(i%5===0?0xffdf86:color);}
 }
 // Actual equipment/ore meshes rendered with the same pinned renderer/materials.
 function thumbnail(kind){
  const wasRig=rig.visible,wasTerrain=terrain.visible;const vis=[];
  scene.traverse(o=>{if(o.isMesh||o.isLineSegments){vis.push([o,o.visible]);o.visible=false;}});
  const group=new THREE.Group();scene.add(group);
  if(typeof kind==='number'){
   const c=HEADS[kind].color;for(let i=0;i<5;i++){const m=mesh(cones[i],c,group,0,.6-i*.25,0);m.rotation.z=Math.PI;m.rotation.y=.6+i*.45;}
   box(palette.dark,group,0,.92,0,1.4,.25,1.25);group.rotation.z=-.4;
  }else if(kind.startsWith('module:')){
   const id=kind.split(':')[1],c=id==='coil'?0xd8a2ef:id==='exchanger'?0x67d8da:0xc4bd85;
   box(0x244552,group,0,0,0,1.3,1.05,.55);box(c,group,0,.52,.31,1.3,.12,.15);box(c,group,0,-.52,.31,1.3,.12,.15);
   if(id==='compressor')for(let i=0;i<3;i++)box(c,group,0,-.3+i*.3,.34,1,.15,.15);
   else if(id==='scanner'){mesh(crystalGeo,0x86d8f0,group,0,.1,.5,1.25,1.25,.5);box(c,group,.55,.6,0,.1,.6,.1);}
   else if(id==='beacon'){mesh(torus,0xf8c77b,group,0,0,.4,1,1,.8);box(0xffd98a,group,0,0,.5,.18,.65,.1);}
   else for(let i=0;i<4;i++)box(c,group,-.44+i*.29,0,.4,.12,.86,.13);
  }else if(kind.startsWith('tool:')){
   const id=kind.split(':')[1],c=id==='coolant'?0x6be2de:id==='blast'?0xe5ae61:0xa9d58b;
   box(0x254955,group,0,0,0,.9,1.35,.65);box(c,group,0,0,.36,.65,.85,.12);box(0xc5d7db,group,0,.68,0,.7,.16,.6);
   if(id==='repair'){box(0xf4eed8,group,0,0,.45,.44,.12,.1);box(0xf4eed8,group,0,0,.45,.12,.44,.1);}else mesh(torus,c,group,0,0,.45,.5,.7,.5);
  }else if(kind.startsWith('relic:')){const c=REGIONS[Number(kind.split(':')[1])].color;mesh(torus,c,group,0,0,0,2.3,2.3,1);mesh(crystalGeo,c,group,0,0,.2,1.6,1.9,1.3);for(const x of [-.8,.8])box(palette.brass,group,x,-.2,0,.2,.9,.3);
  }else{const c=ROCKS[kind]?.color||0x75bfff;for(let i=0;i<3;i++)mesh(crystalGeo,c,group,(i-1)*.42,(i%2)*.3,0,.9,1.5,.9);}
  const oldSize=renderer.getSize(new THREE.Vector2()),ratio=renderer.getPixelRatio();
  const old=[camera.left,camera.right,camera.top,camera.bottom];camera.left=-1.5;camera.right=1.5;camera.top=1.5;camera.bottom=-1.5;camera.position.set(0,2,10);camera.lookAt(0,0,0);camera.updateProjectionMatrix();
  renderer.setPixelRatio(1);renderer.setSize(112,112,false);renderer.setClearColor(0x152b37);renderer.render(scene,camera);const data=canvas.toDataURL('image/png');
  scene.remove(group);vis.forEach(([o,v])=>o.visible=v);rig.visible=wasRig;terrain.visible=wasTerrain;
  renderer.setPixelRatio(ratio);renderer.setSize(oldSize.x,oldSize.y,false);renderer.setClearColor(0x0a1823);
  [camera.left,camera.right,camera.top,camera.bottom]=old;camera.position.set(0,0,24);camera.lookAt(0,0,0);camera.updateProjectionMatrix();
  return data;
 }
 function projectCell(row,lane){const c=new THREE.Vector3(viewX(lane),worldY(currentRow+row),.8).project(camera),a=new THREE.Vector3(0,0,.8).project(camera),b=new THREE.Vector3(2.4,2.15,.8).project(camera);return{x:(c.x+1)/2*canvas.clientWidth,y:(1-c.y)/2*canvas.clientHeight,width:Math.abs(b.x-a.x)/2*canvas.clientWidth,height:Math.abs(b.y-a.y)/2*canvas.clientHeight};}
 function projectRig(){const p=new THREE.Vector3(rig.position.x,rig.position.y+.3,2.6).project(camera);return{x:(p.x+1)/2*canvas.clientWidth,y:(1-p.y)/2*canvas.clientHeight};}
 function projectMesh(rock){const p=rock.group.position.clone();p.z=.8;p.project(camera);return{x:(p.x+1)/2*canvas.clientWidth,y:(1-p.y)/2*canvas.clientHeight};}
 function contact(lane,reduced){contactCount++;contactTTL=.11;if(!reduced)kick=.28;outlineMat.color.setHex(0xffdc8d);}
 function positionBeam(){const x=viewX(beamTarget.lane),y=worldY(beamTarget.absolute),dx=x-rig.position.x,dy=y-2;beamMesh.position.set((x+rig.position.x)/2,(y+2)/2,3);beamMesh.scale.set(beamTarget.reduced?.2:.13,Math.hypot(dx,dy),.1);beamMesh.rotation.z=-Math.atan2(dx,dy);}
 function beam(lane,row,reduced){beamTarget={lane,absolute:currentRow+row,reduced};beamTTL=.18;positionBeam();}
 return {update,burst,contact,beam,projectCell,resize,thumbnail,stats:()=>({calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures,particlePool:particles.length,fx:{burstCount,contactCount,lastBurst,ringVisible:impactRing.visible,cracksVisible:cracks.visible},tileCache:lastRun?Object.keys(lastRun.tiles).length:0,activeParticles:particles.filter(p=>p.life>0).length,terrainCells:rocks.length,drillCenter:projectRig(),motion:{frame:frameNumber,visualRow,currentRow,rowVelocity,cameraX:camera.position.x,rigX:rig.position.x,cells:rocks.map(rock=>({absolute:rock.group.userData.absolute,lane:rock.lane,x:rock.group.position.x,y:rock.group.position.y,color:rock.body.material.color.getHex(),oreAngle:rock.ore[0].rotation.y,visible:rock.body.visible,screen:projectMesh(rock)}))}}),destroy(){observer.disconnect();ringGeometry.dispose();ringMaterial.dispose();cube.dispose();crystalGeo.dispose();cones.forEach(g=>g.dispose());tipGeo.dispose();outlineGeo.dispose();outlineMat.dispose();torus.dispose();boltGeo.dispose();materials.forEach(m=>m.dispose());key.shadow.map?.dispose();renderer.dispose();}};
}
