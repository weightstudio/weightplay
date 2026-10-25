import * as T from '../animal-skyspire-drop/vendor/three/three.module.min.js';

export function createScene(host,{skin='cyan',preview=false}={}){
 const renderer=new T.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0x1b174b,0);
 renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
 renderer.domElement.setAttribute('aria-hidden','true');host.prepend(renderer.domElement);
 const world=new T.Scene();world.fog=new T.FogExp2(0x29205b,.027);
 const camera=new T.OrthographicCamera(-4,4,4,-4,.1,80);
 world.add(new T.HemisphereLight(0xb7d8ff,0x33234b,1.3));
 const key=new T.DirectionalLight(0xffd09a,3.5);key.position.set(-4,8,7);key.castShadow=true;key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-8,right:8,top:8,bottom:-8,near:.1,far:30});key.shadow.normalBias=.035;world.add(key);
 const rim=new T.DirectionalLight(0x69cfff,2.2);rim.position.set(4,5,-3);world.add(rim);
 const shape=new T.Shape();shape.moveTo(-.465,-.465);shape.lineTo(.465,-.465);shape.lineTo(.465,.465);shape.lineTo(-.465,.465);shape.closePath();
 const geometry=new T.ExtrudeGeometry(shape,{depth:.93,bevelEnabled:true,bevelSize:.035,bevelThickness:.035,bevelSegments:1,steps:1,curveSegments:1});geometry.translate(0,0,-.465);
 const materials=new Map(),dummy=new T.Object3D();
 const accent=new T.MeshStandardMaterial({color:0x5debdc,emissive:0x1ebfb5,emissiveIntensity:.55,roughness:.32,metalness:.28});
 function material(color,emissive=0){if(color==='accent')return accent;const id=color+':'+emissive;if(!materials.has(id))materials.set(id,new T.MeshStandardMaterial({color,roughness:.68,metalness:.08,emissive,emissiveIntensity:emissive?.8:0}));return materials.get(id);}
 const block=(p,x,y,z,w,h,d,color,em=0,rz=0,ry=0)=>p.push({x,y,z,w,h,d,color,em,rz,ry});
 function assemble(parent,parts){const groups=new Map();for(const p of parts){const m=material(p.color,p.em);if(!groups.has(m))groups.set(m,[]);groups.get(m).push(p);}for(const [m,rows]of groups){const mesh=new T.InstancedMesh(geometry,m,rows.length);mesh.castShadow=parent!==world;mesh.receiveShadow=true;rows.forEach((p,i)=>{dummy.position.set(p.x,p.y,p.z);dummy.scale.set(p.w,p.h,p.d);dummy.rotation.set(0,p.ry,p.rz);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);});mesh.instanceMatrix.needsUpdate=true;parent.add(mesh);}}
 const p=[];block(p,0,-.4,0,8.2,.65,7,0x25334d);block(p,0,-.05,0,7.8,.15,6.6,0x385471);
 for(let x=-4;x<=4;x++)for(let z=-3;z<=3;z++){block(p,x*.82,.055,z*.82,.78,.13,.78,(x+z)%2?0x405778:0x344b6b);}
 for(const x of [-3.4,3.4]){block(p,x,.15,0,.08,.04,5.6,'accent');block(p,x,.18,2.8,.45,.16,.32,0xffcf73,0x513c13);}
 for(const z of [-2.4,2.4]){block(p,0,.15,z,6.6,.04,.065,'accent');}
 // Distant scenery uses the composed sky illustration; interactive foreground
 // and the full articulated fox remain genuine real-time geometry.
 assemble(world,p);
 const fox=new T.Group();world.add(fox);
 const body=new T.Group();fox.add(body);const torso=[];
 block(torso,0,1.5,0,1.12,1.25,.8,0xee8a29);block(torso,0,1.52,.43,.67,1.02,.12,0xffe4ba);
 block(torso,0,1,.02,1.16,.18,.83,0x47334a);block(torso,0,1,.47,.3,.21,.08,0xe3ad43);
 for(const x of [-.43,.43]){block(torso,x,.65,.1,.47,.75,.52,0xf2932f);block(torso,x,.26,.24,.61,.4,.85,0x4a3442);block(torso,x,.31,.69,.51,.13,.12,0xffdf83);block(torso,x,.14,.7,.54,.23,.2,0xffedc9);}
 assemble(body,torso);
 const head=new T.Group();body.add(head);const face=[];
 block(face,0,2.97,0,1.62,1.42,1.05,0xf69a31);
 for(const x of [-.66,.66]){block(face,x,3.9,-.02,.39,.63,.58,0xb85e26);block(face,x,3.89,.29,.25,.42,.06,0xffe4bb);block(face,x*.9,4.18,-.02,.25,.19,.47,0x5e3830);block(face,x*1.35,2.7,.06,.28,.38,.8,0xe78428);}
 block(face,-.12,3.77,-.02,.28,.35,.7,0xffb13d);block(face,.16,3.7,.02,.28,.22,.72,0xffb13d);
 for(const x of [-.39,.39]){
  block(face,x,3.1,.55,.4,.46,.07,0xfff8e6);block(face,x,3.08,.6,.22,.35,.035,0x289dcc);block(face,x,3.08,.625,.11,.3,.025,0x112b48);block(face,x-.04,3.19,.65,.075,.09,.02,0xffffff);
  block(face,x,3.43,.57,.47,.1,.09,0x57332c,0,x>0?.13:-.13);
 }
 block(face,-.29,2.64,.65,.61,.4,.38,0xffe6be);block(face,.29,2.64,.65,.61,.4,.38,0xffe6be);
 block(face,0,2.78,.9,.27,.19,.19,0x50302c);block(face,.12,2.5,.86,.31,.035,.02,0x70472d,0,.17);
 block(face,.03,3.55,.56,.12,.35,.06,0xffdf48,0,-.42);block(face,-.03,3.59,.6,.25,.1,.05,0xffdf48);block(face,-.08,3.46,.61,.11,.21,.05,0xffdf48,0,-.4);
 assemble(head,face);
 const scarf=new T.Group();body.add(scarf);const cloth=[];
 block(cloth,0,2.25,.05,1.4,.3,1.02,0x168ac7);block(cloth,0,2.23,.59,.86,.22,.08,0x26c9ea);
 for(let i=0;i<5;i++){block(cloth,.75+i*.29,2.27+i*.15,-.05-i*.19,.38,.37,.37,i%2?0x178dcc:0x21b4e3);block(cloth,.75+i*.29,2.3+i*.15,.15-i*.19,.32,.09,.05,0xffdb54);}
 block(cloth,.05,2.24,.69,.29,.29,.08,0xffd446,0x58420d,Math.PI/4);block(cloth,.05,2.24,.75,.13,.13,.04,0x40d2eb,0x145677,Math.PI/4);assemble(scarf,cloth);
 const arms=[-1,1].map(sign=>{const arm=new T.Group();arm.position.set(sign*.83,2.06,.03);body.add(arm);const a=[];
 block(a,sign*.13,-.38,0,.42,.8,.5,0xf18c2c);block(a,sign*.18,-.88,.18,.72,.65,.67,0x65402f);
 block(a,sign*.18,-.9,.55,.58,.46,.12,0xffcb3b,0x5b3b04);
 for(let i=0;i<3;i++)block(a,sign*.18+(i-1)*.19,-.57,.48,.15,.21,.28,0xffdf73,0x62420a);
 block(a,sign*.18,-.83,.63,.11,.32,.045,0xfff7bc,0x896c17,sign*.38);return assemble(arm,a),arm;});
 const tail=new T.Group();tail.position.set(.62,.9,-.4);tail.rotation.y=-.25;body.add(tail);const tailParts=[];
 for(let i=0;i<5;i++)block(tailParts,.35+i*.25,.1+i*.25,-i*.25,.68,.6,.7,i>=3?0xffe6bb:0xe88728);
 assemble(tail,tailParts);
 const beacons=['left','right'].map((side,i)=>{const sign=i?1:-1,group=new T.Group();group.position.set(sign*2.55,0,.65);world.add(group);const parts=[];
 block(parts,0,.24,0,1.55,.42,1.55,0x23344e);block(parts,0,.5,0,1.3,.15,1.3,0xe4b769);block(parts,0,1.24,0,1.08,1.35,1.08,0x314866);
 for(const s of [-1,1]){block(parts,s*.46,1.28,.58,.16,1.38,.12,0x7c7fa1);block(parts,s*.36,1.26,.66,.075,1.2,.035,'accent');}
 block(parts,0,1.25,.59,.36,1.03,.09,0x1c2e49);block(parts,0,1.98,0,1.52,.25,1.42,0x61728b);block(parts,0,2.1,0,1.33,.11,1.23,0xf9ca78);
 block(parts,0,1.91,.79,.32,.32,.08,0xeec378,0,Math.PI/4);assemble(group,parts);
 const lampMat=new T.MeshStandardMaterial({color:0x468a99,emissive:0x24556b,emissiveIntensity:.45,roughness:.25,metalness:.3});
 const light=new T.PointLight(0x67e8dd,0,6,2);light.position.set(0,2.7,.6);group.add(light);
 materials.set('lamp'+i,lampMat);const lamp=new T.Mesh(geometry,lampMat);lamp.position.y=2.7;lamp.rotation.z=Math.PI/4;lamp.scale.set(.56,.56,.56);group.add(lamp);
 return {side,sign,group,lamp,lampMat,light,flash:0,echo:false};
 });
 const motes=new T.Group();world.add(motes);const particles=[];
 for(let i=0;i<12;i++){const m=new T.Mesh(geometry,material(0xffe7a1,0x9a712c));m.visible=false;m.scale.setScalar(.065);motes.add(m);particles.push({mesh:m,life:0});}
 const colorSets={cyan:[0x63efdd,0x169ca8],gold:[0xffd36d,0xb67a19],violet:[0xd0a0ff,0x8a48db]};
 const fromColor=accent.color.clone(),fromGlow=accent.emissive.clone(),toColor=new T.Color(),toGlow=new T.Color();let styleTime=.2;
 function setSkin(next){skin=colorSets[next]?next:'cyan';fromColor.copy(accent.color);fromGlow.copy(accent.emissive);toColor.setHex(colorSets[skin][0]);toGlow.setHex(colorSets[skin][1]);styleTime=0;}
 setSkin(skin);
 let current=null,phase='rest',paused=false,feedbackAge=2,feedbackKind='',feedbackSide='left',frame=0,dead=false,last=performance.now(),elapsed=0,outcome=null;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function fit(){const {width,height}=host.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height,false);const aspect=width/height,portrait=aspect<.9;
  const h=preview?5.9:Math.max(6.1,7.25/aspect),w=h*aspect;
  camera.left=-w/2;camera.right=w/2;camera.top=h/2;camera.bottom=-h/2;
  const center=preview?2.1:portrait?3.2:2.2;camera.position.set(3.6,center+3.6,13);camera.lookAt(0,center,0);camera.updateProjectionMatrix();
  fox.scale.setScalar(preview?1:portrait?1.45:1.12);fox.position.set(0,.05,preview?.5:0);
  beacons.forEach(b=>{b.group.visible=!preview;b.group.position.x=b.sign*(portrait?2.55:3.3);b.group.position.y=portrait?1:0;});
 }
 const resize=new ResizeObserver(fit);resize.observe(host);fit();
 function feedback(kind='hit',side=current?.side||'left'){feedbackAge=0;feedbackKind=kind;feedbackSide=side;const b=beacons.find(n=>n.side===side);if(b)b.flash=1;
  particles.forEach((p,i)=>{p.life=reduce?0:.45+i*.015;p.mesh.position.set((side==='left'?-1:1)*2.5,2.8,i%2?.6:.9);p.vx=Math.cos(i*2.4)*1.7;p.vy=1.6+i%3*.4;p.vz=Math.sin(i*2.4);p.mesh.material=material(kind==='error'?0xffa16b:0xffe6a1,kind==='error'?0x7b291c:0x9a712c);});
 }
 function draw(now){if(dead)return;const dt=Math.min((now-last)/1000,.05);last=now;if(!paused){elapsed+=dt;feedbackAge+=dt;}
  styleTime=Math.min(.2,styleTime+dt);const blend=reduce?1:styleTime/.2;accent.color.copy(fromColor).lerp(toColor,blend);accent.emissive.copy(fromGlow).lerp(toGlow,blend);
  const t=feedbackAge/ .32,impulse=t<1?Math.sin(t*Math.PI):0;
  body.position.y=!reduce&&feedbackKind!=='error'?impulse*.16:0;body.rotation.z=!reduce&&feedbackKind==='error'?Math.sin(feedbackAge*40)*Math.max(0,1-feedbackAge/.28)*.06:0;
  arms.forEach((arm,i)=>{const sign=i?1:-1,selected=feedbackSide===(i?'right':'left');arm.rotation.z=!reduce&&selected?(feedbackKind==='error'?-sign*.18:sign*.64)*impulse:0;arm.rotation.x=!reduce&&selected?-impulse*.6:0;});
  head.rotation.y=!reduce&&current?(current.side==='left'?-.08:.08):0;scarf.rotation.y=!reduce?impulse*.08:0;tail.rotation.x=!reduce?impulse*.09:0;
  for(const b of beacons){if(!paused)b.flash=Math.max(0,b.flash-dt*3);const on=current?.side===b.side,echo=on&&current.echo||current?.distract&&!on;
   b.lampMat.color.setHex(echo?0xdf90a0:on&&phase==='cue'?colorSets[skin][0]:on?0xd6c69b:0x44738d);
   b.lampMat.emissive.setHex(echo?0x55283e:on&&phase==='cue'?colorSets[skin][1]:0x142d49);
   b.lampMat.emissiveIntensity=on&&phase==='cue'?1.9:.35;
   b.light.color.setHex(echo?0xf4a6b1:colorSets[skin][0]);b.light.intensity=on&&phase==='cue'?5:0;
   b.lamp.scale.setScalar(.56+(on&&phase==='cue'?.16:0)+b.flash*.15);
   b.lamp.rotation.y=!reduce&&on&&phase==='charge'?elapsed*.7:Math.PI/6;
   b.lamp.position.y=2.7+(!reduce?b.flash*.13:0);
  }
  for(const p of particles){if(!paused&&p.life>0){p.life-=dt;p.mesh.position.x+=p.vx*dt;p.mesh.position.y+=p.vy*dt;p.vy-=dt*5;p.mesh.position.z+=p.vz*dt;p.mesh.rotation.z+=dt*3;}p.mesh.visible=p.life>0;}
  if(outcome==='success'&&!reduce)fox.rotation.y=.15+Math.sin(Math.min(feedbackAge,1)*Math.PI*2)*.07;else fox.rotation.y=.15;
  renderer.render(world,camera);frame=requestAnimationFrame(draw);
 }frame=requestAnimationFrame(draw);
 const onLost=e=>{e.preventDefault();host.dispatchEvent(new CustomEvent('signal-renderer-lost'));};renderer.domElement.addEventListener('webglcontextlost',onLost);
 return {cue(value,nextPhase='cue'){current=value;phase=nextPhase;},feedback,pause(value){paused=value;},outcome(value){outcome=value;feedbackAge=0;},setSkin,
  anchors(){return beacons.map(b=>{const v=new T.Vector3(0,2.7,.2);b.group.localToWorld(v);v.project(camera);return {side:b.side,x:(v.x+1)*50,y:(1-v.y)*50};});},
  stats(){return {revision:T.REVISION,calls:renderer.info.render.calls,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures,triangles:renderer.info.render.triangles};},
  dispose(){if(dead)return;dead=true;cancelAnimationFrame(frame);resize.disconnect();renderer.domElement.removeEventListener('webglcontextlost',onLost);world.traverse(n=>{if(n.isInstancedMesh)n.dispose();});key.shadow.map?.dispose();geometry.dispose();accent.dispose();materials.forEach(m=>m.dispose());renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();}
 };
}
