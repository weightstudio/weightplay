import * as THREE from './vendor/three/three.module.min.js';
import { COLORS } from './puzzle.mjs';
const atlasURL=new URL('./assets/quilt-fabrics-v13.webp',import.meta.url).href;
const skinIndex={linen:0,sage:1,river:2,moon:3};
export async function createQuiltRenderer(host) {
  const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000,0);renderer.domElement.setAttribute('aria-hidden','true');
  host.prepend(renderer.domElement);
  const scene=new THREE.Scene(), camera=new THREE.OrthographicCamera(-1,1,1,-1,.1,20);
  camera.position.z=10;
  scene.add(new THREE.AmbientLight(0xffffff,2.15));
  const light=new THREE.DirectionalLight(0xfff2d3,3.1);light.position.set(-3,5,8);scene.add(light);
  const resources=new Set(), keep=x=>(resources.add(x),x);
  const box=keep(new THREE.BoxGeometry(1,1,1));
  const disc=keep(new THREE.CylinderGeometry(1,1,1,24));
  const side=keep(new THREE.MeshStandardMaterial({color:'#756447',roughness:.92}));
  const thread=keep(new THREE.MeshStandardMaterial({color:'#fff5d4',roughness:.8}));
  const button=keep(new THREE.MeshStandardMaterial({color:'#d6b269',metalness:.35,roughness:.5}));
  const pathMaterials=COLORS.map(color=>keep(new THREE.MeshStandardMaterial({color,roughness:.9})));
  let texture;
  try{texture=keep(await new THREE.TextureLoader().loadAsync(atlasURL));}
  catch(error){renderer.dispose();renderer.domElement.remove();for(const r of resources)r.dispose();throw error;}
  texture.colorSpace=THREE.SRGBColorSpace;
  const tops=Array.from({length:4},(_,i)=>{
    const map=keep(texture.clone());map.repeat.set(.49,.47);map.offset.set(i%2*.5+.005,i<2?.525:.025);map.needsUpdate=true;
    return keep(new THREE.MeshStandardMaterial({map,roughness:1,color:0xffffff}));
  });
  let groups=[],tileTops=[],angles=[],target=[],stage=null,frame=0,active=false,disposed=false,skin='linen';
  const stageGeometry=new Set();
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const render=()=>{if(!disposed&&active&&!document.hidden){renderer.render(scene,camera);host.dataset.drawCalls=renderer.info.render.calls;host.dataset.geometries=renderer.info.memory.geometries;host.dataset.textures=renderer.info.memory.textures;}};
  const stop=()=>{cancelAnimationFrame(frame);frame=0;groups.forEach((g,i)=>{g.rotation.z=target[i]||0;g.rotation.x=0;g.position.z=0;});angles=target.slice();};
  function resize(){const {width,height}=host.getBoundingClientRect();if(width<1||height<1)return;renderer.setSize(width,height,false);render();}
  const observer=new ResizeObserver(resize);observer.observe(host);
  function cuboid(parent,material,x,y,z,w,h,d){const m=new THREE.Mesh(box,material);m.position.set(x,y,z);m.scale.set(w,h,d);parent.add(m);return m;}
  function mergedBoxes(parent,material,rects){
    const positions=[],normals=[],indices=[];const pos=box.attributes.position,normal=box.attributes.normal;
    for(const [x,y,z,w,h,d] of rects){const base=positions.length/3;for(let v=0;v<pos.count;v++){positions.push(x+pos.getX(v)*w,y+pos.getY(v)*h,z+pos.getZ(v)*d);normals.push(normal.getX(v),normal.getY(v),normal.getZ(v));}for(const index of box.index.array)indices.push(base+index);}
    const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));geometry.setIndex(indices);stageGeometry.add(geometry);parent.add(new THREE.Mesh(geometry,material));
  }
  function load(next,rotations,fabric){
    stop();groups.forEach(g=>scene.remove(g));for(const geometry of stageGeometry)geometry.dispose();stageGeometry.clear();groups=[];tileTops=[];stage=next;skin=fabric;
    const n=stage.size,half=n*.54;
    camera.left=-half;camera.right=half;camera.top=half;camera.bottom=-half;camera.updateProjectionMatrix();
    stage.tiles.forEach((edges,i)=>{
      const g=new THREE.Group();g.position.set((i%n-(n-1)/2)*1.08,((n-1)/2-Math.floor(i/n))*1.08,0);scene.add(g);groups.push(g);
      mergedBoxes(g,side,[[0,-.018,0,1,1,.16],[-.035,0,.155,.018,.045,.006],[.035,0,.155,.018,.045,.006]]);
      tileTops.push(cuboid(g,tops[skinIndex[fabric]||0],0,0,.092,.97,.97,.038));
      const stitches=[];
      edges.forEach((color,d)=>{
        if(!color)return;
        const arm=new THREE.Group();arm.rotation.z=-d*Math.PI/2;g.add(arm);
        cuboid(arm,pathMaterials[color],0,.31,.121,.205,.39,.022);
        // Counted stitches distinguish the five trail colors without color vision.
        for(let k=0;k<color;k++){const x=(k-(color-1)/2)*.032,y=.426,a=-d*Math.PI/2;stitches.push([x*Math.cos(a)-y*Math.sin(a),x*Math.sin(a)+y*Math.cos(a),.138,d%2?.053:.016,d%2?.016:.053,.007]);}
      });
      if(stitches.length)mergedBoxes(g,thread,stitches);
      const hub=new THREE.Mesh(disc,button);hub.rotation.x=Math.PI/2;hub.scale.set(.12,.04,.12);hub.position.z=.13;g.add(hub);
      g.rotation.z=-rotations[i]*Math.PI/2;
    });
    angles=rotations.map(r=>-r*Math.PI/2);target=angles.slice();resize();render();
  }
  function update(rotations,changes=[]){
    stop();const start=angles.slice();target=rotations.map((r,i)=>{
      const delta=changes.find(c=>c[0]===i)?.[1];
      return delta===undefined?-r*Math.PI/2:start[i]-delta*Math.PI/2;
    });
    if(reduced.matches||!active||document.hidden||!changes.length){stop();render();return;}
    const started=performance.now();
    const tick=now=>{
      if(disposed||!active||document.hidden){stop();return;}
      const p=Math.min(1,(now-started)/180),ease=1-(1-p)**3;
      groups.forEach((g,i)=>{g.rotation.z=start[i]+(target[i]-start[i])*ease;if(changes.some(c=>c[0]===i)){g.position.z=Math.sin(p*Math.PI)*.16;g.rotation.x=Math.sin(p*Math.PI)*.12;}});
      render();if(p<1)frame=requestAnimationFrame(tick);else{stop();render();}
    };frame=requestAnimationFrame(tick);
  }
  const visibility=()=>{if(document.hidden)stop();else render();};document.addEventListener('visibilitychange',visibility);
  return {load,update,setActive(value){active=value;if(!active)stop();else resize();},setFabric(fabric){skin=fabric;tileTops.forEach(m=>m.material=tops[skinIndex[skin]||0]);render();},get diagnostics(){return {drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,textures:renderer.info.memory.textures,geometries:renderer.info.memory.geometries,animated:!!frame};},dispose(){if(disposed)return;stop();disposed=true;observer.disconnect();document.removeEventListener('visibilitychange',visibility);for(const geometry of stageGeometry)geometry.dispose();for(const r of resources)r.dispose();renderer.dispose();renderer.domElement.remove();}};
}
