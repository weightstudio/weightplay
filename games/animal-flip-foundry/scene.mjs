import * as THREE from './vendor/three/three.module.min.js';
import {targetAt} from './model.mjs';

// Actual cuboid geometry in a fixed orthographic plane. The transparent input
// Canvas overlays only labels and the trajectory, with identical projection.
export class FoundryScene {
  constructor(host,onLost,onRestored){
    this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
    this.renderer.setClearColor(0x102737);this.renderer.outputColorSpace=THREE.SRGBColorSpace;
    this.renderer.domElement.className='foundry-world';this.renderer.domElement.setAttribute('aria-hidden','true');
    host.prepend(this.renderer.domElement);this.scene=new THREE.Scene();
    this.camera=new THREE.OrthographicCamera(0,9.6,4.85,-1.35,.1,80);this.camera.position.z=25;
    this.scene.add(new THREE.HemisphereLight(0xe0ffff,0x152035,2.4));
    const key=new THREE.DirectionalLight(0xffd4a0,3.1);key.position.set(-4,7,12);this.scene.add(key);
    const fill=new THREE.DirectionalLight(0x6cbce9,1.8);fill.position.set(8,1,5);this.scene.add(fill);
    this.geometry=new THREE.BoxGeometry(1,1,1);
    this.material=new THREE.MeshStandardMaterial({roughness:.38,metalness:.32});
    this.boxes=new THREE.InstancedMesh(this.geometry,this.material,512);this.boxes.instanceMatrix.setUsage(THREE.DynamicDrawUsage);this.boxes.frustumCulled=false;
    this.scene.add(this.boxes);this.transform=new THREE.Object3D();this.color=new THREE.Color();
    this.canisterTransform=new THREE.Object3D();this.partTransform=new THREE.Object3D();this.partMatrix=new THREE.Matrix4();
    this.background=new THREE.TextureLoader().load(new URL('./assets/animal-flip-foundry-background.png',import.meta.url).href,texture=>{
      if(this.disposed){texture.dispose();return;}texture.colorSpace=THREE.SRGBColorSpace;this.scene.background=texture;this.scene.backgroundIntensity=.24;this.fitBackground();
    },undefined,()=>{this.backgroundFailed=true;});
    this.lost=event=>{event.preventDefault();this.contextLost=true;onLost();};
    this.restored=()=>{this.contextLost=false;onRestored();};
    this.renderer.domElement.addEventListener('webglcontextlost',this.lost);
    this.renderer.domElement.addEventListener('webglcontextrestored',this.restored);
  }
  resize(width,height,cssWidth,cssHeight){
    this.aspect=width/height;this.fitBackground();
    const extra=(width-960)/200;this.camera.left=-extra;this.camera.right=9.6+extra;
    this.camera.top=(height-135)/100;this.camera.bottom=-1.35;this.camera.updateProjectionMatrix();
    const resolution=Math.min(1,1600/Math.max(width,height));
    this.renderer.setSize(width*resolution,height*resolution,false);
    Object.assign(this.renderer.domElement.style,{width:cssWidth+'px',height:cssHeight+'px'});
  }
  fitBackground(){
    const texture=this.background;if(!texture?.image||!this.aspect)return;
    const imageAspect=texture.image.width/texture.image.height,ratio=this.aspect/imageAspect;
    texture.repeat.set(Math.min(1,ratio),Math.min(1,1/ratio));texture.offset.set((1-texture.repeat.x)/2,(1-texture.repeat.y)/2);
  }
  box(x,y,w,h,d,color,z=0,angle=0){
    const i=this.count++;if(i>=512)throw Error('FOUNDRY_GEOMETRY_BUDGET');
    this.transform.position.set(x/100,-y/100,z/100);this.transform.scale.set(w/100,h/100,d/100);
    this.transform.rotation.set(0,0,-angle);this.transform.updateMatrix();
    this.boxes.setMatrixAt(i,this.transform.matrix);this.boxes.setColorAt(i,this.color.set(color));
  }
  draw(c,{height,clock=0,flight=null,angle=0,nozzle='direct',reduced=false,stage=1,settle=null}){
    if(this.contextLost)return;this.count=0;
    const box=this.box.bind(this),target=targetAt(c,clock);
    for(let i=0;i<8;i++)box(i*150-35,-130,7,420,25,stage>30?0x273954:0x16394b,-110);
    box(480,97,1280,76,100,0x183c49,-20);box(480,59,1280,5,115,0x47717a,0);
    // Copper foundation, stepped feet, pale collision surface and inset circuit.
    const platform=(x,y,width,color)=>{
      const depth=Math.max(22,55-y);
      box(x,y+depth/2,width-14,depth,78,0x245365,-12);
      box(x,y+8,width,16,94,color,0);
      box(x,y+18,width-22,7,98,0x97684a,0);
      box(x,y+depth-4,width+12,10,92,0x214353,-6);
      for(let i=-1;i<=1;i++)box(x+i*width*.26,y+34,14,7,5,0xa4dfda,39);
      box(x,y-3,width-20,4,76,0xd8fff0,0);
    };
    platform(190,0,170,0x769fab);platform(target.x,target.y,c.width,stage>30?0xb5a2e7:0x77d6c0);
    // Mounted nozzle and inverter are physical tools, with discrete visible states.
    if(stage>=7){box(158,-26,35,24,32,0xa97b50,5,nozzle==='loft'?-.55:-.15);box(158,-26,19,12,37,0x2e6c78,6,nozzle==='loft'?-.55:-.15);}
    if(c.polarity){box(129,-25,24,44,28,0x344962,10);box(129,-26,14,25,6,flight?.cells===0?0x343e50:0x7af5cd,28);box(129,-48,12,4,16,0xcba479,10);}
    c.roofs.forEach(r=>{box(r.x+r.width/2,r.y+r.height/2,r.width,r.height,85,0x915f4a);box(r.x+r.width/2,r.y+r.height-3,r.width,6,96,0xffb47e,4);for(let k=8;k<r.width;k+=24)box(r.x+k,r.y+r.height/2,6,r.height-10,92,0x493b3a,3);});
    c.fields.forEach((field,i)=>{
      const x=field.x+field.width/2,y=-25;
      box(x,y,field.width,8,64,0x345c70,-70);box(x,y-18,34,37,25,0x597b8d,-55);
      box(x,y-18,25,6,30,0x7bc8df,-36,reduced?0:clock*.025*(field.wind>0?1:-1));
      box(x,y-18,6,25,30,0x7bc8df,-36,reduced?0:clock*.025*(field.wind>0?1:-1));
    });
    c.rings.forEach((r,i)=>{
      const passed=flight&&flight.ring>i,color=passed?0x76e4b6:r.sign<0?0xe8a2ed:r.sign>0?0x88d9f3:0xffca78;
      box(r.x,r.y-r.radius-6,28,12,32,color,2);box(r.x,r.y+r.radius+6,28,12,32,color,2);
      box(r.x,r.y,8,r.radius*2+24,9,0x446673,-20);
      box(r.x,r.y-r.radius-14,20,6,35,0x7c604d,2);box(r.x,r.y+r.radius+14,20,6,35,0x7c604d,2);
      if(r.relay){box(r.x+15,r.y+r.radius+28,23,25,25,0x4a596e,6);box(r.x+15,r.y+r.radius+28,12,16,6,0x82ffce,23);}
    });
    c.silence.forEach(z=>{box((z[0]+z[1])/2,-180,z[1]-z[0],330,7,0x26384c,-60);box(z[0],-180,4,330,9,0xa2a7ba,-50);box(z[1],-180,4,330,9,0xa2a7ba,-50);});
    const f=flight||{x:190,y:-36},rotation=reduced?0:angle;
    const group=this.canisterTransform;group.position.set(f.x/100,-f.y/100,.25);group.rotation.set(.12,.3,-rotation);group.updateMatrix();
    const part=(dx,dy,w,h,d,color,z=25)=>{
      const i=this.count++,local=this.partTransform;local.position.set(dx/100,-dy/100,(z-25)/100);local.scale.set(w/100,h/100,d/100);local.updateMatrix();
      this.partMatrix.multiplyMatrices(group.matrix,local.matrix);this.boxes.setMatrixAt(i,this.partMatrix);this.boxes.setColorAt(i,this.color.set(color));
    };
    // Crystal canister: stepped facets, copper end caps, inset core and brackets.
    part(0,0,44,64,42,0x69d8cf);part(-18,0,8,56,48,0x278f9e);part(18,0,8,56,48,0xb7fff0);
    part(0,-35,54,9,52,0xd7a56a);part(0,33,54,9,52,0xd7a56a);
    part(0,-41,36,5,38,0xf1d7a0);part(0,39,36,5,38,0xa67b50);
    part(0,0,23,31,5,0x163c52,50);part(0,0,13,20,6,c.polarity?(f.sign<0?0xeaa1ff:0x9bdeff):0xaaffdb,55);
    for(const dx of [-21,21])for(const dy of [-24,24])part(dx,dy,6,9,6,0xf0c28a,52);
    if(settle?.win){const t=1-settle.t/36,spread=reduced?0:t*45;box(f.x,target.y-5,70+spread,4,98,0xcaffde,12);}
    this.boxes.count=this.count;this.boxes.instanceMatrix.needsUpdate=true;this.boxes.instanceColor.needsUpdate=true;
    this.renderer.render(this.scene,this.camera);
  }
  stats(){const i=this.renderer.info;return {revision:THREE.REVISION,calls:i.render.calls,triangles:i.render.triangles,geometries:i.memory.geometries,textures:i.memory.textures,instances:this.count||0,contextLost:!!this.contextLost,backgroundFailed:!!this.backgroundFailed};}
  dispose(){this.disposed=true;this.renderer.domElement.removeEventListener('webglcontextlost',this.lost);this.renderer.domElement.removeEventListener('webglcontextrestored',this.restored);this.geometry.dispose();this.material.dispose();this.background?.dispose();if(!this.contextLost)this.renderer.forceContextLoss();this.renderer.dispose();this.renderer.domElement.remove();}
}
