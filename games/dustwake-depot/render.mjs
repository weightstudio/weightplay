import * as THREE from '../purrch-grove/vendor/three/three.module.min.js';

// Dustwake's renderer owns only visual state. All route, cargo and timer decisions
// stay in core.mjs. Three r180 is the repository-pinned MIT runtime.
const PARTICLE_LIMIT = 48;
const WORLD = { left: -0.6, right: 9.6, top: -0.65, bottom: 7.65 };
const WARM = { sky: 0x8fc6ca, floor: 0xcdbc99, clean: 0xe6d6b0, stone: 0xd0c6ac, edge: 0x39796e, leaf: 0x76a368, dark: 0x264e50, metal: 0xc08b3e, light: 0xffda75 };
const COOL = { sky: 0x7dbaca, floor: 0x9ebfbc, clean: 0xc3dbd0, stone: 0xb0c7c2, edge: 0x367e8e, leaf: 0x6c9c8d, dark: 0x244957, metal: 0xc59a53, light: 0x8decf3 };
const clamp = (value, lo, hi) => Math.max(lo, Math.min(hi, value));
const finite = (value, fallback = 0) => Number.isFinite(value) ? value : fallback;
const cellKey = (x, z) => `${Math.round(x)},${Math.round(z)}`;
const color = new THREE.Color();
const v = new THREE.Vector3();
const matrix = new THREE.Matrix4();
const normalMatrix = new THREE.Matrix3();
const quaternion = new THREE.Quaternion();
const scale = new THREE.Vector3();
const identity = new THREE.Quaternion();

// Chamfered, flat-faced cuboids retain the approved stepped Block Animals
// silhouette. Faces, twelve edge bevels and eight corner facets are authored.
function chamferedCube() {
  const a = 0.5, b = 0.425, positions = [];
  const face = (points) => {
    for (let i = 1; i < points.length - 1; i++) positions.push(...points[0], ...points[i], ...points[i + 1]);
  };
  for (let axis = 0; axis < 3; axis++) {
    const u = (axis + 1) % 3, w = (axis + 2) % 3;
    for (const sign of [-1, 1]) {
      const points = [[-b, -b], [b, -b], [b, b], [-b, b]].map(([p, q]) => {
        const out = [0, 0, 0]; out[axis] = sign * a; out[u] = p; out[w] = q; return out;
      });
      if (sign < 0) points.reverse();
      face(points);
    }
  }
  for (let axis = 0; axis < 3; axis++) {
    const u = (axis + 1) % 3, w = (axis + 2) % 3;
    for (const su of [-1, 1]) for (const sw of [-1, 1]) {
      const points = [[-b, a, b], [b, a, b], [b, b, a], [-b, b, a]].map(([p, q, r]) => {
        const out = [0, 0, 0]; out[axis] = p; out[u] = su * q; out[w] = sw * r; return out;
      });
      if (su * sw > 0) points.reverse();
      face(points);
    }
  }
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) {
    const points = [[sx * a, sy * b, sz * b], [sx * b, sy * a, sz * b], [sx * b, sy * b, sz * a]];
    if (sx * sy * sz < 0) points.reverse();
    face(points);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  return geometry;
}

function debrisGeometry(kind) {
  const positions=[];
  const face=(points,up=false)=>{
    const center=new THREE.Vector3();for(const p of points)center.add(new THREE.Vector3(...p));center.divideScalar(points.length);
    for(let i=1;i<points.length-1;i++){
      const a=new THREE.Vector3(...points[0]),b=new THREE.Vector3(...points[i]),c=new THREE.Vector3(...points[i+1]);
      const normal=new THREE.Vector3().crossVectors(b.clone().sub(a),c.clone().sub(a));
      if(normal.dot(up?new THREE.Vector3(0,1,0):center)<0)positions.push(...a,...c,...b);else positions.push(...a,...b,...c);
    }
  };
  if(kind==='paper'){
    face([[-.5,0,-.4],[-.5,0,.4],[0,.12,.4],[0,.12,-.4]],true);
    face([[0,.12,-.4],[0,.12,.4],[.5,0,.4],[.5,0,-.4]],true);
  }else if(kind==='wet'){
    const base=[[-.5,-.5,-.5],[.5,-.5,-.5],[.5,-.5,.5],[-.5,-.5,.5]],middle=base.map(([x,,z])=>[x,.18,z]),top=base.map(([x,,z])=>[x*.80,.5,z*.80]);
    face(base);face(top);for(let i=0;i<4;i++){const j=(i+1)%4;face([base[i],base[j],middle[j],middle[i]]);face([middle[i],middle[j],top[j],top[i]]);}
  }else{
    const outline=[[-.5,-.30],[-.34,-.49],[.30,-.47],[.48,-.22],[.49,.27],[.27,.48],[-.26,.49],[-.48,.22]];
    const base=outline.map(([x,z])=>[x,-.45,z]),shoulder=outline.map(([x,z],i)=>[x*.72+.035,.09+(i%3)*.035,z*.72-.025]);
    face(base);for(let i=0;i<8;i++){const j=(i+1)%8;face([base[i],base[j],shoulder[j],shoulder[i]]);face([shoulder[i],shoulder[j],[.06,.43,-.04]]);}
  }
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.computeVertexNormals();geometry.computeBoundingSphere();return geometry;
}

function softContactGeometry() {
  const positions = [], colors = [], rings = [[0, .19], [.52, .16], [.82, .065], [1, 0]], segments = 32;
  const tint = new THREE.Color(0x163b31);
  const vertex = (radius, angle, alpha) => { positions.push(Math.cos(angle) * radius, Math.sin(angle) * radius, 0); colors.push(tint.r, tint.g, tint.b, alpha); };
  for (let ring = 0; ring < rings.length - 1; ring++) for (let i = 0; i < segments; i++) {
    const a = i / segments * Math.PI * 2, b = (i + 1) / segments * Math.PI * 2;
    const [r0, alpha0] = rings[ring], [r1, alpha1] = rings[ring + 1];
    vertex(r0, a, alpha0); vertex(r1, a, alpha1); vertex(r1, b, alpha1);
    if (r0) { vertex(r0, a, alpha0); vertex(r1, b, alpha1); vertex(r0, b, alpha0); }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 4));
  geometry.computeVertexNormals(); return geometry;
}

function builder(source, { bevel = 0 } = {}) {
  const position = [], normals = [], colors = [], uvs = [];
  const sourcePosition = source.getAttribute('position');
  const sourceNormal = source.getAttribute('normal');
  return {
    box(x, y, z, sx, sy, sz, tint, rotation = 0, tilt = 0) {
      color.set(tint);
      quaternion.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, rotation);
      if (tilt) quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), tilt));
      matrix.compose(v.set(x, y, z), quaternion, scale.set(bevel ? 1 : sx, bevel ? 1 : sy, bevel ? 1 : sz));
      normalMatrix.getNormalMatrix(matrix);
      const edge = Math.min(bevel, sx * .22, sy * .22, sz * .22);
      const bevelCoordinate = (q, size) => Math.sign(q) * (Math.abs(q) > .49 ? size / 2 : size / 2 - edge);
      for (let i = 0; i < sourcePosition.count; i++) {
        v.fromBufferAttribute(sourcePosition, i);
        if (bevel) v.set(bevelCoordinate(v.x, sx), bevelCoordinate(v.y, sy), bevelCoordinate(v.z, sz));
        v.applyMatrix4(matrix); position.push(v.x, v.y, v.z);
        v.fromBufferAttribute(sourceNormal, i).applyNormalMatrix(normalMatrix); normals.push(v.x, v.y, v.z);
        // Planar world-unit UVs preserve one material density on merged boxes,
        // including bevel faces. No illustrated surface is drawn by this code.
        const px = position[position.length - 3], py = position[position.length - 2], pz = position[position.length - 1];
        if (Math.abs(v.y) >= Math.max(Math.abs(v.x), Math.abs(v.z))) uvs.push(px, pz);
        else if (Math.abs(v.x) >= Math.abs(v.z)) uvs.push(pz, py);
        else uvs.push(px, py);
        colors.push(color.r, color.g, color.b);
      }
      return this;
    },
    terrace(points, top, depth, tint) {
      color.set(tint);
      const polygon = points.map(([x,z]) => new THREE.Vector2(x,z));
      const triangles = THREE.ShapeUtils.triangulateShape(polygon, []);
      const vertex = (x,y,z,nx,ny,nz) => {
        position.push(x,y,z); normals.push(nx,ny,nz); colors.push(color.r,color.g,color.b);
        if (Math.abs(ny) > .5) uvs.push(x,z);
        else uvs.push(Math.abs(nx) > Math.abs(nz) ? z : x,y);
      };
      for (const triangle of triangles) {
        const [a,b,c] = triangle.map(i => points[i]);
        const winding = (b[1]-a[1])*(c[0]-a[0])-(b[0]-a[0])*(c[1]-a[1]);
        for (const p of winding > 0 ? [a,b,c] : [a,c,b]) vertex(p[0],top,p[1],0,1,0);
      }
      const area = THREE.ShapeUtils.area(polygon), sign = area > 0 ? 1 : -1;
      for (let i=0;i<points.length;i++) {
        const a=points[i], b=points[(i+1)%points.length], dx=b[0]-a[0], dz=b[1]-a[1], length=Math.hypot(dx,dz);
        const nx=sign*dz/length, nz=-sign*dx/length;
        const strip = [[a[0],top,a[1]],[a[0],top-depth,a[1]],[b[0],top-depth,b[1]],[b[0],top,b[1]]];
        for (const ids of (sign>0 ? [[0,2,1],[0,3,2]] : [[0,1,2],[0,2,3]])) for(const j of ids) vertex(...strip[j],nx,0,nz);
      }
      return this;
    },
    ring(outer,inner,top,depth,tint) {
      color.set(tint);
      const emit=(a,b,c,nx,ny,nz)=>{
        const ab=new THREE.Vector3(...b).sub(new THREE.Vector3(...a)),ac=new THREE.Vector3(...c).sub(new THREE.Vector3(...a));
        const cross=new THREE.Vector3().crossVectors(ab,ac),n=new THREE.Vector3(nx,ny,nz);
        for(const p of cross.dot(n)>=0?[a,b,c]:[a,c,b]){
          position.push(...p);normals.push(nx,ny,nz);colors.push(color.r,color.g,color.b);
          uvs.push(Math.abs(ny)>.5?p[0]:Math.abs(nx)>Math.abs(nz)?p[2]:p[0],Math.abs(ny)>.5?p[2]:p[1]);
        }
      };
      const sign=THREE.ShapeUtils.area(outer.map(([x,z])=>new THREE.Vector2(x,z)))>0?1:-1;
      for(let i=0;i<outer.length;i++){
        const j=(i+1)%outer.length,a=outer[i],b=outer[j],c=inner[i],d=inner[j];
        emit([a[0],top,a[1]],[b[0],top,b[1]],[d[0],top,d[1]],0,1,0);
        emit([a[0],top,a[1]],[d[0],top,d[1]],[c[0],top,c[1]],0,1,0);
        for(const [p,q,normalSign] of [[a,b,sign],[c,d,-sign]]){
          const dx=q[0]-p[0],dz=q[1]-p[1],len=Math.hypot(dx,dz),nx=normalSign*dz/len,nz=-normalSign*dx/len;
          emit([p[0],top,p[1]],[p[0],top-depth,p[1]],[q[0],top-depth,q[1]],nx,0,nz);
          emit([p[0],top,p[1]],[q[0],top-depth,q[1]],[q[0],top,q[1]],nx,0,nz);
        }
      }
      return this;
    },
    waterGrid(cx,cz,sx,sz,top,columns,rows,rimTint,deepTint) {
      const rim=new THREE.Color(rimTint),deep=new THREE.Color(deepTint),acrossX=sx<sz;
      const vertex=(u,w)=>{
        const x=cx+(u-.5)*sx,z=cz+(w-.5)*sz,t=acrossX?u:w,bend=Math.sin(t*Math.PI)**2;
        const y=top+.012*Math.sin(x*1.7+z*.65)+.006*Math.cos(z*2.1-x*.25)-.018*bend;
        let dx=.0204*Math.cos(x*1.7+z*.65)+.0015*Math.sin(z*2.1-x*.25),dz=.0078*Math.cos(x*1.7+z*.65)-.0126*Math.sin(z*2.1-x*.25);
        if(acrossX)dx-=.018*Math.PI*Math.sin(t*2*Math.PI)/sx;else dz-=.018*Math.PI*Math.sin(t*2*Math.PI)/sz;
        v.set(-dx,1,-dz).normalize();position.push(x,y,z);normals.push(v.x,v.y,v.z);uvs.push(x,z);
        color.copy(deep).lerp(rim,1-bend*.82);colors.push(color.r,color.g,color.b);
      };
      for(let z=0;z<rows;z++)for(let x=0;x<columns;x++){
        const a=[x/columns,z/rows],b=[(x+1)/columns,z/rows],c=[x/columns,(z+1)/rows],d=[(x+1)/columns,(z+1)/rows];
        for(const p of [a,c,b,b,c,d])vertex(...p);
      }
      return this;
    },
    waterSurface(points, top, rimTint, deepTint) {
      const cx = points.reduce((sum,p)=>sum+p[0],0)/points.length, cz = points.reduce((sum,p)=>sum+p[1],0)/points.length;
      const rim = new THREE.Color(rimTint), deep = new THREE.Color(deepTint);
      const vertex = (x,z,radius) => {
        const wave=.024*Math.sin(x*1.7+z*.65)+.012*Math.cos(z*2.1-x*.25);
        const y=top+wave-.024*(1-radius);
        const dx=.0408*Math.cos(x*1.7+z*.65)+.003*Math.sin(z*2.1-x*.25);
        const dz=.0156*Math.cos(x*1.7+z*.65)-.0252*Math.sin(z*2.1-x*.25);
        v.set(-dx,1,-dz).normalize(); position.push(x,y,z); normals.push(v.x,v.y,v.z);
        color.copy(deep).lerp(rim,radius*radius); colors.push(color.r,color.g,color.b); uvs.push(x,z);
      };
      const ring=points.map(([x,z])=>[cx+(x-cx)*.52,cz+(z-cz)*.52]);
      const triangle=(a,b,c)=>{
        const cross=(b[1]-a[1])*(c[0]-a[0])-(b[0]-a[0])*(c[1]-a[1]);
        for(const p of cross>0?[a,b,c]:[a,c,b])vertex(p[0],p[1],p[2]);
      };
      for(let i=0;i<points.length;i++){
        const j=(i+1)%points.length, a=[...ring[i],.52],b=[...ring[j],.52],c=[...points[i],1],d=[...points[j],1];
        triangle([cx,cz,0],a,b);triangle(a,c,d);triangle(a,d,b);
      }
      return this;
    },
    geometry() {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
      geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      if (bevel) geometry.computeVertexNormals();
      geometry.computeBoundingSphere();
      return geometry;
    }
  };
}

