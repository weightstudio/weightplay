import {text as deepEnglishText} from './copy-en.mjs';
const deepEnglish=document.documentElement.dataset.deepDrillCopy==='en' && /^\/(?:weightplay\/)?en\/games\/deep-drill\/(?:index\.html)?$/.test(location.pathname);
const deepText=(key,legacy,args={})=>deepEnglish?deepEnglishText(key,{...args,legacy}):legacy;
import {HEADS,UPGRADES,AUTO,buy,upgradeCost} from './model.mjs';
import {REGIONS,MODULES,CREW,TOOLS,ACHIEVEMENTS} from './content.mjs';
import {ROCKS} from './stages.mjs';
import {equipModule,claimAchievement,metric} from './systems.mjs';
export function renderBase({s,tab,root,images,onChange,feedback}){
 root.replaceChildren();
 const title=text=>{const h=document.createElement('h3');h.textContent=text;root.append(h);};
 const copy=(name,text)=>{const div=document.createElement('section');div.className='archive-copy';const h=document.createElement('h3'),p=document.createElement('p');h.textContent=name;p.textContent=text;div.append(h,p);root.append(div);};
 function card({image,name,desc,label,action,disabled=false,crew=false,id}){
  const row=document.createElement('div');row.className='shop-card';const img=new Image();img.src=image||images.S;img.alt=name;if(crew)img.className='crew-portrait';
  const text=document.createElement('div'),b=document.createElement('b'),small=document.createElement('small');b.textContent=name;small.textContent=desc;text.append(b,small);
  const btn=document.createElement('button');btn.textContent=label;btn.disabled=disabled;if(id)btn.dataset.purchase=id;btn.onclick=action;row.append(img,text,btn);root.append(row);
 }
 function purchase(type,key){if(buy(s,type,key)){onChange();feedback(deepText("b0",'改裝完成，裝備與補給已保存'),true);}else feedback(type==='fabricate'?deepText("b1",'回收零件不足、補給已滿，或尚未解鎖對應礦區'):type==='module'?deepText("b2",'需要足夠金幣、銅礦與水晶，並解鎖對應礦區'):deepText("b3",'金幣不足，或尚未解鎖對應礦區'),false);}
 if(tab==='rig'){
  title(deepText("b4",'01 / 鑽頭：越深越需要強力鑽機'));HEADS.forEach((h,i)=>card({image:images[i],name:deepText('data',h.zh),desc:[deepText("b5",'可靠的起步鑽頭 · 均衡型'),deepText("b6",'一般岩石鑽速額外 +40% · 減少玄武岩磨損'),deepText("b7",'水晶收入 +60% · 基礎鑽力 ×2.1'),deepText("b8",'熔岩機殼傷害大幅降低 · 基礎鑽力 ×2.8')][i],label:s.head===i?deepText("b9",'已裝備'):s.heads.includes(i)?deepText("b10",'裝備'):deepText("b11",`${h.price} 金`),disabled:s.head===i,id:`head-${i}`,action:()=>purchase('head',i)}));
  title(deepText("b12",'02 / 永久升級'));Object.entries(UPGRADES).forEach(([k,u],i)=>card({image:images[`module:${['scanner','coil','exchanger','compressor'][i]}`],name:deepText('data',`${u.zh} Lv.${s.upgrades[k]}`),desc:{power:deepText("b13",'每級 +25% 基礎鑽擊傷害'),speed:deepText("b14",'每級 +12% 轉速'),cooling:deepText("b15",'每級傷害 +12% · 保留舊散熱等級'),cargo:deepText("b16",'每級增加 12 格礦艙'),autoPower:deepText("b17",'自動鑽掘每級傷害 +20%'),autoSpeed:deepText("b18",'自動鑽掘每級頻率 +18%'),helperPower:deepText("b19",'每級助手傷害 +25%')}[k],label:s.upgrades[k]>=20?deepText("b20",'已滿級'):deepText("b21",`${upgradeCost(s,k)} 金`),disabled:s.upgrades[k]>=20,id:`upgrade-${k}`,action:()=>purchase('upgrade',k)}));
  title(deepText("b22",'03 / 自動化'));Object.entries(AUTO).forEach(([k,a])=>card({image:images[`module:${k==='drill'?'coil':k==='cool'?'exchanger':k==='smart'?'scanner':'compressor'}`],name:deepText('data',a.zh),desc:{drill:deepText("b23",'基本自動鑽探免費；伺服強化再加 25% 傷害，保留舊自動鑽掘投資'),cool:deepText("b24",'基本安全洩壓免費；強化後洩壓速度由 32 提升至 48 / 秒'),sell:deepText("b25",'基本輸送滿艙停靠 1.5 秒；升級後即時運回，不需停靠'),smart:deepText("b26",'固定路線自動下鑽；第 6 區可加裝鑽探加速，鑽探頻率再加 12%')}[k],label:s.auto[k]?deepText("b27",'已購買'):deepText("b28",`${a.price} 金`),disabled:s.auto[k],id:`auto-${k}`,action:()=>purchase('auto',k)}));
  if(s.auto.smart)copy(deepText("b29",'固定路線'),deepText("b30",'鑽探加速保留 +12% 頻率；選路由你決定，不自動換路。'));
  title(deepText("b31",'04 / 採掘助手'));card({image:images['module:compressor'],name:deepText("b32",`採掘助手 ${s.helpers}/3`),desc:deepText("b33",'每位持續增加採礦傷害；會跟隨鑽機一起保護水晶、等待封印與洩壓。'),label:s.helpers>=3?deepText("b34",'已滿編'):deepText("b35",`${Math.round(120*1.8**s.helpers)} 金僱用`),disabled:s.helpers>=3,id:'helper-miner',action:()=>purchase('helper','miner')});
  title(deepText("b36",'05 / 自動備用工具（預設不消耗）'));const budget=document.createElement('label');budget.className='policy-row';budget.textContent=deepText("b37",'每趟最多消耗庫存工具 · 不會自動購買');const pick=document.createElement('select');pick.id='toolBudget';for(const n of [0,1,3,5])pick.add(new Option(n===0?deepText("b38",'關閉 · 保留庫存'):deepText("b39",`最多 ${n} 個 / 下次出發`),n));pick.value=s.toolBudget;pick.onchange=()=>{s.toolBudget=Number(pick.value);onChange();feedback(deepText("b40",'下次出發的庫存用量上限已保存'),true);};budget.append(pick);root.append(budget);
  title(deepText("b41",'庫存與補給'));Object.entries(TOOLS).forEach(([id,t])=>card({image:images[`tool:${id}`],name:deepText('data',`${t.name} ×${s.tools[id]}`),desc:deepText("b42",`第 ${t.min} 區解鎖 · ${t.desc}`),label:deepText("b43",`${t.price} 金 / 1`),id:`tool-${id}`,action:()=>purchase('tool',id)}));
 }
 if(tab==='modules'){
  copy(deepText("b44",'兩個模組插槽'),deepText("b45",`已裝備：${s.equipped.map(id=>MODULES[id].name).join('、')||'尚未裝備'}。可以自由卸下；兩槽滿時，新模組會替換最早裝備的一件。`));
  Object.entries(MODULES).forEach(([id,m])=>card({image:images[`module:${id}`],name:deepText('data',m.name),desc:deepText("b46",`${m.desc} 製作：${m.cost} 金、銅 ${m.copper}、晶 ${m.crystal}。第 ${m.min} 區解鎖。`),label:s.modules.includes(id)?s.equipped.includes(id)?deepText("b47",'卸下'):s.equipped.length>=2?deepText("b48",'替換最早'):deepText("b49",'裝備'):deepText("b50",`${m.cost} 金製作`),id:`module-${id}`,action:()=>{if(s.modules.includes(id)){equipModule(s,id);onChange();feedback(deepText("b51",'模組插槽已更新'),true);}else purchase('module',id);}}));
  title(deepText("b52",'回收工坊 / 用零件製作補給'));Object.entries(TOOLS).forEach(([id,t])=>card({image:images[`tool:${id}`],name:deepText('data',`${t.name} ×${s.tools[id]}`),desc:deepText("b53",`可用回收零件替代金幣購買。${t.desc}`),label:deepText("b54",`${({coolant:2,blast:5,repair:4,beam:6})[id]} 零件製作`),id:`fabricate-${id}`,action:()=>purchase('fabricate',id)}));
 }
 if(tab==='crew'){
  copy(deepText("b55",'遠征夥伴'),deepText("b56",`一次帶一位夥伴同行。${s.activeCrew?`目前：${CREW[s.activeCrew].name}。`:'目前由菲亞單獨駕駛。'}招募永久保留，切換夥伴不需花費。`));
  Object.entries(CREW).forEach(([id,c])=>card({image:c.portrait,name:deepText('data',`${c.name} · ${c.role}`),desc:deepText("b57",`${c.desc} 第 ${c.min} 區解鎖。`),crew:true,label:s.activeCrew===id?deepText("b58",'同行中'):s.crew.includes(id)?deepText("b59",'邀請同行'):deepText("b60",`${c.cost} 金招募`),disabled:s.activeCrew===id,id:`crew-${id}`,action:()=>{if(s.crew.includes(id)){s.activeCrew=id;onChange();feedback(deepText("b61",'夥伴已加入本次遠征'),true);}else purchase('crew',id);}}));
  if(s.activeCrew)card({image:'/assets/weightplay-character-spark-paw-fox-block-v1.webp',name:deepText("b62",'菲亞的獨行遠征'),desc:deepText("b63",'只帶鑽機和自己，暫時不啟用夥伴加成。'),label:deepText("b64",'單獨出發'),action:()=>{s.activeCrew=null;onChange();feedback(deepText("b65",'已切換為獨行遠征'),true);}});
 }
 if(tab==='records'){
  if(s.ending)copy(deepText("b66",'終章 / 地心的第一縷晨光'),deepText("b67",`${REGIONS[5].discovery}\n主線完成。所有已解鎖礦區仍可重訪，挑戰更快通關與三顆勘探星。`));
  copy(deepText("b68",'遠征紀錄'),deepText("b69",`遠征進度 ${Math.floor(s.best/100)}/30 區 · 完成 ${s.cleared.length}/30 區 · 已出售礦石 ${s.total.ore} · 採礦收入 ${s.total.earned} 金 · 已返航 ${s.total.trips} 次。`));
  title(deepText("b70",'01 / 成就獎勵'));ACHIEVEMENTS.forEach(a=>{const count=metric(s,a.metric),claimed=s.claimed.includes(a.id),ready=count>=a.target;card({image:images.E,name:deepText('data',a.name),desc:deepText('data',`${a.desc}（${Math.min(count,a.target)}/${a.target}）`),label:claimed?deepText("b71",'已領取'):ready?deepText("b72",`領取 ${a.reward} 金`):deepText("b73",'尚未完成'),disabled:claimed||!ready,id:`claim-${a.id}`,action:()=>{if(claimAchievement(s,a.id)){onChange();feedback(deepText("b74",`成就獎勵 +${a.reward} 金`),true);}}});});
  title(deepText("b75",'02 / 地層封印與文明檔案'));REGIONS.forEach((r,i)=>{const owned=s.relics.includes(i);card({image:images[`relic:${i}`],name:owned?deepText('data',r.relic):deepText("b76",'尚未取得的遺物'),desc:owned?deepText('data',r.discovery):deepText("b77",`突破第 ${(i+1)*5} 區的${r.seal}。`),label:owned?deepText("b78",'已收藏'):deepText("b79",'未發現'),disabled:true});});
  title(deepText("b80",'03 / 礦物圖鑑'));const grid=document.createElement('div');grid.className='codex-grid';Object.entries(ROCKS).forEach(([id,ore])=>{const found=s.discovered.includes(id),node=document.createElement('article');node.className=`codex-card ${found?'':'unknown'}`;const img=new Image();img.src=images[id];img.alt=found?deepText('data',ore.zh):deepText("b81",'未發現礦物');const b=document.createElement('b'),small=document.createElement('small'),text=document.createElement('div');b.textContent=found?deepText('data',ore.zh):deepText("b82",'未發現');small.textContent=found?deepText("b83",`基礎 ${ore.value} 金 · 耐久係數 ${ore.hard}`):deepText("b84",'隨遠征逐步發現');text.append(b,small);node.append(img,text);grid.append(node);});root.append(grid);
  title(deepText("b85",'04 / 六大礦域'));REGIONS.forEach((r,i)=>{if(s.unlocked>=i*5+1)copy(deepText('data',`${String(i+1).padStart(2,'0')} / ${r.name}`),deepText('data',r.intro));});
 }
}
