import * as THREE from './vendor/three/three.module.min.js';
import {createModels} from './models.mjs?v=20261027-hillside-candidate2';

export class BurrowRenderer {
  constructor(container,{onProjection,onLost,onRestored,reduced=false}) {
    this.container=container;this.onProjection=onProjection;this.reduced=reduced;this.active=false;this.dirty=true;this.animations=[];this.residents=[];this.lastTime=0;
    this.models=createModels();
    this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
    this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.05;
    this.renderer.domElement.setAttribute('aria-hidden','true');container.prepend(this.renderer.domElement);
    this.scene=new THREE.Scene();this.camera=new THREE.OrthographicCamera(-4,4,4,-4,.1,60);
    this.camera.position.set(2.8,9.8,9.2);this.camera.lookAt(0,0,0);
    this.scene.add(new THREE.HemisphereLight(0xd7f2e5,0x4d3528,1.9));
    const sun=new THREE.DirectionalLight(0xffe2b0,2.7);sun.position.set(-3,8,4);sun.castShadow=true;
    sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-5,right:5,top:5,bottom:-5,near:.1,far:20});sun.shadow.bias=-.001;sun.shadow.normalBias=.035;this.scene.add(sun);
    this.board=new THREE.Group();this.scene.add(this.board);this.cells=Array(25).fill(null);
    this.highlight=new THREE.Mesh(new THREE.BoxGeometry(.97,.035,.97),new THREE.MeshBasicMaterial({color:0xffd987,transparent:true,opacity:.5,depthWrite:false}));this.highlight.visible=false;this.scene.add(this.highlight);
    this.particleGeometry=new THREE.BoxGeometry(.045,.045,.045);this.particleMaterial=new THREE.MeshBasicMaterial({color:0xf4d29b});
    this.particles=new THREE.InstancedMesh(this.particleGeometry,this.particleMaterial,24);this.particles.count=0;this.scene.add(this.particles);this.dummy=new THREE.Object3D();
    this.abort=new AbortController();
    this.renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();this.lost=true;cancelAnimationFrame(this.frame);onLost();},{signal:this.abort.signal});
    this.renderer.domElement.addEventListener('webglcontextrestored',()=>{this.lost=false;this.dirty=true;onRestored();this.wake();},{signal:this.abort.signal});
    this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(container);
  }
  thumbnails() {
    const oldSize=this.renderer.getSize(new THREE.Vector2());this.renderer.setSize(192,192,false);
    const s=new THREE.Scene();s.add(new THREE.HemisphereLight(0xffffff,0x7c6151,3));const l=new THREE.DirectionalLight(0xffe7ba,3);l.position.set(-3,5,4);s.add(l);
    const c=new THREE.OrthographicCamera(-.83,.83,.83,-.83,.1,10);c.position.set(1.7,2.1,2.8);c.lookAt(0,.35,0);
    const icons={};for(const type of ['hall','bed','pantry','garden','bridge','nursery','vent','brace','lantern']){const model=this.models.room(type==='lantern'?'hall':type,type==='lantern');s.add(model);this.renderer.render(s,c);icons[type]=this.renderer.domElement.toDataURL('image/png');s.remove(model);this.disposeInstances(model);}
    this.renderer.setSize(oldSize.x,oldSize.y,false);return icons;
  }
  disposeInstances(root) {root.traverse(n=>{if(n.isInstancedMesh)n.dispose();});}
  clear() {
    for(const child of [...this.board.children]){this.disposeInstances(child);this.board.remove(child);}
    this.cells.fill(null);this.animations=[];this.residents=[];this.particles.count=0;this.highlight.visible=false;this.container.setAttribute('aria-busy','false');
  }
  setRun(run,starlight=false) {
    this.clear();this.run=run;this.starlight=starlight;this.board.add(this.models.terrain(run.level.map));
    run.rooms.forEach((room,i)=>{if(room)this.setCell(i,room,false);});
    const at=run.level.map.indexOf('S'),rabbit=this.models.rabbit(.7);rabbit.position.set(at%5-2-.16,.12,Math.floor(at/5)-2+.16);this.board.add(rabbit);this.guide=rabbit;
    this.resize();this.dirty=true;this.wake();
  }
  setCell(at,type,animate=true) {
    if(this.cells[at]){this.disposeInstances(this.cells[at]);this.board.remove(this.cells[at]);this.animations=this.animations.filter(a=>a.at!==at);}
    this.cells[at]=null;
    if(type){const model=this.models.room(type,this.starlight);model.position.set(at%5-2,0,Math.floor(at/5)-2);this.board.add(model);this.cells[at]=model;
      if(animate&&!this.reduced){model.scale.y=.08;this.animations.push({at,model,start:performance.now()});this.burst={at,start:performance.now()};this.container.setAttribute('aria-busy','true');}}
    this.dirty=true;this.wake();
  }
  hover(at,valid=true) {
    this.highlight.visible=at!==null;this.highlight.material.color.set(valid?0xffd987:0xd97266);
    if(at!==null)this.highlight.position.set(at%5-2,.13,Math.floor(at/5)-2);
    this.dirty=true;this.wake();
  }
  celebrate() {
    this.residents=[];const entry=this.run.rooms.indexOf('entry');
    const pathTo=target=>{const queue=[[entry]],visited=new Set([entry]);while(queue.length){const path=queue.shift(),at=path.at(-1);if(at===target)return path;for(const n of [at-5,at+5,at%5?at-1:-1,at%5<4?at+1:-1])if(n>=0&&n<25&&this.run.rooms[n]&&!visited.has(n)){visited.add(n);queue.push([...path,n]);}}return [target];};
    this.run.rooms.forEach((type,at)=>{if(type==='bed'){const r=this.models.rabbit(.36,this.residents.length%2?'pink':'blue');this.board.add(r);this.residents.push({mesh:r,path:pathTo(at),start:performance.now()+this.residents.length*180});}});
    this.dirty=true;this.wake();
  }
  resize() {
    const w=this.container.clientWidth,h=this.container.clientHeight;if(w<1||h<1)return;
    this.renderer.setSize(w,h,false);const aspect=w/h;
    const height=Math.max(6.6,7.1/aspect),width=height*aspect;
    Object.assign(this.camera,{left:-width/2,right:width/2,top:height/2,bottom:-height/2});this.camera.updateProjectionMatrix();this.camera.updateMatrixWorld();
    const positions=Array.from({length:25},(_,at)=>{const v=new THREE.Vector3(at%5-2,.1,Math.floor(at/5)-2).project(this.camera);return{x:(v.x*.5+.5)*w,y:(-.5*v.y+.5)*h,size:Math.max(44,Math.min(66,w/width*.9))};});
    this.onProjection(positions);this.dirty=true;this.wake();
  }
  pick(clientX,clientY){
    const box=this.renderer.domElement.getBoundingClientRect();if(!box.width||!box.height)return null;
    const ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2((clientX-box.left)/box.width*2-1,1-(clientY-box.top)/box.height*2),this.camera);
    const hit=ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0),-.1),new THREE.Vector3());
    if(!hit)return null;const x=Math.round(hit.x)+2,z=Math.round(hit.z)+2;
    return x>=0&&x<5&&z>=0&&z<5?z*5+x:null;
  }
  setActive(value) {this.active=value;if(!value){cancelAnimationFrame(this.frame);this.frame=0;}else this.wake();}
  wake() {if(this.active&&!this.frame&&!this.lost)this.frame=requestAnimationFrame(t=>this.tick(t));}
  tick(time) {
    this.frame=0;if(!this.active||this.lost)return;
    let motion=false;
    this.animations=this.animations.filter(a=>{const p=Math.min(1,(time-a.start)/420);a.model.scale.y=p===1?1:1-Math.pow(1-p,3)*Math.cos(p*7);motion=true;return p<1;});
    if(!this.animations.length)this.container.setAttribute('aria-busy','false');
    if(this.burst){const t=(time-this.burst.start)/600;if(t<1&&!this.reduced){this.particles.count=24;for(let i=0;i<24;i++){const angle=i*2.399,spread=.2+t*.6;this.dummy.position.set(this.burst.at%5-2+Math.cos(angle)*spread,.2+Math.sin(t*Math.PI)*.6,Math.floor(this.burst.at/5)-2+Math.sin(angle)*spread);this.dummy.scale.setScalar(1-t);this.dummy.updateMatrix();this.particles.setMatrixAt(i,this.dummy.matrix);}this.particles.instanceMatrix.needsUpdate=true;motion=true;}else{this.particles.count=0;this.burst=null;this.dirty=true;}}
    for(const resident of this.residents){const t=this.reduced?resident.path.length:Math.max(0,(time-resident.start)/280),index=Math.min(resident.path.length-1,Math.floor(t)),a=resident.path[index],b=resident.path[Math.min(index+1,resident.path.length-1)],f=Math.min(1,t-index);resident.mesh.position.set(THREE.MathUtils.lerp(a%5-2,b%5-2,f),.2+(this.reduced?0:Math.sin(f*Math.PI)*.09),THREE.MathUtils.lerp(Math.floor(a/5)-2,Math.floor(b/5)-2,f)+.08);if(index<resident.path.length-1)motion=true;}
    if(this.dirty||motion){this.renderer.render(this.scene,this.camera);this.dirty=false;}
    if(motion)this.wake();
  }
  dispose(){this.setActive(false);this.abort.abort();this.resizeObserver.disconnect();this.clear();this.highlight.geometry.dispose();this.highlight.material.dispose();this.particleGeometry.dispose();this.particleMaterial.dispose();this.particles.dispose();this.models.dispose();this.renderer.dispose();this.renderer.forceContextLoss();this.renderer.domElement.remove();}
}
