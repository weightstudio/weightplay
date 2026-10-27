import * as THREE from './vendor/three/three.module.min.js';

// One authored set of block-built objects feeds both the diner and reward portraits.
// Dimensions use X=width, Y=depth, Z=height; every object stands on Z=0.
const C=Object.freeze({wood:0x926441,woodLight:0xbe8c58,woodDark:0x604934,teal:0x497c73,coral:0xc87558,cream:0xeee3c7,soil:0x544636,leaf:0x49784e,leafLight:0x86a561,flower:0xe3ac69,white:0xf2ead9,metal:0x435856,glass:0xe4b865,gold:0xbe9140,goldLight:0xefce7c});
const model=build=>{
  const parts=[];
  const box=(surface,color,x,y,z,w,d,h,rotation=0)=>parts.push({surface,color,x,y,z,w,d,h,rotation});
  build(box);return Object.freeze(parts.map(Object.freeze));
};

const MODELS=Object.freeze([
  model(box=>{
    // Framed breakfast sign: two planted posts and a dimensional bun emblem.
    for(const x of [-.56,.56]){box('wood',C.woodDark,x,0,.63,.11,.15,1.26);box('metal',C.metal,x,-.015,.08,.22,.26,.16);}
    box('wood',C.woodDark,0,0,1.07,1.52,.19,.92);
    box('paint',C.teal,0,-.11,1.07,1.36,.065,.76);
    for(const z of [.64,1.50])box('wood',C.woodLight,0,-.13,z,1.58,.08,.07);
    for(const x of [-.75,.75])box('wood',C.woodLight,x,-.13,1.07,.07,.08,.90);
    box('ceramic',C.cream,0,-.18,.91,.94,.07,.085);
    box('bread',C.woodLight,0,-.22,1.00,.72,.075,.13);
    box('leaf',C.leafLight,0,-.24,1.095,.79,.07,.055);
    box('paint',C.coral,0,-.25,1.145,.67,.07,.045);
    box('bread',C.goldLight,0,-.22,1.245,.76,.075,.16);
    box('bread',C.goldLight,0,-.22,1.345,.54,.075,.065);
    for(const x of [-.20,0,.20])box('ceramic',C.white,x,-.265,1.285,.045,.018,.025);
  }),
  model(box=>{
    // Joined planter planks, soil, stems and intentionally square flower heads.
    box('wood',C.woodDark,0,0,.22,1.62,.62,.40);
    for(const z of [.12,.26,.40])box('wood',C.woodLight,0,-.325,z,1.64,.065,.095);
    for(const x of [-.75,.75])box('wood',C.wood,x,0,.26,.085,.70,.47);
    box('soil',C.soil,0,0,.43,1.40,.48,.055);
    for(const [i,x] of [-.52,0,.52].entries()){
      const height=[.79,.94,.83][i];box('leaf',C.leaf,x,0,(height+.43)/2,.055,.055,height-.43);
      box('leaf',C.leafLight,x-.11,.015,.61,.26,.16,.075,.25);
      box('leaf',C.leaf,x+.10,.04,.70,.25,.14,.075,-.25);
      const color=i===1?C.white:C.flower;
      for(const [dx,dz] of [[-.12,0],[.12,0],[0,-.12],[0,.12]])box('petal',color,x+dx,-.025,height+dz,.16,.12,.16);
      box('petal',C.gold,x,-.10,height,.115,.065,.115);
    }
    for(const x of [-.60,.60])box('metal',C.metal,x,-.365,.25,.05,.025,.05);
  }),
  model(box=>{
    // Slatted bench with armrests, braces and visible metal fixings.
    for(const x of [-.65,.65]){
      for(const y of [-.24,.24])box('metal',C.metal,x,y,.32,.11,.11,.64);
      box('metal',C.metal,x,.25,.82,.10,.10,1.05);
      box('metal',C.metal,x,-.01,.66,.09,.66,.085);
      box('wood',C.woodDark,x,-.01,.73,.16,.72,.09);
    }
    for(const y of [-.25,0,.25])box('wood',C.woodLight,0,y,.48,1.82,.20,.11);
    for(const z of [.82,1.06])box('wood',C.woodLight,0,.29,z,1.82,.11,.18);
    for(const x of [-.66,.66])for(const z of [.82,1.06])box('metal',C.metal,x,.218,z,.05,.02,.05);
    box('wood',C.wood,0,.25,.15,1.36,.10,.095);
  }),
  model(box=>{
    // Square lantern, metal cage and warm translucent panes around a small light.
    box('metal',C.metal,0,0,.10,.62,.55,.15);
    box('metal',C.metal,0,0,.92,.62,.55,.13);
    box('metal',C.metal,0,0,1.025,.47,.42,.10);
    box('metal',C.metal,0,0,1.11,.29,.28,.08);
    for(const x of [-.24,.24])for(const y of [-.20,.20])box('metal',C.metal,x,y,.52,.065,.065,.77);
    box('glass',C.glass,0,0,.51,.42,.36,.66);
    box('glow',C.goldLight,0,0,.47,.15,.15,.35);
    box('metal',C.metal,0,0,1.25,.06,.07,.23);
    box('metal',C.metal,0,-.01,1.38,.32,.075,.07);
    for(const x of [-.13,.13])box('metal',C.metal,x,-.01,1.30,.065,.075,.18);
  }),
  model(box=>{
    // Real suspended pennants and segmented cable, held by two timber posts.
    for(const x of [-1.40,1.40]){box('wood',C.woodDark,x,0,.73,.10,.13,1.46);box('metal',C.metal,x,0,.065,.30,.30,.12);box('metal',C.gold,x,0,1.49,.18,.18,.09);}
    const points=Array.from({length:8},(_,i)=>({x:-1.35+i*2.70/7,z:1.40-.18*Math.sin(i/7*Math.PI)}));
    for(let i=0;i<7;i++){
      const a=points[i],b=points[i+1],dx=b.x-a.x,dz=b.z-a.z;
      box('metal',C.metal,(a.x+b.x)/2,0,(a.z+b.z)/2,Math.hypot(dx,dz),.035,.035,[0,-Math.atan2(dz,dx),0]);
      const x=(a.x+b.x)/2,z=(a.z+b.z)/2-.15,color=[C.teal,C.coral,C.goldLight][i%3];
      box('cloth',color,x,-.025,z,.25,.04,.26);
      box('cloth',color,x,-.025,z-.17,.17,.04,.10);
      box('cloth',color,x,-.025,z-.24,.085,.04,.055);
      box('cloth',C.cream,x,-.05,z+.09,.20,.012,.035);
    }
  }),
  model(box=>{
    // Opening keepsake: a golden serving cup, block handle and engraved plinth.
    box('wood',C.woodDark,0,0,.12,.91,.73,.22);
    box('wood',C.woodLight,0,0,.26,.98,.79,.09);
    box('metal',C.gold,0,-.405,.14,.59,.035,.10);
    for(const x of [-.13,0,.13])box('metal',C.goldLight,x,-.426,.14,.065,.012,.025);
    box('metal',C.gold,0,0,.43,.20,.20,.30);
    box('metal',C.goldLight,0,0,.59,.64,.54,.095);
    box('metal',C.gold,0,0,.81,.54,.44,.40);
    for(const x of [-.285,.285])box('metal',C.goldLight,x,0,.84,.065,.49,.47);
    for(const y of [-.235,.235])box('metal',C.goldLight,0,y,.84,.58,.065,.47);
    box('ceramic',C.woodDark,0,0,1.025,.43,.33,.025);
    box('metal',C.goldLight,.43,0,.88,.09,.13,.32);
    for(const z of [.735,1.025])box('metal',C.goldLight,.34,0,z,.24,.13,.07);
  }),
]);

