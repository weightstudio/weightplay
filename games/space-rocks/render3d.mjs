import * as THREE from './vendor/three/three.module.min.js';

// Presentation only. Simulation positions, damage and outcomes stay in the campaign.
export class SpaceRocks3D {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true, powerPreference:'low-power'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-195,195,300,-300,.1,2000);
    this.camera.position.set(0,0,900);
    this.scene.add(new THREE.HemisphereLight(0xb8f7ff,0x283050,3));
    const key = new THREE.DirectionalLight(0xffe0b4,4);
    key.position.set(-100,180,300); this.scene.add(key);
    const rim = new THREE.DirectionalLight(0x77baff,3);
    rim.position.set(150,-100,130); this.scene.add(rim);
    this.resources = new Set(); this.materials = new Map();
    this.box = this.own(new THREE.BoxGeometry(1,1,1));
    this.gem = this.own(new THREE.OctahedronGeometry(1,0));
    this.disc = this.own(new THREE.TorusGeometry(1,.025,4,48));
    this.live = new Map(); this.pool = new Map();
    this.ship = this.makeShip(); this.scene.add(this.ship);
    this.beacon = this.makeBeacon(); this.scene.add(this.beacon);
    this.shield = this.ring('#83f5f2'); this.scene.add(this.shield);
    this.pulse = this.ring('#c5a6ff'); this.scene.add(this.pulse);
    this.gravity = Array.from({length:3},()=>{const mesh=this.ring('#a691ef');this.scene.add(mesh);return mesh;});
    this.mines = Array.from({length:3},()=>{const group=new THREE.Group();this.part(group,0,0,0,15,15,9,'#9c416b');this.part(group,0,0,7,6,6,5,'#ff738f',true);const ring=this.ring('#f57a94');ring.scale.setScalar(28);group.add(ring);this.scene.add(group);return group;});
    this.bullets = this.instances(this.box,'#aeffff',128,true);
    this.hostile = this.instances(this.gem,'#ff7896',128,true);
    this.gems = this.instances(this.gem,'#7ffad8',128,true);
    this.bits = this.instances(this.box,'#c9ffff',160,true);
    this.dummy = new THREE.Object3D(); this.color = new THREE.Color();
    this.laser = new THREE.Mesh(this.box,this.material('#ffc786',true));this.scene.add(this.laser);
    this.healthBack = new THREE.Mesh(this.box,this.material('#293f59'));this.scene.add(this.healthBack);
    this.healthFill = new THREE.Mesh(this.box,this.material('#ffcc8a',true));this.scene.add(this.healthFill);
    this.cargo=this.makePod();this.scene.add(this.cargo);this.cargo.scale.setScalar(.55);
    const guideGeometry=this.own(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3()]));
    this.guide=new THREE.Line(guideGeometry,this.own(new THREE.LineBasicMaterial({color:'#78efc7'})));this.scene.add(this.guide);
    this.closed=false;
  }
  own(resource) { this.resources.add(resource); return resource; }
  material(color,glow=false) {
    const key=color+glow;
    if(!this.materials.has(key))this.materials.set(key,this.own(new THREE.MeshStandardMaterial({color,roughness:.52,metalness:.38,flatShading:true,emissive:glow?color:'#000000',emissiveIntensity:glow?.9:0})));
    return this.materials.get(key);
  }
  part(group,x,y,z,w,h,d,color,glow=false) {
    const mesh=new THREE.Mesh(this.box,this.material(color,glow));
    mesh.position.set(x,y,z); mesh.scale.set(w,h,d); group.add(mesh); return mesh;
  }
  crystal(group,x,y,z,size,color='#b68aff') {
    const mesh=new THREE.Mesh(this.gem,this.material(color,true));
    mesh.position.set(x,y,z);mesh.scale.set(size*.6,size*.6,size);mesh.rotation.set(.2,.45,.2);group.add(mesh);return mesh;
  }
  ring(color) { return new THREE.Mesh(this.disc,this.material(color,true)); }
  makeShip() {
    const g=new THREE.Group();
    // Teal/gold modular craft; square rhino head, box muzzle, gear horn and goggles.
    this.part(g,-2,0,0,38,24,10,'#20687b');
    this.part(g,4,0,7,30,20,5,'#c9984d');
    this.part(g,20,0,2,16,17,8,'#237d8f');
    this.part(g,29,0,3,5,11,4,'#88f3f3',true);
    for(const side of[-1,1]) {
      const wing=this.part(g,-7,side*19,-2,29,12,6,'#278b98');wing.rotation.z=side*.22;
      this.part(g,-13,side*22,1,16,8,8,'#d5a24c');
      this.part(g,-22,side*22,2,5,7,6,'#6debff',true);
      this.part(g,8,side*14,7,8,6,5,'#ada6bc'); // cuboid paws
    }
    this.part(g,-2,0,12,20,17,12,'#a1a1b8');
    this.part(g,9,0,13,11,15,9,'#b9b0c3');
    for(const side of[-1,1]) {
      this.part(g,-10,side*9,18,7,6,4,'#9896b0');
      this.part(g,-9,side*9,21,4,3,1,'#debbbd');
      this.part(g,0,side*5,20,8,6,3,'#cda756');
      this.part(g,1,side*5,22,5,4,1,'#58bfdd',true);
      this.part(g,13,side*5,18,2,2,1,'#342e48');
    }
    // Stepped, cubic gear horn, rather than a smooth cone.
    this.part(g,10,0,21,7,7,5,'#e5bb62');
    this.part(g,13,0,26,5,5,5,'#f1d289');
    this.part(g,15,0,30,3,3,4,'#ffe7a3');
    g.scale.setScalar(.8); return g;
  }
  makeRock(size) {
    const g=new THREE.Group(),r=size===2?26:15;
    this.part(g,0,0,0,r*1.5,r*1.4,r,'#36455e');
    const points=[[-.65,.18,.1],[.6,-.2,.06],[-.18,-.55,.25],[.2,.6,.1]];
    for(const [x,y,z]of points){const b=this.part(g,x*r,y*r,z*r,r*.85,r*.8,r*.75,'#53607a');b.rotation.z=x*.4;}
    this.crystal(g,r*.15,r*.12,r*.65,r*.65);
    this.crystal(g,-r*.42,-r*.24,r*.48,r*.4,'#d2a4fa');
    return g;
  }
  makeSentry(guard=false) {
    const g=new THREE.Group();
    this.part(g,0,0,0,24,24,10,guard?'#6959a1':'#a65c6d');
    for(let i=0;i<4;i++){const a=i*Math.PI/2;const arm=this.part(g,Math.cos(a)*18,Math.sin(a)*18,-2,13,8,6,'#344d6b');arm.rotation.z=a;}
    this.crystal(g,0,0,10,10,guard?'#ba9dff':'#ffa37e');
    this.part(g,0,0,17,5,5,4,'#fff0c4',true);return g;
  }
  makePod() {
    const g=new THREE.Group();this.part(g,0,0,0,23,27,8,'#2f7c80');
    this.part(g,0,0,7,17,18,7,'#8de7cf');this.part(g,0,0,12,8,10,2,'#dcfff0',true);
    for(const side of[-1,1])this.part(g,side*12,0,0,4,31,5,'#d5b670');return g;
  }
  makeBeacon() {
    const g=new THREE.Group();
    for(let i=0;i<4;i++){const a=i*Math.PI/2;const part=this.part(g,Math.cos(a)*24,Math.sin(a)*24,-7,14,6,5,'#3d8b8d');part.rotation.z=a;}
    this.crystal(g,0,0,0,13,'#80f4c9');const ring=this.ring('#7ef5d2');ring.scale.setScalar(33);g.add(ring);return g;
  }
  makeBoss(type) {
    const g=new THREE.Group();
    const colors={shield:'#8c76c5',charger:'#b67261',summoner:'#549c88',laser:'#528ba9',anchor:'#71668a',finale:'#b99659'};
    this.part(g,0,0,0,56,52,18,'#283c55');
    const arms=type==='summoner'?6:4;
    for(let i=0;i<arms;i++) {
      const a=i/arms*Math.PI*2,x=Math.cos(a),y=Math.sin(a);
      const arm=this.part(g,x*30,y*30,2,type==='charger'?30:24,14,14,colors[type]);arm.rotation.z=a;
      this.part(g,x*40,y*40,10,7,7,6,'#eacb88');
      if(type==='summoner'||type==='finale')this.crystal(g,x*32,y*32,14,8,'#ffa586');
    }
    this.part(g,0,0,14,29,29,8,'#d5b56f').rotation.z=Math.PI/4;
    this.crystal(g,0,0,27,19,type==='laser'?'#8ceaff':'#f49eb9');
    if(type==='shield'||type==='anchor'||type==='finale'){const rim=this.ring(type==='anchor'?'#a691ef':'#ac9aee');rim.scale.setScalar(48);rim.position.z=5;g.add(rim);if(type!=='anchor')g.userData.immuneRing=rim;}
    return g;
  }
  instances(geometry,color,count,glow) {
    const mesh=new THREE.InstancedMesh(geometry,this.material(color,glow),count);mesh.count=0;mesh.frustumCulled=false;this.scene.add(mesh);this.own(mesh);return mesh;
  }
  resize(w,h) {
    this.w=w;this.h=h;this.camera.left=-w/2;this.camera.right=w/2;this.camera.top=h/2;this.camera.bottom=-h/2;this.camera.updateProjectionMatrix();this.renderer.setSize(w,h,false);
  }
  place(group,entity,z=0) { group.position.set(entity.x-this.w/2,this.h/2-entity.y,z); }
  group(entity,type) {
    let g=this.live.get(entity);
    if(!g){g=this.pool.get(type)?.pop()||this.create(type);g.userData.kind=type;g.visible=true;this.live.set(entity,g);this.scene.add(g);}
    this.place(g,entity);return g;
  }
  create(type) {return type.startsWith('boss:')?this.makeBoss(type.slice(5)):type==='pod'?this.makePod():type==='guard'?this.makeSentry(true):type==='sentry'?this.makeSentry():this.makeRock(Number(type.slice(-1)));}
  writeInstances(mesh,items,kind) {
    const count=Math.min(items.length,mesh.instanceMatrix.count);mesh.count=count;
    for(let i=0;i<count;i++){const o=items[i],d=this.dummy;d.position.set(o.x-this.w/2,this.h/2-o.y,kind==='bit'?8:20);d.rotation.set(0,0,kind==='bullet'?-Math.atan2(o.vy,o.vx):kind==='gem'?.5:0);d.scale.set(kind==='bullet'?16:kind==='gem'?7:kind==='bit'?3:5,kind==='bullet'?3:kind==='gem'?7:kind==='bit'?3:5,kind==='gem'?10:3);d.updateMatrix();mesh.setMatrixAt(i,d.matrix);if(kind==='bit'){this.color.set(o.color);mesh.setColorAt(i,this.color);}}
    mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;
  }
  render(r,reduced=false) {
    const entities=new Set([...r.rocks,...r.pods.filter(p=>!p.dead),...(r.boss?[r.boss]:[])]);
    for(const [entity,g]of this.live)if(!entities.has(entity)){this.live.delete(entity);g.visible=false;const type=g.userData.kind;if(!this.pool.has(type))this.pool.set(type,[]);this.pool.get(type).push(g);}
    for(const o of r.rocks){const g=this.group(o,o.type==='rock'?`rock:${o.size}`:o.type);g.rotation.set(.1, .12, -o.spin);g.scale.setScalar(o.flash>0?1.06:1);}
    for(const o of r.pods)if(!o.dead){const g=this.group(o,'pod');g.rotation.z=.1*Math.sin(r.time);}
    this.laser.visible=false;this.healthBack.visible=this.healthFill.visible=Boolean(r.boss);
    if(r.boss){const b=r.boss,g=this.group(b,`boss:${r.stage.threat}`);g.rotation.z=-b.a;g.scale.setScalar(b.flash>0?1.04:1);if(g.userData.immuneRing)g.userData.immuneRing.visible=r.rocks.some(o=>o.type==='guard');
      this.healthBack.position.set(b.x-this.w/2,this.h/2-b.y+58,40);this.healthBack.scale.set(84,6,2);
      this.healthFill.position.copy(this.healthBack.position);this.healthFill.position.x-=42*(1-b.hp/b.max);this.healthFill.position.z=42;this.healthFill.scale.set(84*b.hp/b.max,5,2);
      const cycle=b.timer%6,type=r.stage.threat;
      if((['charger','finale'].includes(type)&&cycle<1)||(type==='laser'&&cycle<2.7)){
        const length=Math.hypot(this.w,this.h);this.laser.visible=true;this.laser.rotation.z=-b.aim;this.laser.position.set(b.x-this.w/2+Math.cos(b.aim)*length/2,this.h/2-b.y-Math.sin(b.aim)*length/2,-2);this.laser.scale.set(length,type==='laser'&&cycle>2?16:4,1);this.laser.material=this.material(type==='laser'&&cycle>2?'#ff849a':'#ffc786',true);
      }
    }
    this.place(this.ship,r.ship,10);this.ship.rotation.set(0,0,-r.ship.a);this.ship.visible=!(r.invincible>0&&!reduced&&Math.floor(r.time*14)%2);
    this.place(this.shield,r.ship,18);this.shield.scale.setScalar(32);this.shield.visible=r.shield>0;
    const wave=r.rings.at(-1);this.pulse.visible=Boolean(wave);if(wave){this.place(this.pulse,wave,20);this.pulse.scale.setScalar(Math.max(1,reduced?wave.r*.6:wave.r*(1-wave.life/.45)));}
    this.beacon.visible=r.stage.kind==='rescue';this.beacon.position.set(0,0,-5);this.beacon.rotation.z=reduced?0:r.time*.2;
    this.cargo.visible=this.guide.visible=r.carrying;
    if(r.carrying){this.cargo.position.set(r.ship.x-this.w/2-22,this.h/2-r.ship.y-22,20);const attribute=this.guide.geometry.attributes.position;attribute.setXYZ(0,r.ship.x-this.w/2,this.h/2-r.ship.y,0);attribute.setXYZ(1,0,0,0);attribute.needsUpdate=true;}
    this.gravity.forEach((g,i)=>{g.visible=r.stage.field==='gravity';g.position.set(0,0,-15);g.scale.set((i+1)*35,(i+1)*22,1);});
    this.mines.forEach((g,i)=>{g.visible=r.stage.field==='mines';g.position.set(Math.cos(i*Math.PI/2)*this.w*.34,-Math.sin(i*Math.PI/2)*this.h*.34,0);g.scale.setScalar(Math.sin(r.time*1.5+i)>0?1:.8);});
    this.writeInstances(this.bullets,r.bullets,'bullet');this.writeInstances(this.hostile,r.hostile,'hostile');this.writeInstances(this.gems,[...r.gems,...r.flights.map(f=>{const k=1-f.life/.45;return {x:f.x+(this.w/2-f.x)*k,y:f.y*(1-k)};})],'gem');this.writeInstances(this.bits,r.particles,'bit');
    this.renderer.render(this.scene,this.camera);
    this.canvas.dataset.renderCalls=String(this.renderer.info.render.calls);
  }
  stats() {return {threeRevision:THREE.REVISION,calls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,geometries:this.renderer.info.memory.geometries,textures:this.renderer.info.memory.textures,live:this.live.size,pooled:[...this.pool.values()].reduce((n,a)=>n+a.length,0)};}
  dispose() {if(this.closed)return;this.closed=true;for(const r of this.resources)r.dispose?.();this.live.clear();this.pool.clear();this.scene.clear();this.renderer.dispose();}
}
