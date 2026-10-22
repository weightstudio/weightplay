import * as THREE from './vendor/three/three.module.min.js';

const colors = { a: 0x77dcff, b: 0xffcb75, c: 0xec9fd6 };
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** One rendering owner; integer rules never depend on rendered coordinates. */
export class MeadowScene {
  constructor(host, onLayout, onContext) {
    this.host = host; this.onLayout = onLayout; this.onContext = onContext;
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
    this.renderer.setClearColor(0, 0);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.domElement.setAttribute('aria-hidden', 'true');
    host.prepend(this.renderer.domElement);
    this.scene = new THREE.Scene();
    this.scene.add(new THREE.HemisphereLight(0xe2f5ff, 0x293a36, 2.5));
    const sun = new THREE.DirectionalLight(0xffe0ad, 3.4); sun.position.set(-4, 8, 5); this.scene.add(sun);
    const rim = new THREE.DirectionalLight(0x7bd0ff, 2); rim.position.set(4, 3, -4); this.scene.add(rim);
    this.camera = new THREE.OrthographicCamera(-5, 5, 5, -5, .1, 70);
    this.camera.position.set(0, 15, 8); this.camera.lookAt(0, 0, 0);
    this.group = new THREE.Group(); this.scene.add(this.group);
    this.materials = new Map(); this.geometry = [];
    this.positions = {}; this.pieces = {}; this.ghosts = {}; this.rings = [];
    this.lost = false; this.paused = false; this.frame = 0;
    this.resizeObserver = new ResizeObserver(() => this.resize()); this.resizeObserver.observe(host);
    this.contextLost = event => { event.preventDefault(); this.lost = true; this.settle(); onContext(false); };
    this.contextRestored = () => { this.lost = false; this.resize(); onContext(true); };
    this.renderer.domElement.addEventListener('webglcontextlost', this.contextLost);
    this.renderer.domElement.addEventListener('webglcontextrestored', this.contextRestored);
  }
  material(color, metalness = .15, opacity = 1) {
    const key = `${color}:${metalness}:${opacity}`;
    if (!this.materials.has(key)) this.materials.set(key, new THREE.MeshStandardMaterial({color, metalness, roughness: .38, transparent: opacity < 1, opacity, flatShading: true}));
    return this.materials.get(key);
  }
  mesh(geometry, material, parent, x = 0, y = 0, z = 0) {
    this.geometry.push(geometry);
    const mesh = new THREE.Mesh(geometry, material); mesh.position.set(x, y, z); parent.add(mesh); return mesh;
  }
  box(w, h, d, color, parent, x = 0, y = 0, z = 0) {
    // Beveled geometry catches the two lights, including on the smallest phone view.
    const shape = new THREE.Shape(); const r = .10;
    shape.moveTo(-w/2+r,-d/2); shape.lineTo(w/2-r,-d/2); shape.quadraticCurveTo(w/2,-d/2,w/2,-d/2+r);
    shape.lineTo(w/2,d/2-r); shape.quadraticCurveTo(w/2,d/2,w/2-r,d/2);
    shape.lineTo(-w/2+r,d/2); shape.quadraticCurveTo(-w/2,d/2,-w/2,d/2-r);
    shape.lineTo(-w/2,-d/2+r); shape.quadraticCurveTo(-w/2,-d/2,-w/2+r,-d/2);
    const geometry = new THREE.ExtrudeGeometry(shape, {depth:h, bevelEnabled:true, bevelSize:.045, bevelThickness:.045, bevelSegments:1, steps:1, curveSegments:2});
    geometry.rotateX(-Math.PI/2); return this.mesh(geometry, this.material(color), parent, x, y, z);
  }
  crystal(id, parent, ghost = false) {
    const root = new THREE.Group(); parent.add(root);
    const material = this.material(colors[id], .35, ghost ? .32 : 1);
    const body = this.mesh(new THREE.OctahedronGeometry(.58, 0), material, root, 0, .76, 0);
    body.scale.set(.9, 1.25, .9); body.rotation.y = Math.PI/4;
    if (!ghost) {
      this.mesh(new THREE.CylinderGeometry(.42,.48,.15,8), this.material(0xceb97d,.65), root,0,.28,0);
      const shard = this.mesh(new THREE.OctahedronGeometry(.16,0), material, root,.39,.39,.15); shard.rotation.z=-.25;
    }
    return root;
  }
  load(board, positions, theme) {
    this.settle(); this.group.clear(); this.geometry.forEach(g => g.dispose()); this.geometry=[];
    this.board=board; this.positions={...positions}; this.pieces={}; this.ghosts={}; this.rings=[];
    const rows=Math.ceil(board.boardSize/3); const spacing=rows===2?3.15:2.5;
    this.pads=Array.from({length:board.boardSize},(_,i)=>new THREE.Vector3(((Math.floor(i/3)%2?2-i%3:i%3)-1)*2.35,0,(Math.floor(i/3)-(rows-1)/2)*spacing));
    this.theme=theme; const base = theme==='amber'?0x79634d:0x3a6762;
    // Low stone island, real path beams and recessed target inlays.
    this.box(7.5,.2,(rows-1)*spacing+2.3,base,this.group,0,-.38,0);
    for(let i=1;i<this.pads.length;i++) {
      const a=this.pads[i-1], b=this.pads[i], mid=a.clone().add(b).multiplyScalar(.5);
      this.box(Math.abs(a.x-b.x)+.15,.025,Math.abs(a.z-b.z)+.15,0xc0b883,this.group,mid.x,-.09,mid.z);
    }
    for(let i=0;i<board.boardSize;i++) {
      const p=this.pads[i], blocked=board.blocked.includes(i), target=board.stones.find(id=>board.target[id]===i);
      const pad=new THREE.Group(); pad.position.copy(p); this.group.add(pad);
      this.box(1.65,.22,1.65,blocked?0x596361:0xadc4ad,pad,0,-.12,0);
      this.box(1.38,.05,1.38,blocked?0x465452:0x254941,pad,0,.13,0);
      if(target) {
        const ring=this.mesh(new THREE.TorusGeometry(.59,.045,4,4),this.material(colors[target],.5),pad,0,.24,0); ring.rotation.x=-Math.PI/2; ring.rotation.z=Math.PI/4;
      }
      if(blocked) {
        const rock=this.mesh(new THREE.DodecahedronGeometry(.52,0),this.material(0x5b7070),pad,0,.43,0); rock.scale.set(1,.65,1);
      }
      const ring=this.mesh(new THREE.TorusGeometry(.79,.035,4,4),this.material(0xfef0b5,.5),pad,0,.20,0); ring.rotation.x=-Math.PI/2; ring.rotation.z=Math.PI/4; ring.visible=false; this.rings.push(ring);
    }
    for(const id of board.stones) {
      const piece=this.crystal(id,this.group); piece.position.copy(this.pads[positions[id]]); this.pieces[id]=piece;
      if(board.anchors.includes(id)) this.box(.85,.10,.85,0x7d8992,piece,0,.14,0);
      const ghost=this.crystal(id,this.group,true); ghost.visible=false; this.ghosts[id]=ghost;
    }
    // Small planted corners use the same block geometry, no additional texture downloads.
    for(const x of [-3.3,3.3]) for(const z of [-(rows-1)*spacing/2-.55,(rows-1)*spacing/2+.55]) {
      this.box(.42,.30,.45,0xa3986c,this.group,x,-.05,z);
      this.box(.35,.38,.30,theme==='amber'?0xcca450:0x6b9e70,this.group,x,.22,z);
    }
    this.resize();
  }
  resize() {
    const width=this.host.clientWidth,height=this.host.clientHeight; if(!width||!height||!this.board)return;
    this.width=width; this.height=height; this.renderer.setSize(width,height,false);
    const rows=Math.ceil(this.board.boardSize/3), depth=(rows-1)*(rows===2?3.15:2.5)+2.6;
    const halfH=Math.max(8.3/(width/height),depth*.89+1.35)/2;
    this.camera.left=-halfH*width/height; this.camera.right=halfH*width/height; this.camera.top=halfH; this.camera.bottom=-halfH;
    this.camera.updateProjectionMatrix(); this.camera.updateMatrixWorld(); this.draw();
  }
  project(point) { const p=point.clone().project(this.camera); return {x:(p.x+1)*this.width/2,y:(1-p.y)*this.height/2}; }
  draw() {
    if(this.lost||this.disposed||!this.board||!this.width||this.paused)return;
    this.renderer.render(this.scene,this.camera);
    this.onLayout({pads:this.pads.map(p=>this.project(p.clone().add(new THREE.Vector3(0,.05,.88)))),stones:Object.fromEntries(Object.entries(this.pieces).map(([id,p])=>[id,this.project(p.position.clone().add(new THREE.Vector3(0,.72,0)))]))});
    this.host.dataset.drawCalls=String(this.renderer.info.render.calls); this.host.dataset.triangles=String(this.renderer.info.render.triangles);
  }
  update(positions,selected,animate=true) {
    cancelAnimationFrame(this.frame); this.frame=0; this.positions={...positions}; this.preview(null);
    const start=performance.now(), from=Object.fromEntries(Object.entries(this.pieces).map(([id,p])=>[id,p.position.clone()]));
    this.rings.forEach((ring,i)=>{ring.visible=positions[selected]===i;});
    const duration=animate&&!reduced()?220:0;
    const step=now=>{
      const t=duration?Math.min(1,(now-start)/duration):1, eased=1-(1-t)**3;
      for(const id of this.board.stones) {this.pieces[id].position.lerpVectors(from[id],this.pads[positions[id]],eased);this.pieces[id].position.y=Math.sin(t*Math.PI)*.32;}
      this.draw(); this.frame=t<1&&!this.paused?requestAnimationFrame(step):0;
    }; step(start);
  }
  preview(positions) {
    for(const id of this.board?.stones||[]) {this.ghosts[id].visible=!!positions;if(positions)this.ghosts[id].position.copy(this.pads[positions[id]]);}
    this.draw();
  }
  drag(id,x,y) {
    if(!this.width||!this.pieces[id])return;
    cancelAnimationFrame(this.frame);this.frame=0;
    const ray=new THREE.Raycaster(); ray.setFromCamera(new THREE.Vector2(x/this.width*2-1,1-y/this.height*2),this.camera);
    const point=ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0),0),new THREE.Vector3());
    if(point){this.pieces[id].position.copy(point);this.draw();}
  }
  settle() {cancelAnimationFrame(this.frame);this.frame=0;for(const id of this.board?.stones||[])this.pieces[id]?.position.copy(this.pads[this.positions[id]]);this.preview(null);}
  pause(value) {this.settle();this.paused=value;if(!value)this.resize();}
  dispose() {
    this.settle();this.disposed=true;this.resizeObserver.disconnect();
    this.renderer.domElement.removeEventListener('webglcontextlost',this.contextLost);this.renderer.domElement.removeEventListener('webglcontextrestored',this.contextRestored);
    this.geometry.forEach(g=>g.dispose());this.materials.forEach(m=>m.dispose());this.renderer.dispose();this.renderer.domElement.remove();
  }
}
