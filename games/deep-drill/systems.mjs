import {STAGES,ROCKS,seams} from './stages.mjs';
import {REGIONS,MODULES,CREW,TOOLS,ACHIEVEMENTS,EXPEDITION_EVENTS} from './content.mjs';
const bounded=(v,max=1e9)=>Math.max(0,Math.min(max,Math.floor(Number.isFinite(Number(v))?Number(v):0)));
const unique=(value,keys)=>[...new Set((Array.isArray(value)?value:[]).filter(x=>keys.includes(x)))];
export function migrate(s,raw){
 s.schema=4;s.toolBudget=[0,1,3,5].includes(raw.toolBudget)?raw.toolBudget:0;s.helpers=bounded(raw.helpers,3);s.materials=Object.fromEntries(['copper','crystal','salvage','core'].map(k=>[k,bounded(raw.materials?.[k])]));
 s.modules=unique(raw.modules,Object.keys(MODULES));s.equipped=unique(raw.equipped,s.modules).slice(0,2);
 s.crew=unique(raw.crew,Object.keys(CREW));s.activeCrew=s.crew.includes(raw.activeCrew)?raw.activeCrew:null;
 s.tools=Object.fromEntries(Object.keys(TOOLS).map(k=>[k,raw.tools?bounded(raw.tools[k],99):['coolant','beam'].includes(k)?2:0]));
 s.total=Object.fromEntries(['trips','ore','earned','tools','vents'].map(k=>[k,bounded(raw.total?.[k])]));
 s.claimed=unique(raw.claimed,ACHIEVEMENTS.map(a=>a.id));s.discovered=unique(raw.discovered,Object.keys(ROCKS));
 s.relics=unique([...(Array.isArray(raw.relics)?raw.relics:[]),...s.cleared.filter(id=>id%5===0).map(id=>id/5-1)],REGIONS.map((_,i)=>i));
 s.records={};for(const [id,record] of Object.entries(raw.records||{})){if(+id>=1&&+id<=30&&record&&typeof record==='object')s.records[id]={stars:bounded(record.stars,3),time:bounded(record.time,36000)};}
 s.ending=s.cleared.includes(30);s.auto.smart=raw.auto?.smart===true;
 s.policy=['safe','value','mission'].includes(raw.policy)?raw.policy:'mission';
 if(s.cleared.length)s.unlocked=Math.min(30,Math.max(s.unlocked,Math.max(...s.cleared)+1));
 return s;
}
export const equipped=(s,id)=>s.equipped?.includes(id);
export function extraCapacity(s){return (equipped(s,'compressor')?24:0)+(s.activeCrew==='bubble'?10:0);}
export function systemBuy(s,type,key){
 if(type==='helper'){if(key!=='miner'||s.helpers>=3)return false;const price=Math.round(120*1.8**s.helpers);if(s.coins<price)return false;s.coins-=price;s.helpers++;return true;}
 const table={module:MODULES,crew:CREW,tool:TOOLS,fabricate:TOOLS};if(!Object.hasOwn(table,type)||!Object.hasOwn(table[type],key))return false;const item=table[type][key];
 if(s.unlocked<item.min)return false;
 const owned=type==='module'?s.modules:type==='crew'?s.crew:null;
 if(owned?.includes(key))return false;if(['tool','fabricate'].includes(type)&&s.tools[key]>=99)return false;
 const parts={coolant:2,blast:5,repair:4,beam:6}[key];if(type==='fabricate'&&s.materials.salvage<parts)return false;
 const price=type==='fabricate'?0:item.cost??item.price;if(s.coins<price)return false;
 if(type==='module'&&((s.materials.copper<(item.copper||0))||(s.materials.crystal<(item.crystal||0))))return false;
 s.coins-=price;
 if(type==='module'){s.materials.copper-=item.copper||0;s.materials.crystal-=item.crystal||0;s.modules.push(key);}
 if(type==='crew'){s.crew.push(key);s.activeCrew=key;}
 if(type==='fabricate')s.materials.salvage-=parts;
 if(['tool','fabricate'].includes(type))s.tools[key]++;
 return true;
}
export function equipModule(s,id){if(!s.modules.includes(id))return false;if(s.equipped.includes(id))s.equipped=s.equipped.filter(x=>x!==id);else{if(s.equipped.length>=2)s.equipped.shift();s.equipped.push(id);}return true;}
export function metric(s,key){return ({heads:s.heads.length,relics:s.relics.length,modules:s.modules.length,depth:s.best,clears:s.cleared.length})[key]??s.total[key]??0;}
export function claimAchievement(s,id){const a=ACHIEVEMENTS.find(a=>a.id===id);if(!a||s.claimed.includes(id)||metric(s,a.metric)<a.target)return false;s.claimed.push(id);s.coins=Math.min(1e9,s.coins+a.reward);return true;}
export function initializeRun(s,r){return Object.assign(r,{time:0,hull:100,buff:0,frost:0,toolsUsed:0,toolCooldown:0,
 materials:{copper:0,crystal:0,salvage:0,core:0},bankedMaterials:{copper:0,crystal:0,salvage:0,core:0},bankedOre:0,finalEarned:0,autoThink:0,plannedRow:-1,toolAllowance:s.toolBudget,abilityCooldowns:{beam:0,blast:0,repair:0,coolant:0},pilotStatus:"自動探礦",smartVenting:false,forceBreak:false,drilling:false,triggered:[],
 seal:r.stage.checkpoint?{phase:0,time:0,usedVents:0,hitFlash:0}:null});}
