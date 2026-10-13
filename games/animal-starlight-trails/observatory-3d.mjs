import * as THREE from './vendor/three/three.module.min.js';

// Presentation only. The graph controller owns every legal move and outcome.
export function createObservatory(host, svg) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.className = 'observatory-renderer';
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.prepend(renderer.domElement);
  const scene = new THREE.Scene();
  // Matching SVG's square viewBox exactly preserves touch/keyboard targeting.
  const camera = new THREE.OrthographicCamera(0, 100, 100, 0, .1, 300);
  camera.position.set(0, 0, 150);
  camera.lookAt(0, 0, 0);
  scene.add(new THREE.HemisphereLight(0xc3e9ff, 0x272e6b, 2.4));
  const light = new THREE.DirectionalLight(0xffddaa, 3.2);
  light.position.set(-30, 70, 90); scene.add(light);
  const rim = new THREE.DirectionalLight(0x79baff, 2);
  rim.position.set(70, -20, 50); scene.add(rim);
  const box = new THREE.BoxGeometry(1, 1, 1);
  const materials = new Set();
  const material = (color, metalness = .35, emissive = 0) => {
    const m = new THREE.MeshStandardMaterial({ color, metalness, roughness: .38, emissive, emissiveIntensity: .6 });
    materials.add(m); return m;
  };
  const brass = material(0xb48c4c, .7), base = material(0x243b63, .65);
  const edgeDim = material(0x6d8ba5, .5), edgeGold = material(0xffd578, .4, 0xffaa35);
  const violet = material(0xb58aff, .25, 0x542891), rose = material(0xff7db2, .25, 0x7f164c);
  const mint = material(0x85f3cf, .4, 0x2fb882), cyan = material(0x81f5ff, .4, 0x23b9cd);
  const ivory = material(0xd7eaff, .35, 0x4b6fa3);
  let graph = new THREE.Group(); scene.add(graph);
  let stars = [], trails = [], stage = null, state = null, path = [];
  let active = false, lost = false, disposed = false, frame = 0, until = 0, lastTime = 0;
  let burstAt = -Infinity, burstNode = null, theme = 'gold';
  let previousPath = [], reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let size = 0, frameTimes = [], lastFrame = 0;
  const cube = (parent, w, h, d, x, y, z, mat) => {
    const mesh = new THREE.Mesh(box, mat); mesh.scale.set(w, h, d); mesh.position.set(x, y, z); parent.add(mesh); return mesh;
  };
  const particles = new THREE.InstancedMesh(box, edgeGold, 32);
  particles.count = 0; scene.add(particles);
  const dummy = new THREE.Object3D();
  function resize() {
    const bounds = svg.getBoundingClientRect(), parent = host.getBoundingClientRect();
    const scale = host.offsetWidth ? parent.width / host.offsetWidth : 1;
    const next = Math.max(1, Math.min(bounds.width, bounds.height));
    const canvas = renderer.domElement;
    canvas.style.width = `${next / scale}px`; canvas.style.height = `${next / scale}px`;
    canvas.style.left = `${(bounds.left - parent.left) / scale}px`;
    canvas.style.top = `${(bounds.top - parent.top) / scale}px`;
    if (size !== next) { size = next; renderer.setSize(next, next, false); }
    wake(80);
  }
  const observer = new ResizeObserver(resize); observer.observe(svg);
  function build(next) {
    stage = next; graph.clear(); stars = []; trails = []; previousPath = []; particles.count = 0; burstAt = -Infinity;
    next.edges.forEach(edge => {
      const a = next.points[edge.from], b = next.points[edge.to];
      const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const group = new THREE.Group(); group.position.set((a[0]+b[0])/2, 100-(a[1]+b[1])/2, -4);
      group.rotation.z = Math.atan2(a[1]-b[1], b[0]-a[0]); graph.add(group);
      const rail = cube(group, length, .5, .5, 0, 0, 0, edge.gate ? rose : edge.directed ? violet : edgeDim);
      const stream = cube(group, length, .85, .65, 0, 0, .35, edgeGold); stream.visible = false;
      const gate = new THREE.Group();
      if (edge.gate) {
        group.add(gate);
        cube(gate, 2, 6, 2, 0, 0, 1, rose);
        cube(gate, 1, 4.5, 2.2, 0, 0, 1, brass);
      }
      trails.push({ edge, rail, stream, gate, litAt: -Infinity });
    });
    next.points.forEach(([x,y], index) => {
      const group = new THREE.Group(); group.position.set(x, 100-y, 0); graph.add(group);
      // Designed stacked square plinth, inset rim and chamfer-like stepped core.
      const pedestal = new THREE.Group(); pedestal.rotation.z = Math.PI / 4; group.add(pedestal);
      cube(pedestal, 8.7, 8.7, 1.3, 0, -.55, -3.2, base);
      cube(pedestal, 7.7, 7.7, .65, 0, 0, -2, brass);
      cube(pedestal, 6.8, 6.8, .9, 0, 0, -1.5, base);
      const jewel = new THREE.Group(); jewel.rotation.set(.32, .35, Math.PI/4); group.add(jewel);
      const core = cube(jewel, 4.9, 4.9, 3.7, 0, 0, .8, ivory);
      const cap = cube(jewel, 3.7, 3.7, .22, 0, 0, 2.78, ivory);
      const ring = new THREE.Group(); group.add(ring);
      for (let j=0;j<4;j++) {
        const marker = cube(ring, 1.3, 1.3, .6, Math.cos(j*Math.PI/2)*7, Math.sin(j*Math.PI/2)*7, -1, cyan);
        marker.rotation.z = Math.PI/4;
      }
      ring.visible = false;
      stars.push({ group, jewel, core, cap, ring, index, pulseAt: -Infinity });
    });
    resize();
  }
  function sync(nextState, nextPath, hint, nextTheme = theme) {
    if (!stage || disposed) return;
    theme = nextTheme; state = nextState; path = nextPath;
    const now = performance.now();
    const fresh = path.length > previousPath.length;
    const changed = path.join(',') !== previousPath.join(',');
    trails.forEach(t => {
      const used = state.used.has(t.edge.key);
      if (used && !t.stream.visible) t.litAt = now;
      t.stream.visible = used; t.stream.material = theme === 'aurora' ? cyan : edgeGold;
      t.rail.material = t.edge.gate ? state.keyFound ? mint : rose : t.edge.directed ? violet : edgeDim;
      t.gate.visible = !state.keyFound;
    });
    stars.forEach(s => {
      const current = s.index === state.current, visited = path.includes(s.index);
      let mat = visited ? theme === 'aurora' ? cyan : edgeGold : ivory;
      if (s.index === stage.keyNode) mat = edgeGold;
      if (s.index === hint) mat = cyan;
      s.core.material = s.cap.material = mat;
      s.ring.visible = current || s.index === hint || (!path.length && s.index === stage.forcedStart);
      if (fresh && current) s.pulseAt = now;
    });
    if (fresh) { burstAt = now; burstNode = stage.points[state.current]; }
    previousPath = [...path]; wake(changed || hint !== null ? 850 : 120);
  }
  function draw(now) {
    frame = 0;
    if (!active || document.hidden || lost || disposed) return;
    if (lastFrame && now-lastFrame < 150) { frameTimes.push(now-lastFrame); if(frameTimes.length>120)frameTimes.shift(); } lastFrame=now;
    stars.forEach(s => {
      const p = reduce.matches ? 1 : Math.min(1, Math.max(0, (now-s.pulseAt)/260));
      const pulse = Math.sin(p*Math.PI);
      s.jewel.scale.setScalar(1 + pulse*.18);
      s.jewel.position.z = pulse*1.2;
    });
    trails.forEach(t => {
      const p = reduce.matches ? 1 : Math.min(1, Math.max(0, (now-t.litAt)/300));
      t.stream.scale.y = .85 + Math.sin(p*Math.PI)*.6;
    });
    const age = (now-burstAt)/750, victory = state?.used.size === stage?.edges.length;
    particles.material = theme==='aurora' ? cyan : edgeGold;
    particles.count = !reduce.matches && burstNode && age>=0 && age<1 ? victory ? 32 : 8 : 0;
    for(let i=0;i<particles.count;i++) {
      const angle=i*2.39996, radius=age*(victory?30:10), s=(1-age)*(victory?.7:.45);
      dummy.position.set(burstNode[0]+Math.cos(angle)*radius,100-burstNode[1]+Math.sin(angle)*radius,5);
      dummy.scale.setScalar(s); dummy.rotation.set(age*3,age*4,angle); dummy.updateMatrix(); particles.setMatrixAt(i,dummy.matrix);
    }
    if(particles.count)particles.instanceMatrix.needsUpdate=true;
    renderer.render(scene,camera); host.classList.add('has-observatory-3d'); lastTime=now;
    if(now<until)frame=requestAnimationFrame(draw);
  }
  function wake(duration=850) {
    until = Math.max(until,performance.now()+(reduce.matches?120:duration));
    if(active&&!lost&&!disposed&&!document.hidden&&!frame)frame=requestAnimationFrame(draw);
  }
  function setActive(value) {
    active = value; lastFrame=0;
    if (!value) { cancelAnimationFrame(frame); frame=0; particles.count=0; burstAt=-Infinity; }
    else { resize(); wake(); }
  }
  const onLost = event => { event.preventDefault(); lost=true; cancelAnimationFrame(frame); frame=0; host.classList.remove('has-observatory-3d'); };
  const onRestored = () => { lost=false; wake(); };
  const onVisibility = () => { if(document.hidden){cancelAnimationFrame(frame);frame=0;particles.count=0;burstAt=-Infinity;}else wake(120); };
  renderer.domElement.addEventListener('webglcontextlost',onLost);
  renderer.domElement.addEventListener('webglcontextrestored',onRestored);
  document.addEventListener('visibilitychange',onVisibility);
  return {
    build, sync, setActive,
    stats: () => ({renderer:'Three.js r180',active,lost,framePending:!!frame,stars:stars.length,trails:trails.length,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures,drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,particles:particles.count,lastTime,meanFrameMs:frameTimes.length?frameTimes.reduce((a,b)=>a+b,0)/frameTimes.length:null}),
    dispose() { disposed=true;cancelAnimationFrame(frame);observer.disconnect();document.removeEventListener('visibilitychange',onVisibility);renderer.domElement.removeEventListener('webglcontextlost',onLost);renderer.domElement.removeEventListener('webglcontextrestored',onRestored);graph.clear();box.dispose();materials.forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove();host.classList.remove('has-observatory-3d'); }
  };
}
