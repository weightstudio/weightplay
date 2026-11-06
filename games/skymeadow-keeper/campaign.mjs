// Authored campaign. Seeds decorate scenery only; topology and rules are explicit.
export const GAME_ID = 'skymeadow-keeper';
export const SPECIES = Object.freeze({
  rabbit: { food: 'berry', habitat: 'grass', yield: [2,0,0], speed: 3.9, color: 0xe9cbb0 },
  turtle: { food: 'root', habitat: 'grass', yield: [0,2,0], speed: 2.6, color: 0x91aa63 },
  bird: { food: 'nectar', habitat: 'flower', yield: [0,0,2], speed: 4.4, color: 0x80cdd5 },
  deer: { food: 'berry', habitat: 'flower', yield: [2,2,0], speed: 3.6, color: 0xf0bb70 },
  otter: { food: 'root', habitat: 'water', yield: [2,0,2], speed: 3.7, color: 0x9b8075 },
  fox: { food: 'nectar', habitat: 'flower', yield: [1,1,1], speed: 4.0, color: 0xb7a1d4 },
});
export const FOOD = ['berry','root','nectar'];
export const PRODUCE = ['dew','seed','feather'];
export const RESEARCH = Object.freeze({
  lens: { cost: 3 }, bell: { cost: 5 }, garden: { cost: 5 }, circuit: { cost: 8 },
});
// id, title, quota, residents, layout, modifiers. Every checkpoint combines prior rules.
const rows = [
  ['莓光初遇','First Berry',[2,0,0],'rabbit','meadow','tutorial'],
  ['石後的足跡','Behind the Stone',[4,0,0],'rabbit rabbit','split','sight'],
  ['分岔果徑','Forked Orchard',[4,0,0],'rabbit rabbit','fork','supply'],
  ['隊伍的距離','Keep the Herd Close',[6,0,0],'rabbit rabbit rabbit','terraces','distance'],
  ['草甸歸隊','Meadow Homecoming',[6,0,0],'rabbit rabbit rabbit','loop','latch'],
  ['岩龜的午餐','Turtle Lunch',[2,2,0],'rabbit turtle','meadow','diet'],
  ['緩步石橋','Slow Stone Crossing',[2,4,0],'turtle turtle rabbit','bridge','narrow'],
  ['沉石開門','The Weight of Stone',[2,2,0],'turtle rabbit','split','plate'],
  ['一籽兩路','One Seed, Two Paths',[2,2,0],'turtle rabbit','fork','build'],
  ['階岩引水','Terrace Waterways',[4,4,0],'turtle turtle rabbit rabbit','terraces','plate build'],
  ['風雀來信','A Bird on the Breeze',[2,0,2],'bird rabbit','islands','flight'],
  ['風口兩側','Across the Wind',[2,0,4],'bird bird rabbit','split','wind'],
  ['樹梢視線','Treetop Sightlines',[2,2,2],'rabbit turtle bird','terraces','sight flight'],
  ['翼下近路','The Wingward Shortcut',[4,2,2],'rabbit rabbit turtle bird','fork','wind build'],
  ['鳴風雙閘','Twin Wind Gates',[4,4,4],'turtle turtle bird bird','loop','twin wind'],
  ['花谷蜜鹿','Deer of Blossom Vale',[4,2,0],'deer rabbit','fork','thorn build'],
  ['花圃換位','A Place in the Garden',[4,4,2],'deer deer bird','garden','habitat'],
  ['水岸呼喚','A Call from the Shore',[4,0,2],'otter rabbit','river','water'],
  ['沿岸分流','Two River Routes',[4,2,4],'otter otter turtle','river','water build'],
  ['花潮合奏','Bloom and Tide',[6,4,4],'deer otter bird','garden','habitat water build'],
  ['暮狐燈影','Foxlight',[3,3,3],'fox turtle','grove','light'],
  ['長影之徑','The Long Shadow',[4,3,3],'fox rabbit','terraces','light sight'],
  ['四方補給','Four Ways to Gather',[6,4,4],'rabbit turtle bird deer','fork','supply distance'],
  ['山脊捷徑','Ridgeline Shortcut',[6,4,4],'deer otter fox','ridge','light water narrow'],
  ['燈塔歸航','Follow the Lanterns',[6,6,6],'fox fox bird bird','grove','light wind'],
  ['六足同行','Patient Companions',[8,6,4],'rabbit turtle deer bird','garden','plate habitat'],
  ['遠岸花園','The Far Garden',[6,6,6],'deer deer otter otter','river','water wind'],
  ['逆風帶','Against the Wind',[8,6,6],'fox bird bird turtle','ridge','wind light'],
  ['最後的藤籽','Save a Vine Seed',[8,8,6],'rabbit turtle deer bird','fork','build supply'],
  ['雲原復甦','Meadow Reborn',[10,8,8],'rabbit turtle bird deer otter fox','crown','plate twin wind light water habitat build'],
  ['風錨學堂','Wind Anchor School',[2,0,2],'bird rabbit','meadow','anchor wind'],
  ['背風果島','Sheltered Orchard',[4,2,2],'rabbit rabbit turtle','islands','anchor wind supply'],
  ['雙錨航道','Two Anchors',[4,2,4],'bird bird rabbit','bridge','anchor double wind'],
  ['可移的屏障','Move the Shelter',[4,4,2],'turtle turtle rabbit','loop','anchor relocate wind'],
  ['風脊接力','Windridge Relay',[6,4,4],'turtle bird bird rabbit','ridge','anchor double wind'],
  ['潮橋的方向','Turn the Tidebridge',[4,4,4],'otter otter turtle','river','anchor floating water'],
  ['三岸回環','Three Shores',[6,4,4],'deer otter rabbit','loop','anchor floating water'],
  ['風下花粉','Pollen on the Wind',[6,4,6],'bird bird deer','garden','anchor pollen wind'],
  ['背風牧場','Sheltered Habitats',[6,6,4],'turtle turtle deer','garden','anchor habitat build wind'],
  ['浮橋調音','A Bridge in Balance',[8,6,6],'rabbit turtle bird otter','islands','anchor floating double water'],
  ['霧中的光','Light in the Mist',[4,4,4],'fox fox turtle','grove','anchor fog light'],
  ['燈前逆風','A Wind before Dawn',[6,4,6],'fox fox bird','ridge','anchor fog light wind'],
  ['藤下安歇','Rest beneath the Vines',[6,6,6],'fox deer turtle','bridge','anchor light build'],
  ['晝暮交界','The Edge of Twilight',[6,6,6],'fox fox otter','river','anchor light water fog'],
  ['霧谷領航','Lead through Mistvale',[8,8,6],'fox fox turtle turtle','grove','anchor fog plate double light build'],
  ['蜜鹿遷徙','The Blossom Migration',[8,8,4],'deer deer deer bird','fork','anchor thorn build'],
  ['潮獺捷運','Otter Express',[8,4,8],'otter otter otter rabbit','river','anchor water supply'],
  ['岩龜開拓','Turtle Pioneers',[6,10,4],'turtle turtle turtle deer','terraces','anchor plate double build'],
  ['風雀先鋒','Birds of the Vanguard',[6,4,10],'bird bird bird fox','islands','anchor light wind'],
  ['六境會合','Six Biomes Together',[10,8,8],'rabbit turtle bird deer otter fox','crown','anchor floating light water build habitat'],
  ['雲海花環','Wreath of Clouds',[8,8,8],'rabbit turtle bird deer','loop','anchor wind build supply'],
  ['雙層林冠','Two Canopies',[8,8,8],'rabbit turtle bird fox','terraces','anchor sight light'],
  ['空巢的風樹','The Empty Nest',[10,6,8],'rabbit rabbit bird bird','garden','anchor empty habitat'],
  ['不同的歸路','A Different Way Home',[8,10,8],'turtle turtle deer deer','ridge','anchor relocate floating build'],
  ['暮光遷村','Twilight Relay',[10,10,8],'fox fox deer deer','grove','anchor relay light build'],
  ['回聲風門','Echo Gates',[10,8,10],'bird bird otter otter','split','anchor twin wind water'],
  ['藤環與潮環','Vine and Tide',[10,10,8],'turtle turtle otter otter','loop','anchor water build'],
  ['群島守望','Watch over the Islands',[10,10,10],'rabbit turtle bird otter fox','islands','anchor double light wind water'],
  ['最後一道風','The Last Wind',[12,10,10],'rabbit turtle bird deer fox','ridge','anchor light build treasure'],
  ['雲原長歌','Song of the Skymeadow',[12,12,12],'rabbit turtle bird deer otter fox','crown','anchor floating double plate twin light water habitat build'],
];
export const STAGES = Object.freeze(rows.map((r,i)=>Object.freeze({
  id:i+1, zh:r[0], en:r[1], quota:r[2], residents:r[3].split(' '), layout:r[4],
  rules:r[5].split(' '), chapter:i<30?1:2, biome:Math.floor((i%30)/5),
  checkpoint:(i+1)%5===0, seed:76001+i,
})));
export const stageById = id => STAGES.find(s=>s.id===id);

