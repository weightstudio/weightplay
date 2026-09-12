(() => {
  'use strict';
  const locales=window.ANIMAL_SIGNAL_SCOUT_LOCALES, copy=window.SIGNAL_UPGRADE_COPY, patrols=window.SIGNAL_CAMPAIGN;
  const animals=['fox','owl','rabbit'], colours=['amber','teal','violet'], hex=['#ffbd55','#58ddce','#b993ff'];
  const portraits=['spark-paw-fox','moon-cap-owl','rainbow-hop-rabbit'].map(id=>`/assets/weightplay-character-${id}-block-v1.webp`);
  const $=id=>document.getElementById(id), saveKey='weightplay-signal-campaign-v11';
  let progress={unlocked:1,stars:{}};
  try { const old=JSON.parse(localStorage.getItem(saveKey)||'null'); if(old) progress={unlocked:Math.max(1,Math.min(30,Math.floor(Number(old.unlocked)||1))),stars:old.stars&&typeof old.stars==='object'?old.stars:{}}; } catch {}
  const state={locale:locales[document.documentElement.lang]?document.documentElement.lang:'en',patrol:0,code:[],checks:0,sessionChecks:0,screen:'main',clue:true,hints:0,feedback:''};
  const t=(key,vars={})=>Object.entries(vars).reduce((s,[k,v])=>s.replaceAll(`{${k}}`,String(v)),String(copy[state.locale]?.[key]??locales[state.locale]?.[key]??copy.en[key]??locales.en[key]??key));
  const art=(i,cls='animal-icon')=>`<img class="${cls}" src="${portraits[i]}" alt="" draggable="false">`;
  const sound=(good=false)=>{try{if(window.WonderSound?.play) window.WonderSound.play(good?'success':'click');}catch{}};
  const scene=()=>window.dispatchEvent(new CustomEvent('wp:block-scene',{detail:{active:state.screen==='battle',colours:hex,lit:state.code.length,labels:animals.map(a=>t(a))}}));
  function show(screen){state.screen=screen;document.querySelectorAll('[data-screen]').forEach(n=>n.hidden=n.dataset.screen!==screen);document.body.dataset.screen=screen;window.dispatchEvent(new CustomEvent('weightplay:shell-sync'));scene();}
  function persist(){try{localStorage.setItem(saveKey,JSON.stringify(progress));}catch{}}
  function renderMain(){ $('mainProgress').textContent=t('saved',{n:Object.keys(progress.stars).length});$('bestValue').textContent=`${Object.values(progress.stars).reduce((a,b)=>a+(Number(b)||0),0)} / 90`; }
  function rules(p){const keys=[];if(p.rule.includes('skip')||p.rule==='finale')keys.push('skip');if(p.rule.includes('reverse')||p.rule==='finale')keys.push('reverse');else if(p.rule.includes('rotate'))keys.push('rotate');else keys.push('forward');if(p.memory)keys.push('memory');return keys.map(k=>t(k)).join(' ');}
  function renderStages(){
    $('stageList').replaceChildren(...patrols.map((p,i)=>{const b=document.createElement('button');b.type='button';b.className='stage-card';b.dataset.stage=String(i+1);b.dataset.wpStageCard='';b.disabled=i+1>progress.unlocked;b.setAttribute('aria-disabled',String(b.disabled));b.innerHTML=`<strong>${p.checkpoint?'◆ ':''}${t('round',{n:i+1,total:30})}</strong><span>${rules(p)}</span><small>${b.disabled?t('locked'):'★'.repeat(progress.stars[i+1]||0)||t('open')}</small>`;b.onclick=()=>startPatrol(i);return b;}));
    requestAnimationFrame(()=>$('stageList').querySelector(`[data-stage="${progress.unlocked}"]`)?.scrollIntoView({block:'nearest',inline:'center'}));
  }
  function renderBattle(){
    const p=patrols[state.patrol], next=state.code.length, studying=p.memory&&state.clue;
    $('roundName').textContent='';$('roundLabel').textContent=t('round',{n:p.number,total:30});$('routeNote').textContent=rules(p);$('checkCount').textContent=t('checks',{n:state.checks});
    $('missionPrompt').textContent=state.feedback?state.feedback:studying?t('memory'):next===p.order.length?t('ready'):`${t('codeLabel')} ${next+1} / ${p.order.length}${p.number<=2?` · ${t(animals[p.order[next]])}`:''}`;
    $('targetOrder').replaceChildren(...[...p.pattern].map((v,i)=>{const c=document.createElement('span');c.className=`target-chip${v==='x'?' is-sleeping':''}${!p.memory&&p.number<=2&&i===next?' is-current':''}`;c.innerHTML=`<b>${i+1}</b>${p.memory&&!state.clue?'<span>?</span>':v==='x'?'<span>×</span>':art(Number(v))}`;c.setAttribute('aria-label',`${i+1}: ${p.memory&&!state.clue?'?':v==='x'?'×':t(animals[Number(v)])}`);return c;}));
    $('memoryBtn').hidden=!p.memory;$('memoryBtn').textContent=t(state.clue?'enter':'review');
    $('signalGrid').replaceChildren(...animals.map((a,i)=>{const b=document.createElement('button');b.type='button';b.className=`signal-btn${p.number<=2&&!studying&&p.order[next]===i?' is-next':''}`;b.dataset.animal=a;b.disabled=studying||next>=p.order.length;b.setAttribute('aria-label',`${t(a)} · ${t(colours[i])}`);b.innerHTML=`${art(i)}<strong>${t(a)}</strong><small><i style="background:${hex[i]}"></i>${t(colours[i])}</small>`;b.onclick=()=>chooseSignal(a);return b;}));
    $('code').replaceChildren(...p.order.map((_,i)=>{const b=document.createElement('button');b.type='button';b.className='code-chip';b.disabled=i>=next;b.setAttribute('aria-label',`${i+1}. ${i<next?t(animals[state.code[i]]):'—'}`);b.innerHTML=`<b>${i+1}</b>${i<next?art(state.code[i]):'<span>—</span>'}`;b.onclick=()=>{state.code.splice(i,1);state.feedback='';renderBattle();};return b;}));
    $('checkBtn').disabled=studying||next!==p.order.length;$('battleStatus').textContent=state.feedback||t('waiting');scene();
  }
  function renderResult(){const p=patrols[state.patrol];$('resultTitle').textContent=t('resultTitle');$('resultText').textContent=`${'★'.repeat(progress.stars[p.number]||1)} · ${t('saved',{n:Object.keys(progress.stars).length})}`;$('resultPrimaryBtn').textContent=t(p.number===30?'map':'next');$('resultPrimaryBtn').onclick=p.number===30?openPatrolMap:()=>startPatrol(state.patrol+1);$('resultMapBtn').hidden=false;}
  function startPatrol(index){if(!Number.isInteger(index)||index<0||index>=30||index+1>progress.unlocked)return;Object.assign(state,{patrol:index,code:[],checks:0,hints:0,clue:true,feedback:''});show('battle');renderBattle();}
  function chooseSignal(animal){const p=patrols[state.patrol],id=animals.indexOf(animal);if(state.screen!=='battle'||id<0||state.code.length>=p.order.length||(p.memory&&state.clue))return;state.code.push(id);state.feedback='';sound();renderBattle();}
  function clearCode(){state.code=[];state.feedback='';renderBattle();}
  function checkCode(){const p=patrols[state.patrol];if(state.screen!=='battle'||state.code.length!==p.order.length||(p.memory&&state.clue))return;state.checks++;state.sessionChecks++;const wrong=state.code.findIndex((v,i)=>v!==p.order[i]);if(wrong>=0){state.feedback=t('wrongAt',{n:wrong+1});$('battleScreen').dataset.feedback='wrong';renderBattle();return;}const stars=state.checks===1&&!state.hints?3:state.checks<=3?2:1;progress.stars[p.number]=Math.max(Number(progress.stars[p.number])||0,stars);progress.unlocked=Math.max(progress.unlocked,Math.min(30,p.number+1));persist();sound(true);show('result');renderResult();renderMain();}
  function openPatrolMap(){show('stage');renderStages();}
  function applyLocale(){document.documentElement.lang=state.locale;document.documentElement.dir=state.locale==='ar'?'rtl':'ltr';document.querySelectorAll('[data-copy]').forEach(n=>n.textContent=t(n.dataset.copy));document.querySelectorAll('[data-copy-aria]').forEach(n=>n.setAttribute('aria-label',t(n.dataset.copyAria)));$('localeSelect').value=state.locale;$('signalGrid').setAttribute('aria-label',t('signalChoices'));renderMain();if(state.screen==='battle')renderBattle();if(state.screen==='stage')renderStages();if(state.screen==='result')renderResult();window.dispatchEvent(new CustomEvent('wonder:locale-change',{detail:{locale:state.locale}}));}
  $('startBtn').onclick=openPatrolMap;$('mapBtn').onclick=openPatrolMap;$('stageBackBtn').onclick=()=>{show('main');applyLocale();};$('battleBackBtn').onclick=openPatrolMap;$('resultMapBtn').onclick=openPatrolMap;$('resultHomeBtn').onclick=()=>{show('main');applyLocale();};$('checkBtn').onclick=checkCode;$('clearBtn').onclick=clearCode;
  $('memoryBtn').onclick=()=>{if(!state.clue)state.hints++;state.clue=!state.clue;renderBattle();};
  $('battleUtilityBtn').onclick=()=>document.querySelector('[data-wp-settings]')?.click();
  $('localeSelect').onchange=e=>{state.locale=locales[e.target.value]?e.target.value:'en';try{localStorage.setItem('weightplayLocale',state.locale);}catch{}applyLocale();};
  window.addEventListener('wp:block-pick',e=>chooseSignal(animals[e.detail.index]));window.addEventListener('wp:block-ready',scene);
  applyLocale();show('main');
  const mapObserver=new MutationObserver(()=>{const host=document.querySelector('.wp-standard-main-copy');if(host&&!host.contains($('mapBtn'))){host.append($('mapBtn'));mapObserver.disconnect();}});
  mapObserver.observe(document.body,{childList:true,subtree:true});
  window.__ANIMAL_SIGNAL_SCOUT_TEST__={patrols,startPatrol,chooseSignal,checkCode,clearCode,getState:()=>({...state,code:[...state.code],progress:structuredClone(progress)})};
})();