export const decorParts=index=>MODELS[index]||[];
export const dinerRoadPalette=style=>style==='berry-grove'?{road:0x806e91,edge:0xb3a2bf,marking:0xeee5cd}:{road:0x52655f,edge:0x9daa97,marking:0xeee5cd};
const BOARD=model(box=>{
  const {road,edge,marking}=dinerRoadPalette('berry-grove');
  box('wood',C.woodDark,0,0,.055,2.24,1.64,.11);box('tile',0xcdbf9f,0,0,.12,2.18,1.58,.07);
  for(const [x,y] of [[-.66,-.32],[0,-.32],[.66,-.32],[0,.34]]){box('tile',edge,x,y,.19,.64,.64,.085);box('road',road,x,y,.245,.55,.55,.04);}
  for(const x of [-.33,.33]){box('road',road,x,-.32,.25,.20,.55,.04);box('paint',marking,x,-.32,.275,.13,.03,.01);}
  box('road',road,0,.01,.25,.55,.20,.04);box('paint',marking,0,.01,.275,.03,.13,.01);
  for(const x of [-1.02,1.02])box('wood',C.woodLight,x,0,.16,.06,1.53,.07);
});
export function surfaceProperties(surface){
  const settings={road:{roughness:.98},tile:{roughness:.86},wood:{roughness:.72},paint:{roughness:.48},metal:{roughness:.36,metalness:.52},ceramic:{roughness:.26},bread:{roughness:.84},soil:{roughness:1},leaf:{roughness:.74},petal:{roughness:.66},cloth:{roughness:.94},glass:{roughness:.18,transparent:true,opacity:.72},glow:{roughness:.35,emissive:0xc99b43,emissiveIntensity:.35}};
  return settings[surface]||settings.paint;
}
export function createContactShadowMaterial(opacity=.22){
  return new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{opacity:{value:opacity},color:{value:new THREE.Color(0x283d35)}},
    vertexShader:'varying vec2 shadowUv; void main(){shadowUv=uv;vec4 p=vec4(position,1.0);\n#ifdef USE_INSTANCING\np=instanceMatrix*p;\n#endif\ngl_Position=projectionMatrix*modelViewMatrix*p;}',
    fragmentShader:'varying vec2 shadowUv;uniform float opacity;uniform vec3 color;void main(){float radius=length((shadowUv-.5)*2.0);float alpha=opacity*(1.0-smoothstep(.12,1.0,radius));if(alpha<.004)discard;gl_FragColor=vec4(color,alpha);\n#include <colorspace_fragment>\n}'});
}

