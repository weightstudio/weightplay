import {Run,STORE,normalizeSave,UPGRADES,train} from './model.mjs?v=6';
import {STAGES,ARCS,RULES,HINTS,ENEMY_HINTS} from './stages.mjs?v=6';
import {World} from './world.mjs?v=6';
import {LOCALES,ROUTES,LANGUAGE_LABELS,normalizeLocale,text,dataLabel,pairText,guideSections} from './locales.mjs?v=6';
import {buyPrismInlay,recoverPrismInlay,PRISM_COST} from './prism-purchase.mjs?v=6';
import {LocalPractice} from '/src/game-local-practice.mjs';
const $=id=>document.getElementById(id),make=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
const read=k=>{try{return localStorage.getItem(k);}catch{return null;}};
let raw;try{raw=JSON.parse(read(STORE));}catch{}const save=normalizeSave(raw);
const routeLocale=Object.entries(ROUTES).find(([,route])=>route===location.pathname.split('/')[1])?.[0];
let locale=normalizeLocale(new URLSearchParams(location.search).get('lang')||routeLocale||read('weightPlayLocale')||'en');const t=k=>text(locale,k),label=o=>dataLabel(locale,o),pair=p=>pairText(locale,p);
let purchaseBusy=false;
const abort=new AbortController(),listen=(node,event,fn)=>node.addEventListener(event,fn,{signal:abort.signal});
let frame,selector,world=null,joystick=null,arenaObserver=null,run=null,screen='main',tab='stages',panel='',result=null,last=0,raf=0,uiClock=0,cueUntil=0,cuePriority=0,selected=save.unlocked-1,practiceMode=false,lostGraphics=false;
const keys=new Set(),heldKeys=new Set(),modalHeldKeys=new Set(),damageLabels=new Map(),icons={},animations=new Set();const audio=window.WeightPlayAudio?.createScope();const sound=id=>audio?.play(id);
const format=(key,values)=>t(key).replace(/\{(\w+)\}/g,(_,name)=>String(values[name]));
function persist(){if(practiceMode)return;try{localStorage.setItem(STORE,JSON.stringify(save));if(localStorage.getItem(STORE)!==JSON.stringify(save))throw Error('Save unconfirmed');$('saveWarning').hidden=true;return true;}catch{$('saveWarning').hidden=false;$('saveWarning').textContent=t('saveError');return false;}}
function animate(node,frames,duration=180){if(!node?.animate)return;const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;const a=node.animate(reduced?[{opacity:.3},{opacity:1}]:frames,{duration:reduced?70:duration,easing:'cubic-bezier(.2,.7,.2,1)'});animations.add(a);a.finished.catch(()=>{}).finally(()=>animations.delete(a));return a;}
function enter(node){animate(node,[{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}]);}
function image(key,size=56){const n=make('img');n.src=icons[key]||'/assets/weightplay-character-spark-paw-fox-block-v1.webp';n.width=size;n.height=size;n.alt='';return n;}
function gold(value){const n=make('span',undefined,'currency');n.append(image('coin',24),make('span',String(value)));return n;}
function diamonds(value){const n=make('span',undefined,'currency'),icon=make('img');icon.src='/assets/weightplay-diamond.svg';icon.alt='';icon.width=24;icon.height=24;n.append(icon,make('span',String(value)));return n;}
function walletState(){try{return window.WeightPlayWallet?.read?.()||{diamonds:0,available:false};}catch{return {diamonds:0,available:false};}}
function recoverPurchase(){try{const recovered=recoverPrismInlay(save,window.localStorage,window.WeightPlayWallet);if(recovered.pending){$('saveWarning').hidden=false;$('saveWarning').textContent=t('saveError');}}catch{$('saveWarning').hidden=false;$('saveWarning').textContent=t('saveError');}}
function cue(text,priority=0,duration=priority>1?2400:1800){if(performance.now()<cueUntil&&priority<cuePriority)return;cuePriority=priority;$('worldFeedback').textContent=text;cueUntil=performance.now()+duration;$('worldFeedback').classList.add('show');}
function clearInput(){keys.clear();joystick?.reset();}
function settingsOpen(){return Boolean($('gameFrame').querySelector('[data-wp-preferences] .wp-frame-popover:not([hidden])'));}
function blocked(){return screen!=='battle'||panel||result||lostGraphics||document.hidden||settingsOpen()||run?.state!=='running';}
function stopWorld(){cancelAnimationFrame(raf);raf=0;arenaObserver?.disconnect();arenaObserver=null;joystick?.destroy();joystick=null;world?.dispose();world=null;audio?.stop();clearInput();heldKeys.clear();modalHeldKeys.clear();damageLabels.clear();$('floaters').replaceChildren();}
function show(next){
 if(screen==='battle'&&next!=='battle')stopWorld();for(const a of animations)a.cancel();animations.clear();
 panel='';result=null;$('overlay').hidden=true;$('resultPanel').hidden=true;$('battleLive').inert=false;
 screen=next;document.body.dataset.screen=next;for(const name of ['main','stage','battle']){$(name+'Screen').hidden=name!==next;$(name+'Screen').inert=name!==next;}$('mainGroup').hidden=next!=='main';
 frame.activate(next);clearInput();if(next==='stage'){stageTab('stages');selector.refresh(selected);}
 update();
}
function stageTab(next){tab=next;const management=next!=='stages';$('stagesPage').hidden=management;$('stagesPage').classList.toggle('hidden',management);$('stagesPage').inert=management;$('management').hidden=!management;
 for(const [id,key]of [['heroTab','hero'],['stagesTab','stages'],['gearTab','gear']])$(id).setAttribute('aria-selected',String(next===key));
 if(management)renderManagement();else selector?.refresh(selected);
}
function renderManagement(){const c=$('manageContent');c.replaceChildren();$('manageNotice').textContent=practiceMode?t('practice'):'';const funds=walletState(),summary=$('manageResources');summary.replaceChildren(gold(save.coins),diamonds(funds.diamonds));summary.children[0].title=t('coins');summary.children[1].title=t('diamondBalance');
 const items=tab==='hero'?['vitality']:['edge','magnet'];
 for(const key of items){const level=save.training[key],cost=50+level*45,card=make('article',undefined,'equipment-card');const icon=key==='vitality'?make('img'):image(key==='edge'?'power':'gem',76);if(key==='vitality'){icon.src='/assets/weightplay-character-spark-paw-fox-block-v1.webp';icon.alt='Spark Paw Fia';}
  card.append(icon,make('h3',`${t(key)} ${level}/5`),make('p',t(key+'Desc')));const b=make('button',level>=5?t('max'):t('buy')+' · ');if(level<5)b.append(gold(cost));b.disabled=level>=5||practiceMode;b.addEventListener('click',()=>{if(!train(save,key)){$('manageNotice').textContent=t('needCoins');sound('feedback.error');return;}persist();sound('shop.purchase');renderManagement();update();$('manageNotice').textContent=t('trained');});card.append(b);c.append(card);}
 if(tab==='gear')for(const k of ['ember','frost','storm']){const card=make('article',undefined,'equipment-card');card.append(image(k,76),make('h3',label(UPGRADES[k])),make('p',pair(UPGRADES[k].desc)));c.append(card);}
 if(tab==='gear'){
  const card=make('article',undefined,'equipment-card');card.id='prismCard';card.append(image('prism',76),make('h3',t('cosmetic')),make('p',t('cosmeticDesc')));
  const button=make('button',t(save.prismInlayOwned?(save.prismInlayEquipped?'unequipCosmetic':'equipCosmetic'):'buyCosmetic'));button.id='prismBuy';if(!save.prismInlayOwned)button.append(diamonds(PRISM_COST));button.disabled=practiceMode||purchaseBusy||(!save.prismInlayOwned&&(!funds.available||funds.diamonds<PRISM_COST));
  const status=make('p',t(purchaseBusy?'purchasePending':save.prismInlayOwned?(save.prismInlayEquipped?'equipped':'cosmeticOwned'):!funds.available?'purchaseError':funds.diamonds<PRISM_COST?'needDiamonds':'cosmeticDesc'));status.id='prismStatus';status.setAttribute('role','status');card.append(status,button);
  button.addEventListener('click',async()=>{if(practiceMode||purchaseBusy)return;if(save.prismInlayOwned){save.prismInlayEquipped=!save.prismInlayEquipped;const saved=persist();sound('ui.click');renderManagement();$('manageNotice').textContent=t(saved?'cosmeticSelected':'saveError');return;}
   purchaseBusy=true;renderManagement();let purchase;try{purchase=await buyPrismInlay(save,window.localStorage,window.WeightPlayWallet);}catch{purchase={ok:false,reason:'storage'};}finally{purchaseBusy=false;}
   if(purchase.ok){sound('shop.purchase');recoverPurchase();}else sound('feedback.error');if(screen==='stage'&&tab==='gear'){renderManagement();$('manageNotice').textContent=t(purchase.ok?(purchase.pending?'saveError':'cosmeticPurchased'):purchase.reason==='insufficient'?'needDiamonds':'purchaseError');}update();
  });c.append(card);
 }
 enter(c);
}
async function start(id){
 if(practiceMode||LocalPractice.enabled){if(!await LocalPractice.validate()){cue(t('practice'));return;}practiceMode=true;}
 if(!practiceMode&&id>save.unlocked)return;
 stopWorld();run=new Run(id,save,{practice:practiceMode});selected=id-1;lostGraphics=false;cueUntil=0;cuePriority=0;show('battle');$('graphicsError').hidden=true;
 try{world=new World($('arena'),()=>{lostGraphics=true;clearInput();$('graphicsError').hidden=false;});world.render(run,0);joystick=window.WeightPlayJoystick.create({surface:world.renderer.domElement,container:$('arena'),mode:'floating',anchor:{left:70,bottom:70},enabled:true,isEnabled:()=>!blocked()});arenaObserver=new ResizeObserver(()=>joystick?.refresh());arenaObserver.observe($('arena'));world.renderer.domElement.setAttribute('aria-label',t('arena'));world.renderer.domElement.focus({preventScroll:true});}
 catch(e){console.error('BLADE_ORBIT_3D',e);lostGraphics=true;$('graphicsError').hidden=false;}
 $('controlHint').textContent=t('controlHint');last=performance.now();uiClock=0;raf=requestAnimationFrame(loop);sound('game.start');cue(pair(HINTS[run.stage.layout]));update();
}
function movement(){let x=(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0),y=(keys.has('s')||keys.has('arrowdown')?1:0)-(keys.has('w')||keys.has('arrowup')?1:0);if(!x&&!y){const v=joystick?.getVector();x=v?.x||0;y=v?.y||0;}return {x,y};}
function loop(now){const dt=Math.min(.05,Math.max(0,(now-last)/1000));last=now;const isBlocked=blocked();joystick?.setEnabled(!isBlocked);
 if(!isBlocked){run.tick(dt,movement());processEvents();}
 if(world&&!lostGraphics&&!document.hidden)world.render(run,isBlocked?0:dt);
 uiClock+=dt;if(uiClock>.1){uiClock=0;update();}if(now>cueUntil)$('worldFeedback').classList.remove('show');if(screen==='battle')raf=requestAnimationFrame(loop);
}
function floater(e){if(!world||e.amount<=0)return;const now=performance.now(),previous=damageLabels.get(e.targetId);
 if(previous&&now-previous.born<190&&previous.node.isConnected){previous.amount+=e.amount;previous.node.textContent=String(previous.amount);if(e.critical)previous.node.classList.add('critical');return;}
 if($('floaters').childElementCount>=(e.critical?12:8))return;
 const p=world.point(e.x,e.z,1.15),n=make('span',String(e.amount),'damage-number'+(e.critical?' critical':'')),entry={node:n,born:now,amount:e.amount};damageLabels.set(e.targetId,entry);n.style.left=p.x+'px';n.style.top=p.y+'px';$('floaters').append(n);
 const done=()=>{n.remove();if(damageLabels.get(e.targetId)===entry)damageLabels.delete(e.targetId);};
 const a=animate(n,[{opacity:.95,transform:'translate(-50%,-50%)'},{opacity:0,transform:'translate(-50%,-150%)'}],420);if(a)a.finished.catch(()=>{}).finally(done);else done();}
