import * as THREE from './vendor/three/three.module.min.js';

// Original forged woodland axe: a faceted beard, honed edge and wrapped ash haft.
// All geometry belongs to the run renderer; no external assets or global cache.
export function buildAxe(renderer) {
  const axe=new THREE.Group();
  const metal=(name,color,roughness,metalness)=>{
    const m=new THREE.MeshStandardMaterial({color,roughness,metalness});
    renderer.materials.set(`axe:${name}`,m);return m;
  };
  const steel=metal('steel',0x557a86,.34,.72),edge=metal('edge',0xe4f4ee,.22,.8),brass=metal('brass',0xc69643,.4,.65);
  const plate=(points,depth,material,z=0,bevel=.012)=>{
    const shape=new THREE.Shape();points.forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath();
    const geometry=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSize:bevel,bevelThickness:bevel,bevelSegments:1,steps:1});
    geometry.translate(0,0,z-depth/2);renderer.ownedGeometry.add(geometry);
    const mesh=new THREE.Mesh(geometry,material);axe.add(mesh);return mesh;
  };
  plate([[-.045,-.51],[.045,-.51],[.035,.57],[-.045,.57],[-.075,-.28]],.075,renderer.material(0x745034));
  renderer.box(axe,.018,.66,.014,0xab8150,-.016,.12,.047);
  for(let i=0;i<6;i++){
    const wrap=renderer.box(axe,.12,.048,.115,i%2?0x493e32:0x604b37,-.014,-.39+i*.059,.006);wrap.rotation.z=-.12;
  }
  const pommel=renderer.box(axe,.14,.085,.14,0xc69643,-.008,-.5,0);pommel.material=brass;
  const socket=renderer.box(axe,.16,.30,.18,0x557a86,0,.39,0);socket.material=steel;
  plate([[-.04,.51],[-.27,.58],[-.48,.70],[-.58,.47],[-.60,.24],[-.52,.04],[-.37,-.015],[-.26,.19],[-.04,.25]],.125,steel);
  plate([[-.48,.70],[-.58,.47],[-.60,.24],[-.52,.04],[-.37,-.015],[-.40,.09],[-.48,.27],[-.47,.46],[-.40,.61]],.018,edge,.080,.005);
  plate([[-.10,.44],[-.28,.48],[-.39,.55],[-.43,.41],[-.42,.27],[-.32,.17],[-.27,.28],[-.10,.32]],.018,renderer.material(0x294d5b),.08,.004);
  const collar=renderer.box(axe,.21,.065,.21,0xc69643,0,.25,0);collar.material=brass;
  const cap=renderer.box(axe,.18,.055,.20,0xc69643,0,.55,0);cap.material=brass;
  for(const y of [.35,.46]){const rivet=renderer.box(axe,.036,.036,.028,0xc69643,0,y,.105);rivet.material=brass;}
  // Small engraved evergreen motif, not an emissive block obscuring the blade.
  for(let i=0;i<3;i++)renderer.box(axe,.10-i*.022,.015,.008,0xd7ba74,-.28,.31+i*.046,.095).rotation.z=-.20;
  renderer.box(axe,.016,.16,.009,0xd7ba74,-.28,.355,.095).rotation.z=-.20;
  // Compact fox paw and cuff keep the grip readable behind the shaft.
  renderer.box(axe,.18,.19,.17,0xd97932,.025,-.20,-.03);
  for(let i=0;i<3;i++)renderer.box(axe,.055,.065,.065,0xf1b067,-.053+i*.057,-.16,.08);
  renderer.box(axe,.22,.11,.20,0x354f4d,.025,-.32,-.025);
  renderer.box(axe,.09,.035,.012,0xf5bd51,.025,-.31,.083);
  axe.userData.tip=new THREE.Vector3(-.565,.32,0);
  axe.scale.setScalar(.85);
  return axe;
}
