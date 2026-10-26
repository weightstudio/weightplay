import {DATA,COUNTRY_BY_ID,THEMES,SAVE_KEY,createStore,newLife,advanceLife,settle,readLegacy} from './life-model.mjs';
import {COPY,LOCALES,ROUTES,normalizeLocale,format,SOURCE_LINKS} from './life-copy.mjs';
import {ENV,LOCAL_SOURCES,eventMetric,environmentFacts} from './life-environment.mjs';
const $=id=>document.getElementById(id),route=location.pathname.split('/').filter(Boolean)[0];
let locale=normalizeLocale(ROUTES.includes(route)?route:document.documentElement.lang),c=COPY[locale];
let store,save,legacy,frame,timer,busy=false,paused=false,fatal=false,dialogReturn,dialogKind=null,lastEvents='',lastResult='';
const run=()=>save?.run;
const text=(key,args)=>format(c[key],args);
const number=(n,d=0)=>new Intl.NumberFormat(locale,{maximumFractionDigits:d}).format(n);
const percent=n=>new Intl.NumberFormat(locale,{style:'percent',maximumFractionDigits:n<.0001?6:2}).format(n);
const place=country=>{try{return new Intl.DisplayNames([locale],{type:'region'}).of(country.iso2)||country.name;}catch{return country.name;}};
const age=n=>n===0?c.underOne:text('age',{n:number(n)});
const sound=id=>{try{window.WeightPlayAudio?.play(id);}catch{}};
const node=(tag,value,cls)=>{const e=document.createElement(tag);if(value!==undefined)e.textContent=value;if(cls)e.className=cls;return e;};
const button=(label,fn,cls)=>{const b=node('button',label,cls);b.type='button';b.addEventListener('click',fn);return b;};
const settingsOpen=()=>!!document.querySelector('[data-wp-frame-scene="battle"] [data-wp-settings][aria-expanded="true"]');
const blocked=()=>fatal||busy||paused||document.hidden||$('choiceDialog').open||settingsOpen()||frame?.active!=='battle'||!run()||run().finished;
function stop(){clearTimeout(timer);timer=null;}
function schedule(delay=520){stop();if(!blocked())timer=setTimeout(tick,delay/save.speed);}
async function transact(update){
 if(busy||fatal)return false;busy=true;
 try{save=await store.transact(update);return true;}
 catch(e){fail(e);return false;}finally{busy=false;}
}
function fail(error){
 stop();paused=true;const key=error?.message||error;fatal=['otherTab','saveCorrupt','lockUnavailable'].includes(key);
 const message=c[key]||c.saveFailed;$('statusMessage').textContent=message;
 dialog(message,node('p',message),[{label:c.retry,run:()=>location.reload(),primary:true},{label:c.close,run:closeDialog}]);
 if(save)renderControls();
}
async function tick(){
 timer=null;if(blocked())return;
 const previous=run(),id=previous.id,events=previous.events.length;
 const ok=await transact(s=>{if(s.run?.id!==id)throw Error('otherTab');s.run=advanceLife(s.run);return settle(s);});
 if(!ok)return;renderBattle();syncMain();
 if(run().finished){sound('ui.open');$('againBtn').focus({preventScroll:true});return;}
 const added=run().events.length>events;
 if(added)sound('ui.tick');
 schedule(added?2600:520);
}
function copyStatic(){
 document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';
 document.querySelectorAll('[data-copy]').forEach(e=>{if(typeof c[e.dataset.copy]==='string')e.textContent=c[e.dataset.copy];});
 document.querySelectorAll('[data-copy-aria]').forEach(e=>e.setAttribute('aria-label',c[e.dataset.copyAria]));
 $('mainPoster').alt=c.title;$('localeSelect').replaceChildren(...LOCALES.map(l=>new Option(window.WonderI18n?.localeLabels?.[l]||l,l)));$('localeSelect').value=locale;
 document.title=c.title+' | WeightPlay';
}
function syncMain(){
 $('mainProgress').textContent=text('stats',{n:number(save.total),places:number(Object.keys(save.countryCounts).length)});
 $('startBtn').textContent=run()&&!run().finished?c.continue:c.start;$('startBtn').disabled=fatal;
 document.body.dataset.journalTheme=THEMES.some(x=>x.id===save.theme&&owns(x.id))?save.theme:'default';
}
function showScreen(name){
 stop();$('mainGroup').hidden=name!=='main';$('mainScreen').hidden=name!=='main';$('battleScreen').hidden=name!=='battle';frame.activate(name);document.body.dataset.screen=name;
}
async function start(fresh=false){
 if(busy||fatal)return;
 if(fresh||!run()||run().finished){const seed=crypto.getRandomValues(new Uint32Array(1))[0],id=crypto.randomUUID();if(!await transact(s=>{s.run=newLife(seed,id);return s;}))return;}
 closeDialog();paused=false;lastEvents='';lastResult='';showScreen('battle');renderBattle();sound('game.start');$('pauseBtn').focus({preventScroll:true});schedule(3400);
}
function narrative(event,r){
 const country=COUNTRY_BY_ID.get(r.country);
 if(event.key==='birth')return text('born',{country:place(country)})+' '+c.contextLines[r.home.urban===null?2:r.home.urban?0:1];
 if(event.kind==='story')return c.stories[event.key];
 if(event.kind==='environment')return event.key.startsWith('local')?c.localStories[r.country+'_'+event.key.slice(-1)]:c.environmentStories[event.key];
 const indices={water:3,sanitation:5,electricity:7,urban:9};return c.contextLines[indices[event.key]+(r.home[event.key]?0:1)];
}
function contextFact(event,r){
 const country=COUNTRY_BY_ID.get(r.country);
 if(event.kind==='environment'){
  if(event.key.startsWith('local'))return c.localScene;
  const key=eventMetric(event,r),fact=environmentFacts(country)[key];
  if(!fact||!Number.isFinite(fact.value))return null;
  return c[key+'Label']+' · '+factValue(key,fact.value)+' · '+fact.year;
 }
 if(event.kind!=='context')return null;
 return c.contextLines[{urban:11,water:12,sanitation:13,electricity:14}[event.key]]+' · '+percent(country.facts[event.key]/100)+' · '+DATA.year;
}
function entry(event,r){
 const item=node('li',undefined,'life-entry');item.dataset.event=event.key;item.append(node('span',age(event.age),'entry-age'),node('p',narrative(event,r)));
 const fact=contextFact(event,r);if(fact)item.append(node('small',fact,'fact-line'));return item;
}
function renderControls(){
 $('pauseBtn').textContent=paused?c.resume:c.pause;$('pauseBtn').setAttribute('aria-pressed',String(paused));$('pauseBtn').disabled=fatal;
 $('speedBtn').textContent=c.speed+' '+save.speed+'×';$('speedBtn').setAttribute('aria-label',c.speed+' '+save.speed+'×');
 $('playState').textContent=run()?.finished?text('reference',{year:DATA.year}):paused?c.reading:c.live;
 $('liveControls').hidden=!!run()?.finished;$('resultActions').hidden=!run()?.finished;
}
function renderBattle(){
 const r=run();if(!r)return;const country=COUNTRY_BY_ID.get(r.country);
 $('birthCountry').textContent=place(country);$('birthOdds').textContent=text('odds',{p:percent(country.pop/DATA.population)});
 $('lifeAge').textContent=age(r.age);$('lifeAge').dataset.age=String(r.age);
 $('hudCountry').textContent=place(country);$('hudAge').textContent=age(r.age);
 $('referenceLabel').textContent=text('reference',{year:DATA.year});renderControls();
 const key=r.id+':'+r.events.length+':'+locale;
 if(lastEvents!==key){lastEvents=key;$('lifeLog').replaceChildren(...r.events.map(e=>entry(e,r)));$('journalScroll').scrollTop=$('journalScroll').scrollHeight;$('storyAnnouncement').textContent=narrative(r.events.at(-1),r);}
 $('lifeLayout').classList.toggle('is-finished',r.finished);$('resultSummary').hidden=!r.finished;
 if(r.finished&&lastResult!==r.id+locale){
  lastResult=r.id+locale;const cause=c.causes[DATA.causeKeys.indexOf(r.cause)];
  $('resultTitle').textContent=c.result;$('deathCause').textContent=cause;$('causeSource').textContent=c[country.causeSource];
  $('countryFacts').replaceChildren(node('p',text('expectancy',{n:number(country.e0,1)})),node('p',text('under5',{p:percent(country.u5)})),node('small',text('reference',{year:DATA.year})));
  $('storyAnnouncement').textContent=age(r.age)+' · '+cause;$('journalScroll').scrollTop=0;
 }
}
function closeDialog(){
 if(!$('choiceDialog').open)return;$('choiceDialog').close();dialogKind=null;
 if(dialogReturn?.isConnected&&!dialogReturn.closest('[hidden]'))dialogReturn.focus({preventScroll:true});schedule(2200);
}
function dialog(title,body,actions=[{label:c.close,run:closeDialog}],kind=null){
 stop();if(!$('choiceDialog').open)dialogReturn=document.activeElement;
 dialogKind=kind;$('dialogTitle').textContent=title;$('dialogBody').replaceChildren(body);
 $('dialogActions').replaceChildren(...actions.map(a=>button(a.label,async()=>{if(!busy)await a.run();},a.primary?'primary':'')));
 if(!$('choiceDialog').open)$('choiceDialog').showModal();$('dialogActions').querySelector('button')?.focus({preventScroll:true});
}
function factValue(key,value){const valueText=key==='health'?text('indexValue',{n:number(value,1)}):percent(value/100);return '\u2066'+valueText+'\u2069';}
function showSources(){
 const body=node('div'),country=run()?COUNTRY_BY_ID.get(run().country):null;
 body.append(node('p',c.environmentNote));
 if(country){
  body.append(node('h3',place(country)),node('p',c.nationalContext));
  const facts=environmentFacts(country),list=node('dl',undefined,'environment-facts');let missing=false;
  for(const key of ['urban','water','sanitation','electricity','cooking','internet','education','agriculture','industry','services','health']){
   const f=facts[key];if(!f||!Number.isFinite(f.value)){missing=true;continue;}
   const term=node('dt',c[key+'Label']),value=node('dd',factValue(key,f.value)+' · '+f.year);value.dataset.metric=key;list.append(term,value);
  }
  body.append(list);if(missing)body.append(node('p',c.missingEnvironment,'muted'));
  if(facts.education)body.append(node('p',c.educationCaveat,'muted'));
  if(LOCAL_SOURCES[country.iso3]){const p=node('p',c.localScene+' '),a=node('a',c.localSource);a.href=LOCAL_SOURCES[country.iso3];a.target='_blank';a.rel='noopener noreferrer';p.append(a);body.append(p);}
 }
 [c.howText,c.model,c.causeModel,c.fiction,c.inspirationNote].forEach(p=>body.append(node('p',p)));
 const list=node('ul');for(const [i,[label,url]]of SOURCE_LINKS.entries()){const li=node('li'),a=node('a',c[['sourceUN','sourceWHO','sourceWB'][i]]);a.href=url;a.target='_blank';a.rel='noopener noreferrer';li.append(a);list.append(li);}
 for(const[key,{url}]of Object.entries(ENV.indicators)){const li=node('li'),a=node('a',c[key+'Label']);a.href=url;a.target='_blank';a.rel='noopener noreferrer';li.append(a);list.append(li);}
 body.append(list);dialog(c.environment,body,undefined,'sources');
}
function showHistory(){
 const body=node('div');body.append(node('p',text('stats',{n:number(save.total),places:number(Object.keys(save.countryCounts).length)})),node('p',c.historyLimit,'muted'));
 if(!save.history.length)body.append(node('p',c.empty));
 for(const r of save.history){const country=COUNTRY_BY_ID.get(r.country),b=button(place(country)+' · '+age(r.age)+' · '+c.causes[DATA.causeKeys.indexOf(r.cause)],()=>showRecord(r),'history-row');body.append(b);}
 if(legacy)body.append(button(c.legacy,showLegacy,'history-row'));
 body.append(button(c.themes,showThemes,'history-row'),button(c.environmentButton,showSources,'history-row'));dialog(c.history,body,undefined,'history');
}
function showRecord(r){const body=node('div'),list=node('ol',undefined,'life-log');list.append(...r.events.map(e=>entry(e,r)));body.append(node('p',c.causes[DATA.causeKeys.indexOf(r.cause)]),list);dialog(place(COUNTRY_BY_ID.get(r.country))+' · '+age(r.age),body,[{label:c.history,run:showHistory},{label:c.close,run:closeDialog}],'record');}
async function showLegacy(){
 const body=node('div');body.append(node('p',c.legacyNote));
 dialog(c.legacy,body,[{label:c.history,run:showHistory},{label:c.close,run:closeDialog}],'legacy');
 if(legacy.corrupt){body.append(node('p',c.saveCorrupt));return;}
 try{
  const [{CATALOGS},{STAGES}]=await Promise.all([import('./i18n.mjs'),import('./content.mjs')]);
  if(dialogKind!=='legacy')return;const old=CATALOGS[locale];
  for(const [id,page]of Object.entries(legacy.album)){
   const index=STAGES.findIndex(s=>s.id===id),section=node('section',undefined,'legacy-record');section.append(node('h3',old.chapters[index]||id));
   if(index>=0)section.append(node('p',old.items[index]+' · '+(page.wish?old.wishDone:old.ordinary)));
   for(const r of page.runs||[]){section.append(node('h4',r.name||''));if(Array.isArray(r.names))section.append(node('p',r.names.join(' · ')));
    for(const echo of r.echoes||[]){const name=r.names?.[{A:1,B:2,C:3}[echo.target]]||'',label=old.action[echo.choice];if(label)section.append(node('p',format(label,{name})));}
   }body.append(section);
  }
  if(!Object.keys(legacy.album).length)body.append(node('p',c.empty));
 }catch{body.append(node('p',c.saveCorrupt));}
}
function owns(id){return window.WeightPlayWallet?.owns('smallwood-lives:'+id)===true;}
function showThemes(){
 const body=node('div');body.append(node('p',c.themeNote));const balance=node('p',text('balance',{n:number(window.WeightPlayWallet?.read().diamonds||0)}),'wallet-balance'),icon=node('img');icon.src='/assets/weightplay-diamond.svg';icon.alt='';balance.prepend(icon);body.append(balance);
 body.append(button(c.defaultTheme+(save.theme===null?' ✓':''),()=>selectTheme(null),'history-row'));
 THEMES.forEach((item,i)=>{const row=node('div',undefined,'theme-row '+item.id),label=node('span',c['theme'+i]),b=button(owns(item.id)?(save.theme===item.id?c.owned+' ✓':c.use):c.buy+' · '+text('price',{n:item.cost}),()=>purchase(item));row.append(label,b);body.append(row);});
 dialog(c.themes,body,[{label:c.history,run:showHistory},{label:c.close,run:closeDialog}],'themes');
}
async function selectTheme(id){if(await transact(s=>{s.theme=id;return s;})){syncMain();if($('choiceDialog').open&&dialogKind==='themes')showThemes();}}
async function purchase(item){
 if(busy||fatal)return;if(owns(item.id)){await selectTheme(item.id);return;}
 busy=true;let result;try{result=await window.WeightPlayWallet.purchasePermanent('smallwood-lives:'+item.id,item.cost);}catch{result={ok:false};}finally{busy=false;}
 if(!result?.ok){sound('feedback.error');const message=result?.reason==='insufficient'?c.insufficient:c.purchaseError;if(!$('choiceDialog').open||dialogKind!=='themes'){$('statusMessage').textContent=message;return;}dialog(c.themes,node('p',message),[{label:c.themes,run:showThemes},{label:c.close,run:closeDialog}]);return;}
 sound('shop.purchase');await selectTheme(item.id);
}
function goMain(){closeDialog();showScreen('main');syncMain();$('startBtn').focus({preventScroll:true});}
function back(){
 if(run()?.finished){goMain();return;}
 dialog(c.leaveTitle,node('p',c.leaveCopy),[{label:c.continue,run:closeDialog,primary:true},{label:c.main,run:goMain}],'leave');
}
async function boot(){
 copyStatic();store=createStore(localStorage);save=store.load();legacy=readLegacy(localStorage);
 frame=window.WeightPlayScreenFrame.mountSlots({root:$('gameFrame'),main:$('mainScreen'),battle:{root:$('battleScreen'),headerInfo:$('battleHud')}});
 for(const id of ['startBtn','pauseBtn','speedBtn','hudCountry','hudAge'])$(id).dataset.runtimeLocalize='off';
 $('startBtn').addEventListener('click',()=>start());$('againBtn').addEventListener('click',()=>start(true));$('battleBack').addEventListener('click',back);$('homeBtn').addEventListener('click',goMain);
 $('pauseBtn').addEventListener('click',()=>{paused=!paused;renderControls();if(paused)stop();else{$('journalScroll').scrollTop=$('journalScroll').scrollHeight;schedule(2200);}});
 $('speedBtn').addEventListener('click',async()=>{stop();if(await transact(s=>{s.speed=s.speed===1?2:s.speed===2?4:1;return s;})){renderControls();schedule(2200);}});
 for(const id of ['historyBtn','resultHistoryBtn'])$(id).addEventListener('click',showHistory);$('sourcesBtn').addEventListener('click',showSources);
 $('journalScroll').addEventListener('wheel',event=>{if(event.deltaY<0&&!paused&&!run()?.finished){paused=true;stop();renderControls();}},{passive:true});
 $('journalScroll').addEventListener('touchstart',()=>{if(!paused&&!run()?.finished){paused=true;stop();renderControls();}},{passive:true});
 $('choiceDialog').addEventListener('cancel',event=>{event.preventDefault();closeDialog();});
 document.addEventListener('visibilitychange',()=>{stop();if(!document.hidden)schedule(2200);});
 window.addEventListener('weightplay:interaction-state',()=>{stop();if(!settingsOpen())schedule(2200);});
 window.addEventListener('storage',event=>{if(event.key!==SAVE_KEY||!save)return;try{if(JSON.parse(event.newValue||'null')?.revision!==save.revision)fail('otherTab');}catch{fail('otherTab');}});
 window.addEventListener('pagehide',stop);
 window.addEventListener('wonder:locale-change',()=>{
  const next=normalizeLocale(window.WonderI18n?.locale?.()||document.documentElement.lang);if(next===locale)return;
  stop();locale=next;c=COPY[locale];copyStatic();syncMain();if(run())renderBattle();frame.refresh();
  if($('choiceDialog').open){const kind=dialogKind;if(kind==='sources')showSources();else if(kind==='themes')showThemes();else if(kind==='leave')back();else showHistory();}
  schedule(2200);
 });
 syncMain();showScreen('main');await $('mainPoster').decode();$('startBtn').disabled=false;window.WeightPlayGameEntryLoader?.ready();
}
boot().catch(error=>{fatal=true;stop();$('mainError').hidden=false;$('mainError').textContent=c[error?.message]||c.saveFailed;window.WeightPlayGameEntryLoader?.fail($('mainError').textContent,()=>location.reload());console.error('Life initialization:',error);});
