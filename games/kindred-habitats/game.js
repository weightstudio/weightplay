import {HABITATS,SPECIES,FOODS,FEATURES,APPROACHES,PHASES,UPGRADES,CARE_ACTIONS} from './data.js';
import {normalizeState,stats,requirements,trustNeeded,currentNeed,explore,approach,care,buy,unlockHabitat} from './engine.js?v5';
import {LOCALES,TITLES,t,label} from './locales.js?v5';
import {createScene} from './scene.js?v5';
import {suggestedCompanion,nextStep} from './next-step.js?v5';

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)], key='weightplay.kindred-habitats.v1';
let raw;try{raw=JSON.parse(localStorage.getItem(key)||'null')}catch{}
let state=normalizeState(raw),lantern=raw?.cosmetics?.moonLantern===true,tab='explore',preparation='food',world=null,modal=null,lastFocus=null;
let onboardingDone=raw?.onboardingDone===true||stats(state).collected>0,artGeneration=0,effectGeneration=0,dialogGeneration=0;
let locale=window.WonderI18n?.actualLocale?.()||document.documentElement.lang||'en';
if(!LOCALES.includes(locale))locale='en';
const text=(k,p={})=>t(locale,k,p),name=o=>label(locale,o),byId=(list,id)=>list.find(o=>o.id===id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const frame=window.WeightPlayScreenFrame.mountSlots({root:$('#gameFrame'),main:$('#mainScreen'),battle:{root:$('#battleScreen'),headerInfo:$('#hud')}});
const sound=window.WeightPlayAudio?.createScope();
window.WeightPlayAudio?.preload(['game.start','feedback.hint','feedback.success','feedback.error','reward.collect','reward.upgrade','reward.unlock','shop.purchase']);
const primary=button('',actOnGoal,'primary wide');primary.id='expeditionAction';$('#primaryActions').append(primary);

function save(){try{localStorage.setItem(key,JSON.stringify({...state,onboardingDone,cosmetics:{...raw?.cosmetics,moonLantern:lantern}}));return true}catch{$('#saveWarning').hidden=false;$('#saveWarning').textContent=text('saveWarning');return false}}
function params(p={}){return Object.fromEntries(Object.entries(p).map(([k,v])=>{const entity=typeof v==='string'&&[...SPECIES,...HABITATS,...FOODS,...FEATURES,...PHASES,...APPROACHES,...CARE_ACTIONS,...UPGRADES].find(o=>o.id===v);return[k,entity?name(entity):v]}))}
function animate(node,frames,duration=160){node?.getAnimations().forEach(a=>a.cancel());return node?.animate(reduced()?[{opacity:.7},{opacity:1}]:frames,{duration:reduced()?70:duration,easing:'cubic-bezier(.2,.7,.3,1)'});}
function clearEffects(){effectGeneration++;$$('.resource-flight').forEach(n=>{n.getAnimations().forEach(a=>a.cancel());n.remove()});for(const n of [$('#workPanel'),$('#feedback'),$('.dialog')])n?.getAnimations().forEach(a=>a.cancel())}
function notice(k,p={},ok=true){const n=$('#feedback');n.textContent=text(k,params({...p,remaining:p.remaining??p.count}));n.dataset.result=ok?'success':'error';animate(n,[{opacity:.45,transform:ok?'translateY(4px)':'translateX(-3px)'},{opacity:1,transform:'none'}],180)}
async function flight(type,source){
  const generation=effectGeneration,target=$('#'+type),a=(source?.isConnected?source:$('#world')).getBoundingClientRect();
  const src=await world?.propImage?.(type);
  if(generation!==effectGeneration||!target?.isConnected||!src||document.body.dataset.screen!=='battle'||document.hidden)return;
  if(reduced()){animate(target,[{opacity:.6},{opacity:1}],70);return}
  const b=target.getBoundingClientRect();$$('.resource-flight').slice(7).forEach(n=>n.remove());
  const img=document.createElement('img');img.src=src;img.className='resource-flight';img.style.left=(a.x+a.width/2)+'px';img.style.top=(a.y+a.height/2)+'px';document.body.append(img);
  const dx=b.x+b.width/2-a.x-a.width/2,dy=b.y+b.height/2-a.y-a.height/2;
  const anim=img.animate([{transform:'translate(-50%,-50%) scale(1)',opacity:1},{transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(.45)`,opacity:.2}],{duration:450,easing:'cubic-bezier(.3,0,.65,1)'});
  anim.onfinish=anim.oncancel=()=>img.remove();
}
function handle(result,source){
  save();render(false);notice(result.messageKey,result.params,result.ok);world?.pulse(result.ok?result.type:'reject');
  const cue={purchase:'shop.purchase',collected:'reward.collect',adult:'reward.upgrade',unlock:'reward.unlock',encounter:'feedback.hint'};
  sound?.play(result.ok?(cue[result.type]||'feedback.success'):'feedback.error');
  if((result.params?.earned||0)>0)flight('supplies',source);if((result.params?.crystals||0)>0)flight('crystals',source);
  if(['collected','adult'].includes(result.type))showCelebration(result);
  else if(state.encounter)$('#workPanel [data-approach]')?.focus({preventScroll:true});
}
function button(label,action,klass=''){const b=document.createElement('button');b.type='button';b.textContent=label;b.className=klass;if(klass.includes('primary'))b.dataset.wpFrameAction='primary';b.addEventListener('click',action);return b}
function showDialog(title,body,actions,{kind='generic'}={}){
  lastFocus=document.activeElement;modal={kind};const generation=++dialogGeneration;
  $('#dialogTitle').textContent=title;$('#dialogBody').replaceChildren(...(Array.isArray(body)?body:[body]));$('#dialogActions').replaceChildren(...actions);$('#overlay').hidden=false;$('#playContent').inert=true;$('#wp-shared-battle-header').inert=true;
  if(kind==='leave'){clearEffects();world?.update({paused:true});sound?.stop()}
  animate($('.dialog'),[{opacity:0,transform:'translateY(8px) scale(.98)'},{opacity:1,transform:'none'}],180);
  requestAnimationFrame(()=>{if(generation===dialogGeneration)$('#dialogActions button')?.focus()});
}
function closeDialog(){if(!modal)return;const leaving=modal.kind==='leave';++dialogGeneration;$('#overlay').hidden=true;$('#playContent').inert=false;$('#wp-shared-battle-header').inert=false;modal=null;if(leaving)world?.update({paused:document.hidden||document.body.dataset.screen!=='battle'});if(lastFocus?.isConnected)lastFocus.focus({preventScroll:true});else if(!primary.disabled)primary.focus({preventScroll:true})}
function fraction(current,total){const value=current+' / '+total;return locale==='ar'?'\u2066'+value+'\u2069':value}
function paragraph(s){const p=document.createElement('p');p.textContent=s;return p}
function showCelebration(result){
  const species=byId(SPECIES,result.params.species),pet=state.pets[species.id],body=document.createElement('div');body.className='celebration';
  body.innerHTML=`<div class="result-portrait">${portrait(species)}</div><p>${esc(text(result.messageKey,params(result.params)))}</p><div class="result-reward">${prop('crystals')}<b dir="ltr">+${result.params.crystals}</b><span>${esc(text('crystals'))}</span></div><p>${esc(text('growth'))} ${fraction(Math.min(pet.growth,3),3)} · ${esc(text('collected'))} ${fraction(stats(state).collected,36)}</p>`;
  showDialog(name(species),body,[button(text(result.type==='collected'?'care':'continue'),()=>{closeDialog();tab='explore';render()},'primary')],{kind:'result'});hydrateArt();
}
function leave(){if(modal)return;showDialog(text('leaveTitle'),paragraph(text('leaveBody')),[button(text('continue'),closeDialog,'primary'),button(text('leave'),()=>{closeDialog();show('main')})],{kind:'leave'})}
function help(){showDialog(text('guideTitle'),[paragraph(text('guideHow')),paragraph(text('guideRules')),paragraph(text('guideFeedback'))],[button(text('continue'),closeDialog,'primary')],{kind:'help'})}
function show(screen){
  clearEffects();artGeneration++;$('#mainGroup').hidden=screen!=='main';$('#mainGroup').inert=screen!=='main';$('#battleScreen').hidden=screen!=='battle';$('#battleScreen').inert=screen!=='battle';document.body.dataset.screen=screen;frame.activate(screen);
  if(screen==='battle'){sound?.play('game.start');if(!world)world=createScene($('#world'),{onReady:hydrateArt});if(state.encounter)tab='explore';render()}
  else{world?.update({paused:true});sound?.stop();updateMain()}
  window.scrollTo(0,0);
}
function selected(){return byId(SPECIES,state.selectedTarget)||SPECIES[0]}
function portrait(s){return `<img class="portrait" data-species="${esc(s.id)}" alt="${esc(name(s))}">`}
function prop(id){return `<img data-prop="${esc(id)}" alt="">`}
function missing(s){return requirements(state,s).map(r=>text(r.key,params({...r.params,remaining:r.params.count}))).join(' · ')}
function heading(s){const p=state.pets[s.id],value=p?.collected?p.growth:(p?.trust||0),total=p?.collected?3:trustNeeded(state,s),metric=text(p?.collected?'growth':'trust');return `<div class="species-heading">${portrait(s)}<div><strong>${esc(name(s))}</strong><span class="small">${esc(p?.collected?text(p.adult?'adult':'young'):text('target'))} · ${esc(metric)} ${fraction(Math.min(value,total),total)}</span><div class="meter" aria-hidden="true"><span style="width:${Math.min(100,value/total*100)}%"></span></div></div></div>`}
function mainTarget(){const s=selected();return state.pets[s.id]?.adult?(suggestedCompanion(state)||s):s}
function mission(s){return state.pets[s.id]?.adult?text('nextCompanion'):text(state.pets[s.id]?.collected?'missionGrow':'missionCollect',{species:name(s)})}
function chooseTarget(s){if(!s||state.encounter)return;state.habitat=HABITATS[s.habitat].id;state.selectedTarget=s.id;tab='explore';preparation='food';save()}
function updateMain(){const c=stats(state);$('#mainProgress').textContent=`${text('collected')} ${fraction(c.collected,36)} · ${text('adults')} ${c.adults}`;$('#mainGoal').textContent=mission(mainTarget());const facts=$$('#gameGuideFacts .game-info-fact > strong');if(facts[2])facts[2].textContent=String(c.adults);if(facts[3])facts[3].textContent=fraction(c.collected,36)}
function actOnGoal(){
  if(state.encounter||modal)return;const s=selected(),step=nextStep(state,s);
  if(step.kind==='next'){if(step.target)chooseTarget(step.target);else tab='journal';render();return}
  if(step.kind==='raise'){chooseTarget(step.target);render();return}
  if(step.kind==='workshop'){tab='workshop';render();return}
  if(step.kind==='care'){handle(care(state,s.id,step.action),primary);return}
  handle(explore(state),primary);
}
function goalLabel(s){if(state.encounter)return text('stepEncounter');const step=nextStep(state,s);if(step.kind==='next')return text(step.target?'nextCompanion':'journalTab');if(step.kind==='raise')return text('missionGrow',{species:name(step.target)});if(step.kind==='workshop')return text('workshopTab');if(step.kind==='care')return text('careNow',{need:name(byId(CARE_ACTIONS,step.action)),species:name(s)});if(step.kind==='trip')return text('explore');return text('findSpecies',{species:name(s)})}
const prepLists={food:FOODS,feature:FEATURES,phase:PHASES};
function renderExplore(s){
  const step=nextStep(state,s),collected=state.pets[s.id]?.collected;
  let content=`<button type="button" class="target-heading" id="chooseTarget" ${state.encounter?'disabled':''} aria-label="${esc(text('changeTarget'))}">${heading(s)}<span aria-hidden="true">${state.encounter?'':'⌄'}</span></button>`;
  if(state.encounter)return content+`<section class="encounter"><p class="eyebrow">${esc(text('encounter'))}</p><p class="encounter-clue">${esc(text('clueApproach.'+s.approach))}</p><div class="approach-options">${APPROACHES.map((a,i)=>`<button type="button" data-approach="${a.id}"><span class="approach-number" aria-hidden="true">${i+1}</span>${esc(name(a))}</button>`).join('')}</div></section>`;
  if(step.kind==='prepare'){
    const clue=preparation==='phase'?(s.phase?text('cluePhase.'+s.phase):text('phaseAny')):text((preparation==='food'?'clueFood.':'clueFeature.')+s[preparation]);
    content+=`<div class="prep-tabs" role="tablist" aria-label="${esc(text('prepare'))}">${Object.keys(prepLists).map((k,i)=>`<button type="button" role="tab" data-prep="${k}" aria-selected="${k===preparation}"><span aria-hidden="true">${i+1}</span> ${esc(text(k))}<small>${esc(name(byId(prepLists[k],state[k])))}</small></button>`).join('')}</div><p class="clue">${esc(clue)}</p><div class="choice-grid" data-choice-group="${preparation}">${prepLists[preparation].map(o=>`<button type="button" data-choice="${o.id}" aria-pressed="${state[preparation]===o.id}">${prop(o.id)}<span>${esc(name(o))}</span><span class="choice-check" aria-hidden="true">✓</span></button>`).join('')}</div>`;
  }else{
    const instruction=step.kind==='next'?text(step.target?'nextCompanion':'complete'):step.kind==='raise'||step.kind==='workshop'?missing(s):step.kind==='care'?text('careNow',{need:name(byId(CARE_ACTIONS,step.action)),species:name(s)}):text('careAfterTrip',{species:name(s)});
    content+=`<div class="care-focus">${portrait(s)}<p>${esc(instruction)}</p></div>`;
    const next=collected&&step.kind==='trip'&&suggestedCompanion(state);
    if(next)content+=`<button type="button" class="next-discovery" data-follow="${next.id}">${portrait(next)}<span>${esc(text('findSpecies',{species:name(next)}))}</span><span aria-hidden="true">→</span></button>`;
  }
  return content;
}
function renderPets(){const pets=SPECIES.filter(a=>state.pets[a.id]?.collected);return pets.length?`<div class="cards">${pets.map(a=>`<button type="button" class="pet-card" data-follow="${a.id}">${heading(a)}<span>${esc(state.pets[a.id].adult?text('adult'):text(state.pets[a.id].careTurn<state.turn?'ready':'careAfterTrip',{species:name(a)}))}</span></button>`).join('')}</div>`:`<p class="empty-state">${esc(text('noPets'))}</p>`}
function albumCard(s){const pet=state.pets[s.id];return `<button type="button" class="album-card ${pet?.collected?'collected':''}" data-target="${s.id}" aria-current="${s.id===state.selectedTarget}">${portrait(s)}<strong>${esc(name(s))}</strong><small>${esc(pet?.adult?text('adult'):pet?.collected?text('collected'):text('trust')+' '+fraction(pet?.trust||0,trustNeeded(state,s)))}</small></button>`}
function renderJournal(){return HABITATS.map(h=>`<section class="album-section"><h2>${esc(name(h))}<span>${fraction(SPECIES.filter(s=>s.habitat===h.index&&state.pets[s.id]?.collected).length,6)}</span></h2><div class="album-grid">${SPECIES.filter(s=>s.habitat===h.index).map(albumCard).join('')}</div></section>`).join('')}
function renderShop(){const c=stats(state),wallet=window.WeightPlayWallet?.read()?.diamonds||0;return `<div class="cards">${UPGRADES.filter(u=>u.level===state.upgrades[u.kind]+1).map(u=>`<article class="upgrade-card">${prop(u.kind)}<div><h3>${esc(name(u))}</h3><p>${esc(text(u.kind==='kit'?'kitEffect':'notebookEffect'))}</p><span class="price">${prop(u.currency)} ${u.cost} · ${esc(text('permanent'))}</span><button type="button" data-buy="${u.id}">${esc(text('buy'))}</button></div></article>`).join('')}${HABITATS.filter(h=>!state.unlocked.includes(h.id)).map(h=>`<article class="upgrade-card">${prop('habitat-'+h.id)}<div><h3>${esc(name(h))}</h3><p>${esc(text('collected'))} ${fraction(c.collected,h.collectedRequired)} · ${esc(text('adults'))} ${fraction(c.adults,h.adultsRequired)}</p><span class="price">${prop('supplies')} ${h.cost}</span><button type="button" data-unlock="${h.id}">${esc(text('unlock'))}</button></div></article>`).join('')}<article class="upgrade-card">${prop('lantern')}<div><h3>${esc(text('diamondLantern'))}</h3><p>${esc(text('diamondLanternEffect'))}</p><span class="price"><img src="/assets/weightplay-diamond.svg" alt=""> 3 · ${esc(text('diamondBalance'))} ${wallet}</span><button id="diamondBuy" type="button" ${lantern?'disabled':''}>${esc(text(lantern?'owned':'diamondPurchase'))}</button></div></article></div>`}
function sceneState(){const s=selected();return {habitat:HABITATS[s.habitat],species:s,pets:SPECIES.filter(a=>a.id!==s.id&&state.pets[a.id]?.collected&&a.habitat===s.habitat).slice(0,6),phase:state.phase,encounter:!!state.encounter,adult:!!state.pets[s.id]?.adult,reducedMotion:reduced(),paused:document.hidden||document.body.dataset.screen!=='battle'||modal?.kind==='leave',lantern,labels:{loading:text('loading'),renderError:text('renderError'),retry:text('retry')}}}
function render(reset=true){
  const panel=$('#workPanel'),scroll=reset?0:panel.scrollTop,s=selected(),c=stats(state);updateMain();$('#supplies').textContent=state.resources.supplies;$('#crystals').textContent=state.resources.crystals;$('#collectionCount').textContent=fraction(c.collected,36);
  for(const id of ['supplies','crystals'])$('#'+id).parentElement.title=text(id);$('#collectionCount').parentElement.title=text('collected');$('#world').setAttribute('aria-label',name(HABITATS[s.habitat])+' · '+name(s));$('#worldCaption').textContent=mission(s);
  $('#habitatSelect').innerHTML=HABITATS.map(h=>`<option value="${h.id}" ${h.id===state.habitat?'selected':''}>${esc(name(h))}${state.unlocked.includes(h.id)?'':' · '+esc(text('locked'))}</option>`).join('');$('#habitatSelect').disabled=!!state.encounter;
  $$('[data-tab]').forEach(b=>{b.setAttribute('aria-selected',String(b.dataset.tab===tab));b.disabled=!!state.encounter&&b.dataset.tab!=='explore'});
  panel.innerHTML=tab==='explore'?renderExplore(s):tab==='pets'?renderPets():tab==='journal'?renderJournal():renderShop();
  const hasPrimary=tab==='explore'&&!state.encounter;$('#primaryActions').hidden=!hasPrimary;$('.work-column').dataset.primary=String(hasPrimary);primary.textContent=goalLabel(s);primary.disabled=!!state.encounter;
  world?.update(sceneState());panel.dataset.runtimeLocalize='off';panel.scrollTop=scroll;if(reset){$('#feedback').textContent='';animate(panel,[{opacity:.55,transform:'translateY(5px)'},{opacity:1,transform:'none'}])}hydrateArt();
}
async function hydrateArt(){if(!world)return;const generation=++artGeneration;for(const img of $$('img[data-species],img[data-prop]')){if(img.getAttribute('src'))continue;const src=img.dataset.species?await world.renderPortrait?.(byId(SPECIES,img.dataset.species)):await world.propImage?.(img.dataset.prop);if(generation!==artGeneration)return;if(src&&img.isConnected)img.src=src}}
function chooseFromAlbum(s){if(!state.unlocked.includes(HABITATS[s.habitat].id)){tab='workshop';render();notice('habitatLocked',{habitat:HABITATS[s.habitat].id},false);return}chooseTarget(s);render()}
function targetPicker(){const body=document.createElement('div');body.className='album-grid';body.innerHTML=SPECIES.filter(s=>s.habitat===selected().habitat).map(albumCard).join('');body.addEventListener('click',e=>{const b=e.target.closest('[data-target]');if(b){closeDialog();chooseFromAlbum(byId(SPECIES,b.dataset.target))}});showDialog(text('chooseTarget'),body,[button(text('close'),closeDialog)],{kind:'targets'});hydrateArt()}
function setPreparation(kind){preparation=kind;render(false);$(`[data-prep="${kind}"]`)?.focus({preventScroll:true})}
function localize(){document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';document.title=TITLES[locale]+' | WeightPlay';$$('[data-copy]').forEach(n=>n.textContent=text(n.dataset.copy));$$('[data-official-title],[data-wp-game-title],[data-wp-frame-title]').forEach(n=>{n.textContent=TITLES[locale];n.setAttribute('data-runtime-localize','off')});$('#mainReturn').ariaLabel=text('back');$('#battleBackBtn').ariaLabel=text('back');$('#gameGuide').ariaLabel=text('guideTitle');$('#gameGuideSections').innerHTML=['guideHow','guideRules','guideFeedback'].map(k=>`<section class="game-info-section"><h2>${esc(text(k+'Title'))}</h2><p>${esc(text(k))}</p></section>`).join('');$('#gameGuideFacts').innerHTML=[['species','36'],['habitat','6'],['adults',String(stats(state).adults)],['progress',fraction(stats(state).collected,36)]].map(([k,v])=>`<div class="game-info-fact"><strong>${esc(v)}</strong><span>${esc(text(k))}</span></div>`).join('');updateMain();if(document.body.dataset.screen==='battle')render(false)}
$('#startBtn').addEventListener('click',()=>{if(!state.encounter)chooseTarget(mainTarget());onboardingDone=true;save();show('battle')});$('#battleBackBtn').addEventListener('click',leave);$('#helpBtn').addEventListener('click',help);
$('#tabs').addEventListener('click',e=>{const b=e.target.closest('[data-tab]');if(!b||b.disabled)return;tab=b.dataset.tab;$('#moreTabs').open=false;render()});
$('#habitatSelect').addEventListener('change',e=>{if(state.encounter)return;const h=byId(HABITATS,e.target.value);if(!state.unlocked.includes(h.id)){tab='workshop';render();notice('habitatLocked',{habitat:h.id},false);return}chooseTarget(SPECIES.find(s=>s.habitat===h.index));render()});
$('#workPanel').addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b||b.disabled)return;
  if(b.id==='chooseTarget')targetPicker();if(b.dataset.prep)setPreparation(b.dataset.prep);
  if(b.dataset.choice){state[preparation]=b.dataset.choice;save();$$('[data-choice]').forEach(n=>n.setAttribute('aria-pressed',String(n.dataset.choice===state[preparation])));$(`[data-prep="${preparation}"] small`).textContent=name(byId(prepLists[preparation],state[preparation]));animate(b,[{transform:'scale(.97)'},{transform:'scale(1)'}],120);world?.update(sceneState());world?.pulse('select');hydrateArt()}
  if(b.dataset.approach)handle(approach(state,b.dataset.approach),b);
  if(b.dataset.follow){chooseTarget(byId(SPECIES,b.dataset.follow));render()}
  if(b.dataset.buy)handle(buy(state,b.dataset.buy),b);if(b.dataset.unlock)handle(unlockHabitat(state,b.dataset.unlock),b);
  if(b.dataset.target)chooseFromAlbum(byId(SPECIES,b.dataset.target));
  if(b.id==='diamondBuy'&&!lantern)showDialog(text('confirmPurchase'),paragraph(text('diamondLanternEffect')+' '+text('diamondPurchase')),[button(text('cancel'),closeDialog,'primary'),button(text('confirm'),()=>{closeDialog();const w=window.WeightPlayWallet;if((w?.read()?.diamonds||0)<3){notice('insufficientDiamonds',{},false);return}try{if(!w.spendDiamonds(3)){notice('insufficientDiamonds',{},false);return}lantern=true;if(!save()){lantern=false;w.addDiamonds(3);throw Error('Save unavailable')}render(false);notice('purchased');sound?.play('shop.purchase')}catch{notice('purchaseFailed',{},false)}})],{kind:'purchase'});
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&modal){e.preventDefault();closeDialog()}
  if(e.key==='Tab'&&modal){const items=[...$('#overlay').querySelectorAll('button:not(:disabled),[href],select,[tabindex="0"]')],first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}}
});
window.addEventListener('wonder:locale-change',e=>{locale=e.detail?.locale||window.WonderI18n?.actualLocale?.()||locale;if(!LOCALES.includes(locale))locale='en';closeDialog();localize()});
document.addEventListener('visibilitychange',()=>{if(document.hidden){clearEffects();sound?.stop()}world?.update({paused:document.hidden||document.body.dataset.screen!=='battle'||modal?.kind==='leave'})});
window.addEventListener('pagehide',e=>{save();artGeneration++;clearEffects();if(e.persisted){sound?.stop();world?.update({paused:true})}else{sound?.dispose();world?.dispose();frame.destroy()}});
window.addEventListener('pageshow',e=>{if(e.persisted){frame.activate(document.body.dataset.screen);world?.update({paused:document.hidden||document.body.dataset.screen!=='battle'||modal?.kind==='leave'});if(document.body.dataset.screen==='battle')hydrateArt()}});
localize();show('main');save();
