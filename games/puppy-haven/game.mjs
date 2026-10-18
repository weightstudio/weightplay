import {Haven,normalizeState,BREEDS,FOOD,MISSIONS,YARD_CAPACITY} from './simulation.mjs';
import {COPY,SUPPORTED} from './locales.mjs';
import {Yard} from './yard.mjs';

const $=id=>document.getElementById(id),STORE='weightplay.puppy-haven.v1';
const read=key=>{try{return localStorage.getItem(key);}catch{return null;}};
let saved;try{saved=JSON.parse(read(STORE));}catch{}
const haven=new Haven(normalizeState(saved));
let locale=new URLSearchParams(location.search).get('lang')||read('weightPlayLocale')||'zh-Hant';if(!SUPPORTED.includes(locale))locale='en';
const t=(key,vars={})=>String(COPY[locale][key]??COPY.en[key]??key).replace(/\{(\w+)\}/g,(_,k)=>vars[k]??'');
const zh=()=>locale.startsWith('zh');
const breedName=id=>COPY[locale].breedNames[BREEDS.findIndex(b=>b.id===id)];
const dogName=d=>`${breedName(d.breed)} #${d.id} ${d.sex==='F'?'♀':'♂'}`;
const sexName=d=>t(d.sex==='F'?'female':'male');
const abort=new AbortController(),listen=(el,event,fn)=>el.addEventListener(event,fn,{signal:abort.signal});
let frame,selector,yard,screen='main',selectedStage=haven.s.unlocked-1,panelType='',panelAbort=new AbortController(),focusReturn=null,raf=0,last=0,renderIn=0,saveIn=0,cueTime=0,dogSignature='',lost=false,houseMode='yard',housePage=0;
const listenPanel=(el,event,fn)=>el.addEventListener(event,fn,{signal:panelAbort.signal});
const audio=window.WeightPlayAudio?.createScope();
const sound=id=>audio?.play(id);
const make=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
function save(){try{localStorage.setItem(STORE,JSON.stringify(haven.s));$('saveWarning').hidden=true;}catch{$('saveWarning').textContent=t('saveError');$('saveWarning').hidden=false;}}
function copy(){document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';$('localeSelect').value=locale;document.title=`${t('title')} | WeightPlay`;document.querySelectorAll('[data-copy]').forEach(n=>n.textContent=t(n.dataset.copy));$('closePanel').ariaLabel=t('close');$('dogRail').ariaLabel=zh()?'狗狗名單':'Dog list';frame?.refresh();selector?.refresh(selectedStage);dogSignature='';update();}
function visible(next){
 if(screen==='battle'&&next!=='battle'){cancelAnimationFrame(raf);yard?.dispose();yard=null;audio?.stop();save();}
 screen=next;document.body.dataset.screen=next;for(const name of ['main','stage','battle'])$(name+'Screen').hidden=name!==next;
 $('mainGuide').hidden=next!=='main';panelAbort.abort();$('panel').hidden=true;$('resultPanel').hidden=true;panelType='';$('battleLive').inert=false;frame.activate(next);
 if(next==='stage'){selectedStage=haven.s.unlocked-1;selector.refresh(selectedStage);requestAnimationFrame(()=>selector.refresh(selectedStage));}
 window.dispatchEvent(new Event('weightplay:shell-sync'));window.dispatchEvent(new Event(`weightplay:${next}-sync`));
}
function start(stage){if(!haven.start(stage))return;cancelAnimationFrame(raf);yard?.dispose();yard=null;audio?.stop();lost=false;visible('battle');$('feedback').textContent='';update();
 try{yard=new Yard($('yard'),(kind,id)=>{if(blocked())return;if(kind==='dog'){haven.select(id);update();}else act('clean',{id});},()=>{lost=true;$('worldFallback').hidden=false;});yard.render(haven.s,0);$('worldFallback').hidden=true;}
 catch(error){lost=true;$('worldFallback').hidden=false;console.error('PUPPY_HAVEN_3D',error.message);}
 last=performance.now();raf=requestAnimationFrame(loop);
 if(!read('weightplay.puppy-haven.intro'))showPanel('help');
}
function settingsOpen(){return Boolean(document.querySelector('[data-wp-preferences] .wp-frame-popover:not([hidden])'));}
function blocked(){return screen!=='battle'||Boolean(panelType)||!$('resultPanel').hidden||document.hidden||lost||settingsOpen();}
function loop(now){const dt=Math.min(.1,(now-last)/1000);last=now;
 if(!blocked()){haven.tick(dt);processEvents();saveIn+=dt;if(saveIn>5){saveIn=0;save();}}
 if(yard&&!document.hidden&&!lost)yard.render(haven.s,blocked()?0:dt,dt);
 cueTime=Math.max(0,cueTime-dt);$('worldCue').classList.toggle('show',cueTime>0);
 renderIn+=dt;if(renderIn>.2){renderIn=0;update();}
 if(screen==='battle')raf=requestAnimationFrame(loop);
}
function feedback(message,error=false){$('feedback').textContent=message;$('panelFeedback').textContent=message;if(error)sound('feedback.error');}
function cue(text){$('worldCue').textContent=text;cueTime=2;$('worldCue').classList.add('show');}
function rewardFly(amount,origin){if(!origin)return;const target=$('coinStat').getBoundingClientRect(),from=origin.getBoundingClientRect(),n=make('span',`+${amount}`,'coin-flight');n.style.left=`${from.left+from.width/2}px`;n.style.top=`${from.top}px`;document.body.append(n);const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const animation=n.animate(reduced?[{opacity:1},{opacity:0}]:[{transform:'translate(0,0)',opacity:1},{transform:`translate(${target.left-from.left}px,${target.top-from.top}px)`,opacity:0}],{duration:reduced?160:500,easing:'ease-out'});animation.finished.catch(()=>{}).finally(()=>n.remove());}
function processEvents(){for(const event of haven.events.splice(0)){
 if(event.type==='error'){feedback(COPY[locale].errors[event.reason]||COPY.en.errors[event.reason],true);continue;}
 if(event.type==='poop')continue;
 if(event.type==='complete'){save();showResult(event);continue;}
 const key={feed:'feedDone',pet:'petDone',clean:'cleanDone',buy:'buyDone',adopt:'adoptDone',pair:'pairDone',birth:'birthDone',growth:'growthDone',restDog:'restDone',recallDog:'recallDone'}[event.type];
 if(key){feedback(t(key));cue(t(key));}
 if(event.dog)yard?.effect(event.dog);
 if(event.type==='buy'||event.type==='adopt')sound('shop.purchase');
 else if(event.type==='clean'||event.type==='pet'){sound('reward.coin');rewardFly(event.coins,$(event.type==='clean'?'cleanBtn':'petBtn'));}
 else if(event.type==='birth'||event.type==='growth')sound('reward.unlock');else if(event.type==='restDog'||event.type==='recallDog')sound('ui.click');else sound('feedback.success');
 }update();}
function act(type,data){if(screen!=='battle'||lost||!$('resultPanel').hidden)return;const result=haven.action(type,data);processEvents();save();if(result.ok){
  if((type==='adopt'||type==='pair')&&$('resultPanel').hidden){closePanel();}
  else if(panelType==='food')renderFood();
  else if(panelType==='house'){renderHouse();$('closePanel').focus({preventScroll:true});}
 }return result;}
function update(){if(!frame)return;const s=haven.s,d=haven.selected;
 $('coinStat').textContent=t('coins',{n:Math.floor(s.coins)});$('dogStat').textContent=t('dogs',{n:s.dogs.length});$('stageStat').textContent=t('stage',{n:selectedStage+1});
 $('objective').textContent=s.stage?`${t('stage',{n:s.stage})} · ${MISSIONS[s.stage-1][zh()?'goalZh':'goalEn']}`:t('freeYard');
 $('dogName').textContent=dogName(d);$('dogAge').textContent=d.pregnancy?t('pregnancy',{n:Math.ceil(d.pregnancy.remaining)}):d.age==='puppy'?t('growth',{n:Math.floor(d.growth)}):t('adult');
 $('dogFamily').textContent=d.parents.length?`${t('parents')} #${d.parents.join(' / #')}`:t('noParents');
 for(const k of ['hunger','happy','clean']){$(k).value=d[k];$(k+'Value').textContent=Math.floor(d[k]);}
 $('petBtn').textContent=d.petIn>0?t('restPet',{n:Math.ceil(d.petIn)}):t('pet');$('cleanBtn').textContent=t('cleanCount',{n:s.poops.length});
 const signature=JSON.stringify(s.dogs.map(d=>[d.id,d.age,Boolean(d.pregnancy),s.selected===d.id]));
 if(signature!==dogSignature){dogSignature=signature;const fragment=document.createDocumentFragment();for(const dog of s.dogs){const button=make('button');button.type='button';button.dataset.dogId=dog.id;button.setAttribute('aria-pressed',String(s.selected===dog.id));button.append(make('span',`${breedName(dog.breed)} #${dog.id} ${dog.sex==='F'?'♀':'♂'}`),make('small',dog.pregnancy?t('newPuppy'):t(dog.age==='puppy'?'puppy':'adult')));fragment.append(button);}$('dogRail').replaceChildren(fragment);}
}
function showPanel(type){panelAbort.abort();panelAbort=new AbortController();if(!panelType)focusReturn=document.activeElement;panelType=type;$('panel').hidden=false;$('battleLive').inert=true;frame.activate('battle',{covered:true});$('panelFeedback').textContent='';$('panelContent').replaceChildren();
 $('panelTitle').textContent=t({food:'pantry',adopt:'adopt',pair:'pair',house:'restHouse',help:'helpTitle',leave:'leaveTitle'}[type]);
 if(type==='food')renderFood();if(type==='adopt')renderAdopt();if(type==='pair')renderPair();if(type==='house'){houseMode='yard';housePage=0;renderHouse();}
 if(type==='help'){$('panelContent').append(make('p',t('guide'),'panel-copy'));const b=make('button',t('startCaring'));listenPanel(b,'click',()=>{try{localStorage.setItem('weightplay.puppy-haven.intro','1');}catch{}closePanel();});$('panelContent').append(b);}
 if(type==='leave'){$('panelContent').append(make('p',t('saved'),'panel-copy'));for(const [label,fn]of [['continue',closePanel],['leave',()=>{closePanel();visible('stage');}]]){const b=make('button',t(label));listenPanel(b,'click',fn);$('panelContent').append(b);}}
 $('closePanel').focus({preventScroll:true});
}
function closePanel(){panelAbort.abort();panelType='';$('panel').hidden=true;$('battleLive').inert=false;frame.activate('battle');last=performance.now();(focusReturn?.isConnected?focusReturn:$('pairBtn')).focus({preventScroll:true});}
function houseLink(){const b=make('button',t('manageRooms',{n:haven.s.restDogs.length}));b.dataset.openPanel='house';return b;}
function renderHouse(){
 const content=$('panelContent');content.replaceChildren();content.append(make('p',t('houseGuide'),'panel-copy'),make('p',t('roomCapacity',{n:haven.reserved,max:YARD_CAPACITY}),'panel-copy'));
 const tabs=make('nav',undefined,'house-tabs');for(const [mode,key,n]of [['yard','inYard',haven.s.dogs.length],['rest','inHouse',haven.s.restDogs.length]]){const b=make('button',t(key,{n}));b.dataset.houseMode=mode;b.setAttribute('aria-pressed',String(houseMode===mode));tabs.append(b);}content.append(tabs);
 const dogs=houseMode==='yard'?haven.s.dogs:haven.s.restDogs;const pages=Math.max(1,Math.ceil(dogs.length/8));housePage=Math.max(0,Math.min(housePage,pages-1));
 const list=make('div',undefined,'house-list');
 for(const dog of dogs.slice(housePage*8,housePage*8+8)){const row=make('section',undefined,'house-row');const name=make('strong',dogName(dog));const needs=make('small',`${t(dog.age==='puppy'?'puppy':'adult')} · ${t('hunger')} ${Math.floor(dog.hunger)} / ${t('happy')} ${Math.floor(dog.happy)} / ${t('cleanliness')} ${Math.floor(dog.clean)}`);const b=make('button',t(houseMode==='yard'?'moveToHouse':'bringHome'));b.dataset.roomDogId=dog.id;b.dataset.roomAction=houseMode==='yard'?'restDog':'recallDog';b.setAttribute('aria-label',`${b.textContent} · ${dogName(dog)}`);row.append(name,needs,b);list.append(row);}
 if(!dogs.length)list.append(make('p',t('houseEmpty'),'panel-copy'));content.append(list);
 const nav=make('nav',undefined,'house-tabs');const prev=make('button',t('previousPage')),next=make('button',t('nextPage'));prev.dataset.housePage=-1;next.dataset.housePage=1;prev.disabled=housePage===0;next.disabled=housePage===pages-1;nav.append(prev,make('span',`${housePage+1} / ${pages}`),next);content.append(nav);
 const back=make('button',t('backToFamily'));back.dataset.openPanel='pair';content.append(back);
}
function renderFood(){const content=$('panelContent');content.replaceChildren();FOOD.forEach((f,i)=>{const row=make('section',undefined,'food-row');row.append(make('strong',COPY[locale].foodNames[i]),make('small',t('nutrition',{n:f.nutrition,g:f.growth})));const actions=make('div',undefined,'food-actions');const buy=make('button',t('buy',{n:f.price})),use=make('button',t('use',{n:haven.s.food[i]}));buy.dataset.buyGrade=i;use.dataset.feedGrade=i;actions.append(buy,use);row.append(actions);content.append(row);});}
function renderAdopt(){const content=$('panelContent');content.replaceChildren();content.append(houseLink());BREEDS.forEach((b,i)=>{const row=make('section',undefined,'adopt-row');if(yard){const img=make('img');img.src=yard.portrait(b.id);img.alt=COPY[locale].breedNames[i];img.width=72;img.height=72;img.className='breed-portrait';row.append(img);}row.append(make('strong',COPY[locale].breedNames[i]),make('small',t('adoptPrice',{n:b.price})));const actions=make('div',undefined,'food-actions');for(const sex of ['M','F']){const button=make('button',`${sex==='F'?'♀':'♂'} ${t(sex==='F'?'female':'male')} · ${b.price}`);button.dataset.adoptBreed=b.id;button.dataset.sex=sex;actions.append(button);}row.append(actions);content.append(row);});}
function renderPair(){const content=$('panelContent');content.append(houseLink());content.append(make('p',t('pairGuide'),'panel-copy'));for(const [id,sex,key]of [['fatherSelect','M','father'],['motherSelect','F','mother']]){const label=make('label',t(key),'pair-field'),select=make('select');select.id=id;select.append(new Option(t('choose'),''));for(const dog of haven.s.dogs.filter(d=>d.sex===sex))select.append(new Option(`${dogName(dog)} · ${t(dog.age==='puppy'?'puppy':'adult')}${dog.cooldown>0?' · '+t('resting',{n:Math.ceil(dog.cooldown)}):''}`,dog.id));label.append(select);content.append(label);}const reason=make('p','','feedback');reason.id='pairReason';content.append(reason);const button=make('button',t('pairAction'));button.id='confirmPair';content.append(button);const refresh=()=>{const f=haven.s.dogs.find(d=>d.id===Number($('fatherSelect').value)),m=haven.s.dogs.find(d=>d.id===Number($('motherSelect').value));const error=haven.pairReason(f,m);reason.textContent=error?COPY[locale].errors[error]:t('pairAction');};listenPanel($('fatherSelect'),'change',refresh);listenPanel($('motherSelect'),'change',refresh);refresh();}
function showResult(event){panelType='';$('panel').hidden=true;$('resultPanel').hidden=false;$('battleLive').inert=true;frame.activate('battle',{covered:true});$('resultTitle').textContent=MISSIONS[event.stage-1][zh()?'zh':'en'];$('resultReward').textContent=t('reward',{n:event.reward});$('nextBtn').hidden=event.stage===30;sound('result.win');$('nextBtn').hidden?$('retryBtn').focus():$('nextBtn').focus();}
function bind(){
 listen($('startBtn'),'click',()=>visible('stage'));listen($('stageBack'),'click',()=>visible('main'));listen($('missionTab'),'click',()=>selector.refresh(selectedStage));listen($('yardBtn'),'click',()=>start(0));listen($('battleBack'),'click',()=>{if($('resultPanel').hidden)showPanel('leave');else visible('stage');});
 for(const [id,type]of [['foodBtn','food'],['feedBtn','food'],['adoptBtn','adopt'],['pairBtn','pair'],['helpBtn','help']])listen($(id),'click',()=>showPanel(type));
 listen($('petBtn'),'click',()=>{if(!blocked())act('pet');});listen($('cleanBtn'),'click',()=>{if(!blocked())act('clean');});
 listen($('dogRail'),'click',e=>{const b=e.target.closest('[data-dog-id]');if(b&&!blocked()){haven.select(Number(b.dataset.dogId));update();save();}});
 listen($('panelContent'),'click',e=>{const b=e.target.closest('button');if(!b)return;
  if(b.dataset.openPanel){showPanel(b.dataset.openPanel);return;}
  if(b.dataset.houseMode){houseMode=b.dataset.houseMode;housePage=0;renderHouse();$('panelContent').querySelector(`[data-house-mode="${houseMode}"]`).focus();return;}
  if(b.dataset.housePage){housePage+=Number(b.dataset.housePage);renderHouse();$('closePanel').focus();return;}
  if(b.dataset.roomAction){const id=Number(b.dataset.roomDogId);if(b.dataset.roomAction==='restDog')haven.select(id);act(b.dataset.roomAction,{id});return;}
  if(b.dataset.buyGrade!==undefined)act('buy',{grade:Number(b.dataset.buyGrade)});if(b.dataset.feedGrade!==undefined)act('feed',{grade:Number(b.dataset.feedGrade)});if(b.dataset.adoptBreed)act('adopt',{breed:b.dataset.adoptBreed,sex:b.dataset.sex});if(b.id==='confirmPair')act('pair',{father:Number($('fatherSelect').value),mother:Number($('motherSelect').value)});});
 listen($('closePanel'),'click',()=>{if(panelType==='help')try{localStorage.setItem('weightplay.puppy-haven.intro','1');}catch{}closePanel();});
 listen($('reloadBtn'),'click',()=>{save();location.reload();});
 listen($('nextBtn'),'click',()=>start(Math.min(30,haven.s.stage+1)));listen($('retryBtn'),'click',()=>start(haven.s.stage));listen($('resultYard'),'click',()=>start(0));listen($('resultStages'),'click',()=>visible('stage'));
 listen($('localeSelect'),'change',e=>{locale=SUPPORTED.includes(e.target.value)?e.target.value:'en';try{localStorage.setItem('weightPlayLocale',locale);}catch{}window.WonderI18n?.setLocale?.(locale,{navigate:false});copy();window.dispatchEvent(new CustomEvent('wonder:locale-change',{detail:{locale}}));});
 listen(document,'visibilitychange',()=>{last=performance.now();save();audio?.stop();});listen(window,'blur',()=>{if(screen==='battle'&&!blocked())showPanel('leave');});
 listen(document,'keydown',e=>{const modal=!$('panel').hidden?$('panel'):!$('resultPanel').hidden?$('resultPanel'):null;if(!modal)return;if(e.key==='Escape'&&panelType){e.preventDefault();closePanel();}if(e.key==='Tab'){const list=[...modal.querySelectorAll('button,select,a')].filter(n=>!n.hidden&&!n.disabled&&n.getClientRects().length),first=list[0],last=list.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
 listen(window,'pagehide',event=>{save();if(!event.persisted){cancelAnimationFrame(raf);yard?.dispose();selector?.destroy();frame.destroy();audio?.dispose();abort.abort();}});
}
function boot(){
 if(new URLSearchParams(location.search).get('preview')!=='1'){$('gameFrame').hidden=true;$('mainGuide').hidden=true;$('comingSoon').hidden=false;return;}
 window.WonderI18n?.setLocale?.(locale,{navigate:false});
 window.WeightPlayAudio?.preload?.(['ui.click','feedback.error','feedback.success','result.win','reward.coin','reward.unlock','shop.purchase']);
 frame=window.WeightPlayScreenFrame.mount({root:$('gameFrame'),localeSelect:$('localeSelect'),playUI:true,scenes:{main:{root:$('mainScreen'),header:$('mainScreen').querySelector('header'),content:$('mainScreen').querySelector('.main-hero')},stage:{root:$('stageScreen'),header:$('stageScreen').querySelector('header'),content:$('stageWorkspace')},battle:{root:$('battleScreen'),header:$('battleScreen').querySelector('header'),content:$('battleLive')}}});
 const coins=make('span');coins.id='coinStat';const count=make('span');count.id='dogStat';frame.battleTopUI.add(window.WeightPlayScreenFrame.createGroup().add(coins).add(count));const stageStat=make('span');stageStat.id='stageStat';frame.stageTopUI.add(stageStat);
 selector=window.WeightPlayPlayUI.mountStage({page:$('stageWorkspace'),rail:$('stageRail'),selected:selectedStage,config:{count:30,poster:'/games/puppy-haven/assets/cover-block-v1.png',stage(i){const m=MISSIONS[i];return {id:m.id,kicker:t('stage',{n:m.id}),title:m[zh()?'zh':'en'],subtitle:m[zh()?'goalZh':'goalEn'],summary:m[zh()?'goalZh':'goalEn'],details:[m[zh()?'goalZh':'goalEn'],t('reward',{n:m.reward})],status:t(m.id>haven.s.unlocked?'locked':haven.s.cleared.includes(m.id)?'cleared':'ready'),locked:m.id>haven.s.unlocked,cleared:haven.s.cleared.includes(m.id)};}},isActive:()=>screen==='stage',onSelect(i){selectedStage=i;update();},onStart(i){start(i+1);}});
 bind();copy();visible('main');window.PuppyHaven=Object.freeze({snapshot:()=>structuredClone(haven.s),renderStats:()=>yard?.stats()||null});
}
boot();
