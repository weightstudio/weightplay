import {STAGES,ROCKS,seams} from './stages.mjs';
export const HEADS=[
 {id:'steel',zh:'鋼鐵鑽頭',en:'Steel',price:0,power:1,heat:1,color:0xb3c5d0,trait:'balanced'},
 {id:'alloy',zh:'合金鑽頭',en:'Alloy',price:180,power:1.6,heat:.92,color:0xf2c268,trait:'stone'},
 {id:'diamond',zh:'鑽石鑽頭',en:'Diamond',price:650,power:2.1,heat:.82,color:0x70dcf5,trait:'crystal'},
 {id:'plasma',zh:'電漿鑽頭',en:'Plasma',price:1800,power:2.8,heat:.65,color:0xbe91ff,trait:'magma'},
];
export const UPGRADES={power:{base:80,zh:'鑽力',en:'Power'},speed:{base:100,zh:'轉速',en:'Speed'},cooling:{base:90,zh:'散熱',en:'Cooling'},cargo:{base:70,zh:'容量',en:'Cargo'}};
export const AUTO={drill:{price:140,zh:'自動鑽掘',en:'Auto Drill'},cool:{price:220,zh:'自動冷卻',en:'Auto Cooling'},sell:{price:400,zh:'自動出售',en:'Auto Sell'}};
const finite=(x,d=0)=>Number.isFinite(Number(x))?Number(x):d;
const int=(x,min,max)=>Math.max(min,Math.min(max,Math.floor(finite(x))));
export function normalize(raw={}){if(!raw||typeof raw!=='object')raw={};return {schema:1,coins:int(raw.coins,0,1e9),best:int(raw.best,0,3000),unlocked:int(raw.unlocked||1,1,30),
 cleared:[...new Set((Array.isArray(raw.cleared)?raw.cleared:[]).map(x=>int(x,0,30)).filter(x=>x>0))],
 heads:[0,...[1,2,3].filter(x=>Array.isArray(raw.heads)&&raw.heads.includes(x))],
 head:Array.isArray(raw.heads)&&raw.heads.includes(int(raw.head,0,3))?int(raw.head,0,3):0,
 upgrades:Object.fromEntries(Object.keys(UPGRADES).map(k=>[k,int(raw.upgrades?.[k],0,20)])),
 auto:Object.fromEntries(Object.keys(AUTO).map(k=>[k,raw.auto?.[k]===true]))};}
export function upgradeCost(save,key){return Math.round(UPGRADES[key].base*1.55**save.upgrades[key]);}
export function buy(save,type,key){
 let price=0;
 if(type==='head'){if(!HEADS[key])return false;if(save.heads.includes(key)){save.head=key;return true;}price=HEADS[key].price;}
 else if(type==='upgrade'){if(!UPGRADES[key]||save.upgrades[key]>=20)return false;price=upgradeCost(save,key);}
 else if(type==='auto'){if(!AUTO[key]||save.auto[key])return false;price=AUTO[key].price;}
 else return false;
 if(save.coins<price)return false;
 save.coins-=price;
 if(type==='head'){save.heads.push(key);save.head=key;}
 if(type==='upgrade')save.upgrades[key]++;
 if(type==='auto')save.auto[key]=true;
 return true;
}
export function newRun(save,stageIndex=0){return {stage:STAGES[int(stageIndex,0,29)],row:0,lane:1,progress:0,heat:0,pressure:0,cargo:0,value:0,depth:0,
 stats:{copper:0,gold:0,crystal:0,coolant:0,quality:0,vent:0,magma:0},auto:save.auto.drill,autoCooling:false,paused:false,ended:false,
 held:0,venting:false,events:[],banked:0,reason:null,clear:false,lastKind:'S'};}
export function capacity(save){return 32+save.upgrades.cargo*12;}
export function goalMet(r){const s=r.stats;switch(r.stage.goal){case'copper':return s.copper>=r.stage.quota;case'gold':return s.gold>=r.stage.quota;case'cargo':return s.copper+s.gold+s.crystal>=r.stage.quota;
 case'balanced':return s.copper>=r.stage.quota&&s.gold>=Math.ceil(r.stage.quota/2);case'coolant':return s.coolant>=r.stage.quota;
 case'cool':return r.heat<=r.stage.quota;case'safe':return s.magma===0;case'crystal':return s.crystal>=r.stage.quota;case'quality':return s.quality>=r.stage.quota;
 case'vent':return s.vent>=r.stage.quota;case'mastery':return s.quality>=r.stage.quota&&s.coolant>=3&&s.vent>=3;default:return true;}}
