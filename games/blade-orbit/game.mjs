import {Run,STORE,normalizeSave,UPGRADES,train} from './model.mjs';
import {STAGES,ARCS,RULES,HINTS} from './stages.mjs';
import {World} from './world.mjs';
import {LocalPractice} from '/src/game-local-practice.mjs';
const $=id=>document.getElementById(id),make=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
const read=k=>{try{return localStorage.getItem(k);}catch{return null;}};
let raw;try{raw=JSON.parse(read(STORE));}catch{}const save=normalizeSave(raw);
const copy={
 title:['劍陣無雙','Blade Orbit'],summary:['撿起飛劍，讓整個劍陣為你旋轉。邊走位、邊進化，將敵潮一掃而空。','Collect blades and command a growing sword orbit. Keep moving, evolve your build, and sweep through the horde.'],
 start:['開始遊戲','Start game'],stages:['關卡','Stages'],hero:['修練','Training'],gear:['裝備','Equipment'],dash:['閃步','Dash'],next:['下一關','Next stage'],replay:['重玩','Replay'],retry:['重試','Retry'],continue:['繼續遊戲','Continue'],leave:['返回關卡','Return to stages'],pause:['暫停休息','Take a breath'],help:['御劍訣竅','Swordcraft guide'],upgrade:['選擇一項強化','Choose an upgrade'],element:['選擇元素劍系','Choose your element'],
 level:['等級','Level'],blades:['飛劍','Blades'],speed:['轉速','Speed'],stage:['戰區','Encounter'],locked:['尚未解鎖','Locked'],ready:['可挑戰','Ready'],cleared:['已通關','Cleared'],boss:['首領戰','Guardian'],survive:['存活','Survive'],seconds:['秒','s'],won:['劍陣大成！','A flawless orbit!'],lost:['再淬鍊一次','Forge another attempt'],practice:['本機練習，不寫入進度','Local practice — progress is not saved'],coins:['金幣','Gold'],kills:['擊敗','Defeated'],combo:['最高連斬','Best chain'],forge:['神劍覺醒！','Sword awakened!'],swordPickup:['飛劍 +1','Blade +1'],cachePickup:['劍庫開啟 · 飛劍 +3','Cache opened · 3 blades'],healPickup:['生命回復','Health restored'],lit:['烽火點亮','Beacon lit'],nest:['巢穴擊破','Nest destroyed'],
 vitality:['堅韌修練','Vitality training'],edge:['劍鋒鍛造','Edge forging'],magnet:['靈晶共鳴','Crystal attunement'],vitalityDesc:['每級永久增加 12 點起始生命','Permanently start with 12 more health per rank.'],edgeDesc:['每級永久增加 2 點基礎劍傷','Permanently gain 2 base sword damage per rank.'],magnetDesc:['每級永久增加 12% 拾取範圍','Permanently gain 12% pickup range per rank.'],buy:['強化','Upgrade'],max:['已達上限','Max rank'],needCoins:['金幣不足，完成戰鬥即可累積','Earn more gold by completing encounters.'],trained:['強化完成，下場戰鬥生效','Upgraded. Applies to your next encounter.'],
 graphics:['3D 暫時無法顯示，請重試或回到關卡。','The 3D scene is unavailable. Retry or return safely.'],saveError:['目前無法保存進度；請確認瀏覽器儲存空間。','Progress could not be saved. Check browser storage.'],coming:['敬請期待','Coming soon'],
};
const routeLocale={en:'en','zh-tw':'zh-Hant','zh-cn':'zh-Hans',ja:'ja',ko:'ko',es:'es','pt-br':'pt-BR',fr:'fr',de:'de',it:'it',ru:'ru',hi:'hi',ar:'ar'}[location.pathname.split('/')[1]];
let locale=new URLSearchParams(location.search).get('lang')||routeLocale||read('weightPlayLocale')||'zh-Hant';let zh=locale.startsWith('zh');const t=k=>copy[k]?.[zh?0:1]||k;const label=o=>o[zh?'zh':'en'];
const abort=new AbortController(),listen=(node,event,fn)=>node.addEventListener(event,fn,{signal:abort.signal});
let frame,selector,world=null,joystick=null,arenaObserver=null,run=null,screen='main',tab='stages',panel='',result=null,last=0,raf=0,uiClock=0,cueUntil=0,selected=save.unlocked-1,practiceMode=false,lostGraphics=false;
const keys=new Set(),icons={},animations=new Set();const audio=window.WeightPlayAudio?.createScope();const sound=id=>audio?.play(id);
function persist(){if(practiceMode)return;try{localStorage.setItem(STORE,JSON.stringify(save));$('saveWarning').hidden=true;}catch{$('saveWarning').hidden=false;$('saveWarning').textContent=t('saveError');}}
function animate(node,frames,duration=180){if(!node?.animate)return;const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;const a=node.animate(reduced?[{opacity:.3},{opacity:1}]:frames,{duration:reduced?70:duration,easing:'cubic-bezier(.2,.7,.2,1)'});animations.add(a);a.finished.catch(()=>{}).finally(()=>animations.delete(a));return a;}
function enter(node){animate(node,[{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}]);}
function image(key,size=56){const n=make('img');n.src=icons[key]||'/assets/weightplay-character-spark-paw-fox-block-v1.webp';n.width=size;n.height=size;n.alt='';return n;}
function gold(value){const n=make('span',undefined,'currency');n.append(image('coin',24),make('span',String(value)));return n;}
function cue(text){$('worldFeedback').textContent=text;cueUntil=performance.now()+1800;$('worldFeedback').classList.add('show');}
function clearInput(){keys.clear();joystick?.reset();}
function settingsOpen(){return Boolean($('gameFrame').querySelector('[data-wp-preferences] .wp-frame-popover:not([hidden])'));}
function blocked(){return screen!=='battle'||panel||result||lostGraphics||document.hidden||settingsOpen()||run?.state!=='running';}
function stopWorld(){cancelAnimationFrame(raf);raf=0;arenaObserver?.disconnect();arenaObserver=null;joystick?.destroy();joystick=null;world?.dispose();world=null;audio?.stop();clearInput();$('floaters').replaceChildren();}
function show(next){
 if(screen==='battle'&&next!=='battle')stopWorld();for(const a of animations)a.cancel();animations.clear();
 panel='';result=null;$('overlay').hidden=true;$('resultPanel').hidden=true;$('battleLive').inert=false;
 screen=next;document.body.dataset.screen=next;for(const name of ['main','stage','battle']){$(name+'Screen').hidden=name!==next;$(name+'Screen').inert=name!==next;}$('mainGroup').hidden=next!=='main';
 frame.activate(next);clearInput();if(next==='stage'){stageTab('stages');selector.refresh(selected);}
 enter($(next+'Screen'));update();
}
function stageTab(next){tab=next;const management=next!=='stages';$('stagesPage').hidden=management;$('stagesPage').classList.toggle('hidden',management);$('stagesPage').inert=management;$('management').hidden=!management;
 for(const [id,key]of [['heroTab','hero'],['stagesTab','stages'],['gearTab','gear']])$(id).setAttribute('aria-selected',String(next===key));
 if(management)renderManagement();else selector?.refresh(selected);
}
function renderManagement(){const c=$('manageContent');c.replaceChildren();$('manageNotice').textContent=practiceMode?t('practice'):'';
 const items=tab==='hero'?['vitality']:['edge','magnet'];
 for(const key of items){const level=save.training[key],cost=50+level*45,card=make('article',undefined,'equipment-card');const icon=key==='vitality'?make('img'):image(key==='edge'?'power':'gem',76);if(key==='vitality'){icon.src='/assets/weightplay-character-spark-paw-fox-block-v1.webp';icon.alt='Spark Paw Fia';}
  card.append(icon,make('h3',`${t(key)} ${level}/5`),make('p',t(key+'Desc')));const b=make('button',level>=5?t('max'):t('buy')+' · ');if(level<5)b.append(gold(cost));b.disabled=level>=5||practiceMode;b.addEventListener('click',()=>{if(!train(save,key)){$('manageNotice').textContent=t('needCoins');sound('feedback.error');return;}persist();sound('shop.purchase');renderManagement();update();$('manageNotice').textContent=t('trained');});card.append(b);c.append(card);}
 if(tab==='gear')for(const k of ['ember','frost','storm']){const card=make('article',undefined,'equipment-card');card.append(image(k,76),make('h3',label(UPGRADES[k])),make('p',UPGRADES[k].desc[zh?0:1]));c.append(card);}
 enter(c);
}
async function start(id){
 if(practiceMode||LocalPractice.enabled){if(!await LocalPractice.validate()){cue(t('practice'));return;}practiceMode=true;}
 if(!practiceMode&&id>save.unlocked)return;
 stopWorld();run=new Run(id,save,{practice:practiceMode});selected=id-1;lostGraphics=false;show('battle');$('graphicsError').hidden=true;
 try{world=new World($('arena'),()=>{lostGraphics=true;clearInput();$('graphicsError').hidden=false;});world.render(run,0);joystick=window.WeightPlayJoystick.create({surface:world.renderer.domElement,container:$('arena'),mode:'floating',anchor:{left:70,bottom:70},enabled:true,isEnabled:()=>!blocked()});arenaObserver=new ResizeObserver(()=>joystick?.refresh());arenaObserver.observe($('arena'));world.renderer.domElement.focus({preventScroll:true});}
 catch(e){console.error('BLADE_ORBIT_3D',e);lostGraphics=true;$('graphicsError').hidden=false;}
 $('controlHint').textContent=zh?'拖曳 / WASD 移動':'Drag / WASD to move';last=performance.now();uiClock=0;raf=requestAnimationFrame(loop);sound('game.start');cue(HINTS[run.stage.layout][zh?0:1]);update();
}
function movement(){let x=(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0),y=(keys.has('s')||keys.has('arrowdown')?1:0)-(keys.has('w')||keys.has('arrowup')?1:0);if(!x&&!y){const v=joystick?.getVector();x=v?.x||0;y=v?.y||0;}return {x,y};}
function loop(now){const dt=Math.min(.05,Math.max(0,(now-last)/1000));last=now;const isBlocked=blocked();joystick?.setEnabled(!isBlocked);
 if(!isBlocked){run.tick(dt,movement());processEvents();}
 if(world&&!lostGraphics&&!document.hidden)world.render(run,isBlocked?0:dt);
 uiClock+=dt;if(uiClock>.1){uiClock=0;update();}if(now>cueUntil)$('worldFeedback').classList.remove('show');if(screen==='battle')raf=requestAnimationFrame(loop);
}
function floater(e){if(!world||$('floaters').childElementCount>=16)return;const p=world.point(e.x,e.z,1.15),n=make('span',String(e.amount),'damage-number'+(e.critical?' critical':''));n.style.left=p.x+'px';n.style.top=p.y+'px';$('floaters').append(n);const a=animate(n,[{opacity:1,transform:'translate(-50%,-50%)'},{opacity:0,transform:'translate(-50%,-170%)'}],460);a?.finished.catch(()=>{}).finally(()=>n.remove());}
function pickupFlight(e){if(!world||matchMedia('(prefers-reduced-motion:reduce)').matches)return;const n=image(e.kind==='xp'?'gem':e.kind==='heal'?'heal':'sword',24),p=world.point(e.x,e.z),arena=$('arena').getBoundingClientRect(),dest=(e.kind==='xp'?$('levelStat'):e.kind==='heal'?$('healthText'):$('bladeStat')).getBoundingClientRect();n.className='pickup-flight';n.style.left=arena.left+p.x+'px';n.style.top=arena.top+p.y+'px';document.body.append(n);const a=animate(n,[{opacity:1,transform:'translate(-50%,-50%)'},{opacity:0,transform:`translate(${dest.left+dest.width/2-arena.left-p.x}px,${dest.top+dest.height/2-arena.top-p.y}px)`}],330);a?.finished.catch(()=>{}).finally(()=>n.remove());}
function processEvents(){for(const e of run.events.splice(0)){
 world?.feedback(e);
 if(e.type==='hit'){sound(e.critical?'combat.critical':'weapon.sword.hit');floater(e);}
 else if(e.type==='hurt'){sound('player.hurt');if(navigator.vibrate&&!matchMedia('(prefers-reduced-motion:reduce)').matches)navigator.vibrate(18);}
 else if(e.type==='defeat')sound('enemy.defeat');
 else if(e.type==='block')sound('combat.block');else if(e.type==='break')sound('combat.shield.break');
 else if(e.type==='pickup'){sound(e.kind==='heal'?'magic.heal':'reward.collect');pickupFlight(e);if(e.kind!=='xp')cue(t(e.kind==='sword'?'swordPickup':e.kind==='cache'?'cachePickup':'healPickup'));}
 else if(e.type==='upgrade'){sound('reward.upgrade');openUpgrades();}
 else if(e.type==='choice'){sound(['ember','frost','storm'].includes(e.key)?'reward.unlock':'reward.upgrade');cue(label(UPGRADES[e.key]));}
 else if(e.type==='evolve'){sound('reward.unlock');cue(t('forge'));}
 else if(e.type==='dash')sound('movement.dash');
 else if(e.type==='boss'){sound('alert.boss');cue(label(run.stage));}
 else if(e.type==='objective'){sound('reward.unlock');cue(t(run.stage.rule==='beacons'?'lit':'nest'));}
 else if(e.type==='result')showResult();
 }update();}
