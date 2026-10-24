import * as THREE from './vendor/three/three.module.min.js';
import {resolveLocale,t} from './locales.js?v=17-public1';
import {affordableRestockOffer,applySaleRevenue,browseSeconds,checkoutSeconds,customerBudget,migrateEquipmentState,purchaseEquipment,recoveryShipment,stockCapacity,totalStock,appendCashLedger,spendCash} from './economy.js?v=15';
import {installBlockmartV9} from './blockmart-v9.js?v=17';
import {mergeAchievementStates,recordAchievementEvent} from './blockmart-v9-systems.js?v=12';

const $=id=>document.getElementById(id),canvas=$('world'),cashEl=$('cash'),panel=$('panel'),dialog={hidden:true};
const locale=resolveLocale(),isOwnerPreview=new URL(location.href).searchParams.get('preview')==='1';document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';document.title=`${t('title')}${isOwnerPreview?` · ${t('ownerPreview',locale)}`:''}`;document.querySelectorAll('[data-l10n]').forEach(node=>{node.textContent=t(node.dataset.l10n,locale)});document.querySelectorAll('[data-l10n-content]').forEach(node=>{node.setAttribute('content',t(node.dataset.l10nContent,locale))});document.querySelectorAll('[data-l10n-alt]').forEach(node=>{node.alt=t(node.dataset.l10nAlt,locale)});document.querySelectorAll('[data-l10n-aria]').forEach(node=>{node.setAttribute('aria-label',t(node.dataset.l10nAria,locale))});$('mainHeader').querySelector('[data-wp-return="main"]').setAttribute('aria-label',t('backToPreview',locale));$('battleBack').setAttribute('aria-label',t('backToMain',locale));document.querySelector('.scene-wrap').setAttribute('aria-label',t('sceneLabel',locale));canvas.setAttribute('aria-label',t('canvasLabel',locale));
const SAVE_KEY='weightplay.animal-blockmart.v1';
// Retain the last genuinely readable snapshot in this document; never infer lost progress.
let lastReadableSaveRaw=null,pendingSaveRecovery=null;
function showSaveRecovery(){if(pendingSaveRecovery&&gameActive){toast(t(pendingSaveRecovery,locale));pendingSaveRecovery=null;}}
function readSavedSnapshot(){
  const raw=localStorage.getItem(SAVE_KEY);
  if(raw===null)return null;
  try{const value=JSON.parse(raw);if(value?.version===1&&Number.isFinite(value.cash)&&value.area>=10)lastReadableSaveRaw=raw;return value;}
  catch(error){if(!(error instanceof SyntaxError))throw error;return lastReadableSaveRaw===null?null:JSON.parse(lastReadableSaveRaw);}
}
function preserveCorruptSave(raw){
  const prefix=SAVE_KEY+'.corrupt';let key=prefix;
  if(localStorage.getItem(key)!==null&&localStorage.getItem(key)!==raw)key=prefix+'.'+crypto.randomUUID();
  if(localStorage.getItem(key)!==null&&localStorage.getItem(key)!==raw)throw Error('Corrupt-save backup collision');
  localStorage.setItem(key,raw);
  if(localStorage.getItem(key)!==raw||localStorage.getItem(SAVE_KEY)!==raw)throw Error('Corrupt-save preservation failed');
  return key;
}
const ACHIEVEMENT_EVENT_PREFIX=`${SAVE_KEY}.achievement-event.`;
function readAchievementEvents(){const events=[];try{for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(!key?.startsWith(ACHIEVEMENT_EVENT_PREFIX))continue;try{const event=JSON.parse(localStorage.getItem(key));if(event&&typeof event.id==='string')events.push(event)}catch{}}}catch{}return events}
function persistAchievementEvent(event){if(!event?.id)return;try{const key=`${ACHIEVEMENT_EVENT_PREFIX}${encodeURIComponent(event.id)}`;if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(event));state.achievements=mergeAchievementStates(state.achievements,recordAchievementEvent(state.achievements,event).state)}catch{toast(t('saveFailed',locale))}}
const EXPANSION_COST=600;
const PRODUCTS={water:{name:t('restockWater'),cost:8,price:12,demand:1.55,color:0x5abbd0},snacks:{name:t('restockSnack'),cost:12,price:20,demand:1.0,color:0xf2ae4f},fizz:{name:t('premiumFizz'),cost:45,price:65,demand:.48,color:0xd96da1}};
const INITIAL={cash:300,area:10,lifetime:0,transactions:0,day:1,recoveryOrders:0,recoveryDebt:0,diamond:0,diamondSpent:0,helper:false,cashLedger:[],entrances:[{x:0,z:0}],exits:[{x:9,z:9}],upgrades:0,equipment:{cooler:false,fastCheckout:false},legacyUpgradeCredits:0,unlocked:['water','snacks'],stock:{water:20,snacks:0,fizz:0},fixtures:[{id:'shelf-1',kind:'shelf',product:'water',x:3,z:3},{id:'checkout-1',kind:'checkout',x:7,z:1},{id:'cooler-1',kind:'cooler',x:8,z:6}],milestones:{firstSale:false,firstThousand:false,expanded:false},view:0,zoom:1,panX:0,panZ:0,cameraVersion:2,warehouse:[]};
function load(){try{const s=readSavedSnapshot();if(s&&s.version===1&&Number.isFinite(s.cash)&&s.area>=10){const next={...structuredClone(INITIAL),...s,...migrateEquipmentState(s),stock:{...INITIAL.stock,...s.stock},milestones:{...INITIAL.milestones,...s.milestones},recoveryOrders:Number.isFinite(s.recoveryOrders)?Math.max(0,Math.floor(s.recoveryOrders)):0,recoveryDebt:Number.isFinite(s.recoveryDebt)?Math.max(0,Math.floor(s.recoveryDebt)):0,warehouse:Array.isArray(s.warehouse)?s.warehouse:[]};if(!s.cameraVersion){next.view=(Number(s.view)||0)*Math.PI/2;next.panX=0;next.panZ=0;next.cameraVersion=2;if(next.equipment.fastCheckout&&!next.fixtures.some(f=>f.kind==='fastCheckout')&&!next.warehouse.some(f=>f.kind==='fastCheckout')){let spot=null;for(let z=2;z<next.area-1&&!spot;z++)for(let x=2;x<next.area-1;x++)if(!next.fixtures.some(f=>f.x===x&&f.z===z)){spot={x,z};break}if(spot)next.fixtures.push({id:'fastCheckout-legacy-v6',kind:'fastCheckout',...spot})}}return next}}catch{}return structuredClone(INITIAL)}
let state=load(),renderer,scene,camera,clock=new THREE.Clock(),running=true,gameActive=false,frame=0,elapsed=0,spawnTimer=2,recoveryTimer=0,customerId=0,customers=[],meshes=new Map(),placement=null,selectedTab='shop',drag=null,toastTimer,ghost=null,frameApi=null,recordExpansionAchievement=()=>{},notifyAchievementNotice=()=>{};
const materials={};const mat=(c,roughness=.83)=>{const k=`${c}:${roughness}`;return materials[k]??(materials[k]=new THREE.MeshStandardMaterial({color:c,roughness}))};
const boxGeo=new THREE.BoxGeometry(1,1,1);function cube(parent,name,color,x,y,z,sx,sy,sz,opts={}){const m=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),mat(color));m.name=name;m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;if(opts.rotation)m.rotation.y=opts.rotation;parent.add(m);return m}
function makeWorld(){scene=new THREE.Scene();scene.background=new THREE.Color(0xdcece8);scene.fog=new THREE.Fog(0xdcece8,26,42);camera=new THREE.OrthographicCamera(-9,9,6,-6,.1,90);renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;scene.add(new THREE.HemisphereLight(0xf4fffb,0x71847a,1.45));const sun=new THREE.DirectionalLight(0xffe4b7,1.85);sun.position.set(-7,13,8);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);scene.add(sun);scene.add(new THREE.AmbientLight(0xffffff,.3));setCamera();buildFloor();syncFixtures();addShopkeeper();resize();window.addEventListener('resize',resize);}
function resize(){
  if(!renderer)return;
  const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;
  renderer.setSize(r.width,r.height,false);
  const aspect=r.width/r.height,h=state.area*(aspect>1.3?1.4:1.78);
  camera.left=-h*aspect/2;camera.right=h*aspect/2;camera.top=h/2;camera.bottom=-h/2;
  camera.updateProjectionMatrix();setCamera();
  // Resizing clears WebGL even when the business lifecycle is paused.
  // Redraw the current scene without advancing customers, work or money.
  if(scene)renderer.render(scene,camera);
}
function syncVisibleViewport(){const height=Math.max(1,window.visualViewport?.height||document.documentElement.clientHeight||window.innerHeight);document.documentElement.style.setProperty('--blockmart-visible-height',`${height}px`);requestAnimationFrame(resize)}
function setCamera(){if(!camera)return;const a=Number.isFinite(state.view)?state.view:0,c=(state.area-1)/2+state.panX,z=(state.area-1)/2+state.panZ;camera.position.set(c+Math.sin(a)*19,18,z+Math.cos(a)*19);camera.lookAt(c,.1,z);camera.zoom=(state.zoom||1)*1.2;camera.updateProjectionMatrix()}
function tileColor(x,z){return ((x+z)%2)?0xc5d9cd:0xb5cec1}
function buildFloor(){if(!scene)return;const old=scene.getObjectByName('floor-root');if(old){scene.remove(old);old.traverse(o=>{o.geometry?.dispose();if(o.isInstancedMesh)o.dispose();if(o.isInstancedMesh||o.userData.ownedFixtureMaterial)o.material?.dispose()})}const root=new THREE.Group();root.name='floor-root';scene.add(root);const tileCount=state.area*state.area,tiles=new THREE.InstancedMesh(new THREE.BoxGeometry(.98,.18,.98),new THREE.MeshStandardMaterial({color:0xffffff,roughness:.9}),tileCount),dummy=new THREE.Object3D();let ti=0;for(let x=0;x<state.area;x++)for(let z=0;z<state.area;z++){dummy.position.set(x,0,z);dummy.updateMatrix();tiles.setMatrixAt(ti,dummy.matrix);tiles.setColorAt(ti,new THREE.Color(tileColor(x,z)));ti++}tiles.name='floor-tiles';tiles.receiveShadow=true;root.add(tiles);
  // Blue and cream perimeter walls make the shop read as one expandable room.
  const endpoints=[...(state.entrances||[]),...(state.exits||[])];for(let x=0;x<state.area;x++){if(!endpoints.some(p=>p.x===x&&p.z===0))cube(root,'back-wall',x%3===0?0xb6d8d9:0xf4f0df,x,.78,-.5,.98,1.5,.15);if(!endpoints.some(p=>p.x===x&&p.z===state.area-1))cube(root,'front-wall',0xd4e8e2,x,.44,state.area-.5,.98,.85,.15)}
  for(let z=0;z<state.area;z++){if(!endpoints.some(p=>p.x===0&&p.z===z))cube(root,'left-wall',0xf4f0df,-.5,.55,z,.15,1.05,.98);if(!endpoints.some(p=>p.x===state.area-1&&p.z===z))cube(root,'right-wall',0xc0dde0,state.area-.5,.65,z,.15,1.25,.98)}
  // Wall cooler bays.
  for(let z=2;z<Math.min(8,state.area-1);z+=2){cube(root,'cooler',0xa8dce0,state.area-.72,.76,z,.35,1.4,1.55);cube(root,'cooler-glass',0xd7f5f5,state.area-.49,.78,z,.06,1.08,1.32);cube(root,'cooler-shelf',0xffffff,state.area-.44,.33,z,.05,.06,1.28)}
  const sign=cube(root,'sign',0x139f90,state.area/2,1.65,-.47,3,.42,.08);sign.castShadow=false;
}
function fixtureGroup(f){const g=new THREE.Group();g.position.set(f.x,0,f.z);g.userData.fixture=f.id;const shadow=cube(g,'foot',0x9cb1a4,0,.16,0,.92,.2,.82);shadow.material=mat(0x9cb1a4);if(f.kind==='shelf'){cube(g,'shelf-frame',0x7d9c8b,0,.83,0,.78,1.25,.58);for(let y=.48;y<=1.27;y+=.38){cube(g,'shelf-board',0xf9e9c6,0,y,.03,.92,.1,.72);for(let i=-1;i<=1;i++){const p=PRODUCTS[f.product];if(f.product==='water'){cube(g,'water-crate',0x4aaac4,i*.24,y+.16,.03,.19,.24,.2);cube(g,'water-neck',0x83dced,i*.24,y+.3,.03,.11,.07,.12);cube(g,'water-cap',0xf6fcf7,i*.24,y+.35,.03,.09,.04,.1)}else if(f.product==='snacks'){cube(g,'snack-pack',0xd88d39,i*.24,y+.18,.03,.24,.27,.16);cube(g,'snack-seal',0xf3c879,i*.24,y+.33,.03,.25,.05,.17);cube(g,'snack-mark',0xffedb2,i*.24,y+.17,.115,.11,.09,.025)}else{cube(g,'fizz-can',0xb94783,i*.24,y+.18,.03,.2,.28,.2);cube(g,'fizz-band',0xf7d9ed,i*.24,y+.19,.14,.17,.08,.025);cube(g,'fizz-top',0xd9dfe2,i*.24,y+.33,.03,.18,.035,.18)}}}cube(g,'label',0x164d5a,0,1.52,.04,.7,.19,.07)}else if(f.kind==='checkout'){cube(g,'counter',0xd5ac73,0,.68,0,1.22,.9,.72);cube(g,'till',0x36566a,.18,1.17,-.05,.34,.3,.3);cube(g,'screen',0x91e0c8,.18,1.35,-.05,.28,.05,.22);cube(g,'conveyor',0x546d70,-.33,1.16,0,.48,.07,.55)}else if(f.kind==='fastCheckout'){cube(g,'checkout-upgrade',0x426d79,0,.55,0,.82,.75,.68);cube(g,'checkout-display',0x9be4cf,0,.98,.12,.48,.22,.12);cube(g,'checkout-beam',0xffd76c,0,1.14,.12,.48,.05,.12)}else if(f.kind==='cooler'){cube(g,'cooler-case',0xa8dce0,0,.9,0,.9,1.55,.8);cube(g,'door',0xcff5f1,0,.92,.42,.68,1.28,.06);for(let y=.45;y<1.45;y+=.31)cube(g,'cooler-stock',0xe9a84f,0,y,.32,.48,.13,.09)}else{cube(g,'decor',0x83bf79,0,.52,0,.72,.8,.72);cube(g,'decor-pot',0xb47e58,0,.17,0,.85,.35,.84)}g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});scene.add(g);meshes.set(f.id,g);return g}
function syncFixtures(){if(!scene)return;for(const g of meshes.values()){scene.remove(g);g.traverse(o=>{if(o.geometry)o.geometry.dispose()})}meshes.clear();for(const f of state.fixtures)fixtureGroup(f);if(ghost){scene.remove(ghost);ghost.geometry.dispose();ghost.material.dispose()}ghost=new THREE.Mesh(new THREE.BoxGeometry(.94,.045,.94),new THREE.MeshBasicMaterial({color:0x20bd88,transparent:true,opacity:.52,depthWrite:false}));ghost.visible=false;ghost.position.y=.12;scene.add(ghost)}
function addShopkeeper(){const old=scene.getObjectByName('rux-shopkeeper');if(old){scene.remove(old);old.traverse(o=>o.geometry?.dispose())}const r=new THREE.Group();r.name='rux-shopkeeper';r.position.set(7,0,.35);cube(r,'rux-legs',0x687581,0,.27,0,.56,.46,.4);cube(r,'rux-boots',0xc38b23,0,.13,.04,.7,.22,.52);cube(r,'rux-body',0x147f7b,0,.72,0,.76,.72,.52);cube(r,'rux-apron',0x16a98f,0,.72,.29,.55,.54,.08);cube(r,'rux-head',0x959aa2,0,1.42,.03,.86,.72,.66);cube(r,'rux-muzzle',0xb2b5b8,0,1.22,.38,.44,.28,.28);cube(r,'rux-nose',0x35424c,0,1.31,.55,.12,.09,.07);cube(r,'rux-eye',0x142e38,-.22,1.54,.35,.11,.13,.07);cube(r,'rux-eye',0x142e38,.22,1.54,.35,.11,.13,.07);cube(r,'rux-goggle',0xe3a91f,-.23,1.56,.36,.25,.22,.12);cube(r,'rux-goggle',0xe3a91f,.23,1.56,.36,.25,.22,.12);cube(r,'rux-gearhorn',0xecb32d,-.4,1.83,.04,.27,.28,.26);cube(r,'rux-gearhorn',0xecb32d,.4,1.83,.04,.27,.28,.26);cube(r,'rux-pocket-gear',0xf3bd37,.23,.77,.35,.17,.17,.08);scene.add(r)}
function makeAnimal(kind,color){
  const g=new THREE.Group(),shirt=({rabbit:0xd76f91,bear:0x4c80a7,fox:0x376dad,cat:0x947abb})[kind]||0x718da4;
  const block=(name,c,x,y,z,sx,sy,sz)=>cube(g,name,c,x,y,z,sx,sy,sz);
  block('customer-shirt',shirt,0,.59,0,.55,.52,.43);block('customer-collar',0xffeed2,0,.82,.23,.29,.06,.05);block('customer-pocket',0xc6d9df,.16,.65,.24,.13,.13,.035);
  block('customer-head',color,0,1.14,.015,.68,.55,.54);block('customer-muzzle',0xffe2be,0,1.03,.33,.37,.23,.16);block('customer-nose',0x584536,0,1.09,.425,.11,.07,.045);block('customer-mouth',0x664936,.04,.965,.419,.09,.035,.02);
  for(const x of [-.19,.19]){block('customer-eye-white',0xfff9ea,x,1.19,.305,.14,.17,.035);block('customer-eye',0x34282a,x,1.19,.329,.072,.11,.025);block('customer-eye-glint',0xffffff,x-.017,1.225,.346,.027,.033,.01);block(x<0?'customer-brow-left':'customer-brow-right',0x634c42,x,1.315,.305,.16,.043,.025);}
  const ears=kind==='rabbit'?{y:1.57,h:.43,w:.15}:kind==='bear'?{y:1.45,h:.18,w:.2}:{y:1.48,h:.26,w:.19};
  for(const x of [-.24,.24]){block('customer-ear',color,x,ears.y,.01,ears.w,ears.h,.17);block('customer-inner-ear',kind==='rabbit'?0xedb3c4:0xd4aa9a,x,ears.y,.102,ears.w*.54,ears.h*.64,.025);}
  for(const side of [-1,1]){block(side<0?'customer-arm-left':'customer-arm-right',shirt,side*.355,.59,0,.16,.4,.19);block('customer-hand',color,side*.355,.35,.02,.17,.14,.19);block(side<0?'customer-leg-left':'customer-leg-right',0x786247,side*.15,.24,0,.19,.28,.22);block('customer-shoe',0x453e37,side*.15,.09,.07,.21,.13,.3);}
  block('customer-backpack',0x956334,0,.61,-.3,.36,.41,.17);block('customer-pack-flap',0xba814c,0,.78,-.4,.36,.09,.025);block('customer-pack-buckle',0xe0b552,0,.65,-.403,.08,.09,.03);
  const purchase=block('customer-purchase',0xf1ddb4,.26,.63,.38,.24,.31,.23);purchase.visible=false;return g;
}
function walkable(x,z){return x>=0&&z>=0&&x<state.area&&z<state.area&&!state.fixtures.some(f=>f.x===x&&f.z===z)}
const ENTRANCES=[{x:0,z:0},{x:0,z:1},{x:1,z:0},{x:1,z:1}];
function routeToCheckout(blockedX,blockedZ){const till=state.fixtures.find(f=>f.kind==='checkout');if(!till)return false;const blocked=(x,z)=>x===blockedX&&z===blockedZ,goals=new Set(accessTiles(till).filter(p=>!blocked(p.x,p.z)).map(p=>`${p.x},${p.z}`)),starts=ENTRANCES.filter(p=>walkable(p.x,p.z));if(!goals.size||!starts.length)return false;return starts.every(start=>{const q=[start],seen=new Set([`${start.x},${start.z}`]);while(q.length){const p=q.shift(),key=`${p.x},${p.z}`;if(goals.has(key))return true;for(const[dx,dz]of[[1,0],[-1,0],[0,1],[0,-1]]){const x=p.x+dx,z=p.z+dz,k=`${x},${z}`;if(!blocked(x,z)&&walkable(x,z)&&!seen.has(k)){seen.add(k);q.push({x,z})}}}return false})}
function canPlaceFixture(x,z,ignoreId=null){const occupied=state.fixtures.some(f=>f.x===x&&f.z===z&&f.id!==ignoreId);return x>=0&&z>=0&&x<state.area&&z<state.area&&!occupied&&!ENTRANCES.some(p=>p.x===x&&p.z===z)&&routeToCheckout(x,z)}
function activeEquipment(){return {cooler:Boolean(state.equipment.cooler&&state.fixtures.some(f=>f.kind==='cooler')),fastCheckout:Boolean(state.equipment.fastCheckout&&state.fixtures.some(f=>f.kind==='fastCheckout'))}}
function fixtureCost(kind){return ({shelf:70,cooler:180,fastCheckout:150,decor:0})[kind]??0}
function beginPlacement(kind,fixtureId=null,product='water'){placement={kind,fixtureId,product,point:null,valid:false};$('placementControls').hidden=false;$('placementProduct').hidden=kind!=='shelf';document.querySelector('label[for=placementProduct]').hidden=kind!=='shelf';$('confirmPlacement').disabled=true;renderPlacementStatus();toast(t('placementSelected',locale))}
function placementReason(point){if(!point)return t('placementHint',locale);if(point.x<0||point.z<0||point.x>=state.area||point.z>=state.area)return t('placementOutside',locale);if(ENTRANCES.some(p=>p.x===point.x&&p.z===point.z))return t('placementEntry',locale);if(state.fixtures.some(f=>f.x===point.x&&f.z===point.z&&f.id!==placement.fixtureId))return t('placementOccupied',locale);if(!routeToCheckout(point.x,point.z))return t('placementRoute',locale);return t('placementValid',locale)}
function renderPlacementStatus(){if(!placement)return;$('placementStatus').textContent=placementReason(placement.point);$('confirmPlacement').disabled=!placement.valid;$('confirmPlacement').textContent=`${t('confirmPlace',locale)} · ${placement.fixtureId?t('placeFree',locale):price(fixtureCost(placement.kind))}`}
function updatePlacementPreview(point){if(!placement)return;placement.point=point;placement.valid=Boolean(point&&canPlaceFixture(point.x,point.z,placement.fixtureId));if(ghost){ghost.visible=Boolean(point);if(point){ghost.position.x=point.x;ghost.position.z=point.z;ghost.material.color.set(placement.valid?0x20bd88:0xe45454)}}renderPlacementStatus()}
function cancelPlacement(){if(!placement)return;placement=null;if(ghost)ghost.visible=false;$('placementControls').hidden=true;renderPanel();toast(t('placementCancelled',locale))}
function confirmPlacement(){if(!placement?.valid||!placement.point)return;const p=placement.point,cost=fixtureCost(placement.kind),old=placement.fixtureId?(state.fixtures.find(f=>f.id===placement.fixtureId)||state.warehouse.find(f=>f.id===placement.fixtureId)):null;if(old){if(state.warehouse.some(f=>f.id===old.id)){state.warehouse=state.warehouse.filter(f=>f.id!==old.id);state.fixtures.push(old)}old.x=p.x;old.z=p.z}else{const creditAvailable=(placement.kind==='cooler'||placement.kind==='fastCheckout')&&state.legacyUpgradeCredits>0;if(state.cash<cost&&placement.kind!=='decor'&&!creditAvailable)return toast(t('needMoreCash',locale));if(placement.kind==='decor'&&state.diamond<1)return toast(t('needMoreCash',locale));if(placement.kind==='cooler'||placement.kind==='fastCheckout'){const bought=purchaseEquipment(state,placement.kind,placement.kind==='cooler'?180:150);if(!bought.ok)return toast(t('needMoreCash',locale));state=bought.state}else if(placement.kind==='decor'){state.diamond--;state.diamondSpent++}else state.cash-=cost;state.fixtures.push({id:`${placement.kind}-${Date.now()}`,kind:placement.kind, ...(placement.kind==='shelf'?{product:placement.product||$('placementProduct').value||'water'}:{}),x:p.x,z:p.z})}placement=null;if(ghost)ghost.visible=false;$('placementControls').hidden=true;syncFixtures();rerouteCustomers();save();renderPanel();toast(t('placementDone',locale))}
function warehouseFixture(id){const i=state.fixtures.findIndex(f=>f.id===id);if(i<0)return;const [f]=state.fixtures.splice(i,1);state.warehouse.push(f);syncFixtures();rerouteCustomers();save();renderPanel();toast(t('storedWarehouse',locale))}
function rerouteCustomers(){for(const c of customers){if(c.state==='done'||c.state==='pay')continue;if(c.state==='browse'&&c.target&&!state.fixtures.includes(c.target)){c.target=state.fixtures.find(f=>f.kind==='shelf'&&f.product===c.product)||null;if(!c.target){c.state='wander';c.wait=.2;continue}}const goals=c.state==='browse'&&c.target?accessTiles(c.target):c.state==='queue'||c.state==='browse'?accessTiles(state.fixtures.find(f=>f.kind==='checkout')||{x:-1,z:-1}):[];const path=nearestPath({x:c.x,z:c.z},goals);if(path.length||goals.some(p=>p.x===c.x&&p.z===c.z)){c.path=path;c.pathAt=0;c.segment=null}else if(c.state==='browse'){c.target=null;c.state='wander';c.wait=.2}else if(c.state==='queue'){targetCheckout(c)}}}
function nearestPath(start,goals){let key=(x,z)=>`${x},${z}`,q=[{x:start.x,z:start.z}],came=new Map([[key(start.x,start.z),null]]),goalSet=new Set(goals.map(p=>key(p.x,p.z)));let found=null;while(q.length){const p=q.shift(),k=key(p.x,p.z);if(goalSet.has(k)){found=p;break}for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1]]){const x=p.x+dx,z=p.z+dz,n=key(x,z);if(walkable(x,z)&&!came.has(n)){came.set(n,k);q.push({x,z})}}}if(!found)return [];const out=[];let k=key(found.x,found.z);while(k){const[x,z]=k.split(',').map(Number);out.unshift({x,z});k=came.get(k)}return out.slice(1)}
function accessTiles(f){const out=[];for(const[dx,dz]of [[1,0],[-1,0],[0,1],[0,-1]]){const x=f.x+dx,z=f.z+dz;if(walkable(x,z))out.push({x,z})}return out}
function chooseProduct(budget){const shelved=new Set(state.fixtures.filter(f=>f.kind==='shelf').map(f=>f.product));const available=Object.keys(PRODUCTS).filter(k=>state.unlocked.includes(k)&&shelved.has(k)&&state.stock[k]>0&&PRODUCTS[k].price<=budget);if(!available.length)return null;const weights=available.map(k=>PRODUCTS[k].demand);let t=Math.random()*weights.reduce((a,b)=>a+b,0);for(let i=0;i<available.length;i++){t-=weights[i];if(t<=0)return available[i]}return available[0]}
function spawn(){const entries=[{x:0,z:0},{x:0,z:1},{x:1,z:0},{x:1,z:1}].filter(p=>walkable(p.x,p.z));const p=entries[Math.floor(Math.random()*entries.length)];const kinds=[['rabbit',0xf1d5c1],['bear',0xad825f],['fox',0xe78c5c],['cat',0xb2a4cc]],kind=kinds[customerId++%kinds.length];const g=makeAnimal(kind[0],kind[1]);g.position.set(p.x,0,p.z);scene.add(g);const budget=customerBudget(),c={id:customerId,group:g,x:p.x,z:p.z,product:chooseProduct(budget),state:'enter',path:[],pathAt:0,wait:Math.random()*1.5,budget,queue:0,segment:null};customers.push(c);if(c.product){const shelves=state.fixtures.filter(f=>f.kind==='shelf'&&f.product===c.product);if(shelves.length){const s=shelves[Math.floor(Math.random()*shelves.length)],path=nearestPath(p,accessTiles(s));c.path=path;c.target=s;c.state='browse'}else c.state='wander'}else c.state='wander'}
function targetCheckout(c){const till=state.fixtures.find(f=>f.kind==='checkout');if(!till)return false;let spots=accessTiles(till).filter(p=>!customers.some(o=>o!==c&&['queue','pay'].includes(o.state)&&(o.queueSpot?.x??o.x)===p.x&&(o.queueSpot?.z??o.z)===p.z));const path=nearestPath({x:c.x,z:c.z},spots);const spot=path.at(-1)||spots.find(p=>p.x===c.x&&p.z===c.z);if(!spot)return false;c.path=path;c.pathAt=0;c.queueSpot=spot;c.state='queue';c.queue=0;return true}
function updateCustomer(c,dt){
  if(c.state==='done'){c.remove=(c.remove||0)+dt;if(c.remove>1.5){scene.remove(c.group);return false}return true}
  if(c.pathAt<c.path.length){
    if(!c.segment){c.segment={from:{x:c.x,z:c.z},to:c.path[c.pathAt],progress:0,duration:.29};c.wait=c.segment.duration}
    const dx=c.segment.to.x-c.segment.from.x,dz=c.segment.to.z-c.segment.from.z,targetHeading=Math.atan2(dx,dz),headingDelta=Math.atan2(Math.sin(targetHeading-c.group.rotation.y),Math.cos(targetHeading-c.group.rotation.y));c.group.rotation.y+=headingDelta*(1-Math.exp(-dt*14));
    c.segment.progress=Math.min(c.segment.duration,c.segment.progress+dt);const q=c.segment.progress/c.segment.duration;c.group.position.set(THREE.MathUtils.lerp(c.segment.from.x,c.segment.to.x,q),0,THREE.MathUtils.lerp(c.segment.from.z,c.segment.to.z,q));
    if(c.segment.progress>=c.segment.duration){c.x=c.segment.to.x;c.z=c.segment.to.z;c.pathAt++;c.segment=null;if(c.pathAt===c.path.length&&c.state==='browse')c.wait=browseSeconds(activeEquipment())}return true
  }else if(c.state==='browse'){
    c.wait-=dt;
    if(c.wait<=0){const p=PRODUCTS[c.product];if(state.stock[c.product]>0&&p.price<=c.budget){if(targetCheckout(c))state.stock[c.product]--;else c.state='done'}else c.state='done';renderPanel()}
  }else if(c.state==='queue'){
    const payers=customers.filter(o=>o!==c&&o.state==='pay').length;
    if(!payers){c.state='pay';c.wait=checkoutSeconds(activeEquipment())}else c.queue+=dt;
  }else if(c.state==='pay'){
    c.wait-=dt;
    if(c.wait<=0){const p=PRODUCTS[c.product],sale=applySaleRevenue(state,p.price);state=sale.state;state.lifetime+=sale.grossRevenue;state.transactions++;showSale(sale.netRevenue);if(sale.debtPayment)toast(`${t('recoveryPayment',locale)} · ${price(sale.debtPayment)}`);if(!state.milestones.firstSale){state.milestones.firstSale=true;state.diamond++;toast('First sale! ✦ +1 shop token')}if(state.lifetime>=1000&&!state.milestones.firstThousand){state.milestones.firstThousand=true;state.diamond+=2;state.unlocked.push('fizz');toast('Premium fizz unlocked · +2 ✦')}save();c.state='done';renderPanel()}
  }else if(c.state==='wander'){c.wait-=dt;if(c.wait<=0)c.state='done'}
  return true;
}
function saleFloat(){const e=$('salePop');e.classList.remove('show');void e.offsetWidth;e.classList.add('show')}
function showSale(price){cashEl.textContent=`$${Math.floor(state.cash)}`;saleFloat();$('salePop').textContent=`+$${price}`;window.WeightPlayAudio?.play?.('reward.coin')}
let saveDelegate=null;
function save(){if(saveDelegate)return saveDelegate();return rawSave()}
function rawSave(){
  const raw=localStorage.getItem(SAVE_KEY);let latest=null,recovered=false,restored=false;
  try{latest=raw===null?null:JSON.parse(raw);}catch(error){
    if(!(error instanceof SyntaxError))throw error;
    preserveCorruptSave(raw);restored=lastReadableSaveRaw!==null;latest=restored?JSON.parse(lastReadableSaveRaw):null;recovered=true;
  }
  if(Number.isInteger(latest?.version)&&latest.version>1)throw Error('Unsupported future save schema');
  state.achievements=mergeAchievementStates(mergeAchievementStates(state.achievements,latest?.achievements),{events:readAchievementEvents()});
  const serialized=JSON.stringify({version:1,...state});
  localStorage.setItem(SAVE_KEY,serialized);lastReadableSaveRaw=serialized;cashEl.textContent='$'+Math.floor(state.cash);
  if(recovered){pendingSaveRecovery=restored?'saveRecoveredKnown':'saveRecoveredFresh';showSaveRecovery();}
}
function toast(s){const e=$('toast');e.textContent=s;e.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>e.classList.remove('show'),2100)}
function price(n){return `$${n.toLocaleString()}`}
function stockOffer(k,requested){return affordableRestockOffer(state.stock,activeEquipment(),requested,PRODUCTS[k].cost,state.cash)}
function stockOfferLabel(k,offer){if(offer.quantity)return `+${offer.quantity} · ${price(offer.cost)}`;return totalStock(state.stock)>=stockCapacity(activeEquipment())?t('capacityFull',locale):t('cashShort',locale)}
function button(icon,title,detail,priceLabel,action,disabled=false){const b=document.createElement('button');b.className='card';b.disabled=disabled;b.innerHTML=`<span class="block-icon ${icon}" aria-hidden="true"><i></i><i></i><i></i></span><span><strong>${title}</strong><small>${detail}</small></span><em>${priceLabel}</em>`;b.addEventListener('click',action);panel.append(b);return b}
function addWarehouseControls(){for(const f of state.fixtures){if(!['shelf','cooler','fastCheckout','decor'].includes(f.kind))continue;const name=t(f.kind==='shelf'?'shelf':f.kind==='cooler'?'coolerUpgrade':f.kind==='fastCheckout'?'fasterCheckout':f.kind==='checkout'?'checkoutDetail':'storeCharm',locale),row=document.createElement('div');row.className='fixture-row';const move=document.createElement('button');move.className='fixture-manage';move.textContent=`${t('moveDevice',locale)} · ${name}`;move.addEventListener('click',()=>beginPlacement(f.kind,f.id));const store=document.createElement('button');store.className='fixture-store';store.textContent=t('toWarehouse',locale);store.addEventListener('click',()=>warehouseFixture(f.id));row.append(move,store);panel.append(row)}for(const f of state.warehouse){const row=document.createElement('div');row.className='fixture-row warehouse-row';const label=document.createElement('span');label.textContent=`${t('storedWarehouse',locale)} · ${t(f.kind==='shelf'?'shelf':f.kind==='cooler'?'coolerUpgrade':f.kind==='fastCheckout'?'fasterCheckout':'storeCharm',locale)}`;const place=document.createElement('button');place.className='fixture-store';place.textContent=t('placeFree',locale);place.addEventListener('click',()=>beginPlacement(f.kind,f.id));row.append(label,place);panel.append(row)}}
function renderPanel(){panel.replaceChildren();
if(selectedTab==='shop'){
 const water=stockOffer('water',10),snacks=stockOffer('snacks',8),fizz=stockOffer('fizz',4);
 button('shelf',t('shelf'),t('placeShelfHint',locale),'−$70',()=>beginPlacement('shelf'),state.cash<70);
 const debtDetail=state.recoveryDebt>0?` · ${t('recoveryInvoice',locale)} ${price(state.recoveryDebt)}`:'';
 button('water',t('restockWater'),`${state.stock.water} ${t('waterDetail')}${debtDetail}`,stockOfferLabel('water',water),()=>restock('water',10),water.quantity===0);
 button('snacks',t('restockSnack'),`${state.stock.snacks} ${t('snackDetail')}`,stockOfferLabel('snacks',snacks),()=>restock('snacks',8),snacks.quantity===0);
 button('fizz',t('premiumFizz'),state.unlocked.includes('fizz')?`${state.stock.fizz} · ${t('premiumDetail',locale)}`:t('premiumLocked'),state.unlocked.includes('fizz')?stockOfferLabel('fizz',fizz):t('locked'),()=>state.unlocked.includes('fizz')?restock('fizz',4):toast(t('premiumLocked')),!state.unlocked.includes('fizz')||fizz.quantity===0);
}
if(selectedTab==='supply')for(const k of ['water','snacks','fizz']){const p=PRODUCTS[k],unlocked=state.unlocked.includes(k),offer=stockOffer(k,10),name=t(k==='water'?'restockWater':k==='snacks'?'restockSnack':'premiumFizz');button(k,name,unlocked?`${t('buyPrice',locale)} ${price(p.cost)} · ${t('sellPrice',locale)} ${price(p.price)} · ${state.stock[k]}/${stockCapacity(activeEquipment())}${k==='water'?` · ${state.recoveryDebt>0?t('recoveryInvoice',locale)+' '+price(state.recoveryDebt):''}`:''}`:t('premiumLocked'),unlocked?stockOfferLabel(k,offer):t('locked'),()=>{if(unlocked)restock(k,10);else toast(t('premiumLocked'))},!unlocked||offer.quantity===0)}
if(selectedTab==='growth'){
 const owned=state.equipment.cooler,credit=state.legacyUpgradeCredits>0,eq=activeEquipment();
 button('growth',t('expand'),`${t('expandDetail')} · ${state.area} × ${state.area}`,`−${price(EXPANSION_COST)}`,expand,state.area>10||state.cash<EXPANSION_COST);
 button('cooler',t('coolerUpgrade'),`${owned?(eq.cooler?t('upgradeComplete'):t('storedInactive',locale)):t('coolerDetail')} · ${t('stockCapacity')}: ${totalStock(state.stock)}/${stockCapacity(eq)}`,owned?(eq.cooler?t('upgradeComplete'):t('placeFree',locale)):credit?t('legacyUpgradeCredit'):'−$180',()=>owned?beginPlacement('cooler',state.warehouse.find(f=>f.kind==='cooler')?.id||state.fixtures.find(f=>f.kind==='cooler')?.id||null):beginPlacement('cooler'),owned&&eq.cooler||(!owned&&!credit&&state.cash<180));
 button('token',t('storeCharm'),`${t('tokens')} ${state.diamond} · ${t('optionalDecor',locale)}`,'−1 ✦',()=>beginPlacement('decor'),state.diamond<1);
 button('growth',t('shopProgress'),`${state.transactions} ${t('purchases')} · ${price(state.lifetime)} ${t('lifetimeSales',locale)}`,`${state.area} × ${state.area}`,()=>toast(t('noDailyReset',locale)));
 addWarehouseControls();
}
if(selectedTab==='staff'){
 const owned=state.equipment.fastCheckout,eq=activeEquipment();
 button('staff',t('hireHelper'),state.helper?t('helperDuty'):t('helperNoWage'),state.helper?t('hired',locale):'−$220',hire,state.helper||state.cash<220);
 button('register',t('fasterCheckout'),`${owned?(eq.fastCheckout?t('upgradeComplete'):t('storedInactive',locale)):t('checkoutDetail')} · ${t('checkoutTime')}: ${checkoutSeconds(eq).toFixed(1)} s`,owned?(eq.fastCheckout?t('upgradeComplete'):t('placeFree',locale)):state.legacyUpgradeCredits>0?t('legacyUpgradeCredit'):'−$150',()=>owned?beginPlacement('fastCheckout',state.warehouse.find(f=>f.kind==='fastCheckout')?.id||null):beginPlacement('fastCheckout'),owned&&eq.fastCheckout||(!owned&&!state.legacyUpgradeCredits&&state.cash<150));
 button('staff',t('autoRestock'),state.helper?t('autoRestockDetail',locale):t('helperNeeded'),'—',()=>toast(state.helper?t('autoRestockDetail',locale):t('helperNeeded')),!state.helper);
 addWarehouseControls();
}
}
function restock(k,requested){const offer=stockOffer(k,requested);if(!offer.quantity)return toast(totalStock(state.stock)>=stockCapacity(activeEquipment())?t('capacityFull',locale):t('cashShort',locale));state.cash-=offer.cost;state.stock[k]+=offer.quantity;save();renderPanel();toast(`${offer.quantity} ${PRODUCTS[k].name} · ${t('orderedFor',locale)} ${price(offer.cost)}`)}
function expand(){if(state.area>10)return;const purchase=spendCash(state,EXPANSION_COST,'expansion');if(!purchase.ok)return toast(t('cashShort',locale));state=purchase.state;state.area=13;state.milestones.expanded=true;recordExpansionAchievement(13);buildFloor();syncFixtures();addShopkeeper();resize();save();renderPanel();toast(t('expandSuccess',locale))}
function hire(){if(state.helper)return;const purchase=spendCash(state,220,'helper');if(!purchase.ok)return toast(t('needMoreCash',locale));state=purchase.state;state.helper=true;save();renderPanel();toast(`${t('hireHelper',locale)} · ${t('helperNoWage',locale)}`)}
function gridPoint(ev){const r=canvas.getBoundingClientRect(),v=new THREE.Vector2((ev.clientX-r.left)/r.width*2-1,-(ev.clientY-r.top)/r.height*2+1),ray=new THREE.Raycaster();ray.setFromCamera(v,camera);const hit=new THREE.Vector3();if(!ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0),0),hit))return null;return{x:Math.round(hit.x),z:Math.round(hit.z)}}
function pickFixture(p){if(!p)return null;return state.fixtures.find(f=>f.x===p.x&&f.z===p.z)}
const pointers=new Map();let gesture=null;
function panByPixels(dx,dy){const r=canvas.getBoundingClientRect(),plane=new THREE.Plane(new THREE.Vector3(0,1,0),0),ray=new THREE.Raycaster(),a=new THREE.Vector3(),b=new THREE.Vector3();ray.setFromCamera(new THREE.Vector2(0,0),camera);if(!ray.ray.intersectPlane(plane,a))return;ray.setFromCamera(new THREE.Vector2(2*dx/Math.max(1,r.width),-2*dy/Math.max(1,r.height)),camera);if(!ray.ray.intersectPlane(plane,b))return;const limit=state.area*.65;state.panX=THREE.MathUtils.clamp(state.panX-(b.x-a.x),-limit,limit);state.panZ=THREE.MathUtils.clamp(state.panZ-(b.z-a.z),-limit,limit);setCamera()}
canvas.addEventListener('contextmenu',e=>e.preventDefault());canvas.addEventListener('wheel',e=>{e.preventDefault();state.zoom=THREE.MathUtils.clamp(state.zoom*Math.exp(-e.deltaY*.001),.65,2);setCamera();save()},{passive:false});canvas.addEventListener('pointerdown',e=>{if(e.button===2||e.shiftKey)e.preventDefault();canvas.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(placement){updatePlacementPreview(gridPoint(e));return}if(pointers.size===2){const pts=[...pointers.values()];gesture={type:'multi',distance:Math.hypot(pts[0].x-pts[1].x,pts[0].y-pts[1].y),angle:Math.atan2(pts[1].y-pts[0].y,pts[1].x-pts[0].x),centroid:{x:(pts[0].x+pts[1].x)/2,y:(pts[0].y+pts[1].y)/2}};drag=null;return}const p=gridPoint(e),f=pickFixture(p);drag={id:e.pointerId,startX:e.clientX,startY:e.clientY,lastX:e.clientX,lastY:e.clientY,moved:false,rotate:e.shiftKey,fixture:f,point:p}});
canvas.addEventListener('pointermove',e=>{if(pointers.has(e.pointerId))pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(placement){updatePlacementPreview(gridPoint(e));return}if(pointers.size===2){const pts=[...pointers.values()],distance=Math.hypot(pts[0].x-pts[1].x,pts[0].y-pts[1].y),angle=Math.atan2(pts[1].y-pts[0].y,pts[1].x-pts[0].x),centroid={x:(pts[0].x+pts[1].x)/2,y:(pts[0].y+pts[1].y)/2};if(gesture){panByPixels(centroid.x-gesture.centroid.x,centroid.y-gesture.centroid.y);state.zoom=THREE.MathUtils.clamp(state.zoom*distance/Math.max(1,gesture.distance),.65,2);state.view+=Math.atan2(Math.sin(angle-gesture.angle),Math.cos(angle-gesture.angle));setCamera()}gesture={type:'multi',distance,angle,centroid};return}if(!drag)return;const dx=e.clientX-drag.lastX,dy=e.clientY-drag.lastY;if(Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)>8)drag.moved=true;if(drag.moved){if(drag.rotate){state.view+=dx*.008;setCamera()}else panByPixels(dx,dy)}drag.lastX=e.clientX;drag.lastY=e.clientY});
canvas.addEventListener('pointerup',e=>{const wasMulti=Boolean(gesture);pointers.delete(e.pointerId);gesture=null;if(wasMulti)save();if(placement){updatePlacementPreview(gridPoint(e));drag=null;return}if(drag&&drag.id===e.pointerId&&!drag.moved&&drag.fixture){selectedTab='growth';document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x.dataset.tab==='growth'));renderPanel();toast(t('selectMovePrompt',locale))}else if(drag?.moved){save()}drag=null});
canvas.addEventListener('pointercancel',e=>{pointers.delete(e.pointerId);gesture=null;drag=null});canvas.addEventListener('lostpointercapture',e=>{pointers.delete(e.pointerId);gesture=null;drag=null});
function animate(){if(!running)return;requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.05);if(dialog.hidden&&!$('app').hidden){elapsed+=dt;spawnTimer-=dt;if(spawnTimer<=0&&customers.length<12){spawn();spawnTimer=5}customers=customers.filter(c=>updateCustomer(c,dt));const helperOrder=stockOffer('water',10);if(state.helper&&state.stock.water<6&&helperOrder.quantity>0&&state.cash>=helperOrder.cost){state.cash-=helperOrder.cost;state.stock.water+=helperOrder.quantity;save();renderPanel()}if(state.cash<PRODUCTS.water.cost&&Object.values(state.stock).every(n=>n===0)&&state.recoveryOrders<2){recoveryTimer+=dt;if(recoveryTimer>=12){const recovery=recoveryShipment(state,PRODUCTS.water.cost);if(recovery.ok){state=recovery.state;save();renderPanel();toast(`${t('recoveryOrder',locale)} · ${price(recovery.cost)}`)}recoveryTimer=0}}else recoveryTimer=0;if(Math.floor(elapsed/60)+1>state.day){state.day=Math.floor(elapsed/60)+1;save();$('day').textContent=state.day}}if(++frame%30===0){$('guestCount').textContent=customers.length;$('queueCount').textContent=customers.filter(c=>c.state==='queue'||c.state==='pay').length;cashEl.textContent=price(Math.floor(state.cash));}customers.forEach(c=>{c.group.position.y=Math.abs(Math.sin(elapsed*4+c.id))*.035});renderer.render(scene,camera)}
document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x===b));selectedTab=b.dataset.tab;$('panel').scrollTop=0;renderPanel()}));$('confirmPlacement').addEventListener('click',()=>confirmPlacement());$('cancelPlacement').addEventListener('click',()=>cancelPlacement());$('placementProduct').addEventListener('change',()=>{if(placement?.kind==='shelf')placement.product=$('placementProduct').value});window.addEventListener('resize',syncVisibleViewport,{passive:true});window.visualViewport?.addEventListener('resize',syncVisibleViewport,{passive:true});window.visualViewport?.addEventListener('scroll',syncVisibleViewport,{passive:true});syncVisibleViewport();$('mainStart').addEventListener('click',()=>{window.WeightPlayAudio?.unlock?.();window.WeightPlayAudio?.play?.('game.start');gameActive=true;$('mainScreen').hidden=true;$('app').hidden=false;dialog.hidden=true;frameApi?.activate('battle');resize();clock.start();if(!localStorage.getItem(SAVE_KEY))save();requestAnimationFrame(resize)});$('battleBack').addEventListener('click',()=>{$('leaveConfirm').hidden=false});$('continueBattle').addEventListener('click',()=>{$('leaveConfirm').hidden=true});$('returnMain').addEventListener('click',()=>{gameActive=false;$('leaveConfirm').hidden=true;$('app').hidden=true;$('mainScreen').hidden=false;frameApi?.activate('main');window.WeightPlayBattleCanvas?.sync?.()});
// The modal owns focus while the existing lifecycle pauses shop simulation.
let leaveFocus=null;const leaveInert=new Map();
function syncLeaveFocus(){
  const modal=$('leaveConfirm');
  if(!modal.hidden){
    leaveFocus=document.activeElement;
    for(const node of $('app').children)if(node!==modal){leaveInert.set(node,node.inert);node.inert=true;}
    $('continueBattle').focus({preventScroll:true});
  }else{
    for(const [node,inert] of leaveInert)node.inert=inert;leaveInert.clear();
    const target=gameActive&&leaveFocus?.isConnected?leaveFocus:$('mainStart');
    target?.focus({preventScroll:true});leaveFocus=null;
  }
}
$('battleBack').addEventListener('click',syncLeaveFocus);
$('mainStart').addEventListener('click',showSaveRecovery);
$('continueBattle').addEventListener('click',syncLeaveFocus);
$('returnMain').addEventListener('click',syncLeaveFocus);
document.addEventListener('keydown',event=>{
  if($('leaveConfirm').hidden)return;
  if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();$('continueBattle').click();}
  else if(event.key==='Tab'){
    event.preventDefault();const buttons=[$('continueBattle'),$('returnMain')],index=buttons.indexOf(document.activeElement);
    buttons[(index+(event.shiftKey?-1:1)+buttons.length)%buttons.length].focus({preventScroll:true});
  }
},true);
function installV9(){
  const v9=installBlockmartV9({
    $:id=>document.getElementById(id),t,locale,INITIAL,PRODUCTS,EXPANSION_COST,THREE,
    get state(){return state},set state(value){state=value},
    get customers(){return customers},set customers(value){customers=value},
    get placement(){return placement},set placement(value){placement=value},
    get selectedTab(){return selectedTab},set selectedTab(value){selectedTab=value},
    get meshes(){return meshes},get renderer(){return renderer},get scene(){return scene},get camera(){return camera},
    get canvas(){return canvas},get dialog(){return dialog},get elapsed(){return elapsed},set elapsed(value){elapsed=value},
    get spawnTimer(){return spawnTimer},set spawnTimer(value){spawnTimer=value},
    get recoveryTimer(){return recoveryTimer},set recoveryTimer(value){recoveryTimer=value},
    get customerId(){return customerId},set customerId(value){customerId=value},
    get running(){return running},set running(value){running=value},
    get gameActive(){return gameActive},set gameActive(value){gameActive=value},
    setGhost(value){ghost=value},cube,makeAnimal,gridPoint,panByPixels,setCamera,buildFloor,resize,save,toast,price,showSale,spendCash,appendCashLedger,
    rawSave,saveKey:SAVE_KEY,readSaved:readSavedSnapshot,readCompatibleSaved:load,setSaveDelegate(value){saveDelegate=value},
    readAchievementEvents,persistAchievementEvent,
    expand,hire,browseSeconds,checkoutSeconds,purchaseEquipment,applySaleRevenue,stockCapacity,totalStock,recoveryShipment,
    customerBudget,
    activeEquipment(){return activeEquipment()},
    renderPanel(){return renderPanel()}
  });
  recordExpansionAchievement=v9.recordExpansionPurchase;
  notifyAchievementNotice=v9.notifyAchievementUnlocks;
  walkable=v9.walkable;accessTiles=v9.accessTiles;routeToCheckout=v9.routeToCheckout;
  canPlaceFixture=v9.canPlaceFixture;pickFixture=v9.fixtureAt;fixtureCost=v9.fixtureCost;
  fixtureGroup=v9.fixtureGroup;syncFixtures=v9.syncFixtures;beginPlacement=v9.beginPlacement;
  placementReason=v9.placementReason;renderPlacementStatus=v9.updatePlacementUi;
  confirmPlacement=v9.confirmPlacement;cancelPlacement=v9.cancelPlacement;warehouseFixture=v9.warehouseFixture;
  targetCheckout=v9.targetCheckout;chooseProduct=v9.chooseProduct;spawn=v9.spawn;updateCustomer=v9.updateCustomer;
  renderPanel=v9.renderPanel;addWarehouseControls=v9.addWarehouseControls;activeEquipment=v9.activeEquipment;
  addWarehouseControls=v9.addWarehouseControls;
  v9.install();
  return v9;
}
try{frameApi=window.WeightPlayScreenFrame.mount({root:$('gameFrameRoot'),scenes:{main:{root:$('mainScreen'),header:$('mainHeader'),content:$('mainContent')},battle:{root:$('app'),header:$('battleHeader'),content:$('battleContent')}}});frameApi.activate('main');$('app').hidden=true;dialog.hidden=true;makeWorld();installV9();$('day').textContent=state.day;cashEl.textContent=price(state.cash);renderPanel();save();animate()}catch(error){
  console.error(error);document.body.replaceChildren();
  const fallback=document.createElement('main');fallback.style.cssText='padding:24px;font:16px system-ui;color:#345';
  const message=document.createElement('p');message.textContent=t('sceneStartError',locale);
  const retry=document.createElement('button');retry.type='button';retry.textContent=t('retry',locale);retry.addEventListener('click',()=>location.reload());
  fallback.append(message,retry);document.body.append(fallback);
}
// The shared loader covers the real module/world startup, including cold imports.
// No minimum timer, fake percentage or business-state transition owns readiness.
$('loadingPanel')?.classList.add('hidden');
