import * as THREE from './vendor/three/three.module.min.js';

const palettes = [
  {sky:0xe9e4cd, floor:0xbfc9a1, leaf:0x608c68},
  {sky:0xd6e5e6, floor:0xadc7bf, leaf:0x4f8b82},
  {sky:0xe8d4ce, floor:0xc3b2a2, leaf:0x6d8970},
  {sky:0xd4ddec, floor:0xb1bfd0, leaf:0x6886a0},
  {sky:0xf0dfc1, floor:0xcbb792, leaf:0x7e9564},
  {sky:0xcad1e7, floor:0x9fadc6, leaf:0x536f8e},
];
const COLORS = [0x4aa696,0xe4b353,0xdc8999];
const MOON = [0x8e91cb,0x719dc5,0xc798d4];

export class StackView {
  constructor(host, onLoss) {
    this.host=host; this.onLoss=onLoss; this.disposed=false;
    this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.75));
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;
    this.renderer.toneMapping=THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure=1.02;
    this.renderer.domElement.setAttribute('aria-hidden','true');
    host.prepend(this.renderer.domElement);
    this.onContextLost=e=>{e.preventDefault();onLoss();};
    this.renderer.domElement.addEventListener('webglcontextlost',this.onContextLost);
    this.scene=new THREE.Scene();
    this.camera=new THREE.OrthographicCamera(-5,5,6,-6,.1,100);
    this.materials=new Map(); this.geometries=new Set(); this.textures=new Set();
    this.box=new THREE.BoxGeometry(1,1,1); this.geometries.add(this.box);
    this.fabric=this.fabricTexture();
    this.softBox=this.softGeometry();
    this.scene.add(new THREE.HemisphereLight(0xfff7df,0x526754,1.6));
    const sun=new THREE.DirectionalLight(0xffedce,2.7);sun.position.set(-4,10,7);this.scene.add(sun);
    const fill=new THREE.DirectionalLight(0xb3e6ff,.65);fill.position.set(5,3,-4);this.scene.add(fill);
    this.world=new THREE.Group();this.scene.add(this.world);
    this.scenery=new THREE.Group();this.world.add(this.scenery);
    this.tower=new THREE.Group();this.world.add(this.tower);
    this.blocks=[];this.particles=[];
    this.makeWorld();
    this.batchScenery();
    this.hoverShadow=this.shadow(this.world,3.7,2.4,.22);this.hoverShadow.position.y=.08;
    this.ghost=this.mesh(this.world,0x63d7b2,0,.06,0,3.4,.045,1.65);
    this.ghost.material=new THREE.MeshBasicMaterial({color:0x63d7b2,transparent:true,opacity:.26,depthWrite:false});
    this.materials.set('ghost',this.ghost.material);
    this.target=new THREE.Group(); this.world.add(this.target);
    for(const s of [-1,1])this.mesh(this.target,0xffe3a0,s*.18,.01,1.05,.08,.025,.3);
    this.guide=this.mesh(this.world,0xffefd0,0,2.3,0,.025,4.6,.025);
    this.guide.material=new THREE.MeshBasicMaterial({color:0xfff2be,transparent:true,opacity:.4});this.materials.set('guide',this.guide.material);
    this.active=this.cushion(0);this.world.add(this.active);
    const particleGeo=new THREE.BoxGeometry(.06,.06,.06);this.geometries.add(particleGeo);
    this.particleMesh=new THREE.InstancedMesh(particleGeo,this.mat(0xffedbc),96);
    this.particleMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);this.particleMesh.count=0;this.scene.add(this.particleMesh);
    this.dummy=new THREE.Object3D();
    this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(host);
    this.goal=4;this.resize();
  }
  mat(color, fabric=false) {
    const key=`${color}-${fabric}`;
    if(!this.materials.has(key))this.materials.set(key,new THREE.MeshStandardMaterial({color,map:fabric?this.fabric:null,bumpMap:fabric?this.fabric:null,bumpScale:.018,roughness:.92,metalness:0}));
    return this.materials.get(key);
  }
  mesh(parent,color,x,y,z,w,h,d) {
    const m=new THREE.Mesh(this.box,this.mat(color));m.position.set(x,y,z);m.scale.set(w,h,d);parent.add(m);return m;
  }
  batchScenery() {
    // Static props share box geometry. Keep the changing floor and animated
    // character separate; instance only objects with the same material.
    this.scene.updateMatrixWorld(true);const groups=new Map();
    this.scenery.traverse(node=>{
      if(node.isMesh&&node.geometry===this.box&&node!==this.floor){
        if(!groups.has(node.material))groups.set(node.material,[]);
        groups.get(node.material).push(node);
      }
    });
    this.batches=[];
    const inverse=this.scenery.matrixWorld.clone().invert();
    for(const [material,nodes] of groups){
      if(nodes.length<2)continue;
      const batch=new THREE.InstancedMesh(this.box,material,nodes.length);
      nodes.forEach((node,i)=>{batch.setMatrixAt(i,inverse.clone().multiply(node.matrixWorld));node.removeFromParent();});
      batch.computeBoundingSphere();this.scenery.add(batch);this.batches.push(batch);
    }
  }
  fabricTexture() {
    const canvas=document.createElement('canvas');canvas.width=canvas.height=128;const ctx=canvas.getContext('2d');
    ctx.fillStyle='#e4e0d5';ctx.fillRect(0,0,128,128);
    for(let y=0;y<128;y+=4)for(let x=0;x<128;x+=4){
      const n=((x*17+y*31)%23);ctx.fillStyle=`rgb(${204+n},${201+n},${191+n})`;ctx.fillRect(x,y,3,3);
      ctx.fillStyle='#ffffff45';ctx.fillRect(x,y,1,3);ctx.fillStyle='#766d5c32';ctx.fillRect(x+2,y+2,2,1);
    }
    const tx=new THREE.CanvasTexture(canvas);tx.wrapS=tx.wrapT=THREE.RepeatWrapping;tx.repeat.set(3,2);tx.colorSpace=THREE.SRGBColorSpace;this.textures.add(tx);return tx;
  }
  softGeometry() {
    const s=new THREE.Shape(),w=.91,h=.46,r=.07;
    s.moveTo(-w/2+r,-h/2);s.lineTo(w/2-r,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);
    s.lineTo(w/2,h/2-r);s.quadraticCurveTo(w/2,h/2,w/2-r,h/2);s.lineTo(-w/2+r,h/2);
    s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);s.lineTo(-w/2,-h/2+r);s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);
    const g=new THREE.ExtrudeGeometry(s,{depth:1.48,bevelEnabled:true,bevelSize:.045,bevelThickness:.075,bevelSegments:3,steps:1,curveSegments:4});
    g.translate(0,0,-.74);g.computeVertexNormals();this.geometries.add(g);return g;
  }
  shadow(parent,w,d,opacity=.2) {
    if(!this.shadowTexture){
      const c=document.createElement('canvas');c.width=c.height=64;const ctx=c.getContext('2d');const g=ctx.createRadialGradient(32,32,2,32,32,31);g.addColorStop(0,'#152618cc');g.addColorStop(.5,'#15261855');g.addColorStop(1,'#15261800');ctx.fillStyle=g;ctx.fillRect(0,0,64,64);
      this.shadowTexture=new THREE.CanvasTexture(c);this.textures.add(this.shadowTexture);
      this.shadowGeo=new THREE.PlaneGeometry(1,1);this.geometries.add(this.shadowGeo);
    }
    const key=`shadow-${opacity}`;if(!this.materials.has(key))this.materials.set(key,new THREE.MeshBasicMaterial({map:this.shadowTexture,transparent:true,opacity,depthWrite:false}));
    const m=new THREE.Mesh(this.shadowGeo,this.materials.get(key));m.rotation.x=-Math.PI/2;m.scale.set(w,d,1);parent.add(m);return m;
  }
  makeWorld() {
    this.floor=this.mesh(this.scenery,0xbfc9a1,0,-.72,0,200,.3,200);
    const groundShadow=this.shadow(this.scenery,9,6,.65);groundShadow.position.set(0,-.555,.2);
    // A crafted, layered wooden workbench and stitched rug ground the scene.
    this.mesh(this.scenery,0x8d6552,0,-.32,0,5.4,.45,2.75);
    this.mesh(this.scenery,0xd8b17a,0,-.055,0,5.6,.14,2.9);
    this.mesh(this.scenery,0xe9d6a7,0,.03,0,4.4,.07,2.15);
    for(let i=-4;i<=4;i++)this.mesh(this.scenery,0xc99868,i*.56,-.03,1.46,.015,.08,.02);
    for(const side of [-1,1]) {
      const group=new THREE.Group();group.position.set(side*4.5,-.5,-3.4);this.scenery.add(group);
      this.mesh(group,0xb28c6d,0,1.8,0,.3,4.5,.3);
      for(let j=0;j<3;j++)this.mesh(group,[0x6f9776,0x83a77d,0x9db88a][j],side*.2,3+j*.6,0,2.4-j*.5,.8,1.8-j*.3);
      this.mesh(group,0xb38e6c,0,-.05,0,1,.18,.9);
    }
    // Planter with individually authored stepped leaves; no texture download.
    for(const x of [-3.6,3.6]) {
      this.mesh(this.scenery,0xbb7d59,x,-.15,-.8,.7,.8,.7);
      this.mesh(this.scenery,0xd69b71,x,.29,-.8,.82,.14,.82);
      for(let j=0;j<4;j++)this.mesh(this.scenery,0x6d9465,x+Math.sin(j*2)*.22,.65+j*.12,-.8+Math.cos(j*2)*.17,.3,.55,.22);
    }
    const arch=new THREE.Group();this.scenery.add(arch);
    for(const x of [-5.8,5.8])this.mesh(arch,0xd7bf9b,x,3.4,-6,.35,8,.35);
    this.mesh(arch,0xd7bf9b,0,7.4,-6,12,.32,.35);
    for(let i=-3;i<=3;i++) {
      const y=5.9+Math.abs(i)*.25;
      this.mesh(arch,0xa98b67,i*1.3,y+.5,-4.2,.025,1,.025);
      this.mesh(arch,0xffd686,i*1.3,y,-4.2,.32,.45,.32);
      this.mesh(arch,0xad8260,i*1.3,y+.27,-4.2,.38,.08,.38);
    }
    this.taro=this.makeTaro();this.taro.position.set(-2.9,-.48,1.2);this.taro.scale.setScalar(.9);this.taro.rotation.y=.18;this.world.add(this.taro);
    this.flag=new THREE.Group();this.world.add(this.flag);this.flag.visible=false;
    this.mesh(this.flag,0xc09b60,0,.63,0,.07,1.25,.07);
    this.mesh(this.flag,0xf2bd57,.35,1.03,0,.68,.4,.035);
    this.mesh(this.flag,0xfff1bb,.32,1.03,.023,.16,.16,.025);
  }
  makeTaro() {
    const g=new THREE.Group();
    this.mesh(g,0x88a55b,0,.55,0,1.1,.8,.9);
    this.mesh(g,0xd5bc76,0,.48,.49,.72,.65,.1);
    for(const x of [-.4,.4]) {
      this.mesh(g,0x91aa61,x,.14,.28,.34,.32,.5);
      this.mesh(g,0xc7ba7c,x,.05,.56,.32,.1,.14);
      this.mesh(g,0x829e52,x*1.45,.68,.23,.28,.54,.32);
    }
    this.mesh(g,0x78924a,0,.82,-.43,1.22,1.1,.44);
    for(let y=0;y<3;y++)for(let x=-1;x<=1;x++)this.mesh(g,[0x68843d,0x88a253,0x79984c][(y+x+3)%3],x*.37,.4+y*.34,-.72,.32,.29,.18);
    this.taroHead=new THREE.Group();this.taroHead.position.set(0,1.27,.2);g.add(this.taroHead);
    this.mesh(this.taroHead,0xb2c875,0,0,0,.94,.8,.74);
    this.mesh(this.taroHead,0xd2d68c,0,-.17,.46,.62,.33,.3);
    for(const x of [-.26,.26]) {
      this.mesh(this.taroHead,0xfff5d5,x,.08,.382,.23,.34,.03);
      this.mesh(this.taroHead,0x393b2d,x+.025,.05,.405,.12,.21,.02);
      this.mesh(this.taroHead,0xffffff,x+.008,.11,.42,.045,.065,.012);
      this.mesh(this.taroHead,0xddaa89,x*1.3,-.2,.385,.14,.09,.025);
    }
    this.mesh(this.taroHead,0x654c37,0,-.25,.618,.18,.05,.015);
    // Garden and little banner preserve Moss Shell Taro's signature motif.
    this.mesh(g,0xd8c18a,-.3,1.44,-.55,.045,.62,.045);
    this.mesh(g,0xb7c567,-.1,1.6,-.55,.36,.2,.03);
    this.mesh(g,0x496e3e,.3,1.22,-.55,.25,.25,.24);
    this.mesh(g,0xffe2a4,.3,1.38,-.55,.13,.08,.13);
    return g;
  }
  cushion(material, moon=false) {
    const group=new THREE.Group();const c=(moon?MOON:COLORS)[material];
    const main=new THREE.Mesh(this.softBox,this.mat(c,true));group.add(main);
    const contact=this.shadow(group,1.15,2,.3);contact.position.y=-.32;
    const seam=new THREE.Color(c).lerp(new THREE.Color(0xffefc9),.42).getHex();
    this.mesh(group,seam,0,-.13,.835,.94,.035,.022);
    this.mesh(group,seam,0,-.13,-.835,.94,.035,.022);
    for(const side of [-1,1])this.mesh(group,seam,side*.487,-.13,0,.02,.035,1.64);
    for(let j=-2;j<=2;j++)this.mesh(group,seam,j*.17,-.05,.848,.025,.04,.018);
    for(const x of [-.22,.22])this.mesh(group,seam,x,.341,0,.075,.035,.13);
    group.userData.material=material;return group;
  }
  reset(stage, moon) {
    for(const b of this.blocks)this.tower.remove(b);this.blocks=[];this.particles=[];
    this.flag.visible=false;this.goal=stage.layers;this.moon=moon;this.lastTop=0;
    const p=palettes[stage.arc];this.scene.background=new THREE.Color(p.sky);
    this.scene.fog=new THREE.Fog(p.sky,22,48);this.floor.material=this.mat(p.floor);
    this.lastMaterial=-1;this.resize();
  }
  resize() {
    const {width:w,height:h}=this.host.getBoundingClientRect();if(w<1||h<1)return;
    this.renderer.setSize(w,h,false);
    const aspect=w/h;
    // A short wide screen follows the live landing instead of shrinking a
    // ten-storey tower to a thumbnail. Horizontal rules remain unchanged.
    this.followTower=aspect>3;
    const spanY=Math.max(this.followTower?4.8:(this.goal||4)*.65+3.4,9/aspect);
    this.spanX=spanY*aspect;
    this.camera.left=-this.spanX/2;this.camera.right=this.spanX/2;
    this.camera.top=spanY/2;this.camera.bottom=-spanY/2;
    const center=this.followTower?Math.max(1.5,(this.lastTop||0)+.6):(this.goal||4)*.65*.5+.35;
    this.cameraCenter=center;
    this.camera.position.set(0,center+6,20);this.camera.lookAt(0,center,0);this.camera.updateProjectionMatrix();
  }
  inputX(clientX) {
    const r=this.host.getBoundingClientRect();return ((clientX-r.left)/r.width-.5)*this.spanX;
  }
  burst(x,y,perfect=false) {
    const count=perfect?32:12;
    for(let i=0;i<count;i++) {
      const a=(i/count)*Math.PI*2;
      this.particles.push({x,y,z:.8,vx:Math.cos(a)*(perfect?1.8:.9),vy:1+Math.sin(i*4)*1.4,vz:Math.sin(a),life:1});
    }
    if(this.particles.length>96)this.particles.splice(0,this.particles.length-96);
  }
  render(run,dt,reduced=false) {
    if(this.disposed)return;
    const m=run.material;
    if(this.lastMaterial!==m) {
      this.world.remove(this.active);this.active=this.cushion(m,this.moon);this.world.add(this.active);this.lastMaterial=m;
    }
    while(this.blocks.length<run.placed.length) {
      const p=run.placed[this.blocks.length];const b=this.cushion(p.material,this.moon);this.tower.add(b);this.blocks.push(b);
    }
    this.blocks.forEach((b,i)=>{
      const p=run.placed[i];b.position.set(p.x,.4+i*.65,0);b.scale.set(p.width,1,1);
      if(i===this.blocks.length-1 && run.phase==='settle' && !reduced) {
        const wave=Math.sin(run.phaseTime*22)*Math.exp(-run.phaseTime*9);
        b.scale.y=1-wave*.19;b.scale.x=p.width*(1+wave*.035);
      }
    });
    const top=run.placed.length*.65;
    this.lastTop=top;
    if(this.followTower){
      const goal=Math.max(1.5,top+.6);
      this.cameraCenter=reduced?goal:this.cameraCenter+(goal-this.cameraCenter)*Math.min(1,dt*7);
      this.camera.position.set(0,this.cameraCenter+6,20);this.camera.lookAt(0,this.cameraCenter,0);
    }
    const fall=run.phase==='drop'?Math.min(1,run.phaseTime/.34):0;
    this.active.visible=run.phase==='aim'||run.phase==='drop'||run.phase==='miss';
    this.active.position.set(run.x,top+.4+1.5*(1-(reduced&&run.phase==='drop'?1:fall*fall)),0);
    if(run.phase==='drop')this.active.position.x=run.dropX+(run.landingX-run.dropX)*fall;
    if(run.phase==='miss') {
      this.active.position.set(run.landingX,top+.4-run.phaseTime*7,0);
      if(!reduced)this.active.rotation.z=run.phaseTime*(run.landingX>=run.supportX?-2:2);
    } else this.active.rotation.z=0;
    this.active.scale.set(run.width,1,1);
    this.ghost.visible=run.phase==='aim';this.ghost.position.set(run.predictedX,top+.065,0);this.ghost.scale.x=run.width;
    this.hoverShadow.position.set(run.predictedX,top+.075,0);this.hoverShadow.visible=run.phase==='aim'||run.phase==='drop';
    this.ghost.material.color.setHex(run.alignment>=85?0x5acf9c:run.supportRatio>=.6?0xedc568:0xea7c73);
    this.target.visible=run.phase==='aim';this.target.position.set(run.target,top+.1,0);
    this.guide.visible=run.phase==='aim';this.guide.position.set(run.target,top+.8,0);this.guide.scale.y=1.6;
    this.flag.visible=run.phase==='win';
    this.flag.position.set(run.supportX,top,0);
    if(!reduced)this.taroHead.rotation.z=Math.sin(run.time*1.4)*.025;
    this.taro.position.y=-.48+(run.phase==='win'&&!reduced?Math.abs(Math.sin(run.phaseTime*5))*.18:0);
    for(const p of this.particles){p.life-=dt*1.7;p.vy-=dt*3;p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;}
    this.particles=this.particles.filter(p=>p.life>0);
    this.particleMesh.count=reduced?0:this.particles.length;
    this.particles.forEach((p,i)=>{this.dummy.position.set(p.x,p.y,p.z);this.dummy.scale.setScalar(p.life);this.dummy.rotation.set(p.life,p.life*2,0);this.dummy.updateMatrix();this.particleMesh.setMatrixAt(i,this.dummy.matrix);});
    this.particleMesh.instanceMatrix.needsUpdate=true;
    this.renderer.render(this.scene,this.camera);
  }
  stats() {return {revision:THREE.REVISION,calls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,geometries:this.renderer.info.memory.geometries,textures:this.renderer.info.memory.textures};}
  thumbnails() {
    const s=new THREE.Scene();s.add(new THREE.HemisphereLight(0xffffff,0x666055,3));
    const l=new THREE.DirectionalLight(0xfff2df,3);l.position.set(-3,5,4);s.add(l);
    const c=new THREE.OrthographicCamera(-2.1,2.1,1.3,-1.3,.1,30);c.position.set(3,2.8,7);c.lookAt(0,0,0);
    this.renderer.setSize(240,150,false);this.renderer.setClearColor(0x000000,0);
    const output=[];
    for(let i=0;i<4;i++) {
      const p=this.cushion(i%3,i===3);p.scale.x=2.7;s.add(p);this.renderer.render(s,c);
      output.push(this.renderer.domElement.toDataURL('image/png'));s.remove(p);
    }
    this.resize();return output;
  }
  dispose() {
    if(this.disposed)return;this.disposed=true;this.observer.disconnect();
    this.renderer.domElement.removeEventListener('webglcontextlost',this.onContextLost);
    this.batches.forEach(b=>b.dispose());this.particleMesh.dispose();
    this.geometries.forEach(g=>g.dispose());this.materials.forEach(m=>m.dispose());this.textures.forEach(t=>t.dispose());
    this.renderer.dispose();this.renderer.forceContextLoss();this.renderer.domElement.remove();this.scene.clear();
  }
}
