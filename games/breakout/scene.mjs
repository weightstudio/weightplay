import * as THREE from './vendor/three/three.module.min.js';
import {W,H,BALL_R} from './core.mjs?v=23';

const COLORS=[0x48d6ca,0x79a9ff,0xefba60,0xcc8bf2,0xf78977,0x84daba];
export class CrystalScene {
  constructor(host,{reduced=false,onLost=()=>{}}={}) {
    this.host=host;this.reduced=reduced;this.disposed=false;this.effects=[];this.bricks=new Map();this.time=0;
    this.geometries=new Set();this.materials=new Set();this.scene=new THREE.Scene();
    this.scene.background=new THREE.Color(0x0a192b);this.scene.fog=new THREE.Fog(0x0a192b,30,60);
    this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power',preserveDrawingBuffer:true});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.75));
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.1;
    this.renderer.domElement.setAttribute('aria-hidden','true');host.append(this.renderer.domElement);
    this.camera=new THREE.OrthographicCamera(-6,6,10,-10,.1,100);this.camera.position.set(0,-9,27);this.camera.lookAt(0,0,0);
    this.scene.add(new THREE.HemisphereLight(0xb8e8ff,0x263444,1.8));
    const light=new THREE.DirectionalLight(0xffe0b1,2.8);light.position.set(-8,12,20);this.scene.add(light);
    const rim=new THREE.DirectionalLight(0x55e9e0,2);rim.position.set(10,-8,10);this.scene.add(rim);
    this.unit=this.geo(new THREE.BoxGeometry(1,1,1));
    this.base=this.mat(0x173248);this.dark=new THREE.MeshBasicMaterial({color:0x0c2937});this.materials.add(this.dark);this.trim=this.mat(0x41647a,.45,.6);this.gold=this.mat(0xe4ae58,.32,.65);
    this.glow=this.mat(0x73fff0,.23,.1,0x1bb7ac);this.purple=this.mat(0xc3a4ff,.25,.35,0x7b38ba);
    const floor=this.box(0,0,-.28,12,20,.5,this.dark);
    this.box(0,0,-.6,13,21,.35,this.base);
    this.box(-6,0,.1,.22,20.2,.42,this.trim);this.box(6,0,.1,.22,20.2,.42,this.trim);
    this.box(0,10,.1,12.2,.24,.42,this.trim);
    for(const x of [-5.9,5.9]) this.box(x,0,.34,.045,19.8,.025,this.glow);
    for(let y=-9;y<=9;y+=2){this.box(0,y,-.012,11.8,.018,.012,this.trim);}
    for(let x=-4;x<=4;x+=2)this.box(x,0,-.012,.018,19.8,.012,this.trim);
    // Authored stepped temple buttresses frame the active court; they never hide a collider.
    for(const side of [-1,1])for(const y of [-8,-2,4,9]) {
      this.box(side*6.8,y,-.2,1.1,1.7,.7,this.base);
      this.box(side*6.8,y,.4,.84,1.32,.65,this.trim);
      this.box(side*6.8,y,.8,.98,1.4,.16,this.gold);
      const gem=this.box(side*6.8,y,1.06,.24,.24,.35,this.glow);gem.rotation.z=Math.PI/4;
    }
    // Inlaid comet crest, kept behind the ball and below the brick field.
    const crest=this.geo(new THREE.RingGeometry(1.2,1.22,6));
    const ring=new THREE.Mesh(crest,this.trim);ring.position.set(0,-1,-.005);this.scene.add(ring);
    for(const side of [-1,1]) { const line=this.box(side*1.8,-1,-.005,1,.035,.02,this.gold);line.rotation.z=side*.3; }
    this.architecture=new THREE.Group();
    const batches=new Map();
    for(const child of [...this.scene.children])if(child.isMesh){
      if(child.geometry!==this.unit){this.architecture.add(child);continue;}
      const list=batches.get(child.material)||[];child.updateMatrix();list.push(child.matrix.clone());batches.set(child.material,list);this.scene.remove(child);
    }
    for(const [material,matrices]of batches){const mesh=new THREE.InstancedMesh(this.unit,material,matrices.length);matrices.forEach((matrix,i)=>mesh.setMatrixAt(i,matrix));this.architecture.add(mesh);}
    this.scene.add(this.architecture);
    this.paddle=new THREE.Group();this.scene.add(this.paddle);
    this.paddleBody=this.box(0,0,.38,3.13,.42,.5,this.gold,this.paddle);
    this.paddleFace=this.box(0,.05,.68,2.55,.26,.14,this.glow,this.paddle);
    for(const side of [-1,1])this.box(side*1.43,0,.55,.18,.56,.4,this.trim,this.paddle);
    this.ball=new THREE.Mesh(this.geo(new THREE.IcosahedronGeometry(BALL_R/30,1)),this.mat(0xf5ffff,.16,.25,0x65f9ef));this.scene.add(this.ball);
    this.shadow=new THREE.Mesh(this.geo(new THREE.CircleGeometry(.23,16)),this.mat(0x030d18,1,0));this.shadow.position.z=.015;this.scene.add(this.shadow);
    this.gate=new THREE.Group();this.box(0,0,.32,64/30,8/30,.5,this.gold,this.gate);this.box(0,0,.6,1.8,.05,.04,this.glow,this.gate);this.scene.add(this.gate);
    this.core=new THREE.Group();this.scene.add(this.core);
    this.coreBody=this.box(0,0,.6,1.6,.82,1.0,this.purple,this.core);
    const inner=this.box(0,0,1.2,.7,.5,.35,this.glow,this.core);inner.rotation.z=Math.PI/4;
    for(const side of [-1,1])this.box(side*.94,0,.55,.16,1.1,.7,this.gold,this.core);
    this.coreHalo=new THREE.Mesh(this.geo(new THREE.RingGeometry(1.05,1.1,6)),this.gold);this.coreHalo.position.z=.2;this.core.add(this.coreHalo);
    this.trail=Array.from({length:12},(_,i)=>{const m=new THREE.Mesh(this.geo(new THREE.IcosahedronGeometry(.13*(1-i/14),0)),this.mat(0x73fff0,.5,0,0x1a8c91));m.visible=false;this.scene.add(m);return m;});
    this.fragmentMesh=new THREE.InstancedMesh(this.unit,this.gold,64);this.fragmentMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);this.fragmentMesh.count=0;this.scene.add(this.fragmentMesh);
    this.dummy=new THREE.Object3D();this.fxColor=new THREE.Color();this.ray=new THREE.Raycaster();this.plane=new THREE.Plane(new THREE.Vector3(0,0,1),0);this.hit=new THREE.Vector3();
    this.contextLost=e=>{e.preventDefault();onLost();};this.renderer.domElement.addEventListener('webglcontextlost',this.contextLost);
    this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(host);this.resize();
  }
  geo(g){this.geometries.add(g);return g;}
  mat(color,roughness=.38,metalness=.2,emissive=0){const m=new THREE.MeshStandardMaterial({color,roughness,metalness,emissive,emissiveIntensity:.65});this.materials.add(m);return m;}
  box(x,y,z,w,h,d,material,parent=this.scene){const m=new THREE.Mesh(this.unit,material);m.position.set(x,y,z);m.scale.set(w,h,d);parent.add(m);return m;}
  point(x,y,z=.3){return [(x-(this.width||W)/2)/30,((this.height||H)/2-y)/30,z];}
  resize(){if(this.disposed)return;const r=this.host.getBoundingClientRect();if(r.width<2||r.height<2)return;
    this.renderer.setSize(r.width,r.height,false);const aspect=r.width/r.height,height=Math.max(((this.height||H)+20)/30,((this.width||W)+16)/30/aspect);this.camera.left=-height*aspect/2;this.camera.right=height*aspect/2;this.camera.top=height/2;this.camera.bottom=-height/2;this.camera.updateProjectionMatrix();
  }
  pointerX(clientX,clientY){const r=this.host.getBoundingClientRect();this.ray.setFromCamera(new THREE.Vector2((clientX-r.left)/r.width*2-1,-(clientY-r.top)/r.height*2+1),this.camera);this.ray.ray.intersectPlane(this.plane,this.hit);return this.hit.x*30+(this.width||W)/2;}
  setLevel(s,finish='jade'){
    this.width=s.width;this.height=s.height;this.architecture.scale.set(s.width/W,s.height/H,1);
    for(const group of this.bricks.values())this.scene.remove(group);this.bricks.clear();this.effects=[];
    if(!this.brickMaterials){this.brickMaterials=COLORS.map(c=>this.mat(c,.26,.34));this.armour=this.mat(0x647f99,.27,.8);this.blast=this.mat(0xf38d54,.24,.25,0x893317);this.charge=this.mat(0xc198ff,.25,.3,0x6335a3);}
    for(const b of s.bricks){
      const g=new THREE.Group();g.position.set(...this.point(b.x+b.w/2,b.y+b.h/2,.1));g.userData={hp:b.hp,flash:0,baseZ:.1};
      const material=b.kind==='a'?this.armour:b.kind==='b'?this.blast:b.kind==='p'?this.charge:this.brickMaterials[(b.row+s.level.arc)%COLORS.length];
      this.box(0,0,.24,b.w/30,b.h/30,.48,material,g);
      this.box(0,.02,.50,(b.w-6)/30,(b.h-6)/30,.09,material,g);
      if(b.kind==='a'){for(const x of [-.42,.42])this.box(x,0,.6,.1,.45,.05,this.gold,g);}
      else if(b.kind==='b'||b.kind==='p'){const symbol=this.box(0,0,.62,.22,.22,.12,b.kind==='b'?this.gold:this.glow,g);symbol.rotation.z=Math.PI/4;}
      this.scene.add(g);this.bricks.set(b.id,g);
    }
    this.paddle.scale.x=s.paddleWidth/94;this.paddleFace.material=finish==='aurora'?this.purple:this.glow;this.gate.visible=s.level.gate;
    this.trail.forEach(m=>{m.material.color.setHex(finish==='aurora'?0xc6a4ff:0x73fff0);});
    this.trail.forEach(m=>m.visible=false);this.core.visible=false;this.resize();this.render(s,0);
  }
  effect(event){
    const kind=event.kind, color=kind==='b'?0xffb16e:kind==='a'?0xb7d7ed:kind==='p'?0xc6a4ff:0x72f4de;
    const strong=['blast','core-hit','win','miss'].includes(event.type), count=this.reduced?0:strong?12:5;
    if(!['break','armour','blast','core-hit','bounce','miss','charge','win'].includes(event.type))return;
    const pos=this.point(event.x||180,event.y||300,.55);
    for(let i=0;i<count&&this.effects.length<64;i++)this.effects.push({x:pos[0],y:pos[1],z:pos[2],vx:Math.cos(i*2.4)*(.8+i*.12),vy:Math.sin(i*2.4)*(.8+i*.12),vz:2.5+(i%3)*.4,life:0,ttl:strong?.55:.32,color,size:strong?.12:.075});
    const brick=this.bricks.get(event.id);if(brick)brick.userData.flash=.16;
    if(strong&&!this.reduced)this.impulse=.10;
  }
  render(s,dt){if(this.disposed)return;this.time+=dt;
    this.paddle.position.set(...this.point(s.paddle,s.paddleY+6,0));this.ball.position.set(...this.point(s.ball.x,s.ball.y,.42));this.shadow.position.set(...this.point(s.ball.x+3,s.ball.y+4,.016));
    this.ball.visible=this.shadow.visible=s.status!=='lost';
    this.ball.scale.setScalar(s.pierce>0?1.2:1);
    this.ball.material.emissive.setHex(s.pierce>0?0xd694ff:0x65f9ef);
    this.ball.rotation.x+=dt*2;this.ball.rotation.y+=dt*3;
    if(!this.reduced&&s.status==='playing'&&dt>0){for(let i=this.trail.length-1;i>0;i--){this.trail[i].position.copy(this.trail[i-1].position);this.trail[i].visible=this.trail[i-1].visible;}this.trail[0].position.copy(this.ball.position);this.trail[0].visible=true;}
    else if(s.status!=='playing'||this.reduced)this.trail.forEach(m=>m.visible=false);
    for(const b of s.bricks){const g=this.bricks.get(b.id);if(!g)continue;g.visible=b.hp>0;g.userData.flash=Math.max(0,g.userData.flash-dt);g.position.z=.1+(this.reduced?0:Math.sin(g.userData.flash*32)*g.userData.flash*1.1);g.scale.setScalar(1+g.userData.flash*.22);if(b.kind==='a'&&b.hp<2){g.children[0].material=this.brickMaterials[s.level.arc%COLORS.length];g.children[1].material=this.brickMaterials[s.level.arc%COLORS.length];g.children[3].visible=false;}}
    this.gate.position.set(...this.point(s.gateX,s.height*.43+4,0));
    this.core.visible=!!s.core&&s.core.hp>0;
    if(s.core){this.core.position.set(...this.point(s.core.x,s.core.y,0));this.coreHalo.rotation.z=this.reduced?0:this.time*.3;this.coreBody.scale.z=.8+s.core.hp*.1;}
    this.effects=this.effects.filter(p=>(p.life+=dt)<p.ttl);this.fragmentMesh.count=this.effects.length;
    this.effects.forEach((p,i)=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;p.vz-=8*dt;this.dummy.position.set(p.x,p.y,Math.max(.05,p.z));this.dummy.rotation.set(p.life*6,p.life*4,p.life*3);this.dummy.scale.setScalar(p.size*(1-p.life/p.ttl));this.dummy.updateMatrix();this.fragmentMesh.setMatrixAt(i,this.dummy.matrix);this.fragmentMesh.setColorAt(i,this.fxColor.setHex(p.color));});
    this.fragmentMesh.instanceMatrix.needsUpdate=true;if(this.fragmentMesh.instanceColor)this.fragmentMesh.instanceColor.needsUpdate=true;
    this.impulse=Math.max(0,(this.impulse||0)-dt);this.camera.position.x=this.reduced?0:Math.sin(this.time*95)*(this.impulse||0)*.35;
    this.renderer.render(this.scene,this.camera);
  }
  metrics(){return {revision:THREE.REVISION,calls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,geometries:this.renderer.info.memory.geometries,textures:this.renderer.info.memory.textures,effects:this.effects.length};}
  paddlePreview(kind,finish='jade') {
    const scene=new THREE.Scene();scene.background=new THREE.Color(0x102b3e);scene.add(new THREE.HemisphereLight(0xc9f9ff,0x354253,3));
    const light=new THREE.DirectionalLight(0xffdfac,4);light.position.set(-2,3,5);scene.add(light);
    const model=this.paddle.clone();model.position.set(0,0,0);model.rotation.set(.35,.05,-.12);model.scale.set(kind==='comet'?.77:1,1,1);
    model.children[1].material=finish==='aurora'?this.purple:this.glow;scene.add(model);
    const camera=new THREE.OrthographicCamera(-2.2,2.2,1.1,-1.1,.1,20);camera.position.set(0,0,5);camera.lookAt(0,0,0);
    this.renderer.setSize(320,160,false);this.renderer.render(scene,camera);const url=this.renderer.domElement.toDataURL('image/png');this.resize();return url;
  }
  dispose(){if(this.disposed)return;this.disposed=true;this.resizeObserver.disconnect();this.renderer.domElement.removeEventListener('webglcontextlost',this.contextLost);this.geometries.forEach(g=>g.dispose());this.materials.forEach(m=>m.dispose());this.renderer.dispose();this.renderer.forceContextLoss();this.renderer.domElement.remove();this.effects=[];this.bricks.clear();}
}