export function activeSeal(r){return Boolean(r.seal&&r.row===19&&r.seal.phase<3);}
export function sealState(r){
 if(!activeSeal(r))return null;const b=r.seal,a=r.stage.arc;
 const targets=[[0,2,1],[1,0,2],[0,1,2],[2,0,1],[0,1,2],[1,2,0]];
 const lane=a===2?(Math.floor(b.time/5)+b.phase)%3:targets[a][b.phase];
 const open=a!==2||b.time%5>2.2;
 return {lane:lane+1,open,phase:b.phase,name:REGIONS[a].seal,hint:REGIONS[a].hint,
  status:a===0?`鎖片 ${b.phase+1}/3 · 對準發光鎖片`:a===1?(b.needsRelease?'鬆開下鑽，讓泵閥回彈':'對準發光泵芯，三次鑽開水道'):a===2?(open?'冷卻窗開啟！':'護罩啟動，等待冷卻窗'):a===3?'每次短按少於 1 秒，保護晶環':a===4?'先洩壓，再啟動閥門':b.phase===0?'第一階段：對準發光外殼':b.phase===1?'第二階段：每次短按少於 1.2 秒':'第三階段：洩壓後啟動燈塔'};
}
export function runSeams(r,offset=0){const state=offset===0&&sealState(r);if(state){const out=['B','B','B','B','B'];out[state.lane]=['E','W','L','X','D','E'][r.stage.arc];return out;}return seams(r.stage,r.row+offset);}
export function sealContact(s,r){
 const state=sealState(r);if(!state)return true;const b=r.seal,a=r.stage.arc;
 let reason='';if(r.lane!==state.lane)reason='這裡是護甲，請對準發光弱點';
 else if(a===1&&b.needsRelease)reason='泵閥需要回彈：鬆開下鑽後再啟動下一座泵';
 else if(a===2&&!state.open)reason='護罩尚未打開，等待冷卻窗';
 else if((a===3&&r.held>1)||(a===5&&b.phase===1&&r.held>1.2))reason='鑽擊太長，鬆開後用短促脈衝';
 else if((a===4||(a===5&&b.phase===2))&&r.stats.vent<=b.usedVents){r.pressure=Math.min(88,r.pressure+18);reason='閥門仍鎖住：累壓至 20% 後鬆開洩壓';}

 r.progress=0;
 if(reason){r.events.push({type:'seal-block',text:reason});return false;}
 b.phase++;if(a===1)b.needsRelease=true;b.usedVents=r.stats.vent;b.hitFlash=.5;r.pressure*=.35;r.value+=25;r.events.push({type:'seal-hit',phase:b.phase,lane:r.lane,text:b.phase===3?'封印解除！':`封印鬆開：${b.phase}/3`});
 return b.phase>=3;
}
export function bankMaterials(s,r,fraction=1){for(const key of Object.keys(r.materials)){const value=Math.floor(r.materials[key]*fraction);s.materials[key]=Math.min(1e9,s.materials[key]+value);r.bankedMaterials[key]+=value;r.materials[key]=0;}}
export function bankSaleStats(s,r,coins){s.total.ore=Math.min(1e9,s.total.ore+r.mined-r.bankedOre);r.bankedOre=r.mined;s.total.earned=Math.min(1e9,s.total.earned+coins);}
export function rescueFraction(s){return equipped(s,'beacon')||s.activeCrew==='bubble'?.9:.65;}
export function settleSystems(s,r,reason,first){
 bankMaterials(s,r,['pressure','hull'].includes(reason)?rescueFraction(s):1);
 s.total.trips++;bankSaleStats(s,r,r.finalEarned);s.total.vents+=r.stats.vent;
 if(r.clear){const stars=1+(r.hull>=60?1:0)+(r.toolsUsed===0?1:0),old=s.records[r.stage.id];s.records[r.stage.id]={stars:Math.max(old?.stars||0,stars),time:Math.min(old?.time||36000,Math.ceil(r.time))};
  if(r.stage.checkpoint&&!s.relics.includes(r.stage.arc)){s.relics.push(r.stage.arc);s.materials.core++;r.events.push({type:'relic',text:`取得遺物：${REGIONS[r.stage.arc].relic}`});}
  if(r.stage.id===30)s.ending=true;
 }
}
export function useTool(s,r,key,target={row:r?.row,lane:r?.lane}){
 if(!r||r.ended||r.paused||!Object.hasOwn(TOOLS,key)||r.toolCooldown>0||s.tools[key]<=0||s.unlocked<TOOLS[key].min)return false;
 if(['blast','beam'].includes(key)){if(!Number.isInteger(target.row)||!Number.isInteger(target.lane)||target.lane<0||target.lane>4||target.row<r.row||target.row>Math.min(19,r.row+4)||r.stage.checkpoint&&target.row===19||r.tiles[`${target.row}:${target.lane}`]?.hp===0||r.beamTarget)return false;}
 if(key==='coolant'&&r.pressure<1)return false;
 if(key==='repair'&&r.hull>=100&&r.pressure<1)return false;
 s.tools[key]--;s.total.tools++;r.toolsUsed++;r.toolCooldown=.7;
 if(key==='coolant'){r.pressure=Math.max(0,r.pressure-20);}
 if(key==='repair'){r.hull=Math.min(100,r.hull+40);r.pressure=Math.max(0,r.pressure-25);}
 if(['blast','beam'].includes(key))r.beamTarget={...target};
 r.events.push({type:'tool',key,text:`${TOOLS[key].name}已使用`});return true;
}
export function onOre(s,r,kind,gentle,hitRow=r.row){
 if(!s.discovered.includes(kind))s.discovered.push(kind);
 if(kind==='C')r.materials.copper++;if(kind==='X')r.materials.crystal+=gentle?2:1;
 if(kind==='S'&&(hitRow%3===0||equipped(s,'scanner')))r.materials.salvage+=equipped(s,'scanner')?2:1;
 if(kind==='B'){r.hull=Math.max(0,r.hull-(s.head===0?8:3));r.events.push({type:'hurt',text:'玄武岩磨損機殼，合金鑽頭比較適合'});}
 if(kind==='L'){r.hull=Math.max(0,r.hull-(s.head===3?1:5));r.events.push({type:'hurt',text:s.head===3?'電漿鑽頭抵擋了大部分熔岩傷害':'熔岩燒灼機殼，試著改走冷泉路線'});}
 if(kind==='D'){r.pressure=Math.min(98,r.pressure+24);if(r.pressure>65){r.hull=Math.max(0,r.hull-9);r.events.push({type:'hurt',text:'瓦斯壓力衝擊！鬆開洩壓或使用修補包'});}}
 if(kind==='I')r.frost=4;if(kind==='E')r.buff=equipped(s,'coil')?12:6;
 if(kind==='W')r.pressure=Math.max(0,r.pressure-23);
 if(kind==='W'&&s.activeCrew==='moss'){r.hull=Math.min(100,r.hull+6);}
 if(r.stage.checkpoint&&r.row===19)r.events.push({type:'seal-start',text:`發現${REGIONS[r.stage.arc].seal}：${REGIONS[r.stage.arc].hint}`});
 const event=EXPEDITION_EVENTS[r.stage.id];if(event&&r.row===event.row&&!r.triggered.includes(event.kind)){
  r.triggered.push(event.kind);if(event.kind==='cache')s.tools.coolant=Math.min(99,s.tools.coolant+1);
  if(event.kind==='spring'){r.pressure=Math.max(0,r.pressure-30);}
  if(event.kind==='gas')r.pressure=Math.min(90,r.pressure+30);if(event.kind==='quake')r.hull=Math.max(1,r.hull-12);if(event.kind==='energy')r.buff=12;
  r.events.push({type:'discovery',text:event.text});
 }
}
export function oreValueMultiplier(s,r,kind){return (s.activeCrew==='orla'&&['G','X'].includes(kind)?1.2:1)*(kind==='S'&&equipped(s,'scanner')?2:1);}
export function rateMultiplier(s,r){return (equipped(s,'exchanger')?1.2:1)*(r.buff>0?1.35:1)*(r.frost>0?.8:1);}
export function planLane(s,r,policy=s.policy){
 const seal=sealState(r);if(seal)return seal.lane;const row=runSeams(r),stat=r.stats,q=r.stage.quota;
 if(r.pressure>50&&row.includes('W'))return row.indexOf('W');
 let want=null;switch(r.stage.goal){
  case'copper':if(stat.copper<q)want='C';break;case'gold':if(stat.gold<q)want='G';break;case'crystal':want='X';break;case'quality':want='X';break;
  case'coolant':if(stat.coolant<q)want='W';break;case'balanced':want=stat.copper<q?'C':stat.gold<Math.ceil(q/2)?'G':null;break;
  case'mastery':want=stat.quality<q?'X':stat.coolant<3?'W':null;break;
 }
 if(want&&row.includes(want))return row.indexOf(want);
 let best=0,score=-1e9;row.forEach((kind,i)=>{const ore=ROCKS[kind];let value=policy==='safe'?ore.value-(['L','D','B'].includes(kind)?50:0):ore.value/ore.hard;
  if(kind==='W')value=r.pressure>35?80:1;if(kind==='L'&&(policy==='safe'||r.stage.goal==='safe'))value=-1000;if(kind==='B'&&r.hull<40)value=-900;
  if(value>score){score=value;best=i;}});return best;
}
export function stepSystems(s,r,dt,held){
 r.time+=dt;r.buff=Math.max(0,r.buff-dt);r.frost=Math.max(0,r.frost-dt);r.toolCooldown=Math.max(0,r.toolCooldown-dt);
 for(const k of Object.keys(r.abilityCooldowns))r.abilityCooldowns[k]=Math.max(0,r.abilityCooldowns[k]-dt);
 if(activeSeal(r)){r.seal.time+=dt;r.seal.hitFlash=Math.max(0,r.seal.hitFlash-dt);}
 if(!r.auto)return held;
 const state=sealState(r);r.autoThink-=dt;
 if(r.autoThink<=0&&(r.plannedRow!==r.row||state)){
  r.autoThink=.18;r.plannedRow=r.row;const lane=planLane(s,r);
  if(lane!==r.lane){r.lane=lane;r.progress=0;r.held=0;r.pulse=0;}
 }
 const needsVent=r.stage.goal==='vent'||r.stage.goal==='mastery'||(state&&(r.stage.arc===4||(r.stage.arc===5&&state.phase===2)));
 if(r.pressure>=(needsVent?24:70))r.smartVenting=true;
 if(r.pressure<4)r.smartVenting=false;
 if(r.smartVenting){r.pilotStatus='自動洩壓 · 保護機殼';return false;}
 if(state&&r.stage.arc===1&&r.seal.needsRelease){r.pilotStatus='泵閥回彈中';return false;}
 if(state&&r.stage.arc===2&&!state.open){r.pilotStatus='等待封印冷卻窗';return false;}
 const crystal=runSeams(r)[r.lane]==='X'||state&&(r.stage.arc===3||r.stage.arc===5&&state.phase===1);
 if(crystal&&r.held>.6){r.pilotStatus='晶體脈衝保護';return false;}
 r.pilotStatus=state?'自動破解封印':r.buff>0?'能量加速！':'自動探礦 · 任務優先';
 return true;
}
export function automaticTool(s,r,cell){
 if(!r.auto||r.toolAllowance<=r.toolsUsed||r.toolCooldown>0||activeSeal(r))return false;
 const kind=cell.kind;
 const candidates=[['repair',r.hull<=35],['coolant',r.pressure>=85],['blast',!r.smartVenting&&kind==='B'&&cell.hp>120],['beam',!r.smartVenting&&!['X','W','L','D'].includes(kind)&&cell.hp>180]];
 for(const [key,needed] of candidates)if(needed&&!r.abilityCooldowns[key]&&useTool(s,r,key,{row:r.row,lane:r.lane})){
  r.abilityCooldowns[key]={repair:10,coolant:8,beam:8,blast:20}[key];return true;
 }
 return false;
}
