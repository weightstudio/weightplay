// Repository-pinned Three.js r180; visuals never decide simulation outcomes.
import * as THREE from '../../src/vendor/three/r180-b59af7c93a55a6eb/three.module.min.js';
import { bridgeOpen, segmentFor, landmarksFor } from './simulation.mjs?v=14';

export function createRenderer(container, onContextLost = () => {}) {
  const renderer = new THREE.WebGLRenderer({antialias:true, alpha:false, powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  let disposed=false;
  renderer.domElement.setAttribute('aria-hidden','true');
  renderer.domElement.addEventListener('webglcontextlost', event => {event.preventDefault();if(!disposed)onContextLost();});
  container.append(renderer.domElement);
  const scene=new THREE.Scene(); scene.background=new THREE.Color(0x80bfd0); scene.fog=new THREE.Fog(0x80bfd0,38,78);
  const camera=new THREE.PerspectiveCamera(58,1,.1,100);
  const ambient=new THREE.HemisphereLight(0xbbeaff,0x304735,2.1); scene.add(ambient);
  const sun=new THREE.DirectionalLight(0xffcf82,2.3); sun.position.set(-8,16,-7); sun.castShadow=true;
  sun.shadow.mapSize.set(1024,1024); Object.assign(sun.shadow.camera,{left:-9,right:9,top:12,bottom:-12,near:1,far:55}); scene.add(sun);
  const geometries=new Set(), materials=new Set(), textures=new Set();
  // A single non-fogged, camera-centred sky gives the forest a quiet horizon.
  const skyGeometry=new THREE.SphereGeometry(80,24,12),skyPosition=skyGeometry.getAttribute('position');
  const skyColors=new THREE.BufferAttribute(new Float32Array(skyPosition.count*3),3);skyGeometry.setAttribute('color',skyColors);
  const skyMaterial=new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.BackSide,depthWrite:false,fog:false});
  geometries.add(skyGeometry);materials.add(skyMaterial);
  const sky=new THREE.Mesh(skyGeometry,skyMaterial);sky.frustumCulled=false;sky.renderOrder=-1000;scene.add(sky);
  function setSky(evening){
    const horizon=new THREE.Color(evening?0xc6aa9a:0xc5e0d3),upper=new THREE.Color(evening?0x456b8a:0x5599bd),color=new THREE.Color();
    for(let i=0;i<skyPosition.count;i++){
      const t=THREE.MathUtils.smoothstep(skyPosition.getY(i)/80,-.2,.85);color.lerpColors(horizon,upper,t);
      skyColors.setXYZ(i,color.r,color.g,color.b);
    }
    skyColors.needsUpdate=true;
  }
  function box(parent,w,h,d,x,y,z,color) {
    const g=new THREE.BoxGeometry(w,h,d), m=new THREE.MeshStandardMaterial({color,roughness:.8});
    geometries.add(g); materials.add(m); const mesh=new THREE.Mesh(g,m); mesh.position.set(x,y,z); mesh.castShadow=true; mesh.receiveShadow=true; parent.add(mesh); return mesh;
  }
  function light(parent,x,z) {
    const g=new THREE.Group(); g.position.set(x,0,z); parent.add(g);
    box(g,.17,1.7,.17,0,.85,0,0x795239); box(g,.52,.52,.52,0,1.8,0,0xffc75c);
    box(g,.65,.09,.65,0,2.12,0,0x533f32); box(g,.42,.06,.42,0,2.22,0,0x976644);
  }
  function windFlag(parent,x,z,headwind) {
    const color=headwind?0xe87e50:0x55d3ac;
    box(parent,.14,2.3,.14,x,1.15,z,0x745037);box(parent,.75,.44,.1,x,2.12,z,color);
    const geometry=new THREE.ConeGeometry(.26,.6,3),material=new THREE.MeshStandardMaterial({color:0xffedab,roughness:.8});
    geometries.add(geometry);materials.add(material);const arrow=new THREE.Mesh(geometry,material);
    arrow.rotation.x=headwind?-Math.PI/2:Math.PI/2;arrow.position.set(x,2.12,z+(headwind?-.6:.6));parent.add(arrow);
  }
  function tree(parent,x,z,variant) {
    const palette=[['#285c4a','#3f8060','#6ea572','#9dbd73'],['#335b48','#568465','#8cad72','#c0c17c'],['#214e52','#3b736e','#74a491','#a9c5a2']][variant%3];
    const g=new THREE.Group(); g.position.set(x,0,z); g.scale.setScalar([.95,1.2,1.08][variant%3]); parent.add(g);
    // Mix a broadleaf silhouette into the conifers; all pieces are baked below.
    if(variant%3===0){
      const colors=[0x245b47,0x367b56,0x559969,0x8bb674];
      box(g,.48,2.85,.52,0,1.425,0,0x765035);box(g,.12,2.25,.07,.16,1.24,.27,0xa4784b);
      box(g,.85,.24,.28,-.32,2.25,0,0x765035);box(g,.85,.22,.28,.33,2.43,.05,0x765035);
      for(const [cx,cy,cz,w,h,d,color] of [[-.75,2.68,.10,1.05,.70,1.1,0],[.04,2.70,0,1.16,.78,1.28,1],[.76,2.77,-.1,.95,.68,1.08,0],[-.52,3.32,-.10,1.0,.70,1.05,1],[.38,3.37,.13,1.17,.78,1.1,2],[-.07,3.96,0,.92,.57,.92,2],[.12,4.30,-.05,.58,.25,.60,3]])box(g,w,h,d,cx,cy,cz,colors[color]);
      box(g,.36,.17,.32,-.84,3.05,.59,colors[2]);box(g,.34,.15,.28,.58,3.73,.50,colors[3]);
      return;
    }
    // Clustered branch tips form irregular, layered 3D conifer crowns.
    // Their wood and foliage join the same static, collision-free batch.
    const lean=variant%3===1?1:-1;
    box(g,.45,3.15,.45,0,1.575,0,0x745137);
    box(g,.11,2.35,.07,.16,1.25,.25,0xa77848);
    const layers=[
      {y:2.45,w:2.05,d:1.72,h:.48},
      {y:3.00,w:1.68,d:1.43,h:.47},
      {y:3.50,w:1.25,d:1.12,h:.43},
      {y:3.95,w:.81,d:.76,h:.36}
    ];
    layers.forEach(({y,w,d,h},tier)=>{
      const dx=lean*(tier%2?.09:-.07);
      box(g,w*.60,h,d*.63,dx,y,0,palette[Math.min(tier,3)]);
      for(const side of [-1,1]){
        const x=dx+side*w*.37, offset=(side===lean?.08:-.06);
        box(g,w*.42,h*.78,d*.62,x,y-.12,offset,palette[Math.max(0,tier-1)]);
        box(g,w*.27,h*.38,d*.38,x+side*w*.12,y+.11,offset+.17,palette[Math.min(3,tier+1)]);
      }
      box(g,w*.39,h*.55,d*.35,dx+w*.08,y-.10,d*.40,palette[Math.min(3,tier+1)]);
      if(tier<3)box(g,w*.31,h*.40,d*.28,dx-w*.11,y-.12,-d*.43,palette[tier]);
    });
    box(g,.32,.27,.34,lean*.12,4.24,0,palette[3]);

  }
  const world=new THREE.Group(); scene.add(world);
  box(world,40,.25,160,0,-.54,70,0x38563b);box(world,8,.25,150,0,-.2,68,0x8c5c3d); box(world,7.4,.08,150,0,-.04,68,0x8e866b);
  for(let i=0;i<31;i++){
    const z=i*5-5; box(world,7.1,.025,.08,0,.01,z,0xdec889);
    if(i%2===0){light(world,-4.5,z);light(world,4.5,z);}
    // Distant conifers have stepped crowns and visible trunks, rather than a
    // repeated wall of square blocks. Their muted tones preserve track contrast.
    if(i%4===0){for(const side of [-1,1]){
      const x=side*(15.6+(i%8===0?.2:1)),depth=z+15;
      const tint=i%8===0?[0x537b68,0x709784,0x91b09a]:[0x4f786c,0x6a9388,0x8aaa9a];
      box(world,.8,3,.8,x,1.5,depth,0x6d6552);
      const crowns=[
        {y:3.2,w:6.8,d:6.2,h:1.10},
        {y:4.45,w:5.4,d:5.0,h:1.05},
        {y:5.55,w:4.1,d:3.8,h:.95},
        {y:6.5,w:2.8,d:2.6,h:.82},
        {y:7.25,w:1.55,d:1.5,h:.65}
      ];
      crowns.forEach(({y,w,d,h},tier)=>{
        const cx=x+side*(tier%2?.13:-.10);
        box(world,w*.60,h,d*.65,cx,y,depth,tint[Math.min(2,Math.floor((tier+1)/2))]);
        for(const branch of [-1,1]){
          box(world,w*.43,h*.72,d*.63,cx+branch*w*.36,y-.20,depth+side*.10,tint[Math.min(2,Math.floor(tier/2))]);
          box(world,w*.26,h*.30,d*.32,cx+branch*w*.45,y+.20,depth+d*.20,tint[Math.min(2,Math.floor(tier/2)+1)]);
        }
        box(world,w*.30,h*.45,d*.36,cx-w*.10,y-.12,depth+d*.42,tint[Math.min(2,Math.floor(tier/2)+1)]);
      });
      box(world,.72,.45,.70,x+side*.1,7.75,depth,tint[2]);
    }}
    // Keep the near canopy outside the tracking camera's fork-lane sightline.
    tree(world,-10-(i%3),z+2,i%3); tree(world,10+(i%2),z+4,(i+1)%3);
    // Low roadside landmarks break up the repeated forest without covering the track.
    // They are part of the static scenery batch and never allocate during play.
    if(i%6===1){
      const side=i%12===1?-1:1,x=side*5.9;
      box(world,.72,.46,.66,x,.23,z+2,0x795139);box(world,.82,.09,.74,x,.51,z+2,0xbf8950);
      box(world,.2,.1,.2,x-.13,.57,z+2,0xd7ae72);box(world,.14,.08,.14,x+.14,.56,z+1.93,0x9d6a42);
      box(world,.13,.34,.13,x+side*.58,.17,z+1.3,0xe7d4a6);box(world,.42,.19,.42,x+side*.58,.38,z+1.3,0xd7795e);
      box(world,.11,.04,.11,x+side*.61,.49,z+1.27,0xffe3b0);
    }
    if(i%6===4){
      const side=i%12===4?1:-1,x=side*5.75;
      box(world,1.0,.18,.55,x,.48,z+2,0x9c704b);box(world,.13,.45,.13,x-.36,.23,z+2,0x755039);box(world,.13,.45,.13,x+.36,.23,z+2,0x755039);
      box(world,.8,.12,.12,x,.76,z+2.23,0xba8b5b);box(world,.11,.35,.11,x-.3,.62,z+2.23,0x755039);box(world,.11,.35,.11,x+.3,.62,z+2.23,0x755039);
      box(world,.3,.2,.3,x-side*.75,.1,z+1.4,0x6b9471);box(world,.18,.13,.18,x-side*.75,.25,z+1.4,0xffd776);
    }
    // Repeated scenery is baked with the track below: no per-frame allocations.
    if(i%2===0){
      box(world,.8,.35,.7,-5.3,.17,z+2,0x4f8157);box(world,.5,.3,.55,-5.55,.42,z+2,0x77a76a);box(world,.7,.22,.55,5.5,.11,z+3,0x758878);
      for(const [x,offset,c] of [[-5.1,.8,0xffd464],[-5.8,1.1,0xf18b76],[5.2,1.6,0xffdf80],[5.9,2.1,0xf4aeb0]]){
        box(world,.08,.32,.08,x,.16,z+offset,0x3e8b59);box(world,.24,.13,.24,x,.35,z+offset,c);
      }
    }
    // Short fence and fluttering colored pennants make the route read as a festival.
    for(const side of [-1,1]){
      const x=side*4.05;box(world,.18,.8,.18,x,.4,z+1,0x9a653e);box(world,.2,.2,.2,x,.89,z+1,0xf5ca73);
      box(world,.12,.11,4.8,x,.61,z+3.4,0xc38b4e);
      if(i%3===1){box(world,.12,1.8,.12,side*4.65,.9,z+2,0x855438);box(world,.7,.3,.08,side*4.65,.96,z+2,0xf0b64f);box(world,.52,.25,.08,side*4.65,1.3,z+2,0x1d96b2);}
    }

  }
  // Paired sandstone kerbs with periodic lantern-gold inlays frame the
  // playable course. They are static decorations outside all route surfaces.
  for(let i=0;i<125;i++)for(const side of [-1,1]){
    const x=side*3.64,z=i*1.2-5;
    const stone=i%5===0?0xd3aa65:i%2?0x9b7753:0xb08a61;
    box(world,.38,.12,1.12,x,.075,z,stone);
    if(i%5===0)box(world,.17,.025,.23,x,.147,z,0xf3cc73);
  }
  // High festival garlands add landmarks above the course without changing
  // any gate or collision; the entire structure joins the static batch.
  for(const z of [16,46,76,106,136]){
    for(const side of [-1,1])box(world,.15,7.4,.15,side*10,3.7,z,0x865c39);
    for(let i=-10;i<=10;i++){
      const x=i,y=6.6+.008*x*x;
      if(i<10)box(world,1.02,.08,.08,x+.5,y,z,0x9b6b3f);
      const color=i%2?0x3ab5cc:0xffc85a;
      box(world,.20,.34,.10,x,y-.21,z,color);
      box(world,.25,.06,.13,x,y-.37,z,0xffe7a7);
    }
  }
  // Small festival kiosks provide occasional landmarks beyond the fence.
  // They are baked with the forest and do not affect the course or collision.
  for(const [side,z] of [[-1,22],[1,47],[-1,77],[1,107],[-1,137]]){
    const x=side*6.65;
    box(world,2.5,.22,1.9,x,.11,z,0x79513b);
    box(world,2.1,1.7,.18,x,1.08,z+.7,0x1e7779);
    for(const dx of [-1,1])box(world,.18,2.15,.18,x+dx,1.18,z,0x835333);
    box(world,2.7,.22,2.25,x,2.30,z,0x684838);
    box(world,2.28,.22,1.92,x,2.52,z,0x256e71);
    box(world,1.70,.20,1.48,x,2.72,z,0x318b87);
    box(world,1.02,.15,1.05,x,2.90,z,0x62afa1);
    box(world,2.24,.10,.14,x,1.72,z-.85,0xe6b85f);
    for(const dx of [-.65,.65]){
      box(world,.38,.42,.32,x+dx,1.45,z-.90,0xffc35d);
      box(world,.44,.08,.38,x+dx,1.69,z-.90,0x604333);
    }
    box(world,1.65,.12,.52,x,.90,z-.67,0xc18a53);
    box(world,.36,.20,.32,x-.42,1.06,z-.67,0xf2d17b);
    box(world,.28,.16,.29,x+.30,1.04,z-.67,0xe47b5d);
  }
  // Bake static scenery into one vertex-colour mesh; never allocate per-frame.
  world.updateMatrixWorld(true);
  const positions=[], normals=[], colors=[];
  world.traverse(node=>{
    if(!node.isMesh)return;
    const geom=node.geometry.toNonIndexed();geom.applyMatrix4(node.matrixWorld);
    const p=geom.getAttribute('position'), n=geom.getAttribute('normal'), color=node.material.color;
    for(let i=0;i<p.count;i++){positions.push(p.getX(i),p.getY(i),p.getZ(i));normals.push(n.getX(i),n.getY(i),n.getZ(i));colors.push(color.r,color.g,color.b);}
    geom.dispose();node.geometry.dispose();node.material.dispose();geometries.delete(node.geometry);materials.delete(node.material);
  });
  world.clear();
  const baked=new THREE.BufferGeometry();baked.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));baked.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));baked.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
  const worldMat=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.8});geometries.add(baked);materials.add(worldMat);
  const scenery=new THREE.Mesh(baked,worldMat);scenery.castShadow=true;scenery.receiveShadow=true;world.add(scenery);
  // Clouds keep their pale silhouette in backlight and share a single draw call.
  const cloudGeometry=new THREE.BoxGeometry(1,1,1),cloudMaterial=new THREE.MeshBasicMaterial({color:0xfff7de});
  geometries.add(cloudGeometry);materials.add(cloudMaterial);
  const clouds=new THREE.InstancedMesh(cloudGeometry,cloudMaterial,12),cloudMatrix=new THREE.Matrix4();
  let cloudIndex=0;
  for(let i=0;i<4;i++){
    const side=i%2?-1:1,x=side*12,z=i*38+25;
    for(const [dx,y,w,h] of [[0,9.3,3,.72],[side*.15,9.95,1.55,.7],[-side*1.5,9.25,1.05,.52]]){
      cloudMatrix.compose(new THREE.Vector3(x+dx,y,z),new THREE.Quaternion(),new THREE.Vector3(w,h,1.1));
      clouds.setMatrixAt(cloudIndex++,cloudMatrix);
    }
  }
  clouds.computeBoundingSphere();scene.add(clouds);
  // Luminous lantern faces share one instanced material and follow existing posts.
  const lampGeometry=new THREE.BoxGeometry(1,1,1),lampMaterial=new THREE.MeshStandardMaterial({color:0xffd982,emissive:0xffaa40,emissiveIntensity:.65,roughness:.65});
  geometries.add(lampGeometry);materials.add(lampMaterial);
  const lampFaces=new THREE.InstancedMesh(lampGeometry,lampMaterial,32),lampMatrix=new THREE.Matrix4();let lampIndex=0;
  for(let i=0;i<31;i+=2)for(const x of [-4.5,4.5]){
    lampMatrix.compose(new THREE.Vector3(x,1.8,i*5-5),new THREE.Quaternion(),new THREE.Vector3(.46,.46,.54));
    lampFaces.setMatrixAt(lampIndex++,lampMatrix);
  }
  lampFaces.computeBoundingSphere();scene.add(lampFaces);
  // Original flag artwork is a shared atlas-backed billboard, placed within the 3D scene.
  const flagTexture=new THREE.TextureLoader().load(new URL('assets/props.webp',import.meta.url).href,texture=>{if(disposed)texture.dispose();});
  flagTexture.colorSpace=THREE.SRGBColorSpace;flagTexture.repeat.set(1/3,1/3);flagTexture.offset.set(0,0);textures.add(flagTexture);
  const earthTexture=new THREE.TextureLoader().load(new URL('assets/track-earth.webp',import.meta.url).href,texture=>{if(disposed)texture.dispose();});
  earthTexture.colorSpace=THREE.SRGBColorSpace;earthTexture.wrapS=earthTexture.wrapT=THREE.RepeatWrapping;earthTexture.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());textures.add(earthTexture);
  const flagMaterial=new THREE.SpriteMaterial({map:flagTexture,transparent:true,depthWrite:false});materials.add(flagMaterial);
  const flags=new THREE.Group();scene.add(flags);
  for(let i=1;i<12;i++){const flag=new THREE.Sprite(flagMaterial);flag.position.set(i%2?-4.0:4.0,1.05,i*11+6);flag.scale.set(1.8,1.8,1);flags.add(flag);}
  const markers=new THREE.Group(); scene.add(markers);
  const ghostMarker=new THREE.Group();scene.add(ghostMarker);ghostMarker.visible=false;const ghostProjection=new THREE.Vector3(),ghostProjectionNext=new THREE.Vector3();
  const ghostPole=box(ghostMarker,.12,1.15,.12,0,.575,0,0x67d8ed),ghostFlag=box(ghostMarker,.64,.42,.10,0,1.05,0,0x3cc3dc),ghostStripe=box(ghostMarker,.47,.09,.11,0,1.06,-.061,0xe9ffff);
  for(const node of [ghostPole,ghostFlag,ghostStripe]){node.material.transparent=true;node.material.opacity=.72;node.material.depthWrite=false;node.castShadow=false;}

  const fia=new THREE.Group(); scene.add(fia);
  // Deliberately designed block-animal silhouette with jointed independent legs.
  // Align the chest with the same three-quarter facing as the fox head.
  // The cream chest remains a real 3D surface, rather than an overlay.
  const torso=new THREE.Group();torso.rotation.y=1.95;fia.add(torso);
  box(torso,.9,1.0,.56,0,1.33,0,0xd87427);box(torso,.56,.7,.08,0,1.31,.33,0xffe5ae);box(torso,.3,.08,.62,0,.93,0,0x9b4f20);
  const head=new THREE.Group();fia.add(head);head.rotation.y=1.95;
  box(head,1.15,.93,.8,0,2.15,0,0xe98224); box(head,.78,.28,.34,0,1.98,.5,0xffe7ba);
  // Stepped forelock echoes Fia's approved cuboid silhouette without changing her face.
  box(head,.32,.19,.35,0,2.72,.13,0xf18c29);box(head,.22,.16,.25,-.20,2.66,.20,0xdc711c);box(head,.18,.22,.22,.15,2.78,.04,0xf79e31);
  box(head,.16,.20,.11,-.53,1.98,.38,0xffd9a1);box(head,.16,.20,.11,.53,1.98,.38,0xffd9a1);
  box(head,.34,.08,.06,-.32,2.51,.44,0x974820);box(head,.34,.08,.06,.32,2.51,.44,0x974820);
  box(head,.2,.13,.15,0,2.08,.7,0x38291f);
  const arms=[];
  for(const x of [-.32,.32]){
    box(head,.34,.4,.05,x,2.3,.42,0x9a4a21);box(head,.27,.34,.08,x,2.3,.47,0xfff7e4); box(head,.13,.23,.06,x,2.3,.53,0x267fa9);box(head,.05,.07,.03,x-.025,2.36,.57,0xffffff);
    const ear=new THREE.Group();ear.position.set(x*1.45,2.55,-.05);ear.rotation.z=x<0?.55:-.55;head.add(ear);
    box(ear,.48,.46,.36,0,.23,0,0xe77c22);box(ear,.48,.13,.37,0,.52,0,0x6e3926);box(ear,.30,.28,.08,0,.23,.20,0xffddbb);
    const arm=new THREE.Group();arm.position.set(x*1.9,1.7,0);fia.add(arm);
    box(arm,.28,.62,.28,0,-.3,0,0xe1842e);box(arm,.38,.28,.36,0,-.60,.04,0x4c3527);box(arm,.38,.08,.37,0,-.54,.04,0xffd15d);arms.push(arm);
  }
  const boltShape=new THREE.Shape();boltShape.moveTo(.02,2.70);boltShape.lineTo(-.13,2.46);boltShape.lineTo(-.02,2.46);boltShape.lineTo(-.09,2.30);boltShape.lineTo(.15,2.53);boltShape.lineTo(.04,2.53);boltShape.closePath();
  const boltGeometry=new THREE.ExtrudeGeometry(boltShape,{depth:.045,bevelEnabled:false}),boltMaterial=new THREE.MeshStandardMaterial({color:0xffdc4f,roughness:.65});
  geometries.add(boltGeometry);materials.add(boltMaterial);const bolt=new THREE.Mesh(boltGeometry,boltMaterial);bolt.position.z=.43;head.add(bolt);
  box(head,.22,.045,.04,.28,1.90,.64,0x513225);box(head,.06,.08,.04,.40,1.94,.64,0x513225);
  box(fia,1.02,.19,.7,0,1.72,0,0x1689bd); box(fia,.28,.22,.1,.29,1.72,.42,0xffd554);
  // Spark Paw's gold star and cyan centre are a real 3D scarf pin, facing
  // the fixed camera; keep the geometry owned by this scene for disposal.
  function badgeStar(radius) {
    const shape=new THREE.Shape();
    for(let i=0;i<10;i++){const a=Math.PI/2+i*Math.PI/5,r=i%2?radius*.44:radius,x=Math.cos(a)*r,y=Math.sin(a)*r;if(i===0)shape.moveTo(x,y);else shape.lineTo(x,y);}
    shape.closePath();return shape;
  }
  const badgeOuter=new THREE.ExtrudeGeometry(badgeStar(.17),{depth:.045,bevelEnabled:false});
  const badgeInner=new THREE.ShapeGeometry(badgeStar(.085));
  const badgeGold=new THREE.MeshStandardMaterial({color:0xffcc38,roughness:.6});
  const badgeBlue=new THREE.MeshStandardMaterial({color:0x39c9ed,emissive:0x057baf,emissiveIntensity:.22,roughness:.65,side:THREE.DoubleSide});
  geometries.add(badgeOuter);geometries.add(badgeInner);materials.add(badgeGold);materials.add(badgeBlue);
  const badge=new THREE.Group(), badgeRim=new THREE.Mesh(badgeOuter,badgeGold),badgeCentre=new THREE.Mesh(badgeInner,badgeBlue);
  badgeCentre.position.z=.05;badge.add(badgeRim,badgeCentre);badge.position.set(.55,1.72,-.38);badge.rotation.y=Math.atan2(6.2,-9);fia.add(badge);
  const scarf=new THREE.Group();scarf.position.set(0,1.72,0);fia.add(scarf);
  // A continuous, closed low-poly ribbon carries Fia's blue-and-gold scarf.
  // Its two owned meshes follow the same reduced-motion-aware scarf pivot.
  const ribbonPoints=[[-.09,-.04,-.48],[-.23,.02,-.64],[-.37,.14,-.80],[-.51,.30,-.96],[-.65,.46,-1.12],[-.79,.53,-1.28],[-.93,.48,-1.44]];
  function ribbon(width,depth,color) {
    const vertices=[];
    for(let i=0;i<ribbonPoints.length-1;i++){
      const [x1,y1,z1]=ribbonPoints[i],[x2,y2,z2]=ribbonPoints[i+1];
      vertices.push(x1,y1-width,z1-.08-depth,x2,y2-width,z2-.08-depth,x1,y1+width,z1-.08-depth,x2,y2-width,z2-.08-depth,x2,y2+width,z2-.08-depth,x1,y1+width,z1-.08-depth);
      if(depth===0){
        vertices.push(x1,y1+width,z1+.08,x2,y2-width,z2+.08,x1,y1-width,z1+.08,x1,y1+width,z1+.08,x2,y2+width,z2+.08,x2,y2-width,z2+.08);
        for(const sign of [-1,1]) vertices.push(x1,y1+sign*width,z1-.08,x1,y1+sign*width,z1+.08,x2,y2+sign*width,z2-.08,x1,y1+sign*width,z1+.08,x2,y2+sign*width,z2+.08,x2,y2+sign*width,z2-.08);
      }
    }
    if(depth===0)for(const index of [0,ribbonPoints.length-1]){
      const [x,y,z]=ribbonPoints[index];
      vertices.push(x,y-width,z-.08,x,y-width,z+.08,x,y+width,z-.08,x,y-width,z+.08,x,y+width,z+.08,x,y+width,z-.08);
    }
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geo.computeVertexNormals();
    const mat=new THREE.MeshStandardMaterial({color,roughness:.72,side:THREE.DoubleSide});geometries.add(geo);materials.add(mat);const mesh=new THREE.Mesh(geo,mat);mesh.castShadow=true;mesh.receiveShadow=true;scarf.add(mesh);
  }
  ribbon(.15,0,0x168ed1);ribbon(.035,.01,0xffd94f);
  const scarfTip=new THREE.Mesh(badgeOuter,badgeGold);scarfTip.position.set(-.93,.48,-1.60);scarfTip.rotation.y=Math.atan2(6.2,-9);scarf.add(scarfTip);
  const tail=new THREE.Group();fia.add(tail);
  // A tapered voxel plume gives the fox a full tail silhouette while the
  // individual blocks stay in one animated, disposable instanced mesh.
  const voxel=.14,plumeCells=[];
  for(let iz=0;iz<8;iz++){
    const z=-.47-iz*voxel,cx=-.14-(iz>=4?voxel:0),cy=1.05+Math.floor(iz/3)*voxel;
    const radius=[1,2,2,3,3,3,2,2][iz];
    for(let ix=-3;ix<=3;ix++)for(let iy=-3;iy<=3;iy++){
      const x=cx+ix*voxel,y=cy+iy*voxel;
      if(ix*ix+iy*iy>radius*radius)continue;
      const color=iz>=6?0xffe8bf:(iy===2&&iz>=2&&iz<=4?0xffc84d:0xf58225);
      plumeCells.push({x,y,z,color});
    }
  }
  const plumeGeometry=new THREE.BoxGeometry(voxel,voxel,voxel),plumeMaterial=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.8});
  geometries.add(plumeGeometry);materials.add(plumeMaterial);
  const plume=new THREE.InstancedMesh(plumeGeometry,plumeMaterial,plumeCells.length),plumePose=new THREE.Object3D(),plumeColor=new THREE.Color();
  plumeCells.forEach(({x,y,z,color},i)=>{plumePose.position.set(x,y,z);plumePose.updateMatrix();plume.setMatrixAt(i,plumePose.matrix);plume.setColorAt(i,plumeColor.setHex(color));});
  plume.instanceMatrix.needsUpdate=true;if(plume.instanceColor)plume.instanceColor.needsUpdate=true;
  plume.castShadow=true;plume.receiveShadow=true;plume.computeBoundingSphere();tail.add(plume);
  const legs=[],shoeBodies=[];
  for(const x of [-.29,.29]) {const pivot=new THREE.Group();pivot.position.set(x,.98,0);fia.add(pivot);
    box(pivot,.34,.68,.36,0,-.32,0,0xdc7726);shoeBodies.push(box(pivot,.44,.27,.56,0,-.67,.14,0x116bca));box(pivot,.38,.07,.12,0,-.53,.16,0xffca43);box(pivot,.12,.12,.13,-.07,-.67,.44,0xffe5ba);box(pivot,.12,.12,.13,.07,-.67,.44,0xffe5ba);legs.push(pivot);}
  // Shoe colors echo the authored equipment art without affecting movement.
  const shoeColors={balanced:0x116bca,steady:0x0b8f7a,swift:0xea7020};let renderedShoe=null;
  // One reusable foot-contact burst; it only appears after an accepted step.
  const contact=new THREE.Group();scene.add(contact);contact.visible=false;
  const contactBits=[];
  for(const [x,z,size] of [[-.38,-.28,.23],[.38,-.28,.23],[-.23,-.56,.18],[.23,-.56,.18]]){
    const bit=box(contact,size,.1,size,x,.13,z,0xffe884);bit.material.transparent=true;bit.material.depthWrite=false;contactBits.push(bit);
  }
  // One bounded pulse marks the actual twelve-step speed streak; it owns no gameplay state.
  const streakPulseGeometry=new THREE.RingGeometry(.42,.55,20);
  const streakPulseMaterial=new THREE.MeshBasicMaterial({color:0x9beef4,transparent:true,opacity:.7,depthWrite:false,side:THREE.DoubleSide});
  geometries.add(streakPulseGeometry);materials.add(streakPulseMaterial);
  const streakPulse=new THREE.Mesh(streakPulseGeometry,streakPulseMaterial);streakPulse.rotation.x=-Math.PI/2;streakPulse.visible=false;scene.add(streakPulse);
  const trail=new THREE.Group();fia.add(trail);for(const [x,z,size] of [[-.55,-1.45,.17],[.44,-1.7,.13],[0,-2,.1]])box(trail,size,.04,size,x,.08,z,0xffdf65);trail.visible=false;
  const speedWake=new THREE.Group();fia.add(speedWake);speedWake.visible=false;
  for(const [x,z,length] of [[-.55,-.9,.7],[.5,-1.25,1.0],[-.25,-1.6,.55]]){
    const streak=box(speedWake,.07,.06,length,x,.16,z,0x9eeaf2);streak.material.transparent=true;streak.material.opacity=.7;streak.material.depthWrite=false;
  }
  let stageId=null, markerMeshes=[], landmarkMeshes=[], visualLane=0;
  function configure(stage) {
    if(stageId===stage.id)return; stageId=stage.id;
    const evening=stage.chapter===2;
    scene.background.setHex(evening?0x5b8ca5:0x80bfd0);scene.fog.color.setHex(evening?0xc6aa9a:0xc5e0d3);setSky(evening);
    ambient.color.setHex(evening?0xa3d7ef:0xbbeaff);ambient.intensity=evening?1.9:2.1;
    sun.color.setHex(evening?0xffbc72:0xffcf82);sun.intensity=evening?2.0:2.3;
    for(const child of [...markers.children]) {child.traverse(node=>{if(node.isMesh){node.geometry.dispose();node.material.dispose();geometries.delete(node.geometry);materials.delete(node.material);}});markers.remove(child);}
    markerMeshes=[];landmarkMeshes=[];
    for(let i=0;i<stage.route.length;i++) {
      const rule=stage.route[i], start=stage.distance*i/stage.route.length, length=stage.distance/stage.route.length;
      const color=rule==='slow'?0x65a7b7:rule==='fast'||rule==='headfast'?0xf0b85a:rule==='bridge'?0x5c9ca2:rule.startsWith('fork')?0x8a78ad:0x9b9074;
      const surface=box(markers,6.8,.04,Math.max(.2,length-.12),0,.03,start+length/2,color); const marker={surface,rule,start,gate:null,leftLane:null,rightLane:null};markerMeshes.push(marker);
      if(['plain','headwind','tailwind','left','right'].includes(rule)) {
        const uv=surface.geometry.getAttribute('uv');for(let v=0;v<uv.count;v++)uv.setXY(v,uv.getX(v)*1.1,uv.getY(v)*length/6);
        uv.needsUpdate=true;surface.material.map=earthTexture;surface.material.needsUpdate=true;
      }
      // Repeated inlays distinguish surfaces at a glance without covering the live bridge light.
      if(rule==='bridge') {
        for(const x of [-3.16,3.16])box(markers,.16,.1,Math.max(.2,length-.35),x,.10,start+length/2,0xd4b576);
        for(let k=1;k<=4;k++)box(markers,5.95,.025,.10,0,.07,start+length*k/5,0xb8dfcc);
      }
      if(rule==='slow'||rule==='fast'||rule==='headfast') {
        const inlay=rule==='slow'?0xc0e2df:0xffe5a4;
        for(let k=1;k<=3;k++) {
          if(rule==='slow')for(const x of [-1.15,1.15])box(markers,1.35,.025,.12,x,.07,start+length*k/4,inlay);
          else box(markers,3.3,.025,.12,0,.07,start+length*k/4,inlay);
        }
      }
      if(rule==='headwind'||rule==='headfast'||rule==='tailwind')windFlag(markers,3.55,start+2,rule!=='tailwind');
      // The camera faces +Z, so positive world X is screen-left.
      if(rule==='forkwindbridge')windFlag(markers,1.7,start+2,true);
      if(rule==='forkmaster')windFlag(markers,-1.7,start+2,true);
      if(rule.startsWith('fork')) {
        box(markers,.16,.05,Math.max(.2,length-.3),0,.09,start+length/2,0xffe2a0);
        marker.leftLane=box(markers,3.05,.05,Math.max(.2,length-.3),1.72,.08,start+length/2,0xd7a266);
        marker.rightLane=box(markers,3.05,.05,Math.max(.2,length-.3),-1.72,.08,start+length/2,0x78a8b5);
      }
      if(rule==='left'||rule==='right'||rule.startsWith('fork')) {
        const gate=new THREE.Group();markers.add(gate);marker.gate=gate;
        // Every arch needs clearance above the runner, including later gates.
        const gateHeight=3.8;
        box(gate,.2,gateHeight,.2,-3.2,gateHeight/2,start,0x885d35); box(gate,.2,gateHeight,.2,3.2,gateHeight/2,start,0x885d35);
        box(gate,6.4,.18,.2,0,gateHeight,start,0xd9af64);
        // Small lanterns and coloured end caps echo the festival artwork while
        // leaving the centre and foot signs clear for the runner and route cue.
        for(const side of [-1,1]) {
          box(gate,.36,.14,.36,side*3.2,gateHeight+.12,start,0xffd36e);
          const lamp=box(gate,.25,.34,.25,side*2.85,gateHeight-.30,start,0xffc75c);lamp.material.emissive.setHex(0xffa342);lamp.material.emissiveIntensity=.5;
          box(gate,.34,.07,.34,side*2.85,gateHeight-.10,start,0x774b32);
          box(gate,.12,.26,.12,side*3.2,gateHeight-.4,start,0x1d9ab8);
        }
        if(rule.startsWith('fork')) {box(gate,.85,.5,.12,1.7,1.65,start-.12,0xf4d972);box(gate,.85,.5,.12,-1.7,1.65,start-.12,0x92d2e4);}
        else {box(gate,.85,.5,.12,rule==='left'?1.7:-1.7,1.65,start-.12,0xf4d972);}
      }
    }
    // A clearly framed track tile tells the player where a voluntary repeat
    // can happen. Left/right gold accents use the existing screen mapping;
    // no collision or lane choice is implied by the surface geometry.
    for(const mark of landmarksFor(stage)){
      const tile=new THREE.Group(),side=mark.foot==='left'?1:-1;tile.position.z=mark.position;markers.add(tile);
      box(tile,3.1,.035,1.05,0,.10,0,0x227c83);
      box(tile,3.25,.04,.12,0,.13,-.55,0xffd66f);
      box(tile,3.25,.04,.12,0,.13,+.55,0xffd66f);
      box(tile,.12,.04,1.02,-1.56,.13,0,0xffd66f);
      box(tile,.12,.04,1.02,1.56,.13,0,0xffd66f);
      for(const offset of [-.19,.19])box(tile,.50,.04,.22,side*.72,.15,offset,0xffe598);
      const pos=[],norm=[],colors=[];tile.traverse(node=>{if(!node.isMesh)return;node.updateMatrix();const g=node.geometry.toNonIndexed();g.applyMatrix4(node.matrix);const p=g.getAttribute('position'),n=g.getAttribute('normal'),c=node.material.color;for(let i=0;i<p.count;i++){pos.push(p.getX(i),p.getY(i),p.getZ(i));norm.push(n.getX(i),n.getY(i),n.getZ(i));colors.push(c.r,c.g,c.b)}g.dispose();node.geometry.dispose();node.material.dispose();geometries.delete(node.geometry);materials.delete(node.material)});tile.clear();
      const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('normal',new THREE.Float32BufferAttribute(norm,3));geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));const mat=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.8,transparent:true});geometries.add(geo);materials.add(mat);const mesh=new THREE.Mesh(geo,mat);mesh.receiveShadow=true;tile.add(mesh);landmarkMeshes.push(tile);
    }
    box(markers,.2,3,.2,-3.3,1.5,stage.distance,0xb17748); box(markers,.2,3,.2,3.3,1.5,stage.distance,0xb17748);
    box(markers,6.8,.3,.25,0,3,stage.distance,0xe9c97b);
    // A compact chequered finish ribbon makes the goal distinct from gates;
    // the open centre and floor stripe stay decorative, with no collision.
    const finishDetails=new THREE.Group();markers.add(finishDetails);
    for(let n=0;n<8;n++)box(finishDetails,.8,.19,.08,-2.87+n*.82,3.03,stage.distance-.17,n%2?0xf9e6ac:0x258fa5);
    for(const side of [-1,1])box(finishDetails,.38,.14,.38,side*3.3,3.2,stage.distance,0xffd36e);
    box(finishDetails,6.45,.025,.16,0,.10,stage.distance-.35,0xffe9ac);
    // One owned mesh keeps the small multicolour finish details to one draw.
    const finishPositions=[],finishNormals=[],finishColors=[];
    finishDetails.traverse(node=>{
      if(!node.isMesh)return;
      node.updateMatrix();const geom=node.geometry.toNonIndexed();geom.applyMatrix4(node.matrix);
      const p=geom.getAttribute('position'),n=geom.getAttribute('normal'),c=node.material.color;
      for(let i=0;i<p.count;i++){finishPositions.push(p.getX(i),p.getY(i),p.getZ(i));finishNormals.push(n.getX(i),n.getY(i),n.getZ(i));finishColors.push(c.r,c.g,c.b);}
      geom.dispose();node.geometry.dispose();node.material.dispose();geometries.delete(node.geometry);materials.delete(node.material);
    });
    finishDetails.clear();
    const finishGeometry=new THREE.BufferGeometry();finishGeometry.setAttribute('position',new THREE.Float32BufferAttribute(finishPositions,3));finishGeometry.setAttribute('normal',new THREE.Float32BufferAttribute(finishNormals,3));finishGeometry.setAttribute('color',new THREE.Float32BufferAttribute(finishColors,3));
    const finishMaterial=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.8});geometries.add(finishGeometry);materials.add(finishMaterial);
    const finishMesh=new THREE.Mesh(finishGeometry,finishMaterial);finishMesh.castShadow=true;finishMesh.receiveShadow=true;finishDetails.add(finishMesh);
  }
  function resize() {const r=container.getBoundingClientRect(); if(r.width<=0||r.height<=0)return;renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.fov=THREE.MathUtils.radToDeg(2*Math.atan(Math.tan(THREE.MathUtils.degToRad(29))*Math.min(1,1.1/camera.aspect)));camera.updateProjectionMatrix();}
  function draw(race,reducedMotion=false) {
    configure(race.stage); const z=race.distance;
    if(race.shoe!==renderedShoe){renderedShoe=race.shoe;for(const shoe of shoeBodies)shoe.material.color.setHex(shoeColors[race.shoe]??shoeColors.balanced);}
    const part=segmentFor(race),targetLane=part.original.startsWith('fork')?(part.choice==='left'?1.7:part.choice==='right'?-1.7:0):0;
    visualLane=reducedMotion?targetLane:THREE.MathUtils.lerp(visualLane,targetLane,.16);const lane=visualLane;
    fia.position.set(lane,0,z); camera.position.set(6.2+lane,6.0,z-9.0);camera.lookAt(lane-(camera.aspect<=1.1?.65:0),camera.aspect>1.1?1.6:1.3,z+(camera.aspect>1.1?1.3:3.5));
    ghostMarker.visible=Number.isFinite(race.ghostPosition);
    if(ghostMarker.visible){
      let markerX=3.5;
      // When the recorded position approaches an edge, keep its marker readable
      // on narrow screens without changing its along-course position.
      camera.updateMatrixWorld();ghostProjection.set(markerX,1.05,race.ghostPosition).project(camera);ghostProjectionNext.set(markerX-1,1.05,race.ghostPosition).project(camera);
      const gain=ghostProjectionNext.x-ghostProjection.x;
      if(ghostProjection.x<-.78&&gain>.0001)markerX=Math.max(.4,markerX-Math.min(3.1,(-.78-ghostProjection.x)/gain));
      ghostMarker.position.set(markerX,0,race.ghostPosition);
    }
    sky.position.copy(camera.position);sun.position.set(-8,16,z-7);sun.target.position.set(0,0,z+2);scene.add(sun.target);
    const phase=race.lastStep===null?0:Math.min(1,(race.elapsed-race.lastStep)/.35);
    // Keep the last contact foot close to the track while the other leg
    // swings. Positive world X is screen-left, matching the contact burst.
    // An unused feather can create speed before the first step: remain neutral
    // until an actual foot input, and keep reduced motion neutral throughout.
    const amplitude=reducedMotion||race.speed<.2||race.lastFoot===null?0:.18+Math.sin(phase*Math.PI)*.7;
    const contactVisible=race.lastStep!==null&&phase<1;
    contact.visible=contactVisible;
    if(contactVisible){
      const clean=race.lastFeedback==='steady'||race.lastFeedback==='landmark',strength=clean&&race.combo>=12?1.6:clean&&race.combo>=3?1.3:1;
      contact.position.set(lane+(race.lastFoot==='left'?.3:-.3),0,race.lastContactDistance);
      contact.scale.setScalar(reducedMotion?1:strength*(.7+phase*.8));
      for(const bit of contactBits){bit.material.opacity=reducedMotion?.8:Math.max(0,1-phase);bit.material.color.setHex(clean?0xffd873:0xe7a29a);}
    }
    streakPulse.visible=!reducedMotion&&contactVisible&&(race.lastFeedback==='landmark'||((race.combo===12||race.combo===24)&&race.lastFeedback==='steady'));
    if(streakPulse.visible){
      streakPulse.position.set(lane+(race.lastFoot==='left'?.3:-.3),.12,race.lastContactDistance);
      streakPulse.scale.setScalar(.8+phase*.9);streakPulseMaterial.opacity=.7*(1-phase);
    }
    fia.position.y=-.08;

    legs[0].rotation.x=amplitude?(race.lastFoot==='right'?-.08:amplitude):0;
    legs[1].rotation.x=amplitude?(race.lastFoot==='left'?-.08:amplitude):0;
    arms[0].rotation.x=-legs[0].rotation.x*.7;arms[1].rotation.x=-legs[1].rotation.x*.7;
    scarf.rotation.y=reducedMotion||race.speed<.2?0:Math.sin(race.elapsed*4)*.13;
    // Secondary motion follows the actual running state; reduced motion stays still.
    tail.rotation.y=reducedMotion||race.speed<.2?0:Math.sin(race.elapsed*4)*.16;
    head.rotation.x=reducedMotion||race.speed<.2?0:Math.sin(phase*Math.PI)*.09;
    speedWake.visible=(race.combo>=12||race.elapsed<race.burstUntil||race.elapsed<race.landmarkUntil)&&race.speed>2&&!reducedMotion;
    speedWake.position.z=speedWake.visible?-.16*(.5+.5*Math.sin(race.elapsed*9)):0;
    fia.rotation.z=reducedMotion?0:(race.balance<30?.12:0);fia.rotation.x=reducedMotion?0:Math.min(.08,race.speed*.022);
    landmarkMeshes.forEach((tile,i)=>{const mark=race.landmarks[i],duration=reducedMotion?.12:.35,age=mark?.collected?race.elapsed-mark.collectedAt:0;tile.visible=!!mark&&(mark.collected?age<duration:z<=mark.position+2.5);if(tile.visible){tile.children[0].material.opacity=mark.collected?Math.max(0,1-age/duration):1;tile.scale.setScalar(mark.collected&&!reducedMotion?1-.2*Math.min(1,age/duration):1);}});
    markerMeshes.forEach((m,i)=>{
      if(m.gate)m.gate.visible=z<=m.start+.5;
      if(m.rule==='bridge')m.surface.material.color.setHex(i===part.index&&bridgeOpen(race)?0x96e5bf:0x3e777b);
      if(m.leftLane&&m.rightLane){
        const activeBridge=i===part.index&&part.rule==='bridge',glow=activeBridge&&bridgeOpen(race)?0x96e5bf:0x3e777b;
        m.leftLane.material.color.setHex(activeBridge&&part.choice==='left'?glow:0xd7a266);
        m.rightLane.material.color.setHex(activeBridge&&part.choice==='right'?glow:0x78a8b5);
      }
    });
    renderer.render(scene,camera);
  }
  function dispose(){if(disposed)return;disposed=true;renderer.setAnimationLoop(null);clouds.dispose();lampFaces.dispose();plume.dispose();for(const g of geometries)g.dispose();for(const m of materials)m.dispose();for(const t of textures)t.dispose();sun.shadow.dispose();renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();}
  resize(); return {draw,resize,dispose,setTrail:enabled=>{trail.visible=!!enabled;},info:()=>({threeRevision:THREE.REVISION,pixelRatio:renderer.getPixelRatio(),calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures})};
}