// This temporary batch is called once before Battle can allocate its renderer.
// No context, animation loop, texture or WebGL buffer survives its finally block.
export async function createDecorPreviews(){
  const canvas=document.createElement('canvas');let renderer;
  const geometry=new THREE.BoxGeometry(1,1,1),plane=new THREE.PlaneGeometry(1,1),materials=new Map(),shadow=createContactShadowMaterial(.24),scene=new THREE.Scene();
  const camera=new THREE.OrthographicCamera(-2,2,2,-2,.1,30);camera.up.set(0,0,1);
  const material=part=>{const key=`${part.surface}:${part.color}`;if(!materials.has(key))materials.set(key,new THREE.MeshStandardMaterial({color:part.color,...surfaceProperties(part.surface)}));return materials.get(key);};
  const disposeInstances=group=>group.traverse(object=>{if(object.isInstancedMesh)object.dispose();});
  try{
    renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,preserveDrawingBuffer:true});renderer.setPixelRatio(1);renderer.setSize(192,192,false);renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1;
    const sky=new THREE.HemisphereLight(0xfff7eb,0x879488,1.25);sky.position.set(0,0,4);scene.add(sky);scene.add(new THREE.AmbientLight(0xffffff,.12));const sun=new THREE.DirectionalLight(0xfff3df,2);sun.position.set(-3,-4,8);scene.add(sun);
    const urls=[];
    for(let index=0;index<7;index++){
      const group=new THREE.Group(),buckets=new Map();
      for(const part of index===6?BOARD:decorParts(index)){const key=`${part.surface}:${part.color}`;if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(part);}
      for(const parts of buckets.values()){
        const mesh=new THREE.InstancedMesh(geometry,material(parts[0]),parts.length),matrix=new THREE.Matrix4();
        parts.forEach((part,i)=>{const rotation=Array.isArray(part.rotation)?new THREE.Quaternion().setFromEuler(new THREE.Euler(...part.rotation)):new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1),part.rotation);matrix.compose(new THREE.Vector3(part.x,part.y,part.z),rotation,new THREE.Vector3(part.w,part.d,part.h));mesh.setMatrixAt(i,matrix);});mesh.instanceMatrix.needsUpdate=true;group.add(mesh);
      }
      scene.add(group);group.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(group),center=bounds.getCenter(new THREE.Vector3()),size=bounds.getSize(new THREE.Vector3());
      const contact=new THREE.Mesh(plane,shadow);contact.scale.set(Math.max(.45,size.x*1.12),Math.max(.38,size.y*1.35),1);contact.position.set(center.x,center.y,.012);contact.renderOrder=1;group.add(contact);
      camera.position.copy(center).add(new THREE.Vector3(3.4,-6,3.5));camera.lookAt(center);camera.updateMatrixWorld();const corners=[];for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z])corners.push(new THREE.Vector3(x,y,z).applyMatrix4(camera.matrixWorldInverse));const fit=Math.max(...corners.map(p=>Math.abs(p.x)),...corners.map(p=>Math.abs(p.y)))*1.13;camera.left=-fit;camera.right=fit;camera.top=fit;camera.bottom=-fit;camera.updateProjectionMatrix();
      renderer.render(scene,camera);const url=canvas.toDataURL('image/png');if(index===6)urls.boardFinish=url;else urls.push(url);scene.remove(group);disposeInstances(group);
    }
    return urls;
  }finally{
    for(const object of [...scene.children])if(object.isGroup)disposeInstances(object);
    for(const item of materials.values())item.dispose();shadow.dispose();geometry.dispose();plane.dispose();renderer?.renderLists.dispose();renderer?.dispose();renderer?.forceContextLoss();canvas.width=canvas.height=1;
  }
}
