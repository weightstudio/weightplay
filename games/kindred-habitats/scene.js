/** Kindred Habitats original block-animal model inventory. Three r180, metres, Y up.
 * Presentation only: no rewards, randomness, persistence or simulation decisions.
 */
const ENGINE = './vendor/three/three.module.min.js';
const HABITATS = ['meadow', 'wetland', 'canopy', 'dunes', 'snowfield', 'moon'];
const PALETTES = [
  ['#6f9d65','#3e765c','#b29b73','#d5e6da'], ['#568f82','#397d82','#aa996c','#c6e2df'],
  ['#568766','#276458','#a9956b','#c2d8c8'], ['#cc9d5a','#8c7948','#ad8060','#ead9b8'],
  ['#afccd7','#518a9d','#8ea9bc','#dce9ee'], ['#797da5','#4b597f','#a797b6','#d0d2e5'],
];
const ALIASES = { bunny:'rabbit', tortoise:'turtle', redPanda:'red-panda', arcticFox:'arctic-fox', snowOwl:'snowy-owl', fennecFox:'fennec', seaOtter:'otter', raccoonDog:'raccoon', moonMoth:'moth' };

export function createScene(container, { onReady } = {}) {
  if (!container || !container.appendChild) throw new TypeError('A scene container is required.');
  let THREE, renderer, scene, camera, world, box, observer;
  let alive = true, ready = false, contextLost = false, busyPortrait = false, suspended = false;
  let frame = 0, previous = 0, clock = 0, pulseAge = 2, pulseType = 'enter';
  let width = 1, height = 1, version = '', actors = [], highlight;
  let state = { habitat: 0, species: {shape:'rabbit',color:'#d8bb98'}, pets:[], reducedMotion:false, paused:false, lantern:false, labels:{} };
  let statusMode='loading';
  const materials = new Map(), portraitCache = new Map();
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const status = document.createElement('div');
  status.className = 'habitat-scene-status';
  status.setAttribute('role', 'status');
  status.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:12px;flex-direction:column;padding:20px;text-align:center;color:#334f52;background:#e6eee7;z-index:2;';
  const message = document.createElement('span');
  message.textContent = 'Preparing your sanctuary…';
  const retry = document.createElement('button');
  retry.type = 'button'; retry.textContent = 'Retry 3D view'; retry.hidden = true;
  retry.style.cssText = 'min-height:44px;padding:8px 18px;border:1px solid #6a8d83;border-radius:12px;background:#fff;color:#244e46;cursor:pointer;';
  status.append(message,retry); container.append(status);
  container.setAttribute('aria-label', 'Three-dimensional wildlife sanctuary');
  function showStatus(mode=statusMode) {
    statusMode=mode;
    const fallback={loading:'Preparing your sanctuary…',renderError:'The 3D sanctuary could not load. You can still use the field guide and care controls.',contextLost:'The 3D view was interrupted. Your sanctuary progress is safe.'};
    message.textContent=state.labels?.[mode] || (mode==='contextLost'?state.labels?.renderError:null) || fallback[mode] || '';
    retry.textContent=state.labels?.retry || 'Retry 3D view';retry.hidden=mode==='loading';
    status.hidden=!mode;status.style.display=mode?'flex':'none';
    if(state.labels?.sceneLabel)container.setAttribute('aria-label',state.labels.sceneLabel);
  }
  const reduced = () => state.reducedMotion || media.matches;
  const material = (color, cache = materials) => {
    const key = String(color || '#b5a28a');
    if (!cache.has(key)) cache.set(key, new THREE.MeshStandardMaterial({color:key,roughness:.84,metalness:0}));
    return cache.get(key);
  };
  // Each kit merges all cuboids of a colour into one instanced draw. A kit is an
  // animation pivot; geometry and scene-owned material caches are shared.
  function kit(cache = materials) {
    const group = new THREE.Group(), parts = new Map();
    function cube(color,x,y,z,w,h,d,rx=0,ry=0,rz=0) {
      const key = String(color || '#b5a28a');
      if (!parts.has(key)) parts.set(key,[]);
      parts.get(key).push([x,y,z,w,h,d,rx,ry,rz]);
    }
    function finish() {
      const dummy = new THREE.Object3D();
      for (const [color, rows] of parts) {
        const mesh = new THREE.InstancedMesh(box, material(color,cache), rows.length);
        rows.forEach((p,i) => { dummy.position.set(p[0],p[1],p[2]);dummy.scale.set(p[3],p[4],p[5]);dummy.rotation.set(p[6],p[7],p[8]);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix); });
        mesh.instanceMatrix.needsUpdate = true; mesh.computeBoundingSphere(); group.add(mesh);
      }
      return group;
    }
    return {cube,finish};
  }
  function animal(species = {}, cache = materials) {
    let kind = String(species.shape || species.kind || species.id || 'rabbit');
    kind = ALIASES[kind] || kind.toLowerCase().replaceAll('_','-');
    const k = kit(cache), c = k.cube;
    const fur = species.color || species.colors?.[0] || '#c69b73';
    const accent = species.accent || species.colors?.[1] || '#f0dec2';
    const dark = '#35414b', white = '#fff5dd', pink = '#d69191';
    let body=[.84,.74,1.02], head=[.72,.65,.66], hy=1.03,hz=.48,leg=.32;
    const bird = ['duck','heron','ibis','crane','flamingo','owl','snowy-owl','puffin','penguin','toucan','parrot','peacock','kingfisher','swan','quail','kiwi','hummingbird'].includes(kind);
    const long = ['otter','marten','ferret','weasel','crocodile','salamander','gecko','axolotl'].includes(kind);
    if (long) {body=[.62,.48,1.32];hy=.69;hz=.66;leg=.19;head=[.62,.5,.55];}
    if (bird) {body=[.71,.8,.68];hy=1.24;hz=.25;head=[.62,.58,.56];leg=.24;}
    if (['bear','polar-bear','panda','wombat','capybara','badger'].includes(kind)) {body=[1,.8,1.08];head=[.86,.72,.7];hy=1.12;}
    if (['deer','gazelle','ibex','reindeer','alpaca','camel','giraffe'].includes(kind)) {body=[.64,.67,1.12];leg=.61;hy=1.65;hz=.52;head=[.55,.59,.58];}
    if (['frog','toad','turtle','hedgehog','armadillo','pangolin','snail'].includes(kind)) {body=[.92,.42,1.02];leg=.14;head=[.56,.44,.5];hy=.52;hz=.57;}
    if (kind==='mouse') {body=[.62,.5,.78];head=[.58,.52,.52];leg=.2;hy=.78;hz=.39;}
    if (kind==='hare') {body=[.67,.72,1.05];head=[.6,.61,.62];leg=.44;hy=1.24;hz=.48;}
    if (kind==='meerkat') {body=[.49,.92,.49];head=[.59,.55,.53];leg=.32;hy=1.55;hz=.18;}
    if (['butterfly','moth','firefly','bee','dragonfly','beetle'].includes(kind)) {body=[.25,.25,.85];leg=.56;head=[.38,.35,.35];hy=.8;hz=.48;}
    const by = leg+body[1]/2;
    c(fur,0,by,0,...body);
    c(fur,0,hy,hz,...head);
    // Discrete feet with pale toe caps keep floor contact readable.
    if (!['butterfly','moth','firefly','bee','dragonfly','snail','seal','walrus'].includes(kind)) {
      for(const x of [-1,1]) for(const z of bird||kind==='bat'?[.08]:[-.36,.37]) {
        c(bird?'#c79a56':fur,x*body[0]*.31,leg/2,z,.19,leg,.23);
        c(bird?'#d9b574':accent,x*body[0]*.31,.075,z+.07,.21,.13,bird?.38:.27);
      }
    }
    // All faces have inset dark pupils and highlights, not painted billboards.
    const faceZ=hz+head[2]/2+.014, eyeY=hy+.075;
    for(const s of [-1,1]) {
      c(white,s*head[0]*.245,eyeY,faceZ,.165,.18,.035);
      c(dark,s*head[0]*.245,eyeY-.008,faceZ+.025,.085,.12,.035);
      c('#ffffff',s*head[0]*.245-.018,eyeY+.029,faceZ+.047,.027,.037,.014);
    }
    if (!bird && !['butterfly','moth','firefly','bee','dragonfly','beetle'].includes(kind)) {
      c(accent,0,hy-.16,faceZ+.08,head[0]*.57,.22,.23);
      c(['frog','toad','turtle','gecko','salamander','axolotl','snail'].includes(kind)?fur:dark,0,hy-.08,faceZ+.21,.13,.09,.055);
      c(dark,0,hy-.225,faceZ+.203,.12,.025,.016);
    }
    const ears = (w=.2,h=.3,d=.17,spread=.27) => {
      for(const s of [-1,1]) {c(fur,s*spread,hy+head[1]/2+h*.4,hz-.03,w,h,d,0,0,s*-.13);c(pink,s*spread,hy+head[1]/2+h*.4,hz+d*.5,w*.45,h*.63,.025,0,0,s*-.13);}
    };
    const tail = (w,h,d,y=.65,z=-.68,angle=-.3,color=fur) => c(color,0,y,z,w,h,d,angle);
    const wings = (color=accent,span=.22,height=.51) => {for(const s of [-1,1])c(color,s*(body[0]/2+.06),by+.04,-.06,span,height,.48,0,0,s*-.14);};
    const antlers = () => {for(const s of [-1,1]) {c('#b49d7d',s*.24,hy+.66,hz-.08,.085,.62,.09,0,0,s*-.16);c('#b49d7d',s*.38,hy+.78,hz-.08,.3,.08,.08,0,0,s*.3);c('#b49d7d',s*.43,hy+.91,hz-.08,.07,.27,.08);}};
    switch(kind) {
      case 'rabbit': ears(.23,.79,.18,.23);tail(.27,.26,.25,.5,-.65,0,white);break;
      case 'hare': ears(.16,.94,.15,.2);for(const s of [-1,1]){c(fur,s*.27,.38,-.25,.31,.55,.43);c(accent,s*.27,.12,.04,.25,.16,.64);c(dark,s*.27,2.07,hz+.02,.11,.15,.08);}tail(.2,.21,.19,.7,-.64,0,white);break;
      case 'mouse': ears(.36,.34,.16,.31);tail(.065,.06,1.17,.21,-.87,.15,pink);for(const s of [-1,1])c(white,s*.3,hy-.13,faceZ+.15,.32,.025,.025,0,0,s*-.12);break;
      case 'fox': case 'arctic-fox': case 'fennec':
        ears(kind==='fennec'?.37:.25,kind==='fennec'?.61:.38,.2,.26);tail(.36,.32,.92,.62,-.91,-.35);c(white,0,.79,-1.23,.37,.33,.34,-.35);break;
      case 'squirrel': case 'chinchilla':
        ears(.22,kind==='chinchilla'?.37:.23,.18,.25);c(fur,0,.9,-.84,.48,1.15,.38,-.35);c(accent,0,1.33,-.96,.34,.29,.36);break;
      case 'deer': case 'reindeer': ears(.23,.19,.31,.28);antlers();c(white,0,.95,.18,.42,.38,.71);tail(.2,.22,.26,1.05,-.68);if(kind==='reindeer'){c(accent,0,1.32,.39,.66,.64,.49);for(const s of [-1,1])c('#b49d7d',s*.39,hy+.89,hz-.08,.33,.2,.12);}else for(const s of [-1,1])for(const z of [-.3,0,.28])c(white,s*.325,1.04,z,.025,.08,.09);break;
      case 'gazelle': case 'ibex': ears(.29,.16,.22,.29);for(const s of [-1,1])c('#655f62',s*.18,hy+.65,hz-.1,.1,.65,.12,.25,0,s*-.15);tail(.13,.16,.4,1.15,-.68);break;
      case 'hedgehog':
        for(let i=0;i<5;i++)for(let j=0;j<3;j++)c('#82654e',(j-1)*.32,.63+(j===1?.08:0),-.55+i*.22,.26,.32,.18,-.22,0,(j-1)*-.25);ears(.13,.14,.13,.23);break;
      case 'pangolin':
        for(let i=0;i<5;i++)for(let j=0;j<3;j++)c(i%2?accent:fur,(j-1)*.3,.64+(j===1?.08:0),-.55+i*.22,.32,.16,.26,-.23,0,(j-1)*-.28);tail(.37,.22,.96,.22,-.94,-.1);c(accent,0,hy-.12,faceZ+.27,.25,.18,.37);break;
      case 'turtle':
        c('#567b62',0,.47,-.12,1.09,.41,1.04);c('#78966b',0,.72,-.12,.73,.16,.75);for(const s of [-1,1])c('#b7c58d',s*.39,.53,-.12,.065,.08,.88);tail(.15,.12,.34,.2,-.69);break;
      case 'duck': case 'swan': case 'goose':
        wings();c('#dda549',0,hy-.12,faceZ+.22,.42,.14,.42);tail(.33,.22,.39,.76,-.47,-.3);if(kind==='swan')c(fur,0,1.1,.24,.3,.65,.32);break;
      case 'heron': case 'ibis': case 'crane': case 'flamingo':
        wings();c(fur,0,1.15,.16,.23,.8,.25);c('#cda05f',0,hy-.08,faceZ+.37,.17,.13,.7);for(const s of [-1,1])c('#9b7161',s*.18,.37,0,.075,.7,.085);if(kind==='crane')c('#c97d73',0,hy+.3,hz,.34,.1,.32);if(kind==='ibis'){c('#816e69',0,hy-.22,faceZ+.68,.13,.31,.13,.18);c(accent,0,hy+.32,hz-.12,.49,.13,.55);}break;
      case 'frog': case 'toad':
        for(const s of [-1,1]) {c(fur,s*.36,.54,-.15,.4,.35,.49);c(fur,s*.24,.83,.6,.23,.24,.23);c(accent,s*.48,.12,.4,.31,.1,.39);}break;
      case 'otter': case 'marten': case 'ferret': case 'weasel':
        ears(kind==='marten'?.23:.15,kind==='marten'?.25:.16,.15,.24);tail(kind==='marten'?.36:.24,kind==='marten'?.32:.21,.82,.28,-.95,-.12);c(accent,0,.45,.45,.39,.35,.45);if(kind==='otter')c('#ad9a7a',0,.18,.73,.31,.13,.27);if(kind==='marten')c(accent,0,.7,.55,.39,.4,.11);break;
      case 'beaver':
        ears(.17,.18,.16,.27);tail(.51,.12,.84,.17,-.97,.12,'#7d675b');for(const s of [-1,1])c(white,s*.07,hy-.25,faceZ+.23,.1,.16,.04);break;
      case 'capybara': ears(.16,.16,.17,.32);c(accent,0,hy-.1,faceZ+.08,.71,.3,.25);break;
      case 'raccoon':
        ears();for(const s of [-1,1])c(dark,s*.19,eyeY,faceZ-.01,.28,.24,.035);for(const s of [-1,1]){c(white,s*.19,eyeY+.01,faceZ+.02,.1,.13,.035);c(dark,s*.19,eyeY,faceZ+.045,.045,.08,.02);}tail(.3,.25,.8,.54,-.91);for(let i=0;i<3;i++)c(dark,0,.63-i*.035,-.7-i*.21,.31,.26,.09,-.3);break;
      case 'badger':
        ears(.16,.14,.16,.31);c(white,0,hy+.12,hz,.22,.55,.72);for(const s of [-1,1]){c(dark,s*.25,hy+.12,faceZ-.02,.13,.55,.06);c(white,s*.25,eyeY,faceZ+.02,.1,.13,.035);c(dark,s*.25,eyeY,faceZ+.045,.045,.08,.02);}tail(.22,.2,.32,.55,-.7,0,accent);break;
      case 'owl': case 'snowy-owl':
        wings(fur,.22,.61);c('#e5bb66',0,hy-.15,faceZ+.12,.18,.19,.23);for(const s of [-1,1]){c(accent,s*.18,hy+.05,faceZ-.025,.31,.37,.045);c(dark,s*.18,hy+.06,faceZ+.018,.105,.16,.045);c(white,s*.18-.025,hy+.1,faceZ+.045,.035,.04,.02);c(fur,s*.25,hy+.35,hz,.17,.19,.29,0,0,s*-.2);}break;
      case 'toucan': case 'parrot': case 'kingfisher':
        wings();c(kind==='toucan'?'#e2a653':'#cfaa71',0,hy-.05,faceZ+.24,kind==='toucan'?.39:.24,.23,kind==='toucan'?.64:.36);c(dark,0,hy-.06,faceZ+(kind==='toucan'?.56:.39),.22,.18,.09);tail(.3,.16,.65,.6,-.52,-.65);break;
      case 'monkey': case 'lemur':
        ears(.28,.27,.18,.42);for(const s of [-1,1])c(fur,s*.51,.55,.02,.2,.68,.22,0,0,s*.13);tail(.16,.8,.18,.89,-.73);c(fur,.23,1.28,-.73,.55,.17,.18);if(kind==='lemur')for(let i=0;i<3;i++)c(white,0,.63+i*.22,-.74,.18,.1,.19);break;
      case 'sloth':
        ears(.14,.13,.15,.27);for(const s of [-1,1]){c(fur,s*.52,.5,.07,.22,.8,.24,0,0,s*.16);c(accent,s*.57,.16,.12,.23,.12,.35);c('#776a60',s*.19,eyeY,faceZ,.25,.18,.035,0,0,s*.25);}break;
      case 'panda': case 'red-panda': case 'bear': case 'polar-bear': case 'koala': case 'wombat':
        ears(kind==='koala'?.35:.23,kind==='koala'?.34:.23,.21,.31);tail(.24,.23,kind==='red-panda'?.95:.24,.5,kind==='red-panda'?-.95:-.67);if(['panda','red-panda'].includes(kind)){for(const s of [-1,1])c(kind==='panda'?dark:white,s*.21,eyeY,faceZ-.01,.25,.26,.035,0,0,s*.18);for(const s of [-1,1])c(dark,s*.21,eyeY,faceZ+.025,.085,.12,.04);}if(kind==='koala')c(dark,0,hy-.02,faceZ+.16,.24,.27,.14);break;
      case 'camel':
        ears();c(fur,0,1.43,-.2,.5,.55,.53);c(fur,0,1.45,.39,.33,.75,.33);tail(.13,.19,.5,1.13,-.76);break;
      case 'alpaca': case 'giraffe':
        ears(.15,.41,.16,.21);c(fur,0,1.37,.42,.36,.85,.4);if(kind==='giraffe')for(const s of [-1,1])c(accent,s*.17,hy+.48,hz-.08,.11,.34,.12);tail(.13,.16,.5,1.13,-.75);break;
      case 'meerkat':
        ears(.17,.19,.15,.27);c(fur,0,1.07,-.05,.5,.95,.51);c(accent,0,1.02,.24,.31,.7,.08);for(const s of [-1,1])c(fur,s*.34,.85,.35,.15,.43,.17,.4,0,s*-.25);tail(.16,.15,.68,.3,-.78);break;
      case 'jerboa':
        ears(.19,.64,.15,.22);for(const s of [-1,1])c(accent,s*.37,.13,.27,.24,.16,.65);tail(.07,.07,1.2,.25,-1.05);c(dark,0,.24,-1.66,.17,.14,.2);break;
      case 'gecko': case 'salamander': case 'crocodile': case 'axolotl':
        tail(.32,.22,.99,.28,-1.06);for(const s of [-1,1])c(accent,s*.4,.15,.27,.33,.11,.38,0,s*.3);if(kind==='axolotl')for(const s of [-1,1])for(let i=0;i<3;i++)c(pink,s*(.39+i*.07),hy+(i-1)*.19,hz,.25,.11,.14,0,0,s*(i-1)*.45);if(kind==='crocodile')for(let i=0;i<5;i++)c(accent,0,.65,-.65+i*.23,.19,.2,.16);break;
      case 'penguin': case 'puffin':
        wings(fur,.18,.7);c(white,0,by,.36,.48,.64,.09);c('#d6a150',0,hy-.11,faceZ+.13,kind==='puffin'?.33:.23,.17,.29);break;
      case 'lynx':
        ears(.24,.31,.2,.27);for(const s of [-1,1]){c(dark,s*.29,hy+.58,hz,.065,.3,.075,0,0,s*-.11);c(accent,s*.4,hy-.13,hz+.2,.24,.2,.3,0,0,s*.25);}tail(.24,.22,.28,.62,-.68);for(const s of [-1,1])for(const z of [-.25,.13])c(dark,s*.43,.74,z,.025,.12,.13);break;
      case 'peacock':
        wings('#6b9d91');c('#c3ad76',0,hy-.13,faceZ+.12,.19,.16,.25);for(let i=-3;i<=3;i++){const a=i*.23;c(accent,i*.19,1.12+(.4-Math.abs(i)*.08),-.64,.24,1.25,.15,0,0,-a);c('#799bb0',i*.28,1.7-Math.abs(i)*.1,-.53,.19,.23,.06,0,0,-a);c('#e3c99a',i*.28,1.7-Math.abs(i)*.1,-.49,.08,.1,.035);}for(const s of [-1,0,1])c(accent,s*.11,hy+.45,hz,.045,.32,.055,0,0,s*-.23);break;
      case 'seal': case 'walrus':
        c(fur,0,.39,-.15,1,.63,1.22);for(const s of [-1,1])c(fur,s*.57,.15,.12,.38,.16,.56,0,0,s*.28);tail(.54,.15,.48,.2,-.86);if(kind==='walrus')for(const s of [-1,1])c(white,s*.16,hy-.36,faceZ+.19,.11,.48,.12,0,0,s*-.12);break;
      case 'butterfly': case 'moth':
        for(const s of [-1,1]) {c(accent,s*.62,.82,-.02,.91,.12,.84,0,0,s*.12);c(fur,s*.51,.81,-.57,.72,.12,.54,0,0,s*-.12);c('#e7dba9',s*.69,.9,.04,.24,.035,.31);c(dark,s*.13,1.08,.57,.055,.38,.06,.25,0,s*-.27);}break;
      case 'firefly': case 'bee': case 'beetle':
        wings('#dfebe4',.68,.1);c(kind==='firefly'?'#dbe69a':accent,0,by,-.4,.31,.28,.35);for(const s of [-1,1])c(dark,s*.13,1.03,.55,.055,.29,.06,0,0,s*-.2);break;
      case 'dragonfly':
        for(const s of [-1,1])for(const z of [-.3,.18])c(accent,s*.59,.86,z,1.02,.065,.22,0,0,s*.08);tail(.15,.15,.9,.73,-.7);break;
      case 'snail':
        c(accent,0,.69,-.21,.72,.72,.69);c(fur,0,.7,.17,.38,.39,.1);for(const s of [-1,1])c(fur,s*.18,.93,.69,.07,.55,.08,0,0,s*-.15);break;
      case 'bat':
        ears(.26,.42,.19,.23);for(const s of [-1,1]){c(accent,s*.76,.95,-.02,.94,.14,.59,0,0,s*.2);c(fur,s*.94,.87,-.19,.25,.24,.22);c(fur,s*.55,.87,.22,.25,.24,.22);}break;
      default: ears(); tail(.26,.25,.61,.6,-.8);break;
    }
    const result=k.finish();result.userData.kind=kind;return result;
  }

  function environment(index) {
    const [ground,leaf,stone,sky]=PALETTES[index], k=kit(), c=k.cube;
    scene.background=new THREE.Color(sky);scene.fog=new THREE.Fog(sky,18,30);
    // Layered island edge is authored stone, without grass/dirt pixel texture.
    c('#667b7d',0,-.46,0,7.9,.35,5.8);c(stone,0,-.23,0,8.3,.22,6.1);c(ground,0,-.075,0,8.1,.15,5.9);
    c(stone,0,.035,.2,2.25,.11,1.9);c('#e6d6ad',0,.098,.2,1.97,.025,1.63);
    const rock=(x,z,s=1)=> {c(stone,x,.2*s,z,.65*s,.4*s,.55*s,0,.18,.08);c('#c9d0bc',x-.1*s,.44*s,z-.04,.39*s,.16*s,.35*s);};
    const tree=(x,z,s=1,conifer=false)=> {c('#977b65',x,.75*s,z,.24*s,1.5*s,.25*s);c(leaf,x,1.57*s,z,1.1*s,.65*s,.98*s);c(leaf,x,2.05*s,z,.72*s,.45*s,.69*s);if(conifer)c(leaf,x,2.4*s,z,.39*s,.3*s,.4*s);else c('#aecb91',x-.28*s,1.89*s,z+.2*s,.57*s,.25*s,.58*s);};
    const flower=(x,z,moon=false)=> {c(leaf,x,.19,z,.055,.37,.055);c(moon?'#e7d8a3':'#ead0a0',x,.4,z,.21,.1,.21);c(moon?'#f5edd2':'#c798a4',x,.47,z,.1,.07,.1);};
    if(index===0) {tree(-2.9,-1.75,.86);tree(2.9,-1.9,1.1);rock(-3,1.5);for(let i=0;i<7;i++)flower(-3+i*.85,-2.4+(i%2)*.3);}
    if(index===1) {c('#5fa7b0',-2.22,.015,.15,2.65,.07,3.68);c('#8fc8c2',-2.45,.06,.12,1.75,.025,2.82);for(let i=0;i<6;i++){let x=-3.45+(i%2)*.33,z=-1.8+i*.65;c(leaf,x,.48,z,.075,.95,.07);c('#aa8a68',x,.95,z,.14,.31,.13);}tree(3,-1.9,.85);rock(2.9,1.5);}
    if(index===2) {tree(-2.9,-1.95,1.28);tree(2.9,-2,1.2);tree(-3.3,.8,.78);c('#9a826a',2.6,.19,1.7,1.5,.38,.42,0,.3);for(let i=0;i<4;i++)flower(2.1+i*.38,2.2);}
    if(index===3) {for(const s of [-1,1]){let x=s*3;c(leaf,x,.75,-1.65,.37,1.5,.37);c(leaf,x+s*.4,1.06,-1.65,.55,.27,.26);c(leaf,x+s*.61,1.32,-1.65,.25,.6,.26);}rock(-2.8,1.5,1.1);c('#d6b27c',2.4,.12,1.6,1.2,.24,.9);}
    if(index===4) {tree(-2.8,-1.9,.96,true);tree(2.9,-1.9,1.02,true);c('#edf3ee',-2.8,1.96,-1.9,.73,.12,.72);c('#edf3ee',2.9,2.04,-1.9,.77,.12,.77);rock(-3,1.5);c('#9acbd5',2.65,.025,1.2,1.62,.06,1.51);c('#d9eeea',2.95,.06,1.21,.55,.025,1.18);}
    if(index===5) {tree(-3,-1.8,.86);tree(3,-2,.9);for(let i=0;i<8;i++)flower(-3.3+i*.92,-2.4+(i%2)*.31,true);for(const s of [-1,1]) {c('#8c9db4',s*3,.4,1.2,.39,.8,.41,0,0,s*.17);c('#d7c3df',s*3.16,.25,1.35,.25,.5,.28,0,0,s*-.2);}c('#d6d0ab',0,2.65,-2.3,.7,.7,.18);c(sky,.22,2.81,-2.17,.6,.6,.2);}
    if(state.lantern) {
      c('#7b796d',2.4,.82,1.8,.12,1.64,.12);c('#8b8875',2.22,1.65,1.8,.48,.1,.13);
      c('#e8cf87',2.05,1.31,1.8,.34,.45,.32);c('#f6e6b0',2.05,1.32,1.98,.22,.3,.035);
      c('#76867b',2.05,1.61,1.8,.49,.15,.45);c('#76867b',2.05,1.04,1.8,.45,.1,.4);
      for(const s of [-1,1])c('#76867b',2.05+s*.2,1.32,1.99,.055,.49,.055);
      c('#b0c5b7',1.99,1.37,2.01,.09,.19,.03);c('#e8cf87',2.04,1.41,2.03,.075,.16,.035);
    }
    // Stone path, ground tufts and a low boundary bring deliberate scale cues.
    for(let i=0;i<4;i++)c('#ddd2b4',.16*(i%2),.017,1.48+i*.36,.67,.035,.24,0,i*.09);
    for(const s of [-1,1])for(let j=0;j<3;j++)c(leaf,s*(2.1+j*.51),.11,2.25-j*.23,.09,.22+j*.035,.11,0,0,s*.15);
    return k.finish();
  }

  function dropWorld() {
    if(world) {scene.remove(world);world.traverse(o=>{if(o.isInstancedMesh)o.dispose();});world.clear();}
    for(const m of materials.values())m.dispose();materials.clear();actors=[];
  }
  function rebuild() {
    if(!ready || !alive)return;
    dropWorld();world=new THREE.Group();scene.add(world);
    let habitatName=state.habitat?.id || state.habitat;
    if(habitatName==='moon-garden')habitatName='moon';
    let hi=typeof state.habitat==='number'?state.habitat:HABITATS.indexOf(habitatName);
    hi=Math.max(0,Math.min(5,hi<0?0:hi));world.add(environment(hi));
    const target=animal(state.species);target.position.set(0,.12,.18);target.scale.setScalar(1.2);target.rotation.y=-.13;world.add(target);actors.push({object:target,base:.12,phase:0,target:true,scale:1.2});
    const companions=(state.pets||[]).slice(0,6);
    const slots=[[-1.9,.65],[1.9,.65],[-1.3,-1.5],[1.3,-1.5],[-3,-.65],[3,-.65]];
    companions.forEach((pet,i)=> {const a=animal(pet.species || pet);a.scale.setScalar(.51);a.position.set(slots[i][0],.025,slots[i][1]);a.rotation.y=i%2?-.32:.32;world.add(a);actors.push({object:a,base:.025,phase:i*1.12+1,target:false});});
    const ring=kit();for(const x of [-1,1])ring.cube('#f2d696',x*1.09,.14,.18,.035,.045,1.96);for(const z of [-.81,1.17])ring.cube('#f2d696',0,.14,z,2.2,.045,.035);highlight=ring.finish();world.add(highlight);
    pulseAge=0;pulseType='enter';resize();schedule();
  }
  function resize() {
    if(!ready || !alive || busyPortrait)return;
    const r=container.getBoundingClientRect();width=Math.max(1,Math.round(r.width));height=Math.max(1,Math.round(r.height));
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));renderer.setSize(width,height,false);
    // Fit actual occupied cuboid corners, not the Cartesian product of a world
    // AABB's empty upper/front corners. That old envelope wasted phone pixels.
    camera.position.set(7,6.1,9);camera.lookAt(0,.65,0);camera.updateMatrixWorld(true);
    world.updateMatrixWorld(true);
    let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
    const matrix=new THREE.Matrix4(),project=new THREE.Matrix4(),v=new THREE.Vector3();
    world.traverse(o=>{
      if(!o.isInstancedMesh)return;
      for(let i=0;i<o.count;i++){
        o.getMatrixAt(i,matrix);project.multiplyMatrices(o.matrixWorld,matrix);project.premultiply(camera.matrixWorldInverse);
        for(const x of [-.5,.5])for(const y of [-.5,.5])for(const z of [-.5,.5]){
          v.set(x,y,z).applyMatrix4(project);minX=Math.min(minX,v.x);maxX=Math.max(maxX,v.x);minY=Math.min(minY,v.y);maxY=Math.max(maxY,v.y);
        }
      }
    });
    const aspect=width/height,half=Math.max((maxY-minY)/2,(maxX-minX)/2/aspect)*1.11;
    const cx=(maxX+minX)/2,cy=(maxY+minY)/2;
    camera.left=cx-half*aspect;camera.right=cx+half*aspect;camera.top=cy+half;camera.bottom=cy-half;camera.updateProjectionMatrix();schedule();
  }
  function render(now) {
    frame=0;if(!alive || !ready || contextLost || state.paused || suspended || document.hidden)return;
    const dt=previous?Math.min((now-previous)/1000,.04):0;previous=now;clock+=dt;pulseAge+=dt;
    const still=reduced(), life=pulseType==='collection'||pulseType==='adult'?.58:.34;
    const progress=Math.min(1,pulseAge/life), hop=Math.sin(progress*Math.PI);
    const amplitude=({collection:.3,adult:.25,trust:.18,purchase:.09,rejection:0,enter:.08})[pulseType] ?? .13;
    for(const actor of actors) {
      const a=actor.object;
      a.position.y=actor.base+(still?0:Math.sin(clock*1.5+actor.phase)*.012)+(actor.target&&!still?hop*amplitude:0);
      a.rotation.z=actor.target&&!still&&progress<1?(pulseType==='rejection'?Math.sin(progress*Math.PI*4)*.045:hop*.025):0;
      if(actor.target)a.scale.set(actor.scale*(1+(still?0:hop*.025)),actor.scale*(1-(still?0:hop*.035)),actor.scale*(1+(still?0:hop*.025)));
    }
    if(highlight)highlight.visible=progress<1;
    renderer.render(scene,camera);publishRenderMetrics();
    // Reduced motion settles to a static frame after feedback completes.
    if(!still || progress<1)schedule();
  }
  function schedule() {if(alive&&ready&&!contextLost&&!state.paused&&!suspended&&!document.hidden&&!frame)frame=requestAnimationFrame(render);}
  function publishRenderMetrics() {
    const data=renderer.domElement.dataset,info=renderer.info;
    const values={renderCalls:info.render.calls,renderTriangles:info.render.triangles,renderGeometries:info.memory.geometries,renderTextures:info.memory.textures,renderDpr:renderer.getPixelRatio(),threeRevision:THREE.REVISION};
    for(const [key,value] of Object.entries(values))if(data[key]!==String(value))data[key]=String(value);
  }
  function pulse(type='care') {pulseType=({collect:'collection',collected:'collection',growth:'adult',reject:'rejection',error:'rejection'})[type] || String(type);pulseAge=0;previous=0;schedule();}
  function update(next={}) {
    state={...state,...next};
    if(next.labels)showStatus();
    if(state.paused){cancelAnimationFrame(frame);frame=0;previous=0;}
    const key=JSON.stringify([state.habitat,state.species,(state.pets||[]).slice(0,6),state.lantern]);
    if(key!==version){version=key;rebuild();}
    if(next.event)pulse(typeof next.event==='string'?next.event:next.event.type);
    schedule();
  }
  function lost(event) {
    event.preventDefault();contextLost=true;cancelAnimationFrame(frame);frame=0;previous=0;
    showStatus('contextLost');
  }
  function restored() {if(!alive)return;contextLost=false;showStatus(null);pulse('enter');}
  function visibility() {cancelAnimationFrame(frame);frame=0;previous=0;if(!document.hidden){pulseAge=2;schedule();}}
  function pagehide() {suspended=true;cancelAnimationFrame(frame);frame=0;previous=0;}
  function pageshow() {suspended=false;visibility();}
  function error() {showStatus('renderError');}
  let loading, importAttempt = 0;
  async function initialize() {
    if(!alive)return;
    retry.disabled=true;showStatus('loading');
    try {
      // Failed dynamic imports are retained in the document module map; retry with a fresh URL.
      THREE ||= await import(`${ENGINE}?retry=${++importAttempt}`);if(!alive)return;
      if(renderer) {renderer.domElement.removeEventListener('webglcontextlost',lost);renderer.domElement.removeEventListener('webglcontextrestored',restored);dropWorld();box?.dispose();renderer.dispose();renderer.domElement.remove();}
      renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power',preserveDrawingBuffer:false});
      renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1;
      renderer.shadowMap.enabled=false;
      const canvas=renderer.domElement;canvas.style.cssText='display:block;width:100%;height:100%;';canvas.setAttribute('aria-hidden','true');canvas.dataset.renderer='three-webgl2';
      canvas.addEventListener('webglcontextlost',lost);canvas.addEventListener('webglcontextrestored',restored);container.prepend(canvas);
      box=new THREE.BoxGeometry(1,1,1);scene=new THREE.Scene();camera=new THREE.OrthographicCamera(-6,6,5,-5,.1,60);
      scene.add(new THREE.HemisphereLight('#fff4d2','#7386a1',1.45));const key=new THREE.DirectionalLight('#fff0ce',2);key.position.set(-4,8,6);scene.add(key);const fill=new THREE.DirectionalLight('#b6d7ed',.65);fill.position.set(5,3,-4);scene.add(fill);
      ready=true;contextLost=false;showStatus(null);rebuild();if(typeof onReady==='function')Promise.resolve().then(onReady).catch(e=>console.warn('Kindred Habitats art hydration failed:',e?.message||'unknown error'));
    }catch(e){ready=false;error();console.warn('Kindred Habitats 3D unavailable:',e?.message || 'WebGL unavailable');}
    finally{retry.disabled=false;}
  }
  retry.addEventListener('click',()=> {if(!retry.disabled)loading=initialize();});
  observer=new ResizeObserver(resize);observer.observe(container);
  document.addEventListener('visibilitychange',visibility);window.addEventListener('pagehide',pagehide);window.addEventListener('pageshow',pageshow);media.addEventListener('change',visibility);
  loading=initialize();

  function objectModel(id,cache) {
    id=({rock:'rocks'})[id] || id;
    const k=kit(cache),c=k.cube;
    if(id==='crystals') {for(const [x,y,z,s] of [[0,.55,0,1],[-.4,.3,.12,.65],[.4,.33,-.12,.7]]){c('#a4c5df',x,y,z,.37*s,.9*s,.37*s,0,0,.12);c('#d8ebec',x-.1*s,y+.2*s,z+.2*s,.13*s,.37*s,.04);}}
    else if(['greens','grass'].includes(id)){for(const s of [-1,0,1]){c('#608c68',s*.2,.49,0,.12,.8,.13,0,0,s*-.36);c('#90bd7d',s*.29,.71,.06,.3,.36,.13,0,0,s*-.36);}}
    else if(id==='seeds') {c('#b89b6d',0,.35,0,.8,.58,.52);c('#d8c59a',0,.65,0,.84,.13,.56);for(let i=0;i<5;i++)c('#7f6551',-.27+i*.13,.74,(i%2)*.13-.06,.1,.08,.15);}
    else if(id==='fruit'){c('#cb8574',0,.45,0,.67,.64,.62);c('#aa6e63',0,.25,0,.51,.2,.49);c('#896e56',0,.85,0,.08,.26,.08,0,0,-.15);c('#83a879',.2,.85,0,.36,.1,.18,0,0,.3);}
    else if(id==='fish') {c('#83b2c5',0,.48,0,.88,.43,.36);c('#548da8',-.56,.48,0,.33,.55,.18,0,0,.2);c('#e6dcc3',.2,.36,.2,.4,.12,.035);c('#334650',.3,.56,.2,.07,.09,.04);}
    else if(id==='water') {c('#80bcc4',0,.2,0,1.12,.18,.85);c('#b1d4cf',0,.3,0,.82,.05,.54);c('#99c9d0',0,.63,0,.29,.5,.3,0,0,-.3);}
    else if(id==='rocks') {c('#96a7aa',-.2,.32,0,.65,.59,.6,0,.16,.08);c('#c6cbc0',.32,.25,.15,.5,.43,.5,0,-.2,-.11);}
    else if(id==='tree') {c('#9a8067',0,.57,0,.23,1.14,.24);c('#74966e',0,1.05,0,.87,.53,.74);c('#a5bc86',-.15,1.4,0,.52,.29,.48);}
    else if(id==='flowers') {for(const s of [-1,0,1]){c('#719b79',s*.28,.41,0,.055,.7,.055);c('#ddb3bb',s*.28,.78+Math.abs(s)*.08,0,.35,.12,.34);c('#e9d6a2',s*.28,.87+Math.abs(s)*.08,0,.13,.08,.13);}}
    else if(id==='notebook') {c('#648a86',0,.48,0,.73,.88,.19,0,0,-.1);c('#e3dbc3',.05,.47,.12,.55,.76,.09,0,0,-.1);c('#9dbaaf',-.31,.48,.13,.12,.86,.08,0,0,-.1);c('#d5be86',.12,.49,.19,.24,.24,.035,0,0,-.1);}
    else {c('#a99777',0,.35,0,.9,.62,.58);c('#cfbc91',0,.68,0,1,.14,.66);c('#789e8f',0,.41,.32,.21,.4,.07);if(id==='kit'){c('#89785e',0,.95,0,.47,.1,.14);for(const s of [-1,1])c('#89785e',s*.2,.82,0,.08,.25,.14);}}
    return k.finish();
  }
  async function snapshot(subject,isProp=false) {
    await loading;
    if(!alive||!ready||contextLost)return null;
    const id=(isProp?'prop:':'pet:')+JSON.stringify(subject),existing=portraitCache.get(id);if(existing)return existing;
    if(portraitCache.size>=50)return null;
    const cache=new Map(),temp=new THREE.Scene();temp.background=new THREE.Color('#e8eee4');
    temp.add(new THREE.HemisphereLight('#fff3d3','#8298b4',1.6));const light=new THREE.DirectionalLight('#fff2d3',2.1);light.position.set(-3,6,5);temp.add(light);
    let model;
    try {
      busyPortrait=true;model=isProp?objectModel(subject,cache):animal(subject,cache);temp.add(model);
      const bound=new THREE.Box3().setFromObject(model),center=bound.getCenter(new THREE.Vector3());
      const cam=new THREE.OrthographicCamera(-1.5,1.5,1.5,-1.5,.1,30);cam.position.copy(center).add(new THREE.Vector3(3,2.1,5));cam.lookAt(center);cam.updateMatrixWorld(true);
      let fit=0;for(const x of [bound.min.x,bound.max.x])for(const y of [bound.min.y,bound.max.y])for(const z of [bound.min.z,bound.max.z]){const p=new THREE.Vector3(x,y,z).applyMatrix4(cam.matrixWorldInverse);fit=Math.max(fit,Math.abs(p.x),Math.abs(p.y));}fit*=1.18;cam.left=-fit;cam.right=fit;cam.top=fit;cam.bottom=-fit;cam.updateProjectionMatrix();
      renderer.setPixelRatio(1);renderer.setSize(160,160,false);renderer.render(temp,cam);
      const data=renderer.domElement.toDataURL('image/webp',.86);portraitCache.set(id,data);return data;
    }catch(e){console.warn('Kindred Habitats portrait unavailable:',e?.message);return null;}
    finally {model?.traverse(o=>{if(o.isInstancedMesh)o.dispose();});for(const m of cache.values())m.dispose();temp.clear();busyPortrait=false;resize();if(ready&&!contextLost&&alive&&!state.paused&&!suspended&&!document.hidden){renderer.render(scene,camera);publishRenderMetrics();}}
  }
  function metrics() {
    return {ready,contextLost,paused:state.paused||suspended,disposed:!alive,revision:THREE?.REVISION || null,drawCalls:renderer?.info.render.calls||0,triangles:renderer?.info.render.triangles||0,geometries:renderer?.info.memory.geometries||0,textures:renderer?.info.memory.textures||0,materials:materials.size,visiblePets:actors.length,portraitCache:portraitCache.size,pixelRatio:renderer?.getPixelRatio()||0,width,height,animationActive:!!frame};
  }
  function dispose() {
    if(!alive)return;alive=false;ready=false;cancelAnimationFrame(frame);frame=0;observer?.disconnect();
    document.removeEventListener('visibilitychange',visibility);window.removeEventListener('pagehide',pagehide);window.removeEventListener('pageshow',pageshow);media.removeEventListener('change',visibility);
    if(renderer){renderer.domElement.removeEventListener('webglcontextlost',lost);renderer.domElement.removeEventListener('webglcontextrestored',restored);dropWorld();box?.dispose();renderer.renderLists.dispose();renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();}
    portraitCache.clear();status.remove();actors=[];scene?.clear();
  }
  return {update,pulse,metrics,dispose,renderPortrait:species=>snapshot(species),portrait:species=>snapshot(species),propImage:id=>snapshot(id,true)};
}
