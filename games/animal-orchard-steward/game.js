import {COPY,LOCALES} from './copy.mjs?v=20261023-orchard-v6';
import {SAVE_KEY,FRUITS,TOOLS,CONTRACTS,clone,normalize,startRun,contract,forecast,projected,healthy,care,harvest,sunset,buyEquipment} from './model.mjs?v=20261023-orchard-v6';
import {OrchardScene} from './scene.mjs?v=20261023-orchard-v6';
const $=id=>document.getElementById(id);
const routeMap={'zh-tw':'zh-Hant','zh-cn':'zh-Hans','pt-br':'pt-BR'};
const route=location.pathname.split('/')[1];
const locale=routeMap[route]||(LOCALES.includes(route)?route:document.documentElement.lang)||'en';
const c=COPY[locale]||COPY.en;
const t=key=>c[key]||key;
const storage={get(key){try{return localStorage.getItem(key);}catch{return null;}}};
let profile=normalize(storage.get(SAVE_KEY),storage.get('weightplay-orchard-steward-best'));
let frame,scene,active='main',modal=null,returnFocus=null,saveAvailable=true;
const animations=new Set();const flights=new Set();
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const total=()=>profile.run?.harvest.reduce((a,b)=>a+b,0)||0;
const audio=cue=>window.WeightPlayAudio?.play(cue);
const names=['sun','water','soil'];
const glyphs=['☀','≋','▥'];
function deltaMarkup(values) {return values.map((n,i)=>`<span title="${t(names[i])}">${glyphs[i]}${n>0?'+':''}${n}</span>`).join(' · ');}
function clearEffects(){animations.forEach(a=>a.cancel());animations.clear();flights.forEach(n=>n.remove());flights.clear();}
function animate(node,keyframes,options={}) {
 if(!node||reduced.matches)return;
 const a=node.animate(keyframes,{duration:180,easing:'ease-out',...options});animations.add(a);
 a.finished.then(()=>animations.delete(a),()=>animations.delete(a));return a;
}
function save(){
 try{localStorage.setItem(SAVE_KEY,JSON.stringify(profile));saveAvailable=true;return true;}
 catch{saveAvailable=false;return false;}
}
function message(text){$('feedback').textContent=text;}
function applyCopy(){
 document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';
 document.querySelectorAll('[data-copy]').forEach(n=>n.textContent=t(n.dataset.copy));
 const title=window.WEIGHTPLAY_GAME_TITLES?.['animal-orchard-steward']?.[locale];
 if(title){document.title=`${title} | WeightPlay`;$('mainTitle').textContent=title;}
 $('homeFromBattle').setAttribute('aria-label',t('main'));
 $('orchardCanvas').setAttribute('aria-label',`${t('apple')} · ${t('pear')} · ${t('orange')}`);
}
function buildControls(){
 $('meters').innerHTML=names.map((name,i)=>`<div class="meter-row"><div class="meter-label"><span>${t(name)}</span><span class="meter-value" id="value${i}"></span></div><div class="meter-track" role="meter" aria-label="${t(name)}" aria-valuemin="0" aria-valuemax="8" id="meter${i}"><div class="meter-fill" id="fill${i}"></div><div class="meter-goal" id="goal${i}"></div></div></div>`).join('');
 $('actions').innerHTML=TOOLS.map((tool,i)=>`<button class="action-button" type="button" data-action="${tool.id}" ${i===0?'data-wp-primary-action':''}><span class="action-art action-art-${tool.art}" aria-hidden="true"></span><span class="action-name">${t(['watering','compost','canopy'][i])}</span><span class="action-delta" id="delta${i}"></span></button>`).join('');
 $('treeTargets').innerHTML=FRUITS.map((f,i)=>`<button class="tree-button" type="button" id="tree${i}" data-tree="${i}"><strong>${t(f.id)}</strong><span></span></button>`).join('');
 $('fruitGuide').innerHTML=FRUITS.map(f=>`<p><strong>${t(f.id)}</strong> · ${f.bands.map(([lo,hi],i)=>`${t(names[i])} ${lo}–${hi}`).join(' · ')}</p>`).join('');
 const shop=[['compost','compostUpgrade','compostEffect',20,'shade'],['crates','cratesUpgrade','cratesEffect',30,'basket'],['gold','golden','goldEffect',8,'diamond']];
 $('shopItems').innerHTML=shop.map(([id,title,effect,cost,art])=>`<article class="shop-item">${art==='shade'?'<span class="action-art action-art-shade" aria-hidden="true"></span>':`<img src="/assets/${art==='diamond'?'weightplay-diamond.svg':'animal-vine-basket.png'}" alt="">`}<div><h3>${t(title)}</h3><p>${t(effect)}</p></div><button type="button" data-buy="${id}" data-cost="${cost}"></button></article>`).join('');
}
function progress(){
 const run=profile.run;
 $('mainProgress').textContent=saveAvailable?`${t('season')} ${profile.completed+1} · ${t('day')} ${run&&!run.ended?run.day:1} / 8${profile.legacyBest?` · ${t('legacy')} ${profile.legacyBest}/3`:''}`:t('saveError');
}
function render(event=''){
 progress();const run=profile.run;if(!run)return;
 const co=contract(run),current=CONTRACTS[run.contract].weather[run.day-1];
 $('dayLabel').innerHTML=`<span>${t('day')}</span><strong>${run.day}/8</strong>`;
 $('leafCount').innerHTML=`<span>${t('harvest')}</span><strong>${total()}/${co.total}</strong>`;
 $('contractName').textContent=t(['first','rainy','dry','festival'][run.contract]);
 $('orderText').textContent=`${t('target')} ${co.total}${co.fruit===null?'':co.fruit==='all'?` · ${t('apple')}/${t('pear')}/${t('orange')} ${co.quota}`:` · ${t(FRUITS[co.fruit].id)} ${co.quota}`}`;
 $('weatherName').textContent=t(current==='sun'?'sunny':current);
 $('weatherEffect').innerHTML=`${t('forecast')} ${deltaMarkup(forecast(run).delta)}`;
 $('careCount').textContent=`${t('actions')} ${run.actions}/2`;
 const expected=projected(run);$('growthPreview').textContent=`${t('grow')} ${FRUITS.filter((f,i)=>healthy(expected,i)).length}/3`;
 names.forEach((_,i)=>{
   $('value'+i).textContent=`${run.resources[i]} / 8`;$('meter'+i).setAttribute('aria-valuenow',run.resources[i]);$('fill'+i).style.width=`${run.resources[i]/8*100}%`;
   const [lo,hi]=FRUITS[run.selected].bands[i];$('goal'+i).style.left=`${lo/8*100}%`;$('goal'+i).style.width=`${(hi-lo)/8*100}%`;
 });
 TOOLS.forEach((tool,i)=>{const delta=[...tool.delta];if(tool.id==='compost'&&profile.compost)delta[2]++;$('delta'+i).innerHTML=deltaMarkup(delta);const button=document.querySelector(`[data-action="${tool.id}"]`);button.setAttribute('aria-disabled',String(!run.actions||run.lastPicking||run.ended));button.setAttribute('aria-label',`${t(['watering','compost','canopy'][i])}: ${delta.map((n,j)=>`${t(names[j])} ${n>0?'+':''}${n}`).join(', ')}`);});
 FRUITS.forEach((f,i)=>{const button=$('tree'+i),ready=run.growth[i]>=2;button.classList.toggle('is-ready',ready);button.setAttribute('aria-pressed',String(run.selected===i));button.querySelector('span').textContent=ready?t('ready'):`${t('grow')} ${run.growth[i]}/2`;});
 const selected=FRUITS[run.selected];$('treeInfo').innerHTML=`<b>${t(selected.id)}</b> ${selected.bands.map(([lo,hi],i)=>`<span>${t(names[i])} ${lo}–${hi}</span>`).join('')}`;
 $('nextDay').textContent=t(run.lastPicking?'settle':'sunset');
 if(run.lastPicking)message(t('finalPick'));
 if(event)scene?.update(profile,event);else scene?.update(profile);
 if(modal==='shopDialog')renderShop();
}
function showMain(){
 clearEffects();modal=null;document.querySelectorAll('.orchard-modal').forEach(n=>n.hidden=true);
 $('mainView').hidden=false;$('battleView').hidden=true;$('battleContent').inert=false;
 document.querySelectorAll('.game-page-info').forEach(n=>n.hidden=false);
 document.body.dataset.screen='main';document.body.dataset.wpOverlay='';active='main';scene?.setActive(false);frame.activate('main');progress();
 window.scrollTo(0,0);$('startButton').focus({preventScroll:true});
}
function enter(index){
 if(Number.isInteger(index)||!profile.run||profile.run.ended){startRun(profile,index);save();}
 $('mainView').hidden=true;document.querySelectorAll('.game-page-info').forEach(n=>n.hidden=true);
 document.querySelectorAll('.orchard-modal').forEach(n=>n.hidden=true);modal=null;$('battleView').hidden=false;$('battleContent').inert=false;
 document.body.dataset.screen='battle';document.body.dataset.wpOverlay='';active='battle';frame.activate('battle');scene.setActive(true);render('entry');
 message(saveAvailable?`${t('forecast')} · ${t('actions')} ${profile.run.actions}/2`:t('saveError'));
 document.querySelector('[data-action]')?.focus({preventScroll:true});
}
function canAct(){return active==='battle'&&!modal&&!document.hidden;}
function doCare(id){
 if(!canAct())return;
 if(!care(profile,id)){message(t('noActions'));audio('feedback.error');return;}
 save();render('care');const tool=TOOLS.find(a=>a.id===id);audio(tool.cue);
 animate(document.querySelector(`[data-action="${id}"]`),[{filter:'brightness(1.4)'},{filter:'brightness(1)'}]);
 message(profile.run.actions?`${t('actions')} ${profile.run.actions}/2`:t('noActions'));
}
function fly(index,amount){
 const start=$('tree'+index).getBoundingClientRect(),end=$('leafCount').getBoundingClientRect();
 animate($('leafCount'),[{filter:'brightness(2)'},{filter:'brightness(1)'}],{duration:320});
 if(reduced.matches||!start.width||!end.width)return;
 const node=document.createElement('img');node.src='/assets/animal-vine-basket.png';node.className='harvest-flight';node.alt='';
 if(profile.gold)node.style.filter='sepia(1) saturate(4) drop-shadow(0 0 6px #ffda62)';
 node.style.left=`${start.x+start.width/2-14}px`;node.style.top=`${start.y}px`;document.body.append(node);flights.add(node);
 const x=end.x+end.width/2-start.x-start.width/2,y=end.y-start.y;
 const a=animate(node,[{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${x*.5}px,${y*.5-45}px) scale(1.3)`,opacity:1},{transform:`translate(${x}px,${y}px) scale(.4)`,opacity:0}],{duration:550,easing:'cubic-bezier(.2,.65,.4,1)'});
 if(a)a.finished.then(()=>{node.remove();flights.delete(node);},()=>{node.remove();flights.delete(node);});
}
function pick(index){
 if(!canAct())return;profile.run.selected=index;
 const amount=harvest(profile,index);save();render(amount?'harvest':'select');
 if(amount){audio('reward.collect');fly(index,amount);message(`${t(FRUITS[index].id)} +${amount} · ${t('coins')} +${amount}`);}
 else message(`${t(FRUITS[index].id)} · ${t('grow')} ${profile.run.growth[index]}/2`);
}
function endDay(){
 if(!canAct())return;const result=sunset(profile);if(!result)return;save();render('sunset');
 if(result.kind==='result'){audio(result.won?'result.win':'result.lose');showResult();}
 else{audio('game.checkpoint');message(profile.run.lastPicking?t('finalPick'):`${t('grow')} ${result.growing.filter(Boolean).length}/3 · ${t('day')} ${profile.run.day}`);}
}
function openModal(id,origin){
 clearEffects();returnFocus=origin||document.activeElement;modal=id;document.body.dataset.wpOverlay=id;
 $('battleContent').inert=true;frame.activate('battle',{covered:true});scene?.setActive(false);
 $(id).hidden=false;$(id).scrollTop=0;animate($(id).firstElementChild,[{opacity:0},{opacity:1}]);
 $(id).querySelector('button:not(:disabled)')?.focus({preventScroll:true});
}
function closeModal(){
 if(!modal||modal==='resultView'||modal==='graphicsDialog')return;
 $(modal).hidden=true;modal=null;document.body.dataset.wpOverlay='';$('battleContent').inert=false;
 frame.activate('battle');scene?.setActive(!document.hidden);returnFocus?.focus({preventScroll:true});
}
function showResult(){
 $('resultSeason').textContent=t(['first','rainy','dry','festival'][profile.run.contract]);
 $('resultTitle').textContent=t(profile.run.won?'win':'lose');
 $('resultSummary').textContent=`${t('harvest')} ${total()} / ${contract(profile.run).total}`;
 $('resultFruit').innerHTML=FRUITS.map((f,i)=>`<div>${t(f.id)}<strong>${profile.run.harvest[i]}</strong></div>`).join('');
 $('resultBest').textContent=`${t('coins')} ${profile.coins} · ${t('harvest')} ${profile.best}`;
 $('nextSeason').disabled=!profile.run.won;window.WeightPlayScreenFrame?.ShowResultGet?.('animal-orchard-steward',false);openModal('resultView');
}
function renderShop(){
 $('coinBalance').textContent=`${t('coins')} ${profile.coins}`;$('diamondBalance').textContent=String(window.WeightPlayWallet?.read().diamonds||0);
 document.querySelectorAll('[data-buy]').forEach(button=>{const id=button.dataset.buy;button.textContent=profile[id]?t('owned'):`${t('buy')} · ${button.dataset.cost}`;button.disabled=profile[id]||!saveAvailable;});
}
function purchase(id){
 if(modal!=='shopDialog'||!saveAvailable||profile[id])return;
 const old=clone(profile);let spent=false;
 try{
  // Establish storage availability before touching the shared wallet.
  localStorage.setItem(SAVE_KEY,JSON.stringify(profile));
  if(id==='gold'){
   if(!window.WeightPlayWallet?.spendDiamonds(8)){$('shopFeedback').textContent=t('unavailable');audio('feedback.error');return;}
   spent=true;profile.gold=true;
  }else if(!buyEquipment(profile,id)){$('shopFeedback').textContent=t('unavailable');audio('feedback.error');return;}
  if(!save())throw Error('SAVE_FAILED');
  audio(id==='gold'?'shop.purchase':'reward.upgrade');$('shopFeedback').textContent=t('owned');renderShop();render('upgrade');
 }catch{
  profile=old;if(spent)window.WeightPlayWallet?.addDiamonds(8);
  saveAvailable=false;$('shopFeedback').textContent=t('saveError');renderShop();
 }
}
function graphicsFailure(){
 if(active==='battle')openModal('graphicsDialog');
 else window.WeightPlayGameEntryLoader?.fail?.(t('graphicsError'),()=>location.reload());
}
function init(){
 applyCopy();buildControls();
 // No private locale navigation: the shared Settings component owns same-game routes.
 frame=window.OrchardStewardFrame.mount();
 try{localStorage.setItem(`${SAVE_KEY}-probe`,'1');localStorage.removeItem(`${SAVE_KEY}-probe`);}catch{saveAvailable=false;}
 try{scene=new OrchardScene($('orchardCanvas'),pick,graphicsFailure);}catch(error){console.error('Orchard renderer:',error);graphicsFailure();return;}
 $('startButton').addEventListener('click',()=>enter());
 $('actions').addEventListener('click',e=>{const button=e.target.closest('[data-action]');if(button)doCare(button.dataset.action);});
 $('treeTargets').addEventListener('click',e=>{const button=e.target.closest('[data-tree]');if(button)pick(Number(button.dataset.tree));});
 $('nextDay').addEventListener('click',endDay);
 $('homeFromBattle').addEventListener('click',()=>{if(profile.run?.ended)showMain();else openModal('leaveDialog');});
 $('continueButton').addEventListener('click',closeModal);$('confirmLeaveButton').addEventListener('click',()=>{save();showMain();});
 $('helpButton').addEventListener('click',()=>openModal('helpDialog'));
 $('shopButton').addEventListener('click',()=>{renderShop();$('shopFeedback').textContent=saveAvailable?'':t('saveError');openModal('shopDialog');});
 document.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',closeModal));
 $('shopItems').addEventListener('click',e=>{const button=e.target.closest('[data-buy]');if(button)purchase(button.dataset.buy);});
 $('homeFromResult').addEventListener('click',showMain);
 $('replayButton').addEventListener('click',()=>{const index=profile.run.contract;clearEffects();enter(index);});
 $('nextSeason').addEventListener('click',()=>{if(profile.run.won){clearEffects();enter(profile.completed%CONTRACTS.length);}});
 $('reloadButton').addEventListener('click',()=>location.reload());
 document.addEventListener('keydown',e=>{
  if(!modal)return;
  if(e.key==='Escape'&&!['resultView','graphicsDialog'].includes(modal)){e.preventDefault();closeModal();return;}
  if(e.key==='Tab'){
   const controls=[...$(modal).querySelectorAll('button:not(:disabled),[tabindex="0"]')].filter(n=>n.getClientRects().length);
   const first=controls[0],last=controls.at(-1);
   if(e.shiftKey&&(document.activeElement===first||!$(modal).contains(document.activeElement))){e.preventDefault();last?.focus();}
   else if(!e.shiftKey&&(document.activeElement===last||!$(modal).contains(document.activeElement))){e.preventDefault();first?.focus();}
  }
 });
 document.addEventListener('visibilitychange',()=>{clearEffects();scene.setActive(active==='battle'&&!modal&&!document.hidden);});
 window.addEventListener('pagehide',e=>{save();clearEffects();scene.setActive(false);if(!e.persisted)scene.dispose();});
 window.addEventListener('pageshow',e=>{if(e.persisted)scene.setActive(active==='battle'&&!modal&&!document.hidden);});
 window.WeightPlayAudio?.preload(['water.splash','impact.soft','board.move','reward.collect','game.checkpoint','reward.upgrade','shop.purchase','feedback.error','result.win','result.lose']);
 $('startButton').disabled=false;showMain();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