function setPanel(kind,title,summary){panel=kind;clearInput();joystick?.setEnabled(false);$('overlay').hidden=false;$('battleLive').inert=true;frame.activate('battle',{covered:true});$('overlayTitle').textContent=title;$('overlaySummary').textContent=summary;$('overlayBody').replaceChildren();$('overlayActions').replaceChildren();enter($('overlay').firstElementChild);}
function action(label,fn){const b=make('button',label);b.addEventListener('click',fn);$('overlayActions').append(b);return b;}
function closePanel(){panel='';$('overlay').hidden=true;$('battleLive').inert=false;frame.activate('battle');clearInput();last=performance.now();$('battleBackBtn').focus({preventScroll:true});}
function openPause(help=false){if(screen!=='battle'||result||run.state==='upgrade')return;setPanel(help?'help':'pause',t(help?'help':'pause'),help?(zh?'移動、收集、強化。飛劍會自動攻擊。':'Move, collect and grow. Swords attack automatically.'):(zh?'離開會失去本局劍陣與未結算金幣；已保存的關卡及永久強化會保留。':'Leaving discards this run’s blades and unsettled gold. Saved stages and training remain.'));
 if(help){for(const text of [zh?'金色飛劍：劍數 +1；劍庫：一次 +3。':'Golden swords add one blade. Caches add three.',zh?'靈晶升級時暫停，選擇轉速、劍傷或範圍。':'Crystals pause the game for upgrade choices.',zh?'神劍覺醒：8 把劍 + 淬鍊 3 級 + 轉速 2 級。':'Awakening: 8 blades, Power rank 3 and Speed rank 2.',zh?'空白鍵 / 閃步：短暫無敵，穿越包圍。':'Space / Dash: briefly evade through danger.',HINTS[run.stage.layout][zh?0:1]])$('overlayBody').append(make('p',text));}
 const safe=action(t('continue'),closePanel);if(!help)action(t('leave'),()=>show('stage'));safe.focus({preventScroll:true});}
