import * as THREE from './vendor/three/three.module.min.js';

const COLORS = {base:0x8a9870,middle:0x84999f,cap:0xd1aa63,anchor:0x9b7f66,bridge:0x78b5b5,marker:0xb59ac4};
export function createCairnScene(host, onError) {
  const renderer = new THREE.WebGLRenderer({alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1,1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x000000,0);
  renderer.domElement.setAttribute('aria-hidden','true');
  host.prepend(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-3.1,3.1,3.3,-3.3,.1,100);
  camera.position.set(4,4.2,7.5); camera.lookAt(0,1.25,0);
  scene.add(new THREE.HemisphereLight(0xf6efda,0x405a65,1.65));
  const sun = new THREE.DirectionalLight(0xffe3ac,3); sun.position.set(-3,6,5); scene.add(sun);
  const rim = new THREE.DirectionalLight(0x8fdaec,1.8); rim.position.set(5,3,-4); scene.add(rim);
  const geometries = new Set(), materials = new Set();
  const boxGeo = new THREE.BoxGeometry(1,1,1); geometries.add(boxGeo);
  const outline=new THREE.Shape();
  outline.moveTo(-.43,-.5);outline.lineTo(.4,-.5);outline.lineTo(.5,-.34);outline.lineTo(.48,.34);
  outline.lineTo(.36,.5);outline.lineTo(-.35,.47);outline.lineTo(-.5,.3);outline.lineTo(-.5,-.35);outline.closePath();
  const rockGeo=new THREE.ExtrudeGeometry(outline,{depth:.25,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.055,bevelThickness:.045});
  rockGeo.rotateX(-Math.PI/2);rockGeo.translate(0,-.13,0);geometries.add(rockGeo);
  const matCache = new Map();
  const material = (color, glow=false) => {
    const key = color+':'+glow;
    if (!matCache.has(key)) { const m=new THREE.MeshStandardMaterial({color,roughness:.82,
      ...(glow?{emissive:color,emissiveIntensity:.75}:{})}); materials.add(m); matCache.set(key,m); }
    return matCache.get(key);
  };
  const box=(parent,color,x,y,z,w,h,d,glow=false)=>{
    const mesh=new THREE.Mesh(boxGeo,material(color,glow));mesh.position.set(x,y,z);mesh.scale.set(w,h,d);parent.add(mesh);return mesh;
  };
  function stone(id) {
    const group=new THREE.Group();
    const widths={base:1.64,middle:1.32,cap:.76,anchor:1.4,bridge:1.22,marker:1.04};
    const w=widths[id], c=COLORS[id];
    const rock=new THREE.Mesh(rockGeo,material(c));rock.scale.set(w,1,.84);group.add(rock);
    box(group,0x496c4a,-w*.24,.165,-.14,w*.29,.045,.3);
    box(group,0x6c8b54,-w*.12,.19,-.18,w*.14,.035,.16);
    box(group,0x334f43,w*.3,-.02,.4,.035,.12,.025);
    box(group,0x6f7e68,w*.22,.17,.11,.13,.018,.075);
    // Each actual mesh has a gold inlay, with a distinct rune matching the tray.
    const rune=new THREE.Group();rune.position.set(0,.015,.48);group.add(rune);
    const bar=(x,y,w,h,angle=0)=>{const b=box(rune,0xffd78a,x,y,0,w,h,.018,true);b.rotation.z=angle;};
    if(id==='base'){bar(0,-.04,.32,.035);bar(0,.045,.23,.035);}
    if(id==='middle'){bar(-.08,0,.035,.2);bar(.08,0,.035,.2);bar(0,0,.18,.035);}
    if(id==='cap'){bar(-.065,0,.035,.22,-.55);bar(.065,0,.035,.22,.55);}
    if(id==='anchor'){bar(0,0,.035,.23);bar(0,-.07,.24,.035);}
    if(id==='bridge'){bar(-.07,0,.035,.2,-.6);bar(.07,0,.035,.2,.6);bar(0,.085,.15,.035);}
    if(id==='marker'){for(let i=0;i<4;i++)bar(Math.cos(i*Math.PI/2)*.07,Math.sin(i*Math.PI/2)*.07,.13,.035,Math.PI/4+i*Math.PI/2);}
    group.userData.id=id;return group;
  }
  // Render the real stone meshes into small image previews using the same context.
  const thumbnails={};
  const thumbScene=new THREE.Scene();
  thumbScene.add(new THREE.HemisphereLight(0xfff5df,0x52626b,3));
  const thumbLight=new THREE.DirectionalLight(0xffffff,3);thumbLight.position.set(-3,4,5);thumbScene.add(thumbLight);
  const thumbCamera=new THREE.OrthographicCamera(-1.12,1.12,.76,-.76,.1,30);
  thumbCamera.position.set(2,1.4,4);thumbCamera.lookAt(0,0,0);
  renderer.setSize(192,128,false);
  for(const id of Object.keys(COLORS)){const mesh=stone(id);thumbScene.add(mesh);renderer.render(thumbScene,thumbCamera);
    thumbnails[id]=renderer.domElement.toDataURL('image/png');thumbScene.remove(mesh);}

  const world=new THREE.Group();scene.add(world);
  box(world,0x4b6862,0,-.17,0,3.9,.28,2.3);
  box(world,0x718973,0,-.01,0,3.7,.08,2.18);
  box(world,0xaaa081,.38,.035,.12,2.0,.05,1.45);
  for(let i=0;i<7;i++){
    const r=new THREE.Mesh(rockGeo,material([0x73877d,0x8c967c,0x516e67][i%3]));
    r.position.set(-1.7+i*.55,-.19,.95);r.scale.set(.45,.7,.42);r.rotation.y=i*.67;world.add(r);
  }
  for(let i=0;i<9;i++){const x=(i%3)*.42-1.7,z=Math.floor(i/3)*.4-.8;
    box(world,[0x435f4d,0x70835c,0x9b9c68][i%3],x,.04,z,.22,.12,.22);}
  for(const [x,z] of [[1.42,.7],[-1.7,.2],[-.9,-.8]]){
    box(world,0x75985c,x,.14,z,.045,.26,.045);
    box(world,0xf4da98,x,.27,z,.13,.06,.13);
    box(world,0xc09454,x,.31,z,.055,.04,.055);
  }
  for(const [x,z,s] of [[-1.62,-.82,.7],[1.7,-.75,.9],[1.8,.65,.38]]){
    const tree=new THREE.Group();tree.position.set(x,0,z);tree.scale.setScalar(s);world.add(tree);
    box(tree,0x6b5141,0,.3,0,.12,.6,.12);
    for(let n=0;n<3;n++)box(tree,[0x34564d,0x476c59,0x628967][n],0,.5+n*.28,0,.65-n*.17,.28,.65-n*.17);
  }
  const courier=new THREE.Group();courier.position.set(-1.22,.08,.55);courier.rotation.y=.2;world.add(courier);
  box(courier,0xa8a16b,0,.42,0,.5,.58,.42);
  box(courier,0x677751,0,.45,-.2,.62,.66,.28);
  for(let i=0;i<4;i++)box(courier,0x7f8b59,(i%2-.5)*.3,.3+Math.floor(i/2)*.3,-.36,.27,.26,.11);
  box(courier,0xb9b17a,0,.94,.08,.59,.5,.48);
  box(courier,0xcfc38e,0,.84,.36,.36,.18,.15);
  for(const x of [-.16,.16]){
    box(courier,0xf9efd3,x,.99,.327,.145,.19,.03);
    box(courier,0x342d23,x+.01,.98,.349,.068,.105,.025);
    box(courier,0xffffff,x-.005,1.01,.365,.024,.029,.012);
    box(courier,0x665b3f,x,1.12,.32,.18,.055,.045);
    box(courier,0xada36a,x,.08,.13,.2,.15,.35);
    box(courier,0xa8a16b,x*2,.5,.08,.16,.32,.22);
  }
  box(courier,0x4c694c,-.08,1.21,-.02,.4,.055,.3);
  box(courier,0x825839,-.34,.36,.13,.2,.3,.28);
  box(courier,0xdeb469,-.34,.39,.28,.08,.08,.025);
  const lantern=box(courier,0xffd78a,.34,.25,.23,.15,.2,.15,true);
  box(courier,0x68523a,.34,.37,.23,.2,.04,.2);box(courier,0x68523a,.34,.13,.23,.2,.04,.2);
  const stones=new Map();for(const id of Object.keys(COLORS)){const mesh=stone(id);mesh.visible=false;world.add(mesh);stones.set(id,mesh);}
  const sparkGeo=new THREE.OctahedronGeometry(.035);geometries.add(sparkGeo);
  const sparks=Array.from({length:18},(_,i)=>{const m=new THREE.Mesh(sparkGeo,material(0xffd78a,true));m.visible=false;scene.add(m);return m;});
  let active=false, disposed=false, raf=0, ends=0, previous=[], successAt=0, finish='moss', animations=[];
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const render=()=>{if(!disposed){renderer.render(scene,camera);
    renderer.domElement.dataset.renderFrames=String(Number(renderer.domElement.dataset.renderFrames||0)+1);
    renderer.domElement.dataset.renderCalls=String(renderer.info.render.calls);
    renderer.domElement.dataset.renderTriangles=String(renderer.info.render.triangles);
    renderer.domElement.dataset.renderGeometries=String(renderer.info.memory.geometries);
    renderer.domElement.dataset.renderTextures=String(renderer.info.memory.textures);
  }};
  function tick(now){raf=0;if(!active||disposed||document.hidden)return;
    for(const a of animations){const t=Math.min(1,(now-a.at)/a.duration),ease=1-Math.pow(1-t,3);
      a.mesh.position.y=a.from+(a.to-a.from)*ease;a.mesh.rotation.z=reduce.matches?0:Math.sin(t*Math.PI)*a.tilt;
      if(t===1&&a.remove)a.mesh.visible=false;}
    if(successAt){const t=(now-successAt)/750;sparks.forEach((m,i)=>{m.visible=t<1&&!reduce.matches;
      m.position.set(.35+Math.cos(i*2.4)*(t*1.4),1+t*2.3-i*.03,Math.sin(i*2.4)*t);m.scale.setScalar(Math.max(.01,1-t));});}
    render();if(now<ends)raf=requestAnimationFrame(tick);else animations=[];
  }
  const kick=()=>{if(active&&!raf&&!document.hidden)raf=requestAnimationFrame(tick);};
  function update(stack,{success=false,skin=finish}={}){
    finish=skin;scene.background=null;
    sun.color.set(skin==='aurora'?0xc2bbff:skin==='alpine'?0xe2f3ff:0xffe3ac);
    rim.color.set(skin==='aurora'?0x68ead8:0x8fdaec);lantern.material=material(skin==='aurora'?0x89ffee:0xffd78a,true);
    const now=performance.now();animations=[];
    for(const [id,mesh] of stones){const i=stack.indexOf(id),old=previous.indexOf(id);
      if(i>=0){const to=.28+i*.42;mesh.visible=true;mesh.position.x=.35;mesh.position.z=0;
        animations.push({mesh,from:reduce.matches?to:old<0?to+1.2:mesh.position.y,to,at:now,duration:reduce.matches?80:320,tilt:old<0?.08:0});
      }else if(old>=0){animations.push({mesh,from:mesh.position.y,to:mesh.position.y+.6,at:now,duration:reduce.matches?1:150,tilt:.2,remove:true});}
      else mesh.visible=false;
    }
    previous=[...stack];successAt=success?now:0;sparks.forEach(s=>s.visible=false);ends=now+(success?800:340);kick();
  }
  function resize(){const rect=host.getBoundingClientRect();if(!rect.width||!rect.height)return;
    renderer.setSize(rect.width,rect.height,false);const aspect=rect.width/rect.height;
    const half=Math.max(2.05,2.55/aspect);camera.left=-half*aspect;camera.right=half*aspect;camera.top=half;camera.bottom=-half;
    camera.updateProjectionMatrix();if(active)render();}
  const observer=new ResizeObserver(resize);observer.observe(host);
  const visibility=()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;animations=[];sparks.forEach(s=>s.visible=false);}
    else if(active){update(previous);resize();}};
  document.addEventListener('visibilitychange',visibility);
  const lost=e=>{e.preventDefault();cancelAnimationFrame(raf);raf=0;onError?.();};
  renderer.domElement.addEventListener('webglcontextlost',lost);
  const restored=()=>{resize();update(previous);host.dispatchEvent(new CustomEvent('cairn:restored'));};
  renderer.domElement.addEventListener('webglcontextrestored',restored);
  return {thumbnails,update, setActive(value){active=value;if(value){resize();update(previous);}else{cancelAnimationFrame(raf);raf=0;animations=[];sparks.forEach(s=>s.visible=false);}},
    stats(){return {revision:THREE.REVISION,calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,
      geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures,active,raf:!!raf};},
    dispose(){disposed=true;cancelAnimationFrame(raf);observer.disconnect();document.removeEventListener('visibilitychange',visibility);
      renderer.domElement.removeEventListener('webglcontextlost',lost);renderer.domElement.removeEventListener('webglcontextrestored',restored);
      geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove();}
  };
}
