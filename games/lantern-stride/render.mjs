// Repository-pinned Three.js r180; visuals never decide simulation outcomes.
import * as THREE from '../block-apex/vendor/three/three.module.min.js';
import { bridgeOpen, segmentFor } from './simulation.mjs';

export function createRenderer(container, onContextLost = () => {}) {
  const renderer = new THREE.WebGLRenderer({antialias:true, alpha:false, powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  let disposed=false;
  renderer.domElement.setAttribute('aria-hidden','true');
  renderer.domElement.addEventListener('webglcontextlost', event => {event.preventDefault();if(!disposed)onContextLost();});
  container.append(renderer.domElement);
  const scene=new THREE.Scene(); scene.background=new THREE.Color(0x80bfd0); scene.fog=new THREE.Fog(0x80bfd0,38,78);
  const camera=new THREE.PerspectiveCamera(58,1,.1,100);
  const ambient=new THREE.HemisphereLight(0xbbeaff,0x304735,2.1); scene.add(ambient);
  const sun=new THREE.DirectionalLight(0xffcf82,2.3); sun.position.set(-8,16,-7); sun.castShadow=true;
  sun.shadow.mapSize.set(1024,1024); Object.assign(sun.shadow.camera,{left:-9,right:9,top:12,bottom:-12,near:1,far:55}); scene.add(sun);
  const geometries=new Set(), materials=new Set(), textures=new Set();
  function box(parent,w,h,d,x,y,z,color) {
    const g=new THREE.BoxGeometry(w,h,d), m=new THREE.MeshStandardMaterial({color,roughness:.8});
    geometries.add(g); materials.add(m); const mesh=new THREE.Mesh(g,m); mesh.position.set(x,y,z); mesh.castShadow=true; mesh.receiveShadow=true; parent.add(mesh); return mesh;
  }
  function light(parent,x,z) {
    const g=new THREE.Group(); g.position.set(x,0,z); parent.add(g);
    box(g,.17,1.7,.17,0,.85,0,0x795239); box(g,.52,.52,.52,0,1.8,0,0xffc75c);
    box(g,.65,.09,.65,0,2.12,0,0x533f32); box(g,.42,.06,.42,0,2.22,0,0x976644);
  }
  function windFlag(parent,x,z,headwind) {
    const color=headwind?0xe87e50:0x55d3ac;
    box(parent,.14,2.3,.14,x,1.15,z,0x745037);box(parent,.75,.44,.1,x,2.12,z,color);
    const geometry=new THREE.ConeGeometry(.26,.6,3),material=new THREE.MeshStandardMaterial({color:0xffedab,roughness:.8});
    geometries.add(geometry);materials.add(material);const arrow=new THREE.Mesh(geometry,material);
    arrow.rotation.x=headwind?-Math.PI/2:Math.PI/2;arrow.position.set(x,2.12,z+(headwind?-.6:.6));parent.add(arrow);
  }
  function tree(parent,x,z,variant) {
    const g=new THREE.Group(); g.position.set(x,0,z); g.scale.setScalar(variant ? 1.2 : .95); parent.add(g);
    box(g,.45,2.7,.45,0,1.35,0,0x745137);box(g,.12,2.2,.08,.14,1.2,.25,0xa77848);box(g,.8,.18,.3,.34,1.95,0,0x795333);
    box(g,1.8,.7,1.5,0,2.5,0,0x285c4a); box(g,1.45,.7,1.25,.1,3.1,0,0x3f8060);
    box(g,.9,.65,.9,-.12,3.65,0,0x6ea572); box(g,.55,.3,.55,.05,4.12,0,0x9dbd73);
    box(g,.48,.22,.5,-.64,2.84,.52,0x78a96d);box(g,.35,.2,.4,.52,3.3,.38,0x91b77a);
  }
  const world=new THREE.Group(); scene.add(world);
  box(world,40,.25,160,0,-.54,70,0x38563b);box(world,8,.25,150,0,-.2,68,0x8c5c3d); box(world,7.4,.08,150,0,-.04,68,0x8e866b);
  for(let i=0;i<31;i++){
    const z=i*5-5; box(world,7.1,.025,.08,0,.01,z,0xdec889);
    if(i%2===0){light(world,-4.5,z);light(world,4.5,z);}
    if(i%4===0){for(const side of [-1,1]){box(world,7,4,7,side*16,1.6,z+15,0x597d6d);box(world,5,2.6,5,side*16.5,4.5,z+15,0x779c83);box(world,3,1.7,3,side*16,6.6,z+15,0x9bb8a0);}}
    tree(world,-7-(i%3),z+2,i%2); tree(world,7+(i%2),z+4,(i+1)%2);
    // Repeated scenery is baked with the track below: no per-frame allocations.
    if(i%2===0){
      box(world,.8,.35,.7,-5.3,.17,z+2,0x4f8157);box(world,.5,.3,.55,-5.55,.42,z+2,0x77a76a);box(world,.7,.22,.55,5.5,.11,z+3,0x758878);
      for(const [x,offset,c] of [[-5.1,.8,0xffd464],[-5.8,1.1,0xf18b76],[5.2,1.6,0xffdf80],[5.9,2.1,0xf4aeb0]]){
        box(world,.08,.32,.08,x,.16,z+offset,0x3e8b59);box(world,.24,.13,.24,x,.35,z+offset,c);
      }
    }
    // Short fence and fluttering colored pennants make the route read as a festival.
    for(const side of [-1,1]){
      const x=side*4.05;box(world,.18,.8,.18,x,.4,z+1,0x9a653e);box(world,.2,.2,.2,x,.89,z+1,0xf5ca73);
      box(world,.12,.11,4.8,x,.61,z+3.4,0xc38b4e);
      if(i%3===1){box(world,.12,1.8,.12,side*4.65,.9,z+2,0x855438);box(world,.7,.3,.08,side*4.65,.96,z+2,0xf0b64f);box(world,.52,.25,.08,side*4.65,1.3,z+2,0x1d96b2);}
    }

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
  // Original flag artwork is a shared atlas-backed billboard, placed within the 3D scene.
  const flagTexture=new THREE.TextureLoader().load(new URL('assets/props.webp',import.meta.url).href,texture=>{if(disposed)texture.dispose();});
  flagTexture.colorSpace=THREE.SRGBColorSpace;flagTexture.repeat.set(1/3,1/3);flagTexture.offset.set(0,0);textures.add(flagTexture);
  const flagMaterial=new THREE.SpriteMaterial({map:flagTexture,transparent:true,depthWrite:false});materials.add(flagMaterial);
  const flags=new THREE.Group();scene.add(flags);
  for(let i=1;i<12;i++){const flag=new THREE.Sprite(flagMaterial);flag.position.set(i%2?-4.0:4.0,1.2,i*11+6);flag.scale.set(2.4,2.4,1);flags.add(flag);}
  const markers=new THREE.Group(); scene.add(markers);
  const fia=new THREE.Group(); scene.add(fia);
  // Deliberately designed block-animal silhouette with jointed independent legs.
  box(fia,.9,1.0,.56,0,1.33,0,0xd87427); box(fia,.56,.7,.08,0,1.31,.33,0xffe5ae);box(fia,.3,.08,.62,0,.93,0,0x9b4f20);
  const head=new THREE.Group();fia.add(head);head.rotation.y=1.55;
  box(head,1.15,.93,.8,0,2.15,0,0xe98224); box(head,.78,.28,.34,0,1.98,.5,0xffe7ba);
  box(head,.2,.13,.15,0,2.08,.7,0x38291f);
  const arms=[];
  for(const x of [-.32,.32]){
    box(head,.34,.4,.05,x,2.3,.42,0x9a4a21);box(head,.27,.34,.08,x,2.3,.47,0xfff7e4); box(head,.13,.23,.06,x,2.3,.53,0x267fa9);box(head,.05,.07,.03,x-.025,2.36,.57,0xffffff);
    box(head,.36,.58,.34,x*1.6,2.77,-.05,0xaa4e21);box(head,.24,.38,.08,x*1.6,2.8,.15,0xffddbb);box(head,.23,.12,.35,x*1.6,3.07,-.05,0x6e3926);
    const arm=new THREE.Group();arm.position.set(x*1.9,1.7,0);fia.add(arm);
    box(arm,.22,.62,.25,0,-.3,0,0xe1842e);box(arm,.3,.22,.32,0,-.6,.04,0x4c3527);box(arm,.2,.1,.36,0,-.55,.08,0xffd15d);arms.push(arm);
  }
  box(head,.18,.4,.06,0,2.59,.42,0xf8d74b);box(head,.27,.12,.08,-.05,2.48,.48,0xf8d74b);box(head,.27,.12,.08,.05,2.68,.48,0xf8d74b);
  box(fia,1.02,.19,.7,0,1.72,0,0x1689bd); box(fia,.28,.22,.1,.29,1.72,.42,0xffd554);
  box(fia,.28,.3,.28,.15,1.55,-.5,0x128bd5); box(fia,.3,.3,.3,.42,1.42,-.72,0x14a9e8);
  box(fia,.35,.3,.35,.7,1.29,-.9,0x1b8fcd); box(fia,.22,.25,.22,.91,1.22,-1.03,0xffd446);
  box(fia,.6,.45,.9,0,1.1,-.72,0xd66d25); box(fia,.5,.4,.47,0,1.15,-1.34,0xffe0a4);
  const legs=[];
  for(const x of [-.29,.29]) {const pivot=new THREE.Group();pivot.position.set(x,.98,0);fia.add(pivot);
    box(pivot,.3,.68,.32,0,-.32,0,0xdc7726);box(pivot,.4,.25,.55,0,-.67,.14,0x44352a);box(pivot,.25,.12,.13,0,-.67,.44,0xffe5ba);legs.push(pivot);}
  // One reusable foot-contact burst; it only appears after an accepted step.
  const contact=new THREE.Group();scene.add(contact);contact.visible=false;
  const contactBits=[];
  for(const [x,z,size] of [[-.38,-.28,.23],[.38,-.28,.23],[-.23,-.56,.18],[.23,-.56,.18]]){
    const bit=box(contact,size,.1,size,x,.13,z,0xffe884);bit.material.transparent=true;bit.material.depthWrite=false;contactBits.push(bit);
  }
  const trail=new THREE.Group();fia.add(trail);for(const [x,z,size] of [[-.55,-1.45,.17],[.44,-1.7,.13],[0,-2,.1]])box(trail,size,.04,size,x,.08,z,0xffdf65);trail.visible=false;
  let stageId=null, markerMeshes=[], visualLane=0;
  function configure(stage) {
    if(stageId===stage.id)return; stageId=stage.id;
    for(const child of [...markers.children]) {child.traverse(node=>{if(node.isMesh){node.geometry.dispose();node.material.dispose();geometries.delete(node.geometry);materials.delete(node.material);}});markers.remove(child);}
    markerMeshes=[];
    for(let i=0;i<stage.route.length;i++) {
      const rule=stage.route[i], start=stage.distance*i/stage.route.length, length=stage.distance/stage.route.length;
      const color=rule==='slow'?0x65a7b7:rule==='fast'||rule==='headfast'?0xf0b85a:rule==='bridge'?0x5c9ca2:rule.startsWith('fork')?0x8a78ad:0x9b9074;
      const surface=box(markers,6.8,.04,Math.max(.2,length-.12),0,.03,start+length/2,color); const marker={surface,rule,leftLane:null,rightLane:null};markerMeshes.push(marker);
      // Repeated inlays distinguish surfaces at a glance without covering the live bridge light.
      if(rule==='bridge') {
        for(const x of [-3.16,3.16])box(markers,.16,.1,Math.max(.2,length-.35),x,.10,start+length/2,0xd4b576);
        for(let k=1;k<=4;k++)box(markers,5.95,.025,.10,0,.07,start+length*k/5,0xb8dfcc);
      }
      if(rule==='slow'||rule==='fast'||rule==='headfast') {
        const inlay=rule==='slow'?0xc0e2df:0xffe5a4;
        for(let k=1;k<=3;k++) {
          if(rule==='slow')for(const x of [-1.15,1.15])box(markers,1.35,.025,.12,x,.07,start+length*k/4,inlay);
          else box(markers,3.3,.025,.12,0,.07,start+length*k/4,inlay);
        }
      }
      if(rule==='headwind'||rule==='headfast'||rule==='tailwind')windFlag(markers,3.55,start+2,rule!=='tailwind');
      if(rule==='forkwindbridge')windFlag(markers,-1.7,start+2,true);
      if(rule==='forkmaster')windFlag(markers,1.7,start+2,true);
      if(rule.startsWith('fork')) {
        box(markers,.16,.05,Math.max(.2,length-.3),0,.09,start+length/2,0xffe2a0);
        marker.leftLane=box(markers,3.05,.05,Math.max(.2,length-.3),-1.72,.08,start+length/2,0xd7a266);
        marker.rightLane=box(markers,3.05,.05,Math.max(.2,length-.3),1.72,.08,start+length/2,0x78a8b5);
      }
      if(rule==='left'||rule==='right'||rule.startsWith('fork')) {
        box(markers,.2,2.2,.2,-3.2,1.1,start+2,0x885d35); box(markers,.2,2.2,.2,3.2,1.1,start+2,0x885d35);
        box(markers,6.4,.18,.2,0,2.2,start+2,0xd9af64);
        if(rule.startsWith('fork')) {box(markers,.85,.5,.12,-1.7,1.65,start+1.88,0xf4d972);box(markers,.85,.5,.12,1.7,1.65,start+1.88,0x92d2e4);}
        else {box(markers,.85,.5,.12,rule==='left'?-1.7:1.7,1.65,start+1.88,0xf4d972);}
      }
    }
    box(markers,.2,3,.2,-3.3,1.5,stage.distance,0xb17748); box(markers,.2,3,.2,3.3,1.5,stage.distance,0xb17748);
    box(markers,6.8,.3,.25,0,3,stage.distance,0xe9c97b);
  }
  function resize() {const r=container.getBoundingClientRect(); if(r.width<=0||r.height<=0)return;renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.fov=THREE.MathUtils.radToDeg(2*Math.atan(Math.tan(THREE.MathUtils.degToRad(29))*Math.min(1,1.1/camera.aspect)));camera.updateProjectionMatrix();}
  function draw(race,reducedMotion=false) {
    configure(race.stage); const z=race.distance;
    const part=segmentFor(race),targetLane=part.original.startsWith('fork')?(part.choice==='left'?-1.7:part.choice==='right'?1.7:0):0;
    visualLane=reducedMotion?targetLane:THREE.MathUtils.lerp(visualLane,targetLane,.16);const lane=visualLane;
    fia.position.set(lane,0,z); camera.position.set(6.2+lane,6.0,z-9.0);camera.lookAt(lane,camera.aspect>1.1?1.6:1.3,z+(camera.aspect>1.1?1.3:5.0));
    sun.position.set(-8,16,z-7);sun.target.position.set(0,0,z+2);scene.add(sun.target);
    const phase=race.lastStep===null?0:Math.min(1,(race.elapsed-race.lastStep)/.35);
    const amplitude=reducedMotion?0:Math.sin(phase*Math.PI)*.55;
    const contactVisible=race.lastStep!==null&&phase<1;
    contact.visible=contactVisible;
    if(contactVisible){
      const clean=race.lastFeedback==='steady',strength=clean&&race.combo>=3?1.3:1;
      contact.position.set(lane+(race.lastFoot==='left'?-.3:.3),0,race.lastContactDistance);
      contact.scale.setScalar(reducedMotion?1:strength*(.7+phase*.8));
      for(const bit of contactBits){bit.material.opacity=reducedMotion?.8:Math.max(0,1-phase);bit.material.color.setHex(clean?0xffd873:0xe7a29a);}
    }
    fia.position.y=reducedMotion?0:Math.sin(phase*Math.PI)*.08;

    legs[0].rotation.x=(race.lastFoot==='left'?1:-1)*amplitude; legs[1].rotation.x=-legs[0].rotation.x;
    arms[0].rotation.x=-legs[0].rotation.x*.7;arms[1].rotation.x=-legs[1].rotation.x*.7;
    fia.rotation.z=reducedMotion?0:(race.balance<30?.12:0);
    markerMeshes.forEach((m,i)=>{
      if(m.rule==='bridge')m.surface.material.color.setHex(i===part.index&&bridgeOpen(race)?0x96e5bf:0x3e777b);
      if(m.leftLane&&m.rightLane){
        const activeBridge=i===part.index&&part.rule==='bridge',glow=activeBridge&&bridgeOpen(race)?0x96e5bf:0x3e777b;
        m.leftLane.material.color.setHex(activeBridge&&part.choice==='left'?glow:0xd7a266);
        m.rightLane.material.color.setHex(activeBridge&&part.choice==='right'?glow:0x78a8b5);
      }
    });
    renderer.render(scene,camera);
  }
  function dispose(){if(disposed)return;disposed=true;renderer.setAnimationLoop(null);for(const g of geometries)g.dispose();for(const m of materials)m.dispose();for(const t of textures)t.dispose();sun.shadow.dispose();renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();}
  resize(); return {draw,resize,dispose,setTrail:enabled=>{trail.visible=!!enabled;},info:()=>({threeRevision:THREE.REVISION,pixelRatio:renderer.getPixelRatio(),calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures})};
}
