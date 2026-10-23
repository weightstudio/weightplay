import * as THREE from './vendor/three/three.module.min.js';
import {modelScale,enemyScale,shielded} from './model.js';

const PALETTE={teal:0x58e8eb,navy:0x17394f,ice:0xb8f9ff,brown:0xa76b40,cream:0xffddb0,purple:0x8b6ed3,coral:0xff617c,gold:0xffcb6c};
const part=(x,y,z,w,h,d,c,glow=false,angle=0)=>({matrix:new THREE.Matrix4().compose(new THREE.Vector3(x,y,z),new THREE.Quaternion().setFromEuler(new THREE.Euler(0,0,angle)),new THREE.Vector3(w,h,d)),color:new THREE.Color(c),glow});
export function shipParts(skin=false){const c=skin?0xe7a2ff:PALETTE.teal;return [
 part(0,-1,0,7,5,2,PALETTE.navy),part(0,-2,1,5,4,1,c),part(-4,-2,0,2,4,1.5,PALETTE.navy),part(4,-2,0,2,4,1.5,PALETTE.navy),
 part(-4,-1,1,1.4,2.5,.6,c),part(4,-1,1,1.4,2.5,.6,c),part(-3,-4,.2,1.3,1,1,skin?c:PALETTE.ice,true),part(3,-4,.2,1.3,1,1,skin?c:PALETTE.ice,true),
 part(0,1,1,4,3.2,1.8,0xe1e7ee),part(0,3,1.2,2,4,1.5,PALETTE.navy),part(0,4.7,1.3,1.3,.7,1,PALETTE.ice,true),
 part(0,-1,2,2.7,2.4,1.7,c),part(0,.2,3,3.5,2.7,2.5,PALETTE.brown),part(-1.5,1.5,3,1.2,1.2,1.6,PALETTE.brown),part(1.5,1.5,3,1.2,1.2,1.6,PALETTE.brown),
 part(0,-.6,4.4,2.4,1.1,.7,PALETTE.cream),part(0,-.15,4.8,.6,.45,.3,0x2b2531),part(0,.6,4.3,3.6,.9,.5,0x113d53),
 part(-.9,.65,4.6,1.2,.55,.3,PALETTE.ice,true),part(.9,.65,4.6,1.2,.55,.3,PALETTE.ice,true),part(-1.8,-1.4,3,.9,1.8,1,PALETTE.brown),part(1.8,-1.4,3,.9,1.8,1,PALETTE.brown),
 part(0,-2,3.1,.8,.6,.5,PALETTE.coral),part(-2.6,1,1,.6,2.4,.5,c),part(2.6,1,1,.6,2.4,.5,c),
 ];}
function droneParts(kind){const c=kind==='armor'?PALETTE.gold:kind==='relay'?0x77e0ac:kind==='scout'?0x7e92e4:PALETTE.purple;
 return [part(0,0,0,5,3.4,2,c),part(0,-1,1.1,4,1.8,.8,0x25304c),part(-1,-1.1,1.7,.8,.7,.3,PALETTE.coral,true),part(1,-1.1,1.7,.8,.7,.3,PALETTE.coral,true),
  part(-3.3,0,0,1.7,3,1.5,c,false,-.3),part(3.3,0,0,1.7,3,1.5,c,false,.3),part(-2.6,2,0,1,1.7,1.2,0xbdadf8),part(2.6,2,0,1,1.7,1.2,0xbdadf8),
  part(0,1.2,1.1,2.4,1.1,.6,kind==='relay'?PALETTE.ice:c,kind==='relay'),part(0,-2.2,0,1.1,1.5,1,0x25304c),part(0,-2.9,.1,.5,.5,.5,PALETTE.coral,true),
  ...(kind==='armor'?[part(0,.1,1.5,4.2,1.2,.8,0xffe5a5)]:[])];}
function bossParts(){return [...droneParts('drone'),part(-5,.6,0,3,4,2,0x514778),part(5,.6,0,3,4,2,0x514778),part(-5,-1,1,2.5,1,1,PALETTE.coral,true),part(5,-1,1,2.5,1,1,PALETTE.coral,true),part(0,1.7,2,1.7,1.6,1,PALETTE.gold),part(0,2.7,2,.6,.7,1,PALETTE.ice,true)];}

