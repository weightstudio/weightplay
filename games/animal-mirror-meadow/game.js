import {LEVELS,trace,solve,normalizeSave} from './meadow-engine.js';
import {COPY,RULES,NAMES,LOCALE_NAMES} from './meadow-copy.js';
import {Meadow3D} from './meadow-3d.js';

const $=id=>document.getElementById(id),SAVE='weightplay-mirror-meadow-v4';
const routes={en:'en','zh-tw':'zh-Hant','zh-cn':'zh-Hans',ja:'ja',ko:'ko',es:'es','pt-br':'pt-BR',fr:'fr',de:'de',it:'it',ru:'ru',hi:'hi',ar:'ar'};
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}};
let storedLocale='en';try{storedLocale=localStorage.getItem('weightPlayLocale')||'en';}catch{}
let locale=routes[location.pathname.split('/')[1]]||new URLSearchParams(location.search).get('locale')||storedLocale;
if(!COPY[locale])locale='en';
let save=normalizeSave(read(SAVE,{})),sound=read('mirror-meadow-sound',true)!==false;
let scene='main',index=0,angles=[],history=[],moves=0,result=null,view=null,railInstalled=false,modal=null,focusReturn=null,audio=null;
let lastStats={geometries:0,textures:0,renderers:0};
const t=k=>COPY[locale][k];
const name=i=>NAMES[locale]?.[i]||`${t('stages')} ${i+1}`;
const persist=()=>{try{localStorage.setItem(SAVE,JSON.stringify(save));$('saveWarning').hidden=true;}catch{$('saveWarning').hidden=false;}};
const progress=()=>`${t('stages')} ${save.unlocked} / ${LEVELS.length}`;
const sources=LEVELS.map((_,i)=>{const b=document.createElement('button');b.dataset.stageIndex=i;b.type='button';return b;});

