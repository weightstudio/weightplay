// Repository-pinned Three.js r180; visuals never decide simulation outcomes.
import * as THREE from '../block-apex/vendor/three/three.module.min.js';
import { bridgeOpen, segmentFor } from './simulation.mjs';

export function createRenderer(container) {
  const renderer = new THREE.WebGLRenderer({antialias:true, alpha:false, powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.domElement.setAttribute('aria-hidden','true'); container.append(renderer.domElement);
  const scene=new THREE.Scene(); scene.background=new THREE.Color(0x142c39); scene.fog=new THREE.Fog(0x142c39,25,68);
  const camera=new THREE.PerspectiveCamera(48,1,.1,100);
  const ambient=new THREE.HemisphereLight(0xbbeaff,0x304735,2.1); scene.add(ambient);
  const sun=new THREE.DirectionalLight(0xffcf82,2.3); sun.position.set(-8,16,-7); sun.castShadow=true;
  sun.shadow.mapSize.set(1024,1024); Object.assign(sun.shadow.camera,{left:-9,right:9,top:12,bottom:-12,near:1,far:55}); scene.add(sun);
  const geometries=new Set(), materials=new Set();
  function box(parent,w,h,d,x,y,z,color) {
    const g=new THREE.BoxGeometry(w,h,d), m=new THREE.MeshStandardMaterial({color,roughness:.8});
    geometries.add(g); materials.add(m); const mesh=new THREE.Mesh(g,m); mesh.position.set(x,y,z); mesh.castShadow=true; mesh.receiveShadow=true; parent.add(mesh); return mesh;
  }
  function light(parent,x,z) {
    const g=new THREE.Group(); g.position.set(x,0,z); parent.add(g);
    box(g,.17,1.7,.17,0,.85,0,0x795239); box(g,.52,.52,.52,0,1.8,0,0xffc75c);
    box(g,.65,.09,.65,0,2.12,0,0x533f32); box(g,.42,.06,.42,0,2.22,0,0x976644);
  }
  function tree(parent,x,z,variant) {
    const g=new THREE.Group(); g.position.set(x,0,z); g.scale.setScalar(variant ? 1.2 : .95); parent.add(g);
    box(g,.45,2.7,.45,0,1.35,0,0x745137);
    box(g,1.8,.7,1.5,0,2.5,0,0x285c4a); box(g,1.45,.7,1.25,.1,3.1,0,0x3f8060);
    box(g,.9,.65,.9,-.12,3.65,0,0x6ea572); box(g,.55,.3,.55,.05,4.12,0,0x9dbd73);
  }
  const world=new THREE.Group(); scene.add(world);
  box(world,8,.25,150,0,-.2,68,0x79533a); box(world,7.4,.08,150,0,-.04,68,0x535e4d);
  for(let i=0;i<31;i++){
    const z=i*5-5; box(world,7.1,.025,.08,0,.01,z,0xdec889);
    if(i%2===0){light(world,-4.5,z);light(world,4.5,z);}
    tree(world,-7-(i%3),z+2,i%2); tree(world,7+(i%2),z+4,(i+1)%2);
  }
  // Bake static scenery into one vertex-colour mesh; never allocate per-frame.
  world.updateMatrixWorld(true);
  const positions=[], normals=[], colors=[];
  world.traverse(node=>{
    if(!node.isMesh)return;
    const geom=node.geometry.toNonIndexed();geom.applyMatrix4(node.matrixWorld);
    const p=geom.getAttribute('position'), n=geom.getAttribute('normal'), color=node.material.color;
    for(let i=0;i<p.count;i++){positions.push(p.getX(i),p.getY(i),p.getZ(i));normals.push(n.getX(i),n.getY(i),n.getZ(i));colors.push(color.r,color.g,color.b);}
    geom.dispose();node.geometry.dispose();node.material.dispose();geometries.delete(node.geometry);materials.delete(node.material);
  });
  world.clear();
  const baked=new THREE.BufferGeometry();baked.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));baked.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));baked.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
  const worldMat=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.8});geometries.add(baked);materials.add(worldMat);
  const scenery=new THREE.Mesh(baked,worldMat);scenery.castShadow=true;scenery.receiveShadow=true;world.add(scenery);
  const markers=new THREE.Group(); scene.add(markers);
  const fia=new THREE.Group(); scene.add(fia);
  // Deliberately designed block-animal silhouette with jointed independent legs.
  box(fia,.9,1.0,.56,0,1.33,0,0xd87427); box(fia,.56,.7,.08,0,1.31,.33,0xffe5ae);
  box(fia,1.15,.93,.8,0,2.15,0,0xe98224); box(fia,.78,.28,.34,0,1.98,.5,0xffe7ba);
  box(fia,.2,.13,.15,0,2.08,.7,0x38291f);
  for(const x of [-.32,.32]){
    box(fia,.27,.34,.08,x,2.3,.44,0xfff7e4); box(fia,.13,.23,.06,x,2.3,.5,0x267fa9);
    box(fia,.3,.52,.31,x*1.6,2.77,-.05,0xaa4e21); box(fia,.16,.32,.05,x*1.6,2.79,.13,0xffddbb);
    box(fia,.22,.62,.25,x*1.9,1.4,0,0xe1842e);
  }
  box(fia,.18,.4,.06,0,2.59,.42,0xf8d74b);
  box(fia,1.02,.19,.7,0,1.72,0,0x1689bd); box(fia,.28,.22,.1,.29,1.72,.42,0xffd554);
  box(fia,.28,.3,.28,.15,1.55,-.5,0x128bd5); box(fia,.3,.3,.3,.42,1.42,-.72,0x14a9e8);
  box(fia,.35,.3,.35,.7,1.29,-.9,0x1b8fcd); box(fia,.22,.25,.22,.91,1.22,-1.03,0xffd446);
  box(fia,.6,.45,.9,0,1.1,-.72,0xd66d25); box(fia,.5,.4,.47,0,1.15,-1.34,0xffe0a4);
  const legs=[];
  for(const x of [-.29,.29]) {const pivot=new THREE.Group();pivot.position.set(x,.98,0);fia.add(pivot);
    box(pivot,.3,.68,.32,0,-.32,0,0xdc7726);box(pivot,.4,.25,.55,0,-.67,.14,0x44352a);box(pivot,.25,.12,.13,0,-.67,.44,0xffe5ba);legs.push(pivot);}
  const trail=new THREE.Group();fia.add(trail);for(const [x,z,size] of [[-.55,-1.45,.17],[.44,-1.7,.13],[0,-2,.1]])box(trail,size,.04,size,x,.08,z,0xffdf65);trail.visible=false;
  let stageId=null, markerMeshes=[];
  function configure(stage) {
    if(stageId===stage.id)return; stageId=stage.id;
    for(const child of [...markers.children]) {child.traverse(node=>{if(node.isMesh){node.geometry.dispose();node.material.dispose();geometries.delete(node.geometry);materials.delete(node.material);}});markers.remove(child);}
    markerMeshes=[];
    for(let i=0;i<stage.route.length;i++) {
      const rule=stage.route[i], start=stage.distance*i/stage.route.length, length=stage.distance/stage.route.length;
      const color=rule==='slow'?0x65a7b7:rule==='fast'||rule==='headfast'?0xf0b85a:rule==='bridge'?0x5c9ca2:rule.startsWith('fork')?0x8a78ad:0x677461;
      const surface=box(markers,6.8,.04,Math.max(.2,length-.12),0,.03,start+length/2,color); markerMeshes.push({surface,rule});
      if(rule==='left'||rule==='right'||rule.startsWith('fork')) {
        const x=rule==='left'?-1.7:rule==='right'?1.7:0;
        box(markers,.2,2.2,.2,-3.2,1.1,start+2,0x885d35); box(markers,.2,2.2,.2,3.2,1.1,start+2,0x885d35);
        box(markers,6.4,.18,.2,0,2.2,start+2,0xd9af64); box(markers,.85,.5,.12,x,1.65,start+1.88,0xf4d972);
      }
    }
    box(markers,.2,3,.2,-3.3,1.5,stage.distance,0xb17748); box(markers,.2,3,.2,3.3,1.5,stage.distance,0xb17748);
    box(markers,6.8,.3,.25,0,3,stage.distance,0xe9c97b);
  }
  function resize() {const r=container.getBoundingClientRect(); if(r.width<=0||r.height<=0)return;renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();}
  function draw(race,reducedMotion=false) {
    configure(race.stage); const z=race.distance;
    fia.position.set(0,0,z); camera.position.set(7.2,4.4,z+3.3);camera.lookAt(0,1.3,z+.8);
    sun.position.set(-8,16,z-7);sun.target.position.set(0,0,z+2);scene.add(sun.target);
    const phase=race.lastStep===null?0:Math.min(1,(race.elapsed-race.lastStep)/.35);
    const amplitude=reducedMotion?0:Math.sin(phase*Math.PI)*.55;
    legs[0].rotation.x=(race.lastFoot==='left'?1:-1)*amplitude; legs[1].rotation.x=-legs[0].rotation.x;
    fia.rotation.z=reducedMotion?0:(race.balance<30?.12:0);
    markerMeshes.forEach((m,i)=>{if(m.rule==='bridge')m.surface.material.color.setHex(i===segmentFor(race).index&&bridgeOpen(race)?0x96e5bf:0x3e777b);});
    renderer.render(scene,camera);
  }
  function dispose(){renderer.setAnimationLoop(null); for(const g of geometries)g.dispose();for(const m of materials)m.dispose();renderer.dispose();renderer.domElement.remove();}
  resize(); return {draw,resize,dispose,setTrail:enabled=>{trail.visible=!!enabled;},info:()=>({calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures})};
}