export function settle(save,r,reason){
 if(r.ended)return false;r.ended=true;r.reason=reason;r.clear=reason==='complete'&&goalMet(r);
 const fraction=reason==='overheat'?.65:1;
 const first=r.clear&&!save.cleared.includes(r.stage.id);
 const earned=Math.floor(r.value*fraction)+(r.clear?(first?60+r.stage.id*12:25):0);r.banked+=earned;
 save.coins=Math.min(1e9,save.coins+earned);save.best=Math.max(save.best,(r.stage.id-1)*100+r.depth);
 if(r.clear){if(first)save.cleared.push(r.stage.id);save.unlocked=Math.max(save.unlocked,Math.min(30,r.stage.id+1));}
 r.events.push({type:'result',reason});return true;
}
export function tick(save,r,dt,held){
 if(r.ended||r.paused)return;
 dt=Math.max(0,Math.min(.05,finite(dt)));const head=HEADS[save.head],up=save.upgrades;
 if(save.auto.cool){const next=ROCKS[seams(r.stage,r.row)[r.lane]];
  const contactHeat=Math.max(0,next.heat)*head.heat*(next===ROCKS.L&&head.trait==='magma'?.25:1);
  if(r.heat>=72||r.pressure>=70||(r.progress>.8&&r.heat+contactHeat>=97))r.autoCooling=true;
  if(r.heat<=25&&r.pressure<=20)r.autoCooling=false;}
 const drilling=(held||r.auto)&&!r.autoCooling;
 if(!drilling){r.held=0;r.heat=Math.max(0,r.heat-dt*(18+up.cooling*2.5));r.progress=Math.max(0,r.progress-dt*.015);
 if(r.pressure>=20&&!r.venting){r.stats.vent++;r.venting=true;}
 r.pressure=Math.max(0,r.pressure-dt*32);if(r.pressure<8)r.venting=false;return;}
 r.held+=dt;const kind=seams(r.stage,r.row)[r.lane],rock=ROCKS[kind];r.lastKind=kind;
 const hardness=(1+r.stage.arc*.32+r.depth*.004)*rock.hard*(r.stage.checkpoint&&r.row%5===4?1.3:1);
 const bonus=head.trait==='stone'&&kind==='S'?1.4:1;
 const rate=(.86+up.power*.2)*(1+up.speed*.12)*head.power*bonus/hardness;
 r.progress+=dt*rate;r.heat=Math.max(0,r.heat+dt*(kind==='L'?16:6.5)*head.heat/(1+up.cooling*.14));
 if(r.stage.pressure)r.pressure=Math.min(100,r.pressure+dt*(kind==='L'?16:8));
 if(r.heat>=100||r.pressure>=100){settle(save,r,'overheat');return;}
 if(r.progress<1)return;
 r.progress=0;r.row++;r.depth=r.row*5;if(r.stage.pressure)r.pressure=Math.min(100,r.pressure+10);
 const gentle=kind==='X'&&r.held<=1.5;let amount=rock.value*(1+r.stage.arc*.25);
 if(kind==='X'){r.stats.crystal++;if(gentle)r.stats.quality++;else amount*=.65;if(head.trait==='crystal')amount*=1.6;}
 if(kind==='C')r.stats.copper++;if(kind==='G')r.stats.gold++;if(kind==='W')r.stats.coolant++;if(kind==='L')r.stats.magma++;
 r.heat=Math.max(0,Math.min(100,r.heat+rock.heat*head.heat*(kind==='L'&&head.trait==='magma'?.25:1)));
 r.value+=Math.floor(amount);r.cargo+=rock.weight;r.events.push({type:'break',kind,value:Math.floor(amount),lane:r.lane,gentle});
 if(r.heat>=100){settle(save,r,'overheat');return;}
 if(r.cargo>=capacity(save)){if(save.auto.sell){save.coins=Math.min(1e9,save.coins+r.value);r.banked+=r.value;r.value=0;r.cargo=0;r.events.push({type:'sold'});}else{settle(save,r,'full');return;}}
 if(r.depth>=r.stage.target)settle(save,r,'complete');
}
