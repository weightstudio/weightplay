// Original Guard Yard voxel models. X right, Y up, Z towards the viewer.
// Each part is [x,y,z,width,height,depth,colour]; meshes are merged at load time.
export const MODEL_KEYS=['cat','dog','owl','fox','normal','fast','shield','healer','burrow','thief','bossRhino','bossTortoise','bossBadger','bossBoar','bossEagle','bossElk','sun','coin','diamond','heart','rally','recall','stone'];
export function modelParts(kind){
 const p=[],b=(x,y,z,w,h,d,c)=>p.push([x,y,z,w,h,d,c]);
 const gold='#d7a448',teal='#217d82',ivory='#f4e7c8',ink='#152a32';
 if(['sun','coin','diamond','heart','rally','recall','stone'].includes(kind)){
  if(kind==='stone'){b(0,.23,0,.85,.46,.65,'#63786c');b(-.12,.53,.02,.5,.2,.44,'#809477');b(.15,.66,-.04,.26,.1,.24,'#a2af73');return p;}
  if(kind==='sun'||kind==='rally'){b(0,.5,0,.55,.62,.44,gold);b(0,.52,.24,.36,.42,.04,'#ffefab');b(0,.13,0,.67,.12,.55,teal);b(0,.88,0,.67,.12,.55,teal);for(const x of [-.27,.27])b(x,.5,.23,.06,.62,.07,gold);if(kind==='rally'){b(0,1.05,0,.13,.25,.13,ivory);b(.25,1.08,0,.46,.28,.08,'#c85947');}return p;}
  if(kind==='coin'){b(0,.5,0,.72,.72,.2,gold);b(0,.5,.12,.53,.53,.04,'#f9cf72');b(0,.5,.16,.15,.34,.03,gold);b(0,.5,.18,.34,.12,.03,gold);return p;}
  if(kind==='diamond'){for(let i=0;i<3;i++)b(0,.26+i*.22,0,.28+i*.2,.22,.28+i*.2,['#197999','#39bed0','#a0edf0'][i]);return p;}
  if(kind==='heart'){b(-.16,.63,0,.3,.36,.23,'#f27868');b(.16,.63,0,.3,.36,.23,'#f27868');b(0,.4,0,.48,.2,.23,'#d45654');b(0,.24,0,.23,.15,.23,'#b94550');return p;}
  b(0,.15,0,.46,.2,.45,teal);b(0,.6,0,.1,.75,.12,gold);b(0,.95,0,.6,.16,.15,ivory);b(-.24,.82,0,.13,.23,.15,ivory);return p;
 }
 const guard=['cat','dog','owl','fox'].includes(kind),boss=kind.startsWith('boss');
 if(!guard)return enemyParts(kind);
 const species={cat:'lion',dog:'turtle',normal:'wolf',fast:'hyena',shield:'boar',healer:'deer',burrow:'badger',thief:'raccoon',bossRhino:'rhino',bossTortoise:'turtle',bossBadger:'badger',bossBoar:'boar',bossEagle:'eagle',bossElk:'deer'}[kind]||kind;
 const fur={lion:'#e6a52c',turtle:'#779b56',owl:'#907858',fox:'#c66b29',wolf:'#627b85',hyena:'#a17a5d',boar:'#745649',deer:'#987358',badger:'#64717a',raccoon:'#5a777e',rhino:'#8b9686',eagle:'#766c91'}[species];
 const belly=guard?ivory:'#b4b4a0',armour=guard?teal:kind==='healer'?'#408d70':kind==='thief'?'#67578e':boss?'#633f48':'#3b4f5e';
 for(const s of [-1,1]){b(s*.19,.15,.02,.23,.3,.36,fur);b(s*.19,.07,.12,.25,.13,.42,guard?'#8d6942':'#39434a');}
 b(0,.55,0,.64,.62,.44,armour);b(0,.57,.24,.43,.39,.035,guard?gold:'#748087');b(0,.57,.27,.29,.27,.025,armour);
 b(0,.6,-.3,.64,.54,.12,armour); // cape / shell
 for(const s of [-1,1]){b(s*.42,.65,0,.2,.3,.28,guard?gold:armour);b(s*.43,.43,.05,.17,.22,.2,fur);}
 if(species==='lion')for(let i=0;i<4;i++)for(const s of [-1,1])b(s*(.35+(i%2)*.04),.91+i*.14,-.02,.22,.2,.6,i%2?'#b86e23':'#dd912a');
 b(0,1.04,.025,.7,.57,.56,fur);b(0,.91,.35,.4,.22,.21,belly);b(0,.98,.47,.16,.095,.07,ink);
 for(const s of [-1,1]){b(s*.19,1.13,.315,.21,.17,.04,ivory);b(s*.17,1.13,.34,.085,.11,.02,guard?'#263b47':'#e9ae66');b(s*.19,1.245,.34,.24,.055,.045,ink);}
 if(['owl','eagle'].includes(species)){b(0,1.02,.42,.15,.17,.2,gold);for(const s of [-1,1]){b(s*.39,.67,-.03,.17,.52,.28,fur);b(s*.28,1.39,0,.2,.19,.4,fur);}}
 else if(species==='turtle'){b(0,.58,-.35,.77,.65,.24,'#34594c');b(0,.7,-.5,.5,.3,.13,gold);b(-.5,.5,.15,.15,.58,.5,teal);b(-.59,.52,.18,.05,.42,.32,gold);}
 else if(species==='rhino'){b(0,1.12,.47,.2,.36,.22,ivory);b(0,1.33,.5,.13,.16,.13,ivory);for(const s of [-1,1])b(s*.34,1.34,0,.17,.23,.21,fur);}
 else {for(const s of [-1,1]){b(s*.27,1.41,-.04,.2,.24,.21,fur);b(s*.27,1.43,.075,.09,.13,.025,belly);}}
 if(['boar','hyena'].includes(species))for(const s of [-1,1])b(s*.24,.96,.42,.08,.25,.08,ivory);
 if(species==='badger'||species==='raccoon'){b(0,1.17,.316,.13,.28,.03,ivory);for(const s of [-1,1])b(s*.18,1.15,.36,.23,.07,.02,ink);}
 if(species==='fox'){b(.15,.44,-.5,.22,.24,.55,fur);b(.15,.48,-.84,.22,.2,.2,ivory);}
 if(species==='deer'){for(const s of [-1,1]){b(s*.25,1.62,-.04,.09,.43,.09,gold);b(s*.36,1.73,-.04,.26,.09,.09,gold);b(s*.46,1.83,-.04,.08,.2,.08,gold);}}
 if(guard){b(0,.56,.29,.07,.2,.045,ivory);b(-.065,.62,.29,.13,.06,.04,ivory);}
 if(kind==='cat'||kind==='fox'){b(-.5,.66,.1,.07,.72,.08,gold);b(-.5,.99,.17,.07,.1,.21,gold);b(-.5,.32,.17,.07,.1,.21,gold);b(-.5,.65,.3,.02,.6,.025,ivory);}
 if(kind==='owl'||kind==='healer'){b(-.48,.72,.13,.075,1.1,.075,'#66573e');b(-.48,1.23,.13,.27,.3,.25,kind==='owl'?'#5cdbdf':'#89d798');b(-.48,1.24,.27,.14,.17,.035,ivory);}
 if(kind==='thief'){b(.45,.44,-.2,.3,.4,.35,'#ba8d48');b(.45,.47,.0,.19,.18,.025,gold);}
 // Costumes are authored to the poster: layered cape, boots, leaf clasp and
 // species-specific equipment, rather than the former uniform gold crown.
 for(const s of [-1,1]){
  b(s*.22,.34,.24,.16,.08,.055,gold);
  b(s*.3,.72,.18,.13,.12,.12,'#b68c46');
  b(s*.27,.31,-.31,.15,.12,.1,'#18585e');
 }
 b(0,.32,-.34,.3,.18,.08,'#18585e');
 b(0,.68,.29,.13,.12,.04,gold);
 b(0,.69,.315,.065,.07,.02,'#e8dab1');
 if(kind==='cat'){
  for(const s of [-1,1])for(let j=0;j<3;j++){
   b(s*(.33-j*.07),.81-j*.1,.19,.18,.13,.32,j%2?'#9e602b':'#b67732');
  }
  b(0,.78,.22,.27,.15,.28,'#b67732');
 }
 if(kind==='dog'){
  // Terraced teal shell, gold edge and a complete shield face.
  for(let j=0;j<3;j++)b(0,.55+j*.14,-.49-j*.025,.65-j*.13,.13,.12,j%2?teal:'#236b6b');
  for(const y of [.34,.68])b(-.6,y,.16,.055,.065,.34,gold);
  b(-.62,.51,.16,.06,.22,.12,'#e6cb77');
 }
 if(kind==='owl'){
  for(const s of [-1,1])for(let j=0;j<4;j++)b(s*(.33+j*.025),.75-j*.1,-.06,.16,.13,.3,j%2?'#6f533c':'#a18761');
  b(0,.82,.25,.18,.12,.035,ivory);
 }
 // Readable profile faces for the lane-facing battle camera.
 for(const s of [-1,1]){
  b(s*.335,.56,0,.035,.46,.4,teal);
  b(s*.36,.76,0,.04,.065,.43,gold);
  b(s*.36,.35,0,.04,.055,.43,gold);
  b(s*.365,.56,.04,.04,.2,.13,gold);
  b(s*.39,.57,.04,.035,.09,.075,'#8de3d1');
  b(s*.24,.12,.05,.045,.08,.28,gold);
  const side=species==='lion'?.485:.36;
  b(s*side,1.06,.13,.035,.39,.32,fur);
  b(s*(side+.025),1.15,.23,.025,.13,.13,ivory);
  b(s*(side+.04),1.15,.27,.018,.085,.055,ink);
  b(s*(side+.03),1.255,.23,.028,.045,.16,ink);
 }
 return p;
}

