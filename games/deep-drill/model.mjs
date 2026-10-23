import {STAGES,ROCKS,seams} from './stages.mjs';
import {migrate,systemBuy,initializeRun,extraCapacity,activeSeal,sealContact,runSeams,bankMaterials,bankSaleStats,rescueFraction,settleSystems,onOre,oreValueMultiplier,rateMultiplier,equipped,stepSystems,automaticTool,restoreJourney,saveJourney,triggerExpeditionEvent} from './systems.mjs';
export const HEADS=[
 {id:'steel',zh:'鋼鐵鑽頭',en:'Steel',price:0,power:1,color:0xb3c5d0,trait:'balanced'},
 {id:'alloy',zh:'合金鑽頭',en:'Alloy',price:180,power:1.6,color:0xf2c268,trait:'stone'},
 {id:'diamond',zh:'鑽石鑽頭',en:'Diamond',price:650,power:2.1,color:0x70dcf5,trait:'crystal'},
 {id:'plasma',zh:'電漿鑽頭',en:'Plasma',price:1800,power:2.8,color:0xbe91ff,trait:'magma'},
];
export const UPGRADES={power:{base:80,zh:'鑽力',en:'Power'},speed:{base:100,zh:'轉速',en:'Speed'},cooling:{base:90,zh:'衝擊強化',en:'Impact'},cargo:{base:70,zh:'容量',en:'Cargo'},autoPower:{base:85,zh:'自動傷害',en:'Auto Power'},autoSpeed:{base:85,zh:'自動速度',en:'Auto Speed'},helperPower:{base:100,zh:'助手訓練',en:'Helper Power'}};
export const AUTO={drill:{price:140,zh:'強化伺服',en:'Auto Drill'},cool:{price:220,zh:'高速洩壓',en:'Auto Vent'},sell:{price:400,zh:'即時輸送',en:'Auto Sell'},smart:{price:520,min:6,zh:'鑽探加速',en:'Smart Pilot'}};
const finite=(x,d=0)=>Number.isFinite(Number(x))?Number(x):d;
const int=(x,min,max)=>Math.max(min,Math.min(max,Math.floor(finite(x))));
export function normalize(raw={}){if(!raw||typeof raw!=='object')raw={};const base={schema:7,coins:int(raw.coins,0,1e9),best:int(raw.best,0,3000),unlocked:int(raw.unlocked||1,1,30),
 cleared:[...new Set((Array.isArray(raw.cleared)?raw.cleared:[]).map(x=>int(x,0,30)).filter(x=>x>0))],
 heads:[0,...[1,2,3].filter(x=>Array.isArray(raw.heads)&&raw.heads.includes(x))],
 head:Array.isArray(raw.heads)&&raw.heads.includes(int(raw.head,0,3))?int(raw.head,0,3):0,
 upgrades:Object.fromEntries(Object.keys(UPGRADES).map(k=>[k,int(raw.upgrades?.[k],0,20)])),
 auto:Object.fromEntries(Object.keys(AUTO).map(k=>[k,raw.auto?.[k]===true]))};return migrate(base,raw);}
export function upgradeCost(save,key){return Math.round(UPGRADES[key].base*1.55**save.upgrades[key]);}
export function buy(save,type,key){
 if(!['head','upgrade','auto'].includes(type))return systemBuy(save,type,key);
 let price=0;
 if(type==='upgrade'&&(key==='helperPower'&&!save.helpers))return false;
 if(type==='head'){if(!Number.isInteger(key)||!Object.hasOwn(HEADS,key))return false;if(save.heads.includes(key)){save.head=key;return true;}price=HEADS[key].price;}
 else if(type==='upgrade'){if(!Object.hasOwn(UPGRADES,key)||save.upgrades[key]>=20)return false;price=upgradeCost(save,key);}
 else if(type==='auto'){if(!Object.hasOwn(AUTO,key)||save.auto[key]||save.unlocked<(AUTO[key].min||1))return false;price=AUTO[key].price;}
 else return false;
 if(save.coins<price)return false;
 save.coins-=price;
 if(type==='head'){save.heads.push(key);save.head=key;}
 if(type==='upgrade')save.upgrades[key]++;
 if(type==='auto')save.auto[key]=true;
 return true;
}
export function newRun(save,stageIndex=0){return restoreJourney(save,initializeRun(save,{stage:STAGES[int(stageIndex,0,29)],row:0,lane:2,progress:0,pressure:0,cargo:0,value:0,depth:0,
 stats:{copper:0,gold:0,crystal:0,coolant:0,quality:0,vent:0,magma:0},auto:true,autoCooling:false,helpersOn:true,helperVenting:false,tiles:{},pulse:0,helperPulse:0,hitTTL:0,mined:0,beamTarget:null,paused:false,ended:false,
 held:0,venting:false,events:[],banked:0,reason:null,clear:false,lastKind:'S'}));}
