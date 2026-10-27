import * as THREE from '/games/animal-skyspire-drop/vendor/three/three.module.min.js';

// One retained, demand-rendered scene. Native DOM targets use the same projected
// world anchors as the meshes, so resizing cannot change the puzzle or picking.
export function createCanopyScene(host,onPositions,onFailure) {
  const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.75));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.25;
  renderer.setClearColor(0x081d29,0);
  renderer.domElement.setAttribute('aria-hidden','true');
  host.prepend(renderer.domElement);
  const scene=new THREE.Scene();
  const camera=new THREE.OrthographicCamera(-7,7,7,-7,.1,100);
  camera.position.set(0,18,9);camera.lookAt(0,0,0);
  scene.add(new THREE.HemisphereLight(0xc1e7ff,0x173b3c,2));
  const sun=new THREE.DirectionalLight(0xffd69c,3.6);sun.position.set(-7,12,5);scene.add(sun);
  const rim=new THREE.DirectionalLight(0x63d5e0,2);rim.position.set(8,6,-8);scene.add(rim);
  const geometries=new Set(),materials=new Set(),staticBuckets=new Map();
  const material=(color,extra={})=>{const m=new THREE.MeshStandardMaterial({color,roughness:.72,metalness:.12,...extra});materials.add(m);return m;};
  const wood=material(0x634431),plank=material(0x9e7650),edge=material(0xc29960),brass=material(0xcfa75e,{metalness:.7,roughness:.32}),dark=material(0x133744),ink=material(0x284a59);
  const leaves=[0x123b3c,0x1b5551,0x27726a,0x358779].map(n=>material(n));
  const glows=Array.from({length:8},()=>material(0xaacdc5,{emissive:0x163c32,emissiveIntensity:.4}));
  const gold=material(0xffd17a,{metalness:.45,emissive:0x96601a,emissiveIntensity:.45});
  const box=new THREE.BoxGeometry(1,1,1);geometries.add(box);
  const cylinder=new THREE.CylinderGeometry(1,1,1,8);geometries.add(cylinder);
  const dummy=new THREE.Object3D();
  function solid(geometry,mat,x,y,z,sx,sy,sz,rotation=0) {
    const key=`${geometry.uuid}:${mat.uuid}`;
    if(!staticBuckets.has(key))staticBuckets.set(key,{geometry,mat,items:[]});
    staticBuckets.get(key).items.push({x,y,z,sx,sy,sz,rotation});
  }
  const anchors=[];
  for(let i=0;i<8;i++){
    const a=i*Math.PI/4,x=Math.sin(a)*4.45,z=-Math.cos(a)*4.45;
    anchors.push(new THREE.Vector3(x,1.18,z));
    // Timber tower: tapered trunk, layered octagonal deck, plank seams and four lantern posts.
    solid(cylinder,wood,x,-.7,z,.72,3,.72);
    solid(cylinder,edge,x,.82,z,1.02,.22,1.02);
    solid(cylinder,dark,x,.99,z,.94,.16,.94);
    for(let p=-2;p<=2;p++)solid(box,plank,x+p*.28,1.09,z,.24,.045,1.25);
    for(const dx of [-.66,.66])for(const dz of [-.66,.66]){
      solid(box,wood,x+dx,1.22,z+dz,.09,.42,.09);
      solid(box,brass,x+dx,1.45,z+dz,.17,.08,.17);
      solid(box,gold,x+dx,1.57,z+dz,.11,.16,.11);
    }
    // A real raised beacon frame; its material carries selection/success feedback.
    const ringGeometry=new THREE.TorusGeometry(.92,.035,4,8);geometries.add(ringGeometry);
    const ring=new THREE.Mesh(ringGeometry,glows[i]);ring.rotation.x=-Math.PI/2;ring.position.set(x,1.16,z);scene.add(ring);
    // Radial wooden bridges, with visible individual boards.
    for(let p=0;p<7;p++){
      const r=1.55+p*.29;
      solid(box,p%2?wood:plank,Math.sin(a)*r,.48,-Math.cos(a)*r,.52,.075,.23,-a);
    }
    // Layered block-built canopy around the tower bases.
    for(let j=0;j<4;j++){
      const v=a+(j-1.5)*.2,rad=5.8+(j%2)*.5;
      for(let k=0;k<3;k++)solid(box,leaves[(i+j+k)%4],Math.sin(v)*rad,-2.3+k*.35,-Math.cos(v)*rad,1.7-k*.36,.42,1.5-k*.3,a*.3);
    }
  }
  solid(cylinder,wood,0,-.42,0,1.62,1.5,1.62);
  solid(cylinder,brass,0,.42,0,1.72,.16,1.72);
  solid(cylinder,dark,0,.56,0,1.58,.12,1.58);
  for(let i=0;i<16;i++){
    const a=i*Math.PI/8;
    solid(box,i%2?ink:brass,Math.sin(a)*1.35,.65,-Math.cos(a)*1.35,.055,.025,i%2?.15:.31,-a);
  }
  const tipGeometry=new THREE.ConeGeometry(.32,1.45,4);geometries.add(tipGeometry);
  const needle=new THREE.Group();
  const tip=new THREE.Mesh(tipGeometry,gold);tip.rotation.x=-Math.PI/2;tip.position.z=-.6;needle.add(tip);
  const tail=new THREE.Mesh(tipGeometry,ink);tail.rotation.x=Math.PI/2;tail.scale.set(.65,.65,.65);tail.position.z=.45;needle.add(tail);
  needle.position.y=.86;scene.add(needle);
  solid(cylinder,brass,0,.84,0,.19,.3,.19);
  for(const {geometry,mat,items} of staticBuckets.values()){
    const mesh=new THREE.InstancedMesh(geometry,mat,items.length);
    items.forEach((p,i)=>{dummy.position.set(p.x,p.y,p.z);dummy.scale.set(p.sx,p.sy,p.sz);dummy.rotation.set(0,p.rotation,0);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);});
    mesh.instanceMatrix.needsUpdate=true;scene.add(mesh);
  }
  staticBuckets.clear();
  let frame=0,active=true,disposed=false,angle=0,from=0,to=0,start=0,duration=0,lost=false;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const metrics=()=>{
    host.dataset.renderCalls=String(renderer.info.render.calls);
    host.dataset.renderTriangles=String(renderer.info.render.triangles);
    host.dataset.renderGeometries=String(renderer.info.memory.geometries);
    host.dataset.renderTextures=String(renderer.info.memory.textures);
    host.dataset.threeRevision=THREE.REVISION;
  };
  function render(now=performance.now()){
    frame=0;if(disposed||!active||lost)return;
    const t=duration?Math.min(1,(now-start)/duration):1;
    angle=from+(to-from)*(1-Math.pow(1-t,3));needle.rotation.y=-angle;
    renderer.render(scene,camera);metrics();
    if(t<1)frame=requestAnimationFrame(render);
  }
  function request(){if(active&&!frame&&!disposed)frame=requestAnimationFrame(render);}
  function resize(){
    // The shared frame may scale its logical scene. DOM positions must remain
    // in the same local CSS coordinates, never the transformed viewport size.
    const width=host.clientWidth,height=host.clientHeight;if(width<1||height<1||disposed)return;
    renderer.setSize(width,height,false);
    const aspect=width/height,halfH=Math.max(6,6/aspect);
    camera.left=-halfH*aspect;camera.right=halfH*aspect;camera.top=halfH;camera.bottom=-halfH;camera.updateProjectionMatrix();camera.updateMatrixWorld();
    onPositions(anchors.map(p=>{const v=p.clone().project(camera);return{x:(v.x+1)*width/2,y:(1-v.y)*height/2};}));
    request();
  }
  const observer=new ResizeObserver(resize);observer.observe(host);
  function select(direction,excluded=[],hinted=[],lit=-1){
    if(direction>=0){
      from=angle;const target=direction*Math.PI/4;to=from+Math.atan2(Math.sin(target-from),Math.cos(target-from));
      duration=reduced.matches?0:240;start=performance.now();
    }
    glows.forEach((m,i)=>{
      m.color.setHex(i===lit?0xffd17a:i===direction?0xffd17a:hinted.includes(i)?0x77e8de:excluded.includes(i)?0x36515b:0xaacdc5);
      m.emissive.setHex(i===lit||i===direction?0xc28a30:hinted.includes(i)?0x247d70:0x163c32);
      m.emissiveIntensity=(i===lit||i===direction)? .9:.35;
    });request();
  }
  // Local candidate use only: one retained block ribbon spans the two actual
  // tower anchors. Reuse the owned box geometry and dispose its material with
  // the scene; no mesh or texture is created per selection.
  let ribbon=null;
  function link(anchor,destination,blocked=-1){
    const valid=n=>Number.isInteger(n)&&n>=0&&n<8;
    if(valid(anchor)){glows[anchor].color.setHex(0x67e4f2);glows[anchor].emissive.setHex(0x1b7f8c);glows[anchor].emissiveIntensity=.9;}
    if(valid(blocked)){glows[blocked].color.setHex(0x52616b);glows[blocked].emissive.setHex(0x15272b);glows[blocked].emissiveIntensity=.2;}
    if(valid(anchor)&&valid(destination)&&anchor!==destination){
      if(!ribbon){ribbon=new THREE.Mesh(box,material(0x76d9dc,{emissive:0x287a83,emissiveIntensity:.45}));scene.add(ribbon);}
      const a=anchors[anchor],b=anchors[destination],dx=b.x-a.x,dz=b.z-a.z;
      ribbon.position.set((a.x+b.x)/2,1.32,(a.z+b.z)/2);ribbon.scale.set(.14,.12,Math.hypot(dx,dz));ribbon.rotation.y=Math.atan2(dx,dz);ribbon.visible=true;
    }else if(ribbon)ribbon.visible=false;
    request();
  }
  const onLost=e=>{e.preventDefault();lost=true;cancelAnimationFrame(frame);frame=0;onFailure();};
  const onRestored=()=>{lost=false;host.dispatchEvent(new CustomEvent('canopy-render-restored'));resize();};
  renderer.domElement.addEventListener('webglcontextlost',onLost);
  renderer.domElement.addEventListener('webglcontextrestored',onRestored);
  resize();
  return {
    select,link,
    setTheme(aurora){leaves.forEach((m,i)=>m.color.setHex((aurora?[0x222544,0x3e3a68,0x615a88,0x578e8b]:[0x123b3c,0x1b5551,0x27726a,0x358779])[i]));dark.color.setHex(aurora?0x2e315a:0x133744);request();},
    setActive(value){active=value&&!document.hidden;cancelAnimationFrame(frame);frame=0;if(active){from=to;angle=to;duration=0;resize();}},
    dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(frame);observer.disconnect();renderer.domElement.removeEventListener('webglcontextlost',onLost);renderer.domElement.removeEventListener('webglcontextrestored',onRestored);geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove();}
  };
}
