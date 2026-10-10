import * as THREE from './vendor/three/three.module.min.js';

const cellPoint = cell => ({x:(cell % 4 - 1.5) * 2.15, z:(Math.floor(cell / 4) - 1) * 2.05});

export class ShowtimeScene {
  constructor(canvas) {
    this.canvas=canvas; this.owned=new Set(); this.listeners=[]; this.disposed=false;
    this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'low-power'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;
    this.renderer.toneMapping=THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure=1.06;
    this.scene=new THREE.Scene(); this.scene.background=new THREE.Color('#24212e');
    this.camera=new THREE.OrthographicCamera(-8,8,6,-6,.1,80);
    this.camera.position.set(0,13,13); this.camera.lookAt(0,0,0);
    this.scene.add(new THREE.HemisphereLight(0xffe7cf,0x29213b,2.1));
    const key=new THREE.DirectionalLight(0xffdba7,3.1); key.position.set(-5,11,7); this.scene.add(key);
    const rim=new THREE.DirectionalLight(0x61cbbb,1.4); rim.position.set(7,6,-6); this.scene.add(rim);
    this.box=this.own(new THREE.BoxGeometry(1,1,1));
    this.mats={
      deck:this.mat('#302a38',.18,.7), edge:this.mat('#c38e62',.34,.42), tile:this.mat('#4a3d4b',.12,.52),
      tileAlt:this.mat('#3a3744',.12,.58), gold:this.mat('#ffca80',.24,.32), teal:this.mat('#55d4bb',.22,.3),
      wall:this.mat('#625570',.1,.5), dog:this.mat('#ded1bd',.12,.42), dogDark:this.mat('#343542',.26,.37),
      dogTeal:this.mat('#54d5c0',.28,.3), muzzle:this.mat('#f4e5ce',.04,.52), eye:this.mat('#141923',.18,.2),
      fox:this.mat('#dc855a',.13,.42), foxLight:this.mat('#f1c48e',.07,.5), foxDark:this.mat('#613b3b',.18,.44),
      lamp:this.basic('#ffd596'), shadow:this.mat('#171622',0,.88),
    };
    this.sceneObjects=new THREE.Group(); this.scene.add(this.sceneObjects);
    this.buildStage();
    this.dog=this.buildDog(); this.fox=this.buildFox(); this.sceneObjects.add(this.dog,this.fox);
    this.targets=[this.makeTarget(0),this.makeTarget(1)]; this.sceneObjects.add(...this.targets);
    this.positions=[0,11]; this.goals=[0,11]; this.activeActor=0; this.tick=0; this.frame=0;
    this.onResize=()=>this.resize(); this.resizeObserver=null; this.active=false;
    this.activate();
    canvas.dataset.renderer='three-webgl';
  }
  activate(){if(this.disposed||this.active)return;this.active=true;window.addEventListener('resize',this.onResize,{passive:true});
    this.resizeObserver='ResizeObserver'in window?new ResizeObserver(()=>this.resize()):null;
    this.resizeObserver?.observe(this.canvas.parentElement);this.resize();this.drawLoop();}
  suspend(){if(!this.active)return;this.active=false;cancelAnimationFrame(this.frame);window.removeEventListener('resize',this.onResize);this.resizeObserver?.disconnect();this.resizeObserver=null;}
  own(x){this.owned.add(x);return x}
  mat(color,metalness=0,roughness=.55){return this.own(new THREE.MeshStandardMaterial({color,metalness,roughness}))}
  basic(color){return this.own(new THREE.MeshBasicMaterial({color}))}
  mesh(geometry,material,parent,x,y,z,sx=1,sy=1,sz=1){const m=new THREE.Mesh(geometry,material);m.position.set(x,y,z);m.scale.set(sx,sy,sz);parent.add(m);return m}
  cube(parent,material,x,y,z,sx,sy,sz){const m=this.mesh(this.box,material,parent,x,y,z,sx,sy,sz);m.castShadow=true;m.receiveShadow=true;return m}
  buildStage(){
    this.cube(this.sceneObjects,this.mats.edge,0,-.38,0,9.15,.34,7.2);
    this.cube(this.sceneObjects,this.mats.deck,0,-.16,0,8.9,.16,6.96);
    this.tiles=[];
    for(let cell=0;cell<12;cell++){const p=cellPoint(cell);const tile=this.cube(this.sceneObjects,cell%2?this.mats.tile:this.mats.tileAlt,p.x,-.055,p.z,2.02,.055,1.92);this.tiles.push(tile);
      this.cube(this.sceneObjects,this.mats.gold,p.x,-.015,p.z,1.2,.018,.035);this.cube(this.sceneObjects,this.mats.gold,p.x,-.015,p.z,.035,.018,1.2);}
    for(const [x,z] of [[-4.1,-3.05],[4.1,-3.05],[-4.1,3.05],[4.1,3.05]]){
      this.cube(this.sceneObjects,this.mats.edge,x,.38,z,.16,.8,.16);
      const cap=this.mesh(new THREE.OctahedronGeometry(.36,0),this.mats.lamp,this.sceneObjects,x,.9,z,.72,.8,.72);cap.material=this.mats.lamp;
    }
    // A low, stepped proscenium gives the playable grid depth without borrowing a real event stage.
    this.cube(this.sceneObjects,this.mats.foxDark,0,.48,-3.55,8.3,.1,.24);
    for(let i=0;i<7;i++)this.cube(this.sceneObjects,i%2?this.mats.gold:this.mats.teal,-3.6+i*1.2,.57,-3.55,.14,.12,.12);
  }
  makeTarget(actor){
    const group=new THREE.Group(); const ring=this.own(new THREE.TorusGeometry(.55,.055,8,32));
    const material=actor===0?this.mats.teal:this.mats.gold; const mesh=this.mesh(ring,material,group,0,-.005,0,1,.7,1); mesh.rotation.x=Math.PI/2;
    this.cube(group,material,0,.02,0,.14,.025,.88);this.cube(group,material,0,.02,0,.88,.025,.14);
    return group;
  }
  buildDog(){
    const root=new THREE.Group();root.userData.kind='dog';
    // Designed cuboid anatomy: layered head plates, face, muzzle, stepped ears, jointed paws and signature teal collar.
    this.cube(root,this.mats.dog,0,.92,0,.94,.86,1.1);
    this.cube(root,this.mats.dogDark,0,1.04,.57,.78,.61,.13);
    this.cube(root,this.mats.dog,-.25,1.45,.04,.29,.51,.31);this.cube(root,this.mats.dog,.25,1.45,.04,.29,.51,.31);
    this.cube(root,this.mats.dogDark,-.25,1.69,.09,.31,.12,.31);this.cube(root,this.mats.dogTeal,.25,1.68,.09,.31,.12,.31);
    this.cube(root,this.mats.muzzle,0,.86,.68,.52,.33,.28);this.cube(root,this.mats.eye,0,.86,.84,.18,.13,.08);
    for(const x of [-.25,.25]){this.mesh(new THREE.SphereGeometry(.075,10,8),this.mats.eye,root,x,1.17,.65,.8,.8,.65);this.cube(root,this.mats.dogTeal,x,1.58,-.03,.09,.055,.1)}
    this.cube(root,this.mats.dogTeal,0,.36,.02,1.18,.16,1.17);
    this.cube(root,this.mats.dogDark,-.53,.53,0,.17,.54,.19);this.cube(root,this.mats.dogDark,.53,.53,0,.17,.54,.19);
    for(const x of [-.32,.32])for(const z of [-.38,.38]){this.cube(root,this.mats.dogDark,x,.05,z,.28,.48,.31);this.cube(root,this.mats.dogTeal,x,.05,z+.02,.32,.1,.35)}
    this.cube(root,this.mats.dogTeal,0,.32,-.67,.17,.18,.66);
    return root;
  }
  buildFox(){
    const root=new THREE.Group();root.userData.kind='fox';
    this.cube(root,this.mats.fox,0,.76,0,.82,.73,1.05);
    this.cube(root,this.mats.fox,0,1.24,.01,.94,.75,.84);
    this.cube(root,this.mats.fox,-.31,1.75,-.02,.31,.62,.32);this.cube(root,this.mats.fox,.31,1.75,-.02,.31,.62,.32);
    this.cube(root,this.mats.foxDark,-.31,1.88,.02,.17,.25,.19);this.cube(root,this.mats.foxDark,.31,1.88,.02,.17,.25,.19);
    this.cube(root,this.mats.foxLight,0,1.15,.51,.48,.3,.32);
    for(const x of [-.24,.24])this.mesh(new THREE.SphereGeometry(.07,10,8),this.mats.eye,root,x,1.35,.48,.8,.8,.62);
    this.cube(root,this.mats.foxDark,0,1.08,.69,.15,.1,.09);this.cube(root,this.mats.foxLight,0,.61,.55,.45,.31,.2);
    this.cube(root,this.mats.foxLight,0,.3,-.02,1.02,.15,1.12);
    for(const x of [-.29,.29])for(const z of [-.35,.35])this.cube(root,this.mats.foxDark,x,.04,z,.25,.43,.28);
    this.cube(root,this.mats.fox,-.53,.7,-.55,.25,.34,.38);this.cube(root,this.mats.fox,-.67,.88,-.83,.22,.34,.25);this.cube(root,this.mats.foxLight,-.72,1.04,-.92,.22,.18,.22);
    this.cube(root,this.mats.gold,0,.39,.46,.75,.12,.12);
    return root;
  }
  cellToWorld(cell){const p=cellPoint(cell);return new THREE.Vector3(p.x,.12,p.z)}
  setState({positions=this.positions,goals=this.goals,activeActor=this.activeActor,walls=[]}={}){
    if(this.disposed)return;
    this.positions=[...positions];this.goals=[...goals];this.activeActor=activeActor;
    [this.dog,this.fox].forEach((actor,i)=>{const p=this.cellToWorld(this.positions[i]);actor.position.x=p.x;actor.position.z=p.z;actor.rotation.y=actor.userData.facing||0;});
    this.targets.forEach((marker,i)=>{const p=this.cellToWorld(this.goals[i]);marker.position.set(p.x,.035,p.z);});
    this.tiles.forEach((tile,index)=>{tile.material=walls.includes(index)?this.mats.wall:(index%2?this.mats.tile:this.mats.tileAlt);tile.scale.y=walls.includes(index)?.15:.055;tile.position.y=walls.includes(index)?.05:-.055;});
    this.dog.traverse(o=>{if(o.isMesh)o.material=o.material});
  }
  resize(){
    if(this.disposed)return;const rect=this.canvas.getBoundingClientRect();if(!rect.width||!rect.height)return;
    const aspect=rect.width/rect.height,worldW=10.1,worldH=7.5,pad=1.15;
    const h=Math.max(worldH,worldW/aspect)*pad;this.camera.top=h/2;this.camera.bottom=-h/2;this.camera.left=-h*aspect/2;this.camera.right=h*aspect/2;this.camera.updateProjectionMatrix();
    this.renderer.setSize(rect.width,rect.height,false);
  }
  drawLoop(){if(this.disposed||!this.active)return;this.frame=requestAnimationFrame(()=>this.drawLoop());
    if(document.hidden)return;this.tick+=.016;
    if(!this.reduced){this.dog.position.y=.025+Math.sin(this.tick*1.55)*.025;this.fox.position.y=.02+Math.sin(this.tick*1.55+1)*.022;}
    this.renderer.render(this.scene,this.camera);
  }
  stats(){return {drawCalls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,geometries:this.renderer.info.memory.geometries,textures:this.renderer.info.memory.textures}}
  dispose(){if(this.disposed)return;this.suspend();this.disposed=true;
    this.scene?.traverse(o=>{if(o.geometry)this.owned.add(o.geometry);if(Array.isArray(o.material))o.material.forEach(m=>this.owned.add(m));else if(o.material)this.owned.add(o.material)});
    for(const item of this.owned)item.dispose?.();this.renderer?.dispose();this.renderer?.forceContextLoss();this.owned.clear();
  }
}
