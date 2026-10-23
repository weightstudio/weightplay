import * as THREE from './vendor/three/three.module.min.js';

// Authored block geometry. One renderer and one shared box; no per-frame allocation.
export class MarketScene {
  constructor(canvas,onPick) {
    this.canvas=canvas;this.onPick=onPick;this.dead=false;this.active=true;this.frame=0;
    this.scene=new THREE.Scene();this.scene.background=new THREE.Color('#183b3e');
    this.scene.fog=new THREE.Fog('#183b3e',22,45);
    this.renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'low-power'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;
    this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.05;
    this.camera=new THREE.OrthographicCamera(-7,7,6,-6,.1,80);
    this.camera.position.set(0,10,16);this.camera.lookAt(0,2.4,0);
    this.box=new THREE.BoxGeometry(1,1,1);this.materials=new Map();this.lots=[];
    this.scene.add(new THREE.HemisphereLight(0xc3f6e6,0x80513a,1.6));
    const sun=new THREE.DirectionalLight(0xffd5a0,2.2);sun.position.set(-6,10,8);this.scene.add(sun);
    const rim=new THREE.DirectionalLight(0x58dcdf,2.2);rim.position.set(7,6,-8);this.scene.add(rim);
    this.build();
    this.ray=new THREE.Raycaster();this.pointer=new THREE.Vector2();
    this.down=e=>{this.press={x:e.clientX,y:e.clientY};};
    this.up=e=>{
      const press=this.press;this.press=null;
      if(!this.active||!press||Math.hypot(e.clientX-press.x,e.clientY-press.y)>8)return;
      const r=canvas.getBoundingClientRect();
      this.pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);
      this.ray.setFromCamera(this.pointer,this.camera);
      const hits=this.ray.intersectObjects(this.lots,true);for(const h of hits){let o=h.object;while(o&&o.userData.lot===undefined)o=o.parent;if(o){onPick(o.userData.lot);break;}}
    };
    this.cancel=()=>{this.press=null;};
    this.lost=e=>{e.preventDefault();this.stop();canvas.dispatchEvent(new CustomEvent('market-render-error',{detail:'context'}));};
    canvas.addEventListener('pointerdown',this.down);canvas.addEventListener('pointerup',this.up);canvas.addEventListener('pointercancel',this.cancel);canvas.addEventListener('webglcontextlost',this.lost);
    this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(canvas);
    this.resize();
  }
  material(color,emissive=false) {
    const key=color+emissive;if(!this.materials.has(key))this.materials.set(key,new THREE.MeshStandardMaterial({color,roughness:.72,metalness:emissive?.05:0,emissive:emissive?color:0,emissiveIntensity:emissive?.6:0}));
    return this.materials.get(key);
  }
  cube(parent,x,y,z,w,h,d,color,glow=false) {
    const m=new THREE.Mesh(this.box,this.material(color,glow));m.position.set(x,y,z);m.scale.set(w,h,d);parent.add(m);return m;
  }
  build() {
    const s=this.scene;
    this.cube(s,0,-.35,0,11,.7,8,'#294847');
    this.cube(s,0,-.02,0,10.8,.18,7.8,'#52766a');
    for(let i=0;i<11;i++)this.cube(s,i-5,.12,1.1,.89,.18,5.6,i%2?'#b77d45':'#a36b3a');
    this.cube(s,0,.32,2.8,10.8,.3,.3,'#e6b361');
    for(const x of [-5,5]) {
      this.cube(s,x,2.4,-2.4,.28,4.8,.28,'#715139');
      this.cube(s,x,4.9,-2.4,1.1,.16,.85,'#c29346');
      this.cube(s,x,4.3,-2.4,.64,.9,.64,'#ffe6a1',true);
      this.cube(s,x,3.8,-2.4,.83,.14,.83,'#a87837');
      const light=new THREE.PointLight(0xffd68a,8,8,2);light.position.set(x,4.2,-2);s.add(light);
    }
    this.canopy=[];
    for(let i=0;i<10;i++){const roof=this.cube(s,i-4.5,5.3,-3.1,1,.15,2.4,i%2?'#dcbd77':'#267b76');this.canopy.push(roof);this.canopy.push(this.cube(s,i-4.5,5.05,-1.9,1,.46,.12,i%2?'#dcbd77':'#267b76'));}
    for(const [x,z,h] of [[-6,-5,5],[6,-5,6],[-5,-8,7],[4,-8,7],[0,-9,8]]) {
      this.cube(s,x,h/2-.3,z,.65,h,.65,'#5b493b');
      for(let k=0;k<3;k++)this.cube(s,x+(k%2)*.3,h-k*.65,z,2.7-k*.45,1.3,2.6-k*.3,['#b57c32','#daa043','#ebbc55'][k]);
    }
    // Gear Horn Rux: box muzzle, warm square eyes, goggles, brass gear horn and teal apron.
    const r=new THREE.Group();r.position.set(0,.4,-2.6);s.add(r);
    for(const x of [-.48,.48]){this.cube(r,x,.38,0,.7,.75,.75,'#717d83');this.cube(r,x,.12,.22,.77,.28,1,'#b9b8a4');}
    this.cube(r,0,1.25,0,1.65,1.45,1,'#7a888c');this.cube(r,0,1.2,.54,1.35,1.3,.11,'#267c7a');
    this.cube(r,0,1,.63,1.45,.2,.12,'#b88745');this.cube(r,0,1,.72,.33,.3,.12,'#e8bd59');
    this.cube(r,0,2.65,0,1.85,1.65,1.25,'#9caaa9');
    this.cube(r,0,2.25,.86,1.35,.75,.7,'#aebbaf');
    for(const x of [-.8,.8]){this.cube(r,x,3.5,-.12,.5,.74,.35,'#879793');this.cube(r,x,3.5,.08,.26,.42,.07,'#c9937d');}
    for(const x of [-.48,.48]){
      this.cube(r,x,2.8,.652,.38,.47,.06,'#fff4d7');this.cube(r,x+.055,2.77,.7,.15,.28,.045,'#2e2925');
      this.cube(r,x,3.25,.67,.66,.45,.12,'#ddb45b');this.cube(r,x,3.25,.75,.48,.29,.05,'#276b71');
      this.cube(r,x,2.18,1.23,.16,.12,.02,'#495b57');
    }
    this.cube(r,0,2.72,1.02,.33,.55,.33,'#e5c15f');
    for(const [x,y,w,h] of [[0,3.04,.28,.15],[-.25,2.8,.17,.24],[.25,2.8,.17,.24],[0,2.55,.27,.13]])this.cube(r,x,y,1.04,w,h,.25,'#efc763');
    for(const x of [-1.1,1.1]){const arm=this.cube(r,x,1.55,.25,.5,1.1,.6,'#8e9b99');arm.rotation.z=x<0?-.25:.25;this.cube(r,x,1.08,.46,.6,.4,.65,'#b0b8ad');}
    this.cube(r,1.4,1.6,.6,.16,.9,.16,'#8a5b34');this.hammer=this.cube(r,1.4,2.1,.6,.7,.34,.4,'#d7a04a');
    for(let i=0;i<3;i++){
      const g=new THREE.Group();g.position.set((i-1)*3.1,.35,1.2);g.userData.lot=i;g.userData.baseY=.35;s.add(g);this.lots.push(g);
      this.cube(g,0,0,0,2.65,.26,2.1,'#654a31');
      const highlight=this.cube(g,0,-.12,0,2.83,.1,2.28,'#d2ab66');g.userData.highlight=highlight;
      for(const z of [-.91,.91])for(let j=0;j<2;j++)this.cube(g,0,.32+j*.3,z,2.6,.22,.14,j?'#c58c48':'#a96e38');
      for(const x of [-1.22,1.22])for(let j=0;j<2;j++)this.cube(g,x,.32+j*.3,0,.14,.22,1.8,'#bf8849');
      for(const x of [-1.18,1.18])for(const z of [-.85,.85])this.cube(g,x,.45,z,.19,.83,.19,'#e1ad5a');
      const contents=new THREE.Group();g.add(contents);g.userData.contents=contents;
    }
  }
  set(stage,selected,bell,theme='oak') {
    this.stage=stage;this.targets=[];
    for(let i=0;i<3;i++) {
      const group=this.lots[i],l=stage.lots[i],contents=group.userData.contents;
      if(group.userData.countKey!==`${stage.id}`){
        contents.clear();
        for(let j=0;j<l.count;j++){
          const x=(j%3-1)*.64,z=(Math.floor(j/3)%3-1)*.51,y=.45+Math.floor(j/9)*.5;
          const acorn=new THREE.Group();acorn.position.set(x,y,z);acorn.rotation.y=j*.73;contents.add(acorn);
          this.cube(acorn,0,.17,0,.44,.46,.42,j<l.gold?'#f4c651':'#c88b48');
          this.cube(acorn,0,.43,0,.53,.17,.5,j<l.gold?'#fff2ac':'#6f4930');
          this.cube(acorn,0,.58,0,.12,.18,.12,'#514934');
        }
        group.userData.countKey=`${stage.id}`;
      }
      const sold=l.rival&&bell>=l.rival;
      this.targets.push({y:.35+(selected.includes(i)?.25:0),scale:sold?.03:1});
      group.userData.highlight.material=this.material(selected.includes(i)?'#9cebd1':'#d2ab66',selected.includes(i));
    }
    this.canopy.forEach((m,i)=>m.material=this.material(i%4<2?(theme==='moon'?'#6d5a94':theme==='amber'?'#a65e2e':'#267b76'):'#dcbd77'));
    this.scene.background.set(theme==='moon'?'#272a46':'#183b3e');this.scene.fog.color.copy(this.scene.background);
    this.animate();
  }
  animate() {
    cancelAnimationFrame(this.frame);if(!this.active||this.dead)return;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const start=performance.now(),from=this.lots.map(g=>({y:g.position.y,scale:g.scale.x}));
    const tick=now=>{
      if(!this.active||this.dead)return;
      const p=reduced?1:Math.min(1,(now-start)/220),ease=1-Math.pow(1-p,3);
      this.lots.forEach((g,i)=>{const t=this.targets?.[i]||from[i];g.position.y=from[i].y+(t.y-from[i].y)*ease;g.scale.setScalar(from[i].scale+(t.scale-from[i].scale)*ease);});
      this.render();if(p<1)this.frame=requestAnimationFrame(tick);else this.frame=0;
    };this.frame=requestAnimationFrame(tick);
  }
  resize(){if(this.dead)return;const r=this.canvas.getBoundingClientRect();if(r.width<1||r.height<1)return;
    this.renderer.setSize(Math.round(r.width),Math.round(r.height),false);
    const aspect=r.width/r.height,halfWidth=Math.max(6.25,5.1*aspect),halfHeight=halfWidth/aspect;
    this.camera.left=-halfWidth;this.camera.right=halfWidth;this.camera.top=halfHeight;this.camera.bottom=-halfHeight;this.camera.updateProjectionMatrix();this.render();}
  render(){if(this.dead||!this.active||document.hidden)return;this.renderer.render(this.scene,this.camera);
    Object.assign(this.canvas.dataset,{renderer:'Three.js r180',drawCalls:String(this.renderer.info.render.calls),triangles:String(this.renderer.info.render.triangles),geometries:String(this.renderer.info.memory.geometries),textures:String(this.renderer.info.memory.textures)});}
  stop(){this.active=false;cancelAnimationFrame(this.frame);this.frame=0;this.press=null;}
  resume(){if(this.dead)return;this.active=true;this.resize();this.animate();}
  dispose(){if(this.dead)return;this.stop();this.dead=true;this.resizeObserver.disconnect();
    this.canvas.removeEventListener('pointerdown',this.down);this.canvas.removeEventListener('pointerup',this.up);this.canvas.removeEventListener('pointercancel',this.cancel);this.canvas.removeEventListener('webglcontextlost',this.lost);
    // Reuse the permanent canvas's context after freeing every owned GPU resource.
    // forceContextLoss here would also invalidate the next renderer on that canvas.
    this.box.dispose();for(const m of this.materials.values())m.dispose();this.materials.clear();this.scene.clear();this.renderer.dispose();}
}
