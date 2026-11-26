import * as T from '../../src/vendor/three/r180-b59af7c93a55a6eb/three.module.min.js?wp-media=a4d649c8383eff35';
import { STATIONS } from './core.mjs?wp-media=a4d649c8383eff35';

export function mountObservatory(host, finish, pick, onContext) {
  const renderer = new T.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(1.75, devicePixelRatio));
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  host.append(canvas);
  const world = new T.Scene();
  const camera = new T.OrthographicCamera(-5.6, 5.6, 2.9, -2.9, .1, 40);
  camera.position.set(0, 5.8, 11);
  camera.lookAt(0, .9, 0);
  world.add(new T.HemisphereLight(0xd7e6ff, 0x504070, 2.15));
  const key = new T.DirectionalLight(0xffd6a1, 2.7);
  key.position.set(-5, 4, 5);
  const rim = new T.DirectionalLight(0x7acbff, 1.7);
  rim.position.set(3, 5, -4);
  world.add(key, rim);
  const resources = new Set();
  const material = (color, metalness = 0, emissive = 0) => {
    const m = new T.MeshStandardMaterial({ color, roughness: .55, metalness, emissive });
    resources.add(m);
    return m;
  };
  const cube = new T.BoxGeometry();
  const octagon = new T.CylinderGeometry(.5, .5, 1, 8);
  const lensShape = new T.IcosahedronGeometry(1, 1);
  resources.add(cube).add(octagon).add(lensShape);
  const stone = material(finish === 'stone' ? 0x6c8a99 : 0x2e4368);
  const navy = material(finish === 'amber' ? 0x946043 : 0x343c77, .24);
  const tile = material(0x4a6380);
  const brass = material(0xe3a367, .3);
  const dark = material(0x1b1933);
  const violet = material(0x7b65c8, .12);
  const cloudy = material(0x8797b7);
  const cyan = material(0x65d9ff, .32, 0x103d63);
  const glass = material(0x89e1ff, .26, 0x135577);
  const pulse = new T.MeshBasicMaterial({ color: 0xd3f9ff, transparent: true, opacity: .9 });
  resources.add(pulse);

  function add(owner, mat, x, y, z, w, h, d, geometry = cube) {
    const mesh = new T.Mesh(geometry, mat);
    mesh.position.set(x, y, z);
    mesh.scale.set(w, h, d);
    owner.add(mesh);
    return mesh;
  }

  const platforms = STATIONS.map((station, index) => {
    const group = new T.Group();
    group.position.set((index - 1) * 3.38, index === 1 ? -.18 : .15, index === 1 ? .3 : 0);
    group.userData.station = station;
    world.add(group);
    const accent = material([0x4cc8e0, 0xf6bd76, 0xad9aef][index], .13, 0x171a2a);
    const deck = add(group, tile, 0, -.02, 0, 2.7, .18, 2.05);
    add(group, stone, 0, -.29, .03, 2.52, .4, 1.92);
    add(group, dark, 0, -.52, -.05, 2.22, .16, 1.76);
    add(group, stone, 0, -1.06, .15, 1.88, 1, 1.46);
    add(group, dark, -.15, -1.83, -.06, 1.34, .59, 1.17);
    for (const x of [-1.22, 1.22]) {
      add(group, brass, x, .13, -.81, .09, .32, .11);
      add(group, brass, x, .13, .81, .09, .32, .11);
      add(group, brass, x, .32, 0, .075, .07, 1.66);
      add(group, dark, x, -.04, .63, .13, .1, .23);
    }
    for (let i = -2; i <= 2; i++) add(group, accent, i * .25, .078, .915, .15, .025, .09);
    add(group, navy, 0, .27, 0, 1.14, .37, .99);
    add(group, brass, 0, .49, 0, .87, .09, .88);
    add(group, stone, 0, .67, 0, .55, .28, .62, octagon);
    for (const x of [-.39, .39]) add(group, brass, x, .83, 0, .14, .52, .22);

    const tube = new T.Group();
    tube.position.set(0, 1.04, -.01);
    tube.rotation.z = .55;
    group.add(tube);
    add(tube, navy, .08, 0, 0, 1.27, .53, .51);
    add(tube, violet, .04, .285, 0, .76, .065, .42);
    for (const x of [-.36, .45]) {
      const ring = add(tube, brass, x, 0, 0, .65, .13, .65, octagon);
      ring.rotation.z = Math.PI / 2;
    }
    const lip = add(tube, dark, .65, 0, 0, .61, .23, .61, octagon);
    lip.rotation.z = Math.PI / 2;
    const lens = add(tube, glass, .78, 0, 0, .085, .235, .235, lensShape);
    add(tube, brass, -.65, 0, 0, .17, .25, .24);
    add(tube, cyan, .04, .08, .277, .18, .1, .04);

    const hood = add(tube, dark, .55, .32, 0, .47, .07, .61);
    hood.visible = false;
    const cloud = new T.Group();
    for (const [i, size] of [.68, .94, .7].entries()) {
      add(cloud, cloudy, -.55 + i * .48, i === 1 ? .12 : 0, -.4, size, .18 + .07 * i, .27);
    }
    cloud.position.set(0, 2.15, 0);
    group.add(cloud);
    const beam = add(tube, pulse, 1.37, 0, 0, 1.32, .045, .045);
    beam.visible = false;
    return { group, tube, cloud, lens, beam, hood, deck };
  });

  let job = 0;
  let expired = false;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  function render() { if (!expired && !renderer.getContext().isContextLost()) renderer.render(world, camera); }
  function resize() {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    const halfHeight = Math.max(2.7, 5.65 * height / width);
    const halfWidth = halfHeight * width / height;
    camera.left = -halfWidth;
    camera.right = halfWidth;
    camera.bottom = -halfHeight;
    camera.top = halfHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    render();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();

  const ray = new T.Raycaster();
  const pointer = new T.Vector2();
  function pointerUp(event) {
    const bounds = canvas.getBoundingClientRect();
    pointer.set((event.clientX - bounds.left) / bounds.width * 2 - 1, 1 - (event.clientY - bounds.top) / bounds.height * 2);
    ray.setFromCamera(pointer, camera);
    const hit = ray.intersectObjects(platforms.map(station => station.group), true).find(entry => entry.object.visible);
    for (let object = hit?.object; object; object = object.parent) {
      if (object.userData.station) { pick(object.userData.station); return; }
    }
  }
  function contextLost(event) {
    event.preventDefault();
    cancelAnimationFrame(job);
    onContext(true);
  }
  function contextRestored() { onContext(false); render(); }
  canvas.addEventListener('pointerup', pointerUp);
  canvas.addEventListener('webglcontextlost', contextLost);
  canvas.addEventListener('webglcontextrestored', contextRestored);

  return {
    draw(slots, selected, feedback) {
      cancelAnimationFrame(job);
      for (const [index, station] of platforms.entries()) {
        const name = STATIONS[index];
        const active = selected.includes(name);
        const weather = slots?.[name]?.weather;
        station.cloud.visible = weather === 'cloud';
        station.tube.rotation.z = active ? .71 : .43 + index * .11;
        station.hood.visible = weather === 'glare';
        station.beam.visible = Boolean(feedback?.stations?.includes(name));
        station.beam.scale.x = 1.32;
        station.lens.scale.y = station.beam.visible ? .29 : .235;
      }
      render();
      if (feedback?.stations?.length && !reduced.matches) {
        const start = performance.now();
        function animate(now) {
          const time = Math.min(1, (now - start) / 310);
          for (const s of platforms) if (s.beam.visible) s.beam.scale.x = 1.32 * (1 - .8 * time);
          render();
          if (time < 1 && !document.hidden) job = requestAnimationFrame(animate);
        }
        job = requestAnimationFrame(animate);
      }
    },
    stats() {
      const { render: { calls, triangles }, memory: { geometries, textures } } = renderer.info;
      return { calls, triangles, geometries, textures };
    },
    dispose() {
      expired = true;
      observer.disconnect();
      cancelAnimationFrame(job);
      canvas.removeEventListener('pointerup', pointerUp);
      canvas.removeEventListener('webglcontextlost', contextLost);
      canvas.removeEventListener('webglcontextrestored', contextRestored);
      for (const resource of resources) resource.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
