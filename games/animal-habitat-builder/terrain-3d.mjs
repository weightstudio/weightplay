import * as THREE from './vendor/three/three.module.min.js';

// One unit per plot; a vertical orthographic camera matches the native grid.
export function createTerrain(canvas) {
  const renderer = new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-2.5,2.5,2,-2,.1,30);
  camera.position.set(0,12,0);camera.up.set(0,0,-1);camera.lookAt(0,0,0);
  scene.add(new THREE.HemisphereLight(0xdff7df,0x495536,2.4));
  const light=new THREE.DirectionalLight(0xffecc0,3);light.position.set(-3,8,-4);scene.add(light);
  const geometry=new THREE.BoxGeometry(1,1,1),materials=new Map(),plots=[];
  const material=color=>{if(!materials.has(color))materials.set(color,new THREE.MeshLambertMaterial({color}));return materials.get(color);};
  function box(parent,color,x,y,z,w,h,d,angle=0){const mesh=new THREE.Mesh(geometry,material(color));mesh.position.set(x,y,z);mesh.scale.set(w,h,d);mesh.rotation.y=angle;parent.add(mesh);return mesh;}
  function build(grid,blocked=[]) {
    for(const group of plots)scene.remove(group);plots.length=0;
    grid.forEach((type,i)=>{
      const group=new THREE.Group();group.position.set(i%5-2,0,Math.floor(i/5)-1.5);plots.push(group);scene.add(group);
      const rock=blocked.includes(i),color=rock?0x53625a:type===0?0x47c8d5:type===1?0x8ebc58:type===2?0x397d54:type===3?0xc5ab72:0x678760;
      box(group,0x324c38,0,-.17,0,.94,.22,.94);
      box(group,color,0,0,0,.94,.16,.94);
      if(type===0){box(group,0xa3e4e1,-.18,.1,-.2,.35,.018,.06);box(group,0xa3e4e1,.17,.1,.12,.28,.018,.04);}
      if(type===1){for(const [x,z]of[[-.24,-.2],[.19,.2],[-.2,.25]]){box(group,0xf7d68a,x,.16,z,.10,.13,.10);box(group,0x679c45,x-.04,.11,z+.04,.18,.05,.16);}}
      if(type===2){for(const [x,z,s]of[[-.17,.1,1],[.23,-.18,.7]]){box(group,0x795638,x,.3,z,.12,.45*s,.12);box(group,0x225d3c,x,.58*s,z,.52*s,.28*s,.48*s);box(group,0x4f9657,x,.78*s,z-.02,.34*s,.24*s,.32*s);}}
      if(type===3){box(group,0xe8c58a,0,.29,0,.57,.4,.51);box(group,0x9d6441,0,.55,0,.74,.17,.65);box(group,0xbb7947,0,.66,0,.53,.12,.65);box(group,0x3a4739,0,.35,.27,.18,.25,.025);box(group,0x6dbbd1,-.19,.39,.27,.12,.12,.03);}
      if(rock){box(group,0x839389,-.12,.24,0,.57,.35,.52,.2);box(group,0xa4aea0,.16,.39,.05,.34,.28,.38,-.25);}
    });
    render();
  }
  let disposed=false;
  function render(){if(!disposed)renderer.render(scene,camera);}
  function resize(){if(disposed)return;const r=canvas.getBoundingClientRect();if(r.width&&r.height){renderer.setSize(r.width,r.height,false);render();}}
  const observer=new ResizeObserver(resize);observer.observe(canvas);
  const lost=event=>{event.preventDefault();canvas.hidden=true;canvas.dispatchEvent(new CustomEvent('terrain-unavailable'));};
  canvas.addEventListener('webglcontextlost',lost);
  function dispose(){if(disposed)return;disposed=true;observer.disconnect();canvas.removeEventListener('webglcontextlost',lost);for(const group of plots)scene.remove(group);plots.length=0;geometry.dispose();for(const m of materials.values())m.dispose();materials.clear();renderer.dispose();}
  return {build,resize,render,dispose,stats:()=>({revision:THREE.REVISION,calls:renderer.info.render.calls,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures,materials:materials.size})};
}
