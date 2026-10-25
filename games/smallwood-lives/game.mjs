import {STAGES,LOCALES,ROUTES,COSMETICS,GAME_ID} from './content.mjs';
import {emptySave,newRun,createStore,clone,daily,weather,actionOptions,eventOptions,currentEvent,optionKey,act,choose,endSeason,duePromises,settle,unlocked,roomsUnlocked,setDisplay,setCosmetic} from './model.mjs';
import {CATALOGS,RAW,normalizeLocale,format,escape as esc} from './i18n.mjs';
import {SmallwoodScene} from './scene.mjs';
import {LocalPractice} from '../../src/game-local-practice.mjs';

const $=id=>document.getElementById(id),route=location.pathname.split('/').filter(Boolean)[0];
let locale=normalizeLocale(ROUTES.includes(route)?route:document.documentElement.lang),c=CATALOGS[locale];
let store,save,practiceSave=emptySave(),practicing=false,busy=false,fatal=false,scene,frame,selector,selected=0,collectionMode='album',currentResult=null,resultSaved=false,dialogReturn=null;
const state=()=>practicing?practiceSave:save,run=()=>state()?.run;
const text=(key,args)=>format(c[key]||c.unavailable,args);
const person=(key,r=run()||currentResult)=>r?.names?.[{A:1,B:2,C:3}[key]]||'';
const label=(option,r=run()||currentResult)=>format(c.action[option.id]||c.unavailable,{name:person(option.target,r)});
const sound=id=>{try{window.WeightPlayAudio?.play(id);}catch{}};
const button=(name,fn,attrs={})=>{const b=document.createElement('button');b.type='button';b.textContent=name;for(const[k,v]of Object.entries(attrs))b.setAttribute(k,v);b.addEventListener('click',fn);return b;};
const para=value=>{const p=document.createElement('p');p.textContent=value;return p;};
const freshSeed=()=>crypto.getRandomValues(new Uint32Array(1))[0];
const settingsOpen=()=>!!document.querySelector('[data-wp-frame-scene="battle"] [data-wp-settings][aria-expanded="true"]');
function copyStatic(){
 document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';
 document.querySelectorAll('[data-copy]').forEach(n=>{const value=c[n.dataset.copy];if(typeof value==='string')n.textContent=value;});
 document.querySelectorAll('[data-copy-aria]').forEach(n=>n.setAttribute('aria-label',c[n.dataset.copyAria]));
 $('mainPoster').alt=c.title;$('world').setAttribute('aria-label',c.title);
 $('localeSelect').replaceChildren(...LOCALES.map((l,i)=>new Option(window.WonderI18n?.localeLabels?.[l]||l,l)));
 $('localeSelect').value=locale;
}
function closeDialog(){if(!$('choiceDialog').open)return;$('choiceDialog').close();if(dialogReturn?.isConnected&&!dialogReturn.closest('[hidden]'))dialogReturn.focus({preventScroll:true});}
function dialog(title,body,actions=[{label:c.close,run:closeDialog}]){
 scene?.stop();dialogReturn=document.activeElement;$('dialogTitle').textContent=title;$('dialogBody').replaceChildren();
 if(typeof body==='string')$('dialogBody').append(para(body));else $('dialogBody').append(body);
 $('dialogActions').replaceChildren(...actions.map((a,i)=>button(a.label,async()=>{if(busy)return;await a.run();},{class:a.primary?'primary':'',...(a.disabled?{disabled:''}:{})})));
 if(!$('choiceDialog').open)$('choiceDialog').showModal();$('dialogActions').querySelector('button:not(:disabled)')?.focus();
}
function error(e){const key=typeof e==='string'?e:e?.message;const message=c[key]||c.saveFailed;sound('feedback.error');if(key==='otherTab')fatal=true;dialog(c.unavailable,message);$('feedback').textContent=message;}
async function transact(update){
 if(busy||fatal)return false;busy=true;
 try{if(practicing){practiceSave=await update(clone(practiceSave));practiceSave.revision++;}else save=await store.transact(update);return true;}
 catch(e){error(e);return false;}finally{busy=false;}
}
async function commitRun(reducer,animation){
 const original=run();if(!original||busy||fatal||settingsOpen())return false;
 const id=original.id,revision=original.revision;
 const ok=await transact(s=>{if(s.run?.id!==id||s.run?.revision!==revision)throw Error('otherTab');s.run=reducer(s.run);return s;});
 if(ok){renderBattle();if(animation)scene.animate(animation);sound('feedback.success');}return ok;
}
function syncMain(){
 $('mainProgress').textContent=`${save.cleared.length} / 30`;$('startBtn').textContent=save.run?c.continue:c.start;
 $('startBtn').disabled=fatal;selector?.refresh(selected);
}
function showScreen(name){
 scene?.stop();$('mainGroup').hidden=name!=='main';$('mainScreen').hidden=name!=='main';$('stageScreen').hidden=name!=='stage';$('battleScreen').hidden=name!=='battle';frame.activate(name);document.body.dataset.screen=name;
 if(name==='stage'){currentResult=null;selector.refresh(selected);if(collectionMode==='room')renderCollection();}
 if(name==='battle'){scene.resize();scene.draw();}
}
function showChapters(){
 $('chapterPage').hidden=false;$('chapterPage').classList.remove('hidden');$('collectionPage').hidden=true;
 $('chaptersTab').setAttribute('aria-pressed','true');$('collectionTab').setAttribute('aria-pressed','false');
 selector.refresh(selected);
}
function showCollection(){
 if(practicing){dialog(c.collection,c.practice);return;}
 $('chapterPage').hidden=true;$('chapterPage').classList.add('hidden');$('collectionPage').hidden=false;
 $('chaptersTab').setAttribute('aria-pressed','false');$('collectionTab').setAttribute('aria-pressed','true');renderCollection();
}
function stageConfig(){return {gameId:GAME_ID,count:STAGES.length,poster:STAGES[0].poster,background:'/games/smallwood-lives/assets/cover.webp',stage(index){const s=STAGES[index],done=save.cleared.includes(s.id),locked=!LocalPractice.enabled&&index>=unlocked(save);return {id:s.id,kicker:text('chapter',{n:index+1}),title:c.chapters[index],subtitle:c.arcs[s.arc],status:locked?c.locked:done?c.completed:save.run?.index===index?c.resume:c.newLife,summary:c.wishes[index],details:[c.optional,text('seed',{n:save.run?.index===index?save.run.seed:'—'}),c.freeExit],locked,cleared:done,poster:s.poster,rewardState:done?'collected':locked?'locked':'available'};}};}
async function startChapter(index,{seed=null,force=false}={}){
 if(busy||fatal)return;
 const practice=LocalPractice.enabled;
 if(practice&&!await LocalPractice.validate())return;
 if(!practice&&index>=unlocked(save)){error('stageLocked');return;}
 if(!practice&&!force&&save.run&&save.run.index!==index){dialog(c.newLife,c.swapRun,[{label:c.cancel,run:closeDialog},{label:c.confirm,primary:true,run:async()=>{closeDialog();await startChapter(index,{seed,force:true});}}]);return;}
 practicing=practice;selected=index;currentResult=null;resultSaved=false;
 const existing=!force&&seed===null&&run()?.index===index?run():null;
 if(!existing){const ok=await transact(s=>{s.run=newRun(index,seed??freshSeed());s.selected=index;return s;});if(!ok)return;}
 $('resultPanel').hidden=true;$('battleLayout').inert=false;closeDialog();showScreen('battle');renderBattle();sound('game.start');
 if(!practicing&&!save.tutorial){dialog(c.help,c.tutorial,[{label:c.confirm,primary:true,run:async()=>{closeDialog();await transact(s=>{s.tutorial=true;return s;});$('options').querySelector('button')?.focus();}}]);}
 else $('options').querySelector('button')?.focus({preventScroll:true});
}
function statLabel(key,r=run()){
 const i=['T','E','M','W','N'].indexOf(key);return i>=0?c.stats[i]:['A','B','C'].includes(key)?`${key} · ${person(key,r)}`:c.unavailable;
}
function preview(option){
 if(busy||!run()||settingsOpen()||run().finished)return;
 const body=document.createDocumentFragment(),r=run(),revision=r.revision,key=optionKey(option),kind=r.phase;
 const event=currentEvent(r);if(event)body.append(para(format(c.event[event.family][1],{name:person(event.target)})));
 const entries=Object.entries(option.delta);if(!entries.length)body.append(para(c.noChange));
 for(const [k,v]of entries){const p=document.createElement('div');p.className='delta '+(v<0?'negative':'positive');p.innerHTML=`<span>${esc(statLabel(k))}</span><b dir="ltr">${r[k]} → ${r[k]+option.actual[k]} (${option.actual[k]>0?'+':''}${option.actual[k]})</b>`;body.append(p);}
 for(const[k,n]of Object.entries(option.requires))body.append(para(`${c.requirements}: ${statLabel(k)} ${n}`));
 if(!option.available)body.append(para(c.unavailable));
 dialog(label(option),body,[{label:c.cancel,run:closeDialog},...option.available?[{label:c.confirm,primary:true,run:async()=>{if(run()?.revision!==revision){closeDialog();error('unavailable');return;}closeDialog();const ok=await commitRun(r=>kind==='event'?choose(r,key,revision):act(r,key,revision),option.id);if(ok){$('feedback').textContent=`${label(option)} · ${c.saved}`;$('options').querySelector(`[data-key="${CSS.escape(key)}"]`)?.focus({preventScroll:true});}}}]:[]]);
}
function renderOptions(options){
 const parent=$('options'),wanted=new Set(options.map(optionKey));
 [...parent.children].forEach(n=>{if(!wanted.has(n.dataset.key))n.remove();});
 for(const o of options){const key=optionKey(o);let b=[...parent.children].find(n=>n.dataset.key===key);
  if(!b){b=button('',()=>{const current=(run().phase==='event'?eventOptions(run()):actionOptions(run())).find(x=>optionKey(x)===key);if(current)preview(current);});b.dataset.key=key;b.dataset.action=o.id;const iconIndex={explore:16,craft:15,rest:28}[o.id];if(iconIndex!==undefined){const icon=document.createElement('img');icon.src=scene.thumbnail(iconIndex);icon.alt='';b.append(icon);}const span=document.createElement('span');span.className='option-label';b.append(span);parent.append(b);}
  b.querySelector('.option-label').textContent=label(o);b.setAttribute('aria-disabled',String(!o.available));b.disabled=busy||fatal;
 }
}
function renderBattle(){
 const r=run();if(!r)return;scene.update(r,state());const metrics=scene.metrics();$('world').dataset.drawCalls=metrics.calls;$('world').dataset.triangles=metrics.triangles;
 $('battleScreen').dataset.stage=STAGES[r.index].id;$('battleScreen').dataset.season=String(r.season);
 $('seasonHud').textContent=text('season',{n:r.season});$('energyHud').textContent=`${c.stats[1]} ${r.E}/6`;$('materialHud').textContent=`${c.stats[2]} ${r.M}/9`;
 $('lifeName').textContent=`${r.names[0]} · ${c.species[r.species]} · ${c.ages[Math.floor((r.season-1)/3)]}`;
 $('world').setAttribute('aria-label',`${c.arcs[r.location]} · ${$('lifeName').textContent} · ${c.items[r.index]}`);
 $('actionsLeft').textContent=text('remaining',{n:r.T});$('resources').replaceChildren(...['W','N'].map(k=>{const span=document.createElement('span');span.textContent=`${statLabel(k,r)} ${r[k]}/3`;return span;}));
 if(r.finished){currentResult=clone(r);renderResult();return;}
 $('resultPanel').hidden=true;$('battleLayout').inert=settingsOpen();
 const event=currentEvent(r);$('decisionTitle').textContent=event?c.event[event.family][0]:c.actions;
 $('decisionText').textContent=event?format(c.event[event.family][1],{name:person(event.target,r)}):daily(r)?c.daily[daily(r)-1]:c.wishes[r.index];
 $('endSeasonBtn').hidden=!!event;$('actionsLeft').hidden=!!event;
 renderOptions(event?eventOptions(r):actionOptions(r));
}
async function advance(confirmed=false){
 if(busy||!run()||run().phase!=='actions'||settingsOpen())return;
 const r=run(),due=duePromises(r);
 if(!confirmed&&(due.length||r.T>0)){dialog(c.endSeason,[due.length?c.confirmMiss:'',r.T>0?c.confirmUnused:''].filter(Boolean).join(' '),[{label:c.cancel,run:closeDialog},{label:c.confirm,primary:true,run:()=>{closeDialog();return advance(true);}}]);return;}
 const count=r.echoes.length,ok=await commitRun(x=>endSeason(x,{allowMiss:confirmed}));
 if(ok){$('feedback').textContent='';sound('game.checkpoint');if(!run().finished&&run().echoes.length>count){const body=document.createDocumentFragment();run().echoes.slice(count).forEach(e=>body.append(echoNode(e,run())));dialog(c.echo,body);}}
}
function echoNode(e,r){
 const node=document.createElement('div');node.className='memory-line';
 const p=document.createElement('p');p.textContent=`${text('season',{n:e.season})} — ${label({id:e.choice,target:e.target},r)}`;node.append(p);
 const later=document.createElement('small');later.textContent=`${text('season',{n:e.observedSeason})} · ${c.event[e.family]?.[0]||c.memories}${['fulfilled','missed','rescheduled','declined'].includes(e.response)?' · '+c[e.response]:''}`;node.append(later);
 for(const promise of (r.promises||[]).filter(x=>x.id.startsWith(e.id))){const info=document.createElement('small');info.textContent=`${c.promise} · ${person(promise.target,r)} · ${c[promise.state==='open'?'rescheduled':promise.state]||c.promise}${promise.completed?' · '+text('season',{n:promise.completed}):''}`;node.append(info);}
 return node;
}
function renderResult(){
 const r=currentResult,wasHidden=$('resultPanel').hidden;$('battleLayout').inert=true;$('resultPanel').hidden=false;
 $('resultArt').src=scene.thumbnail(r.index,r.wish);$('resultArt').alt=c.items[r.index];$('resultKicker').textContent=`${r.names[0]} · ${c.chapters[r.index]}`;
 $('resultWish').textContent=r.wish?c.wishDone:c.ordinary;$('resultMemories').replaceChildren(para(practicing?c.practice:c.resultIntro),...r.echoes.map(e=>echoNode(e,r)));
 if(r.legacy)$('resultMemories').append(para(`${c.action[r.legacy]} · ${text('legacyProgress',{n:r.legacyWork})}`));
 $('saveLifeBtn').hidden=resultSaved;$('nextBtn').hidden=!resultSaved||r.index===29;$('retryBtn').disabled=!resultSaved;$('resultBackBtn').disabled=!resultSaved;
 if(wasHidden){sound('result.win');$('saveLifeBtn').focus({preventScroll:true});}
}
async function saveResult(replace=null){
 if(!currentResult||busy)return false;
 if(practicing){resultSaved=true;renderResult();$('nextBtn').hidden=currentResult.index===29;return true;}
 const page=save.album[STAGES[currentResult.index].id];
 if(page?.runs.length===3&&replace===null){const body=document.createDocumentFragment();body.append(para(c.replaceQuestion));page.runs.forEach((r,i)=>body.append(button(`${c.replace} ${i+1} · ${r.name} · ${text('seed',{n:r.seed})}`,async()=>{closeDialog();await saveResult(i);})));dialog(c.saveLife,body,[{label:c.cancel,run:closeDialog}]);return false;}
 const id=STAGES[currentResult.index].id,ok=await transact(s=>settle(s,currentResult,{replace}));
 if(ok){resultSaved=true;syncMain();renderResult();$('nextBtn').hidden=currentResult.index===29;try{window.WonderAnalytics?.completeStage(id);}catch{}sound('reward.collect');$('nextBtn').hidden?$('resultBackBtn').focus():$('nextBtn').focus();}return ok;
}
function showDetails(){
 const r=run();if(!r)return;const body=document.createDocumentFragment();body.append(para(c.wishes[r.index]),para(c.optional),para(`${c.stats[3]} ${r.W}/3 · ${c.stats[4]} ${r.N}/3`));
 body.append(para(`${c.forecast}: ${c.weather[{sun:0,rain:1,snow:2}[weather(r)]]}${r.index===24&&r.season<7?' · 50% / 50%':''}`));
 for(const p of ['A','B','C'])body.append(para(`${p} · ${person(p,r)} · ${r[p]}/3 · ${c[r.remote.includes(p)?'remote':'local']}`));
 for(const p of r.promises)body.append(para(`${c.promise} · ${person(p.target,r)} · ${text('due',{n:p.due})} · ${p.state==='open'?c.promise:c[p.state]}`));
 if(r.legacy)body.append(para(`${c.action[r.legacy]} · ${text('legacyProgress',{n:r.legacyWork})}`));
 r.echoes.forEach(e=>body.append(echoNode(e,r)));body.append(para(text('seed',{n:r.seed})));dialog(c.wish,body);
}
function owned(id){try{return !!window.WeightPlayWallet?.owns(`${GAME_ID}:${id}`);}catch{return false;}}
function renderCollection(){
 const s=save;$('collectionCount').textContent=`${s.cleared.length} / 30`;
 $('collectionTabs').replaceChildren(...[['album',c.objects],['room',text('room',{n:1})],['shop',c.cosmetics]].map(([id,name])=>button(name,()=>{collectionMode=id;renderCollection();},{'aria-pressed':String(collectionMode===id)})));
 const body=$('collectionBody');body.replaceChildren();
 if(collectionMode==='album'){
  const grid=document.createElement('div');grid.className='collection-grid';
  STAGES.forEach((stage,i)=>{const page=s.album[stage.id],card=document.createElement('article');card.className='collection-card'+(page?'':' locked');const img=document.createElement('img');img.src=scene.thumbnail(i,!!page?.wish);img.alt=c.items[i];const h=document.createElement('h3');h.textContent=c.items[i];card.append(img,h,para(page?`${page.runs.length}/3 · ${page.wish?c.wishDone:c.ordinary}`:c.locked));if(page)card.append(button(c.history,()=>albumPage(i)),button(c.place,()=>placeItem(stage.id)));grid.append(card);});body.append(grid);
 }else if(collectionMode==='room'){
  const count=roomsUnlocked(s);if(!count){body.append(para(c.needRoom));return;}
  for(let room=0;room<count;room++){const h=document.createElement('h3');h.textContent=text('room',{n:room+1});body.append(h);const grid=document.createElement('div');grid.className='room-grid';
   for(let j=0;j<5;j++){const slot=room*5+j,id=s.displays[slot],i=STAGES.findIndex(x=>x.id===id);const b=button('',()=>chooseDisplay(slot),{class:'display-slot'});if(i>=0){const img=document.createElement('img');img.src=scene.thumbnail(i,!!s.album[id].wish);img.alt=c.items[i];b.append(img,document.createTextNode(c.items[i]));}else b.textContent=c.empty;b.dataset.slot=slot;grid.append(b);}body.append(grid);
  }
 }else{
  const grid=document.createElement('div');grid.className='collection-grid';COSMETICS.forEach((item,i)=>{const card=document.createElement('article');card.className='collection-card';const img=document.createElement('img');img.src=scene.thumbnail(item.model);img.alt=c.cosmeticItems[i][0];const h=document.createElement('h3');h.textContent=c.cosmeticItems[i][0];card.append(img,h,para(c.cosmeticItems[i][1]),para(owned(item.id)?c.owned:text('price',{n:item.cost})));
   const locked=s.cleared.length<item.unlock,have=owned(item.id);if(locked)card.append(para(text('needClear',{n:item.unlock})));card.append(button(have?(s.cosmetics.includes(item.id)?c.off:c.on):c.buy,()=>purchase(item,i),{...(locked||practicing?{disabled:''}:{})}));grid.append(card);});body.append(grid);
 }
}
function albumPage(index){const p=save.album[STAGES[index].id],body=document.createDocumentFragment();p.runs.forEach((r,i)=>{body.append(para(`${i+1}. ${r.name} · ${text('seed',{n:r.seed})} · ${r.wish?c.wishDone:c.ordinary}`));r.echoes.forEach(e=>body.append(echoNode(e,{...r,names:r.names||[r.name,'A','B','C']})));body.append(button(c.retry,()=>{closeDialog();return startChapter(index,{seed:r.seed,force:true});}));});dialog(c.items[index],body);}
function placeItem(id){if(!roomsUnlocked(save)){dialog(c.collection,c.needRoom);return;}const body=document.createDocumentFragment();body.append(para(c.chooseSlot));for(let slot=0;slot<roomsUnlocked(save)*5;slot++)body.append(button(`${text('room',{n:Math.floor(slot/5)+1})} · ${slot%5+1}`,async()=>{const ok=await transact(s=>setDisplay(s,slot,id));if(ok){closeDialog();collectionMode='room';renderCollection();sound('reward.collect');}}));dialog(c.place,body);}
function chooseDisplay(slot){const body=document.createDocumentFragment();for(const id of save.cleared){const i=STAGES.findIndex(s=>s.id===id);body.append(button(c.items[i],async()=>{if(await transact(s=>setDisplay(s,slot,id))){closeDialog();renderCollection();sound('reward.collect');}}));}if(save.displays[slot])body.append(button(c.remove,async()=>{if(await transact(s=>setDisplay(s,slot,null))){closeDialog();renderCollection();}}));dialog(c.place,body);}
async function purchase(item,index){
 if(practicing||save.cleared.length<item.unlock||busy)return;
 if(owned(item.id)){if(await transact(s=>setCosmetic(s,item.id,!s.cosmetics.includes(item.id),sku=>window.WeightPlayWallet.owns(sku)))){renderCollection();sound('feedback.success');}return;}
 const body=document.createDocumentFragment(),img=document.createElement('img');img.src=scene.thumbnail(item.model);img.alt=c.cosmeticItems[index][0];body.append(img,para(c.cosmeticItems[index][1]),para(text('price',{n:item.cost})));
 dialog(c.cosmeticItems[index][0],body,[{label:c.cancel,run:closeDialog},{label:c.buy,primary:true,run:async()=>{if(busy)return;busy=true;let result;try{result=await window.WeightPlayWallet.purchasePermanent(`${GAME_ID}:${item.id}`,item.cost);}finally{busy=false;}closeDialog();if(!result?.ok){error(result?.reason==='insufficient'?'notEnough':'shopError');return;}const ok=await transact(s=>setCosmetic(s,item.id,true,sku=>window.WeightPlayWallet.owns(sku)));if(ok){sound('shop.purchase');renderCollection();}}}]);
}
function trapResult(event){if($('resultPanel').hidden||$('choiceDialog').open||settingsOpen())return;if(event.key==='Escape'){event.preventDefault();if(resultSaved){showScreen('stage');showChapters();}return;}if(event.key==='Tab'){const controls=[...$('resultPanel').querySelectorAll('button:not(:disabled)')].filter(n=>!n.hidden),first=controls[0],last=controls.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}}
async function boot(){
 $('startBtn').dataset.runtimeLocalize='off';copyStatic();store=createStore(localStorage);save=store.load();selected=save.selected;
 frame=window.WeightPlayScreenFrame.mountSlots({root:$('gameFrame'),main:$('mainScreen'),stage:$('stageScreen'),battle:{root:$('battleScreen'),headerInfo:$('battleHud')}});
 scene=new SmallwoodScene($('world'),{onLost:()=>{fatal=true;dialog(c.contextLost,c.contextLost,[{label:c.close,run:closeDialog}]);},onRestored:()=>{fatal=false;closeDialog();$('feedback').textContent=c.contextRestored;if(run())renderBattle();}});
 selector=window.WeightPlayPlayUI.mountStage({page:$('chapterPage'),rail:$('stageRail'),config:stageConfig(),selected,onSelect:index=>{selected=index;},onStart:index=>startChapter(index),isActive:()=>frame.active==='stage'&&!$('chapterPage').hidden});
 $('startBtn').addEventListener('click',()=>{practicing=false;selected=save.run?.index??save.selected;showScreen('stage');showChapters();});
 $('stageBack').addEventListener('click',()=>{showScreen('main');syncMain();$('startBtn').focus();});
 $('battleBack').addEventListener('click',()=>{if(run()?.finished||currentResult){if(resultSaved){showScreen('stage');showChapters();}else $('saveLifeBtn').focus();return;}dialog(c.return,c.leaveQuestion,[{label:c.continueRun,run:closeDialog},{label:c.return,run:()=>{closeDialog();showScreen('stage');showChapters();}}]);});
 $('chaptersTab').addEventListener('click',showChapters);$('collectionTab').addEventListener('click',showCollection);$('endSeasonBtn').addEventListener('click',()=>advance());$('detailsBtn').addEventListener('click',showDetails);
 $('helpBtn').addEventListener('click',()=>{const body=document.createDocumentFragment();body.append(para(c.tutorial),para(c.freeExit),para(RAW[locale].guide.rules));dialog(c.help,body);});
 $('saveLifeBtn').addEventListener('click',()=>saveResult());$('nextBtn').addEventListener('click',()=>startChapter(currentResult.index+1,{force:true}));$('retryBtn').addEventListener('click',()=>startChapter(currentResult.index,{seed:currentResult.seed,force:true}));$('resultBackBtn').addEventListener('click',()=>{showScreen('stage');showChapters();});
 $('choiceDialog').addEventListener('cancel',e=>{e.preventDefault();closeDialog();});document.addEventListener('keydown',trapResult);
 window.addEventListener('weightplay:interaction-state',()=>{scene.stop();$('battleLayout').inert=settingsOpen()||!$('resultPanel').hidden;});
 window.addEventListener('pagehide',e=>{scene.stop();if(!e.persisted){scene.dispose();selector.destroy();frame.destroy();}});window.addEventListener('pageshow',e=>{if(e.persisted){scene.resize();scene.draw();}});
 document.addEventListener('visibilitychange',()=>{scene.stop();if(!document.hidden&&frame.active==='battle')scene.draw();});
 window.addEventListener('storage',e=>{if(e.key==='weightplay.smallwood-lives.v1'&&!practicing){fatal=true;error('otherTab');}});
 window.addEventListener('wonder:locale-change',()=>{const next=normalizeLocale(window.WonderI18n?.locale?.()||document.documentElement.lang);if(next===locale)return;locale=next;c=CATALOGS[locale];copyStatic();selector.setConfig(stageConfig(),selected);syncMain();if(run())renderBattle();if(!$('collectionPage').hidden)renderCollection();frame.refresh();});
 syncMain();showScreen('main');scene.update(newRun(0,1),save);await $('mainPoster').decode();$('startBtn').disabled=false;
 LocalPractice.register({gameId:GAME_ID,stageIds:STAGES.map(s=>s.id),enable:enabled=>{if(!enabled){practicing=false;practiceSave=emptySave();}selector.refresh(selected);},startStage:id=>startChapter(STAGES.findIndex(s=>s.id===id),{force:true})});
 window.WeightPlayGameEntryLoader?.ready();
}
boot().catch(e=>{fatal=true;$('mainError').hidden=false;$('mainError').textContent=c[e?.message]||c.graphicsError;window.WeightPlayGameEntryLoader?.fail($('mainError').textContent,()=>location.reload());console.error('Smallwood initialization:',e);});
