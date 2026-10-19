import {Haven,normalizeState,BREEDS,BASE_BREEDS,RECIPES,offspringOdds,MEAL_SPOTS,FOOD,YARD_CAPACITY} from './simulation.mjs';
import {COPY,SUPPORTED,LANGUAGE_LABELS} from './locales.mjs';
import {Yard} from './yard.mjs';
import {Motion} from './motion.mjs';
import {Hunt,HUNT_STAGES as MISSIONS,ROLES,dogCombat,eligible} from './hunt.mjs';
import {HuntYard} from './hunt-yard.mjs';

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
const audio=window.WeightPlayAudio?.createScope(),motion=new Motion();let hasScene=false;const needTargets={hunger:0,happy:0,clean:0};
const sound=id=>audio?.play(id);
const make=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
function save(){try{localStorage.setItem(STORE,JSON.stringify(haven.s));$('saveWarning').hidden=true;}catch{$('saveWarning').textContent=t('saveError');$('saveWarning').hidden=false;}}
function copy(){document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';$('localeSelect').value=locale;$('localeSelect').ariaLabel=LANGUAGE_LABELS[locale];document.title=`${t('title')} | WeightPlay`;document.querySelectorAll('[data-copy]').forEach(n=>n.textContent=t(n.dataset.copy));$('closePanel').ariaLabel=t('close');$('dogRail').ariaLabel=t('dogs',{n:haven.s.dogs.length});const alt=`${t('title')} · ${[0,1,3].map(i=>COPY[locale].breedNames[i]).join(' / ')} · ${t('puppy')}`;document.querySelectorAll('img[src*="cover-block-v1"]').forEach(n=>n.alt=alt);$('comingSoon').querySelector('h1').textContent=t('title');$('comingSoon').querySelector('p').textContent=t('preview').split(' · ')[0];const canvas=$('yard').querySelector('canvas');if(canvas)canvas.ariaLabel=t(hunt?'hunt':'freeYard');frame?.refresh();selector?.refresh(selectedStage);dogSignature='';update();}
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
 try{yard=hunt?new HuntYard($('yard'),(kind,cell)=>{if(kind==='cell'&&!blocked()&&hunt.phase==='prep')deploy(cell);},()=>{lost=true;$('worldFallback').hidden=false;}):new Yard($('yard'),(kind,id)=>{if(blocked())return;if(kind==='dog'){haven.select(id);if(haven.selected.petIn===0)act('pet');else update();}else act('clean',{id});},()=>{lost=true;$('worldFallback').hidden=false;});yard.renderer.domElement.ariaLabel=t(hunt?'hunt':'freeYard');renderWorld(0);$('worldFallback').hidden=true;}
 catch(error){lost=true;$('worldFallback').hidden=false;console.error('PUPPY_HAVEN_3D',error.message);}
 if(hunt)renderHuntControls();update();last=performance.now();raf=requestAnimationFrame(loop);
 if(!hunt&&!read('weightplay.puppy-haven.observation-intro'))showPanel('help');
}
function renderWorld(dt){if(hunt)yard.renderHunt(hunt,dt);else yard.render(haven.s,blocked()?0:dt,dt);}

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
 const key={placeFood:'placed',feed:'feedDone',pet:'petDone',clean:'cleanDone',buy:'buyDone',adopt:'adoptDone',pair:'pairDone',birth:'birthDone',growth:'growthDone',restDog:'restDone',recallDog:'recallDone'}[event.type];
 if(key){feedback(t(key));cue(t(key));}
 if(event.dog)yard?.effect(event.dog,event.type);if(['feed','pair','birth','growth'].includes(event.type))save();
 if(event.type==='buy'||event.type==='adopt')sound('shop.purchase');
 else if(event.type==='clean'||event.type==='pet'){sound('reward.coin');rewardFly(event.coins,$(event.type==='clean'?'cleanBtn':'petBtn'));}
 else if(event.type==='birth'||event.type==='growth')sound('reward.unlock');else if(event.type==='restDog'||event.type==='recallDog')sound('ui.click');else sound('feedback.success');
 }update();}