function fit(){
  if(scene==='main')return;
  const r=$('playEnvelope').getBoundingClientRect(),scale=Math.min(r.width/390,r.height/640);
  if(!scale)return;
  for(const id of ['stageScreen','battleScreen']){const s=$(id).style;s.setProperty('--scale',scale);s.setProperty('--lw',`${r.width/scale}px`);s.setProperty('--lh',`${r.height/scale}px`);}
  view?.resize();positionLabels();
}
function releaseView(){if(view){view.dispose();lastStats=view.stats();view=null;}audio?.close().catch(()=>{});audio=null;}
function setScene(next){
  closeSettings();closeDialog();if(next!=='battle')releaseView();scene=next;
  document.body.dataset.screen=next;
  $('mainGroup').hidden=next!=='main';$('playEnvelope').hidden=next==='main';$('reserve').hidden=next==='main';
  $('stageScreen').hidden=next!=='stage';$('battleScreen').hidden=next!=='battle';
  $('stageScreen').inert=next!=='stage';$('battleScreen').inert=next!=='battle';
  window.scrollTo(0,0);fit();
}
function showStages(){
  setScene('stage');$('stageProgress').textContent=progress();
  sources.forEach((b,i)=>{
    const locked=i>=save.unlocked,cleared=!!save.best[i];
    b.className=`stage-card${cleared?' cleared':''}`;b.dataset.wpStageSourceClass=b.className;
    b.dataset.wpStageRecommended=String(i===save.unlocked-1);b.setAttribute('aria-disabled',String(locked));
    b.innerHTML='';const title=document.createElement('strong'),goal=document.createElement('small'),status=document.createElement('small');
    title.textContent=`${i+1} · ${name(i)}`;goal.textContent=`${t('targets')} ${LEVELS[i].targets.length}`;
    status.textContent=locked?t('locked'):cleared?`✓ ${t('moves')} ${save.best[i]}`:t('ready');
    b.append(title,goal,status);
  });
  $('stageRail').replaceChildren(...sources);
  if(!railInstalled){window.WeightPlayStageV6.install($('stageRail'),{total:LEVELS.length,poolSize:9,cardSelector:'.stage-card',index:b=>+b.dataset.stageIndex,activate:i=>{if(i<save.unlocked)startLevel(i);}});railInstalled=true;}
  $('stageBack').focus({preventScroll:true});
}
function copy(){
  document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';document.title=`${t('title')} | WeightPlay`;
  document.querySelectorAll('[data-copy]').forEach(el=>el.textContent=t(el.dataset.copy));
  $('mainProgress').textContent=progress();$('locale').value=locale;
  $('guideSteps').replaceChildren(...RULES[locale].map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
  document.querySelector('.poster img').alt=t('title');
  document.querySelector('.lobby-return').setAttribute('aria-label',`WeightPlay ←`);
  document.querySelector('.lobby-return').href=`/${Object.keys(routes).find(k=>routes[k]===locale)||'en'}/`;
  document.querySelectorAll('[data-settings]').forEach(b=>b.setAttribute('aria-label',t('settings')));
  $('stageBack').setAttribute('aria-label',t('title'));$('battleBack').setAttribute('aria-label',t('stages'));
  $('helpButton').setAttribute('aria-label',t('guide'));$('meadowCanvas').setAttribute('aria-label',t('pitch'));
  $('soundButton').setAttribute('aria-label',t('sound'));$('soundButton').setAttribute('aria-checked',String(sound));$('soundButton').textContent=sound?'●':'○';
  if(scene==='stage')showStages();
}
function chirp(won=false){
  if(!sound)return;
  try{audio ||= new (window.AudioContext||window.webkitAudioContext)();audio.resume().catch(()=>{});const o=audio.createOscillator(),g=audio.createGain();o.connect(g);g.connect(audio.destination);o.frequency.setValueAtTime(won?660:420,audio.currentTime);g.gain.setValueAtTime(.045,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.17);o.start();o.stop(audio.currentTime+.18);o.onended=()=>{o.disconnect();g.disconnect();};}catch{}
}
function startLevel(i){
  if(!Number.isInteger(i)||i<0||i>=save.unlocked||i>=LEVELS.length)return;
  releaseView();index=i;angles=LEVELS[i].mirrors.map(p=>p.initial);moves=0;history=[];
  setScene('battle');$('levelTitle').textContent=`${i+1} / ${LEVELS.length} · ${name(i)}`;
  createView();
}
function createView(){
  const old=$('meadowCanvas'),canvas=old.cloneNode(false);old.replaceWith(canvas);
  let ownedView=null;
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();if(view===ownedView&&ownedView&&!ownedView.disposed&&scene==='battle')showError();});
  canvas.addEventListener('pointerup',e=>{if(view!==ownedView||modal)return;const hit=ownedView?.pick(e.clientX,e.clientY);if(hit>=0)turn(hit);});
  try{view=new Meadow3D(canvas);ownedView=view;view.build(LEVELS[index]);buildLabels();fit();update();$('battleBack').focus({preventScroll:true});}
  catch(error){console.warn('Mirror Meadow renderer unavailable',error);releaseView();showError();}
}
function label(text,x,y,cls,height=.8){const el=document.createElement('span');el.className=`piece-label ${cls}`;el.textContent=text;el.dataset.x=x;el.dataset.y=y;el.dataset.height=height;$('pieceLabels').append(el);return el;}
function buildLabels(){
  const l=LEVELS[index];$('pieceLabels').replaceChildren();
  l.mirrors.forEach((m,i)=>{const b=document.createElement('button');b.type='button';b.className=`mirror-hit${l.prisms.includes(i)?' prism':''}`;b.dataset.mirror=i;b.dataset.x=m.x;b.dataset.y=m.y;b.dataset.height=-.65;b.textContent=i+1;b.setAttribute('aria-label',`${l.prisms.includes(i)?t('splitter'):t('rotate')} ${i+1}`);b.onclick=()=>turn(i);$('pieceLabels').append(b);});
  l.targets.forEach(([x,y],i)=>{const el=label(`◇ ${i+1}`,x,y,'target',.95);el.dataset.target=i;});
  label(t('light'),l.source[0],l.source[1],'source',.8);
  l.gates.forEach((pair,p)=>pair.forEach(([x,y])=>label(`↔ ${p+1}`,x,y,'portal',.42)));
  $('legend').textContent=`／ ${t('rotate')}   ◇ ${t('targets')}${l.prisms.length?`   ◆ ${t('splitter')}`:''}${l.gates.length?`   ↔ ${t('portal')}`:''}`;
}
function positionLabels(){if(!view)return;$('pieceLabels').querySelectorAll('[data-x]').forEach(el=>{const p=view.point(+el.dataset.x,+el.dataset.y,+el.dataset.height);el.style.left=`${p.x*100}%`;el.style.top=`${p.y*100}%`;});}
function update(){
  result=trace(LEVELS[index],angles);view?.update(angles,result);positionLabels();
  $('targetCount').textContent=`${t('targets')} ${result.lit.length} / ${LEVELS[index].targets.length}`;
  $('moveCount').textContent=`${t('moves')} ${moves}`;$('undoButton').disabled=!history.length;
  $('finishButton').disabled=!result.won;$('hintButton').disabled=result.won;
  $('instruction').textContent=result.won?t('clear'):t('ready');
  $('pieceLabels').querySelectorAll('[data-target]').forEach(el=>{const lit=result.lit.includes(+el.dataset.target);el.classList.toggle('lit',lit);el.textContent=`${lit?'✓':'◇'} ${+el.dataset.target+1}`;});
  $('pieceLabels').querySelectorAll('[data-mirror]').forEach(el=>{const i=+el.dataset.mirror;el.textContent=`${i+1}${angles[i]?'＼':'／'}`;el.setAttribute('aria-label',`${LEVELS[index].prisms.includes(i)?t('splitter'):t('rotate')} ${i+1} ${angles[i]?'＼':'／'}`);el.classList.remove('hinted');});
}
function turn(i){if(scene!=='battle'||modal||!view)return;history.push([...angles]);if(history.length>256)history.shift();angles[i]^=1;moves++;update();chirp(result.won);}
function closeDialog(){if(!modal)return;$('overlay').hidden=true;$('battleLive').inert=false;modal=null;focusReturn?.focus({preventScroll:true});focusReturn=null;}
function dialog(kind,title,body,actions){
  focusReturn=document.activeElement;modal=kind;$('dialogTitle').textContent=title;$('dialogCopy').textContent=body;$('dialogActions').replaceChildren();
  actions.forEach(({text,run,disabled=false,primary=false},i)=>{const b=document.createElement('button');b.textContent=text;b.disabled=disabled;if(primary)b.className='primary';b.dataset.action=i;b.onclick=run;$('dialogActions').append(b);});
  $('dialogActions').style.gridTemplateColumns=`repeat(${actions.length},minmax(0,1fr))`;
  $('battleLive').inert=true;$('overlay').hidden=false;
  document.querySelector('#overlay .dialog').focus({preventScroll:true});
}
function settle(){
  if(!result?.won||modal)return;
  save.best[index]=Math.min(save.best[index]||Infinity,Math.max(1,moves));save.unlocked=Math.max(save.unlocked,Math.min(LEVELS.length,index+2));persist();
  dialog('result',t('clear'),`${name(index)}\n${t('targets')} ${result.lit.length}/${LEVELS[index].targets.length} · ${t('moves')} ${moves}${index===LEVELS.length-1?`\n${t('finished')}`:''}`,[
    {text:t('stages'),run:showStages},{text:t('next'),run:()=>startLevel(index+1),disabled:index===LEVELS.length-1,primary:true},{text:t('retry'),run:()=>startLevel(index)},
  ]);
}
function showError(){dialog('error',t('error'),'', [{text:t('retry'),run:()=>startLevel(index),primary:true},{text:t('stages'),run:showStages}]);}
function closeSettings(){const open=!$('settingsPanel').hidden;$('settingsPanel').hidden=true;document.querySelectorAll('[data-settings]').forEach(b=>{if(open&&b.getAttribute('aria-expanded')==='true')b.focus({preventScroll:true});b.setAttribute('aria-expanded','false');});}
$('startButton').onclick=showStages;$('stageBack').onclick=()=>{setScene('main');copy();$('startButton').focus();};
$('battleBack').onclick=()=>dialog('leave',t('leave'),`${name(index)}\n${t('leaveText')}`,[{text:t('continue'),run:closeDialog,primary:true},{text:t('leave'),run:showStages}]);
$('helpButton').onclick=()=>dialog('help',t('guide'),RULES[locale].join('\n\n'),[{text:t('continue'),run:closeDialog,primary:true}]);
$('undoButton').onclick=()=>{if(history.length&&!modal){angles=history.pop();moves=Math.max(0,moves-1);update();}};
$('hintButton').onclick=()=>{if(modal)return;const solution=solve(LEVELS[index],angles),i=solution?.findIndex((v,j)=>v!==angles[j]);if(i>=0){const b=$('pieceLabels').querySelector(`[data-mirror="${i}"]`);b.classList.add('hinted');$('instruction').textContent=`${t('hint')} · ${t('rotate')} ${i+1} → ${solution[i]?'＼':'／'}`;}};
$('resetButton').onclick=()=>{if(modal)return;history=[];angles=LEVELS[index].mirrors.map(m=>m.initial);moves=0;update();};$('finishButton').onclick=settle;
Object.entries(LOCALE_NAMES).forEach(([value,text])=>{const option=new Option(text,value);$('locale').add(option);});
$('locale').onchange=()=>{locale=$('locale').value;try{localStorage.setItem('weightPlayLocale',locale);}catch{}copy();};
$('soundButton').onclick=()=>{sound=!sound;try{localStorage.setItem('mirror-meadow-sound',JSON.stringify(sound));}catch{}copy();if(!sound){audio?.close().catch(()=>{});audio=null;}};
document.querySelectorAll('[data-settings]').forEach(b=>b.onclick=()=>{const was=b.getAttribute('aria-expanded')==='true';closeSettings();if(was)return;const r=b.getBoundingClientRect();$('settingsPanel').style.left=`${Math.max(8,Math.min(innerWidth-288,r.right-280))}px`;$('settingsPanel').style.top=`${r.bottom+8}px`;$('languageRow').hidden=scene!=='main';$('settingsPanel').hidden=false;b.setAttribute('aria-expanded','true');});
document.addEventListener('pointerdown',e=>{if(!e.target.closest('.settings-panel,[data-settings]'))closeSettings();});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){if(modal==='help'||modal==='leave')closeDialog();else closeSettings();}
  if(e.key==='Tab'&&modal){const bs=[...$('dialogActions').querySelectorAll('button:not(:disabled)')],first=bs[0],last=bs.at(-1);if(e.shiftKey&&(document.activeElement===first||!bs.includes(document.activeElement))){e.preventDefault();last.focus();}else if(!e.shiftKey&&(document.activeElement===last||!bs.includes(document.activeElement))){e.preventDefault();first.focus();}}
});
window.addEventListener('resize',fit);window.visualViewport?.addEventListener('resize',fit);
document.addEventListener('visibilitychange',()=>{if(document.hidden)audio?.suspend().catch(()=>{});else view?.render();});
window.addEventListener('pagehide',releaseView);
window.addEventListener('pageshow',e=>{if(e.persisted&&scene==='battle'&&!view)createView();});
// Read-only, bounded evidence snapshot. It cannot unlock stages or write outcomes.
window.mirrorMeadowSnapshot=()=>({version:'v4',scene,index,moves,angles:[...angles],result:result&&structuredClone(result),save:structuredClone(save),modal,mirrorPoints:view?LEVELS[index].mirrors.map(m=>view.point(m.x,m.y,.3)):[],resources:view?.stats()||lastStats});
copy();
