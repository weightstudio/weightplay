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
    const palette=[['#285c4a','#3f8060','#6ea572','#9dbd73'],['#335b48','#568465','#8cad72','#c0c17c'],['#214e52','#3b736e','#74a491','#a9c5a2']][variant%3];
    const g=new THREE.Group(); g.position.set(x,0,z); g.scale.setScalar([.95,1.2,1.08][variant%3]); parent.add(g);
    box(g,.45,2.7,.45,0,1.35,0,0x745137);box(g,.12,2.2,.08,.14,1.2,.25,0xa77848);box(g,.8,.18,.3,.34,1.95,0,0x795333);
    box(g,1.8,.7,1.5,0,2.5,0,palette[0]); box(g,1.45,.7,1.25,.1,3.1,0,palette[1]);
    box(g,.9,.65,.9,-.12,3.65,0,palette[2]); box(g,.55,.3,.55,.05,4.12,0,palette[3]);
    box(g,.48,.22,.5,-.64,2.84,.52,0x78a96d);box(g,.35,.2,.4,.52,3.3,.38,0x91b77a);
    if(variant%3===1)box(g,.55,.32,.48,.75,2.68,-.35,palette[1]);
    if(variant%3===2)box(g,.45,.38,.48,-.7,3.08,-.28,palette[2]);
  }
  const world=new THREE.Group(); scene.add(world);
  box(world,40,.25,160,0,-.54,70,0x38563b);box(world,8,.25,150,0,-.2,68,0x8c5c3d); box(world,7.4,.08,150,0,-.04,68,0x8e866b);
  for(let i=0;i<31;i++){
    const z=i*5-5; box(world,7.1,.025,.08,0,.01,z,0xdec889);
    if(i%2===0){light(world,-4.5,z);light(world,4.5,z);}
    if(i%4===0){for(const side of [-1,1]){box(world,7,4,7,side*16,1.6,z+15,0x597d6d);box(world,5,2.6,5,side*16.5,4.5,z+15,0x779c83);box(world,3,1.7,3,side*16,6.6,z+15,0x9bb8a0);}}
    tree(world,-7-(i%3),z+2,i%3); tree(world,7+(i%2),z+4,(i+1)%3);
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
  // Clouds keep their pale silhouette in backlight and share a single draw call.
  const cloudGeometry=new THREE.BoxGeometry(1,1,1),cloudMaterial=new THREE.MeshBasicMaterial({color:0xfff7de});
  geometries.add(cloudGeometry);materials.add(cloudMaterial);
  const clouds=new THREE.InstancedMesh(cloudGeometry,cloudMaterial,12),cloudMatrix=new THREE.Matrix4();
  let cloudIndex=0;
  for(let i=0;i<4;i++){
    const side=i%2?-1:1,x=side*12,z=i*38+25;
    for(const [dx,y,w,h] of [[0,9.3,3,.72],[side*.15,9.95,1.55,.7],[-side*1.5,9.25,1.05,.52]]){
      cloudMatrix.compose(new THREE.Vector3(x+dx,y,z),new THREE.Quaternion(),new THREE.Vector3(w,h,1.1));
      clouds.setMatrixAt(cloudIndex++,cloudMatrix);
    }
  }
  clouds.computeBoundingSphere();scene.add(clouds);
  // Luminous lantern faces share one instanced material and follow existing posts.
  const lampGeometry=new THREE.BoxGeometry(1,1,1),lampMaterial=new THREE.MeshStandardMaterial({color:0xffd982,emissive:0xffaa40,emissiveIntensity:.65,roughness:.65});
  geometries.add(lampGeometry);materials.add(lampMaterial);
  const lampFaces=new THREE.InstancedMesh(lampGeometry,lampMaterial,32),lampMatrix=new THREE.Matrix4();let lampIndex=0;
  for(let i=0;i<31;i+=2)for(const x of [-4.5,4.5]){
    lampMatrix.compose(new THREE.Vector3(x,1.8,i*5-5),new THREE.Quaternion(),new THREE.Vector3(.46,.46,.54));
    lampFaces.setMatrixAt(lampIndex++,lampMatrix);
  }
  lampFaces.computeBoundingSphere();scene.add(lampFaces);
  // Original flag artwork is a shared atlas-backed billboard, placed within the 3D scene.
  const flagTexture=new THREE.TextureLoader().load(new URL('assets/props.webp',import.meta.url).href,texture=>{if(disposed)texture.dispose();});
  flagTexture.colorSpace=THREE.SRGBColorSpace;flagTexture.repeat.set(1/3,1/3);flagTexture.offset.set(0,0);textures.add(flagTexture);
  const earthTexture=new THREE.TextureLoader().load(new URL('assets/track-earth.webp',import.meta.url).href,texture=>{if(disposed)texture.dispose();});
  earthTexture.colorSpace=THREE.SRGBColorSpace;earthTexture.wrapS=earthTexture.wrapT=THREE.RepeatWrapping;earthTexture.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());textures.add(earthTexture);
  const flagMaterial=new THREE.SpriteMaterial({map:flagTexture,transparent:true,depthWrite:false});materials.add(flagMaterial);
  const flags=new THREE.Group();scene.add(flags);
  for(let i=1;i<12;i++){const flag=new THREE.Sprite(flagMaterial);flag.position.set(i%2?-4.0:4.0,1.05,i*11+6);flag.scale.set(1.8,1.8,1);flags.add(flag);}
  const markers=new THREE.Group(); scene.add(markers);
  const fia=new THREE.Group(); scene.add(fia);
  // Deliberately designed block-animal silhouette with jointed independent legs.
  box(fia,.9,1.0,.56,0,1.33,0,0xd87427); box(fia,.56,.7,.08,0,1.31,.33,0xffe5ae);box(fia,.3,.08,.62,0,.93,0,0x9b4f20);
  const head=new THREE.Group();fia.add(head);head.rotation.y=1.95;
  box(head,1.15,.93,.8,0,2.15,0,0xe98224); box(head,.78,.28,.34,0,1.98,.5,0xffe7ba);
  box(head,.16,.20,.11,-.53,1.98,.38,0xffd9a1);box(head,.16,.20,.11,.53,1.98,.38,0xffd9a1);
  box(head,.34,.08,.06,-.32,2.51,.44,0x974820);box(head,.34,.08,.06,.32,2.51,.44,0x974820);
  box(head,.2,.13,.15,0,2.08,.7,0x38291f);
  const arms=[];
  for(const x of [-.32,.32]){
    box(head,.34,.4,.05,x,2.3,.42,0x9a4a21);box(head,.27,.34,.08,x,2.3,.47,0xfff7e4); box(head,.13,.23,.06,x,2.3,.53,0x267fa9);box(head,.05,.07,.03,x-.025,2.36,.57,0xffffff);
    box(head,.36,.58,.34,x*1.6,2.77,-.05,0xaa4e21);box(head,.24,.38,.08,x*1.6,2.8,.15,0xffddbb);box(head,.23,.12,.35,x*1.6,3.07,-.05,0x6e3926);
    const arm=new THREE.Group();arm.position.set(x*1.9,1.7,0);fia.add(arm);
    box(arm,.22,.62,.25,0,-.3,0,0xe1842e);box(arm,.3,.22,.32,0,-.6,.04,0x4c3527);box(arm,.2,.1,.36,0,-.55,.08,0xffd15d);arms.push(arm);
  }
  const boltShape=new THREE.Shape();boltShape.moveTo(.02,2.70);boltShape.lineTo(-.13,2.46);boltShape.lineTo(-.02,2.46);boltShape.lineTo(-.09,2.30);boltShape.lineTo(.15,2.53);boltShape.lineTo(.04,2.53);boltShape.closePath();
  const boltGeometry=new THREE.ExtrudeGeometry(boltShape,{depth:.045,bevelEnabled:false}),boltMaterial=new THREE.MeshStandardMaterial({color:0xffdc4f,roughness:.65});
  geometries.add(boltGeometry);materials.add(boltMaterial);const bolt=new THREE.Mesh(boltGeometry,boltMaterial);bolt.position.z=.43;head.add(bolt);
  box(head,.22,.045,.04,.28,1.90,.64,0x513225);box(head,.06,.08,.04,.40,1.94,.64,0x513225);
  box(fia,1.02,.19,.7,0,1.72,0,0x1689bd); box(fia,.28,.22,.1,.29,1.72,.42,0xffd554);
  const scarf=new THREE.Group();scarf.position.set(0,1.72,0);fia.add(scarf);
  box(scarf,.28,.3,.28,.15,-.17,-.5,0x128bd5); box(scarf,.3,.3,.3,.42,-.30,-.72,0x14a9e8);
  box(scarf,.35,.3,.35,.7,-.43,-.9,0x1b8fcd); box(scarf,.22,.25,.22,.91,-.50,-1.03,0xffd446);
  box(fia,.7,.55,.9,0,1.1,-.72,0xd66d25);box(fia,.48,.13,.2,.12,1.4,-.83,0xf8ce4c);
  box(fia,.55,.44,.52,0,1.15,-1.34,0xffe0a4);
  const legs=[];
  for(const x of [-.29,.29]) {const pivot=new THREE.Group();pivot.position.set(x,.98,0);fia.add(pivot);
    box(pivot,.3,.68,.32,0,-.32,0,0xdc7726);box(pivot,.4,.25,.55,0,-.67,.14,0x44352a);box(pivot,.11,.12,.13,-.07,-.67,.44,0xffe5ba);box(pivot,.11,.12,.13,.07,-.67,.44,0xffe5ba);legs.push(pivot);}
  // One reusable foot-contact burst; it only appears after an accepted step.
  const contact=new THREE.Group();scene.add(contact);contact.visible=false;
  const contactBits=[];
  for(const [x,z,size] of [[-.38,-.28,.23],[.38,-.28,.23],[-.23,-.56,.18],[.23,-.56,.18]]){
    const bit=box(contact,size,.1,size,x,.13,z,0xffe884);bit.material.transparent=true;bit.material.depthWrite=false;contactBits.push(bit);
  }
  const trail=new THREE.Group();fia.add(trail);for(const [x,z,size] of [[-.55,-1.45,.17],[.44,-1.7,.13],[0,-2,.1]])box(trail,size,.04,size,x,.08,z,0xffdf65);trail.visible=false;
  const speedWake=new THREE.Group();fia.add(speedWake);speedWake.visible=false;
  for(const [x,z,length] of [[-.55,-.9,.7],[.5,-1.25,1.0],[-.25,-1.6,.55]]){
    const streak=box(speedWake,.07,.06,length,x,.16,z,0x9eeaf2);streak.material.transparent=true;streak.material.opacity=.7;streak.material.depthWrite=false;
  }
  let stageId=null, markerMeshes=[], visualLane=0;
  function configure(stage) {
    if(stageId===stage.id)return; stageId=stage.id;
    const evening=stage.chapter===2;
    scene.background.setHex(evening?0x5b8ca5:0x80bfd0);scene.fog.color.copy(scene.background);
    ambient.color.setHex(evening?0xa3d7ef:0xbbeaff);ambient.intensity=evening?1.9:2.1;
    sun.color.setHex(evening?0xffbc72:0xffcf82);sun.intensity=evening?2.0:2.3;
    for(const child of [...markers.children]) {child.traverse(node=>{if(node.isMesh){node.geometry.dispose();node.material.dispose();geometries.delete(node.geometry);materials.delete(node.material);}});markers.remove(child);}
    markerMeshes=[];
    for(let i=0;i<stage.route.length;i++) {
      const rule=stage.route[i], start=stage.distance*i/stage.route.length, length=stage.distance/stage.route.length;
      const color=rule==='slow'?0x65a7b7:rule==='fast'||rule==='headfast'?0xf0b85a:rule==='bridge'?0x5c9ca2:rule.startsWith('fork')?0x8a78ad:0x9b9074;
      const surface=box(markers,6.8,.04,Math.max(.2,length-.12),0,.03,start+length/2,color); const marker={surface,rule,start,gate:null,leftLane:null,rightLane:null};markerMeshes.push(marker);
      if(['plain','headwind','tailwind','left','right'].includes(rule)) {
        const uv=surface.geometry.getAttribute('uv');for(let v=0;v<uv.count;v++)uv.setXY(v,uv.getX(v)*1.1,uv.getY(v)*length/6);
        uv.needsUpdate=true;surface.material.map=earthTexture;surface.material.needsUpdate=true;
      }
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
        const gate=new THREE.Group();markers.add(gate);marker.gate=gate;
        box(gate,.2,2.2,.2,-3.2,1.1,start,0x885d35); box(gate,.2,2.2,.2,3.2,1.1,start,0x885d35);
        box(gate,6.4,.18,.2,0,2.2,start,0xd9af64);
        if(rule.startsWith('fork')) {box(gate,.85,.5,.12,-1.7,1.65,start-.12,0xf4d972);box(gate,.85,.5,.12,1.7,1.65,start-.12,0x92d2e4);}
        else {box(gate,.85,.5,.12,rule==='left'?-1.7:1.7,1.65,start-.12,0xf4d972);}
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
      const clean=race.lastFeedback==='steady',strength=clean&&race.combo>=12?1.6:clean&&race.combo>=3?1.3:1;
      contact.position.set(lane+(race.lastFoot==='left'?-.3:.3),0,race.lastContactDistance);
      contact.scale.setScalar(reducedMotion?1:strength*(.7+phase*.8));
      for(const bit of contactBits){bit.material.opacity=reducedMotion?.8:Math.max(0,1-phase);bit.material.color.setHex(clean?0xffd873:0xe7a29a);}
    }
    fia.position.y=reducedMotion?0:Math.sin(phase*Math.PI)*.08;

    legs[0].rotation.x=(race.lastFoot==='left'?1:-1)*amplitude; legs[1].rotation.x=-legs[0].rotation.x;
    arms[0].rotation.x=-legs[0].rotation.x*.7;arms[1].rotation.x=-legs[1].rotation.x*.7;
    scarf.rotation.y=reducedMotion||race.speed<.2?0:Math.sin(race.elapsed*4)*.13;
    speedWake.visible=race.combo>=12&&race.speed>2&&!reducedMotion;
    speedWake.position.z=speedWake.visible?-.16*(.5+.5*Math.sin(race.elapsed*9)):0;
    fia.rotation.z=reducedMotion?0:(race.balance<30?.12:0);
    markerMeshes.forEach((m,i)=>{
      if(m.gate)m.gate.visible=z<=m.start+.5;
      if(m.rule==='bridge')m.surface.material.color.setHex(i===part.index&&bridgeOpen(race)?0x96e5bf:0x3e777b);
      if(m.leftLane&&m.rightLane){
        const activeBridge=i===part.index&&part.rule==='bridge',glow=activeBridge&&bridgeOpen(race)?0x96e5bf:0x3e777b;
        m.leftLane.material.color.setHex(activeBridge&&part.choice==='left'?glow:0xd7a266);
        m.rightLane.material.color.setHex(activeBridge&&part.choice==='right'?glow:0x78a8b5);
      }
    });
    renderer.render(scene,camera);
  }
  function dispose(){if(disposed)return;disposed=true;renderer.setAnimationLoop(null);clouds.dispose();lampFaces.dispose();for(const g of geometries)g.dispose();for(const m of materials)m.dispose();for(const t of textures)t.dispose();sun.shadow.dispose();renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();}
  resize(); return {draw,resize,dispose,setTrail:enabled=>{trail.visible=!!enabled;},info:()=>({threeRevision:THREE.REVISION,pixelRatio:renderer.getPixelRatio(),calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures})};
}
