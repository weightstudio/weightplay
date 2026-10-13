(()=>{
  "use strict";

  const GAME_ID="animal-cratebound";
  if(document.body?.dataset.wpGameId!==GAME_ID)return;
  if(document.documentElement.dataset.wpCrateboundInterface7Compat==="true")return;
  document.documentElement.dataset.wpCrateboundInterface7Compat="true";

  const currentScript=document.currentScript;
  if(!document.querySelector('link[data-wp-cratebound-interface7-corrections]')){
    const corrections=document.createElement('link');
    corrections.rel='stylesheet';
    corrections.href=new URL('interface-7-corrections.css?v=20261013-sky-ark1',currentScript?.src||document.baseURI).href;
    corrections.dataset.wpCrateboundInterface7Corrections='true';
    document.head.append(corrections);
  }
  if(!document.querySelector('link[data-wp-cratebound-interface7]')){
    const link=document.createElement("link");
    link.rel="stylesheet";
    link.href=new URL("interface-7-cleanup.css?v=20260923-cratebound-interface7-cleanup1",currentScript?.src||location.href).href;
    link.dataset.wpCrateboundInterface7="true";
    document.head.append(link);
  }

  const main=document.getElementById("mainScreen");
  const stage=document.getElementById("stageScreen");
  const battle=document.getElementById("battleScreen");
  const poster=document.getElementById("poster");
  const summary=document.getElementById("pitch");
  const progress=document.getElementById("mainProgress");
  const start=document.getElementById("start");
  const stageRail=document.getElementById("stageRail");
  const stageHint=document.getElementById("stageHint");
  const stageTab=document.getElementById("stageMapTab");
  const result=document.getElementById("resultModal");
  const resultActions=result?.querySelector(".modal-actions");
  const stagesAction=document.getElementById("resultStage");
  const nextAction=document.getElementById("next");
  const replayAction=document.getElementById("retry");

  if(main)main.dataset.screen="main";
  if(stage)stage.dataset.screen="stage";
  if(battle)battle.dataset.screen="battle";
  poster?.setAttribute("data-wp-frame-poster","");
  summary?.classList.add("main-summary");
  progress?.setAttribute("data-wp-main-progress","");
  start?.setAttribute("data-wp-main-start","");
  if(stageRail&&!stageRail.dataset.wpStageV6Total)stageRail.dataset.wpStageV6Total="30";
  if(stageHint){
    stageHint.hidden=true;
    stageHint.setAttribute("aria-hidden","true");
  }

  const normalizeLocale=()=>{
    const raw=window.WonderI18n?.actualLocale?.()||window.WonderI18n?.locale?.()||document.documentElement.lang||"en";
    if(/^zh-(tw|hant)/i.test(raw))return"zh-Hant";
    if(/^zh/i.test(raw))return"zh-Hans";
    if(/^pt/i.test(raw))return"pt-BR";
    return raw.split("-")[0];
  };
  const stagesCopy={
    en:"Stages","zh-Hant":"關卡","zh-Hans":"关卡",ja:"ステージ",ko:"스테이지",es:"Niveles","pt-BR":"Fases",fr:"Niveaux",de:"Level",it:"Livelli",ru:"Уровни",hi:"स्तर",ar:"المراحل"
  };
  const syncStageTabCopy=()=>{
    if(!stageTab)return;
    const locale=normalizeLocale();
    stageTab.textContent=stagesCopy[locale]||stagesCopy.en;
    stageTab.setAttribute("aria-label",stagesCopy[locale]||stagesCopy.en);
  };
  syncStageTabCopy();
  window.addEventListener("wonder:locale-change",syncStageTabCopy);
  document.getElementById("localeSelect")?.addEventListener("change",()=>queueMicrotask(syncStageTabCopy));

  if(result){
    result.dataset.wpBattleSubstate="result";
    result.removeAttribute("data-screen");
  }
  if(resultActions&&stagesAction&&nextAction&&replayAction){
    resultActions.append(stagesAction,nextAction,replayAction);
  }

  const clearReservedNext=()=>{
    if(!nextAction||nextAction.dataset.wpReservedResultSlot!=="true")return;
    nextAction.dataset.wpReservedResultSlot="false";
    nextAction.disabled=false;
    nextAction.removeAttribute("aria-disabled");
    nextAction.tabIndex=0;
  };
  const reserveNextSlot=()=>{
    if(!nextAction)return;
    nextAction.hidden=false;
    nextAction.disabled=true;
    nextAction.dataset.wpReservedResultSlot="true";
    nextAction.setAttribute("aria-disabled","true");
    nextAction.tabIndex=-1;
  };
  const syncResultActions=()=>{
    if(!result||result.hidden||!nextAction)return;
    if(nextAction.hidden)reserveNextSlot();
    else clearReservedNext();
  };
  if(result){
    new MutationObserver(syncResultActions).observe(result,{attributes:true,attributeFilter:["hidden"]});
    syncResultActions();
  }

  const remountSharedFrame=()=>window.WeightPlayScreenFrame?.autoMountDocument?.();
  if(document.readyState==="complete")remountSharedFrame();
  else window.addEventListener("load",remountSharedFrame,{once:true});
})();

