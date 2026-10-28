import * as THREE from '/games/purrch-grove/vendor/three/three.module.min.js';

function createLauncher() {
  const group=new THREE.Group(),metal=new THREE.MeshStandardMaterial({color:0x187e79,roughness:.5,metalness:.35}),brass=new THREE.MeshStandardMaterial({color:0xe6b544,roughness:.45,metalness:.5}),dark=new THREE.MeshStandardMaterial({color:0x31575b,roughness:.64,metalness:.3}),highlight=new THREE.MeshStandardMaterial({color:0x73c8b4,roughness:.5,metalness:.25});
  const barrel=new THREE.Mesh(new THREE.BoxGeometry(105,38,52),metal);barrel.position.x=38;group.add(barrel);
  const rim=new THREE.Mesh(new THREE.BoxGeometry(14,48,60),brass);rim.position.x=85;group.add(rim);
  const muzzle=new THREE.Mesh(new THREE.BoxGeometry(4,32,46),dark);muzzle.position.set(94,0,0);group.add(muzzle);
  const rail=new THREE.Mesh(new THREE.BoxGeometry(75,5,5),highlight);rail.position.set(38,14,29);group.add(rail);
  const bandGeometry=new THREE.BoxGeometry(8,42,57);for(const x of [2,59]){const band=new THREE.Mesh(bandGeometry,brass);band.position.x=x;group.add(band);}
  const side=new THREE.Mesh(new THREE.BoxGeometry(47,16,4),dark);side.position.set(34,-3,30);group.add(side);
  const sideInset=new THREE.Mesh(new THREE.BoxGeometry(39,8,4),highlight);sideInset.position.set(34,-3,33);group.add(sideInset);
  const boltGeometry=new THREE.CylinderGeometry(3,3,4,8);for(const x of [9,58,83]){const bolt=new THREE.Mesh(boltGeometry,brass);bolt.rotation.x=Math.PI/2;bolt.position.set(x,-3,36);group.add(bolt);}
  const base=new THREE.Mesh(new THREE.CylinderGeometry(26,30,16,12),brass);base.rotation.x=Math.PI/2;group.add(base);
  const hub=new THREE.Mesh(new THREE.CylinderGeometry(13,13,5,12),dark);hub.rotation.x=Math.PI/2;hub.position.z=11;group.add(hub);
  return {group,metal};
}
function createRux() {
  const group=new THREE.Group();
  const materials={skin:new THREE.MeshStandardMaterial({color:0xa7b4ae,roughness:.8}),dark:new THREE.MeshStandardMaterial({color:0x3c4542,roughness:.8}),teal:new THREE.MeshStandardMaterial({color:0x168a84,roughness:.7}),gold:new THREE.MeshStandardMaterial({color:0xe9b841,roughness:.4,metalness:.45}),brown:new THREE.MeshStandardMaterial({color:0x784a2c,roughness:.8}),glass:new THREE.MeshStandardMaterial({color:0x3ddcd1,roughness:.25,metalness:.25}),white:new THREE.MeshStandardMaterial({color:0xfdf4df}),pupil:new THREE.MeshStandardMaterial({color:0x20323a})};
  const part=(w,h,d,material,x,y,z)=>{const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),materials[material]);mesh.position.set(x,y,z);group.add(mesh);return mesh;};
  part(50,46,34,'skin',0,41,0);part(24,32,30,'skin',-17,15,0);part(24,32,30,'skin',17,15,0);
  part(27,8,35,'brown',-17,3,2);part(27,8,35,'brown',17,3,2);
  part(56,52,40,'skin',0,91,0);part(20,18,30,'skin',-20,122,0);part(20,18,30,'skin',20,122,0);
  part(15,12,8,'brown',-20,123,20);part(15,12,8,'brown',20,123,20);
  part(37,23,23,'skin',11,78,27);part(34,8,8,'dark',11,70,40);
  part(7,7,6,'dark',1,80,40);part(7,7,6,'dark',21,80,40);
  part(58,10,10,'brown',0,105,24);part(24,19,9,'gold',-14,105,28);part(24,19,9,'gold',14,105,28);
  part(16,12,10,'glass',-14,105,34);part(16,12,10,'glass',14,105,34);
  part(7,9,6,'white',-11,104,41);part(7,9,6,'white',17,104,41);
  part(18,20,16,'gold',15,92,49);part(10,29,12,'gold',15,94,54);
  for(let i=0;i<8;i++){const a=i*Math.PI/4, tooth=part(6,8,9,'gold',15+13*Math.cos(a),92+13*Math.sin(a),54);tooth.rotation.z=a;}
  part(54,12,44,'teal',0,64,3);part(13,30,10,'teal',-18,47,25);
  part(55,10,38,'brown',0,34,4);part(12,12,10,'gold',0,34,25);
  part(17,31,25,'skin',-33,48,4);part(17,31,25,'skin',33,48,4);part(20,12,30,'brown',-33,32,5);part(20,12,30,'brown',33,32,5);
  part(43,39,18,'brown',0,45,-26);part(32,9,21,'gold',0,59,-27);part(10,25,21,'teal',0,43,-30);
  return group;
}
export function finishPreviews(finishes) {
  const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setSize(144,144,false);renderer.outputColorSpace=THREE.SRGBColorSpace;
  const scene=new THREE.Scene();scene.background=new THREE.Color(0x21424a);scene.add(new THREE.HemisphereLight(0xfff0d2,0x315965,2));
  const light=new THREE.DirectionalLight(0xffffff,2);light.position.set(-80,130,180);scene.add(light);
  const camera=new THREE.PerspectiveCamera(35,1,1,1000);camera.position.set(180,100,250);camera.lookAt(35,0,0);
  const launcher=createLauncher();scene.add(launcher.group);const result={};
  for(const finish of finishes){launcher.metal.color.setHex(finish.color);renderer.render(scene,camera);result[finish.id]=renderer.domElement.toDataURL('image/webp',.85);}
  scene.traverse(node=>{node.geometry?.dispose();node.material?.dispose();});renderer.dispose();return result;
}

