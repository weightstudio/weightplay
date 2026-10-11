import * as THREE from './vendor/three/three.module.min.js';
import {wheelOutline} from './rally-core.mjs';

const palettes=[['#87bdb3','#497967','#bddba4'],['#88b6cc','#47657b','#b7d7e3'],['#a9bf97','#77704e','#cad39b'],['#9f9ac3','#5a557b','#c6b5ed'],['#e4b1a0','#915c63','#efc796'],['#719faf','#38596f','#a3ded1']];
export class RallyScene {
  constructor(canvas,level,elevation){
    this.resources=new Set();this.canvas=canvas;this.level=level;this.elevation=elevation;this.wheelKey='';this.disposed=false;
    this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    try{
      this.renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'low-power'});
      this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
      this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.25;
      this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
      this.scene=new THREE.Scene();const colors=palettes[level.chapter];this.scene.background=new THREE.Color(colors[0]);this.scene.fog=new THREE.Fog(colors[0],38,115);
      this.camera=new THREE.OrthographicCamera(-10,10,10,-10,.1,160);
      this.box=this.own(new THREE.BoxGeometry(1,1,1));const bevel=new THREE.Shape();bevel.moveTo(-.46,-.46);bevel.lineTo(.46,-.46);bevel.lineTo(.46,.46);bevel.lineTo(-.46,.46);bevel.closePath();this.detailBox=this.own(new THREE.ExtrudeGeometry(bevel,{depth:.92,bevelEnabled:true,bevelThickness:.04,bevelSize:.04,bevelSegments:1,steps:1}));this.detailBox.translate(0,0,-.46);this.materials=new Map();
      this.scene.add(new THREE.HemisphereLight('#dcfffc','#284238',2.4));
      this.sun=new THREE.DirectionalLight('#ffe4b4',3.5);this.sun.position.set(10,25,15);this.sun.castShadow=true;this.sun.shadow.mapSize.set(1024,1024);Object.assign(this.sun.shadow.camera,{left:-14,right:14,top:14,bottom:-14,near:.1,far:65});this.sun.shadow.bias=-.0005;this.sun.shadow.normalBias=.05;this.scene.add(this.sun,this.sun.target);
      const rim=new THREE.DirectionalLight('#b9f8ff',1.2);rim.position.set(-15,5,-12);this.scene.add(rim);
      this.world=new THREE.Group();this.scene.add(this.world);this.buildTrack();this.buildScenery(colors);
      this.player=this.kart(false);this.rival=this.kart(true);this.scene.add(this.player.root,this.rival.root);
      this.sparkGeometry=this.own(new THREE.BoxGeometry(.08,.08,.08));this.sparks=Array.from({length:24},()=>{const m=new THREE.Mesh(this.sparkGeometry,this.mat('#ffe4a0',.2,.5,true));m.visible=false;this.scene.add(m);return m});
      this.cameraX=0;this.lastPass=0;this.burstAt=-9;this.resize();canvas.dataset.renderer='three-webgl2';canvas.dataset.activeRenderers='1';
    }catch(e){this.dispose();throw e;}
  }
  own(r){this.resources.add(r);return r;}
  mat(color,metal=.1,rough=.72,glow=false){const key=[color,metal,rough,glow].join();if(!this.materials.has(key))this.materials.set(key,this.own(new THREE.MeshStandardMaterial({color,metalness:metal,roughness:rough,emissive:glow?color:0,emissiveIntensity:glow?.5:0})));return this.materials.get(key);}
  block(parent,x,y,z,w,h,d,color,metal=.1){const m=new THREE.Mesh(this.modeling?this.detailBox:this.box,this.mat(color,metal));m.position.set(x,y,z);m.scale.set(w,h,d);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  buildTrack(){
    const colors=palettes[this.level.chapter];
    for(const z of [1.9,-2.3]){
      const top=[],side=[];
      const quad=(a,b,c,d,arr)=>arr.push(...a,...b,...c,...a,...c,...d);
      for(let x=-70;x<1090;x+=3){const next=x+3,mid=(x+next)/2;if(this.level.terrain.some((t,i)=>t==='gap'&&Math.abs(mid-this.level.positions[i])<36))continue;
        const a=this.elevation(this.level,x)/10,b=this.elevation(this.level,next)/10,X=x/10,Y=next/10;
        quad([X,a,z-1.55],[X,a,z+1.55],[Y,b,z+1.55],[Y,b,z-1.55],top);
        quad([X,a,z+1.55],[X,a-1.05,z+1.55],[Y,b-1.05,z+1.55],[Y,b,z+1.55],side);
        quad([Y,b,z-1.55],[Y,b-1.05,z-1.55],[X,a-1.05,z-1.55],[X,a,z-1.55],side);
      }
      for(const [data,color] of [[top,colors[1]],[side,'#243d44']]){const g=this.own(new THREE.BufferGeometry());g.setAttribute('position',new THREE.Float32BufferAttribute(data,3));g.computeVertexNormals();const mesh=new THREE.Mesh(g,this.mat(color));mesh.receiveShadow=true;this.world.add(mesh);}
      // Brass seams and support piers are spaced, never arbitrary floating terrain.
      for(let x=-4;x<108;x+=5){if(this.level.terrain.some((t,i)=>t==='gap'&&Math.abs(x*10-this.level.positions[i])<45))continue;const y=this.elevation(this.level,x*10)/10;this.block(this.world,x,y+.03,z, .08,.05,3.05,'#d5b66d',.5);this.block(this.world,x,y-2.4,z, .5,3.7,2.2,'#354c50');}
      this.level.terrain.forEach((type,i)=>{const x=this.level.positions[i]/10,y=this.elevation(this.level,this.level.positions[i])/10;
        if(type==='tunnel'){for(const dx of [-3,0,3]){const base=this.elevation(this.level,(x+dx)*10)/10;this.block(this.world,x+dx,base+2,z-1.75,.55,4,.4,'#77668a');this.block(this.world,x+dx,base+2,z+1.75,.55,4,.4,'#77668a');this.block(this.world,x+dx,base+4,z,.6,.5,3.9,'#a995c8');this.block(this.world,x+dx,base+3.65,z,.62,.13,3.2,'#ffd474',.5);}}
        if(type==='mud'||type==='ice')this.block(this.world,x,y+.06,z,6.5,.09,3.04,type==='ice'?'#85e7eb':'#5c4634',type==='ice'?.5:0);
        if(type==='wind'){this.block(this.world,x,y+1.8,z-1.8,.25,3.6,.25,'#d5b66d');for(let j=0;j<3;j++)this.block(this.world,x+.65+j*.55,y+3.25-j*.12,z-1.8,.6,.38,.12,'#e5edce');}
        if(type==='gap')for(const dx of [-4,4])this.block(this.world,x+dx,this.elevation(this.level,(x+dx)*10)/10+.12,z,.35,.2,3.05,'#ffd06b',.4);
        // Readable terrain marker at the entrance, above the track edge.
        if(type!=='flat')this.block(this.world,x-4,this.elevation(this.level,(x-4)*10)/10+.15,z+1.45,.65,.15,.25,'#ffd06b',.4);
      });
      for(let j=0;j<8;j++)this.block(this.world,100,this.elevation(this.level,1000)/10+.035,z-1.4+j*.4,.65,.04,.4,j%2?'#fff4cf':'#16323a');
    }
    this.block(this.world,101,4.2,-.2,.35,8.4,.35,'#d4b270',.5);this.block(this.world,101,4.2,4.1,.35,8.4,.35,'#d4b270',.5);this.block(this.world,101,8.3,1.9,.5,.5,5,'#fff1bd');
  }
  buildScenery(colors){
    // Each island is a composed cuboid grove with stepped canopy, rock and crystal.
    for(let i=0;i<19;i++){
      const x=i*8-15,z=-13-(i%3)*7,y=-4-(i%4),g=new THREE.Group();g.position.set(x,y,z);this.world.add(g);
      this.block(g,0,-2,0,5.8,4.2,5.4,'#536e70');this.block(g,-.3,-4.1,.4,3.4,2.5,3.5,'#3a575e');this.block(g,0,.2,0,6.1,.6,5.7,colors[2]);
      this.block(g,.2,2,-.3,.75,4,.85,'#705844');
      this.block(g,.1,4.7,0,4.4,2.1,3.6,colors[1]);this.block(g,-.7,6,0,3,1.3,2.6,colors[2]);this.block(g,1.3,3.8,.5,2.7,1.6,2.5,colors[1]);
      this.block(g,-1.5,1.1,1.7,.45,1.7,.5,'#9af7e2',.4).rotation.z=.22;
    }
    // Far monumental arches establish depth without obscuring the lanes.
    for(let i=0;i<7;i++){const x=i*19;this.block(this.world,x,5,-28,1.4,16,2,'#71908a');this.block(this.world,x+8,5,-28,1.4,16,2,'#71908a');this.block(this.world,x+4,13,-28,9.4,1.5,2,'#aac4a5');}
  }
  kart(fox){
    this.modeling=true;const root=new THREE.Group(),body=new THREE.Group();root.add(body);const color=fox?'#d56851':'#268e87',fur=fox?'#d98c45':'#8c9c9e';
    this.block(body,0,.75,0,2.8,.65,1.9,color,.4);this.block(body,1.3,.78,0,.38,.65,2.08,'#d8b368',.7);this.block(body,-1.4,.65,0,.25,.5,2.1,'#3d5058',.5);
    this.block(body,.9,1.15,0,1.15,.45,1.8,color,.5);
    for(const z of [-.72,.72]){this.block(body,1.52,1,z,.08,.22,.27,'#fff2b6',.5);this.block(body,-.95,1.25,z,.5,.12,.25,'#d0ad68',.6);}
    for(const z of [-.45,0,.45])this.block(body,1.52,.65,z,.09,.26,.16,'#21333b');
    this.block(body,-.35,1.55,0,.95,1,1.1,fox?'#653f4e':'#235d66');
    const head=new THREE.Group();head.position.set(-.25,2.2,0);body.add(head);
    this.block(head,0,0,0,1.35,1.1,1.22,fur);
    this.block(head,.65,-.23,0,.65,.55,.91,fox?'#f3d8aa':'#a8b5b1');
    this.block(head,1,-.19,0,.12,.18,.35,fox?'#2b303a':'#576d75');
    for(const z of [-.62,.62]){this.block(head,.28,.12,z,.35,.32,.04,'#f9f6e7');this.block(head,.38,.12,z*1.035,.16,.25,.06,'#1c303a');this.block(head,.42,.19,z*1.08,.055,.07,.03,'#ffffff');this.block(head,-.45,.68,z*.75,.36,fox?.65:.36,.31,fur);if(fox)this.block(head,-.45,.86,z*.75,.23,.25,.24,'#4c3837');}
    if(!fox){this.block(head,.89,.18,0,.32,.65,.32,'#f1e8cc');this.block(head,.84,.6,0,.23,.23,.23,'#fff3d1');for(const z of [-.36,.36]){this.block(head,.13,.66,z,.53,.18,.45,'#d4aa52',.75);this.block(head,.14,.77,z,.36,.06,.31,'#72c9d3',.65);}}
    else{for(let i=0;i<3;i++)this.block(body,-1-i*.22,1.88-i*.12,.15,.38,.18,.42,'#df705d');}
    for(const z of [-.67,.67])this.block(body,.1,1.45,z,.7,.32,.3,fur);
    const wheels=[];for(const x of [-1.02,1.05])for(const z of [-1.06,1.06]){const pivot=new THREE.Group();pivot.position.set(x,0,z);root.add(pivot);wheels.push(pivot);}
    const dust=this.block(root,-1.7,.12,0,.18,.18,.18,'#f7d197');dust.visible=false;
    const kart={root,body,head,wheels,dust,fox,geometries:[]};this.setWheels(kart,{kind:'circle',width:.62,height:.56});this.modeling=false;return kart;
  }
  setWheels(kart,p){
    kart.wheels.forEach(w=>w.clear());kart.geometries.forEach(g=>{g.dispose();this.resources.delete(g)});kart.geometries=[];
    const outline=wheelOutline(p),shape=new THREE.Shape(outline.map(v=>new THREE.Vector2(v.x*.69,v.y*.69)));
    const geometry=this.own(new THREE.ExtrudeGeometry(shape,{depth:.24,bevelEnabled:true,bevelThickness:.045,bevelSize:.035,bevelSegments:1,steps:1}));geometry.translate(0,0,-.12);kart.geometries.push(geometry);
    const rim=this.own(new THREE.EdgesGeometry(geometry,28));kart.geometries.push(rim);
    const edgeMaterial=this.own(new THREE.LineBasicMaterial({color:kart.fox?'#ffe2b0':'#ffe087'}));kart.edgeMaterial?.dispose();if(kart.edgeMaterial)this.resources.delete(kart.edgeMaterial);kart.edgeMaterial=edgeMaterial;
    for(const pivot of kart.wheels){const mesh=new THREE.Mesh(geometry,this.mat(kart.fox?'#825445':'#346463',.55,.44));mesh.castShadow=true;pivot.add(mesh,new THREE.LineSegments(rim,edgeMaterial));this.block(pivot,0,0,.18,.24,.24,.17,'#ffd37a',.7);for(let i=0;i<4;i++){const spoke=this.block(pivot,0,0,.15,.9,.065,.07,'#dcb96d',.7);spoke.rotation.z=i*Math.PI/4;}}
  }
  resize(){if(this.disposed)return;const r=this.canvas.getBoundingClientRect();if(r.width<1||r.height<1)return;this.renderer.setSize(r.width,r.height,false);const viewWidth=Math.min(r.width,r.height*2),h=16*r.height/viewWidth;this.renderer.setViewport((r.width-viewWidth)/2,0,viewWidth,r.height);Object.assign(this.camera,{left:-8,right:8,top:h/2,bottom:-h/2});this.camera.updateProjectionMatrix();}
  updateKart(kart,distance,profile,speed,time,impact){
    const x=distance/10,angle=distance/(10.5+profile.height*3.8+profile.width*1.6);const outline=wheelOutline(profile);
    let support=.25;for(const p of outline)support=Math.max(support,(p.x*Math.sin(-angle)+p.y*Math.cos(-angle))*.69);
    const back=this.elevation(this.level,distance-10)/10,front=this.elevation(this.level,distance+10)/10;
    let y=(back+front)/2+support;
    const gap=this.level.terrain.findIndex((t,i)=>t==='gap'&&Math.abs(distance-this.level.positions[i])<45);
    if(gap>=0)y+=Math.sin((distance-this.level.positions[gap]+45)/90*Math.PI)*1.2;
    kart.root.position.set(x,y,kart.fox?-2.3:1.9);kart.root.rotation.z=Math.atan2(front-back,2)*.7;
    kart.wheels.forEach(w=>w.rotation.z=-angle);kart.body.rotation.z=this.reduced?0:Math.sin(time*8)*Math.min(.025,speed*.001)+impact*.035;
    kart.head.rotation.z=this.reduced?0:Math.sin(time*3)*.035;kart.dust.visible=!this.reduced&&speed>28;kart.dust.scale.setScalar(.6+Math.sin(time*17)*.3);
  }
  draw(run){
    if(this.disposed)return;const key=JSON.stringify(run.profile);if(key!==this.wheelKey){this.setWheels(this.player,run.profile);this.wheelKey=key;}
    this.updateKart(this.player,run.player,run.profile,run.speed,run.elapsed,run.impact);
    this.updateKart(this.rival,run.rival,{kind:'circle',width:.62,height:.56},this.level.rival,run.elapsed,0);
    const x=run.player/10+3;this.camera.position.set(x-4,16,22);this.camera.lookAt(x,1.3,0);
    this.sun.position.set(x+6,20,12);this.sun.target.position.set(x,0,0);
    if(run.passed.length!==this.lastPass){this.lastPass=run.passed.length;this.burstAt=run.elapsed;}
    const age=run.elapsed-this.burstAt;
    this.sparks.forEach((s,i)=>{s.visible=!this.reduced&&age>=0&&age<.65;if(s.visible){const a=i*2.4;s.position.set(run.player/10+Math.cos(a)*age*4,this.player.root.position.y+1+Math.sin(a)*age*3-age*age*4,1.9+Math.sin(i)*age*3);s.rotation.set(age*4+i,age*3,0);}});
    this.renderer.render(this.scene,this.camera);
    const info=this.renderer.info;this.canvas.dataset.drawCalls=String(info.render.calls);this.canvas.dataset.triangles=String(info.render.triangles);this.canvas.dataset.geometries=String(info.memory.geometries);this.canvas.dataset.textures=String(info.memory.textures);
  }
  dispose(){if(this.disposed)return;this.disposed=true;this.scene?.clear();for(const r of this.resources)r.dispose?.();this.resources.clear();this.renderer?.renderLists.dispose();this.renderer?.dispose();this.renderer?.forceContextLoss();this.canvas.dataset.activeRenderers='0';this.canvas.dataset.geometries='0';this.canvas.dataset.textures='0';}
}