function pickupFlight(e){if(!world||matchMedia('(prefers-reduced-motion:reduce)').matches)return;const isXP=e.kind==='xp'||!e.swordsAdded&&e.xpAdded>0,n=image(isXP?'gem':e.kind==='heal'?'heal':'sword',24),p=world.point(e.x,e.z),arena=$('arena').getBoundingClientRect(),dest=(isXP?$('levelStat'):e.kind==='heal'?$('healthText'):$('bladeStat')).getBoundingClientRect();n.className='pickup-flight';n.style.left=arena.left+p.x+'px';n.style.top=arena.top+p.y+'px';document.body.append(n);const a=animate(n,[{opacity:1,transform:'translate(-50%,-50%)'},{opacity:0,transform:`translate(${dest.left+dest.width/2-arena.left-p.x}px,${dest.top+dest.height/2-arena.top-p.y}px)`}],330);a?.finished.catch(()=>{}).finally(()=>n.remove());}
function pickupCue(e){
 if(e.kind==='sword')return e.swordsAdded?`${t('blades')} +${e.swordsAdded}`:format('swordOverflow',{amount:e.xpAdded});
 if(e.kind==='cache')return format('cacheGained',{swords:e.swordsAdded,xp:e.xpAdded});
 if(e.kind==='heal')return e.healthAdded>0?format('healthGained',{amount:Math.round(e.healthAdded)}):t('healthFull');
 return '';
}
function processEvents(){for(const e of run.events.splice(0)){
 world?.feedback(e);
 if(e.type==='hit'){sound(e.critical?'combat.critical':e.element==='frost'?'magic.ice':'weapon.sword.hit');floater(e);}
 else if(e.type==='chain'){sound('magic.hit');floater({...e,x:e.toX,z:e.toZ});}
 else if(e.type==='hurt'){sound('player.hurt');animate($('healthText'),[{color:'#ff758c'},{color:'#e5fff7'}],250);if(navigator.vibrate&&!matchMedia('(prefers-reduced-motion:reduce)').matches)navigator.vibrate(18);}
 else if(e.type==='defeat')sound('enemy.defeat');
 else if(e.type==='block')sound('combat.block');else if(e.type==='break')sound('combat.shield.break');
 else if(e.type==='pickup'){sound(e.kind==='heal'?'magic.heal':'reward.collect');pickupFlight(e);const message=pickupCue(e);if(message)cue(message);}
 else if(e.type==='upgrade'){openUpgrades();sound('reward.upgrade');}
 else if(e.type==='choice'){sound(['ember','frost','storm'].includes(e.key)?'reward.unlock':'reward.upgrade');cue(label(UPGRADES[e.key]));}
 else if(e.type==='evolve'){sound('reward.unlock');cue(t('forge'),4,3200);}
 else if(e.type==='dash')sound('movement.dash');
 else if(e.type==='boss'){sound('alert.boss');cue(label(run.stage),3);}
 else if(e.type==='wave')cue(`${t('wave')} · ${e.wave}`,1);
 else if(e.type==='enemyIntro')cue(pair(ENEMY_HINTS[e.kind]),2);
 else if(e.type==='elite'||e.type==='enrage'){sound('alert.warning');cue(t(e.type),5);}
 else if(e.type==='detonate')sound('explosion.small');
 else if(e.type==='summon')sound('magic.cast');
 else if(e.type==='volley')sound('projectile.launch');
 else if(e.type==='healCast')sound('magic.heal');
 else if(e.type==='objective'){sound('reward.unlock');cue(t(run.stage.rule==='beacons'?'lit':'nest'));}
 else if(e.type==='cacheArrival')cue(t('cacheArrival'));
 else if(e.type==='cacheFinale'){sound('reward.unlock');cue(format('cacheFinale',{seconds:e.seconds}),2);}
 else if(e.type==='result')showResult();
 }update();}