function act(type,data){if(screen!=='battle'||lost||hunt||!$('resultPanel').hidden)return;const result=haven.action(type,data);processEvents();save();if(result.ok){
  if((type==='adopt'||type==='placeFood')&&$('resultPanel').hidden){closePanel();}
  else if(panelType==='food')renderFood();
  else if(panelType==='house'){renderHouse();$('closePanel').focus({preventScroll:true});}
 }return result;}
function decorateStageReward(){const row=$('stageRail-shared-details')?.lastElementChild;if(row&&!row.querySelector('img')){const img=make('img');img.src='/assets/wonder-prop-coin-block-v1.png';img.alt='';img.width=24;img.height=24;img.className='stage-reward-art';row.prepend(img);}}
function update(){if(!frame)return;decorateStageReward();const s=haven.s,d=haven.selected;const priorCoins=$('coinStat').textContent,priorObjective=$('objective').textContent;
 $('coinStat').textContent=t('coins',{n:Math.floor(s.coins)});$('dogStat').textContent=t('dogs',{n:s.dogs.length});$('stageStat').textContent=t('stage',{n:selectedStage+1});
 if(hunt){updateHunt();return;}
 if(priorCoins&&priorCoins!==$('coinStat').textContent)motion.emphasize($('coinStat'));$('objective').textContent=s.stage?`${t('stage',{n:s.stage})} · ${mission(MISSIONS[s.stage-1],'goal')}`:t('freeYard');if(priorObjective&&priorObjective!==$('objective').textContent)motion.enter($('objective'));
 $('dogName').textContent=dogName(d);$('dogAge').textContent=d.pregnancy?t('pregnancy',{n:Math.ceil(d.pregnancy.remaining)}):d.age==='puppy'?t('growth',{n:Math.floor(d.growth)}):t('adult');
 $('dogAge').textContent+=' · '+t(d.activity);
 $('dogFamily').textContent=d.parents.length?`${t('parents')} #${d.parents.join(' / #')}`:t('noParents');
 for(const k of ['hunger','happy','clean']){needTargets[k]=d[k];$(k).setAttribute('aria-valuenow',String(Math.floor(d[k])));if(motion.reduced)$(k).value=d[k];$(k+'Value').textContent=Math.floor(d[k]);}
 $('petBtn').textContent=d.petIn>0?t('restPet',{n:Math.ceil(d.petIn)}):t('pet');$('cleanBtn').textContent=t('cleanCount',{n:s.poops.length});
 const signature=JSON.stringify(s.dogs.map(d=>[d.id,d.age,Boolean(d.pregnancy),s.selected===d.id]));
 if(signature!==dogSignature){dogSignature=signature;motion.exit($('dogRail'));const fragment=document.createDocumentFragment();for(const dog of s.dogs){const button=make('button');button.type='button';button.dataset.dogId=dog.id;button.setAttribute('aria-pressed',String(s.selected===dog.id));button.append(make('span',`${breedName(dog.breed)} #${dog.id} ${dog.sex==='F'?'♀':'♂'}`),make('small',dog.pregnancy?t('expecting'):t(dog.age==='puppy'?'puppy':'adult')));fragment.append(button);}$('dogRail').replaceChildren(fragment);motion.enter($('dogRail'));}
}
function showPanel(type){if(panelType)motion.exit($('panel').querySelector('.panel-card'));panelAbort.abort();panelAbort=new AbortController();if(!panelType)focusReturn=document.activeElement;panelType=type;$('panel').hidden=false;$('battleLive').inert=true;frame.activate('battle',{covered:true});$('panelFeedback').textContent='';$('panelContent').replaceChildren();
 $('panelTitle').textContent=t({food:'pantry',adopt:'adopt',pair:'pair',house:'restHouse',help:'helpTitle',leave:'leaveTitle',codex:'codex',huntHelp:'hunt'}[type]);
 if(type==='huntHelp'){const c=$('panelContent');c.append(make('p',t('huntGuide'),'panel-copy'));for(const text of COPY[locale].roleNames)c.append(make('p',text,'panel-copy'));for(const enemy of hunt.enemies)c.append(make('p',enemyName(enemy.kind)+' · '+t('combatStats',{hp:enemy.maxHp,atk:enemy.atk,armor:enemy.armor}),'panel-copy'));}
 if(type==='codex')renderCodex();if(type==='food')renderFood();if(type==='adopt')renderAdopt();if(type==='pair')renderPair();if(type==='house'){houseMode='yard';housePage=0;renderHouse();}
 if(type==='help'){const taro=make('img');taro.src='/assets/weightplay-character-moss-shell-turtle-block-v1.webp';taro.alt='';taro.width=112;taro.height=112;taro.className='guide-taro';$('panelContent').append(taro,make('p',t('guide'),'panel-copy'));const b=make('button',t('startCaring'));listenPanel(b,'click',()=>{try{localStorage.setItem('weightplay.puppy-haven.observation-intro','1');}catch{}closePanel();});$('panelContent').append(b);}
 if(type==='leave'){$('panelContent').append(make('p',t('saved'),'panel-copy'));for(const [label,fn]of [['continue',closePanel],['leave',()=>{closePanel();visible('stage');}]]){const b=make('button',t(label));listenPanel(b,'click',fn);$('panelContent').append(b);}}
 motion.enter($('panel').querySelector('.panel-card'));$('closePanel').focus({preventScroll:true});
}
function closePanel(){if(!$('panel').hidden)motion.exit($('panel').querySelector('.panel-card'));panelAbort.abort();panelType='';$('panel').hidden=true;$('battleLive').inert=false;frame.activate('battle');last=performance.now();(focusReturn?.isConnected&&focusReturn.getClientRects().length?focusReturn:$('feedBtn')).focus({preventScroll:true});}
function houseLink(){const b=make('button',t('manageRooms',{n:haven.s.restDogs.length}));b.dataset.openPanel='house';return b;}
function renderHouse(){
 const content=$('panelContent');if(content.childElementCount)motion.exit($('panel').querySelector('.panel-card'));motion.enter(content);content.replaceChildren();content.append(make('p',t('houseGuide'),'panel-copy'),make('p',t('roomCapacity',{n:haven.reserved,max:YARD_CAPACITY}),'panel-copy'));
 const tabs=make('nav',undefined,'house-tabs');for(const [mode,key,n]of [['yard','inYard',haven.s.dogs.length],['rest','inHouse',haven.s.restDogs.length]]){const b=make('button',t(key,{n}));b.dataset.houseMode=mode;b.setAttribute('aria-pressed',String(houseMode===mode));tabs.append(b);}content.append(tabs);
 const dogs=houseMode==='yard'?haven.s.dogs:haven.s.restDogs;const pages=Math.max(1,Math.ceil(dogs.length/8));housePage=Math.max(0,Math.min(housePage,pages-1));
 const list=make('div',undefined,'house-list');
 for(const dog of dogs.slice(housePage*8,housePage*8+8)){const row=make('section',undefined,'house-row');const name=make('strong',dogName(dog));const needs=make('small',`${t(dog.age==='puppy'?'puppy':'adult')} · ${t('hunger')} ${Math.floor(dog.hunger)} / ${t('happy')} ${Math.floor(dog.happy)} / ${t('cleanliness')} ${Math.floor(dog.clean)}`);const b=make('button',t(houseMode==='yard'?'moveToHouse':'bringHome'));b.dataset.roomDogId=dog.id;b.dataset.roomAction=houseMode==='yard'?'restDog':'recallDog';b.setAttribute('aria-label',`${b.textContent} · ${dogName(dog)}`);row.append(name,needs,b);list.append(row);}
 if(!dogs.length)list.append(make('p',t('houseEmpty'),'panel-copy'));content.append(list);
 const nav=make('nav',undefined,'house-tabs');const prev=make('button',t('previousPage')),next=make('button',t('nextPage'));prev.dataset.housePage=-1;next.dataset.housePage=1;prev.disabled=housePage===0;next.disabled=housePage===pages-1;nav.append(prev,make('span',`${housePage+1} / ${pages}`),next);content.append(nav);
 const back=make('button',t('backToFamily'));back.dataset.openPanel='pair';content.append(back);
}
function renderFood(){
 const content=$('panelContent'),active=document.activeElement,grade=active?.dataset.buyGrade,scroll=$('panel').querySelector('.panel-card').scrollTop;
 content.replaceChildren();content.append(make('p',t('foodGuide'),'panel-copy'));
 const label=make('label',t('mealSpot'),'pair-field'),spots=make('select');spots.id='mealSpot';
 MEAL_SPOTS.forEach((_,i)=>{const occupied=haven.s.bowls.some(b=>b.spot===i),option=new Option(t('spot',{n:i+1})+(occupied?' · '+t('occupied'):''),i);option.disabled=occupied;spots.append(option);});
 const first=MEAL_SPOTS.findIndex((_,i)=>!haven.s.bowls.some(b=>b.spot===i));spots.value=first;label.append(spots);content.append(label);
 FOOD.forEach((f,i)=>{const row=make('section',undefined,'food-row');if(yard){const img=make('img');img.src=yard.foodPortrait(i);img.alt=COPY[locale].foodNames[i];img.width=72;img.height=72;img.className='food-portrait';row.append(img);}row.append(make('strong',COPY[locale].foodNames[i]),make('small',t('nutrition',{n:f.nutrition,g:f.growth})));
 const actions=make('div',undefined,'food-actions'),buy=make('button',t('buy',{n:f.price})),use=make('button',t('use',{n:haven.s.food[i]}));buy.dataset.buyGrade=i;use.dataset.placeGrade=i;use.disabled=first<0||haven.s.food[i]===0;actions.append(buy,use);row.append(actions);content.append(row);});
 motion.enter(content);if(grade!==undefined){content.querySelector(`[data-buy-grade="${grade}"]`)?.focus({preventScroll:true});$('panel').querySelector('.panel-card').scrollTop=scroll;}
}
function renderAdopt(){const content=$('panelContent');content.replaceChildren();content.append(houseLink());BASE_BREEDS.forEach((b,i)=>{const row=make('section',undefined,'adopt-row');if(yard){const img=make('img');img.src=yard.portrait(b.id);img.alt=COPY[locale].breedNames[i];img.width=72;img.height=72;img.className='breed-portrait';row.append(img);}row.append(make('strong',COPY[locale].breedNames[i]),make('small',t('adoptPrice',{n:b.price})));const actions=make('div',undefined,'food-actions');for(const sex of ['M','F']){const button=make('button',`${sex==='F'?'♀':'♂'} ${t(sex==='F'?'female':'male')} · ${b.price}`);button.dataset.adoptBreed=b.id;button.dataset.sex=sex;actions.append(button);}row.append(actions);content.append(row);});}
function renderPair(){
 const content=$('panelContent');content.append(houseLink(),make('p',t('pairGuide'),'panel-copy'));
 const guide=make('button',t('codex'));guide.dataset.openPanel='codex';content.append(guide);
 for(const dog of haven.s.dogs){const row=make('section',undefined,'family-dog');row.append(make('strong',dogName(dog)),make('p',dog.pregnancy?t('pregnancy',{n:Math.ceil(dog.pregnancy.remaining)}):dog.age==='puppy'?t('puppy'):dog.cooldown>0?t('resting',{n:Math.ceil(dog.cooldown)}):t('naturalReady'),'panel-copy'));content.append(row);}
}
function renderCodex(){
 const content=$('panelContent');content.append(make('p',t('codexGuide'),'panel-copy'),make('p',t('discovered',{n:haven.s.discovered.length,max:BREEDS.length}),'panel-copy'));
 for(const [id,key]of [['codexFather','father'],['codexMother','mother']]){const label=make('label',t(key),'pair-field'),select=make('select');select.id=id;for(const breed of BREEDS)select.append(new Option(breedName(breed.id),breed.id));label.append(select);content.append(label);}
 $('codexMother').value='corgi';const result=make('p',undefined,'recipe-result');result.id='recipeOdds';content.append(result);
 const refresh=()=>{result.textContent=offspringOdds($('codexFather').value,$('codexMother').value).map(o=>`${breedName(o.breed)} ${Math.round(o.chance*100)}%`).join(' · ');motion.emphasize(result);};listenPanel($('codexFather'),'change',refresh);listenPanel($('codexMother'),'change',refresh);refresh();
 for(const recipe of RECIPES){const row=make('section',undefined,'recipe-row');if(yard){const img=make('img');img.src=yard.portrait(recipe.child);img.alt=breedName(recipe.child);img.width=72;img.height=72;row.append(img);}row.append(make('strong',recipe.parents.map(breedName).join(' × ')),make('p',offspringOdds(...recipe.parents).map(o=>`${breedName(o.breed)} ${Math.round(o.chance*100)}%`).join(' · '),'panel-copy'));content.append(row);}
}
function showResult(event){panelAbort.abort();if(panelType)motion.exit($('panel').querySelector('.panel-card'));panelType='';$('panel').hidden=true;$('resultPanel').hidden=false;$('battleLive').inert=true;frame.activate('battle',{covered:true});$('resultTitle').textContent=mission(MISSIONS[event.stage-1],'title');$('resultReward').textContent=t('reward',{n:event.reward});$('resultBalance').textContent=t('coins',{n:Math.floor(haven.s.coins)});motion.enter($('resultPanel').querySelector('.result-card'));rewardFly(event.reward,$('resultReward'),$('resultBalance'));$('nextBtn').hidden=event.stage===30;if(hunt){$('resultTitle').textContent=t(hunt.phase==='won'?'huntWin':hunt.reason==='timeout'?'huntTimeout':'huntLose');$('nextBtn').hidden=hunt.phase!=='won'||event.stage===30;}sound(hunt&&hunt.phase!=='won'?'result.lose':'result.win');$('nextBtn').hidden?$('retryBtn').focus():$('nextBtn').focus();}
const enemyIndex={boar:0,wolf:1,armored:2,fox:3,stag:4,boss:5};
const roleIndex={balanced:0,guard:1,healer:2,flanker:3,splash:4,scout:5};
function enemyName(kind){return COPY[locale].enemyNames[enemyIndex[kind]];}
function enemySummary(stage){return stage.waves.map(w=>w.map(enemyName).join(' / ')).join(' → ');}
function renderHuntControls(){
 const select=$('huntRoster'),chosen=select.value;select.replaceChildren();const dogs=haven.allDogs.filter(eligible);for(const d of dogs)select.append(new Option(`${dogName(d)} · ${COPY[locale].roleNames[roleIndex[ROLES[d.breed]]]}`,d.id));if(dogs.some(d=>String(d.id)===chosen))select.value=chosen;select.ariaLabel=t('roster');
 $('huntCells').replaceChildren();for(let i=0;i<6;i++){const dog=haven.allDogs.find(d=>d.id===haven.s.hunt.formation[i]),b=make('button');b.dataset.huntCell=i;b.disabled=false;const label=`${t(i<3?'front':'back')} ${i%3+1}`;b.setAttribute('aria-label',label+' · '+(eligible(dog)?dogName(dog):t('empty')));if(eligible(dog)&&yard){const img=make('img');img.src=yard.portrait(dog.breed);img.alt='';img.width=32;img.height=32;b.append(img,make('span',`${label} · ${breedName(dog.breed)} #${dog.id}`));}else b.append(make('span',label+' · '+t('empty')));$('huntCells').append(b);}
 showSelectedHuntDog();updateHunt();motion.enter($('huntCells'));
}
function showSelectedHuntDog(){const d=haven.allDogs.find(d=>String(d.id)===$('huntRoster').value);if(!d){$('huntSelected').textContent=t('needAdult');return;}const stats=dogCombat(d);$('huntSelected').textContent=t('combatStats',{hp:stats.maxHp,atk:stats.atk,armor:stats.armor})+' · '+t('huntXp',{n:d.huntXp||0});}
function deploy(cell){if(hunt?.phase!=='prep'||blocked()||cell<0||cell>=6)return;const id=Number($('huntRoster').value),dog=haven.allDogs.find(d=>d.id===id);if(!eligible(dog)){feedback(t('needAdult'),true);return;}const form=haven.s.hunt.formation;if(!form.includes(id)&&!form[cell]&&hunt.allies.length>=hunt.stage.limit){feedback(`${t('deploy')} ${hunt.allies.length}/${hunt.stage.limit}`,true);return;}if(form[cell]===id)form[cell]=null;else{for(let i=0;i<6;i++)if(form[i]===id)form[i]=null;form[cell]=id;}hunt=new Hunt(hunt.stage.id,haven.allDogs,form);renderHuntControls();feedback(t('chooseDog'));save();sound('ui.click');}
function updateHunt(){
 if(!hunt)return;$('objective').textContent=hunt.phase==='prep'?t('deploy')+' · '+mission(hunt.stage,'title'):t('waveStatus',{n:hunt.wave+1,max:hunt.stage.waves.length,a:hunt.allies.filter(d=>d.hp>0).length,b:hunt.enemies.filter(d=>d.hp>0).length})+` · ${Math.max(0,Math.ceil(90-hunt.clock))}s`;$('dogStat').textContent=`${hunt.allies.filter(d=>d.hp>0).length}/${hunt.allies.length}`;
 $('huntEnemy').textContent=t('enemyPreview')+': '+enemySummary(hunt.stage)+(hunt.diverse?' · '+t('synergy'):'');$('huntRoster').disabled=hunt.phase!=='prep';$('clearHunt').disabled=hunt.phase!=='prep';$('launchHunt').disabled=hunt.phase!=='prep'||!hunt.allies.length;for(const b of $('huntCells').children)b.disabled=hunt.phase!=='prep';
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
 for(const [id,type]of [['foodBtn','food'],['feedBtn','food'],['adoptBtn','adopt'],['pairBtn','pair'],['helpBtn','help']])listen($(id),'click',()=>showPanel(type));
 listen($('launchHunt'),'click',()=>{if(!blocked()&&hunt?.begin()){sound('game.start');updateHunt();}});listen($('clearHunt'),'click',()=>{if(hunt?.phase==='prep'){haven.s.hunt.formation=Array(6).fill(null);hunt=new Hunt(hunt.stage.id,haven.allDogs,haven.s.hunt.formation);renderHuntControls();save();}});listen($('huntInfo'),'click',()=>showPanel('huntHelp'));listen($('huntRoster'),'change',showSelectedHuntDog);listen($('huntCells'),'click',e=>{const b=e.target.closest('[data-hunt-cell]');if(b)deploy(Number(b.dataset.huntCell));});
 listen($('petBtn'),'click',()=>{if(!blocked())act('pet');});listen($('cleanBtn'),'click',()=>{if(!blocked())act('clean');});
 listen($('dogRail'),'click',e=>{const b=e.target.closest('[data-dog-id]');if(b&&!blocked()){haven.select(Number(b.dataset.dogId));update();save();}});
 listen($('panelContent'),'click',e=>{const b=e.target.closest('button');if(!b)return;
  if(b.dataset.openPanel){showPanel(b.dataset.openPanel);return;}
  if(b.dataset.houseMode){houseMode=b.dataset.houseMode;housePage=0;renderHouse();$('panelContent').querySelector(`[data-house-mode="${houseMode}"]`).focus();return;}
  if(b.dataset.housePage){housePage+=Number(b.dataset.housePage);renderHouse();$('closePanel').focus();return;}
  if(b.dataset.roomAction){const id=Number(b.dataset.roomDogId);if(b.dataset.roomAction==='restDog')haven.select(id);act(b.dataset.roomAction,{id});return;}
  if(b.dataset.buyGrade!==undefined)act('buy',{grade:Number(b.dataset.buyGrade)});if(b.dataset.placeGrade!==undefined)act('placeFood',{grade:Number(b.dataset.placeGrade),spot:Number($('mealSpot').value)});if(b.dataset.adoptBreed)act('adopt',{breed:b.dataset.adoptBreed,sex:b.dataset.sex});});
 listen($('closePanel'),'click',()=>{if(panelType==='help')try{localStorage.setItem('weightplay.puppy-haven.observation-intro','1');}catch{}closePanel();});
 listen($('reloadBtn'),'click',()=>{save();location.reload();});
 listen($('nextBtn'),'click',()=>start(Math.min(30,haven.s.stage+1)));listen($('retryBtn'),'click',()=>start(haven.s.stage));listen($('resultYard'),'click',()=>start(0));listen($('resultStages'),'click',()=>visible('stage'));
 listen($('localeSelect'),'change',e=>{locale=SUPPORTED.includes(e.target.value)?e.target.value:'en';try{localStorage.setItem('weightPlayLocale',locale);}catch{}window.WonderI18n?.setLocale?.(locale,{navigate:false});copy();save();const target=new URL(window.WonderI18n.localizedPath(locale,location.href),location.origin);target.searchParams.delete('lang');location.assign(target.href);});
 listen(document,'visibilitychange',()=>{last=performance.now();save();audio?.stop();if(document.hidden)motion.clear();});listen(window,'blur',()=>{if(screen==='battle'&&!blocked())showPanel('leave');});
 listen(document,'keydown',e=>{const modal=!$('panel').hidden?$('panel'):!$('resultPanel').hidden?$('resultPanel'):null;if(!modal)return;if(e.key==='Escape'&&panelType){e.preventDefault();closePanel();}if(e.key==='Tab'){const list=[...modal.querySelectorAll('button,select,a')].filter(n=>!n.hidden&&!n.disabled&&n.getClientRects().length),first=list[0],last=list.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
 listen(window,'pagehide',event=>{save();motion.clear();if(!event.persisted){cancelAnimationFrame(raf);yard?.dispose();selector?.destroy();frame.destroy();audio?.dispose();abort.abort();}});
}
function boot(){
 if(new URLSearchParams(location.search).get('preview')!=='1'){copy();$('gameFrame').hidden=true;$('mainGuide').hidden=true;$('comingSoon').hidden=false;return;}
 window.WonderI18n?.setLocale?.(locale,{navigate:false});
 window.WeightPlayAudio?.preload?.(['ui.click','feedback.error','feedback.success','result.win','reward.coin','reward.unlock','shop.purchase','combat.strike','combat.critical','combat.block','combat.shield.break','player.hurt','enemy.defeat','magic.heal','alert.boss','result.lose']);
 frame=window.WeightPlayScreenFrame.mount({root:$('gameFrame'),localeSelect:$('localeSelect'),playUI:true,scenes:{main:{root:$('mainScreen'),header:$('mainScreen').querySelector('header'),content:$('mainScreen').querySelector('.main-hero')},stage:{root:$('stageScreen'),header:$('stageScreen').querySelector('header'),content:$('stageWorkspace')},battle:{root:$('battleScreen'),header:$('battleScreen').querySelector('header'),content:$('battleLive')}}});
 const coinGroup=make('span',undefined,'coin-stat'),coinImage=make('img');coinImage.src='/assets/wonder-prop-coin-block-v1.png';coinImage.alt='';coinImage.width=26;coinImage.height=26;const coins=make('span');coins.id='coinStat';coinGroup.append(coinImage,coins);const count=make('span');count.id='dogStat';frame.battleTopUI.add(window.WeightPlayScreenFrame.createGroup().add(coinGroup).add(count));const stageStat=make('span');stageStat.id='stageStat';frame.stageTopUI.add(stageStat);
 selector=window.WeightPlayPlayUI.mountStage({page:$('stageWorkspace'),rail:$('stageRail'),selected:selectedStage,config:{count:30,poster:'/games/puppy-haven/assets/cover-block-v1.webp',stage(i){const m=MISSIONS[i];return {id:m.id,kicker:t('stage',{n:m.id}),title:mission(m,'title'),subtitle:enemySummary(m),summary:enemySummary(m),details:[enemySummary(m),t('reward',{n:m.reward})],status:t(m.id>haven.s.hunt.unlocked?'locked':haven.s.hunt.cleared.includes(m.id)?'cleared':'ready'),locked:m.id>haven.s.hunt.unlocked,cleared:haven.s.hunt.cleared.includes(m.id)};}},isActive:()=>screen==='stage',onSelect(i){selectedStage=i;update();},onStart(i){start(i+1);}});
 bind();copy();visible('main');window.PuppyHaven=Object.freeze({snapshot:()=>structuredClone(haven.s),renderStats:()=>yard?.stats()||null,motionStats:()=>motion.stats(),battleSnapshot:()=>hunt?structuredClone({phase:hunt.phase,clock:hunt.clock,wave:hunt.wave,diverse:hunt.diverse,units:hunt.units,events:hunt.recent||[],stage:hunt.stage.id}):null});
}
boot();
