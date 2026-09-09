/* Independent real-time Pong. The legacy target-alignment batch is not mounted. */
(async () => {
  'use strict';
  const base = new URL('.', document.currentScript.src);
  const [{ Match, WIDTH, HEIGHT }, { COPY, ROUTES }] = await Promise.all([import(new URL('engine.mjs',base)),import(new URL('locale.mjs',base))]);
  const asset = name => new URL('../../assets/'+name,base).href;
  const style=document.createElement('link'); style.rel='stylesheet'; style.href=new URL('pong.css?v=11',base); document.head.append(style);
  let locale=Object.keys(ROUTES).find(key=>location.pathname.startsWith('/'+ROUTES[key]+'/'))||document.documentElement.lang;
  if(!COPY[locale]) locale='en';
  let t=COPY[locale], difficulty=0, sound=true, wins=[0,0,0];
  try { const save=JSON.parse(localStorage.getItem('wp-pong-realtime-v1')||'{}'); difficulty=[0,1,2].includes(save.difficulty)?save.difficulty:0; sound=save.sound!==false; wins=[0,1,2].map(i=>Number.isInteger(save.wins?.[i])?Math.max(0,Math.min(1000000,save.wins[i])):0); } catch {}
  const persist=()=>{try{localStorage.setItem('wp-pong-realtime-v1',JSON.stringify({difficulty,wins,sound}));}catch{}};
  let match=new Match(difficulty), screen='main', frame=0, previous=0, audio=null, lastTone=0;
  const held=new Set();
  document.body.classList.add('pong-realtime');
  Object.assign(document.body.dataset,{gameId:'pong',wpGameId:'pong',gameVersion:'v11',screen:'main',audience:'general',runtimeLocalize:'off'});
  document.body.innerHTML=`<main id="pongApp">
  <section id="mainScreen" class="pw-main" data-wp-scene="main">
    <header class="pw-header"><a class="pw-return" data-wp-return="main" href="/${ROUTES[locale]}/"><span>←</span><img src="${asset('weightplay-logo.png')}" alt=""></a><h1></h1><button id="settingsBtn" class="pw-icon" data-wp-settings>⚙</button></header>
    <div class="pw-intro"><img class="pw-poster main-poster" src="${asset('pong-cover-v1.webp')}" width="1254" height="1254" alt=""><div class="pw-copy"><p id="summary" class="main-summary"></p><p id="record"></p><button id="startBtn" class="pw-primary" data-wp-main-start></button></div></div>
    <button id="guideBtn" class="pw-guide-link"></button>
  </section>
  <section id="publicGuide" class="pw-main pw-guide game-page-info" data-wp-game-guide></section>
  <section id="battleScreen" class="pw-battle" data-wp-scene="battle" hidden>
    <div class="pw-canvas" data-wp-logical-battle-canvas><div id="livePanel">
      <header class="pw-hud"><button id="battleBackBtn" class="pw-icon" data-wp-return="battle">←</button><div id="score" class="pw-score" dir="ltr"></div><button id="battleSettingsBtn" class="pw-icon" data-wp-battle-utility="true">⚙</button></header>
      <div id="courtWrap"><canvas id="court" width="600" height="600" tabindex="0"></canvas><div id="courtCue" class="pw-court-cue"></div></div>
      <p id="gameMessage" role="status" aria-live="polite"></p><div class="pw-controls"><button id="leftBtn">◀</button><button id="serveBtn" class="pw-primary" data-wp-primary-action></button><button id="rightBtn">▶</button></div>
    </div><section id="resultPanel" hidden><h2 id="resultTitle"></h2><p id="resultScore" dir="ltr"></p><p id="resultCopy"></p><div class="pw-result-actions"><button id="homeBtn"></button><button id="retryBtn" class="pw-primary"></button></div></section></div>
    <div class="pw-reserve battle-ad-reserve" data-wp-battle-physical-reserve data-wp-ad-reserve aria-hidden="true"></div>
  </section>
  <dialog id="settings"><h2></h2><label id="difficultyLabel" for="difficulty"></label><select id="difficulty"></select><label id="localeLabel" for="localeSelect"></label><select id="localeSelect"></select><button id="soundBtn" data-sound-toggle></button><button id="helpInSettings"></button><button id="closeSettings" class="pw-primary"></button></dialog>
  <dialog id="help"><h2></h2><div id="helpCopy"></div><button id="closeHelp" class="pw-primary"></button></dialog></main>`;
  const $=id=>document.getElementById(id), canvas=$('court'), ctx=canvas.getContext('2d'), set=(id,text)=>{$(id).textContent=text;};
  const languages={en:'English','zh-Hant':'繁體中文','zh-Hans':'简体中文',ja:'日本語',ko:'한국어',es:'Español','pt-BR':'Português',fr:'Français',de:'Deutsch',it:'Italiano',ru:'Русский',hi:'हिन्दी',ar:'العربية'};
  function localize(){
    t=COPY[locale]; document.documentElement.lang=locale; document.documentElement.dir=locale==='ar'?'rtl':'ltr'; document.title=`${t.title} | WeightPlay`; document.querySelector('h1').textContent=t.title;
    set('summary',t.summary);set('record',`${t.difficulty}: ${[t.easy,t.normal,t.hard][difficulty]} · ${t.wins}: ${wins[difficulty]}`);
    for(const [id,key] of [['startBtn','start'],['guideBtn','guide'],['retryBtn','again'],['homeBtn','home'],['difficultyLabel','difficulty'],['helpInSettings','guide'],['closeSettings','close'],['closeHelp','close']])set(id,t[key]);
    $('settings').querySelector('h2').textContent=t.settings;$('help').querySelector('h2').textContent=t.guide;set('localeLabel',languages[locale]);
    $('difficulty').replaceChildren(...[t.easy,t.normal,t.hard].map((name,i)=>new Option(name,i,false,i===difficulty)));
    $('localeSelect').replaceChildren(...Object.entries(languages).map(([key,name])=>new Option(name,key,false,key===locale)));
    set('soundBtn',`${t.sound}: ${sound?t.on:t.off}`);
    for(const [id,label] of [['settingsBtn',t.settings],['battleSettingsBtn',t.settings],['battleBackBtn',t.home],['leftBtn',t.left],['rightBtn',t.right],['court',t.how]])$(id).setAttribute('aria-label',label);
    const back=document.querySelector('[data-wp-return="main"]');back.href=`/${ROUTES[locale]}/`;back.setAttribute('aria-label','WeightPlay');
    for(const id of ['helpCopy','publicGuide']){ $(id).replaceChildren();for(const text of [t.how,t.tip,t.save]){const p=document.createElement('p');p.textContent=text;$(id).append(p);} }
    $('publicGuide').setAttribute('aria-label',t.guide);hud();draw();
  }
  function unlockSound(){if(!sound)return;try{const AC=window.AudioContext||window.webkitAudioContext;if(AC){audio ||= new AC();audio.resume().catch(()=>{});}}catch{}}
  function beep(high=false){
    if(!sound||audio?.state!=='running'||audio.currentTime-lastTone<.065)return;lastTone=audio.currentTime;
    const oscillator=audio.createOscillator(),gain=audio.createGain();oscillator.frequency.value=high?690:360;
    gain.gain.setValueAtTime(.035,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.07);oscillator.connect(gain).connect(audio.destination);oscillator.start();oscillator.stop(audio.currentTime+.08);oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};
  }
  function stop(){cancelAnimationFrame(frame);frame=0;previous=0;held.clear();}
  function pause(){match.pause();stop();hud();draw();}
  function hud(){
    $('score').replaceChildren();for(const [name,value,color] of [[t.you,match.you,'you'],[t.cpu,match.them,'cpu']]){const span=document.createElement('span');span.className=color;span.textContent=`${name} ${value}`;$('score').append(span);}
    set('serveBtn',match.phase==='playing'?t.pause:match.phase==='paused'?t.resume:t.serve);
    set('gameMessage',match.phase==='ready'?t.ready:match.phase==='point'?(match.lastPoint==='you'?t.pointYou:t.pointCpu):match.phase==='paused'?t.pause:t.playing);
    set('courtCue',match.phase==='paused'?t.pause:`${t.serve} · 7`);$('courtCue').hidden=!['ready','paused','point'].includes(match.phase);
    $('difficulty').disabled=screen!=='main';$('localeSelect').hidden=screen!=='main';$('localeLabel').hidden=screen!=='main';
  }
  function draw(){
    ctx.clearRect(0,0,WIDTH,HEIGHT);ctx.fillStyle='#0a2634';ctx.fillRect(0,0,WIDTH,HEIGHT);ctx.strokeStyle='#336170';ctx.lineWidth=2;ctx.strokeRect(2,2,596,596);
    ctx.setLineDash([8,10]);ctx.beginPath();ctx.moveTo(0,300);ctx.lineTo(600,300);ctx.stroke();ctx.setLineDash([]);ctx.beginPath();ctx.arc(300,300,58,0,Math.PI*2);ctx.stroke();
    ctx.font='bold 22px system-ui';ctx.textAlign='center';ctx.fillStyle='#ffb1a5';ctx.fillText(t.cpu,300,28);ctx.fillStyle='#81eed1';ctx.fillText(t.you,300,587);
    const paddle=(x,y,w,color)=>{ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x-w/2,y,w,15,7);ctx.fill();};paddle(match.cpu,32,match.config.aiWidth,'#ffa89b');paddle(match.player,553,match.config.playerWidth,'#73f4cd');
    const b=match.ball;ctx.shadowColor='#ffe199';ctx.shadowBlur=14;ctx.fillStyle='#ffe199';ctx.beginPath();ctx.arc(b.x,b.y,9,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
    if(match.phase==='playing'){const speed=Math.hypot(b.vx,b.vy)||1;ctx.strokeStyle='#ffe19988';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(b.x-b.vx/speed*12,b.y-b.vy/speed*12);ctx.lineTo(b.x-b.vx/speed*34,b.y-b.vy/speed*34);ctx.stroke();}canvas.dataset.phase=match.phase;
  }
  function finish(){
    stop();if(match.you===7){wins[difficulty]=Math.min(1000000,wins[difficulty]+1);persist();}
    $('livePanel').hidden=true;$('livePanel').inert=true;$('resultPanel').hidden=false;document.body.dataset.screen='result';set('resultTitle',match.you===7?t.won:t.lost);set('resultScore',`${match.you} : ${match.them}`);set('resultCopy',`${t.rally}: ${match.bestRally} · ${t.wins}: ${wins[difficulty]}`);$('retryBtn').focus();
  }
  function tick(now){
    frame=0;if(screen!=='battle'||match.phase!=='playing')return;const dt=previous?Math.min((now-previous)/1000,.035):0;previous=now;
    const direction=(held.has('right')?1:0)-(held.has('left')?1:0);if(direction)match.move(match.aim+direction*760*dt);
    const events=match.step(dt);if(events.includes('hit'))beep();if(events.includes('point')){beep(true);hud();}draw();if(match.phase==='finished')finish();else if(match.phase==='playing')frame=requestAnimationFrame(tick);
  }
  function launch(){if(screen!=='battle'||$('settings').open||$('help').open||match.phase==='finished')return;unlockSound();if(match.phase==='playing'){pause();return;}if(match.phase==='paused')match.resume();else match.serve();previous=0;hud();draw();if(!frame)frame=requestAnimationFrame(tick);}
  function start(){stop();match=new Match(difficulty);screen='battle';document.body.dataset.screen='battle';document.documentElement.classList.add('pw-active');$('mainScreen').hidden=true;$('publicGuide').hidden=true;$('battleScreen').hidden=false;$('livePanel').hidden=false;$('livePanel').inert=false;$('resultPanel').hidden=true;window.scrollTo(0,0);hud();draw();$('serveBtn').focus();}
  function home(){pause();screen='main';document.body.dataset.screen='main';document.documentElement.classList.remove('pw-active');$('mainScreen').hidden=false;$('publicGuide').hidden=false;$('battleScreen').hidden=true;localize();$('startBtn').focus();}
  $('startBtn').onclick=start;$('retryBtn').onclick=start;$('homeBtn').onclick=home;$('battleBackBtn').onclick=home;$('serveBtn').onclick=launch;
  const openSettings=()=>{pause();$('settings').showModal();};$('settingsBtn').onclick=openSettings;$('battleSettingsBtn').onclick=openSettings;$('closeSettings').onclick=()=>$('settings').close();
  const openHelp=()=>{pause();if($('settings').open)$('settings').close();$('help').showModal();};$('guideBtn').onclick=openHelp;$('helpInSettings').onclick=openHelp;$('closeHelp').onclick=()=>$('help').close();
  $('soundBtn').onclick=()=>{sound=!sound;persist();if(sound)unlockSound();else audio?.suspend().catch(()=>{});localize();};
  $('difficulty').onchange=()=>{if(screen!=='main')return;difficulty=Number($('difficulty').value);persist();localize();};$('localeSelect').onchange=()=>{locale=$('localeSelect').value;try{localStorage.setItem('weightPlayLocale',locale);}catch{}localize();};
  for(const [id,key] of [['leftBtn','left'],['rightBtn','right']]){$(id).onpointerdown=e=>{e.preventDefault();$(id).setPointerCapture(e.pointerId);held.add(key);};for(const event of ['pointerup','pointercancel','lostpointercapture'])$(id).addEventListener(event,()=>held.delete(key));}
  const aim=e=>{if(screen!=='battle'||$('settings').open||$('help').open)return;const r=canvas.getBoundingClientRect();match.move((e.clientX-r.left)/r.width*WIDTH);};canvas.onpointerdown=e=>{canvas.setPointerCapture(e.pointerId);aim(e);};canvas.onpointermove=e=>{if(e.pointerType==='mouse'||canvas.hasPointerCapture(e.pointerId))aim(e);};
  window.addEventListener('keydown',e=>{if(screen!=='battle'||$('settings').open||$('help').open||match.phase==='finished')return;const direction=['ArrowLeft','a','A'].includes(e.key)?'left':['ArrowRight','d','D'].includes(e.key)?'right':null;if(direction){e.preventDefault();held.add(direction);}else if(e.code==='Space'&&!e.repeat){e.preventDefault();launch();}else if(e.key==='Escape'){e.preventDefault();pause();}});
  window.addEventListener('keyup',e=>{if(['ArrowLeft','a','A'].includes(e.key))held.delete('left');if(['ArrowRight','d','D'].includes(e.key))held.delete('right');});
  window.addEventListener('blur',pause);document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});window.addEventListener('pagehide',()=>{stop();audio?.close().catch(()=>{});audio=null;});window.addEventListener('resize',()=>{if(screen==='battle')pause();});
  localize();
})().catch(error=>console.error('Pong startup failed',error));
