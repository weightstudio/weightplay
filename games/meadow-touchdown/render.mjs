import * as T from './vendor/three/three.module.min.js';
import {PLAYBOOKS,LANES} from './content.mjs';
import {flightPoint,receiverAt,clamp} from './simulation.mjs';
const colors={gold:0xffc65a,cream:0xffefc5,brown:0x4d2d27,teal:0x087e84,red:0xeb6648,blue:0x377dc3,pink:0xe994a8,white:0xfff8e8};
const PALETTES=[{grass:0x70a951,sky:0xcce4d9,stand:0x207f86},{grass:0x62aa75,sky:0xc4e9ef,stand:0x297bb1},{grass:0x9aae60,sky:0xf5dfae,stand:0x9c654e},{grass:0x6fa884,sky:0xc4dcd9,stand:0x6783a4},{grass:0x949b62,sky:0xf3d7b6,stand:0x9f6d83},{grass:0x75a47e,sky:0xe6d9c2,stand:0x475b94}];
function beveledBox(){
  const s=new T.Shape(),r=.07;
  s.moveTo(-.5+r,-.5);s.lineTo(.5-r,-.5);s.quadraticCurveTo(.5,-.5,.5,-.5+r);s.lineTo(.5,.5-r);s.quadraticCurveTo(.5,.5,.5-r,.5);s.lineTo(-.5+r,.5);s.quadraticCurveTo(-.5,.5,-.5,.5-r);s.lineTo(-.5,-.5+r);s.quadraticCurveTo(-.5,-.5,-.5+r,-.5);
  const g=new T.ExtrudeGeometry(s,{depth:.86,bevelEnabled:true,bevelSize:.035,bevelThickness:.07,bevelSegments:1,steps:1,curveSegments:1});g.translate(0,0,-.43);return g;
}
export class FieldRenderer{
  constructor(canvas,onLost){
    this.canvas=canvas;this.renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
    this.renderer.setPixelRatio(Math.min(1.75,devicePixelRatio||1));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=T.PCFSoftShadowMap;
    this.renderer.outputColorSpace=T.SRGBColorSpace;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=.95;
    this.scene=new T.Scene();this.scene.background=new T.Color(PALETTES[0].sky);this.scene.fog=new T.Fog(PALETTES[0].sky,55,140);
    this.camera=new T.OrthographicCamera(-12,12,16,-16,.1,180);
    this.scene.add(new T.HemisphereLight(0xe9f7ff,0x48634a,1.45));
    this.sun=new T.DirectionalLight(0xffe8bd,2.7);this.sun.position.set(-20,32,15);this.sun.castShadow=true;
    Object.assign(this.sun.shadow.camera,{left:-25,right:25,top:30,bottom:-30,near:1,far:100});this.sun.shadow.mapSize.set(1024,1024);this.sun.shadow.bias=-.001;this.sun.shadow.normalBias=.04;this.scene.add(this.sun,this.sun.target);
    this.geometry=beveledBox();this.mat=new T.MeshStandardMaterial({roughness:.8,metalness:.04});
    this.dynamic=new T.InstancedMesh(this.geometry,this.mat,850);this.dynamic.castShadow=true;this.dynamic.receiveShadow=true;this.dynamic.instanceMatrix.setUsage(T.DynamicDrawUsage);this.dynamic.frustumCulled=false;this.scene.add(this.dynamic);
    this.static=new T.InstancedMesh(this.geometry,this.mat,1600);this.static.castShadow=true;this.static.receiveShadow=true;this.scene.add(this.static);
    this.groundMat=new T.MeshStandardMaterial({color:PALETTES[0].grass,roughness:1});this.groundGeo=new T.BoxGeometry(110,.8,110);this.ground=new T.Mesh(this.groundGeo,this.groundMat);this.ground.position.set(0,-.45,-20);this.ground.receiveShadow=true;this.scene.add(this.ground);
    this.lineGeo=new T.BufferGeometry();this.linePositions=new Float32Array(3600);this.lineColors=new Float32Array(3600);this.lineGeo.setAttribute('position',new T.BufferAttribute(this.linePositions,3).setUsage(T.DynamicDrawUsage));this.lineGeo.setAttribute('color',new T.BufferAttribute(this.lineColors,3).setUsage(T.DynamicDrawUsage));
    this.lineMat=new T.LineBasicMaterial({vertexColors:true,transparent:true,opacity:.9});this.lines=new T.LineSegments(this.lineGeo,this.lineMat);this.lines.frustumCulled=false;this.scene.add(this.lines);
    this.ringGeo=new T.TorusGeometry(.8,.075,4,24);this.ringMat=new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.95});this.rings=new T.InstancedMesh(this.ringGeo,this.ringMat,24);this.rings.frustumCulled=false;this.scene.add(this.rings);
    this.ballGeo=new T.SphereGeometry(1,14,8);this.ballMat=new T.MeshStandardMaterial({color:0x8e4a27,roughness:.7});this.ball=new T.Mesh(this.ballGeo,this.ballMat);this.ball.castShadow=true;this.scene.add(this.ball);
    this.dummy=new T.Object3D();this.matrix=new T.Matrix4();this.parent=new T.Matrix4();this.color=new T.Color();this.effects=[];this.seenEvent=0;this.animations=new Map();this.palette=-1;this.kit='classic';this.stands='classic';this.elapsed=0;this.closed=false;this.lastCenter=18;
    this.reduced=matchMedia('(prefers-reduced-motion: reduce)');this.contextLost=e=>{e.preventDefault();this.lost=true;onLost();};canvas.addEventListener('webglcontextlost',this.contextLost);
    this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(canvas.parentElement);this.resize();this.buildScenery(0);
  }
  resize(){const r=this.canvas.parentElement.getBoundingClientRect();if(!r.width||!r.height)return;this.width=Math.round(r.width);this.height=Math.round(r.height);this.renderer.setSize(this.width,this.height,false);}
  box(mesh,index,x,y,z,sx,sy,sz,color,rx=0,ry=0,rz=0,parent=null){
    this.dummy.position.set(x,y,z);this.dummy.rotation.set(rx,ry,rz);this.dummy.scale.set(sx,sy,sz);this.dummy.updateMatrix();
    if(parent)this.matrix.multiplyMatrices(parent,this.dummy.matrix);else this.matrix.copy(this.dummy.matrix);
    mesh.setMatrixAt(index,this.matrix);mesh.setColorAt(index,this.color.set(color));
  }
  buildScenery(arc){
    this.palette=arc;const p=PALETTES[arc];this.groundMat.color.set(p.grass);this.scene.background.set(p.sky);this.scene.fog.color.set(p.sky);let n=0;
    const b=(...a)=>this.box(this.static,n++,...a);
    // Six authored venues share the regulation field and have different landscape rhythms.
    for(let y=-4;y<=43;y+=2)b(0,-.015,-y,20,.07,2,p.grass+(y%4===0?0x050705:0));
    b(0,.015,-42,20,.1,4,p.stand);b(0,.03,3,20,.1,2,p.stand);
    for(const x of [-10,10])b(x,.08,-20,.1,.07,48,colors.white);
    for(let y=0;y<=40;y+=5){b(0,.08,-y,20,.04,.09,colors.white);for(const x of [-6,6])for(let d=1;d<5;d++)b(x,.085,-y-d,.45,.04,.07,colors.white);}
    for(const y of [0,10,20,30,40])for(const x of [-11,11]){b(x,.2,-y,.5,.4,.6,colors.gold);b(x,.47,-y,.32,.16,.38,colors.white);}
    // Low stepped bleachers, pennants, and individual spectators, never an opaque arena wall.
    for(const side of [-1,1])for(let row=0;row<3;row++){
      const x=side*(13+row*1.3),height=.35+row*.55;b(x,height/2,-19,1.2,height,40,0xdec49d);b(x,height+.08,-19,1.25,.15,39,this.stands==='twilight-stands'?0x615b9d:p.stand);
      for(let k=0;k<16;k++){const y=-1-k*2.4;b(x,height+.4,y,.45,.58,.45,[0xe7b14e,0xdea36d,0xdfdcbe,0x6f8fa2,0xd87a77][(k+row)%5]);b(x,height+.82,y,.5,.45,.5,0xe8c48e);}
    }
    for(let i=0;i<12;i++){
      const side=i%2?1:-1,x=side*(20+(i%3)*3),z=-i*4+2;
      b(x,1,z,.5,2,.6,0x825844);b(x,2.5,z,2.4,1.5,2.3,arc===4?0xce9868:0x437f5e);b(x-.35,3.4,z+.1,1.7,1.1,1.8,arc===4?0xe2b777:0x66a278);
      b(side*(13+(i%3)),2,-i*4,.1,4,.1,colors.cream);b(side*(13+(i%3))+.6,3.6,-i*4,1.25,.7,.08,[colors.gold,colors.teal,colors.red][i%3]);
    }
    if(arc===1||arc===3)for(let j=0;j<8;j++)b(-23,0,-j*7,6,.2,8,0x6dbacb);
    for(let i=0;i<10;i++){b((i-5)*8,1.5,-52-(i%3)*3,9,5+(i%3)*2,9,0x85ad7f);b((i-5)*8,4,-53-(i%3)*3,5,3,5,0xb2c99a);}
    for(const x of [-7,7]){b(x,2.2,-44,.18,4.4,.18,colors.gold);b(x+Math.sign(x)*1.2,4,-44,2.4,.18,.18,colors.gold);}
    for(let row=0;row<3;row++){
      const z=-47-row*1.3,y=.4+row*.65;b(0,y/2,z,22,y,1.2,0x9a7957);b(0,y+.08,z,22,.15,1.2,this.stands==='twilight-stands'?0x615b9d:p.stand);
      for(let i=0;i<14;i++){const x=-9.5+i*1.45;b(x,y+.4,z,.45,.55,.45,[0xc98c45,0xd5b787,0x427b83,0xc46653][i%4]);b(x,y+.8,z,.52,.44,.52,0xe7b878);}
    }
    for(let i=0;i<210;i++){
      const x=((i*137)%197)/197*19-9.5,y=((i*71)%211)/211*43;
      b(x,.055,-y,.055,.05,.24,i%2?0x76a95b:0x528b48);
    }
    // A different end-zone landmark identifies each cup without changing the field.
    if(arc===0)for(const x of [-9,-6,6,9]){b(x,.22,-44.8,1.6,.45,1,0xb47d52);for(let k=0;k<3;k++){b(x-.5+k*.5,.65,-44.8,.08,.6,.08,0x43815a);b(x-.5+k*.5,1,-44.8,.38,.32,.38,k%2?0xf7d776:0xf2b9a5);}}
    if(arc===1){b(0,.05,-45.5,12,.15,2,0x62c6d1);for(const x of [-7,7]){b(x,1.1,-45.3,2,2.2,1.4,0x8a9f9c);b(x,1.4,-44.6,1.1,2.3,.15,0xa8e4dd);}}
    if(arc===2){for(const x of [-4,4])b(x,1.4,-45.4,.25,2.8,.25,0x80533c);b(0,2.8,-45.4,8.6,.35,.6,colors.gold);for(const x of [-2.8,0,2.8])b(x,2.1,-45.4,1.2,.8,.2,colors.teal);}
    if(arc===3)for(const x of [-7,7]){b(x,1.5,-45.8,.25,3,.25,0x825b48);b(x,3,-45.8,2.4,.23,.25,colors.white,0,0,.6);b(x,3,-45.8,.23,2.4,.25,colors.gold,0,0,.6);}
    if(arc===4)for(const x of [-8,-4,4,8]){b(x,1.1,-45.5,.32,2.2,.32,0x8b614a);b(x,2.3,-45.5,2.1,1.1,1.3,x%8===0?0xd6774f:0xe8b85c);b(x,3,-45.5,1.3,.7,1,0xc88264);}
    if(arc===5){b(0,.5,-45.8,3.2,1,2,0x56638d);b(0,1.2,-45.8,1.4,.3,1.1,colors.gold);b(0,1.8,-45.8,.45,1,.45,colors.gold);b(0,2.6,-45.8,1.65,.8,1.25,colors.gold);for(const x of [-1,1])b(x,2.6,-45.8,.5,.75,.35,colors.gold);}
    this.static.count=n;this.static.instanceMatrix.needsUpdate=true;this.static.instanceColor.needsUpdate=true;this.static.computeBoundingSphere();
  }
  segment(a,b,color){if(this.lineN+6>this.linePositions.length)return;this.color.set(color);for(const p of [a,b]){this.linePositions.set(p,this.lineN);this.lineColors.set([this.color.r,this.color.g,this.color.b],this.lineN);this.lineN+=3;}}
  ring(x,y,r,color){this.dummy.position.set(x,.1,-y);this.dummy.rotation.set(-Math.PI/2,0,0);this.dummy.scale.setScalar(r/.8);this.dummy.updateMatrix();this.rings.setMatrixAt(this.ringN,this.dummy.matrix);this.rings.setColorAt(this.ringN++,this.color.set(color));}
  character(p,id,enemy,m,time){
    const active=['live','run','flight'].includes(m.phase),runner=m.runner===p,throwing=id==='leo'&&m.phase==='flight'&&!m.ball?.lateral;
    const anim=this.animations.get(id),t=anim?time-anim.at:9,catching=anim?.type==='catch'&&t<.45,flagged=anim?.type==='flag'&&t<.45;
    const celebrate=m.result?.won,losing=m.result&&!m.result.won;
    const moving=active&&(id!=='leo')&&!catching,cycle=time*13+(p.index||0),swing=moving?Math.sin(cycle)*.65:Math.sin(time*2)*.03;
    const bounce=this.reduced.matches?0:celebrate?Math.abs(Math.sin(time*6))*.3:moving?Math.abs(Math.sin(cycle))*.06:Math.sin(time*2)*.02;
    // Articulated body, paws, muzzles, eyes, ears, and species motifs are all 3D geometry.
    const heading=id==='leo'?0:!enemy&&m.phase==='ready'?Math.PI:runner?0:p.heading||0;
    this.parent.makeRotationY(-heading);this.parent.scale(new T.Vector3(1.4,1.4,1.4));this.parent.setPosition(p.x,bounce,-p.y);
    const b=(x,y,z,sx,sy,sz,color,rx=0,ry=0,rz=0)=>this.box(this.dynamic,this.dynamicN++,x,y,z,sx,sy,sz,color,rx,ry,rz,this.parent);
    const species=enemy?['fia','panko','mimi'][p.id%3]:id;
    const fur=species==='leo'?0xffbf51:species==='fia'?0xee974b:species==='mimi'?0xf2d7bb:0xf6e6c1;
    const jersey=enemy?0xb84b4c:this.kit==='aurora-kit'?0x685dc0:colors.teal;
    b(0,.86,0,species==='panko'?.94:.8,.8,.65,jersey,losing?.12:0);
    b(0,1.15,-.34,.62,.12,.08,colors.gold);b(0,.62,-.35,.7,.1,.06,colors.gold);
    for(const side of [-1,1]){
      b(side*.23,.28,Math.sin(cycle+side)*.04,.23,.46,.27,species==='panko'?0x4c4051:fur,swing*side);
      b(side*.23,.12,-.1,.28,.17,.45,0x264452,swing*side);
      b(side*.52,.87,-.02,.23,.58,.25,jersey,celebrate?-.3:catching?-.9:runner?-.5:throwing&&side===1?-1.7:-swing*side,0,celebrate?side*1.8:flagged?side*.6:side*.15);
      b(side*.55,.61,-.1,.24,.24,.26,fur,catching?-.9:0);
      b(side*.44,.48,.05,.15,.42,.07,enemy?0xf5e4c3:colors.gold,Math.sin(time*8+side)*.15,0,side*.15);
    }
    if(species==='leo'){
      b(0,1.78,.05,1.35,1.22,.88,0xb46a2e);
      for(let i=0;i<12;i++){const a=i/12*Math.PI*2;b(Math.cos(a)*.6,1.8+Math.sin(a)*.59,.1,.4,.4,.65,[0xc97c2e,0xe4a33b,0xb56627][i%3],0,0,a*.2);}
      for(const side of [-1,1]){b(side*.53,1.87,-.2,.35,.56,.4,0xd28b32);b(side*.4,2.22,0,.4,.3,.5,0xe1a43b);}
      b(.32,.7,.62,.13,.15,.5,fur,.6);b(.32,.85,.9,.3,.3,.3,0xc57d2b);
    }
    b(0,1.73,-.14,1.02,.86,.8,fur,losing?.16:0);
    if(species==='mimi')for(const side of [-1,1]){b(side*.32,2.37,-.02,.28,.65,.28,fur,side*.12);b(side*.32,2.41,-.18,.13,.42,.04,colors.pink);}
    else for(const side of [-1,1]){b(side*.42,2.17,-.02,.34,.32,.3,species==='panko'?0x4b4051:fur,0,0,side*.18);b(side*.42,2.2,-.18,.17,.15,.035,species==='panko'?0x6a5362:0xce8d81);}
    if(species==='fia'){for(const side of [-1,1]){b(side*.39,1.47,-.47,.35,.29,.22,colors.cream);b(side*.42,2.4,-.02,.23,.32,.24,fur,0,0,side*.15);b(side*.44,2.58,-.02,.14,.14,.18,colors.brown);}b(0,.85,.55,.35,.35,.8,fur,.5);b(0,1.05,.88,.35,.32,.35,colors.cream,.5);}
    if(species==='panko')for(const side of [-1,1])b(side*.26,1.83,-.55,.3,.32,.07,0x544558,0,0,side*.15);
    b(0,1.47,-.58,.55,.26,.27,species==='mimi'?0xfff6df:colors.cream);b(0,1.57,-.75,.16,.1,.11,colors.brown);
    for(const side of [-1,1]){b(side*.24,1.86,-.56,.17,.23,.08,colors.brown);b(side*.24-.035,1.91,-.61,.055,.065,.035,0xffffff);b(side*.23,2.035,-.54,.22,.07,.07,colors.brown,0,0,side*(losing?.25:-.08));}
    b(0,1.38,-.73,.2,.045,.04,0x894d3e);
    if(species==='leo'||species==='fia'){const scarf=species==='leo'?0xe35c46:0x3d69b7;b(0,1.27,-.05,.91,.14,.72,scarf);b(.32,1.13,.42,.22,.5,.1,scarf,Math.sin(time*6)*.1);if(species==='fia')b(.32,1.12,.48,.13,.13,.04,colors.gold);}
    if(catching&&!this.reduced.matches)this.ring(p.x,p.y,1.1+t*2,colors.gold);
  }
  syncEvents(m,time){
    for(const e of m.events){if(e.id<=this.seenEvent)continue;this.seenEvent=e.id;
      if(['catch','relayCatch'].includes(e.type))this.animations.set(e.receiver,{type:'catch',at:time});
      if(e.type==='flag'&&m.runner)this.animations.set(m.runner.id,{type:'flag',at:time});
      if(['catch','relayCatch','flag','intercept','win','firstDown','drop'].includes(e.type)){
        const x=e.x??m.runner?.x??0,y=e.y??m.runner?.y??m.s,count=e.type==='win'?16:8;
        for(let i=0;i<count&&this.effects.length<96;i++)this.effects.push({x,y,z:.4,at:time,angle:i/count*Math.PI*2,speed:e.type==='win'?4:2,color:['intercept','flag','drop'].includes(e.type)?colors.red:colors.gold,life:e.type==='win'?1.2:.55});
      }
    }
  }
  draw(m,time,{kit='classic',stands='classic'}={}){
    if(this.closed)return;this.elapsed=time;
    if(this.palette!==m.stage.arc||this.stands!==stands){this.stands=stands;this.buildScenery(m.stage.arc);}this.kit=kit;
    this.dynamicN=0;this.lineN=0;this.ringN=0;this.syncEvents(m,time);
    // Follow late first downs as well: the old end-zone cap hid deep coverage.
    const center=Math.max(7,m.phase==='run'||m.phase==='result'?m.runner?.y+5||m.s+8:m.s+8);
    this.lastCenter+= (center-this.lastCenter)*.14;
    const aspect=Math.max(.3,this.width/this.height),wide=aspect>1.5,h=Math.max(wide?16.2:24,23/aspect),w=h*aspect;
    // A lower viewing angle fits the same decision depth in short landscape,
    // preserving world coordinates and giving the block silhouettes more pixels.
    this.camera.left=-w/2;this.camera.right=w/2;this.camera.top=h/2;this.camera.bottom=-h/2;this.camera.position.set(0,wide?21:40,(wide?38:17)-this.lastCenter);this.camera.lookAt(0,0,-this.lastCenter);this.camera.updateProjectionMatrix();
    this.sun.target.position.set(0,0,-this.lastCenter);this.sun.position.set(-17,34,12-this.lastCenter);
    this.character(m.qb,'leo',false,m,time);for(const p of m.receivers)this.character(p,p.id,false,m,time);for(const p of m.defenders)this.character(p,`defender-${p.id}`,true,m,time);
    const b=(...a)=>this.box(this.dynamic,this.dynamicN++,...a);
    const ribbon=(a,z,color,width=.2,lift=.16)=>{const dx=z.x-a.x,dy=z.y-a.y,length=Math.hypot(dx,dy);if(length<.015)return;b((a.x+z.x)/2,lift,-(a.y+z.y)/2,width,.04,length,color,0,Math.atan2(dx,-dy));};
    b(0,.12,-m.s,20,.045,.13,0x3b98dd);b(0,.12,-m.firstDown,20,.045,.18,colors.gold);
    if(m.stage.special==='gate'){b(-m.gate*5,.15,-40,9.7,.07,.4,colors.red);b(m.gate*5,.16,-40,9.7,.07,.8,colors.gold);for(let x=1;x<=9;x+=2)b(m.gate*x,.18,-41.5,.25,.06,2.6,colors.gold);}
    if(m.phase==='ready'||m.phase==='live'){
      for(let i=0;i<3;i++){
        let prev=receiverAt(m.book,i,m.s,0);
        for(let t=.16;t<=6;t+=.16){const next=receiverAt(m.book,i,m.s,t);if(Math.floor(t*6)%3!==0){ribbon(prev,next,0x24433e,.36);ribbon(prev,next,[0xffdb65,0xa9ffff,0xffafd7][i],.19,.21);}prev=next;}
        this.ring(m.receivers[i].x,m.receivers[i].y,.75,[colors.gold,0xc9f6ee,0xf7bad6][i]);
      }
      if(m.phase==='live'){
        const ball=m.preview();let prev=flightPoint(ball,0);
        for(let i=1;i<=32;i++){const next=flightPoint(ball,ball.duration*i/32);this.segment([prev.x,prev.z,-prev.y],[next.x,next.z,-next.y],colors.white);prev=next;}
        const end=flightPoint(ball,ball.duration);this.ring(end.x,end.y,1.1,colors.white);
        b(end.x,.14,-end.y,.12,.06,1.8,colors.white);b(end.x,.14,-end.y,1.8,.06,.12,colors.white);
      }
    }
    for(const d of m.defenders){
      this.ring(d.x,d.y,1.05,0xff624f);
      // A red diamond distinguishes defense even where jersey colors are small.
      b(d.x,.12,-d.y,1.25,.05,1.25,0x7b263c,0,Math.PI/4);
      b(d.x,.15,-d.y,.68,.05,.68,0xff9872,0,Math.PI/4);
      // Above-head diamonds stay readable when bodies or ground rings overlap.
      const interceptor=m.interception?.defender===d.id;
      b(d.x,4.18,-d.y,.67,.67,.12,0x572536,0,0,Math.PI/4);
      b(d.x,4.18,-d.y+.08,.43,.43,.14,interceptor?colors.cream:0xff8068,0,0,Math.PI/4);
      if(interceptor)this.ring(d.x,d.y,1.5,colors.cream);
      if(d.kind==='zone'&&(m.phase==='ready'||m.phase==='live')){for(let i=0;i<48;i+=2){const a=i/48*Math.PI*2,z=(i+1)/48*Math.PI*2;ribbon({x:d.home.x+Math.cos(a)*4.5,y:d.home.y+Math.sin(a)*4.5},{x:d.home.x+Math.cos(z)*4.5,y:d.home.y+Math.sin(z)*4.5},0xf5a27e,.14);}}
      const switching=d.switchTarget!==undefined&&d.switchTarget!==null&&m.elapsed>=.7;
      const feint=m.feintAt&&!m.feintDone;
      if((switching||feint)&&m.phase==='live'){
        const idx=switching?d.switchTarget:d.target===0?2:0,p=m.receivers[idx];if(p)this.segment([d.x,.25,-d.y],[p.x,.25,-p.y],colors.red);
      }
      if(d.kind==='blitz'&&m.elapsed<.8){this.ring(d.x,d.y,1,Math.sin(time*14)>0?colors.gold:colors.red);this.segment([d.x,.18,-d.y],[m.qb.x,.18,-m.qb.y],colors.red);}
    }
    if(m.lastMiss&&['ready','dead','result'].includes(m.phase)){
      const {ball,player}=m.lastMiss;
      this.ring(player.x,player.y,1,colors.white);ribbon(ball,player,0xffe8ba,.12);
      for(const angle of [-Math.PI/4,Math.PI/4])b(ball.x,.22,-ball.y,.18,.08,1.5,0xe64749,0,angle);
    }
    if(m.phase==='run'){
      this.ring(m.runner.x,m.runner.y,.9,colors.gold);
      const target=m.relayTarget();if(target){this.ring(target.x,target.y,1,0xa3f4ee);this.segment([m.runner.x,1,-m.runner.y],[target.x,1,-target.y],0xa3f4ee);}
    }
    if(m.interception){
      const hit=m.interception;let prev=flightPoint(hit.flight,0);
      for(let i=1;i<=32;i++){const next=i===32?hit.point:flightPoint(hit.flight,hit.time*i/32);this.segment([prev.x,prev.z,-prev.y],[next.x,next.z,-next.y],colors.red);prev=next;}
      this.ring(hit.point.x,hit.point.y,.7,colors.cream);
    }
    let ballPos=m.interception?.point||(m.phase==='flight'?flightPoint(m.ball,m.ball.time):m.runner&&['run','result','dead'].includes(m.phase)?{x:m.runner.x+.48,y:m.runner.y,z:1.12}:{x:m.qb.x+.45,y:m.qb.y+.2,z:1.1});
    this.ball.visible=true;this.ball.position.set(ballPos.x,ballPos.z,-ballPos.y);this.ball.scale.set(.21,.2,.4);this.ball.rotation.set(m.phase==='flight'?time*15:0,0,.25);
    for(let i=-1;i<=1;i++)b(ballPos.x,ballPos.z+.18,-ballPos.y+i*.1,.18,.03,.025,colors.cream);
    this.effects=this.effects.filter(e=>time-e.at<e.life);
    if(!this.reduced.matches)for(const e of this.effects){const t=time-e.at;b(e.x+Math.cos(e.angle)*e.speed*t,.2+2.6*t-2*t*t,-e.y-Math.sin(e.angle)*e.speed*t,.12,.12,.12,e.color,t*6,e.angle,0);}
    this.dynamic.count=this.dynamicN;this.dynamic.instanceMatrix.needsUpdate=true;this.dynamic.instanceColor.needsUpdate=true;
    this.lineGeo.setDrawRange(0,this.lineN/3);this.lineGeo.attributes.position.needsUpdate=true;this.lineGeo.attributes.color.needsUpdate=true;
    this.rings.count=this.ringN;this.rings.instanceMatrix.needsUpdate=true;if(this.rings.instanceColor)this.rings.instanceColor.needsUpdate=true;
    this.renderer.render(this.scene,this.camera);
  }
  reset(m){this.seenEvent=0;this.effects.length=0;this.animations.clear();this.lastCenter=Math.max(7,m.s+8);}
  stats(){const i=this.renderer.info;return {frame:i.render.frame,calls:i.render.calls,triangles:i.render.triangles,geometries:i.memory.geometries,textures:i.memory.textures,particles:this.effects.length,dpr:this.renderer.getPixelRatio(),width:this.width,height:this.height};}
  dispose(){if(this.closed)return;this.closed=true;this.resizeObserver.disconnect();this.canvas.removeEventListener('webglcontextlost',this.contextLost);this.effects.length=0;for(const resource of [this.geometry,this.mat,this.groundGeo,this.groundMat,this.lineGeo,this.lineMat,this.ringGeo,this.ringMat,this.ballGeo,this.ballMat])resource.dispose();this.sun.shadow.dispose();this.renderer.dispose();}
}
