import * as THREE from './vendor/three/three.module.min.js';

// Orthographic, authored mesh diorama. All boxes share one geometry; no per-frame allocation.
export class MarketScene {
  constructor(canvas, onStall, onFrame) {
    this.canvas = canvas; this.onStall = onStall; this.onFrame = onFrame;
    this.active = false; this.paused = false; this.disposed = false; this.raf = 0;
    this.clock = 0; this.arrival = 0; this.flash = [0, 0]; this.gold = false;
    this.reduced = matchMedia('(prefers-reduced-motion: reduce)');
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'low-power' });
    this.renderer.setPixelRatio(1.5);
    this.renderer.shadowMap.enabled = true; this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping; this.renderer.toneMappingExposure = 1.25;
    this.scene = new THREE.Scene(); this.scene.background = new THREE.Color('#171b38');
    this.camera = new THREE.OrthographicCamera(-6, 6, 6, -6, .1, 70);
    this.camera.position.set(0, 11, 16); this.camera.lookAt(0, .6, 0);
    this.box = new THREE.BoxGeometry(1, 1, 1); this.materials = new Map(); this.textures = [];
    this.ray = new THREE.Raycaster(); this.pointer = new THREE.Vector2();
    this.scene.add(new THREE.HemisphereLight('#a8d9ff', '#49324a', 2.4));
    const sun = new THREE.DirectionalLight('#ffe4b1', 4); sun.position.set(-5, 10, 7);
    sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7, near: .1, far: 30 });
    sun.shadow.normalBias = .035; sun.shadow.bias = -.0005; this.scene.add(sun); this.sun = sun;
    const rim = new THREE.DirectionalLight('#9a8bff', 2); rim.position.set(5, 5, -6); this.scene.add(rim);
    this.world = new THREE.Group(); this.scene.add(this.world);
    this.buildEnvironment();
    this.stalls = [-2.35, 2.35].map((x, i) => this.buildStall(x, i));
    this.helpers = [this.animal('owl'), this.animal('rhino')];
    this.helpers.forEach((a, i) => { a.scale.setScalar(.82); a.position.set(i ? 2.35 : -2.35, .18, 1.15); this.world.add(a); });
    this.customers = Array.from({ length: 4 }, (_, i) => {
      const a = this.animal(['fox', 'bunny', 'bear', 'fox'][i]); a.scale.setScalar(i ? .7 : .94);
      this.world.add(a); return a;
    });
    this.hits = this.stalls.map((stall, i) => {
      const hit = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 3.5), new THREE.MeshBasicMaterial({ visible: false }));
      hit.position.set(i ? 2.35 : -2.35, 1.5, .65); hit.userData.side = i; this.world.add(hit); return hit;
    });
    this.down = null;
    this.pointerDown = e => { if (e.isPrimary && e.button === 0) this.down = [e.clientX, e.clientY]; };
    this.pointerUp = e => {
      if (!this.active || this.paused || !this.down) return;
      const [x, y] = this.down; this.down = null;
      if (Math.hypot(e.clientX - x, e.clientY - y) > 14) return;
      const r = canvas.getBoundingClientRect();
      this.pointer.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1);
      this.ray.setFromCamera(this.pointer, this.camera);
      const hit = this.ray.intersectObjects(this.hits)[0];
      if (hit) this.onStall(hit.object.userData.side, { x: e.clientX, y: e.clientY });
    };
    this.pointerCancel = () => { this.down = null; };
    canvas.addEventListener('pointerdown', this.pointerDown);
    canvas.addEventListener('pointerup', this.pointerUp);
    canvas.addEventListener('pointercancel', this.pointerCancel);
    this.resizeObserver = new ResizeObserver(() => { this.resize(); this.draw(); }); this.resizeObserver.observe(canvas.parentElement);
    this.resize(); this.draw();
  }

  material(color, emissive = false) {
    const key = `${color}:${emissive}`;
    if (!this.materials.has(key)) this.materials.set(key, new THREE.MeshStandardMaterial({
      color, roughness: .78, metalness: color === '#eabb63' ? .3 : .03,
      ...(emissive ? { emissive: color, emissiveIntensity: .55 } : {}),
    }));
    return this.materials.get(key);
  }
  block(parent, x, y, z, w, h, d, color, rotation = 0, emissive = false) {
    const m = new THREE.Mesh(this.box, this.material(color, emissive));
    m.position.set(x, y, z); m.scale.set(w, h, d); m.rotation.z = rotation;
    m.castShadow = true; m.receiveShadow = true; parent.add(m); return m;
  }
  group(parent, x = 0, y = 0, z = 0) { const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g); return g; }

  buildEnvironment() {
    const w = this.world;
    this.block(w, 0, -.2, 0, 11.2, .42, 8.5, '#28384c');
    this.block(w, 0, -.43, 0, 10.7, .18, 8, '#142b3d');
    this.block(w, 0, -.03, 3.8, 4.2, .15, .7, '#647788');
    this.block(w, 0, -.18, 4.2, 3.5, .15, .5, '#3f576b');
    const tiles = new THREE.InstancedMesh(this.box, this.material('#395263'), 88);
    const transform = new THREE.Object3D(); let n = 0;
    for (let x = -5; x <= 5; x++) for (let z = -3; z <= 4; z++) {
      transform.position.set(x, .015, z - .4); transform.scale.set(.94, .09, .94); transform.updateMatrix(); tiles.setMatrixAt(n++, transform.matrix);
    }
    tiles.receiveShadow = true; w.add(tiles);
    for (const x of [-5, 5]) {
      for (const z of [-2.7, 2.7]) this.tree(x, z);
      this.lamp(x * .83, 2.4);
    }
    for (const x of [-4.5, -3, -1.5, 0, 1.5, 3, 4.5]) {
      this.block(w, x, .5, -3.65, 1.35, .16, .16, '#926243');
      this.block(w, x, .9, -3.65, .14, 1.9, .14, '#785342');
    }
    this.block(w, 0, 3.7, -3.5, 9.5, .07, .07, '#c3a178');
    for (let i = 0; i < 9; i++) {
      const x = (i - 4) * 1.05;
      this.block(w, x, 3.45 - Math.sin(i / 8 * Math.PI) * .35, -3.5, .18, .28, .18, '#ffd08a', 0, true);
    }
    // A stepped crescent, built as one instanced mesh, hangs behind the stalls.
    const moonCells = [];
    for (let x = -4; x <= 4; x++) for (let y = -4; y <= 4; y++) {
      if (x*x+y*y < 18 && (x-2)*(x-2)+(y-1)*(y-1) > 12) moonCells.push([x,y]);
    }
    const moon = new THREE.InstancedMesh(this.box, this.material('#ffd994', true), moonCells.length);
    moonCells.forEach(([x,y],i) => { transform.position.set(x*.22, 4.8+y*.22, -5.4); transform.scale.set(.225,.225,.15); transform.updateMatrix(); moon.setMatrixAt(i,transform.matrix); });
    w.add(moon);
    for (let i = 0; i < 18; i++) {
      const star = this.block(w, Math.sin(i*17.7)*6, 3.6+(i%5)*.45, -5.8, .055,.055,.055,'#bbb5e4',Math.PI/4,true); star.castShadow = false;
    }
  }
  tree(x,z) {
    const p = this.group(this.world,x,0,z);
    this.block(p,0,.25,0,.7,.5,.7,'#586071'); this.block(p,0,.64,0,.2,.8,.2,'#8d6650');
    [[0,1.45,0,1.05],[-.3,1.9,.04,.7],[.25,2,.12,.7],[0,2.42,0,.5]].forEach(([a,b,c,s],i)=>this.block(p,a,b,c,s,s,s,['#2c7d77','#448f83','#5ba28a','#8db995'][i]));
    this.block(p,.36,.5,.38,.12,.15,.12,'#b799d9');
  }
  lamp(x,z) {
    const g=this.group(this.world,x,0,z);
    this.block(g,0,.1,0,.45,.2,.45,'#3f465d');this.block(g,0,1.15,0,.1,2.2,.1,'#b18a58');
    this.lantern(g,0,2.2,0,.45);
  }
  lantern(g,x,y,z,s) {
    this.block(g,x,y,z,s*.7,s,s*.7,'#ffd692',0,true);
    for(const sy of [-.55,.55])this.block(g,x,y+s*sy,z,s,.1,s,'#ab7845');
    for(const sx of [-.39,.39])this.block(g,x+s*sx,y,z,s*.1,s,s*.85,'#eabb63');
  }
  buildStall(x,index) {
    const g=this.group(this.world,x,0,-.55), canopy=[];
    this.block(g,0,.27,0,3.55,.35,2.2,'#4f3f48');
    this.block(g,0,.78,0,3.25,1.05,1.7,'#a46e4a');
    for(let i=0;i<7;i++)this.block(g,(i-3)*.46,.79,.9,.43,.9,.12,i%2?'#b58254':'#bc8b5e');
    this.block(g,0,1.33,0,3.65,.18,2.2,'#e0b982');
    this.block(g,0,.47,.97,3.35,.1,.08,'#6c4b43');
    for(const a of [-1.65,1.65])for(const b of [-.85,.85]){
      this.block(g,a,1.8,b,.13,3.2,.13,'#976c4d');
      this.block(g,a,2.93,b,.21,.12,.21,'#eabb63');
    }
    for(let i=0;i<8;i++) {
      const strip=this.block(g,(i-3.5)*.46,3.27,-.08,.46,.14,2.25,i%2?'#a484c8':'#715596'); canopy.push(strip);
      const hem=this.block(g,(i-3.5)*.46,3.12,1.07,.46,.28,.15,i%2?'#a484c8':'#715596'); canopy.push(hem);
    }
    this.block(g,0,3.39,-.9,3.8,.13,.16,'#d2a566');
    this.block(g,0,3.32,1.15,3.8,.1,.12,'#e9c78c');
    for(const edge of [-1.88,1.88])this.block(g,edge,3.32,0,.1,.14,2.35,'#c69865');
    for(const edge of [-1.1,1.1])this.block(g,edge,.78,.98,.08,.85,.1,'#6d4a3c');
    this.lantern(g,index?1.4:-1.4,2.6,1.15,.4);
    this.block(g,0,.87,1.03,.8,.49,.09,'#4e415f');
    // Discrete in-world stall number plates remain recognizable without texture loading.
    this.block(g,index?-.12:0,.87,1.1,.07,.28,.035,'#ffe2a4',0,true);
    if(index)this.block(g,.12,.87,1.1,.07,.28,.035,'#ffe2a4',0,true);
    const goods=this.group(g,0,1.45,0);
    const variants={};
    for(const kind of ['berries','lanterns','acorns']) {
      const group=this.group(goods), items=[];
      for(let i=0;i<6;i++) {
        const item=this.group(group,(i%3-1)*.65,0,Math.floor(i/3)*.56-.3);
        if(kind==='berries') {
          this.block(item,0,.05,0,.56,.12,.5,'#815a45');
          for(const [px,pz] of [[-.12,-.1],[.12,-.1],[0,.12]]) {
            this.block(item,px,.24,pz,.24,.26,.24,'#a15edb');this.block(item,px+.03,.4,pz,.08,.07,.08,'#98ba7a');
          }
        } else if(kind==='lanterns') this.lantern(item,0,.27,0,.43);
        else {
          this.block(item,0,.21,0,.38,.38,.38,'#d8a467');this.block(item,0,.43,0,.46,.14,.46,'#84563b');this.block(item,0,.55,0,.1,.15,.1,'#ab8053');
        }
        items.push(item);
      }
      variants[kind]={group,items};
    }
    return {g,canopy,variants,goods};
  }

  animal(kind) {
    const g=new THREE.Group(), body=kind==='fox'?'#c77844':kind==='bunny'?'#eee4d7':kind==='owl'?'#314561':kind==='rhino'?'#829399':'#967568';
    this.block(g,0,.68,0,.64,.85,.46,body);
    this.block(g,0,1.42,.02,.95,.78,.72,body);
    this.block(g,0,1.23,.43,.62,.36,.2,kind==='rhino'?'#aebabe':'#fff0d3');
    for(const x of [-.25,.25]) {
      this.block(g,x,.15,0,.24,.3,.36,body); this.block(g,x*.85,1.48,.41,.13,.16,.06,'#262943');
      this.block(g,x*.85-.02,1.52,.45,.035,.04,.02,'#fff7dd',0,true);
      this.block(g,x*1.8,.73,.03,.18,.55,.24,body,x<0?-.13:.13);
      this.block(g,x,1.97,.01,kind==='bunny'?.21:.28,kind==='bunny'?.68:.25,.24,body);
      if(kind==='bunny')this.block(g,x,2,.14,.09,.38,.04,'#d6a9ae');
    }
    this.block(g,0,1.3,.57,.16,.11,.08,kind==='owl'?'#e2b260':'#493c47');
    this.block(g,0,.91,.29,.68,.17,.11,kind==='fox'?'#55a2a3':'#9d83c6');
    if(kind==='fox') {const tail=this.block(g,.56,.42,-.26,.35,.7,.35,'#e39752',-.5);this.block(tail,0,-.35,0,.92,.4,.92,'#fff0d3');}
    if(kind==='owl') {
      this.block(g,0,1.91,0,1.08,.15,.84,'#253753');this.block(g,0,2.07,-.05,.65,.22,.6,'#253753');
      this.block(g,0,2.11,.28,.19,.19,.04,'#f0c477');
      for(const x of [-.22,.22])for(const y of [1.37,1.61])this.block(g,x,y,.44,.37,.045,.04,'#eabb63');
      for(const x of [-.4,0,.4])this.block(g,x,1.5,.44,.04,.24,.04,'#eabb63');
    }
    if(kind==='rhino') {
      this.block(g,0,1.54,.56,.17,.38,.2,'#eabb63',0);
      this.block(g,0,1.08,.24,.74,.16,.18,'#50a39a');this.block(g,-.22,.84,.28,.18,.35,.09,'#50a39a');
      this.block(g,0,.55,.27,.67,.12,.1,'#745c45');this.block(g,.13,.55,.35,.16,.18,.06,'#eabb63');
    }
    return g;
  }

  update(run, save) {
    this.gold=save.goldEnabled;
    for(const [i,stall] of this.stalls.entries()) {
      stall.canopy.forEach((m,n)=>{m.material=this.material(save.goldEnabled?(n%4<2?'#d6a14f':'#f3ce80'):(n%4<2?'#715596':'#a484c8'));});
      for(const [kind,v] of Object.entries(stall.variants)) {
        v.group.visible=run.plan.shelf[i]===kind;
        v.items.forEach((m,n)=>{m.visible=n<run.plan.stock[i];});
      }
    }
    this.helpers.forEach((h,i)=>{h.position.x=run.plan.jobs[i?'rux':'orla']==='stock'?-2.35:2.35;});
    this.customers.forEach((c,i)=>{c.visible=run.phase==='plan' ? i<3 : run.phase==='serve' && i<run.orders.length-run.customer;});
    this.draw();
  }
  arrive() { this.arrival=this.reduced.matches?0:.42; }
  pulse(side) { this.flash[side]=this.reduced.matches?0:.24; }
  resize() {
    if(this.disposed)return;
    const r=this.canvas.parentElement.getBoundingClientRect(); if(!r.width||!r.height)return;
    this.renderer.setSize(r.width,r.height,false);
    const aspect=r.width/r.height, width=Math.max(11.7,9.3*aspect), height=width/aspect;
    Object.assign(this.camera,{left:-width/2,right:width/2,top:height/2,bottom:-height/2});this.camera.updateProjectionMatrix();
  }
  draw() { if(!this.disposed)this.renderer.render(this.scene,this.camera); }
  setActive(active) {
    this.active=active; this.down=null;
    if(!active){cancelAnimationFrame(this.raf);this.raf=0;this.last=0;this.flash=[0,0];this.arrival=0;return;}
    this.resize();if(!this.raf&&!this.paused){this.last=0;this.raf=requestAnimationFrame(t=>this.tick(t));}
  }
  setPaused(paused) { this.paused=paused;this.setActive(this.active); }
  tick(t) {
    this.raf=0;if(!this.active||this.paused||this.disposed)return;
    const dt=this.last?Math.min(.1,(t-this.last)/1000):0;this.last=t;this.clock+=dt;
    this.arrival=Math.max(0,this.arrival-dt);
    this.customers.forEach((c,i)=>{
      const arrival=this.arrival/.42;
      c.position.set(i?1.4+(i-1)*1.1:arrival*1.1,Math.sin(arrival*Math.PI)*.12,3.1+(i?.05:0));
      c.rotation.y=i?-.35:0;
    });
    this.stalls.forEach((s,i)=>{this.flash[i]=Math.max(0,this.flash[i]-dt);s.goods.scale.setScalar(1+Math.sin(this.flash[i]/.24*Math.PI)*.12);});
    this.onFrame(dt);this.draw();
    // DOM counters are diagnostic observations, never gameplay controls.
    if(t-(this.statsAt||0)>1000){this.statsAt=t;this.canvas.dataset.drawCalls=String(this.renderer.info.render.calls);this.canvas.dataset.triangles=String(this.renderer.info.render.triangles);this.canvas.dataset.geometries=String(this.renderer.info.memory.geometries);this.canvas.dataset.textures=String(this.renderer.info.memory.textures);}
    if(this.active&&!this.paused)this.raf=requestAnimationFrame(v=>this.tick(v));
  }
  dispose() {
    if(this.disposed)return;this.setActive(false);this.disposed=true;this.resizeObserver.disconnect();
    this.canvas.removeEventListener('pointerdown',this.pointerDown);this.canvas.removeEventListener('pointerup',this.pointerUp);this.canvas.removeEventListener('pointercancel',this.pointerCancel);
    this.box.dispose();this.materials.forEach(m=>m.dispose());this.hits.forEach(h=>{h.geometry.dispose();h.material.dispose();});
    this.textures.forEach(t=>t.dispose());this.sun.shadow.map?.dispose();this.renderer.dispose();this.scene.clear();
  }
}
