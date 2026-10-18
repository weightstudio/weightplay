/* Hoop League: deterministic rules and a game-owned hold/release basketball loop. */
(() => {
  'use strict';
  const courts = Object.freeze([
    { shots:8, speed:.38, tolerance:.15, pattern:[.58], rival:[0,1,0,1,1,1,1,1], color:'#64e6c0' },
    { shots:8, speed:.43, tolerance:.13, pattern:[.42,.68], rival:[1,1,0,1,1,1,1,1], color:'#63caff' },
    { shots:7, speed:.40, tolerance:.11, pattern:[.38,.72,.55], rival:[1,1,1,1,1,1,2], color:'#ffbd73', perfect:3 },
    { shots:8, speed:.57, tolerance:.105, pattern:[.5,.7,.4], rival:[1,1,1,1,1,1,1,1], color:'#c2a0ff' },
    { shots:8, speed:.48, tolerance:.105, pattern:[.67,.46,.6,.36], rival:[1,2,1,1,1,1,1,1], color:'#ff87a5' },
    { shots:10, speed:.53, tolerance:.095, pattern:[.4,.68,.5,.75,.55], rival:[1,1,1,2,1,1,1,1,2,1], color:'#ffe399' }
  ].map(Object.freeze));
  const challenge = (stage, shot) => {
    const c = courts[Math.max(0, Math.min(5, stage - 1))];
    return { target:c.pattern[shot % c.pattern.length], tolerance:c.tolerance, speed:c.speed };
  };
  const newRound = stage => ({ stage:Math.max(1,Math.min(6,Math.trunc(stage)||1)), shots:0, score:0, rival:0, made:0, perfect:0, streak:0, finished:false, last:null });
  function settle(round, power) {
    if (round.finished || !Number.isFinite(power) || power < 0 || power > 1) return round;
    const c = courts[round.stage - 1], {target,tolerance} = challenge(round.stage, round.shots);
    const delta = power - target, perfect = Math.abs(delta) <= tolerance * .3, made = Math.abs(delta) <= tolerance;
    const points = made ? (perfect ? (c.perfect || 2) : 1) : 0;
    return { ...round, shots:round.shots+1, score:round.score+points, rival:round.rival+c.rival[round.shots], made:round.made+Number(made), perfect:round.perfect+Number(perfect), streak:made?round.streak+1:0, finished:round.shots+1>=c.shots, last:{kind:perfect?'perfect':made?'made':delta<0?'early':'late', points, delta, power, target} };
  }
  globalThis.WeightPlayHoopRules = Object.freeze({courts, challenge, newRound, settle});
  if (typeof document === 'undefined') return;
  const $ = id => document.getElementById(id), locale = window.WeightPlayMarketFiveLocale;
  const common = i => window.wpMarketCommon(i);
  // All action/teaching copy is owned here so the guide never describes the old aim controls.
  const copy = {
    en:['Hold. Find the green zone. Release.','Finish ahead after the final shot. A basket earns 1; a perfect release earns 2 (3 on Bank Court).','HOLD','GREEN ZONE','RELEASE','Hold to shoot','Charging… release in green','Your next shot','PERFECT','BASKET','Too short — hold a little longer','Too strong — release a little earlier','Ball in flight…','COURT CLEARED','SO CLOSE','SHOTS','BEST','YOU','RIVAL','Keep the marker inside the green zone. The thin gold line is perfect.','Space / Enter also work. Leaving the tab cancels your charge.'],
    'zh-Hant':['按住蓄力，進入綠區，放開投籃。','最後一球後，分數比對手高就贏。進球 1 分，完美出手 2 分（擦板球場 3 分）。','按住','進入綠區','放開','按住投籃','蓄力中…進入綠區就放開','準備下一球','完美空心！','進球！','太短了：下次多按住一下','太大力：下次提早放開','籃球飛行中…','球場制霸','再來一場','球數','最佳','你','對手','讓游標落在綠色區域；中央金線就是完美出手。','鍵盤空白鍵／Enter 也能投籃，切換分頁會取消蓄力。'],
    'zh-Hans':['按住蓄力，进入绿区，松开投篮。','最后一球后，分数比对手高就赢。进球 1 分，完美出手 2 分（擦板球场 3 分）。','按住','进入绿区','松开','按住投篮','蓄力中…进入绿区就松开','准备下一球','完美空心！','进球！','太短了：下次多按住一下','太大力：下次提早松开','篮球飞行中…','球场称霸','再来一场','球数','最佳','你','对手','让游标落在绿色区域；中央金线就是完美出手。','键盘空格键／Enter 也能投篮，切换分页会取消蓄力。'],
    ja:['長押し。緑に合わせて離す。','最後のシュート後に相手を上回れば勝利。通常1点、完璧2点（バンクは3点）。','長押し','緑のゾーン','離す','長押しでシュート','緑で離そう','次のシュート','パーフェクト','ゴール','弱すぎ：もう少し長く','強すぎ：もう少し早く離す','ボール飛行中…','コートクリア','もう一度','シュート','ベスト','あなた','相手','緑の中で離す。中央の金線が完璧。','スペース／Enterでも操作。タブを離れるとチャージ取消。'],
    ko:['누르고, 초록 구간에서 놓으세요.','마지막 슛 후 상대보다 높으면 승리. 득점 1, 완벽 2(뱅크 3).','누르기','초록 구간','놓기','눌러서 슛','초록에서 놓으세요','다음 슛','완벽!','골!','짧아요 — 더 오래 누르세요','강해요 — 더 일찍 놓으세요','공이 날아갑니다…','코트 클리어','다시 도전','슛','최고','나','상대','초록 구간에서 놓으세요. 금색 선은 완벽한 슛입니다.','스페이스/Enter 지원. 탭을 떠나면 충전이 취소됩니다.'],
    es:['Mantén. Llega al verde. Suelta.','Acaba por delante. Canasta: 1; perfecta: 2 (3 en Tablero).','MANTÉN','ZONA VERDE','SUELTA','Mantén para tirar','Suelta en verde','Siguiente tiro','PERFECTO','CANASTA','Corto: mantén más tiempo','Fuerte: suelta antes','Balón en vuelo…','CANCHA SUPERADA','OTRO INTENTO','TIROS','MEJOR','TÚ','RIVAL','Suelta dentro del verde. La línea dorada es perfecta.','También Espacio/Enter. Cambiar de pestaña cancela la carga.'],
    'pt-BR':['Segure. Encontre o verde. Solte.','Termine à frente. Cesta: 1; perfeita: 2 (3 na Tabela).','SEGURE','ZONA VERDE','SOLTE','Segure para arremessar','Solte no verde','Próximo arremesso','PERFEITO','CESTA','Curto: segure mais','Forte: solte antes','Bola no ar…','QUADRA VENCIDA','TENTE DE NOVO','ARREMESSOS','MELHOR','VOCÊ','RIVAL','Solte no verde. A linha dourada é perfeita.','Espaço/Enter também funcionam. Sair da aba cancela a carga.'],
    fr:['Maintenez. Visez le vert. Relâchez.','Finissez devant. Panier : 1 ; parfait : 2 (3 au Panneau).','MAINTENEZ','ZONE VERTE','RELÂCHEZ','Maintenir pour tirer','Relâchez dans le vert','Prochain tir','PARFAIT','PANIER','Trop court : maintenez plus','Trop fort : relâchez plus tôt','Ballon en vol…','TERRAIN TERMINÉ','RÉESSAYEZ','TIRS','RECORD','VOUS','RIVAL','Relâchez dans le vert. La ligne dorée est parfaite.','Espace/Entrée aussi. Quitter l’onglet annule la charge.'],
    de:['Halten. Grün treffen. Loslassen.','Am Ende vorne liegen. Korb: 1; perfekt: 2 (Brett: 3).','HALTEN','GRÜNE ZONE','LOSLASSEN','Zum Werfen halten','Im Grünen loslassen','Nächster Wurf','PERFEKT','KORB','Zu kurz: länger halten','Zu stark: früher loslassen','Ball unterwegs…','PLATZ GESCHAFFT','NOCH EINMAL','WÜRFE','REKORD','DU','GEGNER','Im Grünen loslassen. Die goldene Linie ist perfekt.','Auch Leertaste/Enter. Tabwechsel bricht das Laden ab.'],
    it:['Tieni. Trova il verde. Rilascia.','Finisci in vantaggio. Canestro: 1; perfetto: 2 (Tabellone: 3).','TIENI','ZONA VERDE','RILASCIA','Tieni per tirare','Rilascia nel verde','Prossimo tiro','PERFETTO','CANESTRO','Corto: tieni più a lungo','Forte: rilascia prima','Palla in volo…','CAMPO SUPERATO','RIPROVA','TIRI','RECORD','TU','RIVALE','Rilascia nel verde. La linea dorata è perfetta.','Anche Spazio/Invio. Cambiare scheda annulla la carica.'],
    ru:['Удерживай. Попади в зелёное. Отпусти.','Закончи впереди. Корзина: 1; идеально: 2 (Щит: 3).','ДЕРЖИ','ЗЕЛЁНАЯ ЗОНА','ОТПУСТИ','Удерживай для броска','Отпусти в зелёном','Следующий бросок','ИДЕАЛЬНО','ПОПАДАНИЕ','Слабо: держи дольше','Сильно: отпускай раньше','Мяч в полёте…','ПЛОЩАДКА ПРОЙДЕНА','ЕЩЁ РАЗ','БРОСКИ','РЕКОРД','ТЫ','СОПЕРНИК','Отпусти в зелёной зоне. Золотая линия — идеал.','Пробел/Enter тоже работают. Смена вкладки отменяет заряд.'],
    hi:['दबाएँ। हरे में आएँ। छोड़ें।','अंत में प्रतिद्वंद्वी से आगे रहें। बास्केट: 1; सटीक: 2 (बैंक: 3)।','दबाएँ','हरा क्षेत्र','छोड़ें','शॉट के लिए दबाएँ','हरे में छोड़ें','अगला शॉट','सटीक!','बास्केट','कमज़ोर: थोड़ा और दबाएँ','तेज़: पहले छोड़ें','गेंद हवा में…','कोर्ट पूरा','फिर कोशिश','शॉट','सर्वश्रेष्ठ','आप','प्रतिद्वंद्वी','हरे क्षेत्र में छोड़ें। सुनहरी रेखा सटीक शॉट है।','स्पेस/Enter भी। टैब बदलने पर चार्ज रद्द होता है।'],
    ar:['اضغط. انتظر الأخضر. أفلت.','تقدّم بعد آخر رمية. السلة: 1؛ المثالية: 2 (اللوحة: 3).','اضغط','المنطقة الخضراء','أفلت','اضغط للتسديد','أفلت في الأخضر','الرمية التالية','مثالية!','سلة!','قصيرة: اضغط مدة أطول','قوية: أفلت أبكر','الكرة في الهواء…','اكتمل الملعب','حاول مجددًا','الرميات','الأفضل','أنت','المنافس','أفلت داخل الأخضر. الخط الذهبي مثالي.','المسافة/Enter أيضًا. مغادرة التبويب تلغي الشحن.']
  };
  const text = () => copy[locale.locale] || copy.en;
  const key = 'weightplay-hoop-league-best-stage', recordKey='weightplay-hoop-league-records-v2';
  const read = (k, fallback) => {try{return localStorage.getItem(k) || fallback;}catch{return fallback;}};
  let best = Math.max(0,Math.min(6,Number(read(key,0))||0)), records={};
  try { records=JSON.parse(read(recordKey,'{}')); if(!records||Array.isArray(records)||typeof records!=='object')records={}; } catch {}
  const state={screen:'main', round:newRound(1), charging:false, power:0, direction:1, flight:null, paused:false, raf:0, last:0, feedback:'', feedbackUntil:0, pointer:null};
  let roundKey=null,restart=false,ended=false,outcome='complete';
  const readMeasurement=()=>({screen:state.screen==='battle'&&!ended?'battle':state.screen==='result'?null:state.screen,roundKey,started:Boolean(roundKey),ended,outcome,restart,paused:state.paused||document.hidden,node:document.body,activityMode:'input',idleSeconds:300,keyboardKeys:[' ','Enter']});
  const notify=()=>{try{window.WonderAnalytics?.game?.observeState(readMeasurement);}catch{/* Optional shared measurement. */}};
  window.addEventListener('weightplay:analytics-ready',notify);
  const canvas=$('arena'), ctx=canvas.getContext('2d'), hero=new Image(); hero.src='../../assets/weightplay-character-boom-mane-lion-block-v1.webp';
  const css=document.createElement('link'); css.rel='stylesheet'; css.href='interface-7-cleanup.css?v=20261018-hoop-rebuild1'; document.head.append(css);
  const result=$('result-screen'); result.classList.remove('screen'); result.removeAttribute('data-screen'); result.dataset.wpBattleSubstate='result';
  $('stage-screen').style.backgroundImage='none';
  document.querySelector('.m5-cover').src=hero.src;
  $('battle-controls').innerHTML='<div class="hoop-meter-heading"><b id="hoop-meter-label"></b><span id="hoop-shot-count"></span></div><div id="hoop-release-track" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i id="hoop-zone"></i><i id="hoop-perfect"></i><i id="hoop-marker"></i></div><div class="hoop-meter-legend"><span>0</span><strong id="hoop-zone-label"></strong><span>100</span></div><button type="button" data-action="shoot" data-wp-primary-action class="primary-control" id="hoop-shoot"></button>';
  const shoot=$('hoop-shoot'), meter=$('hoop-release-track'), marker=$('hoop-marker');
  const score=document.createElement('div'); score.className='hoop-scoreboard'; score.innerHTML='<div><span id="hoop-you"></span><b id="hoop-score">0</b></div><span class="hoop-score-divider">:</span><div><span id="hoop-rival"></span><b id="hoop-opponent">0</b></div>'; canvas.parentElement.append(score);
  const steps=document.createElement('div'); steps.className='hoop-steps'; steps.innerHTML='<span><b>01</b><i></i></span><span><b>02</b><i></i></span><span><b>03</b><i></i></span>'; document.querySelector('.m5-copy').prepend(steps);
  const help=document.createElement('div'); help.className='hoop-help'; help.hidden=true;help.setAttribute('role','dialog');help.setAttribute('aria-modal','true'); help.innerHTML='<p></p><button type="button">×</button>'; $('battle-screen').append(help);
  help.querySelector('button').onclick=()=>{help.hidden=true;state.paused=false;state.last=performance.now();shoot.focus();};
  const leave=document.createElement('section'); leave.className='hoop-leave-dialog'; leave.hidden=true; leave.setAttribute('role','dialog');leave.setAttribute('aria-modal','true');leave.innerHTML='<div class="hoop-leave-card"><p></p><div class="hoop-leave-actions"><button type="button" id="hoop-continue">▶</button><button type="button" id="hoop-exit">←</button></div></div>'; $('battle-screen').append(leave);
  const sound=id=>window.WeightPlayAudio?.play(id);
  window.WeightPlayAudio?.preload(['game.start','projectile.launch','sport.goal','sport.bounce','result.win','result.lose']);
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  function swap(node,value){
    const next=String(value);if(node.textContent===next)return;node.textContent=next;
    node.getAnimations().forEach(a=>a.cancel());node.animate([{opacity:.45},{opacity:1}],{duration:reduced.matches?70:150});
  }
  const save=()=>{try{localStorage.setItem(key,String(best));localStorage.setItem(recordKey,JSON.stringify(records));}catch{}};
  function progress(){ $('main-progress').textContent=`${text()[16]} · ${best} / 6`; }
  function stageCards(){
    const unlocked=Math.min(6,best+1), names=locale.game().courts;
    $('stage-list').replaceChildren(...courts.map((c,i)=>{
      const b=document.createElement('button');b.className='m5-stage-card stage-card';b.dataset.stage=i+1;b.disabled=i+1>unlocked;b.setAttribute('aria-disabled',String(b.disabled));
      if(i+1===unlocked)b.classList.add('recommended');b.style.setProperty('--court-color',c.color);
      const n=document.createElement('span');n.textContent=String(i+1).padStart(2,'0');
      const title=document.createElement('strong'); title.textContent=names[i];
      const detail=document.createElement('small');detail.textContent=b.disabled?'🔒':`${c.shots} ${text()[15]} · ${text()[18]} ${c.rival.reduce((a,x)=>a+x,0)}`;
      const rec=document.createElement('small');const value=Number(records[i+1])||0;rec.textContent=value?`${text()[16]} ${value} ★`:'—';b.append(n,title,detail,rec);b.onclick=()=>start(i+1);return b;
    }));
    requestAnimationFrame(()=>$('stage-list').querySelector('.recommended')?.scrollIntoView({inline:'center',block:'nearest'}));
  }
  function cancel(){state.charging=false;state.power=0;state.pointer=null;state.input=null;shoot.classList.remove('charging');}
  function show(scene){
    if(scene==='result'){ended=true;outcome=state.round.score>state.round.rival?'win':'lose';}
    else if(state.screen==='battle'&&scene!=='battle'&&!ended){ended=true;outcome='abandon';}
    cancel();state.screen=scene;state.paused=false;help.hidden=true;leave.hidden=true;
    document.body.dataset.screen=scene==='result'?'battle':scene;
    for(const id of ['main','stage','battle']){const node=$(id+'-screen'),on=id===scene||(id==='battle'&&scene==='result');node.hidden=!on;node.classList.toggle('active',on);}
    result.hidden=scene!=='result';
    $('battle-controls').inert=scene==='result';
    window.dispatchEvent(new CustomEvent(scene==='battle'?'weightplay:battle-open':'weightplay:shell-sync'));
    state.last=performance.now();
    notify();
  }
  function start(stage){roundKey={};ended=false;outcome='complete';restart=false;state.round=newRound(stage);state.flight=null;state.feedback='';show('battle');$('stage-label').textContent=locale.game().courts[stage-1];hud();sound('game.start');shoot.focus({preventScroll:true});}
  function hud(){
    const t=text(),r=state.round,c=courts[r.stage-1],ch=challenge(r.stage,Math.min(r.shots,c.shots-1));
    $('score-label').textContent=`${r.shots} / ${c.shots}`;swap($('hoop-score'),r.score);swap($('hoop-opponent'),r.rival);
    $('hoop-shot-count').textContent=`${t[15]} ${Math.min(r.shots+1,c.shots)} / ${c.shots}`;
    $('hoop-zone').style.left=`${(ch.target-ch.tolerance)*100}%`;$('hoop-zone').style.width=`${ch.tolerance*200}%`;
    $('hoop-perfect').style.left=`${ch.target*100}%`;
    shoot.disabled=Boolean(state.flight)||r.finished;shoot.textContent=state.flight?t[12]:state.charging?t[6]:t[5];
    $('hoop-meter-label').textContent=state.charging?t[6]:t[7];
    const status=state.feedback||t[19];swap($('battle-status'),status);canvas.setAttribute('aria-label',`${locale.game().title}. ${status}. ${r.score} : ${r.rival}`);
  }
  function begin(input){if(state.screen!=='battle'||state.paused||state.flight||state.round.finished||state.charging)return;window.WeightPlayAudio?.unlock();state.charging=true;state.input=input;state.power=0;state.direction=1;shoot.classList.add('charging');hud();}
  function release(){
    if(!state.charging||state.screen!=='battle'||state.paused)return;
    const power=state.power;cancel();
    const next=settle(state.round,power);if(next===state.round)return;
    state.flight={t:0,power,kind:next.last.kind,delta:next.last.delta,pending:next};
    state.feedback='';sound('projectile.launch');hud();
  }
  function land(now){
    const f=state.flight;state.round=f.pending;state.flight=null;
    const r=state.round,index={perfect:8,made:9,early:10,late:11}[r.last.kind];state.feedback=`${text()[index]}${r.last.points?` +${r.last.points}`:''}`;state.feedbackUntil=now+1400;
    sound(r.last.points?'sport.goal':'sport.bounce');
    if(r.finished){
      const win=r.score>r.rival;if(win){best=Math.max(best,r.stage);records[r.stage]=Math.max(Number(records[r.stage])||0,r.score);save();}
      $('result-title').textContent=text()[win?13:14];$('result-copy').textContent=`${text()[17]} ${r.score} : ${r.rival} ${text()[18]} · ${r.made}/${courts[r.stage-1].shots} · ${text()[8]} ×${r.perfect}${win?'':` · ${state.feedback}`}`;
      $('next').disabled=!win||r.stage===6;$('next').setAttribute('aria-disabled',String($('next').disabled));show('result');progress();sound(win?'result.win':'result.lose');$('retry').focus({preventScroll:true});
    }
    hud();
  }
  shoot.addEventListener('pointerdown',e=>{if(e.button!==0||state.pointer!==null||state.charging)return;e.preventDefault();begin('pointer');if(state.charging){state.pointer=e.pointerId;shoot.setPointerCapture(e.pointerId);}});
  shoot.addEventListener('pointerup',e=>{if(state.pointer!==e.pointerId)return;e.preventDefault();release();});
  for(const type of ['pointercancel','lostpointercapture'])shoot.addEventListener(type,()=>{if(state.charging){cancel();hud();}});
  window.addEventListener('keydown',e=>{if(![' ','Enter'].includes(e.key)||state.screen!=='battle'||state.paused||document.activeElement?.closest('.hoop-leave-dialog,.hoop-help')||document.activeElement?.tagName==='INPUT')return;if(document.activeElement!==shoot&&document.activeElement!==canvas&&document.activeElement!==document.body)return;e.preventDefault();if(!e.repeat)begin('keyboard');});
  window.addEventListener('keyup',e=>{if([' ','Enter'].includes(e.key)&&state.charging&&state.input==='keyboard'){e.preventDefault();release();}});
  window.addEventListener('blur',()=>{cancel();if(state.screen==='battle')state.paused=true;hud();});
  document.addEventListener('visibilitychange',()=>{cancel();if(document.hidden)state.paused=true;else if(help.hidden&&leave.hidden){state.paused=false;state.last=performance.now();}hud();});
  window.addEventListener('focus',()=>{if(help.hidden&&leave.hidden){state.paused=false;state.last=performance.now();}});
  $('start-game').onclick=()=>{stageCards();show('stage');};$('stage-back').onclick=()=>show('main');
  $('battle-back').onclick=()=>{if(state.screen==='result'){stageCards();show('stage');return;}cancel();state.paused=true;leave.querySelector('p').textContent=`${common(4)}? ${text()[1]}`;leave.hidden=false;$('hoop-continue').textContent=common(1);$('hoop-exit').textContent=common(4);$('hoop-continue').focus();};
  $('hoop-continue').onclick=()=>{leave.hidden=true;state.paused=false;state.last=performance.now();shoot.focus();};
  $('hoop-exit').onclick=()=>{stageCards();show('stage');};
  leave.addEventListener('keydown',e=>{if(e.key==='Escape')$('hoop-continue').click();if(e.key==='Tab'){e.preventDefault();(document.activeElement===$('hoop-continue')?$('hoop-exit'):$('hoop-continue')).focus();}});
  $('battle-utility').onclick=()=>{cancel();state.paused=true;help.querySelector('p').textContent=`${text()[0]} ${text()[1]} ${text()[20]}`;help.hidden=false;help.querySelector('button').setAttribute('aria-label',common(3));help.querySelector('button').focus();};
  help.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();help.querySelector('button').click();}if(e.key==='Tab'){e.preventDefault();help.querySelector('button').focus();}});
  const overlayObserver=new MutationObserver(()=>{
    const blocked=!help.hidden||!leave.hidden;
    for(const node of $('battle-screen').children)if(node!==help&&node!==leave)node.inert=blocked;
    if(!blocked)$('battle-controls').inert=state.screen==='result';
  });
  overlayObserver.observe(help,{attributes:true,attributeFilter:['hidden']});overlayObserver.observe(leave,{attributes:true,attributeFilter:['hidden']});
  $('to-stages').onclick=()=>{stageCards();show('stage');};$('retry').onclick=()=>{start(state.round.stage);restart=true;notify();};$('next').onclick=()=>{if(state.round.score>state.round.rival&&state.round.stage<6)start(state.round.stage+1);};
  function localize(){
    const t=text();document.querySelectorAll('[data-m5-lede]').forEach(n=>n.textContent=t[0]);document.querySelectorAll('[data-m5-guide]').forEach(n=>n.textContent=`${t[1]} ${t[19]} ${t[20]}`);
    steps.querySelectorAll('i').forEach((n,i)=>n.textContent=t[i+2]);$('hoop-zone-label').textContent=t[3];$('hoop-you').textContent=t[17];$('hoop-rival').textContent=t[18];meter.setAttribute('aria-label',t[3]);progress();stageCards();hud();
    document.querySelectorAll('.game-info-tags > span').forEach((n,i)=>n.textContent=t[i+2]);
  }
  window.addEventListener('weightplay:market-locale-change',localize);
  window.addEventListener('weightplay:interaction-state',()=>{
    const settingsOpen=[...document.querySelectorAll('.wp-frame-popover')].some(n=>!n.hidden);
    if(settingsOpen){cancel();state.paused=true;}
    else if(help.hidden&&leave.hidden){state.paused=false;state.last=performance.now();}
  });
  function ball(x,y,r,spin=0){ctx.save();ctx.translate(x,y);ctx.rotate(spin);ctx.fillStyle='#ff9c47';ctx.strokeStyle='#512c26';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(-r,0);ctx.lineTo(r,0);ctx.moveTo(0,-r);ctx.lineTo(0,r);ctx.ellipse(0,0,r*.48,r,0,0,Math.PI*2);ctx.stroke();ctx.restore();}
  function draw(now){
    const w=canvas.parentElement.clientWidth,h=canvas.parentElement.clientHeight;if(!w||!h)return;
    const dpr=Math.min(2,devicePixelRatio||1);if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
    ctx.setTransform(dpr,0,0,dpr,0,0);const bg=ctx.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#102941');bg.addColorStop(1,'#081b2c');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
    const scale=Math.min(w/860,h/460),ox=w/2-480*scale,oy=0;
    const worldH=h/scale, rimY=Math.max(175,worldH*.33), handY=worldH-155, floorY=worldH-25;
    ctx.save();ctx.translate(ox,oy);ctx.scale(scale,scale);
    const c=courts[state.round.stage-1];
    // Faceted skyline and full-width court use the same projection at every viewport.
    for(let i=0;i<14;i++){const x=i*76-30,hh=50+(i*37%90);ctx.fillStyle=i%2?'#193c52':'#20485b';ctx.fillRect(x,rimY+55-hh,62,hh);ctx.fillStyle='#315d69';ctx.fillRect(x,rimY+55-hh,12,hh);}
    ctx.fillStyle='#39706b';ctx.beginPath();ctx.moveTo(120,rimY+55);ctx.lineTo(840,rimY+55);ctx.lineTo(1040,worldH);ctx.lineTo(-80,worldH);ctx.fill();
    ctx.strokeStyle='#b4e9cc80';ctx.lineWidth=3;ctx.strokeRect(100,rimY+100,760,Math.max(80,floorY-rimY-100));ctx.beginPath();ctx.ellipse(480,(floorY+rimY+100)/2,120,60,0,0,Math.PI*2);ctx.moveTo(480,rimY+100);ctx.lineTo(480,floorY);ctx.stroke();
    ctx.save();ctx.translate(0,rimY-238);
    ctx.fillStyle='#152b40';ctx.fillRect(761,157,18,252);ctx.fillStyle='#8db5c4';ctx.fillRect(670,120,170,116);ctx.fillStyle='#edf2db';ctx.fillRect(678,128,154,100);ctx.strokeStyle='#ff795c';ctx.lineWidth=5;ctx.strokeRect(724,168,62,49);
    ctx.strokeStyle=c.color;ctx.lineWidth=7;ctx.beginPath();ctx.ellipse(727,238,48,10,0,0,Math.PI*2);ctx.stroke();
    ctx.strokeStyle='#eff6e2b0';ctx.lineWidth=2;for(let i=0;i<7;i++){ctx.beginPath();ctx.moveTo(681+i*15,240);ctx.lineTo(699+i*9,288);ctx.stroke();}ctx.beginPath();ctx.moveTo(700,288);ctx.lineTo(753,288);ctx.stroke();
    ctx.restore();
    const jump=state.flight?Math.sin(Math.min(1,state.flight.t)*Math.PI)*14:state.charging?-state.power*9:0;
    ctx.fillStyle='#07152265';ctx.beginPath();ctx.ellipse(242,floorY-9,90,17,0,0,Math.PI*2);ctx.fill();
    if(hero.complete&&hero.naturalWidth)ctx.drawImage(hero,105,floorY-250-jump,250,250);else{ctx.fillStyle='#ffc35b';ctx.fillRect(170,floorY-185-jump,110,160);}
    // The dotted guide previews a made shot; actual miss endpoints use released power.
    ctx.save();ctx.setLineDash([5,13]);ctx.strokeStyle=state.charging?'#b0f4d0b0':'#b0f4d03c';ctx.lineWidth=3;ctx.beginPath();
    const target=challenge(state.round.stage,state.round.shots).target;
    for(let i=0;i<=30;i++){const t=i/30,x=310+(727-310)*t,y=handY+(rimY-handY)*t-(170+target*130)*Math.sin(Math.PI*t);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
    ctx.stroke();ctx.restore();
    if(state.flight){const f=state.flight,t=Math.min(1,f.t),made=['perfect','made'].includes(f.kind),ex=made?727:727+f.delta*420,ey=made?rimY:rimY+54+Math.abs(f.delta)*65;const x=310+(ex-310)*t,y=handY+(ey-handY)*t-(170+f.power*130)*Math.sin(Math.PI*t);ball(x,y,21,t*8);}
    else ball(310,handY-jump,21,state.power*.4);
    ctx.restore();
  }
  function frame(now){
    const dt=Math.min(.05,Math.max(0,(now-state.last)/1000));state.last=now;
    if(state.screen==='battle'&&!state.paused){
      if(state.charging){state.power+=dt*challenge(state.round.stage,state.round.shots).speed*state.direction;if(state.power>=1){state.power=1;state.direction=-1;}if(state.power<=0){state.power=0;state.direction=1;}}
      if(state.flight){state.flight.t+=dt/1.05;if(state.flight.t>=1)land(now);}
      if(state.feedback&&now>state.feedbackUntil&&!state.round.finished){state.feedback='';hud();}
    }
    marker.style.left=`${state.power*100}%`;meter.setAttribute('aria-valuenow',String(Math.round(state.power*100)));
    const ch=challenge(state.round.stage,state.round.shots);meter.classList.toggle('in-zone',state.charging&&Math.abs(state.power-ch.target)<=ch.tolerance);
    if(state.screen==='battle'||state.screen==='result')draw(now);state.raf=requestAnimationFrame(frame);
  }
  document.body.dataset.gameVersion='v9';document.body.dataset.interfaceVersion='6';
  const ready=()=>{localize();show('main');$('loadingPanel').hidden=true;$('loadingPanel').classList.add('hidden');};
  Promise.all([hero.decode(),new Promise(resolve=>css.addEventListener('load',resolve,{once:true}))]).then(ready).catch(()=>{const panel=$('loadingPanel');panel.textContent='Unable to load court. Please reload.';});
  state.last=performance.now();state.raf=requestAnimationFrame(frame);
  window.addEventListener('pagehide',()=>{cancel();cancelAnimationFrame(state.raf);},{once:true});
  window.addEventListener('pageshow',e=>{if(e.persisted){state.last=performance.now();state.raf=requestAnimationFrame(frame);}});
})();
