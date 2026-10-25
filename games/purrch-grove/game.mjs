import {Grove,STORE,GOALS,ACTIONS,PERSONALITIES,FURNITURE,ADOPTION,preferred} from './model.mjs';
import {Room} from './room.mjs';
import {Motion} from './motion.mjs';
import {COPY,LOCALES,LABELS,ROUTES,guideSections} from './locales.mjs';
import {buyCushion,recoverCushion} from './cushion-purchase.mjs';
const $=id=>document.getElementById(id),make=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
const read=key=>{try{return localStorage.getItem(key);}catch{return null;}};let raw;try{raw=JSON.parse(read(STORE));}catch{}
const grove=new Grove(raw),motion=new Motion(),audio=window.WeightPlayAudio?.createScope(),abort=new AbortController();
let locale=new URLSearchParams(location.search).get('lang')||Object.keys(ROUTES).find(k=>ROUTES[k]===location.pathname.split('/')[1])||read('weightPlayLocale')||document.documentElement.lang||'en';if(!LOCALES.includes(locale))locale='en';
const t=(key,vars={})=>String((key==='title'?window.WEIGHTPLAY_GAME_TITLES?.['purrch-grove']?.[locale]:null)||COPY[locale][key]||key).replace(/\{(\w+)\}/g,(_,k)=>vars[k]??'');
const listen=(n,event,fn)=>n.addEventListener(event,fn,{signal:abort.signal});
let manageAbort=new AbortController(),panelAbort=new AbortController();
const onManage=(n,event,fn)=>n.addEventListener(event,fn,{signal:manageAbort.signal});
const onPanel=(n,event,fn)=>n.addEventListener(event,fn,{signal:panelAbort.signal});
let frame,selector,room=null,screen='main',tab='goals',panel='',focusReturn=null,raf=0,last=0,saveTime=0,uiTime=0,cueTime=0,lost=false,result=null,busyPurchase=false;
let selectedGoal=grove.s.unlocked-1;
const portraits=new Map(),sound=id=>audio?.play(id);
function save(){try{localStorage.setItem(STORE,JSON.stringify(grove.s));$('saveWarning').hidden=true;return true;}catch{$('saveWarning').textContent=t('saveError');$('saveWarning').hidden=false;return false;}}
function image(kind,size=64){const img=make('img');img.src=portraits.get(kind)||'/games/purrch-grove/assets/cover-block-v1.webp';img.alt='';img.width=size;img.height=size;return img;}
function price(amount,diamond=false){const n=make('span',undefined,'price'),img=make('img');img.src=diamond?'/assets/weightplay-diamond.svg':'/assets/wonder-prop-coin-block-v1.png';img.alt='';n.append(img,make('span',String(amount)));return n;}
function labelToken(token){const [key,arg]=token.split(':');if(ACTIONS.includes(key))return t(key)+(arg==='tree'?` · ${t('tree')}`:'');if(key==='preferred')return `${t('preferred')} · ${t(preferred({personality:arg===undefined?grove.selected.personality:Number(arg)}))}${arg!==undefined?` · #${Number(arg)+1}`:''}`;if(key==='distinct')return `${t('distinct')} ${arg}`;if(key==='buy')return `${t('buy')} · ${t(arg)}`;if(key==='place')return `${t('place')} · ${t(arg)}`;return t(key);}
const goalTitle=g=>`${t('goal')} ${g.id} · ${labelToken(g.steps[0])}`;
const furnitureEffect=kind=>`${t(kind==='feather'?'feather':'rest')}: ${t(kind==='bed'?'energy':'joy')} +${kind==='bed'?5:kind==='tree'?4:3} / ${t('level')}`;
function announce(message,error=false){$('feedback').textContent=message;$('panelFeedback').textContent=message;motion.emphasize(panel?$('panelFeedback'):$('feedback'));if(error)sound('feedback.error');}
function cue(message){$('worldCue').textContent=message;cueTime=2;$('worldCue').classList.add('show');motion.enter($('worldCue'));}
function settingsOpen(){return Boolean(document.querySelector('[data-wp-preferences] .wp-frame-popover:not([hidden])'));}
function blocked(){return screen!=='battle'||panel||result||lost||document.hidden||!document.hasFocus()||settingsOpen();}
function disposeRoom(){cancelAnimationFrame(raf);raf=0;room?.dispose();room=null;audio?.stop();}
function show(next){
 motion.clear();if(room&&!lost)room.render(grove.s,0);motion.exit($(screen+'Screen'));if(screen==='battle'&&next!=='battle'){disposeRoom();save();}
 panel='';result=null;$('panel').hidden=true;$('resultPanel').hidden=true;$('battleLive').inert=false;screen=next;document.body.dataset.screen=next;
 for(const name of ['main','stage','battle'])$(name+'Screen').hidden=name!==next;$('mainGuide').hidden=next!=='main';frame.activate(next);motion.enter($(next+'Screen'));
 if(next==='stage'){stageTab('goals');selector.refresh(selectedGoal);requestAnimationFrame(()=>selector.refresh(selectedGoal));}
 update();window.dispatchEvent(new Event(`weightplay:${next}-sync`));
}
function start(id){if(!grove.start(id))return;if(id>0)selectedGoal=id-1;disposeRoom();show('battle');lost=false;$('graphicsError').hidden=true;$('feedback').textContent='';
 try{room=new Room($('room'),id=>{if(!blocked()){grove.select(id);update();save();sound('ui.click');}},()=>{lost=true;$('graphicsError').hidden=false;save();});room.renderer.domElement.ariaLabel=t('home');room.render(grove.s,.1);}
 catch(e){lost=true;$('graphicsError').hidden=false;console.error('PURRCH_3D',e.message);}
 last=performance.now();raf=requestAnimationFrame(loop);sound('game.start');update();
}
function loop(now){const dt=Math.min(.1,Math.max(0,(now-last)/1000));last=now;if(!blocked()){grove.tick(dt);events();saveTime+=dt;if(saveTime>=5){saveTime=0;save();}}
 if(room&&!lost&&!document.hidden)room.render(grove.s,blocked()?0:dt);cueTime=Math.max(0,cueTime-dt);$('worldCue').classList.toggle('show',cueTime>0);uiTime+=dt;if(uiTime>=.15){uiTime=0;update();}if(screen==='battle')raf=requestAnimationFrame(loop);}
function rewardFly(amount,origin,destination=$('coinStat')){if(!amount||!origin||!destination)return;const a=origin.getBoundingClientRect(),b=destination.getBoundingClientRect();if(!a.width||!b.width)return;const n=make('span',undefined,'reward-flight');n.dataset.puppyTransient='';n.append(price(amount));n.style.left=`${a.left+a.width/2}px`;n.style.top=`${a.top+a.height/2}px`;document.body.append(n);motion.play(n,motion.reduced?[{opacity:1},{opacity:0}]:[{transform:'translate(-50%,-50%)',opacity:1},{transform:`translate(calc(-50% + ${b.left+b.width/2-a.left-a.width/2}px),calc(-50% + ${b.top+b.height/2-a.top-a.height/2}px))`,opacity:0}],500,()=>{n.remove();motion.emphasize(destination);});}
function events(){for(const e of grove.events.splice(0)){
 if(e.type==='error'){announce(t({coins:'poor',max:'max',busy:'busy',tired:'tired',same:'same',locked:'locked'}[e.reason]||'error'),true);continue;}
 if(e.type==='begin'){cue(t(e.kind));announce(t(e.kind));}
 if(e.type==='care'){cue(`${t('careDone')} · ${t(e.kind)}${e.preferred?' · '+t('preferred'):''}`);announce(`${t('careDone')} · ${t(e.kind)}`);if(e.coins){sound('reward.coin');rewardFly(e.coins,$('activity'));}else sound('feedback.success');}
 if(e.type==='mature'){cue(t('adult'));sound('reward.unlock');}
 if(e.type==='buy'||e.type==='place'||e.type==='adopt'){announce(t(e.type==='adopt'?'adopt':e.type));sound(e.type==='buy'?'shop.purchase':'reward.unlock');}
 if(e.type==='step')motion.emphasize($('objective'));
 if(e.type==='complete'){if(e.reward>0)selectedGoal=grove.s.unlocked-1;save();if(panel)closePanel();showResult(e);}
 }update();}
function update(){
 if(!frame)return;const s=grove.s,d=grove.selected;$('mainProgress').textContent=`${t('goal')} ${s.unlocked} / 30`;$('coinStat').textContent=String(s.coins);$('catStat').textContent=`${s.cats.length}/4`;
 $('objective').replaceChildren();const g=grove.goal?GOALS[grove.goal-1]:null;$('objective').append(make('strong',g?goalTitle(g):t('home')),make('span',g?`${t('step')} ${Math.min(g.steps.length,grove.step+1)}/${g.steps.length} · ${labelToken(grove.next)}`:t('summary')));
 $('catIdentity').textContent=`#${d.id} · ${t(d.growth>=100?'adult':'kitten')}`;$('catPreference').textContent=`${t(PERSONALITIES[d.personality])} · ${t('preferred')}: ${t(preferred(d))}`;$('catPreference').title=$('catPreference').textContent;
 for(const key of ['food','joy','energy','clean']){const meter=$('need-'+key);meter.value=d[key];meter.setAttribute('aria-valuenow',String(Math.floor(d[key])));$('value-'+key).textContent=Math.floor(d[key]);}
 $('activity').textContent=d.action?`${t('action')}: ${t(d.action.kind)} · ${Math.ceil(d.action.remaining)} ${t('seconds')}`:`${t('ready')} · ${t('trust')} ${d.trust} · ${t('growth')} ${Math.floor(d.growth)}%`;$('activity').title=$('activity').textContent;
 document.querySelectorAll('[data-act]').forEach(b=>{b.disabled=Boolean(d.action)||lost||Boolean(result);b.setAttribute('aria-busy',String(Boolean(d.action)));});
}
function copy(){document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';document.title=`${t('title')} | WeightPlay`;$('localeSelect').value=locale;
 document.querySelectorAll('[data-copy]').forEach(n=>{n.textContent=t(n.dataset.copy);n.dataset.runtimeLocalize='off';});$('stageBack').ariaLabel=t('leave');$('battleBack').ariaLabel=t('pause');$('closePanel').ariaLabel=t('close');$('localeSelect').ariaLabel=LABELS[LOCALES.indexOf(locale)];
 $('needs').replaceChildren();for(const key of ['food','joy','energy','clean']){const label=make('label',t(key)),m=make('meter'),v=make('output');m.id='need-'+key;m.min=0;m.max=100;m.ariaLabel=t(key);v.id='value-'+key;label.append(m,v);$('needs').append(label);}
 const sections=document.querySelector('#mainGuide .game-info-sections');sections.replaceChildren();for(const item of guideSections(locale)){const section=make('section');section.append(make('h3',item.title),make('p',item.text));sections.append(section);}
 frame?.refresh();selector?.refresh(selectedGoal);if(screen==='stage'&&tab!=='goals')renderManage();update();}
function stageTab(next){tab=next;const hidden=next!=='goals';$('goalsWorkspace').hidden=hidden;$('goalsWorkspace').classList.toggle('hidden',hidden);$('goalsWorkspace').inert=hidden;$('management').hidden=!hidden;for(const [id,key]of [['catsTab','cats'],['goalsTab','goals'],['shopTab','shop']])$(id).setAttribute('aria-selected',String(next===key));if(hidden){renderManage();motion.enter($('management'));}else selector?.refresh(selectedGoal);}
function renderManage(){manageAbort.abort();manageAbort=new AbortController();const content=$('manageContent');content.replaceChildren();$('manageSummary').replaceChildren(price(grove.s.coins));
 if(tab==='cats'){
  const free=make('button',t('home'));onManage(free,'click',()=>start(0));content.append(free);
  for(const d of grove.s.cats){const c=make('section',undefined,'item-card');c.append(image('cat'+d.personality),make('strong',`#${d.id} · ${t(PERSONALITIES[d.personality])}`),make('p',`${t('preferred')}: ${t(preferred(d))} · ${t('growth')} ${Math.floor(d.growth)}%`));const b=make('button',t('choose'));b.setAttribute('aria-pressed',String(d.id===grove.s.selected));onManage(b,'click',()=>{grove.select(d.id);save();renderManage();});c.append(b);content.append(c);}
  const a=ADOPTION[grove.s.cats.length-1];if(a){const trust=grove.s.cats.reduce((n,d)=>n+d.trust,0),c=make('section',undefined,'item-card');c.append(image('cat'+a.personality),make('strong',t('adopt')),make('p',t('adoptGate',{n:a.goal})+' · '+t('trust')+' '+trust+'/'+a.trust));const b=make('button',t('adopt'));b.append(price(a.cost));b.disabled=!grove.s.cleared.includes(a.goal)||grove.s.coins<a.cost||trust<a.trust;onManage(b,'click',()=>{grove.adopt();events();save();renderManage();});c.append(b);content.append(c);}
 }else{
  for(const [kind,item]of Object.entries(FURNITURE)){const lv=grove.s.levels[kind],c=make('section',undefined,'item-card');c.append(image(kind),make('strong',`${t(kind)} · ${t('level')} ${lv}/3`),make('p',furnitureEffect(kind)));const controls=make('div',undefined,'item-actions'),b=make('button',t(lv>=3?'max':lv?'upgrade':'buy'));if(lv<3)b.append(price(item.cost*(lv+1)));b.disabled=lv>=3||grove.s.coins<item.cost*(lv+1);onManage(b,'click',()=>{grove.buy(kind);events();save();renderManage();});controls.append(b);
   if(lv){const select=make('select');select.ariaLabel=t('place')+' · '+t(kind);['quiet','sunny','window'].forEach((key,i)=>select.add(new Option(t(key),i)));select.value=grove.s.places[kind];onManage(select,'change',()=>{grove.place(kind,Number(select.value));events();save();});controls.append(select);}c.append(controls);content.append(c);}
  const c=make('section',undefined,'item-card');c.append(image('cushion'),make('strong',t('cushion')+' · '+t('permanent')),make('p',t('moonEffect')));let balance=0;try{balance=window.WeightPlayWallet?.read?.().diamonds||0;}catch{}const bal=make('p',t('balance')+' ');bal.append(price(balance,true));c.append(bal);const buy=make('button',t(grove.s.cushion?'owned':'buy'));buy.append(price(5,true));buy.disabled=grove.s.cushion||balance<5;onManage(buy,'click',()=>openPanel('cushion'));c.append(buy);content.append(c);
 }
}
function openPanel(type){if(screen!=='battle'&&type!=='cushion')return;panelAbort.abort();panelAbort=new AbortController();if(panel)motion.exit($('panel').querySelector('.panel-card'));if(!panel)focusReturn=document.activeElement;panel=type;const host=type==='cushion'&&screen==='stage'?$('stageScreen'):$('battleScreen');host.append($('panel'));$('panel').hidden=false;$('battleLive').inert=true;frame.activate(screen,{covered:true});$('panelTitle').textContent=t({chooser:'choose',help:'help',leave:'pause',cushion:'cushion',shop:'furniture'}[type]);const c=$('panelContent');c.replaceChildren();$('panelFeedback').textContent='';
 if(type==='chooser')for(const d of grove.s.cats){const b=make('button',undefined,'cat-choice');b.append(image('cat'+d.personality),make('span',`#${d.id} · ${t(PERSONALITIES[d.personality])} · ${t(preferred(d))}`));onPanel(b,'click',()=>{grove.select(d.id);closePanel();save();update();});c.append(b);}
 if(type==='chooser'){const b=make('button',t('help'));onPanel(b,'click',()=>openPanel('help'));c.append(b);}
 if(type==='shop'){c.append(price(grove.s.coins),make('p',t('shopHelp')));for(const [kind,item]of Object.entries(FURNITURE)){const lv=grove.s.levels[kind],card=make('section',undefined,'item-card');card.append(image(kind),make('strong',t(kind)+' · '+t('level')+' '+lv+'/3'),make('p',furnitureEffect(kind)));const actions=make('div',undefined,'item-actions'),buy=make('button',t(lv>=3?'max':lv?'upgrade':'buy'));if(lv<3)buy.append(price(item.cost*(lv+1)));buy.disabled=lv>=3||grove.s.coins<item.cost*(lv+1);onPanel(buy,'click',()=>{grove.buy(kind);events();save();if(!result)openPanel('shop');});actions.append(buy);if(lv){const select=make('select');select.ariaLabel=t('place')+' · '+t(kind);['quiet','sunny','window'].forEach((k,i)=>select.add(new Option(t(k),i)));select.value=grove.s.places[kind];onPanel(select,'change',()=>{grove.place(kind,Number(select.value));events();save();});actions.append(select);}card.append(actions);c.append(card);}}
 if(type==='help'){const img=make('img');img.src='/assets/weightplay-character-moss-shell-turtle-block-v1.webp';img.width=112;img.height=112;img.alt='';c.append(img,make('p',t('guide')),make('p',`${t('preferred')} · ${t(preferred(grove.selected))}: ${t('trust')} +6 · ${t('growth')} +${grove.selected.personality===2?12:16}%`),make('p',`${t('routine')}: ${t('feed')} → ${t('groom')} → ${t('rest')} · 9 ${t('seconds')}`),make('p',`${t('adult')}: ${t('growth')} 100%`),make('p',`${t('adopt')}: ${t('goal')} 5 / 10 / 20 · ${t('trust')} 18 / 42 / 90`));for(const k of Object.keys(FURNITURE))c.append(make('p',t(k)+' · '+furnitureEffect(k)));}
 if(type==='leave'){c.append(make('p',t('saved')));for(const [key,fn]of [['continue',closePanel],['leave',()=>{closePanel();show('stage');}]]){const b=make('button',t(key));onPanel(b,'click',fn);c.append(b);}}
 if(type==='cushion'){c.append(make('p',t('moonEffect')),price(5,true));const b=make('button',t('buy'));onPanel(b,'click',async ()=>{if(busyPurchase)return;busyPurchase=true;try{const r=(await buyCushion(grove.s,localStorage,window.WeightPlayWallet));if(r.ok){closePanel();renderManage();sound('shop.purchase');if(r.pending){$('saveWarning').textContent=t('pending');$('saveWarning').hidden=false;}}else{$('panelFeedback').textContent=t(r.reason);sound('feedback.error');}}finally{busyPurchase=false;}});c.append(b);}
 motion.enter($('panel').querySelector('.panel-card'));$('closePanel').focus({preventScroll:true});save();}
function closePanel(){panelAbort.abort();motion.exit($('panel').querySelector('.panel-card'));panel='';$('panel').hidden=true;$('battleLive').inert=false;frame.activate(screen);last=performance.now();if(focusReturn?.isConnected&&focusReturn.getClientRects().length)focusReturn.focus({preventScroll:true});update();}
function showResult(e){result=e;$('resultPanel').hidden=false;$('battleLive').inert=true;frame.activate('battle',{covered:true});$('resultGoal').textContent=goalTitle(GOALS[e.id-1]);$('resultReward').replaceChildren(make('span',e.reward?t('reward'):t('noReward')),price(e.reward));$('resultBalance').replaceChildren(make('span',t('balance')),price(grove.s.coins));$('nextBtn').hidden=false;$('nextBtn').disabled=e.id>=GOALS.length;motion.enter($('resultPanel').querySelector('.result-card'));sound('result.win');rewardFly(e.reward,$('resultReward'),$('resultBalance'));$('nextBtn').disabled?$('replayBtn').focus():$('nextBtn').focus();}
function boot(){
 if(!new URLSearchParams(location.search).has('preview')){$('gameFrame').hidden=true;$('mainGuide').hidden=true;$('comingSoon').hidden=false;return;}
 // Mount the Result content and fixed action track once. All locale entries
 // use the same owned composition without moving scene roots on settlement.
 const resultCard=$('resultPanel').querySelector('.result-card'),resultBody=make('div',undefined,'result-body'),resultActions=make('div',undefined,'result-actions');
 resultBody.append($('resultTitle'),$('resultGoal'),$('resultReward'),$('resultBalance'));
 resultActions.append($('resultBack'),$('nextBtn'),$('replayBtn'));resultCard.append(resultBody,resultActions);
 $('localeSelect').replaceChildren(...LOCALES.map((l,i)=>new Option(LABELS[i],l)));window.WonderI18n?.setLocale?.(locale,{navigate:false});
 frame=window.WeightPlayScreenFrame.mount({root:$('gameFrame'),localeSelect:$('localeSelect'),playUI:true,scenes:{main:{root:$('mainScreen'),header:$('mainScreen').querySelector('header'),content:document.querySelector('.main-hero')},stage:{root:$('stageScreen'),header:$('stageScreen').querySelector('header'),content:$('stageWorkspace')},battle:{root:$('battleScreen'),header:$('battleScreen').querySelector('header'),content:$('battleLive')}}});
 const wallet=make('span',undefined,'price'),icon=make('img');icon.src='/assets/wonder-prop-coin-block-v1.png';icon.alt='';const coins=make('span');coins.id='coinStat';wallet.append(icon,coins);const count=make('span');count.id='catStat';frame.battleTopUI.add(window.WeightPlayScreenFrame.createGroup().add(wallet).add(count));
 const goalsPage=make('div');goalsPage.id='goalsWorkspace';$('stageWorkspace').prepend(goalsPage);goalsPage.append($('stageRail'));
 selector=window.WeightPlayPlayUI.mountStage({page:goalsPage,rail:$('stageRail'),selected:selectedGoal,config:{count:30,poster:'/games/purrch-grove/assets/cover-block-v1.webp',background:'/assets/lobby-block-atmosphere.svg',stage(i){const g=GOALS[i];return {id:g.id,kicker:t('goal')+' '+g.id,title:labelToken(g.steps[0]),subtitle:g.steps.map(labelToken).join(' → '),summary:g.steps.map(labelToken).join(' → '),details:[t('reward')+' '+g.reward],status:t(g.id>grove.s.unlocked?'locked':grove.s.cleared.includes(g.id)?'cleared':'ready'),locked:g.id>grove.s.unlocked,cleared:grove.s.cleared.includes(g.id)};}},isActive:()=>screen==='stage'&&tab==='goals',onSelect(i){selectedGoal=i;},onStart(i){start(i+1);}});
 // Management is a sibling of the complete shared goals workspace; only the
 // owning active workspace is visible. Shared rail/briefing retain one owner.
 $('stageWorkspace').append($('management'));
 // Bound one short renderer to author portraits from exactly the runtime models.
 // This is asset preparation, never visible-play evidence; cache at most nine PNGs.
 const artHost=make('div');Object.assign(artHost.style,{position:'fixed',left:'-9999px',width:'128px',height:'128px'});document.body.append(artHost);
 try{const art=new Room(artHost,()=>{},()=>{});try{for(const k of ['cat0','cat1','cat2','cat3','tree','bed','feather','cushion'])portraits.set(k,art.portrait(k));}finally{art.dispose();}}catch(e){console.warn('PURRCH_PORTRAITS',e.message);}finally{artHost.remove();}
 try{if(!recoverCushion(grove.s,localStorage,window.WeightPlayWallet).ok){$('saveWarning').textContent=t('pending');$('saveWarning').hidden=false;}}catch{}
 for(const [id,fn]of [['startBtn',()=>show('stage')],['stageBack',()=>show('main')],['battleBack',()=>openPanel('leave')],['chooseCat',()=>openPanel('chooser')],['helpBtn',()=>openPanel('shop')],['closePanel',closePanel],['catsTab',()=>stageTab('cats')],['goalsTab',()=>stageTab('goals')],['shopTab',()=>stageTab('shop')],['reloadBtn',()=>{save();location.reload();}],['graphicsBack',()=>show('stage')],['nextBtn',()=>start(result.id+1)],['replayBtn',()=>start(result.id)],['resultBack',()=>show('stage')]])listen($(id),'click',fn);
 document.querySelectorAll('[data-act]').forEach(b=>listen(b,'click',()=>{if(blocked())return;grove.act(b.dataset.act);events();save();}));
 listen($('localeSelect'),'change',e=>{locale=LOCALES.includes(e.target.value)?e.target.value:'en';try{localStorage.setItem('weightPlayLocale',locale);}catch{}window.WonderI18n?.setLocale?.(locale,{navigate:false});copy();const u=new URL(`/${ROUTES[locale]}/games/purrch-grove/`,location.origin);u.search=location.search;u.searchParams.delete('lang');save();location.assign(u.href);});
 listen(document,'visibilitychange',()=>{last=performance.now();save();audio?.stop();if(document.hidden)motion.clear();});listen(window,'blur',()=>{if(screen==='battle'&&!panel&&!result&&!lost)openPanel('leave');});
 listen(document,'keydown',e=>{const modal=panel?$('panel'):result?$('resultPanel'):null;if(!modal)return;if(e.key==='Escape'&&panel){e.preventDefault();closePanel();}if(e.key==='Tab'){const list=[...modal.querySelectorAll('button,select,a')].filter(n=>!n.disabled&&n.getClientRects().length);const first=list[0],last=list.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}});
 listen(window,'pagehide',e=>{save();motion.clear();if(!e.persisted){disposeRoom();selector.destroy();frame.destroy();audio?.dispose();manageAbort.abort();panelAbort.abort();abort.abort();}});
 window.WeightPlayAudio?.preload?.(['game.start','ui.click','feedback.success','feedback.error','reward.coin','reward.unlock','shop.purchase','result.win']);copy();show('main');
 window.PurrchGrove=Object.freeze({identity:()=>({game:'purrch-grove',version:'v3',interface:'9',saveKey:STORE}),renderStats:()=>room?{revision:'180',calls:room.renderer.info.render.calls,triangles:room.renderer.info.render.triangles,geometries:room.renderer.info.memory.geometries,textures:room.renderer.info.memory.textures}:null});
}
boot();
