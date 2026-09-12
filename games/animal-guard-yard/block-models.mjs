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
 if(kind==='cat'||kind==='fox'){b(.5,.66,.1,.07,.72,.08,gold);b(.5,.99,.17,.07,.1,.21,gold);b(.5,.32,.17,.07,.1,.21,gold);b(.5,.65,.3,.02,.6,.025,ivory);}
 if(kind==='owl'||kind==='healer'){b(.48,.72,.13,.075,1.1,.075,'#66573e');b(.48,1.23,.13,.27,.3,.25,kind==='owl'?'#5cdbdf':'#89d798');b(.48,1.24,.27,.14,.17,.035,ivory);}
 if(kind==='thief'){b(.45,.44,-.2,.3,.4,.35,'#ba8d48');b(.45,.47,.0,.19,.18,.025,gold);}
 if(boss){b(0,1.43,0,.69,.12,.5,gold);for(const x of [-.28,0,.28])b(x,1.57,0,.12,.23,.2,gold);b(0,1.52,.27,.13,.17,.06,'#bd5c75');for(const s of [-1,1])b(s*.45,.73,0,.27,.23,.4,gold);}
 return p;
}
