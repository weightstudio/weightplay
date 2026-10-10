import * as THREE from './vendor/three/three.module.min.js';

// The simulation stays on its integer grid. This view owns only GPU resources
// and the projection used by the accessible DOM hit regions.
export class RuneBattlefield {
  constructor(shell, grid, onFailure) {
    this.shell = shell; this.grid = grid; this.onFailure = onFailure;
    this.disposed = false; this.lost = false; this.materials = new Map();
    this.renderer = new THREE.WebGLRenderer({alpha:true, antialias:true, powerPreference:'low-power'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    this.canvas = this.renderer.domElement;
    this.canvas.className = 'rune-world'; this.canvas.setAttribute('aria-hidden','true');
    shell.prepend(this.canvas);
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-3.6,3.6,3.6,-3.6,.1,50);
    this.camera.position.set(0,14,9); this.camera.lookAt(0,0,0);
    this.scene.add(new THREE.HemisphereLight(0xc9eeff,0x172037,3));
    const key = new THREE.DirectionalLight(0xffeacb,3.2); key.position.set(-4,9,4); this.scene.add(key);
    const rim = new THREE.DirectionalLight(0x54bde5,2); rim.position.set(5,3,-5); this.scene.add(rim);
    this.box = new THREE.BoxGeometry(1,1,1);
    this.crystal = new THREE.OctahedronGeometry(1,0);
    this.ring = new THREE.TorusGeometry(.31,.022,4,16);
    this.group = new THREE.Group(); this.scene.add(this.group);
    this.tiles = []; this.relays = [];
    this.mesh(0,-.38,0,6.5,.48,6.5,0x142238);
    this.mesh(0,-.14,0,6.25,.12,6.25,0x35516b);
    for(let y=0;y<6;y++) for(let x=0;x<6;x++) {
      const tile=this.mesh(x-2.5,-.045,y-2.5,.94,.23,.94,(x+y)%2?0x253d50:0x304a5d);
      this.tiles.push(tile);
    }
    // Architectural anchors and inlaid strips make the board read as one
    // crafted command platform rather than a collection of floating cubes.
    for(const x of [-3.19,3.19]) {
      this.mesh(x,-.08,0,.045,.045,6.1,0x58aec4,true);
      for(const z of [-3.15,3.15]) {
        this.mesh(x,.05,z,.3,.55,.3,0x536b7d);
        this.mesh(x,.35,z,.19,.06,.19,0x84e7e0,true);
      }
    }
    this.decor = new THREE.Group(); this.group.add(this.decor);
    this.contextLost = event => { event.preventDefault(); this.lost=true; this.flat(); this.onFailure(true); };
    this.contextRestored = () => { if(this.disposed)return; this.lost=false; this.onFailure(false); this.draw(); };
    this.canvas.addEventListener('webglcontextlost',this.contextLost);
    this.canvas.addEventListener('webglcontextrestored',this.contextRestored);
    this.observer=new ResizeObserver(()=>this.draw()); this.observer.observe(shell);
  }
  material(color,glow=false) {
    const key=`${color}/${glow}`;
    if(!this.materials.has(key)) this.materials.set(key,new THREE.MeshStandardMaterial({color,roughness:.72,metalness:.22,emissive:glow?color:0,emissiveIntensity:glow?.65:0}));
    return this.materials.get(key);
  }
  mesh(x,y,z,w,h,d,color,glow=false,parent=this.group,geometry=this.box) {
    const mesh=new THREE.Mesh(geometry,this.material(color,glow)); mesh.position.set(x,y,z);mesh.scale.set(w,h,d);parent.add(mesh);return mesh;
  }
  sync(model) {
    if(this.disposed)return;
    this.model=model; this.decor.clear(); this.relays=[];
    for(const t of model.terrain) {
      if(t.type==='rubble') {
        this.mesh(t.x-2.65,.17,t.y-2.4,.5,.43,.5,0x516070,false,this.decor);
        this.mesh(t.x-2.35,.08,t.y-2.67,.37,.24,.4,0x71818a,false,this.decor);
      } else {
        const colors={burn:0xe78b4c,tide:0x268ab3,cooling:0x43c5cb,snare:0xc4a15a,seal:0xa696f0,orbit:0x7499bd};
        this.mesh(t.x-2.5,.085,t.y-2.5,.72,.02,.72,colors[t.type]||0x557a89,true,this.decor);
      }
    }
    for(const r of model.relays) {
      const color=r.captured?0x61e1bc:0xeeb85b;
      this.mesh(r.x-2.5,.09,r.y-2.5,.67,.08,.67,0x53667b,false,this.decor);
      this.mesh(r.x-2.5,.145,r.y-2.5,.46,.03,.46,color,true,this.decor);
      const ring=this.mesh(r.x-2.5,.17,r.y-2.5,1,1,1,color,true,this.decor,this.ring);ring.rotation.x=-Math.PI/2;
      if(!r.captured)this.mesh(r.x-2.5,.42,r.y-2.5,.17,.29,.17,color,true,this.decor,this.crystal);
    }
    const colors={lion:0x896e35,owl:0x33778c,turtle:0x397c67};
    this.tiles.forEach((mesh,i)=>{
      const tile=this.grid.children[i];
      const color=tile?.classList.contains('is-map-area')?colors[model.hero]||0x896e35:tile?.classList.contains('is-selected')?0x578f8e:tile?.classList.contains('is-move')?0x3b626f:(i+Math.floor(i/6))%2?0x253d50:0x304a5d;
      mesh.material=this.material(color);
    });
    this.draw();
  }
  draw() {
    if(this.disposed || this.lost || !this.model)return;
    const w=this.shell.clientWidth,h=this.shell.clientHeight;if(!w||!h)return;
    this.renderer.setSize(w,h,false);
    const aspect=w/h, span=3.5;
    this.camera.left=-span*aspect;this.camera.right=span*aspect;
    this.camera.top=span;this.camera.bottom=-span;this.camera.updateProjectionMatrix();this.camera.updateMatrixWorld();
    const project=(x,z)=>new THREE.Vector3(x,.08,z).project(this.camera);
    this.shell.classList.add('has-rune-world');
    for(const tile of this.grid.children) {
      const x=Number(tile.dataset.x)-2.5,z=Number(tile.dataset.y)-2.5;
      const p=project(x,z),a=project(x-.47,z-.47),b=project(x+.47,z+.47);
      const cw=(b.x-a.x)*w/2,ch=(a.y-b.y)*h/2;
      Object.assign(tile.style,{left:`${(p.x+1)*w/2-cw/2}px`,top:`${(1-p.y)*h/2-ch/2}px`,width:`${cw}px`,height:`${ch}px`});
    }
    this.renderer.render(this.scene,this.camera);
  }
  flat() { this.shell.classList.remove('has-rune-world');for(const tile of this.grid.children)tile.removeAttribute('style'); }
  stats() {return {active:!this.disposed&&!this.lost,calls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,geometries:this.renderer.info.memory.geometries,textures:this.renderer.info.memory.textures,materials:this.materials.size};}
  dispose() {
    if(this.disposed)return;this.disposed=true;this.observer.disconnect();
    this.canvas.removeEventListener('webglcontextlost',this.contextLost);this.canvas.removeEventListener('webglcontextrestored',this.contextRestored);
    this.flat();this.box.dispose();this.crystal.dispose();this.ring.dispose();
    for(const material of this.materials.values())material.dispose();this.materials.clear();
    this.renderer.dispose();this.renderer.forceContextLoss();this.canvas.remove();this.scene.clear();
  }
}
