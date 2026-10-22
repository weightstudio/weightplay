import * as THREE from './vendor/three/three.module.min.js';

/* One renderer, demand-driven frames, pooled geometry/materials, six finished
 * miniature scenes. DOM buttons own all input and remain stable during play. */
export function createHabitatRenderer(host, onUnavailable) {
  const canvas = document.createElement('canvas');
  canvas.className='habitat-canvas'; canvas.setAttribute('aria-hidden','true'); host.prepend(canvas);
  let renderer;
  try { renderer = new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'}); }
  catch { canvas.remove(); onUnavailable(); return null; }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1,1.75));
  renderer.outputColorSpace=THREE.SRGBColorSpace; renderer.setClearColor(0x000000,0); renderer.autoClear=false;
  const geometry = new THREE.BoxGeometry(1,1,1), materials=new Map(), scenes=new Map();
  const camera=new THREE.OrthographicCamera(-1.5,1.5,1.55,-1.45,.1,30);
  camera.position.set(3.4,4.6,6); camera.lookAt(0,.30,0);
  let raf=0, active=false, selected=[], tiles=[], oldTiles=[], start=0, duration=0, moon=false, lost=false, disposed=false;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  function mat(color) { if(!materials.has(color)) materials.set(color,new THREE.MeshStandardMaterial({color,roughness:.83})); return materials.get(color); }
  function block(group,x,y,z,w,h,d,color,angle=0) {
    const mesh=new THREE.Mesh(geometry,mat(color)); mesh.position.set(x,y,z);mesh.scale.set(w,h,d);mesh.rotation.y=angle;group.add(mesh);return mesh;
  }
  function tuft(g,x,z,tall=false) {
    for(let i=0;i<3;i++) { block(g,x+(i-1)*.085,.35+(tall?.17:0),z,.04,tall?.7:.28,.05,i%2?'#a9ba50':'#658c41',i*.3); if(tall)block(g,x+(i-1)*.085,.73,z,.07,.15,.08,'#7e5336'); }
  }
  function flower(g,x,z,color) { block(g,x,.32,z,.035,.2,.035,'#4b7747');block(g,x,.44,z,.15,.06,.14,color);block(g,x,.48,z,.055,.04,.055,'#f4d37a'); }
  function tree(g,x,z,size=1) {
    block(g,x,.65*size,z,.17*size,.8*size,.17*size,'#76533c');
    block(g,x-.10*size,1.08*size,z,.77*size,.44*size,.74*size,'#426f50',.12);
    block(g,x+.15*size,1.30*size,z-.08*size,.59*size,.35*size,.59*size,'#69955a',-.08);
    block(g,x-.19*size,1.32*size,z+.12*size,.30*size,.17*size,.30*size,'#90af65');
  }
  function duck(g,x,z) {
    block(g,x,.35,z,.36,.22,.23,'#f4e4ac');block(g,x+.13,.51,z,.20,.23,.20,'#fff1c3');
    block(g,x+.26,.47,z,.12,.07,.13,'#e4a44a');block(g,x+.16,.55,z+.106,.035,.04,.025,'#26383b');
    block(g,x-.05,.36,z+.13,.21,.10,.035,'#d8bd7d');
  }
  function make(type) {
    const scene=new THREE.Scene(), model=new THREE.Group();scene.add(model);
    const ambient=new THREE.HemisphereLight(0xd8f3f1,0x7b6752,2.4);scene.add(ambient);
    const sun=new THREE.DirectionalLight(0xffe4ba,3);sun.position.set(-3,7,5);scene.add(sun);
    const rim=new THREE.DirectionalLight(0xa5dcdf,1.1);rim.position.set(3,2,-4);scene.add(rim);
    block(model,0,-.13,0,1.91,.23,1.91,'#3b4e4c');
    block(model,0,.015,0,1.85,.20,1.85,'#947959');
    block(model,0,.15,0,1.88,.15,1.88,type==='pond'?'#6d9b78':'#779652');
    // Cut stone strata and moss around the model's perimeter give the base
    // actual volume; silhouettes and details identify each habitat at phone size.
    for(let i=0;i<5;i++)block(model,-.73+i*.36,-.10,.966,.24,.10,.035,i%2?'#72847b':'#9aab91');
    if(type==='pond') {
      block(model,-.08,.247,.04,1.51,.06,1.40,'#4da9b8');block(model,-.15,.282,.15,1.18,.025,1.0,'#69c5cc');
      [[-.5,-.40],[.46,.45],[-.40,.45]].forEach(([x,z])=>{block(model,x,.31,z,.28,.035,.22,'#8ca967');block(model,x+.025,.335,z,.10,.025,.08,'#e8da8d');});
      duck(model,.19,-.24);tuft(model,.68,-.63,true);
      block(model,-.25,.31,-.53,.55,.012,.025,'#bbe7dd');
    } else if(type==='reed') {
      block(model,0,.25,0,1.52,.05,1.52,'#498e96');
      [[-.6,-.5],[-.25,-.5],[.27,-.35],[.56,.2],[-.45,.4]].forEach(([x,z])=>tuft(model,x,z,true));
      block(model,-.05,.29,.5,.66,.035,.19,'#b7b778');
      block(model,.62,.30,.58,.28,.20,.25,'#a4b38a');
    } else if(type==='nest') {
      tree(model,-.56,-.5,.83);
      block(model,.15,.35,.30,1.05,.23,.83,'#a47846',.13);
      block(model,.15,.49,.30,.67,.06,.50,'#5c4e36',.13);
      for(let i=0;i<7;i++)block(model,-.38+i*.15,.52,.60,.18,.08,.12,i%2?'#d8bb75':'#be9a5a',.2);
      [[-.05,.26],[.23,.30],[.39,.24]].forEach(([x,z])=>block(model,x,.59,z,.18,.22,.16,'#f3e9bd',-.12));
      tuft(model,.66,-.55);
    } else if(type==='meadow') {
      block(model,-.34,.27,-.2,.65,.14,.70,'#a4b96b');
      [[-.55,.37],[-.1,.5],[.48,.33],[.42,-.44],[-.3,-.5],[.05,-.12]].forEach(([x,z],i)=>flower(model,x,z,i%2?'#dba079':'#e4d987'));
      block(model,.63,.36,.60,.30,.22,.21,'#c4b68d');
      tuft(model,-.63,-.65);
    } else if(type==='canopy') {
      tree(model,-.40,-.38,1.05);tree(model,.48,.30,.72);
      for(let i=0;i<3;i++)flower(model,-.55+i*.17,.62,'#c4b1db');
      block(model,.42,.29,-.57,.45,.15,.29,'#738478');
    } else {
      block(model,0,.41,-.16,1.35,.4,1.12,'#a18861');block(model,-.12,.67,-.28,1.14,.16,.86,'#94aa66');
      block(model,.02,.42,.42,.48,.43,.08,'#39423a');block(model,-.3,.45,.45,.12,.49,.2,'#c8b18b');
      block(model,.32,.45,.45,.12,.49,.2,'#c8b18b');block(model,.01,.72,.42,.7,.13,.24,'#d5c297');
      block(model,.02,.24,.71,.46,.04,.32,'#cfb68a');tuft(model,-.64,.47);flower(model,.45,-.50,'#e7c185');
    }
    scenes.set(type,{scene,model,ambient,sun}); return scenes.get(type);
  }
  ['pond','reed','nest','meadow','canopy','burrow'].forEach(make);
  function draw(now=performance.now()) {
    raf=0;if(!active||lost||disposed||document.hidden)return;
    // Shared Battle Canvas may transform the entire logical canvas. Use local
    // layout coordinates so that CSS scale is applied exactly once.
    const width=host.clientWidth,height=host.clientHeight;if(width<2||height<2)return;
    if(canvas.clientWidth!==width||canvas.clientHeight!==height||canvas.width!==Math.round(width*renderer.getPixelRatio()))renderer.setSize(width,height,false);
    renderer.setScissorTest(false);renderer.clear();renderer.setScissorTest(true);renderer.setScissor(0,0,width,height);
    const p=duration?Math.min(1,(now-start)/duration):1, ease=1-Math.pow(1-p,3);
    const buttons=[...host.querySelectorAll('.habitat-tile')];
    for(let i=0;i<tiles.length;i++) {
      const rect=button=>button&&({x:button.offsetLeft,y:button.offsetTop,width:button.offsetWidth,height:button.offsetHeight});
      const target=rect(buttons[i]); if(!target)continue;
      const old=rect(buttons[oldTiles.indexOf(tiles[i])])||target;
      const x=old.x+(target.x-old.x)*ease,y=old.y+(target.y-old.y)*ease;
      const w=target.width,h=Math.max(30,target.height-37);
      renderer.setViewport(x,height-y-h,w,h);
      const aspect=w/h;camera.left=-1.50*Math.max(1,aspect);camera.right=-camera.left;
      camera.top=1.53*Math.max(1,1/aspect);camera.bottom=-1.47*Math.max(1,1/aspect);camera.updateProjectionMatrix();
      const item=scenes.get(tiles[i]);item.model.position.y=selected.includes(i)?.13:0;
      item.model.rotation.y=duration&&old.x!==target.x?Math.sin(p*Math.PI)*.12:0;
      item.model.position.y+=duration&&old!==target?Math.sin(p*Math.PI)*.20:0;
      item.sun.color.set(moon?'#b6cdff':'#ffe4ba');item.ambient.color.set(moon?'#bdc9f2':'#d8f3f1');
      renderer.render(item.scene,camera);
    }
    renderer.setScissorTest(false);
    if(p<1)raf=requestAnimationFrame(draw);else {duration=0;oldTiles=[...tiles];}
  }
  function invalidate(){if(active&&!raf&&!disposed)raf=requestAnimationFrame(draw);}
  const observer=new ResizeObserver(invalidate);observer.observe(host);
  const visibility=()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else invalidate();};document.addEventListener('visibilitychange',visibility);
  const contextLost=e=>{e.preventDefault();lost=true;cancelAnimationFrame(raf);raf=0;onUnavailable();};
  const contextRestored=()=>{lost=false;canvas.hidden=false;onUnavailable(false);invalidate();};
  canvas.addEventListener('webglcontextlost',contextLost);canvas.addEventListener('webglcontextrestored',contextRestored);
  return {
    update(next,picks,{animate=false,night=false}={}) {oldTiles=[...tiles];tiles=[...next];selected=[...picks];moon=night;start=performance.now();duration=animate&&!reduced.matches?280:0;invalidate();},
    setActive(value){active=value;cancelAnimationFrame(raf);raf=0;if(active)invalidate();},
    stats(){return{revision:THREE.REVISION,geometries:renderer.info.memory.geometries,materials:materials.size,scenes:scenes.size,trianglesPerTile:renderer.info.render.triangles,drawCallsPerTile:renderer.info.render.calls,activeFrame:Boolean(raf),contextLost:lost};},
    dispose(){disposed=true;cancelAnimationFrame(raf);observer.disconnect();document.removeEventListener('visibilitychange',visibility);canvas.removeEventListener('webglcontextlost',contextLost);canvas.removeEventListener('webglcontextrestored',contextRestored);geometry.dispose();materials.forEach(m=>m.dispose());renderer.dispose();canvas.remove();scenes.clear();materials.clear();}
  };
}