function setPanel(kind,title,summary){panel=kind;clearInput();audio?.stop();joystick?.setEnabled(false);$('overlay').hidden=false;$('battleLive').inert=true;frame.activate('battle',{covered:true});$('overlayTitle').textContent=title;$('overlaySummary').textContent=summary;$('overlayBody').replaceChildren();$('overlayActions').replaceChildren();enter($('overlay').firstElementChild);}
function action(label,fn){const b=make('button',label);b.addEventListener('click',fn);$('overlayActions').append(b);return b;}
function closePanel(){panel='';$('overlay').hidden=true;$('battleLive').inert=false;frame.activate('battle');clearInput();last=performance.now();$('battleBackBtn').focus({preventScroll:true});}
function openPause(help=false){if(screen!=='battle'||result||run.state==='upgrade')return;setPanel(help?'help':'pause',t(help?'help':'pause'),help?(t('helpSummary')):(t('leaveSummary')));
 if(help){for(const text of [t('helpSwords'),t('helpCrystals'),t('helpAwakening'),t('helpDash'),pair(HINTS[run.stage.layout])])$('overlayBody').append(make('p',text));}
 if(help)for(const kind of Object.keys(ENEMY_HINTS))if(run.stage.enemies.includes(kind))$('overlayBody').append(make('p',pair(ENEMY_HINTS[kind])));
 const safe=action(t('continue'),closePanel);if(!help)action(t('leave'),()=>show('stage'));safe.focus({preventScroll:true});}
