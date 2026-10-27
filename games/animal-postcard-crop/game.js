/* v7: measured atlas windows; shared Stage/flow and original artwork preserved. */
(async () => {
  'use strict';
  const E=window.PostcardCropEngine, legacyCards=window.PostcardCropCards;
  // All new dependencies must be present before exposing any new stage.
  // A timed-out import may finish later but cannot alter this settled decision.
  let campaign=null,loadTimer;
  try {
    const modules=await Promise.race([
      Promise.all([
        import('/games/animal-postcard-crop/chapter1-rules.mjs?v=postcard-v9'),
        import('/games/animal-postcard-crop/stage60-model.mjs?v=postcard-v9'),
        import('/games/animal-postcard-crop/stage60-copy.js?v=postcard-v9'),
        import('/games/animal-postcard-crop/stage60-guide.js?v=postcard-v9')
      ]),
      new Promise((_,reject)=>{loadTimer=setTimeout(()=>reject(new Error('CAMPAIGN_TIMEOUT')),4000);})
    ]);
    const chapter=modules[0].createChapter1Rules({engine:E,cards:legacyCards}),dual=modules[1].createStage60(E);
    const copy=window.PostcardCropStage60Copy,guide=window.PostcardCropStage60Guide;
    if(chapter.cards.length!==30||dual.stages.length!==30||dual.stages.some((s,i)=>s.id!==i+31)||!copy?.locales||!guide?.locales)throw new Error('CAMPAIGN_INVALID');
    const required=['en','zh-Hant','zh-Hans','ja','ko','es','pt-BR','fr','de','it','ru','hi','ar'];
    const schema={ui:['chapterOneExtra','chapterTwo','firstPhoto','secondPhoto','choosePin','pinSelected','firstTargets','secondTargets','firstAvoid','secondAvoid','frameSize','pinFirst','pinSecond','differentPosition','differentSize','differentOrientation','waypointPending','waypointSeen','lens','lensUsed','undo','unreachable','selectPinHint','captureHint','lensHint','moveHint','questionPrompt','answerWrong','answerCorrect','journalFull'],positions:['left','top','bottom','top-left','top-right','bottom-left','bottom-right','top-corner','middle-column','top-middle','bottom-middle','corner','edge-not-corner'],conditions:['corner','upper-left','upper-right','bottom-middle','middle-column','visit-before-capture'],questions:['5','10','15','20'],choices:['up','right','down','left','1x3','3x1','2x3','3x2','upper-left','upper-right','lower-left','lower-right']};
    if(required.some(lang=>!guide.locales[lang]||Object.entries(schema).some(([group,names])=>names.some(name=>typeof copy.locales[lang]?.[group]?.[name]!=='string'||!copy.locales[lang][group][name].trim()))))throw new Error('CAMPAIGN_LOCALE_MISSING');
    if(chapter.cards.some((_,i)=>!chapter.solve(i+1))||dual.stages.some(s=>!Number.isSafeInteger(dual.shortest(s.id))))throw new Error('CAMPAIGN_UNSOLVABLE');
    campaign={chapter,dual,copy,guide};
  } catch {campaign=null;} finally {clearTimeout(loadTimer);}
  const cards=campaign?[...campaign.chapter.cards,...campaign.dual.stages.map(s=>({...s,chapter:4,targets:s.first,avoid:s.avoid||[],corner:null,rotate:true,dual:true}))]:legacyCards;
  document.body.dataset.postcardStageCount=String(cards.length);
  document.dispatchEvent(new CustomEvent('weightplay:postcard-campaign-ready'));
  const packs=window.ANIMAL_POSTCARD_CROP_LOCALES, keys=window.ANIMAL_POSTCARD_CROP_LOCALE_KEYS;
  const routeNames=['en','zh-tw','zh-cn','ja','ko','es','pt-br','fr','de','it','ru','hi','ar'];
  const $=id=>document.getElementById(id), abort=new AbortController();
  const on=(node,type,fn,options={})=>node.addEventListener(type,fn,{...options,signal:abort.signal});
  const read=key=>{try{return localStorage.getItem(key);}catch{return null;}};
  const requested=new URLSearchParams(location.search).get('lang');
  const pathLocale=routeNames.indexOf(location.pathname.split('/')[1]);
  const locale=pathLocale>=0?keys[pathLocale]:keys.find(k=>k===requested)||keys.find(k=>k===(read('weightPlayLocale')||read('wp-locale')))||keys.find(k=>k===document.documentElement.lang)||'en';
  const L=packs[locale];
  const t=(key,args={})=>{const text=L.ui[key];if(typeof text!=='string')throw new Error(`Missing native copy: ${locale}/${key}`);return text.replace(/\{(\w+)\}/g,(_,k)=>String(args[k]??''));};
  const X=campaign?.copy.locales[locale];
  const xt=(key,args={})=>{const text=X?.ui?.[key];if(typeof text!=='string')throw new Error(`Missing campaign copy: ${locale}/${key}`);return text.replace(/\{(\w+)\}/g,(_,k)=>String(args[k]??''));};
  const fill=(text,args={})=>text.replace(/\{(\w+)\}/g,(_,k)=>String(args[k]??''));
  const chapterTitle=card=>card.dual?xt('chapterTwo'):card.number>=25?xt('chapterOneExtra'):L.chapters[card.chapter];
  function details(card){
    if(!campaign)return [];
    if(!card.dual)return (card.conditions||[]).map(c=>fill(X.conditions[c.kind],{name:L.scenes[c.id]}));
    const parts=[`${xt('firstTargets')}: ${card.first.map(i=>L.scenes[i]).join(' · ')}`,`${xt('secondTargets')}: ${card.second.map(i=>L.scenes[i]).join(' · ')}`];
    if(card.firstAvoid.length)parts.push(`${xt('firstAvoid')}: ${card.firstAvoid.map(i=>L.scenes[i]).join(' · ')}`);
    if(card.avoid.length)parts.push(`${xt('secondAvoid')}: ${card.avoid.map(i=>L.scenes[i]).join(' · ')}`);
    if(card.firstShape)parts.push(`${xt('firstPhoto')}: ${xt('frameSize',{w:card.firstShape[0],h:card.firstShape[1]})}`);
    if(card.secondShape)parts.push(`${xt('secondPhoto')}: ${xt('frameSize',{w:card.secondShape[0],h:card.secondShape[1]})}`);
    if(card.firstPosition)parts.push(xt('pinFirst',{position:X.positions[card.firstPosition]}));
    if(card.secondPosition)parts.push(xt('pinSecond',{position:X.positions[card.secondPosition]}));
    if(card.differentPosition)parts.push(xt('differentPosition'));
    if(card.differentSize)parts.push(xt('differentSize'));
    if(card.differentOrientation)parts.push(xt('differentOrientation'));
    if(card.waypoint!==undefined)parts.push(xt('waypointPending',{name:L.scenes[card.waypoint]}));
    return parts;
  }
  const asset='/games/animal-postcard-crop/assets/';
  const stage=$('stageScreen');
  // Generated routes may replace #gameGuide with an anonymous shared guide.
  // Optional document content must never interrupt a gameplay transition.
  const guides=[...document.querySelectorAll('[data-wp-game-guide],.game-page-info')];
  if (!$('gameGuide') && guides[0]) guides[0].id='gameGuide';
  const showGuides=visible=>guides.forEach(node=>{node.hidden=!visible;});
  let browseIndex=0;
  const unlockedIndex=()=>{
    const old=save.medals.slice(0,24).findLastIndex(value=>value>0);
    let highest=Math.min(23,Math.max(0,old+1));
    if(cards.length>24&&save.medals[23]>0){highest=24;while(highest<cards.length-1&&save.medals[highest]>0)highest++;}
    return highest;
  };
  const isUnlocked=index=>index>=0&&index<cards.length&&(index<=unlockedIndex()||(index>=24&&save.medals[index]>0));
  const stageLabels={
    en:['Stages','Swipe to browse. Tap an unlocked card to play.','Locked','Ready','Cleared'],
    'zh-Hant':['關卡','左右滑動選關，點擊已解鎖的明信片開始遊玩。','未解鎖','可挑戰','已完成'],
    'zh-Hans':['关卡','左右滑动选关，点击已解锁的明信片开始游戏。','未解锁','可挑战','已完成'],
    ja:['ステージ','左右にスワイプ。開放済みのカードをタップして開始。','未開放','挑戦可能','クリア'],
    ko:['스테이지','좌우로 넘기고 열린 카드를 눌러 시작하세요.','잠김','도전 가능','완료'],
    es:['Niveles','Desliza para elegir. Toca una tarjeta desbloqueada.','Bloqueado','Disponible','Completado'],
    'pt-BR':['Fases','Deslize para escolher. Toque em um cartão liberado.','Bloqueada','Disponível','Concluída'],
    fr:['Niveaux','Faites glisser, puis touchez une carte débloquée.','Verrouillé','Disponible','Terminé'],
    de:['Level','Wischen zum Blättern. Freie Karte antippen.','Gesperrt','Bereit','Abgeschlossen'],
    it:['Livelli','Scorri e tocca una cartolina sbloccata.','Bloccato','Disponibile','Completato'],
    ru:['Уровни','Листайте и нажмите на открытую карточку.','Закрыто','Доступно','Пройдено'],
    hi:['स्तर','चुनने के लिए स्वाइप करें। खुले कार्ड पर टैप करें।','बंद','उपलब्ध','पूरा'],
    ar:['المراحل','اسحب للتصفح، ثم اضغط بطاقة مفتوحة للعب.','مغلقة','متاحة','مكتملة']
  }[locale];
  let storageOK=true,storageProtected=false,save;
  try {
    const raw=localStorage.getItem('weightplay-postcard-album-v5');
    const parsed=raw===null?{version:5,medals:[]}:JSON.parse(raw);
    if(!parsed||typeof parsed!=='object'||Array.isArray(parsed)||parsed.version!==5||!Array.isArray(parsed.medals))throw new Error('INVALID_SAVE');
    if(parsed.medals.some(v=>!Number.isInteger(v)||v<0||v>3)){storageProtected=true;storageOK=false;}
    save={...parsed,medals:parsed.medals.map(v=>Number.isInteger(v)&&v>=0&&v<=3?v:0)};
  } catch {storageOK=false;storageProtected=true;save={version:5,medals:[]};}
  while(save.medals.length<Math.max(60,cards.length))save.medals.push(0);
  let state={screen:'main',mode:'idle',index:0,pose:{...cards[0].start},moves:0,errors:0,hinted:false,par:0};
  let epoch=0,gesture=null,previousFocus=null;
  // The shared lifecycle owns collection/reward issuance. Medals and reward
  // receipts are separate: the shared stage ledger alone deduplicates grants.
  const measurement={screen:'main',roundKey:null,started:false,ended:false,outcome:'complete',stageId:null,rewardEligible:false,saveSucceeded:null,restart:false,paused:false};
  const readMeasurement=()=>({...measurement,screen:measurement.screen==='battle'&&measurement.ended&&measurement.outcome==='complete'?null:measurement.screen,stageIdAuthoritative:true,locale,node:document.body,activityMode:'input',idleSeconds:300});
  // Older cached collectors can ignore either gate and issue a reward before
  // a failed save. Stay silent until both shared capabilities are present.
  const notifyMeasurement=()=>{try{const game=window.WonderAnalytics?.game;if(game?.supportsRewardEligibility===true&&game?.supportsSavedCompletionGate===true)game.observeState(readMeasurement);}catch{}};
  function measurementScreen(screen){
    if(screen!=='battle'&&measurement.started&&!measurement.ended){measurement.ended=true;measurement.outcome='abandon';}
    measurement.screen=screen;measurement.paused=false;notifyMeasurement();
  }
  function measurementStart(index,restart){
    Object.assign(measurement,{screen:'battle',roundKey:{},started:true,ended:false,outcome:'complete',stageId:index+1,rewardEligible:!storageProtected,saveSucceeded:null,restart,paused:false});
    const round=measurement.roundKey;notifyMeasurement();
    queueMicrotask(()=>{if(measurement.roundKey===round)measurement.restart=false;});
  }
  function measurementComplete(){
    const round=measurement.roundKey;
    // The shared observer reads in a microtask; do not collapse start and win
    // into a single snapshot even when input dispatches happen synchronously.
    const saved=storageOK;
    queueMicrotask(()=>{if(round&&measurement.roundKey===round&&!measurement.ended){measurement.ended=true;measurement.outcome='complete';measurement.saveSucceeded=saved;notifyMeasurement();}});
  }
  on(window,'weightplay:analytics-ready',notifyMeasurement);notifyMeasurement();
  const timers=new Set(),animations=new Set(),reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const audio=window.WeightPlayAudio?.createScope?.();
  const sound=id=>audio?.play(id);
  function later(fn,ms){const ticket=epoch;const id=setTimeout(()=>{timers.delete(id);if(ticket===epoch)fn();},reduce.matches?0:ms);timers.add(id);}
  function cancelMotion(){epoch++;for(const timer of timers)clearTimeout(timer);timers.clear();for(const anim of animations)anim.cancel();animations.clear();gesture=null;}
  function tween(node,frames,duration=240){
    if(reduce.matches||document.hidden||!node.animate)return;
    const a=node.animate(frames,{duration,easing:'cubic-bezier(.2,.8,.2,1)',fill:'none'});animations.add(a);
    a.finished.catch(()=>{}).finally(()=>animations.delete(a));
  }
  const button=(action,label=action,primary=false)=>`<button type="button" data-act="${action}" data-copy="${label}" data-wp-frame-action="${primary?'primary':'secondary'}"></button>`;
  const battle=document.createElement('section');
  battle.id='battleScreen';battle.hidden=true;battle.className='pc-battle';battle.dataset.screen='battle';
  Object.assign(battle.dataset,{wpBattleCanvasRoot:'',wpLogicalBattleCanvas:'',wpBattleMinWidth:'390',wpBattleMinHeight:'640',wpBattleLandscapeWidth:'760',wpBattleLandscapeHeight:'334',wpFramePlayFill:'',wpFrameLogicalHeader:'battle',wpBattleReturnOnly:''});
  battle.innerHTML=`<header id="battleHeader"><button type="button" id="battleBack" data-wp-return="battle" data-act="back" data-label="back"></button><h2 data-wp-frame-title data-wp-game-title data-runtime-localize="off">Postcard Crop</h2></header>
    <div id="battleContent" class="pc-workspace" data-wp-frame-content="battle">
      <div id="battleInfo" data-wp-frame-info><div><span data-copy="card"></span><strong id="cardCount"></strong></div><div><span data-copy="moves"></span><strong id="moveCount"></strong></div><div><span data-copy="par"></span><strong id="parCount"></strong></div></div>
      <section class="pc-clues"><p id="chapterName"></p><p><strong data-copy="include"></strong> <span id="targetText"></span></p><p><strong data-copy="exclude"></strong> <span id="avoidText"></span></p><p id="cornerText"></p></section>
      <div id="challengeArea" class="pc-challenge" role="group" hidden></div><div id="pinControls" class="pc-pin-controls" role="group" hidden></div>
      <div id="sceneTrack" class="pc-scene-track"><div id="sceneGrid" class="pc-scene" role="group" tabindex="0" aria-describedby="positionText battleStatus"><div id="tileLayer" class="pc-tiles"></div><div id="postcardFrame" class="pc-frame" aria-hidden="true"></div><div id="captureLight" class="pc-capture-light" aria-hidden="true"></div></div></div>
      <div class="pc-status"><p id="battleStatus" role="status" aria-live="polite"></p><p id="positionText" class="pc-sr-only"></p></div>
      <div class="pc-controls" data-wp-frame-logical-actions="battle"><div class="pc-directions" dir="ltr">${button('left')}${button('up')}${button('down')}${button('right')}</div><div class="pc-tools">${button('rotate')}${button('hint')}${button('reset')}<button type="button" data-act="undo" class="pc-tool-extra" hidden></button><button type="button" data-act="lens" class="pc-tool-extra" hidden></button>${button('capture','capture',true)}</div></div>
    </div>
    <div id="resultPanel" class="pc-overlay" role="dialog" aria-modal="true" aria-labelledby="resultHeading" hidden><div class="pc-result-card"><img src="${asset}animal-postcard-crop-orla-v1.webp" width="120" height="120" alt=""><h2 id="resultHeading"></h2><p id="resultStars" class="pc-stars"></p><p id="resultText"></p><p id="albumProgress"></p><p id="saveStatus" role="status"></p><div class="pc-result-actions" data-wp-frame-logical-actions="battle">${button('stages','back')}${button('next','next',true)}${button('replay')}</div></div></div>
    <div id="leavePanel" class="pc-overlay" role="dialog" aria-modal="true" aria-labelledby="leaveHeading" hidden><div class="pc-result-card"><h2 id="leaveHeading" data-copy="leaveTitle"></h2><p data-copy="leaveBody"></p><div class="pc-result-actions" data-wp-frame-logical-actions="battle">${button('stay','stay',true)}${button('leave')}</div></div></div>`;
  $('app').append(battle);
  const reserveHeight=window.WeightPlayLayout?.reserveHeight||0;
  const reserve=reserveHeight>0?document.createElement('div'):null;
  if(reserve){reserve.className='battle-ad-reserve';reserve.style.height=`${reserveHeight}px`;reserve.setAttribute('aria-hidden','true');reserve.hidden=true;$('app').append(reserve);}
  // Main alone owns the language selector. The shared frame creates all settings UI.
  const select=document.createElement('select');select.hidden=true;select.id='locale-select';
  keys.forEach((key,i)=>select.add(new Option(window.PostcardCropLanguageNames[i],key)));select.value=locale;$('app').append(select);
  const official=window.WEIGHTPLAY_GAME_TITLES?.['animal-postcard-crop']?.[locale]||L.title;
  document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';
  document.querySelectorAll('[data-copy]').forEach(n=>n.textContent=t(n.dataset.copy));
  document.querySelectorAll('[data-label]').forEach(n=>n.setAttribute('aria-label',t(n.dataset.label)));
  document.querySelectorAll('[data-wp-game-title]').forEach(n=>n.textContent=official);
  // Main copy is native even when the route generator replaces guide markup.
  const summary=document.querySelector('[data-wp-frame-summary]');
  if(summary){summary.textContent=L.mainSummary||L.summary;if(summary.previousElementSibling?.tagName==='P')summary.previousElementSibling.textContent=L.page.status;}
  const guideLink=document.querySelector('#mainContent a[href="#gameGuide"]');if(guideLink)guideLink.textContent=t('guide');
  $('startButton').textContent=t('start');
  const frame=window.WeightPlayScreenFrame.mount({root:$('app'),localeSelect:select,playUI:true,scenes:{
    main:{root:$('mainScreen'),header:$('mainHeader'),content:$('mainContent')},
    stage:{root:$('stageScreen'),header:$('stageHeader'),content:$('stageWorkspace'),headerInfo:$('stageHeaderInfo')},
    battle:{root:battle,header:$('battleHeader'),content:$('battleContent'),headerInfo:$('battleInfo')}
  }});
  const stageUI=window.WeightPlayPlayUI.mountStage({
    page:$('stageWorkspace'),rail:$('stageRail'),selected:unlockedIndex(),
    config:{
      gameId:'animal-postcard-crop',count:cards.length,
      poster:asset+'animal-postcard-crop-cover-v2.webp',
      stage(index){
        const card=cards[index],locked=!isUnlocked(index),medal=save.medals[index];
        const targets=card.targets.map(value=>L.scenes[value]).join(' · ');
        const avoid=card.avoid.map(value=>L.scenes[value]).join(' · ');
        const extra=details(card),summary=card.dual?extra.join(' · '):`${t('include')}: ${targets} · ${t('exclude')}: ${avoid}${extra.length?' · '+extra.join(' · '):''}`;
        return {
          id:index+1,
          kicker:`${t('card')} ${new Intl.NumberFormat(locale).format(index+1)} / ${new Intl.NumberFormat(locale).format(cards.length)}`,
          title:chapterTitle(card),subtitle:targets,
          status:locked?stageLabels[2]:medal?`${stageLabels[4]} · ${'★'.repeat(medal)}${'☆'.repeat(3-medal)}`:stageLabels[3],
          summary,details:[stageLabels[1],summary,card.corner===null?'':t('corner',{name:L.scenes[card.corner]})],
          locked,cleared:Boolean(medal),poster:asset+'animal-postcard-crop-cover-v2.webp'
        };
      }
    },
    onSelect(index){browseIndex=index;},onStart:index=>startCard(index),
    isActive:()=>$('app').dataset.wpFrameActive==='stage'
  });
  $('stagesTab').textContent=stageLabels[0];$('stagesTab').setAttribute('aria-label',stageLabels[0]);
  $('stageRail').setAttribute('aria-label',stageLabels[0]);
  $('resultPanel').querySelector('[data-act="stages"]').textContent=stageLabels[0];
  function showStages(index=unlockedIndex()){
    cancelMotion();audio?.stop();browseIndex=Math.max(0,Math.min(cards.length-1,index));
    state.screen='stage';state.mode='idle';measurementScreen('stage');battle.hidden=true;$('mainScreen').hidden=true;showGuides(false);
    $('resultPanel').hidden=true;$('leavePanel').hidden=true;$('battleContent').inert=false;stage.hidden=false;
    $('stageProgress').textContent=progress();
    if(reserve)reserve.hidden=false;
    frame.activate('stage');stageUI.refresh(browseIndex);
    $('stageRail').querySelector('[aria-current="true"]')?.focus({preventScroll:true});
  }
  on(select,'change',()=>{
    const i=keys.indexOf(select.value);if(i<0)return;
    try{for(const key of ['weightPlayLocale','weightplayLocale','wp-locale'])localStorage.setItem(key,select.value);}catch{}
    const url=new URL(location.href);url.pathname=`/${routeNames[i]}/games/animal-postcard-crop/`;url.searchParams.delete('lang');location.assign(url.href);
  });
  // The atlas identity is fixed; tile DOM is built once and only its content changes per card.
  const tiles=Array.from({length:12},()=>{const n=document.createElement('div');n.className='pc-tile';n.setAttribute('role','img');const label=document.createElement('span');label.setAttribute('aria-hidden','true');n.append(label);$('tileLayer').append(n);return n;});
  function fitBoard(){const track=$('sceneTrack');const width=Math.min(track.clientWidth,track.clientHeight*4/3);if(width>0){$('sceneGrid').style.width=`${width}px`;$('sceneGrid').style.height=`${width*3/4}px`;}}
  const resize=new ResizeObserver(fitBoard);resize.observe($('sceneTrack'));
  function progress(){const current=save.medals.slice(0,cards.length),count=current.filter(Boolean).length,total=current.reduce((a,b)=>a+b,0);return `${t('album')} ${count}/${cards.length} · ${t('stars')} ${total}/${cards.length*3}`;}
  function persist(){
    if(storageProtected){storageOK=false;return;}
    try{
      const key='weightplay-postcard-album-v5',serialized=JSON.stringify(save);
      localStorage.setItem(key,serialized);
      if(localStorage.getItem(key)!==serialized)throw new Error('SAVE_UNCONFIRMED');
      storageOK=true;
    }catch{storageOK=false;}
  }
  function showMain(){
    cancelMotion();audio?.stop();state.screen='main';state.mode='idle';measurementScreen('main');
    battle.hidden=true;stage.hidden=true;if(reserve)reserve.hidden=true;$('mainScreen').hidden=false;showGuides(true);
    $('resultPanel').hidden=true;$('leavePanel').hidden=true;$('battleContent').inert=false;
    frame.activate('main');$('mainProgress').textContent=progress();$('startButton').focus({preventScroll:true});
  }
  function syncAttempt(){
    const attempt=state.dualAttempt||state.chapterAttempt;if(!attempt)return;
    const current=state.dualAttempt?attempt.state:attempt;
    state.pose={...current.pose};state.moves=attempt.moves;state.errors=attempt.errors;state.hinted=attempt.hinted;
  }
  function renderAuxiliary(){
    const challenge=$('challengeArea'),pins=$('pinControls'),card=cards[state.index];
    const focused=document.activeElement,focusedAnswer=challenge.contains(focused)?focused?.dataset?.answer:null,focusedPin=pins.contains(focused)?focused?.dataset?.pinId:null;
    challenge.replaceChildren();pins.replaceChildren();challenge.hidden=true;pins.hidden=true;
    const c=state.chapterAttempt;
    if(c&&c.gate==='pending'){
      const question=campaign.chapter.questions[c.number],p=document.createElement('p');p.textContent=X.questions[c.number];challenge.setAttribute('aria-label',X.questions[c.number]);challenge.append(p);
      for(const choice of question.choices){const b=document.createElement('button');b.type='button';b.dataset.answer=choice;b.textContent=X.choices[choice];challenge.append(b);}
      if(c.feedback==='wrong'){const p=document.createElement('p');p.setAttribute('role','status');p.textContent=xt('answerWrong');challenge.append(p);}
      challenge.hidden=false;
    }
    const a=state.dualAttempt;
    if(a&&a.state.phase==='pin'){
      const p=document.createElement('p');p.textContent=xt('choosePin');pins.setAttribute('aria-label',xt('choosePin'));pins.append(p);
      const allowed=card.pinMode==='any'?E.crop(card,a.state.firstPose):card.fixedPin!==undefined?[card.fixedPin]:card.first;
      for(const id of allowed){const b=document.createElement('button');b.type='button';b.dataset.pinId=String(id);b.textContent=L.scenes[id];pins.append(b);}
      pins.hidden=false;
    }
    const undo=battle.querySelector('[data-act="undo"]'),lens=battle.querySelector('[data-act="lens"]');
    undo.hidden=!campaign||(!a&&state.index<24);undo.textContent=campaign?xt('undo'):'';
    undo.disabled=!(a?a.history.length&&a.state.phase!=='done':c?.history.length&&c.gate==='passed');
    lens.hidden=!a||!card.lensAllowed;lens.textContent=campaign?xt(a?.state.lensUsed?'lensUsed':'lens'):'';
    lens.disabled=!a||a.state.lensUsed||!['first','second'].includes(a.state.phase)||!card.lensAllowed;
    if(a){
      const phase=a.state.phase==='second'?'second':'first',goals=phase==='first'?card.first:card.second,avoid=phase==='first'?card.firstAvoid:card.avoid;
      $('targetText').textContent=goals.map(id=>L.scenes[id]).join(' · ');$('avoidText').textContent=avoid.map(id=>L.scenes[id]).join(' · ');
      const pending=card.waypoint===undefined?'':xt('waypointPending',{name:L.scenes[card.waypoint]});
      const dynamic=details(card).filter(value=>!a.state.waypointSeen||value!==pending);if(a.state.pin!==null)dynamic.push(xt('pinSelected',{name:L.scenes[a.state.pin]}));
      if(card.waypoint!==undefined&&a.state.waypointSeen)dynamic.push(xt('waypointSeen',{name:L.scenes[card.waypoint]}));
      $('cornerText').textContent=dynamic.join(' · ');
    }
    if(focusedAnswer)challenge.querySelector(`[data-answer="${focusedAnswer}"]`)?.focus({preventScroll:true});
    if(focusedPin)pins.querySelector(`[data-pin-id="${focusedPin}"]`)?.focus({preventScroll:true});
  }
  function renderPosition(){
    const {pose,index}=state,card=cards[index],inside=E.crop(card,pose),f=$('postcardFrame');
    Object.assign(f.style,{left:`${pose.x*25}%`,top:`${pose.y*100/3}%`,width:`${pose.w*25}%`,height:`${pose.h*100/3}%`});
    tiles.forEach((n,i)=>n.classList.toggle('pc-in-frame',inside.includes(card.cells[i])));
    $('positionText').textContent=t('position',{x:pose.x+1,y:pose.y+1,w:pose.w,h:pose.h});
    $('moveCount').textContent=String(state.moves);
    const blocked=state.chapterAttempt?.gate==='pending'||state.dualAttempt?.state.phase==='pin';
    for(const action of ['up','down','left','right','rotate'])battle.querySelector(`[data-act="${action}"]`).disabled=Boolean(blocked)||!E.step(card,pose,action);
    battle.querySelector('[data-act="capture"]').disabled=Boolean(blocked);
    battle.querySelector('[data-act="hint"]').disabled=Boolean(state.chapterAttempt?.gate==='pending');
    renderAuxiliary();
    $('sceneGrid').setAttribute('aria-label',`${t('card')} ${index+1}. ${$('targetText').textContent}. ${$('avoidText').textContent}`);
  }
  function startCard(index){
    window.WeightPlayAudio?.preload?.(['game.start','ui.tick','board.undo','feedback.hint','feedback.error','feedback.success','result.win'])?.catch(()=>{});
    index=Math.max(0,Math.min(cards.length-1,index));if(!isUnlocked(index))return;
    cancelMotion();audio?.stop();const card=cards[index];
    const chapterAttempt=campaign&&!card.dual?campaign.chapter.initial(index+1):null;
    const dualAttempt=card.dual?campaign.dual.newAttempt(index+1):null;
    const solution=dualAttempt?{distance:campaign.dual.shortest(index+1)}:chapterAttempt?campaign.chapter.solve(index+1):E.solve(card);
    if(!solution)throw new Error(`Unsolvable postcard ${index+1}`);
    const restarting=state.screen==='battle';
    state={screen:'battle',mode:'play',index,pose:{...card.start},moves:0,errors:0,hinted:false,par:Array.isArray(solution)?solution.length:solution.distance,chapterAttempt,dualAttempt,inputSequence:0};
    measurementStart(index,restarting);
    $('mainScreen').hidden=true;stage.hidden=true;showGuides(false);battle.hidden=false;if(reserve)reserve.hidden=false;$('resultPanel').hidden=true;$('leavePanel').hidden=true;
    $('battleContent').inert=false;frame.activate('battle');
    $('chapterName').textContent=chapterTitle(card);$('cardCount').textContent=`${index+1}/${cards.length}`;$('parCount').textContent=String(state.par);
    $('targetText').textContent=card.targets.map(i=>L.scenes[i]).join(' · ');$('avoidText').textContent=card.avoid.map(i=>L.scenes[i]).join(' · ');
    $('cornerText').textContent=campaign?details(card).join(' · '):card.corner===null?'':t('corner',{name:L.scenes[card.corner]});
    tiles.forEach((n,i)=>{const v=card.cells[i];window.PostcardCropAtlas.apply(n,v);n.firstChild.textContent=L.scenes[v];n.setAttribute('aria-label',L.scenes[v]);n.classList.remove('pc-wrong');});
    $('sceneGrid').setAttribute('aria-label',`${t('card')} ${index+1}. ${$('targetText').textContent}. ${$('avoidText').textContent}`);
    $('battleStatus').textContent=t('ready');renderPosition();fitBoard();
    tween($('tileLayer'),[{opacity:.3,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],320);
    sound('game.start');(state.chapterAttempt?.gate==='pending'?$('challengeArea').querySelector('button'):$('sceneGrid'))?.focus({preventScroll:true});
  }
  function action(name,viaHint=false){
    if(state.mode!=='play'||state.screen!=='battle')return false;
    if(state.dualAttempt){
      const action=name==='lens'||name==='undo'?{type:name}:{type:'move',direction:name};
      const r=campaign.dual.apply(state.dualAttempt,action,{sequence:++state.inputSequence});state.dualAttempt=r.attempt;syncAttempt();
      if(r.status==='journal-full'){$('battleStatus').textContent=xt('journalFull');return false;}
      if(r.status!=='applied')return false;
      tiles.forEach(n=>n.classList.remove('pc-wrong'));renderPosition();$('battleStatus').textContent=t('ready');
      if(name==='undo'&&r.attempt.state.phase==='pin')$('pinControls').querySelector('button')?.focus({preventScroll:true});
      if(!viaHint)sound(name==='undo'?'board.undo':'ui.tick');return true;
    }
    if(state.chapterAttempt){
      const action=name==='undo'?{type:'undo'}:{type:'move',direction:name},next=campaign.chapter.act(state.chapterAttempt,action);
      if(!next)return false;state.chapterAttempt=next;syncAttempt();tiles.forEach(n=>n.classList.remove('pc-wrong'));renderPosition();
      $('battleStatus').textContent=viaHint?t('hintStep',{action:t(name)}):t('ready');if(!viaHint)sound(name==='undo'?'board.undo':'ui.tick');return true;
    }
    const next=E.step(cards[state.index],state.pose,name);if(!next)return false;
    state.pose=next;state.moves++;tiles.forEach(n=>n.classList.remove('pc-wrong'));renderPosition();
    $('battleStatus').textContent=viaHint?t('hintStep',{action:t(name)}):t('ready');
    if(!viaHint)sound('ui.tick');return true;
  }
  function hint(){
    if(state.mode!=='play')return;
    if(state.dualAttempt){
      const r=campaign.dual.apply(state.dualAttempt,{type:'hint'},{sequence:++state.inputSequence});state.dualAttempt=r.attempt;syncAttempt();
      if(r.status==='journal-full'){$('battleStatus').textContent=xt('journalFull');return;}
      if(r.status==='unreachable'){$('battleStatus').textContent=xt('unreachable');return;}
      if(r.status!=='hint'){$('battleStatus').textContent=t('ready');return;}
      const a=r.hint.action;
      $('battleStatus').textContent=a.type==='pin'?`${xt('selectPinHint')} ${L.scenes[a.id]}`:a.type==='capture'?xt('captureHint'):a.type==='lens'?xt('lensHint'):xt('moveHint',{action:t(a.direction)});
      renderPosition();sound('feedback.hint');return;
    }
    if(state.chapterAttempt){
      const r=campaign.chapter.hint(state.chapterAttempt);state.chapterAttempt=r.attempt;syncAttempt();renderPosition();
      if(r.status==='unreachable')$('battleStatus').textContent=xt('unreachable');
      else if(r.status==='blocked')$('battleStatus').textContent=xt('questionPrompt');
      else if(r.status==='step'){$('battleStatus').textContent=t('hintStep',{action:t(r.action.direction)});sound('feedback.hint');}
      else $('battleStatus').textContent=t('ready');
      return;
    }
    const path=E.solve(cards[state.index],state.pose);
    if(!path?.length){$('battleStatus').textContent=t('ready');return;}
    state.hinted=true;if(action(path[0],true))sound('feedback.hint');
  }
  function result(){
    cancelMotion();state.mode='result';$('battleContent').inert=true;frame.activate('battle',{covered:true});$('resultPanel').hidden=false;
    const earned=E.stars(state.moves,state.par,state.errors,state.hinted);
    $('resultHeading').textContent=t(state.index===cards.length-1?'finished':'success');
    $('resultStars').textContent='★'.repeat(earned)+'☆'.repeat(3-earned);$('resultStars').setAttribute('aria-label',`${t('stars')} ${earned}/3`);
    $('resultText').textContent=t('result',state);$('albumProgress').textContent=progress();$('saveStatus').textContent=storageOK?'':t('saveFailed');
    const next=$('resultPanel').querySelector('[data-act="next"]');next.textContent=t('next');next.disabled=state.index>=cards.length-1||!isUnlocked(state.index+1);
    tween($('resultPanel').firstChild,[{opacity:0,transform:'translateY(18px) scale(.96)'},{opacity:1,transform:'translateY(0) scale(1)'}],330);(next.disabled?$('resultPanel').querySelector('[data-act="stages"]'):next).focus({preventScroll:true});
  }
  function settle(earned){
    state.mode='capturing';save.medals[state.index]=Math.max(save.medals[state.index],earned);persist();
    measurementComplete();
    $('battleStatus').textContent=t('success');sound(state.index===cards.length-1?'result.win':'feedback.success');
    tween($('captureLight'),[{opacity:0},{opacity:.28,offset:.3},{opacity:0}],360);
    tween($('tileLayer'),[{transform:'scale(1)'},{transform:'scale(.98)',offset:.4},{transform:'scale(1)'}],420);
    later(result,520);
  }
  function answerQuestion(choice){
    if(state.mode!=='play'||!state.chapterAttempt)return;
    const next=campaign.chapter.act(state.chapterAttempt,{type:'answer',choice});if(!next)return;
    state.chapterAttempt=next;syncAttempt();renderPosition();
    if(next.gate==='pending'){$('battleStatus').textContent=xt('answerWrong');sound('feedback.error');$('challengeArea').querySelector(`[data-answer="${choice}"]`)?.focus({preventScroll:true});}
    else {$('battleStatus').textContent=xt('answerCorrect');sound('ui.tick');$('sceneGrid').focus({preventScroll:true});}
  }
  function selectPin(id){
    if(state.mode!=='play'||!state.dualAttempt)return;
    const r=campaign.dual.apply(state.dualAttempt,{type:'pin',id},{sequence:++state.inputSequence});state.dualAttempt=r.attempt;syncAttempt();renderPosition();
    if(r.status==='journal-full'){$('battleStatus').textContent=xt('journalFull');return;}
    if(r.status!=='applied'){$('battleStatus').textContent=t('wrong');sound('feedback.error');$('pinControls').querySelector(`[data-pin-id="${id}"]`)?.focus({preventScroll:true});return;}
    $('battleStatus').textContent=xt('pinSelected',{name:L.scenes[id]});sound('ui.tick');$('sceneGrid').focus({preventScroll:true});
  }
  function capture(){
    if(state.mode!=='play')return;
    if(state.dualAttempt){
      const r=campaign.dual.apply(state.dualAttempt,{type:'capture'},{sequence:++state.inputSequence});state.dualAttempt=r.attempt;syncAttempt();renderPosition();
      if(r.status==='journal-full'){$('battleStatus').textContent=xt('journalFull');return;}
      if(r.status!=='applied'){$('battleStatus').textContent=t('wrong');if(r.status==='incorrect')sound('feedback.error');return;}
      if(r.attempt.state.phase==='done'){settle(campaign.dual.score(r.attempt));return;}
      $('battleStatus').textContent=xt('choosePin');$('pinControls').querySelector('button')?.focus({preventScroll:true});return;
    }
    if(state.chapterAttempt){
      const next=campaign.chapter.act(state.chapterAttempt,{type:'capture'});if(!next)return;
      state.chapterAttempt=next;syncAttempt();renderPosition();
      if(next.completed){settle(next.stars);return;}
      const check=E.evaluate(cards[state.index],state.pose);
      tiles.forEach((n,i)=>n.classList.toggle('pc-wrong',check.missing.includes(cards[state.index].cells[i])||check.unwanted.includes(cards[state.index].cells[i])));
      $('battleStatus').textContent=t('wrong');sound('feedback.error');tween($('tileLayer'),[{transform:'translateX(0)'},{transform:'translateX(-5px)'},{transform:'translateX(4px)'},{transform:'translateX(0)'}],220);return;
    }
    const check=E.evaluate(cards[state.index],state.pose);
    if(!check.ok){state.errors++;$('battleStatus').textContent=t('wrong');sound('feedback.error');
      tiles.forEach((n,i)=>n.classList.toggle('pc-wrong',check.missing.includes(cards[state.index].cells[i])||check.unwanted.includes(cards[state.index].cells[i])));
      tween($('tileLayer'),[{transform:'translateX(0)'},{transform:'translateX(-5px)'},{transform:'translateX(4px)'},{transform:'translateX(0)'}],220);return;}
    settle(E.stars(state.moves,state.par,state.errors,state.hinted));
  }
  function requestLeave(){
    if(state.mode==='result'){showStages();return;}if(state.mode!=='play')return;
    cancelMotion();previousFocus=document.activeElement;state.mode='leave';measurement.paused=true;notifyMeasurement();$('battleContent').inert=true;frame.activate('battle',{covered:true});$('leavePanel').hidden=false;
    tween($('leavePanel').firstChild,[{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],180);
    $('leavePanel').querySelector('[data-act="stay"]').focus({preventScroll:true});
  }
  function stay(){if(state.mode!=='leave')return;$('leavePanel').hidden=true;state.mode='play';measurement.paused=false;notifyMeasurement();$('battleContent').inert=false;frame.activate('battle');(previousFocus?.isConnected?previousFocus:$('sceneGrid')).focus({preventScroll:true});}
  on($('app'),'click',event=>{
    const answer=event.target.closest('[data-answer]'),pin=event.target.closest('[data-pin-id]');
    if(answer||pin){if(event.detail>1)return;if(answer)answerQuestion(answer.dataset.answer);else selectPin(Number(pin.dataset.pinId));return;}
    const node=event.target.closest('[data-act]');if(!node||node.disabled)return;
    const name=node.dataset.act;
    if(event.detail>1&&['result','leave'].includes(state.mode))return;
    if(name==='start'&&state.screen==='main')showStages();
    else if(name==='stageBack'&&state.screen==='stage')showMain();
    else if(name==='stagesTab'&&state.screen==='stage')stageUI.refresh(browseIndex);
    else if(name==='back')requestLeave();else if(name==='capture')capture();else if(name==='hint')hint();
    else if(name==='reset'&&state.mode==='play')startCard(state.index);
    else if(name==='replay'&&state.mode==='result')startCard(state.index);
    else if(name==='next'&&state.mode==='result'&&state.index<cards.length-1)startCard(state.index+1);
    else if(name==='stages'&&state.mode==='result')showStages();
    else if(name==='leave'&&state.mode==='leave')showStages(state.index);
    else if(name==='stay')stay();else action(name);
  });
  on(document,'keydown',event=>{
    if(event.defaultPrevented||event.ctrlKey||event.altKey||event.metaKey)return;
    if(event.repeat){if(event.key==='Enter'||event.key===' ')event.preventDefault();return;}
    const modal=state.mode==='leave'?$('leavePanel'):state.mode==='result'?$('resultPanel'):null;
    if(modal){
      if(event.key==='Escape'&&state.mode==='leave'){event.preventDefault();stay();return;}
      if(event.key==='Tab'){const list=[...modal.querySelectorAll('button:not([disabled])')];const i=list.indexOf(document.activeElement);if(event.shiftKey&&i<=0){event.preventDefault();list.at(-1).focus();}else if(!event.shiftKey&&(i<0||i===list.length-1)){event.preventDefault();list[0].focus();}}
      return;
    }
    if(state.screen!=='battle'||state.mode!=='play')return;
    if(event.target.closest('[data-wp-preferences],select,input,textarea'))return;
    if(event.key==='Escape'){event.preventDefault();requestLeave();return;}
    // Do not hijack Enter/Space from a focused native button.
    if(event.target!==$('sceneGrid')&&!event.target.closest('.pc-scene'))return;
    const directions={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down',r:'rotate',R:'rotate'};
    if(directions[event.key]){event.preventDefault();action(directions[event.key]);}
    else if(event.key==='Enter'){event.preventDefault();capture();}
  });
  on($('sceneGrid'),'pointerdown',event=>{if(event.button!==0||!event.isPrimary||state.mode!=='play')return;gesture={id:event.pointerId,x:event.clientX,y:event.clientY};event.currentTarget.setPointerCapture(event.pointerId);event.currentTarget.focus({preventScroll:true});});
  on($('sceneGrid'),'pointerup',event=>{if(!gesture||gesture.id!==event.pointerId)return;const g=gesture;gesture=null;const dx=event.clientX-g.x,dy=event.clientY-g.y;const threshold=Math.max(12,$('sceneGrid').getBoundingClientRect().width/24);if(Math.max(Math.abs(dx),Math.abs(dy))<threshold)return;action(Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up');});
  for(const event of ['pointercancel','lostpointercapture'])on($('sceneGrid'),event,()=>{gesture=null;});
  function pauseMotion(){const pending=state.mode==='capturing';cancelMotion();audio?.stop();if(pending)result();}
  on(document,'visibilitychange',()=>{if(document.hidden)pauseMotion();});
  on(window,'pagehide',event=>{pauseMotion();if(!event.persisted){resize.disconnect();stageUI.destroy();frame.destroy();audio?.dispose();abort.abort();}});
  on(reduce,'change',()=>{pauseMotion();renderPosition();});
  $('mainProgress').textContent=progress();frame.activate('main');$('app').dataset.pcReady=campaign?'v9-i9':'v8-i9';
  // Canonical entry is locale-neutral; explicit localized routes always win over saved preferences.
  if(pathLocale<0&&/^https?:$/.test(location.protocol)&&!['localhost','127.0.0.1','[::1]'].includes(location.hostname)){
    const url=new URL(location.href);url.pathname=`/${routeNames[keys.indexOf(locale)]}/games/animal-postcard-crop/`;url.searchParams.delete('lang');location.replace(url.href);
  }
})();