export function capacity(save){return 32+save.upgrades.cargo*12+extraCapacity(save);}
export function goalMet(r){if(r.stage.checkpoint)return r.seal.phase>=3;const s=r.stats;switch(r.stage.goal){case'copper':return s.copper>=r.stage.quota;case'gold':return s.gold>=r.stage.quota;case'cargo':return s.copper+s.gold+s.crystal>=r.stage.quota;
 case'balanced':return s.copper>=r.stage.quota&&s.gold>=Math.ceil(r.stage.quota/2);case'coolant':return s.coolant>=r.stage.quota;
 case'safe':return s.magma===0;case'crystal':return s.crystal>=r.stage.quota;case'quality':return s.quality>=r.stage.quota;
 case'vent':return s.vent>=r.stage.quota;case'mastery':return s.quality>=r.stage.quota&&s.coolant>=3&&s.vent>=3;default:return true;}}
export function settle(save,r,reason){
 if(r.ended)return false;r.ended=true;r.reason=reason;r.clear=reason==='complete'&&r.depth>=r.stage.target&&r.row>=r.stage.layers&&goalMet(r);
 const fraction=['pressure','hull'].includes(reason)?rescueFraction(save):1;
 const first=r.clear&&!save.cleared.includes(r.stage.id);
 const earned=Math.floor(r.value*fraction)+(r.clear?(first?60+r.stage.id*12:25):0);r.banked+=earned;r.finalEarned=r.banked;r.settlementEarned=earned;
 save.coins=Math.min(1e9,save.coins+earned);save.best=Math.max(save.best,(r.stage.id-1)*100+Math.min(100,Math.floor(r.depth/r.stage.target*100)));
 if(r.clear){if(first)save.cleared.push(r.stage.id);save.unlocked=Math.max(save.unlocked,Math.min(30,r.stage.id+1));}
 settleSystems(save,r,reason,first);
 r.events.push({type:'result',reason});return true;
}
// Route cells retain damage until they leave the 5×5 field. No render effect owns HP.
export function cellState(r,row=r.row,lane=r.lane){
 const kind=row===r.row?runSeams(r)[lane]:seams(r.stage,row)[lane];
 const id=`${row}:${lane}`,seal=r.stage.checkpoint&&row===r.stage.layers-1;
 const max=10*Math.round(90*(seal?1.25+r.stage.arc*.15:(1+r.stage.arc*.65+(row/r.stage.layers*20)*.025)*ROCKS[kind].hard));
 if(seal&&row===r.row&&activeSeal(r)&&kind!=='B'){
  // The moving weak point keeps its damage between cooling windows.
  // Otherwise the tenfold durability would require clearing it in one window.
  if(r.seal.targetCell?.phase!==r.seal.phase)r.seal.targetCell={phase:r.seal.phase,row,lane,kind,max,hp:max,paid:false};
  const cell=r.seal.targetCell;cell.lane=lane;return cell;
 }
 if(!r.tiles[id]||r.tiles[id].kind!==kind){
  const credit=row===r.resumeRow?(r.rowCredit||0)/10:0;
  // A migrated fractional row was already partly mined and banked in v10.
  // Retain its drilling credit without replaying the old mineral payout.
  r.tiles[id]={row,lane,kind,max,hp:max*(1-credit),paid:credit>0};
 }
 return r.tiles[id];
}
export function selectRoute(r,lane){if(lane===r.lane)return;r.lane=Math.max(0,Math.min(4,lane));r.held=0;r.pulse=0;r.progress=1-cellState(r).hp/cellState(r).max;}
function rewards(save,r,cell,gentle){
 if(cell.paid)return;cell.paid=true;r.mined++;const kind=cell.kind,rock=ROCKS[kind],head=HEADS[save.head];
 let amount=rock.value*(1+r.stage.arc*.25)*oreValueMultiplier(save,r,kind);
 if(kind==='X'){r.stats.crystal++;if(gentle)r.stats.quality++;else amount*=.65;if(head.trait==='crystal')amount*=1.6;}
 if(kind==='C')r.stats.copper++;if(kind==='G')r.stats.gold++;if(kind==='W')r.stats.coolant++;if(kind==='L')r.stats.magma++;
 r.value+=Math.floor(amount);r.cargo+=rock.weight;
 r.events.push({type:'break',kind,value:Math.floor(amount),lane:cell.lane,row:cell.row-r.row,gentle});
 onOre(save,r,kind,gentle,cell.row+1);
}
function checkLoad(save,r){
 if(r.hull<=0){settle(save,r,'hull');return;}
 if(r.auto&&r.hull<=20){settle(save,r,'service');return;}
 if(r.pressure>=100){settle(save,r,'pressure');return;}
 if(r.cargo>=capacity(save)){save.coins=Math.min(1e9,save.coins+r.value);r.banked+=r.value;bankMaterials(save,r);bankSaleStats(save,r,r.value);r.value=0;r.cargo=0;r.docking=save.auto.sell?0:1.5;r.drilling=false;r.events.push({type:'sold'});}
}
function surveyStop(save,r){
 save.coins=Math.min(1e9,save.coins+r.value);r.banked+=r.value;bankMaterials(save,r);bankSaleStats(save,r,r.value);r.value=0;r.cargo=0;
 r.hull=100;r.pressure=0;r.smartVenting=false;r.helperVenting=false;r.venting=false;r.docking=save.auto.sell?0:1.5;r.drilling=false;
 save.best=Math.max(save.best,(r.stage.id-1)*100+Math.floor(r.depth/r.stage.target*100));saveJourney(save,r);
 r.events.push({type:'checkpoint',section:r.row/r.stage.sectionLayers,depth:r.depth});
}
function advanceRow(save,r){
 r.row++;r.depth=r.row*5;r.progress=0;if(r.stage.pressure)r.pressure=Math.min(100,r.pressure+10);
 triggerExpeditionEvent(save,r);
 for(const [id,cell] of Object.entries(r.tiles))if(cell.row<r.row-2||cell.row>r.row+4)delete r.tiles[id];
 checkLoad(save,r);
 if(!r.ended&&r.depth>=r.stage.target)settle(save,r,'complete');
 else if(!r.ended&&r.row%r.stage.sectionLayers===0)surveyStop(save,r);
}
export function tick(save,r,dt,held){
 if(r.ended||r.paused)return;dt=Math.max(0,Math.min(.05,finite(dt)));
 if(r.docking>0){r.docking=Math.max(0,r.docking-dt);r.time+=dt;r.drilling=false;r.pilotStatus='礦艙輸送中';return;}
 const head=HEADS[save.head],up=save.upgrades,intent=stepSystems(save,r,dt,held);r.hitTTL=Math.max(0,r.hitTTL-dt);automaticTool(save,r,cellState(r));
 if(r.beamTarget){const target=r.beamTarget;r.beamTarget=null;const cell=cellState(r,target.row,target.lane);cell.hp=0;rewards(save,r,cell,true);r.events.push({type:'beam',lane:target.lane,row:target.row-r.row});checkLoad(save,r);if(!r.ended&&target.row===r.row&&target.lane===r.lane)advanceRow(save,r);return;}
 r.autoCooling=r.smartVenting;
 if(r.pressure>=24)r.helperVenting=true;if(r.pressure<4)r.helperVenting=false;
 const helper=save.helpers>0&&r.helpersOn&&!r.helperVenting&&!r.smartVenting&&intent&&!activeSeal(r);
 const drilling=(intent||helper)&&!r.autoCooling;r.drilling=drilling;
 if(!drilling){if(r.seal&&r.stage.arc===1)r.seal.needsRelease=false;r.held=0;r.pulse=0;r.helperPulse=0;
  if(r.pressure>=20&&!r.venting){r.stats.vent++;r.venting=true;}
  r.pressure=Math.max(0,r.pressure-dt*(save.auto.cool?48:32));if(r.pressure<8)r.venting=false;return;}
 r.held=intent?r.held+dt:0;const cell=cellState(r),kind=cell.kind;r.lastKind=kind;
 if(r.stage.pressure)r.pressure=Math.min(100,r.pressure+dt*(kind==='L'?16:8));
 if(r.pressure>=100){settle(save,r,'pressure');return;}
 if(cell.hp<=0){advanceRow(save,r);return;}
 let damage=0,actor='drill';
 if(intent){r.pulse-=dt;if(r.pulse<=0){const automatic=!held;r.pulse=1/(5*(1+up.speed*.12)*(automatic?(1+up.autoSpeed*.18)*(save.auto.smart?1.12:1):1));damage=22*head.power*(1+up.power*.25)*(1+up.cooling*.12)*(automatic?(1+up.autoPower*.2)*(save.auto.drill?1.25:1):1)*rateMultiplier(save,r)*(head.trait==='stone'&&kind==='S'?1.4:1);}}
 if(helper){r.helperPulse-=dt;if(r.helperPulse<=0){r.helperPulse=.5;damage+=12*save.helpers*(1+up.helperPower*.25);if(!intent)actor='helper';}}
 if(damage>0){const actual=Math.min(cell.hp,damage);cell.hp=Math.max(0,cell.hp-damage);r.hitTTL=.09;r.events.push({type:'hit',lane:r.lane,row:0,damage:Math.ceil(actual),actor,seal:activeSeal(r)});}
 r.progress=1-cell.hp/cell.max;
 if(cell.hp>0)return;
 if(activeSeal(r)){if(!sealContact(save,r)){cell.hp=cell.max;r.progress=0;return;}cell.hp=0;}
 const gentle=kind==='X'&&r.held<=(equipped(save,'prism')?2.4:1.5);rewards(save,r,cell,gentle);advanceRow(save,r);
}
