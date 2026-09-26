/* Independent real-time Pong. The legacy target-alignment batch is not mounted. */
(async () => {
  'use strict';
  // Keep the authored, locale-owned public Guide when mounting the native court.
  const initialGuide = document.querySelector('.game-page-info-static');
  document.querySelector('main')?.setAttribute('data-wp-frame-root','');
  /* WP-GAME-ANALYTICS-ADAPTER */
  // Only replayable lifecycle signals live here; all metrics/timers/GA4 stay shared.
  const __wpMeasurement = { screen: null, roundKey: null, started: false, ended: false, restart: false, outcome: "complete" };
  const __wpReadMeasurement = () => ({ ...__wpMeasurement,
    keyboardKeys: ["ArrowLeft", "ArrowRight", "a", "A", "d", "D", " "],
    screen: ((({main:"main",stage:"stage",battle:"battle",})[screen] ?? null) === "battle" && (__wpMeasurement.ended)) ? null : (({main:"main",stage:"stage",battle:"battle",})[screen] ?? null), ended: Boolean(__wpMeasurement.ended), outcome: __wpMeasurement.outcome,
    paused: Boolean(match.phase !== "playing"), node: $("battleScreen"),
    activityMode: "input", idleSeconds: 300
  });
  function __wpNotifyMeasurement() { try { window.WonderAnalytics?.game?.observeState(__wpReadMeasurement); } catch { /* Optional telemetry. */ } }
  // Explicit authored replay actions count only when a new round was actually created.
  function __wpReplayStart(action) {
    const previous = __wpMeasurement.roundKey, value = action();
    if (__wpMeasurement.roundKey !== previous) { __wpMeasurement.restart = true; __wpNotifyMeasurement(); }
    return value;
  }
  window.addEventListener("weightplay:analytics-ready", __wpNotifyMeasurement);
  __wpNotifyMeasurement();
  const base = new URL('.', document.currentScript.src);
  const ensureFrameRuntime = () => {
    if (window.WeightPlayScreenFrame?.version === 7) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const existing = document.querySelector('script[src*="game-screen-frame.js"]');
      if (existing) {
        if (window.WeightPlayScreenFrame?.version === 7) { resolve(); return; }
        existing.addEventListener('load', resolve, { once: true });
        existing.addEventListener('error', reject, { once: true });
        return;
      }
      window.__weightPlayScreenFrameRequested = true;
      const script = document.createElement('script');
      script.src = new URL('../../src/game-screen-frame.js?v=20260921-interface7-single-frame-v2', base).href;
      script.dataset.wpSharedInterface = '7';
      script.addEventListener('load', resolve, { once: true });
      script.addEventListener('error', reject, { once: true });
      document.head.append(script);
    });
  };
  const [{ Match, WIDTH, HEIGHT }, { COPY, ROUTES }] = await Promise.all([
    import(new URL('engine.mjs',base)),
    import(new URL('locale.mjs',base)),
    ensureFrameRuntime()
  ]);
  const asset = name => new URL('../../assets/'+name,base).href;
  if (!document.querySelector('link[href*="/games/pong/pong.css"]')) {
    const style=document.createElement('link'); style.rel='stylesheet'; style.href=new URL('pong.css?v=20260926-interface7-pong-v11',base); document.head.append(style);
  }
  const artStyle=document.createElement('link'); artStyle.rel='stylesheet'; artStyle.href=new URL('art.css?v=20260921-pong-block-scene-v1',base); document.head.append(artStyle);
  let locale=Object.keys(ROUTES).find(key=>location.pathname.startsWith('/'+ROUTES[key]+'/'))||document.documentElement.lang;
  if(!COPY[locale]) locale='en';
  let t=COPY[locale], difficulty=0, wins=[0,0,0];
  let frameApi=null, leaveResumePhase=null;
  const leaveCopy={
    en:{title:"Leave this match?",text:"Leaving the {mode} match discards the current {score} score. Saved wins remain.",continue:"Continue playing",leave:"Return to Main"},
    "zh-Hant":{title:"離開這場比賽？",text:"離開{mode}比賽會捨棄目前 {score} 的比分；已儲存的勝場仍會保留。",continue:"繼續遊玩",leave:"返回主畫面"},
    "zh-Hans":{title:"离开这场比赛？",text:"离开{mode}比赛会丢弃当前 {score} 的比分；已保存的胜场仍会保留。",continue:"继续游玩",leave:"返回主画面"},
    ja:{title:"この試合を終了しますか？",text:"{mode}の試合を終了すると現在のスコア {score} は破棄されます。保存済みの勝利数は残ります。",continue:"プレイを続ける",leave:"メインへ戻る"},
    ko:{title:"이 경기를 나갈까요?",text:"{mode} 경기를 나가면 현재 {score} 점수는 사라집니다. 저장된 승리 수는 유지됩니다.",continue:"계속 플레이",leave:"메인으로 돌아가기"},
    es:{title:"¿Salir de este partido?",text:"Salir del partido {mode} descarta el marcador actual {score}. Las victorias guardadas se conservan.",continue:"Seguir jugando",leave:"Volver al inicio"},
    "pt-BR":{title:"Sair desta partida?",text:"Sair da partida {mode} descarta o placar atual {score}. As vitórias salvas permanecem.",continue:"Continuar jogando",leave:"Voltar ao início"},
    fr:{title:"Quitter ce match ?",text:"Quitter le match {mode} efface le score actuel {score}. Les victoires enregistrées restent.",continue:"Continuer à jouer",leave:"Retour à l’accueil"},
    de:{title:"Dieses Match verlassen?",text:"Beim Verlassen des {mode}-Matches wird der aktuelle Spielstand {score} verworfen. Gespeicherte Siege bleiben erhalten.",continue:"Weiterspielen",leave:"Zurück zum Start"},
    it:{title:"Uscire da questa partita?",text:"Uscendo dalla partita {mode} perderai il punteggio attuale {score}. Le vittorie salvate restano.",continue:"Continua a giocare",leave:"Torna alla schermata iniziale"},
    ru:{title:"Выйти из матча?",text:"При выходе из матча «{mode}» текущий счёт {score} будет сброшен. Сохранённые победы останутся.",continue:"Продолжить игру",leave:"Вернуться на главный экран"},
    hi:{title:"इस मैच से बाहर जाएँ?",text:"{mode} मैच छोड़ने पर मौजूदा {score} स्कोर मिट जाएगा। सहेजी गई जीतें बनी रहेंगी।",continue:"खेल जारी रखें",leave:"मुख्य स्क्रीन पर लौटें"},
    ar:{title:"مغادرة هذه المباراة؟",text:"ستؤدي مغادرة مباراة {mode} إلى فقدان النتيجة الحالية {score}، بينما تبقى الانتصارات المحفوظة.",continue:"متابعة اللعب",leave:"العودة إلى الشاشة الرئيسية"}
  };
  try { const save=JSON.parse(localStorage.getItem('wp-pong-realtime-v1')||'{}'); difficulty=[0,1,2].includes(save.difficulty)?save.difficulty:0; wins=[0,1,2].map(i=>Number.isInteger(save.wins?.[i])?Math.max(0,Math.min(1000000,save.wins[i])):0); } catch {}
  const persist=()=>{try{localStorage.setItem('wp-pong-realtime-v1',JSON.stringify({difficulty,wins}));}catch{}};
  let match=new Match(difficulty), screen='main', frame=0, previous=0, audio=null, lastTone=0;
  const held=new Set();
  document.body.classList.add('pong-realtime');
  Object.assign(document.body.dataset,{gameId:'pong',wpGameId:'pong',gameVersion:'v11',screen:'main',audience:'general',runtimeLocalize:'off'});
  document.body.innerHTML=`<main id="pongApp" data-wp-frame-root>
  <section id="mainScreen" class="pw-main" data-wp-scene="main">
    <header class="pw-header"><a class="pw-return" data-wp-return="main" href="/${ROUTES[locale]}/"><span>←</span><img src="${asset('weightplay-logo.png')}" alt=""></a><h1 data-wp-frame-title></h1></header>
    <div id="mainContent" class="pw-main-content" data-wp-frame-content="main"><div class="pw-intro"><img class="pw-poster main-poster" data-wp-frame-poster src="${asset('pong-cover-v1.webp')}" width="1254" height="1254" alt=""><div class="pw-copy" data-wp-frame-copy><p id="summary" class="main-summary" data-wp-frame-summary></p><p id="record" data-wp-frame-progress></p><button id="startBtn" class="pw-primary" data-wp-main-start data-wp-frame-action="primary"></button></div></div></div>
  </section>
  <section id="publicGuide" class="pw-main pw-guide game-page-info" data-wp-game-guide></section>
  <section id="battleScreen" class="pw-battle" data-wp-scene="battle" hidden>
    <div class="pw-canvas" data-wp-logical-battle-canvas>
      <header class="pw-hud"><button id="battleBackBtn" data-wp-return="battle">←</button><strong data-wp-frame-title aria-hidden="true"></strong></header>
      <div id="livePanel" data-wp-frame-content="battle">
        <div id="score" class="pw-score" data-wp-frame-info dir="ltr"></div>
        <div id="courtWrap"><canvas id="court" width="600" height="600" tabindex="0"></canvas><div id="courtCue" class="pw-court-cue"></div></div>
        <div class="pw-mode-row"><label id="difficultyLabel" for="difficulty"></label><select id="difficulty"></select></div>
        <p id="gameMessage" role="status" aria-live="polite"></p>
        <div class="pw-controls"><button id="leftBtn">◀</button><button id="serveBtn" class="pw-primary" data-wp-primary-action></button><button id="rightBtn">▶</button></div>
      </div>
      <section id="resultPanel" data-wp-battle-substate="result" hidden><h2 id="resultTitle"></h2><p id="resultScore" dir="ltr"></p><p id="resultCopy"></p><div class="pw-result-actions"><button id="homeBtn"></button><button id="retryBtn" class="pw-primary"></button></div></section>
      <section id="leavePanel" class="pw-leave-overlay" role="dialog" aria-modal="true" aria-labelledby="leaveTitle" aria-describedby="leaveText" hidden><div class="pw-leave-card"><h2 id="leaveTitle"></h2><p id="leaveText"></p><div class="pw-leave-actions"><button id="leaveContinue" class="pw-primary"></button><button id="leaveMain"></button></div></div></section>
    </div>
  </section>
  <div class="pw-compat" hidden aria-hidden="true"><select id="localeSelect" tabindex="-1"></select></div>
</main>`;
  if (initialGuide) {
    initialGuide.id = 'publicGuide';
    initialGuide.classList.add('pw-main');
    document.getElementById('publicGuide').replaceWith(initialGuide);
  }
  const $=id=>document.getElementById(id), canvas=$('court'), ctx=canvas.getContext('2d'), set=(id,text)=>{$(id).textContent=text;};
  const languages={en:'English','zh-Hant':'繁體中文','zh-Hans':'简体中文',ja:'日本語',ko:'한국어',es:'Español','pt-BR':'Português',fr:'Français',de:'Deutsch',it:'Italiano',ru:'Русский',hi:'हिन्दी',ar:'العربية'};
  function localize(){
    t=COPY[locale]; document.documentElement.lang=locale; document.documentElement.dir=locale==='ar'?'rtl':'ltr'; document.title=`${t.title} | WeightPlay`; document.querySelector('h1').textContent=t.title;
    set('summary',t.summary);set('record',`${t.difficulty}: ${[t.easy,t.normal,t.hard][difficulty]} · ${t.wins}: ${wins[difficulty]}`);
    for(const [id,key] of [['startBtn','start'],['retryBtn','again'],['homeBtn','home'],['difficultyLabel','difficulty']])set(id,t[key]);
    $('difficulty').replaceChildren(...[t.easy,t.normal,t.hard].map((name,i)=>new Option(name,i,false,i===difficulty)));
    $('localeSelect').replaceChildren(...Object.entries(languages).map(([key,name])=>new Option(name,key,false,key===locale)));
    for(const [id,label] of [['battleBackBtn',t.home],['leftBtn',t.left],['rightBtn',t.right],['court',t.how]])$(id).setAttribute('aria-label',label);
    const leave=leaveCopy[locale]||leaveCopy.en;
    set('leaveTitle',leave.title);set('leaveContinue',leave.continue);set('leaveMain',leave.leave);
    const back=document.querySelector('[data-wp-return="main"]');back.href=`/${ROUTES[locale]}/`;back.setAttribute('aria-label','WeightPlay');
    if(!initialGuide){$('publicGuide').replaceChildren();for(const text of [t.how,t.tip,t.save]){const p=document.createElement('p');p.textContent=text;$('publicGuide').append(p);}}
    $('publicGuide').setAttribute('aria-label',t.guide);hud();draw();frameApi?.refresh?.();
  }
  function unlockSound() { return window.WeightPlayAudio?.unlock(); }
  function beep(cue = "sport.bounce") { return window.WeightPlayAudio?.play(cue); }
  function stop(){cancelAnimationFrame(frame);frame=0;previous=0;held.clear();}
  function pause(){match.pause();stop();hud();draw();
    __wpNotifyMeasurement();
}
  function hud(){
    $('score').replaceChildren();for(const [name,value,color] of [[t.you,match.you,'you'],[t.cpu,match.them,'cpu']]){const stat=document.createElement('span');stat.className=color;const label=document.createElement('span');label.textContent=name;const number=document.createElement('strong');number.textContent=String(value);stat.append(label,number);$('score').append(stat);}
    set('serveBtn',match.phase==='playing'?t.pause:match.phase==='paused'?t.resume:t.serve);
    set('gameMessage',match.phase==='ready'?t.ready:match.phase==='point'?(match.lastPoint==='you'?t.pointYou:t.pointCpu):match.phase==='paused'?t.pause:t.playing);
    set('courtCue',match.phase==='paused'?t.pause:`${t.serve} · 7`);$('courtCue').hidden=!['ready','paused','point'].includes(match.phase);
    $('difficulty').disabled=screen!=='battle'||match.phase!=='ready'||match.you!==0||match.them!==0;
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
    $('livePanel').hidden=true;$('livePanel').inert=true;$('livePanel').setAttribute('aria-hidden','true');(__wpNotifyMeasurement(), $('resultPanel').hidden=false);document.body.dataset.screen='battle';frameApi?.activate?.('battle',{covered:true});set('resultTitle',match.you===7?t.won:t.lost);set('resultScore',`${match.you} : ${match.them}`);set('resultCopy',`${t.rally}: ${match.bestRally} · ${t.wins}: ${wins[difficulty]}`);$('retryBtn').focus();

    __wpMeasurement.ended = true; __wpMeasurement.outcome = "complete"; if (__wpMeasurement.screen === "battle") __wpMeasurement.screen = null; __wpNotifyMeasurement();
}
  function tick(now){
    frame=0;if(screen!=='battle'||match.phase!=='playing')return;const dt=previous?Math.min((now-previous)/1000,.035):0;previous=now;
    const direction=(held.has('right')?1:0)-(held.has('left')?1:0);if(direction)match.move(match.aim+direction*760*dt);
    const events=match.step(dt);if(events.includes('hit'))beep("sport.bounce");if(events.includes('point')){beep("sport.bounce");hud();}draw();if(match.phase==='finished')finish();else if(match.phase==='playing')frame=requestAnimationFrame(tick);
  }
  function launch(){if(screen!=='battle'||!$('leavePanel').hidden||match.phase==='finished')return;unlockSound();if(match.phase==='playing'){pause();return;}if(match.phase==='paused')match.resume();else match.serve();previous=0;hud();draw();if(!frame)frame=requestAnimationFrame(tick);
    if (!__wpMeasurement.started || __wpMeasurement.ended) { __wpMeasurement.roundKey = {}; __wpMeasurement.restart = Boolean(__wpMeasurement.restart && !__wpMeasurement.started); __wpMeasurement.started = true; __wpMeasurement.ended = false; __wpMeasurement.outcome = "complete"; __wpMeasurement.screen = "battle"; __wpNotifyMeasurement(); }
    __wpNotifyMeasurement();
}
  function start(){stop();closeLeave({resume:false,focus:false});match=new Match(difficulty);screen='battle';document.body.dataset.screen='battle';document.documentElement.classList.add('pw-active');$('mainScreen').hidden=true;$('publicGuide').hidden=true;$('battleScreen').hidden=false;$('livePanel').hidden=false;$('livePanel').inert=false;$('livePanel').removeAttribute('aria-hidden');(__wpNotifyMeasurement(), $('resultPanel').hidden=true);frameApi?.activate?.('battle');window.scrollTo(0,0);hud();draw();$('serveBtn').focus();
    { const __wpNextScreen = ({main:"main",stage:"stage",battle:"battle",})["battle"] ?? null;
      if (["result"].includes("battle") && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "complete"; }
      else if (true && (__wpNextScreen === "main" || __wpNextScreen === "stage") && __wpMeasurement.screen === "battle" && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "abandon"; }
      __wpMeasurement.screen = __wpNextScreen;  __wpNotifyMeasurement(); }
    __wpMeasurement.roundKey = {}; __wpMeasurement.restart = false; __wpMeasurement.started = false; __wpMeasurement.ended = false; __wpMeasurement.outcome = "complete"; __wpNotifyMeasurement();
}
  function home(){stop();closeLeave({resume:false,focus:false});screen='main';document.body.dataset.screen='main';document.documentElement.classList.remove('pw-active');$('mainScreen').hidden=false;$('publicGuide').hidden=false;$('battleScreen').hidden=true;frameApi?.activate?.('main');localize();$('startBtn').focus();
    { const __wpNextScreen = ({main:"main",stage:"stage",battle:"battle",})["main"] ?? null;
      if (["result"].includes("main") && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "complete"; }
      else if (true && (__wpNextScreen === "main" || __wpNextScreen === "stage") && __wpMeasurement.screen === "battle" && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "abandon"; }
      __wpMeasurement.screen = __wpNextScreen;  __wpNotifyMeasurement(); }
}
  function hasMutableMatch(){return screen==='battle' && (match.you!==0||match.them!==0||match.phase==='playing'||match.phase==='paused'||match.phase==='point');}
  function refreshLeaveCopy(){
    const copy=leaveCopy[locale]||leaveCopy.en, mode=[t.easy,t.normal,t.hard][difficulty], score=`${match.you} : ${match.them}`;
    set('leaveTitle',copy.title);set('leaveText',copy.text.replace('{mode}',mode).replace('{score}',score));set('leaveContinue',copy.continue);set('leaveMain',copy.leave);
  }
  function openLeave(){
    if(!hasMutableMatch()){home();return;}
    leaveResumePhase=match.phase;
    if(match.phase==='playing'){match.pause();stop();}else stop();
    refreshLeaveCopy();
    $('livePanel').inert=true;$('livePanel').setAttribute('aria-hidden','true');$('leavePanel').hidden=false;
    frameApi?.activate?.('battle',{covered:true});$('leaveContinue').focus();
  }
  function closeLeave({resume=true,focus=true}={}){
    if(!$('leavePanel')||$('leavePanel').hidden)return;
    $('leavePanel').hidden=true;$('livePanel').inert=false;$('livePanel').removeAttribute('aria-hidden');
    const shouldResume=resume&&leaveResumePhase==='playing';
    leaveResumePhase=null;frameApi?.activate?.('battle');
    if(shouldResume){match.resume();previous=0;hud();draw();if(!frame)frame=requestAnimationFrame(tick);}
    if(focus)$('battleBackBtn').focus();
  }
  $('leavePanel').addEventListener('keydown',e=>{
    if(e.key==='Escape'){e.preventDefault();closeLeave();return;}
    if(e.key!=='Tab')return;
    const focusable=[$('leaveContinue'),$('leaveMain')].filter(node=>!node.disabled);
    const first=focusable[0],last=focusable[focusable.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  });
  $('startBtn').onclick=start;$('retryBtn').onclick=function (...args) { return __wpReplayStart(() => start.apply(this, args)); };$('homeBtn').onclick=home;$('battleBackBtn').onclick=openLeave;$('serveBtn').onclick=launch;
  $('leaveContinue').onclick=()=>closeLeave();$('leaveMain').onclick=()=>{closeLeave({resume:false,focus:false});home();};
  $('difficulty').onchange=()=>{if(screen!=='battle'||match.phase!=='ready'||match.you!==0||match.them!==0)return;difficulty=Number($('difficulty').value);match=new Match(difficulty);persist();localize();};
  $('localeSelect').onchange=()=>{locale=$('localeSelect').value;try{localStorage.setItem('weightPlayLocale',locale);}catch{}localize();};
  for(const [id,key] of [['leftBtn','left'],['rightBtn','right']]){$(id).onpointerdown=e=>{e.preventDefault();$(id).setPointerCapture(e.pointerId);held.add(key);};for(const event of ['pointerup','pointercancel','lostpointercapture'])$(id).addEventListener(event,()=>held.delete(key));}
  const aim=e=>{if(screen!=='battle'||!$('leavePanel').hidden)return;const r=canvas.getBoundingClientRect();match.move((e.clientX-r.left)/r.width*WIDTH);};canvas.onpointerdown=e=>{canvas.setPointerCapture(e.pointerId);aim(e);};canvas.onpointermove=e=>{if(e.pointerType==='mouse'||canvas.hasPointerCapture(e.pointerId))aim(e);};
  window.addEventListener('keydown',e=>{if(screen!=='battle'||!$('leavePanel').hidden||match.phase==='finished')return;const direction=['ArrowLeft','a','A'].includes(e.key)?'left':['ArrowRight','d','D'].includes(e.key)?'right':null;if(direction){e.preventDefault();held.add(direction);}else if(e.code==='Space'&&!e.repeat){e.preventDefault();launch();}else if(e.key==='Escape'){e.preventDefault();pause();}});
  window.addEventListener('keyup',e=>{if(['ArrowLeft','a','A'].includes(e.key))held.delete('left');if(['ArrowRight','d','D'].includes(e.key))held.delete('right');});
  window.addEventListener('blur',pause);document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});window.addEventListener('pagehide',()=>{stop();audio?.close().catch(()=>{});audio=null;});window.addEventListener('resize',()=>{if(screen==='battle')pause();});
  localize();
  frameApi=window.WeightPlayScreenFrame?.mount?.({
    root:$('pongApp'),
    localeSelect:$('localeSelect'),
    scenes:{
      main:{root:$('mainScreen'),header:document.querySelector('#mainScreen > .pw-header'),content:$('mainContent')},
      battle:{root:document.querySelector('.pw-canvas'),header:document.querySelector('.pw-canvas > .pw-hud'),content:$('livePanel'),headerInfo:$('score')}
    }
  })||null;
  frameApi?.activate?.('main');frameApi?.refresh?.();

  if (__wpMeasurement.screen === null && !__wpMeasurement.started) { __wpMeasurement.screen = "main"; __wpNotifyMeasurement(); }
})().catch(error=>console.error('Pong startup failed',error));
