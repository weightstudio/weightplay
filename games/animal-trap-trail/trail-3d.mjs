import * as T from './vendor/three/three.module.min.js';
import {createOrla} from './trail-owl.mjs';

export async function createTrailRenderer(canvas, lifecycle) {
  const renderer=new T.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
  renderer.outputColorSpace=T.SRGBColorSpace;
  renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
  renderer.setClearColor(0x081426,0);
  const scene=new T.Scene();scene.fog=new T.Fog('#172c45',18,45);
  const camera=new T.OrthographicCamera(-6,6,6,-6,.1,70);
  scene.add(new T.HemisphereLight('#d3efff','#243347',2.6));
  const key=new T.DirectionalLight('#ffe0ab',3.1);key.position.set(7,12,10);key.target.position.set(8,0,0);scene.add(key,key.target);
  key.castShadow=true;key.shadow.mapSize.set(1024,1024);
  Object.assign(key.shadow.camera,{left:-14,right:14,top:10,bottom:-6,near:.5,far:40});key.shadow.bias=-.001;key.shadow.normalBias=.025;
  const rim=new T.DirectionalLight('#6cbce6',2);rim.position.set(5,5,-6);scene.add(rim);
  const box=new T.BoxGeometry(1,1,1), ring=new T.RingGeometry(.86,1,32), edges=new T.EdgesGeometry(box);
  const shape=new T.Shape();shape.moveTo(-.475,-.475);shape.lineTo(.475,-.475);shape.lineTo(.475,.475);shape.lineTo(-.475,.475);shape.closePath();
  const heroBox=new T.ExtrudeGeometry(shape,{depth:.95,bevelEnabled:true,bevelThickness:.025,bevelSize:.025,bevelSegments:1,steps:1});heroBox.translate(0,0,-.475);
  const materials=new Map();
  const material=(color,emissive=0)=>{
    const id=`${color}/${emissive}`;
    if(!materials.has(id))materials.set(id,new T.MeshStandardMaterial({color,roughness:.84,metalness:.04,emissive:color,emissiveIntensity:emissive}));
    return materials.get(id);
  };
  const block=(parent,size,at,mat,geometry=box)=>{
    const mesh=new T.Mesh(geometry,mat);mesh.scale.set(...size);mesh.position.set(...at);mesh.receiveShadow=true;parent.add(mesh);return mesh;
  };
  const owl=createOrla((parent,size,at,mat)=>{const mesh=block(parent,size,at,mat,heroBox);mesh.castShadow=true;return mesh;},material);scene.add(owl.root);
  let level=null, currentStage=0, gapParts=[], spike, falseFloor, gateGlow, ceiling;
  const staged=[], dummy=new T.Object3D();
  let batches=new Map();
  const stone=material('#435c71'), cap=material('#92b4b5'), dark=material('#253d55');
  const stoneAlt=material('#354d66'), inset=material('#1d344c');
  const trim=material('#5b7e89'), gold=material('#eab55e'), cyan=material('#8ce7d7',.3);
  const red=material('#ed6979',.18), purple=material('#ae83c4',.2), black=material('#182942');
  const lamp=material('#ffe0a0',.8), tree=material('#243e51'), bark=material('#324455');
  function batch(size,at,mat) {
    if(!batches.has(mat))batches.set(mat,[]);batches.get(mat).push({size,at});
  }
  function flush() {
    for(const [mat,items] of batches) {
      const m=new T.InstancedMesh(box,mat,items.length);
      items.forEach(({size,at},i)=>{dummy.position.set(...at);dummy.scale.set(...size);dummy.rotation.set(0,0,0);dummy.updateMatrix();m.setMatrixAt(i,dummy.matrix);});
      m.instanceMatrix.needsUpdate=true;level.add(m);staged.push(m);
    }
    batches=new Map();
  }
  function clearLevel() {
    if(level)scene.remove(level);
    // InstancedMesh owns its GPU instance attributes; shared geometry/materials live on.
    staged.splice(0).forEach(m=>m.dispose());
    level=new T.Group();scene.add(level);gapParts=[];
  }
  function terrain(start,end,index) {
    const g=new T.Group();level.add(g);gapParts.push({g,start,end,index});
    block(g,[1,.15,1.55],[0,-.075,0],cap);
    block(g,[1,.32,1.48],[0,-.31,-.02],stone);
    block(g,[1,1.9,1.32],[0,-1.42,-.09],dark);
    block(g,[1,.055,.055],[0,-.12,.8],trim);
    // Large bevel-like inset layers and vertical buttresses, no flat rectangle floor.
    for(let x=start+.5;x<end-.5;x+=.8) {
      batch([.72,.17,.09],[x,-.45,.68],stone);
      batch([.12,.6,.13],[x,-.82,.65],trim);
      batch([.72,.025,1.45],[x,.012,0],trim);
      for(let row=0;row<4;row++) {
        batch([.72,.30,.09],[x,-1.02-row*.35,.59],(Math.round(x)+row)%3?stoneAlt:stone);
        batch([.50,.18,.025],[x,-1.02-row*.35,.65],inset);
      }
      batch([.58,.30,.8],[x,-2.42,-.2],stoneAlt);
      batch([.33,.40,.55],[x+.1,-2.77,-.3],dark);
      // Little inset moon runes on the masonry, not walkable decorations.
      if(Math.round(x)%3===0)batch([.045,.13,.025],[x,-1.06,.68],cyan);
    }
  }
  function build(t) {
    clearLevel();currentStage=t.id;
    // Live gap drift adjusts all adjacent physical terrain boundaries every frame.
    const holes=[{x:t.gap/50,w:74/50}];if(t.secondGap)holes.push({x:t.gap2/50,w:74/50});holes.sort((a,b)=>a.x-b.x);
    let start=-1;holes.forEach((h,i)=>{terrain(start,h.x,i);start=h.x+h.w;});terrain(start,20,holes.length);
    const archAccent=['#6caaad','#7d9bc5','#918ac1','#5aa4ac','#a48da4','#aa9b72'][Math.floor((t.id-1)/5)];
    const accent=material(archAccent);
    // Mid-distance geometry is below/behind play: dark trees and ruined archive.
    for(let i=0;i<12;i++) {
      const x=i*2.1-2,z=-3.5-(i%3)*1.4,h=2.4+(i*7%5)*.42;
      batch([.18,h,.2],[x,h/2-.8,z],bark);
      for(let j=0;j<5;j++)batch([.28+j*.26,.42,.24+j*.20],[x,h-.8-j*.36,z],tree);
    }
    for(const x of [-1,7,15,21]) {
      for(const side of [-1,1]) {
        batch([.35,3.5,.55],[x+side*.9,.9,-5],dark);
        batch([.58,.25,.72],[x+side*.9,-.67,-5],stone);
        batch([.62,.2,.8],[x+side*.9,2.7,-5],stone);
        batch([.12,1.7,.1],[x+side*.9,1.3,-4.69],accent);
      }
      batch([2.4,.35,.65],[x,2.96,-5],dark);
      batch([1.7,.25,.55],[x,3.25,-5],stone);
      batch([.8,.18,.5],[x,3.46,-5],accent);
    }
    // Decorative front-edge rune studs, kept clear of actual traps and gaps.
    for(let x=.5;x<18;x+=1.5) {
      if(holes.some(h=>x>h.x-.2&&x<h.x+h.w+.2)||Math.abs(x-t.fake/50)<1)continue;
      batch([.13,.045,.15],[x,.035,.58],gold);
    }
    // Danger geometry has the exact production collider's full horizontal span.
    spike=new T.Group();level.add(spike);
    block(spike,[.84,.08,1.3],[.42,.04,0],black);
    for(let i=0;i<3;i++) {
      block(spike,[.23,.18,.7],[i*.28+.14,.17,0],red);
      block(spike,[.15,.16,.5],[i*.28+.14,.34,0],red);
      block(spike,[.07,.08,.24],[i*.28+.14,.46,0],lamp);
    }
    falseFloor=new T.Group();falseFloor.position.x=t.fake/50;level.add(falseFloor);
    block(falseFloor,[.76,.24,1.55],[.38,.12,0],purple);
    for(let i=0;i<3;i++)block(falseFloor,[.08,.025,.56],[.16+i*.21,.252,(i%2?-.28:.25)],black);
    block(falseFloor,[.76,.04,.07],[.38,.27,.79],purple);
    // Gap edge lamps are low markers, distinct from the tall gold destination.
    for(const h of holes)for(const x of [h.x-.18,h.x+h.w+.18]) {
      batch([.11,.18,.11],[x,.09,-.55],trim);
      batch([.14,.06,.14],[x,.21,-.55],cyan);
    }
    ceiling=new T.Group();ceiling.visible=Boolean(t.ceiling);level.add(ceiling);
    block(ceiling,[3,.32,1.5],[13.7,4.6,0],stone);
    for(let i=0;i<10;i++)block(ceiling,[.12,.05,.6],[12.28+i*.28,4.42,.35],red);
    // Stepped moon archive gate, open physical threshold at x=870.
    const gate=new T.Group();gate.position.set(17.62,0,-.18);level.add(gate);
    for(const side of [-1,1]) {
      block(gate,[.28,2.15,.5],[side*.72,1.08,0],stone);
      block(gate,[.13,1.8,.07],[side*.72,1.18,.29],gold);
      block(gate,[.45,.18,.7],[side*.72,.09,0],gold);
      block(gate,[.40,.16,.62],[side*.72,2.17,0],gold);
      block(gate,[.25,.27,.48],[side*.47,2.34,0],gold);
    }
    block(gate,[.74,.18,.5],[0,2.53,0],gold);
    block(gate,[.28,.30,.28],[0,2.24,0],lamp);
    block(gate,[.40,.07,.38],[0,2.43,0],gold);
    gateGlow=block(gate,[1.08,.025,1.3],[0,.028,0],lamp);
    for(let i=0;i<3;i++)batch([.08,.06,.38],[16.45-i*.36,.05,.1],gold);
    flush();
  }
  const pulseMaterial=new T.MeshBasicMaterial({color:'#a4f5e2',transparent:true,opacity:.5,side:T.DoubleSide,depthWrite:false});
  const pulseRing=new T.Mesh(ring,pulseMaterial);scene.add(pulseRing);
  const dustMaterial=new T.MeshBasicMaterial({color:'#c8fff0',transparent:true,opacity:.6});
  const dust=new T.InstancedMesh(box,dustMaterial,12);scene.add(dust);
  const destination=new T.Mesh(ring,new T.MeshBasicMaterial({color:'#ffe0a0',transparent:true,opacity:.35,side:T.DoubleSide,depthWrite:false}));scene.add(destination);
  const revealMaterial=new T.LineBasicMaterial({color:'#c2fff0',transparent:true,opacity:.85});
  const reveals=Array.from({length:4},()=>{const line=new T.LineSegments(edges,revealMaterial);scene.add(line);return line;});
  const wind=new T.InstancedMesh(box,new T.MeshBasicMaterial({color:'#91d5e2',transparent:true,opacity:.35}),8);scene.add(wind);
  let disposed=false,lost=false,width=0,height=0,lastInfo=0, cameraX=6,previousElapsed=0;
  function contextLost(e){e.preventDefault();lost=true;lifecycle.lost();}
  function contextRestored(){lost=false;renderer.resetState();lifecycle.restored();}
  canvas.addEventListener('webglcontextlost',contextLost);
  canvas.addEventListener('webglcontextrestored',contextRestored);
  canvas.dataset.renderBackend='three-r180';
  return {
    render(s,t,reduced) {
      if(disposed||lost)return;
      if(t.id!==currentStage)build(t);
      if(s.elapsed<previousElapsed){cameraX=6;lastInfo=-1;}previousElapsed=s.elapsed;
      const rect=canvas.getBoundingClientRect();
      if(rect.width<1||rect.height<1)return;
      if(width!==rect.width||height!==rect.height) {width=rect.width;height=rect.height;renderer.setSize(width,height,false);}
      // The horizontal interval is invariant at 600 simulation units. Camera
      // never tilts in X: projected hazard edges coincide with physics edges.
      const viewW=12,playWidth=Math.min(width,height*12/5.8),viewH=viewW*height/playWidth;
      renderer.setViewport((width-playWidth)/2,0,playWidth,height);
      const target=T.MathUtils.clamp(s.player.x/50-3.6,0,7.2)+6;
      cameraX=reduced?target:T.MathUtils.lerp(cameraX,target,.16);
      const groundFraction=viewH<6?.1:.36;
      const targetY=viewH*(.5-groundFraction);
      camera.left=-viewW/2;camera.right=viewW/2;camera.top=viewH/2;camera.bottom=-viewH/2;
      camera.position.set(cameraX,targetY+2.4,20);camera.lookAt(cameraX,targetY,0);camera.updateProjectionMatrix();
      const drift=t.moving?Math.sin(s.elapsed/240)*.2:0;
      const holes=[{x:t.gap/50+drift,w:1.48}];if(t.secondGap)holes.push({x:t.gap2/50,w:1.48});holes.sort((a,b)=>a.x-b.x);
      let start=-1;
      gapParts.forEach(({g},i)=>{const end=holes[i]?.x??20;g.position.x=(start+end)/2;g.scale.x=Math.max(.01,end-start);start=(holes[i]?.x??20)+(holes[i]?.w??0);});
      // Instanced facade details remain behind the shifting solid edges, never
      // bridge a moving hole: their small translation follows the same drift.
      spike.position.x=t.spike/50+(t.moving?Math.sin(s.elapsed/230)*.52:0);
      falseFloor.children[0].material= s.pulse>0 ? lamp : purple;
      owl.animate(s,reduced);
      gateGlow.material=lamp;
      pulseRing.visible=s.pulse>0;
      pulseRing.position.set(s.player.x/50,(390-s.player.y)/50+.7,.65);
      const radius=reduced?1.1:1+(54-s.pulse)*.09;pulseRing.scale.setScalar(radius);
      pulseMaterial.opacity=reduced?.38:s.pulse/110;
      const revealBoxes=[
        [holes[0].x+.74,.09,1.55,.12,1.7],
        [spike.position.x+.42,.27,.9,.58,1.4],
        [t.fake/50+.38,.15,.82,.36,1.65],
        t.secondGap?[t.gap2/50+.74,.09,1.55,.12,1.7]:t.ceiling?[13.7,4.6,3.1,.4,1.6]:null
      ];
      reveals.forEach((line,i)=>{const r=revealBoxes[i];line.visible=Boolean(s.pulse&&r);if(r){line.position.set(r[0],r[1],0);line.scale.set(r[2],r[3],r[4]);}});
      wind.visible=Boolean(t.wind);
      for(let i=0;i<8;i++) {
        dummy.position.set(cameraX-6+(i*1.7+(reduced?0:s.elapsed*.002))%12,.7+i%3*.5,-.6);
        dummy.scale.set(.4,.018,.018);dummy.rotation.set(0,0,.14);dummy.updateMatrix();wind.setMatrixAt(i,dummy.matrix);
      }
      wind.instanceMatrix.needsUpdate=true;
      destination.position.set(17.62,1.5,-.35);destination.scale.setScalar(1.08);
      destination.rotation.z=reduced?0:s.elapsed*.00018;
      destination.material.opacity=reduced?.2:.2+Math.sin(s.elapsed*.003)*.08;
      dust.visible=!reduced&&(s.landingTime>0||s.recovery>0);
      const age=s.recovery?(24-s.recovery)/24:(12-s.landingTime)/12;
      for(let i=0;i<12;i++) {
        const a=i/12*Math.PI*2;
        dummy.position.set(s.player.x/50+Math.cos(a)*age*.9,(390-s.player.y)/50+.08+Math.sin(age*Math.PI)*.4,Math.sin(a)*age*.5);
        dummy.scale.setScalar((1-age)*.075);dummy.rotation.set(0,a,a);dummy.updateMatrix();dust.setMatrixAt(i,dummy.matrix);
      }
      dust.instanceMatrix.needsUpdate=true;
      renderer.render(scene,camera);
      if(s.elapsed-lastInfo>500||lastInfo<=0) {
        lastInfo=s.elapsed;
        canvas.dataset.renderMetrics=JSON.stringify({calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures,programs:renderer.info.programs.length,worldWidth:600,width:Math.round(width),height:Math.round(height),playWidth:Math.round(playWidth),dpr:renderer.getPixelRatio()});
      }
    },
    dispose() {
      if(disposed)return;disposed=true;
      canvas.removeEventListener('webglcontextlost',contextLost);canvas.removeEventListener('webglcontextrestored',contextRestored);
      staged.forEach(m=>m.dispose());dust.dispose();wind.dispose();box.dispose();heroBox.dispose();ring.dispose();edges.dispose();
      materials.forEach(m=>m.dispose());pulseMaterial.dispose();dustMaterial.dispose();destination.material.dispose();revealMaterial.dispose();wind.material.dispose();
      scene.clear();renderer.dispose();renderer.forceContextLoss();
    }
  };
}