function openUpgrades(){setPanel('upgrade',t(run.options.includes('ember')?'element':'upgrade'),`${t('level')} ${run.level} · ${t('upgradePaused')} ${run.level>=4?t('upgradeBatch')+' ':''}${t('upgradeInput')}`);
 modalHeldKeys.clear();for(const key of heldKeys)modalHeldKeys.add(key);
 const progress=make('section',undefined,'forge-progress');progress.setAttribute('aria-label',t('forgeProgress'));
 progress.append(make('strong',t(run.up.evolve?'forgeComplete':run.pendingEvolution?'forgeReady':'forgeProgress')));
 const requirements=make('div',undefined,'forge-requirements');
 for(const [icon,name,current,goal]of [[run.path||'evolve',run.path?label(UPGRADES[run.path]):t('element'),run.chosenPath?1:0,1],['sword',t('blades'),run.swords,8],['power',label(UPGRADES.power),run.up.power,3],['speed',label(UPGRADES.speed),run.up.speed,2]]){const chip=make('span',undefined,'forge-requirement');chip.dataset.ready=String(current>=goal);chip.append(image(icon,24),make('span',`${name} ${Math.min(current,goal)}/${goal}${current>=goal?' ✓':''}`));requirements.append(chip);}
 progress.append(requirements);$('overlayBody').append(progress);
 for(const key of run.options){const item=UPGRADES[key],b=make('button',undefined,'upgrade-choice'),ranks=run.upgradeRanks(key),gain=Math.min(2*ranks,24-run.swords),percent=run.upgradePercent(key);
  const description=key==='blade'?format('bladeGainDesc',{amount:gain}):key==='heal'?format('upgradeDesc.heal',{amount:run.upgradeHealing}):percent!==null?format('upgradeDesc.'+key,{amount:new Intl.NumberFormat(locale,{maximumFractionDigits:1}).format(percent)}):pair(item.desc);
  b.dataset.upgrade=key;b.append(image(item.icon),make('strong',key==='blade'?`${t('blades')} +${gain}`:label(item)),make('small',description));
  if(Object.hasOwn(run.up,key)&&!['heal','blade','evolve'].includes(key))b.append(make('span',`${t('level')} ${run.up[key]} → ${run.up[key]+ranks}`,'upgrade-rank'));
  b.addEventListener('click',()=>{if(run.choose(key)){closePanel();processEvents();}});$('overlayBody').append(b);}
 $('overlayTitle').tabIndex=-1;$('overlayTitle').focus({preventScroll:true});}