// A deliberately bounded first-slice renderer. Physics coordinates remain the
// source of truth; meshes have no separate collision or scoring logic.
export class SalvageView {
  constructor(host, onAim, onContextLost = () => {}) {
    this.host = host;
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-500, 500, 400, -400, 1, 3000);
    this.camera.position.set(500, 260, 1200);
    this.camera.lookAt(500, 260, 0);
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.append(this.renderer.domElement);
    if(['localhost','127.0.0.1','[::1]'].includes(location.hostname)){this.readStats=()=>({calls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,geometries:this.renderer.info.memory.geometries,textures:this.renderer.info.memory.textures});host.__ruxRenderStats=this.readStats;}
    this.renderer.domElement.tabIndex=0;this.renderer.domElement.setAttribute('aria-label',host.getAttribute('aria-label')||'');
    this.contextLost=false;
    this.onContextLost=event=>{event.preventDefault();this.contextLost=true;onContextLost();};
    this.renderer.domElement.addEventListener('webglcontextlost',this.onContextLost);
    this.scene.add(new THREE.HemisphereLight(0xfff1d1, 0x275e64, 2.2));
    const light = new THREE.DirectionalLight(0xffffff, 2); light.position.set(-200, 800, 1000); this.scene.add(light);
    this.meshes = new Map();
    this.bursts=[];this.recoil=0;this.reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const launcher=createLauncher();this.launcher=launcher.group;this.launcherMaterial=launcher.metal;
    this.launcher.position.set(80,120,50);this.scene.add(this.launcher);
    const stand=new THREE.Group();const standBody=new THREE.Mesh(new THREE.BoxGeometry(180,58,50),new THREE.MeshStandardMaterial({color:0x855133,roughness:.8}));standBody.position.y=29;stand.add(standBody);const standTop=new THREE.Mesh(new THREE.BoxGeometry(186,9,56),new THREE.MeshStandardMaterial({color:0xc69753,roughness:.7}));standTop.position.y=58;stand.add(standTop);
    const panelMaterial=new THREE.MeshStandardMaterial({color:0xad7040,roughness:.85}),panelGeometry=new THREE.BoxGeometry(48,43,4);
    for(const x of [-58,0,58]){const panel=new THREE.Mesh(panelGeometry,panelMaterial);panel.position.set(x,28,27);stand.add(panel);}
    const braceMaterial=new THREE.MeshStandardMaterial({color:0x604533,roughness:.7}),braceGeometry=new THREE.BoxGeometry(164,6,4);
    for(const y of [12,43]){const brace=new THREE.Mesh(braceGeometry,braceMaterial);brace.position.set(0,y,30);stand.add(brace);}
    stand.rotation.y=-.12;stand.position.set(95,0,-45);this.scene.add(stand);
    this.rux=new THREE.Group();this.rux.position.set(95,62,-15);this.scene.add(this.rux);
    const fallbackRux=createRux();this.rux.add(fallbackRux);
    this.disposed=false;
    new THREE.TextureLoader().load('/assets/weightplay-character-gear-horn-rhino-block-v1.webp',texture=>{
      if(this.disposed){texture.dispose();return;}
      texture.colorSpace=THREE.SRGBColorSpace;this.ruxTexture=texture;
      const artwork=new THREE.Mesh(new THREE.PlaneGeometry(180,180),new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false}));
      artwork.position.set(0,90,0);this.rux.add(artwork);fallbackRux.visible=false;
    },undefined,error=>console.warn('RUX_CHARACTER_ASSET',error));
    this.aim = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineDashedMaterial({color:0xffe899, dashSize:18, gapSize:12}));
    this.scene.add(this.aim);
    this.aimDots=new THREE.InstancedMesh(new THREE.SphereGeometry(5,8,6),new THREE.MeshBasicMaterial({color:0xffef9c}),40);this.aimDots.count=0;this.scene.add(this.aimDots);this.dotTransform=new THREE.Object3D();
    this.link = new THREE.Line(new THREE.BufferGeometry(),new THREE.LineBasicMaterial({color:0xffb5ec}));this.scene.add(this.link);
    this.focused = false;
    this.resize = () => {
      const w = host.clientWidth || 1, h = host.clientHeight || 1, aspect = w / h;
      const scale = this.focused ? 1.5 : 1;
      const width = Math.max(1000, 520 * aspect) / scale, height = Math.max(520, 1000 / aspect) / scale;
      const center = this.focused ? 630 : 500;
      this.camera.position.set(center,260,1200);this.camera.lookAt(center,260,0);this.camera.updateMatrixWorld();
      this.camera.left=-width/2; this.camera.right=width/2; this.camera.top=height/2; this.camera.bottom=-height/2;
      this.camera.updateProjectionMatrix(); this.renderer.setSize(w,h,false);
    };
    this.observer = new ResizeObserver(this.resize); this.observer.observe(host); this.resize();
    this.pointer = event => {
      if (event.type === 'pointermove' && event.buttons !== 1) return;
      const rect = this.renderer.domElement.getBoundingClientRect();
      const x = (event.clientX-rect.left)/rect.width*2-1, y = 1-(event.clientY-rect.top)/rect.height*2;
      const point = new THREE.Vector3(x,y,0).unproject(this.camera);
      onAim(Math.max(-.1,Math.min(1.1,Math.atan2(point.y-120,point.x-80))));
    };
    this.capture = event => { this.renderer.domElement.focus({preventScroll:true});this.renderer.domElement.setPointerCapture(event.pointerId); this.pointer(event); };
    this.renderer.domElement.addEventListener('pointerdown', this.capture);
    this.renderer.domElement.addEventListener('pointermove', this.pointer);
  }
  setFocused(value){this.focused=Boolean(value);this.resize();}
  setFinish(color){this.launcherMaterial.color.setHex(color);}
  make(body) {
    const kind=body.plugin.salvageKind;
    const group=new THREE.Group();
    const mat=(color,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness:.65,metalness});
    const box=(w,h,d,color,z=0,metalness=0)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(color,metalness));m.position.z=z;group.add(m);return m;};
    const block=(w,h,d,color,metalness=0)=>{const r=Math.min(3,w/8,h/8,d/8),shape=new THREE.Shape();shape.moveTo(-w/2+r,-h/2+r);shape.lineTo(w/2-r,-h/2+r);shape.lineTo(w/2-r,h/2-r);shape.lineTo(-w/2+r,h/2-r);shape.closePath();const depth=d-2*r,geometry=new THREE.ExtrudeGeometry(shape,{depth,steps:1,bevelEnabled:true,bevelSize:r,bevelThickness:r,bevelSegments:1,curveSegments:1});geometry.translate(0,0,-depth/2);const m=new THREE.Mesh(geometry,mat(color,metalness));group.add(m);return m;};
    const bolt=(x,y,z,color=0xf7d278)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(3,3,3,8),mat(color,.6));m.rotation.x=Math.PI/2;m.position.set(x,y,z);group.add(m);};
    const studs=(w,h,z)=>{for(const x of [-w/2+9,w/2-9])for(const y of [-h/2+9,h/2-9])bolt(x,y,z);};
    if(kind==='ground') { box(1200,40,80,0x846248); box(1200,8,86,0xd4a85c,5); }
    if(kind==='wood') { block(70,80,70,0x9d5932);box(61,70,4,0xb96e3d,37);for(const x of [-20,0,20]){const grain=box(3,62,3,0x8b4b2b,40);grain.position.x=x;}box(70,10,6,0xd3a258,42);const strip=box(10,75,6,0x724126,42);strip.position.x=23;studs(65,73,46);if(body.plugin.fragile){const crack=box(7,50,5,0xffdf87,47);crack.rotation.z=.45;} }
    if(kind==='metal') {block(70,80,70,0x586f77,.5);box(61,70,4,0x829c9c,37,.5);box(70,10,6,0xdfb751,42,.5);box(10,72,6,0x465f6a,43,.5);studs(64,73,47);}
    if(kind==='guard') {box(25,body.plugin.height,70,0x435f70,0,.5);box(31,16,78,0xd0ad58,5,.5);}
    if(kind==='reflector') {box(25,160,70,0x62d3c0,0,.6);box(31,148,78,0xd9b657,5,.5);box(35,120,83,0x256d73,8,.4);}
    if(kind==='platform') {
      box(120,20,70,0x54868a,0,.6);box(114,6,78,0xe3bc61,6,.5);
      // The chevron tracks the real platform direction, making its timing
      // legible without adding a second simulated motion or obscuring parts.
      const direction=new THREE.Group(),shaft=new THREE.Mesh(new THREE.BoxGeometry(28,3,3),mat(0xffefb0)),tipA=new THREE.Mesh(new THREE.BoxGeometry(12,3,3),mat(0xffefb0)),tipB=new THREE.Mesh(new THREE.BoxGeometry(12,3,3),mat(0xffefb0));
      tipA.position.set(10,4,0);tipA.rotation.z=-Math.PI/4;tipB.position.set(10,-4,0);tipB.rotation.z=Math.PI/4;direction.add(shaft,tipA,tipB);direction.position.z=43;group.add(direction);group.userData.direction=direction;
    }
    if(kind==='target') {
      const w=body.bounds.max.x-body.bounds.min.x;block(w,65,65,0x137f80,.2);box(w-6,57,6,0xe8b847,35,.4);box(w-17,46,7,0x249fa0,40);box(w-27,36,7,0x126a70,44,.2);
      const gear=new THREE.Shape();for(let i=0;i<32;i++){const a=i*Math.PI/16,r=(i%4===1||i%4===2)?16:13;const x=Math.cos(a)*r,y=Math.sin(a)*r;if(i===0)gear.moveTo(x,y);else gear.lineTo(x,y);}gear.closePath();const hole=new THREE.Path();hole.absellipse(0,0,7,7,0,Math.PI*2,true);gear.holes.push(hole);const cog=new THREE.Mesh(new THREE.ExtrudeGeometry(gear,{depth:3,bevelEnabled:false,curveSegments:12}),mat(0xffd36c,.55));cog.position.z=48;group.add(cog);
      studs(w-9,54,45);if(body.plugin.first){const bar=box(38,9,9,0xfff0c1,55);bar.rotation.z=-Math.PI/4;const bar2=box(38,9,9,0xfff0c1,56);bar2.rotation.z=Math.PI/4;}if(body.plugin.last){box(30,8,9,0xfff0c1,56);const base=box(8,30,9,0xfff0c1,57);base.position.y=-10;}if(body.plugin.linked){const band=box(w-6,7,9,0xf7a8e8,57);band.position.y=25;}if(body.plugin.clampRequired){const band=box(7,60,9,0xa8f8ff,58);band.position.x=-w/2+4;}
    }
    if(kind==='ball') { const ball=new THREE.Mesh(new THREE.SphereGeometry(22,24,16),mat(0x14a8a0,.2));group.add(ball); }
    if(['wood','metal','guard','reflector','platform','target'].includes(kind))group.rotation.y=-.16;
    this.scene.add(group); return group;
  }
  effect(event) {
    if(event.type==='shot'){this.recoil=.16;return;}
    if(!['impact','break','recovered'].includes(event.type)||!Number.isFinite(event.x)||this.bursts.length>=8)return;
    const count=event.type==='break'?10:6,color=event.type==='recovered'?0x8dff9c:event.type==='break'||event.material==='wood'?0xffcc70:0x8af5ed;
    const group=new THREE.Group(),geometry=new THREE.BoxGeometry(event.type==='break'?9:6,event.type==='break'?5:6,6),material=new THREE.MeshBasicMaterial({color,transparent:true});
    for(let i=0;i<count;i++){const spark=new THREE.Mesh(geometry,material);spark.userData.angle=i*Math.PI*2/count;group.add(spark);}
    const ringGeometry=new THREE.RingGeometry(9,13,24),ringMaterial=new THREE.MeshBasicMaterial({color,transparent:true,side:THREE.DoubleSide,depthWrite:false});const ring=new THREE.Mesh(ringGeometry,ringMaterial);group.add(ring);
    group.position.set(event.x,800-event.y,100);this.scene.add(group);this.bursts.push({group,geometry,material,ring,ringGeometry,ringMaterial,life:0});
  }
  sync(model,angle,dt=0,power=.6) {
    this.recoil=Math.max(0,this.recoil-dt);const kick=this.reducedMotion?0:this.recoil/.16;this.launcher.position.x=80-kick*10;this.rux.rotation.z=kick*.08;
    const active=new Set(model.bodies);
    for(const [body,mesh] of this.meshes) if(!active.has(body)){this.scene.remove(mesh);mesh.traverse(n=>{n.geometry?.dispose();n.material?.dispose();});this.meshes.delete(body);}
    for(const body of model.bodies){let mesh=this.meshes.get(body);if(!mesh){mesh=this.make(body);this.meshes.set(body,mesh);}mesh.position.set(body.position.x,800-body.position.y,0);mesh.rotation.z=-body.angle;if(mesh.userData.direction)mesh.userData.direction.scale.x=(model.platformTime*50+50)%200<100?1:-1;const held=model.clamped.some(item=>item.body===body);mesh.traverse(node=>{if(node.material?.emissive)node.material.emissive.setHex(held?0x196a72:0);if(node.material){node.material.transparent=Boolean(body.plugin.recovered);node.material.opacity=body.plugin.recovered ? .35 : 1;}});}
    if(model.state==='ready'){
      const speed=700+Math.max(0,Math.min(1,power))*500,points=[new THREE.Vector3(80,120,80)],obstacles=model.bodies.filter(body=>body!==model.ball);let previous={x:80,y:680};
      for(let i=1;i<=80;i++){const t=i*.02,x=80+speed*Math.cos(angle)*t,y=680-speed*Math.sin(angle)*t+500*t*t;const point={x,y};points.push(new THREE.Vector3(x,800-y,80));if(model.M.Query.ray(obstacles,previous,point,44).length||x>1000||y>800||y<0)break;previous=point;}
      this.aim.geometry.setFromPoints(points);this.aim.computeLineDistances();let count=0;for(let i=2;i<points.length&&count<40;i+=2){this.dotTransform.position.copy(points[i]);this.dotTransform.updateMatrix();this.aimDots.setMatrixAt(count++,this.dotTransform.matrix);}this.aimDots.count=count;this.aimDots.instanceMatrix.needsUpdate=true;
    }
    this.aim.visible=model.state==='ready';this.aimDots.visible=this.aim.visible;this.launcher.rotation.z=angle;
    const linked=model.targets.filter(body=>body.plugin.linked&&model.bodies.includes(body));this.link.visible=linked.length===2;
    if(linked.length===2)this.link.geometry.setFromPoints(linked.map(body=>new THREE.Vector3(body.position.x,800-body.position.y,82)));
    for(const burst of this.bursts){burst.life+=dt;const distance=this.reducedMotion?10:burst.life*110;for(const spark of burst.group.children){if(spark===burst.ring)continue;spark.position.x=Math.cos(spark.userData.angle)*distance;spark.position.y=Math.sin(spark.userData.angle)*distance;spark.rotation.z=burst.life*5+spark.userData.angle;}burst.ring.scale.setScalar(this.reducedMotion?1:1+burst.life*4);burst.material.opacity=burst.ringMaterial.opacity=Math.max(0,1-burst.life/.3);}
    for(let i=this.bursts.length-1;i>=0;i--)if(this.bursts[i].life>=.3){const burst=this.bursts.splice(i,1)[0];this.scene.remove(burst.group);burst.geometry.dispose();burst.material.dispose();burst.ringGeometry.dispose();burst.ringMaterial.dispose();}
    this.renderer.render(this.scene,this.camera);
  }
  dispose() {
    this.disposed=true;this.ruxTexture?.dispose();
    if(this.host.__ruxRenderStats===this.readStats)delete this.host.__ruxRenderStats;
    this.observer.disconnect();this.renderer.domElement.removeEventListener('pointerdown',this.capture);this.renderer.domElement.removeEventListener('pointermove',this.pointer);this.renderer.domElement.removeEventListener('webglcontextlost',this.onContextLost);
    this.scene.traverse(n=>{n.geometry?.dispose();n.material?.dispose();});this.renderer.dispose();this.renderer.domElement.remove();this.meshes.clear();
  }
}
