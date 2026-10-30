import * as T from '../../src/vendor/three/r180-b59af7c93a55a6eb/three.module.min.js';
import {dropPosition} from './stages.mjs?v=6';

// Finished procedural assets: the model, seams, accessories and rig live here.
// One context and pooled transient objects are reused through every shower.
export class RainScene {
  constructor(canvas) {
    this.canvas=canvas;this.disposed=false;this.recoil=0;this.hit=0;this.clock=0;this.lastSize='';
    this.renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.75));
    this.renderer.outputColorSpace=T.SRGBColorSpace;
    this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.24;
    this.scene=new T.Scene();this.scene.background=new T.Color('#071f34');this.scene.fog=new T.Fog('#071f34',23,42);
    this.camera=new T.OrthographicCamera(-4,4,7,-7,.1,70);
    this.camera.position.set(0,6,22);this.camera.lookAt(0,0,0);
    const outline=new T.Shape();outline.moveTo(-.47,-.47);outline.lineTo(.47,-.47);outline.lineTo(.47,.47);outline.lineTo(-.47,.47);outline.closePath();
    this.box=new T.ExtrudeGeometry(outline,{depth:.94,bevelEnabled:true,bevelThickness:.03,bevelSize:.03,bevelSegments:1,steps:1});this.box.translate(0,0,-.47);
    this.sphere=new T.IcosahedronGeometry(1,0);
    this.ringGeo=new T.RingGeometry(.4,.44,40);this.mats=new Map();
    this.scene.add(new T.HemisphereLight('#afedff','#122737',1.35));
    const sun=new T.DirectionalLight('#fff1cc',3.1);sun.position.set(-4,12,10);this.scene.add(sun);
    const rim=new T.DirectionalLight('#47e2f2',2.8);rim.position.set(6,4,-3);this.scene.add(rim);
    this.world=new T.Group();this.scene.add(this.world);
    this.scenery=new T.Group();this.world.add(this.scenery);
    this.scenery.visible=false; // Authored illustrated depth replaces the prototype scenery.
    this.moon=this.cube(this.scenery,'#d5f8e8',[1.1,1.1,.3],[2,4,-6],{emissive:'#80cacc',emissiveIntensity:.6});this.moon.rotation.z=.13;
    this.moonHalo=this.cube(this.scenery,'#4ea1b5',[1.45,1.45,.1],[2,4,-6.3],{transparent:true,opacity:.12});this.moonHalo.rotation.z=.13;
    this.pond=this.cube(this.scenery,'#124f65',[20,.8,4],[0,-4,-2],{metalness:.5,roughness:.22});
    this.bank=this.cube(this.scenery,'#0c3244',[24,.22,3],[0,-4,-4]);
    this.reflections=[];for(let i=0;i<9;i++){
      this.reflections.push(this.cube(this.scenery,i%2?'#267f8c':'#1b677a',[1.8+i*.1,.025,.08],[Math.sin(i*7)*4,-4+i*.08,1]));
    }
    this.hills=[];for(let i=0;i<9;i++){
      const hill=this.cube(this.scenery,i%2?'#164553':'#103644',[2.1,1.5+(i%3)*.7,1.5],[i*2-8,0,-9]);hill.rotation.z=(i%3-1)*.08;this.hills.push(hill);
    }
    this.stars=new T.InstancedMesh(this.box,this.material('#a5dfde',{emissive:'#7ecbcd',emissiveIntensity:.8}),55);
    this.scenery.add(this.stars);this.starDummy=new T.Object3D();
    this.trees=new T.Group();this.scenery.add(this.trees);
    for(let side of [-1,1])for(let i=0;i<3;i++){
      const tree=new T.Group();tree.position.set(side*(3.5+i*.8),i*.55,-4-i);this.trees.add(tree);
      this.cube(tree,'#34605c',[.2,2.7,.24],[0,1.1,0]);
      for(let j=0;j<3;j++){const crown=this.cube(tree,j%2?'#22626a':'#1c535e',[1.35-j*.23,.65,.95],[side*(j%2)*.24,2.1+j*.43,0]);crown.rotation.y=.25*(j+1)}
    }
    this.reeds=new T.Group();this.scenery.add(this.reeds);
    for(let i=0;i<18;i++){
      const sign=i%2?1:-1,x=sign*(3.1+(i%4)*.28),y=(i%3)*.16;
      const stem=this.cube(this.reeds,i%3?'#247e78':'#369688',[.065,.9+(i%3)*.3,.065],[x,y,-1.5-(i%3)*.3]);stem.rotation.z=sign*(.08+(i%3)*.08);
      this.cube(this.reeds,'#b08a55',[.12,.28,.13],[x-sign*.08,y+stem.scale.y*.47,-1.5-(i%3)*.3]);
    }
    this.clouds=new T.Group();this.scenery.add(this.clouds);
    for(let i=0;i<7;i++)this.cube(this.clouds,i%2?'#43859c':'#5c9bad',[.95+(i%2)*.2,.4+(i%3)*.12,.6],[(i-3)*.82,Math.sin(i*1.8)*.16,-2],{roughness:.95});
    this.laneMarks=[];
    for(let i=0;i<5;i++){
      const group=new T.Group();this.world.add(group);
      const pad=this.cube(group,'#245c70',[1,.08,.8],[0,0,0],{metalness:.4,roughness:.3});pad.rotation.x=.35;
      const line=this.cube(group,'#4cc7cb',[.55,.035,.1],[0,.07,.5],{emissive:'#2ba4a8',emissiveIntensity:.8});
      const beacon=this.cube(group,'#b8faff',[.06,.3,.06],[0,.3,.55],{emissive:'#8defff',emissiveIntensity:1.5});
      this.laneMarks.push({group,pad,line,beacon});
    }
    this.nest=new T.Group();this.world.add(this.nest);
    this.boat=new T.Group();this.nest.add(this.boat);
    this.cube(this.boat,'#52372d',[1.23,.22,.9],[0,.23,0]);
    this.cube(this.boat,'#a47549',[1.43,.17,.98],[0,.4,.04]);
    this.cube(this.boat,'#3d6e74',[1.15,.09,.74],[0,.5,.08],{metalness:.3,roughness:.24});
    for(let row=0;row<3;row++)for(let side of [-1,1]){
      this.cube(this.boat,row===2?'#d3aa6b':'#9f7149',[1.48,.085,.1],[0,.4+row*.11,side*.49]);
    }
    for(let i=0;i<7;i++)this.cube(this.boat,i%2?'#deb775':'#bb8f57',[.045,.42,.06],[(i-3)*.205,.48,.55]);
    for(let side of [-1,1])this.cube(this.boat,'#a27a4e',[.13,.35,1],[side*.71,.53,0]);
    this.cube(this.boat,'#54e0d2',[.25,.1,.08],[0,.51,.59],{emissive:'#23999e',emissiveIntensity:.7});
    this.nori=new T.Group();this.nori.position.set(0,.65,-.25);this.nest.add(this.nori);
    this.nori.rotation.y=-.28;
    this.body=new T.Group();this.nori.add(this.body);
    this.cube(this.body,'#0f8290',[.64,.58,.4],[0,.27,0]);
    this.cube(this.body,'#f3c691',[.35,.4,.05],[0,.28,.24]);
    this.cube(this.body,'#1e6679',[.77,.12,.46],[0,.07,0]);
    for(let side of [-1,1]){
      this.cube(this.body,'#754b36',[.22,.19,.37],[side*.23,-.02,.13]);
      this.cube(this.body,'#a6e4df',[.18,.055,.05],[side*.23,-.02,.33]);
    }
    this.head=new T.Group();this.head.position.y=.91;this.body.add(this.head);
    this.cube(this.head,'#ad764e',[.88,.72,.66],[0,0,0]);
    this.cube(this.head,'#c58c58',[.74,.12,.64],[0,.33,0]);
    for(let side of [-1,1]){
      this.cube(this.head,'#83513b',[.23,.25,.22],[side*.4,.33,-.02]);
      this.cube(this.head,'#e4b680',[.12,.14,.04],[side*.4,.34,.105]);
      this.cube(this.head,'#ecd0a0',[.27,.28,.07],[side*.24,-.1,.35]);
      this.cube(this.head,'#203039',[.105,.15,.055],[side*.24,.025,.39],{roughness:.12});
      this.cube(this.head,'#aaffff',[.045,.055,.018],[side*.22,.065,.425],{emissive:'#81dbdd',emissiveIntensity:.35});
      this.cube(this.head,'#cf986d',[.16,.06,.045],[side*.32,-.17,.4]);
    }
    this.cube(this.head,'#ffe0ad',[.42,.22,.27],[0,-.2,.45]);
    this.cube(this.head,'#433439',[.17,.1,.09],[0,-.13,.61]);
    this.cube(this.head,'#684238',[.18,.025,.02],[0,-.27,.59]);
    // Ocean-explorer identity: square goggles and coral star clasp.
    this.cube(this.head,'#17424f',[.96,.11,.67],[0,.22,0]);
    for(let side of [-1,1]){
      this.cube(this.head,'#d7ad61',[.33,.29,.16],[side*.21,.27,.38],{metalness:.65,roughness:.3});
      this.cube(this.head,'#45e0eb',[.245,.2,.04],[side*.21,.27,.48],{metalness:.3,roughness:.1,emissive:'#1898ba',emissiveIntensity:.25});
      this.cube(this.head,'#a7fbff',[.08,.035,.015],[side*.21-.04,.32,.508]);
    }
    this.cube(this.head,'#ba9150',[.12,.06,.12],[0,.28,.44]);
    this.arms=[];for(let side of [-1,1]){
      const arm=new T.Group();arm.position.set(side*.4,.43,.03);arm.rotation.z=side*.25;this.body.add(arm);
      this.cube(arm,'#1ba3ad',[.23,.38,.27],[0,-.1,0]);
      this.cube(arm,'#996644',[.25,.2,.25],[0,-.34,.02]);this.arms.push(arm);
    }
    this.cube(this.body,'#ff9970',[.22,.07,.08],[.22,.48,.3],{roughness:.5});
    this.cube(this.body,'#ff9970',[.07,.22,.08],[.22,.48,.3],{roughness:.5});
    this.tail=new T.Group();this.tail.position.set(.35,.02,-.25);this.body.add(this.tail);
    const tail1=this.cube(this.tail,'#85563d',[.31,.26,.65],[.2,0,-.24]);tail1.rotation.y=-.5;
    const tail2=this.cube(this.tail,'#a26b45',[.26,.21,.65],[.46,.03,-.68]);tail2.rotation.y=-.5;
    this.cube(this.tail,'#3bbcc0',[.58,.1,.28],[.63,.06,-.96]);
    this.lantern=this.cube(this.nest,'#bc9fe9',[.19,.27,.19],[-.69,.91,.1],{emissive:'#b480fa',emissiveIntensity:1.2});
    this.lantern.visible=false;
    this.shadow=this.cube(this.world,'#051b26',[1.65,.08,.7],[0,0,.3],{transparent:true,opacity:.6});
    this.dropPool=Array.from({length:24},()=>{
      const group=new T.Group(),core=new T.Mesh(this.box,this.material('#58d6f3',{metalness:.2,roughness:.16,emissive:'#2884ad',emissiveIntensity:.35}));
      const glint=new T.Mesh(this.box,this.material('#d9fbff',{emissive:'#8fe6ff',emissiveIntensity:.3}));
      group.add(core,glint);group.visible=false;this.world.add(group);return {group,core,glint};
    });
    this.particleMesh=new T.InstancedMesh(this.box,this.material('#9eefff',{emissive:'#328fbd',emissiveIntensity:.7}),72);
    this.particleMesh.instanceMatrix.setUsage(T.DynamicDrawUsage);this.particleMesh.frustumCulled=false;this.world.add(this.particleMesh);
    this.particles=Array.from({length:72},()=>({life:0,x:0,y:0,z:0,vx:0,vy:0,vz:0,duration:1,size:.1}));this.particleCursor=0;
    this.tmp=new T.Object3D();this.color=new T.Color();
    this.ripple=new T.Mesh(this.ringGeo,new T.MeshBasicMaterial({color:'#8eeeff',transparent:true,opacity:0,side:T.DoubleSide}));this.world.add(this.ripple);this.rippleTime=0;
    this.resize();
  }
  async loadBackdrop(){
    this.backdrop=await new T.TextureLoader().loadAsync(new URL('./assets/moonlit-marsh-v6.webp',import.meta.url).href);
    this.backdrop.colorSpace=T.SRGBColorSpace;this.scene.background=this.backdrop;this.lastSize='';this.resize();
  }
  material(color,props={}){const key=color+JSON.stringify(props);if(!this.mats.has(key))this.mats.set(key,new T.MeshStandardMaterial({color,roughness:.72,...props}));return this.mats.get(key);}
  cube(parent,color,size,position,props={}){const mesh=new T.Mesh(this.box,this.material(color,props));mesh.scale.set(...size);mesh.position.set(...position);parent.add(mesh);return mesh;}
  resize(){
    const rect=this.canvas.getBoundingClientRect(),w=rect.width>10?Math.round(rect.width):390,h=rect.height>10?Math.round(rect.height):640;
    if(this.lastSize===`${w}x${h}`)return;this.lastSize=`${w}x${h}`;
    this.renderer.setSize(w,h,false);const aspect=w/h;
    if(this.backdrop){
      const sourceAspect=this.backdrop.image.width/this.backdrop.image.height;
      if(aspect<sourceAspect){this.backdrop.repeat.set(aspect/sourceAspect,1);this.backdrop.offset.set((1-aspect/sourceAspect)/2,0)}
      else{this.backdrop.repeat.set(1,sourceAspect/aspect);this.backdrop.offset.set(0,.08)}
      this.backdrop.needsUpdate=true;
    }
    this.height=Math.max(7.8,7.4/aspect);this.width=this.height*aspect;
    this.camera.left=-this.width/2;this.camera.right=this.width/2;this.camera.top=this.height/2;this.camera.bottom=-this.height/2;this.camera.updateProjectionMatrix();
    this.span=Math.min(this.width*.78,12.4);this.bottom=-this.height/2+1.45;this.top=this.height/2-1.2;
    const feedbackPoint=new T.Vector3(0,this.bottom+3.4,1.3).project(this.camera);
    this.feedbackFraction=Math.max(.2,Math.min(.75,(1-feedbackPoint.y)/2));
    this.pond.position.y=this.bottom-.4;this.pond.scale.x=this.width*1.5;
    this.bank.position.y=this.bottom-.1;this.bank.scale.x=this.width*1.4;
    this.reeds.position.y=this.bottom+.1;this.reeds.scale.x=this.width/7.4;
    this.hills.forEach((mesh,i)=>{mesh.position.x=(i-4)*this.width/7;mesh.position.y=this.bottom+2.4+(i%3)*.2;});
    this.trees.position.y=this.bottom+.1;this.trees.scale.x=this.width/8.5;
    for(let i=0;i<55;i++){const star=this.starDummy;star.position.set(Math.sin(i*73.17)*this.width*.65,this.bottom+3+((i*17)%53)/53*(this.height-3),-8);star.scale.setScalar(i%9===0?.038:.018);star.rotation.set(.2,.3,.4);star.updateMatrix();this.stars.setMatrixAt(i,star.matrix)}this.stars.instanceMatrix.needsUpdate=true;
    this.clouds.position.y=this.top+.2;this.clouds.scale.x=this.span/5.5;
    this.moon.position.set(this.width*.29,this.top-.4,-7);this.moonHalo.position.copy(this.moon.position);this.moonHalo.position.z-=.1;
    this.reflections.forEach((mesh,i)=>{mesh.position.set(Math.sin(i*7)*this.width*.35,this.bottom-.68+i*.075,1)});
    this.laneMarks.forEach(({group,pad},i)=>{group.position.set(this.laneX(i),this.bottom-.05,.4);pad.scale.x=this.span/5.2;});
    this.nest.scale.setScalar(Math.min(1.25,this.span/5.7));
  }
  laneX(lane){return (lane-2)*this.span/4;}
  inputLane(clientX){const rect=this.canvas.getBoundingClientRect();const worldX=((clientX-rect.left)/rect.width-.5)*this.width;return Math.max(0,Math.min(4,worldX/(this.span/4)+2));}
  impact(kind,event,reduced=false){
    if(!['rain','gold','leaf','guard','miss'].includes(kind))return;
    const good=kind==='rain'||kind==='gold';this.recoil=good?1:this.recoil;this.hit=kind==='leaf'?1:this.hit;
    const amount=reduced?3:kind==='gold'?20:good?12:6;const color=kind==='gold'||(this.aurora&&good)?'#ffd681':kind==='leaf'?'#d99b60':kind==='guard'?'#d6f2b4':'#8cecff';
    for(let i=0;i<amount;i++){
      const p=this.particles[this.particleCursor++%72],angle=i/amount*Math.PI*2;
      Object.assign(p,{life:1,duration:.5+(i%4)*.1,x:this.laneX(event.lane),y:this.bottom+.7,z:1.2,vx:Math.cos(angle)*(good?1.4:.8),vy:.9+(i%4)*.45,vz:Math.sin(angle)*.5,size:kind==='gold'?.12:.08});
      this.particleMesh.setColorAt((this.particleCursor-1)%72,this.color.set(color));
    }
    if(this.particleMesh.instanceColor)this.particleMesh.instanceColor.needsUpdate=true;
    this.ripple.position.set(this.laneX(event.lane),this.bottom+.14,1.5);this.rippleTime=reduced?.15:.65;this.ripple.material.color.set(color);
  }
  reset(){this.recoil=0;this.hit=0;this.rippleTime=0;for(const p of this.particles)p.life=0;for(const d of this.dropPool)d.group.visible=false;}
  render(run,dt=0,{reduced=false,lantern=false}={}){
    if(this.disposed)return;this.resize();this.clock+=dt;
    this.lantern.visible=lantern;this.aurora=lantern;
    this.recoil=Math.max(0,this.recoil-dt*4);this.hit=Math.max(0,this.hit-dt*3);
    const x=this.laneX(run?.x??2),time=run?.time||0,velocity=run?(run.targetX-run.x):0;
    this.nest.position.set(x,this.bottom-.06-(reduced?0:Math.sin(this.recoil*Math.PI)*.14),1.3);
    this.shadow.position.set(x,this.bottom+.03,.55);
    this.nest.rotation.z=reduced?0:-Math.max(-.12,Math.min(.12,velocity*.12))+(this.hit?Math.sin(this.hit*25)*.045:0);
    this.body.rotation.z=reduced?0:Math.sin(time*1.4)*.025;
    this.head.rotation.y=reduced?0:Math.max(-.2,Math.min(.2,velocity*.2));
    this.tail.rotation.y=reduced?0:Math.sin(time*2.5)*.12;
    this.arms.forEach((arm,i)=>{arm.rotation.z=(i?1:-1)*(.25+this.recoil*.35)});
    let active=0,next=null;
    if(run)for(const event of run.stage.events){
      if(event.kind!=='leaf'&&event.at>=time&&!next)next=event;
      if(time<event.born||time>event.at+.08)continue;if(active>=this.dropPool.length)break;
      const {group,core,glint}=this.dropPool[active++],p=dropPosition(event,time),leaf=event.kind==='leaf',gold=event.kind==='gold';
      group.visible=true;group.position.set(this.laneX(p.lane),this.bottom+.7+p.height*(this.top-this.bottom-.7),1.7);
      group.rotation.set(leaf?.18:0,leaf?.4:Math.PI/4,leaf?Math.sin(p.progress*8+event.id)*.45:Math.PI/4);
      core.scale.set(leaf?.55:gold?.36:.3,leaf?.17:gold?.44:.39,leaf?.22:.3);
      core.material=this.material(leaf?'#c38d51':gold?'#f8c361':'#58d6f3',leaf?{}:{metalness:.2,roughness:.16,emissive:gold?'#c38021':'#2884ad',emissiveIntensity:.35});
      glint.scale.set(leaf?.35:.08,leaf?.025:.14,.025);glint.position.set(leaf?0:-.05,leaf?0:.04,leaf?.1:.13);
      glint.material=this.material(leaf?'#efd1a0':gold?'#fff2c2':'#d9fbff',{emissive:leaf?'#000000':gold?'#edbd4e':'#8fe6ff',emissiveIntensity:.3});
    }
    for(let i=active;i<this.dropPool.length;i++)this.dropPool[i].group.visible=false;
    this.laneMarks.forEach(({line,beacon},i)=>{const selected=next?.lane===i;line.material=this.material(selected?'#9dffff':'#245d70',{emissive:selected?'#47cdd9':'#123646',emissiveIntensity:selected?1.2:.2});beacon.visible=selected;beacon.scale.y=reduced?.15:.14+Math.max(0,Math.sin(time*6))*.12;});
    for(let i=0;i<72;i++){
      const p=this.particles[i];p.life=Math.max(0,p.life-dt/p.duration);
      if(p.life>0){p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;p.vy-=4*dt;this.tmp.position.set(p.x,p.y,p.z);this.tmp.rotation.set(p.life*3,p.life*2,0);this.tmp.scale.setScalar(p.size*p.life);}
      else this.tmp.scale.setScalar(0);
      this.tmp.updateMatrix();this.particleMesh.setMatrixAt(i,this.tmp.matrix);
    }
    this.particleMesh.instanceMatrix.needsUpdate=true;
    this.rippleTime=Math.max(0,this.rippleTime-dt);this.ripple.material.opacity=this.rippleTime*.7;this.ripple.scale.setScalar(1+(1-this.rippleTime/.65)*1.8);
    this.renderer.render(this.scene,this.camera);
    this.canvas.dataset.renderer='three-0.180.0';this.canvas.dataset.drawCalls=String(this.renderer.info.render.calls);this.canvas.dataset.triangles=String(this.renderer.info.render.triangles);this.canvas.dataset.geometries=String(this.renderer.info.memory.geometries);
  }
  dispose(){if(this.disposed)return;this.disposed=true;this.backdrop?.dispose();this.box.dispose();this.sphere.dispose();this.ringGeo.dispose();this.ripple.material.dispose();for(const mat of this.mats.values())mat.dispose();this.renderer.dispose();}
}