function showResult(settled=run.settle(),refresh=false){if(!settled)return;result=settled;panel='';clearInput();joystick?.setEnabled(false);$('overlay').hidden=true;$('resultPanel').hidden=false;$('battleLive').inert=true;frame.activate('battle',{covered:true});if(!refresh){persist();modalHeldKeys.clear();for(const key of heldKeys)modalHeldKeys.add(key);}
 $('resultTitle').textContent=t(settled.won?'won':'lost');$('resultKicker').textContent=`${t('stage')} ${run.stage.id} · ${label(run.stage)}`;$('resultStars').textContent=settled.won?'★'.repeat(settled.stars)+'☆'.repeat(3-settled.stars):'';$('resultStars').ariaLabel=`${settled.stars} / 3`;
 const cause=settled.lastDamage?.kind||'contact',progress=run.stage.goal?`${pair(RULES[run.stage.rule])} ${settled.objectives}/${run.stage.goal}`:run.stage.boss?pair(RULES[run.stage.rule]):`${t('survive')} ${Math.floor(settled.time)}/${run.stage.duration}${t('seconds')}`;
 $('resultSummary').textContent=settled.won?(practiceMode?t('practice'):t('nextReady')):`${format('lastThreat',{source:t('threat.'+cause)})}\n${progress}`;
 $('resultStats').replaceChildren();for(const [key,value]of [['kills',settled.kills],['blades',settled.swords],['combo',settled.combo]]){const n=make('span');n.append(make('strong',String(value)),make('span',t(key)));$('resultStats').append(n);}
 $('resultGold').replaceChildren(make('span',practiceMode?t('practice'):t('coins')+' +'),gold(practiceMode?0:settled.gold));$('resultTip').textContent=t(settled.won?'elementTip':'recovery.'+cause);$('resultNext').disabled=!settled.won||run.stage.id>=30;enter($('resultPanel').firstElementChild);if(!refresh){sound(settled.won?'result.win':'result.lose');$('resultTitle').tabIndex=-1;$('resultTitle').focus({preventScroll:true});}}
