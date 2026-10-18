// Authored WeightPlay Block Animals rig. Shared geometry/materials are owned
// by the scene; articulation changes transforms, never simulation coordinates.
import * as T from './vendor/three/three.module.min.js';

export function createOrla(block, material) {
  const root = new T.Group(), body = new T.Group(); root.add(body);
  const part = (parent, size, at, color) => block(parent, size, at, color);
  const navy = material('#253957'), ink = material('#101f37');
  const cream = material('#fff1c4'), feather = material('#c8ac7b');
  const gold = material('#f5bb54'), light = material('#ffdc8b', .25);
  const eye = material('#101b2e'), white = material('#fffbe9');
  // Cape, tailored jacket, squared breast and a separate satchel.
  part(body,[.64,.63,.35],[0,.53,-.13],navy);
  part(body,[.47,.56,.25],[0,.54,.12],cream);
  part(body,[.56,.10,.42],[0,.25,0],ink);
  part(body,[.13,.13,.05],[0,.51,.275],gold);
  part(body,[.17,.27,.18],[-.34,.42,.03],feather);
  part(body,[.08,.31,.03],[-.34,.43,.135],gold);
  const head = new T.Group(); head.position.y=.98; body.add(head);
  part(head,[.78,.59,.43],[0,0,0],feather);
  part(head,[.68,.49,.07],[0,-.005,.25],cream);
  // Separate ear tufts and eyebrow facets keep the owl silhouette at phone size.
  part(head,[.16,.21,.24],[-.31,.32,0],feather);
  part(head,[.16,.21,.24],[.31,.32,0],feather);
  for (const x of [-.185,.185]) {
    part(head,[.30,.28,.07],[x,.025,.303],gold);
    part(head,[.23,.21,.04],[x,.025,.35],white);
    part(head,[.075,.13,.035],[x+.025,.015,.38],eye);
    part(head,[.025,.04,.012],[x+.01,.05,.402],white);
    part(head,[.25,.045,.05],[x,.193,.3],ink);
  }
  part(head,[.075,.04,.06],[0,.04,.33],gold);
  part(head,[.13,.11,.15],[0,-.14,.34],gold);
  part(head,[.07,.06,.10],[0,-.215,.34],light);
  const lids=[];
  for(const x of [-.185,.185]) lids.push(part(head,[.23,.21,.045],[x,.025,.386],cream));
  lids.forEach(l=>l.visible=false);
  // Stepped midnight scholar cap with an asymmetrical tip and moon badge.
  part(head,[.86,.09,.51],[0,.33,-.015],ink);
  part(head,[.64,.18,.40],[0,.46,-.03],navy);
  part(head,[.44,.17,.32],[-.055,.63,-.03],navy);
  part(head,[.25,.14,.25],[-.13,.78,-.02],navy);
  part(head,[.18,.13,.18],[-.235,.84,.01],navy);
  part(head,[.10,.10,.10],[-.32,.81,.01],light);
  part(head,[.15,.16,.025],[.15,.48,.185],gold);
  part(head,[.075,.12,.03],[.19,.51,.205],navy);
  part(head,[.04,.04,.025],[-.19,.66,.14],light);
  const wings=[],feet=[];
  for(const side of [-1,1]) {
    const wing=new T.Group(); wing.position.set(side*.33,.73,0); body.add(wing);
    part(wing,[.19,.38,.29],[side*.055,-.16,0],navy);
    part(wing,[.15,.10,.27],[side*.065,-.35,.01],gold); wings.push(wing);
    const foot=new T.Group();foot.position.set(side*.17,.12,.08);root.add(foot);
    part(foot,[.19,.14,.35],[0,0,.02],gold);
    part(foot,[.19,.05,.14],[0,-.025,.15],light);feet.push(foot);
  }
  // The carried lantern is a real little cage, not a glowing billboard.
  const lamp=new T.Group();lamp.position.set(.48,.35,.13);body.add(lamp);
  part(lamp,[.26,.05,.24],[0,.17,0],ink);
  part(lamp,[.26,.05,.24],[0,-.13,0],ink);
  part(lamp,[.16,.23,.16],[0,.02,0],light);
  for(const x of [-.1,.1]) for(const z of [-.1,.1])part(lamp,[.025,.29,.025],[x,.02,z],gold);
  part(lamp,[.12,.04,.04],[0,.24,0],gold);
  root.rotation.y=-.34;
  return {root,animate(s,reduced) {
    const p=s.player, moving=p.grounded && (s.keys.has('ArrowLeft')||s.keys.has('ArrowRight')||s.keys.has('KeyA')||s.keys.has('KeyD'));
    const gait=reduced?0:Math.sin(s.elapsed*.024)*(moving?1:0);
    feet.forEach((f,i)=>{f.rotation.x=gait*(i?-.45:.45);f.position.y=.12+Math.max(0,gait*(i?-1:1))*.07;});
    wings.forEach((w,i)=>{w.rotation.z=(i?1:-1)*(!p.grounded?.38:.12)+gait*.12;});
    body.position.y=reduced?0:Math.abs(gait)*.035;
    body.rotation.z=reduced?0:T.MathUtils.clamp(p.vy*.009,-.09,.09);
    const squash=!reduced&&s.landingTime>0?Math.sin(s.landingTime/12*Math.PI)*.08:0;
    body.scale.set(1+squash,1-squash,1);
    head.rotation.z=reduced?0:Math.sin(s.elapsed*.0015)*.025;
    lids.forEach(l=>l.visible=s.elapsed%4100>3950);
    root.visible=!s.recovery||s.recovery%6>1;
    root.position.set(p.x/50,(390-p.y)/50,0);
  }};
}