export function mountRenderer({ container, onPointer = () => {}, onStatus = () => {}, reducedMotion = false, materialImages }) {
  if (!container?.appendChild) throw new TypeError('Dustwake renderer requires an arena container.');
  let renderer, scene, camera, disposed = false, lost = false, ready = false, renderFailed = false;
  let state = null, stageKey = '', stageGroup = null, frame = 0, previousFrameTime = 0;
  let resizeWidth = -1, resizeHeight = -1, resizeDpr = -1, sizeGeneration = 0, drawSizeGeneration = -1;
  let everReady = false, resizeDraws = 0, lastDraw = null;
  let recoveryAttempted = false, recoveryTimer = null, resolveRecovery = null;
  let activePointer = null, lastPointer = null, lastElapsed = 0, pendingRestored = false;
  const geometries = new Set(), materials = new Set(), stageGeometries = new Set(), listeners = [];
  const textures = new Set();
  let environmentTarget = null, environmentBuilds = 0, stoneMap = null, mossMap = null;
  const frameTimes = [], renderTimes = [], seenEvents = new Set(), initialPiles = new Map();
  const particles = Array.from({ length: PARTICLE_LIMIT }, () => ({ active: false, age: 0, duration: 0.3 }));
  const gates = [], depotModels = [], padModels = [];
  const persistentPickMeshes = [], stagePickMeshes = [], stagePickBlockers = [];
  const dryPickTargets = [], wetPickTargets = [], paperPickTargets = [], soilPickTargets = [];
  const peaks = { calls: 0, triangles: 0, geometries: 0, textures: 0 };
  let compressionConfirm = 0;
  let floor, dryDust, wetDust, paperScraps, soilPatches, specks, hero, targetRing, targetStem, trail, heroShadow, contactGeometry, contactMaterial;
  let keyLight, fillLight, hemiLight, cameraPortrait = false, cameraWideShort = false, cameraYaw = 0, cameraElevation = 0, hedgeTopGroup = null;
  const floorColors = Array.from({ length: 80 }, () => new THREE.Color());
  const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2();
  const ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), hit = new THREE.Vector3();
  const status = (type, detail = {}) => { if (!disposed) onStatus(type, { revision: THREE.REVISION, ...detail }); };
  const keepGeometry = (geometry) => (geometries.add(geometry), geometry);
  const keepMaterial = (material) => (materials.add(material), material);
  const listen = (element, type, fn, options) => {
    element.addEventListener(type, fn, options); listeners.push(() => element.removeEventListener(type, fn, options));
  };
  const mesh = (geometry, material, parent = scene) => {
    const object = new THREE.Mesh(geometry, material); object.castShadow = true; object.receiveShadow = true; parent.add(object); return object;
  };
  let block, plain, matte, skinMaterial, shellMossMaterial, stoneMaterial, mossMaterial, glossy, copperMaterial, enamelMaterial, waterMaterial, bronze, glow, depotLampMaterial, closedLamp, warningLamp, ringMaterial, depotRingMaterial, particleMaterial, numberMaterial;

  function mapStrength(material, strength, anchor = 0xffffff) {
    // THREE.Color(hex) converts the sRGB identity swatch to linear working RGB.
    // A green anchor lowers moss contrast without bleaching its mean color.
    const base=new THREE.Color(anchor),linear=`vec3(${base.r.toFixed(6)},${base.g.toFixed(6)},${base.b.toFixed(6)})`;
    material.onBeforeCompile = shader => {
      const chunk=THREE.ShaderChunk.map_fragment.replace('diffuseColor *= sampledDiffuseColor;', `sampledDiffuseColor.rgb=mix(${linear},sampledDiffuseColor.rgb,${strength.toFixed(3)});\n diffuseColor*=sampledDiffuseColor;`);
      shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',chunk);
    };
    material.customProgramCacheKey=()=>`dustwake-surface-strength-${strength}-${anchor}`;
    return material;
  }

  function makeSurfaceTexture(bitmap, name) {
    if (!bitmap || !(bitmap.width > 0) || !(bitmap.height > 0)) throw new TypeError(`Dustwake ${name} material bitmap is unavailable.`);
    // Loader crops the atlas and supplies an already flipY-oriented ImageBitmap.
    // The caller retains ownership for replay and context restoration.
    const texture = new THREE.Texture(bitmap); texture.name = `dustwake-${name}-albedo`;
    texture.flipY = false; texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
    texture.minFilter = THREE.LinearMipmapLinearFilter; texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    texture.needsUpdate = true; textures.add(texture); return texture;
  }

  function releaseEnvironment() {
    if (!environmentTarget) return;
    if (scene) scene.environment = null;
    textures.delete(environmentTarget.texture); environmentTarget.dispose(); environmentTarget = null;
  }

  function buildStudioEnvironment() {
    releaseEnvironment();
    const studio = new THREE.Scene(), panelGeometry = new THREE.PlaneGeometry(1, 1), panelMaterials = [];
    studio.background = new THREE.Color(0x293940);
    const panel = (x, y, z, width, height, tint, strength) => {
      const material = new THREE.MeshBasicMaterial({ color: new THREE.Color(tint).multiplyScalar(strength), side: THREE.DoubleSide });
      panelMaterials.push(material);
      const object = new THREE.Mesh(panelGeometry, material); object.position.set(x, y, z); object.scale.set(width, height, 1); object.lookAt(0, 0, 0); studio.add(object);
    };
    // Broad luminous cards create smooth, differently colored reflection bands
    // on enamel and bronze. This is lighting only, never a bitmap backdrop.
    panel(-5, 7, 4, 8, 6, 0xffeed7, 5.2);
    panel(7, 3, -4, 3.5, 7, 0xb5e4f6, 3.1);
    panel(1, 9, -1, 7, 6, 0xf3fcf8, 2.1);
    panel(0, -6, 0, 18, 18, 0x697d69, .45);
    const generator = new THREE.PMREMGenerator(renderer);
    try {
      environmentTarget = generator.fromScene(studio, .055, .1, 40, { size: 128 });
      environmentTarget.texture.name = 'dustwake-studio-ibl-128'; textures.add(environmentTarget.texture);
      scene.environment = environmentTarget.texture; scene.environmentIntensity = .58; environmentBuilds++;
    } finally {
      generator.dispose(); panelGeometry.dispose(); panelMaterials.forEach(material => material.dispose()); studio.clear();
    }
  }

  function markNavigation(root, target, persistent = false) {
    root.traverse(object => {
      if (!object.isMesh) return;
      object.userData.dustwakeNavigation = target;
      (persistent ? persistentPickMeshes : stagePickMeshes).push(object);
    });
  }

  // One bounded functional-number atlas serves all deployment positions. These
  // are world labels, not substitute illustrated gameplay artwork.
  function makeNumberAtlas() {
    const canvas = document.createElement('canvas'); canvas.width = 384; canvas.height = 128;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Deployment number labels could not be created.');
    context.clearRect(0, 0, 384, 128); context.fillStyle = '#fff5d5';
    context.font = '800 96px system-ui, sans-serif'; context.textAlign = 'center'; context.textBaseline = 'middle';
    for (let i = 0; i < 3; i++) context.fillText(String(i + 1), i * 128 + 64, 69);
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearMipmapLinearFilter; texture.magFilter = THREE.LinearFilter;
    textures.add(texture);
    return keepMaterial(new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, toneMapped: false }));
  }

  function makeNumberLabel(number, parent) {
    const geometry = keepGeometry(new THREE.PlaneGeometry(.42, .56)); stageGeometries.add(geometry);
    const uv = geometry.getAttribute('uv');
    for (let i = 0; i < uv.count; i++) uv.setX(i, (number - 1 + uv.getX(i)) / 3);
    const label = mesh(geometry, numberMaterial, parent);
    label.name = `deployment-position-${number}`;
    label.rotation.set(-Math.PI / 2, 0, cameraYaw); label.position.y = .068;
    label.castShadow = false; label.receiveShadow = false;
    return label;
  }

  function groupFromBuild(build, parent, { stage = false, material = matte } = {}) {
    const geometry = build.geometry();
    keepGeometry(geometry); if (stage) stageGeometries.add(geometry);
    return mesh(geometry, material, parent);
  }

  function makeTaro() {
    const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
    root.name = 'moss-shell-taro';
    const build = () => builder(block);
    const torso = build();
    torso.box(0, .26, -.02, .51, .23, .64, 0xd4c46c).box(0, .32, .24, .43, .22, .22, 0xded189)
      .box(0, .37, .38, .50, .09, .14, 0x347c41).box(-.09, .25, .39, .11, .25, .055, 0x3d9b47)
      .box(.08, .29, .40, .12, .18, .06, 0x4dba53);
    groupFromBuild(torso, body,{material:skinMaterial});
    const shellRoot = new THREE.Group(); shellRoot.name = 'taro-fortress-shell'; body.add(shellRoot);
    const shell = builder(block,{bevel:.014}), shellStone=builder(block,{bevel:.012}), shellDetails=builder(plain),shellWater=builder(plain);
    shellDetails.box(0,.43,-.08,.72,.23,.77,0x87703b);
    shell.box(0, .55, -.08, .68, .15, .73, 0x76a93d)
      .box(0, .64, -.12, .51, .12, .51, 0x9bc64a).box(0, .73, -.16, .30, .12, .32, 0x6c9c39);
    for (const x of [-.28, .28]) for (const z of [-.32, -.10, .12]) {
      shellStone.box(x, .58, z, .15, .14, .19, 0xc8c6ac);shell.box(x * .82, .68, z - .01, .13, .07, .16, 0x8cbd39);
    }
    for (const x of [-.17, .17]) shellStone.box(x, .74, .06, .12, .18, .13, 0xcdcdb5);
    shellStone.box(0, .85, .05, .30, .08, .14, 0xd8d3b7);
    shellDetails.box(0, .73, .136, .17, .17, .025, 0x765034)
      .box(.025, .72, .154, .025, .03, .012, 0xf9ce64);
    for (let i = 0; i < 3; i++) shellStone.box(0, .59 + i * .035, .29 - i * .06, .22, .035, .10, 0xd4cfaf);
    for (const [x, z] of [[-.22, -.27], [.23, -.25]]) {
      shellDetails.box(x, .76, z, .045, .17, .045, 0x947344);shell.box(x, .87, z, .19, .15, .18, 0x64a332)
        .box(x - .025, .95, z, .14, .08, .14, 0x9bd13d);
    }
    shellDetails.box(.105, .96, -.21, .03, .29, .03, 0xa87c40).box(.20, 1.035, -.21, .20, .13, .028, 0x569c37)
      .box(.20, 1.025, -.19, .018, .045, .009, 0xe3dc67).box(.174, 1.048, -.19, .039, .024, .009, 0xe3dc67)
      .box(.22, 1.060, -.19, .040, .024, .009, 0xe3dc67);
    shellWater.box(-.26, .64, .23, .075, .04, .10, 0x2796b0).box(-.27, .60, .31, .095, .03, .13, 0x71d3dd);
    for (const [x, z] of [[-.21, .12], [.21, .10]]) {
      shellDetails.box(x, .72, z, .025, .025, .025, 0xf6c751).box(x, .72, z, .065, .018, .025, 0xfff3ce)
        .box(x, .72, z, .025, .018, .065, 0xfff3ce);
    }
    groupFromBuild(shell, shellRoot,{material:shellMossMaterial});groupFromBuild(shellStone,shellRoot,{material:stoneMaterial});
    groupFromBuild(shellDetails,shellRoot);groupFromBuild(shellWater,shellRoot,{material:waterMaterial});
    const amber = new THREE.Group(); shellRoot.add(amber);
    const amberBuild = build();
    for (const [x, z] of [[-.3, -.25], [.3, -.25], [.3, .23]]) {
      amberBuild.box(x, .73, z, .06, .12, .06, 0x9a6a37).box(x, .82, z, .09, .09, .09, 0xf9bb40)
        .box(x, .87, z, .11, .025, .11, 0x7c5332).box(x, .76, z, .11, .025, .11, 0x7c5332);
    }
    amberBuild.box(-.13, .80, -.28, .08, .035, .06, 0xe6b73f).box(.10, .68, .24, .07, .025, .05, 0xf4d266);
    groupFromBuild(amberBuild, amber, { material: glossy });
    const head = new THREE.Group(); head.name = 'taro-head'; head.position.set(0, .50, .50); head.scale.set(1.50, 1.60, 1.25); body.add(head);
    const face = build();
    face.box(0, .035, 0, .39, .31, .30, 0x80b842).box(0, .18, -.015, .42, .09, .31, 0x9d8a4f)
      .box(0, .235, -.025, .30, .055, .24, 0xc6a967).box(-.15, -.045, .12, .12, .15, .12, 0xc5d872)
      .box(.15, -.045, .12, .12, .15, .12, 0xc5d872).box(0, -.005, .175, .24, .10, .13, 0xd2de7a)
      .box(-.065, .015, .247, .025, .025, .008, 0x6f9141).box(.065, .015, .247, .025, .025, .008, 0x6f9141)
      .box(0, -.09, .17, .15, .045, .03, 0x743d2e).box(0, -.105, .19, .10, .02, .025, 0xea8a62);
    const eyes=new THREE.Group();eyes.name='taro-eyes';eyes.position.y=.065;head.add(eyes);const eyeBuild=build();
    for (const x of [-.13, .13]) {
      eyeBuild.box(x,0,.159,.105,.145,.024,0xfff3db).box(x+.007,-.005,.176,.061,.108,.013,0x352519)
        .box(x+.007,-.033,.184,.053,.035,.006,0x9d5f27).box(x-.006,.025,.190,.025,.035,.008,0xffffff);
      face.box(x, .145, .17, .12, .03, .04, 0x477f33);
    }
    groupFromBuild(eyeBuild,eyes,{material:skinMaterial});
    face.box(0, .21, .133, .12, .09, .027, 0x3e7f35).box(0, .20, .151, .012, .04, .012, 0xd7d76b)
      .box(-.017, .22, .151, .028, .018, .012, 0xe0dd78).box(.017, .23, .151, .028, .018, .012, 0xe0dd78);
    groupFromBuild(face, head,{material:skinMaterial});
    const crown=builder(block,{bevel:.008});for(const x of [-.15,0,.15])crown.box(x,.15,.15,.135,.055,.025,0xc9c6a9);
    groupFromBuild(crown,head,{material:stoneMaterial});
    const legs = [];
    for (const x of [-.30, .30]) for (const z of [-.31, .27]) {
      const leg = new THREE.Group(); leg.position.set(x, .25, z); body.add(leg);
      leg.name = `taro-leg-${x < 0 ? 'left' : 'right'}-${z < 0 ? 'rear' : 'front'}`;
      const limb = build(); limb.box(0, -.07, 0, .19, .29, .20, 0x62a538).box(0, -.205, .05, .23, .08, .25, 0x8ac648);
      for (const toe of [-.07, 0, .07]) limb.box(toe, -.217, .175, .060, .065, .075, 0xf2e9c9);
      groupFromBuild(limb, leg,{material:skinMaterial}); legs.push(leg);
    }
    const bags = new THREE.Group(); body.add(bags);
    const bagBuild=builder(block,{bevel:.010}),bagMetal=builder(block,{bevel:.006}),papers=builder(plain);
    for (const x of [-.37, .37]) {
      bagBuild.box(x,.30,-.12,.14,.20,.26,0x158b98);
      bagMetal.box(x,.405,-.12,.16,.035,.27,0xc48b48).box(x*1.20,.31,-.02,.025,.06,.07,0xf5cf70);
    }
    papers.box(-.37,.49,-.10,.04,.16,.04,0xeee2b8).box(-.43,.48,-.10,.04,.14,.04,0xd8cba6);
    bagBuild.box(-.43,.32,.025,.13,.20,.045,0x318a87);
    bagMetal.box(-.43,.32,.052,.075,.12,.018,0xf4c95f).box(-.43,.425,.025,.15,.025,.065,0xc69c52).box(-.43,.215,.025,.15,.025,.065,0xc69c52);
    groupFromBuild(bagBuild,bags,{material:enamelMaterial});groupFromBuild(bagMetal,bags,{material:copperMaterial});groupFromBuild(papers,bags);
    const cargo = new THREE.Group(); bags.add(cargo);
    const fill = build(); fill.box(-.37, .53, -.08, .12, .10, .16, 0xe1ad4b).box(.37, .53, -.08, .12, .10, .16, 0xe1ad4b);
    groupFromBuild(fill, cargo);
    const tool = new THREE.Group(); tool.position.set(.15, .09, .63); body.add(tool);
    const rubber=builder(block,{bevel:.008});rubber.box(.19,.19,-.22,.07,.09,.40,0x293d41);
    groupFromBuild(rubber,tool);
    const tube = build(); tube.box(.19, .12, -.01, .085, .18, .085, 0xaa8c52).box(.10, .06, .02, .28, .07, .10, 0xcfb37a);
    groupFromBuild(tube, tool, { material: copperMaterial });
    const vacuum = new THREE.Group(); tool.add(vacuum);
    groupFromBuild(build().box(0, 0, .055, .38, .12, .20, 0x1a919d).box(0, -.035, .16, .30, .045, .025, 0x273e3b), vacuum, { material: enamelMaterial });
    groupFromBuild(build().box(0, .065, .045, .28, .025, .12, 0xe1c67f).box(0, .072, .045, .18, .012, .07, 0xf8cb64)
      .box(-.18, 0, .055, .035, .13, .21, 0xb98e4e).box(.18, 0, .055, .035, .13, .21, 0xb98e4e), vacuum, { material: copperMaterial });
    const brush = new THREE.Group(); tool.add(brush);
    const brushBuild = build(); brushBuild.box(0, .04, .06, .38, .07, .18, 0xe0c78e);
    for (let x = -.15; x <= .16; x += .06) for (const z of [0, .09]) brushBuild.box(x, -.02, z, .035, .08, .05, 0x4e8685);
    groupFromBuild(brushBuild, brush);
    const press = new THREE.Group(); shellRoot.add(press);
    groupFromBuild(build().box(.40, .35, -.02, .24, .045, .27, 0x3d519d)
      .box(.515, .51, -.06, .035, .30, .035, 0x4b5db2).box(.285, .51, -.06, .035, .30, .035, 0x4b5db2)
      .box(.40, .67, -.06, .27, .05, .12, 0x5965b6), press,{material:enamelMaterial});
    const pressPlaten = new THREE.Group(); press.add(pressPlaten);
    pressPlaten.name = 'taro-compression-platen';
    groupFromBuild(build().box(.40, .58, -.02, .23, .055, .25, 0xd4aa57)
      .box(.40, .625, -.06, .04, .07, .04, 0x788989), pressPlaten,{material:copperMaterial});
    const pressSignalMaterial = keepMaterial(new THREE.MeshStandardMaterial({ color: 0xffd28b, emissive: 0xe3a33e, emissiveIntensity: .12, roughness: .4 }));
    const pressSignal = mesh(block, pressSignalMaterial, press);
    pressSignal.scale.set(.16, .025, .025); pressSignal.position.set(.40, .67, .01);
    // The authored anatomy is deliberately larger than the first slice. The
    // contact patch remains centred on core's point; no collision is resized.
    root.scale.setScalar(1.15);
    return { root, body, head, eyes, shellRoot, legs, amber, bags, cargo, tool, vacuum, brush, press, pressPlaten, pressSignalMaterial };
  }

  function makeDepot(x, z, portable, palette) {
    const root = new THREE.Group(); root.position.set(x, 0, z); stageGroup.add(root);
    root.name = portable ? 'portable-depot' : 'base-depot';
    root.scale.setScalar(portable ? 1.04 : 1.12);
    root.rotation.y = cameraYaw;
    const pad=builder(block,{bevel:.014});pad.box(0,.02,0,.89,.07,.87,0x287778).box(0,.063,.07,.74,.025,.62,0x84bbb0);
    groupFromBuild(pad,root,{stage:true,material:enamelMaterial});
    const receiver=new THREE.Group();receiver.name='depot-receiver';receiver.position.set(portable?-.4:-.69,portable?.035:.27,portable?.08:-.03);receiver.scale.set(portable?.64:1,portable?.78:1,portable?.86:1);root.add(receiver);
    const coat=builder(block,{bevel:.035}),metal=builder(block,{bevel:.025}),recess=builder(plain),foundation=builder(block,{bevel:.014});
    foundation.box(0,.015,-.50,.82,.065,.50,palette.stone);
    coat.box(0,.26,-.50,.72,.44,.32,0x147984).box(0,.50,-.53,.78,.10,.26,0x21999d)
      .box(-.30,.27,-.29,.075,.29,.08,0x2b9da0).box(.30,.27,-.29,.075,.29,.08,0x2b9da0);
    recess.box(0,.27,-.323,.54,.272,.020,0x102f38);
    const beaconZ=portable?-.05:-.54;
    metal.box(0,.42,-.285,.63,.075,.085,0xd8a34c).box(0,.128,-.285,.63,.055,.085,0xb9863e)
      .box(-.35,.23,-.50,.035,.30,.34,0xc99a48).box(.35,.23,-.50,.035,.30,.34,0xc99a48)
      .box(0,.54,-.67,.84,.08,.08,0xd0a552).box(0,.54,-.39,.84,.08,.08,0xd0a552)
      .box(-.38,.54,-.53,.08,.08,.20,0xc49548).box(.38,.54,-.53,.08,.08,.20,0xc49548)
      .box(-.25,.55,beaconZ,.045,.14,.045,0xbb8d45).box(-.25,.67,beaconZ,.16,.025,.14,0xbc8c41);
    if(portable)metal.box(.26,.54,-.53,.035,.19,.035,0xc99749);
    groupFromBuild(foundation,receiver,{stage:true,material:stoneMaterial});
    groupFromBuild(coat,receiver,{stage:true,material:enamelMaterial});
    groupFromBuild(recess,receiver,{stage:true});
    const copperFrame=groupFromBuild(metal,receiver,{stage:true,material:copperMaterial});copperFrame.castShadow=false;
    const belt=builder(block,{bevel:.008}),rails=builder(block,{bevel:.006});
    if(portable){
      const yaw=Math.atan2(-.4,-.178),length=.438,cx=-.2,cz=-.089;
      belt.box(cx,.13,cz,.23,.035,length,0x258c91,yaw,-.36);
      for(const side of [-1,1])rails.box(cx+Math.cos(yaw)*side*.135,.14,cz-Math.sin(yaw)*side*.135,.025,.05,length,0xc89949,yaw,-.36);
    }else{
      const yaw=Math.atan2(-.69,-.34),length=.84,cx=-.345,cz=-.17;
      belt.box(cx,.24,cz,.25,.035,length,0x258c91,yaw,-.48);
      for(const side of [-1,1])rails.box(cx+Math.cos(yaw)*side*.15,.25,cz-Math.sin(yaw)*side*.15,.025,.055,length,0xc89949,yaw,-.48);
    }
    groupFromBuild(belt,root,{stage:true,material:enamelMaterial});const railMesh=groupFromBuild(rails,root,{stage:true,material:copperMaterial});railMesh.castShadow=false;
    const ring = mesh(keepGeometry(new THREE.TorusGeometry(.42, .035, 4, 32)), depotRingMaterial, root);
    stageGeometries.add(ring.geometry); ring.rotation.x = -Math.PI / 2; ring.position.y = .084;
    const lamp = mesh(block, depotLampMaterial, receiver); lamp.scale.set(.12,.09,.11);lamp.position.set(-.25,.60,beaconZ);
    const arrow = mesh(keepGeometry(new THREE.ConeGeometry(.095, .17, 3)), bronze, root); stageGeometries.add(arrow.geometry);
    arrow.rotation.x = -Math.PI / 2; arrow.position.set(0, .10, .24); arrow.castShadow = false;
    const contact=mesh(contactGeometry,contactMaterial,root);contact.rotation.x=-Math.PI/2;contact.position.set(0,.012,-.22);contact.scale.set(.59,.58,1);contact.castShadow=false;contact.receiveShadow=false;
    markNavigation(root, { x, z });
    return { root, receiver, ring, lamp, x, z, portable };
  }

  function makeGate(definition, index, palette, walls) {
    const x = definition.x ?? definition.cell?.[0] ?? 4, z = definition.z ?? definition.cell?.[1] ?? 3;
    const root = new THREE.Group(); root.position.set(x, 0, z); stageGroup.add(root);
    const verticalWall = walls.has(cellKey(x, z - 1)) || walls.has(cellKey(x, z + 1));
    if (verticalWall) root.rotation.y = Math.PI / 2;
    const b = builder(plain);
    for (const side of [-1, 1]) b.box(side * .42, .36, 0, .12, .70, .15, palette.edge)
      .box(side * .42, .73, 0, .17, .07, .20, palette.metal).box(side * .42, .05, 0, .23, .08, .30, palette.stone);
    b.box(0, .75, 0, .85, .08, .10, palette.metal);
    groupFromBuild(b, root, { stage: true });
    const barrier = new THREE.Group(); root.add(barrier);
    const bars = builder(plain);
    for (const y of [.20, .40]) bars.box(0, y, 0, .76, .08, .065, 0xcd874d);
    for (const xSide of [-.28, -.12, .04, .20]) bars.box(xSide, .30, .038, .045, .28, .025, 0xf5d180);
    groupFromBuild(bars, barrier, { stage: true });
    const fan = new THREE.Group(); fan.position.set(-.42, .48, .10); root.add(fan);
    const blades = builder(plain);
    blades.box(0, 0, 0, .055, .055, .06, 0xf1d19a);
    for (const r of [0, Math.PI / 2]) {
      const strip = mesh(block, bronze, fan); strip.scale.set(.18, .035, .025); strip.rotation.z = r;
    }
    groupFromBuild(blades, fan, { stage: true });
    const lamp = mesh(block, glow, root); lamp.scale.set(.12, .05, .07); lamp.position.set(.26, .81, 0);
    const airflow = new THREE.Group(); root.add(airflow);
    for (let i = 0; i < 3; i++) {
      const bar = mesh(plain, ringMaterial, airflow); bar.scale.set(.52 - i * .08, .008, .025);
      bar.position.set(0, .03, .18 + i * .13);
    }
    return { root, barrier, fan, lamp, airflow, definition, index, lastOpen: null, openStartedAt: 0 };
  }

  function makeGardenSurround(palette, chapter) {
    const terrain = builder(plain), meadow = builder(plain), planting = builder(plain), water = builder(plain), flowerStones = builder(block, { bevel: .04 });
    const cold = chapter === 2;
    // Continuous, fully modelled terrace gardens occupy the unused camera
    // margin. They are scenery beyond the solid arena border, never new routes.
    meadow.box(4.5, -1.18, 3.5, 46, .32, 42, cold ? 0x759e9a : 0xb8cba5);
    terrain.box(4.5, -.75, 3.5, 12.2, .28, 10.1, palette.edge)
      .box(4.5, -.56, 3.5, 11.2, .16, 9.1, palette.stone);
    const shores = [
      [[-7,-4],[-3.3,-4],[-2.5,-2.4],[-1.7,-.7],[-1.6,1.5],[-2.2,2.3],[-1.7,4.4],[-1.8,7.4],[-3.4,10.2],[-7,11]],
      [[11.0,-3],[15,-4],[17,2],[16,9],[13,12],[11,9],[10.8,6.1],[11.5,4.6],[10.8,2.0]],
      [[-1.3,-6],[11,-6],[12,-3.4],[8,-2.6],[5,-3.1],[2,-2.5],[-1,-3.3]],
      [[-1,10.2],[2,9.4],[4.7,10.1],[8.1,9.4],[11.3,10.6],[11,15],[-1,15]]
    ];
    for (const [i,points] of shores.entries()) {
      meadow.terrace(points,-.94,.16,cold ? (i%2 ? 0xb1c8ba : 0x8fb6ad) : (i%2 ? 0xe0e3bd : 0xc6d7b1));
    }
    // Two stepped pools break the former long, flat green bands at the portrait
    // ends. Their physical shoreline and stone shelves remain pure scenery.
    for (const [i,[cx,cz]] of [[-3.35,3.0],[12.4,4.4]].entries()) {
      const outline=[[-1.8,-1.1],[-.4,-1.65],[1.1,-1.2],[1.5,-.1],[1.05,.95],[-.15,1.35],[-1.55,.8]];
      const shore=outline.map(([x,z])=>[cx+x,cz+z]),inner=outline.map(([x,z])=>[cx+x*.87,cz+z*.87]);
      // The shore is an annulus, not a filled polygon lid over the water.
      terrain.ring(shore,inner,-.72,.20,cold ? 0xb5c9c2 : 0xcfc8ae)
        .terrace(inner,-.96,.08,0x547a81);
      water.waterSurface(inner,-.78,cold ? 0x78c2d3 : 0x6ab9c5,cold ? 0x315e91 : 0x326c96);
      meadow.terrace([[cx-1.8,cz+.8],[cx-.65,cz+.65],[cx+.1,cz+1.2],[cx-.5,cz+2.1],[cx-1.8,cz+1.8]],-.74,.12,cold ? 0x9cbfae : 0xc4d7a7);
      flowerStones.box(cx+1.72,-.64,cz-1.12,.85,.30,.65,palette.stone,.25+i*.4)
        .box(cx+1.48,-.51,cz-1.25,.54,.25,.47,palette.clean,-.22);
    }
    // Unequal garden clusters leave deliberate breathing spaces between cream
    // stone, moss and water. They stay below the arena rim and outside routes.
    const beds = [[.6,-1.15,2.5,.70,-.04],[5.2,-1.18,3.6,.82,.02],[9.4,-1.18,1.8,.64,-.06],
      [1.4,8.12,3.5,.75,.03],[6.9,8.22,2.7,.86,-.035],[-1.18,1.25,.72,2.4,-.04],
      [-1.2,5.7,.82,2.1,.06],[10.2,3.9,.76,3.9,.025]];
    for (const [index, [x,z,sx,sz,turn]] of beds.entries()) {
      terrain.box(x,-.43,z,sx,.18,sz,palette.stone,turn);
      meadow.box(x,-.29,z,sx*.92,.10,sz*.89,cold ? 0xb4cfc0 : 0xdbdfb2,turn)
        .box(x-sx*.16,-.20,z+sz*.09,sx*.49,.10,sz*.58,cold ? 0x8bb4a3 : 0xb9d29d,-turn);
      for (let i=0;i<3;i++) {
        const along=(i-1)*.27, fx=x+(sx>sz?along*sx:.08*(i-1)), fz=z+(sx>sz?.1*(i%2):along*sz);
        const petal=cold ? (index%2 ? 0xe7bcd4 : 0xbddfda) : (index%2 ? 0xe7afa1 : 0xf6e0aa);
        planting.box(fx,-.095,fz,.24,.055,.09,petal).box(fx,-.095,fz,.09,.055,.24,petal)
          .box(fx,-.055,fz,.07,.03,.07,0xecc765);
      }
    }
    for (const [x, z] of [[-2.9, .3], [-2.4, 6.3], [11.6, .5], [13.2, 2.0], [1.4, -2.8], [7.6, -3.2], [1.1, 9.8], [7.2, 10.4]]) {
      terrain.box(x, -.64, z, 1.24, .43, .86, palette.stone).box(x - .24, -.49, z + .20, .82, .32, .90, palette.edge)
        .box(x + .32, -.37, z - .10, .58, .20, .66, palette.leaf);
      planting.box(x, .24, z, .19, .58, .18, 0x795c3b).box(x, .55, z, .92, .43, .78, palette.leaf)
        .box(x - .20, .84, z - .04, .61, .26, .57, cold ? 0x75b8a4 : 0x97bf4f)
        .box(x + .33, .39, z + .16, .44, .31, .43, cold ? 0x4c8f84 : 0x5f9a3b)
        .box(x - .36, .50, z + .22, .40, .30, .41, cold ? 0x659f89 : 0x82b849);
    }
    // River surfaces sit inside low stone channels rather than floating over
    // the meadow; the channel banks remain below the playable arena rim.
    const canalTint=cold ? 0x7a9d9f : 0x8aab98;
    terrain.box(-2,-.94,4.0,1.55,.18,14.3,canalTint)
      .box(-2.73,-.83,4.0,.10,.25,14.3,canalTint).box(-1.27,-.83,4.0,.10,.25,14.3,canalTint)
      .box(4.0,-.94,-2,16.4,.18,1.8,canalTint)
      .box(4.0,-.83,-2.85,16.4,.25,.10,canalTint).box(4.0,-.83,-1.15,16.4,.25,.10,canalTint);
    const riverRim=cold ? 0x70bbd0 : 0x65b5bf,riverDeep=cold ? 0x326c95 : 0x327087;
    // Uniform grids produce smooth cross-channel depth. The three surfaces
    // meet at their edge and never overlap into fan-shaped highlight seams.
    water.waterGrid(-2,4,1.2,14.15,-.82,4,28,riverRim,riverDeep)
      .waterGrid(-3.35,-2,1.5,1.2,-.82,4,4,riverRim,riverDeep)
      .waterGrid(5.35,-2,13.5,1.2,-.82,28,4,riverRim,riverDeep);
    for (const [i, [x, z]] of [[-3.1, -.3], [-2.8, 4.8], [11.2, 6.0], [6.8, 9.4]].entries()) {
      flowerStones.box(x, -.63, z, .85, .43, .59, palette.stone, .17 + i * .23)
        .box(x + .40, -.72, z + .26, .52, .30, .47, palette.clean, -.20 - i * .12);
      const petal = cold ? (i % 2 ? 0xebc1df : 0xd9f1eb) : (i % 2 ? 0xf1b19d : 0xf7e5ac);
      planting.box(x - .24, -.36, z + .12, .28, .06, .10, petal)
        .box(x - .24, -.36, z + .12, .10, .06, .28, petal).box(x - .24, -.315, z + .12, .08, .04, .08, 0xe7bc46);
    }
    for (const [x, z] of [[-3.6, -3.8], [12.6, -3.8], [-3.6, 10.8], [12.6, 10.8]]) {
      terrain.box(x, -.65, z, 2.3, .55, 2.3, palette.edge).box(x, -.15, z, 1.8, .45, 1.8, palette.stone)
        .box(x, .29, z, 1.25, .45, 1.25, palette.stone).box(x, .57, z, 1.48, .12, 1.48, palette.clean);
      for (const sx of [-.48, .48]) for (const sz of [-.48, .48]) terrain.box(x + sx, 1.05, z + sz, .15, .85, .15, palette.metal);
      terrain.box(x, 1.52, z, 1.48, .17, 1.48, palette.leaf).box(x, 1.66, z, .95, .15, .95, cold ? 0x70aaa1 : 0x9ab65b);
      water.box(x, .15, z + .67, .43, 1.1, .055, cold ? 0x7dd6e2 : 0x5bd2d6)
        .box(x, -.48, z + 1.03, .8, .035, .63, 0x67c2ca);
      planting.box(x - .44, 1.16, z - .42, .09, .19, .09, palette.light).box(x + .44, 1.16, z - .42, .09, .19, .09, palette.light);
    }
    for (const [x, z] of [[-1.3, -1.3], [10.3, -1.3], [-1.3, 8.3], [10.3, 8.3]]) {
      terrain.box(x, -.16, z, .32, .69, .32, palette.stone).box(x, .22, z, .20, .14, .20, palette.metal)
        .box(x, .41, z, .27, .26, .27, palette.light).box(x, .57, z, .36, .06, .36, palette.metal);
    }
    const gardenStone = groupFromBuild(terrain, stageGroup, { stage: true, material: stoneMaterial }); gardenStone.name='garden-stone';gardenStone.castShadow = false;
    const gardenMoss = groupFromBuild(meadow, stageGroup, { stage: true, material: mossMaterial }); gardenMoss.name='garden-moss';gardenMoss.castShadow = false;
    const flowers = groupFromBuild(planting, stageGroup, { stage: true }); flowers.castShadow = false;
    const stoneClusters = groupFromBuild(flowerStones, stageGroup, { stage: true, material: stoneMaterial }); stoneClusters.castShadow = false;
    const waterMesh = groupFromBuild(water, stageGroup, { stage: true, material: waterMaterial }); waterMesh.name='garden-water';waterMesh.castShadow = false;
  }

  function rebuildStage(next) {
    if (stageGroup) scene.remove(stageGroup);
    for (const geometry of stageGeometries) { geometry.dispose(); geometries.delete(geometry); }
    stageGeometries.clear(); gates.length = 0; depotModels.length = 0; padModels.length = 0;
    stagePickMeshes.length = 0; stagePickBlockers.length = 0;
    initialPiles.clear(); seenEvents.clear(); compressionConfirm = 0; particles.forEach(p => { p.active = false; });
    hero.pressPlaten.position.y = 0;
    stageGroup = new THREE.Group(); scene.add(stageGroup);
    const chapter = Number(next.stage?.chapter) || (Number(next.stage?.id) > 30 ? 2 : 1);
    const palette = chapter === 2 ? COOL : WARM;
    scene.background.set(palette.sky);
    scene.fog = new THREE.Fog(palette.sky, 24, 58);
    keyLight.color.set(chapter === 2 ? 0xe0eff5 : 0xffe8ca);
    fillLight.color.set(chapter === 2 ? 0xa6d5e4 : 0xb9dfe4);
    hemiLight.groundColor.set(chapter === 2 ? 0x345669 : 0x3b5635);
    makeGardenSurround(palette, chapter);
    const walls = new Set((next.stage?.walls || []).map(([x, z]) => cellKey(x, z)));
    for (let x = 0; x < 10; x++) { walls.add(cellKey(x, 0)); walls.add(cellKey(x, 7)); }
    for (let z = 0; z < 8; z++) { walls.add(cellKey(0, z)); walls.add(cellKey(9, z)); }
    const architecture = builder(plain), coping = builder(block, { bevel: .025 }), vegetation = builder(plain);
    const hedge = builder(plain), hedgeLeaves = builder(plain);
    hedgeTopGroup = new THREE.Group(); hedgeTopGroup.position.y = .30;
    hedgeTopGroup.scale.y = cameraWideShort ? .55 : 1; stageGroup.add(hedgeTopGroup);
    architecture.box(4.5, -.22, 3.5, 10.15, .38, 8.16, palette.dark)
      .box(4.5, -.095, 3.5, 10.05, .12, 8.05, palette.edge);
    for (let x = 0; x < 10; x++) for (const z of [-.48, 7.48]) architecture.box(x, -.28, z, .88, .25, .08, palette.metal);
    for (let z = 0; z < 8; z++) for (const x of [-.48, 9.48]) architecture.box(x, -.28, z, .08, .25, .88, palette.metal);
    for (const z of [0, 7]) { architecture.box(4.5, .115, z, 10, .28, .92, palette.stone); coping.box(4.5, .285, z, 10, .055, .96, palette.clean); }
    for (const x of [0, 9]) { architecture.box(x, .115, 3.5, .92, .28, 6.08, palette.stone); coping.box(x, .285, 3.5, .96, .055, 6.04, palette.clean); }
    for (const key of walls) {
      const [x, z] = key.split(',').map(Number), border = x === 0 || x === 9 || z === 0 || z === 7;
      if (!border) {
        architecture.box(x, .12, z, .96, .29, .96, palette.stone); coping.box(x, .285, z, 1.00, .055, 1.00, palette.clean);
        hedge.box(x, .07, z, .78, .13, .73, palette.edge).box(x, .16, z, .80, .06, .75, palette.leaf);
        if (walls.has(cellKey(x + 1, z))) hedge.box(x + .5, .12, z, .30, .12, .72, palette.leaf);
        if (walls.has(cellKey(x, z + 1))) hedge.box(x, .12, z + .5, .72, .12, .30, palette.leaf);
        for (const side of [-1, 1]) hedgeLeaves.box(x + side * .23, .24 + side * .02, z + side * .12, .22, .13, .20, side < 0 ? palette.leaf : chapter === 2 ? 0x70ac93 : 0x94bf4d);
      } else if ((x + z * 3) % 4 === 0 && !(x === 0 && z === 6)) {
        vegetation.box(x, .40, z, .17, .23, .17, 0x8c734b).box(x, .59, z, .48, .24, .42, palette.leaf)
          .box(x - .09, .75, z, .30, .16, .32, chapter === 2 ? 0x75aaa1 : 0x98bd53);
      } else if ((x + z) % 3 === 0) {
        vegetation.box(x, .36, z, .20, .10, .20, palette.leaf).box(x + .1, .41, z, .10, .08, .12, palette.leaf);
      }
      if (border && (x * 3 + z) % 9 === 0) architecture.box(x, .4, z, .14, .20, .14, palette.metal)
        .box(x, .56, z, .20, .14, .20, palette.light).box(x, .65, z, .24, .04, .24, palette.edge);
    }
    stagePickBlockers.push(groupFromBuild(architecture, stageGroup, { stage: true }));
    stagePickBlockers.push(groupFromBuild(coping, stageGroup, { stage: true, material: stoneMaterial }));
    stagePickBlockers.push(groupFromBuild(hedge, hedgeTopGroup, { stage: true, material: mossMaterial }));
    stagePickBlockers.push(groupFromBuild(hedgeLeaves, hedgeTopGroup, { stage: true, material: mossMaterial }));
    stagePickBlockers.push(groupFromBuild(vegetation, stageGroup, { stage: true }));
    const base = next.stage?.depot || [1, 6]; depotModels.push(makeDepot(base[0], base[1], false, palette));
    for (const [padIndex, [x, z]] of (next.stage?.pads || []).entries()) {
      const root = new THREE.Group(); root.position.set(x, .024, z); stageGroup.add(root);
      const b = builder(plain);
      for (const side of [-1, 1]) {
        b.box(side * .33, 0, 0, .07, .025, .72, 0x6babb5).box(0, 0, side * .33, .72, .025, .07, 0x6babb5);
        b.box(side * .22, .02, -.22, .06, .025, .06, 0xe7e5bf);
      }
      b.box(0, .022, 0, .48, .035, .62, 0x345b67);
      groupFromBuild(b, root, { stage: true }); const label = makeNumberLabel(padIndex + 1, root);
      markNavigation(root, { x, z });
      padModels.push({ root, label, x, z, number: padIndex + 1 });
    }
    (next.stage?.gates || []).forEach((gate, i) => gates.push(makeGate(gate, i, palette, walls)));
    for (const pile of next.piles || []) initialPiles.set(String(pile.id), { x: pile.x, z: pile.z, max: pile.max || pile.remaining || 1, kind: pile.kind });
    const floorBase = new THREE.Color(palette.floor);
    for (let z = 0; z < 8; z++) for (let x = 0; x < 10; x++) {
      const i = z * 10 + x;
      floorColors[i].copy(floorBase).offsetHSL(0, 0, ((x * 13 + z * 7) % 5 - 2) * .004);
      matrix.compose(v.set(x, -.045, z), identity, scale.set(1.002, .07, 1.002)); floor.setMatrixAt(i, matrix); floor.setColorAt(i, floorColors[i]);
    }
    floor.instanceMatrix.needsUpdate = true; floor.instanceColor.needsUpdate = true;
    stageKey = `${next.stage?.id}:${chapter}`;
    lastElapsed = finite(next.elapsed);
  }

  function updateDepots(next) {
    const palette = Number(next.stage?.chapter) === 2 ? COOL : WARM;
    for (const [x, z] of next.depots || []) if (!depotModels.some(d => d.x === x && d.z === z)) depotModels.push(makeDepot(x, z, true, palette));
    for (const pad of padModels) pad.root.visible = !depotModels.some(d => d.x === pad.x && d.z === pad.z);
    const t = finite(next.elapsed);
    for (const depot of depotModels) {
      const window = next.stage?.rules?.depotWindow;
      const available = !window || (typeof window === 'number' ? t % 6 < window : (window === 'gate' || window === 'gates') ? next.gateStates?.every(Boolean) : t % ((window.openSeconds || 3) + (window.closedSeconds || 3)) < (window.openSeconds || 3));
      depot.lamp.scale.y = available ? .07 : .025;
      depot.lamp.material = available ? depotLampMaterial : closedLamp;
      depot.ring.scale.setScalar(reducedMotion ? 1 : 1 + Math.sin(t * 2.2) * .035);
      depot.ring.visible = available;
    }
  }

  function updatePiles(next) {
    let dryIndex = 0, wetIndex = 0, paperIndex = 0, patchIndex = 0;
    dryPickTargets.length = 0; wetPickTargets.length = 0; paperPickTargets.length = 0; soilPickTargets.length = 0;
    const totals = new Map(), remaining = new Map();
    for (const item of initialPiles.values()) {
      const key = cellKey(item.x, item.z); totals.set(key, (totals.get(key) || 0) + item.max);
    }
    for (const pile of next.piles || []) {
      const amount = Math.max(0, finite(pile.remaining)), key = cellKey(pile.x, pile.z);
      remaining.set(key, (remaining.get(key) || 0) + amount);
      if (!amount) continue;
      const wet = pile.kind === 'wet', collection = finite(pile.collecting);
      const soilRatio = clamp(amount / Math.max(1, pile.max || amount), 0, 1);
      matrix.compose(v.set(pile.x, -.002, pile.z), identity, scale.set(.76 + soilRatio * .16, .018, .74 + soilRatio * .16));
      soilPatches.setMatrixAt(patchIndex, matrix);
      soilPickTargets[patchIndex] = { x: pile.x, z: pile.z };
      color.set(wet ? 0x4c6d78 : 0xb38e54).lerp(new THREE.Color(Number(next.stage?.chapter) === 2 ? COOL.clean : WARM.clean), (1 - soilRatio) * .55);
      soilPatches.setColorAt(patchIndex++, color);
      // A group is one core hit region, but each remaining cargo unit retains a
      // separate, countable mound. Completed units disappear one at a time.
      const units = Math.min(4, Math.ceil(amount));
      for (let unit = 0; unit < units; unit++) {
       for (let j = 0; j < 2; j++) {
        const object = wet ? wetDust : dryDust, index = wet ? wetIndex++ : dryIndex++;
        if (index >= object.instanceMatrix.count) break;
        (wet ? wetPickTargets : dryPickTargets)[index] = { x: pile.x, z: pile.z };
        const active = unit === units - 1 ? collection : 0;
        const jitter = active && !reducedMotion ? Math.sin(finite(next.elapsed) * 30 + j) * .008 : 0;
        const x = pile.x + (unit % 2 ? .18 : -.18) + (j % 2 ? .035 : -.035) + jitter;
        const z = pile.z + (unit < 2 ? -.18 : .18) + (j === 2 ? .03 : -.02);
        const size = (wet ? .24 : .19) * (1 - active * .18);
        quaternion.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, (j * .7 + finite(pile.x)) % 1.5);
        matrix.compose(v.set(x, wet ? .045 + j * .016 : .09 + j * .035, z), quaternion,
          scale.set(size * (wet ? 1.2 : 1), wet ? .065 : size, size));
        object.setMatrixAt(index, matrix);
        color.set(wet ? (j % 2 ? 0x547d8d : 0x365b70) : (j % 2 ? 0xc89f72 : 0xdfc39d));
        object.setColorAt(index, color);
       }
       if(!wet&&paperIndex<paperScraps.instanceMatrix.count){
        const active=unit===units-1?collection:0,size=.15*(1-active*.18);
        quaternion.setFromAxisAngle(THREE.Object3D.DEFAULT_UP,.4+unit*.7+pile.x*.4);
        matrix.compose(v.set(pile.x+(unit%2?.18:-.18)+.035,.012,pile.z+(unit<2?-.18:.18)+.08),quaternion,scale.set(size,size*(1-active*.15),size*.8));
        paperScraps.setMatrixAt(paperIndex,matrix);paperScraps.setColorAt(paperIndex,new THREE.Color(unit%2?0xeee5cb:0xf7edd7));
        paperPickTargets[paperIndex++]={x:pile.x,z:pile.z};
       }
      }
    }
    dryDust.count = Math.min(dryIndex, dryDust.instanceMatrix.count); wetDust.count = Math.min(wetIndex, wetDust.instanceMatrix.count);
    paperScraps.count=paperIndex;
    soilPatches.count = patchIndex; soilPatches.instanceMatrix.needsUpdate = true; if (soilPatches.instanceColor) soilPatches.instanceColor.needsUpdate = true;
    for (const object of [dryDust, wetDust, paperScraps, soilPatches]) {
      object.instanceMatrix.needsUpdate = true; if (object.instanceColor) object.instanceColor.needsUpdate = true;
      // Instanced raycast bounds must follow both stage changes and consumed
      // piles. They are recomputed lazily on the next actual pointer action.
      object.boundingSphere = null; object.boundingBox = null;
    }
    const palette = Number(next.stage?.chapter) === 2 ? COOL : WARM;
    const cleanTint = new THREE.Color(palette.clean);
    for (let i = 0; i < 80; i++) {
      const key = cellKey(i % 10, Math.floor(i / 10)); color.copy(floorColors[i]);
      if (totals.has(key)) color.lerp(cleanTint, 1 - clamp((remaining.get(key) || 0) / totals.get(key), 0, 1));
      floor.setColorAt(i, color);
    }
    floor.instanceColor.needsUpdate = true;
  }

  function spawnParticle(event, i, targetX, targetZ, tint, type) {
    const p = particles.find(item => !item.active); if (!p) return;
    Object.assign(p, { active: true, age: 0, duration: reducedMotion ? .09 : (type === 'deposit' ? .42 : .28),
      x: finite(event.x) + ((i % 3) - 1) * .07, z: finite(event.z) + (Math.floor(i / 3) - .5) * .07,
      targetX: finite(targetX), targetZ: finite(targetZ), tint, type, seed: i });
  }

  function updateEffects(next, dt) {
    for (const event of next.events || []) {
      const key = String(event.id); if (seenEvents.has(key)) continue;
      seenEvents.add(key); if (seenEvents.size > 256) seenEvents.delete(seenEvents.values().next().value);
      if (event.type === 'collect' || event.type === 'brush') {
        for (let i = 0; i < (reducedMotion ? 1 : 3); i++) spawnParticle(event, i, next.player?.x, next.player?.z, event.type === 'brush' ? 0x8ed4db : 0xf0c66a, 'collect');
      } else if (event.type === 'deposit') {
        const closest = depotModels.reduce((a, b) => Math.hypot(a.x - finite(event.x), a.z - finite(event.z)) < Math.hypot(b.x - finite(event.x), b.z - finite(event.z)) ? a : b, depotModels[0]);
        for (let i = 0; i < (reducedMotion ? 2 : 9); i++) spawnParticle(event, i, event.targetX ?? closest?.x, event.targetZ ?? closest?.z, next.skin === 'amber' ? 0xffc556 : 0x9ee4a4, 'deposit');
      } else if (['deploy', 'compress', 'win'].includes(event.type)) {
        if (event.type === 'compress') compressionConfirm = .32;
        for (let i = 0; i < (reducedMotion ? 2 : 10); i++) spawnParticle(event, i, finite(event.x) + Math.sin(i * 2) * .65, finite(event.z) + Math.cos(i * 2) * .65, next.skin === 'amber' ? 0xffcf67 : 0xbdeeb5, 'burst');
      }
    }
    let count = 0;
    for (const p of particles) {
      if (!p.active) continue;
      p.age += dt; const t = clamp(p.age / p.duration, 0, 1);
      if (t >= 1) { p.active = false; continue; }
      const x = reducedMotion ? p.targetX : THREE.MathUtils.lerp(p.x, p.targetX, t);
      const z = reducedMotion ? p.targetZ : THREE.MathUtils.lerp(p.z, p.targetZ, t);
      const y = reducedMotion ? .35 : .10 + Math.sin(t * Math.PI) * .40 + (p.type === 'collect' ? t * .32 : 0);
      const size = (.045 + p.seed % 3 * .01) * (1 - t * .7);
      matrix.compose(v.set(x, y, z), identity, scale.set(size, size, size)); specks.setMatrixAt(count, matrix);
      color.set(p.tint); specks.setColorAt(count, color); count++;
    }
    specks.count = count; specks.instanceMatrix.needsUpdate = true; if (specks.instanceColor) specks.instanceColor.needsUpdate = true;
  }

  function updateCompression(next, dt) {
    const progress = next.compressing ? clamp(finite(next.compressionProgress), 0, 1) : 0;
    const eased = .5 - .5 * Math.cos(progress * Math.PI);
    // The platen follows the read-only render proxy through the whole one-second
    // action; it never completes or charges a compression transaction itself.
    if (reducedMotion) hero.pressPlaten.position.y = 0;
    else if (next.compressing) hero.pressPlaten.position.y = -.16 * eased;
    else hero.pressPlaten.position.y = Math.min(0, hero.pressPlaten.position.y + dt * .8);
    if (next.compressing && !reducedMotion) hero.cargo.scale.y *= 1 - eased * .34;
    compressionConfirm = Math.max(0, compressionConfirm - dt);
    hero.pressSignalMaterial.emissiveIntensity = .12 + (next.compressing ? .55 * eased : compressionConfirm * 1.9);
  }

  function pointFromEvent(event, clampOutside = false) {
    if (!renderer || !camera) return null;
    const rect = renderer.domElement.getBoundingClientRect(); if (rect.width <= 0 || rect.height <= 0) return null;
    pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const visible = (object) => { for (let node = object; node; node = node.parent) if (!node.visible) return false; return true; };
    const candidates = [...persistentPickMeshes, ...stagePickMeshes, ...stagePickBlockers, dryDust, wetDust, paperScraps, soilPatches].filter(object => object && visible(object));
    const first = raycaster.intersectObjects(candidates, false)[0];
    if (first) {
      let target = first.object.userData.dustwakeNavigation;
      if (first.object === dryDust) target = dryPickTargets[first.instanceId];
      else if (first.object === wetDust) target = wetPickTargets[first.instanceId];
      else if (first.object === paperScraps) target = paperPickTargets[first.instanceId];
      else if (first.object === soilPatches) target = soilPickTargets[first.instanceId];
      if (target?.player) target = state?.player;
      if (target && Number.isFinite(target.x) && Number.isFinite(target.z)) return { x: target.x, z: target.z };
      // An opaque wall hit blocks semantic objects behind it. Fall through to
      // the ordinary ground command, which core may reject as unreachable.
    }
    if (!raycaster.ray.intersectPlane(ground, hit)) return null;
    if (!clampOutside && (hit.x < -.45 || hit.x > 9.45 || hit.z < -.45 || hit.z > 7.45)) return null;
    return { x: clamp(hit.x, 0, 9), z: clamp(hit.z, 0, 7) };
  }

  function cancelPointer() {
    if (activePointer === null) return;
    const id = activePointer; activePointer = null;
    if (lastPointer) onPointer({ phase: 'cancel', ...lastPointer });
    if (renderer?.domElement.hasPointerCapture?.(id)) renderer.domElement.releasePointerCapture(id);
  }

  function requiredFitPoints() {
    const points = [];
    const box = (x0, x1, y0, y1, z0, z1, cx = 0, cz = 0, yaw = 0) => {
      for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) {
        points.push(new THREE.Vector3(cx + x * Math.cos(yaw) + z * Math.sin(yaw), y, cz - x * Math.sin(yaw) + z * Math.cos(yaw)));
      }
    };
    box(-.58, 9.58, -.42, .32, -.58, 7.58);
    // Fixed envelopes cover every legal continuous position and every heading,
    // including the taller flag/Amber/Press variants. They never follow Taro.
    for (const x of [.75, 8.25]) for (const z of [.75, 6.25]) {
      for (const [y, radius] of [[0, .82], [.12, 1.05], [.50, 1.05], [.95, .82], [1.34, .48]]) {
        for (let i = 0; i < 16; i++) points.push(new THREE.Vector3(x + Math.sin(i * Math.PI / 8) * radius, y, z + Math.cos(i * Math.PI / 8) * radius));
      }
    }
    for (const [x, z] of [[1, 6], [7, 6], [7, 1], [2, 2]]) box(-.55, .55, -.02, 1.03, -.94, .53, x, z, cameraYaw);
    for (const [x, z] of [[4, 3], [4, 6], [7, 2]]) box(-.55, .55, -.02, .9, -.55, .55, x, z);
    for (const x of [2, 5, 8]) for (const z of [1, 3, 5]) box(-.48, .48, -.01, .32, -.48, .48, x, z);
    const perimeter = new Set();
    for (let x = 0; x < 10; x++) { perimeter.add(cellKey(x, 0)); perimeter.add(cellKey(x, 7)); }
    for (let z = 1; z < 7; z++) { perimeter.add(cellKey(0, z)); perimeter.add(cellKey(9, z)); }
    for (const cell of perimeter) {
      const [x, z] = cell.split(',').map(Number);
      if ((x + z * 3) % 4 === 0 && !(x === 0 && z === 6)) box(-.25, .25, .3, .85, -.22, .22, x, z);
      if ((x * 3 + z) % 9 === 0) box(-.13, .13, .3, .68, -.13, .13, x, z);
    }
    return points;
  }

  function resize() {
    if (!renderer || disposed) return;
    const rect = container.getBoundingClientRect(), width = Math.max(1, rect.width), height = Math.max(1, rect.height);
    const dpr = Math.min(1.5, globalThis.devicePixelRatio || 1);
    const bufferWidth = Math.floor(width * dpr), bufferHeight = Math.floor(height * dpr);
    const canvas = renderer.domElement;
    if (resizeWidth === width && resizeHeight === height && resizeDpr === dpr && canvas.width === bufferWidth && canvas.height === bufferHeight) return;
    ready = false; sizeGeneration++;
    if (renderer.getPixelRatio() !== dpr) renderer.setPixelRatio(dpr);
    // setSize writes canvas.width/height and therefore clears its drawing
    // buffer, including when called redundantly. Leave equal buffers intact.
    if (canvas.width !== bufferWidth || canvas.height !== bufferHeight) renderer.setSize(width, height, false);
    else renderer.setViewport(0, 0, width, height);
    resizeWidth = width; resizeHeight = height; resizeDpr = dpr;
    const aspect = width / height, center = new THREE.Vector3(4.5, .15, 3.5);
    cameraPortrait = aspect < 1;
    cameraWideShort = aspect > 2;
    cameraYaw = cameraPortrait ? THREE.MathUtils.degToRad(78) : THREE.MathUtils.degToRad(10);
    // The single shadow key and softbox environment stay at the same visual
    // front-left in each layout. Camera projection and world rules stay fixed.
    const sunRight=Math.cos(cameraYaw),sunForward=Math.sin(cameraYaw);
    keyLight.position.set(4.5-sunRight*5+sunForward*6,12,3.5+sunForward*5+sunRight*6);
    fillLight.position.set(4.5+sunRight*6-sunForward*3,6,3.5-sunForward*6-sunRight*3);
    scene.environmentRotation.y=cameraYaw;
    cameraElevation = THREE.MathUtils.degToRad(cameraWideShort ? 40 : cameraPortrait ? 49 : 45);
    const radius = 20, horizontal = Math.cos(cameraElevation) * radius;
    camera.position.set(center.x + Math.sin(cameraYaw) * horizontal, center.y + Math.sin(cameraElevation) * radius, center.z + Math.cos(cameraYaw) * horizontal);
    camera.up.set(0, 1, 0); camera.lookAt(center); camera.updateMatrixWorld(true);
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    const fitPoints = cameraWideShort ? requiredFitPoints() : [];
    if (!cameraWideShort) for (const x of [WORLD.left, WORLD.right]) for (const z of [WORLD.top, WORLD.bottom]) for (const y of [-.65, 1.45]) fitPoints.push(new THREE.Vector3(x, y, z));
    for (const point of fitPoints) {
      v.copy(point).applyMatrix4(camera.matrixWorldInverse);
      minX = Math.min(minX, v.x); maxX = Math.max(maxX, v.x); minY = Math.min(minY, v.y); maxY = Math.max(maxY, v.y);
    }
    const viewWidth = Math.max(maxX - minX, (maxY - minY) * aspect) * 1.015;
    const viewHeight = viewWidth / aspect, offsetX = (minX + maxX) / 2, offsetY = (minY + maxY) / 2;
    camera.left = offsetX - viewWidth / 2; camera.right = offsetX + viewWidth / 2;
    camera.top = offsetY + viewHeight / 2; camera.bottom = offsetY - viewHeight / 2; camera.updateProjectionMatrix();
    for (const pad of padModels) pad.label.rotation.set(-Math.PI / 2, 0, cameraYaw);
    for (const depot of depotModels) depot.root.rotation.y = cameraYaw;
    if (hedgeTopGroup) hedgeTopGroup.scale.y = cameraWideShort ? .55 : 1;
    // ResizeObserver may run after the caller's last animation frame (for
    // example while a modal closes). Present the existing scene immediately;
    // this path does not update core, effects, events, animation, or timers.
    if (state && stageGroup && frame > 0 && !lost && !renderFailed) drawScene('resize');
  }

  function drawScene(reason) {
    if (disposed || !renderer || lost || renderFailed) return false;
    try {
      const now = performance.now();
      const interval = reason === 'state' && previousFrameTime ? now - previousFrameTime : 0;
      if (reason === 'state') previousFrameTime = now;
      const start = performance.now(); renderer.render(scene, camera); const renderMs = performance.now() - start;
      frame++; if (reason === 'resize') resizeDraws++;
      if (reason === 'state' && frame > 30 && interval > 0 && interval < 250) {
        frameTimes.push(interval); renderTimes.push(renderMs);
        if (frameTimes.length > 240) { frameTimes.shift(); renderTimes.shift(); }
      }
      const info = renderer.info;
      peaks.calls = Math.max(peaks.calls, info.render.calls); peaks.triangles = Math.max(peaks.triangles, info.render.triangles);
      peaks.geometries = Math.max(peaks.geometries, info.memory.geometries); peaks.textures = Math.max(peaks.textures, info.memory.textures);
      drawSizeGeneration = sizeGeneration;
      lastDraw = { at: performance.now(), reason, width: renderer.domElement.width, height: renderer.domElement.height, sizeGeneration };
      ready = true;
      if (!everReady || pendingRestored) {
        const restored = pendingRestored; everReady = true; pendingRestored = false;
        status(restored ? 'restored' : 'ready', { stageId: state?.stage?.id, frame, width: renderer.domElement.clientWidth, height: renderer.domElement.clientHeight });
        if (resolveRecovery) { resolveRecovery(true); resolveRecovery = null; clearTimeout(recoveryTimer); recoveryTimer = null; }
      }
      return true;
    } catch (error) {
      renderFailed = true; ready = false; cancelPointer();
      status('error', { message: String(error?.message || error), stageId: state?.stage?.id }); return false;
    }
  }

  function mapScreenDirection(dx, dz) {
    if (!camera) return { x: dx, z: dz };
    const e = camera.matrixWorld.elements;
    const rightLength = Math.hypot(e[0], e[2]) || 1, downLength = Math.hypot(e[4], e[6]) || 1;
    const x = finite(dx) * e[0] / rightLength - finite(dz) * e[4] / downLength;
    const z = finite(dx) * e[2] / rightLength - finite(dz) * e[6] / downLength;
    return { x: Math.abs(x) < 1e-9 ? 0 : x, z: Math.abs(z) < 1e-9 ? 0 : z };
  }

  function boardProjection() {
    if (!camera || !renderer) return null;
    let left = Infinity, right = -Infinity, top = Infinity, bottom = -Infinity;
    for (const x of [-.5, 9.5]) for (const z of [-.5, 7.5]) {
      v.set(x, 0, z).project(camera);
      const px = (v.x + 1) * renderer.domElement.clientWidth / 2, py = (1 - v.y) * renderer.domElement.clientHeight / 2;
      left = Math.min(left, px); right = Math.max(right, px); top = Math.min(top, py); bottom = Math.max(bottom, py);
    }
    return { left, right, top, bottom, width: right - left, height: bottom - top };
  }

  function render(next, dt = 0) {
    if (disposed || !renderer || lost || renderFailed || !next?.stage) return;
    try {
      state = next;
      if (next.status !== 'playing') cancelPointer();
      const nextKey = `${next.stage.id}:${Number(next.stage.chapter) || (Number(next.stage.id) > 30 ? 2 : 1)}`;
      if (nextKey !== stageKey || finite(next.elapsed) < lastElapsed - .05) rebuildStage(next);
      lastElapsed = finite(next.elapsed);
      updateDepots(next); updatePiles(next);
      const t = finite(next.elapsed), moving = !!next.player?.moving, brushing = !!next.player?.brushing;
      hero.root.position.set(finite(next.player?.x, 1), 0, finite(next.player?.z, 6));
      const facing = moving ? finite(next.player?.angle) : cameraYaw + .38;
      const turn = Math.atan2(Math.sin(facing - hero.root.rotation.y), Math.cos(facing - hero.root.rotation.y));
      hero.root.rotation.y += reducedMotion || !moving ? turn : turn * Math.min(1, Math.max(.12, finite(dt) * 12));
      heroShadow.position.set(hero.root.position.x, .014, hero.root.position.z);
      hero.body.position.y = reducedMotion ? 0 : moving ? Math.sin(t * 15) * .018 : Math.sin(t * 2) * .004;
      hero.legs.forEach((leg, i) => { leg.rotation.x = !reducedMotion && moving ? Math.sin(t * 15 + (i === 0 || i === 3 ? 0 : Math.PI)) * .22 : 0; });
      hero.head.rotation.x = -.26 + (!reducedMotion && brushing ? Math.sin(t * 22) * .018 : 0);
      const headToCamera = Math.atan2(Math.sin(cameraYaw + .10 - hero.root.rotation.y), Math.cos(cameraYaw + .10 - hero.root.rotation.y));
      hero.head.rotation.y = clamp(headToCamera, moving ? -.22 : -.45, moving ? .22 : .45);
      const eyePhase=t%4.8;hero.eyes.scale.y=reducedMotion||eyePhase<4.62?1:Math.max(.08,Math.abs(eyePhase-4.71)/.09);
      hero.tool.position.x = .15 + (!reducedMotion && brushing ? Math.sin(t * 23) * .045 : 0);
      hero.brush.visible = next.mode === 'brush'; hero.vacuum.visible = !hero.brush.visible;
      hero.press.visible = next.toolId === 'press'; hero.amber.visible = next.skin === 'amber';
      hero.bags.scale.set(next.toolId === 'cargo' ? 1.12 : 1, next.toolId==='cargo'?1.10:1, next.toolId === 'cargo' ? 1.1 : 1);
      const load = finite(next.bagLoad ?? next.bagWeight ?? next.bagCargo), capacity = next.capacity || (next.toolId === 'cargo' ? 12 : 8);
      hero.cargo.visible = load > 0; hero.cargo.scale.y = .25 + clamp(load / capacity, 0, 1);
      targetRing.visible = !!next.target && next.status === 'playing'; targetStem.visible = targetRing.visible;
      if (targetRing.visible) {
        targetRing.position.set(next.target.x, .035, next.target.z); targetStem.position.set(next.target.x, .045, next.target.z);
        targetRing.scale.setScalar(reducedMotion ? 1 : .95 + Math.sin(t * 5) * .06);
      }
      trail.visible = !!next.target && next.status === 'playing';
      if (trail.visible) {
        const p = next.player, dx = next.target.x - p.x, dz = next.target.z - p.z, distance = Math.min(1.5, Math.hypot(dx, dz));
        trail.position.set(p.x + dx / Math.max(.001, Math.hypot(dx, dz)) * distance / 2, .018, p.z + dz / Math.max(.001, Math.hypot(dx, dz)) * distance / 2);
        trail.rotation.y = Math.atan2(dx, dz); trail.scale.set(.035, .012, distance);
        // The short intention mark is suppressed where it would imply a route
        // through a wall. Only core chooses the actual path around obstacles.
        for (let step = .1; step <= distance; step += .1) {
          const sx = p.x + dx / Math.max(.001, Math.hypot(dx, dz)) * step;
          const sz = p.z + dz / Math.max(.001, Math.hypot(dx, dz)) * step;
          if (next.stage.walls?.some(([wx, wz]) => Math.abs(sx - wx) < .55 && Math.abs(sz - wz) < .55)) { trail.visible = false; break; }
        }
      }
      for (const gate of gates) {
        const open = !!next.gateStates?.[gate.index];
        if (open && gate.lastOpen !== true) gate.openStartedAt = t;
        gate.lastOpen = open;
        gate.barrier.position.y = open ? .42 : 0;
        gate.barrier.scale.y = open ? .16 : 1;
        gate.fan.rotation.z = reducedMotion ? 0 : t * (open ? 1.5 : 5);
        gate.lamp.scale.y = open ? .065 : .03; gate.airflow.visible = open;
        const warning = open && t - gate.openStartedAt > finite(gate.definition.openSeconds, 3) - 1;
        gate.lamp.material = warning ? warningLamp : open ? glow : closedLamp;
        gate.lamp.scale.x = warning && !reducedMotion ? .12 + Math.sin(t * 9) * .025 : .12;
      }
      const visualDt = clamp(finite(dt, 0), 0, .08);
      updateEffects(next, visualDt); updateCompression(next, visualDt);
      drawScene('state');
    } catch (error) { renderFailed = true; ready = false; cancelPointer(); status('error', { message: String(error?.message || error), stageId: next?.stage?.id }); }
  }

  function summary(samples) {
    if (!samples.length) return { samples: 0, averageMs: null, p95Ms: null };
    const sorted = [...samples].sort((a, b) => a - b);
    return { samples: samples.length, averageMs: samples.reduce((sum, n) => sum + n, 0) / samples.length, p95Ms: sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * .95) - 1)] };
  }

  function getMetrics() {
    const info = renderer?.info;
    const freshDraw = ready && drawSizeGeneration === sizeGeneration && lastDraw?.width === renderer?.domElement.width && lastDraw?.height === renderer?.domElement.height;
    return { revision: THREE.REVISION, ready: !!freshDraw, disposed, renderFailed, contextLost: lost, recoveryAttempted, stageId: state?.stage?.id ?? null,
      frames: frame, warmupFrames: 30, frameSamples: summary(frameTimes), renderSamples: summary(renderTimes),
      resizeDraws, pendingResizeDraw: !disposed && drawSizeGeneration !== sizeGeneration, lastDraw: lastDraw ? { ...lastDraw } : null,
      calls: info?.render.calls ?? 0, triangles: info?.render.triangles ?? 0, geometries: info?.memory.geometries ?? 0,
      textures: info?.memory.textures ?? 0, ownedGeometries: geometries.size, ownedMaterials: materials.size,
      ownedTextures: textures.size,
      shadow: { type:renderer?.shadowMap.type ?? null,radius:keyLight?.shadow.radius ?? null,width:keyLight?.shadow.mapSize.x ?? null,height:keyLight?.shadow.mapSize.y ?? null },
      materialImages: { stone: stoneMap ? { width: stoneMap.image.width, height: stoneMap.image.height } : null, moss: mossMap ? { width: mossMap.image.width, height: mossMap.image.height } : null },
      materialTextures: Object.fromEntries([['stone',stoneMap],['moss',mossMap]].map(([name,texture])=>[name,texture ? { width:texture.image.width,height:texture.image.height,flipY:texture.flipY,colorSpace:texture.colorSpace,wrapS:texture.wrapS,wrapT:texture.wrapT,version:texture.version } : null])),
      environmentReady: !!scene?.environment && !!freshDraw && !lost && !renderFailed,
      environmentMap: environmentTarget ? { width:environmentTarget.width,height:environmentTarget.height,type:environmentTarget.texture.type,mapping:environmentTarget.texture.mapping,version:environmentTarget.texture.version } : null,
      environment: { type: 'PMREM-studio', size: 128, builds: environmentBuilds, active: !!scene?.environment },
      ownedTextureDecodedBytes: [...textures].reduce((sum, texture) => {
        const image = texture.image; if (!image?.width || !image?.height) return sum;
        return sum + Math.ceil(image.width * image.height * (texture.type === THREE.HalfFloatType ? 8 : 4) * (texture.generateMipmaps ? 4 / 3 : 1));
      }, 0),
      particles: particles.filter(p => p.active).length, particleLimit: PARTICLE_LIMIT, peaks: { ...peaks },
      pixelRatio: renderer?.getPixelRatio() || 0, buffer: renderer ? { width: renderer.domElement.width, height: renderer.domElement.height } : null,
      viewport: renderer ? { width: renderer.domElement.clientWidth, height: renderer.domElement.clientHeight } : null,
      cameraLayout: { orientation: cameraPortrait ? 'portrait-world-x-vertical' : 'landscape-world-x-horizontal', wideShort: cameraWideShort, fit: cameraWideShort ? 'fixed-required-play-hulls' : 'full-world-prism', yaw: cameraYaw, elevationDegrees: THREE.MathUtils.radToDeg(cameraElevation), boardBoundsCss: boardProjection() },
      renderer: renderer?.getContext()?.getParameter(renderer.getContext().RENDERER) || null,
      scope: 'Actual active WebGL renderer counters and bounded render intervals; no physical-device FPS claim.' };
  }

  function recover() {
    if (disposed || !renderer) return Promise.resolve(false);
    if (!lost) return Promise.resolve(!renderFailed);
    if (recoveryAttempted) return Promise.resolve(false);
    recoveryAttempted = true;
    return new Promise(resolve => {
      resolveRecovery = resolve;
      recoveryTimer = setTimeout(() => { if (resolveRecovery) { resolveRecovery(false); resolveRecovery = null; } status('error', { message: 'WebGL restoration did not complete. Re-enter the stage to retry safely.' }); }, 3500);
      try { renderer.forceContextRestore(); } catch (error) { clearTimeout(recoveryTimer); recoveryTimer = null; resolveRecovery = null; resolve(false); status('error', { message: String(error?.message || error) }); }
    });
  }

  function dispose() {
    if (disposed) return;
    cancelPointer(); disposed = true;
    resizeObserver?.disconnect(); listeners.splice(0).forEach(remove => remove());
    if (recoveryTimer) clearTimeout(recoveryTimer); if (resolveRecovery) resolveRecovery(false);
    resolveRecovery = null; recoveryTimer = null;
    particles.forEach(p => { p.active = false; }); seenEvents.clear(); initialPiles.clear();
    persistentPickMeshes.length = 0; stagePickMeshes.length = 0; stagePickBlockers.length = 0;
    dryPickTargets.length = 0; wetPickTargets.length = 0; paperPickTargets.length = 0; soilPickTargets.length = 0;
    for (const geometry of geometries) geometry.dispose();
    for (const material of materials) material.dispose();
    releaseEnvironment();
    for (const texture of textures) texture.dispose();
    scene?.traverse(object => {
      if (object.isInstancedMesh) object.dispose();
      if (object.isLight && object.shadow) {
        if (object.shadow.dispose) object.shadow.dispose();
        else { object.shadow.map?.dispose(); object.shadow.mapPass?.dispose(); }
      }
    });
    geometries.clear(); materials.clear(); textures.clear(); stageGeometries.clear();
    scene?.clear(); renderer?.renderLists.dispose(); renderer?.dispose(); renderer?.forceContextLoss(); renderer?.domElement.remove();
    state = null; stageGroup = null; ready = false;
  }

  let resizeObserver;
  const api = { render, resize, mapScreenDirection, getMetrics, recover, dispose };
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = .88;
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap;
    const canvas = renderer.domElement; canvas.dataset.dustwakeRenderer = 'three-r180'; canvas.setAttribute('aria-hidden', 'true');
    canvas.style.display = 'block'; canvas.style.width = '100%'; canvas.style.height = '100%'; canvas.style.touchAction = 'none';
    container.appendChild(canvas);
    scene = new THREE.Scene(); scene.background = new THREE.Color(WARM.sky);
    camera = new THREE.OrthographicCamera(-6, 6, 5, -5, .1, 70);
    hemiLight = new THREE.HemisphereLight(0xcbe9f1, 0x3b5635, .65); scene.add(hemiLight);
    const key = keyLight = new THREE.DirectionalLight(0xffe9cb, 2.45); key.position.set(-2, 12, 8); key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024); key.shadow.camera.left = -8; key.shadow.camera.right = 8;
    key.shadow.camera.top = 8; key.shadow.camera.bottom = -8; key.shadow.camera.near = .1; key.shadow.camera.far = 30;
    key.shadow.bias = -.0008; key.shadow.normalBias = .035;key.shadow.radius=2.5; key.target.position.set(4.5, 0, 3.5); scene.add(key, key.target);
    fillLight = new THREE.DirectionalLight(0xa8dce6, .36); fillLight.position.set(12, 6, -5); fillLight.target.position.set(4.5, 0, 3.5); scene.add(fillLight, fillLight.target);
    stoneMap = makeSurfaceTexture(materialImages?.stone, 'stone'); mossMap = makeSurfaceTexture(materialImages?.moss, 'moss');
    mossMap.repeat.set(.26,.26);
    buildStudioEnvironment();
    block = keepGeometry(chamferedCube());
    const indexedBox = new THREE.BoxGeometry(1, 1, 1);
    plain = keepGeometry(indexedBox.toNonIndexed()); indexedBox.dispose();
    matte = keepMaterial(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .82, metalness: .03 }));
    skinMaterial = keepMaterial(new THREE.MeshPhysicalMaterial({vertexColors:true,roughness:.59,metalness:0,clearcoat:.12,clearcoatRoughness:.55,envMapIntensity:.65}));
    stoneMaterial = keepMaterial(mapStrength(new THREE.MeshStandardMaterial({ vertexColors: true, map: stoneMap, bumpMap: stoneMap, bumpScale: .008, roughness: .80, metalness: 0, envMapIntensity: .45 }),.66));
    mossMaterial = keepMaterial(mapStrength(new THREE.MeshStandardMaterial({ vertexColors: true, map: mossMap, bumpMap: mossMap, bumpScale: .006, roughness: .98, metalness: 0, envMapIntensity: .18 }),.32,0x82ad67));
    shellMossMaterial = keepMaterial(mapStrength(new THREE.MeshStandardMaterial({vertexColors:true,map:mossMap,roughness:.88,metalness:0,envMapIntensity:.35}),.16));
    copperMaterial = keepMaterial(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .29, metalness: .82, envMapIntensity: 1.1 }));
    enamelMaterial = keepMaterial(new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: .29, metalness: .12, clearcoat: .65, clearcoatRoughness: .22, envMapIntensity: .95 }));
    glossy = keepMaterial(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .38, metalness: .15 }));
    waterMaterial = keepMaterial(new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: .17, metalness: .16, clearcoat:1,clearcoatRoughness:.12,envMapIntensity:1.4 }));
    bronze = keepMaterial(new THREE.MeshStandardMaterial({ color: 0xb89b5e, roughness: .5, metalness: .35 }));
    glow = keepMaterial(new THREE.MeshStandardMaterial({ color: 0xbef2ad, emissive: 0x4ba04f, emissiveIntensity: .45, roughness: .45 }));
    depotLampMaterial=keepMaterial(new THREE.MeshStandardMaterial({color:0xffc35b,emissive:0xc58130,emissiveIntensity:.24,roughness:.34,metalness:.05}));
    closedLamp = keepMaterial(new THREE.MeshStandardMaterial({ color: 0xe9a58f, emissive: 0xa34829, emissiveIntensity: .45, roughness: .45 }));
    warningLamp = keepMaterial(new THREE.MeshStandardMaterial({ color: 0xffda8b, emissive: 0xca8e2d, emissiveIntensity: .45, roughness: .45 }));
    numberMaterial = makeNumberAtlas();
    ringMaterial = keepMaterial(new THREE.MeshBasicMaterial({ color: 0xeff8c1, transparent: true, opacity: .78, depthWrite: false }));
    depotRingMaterial = keepMaterial(new THREE.MeshBasicMaterial({ color: 0x30dec9, transparent: true, opacity: .9, depthWrite: false }));
    particleMaterial = keepMaterial(new THREE.MeshBasicMaterial({ vertexColors: true }));
    const floorMaterial = keepMaterial(mapStrength(new THREE.MeshStandardMaterial({ map: stoneMap, bumpMap: stoneMap, bumpScale: .006, roughness: .86, metalness: 0, envMapIntensity: .35 }),.66));
    floor = new THREE.InstancedMesh(plain, floorMaterial, 80); floor.receiveShadow = true; floor.frustumCulled = false; scene.add(floor);
    const dryMaterial = keepMaterial(new THREE.MeshStandardMaterial({ roughness: .96, metalness: 0 }));
    const wetMaterial = keepMaterial(new THREE.MeshStandardMaterial({ roughness: .24, metalness: .20 }));
    dryDust = new THREE.InstancedMesh(keepGeometry(debrisGeometry('dry')), dryMaterial, 256); wetDust = new THREE.InstancedMesh(keepGeometry(debrisGeometry('wet')), wetMaterial, 192);
    dryDust.name='dry-dust-mounds';wetDust.name='wet-dust-caps';
    for (const object of [dryDust, wetDust]) { object.castShadow = true; object.receiveShadow = true; object.frustumCulled = false; object.count = 0; scene.add(object); }
    paperScraps=new THREE.InstancedMesh(keepGeometry(debrisGeometry('paper')),keepMaterial(new THREE.MeshStandardMaterial({roughness:.94,metalness:0,side:THREE.DoubleSide})),64);paperScraps.name='recyclable-paper-scraps';paperScraps.count=0;paperScraps.castShadow=false;paperScraps.receiveShadow=true;paperScraps.frustumCulled=false;scene.add(paperScraps);
    specks = new THREE.InstancedMesh(plain, particleMaterial, PARTICLE_LIMIT); specks.count = 0; specks.frustumCulled = false; scene.add(specks);
    soilPatches = new THREE.InstancedMesh(plain, keepMaterial(new THREE.MeshStandardMaterial({ roughness: .98, metalness: 0 })), 16);
    soilPatches.count = 0; soilPatches.receiveShadow = true; soilPatches.frustumCulled = false; scene.add(soilPatches);
    hero = makeTaro(); scene.add(hero.root); markNavigation(hero.root, { player: true }, true);
    contactGeometry = keepGeometry(softContactGeometry());contactMaterial=keepMaterial(new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,depthWrite:false}));
    heroShadow = mesh(contactGeometry,contactMaterial);
    heroShadow.rotation.x = -Math.PI / 2; heroShadow.scale.set(.46, .55, 1); heroShadow.castShadow = false; heroShadow.receiveShadow = false;
    targetRing = mesh(keepGeometry(new THREE.TorusGeometry(.22, .025, 4, 28)), ringMaterial); targetRing.rotation.x = -Math.PI / 2;
    targetRing.castShadow = false; targetRing.receiveShadow = false; targetRing.visible = false;
    targetStem = mesh(plain, ringMaterial); targetStem.scale.set(.06, .025, .14); targetStem.visible = false; targetStem.castShadow = false;
    trail = mesh(plain, keepMaterial(new THREE.MeshBasicMaterial({ color: 0xf6f2c6, transparent: true, opacity: .32, depthWrite: false }))); trail.visible = false; trail.castShadow = false;
    listen(canvas, 'pointerdown', event => {
      if (event.target !== canvas || activePointer !== null || lost || renderFailed || state?.status !== 'playing' || event.button > 0) return;
      const p = pointFromEvent(event); if (!p) return;
      event.preventDefault(); activePointer = event.pointerId; lastPointer = p;
      canvas.setPointerCapture(event.pointerId); onPointer({ phase: 'down', ...p });
    }, { passive: false });
    listen(canvas, 'pointermove', event => {
      if (event.pointerId !== activePointer) return;
      const p = pointFromEvent(event, true); if (!p) return; event.preventDefault(); lastPointer = p; onPointer({ phase: 'move', ...p });
    }, { passive: false });
    listen(canvas, 'pointerup', event => {
      if (event.pointerId !== activePointer) return;
      const p = pointFromEvent(event, true) || lastPointer; activePointer = null;
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
      if (p) onPointer({ phase: 'up', ...p });
    });
    listen(canvas, 'pointercancel', cancelPointer); listen(canvas, 'lostpointercapture', cancelPointer); listen(globalThis, 'blur', cancelPointer);
    listen(canvas, 'webglcontextlost', event => { event.preventDefault(); lost = true; ready = false; cancelPointer(); status('contextlost', { stageId: state?.stage?.id }); });
    listen(canvas, 'webglcontextrestored', () => {
      lost = false; pendingRestored = true;
      try {
        // A PMREM render target has no CPU pixels to upload after context loss.
        // Regenerate it once before the restored scene is marked freshly drawn.
        buildStudioEnvironment();
        for (const texture of textures) if (texture !== environmentTarget?.texture) texture.needsUpdate = true;
        resize(); if (state) render(state, 0);
      } catch (error) {
        renderFailed = true; ready = false; pendingRestored = false;
        if (recoveryTimer) clearTimeout(recoveryTimer); recoveryTimer = null;
        if (resolveRecovery) resolveRecovery(false); resolveRecovery = null;
        status('error', { message: String(error?.message || error), capability: 'WebGL2-environment-restoration' });
      }
    });
    if (typeof ResizeObserver !== 'undefined') { resizeObserver = new ResizeObserver(resize); resizeObserver.observe(container); }
    listen(globalThis, 'resize', resize); resize();
  } catch (error) {
    status('error', { message: String(error?.message || error), capability: 'WebGL2' });
    // Initialization failures still release every partially created owned resource.
    dispose();
  }
  return api;
}