function openUpgrades(){setPanel('upgrade',t(run.options.includes('ember')?'element':'upgrade'),`${t('level')} ${run.level} · ${zh?'戰鬥已暫停，選完繼續':'Battle paused. Choose to continue.'}`);
 for(const key of run.options){const item=UPGRADES[key],b=make('button',undefined,'upgrade-choice');b.dataset.upgrade=key;b.append(image(item.icon),make('strong',label(item)),make('small',item.desc[zh?0:1]));b.addEventListener('click',()=>{if(run.choose(key)){closePanel();processEvents();}});$('overlayBody').append(b);} $('overlayBody').querySelector('button')?.focus({preventScroll:true});}
function showResult(){const settled=run.settle();if(!settled)return;result=settled;panel='';clearInput();joystick?.setEnabled(false);$('overlay').hidden=true;$('resultPanel').hidden=false;$('battleLive').inert=true;frame.activate('battle',{covered:true});persist();
 $('resultTitle').textContent=t(settled.won?'won':'lost');$('resultKicker').textContent=`${t('stage')} ${run.stage.id} · ${label(run.stage)}`;$('resultStars').textContent=settled.won?'★'.repeat(settled.stars)+'☆'.repeat(3-settled.stars):'';$('resultStars').ariaLabel=`${settled.stars} / 3`;
 $('resultSummary').textContent=practiceMode?t('practice'):settled.won?(zh?'下一個戰區已準備好，帶著更強的劍鋒出發。':'Your next encounter is ready. Forge a stronger orbit.'):(zh?'繞著敵群外圍移動，先撿劍再深入包圍。':'Circle the pack. Gather more blades before moving closer.');
 $('resultStats').replaceChildren();for(const [key,value]of [['kills',settled.kills],['blades',settled.swords],['combo',settled.combo]]){const n=make('span');n.append(make('strong',String(value)),make('span',t(key)));$('resultStats').append(n);}
 $('resultGold').replaceChildren(make('span',practiceMode?t('practice'):t('coins')+' +'),gold(practiceMode?0:settled.gold));$('resultTip').textContent=zh?'赤焰持續燃燒 · 霜華控制敵群 · 驚雷連鎖清場':'Ember burns · Frost controls · Storm chains';$('resultNext').disabled=!settled.won||run.stage.id>=30;enter($('resultPanel').firstElementChild);sound(settled.won?'result.win':'result.lose');$('resultStages').focus({preventScroll:true});}
