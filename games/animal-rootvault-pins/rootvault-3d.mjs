import * as T from './vendor/three/three.module.min.js';

// Presentation only: every position and material comes from the authoritative board.
export class Rootvault3D {
  constructor(canvas, onUnavailable) {
    this.canvas = canvas;
    this.onUnavailable = onUnavailable;
    this.disposed = false;
    this.renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
    this.renderer.outputColorSpace = T.SRGBColorSpace;
    this.renderer.toneMapping = T.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.scene = new T.Scene();
    this.camera = new T.OrthographicCamera(0, 390, 0, -600, .1, 2000);
    this.camera.position.z = 1000;
    this.scene.add(new T.HemisphereLight(0xcafdec, 0x163e40, 1.8));
    const sun = new T.DirectionalLight(0xffe9be, 2.6);
    sun.position.set(-160, 220, 450); this.scene.add(sun);
    const rim = new T.DirectionalLight(0x55d9dd, 2.2);
    rim.position.set(220, -80, 120); this.scene.add(rim);
    this.world = new T.Group(); this.scene.add(this.world);
    this.materials = new Map();
    this.geo = {
      box: (()=>{const shape=new T.Shape();shape.moveTo(-.42,-.5);shape.lineTo(.42,-.5);shape.lineTo(.5,-.42);shape.lineTo(.5,.42);shape.lineTo(.42,.5);shape.lineTo(-.42,.5);shape.lineTo(-.5,.42);shape.lineTo(-.5,-.42);shape.closePath();const geometry=new T.ExtrudeGeometry(shape,{depth:.8,bevelEnabled:true,bevelThickness:.08,bevelSize:.025,bevelSegments:1,steps:1});geometry.center();return geometry})(),
      crystal: new T.OctahedronGeometry(1),
      ring: new T.TorusGeometry(1, .2, 6, 16),
      disc: new T.CylinderGeometry(1, 1, 1, 8),
      arrow: new T.ConeGeometry(1, 1, 3),
    };
    this.contents = new Map();
    this.onLoss = event => { event.preventDefault(); this.onUnavailable(); };
    canvas.addEventListener('webglcontextlost', this.onLoss);
    canvas.dataset.renderer = 'three-webgl2';
  }
  material(color, metal = false, glow = false) {
    const key = `${color}:${metal}:${glow}`;
    if (!this.materials.has(key)) this.materials.set(key, new T.MeshStandardMaterial({
      color, roughness: metal ? .3 : .78, metalness: metal ? .6 : .08,
      emissive: glow ? color : 0, emissiveIntensity: glow ? .32 : 0,
    }));
    return this.materials.get(key);
  }
  mesh(parent, shape, color, x, y, z, sx, sy, sz, metal = false, glow = false) {
    const mesh = new T.Mesh(this.geo[shape], this.material(color, metal, glow));
    mesh.position.set(x, y, z); mesh.scale.set(sx, sy, sz); parent.add(mesh); return mesh;
  }
  box(parent, color, x, y, z, sx, sy, sz, metal = false, glow = false) {
    return this.mesh(parent, 'box', color, x, y, z, sx, sy, sz, metal, glow);
  }
  sculpture(type, parent, x, y, size, armored = false) {
    const g = new T.Group(); g.position.set(x, y, 18); g.scale.setScalar(size / 32);
    g.rotation.set(-.28, .32, -.08); parent.add(g);
    const box = (c, x, y, z, w, h, d, metal = false, glow = false) => this.box(g, c, x, y, z, w, h, d, metal, glow);
    if (type === 'taro') {
      // Fortress-garden shell, cuboid anatomy, square expressive face.
      box(0x497a47, 0, -4, 0, 22, 20, 14);
      box(0x738c3e, -3, 3, -4, 28, 25, 14);
      box(0x98ad53, -3, 5, 5, 23, 19, 8);
      for (const x of [-11, 6]) for (const y of [-3, 14]) box(0xc5c87f, x, y, 8, 5, 5, 8);
      box(0x456c36, -3, 10, 12, 12, 5, 5);
      box(0x7aae4d, -5, 14, 14, 4, 7, 4);
      box(0x3f914d, -1, 15, 14, 9, 3, 4);
      box(0xd5d967, 6, -2, 16, 18, 16, 15);
      box(0xe4df87, 6, -7, 23, 14, 7, 5);
      for (const x of [1, 12]) { box(0xfff8d2, x, 1, 24, 5, 6, 1); box(0x183d36, x + 1, 1, 25, 2.7, 4, 1); }
      box(0x516136, 7, -8, 26, 6, 1, 1);
      for (const x of [-10, 9]) box(0xa2b45b, x, -16, 6, 9, 9, 12);
      if (armored) {
        const ring = this.mesh(g, 'ring', 0x68edc6, 0, 0, 10, 24, 25, 4, true, true);
        ring.rotation.y = -.2;
      }
    } else if (type === 'core') {
      const crystal = this.mesh(g, 'crystal', 0xffd456, 0, 0, 12, 12, 19, 12, true, true);
      crystal.rotation.z = .2;
      this.mesh(g, 'ring', 0xe9b052, 0, 0, 12, 18, 18, 4, true).rotation.x = .8;
      box(0xfff5b6, 0, 1, 24, 4, 5, 2, false, true);
    } else if (type === 'water' || type === 'ember') {
      const water = type === 'water';
      for (let i = 0; i < 3; i++) {
        const crystal = this.mesh(g, 'crystal', water ? (i === 1 ? 0x91edff : 0x209cdf) : (i === 1 ? 0xffdc71 : 0xf66c35),
          (i - 1) * 9, i === 1 ? 4 : -4, 12, 7, i === 1 ? 18 : 11, 7, false, true);
        crystal.rotation.z = (i - 1) * -.25;
      }
      this.mesh(g, 'ring', water ? 0x4ad2eb : 0xb84526, 0, -10, 1, 19, 7, 3, true);
    } else if (type === 'shadow') {
      const body = box(0x402c68, 0, 0, 9, 24, 25, 19); body.rotation.z = .15;
      for (const x of [-8, 0, 8]) box(0x74529e, x, -14, 7, 7, 8, 10);
      for (const x of [-6, 6]) box(0xeaa5ff, x, 3, 20, 5, 3, 1, false, true);
      box(0x9b69c5, -10, 14, 4, 6, 6, 6);
    } else if (type === 'ward') {
      box(0xd5bf71, 0, 0, 6, 27, 30, 6, true);
      box(0x278b77, 0, 1, 10, 21, 25, 5, true);
      box(0x8fffe0, 0, 1, 14, 5, 18, 2, true, true);
      box(0x8fffe0, 0, 3, 14, 15, 5, 2, true, true);
      box(0xd5bf71, 0, -15, 6, 17, 6, 6, true);
    } else if (type === 'key') {
      for (const [x,y,w,h] of [[-8,9,4,18],[6,9,4,18],[-1,16,18,4],[-1,2,18,4],[-1,-8,4,20],[5,-14,9,4],[4,-7,8,4]])
        box(0xf9c655, x, y, 8, w, h, 5, true);
    } else if (type === 'lock') {
      this.mesh(g, 'ring', 0xcec2a6, 0, 8, 5, 10, 12, 5, true);
      box(0x8668a4, 0, -6, 9, 28, 22, 11, true);
      box(0xe7bf75, 0, -4, 16, 6, 10, 2, true, true);
    }
    return g;
  }
  sync(state, layout, selected, blocked, selectedRoom) {
    if (this.disposed) return;
    this.cancelTransfer(false);
    const { width, height, rooms, pins } = layout;
    if (this.width !== width || this.height !== height) {
      this.width = width; this.height = height;
      this.renderer.setSize(width, height, false);
      this.camera.right = width; this.camera.bottom = -height; this.camera.updateProjectionMatrix();
    }
    this.world.clear(); this.contents.clear();
    // The authored vault raster supplies the environment; geometry dresses its
    // edges and interactive mechanisms without obscuring the scene with a grid.
    for (let y=34; y<height; y+=92) for (const x of [7,width-7]) {
      this.box(this.world,0x243e31,x,-y,-18,14,54,14);
      this.box(this.world,0x477342,x,-y+24,-8,15,5,5);
      this.box(this.world,0x728e48,x,-y+15,-5,5,7,4);
    }
    for (const pin of Object.values(state.pins)) {
      if(pin.pulled || pin.from !== selectedRoom) continue;
      const a = rooms[pin.from], b = rooms[pin.to], dx = b.x-a.x, dy = -(b.y-a.y), length = Math.hypot(dx,dy);
      const active = pin.id === selected;
      const beam = this.box(this.world, active ? 0x70efd2 : pin.pulled ? 0x43786a : 0x586450,
        (a.x+b.x)/2, -(a.y+b.y)/2, -7, length, active ? 7 : 5, 7, true, active);
      beam.rotation.z = Math.atan2(dy,dx);
      const arrow = this.mesh(this.world, 'arrow', active ? 0xffe1a0 : 0x8aa88b,
        a.x+dx*.74, -a.y+dy*.74, 0, 5, 12, 3, true, active);
      arrow.rotation.z = Math.atan2(dy,dx)-Math.PI/2;

    }
    for (const room of Object.values(state.rooms)) {
      const p = rooms[room.id], g = new T.Group(); g.position.set(p.x,-p.y,0); this.world.add(g);
      g.scale.setScalar(layout.roomScale || 1);
      const target = state.pins[selected]?.to === room.id, source = state.pins[selected]?.from === room.id;
      const sanctuary = room.type === 'sanctuary', danger = room.type === 'void';
      const border = target ? 0xffd573 : source ? 0x7cfbe0 : sanctuary ? 0x4bd9b7 : danger ? 0x8066a4 : 0x747854;
      this.box(g, 0x102e29, 0, -4, -2, 78, 76, 14);
      this.box(g, border, 0, 0, 5, 74, 72, 6, true, source || target || sanctuary);
      this.box(g, danger ? 0x171126 : 0x183f34, 0, 0, 9, 67, 65, 6);
      this.box(g, danger ? 0x201930 : 0x255042, 0, 1, 12, 57, 54, 4);
      for (const x of [-24,24]) this.box(g,0x395842,x,-1,13,2,38,2);
      for (const x of [-29, 29]) for (const y of [-28, 28]) this.box(g, 0xc2ae76, x, y, 14, 5, 5, 4, true);
      if (sanctuary || danger) {
        const ring = this.mesh(g, 'ring', sanctuary ? 0x71e4cb : 0x746199, 0, -4, 14, 24, 24, 3, true, sanctuary);
        ring.rotation.z = Math.PI/8;
        this.mesh(g, 'disc', sanctuary ? 0x147f81 : 0x110e1f, 0, -4, 11, 20, 3, 20, false, sanctuary).rotation.x = Math.PI/2;
      }
      const contents = new T.Group(); g.add(contents); this.contents.set(room.id, contents);
      const types = room.contents, n = types.length;
      types.forEach((type, i) => {
        const x = n === 1 ? 0 : ((i % 2)-.5)*28;
        const y = n <= 2 ? -2 : 13-Math.floor(i/2)*24;
        this.sculpture(type, contents, x, y, n === 1 ? 40 : n <= 4 ? 26 : 19, state.armor);
      });
    }
    this.render(blocked);
  }
  beginTransfer(sourceId, targetId, layout, { duration = 440, blocked = () => false } = {}) {
    if (this.disposed || this.transfer) return false;
    const group = this.contents.get(sourceId), from = layout.rooms[sourceId], to = layout.rooms[targetId];
    if (!group || !from || !to) return false;
    group.removeFromParent();
    group.position.set(from.x, -from.y, 0);
    group.scale.setScalar(layout.roomScale || 1);
    group.visible = true;
    this.world.add(group);
    const transfer = {
      group,
      from: { x: from.x, y: -from.y },
      to: { x: to.x, y: -to.y },
      duration: Math.max(1, duration),
      elapsed: 0,
      lastAt: 0,
      frame: 0,
      paused: false,
      blocked,
      step: null,
    };
    transfer.step = now => {
      if (this.disposed || this.transfer !== transfer) return;
      if (transfer.blocked()) { transfer.paused = true; transfer.frame = 0; return; }
      if (transfer.lastAt) transfer.elapsed += now - transfer.lastAt;
      transfer.lastAt = now;
      const progress = Math.min(1, transfer.elapsed / transfer.duration);
      const eased = progress * progress * (3 - 2 * progress);
      group.position.set(
        transfer.from.x + (transfer.to.x - transfer.from.x) * eased,
        transfer.from.y + (transfer.to.y - transfer.from.y) * eased,
        0,
      );
      this.render();
      if (progress >= 1) { transfer.frame = 0; this.transfer = null; return; }
      transfer.frame = requestAnimationFrame(transfer.step);
    };
    this.transfer = transfer;
    this.setMotionBlocked(blocked());
    return true;
  }
  setMotionBlocked(blocked) {
    const transfer = this.transfer;
    if (!transfer) return;
    if (blocked) {
      if (transfer.frame) cancelAnimationFrame(transfer.frame);
      transfer.frame = 0;
      transfer.paused = true;
      return;
    }
    if (transfer.paused || !transfer.frame) {
      transfer.paused = false;
      transfer.lastAt = 0;
      transfer.frame = requestAnimationFrame(transfer.step);
    }
  }
  cancelTransfer() {
    const transfer = this.transfer;
    if (!transfer) return false;
    if (transfer.frame) cancelAnimationFrame(transfer.frame);
    transfer.frame = 0;
    transfer.group.visible = false;
    this.transfer = null;
    return true;
  }
  render() {
    if (this.disposed) return;
    this.renderer.render(this.scene, this.camera);
    this.canvas.dataset.drawCalls = String(this.renderer.info.render.calls);
    this.canvas.dataset.triangles = String(this.renderer.info.render.triangles);
    this.canvas.dataset.geometries = String(this.renderer.info.memory.geometries);
    this.canvas.dataset.textures = String(this.renderer.info.memory.textures);
  }
  dispose() {
    if (this.disposed) return; this.disposed = true;
    this.cancelTransfer(false);
    this.canvas.removeEventListener('webglcontextlost', this.onLoss);
    this.world.clear(); this.contents.clear();
    Object.values(this.geo).forEach(g => g.dispose());
    this.materials.forEach(m => m.dispose()); this.materials.clear();
    this.renderer.dispose(); this.renderer.forceContextLoss();
    this.canvas.remove();
  }
}
