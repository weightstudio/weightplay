import * as THREE from './vendor/three/three.module.min.js';

// Original forged woodland axe: a faceted beard, honed edge and wrapped ash haft.
// All geometry belongs to the run renderer; no external assets or global cache.
export function buildAxe(renderer) {
  const axe=new THREE.Group();
  const metal=(name,color,roughness,metalness)=>{
    const m=new THREE.MeshStandardMaterial({color,roughness,metalness});
    renderer.materials.set(`axe:${name}`,m);return m;
  };
  const steel=metal('steel',0x638eaa,.29,.62),edge=metal('edge',0xe2f7ff,.22,.46),brass=metal('brass',0xe3b65e,.34,.58);
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
  plate([[-.04,.51],[-.25,.57],[-.51,.71],[-.66,.51],[-.72,.29],[-.66,.08],[-.48,-.07],[-.32,.13],[-.04,.25]],.145,steel);
  plate([[-.51,.71],[-.66,.51],[-.72,.29],[-.66,.08],[-.48,-.07],[-.47,.07],[-.57,.20],[-.61,.32],[-.56,.49],[-.43,.63]],.020,edge,.092,.006);
  plate([[-.10,.44],[-.28,.49],[-.40,.54],[-.50,.36],[-.45,.18],[-.34,.15],[-.26,.29],[-.10,.32]],.018,renderer.material(0x315b75),.09,.004);
  const collar=renderer.box(axe,.21,.065,.21,0xc69643,0,.25,0);collar.material=brass;
  const cap=renderer.box(axe,.18,.055,.20,0xc69643,0,.55,0);cap.material=brass;
  for(const y of [.35,.46]){const rivet=renderer.box(axe,.036,.036,.028,0xc69643,0,y,.105);rivet.material=brass;}
  // Fia's comet-lightning inlay is cut into the steel face, with a brass socket.
  plate([[-.31,.49],[-.43,.33],[-.35,.34],[-.40,.19],[-.24,.38],[-.33,.37]],.009,brass,.108,.002);
  // The renderer supplies the same articulated paw design as the left hand.
  axe.userData.tip=new THREE.Vector3(-.565,.32,0);
  axe.scale.setScalar(.85);
  return axe;
}