/* Sky-ark presentation. The trilogy engine remains the only rules/save owner. */
(async () => {
  'use strict';
  if (document.body?.dataset.wpGameId !== 'animal-cratebound') return;
  const scriptURL = document.currentScript?.src || new URL('interface-7-compat.js', location.href).href;
  const arena = document.getElementById('arena');
  const wrap = document.getElementById('arenaWrap');
  const battle = document.getElementById('battleScreen');
  if (!arena || !wrap || !battle) return;
  const read = () => window.__blockTrilogyTest?.getState?.();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const modalOpen = () => ['helpModal', 'leaveModal', 'resultModal'].some(id => !document.getElementById(id)?.hidden);
  let THREE;
  try { THREE = await import(new URL('../animal-skyspire-drop/vendor/three/three.module.min.js', scriptURL)); }
  catch { wrap.dataset.arkRenderer = 'fallback'; return; }
  let disposed = false, frame = 0, previousTime = 0, currentEngine = null, previousMoves = 0;
  let renderer, scene, camera, world, hero, cargo = [], docks = [], gate = null, switches = [];
  let poseFrom = null, poseTo = null, motionRef = null, movedAt = 0, lastDocked = new Set();
  let effectTime = 0, facing = 0, lastFacing = 0, turn = 1, lastInputAt = 0;
  let previousPulls = 0, magnetic = null, dockPulses = [], routeMarker = null;
  let moveKind='idle', skidEmitted=false;
  let routeTarget = null, routeSteps = 0, routeWait = false, pointer = null, lastSize = '';
  const geometry = new Map(), materials = new Map(), stageResources = new Set(), particles = [];
  const cube = () => {
    if (!geometry.has('cube')) geometry.set('cube', new THREE.BoxGeometry(1, 1, 1));
    return geometry.get('cube');
  };
  const mat = (color, metal = 0, glow = false) => {
    const key = `${color}/${metal}/${glow}`;
    if (!materials.has(key)) materials.set(key, new THREE.MeshStandardMaterial({ color, roughness: metal ? .36 : .78, metalness: metal, emissive: glow ? color : 0, emissiveIntensity: glow ? .7 : 0 }));
    return materials.get(key);
  };
  const block = (parent, size, position, color, metal = 0, glow = false) => {
    const m = new THREE.Mesh(cube(), mat(color, metal, glow));
    m.scale.set(...size); m.position.set(...position); m.castShadow = true; m.receiveShadow = true;
    parent.add(m); return m;
  };
  const ring = (parent, radius, color, y = .05) => {
    const geo = new THREE.TorusGeometry(radius, .018, 4, 32); stageResources.add(geo);
    const m = new THREE.Mesh(geo, mat(color, .35, true)); m.rotation.x = Math.PI / 2; m.position.y = y; parent.add(m); return m;
  };
  const sound = window.WeightPlayAudio?.createScope?.();
  const cue = id => sound?.play(id, { volume: .65 });
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch { sound?.dispose(); wrap.dataset.arkRenderer = 'fallback'; return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.02;
  renderer.domElement.className = 'ark-world'; renderer.domElement.setAttribute('aria-hidden', 'true');
  wrap.append(renderer.domElement);
  wrap.dataset.arkRenderer = 'three';
  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-5, 5, 5, -5, .1, 80);
  camera.position.set(0, 12, 11); camera.lookAt(0, 0, 0);
  scene.add(new THREE.HemisphereLight(0xc8efff, 0x5c4d65, 1.8));
  const sun = new THREE.DirectionalLight(0xffe2ab, 2.8); sun.position.set(-5, 12, 7);
  sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7, near: 1, far: 35 });
  sun.shadow.bias = -.0006; sun.shadow.normalBias = .025; scene.add(sun);
  const rim = new THREE.DirectionalLight(0x83dff5, 1.5); rim.position.set(4, 4, -6); scene.add(rim);
  const raycaster = new THREE.Raycaster(), ndc = new THREE.Vector2(), hit = new THREE.Vector3();
  const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const palette = [0x4d91aa, 0x71becb, 0x557eaa, 0x657fba, 0x8773a9, 0x547fa5];
  const point = (p, size) => [p.x - (size - 1) / 2, p.y - (size - 1) / 2];
  const snapshotPose = e => ({ player: { ...e.player }, boxes: e.boxes.map(b => ({ ...b })) });
  const place = (node, p, size, y = 0) => { const [x, z] = point(p, size); node.position.set(x, y, z); };
  function makeRux() {
    const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
    const gray = 0x9ba7b2, dark = 0x586c7b, gold = 0xf0b745, teal = 0x208f94;
    block(body, [.47, .44, .34], [0, .48, 0], gray);
    block(body, [.58, .43, .43], [0, .86, -.04], gray);
    block(body, [.45, .22, .23], [0, .76, .24], 0xb9c4c7);
    for (const side of [-1, 1]) {
      block(body, [.15, .21, .14], [side * .22, 1.12, -.1], gray);
      block(body, [.085, .12, .025], [side * .22, 1.13, -.019], 0xd59796);
      block(body, [.18, .14, .08], [side * .15, 1.015, .2], gold, .65);
      block(body, [.125, .075, .028], [side * .15, 1.024, .25], 0x4bdddd, .4);
      block(body, [.065, .085, .025], [side * .18, .887, .18], 0x132b3a);
      block(body, [.027, .034, .015], [side * .17, .905, .2], 0xffffff);
      block(body, [.05, .04, .02], [side * .12, .77, .362], dark);
      const leg = new THREE.Group(); leg.position.set(side * .155, .23, 0); body.add(leg);
      block(leg, [.2, .26, .2], [0, 0, 0], dark);
      block(leg, [.23, .12, .27], [0, -.13, .055], 0x475563);
      block(leg, [.2, .045, .04], [0, -.12, .21], gold, .4);
      root.userData[side === -1 ? 'leftLeg' : 'rightLeg'] = leg;
      const arm = new THREE.Group(); arm.position.set(side * .31, .59, .015); body.add(arm);
      block(arm, [.16, .3, .18], [0, -.06, 0], gray);
      block(arm, [.19, .09, .22], [0, -.15, .025], 0x805237);
      block(arm, [.17, .1, .2], [0, .1, 0], teal);
      block(arm, [.2, .035, .22], [0, .06, 0], gold, .4);
      root.userData[side === -1 ? 'leftArm' : 'rightArm'] = arm;
    }
    block(body, [.54, .085, .41], [0, .63, 0], teal);
    block(body, [.12, .22, .05], [.13, .49, .215], teal);
    block(body, [.49, .085, .37], [0, .32, 0], 0x815139);
    block(body, [.115, .095, .04], [0, .32, .215], gold, .65);
    block(body, [.16, .18, .08], [-.16, .28, .225], 0x724931);
    // Authored eight-tooth gear horn: the defining Rux silhouette.
    const horn = new THREE.Group(); horn.position.set(0, .865, .385); body.add(horn);
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4;
      const tooth = block(horn, [.068, .072, .06], [Math.cos(a) * .095, Math.sin(a) * .095, 0], gold, .7);
      tooth.rotation.z = a;
    }
    block(horn, [.125, .125, .08], [0, 0, 0], gold, .7);
    block(horn, [.055, .055, .018], [0, 0, .05], 0x795228);
    block(body, [.34, .42, .21], [0, .48, -.29], teal, .2);
    block(body, [.36, .055, .23], [0, .61, -.29], gold, .55);
    block(body, [.18, .18, .025], [0, .46, -.408], 0xffa531, .1, true);
    block(body, [.11, .25, .11], [.11, .8, -.3], 0x655447, .4);
    block(body, [.16, .045, .16], [.11, .93, -.3], gold, .6);
    root.userData.body = body;
    root.rotation.y = Math.PI / 2;
    return root;
  }
  function rune(parent, y, color, scale = 1) {
    const r = new THREE.Group(); r.position.y = y; r.scale.setScalar(scale); parent.add(r);
    for (const side of [-1, 1]) {
      for (const z of [-1, 1]) {
        const b = block(r, [.035, .018, .24], [side * .08, 0, z * .08], color, .15, true);
        b.rotation.y = -side * z * Math.PI / 4;
      }
    }
    block(r, [.026, .02, .36], [0, .001, 0], color, .1, true);
    return r;
  }
  function makeCargo(linked) {
    const root = new THREE.Group();
    block(root, [.66, .58, .66], [0, .32, 0], 0x98704b);
    for (let i = -1; i <= 1; i++) {
      block(root, [.18, .53, .012], [i * .19, .32, .339], i % 2 ? 0x7b573d : 0xad8052);
      block(root, [.18, .012, .54], [i * .19, .618, 0], i % 2 ? 0x8c613d : 0xaf8254);
    }
    for (const x of [-.32, .32]) for (const z of [-.32, .32]) {
      block(root, [.085, .66, .085], [x, .34, z], 0xddae60, .65);
      block(root, [.09, .025, .09], [x, .684, z], 0xffd68a, .55);
    }
    for (const y of [.065, .6]) {
      block(root, [.72, .09, .72], [0, y, 0], 0xc39446, .6);
      block(root, [.6, .092, .6], [0, y + .005, 0], 0x946c43);
    }
    const plate = block(root, [.4, .36, .024], [0, .34, .363], 0x164e5a, .35);
    const sign = rune(root, .67, linked ? 0xea97ff : 0x78ffe0, 1.05);
    const front = rune(root, 0, linked ? 0xea97ff : 0x78ffe0, .88);
    front.rotation.x = Math.PI / 2; front.position.set(0, .35, .382);
    root.userData = { plate, sign, front, linked }; return root;
  }
  function clearStage() {
    if (world) scene.remove(world);
    for (const resource of stageResources) resource.dispose(); stageResources.clear();
    particles.length = 0; cargo = []; docks = []; switches = []; gate = null; dockPulses=[]; magnetic=null; routeMarker=null;
    routeTarget = null; routeWait = false; routeSteps = 0; motionRef = null; moveKind='idle'; skidEmitted=false; lastDocked.clear();
    renderer.renderLists.dispose();
  }
  function batchDeck() {
    const groups=new Map();
    for(const mesh of [...world.children]){
      if(!mesh.isMesh)continue;
      mesh.updateMatrix();
      if(!groups.has(mesh.material))groups.set(mesh.material,[]);
      groups.get(mesh.material).push(mesh.matrix.clone());world.remove(mesh);
    }
    for(const [material,matrices] of groups){
      const batch=new THREE.InstancedMesh(cube(),material,matrices.length);
      matrices.forEach((matrix,i)=>batch.setMatrixAt(i,matrix));
      batch.castShadow=true;batch.receiveShadow=true;world.add(batch);stageResources.add(batch);
    }
  }
  function build(e, stage) {
    clearStage(); currentEngine = e; previousMoves = e.moves; previousPulls=e.pulls;
    poseFrom = poseTo = snapshotPose(e); world = new THREE.Group(); scene.add(world);
    const size = e.size, half = (size - 1) / 2, chapter = Math.floor((stage - 1) / 5);
    wrap.dataset.arkChapter = String(chapter);
    block(world, [size + .45, .42, size + .45], [0, -.35, 0], 0x18394d, .4);
    block(world, [size + .18, .08, size + .18], [0, -.1, 0], 0xba9053, .5);
    // Structural keel and brass trim make the playfield an airborne cargo deck.
    block(world, [size - .5, .28, size - .5], [0, -.7, 0], 0x315568, .4);
    // Small distant freight craft establish the ark's setting, away from the puzzle.
    for(const [x,z,scale] of [[-2.5,-size-.2,.65],[3.1,-size+1,.4]]){
      const ship=new THREE.Group();ship.position.set(x,-.8,z);ship.scale.setScalar(scale);world.add(ship);
      block(ship,[1.5,.25,.55],[0,0,0],0x5b7380,.1);
      block(ship,[1.05,.19,.65],[0,.2,0],0x9b885f,.1);
      block(ship,[.055,1.15,.055],[0,.8,0],0xab986d,.1);
      block(ship,[.82,.75,.035],[.2,1,0],0xc0d5ce);
      block(ship,[.1,.75,.042],[.1,1,.01],0x6a9baa);
      block(ship,[.28,.3,.32],[-.4,.4,0],0x698c91);
    }
    for(const [x,z] of [[-3.3,-5.1],[3.7,5.1]]){
      const cloud=new THREE.Group();cloud.position.set(x,-1.7,z);world.add(cloud);
      for(let i=0;i<4;i++)block(cloud,[.9+i%2*.5,.2+i%2*.15,.5],[(i-1.5)*.65,i%2*.06,i%2*.12],0xc3d7d3);
    }
    // Stern machinery and mooring posts sit outside the traversable squares.
    for (const side of [-1,1]) {
      const mast = new THREE.Group(); mast.position.set(side*(half+.05),0,-half); world.add(mast);
      block(mast,[.12,1.25,.12],[0,.66,0],0x8d744f,.65);
      block(mast,[.23,.12,.23],[0,1.31,0],0xefc777,.55);
      block(mast,[.13,.15,.13],[0,1.44,0],0x9deee6,.2,true);
      block(mast,[.38,.5,.045],[-side*.2,1.05,.03],0x246f85);
      block(mast,[.06,.5,.052],[-side*.12,1.05,.033],0xc9b885,.2);
      block(world,[.12,.12,size-1],[side*(half+.42),.06,0],0xc09350,.6);
      for(const z of [-half+1,half-1])block(world,[.12,.47,.12],[side*(half+.42),-.08,z],0x775f47,.5);
    }
    for (const x of [-1, 1]) for (const z of [-1, 1]) {
      block(world, [.6, .5, .7], [x * (half + .1), -.8, z * (half - .3)], 0x866642, .6);
      block(world, [.38, .12, .43], [x * (half + .1), -1.09, z * (half - .3)], 0x59dedb, .3, true);
    }
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      const edge = x === 0 || y === 0 || x === size - 1 || y === size - 1;
      const wall = e.walls.some(w => w.x === x && w.y === y);
      block(world, [.965, .12, .965], [x - half, -.015, y - half], edge ? 0x46697a : (x + y) % 2 ? 0x896f50 : 0xa38960, .12);
      if (edge || wall) {
        const height = wall ? .4 : .19;
        block(world, [.89, height, .89], [x - half, height / 2 + .06, y - half], wall ? 0x54758a : 0x294f62, .35);
        block(world, [.9, .045, .9], [x - half, height + .08, y - half], wall ? 0x94b5bd : 0x71969d, .35);
        if (edge && (x + y) % 2 === 0) block(world, [.36, .03, .035], [x - half, height + .11, y - half + .35], 0xe2b65d, .5);
      } else {
        block(world,[.012,.012,.86],[x-half+.2,.055,y-half],0x665844);
        for (const s of [-1, 1]) block(world, [.035, .012, .07], [x - half + s * .36, .055, y - half + .35], 0x617d86, .5);
      }
    }
    e.goals.forEach(p => {
      const d = new THREE.Group(); place(d, p, size); world.add(d);
      block(d, [.88, .065, .88], [0, .09, 0], 0x187f84, .55);
      for (const s of [-1, 1]) {
        block(d, [.9, .035, .035], [0, .14, s * .43], 0x69f4de, .2, true);
        block(d, [.035, .035, .9], [s * .43, .14, 0], 0x69f4de, .2, true);
      }
      rune(d, .143, 0xa2ffe8, 1.7); docks.push(d);
      const pulse=ring(d,.49,0x86ffe1,.16);pulse.visible=false;dockPulses.push({mesh:pulse,age:1});
    });
    e.ice.forEach(p => {
      const ice = new THREE.Group(); place(ice, p, size); world.add(ice);
      block(ice, [.89, .06, .89], [0, .09, 0], 0x88d9ef, .5);
      for (let i = -1; i <= 1; i++) { const line = block(ice, [.035, .014, .6], [i * .2, .13, 0], 0xe0faff, .1, true); line.rotation.y = .35; }
    });
    e.belts.forEach(p => {
      const belt = new THREE.Group(); place(belt, p, size); belt.rotation.y = Math.atan2(p.dx, p.dy); world.add(belt);
      block(belt, [.8, .07, .85], [0, .08, 0], 0x4d596c, .5);
      for (let i = -1; i <= 1; i++) for (const s of [-1, 1]) {
        const b = block(belt, [.035, .018, .23], [s * .08, .13, i * .22], 0xffdb83, .3, true); b.rotation.y = -s * Math.PI / 4;
      }
    });
    e.switches.forEach(p => {
      const sw = new THREE.Group(); place(sw, p, size); world.add(sw);
      block(sw, [.62, .12, .62], [0, .12, 0], 0x6b587a, .4);
      const cap = block(sw, [.42, .05, .42], [0, .205, 0], 0xc995e8, .3, true);
      switches.push(cap);
    });
    if (e.gate) {
      const root = new THREE.Group(); place(root, e.gate, size); world.add(root);
      for (const side of [-1, 1]) block(root, [.12, .55, .16], [side * .4, .29, 0], 0xc09b56, .5);
      gate = block(root, [.75, .5, .12], [0, .3, 0], 0xeac372, .5);
      for (const x of [-.25, 0, .25]) block(gate, [.06, .65, .1], [x, 0, .7], 0xffde8b, .2, true);
    }
    batchDeck();
    e.boxes.forEach(b => { const c = makeCargo(b.linked); place(c, b, size, .075); world.add(c); cargo.push(c); });
    hero = makeRux(); place(hero, e.player, size, .065); world.add(hero);
    hero.scale.setScalar(1.12);
    magnetic=block(world,[.05,.05,1],[0,.3,0],0xbad9ff,.1,true);magnetic.visible=false;magnetic.castShadow=false;
    routeMarker=new THREE.Group();world.add(routeMarker);ring(routeMarker,.22,0xffe8aa,.1);routeMarker.visible=false;
    facing = lastFacing = Math.PI / 2; hero.rotation.y = facing;
    lastDocked = new Set(e.boxes.flatMap((b, i) => e.goals.some(g => g.x === b.x && g.y === b.y) ? [i] : []));
    wrap.style.setProperty('--ark-sky', `#${palette[chapter].toString(16)}`);
    lastSize = ''; fit(); effectTime = 0;
    if (!reduced.matches) renderer.domElement.animate([{ opacity: .15 }, { opacity: 1 }], { duration: 260 });
  }
  function fit() {
    const r = wrap.getBoundingClientRect(), key = `${r.width}/${r.height}`;
    if (key === lastSize || r.width < 1 || r.height < 1) return;
    lastSize = key; renderer.setSize(Math.round(r.width), Math.round(r.height), false);
    const aspect = r.width / r.height, size = currentEngine?.size || 7;
    const height = Math.max(size * .96 + 1.1, (size + 1.2) / aspect);
    camera.left = -height * aspect / 2; camera.right = height * aspect / 2;
    camera.top = height / 2; camera.bottom = -height / 2; camera.updateProjectionMatrix();
  }
  function burst(p, color, count = 14) {
    if (reduced.matches) return;
    for (let i = 0; i < count && particles.length < 48; i++) {
      const a = i * 2.39996, mesh = block(world, [.055, .055, .055], [p.x, .2, p.z], color, .2, true);
      mesh.castShadow = false;
      particles.push({ mesh, age: 0, life: .48, vx: Math.cos(a) * (.8 + i % 3 * .2), vz: Math.sin(a) * (.8 + i % 3 * .2), vy: 1.1 + i % 4 * .2 });
    }
  }
  function inputFeedback(ok) {
    if (reduced.matches) { wrap.dataset.arkInput = ok ? 'accepted' : 'blocked'; return; }
    const target = ok ? document.getElementById('statA') : renderer.domElement;
    target?.animate(ok ? [{ opacity: .5 }, { opacity: 1 }] : [{ filter: 'none' }, { filter: 'sepia(.3) brightness(1.15)' }, { filter: 'none' }], { duration: 180 });
  }
  function advanceRoute(e) {
    if (!routeTarget || routeWait || e.motion || modalOpen()) return;
    if(document.getElementById('pullMode')?.classList.contains('mode-active')){routeTarget=null;return;}
    if (++routeSteps > e.size * e.size || (e.player.x === routeTarget.x && e.player.y === routeTarget.y)) { routeTarget = null; return; }
    const queue = [{ ...e.player, path: [] }], seen = new Set([`${e.player.x},${e.player.y}`]);
    let path = null;
    while (queue.length) {
      const p = queue.shift();
      if (p.x === routeTarget.x && p.y === routeTarget.y) { path = p.path; break; }
      for (const [dir, dx, dy] of [['up',0,-1],['right',1,0],['down',0,1],['left',-1,0]]) {
        const x=p.x+dx, y=p.y+dy, k=`${x},${y}`;
        if (seen.has(k) || x<=0 || y<=0 || x>=e.size-1 || y>=e.size-1 || e.walls.some(w=>w.x===x&&w.y===y) || e.boxes.some(b=>b.x===x&&b.y===y) || e.gate && !e.gate.open && e.gate.x===x && e.gate.y===y) continue;
        seen.add(k); queue.push({x,y,path:[...p.path,dir]});
      }
    }
    if (!path?.length) { routeTarget=null; inputFeedback(false); return; }
    routeWait = true;
    document.querySelector(`#battleControls [data-dir="${path[0]}"]`)?.click();
    routeWait = false;
  }
  function animate(now) {
    frame = 0;
    if (disposed || document.hidden || battle.hidden || wrap.dataset.arkRenderer !== 'three') return;
    const state = read(), e = state?.engine;
    if (!e || e.kind !== 'crate') return;
    if (currentEngine !== e || !world || (e.moves === 0 && previousMoves > 0)) build(e, state.selected);
    const dt = Math.min((now - previousTime) / 1000 || .016, .05); previousTime = now;
    fit();
    const paused = modalOpen();
    const settled = !document.getElementById('resultModal').hidden;
    const effectsPaused = paused && !settled;
    if (paused) { routeTarget=null; if(effectsPaused)sound?.stop(); }
    if (!paused) effectTime += dt;
    if (e.motion && motionRef !== e.motion) {
      motionRef = e.motion; poseFrom=e.motion.from; poseTo=e.motion.to; movedAt=now;
      const dx=poseTo.player.x-poseFrom.player.x, dz=poseTo.player.y-poseFrom.player.y;
      const pushed = poseTo.boxes.some((b,i)=>b.x!==poseFrom.boxes[i]?.x || b.y!==poseFrom.boxes[i]?.y);
      const pulling = e.pulls < previousPulls;
      moveKind = pulling ? 'pull' : pushed ? 'push' : 'walk'; skidEmitted=false;
      lastFacing=hero.rotation.y; facing=Math.atan2(pulling?-dx:dx,pulling?-dz:dz); turn=0;
      if(pushed&&!pulling)burst(hero.position,0xe7c488,5);
      cue(e.moves < previousMoves ? 'board.undo' : pushed ? 'board.move' : 'movement.step');
      inputFeedback(true);
    }
    if (!e.motion) { poseTo=snapshotPose(e); poseFrom=poseTo; motionRef=null; moveKind='idle'; }
    const t=e.motion ? Math.max(0,Math.min(1, e.motion.elapsed / e.motion.duration)) : 1;
    const effort=Math.sin(t*Math.PI), working=moveKind==='push'||moveKind==='pull';
    const eased=t*t*(3-2*t), hop=reduced.matches ? 0 : Math.abs(Math.sin(t*Math.PI*2))*(working?.025:.055);
    const mix=(a,b)=>a+(b-a)*eased;
    const shown={x:mix(poseFrom.player.x,poseTo.player.x),y:mix(poseFrom.player.y,poseTo.player.y)};
    place(hero,shown,e.size,.065+hop);
    if (!paused) turn=Math.min(1,turn+dt*13);
    const delta=Math.atan2(Math.sin(facing-lastFacing),Math.cos(facing-lastFacing));
    hero.rotation.y=reduced.matches?facing:lastFacing+delta*turn;
    const stride=reduced.matches?0:Math.sin(t*Math.PI*2)*(working?.35:.48);
    hero.userData.leftLeg.rotation.x=stride; hero.userData.rightLeg.rotation.x=-stride;
    hero.userData.leftArm.rotation.x=reduced.matches?0:working?-1.05*effort:-stride*.7;
    hero.userData.rightArm.rotation.x=reduced.matches?0:working?-1.05*effort:stride*.7;
    hero.userData.body.rotation.x=reduced.matches?0:(moveKind==='pull'?-.16:working?.17:.035)*effort;
    hero.userData.body.rotation.z=reduced.matches||working?0:stride*.075;
    cargo.forEach((c,i)=>{
      const to=poseTo.boxes[i],from=poseFrom.boxes[i]||to;
      const p={x:mix(from.x,to.x),y:mix(from.y,to.y)}; place(c,p,e.size,.075);
      const docked=e.goals.some(g=>Math.abs(g.x-p.x)<.06&&Math.abs(g.y-p.y)<.06);
      c.userData.plate.material=mat(docked?0x39d9b5:0x164e5a,.35,docked);
      if (docked&&!lastDocked.has(i)) {
        burst(c.position,0x99ffe1); cue('puzzle.match'); lastDocked.add(i);
        if(!reduced.matches)document.getElementById('statB')?.animate([{transform:'scale(1)'},{transform:'scale(1.22)',color:'#a0ffe1'},{transform:'scale(1)'}],{duration:320});
        const n=e.goals.findIndex(g=>Math.abs(g.x-p.x)<.06&&Math.abs(g.y-p.y)<.06);
        if(dockPulses[n])dockPulses[n].age=0;
      }
      if (!docked) lastDocked.delete(i);
      const moving=Math.abs(from.x-to.x)+Math.abs(from.y-to.y)>0;
      c.rotation.z = reduced.matches || !moving ? 0 : Math.sin(t*Math.PI)*.025*(to.x-from.x);
      c.rotation.x = reduced.matches || !moving ? 0 : -effort*.025*(to.y-from.y);
      if(moving&&!skidEmitted&&t>.35){
        const icy=e.ice.some(cell=>cell.x===to.x&&cell.y===to.y||cell.x===from.x&&cell.y===from.y)||Math.abs(to.x-from.x)+Math.abs(to.y-from.y)>1;
        burst(c.position,icy?0xc4f8ff:0xe7c488,icy?8:4);
      }
    });
    if(t>.35)skidEmitted=true;
    magnetic.visible=Boolean(e.motion&&e.pulls<previousPulls&&!reduced.matches);
    if(magnetic.visible){
      const i=poseTo.boxes.findIndex((b,i)=>b.x!==poseFrom.boxes[i]?.x||b.y!==poseFrom.boxes[i]?.y);
      if(i>=0){const a=hero.position,b=cargo[i].position;magnetic.position.set((a.x+b.x)/2,.35,(a.z+b.z)/2);magnetic.scale.z=Math.hypot(a.x-b.x,a.z-b.z);magnetic.rotation.y=Math.atan2(b.x-a.x,b.z-a.z);}
    }
    if(!e.motion)previousPulls=e.pulls;
    for(const pulse of dockPulses){
      if(!effectsPaused)pulse.age+=dt;
      pulse.mesh.visible=!reduced.matches&&pulse.age<.5;
      pulse.mesh.scale.setScalar(1+pulse.age*.8);
    }
    routeMarker.visible=Boolean(routeTarget);
    if(routeTarget)place(routeMarker,routeTarget,e.size);
    if (gate) {
      gate.scale.y += ((e.gate.open ? .02 : .5)-gate.scale.y)*Math.min(1,dt*15);
      gate.position.y = e.gate.open ? .06 : .3;
      switches.forEach(sw=>{sw.material=mat(e.gate.open?0x71ffd7:0xc995e8,.3,true);});
    }
    for (let i=particles.length-1;i>=0;i--) {
      const p=particles[i]; if(!effectsPaused)p.age+=dt;
      if(p.age>=p.life){world.remove(p.mesh);particles.splice(i,1);continue;}
      if(!effectsPaused){p.mesh.position.x+=p.vx*dt;p.mesh.position.z+=p.vz*dt;p.mesh.position.y+=p.vy*dt;p.vy-=4*dt;p.mesh.rotation.x+=dt*3;p.mesh.scale.setScalar(.055*(1-p.age/p.life));}
    }
    previousMoves=e.moves;
    if(!paused)advanceRoute(e);
    renderer.render(scene,camera);
    frame=requestAnimationFrame(animate);
  }
  function sync() {
    if(disposed)return;
    if(battle.hidden||document.hidden){cancelAnimationFrame(frame);frame=0;routeTarget=null;sound?.stop();return;}
    if(!frame){previousTime=performance.now();frame=requestAnimationFrame(animate);}
  }
  function clickDirection(dx,dy){
    const dir=dx>0?'right':dx<0?'left':dy>0?'down':'up';
    document.querySelector(`#battleControls [data-dir="${dir}"]`)?.click();
  }
  function pointerDown(ev){
    if(modalOpen()||battle.hidden)return;
    routeTarget=null;routeSteps=0;lastInputAt=performance.now();
    pointer={x:ev.clientX,y:ev.clientY,id:ev.pointerId};
    renderer.domElement.setPointerCapture(ev.pointerId);ev.preventDefault();
  }
  function pointerUp(ev){
    if(!pointer||pointer.id!==ev.pointerId)return;
    const start=pointer;pointer=null;
    if(renderer.domElement.hasPointerCapture(ev.pointerId))renderer.domElement.releasePointerCapture(ev.pointerId);
    if(modalOpen())return;
    const dx=ev.clientX-start.x,dy=ev.clientY-start.y;
    if(Math.hypot(dx,dy)>22){clickDirection(Math.abs(dx)>Math.abs(dy)?Math.sign(dx):0,Math.abs(dy)>=Math.abs(dx)?Math.sign(dy):0);return;}
    const state=read(),e=state?.engine;if(!e||e.motion)return;
    const r=renderer.domElement.getBoundingClientRect();ndc.set((ev.clientX-r.left)/r.width*2-1,-(ev.clientY-r.top)/r.height*2+1);
    raycaster.setFromCamera(ndc,camera);if(!raycaster.ray.intersectPlane(groundPlane,hit))return;
    const picked=raycaster.intersectObjects(cargo,true)[0];
    let boxIndex=-1;
    if(picked){let node=picked.object;while(node.parent&&node.parent!==world)node=node.parent;boxIndex=cargo.indexOf(node);}
    const x=boxIndex>=0?e.boxes[boxIndex].x:Math.round(hit.x+(e.size-1)/2),y=boxIndex>=0?e.boxes[boxIndex].y:Math.round(hit.z+(e.size-1)/2);
    const tx=x-e.player.x,ty=y-e.player.y;
    if(Math.abs(tx)+Math.abs(ty)===1){clickDirection(tx,ty);return;}
    routeTarget={x,y};routeSteps=0;
  }
  const abort=new AbortController(),on=(node,type,fn,options={})=>node.addEventListener(type,fn,{...options,signal:abort.signal});
  on(renderer.domElement,'pointerdown',pointerDown);on(renderer.domElement,'pointerup',pointerUp);
  on(renderer.domElement,'pointercancel',()=>{pointer=null;routeTarget=null;});
  on(renderer.domElement,'lostpointercapture',()=>{pointer=null;});
  on(document,'keydown',()=>{routeTarget=null;lastInputAt=performance.now();}, {capture:true});
  on(document.getElementById('battleControls'),'pointerdown',()=>{routeTarget=null;lastInputAt=performance.now();}, {capture:true});
  on(document,'visibilitychange',sync);on(window,'resize',()=>{lastSize='';sync();});
  const observer=new MutationObserver(sync);observer.observe(battle,{attributes:true,attributeFilter:['hidden']});
  const feedbackObserver=new MutationObserver(()=>{if(performance.now()-lastInputAt<250 && !read()?.engine?.motion)inputFeedback(false);});
  feedbackObserver.observe(document.getElementById('feedback'),{childList:true,subtree:true,characterData:true});
  const sizeObserver=new ResizeObserver(()=>{lastSize='';sync();});sizeObserver.observe(wrap);
  window.WeightPlayCrateboundPresentation=Object.freeze({
    diagnostics:()=>({renderer:wrap.dataset.arkRenderer,drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures,effects:particles.length,loopActive:Boolean(frame),routeActive:Boolean(routeTarget),materials:materials.size,engineRevision:THREE.REVISION,motion:moveKind,bodyLean:hero?.userData.body.rotation.x||0,leftLeg:hero?.userData.leftLeg.rotation.x||0,leftArm:hero?.userData.leftArm.rotation.x||0}),
    projectCell:(x,y)=>{const r=renderer.domElement.getBoundingClientRect(),v=new THREE.Vector3(x-((currentEngine?.size||7)-1)/2,.1,y-((currentEngine?.size||7)-1)/2).project(camera);return{x:r.left+(v.x+1)*r.width/2,y:r.top+(1-v.y)*r.height/2};}
  });
  on(renderer.domElement,'webglcontextlost',ev=>{ev.preventDefault();wrap.dataset.arkRenderer='fallback';cancelAnimationFrame(frame);frame=0;routeTarget=null;});
  on(renderer.domElement,'webglcontextrestored',()=>{wrap.dataset.arkRenderer='three';currentEngine=null;sync();});
  function dispose(){
    if(disposed)return;disposed=true;cancelAnimationFrame(frame);abort.abort();observer.disconnect();feedbackObserver.disconnect();sizeObserver.disconnect();
    sound?.dispose();clearStage();geometry.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove();wrap.dataset.arkRenderer='fallback';
  }
  on(window,'pagehide',dispose,{once:true});
  sync();
})();

