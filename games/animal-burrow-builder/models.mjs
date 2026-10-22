import * as THREE from './vendor/three/three.module.min.js';

// Original block models. One unit geometry and a bounded material palette are
// shared by the board, furniture, residents and rendered tool thumbnails.
export function createModels() {
  const geometry=new THREE.BoxGeometry(1,1,1), materials=new Map();
  const colors={wood:'#a96d3d',edge:'#71482e',light:'#e6bb77',floor:'#bd8a57',cream:'#f8ecd0',white:'#fff3df',blue:'#559aab',dark:'#263c3b',leaf:'#86ad61',green:'#467c56',pink:'#e1a29a',orange:'#eab35b',soil:'#674b38',water:'#57a9b4',rock:'#7c8b7b',moss:'#9aaa70',gold:'#f6d888',violet:'#baa5e7'};
  function material(color) {
    const key=colors[color]||color;
    if(!materials.has(key))materials.set(key,new THREE.MeshStandardMaterial({color:key,roughness:.86,metalness:0}));
    return materials.get(key);
  }
  function box(parent,x,y,z,w,h,d,color,ry=0) {
    const mesh=new THREE.Mesh(geometry,material(color));mesh.position.set(x,y,z);mesh.scale.set(w,h,d);mesh.rotation.y=ry;mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
  }
  function bake(group) {
    group.updateMatrixWorld(true);const batches=new Map();
    group.traverse(node=>{if(node.isMesh){const list=batches.get(node.material)||[];list.push(node.matrixWorld.clone());batches.set(node.material,list);}});
    const result=new THREE.Group();
    for(const [mat,matrices] of batches){const mesh=new THREE.InstancedMesh(geometry,mat,matrices.length);matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.castShadow=true;mesh.receiveShadow=true;result.add(mesh);}
    return result;
  }
  function lamp(parent,x,z,starlight=false) {
    box(parent,x,.34,z,.045,.65,.045,'edge');box(parent,x,.69,z,.19,.08,.19,'edge');
    box(parent,x,.58,z,.14,.18,.14,starlight?'violet':'gold');box(parent,x,.46,z,.2,.05,.2,'wood');
  }
  function rabbit(scale=1,scarf='blue') {
    const g=new THREE.Group();
    box(g,0,.24,0,.29,.31,.24,'cream');
    box(g,-.105,.065,.08,.14,.12,.26,'white');box(g,.105,.065,.08,.14,.12,.26,'white');
    box(g,0,.49,.03,.39,.34,.31,'white');
    for(const x of [-.12,.12]){box(g,x,.82,.015,.11,.36,.13,'white');box(g,x,.83,.087,.05,.25,.02,'pink');box(g,x,.51,.195,.04,.055,.022,'dark');}
    box(g,0,.44,.21,.19,.1,.07,'cream');box(g,0,.47,.255,.045,.035,.025,'pink');
    box(g,0,.34,.025,.33,.07,.29,scarf);box(g,.085,.25,.16,.1,.2,.05,scarf);
    box(g,0,.24,-.17,.29,.3,.15,'wood');box(g,0,.25,-.255,.1,.1,.03,'gold',Math.PI/4);
    box(g,-.19,.23,.04,.09,.19,.1,'white');box(g,.19,.23,.04,.09,.19,.1,'white');
    const out=bake(g);out.scale.setScalar(scale);return out;
  }
  function room(type,starlight=false) {
    const g=new THREE.Group();
    if(type!=='bridge'){
      box(g,0,.015,0,.94,.12,.94,'edge');
      for(let i=0;i<5;i++)box(g,(i-2)*.178,.084,0,.168,.035,.88,'floor');
    }
    if(type==='bed') {
      box(g,0,.2,0,.63,.22,.75,'wood');box(g,0,.34,-.01,.59,.12,.67,'cream');
      box(g,0,.415,.12,.6,.09,.43,'blue');box(g,0,.425,-.22,.43,.09,.19,'cream');
      box(g,0,.45,-.39,.69,.41,.07,'edge');box(g,0,.49,-.345,.52,.18,.035,'light');
      for(const x of [-.27,.27])box(g,x,.42,.36,.065,.22,.07,'light');
      box(g,0,.47,.12,.49,.018,.035,'light');lamp(g,.36,-.32,starlight);
    } else if(type==='pantry') {
      for(const x of [-.36,.36])box(g,x,.43,-.18,.075,.68,.37,'edge');
      for(const y of [.19,.46,.72])box(g,0,y,-.18,.8,.065,.41,'wood');
      for(let i=0;i<3;i++){
        box(g,(i-1)*.23,.3,-.16,.16,.15,.21,i===1?'orange':'cream');box(g,(i-1)*.23,.395,-.16,.17,.035,.22,'light');
        box(g,(i-1)*.23,.56,-.16,.16,.14,.2,i===1?'green':'orange');
      }
      box(g,.12,.2,.26,.4,.23,.28,'wood');box(g,.12,.33,.26,.33,.07,.22,'orange');
      box(g,-.3,.16,.26,.15,.15,.14,'leaf');
    } else if(type==='garden') {
      box(g,0,.16,0,.81,.13,.81,'wood');box(g,0,.23,0,.7,.025,.7,'soil');
      for(const x of [-.23,0,.23])for(const z of [-.22,.2]) {
        box(g,x,.29,z,.095,.12,.1,'orange');box(g,x,.4,z,.055,.16,.055,'green');
        box(g,x-.055,.38,z,.1,.06,.07,'leaf',-.3);box(g,x+.055,.43,z,.11,.065,.07,'leaf',.4);
      }
      box(g,.3,.5,-.3,.035,.53,.035,'wood');box(g,.3,.65,-.3,.21,.13,.05,'cream');
    } else if(type==='bridge') {
      for(let i=0;i<6;i++)box(g,0,.18,(i-2.5)*.162,.87,.1,.15,'light');
      for(const x of [-.38,.38]){
        for(const z of [-.38,.38])box(g,x,.37,z,.065,.45,.07,'edge');
        box(g,x,.54,0,.065,.06,.84,'wood');
      }
    } else if(type==='nursery') {
      box(g,0,.24,0,.65,.25,.63,'wood');box(g,0,.38,0,.52,.13,.51,'leaf');
      for(const x of [-.3,.3])for(const z of [-.29,0,.29])box(g,x,.42,z,.055,.4,.06,'light');
      for(const x of [-.3,.3])box(g,x,.64,0,.07,.07,.67,'cream');
      box(g,0,.51,-.35,.66,.36,.06,'light');box(g,-.1,.49,-.09,.18,.18,.16,'cream');
      box(g,-.1,.62,-.09,.2,.17,.18,'cream');box(g,-.17,.72,-.09,.06,.07,.07,'cream');box(g,-.03,.72,-.09,.06,.07,.07,'cream');
      box(g,-.14,.64,.009,.025,.03,.02,'dark');box(g,-.06,.64,.009,.025,.03,.02,'dark');
      box(g,.22,.22,.39,.13,.13,.13,'blue',.2);
    } else if(type==='entry') {
      for(const x of [-.38,.38])box(g,x,.5,-.3,.15,.92,.22,'wood');
      box(g,0,.99,-.3,.95,.16,.3,'light');box(g,0,1.11,-.3,.71,.12,.35,'green');
      box(g,0,.66,-.4,.6,.55,.06,'edge');box(g,0,.64,-.36,.14,.14,.025,'gold',Math.PI/4);
      lamp(g,.36,.29,starlight);
    } else {
      for(const x of [-.38,.38])box(g,x,.12,0,.055,.08,.83,'light');
      lamp(g,-.32,-.32,starlight);
    }
    return bake(g);
  }
  function terrain(map) {
    const g=new THREE.Group();
    box(g,0,-.59,0,5.48,.65,5.48,'soil');box(g,0,-.28,0,5.62,.15,5.62,'edge');
    box(g,0,-.16,0,5.75,.1,5.75,'green');
    for(let i=0;i<25;i++){
      const x=i%5-2,z=Math.floor(i/5)-2,t=map[i];
      box(g,x,-.075,z,.965,.13,.965,t==='~'?'water':'wood');
      if(t==='#'){
        const height=.28+(i%3)*.08;
        box(g,x,height/2,z,.86,height,.84,'rock',.04*(i%3));box(g,x-.1,height+.035,z-.12,.64,.07,.63,'moss',-.06);
        box(g,x+.25,.04,z+.3,.3,.17,.3,'rock',.2);
      } else if(t==='~') {
        for(let k=0;k<3;k++)box(g,x-.2+k*.18,.002,z-.25+k*.2,.25,.012,.025,'cream');
      } else {
        for(const a of [-.39,.39])for(const b of [-.39,.39])box(g,x+a,.002,z+b,.055,.025,.055,'light');
        if(t==='*'){
          box(g,x,.15,z,.18,.28,.18,'violet',Math.PI/4);box(g,x+.14,.08,z-.07,.1,.15,.1,'gold',Math.PI/4);
        }
      }
    }
    for(let i=0;i<12;i++){
      const x=-2.5+(i%6),z=i<6?-2.65:2.65;
      box(g,x,-.47,z,.45,.19,.08,i%2?'wood':'light');
      if(i<6&&i!==2&&i!==3){box(g,x,.05,z,.4,.35,.35,'green');box(g,x+.15,.21,z,.27,.25,.27,'leaf');}
    }
    for(let i=0;i<5;i++){
      const x=i-2;
      box(g,x,-.65,2.76,.96,.035,.02,'wood');box(g,x+.25,-.43,2.765,.16,.06,.02,'light');
      box(g,-2.76,-.58,x,.02,.03,.9,'wood');
      for(const side of [-1,1]){const z=i-2.2;box(g,side*2.68,-.02,z,.1,.29,.1,'green');box(g,side*2.7,.09,z+.06,.21,.06,.13,'leaf',.5);}
    }
    for(const [x,z] of [[-2.65,2.55],[2.65,1.5],[-2.6,-1.7]]){box(g,x,.02,z,.065,.26,.065,'cream');box(g,x,.17,z,.26,.095,.24,'orange');box(g,x+.06,.225,z,.06,.02,.06,'cream');}
    return bake(g);
  }
  return {box,material,geometry,bake,room,rabbit,terrain,dispose(){geometry.dispose();materials.forEach(m=>m.dispose());materials.clear();}};
}