export class BattleScene {
 constructor(canvas,{reduced=false}={}){
  this.canvas=canvas;this.reduced=reduced;this.disposed=false;this.fx=[];this.rings=[];this.recoil=0;this.shake=0;this.pulse=0;this.width=0;this.height=0;
  this.renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
  this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.7));this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.25;
  this.scene=new THREE.Scene();this.camera=new THREE.OrthographicCamera(-50,50,50,-50,.1,500);this.camera.position.z=200;
  this.scene.add(new THREE.HemisphereLight(0xc4eaff,0x302745,2));const key=new THREE.DirectionalLight(0xffedda,3.1);key.position.set(-30,60,100);this.scene.add(key);const rim=new THREE.DirectionalLight(0x539dff,2);rim.position.set(40,-20,15);this.scene.add(rim);
  this.box=new THREE.BoxGeometry(1,1,1);this.lit=new THREE.MeshStandardMaterial({roughness:.62,metalness:.18});this.emissive=new THREE.MeshBasicMaterial({toneMapped:false});
  this.blocks=new THREE.InstancedMesh(this.box,this.lit,1600);this.lights=new THREE.InstancedMesh(this.box,this.emissive,600);this.blocks.instanceMatrix.setUsage(THREE.DynamicDrawUsage);this.lights.instanceMatrix.setUsage(THREE.DynamicDrawUsage);this.blocks.frustumCulled=this.lights.frustumCulled=false;this.scene.add(this.blocks,this.lights);
  this.bgMaterial=new THREE.ShaderMaterial({depthWrite:false,depthTest:false,uniforms:{time:{value:0}},vertexShader:'varying vec2 uvv; void main(){uvv=uv;gl_Position=vec4(position.xy,0.999,1.);}',fragmentShader:`varying vec2 uvv;uniform float time;void main(){vec2 p=uvv;vec3 c=mix(vec3(.018,.08,.14),vec3(.038,.018,.11),p.y);float a=exp(-length((p-vec2(.18,.68))*vec2(2.,1.1))*3.7);float b=exp(-length((p-vec2(.85,.25))*vec2(2.,1.))*5.);c+=a*vec3(.12,.035,.22)+b*vec3(.012,.17,.2);c+=.007*sin(p.y*50.+sin(p.x*12.)+time*.04);gl_FragColor=vec4(c,1.);}`});
  this.bgGeometry=new THREE.PlaneGeometry(2,2);const bg=new THREE.Mesh(this.bgGeometry,this.bgMaterial);bg.frustumCulled=false;bg.renderOrder=-100;this.scene.add(bg);
  this.planetGeo=new THREE.IcosahedronGeometry(28,2);this.planetMat=new THREE.MeshStandardMaterial({color:0x302956,roughness:1,flatShading:true});this.planet=new THREE.Mesh(this.planetGeo,this.planetMat);this.planet.position.z=-55;this.scene.add(this.planet);
  this.orbitGeo=new THREE.RingGeometry(32,33,64);this.orbitMat=new THREE.MeshBasicMaterial({color:0x6e7da2,transparent:true,opacity:.18,side:THREE.DoubleSide,depthWrite:false});this.orbit=new THREE.Mesh(this.orbitGeo,this.orbitMat);this.orbit.rotation.x=.95;this.orbit.rotation.z=-.4;this.scene.add(this.orbit);
  const positions=[];for(let i=0;i<130;i++)positions.push(((i*71)%101)-50,((i*43)%211)-105,-30-(i%7));this.starsGeo=new THREE.BufferGeometry();this.starsGeo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));this.starsMat=new THREE.PointsMaterial({color:0xc6deff,size:.19,sizeAttenuation:false,transparent:true,opacity:.55});this.stars=new THREE.Points(this.starsGeo,this.starsMat);this.scene.add(this.stars);
  this.ringGeo=new THREE.RingGeometry(.9,1,48);this.ringPool=Array.from({length:12},()=>{const material=new THREE.MeshBasicMaterial({color:PALETTE.teal,transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide,toneMapped:false});const mesh=new THREE.Mesh(this.ringGeo,material);mesh.visible=false;this.scene.add(mesh);return mesh;});
  this.models={ship:shipParts(),skin:shipParts(true),drone:droneParts('drone'),scout:droneParts('scout'),armor:droneParts('armor'),relay:droneParts('relay'),boss:bossParts()};
  this.matrix=new THREE.Matrix4();this.actorMatrix=new THREE.Matrix4();this.quaternion=new THREE.Quaternion();this.position=new THREE.Vector3();this.scale=new THREE.Vector3();this.color=new THREE.Color();this.turn=new THREE.Euler();
  this.environment=[];for(const side of [-1,1])for(let i=0;i<4;i++){this.environment.push(part(side*(45+i%2*5),0,-8,8-i,6,3,0x173c54),part(side*(45+i%2*5),0,-6,8-i,.3,3,PALETTE.teal,true));}
 }
 resize(){const {width,height}=this.canvas.getBoundingClientRect();if(!width||!height)return;if(this.width!==width||this.height!==height){this.width=width;this.height=height;this.renderer.setSize(width,height,false);this.camera.top=50*height/width;this.camera.bottom=-this.camera.top;this.camera.updateProjectionMatrix();}return height/width;}
 reset(){this.fx.length=0;this.rings.length=0;this.recoil=this.shake=this.pulse=0;}
 burst(e,count,color){for(let i=0;i<count&&this.fx.length<140;i++){const a=i*2.399+e.x;this.fx.push({x:e.x,y:e.y,z:5,vx:Math.cos(a)*(4+i%4*3),vy:Math.sin(a)*.09,life:.35+i%4*.1,max:.35+i%4*.1,size:.35+i%3*.25,color});}}
 consume(events){for(const e of events){
   if(e.type==='fire')this.recoil=.08;
   if(e.type==='hit'||e.type==='armor'){this.burst(e,this.reduced?3:7,e.type==='armor'?PALETTE.gold:PALETTE.ice);this.rings.push({...e,life:.16,max:.16,size:4,color:PALETTE.ice});}
   if(e.type==='kill'){this.burst(e,this.reduced?5:e.kind==='boss'?32:14,e.kind==='relay'?0x77e0ac:PALETTE.purple);this.rings.push({...e,life:.35,max:.35,size:e.kind==='boss'?18:7,color:PALETTE.gold});if(e.kind==='boss')this.shake=.35;this.fx.push({x:e.x,y:e.y,z:12,life:.65,max:.65,size:1,color:PALETTE.gold,collect:true,sx:e.x,sy:e.y});}
   if(e.type==='shield'||e.type==='hurt'){this.burst(e,this.reduced?4:18,e.type==='shield'?PALETTE.teal:PALETTE.coral);this.shake=.2;}
   if(e.type==='block'){this.rings.push({...e,life:.2,max:.2,size:7,color:0x7be5c9});}
   if(e.type==='pulse'){this.pulse=.6;this.rings.push({...e,life:.6,max:.6,size:70,color:PALETTE.teal});}
   if(e.type==='pickup')this.rings.push({...e,life:.4,max:.4,size:6,color:PALETTE.teal});
 }this.rings=this.rings.slice(-12);}
 draw(w,dt=0){
  if(this.disposed)return;this.resize();if(!this.width)return;
  const height=this.camera.top*2,unit=modelScale(w),mapY=y=>(.5-y)*height;
  this.blockCount=this.glowCount=0;this.recoil=Math.max(0,this.recoil-dt);this.shake=Math.max(0,this.shake-dt);this.pulse=Math.max(0,this.pulse-dt);
  this.bgMaterial.uniforms.time.value=w.time;this.stars.scale.y=height/210;this.stars.rotation.z=this.reduced?0:Math.sin(w.time*.015)*.015;
  this.planet.position.set(42,height*.26,-55);this.planet.scale.setScalar(Math.min(1,height/130));this.planet.rotation.z=w.time*.005;this.orbit.position.copy(this.planet.position);this.orbit.scale.copy(this.planet.scale);
  const emit=(pieces,x,y,z,s=1,angle=0,flash=0,tilt=.42)=>{
   this.position.set(x,y,z);this.turn.set(tilt,0,angle);this.quaternion.setFromEuler(this.turn);this.scale.set(s,s,s);this.actorMatrix.compose(this.position,this.quaternion,this.scale);
   for(const p of pieces){const mesh=p.glow?this.lights:this.blocks,index=p.glow?this.glowCount++:this.blockCount++;if(index>=mesh.instanceMatrix.count)continue;this.matrix.multiplyMatrices(this.actorMatrix,p.matrix);mesh.setMatrixAt(index,this.matrix);this.color.copy(p.color);if(flash>0)this.color.lerp(new THREE.Color(0xffffff),Math.min(.9,flash*5));mesh.setColorAt(index,this.color);}
  };
  // A distant orbital gantry and irregular icy rocks frame the playable lanes.
  for(let side=-1;side<=1;side+=2)for(let i=0;i<3;i++)emit([part(0,0,0,7+i*2,5,3,0x20475d),part(0,1,1.8,6+i*2,.6,1,0x6ca8b9)],side*(49+i%2*3),mapY(.18+i*.27),-12,unit,-.15*side,0,.5);
  emit([part(0,0,0,100,.18,.3,0x295a70),part(0,-1,-1,100,.15,.3,0x163b54)],0,mapY(.89),-3,1,0,0,0);
  const arrival=this.reduced?1:Math.min(1,w.time/.55);
  for(const e of w.enemies)if(e.hp>0){
   const bob=this.reduced?0:Math.sin(w.time*2.3+e.id)*.45*unit, s=enemyScale(w,e)*(1+e.hit*.18);
   emit(this.models[e.kind],e.x-50,mapY(e.y)+(1-arrival)*22+bob,0,s,Math.sin(w.time+e.id)*.035,e.hit);
   if(e.maxHp>1){emit([part(0,0,0,8,.36,.3,0x27324c),part(-(1-e.hp/e.maxHp)*4,0,.4,8*e.hp/e.maxHp,.36,.3,e.kind==='relay'?0x77e0ac:PALETTE.gold,true)],e.x-50,mapY(e.y)+5.5*s,4,unit,0,0,0);}
   if(shielded(w,e))emit([part(-10,0,0,.35,13,.3,PALETTE.teal,true),part(10,0,0,.35,13,.3,PALETTE.teal,true),part(0,6,0,20,.35,.3,PALETTE.teal,true)],e.x-50,mapY(e.y),5,unit,0,0,0);
  }
  for(const b of w.shots)emit([part(0,0,0,.55,3,1,PALETTE.ice,true),part(0,-2,0,.26,2,.3,PALETTE.teal,true)],b.x-50,mapY(b.y),6,unit,0,0,0);
  for(const b of w.hostile)emit([part(0,0,0,1.3,2,1,PALETTE.coral,true),part(0,1.7,0,.6,1.5,.5,0xffb58c,true)],b.x-50,mapY(b.y),6,unit,Math.atan2(-b.vx/(100*w.aspect),b.vy),0,0);
  for(const warning of w.warnings){const f=1-warning.remaining/warning.life;for(let i=0;i<5;i++){const a=(i+1)/6;emit([part(0,0,0,.3,1.1,.1,0xffb76c,true)],warning.x+(warning.tx-warning.x)*a-50,mapY(warning.y+(w.player.y-warning.y)*a),-1,unit*(.5+f*.4),0,0,0);}}
  const blink=w.invulnerable>0&&w.time>1.5&&Math.floor(w.time*14)%2===0;
  emit(w.upgrades.skin?this.models.skin:this.models.ship,w.player.x-50,mapY(w.player.y)-this.recoil*12,2,unit*1.4,0,blink?.12:0,.44);
  if(this.recoil>0)emit([part(0,0,0,2,2.5,1,PALETTE.ice,true)],w.player.x-50,mapY(w.player.y)+7*unit,5,unit,0,0,0);
  if(w.shield>0){const ring=this.ringPool[0];ring.visible=true;ring.position.set(w.player.x-50,mapY(w.player.y),5);ring.scale.setScalar(7*unit);ring.material.opacity=.28+Math.sin(w.time*3)*.08;ring.material.color.set(PALETTE.teal);}else this.ringPool[0].visible=false;
  for(const f of this.fx){f.life-=dt;if(f.collect){const q=1-f.life/f.max,ease=q*q,target=this.rewardTarget||{x:40,y:.045};f.x=f.sx+(target.x-f.sx)*ease;f.y=f.sy+(target.y-f.sy)*ease;}else{f.x+=f.vx*dt;f.y+=f.vy*dt;}emit([part(0,0,0,f.size,f.size,f.size,f.color,true)],f.x-50,mapY(f.y),10,unit*Math.max(.15,f.life/f.max),f.life*4,0,.5);}
  this.fx=this.fx.filter(f=>f.life>0);
  for(let i=1;i<this.ringPool.length;i++){const mesh=this.ringPool[i],r=this.rings[i-1];mesh.visible=!!r;if(!r)continue;r.life-=dt;mesh.position.set(r.x-50,mapY(r.y),7);mesh.scale.setScalar((1-r.life/r.max)*r.size*unit+unit);mesh.material.opacity=Math.max(0,r.life/r.max)*.65;mesh.material.color.set(r.color);}
  this.rings=this.rings.filter(r=>r.life>0);
  this.blocks.count=Math.min(1600,this.blockCount);this.lights.count=Math.min(600,this.glowCount);for(const mesh of [this.blocks,this.lights]){mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;}
  this.camera.position.x=this.reduced?0:Math.sin(w.time*90)*this.shake*.7;this.camera.position.y=this.reduced?0:Math.cos(w.time*80)*this.shake*.5;
  this.renderer.render(this.scene,this.camera);
 }
 icon(kind){
  const shapes={firepower:[part(0,0,0,5,4,3,PALETTE.navy),part(-1.5,3,0,1.4,5,1.5,PALETTE.teal),part(1.5,3,0,1.4,5,1.5,PALETTE.teal),part(-1.5,5.5,.2,1.1,.6,1,PALETTE.ice),part(1.5,5.5,.2,1.1,.6,1,PALETTE.ice)],shield:[part(0,0,0,5,7,2,PALETTE.navy),part(0,0,1.5,3.5,5,.8,PALETTE.teal),part(0,0,2,1.2,3,.4,PALETTE.ice),part(0,0,2,3,1.2,.4,PALETTE.ice)],hull:[part(0,0,0,6,6,3,PALETTE.navy),part(0,0,2,4.5,5.5,1,PALETTE.gold),part(-3,0,0,1,4,2,0xc18545),part(3,0,0,1,4,2,0xc18545)],rapid:[part(0,0,0,4,6,2,PALETTE.navy),...[-2,0,2].map(y=>part(0,y,1.5,5,.8,1,PALETTE.coral)),part(0,3.5,0,2,1,1,PALETTE.gold)],skin:shipParts(true)};
  const group=new THREE.Group(),materials=[];for(const p of shapes[kind]){const m=new THREE.MeshStandardMaterial({color:p.color,roughness:.5,metalness:.2});materials.push(m);const mesh=new THREE.Mesh(this.box,m);mesh.applyMatrix4(p.matrix);group.add(mesh);}group.rotation.x=.35;group.rotation.y=-.25;this.scene.add(group);
  const hidden=[this.blocks,this.lights,this.stars,this.planet,this.orbit,...this.ringPool],vis=hidden.map(n=>n.visible);hidden.forEach(n=>n.visible=false);
  this.camera.left=-8;this.camera.right=8;this.camera.top=8;this.camera.bottom=-8;this.camera.position.x=this.camera.position.y=0;this.camera.updateProjectionMatrix();this.renderer.setSize(128,128,false);this.renderer.render(this.scene,this.camera);const url=this.canvas.toDataURL('image/png');
  this.scene.remove(group);materials.forEach(m=>m.dispose());hidden.forEach((n,i)=>n.visible=vis[i]);this.camera.left=-50;this.camera.right=50;this.width=this.height=0;return url;
 }
 stats(){return {...this.renderer.info.memory,drawCalls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,particles:this.fx.length,instances:this.blocks.count+this.lights.count};}
 dispose(){if(this.disposed)return;this.disposed=true;for(const g of [this.box,this.bgGeometry,this.starsGeo,this.ringGeo,this.planetGeo,this.orbitGeo])g.dispose();for(const m of [this.lit,this.emissive,this.bgMaterial,this.starsMat,this.planetMat,this.orbitMat,...this.ringPool.map(r=>r.material)])m.dispose();this.blocks.dispose();this.lights.dispose();this.renderer.dispose();this.renderer.forceContextLoss();this.fx.length=this.rings.length=0;}
}
