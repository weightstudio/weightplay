import * as THREE from '../animal-rift-salvage/vendor/three/three.module.min.js';
import {ROCKS,seams} from './stages.mjs';
import {HEADS} from './model.mjs';
const palette={brass:0xe5b461,dark:0x153744,teal:0x3cc6bf,steel:0xb2c4cb,glass:0x163e54};
export function createWorld(canvas){
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,preserveDrawingBuffer:true});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setClearColor(0x0a1823);
 renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.5;
 const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-5,5,6,-6,.1,80);
 camera.position.set(0,2,23);camera.lookAt(0,-.5,0);
 scene.add(new THREE.HemisphereLight(0xc6f3ff,0x2b2030,2.5));
 const key=new THREE.DirectionalLight(0xffd49a,3.5);key.position.set(-5,8,10);scene.add(key);
 const rim=new THREE.DirectionalLight(0x53e7e1,2.6);rim.position.set(6,0,5);scene.add(rim);
 const amber=new THREE.PointLight(0xff6b33,12,15,2);amber.position.set(0,-6,3);scene.add(amber);
 const cube=new THREE.BoxGeometry(1,1,1),materials=new Map();
 const material=color=>{if(!materials.has(color))materials.set(color,new THREE.MeshStandardMaterial({color,metalness:.25,roughness:.58}));return materials.get(color);};
 const mesh=(geo,color,parent,x,y,z,sx=1,sy=1,sz=1)=>{const m=new THREE.Mesh(geo,material(color));m.position.set(x,y,z);m.scale.set(sx,sy,sz);parent.add(m);return m;};
 const box=(c,p,x,y,z,sx,sy,sz)=>mesh(cube,c,p,x,y,z,sx,sy,sz);
 const rig=new THREE.Group();scene.add(rig);rig.position.set(0,2.1,2.6);rig.scale.setScalar(1.18);
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
 }
 // Fia's authored cuboid face, box muzzle, lightning brow and segmented scarf.
 const fox=new THREE.Group();rig.add(fox);fox.position.set(0,.65,.42);
 box(0xf3932e,fox,0,0,0,.74,.57,.57);
 for(const x of [-.27,.27]){box(0xe27b25,fox,x,.39,0,.23,.34,.24);box(0x593b31,fox,x,.44,.13,.12,.18,.025);}
 box(0xffdfa1,fox,0,-.16,.32,.6,.22,.16);box(0x3b2925,fox,0,-.07,.42,.13,.09,.07);
 for(const x of [-.19,.19]){box(0xf3f6e8,fox,x,.05,.3,.16,.18,.06);box(0x153c50,fox,x,.04,.34,.07,.13,.03);}
 box(0x33bdda,fox,0,-.41,.12,.78,.17,.42);box(0xffd259,fox,0,.22,.32,.08,.21,.025);
 for(let i=0;i<3;i++)box(i%2?0xffd65f:0x2bb6df,fox,.45+i*.15,-.3+i*.03,0,.2,.16,.18);
 const drill=new THREE.Group();rig.add(drill);drill.position.set(0,-.63,.1);
 const cones=[];
 for(let i=0;i<5;i++){
  const geo=new THREE.CylinderGeometry(.7-i*.12,.58-i*.12,.3,8);cones.push(geo);
  const m=mesh(geo,palette.steel,drill,0,-i*.24,0);m.rotation.z=Math.PI;
  m.rotation.y=i*.5;
 }
 const tipGeo=new THREE.ConeGeometry(.14,.38,8);mesh(tipGeo,palette.brass,drill,0,-1.15,0).rotation.z=Math.PI;
 const terrain=new THREE.Group();scene.add(terrain);
 const rocks=[];const crystalGeo=new THREE.OctahedronGeometry(.3,0);
 for(let row=0;row<6;row++)for(let lane=0;lane<3;lane++){
  const group=new THREE.Group();terrain.add(group);group.position.set((lane-1)*2.55,-row*1.6-.4,0);
  const body=box(0x485d6c,group,0,0,0,2.4,1.43,1.1);
  const ore=[];for(let i=0;i<4;i++){const m=mesh(crystalGeo,0xe4b760,group,(i%2-.5)*1.05,(Math.floor(i/2)-.5)*.59,.78);m.rotation.z=i*.7;ore.push(m);}
  const edge=box(0x233c4c,group,-1.1,0,.58,.09,1.3,.1);
  rocks.push({group,body,ore,row,lane,edge});
 }
 // Stepped shaft walls and strata, sharing bounded geometry/materials.
 for(const side of [-1,1])for(let i=0;i<12;i++){
  box(i%3===0?0x3b5361:0x233b49,scene,side*(4.45+(i%3)*.14),4-i*.9,-.1,.85,.82,1.75);
  if(i%3===1)box(0x4dbbc6,scene,side*4.02,4-i*.9,1,.12,.24,.18);
 }
 const outlineGeo=new THREE.EdgesGeometry(new THREE.BoxGeometry(2.43,1.48,1.15));
 const outlineMat=new THREE.LineBasicMaterial({color:0x86f5dd,transparent:true,opacity:.9});
 const outline=new THREE.LineSegments(outlineGeo,outlineMat);scene.add(outline);outline.position.set(0,-.4,0);
 const particles=[];for(let i=0;i<32;i++){const m=box(0xe8c776,scene,0,-100,3,.09,.09,.09);particles.push({m,life:0,vx:0,vy:0});}
 let lastRow=-1,lastHead=-1,elapsed=0,kick=0,lastStage=-1;
 function resize(){const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;
  renderer.setSize(w,h,false);const ratio=w/h;
  // Fixed horizontal field prevents wide-screen information advantages.
  camera.left=-5.05;camera.right=5.05;const half=Math.max(4.2,5.05/ratio);
  camera.top=4.6;camera.bottom=4.6-half*2;camera.updateProjectionMatrix();}
 const observer=new ResizeObserver(resize);observer.observe(canvas);resize();
 function update(save,r,dt,drilling,reduced=false){
  elapsed+=dt;const damping=reduced?1:Math.min(1,dt*13);
  const targetX=r?(r.lane-1)*2.55:0;rig.position.x+=(targetX-rig.position.x)*damping;
  kick=Math.max(0,kick-dt*5);rig.position.y=2.1+(drilling&&!reduced?Math.sin(elapsed*55)*.018:0)+kick*.15;
  if(drilling)drill.rotation.y+=dt*(8+save.upgrades.speed*.8);else drill.rotation.y+=dt*.18;
  if(save.head!==lastHead){lastHead=save.head;drill.children.forEach(m=>{m.material=material(HEADS[save.head].color);});}
  if(r){outline.position.x=targetX;outline.visible=true;
   if(r.row!==lastRow||r.stage.id!==lastStage){lastRow=r.row;lastStage=r.stage.id;
    rocks.forEach(({group,body,ore,row,lane})=>{
     const kind=seams(r.stage,r.row+row)[lane],rock=ROCKS[kind];body.material=material(kind==='L'?0x803e36:row%2?0x405665:0x4b6070);
     ore.forEach((m,i)=>{m.material=material(rock.color);m.scale.setScalar(kind==='S'?.55:kind==='X'?1.1:.85);m.rotation.y=i*.7+row;m.visible=true;});
     group.visible=row<Math.min(6,20-r.row);group.position.y=-row*1.6-.4;
    });
   }
   for(const rock of rocks){if(rock.row===0){const chosen=rock.lane===r.lane;rock.body.scale.x=2.4*(chosen?1-r.progress*.06:1);rock.body.rotation.z=chosen&&!reduced&&drilling?Math.sin(elapsed*45)*.009:0;}}
  }
  particles.forEach(p=>{if(p.life>0){p.life-=dt;p.m.visible=true;p.m.position.x+=p.vx*dt;p.m.position.y+=p.vy*dt;p.vy-=dt*8;p.m.rotation.x+=dt*7;p.m.scale.setScalar(Math.max(.001,p.life)*.14);}else p.m.visible=false;});
  renderer.render(scene,camera);
 }
 function burst(lane,color,reduced=false){kick=reduced?0:1;particles.slice(0,reduced?0:24).forEach((p,i)=>{p.life=.45+(i%4)*.08;p.m.position.set((lane-1)*2.55,-.2,1.4);p.vx=Math.sin(i*2.4)*3;p.vy=1+Math.cos(i*1.1)*3;p.m.material=material(color);});}
 // Actual equipment/ore meshes rendered with the same pinned renderer/materials.
 function thumbnail(kind){
  const wasRig=rig.visible,wasTerrain=terrain.visible;const vis=[];
  scene.traverse(o=>{if(o.isMesh||o.isLineSegments){vis.push([o,o.visible]);o.visible=false;}});
  const group=new THREE.Group();scene.add(group);
  if(typeof kind==='number'){
   const c=HEADS[kind].color;for(let i=0;i<5;i++){const m=mesh(cones[i],c,group,0,.6-i*.25,0);m.rotation.z=Math.PI;m.rotation.y=.6+i*.45;}
   box(palette.dark,group,0,.92,0,1.4,.25,1.25);group.rotation.z=-.4;
  }else{const c=ROCKS[kind]?.color||0x75bfff;for(let i=0;i<3;i++)mesh(crystalGeo,c,group,(i-1)*.42,(i%2)*.3,0,.9,1.5,.9);}
  const oldSize=renderer.getSize(new THREE.Vector2()),ratio=renderer.getPixelRatio();
  const old=[camera.left,camera.right,camera.top,camera.bottom];camera.left=-1.5;camera.right=1.5;camera.top=1.5;camera.bottom=-1.5;camera.position.set(0,2,10);camera.lookAt(0,0,0);camera.updateProjectionMatrix();
  renderer.setPixelRatio(1);renderer.setSize(112,112,false);renderer.setClearColor(0x152b37);renderer.render(scene,camera);const data=canvas.toDataURL('image/png');
  scene.remove(group);vis.forEach(([o,v])=>o.visible=v);rig.visible=wasRig;terrain.visible=wasTerrain;
  renderer.setPixelRatio(ratio);renderer.setSize(oldSize.x,oldSize.y,false);renderer.setClearColor(0x0a1823);
  [camera.left,camera.right,camera.top,camera.bottom]=old;camera.position.set(0,2,23);camera.lookAt(0,-.5,0);camera.updateProjectionMatrix();
  return data;
 }
 return {update,burst,resize,thumbnail,stats:()=>({calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures}),destroy(){observer.disconnect();cube.dispose();crystalGeo.dispose();cones.forEach(g=>g.dispose());tipGeo.dispose();outlineGeo.dispose();outlineMat.dispose();materials.forEach(m=>m.dispose());renderer.dispose();}};
}
