import {STAGES,SAVE_KEY,LEGACY_KEY,POSTER,RUX,ACORN,COIN,priceAt,available,totals,checkBid,starsFor,normalizeSave,unlocked,settle,purchaseMoon} from './market-model.mjs';
import {COPY,ARC,BACK,NAMES} from './market-copy.mjs';
import {MarketScene} from './market-scene.mjs';
import {guideHTML} from './market-guide.mjs';

const $=id=>document.getElementById(id);
const routes={en:'en','zh-tw':'zh-Hant','zh-cn':'zh-Hans',ja:'ja',ko:'ko',es:'es','pt-br':'pt-BR',fr:'fr',de:'de',it:'it',ru:'ru',hi:'hi',ar:'ar'};
const read=key=>{try{return localStorage.getItem(key);}catch{return null;}};
const parse=value=>{try{return JSON.parse(value);}catch{return null;}};
let locale=routes[location.pathname.split('/')[1]]||read('weightplay-acorn-auction-locale')||'en';if(!COPY[locale])locale='en';
let save=normalizeSave(parse(read(SAVE_KEY)),Number(read(LEGACY_KEY)));
let stageUI=null,scene=null,roundIndex=unlocked(save)-1,phase='main',selected=[],bell=0,mistakes=0,paused=false,saveFailed=false,result=null,message='';
const text=(key,vars={})=>Object.entries(vars).reduce((s,[k,v])=>s.replaceAll(`{${k}}`,String(v)),COPY[locale][key]||key);
const sound=id=>window.WeightPlayAudio?.play?.(id);
const contract=s=>text('contract',{n:s.id});
const title=s=>locale==='en'?s.name:locale==='zh-Hant'?s.zh:NAMES[locale][s.id-1];
const count=()=>Object.keys(save.cleared).length;
const starCount=()=>Object.values(save.cleared).reduce((a,b)=>a+b,0);
const put=(id,value)=>{const e=$(id);if(e&&e.textContent!==String(value))e.textContent=value;};
const icon=(src,label)=>`<img src="${src}" alt="${label}" width="24" height="24">`;
function persist(next){save=next;try{localStorage.setItem(SAVE_KEY,JSON.stringify(save));saveFailed=false;return true;}catch{saveFailed=true;return false;}}
function destroyScene(){scene?.dispose();scene=null;}
function show(screen){
  if(screen!=='choose')destroyScene();
  phase=screen;paused=false;
  const battle=screen==='choose'||screen==='result';
  $('mainScreen').hidden=screen!=='main';$('stageScreen').hidden=screen!=='stage';$('battleScreen').hidden=!battle;
  $('battleContent').hidden=screen!=='choose';$('resultScreen').hidden=screen!=='result';$('gameGuide').hidden=screen!=='main';
  document.body.dataset.screen=screen==='choose'?'battle':screen;
  window.__ACORN_AUCTION_FRAME__?.frame.activate(battle?'battle':screen);
  if(screen==='stage'){setPanel('stages');refreshStage();}
  window.dispatchEvent(new Event('weightplay:stage-sync'));window.dispatchEvent(new Event('weightplay:shell-sync'));
  if(battle)window.WeightPlayBattleCanvas?.sync?.();
}
function objective(s){return `${text('quantity')} = ${s.goal} · ${text('budget')} ≤ ${s.budget}`;}
function extra(s){return `${text('capacity')} ≤ ${s.slots}${s.gold?` · ${text('gold')} ≥ ${s.gold}`:''}${s.bells?` · ${text('bells')} ${s.bells}`:''}`;}
function stageConfig(){return {gameId:'animal-acorn-auction',count:30,poster:POSTER,background:'/assets/lobby-block-atmosphere.svg',stage(index){const s=STAGES[index];return {
  id:s.id,kicker:`${ARC[locale][s.arc]} · ${contract(s)}`,title:title(s),subtitle:objective(s),summary:extra(s),
  status:save.cleared[s.id]?'★'.repeat(save.cleared[s.id]):'',details:[],poster:POSTER,locked:s.id>unlocked(save),cleared:!!save.cleared[s.id]
};}};}
function refreshStage(){
  put('best',text('progress',{n:count(),s:starCount()}));put('stageProgress',`${count()} / 30 · ★ ${starCount()}`);
  stageUI?.setConfig(stageConfig(),roundIndex);put('stageNavigationTab',text('map'));put('stallNavigationTab',text('stall'));
  renderStall();
}
function pulse(element,name){element.getAnimations().forEach(a=>a.cancel());if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  element.animate(name==='error'?[{transform:'translateX(0)'},{transform:'translateX(-5px)'},{transform:'translateX(5px)'},{transform:'translateX(0)'}]:[{opacity:.6,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:name==='error'?180:260,easing:'ease-out'});
}
function renderBattle(){
  const s=STAGES[roundIndex],t=totals(s,selected,bell);
  put('roundTitle',contract(s));put('progressPill',`${s.id} / 30`);put('requestTitle',title(s));put('requestText',objective(s));put('requestExtra',extra(s));
  put('marketCaption',ARC[locale][s.arc]);put('bellCount',`${text('bells')} ${bell}/${s.bells} · ${text('strikes')} ${mistakes}/3`);
  for(let i=0;i<3;i++){
    const l=s.lots[i],button=$(`lot${i}`),sold=!available(l,bell),active=selected.includes(i);
    button.disabled=phase!=='choose'||paused||sold;button.setAttribute('aria-pressed',String(active));button.classList.toggle('selected',active);button.classList.toggle('sold',sold);
    button.setAttribute('aria-label',`${String.fromCharCode(65+i)}: ${text('quantity')} ${l.count}, ${text('gold')} ${l.gold}, ${text('budget')} ${priceAt(l,bell)}${sold?`, ${text('sold')}`:''}`);
    put(`lotCount${i}`,l.count);put(`lotGold${i}`,l.gold?`${text('gold')} ${l.gold}`:'');put(`lotPrice${i}`,sold?text('sold'):priceAt(l,bell));
    put(`lotNote${i}`,[l.discount?text('discount',{n:l.discount}):'',l.rival?text('rival',{n:l.rival}):''].filter(Boolean).join(' · '));
  }
  put('basketLabel',text('basket'));put('basketCount',`${t.count} / ${s.goal}`);put('basketCost',`${t.cost} / ${s.budget}`);
  put('basketGold',s.gold?`${text('gold')} ${t.gold}/${s.gold}`:`${text('capacity')} ${t.crates}/${s.slots}`);
  $('basket').setAttribute('role','group');$('basket').setAttribute('aria-label',`${text('basket')}: ${text('quantity')} ${t.count}/${s.goal}, ${text('budget')} ${t.cost}/${s.budget}, ${text('capacity')} ${t.crates}/${s.slots}`);
  $('basket').classList.toggle('over',t.cost>s.budget||t.crates>s.slots||t.count>s.goal);
  put('status',message||text('choose'));$('status').classList.toggle('error',!!message);
  put('bidBtn',text('bid'));put('waitBtn',`${text('wait')} ${bell}/${s.bells}`);put('resetBtn',text('reset'));
  $('bidBtn').disabled=paused||!selected.length;$('waitBtn').disabled=paused||bell>=s.bells;$('resetBtn').disabled=paused||!selected.length;
  scene?.set(s,selected,bell,save.theme);
}
function startRound(index){
  if(!Number.isInteger(index)||index<0||index>=30||index+1>unlocked(save))return;
  destroyScene();roundIndex=index;selected=[];bell=0;mistakes=0;message='';result=null;show('choose');
  $('sceneFallback').hidden=true;$('marketCanvas').hidden=false;
  try{scene=new MarketScene($('marketCanvas'),toggleLot);}catch{fallback();}
  renderBattle();sound('game.start');$('lot0').focus({preventScroll:true});
}
function fallback(){destroyScene();$('marketCanvas').hidden=true;$('sceneFallback').hidden=false;put('sceneFallbackText',text('fallback'));}
function toggleLot(i){if(phase!=='choose'||paused||!available(STAGES[roundIndex].lots[i],bell))return;
  selected=selected.includes(i)?selected.filter(v=>v!==i):[...selected,i];message='';sound('card.place');renderBattle();
}
function finish(ok,bid){
  if(phase!=='choose')return;const s=STAGES[roundIndex];
  result={ok,bid,stars:ok?starsFor(s,bid,mistakes):0};
  if(ok)persist(settle(save,s,bid,mistakes));
  show('result');renderResult();refreshStage();sound(ok?'result.win':'result.lose');pulse($('resultCard'),'win');
  (ok&&s.id<30?$('nextBtn'):$('resultReplayBtn')).focus({preventScroll:true});
}
function renderResult(){if(!result)return;const s=STAGES[roundIndex];
  put('resultEyebrow',`${ARC[locale][s.arc]} · ${contract(s)}`);put('resultTitle',result.ok?(count()===30?text('done'):text('win')):text('lose'));
  put('resultStars',result.ok?'★'.repeat(result.stars)+'☆'.repeat(3-result.stars):'—');
  put('resultText',result.ok?text('winDetail',{cost:result.bid.cost,stars:result.stars}):text('loseDetail'));
  put('starRule',text('starRule'));put('saveNotice',saveFailed?text('saveError'):'');
  $('nextBtn').disabled=!result.ok||s.id===30;put('nextBtn',text('next'));put('resultMapBtn',text('map'));put('resultReplayBtn',text('retry'));
}
function bid(){if(phase!=='choose'||paused||!selected.length)return;const value=checkBid(STAGES[roundIndex],selected,bell);
  if(value.ok)return finish(true,value);
  mistakes++;message=text(`${value.reason}Error`);if(mistakes>=3)return finish(false,value);
  sound('feedback.error');renderBattle();pulse($('basket'),'error');
}
function wait(){if(phase!=='choose'||paused||bell>=STAGES[roundIndex].bells)return;
  bell++;selected=selected.filter(i=>available(STAGES[roundIndex].lots[i],bell));message='';sound('ui.tick');renderBattle();pulse($('lotCards'),'bell');
}
function setPanel(panel){
  $('stageMarketView').hidden=panel!=='stages';$('stageMarketView').classList.toggle('hidden',panel!=='stages');$('stallPanel').hidden=panel!=='stall';
  for(const [id,active] of [['stageNavigationTab',panel==='stages'],['stallNavigationTab',panel==='stall']]){const el=$(id);if(el){el.setAttribute('aria-selected',String(active));if(active)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');}}
  if(panel==='stages')stageUI?.refresh(roundIndex);else renderStall();
}
function renderStall(){
  put('stallTitle',text('stall'));put('stallDescription',text('permanent'));put('walletCount',window.WeightPlayWallet?.read?.().diamonds||0);
  for(const skin of ['oak','amber','moon']){
    put(`skin-${skin}-title`,text(skin));const b=$(`skin-${skin}`);if(!b)continue;
    const locked=skin==='amber'&&count()<10,owned=skin!=='moon'||save.skins.includes('moon');
    b.disabled=save.theme===skin||locked;
    b.replaceChildren(document.createTextNode(save.theme===skin?text('equipped'):locked?text('unlock'):owned?text('equip'):text('purchase')));
    if(!owned){const gem=document.createElement('img');gem.src='/assets/weightplay-diamond.svg';gem.alt='';gem.width=20;gem.height=20;b.prepend(gem);}
    b.dataset.purchase=String(!owned);
  }
}
function equip(skin){
  if(phase!=='stage'||save.theme===skin||(skin==='amber'&&count()<10))return;
  const owned=skin!=='moon'||save.skins.includes('moon');
  if(owned){persist({...save,theme:skin});sound('ui.click');}
  else {
    let outcome;try{outcome=purchaseMoon(save,localStorage,window.WeightPlayWallet);}catch{outcome={reason:'saveError'};}
    if(!outcome.purchased){put('stallStatus',text(outcome.reason));sound('feedback.error');return;}
    save=outcome.save;saveFailed=false;sound('shop.purchase');
  }
  put('stallStatus',saveFailed?text('saveError'):text('equipped'));renderStall();
}
function staticCopy(){
  document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';$('localeSelect').value=locale;
  for(const [id,key] of [['startBtn','start'],['world','market'],['mainSummary','intro']])put(id,text(key));
  const official=window.ACORN_AUCTION_LOCALES?.[locale]?.title;const titleNode=$('mainScreen').querySelector('[data-wp-game-title]');
  if(official)titleNode.textContent=official;titleNode.dataset.runtimeLocalize='off';
  $('gameGuide').innerHTML=guideHTML(locale,official||'Acorn Auction');
  $('gameGuide').setAttribute('aria-label',official||'Acorn Auction');
  $('backBtn').setAttribute('aria-label',BACK[locale].split('|')[0]);
  for(const id of ['stageBackBtn','battleBackBtn'])$(id).setAttribute('aria-label',BACK[locale].split('|')[1]);
  $('stageList').setAttribute('aria-label',text('map'));
  $('lotCards').setAttribute('aria-label',text('market'));$('marketCanvas').setAttribute('aria-label',text('market'));
  refreshStage();if(phase==='choose')renderBattle();if(phase==='result')renderResult();
}
for(let i=0;i<3;i++){
  const b=document.createElement('button');b.id=`lot${i}`;b.type='button';b.className='lot-card';
  b.innerHTML=`<span class="lot-letter">${String.fromCharCode(65+i)}</span><span class="lot-quantity">${icon(ACORN,'')}<strong id="lotCount${i}"></strong></span><span class="lot-gold" id="lotGold${i}"></span><span class="lot-price">${icon(COIN,'')}<strong id="lotPrice${i}"></strong></span><small id="lotNote${i}"></small>`;
  b.addEventListener('click',()=>toggleLot(i));$('lotCards').append(b);
}
$('startBtn').addEventListener('click',()=>{sound('ui.click');show('stage');});
$('stageBackBtn').addEventListener('click',()=>show('main'));$('battleBackBtn').addEventListener('click',()=>show('stage'));
$('backBtn').addEventListener('click',()=>location.assign(`/${Object.keys(routes).find(k=>routes[k]===locale)||'en'}/`));
$('bidBtn').addEventListener('click',bid);$('waitBtn').addEventListener('click',wait);
$('resetBtn').addEventListener('click',()=>{if(phase!=='choose'||paused)return;selected=[];message='';sound('board.undo');renderBattle();});
$('resultReplayBtn').addEventListener('click',()=>startRound(roundIndex));$('nextBtn').addEventListener('click',()=>{if(result?.ok)startRound(roundIndex+1);});$('resultMapBtn').addEventListener('click',()=>show('stage'));
$('localeSelect').addEventListener('change',e=>{if(!COPY[e.target.value])return;locale=e.target.value;try{localStorage.setItem('weightplay-acorn-auction-locale',locale);}catch{}staticCopy();});
for(const skin of ['oak','amber','moon'])$(`skin-${skin}`).addEventListener('click',()=>equip(skin));
$('marketCanvas').addEventListener('market-render-error',fallback);
document.addEventListener('visibilitychange',()=>{if(document.hidden)scene?.stop();else if(phase==='choose'&&!paused)scene?.resume();});
window.addEventListener('pagehide',()=>destroyScene());window.addEventListener('pageshow',e=>{if(e.persisted&&phase==='choose'){try{scene=new MarketScene($('marketCanvas'),toggleLot);renderBattle();}catch{fallback();}}});
window.__ACORN_AUCTION_INTERFACE_BRIDGE__={
  getState:()=>({roundIndex,phase,solved:Object.keys(save.cleared).map(Number),picks:mistakes}),
  getStageTabLabel:()=>text('map'),getStallTabLabel:()=>text('stall'),getStageConfig:stageConfig,
  selectStage:index=>{roundIndex=Math.max(0,Math.min(29,Math.round(index)));},startRound,
  attachStageUI:api=>{stageUI=api;refreshStage();},refreshStage,setPanel,
  pausePending:()=>{paused=true;scene?.stop();$('battleContent').getAnimations({subtree:true}).forEach(a=>a.cancel());return true;},
  resumePending:()=>{paused=false;if(phase==='choose')scene?.resume();}
};
$('mainPoster').src=POSTER;document.querySelectorAll('[data-rux]').forEach(e=>e.src=RUX);
$('loading').hidden=true;$('app').hidden=false;staticCopy();show('main');
