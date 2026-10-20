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
 function purchase(type,key){if(buy(s,type,key)){onChange();feedback('改裝完成，裝備與補給已保存',true);}else feedback(type==='fabricate'?'回收零件不足、補給已滿，或尚未解鎖對應礦區':type==='module'?'需要足夠金幣、銅礦與水晶，並解鎖對應礦區':'金幣不足，或尚未解鎖對應礦區',false);}
 if(tab==='rig'){
  title('01 / 鑽頭：依地層選擇工具');HEADS.forEach((h,i)=>card({image:images[i],name:h.zh,desc:['可靠的起步鑽頭 · 均衡型','一般岩石鑽速額外 +40% · 減少玄武岩磨損','水晶收入 +60% · 基礎鑽力 ×2.1','熔岩接觸產熱降低 75% · 基礎鑽力 ×2.8'][i],label:s.head===i?'已裝備':s.heads.includes(i)?'裝備':`${h.price} 金`,disabled:s.head===i,id:`head-${i}`,action:()=>purchase('head',i)}));
  title('02 / 永久升級');Object.entries(UPGRADES).forEach(([k,u],i)=>card({image:images[`module:${['scanner','coil','exchanger','compressor'][i]}`],name:`${u.zh} Lv.${s.upgrades[k]}`,desc:{power:'每級 +0.2 基礎鑽力',speed:'每級 +12% 轉速',cooling:'降低產熱，加快冷卻',cargo:'每級增加 12 格礦艙'}[k],label:s.upgrades[k]>=20?'已滿級':`${upgradeCost(s,k)} 金`,disabled:s.upgrades[k]>=20,id:`upgrade-${k}`,action:()=>purchase('upgrade',k)}));
  title('03 / 自動化');Object.entries(AUTO).forEach(([k,a])=>card({image:images[`module:${k==='drill'?'coil':k==='cool'?'exchanger':k==='smart'?'scanner':'compressor'}`],name:a.zh,desc:{drill:'持續鑽掘，可隨時關閉；冷卻與導航另購',cool:'高熱與高壓時停鑽，安全後繼續',sell:'滿艙即出售礦物與材料，不需中止探勘',smart:'第 6 區解鎖：自動選路、短按水晶與辨認封印'}[k],label:s.auto[k]?'已購買':`${a.price} 金`,disabled:s.auto[k],id:`auto-${k}`,action:()=>purchase('auto',k)}));
  if(s.auto.smart){const row=document.createElement('label');row.className='policy-row';row.textContent='智慧導航策略';const select=document.createElement('select');select.id='pilotPolicy';for(const [value,label] of [['mission','任務優先'],['safe','安全優先'],['value','收益優先']])select.add(new Option(label,value));select.value=s.policy;select.onchange=()=>{s.policy=select.value;onChange();feedback('導航策略已保存',true);};row.append(select);root.append(row);}
  title('04 / 遠征補給');Object.entries(TOOLS).forEach(([id,t])=>card({image:images[`tool:${id}`],name:`${t.name} ×${s.tools[id]}`,desc:`第 ${t.min} 區解鎖 · ${t.desc}`,label:`${t.price} 金 / 1`,id:`tool-${id}`,action:()=>purchase('tool',id)}));
 }
 if(tab==='modules'){
  copy('兩個模組插槽',`已裝備：${s.equipped.map(id=>MODULES[id].name).join('、')||'尚未裝備'}。可以自由卸下；兩槽滿時，新模組會替換最早裝備的一件。`);
  Object.entries(MODULES).forEach(([id,m])=>card({image:images[`module:${id}`],name:m.name,desc:`${m.desc} 製作：${m.cost} 金、銅 ${m.copper}、晶 ${m.crystal}。第 ${m.min} 區解鎖。`,label:s.modules.includes(id)?s.equipped.includes(id)?'卸下':s.equipped.length>=2?'替換最早':'裝備':`${m.cost} 金製作`,id:`module-${id}`,action:()=>{if(s.modules.includes(id)){equipModule(s,id);onChange();feedback('模組插槽已更新',true);}else purchase('module',id);}}));
  title('回收工坊 / 用零件製作補給');Object.entries(TOOLS).forEach(([id,t])=>card({image:images[`tool:${id}`],name:`${t.name} ×${s.tools[id]}`,desc:`可用回收零件替代金幣購買。${t.desc}`,label:`${({coolant:2,blast:5,repair:4})[id]} 零件製作`,id:`fabricate-${id}`,action:()=>purchase('fabricate',id)}));
 }
 if(tab==='crew'){
  copy('遠征夥伴',`一次帶一位夥伴同行。${s.activeCrew?`目前：${CREW[s.activeCrew].name}。`:'目前由菲亞單獨駕駛。'}招募永久保留，切換夥伴不需花費。`);
  Object.entries(CREW).forEach(([id,c])=>card({image:c.portrait,name:`${c.name} · ${c.role}`,desc:`${c.desc} 第 ${c.min} 區解鎖。`,crew:true,label:s.activeCrew===id?'同行中':s.crew.includes(id)?'邀請同行':`${c.cost} 金招募`,disabled:s.activeCrew===id,id:`crew-${id}`,action:()=>{if(s.crew.includes(id)){s.activeCrew=id;onChange();feedback('夥伴已加入本次遠征',true);}else purchase('crew',id);}}));
  if(s.activeCrew)card({image:'/assets/weightplay-character-spark-paw-fox-block-v1.webp',name:'菲亞的獨行遠征',desc:'只帶鑽機和自己，暫時不啟用夥伴加成。',label:'單獨出發',action:()=>{s.activeCrew=null;onChange();feedback('已切換為獨行遠征',true);}});
 }
 if(tab==='records'){
  if(s.ending)copy('終章 / 地心的第一縷晨光',`${REGIONS[5].discovery}\n主線完成。所有已解鎖礦區仍可重訪，挑戰更快通關與三顆勘探星。`);
  copy('遠征紀錄',`最深 ${s.best}m · 完成 ${s.cleared.length}/30 區 · 已出售礦石 ${s.total.ore} · 採礦收入 ${s.total.earned} 金 · 已返航 ${s.total.trips} 次。`);
  title('01 / 成就獎勵');ACHIEVEMENTS.forEach(a=>{const count=metric(s,a.metric),claimed=s.claimed.includes(a.id),ready=count>=a.target;card({image:images.E,name:a.name,desc:`${a.desc}（${Math.min(count,a.target)}/${a.target}）`,label:claimed?'已領取':ready?`領取 ${a.reward} 金`:'尚未完成',disabled:claimed||!ready,id:`claim-${a.id}`,action:()=>{if(claimAchievement(s,a.id)){onChange();feedback(`成就獎勵 +${a.reward} 金`,true);}}});});
  title('02 / 地層封印與文明檔案');REGIONS.forEach((r,i)=>{const owned=s.relics.includes(i);card({image:images[`relic:${i}`],name:owned?r.relic:'尚未取得的遺物',desc:owned?r.discovery:`突破第 ${(i+1)*5} 區的${r.seal}。`,label:owned?'已收藏':'未發現',disabled:true});});
  title('03 / 礦物圖鑑');const grid=document.createElement('div');grid.className='codex-grid';Object.entries(ROCKS).forEach(([id,ore])=>{const found=s.discovered.includes(id),node=document.createElement('article');node.className=`codex-card ${found?'':'unknown'}`;const img=new Image();img.src=images[id];img.alt=found?ore.zh:'未發現礦物';const b=document.createElement('b'),small=document.createElement('small'),text=document.createElement('div');b.textContent=found?ore.zh:'未發現';small.textContent=found?`基礎 ${ore.value} 金 · ${ore.heat<0?'降溫':`產熱 ${ore.heat}`}`:'隨遠征逐步發現';text.append(b,small);node.append(img,text);grid.append(node);});root.append(grid);
  title('04 / 六大礦域');REGIONS.forEach((r,i)=>{if(s.unlocked>=i*5+1)copy(`${String(i+1).padStart(2,'0')} / ${r.name}`,r.intro);});
 }
}