function update(){
 $('mainProgress').textContent=`${t('stage')} ${save.unlocked} / ${STAGES.length}`;if($('coinValue'))$('coinValue').textContent=String(save.coins);
 if(!run||screen!=='battle')return;const p=run.player;$('bladeValue').textContent=String(run.swords);$('speedValue').textContent=(run.speed/(Math.PI*2)).toFixed(1)+'/s';$('levelValue').textContent=String(run.level);const remaining=Math.max(0,Math.ceil(run.endTime-run.time));$('timeValue').textContent=`${Math.floor(remaining/60)}:${String(remaining%60).padStart(2,'0')}`;
 $('healthText').textContent=`${Math.ceil(p.health)} / ${p.maxHealth}`;$('healthFill').style.transform=`scaleX(${p.health/p.maxHealth})`;$('xpFill').style.transform=`scaleX(${Math.min(1,run.xp/run.nextXP)})`;
 $('objective').textContent=`${t('stage')} ${run.stage.id} · ${pair(RULES[run.stage.rule])}${run.stage.goal?' '+run.objectives+'/'+run.stage.goal:''}`;
 if(run.stage.rule==='caches')$('objective').textContent=`${t('stage')} ${run.stage.id} · ${run.objectives}/${run.stage.goal} · ${run.cacheFinishAt!==null?format('cacheFinale',{seconds:remaining}):run.nextCache?format('cacheNext',{seconds:Math.max(0,Math.ceil(run.nextCache.at-run.time))}):pair(RULES.caches)}`;
 $('dashBtn').disabled=p.dashCD>0||blocked();$('dashTime').textContent=p.dashCD>0?p.dashCD.toFixed(1)+'s':'SPACE';
 const boss=run.enemies.find(e=>e.boss);$('bossHud').hidden=!boss;if(boss){$('bossName').textContent=label(run.stage);$('bossFill').style.transform=`scaleX(${Math.max(0,boss.hp/boss.maxHp)})`;}
}
function localize(){document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';document.title=t('title')+' | WeightPlay';$('localeSelect').value=locale;document.querySelectorAll('[data-copy]').forEach(n=>n.textContent=t(n.dataset.copy));
 for(const [id,key]of [['mainReturn','backLobby'],['stageBackBtn','backMain'],['battleBackBtn','pause'],['helpBtn','help']])$(id).setAttribute('aria-label',t(key));document.querySelector('.main-poster').alt=t('posterAlt');$('controlHint').textContent=t('controlHint');world?.renderer.domElement.setAttribute('aria-label',t('arena'));
 $('guideSections').replaceChildren();for(const item of guideSections(locale)){const section=make('section',undefined,'game-info-section');section.append(make('h3',item.title),make('p',item.body));$('guideSections').append(section);}
 $('guideFacts').replaceChildren();for(const [a,b]of [[30,t('factsEncounters')],[6,t('factsGuardians')],[3,t('factsElements')],['45–90',t('factsSeconds')]]){const n=make('div');n.append(make('strong',String(a)),make('span',b));$('guideFacts').append(n);}
 const faq=make('details');faq.append(make('summary',t('faqTitle')),make('p',t('faqAnswer')));$('gameGuideFaq').replaceChildren(faq);selector?.refresh(selected);frame?.refresh();if(screen==='stage'&&tab!=='stages')renderManagement();if(result)showResult(result,true);else if(panel==='upgrade')openUpgrades();else if(panel)openPause(panel==='help');update();
}
async function boot(){
 frame=window.WeightPlayScreenFrame.mount({root:$('gameFrame'),localeSelect:$('localeSelect'),playUI:true,scenes:{main:{root:$('mainScreen'),header:$('mainScreen').querySelector('header'),content:document.querySelector('.main-hero')},stage:{root:$('stageScreen'),header:$('stageScreen').querySelector('header'),content:$('stageWorkspace')},battle:{root:$('battleScreen'),header:$('battleScreen').querySelector('header'),content:$('battleLive')}}});
 // Generate item portraits from the same authored 3D objects used in battle.
 const host=make('div');Object.assign(host.style,{position:'fixed',left:'-10000px',width:'96px',height:'96px'});document.body.append(host);let artist;try{artist=new World(host);Object.assign(icons,artist.portraits());}catch(e){console.warn('BLADE_ICON_RENDER',e.message);}finally{artist?.dispose();host.remove();}
 $('localeSelect').replaceChildren(...LOCALES.map((l,i)=>{const option=make('option',LANGUAGE_LABELS[i]);option.value=l;return option;}));
 const group=window.WeightPlayScreenFrame.createGroup();for(const [id,key,icon]of [['blade','blades','sword'],['speed','speed','speed'],['level','level','gem'],['time','seconds',null]]){const n=make('span',undefined,'hud-stat');n.id=id+'Stat';if(icon)n.append(image(icon,24));const v=make('span','0');v.id=id+'Value';n.append(v);n.title=t(key);group.add(n);}frame.battleTopUI.add(group);
 recoverPurchase();
 selector=window.WeightPlayPlayUI.mountStage({page:$('stagesPage'),rail:$('stageRail'),selected,config:{count:STAGES.length,poster:'/games/blade-orbit/assets/poster.webp',background:'/assets/lobby-block-atmosphere.svg',stage(i){const s=STAGES[i];return {id:s.id,kicker:`${label(ARCS[s.arc])} · ${s.id}/30`,title:label(s),subtitle:pair(RULES[s.rule]),summary:pair(HINTS[s.layout]),details:[s.boss?t('boss'):`${s.duration}${t('seconds')}`,`${t('coins')} +${s.reward}`],poster:'/games/blade-orbit/assets/poster.webp',status:t(s.id>save.unlocked&&!practiceMode?'locked':save.stars[i]?'cleared':'ready'),locked:s.id>save.unlocked&&!practiceMode,cleared:save.stars[i]>0};}},isActive:()=>screen==='stage'&&tab==='stages',onSelect(i){selected=i;},onStart(i){start(i+1);}});
 for(const [id,fn]of [['startBtn',()=>show('stage')],['stageBackBtn',()=>show('main')],['battleBackBtn',()=>result?show('stage'):openPause()],['heroTab',()=>stageTab('hero')],['stagesTab',()=>stageTab('stages')],['gearTab',()=>stageTab('gear')],['helpBtn',()=>openPause(true)],['graphicsRetry',()=>start(run.stage.id)],['graphicsBack',()=>show('stage')],['resultStages',()=>show('stage')],['resultNext',()=>start(run.stage.id+1)],['resultReplay',()=>start(run.stage.id)],['dashBtn',()=>{const v=movement();if(run?.dash(v.x,v.y))processEvents();}]])listen($(id),'click',fn);
 listen(document,'keydown',e=>{const key=e.key.toLowerCase(),modal=!$('overlay').hidden?$('overlay'):!$('resultPanel').hidden?$('resultPanel'):null;heldKeys.add(key);
  if(modal){if((panel==='upgrade'||result)&&[' ','enter'].includes(key)&&(modalHeldKeys.has(key)||e.repeat||!document.activeElement?.matches(panel==='upgrade'?'.upgrade-choice':'.result-actions button'))){e.preventDefault();return;}if(key==='escape'&&panel&&panel!=='upgrade'){e.preventDefault();closePanel();}if(key==='tab'){const nodes=[...modal.querySelectorAll('button')].filter(n=>!n.disabled),first=nodes[0],last=nodes.at(-1);if(!nodes.includes(document.activeElement)){e.preventDefault();(e.shiftKey?last:first)?.focus();}else if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}return;}
  if(screen!=='battle'||settingsOpen())return;if(['w','a','s','d','arrowup','arrowleft','arrowdown','arrowright',' '].includes(key)){e.preventDefault();if(key===' '&&!e.repeat){const v=movement();run.dash(v.x,v.y);processEvents();}else keys.add(key);}if(key==='escape'){e.preventDefault();openPause();}
 });listen(document,'keyup',e=>{const key=e.key.toLowerCase();keys.delete(key);heldKeys.delete(key);if(modalHeldKeys.delete(key)&&(panel==='upgrade'||result)&&[' ','enter'].includes(key))e.preventDefault();});listen(window,'blur',()=>{clearInput();heldKeys.clear();modalHeldKeys.clear();if(screen==='battle'&&!panel&&!result)openPause();});listen(document,'visibilitychange',()=>{clearInput();heldKeys.clear();modalHeldKeys.clear();last=performance.now();audio?.stop();if(document.hidden&&screen==='battle'&&!panel&&!result)openPause();});
 listen($('localeSelect'),'change',()=>{locale=normalizeLocale($('localeSelect').value);try{localStorage.setItem('weightPlayLocale',locale);}catch{}const url=new URL(location.href);url.pathname='/'+ROUTES[locale]+'/games/blade-orbit/';url.searchParams.delete('lang');history.replaceState(null,'',url);localize();});
 listen(window,'weightplay:wallet-change',()=>{if(screen==='stage'&&tab!=='stages')renderManagement();});
 listen(window,'pagehide',e=>{persist();clearInput();audio?.stop();if(!e.persisted){stopWorld();selector.destroy();frame.destroy();audio?.dispose();abort.abort();for(const a of animations)a.cancel();}});
 window.WeightPlayAudio?.preload(['game.start','weapon.sword.hit','combat.critical','combat.block','combat.shield.break','player.hurt','enemy.defeat','reward.collect','reward.upgrade','reward.unlock','movement.dash','magic.heal','magic.ice','magic.hit','magic.cast','projectile.launch','explosion.small','alert.warning','alert.boss','shop.purchase','result.win','result.lose','feedback.error']);
 localize();show('main');$('startBtn').disabled=true;
 if(document.readyState!=='complete')await new Promise(resolve=>window.addEventListener('load',resolve,{once:true,signal:abort.signal}));
 try{await document.querySelector('.main-poster').decode();}catch{window.WeightPlayGameEntryLoader?.fail();return;}
 await new Promise(resolve=>requestAnimationFrame(resolve));
 const isPreview=new URLSearchParams(location.search).get('preview')==='1';$('startBtn').disabled=!isPreview;$('startBtn').textContent=t(isPreview?'start':'coming');
 window.WeightPlayGameEntryLoader?.ready();
 LocalPractice.register({gameId:'blade-orbit',stageIds:STAGES.map(s=>s.id),enable:enabled=>{if(enabled){practiceMode=true;$('startBtn').disabled=false;$('startBtn').textContent=t('start');}selector.refresh(selected);},startStage:id=>start(Number(id))});
 window.BladeOrbit=Object.freeze({identity:()=>({game:'blade-orbit',version:'v6',interface:'9',target:9}),renderStats:()=>world?.stats()||null});
}
boot();
