import * as THREE from '../animal-skyspire-drop/vendor/three/three.module.min.js';

// Pinned r180. Simulation coordinates remain authoritative; this renderer has
// no timers, input, saves, collisions or independent animation loop.
export class LionDefense3D {
  constructor() {
    this.resources=new Set();this.actors=new Map();this.models=new Map();this.dead=false;
    try {
      this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});
      this.renderer.setPixelRatio(1);
      this.renderer.outputColorSpace=THREE.SRGBColorSpace;
      this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=.95;
      this.scene=new THREE.Scene();this.scene.background=new THREE.Color('#112935');
      this.camera=new THREE.OrthographicCamera(0,950,0,-1688,.1,4000);
      this.camera.position.z=1800;this.camera.lookAt(0,0,0);
      this.scene.add(new THREE.HemisphereLight('#fff0c8','#193444',1.1));
      const light=new THREE.DirectionalLight('#ffe8b3',2.5);light.position.set(-700,900,700);this.scene.add(light);
      const rim=new THREE.DirectionalLight('#93dfff',.8);rim.position.set(700,-400,500);this.scene.add(rim);
      this.shadowMaterial=this.own(new THREE.MeshBasicMaterial({color:'#061c25',transparent:true,opacity:.4,depthWrite:false}));
      this.shadowGeometry=this.own(new THREE.CircleGeometry(.5,20));
      this.material=this.own(new THREE.MeshStandardMaterial({vertexColors:true,roughness:.65,metalness:.12}));
      this.unit=this.own(new THREE.BoxGeometry(1,1,1));
      this.gold=this.own(new THREE.MeshStandardMaterial({color:'#ffda71',emissive:'#805a10',emissiveIntensity:.8}));
      this.red=this.own(new THREE.MeshStandardMaterial({color:'#ff6760',emissive:'#951b23',emissiveIntensity:.9}));
      this.cyan=this.own(new THREE.MeshStandardMaterial({color:'#73ecff',emissive:'#126980',emissiveIntensity:.6}));
      this.ringGeometry=this.own(new THREE.RingGeometry(.8,1,32));
      this.shotPool=[];this.rings=[];
      for(let i=0;i<160;i++) {const mesh=new THREE.Mesh(this.unit,this.gold);mesh.visible=false;this.scene.add(mesh);this.shotPool.push(mesh);}
      for(let i=0;i<24;i++){const mesh=new THREE.Mesh(this.ringGeometry,this.gold);mesh.visible=false;this.scene.add(mesh);this.rings.push(mesh);}
      this.contextLost=false;
      this.onLost=e=>{e.preventDefault();this.contextLost=true;};
      this.renderer.domElement.addEventListener('webglcontextlost',this.onLost);
    } catch(error) {this.dispose();throw error;}
  }
  own(resource){this.resources.add(resource);return resource;}
  // Merge authored cuboids into one vertex-colour mesh per actor, rather than
  // issuing a draw call for every mane, eye, tooth, horn or armor block.
  geometry(parts){
    const source=this.unit.toNonIndexed(),p=[],n=[],c=[];
    for(const [x,y,z,w,h,d,color,angle=0] of parts){
      const matrix=new THREE.Matrix4().compose(new THREE.Vector3(x,y,z),new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1),angle),new THREE.Vector3(w,h,d));
      const normals=new THREE.Matrix3().getNormalMatrix(matrix),tint=new THREE.Color(color);
      for(let i=0;i<source.attributes.position.count;i++){
        const point=new THREE.Vector3().fromBufferAttribute(source.attributes.position,i).applyMatrix4(matrix);
        const normal=new THREE.Vector3().fromBufferAttribute(source.attributes.normal,i).applyMatrix3(normals).normalize();
        p.push(point.x,point.y,point.z);n.push(normal.x,normal.y,normal.z);c.push(tint.r,tint.g,tint.b);
      }
    }
    source.dispose();const g=new THREE.BufferGeometry();
    g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(n,3));g.setAttribute('color',new THREE.Float32BufferAttribute(c,3));g.computeBoundingSphere();return this.own(g);
  }
  model(kind){
    if(this.models.has(kind))return this.models.get(kind);
    const colors={lion:'#eaa63d',boar:'#b57a6d',hyena:'#b49b66',rhino:'#728d9e',buffalo:'#775c61',hawk:'#bd906e',bear:'#98683f',tiger:'#ed9748',crocodile:'#599e6b'};
    const fur=colors[kind]||colors.boar,parts=[];
    const box=(x,y,z,w,h,d,color,angle=0)=>parts.push([x,y,z,w,h,d,color,angle]);
    box(0,-.14,0,.58,.52,.4,fur);box(0,.25,.02,.62,.55,.45,fur);
    for(const side of [-1,1]){
      box(side*.22,-.49,.06,.22,.2,.36,kind==='lion'?'#d29831':fur);
      box(side*.37,-.15,.04,.19,.38,.26,fur,side*.09);
      box(side*.24,.59,.01,.2,.2,.21,fur);
      box(side*.16,.31,.26,.17,.16,.06,'#fff3da');box(side*.16,.3,.305,.085,.10,.04,'#182936');
      box(side*.16,.43,.29,.21,.055,.07,'#644227',side*.08);
    }
    box(0,.12,.33,kind==='crocodile'?.4:.35,.2,kind==='crocodile'?.4:.21,kind==='lion'?'#ffe2a0':'#c7b59a');
    box(0,.18,kind==='crocodile'?.56:.455,.15,.065,.04,'#213442');
    if(kind==='lion'){
      for(let i=0;i<5;i++)for(const side of [-1,1]){
        box(side*.41,.03+i*.13,-.01,.19,.18,.28,i%2?'#fbd46b':'#cf6d28');
        box(-.32+i*.16,.69,-.01,.2,.2,.29,i%2?'#ffdd73':'#e8852b');
      }
      box(0,-.12,.235,.48,.27,.08,'#176c88');box(0,-.12,.29,.17,.17,.08,'#ffdc70',Math.PI/4);
      box(0,.78,.03,.18,.17,.22,'#ffe38c');
    }
    if(kind==='rhino')box(0,.2,.58,.13,.28,.13,'#f0e8d0',-.1);
    if(kind==='boar'||kind==='buffalo')for(const side of [-1,1])box(side*.28,kind==='boar'?.03:.55,.3,.09,.26,.12,'#f5e5bc',side*.35);
    if(kind==='hawk'){
      for(const side of [-1,1])for(let i=0;i<3;i++)box(side*(.4+i*.13),.04+i*.06,0,.17,.42-i*.06,.16,i%2?'#65493b':'#d6ad77',side*.3);
      box(0,.14,.43,.18,.22,.25,'#f2ba46');
    }
    if(kind==='tiger'||kind==='hyena')for(const side of [-1,1])for(let i=0;i<3;i++)box(side*.28,-.26+i*.18,.22,.075,.055,.03,'#463d35',side*.25);
    if(kind==='crocodile')for(let i=0;i<4;i++)box(0,-.36-i*.08,-.06-i*.07,.19-i*.03,.15,.16,'#396e55');
    const geometry=this.geometry(parts);this.models.set(kind,geometry);return geometry;
  }
  makeArena(w,h,wall){
    if(this.arena){this.scene.remove(this.arena);this.arena.geometry.dispose();this.resources.delete(this.arena.geometry);}
    const p=[[w/2,-h/2,-90,w,h,45,'#102e39']];
    for(let x=0;x<8;x++)for(let y=0;y<18;y++)p.push([(x+.5)*w/8,-(y+.5)*h/18,-59,w/8-3,h/18-3,12,(x+y)%3?'#24404a':'#294852']);
    for(const side of [0,1]) {
      const x=side?w-36:36;
      p.push([x,-h/2,-28,65,h,48,'#214544'],[side?w-76:76,-h/2,-20,8,h,12,'#8b7950']);
      for(let i=0;i<9;i++)p.push([x,-(i+.5)*h/9,4,38,64,32,i%2?'#315b48':'#3d684e']);
    }
    for(let x=0;x<12;x++){
      p.push([(x+.5)*w/12,-wall,-4,w/12-3,58,110,'#718b91']);
      if(x%2===0)p.push([(x+.5)*w/12,-wall+22,27,w/12-12,25,26,'#cfb57b']);
    }
    for(const side of [0,1])for(const ratio of [.12,.39,.65]){
      const x=side?w-22:22,y=-h*ratio;
      p.push([x,y,-20,38,70,100,'#526f76'],[x,y+25,40,46,12,16,'#c6a965'],[x,y+25,58,16,16,24,'#ffc76a']);
    }
    this.arena=new THREE.Mesh(this.geometry(p),this.material);this.scene.add(this.arena);
  }
  render(state,w,h,wall,cssWidth,cssHeight){
    if(this.dead||this.contextLost)throw Error('3D context unavailable');
    if(this.w!==w||this.h!==h){this.w=w;this.h=h;this.camera.left=0;this.camera.right=w;this.camera.top=0;this.camera.bottom=-h;this.camera.updateProjectionMatrix();this.makeArena(w,h,wall);}
    const scale=Math.min(devicePixelRatio||1,1.5,1200/Math.max(cssWidth,cssHeight));
    const rw=Math.max(1,Math.round(cssWidth*scale)),rh=Math.max(1,Math.round(cssHeight*scale));
    if(rw!==this.rw||rh!==this.rh){this.rw=rw;this.rh=rh;this.renderer.setSize(rw,rh,false);}
    const records=[{key:'hero',kind:'lion',x:state.hero.x,y:state.hero.y,size:state.hero.width*1.25,hp:1,maxHp:1},...state.enemies.filter(e=>e.hp>0).map(e=>({key:e,kind:e.type.id,...e}))];
    const live=new Set();
    for(const record of records){
      live.add(record.key);let actor=this.actors.get(record.key);
      if(!actor){actor=new THREE.Group();const model=new THREE.Mesh(this.model(record.kind),this.material);model.rotation.set(.38,-.38,0);actor.add(model);const shadow=new THREE.Mesh(this.shadowGeometry,this.shadowMaterial);shadow.position.set(.12,-.25,-.4);shadow.scale.set(1.15,.7,1);actor.add(shadow);this.actors.set(record.key,actor);this.scene.add(actor);}
      const bob=state.running?Math.sin(state.time*7+record.x)*record.size*.018:0;
      actor.position.set(record.x,-record.y+bob,10);actor.scale.setScalar(record.size*1.02);actor.rotation.x=0;
      actor.rotation.z=record.isBoss?0:Math.sin(state.time*6+record.x)*.035;
    }
    for(const [key,actor] of this.actors)if(!live.has(key)){this.scene.remove(actor);this.actors.delete(key);}
    let index=0;
    for(const [items,material] of [[state.projectiles,this.gold],[state.bossProjectiles,this.red]])for(const shot of items){
      if(index>=this.shotPool.length)break;const mesh=this.shotPool[index++];mesh.visible=true;mesh.material=material;
      mesh.position.set(shot.x,-shot.y,45);const s=Math.max(9,shot.size*.65);mesh.scale.set(s,s*1.7,s);mesh.rotation.z=shot.rotation||0;
    }
    for(;index<this.shotPool.length;index++)this.shotPool[index].visible=false;
    index=0;
    for(const enemy of state.enemies){
      if(index>=20)break;
      if(enemy.isBoss&&enemy.bossAttackTimer<.65||enemy.dashBoost>1){const ring=this.rings[index++];ring.visible=true;ring.material=this.red;ring.position.set(enemy.x,-enemy.y,2);ring.scale.setScalar(enemy.size*.6);}
    }
    if(state.roarPulse>0){const ring=this.rings[index++];ring.visible=true;ring.material=this.cyan;ring.position.set(state.hero.x,-wall,20);ring.scale.setScalar(80+(1-state.roarPulse/.5)*210);}
    for(;index<this.rings.length;index++)this.rings[index].visible=false;
    this.renderer.render(this.scene,this.camera);
    return this.renderer.domElement;
  }
  stats(){return {geometries:this.renderer.info.memory.geometries,textures:this.renderer.info.memory.textures,calls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,actors:this.actors.size};}
  dispose(){if(this.dead)return;this.dead=true;this.renderer?.domElement.removeEventListener('webglcontextlost',this.onLost);for(const r of this.resources)r.dispose();this.resources.clear();this.models.clear();this.actors.clear();this.scene?.clear();this.renderer?.dispose();this.renderer?.forceContextLoss();}
}