function update(){
 $('mainProgress').textContent=`${t('stage')} ${save.unlocked} / ${STAGES.length}`;if($('coinValue'))$('coinValue').textContent=String(save.coins);
 if(!run||screen!=='battle')return;const p=run.player;$('bladeValue').textContent=String(run.swords);$('speedValue').textContent=(run.speed/(Math.PI*2)).toFixed(1)+'/s';$('levelValue').textContent=String(run.level);const remaining=Math.max(0,Math.ceil(run.stage.duration-run.time));$('timeValue').textContent=`${Math.floor(remaining/60)}:${String(remaining%60).padStart(2,'0')}`;
 $('healthText').textContent=`${Math.ceil(p.health)} / ${p.maxHealth}`;$('healthFill').style.transform=`scaleX(${p.health/p.maxHealth})`;$('xpFill').style.transform=`scaleX(${Math.min(1,run.xp/run.nextXP)})`;
 $('objective').textContent=`${t('stage')} ${run.stage.id} · ${RULES[run.stage.rule][zh?0:1]}${run.stage.goal?' '+run.objectives+'/'+run.stage.goal:''}`;
 $('dashBtn').disabled=p.dashCD>0||blocked();$('dashTime').textContent=p.dashCD>0?p.dashCD.toFixed(1)+'s':'SPACE';
 const boss=run.enemies.find(e=>e.boss);$('bossHud').hidden=!boss;if(boss){$('bossName').textContent=label(run.stage);$('bossFill').style.transform=`scaleX(${Math.max(0,boss.hp/boss.maxHp)})`;}
}
function localize(){zh=locale.startsWith('zh');document.documentElement.lang=zh?'zh-Hant':'en';document.title=t('title')+' | WeightPlay';$('localeSelect').value=zh?'zh-Hant':'en';document.querySelectorAll('[data-copy]').forEach(n=>n.textContent=t(n.dataset.copy));
 const sections=[
 [zh?'收集，就是力量':'Collect your power',zh?'金色飛劍讓身邊多一把劍；靈晶讓你升級。擊敗敵人後，記得走過去把戰利品帶走。':'Golden swords add blades. Crystals earn upgrade choices. Move through the defeated enemies’ drops to grow.'],
 [zh?'打造自己的劍陣':'Forge your own orbit',zh?'轉速、劍傷、範圍都有不同用途。第 3 級可選赤焰、霜華或驚雷。累積 8 把劍、3 級淬鍊與 2 級轉速後，可抽到神劍覺醒。':'Choose speed, power or reach. At level 3 choose Ember, Frost or Storm. Eight swords, Power rank 3 and Speed rank 2 unlock an Awakening choice.'],
 [zh?'操作與通關':'Controls and victory',zh?'手機拖曳畫面使用搖桿；電腦使用 WASD 或方向鍵。空白鍵或閃步可短暫穿過敵人。生存、劍庫、烽火、蟲巢與首領戰有不同目標，關卡卡片會先說明。':'Drag for the joystick, or use WASD / arrow keys. Space or Dash briefly evades attacks. Read each card: survival, caches, beacons, nests and guardians change your objective.'],
 [zh?'成長會留下來':'Progress stays with you',zh?'通關會解鎖下一關，結算金幣可在修練及裝備頁永久強化。存檔保存在此瀏覽器；單局的飛劍與隨機升級每場重新開始。':'Clearing unlocks the next encounter. Spend settled gold on permanent training and equipment. Progress stays in this browser; run blades and random upgrades reset each encounter.'],
 ];$('guideSections').replaceChildren();for(const [heading,text]of sections){const section=make('section',undefined,'game-info-section');section.append(make('h3',heading),make('p',text));$('guideSections').append(section);}
 $('guideFacts').replaceChildren();for(const [a,b]of [[30,zh?'個戰區':'encounters'],[6,zh?'位首領':'guardians'],[3,zh?'種劍系':'sword paths'],['45–90',zh?'秒短局':'second runs']]){const n=make('div');n.append(make('strong',String(a)),make('span',b));$('guideFacts').append(n);}
 const faq=make('details'),summary=make('summary',zh?'要一直點擊攻擊嗎？':'Do I need to tap to attack?');faq.append(summary,make('p',zh?'不用。飛劍會自動環繞攻擊，你專心走位、撿劍和選擇升級即可。':'No. Your blades orbit and attack automatically. Focus on movement, pickups and upgrade choices.'));$('gameGuideFaq').replaceChildren(faq);selector?.refresh(selected);frame?.refresh();update();}
