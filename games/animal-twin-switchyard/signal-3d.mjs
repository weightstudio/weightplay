import * as T from './vendor/three/three.module.min.js';
const colors=['#4ce0cf','#ffc978'];
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
// One canvas, two readable views. Every owned GPU resource has one disposer.
export class Signal3D {
  constructor(canvas){
    this.canvas=canvas;this.materials=new Map();this.box=new T.BoxGeometry(1,1,1);this.plane=new T.PlaneGeometry(1,1);this.t=0;this.trim=false;
    this.renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'low-power'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));this.renderer.outputColorSpace=T.SRGBColorSpace;
    this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.2;
    this.renderer.info.autoReset=false;
    this.lanes=[0,1].map(i=>{const scene=new T.Scene();scene.background=new T.Color(i?'#222c40':'#102f3b');scene.add(new T.HemisphereLight('#d8efff','#26415a',2.4));const sun=new T.DirectionalLight('#ffe1aa',3.2);sun.position.set(-200,500,600);scene.add(sun);return{scene,camera:new T.OrthographicCamera(),world:new T.Group(),actor:null,particles:[],cx:220};});
    for(const l of this.lanes)l.scene.add(l.world);
  }
  mat(color,glow=false){const key=color+glow;if(!this.materials.has(key))this.materials.set(key,new T.MeshStandardMaterial({color,roughness:.78,metalness:.12,emissive:glow?color:'#000000',emissiveIntensity:glow?.45:0}));return this.materials.get(key);}
  block(parent,x,y,z,w,h,d,color,glow=false){const m=new T.Mesh(this.box,this.mat(color,glow));m.position.set(x,y,z);m.scale.set(w,h,d);if(glow&&colors.includes(color))m.userData.signalColor=color;parent.add(m);return m;}
  animal(lane){
    const root=new T.Group(),rig=new T.Group();root.add(rig);const fur=lane?'#eee2bf':'#a66a42',dark=lane?'#635e68':'#70472f',coat=lane?'#d28d45':'#168c98';
    this.block(rig,0,28,0,29,29,25,coat);this.block(rig,0,27,14,17,18,3,lane?'#ffcf7d':'#ddbc8b');
    this.block(rig,0,53,0,38,32,30,fur);this.block(rig,-21,57,0,9,13,10,fur);this.block(rig,21,57,0,9,13,10,fur);
    this.block(rig,0,44,18,26,12,12,'#f3ddb5');this.block(rig,0,49,25,7,5,5,'#302d37');this.block(rig,0,40,24,9,2,2,'#78424b');
    for(const sign of [-1,1]){this.block(rig,sign*10,55,16,8,10,2,'#f6f2d7');this.block(rig,sign*9,55,18,4,7,2,'#122d3d');this.block(rig,sign*9-1,57,20,2,2,1,'#ffffff');}
    if(!lane){for(const sign of[-1,1]){this.block(rig,sign*10,69,8,18,13,8,'#e4b25f');this.block(rig,sign*10,70,13,13,9,3,'#42c6de',true);}this.block(rig,0,67,-12,40,5,5,'#176777');this.block(rig,-4,26,17,3,10,3,'#ff896b');this.block(rig,-4,29,18,9,3,3,'#ff896b');for(let j=0;j<3;j++)this.block(rig,0,12-j*2,-21-j*8,12-j*2,12-j*2,13,dark);}
    else{for(const sign of[-1,1]){this.block(rig,sign*12,74,-4,8,12,8,dark);this.block(rig,sign*14,82,-9,7,7,9,dark);}this.block(rig,0,33,-16,35,30,5,'#e3a858');this.block(rig,19,23,2,10,17,13,'#269b9a');this.block(rig,0,35,19,7,6,3,'#e9a84b');}
    const feet=[-1,1].map(sign=>{const p=new T.Group();p.position.set(sign*10,15,0);rig.add(p);this.block(p,0,-6,0,11,17,12,fur);this.block(p,0,-12,4,13,8,19,dark);return p;});
    const arms=[-1,1].map(sign=>{const p=new T.Group();p.position.set(sign*19,35,0);rig.add(p);this.block(p,0,-7,0,10,19,11,coat);this.block(p,0,-18,2,10,8,11,fur);return p;});
    const badge=this.block(rig,12,28,16,4,4,4,colors[lane],true);return{root,rig,feet,arms,badge};
  }
  load(stage){
    this.stage=stage;this.t=0;this.lastTrim=null;this.outcomeAge=0;
    for(let i=0;i<2;i++){const l=this.lanes[i];l.world.clear();l.particles=[];l.cx=220;const accent=colors[i],floor=stage.floors[i];
      this.block(l.world,480,-28,0,1060,52,105,'#1a3446');this.block(l.world,480,-2,0,1060,6,108,'#426575');this.block(l.world,480,-7,54,1060,4,4,accent,true);
      for(let x=-20;x<1000;x+=70){this.block(l.world,x,-1,-37,9,4,9,'#bfd0c9');this.block(l.world,x,-1,37,9,4,9,'#bfd0c9');}
      for(const p of stage.platforms[i]){const y=floor-p.y;this.block(l.world,p.x+p.w/2,y-10,0,p.w,20,78,'#355768');this.block(l.world,p.x+p.w/2,y-1,0,p.w,4,80,'#b5c8c2');this.block(l.world,p.x+p.w/2,y-5,42,p.w-4,4,4,accent,true);this.block(l.world,p.x+p.w/2,y/2-8,-21,9,Math.max(4,y-20),16,'#243b4c');}
      for(const h of stage.hazards[i]){const g=new T.Group();l.world.add(g);this.block(g,h.x+h.w/2,6,0,h.w,12,72,'#672d48');for(let x=h.x+8;x<h.x+h.w;x+=16){const spike=this.block(g,x,18,0,13,21,32,'#fb6477',true);spike.rotation.z=.15;}this.block(g,h.x+h.w/2,2,39,h.w,4,4,'#ffb0a3',true);}
      // Distant signal station: authored geometry, no old illustration underneath.
      for(let j=0;j<9;j++){const x=j*130-40,height=65+(j*43)%85;this.block(l.world,x,height/2-20,-150,70,height,55,i?'#26374c':'#19424d');this.block(l.world,x,height-16,-120,40,3,2,i?'#74634d':'#246670');}
      l.shards=stage.shards.map((p,k)=>{if(p.lane!==i)return null;const m=this.block(l.world,p.x,floor-p.y,6,18,18,18,'#ffdc81',true);m.rotation.z=Math.PI/4;return m;});
      l.switches=stage.switches.map(p=>{if(p.lane!==i)return null;const g=new T.Group();g.position.set(p.x,floor-p.y,0);l.world.add(g);this.block(g,0,-12,0,22,8,25,'#b18654');this.block(g,0,1,0,14,22,16,'#c98659');this.block(g,0,4,10,7,10,3,'#ffbb6c',true);return g;});
      const gate=new T.Group();gate.position.x=stage.gates[i].x;l.world.add(gate);this.block(gate,0,0,0,87,8,90,'#405b69');for(const sign of[-1,1])this.block(gate,sign*35,43,-6,10,86,20,'#b79b6d');this.block(gate,0,85,-6,80,10,20,'#c4a878');l.gateLight=this.block(gate,0,85,8,54,5,4,accent,true);l.gatePane=this.block(gate,0,41,-5,50,75,4,'#8d5553');l.actor=this.animal(i);l.world.add(l.actor.root);
      l.shadow=this.block(l.world,92,1,0,45,1,32,'#10242e');
    }
  }
  burst(e,reduced){if(reduced||e.lane===undefined)return;const l=this.lanes[e.lane];const color=e.type==='hit'?'#ff6e8a':e.type==='shard'?'#ffe3a1':colors[e.lane];for(let j=0;j<(e.type==='land'?4:8);j++){if(l.particles.length>=32)break;const p=this.block(l.world,e.x,this.stage.floors[e.lane]-e.y+6,25,5,5,5,color,true);l.particles.push({mesh:p,age:0,life:.4+(j%3)*.08,vx:(j-3.5)*34,vy:80+(j%4)*30});}}
  bounds(){const w=this.canvas.clientWidth,h=this.canvas.clientHeight,side=w/h>500/340;return{w,h,side,views:this.lanes.map((_,i)=>{const r=side?{x:i*w/2,y:0,w:w/2,h}:{x:0,y:i*h/2,w,h:h/2};const scale=Math.min(r.w/500,r.h/340);return{x:r.x+(r.w-500*scale)/2,y:r.y+(r.h-340*scale)/2,w:500*scale,h:340*scale};})};}
  project(lane,x,y){const {views}=this.bounds(),v=views[lane],p=new T.Vector3(x,this.stage.floors[lane]-y,10).project(this.lanes[lane].camera);const r=this.canvas.getBoundingClientRect();return{x:r.left+v.x+(p.x+1)*v.w/2,y:r.top+v.y+(1-p.y)*v.h/2};}
  render(s,dt,reduced=false){
    if(!this.stage)return;this.t+=dt;this.outcomeAge=s.done?this.outcomeAge+dt:0;const {w,h,side,views}=this.bounds();if(!w||!h)return;
    if(this.width!==w||this.height!==h){this.width=w;this.height=h;this.renderer.setSize(w,h,false);}
    this.canvas.dataset.laneLayout=side?'side':'stack';this.renderer.info.reset();this.renderer.setScissorTest(false);this.renderer.setClearColor('#102736');this.renderer.clear();this.renderer.setScissorTest(true);
    for(let i=0;i<2;i++){const l=this.lanes[i],v=views[i],b=s.bodies[i],worldH=340,worldW=500;const cx=clamp(b.x+worldW*.15,worldW/2-15,960-worldW/2+15);l.cx=reduced?cx:l.cx+(cx-l.cx)*Math.min(1,dt*7);
      const targetY=Math.max(135,this.stage.floors[i]-b.y+40);
      l.cy=l.cy===undefined?targetY:reduced?targetY:l.cy+(targetY-l.cy)*Math.min(1,dt*9);
      const c=l.camera;c.left=-worldW/2;c.right=worldW/2;c.top=worldH/2;c.bottom=-worldH/2;c.near=.1;c.far=2000;c.position.set(l.cx+110,l.cy+270,900);c.lookAt(l.cx,l.cy,0);c.updateProjectionMatrix();
      const recoil=!reduced&&s.done&&!s.success&&s.failureLane===i&&this.outcomeAge<.4?Math.sin(this.outcomeAge*30)*Math.max(0,1-this.outcomeAge/.4):0;
      const a=l.actor;a.root.position.set(b.x+recoil*5,this.stage.floors[i]-b.y,15);a.root.rotation.y=b.vx<0?-.23:.23;
      const squash=reduced?0:b.land/.17*.15;const stretch=reduced?0:b.jump/.18*.1;a.rig.scale.set(1+squash-stretch,1-squash+stretch,1);a.rig.rotation.z=reduced?0:clamp(b.vx/235,-1,1)*-.035+recoil*.1;
      a.feet.forEach((f,j)=>{f.rotation.x=reduced?0:b.ground?Math.sin(this.t*15+j*Math.PI)*(b.vx?.4:0):.25;});a.arms.forEach((arm,j)=>{arm.rotation.z=reduced?0:(j?1:-1)*(b.ground?.1:.55);});a.badge.material=this.mat(this.trim?'#d0a0ff':colors[i],true);
      l.shadow.position.x=b.x;l.shadow.scale.x=clamp(45-(this.stage.floors[i]-b.y)*.08,20,45);
      l.shards.forEach((m,k)=>{if(m){m.visible=!s.shards.has(k);m.rotation.y=reduced?.35:this.t*.8;m.position.y=this.stage.floors[i]-this.stage.shards[k].y+(reduced?0:Math.sin(this.t*2+k)*3);}});
      l.switches.forEach((g,k)=>{if(g){const active=s.switches.has(k);g.children[2].material=this.mat(active?colors[i]:'#ffbb6c',true);g.scale.setScalar(active?1.1:1);}});
      const open=s.switches.size===this.stage.switches.length;l.gatePane.visible=!open;l.gateLight.material=this.mat(open?(this.trim?'#cba2ff':colors[i]):'#bc796a',true);
      if(this.lastTrim!==this.trim)l.world.traverse(m=>{if(m.userData.signalColor)m.material=this.mat(this.trim?'#cba2ff':m.userData.signalColor,true);});
      for(let j=l.particles.length-1;j>=0;j--){const p=l.particles[j];p.age+=dt;if(p.age>=p.life){l.world.remove(p.mesh);l.particles.splice(j,1);continue;}p.mesh.position.x+=p.vx*dt;p.mesh.position.y+=p.vy*dt;p.vy-=300*dt;p.mesh.rotation.z+=dt*3;p.mesh.scale.setScalar(5*(1-p.age/p.life));}
      this.renderer.setViewport(v.x,h-v.y-v.h,v.w,v.h);this.renderer.setScissor(v.x,h-v.y-v.h,v.w,v.h);this.renderer.render(l.scene,c);
    }
    this.lastTrim=this.trim;const info=this.renderer.info;this.canvas.dataset.drawCalls=String(info.render.calls);this.canvas.dataset.geometries=String(info.memory.geometries);this.canvas.dataset.textures=String(info.memory.textures);this.canvas.dataset.engine=`Three r${T.REVISION}`;
  }
  dispose(){for(const l of this.lanes)l.world.clear();this.box.dispose();this.plane.dispose();for(const m of this.materials.values())m.dispose();this.renderer.dispose();this.renderer.forceContextLoss();}
}
