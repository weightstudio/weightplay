import {CULTIVATION,cultivationGoals,mealRemaining} from './cultivation.mjs';
import {Haven,normalizeState,BREEDS,RECIPES,offspringOdds,MEAL_SPOTS,FOOD,YARD_CAPACITY} from './simulation.mjs';
import {COPY,SUPPORTED,LANGUAGE_LABELS} from './locales.mjs';
import {Yard} from './yard.mjs';
import {Motion} from './motion.mjs';
import {Hunt,HUNT_STAGES as MISSIONS,ROLES,dogCombat,eligible,assignFormation,autoFormation} from './hunt.mjs';
import {HuntYard} from './hunt-yard.mjs';
import {TRAITS,individual,trainingLevel,trainingCost,expansionCost,collectionCapacity} from './progression.mjs';
import {purchaseExpansion,recoverExpansion} from './capacity-purchase.mjs';

const $=id=>document.getElementById(id),STORE='weightplay.puppy-haven.v1';
const read=key=>{try{return localStorage.getItem(key);}catch{return null;}};
let saved;try{saved=JSON.parse(read(STORE));}catch{}
const haven=new Haven(normalizeState(saved));
const routeLocales={en:'en','zh-tw':'zh-Hant','zh-cn':'zh-Hans',ja:'ja',ko:'ko',es:'es','pt-br':'pt-BR',fr:'fr',de:'de',it:'it',ru:'ru',hi:'hi',ar:'ar'};
let locale=new URLSearchParams(location.search).get('lang')||routeLocales[location.pathname.split('/')[1]]||read('weightPlayLocale')||document.documentElement.lang||'en';if(!SUPPORTED.includes(locale))locale='en';
const t=(key,vars={})=>String((key==='title'?window.WEIGHTPLAY_GAME_TITLES?.['puppy-haven']?.[locale]:null)??COPY[locale][key]??COPY.en[key]??key).replace(/\{(\w+)\}/g,(_,k)=>vars[k]??'');
const mission=(m,part)=>part==='title'?`${COPY[locale].huntArcs[m.arc]} · ${COPY[locale].huntTasks[m.kind]}`:COPY[locale].huntGuide;
const breedName=id=>COPY[locale].breedNames[BREEDS.findIndex(b=>b.id===id)];
const dogName=d=>`${breedName(d.breed)} #${d.id} ${d.sex==='F'?'♀':'♂'}`;
const abort=new AbortController(),listen=(el,event,fn)=>el.addEventListener(event,fn,{signal:abort.signal});
let frame,selector,yard,screen='main',selectedStage=haven.s.hunt.unlocked-1,panelType='',panelAbort=new AbortController(),focusReturn=null,raf=0,last=0,renderIn=0,saveIn=0,cueTime=0,dogSignature='',lost=false,houseMode='yard',housePage=0;
const listenPanel=(el,event,fn)=>el.addEventListener(event,fn,{signal:panelAbort.signal});
let hunt=null;
let careOpen=false,detailDogId=null,formationCell=0,rosterPage=0,capacityBusy=false;
const audio=window.WeightPlayAudio?.createScope(),motion=new Motion();let hasScene=false;const needTargets={hunger:0,happy:0,clean:0};
const sound=id=>audio?.play(id);
const make=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
function save(){try{localStorage.setItem(STORE,JSON.stringify(haven.s));$('saveWarning').hidden=true;}catch{$('saveWarning').textContent=t('saveError');$('saveWarning').hidden=false;}}
function copy(){document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';$('localeSelect').value=locale;$('localeSelect').ariaLabel=LANGUAGE_LABELS[locale];document.title=`${t('title')} | WeightPlay`;document.querySelectorAll('[data-copy]').forEach(n=>n.textContent=t(n.dataset.copy));$('closePanel').ariaLabel=t('close');$('dogRail').ariaLabel=t('dogs',{n:haven.s.dogs.length});const alt=`${t('title')} · ${[0,1,3].map(i=>COPY[locale].breedNames[i]).join(' / ')} · ${t('puppy')}`;document.querySelectorAll('img[src*="cover-block-v1"]').forEach(n=>n.alt=alt);$('comingSoon').querySelector('h1').textContent=t('title');$('comingSoon').querySelector('p').textContent=t('preview').split(' · ')[0];const canvas=$('yard').querySelector('canvas');if(canvas)canvas.ariaLabel=t(hunt?'hunt':'freeYard');frame?.refresh();selector?.refresh(selectedStage);dogSignature='';$('foodStock')?.remove();update();}
function visible(next){
 motion.clear();if(yard&&!lost)renderWorld(0);if(hasScene)motion.exit($(screen+'Screen'));hasScene=true;
 if(screen==='battle'&&next!=='battle'){cancelAnimationFrame(raf);yard?.dispose();yard=null;audio?.stop();save();}
 screen=next;document.body.dataset.screen=next;for(const name of ['main','stage','battle'])$(name+'Screen').hidden=name!==next;
 $('mainGuide').hidden=next!=='main';panelAbort.abort();$('panel').hidden=true;$('resultPanel').hidden=true;panelType='';$('battleLive').inert=false;frame.activate(next);motion.enter($(next+'Screen'));
 if(next==='stage'){selectedStage=haven.s.hunt.unlocked-1;selector.refresh(selectedStage);decorateStageReward();requestAnimationFrame(()=>{selector.refresh(selectedStage);decorateStageReward();});}
 window.dispatchEvent(new Event('weightplay:shell-sync'));window.dispatchEvent(new Event(`weightplay:${next}-sync`));
}
function start(stage){
 if(stage>0&&(!MISSIONS[stage-1]||stage>haven.s.hunt.unlocked))return;
 cancelAnimationFrame(raf);const previous=yard;visible('battle');previous?.dispose();yard=null;hunt=null;lost=false;haven.start(0);haven.s.stage=stage;$('feedback').textContent='';
 if(stage>0){const f=haven.s.hunt.formation.map(id=>eligible(haven.allDogs.find(d=>d.id===id))?id:null);if(!f.some(Boolean))haven.allDogs.filter(eligible).slice(0,2).forEach((d,i)=>f[i]=d.id);let count=0;for(let i=0;i<6;i++)if(f[i]&&++count>MISSIONS[stage-1].limit)f[i]=null;haven.s.hunt.formation=f;hunt=new Hunt(stage,haven.allDogs,f);$('battleLive').dataset.hunt='true';}
 else delete $('battleLive').dataset.hunt;
 $('huntUI').hidden=!hunt;
 careOpen=false;formationCell=0;rosterPage=0;delete $('battleLive').dataset.phase;
 try{yard=hunt?new HuntYard($('yard'),(kind,cell)=>{if(kind==='cell'&&!blocked()&&hunt.phase==='prep')deploy(cell);},()=>{lost=true;$('worldFallback').hidden=false;}):new Yard($('yard'),(kind,id)=>{if(blocked())return;if(kind==='dog')selectResident(id);else act('clean',{id});},()=>{lost=true;$('worldFallback').hidden=false;},()=>!blocked());yard.renderer.domElement.ariaLabel=t(hunt?'hunt':'freeYard');renderWorld(0);$('worldFallback').hidden=true;}
 catch(error){lost=true;$('worldFallback').hidden=false;console.error('PUPPY_HAVEN_3D',error.message);}
 if(hunt)renderHuntControls();update();last=performance.now();raf=requestAnimationFrame(loop);
 if(!hunt&&!read('weightplay.puppy-haven.observation-intro'))showPanel('help');
}
function renderWorld(dt){if(hunt)yard.renderHunt(hunt,dt);else{yard.marker.visible=careOpen;yard.render(haven.s,blocked()?0:dt,dt);}renderMealAmounts();}

function settingsOpen(){return Boolean(document.querySelector('[data-wp-preferences] .wp-frame-popover:not([hidden])'));}
function blocked(){return screen!=='battle'||Boolean(panelType)||!$('resultPanel').hidden||document.hidden||lost||settingsOpen();}
function loop(now){const dt=Math.min(.1,(now-last)/1000);last=now;
 if(!blocked()){if(hunt){hunt.tick(dt);huntEvents();}else{haven.tick(dt);processEvents();}saveIn+=dt;if(saveIn>5){saveIn=0;save();}}
 if(yard&&!document.hidden&&!lost)renderWorld(dt);
 for(const key of ['hunger','happy','clean']){const meter=$(key),target=needTargets[key];meter.value=motion.reduced||Math.abs(meter.value-target)<.05?target:meter.value+(target-meter.value)*Math.min(1,dt/.12);}
 cueTime=Math.max(0,cueTime-dt);$('worldCue').classList.toggle('show',cueTime>0);
 renderIn+=dt;if(renderIn>.2){renderIn=0;update();}
 if(screen==='battle')raf=requestAnimationFrame(loop);
}
function feedback(message,error=false){$('feedback').textContent=message;$('panelFeedback').textContent=message;motion.emphasize(panelType?$('panelFeedback'):$('feedback'));if(error)sound('feedback.error');}
function cue(text){$('worldCue').textContent=text;cueTime=2;$('worldCue').classList.add('show');motion.enter($('worldCue'));}
function rewardFly(amount,origin,destination=$('coinStat')){if(!origin||!amount)return;const target=destination.getBoundingClientRect();if(!target.width||!target.height)return;const from=origin.getBoundingClientRect(),n=make('span',`+${amount}`,'coin-flight'),img=make('img');img.src='/assets/wonder-prop-coin-block-v1.png';img.alt='';img.width=24;img.height=24;n.prepend(img);n.dataset.puppyTransient='';n.style.left=`${from.left+from.width/2}px`;n.style.top=`${from.top+from.height/2}px`;document.body.append(n);const frames=motion.reduced?[{opacity:1},{opacity:0}]:[{transform:'translate(-50%,-50%)',opacity:1},{transform:`translate(calc(-50% + ${target.left+target.width/2-from.left-from.width/2}px),calc(-50% + ${target.top+target.height/2-from.top-from.height/2}px))`,opacity:0}];motion.play(n,frames,500,()=>{n.remove();motion.emphasize(destination);});}

function processEvents(){for(const event of haven.events.splice(0)){
 if(event.type==='error'){feedback(COPY[locale].errors[event.reason]||COPY.en.errors[event.reason],true);continue;}
 if(event.type==='poop')continue;
 if(event.type==='complete'){save();showResult(event);continue;}
 const key={placeFood:'placed',feed:'feedDone',pet:'petDone',play:'playDone',train:'trained',rehome:'rehomed',clean:'cleanDone',buy:'buyDone',cultivate:'planSaved',pair:'pairDone',birth:'birthDone',growth:'growthDone',restDog:'restDone',recallDog:'recallDone'}[event.type];
 if(key){feedback(t(key));cue(t(key));}
 if(event.dog)yard?.effect(event.dog,event.type);if(['feed','pair','birth','growth'].includes(event.type))save();
 if(event.type==='buy')sound('shop.purchase');
 else if(event.type==='clean'||event.type==='pet'){sound('reward.coin');rewardFly(event.coins,$(event.type==='clean'?'cleanBtn':'petBtn'));}
 else if(event.type==='birth'||event.type==='growth')sound('reward.unlock');else if(event.type==='restDog'||event.type==='recallDog')sound('ui.click');else sound('feedback.success');
 }update();}
function act(type,data){if(screen!=='battle'||lost||hunt||!$('resultPanel').hidden)return;const result=haven.action(type,data);processEvents();save();if(result.ok){
  if((type==='cultivate'||type==='placeFood')&&$('resultPanel').hidden){closePanel();}
  else if(panelType==='food')renderFood();
  else if(panelType==='house'){renderHouse();$('closePanel').focus({preventScroll:true});}
  else if(type==='train'&&panelType==='dogDetails')renderDetails();
  else if(type==='rehome'||type==='restDog'){careOpen=false;closePanel();update();}
 }return result;}
function decorateStageReward(){const row=$('stageRail-shared-details')?.lastElementChild;if(row&&!row.querySelector('img')){const img=make('img');img.src='/assets/wonder-prop-coin-block-v1.png';img.alt='';img.width=24;img.height=24;img.className='stage-reward-art';row.prepend(img);}}
function update(){if(!frame)return;decorateStageReward();const s=haven.s,d=haven.selected;const priorCoins=$('coinStat').textContent,priorObjective=$('objective').textContent;
 document.querySelectorAll('[data-label]').forEach(n=>{n.ariaLabel=t(n.dataset.label);n.title=t(n.dataset.label);});$('carePanel').hidden=Boolean(hunt)||!careOpen;$('yardControls').hidden=Boolean(hunt);$('yardHint').hidden=Boolean(hunt)||careOpen;$('battleLive').dataset.careOpen=String(careOpen);
 $('coinStat').textContent=t('coins',{n:Math.floor(s.coins)});$('dogStat').textContent=`${haven.allDogs.length}/${haven.capacity}`;$('dogStat').title=populationText();$('stageStat').textContent=t('stage',{n:selectedStage+1});
 if(hunt){updateHunt();return;}
 if(priorCoins&&priorCoins!==$('coinStat').textContent)motion.emphasize($('coinStat'));if(!$('foodStock')){$('objective').textContent=t('freeYard');if(priorObjective)motion.enter($('objective'));}renderFoodStock();
 $('dogName').textContent=dogName(d);$('dogAge').textContent=d.pregnancy?t('pregnancy',{n:Math.ceil(d.pregnancy.remaining)}):d.age==='puppy'?t('growth',{n:Math.floor(d.growth)}):t('adult');
 $('dogAge').textContent+=' · '+t(d.activity)+(d.age==='puppy'?' · '+t('puppyBattle'):'');
 $('dogFamily').textContent=d.parents.length?`${t('parents')} #${d.parents.join(' / #')}`:t('noParents');
 $('dogAbility').textContent=`${t('levelLabel',{n:trainingLevel(d)})} · ${traitText(d)}`;
 for(const k of ['hunger','happy','clean']){needTargets[k]=d[k];$(k).setAttribute('aria-valuenow',String(Math.floor(d[k])));if(motion.reduced)$(k).value=d[k];$(k+'Value').textContent=Math.floor(d[k]);}
 $('petBtn').textContent=d.petIn>0?t('restPet',{n:Math.ceil(d.petIn)}):t('pet');$('cleanBtn').textContent=t('cleanCount',{n:s.poops.length});
 $('playBtn').disabled=d.playIn>0;$('dogRail').replaceChildren();
}
function showPanel(type){if(panelType)motion.exit($('panel').querySelector('.panel-card'));panelAbort.abort();panelAbort=new AbortController();if(!panelType)focusReturn=document.activeElement;panelType=type;$('panel').hidden=false;$('battleLive').inert=true;frame.activate('battle',{covered:true});$('panelFeedback').textContent='';$('panelContent').replaceChildren();
 $('panelTitle').textContent=t({food:'pantry',cultivate:'cultivate',pair:'pair',house:'restHouse',help:'helpTitle',leave:'leaveTitle',codex:'codex',huntHelp:'hunt',dogDetails:'manageDog',rehome:'rehome',chooser:'chooseResident',formation:'deploy',expand:'expand'}[type]);
 if(type==='huntHelp'){const c=$('panelContent');c.append(make('p',t('huntGuide'),'panel-copy'));for(const text of COPY[locale].roleNames)c.append(make('p',text,'panel-copy'));for(const enemy of hunt.enemies)c.append(make('p',enemyName(enemy.kind)+' · '+t('combatStats',{hp:enemy.maxHp,atk:enemy.atk,armor:enemy.armor}),'panel-copy'));}
 if(type==='codex')renderCodex();if(type==='food')renderFood();if(type==='cultivate')renderCultivate();if(type==='pair')renderPair();if(type==='house'){houseMode='yard';housePage=0;renderHouse();}
 if(type==='dogDetails')renderDetails();if(type==='rehome')renderRehome();if(type==='chooser')renderChooser();if(type==='formation')renderFormation();if(type==='expand')renderExpansion();
 if(type==='help'){const taro=make('img');taro.src='/assets/weightplay-character-moss-shell-turtle-block-v1.webp';taro.alt='';taro.width=112;taro.height=112;taro.className='guide-taro';$('panelContent').append(taro,make('p',t('guide'),'panel-copy'));const b=make('button',t('startCaring'));listenPanel(b,'click',()=>{try{localStorage.setItem('weightplay.puppy-haven.observation-intro','1');}catch{}closePanel();});$('panelContent').append(b);}
 if(type==='leave'){$('panelContent').append(make('p',t('saved'),'panel-copy'));for(const [label,fn]of [['continue',closePanel],['leave',()=>{closePanel();visible('stage');}]]){const b=make('button',t(label));listenPanel(b,'click',fn);$('panelContent').append(b);}}
 $('panel').querySelector('.panel-card').scrollTop=0;motion.enter($('panel').querySelector('.panel-card'));$('closePanel').focus({preventScroll:true});
}
function closePanel(){if(!$('panel').hidden)motion.exit($('panel').querySelector('.panel-card'));panelAbort.abort();panelType='';$('panel').hidden=true;$('battleLive').inert=false;frame.activate('battle');last=performance.now();(focusReturn?.isConnected&&focusReturn.getClientRects().length?focusReturn:hunt?$('huntInfo'):$('chooseDogBtn')).focus({preventScroll:true});}
function houseLink(){const b=make('button',t('manageRooms',{n:haven.s.restDogs.length}));b.dataset.openPanel='house';return b;}
function renderHouse(){
 const content=$('panelContent');if(content.childElementCount)motion.exit($('panel').querySelector('.panel-card'));motion.enter(content);content.replaceChildren();content.append(make('p',t('houseGuide'),'panel-copy'),make('p',t('roomCapacity',{n:haven.reserved,max:YARD_CAPACITY}),'panel-copy'));
 renderCollectionControls(content);
 const tabs=make('nav',undefined,'house-tabs');for(const [mode,key,n]of [['yard','inYard',haven.s.dogs.length],['rest','inHouse',haven.s.restDogs.length]]){const b=make('button',t(key,{n}));b.dataset.houseMode=mode;b.setAttribute('aria-pressed',String(houseMode===mode));tabs.append(b);}content.append(tabs);
 const dogs=houseMode==='yard'?haven.s.dogs:haven.s.restDogs;const pages=Math.max(1,Math.ceil(dogs.length/8));housePage=Math.max(0,Math.min(housePage,pages-1));
 const list=make('div',undefined,'house-list');
 for(const dog of dogs.slice(housePage*8,housePage*8+8)){const row=make('section',undefined,'house-row'),name=make('strong',dogName(dog)),needs=make('small',`${t(dog.age==='puppy'?'puppy':'adult')} · ${t('levelLabel',{n:trainingLevel(dog)})} · ${traitText(dog)}`),b=make('button',t(houseMode==='yard'?'moveToHouse':'bringHome')),manage=make('button',t('manageDog'));b.dataset.roomDogId=dog.id;b.dataset.roomAction=houseMode==='yard'?'restDog':'recallDog';b.setAttribute('aria-label',`${b.textContent} · ${dogName(dog)}`);manage.dataset.manageDog=dog.id;row.append(dogPortrait(dog.breed,48),name,needs,b,manage);list.append(row);}
 if(!dogs.length)list.append(make('p',t('houseEmpty'),'panel-copy'));content.append(list);
 const nav=make('nav',undefined,'house-tabs');const prev=make('button',t('previousPage')),next=make('button',t('nextPage'));prev.dataset.housePage=-1;next.dataset.housePage=1;prev.disabled=housePage===0;next.disabled=housePage===pages-1;nav.append(prev,make('span',`${housePage+1} / ${pages}`),next);content.append(nav);
 const back=make('button',t('backToFamily'));back.dataset.openPanel='pair';content.append(back);
}
function renderFood(){
 const content=$('panelContent'),active=document.activeElement,grade=active?.dataset.buyGrade,scroll=$('panel').querySelector('.panel-card').scrollTop;
 content.replaceChildren();content.append(make('p',t('foodGuide'),'panel-copy'));for(const bowl of haven.s.bowls)content.append(make('p',COPY[locale].foodNames[bowl.grade]+' · '+t('bowlLeft',{spot:bowl.spot+1,n:mealRemaining(haven.s,bowl)}),'panel-copy'));
 const label=make('label',t('mealSpot'),'pair-field'),spots=make('select');spots.id='mealSpot';
 MEAL_SPOTS.forEach((_,i)=>{const occupied=haven.s.bowls.some(b=>b.spot===i),option=new Option(t('spot',{n:i+1})+(occupied?' · '+t('occupied'):''),i);option.disabled=occupied;spots.append(option);});
 const first=MEAL_SPOTS.findIndex((_,i)=>!haven.s.bowls.some(b=>b.spot===i));spots.value=first;label.append(spots);content.append(label);
 FOOD.forEach((f,i)=>{const row=make('section',undefined,'food-row');if(yard){const img=make('img');img.src=yard.foodPortrait(i);img.alt=COPY[locale].foodNames[i];img.width=72;img.height=72;img.className='food-portrait';row.append(img);}row.append(make('strong',COPY[locale].foodNames[i]+' · '+t('portions',{n:haven.s.food[i]})),make('small',t('nutrition',{n:f.nutrition,g:f.growth})));
 const actions=make('div',undefined,'food-actions'),buy=make('button',t('buy',{n:f.price})),use=make('button',t('use',{n:haven.s.food[i]}));buy.dataset.buyGrade=i;use.dataset.placeGrade=i;use.disabled=first<0||haven.s.food[i]===0;actions.append(buy,use);row.append(actions);content.append(row);});
 motion.enter(content);if(grade!==undefined){content.querySelector(`[data-buy-grade="${grade}"]`)?.focus({preventScroll:true});$('panel').querySelector('.panel-card').scrollTop=scroll;}
}
function goalText(goal,recipe=false){const key={meal:'mealGoal',pets:'petGoal',walk:'walkGoal',clean:'cleanGoal'}[goal.kind];const have=Math.floor(Math.min(goal.have,goal.need)),text=t(key,{name:COPY[locale].foodNames[goal.grade]||'',have,need:goal.need});return recipe?text.replace(`${have}/${goal.need}`,String(goal.need)):text;}
function routeGoals(plan){return cultivationGoals({cultivation:plan.breed,care:{meals:[0,0,0],pets:0,walk:0},clean:0});}
function renderCultivate(){
 const content=$('panelContent');content.replaceChildren();content.append(make('p',t('cultivateGuide'),'panel-copy'),make('p',t('starterPups'),'panel-copy'));
 const puppy=haven.selected,valid=puppy.age==='puppy'&&!BREEDS.find(b=>b.id===puppy.breed)?.offspringOnly;
 if(valid){content.append(make('strong',dogName(puppy)),make('p',t('growthGoal',{n:Math.floor(puppy.growth)}),'panel-copy'));const label=make('label',t('plan'),'pair-field'),select=make('select');select.id='cultivationPlan';select.append(new Option(t('natural'),''));for(const plan of CULTIVATION)select.append(new Option(breedName(plan.breed),plan.breed));select.value=puppy.cultivation||'';label.append(select);const chosen=make('button',t('choosePlan'));chosen.id='chooseCultivation';listenPanel(chosen,'click',()=>{act('cultivate',{breed:select.value});feedback(t('planSaved'));});content.append(label,chosen);for(const goal of cultivationGoals(puppy))content.append(make('p',goalText(goal),'panel-copy'));
 }else content.append(make('p',t('noPuppy'),'panel-copy'));
 const codex=make('button',t('codex'));codex.dataset.openPanel='codex';content.append(codex,houseLink());
}
function renderFoodStock(){
 if(!$('foodStock')){$('objective').replaceChildren(make('span',t('freeYard')));const strip=make('div');strip.id='foodStock';FOOD.forEach((_,i)=>{const cell=make('span'),name=make('span',COPY[locale].foodNames[i]),count=make('strong');count.dataset.stockGrade=i;cell.append(name,count);strip.append(cell);});$('objective').append(strip);}
 FOOD.forEach((_,i)=>{const count=$('foodStock').querySelector(`[data-stock-grade="${i}"]`),value=t('portions',{n:haven.s.food[i]});if(count.textContent!==value){if(count.textContent)motion.emphasize(count);count.textContent=value;}count.parentNode.setAttribute('aria-label',COPY[locale].foodNames[i]+' '+value);});
}
function renderMealAmounts(){
 const root=$('mealAmounts');if(!root)return;root.hidden=!!hunt;if(hunt){root.replaceChildren();return;}const live=new Set(haven.s.bowls.map(b=>String(b.id)));for(const node of root.children)if(!live.has(node.dataset.bowlId))node.remove();
 for(const bowl of haven.s.bowls){let node=root.querySelector(`[data-bowl-id="${bowl.id}"]`);if(!node){node=make('span');node.dataset.bowlId=bowl.id;root.append(node);motion.enter(node);}const value=mealRemaining(haven.s,bowl),point=yard?.mealPoint(bowl.spot);node.textContent=value+'%';node.setAttribute('aria-label',t('bowlLeft',{spot:bowl.spot+1,n:value}));if(point){node.style.left=point.x+'px';node.style.top=point.y+'px';}}
}

function renderPair(){
 const content=$('panelContent');content.append(houseLink(),make('p',t('pairGuide'),'panel-copy'));
 if(haven.s.breedingPaused)content.append(make('p',t('breedingPausedNotice'),'panel-copy breeding-paused-notice'));
 const guide=make('button',t('codex'));guide.dataset.openPanel='codex';content.append(guide);
 for(const dog of haven.s.dogs){const row=make('section',undefined,'family-dog');row.append(make('strong',dogName(dog)),make('p',dog.pregnancy?t('pregnancy',{n:Math.ceil(dog.pregnancy.remaining)}):dog.age==='puppy'?t('puppy'):dog.cooldown>0?t('resting',{n:Math.ceil(dog.cooldown)}):haven.s.breedingPaused?t('adult'):t('naturalReady'),'panel-copy'));content.append(row);}
}
function renderCodex(){
 const content=$('panelContent');content.append(make('p',t('cultivateGuide'),'panel-copy'),make('p',t('codexGuide'),'panel-copy'),make('p',t('discovered',{n:haven.s.discovered.length,max:BREEDS.length}),'panel-copy'));
 const gallery=make('div',undefined,'codex-gallery');for(const breed of BREEDS){const tile=make('figure');tile.append(dogPortrait(breed.id),make('figcaption',breedName(breed.id)));gallery.append(tile);}content.append(gallery);
 for(const plan of CULTIVATION){const row=make('section',undefined,'cultivation-recipe');row.append(dogPortrait(plan.breed),make('strong',breedName(plan.breed)));for(const goal of routeGoals(plan))row.append(make('p',goalText(goal,true),'panel-copy'));row.append(make('p',t('growthGoal',{n:100}),'panel-copy'));content.append(row);}
 for(const [id,key]of [['codexFather','father'],['codexMother','mother']]){const label=make('label',t(key),'pair-field'),select=make('select');select.id=id;for(const breed of BREEDS)select.append(new Option(breedName(breed.id),breed.id));label.append(select);content.append(label);}
 $('codexMother').value='shiba';const result=make('p',undefined,'recipe-result');result.id='recipeOdds';content.append(result);
 const refresh=()=>{result.textContent=offspringOdds($('codexFather').value,$('codexMother').value).map(o=>`${breedName(o.breed)} ${Math.round(o.chance*100)}%`).join(' · ');motion.emphasize(result);};listenPanel($('codexFather'),'change',refresh);listenPanel($('codexMother'),'change',refresh);refresh();
 for(const recipe of RECIPES){const row=make('section',undefined,'recipe-row');if(yard){const img=make('img');img.src=yard.portrait(recipe.child);img.alt=breedName(recipe.child);img.width=72;img.height=72;row.append(img);}row.append(make('strong',recipe.parents.map(breedName).join(' × ')),make('p',offspringOdds(...recipe.parents).map(o=>`${breedName(o.breed)} ${Math.round(o.chance*100)}%`).join(' · '),'panel-copy'));content.append(row);}
}
function showResult(event){panelAbort.abort();if(panelType)motion.exit($('panel').querySelector('.panel-card'));panelType='';$('panel').hidden=true;$('resultPanel').hidden=false;$('battleLive').inert=true;frame.activate('battle',{covered:true});$('resultTitle').textContent=mission(MISSIONS[event.stage-1],'title');$('resultReward').textContent=t('reward',{n:event.reward});$('resultBalance').textContent=t('coins',{n:Math.floor(haven.s.coins)});motion.enter($('resultPanel').querySelector('.result-card'));rewardFly(event.reward,$('resultReward'),$('resultBalance'));$('nextBtn').hidden=event.stage===30;if(hunt){$('resultTitle').textContent=t(hunt.phase==='won'?'huntWin':hunt.reason==='timeout'?'huntTimeout':'huntLose');$('nextBtn').hidden=hunt.phase!=='won'||event.stage===30;}sound(hunt&&hunt.phase!=='won'?'result.lose':'result.win');$('nextBtn').hidden?$('retryBtn').focus():$('nextBtn').focus();}
const enemyIndex={boar:0,wolf:1,armored:2,fox:3,stag:4,boss:5};
const roleIndex={balanced:0,guard:1,healer:2,flanker:3,splash:4,scout:5};
function enemyName(kind){return COPY[locale].enemyNames[enemyIndex[kind]];}
function enemySummary(stage){return stage.waves.map(w=>w.map(enemyName).join(' / ')).join(' → ');}
function renderHuntControls(){
 fillCellButtons($('huntCells'),'huntCell');
 showSelectedHuntDog();updateHunt();motion.enter($('huntCells'));
}
function showSelectedHuntDog(){const d=haven.allDogs.find(d=>d.id===haven.s.hunt.formation[formationCell]);if(!d){$('huntSelected').textContent=t('teamHint');return;}const stats=dogCombat(d);$('huntSelected').textContent=`${t('levelLabel',{n:trainingLevel(d)})} · ${traitText(d)} · ${t('combatStats',{hp:stats.maxHp,atk:stats.atk,armor:stats.armor})}`;}
function deploy(cell){if(hunt?.phase!=='prep'||blocked()||cell<0||cell>=6)return;formationCell=cell;rosterPage=0;showPanel('formation');}
function updateHunt(){
 if(hunt)$('battleLive').dataset.phase=hunt.phase;
 if(!hunt)return;$('objective').textContent=hunt.phase==='prep'?t('deploy')+' · '+mission(hunt.stage,'title'):t('waveStatus',{n:hunt.wave+1,max:hunt.stage.waves.length,a:hunt.allies.filter(d=>d.hp>0).length,b:hunt.enemies.filter(d=>d.hp>0).length})+` · ${Math.max(0,Math.ceil(90-hunt.clock))}s`;$('dogStat').textContent=`${hunt.allies.filter(d=>d.hp>0).length}/${hunt.allies.length}`;
 $('huntEnemy').textContent=t('enemyPreview')+': '+enemySummary(hunt.stage)+(hunt.diverse?' · '+t('synergy'):'');$('autoHunt').disabled=hunt.phase!=='prep';$('clearHunt').disabled=hunt.phase!=='prep';$('launchHunt').disabled=hunt.phase!=='prep'||!hunt.allies.length;for(const b of $('huntCells').children)b.disabled=hunt.phase!=='prep';
}
function huntEvents(){const queue=hunt.events.splice(0);if(!queue.length)return;for(const e of queue){
 if(e.type!=='windup'){(hunt.recent||=[]).push({...e,time:hunt.clock});if(hunt.recent.length>48)hunt.recent.shift();}
 if(e.type==='windup')continue;
 if(e.type==='wave'){if(e.boss)sound('alert.boss');continue;}
 if(e.type==='finish'){const result=e.win?hunt.settle(haven.s):{reward:0};save();showResult({stage:hunt.stage.id,reward:result.reward});continue;}
 const target=hunt.units.find(u=>u.id===e.target);if(!target)continue;const name=target.team?enemyName(target.kind):`${breedName(target.breed)} #${target.id}`;
 if(e.type==='defeat'){sound(target.team?'enemy.defeat':'player.hurt');continue;}
 const heal=e.type==='heal',blocked=e.type==='block',text=heal?`+${e.amount}`:blocked?`◇ ${e.absorbed}`:`−${e.amount}${e.critical?' !':''}`;feedback(name+' '+text);const point=yard?.worldPoint(e.target);
 if(point&&document.querySelectorAll('[data-hunt-float]').length<12){const n=make('span',text,'hunt-float '+(heal?'heal':blocked?'shield':'damage'));n.dataset.huntFloat='';n.dataset.puppyTransient='';n.style.left=point.x+'px';n.style.top=point.y+'px';document.body.append(n);motion.play(n,motion.reduced?[{opacity:1},{opacity:0}]:[{transform:'translate(-50%,0)',opacity:1},{transform:'translate(-50%,-22px)',opacity:0}],450,()=>n.remove());}
 if(heal)sound('magic.heal');else if(e.shieldBreak)sound('combat.shield.break');else if(blocked)sound('combat.block');else if(e.critical)sound('combat.critical');else sound(target.team?'combat.strike':'player.hurt');
 }updateHunt();}
function bind(){
 listen($('startBtn'),'click',()=>start(0));listen($('huntBtn'),'click',()=>visible('stage'));listen($('stageBack'),'click',()=>visible('main'));listen($('missionTab'),'click',()=>selector.refresh(selectedStage));listen($('yardBtn'),'click',()=>start(0));listen($('battleBack'),'click',()=>{if($('resultPanel').hidden)showPanel('leave');else visible('stage');});
 for(const [id,type]of [['foodBtn','food'],['feedBtn','food'],['cultivateBtn','cultivate'],['pairBtn','pair'],['helpBtn','help']])listen($(id),'click',()=>showPanel(type));
 listen($('launchHunt'),'click',()=>{if(!blocked()&&hunt?.begin()){sound('game.start');updateHunt();}});listen($('clearHunt'),'click',()=>{if(!blocked()&&hunt?.phase==='prep'){haven.s.hunt.formation=Array(6).fill(null);hunt=new Hunt(hunt.stage.id,haven.allDogs,haven.s.hunt.formation);renderHuntControls();save();}});listen($('autoHunt'),'click',()=>{if(blocked()||hunt?.phase!=='prep')return;haven.s.hunt.formation=autoFormation(haven.allDogs,hunt.stage.limit);hunt=new Hunt(hunt.stage.id,haven.allDogs,haven.s.hunt.formation);renderHuntControls();save();feedback(t('autoTeam'));sound('ui.click');});listen($('huntInfo'),'click',()=>showPanel('huntHelp'));listen($('huntCells'),'click',e=>{const b=e.target.closest('[data-hunt-cell]');if(b)deploy(Number(b.dataset.huntCell));});
 listen($('petBtn'),'click',()=>{if(!blocked())act('pet');});listen($('cleanBtn'),'click',()=>{if(!blocked())act('clean');});
 listen($('playBtn'),'click',()=>{if(!blocked())act('play');});listen($('manageDogBtn'),'click',()=>{detailDogId=haven.selected.id;showPanel('dogDetails');});listen($('chooseDogBtn'),'click',()=>showPanel('chooser'));listen($('closeDogCard'),'click',()=>{careOpen=false;update();$('chooseDogBtn').focus();});
 for(const [id,factor]of [['zoomIn',1.15],['zoomOut',1/1.15]])listen($(id),'click',()=>yard?.cameraRig?.zoomBy(factor));listen($('resetView'),'click',()=>yard?.cameraRig?.reset());listen($('yard'),'keydown',e=>{if(e.target===yard?.renderer.domElement&&!blocked()&&['Enter',' '].includes(e.key)){e.preventDefault();showPanel('chooser');}});
 listen($('panelContent'),'click',e=>{const b=e.target.closest('button');if(!b)return;
  if(b.dataset.chooseResident){selectResident(Number(b.dataset.chooseResident));return;}
  if(b.dataset.manageDog){detailDogId=Number(b.dataset.manageDog);showPanel('dogDetails');return;}
  if(b.dataset.trainDog){act('train',{id:Number(b.dataset.trainDog)});return;}
  if(b.dataset.requestRehome){detailDogId=Number(b.dataset.requestRehome);showPanel('rehome');return;}
  if(b.dataset.confirmRehome){const id=Number(b.dataset.confirmRehome);act('rehome',{id,confirmedId:id});return;}
  if(b.dataset.pauseBreeding){act('breedingPause',{paused:b.dataset.pauseBreeding==='true'});return;}
  if(b.dataset.buyCapacityTier!==undefined){buyCapacity(Number(b.dataset.buyCapacityTier));return;}
  if(b.dataset.formationCell!==undefined){formationCell=Number(b.dataset.formationCell);renderFormation();$('panelContent').querySelector(`[data-formation-cell="${formationCell}"]`).focus();return;}
  if(b.dataset.candidateId){placeCandidate(Number(b.dataset.candidateId));return;}
  if(b.dataset.removeFormation!==undefined){if(hunt?.phase!=='prep')return;haven.s.hunt.formation[Number(b.dataset.removeFormation)]=null;hunt=new Hunt(hunt.stage.id,haven.allDogs,haven.s.hunt.formation);renderHuntControls();renderFormation();save();return;}
  if(b.dataset.rosterPage){rosterPage+=Number(b.dataset.rosterPage);renderFormation();$('closePanel').focus();return;}
  if(b.dataset.openPanel){showPanel(b.dataset.openPanel);return;}
  if(b.dataset.houseMode){houseMode=b.dataset.houseMode;housePage=0;renderHouse();$('panelContent').querySelector(`[data-house-mode="${houseMode}"]`).focus();return;}
  if(b.dataset.housePage){housePage+=Number(b.dataset.housePage);renderHouse();$('closePanel').focus();return;}
  if(b.dataset.roomAction){const id=Number(b.dataset.roomDogId);if(b.dataset.roomAction==='restDog')haven.select(id);act(b.dataset.roomAction,{id});return;}
  if(b.dataset.buyGrade!==undefined)act('buy',{grade:Number(b.dataset.buyGrade)});if(b.dataset.placeGrade!==undefined)act('placeFood',{grade:Number(b.dataset.placeGrade),spot:Number($('mealSpot').value)});});
 listen($('closePanel'),'click',()=>{if(panelType==='help')try{localStorage.setItem('weightplay.puppy-haven.observation-intro','1');}catch{}closePanel();});
 listen($('reloadBtn'),'click',()=>{save();location.reload();});
 listen($('nextBtn'),'click',()=>start(Math.min(30,haven.s.stage+1)));listen($('retryBtn'),'click',()=>start(haven.s.stage));listen($('resultYard'),'click',()=>start(0));listen($('resultStages'),'click',()=>visible('stage'));
 listen($('localeSelect'),'change',e=>{locale=SUPPORTED.includes(e.target.value)?e.target.value:'en';try{localStorage.setItem('weightPlayLocale',locale);}catch{}window.WonderI18n?.setLocale?.(locale,{navigate:false});copy();save();const target=new URL(window.WonderI18n.localizedPath(locale,location.href),location.origin);target.searchParams.delete('lang');location.assign(target.href);});
 listen(document,'visibilitychange',()=>{last=performance.now();save();audio?.stop();if(document.hidden)motion.clear();});listen(window,'blur',()=>{if(screen==='battle'&&!blocked())showPanel('leave');});
 listen(document,'keydown',e=>{const modal=!$('panel').hidden?$('panel'):!$('resultPanel').hidden?$('resultPanel'):null;if(!modal)return;if(e.key==='Escape'&&panelType){e.preventDefault();closePanel();}if(e.key==='Tab'){const list=[...modal.querySelectorAll('button,select,a')].filter(n=>!n.hidden&&!n.disabled&&n.getClientRects().length),first=list[0],last=list.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
 listen(window,'pagehide',event=>{save();motion.clear();if(!event.persisted){cancelAnimationFrame(raf);yard?.dispose();selector?.destroy();frame.destroy();audio?.dispose();abort.abort();}});
}
function traitText(d){return COPY[locale].traitLabels[TRAITS.indexOf(individual(d).trait)];}
function populationText(){return t('population',{n:haven.collectionReserved,max:haven.capacity,waiting:haven.s.dogs.filter(d=>d.pregnancy).length});}
function dogPortrait(breed,size=72){const img=make('img');img.src=yard.portrait(breed);img.alt=breedName(breed);img.width=size;img.height=size;img.className='dog-portrait';return img;}
function priceChip(kind,n){const row=make('span',undefined,'currency-cost'),img=make('img');img.src=kind==='diamond'?'/assets/weightplay-diamond.svg':'/assets/wonder-prop-coin-block-v1.png';img.alt='';img.width=24;img.height=24;row.append(img,make('span',String(n)));return row;}
function selectResident(id){if(!haven.select(id))return;careOpen=true;if(panelType)closePanel();update();motion.enter($('carePanel'));save();sound('ui.click');}
function renderChooser(){const content=$('panelContent');content.append(make('p',t('pickHint'),'panel-copy'));for(const d of haven.s.dogs){const b=make('button',undefined,'resident-choice');b.dataset.chooseResident=d.id;b.append(dogPortrait(d.breed,48),make('strong',dogName(d)),make('small',`${t(d.age==='puppy'?'puppy':'adult')} · ${t('levelLabel',{n:trainingLevel(d)})} · ${traitText(d)}`));content.append(b);}}
function renderDetails(){
 const content=$('panelContent');content.replaceChildren();$('panel').querySelector('.panel-card').scrollTop=0;const d=haven.allDogs.find(d=>d.id===detailDogId);if(!d){content.append(make('p',t('confirmDog'),'panel-copy'));return;}
 const hero=make('div',undefined,'dog-detail-heading');hero.append(dogPortrait(d.breed,96),make('strong',dogName(d)));content.append(hero,make('p',`${t(d.age==='puppy'?'puppy':'adult')} · ${t('levelLabel',{n:trainingLevel(d)})}`,'panel-copy'),make('p',`${t('ability')} · ${traitText(d)}`,'panel-copy'));
 const stats=dogCombat(d);content.append(make('p',t('combatStats',{hp:stats.maxHp,atk:stats.atk,armor:stats.armor}),'panel-copy'),make('p',d.parents.length?`${t('parents')} #${d.parents.join(' / #')}`:t('noParents'),'panel-copy'),make('p',t('coins',{n:Math.floor(haven.s.coins)}),'panel-copy'));
 const cost=trainingCost(d),train=make('button',t(cost===null?'maxLevel':'train'));train.dataset.trainDog=d.id;train.disabled=d.age!=='adult'||cost===null||haven.s.coins<cost;if(cost!==null){train.append(priceChip('coin',cost));train.ariaLabel=`${t('train')} · ${t('coins',{n:cost})}`;}content.append(train);
 if(d.age!=='adult')content.append(make('p',t('trainingAdult'),'panel-copy'));else if(cost!==null){const next=dogCombat({...d,trainingLevel:trainingLevel(d)+1});content.append(make('p',`→ ${t('levelLabel',{n:trainingLevel(d)+1})} · ${t('combatStats',{hp:next.maxHp,atk:next.atk,armor:next.armor})}`,'panel-copy'));}
 const send=make('button',t('rehome'),'danger-button');send.dataset.requestRehome=d.id;content.append(send,houseLink());
}
function renderRehome(){
 const content=$('panelContent'),d=haven.allDogs.find(d=>d.id===detailDogId);if(!d){content.append(make('p',t('confirmDog'),'panel-copy'));return;}
 content.append(dogPortrait(d.breed,96),make('strong',dogName(d)),make('p',`${t(d.age==='puppy'?'puppy':'adult')} · ${t('levelLabel',{n:trainingLevel(d)})} · ${traitText(d)}`,'panel-copy'),make('p',t('rehomeWarning'),'panel-copy'));
 const confirm=make('button',`${t('confirmRehome')} · ${dogName(d)}`,'danger-button');confirm.dataset.confirmRehome=d.id;confirm.ariaLabel=`${t('confirmRehome')} · ${dogName(d)}`;const reason=d.pregnancy?'pregnant':haven.s.dogs.includes(d)&&haven.s.dogs.length<=1?'lastDog':'';confirm.disabled=Boolean(reason);if(reason)content.append(make('p',COPY[locale].errors[reason],'panel-copy'));
 const cancel=make('button',t('close'));listenPanel(cancel,'click',closePanel);content.append(confirm,cancel);
}
function renderCollectionControls(content){
 content.append(make('p',populationText(),'panel-copy'),make('p',t('populationHelp'),'panel-copy'));
 if(haven.s.breedingPaused)content.append(make('p',t('breedingPausedNotice'),'panel-copy breeding-paused-notice'));
 const pause=make('button',t(haven.s.breedingPaused?'resumeBreeding':'pauseBreeding'));pause.dataset.pauseBreeding=String(!haven.s.breedingPaused);content.append(pause);
 let balance=0;try{balance=window.WeightPlayWallet?.read?.().diamonds||0;}catch{}const amount=make('p',undefined,'diamond-balance'),icon=make('img');icon.src='/assets/weightplay-diamond.svg';icon.alt='';icon.width=24;icon.height=24;amount.append(icon,make('span',t('diamondBalance',{n:balance})));content.append(amount);
 const cost=expansionCost(haven.s),expand=make('button',t(cost===null?'maxCapacity':'expand'));expand.disabled=cost===null;if(cost!==null){expand.dataset.openPanel='expand';expand.append(priceChip('diamond',cost));content.append(make('p',t('expandEffect',{n:haven.capacity,max:Math.min(512,haven.capacity+8)}),'panel-copy'));}content.append(expand);
}
function buyCapacity(tier){if(capacityBusy)return;capacityBusy=true;try{const before=haven.capacity,result=purchaseExpansion({state:haven.s,storage:localStorage,wallet:window.WeightPlayWallet,key:STORE,expectedTier:tier});if(result.ok){showPanel('house');feedback(result.pending?t('purchasePending'):t('expandEffect',{n:before,max:haven.capacity}));sound('shop.purchase');}else feedback(t(result.reason),true);update();}catch{feedback(t('purchaseError'),true);}finally{capacityBusy=false;}}
function renderExpansion(){
 const c=$('panelContent'),cost=expansionCost(haven.s);let balance=0;try{balance=window.WeightPlayWallet?.read?.().diamonds||0;}catch{}
 c.append(make('p',t('expandEffect',{n:haven.capacity,max:Math.min(512,haven.capacity+8)}),'panel-copy'),make('p',t('diamondBalance',{n:balance}),'panel-copy'));
 const confirm=make('button',t(cost===null?'maxCapacity':'expand'));confirm.disabled=cost===null;if(cost!==null){confirm.dataset.buyCapacityTier=haven.s.collectionTier;confirm.append(priceChip('diamond',cost));confirm.ariaLabel=`${t('expand')} · ${t('diamondBalance',{n:cost})} · ${t('expandEffect',{n:haven.capacity,max:Math.min(512,haven.capacity+8)})}`;}const cancel=make('button',t('close'));listenPanel(cancel,'click',closePanel);c.append(confirm,cancel);
}
function fillCellButtons(host,key){host.replaceChildren();for(let i=0;i<6;i++){const d=haven.allDogs.find(d=>d.id===haven.s.hunt.formation[i]),b=make('button');b.dataset[key]=i;b.setAttribute('aria-pressed',String(formationCell===i));b.disabled=hunt.phase!=='prep';const name=`${t(i<3?'front':'back')} ${i%3+1}`;b.ariaLabel=`${name} · ${eligible(d)?dogName(d):t('empty')}`;if(eligible(d))b.append(dogPortrait(d.breed,32));b.append(make('span',`${name} · ${eligible(d)?dogName(d):t('empty')}`));host.append(b);}}
function renderFormation(){
 const content=$('panelContent');content.replaceChildren();content.append(make('p',t('teamHint'),'panel-copy'),make('p',`${t('deploy')} ${hunt.allies.length}/${hunt.stage.limit}`,'panel-copy'));
 const cells=make('div',undefined,'formation-grid');fillCellButtons(cells,'formationCell');content.append(cells);
 const remove=make('button',t('removeCell'));remove.dataset.removeFormation=formationCell;remove.disabled=!haven.s.hunt.formation[formationCell];content.append(remove);
 const dogs=haven.allDogs.filter(eligible),pages=Math.max(1,Math.ceil(dogs.length/8));rosterPage=Math.max(0,Math.min(pages-1,rosterPage));const choices=make('div',undefined,'candidate-list');
 for(const d of dogs.slice(rosterPage*8,rosterPage*8+8)){const b=make('button',undefined,'candidate-card'),stats=dogCombat(d),at=haven.s.hunt.formation.indexOf(d.id);b.dataset.candidateId=d.id;b.setAttribute('aria-pressed',String(at>=0));b.append(dogPortrait(d.breed,48),make('strong',dogName(d)),make('small',`${t('levelLabel',{n:trainingLevel(d)})} · ${traitText(d)}`),make('small',t('combatStats',{hp:stats.maxHp,atk:stats.atk,armor:stats.armor})));if(at>=0)b.append(make('small',`${t(at<3?'front':'back')} ${at%3+1}`));choices.append(b);}if(!dogs.length)choices.append(make('p',t('needAdult'),'panel-copy'));content.append(choices);
 const nav=make('nav',undefined,'house-tabs');for(const [delta,key]of [[-1,'previousPage'],[1,'nextPage']]){const b=make('button',t(key));b.dataset.rosterPage=delta;b.disabled=delta<0?rosterPage===0:rosterPage===pages-1;nav.append(b);}content.append(nav);
}
function placeCandidate(id){if(hunt?.phase!=='prep'||panelType!=='formation')return;const form=assignFormation(haven.s.hunt.formation,formationCell,id,haven.allDogs,hunt.stage.limit);if(!form){feedback(`${t('deploy')} ${hunt.allies.length}/${hunt.stage.limit}`,true);return;}haven.s.hunt.formation=form;hunt=new Hunt(hunt.stage.id,haven.allDogs,form);renderHuntControls();save();closePanel();feedback(t('chooseDog'));sound('ui.click');}
function boot(){
 if(new URLSearchParams(location.search).get('preview')!=='1'){copy();$('gameFrame').hidden=true;$('mainGuide').hidden=true;$('comingSoon').hidden=false;return;}
 try{const recovery=recoverExpansion({state:haven.s,storage:localStorage,wallet:window.WeightPlayWallet,key:STORE});if(!recovery.ok){$('saveWarning').textContent=t(recovery.reason);$('saveWarning').hidden=false;}}catch{$('saveWarning').textContent=t('purchaseError');$('saveWarning').hidden=false;}
 window.WonderI18n?.setLocale?.(locale,{navigate:false});
 window.WeightPlayAudio?.preload?.(['ui.click','feedback.error','feedback.success','result.win','reward.coin','reward.unlock','shop.purchase','combat.strike','combat.critical','combat.block','combat.shield.break','player.hurt','enemy.defeat','magic.heal','alert.boss','result.lose']);
 frame=window.WeightPlayScreenFrame.mount({root:$('gameFrame'),localeSelect:$('localeSelect'),playUI:true,scenes:{main:{root:$('mainScreen'),header:$('mainScreen').querySelector('header'),content:$('mainScreen').querySelector('.main-hero')},stage:{root:$('stageScreen'),header:$('stageScreen').querySelector('header'),content:$('stageWorkspace')},battle:{root:$('battleScreen'),header:$('battleScreen').querySelector('header'),content:$('battleLive')}}});
 const coinGroup=make('span',undefined,'coin-stat'),coinImage=make('img');coinImage.src='/assets/wonder-prop-coin-block-v1.png';coinImage.alt='';coinImage.width=26;coinImage.height=26;const coins=make('span');coins.id='coinStat';coinGroup.append(coinImage,coins);const count=make('span');count.id='dogStat';frame.battleTopUI.add(window.WeightPlayScreenFrame.createGroup().add(coinGroup).add(count));const stageStat=make('span');stageStat.id='stageStat';frame.stageTopUI.add(stageStat);
 selector=window.WeightPlayPlayUI.mountStage({page:$('stageWorkspace'),rail:$('stageRail'),selected:selectedStage,config:{count:30,poster:'/games/puppy-haven/assets/cover-block-v1.webp',stage(i){const m=MISSIONS[i];return {id:m.id,kicker:t('stage',{n:m.id}),title:mission(m,'title'),subtitle:enemySummary(m),summary:enemySummary(m),details:[enemySummary(m),t('reward',{n:m.reward})],status:t(m.id>haven.s.hunt.unlocked?'locked':haven.s.hunt.cleared.includes(m.id)?'cleared':'ready'),locked:m.id>haven.s.hunt.unlocked,cleared:haven.s.hunt.cleared.includes(m.id)};}},isActive:()=>screen==='stage',onSelect(i){selectedStage=i;update();},onStart(i){start(i+1);}});
 bind();copy();visible('main');window.PuppyHaven=Object.freeze({snapshot:()=>structuredClone(haven.s),renderStats:()=>yard?{...yard.stats(),camera:yard.cameraRig?.snapshot(),dogPoints:haven.s.dogs.map(d=>({id:d.id,...yard.dogPoint(d.id)}))}:null,motionStats:()=>motion.stats(),battleSnapshot:()=>hunt?structuredClone({phase:hunt.phase,clock:hunt.clock,wave:hunt.wave,diverse:hunt.diverse,units:hunt.units,events:hunt.recent||[],stage:hunt.stage.id}):null});
}
boot();
