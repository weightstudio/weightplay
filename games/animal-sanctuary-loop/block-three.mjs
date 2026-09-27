/* Pinned Three r180 driver. One geometry/material, three bounded instance batches.
   Camera matches block-world.js project/unproject exactly. No autonomous loop. */
import * as T from '../animal-skyspire-drop/vendor/three/three.module.min.js';
export function createDriver(overlay,onLoss){
 const node=overlay.ownerDocument.createElement('canvas');node.id='sanctuary3d';node.className='sanctuary-block-layer';node.setAttribute('aria-hidden','true');
 const renderer=new T.WebGLRenderer({canvas:node,alpha:false,antialias:true,powerPreference:'low-power'});
 renderer.setClearColor('#09252e');renderer.setPixelRatio(1);renderer.setSize(overlay.width,overlay.height,false);
 renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.NoToneMapping;
 overlay.before(node);
 const scene=new T.Scene(),camera=new T.OrthographicCamera(-28,28,28,-28,.1,200);
 camera.position.set(24,100*Math.cos(Math.PI/6),74);camera.lookAt(24,0,24);camera.updateMatrixWorld();
 scene.add(new T.HemisphereLight('#dcffef','#163349',2.0));const sun=new T.DirectionalLight('#ffe3b1',2.0);sun.position.set(-30,65,5);scene.add(sun);
 const geometry=new T.BoxGeometry(1,1,1),material=new T.MeshLambertMaterial({color:'#ffffff'});
 const batches=[new T.InstancedMesh(geometry,material,4096),new T.InstancedMesh(geometry,material,4096),new T.InstancedMesh(geometry,material,64)];
 for(const m of batches){m.count=0;m.frustumCulled=false;scene.add(m);}
 const transform=new T.Object3D(),color=new T.Color();let disposed=false;
 function set(mesh,items){if(items.length>mesh.instanceMatrix.count)throw Error('Sanctuary instance budget exceeded');mesh.count=items.length;items.forEach((b,i)=>{transform.position.set(b.x,b.y,b.z);transform.rotation.set(0,b.ry,0);transform.scale.set(b.w,b.h,b.d);transform.updateMatrix();mesh.setMatrixAt(i,transform.matrix);mesh.setColorAt(i,color.set(b.color));});mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;}
 function lost(e){e.preventDefault();onLoss();}
 node.addEventListener('webglcontextlost',lost);
 return {project(x,z){const v=new T.Vector3(x,0,z).project(camera);return {x:(v.x+1)*overlay.width/2,y:(1-v.y)*overlay.height/2};},sync(base,mask){set(batches[0],base);set(batches[1],mask);},dynamic(items){set(batches[2],items);},render(){if(!disposed)renderer.render(scene,camera);},stats(){return {revision:T.REVISION,calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures,instances:batches.reduce((n,m)=>n+m.count,0),contexts:1};},dispose(){if(disposed)return;disposed=true;node.removeEventListener('webglcontextlost',lost);batches.forEach(m=>{scene.remove(m);m.dispose();});geometry.dispose();material.dispose();renderer.renderLists.dispose();renderer.dispose();renderer.forceContextLoss();node.remove();}};
}
