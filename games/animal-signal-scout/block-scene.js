import * as THREE from './vendor/three/three.module.min.js';
// One demand-rendered scene. DOM buttons remain the keyboard/accessible input.
let live=null, latest=null;
const stats=window.blockSceneStats={created:0,disposed:0,active:0,drawCalls:0,geometries:0,materials:0};
function dispose(){if(!live)return;live.observer.disconnect();live.canvas.removeEventListener('pointerup',live.pick);live.canvas.removeEventListener('webglcontextlost',live.lost);live.geometry.dispose();live.materials.forEach(m=>m.dispose());live.renderer.dispose();live.renderer.forceContextLoss();live.canvas.remove();live=null;stats.active=0;stats.disposed++;stats.geometries=0;stats.materials=0;}
function build(host){
  const canvas=document.createElement('canvas');canvas.setAttribute('aria-hidden','true');canvas.dataset.blockWorld='';host.prepend(canvas);
  let renderer;
  try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});}catch{canvas.remove();host.dataset.render='dom';return null;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.1,80),geometry=new THREE.BoxGeometry(1,1,1),materials=[];
  const material=(color,emissive=0)=>{const m=new THREE.MeshStandardMaterial({color,roughness:.65,metalness:.2,emissive:color,emissiveIntensity:emissive});materials.push(m);return m;};
  const stone=material('#344e66'),edge=material('#829aaa'),brass=material('#b77d39'),dark=material('#182c40');
  scene.add(new THREE.HemisphereLight(0xc6efff,0x283141,2.6));const sun=new THREE.DirectionalLight(0xffd79a,3);sun.position.set(-4,7,4);scene.add(sun);
  const mesh=(x,y,z,w,h,d,mat,parent=scene)=>{const m=new THREE.Mesh(geometry,mat);m.position.set(x,y,z);m.scale.set(w,h,d);parent.add(m);return m;};
  mesh(0,-.4,0,9,.5,3,stone);mesh(0,-.1,0,9.2,.12,3.2,edge);
  const picks=[],lights=[];
  for(let i=0;i<3;i++){
    const x=(i-1)*2.65,g=new THREE.Group();g.position.x=x;scene.add(g);g.userData.index=i;
    mesh(0,.1,0,1.9,.25,1.8,brass,g);mesh(0,.37,0,1.5,.28,1.45,dark,g);
    const glow=material('#ffbd55',.3);lights.push(glow);const pane=mesh(0,1,0,1.22,1.03,1.12,glow,g);picks.push(pane);
    for(const xx of [-.71,.71])for(const zz of [-.67,.67])mesh(xx,1,zz,.15,1.3,.15,brass,g);
    mesh(0,1.68,0,1.8,.22,1.7,brass,g);mesh(0,1.9,0,1.25,.22,1.17,dark,g);mesh(0,2.1,0,.45,.2,.45,brass,g);
    for(let j=0;j<=i;j++)mesh((j-i/2)*.26,.16,.97,.16,.16,.12,edge,g);
  }
  const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();
  const pick=e=>{const r=canvas.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);const hit=ray.intersectObjects(picks)[0];if(hit)window.dispatchEvent(new CustomEvent('wp:block-pick',{detail:{index:hit.object.parent.userData.index}}));};
  canvas.addEventListener('pointerup',pick);
  const resize=()=>{const r=host.getBoundingClientRect();if(r.width<1||r.height<1)return;renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.position.set(0,6.2,Math.max(11,6.2/camera.aspect));camera.lookAt(0,.65,0);camera.updateProjectionMatrix();renderer.render(scene,camera);stats.drawCalls=renderer.info.render.calls;};
  const observer=new ResizeObserver(resize);observer.observe(host);
  const lost=e=>{e.preventDefault();dispose();host.dataset.render='dom';};canvas.addEventListener('webglcontextlost',lost);
  stats.created++;stats.active=1;stats.geometries=1;stats.materials=materials.length;host.dataset.render='webgl';
  return{canvas,renderer,geometry,materials,observer,pick,lost,lights,resize};
}
function update(data){latest=data;if(!data?.active){dispose();return;}const host=document.getElementById('blockWorld');if(!host)return;live??=build(host);if(!live)return;live.lights.forEach((m,i)=>{m.color.set(data.colours[i]);m.emissive.set(data.colours[i]);m.emissiveIntensity=i<data.lit?.7:.12;});live.resize();}
window.addEventListener('wp:block-scene',e=>update(e.detail));
window.addEventListener('pagehide',dispose);document.addEventListener('visibilitychange',()=>{if(document.hidden)dispose();else if(latest?.active)update(latest);});
window.dispatchEvent(new CustomEvent('wp:block-ready'));
