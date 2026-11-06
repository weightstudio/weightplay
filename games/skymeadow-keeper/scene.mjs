import * as THREE from '../../src/vendor/three/r180-b59af7c93a55a6eb/three.module.min.js?wp-media=bb72a7777a2deab8';
import {SPECIES} from './campaign.mjs?wp-media=bb72a7777a2deab8';
import {terrainAt,heightAt} from './model.mjs?wp-media=bb72a7777a2deab8';
const palettes=[
  [0x8ccead,0x71ac6b,0x546e70,0xf3c46c],[0xaccbd8,0x97b792,0x7a7f8c,0xe9c987],
  [0x96d8e7,0x74b7ad,0x54798f,0xe8cb7b],[0xe5c9d9,0x94b77f,0x697a90,0xf0b9c2],
  [0x95d3d0,0x70a598,0x536e88,0xf2d599],[0x999ac8,0x7d9d98,0x665c86,0xecd17c],
];
const color=n=>new THREE.Color(n),transform=new THREE.Object3D();
function part(x,y,z,w,h,d,c,extra={}){return {x,y,z,w,h,d,c,...extra};}
function animalParts(species){
  const c=SPECIES[species].color,cream=0xffe5b8,dark=0x342f41,bird=species==='bird',turtle=species==='turtle',deer=species==='deer';
  const parts=[part(0,.65,0,.8,.65,1,c),part(0,1.04,.52,.83,.72,.72,c),part(0,.87,.94,.56,.27,.31,cream),part(0,1.01,1.105,.16,.10,.08,dark)];
  for(const x of [-.24,.24]){
    parts.push(part(x,1.14,.895,.18,.24,.06,0xfffaf0),part(x,1.14,.935,.105,.18,.04,dark),part(x-.025,1.19,.962,.035,.06,.015,0xffffff));
    if(!bird&&!turtle)parts.push(part(x*1.3,1.57,.45,.22,species==='rabbit'?.85:.38,.25,c),part(x*1.3,1.57,.59,.11,species==='rabbit'?.60:.23,.03,cream));
    for(const z of [-.33,.31])parts.push(part(x*1.3,.24,z,.24,.45,.29,c,{leg:Math.sign(x)*Math.sign(z)}),part(x*1.3,.08,z+.08,.26,.15,.40,cream));
  }
  if(turtle){parts.push(part(0,.99,-.10,1.14,.55,1.25,0x4d7553),part(0,1.30,-.10,.82,.13,.88,0x90b46c));for(const x of [-.26,.26])parts.push(part(x,1.43,-.12,.18,.18,.22,0xe9ce8b));}
  if(bird){parts.push(part(0,1.02,1.06,.28,.17,.38,0xffce72),part(-.65,.75,-.05,.65,.16,.65,c,{wing:-1}),part(.65,.75,-.05,.65,.16,.65,c,{wing:1}),part(0,.53,-.75,.44,.14,.65,c));}
  if(deer){for(const x of [-.3,.3])parts.push(part(x,1.86,.30,.10,.50,.12,0x86583f),part(x*1.5,1.97,.30,.3,.1,.12,0x86583f),part(x*1.5,2.05,.30,.16,.12,.16,0xf5c4bf));}
  if(species==='fox'||species==='otter')parts.push(part(0,.58,-.85,.34,.32,.9,c),part(0,.60,-1.23,.36,.34,.25,cream));
  if(species==='rabbit')parts.push(part(0,.7,-.59,.35,.35,.32,cream),part(-.27,1.91,.46,.11,.32,.28,0x94bd63),part(.27,1.91,.46,.11,.32,.28,0x94bd63));
  parts.push(part(0,.70,.54,.64,.13,.12,0x55b4b9),part(0,.61,.63,.15,.18,.08,0xf2c567));
  return parts;
}
export class MeadowScene {
  constructor(canvas,{onLost,onRestored}={}){
    this.canvas=canvas;this.disposed=false;this.geometries=new Set();this.materials=new Set();this.dynamic=new Map();this.effects=[];
    this.renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.16;
    this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    this.scene=new THREE.Scene();this.camera=new THREE.PerspectiveCamera(75,1,.08,180);this.camera.rotation.order='YXZ';
    this.scene.add(new THREE.HemisphereLight(0xd6f6ff,0x62704b,2.25));
    const sun=new THREE.DirectionalLight(0xffe0a8,3.5);sun.position.set(-18,28,12);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-30,right:30,top:30,bottom:-30,near:.5,far:90});sun.shadow.bias=-.0006;sun.shadow.normalBias=.08;sun.target.position.set(0,0,-10);this.scene.add(sun,sun.target);this.sun=sun;
    this.geo=new THREE.BoxGeometry(1,1,1);this.geometries.add(this.geo);
    this.mat=new THREE.MeshStandardMaterial({roughness:.79,metalness:.03});this.materials.add(this.mat);
    this.glow=new THREE.MeshStandardMaterial({color:0xa7f3d0,emissive:0x65d7af,emissiveIntensity:.75,roughness:.3});this.materials.add(this.glow);
    this.root=new THREE.Group();this.scene.add(this.root);this.hand=new THREE.Group();this.camera.add(this.hand);this.scene.add(this.camera);
    const handParts=[part(.38,-.35,-.65,.19,.18,.38,0xed9145),part(.38,-.34,-.88,.23,.19,.16,0xffe3ae),part(.38,-.32,-.80,.27,.23,.17,0xd8a64f),part(.28,-.22,-.95,.07,.30,.10,0x235d86),part(.48,-.22,-.95,.07,.30,.10,0x235d86),part(.28,-.16,-1.00,.04,.12,.07,0xf7cc5f),part(.48,-.16,-1.00,.04,.12,.07,0xf7cc5f)];
    this.handMesh=this.batch(handParts,this.hand);this.handParts=handParts;
    this.lost=e=>{e.preventDefault();onLost?.();};this.restored=()=>onRestored?.();canvas.addEventListener('webglcontextlost',this.lost);canvas.addEventListener('webglcontextrestored',this.restored);
    this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(canvas.parentElement);this.resize();
  }
  batch(parts,parent=this.root){
    const mesh=new THREE.InstancedMesh(this.geo,this.mat,parts.length);mesh.castShadow=true;mesh.receiveShadow=true;
    parts.forEach((p,i)=>{transform.position.set(p.x,p.y,p.z);transform.rotation.set(0,p.yaw||0,p.roll||0);transform.scale.set(p.w,p.h,p.d);transform.updateMatrix();mesh.setMatrixAt(i,transform.matrix);mesh.setColorAt(i,color(p.c));});
    mesh.instanceMatrix.needsUpdate=true;mesh.instanceColor.needsUpdate=true;parent.add(mesh);return mesh;
  }
  clearWorld(){
    this.root.traverse(n=>{if(n.isInstancedMesh)n.dispose();});this.root.clear();this.dynamic.clear();this.effects=[];
  }
  load(state){
    this.clearWorld();this.state=state;const pal=palettes[state.stage.biome];this.scene.background=color(pal[0]);this.scene.fog=new THREE.Fog(pal[0],36,state.stage.rules.includes('fog')?58:100);
    const terrain=[],deco=[];let rand=state.stage.seed;const random=()=>{rand=(rand*1664525+1013904223)>>>0;return rand/4294967296;};
    for(let x=-23;x<=23;x++)for(let z=-33;z<=16;z++){
      if(!state.world.land.some(r=>Math.abs(x-r.x)<=r.w/2&&Math.abs(z-r.z)<=r.d/2))continue;
      const h=heightAt(state,x,z),edge=terrainAt(state,x+1,z)==='gap'||terrainAt(state,x-1,z)==='gap'||terrainAt(state,x,z+1)==='gap'||terrainAt(state,x,z-1)==='gap';
      const c=color(pal[1]).multiplyScalar(.86+random()*.25).getHex();
      terrain.push(part(x,h-.22,z,1,.44,1,c));
      if(edge)terrain.push(part(x,h-1.1,z,.98,1.45+random()*1.5,.98,pal[2]));
      if(random()<.035&&Math.abs(x)>5){deco.push(part(x,h+.10,z,.16,.2,.16,0xf7ddad),part(x+.14,h+.19,z,.18,.18,.18,state.stage.biome===5?0xd4b4ed:0xf0c5ad));}
    }
    this.batch(terrain);this.batch(deco);
    const scenery=[];
    for(let i=0;i<24;i++){
      const angle=i/24*Math.PI*2,dist=42+random()*24,x=Math.sin(angle)*dist,z=Math.cos(angle)*dist-12,y=-7+random()*12,w=3+random()*8;
      scenery.push(part(x,y-4,z,w,8,w,pal[2]),part(x,y+.2,z,w+.4,.7,w+.4,pal[1]));
      for(let j=0;j<3;j++)scenery.push(part(x+j*2,y+4+j*1.3,z,3.2,3,3.2,j%2?pal[3]:pal[1]));
      scenery.push(part(x*1.1,-7-random()*8,z*1.1,12+random()*8,2.5,9,0xe8edf2));
    }
    for(const obstacle of state.world.obstacles){scenery.push(part(obstacle.x,obstacle.height/2,obstacle.z,obstacle.w,obstacle.height,obstacle.d,pal[2]));scenery.push(part(obstacle.x,obstacle.height,obstacle.z,obstacle.w+.3,.25,obstacle.d+.3,pal[1]));}
    // Trees outside routes have deliberately tiered branch and canopy silhouettes.
    for(const [x,z] of [[-19,-24],[19,-22],[-19,7],[19,9]]){
      scenery.push(part(x,2,z,.65,4,.65,0x846351));for(let j=0;j<3;j++)scenery.push(part(x+(j-1)*.7,3.3+j*.65,z,3.7-j*.6,1.1,3.1-j*.5,j%2?pal[3]:pal[1]));
    }
    this.batch(scenery);
    for(const h of state.world.habitats){
      const parts=[part(h.x,.06,h.z,4,.12,3.5,0xbfa97d)];
      for(const dx of [-2,2])for(const dz of [-1.7,1.7])parts.push(part(h.x+dx,.65,h.z+dz,.18,1.3,.18,0x92704d));
      for(const dz of [-1.7,1.7])parts.push(part(h.x,.63,h.z+dz,4,.12,.13,0xbba273));
      parts.push(part(h.x,1.85,h.z-1.35,4.4,.22,1.4,h.recipe==='water'?0x5aa9b4:h.recipe==='flower'?0xd595a2:0x69a884));
      const mesh=this.batch(parts);this.dynamic.set(h.id,{mesh,parts,kind:'habitat',recipe:h.recipe});
    }
    // Taro is the camp mentor: garden fortress shell, square friendly face.
    const taro=this.batch(animalParts('turtle'));taro.position.set(9,.0,11);taro.scale.setScalar(1.3);taro.rotation.y=-Math.PI*.65;
    for(const a of state.world.animals){const parts=animalParts(a.species),mesh=this.batch(parts);this.dynamic.set(a.id,{mesh,parts,kind:'animal',last:{x:a.x,z:a.z}});}
    for(const obj of state.world.objects){
      const h=heightAt(state,obj.x,obj.z),parts=[];
      if(obj.type==='food'){
        const fruit=obj.food==='berry'?0xd55872:obj.food==='root'?0xe9a656:0xf2cc74;
        parts.push(part(0,.28,0,1.3,.56,1.1,0x4c9471),part(.15,.65,0,.95,.37,.8,0x75b77f));
        for(const [x,y,z] of [[-.35,.66,.3],[.3,.95,.1],[.35,.55,-.4]])parts.push(part(x,y,z,.30,.32,.30,fruit));
      }else if(obj.type==='plate')parts.push(part(0,.09,0,2.7,.18,2.7,0xb3b1a0),part(0,.2,0,1.9,.06,1.9,0xd7c06c));
      else if(obj.type==='build')parts.push(part(0,.7,0,.18,1.4,.18,0x83614c),part(0,1.28,0,1.0,.6,.12,0x8bb688));
      else if(obj.type==='gate')parts.push(part(0,.7,0,.8,1.4,.8,0x748a91),part(0,1.6,0,.13,.55,.13,0xffd880),part(0,1.8,0,.9,.12,.15,0xf6cd72));
      else if(obj.type==='supply'||obj.type==='cache')parts.push(part(0,.35,0,.9,.7,.8,0xb99061),part(0,.7,0,1,.16,.9,0x67b4b6),part(0,.35,.42,.17,.23,.05,0xf2d081));
      else if(obj.type==='relay')parts.push(part(0,1,0,.2,2,.2,0x9e7b5a),part(0,1.7,0,1.4,.8,.1,0xeac671));
      else if(obj.type==='float')parts.push(part(0,.6,0,.3,1.2,.3,0xd1b76f));
      const mesh=this.batch(parts);mesh.position.set(obj.x,h,obj.z);this.dynamic.set(obj.id,{mesh,parts,kind:obj.type});
    }
    for(const bridge of state.world.bridges){
      const parts=[];for(let x=-bridge.w/2;x<bridge.w/2;x+=.8)parts.push(part(bridge.x+x,.04,bridge.z,.76,.17,bridge.d,0xb8a078));
      const mesh=this.batch(parts);mesh.visible=bridge.built;this.dynamic.set('bridge-'+bridge.id,{mesh,parts,kind:'bridge'});
    }
    for(const zone of state.world.zones){
      let parts=[];
      if(zone.type==='water'){for(let z=-zone.d/2;z<zone.d/2;z+=2)parts.push(part(zone.x,-.14,zone.z+z,zone.w,.12,1.96,0x64aebc));}
      else if(zone.type==='wind'){for(const dx of [-2,2]){parts.push(part(zone.x+dx,1,zone.z,.13,2,.13,0x9c8056),part(zone.x+dx+.4,1.7,zone.z,.8,.3,.08,0xf4d183));}}
      else if(zone.type==='thorn')for(let x=-zone.w/2;x<zone.w/2;x+=.8)parts.push(part(zone.x+x,.35,zone.z,.25,.7,.25,0x738262));
      else if(zone.type==='door')parts.push(part(zone.x,1.5,zone.z,zone.w,3,.55,0x8e9f9c));
      const mesh=this.batch(parts);this.dynamic.set(zone.id,{mesh,parts,kind:zone.type});
    }
    const lampParts=[];for(const l of state.world.lamps){const y=heightAt(state,l.x,l.z);lampParts.push(part(l.x,y+1,l.z,.16,2,.16,0x846c53),part(l.x,y+2,l.z,.55,.65,.55,0xffdea1),part(l.x,y+2.4,l.z,.8,.16,.8,0xb3a078));}if(lampParts.length)this.batch(lampParts);
    const tree=[];for(let i=0;i<6;i++)tree.push(part(0,i*.8,0,1.5-i*.1,.8,1.4-i*.1,0x8e745a));
    for(let i=0;i<9;i++){const angle=i*2.4,r=1.1+(i%3)*.8;tree.push(part(Math.cos(angle)*r,3.5+(i%3)*.7,Math.sin(angle)*r,2,.85,2,0xb1af80));}
    this.tree=this.batch(tree);this.tree.position.set(state.world.tree.x,heightAt(state,state.world.tree.x,state.world.tree.z),state.world.tree.z);this.treeParts=tree;
    const spinner=[];spinner.push(part(0,2.7,1,1.1,.14,.13,0xf6d98c),part(0,2.7,1,.14,1.1,.13,0xf6d98c));this.treeWheel=this.batch(spinner);this.treeWheel.position.copy(this.tree.position);
    this.render(state,0,true);
  }
  resize(){if(this.disposed)return;const rect=this.canvas.parentElement.getBoundingClientRect(),w=Math.max(1,rect.width),h=Math.max(1,rect.height);this.renderer.setSize(w,h,false);this.camera.aspect=w/h;this.camera.updateProjectionMatrix();}
  groundPoint(state){const ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2(0,0),this.camera);const plane=new THREE.Plane(new THREE.Vector3(0,1,0),-heightAt(state,state.player.x,state.player.z));const p=ray.ray.intersectPlane(plane,new THREE.Vector3());return p?{x:p.x,z:p.z}:null;}
  event(e,state){
    if(['feed','collect','produce','restore'].includes(e.type)){
      const from=e.from||{x:state.player.x,z:state.player.z},to=e.to||{x:state.player.x,z:state.player.z};
      this.effects.push({type:e.type,from,to,start:state.time,elapsed:0,duration:e.type==='restore'?.85:.5});
    }
    if(e.type==='feed')this.pulse=.35;
    if(e.type==='build')this.dynamic.get('bridge-'+e.id).born=0;
    this.effects=this.effects.slice(-24);
  }
  render(state,dt,reduced=false,cosmetic='base'){
    if(this.disposed)return;const p=state.player;this.camera.position.set(p.x,p.y+1.65,p.z);this.camera.rotation.set(p.pitch,p.yaw,0);
    this.hand.position.y=this.pulse>0&&!reduced?Math.sin(this.pulse*16)*.025:0;this.pulse=Math.max(0,(this.pulse||0)-dt);
    this.handMesh.setColorAt(2,color(cosmetic==='star'?0xa8cbe6:0xd8a64f));this.handMesh.instanceColor.needsUpdate=true;
    for(const a of state.world.animals){
      const d=this.dynamic.get(a.id),m=d.mesh,walk=Math.hypot(a.x-d.last.x,a.z-d.last.z)>.001;
      m.position.set(a.x,heightAt(state,a.x,a.z)+(a.species==='bird'?.7:0)+(reduced?0:Math.sin(state.time*3+a.id.length)*.025),a.z);m.rotation.y=a.heading||0;
      d.parts.forEach((part,i)=>{transform.position.set(part.x,part.y,part.z);transform.rotation.set(part.leg&&walk&&!reduced?Math.sin(state.time*8)*.35*part.leg:0,0,part.wing&&!reduced?Math.sin(state.time*7)*.18*part.wing:0);transform.scale.set(part.w,part.h,part.d);transform.updateMatrix();m.setMatrixAt(i,transform.matrix);});m.instanceMatrix.needsUpdate=true;d.last={x:a.x,z:a.z};
    }
    for(const o of state.world.objects){const d=this.dynamic.get(o.id);if(!d)continue;if(o.type==='food')d.mesh.scale.setScalar(o.remaining?1:.35);if(o.taken)d.mesh.visible=false;if(o.type==='gate')d.mesh.rotation.y=o.open?Math.PI/2:0;}
    for(const b of state.world.bridges){const d=this.dynamic.get('bridge-'+b.id);d.mesh.visible=b.built;if(d.born!==undefined){d.born+=dt;d.mesh.scale.y=reduced?1:Math.min(1,d.born/.5);}}
    for(const z of state.world.zones)if(z.type==='door')this.dynamic.get(z.id).mesh.position.y=state.world.objects.find(o=>o.id===z.plate)?.latched?-3.2:0;
    for(const a of state.anchors){if(!this.dynamic.has(a.id)){const mesh=this.batch([part(0,.13,0,1,.26,1,0xe1c16d),part(0,.9,0,.18,1.4,.18,0xe1c16d),part(-.5,1.1,0,.7,.6,.10,0x78bcbe),part(.5,1.1,0,.7,.6,.10,0x78bcbe)]);mesh.position.set(a.x,heightAt(state,a.x,a.z),a.z);this.dynamic.set(a.id,{mesh,kind:'anchor'});}}
    for(const [id,d] of this.dynamic)if(d.kind==='anchor'&&!state.anchors.some(a=>a.id===id)){this.root.remove(d.mesh);d.mesh.dispose();this.dynamic.delete(id);}
    if(state.status==='finishing'||state.status==='won'){
      this.treeParts.forEach((part,i)=>this.tree.setColorAt(i,color(i<6?0x9d7752:0xf2c759)));this.tree.instanceColor.needsUpdate=true;
      if(!reduced)this.treeWheel.rotation.z=state.finalTime;
    }
    // Bounded visual proxies retain actual action endpoints and never grant rewards.
    for(const fx of this.effects){
      if(!fx.mesh){fx.mesh=new THREE.Mesh(this.geo,this.glow);fx.mesh.scale.setScalar(.17);this.root.add(fx.mesh);}
      fx.elapsed+=dt;const t=Math.min(1,fx.elapsed/fx.duration);
      const end=fx.type==='collect'||fx.type==='produce'?{x:p.x-.35,z:p.z}:fx.to;
      fx.mesh.position.set(fx.from.x+(end.x-fx.from.x)*t,1+Math.sin(t*Math.PI)*(reduced?0:1.3),fx.from.z+(end.z-fx.from.z)*t);
      fx.mesh.scale.setScalar((reduced?.12:.18)*(1-t*.6));
    }
    this.effects=this.effects.filter(f=>{if(f.elapsed>=f.duration){this.root.remove(f.mesh);return false;}return true;});
    this.renderer.render(this.scene,this.camera);
  }
  project(point){const p=new THREE.Vector3(point.x,heightAt(this.state,point.x,point.z)+1,point.z).project(this.camera);return {x:(p.x+1)*this.canvas.clientWidth/2,y:(1-p.y)*this.canvas.clientHeight/2,visible:p.z<1&&Math.abs(p.x)<=1&&Math.abs(p.y)<=1};}
  stats(){return {calls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,geometries:this.renderer.info.memory.geometries,textures:this.renderer.info.memory.textures};}
  dispose(){if(this.disposed)return;this.disposed=true;this.resizeObserver.disconnect();this.canvas.removeEventListener('webglcontextlost',this.lost);this.canvas.removeEventListener('webglcontextrestored',this.restored);this.clearWorld();this.handMesh.dispose();for(const g of this.geometries)g.dispose();for(const m of this.materials)m.dispose();this.sun.shadow.map?.dispose();this.renderer.dispose();this.renderer.forceContextLoss();}
}