// Actor-local +Z is forward. All feet rest at Y=0; only the flight species
// has a raised body. The renderer still owns world placement and animation.
function enemyParts(kind){
 const p=[],b=(x,y,z,w,h,d,c)=>p.push([x,y,z,w,h,d,c]);
 const boss=kind.startsWith('boss');
 const species={normal:'wolf',fast:'hyena',shield:'boar',healer:'deer',burrow:'badger',thief:'raccoon',bossRhino:'rhino',bossTortoise:'turtle',bossBadger:'badger',bossBoar:'boar',bossEagle:'eagle',bossElk:'deer'}[kind];
 if(!species)throw new Error(`Unknown Guard Yard model: ${kind}`);
 const ivory='#eee0be',ink='#20262c',gold='#b9904e',silver='#b3c4d1';
 const fur={wolf:'#73828a',hyena:'#aa8055',boar:boss?'#9b5536':'#69564b',deer:boss?'#384d66':'#ac7e4f',badger:'#696b6b',raccoon:'#7a7e80',rhino:'#929084',turtle:'#7e8650',eagle:'#e8e0ce'}[species];
 const armor=kind==='bossBadger'?'#594258':kind==='bossBoar'?'#81462e':kind==='bossElk'?'#304560':kind==='healer'?'#286d52':kind==='thief'?'#603d54':kind==='bossRhino'?'#325956':'#3b4850';
 if(species==='eagle'){
  b(0,.72,0,.48,.7,.45,'#33485c');
  b(0,1.2,.14,.55,.43,.48,ivory);b(0,1.04,.48,.18,.16,.26,gold);b(0,.94,.57,.14,.16,.11,gold);
  for(const s of [-1,1]){
   b(s*.17,1.24,.392,.17,.1,.03,ink);b(s*.17,1.24,.414,.08,.065,.02,'#63bdd9');
   b(s*.17,1.34,.38,.23,.07,.1,ivory);
   for(let j=0;j<5;j++){
    const x=s*(.33+j*.16),y=.9+j*.15;
    b(x,y,-.06,.19,.46-j*.025,.18,j%2?'#3c5770':'#294056');
    b(x,y-.23+j*.012,-.06,.19,.09,.19,'#46abc3');
    b(x,y-.17+j*.012,.045,.19,.045,.025,gold);
   }
   b(s*.16,.32,.08,.11,.22,.12,gold);
   for(let j=0;j<3;j++)b(s*.16+(j-1)*.06,.19,.17,.045,.1,.28,gold);
  }
  for(let j=0;j<3;j++)b((j-1)*.13,.36,-.29,.12,.25,.25,'#355e78');
  b(0,.89,.245,.13,.15,.04,silver);return p;
 }
 const deer=species==='deer',low=['turtle','badger'].includes(species);
 const bodyY=deer?.65:low?.44:.5,legH=deer?.48:low?.23:.29;
 const bodyW=species==='turtle'?.82:boss?.75:.57;
 b(0,bodyY,-.11,bodyW,.46,.82,fur);
 b(0,bodyY-.1,.04,bodyW*.82,.24,.62,ivory);
 for(const x of [-1,1])for(const z of [-1,1]){
  const px=x*bodyW*.36,pz=z*.29-.1;
  b(px,legH*.58,pz,.18,legH,.21,fur);
  b(px,.065,pz+.045,.2,.13,.3,['badger','turtle'].includes(species)?fur:ink);
  if(species==='badger'||species==='turtle')for(let j=0;j<3;j++)b(px+(j-1)*.057,.04,pz+.22,.044,.08,boss?.21:.13,ivory);
 }
 const headY=deer?1.07:low?.6:.78,headZ=deer?.34:.47;
 if(deer)b(0,.84,.29,.29,.53,.3,fur);
 b(0,headY,headZ,.53,.46,.44,fur);
 const muzzle=species==='rhino'?.41:species==='boar'?.37:.28;
 b(0,headY-.11,headZ+.28,muzzle,.22,.23,['wolf','badger','raccoon','deer'].includes(species)?ivory:fur);
 b(0,headY-.035,headZ+.41,muzzle*.53,.095,.055,ink);
 for(const s of [-1,1]){
  b(s*.16,headY+.055,headZ+.229,.15,.11,.035,ivory);
  b(s*.15,headY+.055,headZ+.251,.075,.09,.024,kind==='bossElk'?'#84c9ea':'#bd7d37');
  b(s*.15,headY+.16,headZ+.235,.19,.06,.07,ink);
  b(s*.2,headY+.3,headZ-.06,.16,.2,.16,fur);
  b(s*.2,headY+.31,headZ+.026,.08,.11,.024,'#aa8d7b');
 }
 // Two shoulder plates, buckles and a stepped back rather than a humanoid chest.
 for(const s of [-1,1]){
  b(s*.276,headY+.07,headZ+.08,.025,.12,.14,ivory);
  b(s*.292,headY+.07,headZ+.115,.018,.085,.065,ink);
  b(s*.282,headY+.16,headZ+.09,.035,.05,.17,ink);
 }
 for(const s of [-1,1]){
  b(s*bodyW*.48,bodyY+.13,.04,.16,.26,.38,armor);
  b(s*bodyW*.49,bodyY+.285,.04,.17,.055,.4,gold);
  b(s*bodyW*.58,bodyY+.15,.12,.03,.075,.08,gold);
 }
 for(let j=0;j<3;j++)b(0,bodyY+.26+j*.035,-.31+j*.17,bodyW*.76,.07,.17,armor);
 if(['wolf','hyena','badger','boar','raccoon'].includes(species)){
  for(let j=0;j<3;j++)b(0,bodyY+.02+j*.06,-.62-j*.14,.18-j*.025,.18,.2,species==='raccoon'&&j%2?ink:fur);
 }
 if(species==='hyena'){
  for(let j=0;j<4;j++)b(0,bodyY+.33,-.33+j*.17,.16,.16,.15,'#584633');
  for(const s of [-1,1])for(let j=0;j<3;j++)b(s*bodyW*.505,bodyY-.015,-.32+j*.2,.026,.095,.095,'#654d36');
 }
 if(species==='badger'||species==='raccoon'){
  b(0,headY+.06,headZ+.245,.12,.37,.025,ivory);
  for(const s of [-1,1])b(s*.17,headY+.045,headZ+.269,.22,.055,.022,ink);
 }
 if(species==='boar'){
  for(const s of [-1,1])for(let j=0;j<3;j++)b(s*(.2+j*.018),headY-.06+j*.11,headZ+.31+j*.04,.095-j*.018,.12,.1,ivory);
  for(let j=0;j<4;j++)b(0,bodyY+.37,-.31+j*.18,.17,.23,.16,'#49362c');
 }
 if(species==='rhino'){
  for(let j=0;j<4;j++)b(0,headY+.12+j*.12,headZ+.3,.2-j*.04,.13,.2-j*.035,ivory);
  b(0,headY+.1,headZ+.3,.25,.06,.26,'#7a8c47');
  b(0,headY-.19,headZ+.407,.27,.13,.035,'#573c36');
 }
 if(species==='turtle'){
  for(let j=0;j<4;j++){
   b(0,bodyY+.26+j*.13,-.14,.93-j*.16,.14,.97-j*.15,'#465052');
   for(const s of [-1,1])b(s*(.42-j*.07),bodyY+.3+j*.13,-.03,.09,.07,.09,gold);
  }
 }
 if(deer){
  const horn=kind==='bossElk'?silver:'#9b7246';
  for(const s of [-1,1]){
   b(s*.22,headY+.51,headZ-.05,.09,.48,.09,horn);
   b(s*.37,headY+.61,headZ-.05,.36,.09,.09,horn);
   b(s*.51,headY+.75,headZ-.05,.09,.34,.09,horn);
   b(s*.3,headY+.86,headZ-.05,.08,.18,.08,horn);
  }
  const gem=kind==='bossElk'?'#74bcde':'#82d5a3';
  b(0,headY+.49,headZ+.05,.2,.27,.18,gem);
  b(0,headY+.5,headZ+.15,.09,.14,.035,'#c9f1df');
  b(0,bodyY+.02,.34,.17,.2,.07,gem);
 }
 if(kind==='thief'){
  b(.37,.48,-.2,.29,.34,.32,'#8a5c39');
  b(.37,.47,-.02,.12,.09,.035,gold);
  for(let j=0;j<3;j++)b(.28+j*.08,.68+(j%2)*.07,-.17,.08,.1,.1,'#f4cc68');
 }
 if(kind==='bossBadger')for(const s of [-1,1])b(s*.39,bodyY+.36,.03,.14,.16,.14,'#a779ba');
 return p;
}
