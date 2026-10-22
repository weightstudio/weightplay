import * as THREE from './vendor/three/three.module.min.js';
import {BIOMES,OBJECTS} from './levels.mjs';

// One renderer and colour-batched real cuboid models; static gardens render on demand.
export class GardenWorld {
  constructor(canvas,onError) {
    this.canvas=canvas;this.onError=onError;this.geometry=new THREE.BoxGeometry(1,1,1);this.materials=new Map();this.scenes=[];
    this.instanceMaterial=new THREE.MeshStandardMaterial({color:'#ffffff',roughness:.84,metalness:0});
    this.renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.2;
    this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;this.renderer.info.autoReset=false;
    this.camera=new THREE.OrthographicCamera(-7.7,7.7,5.13,-5.13,.1,100);
    this.camera.position.set(9,14,19);this.camera.lookAt(0,.1,0);this.camera.updateMatrixWorld();
    this.lost=e=>{e.preventDefault();this.onError();};canvas.addEventListener('webglcontextlost',this.lost);
  }
  material(color){if(!this.materials.has(color))this.materials.set(color,new THREE.MeshStandardMaterial({color,roughness:.84,metalness:0}));return this.materials.get(color);}
  box(root,color,x,y,z,w,h,d,ry=0){const m=new THREE.Mesh(this.geometry,this.material(color));m.position.set(x,y,z);m.scale.set(w,h,d);m.rotation.y=ry;root.add(m);return m;}
  group(root,x,y,z,rotation=0){const g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=rotation;root.add(g);return g;}
  model(root,id,variant,palette) {
    const b=(c,x,y,z,w,h,d,r=0)=>this.box(root,c,x,y,z,w,h,d,r), changed=variant;
    const wood='#9d704c',dark='#59483e',cream='#ffedcb',green=palette.leaf,red=changed==='color'?'#6d9fe0':'#e07b64';
    if(id==='tree') {
      b(wood,0,.8,0,.42,1.6,.45);b('#b48c62',.06,1.1,.2,.14,.7,.08);
      const leaf=changed==='color'?(palette===BIOMES[5]?'#d4af52':'#d589af'):green;
      if(changed==='shape'){for(let i=0;i<3;i++)b(leaf,0,1.45+i*.48,0,2-i*.52,.65,1.65-i*.4);}
      else {b(leaf,0,2.1,0,1.85,1.45,1.55);b(leaf,-.65,1.8,.15,.9,.7,.95);b('#9abd73',.2,2.85,-.1,1,.22,1);}
      if(palette===BIOMES[2])for(const [x,z] of [[-.5,.81],[.5,.81],[.7,.1]])b('#f5b45d',x,2,z,.22,.22,.2);
    } else if(id==='cottage') {
      b('#e8cfaa',0,.7,0,1.65,1.4,1.35);b('#cba780',.83,.65,0,.08,1.3,1.35);
      const roof=changed==='color'?([BIOMES[1],BIOMES[4]].includes(palette)?'#dba347':'#5c97a1'):palette.roof;
      for(let i=0;i<4;i++)b(roof,0,1.5+i*.14,0,2.05-i*.38,.19,1.7);
      b(wood,-.24,.43,.7,.45,.86,.08);b('#e9b95f',-.09,.44,.76,.07,.07,.04);
      b('#466c72',.44,.9,.7,.4,.42,.06);b(cream,.44,.9,.75,.045,.42,.04);b(cream,.44,.9,.75,.4,.045,.04);
      if(changed!=='shape'){b('#aa7d68',.55,1.9,-.35,.28,.9,.3);b(cream,.55,2.38,-.35,.38,.12,.4);}
      else b(cream,-.5,1.05,.76,.27,.2,.08);
    } else if(id==='pond') {
      b('#c8c1a0',0,.04,0,2.65,.14,1.65);b(palette.water,0,.13,0,2.36,.12,1.38);
      for(const [x,z,w,d] of [[-1.35,0,.3,1.6],[1.35,0,.3,1.6],[0,-.85,2.6,.3],[.5,.85,1.8,.3]])b('#adb1a0',x,.2,z,w,.35,d);
      for(const [x,z] of (changed==='count'?[[-.55,-.2],[.5,.35],[.6,-.4]]:[[-.55,-.2],[.5,.35]])){b('#689b6b',x,.24,z,.43,.07,.35);b('#ffe1d2',x,.32,z,.16,.14,.16);}
      b('#b6ece5',-.25,.205,.5,.65,.015,.035);b('#b6ece5',.4,.205,-.48,.52,.015,.035);
    } else if(id==='mushrooms') {
      const coords=changed==='count'?[[-.4,0],[.4,-.2],[0,.5]]:[[-.4,0],[.4,-.2]];
      coords.forEach(([x,z],i)=>{const h=i? .48:.7;b(cream,x,h/2,z,.2,h,.2);b(red,x,h,z,changed==='shape'?.4:.67,changed==='shape'?.65:.25,changed==='shape'?.4:.6);b(red,x,h+(changed==='shape'?.4:.15),z,.43,.12,.4);if(changed!=='shape'){b(cream,x-.15,h+.23,z,.12,.03,.1);b(cream,x+.16,h+.23,z+.1,.12,.03,.1);}});
    } else if(id==='flowers') {
      const count=changed==='count'?2:3;
      for(let i=0;i<count;i++){let x=(i-1)*.4,z=i===1?-.18:.14,h=.5+(i%2)*.22;
        b('#53965b',x,h/2,z,.075,h,.07);b('#79ab6a',x+.11,.25,z,.22,.07,.13);
        let color=changed==='color'?'#d997c1':'#f6cf62';
        b('#b88737',x,h,z,.18,.16,.18);
        for(let j=0;j<(changed==='shape'?2:4);j++){let a=j*Math.PI/2;b(color,x+Math.cos(a)*.18,h,z+Math.sin(a)*.18,.2,.13,.2);}
      }
    } else if(id==='rabbit') {
      b('#f5ead8',0,.68,0,.58,.72,.48);b('#e7ddcf',-.18,.16,.17,.23,.24,.46);b('#e7ddcf',.18,.16,.17,.23,.24,.46);
      b('#fff0d9',0,1.23,.05,.76,.67,.62);b('#e8c7b6',-.23,1.84,.03,.18,.6,.2);b('#e8c7b6',.23,1.86,.03,.18,.64,.2);
      b('#f7ecdc',-.23,1.84,.07,.26,.66,.13);b('#f7ecdc',.23,1.86,.07,.26,.7,.13);
      b('#e6ad9e',-.23,1.84,.151,.12,.44,.04);b('#e6ad9e',.23,1.86,.151,.12,.46,.04);
      for(const x of [-.2,.2]){b('#383a38',x,1.3,.377,.13,.18,.04);b('#ffffff',x-.025,1.34,.403,.04,.05,.01);}
      b('#d99588',0,1.12,.4,.13,.08,.09);b('#c5a69b',0,1.03,.39,.045,.07,.03);
      const scarf=changed==='color'?'#d98068':'#63a6a0';b(scarf,0,.96,.06,.67,.16,.56);b(scarf,-.19,.77,.33,.17,.35,.08);
      b('#ba8c51',.36,.65,-.06,.2,.42,.4);b('#f7ecdc',-.4,.7,.04,.18,.42,.22);b('#f7ecdc',.4,.75,.17,.18,.32,.22);
    } else if(id==='mailbox') {
      b(wood,0,.6,0,.16,1.2,.16);b(changed==='color'?'#b98bc1':'#619b9c',0,1.22,0,.65,.45,.52);
      b(dark,0,1.22,.27,.49,.04,.025);b('#e8a273',.38,1.5,0,.1,.27,.3);
      if(changed==='shape'){b(cream,0,1.58,0,.85,.18,.65);b(cream,0,1.75,0,.5,.18,.52);}
    } else if(id==='crate') {
      b(wood,0,.24,0,1,.48,.7);b('#c39664',0,.49,0,1.05,.1,.75);
      for(const x of [-.36,0,.36])b('#b78c61',x,.24,.36,.06,.4,.02);
      const count=changed==='count'?1:3;
      for(let i=0;i<count;i++)b('#e8b456',(i-1)*.27,.63,0,.25,.24,.26);
    } else if(id==='sign') {
      b(wood,0,.55,0,.14,1.1,.16);b('#dfc499',0,.96,0,1.2,.43,.17);
      const c='#6a7655';b(c,-.08,.96,.1,.5,.1,.03);b(c,.22,1.05,.1,.14,.12,.03);b(c,.22,.87,.1,.14,.12,.03);b(c,.35,.96,.1,.15,.12,.03);
      if(changed==='shape')b('#edb66b',0,1.28,0,.75,.22,.2);
    } else if(id==='lantern') {
      b(wood,0,.68,0,.13,1.36,.13);b(wood,.22,1.35,0,.55,.1,.14);
      const count=changed==='count'?2:1;
      for(let i=0;i<count;i++){let x=.25+(i?-.6:0);b(dark,x,.96,0,.45,.55,.4);b(changed==='color'?'#afc8ed':'#ffe2a0',x,.97,.21,.31,.33,.03);b('#deb86d',x,1.29,0,.52,.11,.48);if(changed==='shape')b('#deb86d',x,1.4,0,.28,.18,.28);}
    }
  }
  build(level,after) {
    const p=BIOMES[level.biome],scene=new THREE.Scene();scene.background=new THREE.Color(p.sky);
    scene.add(new THREE.HemisphereLight('#fff4dd','#91a5a0',2.6));
    const sun=new THREE.DirectionalLight(p.light,3.2);sun.position.set(-5,12,7);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-9;sun.shadow.camera.right=9;sun.shadow.camera.top=8;sun.shadow.camera.bottom=-8;sun.shadow.normalBias=.025;scene.add(sun);
    const g=new THREE.Group();scene.add(g);const b=(c,x,y,z,w,h,d,r=0)=>this.box(g,c,x,y,z,w,h,d,r);
    b('#946c4c',0,-.55,0,12,.6,8);b(p.edge,0,-.21,0,11.65,.28,7.65);b(p.ground,0,-.04,0,11.5,.12,7.5);
    for(const z of [-4,4])b('#b38b60',0,-.18,z,12.25,.5,.24);
    for(const x of [-6,6])b('#b38b60',x,-.18,0,.24,.5,8.2);
    for(let i=0;i<40;i++){const x=((i*37+level.layout*11)%110)/10-5.5,z=((i*19)%69)/10-3.4;
      b(i%3?'#b9cc80':'#b2c77c',x,.035,z,.1+(i%3)*.12,.02,.12);
    }
    for(let i=0;i<5;i++)b('#ddd4b7',-.6+i*.15,.09,1.15+i*.49,.65,.13,.35,i%2*.12);
    for(const x of [-4.7,-3.8,-2.9]){b('#a47e54',x,.35,-3.1,.15,.7,.17);}
    b('#c5a16a',-3.8,.45,-3.1,2,.13,.15);
    const positions={tree:[-3.9,0,-1.8],cottage:[2.7,0,-2.1],pond:[.1,0,.65],mushrooms:[-4,0,1.8],flowers:[3.4,0,1.6],rabbit:[-.9,0,-2.3],mailbox:[4.8,0,-.15],crate:[-2,0,2.8],sign:[1.8,0,2.9],lantern:[.6,0,-2.2]};
    // Five authored arrangements rotate small garden features without hiding them behind the tree or house.
    const front=['mushrooms','crate','sign','flowers'],slots=front.map(id=>positions[id]);
    front.forEach((id,i)=>{positions[id]=slots[(i+level.layout)%4];});
    if(level.layout===2||level.layout===4)[positions.rabbit,positions.lantern]=[positions.lantern,positions.rabbit];
    if(level.biome===4){for(const x of [-5.3,-2.6,3.9,5.2])b('#eff4e9',x,.09,-3.15,.7,.13,.45);}
    if(level.biome===5){for(const x of [-5.3,-2.5,.3,3.1,5.4]){b('#b38b60',x,.3,-3.55,.12,.6,.12);b('#f4c47b',x,.65,-3.55,.3,.32,.3);}}
    const targets={};
    for(const id of OBJECTS){const xyz=positions[id];const variant=after?level.changes[id]:null;
      const model=this.group(g,...xyz,variant==='direction'?Math.PI/2:0);
      if(variant!=='missing')this.model(model,id,variant,p);
      const heights={tree:1.8,cottage:1,pond:.25,mushrooms:.55,flowers:.5,rabbit:1,mailbox:1,crate:.45,sign:.85,lantern:1};
      const v=new THREE.Vector3(xyz[0],heights[id],xyz[2]).project(this.camera);
      targets[id]={x:(v.x+1)*50,y:(1-v.y)*50};
    }
    // Instance colours retain every authored surface with one draw per scene
    // (plus its shadow pass), rather than a separate draw for every paint colour.
    g.updateMatrixWorld(true);const instances=[];g.traverse(m=>{if(m.isMesh)instances.push({matrix:m.matrixWorld.clone(),color:m.material.color});});
    scene.remove(g);
    const mesh=new THREE.InstancedMesh(this.geometry,this.instanceMaterial,instances.length);
    instances.forEach(({matrix,color},i)=>{mesh.setMatrixAt(i,matrix);mesh.setColorAt(i,color);});mesh.castShadow=true;mesh.receiveShadow=true;scene.add(mesh);
    return {scene,targets};
  }
  load(level){this.clear();this.scenes=[this.build(level,false),this.build(level,true)];return this.scenes.map(s=>s.targets);}
  render(panels) {
    if(!this.scenes.length||!this.canvas.isConnected)return;
    const bounds=this.canvas.getBoundingClientRect();if(bounds.width<1||bounds.height<1)return;
    this.renderer.setSize(bounds.width,bounds.height,false);this.renderer.setScissorTest(true);this.renderer.info.reset();
    panels.forEach((panel,i)=>{const r=panel.getBoundingClientRect();const x=r.left-bounds.left,y=bounds.bottom-r.bottom;
      this.renderer.setViewport(x,y,r.width,r.height);this.renderer.setScissor(x,y,r.width,r.height);this.renderer.render(this.scenes[i].scene,this.camera);
    });this.renderer.setScissorTest(false);
    this.canvas.dataset.drawCalls=String(this.renderer.info.render.calls);this.canvas.dataset.triangles=String(this.renderer.info.render.triangles);
    this.canvas.dataset.geometries=String(this.renderer.info.memory.geometries);this.canvas.dataset.textures=String(this.renderer.info.memory.textures);this.canvas.dataset.materials=String(this.materials.size);
  }
  clear(){for(const {scene} of this.scenes)scene.traverse(o=>{if(o.isInstancedMesh)o.dispose();if(o.shadow?.map)o.shadow.map.dispose();});this.scenes=[];this.materials.forEach(m=>m.dispose());this.materials.clear();}
  destroy(){this.canvas.removeEventListener('webglcontextlost',this.lost);this.clear();this.geometry.dispose();this.instanceMaterial.dispose();this.renderer.dispose();this.renderer.forceContextLoss();}
}