/* Locale-owned play copy: existing shared translations do not cover this game. */
(() => {
  const C=window.BlockTrilogyConfig;if(C?.id!=='animal-cratebound')return;
  const root=document.body,lang=()=>window.WonderI18n?.actualLocale?.()||document.documentElement.lang;
  const zh=()=>/^zh/i.test(lang());
  const traditional=()=>!/Hans|CN/i.test(lang());
  const copies={
    'zh-Hant':{pitch:'點選空格移動，把貨箱推進發光碼頭。走錯了隨時復原，再試另一條路。',objective:'把所有貨箱送進發光碼頭',help:'點選空格可自動步行；點相鄰貨箱或滑動可推動。方向鍵／WASD 也能操作。按住 Shift 或先選「拉取」，可消耗磁力把貨箱往後拉。',win:'全部貨箱已安全入港！',chapters:['初次貨運','極地冰軌','訊號甲板','磁力港灣','連結貨箱','風暴方舟'],words:['步數','入港','磁力','拉取','復原','重來','關卡','下一關','重玩','貨運完成','全部入港'],blocked:'這條路被擋住了。試著繞到貨箱另一側。'},
    'zh-Hans':{pitch:'点选空格移动，把货箱推进发光码头。走错了随时撤销，再试另一条路。',objective:'把所有货箱送进发光码头',help:'点选空格可自动步行；点相邻货箱或滑动可推动。方向键／WASD 也能操作。按住 Shift 或先选“拉取”，可消耗磁力把货箱往后拉。',win:'全部货箱已安全入港！',chapters:['初次货运','极地冰轨','信号甲板','磁力港湾','连结货箱','风暴方舟'],words:['步数','入港','磁力','拉取','撤销','重来','关卡','下一关','重玩','货运完成','全部入港'],blocked:'这条路被挡住了。试着绕到货箱另一侧。'}
  };
  const put=(id,value)=>{const el=document.getElementById(id);if(el){el.dataset.runtimeLocalize='off';if(el.textContent!==value)el.textContent=value;}};
  function sync(){
    const state=window.__blockTrilogyTest?.getState?.();
    document.querySelectorAll('#resultModal .result-art').forEach(img=>{const src='/assets/weightplay-character-gear-horn-rhino-block-v1.webp';if(img.getAttribute('src')!==src)img.setAttribute('src',src);});
    if(!zh())return;
    const c=copies[traditional()?'zh-Hant':'zh-Hans'],w=c.words;
    C.pitch=c.pitch;C.objective=c.objective;C.help=c.help;C.win=c.win;C.chapters=c.chapters;
    C.localeCopy={...C.localeCopy,stage:`${w[6]} {n}`};
    put('pitch',c.pitch);put('objective',c.objective);put('helpText',c.help);
    if(state)put('goalValue',c.chapters[Math.floor((state.selected-1)/5)]);
    document.querySelectorAll('#battleScreen .battle-stats b').forEach((n,i)=>{if(n.textContent!==w[i])n.textContent=w[i];});
    put('undoMove',w[4]);put('restartMove',w[5]);
    if(state?.engine?.kind==='crate')put('pullMode',`${w[3]} ${state.engine.pulls}`);
    put('resultStage',w[6]);put('next',w[7]);put('retry',w[8]);
    const result=document.getElementById('resultModal');
    if(result&&!result.hidden){put('resultTitle',w[9]);put('resultText',c.win);put('resultA',`${state?.engine?.moves??0} ${w[0]}`);put('resultB',`${state?.engine?.pulls??0} ${w[2]}`);put('resultC',w[10]);}
    document.querySelectorAll('#resultModal .result-stats b,#resultModal .result-grid b').forEach((n,i)=>{const value=[w[0],w[2],traditional()?'狀態':'状态'][i];if(value&&n.textContent!==value)n.textContent=value;});
    document.querySelectorAll('#stageRail [data-stage]').forEach(card=>{
      const n=Number(card.dataset.stage),chapter=card.querySelector('small'),title=card.querySelector('strong'),status=card.querySelector('span');
      if(chapter&&chapter.textContent!==c.chapters[Math.floor((n-1)/5)])chapter.textContent=c.chapters[Math.floor((n-1)/5)];
      if(title&&title.textContent!==`${w[6]} ${n}`)title.textContent=`${w[6]} ${n}`;
      if(status){const text=status.textContent, translated=/Locked|鎖定|锁定|未解鎖|未解锁/.test(text)?(traditional()?'未解鎖':'未解锁'):/Cleared|Replay|重玩|完成/.test(text)?'已完成 · 重玩':(traditional()?'準備出發':'准备出发');if(status.textContent!==translated)status.textContent=translated;}
    });
    const feedback=document.getElementById('feedback');
    if(feedback){const text=feedback.textContent;const map={'That cargo path is blocked.':c.blocked,'That route is blocked.':c.blocked,'Move undone.':traditional()?'已復原上一步':'已撤销上一步','Nothing to undo.':traditional()?'還沒有可復原的步驟':'还没有可撤销的步骤','No magnetic pull charge remains.':traditional()?'磁力次數已用完':'磁力次数已用完','Signal gate opened.':traditional()?'訊號門已開啟':'信号门已开启','Magnetic pull used.':traditional()?'磁力拉取成功':'磁力拉取成功','Linked cargo moved together.':traditional()?'連結貨箱一起移動':'连结货箱一起移动','Linked cargo pulled together.':traditional()?'連結貨箱一起拉回':'连结货箱一起拉回'};if(map[text])feedback.textContent=map[text];}
  }
  let pending=false;
  const schedule=()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;sync();});};
  const observer=new MutationObserver(schedule);
  observer.observe(root,{childList:true,characterData:true,subtree:true});
  window.addEventListener('wonder:locale-change',schedule);
  window.addEventListener('pagehide',()=>{observer.disconnect();window.removeEventListener('wonder:locale-change',schedule);},{once:true});
  sync();
})();
