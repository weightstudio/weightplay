import * as THREE from './vendor/three/three.module.min.js';

export class Meadow3D {
  constructor(canvas){
    this.canvas=canvas;this.scene=new THREE.Scene();
    this.renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;
    this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.4;
    this.camera=new THREE.OrthographicCamera(-5,5,5,-5,.1,100);
    this.camera.position.set(3,13,8);this.camera.lookAt(3,0,3);
    this.scene.add(new THREE.HemisphereLight(0xc5e9ff,0x54786d,3));
    const sun=new THREE.DirectionalLight(0xffdf9e,4);sun.position.set(-2,9,4);this.scene.add(sun);
    this.materials=new Map();this.geometries=new Set();this.group=new THREE.Group();this.scene.add(this.group);
    this.rotationGroups=[];this.receivers=[];this.disposed=false;
  }
  mat(color,metalness=.15,emissive=0){
    const key=`${color}/${metalness}/${emissive}`;
    if(!this.materials.has(key))this.materials.set(key,new THREE.MeshStandardMaterial({color,metalness,roughness:.34,emissive,emissiveIntensity:1}));
    return this.materials.get(key);
  }
  geo(g){this.geometries.add(g);return g;}
  mesh(g,m,x,y,z,parent=this.group){const o=new THREE.Mesh(this.geo(g),m);o.position.set(x,y,z);parent.add(o);return o;}
  cylinder(r,h,x,y,z,color,parent=this.group,vertices=32){return this.mesh(new THREE.CylinderGeometry(r,r,h,vertices),this.mat(color,.65),x,y,z,parent);}
  build(level){
    this.level=level;
    this.mesh(new THREE.BoxGeometry(8,.35,8),this.mat(0x102d35),3,-.34,3);
    this.mesh(new THREE.BoxGeometry(7.75,.08,7.75),this.mat(0xaa8551,.75),3,-.13,3);
    const tiles=new THREE.InstancedMesh(this.geo(new THREE.BoxGeometry(.965,.15,.965)),this.mat(0xffffff,.05),49);
    const dummy=new THREE.Object3D();
    for(let y=0;y<7;y++)for(let x=0;x<7;x++){dummy.position.set(x,-.06,y);dummy.updateMatrix();tiles.setMatrixAt(y*7+x,dummy.matrix);tiles.setColorAt(y*7+x,new THREE.Color((x+y)%2?0x305e56:0x386861));}
    this.group.add(tiles);
    const gold=this.mat(0xe8b768,.38),silver=this.mat(0xc8f1ff,.2,0x163e4c),base=this.mat(0x183641,.2);
    level.mirrors.forEach((p,i)=>{
      this.cylinder(.39,.12,p.x,.08,p.y,0xb08a4d);
      this.cylinder(.32,.14,p.x,.2,p.y,0x193c43);
      const g=new THREE.Group();g.position.set(p.x,.29,p.y);this.group.add(g);this.rotationGroups.push(g);
      this.mesh(new THREE.BoxGeometry(.95,.34,.08),gold,0,.06,0,g);
      this.mesh(new THREE.BoxGeometry(.8,.27,.095),silver,0,.065,0,g);
      this.cylinder(.065,.4,-.43,.06,0,0xffd492,g,12);this.cylinder(.065,.4,.43,.06,0,0xffd492,g,12);
      if(level.prisms.includes(i))this.mesh(new THREE.OctahedronGeometry(.14),this.mat(0xc9a5ff,.3,0x48267a),0,.38,0,g);
    });
    level.targets.forEach(([x,z],i)=>{
      this.cylinder(.3,.12,x,.08,z,0xc6a05b);
      this.cylinder(.22,.2,x,.24,z,0x193e43);
      const crystal=this.mesh(new THREE.OctahedronGeometry(.22),this.mat(0x598789,.4),x,.51,z);
      crystal.scale.y=1.5;
      const ring=this.mesh(new THREE.TorusGeometry(.33,.028,8,32),gold,x,.12,z);ring.rotation.x=-Math.PI/2;
      this.receivers.push({crystal,ring});
    });
    level.walls.forEach(([x,z])=>{
      this.mesh(new THREE.BoxGeometry(.8,.54,.8),base,x,.28,z);
      this.mesh(new THREE.BoxGeometry(.88,.09,.88),this.mat(0x5b7470),x,.59,z);
    });
    level.gates.flat().forEach(([x,z])=>{
      this.cylinder(.37,.1,x,.1,z,0xa97de0);
      const torus=this.mesh(new THREE.TorusGeometry(.28,.06,8,32),this.mat(0xd4a9ff,.35,0x623798),x,.17,z);torus.rotation.x=Math.PI/2;
      this.cylinder(.2,.035,x,.14,z,0x543b93);
    });
    const [sx,sz,d]=level.source;
    this.cylinder(.3,.15,sx,.12,sz,0xebbd65);
    this.mesh(new THREE.OctahedronGeometry(.23),this.mat(0xffe4a3,.3,0xd68a2b),sx,.42,sz);
    const arrow=this.mesh(new THREE.ConeGeometry(.13,.3,3),gold,sx,.26,sz);arrow.rotation.z=-Math.PI/2;arrow.rotation.y=-d*Math.PI/2;
    this.beams=new THREE.InstancedMesh(this.geo(new THREE.CylinderGeometry(.038,.038,1,6)),new THREE.MeshBasicMaterial({color:0xffe2a1}),512);
    this.materials.set('beam',this.beams.material);this.group.add(this.beams);
    // Small garden accents remain outside playable cells and share one instanced mesh.
    const leaves=new THREE.InstancedMesh(this.geo(new THREE.ConeGeometry(.13,.36,5)),this.mat(0x52a388),24);
    for(let i=0;i<24;i++){const side=i%4,t=(Math.floor(i/4)+.5)*1.15-.4;dummy.position.set(side===0?-.8:side===1?6.8:t,.13,side===2?-.8:side===3?6.8:t);dummy.rotation.set(0,i,Math.sin(i)*.18);dummy.updateMatrix();leaves.setMatrixAt(i,dummy.matrix);}
    this.group.add(leaves);
  }
  update(angles,result){
    this.rotationGroups.forEach((g,i)=>g.rotation.y=angles[i]===0?Math.PI/4:-Math.PI/4);
    this.receivers.forEach(({crystal,ring},i)=>{const on=result.lit.includes(i);crystal.material=on?this.mat(0xacf8d5,.25,0x29975c):this.mat(0x598789,.4);ring.material=on?this.mat(0xb9ffd8,.3,0x27854b):this.mat(0xe8b768,.78);});
    const dummy=new THREE.Object3D(),up=new THREE.Vector3(0,1,0);
    this.beams.count=Math.min(512,result.segments.length);
    result.segments.slice(0,512).forEach(([[x,z],[nx,nz]],i)=>{const a=new THREE.Vector3(x,.34,z),b=new THREE.Vector3(nx,.34,nz),v=b.clone().sub(a);dummy.position.copy(a).add(b).multiplyScalar(.5);dummy.quaternion.setFromUnitVectors(up,v.clone().normalize());dummy.scale.set(1,v.length(),1);dummy.updateMatrix();this.beams.setMatrixAt(i,dummy.matrix);});
    this.beams.instanceMatrix.needsUpdate=true;this.render();
  }
  resize(){
    if(this.disposed)return;
    const {width,height}=this.canvas.getBoundingClientRect();if(!width||!height)return;
    this.renderer.setSize(width,height,false);
    const aspect=width/height,half=Math.max(4.8,4.8/aspect);
    this.camera.left=-half*aspect;this.camera.right=half*aspect;this.camera.top=half;this.camera.bottom=-half;this.camera.updateProjectionMatrix();this.render();
  }
  point(x,z,height=.8){const v=new THREE.Vector3(x,height,z).project(this.camera);return{x:(v.x+1)*.5,y:(1-v.y)*.5};}
  pick(clientX,clientY){
    const r=this.canvas.getBoundingClientRect(),ray=new THREE.Raycaster();
    ray.setFromCamera(new THREE.Vector2((clientX-r.left)/r.width*2-1,1-(clientY-r.top)/r.height*2),this.camera);
    const p=ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0),-.3),new THREE.Vector3());
    return p?this.level.mirrors.findIndex(m=>Math.hypot(m.x-p.x,m.y-p.z)<.6):-1;
  }
  render(){if(!this.disposed)this.renderer.render(this.scene,this.camera);}
  stats(){return this.disposed?{geometries:0,textures:0,calls:0,triangles:0,renderers:0}:{...this.renderer.info.memory,...this.renderer.info.render,renderers:1};}
  dispose(){
    if(this.disposed)return;this.disposed=true;
    this.scene.traverse(o=>{if(o.isInstancedMesh)o.dispose();});
    this.geometries.forEach(g=>g.dispose());this.materials.forEach(m=>m.dispose());
    this.renderer.setAnimationLoop(null);this.renderer.dispose();this.renderer.forceContextLoss();
    this.scene.clear();this.geometries.clear();this.materials.clear();this.rotationGroups=[];this.receivers=[];
  }
}