const rect=(x,z,w,d)=>({x,z,w,d});
const route=(points,width=4)=>points.slice(1).map((p,i)=>{
  const a=points[i]; return rect((a[0]+p[0])/2,(a[1]+p[1])/2,Math.abs(a[0]-p[0])+width,Math.abs(a[1]-p[1])+width);
});
const layouts = {
  meadow: [rect(0,-5,28,36)],
  split: [rect(0,7,30,12),rect(0,-25,30,12),...route([[-11,7],[-11,-25]],6),...route([[11,7],[11,-25]],6),rect(0,-9,12,11)],
  fork: [rect(0,6,30,14),rect(-13,-19,12,23),rect(13,-19,12,23),...route([[0,4],[0,-8],[-13,-8],[-13,-25],[13,-25],[13,-8],[0,-8]],4)],
  terraces: [rect(0,7,30,14),rect(-11,-7,14,16),rect(9,-21,24,15),...route([[0,6],[-11,6],[-11,-12],[9,-12],[9,-25]],5)],
  loop: [rect(0,7,30,12),rect(0,-25,30,12),...route([[-12,7],[-12,-25],[12,-25],[12,7],[-12,7]],5),rect(0,-10,13,11)],
  bridge: [rect(0,7,28,14),rect(0,-25,28,14),...route([[-10,7],[-10,-25]],3),...route([[10,7],[17,7],[17,-25],[10,-25]],5)],
  islands: [rect(0,7,26,14),rect(-13,-10,12,13),rect(12,-12,14,13),rect(0,-28,28,10),...route([[-10,7],[-10,-10],[-10,-28],[12,-28],[12,7]],3)],
  garden: [rect(0,7,32,14),rect(-12,-11,14,18),rect(12,-11,14,18),rect(0,-27,32,11),...route([[-12,6],[-12,-27],[12,-27],[12,6]],5),rect(0,-10,14,5)],
  river: [rect(-10,-8,16,46),rect(11,-8,17,46),rect(0,9,32,11),rect(0,-27,32,9),rect(0,-9,30,4)],
  grove: [rect(0,8,30,12),...route([[0,8],[-12,8],[-12,-6],[9,-6],[9,-18],[-10,-18],[-10,-28],[8,-28]],6),rect(0,-29,30,10)],
  ridge: [rect(0,8,30,12),...route([[-11,8],[-11,-11],[12,-11],[12,-27],[-11,-27]],4),...route([[11,8],[18,8],[18,-29],[-11,-29]],4),rect(0,-29,30,9)],
  crown: [rect(0,8,32,14),rect(-13,-10,12,17),rect(13,-10,12,17),rect(0,-28,32,12),...route([[-12,7],[-12,-28],[12,-28],[12,7]],5),...route([[0,8],[0,-28]],4)],
};
export function createWorld(stage) {
  const has=r=>stage.rules.includes(r), land=layouts[stage.layout].map(r=>({...r}));
  const world={stageId:stage.id,land,obstacles:[],zones:[],objects:[],animals:[],bridges:[],lamps:[],camp:{x:0,z:8},tree:{x:0,z:-27},bounds:{minX:-24,maxX:24,minZ:-34,maxZ:17}};
  if(stage.id===1)world.tree={x:0,z:-12};
  if(stage.layout==='meadow')world.tree={x:0,z:-17};
  if(has('sight'))world.obstacles.push({...rect(0,-5,5,7),height:3.8});
  if(has('latch')||has('wind')||has('twin')) {
    world.zones.push({id:'wind-a',type:'wind',...rect(-11,-3,6,3),gate:'gate-a'});
    world.objects.push({id:'gate-a',type:'gate',x:-7,z:4,open:false});
    if(has('twin')) {
      world.zones.push({id:'wind-b',type:'wind',...rect(12,-18,6,3),gate:'gate-b'});
      world.objects.push({id:'gate-b',type:'gate',x:9,z:-24,open:true});
    }
  }
  if(has('water'))world.zones.push({id:'water',type:'water',...rect(0,-11,5,28)});
  if(has('thorn'))world.zones.push({id:'thorns',type:'thorn',...rect(-13,-17,9,2)});
  if(has('plate')) {
    world.objects.push({id:'plate-a',type:'plate',x:-10,z:1,latched:false});
    world.zones.push({id:'stone-door',type:'door',...rect(-11,-7,6,2),plate:'plate-a'});
    if(has('double')) {
      world.objects.push({id:'plate-b',type:'plate',x:11,z:-21,latched:false});
      world.zones.push({id:'stone-door-b',type:'door',...rect(12,-16,6,2),plate:'plate-b'});
    }
  }
  if(has('build')||has('narrow')) {
    world.bridges.push({id:'vine-a',type:'bridge',...rect(0,-10,19,3),built:false,cost:2});
    world.objects.push({id:'vine-a',type:'build',x:-9,z:-10});
    if(has('supply')||has('treasure')) {
      world.bridges.push({id:'vine-b',type:'bridge',...rect(0,-23,18,3),built:false,cost:2});
      world.objects.push({id:'vine-b',type:'build',x:9,z:-23});
    }
  }
  if(has('floating')) {
    world.bridges.push({id:'float-a',type:'floating',...rect(0,-17,21,3),built:false,cost:0});
    world.objects.push({id:'float-a',type:'float',x:10,z:-17});
  }
  if(has('anchor')) {
    if(!world.zones.some(z=>z.type==='wind'))world.zones.push({id:'anchor-wind',type:'wind',...rect(12,-4,6,3)});
    world.objects.push({id:'anchor-supply',type:'supply',x:2,z:9,produce:[0,0,4],taken:false});
  }
  if(has('light')||has('fog')) for(const [i,p] of [[-10,8],[-10,-3],[0,-7],[10,-12],[0,-19],[-10,-25],[8,-28],[0,8]].entries())world.lamps.push({id:`lamp-${i}`,x:p[0],z:p[1],radius:8.5});
  world.habitats=[{id:'home-grass',type:'habitat',x:-6,z:9,recipe:'grass'},{id:'home-water',type:'habitat',x:0,z:11,recipe:has('empty')?null:'water'},{id:'home-flower',type:'habitat',x:6,z:9,recipe:has('empty')?null:'flower'}];
  const candidates=[[-11,-9],[11,-13],[-10,-25],[10,-26],[0,-27],[-13,-15],[13,-19],[8,-28]];
  stage.residents.forEach((species,i)=>{
    const p=stage.id===1?[3,-8]:candidates[i%candidates.length];
    // Ground check below snaps authored spawn to a legal nearby cell.
    world.animals.push({id:`animal-${i}`,species,x:p[0],z:p[1],state:'wild',fed:0,home:null,path:[],repath:0,waitReason:null});
  });
  // Every demanded product has a resident source; helper species support quotas
  // in missions whose principal objective does not itself yield every product.
  stage.quota.forEach((n,k)=>{
    if(n && !world.animals.some(a=>SPECIES[a.species].yield[k])) {
      const species=['rabbit','turtle','bird'][k],i=world.animals.length,p=candidates[i%candidates.length];
      world.animals.push({id:`animal-${i}`,species,x:p[0],z:p[1],state:'wild',fed:0,home:null,path:[],repath:0,waitReason:null,support:true});
    }
  });
  const foods=[...new Set(world.animals.map(a=>SPECIES[a.species].food))];
  foods.forEach((food,k)=>{
    const amount=stage.id===1?6:Math.max(12,Math.ceil(stage.quota.reduce((a,b)=>a+b,0)*1.4));
    // Bounded camp harvest guarantees recovery from route spending, not infinite farming.
    for(let j=0;j<4;j++)world.objects.push({id:`food-${food}-${j}`,type:'food',food,x:-9+k*8+(j%2)*2,z:j<2?5:-26+j,remaining:Math.ceil(amount/4),pollen:has('pollen')&&food==='nectar'&&j>1});
  });
  if(stage.id===1){world.objects=world.objects.filter(o=>o.type!=='food');world.objects.push({id:'food-berry-0',type:'food',food:'berry',x:0,z:-5,remaining:6});}
  if(has('relay'))world.objects.push({id:'relay',type:'relay',x:9,z:-16});
  if(has('treasure'))world.objects.push({id:'cache',type:'cache',x:12,z:-26,taken:false});
  return world;
}