async function boot(){
 frame=window.WeightPlayScreenFrame.mount({root:$('gameFrame'),localeSelect:$('localeSelect'),playUI:true,scenes:{main:{root:$('mainScreen'),header:$('mainScreen').querySelector('header'),content:document.querySelector('.main-hero')},stage:{root:$('stageScreen'),header:$('stageScreen').querySelector('header'),content:$('stageWorkspace')},battle:{root:$('battleScreen'),header:$('battleScreen').querySelector('header'),content:$('battleLive')}}});
 // Generate item portraits from the same authored 3D objects used in battle.
 const host=make('div');Object.assign(host.style,{position:'fixed',left:'-10000px',width:'96px',height:'96px'});document.body.append(host);let artist;try{artist=new World(host);Object.assign(icons,artist.portraits());}catch(e){console.warn('BLADE_ICON_RENDER',e.message);}finally{artist?.dispose();host.remove();}
 const group=window.WeightPlayScreenFrame.createGroup();for(const [id,key,icon]of [['blade','blades','sword'],['speed','speed','speed'],['level','level','gem'],['time','seconds',null]]){const n=make('span',undefined,'hud-stat');n.id=id+'Stat';if(icon)n.append(image(icon,24));const v=make('span','0');v.id=id+'Value';n.append(v);n.title=t(key);group.add(n);}frame.battleTopUI.add(group);
 const currency=gold(save.coins);currency.querySelector('span').id='coinValue';frame.stageTopUI.add(currency);
 selector=window.WeightPlayPlayUI.mountStage({page:$('stagesPage'),rail:$('stageRail'),selected,config:{count:STAGES.length,poster:'/games/blade-orbit/assets/poster.webp',background:'/assets/lobby-block-atmosphere.svg',stage(i){const s=STAGES[i];return {id:s.id,kicker:`${label(ARCS[s.arc])} · ${s.id}/30`,title:label(s),subtitle:RULES[s.rule][zh?0:1],summary:HINTS[s.layout][zh?0:1],details:[s.boss?t('boss'):`${s.duration}${t('seconds')}`,`${t('coins')} +${s.reward}`],poster:'/games/blade-orbit/assets/poster.webp',status:t(s.id>save.unlocked&&!practiceMode?'locked':save.stars[i]?'cleared':'ready'),locked:s.id>save.unlocked&&!practiceMode,cleared:save.stars[i]>0};}},isActive:()=>screen==='stage'&&tab==='stages',onSelect(i){selected=i;},onStart(i){start(i+1);}});
 for(const [id,fn]of [['startBtn',()=>{selected=save.unlocked-1;show('stage');}],['stageBackBtn',()=>show('main')],['battleBackBtn',()=>result?show('stage'):openPause()],['heroTab',()=>stageTab('hero')],['stagesTab',()=>stageTab('stages')],['gearTab',()=>stageTab('gear')],['helpBtn',()=>openPause(true)],['graphicsRetry',()=>start(run.stage.id)],['graphicsBack',()=>show('stage')],['resultStages',()=>show('stage')],['resultNext',()=>start(run.stage.id+1)],['resultReplay',()=>start(run.stage.id)],['dashBtn',()=>{const v=movement();if(run?.dash(v.x,v.y))processEvents();}]])listen($(id),'click',fn);
 listen(document,'keydown',e=>{const key=e.key.toLowerCase(),modal=!$('overlay').hidden?$('overlay'):!$('resultPanel').hidden?$('resultPanel'):null;
  if(modal){if(key==='escape'&&panel&&panel!=='upgrade'){e.preventDefault();closePanel();}if(key==='tab'){const nodes=[...modal.querySelectorAll('button')].filter(n=>!n.disabled),first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}return;}
  if(screen!=='battle'||settingsOpen())return;if(['w','a','s','d','arrowup','arrowleft','arrowdown','arrowright',' '].includes(key)){e.preventDefault();if(key===' '&&!e.repeat){const v=movement();run.dash(v.x,v.y);processEvents();}else keys.add(key);}if(key==='escape'){e.preventDefault();openPause();}
 });listen(document,'keyup',e=>keys.delete(e.key.toLowerCase()));listen(window,'blur',()=>{clearInput();if(screen==='battle'&&!panel&&!result)openPause();});listen(document,'visibilitychange',()=>{clearInput();last=performance.now();audio?.stop();if(document.hidden&&screen==='battle'&&!panel&&!result)openPause();});
 listen($('localeSelect'),'change',()=>{locale=$('localeSelect').value;try{localStorage.setItem('weightPlayLocale',locale);}catch{}localize();});
 listen(window,'pagehide',e=>{persist();clearInput();audio?.stop();if(!e.persisted){stopWorld();selector.destroy();frame.destroy();audio?.dispose();abort.abort();for(const a of animations)a.cancel();}});
 window.WeightPlayAudio?.preload(['game.start','weapon.sword.hit','combat.critical','combat.block','combat.shield.break','player.hurt','enemy.defeat','reward.collect','reward.upgrade','reward.unlock','movement.dash','magic.heal','alert.boss','shop.purchase','result.win','result.lose','feedback.error']);
 localize();show('main');$('startBtn').disabled=true;
 if(document.readyState!=='complete')await new Promise(resolve=>window.addEventListener('load',resolve,{once:true,signal:abort.signal}));
 try{await document.querySelector('.main-poster').decode();}catch{window.WeightPlayGameEntryLoader?.fail();return;}
 await new Promise(resolve=>requestAnimationFrame(resolve));
 const isPreview=new URLSearchParams(location.search).get('preview')==='1';$('startBtn').disabled=!isPreview;$('startBtn').textContent=t(isPreview?'start':'coming');
 window.WeightPlayGameEntryLoader?.ready();
 LocalPractice.register({gameId:'blade-orbit',stageIds:STAGES.map(s=>s.id),enable:enabled=>{if(enabled){practiceMode=true;$('startBtn').disabled=false;$('startBtn').textContent=t('start');}selector.refresh(selected);},startStage:id=>start(Number(id))});
 window.BladeOrbit=Object.freeze({identity:()=>({game:'blade-orbit',version:'v2',interface:'pending',target:9}),renderStats:()=>world?.stats()||null});
}
boot();
